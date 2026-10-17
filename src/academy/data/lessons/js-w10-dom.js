/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 10 · DOM MANIPULATION
 *
 * Curriculum 10.1 – 10.8. Phase 5: JavaScript in the browser.
 *
 * DOM code needs a browser, so it cannot be executed by the content validator
 * in Node. It is therefore shown as worked `example` text with the result
 * described, and every GRADED practice in this week works on the pure logic
 * underneath — building markup, escaping text, choosing what to render — which
 * is real JavaScript the validator does run. That is also the right design
 * lesson: keep the logic in plain functions, and keep the DOM code thin.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s10-dom";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 10.1 – 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l35-the-dom",
    moduleId: "js-w10-dom",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "The DOM",
    subtitle: "The web page as a tree of objects you can change",
    estimatedMinutes: 16,
    intro:
      "Everything so far has printed to a console. Real users never see a console; they see a web page. The DOM is how JavaScript reaches into that page and changes it, and you already know most of what you need, because the DOM is made of objects.",

    atoms: [
      {
        id: "a-js-what-is-dom",
        title: "What the DOM is",
        explain:
          "When a browser loads an HTML page, it builds the Document Object Model: a tree of objects, one for every element, attribute and piece of text. JavaScript cannot touch the HTML file, but it can change this tree, and the browser redraws the page to match immediately. The whole tree starts at one object called document.",
        example:
          "This HTML:\n\n  <body>\n    <h1 id=\"title\">Tasks</h1>\n    <ul class=\"list\">\n      <li>Buy rice</li>\n      <li>Call Mum</li>\n    </ul>\n  </body>\n\nbecomes this tree of objects:\n\n  document\n   └── body\n        ├── h1  (id=\"title\")\n        │    └── \"Tasks\"\n        └── ul  (class=\"list\")\n             ├── li\n             │    └── \"Buy rice\"\n             └── li\n                  └── \"Call Mum\"",
        why: "Each element is an object with properties (its text, its classes, its style) and methods (to add children, remove itself, listen for clicks). Everything from Week 8 about objects applies: you read and set properties, and you call methods.",
      },
      {
        id: "a-js-running-in-page",
        title: "Running JavaScript on a page",
        explain:
          "Put your code in a separate .js file and link it at the end of the HTML body, or in the head with the defer attribute. Both guarantee the page's elements exist before your code tries to find them. To try things quickly, open the page and use the browser console from Week 3.",
        example:
          "index.html\n\n  <!DOCTYPE html>\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Tasks</title>\n    <script src=\"app.js\" defer></script>\n  </head>\n  <body>\n    <h1 id=\"title\">Tasks</h1>\n  </body>\n  </html>\n\napp.js\n\n  console.log(document.title);   // Tasks\n\nOpen index.html in the browser, or better, use the free\nLive Server extension in VS Code so the page reloads when you save.",
        mistake:
          "Putting a plain <script src=\"app.js\"></script> in the head without defer. It runs before the body exists, document.querySelector finds nothing, and you get \"Cannot read properties of null\".",
      },
      {
        id: "a-js-query-selector",
        title: "Selecting elements",
        explain:
          "document.querySelector(selector) returns the FIRST element matching a CSS selector, or null if none matches. document.querySelectorAll(selector) returns ALL matches as a list you can loop through with for…of or forEach. The selectors are the ones you use in CSS: \"#id\", \".class\", \"tag\", and combinations like \"ul.list li\".",
        table: {
          caption: "Selecting, in four lines.",
          headers: ["Code", "Returns"],
          rows: [
            ["document.querySelector(\"#title\")", "The element with id=\"title\", or null"],
            ["document.querySelector(\".list li\")", "The first li inside .list"],
            ["document.querySelectorAll(\".list li\")", "Every li inside .list (a NodeList)"],
            ["document.getElementById(\"title\")", "An older equivalent of querySelector(\"#title\")"],
          ],
        },
        example:
          "const title = document.querySelector(\"#title\");\nconst items = document.querySelectorAll(\".list li\");\n\nconsole.log(title.textContent);   // Tasks\nconsole.log(items.length);        // 2\n\nconst missing = document.querySelector(\"#nope\");\nconsole.log(missing);             // null",
        why: "querySelector returns null rather than throwing when nothing matches. The error comes one line later when you try missing.textContent. When you see \"Cannot read properties of null\", check your selector first: a missing # or . is the usual cause.",
      },
      {
        id: "a-js-read-change-text",
        title: "Reading and changing text and HTML",
        explain:
          "textContent reads or replaces the text inside an element, treating whatever you give it as plain text. innerHTML reads or replaces the HTML inside an element, so tags in the string become real elements. Setting either one replaces everything that was inside.",
        example:
          "<p id=\"msg\">Hello</p>\n\nconst msg = document.querySelector(\"#msg\");\n\nmsg.textContent = \"Saved <b>3</b> tasks\";\n  → the page shows:   Saved <b>3</b> tasks     (the tags as text)\n\nmsg.innerHTML = \"Saved <b>3</b> tasks\";\n  → the page shows:   Saved 3 tasks            (3 in bold)",
        decision: {
          scenario:
            "Your page shows a welcome message containing the user's name, which they typed into a sign-up form.",
          question: "Which line should you use?",
          options: [
            {
              id: "a",
              text: "greeting.textContent = `Welcome, ${name}`;",
              why: "textContent never interprets the string as HTML, so whatever the user typed is shown exactly as text. If their \"name\" contains a tag or a script, it is displayed harmlessly. Lesson 37 shows what goes wrong with the other option.",
            },
            {
              id: "b",
              text: "greeting.innerHTML = `Welcome, ${name}`;",
              whyWrong: "This turns anything the user typed into real HTML. A name like <img src=x onerror=…> would run code on your page. Never put user input into innerHTML.",
            },
            {
              id: "c",
              text: "document.write(`Welcome, ${name}`);",
              whyWrong: "document.write is an obsolete API that can wipe the page if called after it loads, and it has the same HTML-injection problem as innerHTML.",
            },
            {
              id: "d",
              text: "console.log(`Welcome, ${name}`);",
              whyWrong: "That prints to the developer console, which users never see.",
            },
          ],
          correct: "a",
          aftermath: "The rule this course uses: textContent for anything that came from a user or an API; innerHTML only for markup you wrote yourself.",
        },
      },
      {
        id: "a-js-render-function",
        title: "Keep the logic outside the DOM",
        explain:
          "The DOM is slow to test and only exists in a browser. So good front-end code keeps the decisions in plain functions that take data and return values, and keeps the DOM code to a thin final step that puts those values on the page. You can then test the logic anywhere, including in Node.",
        codeExercise: {
          language: JS,
          code: 'function statusText(tasks) {\n  const done = tasks.filter((t) => t.done).length;\n  if (tasks.length === 0) return "No tasks yet";\n  if (done === tasks.length) return "All done!";\n  return `${done} of ${tasks.length} done`;\n}\n\nconsole.log(statusText([]));\nconsole.log(statusText([{ done: true }, { done: false }, { done: true }]));\nconsole.log(statusText([{ done: true }]));\n\n// In the page, the DOM step is one line:\n// document.querySelector("#status").textContent = statusText(tasks);\n',
          question: "statusText decides what the status line on a task page should say. What does it return for each call?",
          expectedOutput: "No tasks yet\n2 of 3 done\nAll done!",
          hint: "The empty check comes first. Then count the done tasks.",
          successMessage: "Exactly. All the thinking is in a function you just tested without a browser. The DOM part is a single assignment, and it is very hard to get one assignment wrong.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 10.4 – 10.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l36-styles-elements",
    moduleId: "js-w10-dom",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5", "10.6"],
    title: "Styles, New Elements and Moving Around the Tree",
    subtitle: "classList, createElement, append, remove and traversal",
    estimatedMinutes: 17,
    intro:
      "Changing text is half the job. The other half is changing how things look, adding new elements as data arrives, removing old ones, and moving from one element to its neighbours.",

    atoms: [
      {
        id: "a-js-classlist",
        title: "Modifying CSS classes",
        explain:
          "The best way to change how an element looks is to add or remove a CSS class and let your stylesheet do the styling. element.classList has add, remove, toggle and contains. toggle adds the class if it is missing and removes it if it is there, which is perfect for on/off states like \"completed\".",
        example:
          "/* style.css */\n.done { text-decoration: line-through; color: #888; }\n\n// app.js\nconst item = document.querySelector(\"li\");\n\nitem.classList.add(\"done\");         // crossed out\nitem.classList.contains(\"done\");    // true\nitem.classList.toggle(\"done\");      // back to normal\nitem.classList.toggle(\"done\");      // crossed out again\nitem.classList.remove(\"done\");      // normal",
        why: "Classes keep the look in CSS and the behaviour in JavaScript. A designer can change what \"done\" looks like without touching your code, and your code says what is true about the item, not how it should be painted.",
      },
      {
        id: "a-js-style-property",
        title: "Changing style directly",
        explain:
          "element.style sets inline styles one property at a time. CSS property names with dashes become camelCase: background-color is style.backgroundColor. Values are strings, including the unit. Use it for values calculated at runtime, such as a progress bar's width; use classes for everything else.",
        example:
          "const bar = document.querySelector(\".progress\");\nconst percent = 65;\n\nbar.style.width = `${percent}%`;\nbar.style.backgroundColor = percent >= 50 ? \"green\" : \"orange\";",
        codeExercise: {
          language: JS,
          code: 'function barStyle(done, total) {\n  const percent = total === 0 ? 0 : Math.round((done / total) * 100);\n  return {\n    width: `${percent}%`,\n    backgroundColor: percent >= 50 ? "green" : "orange",\n  };\n}\n\nconsole.log(barStyle(2, 3));\nconsole.log(barStyle(1, 4));\nconsole.log(barStyle(0, 0));\n',
          question: "This calculates the style for a progress bar. The page would apply it with Object.assign(bar.style, barStyle(done, total)). What is printed?",
          expectedOutput: "{ width: '67%', backgroundColor: 'green' }\n{ width: '25%', backgroundColor: 'orange' }\n{ width: '0%', backgroundColor: 'orange' }",
          hint: "2 / 3 is about 66.7%, rounded. Notice the guard for a total of 0, which would otherwise divide by zero.",
          successMessage: "67%, 25%, and a safe 0% for an empty list. The style is calculated and tested as data; the DOM only receives the answer.",
        },
      },
      {
        id: "a-js-create-append",
        title: "Creating, appending and removing elements",
        explain:
          "document.createElement(\"li\") makes a new, empty element that is not on the page yet. Set its text and classes, then attach it with parent.append(child), which adds it as the last child. element.remove() takes an element off the page. This is how lists grow and shrink as the user works.",
        example:
          "<ul id=\"tasks\"></ul>\n\nconst list = document.querySelector(\"#tasks\");\n\nconst li = document.createElement(\"li\");\nli.textContent = \"Buy rice\";\nli.classList.add(\"task\");\nlist.append(li);           // now on the page\n\nconst li2 = document.createElement(\"li\");\nli2.textContent = \"Call Mum\";\nlist.prepend(li2);         // added as the FIRST child\n\nli.remove();               // \"Buy rice\" is gone",
        why: "createElement plus textContent is the safe way to build elements from data: nothing in the text is ever treated as HTML. It is a few more lines than innerHTML, and it can never be exploited.",
      },
      {
        id: "a-js-traversal",
        title: "Traversing the DOM",
        explain:
          "Every element knows its place in the tree. parentElement is the element containing it; children is a list of the elements inside it; nextElementSibling and previousElementSibling are its neighbours. element.closest(selector) walks UP the tree to the nearest ancestor that matches, which is the most useful of them all.",
        example:
          "<ul id=\"tasks\">\n  <li class=\"task\"><span>Buy rice</span> <button>Delete</button></li>\n  <li class=\"task\"><span>Call Mum</span> <button>Delete</button></li>\n</ul>\n\nconst button = document.querySelector(\"button\");\n\nbutton.parentElement;                 // the first <li>\nbutton.closest(\".task\");              // the same <li>\nbutton.closest(\"#tasks\");             // the <ul>\nbutton.parentElement.nextElementSibling;   // the second <li>\ndocument.querySelector(\"#tasks\").children.length;   // 2",
        why: "When a Delete button is clicked, you need the task it belongs to. button.closest(\".task\") finds it no matter how the button is nested inside, which you will use next week with event delegation.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 10.7 – 10.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l37-dynamic-lists-safely",
    moduleId: "js-w10-dom",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.7", "10.8"],
    title: "Dynamic Lists, Rendered Safely",
    subtitle: "Data first, then render, and never trust innerHTML with input",
    estimatedMinutes: 18,
    intro:
      "A task manager, a chat, a product list: every interactive page is a list that changes. This lesson gives you the one pattern that keeps such pages correct, and the one security rule that keeps them safe.",

    atoms: [
      {
        id: "a-js-state-render",
        title: "Keep the data, then render from it",
        explain:
          "Do not treat the page as the place your data lives. Keep the real data in a JavaScript array of objects, often called the state. Whenever it changes, clear the list and rebuild it from the array with a render function. The page is then always an exact picture of the data, and the data is easy to save, filter and test.",
        example:
          "let tasks = [\n  { id: 1, title: \"Buy rice\", done: false },\n  { id: 2, title: \"Call Mum\", done: true },\n];\n\nfunction render() {\n  const list = document.querySelector(\"#tasks\");\n  list.replaceChildren();               // remove every old <li>\n  for (const task of tasks) {\n    const li = document.createElement(\"li\");\n    li.textContent = task.title;\n    li.classList.toggle(\"done\", task.done);\n    li.dataset.id = task.id;           // becomes data-id=\"1\"\n    list.append(li);\n  }\n}\n\nfunction addTask(title) {\n  tasks.push({ id: Date.now(), title, done: false });\n  render();\n}\n\nrender();",
        why: "Every change follows the same two steps: update the array, call render. You never have to work out which single <li> to patch, which is where bugs in hand-patched pages come from. React, in Week 15, is this exact idea made automatic.",
      },
      {
        id: "a-js-state-updates",
        title: "Updating the data",
        explain:
          "With data kept in an array, add, edit, delete and complete are all ordinary array work from Week 8. Each function changes the data and returns nothing to the page; render does the rest.",
        codeExercise: {
          language: JS,
          code: 'let tasks = [\n  { id: 1, title: "Buy rice", done: false },\n  { id: 2, title: "Call Mum", done: false },\n  { id: 3, title: "Read", done: false },\n];\n\nconst toggle = (id) => {\n  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));\n};\nconst remove = (id) => {\n  tasks = tasks.filter((t) => t.id !== id);\n};\nconst rename = (id, title) => {\n  tasks = tasks.map((t) => (t.id === id ? { ...t, title } : t));\n};\n\ntoggle(2);\nremove(1);\nrename(3, "Read chapter 4");\nfor (const t of tasks) {\n  console.log(`${t.id} ${t.title} ${t.done}`);\n}\n',
          question: "Three updates are applied to the task list, then each remaining task is printed as id, title, done. What is printed?",
          expectedOutput: "2 Call Mum true\n3 Read chapter 4 false",
          hint: "Task 2 is marked done, task 1 is removed, task 3 is renamed.",
          successMessage: "Every update built a new array with map or filter and spread, instead of changing objects in place. That makes each change easy to undo, save or compare, and it is exactly how React state is updated.",
        },
      },
      {
        id: "a-js-xss",
        title: "Why innerHTML with user input is dangerous",
        explain:
          "If text a user typed is put into innerHTML, the browser treats it as HTML. A user, or an attacker, can type markup that runs JavaScript on your page, in the session of everyone who views it. This is called cross-site scripting, or XSS, and it is consistently among the most common serious vulnerabilities on the web.",
        example:
          "A task titled:\n\n  <img src=x onerror=\"alert('hacked')\">\n\nRendered with innerHTML:\n\n  li.innerHTML = task.title;\n  → the browser creates an <img>, it fails to load,\n    and onerror runs the attacker's code.\n\nRendered with textContent:\n\n  li.textContent = task.title;\n  → the page shows the characters  <img src=x onerror=\"alert('hacked')\">\n    as plain text. Nothing runs.",
        why: "The attacker's code would run with the same access as yours: it could read what is on the page, act as the logged-in user, or send their data elsewhere. The fix is not clever; it is a habit: user data goes in textContent.",
      },
      {
        id: "a-js-escaping",
        title: "Escaping, when you must build HTML",
        explain:
          "Sometimes you genuinely need to build a string of HTML, for example a template for a whole card. Then every piece of data inserted into it must be escaped first: the five characters with meaning in HTML are replaced by entities that display the character without acting as markup.",
        codeExercise: {
          language: JS,
          code: 'function escapeHtml(text) {\n  return String(text)\n    .replaceAll("&", "&amp;")\n    .replaceAll("<", "&lt;")\n    .replaceAll(">", "&gt;")\n    .replaceAll(\'"\', "&quot;")\n    .replaceAll("\'", "&#39;");\n}\n\nconst title = "<b>Fish & chips</b>";\nconsole.log(escapeHtml(title));\nconsole.log(`<li class="task">${escapeHtml("Tom\'s list")}</li>`);\n',
          question: "escapeHtml replaces the five special characters. What is printed?",
          expectedOutput: "&lt;b&gt;Fish &amp; chips&lt;/b&gt;\n<li class=\"task\">Tom&#39;s list</li>",
          hint: "& is replaced first, so the & inside the other entities is not escaped twice. Only the inserted data is escaped, not the template's own tags.",
          successMessage:
            "The data is now harmless text, and the template's own <li> is still real markup. Notice & is replaced FIRST: done last, it would turn every &lt; into &amp;lt;.",
        },
      },
      {
        id: "a-js-safe-render-choice",
        title: "Choosing a safe rendering approach",
        explain:
          "You now have three ways to put data on a page: createElement with textContent, innerHTML with escaped data, and innerHTML with raw data. Only the first two are acceptable for anything that came from a user, a database or an API, and the first is the safest because it cannot be forgotten.",
        decision: {
          scenario:
            "A product page shows reviews submitted by customers. Each review has a name, a star rating and a comment.",
          question: "How should each review be rendered?",
          options: [
            {
              id: "a",
              text: "createElement for each part, with name and comment set through textContent",
              why: "Nothing a customer types can ever be interpreted as HTML, and there is no escaping step to forget. It is a few more lines and it is safe by construction.",
            },
            {
              id: "b",
              text: "One innerHTML template string with the raw name and comment inserted",
              whyWrong: "Any review containing markup becomes live HTML on the page for every visitor. This is the classic stored XSS vulnerability.",
            },
            {
              id: "c",
              text: "innerHTML, but remove the word \"script\" from comments first",
              whyWrong: "Blocking one word is not escaping. Attacks do not need a <script> tag, as the onerror example showed. Partial filters are bypassed routinely.",
            },
            {
              id: "d",
              text: "innerHTML for the comment, because comments may need line breaks",
              whyWrong: "Line breaks do not need HTML. Use textContent with the CSS white-space: pre-line, and the line breaks show safely.",
            },
          ],
          correct: "a",
          aftermath: "Treat every string that did not come from your own source code as untrusted. That single rule prevents the most common vulnerability on the web, and you met its server-side twin, SQL injection, in the cybersecurity course.",
        },
      },
    ],

    task: {
      title: "Mini-project: interactive task manager",
      intro:
        "Build a task manager page with index.html, style.css and app.js. Keep the tasks in an array of objects and render the list from it every time something changes.",
      prompts: [
        "Add: an input and an Add button that create a task. Ignore empty or whitespace-only titles.",
        "Complete: clicking a task toggles its done state, shown with a .done class that crosses it out.",
        "Edit: each task has an Edit button that replaces the title with the text from a prompt(), ignoring an empty answer or Cancel.",
        "Delete: each task has a Delete button that removes it from the array.",
        "Show a status line such as \"2 of 5 done\" calculated by a plain function, and render every title with textContent. Then try adding a task called <b>bold</b> and confirm it shows as text.",
      ],
      closing:
        "Your buttons will need click handling, which is next week's subject. For now use the onclick property on each button you create, for example button.onclick = () => removeTask(task.id). Next week shows a better way.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
