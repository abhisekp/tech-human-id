#!/usr/bin/env node
import { humanId, Options } from "./index";
import { version } from "./package.json";

const help = `Usage: tech-human-id [adverb] [lowercase] [adjectiveCount] [separator] [countx]

  a, adverb, addAdverb    Add an adverb
  l, lower, lowercase    Use lowercase words
  space                  Separate words with a space
  any single character   Separate words with that character
  non-negative integer   Set the number of adjectives (default: 1)
  integer followed by x  Set the number of IDs (default: 1)
  -h, --help             Show this help
  -v, --version          Show the package version

Example: tech-human-id adverb lower 2 _ 3x`;

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(help);
} else if (args.includes("--version") || args.includes("-v")) {
  console.log(version);
} else {
  try {
    const options: Options = { adjectiveCount: 1, addAdverb: false, separator: "", capitalize: true };
    let repetitions = 1;

    for (const arg of args) {
      const lower = arg.toLowerCase();
      if (/^(0|[1-9]\d*)$/.test(arg)) options.adjectiveCount = Number(arg);
      else if (["a", "adverb", "addadverb"].includes(lower)) options.addAdverb = true;
      else if (["l", "lower", "lowercase"].includes(lower)) options.capitalize = false;
      else if (/^(0|[1-9]\d*)x$/i.test(arg)) repetitions = Number(arg.slice(0, -1));
      else if (lower === "space") options.separator = " ";
      else if (arg.length === 1 && !options.separator) options.separator = arg;
      else throw new Error(`Unknown argument: ${arg}. Run tech-human-id --help for usage.`);
    }

    if (!Number.isSafeInteger(repetitions)) throw new RangeError("The repetition count must be a safe integer");
    // Validate even when no output is requested.
    const adjectiveCount = options.adjectiveCount ?? 1;
    if (!Number.isInteger(adjectiveCount) || adjectiveCount < 0 || adjectiveCount > 0xffffffff) {
      throw new RangeError("adjectiveCount must be a non-negative integer smaller than 2^32");
    }
    for (let i = 0; i < repetitions; i++) console.log(humanId(options));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
