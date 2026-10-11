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

This source prepares the compatible `5.0.8` patch release. Configure npm trusted publishing before merging release changes.

In [npm package settings](https://www.npmjs.com/package/tech-human-id/access), add a **GitHub Actions** trusted publisher:

| Field                | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| Organization or user | `abhisekp`                                                 |
| Repository           | `tech-human-id`                                            |
| Workflow filename    | `yarn-publish.yml` (filename only)                         |
| Environment name     | Leave empty; the publishing job uses no GitHub environment |
| Allow npm publish    | Enabled for automatic publication                          |
| Allow npm dist-tag   | Enabled for maintenance channels and safe retries          |

After the first successful trusted publish, select **Require two-factor authentication and disallow tokens** under Publishing access. The workflow does not use `NPM_TOKEN`; remove obsolete publishing tokens after migration. A new trust configuration must publish successfully within two days or it expires. See [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

1. Merge a reviewed stable version change into `master`, or a backport into a matching maintenance branch such as `5.x`.
2. **Create Tag** validates Windows/Linux on Node 22/24 and tags only the current release branch commit.
3. Its successful completion starts **Publish Node.js Package** through `workflow_run`. This also recovers an existing validated tag that has not reached npm. `GITHUB_TOKEN` tag pushes alone do not trigger workflows.
4. The controller from `master` checks the release policy and tag ancestry before checking out the immutable tagged source. The build must pass all checks, formatting, and generated-artifact consistency before uploading the exact archive.
5. A separate GitHub-hosted publishing job uses OIDC, Node 24, and npm 11.21.0. It installs no package dependencies, executes no package lifecycle scripts, and publishes with provenance. GitHub release notes follow successful publication.

Manual recovery remains available: run **Publish Node.js Package** from `master`, enter the existing tag and release branch, and leave **dry_run** enabled to validate without publication. Disable it for a real release. Pull requests run the archive publication dry run without publishing credentials. A retry only skips an existing npm version when its archive checksum matches; it can then repair missing distribution tags. Older releases never move newer channels backwards.

### Maintaining parallel major versions

Each major has an npm channel such as `latest-5` or `latest-6`. `latest` follows the newest stable release; a `5.x` backport after version 6 exists updates `latest-5` without downgrading `latest`. CI, tagging, and publishing support matching `<major>.x` branches independently of `master`.

A future major upgrade is blocked until a non-breaking update to the previous major is published and its tag is merged into that major's maintenance branch. For example, before releasing `6.0.0`:

1. Keep `5.x` with the release workflows and compatible version 5 API.
2. Make, validate, and publish a compatible upgrade such as `5.0.9` on `5.x`.
3. Record the upgrade in `release.config.json`, keeping `baselineMajor` at 5:

```json
{
  "baselineMajor": 5,
  "majorUpgrades": {
    "6": {
      "previousVersion": "5.0.8",
      "compatibilityVersion": "5.0.9",
      "maintenanceBranch": "5.x"
    }
  }
}
```

Then version 6 can ship from `master`, while version 5 keeps receiving compatible releases from `5.x`. The gate checks published versions and Git ancestry; reviewers still verify that the lower-version changes preserve the API. This release does not introduce version 6.

## Contributing

Keep additions short, family friendly, and relevant to tech. Add words to the appropriate file in `data/`, run the checks, rebuild the package and site, and open a pull request.

## License

MIT. Based on the work of RienNeVaPlus; tech vocabulary and maintenance by Abhisek Pattnaik. See [LICENSE](LICENSE).
