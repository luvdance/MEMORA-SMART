/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 27 · NPM AND MODERN TOOLING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l124-node-npm", [
    q({ id: "wdq124-1", atom: "a-wd-what-node", d: 2, prompt: "Why do frontend developers install Node.js?", options: ["To run development tools such as Vite, linters and test runners", "Because websites run on Node", "To replace the browser", "To write CSS"], correct: "a",
      explanation: "The tools are JavaScript programs that need a runtime outside the browser.",
      wrong: { b: "The site itself runs in browsers.", c: "Browsers still render the site.", d: "Unrelated." } }),
    q({ id: "wdq124-2", atom: "a-wd-npm", d: 2, prompt: "Where does npm put installed packages?", options: ["In a node_modules folder in the project", "In package.json", "On GitHub", "In the browser"], correct: "a",
      explanation: "package.json lists them; node_modules holds them.",
      wrong: { b: "That lists them.", c: "Not uploaded anywhere.", d: "Installed on your machine." } }),
    q({ id: "wdq124-3", atom: "a-wd-package-json", d: 3, prompt: "Why commit package-lock.json?", options: ["It records the exact versions installed, so everyone gets identical dependencies", "It contains your code", "GitHub requires it", "It is your password file"], correct: "a",
      explanation: "Reproducible installs everywhere.",
      wrong: { b: "Your code is in src.", c: "Not required, but important.", d: "No." } }),
    q({ id: "wdq124-4", atom: "a-wd-package-json", d: 2, prompt: "Why should node_modules never be committed?", options: ["It is large and anyone can recreate it with npm install", "It contains secrets", "Git cannot store folders", "It breaks the browser"], correct: "a",
      explanation: "package.json and the lockfile are enough to rebuild it.",
      wrong: { b: "Not usually; it is just too big and redundant.", c: "Git stores folders.", d: "Unrelated." } }),
  ]),

  ...check("wd-l125-dependencies-scripts", [
    q({ id: "wdq125-1", atom: "a-wd-install-remove", d: 2, prompt: "You clone a project with a package.json. What do you run first?", options: ["npm install", "npm init -y", "npm uninstall", "npm run build"], correct: "a",
      explanation: "It installs everything listed.",
      wrong: { b: "That creates a new package.json.", c: "Removes packages.", d: "Needs the dependencies first." } }),
    q({ id: "wdq125-2", atom: "a-wd-dev-prod-deps", d: 3, prompt: "Which belongs in devDependencies?", options: ["ESLint", "A date library the page uses", "A chart library the dashboard draws with", "A currency formatter used in the browser"], correct: "a",
      explanation: "A linter is used only during development.",
      wrong: { b: "Runs in the site.", c: "Runs in the site.", d: "Runs in the site." } }),
    q({ id: "wdq125-3", atom: "a-wd-npm-scripts", d: 2, prompt: "How do you run a script named lint?", options: ["npm run lint", "npm lint run", "node lint", "lint.js"], correct: "a",
      explanation: "npm run NAME.",
      wrong: { b: "Wrong order.", c: "Runs a file called lint.", d: "Not a command." } }),
    q({ id: "wdq125-4", atom: "a-wd-npm-scripts", d: 2, type: "scenario", prompt: "npm run test prints Missing script: \"test\". What does that mean?", options: ["package.json has no script called test", "npm is broken", "There are no tests to pass", "Node is not installed"], correct: "a",
      explanation: "Add a test script (Module 28) to fix it.",
      wrong: { b: "npm worked; the script is missing.", c: "It never got as far as running tests.", d: "npm would not run at all." } }),
  ]),

  ...check("wd-l126-build-tools-vite", [
    q({ id: "wdq126-1", atom: "a-wd-build-tools", d: 2, prompt: "Why do built files have names such as index-DkPmS8Zt.js?", options: ["The hash changes when the content does, so browsers can cache files safely for a long time", "To hide the code", "It is random decoration", "To make files bigger"], correct: "a",
      explanation: "New content, new name: no stale caches.",
      wrong: { b: "Hashes do not hide anything.", c: "It is derived from the content.", d: "No." } }),
    q({ id: "wdq126-2", atom: "a-wd-vite", d: 2, prompt: "Which command serves the built dist folder locally so you can check it before deploying?", options: ["npm run preview", "npm run dev", "npm install", "git push"], correct: "a",
      explanation: "preview serves the production build.",
      wrong: { b: "Serves the source with hot reload.", c: "Installs packages.", d: "Uploads commits." } }),
    q({ id: "wdq126-3", atom: "a-wd-env-vars", d: 3, prompt: "In Vite, which environment variables can frontend code read?", options: ["Only those starting with VITE_, and their values are visible in the built JavaScript", "All of them, privately", "None", "Only those starting with SECRET_"], correct: "a",
      explanation: "They are built into the public bundle.",
      wrong: { b: "Unprefixed ones are not exposed, and exposed ones are not private.", c: "VITE_ ones are.", d: "Not a Vite convention." } }),
    q({ id: "wdq126-4", atom: "a-wd-project-structure", d: 2, prompt: "Which of these should NOT be committed to Git?", options: ["dist/", "src/", "package.json", "index.html"], correct: "a",
      explanation: "Build output is recreated by npm run build.",
      wrong: { b: "Your source code.", c: "The project description.", d: "The entry page." } }),
  ]),
};
