/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 20 · THE DOCUMENT OBJECT MODEL
 *
 * Curriculum 20.1 – 20.12. Phase 4 connects the programming of Phase 3 to
 * real pages. What the DOM is and how HTML becomes it; selecting elements;
 * reading and updating text and attributes; styles and classes; creating,
 * appending and removing elements; classList; traversal; and updating the
 * page efficiently. Labs run the learner's script on a real page and check
 * the DOM it produces.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s20-dom";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;

const PRODUCTS = `const products = [
  { id: 1, name: "Rice, 5kg", price: 9500, stock: 12 },
  { id: 2, name: "Palm oil, 1L", price: 2800, stock: 0 },
  { id: 3, name: "Phone charger", price: 4500, stock: 7 },
];
`;

const CARD_HTML = page("Profile", `  <article class="card">
    <img id="avatar" src="" alt="">
    <h1 id="name">Loading…</h1>
    <p id="role"></p>
    <a id="email" href="#">Email</a>
  </article>`);

const LIST_HTML = page("Shop", `  <main>
    <h1>Products</h1>
    <p id="count"></p>
    <ul id="products"></ul>
  </main>`);

const LIST_CSS = `body { font-family: Arial, sans-serif; padding: 16px; }
.product { padding: 8px; border-bottom: 1px solid #e5e7eb; }
.sold-out { color: #9ca3af; text-decoration: line-through; }
`;

const TABLE_HTML = page("Results", `  <table>
    <thead><tr><th>Name</th><th>Score</th><th></th></tr></thead>
    <tbody id="results">
      <tr><td>Ada</td><td class="score">72</td><td><button class="remove">Remove</button></td></tr>
      <tr><td>Bayo</td><td class="score">91</td><td><button class="remove">Remove</button></td></tr>
      <tr><td>Chika</td><td class="score">64</td><td><button class="remove">Remove</button></td></tr>
    </tbody>
  </table>
  <ul id="big-list"></ul>`);

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 91 · 20.1 – 20.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l91-dom-tree",
    moduleId: "wd-m20-dom",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["20.1", "20.2", "20.3"],
    title: "The DOM: Your Page as a Tree of Objects",
    subtitle: "What JavaScript sees when it looks at a page, and how to find an element in it",
    estimatedMinutes: 22,
    intro:
      "Everything in Phase 3 printed to a console. Visitors never see a console; they see a page. The Document Object Model is how JavaScript reaches into the page and changes it, and it is made of the objects you already know how to use.",

    atoms: [
      {
        id: "a-wd-what-dom",
        title: "What the DOM is",
        explain:
          "When the browser reads your HTML it builds the Document Object Model: an object for every element, attribute and piece of text, connected in a tree. JavaScript never edits your HTML file; it changes these objects, and the browser immediately redraws the page to match. The whole tree starts at one object, document.",
        why: "Because elements are objects, everything from Module 17 applies: they have properties (textContent, className, value) you read and set, and methods (append, remove, addEventListener) you call.",
        webLab: {
          task:
            "Your first DOM script. In app.js, find the heading with document.getElementById(\"title\") and change its text to \"Today's tasks\". Then find the list with getElementById(\"list\") and print how many items it has with console.log, using its children.length, so the console shows exactly 2.",
          files: {
            "index.html": page("Tasks", `  <h1 id="title">Tasks</h1>
  <ul id="list">
    <li>Buy rice</li>
    <li>Call Mum</li>
  </ul>`),
            "style.css": "body { font-family: Arial, sans-serif; padding: 16px; }\n",
            "app.js": "// Change the heading, then log the number of list items\n",
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "The heading now reads \"Today's tasks\"", check: "return text('#title') === \"Today's tasks\";", fail: "document.getElementById(\"title\").textContent = \"Today's tasks\";" },
            { label: "The console shows 2, read from the list", check: "return output() === '2' && /children\\.length/.test(code('app.js'));", fail: "console.log(document.getElementById(\"list\").children.length);" },
            { label: "No errors", check: "return errors().length === 0;", fail: "Check the ids: title and list." },
          ],
          solution: { "app.js": "document.getElementById(\"title\").textContent = \"Today's tasks\";\nconsole.log(document.getElementById(\"list\").children.length);\n" },
          hint: "Elements are objects: textContent is a property you can set, and children is a list with a length.",
          successMessage: "You changed a page with JavaScript and read its structure. Everything else in Phase 4 builds on these two moves.",
        },
      },
      {
        id: "a-wd-html-to-tree",
        title: "How HTML becomes a DOM tree",
        explain:
          "Each element becomes a node, and elements inside it become its children, exactly as the HTML is nested. Text inside an element is a text node, its child. Attributes become properties of the element object. The developer tools' Elements panel is a live view of this tree, not of your HTML file: if JavaScript changes the page, the panel shows the change.",
        example:
          "<body>\n  <h1 id=\"title\">Tasks</h1>\n  <ul class=\"list\">\n    <li>Buy rice</li>\n    <li>Call Mum</li>\n  </ul>\n</body>\n\nbecomes:\n\ndocument\n └── html\n      └── body\n           ├── h1 (id=\"title\")\n           │    └── \"Tasks\"\n           └── ul (class=\"list\")\n                ├── li ── \"Buy rice\"\n                └── li ── \"Call Mum\"",
        webDemo: {
          caption: "This script walks the tree and prints it to the console. Add an element to the HTML and watch it appear in the output.",
          files: {
            "index.html": page("Tree", `  <h1 id="title">Tasks</h1>
  <ul class="list">
    <li>Buy rice</li>
    <li>Call Mum</li>
  </ul>`),
            "style.css": "body { font-family: Arial, sans-serif; padding: 16px; }\n",
            "app.js": `function show(el, depth) {
  console.log("  ".repeat(depth) + el.tagName.toLowerCase());
  for (const child of el.children) show(child, depth + 1);
}
show(document.body, 0);
`,
          },
        },
      },
      {
        id: "a-wd-selecting",
        title: "Selecting elements",
        explain:
          "Before changing an element, you find it. document.getElementById(\"title\") finds the one element with that id. The modern, general way is querySelector with a CSS selector, next lesson. A selection that finds nothing returns null, and the error comes on the next line, when you try to use it: \"Cannot read properties of null\". When you see that, check the selector first.",
        decision: {
          scenario: "app.js is linked in the head without defer, and its first line is document.getElementById(\"title\").textContent = \"Today\". The page throws \"Cannot set properties of null\".",
          question: "Why?",
          options: [
            { id: "a", text: "The script runs before the browser has built the h1, so getElementById finds nothing", why: "Scripts in the head run as soon as they are reached. Add defer, or put the script at the end of the body, so the DOM exists first." },
            { id: "b", text: "getElementById does not work on headings", whyWrong: "It works on any element with an id." },
            { id: "c", text: "textContent cannot be set", whyWrong: "It can; the element was null." },
            { id: "d", text: "ids must start with #", whyWrong: "The # is for CSS selectors; getElementById takes the plain id." },
          ],
          correct: "a",
          aftermath: "Every page in this module links its script with defer, so the whole tree exists when it runs.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 92 · 20.4 – 20.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l92-query-text-attributes",
    moduleId: "wd-m20-dom",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["20.4", "20.5", "20.6"],
    title: "querySelector, Text and Attributes",
    subtitle: "Finding any element, and changing what it says and what it points to",
    estimatedMinutes: 24,
    intro: "Most DOM work is three steps: find an element, change its text or attributes, repeat. This lesson covers all three with the methods professionals use every day.",

    atoms: [
      {
        id: "a-wd-query-selector",
        title: "querySelector() and querySelectorAll()",
        explain:
          "document.querySelector(selector) returns the FIRST element matching any CSS selector, or null. document.querySelectorAll(selector) returns ALL matches as a NodeList, which you can loop over with for...of or forEach (wrap it in [...list] to use map and filter). Both also work on an element, searching only inside it: card.querySelector(\"h2\").",
        table: {
          caption: "Selecting with CSS selectors.",
          headers: ["Code", "Returns"],
          rows: [
            ["document.querySelector(\"#name\")", "The element with id=\"name\", or null"],
            ["document.querySelector(\".card h2\")", "The first h2 inside a .card"],
            ["document.querySelectorAll(\"li\")", "Every li, as a NodeList"],
            ["[...document.querySelectorAll(\".price\")]", "Every .price, as a real array"],
          ],
        },
      },
      {
        id: "a-wd-text",
        title: "Reading and updating text",
        explain:
          "textContent reads or replaces all the text inside an element, treating whatever you assign as plain text, so tags in it are shown literally and nothing can run. innerHTML reads or replaces the HTML inside, so tags become real elements. Use textContent for anything that came from a user or a server; Module 31 explains the attack innerHTML opens up.",
        example:
          "<p id=\"msg\">Hello</p>\n\nmsg.textContent = \"Saved <b>3</b> tasks\";   → shows the characters  Saved <b>3</b> tasks\nmsg.innerHTML   = \"Saved <b>3</b> tasks\";   → shows Saved 3 tasks, with 3 in bold",
      },
      {
        id: "a-wd-attributes",
        title: "Updating attributes",
        explain:
          "Common attributes are properties of the element: img.src, img.alt, a.href, input.value, button.disabled. For any attribute, getAttribute(name), setAttribute(name, value) and removeAttribute(name) work. Custom data goes in data-* attributes and is read through dataset: <li data-id=\"7\"> gives li.dataset.id === \"7\" (always a string).",
        webLab: {
          task:
            "Fill in this profile card from the user object in app.js. Set the h1's text to the name, the #role paragraph's text to the role, the image's src to user.photo and its alt to \"Photo of \" plus the name, and the email link's href to \"mailto:\" plus the email. Finally store the user's id on the card as a data-user-id attribute.",
          files: {
            "index.html": CARD_HTML,
            "style.css": "body { font-family: Arial, sans-serif; padding: 16px; }\n.card img { width: 120px; border-radius: 50%; }\n",
            "app.js": "const user = {\n  id: 42,\n  name: \"Folake Adebayo\",\n  role: \"Product designer, Lagos\",\n  photo: \"images/profile.jpg\",\n  email: \"folake@example.com\",\n};\n\n// Fill in the card here\n",
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "The heading shows the name and the paragraph the role", check: "return text('#name') === 'Folake Adebayo' && text('#role') === 'Product designer, Lagos';", fail: "document.querySelector(\"#name\").textContent = user.name; and the same for #role." },
            { label: "The photo loads from user.photo", check: "const img = $('#avatar'); return img.complete && img.naturalWidth === 600;", fail: "Set the image's src to user.photo." },
            { label: "The photo's alt is \"Photo of Folake Adebayo\"", check: "return $('#avatar').alt === 'Photo of Folake Adebayo';", fail: "img.alt = \"Photo of \" + user.name;" },
            { label: "The email link opens mail to her address", check: "return $('#email').getAttribute('href') === 'mailto:folake@example.com';", fail: "link.href = \"mailto:\" + user.email;" },
            { label: "The card carries data-user-id=\"42\"", check: "return $('.card').getAttribute('data-user-id') === '42' && $('.card').dataset.userId === '42';", fail: "card.dataset.userId = user.id; (or setAttribute(\"data-user-id\", user.id))." },
            { label: "The values come from the object, not typed into the script", check: "const c = code('app.js').split('// Fill in')[1] || code('app.js'); return !/Folake Adebayo|folake@example/.test(c.replace(/const user[\\s\\S]*?};/, ''));", fail: "Use user.name, user.email and so on, so the card works for any user." },
          ],
          solution: { "app.js": "const user = {\n  id: 42,\n  name: \"Folake Adebayo\",\n  role: \"Product designer, Lagos\",\n  photo: \"images/profile.jpg\",\n  email: \"folake@example.com\",\n};\n\nconst card = document.querySelector(\".card\");\nconst img = document.querySelector(\"#avatar\");\n\ndocument.querySelector(\"#name\").textContent = user.name;\ndocument.querySelector(\"#role\").textContent = user.role;\nimg.src = user.photo;\nimg.alt = `Photo of ${user.name}`;\ndocument.querySelector(\"#email\").href = `mailto:${user.email}`;\ncard.dataset.userId = user.id;\n" },
          hint: "data-user-id in HTML becomes dataset.userId in JavaScript: the dashes become camelCase.",
          successMessage: "A card driven entirely by data. Change the user object and the card follows, which is the idea every front-end framework is built on.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 93 · 20.7 – 20.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l93-styles-create",
    moduleId: "wd-m20-dom",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["20.7", "20.8", "20.9", "20.10"],
    title: "Styles, Classes and Creating Elements",
    subtitle: "Changing how things look, and building new elements from data",
    estimatedMinutes: 26,
    intro: "Lists that grow as data arrives, items that cross out when they are done, a counter that updates: this lesson builds page content from an array, the pattern behind nearly every interactive page.",

    atoms: [
      {
        id: "a-wd-styles-classes",
        title: "Changing styles and classes",
        explain:
          "element.style sets inline styles one property at a time, with camelCase names and string values: box.style.backgroundColor = \"green\", bar.style.width = `${percent}%`. Use it only for values calculated at runtime. For everything else, change a class and let the stylesheet do the styling: the look stays in CSS, and JavaScript only says what is true (this item is sold out).",
        example: "bar.style.width = `${percent}%`;          // a calculated value: fine\nitem.className = \"product sold-out\";       // replaces ALL classes\nitem.classList.add(\"sold-out\");            // adds one (next atom)",
      },
      {
        id: "a-wd-create-elements",
        title: "Creating elements dynamically",
        explain:
          "document.createElement(\"li\") makes a new, empty element that is not on the page yet. Set its text, classes and attributes while it is still detached, then attach it. Building elements this way, with textContent for the text, is safe for any data: nothing in the data can ever be treated as HTML.",
        example: "const li = document.createElement(\"li\");\nli.textContent = product.name;\nli.className = \"product\";\nli.dataset.id = product.id;\n// li exists but is not visible until it is appended",
      },
      {
        id: "a-wd-append-remove",
        title: "Appending and removing elements",
        explain:
          "parent.append(child) adds a child at the end (prepend adds at the start; before and after insert next to an element). element.remove() takes an element off the page. parent.replaceChildren() with no arguments empties it. A very common pattern is render(): empty the list, then rebuild it from the array, so the page always matches the data.",
      },
      {
        id: "a-wd-classlist",
        title: "Understanding classList",
        explain:
          "classList manages an element's classes without disturbing the others: add, remove, contains, and toggle, which adds a class if missing and removes it if present. toggle(name, condition) adds it when condition is true and removes it when false, perfect when rendering from data: li.classList.toggle(\"sold-out\", product.stock === 0).",
        webLab: {
          task:
            "Render the products array into the #products list. For each product create an li with the class product, text such as \"Rice, 5kg · ₦9500\", and a data-id attribute; add the class sold-out when its stock is 0, using classList. Then show \"2 of 3 in stock\" in the #count paragraph, calculated from the array.",
          files: { "index.html": LIST_HTML, "style.css": LIST_CSS, "app.js": PRODUCTS + "\n// Render the list here\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "There is one li.product per product, in order", check: "const li = $$('#products > li.product'); return li.length === 3 && text(li[0]) === 'Rice, 5kg · ₦9500' && text(li[2]) === 'Phone charger · ₦4500';", fail: "For each product: createElement(\"li\"), set textContent and the product class, then append it to #products." },
            { label: "Each li carries its product's data-id", check: "return $$('#products > li').map((l) => l.dataset.id).join() === '1,2,3';", fail: "li.dataset.id = product.id;" },
            { label: "Only the product with no stock is marked sold-out, and it looks it", check: "const li = $$('#products > li'); return li[1].classList.contains('sold-out') && !li[0].classList.contains('sold-out') && !li[2].classList.contains('sold-out') && style(li[1], 'text-decoration-line') === 'line-through';", fail: "li.classList.toggle(\"sold-out\", product.stock === 0);" },
            { label: "The count reads \"2 of 3 in stock\", calculated", check: "return text('#count') === '2 of 3 in stock' && !/2 of 3/.test(code('app.js'));", fail: "Count products with stock > 0 using filter, and build the text from the numbers." },
            { label: "Text is set with textContent, not innerHTML", check: "return !/innerHTML/.test(code('app.js'));", fail: "Use textContent for data: it can never be interpreted as HTML." },
          ],
          solution: { "app.js": PRODUCTS + "\nconst list = document.querySelector(\"#products\");\n\nfor (const product of products) {\n  const li = document.createElement(\"li\");\n  li.className = \"product\";\n  li.textContent = `${product.name} · ₦${product.price}`;\n  li.dataset.id = product.id;\n  li.classList.toggle(\"sold-out\", product.stock === 0);\n  list.append(li);\n}\n\nconst inStock = products.filter((p) => p.stock > 0).length;\ndocument.querySelector(\"#count\").textContent = `${inStock} of ${products.length} in stock`;\n" },
          hint: "The · character can be typed directly inside a template literal: `${product.name} · ₦${product.price}`.",
          successMessage: "A list built entirely from data. Add a product to the array and it appears, correctly styled and counted.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 94 · 20.11 – 20.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l94-traversal-efficiency",
    moduleId: "wd-m20-dom",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["20.11", "20.12"],
    title: "DOM Traversal and Efficient Updates",
    subtitle: "Moving around the tree, and changing a lot of it without slowing the page",
    estimatedMinutes: 24,
    intro: "Elements know their neighbours. Moving from a button to the row it belongs to is the basis of the event delegation you will meet next module. And when hundreds of elements change, how you change them decides whether the page stays smooth.",

    atoms: [
      {
        id: "a-wd-traversal",
        title: "DOM traversal",
        explain:
          "From any element you can move around the tree. parentElement is the element containing it; children lists the elements inside; firstElementChild and lastElementChild are the ends; nextElementSibling and previousElementSibling are its neighbours. element.closest(selector) walks UP to the nearest ancestor (or itself) that matches, which is the most useful of all: from a Remove button, button.closest(\"tr\") is its row, however deeply it is nested.",
        table: {
          caption: "Moving around the tree.",
          headers: ["Property or method", "Gives"],
          rows: [
            ["el.parentElement", "The element containing el"],
            ["el.children", "The elements inside el (an HTMLCollection)"],
            ["el.nextElementSibling", "The next element at the same level"],
            ["el.closest(\"tr\")", "The nearest ancestor (or el itself) matching tr"],
            ["el.querySelector(\".score\")", "The first matching element inside el"],
          ],
        },
      },
      {
        id: "a-wd-efficient-updates",
        title: "Efficient DOM updates",
        explain:
          "Each change to the page can make the browser recalculate layout. Appending 500 items one at a time to the live page is slow; building them in a DocumentFragment (an invisible container) and appending it once is one update. Likewise, avoid reading a layout value (offsetHeight, getBoundingClientRect) between writes in a loop, which forces a layout every time. And change only what changed: a whole re-render is fine for small lists, but not for thousands of rows.",
        example:
          "const fragment = document.createDocumentFragment();\nfor (const item of items) {\n  const li = document.createElement(\"li\");\n  li.textContent = item.name;\n  fragment.append(li);        // off the page: no layout work\n}\nlist.replaceChildren(fragment); // one update to the live page",
        webLab: {
          task:
            "Two jobs. (1) Traversal: in the results table, find the row with the highest score by reading each .score cell, and add the class top to that cell's ROW using closest. Then remove the row whose Remove button is in the first row, using closest from the button, not a fixed row index. (2) Efficiency: fill #big-list with 500 li elements, \"Item 1\" to \"Item 500\", building them in a DocumentFragment and appending it once.",
          files: {
            "index.html": TABLE_HTML,
            "style.css": "body { font-family: Arial, sans-serif; padding: 16px; }\n.top { background: #fef3c7; font-weight: 700; }\n#big-list { max-height: 120px; overflow: auto; }\n",
            "app.js": "// 1. Mark the top scorer's row with the class top\n\n// 2. Remove the first row using closest() from its Remove button\n\n// 3. Fill #big-list with 500 items using a DocumentFragment\n",
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Bayo's row, with the highest score, has the class top", check: "const top = $$('tbody tr.top'); return top.length === 1 && top[0].children[0].textContent === 'Bayo';", fail: "Find the .score cell with the largest number, then cell.closest(\"tr\").classList.add(\"top\")." },
            { label: "The top row was found with closest()", check: "return /closest\\(/.test(code('app.js'));", fail: "Use closest(\"tr\") to get from a cell or button to its row." },
            { label: "Ada's row was removed; the other two remain", check: "const names = $$('tbody tr').map((r) => r.children[0].textContent); return names.join() === 'Bayo,Chika';", fail: "Take the first .remove button and call button.closest(\"tr\").remove()." },
            { label: "#big-list has 500 items, Item 1 to Item 500", check: "const li = $$('#big-list > li'); return li.length === 500 && text(li[0]) === 'Item 1' && text(li[499]) === 'Item 500';", fail: "Loop from 1 to 500, creating an li for each." },
            { label: "The 500 items were built in a DocumentFragment", check: "return /createDocumentFragment\\(\\)|new DocumentFragment\\(\\)/.test(code('app.js'));", fail: "Append each li to document.createDocumentFragment(), then append the fragment to the list once." },
          ],
          solution: { "app.js": "// 1. Mark the top scorer's row with the class top\nconst cells = [...document.querySelectorAll(\".score\")];\nconst best = cells.reduce((a, b) => (Number(b.textContent) > Number(a.textContent) ? b : a));\nbest.closest(\"tr\").classList.add(\"top\");\n\n// 2. Remove the first row using closest() from its Remove button\ndocument.querySelector(\".remove\").closest(\"tr\").remove();\n\n// 3. Fill #big-list with 500 items using a DocumentFragment\nconst fragment = document.createDocumentFragment();\nfor (let i = 1; i <= 500; i++) {\n  const li = document.createElement(\"li\");\n  li.textContent = `Item ${i}`;\n  fragment.append(li);\n}\ndocument.querySelector(\"#big-list\").append(fragment);\n" },
          hint: "The scores are text: convert with Number() before comparing. Mark the top row before removing Ada's, or recalculate afterwards.",
          successMessage: "You moved from cells and buttons to their rows without hard-coding positions, and built 500 elements with one update to the page.",
        },
      },
    ],

    task: {
      title: "Module project: a rendered product list",
      intro: "On your own computer, build products.html with an array of at least eight products in app.js.",
      prompts: [
        "Write a render() function that empties the list and rebuilds it from the array with createElement and textContent.",
        "Mark sold-out products with a class, using classList.toggle with a condition.",
        "Show a live count (\"6 of 8 in stock\") and the total stock value, both calculated.",
        "Highlight the most expensive product's row using a traversal method.",
        "Build the list in a DocumentFragment, and check in the Performance panel that rendering 1,000 products stays fast.",
      ],
      closing: "Next module adds events: the list starts responding to clicks and typing.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
