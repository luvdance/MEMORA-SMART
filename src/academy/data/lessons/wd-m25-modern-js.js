/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 25 · MODERN JAVASCRIPT
 *
 * Curriculum 25.1 – 25.10. ES modules, import and export, optional chaining
 * and nullish coalescing, modern array and object patterns, Sets and Maps,
 * regular expressions, iterators and generators, the event loop, and
 * organising code by separating concerns. Module labs run as real ES modules:
 * each file is its own module and imports resolve to the lab's other files.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s25-modern-js";

const JS = "javascript";

const modulePage = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = "body { font-family: Arial, sans-serif; padding: 16px; }\n";

const CART_HTML = modulePage("Cart", "  <ul id=\"cart\"></ul>\n  <p id=\"total\"></p>");

const SPLIT_HTML = modulePage("Expenses", "  <h1>Expenses</h1>\n  <ul id=\"list\"></ul>\n  <p id=\"summary\"></p>");

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 110 · 25.1 – 25.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l110-modules",
    moduleId: "wd-m25-modern-js",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["25.1", "25.2"],
    title: "ES Modules, import and export",
    subtitle: "Splitting a program into files that share only what they choose to",
    estimatedMinutes: 24,
    intro: "Every script so far has lived in one file, sharing one global scope. Real applications have dozens of files. ES modules let each file keep its own variables private and share only what it exports.",

    atoms: [
      {
        id: "a-wd-es-modules",
        title: "ES modules",
        explain:
          "A module is a JavaScript file with its own scope: its top-level variables are private to it, not globals. Load one with <script type=\"module\" src=\"app.js\">. Modules are always in strict mode, are deferred automatically (they run after the HTML is parsed), and run once, however many files import them. They also need to be served over http (Live Server), not opened as a file:// page.",
        table: {
          caption: "Classic scripts and modules.",
          headers: ["", "Classic <script>", "<script type=\"module\">"],
          rows: [
            ["Top-level variables", "Global, shared by every script", "Private to the file"],
            ["Sharing code", "Through globals", "Through export and import"],
            ["Timing", "Runs immediately, unless defer", "Deferred automatically"],
            ["Strict mode", "Only if you ask", "Always"],
          ],
        },
      },
      {
        id: "a-wd-import-export",
        title: "import and export",
        explain:
          "export makes a name available to other files: export const VAT_RATE = 7.5; export function addVat(price) { … }. Another file imports exactly what it needs: import { addVat, VAT_RATE } from \"./prices.js\";. A file can also have one default export, imported without braces under any name: export default function render() { … } and import render from \"./render.js\";. The path must start with ./ (or ../) and include .js.",
        example: "// prices.js\nexport const VAT_RATE = 7.5;\nexport const addVat = (price) => price + (price * VAT_RATE) / 100;\n\n// format.js\nexport default function naira(amount) {\n  return \"₦\" + amount.toLocaleString(\"en-NG\");\n}\n\n// app.js\nimport { addVat } from \"./prices.js\";\nimport naira from \"./format.js\";\nconsole.log(naira(addVat(1000)));   // ₦1,075",
        webLab: {
          task:
            "Split the cart into modules. In prices.js, export a function lineTotal(item) (price × qty) and a function cartTotal(items) (the sum of the line totals). In format.js, export a DEFAULT function that formats a number as \"₦\" followed by the number. In app.js, import them, render each item into #cart as \"NAME: ₦LINE\" and show \"Total: ₦N\" in #total.",
          files: {
            "index.html": CART_HTML,
            "style.css": CSS,
            "app.js": "const items = [\n  { name: \"Rice\", price: 9500, qty: 2 },\n  { name: \"Oil\", price: 2800, qty: 1 },\n];\n\n// Import from ./prices.js and ./format.js, then render\n",
            "prices.js": "// export lineTotal and cartTotal\n",
            "format.js": "// export default a function that formats naira\n",
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "The cart shows each line total", check: "await waitFor(() => $$('#cart li').length === 2); const li = $$('#cart li'); return text(li[0]) === 'Rice: ₦19000' && text(li[1]) === 'Oil: ₦2800';", fail: "In app.js, import the functions and create an li per item." },
            { label: "The total is shown", check: "await waitFor(() => text('#total') !== ''); return text('#total') === 'Total: ₦21800';", fail: "Show \"Total: \" + naira(cartTotal(items))." },
            { label: "prices.js exports lineTotal and cartTotal", check: "const c = code('prices.js'); return /export\\s+(const|function)\\s+lineTotal/.test(c) && /export\\s+(const|function)\\s+cartTotal/.test(c);", fail: "Write export function lineTotal(item) { … } and export function cartTotal(items) { … }." },
            { label: "format.js has a default export, imported without braces", check: "return /export\\s+default/.test(code('format.js')) && /import\\s+\\w+\\s+from\\s+[\"']\\.\\/format\\.js[\"']/.test(code('app.js'));", fail: "export default function naira(n) { … } and import naira from \"./format.js\";" },
            { label: "Nothing leaks into the global scope", check: "return typeof window.lineTotal === 'undefined' && typeof window.cartTotal === 'undefined' && errors().length === 0;", fail: "Module code is private; make sure every file is imported as a module and there are no errors." },
          ],
          solution: {
            "app.js": "const items = [\n  { name: \"Rice\", price: 9500, qty: 2 },\n  { name: \"Oil\", price: 2800, qty: 1 },\n];\n\nimport { lineTotal, cartTotal } from \"./prices.js\";\nimport naira from \"./format.js\";\n\nconst cart = document.querySelector(\"#cart\");\nfor (const item of items) {\n  const li = document.createElement(\"li\");\n  li.textContent = `${item.name}: ${naira(lineTotal(item))}`;\n  cart.append(li);\n}\ndocument.querySelector(\"#total\").textContent = `Total: ${naira(cartTotal(items))}`;\n",
            "prices.js": "export function lineTotal(item) {\n  return item.price * item.qty;\n}\n\nexport function cartTotal(items) {\n  return items.reduce((t, item) => t + lineTotal(item), 0);\n}\n",
            "format.js": "export default function naira(amount) {\n  return \"₦\" + amount;\n}\n",
          },
          hint: "import statements are hoisted, so they work even below the items array, but convention puts them at the top of the file.",
          successMessage: "Three files, each with one job, sharing only what they export. This is how every modern codebase is organised, including Vite projects in Module 27.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 111 · 25.3 – 25.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l111-optional-nullish",
    moduleId: "wd-m25-modern-js",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["25.3", "25.4", "25.5"],
    title: "Optional Chaining, Nullish Coalescing and Modern Patterns",
    subtitle: "Reading data that might be missing, and the newer tools that shorten everyday code",
    estimatedMinutes: 24,
    intro: "API data is full of gaps: a customer with no address, a product with no rating. Two small operators make missing data safe, and a handful of modern methods make common jobs one line.",

    atoms: [
      {
        id: "a-wd-optional-chaining",
        title: "Optional chaining",
        explain:
          "?. stops and gives undefined if the value on its left is null or undefined, instead of throwing. order.customer?.address?.city is undefined when there is no address, where order.customer.address.city would throw a TypeError. It works for calls (user.greet?.()) and indexes (list?.[0]) too. Use it where data may genuinely be missing, not to hide bugs everywhere.",
        codeExercise: {
          language: JS,
          code: 'const orders = [\n  { id: 1, customer: { address: { city: "Kano" } } },\n  { id: 2, customer: {} },\n  { id: 3 },\n];\nfor (const o of orders) {\n  console.log(o.id, o.customer?.address?.city);\n}\n',
          question: "What is printed for each order?",
          expectedOutput: "1 Kano\n2 undefined\n3 undefined",
          hint: "Each ?. stops safely as soon as it meets undefined.",
          successMessage: "No TypeErrors, even for the order with no customer at all.",
        },
      },
      {
        id: "a-wd-nullish",
        title: "Nullish coalescing",
        explain:
          "a ?? b gives b only when a is null or undefined. That is different from ||, which also replaces 0, \"\" and false. So quantity ?? 1 keeps a real 0, and settings.volume ?? 50 keeps a volume deliberately set to 0. Combine with optional chaining for defaults: user.address?.city ?? \"Unknown\". ??= assigns only if the variable is null or undefined.",
        codeExercise: {
          language: JS,
          code: "const settings = { volume: 0, theme: \"\", font: null };\nconsole.log(settings.volume || 50, settings.volume ?? 50);\nconsole.log(settings.theme || \"light\", settings.theme ?? \"light\");\nconsole.log(settings.font ?? \"Arial\");\n",
          question: "What does each line print?",
          expectedOutput: "50 0\nlight \nArial",
          hint: "|| replaces every falsy value; ?? replaces only null and undefined. The second value on line 2 is an empty string.",
          successMessage: "A volume of 0 is a real choice; ?? respects it and || does not.",
        },
      },
      {
        id: "a-wd-modern-patterns",
        title: "Modern array and object patterns",
        explain:
          "A few newer tools appear constantly in modern code. Object.entries(obj) gives [key, value] pairs to loop over; Object.fromEntries turns pairs back into an object. arr.at(-1) reads the last element. arr.flatMap(fn) maps and flattens one level. Object.groupBy(items, fn) groups items into an object by key. structuredClone(value) makes a deep copy, unlike spread's shallow one. Array.from({ length: 5 }, (_, i) => i + 1) builds [1, 2, 3, 4, 5].",
        webLab: {
          task:
            "Write four functions using these modern tools. cityOf(order) returns the order's customer.address.city, or \"Unknown\" if any part is missing, using ?. and ??. quantityOf(item) returns item.qty, or 1 only if qty is missing (a qty of 0 must stay 0). byCategory(products) uses Object.groupBy to group products by their category. priceList(prices) turns an object such as { rice: 9500, oil: 2800 } into an array of strings \"rice: ₦9500\" using Object.entries.",
          files: { "app.js": "function cityOf(order) {\n}\n\nfunction quantityOf(item) {\n}\n\nfunction byCategory(products) {\n}\n\nfunction priceList(prices) {\n}\n" },
          tests: [
            { label: "cityOf reads safely with a default", check: "return cityOf({ customer: { address: { city: 'Kano' } } }) === 'Kano' && cityOf({ customer: {} }) === 'Unknown' && cityOf({}) === 'Unknown' && cityOf({ customer: null }) === 'Unknown';", fail: "return order.customer?.address?.city ?? \"Unknown\";" },
            { label: "cityOf uses ?. and ??", check: "return /\\?\\./.test(code('app.js')) && /\\?\\?/.test(code('app.js'));", fail: "Use optional chaining and nullish coalescing." },
            { label: "quantityOf keeps a real 0", check: "return quantityOf({ qty: 3 }) === 3 && quantityOf({ qty: 0 }) === 0 && quantityOf({}) === 1;", fail: "return item.qty ?? 1; (|| would turn 0 into 1)." },
            { label: "byCategory groups with Object.groupBy", check: "const g = byCategory([{ name: 'a', category: 'food' }, { name: 'b', category: 'tech' }, { name: 'c', category: 'food' }]); return g.food.length === 2 && g.tech[0].name === 'b' && /Object\\.groupBy/.test(code('app.js'));", fail: "return Object.groupBy(products, (p) => p.category);" },
            { label: "priceList uses Object.entries", check: "return JSON.stringify(priceList({ rice: 9500, oil: 2800 })) === '[\"rice: ₦9500\",\"oil: ₦2800\"]' && /Object\\.entries/.test(code('app.js'));", fail: "return Object.entries(prices).map(([name, price]) => `${name}: ₦${price}`);" },
          ],
          solution: { "app.js": "function cityOf(order) {\n  return order.customer?.address?.city ?? \"Unknown\";\n}\n\nfunction quantityOf(item) {\n  return item.qty ?? 1;\n}\n\nfunction byCategory(products) {\n  return Object.groupBy(products, (p) => p.category);\n}\n\nfunction priceList(prices) {\n  return Object.entries(prices).map(([name, price]) => `${name}: ₦${price}`);\n}\n" },
          hint: "Destructuring works in the callback's parameters: ([name, price]) => …",
          successMessage: "Four one-line functions, each safer or shorter than the version you would have written a few years ago.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 112 · 25.6 – 25.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l112-sets-maps-regex",
    moduleId: "wd-m25-modern-js",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["25.6", "25.7"],
    title: "Sets, Maps and Regular Expressions",
    subtitle: "Collections for unique values and any kind of key, and patterns for text",
    estimatedMinutes: 26,
    intro: "Arrays and objects cover most data, but two jobs come up constantly: \"have I seen this before?\" and \"does this text match a pattern?\". Sets, Maps and regular expressions are built for exactly these.",

    atoms: [
      {
        id: "a-wd-sets-maps",
        title: "Sets and maps",
        explain:
          "A Set holds unique values: adding a value twice keeps one. set.has(x) answers \"is it in here?\" in one step however large the set, so [...new Set(list)] removes duplicates and a Set of seen ids replaces a slow nested loop. A Map holds key-value pairs like an object, but keys can be any type (numbers, objects), it remembers insertion order, and map.size gives the count. Use a Map when keys are not simple strings or you add and remove entries often.",
        codeExercise: {
          language: JS,
          code: 'const tags = ["food", "lagos", "food", "night", "lagos"];\nconst unique = new Set(tags);\nconsole.log(unique.size, unique.has("night"));\nconsole.log([...unique]);\nconst stock = new Map([["rice", 12], ["oil", 0]]);\nstock.set("beans", 5);\nconsole.log(stock.get("rice"), stock.size);\n',
          question: "What is printed?",
          expectedOutput: "3 true\n[ 'food', 'lagos', 'night' ]\n12 3",
          hint: "A Set keeps the first occurrence of each value, in order.",
          successMessage: "Duplicates gone in one line, and a Map with its own size and insertion order.",
        },
      },
      {
        id: "a-wd-regex",
        title: "Regular expressions",
        explain:
          "A regular expression describes a text pattern, written between slashes. \\d is a digit, \\w a letter, digit or underscore, \\s whitespace, . any character; + means one or more, * zero or more, {11} exactly eleven, ? optional; ^ and $ anchor the start and end; [abc] is any one of a, b or c; flags after the closing slash change behaviour: i ignores case, g finds all matches. pattern.test(text) gives true or false; text.match(pattern) finds matches; text.replace(pattern, x) replaces them.",
        table: {
          caption: "Patterns you will actually use.",
          headers: ["Pattern", "Matches"],
          rows: [
            ["/^\\d{11}$/", "Exactly 11 digits, such as a Nigerian phone number 08031234567"],
            ["/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/", "Something shaped like an email"],
            ["/\\s+/g", "Runs of whitespace (to collapse them)"],
            ["/[^a-z0-9]/gi", "Anything that is not a letter or digit"],
            ["/^(\\+234|0)[789][01]\\d{8}$/", "A Nigerian mobile number, local or +234"],
          ],
        },
        webLab: {
          task:
            "Write three functions. uniqueTags(tags) returns the tags with duplicates removed, in first-seen order, using a Set. isNigerianMobile(text) returns true for numbers such as 08031234567 or +2348031234567 (0 or +234, then 7, 8 or 9, then 0 or 1, then eight digits), ignoring spaces the user typed. collapseSpaces(text) trims the text and turns every run of whitespace into a single space, using a regular expression.",
          files: { "app.js": "function uniqueTags(tags) {\n}\n\nfunction isNigerianMobile(text) {\n}\n\nfunction collapseSpaces(text) {\n}\n" },
          tests: [
            { label: "uniqueTags removes duplicates, keeping order, with a Set", check: "return JSON.stringify(uniqueTags(['food', 'lagos', 'food', 'night', 'lagos'])) === '[\"food\",\"lagos\",\"night\"]' && /new Set/.test(code('app.js'));", fail: "return [...new Set(tags)];" },
            { label: "Valid mobile numbers pass, with or without spaces", check: "return ['08031234567', '+2348031234567', '0703 123 4567', '09011112222'].every(isNigerianMobile);", fail: "Remove spaces first, then test /^(\\+234|0)[789][01]\\d{8}$/." },
            { label: "Invalid numbers fail", check: "return !['0803123456', '080312345678', '06031234567', '08231234567', 'phone', ''].some(isNigerianMobile);", fail: "Anchor the pattern with ^ and $ so the whole string must match." },
            { label: "collapseSpaces tidies whitespace with a regular expression", check: "return collapseSpaces('  Plot 5,   Admiralty\\n Way  ') === 'Plot 5, Admiralty Way' && /\\/\\\\s\\+\\/g|\\\\s\\+/.test(raw('app.js'));", fail: "return text.trim().replace(/\\s+/g, \" \");" },
          ],
          solution: { "app.js": "function uniqueTags(tags) {\n  return [...new Set(tags)];\n}\n\nfunction isNigerianMobile(text) {\n  const digits = text.replace(/\\s+/g, \"\");\n  return /^(\\+234|0)[789][01]\\d{8}$/.test(digits);\n}\n\nfunction collapseSpaces(text) {\n  return text.trim().replace(/\\s+/g, \" \");\n}\n" },
          hint: "In a regular expression, + after \\s means \"one or more\"; \\+ means a literal plus sign.",
          successMessage: "Deduplication in one line and two patterns that real Nigerian sign-up forms need.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 113 · 25.8 – 25.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l113-generators-loop-organisation",
    moduleId: "wd-m25-modern-js",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["25.8", "25.9", "25.10"],
    title: "Generators, the Event Loop and Separation of Concerns",
    subtitle: "Values on demand, how JavaScript schedules work, and code that stays organised",
    estimatedMinutes: 26,
    intro: "Three ideas that tie the phase together: producing values one at a time, the scheduling model behind every callback and promise you have written, and the organising principle that keeps a growing application understandable.",

    atoms: [
      {
        id: "a-wd-generators",
        title: "Iterators and generators — introduction",
        explain:
          "An iterator is anything that can be stepped through with for...of: arrays, strings, Sets, Maps. A generator function, written function*, produces such a sequence lazily: each yield hands out one value and pauses until the next one is asked for. That makes infinite or expensive sequences cheap, such as an endless supply of order numbers, because values are only made when needed.",
        codeExercise: {
          language: JS,
          code: "function* orderNumbers(start) {\n  let n = start;\n  while (true) {\n    yield `ORD-${n}`;\n    n++;\n  }\n}\nconst ids = orderNumbers(1040);\nconsole.log(ids.next().value);\nconsole.log(ids.next().value);\nconsole.log(ids.next().value);\n",
          question: "The generator loops forever. What do the three calls print?",
          expectedOutput: "ORD-1040\nORD-1041\nORD-1042",
          hint: "Each next() runs the generator only until the next yield.",
          successMessage: "An infinite loop that never hangs, because a generator pauses at every yield until asked for more.",
        },
      },
      {
        id: "a-wd-event-loop",
        title: "Understanding the event loop",
        explain:
          "JavaScript runs one thing at a time on one thread. The event loop decides what runs next: first, all the code currently running (the call stack) finishes; then every waiting microtask runs (promise callbacks, awaits resuming); then ONE task from the task queue (a timer, a click handler, a network callback) runs, followed again by all microtasks, and the browser may repaint. That is why promises beat timers, why a long loop freezes clicks, and why splitting heavy work keeps pages responsive.",
        codeExercise: {
          language: JS,
          code: 'console.log("1 sync");\nsetTimeout(() => console.log("5 timer"), 0);\nPromise.resolve()\n  .then(() => console.log("3 microtask"))\n  .then(() => console.log("4 microtask"));\n(async () => {\n  console.log("2 sync, inside async");\n  await null;\n  console.log("3b after await");\n})();\n',
          question: "In what order do the lines print?",
          expectedOutput: "1 sync\n2 sync, inside async\n3 microtask\n3b after await\n4 microtask\n5 timer",
          hint: "An async function runs synchronously until its first await. Code after the await resumes as a microtask.",
          successMessage: "Stack first, then microtasks in the order they were queued, then the timer. Every async bug you will meet makes sense against this model.",
        },
      },
      {
        id: "a-wd-separation-of-concerns",
        title: "Code organization and separation of concerns",
        explain:
          "Separation of concerns means each part of the code has one job and does not know more than it must about the others. A typical frontend splits into data (fetching and storage), logic (pure functions: totals, validation, filtering), state (the current data) and view (rendering to the DOM and wiring events). Logic never touches the DOM, so it is testable in Node; the view never calculates, so it is easy to change. Modules make the boundaries real.",
        webLab: {
          task:
            "This expense page is one tangled file. Split it into three modules: logic.js exports pure functions total(expenses) and biggest(expenses) (no DOM at all); view.js exports a default render(expenses, summary) function that fills #list and #summary; app.js holds the data, imports both, and calls render. The page must look the same: each expense as \"TITLE: ₦AMOUNT\", and the summary \"Total ₦12300 · biggest: Rent\".",
          files: {
            "index.html": SPLIT_HTML,
            "style.css": CSS,
            "app.js": "const expenses = [\n  { title: \"Rent\", amount: 8000 },\n  { title: \"Food\", amount: 3500 },\n  { title: \"Data\", amount: 800 },\n];\n\nconst list = document.querySelector(\"#list\");\nlet total = 0;\nlet biggest = expenses[0];\nfor (const e of expenses) {\n  total += e.amount;\n  if (e.amount > biggest.amount) biggest = e;\n  const li = document.createElement(\"li\");\n  li.textContent = `${e.title}: ₦${e.amount}`;\n  list.append(li);\n}\ndocument.querySelector(\"#summary\").textContent = `Total ₦${total} · biggest: ${biggest.title}`;\n",
            "logic.js": "",
            "view.js": "",
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "The page still shows every expense and the summary", check: "await waitFor(() => $$('#list li').length === 3); return text($$('#list li')[0]) === 'Rent: ₦8000' && text('#summary') === 'Total ₦12300 · biggest: Rent';", fail: "render should produce exactly what the original code produced." },
            { label: "logic.js exports total and biggest, with no DOM code", check: "const c = code('logic.js'); return /export\\s+(const|function)\\s+total/.test(c) && /export\\s+(const|function)\\s+biggest/.test(c) && !/document|querySelector|textContent/.test(c);", fail: "Move the calculations to logic.js as exported pure functions, with no DOM access." },
            { label: "view.js has a default export and does no calculating", check: "const c = code('view.js'); return /export\\s+default/.test(c) && /document/.test(c) && !/reduce|\\+=/.test(c);", fail: "view.js: export default function render(expenses, summary) { … }, using values it is given." },
            { label: "app.js imports both and no longer builds the DOM itself", check: "const c = code('app.js'); return /from\\s+[\"']\\.\\/logic\\.js[\"']/.test(c) && /from\\s+[\"']\\.\\/view\\.js[\"']/.test(c) && !/createElement/.test(c);", fail: "app.js should only hold the data, import, and call render." },
            { label: "No errors", check: "await waitFor(() => $$('#list li').length === 3); return errors().length === 0;", fail: "Check every import path starts with ./ and ends with .js." },
          ],
          solution: {
            "app.js": "import { total, biggest } from \"./logic.js\";\nimport render from \"./view.js\";\n\nconst expenses = [\n  { title: \"Rent\", amount: 8000 },\n  { title: \"Food\", amount: 3500 },\n  { title: \"Data\", amount: 800 },\n];\n\nrender(expenses, { total: total(expenses), biggest: biggest(expenses).title });\n",
            "logic.js": "export function total(expenses) {\n  return expenses.reduce((t, e) => t + e.amount, 0);\n}\n\nexport function biggest(expenses) {\n  return expenses.reduce((a, b) => (b.amount > a.amount ? b : a));\n}\n",
            "view.js": "export default function render(expenses, summary) {\n  const list = document.querySelector(\"#list\");\n  list.replaceChildren();\n  for (const e of expenses) {\n    const li = document.createElement(\"li\");\n    li.textContent = `${e.title}: ₦${e.amount}`;\n    list.append(li);\n  }\n  document.querySelector(\"#summary\").textContent = `Total ₦${summary.total} · biggest: ${summary.biggest}`;\n}\n",
          },
          hint: "Decide what render needs to be told (the list, the total, the biggest title) and compute those in app.js using logic.js.",
          successMessage: "Same page, now in three files with one job each. logic.js could be tested in Node or reused on a server without a single change.",
        },
      },
    ],

    task: {
      title: "Module project: an application split into modules",
      intro: "Take your expense tracker or task list from Modules 23 and 24 and restructure it.",
      prompts: [
        "storage.js: load() and save(), with safe JSON handling.",
        "logic.js: pure functions only (totals, filtering, validation), with no DOM and no storage.",
        "view.js: render functions and event wiring.",
        "app.js: the state, and the glue that connects the other three.",
        "Use ?., ??, a Set or Map where they genuinely help, and draw a diagram of which module imports which.",
      ],
      closing: "Phase 4's projects build complete applications with everything from Modules 20 to 25.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
