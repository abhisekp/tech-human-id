import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { inferReleaseBranch, verifyRelease } from "./verify-release.mjs";
import { planRelease, readRegistry, releaseBranch } from "./release-policy.mjs";

const git = (args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const type = process.env.GITHUB_EVENT_NAME;
const controller = git(["rev-parse", "HEAD"]);
const config = JSON.parse(readFileSync("release.config.json", "utf8"));
let tag;
let branch;
const dryRun = type === "pull_request" || event.inputs?.dry_run === "true" || event.inputs?.dry_run === true;
if (type === "pull_request") {
  branch = event.pull_request.base.ref;
  const { version } = JSON.parse(readFileSync("package.json", "utf8"));
  tag = "v" + version;
} else if (type === "workflow_run") {
  const run = event.workflow_run;
  if (
    run.conclusion !== "success" ||
    !["push", "workflow_dispatch"].includes(run.event) ||
    run.head_repository?.full_name !== process.env.GITHUB_REPOSITORY
  ) {
    throw new Error("Only successful release validation from this repository can publish");
  }
  branch = run.head_branch;
  if (!/^[a-f0-9]{40}$/.test(run.head_sha)) throw new Error("Invalid validated source commit");
  if (branch !== "master" && !/^(0|[1-9]\d*)\.x$/.test(branch)) throw new Error("Unsupported release branch");
  git(["merge-base", "--is-ancestor", run.head_sha, "refs/remotes/origin/" + branch]);
  const { version } = JSON.parse(git(["show", run.head_sha + ":package.json"]));
  tag = "v" + version;
} else if (type === "workflow_dispatch") {
  if (process.env.GITHUB_REF !== "refs/heads/master") throw new Error("Dispatch publishing from master");
  tag = event.inputs.tag;
  branch = event.inputs.branch;
} else if (type === "push" && process.env.GITHUB_REF?.startsWith("refs/tags/")) {
  tag = process.env.GITHUB_REF.slice("refs/tags/".length);
  if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag)) throw new Error("Invalid stable release tag");
  branch = inferReleaseBranch(tag);
} else {
  throw new Error("Unsupported release event");
}
if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag ?? "")) throw new Error("Invalid stable release tag");
const version = tag.slice(1);
releaseBranch(branch, version);
planRelease({ version, branch, registry: await readRegistry(), config });
const source = type === "pull_request" ? controller : verifyRelease(tag, process.cwd(), true, branch);
const values = { tag, branch, version, source, controller, dry_run: String(dryRun) };
if (!process.env.GITHUB_OUTPUT) throw new Error("GitHub output file is required");
for (const [key, value] of Object.entries(values)) appendFileSync(process.env.GITHUB_OUTPUT, key + "=" + value + "\n");
console.log("Prepared " + tag + " from " + branch + (dryRun ? " for a dry run" : " for publication"));
