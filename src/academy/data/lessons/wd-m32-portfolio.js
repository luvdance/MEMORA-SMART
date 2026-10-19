/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 32 · PORTFOLIO AND PROFESSIONAL WORKFLOW
 *
 * Curriculum 32.1 – 32.12. Turning the course's projects into work that gets
 * you hired or paid: choosing and planning projects, requirements, layouts
 * and milestones; reusable components and testing against requirements;
 * READMEs, live demos and decision records; presenting work, the basic
 * freelancing workflow, estimating, revisions and handover. The labs build
 * the pieces of a real portfolio and a real quote.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s32-portfolio";

const PORTFOLIO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Projects · Amaka Eze, Frontend Developer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>Projects</h1>
    <p>Three projects, each built for a real problem.</p>
    <!-- Your project cards go here -->
  </main>
</body>
</html>
`;

const PORTFOLIO_CSS = `* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #1f2937; }
main { padding: 16px; max-width: 1100px; margin: 0 auto; }
`;

const CARD = (title, problem, tech, live, repo) => `      <article class="project">
        <img src="images/product.jpg" alt="Screenshot of ${title}" width="800" height="800">
        <h2>${title}</h2>
        <p class="problem">${problem}</p>
        <ul class="tech">
${tech.map((t) => `          <li>${t}</li>`).join("\n")}
        </ul>
        <p class="links">
          <a href="${live}">Live demo<span class="visually-hidden"> of ${title}</span></a>
          <a href="${repo}">Code<span class="visually-hidden"> for ${title}</span></a>
        </p>
      </article>`;

const PORTFOLIO_HTML_DONE = PORTFOLIO_HTML.replace(
  "    <!-- Your project cards go here -->",
  `    <section class="projects" aria-label="Projects">
${CARD("Bisi's Bakery", "A small bakery took orders only by phone. I built a mobile-first menu and order form that cut missed orders.", ["HTML", "CSS Grid", "JavaScript"], "https://bisibakery.netlify.app", "https://github.com/amakaeze/bisi-bakery")}
${CARD("Lagos Events", "People could not find weekend events in one place. A filterable, saveable list that works offline.", ["JavaScript modules", "localStorage", "Fetch API"], "https://lagos-events.vercel.app", "https://github.com/amakaeze/lagos-events")}
${CARD("Clinic Queue", "Patients waited without knowing their place. A live queue board readable from across the room.", ["Vite", "Vitest", "Accessibility"], "https://clinic-queue.netlify.app", "https://github.com/amakaeze/clinic-queue")}
    </section>`
);

const PORTFOLIO_CSS_DONE = `${PORTFOLIO_CSS}img { display: block; max-width: 100%; height: auto; }
.projects { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.project { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.tech { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
.tech li { background: #eef2ff; padding: 4px 10px; border-radius: 999px; }
.links { display: flex; gap: 16px; }
.links a { display: inline-block; padding: 12px 0; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

const CARDS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Projects · Amaka Eze</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
  <main>
    <h1>Projects</h1>
    <div id="filters" role="group" aria-label="Filter by skill">
      <button type="button" data-tag="all" aria-pressed="true">All</button>
      <button type="button" data-tag="css" aria-pressed="false">CSS</button>
      <button type="button" data-tag="javascript" aria-pressed="false">JavaScript</button>
    </div>
    <p id="count" role="status"></p>
    <section id="projects" aria-label="Projects"></section>
  </main>
</body>
</html>
`;

const CARDS_DATA = `// Given: the projects, kept as data so adding one never means writing HTML.
export const PROJECTS = [
  { title: "Bisi's Bakery", summary: "Mobile-first menu and order form.", tags: ["css", "javascript"], live: "https://bisibakery.netlify.app" },
  { title: "Gallery Grid", summary: "A responsive art gallery layout.", tags: ["css"], live: "https://gallery-grid.netlify.app" },
  { title: "Lagos Events", summary: "Filterable events that work offline.", tags: ["javascript"], live: "https://lagos-events.vercel.app" },
];
`;

const CARDS_JS = `import { PROJECTS } from "./projects.js";

// Write projectCard(project) in card.js, then use it here.
`;

const CARD_JS_DONE = `/**
 * Builds one project card: an article with the title, summary, a list of
 * tags and a link to the live demo. Used for every project on the site.
 * @param {{ title: string, summary: string, tags: string[], live: string }} project
 * @returns {HTMLElement}
 */
export function projectCard(project) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = project.title;

  const summary = document.createElement("p");
  summary.textContent = project.summary;

  const tags = document.createElement("ul");
  tags.className = "tags";
  for (const tag of project.tags) {
    const li = document.createElement("li");
    li.textContent = tag;
    tags.append(li);
  }

  const link = document.createElement("a");
  link.href = project.live;
  link.textContent = \`Live demo of \${project.title}\`;

  card.append(title, summary, tags, link);
  return card;
}
`;

const CARDS_JS_DONE = `import { PROJECTS } from "./projects.js";
import { projectCard } from "./card.js";

const list = document.querySelector("#projects");
const buttons = document.querySelectorAll("#filters button");

function show(tag) {
  const shown = tag === "all" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(tag));
  list.replaceChildren(...shown.map(projectCard));
  document.querySelector("#count").textContent = \`Showing \${shown.length} of \${PROJECTS.length} projects\`;
  for (const b of buttons) b.setAttribute("aria-pressed", String(b.dataset.tag === tag));
}

for (const b of buttons) b.addEventListener("click", () => show(b.dataset.tag));

show("all");
`;

const CARDS_CSS = `* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; }
main { padding: 16px; max-width: 1100px; margin: 0 auto; }
#projects { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.tags { display: flex; gap: 8px; padding: 0; list-style: none; }
button[aria-pressed="true"] { background: #1e3a8a; color: #fff; }
`;

const DOCS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Clinic Queue</title>
</head>
<body>
  <main>
    <h1>Clinic Queue</h1>
    <p>The project itself is finished. This lab is about its documentation: open README.md and the decision record.</p>
  </main>
</body>
</html>
`;

const README = `# clinic-queue

npm install
`;

const README_DONE = `# Clinic Queue

A live queue board for small clinics: patients see their number and the
estimated wait from across the waiting room, and staff call the next patient
from a phone.

**Live demo:** https://clinic-queue.netlify.app

![The queue board on a waiting-room TV](docs/screenshot.png)

## Features

- Large, high-contrast numbers readable from five metres away
- Staff controls that work on any phone
- Keeps working offline if the clinic's internet drops

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

- \`npm run dev\` starts the development server
- \`npm test\` runs the Vitest tests
- \`npm run build\` builds the site into dist

## Environment variables

- \`VITE_CLINIC_NAME\`: the name shown at the top of the board

## Technical decisions

See [docs/decisions](docs/decisions) for why the project uses plain
JavaScript modules and localStorage instead of a framework and a server.

## Author

Amaka Eze · [Portfolio](https://amakaeze.dev)
`;

const ADR = `# 1. Title

`;

const ADR_DONE = `# 1. Use localStorage instead of a server for the queue

Date: 2026-10-19

## Status

Accepted

## Context

The clinic has one front-desk phone and one TV, unreliable internet and no
budget for hosting a server. The queue only needs to exist for one day.

## Decision

Store the queue in localStorage on the TV's browser, and have the staff phone
send updates over a local connection. No server or database.

## Consequences

- Free to host as a static site, and works when the internet is down.
- The queue cannot be shared across several clinics. If that is needed later,
  we will add a small server and revisit this decision.
`;

const QUOTE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Quote · Amaka Eze Web Studio</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
  <main>
    <h1>Quote for Bisi's Bakery</h1>
    <table id="quote">
      <thead><tr><th scope="col">Task</th><th scope="col">Hours</th></tr></thead>
      <tbody></tbody>
    </table>
    <dl id="summary"></dl>
  </main>
</body>
</html>
`;

const QUOTE_DATA = `// Given: the tasks you broke the project into, with your estimate for each.
export const TASKS = [
  { task: "Discovery call and requirements", hours: 3 },
  { task: "Wireframes for 4 pages", hours: 6 },
  { task: "Build and responsive testing", hours: 24 },
  { task: "Order form with validation", hours: 6 },
  { task: "Deployment, domain and handover", hours: 3 },
];

export const RATE = 15000;      // naira per hour
export const CONTINGENCY = 0.2; // 20% for the unknowns every project has
`;

const ESTIMATE_JS = `/**
 * Returns the quote for a list of tasks.
 * hours: the total estimated hours
 * contingency: the extra hours for unknowns (hours × contingency rate), rounded up
 * total: (hours + contingency) × rate
 */
export function estimate(tasks, rate, contingencyRate) {
  // Write this.
}
`;

const ESTIMATE_JS_DONE = `/**
 * Returns the quote for a list of tasks.
 * hours: the total estimated hours
 * contingency: the extra hours for unknowns (hours × contingency rate), rounded up
 * total: (hours + contingency) × rate
 */
export function estimate(tasks, rate, contingencyRate) {
  const hours = tasks.reduce((sum, t) => sum + t.hours, 0);
  const contingency = Math.ceil(hours * contingencyRate);
  return { hours, contingency, total: (hours + contingency) * rate };
}
`;

const QUOTE_JS = `import { TASKS, RATE, CONTINGENCY } from "./tasks.js";
import { estimate } from "./estimate.js";

// Fill the table with one row per task, and the summary list.
`;

const QUOTE_JS_DONE = `import { TASKS, RATE, CONTINGENCY } from "./tasks.js";
import { estimate } from "./estimate.js";

const naira = (n) => \`₦\${n.toLocaleString("en-NG")}\`;

const body = document.querySelector("#quote tbody");
for (const t of TASKS) {
  const row = document.createElement("tr");
  const name = document.createElement("td");
  const hours = document.createElement("td");
  name.textContent = t.task;
  hours.textContent = String(t.hours);
  row.append(name, hours);
  body.append(row);
}

const q = estimate(TASKS, RATE, CONTINGENCY);
const summary = document.querySelector("#summary");
for (const [term, value] of [
  ["Estimated hours", String(q.hours)],
  ["Contingency hours", String(q.contingency)],
  ["Total", naira(q.total)],
  ["Revisions included", "2 rounds"],
]) {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = term;
  dd.textContent = value;
  summary.append(dt, dd);
}
`;

const ddOf = "const ddOf = (term) => { const dt = $$('#summary dt').find((d) => text(d) === term); return dt && dt.nextElementSibling ? text(dt.nextElementSibling) : null; };";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 149 · 32.1 – 32.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l149-planning-projects",
    moduleId: "wd-m32-portfolio",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["32.1", "32.2", "32.3", "32.4"],
    title: "Choosing and Planning Portfolio Projects",
    subtitle: "Projects that show what you can do, with requirements, layouts and milestones",
    estimatedMinutes: 26,
    intro: "Employers and clients do not read certificates first; they open your portfolio. This lesson is about choosing the right projects and planning each one like a professional job.",

    atoms: [
      {
        id: "a-wd-choosing-projects",
        title: "Choosing portfolio projects",
        explain:
          "Three to five strong projects beat fifteen tutorials. Choose projects that solve a believable problem for a real kind of user (a bakery's orders, a clinic's queue), that together show range (layout, forms, data from an API, state and storage, testing), and that are finished, live and readable. Rebuild a tutorial only if you change it substantially. If you want a particular kind of job or client, build one project that looks like that work.",
      },
      {
        id: "a-wd-project-requirements",
        title: "Writing project requirements",
        explain:
          "Requirements say what the project must do, so you know when it is done. Write them as testable statements from the user's point of view: \"A customer can place an order from a phone in under a minute\", \"The menu lists every item with its price\", \"The form explains every error next to its field\". Add non-functional requirements: accessibility (WCAG AA), performance (Lighthouse 90+ on mobile), and the browsers and screen sizes supported. Agree them with the client before you start.",
        example: "R1  A customer can see the full menu, with prices, on a 375px phone.\nR2  A customer can place an order with name, phone and items.\nR3  Every form error is shown next to its field and announced.\nR4  Lighthouse mobile scores are 90+ for performance and accessibility.\nR5  The site works in the current Chrome, Safari, Firefox and Edge.",
      },
      {
        id: "a-wd-planning-layouts",
        title: "Planning page layouts",
        explain:
          "Before code, sketch each page at phone width first, then laptop: what content, in which order, which parts repeat. Wireframes can be paper or a tool such as Figma; they are about structure, not colour. Plan the content order for the smallest screen (it is the reading order for screen readers too), then decide how it rearranges with more room. A portfolio project card, for example, needs a screenshot, the problem it solved, the technologies, and links to the live demo and the code.",
      },
      {
        id: "a-wd-milestones",
        title: "Breaking work into milestones",
        explain:
          "Split a project into milestones, each ending in something that works and can be shown: 1. structure and content (all pages in plain HTML), 2. responsive styles, 3. interactivity, 4. data and edge cases, 5. testing, performance and accessibility review, 6. deployment and documentation. Each milestone becomes a set of small tasks of half a day or less, tracked in GitHub Issues or a simple board. If a milestone runs late, you know early and can say so.",
        webLab: {
          task:
            "Build the projects section of a portfolio from this plan. Inside main, add a section with class projects containing three article.project cards. Each card has a screenshot image with alt text and dimensions, an h2 with the project's name, a p.problem saying what problem it solved, a ul.tech list of technologies, and two links: a live demo (https) and the code on GitHub. Each link's accessible name must include the project's name (a visually hidden span works). Lay the cards out in a responsive grid: one column on a phone, at least two on a laptop.",
          files: { "index.html": PORTFOLIO_HTML, "style.css": PORTFOLIO_CSS },
          tests: [
            { label: "Three project cards in section.projects", check: "return $$('section.projects > article.project').length === 3;", fail: "Add <section class=\"projects\"> with three <article class=\"project\">." },
            { label: "Each card has an h2, a problem statement and a tech list", check: "return $$('article.project').every((a) => a.querySelector('h2') && text(a.querySelector('p.problem')).length >= 30 && a.querySelectorAll('ul.tech li').length >= 2);", fail: "Each card: h2, <p class=\"problem\"> of at least a sentence, and <ul class=\"tech\"> with at least two items." },
            { label: "Each screenshot has alt text, width and height", check: "return $$('article.project').every((a) => { const i = a.querySelector('img'); return i && i.alt.trim().length > 5 && i.hasAttribute('width') && i.hasAttribute('height'); });", fail: "Describe each screenshot and add width and height." },
            { label: "Each card links to an https live demo and a GitHub repository", check: "return $$('article.project').every((a) => { const h = [...a.querySelectorAll('a')].map((x) => x.getAttribute('href') || ''); return h.some((u) => u.startsWith('https://') && !u.includes('github.com')) && h.some((u) => u.startsWith('https://github.com/')); });", fail: "Two links per card: https://… for the live site and https://github.com/… for the code." },
            { label: "Every link's accessible name includes its project's name", check: "return $$('article.project').every((a) => { const t = text(a.querySelector('h2')); return [...a.querySelectorAll('a')].every((x) => nameOf(x).includes(t)); });", fail: "\"Live demo\" alone is ambiguous: add a visually hidden \" of Project name\"." },
            { label: "One column on a phone", viewport: "mobile", check: "const c = $$('article.project'); return !overflowX() && rect(c[1]).top >= rect(c[0]).bottom;", fail: "Use grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))." },
            { label: "At least two columns on a laptop", viewport: "desktop", check: "const c = $$('article.project'); return Math.abs(rect(c[0]).top - rect(c[1]).top) < 2;", fail: "The grid should place cards side by side when there is room." },
          ],
          solution: { "index.html": PORTFOLIO_HTML_DONE, "style.css": PORTFOLIO_CSS_DONE },
          hint: "Write the problem as one sentence a non-developer would understand, then what you built.",
          successMessage: "A projects section that answers what a reviewer wants in ten seconds: what it is, why it matters, what you used, and where to see it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 150 · 32.5 – 32.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l150-components-testing",
    moduleId: "wd-m32-portfolio",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["32.5", "32.6"],
    title: "Reusable Components and Testing Against Requirements",
    subtitle: "Build each piece once, and prove the project does what was agreed",
    estimatedMinutes: 24,
    intro: "Professional sites are built from pieces used many times, and they are finished when they meet their requirements, not when they look done.",

    atoms: [
      {
        id: "a-wd-portfolio-components",
        title: "Creating reusable components",
        explain:
          "A component is one piece of interface built once and used everywhere: in CSS, a class such as .card or .button with its variants; in JavaScript, a function that takes data and returns an element, such as projectCard(project). Keep the data separate (an array of projects) so adding content never means copying HTML. A good component does one job, takes everything it needs as parameters, is documented, and looks right wherever it is placed. This is the idea React is built on, so the React course will feel familiar.",
      },
      {
        id: "a-wd-test-requirements",
        title: "Testing against requirements",
        explain:
          "Turn each requirement into a check: an automated test where you can (Vitest for functions, a browser test for pages), and a written manual check where you cannot (\"on a real phone, the order takes under a minute\"). Before calling a milestone done, go through the list and mark each requirement passed or failed, with evidence. That list is also what you show a client at sign-off, and it stops arguments about what was agreed.",
        table: {
          caption: "Requirements for this lab, and how each is checked.",
          headers: ["Requirement", "Check"],
          rows: [
            ["Every project is shown as a card with title, summary, tags and live link", "Count the cards and their parts"],
            ["Visitors can filter by CSS or JavaScript", "Press each filter and count the cards"],
            ["The count says how many are shown", "Read #count after each filter"],
            ["Screen readers know which filter is on", "Check aria-pressed on each button"],
            ["New projects need only a data change", "One component builds every card"],
          ],
        },
        webLab: {
          task:
            "Create card.js exporting a documented projectCard(project) that returns an article.card containing an h2 (title), a p (summary), a ul.tags with one li per tag, and an a to the live demo whose text includes the title. In app.js, use it for every project and make the filter buttons work: show all projects or only those with the button's tag, update #count to \"Showing 2 of 3 projects\", and set aria-pressed on the buttons. The tests are the requirements in the table.",
          files: { "index.html": CARDS_HTML, "style.css": CARDS_CSS, "app.js": CARDS_JS, "projects.js": CARDS_DATA, "card.js": "// export function projectCard(project) { … }\n" },
          readOnly: ["index.html", "style.css", "projects.js"],
          tests: [
            { label: "Every project is a card with title, summary, tags and a live link", check: "const c = $$('#projects article.card'); return c.length === 3 && text(c[0].querySelector('h2')) === \"Bisi's Bakery\" && text(c[0].querySelector('p')) === 'Mobile-first menu and order form.' && c[0].querySelectorAll('ul.tags li').length === 2 && c[0].querySelector('a')?.getAttribute('href') === 'https://bisibakery.netlify.app' && text(c[0].querySelector('a')).includes(\"Bisi's Bakery\");", fail: "projectCard builds article.card > h2, p, ul.tags > li, a." },
            { label: "The count shows all three at first", check: "return text('#count') === 'Showing 3 of 3 projects';", fail: "Set #count to \"Showing 3 of 3 projects\" when all are shown." },
            { label: "The CSS filter shows two projects and updates the count", check: "await click('[data-tag=css]'); const t = $$('#projects h2').map((h) => text(h)); return t.length === 2 && t.includes('Gallery Grid') && !t.includes('Lagos Events') && text('#count') === 'Showing 2 of 3 projects';", fail: "Filter PROJECTS by p.tags.includes(tag)." },
            { label: "aria-pressed shows which filter is on", check: "return $('[data-tag=css]').getAttribute('aria-pressed') === 'true' && $('[data-tag=all]').getAttribute('aria-pressed') === 'false';", fail: "Set aria-pressed to \"true\" on the clicked button and \"false\" on the others." },
            { label: "The JavaScript filter, then All, work too", check: "await click('[data-tag=javascript]'); const two = $$('#projects article').length === 2; await click('[data-tag=all]'); return two && $$('#projects article').length === 3;", fail: "\"all\" shows every project." },
            { label: "One documented component builds every card", check: "return /export\\s+function\\s+projectCard/.test(code('card.js')) && /\\/\\*\\*[\\s\\S]*?\\*\\/\\s*export\\s+function\\s+projectCard/.test(raw('card.js')) && /projectCard/.test(code('app.js')) && !/createElement\\(\\s*[\"']article/.test(code('app.js'));", fail: "Export projectCard from card.js with a /** … */ comment, import it in app.js, and build no articles in app.js." },
          ],
          solution: { "card.js": CARD_JS_DONE, "app.js": CARDS_JS_DONE },
          hint: "show(tag) does everything: filter, replaceChildren with the mapped cards, update the count and the buttons.",
          successMessage: "Five requirements, five passing checks. Adding a fourth project is now one line of data.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 151 · 32.7 – 32.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l151-docs-demos",
    moduleId: "wd-m32-portfolio",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["32.7", "32.8", "32.9"],
    title: "READMEs, Live Demos and Decision Records",
    subtitle: "Documentation that makes a project easy to judge and easy to maintain",
    estimatedMinutes: 22,
    intro: "A reviewer gives each project a minute or two. The README and the live demo are what they see in that time.",

    atoms: [
      {
        id: "a-wd-readmes",
        title: "Writing project READMEs",
        explain:
          "A portfolio README has: the project's name and a one-paragraph description of the problem it solves; a link to the live demo near the top; a screenshot; the main features; how to run it (the exact commands); the scripts; environment variables; notable technical decisions; and who built it. Write in Markdown with headings so GitHub shows a clear page, and keep it current: a README that gives the wrong command is worse than none.",
      },
      {
        id: "a-wd-live-demos",
        title: "Publishing live demos",
        explain:
          "Every portfolio project should be live, on HTTPS, linked from the README, the repository's About box and your portfolio. Check the live demo on a phone and in a private window (no cached logins). If it needs data, include sample data or a demo account so a reviewer is never faced with an empty screen or a login wall. A custom domain for your portfolio itself (yourname.dev) looks professional and costs little.",
      },
      {
        id: "a-wd-decision-records",
        title: "Documenting technical decisions",
        explain:
          "An architecture decision record (ADR) is a short Markdown file, one per significant decision, kept in docs/decisions: a numbered title, the date, a status (Proposed, Accepted, Superseded), the context (the situation and constraints), the decision, and the consequences (good and bad). It answers the question every future developer asks, \"why is it done this way?\", and in an interview it shows you weigh options instead of following tutorials.",
        webLab: {
          task:
            "Document this finished project. Rewrite README.md with a title, a description, a live demo link (https), and sections headed Features (at least two bullet points), Getting started (with npm install and npm run dev in a code block) and Technical decisions. Then complete docs/decisions/0001-use-localstorage.md as a decision record: a title stating the decision, a Date line, and Status, Context, Decision and Consequences sections, with Status set to Accepted.",
          files: { "index.html": DOCS_HTML, "README.md": README, "docs/decisions/0001-use-localstorage.md": ADR },
          readOnly: ["index.html"],
          tests: [
            { label: "README has a title and a description paragraph", check: "const r = raw('README.md'); const lines = r.split('\\n'); return /^# \\S/.test(lines[0]) && r.split('\\n\\n').slice(1).some((p) => !/^[#`!*-]/.test(p.trim()) && p.trim().split(/\\s+/).length >= 15);", fail: "Start with \"# Project name\", then a paragraph of at least 15 words about the problem it solves." },
            { label: "README links to an https live demo", check: "return /https:\\/\\/[^\\s)]+/.test(raw('README.md')) && /live demo/i.test(raw('README.md'));", fail: "Add a \"Live demo: https://…\" line near the top." },
            { label: "Features section with at least two bullet points", check: "const m = raw('README.md').match(/^## Features\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))/m); return !!m && (m[1].match(/^- /gm) || []).length >= 2;", fail: "Add \"## Features\" followed by \"- \" bullet points." },
            { label: "Getting started shows npm install and npm run dev in a code block", check: "const m = raw('README.md').match(/^## Getting started\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))/m); return !!m && /```[\\s\\S]*npm install[\\s\\S]*npm run dev[\\s\\S]*```/.test(m[1]);", fail: "Put the commands between ``` fences under \"## Getting started\"." },
            { label: "README has a Technical decisions section", check: "return /^## Technical decisions/m.test(raw('README.md'));", fail: "Add \"## Technical decisions\" pointing to docs/decisions." },
            { label: "The decision record has a title, a date and all four sections", check: "const a = raw('docs/decisions/0001-use-localstorage.md'); return /^# 1\\. \\S.{10,}/m.test(a) && !/^# 1\\. Title\\s*$/m.test(a) && /Date: \\d{4}-\\d{2}-\\d{2}/.test(a) && ['Status', 'Context', 'Decision', 'Consequences'].every((h) => new RegExp('^## ' + h + '\\\\s*$', 'm').test(a));", fail: "Title \"# 1. Use localStorage …\", a \"Date: YYYY-MM-DD\" line and ## Status, ## Context, ## Decision and ## Consequences." },
            { label: "The decision is Accepted, and every section has content", check: "const a = raw('docs/decisions/0001-use-localstorage.md'); const parts = a.split(/^## /m).slice(1); return parts.length === 4 && /^Status\\s+Accepted/.test(parts[0]) && parts.every((p) => p.split('\\n').slice(1).join(' ').trim().length >= 8);", fail: "Write \"Accepted\" under Status and at least a sentence under the others." },
          ],
          solution: { "README.md": README_DONE, "docs/decisions/0001-use-localstorage.md": ADR_DONE },
          hint: "Read the decision record in the model of Lesson 151: context is the situation, decision is what you chose, consequences are what follows, good and bad.",
          successMessage: "A README that sells the project in a minute and a decision record that answers \"why\" for years. Do the same for every portfolio project.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 152 · 32.10 – 32.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l152-clients-freelancing",
    moduleId: "wd-m32-portfolio",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["32.10", "32.11", "32.12"],
    title: "Presenting Work, Freelancing, Estimates and Handover",
    subtitle: "Working with clients and employers from first call to final handover",
    estimatedMinutes: 26,
    intro: "Technical skill gets you in the door; communication keeps the work coming. This lesson is the professional side: presenting, the freelance workflow, quoting fairly and finishing cleanly.",

    atoms: [
      {
        id: "a-wd-presenting",
        title: "Presenting projects to clients or employers",
        explain:
          "Present a project as a story: the problem and who had it, your approach and one hard decision, the result (ideally a number: orders up, load time down), and what you would do next. Show the live site, not the code, first; then show one piece of code you are proud of and explain it. Prepare for \"why did you choose…?\" and \"what would you change?\". Speak to the audience: a client cares about outcomes, an engineer about trade-offs.",
        decision: {
          scenario: "In an interview you are asked to walk through your Lagos Events project. You have five minutes.",
          question: "Which structure is best?",
          options: [
            { id: "a", text: "The problem and the user, a live demo of the main flow, one technical decision and why, the result, and what you would improve", why: "It shows you understand why the project exists, can show working software and can reason about trade-offs, all in the time given." },
            { id: "b", text: "Open the code editor and read through every file", whyWrong: "It runs out of time on details and never shows what the project does." },
            { id: "c", text: "List every technology you used", whyWrong: "A list says nothing about the problems you solved or your judgement." },
            { id: "d", text: "Apologise for the parts that are unfinished", whyWrong: "Lead with what works; mention improvements as next steps instead." },
          ],
          correct: "a",
          aftermath: "Practise it out loud with a timer. The same structure works for a client pitch with less code and more results.",
        },
      },
      {
        id: "a-wd-freelancing-workflow",
        title: "Basic freelancing workflow",
        explain:
          "A typical small project: a discovery call (goals, audience, content, budget, deadline); a written proposal with the requirements, milestones, price and what is not included; a signed agreement and a deposit, often 50%; the work in milestones with the client reviewing each on a preview link; sign-off against the requirements; the final payment; then handover. Put everything important in writing, by email or in the agreement, so both sides remember the same thing.",
      },
      {
        id: "a-wd-estimation-handover",
        title: "Estimation, revisions and handover",
        explain:
          "Estimate by breaking the work into tasks small enough to estimate in hours, adding them up, and adding contingency (often 15–25%) for the unknowns every project has; then multiply by your rate. State how many rounds of revisions are included and what extra rounds cost, so feedback has a shape. Handover means the client can run the site without you: they own the domain, hosting and repository accounts, and receive the logins, a short guide to updating content, and the README.",
        webLab: {
          task:
            "Build the quote page for Bisi's Bakery. In estimate.js, write estimate(tasks, rate, contingencyRate) to return { hours, contingency, total }: the sum of the task hours, the contingency hours (hours × rate, rounded up) and the total cost ((hours + contingency) × rate). Then, in app.js, fill the table with one row per task (name and hours), and the #summary list with dt/dd pairs: Estimated hours, Contingency hours, Total (in naira, formatted like ₦612,000) and Revisions included: 2 rounds.",
          files: { "index.html": QUOTE_HTML, "style.css": "body { margin: 0; font-family: Arial, sans-serif; }\nmain { padding: 16px; max-width: 640px; }\ntable { border-collapse: collapse; width: 100%; }\nth, td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; }\n", "app.js": QUOTE_JS, "estimate.js": ESTIMATE_JS, "tasks.js": QUOTE_DATA },
          readOnly: ["index.html", "style.css", "tasks.js"],
          tests: [
            { label: "estimate() adds the hours and rounds the contingency up", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('estimate.js'))); const r = m.estimate([{ hours: 3 }, { hours: 4 }], 10000, 0.2); return r.hours === 7 && r.contingency === 2 && r.total === 90000;", fail: "7 hours × 0.2 = 1.4, rounded up to 2; (7 + 2) × 10000 = 90000. Use Math.ceil." },
            { label: "The table has one row per task", check: "const rows = $$('#quote tbody tr'); return rows.length === 5 && text(rows[2].cells[0]) === 'Build and responsive testing' && text(rows[2].cells[1]) === '24';", fail: "One tr per task with two td cells: name and hours." },
            { label: "The summary shows 42 hours and 9 contingency hours", check: "" + ddOf + " return ddOf('Estimated hours') === '42' && ddOf('Contingency hours') === '9';", fail: "42 × 0.2 = 8.4, rounded up to 9." },
            { label: "The total is ₦765,000", check: "" + ddOf + " return ddOf('Total') === '₦765,000';", fail: "(42 + 9) × 15000 = 765000, formatted with toLocaleString(\"en-NG\")." },
            { label: "Revisions are stated: 2 rounds", check: "" + ddOf + " return ddOf('Revisions included') === '2 rounds';", fail: "Add a Revisions included / 2 rounds pair." },
          ],
          solution: { "estimate.js": ESTIMATE_JS_DONE, "app.js": QUOTE_JS_DONE },
          hint: "Build the summary from an array of [term, value] pairs, creating a dt and a dd for each.",
          successMessage: "A clear, honest quote: every task visible, contingency stated, and revisions bounded. Send it as a PDF with the proposal and you look like a professional from the first email.",
        },
      },
    ],

    task: {
      title: "Module project: your portfolio site",
      intro: "Bring together the projects from this course.",
      prompts: [
        "Choose your three to five strongest projects and write their requirements as you would for a client.",
        "Build a portfolio site with a home page, a projects page built from data with a reusable card component, an about page and a contact form.",
        "Give every project a full README, a live demo and at least one decision record.",
        "Run the accessibility and Lighthouse review from Module 30 and the security checklist from Module 31 on the portfolio itself.",
        "Write a sample quote for a small business website and a one-page handover checklist.",
        "Record a five-minute walkthrough of your best project, using the presentation structure from this lesson.",
      ],
      closing: "Next: the capstone project.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
