import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const tag = "v" + version;
if (!/^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(tag)) throw new Error("Invalid package version");
const git = (args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
if (git(["rev-parse", "HEAD"]) !== git(["rev-parse", "refs/remotes/origin/master"])) {
  throw new Error("Only the current master commit can create a release tag");
}
try {
  git(["rev-parse", "--verify", "refs/tags/" + tag]);
  console.log(tag + " already exists; no tag created.");
} catch {
  git(["-c", "tag.gpgSign=false", "-c", "tag.forceSignAnnotated=false", "tag", tag]);
  git(["push", "origin", "refs/tags/" + tag]);
  console.log("Created " + tag + ". Run Publish Node.js Package manually for this tag to publish.");
}
