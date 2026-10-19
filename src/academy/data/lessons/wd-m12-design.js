/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 12 · DESIGN IMPLEMENTATION
 *
 * Curriculum 12.1 – 12.10. Hierarchy, contrast and whitespace, colour systems
 * and type pairing, reading a design specification and building it, icons
 * and SVG, reusable components, form error states and cross-browser testing.
 * Contrast is checked with the WCAG formula on the browser's computed colours.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s12-design";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
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
body { margin: 0; line-height: 1.5; }
img { display: block; max-width: 100%; height: auto; }
`;

const HIER_HTML = page(
  "Kaduna Solar",
  `  <main class="promo">
    <h1>Power your home with the sun</h1>
    <p class="lead">Solar kits for homes and shops in Kaduna, installed in a day.</p>
    <p class="fine">Prices include installation and a two-year warranty.</p>
    <a class="btn" href="quote.html">Get a free quote</a>
  </main>`
);

const HIER_CSS = `${BASE}
body {
  font-family: Arial, sans-serif;
  background: #ffffff;
}

.promo {
  padding: 13px;
}

h1 {
  font-family: "Comic Sans MS", cursive;
  font-size: 18px;
  color: #9ca3af;
}

.lead {
  font-family: "Courier New", monospace;
  font-size: 17px;
  color: #a3a3a3;
}

.fine {
  font-family: Georgia, serif;
  font-size: 16px;
  color: #b0b0b0;
}

.btn {
  display: inline-block;
  padding: 14px 20px;
  background: #fde047;
  color: #ffffff;
  text-decoration: none;
}
`;

const HIER_CSS_DONE = `${BASE}
:root {
  --font-heading: Georgia, serif;
  --font-body: Arial, sans-serif;
  --text: #111827;
  --muted: #4b5563;
  --brand: #a16207;
}

body {
  font-family: var(--font-body);
  background: #ffffff;
  color: var(--text);
}

.promo {
  max-width: 640px;
  padding: 32px 16px;
}

h1 {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 0 0 16px;
  color: var(--text);
}

.lead {
  font-size: 1.25rem;
  margin: 0 0 8px;
  color: var(--text);
}

.fine {
  font-size: 0.875rem;
  margin: 0 0 24px;
  color: var(--muted);
}

.btn {
  display: inline-block;
  padding: 14px 20px;
  background: var(--brand);
  color: #ffffff;
  text-decoration: none;
}
`;

const MOCK_HTML = page(
  "Join the class",
  `  <section class="signup">
    <svg class="icon" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" focusable="false">
      <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7.5L4.5 6 12 2.5 19.5 6 12 9.5ZM5 10v5c0 2 3.1 4 7 4s7-2 7-4v-5l-7 3.5L5 10Z" fill="currentColor"/>
    </svg>
    <h2 class="signup__title">Join the next coding class</h2>
    <p class="signup__text">Twelve weeks, every Saturday, in Yaba.</p>
    <a class="signup__cta" href="apply.html">Apply now</a>
  </section>`
);

const MOCK_CSS_DONE = `${BASE}
body { font-family: Arial, sans-serif; }

.signup {
  max-width: 560px;
  margin: 32px auto;
  padding: 32px;
  border-radius: 16px;
  background: #ecfdf5;
  text-align: center;
}

.icon {
  display: block;
  margin: 0 auto 16px;
  color: #047857;
}

.signup__title {
  margin: 0 0 8px;
  font-size: 1.75rem;
  color: #064e3b;
}

.signup__text {
  margin: 0 0 24px;
  color: #374151;
}

.signup__cta {
  display: inline-block;
  padding: 14px 28px;
  border-radius: 999px;
  background: #047857;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
}
`;

const SPEC = [
  ["Section", "max-width 560px, centred, 32px padding, 16px radius, background #ecfdf5, text centred"],
  ["Icon", "32 × 32, centred, colour #047857 (it uses currentColor), 16px below it"],
  ["Title", "1.75rem (28px), colour #064e3b, 8px below it"],
  ["Text", "16px, colour #374151, 24px below it"],
  ["Button", "pill (999px radius), background #047857, white bold text, 14px × 28px padding, no underline"],
];

const ERR_HTML = page(
  "Checkout",
  `  <form class="form" action="/pay" method="post" novalidate>
    <div class="field field--error">
      <label for="card">Card number</label>
      <input id="card" name="card" type="text" inputmode="numeric" aria-invalid="true">
      <p class="field__error" id="card-error">Enter the 16 digits on the front of your card.</p>
    </div>
    <div class="field">
      <label for="name">Name on card</label>
      <input id="name" name="name" type="text">
    </div>
    <button class="btn btn--primary" type="submit">Pay ₦12,500</button>
    <button class="btn btn--ghost" type="button">Cancel</button>
  </form>`
);

const ERR_CSS = `${BASE}
body { font-family: Arial, sans-serif; padding: 24px; }

.field { margin-bottom: 16px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { width: 100%; max-width: 360px; padding: 10px; border: 1px solid #9ca3af; border-radius: 6px; }
`;

const ERR_CSS_DONE = `${BASE}
body { font-family: Arial, sans-serif; padding: 24px; }

.field { margin-bottom: 16px; }
.field label { display: block; margin-bottom: 4px; font-weight: 700; }
.field input { width: 100%; max-width: 360px; padding: 10px; border: 1px solid #9ca3af; border-radius: 6px; }

/* Error state: colour AND words AND an icon-like marker, never colour alone */
.field input[aria-invalid="true"] {
  border: 2px solid #b91c1c;
}

.field__error {
  margin: 4px 0 0;
  color: #b91c1c;
  font-size: 0.875rem;
}

.field__error::before {
  content: "⚠ ";
}

/* Reusable buttons: one base, two modifiers */
.btn {
  display: inline-block;
  min-height: 44px;
  padding: 10px 20px;
  border-radius: 8px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.btn--primary {
  border: 2px solid #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}

.btn--ghost {
  border: 2px solid #1d4ed8;
  background: transparent;
  color: #1d4ed8;
}

/* Progressive enhancement: only where the browser supports it */
@supports (accent-color: auto) {
  .form { accent-color: #1d4ed8; }
}
`;

const ERR_HTML_DONE = ERR_HTML.replace('aria-invalid="true">', 'aria-invalid="true" aria-describedby="card-error">');

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 12.1 – 12.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l48-hierarchy",
    moduleId: "wd-m12-design",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3", "12.4"],
    title: "Hierarchy, Contrast, Whitespace and Type",
    subtitle: "Why some pages are easy to read and others are not",
    estimatedMinutes: 24,
    intro:
      "You do not need to be a designer to implement design well, but you do need to see what designers see. This lesson explains the principles that make a page clear, and gives you a way to check them with numbers rather than taste.",

    atoms: [
      {
        id: "a-wd-layout-hierarchy",
        title: "Understanding layout hierarchy",
        explain:
          "Layout hierarchy is the order in which the eye moves through a page. People scan in predictable patterns: on text-heavy pages an F shape (across the top, then down the left), on simpler pages a Z (top left, top right, diagonally across, bottom). Put the most important thing where the eye lands first, group related things together, and align everything to a few shared edges so the page reads as organised rather than scattered.",
      },
      {
        id: "a-wd-visual-hierarchy",
        title: "Visual hierarchy and contrast",
        explain:
          "Visual hierarchy tells the reader what matters most through size, weight, colour and position: the h1 should be clearly the biggest thing, the main call to action the most noticeable colour. Contrast is also a hard accessibility requirement. WCAG asks for a contrast ratio of at least 4.5:1 between normal text and its background, and 3:1 for large text (about 24px, or 19px bold). Pale grey text on white, and white text on yellow, both fail.",
        table: {
          caption: "Contrast ratios against white.",
          headers: ["Text colour", "Ratio", "Normal text"],
          rows: [
            ["#111827 (near black)", "17.7 : 1", "Passes"],
            ["#4b5563 (mid grey)", "7.6 : 1", "Passes"],
            ["#9ca3af (light grey)", "2.5 : 1", "Fails"],
            ["White text on #fde047 (yellow)", "1.3 : 1", "Fails badly"],
          ],
        },
        why: "About one in twelve men has some colour vision deficiency, and everyone reads phones in sunlight. Contrast is how text survives both.",
      },
      {
        id: "a-wd-whitespace",
        title: "Whitespace and spacing consistency",
        explain:
          "Whitespace is the empty space between and around elements, and it is not wasted: it groups related items (closer together) and separates groups (further apart), which is called the principle of proximity. Use your spacing scale from Module 8, more space above a heading than below it so it belongs to the text it introduces, and generous padding around the main content. Crowded pages feel cheap and are harder to read.",
      },
      {
        id: "a-wd-colour-type-pairing",
        title: "Color systems and typography pairing",
        explain:
          "A colour system is a small, named palette: a brand colour, one or two accents, a set of neutral greys for text and backgrounds, and semantic colours for success, warning and error, each with tints for hover and backgrounds. Typography pairing means choosing at most two families: often a distinctive one for headings and a very readable one for body text, such as a serif with a sans-serif. More than two looks chaotic; three different families on one small promotion is a common beginner mistake.",
        webLab: {
          task:
            "This solar company's promotion breaks every principle in this lesson. Fix it: use at most two font families (one for the heading, one for body text); make the h1 at least twice the size of the lead text; make every piece of text pass WCAG contrast (4.5:1) against white; make the button's text pass 4.5:1 against the button; and replace the guessed 13px padding with values from a scale (8, 16, 24 or 32).",
          files: { "index.html": HIER_HTML, "style.css": HIER_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "No more than two font families are used", check: "const f = new Set(['h1', '.lead', '.fine', '.btn', 'body'].map((s) => style(s, 'font-family').split(',')[0].replace(/['\"]/g, '').trim())); return f.size <= 2;", fail: "Use one family for headings and one for everything else." },
            { label: "The heading is at least twice the size of the lead text", check: "return px(style('h1', 'font-size')) >= 2 * px(style('.lead', 'font-size'));", fail: "Make h1 much bigger, for example 2.5rem, with .lead at 1.25rem." },
            { label: "Heading, lead and fine print all pass 4.5:1 against white", check: "return ['h1', '.lead', '.fine'].every((s) => contrast(style(s, 'color'), 'rgb(255, 255, 255)') >= 4.5);", fail: "The grey text is too pale. Use colours such as #111827 and #4b5563." },
            { label: "The button text passes 4.5:1 against the button", check: "return contrast(style('.btn', 'color'), style('.btn', 'background-color')) >= 4.5;", fail: "White on yellow is about 1.3:1. Use a dark text colour on yellow, or white on a dark brand colour." },
            { label: "The promo's padding comes from the scale", check: "const scale = [0, 8, 16, 24, 32, 48]; return ['top', 'right', 'bottom', 'left'].every((s) => scale.includes(px(style('.promo', 'padding-' + s))));", fail: "Replace padding: 13px with values such as 32px 16px." },
          ],
          solution: { "style.css": HIER_CSS_DONE },
          hint: "Contrast is about lightness: dark text on a light background, or light text on a dark one. Yellow is light, so it needs dark text.",
          successMessage: "Same words, same layout, and now one thing clearly matters most, everything can be read in sunlight, and the button can be read by everyone.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 12.5 – 12.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l49-mockups",
    moduleId: "wd-m12-design",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.5", "12.6", "12.7"],
    title: "From Mockup to Code, with Icons and SVG",
    subtitle: "Reading a design, building it to specification, and using icons properly",
    estimatedMinutes: 24,
    intro:
      "Most front-end work starts from a design made in a tool like Figma. Your job is to turn it into HTML and CSS that look the same, and that also work at sizes, states and content lengths the design never showed.",

    atoms: [
      {
        id: "a-wd-reading-design",
        title: "Reading a design reference",
        explain:
          "Before writing code, read the design for its system, not just its pixels. Find the colours, fonts, sizes and spacing it uses repeatedly and turn them into tokens. Measure distances (Figma shows them when you hold Alt and hover). Note what it does not show and ask: how does this look on a phone, with a very long name, when loading, when empty, when there is an error? A good developer asks these questions before the client has to.",
        table: {
          caption: "Questions to ask of every design.",
          headers: ["Question", "Why"],
          rows: [
            ["What are the repeated colours, sizes and spacings?", "They become tokens"],
            ["What does it look like at 320px and 1440px?", "Most designs show one width"],
            ["What happens with twice as much text?", "Real content is longer than mockup content"],
            ["What are the hover, focus, error, empty and loading states?", "Designs often show only the happy path"],
          ],
        },
      },
      {
        id: "a-wd-mockup-to-code",
        title: "Converting a mockup into HTML and CSS",
        explain:
          "Work in a fixed order. First write the HTML from the content and its meaning, ignoring how it looks. Then set the tokens. Then lay out the big boxes (mobile first), then style the components, then states. Compare with the design side by side as you go. Build to the design's intent rather than its exact pixels: if the mockup has a 31px gap where everything else uses 32, it is almost certainly meant to be 32.",
        table: {
          caption: "Specification for the sign-up section you are about to build.",
          headers: ["Part", "Specification"],
          rows: SPEC,
        },
      },
      {
        id: "a-wd-icons-svg",
        title: "Using icons and SVGs",
        explain:
          "SVG (scalable vector graphics) describes images as shapes, so icons stay sharp at any size and on any screen. Inline SVG can be coloured with CSS: fill=\"currentColor\" makes the icon use the text colour of its parent. An icon next to text that says the same thing is decorative: give it aria-hidden=\"true\" (and focusable=\"false\" for old browsers). An icon on its own, such as a search button, needs an accessible name on its button.",
        example:
          "<button>\n  <svg aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">\n    <path d=\"…\" fill=\"currentColor\"/>\n  </svg>\n  Download\n</button>\n\n.btn { color: white; }   /* the icon turns white too */",
        webLab: {
          task:
            "Build the sign-up section to the specification table above. The HTML is written; the class names follow BEM. The icon is an inline SVG that uses currentColor, so its colour comes from CSS.",
          files: { "index.html": MOCK_HTML, "style.css": `${BASE}\nbody { font-family: Arial, sans-serif; }\n` },
          readOnly: ["index.html"],
          tests: [
            { label: "Section: at most 560px wide and centred, with 32px padding and 16px radius", check: "const r = rect('.signup'); return r.width <= 561 && r.width >= 540 && Math.abs(r.left - (width() - r.right)) < 2 && style('.signup', 'padding-top') === '32px' && style('.signup', 'border-top-left-radius') === '16px';", fail: ".signup { max-width: 560px; margin: 32px auto; padding: 32px; border-radius: 16px; }" },
            { label: "Section: pale green background and centred text", check: "return style('.signup', 'background-color') === 'rgb(236, 253, 245)' && style('.signup', 'text-align') === 'center';", fail: "background: #ecfdf5; text-align: center;" },
            { label: "Icon: 32 × 32, centred, green (#047857), 16px above the title", check: "const i = rect('.icon'), s = rect('.signup'), t = rect('.signup__title'); return Math.round(i.width) === 32 && Math.abs((i.left + i.width / 2) - (s.left + s.width / 2)) < 2 && style('.icon', 'color') === 'rgb(4, 120, 87)' && Math.round(t.top - i.bottom) === 16;", fail: ".icon { display: block; margin: 0 auto 16px; color: #047857; } and .signup__title { margin-top: 0; }" },
            { label: "Title: 28px, dark green (#064e3b), 8px above the text", check: "return style('.signup__title', 'font-size') === '28px' && style('.signup__title', 'color') === 'rgb(6, 78, 59)' && Math.round(rect('.signup__text').top - rect('.signup__title').bottom) === 8;", fail: ".signup__title { margin: 0 0 8px; font-size: 1.75rem; color: #064e3b; } and remove .signup__text's top margin." },
            { label: "Text: #374151, 24px above the button", check: "return style('.signup__text', 'color') === 'rgb(55, 65, 81)' && Math.round(rect('.signup__cta').top - rect('.signup__text').bottom) === 24;", fail: ".signup__text { margin: 0 0 24px; color: #374151; } (the button must be inline-block)." },
            { label: "Button: green pill, white bold text, 14px × 28px padding, no underline", check: "return style('.signup__cta', 'background-color') === 'rgb(4, 120, 87)' && style('.signup__cta', 'color') === 'rgb(255, 255, 255)' && Number(style('.signup__cta', 'font-weight')) >= 700 && style('.signup__cta', 'padding-top') === '14px' && style('.signup__cta', 'padding-left') === '28px' && px(style('.signup__cta', 'border-top-left-radius')) >= 999 && style('.signup__cta', 'text-decoration-line') === 'none';", fail: "Follow the button row of the specification exactly." },
            { label: "On a phone the section still fits", viewport: "mobile", check: "return !overflowX();", fail: "Use max-width, not width, for the section." },
          ],
          solution: { "style.css": MOCK_CSS_DONE },
          hint: "Default margins on h2 and p get in the way of exact spacing: set every margin explicitly, as the spec does.",
          successMessage: "Built to specification, measured to the pixel by the checks, and it still works on a phone, which the specification never mentioned.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 12.8 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l50-components-errors",
    moduleId: "wd-m12-design",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.8", "12.9", "12.10"],
    title: "Reusable Components, Error States and Cross-Browser Testing",
    subtitle: "Building once and reusing, designing for when things go wrong, and checking every browser",
    estimatedMinutes: 24,
    intro:
      "Real interfaces are built from a handful of components used everywhere, they spend a surprising amount of time showing errors, and they run in browsers you do not use yourself. This lesson covers all three.",

    atoms: [
      {
        id: "a-wd-reusable-components",
        title: "Creating reusable cards and buttons",
        explain:
          "A reusable component has a base class holding everything every variant shares, and modifier classes for what differs: .btn sets the size, radius, font and focus ring; .btn--primary and .btn--ghost set only the colours. A component should not care where it is placed: no margins pushing on its neighbours, and widths set by its container. Then the same .card works in a grid, a sidebar or a modal.",
        example:
          ".btn          { min-height: 44px; padding: 10px 20px; border-radius: 8px; font-weight: 700; }\n.btn--primary { background: #1d4ed8; color: #fff; border: 2px solid #1d4ed8; }\n.btn--ghost   { background: transparent; color: #1d4ed8; border: 2px solid #1d4ed8; }\n\n<button class=\"btn btn--primary\">Pay</button>\n<button class=\"btn btn--ghost\">Cancel</button>",
      },
      {
        id: "a-wd-error-states",
        title: "Form and error-state design",
        explain:
          "A field with an error needs three things. A visible change that does not rely on colour alone (a thicker border plus an icon or the word Error), because colour-blind users may not see red. A message that says how to fix it (\"Enter the 16 digits on the front of your card\", not \"Invalid input\"), placed next to the field. And the right attributes: aria-invalid=\"true\" on the input and aria-describedby pointing at the message's id, so a screen reader reads the message when the field is focused.",
        decision: {
          scenario: "A checkout form marks an invalid card number with a red border and nothing else.",
          question: "What is wrong?",
          options: [
            { id: "a", text: "Colour alone carries the message: colour-blind and screen-reader users get no error, and nobody is told how to fix it", why: "Add a written message saying how to fix it, a non-colour marker, aria-invalid and aria-describedby." },
            { id: "b", text: "Red is the wrong shade", whyWrong: "No shade of red alone is enough." },
            { id: "c", text: "Nothing: red means error everywhere", whyWrong: "Not to people who cannot distinguish red, or cannot see the screen." },
            { id: "d", text: "The border should be green", whyWrong: "Green suggests success, and colour alone is still the problem." },
          ],
          correct: "a",
          aftermath: "WCAG 1.4.1: colour must not be the only way information is conveyed.",
        },
      },
      {
        id: "a-wd-cross-browser",
        title: "Cross-browser visual testing",
        explain:
          "Your visitors use Chrome, Safari (every iPhone browser uses Safari's engine), Firefox, Samsung Internet and Edge. Check new CSS features on caniuse.com before relying on them. Use @supports to apply an enhancement only where it works, so other browsers get a good, simpler page instead of a broken one: progressive enhancement. Test the real site in at least Chrome and Safari (or a BrowserStack-style service) and on one Android and one iPhone before launch.",
        example:
          "/* Everyone gets a solid background */\n.panel { background: #ffffff; }\n\n/* Browsers that support it get frosted glass */\n@supports (backdrop-filter: blur(8px)) {\n  .panel { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); }\n}",
        webLab: {
          task:
            "Finish this checkout form. (1) Style the error state: input[aria-invalid=\"true\"] gets a 2px red border, and .field__error is red text with a ⚠ marker added by ::before, so colour is not the only signal. (2) In the HTML, connect the card input to its message with aria-describedby. (3) Build the buttons as one .btn base (at least 44px tall, rounded, bold) with .btn--primary (filled) and .btn--ghost (outlined, transparent) modifiers. (4) Add one @supports rule as a progressive enhancement, such as accent-color on the form.",
          files: { "index.html": ERR_HTML, "style.css": ERR_CSS },
          tests: [
            { label: "The invalid input has a 2px red border", check: "const c = style('#card', 'border-top-color').match(/\\d+/g).map(Number); return style('#card', 'border-top-width') === '2px' && c[0] > 150 && c[1] < 80 && c[2] < 80;", fail: ".field input[aria-invalid=\"true\"] { border: 2px solid #b91c1c; }" },
            { label: "The error message is red, readable, and has a non-colour marker", check: "const c = style('.field__error', 'color'); return contrast(c, 'rgb(255, 255, 255)') >= 4.5 && /^rgb\\((1[5-9]\\d|2\\d\\d),/.test(c) && /⚠/.test(pseudo('.field__error', '::before', 'content'));", fail: ".field__error { color: #b91c1c; } and .field__error::before { content: \"⚠ \"; }" },
            { label: "The card input is described by its error message", check: "const id = $('#card').getAttribute('aria-describedby'); return !!id && document.getElementById(id) === $('.field__error');", fail: "Add aria-describedby=\"card-error\" to the card input." },
            { label: "Both buttons share a .btn base: at least 44px tall, rounded, bold", check: "return $$('.btn').every((b) => rect(b).height >= 44 && px(style(b, 'border-top-left-radius')) >= 4 && Number(style(b, 'font-weight')) >= 700);", fail: ".btn { min-height: 44px; border-radius: 8px; font-weight: 700; … }" },
            { label: "Primary is filled; ghost is outlined and transparent", check: "const p = style('.btn--primary', 'background-color'); return p !== 'rgba(0, 0, 0, 0)' && style('.btn--ghost', 'background-color') === 'rgba(0, 0, 0, 0)' && style('.btn--ghost', 'border-top-style') === 'solid' && contrast(style('.btn--primary', 'color'), p) >= 4.5;", fail: ".btn--primary { background: #1d4ed8; color: #fff; } .btn--ghost { background: transparent; border: 2px solid #1d4ed8; }" },
            { label: "An @supports rule adds a progressive enhancement", check: "return /@supports/.test(code('style.css'));", fail: "Add, for example, @supports (accent-color: auto) { .form { accent-color: #1d4ed8; } }" },
          ],
          solution: { "style.css": ERR_CSS_DONE, "index.html": ERR_HTML_DONE },
          hint: "The attribute selector is input[aria-invalid=\"true\"]. Modifiers set only what differs from the base.",
          successMessage: "An error that works for everyone, two buttons from one component, and an enhancement that cannot break older browsers.",
        },
      },
    ],

    task: {
      title: "Module project: implement a sign-up page from a description",
      intro: "Treat this description as a mockup and build it.",
      prompts: [
        "A two-column hero on laptops (text left, image right) that stacks on phones, with a clear visual hierarchy: one h1, one primary button.",
        "A colour system of brand, neutral and semantic colours as tokens, with every text colour passing 4.5:1.",
        "Three feature cards built from one reusable .card component with an SVG icon each, using currentColor and aria-hidden.",
        "A sign-up form with labelled fields, an error state that does not rely on colour alone, and a primary and a ghost button.",
        "Test in two browsers and on a real phone, and note one difference you found.",
      ],
      closing: "Phase 2's projects use every technique from Modules 7 to 13. You are ready for them.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
