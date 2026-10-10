"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __pow = Math.pow;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  adjectives: () => adjectives2,
  adverbs: () => adverbs2,
  default: () => index_default,
  humanId: () => humanId,
  maxLength: () => maxLength,
  minLength: () => minLength,
  nouns: () => nouns2,
  poolSize: () => poolSize,
  verbs: () => verbs2
});
module.exports = __toCommonJS(index_exports);

// data/adjectives.ts
var adjectives = [
  "accurate",
  "afraid",
  "agile",
  "better",
  "big",
  "bright",
  "clean",
  "clear",
  "clever",
  "cold",
  "compact",
  "cool",
  "creative",
  "dark",
  "deep",
  "dirty",
  "dry",
  "dull",
  "dynamic",
  "elegant",
  "efficient",
  "fast",
  "flexible",
  "free",
  "fresh",
  "friendly",
  "full",
  "graceful",
  "green",
  "hot",
  "huge",
  "intelligent",
  "light",
  "logical",
  "long",
  "modern",
  "modular",
  "neat",
  "new",
  "nimble",
  "open",
  "powerful",
  "precise",
  "public",
  "quick",
  "ready",
  "reliable",
  "robust",
  "scalable",
  "secure",
  "sharp",
  "shiny",
  "short",
  "silent",
  "simple",
  "sleek",
  "slick",
  "slow",
  "smart",
  "smooth",
  "solid",
  "stable",
  "strong",
  "sustainable",
  "swift",
  "thin",
  "timeless",
  "tough",
  "true",
  "versatile",
  "vast",
  "vibrant",
  "virtual",
  "wide",
  "wise"
];

// data/nouns.ts
var nouns = [
  "algorithms",
  "analytics",
  "applications",
  "archives",
  "arrays",
  "assets",
  "backends",
  "batteries",
  "binaries",
  "blocks",
  "branches",
  "browsers",
  "buffers",
  "buttons",
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
  "commands",
  "compilers",
  "components",
  "configurations",
  "connections",
  "controllers",
  "cores",
  "cryptos",
  "dashboards",
  "databases",
  "datasets",
  "dependencies",
  "devices",
  "directories",
  "displays",
  "domains",
  "drivers",
  "emails",
  "engines",
  "environments",
  "errors",
  "extensions",
  "fields",
  "files",
  "filters",
  "folders",
  "frameworks",
  "functions",
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
  "maps",
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
  "solutions",
  "specifications",
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
  "utilities",
  "variables",
  "vectors",
  "views",
  "volumes",
  "websites",
  "widgets",
  "windows",
  "workflows",
  "zones"
];

// data/verbs.ts
var verbs = [
  "accept",
  "add",
  "adjust",
  "allow",
  "analyze",
  "authenticate",
  "backup",
  "build",
  "calculate",
  "change",
  "check",
  "click",
  "compile",
  "compress",
  "connect",
  "convert",
  "copy",
  "create",
  "debug",
  "decrypt",
  "delete",
  "design",
  "develop",
  "disable",
  "display",
  "download",
  "edit",
  "encode",
  "encrypt",
  "enter",
  "execute",
  "export",
  "extract",
  "fix",
  "generate",
  "hide",
  "import",
  "index",
  "install",
  "integrate",
  "invent",
  "join",
  "launch",
  "link",
  "load",
  "log",
  "make",
  "manage",
  "merge",
  "monitor",
  "move",
  "navigate",
  "open",
  "optimize",
  "parse",
  "perform",
  "post",
  "press",
  "process",
  "program",
  "push",
  "read",
  "reboot",
  "reconfigure",
  "repair",
  "report",
  "reset",
  "restart",
  "run",
  "save",
  "scan",
  "search",
  "secure",
  "select",
  "send",
  "setup",
  "share",
  "sort",
  "start",
  "stop",
  "store",
  "stream",
  "submit",
  "switch",
  "sync",
  "test",
  "track",
  "transform",
  "type",
  "uninstall",
  "update",
  "upload",
  "upgrade",
  "use",
  "view",
  "write"
];

// data/adverbs.ts
var adverbs = [
  "accurately",
  "adaptively",
  "algorithmically",
  "asynchronously",
  "automatically",
  "autonomously",
  "brilliantly",
  "clearly",
  "concurrently",
  "consistently",
  "continuously",
  "creatively",
  "customizably",
  "dependably",
  "digitally",
  "dynamically",
  "efficiently",
  "exceptionally",
  "experimentally",
  "extensively",
  "fluently",
  "frequently",
  "functionally",
  "gracefully",
  "incrementally",
  "independently",
  "innovatively",
  "intelligently",
  "interactively",
  "logically",
  "modularly",
  "optimally",
  "parallelly",
  "periodically",
  "precisely",
  "predictably",
  "programmatically",
  "promptly",
  "proactively",
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
  "strategically",
  "synchronously",
  "systematically",
  "theoretically",
  "thoroughly",
  "transparently",
  "uniquely",
  "virtually",
  "wirelessly"
];

// index.ts
var adjectives2 = adjectives;
var nouns2 = nouns;
var verbs2 = verbs;
var adverbs2 = adverbs;
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function longest(arr) {
  return arr.reduce((a, b) => a.length > b.length ? a : b);
}
function shortest(arr) {
  return arr.reduce((a, b) => a.length < b.length ? a : b);
}
function validateAdjectiveCount(adjectiveCount) {
  if (!Number.isInteger(adjectiveCount) || adjectiveCount < 0 || adjectiveCount > 4294967295) {
    throw new RangeError("adjectiveCount must be a non-negative integer smaller than 2^32");
  }
}
function humanId(options = {}) {
  if (typeof options === "string") options = { separator: options };
  if (typeof options === "boolean") options = { capitalize: options };
  const { separator = "", capitalize = true, adjectiveCount = 1, addAdverb = false } = options;
  validateAdjectiveCount(adjectiveCount);
  let res = [
    ...[...Array(adjectiveCount)].map((_) => random(adjectives2)),
    random(nouns2),
    random(verbs2),
    ...addAdverb ? [random(adverbs2)] : []
  ];
  if (capitalize) res = res.map((r) => r.charAt(0).toUpperCase() + r.slice(1));
  return res.join(separator);
}
function poolSize(options = {}) {
  const { adjectiveCount = 1, addAdverb = false } = options;
  validateAdjectiveCount(adjectiveCount);
  return __pow(adjectives2.length, adjectiveCount) * nouns2.length * verbs2.length * (addAdverb ? adverbs2.length : 1);
}
function maxLength(options = {}) {
  const { adjectiveCount = 1, addAdverb = false, separator = "" } = options;
  validateAdjectiveCount(adjectiveCount);
  return longest(adjectives2).length * adjectiveCount + adjectiveCount * separator.length + longest(nouns2).length + separator.length + longest(verbs2).length + (addAdverb ? longest(adverbs2).length + separator.length : 0);
}
function minLength(options = {}) {
  const { adjectiveCount = 1, addAdverb = false, separator = "" } = options;
  validateAdjectiveCount(adjectiveCount);
  return shortest(adjectives2).length * adjectiveCount + adjectiveCount * separator.length + shortest(nouns2).length + separator.length + shortest(verbs2).length + (addAdverb ? shortest(adverbs2).length + separator.length : 0);
}
var index_default = humanId;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  adjectives,
  adverbs,
  humanId,
  maxLength,
  minLength,
  nouns,
  poolSize,
  verbs
});
//# sourceMappingURL=index.cjs.map
