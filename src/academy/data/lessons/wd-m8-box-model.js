/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 8 · THE CSS BOX MODEL
 *
 * Curriculum 8.1 – 8.10. Every element is a box: content, padding, border
 * and margin. box-sizing, widths and their limits, margin collapsing,
 * overflow, the units (px, %, em, rem and viewport units), and how to debug
 * spacing and replace it with a system. Checks measure the real rendered
 * boxes with getBoundingClientRect, at the width each one names.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s8-box";

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

const BOX_HTML = page(
  "Ijebu Garri Co.",
  `  <header class="hero">
    <h1>Ijebu Garri Co.</h1>
  </header>
  <main class="content">
    <p>We have sold garri from Ijebu-Ode since 1987. Every bag is dried in the sun and sieved twice, so it soaks evenly and never turns sour. Ask any customer.</p>
    <div class="card">
      <h2>White garri, 5kg</h2>
      <p>₦6,500</p>
    </div>
  </main>`
);

const BOX_CSS = `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  background: #fef3c7;
  padding: 16px;
}

.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #d97706;
}
`;

const BOX_CSS_DONE = `*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  background: #fef3c7;
  padding: 16px;
  min-height: 200px;
}

.content {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 16px;
}

.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #d97706;
}
`;

const UNITS_HTML = page(
  "Code Lagos",
  `  <section class="hero">
    <h1>Code Lagos</h1>
    <p>Free coding meetups, every second Thursday.</p>
    <a class="btn" href="join.html">Join us</a>
    <a class="btn btn--big" href="join.html">Join us</a>
  </section>
  <main>
    <pre class="snippet">const message = "Welcome to Code Lagos, where everyone writes their first line of JavaScript together";</pre>
  </main>`
);

const UNITS_CSS = `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  background: #1e1b4b;
  color: white;
  padding: 24px;
}

.btn {
  display: inline-block;
  padding: 12px 20px;
  background: #facc15;
  color: #1e1b4b;
}

.btn--big {
  font-size: 1.5rem;
}

.snippet {
  background: #f3f4f6;
  padding: 16px;
}
`;

const UNITS_CSS_DONE = `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  min-height: 100vh;
  background: #1e1b4b;
  color: white;
  padding: 24px;
}

.btn {
  display: inline-block;
  padding: 0.75em 1.25em;
  background: #facc15;
  color: #1e1b4b;
}

.btn--big {
  font-size: 1.5rem;
}

.snippet {
  background: #f3f4f6;
  padding: 16px;
  overflow-x: auto;
}
`;

const SPACE_HTML = page(
  "Events",
  `  <main class="events">
    <h1>Upcoming events</h1>
    <article class="event">
      <h2>Tech meetup</h2>
      <p>Thursday, Yaba</p>
    </article>
    <article class="event">
      <h2>Design workshop</h2>
      <p>Saturday, Ikeja</p>
    </article>
  </main>`
);

const SPACE_CSS = `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.events {
  padding: 13px 27px;
}

.event {
  margin-bottom: 19px;
  padding: 11px;
  border: 1px solid #d1d5db;
}

.event h2 {
  margin: 0 0 7px;
}
`;

const SPACE_CSS_DONE = `:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.events {
  padding: var(--space-3) var(--space-4);
}

.event {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  border: 1px solid #d1d5db;
}

.event h2 {
  margin: 0 0 var(--space-2);
}
`;

const SCALE = "[0, 4, 8, 16, 24, 32, 48]";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 8.1 – 8.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l31-box",
    moduleId: "wd-m8-box-model",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3", "8.4"],
    title: "The Box Model and Sizing",
    subtitle: "Content, padding, border and margin, and how wide a box really is",
    estimatedMinutes: 22,
    intro:
      "Every element on a page is a rectangle. Once you can see the four layers of that rectangle and know how its size is calculated, almost every spacing and sizing mystery in CSS has an obvious answer.",

    atoms: [
      {
        id: "a-wd-box-layers",
        title: "Content, padding, border and margin",
        explain:
          "Each box has four layers, from the inside out. The content is the text or image. Padding is space inside the box, around the content, and shows the box's background. The border is a line around the padding. Margin is space outside the border, pushing other boxes away, and is always transparent. Padding and margin each take one to four values, clockwise from the top: margin: 10px 20px means 10px top and bottom, 20px left and right.",
        example:
          "┌──────────── margin (transparent, outside) ────────────┐\n│  ┌──────────── border ────────────────────────────┐   │\n│  │  ┌──────── padding (shows background) ──────┐  │   │\n│  │  │           content: text, image          │  │   │\n│  │  └──────────────────────────────────────────┘  │   │\n│  └────────────────────────────────────────────────┘   │\n└───────────────────────────────────────────────────────┘\n\npadding: 10px;             all four sides\npadding: 10px 20px;        top/bottom, left/right\npadding: 10px 20px 5px 0;  top, right, bottom, left (clockwise)",
        why: "In the Elements panel of the developer tools, the box-model diagram shows these four layers for the selected element, with their real sizes. It is the fastest way to see where a gap comes from.",
      },
      {
        id: "a-wd-box-sizing",
        title: "Understanding box-sizing",
        explain:
          "By default (box-sizing: content-box), width sets only the content, and padding and border are added on top: a 300px-wide card with 20px padding and a 2px border is really 344px wide. With box-sizing: border-box, width includes padding and border, so 300px means 300px. Almost every modern project sets border-box on every element at the top of the stylesheet.",
        example:
          "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.card { width: 300px; padding: 20px; border: 2px solid; }\n\ncontent-box:  300 + 20 + 20 + 2 + 2 = 344px wide\nborder-box:   300px wide, content shrinks to 256px",
        decision: {
          scenario: "Two cards are meant to sit side by side in a 600px container, each with width: 50%, padding: 16px and a 1px border. The second card keeps dropping below the first.",
          question: "What is the cause?",
          options: [
            { id: "a", text: "With content-box sizing each card is 50% plus 34px, so together they are wider than the container; box-sizing: border-box fixes it", why: "300 + 32 + 2 = 334px each, 668px together. Border-box makes width include padding and border, so each is exactly 300px." },
            { id: "b", text: "The container is too small and must be made wider", whyWrong: "Making the container wider moves the problem; at any width, 50% plus padding exceeds half." },
            { id: "c", text: "Borders cannot be used on side-by-side boxes", whyWrong: "They can; they just need to be counted in the width." },
            { id: "d", text: "width: 50% does not work on cards", whyWrong: "It works; it sets only the content width under content-box." },
          ],
          correct: "a",
          aftermath: "Put the border-box rule at the top of every stylesheet you write from now on.",
        },
      },
      {
        id: "a-wd-width-height",
        title: "Width and height",
        explain:
          "Block elements are as wide as their container by default, and as tall as their content. Setting width fixes the width; setting height fixes the height, which is risky for anything containing text, because text that grows (on a small screen, or when a visitor enlarges it) overflows a fixed height. Let height come from the content almost always, and size with widths and limits instead.",
        mistake: "height: 200px on a box of text. On a phone the text wraps onto more lines, spills out of the box and covers whatever is below.",
      },
      {
        id: "a-wd-min-max",
        title: "min-width, max-width and min-height",
        explain:
          "Limits are the responsive alternative to fixed sizes. max-width lets a box shrink on small screens but stops it growing too wide on large ones: a text column with max-width: 640px and margin: 0 auto is centred and never has lines too long to read. min-height gives a box a minimum height that can still grow with its content, which is the safe way to make a hero section tall. min-width stops something getting too narrow to use.",
        webLab: {
          task:
            "Fix the sizing on this page. (1) Add the border-box rule for every element so the card is truly 300px wide, padding and border included. (2) Limit .content to a max-width of 640px and centre it with auto side margins. (3) Make the hero at least 200px tall using min-height, so it can still grow, not height.",
          files: { "index.html": BOX_HTML, "style.css": BOX_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Every element uses box-sizing: border-box", check: "return ['body', '.card', 'p', 'h1'].every((s) => style(s, 'box-sizing') === 'border-box');", fail: "Add *, *::before, *::after { box-sizing: border-box; } at the top." },
            { label: "The card is exactly 300px wide, padding and border included", check: "return Math.round(rect('.card').width) === 300;", fail: "The card is wider than 300px because padding and border are added. Use border-box." },
            { label: "On a laptop, the content column is at most 640px wide and centred", check: "const r = rect('.content'); return r.width <= 641 && r.width >= 600 && Math.abs(r.left - (width() - r.right)) <= 2;", fail: ".content { max-width: 640px; margin: 0 auto; }" },
            { label: "On a phone, the column shrinks to fit: no sideways scrolling", viewport: "mobile", check: "return !overflowX() && rect('.content').width <= 375;", fail: "Use max-width, not width, so the column can shrink on a phone." },
            { label: "The hero is at least 200px tall using min-height, not height", check: "return rect('.hero').height >= 200 && px(style('.hero', 'min-height')) >= 200 && !rules('.hero').some((r) => r.style.height);", fail: "Give .hero min-height: 200px; and no fixed height." },
          ],
          solution: { "style.css": BOX_CSS_DONE },
          hint: "max-width plus margin: 0 auto is the standard way to centre a column.",
          successMessage: "Switch the preview between phone and laptop: the column shrinks on the phone and stops at a readable width on the laptop, and the card is exactly the width you asked for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 8.5 – 8.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l32-units-overflow",
    moduleId: "wd-m8-box-model",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.5", "8.6", "8.7", "8.8"],
    title: "Margin Collapsing, Overflow and CSS Units",
    subtitle: "Surprising gaps, content too big for its box, and which unit to use",
    estimatedMinutes: 22,
    intro:
      "Three things trip up every beginner: margins that do not add up, content that bursts out of its box, and a bewildering choice of units. This lesson settles all three.",

    atoms: [
      {
        id: "a-wd-margin-collapse",
        title: "Margin collapsing",
        explain:
          "When two vertical margins meet, they do not add: the larger one wins. A paragraph with margin-bottom: 20px followed by one with margin-top: 30px are 30px apart, not 50px. A child's top margin can also collapse through its parent and push the parent down, which is why a heading's margin sometimes appears outside its coloured section. Collapsing happens only to vertical margins in normal flow; padding, a border, or a flex or grid parent stops it.",
        example:
          "p.first  { margin-bottom: 20px; }\np.second { margin-top: 30px; }\n\nGap between them: 30px   (not 50px: the larger margin wins)\n\n.section { background: lightyellow; }      ← the h2's margin escapes above it\n.section h2 { margin-top: 24px; }\n\nFix: .section { padding-top: 1px; }  or  display: flow-root;  or use padding",
      },
      {
        id: "a-wd-overflow",
        title: "overflow and clipping",
        explain:
          "When content is bigger than its box, overflow decides what happens. visible (the default) lets it spill out. hidden clips it. scroll always shows scrollbars. auto shows a scrollbar only when needed. overflow-x: auto on a code block or a wide table lets that one element scroll sideways, instead of the whole page. Use hidden carefully: clipped content cannot be reached at all.",
        table: {
          caption: "overflow values.",
          headers: ["Value", "Content that does not fit"],
          rows: [
            ["visible", "Spills outside the box (the default)"],
            ["hidden", "Is cut off and cannot be reached"],
            ["scroll", "Can be scrolled; scrollbars always shown"],
            ["auto", "Can be scrolled; scrollbars only when needed"],
          ],
        },
      },
      {
        id: "a-wd-units",
        title: "The difference between px, %, em and rem",
        explain:
          "px is a fixed unit. % is relative to the parent (for width, the parent's width). em is relative to the element's own font size, so padding in em grows when the text grows: a big button gets proportionally bigger padding. rem is relative to the root font size (normally 16px) and does not compound when nested, so it is the best default for font sizes and spacing.",
        table: {
          caption: "Units, and what each is good for.",
          headers: ["Unit", "Relative to", "Good for"],
          rows: [
            ["px", "Nothing: fixed", "Borders, shadows, small fixed details"],
            ["%", "The parent", "Widths inside a container"],
            ["em", "This element's font size", "Padding on buttons and badges that should scale with their text"],
            ["rem", "The root font size", "Font sizes and the spacing scale"],
          ],
        },
      },
      {
        id: "a-wd-viewport-units",
        title: "Viewport units",
        explain:
          "Viewport units are relative to the browser window: 1vw is 1% of its width and 1vh 1% of its height. min-height: 100vh makes a section at least as tall as the screen. On phones the browser's toolbar slides in and out, so 100vh can be slightly taller than what is visible; the newer dvh (dynamic viewport height) units follow the visible area.",
        webLab: {
          task:
            "Fix four unit problems. (1) Make the hero fill at least the whole screen height with a viewport unit. (2) The buttons' padding is in px, so the big button's padding does not grow with its text: change .btn's padding to em so it scales. (3) The code snippet is wider than a phone and makes the whole page scroll sideways: let only the snippet scroll, with overflow-x: auto.",
          files: { "index.html": UNITS_HTML, "style.css": UNITS_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The hero is at least as tall as the screen", check: "return rect('.hero').height >= window.innerHeight - 1 && /vh|dvh|svh|lvh/.test(rules('.hero').map((r) => r.cssText).join(' '));", fail: "Give .hero min-height: 100vh;" },
            { label: "Button padding is in em, so the big button's padding is bigger", check: "const a = px(style('.btn:not(.btn--big)', 'padding-left')); const b = px(style('.btn--big', 'padding-left')); return /em/.test(rules('.btn').map((r) => r.style.padding).join(' ')) && b > a * 1.3;", fail: "Write .btn's padding in em, for example padding: 0.75em 1.25em;" },
            { label: "On a phone, the page does not scroll sideways", viewport: "mobile", check: "return !overflowX();", fail: "The snippet pushes the page wider than the phone. Add overflow-x: auto to .snippet." },
            { label: "On a phone, the snippet itself scrolls", viewport: "mobile", check: "const s = $('.snippet'); return ['auto', 'scroll'].includes(style(s, 'overflow-x')) && s.scrollWidth > s.clientWidth;", fail: ".snippet needs overflow-x: auto so it scrolls on its own." },
          ],
          solution: { "style.css": UNITS_CSS_DONE },
          hint: "In em, 0.75em of 16px text is 12px, and of 24px text is 18px: the padding follows the text.",
          successMessage: "Look at the phone preview: the page fits, the snippet scrolls on its own, the hero fills the screen, and the big button's padding grew with its text.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 8.9 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l33-spacing",
    moduleId: "wd-m8-box-model",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.9", "8.10"],
    title: "Debugging Spacing and Spacing Systems",
    subtitle: "Finding where a gap comes from, and never guessing a number again",
    estimatedMinutes: 18,
    intro:
      "Uneven spacing is the most common reason a page looks amateur, and \"where is this gap coming from?\" is one of the most common questions a developer asks. Both have systematic answers.",

    atoms: [
      {
        id: "a-wd-debug-spacing",
        title: "Debugging unexpected spacing",
        explain:
          "Never guess at spacing. Inspect the element: the box-model diagram in the Elements panel shows its margin, border and padding, and hovering it highlights them on the page in colour. Common culprits are browser defaults (body margin, heading and paragraph margins, list padding), collapsing margins, whitespace between inline-block elements, and an image's default inline alignment leaving a gap under it. A temporary * { outline: 1px solid red; } shows every box at once without changing the layout.",
        table: {
          caption: "Gaps and their usual causes.",
          headers: ["Symptom", "Usual cause", "Fix"],
          rows: [
            ["Gap around the whole page", "body's default 8px margin", "body { margin: 0; }"],
            ["Gap above a coloured section", "A child's top margin collapsing through", "Padding on the section, or display: flow-root"],
            ["Small gap under an image", "Images are inline and sit on the text baseline", "img { display: block; }"],
            ["Lists indented oddly", "Default padding-left on ul and ol", "Set padding-left explicitly"],
          ],
        },
        decision: {
          scenario: "There is a 4px gap under every photo in your card grid that you never added.",
          question: "What is the most likely cause and fix?",
          options: [
            { id: "a", text: "Images are inline by default and sit on the text baseline, leaving room for descenders; img { display: block; } removes it", why: "The gap is the space reserved below the baseline for letters like g and y. Block images have no baseline." },
            { id: "b", text: "The images are the wrong size", whyWrong: "The gap appears whatever the image's size." },
            { id: "c", text: "A bug in the browser", whyWrong: "It is standard inline layout behaviour, the same in every browser." },
            { id: "d", text: "Add margin-bottom: -4px to every image", whyWrong: "That hides the symptom and breaks if the font size changes." },
          ],
          correct: "a",
          aftermath: "img { display: block; max-width: 100%; } is in most base stylesheets for this reason (max-width is Module 10).",
        },
      },
      {
        id: "a-wd-spacing-system",
        title: "Building consistent spacing systems",
        explain:
          "Professional designs do not use random numbers like 13px and 27px. They pick a small scale, such as 4, 8, 16, 24, 32 and 48 pixels, and use only those values for every margin, padding and gap. Store the scale as variables. Related things sit closer together and separate groups further apart, and because every value comes from the same scale, the page has a visible rhythm.",
        example:
          ":root {\n  --space-1: 4px;\n  --space-2: 8px;\n  --space-3: 16px;\n  --space-4: 24px;\n  --space-5: 32px;\n}\n\n.card       { padding: var(--space-3); margin-bottom: var(--space-4); }\n.card h2    { margin: 0 0 var(--space-2); }   /* title close to its text */",
        webLab: {
          task:
            "Every spacing value here was guessed: 13px, 27px, 19px, 11px, 7px. Replace them with a spacing scale. Define spacing variables on :root (at least four, all from the scale 4, 8, 16, 24, 32, 48), then use var() for every padding and margin in .events, .event and .event h2, so that every spacing value on the page comes from the scale.",
          files: { "index.html": SPACE_HTML, "style.css": SPACE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "At least four spacing variables are defined on :root, all from the scale", check: `const scale = ${SCALE}; const vars = rules(':root').flatMap((r) => [...r.style]).filter((p) => p.startsWith('--')); const vals = vars.map((v) => px(getComputedStyle(document.documentElement).getPropertyValue(v))); return vars.length >= 4 && vals.every((v) => scale.includes(v));`, fail: "On :root define variables such as --space-2: 8px; --space-3: 16px; using only 4, 8, 16, 24, 32 or 48." },
            { label: "The spacing rules use var() instead of raw numbers", check: "const c = rules(/\\.event|\\.events/).map((r) => r.cssText).join(' '); return (c.match(/var\\(--/g) || []).length >= 4 && !/\\b(13|27|19|11|7)px/.test(code('style.css'));", fail: "Replace every guessed value in .events, .event and .event h2 with var(--space-…)." },
            { label: "Every margin and padding on the page is a value from the scale", check: `const scale = ${SCALE}; const sides = ['top','right','bottom','left']; return $$('.events, .event, .event h2, .event p').every((e) => sides.every((s) => scale.includes(px(style(e, 'padding-' + s))) && (e.matches('.event p') || scale.includes(px(style(e, 'margin-' + s))))));`, fail: "Some margin or padding is not 0, 4, 8, 16, 24, 32 or 48px." },
          ],
          solution: { "style.css": SPACE_CSS_DONE },
          hint: "13px rounds to 16, 27 to 24, 19 to 24, 11 to 16 and 7 to 8. Name them once on :root.",
          successMessage: "The page looks calmer, and you can say why: every gap comes from one scale, and changing the scale changes the whole page's rhythm at once.",
        },
      },
    ],

    task: {
      title: "Module project: a readable article layout",
      intro: "Take the article from the Phase 1 projects and give it a proper box-model foundation.",
      prompts: [
        "Start the stylesheet with the border-box rule and img { display: block; max-width: 100%; }.",
        "Centre the article in a column with max-width: 680px and auto margins.",
        "Make a header section at least 60vh tall using min-height.",
        "Define a spacing scale on :root and use only its variables for margins and paddings.",
        "Inspect three gaps in the developer tools and write down where each one came from.",
      ],
      closing: "Next module puts boxes side by side with Flexbox and Grid.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
