import { adjectives as adjectiveWords } from "./data/adjectives";
import { nouns as nounWords } from "./data/nouns";
import { verbs as verbWords } from "./data/verbs";
import { adverbs as adverbWords } from "./data/adverbs";

export const adjectives: string[] = adjectiveWords;
export const nouns: string[] = nounWords;

export const verbs: string[] = verbWords;

export const adverbs: string[] = adverbWords;

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

function validateAdjectiveCount(adjectiveCount: number): void {
  if (!Number.isInteger(adjectiveCount) || adjectiveCount < 0 || adjectiveCount > 0xffffffff) {
    throw new RangeError("adjectiveCount must be a non-negative integer smaller than 2^32");
  }
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
  validateAdjectiveCount(adjectiveCount);

  let res = [
    ...[...Array(adjectiveCount)].map((_) => random(adjectives)),
    random(nouns),
    random(verbs),
    ...(addAdverb ? [random(adverbs)] : []),
  ];

  if (capitalize) res = res.map((r) => r.charAt(0).toUpperCase() + r.slice(1));

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
  validateAdjectiveCount(adjectiveCount);
  return adjectives.length ** adjectiveCount * nouns.length * verbs.length * (addAdverb ? adverbs.length : 1);
}

/**
 * Returns the max length for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
export function maxLength(options: Options = {}): number {
  const { adjectiveCount = 1, addAdverb = false, separator = "" } = options;
  validateAdjectiveCount(adjectiveCount);
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
  validateAdjectiveCount(adjectiveCount);
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
