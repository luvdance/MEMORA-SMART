/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 9 · LAYOUT AND POSITIONING
 *
 * Curriculum 9.1 – 9.12. Normal flow and display, Flexbox (axes, alignment,
 * wrapping and flexible sizing), CSS Grid (tracks, gaps and placement),
 * choosing between them, positioning and stacking. The checks measure where
 * boxes actually land, with getBoundingClientRect, at laptop and phone widths.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s9-layout";

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
body { margin: 0; font-family: Arial, sans-serif; }
img { display: block; max-width: 100%; }
`;

const DISPLAY_HTML = page(
  "Tech Tips",
  `  <nav class="menu">
    <a href="index.html">Home</a>
    <a href="tips.html">Tips</a>
    <a href="about.html">About</a>
  </nav>
  <main>
    <h1>Tech Tips</h1>
    <p>Tags: <span class="tag">phones</span> <span class="tag">battery</span></p>
    <p class="hidden">This draft note should not be visible.</p>
  </main>`
);

const DISPLAY_CSS_DONE = `${BASE}
.menu a {
  display: inline-block;
  padding: 14px 16px;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: #e0e7ff;
}

.hidden {
  display: none;
}
`;

const FLEX_HTML = page(
  "Naija Eats",
  `  <header class="site-header">
    <p class="logo">Naija Eats</p>
    <nav>
      <ul class="nav-list">
        <li><a href="menu.html">Menu</a></li>
        <li><a href="order.html">Order</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section class="cards">
      <article class="card"><h2>Suya</h2><p>Spicy grilled beef.</p></article>
      <article class="card"><h2>Moi moi</h2><p>Steamed bean pudding.</p></article>
      <article class="card"><h2>Puff-puff</h2><p>Sweet fried dough.</p></article>
    </section>
  </main>`
);

const FLEX_CSS = `${BASE}
.site-header {
  padding: 16px;
  background: #14532d;
  color: white;
}

.site-header a { color: white; }

.nav-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cards {
  padding: 16px;
}

.card {
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
`;

const FLEX_CSS_DONE = `${BASE}
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #14532d;
  color: white;
}

.site-header a { color: white; }

.nav-list {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
}

.card {
  flex: 1 1 240px;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
`;

const GRID_HTML = page(
  "Gallery",
  `  <main>
    <h1>Our work</h1>
    <section class="gallery">
      <img class="featured" src="images/hero.jpg" alt="A finished living room in warm colours" width="1600" height="900">
      <img src="images/product.jpg" alt="A carved wooden stool" width="800" height="800">
      <img src="images/product-2.jpg" alt="A woven raffia basket" width="800" height="800">
      <img src="images/product-3.jpg" alt="A beaded table lamp" width="800" height="800">
      <img src="images/team.jpg" alt="The workshop team at their benches" width="1200" height="800">
    </section>
  </main>`
);

const GRID_CSS_DONE = `${BASE}
main { padding: 16px; }

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured {
  grid-column: span 2;
}
`;

const POS_HTML = page(
  "Shop",
  `  <header class="site-header">
    <p>Ada's Shoes</p>
  </header>
  <main>
    <article class="card">
      <span class="badge">Sale</span>
      <img src="images/product.jpg" alt="Brown leather sandals" width="800" height="800">
      <h2>Leather sandals</h2>
    </article>
    <p class="filler">Scroll down for more products.</p>
  </main>
  <div class="toast">Added to cart</div>`
);

const POS_CSS = `${BASE}
.site-header {
  padding: 12px 16px;
  background: #111827;
  color: white;
  z-index: 10;
}

main { padding: 16px; }

.card {
  max-width: 280px;
  border: 1px solid #e5e7eb;
}

.badge {
  padding: 4px 10px;
  background: #dc2626;
  color: white;
}

.filler { height: 1500px; }

.toast {
  padding: 12px 16px;
  background: #065f46;
  color: white;
}
`;

const POS_CSS_DONE = `${BASE}
.site-header {
  position: sticky;
  top: 0;
  padding: 12px 16px;
  background: #111827;
  color: white;
  z-index: 10;
}

main { padding: 16px; }

.card {
  position: relative;
  max-width: 280px;
  border: 1px solid #e5e7eb;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  background: #dc2626;
  color: white;
}

.filler { height: 1500px; }

.toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 20;
  padding: 12px 16px;
  background: #065f46;
  color: white;
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 9.1 – 9.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l34-flow-display",
    moduleId: "wd-m9-layout",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3"],
    title: "Normal Flow and display",
    subtitle: "How boxes arrange themselves before you touch them, and how to change it",
    estimatedMinutes: 18,
    intro:
      "Before any layout tool, the browser already arranges every box by a set of rules called normal flow. Every layout technique in this module is a way of changing those rules, so they come first.",

    atoms: [
      {
        id: "a-wd-normal-flow",
        title: "Normal document flow",
        explain:
          "In normal flow, block boxes (headings, paragraphs, divs, sections) stack top to bottom, each as wide as its container. Inline content (text, links, spans, images) runs left to right inside a line and wraps onto the next line when it runs out of room. Elements appear in the order they are in the HTML. A well-structured page already reads correctly in normal flow, which is exactly what a phone shows when everything is in one column.",
        example:
          "Block boxes stack:             Inline content flows:\n┌──────────── h1 ───────────┐  ┌────────────────── p ─────────────┐\n└───────────────────────────┘  │ Text with a <a>link</a> and <b>b │\n┌──────────── p ────────────┐  │ old</b> words that wrap onto the │\n└───────────────────────────┘  │ next line.                       │\n┌────────── section ────────┐  └──────────────────────────────────┘\n└───────────────────────────┘",
        why: "Mobile-first design (Module 10) starts from normal flow: on a phone most pages are one column, which normal flow gives you for free.",
      },
      {
        id: "a-wd-display",
        title: "display and element behavior",
        explain:
          "The display property decides how a box behaves. block, inline and inline-block control flow; flex and grid turn the box into a layout container for its children; none removes it entirely, from the screen and from screen readers. Each element has a default (div is block, span is inline), and CSS can change it without changing the element's meaning.",
        table: {
          caption: "The display values you will use.",
          headers: ["Value", "Behaves like"],
          rows: [
            ["block", "Starts a new line, fills the width, accepts width and height"],
            ["inline", "Flows within text; ignores width, height and vertical margins"],
            ["inline-block", "Flows within text, but accepts width, height and all padding"],
            ["flex", "A container that lays its children out in a row or column"],
            ["grid", "A container that lays its children out in rows and columns"],
            ["none", "Not displayed at all, and hidden from assistive technology"],
          ],
        },
      },
      {
        id: "a-wd-block-inline",
        title: "Block, inline and inline-block elements",
        explain:
          "Inline elements ignore width, height and vertical margins, and their vertical padding overlaps neighbouring lines. That is why padding on a plain link does not make it taller in the layout. inline-block keeps the element in the line but lets it take full box sizing, which makes a navigation link a proper, tappable target. Use display: none to hide something completely; hiding with visibility: hidden keeps the empty space.",
        webLab: {
          task:
            "Three display fixes. (1) Make the menu links inline-block with 14px 16px padding so they are proper tap targets at least 44px tall. (2) Leave the tags inline (they are part of a sentence) but give them a pill shape. (3) Hide the draft note completely with display: none.",
          files: { "index.html": DISPLAY_HTML, "style.css": BASE },
          readOnly: ["index.html"],
          tests: [
            { label: "Menu links are inline-block", check: "return $$('.menu a').every((a) => style(a, 'display') === 'inline-block');", fail: ".menu a { display: inline-block; }" },
            { label: "Menu links are at least 44px tall", check: "return $$('.menu a').every((a) => rect(a).height >= 44);", fail: "Give .menu a padding: 14px 16px; (with inline-block, padding adds height)." },
            { label: "The links still sit side by side on one line", check: "const r = $$('.menu a').map((a) => rect(a).top); return r.every((t) => Math.abs(t - r[0]) < 2);", fail: "The links should stay in one row: inline-block, not block." },
            { label: "The tags stay inline, with a pill-shaped background", check: "return $$('.tag').every((t) => style(t, 'display') === 'inline' && px(style(t, 'border-top-left-radius')) >= 8 && style(t, 'background-color') !== 'rgba(0, 0, 0, 0)');", fail: "Leave .tag inline; give it padding, a background colour and border-radius: 999px." },
            { label: "The draft note is not displayed at all", check: "return style('.hidden', 'display') === 'none' && rect('.hidden').height === 0;", fail: ".hidden { display: none; }" },
          ],
          solution: { "style.css": DISPLAY_CSS_DONE },
          hint: "Inline padding paints but does not take space vertically. inline-block makes it take space.",
          successMessage: "Inline, inline-block and none each did their job: tags stay in the sentence, links become real targets, and the draft is gone.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 9.4 – 9.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l35-flexbox",
    moduleId: "wd-m9-layout",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.4", "9.5", "9.6", "9.7"],
    title: "Flexbox",
    subtitle: "Laying out items in a row or a column, aligned and sized to share the space",
    estimatedMinutes: 25,
    intro:
      "Flexbox is the tool for laying things out along one line: a header with a logo and a menu, a row of buttons, cards that share a row and wrap when they run out of room. It is the most-used layout tool on the web.",

    atoms: [
      {
        id: "a-wd-flex-basics",
        title: "Flexbox fundamentals",
        explain:
          "display: flex on a container makes its direct children flex items. By default they line up in a row, as tall as the tallest one, shrinking if they do not fit. gap sets the space between items without margins on the outside edges. Only the direct children become flex items; their own children are unaffected.",
        webDemo: {
          caption: "Change flex-direction to column, or justify-content to center or space-between, and watch the boxes move.",
          files: {
            "index.html": page("Flex demo", `  <div class="row">
    <div class="box">One</div>
    <div class="box">Two</div>
    <div class="box">Three</div>
  </div>`),
            "style.css": `body { font-family: Arial, sans-serif; padding: 16px; }

.row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  height: 160px;
  background: #ecfeff;
}

.box {
  padding: 16px;
  background: #0e7490;
  color: white;
}
`,
          },
        },
      },
      {
        id: "a-wd-flex-axes",
        title: "Main axis and cross axis",
        explain:
          "Flexbox works along two axes. The main axis is the direction items flow (flex-direction: row is left to right; column is top to bottom). The cross axis runs across it. justify-content always works on the main axis and align-items on the cross axis, so switching flex-direction from row to column swaps which one moves things horizontally.",
        table: {
          caption: "Which property moves what.",
          headers: ["flex-direction", "Main axis", "justify-content moves items", "align-items moves items"],
          rows: [
            ["row (default)", "Horizontal", "Left and right", "Up and down"],
            ["column", "Vertical", "Up and down", "Left and right"],
          ],
        },
      },
      {
        id: "a-wd-flex-alignment",
        title: "Alignment and distribution",
        explain:
          "justify-content distributes items along the main axis: flex-start, center, flex-end, space-between (first and last at the edges, equal gaps between), space-around and space-evenly. align-items aligns them across it: stretch (the default), flex-start, center, flex-end, baseline. The classic header layout, logo on the left and menu on the right, vertically centred, is two lines.",
        example:
          ".site-header {\n  display: flex;\n  justify-content: space-between;   /* logo left, nav right */\n  align-items: center;              /* both vertically centred */\n}",
        decision: {
          scenario: "A row of three buttons should be centred horizontally in its container with 12px between them.",
          question: "Which CSS on the container does it?",
          options: [
            { id: "a", text: "display: flex; justify-content: center; gap: 12px;", why: "justify-content centres along the main axis (horizontal for a row) and gap spaces the items." },
            { id: "b", text: "display: flex; align-items: center; gap: 12px;", whyWrong: "align-items centres on the cross axis, which is vertical for a row." },
            { id: "c", text: "text-align: center; margin: 12px;", whyWrong: "That centres inline text; margin adds space outside the container." },
            { id: "d", text: "display: flex; justify-content: space-between;", whyWrong: "That pushes the first and last buttons to the edges." },
          ],
          correct: "a",
          aftermath: "justify on the main axis, align on the cross axis: once that sticks, Flexbox stops being trial and error.",
        },
      },
      {
        id: "a-wd-flex-wrap-sizing",
        title: "Wrapping and flexible sizing",
        explain:
          "By default flex items squeeze onto one line. flex-wrap: wrap lets them move to a new line when they run out of room. Each item's flex shorthand says how it grows, shrinks and starts: flex: 1 1 240px means \"start at 240px, grow to share any extra space, shrink if you must\". With wrapping, that one line gives you cards that sit three to a row on a laptop and stack on a phone, with no media query.",
        webLab: {
          task:
            "Lay out the restaurant page with Flexbox. (1) The header: logo on the left, navigation on the right, vertically centred. (2) The nav list: items in a row with a 16px gap. (3) The cards: in a row with a 16px gap, wrapping, each with flex: 1 1 240px, so they sit side by side on a laptop and stack on a phone.",
          files: { "index.html": FLEX_HTML, "style.css": FLEX_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The header is a flex container: logo left, nav right", check: "const h = rect('.site-header'); return style('.site-header', 'display') === 'flex' && rect('.logo').left - h.left < 40 && h.right - rect('.site-header nav').right < 40;", fail: ".site-header { display: flex; justify-content: space-between; }" },
            { label: "Logo and nav are vertically centred", check: "const a = rect('.logo'), b = rect('.site-header nav'); return style('.site-header', 'align-items') === 'center' && Math.abs((a.top + a.height / 2) - (b.top + b.height / 2)) < 2;", fail: "Add align-items: center to .site-header." },
            { label: "The nav items sit in a row with a 16px gap", check: "const li = $$('.nav-list li').map((x) => rect(x)); return style('.nav-list', 'display') === 'flex' && li.every((r) => Math.abs(r.top - li[0].top) < 2) && Math.round(li[1].left - li[0].right) === 16;", fail: ".nav-list { display: flex; gap: 16px; }" },
            { label: "On a laptop, the three cards share one row", check: "const c = $$('.card').map((x) => rect(x)); return c.every((r) => Math.abs(r.top - c[0].top) < 2) && Math.round(c[1].left - c[0].right) === 16;", fail: ".cards { display: flex; gap: 16px; }" },
            { label: "Cards use flex: 1 1 240px", check: "return $$('.card').every((c) => style(c, 'flex-grow') === '1' && style(c, 'flex-basis') === '240px');", fail: ".card { flex: 1 1 240px; }" },
            { label: "On a phone, the cards wrap and stack, without sideways scrolling", viewport: "mobile", check: "const c = $$('.card').map((x) => rect(x)); return style('.cards', 'flex-wrap') === 'wrap' && c[1].top > c[0].bottom - 1 && !overflowX();", fail: "Add flex-wrap: wrap to .cards so the cards move onto new lines." },
          ],
          solution: { "style.css": FLEX_CSS_DONE },
          hint: "Three flex containers: the header, the nav list and the cards section. The flex shorthand goes on the cards themselves.",
          successMessage: "Switch the preview between laptop and phone: the cards rearrange themselves with no media query at all. flex-wrap plus a flex-basis is one of the most useful patterns in CSS.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 9.8 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l36-grid",
    moduleId: "wd-m9-layout",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.8", "9.9", "9.10"],
    title: "CSS Grid",
    subtitle: "Rows and columns at once, and when to choose Grid over Flexbox",
    estimatedMinutes: 22,
    intro:
      "Flexbox arranges items along one line. Grid arranges them in two dimensions, rows and columns together, which makes galleries, dashboards and whole page layouts simple.",

    atoms: [
      {
        id: "a-wd-grid-basics",
        title: "CSS Grid fundamentals",
        explain:
          "display: grid makes a container a grid, and grid-template-columns defines its columns. The fr unit means a fraction of the free space: 1fr 1fr 1fr is three equal columns, 2fr 1fr is two-thirds and one-third. repeat(3, 1fr) is shorthand for three equal columns. Children fill the cells in order, a new row starting automatically when a row is full.",
        example:
          ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);   /* three equal columns */\n  gap: 16px;\n}\n\n.layout {\n  display: grid;\n  grid-template-columns: 250px 1fr;        /* fixed sidebar, flexible main */\n}",
      },
      {
        id: "a-wd-grid-tracks",
        title: "Grid tracks, gaps and placement",
        explain:
          "Rows and columns are tracks; the lines between them are numbered from 1. gap sets the space between tracks. An item can span several tracks with grid-column: span 2, or be placed between lines with grid-column: 1 / 3. grid-template-rows sizes rows, and minmax(200px, 1fr) sets a minimum and a maximum. repeat(auto-fit, minmax(220px, 1fr)) creates as many columns as fit, which is a responsive grid in one line (Module 10).",
        table: {
          caption: "Placing items.",
          headers: ["CSS", "Effect"],
          rows: [
            ["grid-column: span 2", "Take two columns, from wherever the item lands"],
            ["grid-column: 1 / 3", "From line 1 to line 3: the first two columns"],
            ["grid-column: 1 / -1", "Every column: a full-width row"],
            ["grid-row: span 2", "Take two rows"],
          ],
        },
      },
      {
        id: "a-wd-grid-vs-flex",
        title: "Grid versus Flexbox",
        explain:
          "Use Flexbox when content flows along one direction and items size themselves: a header, a toolbar, a row of tags, a set of buttons. Use Grid when you want items lined up in both rows and columns: a gallery, a card grid whose columns must align, a dashboard, a page's overall layout. They work together: a Grid page layout whose header is a flex row is completely normal.",
        webLab: {
          task:
            "Make the gallery a grid: three equal columns with fr units and a 16px gap. Make every image fill its cell with object-fit: cover, and make the featured image span two columns.",
          files: { "index.html": GRID_HTML, "style.css": `${BASE}\nmain { padding: 16px; }\n` },
          readOnly: ["index.html"],
          tests: [
            { label: "The gallery is a grid of three equal columns", check: "const cols = style('.gallery', 'grid-template-columns').split(' ').map(px); return style('.gallery', 'display') === 'grid' && cols.length === 3 && Math.max(...cols) - Math.min(...cols) < 1;", fail: ".gallery { display: grid; grid-template-columns: repeat(3, 1fr); }" },
            { label: "Columns and rows are 16px apart", check: "return style('.gallery', 'column-gap') === '16px' && style('.gallery', 'row-gap') === '16px';", fail: "Add gap: 16px to .gallery." },
            { label: "The featured image spans two columns", check: "const f = rect('.featured'); const one = rect('.gallery img:nth-child(2)'); return Math.abs(f.width - (one.width * 2 + 16)) < 2;", fail: ".featured { grid-column: span 2; }" },
            { label: "Images fill their cells without distortion (object-fit: cover)", check: "return $$('.gallery img').every((i) => style(i, 'object-fit') === 'cover');", fail: ".gallery img { width: 100%; height: 100%; object-fit: cover; }" },
          ],
          solution: { "style.css": GRID_CSS_DONE },
          hint: "The featured image is the first child, so spanning two columns puts it in the top left with one ordinary image beside it.",
          successMessage: "A gallery with aligned rows and columns and a featured item, in about six lines. That is what Grid is for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 9.11 – 9.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l37-positioning",
    moduleId: "wd-m9-layout",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.11", "9.12"],
    title: "Positioning and Stacking",
    subtitle: "Badges, sticky headers and floating messages, and what sits on top",
    estimatedMinutes: 22,
    intro:
      "Some things do not belong in the flow at all: a Sale badge on the corner of a card, a header that stays at the top while you scroll, a message that floats above the page. That is positioning.",

    atoms: [
      {
        id: "a-wd-position",
        title: "Relative, absolute, fixed and sticky positioning",
        explain:
          "position: relative keeps the element in the flow but lets top, right, bottom and left nudge it, and, more importantly, makes it the reference box for absolutely positioned children. position: absolute removes the element from the flow and places it relative to its nearest positioned ancestor: the standard way to put a badge on a card's corner. position: fixed places it relative to the window, so it stays put while the page scrolls. position: sticky behaves normally until it reaches an offset, such as top: 0, then sticks there while its container is on screen.",
        table: {
          caption: "The four position values.",
          headers: ["Value", "Stays in the flow?", "Placed relative to", "Typical use"],
          rows: [
            ["relative", "Yes", "Its normal position", "The anchor for absolute children"],
            ["absolute", "No", "The nearest positioned ancestor", "Badges, icons on a corner, tooltips"],
            ["fixed", "No", "The browser window", "Chat buttons, toasts, cookie bars"],
            ["sticky", "Yes, until it sticks", "Its scrolling container", "Headers, table headings, sidebars"],
          ],
        },
        mistake: "An absolute badge flying to the corner of the whole page. Its card has no position set, so it found the next positioned ancestor, which was the page. Add position: relative to the card.",
      },
      {
        id: "a-wd-z-index",
        title: "z-index and stacking contexts",
        explain:
          "When positioned elements overlap, z-index decides which is on top: higher numbers are closer to the viewer. It only works on positioned elements (and flex and grid items). Some properties, such as a z-index on a positioned element, opacity below 1, or a transform, create a stacking context: everything inside is stacked within that parent as a group, so a child with z-index: 9999 cannot rise above something outside its parent. Use a small, documented set of layers (header 10, dropdown 20, modal 30) instead of ever-larger numbers.",
        webLab: {
          task:
            "Position three things. (1) Put the Sale badge in the top-right corner of its card: 8px from the top and right, with the card as its reference. (2) Make the header sticky at the top of the window. (3) Fix the toast 16px from the bottom-right corner of the window, above the header with a higher z-index than its 10.",
          files: { "index.html": POS_HTML, "style.css": POS_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The badge is absolutely positioned, 8px inside the card's top-right corner", check: "const c = rect('.card'), b = rect('.badge'), bw = px(style('.card', 'border-top-width')); return style('.badge', 'position') === 'absolute' && Math.round(b.top - c.top - bw) === 8 && Math.round(c.right - b.right - bw) === 8;", fail: "Give .card position: relative, and .badge position: absolute; top: 8px; right: 8px." },
            { label: "The card, not the page, is the badge's reference", check: "return style('.card', 'position') === 'relative';", fail: "Add position: relative to .card." },
            { label: "The header sticks to the top when the page scrolls", check: "window.scrollTo(0, 600); await tick(); const top = rect('.site-header').top; window.scrollTo(0, 0); await tick(); return style('.site-header', 'position') === 'sticky' && Math.abs(top) < 1;", fail: ".site-header { position: sticky; top: 0; }" },
            { label: "The toast is fixed 16px from the bottom-right of the window", check: "const t = rect('.toast'); return style('.toast', 'position') === 'fixed' && Math.round(window.innerWidth - t.right) === 16 && Math.round(window.innerHeight - t.bottom) === 16;", fail: ".toast { position: fixed; right: 16px; bottom: 16px; }" },
            { label: "The toast stacks above the header", check: "return Number(style('.toast', 'z-index')) > Number(style('.site-header', 'z-index'));", fail: "Give .toast a z-index higher than the header's 10, such as 20." },
          ],
          solution: { "style.css": POS_CSS_DONE },
          hint: "Absolute needs a positioned ancestor; sticky needs an offset such as top: 0 to know where to stick.",
          successMessage: "Scroll the preview: the header sticks, the toast stays in its corner, and the badge rides along on its card. Each one uses a different position value for a different job.",
        },
      },
    ],

    task: {
      title: "Module project: a complete page layout",
      intro: "Lay out a product page using every tool in this module.",
      prompts: [
        "A sticky Flexbox header: logo left, navigation right, vertically centred.",
        "A Grid layout for the page body: a 250px sidebar beside a flexible main column.",
        "Inside main, a grid of product cards; each card has a Sale or New badge absolutely positioned on its corner.",
        "A fixed Back to top link in the bottom-right corner that stays above everything else.",
        "Write down, for each part, why you chose Flexbox, Grid or positioning.",
      ],
      closing: "Module 10 makes this layout respond to every screen size.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
