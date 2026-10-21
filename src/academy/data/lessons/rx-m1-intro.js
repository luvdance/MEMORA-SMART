/**
 * REACT DEVELOPMENT · MODULE 1 · INTRODUCTION TO REACT AND THE DEVELOPMENT ENVIRONMENT
 *
 * Curriculum 1.1 – 1.P. Why React exists, declarative UI, single-page apps,
 * a Vite project and its files, JSX and its rules, createRoot, React
 * Developer Tools and Strict Mode. From here on every lab is a real Vite
 * project run by the React lab runtime (React 19, development build).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab, reactDemo, viteHtml } from "./rx-helpers.js";

export const SECTION_ID = "rx-s1-intro";
const MODULE = "rx-m1-intro";

const COUNTER_DEMO = `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>Enrolled students: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Enroll one more</button>
      {count >= 3 && <p>The class is filling up!</p>}
    </main>
  );
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 1.1 – 1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l9-why-react",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2", "1.3"],
    title: "Why React Exists",
    subtitle: "What React is, declarative UI, single-page apps and components",
    estimatedMinutes: 25,
    intro:
      "In Module 0's practical you found elements, created elements and kept the page in step with the data by hand. React exists because, in a large app, that bookkeeping is where most bugs come from.",

    atoms: [
      {
        id: "a-rx-what-react",
        title: "What React is and what problems it solves",
        explain:
          "React is a JavaScript library for building user interfaces, created at Facebook and now maintained by Meta and a large community. You describe the interface as COMPONENTS: functions that take data and return what the screen should look like. When the data changes, React works out what changed on the screen and updates only that. It solves three problems of hand-written DOM code: keeping the page in sync with the data (the source of \"the count says 3 but the list shows 4\" bugs), reusing pieces of interface without copying them, and organising a big interface so a team can work on it. The example below is a whole React component; try it.",
        webDemo: reactDemo({ files: { "src/App.jsx": COUNTER_DEMO }, caption: "A complete React component. Click the button, then edit the text in App.jsx and watch the preview." }),
        decision: {
          scenario: "Your page shows a cart count in the header, a cart list in a sidebar and a total at the bottom. With hand-written DOM code, adding an item means updating all three by hand.",
          question: "What does React change about that?",
          options: [
            { id: "a", text: "You change the cart data once; every component that shows it re-renders from the new data", why: "The interface is a function of the data, so all three places update from one change and cannot disagree." },
            { id: "b", text: "React updates the database for you", whyWrong: "React is about the interface in the browser, not storage." },
            { id: "c", text: "Nothing: you still update each element yourself", whyWrong: "Avoiding exactly that is React's main purpose." },
            { id: "d", text: "React makes the page reload after every change", whyWrong: "React updates the existing page in place, without a reload." },
          ],
          correct: "a",
          aftermath: "UI = f(data). Change the data; React updates the screen.",
        },
      },
      {
        id: "a-rx-declarative",
        title: "Declarative UI versus manually manipulating the DOM",
        explain:
          "IMPERATIVE code gives step-by-step instructions: find the list, create an <li>, set its text, append it, find the counter, change its text. DECLARATIVE code describes the result: \"the list is these items; the counter is the number of items\". You write what the screen should be for the current data, and React does the steps. That is why React code has almost no querySelector, createElement or appendChild in it. The two snippets below build the same list.",
        example:
          "// Imperative: every step, by hand\nconst ul = document.querySelector(\"#list\");\nfor (const c of courses) {\n  const li = document.createElement(\"li\");\n  li.textContent = c.title;\n  ul.append(li);\n}\ndocument.querySelector(\"#count\").textContent = courses.length;\n\n// Declarative (React): describe the result\nfunction CourseList({ courses }) {\n  return (\n    <>\n      <p>{courses.length} courses</p>\n      <ul>{courses.map((c) => <li key={c.id}>{c.title}</li>)}</ul>\n    </>\n  );\n}",
        decision: {
          scenario: "A colleague's React component calls document.querySelector(\"#total\").textContent = total inside it, to update a total.",
          question: "What is the better React approach?",
          options: [
            { id: "a", text: "Return <p id=\"total\">{total}</p> from the component and let React keep it updated", why: "Describe the result in JSX. Changing React-managed elements by hand fights React, which may overwrite them on the next render." },
            { id: "b", text: "Keep it; querySelector is faster", whyWrong: "React may re-render and overwrite the hand-made change, and the code no longer says what the screen shows." },
            { id: "c", text: "Use innerHTML instead", whyWrong: "Still imperative, and innerHTML with data opens a security hole (Module 12)." },
            { id: "d", text: "Reload the page to show the new total", whyWrong: "That throws away the app's state." },
          ],
          correct: "a",
          aftermath: "In React, the JSX is the source of truth for what is on screen.",
        },
      },
      {
        id: "a-rx-spa-components",
        title: "Single-page applications and component-based architecture",
        explain:
          "A traditional site loads a new HTML page from the server for every link. A SINGLE-PAGE APPLICATION (SPA) loads one page and a JavaScript app once; after that, clicking a link swaps what is shown without a full reload, so it feels like a native app (Module 8 adds routing). COMPONENT-BASED ARCHITECTURE builds that app from components: a Header, a CourseCard, a SearchBox, each a function in its own file, combined like building blocks. A component can be used many times with different data, and the whole app is a tree of components with <App /> at the root.",
        webLab: reactLab({
          task:
            "Your first React edit. App.jsx is a component: a function that returns JSX. Change the heading to \"My learning app\" and add a paragraph under it that says \"Built with React and Vite\".",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <main>
      <h1>Hello</h1>
    </main>
  );
}
`,
          },
          tests: [
            { label: "The heading says \"My learning app\"", check: "return text('h1') === 'My learning app';", fail: "Change the text between <h1> and </h1>." },
            { label: "A paragraph says \"Built with React and Vite\"", check: "return text('main p') === 'Built with React and Vite';", fail: "Add <p>Built with React and Vite</p> inside <main>, after the heading." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  return (
    <main>
      <h1>My learning app</h1>
      <p>Built with React and Vite</p>
    </main>
  );
}
`,
          },
          hint: "The <p> goes inside <main>, so the component still returns one element.",
          successMessage: "You changed a React component and React rendered it. That is the whole workflow, at its smallest.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 1.4 – 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l10-vite",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.4", "1.5", "1.6"],
    title: "A React Project with Vite",
    subtitle: "Creating the project, its files and package.json, the dev server and production builds",
    estimatedMinutes: 30,
    intro:
      "Browsers cannot run JSX directly, so a React project needs a build tool. Vite is the one React's own documentation recommends for a project without a framework: fast to start, and it handles JSX, CSS and imports for you.",

    atoms: [
      {
        id: "a-rx-create-vite",
        title: "Creating a React project with Vite",
        explain:
          "With Node.js installed (version 20 or newer), one command creates a project: npm create vite@latest my-app -- --template react. It asks nothing more with the template given, and creates a folder with a working app. Then: cd my-app, npm install to download React and Vite, and npm run dev to start it. Use --template react-ts for TypeScript (Module 11). Create React App (create-react-app), which many old tutorials use, is deprecated: do not start new projects with it.",
        example:
          "npm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev",
        decision: {
          scenario: "A 2019 tutorial tells you to run npx create-react-app my-app.",
          question: "What should you do for a new project today?",
          options: [
            { id: "a", text: "Use npm create vite@latest my-app -- --template react", why: "Create React App is deprecated; Vite is current, fast and what the React documentation points to for a plain React app." },
            { id: "b", text: "Follow the tutorial exactly", whyWrong: "Create React App is no longer maintained, and its dependencies are out of date." },
            { id: "c", text: "Write the build tool yourself", whyWrong: "A solved problem; use Vite." },
            { id: "d", text: "Add React with a <script> tag and write JSX in the page", whyWrong: "Browsers cannot run JSX without a compiler." },
          ],
          correct: "a",
          aftermath: "Vite for single-page apps; frameworks such as Next.js when you also need server rendering.",
        },
      },
      {
        id: "a-rx-project-structure",
        title: "The project structure and package.json",
        explain:
          "A new Vite project has: index.html (the one HTML page, with <div id=\"root\"></div> and <script type=\"module\" src=\"/src/main.jsx\">); src/main.jsx (finds #root and renders <App /> into it); src/App.jsx (your top component); src/index.css and src/App.css (styles); public/ (files served as they are, such as a favicon); package.json; vite.config.js (Vite's settings) and eslint.config.js. package.json lists the project's name, its scripts (dev, build, preview, lint) and its dependencies (react, react-dom) and devDependencies (vite and the tools that build it). The chain is: index.html → src/main.jsx → src/App.jsx.",
        webLab: reactLab({
          task:
            "Someone renamed the root element in index.html to id=\"app\", so main.jsx can no longer find it and the page is blank (look at the console). Fix main.jsx so the app mounts into the element that really exists. Do not change index.html.",
          files: {
            "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
            "src/App.jsx": `export default function App() {
  return <h1>Course dashboard</h1>;
}
`,
            "index.html": viteHtml("Dashboard").replace('id="root"', 'id="app"'),
          },
          readOnly: ["index.html", "src/App.jsx"],
          allowErrors: false,
          tests: [
            { label: "The app renders its heading", check: "return text('h1') === 'Course dashboard';", fail: "main.jsx must find the element with the id that index.html really uses." },
            { label: "It renders inside #app", check: "return !!$('#app h1');", fail: "document.getElementById(\"app\")" },
          ],
          solution: {
            "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
          },
          hint: "Read index.html: what id does the empty div have?",
          successMessage: "index.html → main.jsx → App.jsx. When a React page is blank, check this chain first.",
        }),
      },
      {
        id: "a-rx-dev-build",
        title: "The development server and production builds",
        explain:
          "npm run dev starts Vite's development server, usually at http://localhost:5173. It compiles files as the browser asks for them and updates the page the instant you save (hot module replacement), keeping state where it can. It is for your computer only. npm run build makes the PRODUCTION version: JSX compiled, files bundled and minified, names fingerprinted (index-4f2a1c.js) so browsers can cache them, all written to dist/. npm run preview serves dist/ locally so you can check the real build before deploying. You deploy dist/, never the dev server.",
        decision: {
          scenario: "Your app works perfectly with npm run dev. You are about to upload it to a hosting service.",
          question: "What do you upload?",
          options: [
            { id: "a", text: "The dist/ folder made by npm run build, after checking it with npm run preview", why: "dist/ is the optimised production build. The dev server is a development tool, not a web server for visitors." },
            { id: "b", text: "The src/ folder", whyWrong: "Browsers cannot run raw JSX; it must be built." },
            { id: "c", text: "Keep npm run dev running on your laptop", whyWrong: "The dev server is slow for visitors, insecure and stops when your laptop sleeps." },
            { id: "d", text: "node_modules", whyWrong: "Those are build tools and libraries, not your site." },
          ],
          correct: "a",
          aftermath: "dev to work, build to ship, preview to check the build. Hosts such as Vercel run npm run build for you (Module 15).",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 1.7 – 1.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l11-jsx",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.7", "1.8", "1.9"],
    title: "JSX",
    subtitle: "What JSX is, JavaScript expressions in braces, and the rules JSX enforces",
    estimatedMinutes: 30,
    intro: "JSX looks like HTML inside JavaScript. It is neither: it is a short way to write JavaScript function calls, which is why it has a few rules HTML does not.",

    atoms: [
      {
        id: "a-rx-jsx-is-js",
        title: "JSX syntax and its relationship to JavaScript",
        explain:
          "JSX is compiled into ordinary JavaScript before the browser sees it. <h1 className=\"title\">Hi</h1> becomes a function call much like React.createElement(\"h1\", { className: \"title\" }, \"Hi\"), which returns a plain object describing an element. So JSX can be stored in a variable, returned from a function, passed as an argument and put in an array, exactly like any other value. Lower-case tags (<div>, <button>) are HTML elements; capitalised tags (<CourseCard />) are your components. You never need to call createElement yourself; it just helps to know what JSX is.",
        webLab: reactLab({
          task:
            "This component is written with React.createElement calls, which is what JSX compiles to. Rewrite it in JSX so it renders exactly the same thing: a <section className=\"card\"> containing an <h2> \"React\" and a <p> \"16 weeks\". Remove every createElement call.",
          files: {
            "src/App.jsx": `import { createElement } from "react";

export default function App() {
  return createElement(
    "section",
    { className: "card" },
    createElement("h2", null, "React"),
    createElement("p", null, "16 weeks")
  );
}
`,
          },
          tests: [
            { label: "It renders the card with its heading and text", check: "return text('section.card h2') === 'React' && text('section.card p') === '16 weeks';", fail: "Return <section className=\"card\"> with an <h2> and a <p> inside." },
            { label: "It uses JSX, with no createElement left", check: "return !/createElement/.test(code('src/App.jsx')) && /<section/.test(code('src/App.jsx'));", fail: "Replace the calls with JSX tags." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  return (
    <section className="card">
      <h2>React</h2>
      <p>16 weeks</p>
    </section>
  );
}
`,
          },
          hint: "createElement(type, props, ...children) maps to <type {...props}>children</type>.",
          successMessage: "Same output, far easier to read. That is all JSX is: a better way to write those calls.",
        }),
      },
      {
        id: "a-rx-jsx-expressions",
        title: "Embedding JavaScript expressions in JSX",
        explain:
          "Curly braces switch from JSX back to JavaScript: <h1>Hello, {student.name}</h1>. Anything that produces a VALUE works inside them: a variable, a property, arithmetic ({price * qty}), a function call ({formatNaira(total)}), a ternary ({paid ? \"Paid\" : \"Due\"}). Statements do not: you cannot put an if or a for loop inside braces, which is why JSX uses ternaries and map(). Braces also set attributes from data: <img src={course.image} alt={course.title} />.",
        webLab: reactLab({
          task:
            "Use the data in App.jsx instead of the placeholders. The <h1> must say \"Welcome back, Ada\" from student.name; the paragraph must say \"3 courses · 42 hours\" using courses.length and the totalHours() function; and the badge must say \"Premium\" when student.premium is true, otherwise \"Free\" (use a ternary).",
          files: {
            "src/App.jsx": `const student = { name: "Ada", premium: true };
const courses = [
  { id: 1, title: "HTML", hours: 10 },
  { id: 2, title: "JavaScript", hours: 12 },
  { id: 3, title: "React", hours: 20 },
];

function totalHours() {
  return courses.reduce((sum, c) => sum + c.hours, 0);
}

export default function App() {
  return (
    <main>
      <h1>Welcome back, NAME</h1>
      <p>COUNT courses · HOURS hours</p>
      <span className="badge">PLAN</span>
    </main>
  );
}
`,
          },
          tests: [
            { label: "The heading uses student.name", check: "return text('h1') === 'Welcome back, Ada' && /\\{\\s*student\\.name\\s*\\}/.test(code('src/App.jsx'));", fail: "Write {student.name} inside the <h1>." },
            { label: "The paragraph says \"3 courses · 42 hours\" from the data", check: "return text('main p') === '3 courses · 42 hours' && /courses\\.length/.test(code('src/App.jsx')) && /totalHours\\(\\)/.test(code('src/App.jsx'));", fail: "Use {courses.length} and {totalHours()}." },
            { label: "The badge uses a ternary on student.premium", check: "return text('.badge') === 'Premium' && /student\\.premium\\s*\\?/.test(code('src/App.jsx'));", fail: "{student.premium ? \"Premium\" : \"Free\"}" },
          ],
          solution: {
            "src/App.jsx": `const student = { name: "Ada", premium: true };
const courses = [
  { id: 1, title: "HTML", hours: 10 },
  { id: 2, title: "JavaScript", hours: 12 },
  { id: 3, title: "React", hours: 20 },
];

function totalHours() {
  return courses.reduce((sum, c) => sum + c.hours, 0);
}

export default function App() {
  return (
    <main>
      <h1>Welcome back, {student.name}</h1>
      <p>
        {courses.length} courses · {totalHours()} hours
      </p>
      <span className="badge">{student.premium ? "Premium" : "Free"}</span>
    </main>
  );
}
`,
          },
          hint: "Anything inside { } is JavaScript and must produce a value.",
          successMessage: "Change student.premium to false and watch the badge: the screen follows the data.",
        }),
      },
      {
        id: "a-rx-jsx-rules",
        title: "JSX rules: one parent, fragments, attributes and expressions",
        explain:
          "1. A component returns ONE element. Two siblings must be wrapped, in a <div> or, when you do not want an extra element, a FRAGMENT: <>…</>. 2. Every tag closes, including empty ones: <img />, <input />, <br />. 3. Attributes are camelCase JavaScript names: className (class is a JavaScript keyword), htmlFor (for the same reason), onClick, tabIndex; aria-* and data-* stay hyphenated. 4. style takes an object, not a string: style={{ color: \"red\", fontSize: 18 }}, double braces because it is an object inside an expression. 5. Comments are {/* like this */}. Break a rule and Vite shows the error in an overlay, as this preview does.",
        webLab: reactLab({
          task:
            "This JSX breaks four rules, so the preview shows a compile error. Fix it so it renders: wrap the two top-level elements in a fragment, close the <br> and <input> tags, and change class and for to their JSX names.",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <h1 class="title">Sign up</h1>
    <form>
      <p>Free for students<br></p>
      <label for="email">Email</label>
      <input id="email" type="email">
      <button>Join</button>
    </form>
  );
}
`,
          },
          tests: [
            { label: "It compiles and renders the heading and the form", check: "return text('h1') === 'Sign up' && !!$('form input#email') && overlay() === '';", fail: "Fix every rule until the error overlay disappears." },
            { label: "The heading has the class title", check: "return $('h1').className === 'title';", fail: "Use className, not class." },
            { label: "The label is connected to the input", check: "return nameOf('#email') === 'Email';", fail: "Use htmlFor=\"email\" on the label." },
            { label: "No extra wrapper element: a fragment is used", check: "return $('#root').children.length === 2;", fail: "Wrap the two elements in <>…</> rather than a <div>." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  return (
    <>
      <h1 className="title">Sign up</h1>
      <form>
        <p>Free for students<br /></p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <button>Join</button>
      </form>
    </>
  );
}
`,
          },
          allowErrors: false,
          hint: "Start with the fragment: <> before <h1> and </> after </form>.",
          successMessage: "One parent, closed tags, camelCase attributes. The compiler enforces these, so you will learn them quickly.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 1.10 – 1.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l12-rendering-tools",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.10", "1.11", "1.12"],
    title: "createRoot, React DevTools and Strict Mode",
    subtitle: "How React takes over the page, how to inspect it, and what development mode is for",
    estimatedMinutes: 30,
    intro: "Three things every React developer uses from day one: the line that starts the app, the tools that let you see inside it, and the development checks that catch bugs early.",

    atoms: [
      {
        id: "a-rx-createroot",
        title: "Rendering React applications with createRoot",
        explain:
          "React needs one real DOM element to manage. createRoot(element) from react-dom/client creates a ROOT there, and root.render(<App />) draws your component tree into it. From then on React owns everything inside that element: you change what is shown by changing data, never by editing those elements directly. A Vite app does this once, in src/main.jsx. (Older code uses ReactDOM.render, which was removed in React 19.)",
        webLab: reactLab({
          task:
            "main.jsx imports everything but never renders. Create a root on the #root element and render <App /> into it, wrapped in <StrictMode>.",
          files: {
            "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// create a root and render <App /> here
`,
            "src/App.jsx": `export default function App() {
  return <h1>Rendered by React</h1>;
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "<App /> is rendered into #root", check: "return text('#root h1') === 'Rendered by React';", fail: "createRoot(document.getElementById(\"root\")).render(<App />)" },
            { label: "It is wrapped in StrictMode", check: "return /<StrictMode>[\\s\\S]*<App\\s*\\/>[\\s\\S]*<\\/StrictMode>/.test(code('src/main.jsx'));", fail: "render(<StrictMode><App /></StrictMode>)" },
          ],
          solution: {
            "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
          },
          hint: "Two steps: createRoot(element), then .render(jsx).",
          successMessage: "That one statement is how every React app on the web starts.",
        }),
      },
      {
        id: "a-rx-devtools-react",
        title: "React Developer Tools and browser debugging",
        explain:
          "React Developer Tools is a free browser extension (Chrome, Edge, Firefox). It adds two DevTools tabs: COMPONENTS shows your component tree instead of raw elements; select a component to see its props, state and Hooks, and edit them live to test the UI. PROFILER records renders and how long each took (Module 14). With it you can answer \"what data does this component actually have?\" in seconds. Errors still appear in the Console with a component stack, a list of the components the error happened inside, which tells you which file to open.",
        decision: {
          scenario: "A CourseCard shows \"undefined weeks\". You suspect it is receiving the wrong data from its parent.",
          question: "What is the quickest way to find out?",
          options: [
            { id: "a", text: "Select CourseCard in React DevTools → Components and read its props", why: "The Components tab shows exactly what props the component received, so you see at once whether weeks is missing or misnamed." },
            { id: "b", text: "Add console.log to every component in the app", whyWrong: "It works, eventually, but DevTools shows the props directly without changing code." },
            { id: "c", text: "Inspect the <p> in the Elements tab", whyWrong: "That shows the rendered text, which you already know is wrong, not the data that caused it." },
            { id: "d", text: "Rewrite CourseCard", whyWrong: "The bug may be in the parent; find it first." },
          ],
          correct: "a",
          aftermath: "Components tab for props and state; Console for errors and their component stack.",
        },
      },
      {
        id: "a-rx-strict-mode",
        title: "Development mode and Strict Mode",
        explain:
          "npm run dev runs React's DEVELOPMENT build: slower, but full of checks and readable warnings (\"Each child in a list should have a unique key\"). The production build strips them out. <StrictMode> adds more checks in development only: it calls your component functions TWICE and runs effects twice (Module 6), to expose code that is not PURE. A pure component only calculates its JSX from its props, state and context; it does not change variables outside itself. If running a component twice changes the result, it has a bug that will appear in real use, and Strict Mode makes it visible now. The practice pages run in development mode with Strict Mode on.",
        webLab: reactLab({
          task:
            "This component adds a visitor to an array OUTSIDE itself every time it renders. Strict Mode renders it twice, so the list shows Ada twice: the bug is the impurity, not Strict Mode. Make the component pure: create the array inside the component, so each render calculates the same result. The list must show one Ada.",
          files: {
            "src/App.jsx": `const visitors = [];

export default function App() {
  visitors.push("Ada");
  return (
    <ul>
      {visitors.map((name, i) => (
        <li key={i}>{name}</li>
      ))}
    </ul>
  );
}
`,
          },
          tests: [
            { label: "The list shows exactly one visitor", check: "return $$('li').length === 1 && text('li') === 'Ada';", fail: "Each render must produce the same list: build it inside the component." },
            { label: "Strict Mode is still on", check: "return /<StrictMode>/.test(code('src/main.jsx'));", fail: "Fix the component, not the checks." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  const visitors = ["Ada"];
  return (
    <ul>
      {visitors.map((name, i) => (
        <li key={i}>{name}</li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "Nothing outside the function should change when the function runs.",
          successMessage: "Pure: same inputs, same output, every time. Strict Mode found the bug before a user did.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 1.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l13-m1-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.P"],
    title: "Practical: A Portfolio Homepage",
    subtitle: "A personal homepage built with React and Vite",
    estimatedMinutes: 45,
    intro: "Module 1's practical is your first complete React page. It is deliberately one component; Module 2 splits it into reusable pieces.",

    atoms: [
      {
        id: "a-rx-m1-project",
        title: "Build the portfolio homepage",
        explain:
          "Everything you need is in this module: JSX that returns one parent, attributes in their JSX form, data from a JavaScript object put on the page with braces, a value calculated in JavaScript, and styles in a CSS file imported by the component.",
        webLab: reactLab({
          task:
            "Build the homepage in App.jsx from the profile object. It needs: a <header> with the name in an <h1> and the role in a <p>; a <nav> with three links (About, Projects, Contact) pointing to #about, #projects and #contact; a <main> with <section id=\"about\"> showing profile.bio, and <section id=\"projects\"> with an <h2> \"Projects\" and the text \"2 projects\" calculated from profile.projects.length; and a <footer> with \"© 2026 Ada Obi\" where 2026 comes from new Date().getFullYear(). Import App.css and use it to lay the nav links out in a row with display: flex.",
          files: {
            "src/App.jsx": `const profile = {
  name: "Ada Obi",
  role: "Frontend developer",
  bio: "I build accessible, fast web apps with React.",
  email: "ada@example.com",
  projects: ["Course catalogue", "Weather dashboard"],
};

export default function App() {
  return <h1>Portfolio</h1>;
}
`,
            "src/App.css": "/* styles for the portfolio */\n",
          },
          revealSolution: false,
          tests: [
            { label: "Header: the name in an h1 and the role", check: "return text('header h1') === 'Ada Obi' && text('header p') === 'Frontend developer' && /profile\\.name/.test(code('src/App.jsx'));", fail: "Use {profile.name} and {profile.role} in the header." },
            { label: "Navigation with the three section links", check: "const a = $$('nav a'); return a.length === 3 && a.map((x) => x.getAttribute('href')).join() === '#about,#projects,#contact';", fail: "Three links with href=\"#about\", \"#projects\" and \"#contact\"." },
            { label: "About shows the bio from the data", check: "return text('main section#about').includes('I build accessible, fast web apps with React.') && /profile\\.bio/.test(code('src/App.jsx'));", fail: "Use {profile.bio} in <section id=\"about\">." },
            { label: "Projects shows \"2 projects\", calculated", check: "return text('#projects h2') === 'Projects' && text('#projects').includes('2 projects') && /profile\\.projects\\.length/.test(code('src/App.jsx'));", fail: "{profile.projects.length} projects" },
            { label: "The footer year is calculated", check: "return text('footer') === '© ' + new Date().getFullYear() + ' Ada Obi' && /getFullYear\\(\\)/.test(code('src/App.jsx'));", fail: "© {new Date().getFullYear()} {profile.name}" },
            { label: "App.css lays the nav out in a row", check: "const t = $$('nav a').map((a) => Math.round(rect(a).top)); return style('nav', 'display') === 'flex' && new Set(t).size === 1 && /import\\s+[\"']\\.\\/App\\.css[\"']/.test(code('src/App.jsx'));", fail: "import \"./App.css\"; and nav { display: flex; } in App.css." },
          ],
          solution: {
            "src/App.jsx": `import "./App.css";

const profile = {
  name: "Ada Obi",
  role: "Frontend developer",
  bio: "I build accessible, fast web apps with React.",
  email: "ada@example.com",
  projects: ["Course catalogue", "Weather dashboard"],
};

export default function App() {
  return (
    <>
      <header>
        <h1>{profile.name}</h1>
        <p>{profile.role}</p>
        <nav>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main>
        <section id="about">
          <h2>About</h2>
          <p>{profile.bio}</p>
        </section>
        <section id="projects">
          <h2>Projects</h2>
          <p>{profile.projects.length} projects</p>
        </section>
        <section id="contact">
          <h2>Contact</h2>
          <a href={"mailto:" + profile.email}>{profile.email}</a>
        </section>
      </main>
      <footer>
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
`,
            "src/App.css": "nav {\n  display: flex;\n  gap: 16px;\n}\n",
          },
          hint: "Start with the fragment and the five landmarks, then fill each one from profile.",
          successMessage: "A complete page from data, in React. Change profile and the page follows.",
        }),
      },
    ],
    task: {
      title: "Module 1 practical: your portfolio with Vite",
      intro: "Now build your own on your computer: npm create vite@latest portfolio -- --template react, then npm install and npm run dev.",
      prompts: [
        "Replace the starter App.jsx with your own homepage: header, navigation, about, projects, contact and footer.",
        "Keep your details in one JavaScript object and render them with braces, as in the lab.",
        "Style it in App.css; check it at phone width in DevTools' device toolbar.",
        "Install React Developer Tools and find your App component and its contents in the Components tab.",
        "Run npm run build and npm run preview, and open the dist/ folder to see what Vite produced.",
        "Mastery checkpoint: explain what index.html, src/main.jsx, src/App.jsx and package.json each do, change the UI while the dev server is running, and run it locally for someone.",
      ],
      closing: "Next: Module 2, where the page becomes reusable components.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

