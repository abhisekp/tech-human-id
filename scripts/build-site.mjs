import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { format, resolveConfig } from "prettier";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "_site");
if (dirname(output) !== root) throw new Error("Invalid site directory");
await build({
  absWorkingDir: root,
  entryPoints: ["index.ts"],
  outfile: "site/library.mjs",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2015",
  minify: true,
});
const lib = await import(pathToFileURL(resolve(root, "site/library.mjs")).href);
const { version } = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const html = await readFile(resolve(root, "index.html"), "utf8");
const stamped = html
  .replace(/(<span class="version-badge" id="version">)v[^<]+/, "$1v" + version)
  .replace(/(<strong id="pool">)[^<]+/, "$1" + lib.poolSize().toLocaleString("en-US"))
  .replace(/(<strong id="length">)[^<]+/, "$1" + lib.minLength() + "–" + lib.maxLength())
  .replace(
    /The default word lists contain [\s\S]*?The playground calculates\s+the pool for your settings\./,
    "The default word lists contain " +
      lib.adjectives.length +
      " adjectives, " +
      lib.nouns.length +
      " tech nouns, and " +
      lib.verbs.length +
      " verbs: " +
      lib.poolSize().toLocaleString("en-US") +
      " word combinations. Each extra adjective multiplies the pool by " +
      lib.adjectives.length +
      "; an adverb multiplies it by " +
      lib.adverbs.length +
      ". The playground calculates the pool for your settings.",
  );
const formatted = await format(stamped, {
  ...(await resolveConfig(resolve(root, "index.html"), { editorconfig: true })),
  parser: "html",
});
await writeFile(resolve(root, "index.html"), formatted);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "site"), resolve(output, "site"), { recursive: true });
await writeFile(resolve(output, "index.html"), formatted);
await cp(resolve(root, "CNAME"), resolve(output, "CNAME"));
await writeFile(resolve(output, ".nojekyll"), "");
console.log("GitHub Pages site built in _site/");
