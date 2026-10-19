/**
 * RESPONSIVE WEB DEVELOPMENT · PHASE 2 PROJECTS AND ASSESSMENT GATE
 *
 * Curriculum P2.1 – P2.6. Five responsive builds from the source curriculum
 * (portfolio, landing page, dashboard, product site, navigation with a
 * mobile menu), each checked at phone, tablet and laptop widths; then the
 * gate: a site that works at all three sizes with no horizontal scrolling,
 * no broken layout and accessible navigation, with no model answer shown.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s-p2-projects";

const page = (title, body, js = false) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${body}${js ? '\n  <script src="app.js"></script>' : ""}
</body>
</html>
`;

const BASE = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; color: #111827; }
img { display: block; max-width: 100%; height: auto; }
`;

const MENU_JS = `const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
`;

/* Shared check fragments. */
const noScroll = (vp) => ({ viewport: vp, label: `No sideways scrolling at ${vp} width`, check: "return !overflowX();", fail: `Something is wider than the screen at ${vp} width. Look for fixed widths and images without max-width.` });
const sameRow = (sel) => `const r = $$('${sel}').map((x) => rect(x)); return r.length > 1 && r.every((x) => Math.abs(x.top - r[0].top) < 2);`;
const stacked = (sel) => `const r = $$('${sel}').map((x) => rect(x)); return r.length > 1 && r.every((x, i) => i === 0 || x.top >= r[i - 1].bottom - 1);`;
const perRow = (sel, n) => `const r = $$('${sel}').map((x) => Math.round(rect(x).top)); return r.filter((t) => t === r[0]).length === ${n};`;

/* ── P2.1 Portfolio ────────────────────────────────────────────────── */
const PORT_HTML = page("Femi Ade · Front-end developer", `  <header class="intro">
    <img class="intro__photo" src="images/profile.jpg" alt="Femi Ade smiling at his desk" width="600" height="600">
    <div class="intro__text">
      <h1>Femi Ade</h1>
      <p>I build fast, accessible websites for small businesses in Lagos.</p>
    </div>
  </header>
  <main>
    <h2>Projects</h2>
    <section class="projects">
      <article class="project"><img src="images/product.jpg" alt="Bakery website on a phone" width="800" height="800"><h3>Bisi's Bakery</h3></article>
      <article class="project"><img src="images/product-2.jpg" alt="Farm shop homepage" width="800" height="800"><h3>Green Leaf Farms</h3></article>
      <article class="project"><img src="images/product-3.jpg" alt="Salon booking page" width="800" height="800"><h3>Glow Salon</h3></article>
    </section>
  </main>`);

const PORT_DONE = `${BASE}
.intro, main { width: min(100% - 32px, 1000px); margin-inline: auto; }
.intro { display: grid; gap: 24px; padding-block: 32px; }
.intro__photo { width: 200px; border-radius: 50%; }
h1 { font-size: clamp(2rem, 1.2rem + 3.5vw, 3.5rem); line-height: 1.15; margin: 0; }
.projects { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); padding-bottom: 32px; }
.project img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
@media (min-width: 768px) {
  .intro { grid-template-columns: 200px 1fr; align-items: center; }
}
`;

/* ── P2.2 Landing ──────────────────────────────────────────────────── */
const LAND_HTML = page("SwiftSend · Send money home", `  <section class="hero">
    <h1>Send money home in minutes</h1>
    <p>Low fees to every Nigerian bank.</p>
    <a class="btn" href="signup.html">Create a free account</a>
  </section>
  <section class="features">
    <article class="feature"><h2>Fast</h2><p>Most transfers arrive in under five minutes.</p></article>
    <article class="feature"><h2>Cheap</h2><p>A flat ₦200 fee, whatever the amount.</p></article>
    <article class="feature"><h2>Safe</h2><p>Licensed and insured.</p></article>
  </section>
  <section class="cta">
    <h2>Ready to send?</h2>
    <a class="btn" href="signup.html">Get started</a>
  </section>`);

const LAND_DONE = `${BASE}
.hero { min-height: 70vh; display: grid; place-content: center; text-align: center; padding: 32px 16px; background: #1e3a8a; color: #fff; }
.hero h1 { font-size: clamp(2rem, 1rem + 4vw, 3.5rem); margin: 0 0 16px; }
.btn { display: inline-block; min-height: 44px; padding: 12px 24px; border-radius: 8px; background: #facc15; color: #1e3a8a; font-weight: 700; text-decoration: none; }
.features { display: grid; gap: 16px; width: min(100% - 32px, 1000px); margin: 32px auto; }
.feature { padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; }
.cta { padding: 48px 16px; text-align: center; background: #eff6ff; }
@media (min-width: 768px) {
  .features { grid-template-columns: repeat(3, 1fr); }
}
`;

/* ── P2.3 Dashboard ────────────────────────────────────────────────── */
const DASH_HTML = page("Shop dashboard", `  <div class="app">
    <header class="app__header">Mama Ijebu Store · Dashboard</header>
    <nav class="app__nav" aria-label="Dashboard"><a href="sales.html">Sales</a> <a href="stock.html">Stock</a></nav>
    <main class="app__main">
      <section class="stats">
        <article class="stat"><h2>Sales</h2><p>₦482,000</p></article>
        <article class="stat"><h2>Orders</h2><p>126</p></article>
        <article class="stat"><h2>Customers</h2><p>89</p></article>
        <article class="stat"><h2>Returns</h2><p>3</p></article>
      </section>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody><tr><td>#1042</td><td>Adaeze Nnaji</td><td>Garri, 5kg</td><td>₦6,500</td><td>Delivered</td><td>14 March 2026</td></tr></tbody>
        </table>
      </div>
    </main>
  </div>`);

const DASH_DONE = `${BASE}
.app { display: grid; grid-template-areas: "header" "main" "nav"; min-height: 100vh; }
.app__header { grid-area: header; padding: 16px; background: #111827; color: #fff; }
.app__nav { grid-area: nav; padding: 16px; background: #f3f4f6; }
.app__main { grid-area: main; padding: 16px; min-width: 0; }
.stats { display: grid; gap: 16px; grid-template-columns: 1fr; }
.stat { padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; }
.table-wrap { overflow-x: auto; margin-top: 24px; }
th, td { padding: 8px 12px; text-align: left; white-space: nowrap; }
@media (min-width: 600px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .app { grid-template-columns: 220px 1fr; grid-template-areas: "header header" "nav main"; }
  .stats { grid-template-columns: repeat(4, 1fr); }
}
`;

/* ── P2.4 Product site ─────────────────────────────────────────────── */
const PROD_HTML = page("Aba Leather Works", `  <header class="site-header"><p class="logo">Aba Leather Works</p></header>
  <main class="shop">
    <article class="product"><span class="badge">Sale</span><img src="images/product.jpg" alt="Brown leather sandals" width="800" height="800"><h2>Sandals</h2><p class="price">₦18,000</p></article>
    <article class="product"><img src="images/product-2.jpg" alt="Black leather belt" width="800" height="800"><h2>Belt</h2><p class="price">₦9,500</p></article>
    <article class="product"><img src="images/product-3.jpg" alt="Tan leather wallet" width="800" height="800"><h2>Wallet</h2><p class="price">₦12,000</p></article>
    <article class="product"><img src="images/hero.jpg" alt="Leather travel bag" width="1600" height="900"><h2>Travel bag</h2><p class="price">₦45,000</p></article>
  </main>
  <p class="filler">More products coming soon.</p>`);

const PROD_DONE = `${BASE}
.site-header { position: sticky; top: 0; z-index: 10; padding: 12px 16px; background: #7c2d12; color: #fff; }
.logo { margin: 0; font-weight: 700; }
.shop { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); width: min(100% - 32px, 1100px); margin: 24px auto; }
.product { position: relative; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.product img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.product h2, .product .price { margin: 8px 12px; }
.price { font-weight: 700; color: #7c2d12; }
.badge { position: absolute; top: 8px; left: 8px; padding: 2px 8px; border-radius: 999px; background: #b91c1c; color: #fff; }
.filler { height: 1200px; }
`;

/* ── P2.5 Navigation ───────────────────────────────────────────────── */
const NAV_HTML = page("Ikoyi Dental", `  <header class="site-header">
    <a class="logo" href="index.html">Ikoyi Dental</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        <li><a href="index.html" aria-current="page">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="team.html">Our team</a></li>
        <li><a href="prices.html">Prices</a></li>
        <li><a href="book.html">Book a visit</a></li>
      </ul>
    </nav>
  </header>
  <main><h1>Gentle dental care</h1></main>`, true);

const NAV_DONE = `${BASE}
.site-header { position: sticky; top: 0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 8px 16px; background: #0c4a6e; }
.site-header a { color: #fff; text-decoration: none; }
.logo { font-weight: 700; padding: 10px 0; }
.menu-toggle { min-height: 44px; padding: 8px 16px; }
.site-nav { display: none; width: 100%; }
.site-nav.is-open { display: block; }
.site-nav ul { margin: 0; padding: 0; list-style: none; }
.site-nav a { display: block; padding: 12px 0; }
.site-nav a[aria-current="page"] { text-decoration: underline; text-underline-offset: 4px; font-weight: 700; }
.site-header a:focus-visible, .menu-toggle:focus-visible { outline: 3px solid #fbbf24; outline-offset: 2px; }
@media (min-width: 768px) {
  .menu-toggle { display: none; }
  .site-nav { display: block; width: auto; }
  .site-nav ul { display: flex; gap: 20px; }
}
`;

/* ── P2.6 Gate ─────────────────────────────────────────────────────── */
const GATE_HTML = page("Lekki Coding School", `  <header class="site-header">
    <a class="logo" href="index.html">Lekki Coding School</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        <li><a href="index.html" aria-current="page">Home</a></li>
        <li><a href="courses.html">Courses</a></li>
        <li><a href="fees.html">Fees</a></li>
        <li><a href="apply.html">Apply</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section class="hero">
      <div class="hero__text">
        <h1>Learn to build the web</h1>
        <p>Weekend classes for teenagers and adults.</p>
        <a class="btn" href="apply.html">Apply for September</a>
      </div>
      <img class="hero__img" src="images/team.jpg" alt="Students working on laptops in a bright classroom" width="1200" height="800">
    </section>
    <section class="courses">
      <article class="course"><h2>Web basics</h2><p>HTML and CSS.</p></article>
      <article class="course"><h2>JavaScript</h2><p>Programming for the web.</p></article>
      <article class="course"><h2>Design</h2><p>Figma and design systems.</p></article>
    </section>
    <div class="fees">
      <table>
        <thead><tr><th>Course</th><th>Weeks</th><th>Fee</th><th>Starts</th><th>Campus</th></tr></thead>
        <tbody><tr><td>Web basics</td><td>12</td><td>₦120,000</td><td>6 September 2026</td><td>Lekki Phase 1</td></tr></tbody>
      </table>
    </div>
  </main>
  <footer class="site-footer"><p>&copy; 2026 Lekki Coding School</p></footer>`, true);

const GATE_DONE = `${BASE}
.site-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 8px 16px; background: #111827; }
.site-header a { color: #fff; }
.logo { padding: 10px 0; font-weight: 700; }
.menu-toggle { min-height: 44px; padding: 8px 16px; }
.site-nav { display: none; width: 100%; }
.site-nav.is-open { display: block; }
.site-nav ul { margin: 0; padding: 0; list-style: none; }
.site-nav a { display: block; padding: 12px 0; }
a:focus-visible, button:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
main { width: min(100% - 32px, 1100px); margin-inline: auto; }
.hero { display: grid; gap: 24px; padding-block: 32px; }
h1 { font-size: clamp(2rem, 1.2rem + 3vw, 3.25rem); line-height: 1.15; }
.btn { display: inline-block; min-height: 44px; padding: 12px 20px; background: #1d4ed8; color: #fff; text-decoration: none; }
.courses { display: grid; gap: 16px; }
.course { padding: 16px; border: 1px solid #e5e7eb; }
.fees { overflow-x: auto; margin-block: 24px; }
th, td { padding: 8px; white-space: nowrap; }
.site-footer { padding: 16px; background: #f3f4f6; }
@media (min-width: 600px) {
  .courses { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .menu-toggle { display: none; }
  .site-nav { display: block; width: auto; }
  .site-nav ul { display: flex; gap: 20px; }
  .hero { grid-template-columns: 1fr 1fr; align-items: center; }
}
@media (min-width: 1024px) {
  .courses { grid-template-columns: repeat(3, 1fr); }
}
`;

const brief = (id, title, explain, rows) => ({
  id,
  title,
  explain,
  table: { caption: "Requirements, by screen size.", headers: ["Width", "The page must"], rows },
});

export const LESSONS = [
  /* ═══ P2.1 ═══ */
  {
    id: "wd-l51-portfolio",
    moduleId: "wd-p2-projects",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P2.1"],
    title: "Project: Responsive Personal Portfolio",
    subtitle: "Your introduction and your work, on every screen",
    estimatedMinutes: 35,
    intro: "A portfolio is often the first thing an employer or client opens, and they usually open it on a phone. This one introduces you and shows your projects at every width.",
    atoms: [
      brief("a-wd-p2-port-brief", "The brief", "The HTML is written. Style it mobile first so the introduction and the project grid work from 375px up.", [
        ["Phone", "Photo above the name; project cards in one column; no sideways scrolling"],
        ["Tablet and up", "Photo beside the name and introduction"],
        ["Laptop", "Project cards side by side (three in a row); content at most 1000px wide"],
        ["All", "A fluid h1 with clamp(); project images cropped to the same shape"],
      ]),
      {
        id: "a-wd-p2-port-plan",
        title: "One rule for every width",
        explain: "A card grid that must show one, two or three columns does not need three media queries.",
        decision: {
          scenario: "Your project cards must be one column on phones and as many as fit on wider screens.",
          question: "What is the simplest CSS?",
          options: [
            { id: "a", text: "grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))", why: "One line: as many 240px-or-wider columns as fit, from one on phones to several on laptops." },
            { id: "b", text: "Three media queries setting 1, 2 and 3 columns", whyWrong: "It works, but it is three times the code and breaks at widths between your queries." },
            { id: "c", text: "float: left on each card", whyWrong: "Floats are an old layout technique, fragile and hard to make responsive." },
            { id: "d", text: "A table with three columns", whyWrong: "Tables are for data and cannot reflow." },
          ],
          correct: "a",
          aftermath: "auto-fit and minmax are the first thing to reach for in any card grid.",
        },
      },
      {
        id: "a-wd-p2-port-build",
        title: "Build it",
        explain: "Write style.css to the brief. Check the preview at all three widths as you go.",
        webLab: {
          task: "Style the portfolio to the brief.",
          files: { "index.html": PORT_HTML, "style.css": BASE },
          readOnly: ["index.html"],
          tests: [
            noScroll("mobile"),
            { viewport: "mobile", label: "Phone: the photo is above the name, and cards are in one column", check: `return rect('.intro__text').top >= rect('.intro__photo').bottom - 1 && (() => { ${stacked(".project")} })();`, fail: "Keep the phone layout stacked: no columns outside your media queries." },
            { viewport: "tablet", label: "Tablet: the photo sits beside the introduction", check: "const p = rect('.intro__photo'), t = rect('.intro__text'); return t.left >= p.right - 1 && t.top < p.bottom;", fail: "At min-width: 768px put the photo and text in two columns." },
            { label: "Laptop: three project cards in one row, content at most 1000px", check: `${sameRow(".project")} && rect('main').width <= 1001;`.replace("; &&", " &&"), fail: "Use repeat(auto-fit, minmax(240px, 1fr)) and width: min(100% - 32px, 1000px)." },
            { label: "The h1 is fluid with clamp()", check: "return rules('h1').some((r) => /clamp\\(/.test(r.style.fontSize));", fail: "h1 { font-size: clamp(…); }" },
            { label: "Project images are all the same shape, cropped with object-fit", check: "const r = $$('.project img').map((i) => rect(i)); return r.every((x) => Math.abs(x.height - r[0].height) < 1) && $$('.project img').every((i) => style(i, 'object-fit') === 'cover');", fail: ".project img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }" },
          ],
          solution: { "style.css": PORT_DONE },
          hint: "Start with a fluid container for .intro and main, then the grid, then one media query for the intro.",
          successMessage: "A portfolio that looks intentional on a phone and a laptop. Keep it: Module 32 turns it into your real one.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P2.2 ═══ */
  {
    id: "wd-l52-landing",
    moduleId: "wd-p2-projects",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P2.2"],
    title: "Project: Business Landing Page",
    subtitle: "One page, one goal: get the visitor to act",
    estimatedMinutes: 35,
    intro: "A landing page exists to make one thing happen: here, opening an account. Everything on it should lead the eye to that button, at every size.",
    atoms: [
      brief("a-wd-p2-land-brief", "The brief", "Style SwiftSend's landing page so the hero grabs attention, the features are easy to scan and the call to action is unmistakable.", [
        ["All", "A hero at least 70% of the screen height with centred text; buttons at least 44px tall with readable contrast"],
        ["Phone", "Features stacked in one column; no sideways scrolling"],
        ["Tablet and up", "The three features side by side"],
        ["All", "A fluid hero heading"],
      ]),
      {
        id: "a-wd-p2-land-plan",
        title: "One primary action",
        explain: "Landing pages convert best when there is one obvious thing to do.",
        decision: {
          scenario: "The client wants the hero to show five equally prominent buttons: Sign up, Log in, Rates, Agents and Download the app.",
          question: "What do you recommend?",
          options: [
            { id: "a", text: "One prominent primary button (Create an account), with the others as smaller links or elsewhere", why: "Five equal choices compete; one clear primary action is what the page is for. Visual hierarchy decides." },
            { id: "b", text: "Five equal buttons, as asked", whyWrong: "When everything is emphasised, nothing is." },
            { id: "c", text: "No buttons, just text", whyWrong: "The page then has no way to achieve its goal." },
            { id: "d", text: "Make all five flash", whyWrong: "Motion competing for attention is worse, and hostile to people sensitive to motion." },
          ],
          correct: "a",
          aftermath: "Hierarchy is a business decision as much as a design one.",
        },
      },
      {
        id: "a-wd-p2-land-build",
        title: "Build it",
        explain: "Write style.css to the brief.",
        webLab: {
          task: "Style the SwiftSend landing page to the brief.",
          files: { "index.html": LAND_HTML, "style.css": BASE },
          readOnly: ["index.html"],
          tests: [
            noScroll("mobile"),
            { label: "The hero is at least 70% of the screen tall, with centred text", check: "return rect('.hero').height >= window.innerHeight * 0.7 - 1 && style('.hero', 'text-align') === 'center';", fail: ".hero { min-height: 70vh; text-align: center; }" },
            { label: "Buttons are at least 44px tall with readable text (4.5:1)", check: "return $$('.btn').every((b) => rect(b).height >= 44 && contrast(style(b, 'color'), style(b, 'background-color')) >= 4.5);", fail: "Make .btn inline-block, min-height 44px, with strong colour contrast." },
            { viewport: "mobile", label: "Phone: features stack in one column", check: stacked(".feature"), fail: "Keep the default (phone) features in one column." },
            { viewport: "tablet", label: "Tablet: the three features sit side by side", check: sameRow(".feature"), fail: "At min-width: 768px use three columns." },
            { label: "The hero heading is fluid", check: "return rules(/h1/).some((r) => /clamp\\(/.test(r.style.fontSize));", fail: "Use clamp() for the hero's h1." },
          ],
          solution: { "style.css": LAND_DONE },
          hint: "display: grid; place-content: center; centres the hero's contents in both directions.",
          successMessage: "A landing page with a single clear goal, readable and tappable at every width.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P2.3 ═══ */
  {
    id: "wd-l53-dashboard",
    moduleId: "wd-p2-projects",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["P2.3"],
    title: "Project: Responsive Dashboard Layout",
    subtitle: "Dense information that stays usable on a phone",
    estimatedMinutes: 40,
    intro: "Dashboards pack the most information into the least space, which makes them the hardest layouts to make responsive. Grid areas and a scrolling table make it manageable.",
    atoms: [
      brief("a-wd-p2-dash-brief", "The brief", "A shop owner checks this dashboard on a phone in the market and on a laptop in the office. Style it with grid areas.", [
        ["Phone", "Header, then main content, then navigation, one column; stat cards one per row; the table scrolls inside its box"],
        ["600px and up", "Stat cards two per row"],
        ["1024px and up", "A 220px navigation column beside main; header across the top; stat cards four in a row"],
        ["All", "No sideways scrolling of the page itself"],
      ]),
      {
        id: "a-wd-p2-dash-plan",
        title: "Grid items that overflow",
        explain: "A grid item will not shrink below its content's minimum width by default, so a wide table inside one can push the whole grid wider than the screen.",
        decision: {
          scenario: "Your main grid area contains a wide table in a scrolling wrapper, but the page still scrolls sideways on phones.",
          question: "What is the usual fix?",
          options: [
            { id: "a", text: "Give the grid item min-width: 0 so it can shrink, and let the wrapper scroll", why: "Grid and flex items default to min-width: auto, which refuses to shrink below the table. min-width: 0 allows it, so the wrapper's overflow-x: auto can do its job." },
            { id: "b", text: "Delete the table on phones", whyWrong: "The owner needs the data on their phone." },
            { id: "c", text: "Set the table's font size to 6px", whyWrong: "Unreadable." },
            { id: "d", text: "overflow-x: hidden on body", whyWrong: "It hides the problem and cuts off the table." },
          ],
          correct: "a",
          aftermath: "min-width: 0 on a grid or flex child is one of the most useful one-line fixes in CSS.",
        },
      },
      {
        id: "a-wd-p2-dash-build",
        title: "Build it",
        explain: "Write style.css to the brief.",
        webLab: {
          task: "Style the dashboard to the brief, using grid-template-areas.",
          files: { "index.html": DASH_HTML, "style.css": BASE },
          readOnly: ["index.html"],
          tests: [
            noScroll("mobile"),
            { viewport: "mobile", label: "Phone: header, main, then nav", check: "return rect('.app__main').top >= rect('.app__header').bottom - 1 && rect('.app__nav').top >= rect('.app__main').bottom - 1;", fail: "Phone areas: \"header\" \"main\" \"nav\"." },
            { viewport: "mobile", label: "Phone: one stat card per row", check: stacked(".stat"), fail: "One column of stats by default." },
            { viewport: "mobile", label: "Phone: the table scrolls inside its wrapper", check: "const w = $('.table-wrap'); return w.scrollWidth > w.clientWidth && ['auto', 'scroll'].includes(style(w, 'overflow-x'));", fail: ".table-wrap { overflow-x: auto; } and min-width: 0 on .app__main." },
            { viewport: "tablet", label: "Tablet: two stat cards per row", check: perRow(".stat", 2), fail: "At min-width: 600px, two columns of stats." },
            { label: "Laptop: a 220px nav column beside main", check: "const n = rect('.app__nav'), m = rect('.app__main'); return Math.round(n.width) === 220 && m.left >= n.right - 1 && Math.abs(n.top - m.top) < 1;", fail: "At min-width: 1024px: grid-template-columns: 220px 1fr with \"nav main\"." },
            { label: "Laptop: four stat cards in a row", check: perRow(".stat", 4), fail: "At min-width: 1024px, four columns of stats." },
          ],
          solution: { "style.css": DASH_DONE },
          hint: "Two breakpoints: 600px for the stats, 1024px for the sidebar and four stats.",
          successMessage: "A dense dashboard that rearranges itself for a phone in the market and a laptop in the office.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P2.4 ═══ */
  {
    id: "wd-l54-product-site",
    moduleId: "wd-p2-projects",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["P2.4"],
    title: "Project: Product or Service Website",
    subtitle: "A shop window that works on every screen",
    estimatedMinutes: 35,
    intro: "Product grids are the heart of every online shop. Images must line up whatever shape they were photographed in, prices must stand out, and the header must stay within reach.",
    atoms: [
      brief("a-wd-p2-prod-brief", "The brief", "Aba Leather Works sells four products. Style the shop.", [
        ["All", "A sticky header; a product grid that fits as many 160px-plus cards as possible; square, cropped images"],
        ["All", "A Sale badge on the corner of the first product; bold prices"],
        ["Phone", "Two products per row; no sideways scrolling"],
        ["Laptop", "Content at most 1100px wide"],
      ]),
      {
        id: "a-wd-p2-prod-plan",
        title: "Images of different shapes",
        explain: "Product photos rarely share a shape. The fourth one here is a wide 16:9 photo among squares.",
        decision: {
          scenario: "The travel bag photo is 1600 × 900; the others are square. In the grid it is much shorter than the rest.",
          question: "How do you make all four the same?",
          options: [
            { id: "a", text: "aspect-ratio: 1 and object-fit: cover on the grid's images", why: "Every image gets a square box, and each photo is cropped to fill it without stretching." },
            { id: "b", text: "Edit the photo by hand", whyWrong: "Possible, but every new product would need it. CSS solves it for all of them." },
            { id: "c", text: "height: 200px on images", whyWrong: "Without object-fit, the photos are squashed." },
            { id: "d", text: "Leave it", whyWrong: "Uneven cards make the grid look broken." },
          ],
          correct: "a",
          aftermath: "aspect-ratio plus object-fit is the standard product-grid image rule.",
        },
      },
      {
        id: "a-wd-p2-prod-build",
        title: "Build it",
        explain: "Write style.css to the brief.",
        webLab: {
          task: "Style the shop to the brief.",
          files: { "index.html": PROD_HTML, "style.css": BASE },
          readOnly: ["index.html"],
          tests: [
            noScroll("mobile"),
            { label: "The header stays at the top while scrolling", check: "window.scrollTo(0, 800); await tick(); const t = rect('.site-header').top; window.scrollTo(0, 0); await tick(); return style('.site-header', 'position') === 'sticky' && Math.abs(t) < 1;", fail: ".site-header { position: sticky; top: 0; }" },
            { label: "All product images are equal squares, cropped", check: "const r = $$('.product img').map((i) => rect(i)); return r.every((x) => Math.abs(x.width - x.height) < 1.5 && Math.abs(x.width - r[0].width) < 1) && $$('.product img').every((i) => style(i, 'object-fit') === 'cover');", fail: ".product img { width: 100%; aspect-ratio: 1; object-fit: cover; }" },
            { label: "The Sale badge sits on the first product's corner", check: "const b = rect('.badge'), p = rect('.product'); return style('.badge', 'position') === 'absolute' && b.top - p.top < 20 && b.left - p.left < 20;", fail: ".product { position: relative; } .badge { position: absolute; top: 8px; left: 8px; }" },
            { viewport: "mobile", label: "Phone: two products per row", check: perRow(".product", 2), fail: "Use repeat(auto-fill, minmax(160px, 1fr)): on a 375px phone that fits two." },
            { label: "Laptop: the shop is at most 1100px wide", check: "return rect('.shop').width <= 1101;", fail: "width: min(100% - 32px, 1100px)." },
            { label: "Prices are bold", check: "return $$('.price').every((p) => Number(style(p, 'font-weight')) >= 700);", fail: ".price { font-weight: 700; }" },
          ],
          solution: { "style.css": PROD_DONE },
          hint: "auto-fill with minmax(160px, 1fr) gives two columns at 375px and more on wider screens.",
          successMessage: "A shop grid that handles odd-shaped photos, keeps its header in reach and fits two products on a phone.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P2.5 ═══ */
  {
    id: "wd-l55-mobile-nav",
    moduleId: "wd-p2-projects",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["P2.5"],
    title: "Project: Responsive Navigation with Mobile Menu",
    subtitle: "Five links, a sticky header, the current page marked, and visible focus",
    estimatedMinutes: 30,
    intro: "Navigation is used on every page, by every visitor, with every kind of input. This project builds a complete, production-quality responsive navigation.",
    atoms: [
      brief("a-wd-p2-nav-brief", "The brief", "Style the dental practice's navigation. app.js toggles is-open and aria-expanded.", [
        ["Phone", "Links hidden behind a 44px Menu button; when open, stacked full-width links"],
        ["768px and up", "No button; links in a row"],
        ["All", "Sticky header; the current page visibly marked by more than colour; a visible :focus-visible ring on links and the button"],
      ]),
      {
        id: "a-wd-p2-nav-plan",
        title: "Marking the current page",
        explain: "aria-current tells assistive technology which page is current. CSS can use the same attribute so sighted users see it too.",
        decision: {
          scenario: "You want the current page's link to stand out in the navigation.",
          question: "Which selector is best?",
          options: [
            { id: "a", text: ".site-nav a[aria-current=\"page\"]", why: "One source of truth: the attribute that informs screen readers also drives the styling, so they never disagree." },
            { id: "b", text: "A separate .active class added by hand", whyWrong: "Two things to keep in sync; they drift apart." },
            { id: "c", text: ".site-nav a:first-child", whyWrong: "That is always Home, whatever page you are on." },
            { id: "d", text: ".site-nav a:visited", whyWrong: "Visited is not current." },
          ],
          correct: "a",
          aftermath: "Styling with ARIA attributes keeps meaning and appearance in step.",
        },
      },
      {
        id: "a-wd-p2-nav-build",
        title: "Build it",
        explain: "Write style.css to the brief.",
        webLab: {
          task: "Style the responsive navigation to the brief.",
          files: { "index.html": NAV_HTML, "style.css": BASE, "app.js": MENU_JS },
          readOnly: ["index.html", "app.js"],
          tests: [
            noScroll("mobile"),
            { viewport: "mobile", label: "Phone: links hidden; a Menu button at least 44px tall", check: "return !visible('#site-nav') && visible('.menu-toggle') && rect('.menu-toggle').height >= 44;", fail: "Hide .site-nav by default; give the button min-height: 44px." },
            { viewport: "mobile", label: "Phone: Menu opens full-width stacked links", check: `await click('.menu-toggle'); return visible('#site-nav') && Math.abs(rect('#site-nav').width - rect('.site-header').width) < 40 && (() => { ${stacked("#site-nav li")} })();`, fail: ".site-nav.is-open { display: block; width: 100%; } with stacked links." },
            { label: "Laptop: no button, links in a row", check: `return !visible('.menu-toggle') && visible('#site-nav') && (() => { ${sameRow("#site-nav li")} })();`, fail: "At min-width: 768px hide the button and show the links as a flex row." },
            { label: "The header is sticky", check: "return style('.site-header', 'position') === 'sticky';", fail: ".site-header { position: sticky; top: 0; }" },
            { label: "The current page is marked by more than colour", check: "const a = $('a[aria-current=\"page\"]'), b = $('#site-nav a:not([aria-current])'); return style(a, 'text-decoration-line') !== style(b, 'text-decoration-line') || style(a, 'font-weight') !== style(b, 'font-weight') || style(a, 'border-bottom-style') !== style(b, 'border-bottom-style');", fail: "Style a[aria-current=\"page\"] with an underline, a border or bold, not only a colour." },
            { label: "Links and the button have a visible :focus-visible outline", check: "const fv = rules(/:focus-visible/); return fv.some((r) => /a:focus-visible/.test(r.selector)) && fv.some((r) => /(button|menu-toggle):focus-visible/.test(r.selector)) && fv.every((r) => !/none/.test(r.style.outline));", fail: "Add a:focus-visible and .menu-toggle:focus-visible outlines." },
          ],
          solution: { "style.css": NAV_DONE },
          hint: "Phone rules first, then one media query. Use a[aria-current=\"page\"] as the selector for the current link.",
          successMessage: "A navigation that works with a mouse, a finger, a keyboard and a screen reader, at every width.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══ P2.6 · GATE ═══ */
  {
    id: "wd-l56-p2-gate",
    moduleId: "wd-p2-projects",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["P2.6"],
    gate: true,
    title: "Phase 2 Assessment Gate: Responsive at Every Size",
    subtitle: "Mobile, tablet and desktop, with no sideways scrolling, broken layouts or inaccessible navigation",
    estimatedMinutes: 60,
    intro: "This is the Phase 2 gate. Style a coding school's homepage so it works at mobile, tablet and desktop sizes. There is no model answer: everything you need is in Modules 7 to 13 and the five projects you just built.",
    atoms: [
      brief("a-wd-p2-gate-brief", "The gate brief", "The HTML and the menu script are given; you write all of style.css. The checks look at the page at 375px, 768px and 1280px.", [
        ["Every width", "No sideways scrolling; text readable (4.5:1); a :focus-visible ring on links and buttons"],
        ["Phone", "Menu button at least 44px that opens the links; hero image below its text; courses in one column; the fees table scrolls inside its box"],
        ["Tablet", "Links in a row, no button; hero text beside the image; courses two per row"],
        ["Laptop", "Courses three per row; content at most 1100px wide and centred"],
      ]),
      {
        id: "a-wd-p2-gate-build",
        title: "Build your responsive site",
        explain: "Write style.css. Check all three widths often; the checklist names the width each requirement is tested at.",
        webLab: {
          task: "Style the Lekki Coding School homepage to the gate brief.",
          revealSolution: false,
          files: { "index.html": GATE_HTML, "style.css": "/* Your styles */\n", "app.js": MENU_JS },
          readOnly: ["index.html", "app.js"],
          tests: [
            noScroll("mobile"),
            noScroll("tablet"),
            noScroll("desktop"),
            { viewport: "mobile", label: "Phone: a Menu button at least 44px tall opens the hidden links", check: "if (visible('#site-nav') || rect('.menu-toggle').height < 44) return false; await click('.menu-toggle'); return visible('#site-nav') && $('.menu-toggle').getAttribute('aria-expanded') === 'true';", fail: "Hide the nav on phones until .is-open, and make the Menu button at least 44px tall." },
            { viewport: "mobile", label: "Phone: the hero image is below its text; courses in one column", check: `return rect('.hero__img').top >= rect('.hero__text').bottom - 1 && (() => { ${stacked(".course")} })();`, fail: "Keep the phone layout in one column." },
            { viewport: "mobile", label: "Phone: the fees table scrolls inside its box", check: "const w = $('.fees'); return w.scrollWidth > w.clientWidth && ['auto', 'scroll'].includes(style(w, 'overflow-x'));", fail: ".fees { overflow-x: auto; }" },
            { viewport: "tablet", label: "Tablet: links in a row with no Menu button", check: `return !visible('.menu-toggle') && visible('#site-nav') && (() => { ${sameRow("#site-nav li")} })();`, fail: "At 768px hide the button and show the links in a row." },
            { viewport: "tablet", label: "Tablet: hero text beside the image; courses two per row", check: `return rect('.hero__img').left >= rect('.hero__text').right - 1 && (() => { ${perRow(".course", 2)} })();`, fail: "Two hero columns at 768px; two course columns from about 600px." },
            { label: "Laptop: courses three per row; main at most 1100px and centred", check: `const m = rect('main'); return m.width <= 1101 && Math.abs(m.left - (width() - m.right)) < 2 && (() => { ${perRow(".course", 3)} })();`, fail: "Three course columns at laptop width, and a centred container capped at 1100px." },
            { label: "All text passes 4.5:1 contrast against its background", check: "const bgOf = (e) => { for (let n = e; n; n = n.parentElement) { const b = style(n, 'background-color'); if (b !== 'rgba(0, 0, 0, 0)') return b; } return 'rgb(255, 255, 255)'; }; return $$('h1, h2, p, a, td, th, button').every((e) => contrast(style(e, 'color'), bgOf(e)) >= 4.5);", fail: "Some text is too pale for its background. Check links, buttons and the footer." },
            { label: "Links and buttons have a visible :focus-visible outline", check: "const fv = rules(/:focus-visible/); return fv.some((r) => /\\ba:focus-visible|\\.site-nav a:focus-visible|\\.btn:focus-visible/.test(r.selector)) && fv.some((r) => /button:focus-visible|menu-toggle:focus-visible/.test(r.selector)) && fv.every((r) => !/none/.test(r.style.outline));", fail: "Add :focus-visible outlines for links and for the button." },
          ],
          solution: { "style.css": GATE_DONE },
          hint: "Work width by width: get the phone completely right first, then add the 600px, 768px and 1024px queries one at a time.",
          successMessage: "Phase 2 gate passed. You can build responsive, accessible layouts on your own, at every size. Phase 3 teaches you to program.",
        },
      },
      {
        id: "a-wd-p2-gate-review",
        title: "Test beyond the three widths",
        explain: "The checks test three widths. Real devices come in hundreds. Before you call a site done, sweep the widths in between.",
        decision: {
          scenario: "Your gate site passes at 375, 768 and 1280. At 700px, the hero's heading overlaps the image.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Fix it: adjust the breakpoint or the heading's clamp() so 700px works too", why: "Passing three widths is the minimum. Dragging slowly through every width is how professionals find the in-between breakages." },
            { id: "b", text: "Nothing: the checks passed", whyWrong: "Real visitors use 700px screens, such as small tablets and landscape phones." },
            { id: "c", text: "Block widths between 600 and 768", whyWrong: "You cannot control visitors' screens." },
            { id: "d", text: "Remove the image", whyWrong: "Removing content to hide a layout bug is not a fix." },
          ],
          correct: "a",
          aftermath: "Phase 2 complete. Your pages now look right everywhere; next, they start to think.",
        },
      },
    ],
    task: {
      title: "Phase 2 portfolio work",
      intro: "Bring Phase 2 together in your own portfolio folder.",
      prompts: [
        "Restyle your Phase 1 gate site with everything from Phase 2, mobile first.",
        "Rebuild the five Phase 2 projects on your own computer, with your own content.",
        "Test each one at 320, 375, 768, 1024 and 1440px, and on a real phone, and fix what you find.",
        "Run a Lighthouse accessibility audit on each page (DevTools → Lighthouse) and fix every contrast or name issue it reports.",
        "Add screenshots at three widths to your portfolio notes.",
      ],
      closing: "Next: programming, from first principles.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
