/**
 * UI/UX DESIGN · MODULE 8 · WIREFRAMING AND INTERFACE DESIGN
 *
 * Curriculum 8.1 – 8.19 and the practical 8.P. Wireframes from low to high
 * fidelity, sketching, layout structures, websites, mobile apps, dashboards,
 * e-commerce, landing pages, forms, tables, cards, menus, modals, dropdowns,
 * states, consistency and hierarchy in real interfaces.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s8-wireframing";

/* ── Lesson 33 lab: a dashboard layout structure ───────────────────────── */
const SHELL_HTML = page(
  "School admin",
  `  <div class="shell">
    <aside class="side">
      <p class="brand">Bright Future School</p>
      <nav class="menu" aria-label="Main">
        <a href="dashboard.html" aria-current="page">Dashboard</a>
        <a href="students.html">Students</a>
        <a href="fees.html">Fees</a>
        <a href="results.html">Results</a>
      </nav>
    </aside>
    <header class="top"><h1 class="title">Dashboard</h1><a class="user" href="profile.html">Mrs Okafor</a></header>
    <main class="main">
      <section class="tile">Students: 412</section>
      <section class="tile">Fees paid: 78%</section>
      <section class="tile">Results due: 3 classes</section>
    </main>
  </div>`
);

const SHELL_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }

.side { background: #1e1b4b; color: #ffffff; padding: 16px; }
.brand { margin: 0 0 16px; font-weight: 700; }
.menu a { display: block; padding: 10px 12px; border-radius: 8px; color: #e0e7ff; text-decoration: none; }
.menu a[aria-current="page"] { background: #4338ca; color: #ffffff; }

.top { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; }
.user { color: #4338ca; font-weight: 700; }

.main { padding: 24px; }
.tile { padding: 24px; margin-bottom: 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700; }
`;

const SHELL_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }

/* Mobile first: everything stacks; the menu becomes a horizontal strip */
.shell { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-areas: "side" "top" "main"; min-height: 100vh; }
.side { grid-area: side; background: #1e1b4b; color: #ffffff; padding: 16px; }
.top { grid-area: top; }
.main { grid-area: main; }

.brand { margin: 0 0 16px; font-weight: 700; }
.menu { display: flex; gap: 8px; overflow-x: auto; }
.menu a { display: block; padding: 10px 12px; border-radius: 8px; color: #e0e7ff; text-decoration: none; white-space: nowrap; }
.menu a[aria-current="page"] { background: #4338ca; color: #ffffff; }

.top { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #e2e8f0; }
.title { margin: 0; font-size: 1.5rem; }
.user { color: #4338ca; font-weight: 700; }

.main { display: grid; grid-template-columns: 1fr; gap: 16px; padding: 24px 16px; align-content: start; }
.tile { padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700; }

/* Desktop: a 240px sidebar, a header across the top, tiles in a row */
@media (min-width: 1024px) {
  .shell { grid-template-columns: 240px minmax(0, 1fr); grid-template-rows: auto 1fr; grid-template-areas: "side top" "side main"; }
  .menu { display: block; }
  .main { grid-template-columns: repeat(3, 1fr); padding: 24px; }
}
`;

/* ── Lesson 34 lab: a product page ─────────────────────────────────────── */
const PRODUCT_HTML = page(
  "Ankara tote bag",
  `  <main class="product">
    <img class="photo" src="images/product.jpg" alt="Ankara print tote bag in orange and blue, with leather handles">
    <h1 class="name">Ankara tote bag</h1>
    <p class="rating">★★★★☆ <span>4.6 out of 5 (128 reviews)</span></p>
    <p class="price">₦18,500</p>
    <fieldset class="sizes">
      <legend>Size</legend>
      <button type="button" class="size">Small</button>
      <button type="button" class="size">Medium</button>
      <button type="button" class="size" disabled aria-disabled="true">Large</button>
    </fieldset>
    <p class="delivery">Delivery to Lagos: Thursday 12 March · ₦1,500</p>
    <button class="add" type="button">Add to cart</button>
  </main>`
);

const PRODUCT_CSS = `${BASE}
body { color: #111827; }

.product { max-width: 480px; margin: 0 auto; padding: 16px 16px 120px; }
.photo { border-radius: 12px; }
.name { margin: 16px 0 4px; font-size: 1.375rem; }
.rating { margin: 0 0 8px; color: #b45309; }
.rating span { color: #4b5563; }
.price { margin: 0 0 16px; font-size: 16px; font-weight: 400; color: #9ca3af; }

.sizes { display: flex; gap: 4px; margin: 0 0 16px; padding: 0; border: 0; }
.sizes legend { font-weight: 700; margin-bottom: 8px; }
.size { padding: 4px 10px; border: 1px solid #6b7280; border-radius: 8px; background: #ffffff; font: inherit; }
.size:disabled { color: #e5e7eb; }

.delivery { color: #9ca3af; font-size: 13px; }
.add { padding: 8px 16px; border: 0; border-radius: 8px; background: #c2410c; color: #ffffff; font: inherit; font-weight: 700; }
`;

const PRODUCT_CSS_DONE = `${BASE}
body { color: #111827; }

.product { max-width: 480px; margin: 0 auto; padding: 16px 16px 120px; }
.photo { border-radius: 12px; }
.name { margin: 16px 0 4px; font-size: 1.375rem; }
.rating { margin: 0 0 8px; color: #b45309; }
.rating span { color: #4b5563; }

/* The price: the most important number on the page */
.price { margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #111827; }

.sizes { display: flex; gap: 8px; margin: 0 0 16px; padding: 0; border: 0; }
.sizes legend { font-weight: 700; margin-bottom: 8px; }
.size { min-width: 88px; min-height: 44px; padding: 8px 16px; border: 1px solid #6b7280; border-radius: 8px; background: #ffffff; font: inherit; }

/* Unavailable: struck through AND greyed, still readable, not just a colour */
.size:disabled { color: #4b5563; background: #f3f4f6; text-decoration: line-through; cursor: not-allowed; }

.delivery { margin: 0 0 16px; color: #374151; font-size: 15px; }

/* The main action: full width, pinned to the bottom of the phone */
.add {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  min-height: 52px;
  border: 0;
  border-radius: 12px;
  background: #c2410c;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
}
`;

/* ── Lesson 35 lab: a data table ───────────────────────────────────────── */
const TABLE_HTML = page(
  "Fee payments",
  `  <main class="page">
    <h1>Fee payments, first term</h1>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr><th>Student</th><th>Class</th><th class="num">Fee (₦)</th><th class="num">Paid (₦)</th><th class="num">Balance (₦)</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Adaeze Nnamdi</td><td>JSS 2</td><td class="num">145,000</td><td class="num">145,000</td><td class="num">0</td><td>Paid</td></tr>
          <tr><td>Ibrahim Musa</td><td>SS 1</td><td class="num">168,500</td><td class="num">100,000</td><td class="num">68,500</td><td>Part paid</td></tr>
          <tr><td>Tolu Adeyemi</td><td>JSS 3</td><td class="num">145,000</td><td class="num">11,000</td><td class="num">134,000</td><td>Part paid</td></tr>
          <tr><td>Grace Etim</td><td>SS 3</td><td class="num">172,000</td><td class="num">0</td><td class="num">172,000</td><td>Not paid</td></tr>
        </tbody>
      </table>
    </div>
  </main>`
);

const TABLE_CSS = `${BASE}
body { color: #111827; }
.page { max-width: 960px; margin: 0 auto; padding: 24px 16px; }
h1 { font-size: 1.5rem; }

.table { border-collapse: collapse; }
.table th, .table td { padding: 2px; text-align: center; white-space: nowrap; }
.table th { font-weight: 400; }
`;

const TABLE_CSS_DONE = `${BASE}
body { color: #111827; }
.page { max-width: 960px; margin: 0 auto; padding: 24px 16px; }
h1 { font-size: 1.5rem; }

/* On small screens the table scrolls inside its box, not the whole page */
.table-wrap { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 12px; }

.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px 16px; text-align: left; white-space: nowrap; border-bottom: 1px solid #e2e8f0; }
.table th { font-weight: 700; background: #f8fafc; color: #374151; }

/* Numbers: right-aligned with equal-width digits, so they line up */
.table .num { text-align: right; font-variant-numeric: tabular-nums; }
`;

/* ── Lesson 36 lab: consistency ────────────────────────────────────────── */
const CONSIST_HTML = page(
  "Courses",
  `  <main class="page">
    <section class="section">
      <h2 class="section__title">Continue learning</h2>
      <article class="card card--a"><h3>User flows</h3><p>Lesson 4 of 5</p><a class="btn btn--one" href="l4.html">Resume</a></article>
    </section>
    <section class="section">
      <h2 class="section__title section__title--b">Recommended</h2>
      <article class="card card--b"><h3>Design systems</h3><p>12 lessons</p><a class="btn btn--two" href="ds.html">Enrol</a></article>
      <article class="card card--c"><h3>Usability testing</h3><p>10 lessons</p><a class="btn btn--three" href="ut.html">Enrol</a></article>
    </section>
    <section class="section">
      <h2 class="section__title">Saved for later</h2>
      <div class="empty"></div>
    </section>
  </main>`
);

const CONSIST_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.page { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.section { margin-bottom: 32px; }
.section__title { font-size: 20px; }
.section__title--b { font-size: 26px; color: #6d28d9; }

.card { background: #ffffff; border: 1px solid #e2e8f0; margin-bottom: 16px; }
.card h3 { margin: 0 0 4px; }
.card p { margin: 0 0 12px; color: #4b5563; }
.card--a { padding: 24px; border-radius: 12px; }
.card--b { padding: 16px; border-radius: 4px; }
.card--c { padding: 30px; border-radius: 20px; }

.btn { display: inline-block; font-weight: 700; text-decoration: none; }
.btn--one { padding: 12px 20px; border-radius: 8px; background: #6d28d9; color: #ffffff; }
.btn--two { padding: 8px 14px; border-radius: 999px; background: #15803d; color: #ffffff; }
.btn--three { padding: 12px 20px; border-radius: 0; background: #ffffff; color: #6d28d9; border: 1px solid #6d28d9; }
`;

const CONSIST_HTML_DONE = CONSIST_HTML.replace(
  '<div class="empty"></div>',
  '<div class="empty"><p>Nothing saved yet. Tap the bookmark on any course to keep it here.</p><a class="btn" href="courses.html">Browse courses</a></div>'
);

const CONSIST_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }
.page { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.section { margin-bottom: 32px; }
.section__title { font-size: 20px; color: #111827; }

/* One card: same padding and radius everywhere */
.card { padding: 24px; border-radius: 12px; background: #ffffff; border: 1px solid #e2e8f0; margin-bottom: 16px; }
.card h3 { margin: 0 0 4px; }
.card p { margin: 0 0 12px; color: #4b5563; }

/* One primary button: same colour, shape and size everywhere */
.btn { display: inline-block; min-height: 44px; padding: 12px 20px; border-radius: 8px; background: #6d28d9; color: #ffffff; font-weight: 700; text-decoration: none; }

/* Empty state: say why it is empty and what to do */
.empty { padding: 24px; border: 1px dashed #9ca3af; border-radius: 12px; text-align: center; }
.empty p { margin: 0 0 16px; color: #4b5563; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 8.1 – 8.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l33-wireframes",
    moduleId: "ux-m8-wireframing",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7"],
    title: "Wireframes, Fidelity and Layout Structures",
    subtitle: "From a pencil sketch to a pixel-perfect screen, and the skeletons screens are built on",
    estimatedMinutes: 30,
    intro:
      "A wireframe is the blueprint of a screen: what goes where, before decisions about colour and style. This lesson covers why wireframes exist, the three levels of fidelity, sketching on paper and wireframing digitally, and the common layout structures most screens are built on.",

    atoms: [
      {
        id: "a-ux-wireframing",
        title: "What is wireframing?",
        explain:
          "Wireframing is drawing the structure of a screen: which content and controls it contains, where they sit, and how much space each gets, deliberately without final colours, images or styling. Wireframes let a team agree on layout and content cheaply, test flows early, and keep conversations focused on structure (\"should the price be above the photo?\") rather than taste (\"I don't like that green\"). They translate the site map and user flows into screens: every screen step in your flow becomes a wireframe.",
      },
      {
        id: "a-ux-fidelity",
        title: "Low, mid and high fidelity",
        explain:
          "Fidelity is how close a design is to the finished product. Low-fidelity wireframes are rough: boxes, lines and scribbled labels, often on paper, made in minutes to explore many layouts. Mid-fidelity wireframes are digital and tidy, in greyscale, with real headings and labels, proper proportions and a grid, but placeholder images and no visual style: good for testing flows and handing structure to visual design. High-fidelity designs (often called mockups) look like the real product: final colours, typography, images, components and content. Move up in fidelity as confidence grows; going high too early wastes effort and makes people reluctant to change things.",
        table: {
          caption: "The three levels of fidelity.",
          headers: ["", "Low", "Mid", "High"],
          rows: [
            ["Looks like", "Boxes and scribbles", "Clean greyscale layout", "The real product"],
            ["Made with", "Pen and paper, whiteboard", "Figma, greyscale components", "Figma with the design system"],
            ["Content", "Squiggles, rough labels", "Real headings and labels", "Final copy and images"],
            ["Time per screen", "Minutes", "Under an hour", "Hours"],
            ["Best for", "Exploring many ideas", "Agreeing structure, early testing", "Final testing, handoff"],
          ],
        },
      },
      {
        id: "a-ux-sketching-digital",
        title: "Sketching, paper and digital wireframing",
        explain:
          "Start on paper: it is the fastest way to explore. Sketch several different layouts for the same screen (Crazy 8s works here too), using simple conventions: a box with a cross for an image, horizontal lines for text, a rounded rectangle for a button, and real words for headings and buttons. Paper prototypes can even be tested by putting screens in front of people and swapping them as they \"tap\". Then move to digital: in Figma, use a mid-fidelity wireframe kit or your own greyscale components on a layout grid, with real content. Digital wireframes are easier to share, align precisely, and evolve into high fidelity.",
        decision: {
          scenario: "A designer starts a new app by spending two days on one beautiful high-fidelity home screen. The client then asks for a completely different layout.",
          question: "What would have saved those two days?",
          options: [
            { id: "a", text: "Sketching several low-fidelity layouts first and agreeing one with the client before adding visual detail", why: "Rough sketches take minutes, invite honest feedback, and make changing direction cheap." },
            { id: "b", text: "Making the high-fidelity screen even more polished", whyWrong: "Polish does not fix a layout the client does not want." },
            { id: "c", text: "Refusing the change", whyWrong: "The client's feedback is legitimate; the process was the problem." },
            { id: "d", text: "Designing in code instead", whyWrong: "Even slower to change than Figma." },
          ],
          correct: "a",
          aftermath: "Low fidelity first: explore cheaply, commit later.",
        },
      },
      {
        id: "a-ux-layout-structures",
        title: "Layout structures",
        explain:
          "Most screens are built on a few layout structures. Single column: one stream of content, the default for phones and articles. Two column: main content plus a sidebar for navigation or related content. Card grid: repeated items in columns that reflow (products, courses). Split screen: two equal halves, common for sign-in pages with an image. Hero plus sections: a landing page. The dashboard shell: a fixed sidebar for navigation, a header for the page title and account, and a main area of tiles or tables. Choose by content and task, and plan how each structure collapses on smaller screens: a sidebar usually becomes a top bar or a menu.",
        webLab: {
          task:
            "Build the dashboard shell for a school admin system in style.css. On a laptop (1024px and wider): a sidebar 240px wide down the left, running the full height of the screen; the header to the right of it at the top; the main area below the header with the three tiles side by side in equal columns. On a phone: everything stacks in one column (sidebar strip at the top, then the header, then the tiles one above another), with no sideways scrolling.",
          files: { "index.html": SHELL_HTML, "style.css": SHELL_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Laptop: a 240px sidebar on the left, full height", check: "const s = rect('.side'); return Math.round(s.width) === 240 && Math.round(s.left) === 0 && s.height >= window.innerHeight - 1;", fail: ".shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; } with the sidebar spanning both rows." },
            { label: "Laptop: the header sits to the right of the sidebar, at the top", check: "const s = rect('.side'), t = rect('.top'); return Math.round(t.left) === Math.round(s.right) && Math.round(t.top) === 0;", fail: "Use grid areas: \"side top\" \"side main\"." },
            { label: "Laptop: three tiles side by side below the header", check: "const r = $$('.tile').map((n) => rect(n)); return r[0].top >= rect('.top').bottom && Math.abs(r[0].top - r[2].top) < 1 && Math.abs(r[0].width - r[1].width) < 1 && r[0].left >= rect('.side').right;", fail: ".main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }" },
            { label: "Phone: sidebar, header and tiles stack in one column", viewport: "mobile", check: "const s = rect('.side'), t = rect('.top'), r = $$('.tile').map((n) => rect(n)); return t.top >= s.bottom - 1 && r[0].top >= t.bottom - 1 && r[1].top > r[0].bottom && Math.abs(s.width - width()) < 2;", fail: "Mobile first: one column; switch to the sidebar layout in a min-width: 1024px media query." },
            { label: "Phone: no sideways scrolling", viewport: "mobile", check: "return !overflowX();", fail: "Let the menu scroll inside its strip (overflow-x: auto) rather than widening the page." },
          ],
          solution: { "style.css": SHELL_CSS_DONE },
          hint: "Named grid areas make the two layouts easy to read: \"side\" \"top\" \"main\" on phones, \"side top\" \"side main\" on laptops.",
          successMessage: "The skeleton of nearly every admin tool and SaaS product, working at both sizes. Every dashboard in Module 15 starts from this.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 8.8 – 8.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l34-interface-types",
    moduleId: "ux-m8-wireframing",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.8", "8.9", "8.10", "8.11", "8.12"],
    title: "Designing Websites, Apps, Dashboards and Stores",
    subtitle: "What changes from one kind of interface to the next",
    estimatedMinutes: 30,
    intro:
      "The same principles apply everywhere, but each kind of interface has its own conventions and priorities. This lesson covers the essentials of designing websites, mobile apps, dashboards, e-commerce and landing pages.",

    atoms: [
      {
        id: "a-ux-website-design",
        title: "Website interface design",
        explain:
          "Websites are mostly visited to find information, so their priorities are clear navigation, scannable content and working on every screen size. A good website has a consistent header with the logo (linking home) and main navigation, a clear page title on every page, content broken into short sections with headings, visible links, and a footer with secondary links and contact details. Each page should answer \"what is this, and what can I do here?\" within seconds. Content comes first: design around real text, not placeholder Latin.",
      },
      {
        id: "a-ux-mobile-app-design",
        title: "Mobile application interface design",
        explain:
          "Mobile apps are used with thumbs, on small screens, often one-handed and on the move. Put primary navigation in a bottom tab bar (three to five items), keep main actions within thumb reach at the bottom, make touch targets at least 44 to 48 points, use one primary action per screen, and keep text at 16px or larger. Design for interruptions (save progress), poor connectivity (offline states, retries), and both platforms' conventions (Module 9). Respect the safe areas: the status bar at the top and the home indicator at the bottom.",
      },
      {
        id: "a-ux-dashboard-design",
        title: "Dashboard design",
        explain:
          "Dashboards help people monitor and act on information, often all day. Start from the decisions users make: what do they need to notice, compare and do? Put the most important numbers at the top left as summary tiles, followed by trends (charts) and then detail (tables). Keep a consistent grid, label every number with its unit and time period (\"Fees paid this term: 78%\"), show comparisons (versus last term, versus target), and use colour sparingly to flag what needs attention. Fewer, well-chosen metrics beat a wall of charts. Module 15 goes deeper.",
      },
      {
        id: "a-ux-ecommerce-design",
        title: "E-commerce and landing page design",
        explain:
          "E-commerce design is about trust and a short path to buying. Product pages need large, high-quality images; a clear name and price; ratings with the number of reviews; options such as size and colour with unavailable options clearly marked (not by colour alone); delivery cost and date before checkout; and one dominant Add to cart button, on phones often fixed at the bottom. Checkout should be short, allow guest checkout, show progress, and never surprise people with fees. Landing pages (Module 7) follow the same rule: one goal, one dominant action.",
        webLab: {
          task:
            "Improve this product page for phones in style.css: the price must be the clear key number, at least 24px, bold, and passing 4.5:1; the size buttons at least 44px tall with at least 8px between them; the unavailable size marked by more than colour (a line-through) and still readable (4.5:1); the delivery information readable (4.5:1, at least 14px); and Add to cart full width (within 16px of each side) and at least 48px tall, fixed at the bottom of the screen.",
          files: { "index.html": PRODUCT_HTML, "style.css": PRODUCT_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Price: at least 24px, bold and readable", viewport: "mobile", check: CONTRAST + "return px(style('.price', 'font-size')) >= 24 && Number(style('.price', 'font-weight')) >= 700 && ratio('.price') >= 4.5;", fail: ".price { font-size: 28px; font-weight: 700; color: #111827; }" },
            { label: "Size buttons: at least 44px tall, 8px apart", viewport: "mobile", check: "const r = $$('.size').map((n) => rect(n)); return r.every((b) => b.height >= 44) && r.slice(1).every((b, i) => b.left - r[i].right >= 8);", fail: ".size { min-height: 44px; } .sizes { gap: 8px; }" },
            { label: "Unavailable size: struck through and readable", viewport: "mobile", check: CONTRAST + "const d = $('.size:disabled'); return /line-through/.test(style(d, 'text-decoration-line')) && contrast(style(d, 'color'), bgOf(d)) >= 4.5;", fail: ".size:disabled { text-decoration: line-through; color: #4b5563; }" },
            { label: "Delivery: readable and at least 14px", viewport: "mobile", check: CONTRAST + "return ratio('.delivery') >= 4.5 && px(style('.delivery', 'font-size')) >= 14;", fail: ".delivery { color: #374151; font-size: 15px; }" },
            { label: "Add to cart: full width, at least 48px, fixed at the bottom", viewport: "mobile", check: "const r = rect('.add'); return r.height >= 48 && r.left <= 16 && width() - r.right <= 16 && style('.add', 'position') === 'fixed' && window.innerHeight - r.bottom <= 24;", fail: ".add { position: fixed; left: 16px; right: 16px; bottom: 16px; min-height: 52px; }" },
          ],
          solution: { "style.css": PRODUCT_CSS_DONE },
          hint: "Ask what a shopper needs to decide: the price, the size, when it arrives, and one obvious button.",
          successMessage: "Everything a shopper needs to decide is clear, and the button is always under their thumb.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 8.13 – 8.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l35-components",
    moduleId: "ux-m8-wireframing",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.13", "8.14", "8.15", "8.16"],
    title: "Forms, Tables, Cards, Menus, Modals and States",
    subtitle: "The components most screens are made of",
    estimatedMinutes: 30,
    intro:
      "Interfaces are assembled from a small set of components. This lesson covers the ones you will design most often, the rules that make each one work, and the states you must design alongside the ideal one.",

    atoms: [
      {
        id: "a-ux-forms-tables",
        title: "Designing forms and tables",
        explain:
          "Forms (Module 6) need one column, visible labels, the right input types, grouped related fields and one clear submit button. Tables display data people compare: align text left and numbers right (so digits line up by place value), use tabular figures (equal-width digits), make the header row distinct, keep rows readable with enough padding and light dividers, and include units in headers (\"Fee (₦)\") rather than in every cell. Let people sort and filter large tables. On phones, either let the table scroll sideways inside its own container, or turn each row into a card.",
        webLab: {
          task:
            "Make this fee-payments table readable in style.css: header cells bold and visually distinct (a background colour); text columns left-aligned; number columns (class num) right-aligned with tabular figures (font-variant-numeric: tabular-nums); every cell padded at least 8px vertically and 12px horizontally; rows separated by a border line; and on a phone, the table scrolls sideways inside its .table-wrap container instead of making the whole page scroll.",
          files: { "index.html": TABLE_HTML, "style.css": TABLE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Header cells are bold with a background", check: "return $$('th').every((n) => Number(style(n, 'font-weight')) >= 600 && style(n, 'background-color') !== 'rgba(0, 0, 0, 0)');", fail: ".table th { font-weight: 700; background: #f8fafc; }" },
            { label: "Text columns are left-aligned", check: "return $$('td:not(.num), th:not(.num)').every((n) => ['left', 'start'].includes(style(n, 'text-align')));", fail: ".table th, .table td { text-align: left; }" },
            { label: "Numbers are right-aligned with tabular figures", check: "return $$('.num').every((n) => ['right', 'end'].includes(style(n, 'text-align')) && /tabular-nums/.test(style(n, 'font-variant-numeric')));", fail: ".table .num { text-align: right; font-variant-numeric: tabular-nums; }" },
            { label: "Cells padded at least 8px by 12px", check: "return $$('td, th').every((n) => px(style(n, 'padding-top')) >= 8 && px(style(n, 'padding-left')) >= 12 && px(style(n, 'padding-right')) >= 12);", fail: "padding: 12px 16px;" },
            { label: "Rows separated by a border", check: "return $$('tbody td').every((n) => px(style(n, 'border-bottom-width')) >= 1 && style(n, 'border-bottom-style') !== 'none');", fail: "border-bottom: 1px solid #e2e8f0; on the cells." },
            { label: "Phone: the table scrolls inside its container, not the page", viewport: "mobile", check: "const w = $('.table-wrap'); return ['auto', 'scroll'].includes(style(w, 'overflow-x')) && !overflowX();", fail: ".table-wrap { overflow-x: auto; }" },
          ],
          solution: { "style.css": TABLE_CSS_DONE },
          hint: "Right-aligned, equal-width digits put thousands under thousands, so 68,500 and 134,000 can be compared at a glance.",
          successMessage: "A table people can read and compare at a glance, which still works on a phone.",
        },
      },
      {
        id: "a-ux-cards-menus",
        title: "Designing cards and navigation menus",
        explain:
          "A card groups information about one thing (a course, a product, a transaction) into a container that can be repeated in a grid or list. Keep cards consistent: the same padding, radius, image ratio and element order; put the most important information first; and make the whole card a single clear target if it leads somewhere, or give it one obvious action. Navigation menus should use short, familiar labels, show the current page clearly (a highlight plus aria-current), group related items, and keep the same position on every screen. Drop-down mega menus suit large sites; mobile apps use tab bars or drawers.",
      },
      {
        id: "a-ux-modals-dropdowns",
        title: "Modal windows and dropdowns",
        explain:
          "A modal is a window that appears over the page and blocks it until dismissed. Use modals sparingly: for decisions that must be made now (\"Delete this course?\") or short, focused tasks. A good modal has a clear title, a short explanation, a specific primary action (\"Delete course\", not \"OK\"), a way to cancel, closes with Escape and a visible close button, traps keyboard focus inside while open and returns it afterwards, and dims the page behind (figure and ground). Dropdowns (select menus) suit choosing one option from a long list; for two to five options, radio buttons are faster because every choice is visible.",
        decision: {
          scenario: "A news site shows a modal asking visitors to subscribe the moment they arrive, before they have read anything.",
          question: "What is the problem?",
          options: [
            { id: "a", text: "It interrupts people before they have seen any value, so most dismiss it and some leave", why: "Modals block the task. Ask for commitment after people have experienced value, and use a less intrusive pattern such as an inline sign-up." },
            { id: "b", text: "The modal is not big enough", whyWrong: "Size is not the problem; timing and interruption are." },
            { id: "c", text: "Nothing: modals always increase sign-ups", whyWrong: "They often increase bounces and annoyance." },
            { id: "d", text: "It should appear twice", whyWrong: "That doubles the annoyance." },
          ],
          correct: "a",
          aftermath: "A modal interrupts. Use one only when the interruption is worth it to the user.",
        },
      },
      {
        id: "a-ux-ui-states",
        title: "Designing empty, loading and error states",
        explain:
          "For every component and screen, design its states, not just the ideal one. Empty: explain why there is nothing and offer the next step (\"No saved courses yet. Browse courses\"). Loading: skeleton placeholders in the shape of the content, so the page does not jump when it arrives. Error: say what happened in plain words, keep what the person entered, and offer a way forward (\"Couldn't load. Try again\"). Also: partial data, very long content (a name that wraps three lines), no permission, and offline. Present these states alongside the ideal screen in your Figma file so developers build them.",
        table: {
          caption: "States to design for a course list.",
          headers: ["State", "Example"],
          rows: [
            ["Ideal", "Six courses with progress bars"],
            ["Empty", "\"You haven't started a course yet.\" + Browse courses"],
            ["Loading", "Three grey skeleton cards"],
            ["Error", "\"We couldn't load your courses. Check your connection.\" + Try again"],
            ["Long content", "A 90-character course title wrapping onto three lines"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 8.17 – 8.19, 8.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l36-consistency",
    moduleId: "ux-m8-wireframing",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.17", "8.18", "8.19", "8.P"],
    title: "Consistency, Hierarchy and Real Products",
    subtitle: "Making a whole product feel like one thing",
    estimatedMinutes: 32,
    intro:
      "Single screens are easy; whole products are hard, because every screen must feel like part of the same thing. This lesson covers UI consistency, hierarchy across real interfaces, and how to apply everything so far to real products, then sets your module practical: a complete five-page website.",

    atoms: [
      {
        id: "a-ux-ui-consistency",
        title: "UI consistency",
        explain:
          "UI consistency means a component looks and behaves the same everywhere: one primary button style, one card style, one heading scale, one set of icons, one spacing scale, one way of showing errors. Inconsistencies creep in as more screens are designed, by more people, at different times, and each one makes people pause to wonder whether a difference means something. Prevent drift with components and styles (Module 7) and a design system (Module 12); find it with a consistency audit: put all the buttons, cards and headings from every screen side by side and count the variations.",
      },
      {
        id: "a-ux-practical-hierarchy",
        title: "Visual hierarchy in practical interfaces",
        explain:
          "In real interfaces, hierarchy must work across the whole screen and the whole product. Each screen has one primary action, styled the same way on every screen; secondary actions are quieter (outlined or text); destructive actions are distinct and never the most prominent unless they are the screen's purpose. Section headings share one size so sections feel equal, and page titles are always larger than section headings. If a section heading is bigger or a different colour on one screen, people assume it is more important, even if it is not.",
      },
      {
        id: "a-ux-real-products",
        title: "Applying design principles to real products",
        explain:
          "Real products add constraints that clean exercises do not have: real content (long names, missing photos, prices with many digits), real users (older phones, slow networks, people who skim), business requirements (legal text, promotions), and technical limits. Apply the principles as a checklist on every screen: one focal point; consistent components; readable contrast and type; spacing from the system; every state designed; and works at every screen size. Then test with real content: replace \"John Doe\" with the longest real name you can find and see what breaks.",
        webLab: {
          task:
            "This courses screen has drifted: three cards with different padding and corner radii, three primary buttons in three styles, one section heading bigger and purple, and an empty \"Saved for later\" section with nothing in it. Fix it so that: all cards share identical padding and radius; every primary button (.btn) shares the same background, text colour, radius and height (at least 44px); all section headings are the same size and colour; and the empty section explains why it is empty in at least 6 words and offers a .btn action.",
          files: { "index.html": CONSIST_HTML, "style.css": CONSIST_CSS },
          tests: [
            { label: "All cards share padding and corner radius", check: "const v = $$('.card').map((n) => [style(n, 'padding-top'), style(n, 'padding-left'), style(n, 'border-top-left-radius')].join()); return v.length === 3 && new Set(v).size === 1;", fail: "One .card rule for padding and radius; delete the --a, --b and --c differences." },
            { label: "All primary buttons look the same, at least 44px tall", check: "const b = $$('.btn'); const v = b.map((n) => [style(n, 'background-color'), style(n, 'color'), style(n, 'border-top-left-radius'), Math.round(rect(n).height)].join()); return b.length >= 3 && new Set(v).size === 1 && b.every((n) => rect(n).height >= 44);", fail: "One .btn rule with background, colour, radius and min-height: 44px." },
            { label: "Section headings share one size and colour", check: "const v = $$('.section__title').map((n) => style(n, 'font-size') + style(n, 'color')); return new Set(v).size === 1;", fail: "Remove the special .section__title--b styles." },
            { label: "The empty section explains itself and offers an action", check: "const e = $('.empty'); return !!e && text(e).split(/\\s+/).filter(Boolean).length >= 8 && !!e.querySelector('.btn') && visible(e.querySelector('.btn'));", fail: "Add a sentence such as \"Nothing saved yet. Tap the bookmark on any course to keep it here.\" and a Browse courses button." },
            { label: "Buttons are readable", check: CONTRAST + "return passes('.btn', 4.5);", fail: "Keep white text on the purple background." },
          ],
          solution: { "index.html": CONSIST_HTML_DONE, "style.css": CONSIST_CSS_DONE },
          hint: "Delete the modifiers that create the differences, and let the base .card and .btn rules do the work.",
          successMessage: "One card, one button, one heading style and no dead ends. The screen now feels like a product, not a collage.",
        },
      },
    ],

    task: {
      title: "Module 8 practical: wireframes and high-fidelity designs for a five-page website",
      intro: "Choose a real or imagined organisation (a school, a clinic, a small business) and design its website in Figma.",
      prompts: [
        "Define five pages (for example Home, About, Services, a detail page and Contact) and draw a site map.",
        "Sketch at least two low-fidelity layouts for each page on paper, then choose one.",
        "Build mid-fidelity greyscale wireframes in Figma on a 12-column grid, with real headings and content.",
        "Turn them into high-fidelity designs using your style guide and components, including a form and its error state, a card grid and the navigation's current-page state.",
        "Run a consistency audit across all five pages (buttons, cards, headings, spacing) and fix every variation you find.",
      ],
      closing: "Module 9 makes these designs work on every screen size and platform.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
