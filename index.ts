export const adjectives: string[] = [
  "afraid",
  "big",
  "better",
  "bright",
  "clear",
  "clever",
  "cold",
  "cool",
  "dark",
  "deep",
  "dirty",
  "dry",
  "dull",
  "fast",
  "free",
  "fresh",
  "full",
  "green",
  "hot",
  "huge",
  "light",
  "long",
  "modern",
  "neat",
  "new",
  "open",
  "public",
  "quick",
  "ready",
  "sharp",
  "shiny",
  "short",
  "silent",
  "slick",
  "slow",
  "smart",
  "smooth",
  "solid",
  "strong",
  "swift",
  "thin",
  "tough",
  "true",
  "vast",
  "wide",
  "wise",
];

export const nouns: string[] = [
  "algorithms",
  "applications",
  "archives",
  "arrays",
  "backends",
  "batteries",
  "binaries",
  "blocks",
  "branches",
  "browsers",
  "buffers",
  "bytes",
  "cables",
  "caches",
  "cameras",
  "certificates",
  "chips",
  "classes",
  "clouds",
  "clusters",
  "codes",
  "compilers",
  "components",
  "controllers",
  "cores",
  "cryptos",
  "dashboards",
  "databases",
  "datasets",
  "devices",
  "displays",
  "domains",
  "drivers",
  "emails",
  "engines",
  "extensions",
  "fields",
  "files",
  "folders",
  "functions",
  "frameworks",
  "gateways",
  "generators",
  "graphs",
  "grids",
  "handles",
  "hardware",
  "headers",
  "hosts",
  "indexes",
  "instances",
  "interfaces",
  "keys",
  "keywords",
  "libraries",
  "lines",
  "links",
  "lists",
  "logs",
  "loops",
  "machines",
  "mails",
  "mainframes",
  "memories",
  "methods",
  "microservices",
  "modules",
  "networks",
  "nodes",
  "objects",
  "operands",
  "operations",
  "options",
  "outputs",
  "packets",
  "parameters",
  "parsers",
  "paths",
  "patterns",
  "pixels",
  "platforms",
  "plugins",
  "ports",
  "processors",
  "programs",
  "projects",
  "proxies",
  "queries",
  "queues",
  "records",
  "registries",
  "requests",
  "responses",
  "routers",
  "scripts",
  "sensors",
  "servers",
  "services",
  "sessions",
  "settings",
  "signals",
  "sites",
  "software",
  "sources",
  "sockets",
  "stacks",
  "standards",
  "storages",
  "streams",
  "strings",
  "structures",
  "subnets",
  "switches",
  "systems",
  "tables",
  "tags",
  "tasks",
  "templates",
  "terminals",
  "tokens",
  "tools",
  "trees",
  "types",
  "uploads",
  "urls",
  "users",
  "variables",
  "vectors",
  "views",
  "volumes",
  "websites",
  "widgets",
  "windows",
  "workflows",
  "zones",
];

export const verbs: string[] = [
  "accept",
  "add",
  "allow",
  "analyze",
  "build",
  "calculate",
  "change",
  "check",
  "click",
  "compile",
  "connect",
  "copy",
  "create",
  "debug",
  "delete",
  "design",
  "develop",
  "download",
  "edit",
  "encode",
  "enter",
  "execute",
  "export",
  "fix",
  "generate",
  "import",
  "install",
  "integrate",
  "invent",
  "join",
  "launch",
  "load",
  "log",
  "make",
  "monitor",
  "move",
  "open",
  "optimize",
  "post",
  "press",
  "program",
  "push",
  "read",
  "repair",
  "report",
  "reset",
  "restart",
  "run",
  "save",
  "scan",
  "search",
  "select",
  "send",
  "setup",
  "share",
  "start",
  "stop",
  "store",
  "stream",
  "switch",
  "sync",
  "test",
  "track",
  "type",
  "update",
  "upload",
  "upgrade",
  "use",
  "view",
  "write",
];

export const adverbs: string[] = [
  "accurately",
  "algorithmically",
  "asynchronously",
  "automatically",
  "concurrently",
  "consistently",
  "dependably",
  "digitally",
  "dynamically",
  "efficiently",
  "fluently",
  "intelligently",
  "logically",
  "modularly",
  "optimally",
  "parallelly",
  "precisely",
  "programmatically",
  "promptly",
  "rapidly",
  "reliably",
  "remotely",
  "responsively",
  "robustly",
  "scalably",
  "securely",
  "seamlessly",
  "sequentially",
  "smoothly",
  "statically",
  "synchronously",
  "virtually",
  "wirelessly",
];

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
