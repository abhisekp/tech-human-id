import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyRelease } from "./verify-release.mjs";
import { maintenanceState } from "./release-policy.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(join(root, "work"), { recursive: true });
const repo = await mkdtemp(join(root, "work", "release-test-"));
const git = (...args) =>
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Release test",
      "-c",
      "user.email=release-test@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "tag.gpgSign=false",
      "-c",
      "tag.forceSignAnnotated=false",
      ...args,
    ],
    { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
git("init", "-b", "master");
await writeFile(join(repo, "package.json"), JSON.stringify({ version: "5.0.7" }));
git("add", "package.json");
git("commit", "-m", "Merged version");
const merged = git("rev-parse", "HEAD");
git("update-ref", "refs/remotes/origin/master", merged);
git("tag", "v5.0.7");
assert.equal(verifyRelease("v5.0.7", repo), merged);
git("tag", "v5.0.9");
assert.throws(() => verifyRelease("v5.0.9", repo), /tag must equal/);
assert.throws(() => verifyRelease("v5.0.9", repo, true), /tag must equal/);
assert.throws(() => verifyRelease("--help", repo), /tag must equal/);
git("switch", "-c", "unmerged");
await writeFile(join(repo, "package.json"), JSON.stringify({ version: "5.0.8" }));
git("add", "package.json");
git("commit", "-m", "Unmerged version");
git("tag", "v5.0.8");
assert.throws(() => verifyRelease("v5.0.8", repo), /merged into origin\/master/);
assert.throws(() => verifyRelease("v5.0.8", repo, true), /merged into origin\/master/);
assert.equal(git("rev-parse", "HEAD"), git("rev-parse", "refs/tags/v5.0.8"));
git("update-ref", "refs/remotes/origin/master", "HEAD");
assert.equal(verifyRelease("v5.0.8", repo), git("rev-parse", "HEAD"));
git("commit", "--allow-empty", "-m", "Wrong checkout");
assert.throws(() => verifyRelease("v5.0.8", repo), /commit must match/);
const latest = git("rev-parse", "HEAD");
assert.equal(verifyRelease("v5.0.8", repo, true), git("rev-parse", "refs/tags/v5.0.8"));
assert.equal(git("rev-parse", "HEAD"), git("rev-parse", "refs/tags/v5.0.8"));
git("checkout", "--detach", latest);
assert.equal(verifyRelease("v5.0.7", repo, true), merged);
assert.equal(git("rev-parse", "HEAD"), merged);
git("switch", "-c", "5.x");
await writeFile(join(repo, "package.json"), JSON.stringify({ version: "5.0.9" }));
git("add", "package.json");
git("commit", "-m", "Independent non-breaking maintenance release");
const maintenance = git("rev-parse", "HEAD");
git("tag", "v5.0.9", "--force");
git("update-ref", "refs/remotes/origin/5.x", maintenance);
assert.equal(verifyRelease("v5.0.9", repo, false, "5.x"), maintenance);
assert.throws(() => verifyRelease("v5.0.9", repo), /merged into origin\/master/);
assert.throws(() => verifyRelease("v5.0.9", repo, false, "6.x"), /matching major/);
git("checkout", "--detach", latest);
assert.equal(verifyRelease("v5.0.9", repo, true, "5.x"), maintenance);
assert.deepEqual(maintenanceState("5.x", "5.0.9", repo), { version: "5.0.9", publishedTag: "5.0.9" });
assert.throws(() => maintenanceState("5.x", "5.0.8", repo), /merged tag/);
console.log(
  "Release checks passed: merged primary and independent maintenance tags accepted; wrong versions, branches, unmerged commits and mismatched checkouts rejected.",
);
