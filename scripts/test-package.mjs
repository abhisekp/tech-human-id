import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(join(root, "work"), { recursive: true });
const scratch = await mkdtemp(join(root, "work", "package-test-"));
const npmCli = process.env.npm_execpath?.endsWith("npm-cli.js")
  ? process.env.npm_execpath
  : join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
const env = { ...process.env, HUSKY: "0", npm_config_cache: join(scratch, "npm-cache") };
const npm = (args, cwd = root) =>
  execFileSync(process.execPath, [npmCli, ...args], {
    cwd,
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
const [packed] = JSON.parse(npm(["pack", "--json", "--ignore-scripts", "--pack-destination", scratch]));
const archive = join(scratch, packed.filename);
const files = new Set(packed.files.map((file) => file.path));
for (const file of [
  "LICENSE",
  "README.md",
  "dist/index.cjs",
  "dist/index.mjs",
  "dist/index.js",
  "dist/cli.js",
  "dist/index.d.ts",
  "dist/index.d.cts",
  "dist/index.d.mts",
  "index.ts",
  "data/adjectives.ts",
]) {
  assert(files.has(file), "Missing package file: " + file);
}
assert(!files.has("humanId.test.ts"), "Tests should not be published");
await writeFile(join(scratch, "package.json"), JSON.stringify({ private: true }));
npm(["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund", archive], scratch);
const consumerRequire = createRequire(join(scratch, "package.json"));
const installed = consumerRequire("tech-human-id/package.json");
assert.equal(Object.keys(installed.dependencies ?? {}).length, 0);
assert.equal(installed.bin["tech-human-id"], "./dist/cli.js");

const check = `
const assert = require("node:assert/strict");
const lib = require("tech-human-id");
assert.equal(lib.poolSize(), 1080000);
assert.equal(lib.poolSize({adjectiveCount:0}), 14400);
assert.equal(lib.poolSize({adjectiveCount:2,addAdverb:true}), 4779000000);
assert.equal(lib.minLength(), 10);
assert.equal(lib.maxLength(), 37);
assert.equal(lib.default, lib.humanId);
assert.equal(lib.humanId({adjectiveCount:0,separator:"-"}).split("-").length, 2);
assert.equal(require("tech-human-id/dist/index.js").poolSize(), 1080000);
for (const name of ["adjectives","nouns","verbs","adverbs"]) {
  assert.equal(lib[name].length, new Set(lib[name]).size);
}
`;
execFileSync(process.execPath, ["-e", check], { cwd: scratch, env, stdio: "inherit" });
execFileSync(
  process.execPath,
  [
    "--input-type=module",
    "-e",
    `
import assert from "node:assert/strict";
import humanId, {poolSize, maxLength} from "tech-human-id";
assert.equal(typeof humanId, "function");
assert.equal(poolSize(), 1080000);
assert.equal(maxLength(), 37);
assert.equal(humanId("-").split("-").length, 3);
`,
  ],
  { cwd: scratch, env, stdio: "inherit" },
);

const tsConsumer = `import humanId, { humanId as named, poolSize, type Options } from "tech-human-id";
const options: Options = { separator: "-", adjectiveCount: 2, addAdverb: true };
const result: string = humanId(options);
result.toUpperCase();
named(false).toUpperCase();
poolSize(options).toFixed();
`;
await writeFile(join(scratch, "consumer.mts"), tsConsumer);
await writeFile(join(scratch, "consumer.cts"), tsConsumer);
execFileSync(
  process.execPath,
  [
    require.resolve("typescript/bin/tsc"),
    "--ignoreConfig",
    "--strict",
    "--noEmit",
    "--target",
    "ES2015",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "consumer.mts",
    "consumer.cts",
  ],
  { cwd: scratch, env, stdio: "inherit" },
);
const browser = await build({
  absWorkingDir: scratch,
  stdin: { contents: 'import humanId from "tech-human-id"; globalThis.generated = humanId("-");', resolveDir: scratch },
  bundle: true,
  platform: "browser",
  format: "iife",
  write: false,
});
const browserContext = {};
runInNewContext(browser.outputFiles[0].text, browserContext);
assert.equal(browserContext.generated.split("-").length, 3);

const cli = consumerRequire.resolve("tech-human-id/dist/cli.js");
const invoke = (args) => spawnSync(process.execPath, [cli, ...args], { cwd: scratch, env, encoding: "utf8" });
const output = npm(["exec", "--offline", "--", "tech-human-id", "adverb", "lower", "2", "_", "3x"], scratch)
  .trim()
  .split(/\r?\n/);
assert.equal(output.length, 3);
for (const id of output) assert.match(id, /^[a-z]+(?:_[a-z]+){4}$/);
assert.equal(invoke(["0", "-", "2x"]).stdout.trim().split(/\r?\n/).length, 2);
assert.equal(invoke(["0x"]).stdout, "");
assert.match(invoke(["--help"]).stdout, /Usage: tech-human-id/);
assert.equal(invoke(["--version"]).stdout.trim(), installed.version);
assert.match(invoke(["x"]).stdout.trim(), /^[A-Z][a-z]+x[A-Z][a-z]+x[A-Z][a-z]+$/);
for (const args of [["--unknown"], ["-1"], ["1.5"], ["badx"], ["9007199254740993x"], ["4294967296", "0x"]]) {
  const result = invoke(args);
  assert.equal(result.status, 1, "Invalid CLI argument accepted: " + args);
  assert.equal(result.stdout, "");
  assert(!result.stderr.includes(" at "), "Expected a concise error, not a stack trace");
}
console.log(
  "Packed installation passed: CommonJS, ESM, TypeScript, browser bundle, executable and argument validation.",
);
