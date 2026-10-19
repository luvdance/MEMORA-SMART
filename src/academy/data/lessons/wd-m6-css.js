/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 6 · CSS FUNDAMENTALS
 *
 * Curriculum 6.1 – 6.10. What CSS does and where it lives, its syntax, every
 * selector a beginner needs and how specificity ranks them, inheritance and
 * the cascade, organising a stylesheet and the browser's own defaults.
 * The labs are checked against computed styles: what the browser actually
 * applied, not what the stylesheet says.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s6-css";

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

const INLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kunle's Kicks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body style="font-family: Arial, sans-serif; background-color: rgb(255, 251, 235);">
  <h1 style="color: rgb(180, 83, 9);">Kunle's Kicks</h1>
  <p class="tagline" style="font-size: 20px;">Sneakers, cleaned and restored.</p>
  <p>Drop off at our Yaba shop, collect in three days.</p>
  <p class="price" style="color: rgb(21, 128, 61); font-weight: bold;">From ₦5,000</p>
</body>
</html>
`;

const INLINE_HTML_DONE = INLINE_HTML.replace(' style="font-family: Arial, sans-serif; background-color: rgb(255, 251, 235);"', "")
  .replace(' style="color: rgb(180, 83, 9);"', "")
  .replace(' style="font-size: 20px;"', "")
  .replace(' style="color: rgb(21, 128, 61); font-weight: bold;"', "");

const INLINE_CSS_DONE = `body {
  font-family: Arial, sans-serif;
  background-color: rgb(255, 251, 235);
}

h1 {
  color: rgb(180, 83, 9);
}

.tagline {
  font-size: 20px;
}

.price {
  color: rgb(21, 128, 61);
  font-weight: bold;
}
`;

const SELECT_HTML = page(
  "Fresh Market",
  `  <header>
    <nav>
      <a href="index.html">Home</a>
      <a href="deals.html">Deals</a>
      <a href="https://wa.me/2348030000002">WhatsApp us</a>
    </nav>
  </header>
  <main>
    <h1 id="title">Fresh Market</h1>
    <ul class="products">
      <li>Tomatoes <span class="price">₦1,500</span></li>
      <li class="new">Ugu leaves <span class="price">₦500</span></li>
      <li>Yam <span class="price">₦3,000</span></li>
      <li>Plantain <span class="price">₦1,200</span></li>
    </ul>
    <p>Prices change every Monday.</p>
  </main>`
);

const SELECT_CSS_DONE = `/* 1. Element selector: every paragraph */
p {
  color: rgb(75, 85, 99);
}

/* 2. Class selector */
.price {
  color: rgb(21, 128, 61);
}

/* 3. ID selector */
#title {
  color: rgb(29, 78, 216);
}

/* 4. Descendant combinator: links inside nav */
nav a {
  margin-right: 12px;
}

/* 5. Attribute selector: links to other sites */
a[href^="https"] {
  color: rgb(190, 18, 60);
}

/* 6. Pseudo-class: every odd product */
.products li:nth-child(odd) {
  background-color: rgb(243, 244, 246);
}

/* 7. Pseudo-element: a label before new products */
.new::before {
  content: "New: ";
  font-weight: bold;
}
`;

const CASCADE_HTML = page(
  "Ankara Styles",
  `  <header>
    <h1>Ankara Styles</h1>
  </header>
  <main id="main">
    <p>Hand-made dresses and shirts from Aba.</p>
    <a class="btn" href="shop.html">Shop the collection</a>
  </main>`
);

const CASCADE_CSS = `h1 {
  font-family: Georgia, serif;
}

p {
  font-family: Georgia, serif;
}

a {
  font-family: Georgia, serif;
}

#main a {
  color: rgb(37, 99, 235);
}

.btn {
  display: inline-block;
  padding: 10px 16px;
  background-color: rgb(21, 128, 61);
  color: white;
}
`;

const CASCADE_CSS_DONE = `/* ── Base ─────────────────────────── */

body {
  margin: 0;
  font-family: Georgia, serif;
}

/* ── Components ───────────────────── */

#main .btn {
  display: inline-block;
  padding: 10px 16px;
  background-color: rgb(21, 128, 61);
  color: white;
}

#main a {
  color: rgb(37, 99, 235);
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 6.1 – 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l25-css-intro",
    moduleId: "wd-m6-css",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3"],
    title: "What CSS Does, Where It Goes and How It Is Written",
    subtitle: "Separating presentation from structure, three places for styles, and the rule syntax",
    estimatedMinutes: 17,
    intro:
      "Phase 1 built pages that work. Phase 2 makes them look the way they should, on every screen. It begins with Cascading Style Sheets: what they do, where they belong and the grammar of a rule.",

    atoms: [
      {
        id: "a-wd-what-css",
        title: "What CSS does",
        explain:
          "CSS (Cascading Style Sheets) describes how HTML is presented: colours, fonts, spacing, layout, and how all of it changes on different screens. HTML says what something is; CSS says how it looks. Keeping them apart means one stylesheet can restyle a hundred pages at once, and the same HTML can look completely different on a phone and a laptop.",
        webDemo: {
          caption: "The same HTML with two different stylesheets. Edit style.css: change the colours, the font, the border radius.",
          files: {
            "index.html": page("Card", `  <article class="card">
    <h2>Ofada rice</h2>
    <p>Served with ayamase sauce.</p>
    <p class="price">₦3,500</p>
  </article>`),
            "style.css": `body {
  font-family: Arial, sans-serif;
  background: rgb(240, 253, 244);
  padding: 24px;
}

.card {
  max-width: 280px;
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.price {
  font-weight: bold;
  color: rgb(21, 128, 61);
}
`,
          },
        },
        why: "The famous CSS Zen Garden site showed this in 2003: hundreds of designers restyled one identical HTML page into hundreds of completely different designs, using only CSS.",
      },
      {
        id: "a-wd-css-locations",
        title: "Inline, internal and external CSS",
        explain:
          "CSS can live in three places. Inline styles sit in a style attribute on one element. Internal styles sit in a <style> element in the page's head and apply to that one page. External styles sit in a separate .css file linked from every page. Use external stylesheets: one file, cached by the browser after the first page, shared by the whole site. Inline styles mix presentation back into the HTML and are the hardest to override, so keep them for rare cases such as a value calculated by JavaScript.",
        table: {
          caption: "The three places, compared.",
          headers: ["Where", "Example", "Applies to", "Use"],
          rows: [
            ["Inline", "<p style=\"color: red\">", "That one element", "Rarely"],
            ["Internal", "<style> p { color: red; } </style>", "That one page", "Quick experiments, single-page demos"],
            ["External", "<link rel=\"stylesheet\" href=\"style.css\">", "Every page that links it", "Always, for real sites"],
          ],
        },
      },
      {
        id: "a-wd-css-syntax",
        title: "CSS syntax and declarations",
        explain:
          "A CSS rule is a selector followed by a block of declarations in curly braces. The selector picks which elements the rule applies to. Each declaration is a property, a colon, a value and a semicolon. A missing semicolon or brace silently breaks the declarations after it, and a misspelled property is simply ignored, so when a style does nothing, check the spelling first.",
        example:
          "selector     {  property : value ;  }\n   │            │          │\n   ▼            ▼          ▼\n  .price {\n    color: rgb(21, 128, 61);      ← a declaration\n    font-weight: bold;            ← another\n  }",
        webLab: {
          task:
            "Every style on this page is written inline. Move them all into style.css as proper rules: the body's font and background, the h1's colour, the tagline's font size and the price's colour and weight. Then delete every style attribute from index.html. The page must look exactly the same.",
          files: { "index.html": INLINE_HTML, "style.css": "/* Move the styles here */\n" },
          tests: [
            { label: "No style attributes are left in the HTML", check: "return $$('[style]').length === 0;", fail: "Some elements still have a style attribute. Move each into style.css and delete the attribute." },
            { label: "The body still has the Arial font and the cream background", check: "return /Arial/.test(style('body', 'font-family')) && style('body', 'background-color') === 'rgb(255, 251, 235)';", fail: "Write a body rule with font-family: Arial, sans-serif and background-color: rgb(255, 251, 235)." },
            { label: "The heading is still orange-brown", check: "return style('h1', 'color') === 'rgb(180, 83, 9)';", fail: "Add an h1 rule with color: rgb(180, 83, 9)." },
            { label: "The tagline is still 20px", check: "return style('.tagline', 'font-size') === '20px';", fail: "Use the class: .tagline { font-size: 20px; }" },
            { label: "The price is still green and bold", check: "return style('.price', 'color') === 'rgb(21, 128, 61)' && Number(style('.price', 'font-weight')) >= 700;", fail: "Add .price { color: rgb(21, 128, 61); font-weight: bold; }" },
          ],
          solution: { "index.html": INLINE_HTML_DONE, "style.css": INLINE_CSS_DONE },
          hint: "The class attributes are already in the HTML: use .tagline and .price as selectors. Every declaration ends with a semicolon.",
          successMessage: "Same page, but now its presentation lives in one file. Change a colour once in style.css and every page that links it changes.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 6.4 – 6.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l26-selectors",
    moduleId: "wd-m6-css",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.4", "6.5", "6.6", "6.7"],
    title: "Selectors and Specificity",
    subtitle: "Choosing exactly the elements you mean, and which rule wins when two disagree",
    estimatedMinutes: 22,
    intro:
      "Selectors are how CSS points at elements. Choose them well and a stylesheet is short and predictable; choose them badly and styles fight each other. This lesson covers every selector a beginner needs and the scoring system browsers use to settle arguments.",

    atoms: [
      {
        id: "a-wd-specificity",
        title: "Selectors and specificity",
        explain:
          "When two rules set the same property on the same element, the browser picks the one with the higher specificity: a score for how precisely the selector targets. Count three columns: IDs, then classes (including attributes and pseudo-classes), then element names. Compare column by column from the left; the first difference decides. Only if the scores are equal does the rule written later win.",
        table: {
          caption: "Specificity scores, written (IDs, classes, elements).",
          headers: ["Selector", "Score", "Notes"],
          rows: [
            ["p", "(0, 0, 1)", "One element"],
            ["nav a", "(0, 0, 2)", "Two elements"],
            [".price", "(0, 1, 0)", "One class beats any number of elements"],
            ["li.new", "(0, 1, 1)", "A class and an element"],
            ["a[href^=\"https\"]:hover", "(0, 2, 1)", "Attributes and pseudo-classes count as classes"],
            ["#title", "(1, 0, 0)", "One ID beats any number of classes"],
            ["style=\"…\" attribute", "Beats all selectors", "Why inline styles are hard to override"],
          ],
        },
        decision: {
          scenario: "Two rules target the same link: `nav a { color: blue; }` comes last in the file, and `.footer-link { color: grey; }` comes first. The link is <a class=\"footer-link\"> inside a nav.",
          question: "What colour is the link?",
          options: [
            { id: "a", text: "Grey: .footer-link (0,1,0) beats nav a (0,0,2), whatever the order", why: "One class outranks two elements. Order only breaks ties between equal scores." },
            { id: "b", text: "Blue, because nav a comes later", whyWrong: "Later only wins when specificity is equal. Here it is not." },
            { id: "c", text: "Blue, because it has two parts", whyWrong: "Two element names score (0,0,2), still less than one class." },
            { id: "d", text: "A mixture of both", whyWrong: "One value wins for each property; colours are never mixed." },
          ],
          correct: "a",
          aftermath: "Keep specificity low and even, mostly single classes, and the order of your file becomes predictable again.",
        },
      },
      {
        id: "a-wd-basic-selectors",
        title: "Element, class and ID selectors",
        explain:
          "An element selector (p, h1, a) styles every element of that type. A class selector (.price) styles every element with that class, and an element can have several classes: class=\"card featured\". An ID selector (#title) styles the one element with that id. Prefer classes for styling: they are reusable and easy to override. IDs are for linking (#contact) and for JavaScript, and their high specificity makes them awkward to override in CSS.",
        example:
          "p        { … }   every <p>\n.price   { … }   every element with class=\"price\"\n#title   { … }   the element with id=\"title\"\nli.new   { … }   <li> elements that also have class=\"new\"\n.card.featured { … }   elements with BOTH classes",
      },
      {
        id: "a-wd-combinators-attributes",
        title: "Combinators and attribute selectors",
        explain:
          "Combinators select by relationship. A space is the descendant combinator: nav a means any a inside a nav, at any depth. > is the child combinator: ul > li means only direct children. + selects the next sibling and ~ any later sibling. Attribute selectors match attributes: a[target] has the attribute, a[href^=\"https\"] begins with https, a[href$=\".pdf\"] ends with .pdf, input[type=\"email\"] equals it.",
        table: {
          caption: "Relationships and attributes.",
          headers: ["Selector", "Matches"],
          rows: [
            ["nav a", "Links anywhere inside a nav"],
            ["ul > li", "li that are direct children of a ul"],
            ["h2 + p", "The first p right after an h2"],
            ["a[href^=\"https\"]", "Links whose href starts with https"],
            ["a[href$=\".pdf\"]", "Links to PDF files"],
            ["input[type=\"email\"]", "Email inputs"],
          ],
        },
      },
      {
        id: "a-wd-pseudo",
        title: "Pseudo-classes and pseudo-elements",
        explain:
          "A pseudo-class (one colon) selects elements in a state or position: :hover when the pointer is over it, :focus when it has keyboard focus, :first-child, :nth-child(odd) for every other row, :checked, :invalid. A pseudo-element (two colons) styles a part of an element, or adds content that is not in the HTML: ::before and ::after insert generated content, ::first-line and ::placeholder style parts.",
        webLab: {
          task:
            "The HTML is finished; style it in style.css using seven kinds of selector. (1) Make every paragraph grey, rgb(75, 85, 99), with an element selector. (2) Make .price green, rgb(21, 128, 61). (3) Make #title blue, rgb(29, 78, 216). (4) Give links inside the nav a 12px right margin with a descendant selector. (5) Make links whose href starts with https red, rgb(190, 18, 60), with an attribute selector. (6) Give every odd product a light grey background, rgb(243, 244, 246), with :nth-child. (7) Put the text \"New: \" before the .new product with ::before.",
          files: { "index.html": SELECT_HTML, "style.css": "/* Your selectors here */\n" },
          readOnly: ["index.html"],
          tests: [
            { label: "Paragraphs are grey (element selector)", check: "return style('main > p', 'color') === 'rgb(75, 85, 99)';", fail: "p { color: rgb(75, 85, 99); }" },
            { label: "Prices are green (class selector)", check: "return $$('.price').every((e) => style(e, 'color') === 'rgb(21, 128, 61)');", fail: ".price { color: rgb(21, 128, 61); }" },
            { label: "The title is blue (ID selector)", check: "return style('#title', 'color') === 'rgb(29, 78, 216)';", fail: "#title { color: rgb(29, 78, 216); }" },
            { label: "Nav links have a 12px right margin (descendant combinator)", check: "return $$('nav a').every((a) => style(a, 'margin-right') === '12px') && rules(/nav\\s+a/).length > 0;", fail: "nav a { margin-right: 12px; }" },
            { label: "Only the https link is red (attribute selector)", check: "return style('a[href^=\"https\"]', 'color') === 'rgb(190, 18, 60)' && style('nav a[href=\"index.html\"]', 'color') !== 'rgb(190, 18, 60)';", fail: "a[href^=\"https\"] { color: rgb(190, 18, 60); }" },
            { label: "Odd products have a light grey background (:nth-child)", check: "const li = $$('.products li'); return style(li[0], 'background-color') === 'rgb(243, 244, 246)' && style(li[2], 'background-color') === 'rgb(243, 244, 246)' && style(li[1], 'background-color') !== 'rgb(243, 244, 246)';", fail: ".products li:nth-child(odd) { background-color: rgb(243, 244, 246); }" },
            { label: "\"New: \" appears before the new product (::before)", check: "return pseudo('.new', '::before', 'content') === '\"New: \"';", fail: ".new::before { content: \"New: \"; }" },
          ],
          solution: { "style.css": SELECT_CSS_DONE },
          hint: "Each requirement is one rule. The selector forms are in the table above: p, .price, #title, nav a, a[href^=\"https\"], li:nth-child(odd), .new::before.",
          successMessage: "Seven selector types, each hitting exactly the elements it should and nothing else. Notice the HTML did not change once: that is the point of good selectors.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 6.8 – 6.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l27-cascade",
    moduleId: "wd-m6-css",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.8", "6.9", "6.10"],
    title: "Inheritance, the Cascade and Browser Defaults",
    subtitle: "Why styles spread, how conflicts are settled, and what the browser does before you write a line",
    estimatedMinutes: 20,
    intro:
      "The C in CSS is Cascading. Styles flow from many sources, parent to child and rule to rule, and the browser has a fixed procedure for deciding which wins. Once you know it, CSS stops being mysterious.",

    atoms: [
      {
        id: "a-wd-inheritance-cascade",
        title: "Inheritance and the cascade",
        explain:
          "Some properties are inherited: set font-family, color or line-height on body and every element inside receives it, unless something overrides it. Box properties (margin, padding, border, background, width) are not inherited. When several rules set the same property on one element, the cascade decides, in this order: importance (!important declarations, which you should avoid), then specificity, then source order (later wins).",
        table: {
          caption: "The cascade, in the order it is applied.",
          headers: ["Step", "Question", "Winner"],
          rows: [
            ["1 · Origin and importance", "Is a declaration !important, or is it the browser's default?", "!important beats normal; your styles beat browser defaults"],
            ["2 · Specificity", "Which selector is more specific?", "Higher (IDs, classes, elements)"],
            ["3 · Order", "Which rule appears later?", "The later one"],
            ["(4) · Inheritance", "Nothing set it at all?", "Inherited from the parent, or the initial value"],
          ],
        },
        mistake:
          "Using !important to win an argument. It works once, then the next fix needs another !important, and soon nothing can be overridden. Lower the specificity of the other rule instead.",
      },
      {
        id: "a-wd-css-organisation",
        title: "CSS comments and code organization",
        explain:
          "CSS comments are written /* like this */ and can span lines. A stylesheet that grows without order becomes impossible to change, so organise it in sections from general to specific: base styles for elements (body, headings, links), then layout (header, main, grid), then components (buttons, cards), then utilities. Label each section with a comment. Because later rules win ties, general rules first and specific rules later is also the order the cascade wants.",
        example:
          "/* ── Base ─────────────── */\nbody { margin: 0; font-family: Georgia, serif; }\nh1, h2 { line-height: 1.2; }\n\n/* ── Layout ───────────── */\n.site-header { … }\n\n/* ── Components ───────── */\n.btn { … }\n.card { … }",
      },
      {
        id: "a-wd-browser-defaults",
        title: "Browser default styles",
        explain:
          "Before your CSS runs, every browser applies its own default stylesheet (the user-agent stylesheet): body has an 8px margin, headings are bold and large, lists are indented with bullets, links are blue and underlined. These defaults differ slightly between browsers. Most projects begin by removing the ones that get in the way, such as body { margin: 0; }, which is why a page that \"has a mysterious gap at the edge\" usually just needs that line.",
        webLab: {
          task:
            "Fix this stylesheet without using !important. (1) Remove the browser's default margin on the body. (2) The font is repeated on h1, p and a: set it once on body and let inheritance do the rest, deleting the three repeats. (3) The Shop button should be white text on green, but #main a overrides its colour: fix it by making the button's selector specific enough, not by adding !important. (4) Organise the file with at least two comment section headers.",
          files: { "index.html": CASCADE_HTML, "style.css": CASCADE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The body's default margin is gone", check: "return style('body', 'margin-top') === '0px' && style('body', 'margin-left') === '0px';", fail: "Add margin: 0 to a body rule." },
            { label: "Georgia is set once, on body, and inherited", check: "const c = code('style.css'); return (c.match(/font-family/g) || []).length === 1 && rules('body').some((r) => /Georgia/.test(r.style.fontFamily)) && /Georgia/.test(style('p', 'font-family'));", fail: "Put font-family: Georgia, serif in the body rule only, and delete it from h1, p and a." },
            { label: "The button is white on green", check: "return style('.btn', 'color') === 'rgb(255, 255, 255)' && style('.btn', 'background-color') === 'rgb(21, 128, 61)';", fail: "#main a has higher specificity than .btn. Use a selector such as #main .btn for the button." },
            { label: "No !important anywhere", check: "return !/!important/.test(code('style.css'));", fail: "Remove !important; fix the specificity instead." },
            { label: "The file is organised with at least two comment section headers", check: "return (raw('style.css').match(/\\/\\*[\\s\\S]*?\\*\\//g) || []).length >= 2;", fail: "Add comments such as /* ── Base ── */ and /* ── Components ── */ above the sections." },
          ],
          solution: { "style.css": CASCADE_CSS_DONE },
          hint: "#main a scores (1,0,1). .btn scores (0,1,0). #main .btn scores (1,1,0), which beats both.",
          successMessage: "One font declaration instead of three, a button that wins on specificity rather than force, and a file someone else can navigate. That is a maintainable stylesheet.",
        },
      },
    ],

    task: {
      title: "Module project: style the recipe page",
      intro: "Open the recipe page you built in Module 3 and give it a stylesheet.",
      prompts: [
        "Create css/style.css, link it, and remove the body's default margin.",
        "Set the font once on body and let it inherit.",
        "Style the headings, the ingredient list and the method list using element and class selectors only (no IDs).",
        "Use a pseudo-class to stripe every other step of the method.",
        "Organise the file into Base and Components sections with comments, and use no !important.",
      ],
      closing: "Module 7 adds real colour schemes and typography to this stylesheet.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
