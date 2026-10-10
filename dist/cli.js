#!/usr/bin/env node
"use strict";

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

// package.json
var version = "5.0.8";

// cli.ts
var help = `Usage: tech-human-id [adverb] [lowercase] [adjectiveCount] [separator] [countx]

  a, adverb, addAdverb    Add an adverb
  l, lower, lowercase    Use lowercase words
  space                  Separate words with a space
  any single character   Separate words with that character
  non-negative integer   Set the number of adjectives (default: 1)
  integer followed by x  Set the number of IDs (default: 1)
  -h, --help             Show this help
  -v, --version          Show the package version

Example: tech-human-id adverb lower 2 _ 3x`;
var args = process.argv.slice(2);
var _a;
if (args.includes("--help") || args.includes("-h")) {
  console.log(help);
} else if (args.includes("--version") || args.includes("-v")) {
  console.log(version);
} else {
  try {
    const options = { adjectiveCount: 1, addAdverb: false, separator: "", capitalize: true };
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
    const adjectiveCount = (_a = options.adjectiveCount) != null ? _a : 1;
    if (!Number.isInteger(adjectiveCount) || adjectiveCount < 0 || adjectiveCount > 4294967295) {
      throw new RangeError("adjectiveCount must be a non-negative integer smaller than 2^32");
    }
    for (let i = 0; i < repetitions; i++) console.log(humanId(options));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
//# sourceMappingURL=cli.js.map
