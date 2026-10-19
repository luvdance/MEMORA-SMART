/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 27 · NPM AND MODERN TOOLING
 *
 * Curriculum 27.1 – 27.10. Node.js and why frontend developers use it, npm
 * and package.json, installing and removing packages, development versus
 * production dependencies, scripts, build tools, Vite, environment variables
 * in frontend builds, and project structure.
 *
 * Every terminal transcript was recorded from a real session (Node 24.14,
 * npm 11.11, Vite 8.3). Long folder paths are shortened with "…". The build
 * transcript is the one that proved the point made in 27.9: the VITE_ value
 * appeared in the built JavaScript and the other value in .env did not.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s27-tooling";

const PROMPT = "ada@laptop:~/shop-app$";

const INIT_OUT = `Wrote to …/shop-app/package.json:

{
  "name": "shop-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}`;

const BUILD_OUT = `> shop-app@1.0.0 build
> vite build

vite v8.3.4 building client environment for production...
transforming...
✓ 5 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                0.21 kB │ gzip: 0.18 kB
dist/assets/index-DkPmS8Zt.js  8.50 kB │ gzip: 3.73 kB

✓ built in 151ms`;

const DEV_OUT = `> shop-app@1.0.0 dev
> vite

Port 5173 is in use, trying another one...

  VITE v8.3.4  ready in 524 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose`;

const TEST_OUT = `npm error Missing script: "test"
npm error
npm error To see a list of scripts, run:
npm error   npm run`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 124 · 27.1 – 27.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l124-node-npm",
    moduleId: "wd-m27-tooling",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["27.1", "27.2", "27.3"],
    title: "Node.js, npm and package.json",
    subtitle: "Why a browser developer installs a server runtime, and how projects describe themselves",
    estimatedMinutes: 22,
    intro: "Professional frontend projects use hundreds of small tools and libraries written by other people. Node.js runs those tools on your computer, npm installs them, and package.json records exactly which ones a project needs.",

    atoms: [
      {
        id: "a-wd-what-node",
        title: "What Node.js is and why frontend developers use it",
        explain:
          "Node.js runs JavaScript outside the browser, on your computer or a server. Frontend developers install it not to write servers but to run their tools: the dev server that reloads the page as you save, the bundler that builds the production site, linters, formatters and test runners are all JavaScript programs run by Node. Install the LTS (long-term support) version from nodejs.org; it includes npm. Check with node --version and npm --version.",
        decision: {
          scenario: "A classmate says: \"I only build websites, so I don't need Node.js.\"",
          question: "What is the most accurate reply?",
          options: [
            { id: "a", text: "Your site will not run on Node, but the tools that build and check it do: Vite, ESLint and test runners all run on Node", why: "Node is the engine for the development toolchain. The finished site still runs in the browser." },
            { id: "b", text: "Every website runs on Node.js", whyWrong: "Static sites run in browsers and can be served by anything." },
            { id: "c", text: "Node.js replaces HTML", whyWrong: "It does not; it runs JavaScript outside the browser." },
            { id: "d", text: "Right: frontend developers never need it", whyWrong: "Almost every professional frontend project relies on Node-based tools." },
          ],
          correct: "a",
          aftermath: "You have used Node in this course already: every \"what does this print?\" exercise was verified with it.",
        },
      },
      {
        id: "a-wd-npm",
        title: "npm and package management",
        explain:
          "npm (Node Package Manager) downloads packages, reusable code published by others, from the npm registry (npmjs.com), into a node_modules folder in your project. A package manager also installs everything those packages depend on, keeps versions consistent, and can update or remove them. Packages range from tiny utilities (dayjs for dates) to whole toolchains (vite).",
      },
      {
        id: "a-wd-package-json",
        title: "package.json",
        explain:
          "package.json describes a project: its name and version, its scripts (commands such as dev and build), and its dependencies with version ranges (\"^8.3.4\" means 8.3.4 or any later 8.x). package-lock.json records the exact versions installed, so every developer and the server get identical code. Commit both; never commit node_modules, which anyone can recreate with npm install.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real npm 11 session in an empty project folder. The long folder path is shortened.",
          goal: "Create a package.json for this project, accepting all the default answers.",
          commands: {
            "node --version": "v24.14.1",
            "npm --version": "11.11.0",
            "npm init -y": INIT_OUT,
          },
          available: ["node --version", "npm --version", "npm init -y"],
          accept: ["npm init -y"],
          near: [
            { command: "npm --version", why: "That confirms npm is installed. Now create the project file with npm init -y." },
          ],
          hint: "npm init asks questions; the -y flag answers yes to all of them.",
          success: "package.json now exists with a name, a version and a placeholder test script. Next: add dependencies and real scripts.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 125 · 27.4 – 27.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l125-dependencies-scripts",
    moduleId: "wd-m27-tooling",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["27.4", "27.5", "27.6"],
    title: "Dependencies and Scripts",
    subtitle: "Adding and removing packages, which ones ship, and running the project's commands",
    estimatedMinutes: 22,
    intro: "Most of the time spent with npm is three things: adding a package, removing one, and running a script. And one distinction decides what ends up in your users' browsers.",

    atoms: [
      {
        id: "a-wd-install-remove",
        title: "Installing and removing dependencies",
        explain:
          "npm install NAME adds a package and records it in package.json; npm uninstall NAME removes it. npm install with no name installs everything package.json lists, which is what you do after cloning a project. Every package you add is code you did not write and must trust, keep updated and ship, so prefer a few well-maintained packages over many tiny ones.",
        example: "$ npm install dayjs\n\nadded 1 package, and audited 2 packages in 7s\n\nfound 0 vulnerabilities\n\n$ npm uninstall dayjs\n\nremoved 1 package, and audited 16 packages in 3s\n\nfound 0 vulnerabilities",
      },
      {
        id: "a-wd-dev-prod-deps",
        title: "Development versus production dependencies",
        explain:
          "dependencies are packages your site's code uses while it runs in the browser, such as a date library; they end up in the built site. devDependencies are tools used only while developing and building, such as Vite, ESLint or a test runner; they never reach visitors. Install a dev dependency with npm install --save-dev NAME (or -D).",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. dayjs has already been installed as a normal dependency.",
          goal: "Install Vite, the build tool, as a DEVELOPMENT dependency: it is used to build the site, not by the site itself.",
          commands: {
            "npm install dayjs": "\nadded 1 package, and audited 2 packages in 7s\n\nfound 0 vulnerabilities",
            "npm install --save-dev vite": "\nadded 15 packages, and audited 17 packages in 27s\n\nfound 0 vulnerabilities",
            "cat package.json": "{\n  \"name\": \"shop-app\",\n  \"version\": \"1.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  },\n  \"keywords\": [],\n  \"author\": \"\",\n  \"license\": \"ISC\",\n  \"type\": \"commonjs\",\n  \"dependencies\": {\n    \"dayjs\": \"^1.11.23\"\n  },\n  \"devDependencies\": {\n    \"vite\": \"^8.3.4\"\n  }\n}",
          },
          available: ["npm install --save-dev vite", "cat package.json"],
          accept: ["npm install --save-dev vite"],
          near: [
            { command: "npm install dayjs", why: "That installs a runtime dependency. Vite is a build tool: add --save-dev." },
          ],
          hint: "npm install with the --save-dev flag, then the package name. (On your own computer, -D is a short form of the same flag.)",
          success: "Vite brought 14 packages of its own. Run cat package.json: dayjs is under dependencies and vite under devDependencies.",
        },
      },
      {
        id: "a-wd-npm-scripts",
        title: "Running scripts",
        explain:
          "The scripts section of package.json names the project's commands, so nobody has to remember the details: \"dev\": \"vite\", \"build\": \"vite build\", \"preview\": \"vite preview\", \"lint\": \"eslint .\", \"test\": \"vitest\". Run one with npm run NAME (npm test and npm start also work without run). Scripts can use any tool installed in node_modules as if it were installed globally.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. package.json's scripts are dev, build and preview.",
          goal: "Build the site for production using the project's build script.",
          commands: {
            "npm run build": BUILD_OUT,
            "npm run test": TEST_OUT,
            "npm run": "Scripts available in shop-app@1.0.0 via `npm run`:\n  dev\n    vite\n  build\n    vite build\n  preview\n    vite preview",
          },
          available: ["npm run", "npm run build"],
          accept: ["npm run build"],
          near: [
            { command: "npm run test", why: "There is no test script in this project yet (Module 28 adds one). The build script is called build." },
            { command: "npm run", why: "That lists the scripts. The one you want is build." },
          ],
          hint: "npm run, then the script's name.",
          success: "Five modules bundled into one 8.5kB file with a hash in its name, ready to deploy. That hash changes whenever the code does, so browsers never use a stale copy.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 126 · 27.7 – 27.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l126-build-tools-vite",
    moduleId: "wd-m27-tooling",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["27.7", "27.8", "27.9", "27.10"],
    title: "Build Tools, Vite, Environment Variables and Project Structure",
    subtitle: "Turning many source files into a fast production site",
    estimatedMinutes: 26,
    intro: "The files you write are not the files you should ship. A build tool turns readable source spread across many modules into a small, fast, cache-friendly production site, and Vite is the one most new projects choose.",

    atoms: [
      {
        id: "a-wd-build-tools",
        title: "Understanding build tools",
        explain:
          "A build tool (bundler) reads your entry file, follows every import, and produces a few optimised files: modules combined to cut down requests, unused code removed (tree-shaking), whitespace and long names shrunk (minification), file names given content hashes so browsers can cache them for a year, and npm packages resolved from node_modules. Your source stays readable; visitors get the optimised output in a dist folder.",
        table: {
          caption: "Source versus build.",
          headers: ["", "Source (src/)", "Build (dist/)"],
          rows: [
            ["Files", "Many small modules", "A few bundled files"],
            ["Readable", "Yes: comments, names, spacing", "No: minified"],
            ["npm imports", "import dayjs from \"dayjs\"", "Included in the bundle"],
            ["File names", "main.js", "index-DkPmS8Zt.js (hashed for caching)"],
            ["Deployed", "Never", "Always"],
          ],
        },
      },
      {
        id: "a-wd-vite",
        title: "Introduction to Vite",
        explain:
          "Vite (French for \"fast\") is a build tool and development server. Start a new project with npm create vite@latest and choose \"Vanilla\" for plain JavaScript. npm run dev starts a local server that updates the page instantly as you save (hot module replacement); npm run build writes the production site to dist; npm run preview serves dist so you can check it before deploying. In a Vite project, index.html sits at the project root and loads /src/main.js as a module.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. Another project was already using port 5173, so Vite chose the next free one.",
          goal: "Start Vite's development server so you can see the site in the browser as you work.",
          commands: {
            "npm run dev": DEV_OUT,
            "npm run build": BUILD_OUT,
          },
          available: ["npm run dev", "npm run build"],
          accept: ["npm run dev"],
          near: [
            { command: "npm run build", why: "That builds the production site once. For working, you want the dev server that reloads as you save." },
          ],
          hint: "The script called dev.",
          success: "Open http://localhost:5174/ in the browser. Vite found port 5173 busy and moved on by itself; the address it prints is always the one to open.",
        },
      },
      {
        id: "a-wd-env-vars",
        title: "Environment variables in frontend builds",
        explain:
          "Environment variables hold settings that differ between your laptop and production, such as an API's base URL, without editing the code. In Vite they go in a .env file (kept out of Git), and only variables starting with VITE_ are exposed to your code, as import.meta.env.VITE_NAME. Crucially, Vite writes those values INTO the built JavaScript, so anyone can read them: a frontend environment variable is configuration, never a secret.",
        example: ".env\n  VITE_SHOP_NAME=Ada Shoes\n  SECRET_KEY=do-not-ship\n\nsrc/main.js\n  const shop = import.meta.env.VITE_SHOP_NAME;   // \"Ada Shoes\"\n\nAfter npm run build, searching dist/assets/index-DkPmS8Zt.js:\n  \"Ada Shoes\"     found       (VITE_ values are built in, and public)\n  \"do-not-ship\"   not found   (no VITE_ prefix, so never exposed)",
        decision: {
          scenario: "A developer stores a payment provider's secret key as VITE_PAYMENT_SECRET so the checkout page can use it.",
          question: "What is wrong?",
          options: [
            { id: "a", text: "VITE_ variables are written into the public JavaScript, so the secret is exposed to every visitor; it must stay on a server", why: "The build copies VITE_ values into the bundle in plain text. Secrets belong in server-side code or serverless functions, never in a frontend build." },
            { id: "b", text: "Nothing: .env files are private", whyWrong: "The .env file is private; the value it puts into the bundle is not." },
            { id: "c", text: "It should be called SECRET_PAYMENT instead", whyWrong: "Without VITE_ the code could not read it at all, which is exactly why secrets cannot be used from the frontend." },
            { id: "d", text: "Only minified builds expose it", whyWrong: "Minification does not hide string values." },
          ],
          correct: "a",
          aftermath: "Publishable keys (designed to be public) may go in VITE_ variables. Secret keys never may.",
        },
      },
      {
        id: "a-wd-project-structure",
        title: "Project structure and dependency management",
        explain:
          "A typical Vite project: index.html and package.json at the root, your code in src/ split into modules by job, static files served as they are in public/, the build output in dist/ (ignored by Git), and node_modules/ (ignored by Git). Keep dependencies few and current: npm outdated lists packages with newer versions, npm update applies safe updates within your version ranges, and npm audit reports known vulnerabilities (Module 31).",
        table: {
          caption: "A Vite project's layout.",
          headers: ["Path", "Contains", "In Git?"],
          rows: [
            ["index.html", "The page, loading /src/main.js", "Yes"],
            ["src/", "Your modules: main.js, data/, logic/, view/", "Yes"],
            ["public/", "Files copied as they are: favicon, robots.txt", "Yes"],
            ["package.json, package-lock.json", "Dependencies and scripts", "Yes"],
            [".env", "Local settings", "No"],
            ["node_modules/, dist/", "Installed packages, build output", "No"],
          ],
        },
      },
    ],

    task: {
      title: "Module project: the to-do app as a Vite project",
      intro: "Move your to-do application into a professional project structure.",
      prompts: [
        "Create a Vite project with npm create vite@latest (Vanilla, JavaScript) and commit it to a new Git repository with a proper .gitignore.",
        "Move your code into src/ as modules: storage.js, logic.js, view.js and main.js.",
        "Install one small runtime dependency you genuinely need (for example dayjs to show when each task was added) and confirm it is under dependencies.",
        "Add VITE_APP_TITLE to .env, show it in the page heading, and check after npm run build that it appears in dist.",
        "Run npm run build and npm run preview, and note the size of the built JavaScript.",
      ],
      closing: "Next module: keeping that code clean and tested.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
