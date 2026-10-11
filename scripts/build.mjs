import { build, context } from "esbuild";
import { chmod, copyFile, readFile, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
// The deletion target is the fixed dist directory directly inside this repository.
if (dirname(output) !== root) throw new Error("Invalid build directory");

const watch = process.argv.includes("--watch");
if (!watch) await rm(output, { recursive: true, force: true });
if (process.argv.includes("--clean-only")) process.exit(0);

const shared = { absWorkingDir: root, bundle: true, sourcemap: true, target: "es2015", logLevel: "info" };
const cliVersion = {
  name: "cli-package-version",
  setup(build) {
    build.onLoad({ filter: /[\\/]package\.json$/ }, async ({ path }) => {
      if (path !== resolve(root, "package.json")) return;
      // Keep development dependency changes out of the tracked CLI source map.
      const { version } = JSON.parse(await readFile(path, "utf8"));
      return { contents: JSON.stringify({ version }), loader: "json", watchFiles: [path] };
    });
  },
};
const targets = [
  { ...shared, entryPoints: ["index.ts"], outfile: "dist/index.cjs", platform: "node", format: "cjs" },
  { ...shared, entryPoints: ["index.ts"], outfile: "dist/index.mjs", platform: "neutral", format: "esm" },
  // Keep the legacy browser/deep-import path as a self-contained CommonJS bundle.
  { ...shared, entryPoints: ["index.ts"], outfile: "dist/index.js", platform: "browser", format: "cjs" },
  {
    ...shared,
    entryPoints: ["cli.ts"],
    outfile: "dist/cli.js",
    platform: "node",
    format: "cjs",
    plugins: [cliVersion],
  },
  { ...shared, entryPoints: ["examples.ts"], outfile: "dist/examples.js", platform: "node", format: "cjs" },
];

async function declarations() {
  execFileSync(process.execPath, [require.resolve("typescript/bin/tsc"), "-p", "tsconfig.build.json"], {
    cwd: root,
    stdio: "inherit",
  });
  await copyFile(resolve(output, "index.d.ts"), resolve(output, "index.d.cts"));
  await copyFile(resolve(output, "index.d.ts"), resolve(output, "index.d.mts"));
}

if (watch) {
  // Keep JavaScript and declaration output in sync after each library rebuild.
  for (const [index, target] of targets.entries()) {
    const plugins =
      index === 0
        ? [
            {
              name: "declarations",
              setup(build) {
                build.onEnd(async (result) => {
                  if (result.errors.length === 0) await declarations();
                });
              },
            },
          ]
        : [];
    const ctx = await context({ ...target, plugins: [...(target.plugins ?? []), ...plugins] });
    await ctx.watch();
  }
} else {
  await Promise.all(targets.map((target) => build(target)));
  await declarations();
  await chmod(resolve(output, "cli.js"), 0o755);
}
