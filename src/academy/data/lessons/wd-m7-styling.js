/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 7 · COLORS, TYPOGRAPHY AND STYLING
 *
 * Curriculum 7.1 – 7.10. Colour formats, backgrounds and gradients, fonts and
 * font stacks, size, weight, line height, alignment and decoration, web
 * fonts, borders, radius, shadows, links and buttons, and CSS variables as
 * design tokens.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s7-styling";

const page = (title, body, extraHead = "") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
${extraHead}  <link rel="stylesheet" href="style.css">
</head>
<body>
${body}
</body>
</html>
`;

const HERO_HTML = page(
  "Sunset Lounge",
  `  <section class="hero">
    <div class="overlay">
      <h1>Sunset Lounge</h1>
      <p>Live music every Friday on Victoria Island.</p>
    </div>
  </section>`
);

const HERO_CSS_DONE = `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  padding: 48px 24px;
  background-color: #7c2d12;
  background-image: linear-gradient(135deg, #f97316, #7c2d12);
}

.overlay {
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.35);
  color: hsl(40, 100%, 96%);
}

h1 {
  color: #ffffff;
}
`;

const TYPE_HTML = page(
  "Lagos Reads",
  `  <header class="site-header">
    <nav>
      <a href="index.html">Home</a>
      <a href="clubs.html">Book clubs</a>
    </nav>
  </header>
  <main>
    <h1>Lagos Reads</h1>
    <p class="lead">A monthly book club for people who love African fiction.</p>
    <p>This month we are reading <a href="book.html">Half of a Yellow Sun</a> by Chimamanda Ngozi Adichie. Meetings are on the last Saturday of the month.</p>
  </main>`,
  `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap">
`
);

const TYPE_CSS_DONE = `body {
  margin: 0;
  padding: 16px;
  font-family: "Merriweather", Georgia, serif;
  font-size: 1rem;
  line-height: 1.6;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.lead {
  font-size: 1.25rem;
  text-align: center;
}

nav a {
  text-decoration: none;
}
`;

const CARD_HTML = page(
  "Pricing",
  `  <main>
    <article class="card">
      <h2>Starter website</h2>
      <p class="price">₦150,000</p>
      <p>Five pages, mobile friendly, delivered in two weeks.</p>
      <a class="btn" href="order.html">Order now</a>
    </article>
  </main>`
);

const CARD_CSS_DONE = `:root {
  --color-primary: #0f766e;
  --color-text: #1f2937;
  --radius: 12px;
  --shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

body {
  font-family: Arial, sans-serif;
  color: var(--color-text);
  padding: 24px;
}

.card {
  max-width: 320px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.btn {
  display: inline-block;
  padding: 14px 20px;
  border-radius: var(--radius);
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
}

.btn:hover {
  background-color: #115e59;
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 7.1 – 7.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l28-colour",
    moduleId: "wd-m7-styling",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2"],
    title: "Colour, Backgrounds and Gradients",
    subtitle: "Four ways to write a colour, and backgrounds from flat to gradient",
    estimatedMinutes: 17,
    intro:
      "Colour is the first thing anyone notices about a page and the easiest thing to get wrong. This lesson covers how colours are written, when to use each format, and how to build backgrounds that keep text readable.",

    atoms: [
      {
        id: "a-wd-colour-formats",
        title: "Named colors, HEX, RGB and HSL",
        explain:
          "CSS accepts colours in several formats that all describe the same thing. Named colours (red, teal, white) are quick but limited. HEX (#0f766e) is the most common, copied from design tools. RGB (rgb(15, 118, 110)) mixes red, green and blue light from 0 to 255. HSL (hsl(175, 77%, 26%)) describes hue (a position on the colour wheel, 0 to 360), saturation and lightness, which makes it the easiest to adjust by hand: same hue, lighter shade. Add transparency with a fourth value: rgba(0, 0, 0, 0.5) or #00000080.",
        table: {
          caption: "One teal, four ways.",
          headers: ["Format", "Teal", "Best for"],
          rows: [
            ["Named", "teal", "Quick tests"],
            ["HEX", "#0f766e", "Copying from a design file"],
            ["RGB", "rgb(15, 118, 110)", "Adding transparency: rgba(15, 118, 110, 0.5)"],
            ["HSL", "hsl(175, 77%, 26%)", "Making lighter or darker shades: change only the last number"],
          ],
        },
        why: "Browsers report computed colours as rgb(), which is why the checks in these labs compare rgb values even when you write HEX.",
      },
      {
        id: "a-wd-backgrounds",
        title: "Backgrounds and gradients",
        explain:
          "background-color fills an element. background-image can hold a picture, url(images/hero.jpg), or a gradient, which is a generated image: linear-gradient(135deg, #f97316, #7c2d12) blends from one colour to another along an angle; radial-gradient blends outward from a point. Always set a background-color too, as a fallback while an image loads. To keep text readable over a busy image or gradient, put a semi-transparent dark layer behind the text.",
        example:
          ".hero {\n  background-color: #7c2d12;                                  /* fallback */\n  background-image: linear-gradient(135deg, #f97316, #7c2d12);\n}\n\n.photo-hero {\n  background: url(images/hero.jpg) center / cover no-repeat;   /* shorthand */\n}",
        webLab: {
          task:
            "Style the lounge's hero. Give .hero a fallback background-color and a linear-gradient background-image from orange to dark brown (any two colours). Give .overlay a semi-transparent black background, using rgba with an alpha below 1, so the text stays readable, and set its text colour with an hsl() value. Make the h1 white using HEX.",
          files: { "index.html": HERO_HTML, "style.css": "body {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}\n" },
          readOnly: ["index.html"],
          tests: [
            { label: ".hero has a linear gradient background image", check: "return /linear-gradient/.test(style('.hero', 'background-image'));", fail: "Give .hero background-image: linear-gradient(135deg, #f97316, #7c2d12);" },
            { label: ".hero also has a fallback background-color", check: "const c = style('.hero', 'background-color'); return c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent';", fail: "Add background-color to .hero as a fallback." },
            { label: ".overlay has a semi-transparent black background", check: "const m = style('.overlay', 'background-color').match(/rgba\\(0, 0, 0, ([0-9.]+)\\)/); return !!m && Number(m[1]) > 0 && Number(m[1]) < 1;", fail: "Use background-color: rgba(0, 0, 0, 0.35); on .overlay." },
            { label: "The overlay's text colour is written in hsl()", check: "return rules('.overlay').some((r) => /hsla?\\(/.test(r.cssText)) || /hsla?\\(/.test(code('style.css'));", fail: "Set .overlay's color with hsl(), for example hsl(40, 100%, 96%)." },
            { label: "The heading is white, written in HEX", check: "return style('h1', 'color') === 'rgb(255, 255, 255)' && /#fff(fff)?\\b/i.test(code('style.css'));", fail: "Give h1 color: #ffffff;" },
          ],
          solution: { "style.css": HERO_CSS_DONE },
          hint: "The overlay is a box inside the hero: its rgba background darkens whatever is behind it.",
          successMessage: "A gradient with a fallback, and text that stays readable because a translucent layer sits between it and the colour. You used three colour formats on one small component.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 7.3 – 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l29-typography",
    moduleId: "wd-m7-styling",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.3", "7.4", "7.5", "7.6"],
    title: "Typography",
    subtitle: "Font stacks, sizes, weight, line height, alignment and web fonts",
    estimatedMinutes: 22,
    intro:
      "Most of a website is text, so typography is most of its design. Good type is not fancy: it is readable at every size, has a clear hierarchy, and loads quickly. This lesson covers all of it.",

    atoms: [
      {
        id: "a-wd-font-stacks",
        title: "Font families and font stacks",
        explain:
          "font-family takes a list, called a font stack. The browser uses the first font it has, so list your preferred font first, then similar fallbacks, and always end with a generic family (serif, sans-serif, monospace) that every device has. Names with spaces go in quotes. A system font stack (system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif) uses each device's own interface font: fast, and familiar to its owner.",
        example:
          "font-family: \"Merriweather\", Georgia, serif;\n             ▲ wanted     ▲ similar   ▲ always available\n\nfont-family: system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;",
      },
      {
        id: "a-wd-font-size-weight",
        title: "Font size, weight and line height",
        explain:
          "font-size sets text size; use rem units (relative to the root size, normally 16px) so text scales when visitors enlarge it in their browser settings. font-weight runs from 100 to 900: 400 is normal, 700 is bold, and a font must include a weight for it to look right. line-height sets the space between lines: about 1.5 to 1.7 for body text, tighter (about 1.2) for large headings. Write line-height without a unit so it scales with the font size.",
        table: {
          caption: "A simple type scale.",
          headers: ["Element", "font-size", "line-height", "font-weight"],
          rows: [
            ["Body text", "1rem (16px)", "1.6", "400"],
            ["Lead paragraph", "1.25rem (20px)", "1.5", "400"],
            ["h2", "1.75rem (28px)", "1.25", "700"],
            ["h1", "2.5rem (40px)", "1.2", "700"],
          ],
        },
        mistake: "Body text below 16px on phones. It forces people to zoom, and iOS zooms the whole page when a form field's text is smaller than 16px.",
      },
      {
        id: "a-wd-text-align-decoration",
        title: "Text alignment and decoration",
        explain:
          "text-align sets horizontal alignment: left (the default, and best for paragraphs), center (fine for short headings and hero text), right, and justify (avoid on the web: it leaves rivers of uneven gaps). text-decoration adds or removes lines: links are underlined by default, and the underline is how people recognise links in a paragraph, so keep it there; remove it only where context makes a link obvious, such as a navigation bar. text-transform: uppercase changes case without changing the HTML.",
        example:
          "h1   { text-align: center; }\nnav a { text-decoration: none; }        /* clearly a menu */\nmain a { text-decoration: underline; }  /* keep in body text */\n.label { text-transform: uppercase; letter-spacing: 0.05em; }",
      },
      {
        id: "a-wd-web-fonts",
        title: "Google Fonts and custom fonts",
        explain:
          "Web fonts are downloaded fonts. Google Fonts gives you a <link> to paste into the head; include only the weights you use, because each one is a download, and keep display=swap in the URL so text shows in a fallback font immediately instead of staying invisible while the font loads. For your own font files, @font-face declares the font's name and file, then you use that name in font-family.",
        example:
          "In the head:\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap\">\n\nYour own file:\n@font-face {\n  font-family: \"Brand Sans\";\n  src: url(\"fonts/brand-sans.woff2\") format(\"woff2\");\n  font-display: swap;\n}",
        webLab: {
          task:
            "The page already loads Merriweather from Google Fonts. Use it: give body a font stack that starts with \"Merriweather\" and ends with the generic serif, a font-size of 1rem and a unitless line-height of at least 1.5. Make the h1 2.5rem, weight 700, line height about 1.2 and centred; centre the .lead paragraph too. Remove the underline from the nav links only; links in the paragraph keep theirs.",
          files: { "index.html": TYPE_HTML, "style.css": "body {\n  margin: 0;\n  padding: 16px;\n}\n" },
          readOnly: ["index.html"],
          tests: [
            { label: "body uses a stack starting with Merriweather and ending with serif", check: "const f = style('body', 'font-family'); return /^\"?Merriweather/.test(f) && /serif$/.test(f) && !/sans-serif$/.test(f);", fail: "body { font-family: \"Merriweather\", Georgia, serif; }" },
            { label: "Body text is 1rem with a line height of at least 1.5", check: "const r = rules('body').find((x) => x.style.lineHeight); return style('p:not(.lead)', 'font-size') === '16px' && !!r && /^[0-9.]+$/.test(r.style.lineHeight) && Number(r.style.lineHeight) >= 1.5;", fail: "Give body font-size: 1rem and a unitless line-height such as 1.6." },
            { label: "The h1 is 2.5rem, bold and tight (line height 1.1 to 1.3)", check: "const lh = px(style('h1', 'line-height')) / px(style('h1', 'font-size')); return style('h1', 'font-size') === '40px' && Number(style('h1', 'font-weight')) === 700 && lh >= 1.1 && lh <= 1.3;", fail: "h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }" },
            { label: "The h1 and the lead paragraph are centred", check: "return style('h1', 'text-align') === 'center' && style('.lead', 'text-align') === 'center';", fail: "Add text-align: center to h1 and .lead." },
            { label: "Nav links have no underline, but the paragraph's link keeps it", check: "return $$('nav a').every((a) => style(a, 'text-decoration-line') === 'none') && style('main p a', 'text-decoration-line') === 'underline';", fail: "Use nav a { text-decoration: none; } so only the navigation loses its underline." },
          ],
          solution: { "style.css": TYPE_CSS_DONE },
          hint: "In the preview Merriweather appears if you are online; the checks only need the stack to be right. 1rem is 16px; 2.5rem is 40px.",
          successMessage: "A readable type system: a proper stack with fallbacks, a scale in rem, comfortable line height, and underlines kept where they tell people something is a link.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 7.7 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l30-borders-tokens",
    moduleId: "wd-m7-styling",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.7", "7.8", "7.9", "7.10"],
    title: "Borders, Shadows, Buttons and Design Tokens",
    subtitle: "Shape, depth and interactive styles, all driven by variables",
    estimatedMinutes: 22,
    intro:
      "Cards, buttons and panels are where colour and type come together. This lesson gives them shape and depth, styles links and buttons so people know they can press them, and introduces the CSS variables that keep a whole design consistent.",

    atoms: [
      {
        id: "a-wd-borders-radius",
        title: "Borders and border radius",
        explain:
          "border takes a width, a style and a colour: border: 1px solid #e5e7eb. Each side can be set alone (border-bottom). border-radius rounds the corners: 8 to 12px for cards and buttons gives a modern look, 999px makes a pill shape, and 50% on a square makes a circle, which is how round profile photos are made.",
        example:
          ".card   { border: 1px solid #e5e7eb; border-radius: 12px; }\n.tag    { border-radius: 999px; }        /* pill */\n.avatar { border-radius: 50%; }           /* circle, on a square image */\n.alert  { border-left: 4px solid #dc2626; }",
      },
      {
        id: "a-wd-shadows",
        title: "Shadows and visual depth",
        explain:
          "box-shadow adds a shadow: horizontal offset, vertical offset, blur, (optional spread) and colour, as in 0 6px 18px rgba(0, 0, 0, 0.12). Soft, low-opacity shadows look natural; hard black ones look dated. Shadows show that something is raised and can be interacted with, which is why buttons often gain a bigger shadow on hover. text-shadow does the same for text, but use it sparingly.",
        example:
          "box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);     /* subtle: resting card */\nbox-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);    /* raised: hovered card */\nbox-shadow: 0 0 0 3px rgba(15, 118, 110, 0.4); /* a focus ring */",
      },
      {
        id: "a-wd-links-buttons",
        title: "Styling links and buttons",
        explain:
          "Links and buttons have states, styled with pseudo-classes: :hover when a pointer is over them, :focus-visible when reached with the keyboard (Module 11 covers it fully), :active while pressed, and :visited for links already followed. A link styled as a button (a call to action) still needs a clear text label, enough padding to be an easy tap target (at least 44 by 44 pixels), and a hover state that changes more than colour alone.",
        table: {
          caption: "States to style.",
          headers: ["State", "When", "Typical change"],
          rows: [
            [":hover", "Pointer over it", "Darker background, bigger shadow"],
            [":focus-visible", "Reached by keyboard", "A clear outline or ring"],
            [":active", "Being pressed", "Slightly darker, pressed in"],
            [":visited", "A link already followed", "A muted colour (links only)"],
          ],
        },
      },
      {
        id: "a-wd-css-variables",
        title: "CSS variables and design tokens",
        explain:
          "A CSS variable (a custom property) is a name you define once and use everywhere: --color-primary: #0f766e; then color: var(--color-primary). Define site-wide values on :root, the top of the document, so every element can use them. Design teams call these named values design tokens: the brand colours, radii, shadows and spacing that make every component feel like one design. Change a token once and the whole site follows.",
        example:
          ":root {\n  --color-primary: #0f766e;\n  --radius: 12px;\n  --shadow: 0 6px 18px rgba(0, 0, 0, 0.12);\n}\n\n.btn  { background: var(--color-primary); border-radius: var(--radius); }\n.card { border-radius: var(--radius); box-shadow: var(--shadow); }",
        webLab: {
          task:
            "Style the pricing card from a set of tokens. On :root define --color-primary, --radius and --shadow. Use them: the card gets the radius (at least 8px), the shadow and a 1px solid border; the price uses the primary colour; the button is a link styled as a button, with the primary colour as its background, white text, no underline, the radius, padding that makes it at least 44px tall, and a :hover rule.",
          files: { "index.html": CARD_HTML, "style.css": "body {\n  font-family: Arial, sans-serif;\n  padding: 24px;\n}\n" },
          readOnly: ["index.html"],
          tests: [
            { label: ":root defines --color-primary, --radius and --shadow", check: "const cs = getComputedStyle(document.documentElement); return ['--color-primary', '--radius', '--shadow'].every((v) => cs.getPropertyValue(v).trim().length > 0);", fail: "Add a :root rule defining all three custom properties." },
            { label: "The card uses var(--radius) and var(--shadow), with a 1px solid border", check: "const r = rules('.card').map((x) => x.cssText).join(' '); return /var\\(--radius\\)/.test(r) && /var\\(--shadow\\)/.test(r) && px(style('.card', 'border-top-left-radius')) >= 8 && style('.card', 'box-shadow') !== 'none' && style('.card', 'border-top-style') === 'solid' && style('.card', 'border-top-width') === '1px';", fail: ".card needs border: 1px solid …; border-radius: var(--radius); box-shadow: var(--shadow);" },
            { label: "The price and the button background use the primary colour", check: "const p = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(); const probe = document.createElement('i'); probe.style.color = p; document.body.append(probe); const want = style(probe, 'color'); probe.remove(); return style('.price', 'color') === want && style('.btn', 'background-color') === want && /var\\(--color-primary\\)/.test(code('style.css'));", fail: "Use var(--color-primary) for .price's color and .btn's background-color." },
            { label: "The button has white text and no underline", check: "return style('.btn', 'color') === 'rgb(255, 255, 255)' && style('.btn', 'text-decoration-line') === 'none';", fail: ".btn { color: white; text-decoration: none; }" },
            { label: "The button is an easy tap target: at least 44px tall", check: "return rect('.btn').height >= 44;", fail: "Give .btn display: inline-block and enough padding, such as 14px 20px." },
            { label: "The button has a :hover style", check: "return rules(/\\.btn:hover/).length > 0;", fail: "Add a .btn:hover rule, for example a darker background." },
          ],
          solution: { "style.css": CARD_CSS_DONE },
          hint: "Custom properties start with two hyphens and are read with var(). An inline link needs display: inline-block for its padding to give it height.",
          successMessage: "Change --color-primary in the preview to any colour and watch the price and the button change together. That is what design tokens buy you on a site with a hundred components.",
        },
      },
    ],

    task: {
      title: "Module project: a styled pricing section",
      intro: "Build a three-card pricing section for a service you could sell: websites, tutoring, catering.",
      prompts: [
        "Define tokens on :root: at least a primary colour, a text colour, a radius, a shadow and a font stack.",
        "Load one Google Font with only the weights you use and display=swap.",
        "Three cards with a border, the radius and the shadow; the middle card marked as most popular with a different background.",
        "Each card has a call-to-action link styled as a button with :hover and :active states.",
        "Change the primary colour token once and confirm every button and price follows.",
      ],
      closing: "Module 9 puts the three cards side by side; Module 10 makes them stack on phones.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
