import { execFileSync } from "node:child_process";

export const packageName = "tech-human-id";
export const registryUrl = "https://registry.npmjs.org";

export function stableVersion(version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? "")) {
    throw new Error("Releases require a stable version such as 5.0.8");
  }
  const parts = version.split(".").map(Number);
  if (!parts.every(Number.isSafeInteger)) throw new Error("Invalid version numbers");
  return parts;
}

export function compareVersions(left, right) {
  const a = stableVersion(left);
  const b = stableVersion(right);
  for (let index = 0; index < 3; index++) if (a[index] !== b[index]) return Math.sign(a[index] - b[index]);
  return 0;
}

export function releaseBranch(branch, version) {
  const [major] = stableVersion(version);
  if (branch !== "master" && branch !== major + ".x") {
    throw new Error("A release must use master or its matching major maintenance branch, e.g. 5.x");
  }
  return branch;
}

export function maintenanceState(branch, version, root = process.cwd()) {
  const git = (args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  try {
    const current = JSON.parse(git(["show", "refs/remotes/origin/" + branch + ":package.json"])).version;
    const tag = "refs/tags/v" + version;
    const tagged = JSON.parse(git(["show", tag + ":package.json"])).version;
    git(["merge-base", "--is-ancestor", tag, "refs/remotes/origin/" + branch]);
    return { version: current, publishedTag: tagged };
  } catch {
    throw new Error("The compatibility version needs a merged tag on " + branch);
  }
}

export function planRelease({ version, branch, registry, config, maintenance = maintenanceState }) {
  const [major] = stableVersion(version);
  releaseBranch(branch, version);
  const versions = Object.keys(registry.versions ?? {}).filter((candidate) =>
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(candidate),
  );
  const latest = registry["dist-tags"]?.latest;
  if (!latest || !versions.includes(latest)) throw new Error("Registry latest must be a published stable version");
  const highestMajor = Math.max(...versions.map((candidate) => stableVersion(candidate)[0]));
  if (major < highestMajor && branch !== major + ".x") {
    throw new Error("Older majors must release from their matching maintenance branch");
  }
  if (!Number.isSafeInteger(config.baselineMajor) || config.baselineMajor < 0)
    throw new Error("Invalid release policy baseline");
  if (major < config.baselineMajor) throw new Error("Release version predates the maintained baseline");
  if (major > config.baselineMajor) {
    const upgrade = config.majorUpgrades?.[major];
    if (!upgrade) throw new Error("A major upgrade requires a published non-breaking compatibility release first");
    const previousMajor = major - 1;
    if (
      stableVersion(upgrade.previousVersion)[0] !== previousMajor ||
      stableVersion(upgrade.compatibilityVersion)[0] !== previousMajor ||
      compareVersions(upgrade.compatibilityVersion, upgrade.previousVersion) <= 0 ||
      upgrade.maintenanceBranch !== previousMajor + ".x"
    ) {
      throw new Error("Compatibility release must upgrade the previous major on its maintenance branch");
    }
    if (!registry.versions[upgrade.compatibilityVersion])
      throw new Error("Publish the compatibility release before the major release");
    const state = maintenance(upgrade.maintenanceBranch, upgrade.compatibilityVersion);
    if (
      stableVersion(state.version)[0] !== previousMajor ||
      compareVersions(state.version, upgrade.compatibilityVersion) < 0 ||
      state.publishedTag !== upgrade.compatibilityVersion
    ) {
      throw new Error("Keep the previous major and its compatibility tag on the maintenance branch");
    }
  }
  const sameMajor = versions.filter((candidate) => stableVersion(candidate)[0] === major);
  const newestInMajor = sameMajor.sort(compareVersions).at(-1);
  const updateMajor = !newestInMajor || compareVersions(version, newestInMajor) >= 0;
  const updateLatest = major >= highestMajor && compareVersions(version, latest) >= 0;
  return {
    version,
    branch,
    distTag: updateLatest ? "latest" : updateMajor ? "latest-" + major : "release-" + version,
    channel: "latest-" + major,
    updateLatest,
    updateMajor,
    existing: registry.versions[version] ?? null,
  };
}

export async function readRegistry() {
  const response = await fetch(registryUrl + "/" + packageName, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error("Cannot read the npm registry: HTTP " + response.status);
  return response.json();
}
