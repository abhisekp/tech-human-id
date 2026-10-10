import { humanId, poolSize, minLength, maxLength, adjectives, nouns, verbs, adverbs } from "./library.mjs";
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const count = Number(params.get("a") ?? 1);
const state = {
  separator: (params.get("s") ?? "").slice(0, 8),
  capitalize: params.get("c") !== "0",
  adjectiveCount: Number.isInteger(count) && count >= 0 && count <= 4 ? count : 1,
  addAdverb: params.get("v") === "1",
};
let batchSize = [1, 5, 10].includes(Number(params.get("b"))) ? Number(params.get("b")) : 1;
let ids = [];
let language = "esm";
let toastTimer;
const number = new Intl.NumberFormat("en-US");

function notify(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").classList.add("visible");
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 2600);
}
async function copy(text, message = "Copied to clipboard.") {
  try {
    await navigator.clipboard.writeText(text);
    notify(message);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch {
      /* Fall back to manual selection. */
    }
    area.remove();
    notify(success ? message : "Copy is unavailable. Select and copy the text manually.");
  }
}
function updateUrl() {
  const url = new URL(location.href);
  for (const key of ["a", "s", "c", "v", "b"]) url.searchParams.delete(key);
  if (state.adjectiveCount !== 1) url.searchParams.set("a", state.adjectiveCount);
  if (state.separator) url.searchParams.set("s", state.separator);
  if (!state.capitalize) url.searchParams.set("c", "0");
  if (state.addAdverb) url.searchParams.set("v", "1");
  if (batchSize !== 1) url.searchParams.set("b", batchSize);
  history.replaceState(null, "", url);
}
function syncControls() {
  $("adjective-count").value = state.adjectiveCount;
  $("count-label").value = state.adjectiveCount;
  $("capitalize").checked = state.capitalize;
  $("adverb").checked = state.addAdverb;
  $("separator").value = state.separator;
  $("batch-size").value = batchSize;
  document
    .querySelectorAll("[data-separator]")
    .forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.separator === state.separator)));
}
function updateCode() {
  const config = JSON.stringify(state, null, 2);
  if (language === "cli") {
    const args = [];
    if (state.addAdverb) args.push("adverb");
    if (!state.capitalize) args.push("lowercase");
    if (state.adjectiveCount !== 1) args.push(String(state.adjectiveCount));
    if (state.separator === " ") args.push("space");
    else if (state.separator.length === 1) args.push("'" + state.separator.replaceAll("'", "'\\''") + "'");
    if (batchSize !== 1) args.push(batchSize + "x");
    $("code").textContent =
      state.separator.length > 1 || /^[0-9al]$/i.test(state.separator)
        ? '// This separator uses the JavaScript API.\n\nimport { humanId } from "tech-human-id";\nhumanId(' +
          config +
          ");"
        : "npx tech-human-id" + (args.length ? " " + args.join(" ") : "") + "\n\n# " + ids.join("\n# ");
  } else {
    const header =
      language === "esm" ? 'import { humanId } from "tech-human-id";' : 'const { humanId } = require("tech-human-id");';
    $("code").textContent = header + "\n\nconst options = " + config + ";\n\nhumanId(options);\n// " + ids[0];
  }
}
function generate() {
  ids = Array.from({ length: batchSize }, () => humanId(state));
  $("result").textContent = ids[0];
  $("result").classList.remove("fresh");
  void $("result").offsetWidth;
  $("result").classList.add("fresh");
  $("pool").textContent = number.format(poolSize(state));
  $("length").textContent = minLength(state) + "–" + maxLength(state);
  $("batch-panel").hidden = batchSize === 1;
  $("batch-list").replaceChildren();
  if (batchSize > 1) {
    for (const id of ids) {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = id;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "⧉";
      button.setAttribute("aria-label", "Copy " + id);
      button.addEventListener("click", () => copy(id, "Identifier copied."));
      item.append(label, button);
      $("batch-list").append(item);
    }
  }
  updateCode();
}
function change() {
  syncControls();
  updateUrl();
  generate();
}
$("options").addEventListener("submit", (event) => event.preventDefault());
$("generate").addEventListener("click", generate);
$("copy-id").addEventListener("click", () => copy(ids[0], "Identifier copied."));
$("copy-all").addEventListener("click", () => copy(ids.join("\n"), "All identifiers copied."));
$("copy-code").addEventListener("click", () => copy($("code").textContent, "Code copied."));
$("copy-install").addEventListener("click", () => copy($("install-code").textContent, "Install command copied."));
$("share").addEventListener("click", () => copy(location.href, "Playground link copied."));
$("separator").addEventListener("input", (event) => {
  state.separator = event.target.value;
  change();
});
document.querySelectorAll("[data-separator]").forEach((button) =>
  button.addEventListener("click", () => {
    state.separator = button.dataset.separator;
    change();
  }),
);
$("adjective-count").addEventListener("input", (event) => {
  state.adjectiveCount = Number(event.target.value);
  change();
});
$("capitalize").addEventListener("change", (event) => {
  state.capitalize = event.target.checked;
  change();
});
$("adverb").addEventListener("change", (event) => {
  state.addAdverb = event.target.checked;
  change();
});
$("batch-size").addEventListener("change", (event) => {
  batchSize = Number(event.target.value);
  change();
});
$("reset").addEventListener("click", () => {
  Object.assign(state, { separator: "", capitalize: true, adjectiveCount: 1, addAdverb: false });
  batchSize = 1;
  change();
  notify("Back to the original recipe.");
});
$("download").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([ids.join("\n") + "\n"], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "tech-human-ids.txt";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify("Your identifiers are ready to download.");
});
document.addEventListener("keydown", (event) => {
  if (
    event.key.toLowerCase() === "g" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.repeat &&
    !event.target.closest("input, select, textarea, button, a, summary, [contenteditable]")
  ) {
    event.preventDefault();
    generate();
  }
});
function wireTabs(selector, onSelect) {
  const buttons = [...document.querySelectorAll(selector)];
  function activate(button) {
    buttons.forEach((item) => {
      item.setAttribute("aria-selected", String(item === button));
      item.tabIndex = item === button ? 0 : -1;
    });
    onSelect(button);
  }
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button));
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activate(buttons[next]);
        buttons[next].focus();
      }
    });
  });
}
wireTabs("[data-manager]", (button) => {
  $("install-code").textContent =
    button.dataset.manager + (button.dataset.manager === "npm" ? " install " : " add ") + "tech-human-id";
  $("install-command").setAttribute("aria-labelledby", button.id);
});
wireTabs("[data-language]", (button) => {
  language = button.dataset.language;
  $("code-example").setAttribute("aria-labelledby", button.id);
  updateCode();
});
function theme(value) {
  document.documentElement.dataset.theme = value;
  $("theme-toggle").setAttribute("aria-label", value === "dark" ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').content = value === "dark" ? "#1c211c" : "#f6f5ef";
}
try {
  theme(localStorage.getItem("tech-human-id-theme") === "dark" ? "dark" : "light");
} catch {
  theme("light");
}
$("theme-toggle").addEventListener("click", () => {
  const value = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  theme(value);
  try {
    localStorage.setItem("tech-human-id-theme", value);
  } catch {
    /* Theme still works when storage is disabled. */
  }
});
const heroWords = humanId("-").split("-");
["hero-adjective", "hero-noun", "hero-verb"].forEach((id, index) => {
  $(id).textContent = heroWords[index];
});
const bank = [adjectives[2], nouns[0], verbs[0], adverbs[0], adjectives[10], nouns[20], verbs[30]];
$("word-bank").replaceChildren(
  ...bank.map((word) => {
    const span = document.createElement("span");
    span.textContent = word;
    return span;
  }),
);
syncControls();
generate();
