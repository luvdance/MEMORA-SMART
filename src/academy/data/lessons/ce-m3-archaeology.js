/**
 * CODEBASE ENGINEERING · MODULE 3 · PROJECT ARCHAEOLOGY
 *
 * Curriculum 3.1 – 3.9 and the practical, 3.P. Root directories and common
 * layouts; manifests; standard folders; entry points, routes, controllers,
 * components and services; imports, exports and dependency relationships;
 * source versus generated and third-party; configuration files; inventories,
 * dependency maps, and the files a feature needs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, shown } from "./ce-helpers.js";

export const SECTION_ID = "ce-s3-archaeology";
const MODULE = "ce-m3-archaeology";

const FIND_DIRS = 'find . -maxdepth 2 -type d -not -path "./node_modules*" -not -path "./.git*" | sort';
const LARGEST = "git ls-files server src tests | xargs wc -l | sort -n | tail -n 6";
const BY_FOLDER = "git ls-files -- '*.js' '*.jsx' | sed 's|/[^/]*$||' | sort | uniq -c";
const CONFIG_FILES = 'git ls-files | rg "config|\\.env|ignore"';
const CART_HISTORY = "git log --oneline -- src/pages/Cart.jsx server/routes/orders.js server/services/orderService.js";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 3.1 – 3.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l13-layout",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2"],
    title: "The Root, Common Layouts and the Manifest",
    subtitle: "Where a project begins, how projects are usually arranged, and the file that describes them",
    estimatedMinutes: 26,
    intro:
      "Archaeologists do not dig at random: they survey the site first. Project archaeology starts the same way: find the edges of the project, recognise its shape, and read the label on the box.",

    atoms: [
      {
        id: "a-ce-root-dir",
        title: "Finding the root",
        explain:
          "The root directory is the top folder of a project: where the manifest (package.json), the README, .gitignore and the .git folder live, and where most commands expect to be run. In a big repository, or after cd-ing deep into it, you can lose track of where the root is. Git always knows: git rev-parse --show-toplevel prints it from anywhere inside the repository.",
        terminalExercise: term("m3-layout", {
          goal: "Ask Git for the root folder of this repository.",
          accept: ["git rev-parse --show-toplevel"],
          near: [{ command: "ls", why: "ls shows what is here, which may or may not be the root. Git knows for certain." }],
          hint: "git rev-parse with --show-toplevel.",
          success: "C:/Users/ada/kobo-market. Git prints a Windows-style path even in Git Bash; it is the same folder as /c/Users/ada/kobo-market.",
        }),
      },
      {
        id: "a-ce-layouts",
        title: "Seeing the shape: folders, two levels deep",
        explain:
          "The fastest picture of a project is its folder tree, two levels deep, without the noise of node_modules and .git. The tree command draws one, but it is not installed everywhere (including Git Bash on Windows), so know the find equivalent that works on every machine.",
        terminalExercise: term("m3-layout", {
          goal: "Show the project's folder structure two levels deep, without node_modules and .git. (tree is not installed here.)",
          accept: [FIND_DIRS],
          near: [{ command: "tree", why: "Not installed in Git Bash, as the error says. find can do the same: folders only (-type d), two levels (-maxdepth 2), excluding the noise." }],
          hint: "find . with -maxdepth 2 and -type d, excluding ./node_modules* and ./.git*, then sort.",
          success: "data, server (with db, middleware, payments, routes, services), src (with api, components, hooks, pages, utils) and tests. You can already guess what most folders hold.",
        }),
      },
      {
        id: "a-ce-common-layouts",
        title: "Recognising common project layouts",
        explain:
          "Most projects follow one of a few shapes, and recognising the shape tells you where to look. A frontend app (Vite, Create React App, Next.js) has src/ and public/. A backend service has a server or app folder with routes or controllers. A full-stack app like Kobo Market has both side by side. A monorepo holds several projects, often under apps/ and packages/, each with its own manifest. Frameworks impose their own: Django has manage.py and one folder per app; Rails has app/models, app/views, app/controllers; Next.js uses the folder names under app/ as URLs.",
        table: {
          caption: "Clues to a project's shape.",
          headers: ["You see", "It is probably", "Look first at"],
          rows: [
            ["src/, public/, index.html, vite.config.js", "A frontend app", "src/main.* and src/App.*"],
            ["server/ or app/ with routes or controllers", "A backend API", "The file that calls listen()"],
            ["apps/ and packages/, several package.json files", "A monorepo", "The root manifest's workspaces"],
            ["manage.py, settings.py", "A Django project", "urls.py"],
            ["pom.xml, src/main/java", "A Java (Maven) project", "The class with main() or @SpringBootApplication"],
          ],
        },
        decision: {
          scenario: "You clone a repository and find apps/web, apps/api, packages/ui and a root package.json with a \"workspaces\" field.",
          question: "What kind of project is it, and where do you start?",
          options: [
            { id: "a", text: "A monorepo: read the root manifest's workspaces, then treat each app as its own project with its own manifest and entry point", why: "Workspaces mean several packages share one repository. Each app has its own scripts and dependencies." },
            { id: "b", text: "A single frontend app: open apps/web and ignore the rest", whyWrong: "apps/api is a backend, and packages/ui is shared code both may use." },
            { id: "c", text: "A broken clone, because projects have one package.json", whyWrong: "Several manifests are normal in a monorepo." },
            { id: "d", text: "A Django project", whyWrong: "Nothing here is Python." },
          ],
          correct: "a",
          aftermath: "In a monorepo, run commands from the right folder, or use the workspace flags your package manager provides.",
        },
      },
      {
        id: "a-ce-manifests",
        title: "Reading the manifest",
        explain:
          "A manifest is the file that declares a project: its name, its dependencies and the commands to run it. Every ecosystem has one, and it is the single most informative file in a project. For Node it is package.json; npm pkg get FIELD prints one part of it, which is handy on a big manifest.",
        table: {
          caption: "Manifests by ecosystem.",
          headers: ["Ecosystem", "Manifest", "Lockfile"],
          rows: [
            ["JavaScript / Node", "package.json", "package-lock.json, yarn.lock, pnpm-lock.yaml"],
            ["Python", "pyproject.toml (or requirements.txt)", "poetry.lock, uv.lock"],
            ["Java", "pom.xml (Maven), build.gradle (Gradle)", "(versions pinned in the manifest)"],
            ["PHP", "composer.json", "composer.lock"],
            ["Go", "go.mod", "go.sum"],
            ["Rust", "Cargo.toml", "Cargo.lock"],
          ],
        },
        terminalExercise: term("m3-manifest", {
          goal: "Print only the scripts section of the manifest: the commands this project expects you to run.",
          accept: ["npm pkg get scripts"],
          near: [{ command: "npm pkg get dependencies", why: "That prints the runtime dependencies. The commands are under scripts." }],
          hint: "npm pkg get, followed by the section's name.",
          success: "Seven scripts, the same lifecycle you saw with npm run, printed as data you could feed to another tool.",
        }),
      },
      {
        id: "a-ce-manifest-engines",
        title: "What the manifest does not say",
        explain:
          "A manifest can also declare which version of the runtime the project needs: \"engines\": { \"node\": \">=22\" } in package.json, requires-python in pyproject.toml. When that is missing, the project silently assumes whatever versions its authors happened to have, which is a common cause of \"works for me\" failures. Absences in a manifest are findings too.",
        terminalExercise: term("m3-manifest", {
          goal: "Does the project declare which Node.js version it needs?",
          accept: ["npm pkg get engines"],
          near: [{ command: "npm pkg get devDependencies", why: "Those are tools the project installs. The runtime version requirement is declared in engines." }],
          hint: "The field is called engines.",
          success: "{}: nothing is declared. Yet the start script uses --env-file-if-exists, which older Node versions do not have. Add it to your report's open questions; Module 9 shows what happens when a server runs a different version.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 3.3 – 3.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l14-folders",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.3", "3.4"],
    title: "Standard Folders, Entry Points, Routes, Controllers, Components and Services",
    subtitle: "The conventional names, and finding where the application starts",
    estimatedMinutes: 26,
    intro:
      "Developers reuse the same folder names everywhere, so learning them once pays off in every project. And every application has a first file: find it and you can follow everything else from there.",

    atoms: [
      {
        id: "a-ce-standard-dirs",
        title: "The conventional folders",
        explain:
          "src/ holds source code. public/ (or static/) holds files served exactly as they are: favicon, robots.txt, images. tests/ (or __tests__, spec/) holds automated tests. assets/ holds images, fonts and similar used by the source. config/ holds configuration. scripts/ holds helper scripts for developers (seeding, releases). dist/, build/ or out/ hold generated output. Not every project has every folder, and some put tests beside the code they test (Cart.test.jsx next to Cart.jsx).",
        table: {
          caption: "Standard folders.",
          headers: ["Folder", "Holds", "Edit it?"],
          rows: [
            ["src/", "Source code", "Yes"],
            ["public/", "Files served as-is (favicon, robots.txt)", "Yes"],
            ["tests/", "Automated tests", "Yes"],
            ["assets/", "Images, fonts used by the source", "Yes"],
            ["config/", "Configuration", "Carefully"],
            ["scripts/", "Developer helper scripts", "Yes"],
            ["dist/, build/", "Generated output", "Never: regenerate it"],
          ],
        },
        decision: {
          scenario: "You need to change the site's favicon. A search finds favicon files in public/ and in dist/.",
          question: "Which do you change?",
          options: [
            { id: "a", text: "public/favicon: dist/ is rebuilt from public/ and src/ on every build", why: "Edits to dist/ disappear on the next build. Change the source, then rebuild." },
            { id: "b", text: "dist/favicon, because that is what the browser loads", whyWrong: "It is, until the next build overwrites it." },
            { id: "c", text: "Both, to be safe", whyWrong: "Editing generated output is never safe: it hides the real change." },
            { id: "d", text: "Neither: favicons cannot be changed", whyWrong: "They can, in public/." },
          ],
          correct: "a",
          aftermath: "Change the source, regenerate the output.",
        },
      },
      {
        id: "a-ce-html-entry",
        title: "Where a browser app starts",
        explain:
          "A browser app starts from an HTML page. In a Vite project that is index.html at the root, which loads one script with type=\"module\". That script is the JavaScript entry point. Other frameworks hide this (Next.js generates the HTML), but there is always a first script.",
        terminalExercise: term("m3-entry", {
          goal: "Find which script the browser loads first.",
          accept: ["cat index.html"],
          near: [{ command: "cat src/main.jsx", why: "That IS the entry script, but how do you know? index.html is where the browser is told to load it." }],
          hint: "The browser starts with the HTML page at the root.",
          success: "<script type=\"module\" src=\"/src/main.jsx\">: the whole browser app grows from src/main.jsx.",
        }),
      },
      {
        id: "a-ce-entry-points",
        title: "From the entry point to the first component",
        explain:
          "The entry point's job is usually small: set things up and hand over. A React entry point finds an element in the page (id=\"root\") and renders the top component into it, typically App. A server entry point loads configuration, creates the server and starts listening. Reading the entry point tells you what the application's top-level pieces are.",
        terminalExercise: term("m3-entry", {
          goal: "Find which React component the browser app renders first.",
          accept: ["cat src/main.jsx"],
          near: [{ command: "cat index.html", why: "That shows the page loads src/main.jsx. Now read main.jsx to see what it renders." }],
          hint: "Read the entry script.",
          success: "It renders <App /> into #root, inside StrictMode, and loads the global styles. Everything on screen comes from src/App.jsx.",
        }),
      },
      {
        id: "a-ce-mvc-words",
        title: "Routes, controllers, services and components",
        explain:
          "Inside an application, code is usually split by job. Routes map a URL to a handler. Controllers (called handlers, or routes again, in smaller apps) read the request and send the response. Services hold the business logic (prices, rules, authentication) independent of HTTP. Components are pieces of interface. Models or repositories talk to the database. Kobo Market uses these names loosely: server/routes/*.js are its controllers, server/services/*.js its services, server/db its repository.",
        decision: {
          scenario: "The business wants free delivery to start at ₦40,000 instead of ₦50,000.",
          question: "In a well-organised backend, where should that change be made?",
          options: [
            { id: "a", text: "In the service that holds the rule (server/services/orderService.js), not in the route or the component", why: "Business rules belong in services, so every route and test that uses the rule gets the change from one place." },
            { id: "b", text: "In server/router.js", whyWrong: "The router maps URLs to handlers; it holds no prices." },
            { id: "c", text: "In the CSS", whyWrong: "Styling has nothing to do with the rule." },
            { id: "d", text: "In every file that shows a price", whyWrong: "That multiplies the rule, which is how the cart and server disagreed in the first place." },
          ],
          correct: "a",
          aftermath: "Knowing which layer owns a rule tells you where to change it, and where NOT to.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 3.5 – 3.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l15-modules",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.5", "3.6"],
    title: "Imports, Exports and Dependencies; Source, Generated and Third-Party",
    subtitle: "Following the wires between files, and knowing which files are not yours",
    estimatedMinutes: 30,
    intro:
      "Every file in a project is connected to others by imports. Following those connections in both directions answers two of the most useful questions in software: what does this file need, and what breaks if I change it?",

    atoms: [
      {
        id: "a-ce-imports",
        title: "What a file depends on",
        explain:
          "An import line says \"this file uses something from that file\": import { orderTotals } from \"../services/orderService.js\". An export is the other side: export function orderTotals(...). Paths starting with ./ or ../ are the project's own modules; bare names (react, node:http) are packages or built-ins. Reading a file's imports lists everything it depends on before you read a line of its logic.",
        terminalExercise: term("m3-imports", {
          goal: "List everything the orders route depends on.",
          accept: ['rg -n "^import" server/routes/orders.js'],
          near: [{ command: 'rg -n "^import" src/App.jsx', why: "That is the app's top component. The question is about server/routes/orders.js." }],
          hint: "Search the file for lines that start with import (^ means start of line).",
          success: "Four imports: the HTTP helpers, the data module, the order service and the Paystack integration. Creating an order touches the data, the business rules and an external service.",
        }),
      },
      {
        id: "a-ce-dependents",
        title: "What depends on a file",
        explain:
          "The reverse question is what depends on this file: its dependents. It decides the blast radius of a change. If four modules import the data layer, changing one of its functions can break all four. Search for the file's import path to find them.",
        terminalExercise: term("m3-imports", {
          goal: "Before changing the data module (server/db/index.js), find every server file that imports it.",
          accept: ['rg -l "db/index.js" server'],
          near: [{ command: 'rg -n "^import" server/routes/orders.js', why: "That lists what one file imports. Search everywhere for the data module's path instead." }],
          hint: "rg -l, the path db/index.js, in server.",
          success: "Four dependents: the auth middleware, the auth service, and the product and order routes. A change to the data module must be checked against all four.",
        }),
      },
      {
        id: "a-ce-import-styles",
        title: "Search for how imports are really written",
        explain:
          "A reference search only finds what you search for. Files import each other by relative paths that vary with where the importer sits: the API client is imported as \"./client.js\" from inside src/api, and would be \"../api/client.js\" from src/pages. A search for one spelling can miss the others. When a reference search finds nothing, check how the import is spelled before concluding nothing uses it.",
        terminalExercise: term("m3-imports", {
          goal: "Find which files import the API client, src/api/client.js. (The client's neighbours import it as ./client.js.)",
          accept: ['rg -l -F "./client.js" src'],
          near: [{ command: 'rg -l "db/index.js" server', why: "That finds users of the data module. Search src for ./client.js; -F means \"fixed string\", so the dot is literal." }],
          hint: "rg -l -F with the exact text ./client.js, in src.",
          success: "All three API modules (auth, orders, products) go through the client, so every request the frontend makes passes through one function, a good place for shared error handling.",
        }),
      },
      {
        id: "a-ce-generated-check",
        title: "Proving a file is generated",
        explain:
          "When you meet an unfamiliar file, ask whether it is source or output before reading it. Git can tell you whether a path is ignored, and by which rule: git check-ignore -v PATH prints the .gitignore line that matches. An ignored file in a build folder is generated; an ignored file in node_modules is third-party.",
        terminalExercise: term("m3-generated", {
          goal: "Confirm that dist/index.html is generated output, and find the rule that says so.",
          accept: ["git check-ignore -v dist/index.html"],
          near: [{ command: "ls dist/assets", why: "That shows what is in dist, not how the project treats it. git check-ignore names the rule." }],
          hint: "git check-ignore -v, then the path.",
          success: ".gitignore line 2, dist/. Built output, never committed, never edited.",
        }),
      },
      {
        id: "a-ce-third-party",
        title: "Third-party packages and their versions",
        explain:
          "Third-party code lives in node_modules (Python: a virtual environment's site-packages; Java: the local Maven repository). You use it, you do not edit it: an edit there is lost on the next install. npm ls --depth=0 lists the packages the project installed directly, with the exact versions present, which may differ from the ranges in package.json.",
        terminalExercise: term("m3-generated", {
          goal: "List the packages this project installed directly, with the exact versions installed.",
          accept: ["npm ls --depth=0"],
          near: [{ command: "du -sh node_modules", why: "That gives the size (57 MB), not what is in it. npm ls lists the packages." }],
          hint: "npm ls, top level only.",
          success: "Eight direct packages, e.g. react@18.3.1 and vite@8.3.4. Their own dependencies bring node_modules to 119 folders and 57 MB.",
        }),
      },
      {
        id: "a-ce-minified",
        title: "Generated code is not for reading",
        explain:
          "Build output is optimised for machines: minified (short names, no spaces), bundled (many files in one) and hashed (index-BM0RsIO3.js, so browsers re-download it when it changes). You can read it when you must, to check what was shipped, but you never fix bugs in it. Browsers use source maps to show you the original source in DevTools instead.",
        example: shown("m3-generated", "head -c 160 dist/assets/*.js"),
        decision: {
          scenario: "A colleague found a bug and fixed it by editing dist/assets/index-BM0RsIO3.js directly on the server. The site works now.",
          question: "What will happen, and what should be done?",
          options: [
            { id: "a", text: "The next build and deploy will overwrite the fix; the bug must be fixed in src/, committed and rebuilt", why: "dist is regenerated from src on every build, so the source still has the bug." },
            { id: "b", text: "Nothing: the fix is permanent", whyWrong: "It lasts until the next deploy." },
            { id: "c", text: "Copy the edited file into src/", whyWrong: "Minified output is not source; it would be unreadable and still be overwritten." },
            { id: "d", text: "Add dist/ to Git so the fix is kept", whyWrong: "That commits generated code and still leaves the source wrong." },
          ],
          correct: "a",
          aftermath: "Fix the source; let the tools regenerate everything else.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l16-config",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.7"],
    title: "Configuration Files",
    subtitle: ".gitignore, .env.example, vite.config.js, eslint.config.js, tsconfig.json and their cousins",
    estimatedMinutes: 24,
    intro:
      "Configuration files change how the tools treat the code, so a one-line change in one of them can change the behaviour of the whole project. Know which ones a project has, and what each controls.",

    atoms: [
      {
        id: "a-ce-config-inventory",
        title: "Which configuration files does it have?",
        explain:
          "Configuration files sit mostly at the root, often with config, rc or a dot in their names: .gitignore, .env.example, vite.config.js, eslint.config.js, tsconfig.json, .prettierrc, Dockerfile, .github/workflows/*.yml. Listing them first tells you which tools the project uses before you read any code.",
        table: {
          caption: "Common configuration files.",
          headers: ["File", "Controls"],
          rows: [
            [".gitignore", "What Git never tracks"],
            [".env.example", "Which environment variables are needed (with placeholder values)"],
            ["vite.config.js", "The dev server, proxy and production build"],
            ["eslint.config.js", "Which code-quality rules apply to which files"],
            ["tsconfig.json", "How TypeScript checks and compiles the code"],
            [".prettierrc", "Code formatting"],
            ["Dockerfile", "How a container image is built"],
            [".github/workflows/*.yml", "Automated checks on every push (CI)"],
          ],
        },
        terminalExercise: term("m3-config", {
          goal: "List every tracked file whose name suggests configuration (config, .env or ignore).",
          accept: [CONFIG_FILES],
          near: [{ command: "cat .gitignore", why: "That reads one configuration file. List them all first, by filtering git ls-files." }],
          hint: "Pipe git ls-files into rg with a pattern that matches config, .env or ignore.",
          success: "Five: .env.example, .gitignore, eslint.config.js, server/config.js and vite.config.js. Note server/config.js: application configuration lives in code too.",
        }),
      },
      {
        id: "a-ce-eslint-config",
        title: "Reading a tool's configuration",
        explain:
          "A configuration file is a set of decisions. ESLint's says which files are checked as browser code and which as Node code, and which rules apply. When a rule seems to behave strangely, or an AI suggests turning one off, this is the file to read, and changes to it deserve as much review as changes to the code.",
        terminalExercise: term("m3-config", {
          goal: "Find out which files ESLint treats as browser code and which as Node code.",
          accept: ["cat eslint.config.js"],
          near: [{ command: "cat vite.config.js", why: "That configures Vite. Lint rules are in eslint.config.js." }],
          hint: "The file is eslint.config.js.",
          success: "src/** is browser code; server, tests and *.config.js files are Node. It also customises one rule, no-unused-vars, with a comment explaining why. Remember that rule: in Module 5 an AI quietly turns it off.",
        }),
      },
      {
        id: "a-ce-tsconfig",
        title: "Absence is information: tsconfig.json",
        explain:
          "tsconfig.json configures TypeScript: which files it checks, how strictly, and what JavaScript it produces. Its presence tells you the project is written in TypeScript (or type-checks JavaScript), which means the compiler catches many mistakes before the code runs. Its absence tells you this project relies on tests and lint alone for that.",
        terminalExercise: term("m3-config", {
          goal: "Is this a TypeScript project? Check for its configuration file.",
          accept: ["ls tsconfig.json"],
          near: [{ command: "cat eslint.config.js", why: "That is lint configuration. TypeScript's is tsconfig.json; check whether it exists." }],
          hint: "ls the file by name.",
          success: "No such file: Kobo Market is plain JavaScript. Type errors (passing a string where a number is expected) will only show up when the code runs, or in tests.",
        }),
      },
      {
        id: "a-ce-env-example",
        title: ".env.example versus .env",
        explain:
          ".env holds the real settings and secrets for one machine and is never committed. .env.example is committed: it lists every variable the project needs with safe placeholder values and comments, so a new developer (or a deployment) knows what to provide. When they disagree, .env.example is the documentation and .env is the truth for one machine.",
        decision: {
          scenario: "A developer adds a new required variable, PAYSTACK_PUBLIC_KEY, to their own .env and to the code, and commits the code. The next morning the API fails on every other developer's machine.",
          question: "What was missed?",
          options: [
            { id: "a", text: "Adding PAYSTACK_PUBLIC_KEY (with a placeholder) to .env.example, and telling the team", why: "Nobody else's .env has it, and .env.example, the only shared record of required variables, was not updated." },
            { id: "b", text: "Committing their .env", whyWrong: "Never: .env holds secrets. The example file is how variables are shared." },
            { id: "c", text: "Nothing: other developers should guess", whyWrong: "That is exactly the failure." },
            { id: "d", text: "Deleting .env.example", whyWrong: "It is the documentation that would have prevented this." },
          ],
          correct: "a",
          aftermath: "Every new variable: add it to the code, to .env.example, and to the deployment's settings.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 3.8 – 3.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l17-inventory",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.8", "3.9"],
    title: "Inventories, Dependency Maps and the Files a Feature Needs",
    subtitle: "Measuring a project, drawing its connections, and narrowing to what matters",
    estimatedMinutes: 30,
    intro:
      "An inventory tells you what is there and where the weight is. A dependency map tells you how it connects. Together they let you answer the question you actually came with: which files matter for this feature?",

    atoms: [
      {
        id: "a-ce-inventory",
        title: "Where the code is concentrated",
        explain:
          "A project inventory lists the source files with their sizes, grouped by folder. Combining git ls-files (only tracked source), xargs (to pass the list to wc) and sort shows the largest files: the ones most likely to hold complexity, bugs and the logic you need.",
        terminalExercise: term("m3-inventory", {
          goal: "Find the largest tracked source files in server, src and tests, by line count.",
          accept: [LARGEST],
          near: [{ command: "git ls-files | wc -l", why: "That counts the files (39). Pass them to wc -l and sort by size to find the largest." }],
          hint: "git ls-files server src tests | xargs wc -l | sort -n | tail -n 6",
          success: "styles.css (55 lines) leads, then authService.js (45), Login.jsx (44), Cart.jsx (42) and db/index.js (40), of 662 lines in all. Of the code files, the biggest is authentication: a small project you could read in full, but now you know where to read first.",
        }),
      },
      {
        id: "a-ce-folder-counts",
        title: "Files per folder",
        explain:
          "Counting files by folder shows how the code is organised and where it is growing. A folder with many files may need splitting; a folder with one file may be a layer that is just beginning. The pipeline strips each path's file name (sed), then counts identical folders (sort | uniq -c).",
        terminalExercise: term("m3-inventory", {
          goal: "Count the JavaScript files in each folder.",
          accept: [BY_FOLDER],
          near: [{ command: LARGEST, why: "That ranks files by size. Strip the file names and count by folder instead." }],
          hint: "git ls-files for *.js and *.jsx, sed to remove the file name, sort, uniq -c.",
          success: "src/api 4, server 4, server/routes 3, src/pages 3, tests 3, and so on. (The two root files, eslint.config.js and vite.config.js, appear under their own names because they have no folder to strip.) Evenly spread: no folder has become a dumping ground yet.",
        }),
      },
      {
        id: "a-ce-dep-map",
        title: "Drawing a dependency map",
        explain:
          "A dependency map is a diagram of which modules import which. You build it from the import lines you have been searching: draw one box per module and an arrow from each importer to what it imports. Arrows should mostly point one way, from the outside in: routes → services → data. An arrow pointing back (the data layer importing a route) is a warning sign.",
        example:
          "Kobo Market API, drawn from its import lines:\n\n  server/index.js\n        │\n        ▼\n  server/router.js ──► middleware/requireAuth.js ──┐\n        │                                           │\n        ▼                                           ▼\n  routes/auth.js ─────► services/authService.js ──► db/index.js ──► data/kobo.json\n  routes/products.js ───────────────────────────────►    ▲\n  routes/orders.js ───► services/orderService.js         │\n        │      └──────────────────────────────────────────┘\n        ▼\n  payments/paystack.js ──► api.paystack.co",
        decision: {
          scenario: "A new change makes server/db/index.js import a function from server/routes/orders.js.",
          question: "Why should a reviewer question this?",
          options: [
            { id: "a", text: "It reverses the direction of the map: the data layer now depends on a route, creating a cycle (orders imports db, db imports orders)", why: "Lower layers should not know about higher ones. Cycles make modules impossible to change or test on their own." },
            { id: "b", text: "Imports make files slower", whyWrong: "The cost is in structure, not speed." },
            { id: "c", text: "It is fine; any file may import any other", whyWrong: "Possible, but it tangles the layers the map makes visible." },
            { id: "d", text: "Routes cannot export functions", whyWrong: "They can; the problem is who imports them." },
          ],
          correct: "a",
          aftermath: "Module 8 returns to layers and coupling.",
        },
      },
      {
        id: "a-ce-feature-files",
        title: "Which files matter for a feature?",
        explain:
          "To work on a feature you rarely need the whole project, only the files on its path. Find them with a broad, case-insensitive search for the feature's vocabulary (cart, basket, order, checkout), then narrow by following imports from the files that clearly belong.",
        terminalExercise: term("m3-feature", {
          goal: "Find every file in src, server and tests that mentions the cart, in any capitalisation.",
          accept: ["rg -il cart src server tests"],
          near: [{ command: "rg -n orderTotals", why: "That follows one function. Start broader: every file mentioning cart, case-insensitive (-i)." }],
          hint: "rg with -i (ignore case) and -l (file names only).",
          success: "Five files: Cart.jsx, App.jsx, Navbar.jsx, ProductCard.jsx and server/routes/orders.js. Following orders.js's imports adds orderService.js, which uses the word \"order\" rather than \"cart\". Vocabulary changes across a feature; search for more than one word.",
        }),
      },
      {
        id: "a-ce-feature-history",
        title: "A feature's history narrows it further",
        explain:
          "Git can show the history of just the files on a feature's path. The commits that touched them tell you when the feature was built, who built it, and which later changes affected it, often the fastest route to why it behaves as it does.",
        terminalExercise: term("m3-feature", {
          goal: "List the commits that changed the cart page, the order route or the order service.",
          accept: [CART_HISTORY],
          near: [{ command: "rg -il cart src server tests", why: "That finds the files. Now give those files to git log, after --, to see their history." }],
          hint: "git log --oneline -- then the three file paths.",
          success: "Four commits, newest first. The most recent, 68cb4b8 \"Free delivery on orders over ₦50,000\", changed the server's rule. Did it change the cart page too? Module 4 finds out.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l18-map",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["3.P"],
    title: "Practical: The Codebase Map",
    subtitle: "Entry point, page organisation, data sources and start-up, on one page",
    estimatedMinutes: 32,
    intro:
      "A codebase map is the document you wish every project came with: where it starts, how its screens are organised, where its data comes from, and how to run it. Today you write one.",

    atoms: [
      {
        id: "a-ce-map-start",
        title: "How it starts",
        explain:
          "The map's first section answers \"what do I run, and what runs then?\". For each application: the command, the script it runs, and the entry file. This is the section a new developer needs on their first morning.",
        terminalExercise: term("m3-entry", {
          goal: "Confirm exactly what command npm start runs.",
          accept: ["npm pkg get scripts.start"],
          near: [{ command: 'rg -n "listen\\(" server', why: "That finds where the server starts listening. The command that launches it is the start script." }],
          hint: "npm pkg get scripts.start",
          success: "node --env-file-if-exists=.env server/index.js: load .env if it exists, then run server/index.js, which calls listen() on line 15.",
        }),
      },
      {
        id: "a-ce-map-pages",
        title: "How the pages are organised",
        explain:
          "For a frontend, map how the screens are reached. Kobo Market has no router library: App.jsx keeps a page value in state and shows Products, Login or Cart depending on it. Other apps use React Router or file-based routing (Next.js), but the question is always the same: what decides which screen is shown?",
        terminalExercise: term("m3-imports", {
          goal: "List what the top component, App.jsx, imports: its pages, components and hooks.",
          accept: ['rg -n "^import" src/App.jsx'],
          near: [{ command: 'rg -n "^import" server/routes/orders.js', why: "That is a server file. The pages are imported by src/App.jsx." }],
          hint: "Search src/App.jsx for lines starting with import.",
          success: "One component (Navbar), three pages (Products, Login, Cart), and the useAuth hook. Three pages, one shared bar, one source of sign-in state: the whole frontend in six lines.",
        }),
      },
      {
        id: "a-ce-map-data",
        title: "Where the data comes from",
        explain:
          "Trace data from where it is displayed back to where it is stored. In Kobo Market, pages call functions in src/api, which call request() in src/api/client.js, which fetches /api/... from the server; the server's routes call server/db/index.js, which reads data/kobo.json, created by npm run seed.",
        decision: {
          scenario: "Your map must say where the product list comes from.",
          question: "Which is the accurate, complete statement?",
          options: [
            { id: "a", text: "Products.jsx → fetchProducts (src/api/products.js) → request (src/api/client.js) → GET /api/products → listProducts (server/routes/products.js) → db.listProducts (server/db/index.js) → data/kobo.json, created by npm run seed", why: "Every hop, named by file and function, from screen to storage. Anyone can follow it." },
            { id: "b", text: "From the database", whyWrong: "True but useless: which file, which function, which database?" },
            { id: "c", text: "From React", whyWrong: "React draws the list; the data comes from the API." },
            { id: "d", text: "From Paystack", whyWrong: "Paystack handles payments, not products." },
          ],
          correct: "a",
          aftermath: "A path written this way is a map someone else can walk. Module 4 traces paths like this in depth.",
        },
      },
      {
        id: "a-ce-map-format",
        title: "The map, written down",
        explain:
          "Keep the map short and factual, and put it where the next person will find it: docs/codebase-map.md, or a section of the README. Write each fact with the evidence for it (a file and line, a command), so it can be checked and kept up to date.",
        example:
          "# Kobo Market: codebase map\n\n## Start\n- API: npm start → node --env-file-if-exists=.env server/index.js (listen, line 15), port 4000\n- App: npm run dev → Vite, index.html → src/main.jsx → <App /> (src/App.jsx), port 5173\n- Dev link: vite.config.js proxies /api → localhost:4000\n\n## Pages (src/App.jsx state `page`)\n- products → src/pages/Products.jsx (+ components/ProductCard.jsx)\n- login    → src/pages/Login.jsx (sign-in state: hooks/useAuth.js)\n- cart     → src/pages/Cart.jsx\n\n## Data\n- Browser → src/api/*.js → request() in src/api/client.js → /api/*\n- API routes: server/router.js (5 routes) → server/routes/*.js\n- Rules: server/services/ (authService, orderService)\n- Storage: server/db/index.js is the only reader/writer of data/kobo.json (npm run seed)\n- External: Paystack via server/payments/paystack.js\n\n## Configuration\n- server/config.js reads PORT, SESSION_SECRET, DATA_FILE, PAYSTACK_SECRET_KEY (see .env.example)",
        decision: {
          scenario: "Six months after you wrote the map, a teammate moves the data layer to a real database.",
          question: "What keeps the map useful?",
          options: [
            { id: "a", text: "It lives in the repository (docs/ or the README), so the change and the map update go through the same review", why: "Documentation next to the code gets updated with it; documentation elsewhere goes stale." },
            { id: "b", text: "It lives in your personal notes", whyWrong: "Nobody else can update it, or find it." },
            { id: "c", text: "It has no file paths, so nothing goes out of date", whyWrong: "Then it says nothing useful." },
            { id: "d", text: "It is regenerated by AI every day", whyWrong: "Possibly helpful, but an unreviewed map is a claim, not documentation." },
          ],
          correct: "a",
          aftermath: "Docs as code: reviewed with the change that makes them true.",
        },
      },
    ],

    task: {
      title: "Module practical: the codebase map",
      intro:
        "For the project you chose in Module 1, write a codebase map in Markdown, of no more than one page, and keep the commands you used to establish each fact.",
      prompts: [
        "Start: for each application, the command, the script it runs, the entry file, and the port.",
        "Pages: what decides which screen is shown, and the file for each screen.",
        "Data: the path from one screen to its stored data, hop by hop, with file and function names.",
        "Configuration: every setting the application reads, and where.",
        "A small dependency map (boxes and arrows, ASCII is fine) of the backend or the frontend.",
        "Three files a new developer can safely ignore, and three they must read first, with your reasons.",
      ],
      closing: "Next module: following a single feature through every layer, from click to database and back.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
