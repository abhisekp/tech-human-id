import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { packageName, planRelease, readRegistry, registryUrl } from "./release-policy.mjs";

export function publishPackage({
  archive,
  version,
  branch,
  registry,
  config,
  dryRun = false,
  preview = false,
  maintenance,
  npm,
}) {
  if (preview && !dryRun) throw new Error("Pull-request previews cannot publish");
  const metadata = JSON.parse(execFileSync("tar", ["-xOf", archive, "package/package.json"], { encoding: "utf8" }));
  if (
    metadata.name !== packageName ||
    metadata.version !== version ||
    metadata.repository?.url !== "git+https://github.com/abhisekp/tech-human-id.git"
  ) {
    throw new Error("Archive identity does not match the validated release");
  }
  const plan = planRelease({ version, branch, registry, config, maintenance });
  if (plan.existing && !preview) {
    const integrity = "sha512-" + createHash("sha512").update(readFileSync(archive)).digest("base64");
    if (plan.existing.dist?.integrity !== integrity)
      throw new Error("This version is already published with different archive contents");
    console.log(version + " is already published with the same archive; repairing channels only.");
  } else {
    const args = [
      "publish",
      archive,
      "--access",
      "public",
      "--tag",
      plan.distTag,
      "--registry",
      registryUrl,
      "--provenance",
      "--ignore-scripts",
    ];
    if (dryRun) args.push("--dry-run");
    npm(args);
  }
  // Older reruns must never move latest or a major's channel backwards.
  const channels = [...(plan.updateMajor ? [plan.channel] : []), ...(plan.updateLatest ? ["latest"] : [])];
  for (const channel of channels) {
    if (registry["dist-tags"]?.[channel] === version) continue;
    if (dryRun) console.log("Would set " + channel + " to " + version);
    else npm(["dist-tag", "add", packageName + "@" + version, channel, "--registry", registryUrl]);
  }
  console.log((dryRun ? "Dry run passed for " : "Published or verified ") + packageName + "@" + version);
  return plan;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = readdirSync("release").filter((file) => file.endsWith(".tgz"));
  if (files.length !== 1) throw new Error("Expected exactly one validated package archive");
  // No token fallback: only the publishing job receives an OIDC identity.
  const env = { ...process.env };
  delete env.NODE_AUTH_TOKEN;
  delete env.NPM_TOKEN;
  const plan = publishPackage({
    archive: resolve("release", files[0]),
    version: process.env.RELEASE_VERSION,
    branch: process.env.RELEASE_BRANCH,
    registry: await readRegistry(),
    config: JSON.parse(readFileSync("release.config.json", "utf8")),
    dryRun: process.env.DRY_RUN === "true",
    preview: process.env.GITHUB_EVENT_NAME === "pull_request",
    npm: (args) => {
      if (process.platform === "win32") {
        if (!process.env.npm_execpath) throw new Error("On Windows, run the publisher through npm");
        execFileSync(process.execPath, [process.env.npm_execpath, ...args], { env, stdio: "inherit" });
      } else execFileSync("npm", args, { env, stdio: "inherit" });
    },
  });
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, "latest=" + plan.updateLatest + "\n");
}
