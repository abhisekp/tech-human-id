import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { releaseBranch, stableVersion } from "./release-policy.mjs";

export function verifyRelease(tag, root = process.cwd(), checkout = false, branch = "master") {
  if (!/^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(tag ?? "")) {
    throw new Error("The release tag must equal a valid package version tag");
  }
  const git = (args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const head = git(["rev-parse", "HEAD"]);
  const target = git(["rev-parse", "--verify", "refs/tags/" + tag + "^{commit}"]);
  const { version } = JSON.parse(
    checkout ? git(["show", target + ":package.json"]) : readFileSync(resolve(root, "package.json"), "utf8"),
  );
  if (tag !== "v" + version) throw new Error("The release tag must equal v" + version);
  stableVersion(version);
  releaseBranch(branch, version);
  if (!checkout && target !== head) throw new Error("The checked-out commit must match the release tag");
  try {
    git(["merge-base", "--is-ancestor", target, "refs/remotes/origin/" + branch]);
  } catch {
    throw new Error("The release commit must be merged into origin/" + branch);
  }
  if (checkout) git(["checkout", "--detach", target]);
  console.log("Verified " + tag + " at " + target + " is merged into " + branch);
  return target;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 4 || (process.argv[3] && process.argv[3] !== "--checkout")) {
      throw new Error("Usage: verify-release.mjs <version-tag> [--checkout]");
    }
    verifyRelease(process.argv[2], process.cwd(), process.argv[3] === "--checkout");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
