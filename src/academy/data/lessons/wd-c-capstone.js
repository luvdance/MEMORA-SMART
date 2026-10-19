/**
 * RESPONSIVE WEB DEVELOPMENT · FINAL CAPSTONE PROJECT
 *
 * Curriculum C.1 – C.8. The course ends with one complete application. Two
 * guided lessons build a booking site for a hair studio piece by piece: a
 * mobile-first, accessible shell shared by several pages (C.1, C.2), then
 * components, a data layer, validation and error handling (C.3 – C.5). The
 * final gate is a different application built from a brief with no model
 * answer, checked at phone, tablet and laptop widths (C.6), followed by the
 * Git, documentation, deployment and presentation work that completes the
 * capstone (C.7, C.8).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-sc-capstone";

const nowait = (n) => `await waitFor(() => ${n});`;

const page = (title, script, body) => `<!DOCTYPE html>
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

/* ── The studio: shared by Lessons 153 and 154 ─────────────────────── */

const STUDIO_CSS = `*, *::before, *::after { box-sizing: border-box; }
:root { --brand: #6b21a8; --ink: #1f2937; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: var(--ink); }
main { width: min(100% - 32px, 1000px); margin-inline: auto; padding-block: 16px; }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 16px; top: 16px; z-index: 10; background: #fff; padding: 8px; }
:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
`;

const SHELL_CSS = `.site-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 16px; background: var(--brand); }
.brand { color: #fff; font-weight: 700; padding: 12px 0; }
.menu-toggle { min-height: 44px; padding: 8px 16px; }
.site-header nav { flex-basis: 100%; }
#site-menu { display: none; margin: 0; padding: 0; list-style: none; }
.site-header nav.open #site-menu { display: block; }
#site-menu a { display: block; padding: 12px 0; color: #fff; }
#site-menu a[aria-current="page"] { font-weight: 700; text-decoration: underline; }

@media (min-width: 768px) {
  .menu-toggle { display: none; }
  .site-header nav { flex-basis: auto; }
  #site-menu { display: flex; gap: 24px; }
}
`;

const STUDIO_PAGES = [
  ["index.html", "Services"],
  ["book.html", "Book"],
];

const layoutJs = (pages, brand) => `/**
 * Renders the site header into <header>: the brand, a menu button for small
 * screens and the main navigation, with the current page marked.
 * @param {string} current the current page's file name, such as "${pages[1][0]}"
 */
export function renderHeader(current) {
  const header = document.querySelector("header");

  const home = document.createElement("a");
  home.className = "brand";
  home.href = "${pages[0][0]}";
  home.textContent = "${brand}";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "menu-toggle";
  toggle.textContent = "Menu";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "site-menu");

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Main");
  const list = document.createElement("ul");
  list.id = "site-menu";
  for (const [href, label] of ${JSON.stringify(pages)}) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (href === current) a.setAttribute("aria-current", "page");
    li.append(a);
    list.append(li);
  }
  nav.append(list);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });

  header.append(home, toggle, nav);
}
`;

const STUDIO_LAYOUT_DONE = layoutJs(STUDIO_PAGES, "Ada's Hair Studio");

const SHELL_INDEX = page("Services · Ada's Hair Studio", "index.js", `  <div class="header"></div>
  <div class="content">
    <h1>Our services</h1>
    <p>Hair care in Yaba, Lagos, open Tuesday to Saturday.</p>
    <ul id="services"></ul>
  </div>`);

const SHELL_BOOK = page("Book · Ada's Hair Studio", "book.js", `  <div class="header"></div>
  <div class="content">
    <h1>Book an appointment</h1>
    <p>Choose a service and we will confirm by SMS.</p>
  </div>`);

const shellDone = (html) =>
  html
    .replace('  <div class="header"></div>\n  <div class="content">', '  <a class="skip-link" href="#main">Skip to main content</a>\n  <header class="site-header"></header>\n  <main id="main">')
    .replace(/ {2}<\/div>\n<\/body>/, "  </main>\n</body>");

const SERVICES = [
  { id: "cut", name: "Haircut and style", price: 8000, minutes: 45 },
  { id: "braids", name: "Knotless braids", price: 25000, minutes: 240 },
  { id: "treat", name: "Deep conditioning treatment", price: 6000, minutes: 30 },
];

const STUDIO_INDEX = shellDone(SHELL_INDEX).replace('<ul id="services"></ul>', '<p id="status" role="status"></p>\n    <ul id="services" class="service-grid"></ul>');

const STUDIO_BOOK = shellDone(SHELL_BOOK).replace(
  "    <p>Choose a service and we will confirm by SMS.</p>",
  `    <p>Choose a service and we will confirm by SMS.</p>
    <form id="booking" novalidate>
      <label for="name">Your name</label>
      <input id="name" name="name" autocomplete="name" aria-describedby="name-error">
      <p class="error" id="name-error"></p>
      <label for="phone">Phone number</label>
      <input id="phone" name="phone" type="tel" autocomplete="tel" aria-describedby="phone-error">
      <p class="error" id="phone-error"></p>
      <label for="service">Service</label>
      <select id="service" name="service" aria-describedby="service-error">
        <option value="">Choose a service</option>
      </select>
      <p class="error" id="service-error"></p>
      <button type="submit">Book</button>
    </form>
    <p id="result" role="status"></p>`
);

const STUDIO_CSS_FULL = `${STUDIO_CSS}${SHELL_CSS}.service-grid { display: grid; gap: 16px; padding: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.service-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
label, input, select { display: block; width: 100%; max-width: 420px; }
input, select, button { min-height: 44px; margin-top: 4px; }
.error { color: #b91c1c; min-height: 1.5em; margin: 4px 0 12px; }
`;

const STUDIO_API_DONE = `/**
 * Fetches JSON from our API. Throws an Error with the server's message when
 * the request fails, so pages can show it.
 */
async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || \`Request failed with status \${res.status}\`);
  return data;
}

/** Resolves to every service: [{ id, name, price, minutes }]. */
export function getServices() {
  return request("/api/services");
}

/**
 * Sends a booking and resolves to the server's reply, { reference }.
 * @param {{ name: string, phone: string, service: string }} booking
 */
export function createBooking(booking) {
  return request("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
}
`;

const STUDIO_COMPONENTS_DONE = `/** Formats naira, such as ₦25,000. */
export function naira(amount) {
  return \`₦\${amount.toLocaleString("en-NG")}\`;
}

/**
 * One service as a card: its name, price and length, and a link to book it.
 * @param {{ name: string, price: number, minutes: number }} service
 * @returns {HTMLLIElement}
 */
export function serviceCard(service) {
  const card = document.createElement("li");
  card.className = "service-card";
  const title = document.createElement("h2");
  title.textContent = service.name;
  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = \`\${naira(service.price)} · \${service.minutes} min\`;
  const link = document.createElement("a");
  link.href = "book.html";
  link.textContent = \`Book \${service.name}\`;
  card.append(title, meta, link);
  return card;
}
`;

const STUDIO_INDEX_JS_DONE = `import { renderHeader } from "./layout.js";
import { getServices } from "./api.js";
import { serviceCard } from "./components.js";

renderHeader("index.html");

const status = document.querySelector("#status");
const list = document.querySelector("#services");

async function showServices() {
  status.textContent = "Loading services…";
  try {
    const services = await getServices();
    list.replaceChildren(...services.map(serviceCard));
    status.textContent = "";
  } catch (error) {
    console.error(error);
    status.textContent = "Could not load services. Please refresh the page.";
  }
}

showServices();
`;

const STUDIO_BOOK_JS_DONE = `import { renderHeader } from "./layout.js";
import { getServices, createBooking } from "./api.js";

renderHeader("book.html");

const form = document.querySelector("#booking");
const result = document.querySelector("#result");
const select = document.querySelector("#service");

// Each field's rule: a function returning an error message, or "" if valid.
const RULES = {
  name: (v) => (v.trim() ? "" : "Enter your name."),
  phone: (v) => (/^0[789][01]\\d{8}$/.test(v.replace(/\\s/g, "")) ? "" : "Enter a Nigerian mobile number, such as 0803 123 4567."),
  service: (v) => (v ? "" : "Choose a service."),
};

async function fillServices() {
  try {
    for (const s of await getServices()) select.append(new Option(s.name, s.id));
  } catch {
    result.textContent = "Could not load services. Please refresh the page.";
  }
}

function validate() {
  let firstInvalid = null;
  for (const [name, rule] of Object.entries(RULES)) {
    const field = form.elements[name];
    const message = rule(field.value);
    document.querySelector(\`#\${name}-error\`).textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (message && !firstInvalid) firstInvalid = field;
  }
  firstInvalid?.focus();
  return !firstInvalid;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.textContent = "";
  if (!validate()) return;
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const reply = await createBooking({
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.replace(/\\s/g, ""),
      service: form.elements.service.value,
    });
    result.textContent = \`Booked! Your reference is \${reply.reference}.\`;
  } catch (error) {
    result.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

fillServices();
`;

/* ── The gate: Eko Tutors ──────────────────────────────────────────── */

const TUTORS = [
  { id: "t1", name: "Mrs. Adaeze Okafor", subject: "Mathematics", rate: 5000 },
  { id: "t2", name: "Mr. Tunde Bakare", subject: "Physics", rate: 6000 },
  { id: "t3", name: "Ms. Halima Musa", subject: "Mathematics", rate: 4500 },
  { id: "t4", name: "Mr. Femi Adeyemi", subject: "English", rate: 4000 },
];

const GATE_TUTORS_HTML = page("Tutors · Eko Tutors", "tutors-page.js", "  <!-- Write this page's body. -->");
const GATE_REQUEST_HTML = page("Request a lesson · Eko Tutors", "request-page.js", "  <!-- Write this page's body. -->");

const GATE_MOCKS = [
  { match: "/api/tutors", status: 200, body: TUTORS, delay: 1000 },
  { match: "/api/requests", method: "POST", status: 201, body: { reference: "REQ-311" }, delay: 60 },
];

const FIELDS = ["name", "email", "subject", "message"];
const MESSAGES = {
  name: "Enter your name.",
  email: "Enter a valid email address.",
  subject: "Choose a subject.",
  message: "Tell us a little more (at least 20 characters).",
};

const fill = (v) =>
  `await type('#name', ${JSON.stringify(v.name)}); await type('#email', ${JSON.stringify(v.email)}); await type('#subject', ${JSON.stringify(v.subject)}); await type('#message', ${JSON.stringify(v.message)});`;

const VALID = { name: "Kemi Lawal", email: "kemi@example.com", subject: "Physics", message: "My son needs help with SS2 physics before exams." };

const GATE_LAYOUT = layoutJs([["tutors.html", "Tutors"], ["request.html", "Request a lesson"]], "Eko Tutors");

const GATE_SOLUTION = {
  "tutors.html": GATE_TUTORS_HTML.replace(
    "  <!-- Write this page's body. -->",
    `  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header"></header>
  <main id="main">
    <h1>Find a tutor</h1>
    <label for="subject">Subject</label>
    <select id="subject">
      <option value="all">All subjects</option>
      <option value="Mathematics">Mathematics</option>
      <option value="Physics">Physics</option>
      <option value="English">English</option>
    </select>
    <p id="status" role="status"></p>
    <ul id="tutors" class="card-grid"></ul>
  </main>`
  ),
  "request.html": GATE_REQUEST_HTML.replace(
    "  <!-- Write this page's body. -->",
    `  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header"></header>
  <main id="main">
    <h1>Request a lesson</h1>
    <form id="request" novalidate>
${FIELDS.map((f) => {
  const label = { name: "Your name", email: "Email", subject: "Subject", message: "What do you need help with?" }[f];
  const control =
    f === "subject"
      ? `<select id="subject" name="subject" aria-describedby="subject-error">\n        <option value="">Choose a subject</option>\n        <option>Mathematics</option>\n        <option>Physics</option>\n        <option>English</option>\n      </select>`
      : f === "message"
        ? `<textarea id="message" name="message" aria-describedby="message-error"></textarea>`
        : `<input id="${f}" name="${f}" ${f === "email" ? 'type="email" autocomplete="email"' : 'autocomplete="name"'} aria-describedby="${f}-error">`;
  return `      <label for="${f}">${label}</label>\n      ${control}\n      <p class="error" id="${f}-error"></p>`;
}).join("\n")}
      <button type="submit">Send request</button>
    </form>
    <p id="result" role="status"></p>
  </main>`
  ),
  "style.css": `${STUDIO_CSS.replace("--brand: #6b21a8", "--brand: #0f766e")}${SHELL_CSS}.card-grid { display: grid; gap: 16px; padding: 0; list-style: none; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.tutor-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
label, input, select, textarea { display: block; width: 100%; max-width: 480px; }
input, select, textarea, button { min-height: 44px; margin-top: 4px; }
.error { color: #b91c1c; min-height: 1.5em; margin: 4px 0 12px; }
`,
  "layout.js": GATE_LAYOUT,
  "api.js": `/** Fetches JSON, throwing an Error with the server's message on failure. */
async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || \`Request failed with status \${res.status}\`);
  return data;
}

/** Resolves to every tutor: [{ id, name, subject, rate }]. */
export function getTutors() {
  return request("/api/tutors");
}

/** Sends a lesson request; resolves to { reference }. */
export function sendRequest(lesson) {
  return request("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lesson),
  });
}
`,
  "components.js": `/** One tutor as a card with name, subject, hourly rate and a request link. */
export function tutorCard(tutor) {
  const li = document.createElement("li");
  li.className = "tutor-card";
  const h2 = document.createElement("h2");
  h2.textContent = tutor.name;
  const subject = document.createElement("p");
  subject.className = "subject";
  subject.textContent = tutor.subject;
  const rate = document.createElement("p");
  rate.className = "rate";
  rate.textContent = \`₦\${tutor.rate.toLocaleString("en-NG")} per hour\`;
  const a = document.createElement("a");
  a.href = "request.html";
  a.textContent = \`Request a lesson with \${tutor.name}\`;
  li.append(h2, subject, rate, a);
  return li;
}
`,
  "tutors-page.js": `import { renderHeader } from "./layout.js";
import { getTutors } from "./api.js";
import { tutorCard } from "./components.js";

renderHeader("tutors.html");
const status = document.querySelector("#status");
const list = document.querySelector("#tutors");
const subject = document.querySelector("#subject");
let tutors = [];

function render() {
  const shown = tutors.filter((t) => subject.value === "all" || t.subject === subject.value);
  list.replaceChildren(...shown.map(tutorCard));
  status.textContent = \`Showing \${shown.length} of \${tutors.length} tutors\`;
}

async function start() {
  status.textContent = "Loading tutors…";
  try {
    tutors = await getTutors();
    render();
  } catch (error) {
    console.error(error);
    status.textContent = "Could not load tutors. Please refresh the page.";
  }
}

subject.addEventListener("change", render);
start();
`,
  "request-page.js": `import { renderHeader } from "./layout.js";
import { sendRequest } from "./api.js";

renderHeader("request.html");
const form = document.querySelector("#request");
const result = document.querySelector("#result");

const RULES = {
  name: (v) => (v.trim() ? "" : ${JSON.stringify(MESSAGES.name)}),
  email: (v) => (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.trim()) ? "" : ${JSON.stringify(MESSAGES.email)}),
  subject: (v) => (v ? "" : ${JSON.stringify(MESSAGES.subject)}),
  message: (v) => (v.trim().length >= 20 ? "" : ${JSON.stringify(MESSAGES.message)}),
};

function validate() {
  let first = null;
  for (const [name, rule] of Object.entries(RULES)) {
    const field = form.elements[name];
    const message = rule(field.value);
    document.querySelector(\`#\${name}-error\`).textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (message && !first) first = field;
  }
  first?.focus();
  return !first;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.textContent = "";
  if (!validate()) return;
  try {
    const reply = await sendRequest(Object.fromEntries(Object.keys(RULES).map((k) => [k, form.elements[k].value.trim()])));
    result.textContent = \`Request sent. Your reference is \${reply.reference}.\`;
  } catch (error) {
    result.textContent = error.message;
  }
});
`,
};

const GATE_PAGES = { "tutors.html": "tutors-page.js", "request.html": "request-page.js" };

const GATE_TESTS = [
  { page: "tutors.html", label: "tutors.html shows \"Loading tutors…\" while the tutors load", check: "return text('#status') === 'Loading tutors…';", fail: "Set #status before awaiting getTutors()." },
  ...Object.entries(GATE_PAGES).flatMap(([p, script]) => [
    { page: p, label: `${p}: a skip link first, a header and one main#main`, check: "const f = document.body.firstElementChild; return f.tagName === 'A' && f.getAttribute('href') === '#main' && !!$('header') && $$('main').length === 1 && $('main').id === 'main';", fail: "Body: skip link to #main, then <header>, then <main id=\"main\">." },
    { page: p, label: `${p}: the shared header marks this page as current`, check: `const links = $$('header nav[aria-label="Main"] a'); const cur = $$('header nav a[aria-current="page"]'); return links.length === 2 && cur.length === 1 && cur[0].getAttribute('href') === '${p}' && /renderHeader/.test(code('${script}')) && /from\\s+["']\\.\\/layout\\.js["']/.test(code('${script}'));`, fail: `${script} must import renderHeader from ./layout.js and call it with "${p}".` },
  ]),
  { page: "tutors.html", label: "Every tutor is a card with name, subject, rate and a request link", check: nowait("$$('#tutors li').length === 4") + " const c = $$('#tutors li')[0]; const a = c.querySelector('a'); return c.classList.contains('tutor-card') && text(c.querySelector('h2')) === 'Mrs. Adaeze Okafor' && text(c.querySelector('.subject')) === 'Mathematics' && text(c.querySelector('.rate')) === '₦5,000 per hour' && a?.getAttribute('href') === 'request.html' && text(a) === 'Request a lesson with Mrs. Adaeze Okafor' && text('#status') === 'Showing 4 of 4 tutors';", fail: "tutorCard(tutor) → li.tutor-card with h2, p.subject, p.rate and a link; then \"Showing 4 of 4 tutors\"." },
  { page: "tutors.html", label: "Filtering by subject updates the list and the count", check: nowait("$$('#tutors li').length === 4") + " await type('#subject', 'Mathematics'); const n = $$('#tutors li').length; const s = text('#status'); await type('#subject', 'all'); return n === 2 && s === 'Showing 2 of 4 tutors' && $$('#tutors li').length === 4;", fail: "On change of #subject, re-render only that subject's tutors (\"all\" shows everyone)." },
  { page: "tutors.html", label: "On a laptop the menu is visible, the menu button is not, and tutors sit at least two per row", check: nowait("$$('#tutors li').length === 4") + " const r = $$('#tutors li').map((x) => Math.round(rect(x).top)); return visible('#site-menu') && !visible('.menu-toggle') && r[0] === r[1];", fail: "At 768px and up: hide .menu-toggle, show #site-menu; lay #tutors out in a grid." },
  { page: "tutors.html", label: "When the API fails, tutors.html explains, without errors", mocks: [{ match: "/api/tutors", status: 500, body: { error: "Server error" }, delay: 40 }], check: nowait("text('#status') === 'Could not load tutors. Please refresh the page.'") + " return errors().length === 0;", fail: "Catch the failure and show \"Could not load tutors. Please refresh the page.\"" },
  { page: "tutors.html", viewport: "mobile", label: "On a phone the menu starts closed and the button opens and closes it", check: "const t = $('.menu-toggle'); if (!t || visible('#site-menu') || t.getAttribute('aria-controls') !== 'site-menu' || t.getAttribute('aria-expanded') !== 'false') return false; await click(t); const open = visible('#site-menu') && t.getAttribute('aria-expanded') === 'true' && $$('#site-menu a').every((a) => rect(a).height >= 44); await click(t); return open && !visible('#site-menu') && t.getAttribute('aria-expanded') === 'false';", fail: "button.menu-toggle with aria-controls=\"site-menu\" and aria-expanded; open links at least 44px tall." },
  { page: "tutors.html", viewport: "mobile", label: "tutors.html on a phone: one column, no sideways scrolling", check: nowait("$$('#tutors li').length === 4") + " const c = $$('#tutors li'); return !overflowX() && rect(c[1]).top >= rect(c[0]).bottom;", fail: "Nothing may be wider than the screen; cards stack." },
  { page: "tutors.html", viewport: "tablet", label: "tutors.html on a tablet: no sideways scrolling", check: nowait("$$('#tutors li').length === 4") + " return !overflowX();", fail: "Check the tablet layout." },
  { page: "request.html", viewport: "mobile", label: "request.html on a phone: no sideways scrolling", check: "return !overflowX();", fail: "Form fields should be width: 100% with a max-width." },
  { page: "request.html", label: "Every field has a label and an error element linked with aria-describedby", check: `return ${JSON.stringify(FIELDS)}.every((f) => { const el = $('#' + f); return el && el.labels.length === 1 && (el.getAttribute('aria-describedby') || '').split(/\\s+/).includes(f + '-error') && !!$('#' + f + '-error'); }) && $('#subject').tagName === 'SELECT' && $('#message').tagName === 'TEXTAREA';`, fail: "#name, #email, #subject (a select) and #message (a textarea), each with a label and aria-describedby=\"<id>-error\"." },
  { page: "request.html", label: "Sending an empty form shows every error, marks the fields and focuses the first", check: `await submit('#request'); const m = ${JSON.stringify(MESSAGES)}; return Object.keys(m).every((f) => text('#' + f + '-error') === m[f] && $('#' + f).getAttribute('aria-invalid') === 'true') && document.activeElement === $('#name') && !fetchCalls().some((c) => c.url.includes('/api/requests'));`, fail: "Validate every field on submit (use novalidate on the form), set aria-invalid, focus the first invalid field and send nothing." },
  { page: "request.html", label: "A short message and a bad email are caught, the rest are cleared", check: `${fill({ ...VALID, email: "kemi@", message: "Physics help" })} await submit('#request'); return text('#email-error') !== '' && text('#message-error') !== '' && text('#name-error') === '' && text('#subject-error') === '' && $('#name').getAttribute('aria-invalid') !== 'true' && document.activeElement === $('#email');`, fail: "Re-check every field on each submit and clear the errors that are fixed." },
  { page: "request.html", label: "A valid request is POSTed and confirmed with the server's reference", check: `${fill(VALID)} await submit('#request'); await waitFor(() => text('#result') !== ''); const c = fetchCalls().find((x) => x.url.includes('/api/requests')); let b = {}; try { b = JSON.parse(c.body); } catch { return false; } return c.method === 'POST' && b.name === 'Kemi Lawal' && b.email === 'kemi@example.com' && b.subject === 'Physics' && b.message.length >= 20 && text('#result') === 'Request sent. Your reference is REQ-311.' && ${JSON.stringify(FIELDS)}.every((f) => $('#' + f).getAttribute('aria-invalid') !== 'true');`, fail: "POST JSON { name, email, subject, message } to /api/requests and show \"Request sent. Your reference is REQ-311.\"" },
  { page: "request.html", label: "When the server refuses, its message is shown and the answers are kept", mocks: [GATE_MOCKS[0], { match: "/api/requests", method: "POST", status: 503, body: { error: "Requests are paused for maintenance. Please try again later." }, delay: 40 }], check: `${fill(VALID)} await submit('#request'); await waitFor(() => text('#result') !== ''); return text('#result') === 'Requests are paused for maintenance. Please try again later.' && $('#name').value === 'Kemi Lawal' && errors().length === 0;`, fail: "If the response is not ok, show the server's error in #result." },
  { page: "tutors.html", label: "A data layer and documented components: no fetch in the page scripts", check: "const need = { 'layout.js': ['renderHeader'], 'api.js': ['getTutors', 'sendRequest'], 'components.js': ['tutorCard'] }; const documented = Object.keys(need).every((f) => { const c = raw(f); const exps = c.match(/export\\s+(async\\s+)?function\\s+\\w+/g) || []; const docs = c.match(/\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+(async\\s+)?function\\s+\\w+/g) || []; return exps.length > 0 && exps.length === docs.length && need[f].every((n) => new RegExp('export\\\\s+(async\\\\s+)?function\\\\s+' + n + '\\\\b').test(c)); }); return documented && !/fetch\\(/.test(code('tutors-page.js')) && !/fetch\\(/.test(code('request-page.js'));", fail: "layout.js exports renderHeader, api.js getTutors and sendRequest, components.js tutorCard, each with a /** … */ comment; only api.js calls fetch." },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 153 · C.1 – C.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l153-capstone-shell",
    moduleId: "wd-c-capstone",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["C.1", "C.2"],
    title: "Capstone: A Mobile-First, Accessible, Multi-Page Shell",
    subtitle: "The brief, the plan, and the structure every page shares",
    estimatedMinutes: 30,
    intro: "The capstone is one complete application of your own, built to eight requirements. These lessons build an example together (a booking site for Ada's Hair Studio) so you see each requirement met; the gate then asks you to build a different application alone.",

    atoms: [
      {
        id: "a-wd-capstone-brief",
        title: "The capstone brief",
        explain:
          "Choose an application a real person or business would use: a booking site, a store front, a dashboard, a learning platform. Write its requirements and plan it as in Module 32. It must meet all eight requirements below, and each lesson in this module takes you through some of them with the studio example.",
        table: {
          caption: "The eight capstone requirements.",
          headers: ["", "Requirement", "What it means in practice"],
          rows: [
            ["C.1", "Mobile-first, accessible UI", "Designed for phones first; landmarks, labels, keyboard use, contrast and focus all pass review"],
            ["C.2", "Multiple pages or routes", "At least two real pages sharing a header and navigation"],
            ["C.3", "Reusable components, clean structure", "Pieces built once from data, one job per module"],
            ["C.4", "Form validation and error handling", "Helpful errors next to fields, server errors shown, no crashes"],
            ["C.5", "API integration or data layer", "Data fetched in one module, with loading and failure states"],
            ["C.6", "Responsive across devices", "No sideways scrolling and a sensible layout at phone, tablet and laptop widths"],
            ["C.7", "GitHub and documentation", "A repository with meaningful history, a README and decision records"],
            ["C.8", "Live deployment and presentation", "Deployed on HTTPS, in your portfolio, and presented"],
          ],
        },
      },
      {
        id: "a-wd-capstone-mobile-first",
        title: "Mobile-first, accessible UI",
        explain:
          "Start every page with its phone layout: a single column, content in reading order, tap targets at least 44px, and navigation that collapses behind a menu button. Build the accessibility in from the first line rather than auditing it at the end: a skip link, landmarks, one h1 per page, labelled controls, visible focus and colours that pass contrast. Enhance for wider screens with min-width media queries.",
      },
      {
        id: "a-wd-capstone-pages",
        title: "Multiple pages and a shared shell",
        explain:
          "Every page shares the same header, so build it once: a layout module exporting renderHeader(current) that each page's script calls with its own file name. The header holds the brand, a menu button for phones (with aria-expanded and aria-controls) and a nav landmark whose current link has aria-current=\"page\". Adding a page then means one new HTML file and one line in the navigation list.",
        webLab: {
          task:
            "Build the studio's shared shell. In both pages, replace the divs with a skip link to #main (first in the body), a header with class site-header and a main with id main. In layout.js, export a documented renderHeader(current) that fills the header with: a brand link to index.html, a button.menu-toggle (aria-expanded=\"false\", aria-controls=\"site-menu\") and a nav labelled Main holding ul#site-menu with links to index.html (Services) and book.html (Book), the current one marked. Then style it mobile-first: on phones the menu is hidden until the button opens it, with links at least 44px tall; from 768px the button hides and the menu shows in a row.",
          files: {
            "index.html": SHELL_INDEX,
            "book.html": SHELL_BOOK,
            "style.css": STUDIO_CSS,
            "layout.js": "// export function renderHeader(current) { … }\n",
            "index.js": 'import { renderHeader } from "./layout.js";\n\nrenderHeader("index.html");\n',
            "book.js": 'import { renderHeader } from "./layout.js";\n\nrenderHeader("book.html");\n',
          },
          readOnly: ["index.js", "book.js"],
          tests: [
            ...STUDIO_PAGES.map(([p]) => ({ page: p, label: `${p}: skip link first, a header and one main#main`, check: "const f = document.body.firstElementChild; return f.tagName === 'A' && f.getAttribute('href') === '#main' && !!$('header.site-header') && $$('main').length === 1 && $('main').id === 'main';", fail: "Body: <a class=\"skip-link\" href=\"#main\">, <header class=\"site-header\">, <main id=\"main\">." })),
            ...STUDIO_PAGES.map(([p]) => ({ page: p, label: `${p}: the header has the brand, the menu button and the nav, with this page current`, check: `const t = $('header .menu-toggle'); const links = $$('header nav[aria-label="Main"] #site-menu a'); const cur = $$('#site-menu a[aria-current="page"]'); return $('header a.brand')?.getAttribute('href') === 'index.html' && t?.tagName === 'BUTTON' && t.getAttribute('aria-controls') === 'site-menu' && links.length === 2 && cur.length === 1 && cur[0].getAttribute('href') === '${p}';`, fail: "renderHeader builds a.brand, button.menu-toggle and nav[aria-label=Main] > ul#site-menu, marking the current link." })),
            { page: "index.html", viewport: "mobile", label: "On a phone the menu starts closed, and the button opens and closes it", check: "const t = $('.menu-toggle'); if (visible('#site-menu') || t.getAttribute('aria-expanded') !== 'false') return false; await click(t); const open = visible('#site-menu') && t.getAttribute('aria-expanded') === 'true'; await click(t); return open && !visible('#site-menu') && t.getAttribute('aria-expanded') === 'false';", fail: "Hide #site-menu by default; the button toggles aria-expanded and a class that shows it." },
            { page: "index.html", viewport: "mobile", label: "Open menu links are at least 44px tall, and nothing scrolls sideways", check: "await click('.menu-toggle'); const ok = $$('#site-menu a').every((a) => rect(a).height >= 44); await click('.menu-toggle'); return ok && !overflowX();", fail: "#site-menu a { display: block; padding: 12px 0; }" },
            { page: "index.html", label: "On a laptop the menu shows and the button hides", check: "return visible('#site-menu') && !visible('.menu-toggle') && Math.abs(rect($$('#site-menu a')[0]).top - rect($$('#site-menu a')[1]).top) < 2;", fail: "@media (min-width: 768px) { .menu-toggle { display: none; } #site-menu { display: flex; } }" },
            { page: "index.html", viewport: "tablet", label: "No sideways scrolling on a tablet", check: "return !overflowX();", fail: "Check the header at 768px." },
            { page: "index.html", label: "renderHeader is documented", check: "return /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+renderHeader/.test(raw('layout.js'));", fail: "Add a /** … */ comment above export function renderHeader." },
          ],
          solution: { "index.html": shellDone(SHELL_INDEX), "book.html": shellDone(SHELL_BOOK), "style.css": STUDIO_CSS + SHELL_CSS, "layout.js": STUDIO_LAYOUT_DONE },
          hint: "The button toggles a class on the nav; CSS decides what that class means at each width.",
          successMessage: "One header, every page. Your capstone starts the same way: the shell first, then the features.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 154 · C.3 – C.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l154-capstone-data-forms",
    moduleId: "wd-c-capstone",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["C.3", "C.4", "C.5"],
    title: "Capstone: Components, a Data Layer and a Validated Form",
    subtitle: "Data in one place, pieces built once, and errors handled at every step",
    estimatedMinutes: 40,
    intro: "With the shell in place, the studio site gets its features: services loaded from an API and shown as cards, and a booking form that validates, sends and handles every answer the server can give.",

    atoms: [
      {
        id: "a-wd-capstone-structure",
        title: "Reusable components and clean structure",
        explain:
          "Give every module one job and name it for that job: layout.js (the shell), api.js (all requests), components.js (pieces of interface built from data), and one script per page that wires them together. Page scripts never call fetch and never build cards by hand. A reviewer opening your repository should understand the structure from the file names alone.",
        example: "src/\n  layout.js       renderHeader(current)\n  api.js          getServices(), createBooking(booking)\n  components.js   naira(amount), serviceCard(service)\n  index.js        the Services page\n  book.js         the Book page\nindex.html  book.html  style.css",
      },
      {
        id: "a-wd-capstone-validation",
        title: "Form validation and error handling",
        explain:
          "Validate on submit with one rule per field returning a message or \"\"; show each message next to its field (linked with aria-describedby), set aria-invalid, and focus the first invalid field. Then handle the server: disable the button while sending, show its error message if it refuses, keep the visitor's answers, and confirm success with something useful such as a reference number.",
      },
      {
        id: "a-wd-capstone-data-layer",
        title: "API integration or a data layer",
        explain:
          "All requests go through one small request() helper that throws an Error carrying the server's message when the response is not ok. Every page that loads data has three states: loading (say so), success (show it) and failure (explain and suggest what to do, and log the details). If your capstone has no real API, a data module or a JSON file served from public/ is a suitable data layer.",
        webLab: {
          task:
            "Finish the studio's features. api.js: a request() helper and documented exports getServices() (GET /api/services) and createBooking(booking) (POST /api/bookings), throwing the server's error message on failure. components.js: a documented serviceCard(service) returning li.service-card with an h2, a p.meta such as \"₦25,000 · 240 min\" and a link to book.html reading \"Book Knotless braids\". index.js: show \"Loading services…\" in #status, then the cards (clearing the status), or \"Could not load services. Please refresh the page.\" on failure. book.js: fill #service from the API; on submit validate name (\"Enter your name.\"), phone (a Nigerian mobile such as 0803 123 4567, else \"Enter a Nigerian mobile number, such as 0803 123 4567.\") and service (\"Choose a service.\"), with aria-invalid and focus on the first invalid field; then send { name, phone without spaces, service } and show \"Booked! Your reference is ADA-1042.\" or the server's error.",
          files: {
            "index.html": STUDIO_INDEX,
            "book.html": STUDIO_BOOK,
            "style.css": STUDIO_CSS_FULL,
            "layout.js": STUDIO_LAYOUT_DONE,
            "api.js": "// getServices() and createBooking(booking)\n",
            "components.js": "// serviceCard(service)\n",
            "index.js": 'import { renderHeader } from "./layout.js";\n\nrenderHeader("index.html");\n',
            "book.js": 'import { renderHeader } from "./layout.js";\n\nrenderHeader("book.html");\n',
          },
          readOnly: ["index.html", "book.html", "style.css", "layout.js"],
          mocks: [
            { match: "/api/services", status: 200, body: SERVICES, delay: 1000 },
            { match: "/api/bookings", method: "POST", status: 201, body: { reference: "ADA-1042" }, delay: 60 },
          ],
          tests: [
            { page: "index.html", label: "The services page says it is loading", check: "return text('#status') === 'Loading services…';", fail: "Set #status before awaiting getServices()." },
            { page: "index.html", label: "Each service is a card with its name, price and length, and a booking link", check: nowait("$$('#services li').length === 3") + " const c = $$('#services li')[1]; const a = c.querySelector('a'); return c.classList.contains('service-card') && text(c.querySelector('h2')) === 'Knotless braids' && text(c.querySelector('.meta')) === '₦25,000 · 240 min' && a?.getAttribute('href') === 'book.html' && text(a) === 'Book Knotless braids' && text('#status') === '';", fail: "serviceCard → li.service-card > h2, p.meta, a; clear #status when they are shown." },
            { page: "index.html", label: "If the API fails, the page explains, without errors", mocks: [{ match: "/api/services", status: 500, body: { error: "Server error" }, delay: 40 }], check: nowait("text('#status') === 'Could not load services. Please refresh the page.'") + " return errors().length === 0;", fail: "Wrap the load in try/catch and show the message." },
            { page: "book.html", label: "The service list is filled from the API", check: nowait("$$('#service option').length === 4") + " return $$('#service option')[2].value === 'braids' && text($$('#service option')[2]) === 'Knotless braids';", fail: "Append new Option(service.name, service.id) for each service." },
            { page: "book.html", label: "An empty form shows all three errors, marks the fields and focuses the name", check: "await submit('#booking'); return text('#name-error') === 'Enter your name.' && text('#phone-error') === 'Enter a Nigerian mobile number, such as 0803 123 4567.' && text('#service-error') === 'Choose a service.' && ['#name', '#phone', '#service'].every((s) => $(s).getAttribute('aria-invalid') === 'true') && document.activeElement === $('#name') && !fetchCalls().some((c) => c.url.includes('/api/bookings'));", fail: "Validate every field, set aria-invalid, focus the first invalid one and send nothing." },
            { page: "book.html", label: "A wrong phone number is the only error, and gets the focus", check: nowait("$$('#service option').length === 4") + " await type('#name', 'Chioma Obi'); await type('#phone', '12345'); await type('#service', 'braids'); await submit('#booking'); return text('#phone-error') !== '' && text('#name-error') === '' && text('#service-error') === '' && document.activeElement === $('#phone') && $('#name').getAttribute('aria-invalid') !== 'true';", fail: "Clear the errors that are fixed on each submit." },
            { page: "book.html", label: "A valid booking is sent and confirmed with the reference", check: "await type('#phone', '0803 123 4567'); await submit('#booking'); await waitFor(() => text('#result') !== ''); const c = fetchCalls().find((x) => x.url.includes('/api/bookings')); let b = {}; try { b = JSON.parse(c.body); } catch { return false; } return c.method === 'POST' && b.name === 'Chioma Obi' && b.phone === '08031234567' && b.service === 'braids' && text('#result') === 'Booked! Your reference is ADA-1042.';", fail: "POST { name, phone (no spaces), service } with createBooking and show the reference." },
            { page: "book.html", label: "A refused booking shows the server's message and keeps the answers", mocks: [{ match: "/api/services", status: 200, body: SERVICES, delay: 40 }, { match: "/api/bookings", method: "POST", status: 409, body: { error: "That time is no longer available." }, delay: 40 }], check: nowait("$$('#service option').length === 4") + " await type('#name', 'Chioma Obi'); await type('#phone', '08031234567'); await type('#service', 'cut'); await submit('#booking'); await waitFor(() => text('#result') !== ''); return text('#result') === 'That time is no longer available.' && $('#name').value === 'Chioma Obi' && errors().length === 0;", fail: "In createBooking's catch, show error.message in #result." },
            { page: "index.html", label: "Clean structure: documented api.js and components.js, and no fetch in the page scripts", check: "const doc = (f, n) => new RegExp('\\\\/\\\\*\\\\*[\\\\s\\\\S]*?\\\\*\\\\/\\\\s*export\\\\s+(async\\\\s+)?function\\\\s+' + n + '\\\\b').test(raw(f)); return doc('api.js', 'getServices') && doc('api.js', 'createBooking') && doc('components.js', 'serviceCard') && !/fetch\\(/.test(code('index.js')) && !/fetch\\(/.test(code('book.js'));", fail: "Document each export with /** … */ and call fetch only in api.js." },
          ],
          solution: { "api.js": STUDIO_API_DONE, "components.js": STUDIO_COMPONENTS_DONE, "index.js": STUDIO_INDEX_JS_DONE, "book.js": STUDIO_BOOK_JS_DONE },
          hint: "Write api.js first and try getServices() from the console panel; then the card, then each page.",
          successMessage: "A complete, small application: data in one place, pieces built once, and every failure handled. The gate asks you to do this again, alone, for a new client.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 155 · C.6 – C.8 · FINAL GATE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l155-capstone-gate",
    moduleId: "wd-c-capstone",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["C.6", "C.7", "C.8"],
    gate: true,
    title: "Final Assessment Gate: A Complete Responsive Application",
    subtitle: "Build it alone, prove it at every width, then ship, document and present it",
    estimatedMinutes: 120,
    intro: "This is the final gate. Build Eko Tutors, a two-page application for finding a tutor and requesting a lesson, from the brief alone. It is checked at phone, tablet and laptop widths, against the API succeeding and failing. There is no model answer. Then complete your own capstone: GitHub, documentation, deployment and presentation.",

    atoms: [
      {
        id: "a-wd-capstone-responsive",
        title: "Responsive behaviour across devices",
        explain:
          "Test the whole application at 375px, 768px and 1280px, and on a real phone: no sideways scrolling, layouts that use the space (one column on a phone, a grid on a laptop), a menu that works at every width, readable text and tap targets of 44px. Then test the states, not just the happy path: loading, empty, failure and long content.",
      },
      {
        id: "a-wd-capstone-gate-brief",
        title: "The gate brief",
        explain: "Eko Tutors connects families in Lagos with tutors. You write both pages' bodies and every module. The API: GET /api/tutors returns [{ id, name, subject, rate }]; POST /api/requests takes { name, email, subject, message } and returns { reference }, or an { error } message when it refuses.",
        table: {
          caption: "Requirements.",
          headers: ["Area", "Requirement"],
          rows: [
            ["Both pages", "A skip link to #main first, a header, and one main#main"],
            ["layout.js", "A documented renderHeader(current): a brand link, button.menu-toggle (aria-expanded, aria-controls=\"site-menu\"), nav labelled Main with ul#site-menu linking tutors.html (Tutors) and request.html (Request a lesson), aria-current on the current page; the menu is closed on phones until the button opens it, links at least 44px tall; from 768px the menu shows and the button hides"],
            ["api.js", "Documented getTutors() and sendRequest(lesson), throwing the server's error message on failure; the only module that calls fetch"],
            ["components.js", "A documented tutorCard(tutor): li.tutor-card with an h2 name, p.subject, p.rate such as \"₦5,000 per hour\" and a link to request.html reading \"Request a lesson with <name>\""],
            ["tutors.html", "A #subject select (all, Mathematics, Physics, English), #status and ul#tutors. Status: \"Loading tutors…\", then \"Showing 4 of 4 tutors\" (updated by the filter), or \"Could not load tutors. Please refresh the page.\""],
            ["request.html", "form#request (novalidate) with labelled #name, #email, #subject (a select) and #message (a textarea), each linked to #<id>-error with aria-describedby; #result"],
            ["Validation", "\"Enter your name.\", \"Enter a valid email address.\", \"Choose a subject.\", \"Tell us a little more (at least 20 characters).\"; aria-invalid on invalid fields; focus the first; send nothing while invalid"],
            ["Sending", "POST the four trimmed values; show \"Request sent. Your reference is REQ-311.\" or the server's error, keeping the answers"],
            ["Responsive", "No sideways scrolling at any width; tutors one per row on a phone and at least two per row on a laptop"],
          ],
        },
      },
      {
        id: "a-wd-capstone-gate-build",
        title: "Build the application",
        explain: "Use the page buttons above the preview to switch between tutors.html and request.html, and the viewport switcher to check each width.",
        webLab: {
          task: "Build Eko Tutors to the gate brief.",
          revealSolution: false,
          files: {
            "tutors.html": GATE_TUTORS_HTML,
            "request.html": GATE_REQUEST_HTML,
            "style.css": STUDIO_CSS.replace("--brand: #6b21a8", "--brand: #0f766e"),
            "layout.js": "",
            "api.js": "",
            "components.js": "",
            "tutors-page.js": "",
            "request-page.js": "",
          },
          mocks: GATE_MOCKS,
          tests: GATE_TESTS,
          solution: GATE_SOLUTION,
          hint: "No model answer is shown for the gate. Lessons 153 and 154 built the same kinds of pieces: start with the shell, then api.js, then each page.",
          successMessage: "Final gate passed: a complete, accessible, responsive application with a data layer, components and full error handling, built alone. Now ship your own capstone.",
        },
      },
      {
        id: "a-wd-capstone-github-docs",
        title: "GitHub version control and documentation",
        explain:
          "Your capstone's repository is part of what is assessed. It should show how you work: small commits with clear messages from the start of the project (not one giant commit at the end), feature branches merged through pull requests, a .gitignore, ESLint and tests that pass, a README in the Module 32 format with the live link at the top, and at least two decision records explaining choices you made.",
      },
      {
        id: "a-wd-capstone-deploy-present",
        title: "Live deployment and portfolio presentation",
        explain:
          "Deploy the capstone from GitHub to a host with automatic deploys and HTTPS (Module 29), ideally on a custom domain. Run the Module 30 audit (Lighthouse 90+ on mobile for performance and accessibility is the target) and the Module 31 security checklist on the live site. Add it to your portfolio as the lead project, and record a five-minute presentation: the problem, a live demo, one decision, the result and what you would do next.",
        decision: {
          scenario: "Your capstone works and is deployed. The day before you submit it, you think of a large new feature.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Submit what meets the eight requirements, polished and documented, and list the feature as a next step in the README and presentation", why: "Finished, working and documented beats ambitious and broken. Planned next steps show you can scope and prioritise, which is exactly what clients and employers look for." },
            { id: "b", text: "Build the feature overnight and deploy it untested", whyWrong: "Untested work the night before is the most likely way to break a project that was passing." },
            { id: "c", text: "Delay submitting until the feature is done", whyWrong: "Scope creep: there is always another feature. Ship, then iterate." },
            { id: "d", text: "Remove the documentation to make time", whyWrong: "Documentation is one of the requirements." },
          ],
          correct: "a",
          aftermath: "Congratulations: that is the professional instinct this course was built to give you.",
        },
      },
    ],

    task: {
      title: "Capstone: build, ship and present your own application",
      intro: "Now build your own capstone to the eight requirements.",
      prompts: [
        "Choose your application and write its requirements, wireframes and milestones (Module 32).",
        "Build it mobile-first and accessible, with at least two pages sharing a layout module (C.1, C.2).",
        "Structure it into components, a data layer and page scripts; validate every form and handle every failure (C.3 – C.5).",
        "Test it at phone, tablet and laptop widths and on a real phone, including the loading, empty and failure states (C.6).",
        "Keep it on GitHub with meaningful commits, a README and decision records; add ESLint and tests (C.7).",
        "Deploy it on HTTPS, audit it, add it to your portfolio and record your presentation (C.8).",
      ],
      closing: "When your capstone is live, take the final certification exam. Well done: you are a responsive web developer.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
