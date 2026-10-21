/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 0 · WEB DEVELOPMENT FOUNDATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l1-welcome", [
    q({ id: "rxq1-1", atom: "a-rx-welcome-build", d: 1, prompt: "What is React?", options: ["A JavaScript library for building user interfaces from components", "A replacement for HTML and CSS", "A database", "A web server"], correct: "a",
      explanation: "React is a JavaScript library; it still produces HTML elements styled with CSS.",
      wrong: { b: "React runs on the web platform, it does not replace it.", c: "React has nothing to do with storing data.", d: "React runs in the browser; servers are separate." } }),
    q({ id: "rxq1-2", atom: "a-rx-welcome-phases", d: 1, prompt: "What does each module's mastery checkpoint check?", options: ["That you can explain what you built, not only make it run", "How fast you type", "That you memorised the documentation", "Nothing; it is optional decoration"], correct: "a",
      explanation: "Understanding is what lets you change and debug code later.",
      wrong: { b: "Speed is not assessed.", c: "Explaining in your own words is the point, not memorising.", d: "It is how you know a module is really done." } }),
    q({ id: "rxq1-3", atom: "a-rx-welcome-roadmap", d: 1, prompt: "Why does the course begin with Module 0, a review of HTML, CSS and JavaScript?", options: ["Every React component is JavaScript that produces HTML styled with CSS", "React needs no JavaScript", "To fill time", "Because React is written in CSS"], correct: "a",
      explanation: "Weakness in the platform shows up as confusion in React.",
      wrong: { b: "React is JavaScript.", c: "Each topic is used later.", d: "React is a JavaScript library." } }),
    q({ id: "rxq1-4", atom: "a-rx-welcome-build", d: 2, prompt: "What does every module of the course end with?", options: ["A practical assignment and a mastery checkpoint", "A quiz only", "Nothing; modules just stop", "A payment"], correct: "a",
      explanation: "Build it, then make sure you can explain it.",
      wrong: { b: "There is a practical too.", c: "Each ends with a practical.", d: "Unrelated." } }),
  ]),

  ...check("rx-l2-web", [
    q({ id: "rxq2-1", atom: "a-rx-client-server", d: 2, prompt: "A request returns status 404. What does it mean?", options: ["The server has nothing at that URL", "The server crashed", "The request succeeded", "You must log in"], correct: "a",
      explanation: "404 Not Found: the URL is wrong or the resource does not exist.",
      wrong: { b: "That is 5xx.", c: "Success is 2xx.", d: "That is usually 401." } }),
    q({ id: "rxq2-2", atom: "a-rx-client-server", d: 2, prompt: "In a request, which part says what you want to do, such as read or create?", options: ["The method, such as GET or POST", "The status code", "The domain", "The body's length"], correct: "a",
      explanation: "GET reads, POST creates, PUT/PATCH update, DELETE removes.",
      wrong: { b: "Status codes are in responses.", c: "The domain only says which server.", d: "Length says nothing about intent." } }),
    q({ id: "rxq2-3", atom: "a-rx-three-languages", d: 1, prompt: "Which language is responsible for what happens when a user clicks?", options: ["JavaScript", "HTML", "CSS", "HTTP"], correct: "a",
      explanation: "Behaviour lives in JavaScript.",
      wrong: { b: "HTML is content and meaning.", c: "CSS is presentation.", d: "HTTP is how files and data travel." } }),
    q({ id: "rxq2-4", atom: "a-rx-how-browser-renders", d: 3, prompt: "A plain <script> in <head> calls document.querySelector(\"#app\") for a div further down the page. What does it get?", options: ["null, because the parser has not reached the div yet", "The div", "An error before the page loads", "undefined"], correct: "a",
      explanation: "A plain script runs when the parser reaches it; use defer or type=\"module\".",
      wrong: { b: "The div does not exist yet.", c: "querySelector returns null rather than throwing; the error comes when you use the null.", d: "querySelector returns null, not undefined." } }),
  ]),

  ...check("rx-l3-html-css", [
    q({ id: "rxq3-1", atom: "a-rx-semantic-html", d: 2, prompt: "Why should an action be a <button> rather than a <div> with a click handler?", options: ["A button is focusable with Tab, works with Enter and Space, and is announced as a button", "Divs cannot have text", "Buttons are always blue", "Divs are deprecated"], correct: "a",
      explanation: "Native elements bring keyboard and screen-reader support for free.",
      wrong: { b: "Divs can hold text.", c: "Appearance is CSS.", d: "Divs are fine for layout." } }),
    q({ id: "rxq3-2", atom: "a-rx-forms-inputs", d: 2, prompt: "How do you connect a label to an input?", options: ["<label for=\"email\"> matching the input's id=\"email\", or by wrapping the input in the label", "Put the label text in placeholder", "Give both the same class", "Put them next to each other"], correct: "a",
      explanation: "for/id or wrapping creates the connection screen readers use.",
      wrong: { b: "A placeholder disappears when typing and is not a label.", c: "Classes do not connect elements.", d: "Being nearby is visual only." } }),
    q({ id: "rxq3-3", atom: "a-rx-box-model", d: 3, prompt: "With the default box-sizing, an element has width: 200px, padding: 10px and a 1px border. How wide is it on screen?", options: ["222px", "200px", "210px", "220px"], correct: "a",
      explanation: "200 + 10 + 10 + 1 + 1 = 222. border-box would make it 200.",
      wrong: { b: "That is border-box.", c: "Padding is on both sides.", d: "The border adds 2px too." } }),
    q({ id: "rxq3-4", atom: "a-rx-flex-grid", d: 2, prompt: "Which lays out a card grid that adapts to the screen without a media query?", options: ["grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))", "display: block", "float: left", "position: absolute"], correct: "a",
      explanation: "auto-fit with minmax fits as many columns as there is room for.",
      wrong: { b: "Blocks stack.", c: "Floats are an old workaround.", d: "Absolute positioning removes elements from flow." } }),
    q({ id: "rxq3-5", atom: "a-rx-media-queries", d: 2, prompt: "In mobile-first CSS, what does @media (min-width: 768px) contain?", options: ["The extra rules for tablets and wider; the phone layout is the default", "Rules for phones only", "Rules that apply everywhere", "Print styles"], correct: "a",
      explanation: "min-width queries add to the default as the screen grows.",
      wrong: { b: "Phones are the default, outside the query.", c: "They only apply from 768px.", d: "That is @media print." } }),
  ]),

  ...check("rx-l4-js-core", [
    q({ id: "rxq4-1", atom: "a-rx-values-types", d: 2, prompt: "What is \"3\" + 4 in JavaScript?", options: ["\"34\"", "7", "NaN", "An error"], correct: "a",
      explanation: "+ with a string joins. Convert input values with Number() first.",
      wrong: { b: "That would need Number(\"3\").", c: "Nothing here is not-a-number.", d: "It is valid." } }),
    q({ id: "rxq4-2", atom: "a-rx-conditions-loops", d: 3, prompt: "What does count && \"New\" give when count is 0?", options: ["0", "\"New\"", "false", "undefined"], correct: "a",
      explanation: "&& returns the left side when it is falsy, here 0.",
      wrong: { b: "Only when count is truthy.", c: "It returns the value, not a boolean.", d: "It returns 0." } }),
    q({ id: "rxq4-3", atom: "a-rx-functions-scope", d: 2, prompt: "A variable is declared with let inside a function. Where can it be used?", options: ["Only inside that function, including functions written inside it", "Anywhere in the file", "Anywhere on the page", "Only on the next line"], correct: "a",
      explanation: "Function scope; inner functions can read it (a closure).",
      wrong: { b: "It is not visible outside the function.", c: "It is not global.", d: "It is visible in the whole function." } }),
    q({ id: "rxq4-4", atom: "a-rx-arrays-objects", d: 3, prompt: "const a = [1, 2]; const b = a; b.push(3); What is a.length?", options: ["3", "2", "1", "An error"], correct: "a",
      explanation: "b is the same array as a, not a copy.",
      wrong: { b: "a and b are one array.", c: "Nothing was removed.", d: "push on a const array is allowed; only reassignment is not." } }),
  ]),

  ...check("rx-l5-js-data", [
    q({ id: "rxq5-1", atom: "a-rx-array-methods", d: 2, prompt: "Which method returns the first item that matches, or undefined?", options: ["find", "filter", "map", "reduce"], correct: "a",
      explanation: "find stops at the first match.",
      wrong: { b: "filter returns an array of every match.", c: "map transforms every item.", d: "reduce folds into one value." } }),
    q({ id: "rxq5-2", atom: "a-rx-array-methods", d: 2, prompt: "What is [1, 2, 3].reduce((sum, n) => sum + n, 0)?", options: ["6", "[1, 2, 3]", "0", "3"], correct: "a",
      explanation: "0 + 1 + 2 + 3.",
      wrong: { b: "reduce returns one value.", c: "0 is only the start.", d: "That is the last item." } }),
    q({ id: "rxq5-3", atom: "a-rx-modern-syntax", d: 3, prompt: "const user = { name: \"Ada\", age: 16 }; const next = { ...user, age: 17 }; What is user.age?", options: ["16", "17", "undefined", "An error"], correct: "a",
      explanation: "Spread made a new object; the original is unchanged.",
      wrong: { b: "Only next has 17.", c: "user still has age.", d: "This is valid." } }),
    q({ id: "rxq5-4", atom: "a-rx-modules", d: 2, prompt: "A file has export default function Card() {}. How is it imported?", options: ["import Card from \"./Card.jsx\"", "import { Card } from \"./Card.jsx\"", "require Card", "include \"./Card.jsx\""], correct: "a",
      explanation: "Default exports are imported without braces.",
      wrong: { b: "Braces are for named exports.", c: "Not ES module syntax.", d: "Not JavaScript." } }),
    q({ id: "rxq5-5", atom: "a-rx-dom-events", d: 2, prompt: "In a submit handler, what stops the browser reloading the page?", options: ["event.preventDefault()", "return false from anywhere", "event.stop()", "removeEventListener"], correct: "a",
      explanation: "preventDefault cancels the default action, here submitting and reloading.",
      wrong: { b: "Not with addEventListener.", c: "There is no such method.", d: "That only removes the handler." } }),
  ]),

  ...check("rx-l6-async", [
    q({ id: "rxq6-1", atom: "a-rx-arrow-callbacks", d: 2, prompt: "onClick={() => setOpen(true)} passes React…", options: ["A function to call later, when the click happens", "The result of setOpen(true), now", "A string", "Nothing"], correct: "a",
      explanation: "The arrow function is the callback; React calls it on click.",
      wrong: { b: "That would be onClick={setOpen(true)}, which runs during render.", c: "It is a function.", d: "It passes a function." } }),
    q({ id: "rxq6-2", atom: "a-rx-promises", d: 3, prompt: "console.log(1); Promise.resolve().then(() => console.log(2)); console.log(3); prints…", options: ["1 3 2", "1 2 3", "2 1 3", "3 2 1"], correct: "a",
      explanation: "then callbacks wait for the current code to finish.",
      wrong: { b: "The callback does not interrupt.", c: "1 runs first.", d: "1 runs first." } }),
    q({ id: "rxq6-3", atom: "a-rx-async-await", d: 2, prompt: "Where should you switch a loading indicator off so it happens on success and on failure?", options: ["In finally", "Only in try", "Only in catch", "Before the await"], correct: "a",
      explanation: "finally runs either way.",
      wrong: { b: "It would stay on after an error.", c: "It would stay on after success.", d: "Too early." } }),
    q({ id: "rxq6-4", atom: "a-rx-fetch-api", d: 3, prompt: "fetch receives a 500 response. What does the fetch promise do?", options: ["It fulfils, with response.ok set to false", "It rejects", "It never settles", "It retries"], correct: "a",
      explanation: "Only network failures reject; check response.ok.",
      wrong: { b: "A response arrived, so it fulfils.", c: "It settles.", d: "fetch never retries on its own." } }),
  ]),

  ...check("rx-l7-tools", [
    q({ id: "rxq7-1", atom: "a-rx-vscode-devtools", d: 1, prompt: "Which DevTools panel shows every request a page made and its status code?", options: ["Network", "Elements", "Console", "Application"], correct: "a",
      explanation: "Network lists requests, statuses, sizes and timing.",
      wrong: { b: "Elements is the DOM.", c: "Console is logs and errors.", d: "Application is storage." } }),
    q({ id: "rxq7-2", atom: "a-rx-terminal-npm", d: 2, prompt: "What does npm install do in a project with a package.json?", options: ["Downloads every package listed into node_modules", "Starts the development server", "Deploys the site", "Deletes old files"], correct: "a",
      explanation: "It recreates node_modules from package.json and the lock file.",
      wrong: { b: "That is npm run dev.", c: "Deployment is separate.", d: "It installs." } }),
    q({ id: "rxq7-3", atom: "a-rx-git-basics", d: 2, prompt: "Which folder must never be committed to Git?", options: ["node_modules", "src", "public", "The folder with package.json"], correct: "a",
      explanation: "It is regenerated with npm install; .gitignore excludes it.",
      wrong: { b: "src is your code.", c: "public holds your static files.", d: "That is the project itself." } }),
    q({ id: "rxq7-4", atom: "a-rx-terminal-npm", d: 2, prompt: "What does npm run dev do?", options: ["Runs the \"dev\" script listed in package.json", "Installs every package", "Deploys the site", "Creates a new project"], correct: "a",
      explanation: "npm run NAME runs the script called NAME.",
      wrong: { b: "That is npm install.", c: "Deployment is separate.", d: "That is npm create." } }),
  ]),

  ...check("rx-l8-m0-project", [
    q({ id: "rxq8-1", atom: "a-rx-m0-project", d: 2, prompt: "Why compute \"2 of 4 courses completed\" from the array instead of typing it?", options: ["So it stays correct when the data changes", "Typed text is not allowed in HTML", "It is faster to type", "Browsers require it"], correct: "a",
      explanation: "Derived values follow the data. React makes this the default way of thinking.",
      wrong: { b: "It is allowed, just fragile.", c: "It is not about typing speed.", d: "Browsers do not care." } }),
    q({ id: "rxq8-2", atom: "a-rx-m0-project", d: 3, prompt: "A callback in your own words is…", options: ["A function you give to other code, which that code calls later", "A function that calls itself", "A phone call to the server", "A variable holding a number"], correct: "a",
      explanation: "map, addEventListener and then all take callbacks.",
      wrong: { b: "That is recursion.", c: "It is not a network concept.", d: "It is a function." } }),
    q({ id: "rxq8-3", atom: "a-rx-m0-project", d: 2, prompt: "What makes JavaScript code asynchronous?", options: ["It starts a slow task and carries on; the result is handled later by a callback or await", "It runs on another computer", "It uses var", "It is very fast"], correct: "a",
      explanation: "Waiting without freezing the page.",
      wrong: { b: "It runs in the same browser.", c: "Unrelated.", d: "Speed is unrelated." } }),
    q({ id: "rxq8-4", atom: "a-rx-m0-project", d: 2, prompt: "Which CSS makes the course list two columns only from tablet width?", options: ["@media (min-width: 768px) { #courses { grid-template-columns: repeat(2, 1fr); } }", "#courses { columns: 2; } with no media query", "@media (max-width: 768px) { … two columns … }", "Two separate HTML pages"], correct: "a",
      explanation: "Mobile first: one column by default, two from 768px.",
      wrong: { b: "Two columns on phones too.", c: "That applies below 768px.", d: "One responsive page is enough." } }),
  ]),
};
