/**
 * UI/UX DESIGN · MODULE 14 · DEVELOPER HANDOFF AND UI/UX COLLABORATION
 *
 * Curriculum 14.1 – 14.18 and the practical 14.P. The development
 * lifecycle, the designer-developer relationship, HTML and CSS for
 * designers, layout implementation, Flexbox and Grid, design-to-code
 * translation, practical precision, inspecting and measuring, exporting,
 * handoff, specifications, component documentation, assets, communication,
 * Git, feedback and Agile.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, docPage, MD, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s14-handoff";

/* ── Lesson 57 lab: from Figma's inspect panel to CSS ──────────────────── */
const BOX_HTML = page(
  "Order card",
  `  <main class="wrap">
    <article class="card">
      <h2 class="card__title">Order #2048</h2>
      <p class="card__text">2 items · Delivered Tuesday</p>
    </article>
    <article class="card">
      <h2 class="card__title">Order #2047</h2>
      <p class="card__text">1 item · Delivered last week</p>
    </article>
  </main>`
);

const BOX_SPEC = [
  ["Width", "320 (fixed, including padding and border)"],
  ["Padding", "24 on every side"],
  ["Border", "1px solid #d1d5db"],
  ["Corner radius", "12"],
  ["Fill", "#ffffff"],
  ["Gap between cards", "16"],
  ["Title", "18px, bold, 0 margin above, 8 below"],
  ["Text", "14px, #4b5563, 0 margin"],
];

const BOX_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.wrap { padding: 24px 16px; }

/* Build the card from the inspect panel values in the lesson. */
.card { }
.card__title { }
.card__text { }
`;

const BOX_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }
.wrap { padding: 24px 16px; }

.card {
  width: 320px;            /* box-sizing: border-box includes padding and border */
  margin-bottom: 16px;
  padding: 24px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #ffffff;
}
.card__title { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
.card__text { margin: 0; font-size: 14px; color: #4b5563; }
`;

/* ── Lesson 58 lab: Flexbox and Grid ───────────────────────────────────── */
const PROFILE_HTML = page(
  "Seller profile",
  `  <main class="wrap">
    <header class="profile">
      <img class="avatar" src="images/profile.jpg" alt="Mama Ngozi">
      <div class="who">
        <h1 class="name">Mama Ngozi's Kitchen</h1>
        <p class="meta">Jollof, egusi and small chops · Enugu</p>
      </div>
      <a class="follow" href="follow.html">Follow</a>
    </header>
    <section class="stats">
      <div class="stat"><p class="stat__value">4.8</p><p class="stat__label">Rating</p></div>
      <div class="stat"><p class="stat__value">1,240</p><p class="stat__label">Orders</p></div>
      <div class="stat"><p class="stat__value">3 yrs</p><p class="stat__label">Selling</p></div>
    </section>
  </main>`
);

const PROFILE_CSS = `${BASE}
body { color: #111827; }
.wrap { max-width: 720px; margin: 0 auto; padding: 24px 16px; }

.profile { }
.avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
.name { margin: 0; font-size: 20px; }
.meta { margin: 4px 0 0; color: #4b5563; }
.follow { padding: 10px 20px; border-radius: 999px; background: #c2410c; color: #ffffff; font-weight: 700; text-decoration: none; }

.stats { margin-top: 24px; }
.stat { padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; }
.stat__value { margin: 0; font-size: 22px; font-weight: 700; }
.stat__label { margin: 4px 0 0; color: #4b5563; }
`;

const PROFILE_CSS_DONE = `${BASE}
body { color: #111827; }
.wrap { max-width: 720px; margin: 0 auto; padding: 24px 16px; }

/* Flexbox: one row, centred vertically, 16px gaps, Follow pushed right */
.profile { display: flex; align-items: center; gap: 16px; }
.who { flex: 1; min-width: 0; }
.avatar { flex: none; width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
.name { margin: 0; font-size: 20px; }
.meta { margin: 4px 0 0; color: #4b5563; }
.follow { flex: none; padding: 10px 20px; border-radius: 999px; background: #c2410c; color: #ffffff; font-weight: 700; text-decoration: none; }

/* Grid: three equal columns with 16px gaps */
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
.stat { padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; }
.stat__value { margin: 0; font-size: 22px; font-weight: 700; }
.stat__label { margin: 4px 0 0; color: #4b5563; }
`;

/* ── Lesson 59 lab: a handoff specification ────────────────────────────── */
const SPEC_MD = `# Handoff spec: Order details screen

## Tokens
| Token | Value |
|-------|-------|
|       |       |

## Spacing
-

## States
-

## Breakpoints
| Breakpoint | Layout |
|------------|--------|
|            |        |

## Assets
- Icon Arrow Back.PNG
- photo of product
- Logo final FINAL v2.jpg

## Accessibility
`;

const SPEC_MD_DONE = `# Handoff spec: Order details screen

## Tokens
| Token | Value |
|-------|-------|
| --color-text | #111827 |
| --color-text-muted | #4b5563 |
| --color-action | #c2410c |
| --space-3 | 16px |
| --space-4 | 24px |
| --radius-md | 12px |

## Spacing
- Screen padding: 16px on phones, 24px from 768px
- 24px between sections, 8px between a heading and its content
- Order line items: 16px padding, 1px #e5e7eb divider

## States
- Loading: skeleton rows for the items and the summary
- Empty: "This order has no items" with a link back to orders
- Error: "We couldn't load this order" with Try again
- Default: items, delivery and payment summary

## Breakpoints
| Breakpoint | Layout |
|------------|--------|
| 0–767px | One column; summary below the items |
| 768px and up | Two columns: items 8 of 12 columns, summary 4 of 12 |

## Assets
- icon-arrow-back.svg
- icon-delivery.svg
- product-tote-bag.webp
- product-tote-bag@2x.webp
- logo.svg

## Accessibility
The back button is named "Back to orders", the status badge uses text and colour, all text meets 4.5:1, and focus order follows the visual order from the header to the summary.
`;

/* ── Lesson 60 lab: design QA ──────────────────────────────────────────── */
const QA_HTML = page(
  "Checkout summary",
  `  <main class="wrap">
    <section class="summary">
      <h2 class="summary__title">Order summary</h2>
      <p class="summary__row"><span>Subtotal</span><span>₦18,500</span></p>
      <p class="summary__row"><span>Delivery</span><span>₦1,500</span></p>
      <p class="summary__total"><span>Total</span><span>₦20,000</span></p>
      <a class="summary__cta" href="pay.html">Pay ₦20,000</a>
    </section>
  </main>`
);

const QA_SPEC = [
  ["Container", "padding 24, radius 16, background #fff7ed, max-width 400"],
  ["Title", "20px, bold, margin 0 0 16"],
  ["Rows", "16px, colour #374151, margin 0 0 8, label left and value right"],
  ["Total", "18px, bold, colour #111827, 16px above (border-top 1px #fed7aa, padding-top 16)"],
  ["Button", "full width, min-height 48, radius 10, background #c2410c, white text, margin-top 24"],
];

const QA_CSS = `${BASE}
body { color: #111827; }
.wrap { padding: 24px 16px; }

/* Built by the developer. Compare with the spec and fix the differences. */
.summary { max-width: 400px; padding: 20px; border-radius: 8px; background: #fff7ed; }
.summary__title { margin: 0 0 12px; font-size: 22px; font-weight: 700; }
.summary__row { display: flex; justify-content: space-between; margin: 0 0 8px; font-size: 15px; color: #9ca3af; }
.summary__total { display: flex; justify-content: space-between; margin: 16px 0 0; font-size: 18px; font-weight: 700; color: #111827; }
.summary__cta { display: inline-block; margin-top: 16px; padding: 12px 20px; border-radius: 10px; background: #c2410c; color: #ffffff; font-weight: 700; text-decoration: none; }
`;

const QA_CSS_DONE = `${BASE}
body { color: #111827; }
.wrap { padding: 24px 16px; }

.summary { max-width: 400px; padding: 24px; border-radius: 16px; background: #fff7ed; }
.summary__title { margin: 0 0 16px; font-size: 20px; font-weight: 700; }
.summary__row { display: flex; justify-content: space-between; margin: 0 0 8px; font-size: 16px; color: #374151; }
.summary__total { display: flex; justify-content: space-between; margin: 16px 0 0; padding-top: 16px; border-top: 1px solid #fed7aa; font-size: 18px; font-weight: 700; color: #111827; }
.summary__cta { display: block; min-height: 48px; margin-top: 24px; padding: 12px 20px; border-radius: 10px; background: #c2410c; color: #ffffff; font-weight: 700; text-align: center; text-decoration: none; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 14.1 – 14.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l57-sdlc",
    moduleId: "ux-m14-handoff",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3"],
    title: "How Software Is Built, and the Code Behind Designs",
    subtitle: "The development lifecycle, working with developers, and HTML and CSS for designers",
    estimatedMinutes: 30,
    intro:
      "A design is only valuable once it is built. This lesson explains how software gets built, how designers and developers work best together, and just enough HTML and CSS for you to understand what developers do with your designs and to design things that can be built.",

    atoms: [
      {
        id: "a-ux-sdlc",
        title: "Understanding the software development lifecycle",
        explain:
          "The software development lifecycle (SDLC) is the process by which software is planned, built and maintained: requirements (what to build and why), design (how it works and looks), development (writing the code), testing (checking it works), release (putting it live) and maintenance (fixing and improving it). In the older waterfall model each stage finishes before the next begins; in Agile models (most product teams today) small pieces go through all stages in short cycles of one to two weeks. Designers contribute at every stage: research and flows in requirements, interfaces in design, answering questions in development, design QA in testing, and analytics after release.",
        table: {
          caption: "The designer's role across the lifecycle.",
          headers: ["Stage", "What happens", "Designer's contribution"],
          rows: [
            ["Requirements", "Decide what to build", "Research, problem statements, flows"],
            ["Design", "Decide how it works and looks", "Wireframes, prototypes, high-fidelity designs"],
            ["Development", "Write the code", "Specs, answering questions, reviewing builds"],
            ["Testing", "Check it works", "Design QA, usability testing"],
            ["Release and maintenance", "Go live, then improve", "Analytics, feedback, the next iteration"],
          ],
        },
      },
      {
        id: "a-ux-designer-developer",
        title: "The designer-developer relationship",
        explain:
          "The best products come from designers and developers working together throughout, not from designs thrown over a wall. Involve developers early: they know what is easy, hard or impossible, and can suggest cheaper ways to achieve the same goal. Share work in progress, not only final files. Explain the why behind decisions so developers can make good choices when something is unclear. Respect constraints (time, performance, platform limits) and negotiate trade-offs rather than insisting on every pixel. Be available during the build, and review it together. Learning their vocabulary (components, props, states, breakpoints, APIs) makes every conversation faster.",
        decision: {
          scenario: "A developer says a custom animated chart in your design will take two weeks, and suggests a standard chart library that would take two days but looks slightly different.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Ask what the library can do, check whether it meets the users' needs, and adapt the design to it if it does", why: "The goal is for users to understand their data, not to reproduce a specific animation. Twelve days saved can go into something users need more." },
            { id: "b", text: "Insist on the original design exactly", whyWrong: "Pixel loyalty at ten days' extra cost is rarely justified without evidence it matters to users." },
            { id: "c", text: "Remove the chart entirely", whyWrong: "Users still need the information." },
            { id: "d", text: "Let the developer decide everything from now on", whyWrong: "Collaboration means deciding together, not giving up the user's perspective." },
          ],
          correct: "a",
          aftermath: "Hold firm on user needs; be flexible on how they are met.",
        },
      },
      {
        id: "a-ux-html-css-designers",
        title: "Understanding HTML and CSS from a designer's perspective",
        explain:
          "HTML describes what content is: headings (h1 to h6), paragraphs, links, buttons, lists, images, forms and landmarks (header, nav, main, footer). Choosing the right element matters for accessibility and behaviour, which is why designers should name elements meaningfully in specs (\"this is a button, not a link\"). CSS describes how it looks and is laid out, and its properties map closely onto Figma's: fill is background, stroke is border, corner radius is border-radius, drop shadow is box-shadow, Auto Layout is flexbox. Every element is a box (the box model): content, then padding, then border, then margin outside. With box-sizing: border-box, a 320px width includes the padding and border, just like a fixed-width frame in Figma.",
        table: {
          caption: "Figma properties and their CSS equivalents.",
          headers: ["Figma", "CSS"],
          rows: [
            ["Fill", "background"],
            ["Stroke (inside)", "border (with box-sizing: border-box)"],
            ["Corner radius", "border-radius"],
            ["Drop shadow", "box-shadow"],
            ["Layer opacity", "opacity"],
            ["Auto Layout padding and gap", "padding and gap"],
            ["Spacing between separate frames", "margin (or the parent's gap)"],
          ],
        },
        example: "Order card, from Figma's inspect panel\n" + BOX_SPEC.map(([k, v]) => `${k.padEnd(18)}${v}`).join("\n"),
        webLab: {
          task:
            "A developer asks you to show how the order card's inspect values (shown above the lab) become CSS. Write the .card, .card__title and .card__text rules in style.css so the rendered cards match the specification exactly: 320px wide including padding and border, 24px padding, a 1px #d1d5db border, 12px radius, white fill, 16px between the cards; the title 18px bold with 8px below it; the text 14px in #4b5563 with no margin.",
          files: { "index.html": BOX_HTML, "style.css": BOX_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Each card is exactly 320px wide in total", check: "return $$('.card').every((c) => Math.round(rect(c).width) === 320);", fail: "width: 320px; (box-sizing is already border-box)." },
            { label: "24px padding, 1px #d1d5db border, 12px radius, white fill", check: "const c = '.card'; return ['top', 'right', 'bottom', 'left'].every((s) => style(c, 'padding-' + s) === '24px' && style(c, 'border-' + s + '-width') === '1px') && style(c, 'border-top-color') === 'rgb(209, 213, 219)' && style(c, 'border-top-left-radius') === '12px' && style(c, 'background-color') === 'rgb(255, 255, 255)';", fail: "padding: 24px; border: 1px solid #d1d5db; border-radius: 12px; background: #ffffff;" },
            { label: "16px between the cards", check: "const r = $$('.card').map((c) => rect(c)); return Math.round(r[1].top - r[0].bottom) === 16;", fail: "margin-bottom: 16px; on .card." },
            { label: "Title: 18px, bold, 0 above and 8px below", check: "const t = $('.card__title'), c = rect('.card'); return style(t, 'font-size') === '18px' && Number(style(t, 'font-weight')) >= 700 && Math.round(rect(t).top - c.top) === 25 && Math.round(rect('.card__text').top - rect(t).bottom) === 8;", fail: ".card__title { margin: 0 0 8px; font-size: 18px; font-weight: 700; }" },
            { label: "Text: 14px, #4b5563, no margin", check: "return style('.card__text', 'font-size') === '14px' && style('.card__text', 'color') === 'rgb(75, 85, 99)' && style('.card__text', 'margin-bottom') === '0px';", fail: ".card__text { margin: 0; font-size: 14px; color: #4b5563; }" },
          ],
          solution: { "style.css": BOX_CSS_DONE },
          hint: "Inside the card, the title starts after the 1px border and the 24px padding: 25px from the card's top edge.",
          successMessage: "Inspect values in, identical boxes out. Now you know exactly what developers do with the numbers in your Figma file.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 14.4 – 14.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l58-layout",
    moduleId: "ux-m14-handoff",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.4", "14.5", "14.6", "14.7"],
    title: "Layout in Code, and From Design to Code",
    subtitle: "Flexbox, Grid, translation and how precise to be",
    estimatedMinutes: 30,
    intro:
      "Understanding how developers build layouts lets you design layouts that translate cleanly. This lesson covers how layout is implemented, the fundamentals of Flexbox and Grid, translating designs into code, and the debate between pixel-perfect and practical implementation.",

    atoms: [
      {
        id: "a-ux-layout-implementation",
        title: "Understanding layout implementation",
        explain:
          "Browsers lay out elements in normal flow by default: block elements (headings, paragraphs, sections) stack top to bottom, each as wide as its container; inline elements (links, bold text) flow along a line like words. Developers change this with layout modes: Flexbox for arranging items in one direction (a row of buttons, a header), Grid for two-dimensional layouts (a card grid, a dashboard), and positioning for elements taken out of the flow (a badge pinned to a corner, a sticky header, a modal). Designs built with Auto Layout and layout grids map almost directly onto Flexbox and Grid, which makes them faster and more accurate to build.",
      },
      {
        id: "a-ux-flex-grid",
        title: "CSS Flexbox and Grid fundamentals",
        explain:
          "Flexbox (display: flex) arranges children in a row or column. Key properties: flex-direction (row or column), gap (space between items), justify-content (distribution along the main direction: start, centre, space-between), align-items (alignment across it: centre, start, stretch), and on children, flex: 1 to fill remaining space or flex: none to keep a fixed size. Grid (display: grid) defines columns and rows: grid-template-columns: repeat(3, 1fr) makes three equal columns, gap sets gutters, and items can span several columns. Rule of thumb: Flexbox for components and one-dimensional rows; Grid for page layouts and anything with columns that must line up.",
        webLab: {
          task:
            "Build the seller profile in style.css. Profile header (Flexbox): avatar, name block and Follow button in one row, centred vertically, with 16px gaps; the name block fills the remaining space so Follow sits at the right edge. Stats (Grid): three equal columns with a 16px gap.",
          files: { "index.html": PROFILE_HTML, "style.css": PROFILE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Avatar, name and Follow sit in one row, centred vertically", check: "const a = rect('.avatar'), w = rect('.who'), f = rect('.follow'); const mid = (r) => (r.top + r.bottom) / 2; return w.left > a.right && f.left > w.right - 1 && Math.abs(mid(a) - mid(w)) < 2 && Math.abs(mid(a) - mid(f)) < 2;", fail: ".profile { display: flex; align-items: center; }" },
            { label: "16px gaps between the three parts", check: "const a = rect('.avatar'), w = rect('.who'), f = rect('.follow'); return Math.round(w.left - a.right) === 16 && Math.round(f.left - w.right) === 16;", fail: ".profile { gap: 16px; }" },
            { label: "Follow sits at the right edge", check: "return Math.abs(rect('.profile').right - rect('.follow').right) < 1;", fail: ".who { flex: 1; }" },
            { label: "Stats: three equal columns with 16px gaps", check: "const r = $$('.stat').map((s) => rect(s)); return Math.abs(r[0].top - r[2].top) < 1 && Math.abs(r[0].width - r[2].width) < 1 && Math.round(r[1].left - r[0].right) === 16 && Math.abs(r[2].right - rect('.stats').right) < 1;", fail: ".stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }" },
          ],
          solution: { "style.css": PROFILE_CSS_DONE },
          hint: "flex: 1 on the middle item makes it take all the space left over, which pushes Follow to the end.",
          successMessage: "A row built with Flexbox and a grid built with Grid: the two tools behind almost every layout you will design.",
        },
      },
      {
        id: "a-ux-design-to-code",
        title: "Design-to-code translation",
        explain:
          "Designs translate well when they are built the way code is: on a grid, with Auto Layout, from components with consistent names, using tokens for every colour, size and space, with every state and breakpoint designed. Designs translate badly when they contain one-off values (13px here, 15px there), elements positioned by hand, components detached from the system, or layouts that only work at one width. Before handoff, walk through the design with a developer and ask: what is unclear, what is missing, what is expensive? Their questions show you what your design does not yet specify.",
      },
      {
        id: "a-ux-pixel-practical",
        title: "Pixel-perfect versus practical implementation",
        explain:
          "Pixel-perfect means the built product matches the design exactly, pixel for pixel. Practical implementation means matching the design's intent and system, accepting small differences that do not matter to users (a font rendering slightly differently on Android, a line break in a different place at an unusual width). Insist on what matters: the spacing scale, colours and contrast, typography, component states, alignment to the grid, accessibility and behaviour. Be relaxed about what does not: sub-pixel differences, and exact positions at widths nobody designed for. Real content, real devices and responsive layouts mean the product will never match a static mockup exactly, and should not try to.",
        decision: {
          scenario: "During design QA you notice: (1) a heading is 1px lower than in Figma on one Android phone; (2) the error state for the payment form was not built at all.",
          question: "Which should you raise first?",
          options: [
            { id: "a", text: "The missing error state: it affects every user who makes a mistake, while the 1px difference affects nobody", why: "Practical QA focuses on what changes the experience: states, behaviour, contrast, consistency." },
            { id: "b", text: "The 1px heading offset, because the design must match exactly", whyWrong: "Nobody will notice 1px; everyone who makes a payment error will notice a missing error state." },
            { id: "c", text: "Neither: QA is the developer's job", whyWrong: "Designers are responsible for checking their designs were built as intended." },
            { id: "d", text: "Both equally, in the order found", whyWrong: "Prioritise by impact on users." },
          ],
          correct: "a",
          aftermath: "Fight for states, behaviour and the system; let sub-pixel differences go.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 14.8 – 14.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l59-specs",
    moduleId: "ux-m14-handoff",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.8", "14.9", "14.10", "14.11", "14.12", "14.13", "14.14"],
    title: "Inspecting, Exporting and Specifying",
    subtitle: "Everything a developer needs from your Figma file",
    estimatedMinutes: 32,
    intro:
      "Handoff is where many good designs are lost. This lesson covers the practical side: how developers inspect and measure your designs, how to export assets, and what a complete handoff contains, from specifications and component documentation to tidy, well-named assets.",

    atoms: [
      {
        id: "a-ux-inspecting-figma",
        title: "Inspecting Figma designs and measuring",
        explain:
          "Developers inspect designs in Figma's Dev Mode (or the Inspect panel for viewers): select any layer to see its size, position, colours, typography, effects, the variables and styles it uses, and generated code snippets for CSS, iOS and Android. Measuring is done by selecting a layer and holding Alt (Option on Mac) while hovering over another to see the distance between them. Designers make inspection reliable by using variables and styles (so developers see token names, not raw values), Auto Layout (so padding and gaps are explicit), and named layers. Sections can be marked \"Ready for dev\" so developers know which screens are final, and Dev Mode shows what changed since they last looked.",
      },
      {
        id: "a-ux-exporting-assets",
        title: "Exporting images, SVGs and icons",
        explain:
          "Mark layers for export in the Export section of the Design panel, or let developers export from Dev Mode. Icons and logos: SVG, so they stay sharp at any size and can be recoloured in code; flatten and outline strokes first and give each icon a consistent frame (24 × 24). Photos: JPG or, better, WebP, at the largest size needed plus 2x for high-density screens. Images needing transparency: PNG or WebP. Native apps often need PNGs at 1x, 2x and 3x (iOS) or for each density (Android), or vector formats (PDF, Android vector drawables). Export at the size the image will be displayed, not at the size of the original photo.",
      },
      {
        id: "a-ux-developer-handoff",
        title: "Developer handoff and design specifications",
        explain:
          "A handoff package contains everything needed to build a feature without guessing: the final screens, clearly marked as ready; the user flow showing how screens connect; specifications for spacing, sizes and layout (largely self-documenting with Auto Layout, plus annotations for anything unusual); every state of every component and screen (default, loading, empty, error, success, disabled); responsive behaviour at each breakpoint; interactions and animations (trigger, duration, easing); content rules (character limits, truncation, formats such as ₦12,500.00); accessibility annotations (focus order, accessible names, alt text, headings); and the assets. Walk developers through it in a meeting, then keep it as the living reference.",
      },
      {
        id: "a-ux-component-docs-handoff",
        title: "Component documentation and asset organisation",
        explain:
          "For each component used in the feature, point developers to its documentation in the design system (variants, states, props, tokens), and document any new component fully before it is built. Organise assets so nobody has to ask what a file is: consistent, lowercase, hyphenated names that describe the content (icon-arrow-back.svg, product-tote-bag.webp, logo.svg), resolution suffixes for raster images (@2x, @3x), no spaces, no capital letters and no \"final-final-v2\", and folders by type (icons, images, illustrations). Agree the naming convention with the developers once and follow it everywhere.",
        webLab: {
          task:
            "Prepare the handoff spec for an order details screen in spec.md: at least four Tokens with values; at least two Spacing rules with pixel values; States including loading, empty, error and default; at least two Breakpoints rows whose breakpoint includes a pixel number; at least four Assets with lowercase, hyphenated names, no spaces, an optional @2x or @3x suffix and a sensible extension (every icon as .svg, photos as .jpg or .webp); and Accessibility notes of at least 15 words.",
          files: {
            "index.html": docPage("Handoff specification", "spec.md", [
              "Tokens: four or more, each with a value",
              "Spacing: two or more rules with px values",
              "States: loading, empty, error and default",
              "Breakpoints: two or more rows with px numbers",
              "Assets: four or more, like icon-arrow-back.svg or product-tote-bag@2x.webp",
              "Accessibility: at least 15 words",
            ]),
            "spec.md": SPEC_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "At least four tokens with values", check: MD + String.raw`return rows(section('spec.md', 'Tokens')).filter((c) => /^--[a-z0-9-]+$/i.test(c[0]) && words(c[1]) >= 1).length >= 4;`, fail: "Rows like | --color-action | #c2410c |." },
            { label: "Spacing rules with pixel values", check: MD + String.raw`return bullets(section('spec.md', 'Spacing')).filter((l) => /\d+\s?px/.test(l)).length >= 2;`, fail: "For example: \"24px between sections\"." },
            { label: "States: loading, empty, error and default", check: MD + "const s = bullets(section('spec.md', 'States')).join(' ').toLowerCase(); return ['loading', 'empty', 'error', 'default'].every((k) => s.includes(k));", fail: "List all four states and what each shows." },
            { label: "At least two breakpoints with pixel numbers", check: MD + String.raw`return rows(section('spec.md', 'Breakpoints')).filter((c) => /\d+\s?px/.test(c[0]) && words(c[1]) >= 2).length >= 2;`, fail: "Rows like | 768px and up | Two columns … |." },
            { label: "Assets are named and formatted properly", check: MD + String.raw`const a = bullets(section('spec.md', 'Assets')); const ok = (n) => /^[a-z0-9]+(-[a-z0-9]+)*(@[23]x)?\.(svg|png|jpg|webp)$/.test(n) && (!/^icon-/.test(n) || /\.svg$/.test(n)); return a.length >= 4 && a.every(ok);`, fail: "Lowercase and hyphens only: icon-arrow-back.svg, product-tote-bag.webp, logo.svg." },
            { label: "Accessibility notes", check: MD + "return words(section('spec.md', 'Accessibility')) >= 15;", fail: "Accessible names, contrast, focus order, alt text." },
          ],
          solution: { "spec.md": SPEC_MD_DONE },
          hint: "A developer should be able to build the screen from this document without sending you a single question.",
          successMessage: "A spec with tokens, spacing, states, breakpoints, clean assets and accessibility. This is what turns a design into a build without guesswork.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 14.15 – 14.18, 14.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l60-collaboration",
    moduleId: "ux-m14-handoff",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.15", "14.16", "14.17", "14.18", "14.P"],
    title: "Communication, Git, Feedback and Agile",
    subtitle: "Working day to day with a development team",
    estimatedMinutes: 32,
    intro:
      "Handoff is not a single moment but an ongoing conversation. This lesson covers communicating design requirements, the Git workflow developers use, giving and receiving feedback on designs and builds, and how designers work inside Agile teams. It ends with your practical: a complete handoff package.",

    atoms: [
      {
        id: "a-ux-communicating-requirements",
        title: "Communicating design requirements",
        explain:
          "Requirements are communicated through several channels together: the annotated Figma file; user stories with acceptance criteria in the team's tracker (Jira, Linear, Trello), linked to the exact frames; a short walkthrough meeting or recorded video for anything complex; and quick answers in team chat. Write acceptance criteria that can be checked (\"Given the payment fails, the user sees 'You have not been charged' and a Try again button\"), not vague wishes (\"error handling should be good\"). When you change a design after handoff, say so clearly, in the ticket and the file, so nobody builds an old version.",
        example: "Story: As a shopper, I want to know if my payment failed so that I don't pay twice.\n\nAcceptance criteria:\n- Given the payment fails, the user sees \"Payment failed. You have not been charged.\"\n- A Try again button returns to the payment step with the cart unchanged\n- The message is announced to screen readers (role=\"alert\")\n- Design: Figma › Checkout › Payment / Error",
      },
      {
        id: "a-ux-git-workflows",
        title: "Working with Git and collaborative workflows",
        explain:
          "Developers use Git to track every change to the code. Work happens on branches (a separate line of work, such as feature/payment-error), saved in commits (snapshots with messages), and proposed for inclusion through pull requests (PRs) on GitHub or GitLab, which teammates review before merging into the main branch. Many teams deploy every pull request to a preview link, which is where designers should review the built feature on real devices and leave comments before it is merged. Figma's branching feature applies the same idea to design files: explore changes on a branch, get a review, then merge.",
      },
      {
        id: "a-ux-feedback-revisions",
        title: "Design feedback and revisions",
        explain:
          "Giving feedback on a build (design QA): be specific (what, where, expected versus actual, with a screenshot), prioritise by impact on users, separate must-fix from nice-to-have, and link to the spec. Receiving feedback on your designs: listen for the problem behind the suggestion (\"make the button bigger\" may mean \"I could not find it\"), ask clarifying questions, do not take it personally, and decide based on goals and evidence rather than who spoke loudest. Keep revisions manageable: agree how many rounds and what counts as a change of scope, and record decisions so they are not reopened every week.",
        decision: {
          scenario: "A developer's build has the wrong button colour, 4px too little padding in the summary, and no loading state. You write in the team chat: \"The checkout looks off, please fix.\"",
          question: "What would make this feedback useful?",
          options: [
            { id: "a", text: "List each issue with where it is, expected versus actual values from the spec, and priority (missing loading state first)", why: "Specific, prioritised feedback with the spec values lets the developer fix everything in one pass." },
            { id: "b", text: "Send a longer message saying it looks very off", whyWrong: "Still no detail to act on." },
            { id: "c", text: "Fix the code yourself without telling anyone", whyWrong: "Bypasses the team's review process and the developer learns nothing." },
            { id: "d", text: "Wait for the next sprint", whyWrong: "Problems are cheapest to fix now." },
          ],
          correct: "a",
          aftermath: "Expected, actual, where and how important: the four parts of useful QA feedback.",
        },
      },
      {
        id: "a-ux-agile-teams",
        title: "Working in Agile development teams",
        explain:
          "Agile teams work in short cycles called sprints (usually two weeks) with rituals: sprint planning (choose what to build from the prioritised backlog), daily stand-ups (a short sync on progress and blockers), sprint review (show what was built) and retrospective (improve how the team works). Designers usually work one sprint ahead (dual-track: discovery and design for the next sprint while developers build the current one), attend planning and reviews, refine stories with acceptance criteria, and keep design QA inside the sprint so a feature is not \"done\" until it meets the design and accessibility standards in the team's definition of done.",
        table: {
          caption: "The checkout summary specification.",
          headers: ["Part", "Specification"],
          rows: QA_SPEC,
        },
        webLab: {
          task:
            "Do design QA on this checkout summary: the developer's build differs from the specification in the table above the lab. Fix style.css so the build matches: container padding 24 and radius 16; title 20px with 16px below; rows 16px in #374151 (readable) with label left and value right; the total separated by a 1px #fed7aa top border with 16px padding above it; and the button full width, at least 48px tall, with 24px above it.",
          files: { "index.html": QA_HTML, "style.css": QA_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Container: padding 24, radius 16", check: "return ['top', 'right', 'bottom', 'left'].every((s) => style('.summary', 'padding-' + s) === '24px') && style('.summary', 'border-top-left-radius') === '16px';", fail: ".summary { padding: 24px; border-radius: 16px; }" },
            { label: "Title: 20px with 16px below", check: "return style('.summary__title', 'font-size') === '20px' && Math.round(rect('.summary__row').top - rect('.summary__title').bottom) === 16;", fail: ".summary__title { margin: 0 0 16px; font-size: 20px; }" },
            { label: "Rows: 16px, #374151, readable, value on the right", check: CONTRAST + "return $$('.summary__row').every((r) => style(r, 'font-size') === '16px' && style(r, 'color') === 'rgb(55, 65, 81)' && Math.abs(rect(r.lastElementChild).right - rect(r).right) < 1) && passes('.summary__row', 4.5);", fail: ".summary__row { font-size: 16px; color: #374151; }" },
            { label: "Total: 1px #fed7aa top border with 16px padding above", check: "return style('.summary__total', 'border-top-width') === '1px' && style('.summary__total', 'border-top-color') === 'rgb(254, 215, 170)' && style('.summary__total', 'padding-top') === '16px';", fail: ".summary__total { padding-top: 16px; border-top: 1px solid #fed7aa; }" },
            { label: "Button: full width, at least 48px, 24px above", check: "const b = rect('.summary__cta'), s = rect('.summary'); return Math.abs(b.width - (s.width - 48)) < 1 && b.height >= 48 && Math.round(b.top - rect('.summary__total').bottom) === 24;", fail: ".summary__cta { display: block; min-height: 48px; margin-top: 24px; }" },
          ],
          solution: { "style.css": QA_CSS_DONE },
          hint: "Go through the spec table line by line and compare each value with the CSS.",
          successMessage: "Five differences found and fixed against the spec. Design QA like this, inside the sprint, is how a design survives the build.",
        },
      },
    ],

    task: {
      title: "Module 14 practical: a complete Figma handoff package",
      intro: "Prepare a handoff for one feature from your earlier work (for example the banking transfer flow).",
      prompts: [
        "Organise the Figma file: a cover, the flow, final screens in a section marked Ready for dev, and a components page.",
        "Annotate every screen: spacing (Auto Layout and tokens), all states, responsive behaviour at each breakpoint, interactions with durations, and content rules.",
        "Add accessibility annotations: focus order, accessible names for icon buttons, alt text, heading levels and announcements.",
        "Export assets with a clear naming convention (SVG icons, WebP images at 1x and 2x) and document any new component.",
        "Write the user stories with acceptance criteria, and record a five-minute walkthrough video of the handoff for the developers.",
      ],
      closing: "Phase 6 begins: Module 15 applies everything to complex, real-world products.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
