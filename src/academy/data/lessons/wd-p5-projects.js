/**
 * RESPONSIVE WEB DEVELOPMENT · PHASE 5 PROJECTS AND ASSESSMENT GATE
 *
 * Curriculum P5.1 – P5.6. Five applications built the professional way: ES
 * modules with one job each, shared code across pages, state kept in one
 * place, and documented exports. In the source curriculum these projects
 * used React; here they are built on the platform itself, which is exactly
 * what React (WD-201) will later automate. Then the gate: a reusable,
 * multi-page application with responsive layouts, working navigation,
 * meaningful state management and documented source, with no model answer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s-p5-projects";

const modPage = (title, body, script = "main.js") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="${script}"></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; }
main { width: min(100% - 32px, 1000px); margin-inline: auto; padding-block: 16px; }
button { min-height: 44px; padding: 8px 14px; }
.done { text-decoration: line-through; color: #4b5563; }
.site-nav ul { display: flex; flex-wrap: wrap; gap: 16px; margin: 0; padding: 12px 16px; list-style: none; background: #111827; }
.site-nav a { color: #fff; }
.site-nav a[aria-current="page"] { text-decoration: underline; font-weight: 700; }
`;

const brief = (id, explain, rows) => ({
  id,
  title: "The brief",
  explain,
  table: { caption: "What it must do.", headers: ["Part", "Requirement"], rows },
});

const decision = (id, title, explain, scenario, question, right, wrongs, aftermath) => ({
  id,
  title,
  explain,
  decision: {
    scenario,
    question,
    options: [{ id: "a", text: right[0], why: right[1] }, ...wrongs.map(([text, whyWrong], i) => ({ id: "bcd"[i], text, whyWrong }))],
    correct: "a",
    aftermath,
  },
});

const nowait = (n) => `await waitFor(() => ${n});`;

/* ── P5.1 Task manager ─────────────────────────────────────────────── */
const TASK_HTML = modPage("Tasks", `  <main>
    <h1>Tasks</h1>
    <form id="task-form">
      <label for="title">New task</label>
      <input id="title" name="title" autocomplete="off">
      <button type="submit">Add</button>
    </form>
    <div class="filters" role="group" aria-label="Show">
      <button data-filter="all" aria-pressed="true">All</button>
      <button data-filter="active" aria-pressed="false">Active</button>
      <button data-filter="done" aria-pressed="false">Done</button>
    </div>
    <ul id="tasks"></ul>
    <p id="counts" role="status"></p>
  </main>`);

const TASK_STORE = `/**
 * A tiny store: the single place the application's state lives.
 * Components never change state directly; they call setState, and every
 * subscriber is told, so the page can re-render.
 */
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    /** The current state. */
    getState: () => state,
    /** Replace part of the state and notify subscribers. */
    setState(patch) {
      state = { ...state, ...patch };
      for (const fn of listeners) fn(state);
    },
    /** Call fn on every change; returns a function that unsubscribes. */
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
`;

const TASK_MAIN_DONE = `import { createStore } from "./store.js";
import { visibleTasks, counts } from "./logic.js";

const store = createStore({ tasks: [], filter: "all" });
const list = document.querySelector("#tasks");

function render({ tasks, filter }) {
  list.replaceChildren();
  for (const t of visibleTasks(tasks, filter)) {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.textContent = t.title;
    li.classList.toggle("done", t.done);
    list.append(li);
  }
  const c = counts(tasks);
  document.querySelector("#counts").textContent = \`\${c.active} active · \${c.done} done\`;
  for (const b of document.querySelectorAll("[data-filter]")) {
    b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
  }
}

store.subscribe(render);
render(store.getState());

document.querySelector("#task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#title");
  const title = input.value.trim();
  if (!title) return;
  const { tasks } = store.getState();
  store.setState({ tasks: [...tasks, { id: String(tasks.length + 1), title, done: false }] });
  input.value = "";
});

list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  const { tasks } = store.getState();
  store.setState({ tasks: tasks.map((t) => (t.id === li.dataset.id ? { ...t, done: !t.done } : t)) });
});

document.querySelector(".filters").addEventListener("click", (event) => {
  const b = event.target.closest("[data-filter]");
  if (b) store.setState({ filter: b.dataset.filter });
});
`;

const TASK_LOGIC_DONE = `/** The tasks to show for a filter: "all", "active" or "done". */
export function visibleTasks(tasks, filter) {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

/** How many tasks are active and how many are done. */
export function counts(tasks) {
  const done = tasks.filter((t) => t.done).length;
  return { active: tasks.length - done, done };
}
`;

/* ── P5.2 Catalogue with filters ───────────────────────────────────── */
const CAT_HTML = modPage("Shop", `  <main>
    <h1>Shop</h1>
    <form id="filters">
      <label for="q">Search</label>
      <input id="q" name="q" type="search">
      <fieldset>
        <legend>Category</legend>
        <label><input type="checkbox" name="category" value="fashion"> Fashion</label>
        <label><input type="checkbox" name="category" value="home"> Home</label>
        <label><input type="checkbox" name="category" value="beauty"> Beauty</label>
      </fieldset>
      <label for="max">Maximum price (₦)</label>
      <input id="max" name="max" type="number" min="0">
      <button type="reset" id="clear">Clear filters</button>
    </form>
    <p id="status" role="status"></p>
    <ul id="products"></ul>
  </main>`);

const CAT_API = [
  { id: 1, name: "Ankara tote bag", category: "fashion", price: 7500 },
  { id: 2, name: "Woven basket", category: "home", price: 6000 },
  { id: 3, name: "Shea butter", category: "beauty", price: 2500 },
  { id: 4, name: "Leather sandals", category: "fashion", price: 18000 },
  { id: 5, name: "Black soap", category: "beauty", price: 1800 },
  { id: 6, name: "Beaded lamp", category: "home", price: 22000 },
];

const CAT_FILTERS_DONE = `/**
 * Apply every active filter. criteria = { q, categories, max }:
 * q matches names case-insensitively, categories is an array (empty means
 * all), max is a number or null.
 */
export function applyFilters(products, { q = "", categories = [], max = null }) {
  const query = q.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) &&
      (categories.length === 0 || categories.includes(p.category)) &&
      (max === null || p.price <= max)
  );
}

/** Read the filter form into criteria for applyFilters. */
export function readCriteria(form) {
  const data = new FormData(form);
  const raw = String(data.get("max") ?? "").trim();
  return {
    q: String(data.get("q") ?? ""),
    categories: data.getAll("category"),
    max: raw === "" ? null : Number(raw),
  };
}
`;

const CAT_MAIN_DONE = `import { applyFilters, readCriteria } from "./filters.js";

const form = document.querySelector("#filters");
const list = document.querySelector("#products");
const status = document.querySelector("#status");
let products = [];

function render() {
  const shown = applyFilters(products, readCriteria(form));
  list.replaceChildren();
  for (const p of shown) {
    const li = document.createElement("li");
    li.textContent = \`\${p.name} · ₦\${p.price}\`;
    list.append(li);
  }
  status.textContent = shown.length ? \`\${shown.length} of \${products.length} products\` : "No products match your filters";
}

form.addEventListener("input", render);
form.addEventListener("change", render);
form.addEventListener("reset", () => setTimeout(render, 0));
form.addEventListener("submit", (event) => event.preventDefault());

status.textContent = "Loading…";
try {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error(String(res.status));
  products = await res.json();
  render();
} catch {
  status.textContent = "Products could not be loaded";
}
`;

/* ── P5.3 Multi-page course site ───────────────────────────────────── */
const NAV_JS_DONE = `/** The site's pages, in navigation order. */
export const PAGES = [
  { href: "index.html", label: "Home" },
  { href: "courses.html", label: "Courses" },
  { href: "contact.html", label: "Contact" },
];

/**
 * Render the shared navigation into the page's <header>, marking the
 * current page with aria-current="page".
 */
export function renderNav(current) {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Main");
  const ul = document.createElement("ul");
  for (const page of PAGES) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = page.href;
    a.textContent = page.label;
    if (page.href === current) a.setAttribute("aria-current", "page");
    li.append(a);
    ul.append(li);
  }
  nav.append(ul);
  document.querySelector("header").append(nav);
}
`;

const COURSES_JS = `/** The course list: the one place course data lives. */
export const COURSES = [
  { code: "WD-101", title: "Responsive Web Development", weeks: 24 },
  { code: "PY-101", title: "Python Programming", weeks: 16 },
  { code: "DA-101", title: "Data Analysis", weeks: 16 },
];
`;

const site = (title, script, main) => modPage(title, `  <header></header>
  <main>
${main}
  </main>`, script);

/* ── P5.4 Dashboard ────────────────────────────────────────────────── */
const DASH_HTML = modPage("Results dashboard", `  <main>
    <h1>SS2 results</h1>
    <section class="stats">
      <article class="stat"><h2>Students</h2><p id="stat-count"></p></article>
      <article class="stat"><h2>Class average</h2><p id="stat-average"></p></article>
      <article class="stat"><h2>Passed</h2><p id="stat-passed"></p></article>
      <article class="stat"><h2>Top student</h2><p id="stat-top"></p></article>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col" aria-sort="none"><button data-sort="name">Name</button></th>
            <th scope="col" aria-sort="none"><button data-sort="average">Average</button></th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
  </main>`);

const DASH_DATA = `export const STUDENTS = [
  { name: "Chiamaka Okeke", scores: [88, 91, 79] },
  { name: "Babatunde Adewale", scores: [45, 52, 40] },
  { name: "Zainab Musa", scores: [72, 68, 75] },
  { name: "Emeka Obi", scores: [60, 58, 65] },
];
`;

const DASH_CSS = `${CSS}
.stats { display: grid; gap: 16px; grid-template-columns: 1fr; }
.stat { padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; }
.table-wrap { overflow-x: auto; margin-top: 24px; }
th button { background: none; border: 0; font: inherit; font-weight: 700; cursor: pointer; }
@media (min-width: 600px) { .stats { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .stats { grid-template-columns: repeat(4, 1fr); } }
`;

const DASH_LOGIC_DONE = `/** A student's average score, to one decimal place (0 with no scores). */
export function average(scores) {
  if (!scores.length) return 0;
  return Math.round((scores.reduce((t, s) => t + s, 0) / scores.length) * 10) / 10;
}

/** Summary figures for the stat cards. */
export function summarise(students) {
  const rows = students.map((s) => ({ name: s.name, average: average(s.scores) }));
  const classAverage = Math.round((rows.reduce((t, r) => t + r.average, 0) / rows.length) * 10) / 10;
  const top = rows.reduce((a, b) => (b.average > a.average ? b : a));
  return { count: rows.length, classAverage, passed: rows.filter((r) => r.average >= 50).length, top: top.name, rows };
}

/** A sorted copy of the rows by "name" (A–Z) or "average" (highest first). */
export function sortRows(rows, key) {
  return [...rows].sort((a, b) => (key === "name" ? a.name.localeCompare(b.name) : b.average - a.average));
}
`;

const DASH_MAIN_DONE = `import { STUDENTS } from "./data.js";
import { summarise, sortRows } from "./logic.js";

const summary = summarise(STUDENTS);
document.querySelector("#stat-count").textContent = summary.count;
document.querySelector("#stat-average").textContent = summary.classAverage;
document.querySelector("#stat-passed").textContent = \`\${summary.passed} of \${summary.count}\`;
document.querySelector("#stat-top").textContent = summary.top;

function renderRows(key) {
  const tbody = document.querySelector("#rows");
  tbody.replaceChildren();
  for (const row of sortRows(summary.rows, key)) {
    const tr = document.createElement("tr");
    for (const value of [row.name, row.average]) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    }
    tbody.append(tr);
  }
  for (const th of document.querySelectorAll("th")) {
    const active = th.querySelector("button").dataset.sort === key;
    th.setAttribute("aria-sort", active ? (key === "name" ? "ascending" : "descending") : "none");
  }
}

document.querySelector("thead").addEventListener("click", (event) => {
  const b = event.target.closest("[data-sort]");
  if (b) renderRows(b.dataset.sort);
});

renderRows("name");
`;

/* ── P5.5 API app ──────────────────────────────────────────────────── */
const REPO_HTML = modPage("Open-source explorer", `  <main>
    <h1>Nigerian open-source projects</h1>
    <p id="status" role="status"></p>
    <ul id="repos"></ul>
    <button id="more" hidden>Load more</button>
  </main>`);

const repoPage = (page, n, start) => Array.from({ length: n }, (_, i) => ({ id: start + i, name: `project-${start + i}`, stars: 1000 - (start + i) * 10, description: `Tool number ${start + i}` }));

const REPO_MOCKS = [
  { match: "/api/repos?page=1", status: 200, body: { items: repoPage(1, 5, 1), nextPage: 2 }, delay: 1000 },
  { match: "/api/repos?page=2", status: 200, body: { items: repoPage(2, 5, 6), nextPage: 3 }, delay: 120 },
  { match: "/api/repos?page=3", status: 200, body: { items: repoPage(3, 2, 11), nextPage: null }, delay: 120 },
];

const REPO_API_DONE = `/**
 * Fetch one page of repositories.
 * Resolves to { items, nextPage } or throws on any failure.
 */
export async function fetchRepos(page) {
  const res = await fetch(\`/api/repos?page=\${page}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}
`;

const REPO_MAIN_DONE = `import { fetchRepos } from "./api.js";

const list = document.querySelector("#repos");
const status = document.querySelector("#status");
const more = document.querySelector("#more");
let nextPage = 1;

async function loadPage() {
  status.textContent = "Loading…";
  more.disabled = true;
  try {
    const data = await fetchRepos(nextPage);
    for (const repo of data.items) {
      const li = document.createElement("li");
      li.textContent = \`\${repo.name} ★ \${repo.stars}: \${repo.description}\`;
      list.append(li);
    }
    nextPage = data.nextPage;
    more.hidden = nextPage === null;
    status.textContent = list.children.length ? \`\${list.children.length} projects\` : "No projects yet";
  } catch {
    status.textContent = "Could not load projects. Try again.";
  } finally {
    more.disabled = false;
  }
}

more.addEventListener("click", loadPage);
loadPage();
`;

/* ── P5.6 Gate ─────────────────────────────────────────────────────── */
const GATE_EVENTS = `/** Upcoming events: the one place event data lives. */
export const EVENTS = [
  { id: "e1", title: "Lagos Tech Meetup", city: "Lagos", date: "2026-11-07" },
  { id: "e2", title: "Abuja Design Night", city: "Abuja", date: "2026-11-14" },
  { id: "e3", title: "Lagos Startup Pitch", city: "Lagos", date: "2026-11-21" },
  { id: "e4", title: "Enugu Code Camp", city: "Enugu", date: "2026-12-05" },
];
`;

const gatePage = (title, script, main) => modPage(title, `  <header></header>
  <main>
${main}
  </main>`, script);

export const LESSONS = [
  /* ═══ P5.1 ═══ */
  {
    id: "wd-l131-task-manager",
    moduleId: "wd-p5-projects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P5.1"],
    title: "Project: Task Management Application",
    subtitle: "State in one store, logic in pure modules, the view as a picture of the state",
    estimatedMinutes: 45,
    intro: "This is the architecture behind every modern frontend framework, built by hand: one store holds the state, components ask it for changes, and the view re-renders whenever the state changes.",
    atoms: [
      brief("a-wd-p5-task-brief", "store.js (given) creates the store. Write logic.js and main.js.", [
        ["logic.js", "Exports visibleTasks(tasks, filter) and counts(tasks), pure, each with a /** doc comment */"],
        ["main.js", "Creates the store with { tasks: [], filter: \"all\" }, subscribes a render function, and wires the form, task clicks and filter buttons"],
        ["Adding and toggling", "The form adds a task; clicking a task toggles done (class done)"],
        ["Filters", "All / Active / Done show the right tasks; the pressed one has aria-pressed=\"true\""],
        ["Counts", "#counts shows \"2 active · 1 done\""],
      ]),
      decision("a-wd-p5-task-plan", "Why a store?", "With a few components it is tempting to let each one change the data however it likes.", "The filter buttons, the task list and the counter all depend on the same tasks.", "What does routing every change through store.setState give you?",
        ["One place where state changes, and every part of the page re-rendered from the same, current state", "Nothing can update the list but forget the counter: every change notifies every subscriber. This is the idea React, Vue and every state library are built on."],
        [["Faster code", "Speed is not the point; consistency is."], ["Nothing: global variables do the same", "Globals can be changed from anywhere without anyone being told."], ["Automatic saving", "Saving is something you can add as one more subscriber."]],
        "State in one place, changes through one door, view derived from state."),
      {
        id: "a-wd-p5-task-build",
        title: "Build it",
        explain: "Write logic.js and main.js to the brief. Both are ES modules.",
        webLab: {
          task: "Build the task manager to the brief, using the given store.",
          files: { "index.html": TASK_HTML, "style.css": CSS, "store.js": TASK_STORE, "logic.js": "", "main.js": "import { createStore } from \"./store.js\";\n" },
          readOnly: ["index.html", "style.css", "store.js"],
          tests: [
            { label: "Adding tasks lists them and updates the counts", check: "for (const t of ['Buy rice', 'Call Mum', 'Read']) { await type('#title', t); await submit('#task-form'); } " + nowait("$$('#tasks li').length === 3") + " return text('#counts') === '3 active · 0 done' && $('#title').value === '';", fail: "On submit, setState with a new task; render lists tasks and counts." },
            { label: "Clicking a task toggles done", check: "await click($$('#tasks li')[1]); return $$('#tasks li')[1].classList.contains('done') && text('#counts') === '2 active · 1 done';", fail: "Delegate clicks on #tasks and setState with the task's done flipped." },
            { label: "The Done filter shows only done tasks, and is pressed", check: "await click('[data-filter=done]'); return $$('#tasks li').length === 1 && text('#tasks li') === 'Call Mum' && $('[data-filter=done]').getAttribute('aria-pressed') === 'true' && $('[data-filter=all]').getAttribute('aria-pressed') === 'false';", fail: "Filter buttons setState({ filter }); render uses visibleTasks and updates aria-pressed." },
            { label: "The Active filter shows the other two", check: "await click('[data-filter=active]'); return $$('#tasks li').length === 2;", fail: "visibleTasks(tasks, \"active\") returns tasks that are not done." },
            { label: "logic.js exports documented pure functions", check: "const c = raw('logic.js'); return /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+visibleTasks/.test(c) && /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+counts/.test(c) && !/document/.test(c);", fail: "Put a /** … */ comment before each exported function, and keep the DOM out of logic.js." },
            { label: "State changes go through the store", check: "const c = code('main.js'); return /createStore\\(/.test(c) && /\\.subscribe\\(/.test(c) && /setState\\(/.test(c) && errors().length === 0;", fail: "Create the store, subscribe render to it, and change state only with setState." },
          ],
          solution: { "logic.js": TASK_LOGIC_DONE, "main.js": TASK_MAIN_DONE },
          hint: "render(state) draws everything from the state it is given. Subscribe it once; never call it from the event handlers.",
          successMessage: "Every button only changes the state; the view follows automatically. When you learn React, this is the part it does for you.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P5.2 ═══ */
  {
    id: "wd-l132-catalog-filters",
    moduleId: "wd-p5-projects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P5.2"],
    title: "Project: Product Catalog with Search and Filters",
    subtitle: "Several filters at once, read straight from a form",
    estimatedMinutes: 40,
    intro: "Real shops combine search, several categories and a price limit. Treating the filter panel as one form, and the filtering as one pure function of its values, keeps that manageable however many filters you add.",
    atoms: [
      brief("a-wd-p5-cat-brief", "GET /api/products returns { id, name, category, price } objects. Write filters.js and main.js.", [
        ["filters.js", "applyFilters(products, { q, categories, max }) and readCriteria(form), documented, with no DOM rendering"],
        ["Combining", "Search text AND any ticked categories (none ticked means all) AND a maximum price, all at once"],
        ["Live", "Results update on every input or change; Clear filters restores everything"],
        ["Status", "\"Loading…\", then \"4 of 6 products\", or \"No products match your filters\""],
      ]),
      decision("a-wd-p5-cat-plan", "Filters as data", "Each control could have its own listener that filters the list a little more.", "Three listeners each filter the visible list in their own way.", "What problem does that cause?",
        ["Filters interfere: unticking a category cannot bring back products another listener removed. One function of ALL the form's values avoids it", "Derive the result from the full list and every filter together, every time."],
        [["None; more listeners are faster", "Speed is not the issue; correctness is."], ["The page will not load", "It loads; it gives wrong results."], ["Forms cannot have several listeners", "They can; the design is the problem."]],
        "One input event on the form, one pure filter, one render."),
      {
        id: "a-wd-p5-cat-build",
        title: "Build it",
        explain: "Write filters.js and main.js to the brief.",
        webLab: {
          task: "Build the filterable catalogue to the brief.",
          files: { "index.html": CAT_HTML, "style.css": CSS, "filters.js": "", "main.js": "" },
          readOnly: ["index.html", "style.css"],
          mocks: [{ match: "/api/products", status: 200, body: CAT_API, delay: 1200 }],
          tests: [
            { label: "Loading, then every product with a count", check: "const loading = text('#status') === 'Loading…'; " + nowait("$$('#products li').length === 6") + " return loading && text('#status') === '6 of 6 products';", fail: "Show \"Loading…\", fetch, then render all products and the count." },
            { label: "Ticking categories filters to them", check: nowait("$$('#products li').length === 6") + " await choose('input[value=fashion]'); await choose('input[value=beauty]'); return $$('#products li').length === 4 && text('#status') === '4 of 6 products';", fail: "Read every ticked category with FormData.getAll(\"category\")." },
            { label: "A maximum price combines with the categories", check: "await type('#max', '5000'); return $$('#products li').length === 2 && $$('#products li').every((li) => /Shea|Black soap/.test(text(li)));", fail: "An empty max means no limit; otherwise keep products with price <= max." },
            { label: "Search combines with both", check: "await type('#q', 'SOAP'); return $$('#products li').length === 1 && text('#products li') === 'Black soap · ₦1800';", fail: "Search names case-insensitively, together with the other filters." },
            { label: "No match shows a message", check: "await type('#q', 'laptop'); return $$('#products li').length === 0 && text('#status') === 'No products match your filters';", fail: "When nothing is left, show the message." },
            { label: "Clear filters restores everything", check: "await click('#clear'); await wait(30); return $$('#products li').length === 6;", fail: "Listen for the form's reset event and re-render after the fields have cleared." },
            { label: "filters.js is documented and does no rendering", check: "const c = raw('filters.js'); return /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+applyFilters/.test(c) && !/createElement|textContent/.test(c);", fail: "Document applyFilters with a /** … */ comment and keep rendering in main.js." },
          ],
          solution: { "filters.js": CAT_FILTERS_DONE, "main.js": CAT_MAIN_DONE },
          hint: "A form's input event fires for every field inside it; one listener on the form is enough. Reset fires before the fields clear, so render a moment later.",
          successMessage: "Three filters that combine correctly, from one pure function you could test in isolation.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P5.3 ═══ */
  {
    id: "wd-l133-course-site",
    moduleId: "wd-p5-projects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P5.3"],
    title: "Project: Multi-Page Course Website",
    subtitle: "Shared navigation and shared data, written once",
    estimatedMinutes: 40,
    intro: "In Phase 1 you copied the navigation into every page by hand. Now one module renders it on every page, and one data module feeds every page that lists courses: change it once, and the whole site follows.",
    atoms: [
      brief("a-wd-p5-site-brief", "Three pages: index.html, courses.html and contact.html, each loading its own small module. nav.js and courses-data.js are shared.", [
        ["nav.js", "Exports PAGES and renderNav(current), documented; renderNav adds the nav to the page's header with aria-current on the current page"],
        ["index.js", "Renders the nav, and shows \"3 courses available\" in #summary from the shared data"],
        ["courses.js", "Renders the nav, and the course list in #courses as \"WD-101 · Responsive Web Development (24 weeks)\""],
        ["contact.js", "Renders the nav"],
      ]),
      decision("a-wd-p5-site-plan", "Copy, or share?", "Every page needs the same navigation.", "The client asks for a fourth page, Blog, in the menu.", "With a shared nav module, what changes?",
        ["One line in PAGES; every page's menu updates", "Shared modules turn \"edit every page\" into \"edit one list\". This is what components are for."],
        [["Every page's HTML", "That is the copy-paste approach you just replaced."], ["Nothing; menus update themselves", "Someone still has to add the page to PAGES."], ["The CSS", "The menu's content is data, not style."]],
        "Phase 6's capstone needs this structure."),
      {
        id: "a-wd-p5-site-build",
        title: "Build it",
        explain: "Write nav.js and the three page modules. Use the page buttons above the preview to move between pages.",
        webLab: {
          task: "Build the multi-page site's shared navigation and data-driven pages to the brief.",
          files: {
            "index.html": site("Home · Memora Academy", "index.js", "    <h1>Learn to build the web</h1>\n    <p id=\"summary\"></p>"),
            "courses.html": site("Courses · Memora Academy", "courses.js", "    <h1>Courses</h1>\n    <ul id=\"courses\"></ul>"),
            "contact.html": site("Contact · Memora Academy", "contact.js", "    <h1>Contact</h1>\n    <p>hello@example.com</p>"),
            "style.css": CSS,
            "courses-data.js": COURSES_JS,
            "nav.js": "",
            "index.js": "",
            "courses.js": "",
            "contact.js": "",
          },
          readOnly: ["index.html", "courses.html", "contact.html", "style.css", "courses-data.js"],
          tests: [
            ...["index.html", "courses.html", "contact.html"].map((p) => ({
              page: p,
              label: `${p}: the shared nav, with this page marked current`,
              check: `${nowait("$$('header nav a').length === 3")} const cur = $$('header nav a[aria-current="page"]'); return $$('header nav a').map((a) => a.getAttribute('href')).join() === 'index.html,courses.html,contact.html' && cur.length === 1 && cur[0].getAttribute('href') === '${p}';`,
              fail: `${p} must call renderNav("${p}") from its module.`,
            })),
            { page: "index.html", label: "Home shows the course count from the shared data", check: nowait("text('#summary') !== ''") + " return text('#summary') === '3 courses available' && !/3 courses/.test(code('index.js'));", fail: "Import COURSES and build the text from COURSES.length." },
            { page: "courses.html", label: "Courses lists every course from the shared data", check: nowait("$$('#courses li').length === 3") + " return text($$('#courses li')[0]) === 'WD-101 · Responsive Web Development (24 weeks)';", fail: "Import COURSES and render one li per course." },
            { page: "index.html", label: "nav.js exports a documented renderNav and PAGES", check: "const c = raw('nav.js'); return /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+renderNav/.test(c) && /export\\s+const\\s+PAGES/.test(c);", fail: "Export PAGES and renderNav, with a /** … */ comment on renderNav." },
            { page: "contact.html", label: "The pages share the nav module instead of copying it", check: "return ['index.js', 'courses.js', 'contact.js'].every((f) => /from\\s+[\"']\\.\\/nav\\.js[\"']/.test(code(f))) && !['index.js', 'courses.js', 'contact.js'].some((f) => /createElement\\([\"']nav/.test(code(f)));", fail: "Each page module imports renderNav from ./nav.js." },
          ],
          solution: {
            "nav.js": NAV_JS_DONE,
            "index.js": "import { renderNav } from \"./nav.js\";\nimport { COURSES } from \"./courses-data.js\";\n\nrenderNav(\"index.html\");\ndocument.querySelector(\"#summary\").textContent = `${COURSES.length} courses available`;\n",
            "courses.js": "import { renderNav } from \"./nav.js\";\nimport { COURSES } from \"./courses-data.js\";\n\nrenderNav(\"courses.html\");\nconst list = document.querySelector(\"#courses\");\nfor (const c of COURSES) {\n  const li = document.createElement(\"li\");\n  li.textContent = `${c.code} · ${c.title} (${c.weeks} weeks)`;\n  list.append(li);\n}\n",
            "contact.js": "import { renderNav } from \"./nav.js\";\n\nrenderNav(\"contact.html\");\n",
          },
          hint: "Each page's module is two or three lines: import, call renderNav with its own file name, render its content.",
          successMessage: "Three pages, one navigation, one source of course data. That is a component-based site, without a framework.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P5.4 ═══ */
  {
    id: "wd-l134-student-dashboard",
    moduleId: "wd-p5-projects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["P5.4"],
    title: "Project: Student Dashboard",
    subtitle: "Summary cards and a sortable, accessible table from one data module",
    estimatedMinutes: 40,
    intro: "Dashboards turn data into a few numbers and a table people can sort. Keeping the calculations pure and separate is what lets the same numbers be trusted on every screen.",
    atoms: [
      brief("a-wd-p5-dash-brief", "data.js exports STUDENTS. Write logic.js and main.js; the layout CSS is given.", [
        ["logic.js", "average(scores), summarise(students) and sortRows(rows, key), documented and pure"],
        ["Stat cards", "#stat-count 4, #stat-average the class average, #stat-passed \"3 of 4\", #stat-top the top student"],
        ["Table", "One row per student: name and average; sorted by name first"],
        ["Sorting", "The header buttons sort by name (A–Z) or average (highest first); the sorted column's th has aria-sort ascending or descending, the other none"],
      ]),
      decision("a-wd-p5-dash-plan", "Accessible sorting", "Sighted users see a sorted column; screen-reader users need to be told.", "You add a small arrow to the sorted column's header.", "What else is needed?",
        ["aria-sort on the th, and real buttons in the headers", "The arrow is visual only. aria-sort tells assistive technology how the table is sorted, and buttons make the headers usable from the keyboard."],
        [["Nothing; the arrow is enough", "It is invisible to screen readers."], ["A tooltip", "Hover-only, and not announced."], ["Make the header text bold", "Visual only."]],
        "Interactive tables need both keyboard access and announced state."),
      {
        id: "a-wd-p5-dash-build",
        title: "Build it",
        explain: "Write logic.js and main.js to the brief.",
        webLab: {
          task: "Build the student dashboard to the brief.",
          files: { "index.html": DASH_HTML, "style.css": DASH_CSS, "data.js": DASH_DATA, "logic.js": "", "main.js": "" },
          readOnly: ["index.html", "style.css", "data.js"],
          tests: [
            { label: "The stat cards show the summary", check: nowait("text('#stat-top') !== ''") + " return text('#stat-count') === '4' && text('#stat-average') === '66.1' && text('#stat-passed') === '3 of 4' && text('#stat-top') === 'Chiamaka Okeke';", fail: "Averages: 86, 45.7, 71.7, 61; class average 66.1; three of four at 50 or more." },
            { label: "The table starts sorted by name, with aria-sort", check: nowait("$$('#rows tr').length === 4") + " const first = $$('#rows tr')[0].children; return first[0].textContent === 'Babatunde Adewale' && first[1].textContent === '45.7' && $$('th')[0].getAttribute('aria-sort') === 'ascending' && $$('th')[1].getAttribute('aria-sort') === 'none';", fail: "Render rows sorted by name and set aria-sort on the name column." },
            { label: "Sorting by average puts the highest first and updates aria-sort", check: "await click('[data-sort=average]'); const names = $$('#rows tr').map((r) => r.children[0].textContent); return names.join('|') === 'Chiamaka Okeke|Zainab Musa|Emeka Obi|Babatunde Adewale' && $$('th')[1].getAttribute('aria-sort') === 'descending' && $$('th')[0].getAttribute('aria-sort') === 'none';", fail: "sortRows by average descending, and move aria-sort to that column." },
            { label: "Phone: stat cards stack and nothing scrolls sideways", viewport: "mobile", check: nowait("text('#stat-top') !== ''") + " const r = $$('.stat').map((s) => rect(s)); return r[1].top >= r[0].bottom - 1 && !overflowX();", fail: "The given CSS handles this; check nothing you render is too wide." },
            { label: "logic.js is documented, pure and does not change the data", check: "const c = raw('logic.js'); return /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+summarise/.test(c) && /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+sortRows/.test(c) && !/document/.test(c);", fail: "Document each exported function; no DOM code in logic.js." },
          ],
          solution: { "logic.js": DASH_LOGIC_DONE, "main.js": DASH_MAIN_DONE },
          hint: "summarise can return the rows too, so main.js renders the table from them without recalculating.",
          successMessage: "A dashboard whose every number comes from one tested module, with a table that keyboard and screen-reader users can sort.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P5.5 ═══ */
  {
    id: "wd-l135-api-app",
    moduleId: "wd-p5-projects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["P5.5"],
    title: "Project: Application Consuming an External API",
    subtitle: "Pagination, an API module, and every state handled",
    estimatedMinutes: 40,
    intro: "Real APIs return data a page at a time. This project keeps all network code in one module and adds pages on demand with a Load more button.",
    atoms: [
      brief("a-wd-p5-api-brief", "GET /api/repos?page=N returns { items, nextPage }; nextPage is null on the last page. Write api.js and main.js.", [
        ["api.js", "A documented fetchRepos(page) that resolves to the JSON or throws on an unsuccessful response"],
        ["First load", "\"Loading…\", then five projects as \"NAME ★ STARS: DESCRIPTION\" and \"5 projects\""],
        ["Load more", "Appends the next page (the button disabled while loading) and hides itself when nextPage is null"],
        ["Errors", "\"Could not load projects. Try again.\" with the button usable again"],
      ]),
      decision("a-wd-p5-api-plan", "One module for the network", "fetch calls can live anywhere, but they should not.", "The API's address changes from /api/repos to /v2/repos.", "With all requests in api.js, what changes?",
        ["One line in api.js; the rest of the app is untouched", "Isolating the API also makes it easy to fake in tests (Module 28) and to add headers or caching later."],
        [["Every file that renders data", "Only if fetch is scattered through them."], ["The HTML", "Unrelated."], ["Nothing; URLs update themselves", "Someone must change the address."]],
        "Data access in one place, like storage in Module 25."),
      {
        id: "a-wd-p5-api-build",
        title: "Build it",
        explain: "Write api.js and main.js to the brief.",
        webLab: {
          task: "Build the paginated API explorer to the brief.",
          files: { "index.html": REPO_HTML, "style.css": CSS, "api.js": "", "main.js": "" },
          readOnly: ["index.html", "style.css"],
          mocks: REPO_MOCKS,
          tests: [
            { label: "First page: loading, then five projects", check: "const loading = text('#status') === 'Loading…'; " + nowait("$$('#repos li').length === 5") + " return loading && text($$('#repos li')[0]) === 'project-1 ★ 990: Tool number 1' && text('#status') === '5 projects' && !$('#more').hidden;", fail: "Show \"Loading…\", fetch page 1, render each repository and the count, and show Load more." },
            { label: "Load more appends page 2, disabling the button while loading", check: nowait("$$('#repos li').length === 5") + " $('#more').click(); await wait(10); const disabled = $('#more').disabled; " + nowait("$$('#repos li').length === 10") + " return disabled && text('#status') === '10 projects';", fail: "Disable the button, fetch nextPage and append; re-enable it when done." },
            { label: "The last page hides Load more", check: nowait("$$('#repos li').length === 10") + " await click('#more'); " + nowait("$$('#repos li').length === 12") + " return $('#more').hidden && fetchCalls().map((c) => c.url).join().includes('page=3');", fail: "When nextPage is null, hide the button." },
            { label: "api.js holds the request, documented", check: "const c = raw('api.js'); return /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+async\\s+function\\s+fetchRepos/.test(c) && /fetch\\(/.test(c) && !/fetch\\(/.test(code('main.js'));", fail: "Put the fetch in a documented export async function fetchRepos(page) in api.js, and call that from main.js." },
            { label: "api.js throws on an unsuccessful response", check: "return /\\.ok/.test(code('api.js')) && /throw/.test(code('api.js'));", fail: "if (!res.ok) throw new Error(…)." },
          ],
          solution: { "api.js": REPO_API_DONE, "main.js": REPO_MAIN_DONE },
          hint: "Keep nextPage in main.js; fetchRepos only knows how to get one page.",
          successMessage: "Paginated data, isolated network code and clear states: the shape of most real API-driven pages.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P5.6 Gate ═══ */
  {
    id: "wd-l136-p5-gate",
    moduleId: "wd-p5-projects",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["P5.6"],
    gate: true,
    title: "Phase 5 Assessment Gate: A Reusable, Multi-Page Application",
    subtitle: "Responsive layouts, working navigation, real state management and documented code",
    estimatedMinutes: 80,
    intro: "This is the Phase 5 gate. Build a two-page events app: a list of events that can be filtered by city and saved, and a page of the visitor's saved events. Navigation, data, state and storage are shared modules. There is no model answer.",
    atoms: [
      {
        id: "a-wd-p5-gate-brief",
        title: "The gate brief",
        explain: "events-data.js (given) exports EVENTS. You write every other module and all of the CSS layout beyond the base styles.",
        table: {
          caption: "Requirements.",
          headers: ["Area", "Requirement"],
          rows: [
            ["nav.js", "A documented renderNav(current) used by both pages, linking events.html and saved.html with aria-current on the current page"],
            ["saved.js (a store)", "Documented functions getSaved(), toggleSaved(id) and isSaved(id), keeping saved ids as JSON under \"saved\" in localStorage, safe against corrupted data"],
            ["events.html", "Each event in #events as an li with its title, city and date, and a button that says Save or Saved with aria-pressed; a #city select (all, Lagos, Abuja, Enugu) filters the list; #count shows \"Showing 2 of 4\""],
            ["saved.html", "Lists the saved events in #saved, or \"You have not saved any events yet\" in #empty"],
            ["Responsive", "No sideways scrolling at phone, tablet or laptop width; on a laptop the events are laid out at least two per row"],
            ["Documented", "Every exported function in your modules has a /** … */ comment"],
          ],
        },
      },
      {
        id: "a-wd-p5-gate-build",
        title: "Build your application",
        explain: "Write the modules and the CSS. Use the page buttons above the preview to switch between the two pages.",
        webLab: {
          task: "Build the two-page events application to the gate brief.",
          revealSolution: false,
          files: {
            "events.html": gatePage("Events", "events-page.js", "    <h1>Upcoming events</h1>\n    <label for=\"city\">City</label>\n    <select id=\"city\">\n      <option value=\"all\">All cities</option>\n      <option value=\"Lagos\">Lagos</option>\n      <option value=\"Abuja\">Abuja</option>\n      <option value=\"Enugu\">Enugu</option>\n    </select>\n    <p id=\"count\" role=\"status\"></p>\n    <ul id=\"events\" class=\"event-grid\"></ul>"),
            "saved.html": gatePage("Saved events", "saved-page.js", "    <h1>Saved events</h1>\n    <p id=\"empty\"></p>\n    <ul id=\"saved\"></ul>"),
            "style.css": CSS,
            "events-data.js": GATE_EVENTS,
            "nav.js": "",
            "saved.js": "",
            "events-page.js": "",
            "saved-page.js": "",
          },
          readOnly: ["events.html", "saved.html", "events-data.js"],
          tests: [
            ...["events.html", "saved.html"].map((p) => ({
              page: p,
              label: `${p}: shared nav with this page marked current`,
              check: `${nowait("$$('header nav a').length === 2")} const cur = $$('header nav a[aria-current="page"]'); return cur.length === 1 && cur[0].getAttribute('href') === '${p}' && /from\\s+["']\\.\\/nav\\.js["']/.test(code('${p === "events.html" ? "events-page.js" : "saved-page.js"}'));`,
              fail: `${p}'s module must import renderNav from ./nav.js and call it with "${p}".`,
            })),
            { page: "events.html", label: "events.html lists every event with a Save button and a count", check: nowait("$$('#events li').length === 4") + " const b = $$('#events li button'); return b.length === 4 && b.every((x) => x.getAttribute('aria-pressed') === 'false' && /save/i.test(x.textContent)) && text('#count') === 'Showing 4 of 4' && text($$('#events li')[0]).includes('Lagos Tech Meetup');", fail: "Render each event with its title, city and date and a Save button with aria-pressed=\"false\"; show the count." },
            { page: "events.html", label: "Filtering by city updates the list and the count", check: nowait("$$('#events li').length === 4") + " const s = $('#city'); s.value = 'Lagos'; s.dispatchEvent(new Event('change', { bubbles: true })); await tick(); return $$('#events li').length === 2 && text('#count') === 'Showing 2 of 4';", fail: "Listen for change on #city and re-render only that city's events." },
            { page: "events.html", label: "Saving toggles the button and stores the id", check: "const sel = $('#city'); sel.value = 'all'; sel.dispatchEvent(new Event('change', { bubbles: true })); await tick(); " + nowait("$$('#events li').length === 4") + " const b = $$('#events li button')[1]; await click(b); const saved = JSON.parse(storage.getItem('saved') || '[]'); const ok1 = b.isConnected ? b : $$('#events li button')[1]; const pressed = ok1.getAttribute('aria-pressed') === 'true' && /saved/i.test(ok1.textContent); await click($$('#events li button')[1]); return pressed && Array.isArray(saved) && saved.includes('e2') && JSON.parse(storage.getItem('saved')).length === 0;", fail: "toggleSaved(id) adds or removes the id and saves; the button shows Saved with aria-pressed=\"true\"." },
            { page: "events.html", label: "Saved events are shown as saved after a reload", seed: { saved: "[\"e3\"]" }, check: nowait("$$('#events li').length === 4") + " return $$('#events li button')[2].getAttribute('aria-pressed') === 'true';", fail: "Render each button's state from isSaved(id)." },
            { page: "saved.html", label: "saved.html lists the saved events from storage", seed: { saved: "[\"e3\",\"e1\"]" }, check: nowait("$$('#saved li').length === 2") + " return text('#saved').includes('Lagos Startup Pitch') && text('#saved').includes('Lagos Tech Meetup') && text('#empty') === '';", fail: "Read getSaved(), find those events in EVENTS and list them." },
            { page: "saved.html", label: "saved.html explains when nothing is saved, even with corrupted storage", seed: { saved: "not json" }, check: nowait("text('#empty') !== ''") + " return text('#empty') === 'You have not saved any events yet' && $$('#saved li').length === 0 && errors().length === 0;", fail: "getSaved() must return [] for missing or corrupted data; then show the empty message." },
            { page: "events.html", viewport: "mobile", label: "No sideways scrolling on a phone", check: nowait("$$('#events li').length === 4") + " return !overflowX();", fail: "Check that nothing you added has a fixed width." },
            { page: "events.html", viewport: "tablet", label: "No sideways scrolling on a tablet", check: nowait("$$('#events li').length === 4") + " return !overflowX();", fail: "Check the tablet layout." },
            { page: "events.html", label: "On a laptop, events are laid out at least two per row", check: nowait("$$('#events li').length === 4") + " const r = $$('#events li').map((x) => Math.round(rect(x).top)); return r[0] === r[1];", fail: "Lay out #events as a grid or flex-wrap with at least two columns on wide screens." },
            { page: "events.html", label: "Every exported function is documented", check: "const files = ['nav.js', 'saved.js', 'events-page.js', 'saved-page.js']; return files.every((f) => { const c = raw(f); const exps = c.match(/export\\s+(async\\s+)?function\\s+\\w+/g) || []; const docs = c.match(/\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+(async\\s+)?function\\s+\\w+/g) || []; return exps.length === docs.length; }) && /export\\s+function\\s+toggleSaved/.test(code('saved.js')) && /export\\s+function\\s+getSaved/.test(code('saved.js'));", fail: "saved.js must export getSaved, toggleSaved and isSaved, and every exported function needs a /** … */ comment." },
          ],
          solution: {
            "nav.js": "/** Render the shared navigation, marking the current page. */\nexport function renderNav(current) {\n  const nav = document.createElement(\"nav\");\n  nav.className = \"site-nav\";\n  nav.setAttribute(\"aria-label\", \"Main\");\n  const ul = document.createElement(\"ul\");\n  for (const [href, label] of [[\"events.html\", \"Events\"], [\"saved.html\", \"Saved\"]]) {\n    const li = document.createElement(\"li\");\n    const a = document.createElement(\"a\");\n    a.href = href;\n    a.textContent = label;\n    if (href === current) a.setAttribute(\"aria-current\", \"page\");\n    li.append(a);\n    ul.append(li);\n  }\n  nav.append(ul);\n  document.querySelector(\"header\").append(nav);\n}\n",
            "saved.js": "/** The saved event ids, or [] if none are saved or the data is corrupted. */\nexport function getSaved() {\n  try {\n    const data = JSON.parse(localStorage.getItem(\"saved\"));\n    return Array.isArray(data) ? data : [];\n  } catch {\n    return [];\n  }\n}\n\n/** Whether an event is saved. */\nexport function isSaved(id) {\n  return getSaved().includes(id);\n}\n\n/** Save an event if it is not saved, or unsave it if it is. */\nexport function toggleSaved(id) {\n  const saved = getSaved();\n  const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];\n  localStorage.setItem(\"saved\", JSON.stringify(next));\n  return next;\n}\n",
            "events-page.js": "import { renderNav } from \"./nav.js\";\nimport { EVENTS } from \"./events-data.js\";\nimport { isSaved, toggleSaved } from \"./saved.js\";\n\nrenderNav(\"events.html\");\nconst list = document.querySelector(\"#events\");\nconst city = document.querySelector(\"#city\");\n\nfunction render() {\n  const shown = EVENTS.filter((e) => city.value === \"all\" || e.city === city.value);\n  list.replaceChildren();\n  for (const e of shown) {\n    const li = document.createElement(\"li\");\n    li.append(`${e.title} · ${e.city} · ${e.date} `);\n    const b = document.createElement(\"button\");\n    b.dataset.id = e.id;\n    b.setAttribute(\"aria-pressed\", String(isSaved(e.id)));\n    b.textContent = isSaved(e.id) ? \"Saved\" : \"Save\";\n    li.append(b);\n    list.append(li);\n  }\n  document.querySelector(\"#count\").textContent = `Showing ${shown.length} of ${EVENTS.length}`;\n}\n\ncity.addEventListener(\"change\", render);\nlist.addEventListener(\"click\", (event) => {\n  const b = event.target.closest(\"button\");\n  if (!b) return;\n  toggleSaved(b.dataset.id);\n  render();\n});\nrender();\n",
            "saved-page.js": "import { renderNav } from \"./nav.js\";\nimport { EVENTS } from \"./events-data.js\";\nimport { getSaved } from \"./saved.js\";\n\nrenderNav(\"saved.html\");\nconst ids = getSaved();\nconst events = EVENTS.filter((e) => ids.includes(e.id));\nconst list = document.querySelector(\"#saved\");\nfor (const e of events) {\n  const li = document.createElement(\"li\");\n  li.textContent = `${e.title} · ${e.city} · ${e.date}`;\n  list.append(li);\n}\ndocument.querySelector(\"#empty\").textContent = events.length ? \"\" : \"You have not saved any events yet\";\n",
            "style.css": `${CSS}.event-grid { display: grid; gap: 16px; padding: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }\n.event-grid li { padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; }\n`,
          },
          hint: "No model answer is shown for the gate. Build saved.js first and test it from the console, then each page module.",
          successMessage: "Phase 5 gate passed: a multi-page application built from shared, documented modules with real state management, responsive at every width. Phase 6 puts it on the internet.",
        },
      },
      decision("a-wd-p5-gate-review", "Ship it properly", "The checks prove the app works. A professional delivers it in a way others can use.", "Your gate app passes every check.", "What completes it as a professional deliverable?",
        ["Commit it to Git with clear messages, add a README explaining the structure and how to run it, and add tests for saved.js", "Working code plus history, documentation and tests is what a team can maintain."],
        [["Nothing: it passes", "Nobody else can work on it yet."], ["Minify the source by hand", "The build tool does that."], ["Delete the comments to make files smaller", "Documentation is part of the brief."]],
        "Phase 5 complete. Phase 6: deployment, accessibility, performance, security and your portfolio."),
    ],
    task: {
      title: "Phase 5 portfolio work",
      intro: "Bring Phase 5 together as professional projects.",
      prompts: [
        "Put each project in its own Git repository with a .gitignore, meaningful commits and a README.",
        "Build each with Vite, split into modules with one job each and documented exports.",
        "Add ESLint and Vitest to each; test every pure module, including error paths with fake fetch.",
        "Run Lighthouse on each and fix the accessibility findings.",
        "Choose the strongest one to deploy in Phase 6 and to present in your portfolio.",
      ],
      closing: "Next: Phase 6 takes your work live.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
