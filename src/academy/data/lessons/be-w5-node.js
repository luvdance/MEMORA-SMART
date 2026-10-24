/**
 * BACKEND ENGINEERING · WEEK 5 · NODE.JS FUNDAMENTALS
 *
 * Curriculum 5.1 – 5.P. What Node.js is and why it is used, the runtime and
 * V8, the core modules (fs, path, http, crypto), CommonJS and ES modules,
 * npm dependencies and semantic versioning, the process and configuration,
 * files and streams, events, a server from scratch, four exercises and a
 * file-based notes server.
 *
 * Everything here uses only Node's own modules: no Express until Week 7, so
 * the learner sees what a framework does for them. Labs run on the lab
 * machine; a recorded terminal shows real Node on a real laptop.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg, shown, shownAll, term } from "./be-helpers.js";
import { W4_COURSES_JSON } from "./be-projects.js";

export const SECTION_ID = "be-s5-node";
const MODULE = "be-w5-node";

const PKG = pkg({ name: "node-basics", scripts: { start: "node index.js" } });

/* ── A large enrollments file for the streams lab (deterministic) ────── */
const COURSE_CODES = ["BE-101", "DB-101", "WD-201", "CS-101", "MD-101"];
const ENROLLMENTS_CSV = (() => {
  const lines = ["student_id,course,amount_paid"];
  for (let i = 1; i <= 3000; i++) {
    const course = COURSE_CODES[(i * 7) % COURSE_CODES.length];
    const amount = ((i * 37) % 5) * 10000;
    lines.push(`${i},${course},${amount}`);
  }
  return `${lines.join("\n")}\n`;
})();
/** The answers, computed from the same data the lab ships. */
const CSV_TOTALS = (() => {
  const totals = {};
  let rows = 0;
  for (const line of ENROLLMENTS_CSV.trim().split("\n").slice(1)) {
    const [, course, amount] = line.split(",");
    totals[course] = (totals[course] || 0) + Number(amount);
    rows += 1;
  }
  return { totals, rows };
})();

/* ── The notes server (exercise and deliverable) ─────────────────────── */

const NOTES_STORE_STARTER = `import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

// Notes are kept in a JSON file: [{ id, text, createdAt }].

export async function listNotes(file) {
}

export async function createNote(file, text) {
}

export async function deleteNote(file, id) {
}
`;

const NOTES_STORE = `import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

// Notes are kept in a JSON file: [{ id, text, createdAt }].

export async function listNotes(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function save(file, notes) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(notes, null, 2));
}

export async function createNote(file, text) {
  const note = { id: randomUUID(), text, createdAt: new Date().toISOString() };
  const notes = await listNotes(file);
  notes.push(note);
  await save(file, notes);
  return note;
}

export async function deleteNote(file, id) {
  const notes = await listNotes(file);
  const remaining = notes.filter((n) => n.id !== id);
  if (remaining.length === notes.length) return false;
  await save(file, remaining);
  return true;
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 5.1 – 5.2 · WHAT NODE.JS IS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l32-node",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2"],
    title: "What Node.js Is and Why It Is Used",
    subtitle: "JavaScript outside the browser: the runtime, V8 and libuv",
    estimatedMinutes: 45,
    intro:
      "Phase 2 builds servers. They run on Node.js, so this week is about Node itself: what it is, what it gives your code, and how it does so much waiting so efficiently.",
    atoms: [
      {
        id: "a-be-why-node",
        title: "What Node.js is and why it is used",
        explain:
          "Node.js is a program that runs JavaScript outside the browser. It is used for backends because it is very good at what most backends do: waiting. An API spends most of each request waiting for a database, another service or a file, and Node handles thousands of such waiting requests on one thread (Week 3's event loop). It shares a language with the frontend, has the largest package ecosystem (npm), and starts fast. It is a weaker fit for long CPU-heavy work (video encoding, big number crunching), which blocks that one thread: such work goes to worker threads, a queue (Week 18) or another language.",
        decision: decide({
          scenario: "Two services are being planned: (A) an API that reads and writes enrollments in PostgreSQL and calls a payment provider; (B) a service that transcodes uploaded lecture videos into five resolutions.",
          question: "Where is Node.js a natural fit?",
          right: ["A: it is I/O-bound, mostly waiting on the database and the provider, which Node handles efficiently; B is CPU-bound work better given to a dedicated worker or tool", "Node excels at waiting, not crunching."],
          wrong: [
            ["B: video work needs JavaScript", "Transcoding is CPU-heavy; it would block Node's thread."],
            ["Neither: Node is only for frontends", "Node is a server runtime."],
            ["Both equally", "CPU-bound work blocks the event loop."],
          ],
          at: 0,
          aftermath: "Week 18 hands slow work like certificate generation to background workers, so the API stays fast.",
        }),
      },
      {
        id: "a-be-v8-runtime",
        title: "The runtime: V8, libuv and Node's globals",
        explain:
          "Node is three things. V8, Google's JavaScript engine (also in Chrome), compiles your code to machine code. libuv gives it the event loop and non-blocking access to files, the network and timers. Node's own modules wrap them in JavaScript: fs, http, crypto, and more. So in Node there is no window or document (no browser), but there are process (this program: its arguments, environment, exit code), Buffer (binary data) and globals like setTimeout and fetch. Recorded below on a developer's Windows laptop (a Linux server prints linux x64): a busy loop starves a 100 ms timer for a full second, because nothing else runs while JavaScript is busy.",
        example: shownAll("w5-node", ["node hello.js", "node -p \"process.versions.v8\"", "node -p \"process.platform + ' ' + process.arch\"", "node -p \"typeof window\""]),
        terminalExercise: term("w5-node", {
          goal: "Show what happens to a 100 ms timer while a loop keeps the thread busy for one second.",
          accept: ["node blocking.js"],
          near: [{ command: "node hello.js", why: "That one just prints the version. blocking.js has the timer and the loop." }],
          hint: "Run blocking.js.",
          success: "The timer asked for 100 ms and fired after about 1000: the loop held the only thread. In a server, every other user would wait that long too.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 5.3 · CORE MODULES: FS, PATH, HTTP AND CRYPTO
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l33-core-modules",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.3"],
    title: "Core Modules: fs, path, http and crypto",
    subtitle: "What Node gives you without installing anything",
    estimatedMinutes: 55,
    intro:
      "Node ships with modules for files, paths, networking, cryptography and more. Import them with the node: prefix (import fs from \"node:fs\") so nobody mistakes them for npm packages. This lesson uses three; http gets lessons of its own.",
    atoms: [
      {
        id: "a-be-path-module",
        title: "path",
        explain:
          "node:path builds and takes apart file paths without string hacking: path.join(\"data\", \"notes.json\") joins with the right separator and tidies .. and doubled slashes; path.resolve gives an absolute path; path.basename(p) is the file name, path.extname(p) its extension, path.dirname(p) its folder. With import.meta.dirname (the folder of the current module) you build paths that work wherever the program is started from (Week 4).",
        nodeLab: {
          task:
            "In paths.js write describePath(p): return { folder, name, ext, absolute } using path.dirname, path.basename, path.extname and path.resolve. And uploadPath(userId, fileName): path.join(\"uploads\", String(userId), path.basename(fileName)): basename strips any folders a malicious name like ../../etc/passwd tries to sneak in.",
          files: {
            "package.json": PKG,
            "paths.js": 'import path from "node:path";\n\nexport function describePath(p) {\n}\n\nexport function uploadPath(userId, fileName) {\n}\n',
            "index.js": 'import { describePath, uploadPath } from "./paths.js";\n\nconsole.log(describePath("data/courses.json"));\nconsole.log(uploadPath(7, "cv.pdf"));\nconsole.log(uploadPath(7, "../../etc/passwd"));\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "paths.js",
          solution: {
            "paths.js":
              'import path from "node:path";\n\nexport function describePath(p) {\n  return { folder: path.dirname(p), name: path.basename(p), ext: path.extname(p), absolute: path.resolve(p) };\n}\n\nexport function uploadPath(userId, fileName) {\n  return path.join("uploads", String(userId), path.basename(fileName));\n}\n',
          },
          tests: [
            { label: "describePath(\"data/courses.json\") takes the path apart", check: `const { describePath } = await load("paths.js"); eq(describePath("data/courses.json"), { folder: "data", name: "courses.json", ext: ".json", absolute: "/app/data/courses.json" }, "the parts (the program runs in /app)");` },
            { label: "uploadPath(7, \"cv.pdf\") is uploads/7/cv.pdf", check: `const { uploadPath } = await load("paths.js"); eq(uploadPath(7, "cv.pdf"), "uploads/7/cv.pdf", "a normal file name");` },
            { label: "A name with ../ cannot escape the user's folder", check: `const { uploadPath } = await load("paths.js"); eq(uploadPath(7, "../../etc/passwd"), "uploads/7/passwd", "basename keeps only the file name"); eq(uploadPath(7, "a/b/../c.txt"), "uploads/7/c.txt", "folders in the name are dropped");` },
          ],
          hint: "return { folder: path.dirname(p), name: path.basename(p), ext: path.extname(p), absolute: path.resolve(p) }.",
          successMessage: "The second call is a real attack (path traversal) against upload code; path.basename stopped it. Week 14 returns to upload security.",
        },
      },
      {
        id: "a-be-fs-module",
        title: "fs",
        explain:
          "node:fs reads and writes files. Each operation comes in three styles: fs.readFileSync (blocks until done: fine at startup, wrong inside a request handler, where it stops every other request), callbacks (fs.readFile(path, cb), the original style), and promises (node:fs/promises, use with await: the style for backend code). Read text with readFile(path, \"utf8\") (without the encoding you get a Buffer of bytes); writeFile replaces a file; appendFile adds to it; mkdir(dir, { recursive: true }) creates folders. Errors carry a code: ENOENT (no such file), EACCES (permission denied), EISDIR. A missing file is often normal: catch ENOENT and use a default, let anything else through.",
        nodeLab: {
          task:
            "In settings.js, finish loadSettings(file) and saveSettings(file, settings) using node:fs/promises. loadSettings returns the parsed JSON, or { theme: \"light\", pageSize: 20 } if the file does not exist (ENOENT); any other error (such as invalid JSON) must still be thrown. saveSettings writes pretty JSON (2-space indent), creating the folder if needed.",
          files: {
            "package.json": PKG,
            "settings.js": 'import { readFile, writeFile, mkdir } from "node:fs/promises";\nimport { dirname } from "node:path";\n\nconst DEFAULTS = { theme: "light", pageSize: 20 };\n\nexport async function loadSettings(file) {\n}\n\nexport async function saveSettings(file, settings) {\n}\n',
            "index.js": 'import { loadSettings, saveSettings } from "./settings.js";\n\nconsole.log("before:", await loadSettings("config/settings.json"));\nawait saveSettings("config/settings.json", { theme: "dark", pageSize: 50 });\nconsole.log("after:", await loadSettings("config/settings.json"));\n',
            "broken.json": "{ theme: dark }\n",
          },
          readOnly: ["package.json", "index.js", "broken.json"],
          open: "settings.js",
          solution: {
            "settings.js":
              'import { readFile, writeFile, mkdir } from "node:fs/promises";\nimport { dirname } from "node:path";\n\nconst DEFAULTS = { theme: "light", pageSize: 20 };\n\nexport async function loadSettings(file) {\n  try {\n    return JSON.parse(await readFile(file, "utf8"));\n  } catch (err) {\n    if (err.code === "ENOENT") return { ...DEFAULTS };\n    throw err;\n  }\n}\n\nexport async function saveSettings(file, settings) {\n  await mkdir(dirname(file), { recursive: true });\n  await writeFile(file, JSON.stringify(settings, null, 2));\n}\n',
          },
          tests: [
            { label: "A missing file gives the defaults", check: `const { loadSettings } = await load("settings.js"); eq(await wait(loadSettings("nope/missing.json")), { theme: "light", pageSize: 20 }, "loadSettings of a missing file");` },
            { label: "saveSettings writes pretty JSON, creating the folder", check: `const { saveSettings } = await load("settings.js"); await wait(saveSettings("deep/new/dir/s.json", { theme: "dark" })); eq(file("deep/new/dir/s.json"), JSON.stringify({ theme: "dark" }, null, 2), "the file's contents");` },
            { label: "What was saved loads back", check: `has(stdout(), "after: { theme: 'dark', pageSize: 50 }", "index.js should print the saved settings");` },
            { label: "Invalid JSON is not hidden behind the defaults", check: `const { loadSettings } = await load("settings.js"); let e = null; try { await wait(loadSettings("broken.json")); } catch (x) { e = x; } assert(e, "loadSettings(\\"broken.json\\") should throw: a corrupt settings file must not silently become the defaults"); eq(e.name, "SyntaxError", "the JSON error");` },
          ],
          hint: "In loadSettings, try { return JSON.parse(await readFile(file, \"utf8\")); } catch (err) { if (err.code === \"ENOENT\") return { ...DEFAULTS }; throw err; }",
          successMessage: "Missing is normal, corrupt is not: catching only ENOENT is the difference between a sensible default and silently losing a user's settings.",
        },
      },
      {
        id: "a-be-crypto-module",
        title: "crypto",
        explain:
          "node:crypto provides cryptography built and audited by experts: never write your own. crypto.randomUUID() makes unique ids; crypto.randomBytes(32).toString(\"hex\") makes unguessable tokens (password-reset links, API keys: Week 13); createHash(\"sha256\").update(data).digest(\"hex\") fingerprints data (a checksum to detect changed or corrupted files; NOT for passwords, which need a slow hash like bcrypt or Argon2, Week 13); createHmac(\"sha256\", secret) proves a message came from someone who knows the secret (webhook signatures, Week 8). Math.random() is not secure: never use it for tokens.",
        nodeLab: {
          task:
            "In tokens.js write: checksum(text) → the SHA-256 of the text as hex; newToken() → 32 random bytes as hex (64 characters); and sign(payload, secret) → the HMAC-SHA256 of the payload with the secret, as hex. Use node:crypto only.",
          files: {
            "package.json": PKG,
            "tokens.js": 'import { createHash, createHmac, randomBytes } from "node:crypto";\n\nexport function checksum(text) {\n}\n\nexport function newToken() {\n}\n\nexport function sign(payload, secret) {\n}\n',
            "data/courses.json": W4_COURSES_JSON,
            "index.js": 'import { readFileSync } from "node:fs";\nimport { checksum, newToken, sign } from "./tokens.js";\n\nconsole.log("courses.json:", checksum(readFileSync("data/courses.json", "utf8")));\nconsole.log("token:", newToken());\nconsole.log("signature:", sign(\'{"event":"payment.success","amount":5000}\', "webhook-secret"));\n',
          },
          readOnly: ["package.json", "index.js", "data/courses.json"],
          open: "tokens.js",
          solution: {
            "tokens.js":
              'import { createHash, createHmac, randomBytes } from "node:crypto";\n\nexport function checksum(text) {\n  return createHash("sha256").update(text).digest("hex");\n}\n\nexport function newToken() {\n  return randomBytes(32).toString("hex");\n}\n\nexport function sign(payload, secret) {\n  return createHmac("sha256", secret).update(payload).digest("hex");\n}\n',
          },
          tests: [
            { label: "checksum gives the SHA-256 hex digest", check: `const { checksum } = await load("tokens.js"); eq(checksum("hello"), "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824", "SHA-256 of 'hello'"); has(stdout(), "courses.json: 92a7db686c06a81f1369cda1b98ec65a1017c5a67314a9ad7bfed9baa273fc54", "the checksum of data/courses.json");` },
            { label: "newToken gives 64 random hex characters, different every time", check: `const { newToken } = await load("tokens.js"); const a = newToken(); const b = newToken(); assert(/^[0-9a-f]{64}$/.test(a), "a token should be 64 hex characters (32 bytes)"); assert(a !== b, "two tokens should differ");` },
            { label: "sign gives the HMAC-SHA256 the provider would compute", check: `const { sign } = await load("tokens.js"); eq(sign('{"event":"payment.success","amount":5000}', "webhook-secret"), "1088c0fdde491dfae77eea8cfacc56fa0a32ba98cff3a43fc892e8d466582b62", "the signature");` },
            { label: "No Math.random", check: `lacks(source("tokens.js"), "Math.random", "Math.random is predictable: use randomBytes");` },
          ],
          hint: "createHash(\"sha256\").update(text).digest(\"hex\"); randomBytes(32).toString(\"hex\"); createHmac(\"sha256\", secret).update(payload).digest(\"hex\").",
          successMessage: "These digests are exactly what any SHA-256 and HMAC implementation computes for the same input, which is why a payment provider and your server can agree on a signature without ever sending the secret.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 5.4 – 5.5 · MODULE SYSTEMS AND DEPENDENCIES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l34-modules",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.4", "5.5"],
    title: "CommonJS, ES Modules and npm Dependencies",
    subtitle: "Two ways to share code, and how to choose what to depend on",
    estimatedMinutes: 55,
    intro: "Node has two module systems, and every backend developer meets both. And every dependency you add is code you did not write but are responsible for.",
    atoms: [
      {
        id: "a-be-cjs-esm",
        title: "CommonJS and ES modules",
        explain:
          "COMMONJS is Node's original system: const express = require(\"express\") and module.exports = { … }; require is synchronous and can be called anywhere; __dirname is the module's folder. ES MODULES are JavaScript's standard (Week 2): import/export, static (imports run first), top-level await, import.meta.dirname, and relative imports need their extension. A package.json with \"type\": \"module\" makes .js files ES modules; otherwise they are CommonJS (.mjs and .cjs force one or the other). New code should use ES modules; a lot of existing code and documentation still uses CommonJS, so read both. In an ES module, require is not defined; Node 22+ can require() an ES module that has no top-level await.",
        nodeLab: {
          task:
            "This project is CommonJS. Convert it to ES modules: set \"type\": \"module\" in package.json, replace require/module.exports with import/export in both files (keep the .js extension in the relative import), and replace __dirname with import.meta.dirname. It must print the same output.",
          files: {
            "package.json": `${JSON.stringify({ name: "node-basics", version: "1.0.0", scripts: { start: "node index.js" } }, null, 2)}\n`,
            "catalog.js": 'const { readFileSync } = require("node:fs");\nconst path = require("node:path");\n\nfunction loadCourses() {\n  return JSON.parse(readFileSync(path.join(__dirname, "data", "courses.json"), "utf8"));\n}\n\nmodule.exports = { loadCourses };\n',
            "index.js": 'const { loadCourses } = require("./catalog.js");\n\nconst courses = loadCourses();\nconsole.log(`${courses.length} courses: ${courses.map((c) => c.title).join(", ")}`);\n',
            "data/courses.json": W4_COURSES_JSON,
          },
          readOnly: ["data/courses.json"],
          open: "catalog.js",
          solution: {
            "package.json": `${JSON.stringify({ name: "node-basics", version: "1.0.0", type: "module", scripts: { start: "node index.js" } }, null, 2)}\n`,
            "catalog.js": 'import { readFileSync } from "node:fs";\nimport path from "node:path";\n\nexport function loadCourses() {\n  return JSON.parse(readFileSync(path.join(import.meta.dirname, "data", "courses.json"), "utf8"));\n}\n',
            "index.js": 'import { loadCourses } from "./catalog.js";\n\nconst courses = loadCourses();\nconsole.log(`${courses.length} courses: ${courses.map((c) => c.title).join(", ")}`);\n',
          },
          tests: [
            { label: "package.json declares \"type\": \"module\"", check: `eq(JSON.parse(file("package.json")).type, "module", "set type to module");` },
            { label: "No require, module.exports or __dirname left", check: `for (const f of ["catalog.js", "index.js"]) { const s = source(f); lacks(s, "require(", f + " still uses require"); lacks(s, "module.exports", f + " still uses module.exports"); lacks(s, "__dirname", f + " still uses __dirname"); }` },
            { label: "It prints the same line", check: `has(stdout(), "2 courses: Backend Engineering, Relational Databases", "the output should be unchanged"); eq(exitCode(), 0, "it should run without errors:\\n" + stderr());` },
          ],
          hint: "import { readFileSync } from \"node:fs\"; import path from \"node:path\"; export function loadCourses() { … import.meta.dirname … } and in index.js import { loadCourses } from \"./catalog.js\".",
          successMessage: "Same program, standard modules. Leave one require in and Node answers ReferenceError: require is not defined in ES module scope, you can use import instead: try it.",
        },
      },
      {
        id: "a-be-dependencies",
        title: "npm dependencies and semantic versioning",
        explain:
          "Every dependency is code that runs with your server's permissions: it can have bugs, vulnerabilities, or be abandoned, and it brings its own dependencies (Express pulls in 64 more packages). Before adding one, check that it is maintained (recent releases, open issues answered), widely used, small enough for the job, and that Node does not already do it (fetch, crypto.randomUUID, util.parseArgs, node --watch and node --env-file replaced several popular packages). Keep package-lock.json committed; run npm audit for known vulnerabilities and npm outdated to see what is behind; upgrade majors deliberately, reading release notes, with tests (Week 15). Semantic versioning (Week 4) tells you which upgrades should be safe.",
        decision: decide({
          scenario: "You need unique ids for new enrollments. A teammate suggests adding an npm package that generates UUIDs.",
          question: "What is the best choice?",
          right: ["crypto.randomUUID(), built into Node: no dependency needed", "Check what Node already provides first."],
          wrong: [
            ["The package: more packages means more features", "More code to trust and update, for nothing."],
            ["Math.random().toString(36)", "Not unique enough, and predictable."],
            ["An auto-increment counter in a global variable", "Resets on restart and breaks with two servers."],
          ],
          at: 1,
          aftermath: "Every dependency you do not add is one you never have to audit, update or replace.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 5.6 – 5.7 · THE PROCESS, CONFIGURATION, FILES AND STREAMS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l35-process-streams",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.6", "5.7"],
    title: "The Process, Configuration, Files and Streams",
    subtitle: "Your program's environment, and data too big to hold at once",
    estimatedMinutes: 65,
    intro: "A running Node program is a process: it has arguments, an environment, an exit code and signals from the operating system. And it reads data that may not fit in memory, which is what streams are for.",
    atoms: [
      {
        id: "a-be-process",
        title: "The process and application configuration",
        explain:
          "process is your program as the operating system sees it: process.argv (arguments), process.env (environment variables), process.cwd() (the folder it was started in), process.exitCode / process.exit(code) (0 success, anything else failure), process.memoryUsage() and process.uptime(). The operating system sends SIGNALS: SIGINT on Ctrl+C, SIGTERM when a platform stops your service; a server should catch SIGTERM to finish requests before exiting (Week 20). Configuration rules (Week 3) apply to servers: everything that differs between environments comes from process.env, read and validated in one config module, with NODE_ENV saying which environment it is.",
        nodeLab: {
          task:
            "In config.js, export config with: port from PORT as a number (default 3000), env from NODE_ENV (default \"development\"), and logLevel from LOG_LEVEL, which must be one of \"debug\", \"info\", \"warn\", \"error\" (default \"debug\" in development and \"info\" otherwise); any other LOG_LEVEL throws new Error(\"LOG_LEVEL must be one of debug, info, warn, error\"). index.js prints it.",
          files: {
            "package.json": PKG,
            "config.js": "export const config = {};\n",
            "index.js": 'import { config } from "./config.js";\n\nconsole.log(JSON.stringify(config));\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "config.js",
          solution: {
            "config.js":
              'const LEVELS = ["debug", "info", "warn", "error"];\nconst env = process.env.NODE_ENV ?? "development";\nconst logLevel = process.env.LOG_LEVEL ?? (env === "development" ? "debug" : "info");\nif (!LEVELS.includes(logLevel)) throw new Error(`LOG_LEVEL must be one of ${LEVELS.join(", ")}`);\n\nexport const config = {\n  port: Number(process.env.PORT ?? 3000),\n  env,\n  logLevel,\n};\n',
          },
          tests: [
            { label: "Defaults: port 3000, development, debug", check: `has(stdout(), '{"port":3000,"env":"development","logLevel":"debug"}', "the defaults");` },
            { label: "Production defaults to info, and PORT is a number", check: `await run("NODE_ENV=production PORT=8080 node index.js"); has(stdout(), '{"port":8080,"env":"production","logLevel":"info"}', "production with PORT=8080");` },
            { label: "LOG_LEVEL=warn is used", check: `await run("LOG_LEVEL=warn node index.js"); has(stdout(), '"logLevel":"warn"', "LOG_LEVEL should be used when valid");` },
            { label: "LOG_LEVEL=loud stops the program with the message", check: `await run("LOG_LEVEL=loud node index.js"); eq(exitCode(), 1, "an invalid LOG_LEVEL should stop the program"); has(stderr(), "LOG_LEVEL must be one of debug, info, warn, error", "the error message");` },
          ],
          hint: "Compute env first, then logLevel with a default that depends on env, validate it against the list, and build the object.",
          successMessage: "Sensible defaults per environment, and a typo in production configuration stops the deployment at once instead of half-working.",
        },
      },
      {
        id: "a-be-streams",
        title: "File handling and streams",
        explain:
          "readFile loads a whole file into memory: fine for settings, wrong for a 2 GB log or a large export. A STREAM processes data in chunks as it arrives: fs.createReadStream(path) emits chunks of 64 KB; readline turns them into lines (for await (const line of rl)); streams can be piped (readable → transform → writable) with pipeline from node:stream/promises, which also handles errors and backpressure (slowing the reader when the writer cannot keep up). HTTP requests and responses are streams too: a server can send a large file without ever holding it all.",
        nodeLab: {
          task:
            `enrollments.csv has ${CSV_TOTALS.rows} rows (student_id,course,amount_paid). In report.js, read it line by line with createReadStream and readline (not readFile), skip the header, total amount_paid per course, and print one line per course in alphabetical order as "<course>: <total>", then "Rows: <n>".`,
          files: {
            "package.json": PKG,
            "enrollments.csv": ENROLLMENTS_CSV,
            "report.js": 'import { createReadStream } from "node:fs";\nimport { createInterface } from "node:readline";\n\n// Read enrollments.csv line by line and total amount_paid per course.\n',
            "index.js": 'import "./report.js";\n',
          },
          readOnly: ["package.json", "enrollments.csv", "index.js"],
          open: "report.js",
          solution: {
            "report.js":
              'import { createReadStream } from "node:fs";\nimport { createInterface } from "node:readline";\n\nconst rl = createInterface({ input: createReadStream("enrollments.csv"), crlfDelay: Infinity });\nconst totals = new Map();\nlet rows = 0;\nlet header = true;\nfor await (const line of rl) {\n  if (header) {\n    header = false;\n    continue;\n  }\n  if (!line.trim()) continue;\n  const [, course, amount] = line.split(",");\n  totals.set(course, (totals.get(course) ?? 0) + Number(amount));\n  rows += 1;\n}\nfor (const course of [...totals.keys()].sort()) console.log(`${course}: ${totals.get(course)}`);\nconsole.log(`Rows: ${rows}`);\n',
          },
          tests: [
            { label: "The totals per course are right, in alphabetical order", check: `const want = ${JSON.stringify(Object.keys(CSV_TOTALS.totals).sort().map((c) => `${c}: ${CSV_TOTALS.totals[c]}`))}; const lines = stdout().trim().split("\\n").filter((l) => /^[A-Z]{2}-\\d{3}: /.test(l)); eq(lines, want, "one line per course, alphabetical");` },
            { label: "Rows: ${CSV_TOTALS.rows}", check: `has(stdout(), "Rows: ${CSV_TOTALS.rows}", "count the data rows, not the header");` },
            { label: "It streams the file instead of reading it whole", check: `const s = source("report.js"); has(s, "createReadStream", "read the file with createReadStream"); lacks(s, "readFile", "do not load the whole file with readFile");` },
          ],
          hint: "const rl = createInterface({ input: createReadStream(\"enrollments.csv\") }); for await (const line of rl) { … } with a flag to skip the first line, and a Map of totals.",
          successMessage: "The same code handles a 3,000-row file or a 3-million-row one in the same small amount of memory. That is what streams are for.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 5.8 – 5.9 · EVENTS AND A SERVER FROM SCRATCH
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l36-events-server",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.8", "5.9"],
    title: "Event-Driven Programming and a Server from Scratch",
    subtitle: "EventEmitter, and http.createServer without a framework",
    estimatedMinutes: 65,
    intro: "Node is event-driven all the way down: streams emit data, servers emit requests, processes emit signals. Learn the pattern, then build a JSON API on Node's http module alone, so you know exactly what Express does for you in Week 7.",
    atoms: [
      {
        id: "a-be-events",
        title: "EventEmitter",
        explain:
          "An EventEmitter lets one part of a program announce that something happened without knowing who cares. emitter.on(\"enrolled\", listener) subscribes; emitter.emit(\"enrolled\", data) calls every listener synchronously, in order; once subscribes for one event only; off unsubscribes. Extend it to make your own: class EnrollmentService extends EventEmitter. The special \"error\" event crashes the process if nobody listens for it, as Node's own streams and servers do. Events decouple: the enrollment code does not need to know that an email is sent and a dashboard is updated (Week 18 grows this into event-driven architecture).",
        nodeLab: {
          task:
            "In enrollments.js, make EnrollmentService extend EventEmitter. enroll(student) adds the student and emits \"enrolled\" with { student, seatsLeft }; when the course is already full it emits \"full\" with { student } instead (nothing is added); when the last seat is taken it also emits \"soldOut\" once. index.js subscribes to all three.",
          files: {
            "package.json": PKG,
            "enrollments.js": 'import { EventEmitter } from "node:events";\n\nexport class EnrollmentService {\n  constructor(seats) {\n    this.seats = seats;\n    this.students = [];\n  }\n\n  enroll(student) {\n  }\n}\n',
            "index.js": 'import { EnrollmentService } from "./enrollments.js";\n\nconst course = new EnrollmentService(2);\ncourse.on("enrolled", ({ student, seatsLeft }) => console.log(`${student} enrolled, ${seatsLeft} left`));\ncourse.on("full", ({ student }) => console.log(`${student} could not enrol: full`));\ncourse.on("soldOut", () => console.log("Sold out!"));\nfor (const s of ["Ada", "Bayo", "Chiamaka"]) course.enroll(s);\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "enrollments.js",
          solution: {
            "enrollments.js":
              'import { EventEmitter } from "node:events";\n\nexport class EnrollmentService extends EventEmitter {\n  constructor(seats) {\n    super();\n    this.seats = seats;\n    this.students = [];\n  }\n\n  enroll(student) {\n    if (this.students.length >= this.seats) {\n      this.emit("full", { student });\n      return;\n    }\n    this.students.push(student);\n    const seatsLeft = this.seats - this.students.length;\n    this.emit("enrolled", { student, seatsLeft });\n    if (seatsLeft === 0) this.emit("soldOut");\n  }\n}\n',
          },
          tests: [
            { label: "index.js prints the three events in order", check: `const out = stdout(); const i1 = out.indexOf("Ada enrolled, 1 left"), i2 = out.indexOf("Bayo enrolled, 0 left"), i3 = out.indexOf("Sold out!"), i4 = out.indexOf("Chiamaka could not enrol: full"); assert(i1 >= 0 && i2 > i1 && i3 > i2 && i4 > i3, "expected: Ada enrolled, Bayo enrolled, Sold out!, Chiamaka full — got:\\n" + out);` },
            { label: "EnrollmentService is an EventEmitter", check: `const { EnrollmentService } = await load("enrollments.js"); const { EventEmitter } = await load("node:events"); assert(new EnrollmentService(1) instanceof EventEmitter, "EnrollmentService should extend EventEmitter");` },
            { label: "soldOut fires once; full adds nobody", check: `const { EnrollmentService } = await load("enrollments.js"); const c = new EnrollmentService(1); let sold = 0, full = 0; c.on("soldOut", () => sold++); c.on("full", () => full++); c.enroll("A"); c.enroll("B"); c.enroll("C"); eq([sold, full, c.students], [1, 2, ["A"]], "soldOut once, two refused, one student");` },
          ],
          hint: "class EnrollmentService extends EventEmitter, call super() first in the constructor, and this.emit(\"enrolled\", { student, seatsLeft }).",
          successMessage: "The service announces; listeners decide what to do. Adding an email or a dashboard update is now a new listener, not a change to enroll().",
        },
      },
      {
        id: "a-be-http-server",
        title: "Basic server creation",
        explain:
          "http.createServer((req, res) => { … }) calls your function for every request. req.method and req.url say what was asked; req.headers holds the headers; the body arrives as a STREAM of chunks you must collect (req.on(\"data\") and req.on(\"end\"), or for await). You answer with res.statusCode and res.setHeader, then res.end(body), exactly once. Everything a framework adds (routing, parsing JSON, error handling) is code like this, written once. Build it by hand now and Express will make sense.",
        nodeLab: {
          task:
            "Finish server.js: GET /health answers 200 with {\"status\":\"ok\"}; POST /echo reads the JSON body and answers 201 with it; a body that is not valid JSON gets 400 {\"error\":\"Invalid JSON\"}; any other request gets 404 {\"error\":\"Not found\"}. Every response is JSON with Content-Type: application/json.",
          files: {
            "package.json": pkg({ name: "node-server", scripts: { start: "node server.js" } }),
            "server.js": 'import http from "node:http";\n\nfunction sendJson(res, status, body) {\n  res.statusCode = status;\n  res.setHeader("Content-Type", "application/json");\n  res.end(JSON.stringify(body));\n}\n\nasync function readBody(req) {\n  let raw = "";\n  for await (const chunk of req) raw += chunk;\n  return raw;\n}\n\nconst server = http.createServer(async (req, res) => {\n  // Route the request here.\n  sendJson(res, 404, { error: "Not found" });\n});\n\nserver.listen(3000, () => console.log("Listening on http://localhost:3000"));\n',
          },
          readOnly: ["package.json"],
          open: "server.js",
          solution: {
            "server.js": 'import http from "node:http";\n\nfunction sendJson(res, status, body) {\n  res.statusCode = status;\n  res.setHeader("Content-Type", "application/json");\n  res.end(JSON.stringify(body));\n}\n\nasync function readBody(req) {\n  let raw = "";\n  for await (const chunk of req) raw += chunk;\n  return raw;\n}\n\nconst server = http.createServer(async (req, res) => {\n  if (req.method === "GET" && req.url === "/health") return sendJson(res, 200, { status: "ok" });\n  if (req.method === "POST" && req.url === "/echo") {\n    try {\n      return sendJson(res, 201, JSON.parse(await readBody(req)));\n    } catch {\n      return sendJson(res, 400, { error: "Invalid JSON" });\n    }\n  }\n  sendJson(res, 404, { error: "Not found" });\n});\n\nserver.listen(3000, () => console.log("Listening on http://localhost:3000"));\n',
          },
          requests: [
            { label: "GET /health", method: "GET", path: "/health" },
            { label: "POST /echo", method: "POST", path: "/echo", body: { course: "BE-101" } },
            { label: "POST bad JSON", method: "POST", path: "/echo", body: "{oops" },
          ],
          tests: [
            { label: "GET /health → 200 {\"status\":\"ok\"}", check: `const r = await get("/health"); eq(r.status, 200, "status"); eq(r.json, { status: "ok" }, "body"); has(r.headers["content-type"], "application/json", "Content-Type");` },
            { label: "POST /echo → 201 with the same JSON", check: `const r = await post("/echo", { course: "BE-101", seats: 30 }); eq(r.status, 201, "status"); eq(r.json, { course: "BE-101", seats: 30 }, "the body should come back unchanged");` },
            { label: "Invalid JSON → 400 {\"error\":\"Invalid JSON\"}", check: `const r = await request("POST", "/echo", { body: "{oops", headers: { "Content-Type": "application/json" } }); eq(r.status, 400, "status"); eq(r.json, { error: "Invalid JSON" }, "body");` },
            { label: "Anything else → 404 JSON (including GET /echo)", check: `for (const [m, p] of [["GET", "/nope"], ["GET", "/echo"], ["DELETE", "/health"]]) { const r = await request(m, p); eq(r.status, 404, m + " " + p); eq(r.json, { error: "Not found" }, m + " " + p + " body"); }` },
          ],
          hint: "if (req.method === \"GET\" && req.url === \"/health\") return sendJson(…); for POST /echo, wrap JSON.parse(await readBody(req)) in try/catch.",
          successMessage: "A working JSON API from Node alone: routing by method and path, a streamed body, a 400 for bad input. Now imagine fifty routes written this way: Week 7's Express exists to remove exactly this repetition.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 5.10 – 5.13 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l37-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["5.10", "5.11", "5.12", "5.13"],
    title: "Exercises: Servers, Files, a Notes Service and Configuration",
    subtitle: "The pieces of this week's deliverable",
    estimatedMinutes: 90,
    intro: "Four exercises, each a piece of the notes server you deliver at the end of the week.",
    atoms: [
      {
        id: "a-be-ex-http-server",
        title: "Exercise: a simple HTTP server",
        explain:
          "A good server answers precisely: 404 for a path it does not know, but 405 Method Not Allowed (with an Allow header listing the methods it does accept) for a known path with the wrong method. Clients and tools use the difference: one means 'wrong address', the other 'right address, wrong verb'. And it logs every request with its method, path, status and duration, which you will rely on when something goes wrong.",
        nodeLab: {
          task:
            "Extend server.js: GET /time answers 200 {\"now\": <ISO time>}; any other method on /time answers 405 with header Allow: GET and {\"error\":\"Method not allowed\"}; unknown paths answer 404. After each response, log one line: \"<METHOD> <path> <status> <ms>ms\" (use res.on(\"finish\") and Date.now()).",
          files: {
            "package.json": pkg({ name: "node-server", scripts: { start: "node server.js" } }),
            "server.js": 'import http from "node:http";\n\nfunction sendJson(res, status, body, headers = {}) {\n  res.writeHead(status, { "Content-Type": "application/json", ...headers });\n  res.end(JSON.stringify(body));\n}\n\nconst server = http.createServer((req, res) => {\n  sendJson(res, 404, { error: "Not found" });\n});\n\nserver.listen(3000, () => console.log("Listening on http://localhost:3000"));\n',
          },
          readOnly: ["package.json"],
          open: "server.js",
          solution: {
            "server.js": 'import http from "node:http";\n\nfunction sendJson(res, status, body, headers = {}) {\n  res.writeHead(status, { "Content-Type": "application/json", ...headers });\n  res.end(JSON.stringify(body));\n}\n\nconst server = http.createServer((req, res) => {\n  const started = Date.now();\n  res.on("finish", () => console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - started}ms`));\n  if (req.url === "/time") {\n    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" }, { Allow: "GET" });\n    return sendJson(res, 200, { now: new Date().toISOString() });\n  }\n  sendJson(res, 404, { error: "Not found" });\n});\n\nserver.listen(3000, () => console.log("Listening on http://localhost:3000"));\n',
          },
          requests: [
            { label: "GET /time", method: "GET", path: "/time" },
            { label: "POST /time", method: "POST", path: "/time" },
            { label: "GET /nope", method: "GET", path: "/nope" },
          ],
          tests: [
            { label: "GET /time answers the current time", check: `const r = await get("/time"); eq(r.status, 200, "status"); assert(typeof r.json?.now === "string" && Math.abs(Date.parse(r.json.now) - now()) < 5000, "now should be the current time as an ISO string");` },
            { label: "POST /time → 405 with Allow: GET", check: `const r = await post("/time", {}); eq(r.status, 405, "status"); eq(r.headers["allow"], "GET", "the Allow header lists the accepted methods"); eq(r.json, { error: "Method not allowed" }, "body");` },
            { label: "Unknown paths → 404", check: `eq((await get("/nope")).status, 404, "GET /nope");` },
            { label: "Every request is logged with method, path, status and duration", check: `await get("/time"); await request("DELETE", "/time"); await get("/x"); const out = stdout(); for (const re of [/GET \\/time 200 \\d+ms/, /DELETE \\/time 405 \\d+ms/, /GET \\/x 404 \\d+ms/]) assert(re.test(out), "missing a log line like " + re.source.replace(/\\\\/g, ""));` },
          ],
          hint: "At the top of the handler: const started = Date.now(); res.on(\"finish\", () => console.log(…)). Then check req.url, then req.method.",
          successMessage: "Access logs with durations are the first thing anyone reads when an API misbehaves. Week 7 turns this into reusable logging middleware.",
        },
      },
      {
        id: "a-be-ex-files",
        title: "Exercise: read and write files",
        explain:
          "Writing a file in place is risky: if the process dies halfway, the file is left half-written and the data is gone. The safe pattern is ATOMIC writing: write to a temporary file next to it, then rename the temporary file over the real one. A rename within one folder is atomic on every operating system: readers see either the old file or the new one, never half of one. Databases do this kind of thing for you (Week 9), which is one reason to use them.",
        nodeLab: {
          task:
            "In store.js, write writeJsonAtomic(file, data): write JSON.stringify(data, null, 2) to file + \".tmp\", then rename it to file (node:fs/promises). And readJson(file, fallback): return the parsed file, or fallback when it does not exist.",
          files: {
            "package.json": PKG,
            "store.js": 'import { readFile, writeFile, rename } from "node:fs/promises";\n\nexport async function writeJsonAtomic(file, data) {\n}\n\nexport async function readJson(file, fallback) {\n}\n',
            "index.js": 'import { writeJsonAtomic, readJson } from "./store.js";\n\nconsole.log(await readJson("counts.json", { visits: 0 }));\nawait writeJsonAtomic("counts.json", { visits: 1 });\nconsole.log(await readJson("counts.json", { visits: 0 }));\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "store.js",
          solution: {
            "store.js": 'import { readFile, writeFile, rename } from "node:fs/promises";\n\nexport async function writeJsonAtomic(file, data) {\n  const tmp = `${file}.tmp`;\n  await writeFile(tmp, JSON.stringify(data, null, 2));\n  await rename(tmp, file);\n}\n\nexport async function readJson(file, fallback) {\n  try {\n    return JSON.parse(await readFile(file, "utf8"));\n  } catch (err) {\n    if (err.code === "ENOENT") return fallback;\n    throw err;\n  }\n}\n',
          },
          tests: [
            { label: "index.js prints the fallback, then the saved data", check: `has(stdout(), "{ visits: 0 }\\n{ visits: 1 }", "before and after writing");` },
            { label: "The file holds pretty JSON and no .tmp file is left behind", check: `eq(file("counts.json"), JSON.stringify({ visits: 1 }, null, 2), "counts.json"); assert(!exists("counts.json.tmp"), "the temporary file should have been renamed");` },
            { label: "It writes to a temporary file and renames it", check: `const s = source("store.js"); has(s, ".tmp", "write to a temporary file first"); has(s, "rename(", "then rename it over the real file");` },
          ],
          hint: "const tmp = `${file}.tmp`; await writeFile(tmp, …); await rename(tmp, file);",
          successMessage: "Crash between the two steps and you lose only the new write, never the old data. The notes service uses this next.",
        },
      },
      {
        id: "a-be-ex-notes-service",
        title: "Exercise: a file-based notes service",
        explain:
          "A SERVICE module holds the application's operations, independent of HTTP: listNotes, createNote, deleteNote, each taking the storage file. The HTTP server (next) only translates requests into calls and results into responses. That separation (Week 7 and Week 17 come back to it) lets you test the logic without a server, and swap the file for a database in Week 11 without touching the routes.",
        nodeLab: {
          task:
            "In notes.js, write listNotes(file) (the notes, or [] if the file does not exist), createNote(file, text) (adds { id: randomUUID(), text, createdAt: ISO time }, saves, returns the note) and deleteNote(file, id) (removes it and returns true, or returns false if there is no such note). Store the notes as a JSON array.",
          files: {
            "package.json": PKG,
            "notes.js": NOTES_STORE_STARTER,
            "index.js": 'import { listNotes, createNote, deleteNote } from "./notes.js";\n\nconst file = "data/notes.json";\nconst a = await createNote(file, "Read about streams");\nawait createNote(file, "Try EventEmitter");\nconsole.log((await listNotes(file)).map((n) => n.text));\nconsole.log(await deleteNote(file, a.id), await deleteNote(file, "nope"));\nconsole.log((await listNotes(file)).length);\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "notes.js",
          solution: { "notes.js": NOTES_STORE },
          tests: [
            { label: "listNotes of a missing file is []", check: `const { listNotes } = await load("notes.js"); eq(await wait(listNotes("nothing/here.json")), [], "no file yet");` },
            { label: "createNote returns the note and saves it", check: `const { createNote, listNotes } = await load("notes.js"); const n = await wait(createNote("t/a.json", "hello")); assert(/^[0-9a-f-]{36}$/.test(n.id), "the id should be a UUID"); eq(n.text, "hello", "text"); assert(!Number.isNaN(Date.parse(n.createdAt)), "createdAt should be an ISO time"); eq((await wait(listNotes("t/a.json"))).map((x) => x.id), [n.id], "the note should be stored");` },
            { label: "deleteNote removes it (true), or returns false", check: `const { createNote, deleteNote, listNotes } = await load("notes.js"); const n = await wait(createNote("t/b.json", "x")); await wait(createNote("t/b.json", "y")); eq(await wait(deleteNote("t/b.json", n.id)), true, "deleting an existing note"); eq(await wait(deleteNote("t/b.json", "missing")), false, "deleting a missing note"); eq((await wait(listNotes("t/b.json"))).map((x) => x.text), ["y"], "one note left");` },
            { label: "index.js runs as expected", check: `has(stdout(), "[ 'Read about streams', 'Try EventEmitter' ]\\ntrue false\\n1", "index.js output");` },
          ],
          hint: "listNotes: try/catch around JSON.parse(await readFile(file, \"utf8\")), [] on ENOENT. createNote and deleteNote: list, change the array, write it back (mkdir the folder first).",
          successMessage: "A complete little data service, testable without HTTP. The deliverable puts a server in front of it.",
        },
      },
      {
        id: "a-be-ex-env-config",
        title: "Exercise: load configuration from environment variables",
        explain:
          "The notes server needs two settings that differ between machines: the PORT and the NOTES_FILE path. Locally they come from a .env file loaded with node --env-file=.env; on a server, the platform sets them. Remember Node's rule: a variable already set in the environment wins over the file, so the platform can always override your local defaults.",
        nodeLab: {
          task:
            "In config.js export config = { port, notesFile }: port from PORT (a number, default 3000), notesFile from NOTES_FILE (default \"data/notes.json\"). The start script runs node --env-file=.env index.js; .env sets PORT=4000. The checks also run it with variables set in the shell.",
          command: "node --env-file=.env index.js",
          files: {
            "package.json": pkg({ name: "notes-server", scripts: { start: "node --env-file=.env index.js" } }),
            ".env": "PORT=4000\n",
            "config.js": "export const config = {};\n",
            "index.js": 'import { config } from "./config.js";\n\nconsole.log(`port=${config.port} (${typeof config.port}) notesFile=${config.notesFile}`);\n',
          },
          readOnly: ["package.json", ".env", "index.js"],
          open: "config.js",
          solution: { "config.js": 'export const config = {\n  port: Number(process.env.PORT ?? 3000),\n  notesFile: process.env.NOTES_FILE ?? "data/notes.json",\n};\n' },
          tests: [
            { label: "With .env: port 4000 (a number), the default notes file", check: `has(stdout(), "port=4000 (number) notesFile=data/notes.json", "values from .env and the default");` },
            { label: "Without .env: port 3000", check: `await run("node index.js"); has(stdout(), "port=3000 (number)", "the default port");` },
            { label: "The shell's PORT and NOTES_FILE win over .env", check: `await run("PORT=9000 NOTES_FILE=/tmp/n.json node --env-file=.env index.js"); has(stdout(), "port=9000 (number) notesFile=/tmp/n.json", "variables set in the shell take precedence over the file");` },
          ],
          hint: "port: Number(process.env.PORT ?? 3000), notesFile: process.env.NOTES_FILE ?? \"data/notes.json\".",
          successMessage: "PORT=9000 beat the .env's 4000: that precedence is what lets a platform configure your app without editing files.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 5.P · DELIVERABLE: A NOTES SERVER
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l38-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["5.P"],
    title: "Deliverable: A Node.js Server with a File-Based Data Service",
    subtitle: "A notes API from Node's own modules",
    estimatedMinutes: 90,
    intro: "This week's deliverable is a real server: a notes API built only from Node's own modules, storing its data in a file, configured from the environment, and keeping its notes across restarts.",
    atoms: [
      {
        id: "a-be-w5-deliverable",
        title: "The notes server",
        explain:
          "The server connects the pieces from the exercises: config.js (port and notes file from the environment), notes.js (the data service), and server.js, which routes requests to it: GET /notes lists notes; POST /notes with { \"text\": \"…\" } creates one (201, or 400 if text is missing, empty or longer than 500 characters); DELETE /notes/<id> deletes one (204, or 404); anything else is 404, with 405 for a wrong method on /notes. Every response is JSON except the empty 204. Because notes are in a file, they survive a restart.",
        nodeLab: {
          task:
            "Write server.js using node:http, config.js and notes.js (both done for you). Routes: GET /notes → 200 array; POST /notes {text} → 201 note, 400 {\"error\":\"text is required (1-500 characters)\"} for missing/empty/too long text or invalid JSON; DELETE /notes/:id → 204 empty, or 404 {\"error\":\"Note not found\"}; other methods on /notes → 405 with Allow: GET, POST; anything else → 404 {\"error\":\"Not found\"}. Log \"Notes API on port <port>\" at startup.",
          command: "node --env-file=.env server.js",
          files: {
            "package.json": pkg({ name: "notes-server", scripts: { start: "node --env-file=.env server.js" } }),
            ".env": "PORT=3000\nNOTES_FILE=data/notes.json\n",
            "config.js": 'export const config = {\n  port: Number(process.env.PORT ?? 3000),\n  notesFile: process.env.NOTES_FILE ?? "data/notes.json",\n};\n',
            "notes.js": NOTES_STORE,
            "server.js": 'import http from "node:http";\nimport { config } from "./config.js";\nimport { listNotes, createNote, deleteNote } from "./notes.js";\n\n// Build the notes API here.\n',
          },
          readOnly: ["package.json", ".env", "config.js", "notes.js"],
          open: "server.js",
          solution: {
            "server.js":
              'import http from "node:http";\nimport { config } from "./config.js";\nimport { listNotes, createNote, deleteNote } from "./notes.js";\n\nfunction send(res, status, body, headers = {}) {\n  if (body === undefined) {\n    res.writeHead(status, headers);\n    return res.end();\n  }\n  res.writeHead(status, { "Content-Type": "application/json", ...headers });\n  res.end(JSON.stringify(body));\n}\n\nasync function readJson(req) {\n  let raw = "";\n  for await (const chunk of req) raw += chunk;\n  return JSON.parse(raw);\n}\n\nconst invalid = { error: "text is required (1-500 characters)" };\n\nconst server = http.createServer(async (req, res) => {\n  try {\n    const { pathname } = new URL(req.url, "http://localhost");\n    if (pathname === "/notes") {\n      if (req.method === "GET") return send(res, 200, await listNotes(config.notesFile));\n      if (req.method === "POST") {\n        let body;\n        try {\n          body = await readJson(req);\n        } catch {\n          return send(res, 400, invalid);\n        }\n        const text = typeof body?.text === "string" ? body.text.trim() : "";\n        if (!text || text.length > 500) return send(res, 400, invalid);\n        return send(res, 201, await createNote(config.notesFile, text));\n      }\n      return send(res, 405, { error: "Method not allowed" }, { Allow: "GET, POST" });\n    }\n    const match = /^\\/notes\\/([^/]+)$/.exec(pathname);\n    if (match && req.method === "DELETE") {\n      const deleted = await deleteNote(config.notesFile, match[1]);\n      return deleted ? send(res, 204) : send(res, 404, { error: "Note not found" });\n    }\n    send(res, 404, { error: "Not found" });\n  } catch (err) {\n    console.error(err);\n    send(res, 500, { error: "Something went wrong" });\n  }\n});\n\nserver.listen(config.port, () => console.log(`Notes API on port ${config.port}`));\n',
          },
          requests: [
            { label: "GET /notes", method: "GET", path: "/notes" },
            { label: "POST /notes", method: "POST", path: "/notes", body: { text: "Learn the http module" } },
            { label: "POST empty", method: "POST", path: "/notes", body: { text: "" } },
            { label: "PUT /notes", method: "PUT", path: "/notes" },
          ],
          tests: [
            { label: "It starts and logs the port", check: `has(stdout(), "Notes API on port 3000", "the startup line");` },
            { label: "POST /notes creates a note (201) that GET /notes lists", check: `const r = await post("/notes", { text: "  Learn the http module  " }); eq(r.status, 201, "POST status"); eq(r.json.text, "Learn the http module", "the text, trimmed"); const all = await get("/notes"); eq(all.status, 200, "GET status"); assert(all.json.some((n) => n.id === r.json.id), "the new note should be listed");` },
            { label: "Bad input → 400 with the message", check: `for (const body of [{}, { text: "" }, { text: "   " }, { text: "x".repeat(501) }, { text: 42 }]) { const r = await post("/notes", body); eq(r.status, 400, "POST " + JSON.stringify(body).slice(0, 40)); eq(r.json, { error: "text is required (1-500 characters)" }, "the error"); } const bad = await request("POST", "/notes", { body: "{nope", headers: { "Content-Type": "application/json" } }); eq(bad.status, 400, "invalid JSON");` },
            { label: "DELETE /notes/:id → 204, then 404", check: `const n = (await post("/notes", { text: "temporary" })).json; const d1 = await request("DELETE", "/notes/" + n.id); eq(d1.status, 204, "first delete"); eq(d1.text, "", "204 has no body"); const d2 = await request("DELETE", "/notes/" + n.id); eq(d2.status, 404, "second delete"); eq(d2.json, { error: "Note not found" }, "the error");` },
            { label: "Wrong method → 405 with Allow; unknown path → 404", check: `const r = await request("PUT", "/notes"); eq(r.status, 405, "PUT /notes"); eq(r.headers["allow"], "GET, POST", "Allow"); eq((await get("/somewhere")).status, 404, "GET /somewhere");` },
            { label: "Notes survive a restart", check: `const n = (await post("/notes", { text: "keep me" })).json; await restart(); const all = await get("/notes"); assert(all.json.some((x) => x.id === n.id), "after a restart the note should still be there: it is in data/notes.json");` },
          ],
          hint: "Parse the path with new URL(req.url, \"http://localhost\"). Handle /notes by method; match /notes/<id> with a regular expression for DELETE; wrap everything in try/catch for a 500.",
          successMessage: "A complete API from Node's own modules, with validation, correct status codes and persistence. Count the lines spent on routing and parsing: Express will replace most of them next week.",
        },
      },
    ],
    task: {
      title: "Week 5 deliverable: a Node.js server with a file-based data service",
      intro: "Build it here until every check passes, then run it for real.",
      prompts: [
        "Create the project on your computer and run it with npm start. Call every route with curl (curl -i to see status lines), including the invalid ones.",
        "Stop it with Ctrl+C, start it again, and show that the notes survived.",
        "Add GET /notes/:id (200 or 404) and PATCH /notes/:id to edit a note's text, with the same validation.",
        "Commit it to a GitHub repository with a README listing the routes, the configuration and example curl commands.",
        "Checkpoint: your server, built only from Node's modules, stores and serves notes from a file and is configured from the environment.",
      ],
      closing: "Next: Week 6, HTTP and REST in depth: methods, status codes, resources, pagination and error conventions.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
