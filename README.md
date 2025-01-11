<h3 align="center">💃🆔</h3>

## Human-Readable Tech Identifiers

[![Downloads](https://img.shields.io/npm/dm/tech-human-id)](https://www.npmjs.com/tech-human-id)
[![License](https://img.shields.io/npm/l/tech-human-id)](https://github.com/abhisekp/tech-human-id/blob/master/LICENSE)

> NOTE: This is a fork from https://github.com/RienNeVaPlus/human-id  
> This includes tech terms only. Check the examples below.

> Using words to identify datasets (instead of numbers) provides various advantages when humans are involved, ie
> increased distinction and rememberability.

Human-ID generates readable strings by chaining common short words of the english language in a semi-meaningful way.
The result is concatenated of `adjective + noun + verb` resulting in a [minimum](#extended-pool-size) pool size of **28
690 200** possible combinations.

- **SFW**: no bad words; family friendly results
- No dependencies

## Examples

```ts
import { humanId } from "tech-human-id";
```

```js
humanId();
```

- ShortRecordsReport
- VastTasksEnter
- HugePixelsUse
- FastGraphsAccept
- ShinyPluginsTrack
- ThinCryptosCreate
- ModernHeadersCopy
- WideDevicesLog
- SmartPacketsUpgrade

---

```js
humanId("-"); // or { "separator": "-" }
```

- Bright-Backends-Import
- Full-Functions-Start
- Huge-Extensions-Upload
- Solid-Instances-Select
- Smart-Patterns-Monitor
- Swift-Tools-Allow
- Clear-Systems-Program
- Clear-Graphs-Change
- Smooth-Keys-Store
- Thin-Programs-Open

---

```js
humanId(false); // or { "capitalize": false }
```

- fastheaderstrack
- colddatabasesmake
- fastindexeschange
- quickstandardsprogram
- freedomainslog
- afraidclassesprogram
- hotdatasetssearch
- opencryptosconnect
- neatcomponentsbuild

## Install

Yarn

```
yarn add tech-human-id
```

NPM

```
npm install tech-human-id
```

## Usage

<!--

# TODO

### Command line

```sh
npx tech-human-id
# RareGeckosJam

npx tech-human-id lowercase + 2x
# rare+geckos+jam
# healthy+cows+smile
```
-->

### Programmatic

```js
// ES6+
import { humanId, poolSize, minLength, maxLength } from "tech-human-id";

// CommonJS
// const { humanId, poolSize, minLength, maxLength } = require("tech-human-id");

// LightStructuresCreate
console.log(humanId());

// Tough~Frameworks~Export
// alias for { separator: '~' }
console.log(humanId("~"));

// shiny-machines-integrate
console.log(
  humanId({
    separator: "-",
    capitalize: false,
  }),
);

console.log(poolSize()); // 4,34,700
console.log(minLength()); // 10
console.log(maxLength()); // 28
```

## Extended Pool Size

For most cases, the default pool size should be large enough. However, the options `adjectiveCount` and `addAdverb`
can be utilized to increase the pool size for the price of the string length.

```js
const options = {
  adjectiveCount: 2,
  addAdverb: true,
  separator: ".",
};

console.log(humanId(options)); // Fast.Fast.Queues.Compile.Optimally
console.log(poolSize(options)); // 28,690,200
console.log(minLength(options)); // 24
console.log(maxLength(options)); // 54
```

<!--

# TODO

## Executable arguments

Use the following arguments to modify the default options or print multiple results.

| Argument                   | Effect                                            |
|----------------------------|---------------------------------------------------|
| `a`, `adverb`, `addAdverb` | Sets `option.addAdverb` to `true`                 |
| `l`, `lower`, `lowercase`  | Sets `option.capitalize` to `false`               |
| `space`                    | Sets `option.separator` to an empty space ` `     |
| any number                 | Sets `option.adjectiveCount` to the given integer |
| any single character       | Sets `option.separator` to the character          |
| any number followed by `x` | Repeats the output `number` times                 |

### Example

```bash
npx tech-human-id adverb lower 2 _ 3x
# clever_shaggy_memes_sit_quietly
# cuddly_spicy_boxes_wave_politely
# sweet_fair_wombats_fetch_bravely
```
-->

## API

#### `humanId(options?: string | Option): string`

Generates a human ID. **Options** can be a `string` (separator), a `boolean` (capitalize) or an `Options` object of:

- **separator** `string = ''` - Separates the words from each other
- **capitalize** `boolean = true` - Whether to transform the first character of each word to upper case
- **adjectiveCount** `number = 1` - How many adjectives to return
- **addAdverb** `boolean = false` - Adds a fourth part to the id

_This function is also available as the default export_

#### `poolSize(options?: string | Option): number`

Returns the number of possible combinations for a given set of options.

#### `minLength(options?: Option): number`

The length of the shortest possible id for a given set of options.

#### `maxLength(options?: Option): number`

The length of the longest possible id for a given set of options.

#### `adjectives: string[]`

List of possible values for the first part of the human id.

#### `nouns: string[]`

List of possible values for the second part of the human id.

#### `verbs: string[]`

List of possible values for the third part of the human id.

#### `adverbs: string[]`

List of possible values for the optional fourth part of the human id.

<h6 align="center">💃🆔</h6>
