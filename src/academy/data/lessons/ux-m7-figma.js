/**
 * UI/UX DESIGN · MODULE 7 · INTRODUCTION TO FIGMA
 *
 * Curriculum 7.1 – 7.21 and the practical 7.P. The Figma workspace, files,
 * pages, layers, frames, sections, shapes, text, images, colour, strokes,
 * constraints, groups, components, properties, variants, Auto Layout, grids,
 * styles, variables, libraries, collaboration, version history and export.
 *
 * Figma itself is practised in the module project, in the learner's own
 * account. The labs practise each idea in the live renderer, whose
 * properties map one to one onto Figma's (Auto Layout is flexbox, a layout
 * grid is CSS grid, variables with modes are custom properties per theme,
 * constraints are positioning, Fill and Fit are object-fit), which is also
 * exactly what a developer builds from the Figma file.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, docPage, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s7-figma";

/* ── Lesson 28 lab: an organised Figma file ────────────────────────────── */
const LAYERS_MD = `# Figma file: Memora Learn

## Page 1
- Frame 1
  - Rectangle 4
  - Text
  - Group 7
- Frame 2
  - Rectangle 5
  - Frame 3

## Page 2
- Button
- Button copy
- Card
`;

const LAYERS_MD_DONE = `# Figma file: Memora Learn

## Cover
- Cover / Memora Learn

## Designs
- Mobile / Home
  - Header
  - Continue learning card
  - Course list
  - Bottom navigation
- Mobile / Course details
  - Hero image
  - Course title
  - Enrol button

## Components
- Button / Primary
- Button / Secondary
- Card / Course
`;

const PAGES = String.raw`const pages = raw('layers.md').replace(/\r/g, '').split(/\n(?=## )/).filter((b) => /^## /.test(b)).map((b) => { const lines = b.split('\n'); return { name: lines[0].replace(/^##\s*/, '').trim(), top: lines.filter((l) => /^[-*]\s+\S/.test(l)).map((l) => l.replace(/^[-*]\s+/, '').trim()), all: lines.filter((l) => /^\s*[-*]\s+\S/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, '').trim()) }; });
const DEFAULT = /^(frame|rectangle|group|ellipse|vector|text|line|image|polygon|star|page)(\s*\d+)?$|\bcopy(\s*\d+)?$/i;
`;

/* ── Lesson 29 lab: constraints, fill and fit ──────────────────────────── */
const CARD_HTML = page(
  "Course card",
  `  <main class="wrap">
    <article class="card">
      <div class="media">
        <img class="cover" src="images/team.jpg" alt="Students working together around a laptop">
        <span class="badge">New</span>
      </div>
      <div class="body">
        <h2 class="title">UX research basics</h2>
        <p class="text">Plan interviews and surveys, and turn notes into decisions.</p>
        <a class="btn" href="course.html">View course</a>
      </div>
    </article>
  </main>`
);

const CARD_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }

.wrap { max-width: 720px; margin: 0 auto; padding: 24px 16px; }

.card { width: 340px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }

.media { }
.cover { width: 100%; height: 300px; }
.badge { padding: 4px 10px; border-radius: 999px; background: #6d28d9; color: #ffffff; font-size: 13px; font-weight: 700; }

.body { padding: 24px; }
.title { margin: 0 0 8px; font-size: 20px; }
.text { margin: 0 0 16px; color: #374151; }
.btn { display: block; padding: 12px 20px; border-radius: 8px; background: #6d28d9; color: #ffffff; font-weight: 700; text-decoration: none; text-align: center; }
`;

const CARD_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }

.wrap { max-width: 720px; margin: 0 auto; padding: 24px 16px; }

/* Resizing: Fill container (width follows the parent) */
.card { width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }

/* The image frame: 16:9, image set to Fill (crop to cover) */
.media { position: relative; aspect-ratio: 16 / 9; }
.cover { width: 100%; height: 100%; object-fit: cover; }

/* Constraints: top and right, 12px from the corner at any width */
.badge { position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 999px; background: #6d28d9; color: #ffffff; font-size: 13px; font-weight: 700; }

.body { padding: 24px; }
.title { margin: 0 0 8px; font-size: 20px; }
.text { margin: 0 0 16px; color: #374151; }

/* Resizing: Hug contents (as wide as its label plus padding) */
.btn { display: inline-block; padding: 12px 20px; border-radius: 8px; background: #6d28d9; color: #ffffff; font-weight: 700; text-decoration: none; }
`;

/* ── Lesson 30 lab: Auto Layout ────────────────────────────────────────── */
const AL_HTML = page(
  "Continue learning",
  `  <main class="wrap">
    <section class="card">
      <p class="eyebrow">Continue learning</p>
      <h2 class="title">Module 6 · User flows</h2>
      <p class="meta">Lesson 4 of 5 · 12 minutes left</p>
      <div class="actions">
        <a class="link" href="outline.html">Course outline</a>
        <a class="btn" href="lesson.html"><svg class="icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg><span>Resume</span></a>
      </div>
    </section>
  </main>`
);

const AL_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.wrap { max-width: 560px; margin: 0 auto; padding: 24px 16px; }

.card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; }
.eyebrow { font-size: 13px; font-weight: 700; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.06em; }
.title { font-size: 22px; }
.meta { color: #4b5563; }

.actions { }
.link { color: #6d28d9; font-weight: 700; }
.btn { border-radius: 8px; background: #6d28d9; color: #ffffff; font-weight: 700; text-decoration: none; }
.icon { display: block; }
`;

const AL_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }
.wrap { max-width: 560px; margin: 0 auto; padding: 24px 16px; }

/* Card: vertical Auto Layout, padding 24, gap 12, fill container */
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}
.card > * { margin: 0; }

.eyebrow { font-size: 13px; font-weight: 700; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.06em; }
.title { font-size: 22px; }
.meta { color: #4b5563; }

/* Actions: horizontal Auto Layout, space between, centred vertically */
.actions { display: flex; justify-content: space-between; align-items: center; }
.link { color: #6d28d9; font-weight: 700; }

/* Button: horizontal Auto Layout, padding 12 / 20, gap 8, hug contents */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  background: #6d28d9;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
}
.icon { display: block; }
`;

/* ── Lesson 31 lab: variables with light and dark modes ────────────────── */
const THEME_HTML = page(
  "Account",
  `  <main class="screen">
    <header class="top">
      <h1 class="title">Account</h1>
      <button class="toggle" type="button" onclick="document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'">Switch mode</button>
    </header>
    <section class="panel">
      <p class="label">Wallet balance</p>
      <p class="value">₦48,200</p>
      <p class="hint">Updated a minute ago</p>
      <a class="btn" href="fund.html">Fund wallet</a>
    </section>
  </main>`
);

const THEME_CSS = `${BASE}
/* Variables: one collection, two modes. Light is the default. */
:root {
  --bg: #ffffff;
  --surface: #f3f4f6;
  --text: #111827;
  --muted: #4b5563;
  --primary: #6d28d9;
  --on-primary: #ffffff;
}

/* Dark mode: give the same variables new values here. */
:root[data-theme="dark"] {
}

body { background: #ffffff; color: #111827; }

.screen { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.title { margin: 0; font-size: 1.5rem; }
.toggle { min-height: 44px; padding: 8px 16px; border: 1px solid #4b5563; border-radius: 8px; background: transparent; color: inherit; font: inherit; }

.panel { padding: 24px; border-radius: 16px; background: #f3f4f6; }
.label { margin: 0; color: #4b5563; }
.value { margin: 4px 0; font-size: 2rem; font-weight: 700; color: #111827; }
.hint { margin: 0 0 16px; color: #4b5563; font-size: 0.875rem; }
.btn { display: inline-block; padding: 12px 20px; border-radius: 8px; background: #6d28d9; color: #ffffff; font-weight: 700; text-decoration: none; }
`;

const THEME_CSS_DONE = `${BASE}
:root {
  --bg: #ffffff;
  --surface: #f3f4f6;
  --text: #111827;
  --muted: #4b5563;
  --primary: #6d28d9;
  --on-primary: #ffffff;
}

:root[data-theme="dark"] {
  --bg: #0b1120;
  --surface: #1e293b;
  --text: #f1f5f9;
  --muted: #cbd5e1;
  --primary: #c4b5fd;
  --on-primary: #1e1b4b;
}

body { background: var(--bg); color: var(--text); }

.screen { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.title { margin: 0; font-size: 1.5rem; }
.toggle { min-height: 44px; padding: 8px 16px; border: 1px solid var(--muted); border-radius: 8px; background: transparent; color: inherit; font: inherit; }

.panel { padding: 24px; border-radius: 16px; background: var(--surface); }
.label { margin: 0; color: var(--muted); }
.value { margin: 4px 0; font-size: 2rem; font-weight: 700; color: var(--text); }
.hint { margin: 0 0 16px; color: var(--muted); font-size: 0.875rem; }
.btn { display: inline-block; padding: 12px 20px; border-radius: 8px; background: var(--primary); color: var(--on-primary); font-weight: 700; text-decoration: none; }
`;

const DARK = "document.documentElement.dataset.theme = 'dark'; await tick();";
const LIGHT = "document.documentElement.dataset.theme = 'light'; await tick();";
const THEME_PASS = CONTRAST + "return passes('.title', 4.5) && passes('.label', 4.5) && passes('.value', 4.5) && passes('.hint', 4.5) && ratio('.btn') >= 4.5;";

/* ── Lesson 32 lab: a landing page ─────────────────────────────────────── */
const LANDING_HTML = page(
  "Memora Learn",
  `  <header class="nav">
    <a class="logo" href="/">Memora Learn</a>
    <a class="nav__cta" href="signup.html">Get started</a>
  </header>
  <main>
    <section class="hero">
      <h1 class="hero__title">Learn a digital skill in 20 minutes a day</h1>
      <p class="hero__text">Short, practical lessons you can finish on your commute, with projects that build a real portfolio.</p>
      <a class="btn" href="signup.html">Start learning free</a>
    </section>
    <section class="features">
      <article class="feature"><h2>Short lessons</h2><p>Every lesson fits a bus ride, and remembers where you stopped.</p></article>
      <article class="feature"><h2>Real projects</h2><p>Build work you can show employers, checked as you go.</p></article>
      <article class="feature"><h2>Works offline</h2><p>Download lessons on Wi-Fi and learn without data.</p></article>
    </section>
    <section class="quote">
      <blockquote>"I finished my first course in three weeks, all on the bus to work."</blockquote>
      <p class="quote__who">Chiamaka, Lagos</p>
    </section>
  </main>
  <footer class="footer"><p>© Memora Learn</p></footer>`
);

const LANDING_CSS = `${BASE}
body { color: #111827; }

.nav { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
.logo { font-weight: 700; color: #111827; text-decoration: none; }
.nav__cta { color: #6d28d9; font-weight: 700; }

.hero { padding: 24px 16px; }
.hero__title { font-size: 24px; }
.hero__text { color: #9ca3af; }
.btn { color: #6d28d9; }

.features { padding: 16px; }
.feature { padding: 16px; }

.quote { padding: 16px; }
.quote__who { color: #9ca3af; }
.footer { padding: 16px; color: #9ca3af; }
`;

const LANDING_CSS_DONE = `${BASE}
:root {
  --primary: #6d28d9;
  --text: #111827;
  --muted: #4b5563;
  --surface: #f5f3ff;
}

body { color: var(--text); }

.nav { display: flex; justify-content: space-between; align-items: center; max-width: 1104px; margin: 0 auto; padding: 16px; }
.logo { font-weight: 700; color: var(--text); text-decoration: none; }
.nav__cta { color: var(--primary); font-weight: 700; }

.hero { max-width: 760px; margin: 0 auto; padding: 48px 16px; text-align: center; }
.hero__title { margin: 0 0 16px; font-size: 36px; line-height: 1.15; }
.hero__text { margin: 0 0 32px; font-size: 18px; color: var(--muted); }
.btn { display: inline-block; min-height: 48px; padding: 14px 28px; border-radius: 10px; background: var(--primary); color: #ffffff; font-weight: 700; text-decoration: none; }

.features { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 1104px; margin: 0 auto; padding: 32px 16px; }
.feature { padding: 24px; border-radius: 16px; background: var(--surface); }
.feature h2 { margin: 0 0 8px; font-size: 20px; }
.feature p { margin: 0; color: var(--muted); }

.quote { max-width: 760px; margin: 0 auto; padding: 48px 16px; text-align: center; }
.quote blockquote { margin: 0 0 8px; font-size: 22px; line-height: 1.4; }
.quote__who { margin: 0; color: var(--muted); }

.footer { padding: 24px 16px; text-align: center; color: var(--muted); border-top: 1px solid #e5e7eb; }

@media (min-width: 768px) {
  .hero__title { font-size: 48px; }
  .features { grid-template-columns: repeat(3, 1fr); }
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 7.1 – 7.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l28-figma-start",
    moduleId: "ux-m7-figma",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3", "7.4", "7.5"],
    title: "Getting Started with Figma",
    subtitle: "Your account, the workspace, files, pages, layers, frames and sections",
    estimatedMinutes: 28,
    intro:
      "Phase 3 starts with the tool you will design in for the rest of the course. Figma runs in the browser, is free to start, and is what most product teams use. This lesson sets up your account and walks through the workspace and the way Figma files are organised.",

    atoms: [
      {
        id: "a-ux-figma-intro",
        title: "Introduction to Figma",
        explain:
          "Figma is a collaborative interface design tool that runs in a web browser (with optional desktop apps). Designers use it to draw screens, build reusable components, create interactive prototypes and hand designs to developers, all in one file that the whole team can open at once. Its companion FigJam is an online whiteboard for research synthesis, journey maps and flows. Because files live in the cloud, there is no \"latest version\" emailed around: everyone always sees the current design, and developers inspect measurements and export assets directly from it.",
      },
      {
        id: "a-ux-figma-account",
        title: "Creating a Figma account",
        explain:
          "Go to figma.com and sign up with an email address or a Google account. The free Starter plan is enough for this course: unlimited personal files, a limited number of collaborative files, and full access to design and prototyping. Students and teachers can apply for the free Education plan, which unlocks professional features. You can work in Chrome, Edge or Firefox, or install the desktop app (it adds local fonts and works better on slower machines); the mobile app lets you view prototypes on a real phone. Create a team for your course projects so all your files sit together.",
        table: {
          caption: "Setting up for this course.",
          headers: ["Step", "Where", "Why"],
          rows: [
            ["Sign up", "figma.com", "Free Starter plan is enough"],
            ["Apply for Education (optional)", "figma.com/education", "Professional features, free for students"],
            ["Install the desktop app (optional)", "figma.com/downloads", "Local fonts, better performance"],
            ["Install the mobile app", "App Store / Google Play", "View prototypes on a real phone"],
            ["Create a project", "Your team space", "Keep every course file together"],
          ],
        },
      },
      {
        id: "a-ux-figma-workspace",
        title: "Understanding the Figma workspace",
        explain:
          "The Figma editor has four main areas. The toolbar (bottom in the newest interface, top in older ones) holds the tools: Move (V), Frame (F), shapes (R for rectangle, O for ellipse), Pen (P), Text (T), Hand and Comment (C). The left sidebar shows pages and the layers panel, the tree of everything in the file. The canvas in the middle is the infinite space where you design. The right sidebar has three tabs: Design (size, position, Auto Layout, fill, stroke, effects, text), Prototype (interactions and animations) and, for developers, Dev Mode (measurements, code and assets). Learn the shortcuts early: they save hours.",
        example:
          "Essential shortcuts\nV  Move        F  Frame       R  Rectangle   T  Text\nP  Pen         C  Comment     Shift+A  Add Auto Layout\nCtrl/Cmd + G   Group          Ctrl/Cmd + Alt + K  Create component\nCtrl/Cmd + D   Duplicate      Shift + 1  Zoom to fit\nHold Alt and hover to measure the distance between layers",
      },
      {
        id: "a-ux-figma-files-frames",
        title: "Files, pages, layers, frames and sections",
        explain:
          "A Figma file contains pages (like tabs: Cover, Designs, Components, Archive). Each page has a canvas holding frames, the artboards that represent screens; create one with F and pick a preset (iPhone, Android, Desktop 1440). Everything inside a frame appears as nested layers. Sections are large labelled areas on the canvas that group related frames (\"Onboarding\", \"Checkout\") and can be marked ready for development. Organisation is a professional skill: name every frame (\"Mobile / Home\"), never leave default names such as \"Frame 12\" or \"Rectangle 4\", keep a cover page, and put reusable components on their own page. A developer opening a messy file loses time on every task.",
        webLab: {
          task:
            "This Figma file is a mess of default names. layers.md mirrors its layers panel: each \"## \" heading is a page, each \"- \" item is a frame, and indented items are layers inside it. Reorganise it: at least three pages, including one called Cover and one called Components; no default names anywhere (Frame 1, Rectangle 4, Group 7, Text, anything ending in \"copy\"); every frame on the other pages named \"Mobile / …\", \"Tablet / …\" or \"Desktop / …\" with at least two frames and every frame containing at least two named layers; and at least two components on the Components page named with a slash, such as \"Button / Primary\".",
          files: {
            "index.html": docPage("Organise the Figma file", "layers.md", [
              "\"## \" headings are pages; \"- \" items are frames; indented items are layers",
              "Pages: at least three, including Cover and Components",
              "No default names: Frame 1, Rectangle 4, Group 7, Text, \"… copy\"",
              "Design frames named Mobile / …, Tablet / … or Desktop / …, each with two or more layers",
              "Components named with a slash: Button / Primary",
            ]),
            "layers.md": LAYERS_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "At least three pages, including Cover and Components", check: PAGES + "const n = pages.map((p) => p.name.toLowerCase()); return pages.length >= 3 && n.includes('cover') && n.includes('components');", fail: "Rename the pages and add a Cover page and a Components page." },
            { label: "No default layer names anywhere", check: PAGES + "const names = pages.flatMap((p) => p.all); return names.length >= 6 && names.every((n) => !DEFAULT.test(n));", fail: "Give every layer a name that says what it is: Header, Course card, Enrol button." },
            { label: "Design frames are named by device", check: PAGES + String.raw`const design = pages.filter((p) => !/^(cover|components)$/i.test(p.name)); const frames = design.flatMap((p) => p.top); return frames.length >= 2 && frames.every((f) => /^(mobile|tablet|desktop)\s*\/\s*\S/i.test(f));`, fail: "Name frames like \"Mobile / Home\" and \"Mobile / Course details\"." },
            { label: "Every design frame contains at least two layers", check: PAGES + String.raw`const blocks = raw('layers.md').replace(/\r/g, '').split(/\n(?=## )/).filter((b) => /^## /.test(b) && !/^##\s*(cover|components)\s*$/im.test(b.split('\n')[0])); let ok = blocks.length > 0; for (const b of blocks) { const lines = b.split('\n').slice(1); let kids = -1; for (const l of lines) { if (/^[-*]\s+\S/.test(l)) { if (kids !== -1 && kids < 2) ok = false; kids = 0; } else if (/^\s{2,}[-*]\s+\S/.test(l) && kids >= 0) kids += 1; } if (kids !== -1 && kids < 2) ok = false; } return ok;`, fail: "Indent at least two named layers under each frame." },
            { label: "Components are named with a slash", check: PAGES + String.raw`const c = pages.find((p) => /^components$/i.test(p.name)); return !!c && c.top.filter((n) => /^\S.*\s*\/\s*\S/.test(n)).length >= 2;`, fail: "Name components like \"Button / Primary\" and \"Button / Secondary\"." },
          ],
          solution: { "layers.md": LAYERS_MD_DONE },
          hint: "Slashes in names create folders in Figma's assets panel: \"Button / Primary\" and \"Button / Secondary\" sit together under Button.",
          successMessage: "A file anyone can open and understand: a cover, clear pages, named frames and a tidy components page. Developers notice.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 7.6 – 7.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l29-figma-tools",
    moduleId: "ux-m7-figma",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.6", "7.7", "7.8", "7.9", "7.10", "7.11"],
    title: "Drawing Tools, Text, Images and Constraints",
    subtitle: "The basic tools, and how designs behave when they resize",
    estimatedMinutes: 30,
    intro:
      "This lesson covers the tools you will use on every screen: shapes and vectors, text, images, colour and strokes, groups, and the constraints and resizing rules that decide what happens when a frame changes size.",

    atoms: [
      {
        id: "a-ux-figma-shapes-text",
        title: "Shapes, vectors and text tools",
        explain:
          "Shape tools draw rectangles (R), ellipses (O), lines, polygons and stars; the Pen tool (P) draws custom vector paths for icons and illustrations, and boolean operations (union, subtract, intersect) combine shapes. Corner radius, including different radii per corner, is set in the Design panel. The Text tool (T) creates text layers that can be Auto width (grow sideways), Auto height (fixed width, grow downwards, best for paragraphs) or Fixed size. Set font, size, weight, line height and letter spacing in the Design panel, and save repeated combinations as text styles (Heading 1, Body) so every heading in the file stays identical.",
      },
      {
        id: "a-ux-figma-images-colour",
        title: "Images, colour and stroke properties",
        explain:
          "Images in Figma are fills: drag a photo onto a shape or frame and choose how it fills. Fill crops the image to cover the whole shape (developers write object-fit: cover); Fit shows the whole image inside the shape, possibly with empty bands (object-fit: contain); Crop lets you choose the visible part; Tile repeats it. Fills can be solid colours, gradients or images, stacked, each with its own opacity. Strokes are borders, positioned inside, centre or outside the shape, with weight, dash pattern and per-side settings. Effects add drop shadows, inner shadows and blurs. Save repeated colours as colour styles or variables.",
        table: {
          caption: "Figma image fill modes and what developers build.",
          headers: ["Figma", "Effect", "CSS"],
          rows: [
            ["Fill", "Covers the shape, cropping overflow", "object-fit: cover"],
            ["Fit", "Whole image visible, may leave space", "object-fit: contain"],
            ["Crop", "You choose the visible area", "object-position, or a cropped export"],
            ["Tile", "Repeats the image", "background-repeat: repeat"],
          ],
        },
      },
      {
        id: "a-ux-figma-groups-layers",
        title: "Groups and layers",
        explain:
          "Grouping (Ctrl/Cmd + G) bundles layers so they move together, but a group has no properties of its own: it is exactly the size of its contents. A frame (Ctrl/Cmd + Alt + G wraps a selection in one) is a container with its own size, fill, stroke, corner radius, clipping, constraints and Auto Layout. Use frames for anything that behaves like a component or a container (cards, buttons, sections); use groups only for loose bundles such as an illustration. Layer order matters: layers higher in the panel sit on top. Lock background layers so they do not move by accident, and hide alternatives instead of deleting them.",
        decision: {
          scenario: "A designer groups a card's background, image and text. When they try to add padding and Auto Layout to the card, the options are missing.",
          question: "Why, and what should they do?",
          options: [
            { id: "a", text: "Groups have no layout properties; wrap the card in a frame instead", why: "Frames have their own size, fill, clipping, constraints and Auto Layout. Cards, buttons and sections should be frames." },
            { id: "b", text: "Figma does not support padding", whyWrong: "Frames with Auto Layout have padding." },
            { id: "c", text: "They need to ungroup and draw a bigger rectangle", whyWrong: "A rectangle behind content is a workaround that breaks when content changes." },
            { id: "d", text: "Padding only works on text layers", whyWrong: "Text layers have no padding at all." },
          ],
          correct: "a",
          aftermath: "When in doubt, use a frame.",
        },
      },
      {
        id: "a-ux-figma-constraints",
        title: "Constraints and resizing",
        explain:
          "Constraints decide how a layer moves when its parent frame is resized: pinned Left, Right, Left and right (stretches), Centre or Scale horizontally, and Top, Bottom, Top and bottom, Centre or Scale vertically. A \"New\" badge pinned top and right stays in the top-right corner whatever the card's width. Inside Auto Layout, resizing settings replace constraints: Fixed (a set size), Hug contents (as small as the content plus padding, like a button around its label) and Fill container (stretch to the parent's width, like a card in a column). Setting these correctly is what makes one design work at many screen sizes, and it is exactly what developers need to know.",
        table: {
          caption: "Figma resizing and constraints, and what developers build.",
          headers: ["Figma", "Behaviour", "CSS"],
          rows: [
            ["Fixed width", "Never changes", "width: 340px"],
            ["Hug contents", "Wraps its content", "display: inline-block / width: fit-content"],
            ["Fill container", "Stretches to the parent", "width: 100% or flex: 1"],
            ["Constraint: Top + Right", "Stays in the top-right corner", "position: absolute; top; right"],
            ["Constraint: Left and right", "Stretches with the parent", "left: 0; right: 0"],
          ],
        },
        webLab: {
          task:
            "This course card only works at one width: the card is fixed at 340px, the image is squashed to 300px tall, the badge is not pinned anywhere and the button stretches. Apply the Figma settings in style.css: the card Fills its container (as wide as the content area at every size); the image frame keeps a 16:9 ratio with the image set to Fill (object-fit: cover); the New badge is constrained top and right, 12px from the image's top-right corner at every width; and the button Hugs its contents instead of stretching.",
          files: { "index.html": CARD_HTML, "style.css": CARD_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Fill container: the card is as wide as the content area", check: "return Math.abs(rect('.card').width - (rect('.wrap').width - 32)) < 2;", fail: ".card { width: 100%; }" },
            { label: "The image keeps a 16:9 ratio and uses Fill", check: "const r = rect('.cover'); return Math.abs(r.width / r.height - 16 / 9) < 0.03 && style('.cover', 'object-fit') === 'cover';", fail: ".media { aspect-ratio: 16 / 9; } .cover { width: 100%; height: 100%; object-fit: cover; }" },
            { label: "On a laptop the badge is 12px from the top-right corner", check: "const b = rect('.badge'), m = rect('.media'); return Math.round(b.top - m.top) === 12 && Math.round(m.right - b.right) === 12;", fail: ".media { position: relative; } .badge { position: absolute; top: 12px; right: 12px; }" },
            { label: "On a phone the badge is still 12px from the corner", viewport: "mobile", check: "const b = rect('.badge'), m = rect('.media'); return Math.round(b.top - m.top) === 12 && Math.round(m.right - b.right) === 12;", fail: "Constraints must hold at every width: use top and right, not left." },
            { label: "The button hugs its contents", check: "return rect('.btn').width < rect('.body').width * 0.6;", fail: ".btn { display: inline-block; } (not block)" },
            { label: "Nothing overflows on a phone", viewport: "mobile", check: "return !overflowX();", fail: "A fixed width wider than the phone causes sideways scrolling." },
          ],
          solution: { "style.css": CARD_CSS_DONE },
          hint: "Pinning the badge needs two rules: the image frame must be its reference (position: relative), and the badge sets top and right (position: absolute).",
          successMessage: "One card that behaves correctly at every width: the same result as setting Fill, Hug and constraints properly in Figma.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 7.12 – 7.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l30-components-autolayout",
    moduleId: "ux-m7-figma",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.12", "7.13", "7.14", "7.15"],
    title: "Components, Variants and Auto Layout",
    subtitle: "Design once, reuse everywhere, and let layouts arrange themselves",
    estimatedMinutes: 32,
    intro:
      "Components and Auto Layout are what separate professional Figma work from drawing pictures. This lesson covers both: reusable components with properties and variants, and Auto Layout, which makes frames grow, shrink and space their contents automatically.",

    atoms: [
      {
        id: "a-ux-figma-components",
        title: "Components and instances",
        explain:
          "A component is a reusable design element (a button, an input, a card, a navigation bar). Create one with Ctrl/Cmd + Alt + K. The original is the main component; every copy you place is an instance. Change the main component and every instance updates, which is how a team changes a button style across 200 screens in seconds. Instances can override some things (text, colours, swapping an icon) while keeping their link. Keep main components on a Components page, name them with slashes for organisation (\"Button / Primary\"), and detach an instance only when you deliberately want to break the link.",
      },
      {
        id: "a-ux-figma-properties",
        title: "Component properties",
        explain:
          "Component properties expose the parts of a component that people are meant to change, as simple controls on each instance. Text properties edit a label (\"Button label\"). Boolean properties show or hide a layer (\"Has icon\": on or off). Instance swap properties choose which nested component appears (which icon). Variant properties switch between variants (Size: Small, Medium, Large). Properties make components easy to use correctly and hard to misuse: instead of digging into layers, a designer toggles \"Has icon\" and types a new label.",
        example:
          "Button component properties\n  Label       (text)      \"Resume\"\n  Has icon    (boolean)   on\n  Icon        (swap)      Play\n  Variant     (variant)   Primary | Secondary | Ghost\n  Size        (variant)   Small | Medium | Large\n  State       (variant)   Default | Hover | Pressed | Disabled",
      },
      {
        id: "a-ux-figma-variants",
        title: "Variants",
        explain:
          "Variants group related versions of a component into one component set: a button with Type (Primary, Secondary), Size (Small, Large) and State (Default, Hover, Disabled) has up to 2 × 2 × 3 = 12 variants, but appears as one component with three dropdowns. Variants keep libraries tidy, make it easy to switch an instance from Default to Disabled, and are essential for interactive prototypes (Module 10). Name variant properties consistently across components (State, Size, Type) so the system feels coherent, and design every state developers will need, not just the default.",
        decision: {
          scenario: "A designer has 12 separate button components: \"Primary Big\", \"primary-small-hover\", \"Btn Secondary Disabled\" and so on.",
          question: "What should they do?",
          options: [
            { id: "a", text: "Combine them into one component set with variant properties Type, Size and State", why: "One button with three dropdowns is easier to find, use, maintain and hand to developers." },
            { id: "b", text: "Make 12 more for future cases", whyWrong: "More separate components makes the mess worse." },
            { id: "c", text: "Delete all but one and draw the rest by hand when needed", whyWrong: "Hand-drawn copies drift and do not update." },
            { id: "d", text: "Keep them but rename them alphabetically", whyWrong: "Better names help, but variants solve the real problem." },
          ],
          correct: "a",
          aftermath: "One component set, consistent property names, every state designed.",
        },
      },
      {
        id: "a-ux-figma-autolayout",
        title: "Auto Layout",
        explain:
          "Auto Layout (Shift + A) turns a frame into a container that arranges its children automatically: in a direction (horizontal or vertical, or wrapping), with a gap between items, padding around them, and an alignment. Add text to an Auto Layout button and it grows; add a row to a card and everything below moves down. Each child sets its resizing: Hug, Fill or Fixed. Auto Layout is the same model as CSS flexbox, which is why designs built with it are far easier for developers to build exactly. Nest Auto Layout frames (a horizontal button inside a horizontal actions row inside a vertical card) to build whole screens.",
        table: {
          caption: "Auto Layout and its CSS equivalents.",
          headers: ["Figma Auto Layout", "CSS"],
          rows: [
            ["Direction: vertical / horizontal", "display: flex; flex-direction: column / row"],
            ["Gap between items: 12", "gap: 12px"],
            ["Padding: 24", "padding: 24px"],
            ["Alignment / Space between", "align-items, justify-content: space-between"],
            ["Child: Hug / Fill / Fixed", "fit-content / flex: 1 or width: 100% / a fixed width"],
          ],
        },
        webLab: {
          task:
            "Build this \"Continue learning\" card to its Auto Layout specification in style.css. Card: vertical Auto Layout, padding 24, gap 12 between every child (set the children's margins to 0). Actions row: horizontal, Space between, items centred vertically, so the link sits at the left edge and the button at the right. Button: horizontal Auto Layout, padding 12 vertical and 20 horizontal, gap 8 between the icon and the label, Hug contents.",
          files: { "index.html": AL_HTML, "style.css": AL_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Card: padding 24 on every side", check: "return ['top', 'right', 'bottom', 'left'].every((s) => style('.card', 'padding-' + s) === '24px');", fail: ".card { padding: 24px; }" },
            { label: "Card: exactly 12px between every child", check: "const k = [...$('.card').children].map((n) => rect(n)); return k.length === 4 && k.slice(1).every((r, i) => Math.round(r.top - k[i].bottom) === 12);", fail: ".card { display: flex; flex-direction: column; gap: 12px; } .card > * { margin: 0; }" },
            { label: "Actions: link at the left edge, button at the right edge", check: "const a = rect('.actions'); return Math.abs(rect('.link').left - a.left) < 1 && Math.abs(a.right - rect('.btn').right) < 1;", fail: ".actions { display: flex; justify-content: space-between; }" },
            { label: "Actions: items centred vertically", check: "const l = rect('.link'), b = rect('.btn'); return Math.abs((l.top + l.bottom) / 2 - (b.top + b.bottom) / 2) < 1.5;", fail: ".actions { align-items: center; }" },
            { label: "Button: padding 12 / 20 and an 8px gap between icon and label", check: "const i = rect('.icon'), t = rect('.btn span'); return style('.btn', 'padding-top') === '12px' && style('.btn', 'padding-left') === '20px' && Math.round(t.left - i.right) === 8;", fail: ".btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; }" },
            { label: "Button hugs its contents", check: "const b = rect('.btn'); return b.width < 160 && Math.round(b.width - rect('.icon').width - rect('.btn span').width - 8 - 40) === 0;", fail: "The button's width should be its padding + icon + gap + label, nothing more." },
          ],
          solution: { "style.css": AL_CSS_DONE },
          hint: "Each Auto Layout frame becomes display: flex with a direction, a gap and padding.",
          successMessage: "Built exactly to spec. If you can read an Auto Layout panel this way, you can design layouts developers can build without guessing.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 7.16 – 7.21
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l31-figma-systems",
    moduleId: "ux-m7-figma",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.16", "7.17", "7.18", "7.19", "7.20", "7.21"],
    title: "Grids, Styles, Variables, Teams and Export",
    subtitle: "Working at scale, with others, and handing assets over",
    estimatedMinutes: 32,
    intro:
      "This lesson covers the Figma features that matter once files get bigger and teams get involved: layout grids, styles and variables (including light and dark modes), shared libraries, collaboration, version history, and exporting assets for developers.",

    atoms: [
      {
        id: "a-ux-figma-grids",
        title: "Layout grids",
        explain:
          "A layout grid overlays columns, rows or a square grid on a frame (toggle with Ctrl + G on Windows, Control + G on Mac). A column grid sets the count, the gutter between columns, the margin at the edges, and whether it stretches with the frame or sits centred at a fixed width. Typical setups: 4 columns with 16px gutters and margins on a 375px phone frame; 12 columns with 24px gutters on a 1440px desktop frame. Elements then snap to columns. Save grids as grid styles so every frame uses the same one. Developers build the same structure with CSS grid.",
      },
      {
        id: "a-ux-figma-styles-variables",
        title: "Styles and variables",
        explain:
          "Styles save a set of properties for reuse: colour styles, text styles (font, size, weight, line height), effect styles (shadows) and grid styles. Variables store single values (colours, numbers, strings, booleans) that can be applied to properties, and are organised into collections with modes: one collection called Colour might have Light and Dark modes, so \"surface\" is white in Light and near-black in Dark. Switch a frame's mode and every variable changes at once. Variables are Figma's version of design tokens (Module 12) and map directly to CSS custom properties.",
        webLab: {
          task:
            "This account screen has a set of colour variables in :root (the Light mode), but the rules ignore them and the Dark mode is empty. In style.css, make every colour in the rules use the variables (var(--bg), var(--surface), var(--text), var(--muted), var(--primary), var(--on-primary)), then give the same six variables dark values under :root[data-theme=\"dark\"]. In both modes every text must pass 4.5:1 against its background, including the button's text. \"Switch mode\" in the preview toggles the modes.",
          files: { "index.html": THEME_HTML, "style.css": THEME_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Light mode: every text passes 4.5:1", check: LIGHT + THEME_PASS, fail: "The light values already pass; make sure the rules use them." },
            { label: "Dark mode changes the page and panel backgrounds", check: "const l = [style('body', 'background-color'), style('.panel', 'background-color')]; " + DARK + "const d = [style('body', 'background-color'), style('.panel', 'background-color')]; return l[0] !== d[0] && l[1] !== d[1];", fail: "Use var(--bg) on body and var(--surface) on .panel, and set dark values for both." },
            { label: "Dark mode: every text passes 4.5:1", check: DARK + THEME_PASS, fail: "Light text on dark surfaces; check the button's text against its dark-mode background too." },
            { label: "Dark mode is actually dark", check: DARK + "const c = (style('body', 'background-color').match(/\\d+/g) || []).slice(0, 3).map(Number); return c.length === 3 && c.every((v) => v < 60);", fail: "Give --bg a very dark value, such as #0b1120." },
            { label: "Every colour in the rules uses a variable", check: String.raw`const c = code('style.css').split(/:root\[data-theme="dark"\]\s*\{[^}]*\}/).join('').replace(/:root\s*\{[^}]*\}/, ''); return !/#[0-9a-f]{3,8}\b/i.test(c);`, fail: "Replace every hex colour below the variables with var(--…)." },
          ],
          solution: { "style.css": THEME_CSS_DONE },
          hint: "Dark mode is not just inverted: the purple button needs a lighter purple with dark text to stay readable on a dark page.",
          successMessage: "One set of variable names, two modes. This is exactly how a Figma variable collection with Light and Dark modes is handed to developers.",
        },
      },
      {
        id: "a-ux-figma-libraries",
        title: "Libraries",
        explain:
          "A library is a Figma file whose components, styles and variables are published so other files can use them. The design system team maintains the library; product designers enable it in their files and drag in components from the Assets panel. When the library publishes an update, every file that uses it is notified and can accept the changes, so a new button colour reaches every product. Figma also offers community libraries (Material Design, Apple's iOS kit) you can duplicate and learn from. For your course projects, keep a personal library of your style guide and components.",
      },
      {
        id: "a-ux-figma-collaboration",
        title: "Team collaboration, version history and exporting",
        explain:
          "Figma is multiplayer: everyone in a file sees each other's cursors live. Share files with Can view or Can edit permissions, or invite people to a team project. Comments (C) pin feedback to an exact spot and can mention people; resolve them when done. Branching (paid plans) lets you explore changes without touching the main file. Version history keeps automatic saves and named versions (\"v1 sent to client\"), so you can view or restore any earlier state. To export, select a layer or frame, add an export setting in the Design panel and choose the format and scale: PNG or JPG for photos and screens (at 1x, 2x and 3x for high-density screens), SVG for icons and illustrations that must stay sharp, PDF for documents. Developers can export assets themselves in Dev Mode.",
        table: {
          caption: "Choosing an export format.",
          headers: ["Asset", "Format", "Why"],
          rows: [
            ["Icons, logos, simple illustrations", "SVG", "Sharp at any size, small, can be recoloured in code"],
            ["Photos", "JPG (or WebP)", "Small files for complex images"],
            ["Images needing transparency", "PNG (or WebP)", "Supports transparent backgrounds"],
            ["Screens for review, documents", "PDF or PNG", "Easy to share and print"],
            ["Raster assets for phones", "PNG at 1x, 2x, 3x", "Sharp on high-density screens"],
          ],
        },
        decision: {
          scenario: "A designer emails the developer a screenshot of each icon, pasted into a Word document.",
          question: "What should they do instead?",
          options: [
            { id: "a", text: "Mark the icons for export as SVG in Figma (or let the developer export them from Dev Mode), named consistently", why: "SVGs stay sharp at every size and can be coloured in code; screenshots are blurry and cannot be edited." },
            { id: "b", text: "Send larger screenshots", whyWrong: "Still raster, still blurry at other sizes, still not editable." },
            { id: "c", text: "Ask the developer to redraw them", whyWrong: "Wastes time and introduces differences." },
            { id: "d", text: "Export them as JPG", whyWrong: "JPG blurs sharp edges and has no transparency." },
          ],
          correct: "a",
          aftermath: "Icons as SVG, photos as JPG or WebP, raster assets at 1x, 2x and 3x.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 7.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l32-landing-page",
    moduleId: "ux-m7-figma",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.P"],
    title: "Practical: A Professional Landing Page",
    subtitle: "Anatomy of a landing page, designed to work at every width",
    estimatedMinutes: 36,
    intro:
      "Your module practical is a landing page designed from scratch in Figma. This lesson explains what a landing page must do and how its sections work, then has you apply the visual rules of Module 3 and the Figma thinking of this module to a real one.",

    atoms: [
      {
        id: "a-ux-landing-anatomy",
        title: "The anatomy of a landing page",
        explain:
          "A landing page has one job: to get a specific visitor to take one action (sign up, book, buy). Its usual sections, top to bottom: a simple header with the logo and one call to action; a hero with a clear headline that states the benefit (not the feature), a supporting sentence, the primary call to action and often an image; value propositions or features, usually three, each with a short heading and sentence; social proof (testimonials, numbers, logos of clients); answers to objections (pricing, FAQs); a final call to action; and a footer. Every section should push toward the same action, with one visually dominant button style used for it.",
        table: {
          caption: "Landing page sections and their job.",
          headers: ["Section", "Job", "Good example"],
          rows: [
            ["Hero", "Say the benefit in five seconds", "\"Learn a digital skill in 20 minutes a day\""],
            ["Features", "Explain how, in three points", "Short lessons · Real projects · Works offline"],
            ["Social proof", "Make it believable", "A real learner's quote and result"],
            ["Call to action", "One clear next step", "\"Start learning free\""],
          ],
        },
      },
      {
        id: "a-ux-landing-lab",
        title: "Design the landing page",
        explain:
          "Apply everything so far: hierarchy (one dominant headline and button), readable contrast, a spacing system, a grid for the features that becomes one column on phones, and tokens for colours. Do it in Figma for your practical; in the lab, the same decisions are measured in a live page.",
        webLab: {
          task:
            "Style the Memora Learn landing page in style.css: the hero headline at least 32px on phones and at least 44px on a laptop, and the largest text on the page; all text passing 4.5:1 (the grey text currently fails); the hero button a filled, readable primary button at least 48px tall, with no other element on the page styled the same way; the three features as three equal columns on a laptop and one column on a phone, with at least 16px between them; colours defined as tokens in :root and used with var(); and no sideways scrolling on a phone.",
          files: { "index.html": LANDING_HTML, "style.css": LANDING_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Headline: at least 44px on a laptop, and the largest text", check: "const h = px(style('.hero__title', 'font-size')); return h >= 44 && $$('body *').every((n) => n === $('.hero__title') || px(style(n, 'font-size')) < h);", fail: "Make the headline 48px from 768px up." },
            { label: "Headline: at least 32px on a phone", viewport: "mobile", check: "return px(style('.hero__title', 'font-size')) >= 32;", fail: ".hero__title { font-size: 36px; } before the media query." },
            { label: "All text passes 4.5:1", check: CONTRAST + "return passes('.hero__text', 4.5) && passes('.feature p', 4.5) && passes('.quote__who', 4.5) && passes('.footer p', 4.5) && passes('.nav__cta', 4.5);", fail: "Replace #9ca3af with a darker grey such as #4b5563." },
            { label: "One filled primary button, readable and at least 48px tall", check: CONTRAST + "const bg = style('.btn', 'background-color'); return bg !== 'rgba(0, 0, 0, 0)' && ratio('.btn') >= 4.5 && rect('.btn').height >= 48 && $$('a, button').filter((n) => style(n, 'background-color') === bg).length === 1;", fail: ".btn { display: inline-block; min-height: 48px; background: var(--primary); color: #fff; }" },
            { label: "Laptop: three equal feature columns, at least 16px apart", check: "const r = $$('.feature').map((n) => rect(n)); return Math.abs(r[0].top - r[2].top) < 1 && Math.abs(r[0].width - r[2].width) < 1 && r[1].left - r[0].right >= 16;", fail: ".features { display: grid; gap: 24px; } with repeat(3, 1fr) from 768px." },
            { label: "Phone: one column, no sideways scroll", viewport: "mobile", check: "const r = $$('.feature').map((n) => rect(n)); return r[1].top >= r[0].bottom + 16 && !overflowX();", fail: "Start with one column and a 24px gap." },
            { label: "Colours are tokens used with var()", check: String.raw`const c = code('style.css'); return /:root\s*\{[^}]*--[\w-]+\s*:\s*#/.test(c) && (c.match(/var\(--/g) || []).length >= 4;`, fail: "Define --primary, --text and --muted in :root and use them." },
          ],
          solution: { "style.css": LANDING_CSS_DONE },
          hint: "Design mobile first: one column and a 36px headline, then a 768px media query for three columns and a 48px headline.",
          successMessage: "A landing page with one clear message, one clear action, readable everywhere and laid out on a grid that adapts. Now design yours in Figma.",
        },
      },
    ],

    task: {
      title: "Module 7 practical: design a professional landing page in Figma",
      intro: "Design from scratch in your own Figma account, for a product of your choice.",
      prompts: [
        "Set up the file properly: a Cover page, a Designs page and a Components page, with every frame and layer named.",
        "Create colour and text styles (or variables) from your Module 3 style guide, and a 12-column grid on a 1440px desktop frame.",
        "Build a button, a feature card and a navigation bar as components with Auto Layout, and a button with Primary and Secondary variants.",
        "Design the landing page: header, hero, three features, social proof, a final call to action and a footer, using only your components and styles.",
        "Duplicate the frame at 375px wide and adapt it for mobile using Auto Layout resizing and constraints; export the icons as SVG.",
      ],
      closing: "Module 8 turns user flows into wireframes and complete interfaces.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
