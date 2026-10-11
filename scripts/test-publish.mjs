import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compareVersions, planRelease, stableVersion } from "./release-policy.mjs";
import { publishPackage } from "./publish-package.mjs";

const config = { baselineMajor: 5, majorUpgrades: {} };
const registry = { "dist-tags": { latest: "5.0.7" }, versions: { "5.0.7": {} } };
const plan = (overrides) => planRelease({ version: "5.0.8", branch: "master", registry, config, ...overrides });
assert.equal(plan().distTag, "latest");
assert.equal(plan().channel, "latest-5");
assert.throws(() => plan({ version: "6.0.0" }), /non-breaking compatibility/);
assert.throws(() => plan({ branch: "feature" }), /matching major/);
assert.throws(() => plan({ branch: "6.x" }), /matching major/);
for (const invalid of ["5.0.8-beta.1", "05.0.8", "5.0", "5.0.8\n", "9007199254740992.0.0"]) {
  assert.throws(() => stableVersion(invalid));
}
assert.equal(compareVersions("5.0.10", "5.0.9"), 1);
const upgradeConfig = {
  baselineMajor: 5,
  majorUpgrades: {
    6: { previousVersion: "5.0.7", compatibilityVersion: "5.0.8", maintenanceBranch: "5.x" },
  },
};
const upgradedRegistry = {
  "dist-tags": { latest: "6.0.0", "latest-5": "5.0.8" },
  versions: { "5.0.7": {}, "5.0.8": {}, "6.0.0": {} },
};
const maintenance = () => ({ version: "5.0.9", publishedTag: "5.0.8" });
assert.throws(() => plan({ version: "6.0.0", config: upgradeConfig, maintenance }), /Publish the compatibility/);
assert.equal(
  plan({ version: "6.0.1", registry: upgradedRegistry, config: upgradeConfig, maintenance }).distTag,
  "latest",
);
assert.throws(
  () =>
    plan({
      version: "6.0.1",
      registry: upgradedRegistry,
      config: upgradeConfig,
      maintenance: () => ({ version: "6.0.0", publishedTag: "5.0.8" }),
    }),
  /Keep the previous major/,
);
assert.throws(
  () =>
    plan({
      version: "6.0.1",
      registry: upgradedRegistry,
      config: {
        baselineMajor: 5,
        majorUpgrades: { 6: { previousVersion: "5.0.8", compatibilityVersion: "5.0.7", maintenanceBranch: "5.x" } },
      },
      maintenance,
    }),
  /upgrade the previous major/,
);
const backport = plan({ version: "5.0.9", branch: "5.x", registry: upgradedRegistry });
assert.equal(backport.distTag, "latest-5");
assert.equal(backport.updateLatest, false);
const old = plan({ version: "5.0.7", branch: "5.x", registry: upgradedRegistry });
assert.equal(old.updateLatest, false);
assert.equal(old.updateMajor, false);
assert.throws(() => plan({ version: "5.0.9", registry: upgradedRegistry }), /matching maintenance branch/);
const oldMissing = plan({ version: "5.0.6", branch: "5.x", registry: upgradedRegistry });
assert.equal(oldMissing.distTag, "release-5.0.6");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(join(root, "work"), { recursive: true });
const fixture = await mkdtemp(join(root, "work", "publish-test-"));
await mkdir(join(fixture, "package"));
await writeFile(
  join(fixture, "package", "package.json"),
  JSON.stringify({
    name: "tech-human-id",
    version: "5.0.8",
    repository: { url: "git+https://github.com/abhisekp/tech-human-id.git" },
  }),
);
const archive = join(fixture, "package.tgz");
execFileSync("tar", ["-czf", archive, "-C", fixture, "package"]);
const calls = [];
const publish = (overrides) =>
  publishPackage({
    archive,
    version: "5.0.8",
    branch: "master",
    registry,
    config,
    npm: (args) => calls.push(args),
    ...overrides,
  });
publish({ dryRun: true });
assert.equal(calls.length, 1);
assert(calls[0].includes("--dry-run"));
assert(calls[0].includes("--ignore-scripts"));
assert(calls[0].includes("--provenance"));
calls.length = 0;
publish({});
assert.equal(calls[0][0], "publish");
assert.deepEqual(
  calls.slice(1).map((args) => args[3]),
  ["latest-5", "latest"],
);
calls.length = 0;
const integrity =
  "sha512-" +
  createHash("sha512")
    .update(await readFile(archive))
    .digest("base64");
const existingRegistry = { ...registry, versions: { ...registry.versions, "5.0.8": { dist: { integrity } } } };
publish({ registry: existingRegistry });
assert.equal(calls.length, 2);
assert(calls.every((args) => args[0] === "dist-tag"));
calls.length = 0;
assert.throws(
  () =>
    publish({ registry: { ...registry, versions: { "5.0.7": {}, "5.0.8": { dist: { integrity: "different" } } } } }),
  /different archive contents/,
);
assert.equal(calls.length, 0);
assert.throws(() => publish({ version: "5.0.9" }), /Archive identity/);
assert.equal(calls.length, 0);
assert.throws(() => publish({ preview: true }), /previews cannot publish/);
assert.equal(calls.length, 0);
publish({
  registry: { ...registry, versions: { ...registry.versions, "5.0.8": { dist: { integrity: "different" } } } },
  preview: true,
  dryRun: true,
});
assert.equal(calls.length, 1);
assert.equal(calls[0][0], "pack");
assert(calls[0].includes("--dry-run"));
assert(calls[0].includes("--ignore-scripts"));
calls.length = 0;
publish({ preview: true, dryRun: true });
assert.equal(calls.length, 1);
assert.equal(calls[0][0], "publish");
assert(calls[0].includes("--dry-run"));
console.log(
  "Publish checks passed: compatibility gate, independent major channels, no downgrades, exact archive identity, safe retries and credential-free dry runs.",
);
