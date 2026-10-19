/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 11 · MODERN CSS TECHNIQUES
 *
 * Curriculum 11.1 – 11.12. Motion (transitions, transforms, keyframes),
 * interaction states and :focus-visible, themes built on custom properties,
 * calc(), min(), max() and clamp(), advanced Grid and aspect-ratio, dark
 * mode, reduced motion, and organising CSS into reusable components.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s11-modern-css";

const page = (title, body, htmlAttrs = "") => `<!DOCTYPE html>
<html lang="en"${htmlAttrs}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${body}
</body>
</html>
`;

const BASE = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; line-height: 1.5; padding: 24px; }
img { display: block; max-width: 100%; height: auto; }
`;

const MOTION_HTML = page(
  "Upload",
  `  <a class="btn" href="upload.html">Upload photo</a>
  <article class="card"><h2>Holiday album</h2><p>24 photos</p></article>
  <div class="spinner" role="status" aria-label="Loading"></div>`
);

const MOTION_CSS_DONE = `${BASE}
.btn {
  display: inline-block;
  padding: 14px 20px;
  background: #1d4ed8;
  color: white;
  text-decoration: none;
  transition: background-color 200ms ease, transform 200ms ease;
}

.btn:hover {
  background: #1e40af;
  transform: scale(1.05);
}

.card {
  max-width: 260px;
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  transition: transform 250ms ease, box-shadow 250ms ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.spinner {
  width: 40px;
  height: 40px;
  margin-top: 24px;
  border: 4px solid #dbeafe;
  border-top-color: #1d4ed8;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

const STATES_HTML = page(
  "Newsletter",
  `  <form class="signup" action="/subscribe" method="post">
    <label for="email">Email</label>
    <input id="email" name="email" type="email">
    <button class="btn" type="submit">Subscribe</button>
  </form>
  <p><a class="link" href="privacy.html">Read our privacy policy</a></p>`
);

const STATES_CSS = `${BASE}
.btn {
  padding: 12px 18px;
  border: 0;
  background: #047857;
  color: white;
}

/* The designer did not like the focus ring */
.btn:focus,
input:focus,
.link:focus {
  outline: none;
}
`;

const STATES_CSS_DONE = `${BASE}
.btn {
  padding: 12px 18px;
  border: 0;
  background: #047857;
  color: white;
}

.btn:hover {
  background: #065f46;
}

.btn:active {
  transform: translateY(1px);
}

.link:hover {
  text-decoration-thickness: 2px;
}

/* A clear ring for keyboard users, not on every mouse click */
.btn:focus-visible,
input:focus-visible,
.link:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 2px;
}
`;

const THEME_HTML = page(
  "Dashboard",
  `  <div class="layout">
    <aside class="sidebar">Menu</aside>
    <main class="content">
      <h1>Sales today</h1>
      <p class="total">₦482,000</p>
    </main>
  </div>`,
  ' data-theme="light"'
);

const THEME_CSS = `${BASE}
body {
  background: white;
  color: #111827;
}

.layout {
  display: flex;
  gap: 16px;
  width: 960px;
  margin: 0 auto;
}

.sidebar {
  width: 200px;
  padding: 16px;
  background: #f3f4f6;
}

.content {
  width: 744px;
}

.total {
  color: #047857;
}
`;

const THEME_CSS_DONE = `${BASE}
:root {
  --bg: #ffffff;
  --text: #111827;
  --surface: #f3f4f6;
  --accent: #047857;
}

[data-theme="dark"] {
  --bg: #111827;
  --text: #f9fafb;
  --surface: #1f2937;
  --accent: #34d399;
}

body {
  background: var(--bg);
  color: var(--text);
}

.layout {
  display: flex;
  gap: 16px;
  width: min(100% - 32px, 960px);
  margin: 0 auto;
}

.sidebar {
  width: 200px;
  padding: 16px;
  background: var(--surface);
}

.content {
  width: calc(100% - 200px - 16px);
}

.total {
  color: var(--accent);
}
`;

const GRID_HTML = page(
  "Dashboard",
  `  <div class="page">
    <header class="page-header">Sales dashboard</header>
    <nav class="page-nav">Navigation</nav>
    <main class="page-main">
      <div class="video-frame"><span>Weekly report video</span></div>
    </main>
    <footer class="page-footer">Footer</footer>
  </div>`
);

const GRID_CSS_DONE = `${BASE}
.page {
  display: grid;
  gap: 16px;
  grid-template-areas:
    "header"
    "main"
    "nav"
    "footer";
}

.page-header { grid-area: header; }
.page-nav { grid-area: nav; }
.page-main { grid-area: main; }
.page-footer { grid-area: footer; }

@media (min-width: 768px) {
  .page {
    grid-template-columns: 220px 1fr;
    grid-template-areas:
      "header header"
      "nav main"
      "footer footer";
  }
}

.video-frame {
  aspect-ratio: 16 / 9;
  background: #1f2937;
  color: white;
}
`;

const PREF_HTML = page(
  "Photo gallery",
  `  <article class="card card--featured">
    <h2 class="card__title">Lagos at night</h2>
    <p class="card__meta">Photo of the week</p>
    <span class="card__badge">New</span>
  </article>`
);

const PREF_CSS = `${BASE}
:root {
  --bg: #ffffff;
  --text: #111827;
  --card: #f9fafb;
}

body {
  background: var(--bg);
  color: var(--text);
}

.card {
  padding: 16px;
  background: var(--card);
}

.card__badge {
  display: inline-block;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  50% { transform: scale(1.15); }
}
`;

const PREF_CSS_DONE = `${BASE}
/* ── Tokens ───────────────────────── */
:root {
  --bg: #ffffff;
  --text: #111827;
  --card: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b1120;
    --text: #e5e7eb;
    --card: #1f2937;
  }
}

/* ── Base ─────────────────────────── */
body {
  background: var(--bg);
  color: var(--text);
}

/* ── Component: card ──────────────── */
.card {
  padding: 16px;
  background: var(--card);
}

.card--featured {
  border-left: 4px solid #f59e0b;
}

.card__badge {
  display: inline-block;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  50% { transform: scale(1.15); }
}

/* ── Preferences ──────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

const inMedia = (cond, test) =>
  `return rules().some((r) => r.media && /${cond}/.test(r.media) && (${test}));`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 11.1 – 11.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l43-motion",
    moduleId: "wd-m11-modern-css",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3"],
    title: "Transitions, Transforms and Animations",
    subtitle: "Motion that explains what happened, without JavaScript",
    estimatedMinutes: 22,
    intro:
      "Good motion is not decoration. A button that eases darker, a card that lifts when you point at it, a spinner that says \"wait\": each tells the visitor something. CSS does all three with no JavaScript.",

    atoms: [
      {
        id: "a-wd-transitions",
        title: "CSS transitions",
        explain:
          "A transition animates a property smoothly when its value changes, for example on :hover. Write it on the element's normal state: transition: background-color 200ms ease. List each property you want animated rather than using all, which animates things you did not mean to. Keep interface transitions short, 150 to 300 milliseconds: long enough to see, short enough never to make someone wait.",
        example:
          ".btn {\n  background: #1d4ed8;\n  transition: background-color 200ms ease, transform 200ms ease;\n}\n.btn:hover {\n  background: #1e40af;        /* fades over 200ms */\n  transform: scale(1.05);     /* grows over 200ms */\n}",
      },
      {
        id: "a-wd-transforms",
        title: "Transformations",
        explain:
          "transform moves, scales and rotates an element visually without affecting the layout around it: translate(x, y) or translateY(-4px) moves it, scale(1.05) grows it, rotate(45deg) turns it. Because transforms do not trigger layout, the browser can animate them very smoothly, which makes transform and opacity the two properties to prefer for animation.",
        table: {
          caption: "Transform functions.",
          headers: ["Function", "Effect", "Common use"],
          rows: [
            ["translateY(-4px)", "Moves up 4px", "A card lifting on hover"],
            ["scale(1.05)", "5% bigger", "A button responding to the pointer"],
            ["rotate(180deg)", "Turns half a circle", "An accordion arrow flipping"],
            ["translateX(-100%)", "Moves left by its own width", "A side menu sliding off screen"],
          ],
        },
      },
      {
        id: "a-wd-keyframes",
        title: "Keyframe animations",
        explain:
          "When motion should run by itself, or has several steps, use @keyframes to define the steps and the animation property to run them: animation: spin 800ms linear infinite runs the keyframes named spin, each cycle 800ms, at constant speed, forever. A keyframe list can use from and to, or percentages. Keep looping animations small and purposeful, such as a loading indicator.",
        webLab: {
          task:
            "Add three pieces of motion. (1) The button: on hover, a darker background and transform: scale(1.05), both transitioned over about 200ms. (2) The card: on hover it lifts with translateY(-4px) and gains a shadow, with a transition. (3) The spinner: a 40px circle with one coloured border side that spins forever, using @keyframes named spin.",
          files: { "index.html": MOTION_HTML, "style.css": `${BASE}\n.btn {\n  display: inline-block;\n  padding: 14px 20px;\n  background: #1d4ed8;\n  color: white;\n  text-decoration: none;\n}\n\n.card {\n  max-width: 260px;\n  margin-top: 24px;\n  padding: 16px;\n  border: 1px solid #e5e7eb;\n}\n` },
          readOnly: ["index.html"],
          tests: [
            { label: "The button transitions transform and its background", check: "const p = style('.btn', 'transition-property'); return /transform/.test(p) && /background/.test(p) && px(style('.btn', 'transition-duration')) * 1000 >= 100;", fail: ".btn { transition: background-color 200ms ease, transform 200ms ease; }" },
            { label: "Hovering the button scales it up", check: "return rules(/\\.btn:hover/).some((r) => /scale\\(/.test(r.style.transform));", fail: ".btn:hover { transform: scale(1.05); }" },
            { label: "Hovering the card lifts it with translateY", check: "return rules(/\\.card:hover/).some((r) => /translateY\\(-/.test(r.style.transform) && r.style.boxShadow);", fail: ".card:hover { transform: translateY(-4px); box-shadow: …; }" },
            { label: "The card's lift is transitioned", check: "return /transform|all/.test(style('.card', 'transition-property')) && style('.card', 'transition-duration') !== '0s';", fail: "Add a transition for transform to .card." },
            { label: "The spinner is a 40px circle", check: "const r = rect('.spinner'); return Math.round(r.width) === 40 && Math.round(r.height) === 40 && style('.spinner', 'border-top-left-radius') === '50%';", fail: ".spinner { width: 40px; height: 40px; border-radius: 50%; } (with box-sizing: border-box the border is inside)" },
            { label: "The spinner runs a @keyframes animation called spin, forever", check: "return keyframes().includes('spin') && style('.spinner', 'animation-name') === 'spin' && style('.spinner', 'animation-iteration-count') === 'infinite';", fail: "Define @keyframes spin { to { transform: rotate(360deg); } } and use animation: spin 800ms linear infinite;" },
          ],
          solution: { "style.css": MOTION_CSS_DONE },
          hint: "Transitions go on the normal state; the changed values go in :hover. The spinner needs @keyframes and the animation property.",
          successMessage: "Point at the button and the card in the preview, and watch the spinner. Three kinds of motion, none of them needing a line of JavaScript.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 11.4 – 11.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l44-states",
    moduleId: "wd-m11-modern-css",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.4", "11.5"],
    title: "Interaction States and :focus-visible",
    subtitle: "Feedback for every pointer, tap and key press",
    estimatedMinutes: 18,
    intro:
      "Every interactive element should answer the question \"did that do anything?\" Hover, focus and active states are that answer, and the focus state in particular is what lets keyboard users see where they are at all.",

    atoms: [
      {
        id: "a-wd-hover-focus-active",
        title: "Hover, focus and active states",
        explain:
          ":hover applies while a pointer is over an element (touch screens have no real hover, so never hide anything important behind it). :focus applies while an element has focus, from a click, a tap or the keyboard. :active applies while it is being pressed. Give links and buttons all three, and order them :hover, :focus, :active so the press wins. Wrap hover-only effects in @media (hover: hover) if they would get stuck on touch screens.",
        example:
          ".btn:hover  { background: #065f46; }\n.btn:active { transform: translateY(1px); }   /* pressed in */\n\n@media (hover: hover) {\n  .card:hover { transform: translateY(-4px); }  /* no sticky hover on phones */\n}",
      },
      {
        id: "a-wd-focus-visible",
        title: ":focus-visible and keyboard usability",
        explain:
          "Browsers draw a focus outline so keyboard users can see which element they are on. Designers often remove it with outline: none because it appears when clicking with a mouse, which leaves keyboard users completely lost. :focus-visible solves this: the browser applies it when focus should be shown, mainly for keyboard navigation, and not for mouse clicks on buttons. So never remove focus outlines without a replacement; style :focus-visible with a clear, high-contrast ring instead.",
        mistake: "*:focus { outline: none; } in a stylesheet. It fails the accessibility guidelines (WCAG 2.4.7, Focus Visible) and makes the site unusable without a mouse.",
        webLab: {
          task:
            "The designer removed all focus outlines. Replace that rule with proper states: give .btn a darker :hover background and an :active state; give .link a :hover state; and give .btn, the input and .link a clear :focus-visible outline at least 2px wide with an outline-offset. Delete the outline: none rule.",
          files: { "index.html": STATES_HTML, "style.css": STATES_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "No rule removes focus outlines", check: "return !rules().some((r) => /:focus\\b(?!-)/.test(r.selector) && /none|0px/.test(r.style.outline || r.style.outlineStyle || ''));", fail: "Delete the rule that sets outline: none on :focus." },
            { label: "The button, input and link each have a :focus-visible outline of at least 2px", check: "const fv = rules(/:focus-visible/); const covers = (s) => fv.some((r) => r.selector.split(',').some((x) => x.trim().startsWith(s)) && px(r.style.outlineWidth || (r.style.outline.match(/([0-9.]+)px/) || [])[1]) >= 2); return covers('.btn') && covers('input') && covers('.link');", fail: ".btn:focus-visible, input:focus-visible, .link:focus-visible { outline: 3px solid …; }" },
            { label: "The focus ring has an outline-offset", check: "return rules(/:focus-visible/).some((r) => r.style.outlineOffset);", fail: "Add outline-offset: 2px so the ring does not touch the element." },
            { label: "The button has :hover and :active states", check: "return rules(/\\.btn:hover/).length > 0 && rules(/\\.btn:active/).length > 0;", fail: "Add .btn:hover and .btn:active rules." },
            { label: "The link has a :hover state", check: "return rules(/\\.link:hover/).length > 0;", fail: "Add a .link:hover rule." },
          ],
          solution: { "style.css": STATES_CSS_DONE },
          hint: "outline: 3px solid #f59e0b; outline-offset: 2px; is a ring that shows on light and dark backgrounds.",
          successMessage: "Click into the preview and press Tab: a clear ring follows you from the field to the button to the link, while mouse clicks on the button stay clean.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 11.6 – 11.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l45-themes-functions",
    moduleId: "wd-m11-modern-css",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.6", "11.7"],
    title: "Themes and CSS Functions",
    subtitle: "Swapping a whole colour scheme at once, and letting CSS do the maths",
    estimatedMinutes: 20,
    intro:
      "Custom properties are not only for tidiness: redefine them under a different selector and a whole theme changes. And with calc(), min(), max() and clamp(), CSS can compute sizes from the space available instead of you guessing fixed numbers.",

    atoms: [
      {
        id: "a-wd-themes",
        title: "Custom properties and reusable themes",
        explain:
          "Custom properties cascade and inherit like any property, so they can be redefined for part of the page or for a whole theme. Define the defaults on :root, then redefine the same names under an attribute selector such as [data-theme=\"dark\"]. Components only ever use the variables, never raw colours, so switching the attribute on <html> (one line of JavaScript, or a server setting) restyles everything.",
        example:
          ":root            { --bg: #ffffff; --text: #111827; }\n[data-theme=\"dark\"] { --bg: #111827; --text: #f9fafb; }\n\nbody { background: var(--bg); color: var(--text); }\n\n<html data-theme=\"dark\">   ← the whole site is now dark",
      },
      {
        id: "a-wd-css-functions",
        title: "CSS functions: calc(), min(), max() and clamp()",
        explain:
          "calc() does arithmetic and can mix units: calc(100% - 200px) is the remaining space beside a 200px sidebar (spaces around + and - are required). min() picks the smallest of its values: width: min(100% - 32px, 960px) is fluid on phones, with 16px each side, and stops at 960px, in one line. max() picks the largest, useful for minimums. clamp(min, preferred, max), from Module 10, combines both.",
        table: {
          caption: "The four functions.",
          headers: ["Function", "Example", "Means"],
          rows: [
            ["calc()", "calc(100% - 200px - 16px)", "The width left after a sidebar and a gap"],
            ["min()", "min(100% - 32px, 960px)", "Whichever is smaller: fluid, then capped"],
            ["max()", "max(44px, 2.5em)", "At least 44px, larger if the text is"],
            ["clamp()", "clamp(1rem, 2.5vw, 1.5rem)", "Fluid between a minimum and a maximum"],
          ],
        },
        webLab: {
          task:
            "Two jobs on this dashboard. (1) Theming: move its colours into custom properties on :root (--bg, --text, --surface and --accent), use them everywhere, and redefine all four under [data-theme=\"dark\"] with dark values. (2) Fluid sizing: replace the fixed 960px layout width with min(100% - 32px, 960px), and the fixed content width with calc() so it is the space left after the 200px sidebar and the 16px gap.",
          files: { "index.html": THEME_HTML, "style.css": THEME_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The light theme uses variables for every colour", check: "const c = code('style.css'); return ['--bg', '--text', '--surface', '--accent'].every((v) => c.includes(v)) && rules(/^body$/).some((r) => /var\\(--bg\\)/.test(r.cssText) && /var\\(--text\\)/.test(r.cssText)) && rules('.total').some((r) => /var\\(--accent\\)/.test(r.cssText));", fail: "Define the four variables on :root and use var() in body, .sidebar and .total." },
            { label: "Setting data-theme=\"dark\" turns the page dark", check: "const before = style('body', 'background-color'); document.documentElement.setAttribute('data-theme', 'dark'); await tick(); const bg = style('body', 'background-color'); const m = bg.match(/\\d+/g).map(Number); document.documentElement.setAttribute('data-theme', 'light'); return bg !== before && m[0] + m[1] + m[2] < 150;", fail: "Add [data-theme=\"dark\"] { --bg: #111827; --text: …; --surface: …; --accent: …; }" },
            { label: "In the dark theme the text is light and the accent changes too", check: "document.documentElement.setAttribute('data-theme', 'dark'); await tick(); const t = style('body', 'color').match(/\\d+/g).map(Number); const a = style('.total', 'color'); document.documentElement.setAttribute('data-theme', 'light'); await tick(); return t[0] + t[1] + t[2] > 600 && a !== style('.total', 'color');", fail: "Redefine --text with a light colour and --accent with a brighter one for dark backgrounds." },
            { label: "On a phone the layout fits with 16px each side (min())", viewport: "mobile", check: "const r = rect('.layout'); return !overflowX() && Math.round(r.left) === 16 + 24 && /min\\(/.test(rules('.layout').map((x) => x.style.width).join(' '));", fail: ".layout { width: min(100% - 32px, 960px); }" },
            { label: "On a laptop the layout is 960px", check: "return Math.round(rect('.layout').width) === 960;", fail: "min(100% - 32px, 960px) caps it at 960px." },
            { label: "The content width is calculated with calc()", check: "const l = rect('.layout'), c = rect('.content'); return /calc\\(/.test(rules('.content').map((x) => x.style.width).join(' ')) && Math.round(l.right - c.right) <= 1;", fail: ".content { width: calc(100% - 200px - 16px); }" },
          ],
          solution: { "style.css": THEME_CSS_DONE },
          hint: "In calc() and min(), put spaces around + and -. The body's 24px padding is why the phone layout starts at 40px.",
          successMessage: "One attribute switches the whole palette, and the layout now computes its own sizes. These two techniques sit under almost every modern design system.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 11.8 – 11.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l46-advanced-grid",
    moduleId: "wd-m11-modern-css",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.8", "11.9"],
    title: "Advanced Grid Layouts and aspect-ratio",
    subtitle: "Named areas that rearrange a whole page, and boxes that keep their shape",
    estimatedMinutes: 20,
    intro:
      "Grid can do more than galleries. With named areas you can draw a page layout in your CSS and redraw it for a different screen in a few lines. And aspect-ratio keeps videos, cards and images in shape at every width.",

    atoms: [
      {
        id: "a-wd-grid-areas",
        title: "Advanced Grid layouts",
        explain:
          "grid-template-areas lets you name regions and arrange them as a picture: each quoted string is a row, each word a cell. Assign elements to areas with grid-area. Because the arrangement is in the CSS, a media query can move whole regions, for example putting the main content above the navigation on phones and beside it on laptops, without touching the HTML (keep the HTML in a sensible reading order, because screen readers and keyboards follow it). For card grids, repeat(auto-fill or auto-fit, minmax(…, 1fr)) creates as many columns as fit.",
        example:
          ".page {\n  display: grid;\n  grid-template-areas:\n    \"header\"\n    \"main\"\n    \"nav\"\n    \"footer\";\n}\n@media (min-width: 768px) {\n  .page {\n    grid-template-columns: 220px 1fr;\n    grid-template-areas:\n      \"header header\"\n      \"nav    main\"\n      \"footer footer\";\n  }\n}",
      },
      {
        id: "a-wd-aspect-ratio",
        title: "aspect-ratio",
        explain:
          "aspect-ratio gives a box a proportion: aspect-ratio: 16 / 9 for video, 1 for squares, 4 / 3 for photos. Its height follows its width, so it stays in shape at every screen size. It also stops layout shift: the space is reserved before an embedded video or image loads. Before aspect-ratio, developers used a padding-top percentage trick; you no longer need it.",
        webLab: {
          task:
            "Build the dashboard layout with named grid areas. Mobile first: one column in the order header, main, nav, footer. From 768px: a 220px column for the nav beside the main content, with the header and footer spanning both columns. Then make the video frame keep a 16:9 shape with aspect-ratio.",
          files: { "index.html": GRID_HTML, "style.css": BASE },
          readOnly: ["index.html"],
          tests: [
            { label: "The layout uses grid-template-areas, and each region has a grid-area", check: "return style('.page', 'display') === 'grid' && style('.page', 'grid-template-areas') !== 'none' && ['.page-header', '.page-nav', '.page-main', '.page-footer'].every((s) => style(s, 'grid-area').split('/')[0].trim() !== 'auto');", fail: "Give .page grid-template-areas, and each region grid-area: header / nav / main / footer." },
            { label: "On a phone: header, then main, then nav, then footer, in one column", viewport: "mobile", check: "const t = ['.page-header', '.page-main', '.page-nav', '.page-footer'].map((s) => rect(s)); return t.every((r, i) => i === 0 || r.top >= t[i - 1].bottom) && t.every((r) => Math.abs(r.left - t[0].left) < 1);", fail: "The phone areas should be \"header\" \"main\" \"nav\" \"footer\", one per row." },
            { label: "On a laptop: a 220px nav column beside main", check: "const n = rect('.page-nav'), m = rect('.page-main'); return Math.round(n.width) === 220 && Math.abs(n.top - m.top) < 1 && m.left > n.right;", fail: "At min-width: 768px use grid-template-columns: 220px 1fr and the areas \"nav main\"." },
            { label: "On a laptop, header and footer span the full width", check: "const p = rect('.page'); return Math.abs(rect('.page-header').width - p.width) < 1 && Math.abs(rect('.page-footer').width - p.width) < 1;", fail: "The header and footer rows should name their area twice: \"header header\"." },
            { label: "The video frame is 16:9 at every width", viewport: "mobile", check: "const r = rect('.video-frame'); return style('.video-frame', 'aspect-ratio').replace(/\\s/g, '') === '16/9' && Math.abs(r.width / r.height - 16 / 9) < 0.02;", fail: ".video-frame { aspect-ratio: 16 / 9; }" },
          ],
          solution: { "style.css": GRID_CSS_DONE },
          hint: "Each string in grid-template-areas is a row; repeat an area's name across a row to make it span columns.",
          successMessage: "Switch between Phone and Laptop: the navigation moves from below the content to beside it, and the HTML never changed. The video frame keeps its shape at both.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 11.10 – 11.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l47-preferences-architecture",
    moduleId: "wd-m11-modern-css",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.10", "11.11", "11.12"],
    title: "Dark Mode, Reduced Motion and CSS Architecture",
    subtitle: "Respecting the visitor's settings, and stylesheets that scale",
    estimatedMinutes: 22,
    intro:
      "Visitors tell their devices what they prefer: a dark interface, less motion. Modern CSS can listen. And as stylesheets grow to thousands of lines, a naming system is what keeps them changeable.",

    atoms: [
      {
        id: "a-wd-dark-mode",
        title: "Dark mode fundamentals",
        explain:
          "@media (prefers-color-scheme: dark) applies when the visitor's device is set to dark mode. With colour tokens, dark mode is just redefining them inside that query. Dark themes are not inverted light themes: use very dark greys rather than pure black, slightly dimmer text rather than pure white, reduce large areas of saturated colour, and check contrast again. Add <meta name=\"color-scheme\" content=\"light dark\"> so form controls and scrollbars match.",
        example:
          ":root { --bg: #ffffff; --text: #111827; }\n\n@media (prefers-color-scheme: dark) {\n  :root { --bg: #0b1120; --text: #e5e7eb; }\n}",
      },
      {
        id: "a-wd-reduced-motion",
        title: "Reduced-motion preferences",
        explain:
          "Some people get dizzy, nauseous or distracted from on-screen motion, including people with vestibular disorders, and their devices have a Reduce motion setting. @media (prefers-reduced-motion: reduce) lets you respect it: remove parallax and large movements, stop looping animations, and keep only gentle fades that help understanding. A common safety net shortens every animation and transition to almost nothing inside that query.",
        example:
          "@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}",
        why: "This is one of the rare places where !important is the right tool: it is a user preference that must win over every component's own animation.",
      },
      {
        id: "a-wd-css-architecture",
        title: "CSS architecture and reusable components",
        explain:
          "Large stylesheets need a system. A common one is BEM (block, element, modifier): a component is a block (.card), its parts are elements (.card__title, .card__badge) and its variants are modifiers (.card--featured). Every class names exactly one thing, specificity stays at one class, and you can tell from the HTML which CSS applies. Organise the file in layers: tokens, base, layout, components, utilities, preferences.",
        table: {
          caption: "BEM naming.",
          headers: ["Kind", "Pattern", "Example"],
          rows: [
            ["Block", ".block", ".card"],
            ["Element", ".block__element", ".card__title, .card__badge"],
            ["Modifier", ".block--modifier", ".card--featured"],
          ],
        },
        webLab: {
          task:
            "Make this gallery respect visitors' settings and finish its card component. (1) Inside @media (prefers-color-scheme: dark), redefine --bg, --text and --card with dark values. (2) Inside @media (prefers-reduced-motion: reduce), stop the badge's pulsing (shorten animations to almost nothing, or set animation: none). (3) The HTML uses the BEM modifier card--featured: style it with a 4px left border. (4) Organise the stylesheet with at least three comment section headers.",
          files: { "index.html": PREF_HTML, "style.css": PREF_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Dark mode redefines all three colour tokens", check: inMedia("prefers-color-scheme:\\s*dark", "['--bg', '--text', '--card'].every((v) => r.style.getPropertyValue(v).trim())"), fail: "@media (prefers-color-scheme: dark) { :root { --bg: …; --text: …; --card: …; } }" },
            { label: "The dark --bg really is dark", check: "return rules().some((r) => r.media && /prefers-color-scheme:\\s*dark/.test(r.media) && (() => { const p = document.createElement('i'); p.style.color = r.style.getPropertyValue('--bg'); document.body.append(p); const m = style(p, 'color').match(/\\d+/g).map(Number); p.remove(); return m[0] + m[1] + m[2] < 150; })());", fail: "Use a very dark value for --bg in dark mode, such as #0b1120." },
            { label: "Reduced motion stops the animation", check: inMedia("prefers-reduced-motion:\\s*reduce", "/none/.test(r.style.animation || r.style.animationName) || parseFloat(r.style.animationDuration) <= 0.01 || /^0\\.?0*1?ms/.test(r.style.animationDuration)"), fail: "@media (prefers-reduced-motion: reduce) { …animation-duration: 0.01ms !important; … } or animation: none." },
            { label: "The featured card modifier has a 4px left border", check: "return style('.card--featured', 'border-left-width') === '4px' && style('.card--featured', 'border-left-style') === 'solid';", fail: ".card--featured { border-left: 4px solid #f59e0b; }" },
            { label: "The stylesheet has at least three comment section headers", check: "return (raw('style.css').match(/\\/\\*[\\s\\S]*?\\*\\//g) || []).length >= 3;", fail: "Add comments such as /* ── Tokens ── */, /* ── Base ── */ and /* ── Components ── */." },
          ],
          solution: { "style.css": PREF_CSS_DONE },
          hint: "Media queries can wrap a :root rule like any other. The reduced-motion block can target every element with *.",
          successMessage: "Switch your own device to dark mode and back with the preview open: the page follows. It also stops pulsing for anyone who has asked for less motion.",
        },
      },
    ],

    task: {
      title: "Module project: a themeable component sheet",
      intro: "Build a one-page component sheet that you will reuse in your projects.",
      prompts: [
        "Tokens on :root for colours, radius, shadow and spacing, with a dark set inside prefers-color-scheme and a [data-theme] override.",
        "BEM components: .btn (with --primary and --ghost modifiers), .card (with __title, __body and --featured) and .badge.",
        "Hover, active and :focus-visible states on every interactive element; transitions under 300ms.",
        "A gallery using grid areas or auto-fit, with aspect-ratio on its images.",
        "A reduced-motion block that disables every animation.",
      ],
      closing: "Module 12 uses this component sheet to implement a full design.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
