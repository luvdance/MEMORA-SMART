/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 14
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l52-git-github": {
    lessonId: "js-l52-git-github",
    passMark: 70,
    questions: [
      {
        id: "jsq52-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-git-basics",
        prompt: "You edited app.js. What must happen before git commit includes that change?",
        options: [
          { id: "a", text: "Nothing; commit includes all edits" },
          { id: "b", text: "git add app.js, to stage it" },
          { id: "c", text: "git push" },
          { id: "d", text: "git init again" },
        ],
        correct: "b",
        explanation: "Only staged changes go into a commit. git add moves a change from the working folder to the staging area.",
        whyWrong: {
          a: "Unstaged edits are left out of the commit.",
          c: "push sends existing commits to a remote; it does not create them.",
          d: "init is run once to create the repository.",
        },
      },
      {
        id: "jsq52-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-commit-messages",
        prompt: "Which is the best commit message?",
        options: [
          { id: "a", text: "changes" },
          { id: "b", text: "Fix task count showing one too many after delete" },
          { id: "c", text: "asdfgh" },
          { id: "d", text: "Friday's work" },
        ],
        correct: "b",
        explanation: "It says what the commit does and which problem it solves, so anyone reading the history understands it.",
        whyWrong: {
          a: "Every commit contains changes; this says nothing.",
          c: "Meaningless.",
          d: "A date is recorded automatically; the message should say what changed.",
        },
      },
      {
        id: "jsq52-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-branches",
        prompt: "Why build a new feature on a branch instead of directly on main?",
        options: [
          { id: "a", text: "Branches make code run faster" },
          { id: "b", text: "main stays working while the feature is unfinished, and the feature can be reviewed or discarded" },
          { id: "c", text: "Git does not allow commits to main" },
          { id: "d", text: "Branches are required for GitHub" },
        ],
        correct: "b",
        explanation: "A branch isolates work in progress. main only receives the feature when it is finished and tested.",
        whyWrong: {
          a: "Branches have nothing to do with runtime speed.",
          c: "You can commit to main; it is just safer not to for unfinished work.",
          d: "A repository can be pushed with only main.",
        },
      },
      {
        id: "jsq52-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-github",
        prompt: "You accidentally commit and push an API key, then delete it in the next commit. Is the key safe?",
        options: [
          { id: "a", text: "Yes, it has been deleted" },
          { id: "b", text: "No: the earlier commit still contains it, so treat it as leaked and revoke it" },
          { id: "c", text: "Yes, if the repository is renamed" },
          { id: "d", text: "Yes, after 24 hours" },
        ],
        correct: "b",
        explanation: "Git keeps every commit. Anyone can check out the earlier one, and bots scan public repositories constantly. Revoke the key and issue a new one.",
        whyWrong: {
          a: "Deleting it from the latest commit leaves it in the history.",
          c: "Renaming does not change the history.",
          d: "Nothing expires; the history is permanent.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l53-node-npm-vite": {
    lessonId: "js-l53-node-npm-vite",
    passMark: 70,
    questions: [
      {
        id: "jsq53-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-npm",
        prompt: "A teammate clones your project. Which command installs everything it needs?",
        options: [
          { id: "a", text: "npm init" },
          { id: "b", text: "npm install" },
          { id: "c", text: "npm run dev" },
          { id: "d", text: "git pull" },
        ],
        correct: "b",
        explanation: "npm install with no package name reads package.json (and the lock file) and installs every listed package.",
        whyWrong: {
          a: "init creates a new package.json.",
          c: "That runs the dev script, which fails until packages are installed.",
          d: "pull fetches commits; node_modules is not in Git.",
        },
      },
      {
        id: "jsq53-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-package-json",
        prompt: "package.json lists \"date-fns\": \"^4.1.0\". Which version could npm install?",
        options: [
          { id: "a", text: "5.0.0" },
          { id: "b", text: "4.8.2" },
          { id: "c", text: "3.9.0" },
          { id: "d", text: "Only exactly 4.1.0" },
        ],
        correct: "b",
        explanation: "A caret range accepts later minor and patch versions within the same major version: 4.1.0 up to, but not including, 5.0.0.",
        whyWrong: {
          a: "A new major version may break compatibility, so the caret excludes it.",
          c: "That is older than the minimum given.",
          d: "An exact version would be written without the caret.",
        },
      },
      {
        id: "jsq53-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-package-json",
        prompt: "Where does a testing tool like vitest belong in package.json?",
        options: [
          { id: "a", text: "dependencies" },
          { id: "b", text: "devDependencies" },
          { id: "c", text: "scripts" },
          { id: "d", text: "It should not be listed" },
        ],
        correct: "b",
        explanation: "It is needed to develop and test the app, not to run it, so it is a devDependency.",
        whyWrong: {
          a: "dependencies are packages the running app needs.",
          c: "scripts holds commands, such as \"test\": \"vitest\", not packages.",
          d: "Unlisted packages would not be installed for teammates.",
        },
      },
      {
        id: "jsq53-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-vite",
        prompt: "What does npm run build produce in a Vite project?",
        options: [
          { id: "a", text: "A local development server" },
          { id: "b", text: "An optimised site in the dist folder, ready to deploy" },
          { id: "c", text: "A new package.json" },
          { id: "d", text: "A Git commit" },
        ],
        correct: "b",
        explanation: "build bundles and minifies the app into dist, which is what you upload to a host.",
        whyWrong: {
          a: "That is npm run dev.",
          c: "package.json is created by npm init.",
          d: "Build tools never commit for you.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l54-code-quality": {
    lessonId: "js-l54-code-quality",
    passMark: 70,
    questions: [
      {
        id: "jsq54-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-architecture",
        prompt: "In a well-organised front end, which direction should dependencies point?",
        options: [
          { id: "a", text: "Logic modules import UI modules" },
          { id: "b", text: "UI modules import logic and models; logic and models never import UI" },
          { id: "c", text: "Everything imports everything" },
          { id: "d", text: "Nothing imports anything" },
        ],
        correct: "b",
        explanation: "Keeping logic free of the UI means it can be tested without a browser and reused when the UI changes.",
        whyWrong: {
          a: "Then logic could not run without the page.",
          c: "That creates tangled, circular code that is hard to change.",
          d: "Modules exist to be imported where needed.",
        },
      },
      {
        id: "jsq54-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-architecture-choice",
        prompt: "Why write isOverdue(task, today) instead of reading new Date() inside the function?",
        options: [
          { id: "a", text: "new Date() is slow" },
          { id: "b", text: "Passing today in makes the function predictable and testable for any date" },
          { id: "c", text: "Functions cannot call new Date()" },
          { id: "d", text: "It is shorter" },
        ],
        correct: "b",
        explanation: "A function that reads the clock gives different answers on different days. One that receives the date always gives the same answer for the same inputs.",
        whyWrong: {
          a: "Speed is not the concern.",
          c: "They can; it just makes them hard to test.",
          d: "It is slightly longer, and worth it.",
        },
      },
      {
        id: "jsq54-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-linting",
        prompt: "What does a linter like ESLint do?",
        options: [
          { id: "a", text: "Runs your tests" },
          { id: "b", text: "Reads code without running it and reports likely mistakes" },
          { id: "c", text: "Deploys your site" },
          { id: "d", text: "Installs packages" },
        ],
        correct: "b",
        explanation: "Linters analyse source code statically, catching things like unused variables and == comparisons.",
        whyWrong: {
          a: "That is a test runner.",
          c: "That is a hosting service.",
          d: "That is npm.",
        },
      },
      {
        id: "jsq54-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-formatting",
        prompt: "What is the difference between a formatter and a linter?",
        options: [
          { id: "a", text: "There is none" },
          { id: "b", text: "A formatter enforces consistent layout; a linter reports probable bugs and bad patterns" },
          { id: "c", text: "A formatter finds bugs; a linter fixes spacing" },
          { id: "d", text: "Formatters only work on CSS" },
        ],
        correct: "b",
        explanation: "Prettier settles style automatically; ESLint flags code that is likely to be wrong. Projects usually use both.",
        whyWrong: {
          a: "They solve different problems.",
          c: "That is the wrong way round.",
          d: "Prettier formats JavaScript, CSS, HTML, JSON and more.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l55-config-security-deploy": {
    lessonId: "js-l55-config-security-deploy",
    passMark: 70,
    questions: [
      {
        id: "jsq55-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-env-config",
        prompt: "VITE_DEBUG is set to \"false\". The code says if (import.meta.env.VITE_DEBUG) { enableDebug(); }. What happens?",
        options: [
          { id: "a", text: "Debug stays off" },
          { id: "b", text: "Debug turns on, because the string \"false\" is truthy" },
          { id: "c", text: "An error" },
          { id: "d", text: "It depends on the browser" },
        ],
        correct: "b",
        explanation: "Environment variables are strings. Any non-empty string is truthy. Compare with === \"true\" instead.",
        whyWrong: {
          a: "Only the empty string is falsy; \"false\" is not empty.",
          c: "Testing a string's truthiness never throws.",
          d: "Truthiness rules are the same everywhere.",
        },
      },
      {
        id: "jsq55-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-security-practices",
        prompt: "What does npm audit check?",
        options: [
          { id: "a", text: "Your code style" },
          { id: "b", text: "Your installed packages against a database of known vulnerabilities" },
          { id: "c", text: "Whether your tests pass" },
          { id: "d", text: "Your Git history for secrets" },
        ],
        correct: "b",
        explanation: "npm audit compares dependency versions with published security advisories and suggests fixes.",
        whyWrong: {
          a: "That is a linter or formatter.",
          c: "That is your test runner.",
          d: "Secret scanning is a separate tool.",
        },
      },
      {
        id: "jsq55-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-deployment",
        prompt: "With a Vite site connected to Vercel through GitHub, what happens when you push to main?",
        options: [
          { id: "a", text: "Nothing until you upload files manually" },
          { id: "b", text: "Vercel builds the site and publishes the new version automatically" },
          { id: "c", text: "Your local site is deleted" },
          { id: "d", text: "GitHub runs your site" },
        ],
        correct: "b",
        explanation: "The host watches the repository, runs the build command, and deploys the dist output.",
        whyWrong: {
          a: "Connecting the repository is what makes it automatic.",
          c: "Your local files are untouched.",
          d: "GitHub stores the code; the host builds and serves it.",
        },
      },
      {
        id: "jsq55-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-troubleshooting",
        prompt: "A deployed single-page app loads at / but refreshing /settings gives the host's 404 page. Why?",
        options: [
          { id: "a", text: "/settings was never built" },
          { id: "b", text: "Only index.html exists; the host needs a rewrite so every route serves index.html" },
          { id: "c", text: "The browser cache is broken" },
          { id: "d", text: "JavaScript is disabled on the host" },
        ],
        correct: "b",
        explanation: "Client-side routes exist only in your JavaScript. On a fresh request the host looks for a /settings file, finds none, and returns 404 unless rewritten to index.html.",
        whyWrong: {
          a: "There is no separate file for routes in a single-page app; that is the point.",
          c: "Every visitor sees it, cache or not.",
          d: "The host serves files; JavaScript runs in the browser.",
        },
      },
    ],
  },
};
