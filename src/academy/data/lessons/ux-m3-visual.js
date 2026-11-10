/**
 * UI/UX DESIGN · MODULE 3 · VISUAL DESIGN FUNDAMENTALS
 *
 * Curriculum 3.1 – 3.18 and the practical 3.P. Visual principles, colour
 * theory and psychology, palettes, typography, hierarchy, contrast,
 * alignment, proximity, balance, white space, consistency, grids, spacing
 * systems and composition. Every claim about readability is measured in the
 * lab with the WCAG contrast formula on the browser's rendered colours.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s3-visual";

const RGB = String.raw`const rgbOf = (c) => (String(c).match(/[\d.]+/g) || []).slice(0, 3).map(Number);
`;

/* ── Lesson 10 lab: a palette that works ───────────────────────────────── */
const WALLET_HTML = page(
  "KoboSave wallet",
  `  <main class="wallet">
    <p class="label">Total savings</p>
    <p class="balance">₦184,500</p>
    <span class="badge">Goal: school fees</span>
    <ul class="moves">
      <li><span>Daily deposit</span><span class="up">+₦2,000</span></li>
      <li><span>Withdrawal</span><span class="down">−₦15,000</span></li>
    </ul>
    <a class="btn" href="deposit.html">Save now</a>
  </main>`
);

const walletCss = (tokens) => `${BASE}
/* The palette. Change the token values only. */
:root {
${tokens}
}

body { background: var(--surface); color: var(--text); }

.wallet { max-width: 400px; margin: 0 auto; padding: 24px 16px; }
.label { margin: 0; color: var(--muted); font-size: 14px; }
.balance { margin: 4px 0 12px; font-size: 40px; font-weight: 700; color: var(--text); }

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--primary-tint);
  color: var(--primary);
  font-size: 14px;
  font-weight: 700;
}

.moves { list-style: none; margin: 24px 0; padding: 0; }
.moves li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
.up { color: var(--success); font-weight: 700; }
.down { color: var(--danger); font-weight: 700; }

.btn {
  display: block;
  padding: 14px;
  border-radius: 10px;
  background: var(--primary);
  color: #ffffff;
  text-align: center;
  font-weight: 700;
  text-decoration: none;
}
`;

const WALLET_CSS = walletCss(`  --surface: #ffffff;
  --text: #6b7280;
  --muted: #d1d5db;
  --primary: #a78bfa;
  --primary-tint: #c4b5fd;
  --success: #86efac;
  --danger: #fca5a5;`);

const WALLET_CSS_DONE = walletCss(`  --surface: #ffffff;
  --text: #111827;
  --muted: #4b5563;
  --primary: #6d28d9;
  --primary-tint: #ede9fe;
  --success: #15803d;
  --danger: #b91c1c;`);

/* ── Lesson 11 lab: a type system for an article ───────────────────────── */
const ARTICLE_HTML = page(
  "How to save on a daily income",
  `  <article class="post">
    <p class="eyebrow">Money guide</p>
    <h1>How to save on a daily income</h1>
    <p class="lede">Most savings advice assumes a monthly salary. Here is what works when money arrives every day.</p>
    <h2>Pay yourself first, at closing time</h2>
    <p>Set aside a fixed amount the moment you close for the day, before any spending. Small and regular beats large and occasional, because the habit matters more than the amount in the first months.</p>
    <h2>Make withdrawals slightly hard</h2>
    <p>Keep savings somewhere that takes effort to reach: a locked goal, a cooperative, or an account without a card. The small delay is often enough to stop a purchase you would regret.</p>
  </article>`
);

const ARTICLE_CSS = `${BASE}
body { color: #1f2937; }

.post { padding: 24px 16px; }

.eyebrow { font-family: "Courier New", monospace; font-size: 12px; color: #6d28d9; }
h1 { font-family: Impact, sans-serif; font-size: 20px; line-height: 1.6; font-weight: 400; }
.lede { font-family: Georgia, serif; font-size: 18px; }
h2 { font-family: "Comic Sans MS", cursive; font-size: 18px; line-height: 1.6; font-weight: 400; }
p { font-size: 13px; line-height: 1.1; }
`;

const ARTICLE_CSS_DONE = `${BASE}
:root {
  --font-heading: Georgia, "Times New Roman", serif;
  --font-body: Arial, Helvetica, sans-serif;
}

body { color: #1f2937; font-family: var(--font-body); }

.post { max-width: 680px; margin: 0 auto; padding: 24px 16px; }

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6d28d9;
}

h1 {
  margin: 0 0 16px;
  font-family: var(--font-heading);
  font-size: 40px;
  line-height: 1.15;
  font-weight: 700;
}

.lede { font-size: 20px; line-height: 1.5; }

h2 {
  margin: 32px 0 8px;
  font-family: var(--font-heading);
  font-size: 26px;
  line-height: 1.25;
  font-weight: 700;
}

p { font-size: 17px; line-height: 1.6; }
`;

/* ── Lesson 12 lab: hierarchy, proximity and alignment ─────────────────── */
const EVENT_HTML = page(
  "Register for DesignFest Lagos",
  `  <main class="register">
    <h1>Register for DesignFest Lagos</h1>
    <p class="meta">Saturday 14 March · Landmark Centre · Free for students</p>
    <form class="form" action="/register" method="post">
      <label for="name">Full name</label>
      <input id="name" name="name" autocomplete="name">
      <label for="email">Email address</label>
      <input id="email" name="email" type="email" autocomplete="email">
      <label for="school">School or company</label>
      <input id="school" name="school">
      <div class="actions">
        <button class="primary" type="submit">Register</button>
        <a class="secondary" href="schedule.html">See the schedule</a>
      </div>
    </form>
  </main>`
);

const EVENT_CSS = `${BASE}
body { color: #111827; }

.register { max-width: 440px; margin: 0 auto; padding: 32px 16px; }
h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.2; }
.meta { margin: 0 0 24px; color: #9ca3af; }

label { display: block; margin: 16px 0 16px; font-weight: 700; text-align: center; }
input { display: block; width: 100%; padding: 10px 12px; border: 1px solid #6b7280; border-radius: 8px; font: inherit; }

.actions { display: flex; gap: 16px; align-items: center; margin-top: 24px; }
.primary { padding: 6px 10px; border: 1px solid #9ca3af; background: #ffffff; color: #6b7280; font: inherit; border-radius: 8px; }
.secondary { padding: 14px 24px; border-radius: 8px; background: #7c3aed; color: #ffffff; font-weight: 700; text-decoration: none; }
`;

const EVENT_CSS_DONE = `${BASE}
body { color: #111827; }

.register { max-width: 440px; margin: 0 auto; padding: 32px 16px; }
h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.2; }
.meta { margin: 0 0 24px; color: #4b5563; }

/* Proximity: a label sits close to its own field, far from the previous one */
label { display: block; margin: 24px 0 6px; font-weight: 700; text-align: left; }
input { display: block; width: 100%; padding: 10px 12px; border: 1px solid #6b7280; border-radius: 8px; font: inherit; }

.actions { display: flex; gap: 16px; align-items: center; margin-top: 32px; }

/* Hierarchy: one dominant action, one quiet one */
.primary {
  min-height: 48px;
  padding: 12px 28px;
  border: 0;
  border-radius: 8px;
  background: #6d28d9;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
}

.secondary {
  padding: 8px 4px;
  color: #6d28d9;
  font-weight: 700;
}
`;

/* ── Lesson 13 lab: a spacing system and a grid ────────────────────────── */
const COURSES_HTML = page(
  "Short courses",
  `  <main class="page">
    <h1 class="page__title">Short courses this month</h1>
    <div class="grid">
      <article class="card">
        <h2 class="card__title">Intro to Figma</h2>
        <p class="card__text">Frames, components and Auto Layout in two Saturdays.</p>
        <a class="card__link" href="figma.html">View course</a>
      </article>
      <article class="card">
        <h2 class="card__title">UX research basics</h2>
        <p class="card__text">Plan interviews and surveys, and turn notes into decisions.</p>
        <a class="card__link" href="research.html">View course</a>
      </article>
      <article class="card">
        <h2 class="card__title">Design systems</h2>
        <p class="card__text">Tokens, components and documentation for growing teams.</p>
        <a class="card__link" href="systems.html">View course</a>
      </article>
    </div>
  </main>`
);

const COURSES_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }

.page { max-width: 1104px; margin: 0 auto; padding: 13px 18px; }
.page__title { margin: 0 0 22px; font-size: 32px; }

.grid { display: flex; flex-wrap: wrap; gap: 11px; }

.card { width: 300px; padding: 15px 21px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
.card:nth-child(2) { padding: 9px; }
.card__title { margin: 0 0 7px; font-size: 20px; }
.card__text { margin: 0 0 19px; color: #374151; }
.card__link { color: #6d28d9; font-weight: 700; }
`;

const COURSES_CSS_DONE = `${BASE}
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
}

body { color: #111827; background: #f8fafc; }

.page { max-width: 1104px; margin: 0 auto; padding: var(--space-5) var(--space-3); }
.page__title { margin: 0 0 var(--space-4); font-size: 32px; }

/* Mobile first: one column; three equal columns with 24px gutters on wide screens */
.grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }

@media (min-width: 900px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

.card { padding: var(--space-4); background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
.card__title { margin: 0 0 var(--space-2); font-size: 20px; }
.card__text { margin: 0 0 var(--space-3); color: #374151; }
.card__link { color: #6d28d9; font-weight: 700; }
`;

const SCALE = "[0, 4, 8, 12, 16, 24, 32, 40, 48, 64]";
const SIDES = "['top', 'right', 'bottom', 'left']";

/* ── Lesson 14 lab: a visual style guide ───────────────────────────────── */
const GUIDE_HTML = page(
  "Style guide",
  `  <main class="guide">
    <h1>Style guide</h1>

    <section class="block">
      <h2>Colour</h2>
      <div class="swatches">
        <span class="swatch swatch--primary">Primary</span>
        <span class="swatch swatch--text">Text</span>
        <span class="swatch swatch--muted">Muted</span>
        <span class="swatch swatch--success">Success</span>
        <span class="swatch swatch--danger">Danger</span>
      </div>
    </section>

    <section class="block">
      <h2>Typography</h2>
      <p class="type-h1">Heading 1</p>
      <p class="type-h2">Heading 2</p>
      <p class="type-body">Body text for paragraphs and descriptions.</p>
      <p class="type-small">Small text for captions and help.</p>
    </section>

    <section class="block">
      <h2>Elements</h2>
      <div class="row">
        <button class="btn btn--primary" type="button">Primary</button>
        <button class="btn btn--secondary" type="button">Secondary</button>
      </div>
      <label class="field-label" for="demo">Email address</label>
      <input class="field" id="demo" type="email" placeholder="ada@example.com">
      <article class="card">
        <h3 class="card__title">Card title</h3>
        <p class="card__text">Cards group related content and actions.</p>
      </article>
    </section>
  </main>`
);

const GUIDE_CSS = `${BASE}
/* Define your tokens here, then use them below with var(--name). */
:root {
}

.guide { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
.block { margin-bottom: 32px; }
.swatches { display: flex; flex-wrap: wrap; gap: 8px; }
.swatch { padding: 24px 12px 8px; min-width: 96px; border-radius: 8px; color: #ffffff; font-size: 14px; }
.row { display: flex; gap: 16px; margin-bottom: 16px; }
`;

const GUIDE_CSS_DONE = `${BASE}
:root {
  /* Colour */
  --color-primary: #6d28d9;
  --color-text: #111827;
  --color-muted: #4b5563;
  --color-surface: #ffffff;
  --color-border: #d1d5db;
  --color-success: #15803d;
  --color-danger: #b91c1c;

  /* Typography */
  --font-family: Arial, Helvetica, sans-serif;
  --font-size-h1: 40px;
  --font-size-h2: 28px;
  --font-size-body: 16px;
  --font-size-small: 14px;

  /* Spacing (8-point scale) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
}

body { font-family: var(--font-family); color: var(--color-text); background: var(--color-surface); }

.guide { max-width: 720px; margin: 0 auto; padding: var(--space-4) var(--space-3); }
.block { margin-bottom: var(--space-5); }
.swatches { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.swatch { padding: var(--space-4) 12px var(--space-2); min-width: 96px; border-radius: 8px; color: #ffffff; font-size: var(--font-size-small); }
.swatch--primary { background: var(--color-primary); }
.swatch--text { background: var(--color-text); }
.swatch--muted { background: var(--color-muted); }
.swatch--success { background: var(--color-success); }
.swatch--danger { background: var(--color-danger); }

.type-h1 { margin: 0 0 var(--space-2); font-size: var(--font-size-h1); font-weight: 700; line-height: 1.2; }
.type-h2 { margin: 0 0 var(--space-2); font-size: var(--font-size-h2); font-weight: 700; line-height: 1.25; }
.type-body { margin: 0 0 var(--space-2); font-size: var(--font-size-body); line-height: 1.6; }
.type-small { margin: 0; font-size: var(--font-size-small); color: var(--color-muted); }

.row { display: flex; gap: var(--space-3); margin-bottom: var(--space-3); }

.btn {
  min-height: 44px;
  padding: 12px 20px;
  border-radius: 8px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.btn--primary { border: 2px solid var(--color-primary); background: var(--color-primary); color: #ffffff; }
.btn--secondary { border: 2px solid var(--color-primary); background: transparent; color: var(--color-primary); }

.field-label { display: block; margin-bottom: var(--space-1); font-weight: 700; }
.field {
  display: block;
  width: 100%;
  max-width: 360px;
  min-height: 44px;
  margin-bottom: var(--space-3);
  padding: 10px 12px;
  border: 1px solid var(--color-muted);
  border-radius: 8px;
  font: inherit;
}

.card { padding: var(--space-4); border: 1px solid var(--color-border); border-radius: 12px; }
.card__title { margin: 0 0 var(--space-2); font-size: 20px; }
.card__text { margin: 0; color: var(--color-muted); }
`;

const TOKENS = String.raw`const rootVars = () => { const out = {}; for (const r of rules(':root')) { const m = r.cssText.match(/--[\w-]+\s*:\s*[^;]+/g) || []; for (const d of m) { const [k, ...v] = d.split(':'); out[k.trim()] = v.join(':').trim(); } } return out; };
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.1 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l10-colour",
    moduleId: "ux-m3-visual",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3", "3.4", "3.5"],
    title: "Visual Principles and Colour",
    subtitle: "How colour works, what it communicates, and palettes that are readable",
    estimatedMinutes: 28,
    intro:
      "Visual design is not decoration: it decides what people notice first, what they understand, and whether they can read your interface at all. This lesson introduces the principles of visual design and then the most powerful and most misused of them: colour.",

    atoms: [
      {
        id: "a-ux-visual-principles",
        title: "Principles of visual design",
        explain:
          "A handful of principles explain most of what makes an interface look clear: hierarchy (the most important thing is the most noticeable), contrast (differences in colour, size or weight make things distinct and readable), alignment (elements line up along shared edges), proximity (related things sit close together), balance (visual weight is distributed deliberately), white space (empty space gives content room and groups it), and consistency (the same thing always looks the same). Each has its own lesson in this module. Together they turn a collection of elements into an interface that can be understood at a glance.",
        why: "People decide within a second whether a screen looks trustworthy and usable. These principles are what they are reacting to, even without names for them.",
      },
      {
        id: "a-ux-colour-theory",
        title: "Colour theory and the colour wheel",
        explain:
          "Every colour can be described by hue (which colour: red, blue, green), saturation (how vivid or grey it is) and lightness (how light or dark). The colour wheel arranges hues in a circle. In the traditional painter's model the primary colours are red, yellow and blue; mixing two primaries gives the secondary colours orange, green and purple; mixing a primary with its neighbouring secondary gives the six tertiary colours such as red-orange and blue-green. Screens mix light instead of paint, using red, green and blue (RGB), which is why web colours are written as rgb() or hex codes like #6d28d9. Colour schemes come from positions on the wheel: complementary colours sit opposite each other (high contrast), analogous colours sit side by side (harmonious), and a monochromatic scheme uses one hue at several lightnesses.",
        table: {
          caption: "Colour vocabulary designers use.",
          headers: ["Term", "Meaning", "Example"],
          rows: [
            ["Primary (painter's)", "Red, yellow, blue", "The three you cannot mix from others"],
            ["Secondary", "Two primaries mixed", "Orange, green, purple"],
            ["Tertiary", "A primary and a neighbouring secondary", "Red-orange, yellow-green, blue-purple"],
            ["Complementary", "Opposite on the wheel", "Purple and yellow"],
            ["Analogous", "Next to each other", "Blue, blue-green, green"],
            ["Tint / shade", "A hue mixed with white / black", "Pale lilac / deep purple"],
          ],
        },
      },
      {
        id: "a-ux-colour-psychology",
        title: "Colour psychology and emotional associations",
        explain:
          "Colours carry associations, though they vary by culture and context. Blue often signals trust and calm (common in banks and health); green suggests growth, money and success; red signals urgency, danger or errors, and also energy and sales; yellow and orange feel warm and attention-grabbing; purple suggests creativity or luxury; black and white feel premium and minimal. In interfaces the most important associations are functional: red for errors and destructive actions, green for success, amber for warnings. Use them consistently and never rely on colour alone to carry meaning, because about 1 in 12 men cannot reliably tell red from green.",
        decision: {
          scenario: "A savings app shows deposits in red and withdrawals in green, because red is the brand colour.",
          question: "What is the main problem?",
          options: [
            { id: "a", text: "It reverses the meanings people already associate with red and green, so users will misread their money", why: "Functional colour meaning (green good, red warning) should win over brand colour. Use the brand colour elsewhere, and add + and − signs so colour is not the only signal." },
            { id: "b", text: "Red is an ugly colour for a savings app", whyWrong: "Taste is not the issue; meaning is." },
            { id: "c", text: "There is no problem: users will learn it", whyWrong: "Reversing a convention costs every user every time, and invites costly mistakes with money." },
            { id: "d", text: "Both should be blue", whyWrong: "That removes a useful signal instead of fixing it." },
          ],
          correct: "a",
          aftermath: "Brand colour is for identity; functional colour is for meaning. Keep them separate.",
        },
      },
      {
        id: "a-ux-palettes",
        title: "Creating colour palettes",
        explain:
          "An interface palette is a small set of named colours with jobs: a primary (brand) colour for main actions and highlights, a light tint of it for backgrounds such as badges, neutrals for text, secondary text, borders and surfaces, and semantic colours for success, warning and error. A common balance is 60-30-10: about 60% neutral surface, 30% secondary colour, 10% accent. Every text colour must be readable against the colour behind it: WCAG asks for a contrast ratio of at least 4.5:1 for normal text (Lesson 12 explains the measure). Pale pastels look pleasant in a swatch and fail as text.",
        example:
          "--surface:      #ffffff   page and cards\n--text:         #111827   main text      17.7 : 1 on white\n--muted:        #4b5563   secondary text  7.6 : 1\n--primary:      #6d28d9   buttons, links (white text on it 7.1 : 1)\n--primary-tint: #ede9fe   badge background\n--success:      #15803d   money in\n--danger:       #b91c1c   money out, errors",
        webLab: {
          task:
            "KoboSave's wallet uses a pastel palette that looks soft and cannot be read. Change only the token values in :root so that: the main text and the muted label both pass 4.5:1 on the surface; the white button text passes 4.5:1 on --primary; the badge text (--primary) passes 4.5:1 on --primary-tint; money in (--success) is a green and money out (--danger) is a red, both passing 4.5:1 on the surface.",
          files: { "index.html": WALLET_HTML, "style.css": WALLET_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Main text and the muted label pass 4.5:1", check: CONTRAST + "return passes('.balance', 4.5) && passes('.label', 4.5) && passes('.moves li > span:first-child', 4.5);", fail: "Use a near-black for --text and a mid-grey such as #4b5563 for --muted." },
            { label: "White text on the button passes 4.5:1", check: CONTRAST + "return ratio('.btn') >= 4.5;", fail: "A pastel primary is too light for white text. Choose a deeper shade, such as #6d28d9." },
            { label: "The badge text passes 4.5:1 on its tint", check: CONTRAST + "return ratio('.badge') >= 4.5;", fail: "Make --primary-tint very light (such as #ede9fe) so the deep primary text stands out." },
            { label: "Money in is a readable green", check: CONTRAST + RGB + "const [r, g, b] = rgbOf(style('.up', 'color')); return ratio('.up') >= 4.5 && g > r && g > b;", fail: "Use a deep green such as #15803d." },
            { label: "Money out is a readable red", check: CONTRAST + RGB + "const [r, g, b] = rgbOf(style('.down', 'color')); return ratio('.down') >= 4.5 && r > g && r > b;", fail: "Use a deep red such as #b91c1c." },
          ],
          solution: { "style.css": WALLET_CSS_DONE },
          hint: "Keep the hues, change the lightness: deep purple, deep green and deep red for text and buttons, a very pale purple for the badge.",
          successMessage: "Same hues, same mood, now readable by everyone in any light. Lightness, not hue, decides readability.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.6 – 3.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l11-typography",
    moduleId: "ux-m3-visual",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.6", "3.7", "3.8", "3.9"],
    title: "Typography",
    subtitle: "Typefaces, pairing, size, weight, line height and letter spacing",
    estimatedMinutes: 28,
    intro:
      "Most of any interface is text, so typography is most of its design. Good typography is invisible: people simply read. This lesson covers the vocabulary, the classifications, how to pair typefaces, and the four settings that decide whether text is comfortable to read.",

    atoms: [
      {
        id: "a-ux-typography-fundamentals",
        title: "Typography fundamentals",
        explain:
          "Typography is the arrangement of text to make it readable and to give it the right voice. A typeface is a design of letters (Inter, Georgia); a font is one weight or style of it (Inter Bold). Readability depends on size, weight, line height (the space between lines), line length (characters per line, best around 45 to 75), letter spacing and contrast with the background. Typography also creates hierarchy: a clear type scale (a fixed set of sizes, such as 14, 16, 20, 26, 40) lets people see at a glance what is a heading, what is body text and what is a caption.",
        why: "If people cannot read your text comfortably, nothing else in the design matters.",
      },
      {
        id: "a-ux-font-classifications",
        title: "Font families and classifications",
        explain:
          "Typefaces fall into families with different characters. Serif faces have small strokes at the ends of letters (Georgia, Merriweather): traditional, editorial, good for headings and long reading. Sans-serif faces have none (Arial, Inter, Roboto): clean and neutral, the default for interfaces because they stay clear at small sizes on screens. Slab serifs have heavy block serifs (Roboto Slab): sturdy and bold. Monospace faces give every letter the same width (Courier, JetBrains Mono): for code and numbers that must line up. Script faces imitate handwriting and display faces are decorative: use them only for short, large text such as a logo, never for paragraphs or buttons.",
        table: {
          caption: "Type classifications and where they belong.",
          headers: ["Classification", "Examples", "Good for", "Avoid for"],
          rows: [
            ["Serif", "Georgia, Merriweather", "Headings, long articles", "Very small UI labels"],
            ["Sans-serif", "Arial, Inter, Roboto", "Interfaces, body text, labels", "Rarely wrong"],
            ["Slab serif", "Roboto Slab, Rockwell", "Bold headings, posters", "Long body text"],
            ["Monospace", "Courier New, JetBrains Mono", "Code, account numbers", "Paragraphs"],
            ["Script / display", "Pacifico, Impact", "Logos, one big word", "Body text, buttons, forms"],
          ],
        },
      },
      {
        id: "a-ux-font-pairing",
        title: "Font pairing",
        explain:
          "Use one or two typefaces, rarely three. The simplest professional choice is one good sans-serif in several weights. If you pair, combine faces that are clearly different in classification but similar in proportions: a serif for headings with a sans-serif for body text is the classic pairing. Give each face a job and keep to it everywhere. Avoid pairing two faces that are almost the same (they look like a mistake) or two decorative faces (they fight). Superfamilies such as Roboto and Roboto Slab, or IBM Plex Sans and Plex Serif, are designed to pair.",
        decision: {
          scenario: "A designer's landing page uses Impact for the heading, Comic Sans for subheadings, Courier for labels and Georgia for paragraphs.",
          question: "What is the best fix?",
          options: [
            { id: "a", text: "Reduce to two faces with clear jobs, such as Georgia for headings and a sans-serif for everything else", why: "Two faces, each with a job, give contrast without chaos; hierarchy then comes from size and weight." },
            { id: "b", text: "Add a fifth typeface for the buttons", whyWrong: "More faces make it worse." },
            { id: "c", text: "Use Impact everywhere for consistency", whyWrong: "A display face is tiring and hard to read in body text." },
            { id: "d", text: "Keep them all; variety makes it interesting", whyWrong: "Four unrelated faces look accidental and slow reading." },
          ],
          correct: "a",
          aftermath: "Two typefaces is plenty. Create hierarchy with size and weight, not more families.",
        },
      },
      {
        id: "a-ux-type-settings",
        title: "Weight, size, line height and letter spacing",
        explain:
          "Body text on screens should be at least 16px (17 or 18 for long reading). Headings step up a scale: a ratio of about 1.25 to 1.5 between levels, with the h1 at least twice the body size. Line height for body text sits between 1.4 and 1.7 times the font size; large headings need less, about 1.1 to 1.3, or their lines drift apart. Weight builds hierarchy: regular (400) for body, bold (600 to 700) for headings and emphasis. Letter spacing (tracking) is best left alone for body text, but small uppercase labels need a little extra (about 0.05 to 0.1em) to stay legible. Keep lines to about 45 to 75 characters by limiting the width of text columns.",
        example:
          "body  17px / line-height 1.6  / weight 400\nh2    26px / line-height 1.25 / weight 700\nh1    40px / line-height 1.15 / weight 700\nlabel 13px / UPPERCASE / letter-spacing 0.08em\ncolumn max-width ≈ 680px (about 70 characters of 17px text)",
        webLab: {
          task:
            "This article's typography makes it hard to read. Fix style.css: use at most two typeface families; body paragraphs at least 16px with a line height between 1.4 and 1.7; the h1 at least twice the body size with a line height of 1.3 or less; the h2s larger than the body and smaller than the h1, with a line height of 1.3 or less; headings bold (600 or more); the uppercase eyebrow with letter spacing of at least 0.05em; and the text column no wider than 75 characters (about 38em of body text) on a laptop.",
          files: { "index.html": ARTICLE_HTML, "style.css": ARTICLE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "At most two typeface families", check: "const f = new Set(['.eyebrow', 'h1', '.lede', 'h2', '.post > p:not(.eyebrow):not(.lede)'].map((s) => style(s, 'font-family').split(',')[0].replace(/['\"]/g, '').trim())); return f.size <= 2;", fail: "Choose one face for headings and one for everything else." },
            { label: "Body text at least 16px with line height 1.4–1.7", check: "const p = $$('.post > p:not(.eyebrow):not(.lede)'); return p.length > 0 && p.every((n) => { const fs = px(style(n, 'font-size')); const lh = px(style(n, 'line-height')) / fs; return fs >= 16 && lh >= 1.4 && lh <= 1.7; });", fail: "p { font-size: 17px; line-height: 1.6; }" },
            { label: "h1 at least twice the body size, line height 1.3 or less", check: "const body = px(style('.post > p:last-child', 'font-size')); const fs = px(style('h1', 'font-size')); return fs >= 2 * body && px(style('h1', 'line-height')) / fs <= 1.3;", fail: "h1 { font-size: 40px; line-height: 1.15; }" },
            { label: "h2 between body and h1, line height 1.3 or less", check: "const body = px(style('.post > p:last-child', 'font-size')); const fs = px(style('h2', 'font-size')); return fs > body && fs < px(style('h1', 'font-size')) && px(style('h2', 'line-height')) / fs <= 1.3;", fail: "h2 { font-size: 26px; line-height: 1.25; }" },
            { label: "Headings are bold", check: "return Number(style('h1', 'font-weight')) >= 600 && Number(style('h2', 'font-weight')) >= 600;", fail: "font-weight: 700 on h1 and h2." },
            { label: "The uppercase eyebrow is letter-spaced", check: "const fs = px(style('.eyebrow', 'font-size')); return style('.eyebrow', 'text-transform') === 'uppercase' && px(style('.eyebrow', 'letter-spacing')) >= 0.05 * fs - 0.01;", fail: ".eyebrow { text-transform: uppercase; letter-spacing: 0.08em; }" },
            { label: "Lines are no longer than about 75 characters", check: "const p = $('.post > p:last-child'); return rect(p).width / px(style(p, 'font-size')) <= 40;", fail: "Limit the column: .post { max-width: 680px; margin: 0 auto; }" },
          ],
          solution: { "style.css": ARTICLE_CSS_DONE },
          hint: "Line height is a ratio: 17px text with line-height 1.6 has 27px lines. Headings need tighter lines than paragraphs.",
          successMessage: "The words did not change, but now the page reads easily, the headings lead the eye, and the lines are a comfortable length.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.10 – 3.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l12-hierarchy",
    moduleId: "ux-m3-visual",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.10", "3.11", "3.12", "3.13"],
    title: "Hierarchy, Contrast, Alignment and Balance",
    subtitle: "Leading the eye, keeping text readable, and arranging elements",
    estimatedMinutes: 28,
    intro:
      "A screen is read in an order the designer chooses, whether they meant to or not. This lesson shows how to control that order with hierarchy, how to measure readability with contrast, and how alignment, proximity and balance turn scattered elements into a composed interface.",

    atoms: [
      {
        id: "a-ux-visual-hierarchy",
        title: "Visual hierarchy",
        explain:
          "Visual hierarchy is the order in which the eye notices things, controlled by size (bigger first), weight (bold first), colour and contrast (vivid and high-contrast first), position (top and left first in left-to-right languages), and space (an isolated element stands out). Each screen should have one clear focal point, usually its main action or most important information, and a clear second and third level. Squint at your design: whatever you can still see when it is blurred is what people notice first. If everything is bold and bright, nothing is.",
        why: "When there is one obvious next step, people take it. When there are five equal ones, they hesitate.",
      },
      {
        id: "a-ux-contrast-readability",
        title: "Contrast and readability",
        explain:
          "Contrast is the difference between elements. Visually it creates hierarchy; for text it decides readability. WCAG measures text contrast as a ratio between the relative luminance (lightness) of the text and its background, from 1:1 (identical) to 21:1 (black on white). Level AA requires at least 4.5:1 for normal text and 3:1 for large text (24px, or about 19px bold) and for icons and input borders. Light grey placeholder-style text, white on yellow, and text over busy photos are the usual failures. Design tools and browser developer tools both show the ratio; check every text colour against every background it appears on.",
        table: {
          caption: "Contrast ratios against white (#ffffff).",
          headers: ["Colour", "Ratio", "Normal text (AA 4.5)", "Large text (AA 3)"],
          rows: [
            ["#111827", "17.7 : 1", "Pass", "Pass"],
            ["#4b5563", "7.6 : 1", "Pass", "Pass"],
            ["#6b7280", "4.8 : 1", "Pass", "Pass"],
            ["#9ca3af", "2.5 : 1", "Fail", "Fail"],
            ["#6d28d9 (purple)", "7.1 : 1", "Pass", "Pass"],
          ],
        },
      },
      {
        id: "a-ux-alignment-proximity",
        title: "Alignment and proximity",
        explain:
          "Alignment means placing elements along shared edges, so the eye can follow lines through the layout. Left-aligned text is easiest to read in left-to-right languages; centred text suits short headings but not paragraphs or forms. Every element should line up with something. Proximity means related items sit close together and unrelated items sit further apart, so the space itself shows what belongs to what. In a form, a label must be closer to its own field than to the field above it, otherwise people cannot tell which label goes with which field.",
        webLab: {
          task:
            "DesignFest's registration form has hierarchy, contrast, alignment and proximity problems. Fix style.css: make the meta line readable (4.5:1); left-align the labels so labels, fields and buttons share one left edge; make each label closer to its own field than to the field above it; and make Register the clear primary action: a filled button with readable text, taller than 44px, while See the schedule becomes a quiet text link with no fill.",
          files: { "index.html": EVENT_HTML, "style.css": EVENT_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The meta line passes 4.5:1", check: CONTRAST + "return ratio('.meta') >= 4.5;", fail: "#9ca3af on white is about 2.5:1. Try #4b5563." },
            { label: "Labels, fields and the first button share a left edge", check: "const L = rect('input').left; const textLeft = (n) => { const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect().left; }; return $$('label').every((l) => Math.abs(textLeft(l) - L) < 2) && Math.abs(rect('.primary').left - L) < 1;", fail: "text-align: left on the labels." },
            { label: "Each label is closer to its field than to the field above", check: "const ins = $$('input'); return $$('label').slice(1).every((l, i) => { const own = rect(ins[i + 1]).top - rect(l).bottom; const above = rect(l).top - rect(ins[i]).bottom; return own < above; });", fail: "Small margin below labels, larger above: label { margin: 24px 0 6px; }" },
            { label: "Register is a filled, readable primary button at least 44px tall", check: CONTRAST + "const bg = style('.primary', 'background-color'); return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgb(255, 255, 255)' && ratio('.primary') >= 4.5 && rect('.primary').height >= 44;", fail: "Give .primary a strong background, white text and min-height: 48px." },
            { label: "See the schedule is a quiet link: no fill, smaller than Register", check: "return style('.secondary', 'background-color') === 'rgba(0, 0, 0, 0)' && rect('.secondary').height < rect('.primary').height;", fail: "Remove the secondary link's background and big padding." },
          ],
          solution: { "style.css": EVENT_CSS_DONE },
          hint: "Proximity: the space above a label should be several times the space below it.",
          successMessage: "One obvious action, labels that clearly belong to their fields, one strong left edge, and every word readable.",
        },
      },
      {
        id: "a-ux-balance-weight",
        title: "Balance and visual weight",
        explain:
          "Every element has visual weight: larger, darker, more saturated, more detailed and more isolated elements feel heavier. Balance is how that weight is distributed. Symmetrical balance mirrors weight around a centre line: formal and stable, common on landing page heroes. Asymmetrical balance offsets a heavy element with several lighter ones or with empty space: more dynamic, common in dashboards and editorial layouts. An unbalanced screen feels like it is tipping, and draws the eye to the wrong place.",
        decision: {
          scenario: "A hero section has a large, dark product photo on the right and a short headline on the left in small, light text. Testers' eyes go straight to the photo and many never read the headline.",
          question: "What would rebalance it best?",
          options: [
            { id: "a", text: "Give the text more weight: a larger, darker, bolder headline and a strong button, so the two halves balance", why: "Visual weight comes from size, darkness and contrast. Strengthening the text side balances the composition and restores the reading order." },
            { id: "b", text: "Make the photo even bigger", whyWrong: "That tips the balance further." },
            { id: "c", text: "Add a second photo on the left", whyWrong: "That competes with the headline instead of supporting it." },
            { id: "d", text: "Centre everything and remove the photo", whyWrong: "It can work, but removes useful content when a smaller change solves the problem." },
          ],
          correct: "a",
          aftermath: "Balance is about weight, not equal sizes. A small heavy element can balance a large light one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 3.14 – 3.18
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l13-space-grids",
    moduleId: "ux-m3-visual",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.14", "3.15", "3.16", "3.17", "3.18"],
    title: "White Space, Grids and Spacing Systems",
    subtitle: "Space, repetition and structure: the skeleton of a composed interface",
    estimatedMinutes: 28,
    intro:
      "Beginners fill space; professionals use it. This lesson covers white space, consistency, grids and spacing systems: the invisible structure that makes an interface feel calm, organised and deliberate, and that makes it far quicker to design and to build.",

    atoms: [
      {
        id: "a-ux-white-space",
        title: "White space and negative space",
        explain:
          "White space (or negative space) is any empty area between and around elements, whatever its colour. Macro white space separates major sections; micro white space sits between lines, letters and small elements. White space groups related items (by proximity), gives the focal point room to stand out, improves reading speed and comprehension, and makes a product feel calmer and more premium. Crowded screens feel cheap and stressful. The common fear that empty space is wasted is wrong: on phones especially, generous space around tap targets prevents mistakes.",
      },
      {
        id: "a-ux-consistency",
        title: "Consistency and repetition",
        explain:
          "Consistency means the same thing always looks and behaves the same way: every primary button the same colour and shape, every card the same padding, every error message in the same place. Repetition of colours, shapes, spacing and type sizes makes a product feel unified and lets people learn it once. There are two kinds: internal consistency (within your product) and external consistency (with platform conventions and other products people use). Inconsistency makes people wonder whether a difference means something, which slows them down.",
        decision: {
          scenario: "On one page the \"Continue\" button is purple and rounded; on the next it is green and square; on the third it is a text link.",
          question: "What is the cost to users?",
          options: [
            { id: "a", text: "They must re-learn what the main action looks like on every screen, and may wonder whether the differences mean something", why: "Consistent components let people recognise the next step instantly." },
            { id: "b", text: "None: variety keeps users interested", whyWrong: "Variety in core controls creates hesitation, not interest." },
            { id: "c", text: "It only matters to designers", whyWrong: "Users feel it as friction even if they cannot name it." },
            { id: "d", text: "It makes the product more accessible", whyWrong: "Inconsistency makes it harder, especially for people with cognitive disabilities." },
          ],
          correct: "a",
          aftermath: "Design a component once, then reuse it everywhere. Module 12 turns this into a design system.",
        },
      },
      {
        id: "a-ux-grids",
        title: "Grids and layout principles",
        explain:
          "A layout grid divides a screen into columns separated by gutters, inside outer margins. Content spans whole columns, so everything aligns. Common grids: 12 columns on desktop (divisible into 2, 3, 4 or 6 equal parts), 8 on tablets, 4 on phones, with gutters of about 16 to 24px and margins of 16px or more on phones. Other layout principles build on the grid: a clear content width, important content above the fold (visible without scrolling), consistent gutters, and a reading pattern (F for text-heavy pages, Z for simple ones).",
        example:
          "Desktop 1280px: 12 columns, 24px gutters, 80px margins\n  three cards → each spans 4 columns\nTablet 768px:   8 columns, 24px gutters, 32px margins\n  two cards per row → each spans 4 columns\nPhone 375px:    4 columns, 16px gutters, 16px margins\n  one card per row → spans all 4",
      },
      {
        id: "a-ux-spacing-systems",
        title: "Spacing systems",
        explain:
          "A spacing system is a fixed set of spacing values used for every margin, padding and gap. The most common is the 8-point system: 4, 8, 16, 24, 32, 48, 64 (with 4 and 12 for small adjustments). Using only these values makes rhythm consistent, speeds up decisions (\"is it 16 or 24?\" rather than any number), and matches how developers build with tokens. Odd values such as 13px or 22px are almost always accidents. Define the scale once as tokens (--space-1 to --space-6) and use nothing else.",
        webLab: {
          task:
            "The short-courses page was spaced by eye: 13px here, 11px there, one card padded differently from the others. Rebuild style.css on an 8-point spacing system: every padding, margin and gap on the page, title, grid and cards must come from the scale (0, 4, 8, 12, 16, 24, 32, 40, 48 or 64px); all three cards must have identical padding; and lay the cards on a grid: three equal columns with a 24px gutter on a laptop, one full-width column on a phone.",
          files: { "index.html": COURSES_HTML, "style.css": COURSES_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Page, title and card spacing all come from the scale", check: `const scale = ${SCALE}; const ok = (s, prop) => $$(s).every((n) => ${SIDES}.every((side) => scale.includes(Math.round(px(style(n, prop + '-' + side)))))); return ok('.page', 'padding') && ok('.page__title', 'margin') && ok('.card', 'padding') && ok('.card__title', 'margin') && ok('.card__text', 'margin');`, fail: "Replace every odd value: 13px, 18px, 22px, 15px, 21px, 9px, 7px and 19px." },
            { label: "The grid gap comes from the scale", check: `const scale = ${SCALE}; return scale.includes(px(style('.grid', 'row-gap'))) && scale.includes(px(style('.grid', 'column-gap')));`, fail: "Use gap: 24px." },
            { label: "All three cards have identical padding", check: `const p = $$('.card').map((n) => ${SIDES}.map((s) => style(n, 'padding-' + s)).join()); return new Set(p).size === 1;`, fail: "Remove the special rule for the second card." },
            { label: "Laptop: three equal columns with a 24px gutter", check: "const r = $$('.card').map((n) => rect(n)); return Math.abs(r[0].top - r[2].top) < 1 && Math.abs(r[0].width - r[1].width) < 1 && Math.abs(r[1].width - r[2].width) < 1 && Math.round(r[1].left - r[0].right) === 24;", fail: ".grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; } at laptop widths." },
            { label: "Phone: one full-width column", viewport: "mobile", check: "const r = $$('.card').map((n) => rect(n)); const g = rect('.grid'); return r.every((c) => Math.abs(c.width - g.width) < 1) && r[1].top > r[0].bottom && !overflowX();", fail: "Start with one column (grid-template-columns: 1fr) and switch to three in a min-width media query." },
          ],
          solution: { "style.css": COURSES_CSS_DONE },
          hint: "Define --space-1 to --space-6 once, then use only those. For the grid, mobile first: 1fr, then repeat(3, 1fr) from about 900px.",
          successMessage: "Nothing looks dramatically different, yet everything feels calmer: equal cards, equal gutters, and a rhythm built from six numbers.",
        },
      },
      {
        id: "a-ux-composition",
        title: "Introduction to visual composition",
        explain:
          "Composition is how all these principles work together in one screen: a grid gives structure, hierarchy sets the reading order, proximity and white space group content, alignment ties it together, balance distributes weight, contrast makes the focal point and the text clear, and consistency makes it feel like one product. When a screen feels wrong, check these in turn: is there one focal point, does everything align, is related content grouped, is the spacing from the system, is all text readable? Most problems are one of these.",
        example:
          "Composition checklist for any screen\n□ One clear focal point (the squint test)\n□ Everything sits on the grid and shares edges\n□ Related items grouped; groups separated by more space\n□ Spacing only from the scale\n□ All text 4.5:1 or better\n□ Same components look the same everywhere",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l14-style-guide",
    moduleId: "ux-m3-visual",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.P"],
    title: "Practical: A Visual Style Guide",
    subtitle: "Palette, type system, spacing rules and basic elements in one place",
    estimatedMinutes: 34,
    intro:
      "A style guide records a product's visual decisions so that everyone, including your future self, applies them the same way. In this practical you build one: a colour palette, a typography system, spacing rules and the basic interface elements, all built from tokens.",

    atoms: [
      {
        id: "a-ux-style-guide",
        title: "What a visual style guide contains",
        explain:
          "A visual style guide is a reference document for a product's look. It contains: the colour palette with each colour's name, value and job (and its contrast with the backgrounds it sits on); the typography system (typefaces, the type scale, weights and line heights for each level); spacing rules (the scale, and standard padding for components); and the basic interface elements (buttons, inputs, cards) shown in their states. Each decision is named as a token, so designers and developers refer to \"--color-primary\" or \"--space-4\" rather than retyping values. Module 12 grows this into a full design system.",
        table: {
          caption: "The sections of a style guide.",
          headers: ["Section", "Contains", "Example token"],
          rows: [
            ["Colour", "Brand, neutrals, semantic colours, with contrast", "--color-primary: #6d28d9"],
            ["Typography", "Families, scale, weights, line heights", "--font-size-h1: 40px"],
            ["Spacing", "The spacing scale and component padding", "--space-4: 24px"],
            ["Elements", "Buttons, inputs, cards and their states", ".btn--primary"],
          ],
        },
      },
      {
        id: "a-ux-basic-elements",
        title: "Basic interface elements",
        explain:
          "Three elements appear in almost every interface. Buttons: a primary style (filled, high contrast, used once per screen for the main action) and a secondary style (outlined or quiet), at least 44px tall so they are easy to tap, with clear verbs as labels. Inputs: a visible label above, a border with at least 3:1 contrast, enough height (44px or more) and padding, and distinct focus and error states. Cards: a container that groups related content with consistent padding, a subtle border or shadow, and rounded corners that match the buttons. Define each once and reuse it.",
        why: "If you get buttons, inputs and cards right, most of an interface is already consistent.",
      },
      {
        id: "a-ux-style-guide-lab",
        title: "Build the style guide",
        explain:
          "Build the guide entirely from tokens: define the values once in :root, then use var() everywhere else. If a colour or size appears as a raw value in a component rule, it is a decision that has escaped the system.",
        webLab: {
          task:
            "The style guide's HTML is ready; write its CSS. In :root define at least five colour tokens named --color-… (including --color-primary), at least four type-size tokens named --font-size-…, and at least five spacing tokens named --space-… whose values are all on the 8-point scale (4, 8, 12, 16, 24, 32, 40, 48 or 64px). Then style the guide with them: each swatch shows its colour with readable white text (4.5:1); the type samples form a scale (h1 > h2 > body > small, body at least 16px); the primary button is filled and readable, the secondary is outlined with a transparent background, both at least 44px tall; the input is at least 44px tall with a border of at least 3:1 contrast; and the button and swatch rules use var(--color-primary).",
          files: { "index.html": GUIDE_HTML, "style.css": GUIDE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Colour, type and spacing tokens are defined", check: TOKENS + "const v = Object.keys(rootVars()); return v.includes('--color-primary') && v.filter((k) => k.startsWith('--color-')).length >= 5 && v.filter((k) => k.startsWith('--font-size-')).length >= 4 && v.filter((k) => k.startsWith('--space-')).length >= 5;", fail: "Define --color-primary and four more --color- tokens, four --font-size- tokens and five --space- tokens." },
            { label: "Every spacing token is on the 8-point scale", check: TOKENS + "const v = rootVars(); const s = Object.keys(v).filter((k) => k.startsWith('--space-')); return s.length >= 5 && s.every((k) => [4, 8, 12, 16, 24, 32, 40, 48, 64].includes(parseFloat(v[k])) && /px$/.test(v[k]));", fail: "Use values such as 4px, 8px, 16px, 24px and 32px." },
            { label: "Each swatch shows its colour with readable white text", check: CONTRAST + "const s = $$('.swatch'); return s.length === 5 && s.every((n) => style(n, 'background-color') !== 'rgba(0, 0, 0, 0)' && contrast(style(n, 'color'), style(n, 'background-color')) >= 4.5) && new Set(s.map((n) => style(n, 'background-color'))).size === 5;", fail: "Give each .swatch--name its colour token as a background; dark enough for white text." },
            { label: "The type samples form a scale", check: "const fs = ['.type-h1', '.type-h2', '.type-body', '.type-small'].map((s) => px(style(s, 'font-size'))); return fs[0] > fs[1] && fs[1] > fs[2] && fs[2] > fs[3] && fs[2] >= 16;", fail: "h1 > h2 > body > small, with body at least 16px." },
            { label: "Primary filled, secondary outlined, both readable and 44px tall", check: CONTRAST + "const p = style('.btn--primary', 'background-color'); return p !== 'rgba(0, 0, 0, 0)' && ratio('.btn--primary') >= 4.5 && style('.btn--secondary', 'background-color') === 'rgba(0, 0, 0, 0)' && style('.btn--secondary', 'border-top-style') === 'solid' && ratio('.btn--secondary') >= 4.5 && $$('.btn').every((b) => rect(b).height >= 44);", fail: "Filled primary, transparent outlined secondary, min-height: 44px on .btn." },
            { label: "The input is at least 44px tall with a 3:1 border", check: "return rect('.field').height >= 44 && contrast(style('.field', 'border-top-color'), 'rgb(255, 255, 255)') >= 3;", fail: "Give .field min-height: 44px and a mid-grey border such as var(--color-muted)." },
            { label: "Buttons and swatches use the primary token", check: String.raw`const c = code('style.css'); return /\.btn--primary\s*\{[^}]*var\(--color-primary\)/.test(c) && /\.swatch--primary\s*\{[^}]*var\(--color-primary\)/.test(c);`, fail: "Write background: var(--color-primary) in .btn--primary and .swatch--primary." },
          ],
          solution: { "style.css": GUIDE_CSS_DONE },
          hint: "Start with :root: colours first, then sizes, then spacing. Only then write the rules, using var() for every value you defined.",
          successMessage: "A complete visual style guide, every value named once and used everywhere. Change --color-primary and the whole guide follows.",
        },
      },
    ],

    task: {
      title: "Module 3 practical: create a visual style guide",
      intro: "Build your own style guide in Figma for a product idea of your choice (or the one from Module 2).",
      prompts: [
        "A colour palette: primary, its tint, neutrals for text and surfaces, and success, warning and error colours, each labelled with its value and contrast ratio.",
        "A typography system: one or two typefaces, a type scale of at least five sizes with weights and line heights for each.",
        "Spacing rules: an 8-point spacing scale and the padding used for buttons, inputs and cards.",
        "Basic interface elements: primary and secondary buttons, a text input with label, and a card, each shown in its default state.",
        "Check every text and background pair with a contrast checker, and fix anything below 4.5:1.",
      ],
      closing: "Phase 2 starts with Module 4: understanding the people you are designing for.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
