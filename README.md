<h3 align="center">💃🆔</h3>

# Human-Readable Tech Identifiers

[![Downloads](https://img.shields.io/npm/dm/tech-human-id)](https://www.npmjs.com/package/tech-human-id)
[![License](https://img.shields.io/npm/l/tech-human-id)](https://github.com/abhisekp/tech-human-id/blob/master/LICENSE)
[![Checks](https://github.com/abhisekp/tech-human-id/actions/workflows/ci.yml/badge.svg)](https://github.com/abhisekp/tech-human-id/actions/workflows/ci.yml)

Readable identifiers made from tech words: `AgilePacketsConnect`, `BrightBackendsBuild`, or `ReliableSystemsSync`.

A tech-focused fork of [human-id](https://github.com/RienNeVaPlus/human-id), with zero runtime dependencies, CommonJS and ESM builds, browser support, and TypeScript declarations.

**[Try the interactive playground →](https://tech-human-id.js.org)**

## Install

```sh
npm install tech-human-id
# or: yarn add tech-human-id
# or: pnpm add tech-human-id
```

## Programmatic usage

```ts
import humanId, { poolSize, minLength, maxLength } from "tech-human-id";

// CommonJS:
// const { humanId, poolSize, minLength, maxLength } = require("tech-human-id");

humanId(); // e.g. AgilePacketsConnect
humanId("-"); // e.g. Bright-Backends-Build
humanId(false); // e.g. reliablesystemssync

humanId({ separator: "-", capitalize: false });
// e.g. agile-packets-connect

poolSize(); // 1,080,000 word combinations
minLength(); // 10
maxLength(); // 37
```

Examples are illustrative; each call randomly chooses words. The default recipe is `adjective + noun + verb`.

## Command line

```sh
npx tech-human-id
# e.g. AgilePacketsConnect

npx tech-human-id lowercase - 2x
# e.g. agile-packets-connect
#      bright-backends-build

npx tech-human-id adverb lower 2 _ 3x
# Three IDs, each with two adjectives, a noun, a verb, and an adverb

npx tech-human-id --help
npx tech-human-id --version
```

| Argument                   | Effect                                                       |
| -------------------------- | ------------------------------------------------------------ |
| `a`, `adverb`, `addAdverb` | Add an adverb                                                |
| `l`, `lower`, `lowercase`  | Use lowercase words                                          |
| `space`                    | Separate words with a space                                  |
| A non-negative integer     | Set adjective count; `0` generates a noun and verb           |
| A single character         | Set the separator, unless it is a reserved alias or a number |
| An integer followed by `x` | Generate that many IDs; `0x` prints none                     |
| `-h`, `--help`             | Show usage                                                   |
| `-v`, `--version`          | Show the package version                                     |

Aliases are case-insensitive. Unknown arguments and invalid counts print a concise error and exit with status 1. Use the JavaScript API for multi-character separators or reserved separator characters.

## Options and API

```ts
interface Options {
  separator?: string; // default: ""
  capitalize?: boolean; // default: true
  adjectiveCount?: number; // default: 1
  addAdverb?: boolean; // default: false
}
```

| Export                                                    | Behavior                                                                                                             |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `humanId(options?: Options \| string \| boolean): string` | Generate an ID. String shorthand sets the separator; boolean shorthand sets capitalization. Also the default export. |
| `poolSize(options?: Options): number`                     | Number of possible word combinations for these options.                                                              |
| `minLength(options?: Options): number`                    | Shortest possible ID length, including separators.                                                                   |
| `maxLength(options?: Options): number`                    | Longest possible ID length, including separators.                                                                    |
| `adjectives`, `nouns`, `verbs`, `adverbs`                 | Exported `string[]` word lists.                                                                                      |

Adjective count must be an integer from `0` to `2 ** 32 - 1`; invalid values throw `RangeError` in all four functions. Keep counts small enough for practical ID generation. Existing exported word arrays remain mutable for compatibility; statistics reflect their current contents.

The source lists contain 75 adjectives, 150 nouns, 96 verbs, and 59 adverbs. The default pool is `75 × 150 × 96 = 1,080,000`.

```ts
const options = {
  adjectiveCount: 2,
  addAdverb: true,
  separator: ".",
};

humanId(options); // e.g. Agile.Bright.Packets.Connect.Efficiently
poolSize(options); // 4,779,000,000
minLength(options); // 24
maxLength(options); // 68
```

For `n` adjectives, the pool is `75 ** n × 150 × 96`, multiplied by `59` when an adverb is added. Repeated adjectives are allowed; order matters. Very large results follow normal JavaScript `number` precision and overflow behavior.

## Choosing identifiers

Calls are independent and can repeat. Check existing records and retry when your application needs uniqueness. The pool counts word combinations; concatenating without separators can also make different combinations produce the same string.

The generator uses `Math.random()`. Use a cryptographically secure generator for passwords, authentication tokens, or other secrets.

## Development

Use Node.js 22 or 24 and Yarn 1.22.22.

```sh
yarn install --frozen-lockfile
yarn verify        # type checks, unit tests, release-gate tests, packed-install checks, builds
yarn format:check
yarn watch
yarn examples
```

The lightweight build produces self-contained CommonJS, ESM, browser-compatible bundles, a CLI, and declarations. Built files continue to be tracked in `dist/`; regenerate and include them with source changes. The word lists remain in `data/`. Browser bundles target ES2015.

### GitHub Pages

`yarn build:site` creates `_site/` and refreshes the committed `site/library.mjs` from the real library source. The playground generates IDs locally and supports live options, copying, batch downloads, shared settings, code examples, and light/dark themes.

The root `index.html` and committed `site/` assets support the existing branch-based Pages setup. The **Deploy GitHub Pages** workflow reads the deployment mode and skips Actions deployment while branch-based deployment is selected. To use it, select **GitHub Actions** in Settings → Pages → Build and deployment. Keep the custom domain `tech-human-id.js.org`.

### Releases

This source prepares the next patch release; local verification does not publish it.

1. Merge the reviewed version change into `master`.
2. **Create Tag** validates the package on Windows/Linux with Node 22/24, then creates `v<package version>` from current `master` if the tag does not already exist.
3. Run **Publish Node.js Package** manually from `master`, entering that existing tag. Tags created using `GITHUB_TOKEN` do not trigger another workflow automatically. A version tag pushed by a maintainer also triggers the publishing workflow.
4. The verification script from `master` checks that the tag matches the package version and that its commit is merged into `master` before checking out the release. All checks pass before the exact packed archive is passed to the publish job.
5. The publish job uses the existing `NPM_TOKEN` secret and adds npm provenance. It does not rebuild the package or execute package lifecycle scripts.

Keep the token scoped to this package. npm trusted publishing can be configured later; this change preserves the existing authentication mechanism.

## Contributing

Keep additions short, family friendly, and relevant to tech. Add words to the appropriate file in `data/`, run the checks, rebuild the package and site, and open a pull request.

## License

MIT. Based on the work of RienNeVaPlus; tech vocabulary and maintenance by Abhisek Pattnaik. See [LICENSE](LICENSE).
