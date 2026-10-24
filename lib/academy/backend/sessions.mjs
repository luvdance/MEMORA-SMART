/**
 * BACKEND ENGINEERING — THE RECORDED TERMINAL SESSIONS
 *
 * Each session creates `files` in a fresh project folder and runs `commands`
 * in order in bash (scripts/beRecord.mjs). A command is a string, or
 * { cmd, background, ready, files, stdin, cwd, env, show }: `background`
 * starts a server and keeps it running while later commands talk to it
 * (`ready` is a regex its output must match first); `files` are written just
 * before the command runs; `show` is how the command appears at the prompt
 * when that differs from what ran.
 */
import * as P from "../../../src/academy/data/lessons/be-projects.js";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

export const SESSIONS = [
  {
    id: "w1-http",
    project: "hello-web",
    files: { "server.js": P.W1_SERVER },
    commands: [
      { cmd: "node server.js", background: true, ready: /Listening/ },
      "curl -v http://localhost:3000/",
      "curl -i http://localhost:3000/api/courses",
      "curl -i http://localhost:3000/nope",
    ],
  },
  {
    id: "w1-dns",
    project: "hello-web",
    files: { "lookup.js": P.W1_LOOKUP },
    commands: [
      "node lookup.js example.com",
      "node lookup.js localhost",
      "node lookup.js no-such-site.example",
      "curl -sI http://example.com",
      "curl -sI https://example.com",
    ],
  },
  {
    id: "w3-fetch",
    project: "public-api",
    files: {
      "package.json": json({ name: "public-api", version: "1.0.0", type: "module" }),
      "fetch-users.js": P.W3_FETCH_USERS,
      "fetch-missing.js": P.W3_FETCH_MISSING,
      "fetch-down.js": P.W3_FETCH_DOWN,
    },
    commands: ["node fetch-users.js", "node fetch-missing.js", "node fetch-down.js"],
  },

  /* ── Week 5 ─────────────────────────────────────────────────────────── */
  {
    id: "w5-node",
    project: "hello-node",
    files: {
      "hello.js": 'console.log("Hello from Node.js", process.version);\n',
      "blocking.js":
        'const start = Date.now();\nsetTimeout(() => console.log(`timer fired after ${Date.now() - start} ms`), 100);\n// A busy loop: nothing else can run until it ends.\nwhile (Date.now() - start < 1000) {}\nconsole.log("loop finished");\n',
    },
    commands: [
      "node hello.js",
      "node -p \"process.versions.v8\"",
      "node -p \"process.platform + ' ' + process.arch\"",
      "node -p \"typeof window\"",
      "node blocking.js",
    ],
  },

  /* ── Week 4 ─────────────────────────────────────────────────────────── */
  {
    id: "w4-terminal",
    project: "course-api",
    files: {
      "package.json": P.W4_PACKAGE,
      "server.js": P.W4_SERVER,
      "src/routes/courses.js": P.W4_ROUTES,
      "data/courses.json": P.W4_COURSES_JSON,
      "notes.txt": P.W4_NOTES,
    },
    commands: [
      "pwd",
      "ls",
      "ls -a",
      "ls src/routes",
      "cat data/courses.json",
      "mkdir -p src/middleware",
      "touch src/middleware/logger.js",
      "ls -R src",
      "cp notes.txt notes-copy.txt",
      "mv notes-copy.txt ideas.txt",
      "ls *.txt",
      "rm ideas.txt",
      "find . -name \"*.js\"",
      "cd src/routes && pwd",
      "cd .. && pwd",
      "head -n 4 server.js",
      "grep -n listen server.js",
      "echo \"PORT=3000\" > .env",
      "cat .env",
    ],
  },
  {
    id: "w4-npm",
    project: "course-api",
    files: { "server.js": P.W4_SERVER, "src/routes/courses.js": P.W4_ROUTES, "data/courses.json": P.W4_COURSES_JSON },
    commands: [
      "node --version",
      "npm --version",
      "npm init -y",
      "npm pkg set type=module",
      "npm install express",
      "cat package.json",
      "npm install --save-dev prettier",
      "npm ls",
      "npm pkg set scripts.start=\"node server.js\"",
      { cmd: "npm start", background: true, ready: /Course API on/ },
      "curl -s http://localhost:3000/courses",
      "npm view express version",
    ],
  },
  {
    id: "w4-git",
    project: "course-api",
    files: {
      "package.json": P.W4_PACKAGE,
      "server.js": P.W4_SERVER,
      "src/routes/courses.js": P.W4_ROUTES,
      "data/courses.json": P.W4_COURSES_JSON,
      "README.md": P.W4_README,
      ".gitignore": P.W4_GITIGNORE,
    },
    commands: [
      "git init",
      "git status",
      "git add .",
      "git status --short",
      "git commit -m \"Create the course API\"",
      "git log --oneline",
      "git switch -c feature/course-search",
      { cmd: "git diff", files: { "src/routes/courses.js": P.W4_ROUTES_SEARCH } },
      "git commit -am \"Add search to GET /courses\"",
      "git log --oneline --all",
      "git switch main",
      "git merge feature/course-search",
      "git log --oneline --graph",
      "git branch -d feature/course-search",
      "git branch",
    ],
  },
  {
    id: "w4-conflict",
    project: "course-api",
    files: {
      "package.json": P.W4_PACKAGE,
      "server.js": P.W4_SERVER,
      "src/routes/courses.js": P.W4_ROUTES,
      "data/courses.json": P.W4_COURSES_JSON,
      ".gitignore": P.W4_GITIGNORE,
    },
    commands: [
      "git init -q -b main && git add . && git commit -qm \"Create the course API\"",
      "git switch -c fix/port",
      { cmd: "git commit -qam \"Read the port from PORT\"", files: { "server.js": P.W4_SERVER_PORT_ENV } },
      "git switch main",
      { cmd: "git commit -qam \"Listen on port 8080\"", files: { "server.js": P.W4_SERVER_PORT_8080 } },
      "git merge fix/port",
      "git status",
      "cat server.js",
      { cmd: "git add server.js", files: { "server.js": P.W4_SERVER_RESOLVED } },
      "git commit --no-edit",
      "git log --oneline --graph",
    ],
  },
  {
    id: "w4-remote",
    project: "course-api",
    files: { "package.json": P.W4_PACKAGE, "server.js": P.W4_SERVER, "README.md": P.W4_README, ".gitignore": P.W4_GITIGNORE },
    commands: [
      "git init -q -b main && git add . && git commit -qm \"Create the course API\"",
      "git init --bare ../course-api-origin.git",
      "git remote add origin ../course-api-origin.git",
      "git remote -v",
      "git push -u origin main",
      "git clone ../course-api-origin.git ../teammate",
      "cd ../teammate && echo \"Run it with npm start.\" >> README.md && git commit -qam \"Explain how to start the API\" && git push",
      "git pull",
      "git log --oneline",
    ],
  },
  {
    id: "w4-secrets",
    project: "course-api",
    files: { "package.json": P.W4_PACKAGE, "server.js": P.W4_SERVER, ".env": P.W4_ENV_LEAK },
    commands: [
      "git init -q -b main && git add . && git commit -qm \"Create the course API\"",
      "git log --stat --oneline",
      "git rm --cached .env",
      { cmd: "git add .gitignore && git commit -qm \"Stop tracking .env\"", files: { ".gitignore": P.W4_GITIGNORE } },
      "git status --short",
      "ls -a",
      "git show HEAD~1:.env",
    ],
  },
  {
    id: "w4-lint",
    project: "course-api",
    files: {
      "package.json": P.W4_PACKAGE.replace('"start": "node server.js"', '"start": "node server.js",\n    "lint": "eslint .",\n    "format": "prettier --write ."'),
      "server.js": P.W4_MESSY,
      "eslint.config.js": P.W4_ESLINT_CONFIG,
    },
    commands: [
      "npm install --save-dev eslint @eslint/js globals prettier",
      "npx prettier --check .",
      "npx eslint .",
      "npx prettier --write server.js",
      "cat server.js",
      { cmd: "npm run lint", files: { "server.js": P.W4_TIDY } },
    ],
  },
];
