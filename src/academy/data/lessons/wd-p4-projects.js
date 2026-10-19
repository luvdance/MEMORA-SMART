/**
 * RESPONSIVE WEB DEVELOPMENT · PHASE 4 PROJECTS AND ASSESSMENT GATE
 *
 * Curriculum P4.1 – P4.6. Five complete interactive applications from the
 * source curriculum (a to-do list with saved tasks, a weather app, a quiz
 * with scoring, a searchable catalogue and an expense tracker), each checked
 * by using it: typing, clicking, reloading with saved data and answering
 * from mocked APIs. Then the gate: an application that handles input,
 * validates it, updates the DOM, saves data and loads external data with
 * loading and error states, built with no model answer shown.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s-p4-projects";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = `body { font-family: Arial, sans-serif; padding: 16px; max-width: 640px; }
button { min-height: 44px; padding: 8px 14px; }
.done { text-decoration: line-through; color: #6b7280; }
.error { color: #b91c1c; }
.selected { outline: 3px solid #1d4ed8; }
`;

const brief = (id, explain, rows) => ({
  id,
  title: "The brief",
  explain,
  table: { caption: "What it must do.", headers: ["Feature", "Behaviour"], rows },
});

/* ── P4.1 To-do ────────────────────────────────────────────────────── */
const TODO_HTML = page("To-do", `  <h1>To-do</h1>
  <form id="todo-form" novalidate>
    <label for="todo">New task</label>
    <input id="todo" name="todo" autocomplete="off" aria-describedby="todo-error">
    <button type="submit">Add</button>
    <p id="todo-error" class="error"></p>
  </form>
  <ul id="todos"></ul>
  <p id="remaining" role="status"></p>
  <button id="clear-done">Clear completed</button>`);

const TODO_DONE = `const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo");
const error = document.querySelector("#todo-error");
const list = document.querySelector("#todos");

function load() {
  try {
    const data = JSON.parse(localStorage.getItem("todos"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let todos = load();

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function render() {
  list.replaceChildren();
  for (const t of todos) {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.classList.toggle("done", t.done);
    const label = document.createElement("span");
    label.className = "title";
    label.textContent = t.title;
    const toggle = document.createElement("button");
    toggle.className = "toggle";
    toggle.textContent = t.done ? "Undo" : "Done";
    const del = document.createElement("button");
    del.className = "delete";
    del.setAttribute("aria-label", \`Delete \${t.title}\`);
    del.textContent = "Delete";
    li.append(label, " ", toggle, " ", del);
    list.append(li);
  }
  const left = todos.filter((t) => !t.done).length;
  document.querySelector("#remaining").textContent = \`\${left} \${left === 1 ? "task" : "tasks"} left\`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    error.textContent = "Type a task first";
    return;
  }
  error.textContent = "";
  todos = [...todos, { id: String(Date.now() + Math.random()), title, done: false }];
  save();
  render();
  form.reset();
});

list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  if (event.target.closest(".toggle")) {
    todos = todos.map((t) => (t.id === li.dataset.id ? { ...t, done: !t.done } : t));
  } else if (event.target.closest(".delete")) {
    todos = todos.filter((t) => t.id !== li.dataset.id);
  } else {
    return;
  }
  save();
  render();
});

document.querySelector("#clear-done").addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
});

render();
`;

/* ── P4.2 Weather ──────────────────────────────────────────────────── */
const WEATHER_HTML = page("Weather", `  <h1>Weather</h1>
  <form id="weather-form">
    <label for="city">City</label>
    <input id="city" name="city">
    <button type="submit">Search</button>
  </form>
  <p id="status" role="status"></p>
  <section id="current" hidden>
    <h2 id="place"></h2>
    <p id="now"></p>
    <ul id="forecast"></ul>
  </section>
  <p>Recent: <span id="recent"></span></p>`);

const WEATHER_MOCKS = [
  { match: "/api/weather?city=abuja", status: 200, body: { city: "Abuja", tempC: 29, summary: "Sunny", forecast: [{ day: "Mon", high: 31 }, { day: "Tue", high: 30 }, { day: "Wed", high: 28 }] }, delay: 60 },
  { match: "/api/weather?city=kano", status: 200, body: { city: "Kano", tempC: 35, summary: "Hot and dry", forecast: [{ day: "Mon", high: 37 }, { day: "Tue", high: 36 }, { day: "Wed", high: 36 }] }, delay: 60 },
  { match: "/api/weather?city=nowhere", status: 404, body: { error: "not found" }, delay: 60 },
  { match: "/api/weather?city=offline", networkError: true, delay: 60 },
];

const WEATHER_DONE = `const form = document.querySelector("#weather-form");
const status = document.querySelector("#status");
const current = document.querySelector("#current");
const button = form.querySelector("button");

function loadRecent() {
  try {
    const r = JSON.parse(localStorage.getItem("recent"));
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}

let recent = loadRecent();

function showRecent() {
  document.querySelector("#recent").textContent = recent.join(", ");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = form.elements.city.value.trim().toLowerCase();
  if (!city) {
    status.textContent = "Type a city name";
    return;
  }
  status.textContent = "Loading…";
  button.disabled = true;
  try {
    const res = await fetch(\`/api/weather?city=\${encodeURIComponent(city)}\`);
    if (!res.ok) {
      current.hidden = true;
      status.textContent = res.status === 404 ? "City not found" : "Weather service unavailable";
      return;
    }
    const data = await res.json();
    document.querySelector("#place").textContent = data.city;
    document.querySelector("#now").textContent = \`\${data.tempC}°C · \${data.summary}\`;
    const list = document.querySelector("#forecast");
    list.replaceChildren();
    for (const d of data.forecast ?? []) {
      const li = document.createElement("li");
      li.textContent = \`\${d.day}: \${d.high}°C\`;
      list.append(li);
    }
    current.hidden = false;
    status.textContent = "";
    recent = [data.city, ...recent.filter((c) => c !== data.city)].slice(0, 3);
    localStorage.setItem("recent", JSON.stringify(recent));
    showRecent();
  } catch {
    current.hidden = true;
    status.textContent = "Check your connection";
  } finally {
    button.disabled = false;
  }
});

showRecent();
`;

/* ── P4.3 Quiz ─────────────────────────────────────────────────────── */
const QUIZ_HTML = page("Quiz", `  <h1>Naija general knowledge</h1>
  <p id="progress"></p>
  <section id="quiz">
    <h2 id="question"></h2>
    <div id="options"></div>
    <p id="feedback" role="status"></p>
    <button id="next" disabled>Next</button>
  </section>
  <section id="result" hidden>
    <h2>Your score</h2>
    <p id="score"></p>
    <button id="restart">Try again</button>
  </section>`);

const QUIZ_DATA = `const questions = [
  { prompt: "What is the capital of Nigeria?", options: ["Lagos", "Abuja", "Ibadan"], answer: 1 },
  { prompt: "Which river meets the Benue at Lokoja?", options: ["Niger", "Ogun", "Cross"], answer: 0 },
  { prompt: "In what year did Nigeria become independent?", options: ["1963", "1960", "1970"], answer: 1 },
];
`;

const QUIZ_DONE = `${QUIZ_DATA}
let index = 0;
let score = 0;
let answered = false;

const qEl = document.querySelector("#question");
const options = document.querySelector("#options");
const feedback = document.querySelector("#feedback");
const next = document.querySelector("#next");

function show() {
  const q = questions[index];
  document.querySelector("#progress").textContent = \`Question \${index + 1} of \${questions.length}\`;
  qEl.textContent = q.prompt;
  options.replaceChildren();
  q.options.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.dataset.index = i;
    b.textContent = text;
    options.append(b);
  });
  feedback.textContent = "";
  next.disabled = true;
  answered = false;
}

options.addEventListener("click", (event) => {
  const b = event.target.closest(".option");
  if (!b || answered) return;
  answered = true;
  const correct = Number(b.dataset.index) === questions[index].answer;
  if (correct) score++;
  b.classList.add("selected");
  feedback.textContent = correct ? "Correct!" : \`Wrong: the answer is \${questions[index].options[questions[index].answer]}\`;
  for (const o of options.querySelectorAll(".option")) o.disabled = true;
  next.disabled = false;
});

next.addEventListener("click", () => {
  index++;
  if (index < questions.length) {
    show();
    return;
  }
  document.querySelector("#quiz").hidden = true;
  document.querySelector("#result").hidden = false;
  const best = Math.max(score, Number(localStorage.getItem("bestScore") || 0));
  localStorage.setItem("bestScore", best);
  document.querySelector("#score").textContent = \`\${score} of \${questions.length} · best \${best}\`;
});

document.querySelector("#restart").addEventListener("click", () => {
  index = 0;
  score = 0;
  document.querySelector("#quiz").hidden = false;
  document.querySelector("#result").hidden = true;
  show();
});

show();
`;

/* ── P4.4 Catalogue ────────────────────────────────────────────────── */
const CATALOG_HTML = page("Catalogue", `  <h1>Catalogue</h1>
  <label for="search">Search</label>
  <input id="search" type="search">
  <label for="category">Category</label>
  <select id="category">
    <option value="all">All</option>
    <option value="fashion">Fashion</option>
    <option value="home">Home</option>
  </select>
  <label for="sort">Sort by</label>
  <select id="sort">
    <option value="name">Name</option>
    <option value="price-asc">Price: low to high</option>
  </select>
  <p id="status" role="status"></p>
  <ul id="products"></ul>`);

const CATALOG_API = [
  { id: 1, name: "Ankara tote bag", category: "fashion", price: 7500 },
  { id: 2, name: "Woven raffia basket", category: "home", price: 6000 },
  { id: 3, name: "Leather sandals", category: "fashion", price: 18000 },
  { id: 4, name: "Beaded table lamp", category: "home", price: 22000 },
  { id: 5, name: "Adire scarf", category: "fashion", price: 4500 },
];

const CATALOG_DONE = `let products = [];
const list = document.querySelector("#products");
const status = document.querySelector("#status");
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const sort = document.querySelector("#sort");

function visible() {
  const q = search.value.trim().toLowerCase();
  const cat = category.value;
  const shown = products.filter(
    (p) => p.name.toLowerCase().includes(q) && (cat === "all" || p.category === cat)
  );
  return sort.value === "price-asc"
    ? [...shown].sort((a, b) => a.price - b.price)
    : [...shown].sort((a, b) => a.name.localeCompare(b.name));
}

function render() {
  const shown = visible();
  list.replaceChildren();
  for (const p of shown) {
    const li = document.createElement("li");
    li.textContent = \`\${p.name} · ₦\${p.price}\`;
    list.append(li);
  }
  status.textContent = shown.length ? \`\${shown.length} \${shown.length === 1 ? "product" : "products"}\` : "No products match";
}

for (const el of [search, category, sort]) {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
}

async function load() {
  status.textContent = "Loading products…";
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error(res.status);
    products = await res.json();
    render();
  } catch {
    status.textContent = "Products could not be loaded";
  }
}

load();
`;

/* ── P4.5 Expenses ─────────────────────────────────────────────────── */
const EXP_HTML = page("Expenses", `  <h1>Expenses</h1>
  <form id="expense-form" novalidate>
    <label for="title">What</label>
    <input id="title" name="title">
    <label for="amount">Amount (₦)</label>
    <input id="amount" name="amount" inputmode="decimal">
    <label for="category">Category</label>
    <select id="category" name="category">
      <option value="food">Food</option>
      <option value="transport">Transport</option>
      <option value="bills">Bills</option>
    </select>
    <button type="submit">Add</button>
    <p id="form-error" class="error" role="alert"></p>
  </form>
  <ul id="expenses"></ul>
  <p id="total"></p>
  <ul id="by-category"></ul>`);

const EXP_DONE = `const form = document.querySelector("#expense-form");
const error = document.querySelector("#form-error");

function load() {
  try {
    const data = JSON.parse(localStorage.getItem("expenses"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let expenses = load();

const save = () => localStorage.setItem("expenses", JSON.stringify(expenses));
const total = (list) => list.reduce((t, e) => t + e.amount, 0);
function byCategory(list) {
  const out = {};
  for (const e of list) out[e.category] = (out[e.category] || 0) + e.amount;
  return out;
}

function render() {
  const ul = document.querySelector("#expenses");
  ul.replaceChildren();
  for (const e of expenses) {
    const li = document.createElement("li");
    li.dataset.id = e.id;
    const label = document.createElement("span");
    label.textContent = \`\${e.title} · ₦\${e.amount}\`;
    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Remove";
    li.append(label, " ", del);
    ul.append(li);
  }
  document.querySelector("#total").textContent = \`Total: ₦\${total(expenses)}\`;
  const cats = document.querySelector("#by-category");
  cats.replaceChildren();
  for (const [cat, amount] of Object.entries(byCategory(expenses))) {
    const li = document.createElement("li");
    li.textContent = \`\${cat}: ₦\${amount}\`;
    cats.append(li);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  const raw = form.elements.amount.value.trim().replaceAll(",", "");
  const amount = Number(raw);
  if (!title) {
    error.textContent = "Say what the expense was";
    return;
  }
  if (raw === "" || !Number.isFinite(amount) || amount <= 0) {
    error.textContent = "Enter an amount greater than 0";
    return;
  }
  error.textContent = "";
  expenses = [...expenses, { id: String(Date.now() + Math.random()), title, amount, category: form.elements.category.value }];
  save();
  render();
  form.reset();
});

document.querySelector("#expenses").addEventListener("click", (event) => {
  const del = event.target.closest(".delete");
  if (!del) return;
  const id = del.closest("li").dataset.id;
  expenses = expenses.filter((e) => e.id !== id);
  save();
  render();
});

render();
`;

/* ── P4.6 Gate ─────────────────────────────────────────────────────── */
const GATE_HTML = page("Reading list", `  <h1>My reading list</h1>
  <form id="book-form" novalidate>
    <label for="isbn">Book ISBN (10 or 13 digits)</label>
    <input id="isbn" name="isbn" inputmode="numeric" aria-describedby="isbn-error">
    <p id="isbn-error" class="error"></p>
    <button type="submit">Look up and add</button>
  </form>
  <p id="status" role="status"></p>
  <ul id="books"></ul>
  <p id="count"></p>`);

const GATE_MOCKS = [
  { match: "/api/books?isbn=9789780006431", status: 200, body: { isbn: "9789780006431", title: "Things Fall Apart", author: "Chinua Achebe" }, delay: 60 },
  { match: "/api/books?isbn=9780007189885", status: 200, body: { isbn: "9780007189885", title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie" }, delay: 60 },
  { match: "/api/books?isbn=1234567890", status: 404, body: { error: "not found" }, delay: 60 },
  { match: "/api/books?isbn=9999999999", status: 503, body: { error: "down" }, delay: 60 },
  { match: "/api/books?isbn=1111111111", networkError: true, delay: 60 },
];

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

export const LESSONS = [
  /* ═══ P4.1 ═══ */
  {
    id: "wd-l114-todo",
    moduleId: "wd-p4-projects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P4.1"],
    title: "Project: Interactive To-Do Application with Saved Tasks",
    subtitle: "Add, complete, delete and remember",
    estimatedMinutes: 45,
    intro: "The to-do list is the classic first application because it contains everything: input, validation, rendering from state, delegated events and persistence. Build it properly once and you understand most front-end applications.",
    atoms: [
      brief("a-wd-p4-todo-brief", "Build the to-do app. Tasks are { id, title, done } in an array saved to localStorage under \"todos\".", [
        ["Add", "Trimmed title; empty input shows \"Type a task first\" in #todo-error and adds nothing"],
        ["Each task", "An li with a span.title, a .toggle button (Done / Undo) and a .delete button with an aria-label"],
        ["Done / Delete", "Toggle the task's done class, or remove it, using one delegated listener"],
        ["Counter", "#remaining shows \"2 tasks left\" (\"1 task left\" for one)"],
        ["Clear completed", "Removes every done task"],
        ["Persistence", "Every change is saved; a reload shows the same list"],
      ]),
      decision("a-wd-p4-todo-plan", "One source of truth", "Two ways to keep the page and the data in step.", "When a task is marked done, your code could edit that one li directly, or update the array and re-render.", "Which is more reliable as the app grows?",
        ["Update the array, save it, then re-render from it", "The array is the single truth: the page and storage are always copies of it, so they cannot drift apart. Small apps can afford to re-render everything."],
        [["Edit the li directly and remember to update storage separately", "Two copies of the truth, updated by hand, eventually disagree."], ["Store the state in the DOM and read it back when saving", "Fragile: any styling change can break the data."], ["Save only when the page is closed", "Closing is not reliable; data would be lost."]],
        "State → render, every time. React (WD-201) automates exactly this."),
      {
        id: "a-wd-p4-todo-build",
        title: "Build it",
        explain: "Write app.js to the brief. The checks use the app, then reload it with saved tasks.",
        webLab: {
          task: "Build the to-do application to the brief.",
          files: { "index.html": TODO_HTML, "style.css": CSS, "app.js": "// Your to-do application\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Empty input shows \"Type a task first\" and adds nothing", check: "await submit('#todo-form'); return text('#todo-error') === 'Type a task first' && $$('#todos li').length === 0 && submissions().length === 0;", fail: "preventDefault, trim, and show the message when the title is empty." },
            { label: "Adding two tasks lists them and counts them", check: "await type('#todo', 'Buy rice'); await submit('#todo-form'); await type('#todo', 'Call Mum'); await submit('#todo-form'); return $$('#todos li').length === 2 && text('#todos li .title') === 'Buy rice' && text('#remaining') === '2 tasks left' && text('#todo-error') === '';", fail: "Push { id, title, done: false }, save, render and update #remaining." },
            { label: "Done marks a task and the counter updates", check: "await click('#todos li .toggle'); return $('#todos li').classList.contains('done') && text('#remaining') === '1 task left' && text('#todos li .toggle') === 'Undo';", fail: "Use a delegated listener on #todos: .toggle flips done." },
            { label: "Every change is saved as JSON", check: "const saved = JSON.parse(storage.getItem('todos') || 'null'); return Array.isArray(saved) && saved.length === 2 && saved[0].done === true && saved[1].title === 'Call Mum';", fail: "Call localStorage.setItem(\"todos\", JSON.stringify(todos)) after every change." },
            { label: "Clear completed removes the done task", check: "await click('#clear-done'); return $$('#todos li').length === 1 && text('#todos li .title') === 'Call Mum';", fail: "Filter out tasks with done true, save and render." },
            { label: "Delete removes a task; delete buttons have an aria-label", check: "const label = $('#todos .delete').getAttribute('aria-label') || ''; await click('#todos .delete'); return /call mum/i.test(label) && $$('#todos li').length === 0 && text('#remaining') === '0 tasks left';", fail: "Give each .delete an aria-label such as \"Delete Call Mum\" and remove that task." },
            { label: "Reloading restores saved tasks with their state", seed: { todos: "[{\"id\":\"a\",\"title\":\"Read\",\"done\":true},{\"id\":\"b\",\"title\":\"Pay rent\",\"done\":false}]" }, check: "const li = $$('#todos li'); return li.length === 2 && li[0].classList.contains('done') && text('#remaining') === '1 task left';", fail: "On load, parse the saved todos and render them." },
            { label: "Task titles are shown as text, never as HTML", check: "await type('#todo', '<b>bold</b>'); await submit('#todo-form'); return !$('#todos b') && $$('#todos .title').some((s) => s.textContent === '<b>bold</b>');", fail: "Set titles with textContent." },
          ],
          solution: { "app.js": TODO_DONE },
          hint: "Write load, save and render first. Every handler then becomes: change the array, save(), render().",
          successMessage: "A complete, persistent to-do application. Keep it: it becomes the Phase 5 project under Git, Vite and tests.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P4.2 ═══ */
  {
    id: "wd-l115-weather",
    moduleId: "wd-p4-projects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P4.2"],
    title: "Project: Weather Application",
    subtitle: "Live data, every state handled, and recent searches remembered",
    estimatedMinutes: 40,
    intro: "A weather app is the classic API project. In this lab the weather service is simulated so the checks are repeatable; on your own computer you will connect the same code to a real service such as Open-Meteo, which needs no key.",
    atoms: [
      brief("a-wd-p4-weather-brief", "The API is GET /api/weather?city=NAME (lower case), returning { city, tempC, summary, forecast: [{ day, high }] }. It knows abuja and kano; nowhere gives 404; offline fails.", [
        ["Search", "Empty input shows \"Type a city name\"; otherwise \"Loading…\" with the button disabled"],
        ["Success", "#current shown; #place is the city, #now \"29°C · Sunny\", #forecast one li per day as \"Mon: 31°C\""],
        ["404 / other errors / offline", "\"City not found\" / \"Weather service unavailable\" / \"Check your connection\""],
        ["Recent searches", "The last three successful cities, newest first, without repeats, saved in localStorage \"recent\" and shown in #recent"],
      ]),
      decision("a-wd-p4-weather-plan", "Real weather APIs", "On your own computer you will use a real API.", "One free weather API needs no key; another requires a secret key.", "Which is suitable for a frontend-only project?",
        ["The one that needs no key, or one that offers a publishable key restricted to your domain", "A secret key in frontend code is public. Choose an API designed for browser use, or put a server in front of it (Module 29)."],
        [["The one with the secret key, hidden in app.js", "Anything in app.js can be read by every visitor."], ["Either; keys do not matter", "Leaked keys can be abused and billed to you."], ["Neither; frontend apps cannot use APIs", "They can, when the API is designed for it."]],
        "Open-Meteo (no key) is a good choice for this project."),
      {
        id: "a-wd-p4-weather-build",
        title: "Build it",
        explain: "Write app.js to the brief.",
        webLab: {
          task: "Build the weather application to the brief.",
          files: { "index.html": WEATHER_HTML, "style.css": CSS, "app.js": "// Your weather application\n" },
          readOnly: ["index.html", "style.css"],
          mocks: WEATHER_MOCKS,
          tests: [
            { label: "An empty search asks for a city and sends nothing", check: "await submit('#weather-form'); return text('#status') === 'Type a city name' && fetchCalls().length === 0;", fail: "Trim the input; if it is empty, show the message and return." },
            { label: "Loading state while the request runs", check: "await type('#city', 'Abuja'); $('#weather-form').requestSubmit(); await wait(10); return text('#status') === 'Loading…' && $('#weather-form button').disabled;", fail: "Show \"Loading…\" and disable the button before awaiting." },
            { label: "Success shows the current weather and the forecast", check: "await waitFor(() => !$('#current').hidden); const f = $$('#forecast li'); return text('#place') === 'Abuja' && text('#now') === '29°C · Sunny' && f.length === 3 && text(f[0]) === 'Mon: 31°C' && text('#status') === '' && !$('#weather-form button').disabled;", fail: "Fill #place, #now and #forecast, show #current, clear the status, re-enable the button." },
            { label: "404 shows \"City not found\"", check: "await type('#city', 'nowhere'); await submit('#weather-form'); await waitFor(() => text('#status') === 'City not found'); return $('#current').hidden;", fail: "If !res.ok and status is 404, show the message and hide #current." },
            { label: "A network failure shows \"Check your connection\"", check: "await type('#city', 'offline'); await submit('#weather-form'); await waitFor(() => text('#status') === 'Check your connection'); return errors().length === 0 && !$('#weather-form button').disabled;", fail: "catch the failed fetch and show the message; re-enable the button in finally." },
            { label: "Recent searches: newest first, no repeats, saved", check: "for (const c of ['Kano', 'Abuja']) { await type('#city', c); await submit('#weather-form'); await waitFor(() => text('#place') === c); } return text('#recent') === 'Abuja, Kano' && storage.getItem('recent') === '[\"Abuja\",\"Kano\"]';", fail: "On success, put the city first and remove any older copy; save and show the list." },
            { label: "Recent searches are shown on a fresh load", seed: { recent: "[\"Kano\",\"Abuja\"]" }, check: "return text('#recent') === 'Kano, Abuja';", fail: "Load and show the recent list when the page starts." },
          ],
          solution: { "app.js": WEATHER_DONE },
          hint: "[city, ...recent.filter((c) => c !== city)].slice(0, 3) puts the newest first with no repeats.",
          successMessage: "An API-driven app with loading, success, not-found and offline states and saved history. Point it at a real weather API next.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P4.3 ═══ */
  {
    id: "wd-l116-quiz-app",
    moduleId: "wd-p4-projects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P4.3"],
    title: "Project: Quiz Application with Score Tracking",
    subtitle: "The Phase 3 quiz engine, with an interface",
    estimatedMinutes: 40,
    intro: "In Phase 3 you wrote the marking logic of a quiz. Now it gets a real interface: one question at a time, instant feedback, a final score and a saved best score.",
    atoms: [
      brief("a-wd-p4-quiz-brief", "The questions array is given. Each answer is the index of the correct option.", [
        ["Progress", "#progress shows \"Question 1 of 3\""],
        ["Options", "One button.option per option in #options; choosing one disables all of them and enables Next"],
        ["Feedback", "\"Correct!\" or \"Wrong: the answer is …\" in #feedback"],
        ["Result", "After the last question, #quiz hidden, #result shown, #score \"2 of 3 · best 2\""],
        ["Best score", "Saved in localStorage \"bestScore\"; only replaced by a higher score"],
        ["Try again", "Restarts at question 1 with the score reset"],
      ]),
      decision("a-wd-p4-quiz-plan", "Answer once", "A quiz must not let someone change an answer after seeing the feedback.", "After choosing a wrong answer and seeing the correct one, a player clicks the correct option.", "What should happen?",
        ["Nothing: the options are disabled once an answer is chosen", "Otherwise the score could be gamed by clicking every option. Disabling the buttons also tells screen readers they are no longer available."],
        [["The score updates to correct", "That lets players cheat after seeing the answer."], ["The question restarts", "Unexpected and confusing."], ["An error is shown", "Simply preventing the second answer is clearer."]],
        "Guard state changes: an answered question cannot be answered again."),
      {
        id: "a-wd-p4-quiz-build",
        title: "Build it",
        explain: "Write the quiz's interface in app.js.",
        webLab: {
          task: "Build the quiz application to the brief.",
          files: { "index.html": QUIZ_HTML, "style.css": CSS, "app.js": QUIZ_DATA + "\n// Your quiz interface\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "The first question and its three options are shown", check: "return text('#progress') === 'Question 1 of 3' && text('#question') === 'What is the capital of Nigeria?' && $$('#options .option').length === 3 && $('#next').disabled;", fail: "Render the current question's prompt and a button.option per option." },
            { label: "A correct choice says \"Correct!\" and enables Next", check: "await click($$('#options .option')[1]); return text('#feedback') === 'Correct!' && !$('#next').disabled && $$('#options .option').every((b) => b.disabled);", fail: "Compare the chosen index with answer, show the feedback, disable the options, enable Next." },
            { label: "An answered question cannot be answered again", check: "$$('#options .option')[0].click(); await tick(); return text('#feedback') === 'Correct!';", fail: "Ignore clicks once the question has been answered." },
            { label: "A wrong choice names the right answer", check: "await click('#next'); await click($$('#options .option')[2]); return text('#progress') === 'Question 2 of 3' && text('#feedback') === 'Wrong: the answer is Niger';", fail: "Show \"Wrong: the answer is \" plus the correct option's text." },
            { label: "The result shows the score and saves the best", check: "await click('#next'); await click($$('#options .option')[1]); await click('#next'); return $('#quiz').hidden && !$('#result').hidden && text('#score') === '2 of 3 · best 2' && storage.getItem('bestScore') === '2';", fail: "After the last question, show the result and save the best score." },
            { label: "Try again restarts with the score reset", check: "await click('#restart'); return !$('#quiz').hidden && $('#result').hidden && text('#progress') === 'Question 1 of 3';", fail: "Reset index and score, then show the first question." },
            { label: "A lower score does not replace a saved best", seed: { bestScore: "3" }, check: "for (let i = 0; i < 3; i++) { await click($$('#options .option')[2]); await click('#next'); } return text('#score').endsWith('best 3') && storage.getItem('bestScore') === '3';", fail: "Save Math.max(score, saved best)." },
          ],
          solution: { "app.js": QUIZ_DONE },
          hint: "Keep index, score and answered in variables; show() draws the current question from them.",
          successMessage: "The quiz engine now has a full interface, guarded state and a saved best score.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P4.4 ═══ */
  {
    id: "wd-l117-catalog",
    moduleId: "wd-p4-projects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["P4.4"],
    title: "Project: Searchable Product Catalog",
    subtitle: "Load once, then search, filter and sort instantly",
    estimatedMinutes: 40,
    intro: "Online shops load a catalogue once and let people narrow it instantly as they type. The trick is to keep the full list untouched and derive what is shown from it every time a control changes.",
    atoms: [
      brief("a-wd-p4-cat-brief", "GET /api/products returns an array of { id, name, category, price }.", [
        ["Loading", "\"Loading products…\" in #status, then the list; on failure \"Products could not be loaded\""],
        ["Search", "Case-insensitive match on the name, as the visitor types"],
        ["Category and sort", "Filter by category (all, fashion, home); sort by name A–Z or price low to high"],
        ["Each product", "An li \"NAME · ₦PRICE\""],
        ["Count", "#status shows \"3 products\" (\"1 product\"), or \"No products match\""],
      ]),
      decision("a-wd-p4-cat-plan", "Never lose the original list", "Searching removes products from view, but they must come back when the search is cleared.", "As the visitor types, should you filter the products array itself?", "What is the right approach?",
        ["Keep the full array unchanged and compute the visible list from it every time", "Search, filter and sort are views of the data. Overwriting the array would lose products the moment a search narrows it."],
        [["Overwrite products with the filtered result", "Clearing the search would then show nothing."], ["Fetch the API again on every keystroke", "Slow, wasteful, and unnecessary for data already loaded."], ["Hide non-matching li elements with CSS and never re-render", "Works for search alone, but sorting and counting get messy."]],
        "Derived data is computed, not stored."),
      {
        id: "a-wd-p4-cat-build",
        title: "Build it",
        explain: "Write app.js to the brief.",
        webLab: {
          task: "Build the searchable catalogue to the brief.",
          files: { "index.html": CATALOG_HTML, "style.css": CSS, "app.js": "// Your catalogue\n" },
          readOnly: ["index.html", "style.css"],
          mocks: [{ match: "/api/products", status: 200, body: CATALOG_API, delay: 1200 }],
          tests: [
            { label: "Shows \"Loading products…\" while loading", check: "return text('#status') === 'Loading products…';", fail: "Set the status before awaiting fetch." },
            { label: "All five products appear, sorted by name, with a count", check: "await waitFor(() => $$('#products li').length === 5); const li = $$('#products li').map((x) => text(x)); return li[0] === 'Adire scarf · ₦4500' && li[4] === 'Woven raffia basket · ₦6000' && text('#status') === '5 products';", fail: "Render every product sorted A–Z by name, and show the count." },
            { label: "Search matches names as you type, ignoring case", check: "await waitFor(() => $$('#products li').length === 5); await type('#search', 'LEATHER'); return $$('#products li').length === 1 && text('#status') === '1 product';", fail: "Listen for input on #search and filter by name.toLowerCase().includes(query)." },
            { label: "Clearing the search brings every product back", check: "await type('#search', ''); return $$('#products li').length === 5;", fail: "Filter a copy each time; never overwrite the full list." },
            { label: "Category filter and price sort work together", check: "const c = $('#category'); c.value = 'fashion'; c.dispatchEvent(new Event('change', { bubbles: true })); const s = $('#sort'); s.value = 'price-asc'; s.dispatchEvent(new Event('change', { bubbles: true })); await tick(); const li = $$('#products li').map((x) => text(x)); return li.join('|') === 'Adire scarf · ₦4500|Ankara tote bag · ₦7500|Leather sandals · ₦18000';", fail: "Apply the category, then sort by price when \"price-asc\" is chosen." },
            { label: "No match shows \"No products match\"", check: "await type('#search', 'zzz'); return $$('#products li').length === 0 && text('#status') === 'No products match';", fail: "When nothing is visible, show the message." },
          ],
          solution: { "app.js": CATALOG_DONE },
          hint: "One function, visible(), computes the list from the full array and the three controls; render() calls it.",
          successMessage: "Instant search, filter and sort over data loaded once. This is how every online catalogue feels fast.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P4.5 ═══ */
  {
    id: "wd-l118-expense-tracker",
    moduleId: "wd-p4-projects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["P4.5"],
    title: "Project: Expense Tracker with Summaries and Persistent Data",
    subtitle: "The Phase 3 logic with a form, a list, totals and saving",
    estimatedMinutes: 45,
    intro: "Your Phase 3 expense logic becomes a working tracker: a validated form, a list you can remove from, a running total, a breakdown by category, and data that is still there tomorrow.",
    atoms: [
      brief("a-wd-p4-exp-brief", "Expenses are { id, title, amount, category } saved under \"expenses\".", [
        ["Add", "Title required (\"Say what the expense was\"); amount must be a number above 0, commas allowed (\"Enter an amount greater than 0\")"],
        ["List", "Each expense as \"TITLE · ₦AMOUNT\" with a .delete button"],
        ["Total", "#total \"Total: ₦N\""],
        ["By category", "#by-category one li per category: \"food: ₦N\""],
        ["Persistence", "Saved after every change; restored on load"],
      ]),
      decision("a-wd-p4-exp-plan", "Numbers from forms", "The amount field arrives as text, often with commas.", "A user types \"2,500\" in the amount field.", "What should the tracker do?",
        ["Remove the commas, convert with Number(), and check it is a finite number above 0", "People type amounts the way they write them. Accept the comma, store a real number, reject anything that still is not a valid amount."],
        [["Store \"2,500\" as text", "Totals would join strings instead of adding."], ["Reject it", "Unfriendly: the intent is perfectly clear."], ["Use parseInt", "parseInt(\"2,500\") is 2."]],
        "Clean, convert, validate, in that order."),
      {
        id: "a-wd-p4-exp-build",
        title: "Build it",
        explain: "Write app.js to the brief.",
        webLab: {
          task: "Build the expense tracker to the brief.",
          files: { "index.html": EXP_HTML, "style.css": CSS, "app.js": "// Your expense tracker\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "A missing title is refused with a message", check: "await type('#amount', '500'); await submit('#expense-form'); return text('#form-error') === 'Say what the expense was' && $$('#expenses li').length === 0;", fail: "Check the trimmed title first." },
            { label: "A bad or zero amount is refused", check: "await type('#title', 'Lunch'); for (const a of ['abc', '0', '-5', '']) { await type('#amount', a); await submit('#expense-form'); if (text('#form-error') !== 'Enter an amount greater than 0') return false; } return $$('#expenses li').length === 0;", fail: "Convert with Number() after removing commas; require a finite number above 0." },
            { label: "Valid expenses are listed, with commas accepted", check: "await type('#title', 'Lunch'); await type('#amount', '2,500'); await submit('#expense-form'); await type('#title', 'Bus'); await type('#amount', '800'); const c = $('#category'); c.value = 'transport'; await submit('#expense-form'); const li = $$('#expenses li'); return li.length === 2 && li[0].textContent.startsWith('Lunch · ₦2500') && text('#form-error') === '';", fail: "Store the amount as a number and render \"TITLE · ₦AMOUNT\"." },
            { label: "The total and the category breakdown are right", check: "const cats = $$('#by-category li').map((x) => text(x)); return text('#total') === 'Total: ₦3300' && cats.includes('food: ₦2500') && cats.includes('transport: ₦800');", fail: "Recalculate both from the array on every render." },
            { label: "Remove deletes one expense and updates the totals", check: "await click($$('#expenses .delete')[0]); return $$('#expenses li').length === 1 && text('#total') === 'Total: ₦800';", fail: "Delegate clicks on #expenses: remove the expense by its id, save and render." },
            { label: "A fresh load restores saved expenses and summaries", seed: { expenses: "[{\"id\":\"1\",\"title\":\"Rent\",\"amount\":50000,\"category\":\"bills\"},{\"id\":\"2\",\"title\":\"Suya\",\"amount\":1500,\"category\":\"food\"}]" }, check: "return $$('#expenses li').length === 2 && text('#total') === 'Total: ₦51500' && $$('#by-category li').length === 2;", fail: "Load the saved array on start and render it." },
          ],
          solution: { "app.js": EXP_DONE },
          hint: "Reuse your Phase 3 total and byCategory functions unchanged: they are pure.",
          successMessage: "Your Phase 3 logic, unchanged, now powers a full application. That is the payoff of keeping logic separate from the DOM.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P4.6 Gate ═══ */
  {
    id: "wd-l119-p4-gate",
    moduleId: "wd-p4-projects",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["P4.6"],
    gate: true,
    title: "Phase 4 Assessment Gate: A Complete Interactive Application",
    subtitle: "Input, validation, DOM updates, saved data and an API with loading and error states",
    estimatedMinutes: 75,
    intro: "This is the Phase 4 gate. Build a reading list that looks books up by ISBN from an API, validates what is typed, shows every state, and remembers the list. There is no model answer: everything you need is in Modules 20 to 25 and the five projects you just built.",
    atoms: [
      {
        id: "a-wd-p4-gate-brief",
        title: "The gate brief",
        explain: "GET /api/books?isbn=DIGITS returns { isbn, title, author }. Known: 9789780006431 and 9780007189885. 1234567890 gives 404, 9999999999 gives 503, and 1111111111 fails to connect.",
        table: {
          caption: "Requirements.",
          headers: ["Area", "Behaviour"],
          rows: [
            ["Validation", "Spaces and hyphens are ignored; anything that is not 10 or 13 digits shows \"Enter a 10 or 13 digit ISBN\" in #isbn-error, with aria-invalid=\"true\", and sends no request"],
            ["Duplicates", "An ISBN already in the list shows \"Already on your list\" and sends no request"],
            ["Loading", "\"Looking up…\" in #status and the button disabled while waiting"],
            ["Success", "Adds an li \"TITLE by AUTHOR\" with a .remove button; clears the form and the status"],
            ["Errors", "404 \"Book not found\"; other statuses \"The book service is unavailable\"; network failure \"Check your connection\"; the button always re-enabled"],
            ["Count and saving", "#count \"2 books\" (\"1 book\", \"0 books\"); the list saved under \"books\" and restored on load; text shown with textContent"],
          ],
        },
      },
      {
        id: "a-wd-p4-gate-build",
        title: "Build your application",
        explain: "Write app.js. Work through the requirements one row at a time, checking as you go.",
        webLab: {
          task: "Build the reading list to the gate brief.",
          revealSolution: false,
          files: { "index.html": GATE_HTML, "style.css": CSS, "app.js": "// Your reading list\n" },
          readOnly: ["index.html", "style.css"],
          mocks: GATE_MOCKS,
          tests: [
            { label: "Invalid ISBNs are refused, marked and never requested", check: "for (const v of ['', '12345', 'abcdefghij', '12345678901']) { await type('#isbn', v); await submit('#book-form'); if (text('#isbn-error') !== 'Enter a 10 or 13 digit ISBN' || $('#isbn').getAttribute('aria-invalid') !== 'true') return false; } return fetchCalls().length === 0 && submissions().length === 0;", fail: "Remove spaces and hyphens, then require exactly 10 or 13 digits; set the message and aria-invalid." },
            { label: "Loading state with the button disabled", check: "await type('#isbn', '978-978-000-643-1'); $('#book-form').requestSubmit(); await wait(10); return text('#status') === 'Looking up…' && $('#book-form button').disabled && fetchCalls().some((c) => c.url.includes('isbn=9789780006431'));", fail: "Show \"Looking up…\", disable the button, then fetch with the cleaned digits." },
            { label: "A found book is added, and the form and status are cleared", check: "await waitFor(() => $$('#books li').length === 1); return $('#books li').textContent.startsWith('Things Fall Apart by Chinua Achebe') && !!$('#books li .remove') && text('#status') === '' && $('#isbn').value === '' && text('#isbn-error') === '' && $('#isbn').getAttribute('aria-invalid') !== 'true' && text('#count') === '1 book' && !$('#book-form button').disabled;", fail: "On success add \"TITLE by AUTHOR\" with a .remove button, clear the form, the error and the status, update the count." },
            { label: "A duplicate ISBN is refused without a request", check: "const n = fetchCalls().length; await type('#isbn', '9789780006431'); await submit('#book-form'); return text('#isbn-error') === 'Already on your list' && fetchCalls().length === n && $$('#books li').length === 1;", fail: "Before fetching, check whether the cleaned ISBN is already in the list." },
            { label: "404, other errors and network failures each have their message", check: "const tries = [['1234567890', 'Book not found'], ['9999999999', 'The book service is unavailable'], ['1111111111', 'Check your connection']]; for (const [isbn, msg] of tries) { await type('#isbn', isbn); await submit('#book-form'); if (!(await waitFor(() => text('#status') === msg))) return false; if ($('#book-form button').disabled) return false; } return errors().length === 0 && $$('#books li').length === 1;", fail: "Check res.ok and the status code; catch network failures; always re-enable the button." },
            { label: "The list is saved, and Remove removes and saves", check: "const saved = JSON.parse(storage.getItem('books') || 'null'); if (!Array.isArray(saved) || saved.length !== 1 || saved[0].isbn !== '9789780006431') return false; await click('#books .remove'); return $$('#books li').length === 0 && text('#count') === '0 books' && JSON.parse(storage.getItem('books')).length === 0;", fail: "Save the array under \"books\" as JSON after adding and removing." },
            { label: "A fresh load restores the saved list", seed: { books: "[{\"isbn\":\"9780007189885\",\"title\":\"Half of a Yellow Sun\",\"author\":\"Chimamanda Ngozi Adichie\"},{\"isbn\":\"9789780006431\",\"title\":\"Things Fall Apart\",\"author\":\"Chinua Achebe\"}]" }, check: "return $$('#books li').length === 2 && text('#count') === '2 books' && $('#books li').textContent.startsWith('Half of a Yellow Sun by');", fail: "Load and render the saved books when the page starts." },
            { label: "Corrupted saved data does not break the page", seed: { books: "{broken" }, check: "return errors().length === 0 && text('#count') === '0 books';", fail: "Wrap JSON.parse in try...catch and fall back to []." },
            { label: "Book details are shown as text, never as HTML", seed: { books: "[{\"isbn\":\"1\",\"title\":\"<img src=x onerror=alert(1)>\",\"author\":\"X\"}]" }, check: "return !$('#books img') && $('#books li').textContent.includes('<img');", fail: "Use textContent for titles and authors." },
          ],
          solution: { "app.js": "const form = document.querySelector(\"#book-form\");\nconst input = document.querySelector(\"#isbn\");\nconst error = document.querySelector(\"#isbn-error\");\nconst status = document.querySelector(\"#status\");\nconst button = form.querySelector(\"button\");\n\nfunction load() {\n  try {\n    const data = JSON.parse(localStorage.getItem(\"books\"));\n    return Array.isArray(data) ? data : [];\n  } catch {\n    return [];\n  }\n}\n\nlet books = load();\nconst save = () => localStorage.setItem(\"books\", JSON.stringify(books));\n\nfunction render() {\n  const ul = document.querySelector(\"#books\");\n  ul.replaceChildren();\n  for (const b of books) {\n    const li = document.createElement(\"li\");\n    li.dataset.isbn = b.isbn;\n    li.append(`${b.title} by ${b.author} `);\n    const rm = document.createElement(\"button\");\n    rm.className = \"remove\";\n    rm.textContent = \"Remove\";\n    li.append(rm);\n    ul.append(li);\n  }\n  document.querySelector(\"#count\").textContent = `${books.length} ${books.length === 1 ? \"book\" : \"books\"}`;\n}\n\nfunction fieldError(message) {\n  error.textContent = message;\n  input.setAttribute(\"aria-invalid\", message ? \"true\" : \"false\");\n}\n\nform.addEventListener(\"submit\", async (event) => {\n  event.preventDefault();\n  const isbn = input.value.replace(/[\\s-]/g, \"\");\n  if (!/^(\\d{10}|\\d{13})$/.test(isbn)) return fieldError(\"Enter a 10 or 13 digit ISBN\");\n  if (books.some((b) => b.isbn === isbn)) return fieldError(\"Already on your list\");\n  fieldError(\"\");\n  status.textContent = \"Looking up…\";\n  button.disabled = true;\n  try {\n    const res = await fetch(`/api/books?isbn=${isbn}`);\n    if (!res.ok) {\n      status.textContent = res.status === 404 ? \"Book not found\" : \"The book service is unavailable\";\n      return;\n    }\n    const book = await res.json();\n    books = [...books, { isbn, title: book.title, author: book.author }];\n    save();\n    render();\n    form.reset();\n    status.textContent = \"\";\n  } catch {\n    status.textContent = \"Check your connection\";\n  } finally {\n    button.disabled = false;\n  }\n});\n\ndocument.querySelector(\"#books\").addEventListener(\"click\", (event) => {\n  const rm = event.target.closest(\".remove\");\n  if (!rm) return;\n  const isbn = rm.closest(\"li\").dataset.isbn;\n  books = books.filter((b) => b.isbn !== isbn);\n  save();\n  render();\n});\n\nrender();\n" },
          hint: "No model answer is shown for the gate. Build it in the order of the requirements table, and check after each row.",
          successMessage: "Phase 4 gate passed. You can build complete interactive applications: validated input, live DOM updates, saved data and external data with every state handled. Phase 5 makes your workflow professional.",
        },
      },
      decision("a-wd-p4-gate-review", "Before you call it finished", "The checks prove the behaviour. A professional also checks what they cannot.", "Your reading list passes every check. You have not yet tried it with only a keyboard or on a phone.", "What do you do?",
        ["Test it with the keyboard and a screen reader, and on a phone, and fix what you find", "Checks prove behaviour; usability needs people. Ten minutes of manual testing catches what no checklist does."],
        [["Ship it: the checks passed", "Some failures, such as an unreachable button, are invisible to these checks."], ["Rewrite it with a framework", "Unnecessary; it works."], ["Add more features first", "Make what exists work for everyone first."]],
        "Phase 4 complete. Next: Git, npm, Vite and tests."),
    ],
    task: {
      title: "Phase 4 portfolio work",
      intro: "Bring your Phase 4 applications together.",
      prompts: [
        "Rebuild the five projects on your own computer, connected to real APIs where they use one (Open-Meteo for weather, a free product or book API).",
        "Give each the responsive layout and accessible styling from Phase 2.",
        "Test each with the keyboard only, and on a real phone.",
        "Split at least one into modules: data, logic and view.",
        "Record a short screen video of each working, for your portfolio.",
      ],
      closing: "Phase 5 puts these projects under version control, a build tool and automated tests.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
