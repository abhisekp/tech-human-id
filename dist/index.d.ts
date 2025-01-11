export const adjectives: string[];
export const nouns: string[];
export const verbs: string[];
export const adverbs: string[];
export interface Options {
  separator?: string;
  capitalize?: boolean;
  adjectiveCount?: number;
  addAdverb?: boolean;
}
export default function humanId(options?: Options | string | boolean): string;
export function poolSize(options?: Options): number;
export function maxLength(options?: Options): number;
export function minLength(options?: Options): number;
export default humanId;

//# sourceMappingURL=index.d.ts.map
