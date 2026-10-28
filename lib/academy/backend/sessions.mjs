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
import { ACADEMY } from "../../../src/academy/data/lessons/db-helpers.js";

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
  {
    id: "w10-psql",
    project: "academy-db",
    postgres: true,
    files: { "academy.sql": `${ACADEMY}\n` },
    commands: [
      "psql --version",
      "createdb academy",
      "psql -l",
      "psql -d academy -f academy.sql",
      'psql -d academy -c "\\dt"',
      'psql -d academy -c "\\d enrollments"',
      'psql -d academy -c "\\conninfo"',
      'psql -d academy -c "SELECT code, title, price FROM courses ORDER BY price DESC;"',
      'psql -d academy -c "SELECT count(*) FROM enrollments;"',
      'psql -d academy -c "SELECT * FROM course;"',
    ],
  },
  {
    id: "w10-roles",
    project: "academy-db",
    postgres: true,
    files: { "academy.sql": `${ACADEMY}\n`, "roles.sql": P.W10_ROLES },
    commands: [
      // A fresh academy (w10-psql made one on the same server), loaded quietly: shown as the createdb it starts with.
      { cmd: "dropdb --if-exists academy && createdb academy && psql -q -d academy -f academy.sql", show: "createdb academy" },
      "psql -d academy -f roles.sql",
      { cmd: 'psql -U academy_app -d academy -c "SELECT count(*) FROM students;"', env: { PGPASSWORD: "app-password" } },
      { cmd: 'psql -U academy_app -d academy -c "INSERT INTO students (full_name, email, city, joined_on) VALUES (\'Musa Bello\', \'musa@example.com\', \'Kano\', \'2026-06-01\');"', env: { PGPASSWORD: "app-password" } },
      { cmd: 'psql -U academy_app -d academy -c "DROP TABLE payments;"', env: { PGPASSWORD: "app-password" } },
      { cmd: 'psql -U academy_app -d academy -c "SELECT * FROM course_report;"', env: { PGPASSWORD: "app-password" } },
      { cmd: 'psql -U reporting -d academy -c "SELECT * FROM course_report;"', env: { PGPASSWORD: "reporting-password" } },
      { cmd: 'psql -U reporting -d academy -c "SELECT email FROM students LIMIT 1;"', env: { PGPASSWORD: "reporting-password" } },
    ],
  },
  {
    // Prisma 7.10.1 (the version the labs run). Its "update available" box is hidden: the npm registry's
    // latest tag points at a release candidate, which a learner following the course would not install.
    id: "w11-prisma",
    project: "course-api",
    postgres: true,
    posixPaths: true,
    env: { PRISMA_HIDE_UPDATE_MESSAGE: "1", CHECKPOINT_DISABLE: "1" },
    files: { "package.json": json({ name: "course-api", version: "1.0.0", type: "module", scripts: { start: "node src/main.ts" } }) },
    commands: [
      "npm install --save-dev prisma@7.10.1",
      "npm install @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 dotenv@18.0.9",
      "npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills",
      "ls -a",
      "cat prisma7.config.ts",
      "cat .env",
      {
        cmd: "npx prisma migrate dev --name init",
        files: { "prisma/schema.prisma": P.W11_SCHEMA, ".env": 'DATABASE_URL="postgresql://ada:ada-password@localhost:5432/course_api"\n' },
      },
      "ls prisma/migrations",
      "cat prisma/migrations/migration_lock.toml",
      "cat .gitignore",
      "cat prisma/migrations/*_init/migration.sql",
      "npx prisma generate",
      { cmd: "node src/try.ts", files: { "src/db.ts": P.W11_DB, "src/try.ts": P.W11_TRY } },
      { cmd: "npx prisma migrate dev --name add_course_level", files: { "prisma/schema.prisma": P.W11_SCHEMA_LEVEL } },
      "cat prisma/migrations/*_add_course_level/migration.sql",
      "npx prisma migrate status",
      // Deploying to another database (here a fresh one standing in for production): the shell's DATABASE_URL wins over .env.
      'DATABASE_URL="postgresql://ada:ada-password@localhost:5432/course_api_prod" npx prisma migrate deploy',
      { cmd: "npx prisma migrate dev --name rename_title", files: { "prisma/schema.prisma": P.W11_SCHEMA_RENAME } },
      "npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script",
      { cmd: "npx prisma migrate dev --name name_maps_to_title", files: { "prisma/schema.prisma": P.W11_SCHEMA_MAPPED } },
    ],
  },
];
