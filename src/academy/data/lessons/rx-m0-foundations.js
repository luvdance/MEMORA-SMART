/**
 * REACT DEVELOPMENT · MODULE 0 · WEB DEVELOPMENT FOUNDATIONS
 *
 * Curriculum 0.0 – 0.P. The technologies React is built on: how the web
 * works, HTML, CSS, JavaScript from values to modules, asynchronous code and
 * the developer's tools. React itself starts in Module 1; here the labs are
 * plain pages (index.html, style.css, app.js) and the JavaScript "what does
 * this print?" exercises are run in Node by the validator.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { REACT_COURSE } from "../reactCourse.js";

export const SECTION_ID = "rx-s0-foundations";
const MODULE = "rx-m0-foundations";
const JS = "javascript";

const page = (title, body, { module = false } = {}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script ${module ? 'type="module" ' : ""}src="app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\nbutton { min-height: 44px; }\n";

const modules = REACT_COURSE.months.flatMap((m) => m.modules);

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 0.0
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l1-welcome",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["0.0"],
    title: "Welcome to React Development",
    subtitle: "What you will build, the road ahead, and how the practice works",
    estimatedMinutes: 12,
    intro:
      "React is the most widely used way to build user interfaces for the web. Over sixteen weeks you will go from the platform React stands on to a deployed, tested application, and you will build something in almost every lesson.",

    atoms: [
      {
        id: "a-rx-welcome-build",
        title: "What you will be able to build",
        explain:
          "By the end of this course you will build the kind of application companies hire React developers for: a multi-page app with a catalogue, details pages, a dashboard and a profile; forms that validate input; data read from and written to an API; shared state such as a shopping cart; sign-in with protected pages; a responsive, accessible, themeable interface written in TypeScript; tests that prove it works; and a production deployment with a README a reviewer can follow. Every module ends with one practical assignment that builds a piece of that.",
        decision: {
          scenario:
            "A friend says: \"React is a programming language that replaces HTML, CSS and JavaScript, so you can skip learning those.\"",
          question: "What is accurate?",
          options: [
            {
              id: "a",
              text: "React is a JavaScript library. Everything it produces is still HTML, CSS and JavaScript running in the browser",
              why: "React components are JavaScript functions that describe HTML; styling is CSS. That is why Module 0 makes the platform solid first.",
            },
            { id: "b", text: "Correct: React replaces the web platform", whyWrong: "React runs on the web platform. It writes ordinary DOM elements and is styled with ordinary CSS." },
            { id: "c", text: "React is a CSS framework", whyWrong: "That describes libraries such as Bootstrap or Tailwind. React is about building interfaces from components in JavaScript." },
            { id: "d", text: "React only runs on servers", whyWrong: "React runs in the browser; it can also render on servers, but that is an addition, not the basis." },
          ],
          correct: "a",
          aftermath: "React is a library for building user interfaces out of components, written in JavaScript.",
        },
      },
      {
        id: "a-rx-welcome-phases",
        title: "Four phases, sixteen weeks",
        explain:
          "The course has four phases of four weeks. Each module is one week of work at about 8 to 12 hours, and ends with a practical assignment and a mastery checkpoint: a short check that you can explain what you built, not just make it run.",
        table: {
          caption: "The four phases.",
          headers: ["Phase", "Weeks", "What you learn"],
          rows: REACT_COURSE.phases.map((ph) => [`Phase ${ph.phase}`, `${ph.weeks[0]}–${ph.weeks[ph.weeks.length - 1]}`, ph.title]),
        },
        decision: {
          scenario: "You finish a module's practical assignment and the app works, but you could not explain why the list re-renders when you click a button.",
          question: "Is the module done?",
          options: [
            { id: "a", text: "Not yet: the mastery checkpoint asks you to explain it, so go back to the lesson on that idea", why: "Working code you cannot explain breaks the first time you change it. The checkpoint exists to catch exactly this." },
            { id: "b", text: "Yes: working code is all that matters", whyWrong: "In a real team you must change, debug and review code. That needs understanding, not just a passing result." },
            { id: "c", text: "Yes, and skip the next module's first lessons", whyWrong: "Later modules build on this idea directly." },
            { id: "d", text: "Copy an explanation from the internet", whyWrong: "The point is that you can explain it yourself." },
          ],
          correct: "a",
          aftermath: "Each module: build it, then make sure you can explain it.",
        },
      },
      {
        id: "a-rx-welcome-roadmap",
        title: "The whole road, module by module",
        explain:
          "Here is every module in order. Module 0, this week, is a review of the web platform. If you have finished Responsive Web Development (WD-101) it will feel familiar; if any part does not, slow down here, because every later module assumes it.",
        table: {
          caption: "Every module of the course.",
          headers: ["Module", "Week", "Topic"],
          rows: modules.map((m) => [m.title.split(" · ")[0], m.week, m.title.split(" · ")[1]]),
        },
        webLab: {
          task:
            "Your first lab. This is how practice works all course: edit the files on the left, the preview on the right updates, and Check my page tests the result in a real browser. Change the heading in index.html to say \"I am learning React\", and make app.js print \"Ready\" to the console.",
          files: {
            "index.html": page("Hello", "  <h1>Hello</h1>"),
            "style.css": CSS,
            "app.js": "// Print Ready to the console here\n",
          },
          tests: [
            { label: "The heading says \"I am learning React\"", check: "return text('h1') === 'I am learning React';", fail: "Change the text between <h1> and </h1>." },
            { label: "app.js prints \"Ready\"", check: "return output().trim() === 'Ready';", fail: "Use console.log(\"Ready\") in app.js." },
          ],
          solution: {
            "index.html": page("Hello", "  <h1>I am learning React</h1>"),
            "app.js": 'console.log("Ready");\n',
          },
          hint: "console.log(\"Ready\"); prints to the Console panel under the preview.",
          successMessage: "That is the whole loop: edit, look, check. Every lab works like this.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 0.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l2-web",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["0.1"],
    title: "How the Web Works",
    subtitle: "Browsers, servers, HTTP, and how code becomes a page",
    estimatedMinutes: 20,
    intro:
      "A React app is a set of files a server sends to a browser, and code that then runs in the browser. Knowing that journey tells you where every bug can live.",

    atoms: [
      {
        id: "a-rx-client-server",
        title: "Browser, server, client and HTTP requests",
        explain:
          "The browser is the CLIENT: it asks. A SERVER is a computer that answers. Each question is an HTTP request: a method (GET to read, POST to send data), a URL, headers and sometimes a body. Each answer is a response with a status code (200 OK, 404 Not Found, 500 Server Error), headers and a body: an HTML page, a CSS or JavaScript file, an image or JSON data. HTTPS is HTTP encrypted, so nobody between you and the server can read or change it. A React app is downloaded with requests like these, and then makes more of them itself to fetch data.",
        table: {
          caption: "One page load, as requests.",
          headers: ["Request", "Response"],
          rows: [
            ["GET /", "200 index.html"],
            ["GET /assets/index-4f2a.js", "200 the bundled JavaScript (your React app)"],
            ["GET /assets/index-9c1b.css", "200 the styles"],
            ["GET /api/courses", "200 JSON data the app asked for"],
          ],
        },
        decision: {
          scenario: "Your app shows \"Failed to load courses\". In DevTools → Network, the request GET /api/courses has status 500.",
          question: "Where is the problem most likely to be?",
          options: [
            { id: "a", text: "On the server: 5xx means the server failed while answering", why: "The request reached the server and the server reported its own error. The fix starts in the server's logs." },
            { id: "b", text: "In the CSS", whyWrong: "Styling cannot change a status code." },
            { id: "c", text: "The URL does not exist", whyWrong: "That would be 404. 500 means it exists and failed." },
            { id: "d", text: "The user is not logged in", whyWrong: "That is usually 401 or 403." },
          ],
          correct: "a",
          aftermath: "2xx success, 3xx redirect, 4xx the request was wrong, 5xx the server failed.",
        },
      },
      {
        id: "a-rx-three-languages",
        title: "HTML, CSS and JavaScript responsibilities",
        explain:
          "HTML is the content and its meaning: this is a heading, this is a list, this is a button. CSS is presentation: colour, spacing, layout, how it adapts to a phone. JavaScript is behaviour: what happens when someone clicks, types or when data arrives. React keeps that division. A component returns JSX, which becomes HTML elements; CSS styles them; and the component's JavaScript decides what to show and how to respond.",
        decision: {
          scenario: "A button must turn red when a form has an error, and show the text \"Fix 2 fields\".",
          question: "Which language does what?",
          options: [
            { id: "a", text: "JavaScript decides there is an error and adds a class and the text; CSS says what that class looks like", why: "Behaviour decides; CSS presents. Keeping colours in CSS means one place to change the design." },
            { id: "b", text: "CSS counts the errors", whyWrong: "CSS cannot run logic over form data." },
            { id: "c", text: "HTML turns it red on its own", whyWrong: "HTML has no idea the form has errors." },
            { id: "d", text: "JavaScript should set every colour inline", whyWrong: "It works, but scatters design decisions through the code and is harder to change." },
          ],
          correct: "a",
          aftermath: "Content in HTML, looks in CSS, behaviour in JavaScript. React components combine the three cleanly.",
        },
      },
      {
        id: "a-rx-how-browser-renders",
        title: "How a browser turns code into a visible page",
        explain:
          "The browser reads HTML from top to bottom and builds the DOM, a tree of objects, one per element. CSS is parsed and matched to the elements; layout works out sizes and positions; paint draws the pixels. A plain <script> runs the moment the parser reaches it, BEFORE the elements below it exist, so code at the top of the page that looks for an element further down finds null. A script with defer (or type=\"module\", which defers automatically) waits until the whole document is parsed. That is why Vite's index.html loads React with type=\"module\" at the end of the body.",
        webLab: {
          task:
            "app.js runs in <head>, before the <h1> exists, so it crashes with \"Cannot set properties of null\". Fix it without moving the code: make the script wait until the page has been parsed.",
          files: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js"></script>
</head>
<body>
  <h1 id="title">Loading…</h1>
</body>
</html>
`,
            "style.css": CSS,
            "app.js": 'document.querySelector("#title").textContent = "Welcome, Ada";\n',
          },
          readOnly: ["app.js", "style.css"],
          tests: [
            { label: "The heading says \"Welcome, Ada\"", check: "return text('#title') === 'Welcome, Ada';", fail: "The script still runs before the heading exists." },
            { label: "No errors in the console", check: "return errors().length === 0;", fail: "Add defer to the <script> tag." },
          ],
          solution: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
  <h1 id="title">Loading…</h1>
</body>
</html>
`,
          },
          hint: "<script src=\"app.js\" defer></script>",
          successMessage: "defer waits for the parser. Vite's type=\"module\" script behaves the same way.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 0.2 – 0.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l3-html-css",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["0.2", "0.3"],
    title: "HTML and CSS Essentials",
    subtitle: "Semantic, accessible structure, forms, the box model, Flexbox, Grid and media queries",
    estimatedMinutes: 35,
    intro:
      "Every React component returns HTML elements and is styled with CSS. If the HTML is wrong, no amount of React fixes it; if the CSS is unclear, every component's layout fights you.",

    atoms: [
      {
        id: "a-rx-semantic-html",
        title: "Elements, attributes and semantic, accessible structure",
        explain:
          "An element is a tag pair with content: <a href=\"/courses\">Courses</a> is an a element with an href ATTRIBUTE. SEMANTIC HTML picks the element that says what the content is: <header>, <nav>, <main>, <article>, <section>, <footer>, <h1>–<h6> in order, <ul> for lists, <button> for actions and <a> for navigation. Screen readers, search engines and keyboard users rely on those meanings: a <div> with a click handler is not reachable with Tab and is not announced as a button. Exactly one <main> per page, and headings that do not skip levels, make a page navigable.",
        webLab: {
          task:
            "This page is built entirely from divs. Rewrite index.html semantically: a <header> holding a <nav> with the two links, a <main> containing the <h1> and the paragraph, and a <footer>. The \"Enroll\" div must become a real <button>.",
          files: {
            "index.html": page("Academy", `  <div class="top">
    <div class="links"><a href="#courses">Courses</a> <a href="#about">About</a></div>
  </div>
  <div class="content">
    <div class="title">React Development</div>
    <p>Sixteen weeks from foundations to production.</p>
    <div class="enroll">Enroll</div>
  </div>
  <div class="bottom">© Memora Academy</div>`),
            "style.css": CSS,
            "app.js": "",
          },
          readOnly: ["style.css", "app.js"],
          tests: [
            { label: "A header containing a nav with both links", check: "return $$('header nav a').length === 2;", fail: "Put the links inside <nav>, inside <header>." },
            { label: "One main, containing an h1 \"React Development\"", check: "return $$('main').length === 1 && text('main h1') === 'React Development';", fail: "The title should be an <h1> inside <main>." },
            { label: "\"Enroll\" is a real button", check: "const b = $('main button'); return !!b && text(b) === 'Enroll';", fail: "Use <button>Enroll</button>." },
            { label: "A footer with the copyright line", check: "return text('footer').includes('Memora Academy');", fail: "Use <footer> for the last line." },
          ],
          solution: {
            "index.html": page("Academy", `  <header>
    <nav><a href="#courses">Courses</a> <a href="#about">About</a></nav>
  </header>
  <main>
    <h1>React Development</h1>
    <p>Sixteen weeks from foundations to production.</p>
    <button type="button">Enroll</button>
  </main>
  <footer>© Memora Academy</footer>`),
          },
          hint: "Swap each div for the element that says what it is: header, nav, main, h1, button, footer.",
          successMessage: "Semantic structure. React components return exactly this kind of HTML.",
        },
      },
      {
        id: "a-rx-forms-inputs",
        title: "Forms, inputs and labels",
        explain:
          "A form groups inputs and submits them together. Every input needs a LABEL connected to it, either <label for=\"email\"> matching the input's id or by wrapping the input in the label, so clicking the label focuses the input and a screen reader announces its name. The input's type (email, password, number, checkbox) gives the right keyboard on phones and built-in checks; name is the key its value is sent under; required marks it as mandatory. A <button> inside a form submits it by default.",
        webLab: {
          task:
            "Make this sign-up form accessible: give each input a connected <label> (\"Full name\" and \"Email\"), make the email input type=\"email\", make both required, and give them the names fullName and email.",
          files: {
            "index.html": page("Sign up", `  <form id="signup">
    <input id="fullName">
    <input id="email">
    <button>Create account</button>
  </form>`),
            "style.css": CSS + "label { display: block; margin-top: 8px; }\n",
            "app.js": "",
          },
          readOnly: ["style.css", "app.js"],
          tests: [
            { label: "Both inputs have a connected label", check: "return nameOf('#fullName') === 'Full name' && nameOf('#email') === 'Email';", fail: "Use <label for=\"fullName\">Full name</label> (and the same for email)." },
            { label: "The email input has type=\"email\"", check: "return $('#email').type === 'email';", fail: "Add type=\"email\"." },
            { label: "Both are required and named", check: "return $('#fullName').required && $('#email').required && $('#fullName').name === 'fullName' && $('#email').name === 'email';", fail: "Add required and name attributes." },
          ],
          solution: {
            "index.html": page("Sign up", `  <form id="signup">
    <label for="fullName">Full name</label>
    <input id="fullName" name="fullName" required>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required>
    <button>Create account</button>
  </form>`),
          },
          hint: "<label for=\"email\">Email</label> connects because the input has id=\"email\".",
          successMessage: "Labelled, typed, required. React forms in Module 5 start from exactly this.",
        },
      },
      {
        id: "a-rx-box-model",
        title: "Selectors and the box model",
        explain:
          "A selector picks elements: p (every paragraph), .card (class card), #total (id total), .card h2 (h2 inside a card), button:hover (a hovered button). Every element is a box: content, then padding, then border, then margin. By default width sets only the content, so width: 300px plus 20px padding and a 2px border is 344px wide. box-sizing: border-box makes width include padding and border, which is how almost every modern project (and every Vite starter) sets it, on every element.",
        webLab: {
          task:
            "The card is meant to be exactly 300px wide, but its padding and border make it 344px. Fix it with box-sizing so the 300px includes padding and border. Keep the padding and border.",
          files: {
            "index.html": page("Card", '  <article class="card"><h2>React Development</h2><p>16 weeks</p></article>'),
            "style.css": "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n.card {\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #0891b2;\n}\n",
            "app.js": "",
          },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "The card is 300px wide", check: "return Math.round(rect('.card').width) === 300;", fail: "Add box-sizing: border-box." },
            { label: "Padding and border are kept", check: "return style('.card', 'padding-left') === '20px' && style('.card', 'border-left-width') === '2px';", fail: "Do not remove the padding or the border." },
          ],
          solution: {
            "style.css": "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n.card {\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #0891b2;\n}\n",
          },
          hint: "*, *::before, *::after { box-sizing: border-box; }",
          successMessage: "border-box: the width you write is the width you get.",
        },
      },
      {
        id: "a-rx-flex-grid",
        title: "Flexbox, Grid and positioning",
        explain:
          "Flexbox lays children out in ONE direction: display: flex on the parent; justify-content spaces them along the row; align-items aligns them across it; gap puts space between. Grid lays out in TWO directions: grid-template-columns: repeat(3, 1fr) makes three equal columns, and repeat(auto-fit, minmax(220px, 1fr)) makes as many 220px-or-wider columns as fit, which is responsive without a media query. position: relative, absolute, fixed and sticky take an element out of normal flow for badges, overlays and sticky headers. Navigation bars are usually Flexbox; card grids are usually Grid.",
        webLab: {
          task:
            "Lay out the course cards with CSS Grid so they form as many columns of at least 220px as fit, with a 16px gap. At laptop width that is several columns; on a phone, one.",
          files: {
            "index.html": page("Courses", `  <section class="grid">
    <article class="card">HTML</article>
    <article class="card">CSS</article>
    <article class="card">JavaScript</article>
    <article class="card">React</article>
  </section>`),
            "style.css": "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n.card { padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }\n.grid {\n  /* your grid here */\n}\n",
            "app.js": "",
          },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "The section is a grid with a 16px gap", check: "return style('.grid', 'display') === 'grid' && style('.grid', 'column-gap') === '16px';", fail: "display: grid; gap: 16px;" },
            { label: "At laptop width, all four cards sit in one row", viewport: "desktop", check: "const t = $$('.card').map((c) => Math.round(rect(c).top)); return new Set(t).size === 1;", fail: "Use repeat(auto-fit, minmax(220px, 1fr))." },
            { label: "On a phone, the cards stack in one column", viewport: "mobile", check: "const l = $$('.card').map((c) => Math.round(rect(c).left)); return new Set(l).size === 1 && !overflowX();", fail: "minmax(220px, 1fr) lets the grid drop to one column." },
          ],
          solution: {
            "style.css": "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n.card { padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 16px;\n}\n",
          },
          hint: "grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));",
          successMessage: "A responsive grid in three lines. You will use this in React card layouts all course.",
        },
      },
      {
        id: "a-rx-media-queries",
        title: "Responsive layouts, media queries and reusable styles",
        explain:
          "Mobile-first CSS writes the phone layout as the default and adds wider layouts with min-width media queries: @media (min-width: 768px) { … } applies from tablet width up. Every page needs <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> or phones pretend to be 980px wide. Reusable styling means classes that describe a role (.button, .card, .badge) used everywhere, and CSS variables (--brand: #0891b2) for values that repeat, so a design change is one edit. In React, those classes become the className of reusable components.",
        webLab: {
          task:
            "The navigation stacks its links vertically, which is right on a phone. From 768px wide and up, lay the links out in a row with display: flex, using a min-width media query. Keep the phone layout as the default.",
          files: {
            "index.html": page("Nav", `  <nav class="nav">
    <a href="#home">Home</a>
    <a href="#courses">Courses</a>
    <a href="#profile">Profile</a>
  </nav>`),
            "style.css": "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n.nav a { display: block; padding: 12px 0; }\n",
            "app.js": "",
          },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "On a phone, the links stack", viewport: "mobile", check: "const t = $$('.nav a').map((a) => Math.round(rect(a).top)); return new Set(t).size === 3;", fail: "Keep the vertical layout as the default." },
            { label: "From tablet width, they sit in one row", viewport: "tablet", check: "const t = $$('.nav a').map((a) => Math.round(rect(a).top)); return style('.nav', 'display') === 'flex' && new Set(t).size === 1;", fail: "@media (min-width: 768px) { .nav { display: flex; } }" },
            { label: "It is done with a min-width media query", check: "return media().some((m) => /min-width/.test(m));", fail: "Mobile first: add the row layout inside @media (min-width: 768px)." },
          ],
          solution: {
            "style.css": "body { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n.nav a { display: block; padding: 12px 0; }\n\n@media (min-width: 768px) {\n  .nav {\n    display: flex;\n    gap: 24px;\n  }\n}\n",
          },
          hint: "Wrap the row rules in @media (min-width: 768px) { … }.",
          successMessage: "Mobile first: the default is the phone, and wider screens add to it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 0.4 (part 1)
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l4-js-core",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["0.4"],
    title: "JavaScript Fundamentals",
    subtitle: "Values and types, operators, conditions, loops, functions, scope, arrays and objects",
    estimatedMinutes: 35,
    intro:
      "A React component is a JavaScript function. Props are an object; a list is an array; conditional rendering is an if or a ternary. This lesson is the JavaScript every component is made of.",

    atoms: [
      {
        id: "a-rx-values-types",
        title: "Variables, data types and operators",
        explain:
          "const names a value that will not be reassigned (use it by default); let names one that will. var is the old way; avoid it. The types: string (\"Ada\"), number (42, 3.5), boolean (true/false), null (deliberately empty), undefined (never set), plus objects and arrays. typeof tells you a value's type. Compare with === and !==, which never convert types: 5 === \"5\" is false, while the loose 5 == \"5\" is true, a source of bugs. + adds numbers but JOINS strings: \"5\" + 1 is \"51\". Values from inputs are always strings, so convert them with Number() first.",
        codeExercise: {
          language: JS,
          code: 'const price = "500";\nconst qty = 2;\nconsole.log(price + qty);\nconsole.log(Number(price) * qty);\nconsole.log(typeof price, typeof qty);\nconsole.log(5 === "5", 5 == "5");\n',
          question: "What do the four lines print?",
          expectedOutput: "5002\n1000\nstring number\nfalse true",
          hint: "+ with a string joins; * converts to numbers. === never converts types.",
          successMessage: "Exactly the kind of bug a form input causes: \"500\" + 2 is \"5002\".",
        },
      },
      {
        id: "a-rx-conditions-loops",
        title: "Conditionals and loops",
        explain:
          "if / else if / else runs one branch. The TERNARY condition ? a : b is an expression that picks a value, which is why JSX uses it. && returns its right side only when the left is truthy: isAdmin && \"Admin\". The FALSY values are false, 0, \"\", null, undefined and NaN; everything else is truthy, including \"0\" and []. for (let i = 0; i < n; i++) counts; for (const item of array) visits each item; while repeats while a condition holds. In React you rarely write loops in JSX: you use map(), next lesson.",
        codeExercise: {
          language: JS,
          code: 'const scores = [45, 72, 90, 0];\nfor (const s of scores) {\n  const grade = s >= 70 ? "pass" : "fail";\n  console.log(s, grade);\n}\nconsole.log(0 && "zero", "" || "empty", [] ? "truthy" : "falsy");\n',
          question: "What prints?",
          expectedOutput: "45 fail\n72 pass\n90 pass\n0 fail\n0 empty truthy",
          hint: "0 && x returns 0 itself. An empty array is truthy.",
          successMessage: "That 0 is the famous React bug: {count && <Badge />} renders a 0 when count is 0.",
        },
      },
      {
        id: "a-rx-functions-scope",
        title: "Functions and scope",
        explain:
          "A function takes parameters and returns a value: function total(price, qty) { return price * qty; }. Without return it returns undefined. A default parameter fills a missing argument: function greet(name = \"friend\"). SCOPE is where a name is visible: a variable declared inside a function or a { } block exists only there, and an inner function can read the variables of the functions around it. That last fact (a CLOSURE) is how event handlers in React components read the component's props and state.",
        codeExercise: {
          language: JS,
          code: 'function makeCounter(start = 0) {\n  let count = start;\n  return function next() {\n    count = count + 1;\n    return count;\n  };\n}\nconst a = makeCounter();\nconst b = makeCounter(10);\nconsole.log(a(), a(), b());\nconsole.log(typeof count);\n',
          question: "What prints?",
          expectedOutput: "1 2 11\nundefined",
          hint: "Each call to makeCounter has its own count. Outside the function, count does not exist.",
          successMessage: "Each counter kept its own count: that is a closure.",
        },
      },
      {
        id: "a-rx-arrays-objects",
        title: "Arrays and objects",
        explain:
          "An array is an ordered list: const courses = [\"HTML\", \"CSS\"]; courses[0] is \"HTML\"; courses.length is 2; push adds to the end. An object groups named values: const student = { name: \"Ada\", age: 16 }; student.name reads a property; student[\"age\"] reads one by a computed name. Real data is arrays of objects: [{ id: 1, title: \"React\" }, …], which is exactly what an API returns and what React renders. Arrays and objects are REFERENCES: const b = a makes b point at the same array, so changing b changes a. That matters enormously for React state in Module 4.",
        codeExercise: {
          language: JS,
          code: 'const student = { name: "Ada", courses: ["HTML"] };\nconst copy = student;\ncopy.courses.push("React");\nconsole.log(student.courses.length);\nconsole.log(student === copy);\nconst list = [{ id: 1, title: "CSS" }, { id: 2, title: "React" }];\nconsole.log(list[1].title, list.length);\n',
          question: "What prints?",
          expectedOutput: "2\ntrue\nReact 2",
          hint: "copy is not a copy: it is the same object.",
          successMessage: "One object, two names. Module 4 shows why React needs real copies.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 0.4 (part 2)
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l5-js-data",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["0.4"],
    title: "Array Methods, Modern Syntax, Modules and the DOM",
    subtitle: "map, filter, find, reduce, destructuring, spread, template literals, modules and events",
    estimatedMinutes: 35,
    intro:
      "These are the tools React code uses on every page: map turns data into elements, filter powers search, spread makes the copies state needs, and modules split an app into files.",

    atoms: [
      {
        id: "a-rx-array-methods",
        title: "Array methods: map, filter, find, reduce",
        explain:
          "map(fn) returns a NEW array with fn applied to each item: prices.map((p) => p * 2). filter(fn) returns a new array of the items where fn returns true. find(fn) returns the FIRST matching item, or undefined. reduce((total, item) => …, start) folds the array into one value, such as a sum. None of them change the original array, which is exactly why React code uses them: a component renders courses.map(…) and searches with courses.filter(…).",
        codeExercise: {
          language: JS,
          code: 'const courses = [\n  { id: 1, title: "HTML", hours: 10, done: true },\n  { id: 2, title: "React", hours: 40, done: false },\n  { id: 3, title: "CSS", hours: 15, done: true },\n];\nconsole.log(courses.map((c) => c.title).join(", "));\nconsole.log(courses.filter((c) => c.done).length);\nconsole.log(courses.find((c) => c.hours > 20).title);\nconsole.log(courses.reduce((sum, c) => sum + c.hours, 0));\nconsole.log(courses.length);\n',
          question: "What prints?",
          expectedOutput: "HTML, React, CSS\n2\nReact\n65\n3",
          hint: "map → titles; filter → the done ones; find → first over 20 hours; reduce → total hours.",
          successMessage: "And the original array still has 3 items: these methods never change it.",
        },
      },
      {
        id: "a-rx-modern-syntax",
        title: "Destructuring, spread syntax and template literals",
        explain:
          "DESTRUCTURING unpacks values: const { name, age } = student; and const [first, second] = list;. React uses it constantly: function Card({ title }) destructures props, and const [count, setCount] = useState(0) destructures an array. SPREAD copies: [...list, newItem] is a new array with one more item; { ...student, age: 17 } is a new object with one property changed. Template literals build strings with backticks and ${}: `Hello, ${name}`.",
        codeExercise: {
          language: JS,
          code: 'const student = { name: "Ada", age: 16, city: "Lagos" };\nconst { name, ...rest } = student;\nconsole.log(name, Object.keys(rest).join(","));\nconst older = { ...student, age: 17 };\nconsole.log(student.age, older.age, older.city);\nconst list = ["HTML", "CSS"];\nconst more = [...list, "React"];\nconsole.log(list.length, more.length);\nconst [first] = more;\nconsole.log(`First: ${first}, last: ${more[more.length - 1]}`);\n',
          question: "What prints?",
          expectedOutput: "Ada age,city\n16 17 Lagos\n2 3\nFirst: HTML, last: React",
          hint: "Spread makes new arrays and objects; the originals keep their values.",
          successMessage: "New copies, originals untouched: the pattern behind every React state update.",
        },
      },
      {
        id: "a-rx-modules",
        title: "Modules: import and export",
        explain:
          "A MODULE is a file with its own scope that shares only what it exports. export function formatPrice() is a NAMED export, imported with braces: import { formatPrice } from \"./format.js\". export default makes the file's main export, imported without braces under any name: import Card from \"./Card.jsx\". A page loads a module with <script type=\"module\">. Every React file is a module: components are default exports, helpers are often named exports.",
        webLab: {
          task:
            "format.js should export a function naira(amount) that returns the amount formatted like \"₦7,500\" (use toLocaleString(\"en-NG\")). app.js must import it and show naira(7500) in #price. index.html already loads app.js as a module.",
          files: {
            "index.html": page("Price", '  <p id="price"></p>', { module: true }),
            "style.css": CSS,
            "format.js": "// export naira(amount) here\n",
            "app.js": '// import naira from format.js and use it\ndocument.querySelector("#price").textContent = "?";\n',
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "#price shows ₦7,500", check: "return text('#price') === '₦7,500';", fail: "Import naira and set textContent to naira(7500)." },
            { label: "format.js exports naira, and app.js imports it", check: "return /export\\s+(function\\s+naira|const\\s+naira|\\{\\s*naira)/.test(code('format.js')) && /import\\s*\\{\\s*naira\\s*\\}\\s*from\\s*[\"']\\.\\/format\\.js[\"']/.test(code('app.js'));", fail: "export function naira(…) in format.js; import { naira } from \"./format.js\" in app.js." },
          ],
          solution: {
            "format.js": 'export function naira(amount) {\n  return "₦" + amount.toLocaleString("en-NG");\n}\n',
            "app.js": 'import { naira } from "./format.js";\n\ndocument.querySelector("#price").textContent = naira(7500);\n',
          },
          hint: "A named export is imported with braces, and the path starts with ./",
          successMessage: "Two modules, one import. A React app is dozens of these.",
        },
      },
      {
        id: "a-rx-dom-events",
        title: "DOM events and basic browser APIs",
        explain:
          "document.querySelector(\"#id\") finds an element; element.textContent sets its text; addEventListener(\"click\", handler) runs a function when something happens. The handler receives an EVENT object: event.target is the element; for forms, event.preventDefault() stops the page reloading. Browser APIs such as localStorage (save small strings), setTimeout and fetch are all available. React replaces most querySelector code with JSX and onClick props, but it is the same events and the same browser underneath.",
        webLab: {
          task:
            "Make the like button work: each click adds one to the number in #likes, and the button's text changes to \"Liked\" after the first click. Save the count in localStorage under \"likes\" so it survives a reload.",
          files: {
            "index.html": page("Like", '  <button id="like">Like</button>\n  <span id="likes">0</span>'),
            "style.css": CSS,
            "app.js": "// your code here\n",
          },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Each click adds one", check: "await click('#like'); await click('#like'); return text('#likes') === '2';", fail: "Keep a count, add 1 in the click handler and write it into #likes." },
            { label: "The button says \"Liked\" after a click", check: "return text('#like') === 'Liked';", fail: "Set the button's textContent in the handler." },
            { label: "The count is saved in localStorage", check: "return storage.getItem('likes') === '2';", fail: "localStorage.setItem(\"likes\", count)" },
            { label: "A saved count is shown on load", seed: { likes: "5" }, check: "return text('#likes') === '5';", fail: "Start from Number(localStorage.getItem(\"likes\")) || 0." },
          ],
          solution: {
            "app.js": 'const button = document.querySelector("#like");\nconst out = document.querySelector("#likes");\nlet likes = Number(localStorage.getItem("likes")) || 0;\nout.textContent = likes;\n\nbutton.addEventListener("click", () => {\n  likes = likes + 1;\n  out.textContent = likes;\n  button.textContent = "Liked";\n  localStorage.setItem("likes", likes);\n});\n',
          },
          hint: "Read the saved value once at the start; update the page AND localStorage in the handler.",
          successMessage: "Find, listen, update, save. Notice how much bookkeeping that was: React automates the \"update the page\" part.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 0.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l6-async",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["0.5"],
    title: "Modern JavaScript: Callbacks, Promises and fetch",
    subtitle: "Arrow functions, callbacks, promises, async/await, errors and APIs",
    estimatedMinutes: 35,
    intro:
      "React apps spend their lives waiting: for clicks, for timers, for servers. Callbacks and promises are how JavaScript waits without freezing the page.",

    atoms: [
      {
        id: "a-rx-arrow-callbacks",
        title: "Arrow functions and callbacks",
        explain:
          "An arrow function is a shorter function expression: (a, b) => a + b. With one expression it returns it automatically; with braces you write return. A CALLBACK is a function passed to another function, to be called later: list.map((x) => x * 2) passes a callback to map; button.addEventListener(\"click\", () => …) passes one to the browser; setTimeout(fn, 1000) calls fn after a second. React is callbacks everywhere: onClick={() => setOpen(true)} hands React a function to call when the click happens, not now.",
        codeExercise: {
          language: JS,
          code: 'const double = (n) => n * 2;\nconst shout = (s) => { return s.toUpperCase() + "!"; };\nfunction applyTwice(fn, value) {\n  return fn(fn(value));\n}\nconsole.log(applyTwice(double, 3));\nconsole.log(applyTwice(shout, "hi"));\nconsole.log(["a", "b"].map((x, i) => x + i).join(" "));\n',
          question: "What prints?",
          expectedOutput: "12\nHI!!\na0 b1",
          hint: "applyTwice calls the function, then calls it again on the result. map's callback also gets the index.",
          successMessage: "Functions passed as values. Every React event handler is one.",
        },
      },
      {
        id: "a-rx-promises",
        title: "Promises",
        explain:
          "A PROMISE is a value that is not ready yet: it will either FULFIL with a result or REJECT with an error, once. promise.then(fn) runs fn with the result; .catch(fn) runs on an error. The callbacks of then never interrupt code that is already running: they run after the current code finishes, even if the promise is already settled. fetch returns a promise of a response, and response.json() returns a promise of the parsed data.",
        codeExercise: {
          language: JS,
          code: 'console.log("1 start");\nPromise.resolve("data").then((d) => console.log("3", d));\nPromise.reject(new Error("offline")).catch((e) => console.log("4", e.message));\nsetTimeout(() => console.log("5 timer"), 0);\nconsole.log("2 end");\n',
          question: "In what order do the lines print?",
          expectedOutput: "1 start\n2 end\n3 data\n4 offline\n5 timer",
          hint: "Synchronous code first; then promise callbacks; then timers.",
          successMessage: "Promise callbacks wait for the current code, and run before timers.",
        },
      },
      {
        id: "a-rx-async-await",
        title: "async/await and error handling",
        explain:
          "async/await is promises written like ordinary code. Inside an async function, await promise pauses THAT function until the promise settles and gives you its value; the rest of the page carries on. A rejected promise makes await THROW, so errors are handled with try { … } catch (err) { … }, and finally runs either way, which is where you switch a loading spinner off. An async function always returns a promise.",
        codeExercise: {
          language: JS,
          code: 'const wait = (ms, value, fail) => new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error(value)) : res(value)), ms));\n\nasync function load(fail) {\n  let loading = true;\n  try {\n    const data = await wait(10, fail ? "Server error" : "3 courses", fail);\n    console.log("got", data);\n  } catch (err) {\n    console.log("failed:", err.message);\n  } finally {\n    loading = false;\n    console.log("loading", loading);\n  }\n}\n\nload(false).then(() => load(true));\n',
          question: "What prints?",
          expectedOutput: "got 3 courses\nloading false\nfailed: Server error\nloading false",
          hint: "finally runs after the try in the first call and after the catch in the second.",
          successMessage: "try, catch, finally: the shape of every data-loading function in this course.",
        },
      },
      {
        id: "a-rx-fetch-api",
        title: "Fetching data from an API",
        explain:
          "fetch(url) sends a GET request and resolves with a Response. Check response.ok (true for 2xx): a 404 or 500 still fulfils the promise, and only a network failure rejects it. Then await response.json() parses the body. A good loading function shows a loading message first, then the data or an error message, never a blank page. The practice pages answer fetch from fixed responses, so every check is repeatable; the code is the same code you would write against a real server.",
        webLab: {
          task:
            "Load courses from /api/courses when the page opens. Show \"Loading…\" in #status straight away; when the data arrives, render each course title as an <li> in #list and clear #status. If the response is not ok, show \"Could not load courses\" in #status.",
          files: {
            "index.html": page("Courses", '  <p id="status" role="status"></p>\n  <ul id="list"></ul>'),
            "style.css": CSS,
            "app.js": "// load /api/courses here\n",
          },
          readOnly: ["index.html", "style.css"],
          mocks: [{ match: "/api/courses", status: 200, body: [{ id: 1, title: "HTML" }, { id: 2, title: "CSS" }, { id: 3, title: "React" }], delay: 120 }],
          tests: [
            { label: "\"Loading…\" shows while waiting", check: "return text('#status') === 'Loading…';", fail: "Set the status text before you await fetch." },
            { label: "Three course titles appear as list items", check: "await waitFor(() => $$('#list li').length === 3); return $$('#list li').map((li) => text(li)).join() === 'HTML,CSS,React';", fail: "Create an <li> per course with its title." },
            { label: "The status clears when the data arrives", check: "await waitFor(() => $$('#list li').length === 3); return text('#status') === '';", fail: "Clear #status after rendering." },
            { label: "A failed response shows an error", mocks: [{ match: "/api/courses", status: 500, body: { error: "down" }, delay: 50 }], check: "return await waitFor(() => text('#status') === 'Could not load courses');", fail: "Check response.ok and show the message when it is false." },
          ],
          solution: {
            "app.js": 'const status = document.querySelector("#status");\nconst list = document.querySelector("#list");\n\nasync function loadCourses() {\n  status.textContent = "Loading…";\n  try {\n    const res = await fetch("/api/courses");\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    const courses = await res.json();\n    for (const course of courses) {\n      const li = document.createElement("li");\n      li.textContent = course.title;\n      list.append(li);\n    }\n    status.textContent = "";\n  } catch {\n    status.textContent = "Could not load courses";\n  }\n}\n\nloadCourses();\n',
          },
          hint: "if (!res.ok) throw new Error(…) inside try makes a 500 land in your catch.",
          successMessage: "Loading, success and failure, all handled. Module 6 does exactly this inside a React component.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 0.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l7-tools",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["0.6"],
    title: "Developer Tools",
    subtitle: "VS Code, browser DevTools, the terminal, npm and Git",
    estimatedMinutes: 25,
    intro:
      "Professional React work happens in five tools. You will use every one of them in Module 1, so set them up now.",

    atoms: [
      {
        id: "a-rx-vscode-devtools",
        title: "VS Code and browser DevTools",
        explain:
          "Visual Studio Code is the editor most React developers use: open a whole project FOLDER (File → Open Folder), not single files, so imports, search (Ctrl+Shift+F) and the built-in terminal (Ctrl+`) work across it. Useful extensions: ESLint and Prettier. Browser DevTools (F12): Elements shows the live DOM and its CSS; Console shows logs and errors with the file and line; Network shows every request and its status; Application shows localStorage. In Module 1 you add React Developer Tools, which shows components instead of elements.",
        decision: {
          scenario: "A button on your page does nothing when clicked. You have not looked anywhere yet.",
          question: "Where do you look first?",
          options: [
            { id: "a", text: "The Console, for a red error with a file and line number", why: "A JavaScript error stops the code that would have handled the click, and the Console says exactly where." },
            { id: "b", text: "Rewrite the button from scratch", whyWrong: "Without knowing the cause you may rewrite the same bug." },
            { id: "c", text: "The Network panel first", whyWrong: "Useful when data fails to load; for a dead button, check for errors first." },
            { id: "d", text: "Restart the computer", whyWrong: "The browser will run the same code the same way." },
          ],
          correct: "a",
          aftermath: "Console first: errors tell you the file and the line.",
        },
      },
      {
        id: "a-rx-terminal-npm",
        title: "Terminal basics and npm",
        explain:
          "The TERMINAL runs commands: pwd (where am I), ls (list files; dir on old Windows shells), cd folder (go into it), cd .. (go up), mkdir name (make a folder). Node.js runs JavaScript outside the browser and comes with npm, the package manager. npm install downloads the packages listed in package.json into node_modules; npm install react-router adds one and records it; npm run dev runs the \"dev\" script from package.json. node_modules is never edited by hand and never committed to Git: anyone can recreate it with npm install.",
        decision: {
          scenario: "You clone a teammate's React project and run npm run dev. The terminal says: 'vite' is not recognized as an internal or external command.",
          question: "What is the fix?",
          options: [
            { id: "a", text: "Run npm install first: the project's packages, including Vite, are not downloaded yet", why: "A fresh clone has package.json but no node_modules. npm install reads package.json and installs everything." },
            { id: "b", text: "Copy node_modules from the teammate by USB", whyWrong: "It can contain platform-specific files and is exactly what npm install recreates." },
            { id: "c", text: "Install Vite globally on your computer", whyWrong: "The project pins its own Vite version in package.json; use that one." },
            { id: "d", text: "Delete package.json", whyWrong: "That deletes the list of what the project needs." },
          ],
          correct: "a",
          aftermath: "Clone, npm install, npm run dev: the start of every JavaScript project.",
        },
      },
      {
        id: "a-rx-git-basics",
        title: "Git",
        explain:
          "Git records snapshots of a project, called COMMITS, so you can see what changed and go back. git init starts a repository; git status shows what changed; git add file stages a change; git commit -m \"Add course card\" records the staged changes with a message; git log lists history. GitHub hosts repositories online: git push uploads your commits. A .gitignore file lists what Git must not track: node_modules, dist and .env files with secrets. Module 15 covers branches, pull requests and teamwork.",
        decision: {
          scenario: "You run git status before your first commit and see node_modules/ (34,000 files), dist/, src/ and package.json all as untracked.",
          question: "What should go into the commit?",
          options: [
            { id: "a", text: "src/ and package.json (and package-lock.json); node_modules and dist go in .gitignore", why: "Commit what people write. Installed packages and build output are regenerated by npm install and npm run build." },
            { id: "b", text: "Everything, so nothing is lost", whyWrong: "Committing node_modules bloats the repository with thousands of files anyone can reinstall." },
            { id: "c", text: "Only dist/, the finished site", whyWrong: "That is build output; without the source nobody can change it." },
            { id: "d", text: "Nothing until the project is finished", whyWrong: "Small, frequent commits are what make Git useful." },
          ],
          correct: "a",
          aftermath: "Vite projects come with a .gitignore that already excludes node_modules and dist.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 0.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l8-m0-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["0.P"],
    title: "Practical: A Student Profile Page",
    subtitle: "A responsive page that renders its course list from a JavaScript array",
    estimatedMinutes: 45,
    intro:
      "The Module 0 practical brings the week together: semantic HTML, responsive CSS, and JavaScript that turns an array of data into elements. It is, in miniature, exactly what React does.",

    atoms: [
      {
        id: "a-rx-m0-project",
        title: "Build the profile page",
        explain:
          "Data in an array, a function that turns each item into elements, and a page that looks right on a phone and a laptop. Notice how you have to find elements, create elements and keep the page in step with the data by hand. Module 1 shows how React lets you describe the result instead.",
        webLab: {
          task:
            "Build the student profile. In app.js, render every course from the courses array into #courses as an <li class=\"course\"> containing an <h3> with the title and a <p> with \"N weeks\". Add the class \"done\" to completed courses, and set #summary to \"2 of 4 courses completed\" (computed from the data, not typed). In style.css, lay #courses out as a grid: one column on a phone, two columns from 768px.",
          files: {
            "index.html": page("Student profile", `  <header>
    <h1>Ada Obi</h1>
    <p>Frontend developer in training · Lagos</p>
  </header>
  <main>
    <h2>My courses</h2>
    <p id="summary"></p>
    <ul id="courses"></ul>
  </main>`),
            "style.css": "* { box-sizing: border-box; }\nbody { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n#courses { list-style: none; padding: 0; }\n.course { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }\n.course.done { border-color: #16a34a; }\n",
            "app.js": 'const courses = [\n  { id: 1, title: "HTML & CSS", weeks: 4, completed: true },\n  { id: 2, title: "JavaScript", weeks: 6, completed: true },\n  { id: 3, title: "React", weeks: 16, completed: false },\n  { id: 4, title: "TypeScript", weeks: 3, completed: false },\n];\n\n// render the courses and the summary here\n',
          },
          readOnly: ["index.html"],
          revealSolution: false,
          tests: [
            { label: "Four course items, each with a title and weeks", check: "const items = $$('#courses li.course'); return items.length === 4 && text(items[2].querySelector('h3')) === 'React' && text(items[2].querySelector('p')) === '16 weeks';", fail: "Create one <li class=\"course\"> per course with an <h3> and a <p>." },
            { label: "Completed courses have the class done", check: "return $$('#courses li.done').map((li) => text(li.querySelector('h3'))).join('|') === 'HTML & CSS|JavaScript';", fail: "Add the class done when course.completed is true." },
            { label: "The summary is computed from the data", check: "return text('#summary') === '2 of 4 courses completed' && /filter|reduce|length/.test(code('app.js'));", fail: "Count the completed courses with filter(...).length." },
            { label: "One column on a phone", viewport: "mobile", check: "const l = $$('.course').map((c) => Math.round(rect(c).left)); return new Set(l).size === 1 && !overflowX();", fail: "The phone layout should be a single column." },
            { label: "Two columns from tablet width", viewport: "tablet", check: "const l = $$('.course').map((c) => Math.round(rect(c).left)); return style('#courses', 'display') === 'grid' && new Set(l).size === 2;", fail: "In @media (min-width: 768px), set grid-template-columns to two columns." },
          ],
          solution: {
            "style.css": "* { box-sizing: border-box; }\nbody { font-family: Arial, sans-serif; margin: 0; padding: 16px; }\n#courses { list-style: none; padding: 0; display: grid; gap: 12px; }\n.course { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }\n.course.done { border-color: #16a34a; }\n@media (min-width: 768px) {\n  #courses { grid-template-columns: repeat(2, 1fr); }\n}\n",
            "app.js": 'const courses = [\n  { id: 1, title: "HTML & CSS", weeks: 4, completed: true },\n  { id: 2, title: "JavaScript", weeks: 6, completed: true },\n  { id: 3, title: "React", weeks: 16, completed: false },\n  { id: 4, title: "TypeScript", weeks: 3, completed: false },\n];\n\nconst list = document.querySelector("#courses");\nfor (const course of courses) {\n  const li = document.createElement("li");\n  li.className = course.completed ? "course done" : "course";\n  const h3 = document.createElement("h3");\n  h3.textContent = course.title;\n  const p = document.createElement("p");\n  p.textContent = `${course.weeks} weeks`;\n  li.append(h3, p);\n  list.append(li);\n}\n\nconst done = courses.filter((c) => c.completed).length;\ndocument.querySelector("#summary").textContent = `${done} of ${courses.length} courses completed`;\n',
          },
          hint: "Loop over courses with for...of, build each <li> with createElement, then append it.",
          successMessage: "Data in, page out, on every screen. That is the job React was built to make easier.",
        },
      },
    ],
    task: {
      title: "Module 0 practical: your own profile page",
      intro: "Build the same page for yourself in VS Code, outside the lab, and open it with the Live Server extension or by double-clicking index.html.",
      prompts: [
        "Use semantic HTML: header, main, sections with headings in order, and a footer.",
        "Keep your courses (or projects, or skills) in a JavaScript array of objects with at least four fields.",
        "Render the list from the array, and compute a summary line from the data.",
        "Make it responsive: one column on a phone and two or three from 768px, with no sideways scrolling at 320px.",
        "Mastery checkpoint: explain to someone, without notes, what a function, an object, an array, a callback and an asynchronous call are, using examples from your own page.",
      ],
      closing: "Next: Module 1, where React renders this kind of page for you.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
