/**
 * BACKEND ENGINEERING — PROJECT FILES SHOWN AND RUN
 *
 * CLIENT-SAFE. The exact files of the small projects that
 * scripts/beRecord.mjs writes to disk and RUNS to record the course's
 * terminals, and that lessons show and give to labs. The code a learner
 * reads is the code that produced the output they see.
 */

/* ── Week 1: the smallest web application, on Node's http module ──────── */
export const W1_SERVER = `// server.js — the smallest web application: a page and an API
const http = require("node:http");

const courses = [
  { id: 1, title: "Backend Engineering", weeks: 24 },
  { id: 2, title: "Relational Databases", weeks: 16 },
];

const server = http.createServer((req, res) => {
  console.log(\`\${req.method} \${req.url}\`);
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Memora Academy</h1><p>Two courses are open.</p>");
  } else if (req.url === "/api/courses") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(courses));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
`;

export const W1_LOOKUP = `// lookup.js — ask DNS for a domain's IP addresses, the browser's first step
const dns = require("node:dns/promises");

const domain = process.argv[2] || "example.com";

dns
  .lookup(domain, { all: true })
  .then((addresses) => {
    for (const a of addresses) console.log(\`\${domain} -> \${a.address} (IPv\${a.family})\`);
  })
  .catch((err) => console.error(\`\${domain}: \${err.code}\`));
`;

/* ── Week 3: fetching from a real public API ─────────────────────────── */
export const W3_FETCH_USERS = `// fetch-users.js — fetch real data from a public API and use it
const url = "https://jsonplaceholder.typicode.com/users";

const response = await fetch(url);
console.log("Status:", response.status, response.statusText);
console.log("Content-Type:", response.headers.get("content-type"));

const users = await response.json();
console.log(\`\${users.length} users\`);
for (const user of users.slice(0, 3)) {
  console.log(\`- \${user.name} (\${user.email}), \${user.address.city}\`);
}
`;

export const W3_FETCH_MISSING = `// fetch-missing.js — fetch does not throw for 404: check response.ok
const response = await fetch("https://jsonplaceholder.typicode.com/users/9999");
console.log("ok:", response.ok, "status:", response.status);
const body = await response.json();
console.log("body:", body);
`;

export const W3_FETCH_DOWN = `// fetch-down.js — a host that does not exist: fetch rejects
try {
  await fetch("https://no-such-api.example/users");
} catch (err) {
  console.log(err.name + ": " + err.message);
  console.log("cause:", err.cause.code);
}
`;

/* ── Week 4: the course API project, for the terminal, npm and Git ────── */
export const W4_SERVER = `// server.js — the course API
import express from "express";
import { courses } from "./src/routes/courses.js";

const app = express();
app.use(express.json());
app.use("/courses", courses);

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;

export const W4_SERVER_PORT_ENV = W4_SERVER.replace(
  'app.listen(3000, () => console.log("Course API on http://localhost:3000"));',
  'const port = process.env.PORT || 3000;\napp.listen(port, () => console.log(`Course API on http://localhost:${port}`));'
);

export const W4_SERVER_PORT_8080 = W4_SERVER.replace(
  'app.listen(3000, () => console.log("Course API on http://localhost:3000"));',
  'app.listen(8080, () => console.log("Course API on http://localhost:8080"));'
);

export const W4_SERVER_RESOLVED = W4_SERVER.replace(
  'app.listen(3000, () => console.log("Course API on http://localhost:3000"));',
  'const port = process.env.PORT || 8080;\napp.listen(port, () => console.log(`Course API on http://localhost:${port}`));'
);

export const W4_ROUTES = `// src/routes/courses.js — the /courses routes
import { Router } from "express";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../../data/courses.json", import.meta.url), "utf8"));
export const courses = Router();

courses.get("/", (req, res) => res.json(data));
`;

export const W4_ROUTES_SEARCH = W4_ROUTES.replace(
  'courses.get("/", (req, res) => res.json(data));',
  'courses.get("/", (req, res) => {\n  const q = String(req.query.q ?? "").toLowerCase();\n  res.json(q ? data.filter((c) => c.title.toLowerCase().includes(q)) : data);\n});'
);

export const W4_COURSES_JSON = `[
  { "id": 1, "title": "Backend Engineering", "weeks": 24 },
  { "id": 2, "title": "Relational Databases", "weeks": 16 }
]
`;

export const W4_PACKAGE = `{
  "name": "course-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.3.0"
  }
}
`;

export const W4_NOTES = "Ideas: search, filters, pagination.\n";

export const W4_README = `# Course API

The academy's course catalogue as a JSON API.
`;

export const W4_ENV_LEAK = "DATABASE_URL=postgres://academy:S3cret-Pa55@db.academy.example:5432/academy\nJWT_SECRET=dev-secret-do-not-share\n";

export const W4_GITIGNORE = "node_modules/\n.env\n";

export const W4_MESSY = `import express from "express"
import { readFileSync } from 'node:fs'

const app = express()
const unused = 42
app.get("/health", (req, res) => { res.json({status:"ok", uptime: proces.uptime()}) })

app.listen(3000)
`;

export const W4_TIDY = `import express from "express";

const app = express();
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(3000);
`;

export const W4_ESLINT_CONFIG = `// eslint.config.js — ESLint's recommended rules, for Node.js code
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  { languageOptions: { globals: globals.node } },
];
`;
