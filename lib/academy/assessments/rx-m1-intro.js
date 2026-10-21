/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 1 · INTRODUCTION TO REACT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l9-why-react", [
    q({ id: "rxq9-1", atom: "a-rx-what-react", d: 2, prompt: "Which problem does React mainly solve?", options: ["Keeping the interface in sync with changing data, from reusable components", "Storing data in a database", "Making images smaller", "Hosting websites"], correct: "a",
      explanation: "You describe the UI for the current data; React updates the screen when the data changes.",
      wrong: { b: "React is a UI library.", c: "That is image optimisation.", d: "Hosting is separate." } }),
    q({ id: "rxq9-2", atom: "a-rx-declarative", d: 2, prompt: "Which is declarative?", options: ["return <p>{items.length} items</p>", "document.querySelector(\"p\").textContent = items.length", "ul.appendChild(li)", "el.classList.add(\"open\")"], correct: "a",
      explanation: "It describes the result; React performs the steps.",
      wrong: { b: "A step-by-step instruction.", c: "A step-by-step instruction.", d: "A step-by-step instruction." } }),
    q({ id: "rxq9-3", atom: "a-rx-spa-components", d: 2, prompt: "What makes an app a single-page application?", options: ["It loads one page once, then swaps content in JavaScript without full reloads", "It has only one component", "It has only one screen of content", "It has no JavaScript"], correct: "a",
      explanation: "Navigation happens inside the loaded app.",
      wrong: { b: "SPAs have many components.", c: "It can show many screens.", d: "SPAs depend on JavaScript." } }),
    q({ id: "rxq9-4", atom: "a-rx-spa-components", d: 1, prompt: "In component-based architecture, what is <App />?", options: ["The root of the component tree", "An HTML element", "A CSS class", "A server"], correct: "a",
      explanation: "Everything else is rendered inside App.",
      wrong: { b: "Capitalised tags are components.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l10-vite", [
    q({ id: "rxq10-1", atom: "a-rx-create-vite", d: 1, prompt: "Which command creates a new React project with Vite?", options: ["npm create vite@latest my-app -- --template react", "npx create-react-app my-app", "npm install react-app", "vite new react"], correct: "a",
      explanation: "Vite's scaffold with the react template.",
      wrong: { b: "Create React App is deprecated.", c: "Not a scaffolding command.", d: "Not a Vite command." } }),
    q({ id: "rxq10-2", atom: "a-rx-project-structure", d: 2, prompt: "In a Vite React project, which file finds the #root element and renders <App />?", options: ["src/main.jsx", "src/App.jsx", "package.json", "vite.config.js"], correct: "a",
      explanation: "index.html → main.jsx → App.jsx.",
      wrong: { b: "App is the component being rendered.", c: "package.json lists scripts and dependencies.", d: "That configures Vite." } }),
    q({ id: "rxq10-3", atom: "a-rx-project-structure", d: 2, prompt: "Where does package.json list react and react-dom?", options: ["dependencies", "scripts", "devDependencies only", "It does not"], correct: "a",
      explanation: "They are needed by the app itself; build tools go in devDependencies.",
      wrong: { b: "Scripts are commands.", c: "Vite and its plugins go there.", d: "It lists them." } }),
    q({ id: "rxq10-4", atom: "a-rx-dev-build", d: 2, prompt: "What does npm run build produce?", options: ["An optimised production build in dist/", "A running dev server", "A new project", "A Git commit"], correct: "a",
      explanation: "dist/ is what you deploy.",
      wrong: { b: "That is npm run dev.", c: "That is npm create vite.", d: "Unrelated." } }),
  ]),

  ...check("rx-l11-jsx", [
    q({ id: "rxq11-1", atom: "a-rx-jsx-is-js", d: 2, prompt: "What does JSX become before the browser runs it?", options: ["JavaScript function calls that create element objects", "HTML files", "CSS", "JSON"], correct: "a",
      explanation: "The compiler turns tags into calls like createElement.",
      wrong: { b: "It is compiled to JavaScript.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq11-2", atom: "a-rx-jsx-is-js", d: 2, prompt: "Why must component names start with a capital letter?", options: ["Lower-case tags are treated as HTML elements", "It is a style preference only", "Capitals run faster", "JavaScript requires it for all functions"], correct: "a",
      explanation: "<card /> would be an unknown HTML element; <Card /> is your component.",
      wrong: { b: "It changes what React renders.", c: "No speed difference.", d: "Ordinary functions can be lower-case." } }),
    q({ id: "rxq11-3", atom: "a-rx-jsx-expressions", d: 2, prompt: "Which can go inside { } in JSX?", options: ["{user.premium ? \"Pro\" : \"Free\"}", "{if (premium) { \"Pro\" }}", "{for (const c of list) {}}", "{let x = 1}"], correct: "a",
      explanation: "Braces take expressions; statements are not allowed.",
      wrong: { b: "if is a statement.", c: "for is a statement.", d: "A declaration is a statement." } }),
    q({ id: "rxq11-4", atom: "a-rx-jsx-rules", d: 2, prompt: "How do you give a JSX element a CSS class?", options: ["className=\"card\"", "class=\"card\"", "cssClass=\"card\"", "style=\"card\""], correct: "a",
      explanation: "class is a JavaScript keyword, so JSX uses className.",
      wrong: { b: "React warns; use className.", c: "Not an attribute.", d: "style takes an object of CSS properties." } }),
    q({ id: "rxq11-5", atom: "a-rx-jsx-rules", d: 3, prompt: "A component must return two sibling paragraphs with no extra element in the DOM. What do you use?", options: ["A fragment: <>…</>", "A <div>", "An array of strings", "Two return statements"], correct: "a",
      explanation: "Fragments group without adding an element.",
      wrong: { b: "That adds an element.", c: "That would not create paragraphs.", d: "Only the first return runs." } }),
  ]),

  ...check("rx-l12-rendering-tools", [
    q({ id: "rxq12-1", atom: "a-rx-createroot", d: 2, prompt: "Which statement starts a React 19 app?", options: ["createRoot(document.getElementById(\"root\")).render(<App />)", "ReactDOM.render(<App />, root)", "new React(App)", "document.body.append(<App />)"], correct: "a",
      explanation: "createRoot from react-dom/client, then render.",
      wrong: { b: "Removed in React 19.", c: "Not an API.", d: "JSX is not a DOM node." } }),
    q({ id: "rxq12-2", atom: "a-rx-devtools-react", d: 2, prompt: "Which tool shows a component's current props and state?", options: ["The Components tab of React Developer Tools", "The Network tab", "The Elements tab", "The terminal"], correct: "a",
      explanation: "Select a component to see and edit its props and Hooks.",
      wrong: { b: "Requests only.", c: "DOM elements, not React data.", d: "The terminal shows the dev server's output." } }),
    q({ id: "rxq12-3", atom: "a-rx-strict-mode", d: 3, prompt: "Why does Strict Mode call your component function twice in development?", options: ["To expose impure components whose result changes when they run again", "To make the app faster", "Because of a bug in React", "To run the app on two screens"], correct: "a",
      explanation: "A pure component gives the same result every time.",
      wrong: { b: "It makes development slower, on purpose.", c: "It is deliberate.", d: "Unrelated." } }),
    q({ id: "rxq12-4", atom: "a-rx-strict-mode", d: 2, prompt: "Does Strict Mode's double rendering happen for your users in production?", options: ["No, development only", "Yes, always", "Only on phones", "Only on slow connections"], correct: "a",
      explanation: "The production build has no Strict Mode checks.",
      wrong: { b: "It is a development check.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l13-m1-project", [
    q({ id: "rxq13-1", atom: "a-rx-m1-project", d: 2, prompt: "Your portfolio shows a blank page and the console says \"Target container is not a DOM element\". What is wrong?", options: ["main.jsx asks for an element id that index.html does not have", "App.css has an error", "package.json is missing a script", "The heading is too long"], correct: "a",
      explanation: "createRoot received null: the id does not match.",
      wrong: { b: "CSS errors do not stop rendering.", c: "The app is already running.", d: "Unrelated." } }),
    q({ id: "rxq13-2", atom: "a-rx-m1-project", d: 2, prompt: "Where do you put the styles for the portfolio?", options: ["In a CSS file such as App.css, imported by the component", "In package.json", "Only in inline style strings", "In index.html's title"], correct: "a",
      explanation: "Vite bundles imported CSS.",
      wrong: { b: "package.json is configuration.", c: "style takes objects, and a CSS file is clearer.", d: "Unrelated." } }),
    q({ id: "rxq13-3", atom: "a-rx-m1-project", d: 3, prompt: "You save App.jsx while npm run dev is running. What happens?", options: ["Vite updates the page in the browser almost instantly", "Nothing until you run npm run build", "You must restart the dev server", "The browser downloads dist/"], correct: "a",
      explanation: "Hot module replacement.",
      wrong: { b: "build is for production.", c: "Not needed.", d: "dist/ is not used in development." } }),
    q({ id: "rxq13-4", atom: "a-rx-m1-project", d: 2, prompt: "Why put the portfolio's details in one profile object instead of typing them into the JSX?", options: ["The page is generated from data, so changing the object changes the page", "JSX cannot contain text", "Objects render faster", "React requires it"], correct: "a",
      explanation: "Data first, then the UI describes it.",
      wrong: { b: "It can.", c: "Not the reason.", d: "Not required." } }),
  ]),
};
