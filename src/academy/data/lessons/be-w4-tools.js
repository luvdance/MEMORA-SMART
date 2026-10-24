/**
 * BACKEND ENGINEERING · WEEK 4 · DEVELOPER TOOLS, GIT AND GITHUB
 *
 * Curriculum 4.1 – 4.P. The command line, files, paths and permissions,
 * Node.js and npm, package.json, Git (commits, branches, merges, conflicts),
 * GitHub (remotes, pull requests, issues, READMEs), .gitignore and secrets,
 * formatting and linting, four exercises and a well-documented repository.
 *
 * Every terminal is a RECORDED session (scripts/beRecord.mjs): real bash,
 * real git, real npm, ESLint and Prettier on a real project. GitHub is
 * played by a bare repository on the same machine, which git talks to
 * exactly as it talks to GitHub, so no account is needed. Labs check the
 * files a repository is made of: package.json, a resolved conflict, a
 * .gitignore (matched by Git's own rules), a README.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, out, pkg, shown, shownAll, term } from "./be-helpers.js";
import * as P from "./be-projects.js";

export const SECTION_ID = "be-s4-tools";
const MODULE = "be-w4-tools";

/** The course API project as the Week 4 sessions created it. */
const PROJECT = {
  "package.json": P.W4_PACKAGE,
  "server.js": P.W4_SERVER,
  "src/routes/courses.js": P.W4_ROUTES,
  "data/courses.json": P.W4_COURSES_JSON,
};

/** server.js exactly as git left it after the conflicting merge (recorded). */
const CONFLICTED = `${out("w4-conflict", "cat server.js")}\n`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 4.1 – 4.2 · THE COMMAND LINE, FILES, PATHS, PERMISSIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l25-terminal",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2"],
    title: "The Command Line, Files, Paths and Permissions",
    subtitle: "Working the way servers are worked",
    estimatedMinutes: 55,
    intro:
      "Servers have no desktop. You reach them through a terminal, and most backend tools (Node, npm, Git, Docker, psql) are commands. This lesson makes the terminal comfortable. These sessions were recorded in bash, which you have on macOS and Linux, and on Windows through Git Bash or WSL.",
    atoms: [
      {
        id: "a-be-terminal-navigation",
        title: "Terminal navigation",
        explain:
          "A terminal runs a SHELL (bash or zsh) that reads a command, runs it in the CURRENT DIRECTORY, prints its output and shows the prompt again. The prompt ada@laptop:~/course-api$ says who, which machine and where (~ is your home folder). pwd prints where you are; ls lists what is here (ls -a includes hidden files, whose names start with a dot, such as .env and .git); cd src moves into src, cd .. goes up one level, cd ~ goes home. Press Tab to complete names and the up arrow for previous commands. Every command reads the same way: the program, then options (-a, --all), then arguments.",
        example: shownAll("w4-terminal", ["pwd", "ls", "ls src/routes", "cd src/routes && pwd"]),
        terminalExercise: term("w4-terminal", {
          only: ["pwd", "ls", "ls -a", "ls src/routes", "ls -R src", "cd src/routes && pwd"],
          goal: "List everything in the project folder, including the hidden files.",
          accept: ["ls -a"],
          near: [{ command: "ls", why: "ls hides names starting with a dot. Add the option that shows all." }],
          hint: "ls with -a (all).",
          success: ". is this folder, .. is its parent. In a real project you would also see .env, .git and .gitignore here: hidden, not secret.",
        }),
      },
      {
        id: "a-be-files",
        title: "Working with files and folders",
        explain:
          "The everyday file commands: mkdir -p src/middleware creates folders (with every missing parent); touch file creates an empty file; cp copies; mv moves or renames; rm deletes, for good, with no recycle bin (rm -r for folders: double-check before pressing Enter). cat prints a file; head -n 4 its first lines; grep -n text file finds lines containing text, with their numbers; find . -name \"*.js\" finds files by name below the current folder. echo \"PORT=3000\" > .env writes a line into a file (> replaces it, >> appends).",
        example: shownAll("w4-terminal", ["mkdir -p src/middleware", "touch src/middleware/logger.js", "ls -R src", "grep -n listen server.js"]),
        terminalExercise: term("w4-terminal", {
          only: ["cat data/courses.json", "head -n 4 server.js", "grep -n listen server.js", "find . -name \"*.js\"", "ls -R src"],
          goal: "Find every JavaScript file in the project, in every folder.",
          accept: ["find . -name \"*.js\""],
          near: [{ command: "ls -R src", why: "That lists everything under src, but not only .js files and not server.js." }],
          hint: "find, starting at . (here), matching the name pattern \"*.js\".",
          success: "Three files in three folders. find searches the whole tree; quote the pattern so the shell does not expand *.js itself.",
        }),
      },
      {
        id: "a-be-paths",
        title: "Paths",
        explain:
          "A PATH names a file. An ABSOLUTE path starts at the root: /home/ada/course-api/server.js. A RELATIVE path starts from the current directory: data/courses.json, ./server.js (. is here), ../teammate (.. is the parent). Windows uses C:\\Users\\ada and backslashes; Node's path module handles both. The trap for backend code: a relative path in fs.readFileSync(\"data/courses.json\") is relative to the folder you RAN node from (process.cwd()), not to the file containing the code. Run the server from another folder and it cannot find its data. Build paths from the module's own location instead: path.join(import.meta.dirname, \"data\", \"courses.json\") in ES modules (__dirname in CommonJS).",
        decision: decide({
          scenario: "server.js reads readFileSync(\"data/courses.json\"). It works with node server.js in the project folder, but the deployment runs node /srv/app/server.js from the root folder, and the server crashes with ENOENT.",
          question: "What is the fix?",
          right: ["Build the path from the module's own folder: path.join(import.meta.dirname, \"data\", \"courses.json\")", "Then it does not matter where node is run from."],
          wrong: [
            ["Tell operations to always cd into the folder first", "Fragile: the code should not depend on it."],
            ["Use an absolute path such as C:/Users/ada/course-api/data/courses.json", "It only exists on one laptop."],
            ["Copy the data folder to every possible working directory", "Treats the symptom."],
          ],
          at: 0,
          aftermath: "Relative to the file, not to the shell: the rule for every file a program ships with.",
        }),
      },
      {
        id: "a-be-permissions",
        title: "Permissions",
        explain:
          "On Linux and macOS every file has an owner, a group, and three permission sets: for the owner, the group and everyone else, each of read (r), write (w) and execute (x). ls -l shows them as -rw-r--r-- (owner can read and write; others can only read). chmod changes them: chmod 600 .env makes it readable and writable by its owner only, which is right for secrets on a shared server; chmod +x deploy.sh lets a script be run as ./deploy.sh. 'Permission denied' (EACCES in Node) means the user running the program lacks a permission: fix the permission or the owner, never by running the server as root. Production services run as a dedicated, unprivileged user (Week 19 does this in Docker).",
        decision: decide({
          scenario: "On a shared Linux server, the API's .env file holding the database password shows -rw-r--r-- with ls -l.",
          question: "What should you do?",
          right: ["chmod 600 .env, so only the owner (the service's user) can read it", "Others currently can read the password."],
          wrong: [
            ["chmod 777 .env, so the API can definitely read it", "Lets everyone read and change it."],
            ["Nothing: files in a project folder are private", "r-- for others means anyone on the server can read it."],
            ["Run the API as root", "Gives the process far more power than it needs."],
          ],
          at: 1,
          aftermath: "Least privilege: each user and process gets exactly the access it needs. The same idea governs database roles (Week 12) and API permissions (Week 14).",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 4.3 – 4.4 · NODE.JS, NPM AND PACKAGE.JSON
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l26-npm",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.3", "4.4"],
    title: "Node.js, npm and package.json",
    subtitle: "Installing the runtime, managing a project's packages",
    estimatedMinutes: 55,
    intro: "npm, the Node Package Manager, gives you over two million packages and runs your project's scripts. package.json is the file that describes the project to npm, to other developers and to every deployment tool.",
    atoms: [
      {
        id: "a-be-node-npm",
        title: "Installing and using Node.js and npm",
        explain:
          "Install Node.js from nodejs.org, choosing the LTS (long-term support) version, currently Node 24; it includes npm. Developers who work on several projects use a version manager (nvm, fnm, or Volta) to switch versions per project. Check the install with node --version and npm --version. npm init -y creates a package.json with defaults; npm pkg set changes a field without opening an editor. Recorded on a developer's laptop:",
        example: shownAll("w4-npm", ["node --version", "npm --version", "npm init -y"]),
        terminalExercise: term("w4-npm", {
          only: ["node --version", "npm --version", "npm init -y", "npm pkg set type=module"],
          goal: "Turn the folder into an npm project: create its package.json.",
          accept: ["npm init -y"],
          near: [{ command: "npm pkg set type=module", why: "That changes a package.json that must exist first." }],
          hint: "npm init, accepting every default with -y.",
          success: "Notice \"type\": \"commonjs\": npm's default. The course's projects use ES modules, so the next command set type to module.",
        }),
      },
      {
        id: "a-be-npm-install",
        title: "Installing packages",
        explain:
          "npm install express downloads Express and everything it depends on into node_modules, records \"express\": \"^5.3.0\" under dependencies in package.json, and writes the exact versions of the whole tree to package-lock.json. npm install --save-dev prettier records a DEVELOPMENT dependency: needed to build and test, not to run in production (npm install --omit=dev skips them). node_modules is generated, large and machine-specific: never commit it; anyone can recreate it from package.json and package-lock.json with npm install (npm ci in automation, which installs exactly the lock file).",
        example: shownAll("w4-npm", ["npm install express", "npm install --save-dev prettier", "npm ls"]),
        terminalExercise: term("w4-npm", {
          only: ["npm install express", "cat package.json", "npm install --save-dev prettier", "npm ls", "npm view express version"],
          goal: "Show which packages the project depends on directly, with their installed versions.",
          accept: ["npm ls"],
          near: [{ command: "npm view express version", why: "That asks the registry for the latest Express; the goal is what this project has installed." }],
          hint: "npm ls lists the installed dependency tree.",
          success: "express for running and prettier for development, each at an exact installed version. 65 packages arrived in node_modules for those two.",
        }),
      },
      {
        id: "a-be-package-json",
        title: "package.json",
        explain:
          "package.json holds the project's name and version; \"type\": \"module\" (ES modules); \"main\" (the entry file); \"scripts\", the project's commands, run with npm run <name> (npm start and npm test need no run); \"dependencies\" and \"devDependencies\"; and \"engines\", the Node versions it supports. Scripts are the project's shared vocabulary: whatever the stack, npm install, npm run dev, npm test and npm start should do the obvious thing. In scripts, packages' commands are available by name (\"lint\": \"eslint .\").",
        nodeLab: {
          task:
            "Fix package.json: add the scripts \"dev\": \"node --watch server.js\", \"test\": \"vitest run\" and \"hello\": \"node hello.js\"; move vitest from dependencies to devDependencies (it is only needed to run tests); add \"engines\": { \"node\": \">=24\" }. Keep it valid JSON. The command runs npm run hello.",
          command: "npm run hello",
          files: {
            "package.json": `${JSON.stringify(
              { name: "course-api", version: "1.0.0", type: "module", scripts: { start: "node server.js" }, dependencies: { express: "^5.3.0", vitest: "^5.0.5" } },
              null,
              2
            )}\n`,
            "hello.js": 'console.log("Hello from an npm script");\n',
            "server.js": P.W4_SERVER,
          },
          readOnly: ["hello.js", "server.js"],
          open: "package.json",
          solution: {
            "package.json": `${JSON.stringify(
              {
                name: "course-api",
                version: "1.0.0",
                type: "module",
                scripts: { start: "node server.js", dev: "node --watch server.js", test: "vitest run", hello: "node hello.js" },
                dependencies: { express: "^5.3.0" },
                devDependencies: { vitest: "^5.0.5" },
                engines: { node: ">=24" },
              },
              null,
              2
            )}\n`,
          },
          tests: [
            { label: "package.json is valid JSON", check: `try { JSON.parse(file("package.json")); } catch (e) { fail("package.json is not valid JSON: " + e.message); }` },
            { label: "Scripts dev, test and hello are there; start is kept", check: `const p = JSON.parse(file("package.json")); eq(p.scripts, { start: "node server.js", dev: "node --watch server.js", test: "vitest run", hello: "node hello.js" }, "the scripts");` },
            { label: "vitest is a devDependency, express a dependency", check: `const p = JSON.parse(file("package.json")); eq(p.dependencies, { express: "^5.3.0" }, "dependencies should hold only express"); eq(p.devDependencies, { vitest: "^5.0.5" }, "devDependencies should hold vitest");` },
            { label: "engines requires Node 24 or later", check: `eq(JSON.parse(file("package.json")).engines, { node: ">=24" }, "engines");` },
            { label: "npm run hello runs the script", check: `has(stdout(), "> course-api@1.0.0 hello", "npm should announce the script"); has(stdout(), "Hello from an npm script", "the script's output");` },
          ],
          hint: "Add keys to \"scripts\", cut the vitest line into a new \"devDependencies\" object, and add \"engines\": { \"node\": \">=24\" }. Watch the commas: JSON allows none after the last item.",
          successMessage: "npm announced the script with > course-api@1.0.0 hello before running it, as it does on any machine. Every project's package.json should read this cleanly.",
        },
      },
      {
        id: "a-be-semver",
        title: "Semantic versioning",
        explain:
          "Packages are versioned MAJOR.MINOR.PATCH: a PATCH release fixes bugs, a MINOR adds features compatibly, a MAJOR may break existing code. Ranges in package.json say which updates you accept: ^5.3.0 means 5.3.0 or any later 5.x (not 6); ~5.3.0 means 5.3.x patches only; 5.3.0 exactly that. npm install picks the newest version that fits and records it in package-lock.json, so every machine installs the same tree until someone updates deliberately (npm update, npm outdated to see what is behind). Majors are upgraded on purpose, reading the release notes, with tests running (Express 4 to 5 changed how async errors and paths work).",
        decision: decide({
          scenario: "package.json has \"express\": \"^4.21.0\". Express 5.3.0 and Express 4.21.2 are both published.",
          question: "What does npm install choose?",
          right: ["4.21.2: ^ accepts minor and patch updates within major version 4, never 5", "A major version may break your code, so ^ never crosses one."],
          wrong: [
            ["5.3.0, the newest version", "^4 excludes 5.x."],
            ["Exactly 4.21.0", "That would be the exact version 4.21.0, without ^."],
            ["It asks you to choose", "The range decides."],
          ],
          at: 1,
          aftermath: "The lock file then pins 4.21.2 for everyone, until someone runs npm update or edits the range.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 4.5 · GIT: COMMITS, BRANCHES, MERGES AND CONFLICTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l27-git",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.5"],
    title: "Git: Commits, Branches, Merges and Conflicts",
    subtitle: "The history of your code, and working on it in parallel",
    estimatedMinutes: 70,
    intro:
      "Git records every change to your project as a commit, lets you work on several changes at once on branches, and merges them back. It is how every team shares code. Configure it once with git config --global user.name \"Ada Obi\", user.email, and init.defaultBranch main.",
    atoms: [
      {
        id: "a-be-git-commits",
        title: "Repositories and commits",
        explain:
          "git init turns a folder into a REPOSITORY (the history lives in .git). Git sees three places: your WORKING files, the STAGING AREA (what the next commit will contain) and the COMMITS. git status says what changed; git add puts changes in the staging area; git commit -m \"message\" records them as a commit with a unique id, your name, the time and the message. git log shows the history. Commit small, complete steps, each with a message that says WHY in the imperative: \"Add search to GET /courses\", not \"stuff\" or \"fixed it\". A good history explains the project to the next developer, often you.",
        example: shownAll("w4-git", ["git init", "git status", "git add .", "git status --short"]),
        terminalExercise: term("w4-git", {
          only: ["git init", "git status", "git add .", "git status --short", "git commit -m \"Create the course API\"", "git log --oneline"],
          goal: "Record the staged files as the project's first commit.",
          accept: ["git commit -m \"Create the course API\""],
          near: [{ command: "git add .", why: "That stages the files; the goal is to record them as a commit." }],
          hint: "git commit with a message (-m).",
          success: "(root-commit): the first commit of the history, 6 files. Its short id is unique; yours will differ, because ids depend on the content, author and time.",
        }),
      },
      {
        id: "a-be-git-branches",
        title: "Branches and merges",
        explain:
          "A BRANCH is a movable name for a line of commits. Work happens on a branch per change: git switch -c feature/course-search creates one and moves you to it; commits land there while main stays as it was. git diff shows unstaged changes line by line (- removed, + added). When the work is ready, git switch main and git merge feature/course-search bring it in. If main has not moved since the branch started, Git simply moves main forward: a FAST-FORWARD. Then git branch -d deletes the merged branch name (the commits stay).",
        example: shownAll("w4-git", ["git switch -c feature/course-search", "git diff", "git commit -am \"Add search to GET /courses\""]),
        terminalExercise: term("w4-git", {
          only: ["git switch -c feature/course-search", "git diff", "git commit -am \"Add search to GET /courses\"", "git log --oneline --all", "git switch main", "git merge feature/course-search", "git log --oneline --graph"],
          goal: "Bring the finished search feature into main (you are on main).",
          accept: ["git merge feature/course-search"],
          near: [{ command: "git switch main", why: "You are already on main. Now merge the feature branch into it." }],
          hint: "git merge, naming the branch to bring in.",
          success: "Fast-forward: main had not changed, so Git moved it to the feature's commit. The graph is a straight line.",
        }),
      },
      {
        id: "a-be-git-conflicts",
        title: "Merge conflicts",
        explain:
          "When two branches change the SAME lines, Git cannot know which version is right and stops with a CONFLICT. It writes both versions into the file between markers: <<<<<<< HEAD (your current branch's version), ======= and >>>>>>> fix/port (the incoming branch's version). Below, main changed the port to 8080 while fix/port made it read process.env.PORT. Resolving means editing the file into the version that is actually right, usually combining both intentions, deleting every marker, then git add and git commit. Never commit a file with markers in it: it does not even run.",
        example: shownAll("w4-conflict", ["git merge fix/port", "git status", "cat server.js"]),
        nodeLab: {
          task:
            "server.js is mid-merge, with conflict markers. Resolve it the way both branches intended: the port comes from process.env.PORT (fix/port), and the fallback is 8080 (main). Delete every marker. The checks start the server with and without PORT set.",
          command: "node server.js",
          files: { ...PROJECT, "server.js": CONFLICTED },
          readOnly: ["package.json", "src/routes/courses.js", "data/courses.json"],
          open: "server.js",
          solution: { "server.js": P.W4_SERVER_RESOLVED },
          requests: [{ label: "GET /courses", method: "GET", path: "/courses", port: 8080 }],
          tests: [
            { label: "No conflict markers are left", check: `const src = source("server.js"); for (const m of ["<<<<<<<", "=======", ">>>>>>>"]) lacks(src, m, "server.js still contains " + m);` },
            { label: "Without PORT, the server listens on 8080", check: `const r = await get("/courses", { port: 8080 }); eq(r.status, 200, "GET /courses on port 8080" + (r.error ? " (" + r.error + ")" : "")); has(output(), "localhost:8080", "the startup message should say 8080");` },
            { label: "With PORT=4000, it listens on 4000", check: `await run("PORT=4000 node server.js"); const r = await get("/courses", { port: 4000 }); eq(r.status, 200, "with PORT=4000 the server should listen on port 4000" + (r.error ? " (" + r.error + ")" : ""));` },
          ],
          hint: "Keep fix/port's two lines (const port = process.env.PORT || …; app.listen(port, …)) with 8080 as the fallback, and delete the HEAD line and the three marker lines.",
          successMessage: "Both intentions survived: configurable from the environment, 8080 by default. In the recorded session the next commands were git add server.js and git commit --no-edit, which recorded the merge.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 4.6 · GITHUB: REMOTES, PULL REQUESTS, ISSUES, READMES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l28-github",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.6"],
    title: "GitHub: Remotes, Pull Requests, Issues and READMEs",
    subtitle: "Sharing a repository with a team",
    estimatedMinutes: 55,
    intro:
      "GitHub hosts Git repositories and adds the team's workflow around them: pull requests for review, issues for work, READMEs for orientation. Underneath it is still Git: a REMOTE repository you push to and pull from. In the recordings, a repository on the same machine plays GitHub; git talks to it exactly as it talks to github.com.",
    atoms: [
      {
        id: "a-be-remotes",
        title: "Remotes: push, clone and pull",
        explain:
          "A REMOTE is another copy of the repository, conventionally named origin: on GitHub, https://github.com/ada/course-api.git. git remote add origin <url> connects your repository to it; git push -u origin main uploads your commits and sets main to track origin/main; a teammate gets their own copy with git clone <url>. When they push new commits, you bring them in with git pull (a fetch plus a merge). Push often, so your work is backed up and visible; pull before you start, so you build on the latest code.",
        example: shownAll("w4-remote", ["git remote add origin ../course-api-origin.git", "git push -u origin main", "git clone ../course-api-origin.git ../teammate"]),
        terminalExercise: term("w4-remote", {
          only: ["git remote -v", "git push -u origin main", "git clone ../course-api-origin.git ../teammate", "cd ../teammate && echo \"Run it with npm start.\" >> README.md && git commit -qam \"Explain how to start the API\" && git push", "git pull", "git log --oneline"],
          goal: "A teammate has pushed a commit. Bring it into your copy.",
          accept: ["git pull"],
          near: [{ command: "git log --oneline", why: "Your log does not have the teammate's commit yet: fetch and merge it first." }],
          hint: "git pull fetches from origin and merges.",
          success: "Fast-forward, README.md +1: the teammate's commit is now in your history too, with its original id.",
        }),
      },
      {
        id: "a-be-pull-requests",
        title: "Pull requests",
        explain:
          "On a team nobody pushes straight to main. You push a BRANCH and open a PULL REQUEST (PR): a request to merge it, with a description of what changed and why, and how it was tested. Teammates REVIEW the diff, comment and approve; automated checks (tests, linting: Week 15 runs them on every PR) must pass; then it is merged, often squashed into one commit. Branch protection rules on main enforce this. Keep PRs small and focused: a reviewer can check 200 lines properly, not 3,000.",
        decision: decide({
          scenario: "You finished a feature on feature/enrollments. The repository's main branch is protected.",
          question: "What is the right workflow?",
          right: ["git push -u origin feature/enrollments, open a pull request describing the change and how you tested it, wait for review and passing checks, then merge", "Review and automation before main."],
          wrong: [
            ["git push origin main from your feature branch", "Protection rejects it, and it skips review."],
            ["Email the changed files to the lead", "Git and PRs do this with history and review."],
            ["Merge locally into main and force-push", "Rewrites shared history and bypasses review."],
          ],
          at: 0,
          aftermath: "Small PR, clear description, green checks, one approval: the rhythm of professional teams.",
        }),
      },
      {
        id: "a-be-issues-readme",
        title: "Issues and README files",
        explain:
          "ISSUES track the work: bugs, features, questions. A good bug report says what you did, what you expected, what happened instead (with the error or a screenshot), and the version or environment, so someone else can reproduce it. Link PRs to issues (\"Fixes #42\" closes it on merge). The README is the repository's front page: what the project is, how to install, configure and run it, how to test it, and how to contribute. A stranger should get it running from the README alone; if they cannot, the README has a bug.",
        decision: decide({
          scenario: "Three bug reports arrive for the course API.",
          question: "Which one can a developer act on immediately?",
          right: ["\"GET /courses?q=SQL returns [] on v1.2.0. Expected Relational Databases. Steps: start the API with npm start, run curl 'localhost:3000/courses?q=SQL'.\"", "What, expected, actual, version, steps."],
          wrong: [
            ["\"Search is broken.\"", "No way to reproduce."],
            ["\"Your API is terrible, please fix everything.\"", "No information."],
            ["\"I think there might be a bug somewhere in the routes.\"", "Nothing to reproduce or check."],
          ],
          at: 2,
          aftermath: "Write the bug reports you would like to receive. Most repositories add an issue template to ask for exactly these fields.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 4.7 – 4.8 · .GITIGNORE, SECRETS, DOCS, FORMATTING, LINTING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l29-hygiene",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.7", "4.8"],
    title: ".gitignore, Secrets, Documentation, Formatting and Linting",
    subtitle: "Keeping a repository clean, safe and consistent",
    estimatedMinutes: 65,
    intro: "What does not belong in a repository matters as much as what does. And code that a whole team edits stays readable only if a machine keeps its formatting and catches its mistakes.",
    atoms: [
      {
        id: "a-be-gitignore",
        title: ".gitignore",
        explain:
          ".gitignore lists what Git must never track: generated folders (node_modules/, dist/, coverage/), logs (*.log), local secrets (.env and .env.* variants), editor and system files (.DS_Store, .idea/). Its rules: one pattern per line; # starts a comment; a trailing / matches folders only; a pattern without a slash matches that name in ANY folder (*.log ignores src/server.log too); a leading / anchors it to the project root; ! re-includes something an earlier line excluded (!.env.example keeps the example settings file, which SHOULD be committed). The checks below test your file with Git's own rules.",
        nodeLab: {
          task:
            "Write .gitignore for this project so that Git ignores: node_modules/ (and everything in it), every .env file and variant (.env, .env.local, .env.production), every .log file in any folder, the coverage/ and dist/ folders; but still tracks .env.example, the source, the tests and the docs.",
          command: false,
          files: {
            ".gitignore": "# Write the rules here, one per line.\n",
            "FILES.md":
              "Files in this project:\n\n- package.json, package-lock.json\n- server.js, src/routes/courses.js, tests/courses.test.js\n- docs/setup.md\n- .env, .env.local, .env.production, .env.example\n- node_modules/express/index.js\n- logs/app.log, npm-debug.log\n- coverage/index.html\n- dist/server.js\n",
          },
          readOnly: ["FILES.md"],
          open: ".gitignore",
          solution: { ".gitignore": "# Dependencies, rebuilt by npm install\nnode_modules/\n\n# Local configuration and secrets\n.env\n.env.*\n!.env.example\n\n# Logs\n*.log\n\n# Generated by tests and builds\ncoverage/\ndist/\n" },
          tests: [
            { label: "node_modules/ is ignored, with everything inside", check: `assert(ignored(file(".gitignore"), "node_modules/express/index.js"), "node_modules/express/index.js is not ignored");` },
            { label: "Every .env variant is ignored", check: `for (const p of [".env", ".env.local", ".env.production"]) assert(ignored(file(".gitignore"), p), p + " is not ignored: it may hold secrets");` },
            { label: "Logs, coverage/ and dist/ are ignored, in any folder", check: `for (const p of ["logs/app.log", "npm-debug.log", "coverage/index.html", "dist/server.js"]) assert(ignored(file(".gitignore"), p), p + " is not ignored");` },
            { label: ".env.example, the source, the tests and the docs are still tracked", check: `for (const p of [".env.example", "package.json", "package-lock.json", "server.js", "src/routes/courses.js", "tests/courses.test.js", "docs/setup.md"]) assert(!ignored(file(".gitignore"), p), p + " is ignored, but it belongs in the repository");` },
          ],
          hint: "node_modules/, .env, .env.* then !.env.example on the next line, *.log, coverage/, dist/.",
          successMessage: "A .gitignore that keeps secrets and generated files out while the example configuration stays in. Add it in the very first commit: an ignore rule does not remove a file Git already tracks.",
        },
      },
      {
        id: "a-be-secrets",
        title: "Secrets in Git",
        explain:
          "A SECRET is anything that grants access: database passwords, API keys, JWT signing secrets. They live in environment variables (Week 3), in .env locally and in the platform's secret settings in production, never in code and never in Git. If one is committed, deleting the file is NOT enough: git rm --cached stops tracking it, but every earlier commit still contains it, and anyone with a clone can read it, as the recording shows. Treat a committed secret as leaked: ROTATE it (change the password, revoke the key) first, then remove it from history if needed. Commit a .env.example with the variable names and harmless values instead.",
        example: shownAll("w4-secrets", ["git log --stat --oneline", "git rm --cached .env", "git add .gitignore && git commit -qm \"Stop tracking .env\"", "git status --short"]),
        terminalExercise: term("w4-secrets", {
          only: ["git log --stat --oneline", "git rm --cached .env", "git status --short", "ls -a", "git show HEAD~1:.env"],
          goal: ".env is no longer tracked. Check whether the password is really gone: show .env as it was in the commit before the latest one.",
          accept: ["git show HEAD~1:.env"],
          near: [{ command: "git status --short", why: "Status shows today's state. The question is about the history." }],
          hint: "git show <commit>:<path> prints a file as it was in a commit. HEAD~1 is the commit before the latest.",
          success: "The password is still there, readable by anyone with the repository. That is why the only safe response to a leaked secret is to rotate it.",
        }),
      },
      {
        id: "a-be-docs",
        title: "Project documentation",
        explain:
          "Documentation that lives in the repository changes with the code. The essentials: README.md (what, setup, configuration, running, testing); .env.example (every environment variable the app reads, with safe sample values and comments); CONTRIBUTING.md (branching, commit messages, how to run checks before a PR); and decision records in docs/decisions/ (Week 17) explaining WHY important choices were made. Document what a reader cannot get from the code: intent, setup, trade-offs. Do not describe each function: good names and small functions do that.",
        decision: decide({
          scenario: "A new developer joins and asks which environment variables the API needs. They are read in four different files.",
          question: "What is the best fix?",
          right: ["Read configuration in one config module, and commit a .env.example listing every variable with a sample value and a comment, referenced from the README", "One place in code, one place in docs."],
          wrong: [
            ["Send them your .env file on chat", "Shares real secrets and does not scale."],
            ["Tell them to search the code for process.env", "Every newcomer repeats the search."],
            ["Put the production values in the README", "Secrets in Git again."],
          ],
          at: 1,
          aftermath: "The .env.example is the contract between the code and whoever configures it.",
        }),
      },
      {
        id: "a-be-lint-format",
        title: "Formatting and linting",
        explain:
          "A FORMATTER (Prettier) rewrites code into one consistent layout (quotes, semicolons, indentation, line breaks), so nobody argues about style and diffs show only real changes. A LINTER (ESLint) finds likely BUGS and bad practices: unused variables, undefined names, unreachable code. They are complementary. Install both as devDependencies, configure ESLint in eslint.config.js, add scripts (lint, format), and run them before every commit (and in CI, Week 15). Below, on a real project: Prettier flags the file, ESLint finds three problems, one of them a real bug.",
        example: shownAll("w4-lint", ["npx prettier --check .", "npx prettier --write server.js", "cat server.js"]),
        terminalExercise: term("w4-lint", {
          only: ["npm install --save-dev eslint @eslint/js globals prettier", "npx prettier --check .", "npx eslint .", "npx prettier --write server.js", "npm run lint"],
          goal: "Find the likely bugs in server.js, not just its formatting.",
          accept: ["npx eslint ."],
          near: [{ command: "npx prettier --check .", why: "Prettier only checks layout. Bugs are ESLint's job." }],
          hint: "Run ESLint over the project.",
          success: "'proces' is not defined: a typo that would crash GET /health on its first request. Prettier made it pretty; ESLint found it.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 4.9 – 4.12 · EXERCISES: REPOSITORY, BRANCH, CONFLICT, README
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l30-git-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.9", "4.10", "4.11", "4.12"],
    title: "Exercises: A Repository, a Feature Branch, a Conflict and a README",
    subtitle: "The full workflow, step by step",
    estimatedMinutes: 75,
    intro: "Four exercises that together are a professional's daily workflow. Practise each here, then repeat it on your own computer with your own GitHub account.",
    atoms: [
      {
        id: "a-be-ex-create-repo",
        title: "Exercise: create a GitHub repository",
        explain:
          "To publish a local project: create an EMPTY repository on GitHub (New repository; do not add a README there if you already have one locally, or the histories will differ), copy its URL, then git remote add origin <url> and git push -u origin main. Or with GitHub's CLI: gh repo create course-api --public --source=. --push. Give it a description, add topics, and choose a licence (MIT is common for portfolios). Never push before .gitignore is in place: a pushed secret is public within seconds, and bots scan GitHub for them.",
        decision: decide({
          scenario: "Your local course-api has three commits, a README and a .gitignore. You create a GitHub repository and tick 'Add a README file'.",
          question: "What happens when you run git push -u origin main?",
          right: ["It is rejected: GitHub's main has a commit (the README) your local main does not have, so the histories have diverged", "Create the GitHub repository empty when you already have local history."],
          wrong: [
            ["It merges the two READMEs automatically", "Push never merges."],
            ["It overwrites GitHub's README silently", "Git refuses to lose commits without --force."],
            ["It works: GitHub ignores READMEs", "The README is a real commit."],
          ],
          at: 0,
          aftermath: "Fix it with git pull --rebase origin main (or recreate the GitHub repository empty) before pushing.",
        }),
      },
      {
        id: "a-be-ex-feature-branch",
        title: "Exercise: work on a feature branch",
        explain:
          "The loop for every change: pull main; create a branch named for the change (feature/course-search, fix/port); make small commits; push the branch; open a pull request; merge after review; delete the branch. Practise the first step in the recorded session: start the search feature on its own branch.",
        terminalExercise: term("w4-git", {
          only: ["git log --oneline", "git switch -c feature/course-search", "git branch", "git switch main"],
          goal: "Start the course-search feature on a new branch named feature/course-search.",
          accept: ["git switch -c feature/course-search"],
          near: [{ command: "git branch", why: "That lists branches. -c with git switch creates one and moves you to it." }],
          hint: "git switch -c <new-branch-name>.",
          success: "Switched to a new branch: commits now land on feature/course-search, and main stays untouched until the merge.",
        }),
      },
      {
        id: "a-be-ex-conflict",
        title: "Exercise: resolve a merge conflict",
        explain:
          "Reproduce a conflict on purpose: on a branch change one line and commit; on main change the same line differently and commit; merge the branch. Read Git's message, open the file, decide what the right result is, remove the markers, git add the file and git commit to finish the merge (git merge --abort gives up and restores the state before). In the recorded session you are on main, with fix/port changing the same line as main did.",
        terminalExercise: term("w4-conflict", {
          only: ["git switch main", "git merge fix/port", "git status", "cat server.js", "git log --oneline --graph"],
          goal: "Merge fix/port into main and find out which file needs your decision.",
          accept: ["git merge fix/port"],
          near: [{ command: "git log --oneline --graph", why: "The log does not show the merge yet: run it first." }],
          hint: "git merge fix/port.",
          success: "CONFLICT in server.js: both branches changed the listen line. You resolved exactly this file in Lesson 27; the graph after the merge shows both lines of history joined.",
        }),
      },
      {
        id: "a-be-ex-readme",
        title: "Exercise: write a useful README",
        explain:
          "A README that gets a stranger running has: a one-paragraph description; REQUIREMENTS (Node.js 24, PostgreSQL if needed); SETUP as copy-pasteable commands in code blocks (git clone, npm install, cp .env.example .env); CONFIGURATION, a table of environment variables; RUNNING (npm run dev, npm start) and TESTING (npm test); and the API's main endpoints or a link to its documentation. Write it in Markdown: ## headings, ```bash code blocks, | tables |.",
        nodeLab: {
          task:
            "Write README.md for the course API. It needs a # title and a description paragraph; ## Requirements mentioning Node.js 24; ## Setup with a ```bash block containing npm install and cp .env.example .env; ## Configuration with a Markdown table of the variables in .env.example; ## Running mentioning npm run dev and npm start; ## Testing mentioning npm test; ## Endpoints listing GET /courses.",
          command: false,
          files: {
            "README.md": "# Course API\n",
            ".env.example": "# Port the API listens on\nPORT=3000\n# Search results per page\nPAGE_SIZE=20\n",
            "package.json": pkg({ name: "course-api", scripts: { dev: "node --watch --env-file=.env server.js", start: "node --env-file=.env server.js", test: "vitest run" }, deps: ["express"], dev: ["vitest"] }),
          },
          readOnly: [".env.example", "package.json"],
          open: "README.md",
          solution: {
            "README.md":
              "# Course API\n\nThe academy's course catalogue as a JSON API: list and search courses.\n\n## Requirements\n\n- Node.js 24 or later\n\n## Setup\n\n```bash\ngit clone https://github.com/ada/course-api.git\ncd course-api\nnpm install\ncp .env.example .env\n```\n\n## Configuration\n\n| Variable | Meaning | Example |\n| --- | --- | --- |\n| PORT | Port the API listens on | 3000 |\n| PAGE_SIZE | Search results per page | 20 |\n\n## Running\n\n- `npm run dev` restarts the server when a file changes.\n- `npm start` runs it as in production.\n\n## Testing\n\n```bash\nnpm test\n```\n\n## Endpoints\n\n- `GET /courses` lists the courses; `GET /courses?q=sql` searches them.\n",
          },
          tests: [
            { label: "A title and a description paragraph", check: `const t = file("README.md"); assert(/^# .+/m.test(t), "start with a # title"); const intro = t.split(/^##\\s/m)[0].replace(/^# .*$/m, "").trim(); assert(intro.length >= 30, "add a description paragraph under the title");` },
            { label: "## Requirements mentions Node.js 24", check: `const s = section(file("README.md"), "Requirements"); assert(s !== null, "missing ## Requirements"); assert(/node(\\.js)?\\s*24/i.test(s), "say which Node.js version: 24");` },
            { label: "## Setup has a bash block with npm install and cp .env.example .env", check: `const s = section(file("README.md"), "Setup"); assert(s !== null, "missing ## Setup"); const block = /\`\`\`(bash|sh|shell)\\n([\\s\\S]*?)\`\`\`/.exec(s); assert(block, "put the setup commands in a \`\`\`bash code block"); has(block[2], "npm install", "the block should install dependencies"); has(block[2], "cp .env.example .env", "the block should create .env from the example");` },
            { label: "## Configuration has a table of PORT and PAGE_SIZE", check: `const s = section(file("README.md"), "Configuration"); assert(s !== null, "missing ## Configuration"); assert(/^\\|.*\\|\\s*$/m.test(s) && /^\\|\\s*-{3,}/m.test(s), "use a Markdown table (| … | with a | --- | row)"); has(s, "PORT", "the table should list PORT"); has(s, "PAGE_SIZE", "the table should list PAGE_SIZE");` },
            { label: "Running, Testing and Endpoints sections", check: `const t = file("README.md"); const running = section(t, "Running"); assert(running && running.includes("npm run dev") && running.includes("npm start"), "## Running should mention npm run dev and npm start"); const test = section(t, "Testing"); assert(test && test.includes("npm test"), "## Testing should mention npm test"); const ep = section(t, "Endpoints"); assert(ep && ep.includes("GET /courses"), "## Endpoints should list GET /courses");` },
          ],
          hint: "Use ## headings with exactly those names. Code blocks start with ```bash on its own line and end with ```; tables need a header row and a | --- | --- | row.",
          successMessage: "Someone who has never seen the project can now clone it, configure it, run it and test it. That is the bar for every repository in your portfolio.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 4.P · DELIVERABLE: A WELL-DOCUMENTED REPOSITORY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l31-repository",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["4.P"],
    title: "Deliverable: A Well-Documented Repository",
    subtitle: "The repository a reviewer is glad to open",
    estimatedMinutes: 90,
    intro:
      "This week's deliverable is a repository: your Week 2 or Week 3 project, published on GitHub with a clean history, the right files ignored, secrets nowhere, consistent formatting and documentation a stranger can follow.",
    atoms: [
      {
        id: "a-be-commit-history",
        title: "A meaningful commit history",
        explain:
          "A reviewer reads your history before your code. Meaningful history: each commit is one coherent change that leaves the project working; messages are imperative and say why (\"Add pagination to GET /courses\", \"Fix off-by-one in completion rounding\"); work happens on branches merged through PRs. Avoid 'WIP', 'fix', 'asdf', giant 'final version' commits, committed node_modules or .env, and 'fix typo in previous commit' chains (amend or squash them before pushing).",
        decision: decide({
          scenario: "Four candidates' histories for the same project.",
          question: "Which one shows a professional workflow?",
          right: ["Create project skeleton · Add course listing endpoint · Validate course input with zod · Add tests for course routes · Document setup in README", "Small, working, explained steps."],
          wrong: [
            ["final · final2 · final FINAL · fix", "Says nothing."],
            ["Initial commit (412 files, including node_modules)", "One giant commit with generated files."],
            ["wip · wip · wip · added stuff · Merge branch 'main' · wip", "Unreadable."],
          ],
          at: 0,
          aftermath: "Five commits that tell the project's story. git log --oneline should read like a changelog.",
        }),
      },
      {
        id: "a-be-w4-deliverable",
        title: "Make the repository ready to publish",
        explain:
          "Before the first push, the repository's files must be right: a .gitignore that keeps node_modules, every .env and logs out; a .env.example with every variable; package.json with real scripts (start, dev, test, lint, format) and engines; a README a stranger can follow; and no secret anywhere in the files. The project below is almost ready. Fix what is missing.",
        nodeLab: {
          task:
            "Get the project ready to publish. .gitignore must ignore node_modules/, .env (and variants, keeping .env.example) and *.log. Create .env.example with PORT and DATABASE_URL (a harmless sample URL, not the real password). package.json needs scripts start, dev, test, lint and format, and engines node >=24. server.js must read the database URL from process.env.DATABASE_URL, not contain it. README.md needs ## Setup and ## Configuration sections.",
          command: false,
          files: {
            ".gitignore": "node_modules/\n",
            ".env": "PORT=3000\nDATABASE_URL=postgres://academy:Real-Pa55word@db.academy.example:5432/academy\n",
            ".env.example": "",
            "package.json": `${JSON.stringify({ name: "course-api", version: "1.0.0", type: "module", scripts: { start: "node server.js" }, dependencies: { express: "^5.3.0", pg: "^8.23.1" }, devDependencies: { eslint: "^10.13.0", prettier: "^3.9.10", vitest: "^5.0.5" } }, null, 2)}\n`,
            "server.js":
              'import express from "express";\nimport pg from "pg";\n\nconst pool = new pg.Pool({ connectionString: "postgres://academy:Real-Pa55word@db.academy.example:5432/academy" });\nconst app = express();\napp.get("/courses", async (req, res) => res.json((await pool.query("SELECT * FROM courses")).rows));\napp.listen(process.env.PORT || 3000);\n',
            "README.md": "# Course API\n\nThe academy's course catalogue.\n",
          },
          open: ".gitignore",
          solution: {
            ".gitignore": "node_modules/\n.env\n.env.*\n!.env.example\n*.log\n",
            ".env.example": "# Port the API listens on\nPORT=3000\n# PostgreSQL connection (use your own local database)\nDATABASE_URL=postgres://academy:change-me@localhost:5432/academy\n",
            "package.json": `${JSON.stringify(
              {
                name: "course-api",
                version: "1.0.0",
                type: "module",
                scripts: { start: "node --env-file=.env server.js", dev: "node --watch --env-file=.env server.js", test: "vitest run", lint: "eslint .", format: "prettier --write ." },
                dependencies: { express: "^5.3.0", pg: "^8.23.1" },
                devDependencies: { eslint: "^10.13.0", prettier: "^3.9.10", vitest: "^5.0.5" },
                engines: { node: ">=24" },
              },
              null,
              2
            )}\n`,
            "server.js":
              'import express from "express";\nimport pg from "pg";\n\nconst pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });\nconst app = express();\napp.get("/courses", async (req, res) => res.json((await pool.query("SELECT * FROM courses")).rows));\napp.listen(process.env.PORT || 3000);\n',
            "README.md":
              "# Course API\n\nThe academy's course catalogue.\n\n## Setup\n\n```bash\nnpm install\ncp .env.example .env\n```\n\nThen edit .env with your own database URL.\n\n## Configuration\n\n| Variable | Meaning |\n| --- | --- |\n| PORT | Port the API listens on |\n| DATABASE_URL | PostgreSQL connection string |\n",
          },
          tests: [
            { label: ".gitignore keeps node_modules, every .env and logs out, and .env.example in", check: `const g = file(".gitignore"); for (const p of ["node_modules/pg/index.js", ".env", ".env.local", "server.log"]) assert(ignored(g, p), p + " is not ignored"); assert(!ignored(g, ".env.example"), ".env.example must stay in the repository");` },
            { label: ".env.example lists PORT and DATABASE_URL, without the real password", check: `const e = file(".env.example"); assert(/^PORT=/m.test(e), ".env.example should list PORT"); assert(/^DATABASE_URL=/m.test(e), ".env.example should list DATABASE_URL"); lacks(e, "Real-Pa55word", ".env.example contains the real password");` },
            { label: "package.json has start, dev, test, lint and format, and engines node >=24", check: `const p = JSON.parse(file("package.json")); for (const s of ["start", "dev", "test", "lint", "format"]) assert(p.scripts?.[s], "add the script " + s); eq(p.engines?.node, ">=24", "engines.node");` },
            { label: "No secret in any file that will be committed", check: `const g = file(".gitignore"); for (const [name, text] of Object.entries(files())) { if (ignored(g, name)) continue; lacks(text, "Real-Pa55word", name + " contains the real database password"); }` },
            { label: "server.js reads DATABASE_URL from the environment", check: `has(source("server.js"), "process.env.DATABASE_URL", "server.js should use process.env.DATABASE_URL");` },
            { label: "README.md has ## Setup and ## Configuration", check: `const t = file("README.md"); assert(section(t, "Setup"), "add a ## Setup section"); assert(section(t, "Configuration"), "add a ## Configuration section");` },
          ],
          hint: "Every file that is not ignored will be published: search them all for the password. The real value stays only in .env, which .gitignore must exclude.",
          successMessage: "Ready to publish: secrets out, configuration documented, scripts in place. Now do it for real with the task below.",
        },
      },
    ],
    task: {
      title: "Week 4 deliverable: a well-documented GitHub repository",
      intro: "Publish one of your projects as a repository a reviewer is glad to open.",
      prompts: [
        "Install Git, run git config --global user.name, user.email and init.defaultBranch main, and create a GitHub account if you do not have one.",
        "Take your Week 2 command-line application (or Week 3 report), add .gitignore, .env.example, scripts for lint and format with ESLint and Prettier, and a README that passes this lesson's checks.",
        "Build its history in small commits with meaningful messages, including at least one feature developed on a branch and merged, and one merge conflict you resolved.",
        "Create an empty repository on GitHub, push to it, open a pull request from a feature branch (even to yourself), and merge it.",
        "Checkpoint: your repository has a clean history of small commits, a merged feature branch, a resolved conflict, no secrets, and a README that gets a stranger running.",
      ],
      closing: "Next: Phase 2 begins. Week 5, Node.js itself: its runtime, core modules, files, streams and your first server built from scratch.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
