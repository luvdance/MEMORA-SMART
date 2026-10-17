/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 14 · DEVELOPMENT TOOLS & CODE QUALITY
 *
 * Curriculum 14.1 – 14.10. Phase 7. The professional toolchain: Git, GitHub,
 * npm, Vite, linting, configuration, security and deployment.
 *
 * Terminal sessions are shown as worked examples. The graded practices are
 * either judgement calls a developer makes daily, or JavaScript the content
 * validator runs: reading package.json, resolving configuration, comparing
 * version ranges.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s14-tooling";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 14.1 – 14.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l52-git-github",
    moduleId: "js-w14-tooling",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2"],
    title: "Git and GitHub",
    subtitle: "Version control: the safety net under every project",
    estimatedMinutes: 18,
    intro:
      "Every professional project lives in version control. It records every change, who made it and why, lets you go back to any earlier state, and lets a team work on the same code without overwriting each other. Git is the tool; GitHub is where Git projects are shared.",

    atoms: [
      {
        id: "a-js-git-basics",
        title: "Git and version control",
        explain:
          "Git takes snapshots of your project called commits. Each commit records exactly what changed since the last one, with a message saying why. Changes go through three places: your working folder, where you edit; the staging area, where you choose what goes into the next commit; and the repository, where commits are stored permanently.",
        example:
          "> git init                        start tracking this folder\n> git status                      what has changed?\n> git add app.js style.css        stage these two files\n> git commit -m \"Add task filtering by status\"\n> git log --oneline               the history, newest first\n\n  3f2a9c1 Add task filtering by status\n  b81d004 Save tasks to localStorage\n  1c0e7aa Initial task manager",
        table: {
          caption: "The three places a change can be.",
          headers: ["Place", "Contains", "Command to move forward"],
          rows: [
            ["Working folder", "Your edits, not yet recorded", "git add file"],
            ["Staging area", "Changes chosen for the next commit", "git commit -m \"why\""],
            ["Repository", "Every commit, permanently", "git push (to share it)"],
          ],
        },
        why: "With commits, a mistake is never permanent. If today's change broke everything, you can see exactly what changed, and return to yesterday's working version in one command.",
      },
      {
        id: "a-js-commit-messages",
        title: "Commits worth having",
        explain:
          "A good commit contains one logical change and a message that says what it does and why, in the imperative mood: \"Fix off-by-one in task count\", not \"stuff\" or \"fixed it\". Commit often, whenever something works, so each commit is small enough to understand and undo on its own.",
        decision: {
          scenario: "You have spent the afternoon adding a search box, fixing an unrelated bug in delete, and reformatting three files.",
          question: "How should this go into Git?",
          options: [
            {
              id: "a",
              text: "Three commits: \"Add live search to the task list\", \"Fix delete removing the wrong task\", \"Format files with Prettier\"",
              why: "Each commit is one idea with an honest message. If the search turns out to be buggy, it can be reverted without losing the delete fix, and a reviewer can read each change on its own.",
            },
            {
              id: "b",
              text: "One commit: \"updates\"",
              whyWrong: "The bug fix is now tangled up with a feature and with hundreds of formatting changes. Nobody can find it, review it or undo it separately, and \"updates\" says nothing.",
            },
            {
              id: "c",
              text: "Do not commit until the whole project is finished",
              whyWrong: "Days of work with no safety net. One bad change and there is nothing to go back to.",
            },
            {
              id: "d",
              text: "One commit per file changed",
              whyWrong: "The search feature probably touched several files, and splitting it by file produces commits that do not work on their own.",
            },
          ],
          correct: "a",
          aftermath: "Your commit history is a public record of how you work. Employers read it. A history of small, clearly described commits is one of the strongest signals in a junior developer's portfolio.",
        },
      },
      {
        id: "a-js-branches",
        title: "Branches",
        explain:
          "A branch is an independent line of commits. The main branch holds the working version. To build something new, create a branch, commit to it freely, and merge it back into main when it is finished and tested. Main stays working the whole time, even while a feature is half-built.",
        example:
          "> git switch -c search-feature      create a branch and move to it\n  …edit, git add, git commit, as often as you like…\n> git switch main                    back to the working version\n> git merge search-feature           bring the finished work in\n\n  main     ●───●───────────●   (merge)\n                \\         /\n  search         ●───●───●",
        why: "Branches are how teams work in parallel: everyone builds on their own branch, and main only receives finished work. Even alone, a branch lets you try an idea and throw it away with nothing lost.",
      },
      {
        id: "a-js-github",
        title: "GitHub repositories",
        explain:
          "GitHub hosts Git repositories online. You connect your local repository to one on GitHub, called a remote, and push your commits to it. Collaborators pull changes down. A pull request proposes merging a branch, so others can review the change before it reaches main.",
        example:
          "Create an empty repository on github.com, then:\n\n> git remote add origin https://github.com/yourname/task-manager.git\n> git push -u origin main            first push; later just  git push\n\nWorking with a team:\n\n> git pull                           get everyone else's commits\n> git switch -c fix-delete\n  …commit the fix…\n> git push -u origin fix-delete\n  → on GitHub, open a Pull Request from fix-delete into main\n  → a teammate reviews, comments, approves\n  → merge on GitHub; everyone runs  git pull",
        why: "Your GitHub profile is your portfolio. The capstone in Week 16 is assessed partly on its repository: a sensible commit history, branches for features, and a README that explains the project.",
        mistake:
          "Committing a .env file, node_modules, or a password. Anything pushed to a public repository should be treated as public forever, even if you delete it in a later commit, because the earlier commit still contains it.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 14.3 – 14.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l53-node-npm-vite",
    moduleId: "js-w14-tooling",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.3", "14.4", "14.5"],
    title: "Node.js, npm and Vite",
    subtitle: "Packages, dependencies and a modern project",
    estimatedMinutes: 18,
    intro:
      "No modern project is written from scratch. You stand on packages other people have written: a date library, a testing tool, React itself. npm installs and tracks them, package.json records what your project needs, and Vite turns your source files into a fast development server and an optimised site.",

    atoms: [
      {
        id: "a-js-npm",
        title: "Node.js and npm fundamentals",
        explain:
          "npm, the Node Package Manager, comes with Node.js. It downloads packages from the npm registry into a node_modules folder and records them in package.json. npm init creates a package.json; npm install name adds a package; npm install on its own installs everything package.json lists, which is how a teammate sets up your project.",
        example:
          "> npm init -y                   create package.json with defaults\n> npm install date-fns           a dependency the app needs to run\n> npm install --save-dev vitest  a devDependency, needed only to develop\n> npm install                    install everything listed (after cloning)\n> npm run test                   run the \"test\" script from package.json\n\nnode_modules/ can be huge. It is never committed:\nadd it to .gitignore, and anyone can recreate it with  npm install.",
        why: "Because package.json lists exactly what the project needs, your repository stays small and anyone can rebuild the full environment with one command.",
      },
      {
        id: "a-js-package-json",
        title: "package.json and dependencies",
        explain:
          "package.json describes your project: its name and version, the scripts you run with npm run, and its dependencies. dependencies are needed to run the app; devDependencies only to build and test it. Versions are written as ranges: ^1.4.2 means \"1.4.2 or any later 1.x\", accepting new features and fixes but not a new major version, which might break things.",
        codeExercise: {
          language: JS,
          code: 'const pkg = JSON.parse(`{\n  "name": "task-manager",\n  "version": "1.2.0",\n  "type": "module",\n  "scripts": { "dev": "vite", "build": "vite build", "test": "vitest" },\n  "dependencies": { "date-fns": "^4.1.0" },\n  "devDependencies": { "vite": "^7.1.0", "vitest": "^3.2.4", "eslint": "^9.30.0" }\n}`);\n\nconsole.log(Object.keys(pkg.scripts).join(", "));\nconsole.log(Object.keys(pkg.dependencies).length, Object.keys(pkg.devDependencies).length);\nconsole.log(pkg.scripts.build);\n\nfunction caretAllows(range, version) {\n  const [maj] = range.slice(1).split(".").map(Number);\n  const [vMaj] = version.split(".").map(Number);\n  return vMaj === maj;\n}\nconsole.log(caretAllows("^4.1.0", "4.9.3"), caretAllows("^4.1.0", "5.0.0"));\n',
          question: "This reads a package.json as data, then checks a simplified version of the caret rule. What is printed?",
          expectedOutput: "dev, build, test\n1 3\nvite build\ntrue false",
          hint: "There is one dependency and three devDependencies. A caret range accepts any version with the same major number (the first number).",
          successMessage:
            "package.json is just JSON, so everything from Week 11 applies. And the caret rule is the reason a fresh npm install picks up bug fixes automatically but not breaking changes. (The real rule also refuses versions below the one given, and treats 0.x specially.)",
        },
        why: "There is also package-lock.json, written by npm, recording the exact version of every package actually installed. Commit it: it means everyone, and your deployment, installs precisely the same versions.",
      },
      {
        id: "a-js-vite",
        title: "Vite and modern project setup",
        explain:
          "Vite is a build tool. In development, npm run dev starts a local server that updates the page the instant you save, without a full reload. For release, npm run build bundles your modules, minifies them and writes an optimised site into a dist folder, ready to deploy. npm create vite@latest sets up a new project in a minute.",
        example:
          "> npm create vite@latest task-manager\n    ✔ Select a framework: › Vanilla\n    ✔ Select a variant:   › JavaScript\n> cd task-manager\n> npm install\n> npm run dev\n\n  VITE ready in 300 ms\n  ➜  Local:   http://localhost:5173/\n\ntask-manager/\n  index.html          the page\n  package.json\n  src/\n    main.js           your entry module\n    style.css\n  public/             files copied as they are\n\n> npm run build       → dist/  (what you deploy)",
        why: "This very Academy is built with Vite. You get ES modules, instant updates, and a production build that loads fast on a phone, with almost no configuration.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 14.6 – 14.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l54-code-quality",
    moduleId: "js-w14-tooling",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.6", "14.7"],
    title: "Organisation and Code Quality",
    subtitle: "Modular architecture, linting and formatting",
    estimatedMinutes: 16,
    intro:
      "Code that works is the minimum. Code that a team can read, change and trust is the job. Two habits get you most of the way: organising files by responsibility, and letting tools enforce the boring rules so people can concentrate on the interesting ones.",

    atoms: [
      {
        id: "a-js-architecture",
        title: "Code organisation and modular architecture",
        explain:
          "Organise a project so each module has one responsibility and dependencies point one way. A common shape for a front-end app separates the data layer (models and storage, no DOM), the logic (pure functions you can test), and the UI (DOM or components that call the other two). The UI can depend on the logic; the logic must never depend on the UI.",
        example:
          "src/\n  models/\n    Task.js           class Task: validation, toggle, rename\n    TaskList.js       class TaskList: add, remove, filter\n  services/\n    storage.js        save / load from localStorage, safely\n    api.js            fetch wrappers with status handling\n  logic/\n    filters.js        pure functions: byStatus, bySearch\n  ui/\n    render.js         builds the DOM from a TaskList\n    events.js         the delegated listeners\n  main.js             wires everything together\n\nmodels and logic import nothing from ui.\nSo every test can run in Node, with no browser at all.",
        why: "This is every lesson since Week 6 applied to a whole project: decomposition, small modules, logic kept out of the DOM. When the course moves to React next week, models, services and logic move across unchanged; only ui is rewritten.",
      },
      {
        id: "a-js-architecture-choice",
        title: "Which module does this belong in?",
        explain:
          "Placing code is a design decision. Ask what the code needs to know about: the page, the data, or the network. Put it with that.",
        decision: {
          scenario: "You are writing the function that decides which tasks are \"overdue\": not done, with a due date before today.",
          question: "Where should it live?",
          options: [
            {
              id: "a",
              text: "logic/filters.js, as a pure function isOverdue(task, today) that takes today as a parameter",
              why: "It needs only the task and a date, so it belongs with the pure logic. Passing today in, instead of calling new Date() inside, makes it testable: a test can ask \"is this overdue on 31 October?\" and always get the same answer.",
            },
            {
              id: "b",
              text: "ui/render.js, inside the loop that draws each task",
              whyWrong: "It would only be testable through the DOM, and the next screen that needs the same rule, a reminder badge say, would have to copy it.",
            },
            {
              id: "c",
              text: "services/storage.js, because tasks are stored there",
              whyWrong: "Storage is responsible for saving and loading, not for deciding business rules. Mixing the two makes both harder to change.",
            },
            {
              id: "d",
              text: "main.js, so everything can see it",
              whyWrong: "main.js wires modules together. Rules placed there end up tangled with start-up code and cannot be imported cleanly by tests.",
            },
          ],
          correct: "a",
          aftermath: "Passing \"now\" in as a parameter is a small habit with a big payoff. Any function that reads the clock or random numbers internally is hard to test; one that receives them is easy.",
        },
      },
      {
        id: "a-js-linting",
        title: "Linting",
        explain:
          "A linter reads your code without running it and reports likely mistakes: variables declared and never used, == where === was probably meant, a function called before it exists, unreachable code after a return. ESLint is the standard JavaScript linter, and VS Code shows its warnings as you type.",
        example:
          "> npm init @eslint/config@latest\n> npx eslint src\n\n  src/logic/filters.js\n    4:9   error  'today' is assigned a value but never used   no-unused-vars\n    9:14  error  Expected '===' and instead saw '=='          eqeqeq\n   15:3   error  Unreachable code                              no-unreachable\n\n  ✖ 3 problems",
        codeExercise: {
          language: JS,
          code: 'function lint(source) {\n  const problems = [];\n  source.split("\\n").forEach((line, i) => {\n    if (/[^=!]==[^=]/.test(line)) problems.push(`${i + 1}: use === instead of ==`);\n    if (/\\bvar\\b/.test(line)) problems.push(`${i + 1}: use let or const instead of var`);\n    if (/console\\.log/.test(line)) problems.push(`${i + 1}: remove console.log before committing`);\n  });\n  return problems;\n}\n\nconst code = [\n  "var count = 0;",\n  "if (count == 0) {",\n  "  console.log(\\"empty\\");",\n  "}",\n  "const ok = count === 1;",\n].join("\\n");\n\nlint(code).forEach((p) => console.log(p));\n',
          question: "A toy linter with three rules, run over five lines of code. What does it report?",
          expectedOutput: "1: use let or const instead of var\n2: use === instead of ==\n3: remove console.log before committing",
          hint: "Check each line against each rule in order. Line 5 uses ===, which the first rule deliberately does not match.",
          successMessage:
            "Real linters parse the code properly instead of using regular expressions, and ship hundreds of rules, but the idea is exactly this: read the source, report patterns that are usually bugs.",
        },
      },
      {
        id: "a-js-formatting",
        title: "Formatting and readable code",
        explain:
          "A formatter such as Prettier rewrites your code into one consistent layout: indentation, spacing, quotes, line length. A linter finds probable bugs; a formatter settles style. Run the formatter on save and the whole team's code looks the same, so code reviews discuss what the code does, not where the braces go.",
        example:
          "> npm install --save-dev prettier\n> npx prettier --write src\n\nIn VS Code: install the Prettier extension, then in settings\nturn on  Format On Save  and choose Prettier as the default formatter.\n\nBefore:   if(x){return  a+b}else{ return 0 }\nAfter:    if (x) {\n            return a + b;\n          } else {\n            return 0;\n          }",
        why: "Readable code is not only formatting: it is good names, small functions, early returns, and comments that explain why. The tools handle the mechanical part so your attention goes to those.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 14.8 – 14.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l55-config-security-deploy",
    moduleId: "js-w14-tooling",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.8", "14.9", "14.10"],
    title: "Configuration, Security and Deployment",
    subtitle: "Getting it onto the internet, safely",
    estimatedMinutes: 19,
    intro:
      "The last step of every project, and the one beginners most often skip: putting it on the internet where anyone can use it. Before that, two things that decide whether it is safe to: how configuration and secrets are handled, and a short list of security habits.",

    atoms: [
      {
        id: "a-js-env-config",
        title: "Environment configuration and secrets",
        explain:
          "Configuration that differs between your laptop and production, such as an API address or a feature switch, belongs in environment variables, not in the code. Vite reads .env files and exposes variables starting with VITE_ to your front-end code as import.meta.env.VITE_NAME. Remember Week 12: anything exposed to the front end is public. Secrets belong only on a server.",
        example:
          ".env.development          (local; values for your laptop)\n  VITE_API_URL=http://localhost:3000\n\n.env.production           (used by  npm run build)\n  VITE_API_URL=https://api.mytasks.app\n\nsrc/services/api.js\n  const API = import.meta.env.VITE_API_URL;\n  export const getTasks = () => fetch(`${API}/tasks`);\n\n.gitignore\n  node_modules\n  dist\n  .env*.local\n\nCommit an  .env.example  listing the variable NAMES with no real values,\nso teammates know what to set.",
        codeExercise: {
          language: JS,
          code: 'function resolveConfig(env) {\n  const config = {\n    apiUrl: env.VITE_API_URL ?? "http://localhost:3000",\n    pageSize: Number(env.VITE_PAGE_SIZE ?? 20),\n    debug: env.VITE_DEBUG === "true",\n  };\n  if (!Number.isInteger(config.pageSize) || config.pageSize < 1) {\n    throw new Error(`VITE_PAGE_SIZE must be a positive whole number, got "${env.VITE_PAGE_SIZE}"`);\n  }\n  return config;\n}\n\nconsole.log(resolveConfig({}));\nconsole.log(resolveConfig({ VITE_API_URL: "https://api.mytasks.app", VITE_DEBUG: "false", VITE_PAGE_SIZE: "50" }));\ntry {\n  resolveConfig({ VITE_PAGE_SIZE: "lots" });\n} catch (err) {\n  console.log(err.message);\n}\n',
          question: "Environment variables always arrive as strings, or are missing. This function turns them into typed configuration with defaults. What is printed?",
          expectedOutput: "{ apiUrl: 'http://localhost:3000', pageSize: 20, debug: false }\n{ apiUrl: 'https://api.mytasks.app', pageSize: 50, debug: false }\nVITE_PAGE_SIZE must be a positive whole number, got \"lots\"",
          hint: "?? uses the default only when the value is missing. The string \"false\" is not equal to \"true\", so debug is false. Number(\"lots\") is NaN, which is not an integer.",
          successMessage:
            "Configuration is input like any other: missing values get defaults, strings are converted, and nonsense fails loudly at start-up instead of misbehaving later. Note that the string \"false\" is truthy, which is why debug compares with === \"true\".",
        },
      },
      {
        id: "a-js-security-practices",
        title: "Basic security practices",
        explain:
          "Most real breaches come from a short list of basic mistakes, not clever attacks. Every one of them has appeared somewhere in this course, and together they make a checklist to run before anything goes live.",
        table: {
          caption: "A front-end security checklist.",
          headers: ["Practice", "Why", "Where you met it"],
          rows: [
            ["User and API data rendered with textContent, never raw innerHTML", "Prevents cross-site scripting", "Week 10"],
            ["Validate input in the browser, and again on the server", "Browser checks can be bypassed", "Week 11"],
            ["No secret keys in front-end code or in Git", "Everything shipped to the browser is public", "Week 12"],
            ["Serve over HTTPS only", "Stops traffic being read or altered in transit", "Hosting does it for you"],
            ["Keep dependencies updated; run npm audit", "Known vulnerabilities in packages are actively exploited", "This lesson"],
            ["Install only well-known, maintained packages", "Malicious look-alike packages exist", "This lesson"],
          ],
        },
        example:
          "> npm audit\n\n  # npm audit report\n  some-package  <2.3.1\n  Severity: high\n  Prototype pollution - fix available via `npm audit fix`\n\n> npm audit fix\n\nAnd before installing anything, check it on npmjs.com:\nweekly downloads, last publish date, the repository link,\nand the exact spelling of the name.",
        why: "A package is code written by a stranger that runs with your app's full permissions. Reading its download count and its spelling before installing takes thirty seconds and protects you from the typo-squatted packages that attackers publish under names one letter away from popular ones.",
      },
      {
        id: "a-js-deployment",
        title: "Deployment",
        explain:
          "Deploying a Vite site means building it and putting the dist folder on a host. Services like Vercel and Netlify connect to your GitHub repository, run npm run build on their own servers, and publish the result at a public HTTPS address. Every push to main then deploys automatically.",
        example:
          "Deploying to Vercel (Netlify is almost identical):\n\n  1. Push the project to GitHub.\n  2. Sign in at vercel.com with GitHub and choose \"Add New Project\".\n  3. Pick the repository. Vercel detects Vite:\n       Build command      npm run build\n       Output directory   dist\n  4. Add any VITE_ environment variables under Settings → Environment Variables.\n  5. Deploy. A minute later the site is live at\n       https://task-manager-yourname.vercel.app\n\nFrom now on:  git push  →  automatic build  →  live in about a minute.\nEvery branch and pull request also gets its own preview address.",
        why: "A deployed project is worth far more in a portfolio than a folder on your laptop: an employer can click it. The capstone requires a live URL for exactly that reason.",
      },
      {
        id: "a-js-troubleshooting",
        title: "Troubleshooting a deployment",
        explain:
          "Deployments fail for a small set of reasons, and the build log on the host almost always says which. Read the log from the first error, not the last line, exactly as you read a stack trace.",
        decision: {
          scenario:
            "Your app works perfectly with npm run dev. On Vercel the build succeeds and the home page loads, but refreshing on /tasks/42 shows a 404 page, and the API calls go to http://localhost:3000.",
          question: "What are the two most likely causes?",
          options: [
            {
              id: "a",
              text: "The host is not configured to send every route to index.html for client-side routing, and VITE_API_URL was not set in the host's environment variables",
              why: "A single-page app has only one real file, index.html; /tasks/42 exists only in your JavaScript, so the host needs a rewrite rule. And the localhost address is the default your config falls back to when the variable is missing, which means production never received it.",
            },
            {
              id: "b",
              text: "Vercel does not support JavaScript",
              whyWrong: "The home page loads and runs, so JavaScript is clearly working. The failures are about routing and configuration.",
            },
            {
              id: "c",
              text: "The code has a syntax error",
              whyWrong: "The build succeeded and the home page runs, which a syntax error would prevent.",
            },
            {
              id: "d",
              text: "The user's browser is out of date",
              whyWrong: "Both symptoms happen for everyone, and both are explained by the deployment's configuration.",
            },
          ],
          correct: "a",
          aftermath: "The two classic deployment bugs: \"works locally\" because your laptop has a .env file the server does not, and \"404 on refresh\" because a single-page app needs every route rewritten to index.html.",
        },
      },
    ],

    task: {
      title: "Project: ship the to-do app professionally",
      intro: "Move your Week 11 to-do application into a real project, under version control, and put it on the internet.",
      prompts: [
        "Create a Vite project and move the code into modules organised as models, services, logic and ui. models and logic must import nothing from ui.",
        "Initialise Git with a .gitignore that excludes node_modules, dist and any .env.local file. Commit in small steps with clear messages, and build at least one feature on a branch merged into main.",
        "Add ESLint and Prettier, fix every lint error, and set Format On Save. Add a test script that runs your logic tests.",
        "Move one setting, such as the page size or the storage key, into a VITE_ environment variable, with a default and validation. Commit an .env.example.",
        "Push to GitHub and deploy to Vercel or Netlify. Run npm audit. Put the live URL and a short description at the top of a README.md.",
      ],
      closing:
        "From now on, every project you build should end with a URL. Next week you rebuild this app in React, and its logic and models move across unchanged, which is the payoff of this week's structure.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
