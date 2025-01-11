export const adjectives: string[] = require("./data/adjectives").adjectives;

export const nouns: string[] = require("./data/nouns").nouns;

export const verbs: string[] = require("./data/verbs").verbs;

export const adverbs: string[] = require("./data/adverbs").adverbs;

function random(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function longest(arr: string[]) {
  return arr.reduce((a, b) => (a.length > b.length ? a : b));
}

function shortest(arr: string[]) {
  return arr.reduce((a, b) => (a.length < b.length ? a : b));
}

export interface Options {
  separator?: string;
  capitalize?: boolean;
  adjectiveCount?: number;
  addAdverb?: boolean;
}

/**
 * Returns the human-id
 *
 * @param {Options|string|boolean} [options = {}]
 * @returns {string}
 */
export function humanId(options: Options | string | boolean = {}): string {
  if (typeof options === "string") options = { separator: options };
  if (typeof options === "boolean") options = { capitalize: options };
  const { separator = "", capitalize = true, adjectiveCount = 1, addAdverb = false } = options;

  let res = [
    ...[...Array(adjectiveCount)].map((_) => random(adjectives)),
    random(nouns),
    random(verbs),
    ...(addAdverb ? [random(adverbs)] : []),
  ];

  if (capitalize) res = res.map((r) => r.charAt(0).toUpperCase() + r.substr(1));

  return res.join(separator);
}

/**
 * Returns the pool size for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
export function poolSize(options: Options = {}): number {
  const { adjectiveCount = 1, addAdverb = false } = options;
  return adjectives.length * adjectiveCount * nouns.length * verbs.length * (addAdverb ? adverbs.length : 1);
}

/**
 * Returns the max length for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
export function maxLength(options: Options = {}): number {
  const { adjectiveCount = 1, addAdverb = false, separator = "" } = options;
  return (
    longest(adjectives).length * adjectiveCount +
    adjectiveCount * separator.length +
    longest(nouns).length +
    separator.length +
    longest(verbs).length +
    (addAdverb ? longest(adverbs).length + separator.length : 0)
  );
}

/**
 * Returns the min length for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
export function minLength(options: Options = {}): number {
  const { adjectiveCount = 1, addAdverb = false, separator = "" } = options;
  return (
    shortest(adjectives).length * adjectiveCount +
    adjectiveCount * separator.length +
    shortest(nouns).length +
    separator.length +
    shortest(verbs).length +
    (addAdverb ? shortest(adverbs).length + separator.length : 0)
  );
}

export default humanId;
