/**
 * CODEBASE ENGINEERING · MODULE 9 · ENVIRONMENTS, DEPENDENCIES, DEPLOYMENT AND SECURITY
 *
 * Curriculum 9.1 – 9.12 and the practical, 9.P. Environments; environment
 * variables, .env and secrets; package managers, lockfiles and conflicts;
 * builds, dev servers and deployment; ports, processes and connection
 * failures; CI logs; Docker; exposed keys, unsafe dependencies and risky AI
 * code; access rules; protecting production data; destructive commands,
 * migrations and agent permissions; deployment and recovery documentation.
 *
 * Every failure was produced for real on Kobo Market: a missing secret, a
 * port already taken, a stopped Docker daemon, a hard-coded key, a dry run
 * that would have deleted .env. Docker's daemon was not running when this
 * was recorded, so its lesson is honest about that rather than inventing a
 * build log.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term } from "./ce-helpers.js";

export const SECTION_ID = "ce-s9-production";
const MODULE = "ce-m9-production";

const HOST_START = "SESSION_SECRET=set-by-the-host PORT=4100 npm start";
const KEY_SCAN = 'rg -n "sk_(test|live)_[A-Za-z0-9]+"';
const KEY_SCAN_ALL = 'rg -n --no-ignore --hidden "sk_(test|live)_" -g "!node_modules"';
const ORDER_WITH_TOKEN =
  'curl -s -X POST localhost:4000/api/orders -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d \'{"items":[{"id":"solar-lamp","quantity":1,"price":1}]}\'';
const CI_LOCAL = "npm run lint && npm test 2>&1 | tail -n 4 && npm run build 2>&1 | tail -n 1";
const CI_FAIL = "npm run lint && npm test 2>&1 | tail -n 22";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 9.1 – 9.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l53-environments",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "Development, Staging and Production; Environment Variables and Secrets",
    subtitle: "Why the same code behaves differently in different places",
    estimatedMinutes: 30,
    intro:
      "\"It works on my machine\" is almost always true, and almost never useful. The code is the same everywhere; what differs is the environment around it: settings, secrets, versions, data. This module is about those differences.",

    atoms: [
      {
        id: "a-ce-environments",
        title: "Three environments",
        explain:
          "Development is your machine: fake data, debug output, fast restarts. Staging is a copy of production for testing releases: same kind of servers and configuration, but no real customers. Production is the real thing: real users, real money, real data. Each needs its own configuration (different databases, different keys: Paystack test keys in development, live keys only in production) and each is stricter than the last about who can change what.",
        table: {
          caption: "Environments.",
          headers: ["", "Development", "Staging", "Production"],
          rows: [
            ["Users", "You", "The team, testers", "Customers"],
            ["Data", "Seeded, fake", "Realistic, not real", "Real"],
            ["Payment keys", "Test (sk_test_)", "Test", "Live (sk_live_)"],
            ["Who can change it", "You", "Through the release process", "Only through the release process"],
          ],
        },
        decision: {
          scenario: "A release passed every test locally. The team deploys it to staging before production.",
          question: "What is staging for, here?",
          options: [
            { id: "a", text: "To run the release on production-like servers and configuration, so environment-specific problems appear before customers see them", why: "Staging catches the problems that come from the environment rather than the code: settings, versions, permissions, networking." },
            { id: "b", text: "Nothing: the tests already passed", whyWrong: "Tests ran on a laptop. Production is not a laptop." },
            { id: "c", text: "To let customers try it early", whyWrong: "Staging has no real customers." },
            { id: "d", text: "To store backups", whyWrong: "That is not its purpose." },
          ],
          correct: "a",
          aftermath: "Each environment catches a different class of problem.",
        },
      },
      {
        id: "a-ce-env-files",
        title: "A missing setting, as a server sees it",
        explain:
          "On a server there is usually no .env file: settings are provided by the hosting platform as environment variables. If one is missing, a well-written app fails at start-up with a clear message (Kobo Market's assertConfig) rather than later with a confusing one. Here the server has no .env and nothing has been set.",
        terminalExercise: term("m9-missing-secret", {
          intro: "This copy of the project has no .env file, like a fresh server.",
          goal: "Start the API and read why it refuses to run.",
          accept: ["npm start"],
          near: [{ command: "node --env-file=.env.production server/index.js", why: "That tries to load a file that does not exist. Start it normally and read the error." }],
          hint: "npm start.",
          success: "\".env not found. Continuing without it.\" from Node, then SESSION_SECRET is not set, thrown by assertConfig (config.js:11) before the server listens. A clear failure at the start beats a confusing one on the first login.",
        }),
      },
      {
        id: "a-ce-host-env",
        title: "Configuration from the host",
        explain:
          "Hosting platforms (Render, Railway, Fly.io, Heroku, Vercel, a VPS's systemd unit, a Kubernetes secret) let you set environment variables in their dashboard or configuration; the platform passes them to your process when it starts. Your code reads process.env exactly as it does locally. Variables set this way take precedence over any .env file, as you saw in Module 2.",
        terminalExercise: term("m9-missing-secret", {
          goal: "Start the API with SESSION_SECRET and PORT provided by the environment, the way a host would, without any .env file.",
          accept: [HOST_START],
          near: [{ command: "npm start", why: "Without the variables it refuses to start. Provide them in front of the command, as a host would." }],
          hint: "Set SESSION_SECRET and PORT in front of npm start.",
          success: "Listening on 4100, with no .env at all. That is how production runs: the same code, the settings coming from the platform.",
        }),
      },
      {
        id: "a-ce-secrets-mgmt",
        title: "Secrets management",
        explain:
          "A secret is anything that grants access: API keys, database passwords, signing secrets like SESSION_SECRET. Rules: never in the code, never in Git (not even in history), never in the frontend, never in logs or AI prompts. Store them in the platform's secret settings or a secrets manager (GitHub Actions secrets, AWS Secrets Manager, Doppler, Vault), give each environment its own, and rotate (replace) them when someone leaves or a leak is suspected.",
        decision: {
          scenario: "A developer is leaving the company. They had access to the production Paystack key and SESSION_SECRET.",
          question: "What should happen?",
          options: [
            { id: "a", text: "Rotate both: issue a new Paystack key and a new SESSION_SECRET in the host's settings, then revoke the old key", why: "Secrets someone could have copied are secrets you must assume they have. (Changing SESSION_SECRET also signs everyone out: a small, acceptable cost.)" },
            { id: "b", text: "Ask them not to use the keys", whyWrong: "Trust is not a control." },
            { id: "c", text: "Delete their account and keep the keys", whyWrong: "The keys still work wherever they were copied." },
            { id: "d", text: "Commit the new keys to Git so the team can find them", whyWrong: "Never put secrets in Git." },
          ],
          correct: "a",
          aftermath: "Rotation is routine, not an emergency.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 9.3 – 9.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l54-packages-builds",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3", "9.4"],
    title: "Package Managers, Lockfiles and Conflicts; Builds and Deployment Commands",
    subtitle: "Installing exactly the same code everywhere, and turning source into what production runs",
    estimatedMinutes: 34,
    intro:
      "Most \"works here, fails there\" bugs come from two places: a different set of installed packages, and a different build. Both are under your control if you know the commands.",

    atoms: [
      {
        id: "a-ce-lockfile-change",
        title: "What an install changes",
        explain:
          "npm install PACKAGE@RANGE updates three things: package.json (the range), package-lock.json (the exact versions of it and everything it pulls in) and node_modules. Other package managers work the same way (yarn.lock, pnpm-lock.yaml, poetry.lock). An upgrade is therefore a change to both files, which must be committed together.",
        terminalExercise: term("m9-lockfile", {
          goal: "Upgrade globals to version 17 and see what npm reports.",
          accept: ["npm install globals@^17 --no-audit"],
          near: [{ command: "git diff --stat", why: "Run the install first, then look at what it changed." }],
          hint: "npm install, the package and the range.",
          success: "\"added 25 packages, and changed 1 package\": the new globals plus the packages its new version brings. git diff --stat now shows package.json and package-lock.json both changed.",
        }),
      },
      {
        id: "a-ce-lock-diff",
        title: "Version constraints",
        explain:
          "Ranges in package.json say what is acceptable: ^17.13.0 means 17.13.0 up to (not including) 18; ~17.13.0 means 17.13.x only; 17.13.0 means exactly that. Dependency conflicts happen when two packages need incompatible versions of a third (npm reports ERESOLVE): resolve them by upgrading one side, not by forcing (--force or --legacy-peer-deps hide the conflict; they do not fix it).",
        terminalExercise: term("m9-lockfile", {
          goal: "See exactly how the declared range changed in package.json.",
          accept: ["git diff package.json"],
          near: [{ command: "git diff --stat", why: "That shows which files changed. Read the actual change in package.json." }],
          hint: "git diff and the file.",
          success: "\"globals\": \"^16.5.0\" became \"^17.13.0\": any 17.x from 17.13.0 on. A major-version range change, to be reviewed like code.",
        }),
      },
      {
        id: "a-ce-npm-ci",
        title: "npm ci: exactly the lockfile",
        explain:
          "npm install may update the lockfile; npm ci never does. It deletes node_modules and installs exactly what package-lock.json lists, failing if package.json and the lockfile disagree. Use npm ci in CI and deployments, so every machine runs the same code. Here the upgrade was undone with git restore, and npm ci brings node_modules back in line.",
        terminalExercise: term("m9-lockfile", {
          intro: "The upgrade has been undone with git restore package.json package-lock.json.",
          goal: "Reinstall exactly what the lockfile lists.",
          accept: ["npm ci --no-audit"],
          near: [{ command: "git restore package.json package-lock.json", why: "That restored the files; node_modules still has the upgrade. Reinstall from the lockfile with npm ci." }],
          hint: "npm ci.",
          success: "133 packages, exactly as locked. Note the warning: eslint@9.39.5 \"is no longer supported\". A clean install is also when you learn which dependencies are ageing.",
        }),
      },
      {
        id: "a-ce-prod-build",
        title: "Development server versus production build",
        explain:
          "npm run dev starts Vite's development server: it serves source files on demand, reloads instantly, and is not meant for real traffic. npm run build produces the production build in dist/: bundled, minified, with hashed file names. Production serves dist/ (as static files from a host or CDN); the API runs with npm start. Never deploy the dev server.",
        terminalExercise: term("m9-build", {
          goal: "Produce the production build of the frontend.",
          accept: ["npm run build"],
          near: [{ command: "ls -l dist dist/assets", why: "Build it first; then inspect dist." }],
          hint: "npm run build.",
          success: "26 modules transformed into three files: index.html, one CSS and one JavaScript bundle of 145 kB (47 kB gzipped). That is what users download.",
        }),
      },
      {
        id: "a-ce-preview",
        title: "Testing the production build locally",
        explain:
          "vite preview serves the dist/ folder locally, so you can test exactly what will be deployed before deploying it. Problems that only appear in the built version (a missing environment variable baked in at build time, a path that only works in dev) show up here.",
        terminalExercise: term("m9-build", {
          goal: "Serve the production build locally on port 4199, to test it before deploying.",
          accept: ["npm run preview -- --port 4199"],
          near: [{ command: "npm run build", why: "That creates dist/. Now serve it with the preview script." }],
          hint: "npm run preview, passing --port 4199 after --.",
          success: "Serving dist/ on http://localhost:4199/. What you test here is byte for byte what you deploy.",
        }),
      },
      {
        id: "a-ce-vite-public",
        title: "Build-time variables are public",
        explain:
          "Frontend environment variables (VITE_ in Vite, NEXT_PUBLIC_ in Next.js, REACT_APP_ in older tools) are not secret: they are copied into the JavaScript bundle at build time, and every visitor downloads the bundle. Two consequences: never put a secret in one, and a frontend built without the right value has the wrong value baked in, however the server is configured later.",
        terminalExercise: term("m9-vite-env", {
          intro: "The frontend was built with VITE_API_URL=https://api.kobo.example.",
          goal: "Prove that the value ended up inside the public JavaScript bundle.",
          accept: ['rg -l -F "https://api.kobo.example" dist'],
          near: [{ command: "rg -c PAYSTACK dist", why: "That checks no Paystack setting leaked (none did). Search dist for the API URL itself." }],
          hint: "A fixed-string search of dist for the URL.",
          success: "It is in dist/assets/index-…js, readable by anyone who opens the site. VITE_ values are configuration, never secrets, and changing one means rebuilding.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 9.5 – 9.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l55-ports-ci",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.5", "9.6"],
    title: "Ports, Processes and Connection Failures; CI/CD Logs",
    subtitle: "Why a server will not start or cannot be reached, and reading the checks that run on every push",
    estimatedMinutes: 30,
    intro:
      "Servers are processes listening on ports, and a whole family of failures comes from that: two processes wanting the same port, a process that is not running, a client using the wrong port. And every change you push is checked by a machine whose log you need to be able to read.",

    atoms: [
      {
        id: "a-ce-port-in-use",
        title: "A port already in use",
        explain:
          "A port is a numbered door on a machine; one process at a time can listen on it. EADDRINUSE means another process already has it: usually your own server, still running in another terminal or left behind in the background. Find it (Windows: netstat -ano | findstr :4000; macOS/Linux: lsof -i :4000), then stop it or use another port.",
        terminalExercise: term("m9-ports", {
          intro: "The API is already running on port 4000 in the background.",
          goal: "Start a second copy and read the error.",
          accept: ["npm start"],
          near: [{ command: "docker ps", why: "That is about Docker. Start the API again to see the port conflict." }],
          hint: "npm start.",
          success: "listen EADDRINUSE: address already in use :::4000, from server.listen at index.js:15. The first server is still running: stop it, or start this one with another PORT.",
        }),
      },
      {
        id: "a-ce-connection",
        title: "Connection failures",
        explain:
          "Connection errors say how far the request got. Connection refused (curl exit 7, ECONNREFUSED): the machine answered, but nothing is listening on that port: the server is not running, or you have the wrong port. Timeout: nothing answered at all: a firewall, a wrong host, a dead network. Could not resolve host: DNS cannot find the name. A 4xx or 5xx response means the connection worked and the application answered.",
        terminalExercise: term("m9-ports", {
          goal: "Try the API on port 4100, where nothing is running, and get curl's exit code.",
          accept: ['curl -s localhost:4100/api/products; echo " exit=$?"'],
          near: [{ command: "npm start", why: "That shows the port conflict on 4000. Try reaching port 4100 to see what \"nothing listening\" looks like." }],
          hint: "curl -s, then echo the exit code.",
          success: "Exit 7: could not connect. Nothing listens on 4100 (the second server failed to start, remember). Wrong port and server down look identical: check both.",
        }),
      },
      {
        id: "a-ce-docker-daemon",
        title: "A background service that is not running",
        explain:
          "Many tools are clients for a background service (a daemon): docker talks to the Docker engine, psql to a PostgreSQL server, redis-cli to Redis. When the service is not running, the client fails with a connection error that names how it tried to connect. The fix is starting the service, not reinstalling the client.",
        terminalExercise: term("m9-ports", {
          goal: "Ask Docker which containers are running.",
          accept: ["docker ps"],
          near: [{ command: 'curl -s localhost:4100/api/products; echo " exit=$?"', why: "That tests the API. Ask Docker with docker ps." }],
          hint: "docker ps.",
          success: "\"failed to connect to the docker API at npipe:////./pipe/docker_engine ... check if the daemon is running\". The docker command is installed; the Docker engine is not running. Start Docker Desktop (or the docker service) first.",
        }),
      },
      {
        id: "a-ce-ci-file",
        title: "Automated checks: the CI workflow",
        explain:
          "Continuous integration (CI) runs the project's checks automatically on every push and pull request, on a clean machine. GitHub Actions reads workflows from .github/workflows/*.yml: when to run (on), on what machine (runs-on), and the steps. The usual steps are exactly your baseline: install from the lockfile, lint, test, build. CD (continuous deployment) adds a deploy step after them, usually only on main.",
        terminalExercise: term("m9-ci", {
          goal: "Read the CI workflow to see which checks run on every pull request.",
          accept: ["cat .github/workflows/ci.yml"],
          near: [{ command: CI_LOCAL, why: "That runs the checks locally. First read what CI runs: the workflow file." }],
          hint: "The file is in .github/workflows/.",
          success: "On every pull request and every push to main: Ubuntu, Node 24, then npm ci, lint, test and build. Any step failing fails the check, and a protected main will not accept the merge.",
        }),
      },
      {
        id: "a-ce-ci-log",
        title: "Reading a failed CI log",
        explain:
          "A CI log is the terminal output of each step, run on the CI machine. When a check fails, open the failed step and read it the way you read local output: the first error, the file, the line. Then reproduce it locally by running the same command. Here are the CI steps run on the AI's Module 5 change.",
        terminalExercise: term("m9-ci-fail", {
          intro: "The AI's 12-file change from Module 5 is applied, and the CI steps are run as CI would.",
          goal: "Run lint then tests, as the CI steps do, and read which step fails.",
          accept: [CI_FAIL],
          hint: "npm run lint && npm test, keeping the end of the output.",
          success: "Lint passes (the AI had switched the rule off), so CI moves on; then the test step fails on \"the right password verifies\". A green lint step is not proof of anything if someone weakened its rules: read the diff, not just the ticks.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 9.7 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l56-docker-risk",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.7", "9.8"],
    title: "Docker Basics; Exposed Keys, Unsafe Dependencies and Risky AI Code",
    subtitle: "Packaging the environment with the code, and the security problems AI makes easy to create",
    estimatedMinutes: 34,
    intro:
      "Docker attacks \"works on my machine\" directly, by shipping the machine. And AI tools, which write plausible code quickly, are particularly good at producing a few specific security mistakes. Know both.",

    atoms: [
      {
        id: "a-ce-docker-concepts",
        title: "Images, containers, volumes and configuration",
        explain:
          "A Dockerfile is a recipe. Building it produces an image: a frozen file system with the OS layer, the runtime (Node 24), your dependencies and your code. Running an image starts a container: an isolated process using that file system. A volume is storage that outlives containers (the data). Configuration comes from environment variables given at run time (docker run -e SESSION_SECRET=...), never baked into the image.",
        table: {
          caption: "Docker words.",
          headers: ["Term", "Is", "For Kobo Market"],
          rows: [
            ["Dockerfile", "The recipe", "FROM node:24-alpine, npm ci, copy server/"],
            ["Image", "The built, frozen result", "kobo-api"],
            ["Container", "A running instance of an image", "The API, listening on 4000"],
            ["Volume", "Storage that outlives containers", "/data, holding kobo.json"],
            ["Environment", "Settings at run time", "-e SESSION_SECRET=... -e PORT=4000"],
          ],
        },
        terminalExercise: term("m9-docker", {
          goal: "Read the recipe for Kobo Market's API image.",
          accept: ["cat Dockerfile"],
          near: [{ command: "cat .dockerignore", why: "That lists what is kept out of the image. Read the recipe first: the Dockerfile." }],
          hint: "cat Dockerfile.",
          success: "Node 24 on Alpine; package files copied and npm ci run first (so that layer is cached until the lockfile changes); then only server/; data on a /data volume; configuration from the environment. No .env, no frontend, no secrets in the image.",
        }),
      },
      {
        id: "a-ce-dockerignore",
        title: ".dockerignore: what never goes into the image",
        explain:
          ".dockerignore works like .gitignore for docker build: it keeps files out of what Docker sends to the build. Without it, COPY . . would copy node_modules from your machine (wrong platform), and .env (your secrets) into an image that may be pushed to a registry.",
        terminalExercise: term("m9-docker", {
          goal: "Check that secrets and local files are kept out of the image.",
          accept: ["cat .dockerignore"],
          near: [{ command: "cat Dockerfile", why: "That is the recipe. What is excluded is in .dockerignore." }],
          hint: "cat .dockerignore.",
          success: "node_modules, dist, data, .env, .git and logs are all excluded. An image can be shared without sharing your machine's secrets.",
        }),
      },
      {
        id: "a-ce-docker-daemon-build",
        title: "When the build cannot reach the engine",
        explain:
          "docker build is a client request to the Docker engine. If the engine is not running, nothing is built, and the error says so. (The deprecation notice above it is a separate, harmless warning about the older builder.) Read past warnings to the actual error.",
        terminalExercise: term("m9-docker", {
          goal: "Try to build the image and read why it fails.",
          accept: ["docker build -t kobo-api ."],
          near: [{ command: "docker --version", why: "The client is installed (29.7.2). Try the build to see what fails." }],
          hint: "docker build, tag kobo-api, from this folder.",
          success: "A deprecation warning first (the legacy builder), then the real error: cannot connect to the Docker engine. Start Docker Desktop and the same command builds the image.",
        }),
      },
      {
        id: "a-ce-exposed-keys",
        title: "Exposed API keys",
        explain:
          "A secret key in source code is exposed the moment the code is shared, and in frontend code the moment it is deployed. Scan for key patterns before every commit: Paystack secret keys start sk_test_ or sk_live_, Stripe's too; AWS keys AKIA; GitHub tokens ghp_. Tools such as gitleaks, trufflehog and GitHub's secret scanning automate it.",
        terminalExercise: term("m9-secrets", {
          intro: "An AI assistant was asked to \"verify payments from the browser\".",
          goal: "Scan the project for Paystack-style secret keys.",
          accept: [KEY_SCAN],
          near: [{ command: "git status --short", why: "That shows a new file. Scan for the key pattern." }],
          hint: "Search for sk_test_ or sk_live_ followed by letters and digits.",
          success: "src/api/payments.js:4: a secret key hard-coded into FRONTEND code, which would ship to every visitor. The file is not committed yet (git status shows ??): delete it, and since it was pasted from somewhere, revoke the key.",
        }),
      },
      {
        id: "a-ce-hidden-search",
        title: "Scanning everything, including what Git ignores",
        explain:
          "ripgrep skips ignored and hidden files by default, which is usually what you want, and exactly wrong for a secret scan: secrets live in ignored files. --no-ignore and --hidden search them too; exclude node_modules separately with -g. Compare the two results: one shows what could be committed, the other everything on disk.",
        terminalExercise: term("m9-secrets", {
          goal: "Scan for sk_test_/sk_live_ in every file, including ignored and hidden ones, but not node_modules.",
          accept: [KEY_SCAN_ALL],
          near: [{ command: KEY_SCAN, why: "That skips ignored and hidden files like .env. Add --no-ignore and --hidden." }],
          hint: "rg with --no-ignore, --hidden, and -g \"!node_modules\".",
          success: "Three hits: the comments in .env and .env.example (no real key: PAYSTACK_SECRET_KEY is empty), and the hard-coded key in payments.js. Only the last is a problem.",
        }),
      },
      {
        id: "a-ce-audit",
        title: "Unsafe dependencies",
        explain:
          "npm audit checks installed packages against a database of known vulnerabilities and reports each with its severity and the fixed version (pip-audit, mvn dependency-check and GitHub's Dependabot do the same elsewhere). Read each finding: is the vulnerable code reachable in your app? Is there a fixed version? Do not run npm audit fix --force blindly: it can install breaking major versions.",
        terminalExercise: term("m9-secrets", {
          goal: "Check the installed dependencies for known vulnerabilities.",
          accept: ["npm audit"],
          near: [{ command: KEY_SCAN, why: "That scans your code. npm audit checks the dependencies." }],
          hint: "npm audit.",
          success: "found 0 vulnerabilities, today. Run it in CI so tomorrow's newly published vulnerabilities are caught too.",
        }),
      },
      {
        id: "a-ce-risky-ai",
        title: "Risky AI-generated code",
        explain:
          "AI assistants reproduce patterns from their training data, including insecure ones, and optimise for \"it works\". Watch for: secrets in code, especially frontend; trusting input from the browser (prices, roles, user ids); string-built SQL or shell commands (injection); disabled checks (TLS verification off, lint rules off, CORS set to *); broad permissions; error handlers that swallow everything; and invented packages (a name that sounds right but is not the real library, sometimes registered by attackers).",
        decision: {
          scenario: "An AI-generated order route reads the price from the request body (\"to save a database lookup\").",
          question: "What is wrong?",
          options: [
            { id: "a", text: "The browser controls the request, so a customer could send any price they like; prices must come from the server's data", why: "Never trust the client for anything that matters: prices, roles, ownership. Kobo Market's real route reads prices from the database for this reason." },
            { id: "b", text: "Nothing: it is faster", whyWrong: "Faster at giving products away." },
            { id: "c", text: "It should read the price from localStorage instead", whyWrong: "That is also controlled by the user." },
            { id: "d", text: "The price should be in a hidden input", whyWrong: "Hidden inputs are fully editable." },
          ],
          correct: "a",
          aftermath: "You will see the server enforce this next lesson.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 9.9 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l57-access-data",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.9", "9.10"],
    title: "Authentication, Authorization and Data Access Rules; Protecting Production Data",
    subtitle: "Who may do what to which data, enforced where it cannot be bypassed, and debugging without harming users",
    estimatedMinutes: 30,
    intro:
      "Security rules only count where the user cannot reach them: on the server and in the database. And when production misbehaves, the data you are investigating belongs to real people.",

    atoms: [
      {
        id: "a-ce-server-trust",
        title: "The server decides",
        explain:
          "Kobo Market's createOrder ignores everything in the request except product ids and quantities: it looks up each price in its own data. Try to buy a solar lamp for 1 kobo: first without signing in, then signed in as Bola.",
        terminalExercise: term("m9-prices", {
          intro: "The API is running. TOKEN holds Bola's session token. Both requests claim the lamp costs 1 kobo.",
          goal: "Send the order with Bola's token and see what price the server charges.",
          accept: [ORDER_WITH_TOKEN],
          near: [{ command: 'curl -s -X POST localhost:4000/api/orders -H "Content-Type: application/json" -d \'{"items":[{"id":"solar-lamp","quantity":1,"price":1}]}\'', why: "Without a token, requireAuth stops it (\"Sign in required\"). Send it with the Authorization header." }],
          hint: "The same request with -H \"Authorization: Bearer $TOKEN\".",
          success: "The order's line price is 1590000, from the server's data; the \"price\": 1 was ignored. Total ₦17,400 including delivery. Authentication (token) and server-side rules (prices) together.",
        }),
      },
      {
        id: "a-ce-authz-rules",
        title: "Authorization and database access rules",
        explain:
          "Authentication says who you are; authorization says what you may do. Enforce it on the server for every request (a customer may read only their own orders; only an admin may change prices), and, where the database can be reached from outside (Firebase Firestore, Supabase), in the database's own rules too, because the client talks to it directly. Deny by default; allow specific actions to specific roles or owners.",
        example:
          "Firestore rules (database access rules for a client-reachable database):\n\nmatch /orders/{orderId} {\n  // Customers read only their own orders; nobody writes from the browser.\n  allow read: if request.auth != null\n              && resource.data.userId == request.auth.uid;\n  allow write: if false;   // orders are created by the server only\n}",
        decision: {
          scenario: "A new endpoint GET /api/orders/:id returns any order whose id is in the URL, to any signed-in user.",
          question: "What is the flaw?",
          options: [
            { id: "a", text: "Any customer can read any other customer's order by changing the id: it checks authentication but not ownership", why: "This is called an insecure direct object reference. The handler must also check order.userId === req.user.id (or an admin role)." },
            { id: "b", text: "It should not require sign-in", whyWrong: "That makes it worse." },
            { id: "c", text: "Order ids should be longer", whyWrong: "Hard-to-guess ids help, but are not authorization." },
            { id: "d", text: "There is no flaw", whyWrong: "Authenticated is not authorised." },
          ],
          correct: "a",
          aftermath: "For every record: who owns it, and does this request's user?",
        },
      },
      {
        id: "a-ce-prod-data",
        title: "Protecting production data while debugging",
        explain:
          "When debugging production: read before you write, and prefer not to touch it at all. Reproduce with a copy of the data that has personal details removed, or on staging. If you must query production, use read-only access, select only the fields you need, never copy real customer data to your laptop or into an AI tool, and log what you did. Any write to production goes through a reviewed, backed-up, reversible process.",
        decision: {
          scenario: "A customer's order shows the wrong total in production. A teammate suggests downloading the whole production database to a laptop to investigate.",
          question: "What is the better approach?",
          options: [
            { id: "a", text: "Look up that one order with read-only access (only the fields needed), reproduce the problem locally with the same products and quantities using seeded data", why: "Minimal access to real data; full freedom with fake data. The bug, not the customer's details, is what you need." },
            { id: "b", text: "Download it: it is faster", whyWrong: "Every customer's data on a laptop, outside the controls that protect it." },
            { id: "c", text: "Paste the customer's order and email into an AI chat", whyWrong: "Personal data leaving its system." },
            { id: "d", text: "Fix the total directly in the production database", whyWrong: "An unreviewed write, before the cause is known." },
          ],
          correct: "a",
          aftermath: "Debug with the shape of the data, not the people in it.",
        },
      },
      {
        id: "a-ce-debug-safely",
        title: "Logs and personal data",
        explain:
          "Production logs are read by many people and kept for a long time, so they must not contain passwords, tokens, full card numbers or unnecessary personal data. Log ids rather than emails, mask what you must show, and check that debugging code added in a hurry (console.log(user)) is removed before it ships.",
        decision: {
          scenario: "To debug a payment problem, a developer adds console.log(req.user, req.headers) to createOrder and deploys it.",
          question: "What is the problem?",
          options: [
            { id: "a", text: "Every order now writes the user's email and their session token (in the Authorization header) to the production logs", why: "Tokens in logs are credentials anyone with log access can use; emails are personal data. Log the order id and the error instead." },
            { id: "b", text: "Logs make the server slow", whyWrong: "Not the main issue." },
            { id: "c", text: "console.log does not work in production", whyWrong: "It does, which is the problem." },
            { id: "d", text: "Nothing, it is temporary", whyWrong: "The logs it writes are not temporary." },
          ],
          correct: "a",
          aftermath: "Log what identifies the event, not the person's secrets.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 9.11 – 9.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l58-destructive-runbooks",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.11", "9.12"],
    title: "Destructive Commands, Migrations and Agent Permissions; Deployment and Recovery Docs",
    subtitle: "Looking before you delete, and writing down how to deploy and how to recover",
    estimatedMinutes: 30,
    intro:
      "A handful of commands can destroy work or data in a second: rm -rf, git clean, git reset --hard, DROP TABLE, a migration run against the wrong database. Treat each with a ritual. And write down how to deploy and how to recover, before the night you need it.",

    atoms: [
      {
        id: "a-ce-dry-run",
        title: "Dry runs before destruction",
        explain:
          "Most destructive tools offer a way to see what they would do: git clean -n, rsync --dry-run, terraform plan, a SELECT with the same WHERE clause before a DELETE. Make the dry run a habit, read its output line by line, and only then run the real thing. Here a folder has a draft note, plus a .env.production someone created.",
        terminalExercise: term("m9-dry-run", {
          goal: "See which untracked files git clean would delete.",
          accept: ["git clean -n"],
          near: [{ command: "git clean -nx", why: "That also includes ignored files. Start with the default: git clean -n." }],
          hint: "git clean -n.",
          success: "notes.txt and .env.production. .env.production is not covered by .gitignore (which ignores only .env): it is untracked, so git clean would delete the only copy, and git add . would commit its secret. Two problems found by one dry run.",
        }),
      },
      {
        id: "a-ce-clean-x",
        title: "The flag that deletes your secrets",
        explain:
          "git clean -x also deletes IGNORED files: .env, data, logs, everything .gitignore protects (add -d and it includes ignored folders such as node_modules/ and data/). It appears in many \"reset everything\" snippets, including ones AI assistants suggest. Always dry-run it.",
        terminalExercise: term("m9-dry-run", {
          goal: "See what git clean would delete if ignored files were included too.",
          accept: ["git clean -nx"],
          near: [{ command: "git clean -nX", why: "-X (capital) lists only ignored files: .env. Lowercase -x includes untracked AND ignored." }],
          hint: "git clean -n with -x.",
          success: ".env, .env.production and notes.txt: both files of secrets, gone if run without -n. The capital -X variant lists only .env. Neither listed data/ or node_modules/, because folders need -d.",
        }),
      },
      {
        id: "a-ce-migrations",
        title: "Database migrations",
        explain:
          "A migration is a script that changes a database's structure (add a column, rename a table) or transforms its data, run once per environment, in order. Migrations against production are among the riskiest changes there are: test them on a copy first, back up before running, prefer additive changes (add a column, backfill, switch, then remove the old one later) over destructive ones, and know how to reverse each step.",
        decision: {
          scenario: "A migration renames orders.total to orders.amount. The new code reads amount; the old code, still running on some servers during the deploy, reads total.",
          question: "What is the safe approach?",
          options: [
            { id: "a", text: "Expand and contract: add amount, write both, backfill, switch reads to amount, and only after every server runs the new code, drop total", why: "Each step is safe while old and new code coexist, and each can be reversed." },
            { id: "b", text: "Rename the column and deploy at the same moment", whyWrong: "During the deploy, old servers crash reading a column that no longer exists." },
            { id: "c", text: "Drop the table and recreate it", whyWrong: "Destroys the data." },
            { id: "d", text: "Run it first in production to see what happens", whyWrong: "Test on a copy first." },
          ],
          correct: "a",
          aftermath: "Additive first; destructive last, and only once nothing depends on the old shape.",
        },
      },
      {
        id: "a-ce-agent-perms",
        title: "Reviewing what automated agents may run",
        explain:
          "An AI agent with a terminal can run the same destructive commands you can, faster and without hesitation. Review its permission settings like a security policy: destructive commands (rm -rf, git clean -x, git reset --hard, git push --force, DROP, migrations) must ask or be denied; production credentials must not be reachable from where it runs; and its command log should be readable afterwards.",
        decision: {
          scenario: "An agent, asked to \"clean up the build so the tests run fresh\", proposes: git clean -xdf && npm ci.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Refuse as written: -x deletes ignored files including .env and data/; propose rm -rf dist (the build output only) or a dry run with -n first", why: "The agent's goal was reasonable; its command would delete local secrets and data along the way." },
            { id: "b", text: "Approve: the agent knows what it is doing", whyWrong: "It knows the common snippet, not your .env." },
            { id: "c", text: "Approve, because npm ci reinstalls everything", whyWrong: "npm ci restores dependencies, not .env or data." },
            { id: "d", text: "Turn off approvals so it stops asking", whyWrong: "The approval just saved your secrets." },
          ],
          correct: "a",
          aftermath: "Read every destructive command an agent proposes, flag by flag.",
        },
      },
      {
        id: "a-ce-runbook",
        title: "Documenting deployment and recovery",
        explain:
          "A runbook is a written procedure for an operational task. A deployment runbook says how a release reaches production: the checks, the command or pipeline, how to verify it worked. A recovery runbook says what to do when it did not: how to roll back to the previous release, restore data from backup, rotate a leaked secret, and who to tell. Write them while calm, test them, and keep them in the repository.",
        example:
          "# Runbook: deploy the API\n1. main is green in CI (lint, test, build).\n2. Tag the release: git tag -a v1.2.0 -m \"...\" && git push --tags\n3. Host deploys the tag; it needs SESSION_SECRET, PAYSTACK_SECRET_KEY,\n   DATA_FILE, PORT set in its settings.\n4. Verify: curl -s https://api.kobo.example/api/products returns products;\n   sign in as the test account; place a test order with a test key.\n\n# Recovery\n- Bad release: redeploy the previous tag (git tag -n lists them).\n- Data: restore data/kobo.json from last night's backup (backups/ on the host).\n- Leaked secret: rotate it in the host settings; revoke the old key with Paystack.",
        decision: {
          scenario: "Production is down at 2 a.m. The person on call joined last week.",
          question: "What makes the difference?",
          options: [
            { id: "a", text: "A tested recovery runbook in the repository: how to roll back, restore and rotate, step by step", why: "At 2 a.m. nobody should be designing a procedure from scratch." },
            { id: "b", text: "Calling the developer who left", whyWrong: "They may not answer, and should not need to." },
            { id: "c", text: "Asking an AI to fix production live", whyWrong: "Unreviewed changes to production, under pressure." },
            { id: "d", text: "Waiting for morning", whyWrong: "Customers are affected now." },
          ],
          correct: "a",
          aftermath: "Write the runbook before you need it; test it before you trust it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 9.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l59-deploy-fails",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["9.P"],
    title: "Practical: It Works Locally, But Fails After Deployment",
    subtitle: "Configuration, build output, versions and logs, investigated without exposing secrets",
    estimatedMinutes: 38,
    intro:
      "Kobo Market has just been deployed to a new host. The API will not start, and once it does the frontend cannot find it. On your laptop everything works. Investigate the four usual suspects: configuration, build output, versions and logs, without printing a secret or touching production data.",

    atoms: [
      {
        id: "a-ce-p9-start",
        title: "Suspect 1: configuration",
        explain:
          "Reproduce the server's situation locally: no .env file, only what the host provides. The host here sets PORT and nothing else.",
        terminalExercise: term("m9-deploy", {
          intro: "This copy has no .env, like the new host. The host sets PORT=4100.",
          goal: "Start the API the way the host does, and read why it fails.",
          accept: ["PORT=4100 npm start"],
          near: [{ command: "npm pkg get engines", why: "That is suspect 3. Start with configuration: start it as the host does." }],
          hint: "PORT=4100 in front of npm start.",
          success: "SESSION_SECRET is not set. Locally it came from .env; the host was never given it. The fix is in the host's settings, not the code: and you found it without ever printing the secret.",
        }),
      },
      {
        id: "a-ce-p9-config-list",
        title: "The full configuration checklist",
        explain:
          "Fixing one missing variable at a time means one failed deploy per variable. Compare the complete list the code reads (Module 2: server/config.js) and the documented list (.env.example) with what the host has, by NAME only: never print values.",
        decision: {
          scenario: "You need to know which variables the host is missing, without exposing values.",
          question: "Which approach is safe?",
          options: [
            { id: "a", text: "List the variable NAMES the code needs (from config.js and .env.example) and compare with the names set in the host's dashboard", why: "Names reveal nothing; comparing them finds every gap at once." },
            { id: "b", text: "Add console.log(process.env) to the server and redeploy", whyWrong: "That prints every secret into the production logs." },
            { id: "c", text: "Copy your local .env to the server", whyWrong: "Development secrets in production, and test keys where live ones belong." },
            { id: "d", text: "Paste the host's settings into an AI chat", whyWrong: "Secrets leaving their system." },
          ],
          correct: "a",
          aftermath: "Compare names, never values.",
        },
      },
      {
        id: "a-ce-p9-build",
        title: "Suspect 2: the build output",
        explain:
          "With the API running, the deployed frontend still cannot load products. The frontend and the API are on different domains on this host. What URL does the built bundle request?",
        terminalExercise: term("m9-deploy", {
          intro: "The frontend was built with no VITE_API_URL.",
          goal: "Find out how the built bundle refers to the products API.",
          accept: ['rg -o -F "api/products" dist/assets'],
          near: [{ command: "npm run build 2>&1 | tail -n 3", why: "That builds it. Now search the built bundle for the API path." }],
          hint: "rg -o -F for api/products in dist/assets.",
          success: "Only the relative path /api/products, because VITE_API_URL was empty at build time. On a separate domain that points at the frontend's own host, not the API: rebuild with VITE_API_URL set (or serve both from one domain with a proxy).",
        }),
      },
      {
        id: "a-ce-p9-versions",
        title: "Suspect 3: versions",
        explain:
          "The start script uses --env-file-if-exists, which older Node versions do not recognise; a host defaulting to an older Node would fail before your code even runs. The project should declare the version it needs, and the host (or the Dockerfile) should use it.",
        terminalExercise: term("m9-deploy", {
          goal: "Check whether the project declares which Node version it needs.",
          accept: ["npm pkg get engines"],
          near: [{ command: "node --version", why: "That is your laptop's version (24). The question is what the project declares for any machine." }],
          hint: "npm pkg get engines.",
          success: "{} again (Module 3 flagged it). Add \"engines\": { \"node\": \">=24\" } and set Node 24 on the host, so a version mismatch fails loudly instead of mysteriously.",
        }),
      },
      {
        id: "a-ce-p9-plan",
        title: "Suspect 4: logs, and the safe fix",
        explain:
          "The host's logs show what this lesson reproduced locally. Put the fix together as changes that go through review, not edits on the server: settings in the host's dashboard, a rebuild, a version declaration.",
        decision: {
          scenario: "You have found: SESSION_SECRET missing on the host; VITE_API_URL empty at build time; no Node version declared.",
          question: "Which plan fixes it safely?",
          options: [
            { id: "a", text: "Set SESSION_SECRET (a new value) and VITE_API_URL in the host's settings; add engines to package.json and the deploy runbook in a reviewed PR; redeploy; verify with the runbook's checks", why: "Configuration in configuration, code changes through review, verification by evidence, and nothing secret printed or committed." },
            { id: "b", text: "SSH into the server and edit files until it works", whyWrong: "Untracked changes, lost on the next deploy." },
            { id: "c", text: "Commit a .env with the production values", whyWrong: "Secrets in Git." },
            { id: "d", text: "Hard-code the API URL and secret in the code", whyWrong: "Secrets in code, and configuration that cannot change per environment." },
          ],
          correct: "a",
          aftermath: "Works locally, fails remotely: compare environments, not code.",
        },
      },
    ],

    task: {
      title: "Module practical: it works locally but fails after deployment",
      intro:
        "Deploy a small application of yours to a free host (or a Docker container), and deliberately leave out one environment variable and one build-time setting. Then diagnose it as if you had not.",
      prompts: [
        "The symptom, as a user would report it.",
        "Configuration: the variable names the code needs versus those the host has (names only).",
        "Build output: what the deployed bundle actually contains for API URLs (a search of dist/).",
        "Versions: the runtime the host uses versus what the project declares (and add the declaration).",
        "Logs: the host's log lines that confirm each finding.",
        "The fix, made through reviewed changes and host settings, never by editing the server by hand.",
        "A deployment and recovery runbook for the application, tested once.",
      ],
      closing: "Next module: advanced workflows that keep all of this manageable as projects and AI-generated changes grow.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
