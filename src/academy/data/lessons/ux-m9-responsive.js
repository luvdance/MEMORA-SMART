/**
 * UI/UX DESIGN · MODULE 9 · RESPONSIVE DESIGN AND CROSS-PLATFORM INTERFACES
 *
 * Curriculum 9.1 – 9.20 and the practical 9.P. Responsive and adaptive
 * design, mobile first and desktop first, breakpoints, viewports, fluid
 * layouts, flexible dimensions and type, responsive grids, navigation,
 * images, touch targets, Material Design, Apple's Human Interface Guidelines
 * and consistent cross-platform experiences. Every lab is measured at phone
 * (375px), tablet (768px) and laptop (1280px) widths.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s9-responsive";

/* ── Lesson 37 lab: mobile-first breakpoints ───────────────────────────── */
const COURSES = ["Intro to Figma", "UX research", "Design systems", "Usability testing", "Accessibility", "Portfolio"];
const GRID_HTML = page(
  "Courses",
  `  <main class="page">
    <h1>All courses</h1>
    <div class="grid">
${COURSES.map((c) => `      <article class="card"><h2>${c}</h2><p>Self-paced · Certificate</p></article>`).join("\n")}
    </div>
  </main>`
);

const GRID_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.page { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

@media (max-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

.card { padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
.card h2 { margin: 0 0 8px; font-size: 20px; }
.card p { margin: 0; color: #4b5563; }
`;

const GRID_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }
.page { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }

/* Mobile first: one column by default */
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* Tablet and up: two columns */
@media (min-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
}

/* Laptop and up: three columns */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

.card { padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
.card h2 { margin: 0 0 8px; font-size: 20px; }
.card p { margin: 0; color: #4b5563; }
`;

const COLS = "const r = $$('.card').map((n) => Math.round(rect(n).top)); const cols = r.filter((t) => t === r[0]).length;";

/* ── Lesson 38 lab: fluid type and layout ──────────────────────────────── */
const FLUID_HTML = page(
  "Design for every screen",
  `  <main class="article">
    <img class="hero" src="images/article.jpg" alt="A designer comparing layouts on a phone, a tablet and a laptop">
    <h1 class="title">Design for every screen, not just yours</h1>
    <p class="lede">Your users hold phones, tablets and laptops of every size. A layout that only works on your screen is a layout that fails most of them.</p>
    <p>Fluid layouts use percentages, flexible units and maximum widths instead of fixed pixel sizes, so content reflows to fit whatever space it gets. Typography can scale too, within limits that keep it readable.</p>
  </main>`
);

const FLUID_CSS = `${BASE}
body { color: #111827; }

.article { width: 1100px; margin: 0 auto; padding: 24px; }
.hero { width: 1100px; border-radius: 12px; }
.title { font-size: 56px; line-height: 1.1; }
.lede { font-size: 22px; color: #374151; }
p { font-size: 18px; line-height: 1.6; }
`;

const FLUID_CSS_DONE = `${BASE}
body { color: #111827; }

/* Flexible width with a maximum, and padding that never touches the edge */
.article { max-width: 760px; margin: 0 auto; padding: 24px clamp(16px, 4vw, 32px); }
.hero { width: 100%; border-radius: 12px; }

/* Fluid type: grows with the screen, between a minimum and a maximum */
.title { font-size: clamp(28px, 1.45rem + 1.8vw, 48px); line-height: 1.15; }
.lede { font-size: clamp(18px, 1rem + 0.5vw, 22px); color: #374151; }
p { font-size: clamp(16px, 0.95rem + 0.2vw, 18px); line-height: 1.6; }
`;

/* ── Lesson 39 lab: responsive navigation ──────────────────────────────── */
const NAV_HTML = page(
  "Kano Clinic",
  `  <header class="header">
    <a class="logo" href="/">Kano Clinic</a>
    <button class="toggle" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav class="nav" id="menu" aria-label="Main">
      <a href="services.html">Services</a>
      <a href="doctors.html">Doctors</a>
      <a href="book.html">Book a visit</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>
  <main class="content"><h1>Care close to home</h1><p>Book a visit with a doctor in minutes.</p></main>`,
  { js: true }
);

const NAV_JS = `// Read-only: the menu button opens and closes the navigation.
const toggle = document.querySelector(".toggle");
const header = document.querySelector(".header");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  header.classList.toggle("is-open", !open);
});
`;

const NAV_CSS = `${BASE}
body { color: #111827; }

.header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.logo { font-weight: 700; font-size: 1.125rem; color: #0f766e; text-decoration: none; }
.toggle { padding: 4px 8px; border: 1px solid #0f766e; border-radius: 6px; background: transparent; color: #0f766e; font: inherit; }
.nav { display: flex; gap: 24px; }
.nav a { color: #0f766e; font-weight: 700; text-decoration: none; }

.content { padding: 24px 16px; }
`;

const NAV_CSS_DONE = `${BASE}
body { color: #111827; }

.header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.logo { font-weight: 700; font-size: 1.125rem; color: #0f766e; text-decoration: none; }

/* Phone: a 44px Menu button; the links are hidden until it is opened */
.toggle { min-width: 44px; min-height: 44px; padding: 8px 16px; border: 1px solid #0f766e; border-radius: 8px; background: transparent; color: #0f766e; font: inherit; font-weight: 700; }
.nav { display: none; width: 100%; flex-direction: column; padding-top: 8px; }
.header.is-open .nav { display: flex; }
.nav a { display: flex; align-items: center; min-height: 48px; color: #0f766e; font-weight: 700; text-decoration: none; border-top: 1px solid #e5e7eb; }

/* Laptop and tablet: links in a row, no Menu button */
@media (min-width: 768px) {
  .toggle { display: none; }
  .nav { display: flex; flex-direction: row; width: auto; gap: 24px; padding-top: 0; }
  .nav a { min-height: 44px; border-top: 0; }
}

.content { padding: 24px 16px; }
`;

/* ── Lesson 40 lab: a cross-platform tab bar ───────────────────────────── */
const icon = (d) => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="${d}" fill="currentColor"/></svg>`;
const TABS_HTML = page(
  "KoboSave",
  `  <main class="screen"><h1>Home</h1><p>Your savings at a glance.</p></main>
  <nav class="tabbar" aria-label="Main">
    <a class="tab" href="home.html" aria-current="page">${icon("M12 3 2 12h3v8h6v-6h2v6h6v-8h3z")}<span class="tab__label">Home</span></a>
    <a class="tab" href="save.html">${icon("M5 8h14v11H5zM8 5h8v3H8z")}<span class="tab__label">Save</span></a>
    <a class="tab" href="history.html">${icon("M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 4v4l3 2-1 1-4-3V8z")}<span class="tab__label">History</span></a>
    <a class="tab" href="profile.html">${icon("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0z")}<span class="tab__label">Profile</span></a>
  </nav>`
);

const TABS_CSS = `${BASE}
body { color: #111827; }
.screen { padding: 24px 16px 120px; }

.tabbar { display: flex; justify-content: space-around; padding: 4px; border-top: 1px solid #e5e7eb; background: #ffffff; }
.tab { padding: 4px; color: #9ca3af; text-decoration: none; }
.tab__label { display: none; }
.tab[aria-current="page"] { color: #0f766e; }
`;

const TABS_CSS_DONE = `${BASE}
body { color: #111827; }
.screen { padding: 24px 16px 120px; }

/* Fixed to the bottom, clear of the iPhone home indicator */
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
  padding-bottom: env(safe-area-inset-bottom);
}

/* Each tab: an equal share of the width, icon above a visible label, 56px tall */
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 56px;
  color: #4b5563;
  font-size: 12px;
  text-decoration: none;
}

/* The current tab: colour AND weight AND an indicator bar */
.tab[aria-current="page"] { color: #0f766e; font-weight: 700; box-shadow: inset 0 3px 0 #0f766e; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 9.1 – 9.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l37-responsive",
    moduleId: "ux-m9-responsive",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3", "9.4", "9.5", "9.6"],
    title: "Responsive Design, Breakpoints and Viewports",
    subtitle: "One design that works on every screen",
    estimatedMinutes: 30,
    intro:
      "In Nigeria most people reach the web on a phone, but the same product is also used on tablets and laptops. This lesson explains responsive design, how it differs from adaptive design, mobile-first and desktop-first approaches, breakpoints, and the viewports and resolutions you design for.",

    atoms: [
      {
        id: "a-ux-responsive",
        title: "What is responsive design?",
        explain:
          "Responsive design makes one interface adapt its layout to the screen it is viewed on: columns reflow, images scale, navigation changes form, and type adjusts, all from one design and one codebase. It rests on three ideas: fluid layouts that use proportions rather than fixed sizes, flexible images and media that scale within their containers, and media queries that change the layout at chosen widths (breakpoints). The goal is not identical screens everywhere, but the best possible experience at every size, with the same content and functionality.",
      },
      {
        id: "a-ux-responsive-adaptive",
        title: "Responsive versus adaptive design",
        explain:
          "Responsive design uses one fluid layout that stretches continuously and changes at breakpoints. Adaptive design creates several fixed layouts, typically for a few specific screen widths, and serves whichever fits best. Responsive is the modern default for the web because it handles the huge variety of screens gracefully; adaptive gives more control for specific devices and is sometimes used for very complex interfaces or when retrofitting an old site. In practice, designers often draw a few key sizes (adaptive-style artboards) and specify how the layout flows between them (responsive behaviour).",
        table: {
          caption: "Responsive and adaptive design compared.",
          headers: ["", "Responsive", "Adaptive"],
          rows: [
            ["Layouts", "One fluid layout", "Several fixed layouts"],
            ["Between sizes", "Stretches smoothly", "Snaps to the nearest layout"],
            ["Effort", "One design, careful rules", "Several designs to maintain"],
            ["Best for", "Most websites and web apps", "Specific devices, legacy sites"],
          ],
        },
      },
      {
        id: "a-ux-mobile-desktop-first",
        title: "Mobile-first and desktop-first design",
        explain:
          "Mobile-first design starts with the smallest screen and adds layout as space grows. It forces you to prioritise (only the essentials fit on a phone), suits markets where most users are on phones, and produces simpler, faster code: base styles for phones, then min-width media queries for larger screens. Desktop-first starts with the large layout and removes or rearranges for smaller screens using max-width queries; it suits tools mostly used at a desk (complex dashboards, design software). For most consumer products in Nigeria, design mobile first and expand.",
        decision: {
          scenario: "Analytics for a bill-payment site show 82% of visits come from Android phones. The designer has only designed the desktop layout so far.",
          question: "What should they do?",
          options: [
            { id: "a", text: "Redesign starting from the phone layout, then expand to tablet and desktop", why: "Most users are on phones, and starting small forces the right priorities. The desktop design can grow from it." },
            { id: "b", text: "Shrink the desktop layout to fit phones", whyWrong: "Shrinking produces tiny text and targets and keeps desktop priorities." },
            { id: "c", text: "Keep desktop only and ask users to switch device", whyWrong: "Most users do not have that option." },
            { id: "d", text: "Build a separate mobile app instead", whyWrong: "The website still has to work on phones." },
          ],
          correct: "a",
          aftermath: "Design for where your users actually are.",
        },
      },
      {
        id: "a-ux-breakpoints",
        title: "Breakpoints",
        explain:
          "A breakpoint is a width at which the layout changes. Choose breakpoints where your content needs them (when a line gets too long, or columns get too narrow), not to match particular devices, which change every year. Common starting points: around 600px (large phones to small tablets), 768px (tablets), 1024px (small laptops and landscape tablets) and 1280px or 1440px (desktops). In mobile-first CSS each breakpoint is a min-width media query that adds to the styles below it. In Figma, design frames at the key sizes and note what changes at each breakpoint.",
        webLab: {
          task:
            "This course grid was built desktop first and is wrong on phones: it shows two squeezed columns. Rebuild style.css mobile first: one column by default; two columns from 600px; three columns from 1024px. Use only min-width media queries (no max-width), and make sure nothing scrolls sideways at any size.",
          files: { "index.html": GRID_HTML, "style.css": GRID_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Phone (375px): one column", viewport: "mobile", check: COLS + "return cols === 1 && !overflowX();", fail: "Default: .grid { grid-template-columns: 1fr; }" },
            { label: "Tablet (768px): two columns", viewport: "tablet", check: COLS + "return cols === 2 && !overflowX();", fail: "@media (min-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); } }" },
            { label: "Laptop (1280px): three columns", check: COLS + "return cols === 3;", fail: "@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }" },
            { label: "Mobile first: only min-width media queries", check: "const m = media(); return m.length >= 2 && m.every((q) => /min-width/.test(q) && !/max-width/.test(q));", fail: "Replace the max-width query with two min-width queries." },
          ],
          solution: { "style.css": GRID_CSS_DONE },
          hint: "Write the phone layout with no media query at all; each min-width query then adds columns.",
          successMessage: "One, two, three columns as the screen grows, built from the phone up.",
        },
      },
      {
        id: "a-ux-viewports",
        title: "Viewports and screen resolutions",
        explain:
          "The viewport is the visible area of a web page. Screen resolution is the number of physical pixels, but designers work in CSS pixels (points on iOS, density-independent pixels or dp on Android), which are roughly the same physical size on every device: a phone with 1080 physical pixels across and a device pixel ratio of 3 has a viewport about 360 CSS pixels wide. Design phone frames at 360 to 390 wide (common Android and iPhone widths), tablets at 768 to 834, and desktops at 1280 to 1440. A page needs the viewport meta tag (width=device-width, initial-scale=1) or phones pretend to be desktops and shrink everything.",
        table: {
          caption: "Common viewport widths to design for.",
          headers: ["Device", "Viewport width (CSS px)"],
          rows: [
            ["Small Android phone", "360"],
            ["iPhone (standard)", "375 to 393"],
            ["Large phone", "412 to 430"],
            ["Tablet portrait", "768 to 834"],
            ["Laptop", "1280 to 1440"],
            ["Desktop monitor", "1920"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 9.7 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l38-fluid",
    moduleId: "ux-m9-responsive",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.7", "9.8", "9.9", "9.10"],
    title: "Fluid Layouts, Flexible Sizes, Grids and Type",
    subtitle: "Designing in proportions and ranges instead of fixed pixels",
    estimatedMinutes: 28,
    intro:
      "A responsive design is mostly made of decisions about what stays fixed and what flexes. This lesson covers fluid layouts, when to use fixed and flexible dimensions, responsive grids, and typography that scales with the screen.",

    atoms: [
      {
        id: "a-ux-fluid-layouts",
        title: "Fluid layouts",
        explain:
          "A fluid layout sizes its containers in proportions (percentages, fractions of a grid) instead of fixed pixels, so it stretches and shrinks with the viewport. Fluid does not mean unlimited: give content areas a maximum width (around 680 to 760px for reading, 1200px or so for page layouts) so lines do not become uncomfortably long on wide screens, and keep a minimum side padding (16px on phones) so content never touches the edge. Fluid images use width: 100% of their container, never a fixed width wider than a phone.",
      },
      {
        id: "a-ux-fixed-flexible",
        title: "Fixed and flexible dimensions",
        explain:
          "Some things should stay fixed: touch targets (at least 44px), icon sizes, border widths, sidebar widths on desktop, and the maximum width of text. Other things should flex: column widths, image widths, gaps between large sections, and side padding. In Figma this is the choice between Fixed, Hug and Fill (Module 7). A common mistake is fixing a width that should flex (a 1100px article that scrolls sideways on phones) or flexing something that should stay fixed (a button that shrinks below a tappable size on small screens).",
        table: {
          caption: "What to fix and what to flex.",
          headers: ["Fixed", "Flexible"],
          rows: [
            ["Touch target minimum (44px)", "Column widths"],
            ["Icon sizes", "Image widths (100% of the container)"],
            ["Maximum text width", "Side padding and section gaps"],
            ["Desktop sidebar width", "The main content area"],
          ],
        },
      },
      {
        id: "a-ux-responsive-grids",
        title: "Responsive grids",
        explain:
          "A responsive grid changes its number of columns at breakpoints while keeping gutters and margins consistent: commonly 4 columns on phones, 8 on tablets and 12 on desktops. Content spans columns differently at each size: a card might span all 4 columns on a phone (one per row), 4 of 8 on a tablet (two per row) and 4 of 12 on a desktop (three per row). Set up the matching layout grids on your Figma frames so every size is designed on the right structure, and annotate how each component spans the grid.",
        decision: {
          scenario: "A designer draws the phone, tablet and desktop versions of a page, each with its own random column widths and spacing.",
          question: "What problem will developers face?",
          options: [
            { id: "a", text: "There is no consistent rule to build from, so they must guess how the layout behaves between and across sizes", why: "A responsive grid (4, 8, 12 columns with fixed gutters) gives a rule that works at every width, not just the three drawn." },
            { id: "b", text: "None: three drawings are enough", whyWrong: "Pages are viewed at every width in between, not just three." },
            { id: "c", text: "The file will be too large", whyWrong: "File size is not the issue." },
            { id: "d", text: "Developers will refuse to build mobile layouts", whyWrong: "They will build them, but inconsistently." },
          ],
          correct: "a",
          aftermath: "Design on a grid, and specify how components span it at each breakpoint.",
        },
      },
      {
        id: "a-ux-flexible-type",
        title: "Flexible typography",
        explain:
          "Headings that look right on a laptop are often too big on a phone, and phone-sized headings look timid on a wide screen. Flexible (fluid) typography scales type with the viewport between a minimum and a maximum. In CSS this is clamp(minimum, preferred, maximum), for example clamp(28px, 1.45rem + 1.8vw, 48px): never smaller than 28px, never larger than 48px, growing smoothly in between. Body text should change much less than headings (16 to 18px), and never drop below 16px. In Figma, specify the type size at each breakpoint and the range.",
        webLab: {
          task:
            "This article is fixed at 1100px and its headline is 56px everywhere, so on a phone it scrolls sideways and the headline swallows the screen. Make it fluid in style.css: the article flexible with a maximum width of no more than 800px; the hero image as wide as the article, never wider; the headline between 28px and 32px on a phone, between 44px and 56px on a laptop, and in between on a tablet, using clamp(); body paragraphs at least 16px everywhere; and no sideways scrolling at any size.",
          files: { "index.html": FLUID_HTML, "style.css": FLUID_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Phone: no sideways scroll, image fits", viewport: "mobile", check: "return !overflowX() && rect('.hero').width <= rect('.article').width + 1;", fail: ".article { max-width: 760px; } .hero { width: 100%; }" },
            { label: "Laptop: the article is at most 800px wide", check: "return rect('.article').width <= 800;", fail: "max-width: 760px; margin: 0 auto;" },
            { label: "Phone: headline between 28 and 32px", viewport: "mobile", check: "const s = px(style('.title', 'font-size')); return s >= 28 && s <= 32;", fail: "Use clamp(28px, …, 48px)." },
            { label: "Laptop: headline between 44 and 56px", check: "const s = px(style('.title', 'font-size')); return s >= 44 && s <= 56;", fail: "The maximum of the clamp should be about 48px." },
            { label: "Tablet: headline in between", viewport: "tablet", check: "const s = px(style('.title', 'font-size')); return s > 32 && s < 44;", fail: "The middle value should grow with the viewport: for example 1.45rem + 1.8vw." },
            { label: "Body text at least 16px on a phone, and clamp() is used", viewport: "mobile", check: "return $$('.article p').every((p) => px(style(p, 'font-size')) >= 16) && /clamp\\(/.test(code('style.css'));", fail: "p { font-size: clamp(16px, 0.95rem + 0.2vw, 18px); }" },
          ],
          solution: { "style.css": FLUID_CSS_DONE },
          hint: "In clamp(a, b, c), b decides how fast the size grows: a rem part plus a vw part. Check the result at 375, 768 and 1280.",
          successMessage: "The same article now reads comfortably on a phone and looks confident on a laptop, with no breakpoints at all for the type.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 9.11 – 9.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l39-nav-touch",
    moduleId: "ux-m9-responsive",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.11", "9.12", "9.13", "9.14", "9.15", "9.16"],
    title: "Navigation, Layouts, Images and Touch Across Devices",
    subtitle: "What changes between phone, tablet and desktop",
    estimatedMinutes: 32,
    intro:
      "Some parts of an interface change shape completely between devices. This lesson covers responsive navigation and mobile navigation patterns, how layouts differ between desktop, tablet and phone, responsive images and assets, and designing for fingers rather than mouse pointers.",

    atoms: [
      {
        id: "a-ux-responsive-navigation",
        title: "Responsive navigation and mobile navigation patterns",
        explain:
          "Desktop navigation usually shows all main links in a top bar. On phones there is not enough width, so navigation changes form. The main mobile patterns: a bottom tab bar for three to five main destinations (best for apps, always visible, thumb-friendly); a menu button (often a hamburger icon, ideally labelled \"Menu\") that reveals the links (saves space, but hidden links are used less); a priority+ pattern that shows the most important links and moves the rest under \"More\"; and a horizontally scrolling strip of links. Whatever the pattern, the menu button must be a real button at least 44px in size, announce whether it is open (aria-expanded), and its links must be easy to tap.",
        webLab: {
          task:
            "Make the clinic's navigation responsive in style.css. On a phone: show the Menu button at least 44 × 44px; hide the links until the button is pressed (the script adds the class is-open to .header and sets aria-expanded); when open, show the links stacked one per line, each at least 44px tall. From 768px up: hide the Menu button and show the links in a single row.",
          files: { "index.html": NAV_HTML, "style.css": NAV_CSS, "app.js": NAV_JS },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "Phone: the Menu button is at least 44 × 44px", viewport: "mobile", check: "const r = rect('.toggle'); return visible('.toggle') && r.width >= 44 && r.height >= 44;", fail: ".toggle { min-width: 44px; min-height: 44px; }" },
            { label: "Phone: links are hidden until the menu is opened", viewport: "mobile", check: "return $$('.nav a').every((a) => !visible(a));", fail: ".nav { display: none; } on phones." },
            { label: "Phone: opening the menu shows the links stacked, each 44px tall", viewport: "mobile", check: "await click('.toggle'); const r = $$('.nav a').map((a) => rect(a)); return $('.toggle').getAttribute('aria-expanded') === 'true' && $$('.nav a').every((a) => visible(a)) && r.every((x) => x.height >= 44) && r.slice(1).every((x, i) => x.top >= r[i].bottom - 1);", fail: ".header.is-open .nav { display: flex; flex-direction: column; } .nav a { min-height: 48px; }" },
            { label: "Laptop: no Menu button", check: "return !visible('.toggle');", fail: "@media (min-width: 768px) { .toggle { display: none; } }" },
            { label: "Laptop: all links visible in one row", check: "const r = $$('.nav a').map((a) => rect(a)); return $$('.nav a').every((a) => visible(a)) && r.every((x) => Math.abs(x.top - r[0].top) < 2);", fail: "@media (min-width: 768px) { .nav { display: flex; flex-direction: row; } }" },
          ],
          solution: { "style.css": NAV_CSS_DONE },
          hint: "Hide the links by default and show them with .header.is-open .nav; then undo both inside a min-width: 768px query.",
          successMessage: "One navigation, two shapes: a tidy menu on phones with big, tappable links, and a simple row on larger screens.",
        },
      },
      {
        id: "a-ux-device-layouts",
        title: "Desktop, mobile and tablet layouts",
        explain:
          "Desktop layouts have width to spare: multiple columns, sidebars, hover interactions and dense information suit them. Phone layouts are one column, prioritised top to bottom, with primary actions within thumb reach and no reliance on hover (there is none). Tablets sit between and are easy to neglect: in portrait they often suit a two-column layout or a phone layout with more breathing room; in landscape, something close to desktop, but still touch-driven, so targets must stay large. Design all three for key screens and check that content order on the phone matches priority, not just the desktop's left-to-right order.",
        decision: {
          scenario: "On desktop, a product page shows filters in a left sidebar. On phones the sidebar is simply stacked above the products, so shoppers scroll past twenty filters before seeing anything.",
          question: "What is the better phone layout?",
          options: [
            { id: "a", text: "Show products first, with a \"Filter\" button that opens the filters in a panel", why: "Products are the priority; filters are a tool you open when needed. Order on phones follows priority, not desktop position." },
            { id: "b", text: "Keep the filters on top, but make them smaller", whyWrong: "Still pushes the products down and makes filters harder to use." },
            { id: "c", text: "Remove filters on phones", whyWrong: "Phone users need filters as much as anyone." },
            { id: "d", text: "Put the filters at the bottom of the page", whyWrong: "Few people would find them." },
          ],
          correct: "a",
          aftermath: "Stacking is not designing: decide the order by priority.",
        },
      },
      {
        id: "a-ux-responsive-images",
        title: "Responsive images and assets",
        explain:
          "Images must scale to their container (width 100%, height auto) and keep their aspect ratio, so layouts do not jump while they load. Serve sizes that fit: a 2000px photo wastes data on a 375px phone, which matters a lot where data is expensive. Developers use srcset and sizes to let the browser pick the right file, and modern formats such as WebP or AVIF to make files smaller. Art direction means using a different crop for small screens (a tight crop of a face instead of a wide group shot), done with the picture element. Designers provide images at the needed sizes and crops, icons as SVG, and raster assets at 1x, 2x and 3x for high-density screens.",
        example:
          "<img src=\"hero-800.jpg\"\n     srcset=\"hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w\"\n     sizes=\"(min-width: 1024px) 50vw, 100vw\"\n     alt=\"Nurse checking a child's temperature at the clinic\"\n     width=\"1600\" height=\"900\">\n\nA 375px phone downloads hero-400.jpg (about 40 KB),\nnot hero-1600.jpg (about 400 KB).",
      },
      {
        id: "a-ux-touch-targets",
        title: "Touch targets",
        explain:
          "Fingers are much less precise than mouse pointers: the average fingertip covers about 10mm. Apple recommends touch targets of at least 44 × 44 points; Google's Material Design recommends 48 × 48 dp; WCAG 2.2 sets a minimum of 24 × 24 CSS pixels with spacing (Level AA) and 44 × 44 for the stricter Level AAA. A small icon can have a larger invisible target around it. Leave space between targets (at least 8px) so people do not hit the wrong one, and keep destructive actions away from common ones. Thumbs reach the bottom and middle of a phone easily and the top corners poorly.",
        table: {
          caption: "Minimum touch target sizes.",
          headers: ["Source", "Minimum"],
          rows: [
            ["Apple Human Interface Guidelines", "44 × 44 pt"],
            ["Google Material Design", "48 × 48 dp"],
            ["WCAG 2.2 AA (2.5.8)", "24 × 24 CSS px, or enough spacing"],
            ["WCAG 2.2 AAA (2.5.5)", "44 × 44 CSS px"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 9.17 – 9.20, 9.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l40-platforms",
    moduleId: "ux-m9-responsive",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.17", "9.18", "9.19", "9.20", "9.P"],
    title: "Platforms: Material Design and Apple's Guidelines",
    subtitle: "Designing for Android and iOS, and keeping one product consistent",
    estimatedMinutes: 32,
    intro:
      "Android and iPhone users have different habits and expectations, shaped by Google's Material Design and Apple's Human Interface Guidelines. This lesson introduces both, explains how to stay consistent across platforms, and sets your practical: one website at three sizes.",

    atoms: [
      {
        id: "a-ux-platform-considerations",
        title: "Platform design considerations",
        explain:
          "Each platform has conventions its users rely on: how back navigation works (Android has a system back gesture; iOS uses a back button at the top left and an edge swipe), where tabs go, what system controls look like (date pickers, switches, alerts), typography (Roboto on Android, San Francisco on iOS), and safe areas around notches and home indicators. Respecting them makes an app feel native; ignoring them makes it feel foreign. In Nigeria, Android dominates (often mid-range devices with smaller screens and less memory), so test Android designs on real, modest phones.",
      },
      {
        id: "a-ux-material",
        title: "Introduction to Android Material Design",
        explain:
          "Material Design is Google's design system, now in its third version (Material 3, also called Material You). Its foundations: an 8dp spacing grid, touch targets of at least 48 × 48 dp, dynamic colour that can adapt to the user's wallpaper, a type scale (Display, Headline, Title, Body, Label), elevation shown through tonal surfaces and shadows, and a large library of components such as the navigation bar (bottom, three to five destinations), floating action button (one primary action), top app bar, cards, chips, snackbars and dialogs. The official Material 3 kit is free in the Figma community.",
      },
      {
        id: "a-ux-apple-hig",
        title: "Introduction to Apple Human Interface Guidelines",
        explain:
          "Apple's Human Interface Guidelines (HIG) describe how to design for iPhone, iPad, Mac and other Apple platforms. Key ideas for iPhone: clarity, deference (the interface steps back so content leads) and depth; touch targets of at least 44 × 44 points; the San Francisco font with Dynamic Type, so text grows with the user's settings; a tab bar at the bottom with icons and short labels; navigation bars with large titles and a back button at the top left; sheets that slide up from the bottom; and respect for the safe areas around the Dynamic Island and the home indicator. Apple publishes an official iOS kit in the Figma community.",
        table: {
          caption: "Material Design and Apple HIG side by side.",
          headers: ["", "Material Design (Android)", "Apple HIG (iOS)"],
          rows: [
            ["Minimum target", "48 × 48 dp", "44 × 44 pt"],
            ["System font", "Roboto", "San Francisco"],
            ["Main navigation", "Navigation bar (bottom)", "Tab bar (bottom)"],
            ["Back", "System back gesture or button", "Back button top left, edge swipe"],
            ["Primary action", "Floating action button", "Button in the navigation bar or content"],
          ],
        },
      },
      {
        id: "a-ux-cross-platform",
        title: "Designing consistent cross-platform experiences",
        explain:
          "A product on Android, iOS and the web should feel like the same product while respecting each platform. Keep consistent what defines the product: brand colours and type for headings, content, features, information architecture, terminology and the overall flow. Adapt what each platform's users expect: system controls, back navigation, fonts for body text, safe areas and some layout conventions. Shared design tokens and components with platform variants keep this manageable. A bottom tab bar is a good example: both platforms use one, so one design with visible labels, large targets, a clear current tab and safe-area padding works on both.",
        webLab: {
          task:
            "Design KoboSave's bottom tab bar to work on Android and iPhone. In style.css: fix the bar to the bottom of the screen with padding for the iPhone home indicator (padding-bottom: env(safe-area-inset-bottom)); give the four tabs equal widths across the bar, each at least 48px tall (meeting both platforms' minimum); show each label under its icon (labels must be visible, at least 12px, and readable at 4.5:1); and mark the current tab with more than colour (for example bolder text and an indicator line), still readable.",
          files: { "index.html": TABS_HTML, "style.css": TABS_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The bar is fixed to the bottom, with safe-area padding", viewport: "mobile", check: String.raw`return style('.tabbar', 'position') === 'fixed' && window.innerHeight - rect('.tabbar').bottom < 1 && /env\(\s*safe-area-inset-bottom\s*\)/.test(code('style.css'));`, fail: ".tabbar { position: fixed; left: 0; right: 0; bottom: 0; padding-bottom: env(safe-area-inset-bottom); }" },
            { label: "Four equal tabs, each at least 48px tall", viewport: "mobile", check: "const r = $$('.tab').map((t) => rect(t)); return r.length === 4 && r.every((t) => t.height >= 48 && Math.abs(t.width - r[0].width) < 1) && r[0].width * 4 >= width() - 2;", fail: ".tab { flex: 1; min-height: 56px; }" },
            { label: "Every label is visible, under its icon, at least 12px", viewport: "mobile", check: "return $$('.tab').every((t) => { const l = t.querySelector('.tab__label'), i = t.querySelector('svg'); return visible(l) && px(style(l, 'font-size')) >= 12 && rect(l).top >= rect(i).bottom - 1; });", fail: ".tab { display: flex; flex-direction: column; align-items: center; } and show .tab__label." },
            { label: "Labels are readable", viewport: "mobile", check: CONTRAST + "return passes('.tab__label', 4.5);", fail: "#9ca3af on white is too pale. Try #4b5563." },
            { label: "The current tab is marked by more than colour", viewport: "mobile", check: "const c = $('.tab[aria-current=\"page\"]'), o = $('.tab:not([aria-current])'); const weight = Number(style(c, 'font-weight')) > Number(style(o, 'font-weight')); const mark = style(c, 'box-shadow') !== 'none' || style(c, 'border-top-style') !== 'none' || style(c, 'background-color') !== style(o, 'background-color'); return weight && mark;", fail: ".tab[aria-current=\"page\"] { font-weight: 700; box-shadow: inset 0 3px 0 #0f766e; }" },
          ],
          solution: { "style.css": TABS_CSS_DONE },
          hint: "One design can satisfy both platforms: 48px tall meets Material's 48dp and Apple's 44pt.",
          successMessage: "A tab bar that feels at home on Android and iPhone: big targets, visible labels, a clear current tab, clear of the home indicator.",
        },
      },
    ],

    task: {
      title: "Module 9 practical: one website for desktop, tablet and mobile",
      intro: "Take your Module 8 website (or a new one) and design it for three screen sizes in Figma.",
      prompts: [
        "Set up three frames: 1440 wide (12-column grid), 768 wide (8 columns) and 375 wide (4 columns), with consistent gutters and margins.",
        "Design the home page and one inner page at all three sizes, deciding the content order on the phone by priority.",
        "Design the navigation for each size: a full top bar on desktop, and a menu or tab pattern on phones with 44px targets.",
        "Specify fluid type sizes for headings (minimum and maximum) and how images crop and scale at each size.",
        "Annotate the breakpoints and what changes at each, and check every interactive element on the phone design is at least 44 × 44.",
      ],
      closing: "Phase 4 begins: Module 10 makes your designs interactive.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
