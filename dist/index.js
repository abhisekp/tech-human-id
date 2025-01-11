"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.adverbs = exports.verbs = exports.nouns = exports.adjectives = void 0;
exports.humanId = humanId;
exports.poolSize = poolSize;
exports.maxLength = maxLength;
exports.minLength = minLength;
exports.adjectives = [
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
exports.nouns = [
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
exports.verbs = [
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
exports.adverbs = [
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
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function longest(arr) {
  return arr.reduce(function (a, b) {
    return a.length > b.length ? a : b;
  });
}
function shortest(arr) {
  return arr.reduce(function (a, b) {
    return a.length < b.length ? a : b;
  });
}
/**
 * Returns the human-id
 *
 * @param {Options|string|boolean} [options = {}]
 * @returns {string}
 */
function humanId(options) {
  if (options === void 0) {
    options = {};
  }
  if (typeof options === "string") options = { separator: options };
  if (typeof options === "boolean") options = { capitalize: options };
  var _a = options.separator,
    separator = _a === void 0 ? "" : _a,
    _b = options.capitalize,
    capitalize = _b === void 0 ? true : _b,
    _c = options.adjectiveCount,
    adjectiveCount = _c === void 0 ? 1 : _c,
    _d = options.addAdverb,
    addAdverb = _d === void 0 ? false : _d;
  var res = __spreadArray(
    __spreadArray(
      __spreadArray(
        [],
        __spreadArray([], Array(adjectiveCount), true).map(function (_) {
          return random(exports.adjectives);
        }),
        true,
      ),
      [random(exports.nouns), random(exports.verbs)],
      false,
    ),
    addAdverb ? [random(exports.adverbs)] : [],
    true,
  );
  if (capitalize)
    res = res.map(function (r) {
      return r.charAt(0).toUpperCase() + r.substr(1);
    });
  return res.join(separator);
}
/**
 * Returns the pool size for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
function poolSize(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.adjectiveCount,
    adjectiveCount = _a === void 0 ? 1 : _a,
    _b = options.addAdverb,
    addAdverb = _b === void 0 ? false : _b;
  return (
    exports.adjectives.length *
    adjectiveCount *
    exports.nouns.length *
    exports.verbs.length *
    (addAdverb ? exports.adverbs.length : 1)
  );
}
/**
 * Returns the max length for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
function maxLength(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.adjectiveCount,
    adjectiveCount = _a === void 0 ? 1 : _a,
    _b = options.addAdverb,
    addAdverb = _b === void 0 ? false : _b,
    _c = options.separator,
    separator = _c === void 0 ? "" : _c;
  return (
    longest(exports.adjectives).length * adjectiveCount +
    adjectiveCount * separator.length +
    longest(exports.nouns).length +
    separator.length +
    longest(exports.verbs).length +
    (addAdverb ? longest(exports.adverbs).length + separator.length : 0)
  );
}
/**
 * Returns the min length for a set of options
 *
 * @param {Options} [options = {}]
 * @returns {number}
 */
function minLength(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.adjectiveCount,
    adjectiveCount = _a === void 0 ? 1 : _a,
    _b = options.addAdverb,
    addAdverb = _b === void 0 ? false : _b,
    _c = options.separator,
    separator = _c === void 0 ? "" : _c;
  return (
    shortest(exports.adjectives).length * adjectiveCount +
    adjectiveCount * separator.length +
    shortest(exports.nouns).length +
    separator.length +
    shortest(exports.verbs).length +
    (addAdverb ? shortest(exports.adverbs).length + separator.length : 0)
  );
}
exports.default = humanId;
//# sourceMappingURL=index.js.map
