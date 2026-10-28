/**
 * BACKEND ENGINEERING · WEEK 11 · CONNECTING NODE.JS TO POSTGRESQL
 *
 * Curriculum 11.1 – 11.P. Drivers and connection strings; pools;
 * parameterized queries and SQL injection; transactions; isolation;
 * migrations and seed data; ORMs; Prisma schema, relations and queries;
 * repositories and database errors; safe schema changes; five exercises;
 * and a persistent course-management API on PostgreSQL with Prisma.
 *
 * node-postgres labs run the real `pg` driver against the lab's PostgreSQL
 * (PGlite). Prisma labs run Prisma 7.10.1 itself in the lab (see
 * src/academy/node/runtime/prisma.js): `npx prisma migrate deploy` applies
 * the migrations recorded with `prisma migrate dev` in the w11-prisma
 * session (later steps are made by the real CLI: scripts/bePrisma.mjs),
 * `npx prisma generate` runs Prisma's generator, and the generated client
 * talks to PostgreSQL through @prisma/adapter-pg.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, out, pkg, shown, term } from "./be-helpers.js";
import * as P from "./be-projects.js";
import { PRISMA_MIGRATIONS } from "./be-prisma.js";
import { NO_TYPE_ERRORS, TSCONFIG } from "./be-w3-async-ts.js";

export const SECTION_ID = "be-s11-node-postgres";
const MODULE = "be-w11-node-postgres";

/* ── The recorded Prisma project ──────────────────────────────────────── */

const REC = "w11-prisma";
const INIT_DIR = out(REC, "ls prisma/migrations").split(/\s+/).find((n) => /^\d{14}_init$/.test(n));
const LEVEL_DIR = /`(\d{14}_add_course_level)`/.exec(out(REC, "npx prisma migrate dev --name add_course_level"))[1];
const MIGRATIONS = {
  init: [INIT_DIR, `${out(REC, "cat prisma/migrations/*_init/migration.sql")}\n`],
  level: [LEVEL_DIR, `${out(REC, "cat prisma/migrations/*_add_course_level/migration.sql")}\n`],
  seats_payments: ["20261028090000_seats_payments", PRISMA_MIGRATIONS.seats_payments],
};
const PRISMA_CONFIG = `${out(REC, "cat prisma7.config.ts")}\n`;
const LOCK = `${out(REC, "cat prisma/migrations/migration_lock.toml")}\n`;
const GITIGNORE = `${out(REC, "cat .gitignore")}\n`;
const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";

const PRISMA_PKG = pkg({
  name: "course-api",
  scripts: { start: "node src/server.ts", typecheck: "tsc --noEmit" },
  deps: ["@prisma/adapter-pg", "@prisma/client", "dotenv", "express"],
  dev: ["prisma", "typescript", "@types/node", "@types/express"],
});
/** Migrations, then the client, then the program: the order a fresh clone needs. */
const PRISMA_CMD = (then = "npm start") => `npx prisma migrate deploy && npx prisma generate && ${then}`;

/** A Prisma project as `prisma init` set it up, with the schema and the migrations given. */
function prismaProject({ schema = P.W11_SCHEMA_LEVEL, migrations = ["init", "level"], files = {} } = {}) {
  const project = {
    "package.json": PRISMA_PKG,
    "tsconfig.json": TSCONFIG,
    ".env": `DATABASE_URL="${DB_URL}"\n`,
    ".gitignore": GITIGNORE,
    "prisma7.config.ts": PRISMA_CONFIG,
    "prisma/schema.prisma": schema,
    "prisma/migrations/migration_lock.toml": LOCK,
    "src/db.ts": P.W11_DB,
  };
  for (const m of migrations) project[`prisma/migrations/${MIGRATIONS[m][0]}/migration.sql`] = MIGRATIONS[m][1];
  return { ...project, ...files };
}
const PRISMA_READ_ONLY = ["package.json", "tsconfig.json", ".env", ".gitignore", "prisma7.config.ts", "prisma/migrations/migration_lock.toml", "src/db.ts"];
const migrationFiles = (names) => names.map((m) => `prisma/migrations/${MIGRATIONS[m][0]}/migration.sql`);

/* ── Seed data (prisma/seed.ts) ───────────────────────────────────────── */

const COURSE_ROWS = [
  ["BE-101", "Backend Engineering", 24, 120000, "beginner"],
  ["DB-101", "Relational Databases", 16, 80000, "beginner"],
  ["WD-201", "React Development", 16, 90000, "intermediate"],
  ["CS-101", "Cybersecurity", 16, 85000, "beginner"],
  ["MD-101", "Mobile App Development", 24, 120000, "beginner"],
  ["DA-301", "Advanced Data Analysis", 12, 100000, "advanced"],
];

function seedTs({ seats = false, enrollments = false } = {}) {
  const courses = COURSE_ROWS.map(
    ([code, title, weeks, price, level]) => `  { code: "${code}", title: "${title}", weeks: ${weeks}, price: ${price}, level: "${level}"${seats ? `, seats: ${code === "BE-101" ? 2 : 30}` : ""} },`
  ).join("\n");
  return `import { prisma } from "../src/db.ts";

const courses = [
${courses}
];

const students = [
  { email: "ada@example.com", fullName: "Ada Obi" },
  { email: "bayo@example.com", fullName: "Bayo Adeyemi" },
  { email: "chi@example.com", fullName: "Chiamaka Eze" },
];

// upsert: the seed can run again without creating duplicates.
for (const course of courses) {
  await prisma.course.upsert({ where: { code: course.code }, update: course, create: course });
}
for (const student of students) {
  await prisma.student.upsert({ where: { email: student.email }, update: student, create: student });
}
${
  enrollments
    ? `
// Ada takes BE-101 and DB-101; Bayo takes BE-101.
const pairs = [["ada@example.com", "BE-101"], ["ada@example.com", "DB-101"], ["bayo@example.com", "BE-101"]];
for (const [email, code] of pairs) {
  const student = await prisma.student.findUniqueOrThrow({ where: { email } });
  const course = await prisma.course.findUniqueOrThrow({ where: { code } });
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: {},
    create: { studentId: student.id, courseId: course.id },
  });
}
`
    : ""
}
console.log(\`Seeded \${courses.length} courses and \${students.length} students.\`);
await prisma.$disconnect();
`;
}

/* ── Express pieces for the Prisma labs ───────────────────────────────── */

const ERRORS_TS = `export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}
`;

/** errors.ts with Prisma's errors mapped (the solution of Lesson 81's lab, given in later labs). */
const ERRORS_MAPPED_TS = `import type { NextFunction, Request, Response } from "express";
import { Prisma } from "./generated/prisma/client.ts";

export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

/** Prisma's error codes the API answers itself: https://pris.ly/d/prisma-errors */
const PRISMA_ERRORS: Record<string, [number, string, string]> = {
  P2002: [409, "CONFLICT", "A record with these values already exists"],
  P2003: [400, "INVALID_REFERENCE", "A referenced record does not exist"],
  P2025: [404, "NOT_FOUND", "The record does not exist"],
};

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError && PRISMA_ERRORS[err.code]) {
    const [status, code, message] = PRISMA_ERRORS[err.code];
    res.status(status).json({ error: { code, message } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
}
`;

const ERRORS_UNMAPPED_TS = ERRORS_MAPPED_TS.replace('import { Prisma } from "./generated/prisma/client.ts";\n', "")
  .replace(/\/\*\* Prisma's error codes[\s\S]*?\};\n\n/, "")
  .replace(/  if \(err instanceof Prisma[\s\S]*?\n  \}\n/, "");

const serverTs = (routers) => `import express, { type Request, type Response } from "express";
import { errorHandler } from "./errors.ts";
${routers.map(([name, file]) => `import { ${name} } from "./routes/${file}.ts";`).join("\n")}

const app = express();
app.use(express.json());
${routers.map(([name, file]) => `app.use("/${file}", ${name});`).join("\n")}

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } });
});
app.use(errorHandler);

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;

/* ── node-postgres labs ───────────────────────────────────────────────── */

const PG_PKG = pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js" }, deps: ["express", "pg"] });
const PG_ENV = `DATABASE_URL=${DB_URL}\n`;
const PG_COURSES = `CREATE TABLE courses (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code      text NOT NULL UNIQUE,
  title     text NOT NULL,
  weeks     integer NOT NULL,
  price     integer NOT NULL,
  published boolean NOT NULL DEFAULT true
);
INSERT INTO courses (code, title, weeks, price, published) VALUES
  ('BE-101', 'Backend Engineering', 24, 120000, true),
  ('DB-101', 'Relational Databases', 16, 80000, true),
  ('WD-201', 'React Development', 16, 90000, true),
  ('CS-101', 'Cybersecurity', 16, 85000, true),
  ('AI-201', 'AI Engineering (draft)', 12, 150000, false);
`;
const PG_DB_JS = `import pg from "pg";

// One pool for the whole process, configured from the environment.
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;
const LISTEN_JS = `app.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 11.1 – 11.2 · DRIVERS, CONNECTION STRINGS AND POOLS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l76-node-pg",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2"],
    title: "Database Drivers, Connection Strings and Pools",
    subtitle: "The course API meets PostgreSQL",
    estimatedMinutes: 55,
    intro: "The courses array finally goes. node-postgres (the npm package pg) is the driver almost every Node.js PostgreSQL tool is built on, Prisma's adapter included.",
    atoms: [
      {
        id: "a-be-pg-connect",
        title: "Database drivers and connection strings",
        explain:
          "A DRIVER speaks the database's network protocol: pg sends SQL to PostgreSQL on port 5432 and turns the answer into JavaScript (integer → number, text → string, timestamptz → Date). It connects with a CONNECTION STRING, postgresql://user:password@host:5432/database, which holds a password, so it lives in the environment (DATABASE_URL in .env locally, the platform's settings in production), never in code. new pg.Pool({ connectionString: process.env.DATABASE_URL }) is created once per process; pool.query(text, params) runs a query and returns { rows, rowCount }.",
        nodeLab: {
          task:
            "Move the API onto PostgreSQL. In db.js export pool, a pg.Pool configured from process.env.DATABASE_URL. In server.js, answer GET /courses with { data: rows } for the published courses (id, code, title, weeks, price, ordered by id), GET /courses/:id with { data: course } or 404 COURSE_NOT_FOUND, and GET /health with { status: \"ok\", database: \"up\" } after running SELECT 1. Remove data.js.",
          db: PG_COURSES,
          files: {
            "package.json": PG_PKG,
            ".env": PG_ENV,
            "data.js": 'export const courses = [\n  { id: 1, code: "BE-101", title: "Backend Engineering", weeks: 24, price: 120000 },\n  { id: 2, code: "DB-101", title: "Relational Databases", weeks: 16, price: 80000 },\n];\n',
            "db.js": "",
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: courses }));

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  res.json({ data: course });
});

${LISTEN_JS}`,
          },
          readOnly: ["package.json", ".env"],
          open: "server.js",
          solution: {
            "data.js": null,
            "db.js": PG_DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", database: "up" });
});

app.get("/courses", async (req, res) => {
  const { rows } = await pool.query("SELECT id, code, title, weeks, price FROM courses WHERE published ORDER BY id");
  res.json({ data: rows });
});

app.get("/courses/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, code, title, weeks, price FROM courses WHERE id = $1", [Number(req.params.id)]);
  if (rows.length === 0) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  res.json({ data: rows[0] });
});

${LISTEN_JS}`,
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /courses/2", method: "GET", path: "/courses/2" },
            { label: "GET /health", method: "GET", path: "/health" },
          ],
          tests: [
            { label: "GET /courses answers the published courses from PostgreSQL", check: `const want = await sql("SELECT id, code, title, weeks, price FROM courses WHERE published ORDER BY id"); eq((await get("/courses")).json, { data: want }, "GET /courses");` },
            { label: "It is live data: a row added in the database appears", check: `await sql("INSERT INTO courses (code, title, weeks, price) VALUES ('QA-101', 'Software Testing', 8, 50000)"); assert((await get("/courses")).json.data.some((c) => c.code === "QA-101"), "a course inserted in PostgreSQL should appear in GET /courses: the API must read the database, not data.js"); lacks(JSON.stringify((await get("/courses")).json), "AI-201", "unpublished courses stay hidden");` },
            { label: "GET /courses/:id and 404", check: `eq((await get("/courses/2")).json.data.code, "DB-101", "GET /courses/2"); const r = await get("/courses/99"); eq([r.status, r.json?.error?.code], [404, "COURSE_NOT_FOUND"], "GET /courses/99");` },
            { label: "GET /health checks the database", check: `eq((await get("/health")).json, { status: "ok", database: "up" }, "GET /health");` },
            { label: "The connection string comes from the environment", check: `has(file("db.js"), "process.env.DATABASE_URL", "db.js should read process.env.DATABASE_URL"); lacks((file("db.js") || "") + (file("server.js") || ""), "app-password", "never write the database password in code"); lacks(file("server.js"), "data.js", "server.js should no longer import data.js");` },
          ],
          hint: "db.js: import pg from \"pg\"; export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL }). In each handler: const { rows } = await pool.query(\"SELECT …\"). For one course, WHERE id = $1 with [Number(req.params.id)].",
          successMessage: "The API now reads PostgreSQL. Restart it and nothing is lost; run two copies and they agree.",
        },
      },
      {
        id: "a-be-pools",
        title: "Connection pools",
        explain:
          "Opening a PostgreSQL connection takes several round trips and a server process (each connection is a process using memory), so servers allow a limited number (max_connections, often 100). A POOL keeps a few connections open (pg's default max is 10) and lends one to each query: pool.query() borrows and returns automatically. For several statements on the SAME connection (a transaction), borrow one with const client = await pool.connect() and ALWAYS give it back with client.release() in a finally block; a client never released is a leak, and after ten leaks every request waits forever. Create one pool per process, at startup.",
        decision: decide({
          scenario: "A handler does: const client = new pg.Client(process.env.DATABASE_URL); await client.connect(); const r = await client.query(…); res.json(r.rows); — and never calls client.end(). Under load, the database starts refusing connections.",
          question: "What is the fix?",
          right: ["Create one pg.Pool at startup and use pool.query(…) in handlers; the pool reuses a fixed number of connections", "Connections are expensive and limited."],
          wrong: [
            ["Raise max_connections to 10,000", "Each connection is a server process; this moves the crash to memory."],
            ["Call client.end() and keep creating a Client per request", "No leak, but a slow connection handshake on every request."],
            ["Create a new Pool in every handler", "That is a new set of connections per request: the same leak."],
          ],
          at: 0,
          aftermath: "Week 18 adds PgBouncer, a pool in front of PostgreSQL shared by many API servers.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 11.3 · PARAMETERIZED QUERIES AND SQL INJECTION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l77-injection",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.3"],
    title: "Parameterized Queries and SQL Injection",
    subtitle: "Never build SQL from user input",
    estimatedMinutes: 50,
    intro: "SQL injection has been in the OWASP Top 10 for over twenty years, and it still appears whenever a query is glued together from strings. The fix takes one character: $1.",
    atoms: [
      {
        id: "a-be-sql-injection",
        title: "Parameterized queries",
        explain:
          "`SELECT … WHERE title ILIKE '%${q}%'` puts the user's text INSIDE the SQL, so text containing a quote ends the string and continues as SQL: q = x' OR true -- returns every row, and q = '; DROP TABLE courses; -- runs a second statement. A PARAMETERIZED query sends the SQL and the values separately: pool.query(\"… WHERE title ILIKE $1\", [`%${q}%`]). PostgreSQL parses the SQL first, then treats $1 as a value, whatever it contains. Use parameters for every value from outside (body, query string, headers, even your own database); identifiers such as column names cannot be parameters, so choose them from an allow-list (Week 6's sort fields).",
        nodeLab: {
          task:
            "GET /courses/search?q= builds its SQL from the query string. Try the presets: one leaks unpublished courses, one crashes, one could drop the table. Make the query parameterized ($1) so every value of q is just text to search for.",
          db: PG_COURSES,
          files: {
            "package.json": PG_PKG,
            ".env": PG_ENV,
            "db.js": PG_DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();

app.get("/courses/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  const { rows } = await pool.query(\`SELECT code, title FROM courses WHERE published AND title ILIKE '%\${q}%' ORDER BY code\`);
  res.json({ data: rows });
});

app.get("/courses/count", async (req, res) => {
  const { rows } = await pool.query("SELECT count(*)::int AS courses FROM courses");
  res.json(rows[0]);
});

${LISTEN_JS}`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();

app.get("/courses/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  // $1 is a value, never SQL: whatever q contains is only searched for.
  const { rows } = await pool.query("SELECT code, title FROM courses WHERE published AND title ILIKE $1 ORDER BY code", [\`%\${q}%\`]);
  res.json({ data: rows });
});

app.get("/courses/count", async (req, res) => {
  const { rows } = await pool.query("SELECT count(*)::int AS courses FROM courses");
  res.json(rows[0]);
});

${LISTEN_JS}`,
          },
          requests: [
            { label: "q=eng", method: "GET", path: "/courses/search?q=eng" },
            { label: "q=x' OR true --", method: "GET", path: "/courses/search?q=x'%20OR%20true%20--" },
            { label: "q=O'Brien", method: "GET", path: "/courses/search?q=O'Brien" },
            { label: "q='; DROP TABLE courses; --", method: "GET", path: "/courses/search?q='%3B%20DROP%20TABLE%20courses%3B%20--" },
            { label: "GET /courses/count", method: "GET", path: "/courses/count" },
          ],
          tests: [
            { label: "A normal search still works", check: `const r = await get("/courses/search?q=eng"); eq(r.json, { data: [{ code: "BE-101", title: "Backend Engineering" }] }, "q=eng finds Backend Engineering, and not the unpublished AI Engineering draft");` },
            { label: "x' OR true -- leaks nothing", check: `const r = await get("/courses/search?q=" + encodeURIComponent("x' OR true --")); eq(r.status, 200, "status"); eq(r.json.data, [], "no course has that text in its title");` },
            { label: "A title with a quote does not crash the query", check: `eq((await get("/courses/search?q=" + encodeURIComponent("O'Brien"))).status, 200, "q=O'Brien");` },
            { label: "'; DROP TABLE courses; -- drops nothing", check: `await get("/courses/search?q=" + encodeURIComponent("'; DROP TABLE courses; --")); eq(await sql("SELECT count(*)::int AS n FROM courses"), [{ n: 5 }], "the courses table should still have its 5 rows");` },
            { label: "The query uses a parameter", check: `has(file("server.js"), "$1", "use $1 in the SQL and pass the value in the parameters array"); assert(!/ILIKE '%\\$\\{/.test(file("server.js")), "q is still inserted into the SQL text");` },
          ],
          hint: "pool.query(\"… WHERE published AND title ILIKE $1 ORDER BY code\", [`%${q}%`]): the % signs go in the value, not in the SQL.",
          successMessage: "Three attacks, three harmless searches. The DROP TABLE preset really dropped the table before the fix: PostgreSQL runs every statement it is sent.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 11.4 – 11.5 · TRANSACTIONS AND ISOLATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l78-transactions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.4", "11.5"],
    title: "Transactions, Rollback and Isolation",
    subtitle: "All of it, or none of it",
    estimatedMinutes: 65,
    intro: "Enrolling a student is three writes: take a seat, create the enrollment, record the payment. If the third fails, the first two must not stay. That is what transactions are for.",
    atoms: [
      {
        id: "a-be-transactions",
        title: "Transactions and rollback",
        explain:
          "BEGIN starts a TRANSACTION; COMMIT makes all its changes permanent at once; ROLLBACK undoes all of them. Until COMMIT, other connections do not see the changes. Every statement of a transaction must run on the SAME connection, so with a pool: const client = await pool.connect(); try { await client.query(\"BEGIN\"); … await client.query(\"COMMIT\"); } catch (err) { await client.query(\"ROLLBACK\"); throw err; } finally { client.release(); }. Forgetting ROLLBACK leaves the connection in a failed transaction; forgetting release() leaks it.",
        nodeLab: {
          task:
            "POST /enrollments runs three statements (take a seat, insert the enrollment, insert the payment) separately, so a failure half-way leaves a seat taken and an enrollment without payment. Run them in one transaction on one client from the pool, with ROLLBACK on any error and the client released in finally. Errors still answer 400 ENROLLMENT_FAILED.",
          db: `CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, seats integer NOT NULL CHECK (seats >= 0));
CREATE TABLE students (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), UNIQUE (student_id, course_id));
CREATE TABLE payments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, enrollment_id integer NOT NULL REFERENCES enrollments (id), amount integer NOT NULL CHECK (amount > 0));
INSERT INTO courses (code, seats) VALUES ('BE-101', 2), ('DB-101', 30);
INSERT INTO students (email) VALUES ('ada@example.com'), ('bayo@example.com'), ('chi@example.com'), ('dayo@example.com');
`,
          files: {
            "package.json": PG_PKG,
            ".env": PG_ENV,
            "db.js": PG_DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/courses", async (req, res) => {
  const { rows } = await pool.query("SELECT code, seats FROM courses ORDER BY id");
  res.json({ data: rows });
});

app.post("/enrollments", async (req, res) => {
  const { studentId, courseId, amount } = req.body;
  try {
    await pool.query("UPDATE courses SET seats = seats - 1 WHERE id = $1", [courseId]);
    const { rows } = await pool.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id", [studentId, courseId]);
    await pool.query("INSERT INTO payments (enrollment_id, amount) VALUES ($1, $2)", [rows[0].id, amount]);
    res.status(201).json({ data: { enrollmentId: rows[0].id } });
  } catch (err) {
    res.status(400).json({ error: { code: "ENROLLMENT_FAILED", message: err.message } });
  }
});

${LISTEN_JS}`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/courses", async (req, res) => {
  const { rows } = await pool.query("SELECT code, seats FROM courses ORDER BY id");
  res.json({ data: rows });
});

app.post("/enrollments", async (req, res) => {
  const { studentId, courseId, amount } = req.body;
  // A transaction runs on one connection: borrow it from the pool, and always give it back.
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE courses SET seats = seats - 1 WHERE id = $1", [courseId]);
    const { rows } = await client.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id", [studentId, courseId]);
    await client.query("INSERT INTO payments (enrollment_id, amount) VALUES ($1, $2)", [rows[0].id, amount]);
    await client.query("COMMIT");
    res.status(201).json({ data: { enrollmentId: rows[0].id } });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: { code: "ENROLLMENT_FAILED", message: err.message } });
  } finally {
    client.release();
  }
});

${LISTEN_JS}`,
          },
          requests: [
            { label: "POST ada → DB-101", method: "POST", path: "/enrollments", body: { studentId: 1, courseId: 2, amount: 80000 } },
            { label: "POST bad payment", method: "POST", path: "/enrollments", body: { studentId: 2, courseId: 2, amount: 0 } },
            { label: "GET /courses", method: "GET", path: "/courses" },
          ],
          tests: [
            { label: "A valid enrollment writes all three changes", check: `const r = await post("/enrollments", { studentId: 1, courseId: 2, amount: 80000 }); eq(r.status, 201, "status"); eq(await sql("SELECT (SELECT seats FROM courses WHERE id = 2) AS seats, (SELECT count(*)::int FROM enrollments WHERE student_id = 1) AS enrollments, (SELECT count(*)::int FROM payments) AS payments"), [{ seats: 29, enrollments: 1, payments: 1 }], "seat taken, enrollment and payment stored");` },
            { label: "A failed payment leaves nothing behind", check: `const r = await post("/enrollments", { studentId: 2, courseId: 2, amount: 0 }); eq([r.status, r.json?.error?.code], [400, "ENROLLMENT_FAILED"], "amount 0 breaks the payments CHECK"); eq(await sql("SELECT (SELECT seats FROM courses WHERE id = 2) AS seats, (SELECT count(*)::int FROM enrollments WHERE student_id = 2) AS bayo"), [{ seats: 29, bayo: 0 }], "no seat taken and no enrollment for Bayo: the whole transaction rolled back");` },
            { label: "A duplicate enrollment takes no seat", check: `eq((await post("/enrollments", { studentId: 1, courseId: 2, amount: 80000 })).status, 400, "Ada again in DB-101"); eq(await sql("SELECT seats FROM courses WHERE id = 2"), [{ seats: 29 }], "the seat taken before the duplicate insert failed is given back");` },
            { label: "A full course stays full and consistent", check: `for (const s of [3, 4]) eq((await post("/enrollments", { studentId: s, courseId: 1, amount: 120000 })).status, 201, "student " + s + " in BE-101 (2 seats)"); const r = await post("/enrollments", { studentId: 2, courseId: 1, amount: 120000 }); eq(r.status, 400, "a third student in BE-101"); eq(await sql("SELECT (SELECT seats FROM courses WHERE id = 1) AS seats, (SELECT count(*)::int FROM enrollments WHERE course_id = 1) AS enrolled"), [{ seats: 0, enrolled: 2 }], "0 seats and 2 enrollments");` },
            { label: "No connection is left behind after failures", check: `for (let i = 0; i < 12; i++) await post("/enrollments", { studentId: 1, courseId: 2, amount: 0 }); const r = await get("/courses"); eq(r.status, 200, "after 12 failed enrollments GET /courses should still answer: a client that was not rolled back or released holds the database"); const s = file("server.js"); for (const w of ["BEGIN", "COMMIT", "ROLLBACK", "release()", "pool.connect()"]) has(s, w, "use " + w);` },
          ],
          hint: "const client = await pool.connect(); then try { BEGIN … COMMIT, respond } catch { ROLLBACK, respond 400 } finally { client.release() }. Every statement uses client.query, not pool.query.",
          successMessage: "Three writes that happen together or not at all. The last check proves the subtle part: after a dozen failures, no connection was left stuck in a broken transaction.",
        },
      },
      {
        id: "a-be-isolation",
        title: "Isolation levels and concurrency basics",
        explain:
          "Transactions run at the same time; ISOLATION decides what they see of each other. PostgreSQL's default, READ COMMITTED, lets each statement see what was committed before it started. So a read-then-write in code (SELECT seats; if seats > 0 then UPDATE seats = seats - 1) lets two requests both read 1 and both enroll: an overbooked course. Fixes: do the check and the write in ONE statement (UPDATE courses SET seats = seats - 1 WHERE id = $1 AND seats > 0, then check rowCount), lock the row (SELECT … FOR UPDATE), or use SERIALIZABLE, where PostgreSQL aborts one of two conflicting transactions (error 40001) and your code retries it. Week 12 shows these races happening.",
        decision: decide({
          scenario: "Code: const { rows } = await client.query('SELECT seats FROM courses WHERE id = $1', [id]); if (rows[0].seats > 0) await client.query('UPDATE courses SET seats = $2 WHERE id = $1', [id, rows[0].seats - 1]); — inside BEGIN/COMMIT at READ COMMITTED. Two students enroll in the last seat at the same moment.",
          question: "What happens, and what is the simplest fix?",
          right: ["Both read seats = 1 and both enroll, writing 0 twice; use one statement: UPDATE courses SET seats = seats - 1 WHERE id = $1 AND seats > 0, and treat rowCount 0 as full", "The transaction alone does not stop it."],
          wrong: [
            ["Nothing goes wrong: the transaction makes it safe", "READ COMMITTED does not stop two transactions reading the same old value."],
            ["One request fails with a deadlock", "No locks conflict here; both succeed."],
            ["Add an index on seats", "Indexes do not prevent races."],
          ],
          at: 0,
          aftermath: "The CHECK (seats >= 0) constraint is the last line of defence: with it, the database refuses to go below zero whatever the code does.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 11.6 · MIGRATIONS AND SEED DATA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l79-migrations",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.6"],
    title: "Database Migrations and Seed Data",
    subtitle: "Schema changes as files in the repository",
    estimatedMinutes: 70,
    intro:
      "Every database the API runs against (your laptop, a colleague's, CI, production) must have the same schema. MIGRATIONS make that possible: each schema change is a numbered SQL file, applied in order, recorded in the database. This lesson sets up Prisma, which writes those files for you.",
    atoms: [
      {
        id: "a-be-prisma-setup",
        title: "Migrations with Prisma",
        explain:
          "npm install --save-dev prisma and npm install @prisma/client @prisma/adapter-pg dotenv, then npx prisma init writes prisma/schema.prisma, prisma7.config.ts (where the migrations live and which DATABASE_URL to use), .env and a .gitignore (by default it also installs AI-agent 'skills': --no-skills skips that). Describe the tables as models in schema.prisma; npx prisma migrate dev --name init compares the schema with the database, WRITES the SQL to prisma/migrations/<timestamp>_init/migration.sql, applies it, and records it in the _prisma_migrations table. Commit the migrations folder. Other machines run npx prisma migrate deploy, which applies the files that are not yet recorded, and never invents SQL itself.",
        example: shownAllPrismaSetup(),
        terminalExercise: term(REC, {
          only: [
            "npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills",
            "npx prisma migrate dev --name init",
            "ls prisma/migrations",
            "npx prisma migrate status",
            'DATABASE_URL="postgresql://ada:ada-password@localhost:5432/course_api_prod" npx prisma migrate deploy',
          ],
          goal: "Apply the existing migrations to a fresh database, as a deployment would, without creating any new migration.",
          accept: ['DATABASE_URL="postgresql://ada:ada-password@localhost:5432/course_api_prod" npx prisma migrate deploy'],
          near: [{ command: "npx prisma migrate dev --name init", why: "migrate dev is for development: it can create new migrations and reset data. Deployments use migrate deploy." }],
          hint: "migrate deploy, with the other database's DATABASE_URL set in the shell.",
          success: "migrate deploy applied the two committed files in order and recorded them. That is exactly what Week 19's deployment pipeline runs.",
        }),
      },
      {
        id: "a-be-seed",
        title: "Seed data",
        explain:
          "SEED data is what a fresh development database needs to be usable: the course catalogue, a few test students. Keep it in a script in the repository (prisma/seed.ts) and make it IDEMPOTENT, safe to run any number of times: upsert (where a unique field matches, update; otherwise create) instead of create, which fails the second time on unique codes. Prisma runs it with npx prisma db seed when prisma7.config.ts names it (migrations: { seed: \"node prisma/seed.ts\" }); running node prisma/seed.ts does the same. Never seed production with test users.",
        nodeLab: {
          task:
            "prisma/seed.ts creates the six courses and three students with create(), so the second run fails on the unique code. Make it idempotent with upsert (by code for courses, by email for students), so running it twice leaves exactly six courses and three students, with the values in the script.",
          command: PRISMA_CMD("node prisma/seed.ts"),
          db: { setup: "" },
          files: prismaProject({
            files: {
              "prisma/seed.ts": seedTs().replace("// upsert: the seed can run again without creating duplicates.\n", "").replace(
                /for \(const course of courses\) \{\n  await prisma\.course\.upsert\(\{ where: \{ code: course\.code \}, update: course, create: course \}\);\n\}\nfor \(const student of students\) \{\n  await prisma\.student\.upsert\(\{ where: \{ email: student\.email \}, update: student, create: student \}\);\n\}/,
                "for (const course of courses) {\n  await prisma.course.create({ data: course });\n}\nfor (const student of students) {\n  await prisma.student.create({ data: student });\n}"
              ),
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", ...migrationFiles(["init", "level"])],
          open: "prisma/seed.ts",
          solution: { "prisma/seed.ts": seedTs() },
          tests: [
            { label: "The migrations are applied", check: `eq(await sql('SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL ORDER BY migration_name'), [{ migration_name: "${INIT_DIR}" }, { migration_name: "${LEVEL_DIR}" }], "both migrations recorded in _prisma_migrations"); has(output(), "Seeded 6 courses and 3 students.", "the seed ran");` },
            { label: "Running the seed again works and duplicates nothing", check: `await run("node prisma/seed.ts"); eq(exitCode(), 0, "the second run should succeed, not fail on a unique code"); eq(await sql("SELECT (SELECT count(*)::int FROM courses) AS courses, (SELECT count(*)::int FROM students) AS students"), [{ courses: 6, students: 3 }], "still 6 courses and 3 students");` },
            { label: "The seed restores the values in the script", check: `await sql("UPDATE courses SET price = 1, level = 'advanced' WHERE code = 'BE-101'"); await run("node prisma/seed.ts"); eq(await sql("SELECT price, level FROM courses WHERE code = 'BE-101'"), [{ price: 120000, level: "beginner" }], "upsert's update should put BE-101 back as the script says");` },
          ],
          hint: "prisma.course.upsert({ where: { code: course.code }, update: course, create: course }); the same for students with where: { email }.",
          successMessage: "A seed anyone can run on any fresh database, as often as they like. The lab ran the recorded migrations first: the same files prisma migrate dev wrote in the terminal above.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 80 · 11.7 – 11.8 · ORMS AND PRISMA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l80-prisma",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.7", "11.8"],
    title: "ORMs, Prisma Schemas, Relations and Queries",
    subtitle: "Typed database access from a schema",
    estimatedMinutes: 85,
    intro: "Writing every query by hand is precise but repetitive, and nothing checks that a column you select exists. An ORM generates typed access from a description of the tables.",
    atoms: [
      {
        id: "a-be-orm",
        title: "ORM concepts",
        explain:
          "An ORM (Object-Relational Mapper) maps tables to objects in code: prisma.course.findMany({ where: { level: \"beginner\" } }) instead of SELECT … WHERE level = $1. Benefits: generated TYPES (a misspelt field is a compile error), relations loaded in one call, migrations from the schema, values always parameterized. Costs: another layer to learn, and complex reports are often clearer as SQL (Prisma's $queryRaw keeps them parameterized). The classic ORM trap is N+1: loading 50 courses, then querying each one's enrollments in a loop = 51 queries; ask for the relation in the first query (include or _count) and the ORM fetches it in one or two. Alternatives: query builders (Kysely, Drizzle) sit between SQL and an ORM.",
        decision: decide({
          scenario: "const courses = await prisma.course.findMany(); for (const c of courses) c.students = await prisma.enrollment.count({ where: { courseId: c.id } }); — GET /courses takes 2 seconds with 300 courses.",
          question: "What is the problem and the fix?",
          right: ["It is N+1: one query per course; ask for the counts in the first query with select: { …, _count: { select: { enrollments: true } } }", "301 round trips become one."],
          wrong: [
            ["PostgreSQL is too slow for 300 rows", "300 rows is tiny; 301 queries is not."],
            ["Run the 300 counts in parallel with Promise.all", "Still 300 queries, now competing for the pool."],
            ["Cache the response forever", "Hides the problem and serves stale counts."],
          ],
          at: 0,
          aftermath: "Turn on query logging (new PrismaClient({ adapter, log: ['query'] })) in development to see exactly how many queries a request makes.",
        }),
      },
      {
        id: "a-be-prisma-schema",
        title: "Prisma schema, models and relations",
        explain:
          "A Prisma MODEL describes a table: fields with types (Int, String, Boolean, DateTime, Decimal, Json; ? for optional), attributes (@id, @default(autoincrement()), @unique, @default(now())), and RELATIONS: a relation field with @relation(fields: [courseId], references: [id]) on the side holding the foreign key, and a list (enrollments Enrollment[]) on the other side. @@unique([studentId, courseId]) is a composite unique constraint. Names: models are PascalCase and fields camelCase in code, while the tables use snake_case: @map(\"full_name\") on a field and @@map(\"students\") on a model connect the two. The schema must describe the database exactly, or queries fail at run time.",
        nodeLab: {
          task:
            "The migrations (applied first) create courses, students and enrollments, but prisma/schema.prisma only describes Course. Add the Student and Enrollment models so the schema matches the database: Student (id, email unique, fullName mapped to full_name, its enrollments) and Enrollment (id, student and course relations with studentId and courseId mapped to student_id and course_id, enrolledAt mapped to enrolled_at with default now(), unique per student and course), each @@map'ped to its table. src/check.ts uses them.",
          command: PRISMA_CMD("node src/check.ts"),
          db: { setup: "" },
          files: prismaProject({
            schema: P.W11_SCHEMA_LEVEL.replace(/\nmodel Student \{[\s\S]*$/, "").replace("  enrollments Enrollment[]\n", ""),
            files: {
              "src/check.ts": `import { prisma } from "./db.ts";

const course = await prisma.course.create({ data: { code: "BE-101", title: "Backend Engineering", weeks: 24, price: 120000 } });
const student = await prisma.student.create({
  data: { email: "ada@example.com", fullName: "Ada Obi", enrollments: { create: { courseId: course.id } } },
  include: { enrollments: { include: { course: { select: { code: true } } } } },
});
console.log(JSON.stringify({ level: course.level, email: student.email, fullName: student.fullName, courses: student.enrollments.map((e) => e.course.code) }));

try {
  await prisma.enrollment.create({ data: { studentId: student.id, courseId: course.id } });
  console.log("A second identical enrollment was accepted");
} catch (err) {
  console.log("duplicate enrollment:", (err as { code?: string }).code);
}
await prisma.$disconnect();
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "src/check.ts", ...migrationFiles(["init", "level"])],
          open: "prisma/schema.prisma",
          solution: { "prisma/schema.prisma": P.W11_SCHEMA_LEVEL },
          tests: [
            { label: "Students and enrollments are created through their relations", check: `has(output(), '{"level":"beginner","email":"ada@example.com","fullName":"Ada Obi","courses":["BE-101"]}', "src/check.ts should print the student with the course they enrolled in:\\n" + output());` },
            { label: "The fields map to the snake_case columns", check: `eq(await sql("SELECT email, full_name FROM students"), [{ email: "ada@example.com", full_name: "Ada Obi" }], "the student is stored in students.full_name"); eq((await sql("SELECT count(*)::int AS n FROM enrollments"))[0].n, 1, "one enrollment in the enrollments table");` },
            { label: "A student is enrolled in a course once (P2002)", check: `has(output(), "duplicate enrollment: P2002", "the second identical enrollment should fail with P2002, from the unique (student_id, course_id) index");` },
            { label: "The schema is valid", check: `await run("npx prisma validate"); eq(exitCode(), 0, "npx prisma validate should succeed:\\n" + output());` },
          ],
          hint: "Copy the shape of Course: fields with @map(\"snake_name\") where the column name differs, @@map(\"table\") at the end. In Enrollment: student Student @relation(fields: [studentId], references: [id]) and studentId Int @map(\"student_id\"); same for course; @@unique([studentId, courseId]). Course needs enrollments Enrollment[] too.",
          successMessage: "Your schema now describes the database the migrations built, and the generated client knows every field and relation.",
        },
      },
      {
        id: "a-be-prisma-queries",
        title: "Prisma queries",
        explain:
          "The generated client has one property per model: findMany({ where, orderBy, skip, take, select, include }), findUnique({ where: { id } }) (null if missing), create({ data }), update({ where, data }) (throws P2025 if missing), delete, count, upsert, and $transaction([…]) to run several queries together. where filters compose: { level: \"beginner\", title: { contains: q, mode: \"insensitive\" } }. include loads relations; _count counts them; select picks fields. Every value is sent as a parameter: Prisma queries cannot be injected.",
        nodeLab: {
          task:
            "Write src/routes/courses.ts with Prisma: GET /courses?level&q&page&limit → { data, meta: { page, limit, total } } (level exact, q a case-insensitive title search, ordered by code, page 1 and limit 10 by default); GET /courses/:id → { data } with _count of enrollments, or 404 COURSE_NOT_FOUND; POST /courses → 201 { data }; PATCH /courses/:id (title, weeks, price, level) → { data } or 404; DELETE /courses/:id → 204 or 404.",
          command: PRISMA_CMD("node prisma/seed.ts && npm start"),
          db: { setup: "" },
          files: prismaProject({
            files: {
              "prisma/seed.ts": seedTs({ enrollments: true }),
              "src/errors.ts": ERRORS_MAPPED_TS,
              "src/server.ts": serverTs([["coursesRouter", "courses"]]),
              "src/routes/courses.ts": `import { Router } from "express";
import { prisma } from "../db.ts";
import { AppError } from "../errors.ts";

export const coursesRouter = Router();

// GET /, GET /:id, POST /, PATCH /:id, DELETE /:id
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", "prisma/seed.ts", "src/server.ts", "src/errors.ts", ...migrationFiles(["init", "level"])],
          open: "src/routes/courses.ts",
          solution: {
            "src/routes/courses.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";
import { AppError } from "../errors.ts";

export const coursesRouter = Router();

type ListQuery = { level?: string; q?: string; page?: string; limit?: string };

coursesRouter.get("/", async (req: Request<Record<string, never>, unknown, unknown, ListQuery>, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const where = {
    ...(req.query.level ? { level: req.query.level } : {}),
    ...(req.query.q ? { title: { contains: req.query.q, mode: "insensitive" as const } } : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.course.findMany({ where, orderBy: { code: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.course.count({ where }),
  ]);
  res.json({ data, meta: { page, limit, total } });
});

async function findOr404(id: number) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
  return course;
}

coursesRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);
  const course = await prisma.course.findUnique({ where: { id }, include: { _count: { select: { enrollments: true } } } });
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
  res.json({ data: course });
});

coursesRouter.post("/", async (req: Request, res: Response) => {
  const { code, title, weeks, price, level } = req.body;
  const course = await prisma.course.create({ data: { code, title, weeks, price, level } });
  res.status(201).json({ data: course });
});

coursesRouter.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);
  await findOr404(id);
  const { title, weeks, price, level } = req.body;
  // Fields left undefined are not changed.
  const course = await prisma.course.update({ where: { id }, data: { title, weeks, price, level } });
  res.json({ data: course });
});

coursesRouter.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);
  await findOr404(id);
  await prisma.course.delete({ where: { id } });
  res.status(204).end();
});
`,
          },
          requests: [
            { label: "GET /courses?level=beginner", method: "GET", path: "/courses?level=beginner" },
            { label: "GET /courses?q=DATA", method: "GET", path: "/courses?q=DATA" },
            { label: "GET /courses/1", method: "GET", path: "/courses/1" },
            { label: "PATCH /courses/3", method: "PATCH", path: "/courses/3", body: { price: 95000 } },
          ],
          tests: [
            { label: "GET /courses filters, searches and pages", check: `const a = await get("/courses?level=beginner"); eq(a.json.data.map((c) => c.code), ["BE-101", "CS-101", "DB-101", "MD-101"], "beginner courses by code"); eq(a.json.meta, { page: 1, limit: 10, total: 4 }, "meta"); eq((await get("/courses?q=DATA")).json.data.map((c) => c.code), ["DA-301", "DB-101"], "case-insensitive search: Advanced Data Analysis and Relational Databases"); const p = await get("/courses?limit=4&page=2"); eq([p.json.data.map((c) => c.code), p.json.meta.total], [["MD-101", "WD-201"], 6], "page 2 of 4 per page");` },
            { label: "GET /courses/:id includes the enrollment count", check: `const r = await get("/courses/1"); eq([r.json.data.code, r.json.data._count], ["BE-101", { enrollments: 2 }], "BE-101 has Ada and Bayo"); const n = await get("/courses/99"); eq([n.status, n.json.error?.code], [404, "COURSE_NOT_FOUND"], "GET /courses/99");` },
            { label: "POST creates a course in PostgreSQL", check: `const r = await post("/courses", { code: "AI-101", title: "AI Engineering", weeks: 12, price: 150000 }); eq(r.status, 201, "status"); eq([r.json.data.code, r.json.data.level], ["AI-101", "beginner"], "the new course, with the default level"); eq(await sql("SELECT title FROM courses WHERE code = 'AI-101'"), [{ title: "AI Engineering" }], "stored in courses");` },
            { label: "PATCH changes only the fields sent", check: `const r = await patch("/courses/3", { price: 95000 }); eq([r.status, r.json.data.price, r.json.data.title], [200, 95000, "React Development"], "PATCH /courses/3"); eq((await patch("/courses/99", { price: 1 })).status, 404, "PATCH a missing course");` },
            { label: "DELETE removes a course; a missing one is 404", check: `eq((await del("/courses/6")).status, 204, "DELETE DA-301 (no enrollments)"); eq((await sql("SELECT count(*)::int AS n FROM courses WHERE code = 'DA-301'"))[0].n, 0, "gone from the table"); eq((await del("/courses/6")).status, 404, "DELETE it again");` },
          ],
          hint: "where = { ...(level ? { level } : {}), ...(q ? { title: { contains: q, mode: \"insensitive\" } } : {}) }; findMany({ where, orderBy: { code: \"asc\" }, skip, take }) and count({ where }). findUnique returns null for a missing id: throw AppError(404, …).",
          successMessage: "Five endpoints, no SQL strings, every value parameterized, and the types of every field known to the editor.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 81 · 11.9 – 11.10 · DATABASE ERRORS, SAFE SCHEMA CHANGES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l81-db-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["11.9", "11.10"],
    title: "Repositories, Database Errors and Safe Schema Changes",
    subtitle: "When the database says no, and when the schema must change",
    estimatedMinutes: 70,
    intro: "Constraints make the database refuse bad data. The API must turn those refusals into clear 4xx answers, and must change the schema without losing the data already in it.",
    atoms: [
      {
        id: "a-be-prisma-errors",
        title: "Repository patterns and database error handling",
        explain:
          "Week 8's REPOSITORIES now wrap Prisma (or SQL): the rest of the code calls courseRepository.create(…), not prisma.course.create(…). Database refusals arrive as errors with codes: Prisma's PrismaClientKnownRequestError has code P2002 (unique constraint: a duplicate → 409), P2003 (foreign key: a reference to nothing → 400), P2025 (record required but not found, as update or delete of a missing id → 404). node-postgres gives PostgreSQL's SQLSTATE in err.code (23505, 23503, 23514). Map them in ONE place, the error handler, and let every other error be a logged 500. Do not check-then-insert to avoid duplicates (two requests can pass the check together): insert, and let the unique constraint decide.",
        nodeLab: {
          task:
            "The routes let Prisma's errors through, so a duplicate code, a missing course and an enrollment for a course that does not exist all answer 500. In src/errors.ts, map Prisma.PrismaClientKnownRequestError (import { Prisma } from the generated client): P2002 → 409 CONFLICT, P2003 → 400 INVALID_REFERENCE, P2025 → 404 NOT_FOUND, with { error: { code, message } }. Everything else stays a logged 500.",
          command: PRISMA_CMD("node prisma/seed.ts && npm start"),
          db: { setup: "" },
          files: prismaProject({
            files: {
              "prisma/seed.ts": seedTs({ enrollments: true }),
              "src/errors.ts": ERRORS_UNMAPPED_TS,
              "src/server.ts": serverTs([["coursesRouter", "courses"], ["enrollmentsRouter", "enrollments"]]),
              "src/routes/courses.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";

export const coursesRouter = Router();

coursesRouter.post("/", async (req: Request, res: Response) => {
  const { code, title, weeks, price } = req.body;
  res.status(201).json({ data: await prisma.course.create({ data: { code, title, weeks, price } }) });
});

coursesRouter.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { title, weeks, price } = req.body;
  res.json({ data: await prisma.course.update({ where: { id: Number(req.params.id) }, data: { title, weeks, price } }) });
});
`,
              "src/routes/enrollments.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/", async (req: Request, res: Response) => {
  const { studentId, courseId } = req.body;
  res.status(201).json({ data: await prisma.enrollment.create({ data: { studentId, courseId } }) });
});
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", "prisma/seed.ts", "src/server.ts", "src/routes/courses.ts", "src/routes/enrollments.ts", ...migrationFiles(["init", "level"])],
          open: "src/errors.ts",
          solution: { "src/errors.ts": ERRORS_MAPPED_TS },
          requests: [
            { label: "POST duplicate code", method: "POST", path: "/courses", body: { code: "BE-101", title: "Copy", weeks: 1, price: 0 } },
            { label: "PATCH /courses/99", method: "PATCH", path: "/courses/99", body: { price: 1 } },
            { label: "POST enrollment, course 99", method: "POST", path: "/enrollments", body: { studentId: 1, courseId: 99 } },
          ],
          tests: [
            { label: "A duplicate course code → 409 CONFLICT", check: `const r = await post("/courses", { code: "BE-101", title: "Copy", weeks: 1, price: 0 }); eq([r.status, r.json?.error?.code], [409, "CONFLICT"], "POST a course with an existing code");` },
            { label: "Updating a missing course → 404 NOT_FOUND", check: `const r = await patch("/courses/99", { price: 1 }); eq([r.status, r.json?.error?.code], [404, "NOT_FOUND"], "PATCH /courses/99");` },
            { label: "Enrolling in a course that does not exist → 400 INVALID_REFERENCE", check: `const r = await post("/enrollments", { studentId: 1, courseId: 99 }); eq([r.status, r.json?.error?.code], [400, "INVALID_REFERENCE"], "POST /enrollments with courseId 99"); const d = await post("/enrollments", { studentId: 1, courseId: 1 }); eq([d.status, d.json?.error?.code], [409, "CONFLICT"], "Ada is already in BE-101");` },
            { label: "Valid requests still work; errors reveal no internals", check: `eq((await post("/courses", { code: "AI-101", title: "AI Engineering", weeks: 12, price: 150000 })).status, 201, "a valid POST"); const r = await post("/courses", { code: "AI-101", title: "Again", weeks: 1, price: 0 }); lacks(r.text, "prisma", "the response should not mention Prisma or its query"); has(file("src/errors.ts"), "PrismaClientKnownRequestError", "check err instanceof Prisma.PrismaClientKnownRequestError");` },
          ],
          hint: "import { Prisma } from \"./generated/prisma/client.ts\"; then in errorHandler: if (err instanceof Prisma.PrismaClientKnownRequestError) and switch on err.code. A small table { P2002: [409, \"CONFLICT\", …], … } keeps it short.",
          successMessage: "Three kinds of refusal, three precise answers, all from one function. The routes did not change at all.",
        },
      },
      {
        id: "a-be-schema-changes",
        title: "Managing schema changes safely",
        explain:
          "Some changes are SAFE: add a table, add a column that is nullable or has a default, add an index (CONCURRENTLY on big tables). Others BREAK running code or data: drop or rename a column, add a required column without a default, change a type. Renaming title to name in the Prisma schema makes Prisma drop title and add name: every title is lost. Options: rename only in code with @map(\"title\"); or EXPAND AND CONTRACT across releases: add the new column, write to both, backfill, switch reads, and drop the old column only when no deployed code uses it. Always read the SQL before applying it: prisma migrate diff shows it, and prisma migrate dev --create-only writes the file for you to edit.",
        example: shown(REC, "npx prisma migrate dev --name rename_title"),
        terminalExercise: term(REC, {
          only: [
            "npx prisma migrate dev --name rename_title",
            "npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script",
            "npx prisma migrate dev --name name_maps_to_title",
            "npx prisma migrate status",
          ],
          goal: "Show the SQL Prisma would run to bring the database in line with the renamed field, without changing the database.",
          accept: ["npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script"],
          near: [{ command: "npx prisma migrate dev --name rename_title", why: "migrate dev tries to create and apply the migration (and refused here). migrate diff only shows the SQL." }],
          hint: "prisma migrate diff from the configured database to the schema file, as a --script.",
          success: "DROP COLUMN \"title\", ADD COLUMN \"name\": a rename in the schema is a delete plus an add in the database. The last command shows the safe alternative: name in code, @map(\"title\") in the database, and Prisma reports nothing to migrate.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 82 · 11.11 – 11.15 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l82-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["11.11", "11.12", "11.13", "11.14", "11.15"],
    title: "Exercises: The Course API on PostgreSQL",
    subtitle: "From arrays to a persistent, transactional API",
    estimatedMinutes: 180,
    intro: "Five exercises that finish the move to PostgreSQL: a repository on node-postgres, persistent enrollments with Prisma, a transactional enrollment, a hand-written migration, and the same report in SQL and in Prisma.",
    atoms: [
      {
        id: "a-be-ex-pg-repository",
        title: "Exercise: connect the course API to PostgreSQL",
        explain:
          "The API's routes call a repository (Week 8). Swapping the repository's implementation is the whole migration: the routes do not change. With node-postgres, each function is one parameterized query; map the unique violation (SQLSTATE 23505) to a 409 in the repository or the error handler.",
        nodeLab: {
          task:
            "repository.js keeps courses in an array. Rewrite it with the pool from db.js, keeping the same async functions: listCourses(level) (published courses, optionally of one level, ordered by code), getCourse(id) (null if missing), createCourse({ code, title, weeks, price, level }) (returns the new row; a duplicate code throws an AppError(409, \"DUPLICATE_CODE\", …)), deleteCourse(id) (true if a row was deleted).",
          db: `CREATE TABLE courses (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code      text NOT NULL UNIQUE,
  title     text NOT NULL,
  weeks     integer NOT NULL,
  price     integer NOT NULL,
  level     text NOT NULL DEFAULT 'beginner',
  published boolean NOT NULL DEFAULT true
);
INSERT INTO courses (code, title, weeks, price, level) VALUES
  ('BE-101', 'Backend Engineering', 24, 120000, 'beginner'),
  ('DB-101', 'Relational Databases', 16, 80000, 'beginner'),
  ('WD-201', 'React Development', 16, 90000, 'intermediate'),
  ('DA-301', 'Advanced Data Analysis', 12, 100000, 'advanced');
`,
          files: {
            "package.json": PG_PKG,
            ".env": PG_ENV,
            "db.js": PG_DB_JS,
            "errors.js": `export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
`,
            "repository.js": `import { AppError } from "./errors.js";

const courses = [
  { id: 1, code: "BE-101", title: "Backend Engineering", weeks: 24, price: 120000, level: "beginner" },
];

export async function listCourses(level) {
  return courses.filter((c) => !level || c.level === level);
}

export async function getCourse(id) {
  return courses.find((c) => c.id === id) ?? null;
}

export async function createCourse({ code, title, weeks, price, level = "beginner" }) {
  if (courses.some((c) => c.code === code)) throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
  const course = { id: courses.length + 1, code, title, weeks, price, level };
  courses.push(course);
  return course;
}

export async function deleteCourse(id) {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return false;
  courses.splice(index, 1);
  return true;
}
`,
            "server.js": `import express from "express";
import { AppError } from "./errors.js";
import * as repo from "./repository.js";

const app = express();
app.use(express.json());

app.get("/courses", async (req, res) => res.json({ data: await repo.listCourses(req.query.level) }));

app.get("/courses/:id", async (req, res) => {
  const course = await repo.getCourse(Number(req.params.id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json({ data: course });
});

app.post("/courses", async (req, res) => res.status(201).json({ data: await repo.createCourse(req.body) }));

app.delete("/courses/:id", async (req, res) => {
  if (!(await repo.deleteCourse(Number(req.params.id)))) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.status(204).end();
});

app.use((err, req, res, next) => {
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN_JS}`,
          },
          readOnly: ["package.json", ".env", "db.js", "errors.js", "server.js"],
          open: "repository.js",
          solution: {
            "repository.js": `import { pool } from "./db.js";
import { AppError } from "./errors.js";

const COLUMNS = "id, code, title, weeks, price, level";

export async function listCourses(level) {
  const { rows } = level
    ? await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE published AND level = $1 ORDER BY code\`, [level])
    : await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE published ORDER BY code\`);
  return rows;
}

export async function getCourse(id) {
  const { rows } = await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE id = $1\`, [id]);
  return rows[0] ?? null;
}

export async function createCourse({ code, title, weeks, price, level = "beginner" }) {
  try {
    const { rows } = await pool.query(
      \`INSERT INTO courses (code, title, weeks, price, level) VALUES ($1, $2, $3, $4, $5) RETURNING \${COLUMNS}\`,
      [code, title, weeks, price, level]
    );
    return rows[0];
  } catch (err) {
    // 23505: unique_violation. The constraint decides, even when two requests race.
    if (err.code === "23505") throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
    throw err;
  }
}

export async function deleteCourse(id) {
  const { rowCount } = await pool.query("DELETE FROM courses WHERE id = $1", [id]);
  return rowCount > 0;
}
`,
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /courses?level=beginner", method: "GET", path: "/courses?level=beginner" },
            { label: "POST duplicate", method: "POST", path: "/courses", body: { code: "BE-101", title: "Copy", weeks: 1, price: 0 } },
          ],
          tests: [
            { label: "The courses come from PostgreSQL", check: `eq((await get("/courses")).json.data.map((c) => c.code), ["BE-101", "DA-301", "DB-101", "WD-201"], "all published courses, by code"); eq((await get("/courses?level=beginner")).json.data.map((c) => c.code), ["BE-101", "DB-101"], "?level=beginner"); await sql("INSERT INTO courses (code, title, weeks, price, published) VALUES ('ZZ-999', 'Hidden', 1, 0, false)"); lacks(JSON.stringify((await get("/courses")).json), "ZZ-999", "unpublished courses stay hidden");` },
            { label: "GET /courses/:id", check: `eq((await get("/courses/3")).json.data, { id: 3, code: "WD-201", title: "React Development", weeks: 16, price: 90000, level: "intermediate" }, "GET /courses/3"); eq((await get("/courses/99")).status, 404, "GET /courses/99");` },
            { label: "POST stores the course; a duplicate is 409", check: `const r = await post("/courses", { code: "AI-101", title: "AI Engineering", weeks: 12, price: 150000 }); eq([r.status, r.json.data.code, r.json.data.level], [201, "AI-101", "beginner"], "POST"); eq((await sql("SELECT count(*)::int AS n FROM courses WHERE code = 'AI-101'"))[0].n, 1, "stored in PostgreSQL"); const d = await post("/courses", { code: "BE-101", title: "Copy", weeks: 1, price: 0 }); eq([d.status, d.json.error?.code], [409, "DUPLICATE_CODE"], "a duplicate code");` },
            { label: "DELETE removes the row", check: `eq((await del("/courses/4")).status, 204, "DELETE /courses/4"); eq((await sql("SELECT count(*)::int AS n FROM courses WHERE id = 4"))[0].n, 0, "gone"); eq((await del("/courses/4")).status, 404, "again");` },
            { label: "Every query is parameterized", check: `const s = file("repository.js"); const bad = s.split("\\n").filter((l) => /\\b(SELECT|INSERT|UPDATE|DELETE|WHERE|VALUES)\\b/.test(l) && /\\$\\{(?!COLUMNS)/.test(l)); assert(bad.length === 0, "values must be passed as parameters ($1), not put in the SQL text: " + bad.join(" | ")); has(s, "$1", "use $1");` },
          ],
          hint: "const { rows } = await pool.query(\"SELECT … WHERE id = $1\", [id]); return rows[0] ?? null. INSERT … RETURNING gives back the new row. Catch err.code === \"23505\" around the insert.",
          successMessage: "The routes did not change a line: that is what the repository was for in Week 8.",
        },
      },
      {
        id: "a-be-ex-persist",
        title: "Exercise: replace temporary storage with persistent data",
        explain:
          "In-memory data dies with the process: every deploy, crash or restart. Persistent data survives because it lives in PostgreSQL. The check restarts the lab's server and expects the enrollments to still be there.",
        nodeLab: {
          task:
            "src/routes/enrollments.ts keeps enrollments in an array. Use Prisma instead: POST /enrollments { studentId, courseId } creates an enrollment (201 { data }); GET /enrollments/student/:studentId lists that student's enrollments as { data: [{ id, course: { code, title }, enrolledAt }] }, oldest first.",
          command: PRISMA_CMD("node prisma/seed.ts && npm start"),
          db: { setup: "" },
          files: prismaProject({
            files: {
              "prisma/seed.ts": seedTs(),
              "src/errors.ts": ERRORS_MAPPED_TS,
              "src/server.ts": serverTs([["enrollmentsRouter", "enrollments"]]),
              "src/routes/enrollments.ts": `import { Router, type Request, type Response } from "express";

export const enrollmentsRouter = Router();

type Enrollment = { id: number; studentId: number; courseId: number; enrolledAt: Date };
const enrollments: Enrollment[] = [];

enrollmentsRouter.post("/", async (req: Request, res: Response) => {
  const { studentId, courseId } = req.body;
  const enrollment = { id: enrollments.length + 1, studentId, courseId, enrolledAt: new Date() };
  enrollments.push(enrollment);
  res.status(201).json({ data: enrollment });
});

enrollmentsRouter.get("/student/:studentId", async (req: Request<{ studentId: string }>, res: Response) => {
  res.json({ data: enrollments.filter((e) => e.studentId === Number(req.params.studentId)) });
});
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", "prisma/seed.ts", "src/server.ts", "src/errors.ts", ...migrationFiles(["init", "level"])],
          open: "src/routes/enrollments.ts",
          solution: {
            "src/routes/enrollments.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/", async (req: Request, res: Response) => {
  const { studentId, courseId } = req.body;
  const enrollment = await prisma.enrollment.create({ data: { studentId, courseId } });
  res.status(201).json({ data: enrollment });
});

enrollmentsRouter.get("/student/:studentId", async (req: Request<{ studentId: string }>, res: Response) => {
  const data = await prisma.enrollment.findMany({
    where: { studentId: Number(req.params.studentId) },
    select: { id: true, enrolledAt: true, course: { select: { code: true, title: true } } },
    orderBy: { enrolledAt: "asc" },
  });
  res.json({ data });
});
`,
          },
          requests: [
            { label: "POST Ada → BE-101", method: "POST", path: "/enrollments", body: { studentId: 1, courseId: 1 } },
            { label: "GET /enrollments/student/1", method: "GET", path: "/enrollments/student/1" },
          ],
          tests: [
            { label: "Enrollments are stored in PostgreSQL", check: `eq((await post("/enrollments", { studentId: 1, courseId: 1 })).status, 201, "Ada in BE-101"); await advance(1000); eq((await post("/enrollments", { studentId: 1, courseId: 2 })).status, 201, "Ada in DB-101"); eq(await sql("SELECT student_id, course_id FROM enrollments ORDER BY id"), [{ student_id: 1, course_id: 1 }, { student_id: 1, course_id: 2 }], "two rows in enrollments");` },
            { label: "A student's enrollments include the course", check: `const r = await get("/enrollments/student/1"); eq(r.json.data.map((e) => e.course), [{ code: "BE-101", title: "Backend Engineering" }, { code: "DB-101", title: "Relational Databases" }], "Ada's courses, oldest first"); assert(r.json.data.every((e) => e.id && e.enrolledAt), "each item has its id and enrolledAt");` },
            { label: "They survive a restart", check: `await restart(); const r = await get("/enrollments/student/1"); eq(r.json.data.map((e) => e.course.code), ["BE-101", "DB-101"], "after restarting the server, Ada's enrollments are still there");` },
            { label: "Rules come from the database now", check: `const r = await post("/enrollments", { studentId: 1, courseId: 1 }); eq([r.status, r.json?.error?.code], [409, "CONFLICT"], "a second identical enrollment is refused by the unique index (P2002)"); eq((await post("/enrollments", { studentId: 99, courseId: 1 })).status, 400, "a missing student is refused by the foreign key (P2003)");` },
          ],
          hint: "prisma.enrollment.create({ data: { studentId, courseId } }); findMany({ where: { studentId }, select: { id: true, enrolledAt: true, course: { select: { code: true, title: true } } }, orderBy: { enrolledAt: \"asc\" } }).",
          successMessage: "Restart, redeploy, crash: the enrollments stay. And the database now enforces the rules the array never did.",
        },
      },
      {
        id: "a-be-ex-enroll-tx",
        title: "Exercise: implement enrollment using transactions",
        explain:
          "prisma.$transaction(async (tx) => { … }) runs a function inside one transaction: use tx (not prisma) for every query, return a value to commit, throw to roll everything back. To take a seat safely, update and check in one statement: tx.course.updateMany({ where: { id, seats: { gt: 0 } }, data: { seats: { decrement: 1 } } }) returns { count }, which is 0 when the course is full, whatever other requests are doing.",
        nodeLab: {
          task:
            "POST /enrollments { studentId, courseId, amount } must, in ONE transaction: take a seat (none left → 409 COURSE_FULL), create the enrollment, and record the payment (amount must be a positive whole number, else 400 INVALID_PAYMENT). If any step fails, nothing is written. Answer 201 { data: enrollment }.",
          command: PRISMA_CMD("node prisma/seed.ts && npm start"),
          db: { setup: "" },
          files: prismaProject({
            schema: P.W11_SCHEMA_SEATS,
            migrations: ["init", "level", "seats_payments"],
            files: {
              "prisma/seed.ts": seedTs({ seats: true }),
              "src/errors.ts": ERRORS_MAPPED_TS,
              "src/server.ts": serverTs([["enrollmentsRouter", "enrollments"]]),
              "src/routes/enrollments.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";
import { AppError } from "../errors.ts";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/", async (req: Request, res: Response) => {
  const { studentId, courseId, amount } = req.body as { studentId: number; courseId: number; amount: number };
  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  if (course.seats === 0) throw new AppError(409, "COURSE_FULL", \`Course \${courseId} has no seats left\`);
  await prisma.course.update({ where: { id: courseId }, data: { seats: course.seats - 1 } });
  const enrollment = await prisma.enrollment.create({ data: { studentId, courseId } });
  if (!Number.isInteger(amount) || amount <= 0) throw new AppError(400, "INVALID_PAYMENT", "amount must be a positive whole number");
  await prisma.payment.create({ data: { enrollmentId: enrollment.id, amount } });
  res.status(201).json({ data: enrollment });
});
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", "prisma/seed.ts", "src/server.ts", "src/errors.ts", ...migrationFiles(["init", "level", "seats_payments"])],
          open: "src/routes/enrollments.ts",
          solution: {
            "src/routes/enrollments.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";
import { AppError } from "../errors.ts";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/", async (req: Request, res: Response) => {
  const { studentId, courseId, amount } = req.body as { studentId: number; courseId: number; amount: number };
  const enrollment = await prisma.$transaction(async (tx) => {
    // Check and take the seat in one statement: safe however many requests arrive together.
    const seat = await tx.course.updateMany({ where: { id: courseId, seats: { gt: 0 } }, data: { seats: { decrement: 1 } } });
    if (seat.count === 0) throw new AppError(409, "COURSE_FULL", \`Course \${courseId} has no seats left\`);
    const created = await tx.enrollment.create({ data: { studentId, courseId } });
    if (!Number.isInteger(amount) || amount <= 0) throw new AppError(400, "INVALID_PAYMENT", "amount must be a positive whole number");
    await tx.payment.create({ data: { enrollmentId: created.id, amount } });
    return created;
  });
  res.status(201).json({ data: enrollment });
});
`,
          },
          requests: [
            { label: "POST Ada → DB-101", method: "POST", path: "/enrollments", body: { studentId: 1, courseId: 2, amount: 80000 } },
            { label: "POST bad payment", method: "POST", path: "/enrollments", body: { studentId: 2, courseId: 2, amount: 0 } },
          ],
          tests: [
            { label: "A valid enrollment takes a seat and records the payment", check: `const r = await post("/enrollments", { studentId: 1, courseId: 2, amount: 80000 }); eq(r.status, 201, "status"); eq(await sql("SELECT (SELECT seats FROM courses WHERE code = 'DB-101') AS seats, (SELECT count(*)::int FROM enrollments) AS enrollments, (SELECT count(*)::int FROM payments) AS payments"), [{ seats: 29, enrollments: 1, payments: 1 }], "29 seats left, one enrollment, one payment");` },
            { label: "A bad payment rolls everything back", check: `const r = await post("/enrollments", { studentId: 2, courseId: 2, amount: 0 }); eq([r.status, r.json?.error?.code], [400, "INVALID_PAYMENT"], "amount 0"); eq(await sql("SELECT (SELECT seats FROM courses WHERE code = 'DB-101') AS seats, (SELECT count(*)::int FROM enrollments WHERE student_id = 2) AS bayo"), [{ seats: 29, bayo: 0 }], "no seat taken, no enrollment for Bayo");` },
            { label: "A duplicate rolls back its seat", check: `const r = await post("/enrollments", { studentId: 1, courseId: 2, amount: 80000 }); eq([r.status, r.json?.error?.code], [409, "CONFLICT"], "Ada in DB-101 again (P2002)"); eq(await sql("SELECT seats FROM courses WHERE code = 'DB-101'"), [{ seats: 29 }], "still 29 seats");` },
            { label: "A full course answers COURSE_FULL and stays consistent", check: `for (const s of [1, 2]) eq((await post("/enrollments", { studentId: s, courseId: 1, amount: 120000 })).status, 201, "student " + s + " in BE-101 (2 seats)"); const r = await post("/enrollments", { studentId: 3, courseId: 1, amount: 120000 }); eq([r.status, r.json?.error?.code], [409, "COURSE_FULL"], "Chiamaka finds BE-101 full"); eq(await sql("SELECT (SELECT seats FROM courses WHERE code = 'BE-101') AS seats, (SELECT count(*)::int FROM enrollments WHERE course_id = 1) AS enrolled"), [{ seats: 0, enrolled: 2 }], "0 seats, 2 enrollments");` },
            { label: "It uses an interactive transaction", check: `const s = file("src/routes/enrollments.ts"); has(s, "$transaction(", "use prisma.$transaction(async (tx) => …)"); has(s, "tx.payment.create", "create the payment with tx, inside the transaction");` },
          ],
          hint: "const enrollment = await prisma.$transaction(async (tx) => { const seat = await tx.course.updateMany({ where: { id: courseId, seats: { gt: 0 } }, data: { seats: { decrement: 1 } } }); if (seat.count === 0) throw …; … return created; }).",
          successMessage: "Every failure (full course, bad payment, duplicate) leaves the database exactly as it was. Week 12 sends these requests concurrently and the seats still add up.",
        },
      },
      {
        id: "a-be-ex-migration",
        title: "Exercise: create database migrations",
        explain:
          "A migration is two things that must agree: the schema (what the code believes) and the SQL (what the database becomes). prisma migrate dev normally writes the SQL from the schema; here you write both, which is also what you do when you edit a generated migration (data backfills, CHECK constraints Prisma cannot express). The folder name starts with a UTC timestamp (yyyymmddhhmmss) so migrations apply in order.",
        nodeLab: {
          task:
            "Give courses a number of seats. In prisma/schema.prisma add seats (Int, default 30) to Course. Then add the migration folder prisma/migrations/20261028090000_add_course_seats with a migration.sql that adds the column to existing databases: NOT NULL, default 30, as Prisma would write it. src/check.ts prints every course's seats.",
          command: PRISMA_CMD("node prisma/seed.ts && node src/check.ts"),
          db: { setup: "" },
          files: prismaProject({
            files: {
              "prisma/seed.ts": seedTs(),
              "src/check.ts": `import { prisma } from "./db.ts";

const courses = await prisma.course.findMany({ select: { code: true, seats: true }, orderBy: { code: "asc" } });
console.log(JSON.stringify(courses));
await prisma.$disconnect();
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/seed.ts", "src/check.ts", ...migrationFiles(["init", "level"])],
          open: "prisma/schema.prisma",
          solution: {
            "prisma/schema.prisma": P.W11_SCHEMA_LEVEL_SEATS,
            "prisma/migrations/20261028090000_add_course_seats/migration.sql": PRISMA_MIGRATIONS.add_course_seats,
          },
          tests: [
            { label: "The new migration is applied after the two existing ones", check: `const names = (await sql('SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL ORDER BY migration_name')).map((r) => r.migration_name); eq(names, ["${INIT_DIR}", "${LEVEL_DIR}", "20261028090000_add_course_seats"], "applied migrations");` },
            { label: "courses.seats is NOT NULL with default 30", check: `eq(await sql("SELECT data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'seats'"), [{ data_type: "integer", is_nullable: "NO", column_default: "30" }], "the seats column");` },
            { label: "The schema matches: the client reads seats", check: `has(output(), '{"code":"BE-101","seats":30}', "src/check.ts should print every course with 30 seats:\\n" + output()); await run("npx prisma validate"); eq(exitCode(), 0, "the schema must stay valid");` },
            { label: "migrate status: up to date", check: `await run("npx prisma migrate status"); has(output(), "3 migrations found in prisma/migrations", "three migrations"); has(output(), "Database schema is up to date!", "nothing pending");` },
          ],
          hint: "In the schema: seats Int @default(30). In migration.sql: ALTER TABLE \"courses\" ADD COLUMN \"seats\" INTEGER NOT NULL DEFAULT 30; — the existing rows get 30.",
          successMessage: "The schema and the SQL agree, and every database that runs migrate deploy gets the column, existing courses included.",
        },
      },
      {
        id: "a-be-ex-sql-vs-orm",
        title: "Exercise: compare a parameterized SQL query with its ORM equivalent",
        explain:
          "Prisma's $queryRaw is a TAGGED TEMPLATE: prisma.$queryRaw`… WHERE c.level = ${level}` sends ${level} as a parameter, so it is as safe as $1 (unlike $queryRawUnsafe with a string you built, which is injectable). Raw results are typed by you, and PostgreSQL's count() is a bigint, which Prisma returns as a JavaScript BigInt that res.json() cannot serialize: cast it in SQL (count(e.id)::int). The ORM version expresses the same report with select and _count.",
        nodeLab: {
          task:
            "Two endpoints must return the same report, the number of enrollments per course of a level, as { data: [{ code, enrollments }] } ordered by code. Fix GET /reports/sql (it builds its SQL from the query string and fails on count's type) using prisma.$queryRaw with a parameter, and write GET /reports/orm with prisma.course.findMany and _count.",
          command: PRISMA_CMD("node prisma/seed.ts && npm start"),
          db: { setup: "" },
          files: prismaProject({
            files: {
              "prisma/seed.ts": seedTs({ enrollments: true }),
              "src/errors.ts": ERRORS_MAPPED_TS,
              "src/server.ts": serverTs([["reportsRouter", "reports"]]),
              "src/routes/reports.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";

export const reportsRouter = Router();

type LevelQuery = { level?: string };

reportsRouter.get("/sql", async (req: Request<Record<string, never>, unknown, unknown, LevelQuery>, res: Response) => {
  const level = String(req.query.level ?? "beginner");
  const data = await prisma.$queryRawUnsafe(
    "SELECT c.code, count(e.id) AS enrollments FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id WHERE c.level = '" + level + "' GROUP BY c.code ORDER BY c.code"
  );
  res.json({ data });
});

reportsRouter.get("/orm", async (req: Request<Record<string, never>, unknown, unknown, LevelQuery>, res: Response) => {
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Write the Prisma version" } });
});
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", "prisma/seed.ts", "src/server.ts", "src/errors.ts", ...migrationFiles(["init", "level"])],
          open: "src/routes/reports.ts",
          solution: {
            "src/routes/reports.ts": `import { Router, type Request, type Response } from "express";
import { prisma } from "../db.ts";

export const reportsRouter = Router();

type LevelQuery = { level?: string };
type Row = { code: string; enrollments: number };

reportsRouter.get("/sql", async (req: Request<Record<string, never>, unknown, unknown, LevelQuery>, res: Response) => {
  const level = String(req.query.level ?? "beginner");
  // A tagged template: \${level} is sent as a parameter. ::int turns count's bigint into a JSON number.
  const data = await prisma.$queryRaw<Row[]>\`
    SELECT c.code, count(e.id)::int AS enrollments
    FROM courses c
    LEFT JOIN enrollments e ON e.course_id = c.id
    WHERE c.level = \${level}
    GROUP BY c.code
    ORDER BY c.code\`;
  res.json({ data });
});

reportsRouter.get("/orm", async (req: Request<Record<string, never>, unknown, unknown, LevelQuery>, res: Response) => {
  const level = String(req.query.level ?? "beginner");
  const courses = await prisma.course.findMany({
    where: { level },
    select: { code: true, _count: { select: { enrollments: true } } },
    orderBy: { code: "asc" },
  });
  res.json({ data: courses.map((c): Row => ({ code: c.code, enrollments: c._count.enrollments })) });
});
`,
          },
          requests: [
            { label: "GET /reports/sql", method: "GET", path: "/reports/sql?level=beginner" },
            { label: "GET /reports/orm", method: "GET", path: "/reports/orm?level=beginner" },
          ],
          tests: [
            { label: "GET /reports/sql answers the report", check: `const r = await get("/reports/sql?level=beginner"); eq(r.status, 200, "status (a BigInt in the result makes res.json fail)"); eq(r.json.data, [{ code: "BE-101", enrollments: 2 }, { code: "CS-101", enrollments: 0 }, { code: "DB-101", enrollments: 1 }, { code: "MD-101", enrollments: 0 }], "enrollments per beginner course");` },
            { label: "GET /reports/orm answers the same report", check: `const a = await get("/reports/sql?level=beginner"); const b = await get("/reports/orm?level=beginner"); eq(b.status, 200, "status"); eq(b.json, a.json, "the ORM report equals the SQL report"); eq((await get("/reports/orm?level=advanced")).json.data, [{ code: "DA-301", enrollments: 0 }], "?level=advanced");` },
            { label: "Neither can be injected", check: `for (const p of ["sql", "orm"]) { const r = await get("/reports/" + p + "?level=" + encodeURIComponent("x' OR '1'='1")); eq([r.status, r.json?.data], [200, []], p + ": a level that matches nothing"); }` },
            { label: "The SQL uses $queryRaw with a parameter", check: `const s = file("src/routes/reports.ts"); lacks(s, "$queryRawUnsafe", "use prisma.$queryRaw\`…\` (a tagged template), not $queryRawUnsafe"); has(s, "$queryRaw", "use prisma.$queryRaw");` },
          ],
          hint: "prisma.$queryRaw<Row[]>`SELECT c.code, count(e.id)::int AS enrollments … WHERE c.level = ${level} …`. ORM: findMany({ where: { level }, select: { code: true, _count: { select: { enrollments: true } } }, orderBy: { code: \"asc\" } }) then map to { code, enrollments }.",
          successMessage: "The same answer two ways. The SQL is closer to the database and easy to tune; the ORM version is typed end to end. Both are parameterized; $queryRawUnsafe was neither.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 83 · 11.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l83-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["11.P"],
    title: "Deliverable: A Persistent Course-Management API",
    subtitle: "PostgreSQL and Prisma behind every endpoint",
    estimatedMinutes: 120,
    intro: "The deliverable puts the week together: repositories on Prisma, database errors mapped to answers, enrollment in a transaction, migrations and a seed, all type-checked.",
    atoms: [
      {
        id: "a-be-persistent-api",
        title: "The persistent course-management API",
        explain:
          "Only the repositories touch Prisma; routes call repositories; the error handler maps database errors. The checks call every endpoint, look inside PostgreSQL, restart the server, and run tsc over your code and the generated client.",
        nodeLab: {
          task:
            "The API's repositories (src/repositories/*.ts) keep data in arrays. Rewrite them with Prisma, keeping their functions: courses (list with level/page/limit returning { data, total }, get, create, update returning null when missing, remove returning false when missing), students (create, list), enrollments (enroll: seat, enrollment and payment in one transaction, COURSE_FULL / INVALID_PAYMENT as AppErrors; listForStudent). In src/errors.ts map P2002 → 409 CONFLICT, P2003 → 400 INVALID_REFERENCE, P2025 → 404 NOT_FOUND. npx tsc --noEmit must pass.",
          command: PRISMA_CMD("node prisma/seed.ts && npm start"),
          db: { setup: "" },
          files: prismaProject({
            schema: P.W11_SCHEMA_SEATS,
            migrations: ["init", "level", "seats_payments"],
            files: {
              "prisma/seed.ts": seedTs({ seats: true }),
              "src/errors.ts": ERRORS_UNMAPPED_TS,
              "src/server.ts": serverTs([["coursesRouter", "courses"], ["studentsRouter", "students"], ["enrollmentsRouter", "enrollments"]]),
              "src/types.ts": `export interface CourseInput {
  code: string;
  title: string;
  weeks: number;
  price: number;
  level?: string;
  seats?: number;
}

export interface Course extends Required<CourseInput> {
  id: number;
  createdAt: Date;
}

export interface Student {
  id: number;
  email: string;
  fullName: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrolledAt: Date;
}
`,
              "src/routes/courses.ts": `import { Router, type Request, type Response } from "express";
import { AppError } from "../errors.ts";
import * as courses from "../repositories/courses.ts";

export const coursesRouter = Router();

type ListQuery = { level?: string; page?: string; limit?: string };

coursesRouter.get("/", async (req: Request<Record<string, never>, unknown, unknown, ListQuery>, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const { data, total } = await courses.list({ level: req.query.level, page, limit });
  res.json({ data, meta: { page, limit, total } });
});

coursesRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const course = await courses.get(Number(req.params.id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json({ data: course });
});

coursesRouter.post("/", async (req: Request, res: Response) => {
  res.status(201).json({ data: await courses.create(req.body) });
});

coursesRouter.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const course = await courses.update(Number(req.params.id), req.body);
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json({ data: course });
});

coursesRouter.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  if (!(await courses.remove(Number(req.params.id)))) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.status(204).end();
});
`,
              "src/routes/students.ts": `import { Router, type Request, type Response } from "express";
import * as enrollments from "../repositories/enrollments.ts";
import * as students from "../repositories/students.ts";

export const studentsRouter = Router();

studentsRouter.get("/", async (req: Request, res: Response) => {
  res.json({ data: await students.list() });
});

studentsRouter.post("/", async (req: Request, res: Response) => {
  res.status(201).json({ data: await students.create(req.body) });
});

studentsRouter.get("/:id/enrollments", async (req: Request<{ id: string }>, res: Response) => {
  res.json({ data: await enrollments.listForStudent(Number(req.params.id)) });
});
`,
              "src/routes/enrollments.ts": `import { Router, type Request, type Response } from "express";
import * as enrollments from "../repositories/enrollments.ts";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/", async (req: Request, res: Response) => {
  res.status(201).json({ data: await enrollments.enroll(req.body) });
});
`,
              "src/repositories/courses.ts": `import type { Course, CourseInput } from "../types.ts";

const courses: Course[] = [];

export async function list({ level, page, limit }: { level?: string; page: number; limit: number }): Promise<{ data: Course[]; total: number }> {
  const matching = courses.filter((c) => !level || c.level === level).sort((a, b) => a.code.localeCompare(b.code));
  return { data: matching.slice((page - 1) * limit, page * limit), total: matching.length };
}

export async function get(id: number): Promise<Course | null> {
  return courses.find((c) => c.id === id) ?? null;
}

export async function create(input: CourseInput): Promise<Course> {
  const course: Course = { id: courses.length + 1, level: "beginner", seats: 30, createdAt: new Date(), ...input };
  courses.push(course);
  return course;
}

export async function update(id: number, input: Partial<CourseInput>): Promise<Course | null> {
  const course = courses.find((c) => c.id === id);
  if (!course) return null;
  return Object.assign(course, input);
}

export async function remove(id: number): Promise<boolean> {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return false;
  courses.splice(index, 1);
  return true;
}
`,
              "src/repositories/students.ts": `import type { Student } from "../types.ts";

const students: Student[] = [];

export async function list(): Promise<Student[]> {
  return students;
}

export async function create(input: { email: string; fullName: string }): Promise<Student> {
  const student = { id: students.length + 1, ...input };
  students.push(student);
  return student;
}
`,
              "src/repositories/enrollments.ts": `import type { Enrollment } from "../types.ts";

const enrollments: Enrollment[] = [];

export async function enroll(input: { studentId: number; courseId: number; amount: number }): Promise<Enrollment> {
  const enrollment = { id: enrollments.length + 1, studentId: input.studentId, courseId: input.courseId, enrolledAt: new Date() };
  enrollments.push(enrollment);
  return enrollment;
}

export async function listForStudent(studentId: number) {
  return enrollments.filter((e) => e.studentId === studentId);
}
`,
            },
          }),
          readOnly: [...PRISMA_READ_ONLY, "prisma/schema.prisma", "prisma/seed.ts", "src/server.ts", "src/types.ts", "src/routes/courses.ts", "src/routes/students.ts", "src/routes/enrollments.ts", ...migrationFiles(["init", "level", "seats_payments"])],
          open: "src/repositories/courses.ts",
          solution: {
            "src/errors.ts": ERRORS_MAPPED_TS,
            "src/repositories/courses.ts": `import { prisma } from "../db.ts";
import type { Course, CourseInput } from "../types.ts";

export async function list({ level, page, limit }: { level?: string; page: number; limit: number }): Promise<{ data: Course[]; total: number }> {
  const where = level ? { level } : {};
  const [data, total] = await prisma.$transaction([
    prisma.course.findMany({ where, orderBy: { code: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.course.count({ where }),
  ]);
  return { data, total };
}

export function get(id: number): Promise<Course | null> {
  return prisma.course.findUnique({ where: { id } });
}

export function create(input: CourseInput): Promise<Course> {
  const { code, title, weeks, price, level, seats } = input;
  return prisma.course.create({ data: { code, title, weeks, price, level, seats } });
}

export async function update(id: number, input: Partial<CourseInput>): Promise<Course | null> {
  const { title, weeks, price, level, seats } = input;
  const { count } = await prisma.course.updateMany({ where: { id }, data: { title, weeks, price, level, seats } });
  return count === 0 ? null : prisma.course.findUnique({ where: { id } });
}

export async function remove(id: number): Promise<boolean> {
  const { count } = await prisma.course.deleteMany({ where: { id } });
  return count > 0;
}
`,
            "src/repositories/students.ts": `import { prisma } from "../db.ts";
import type { Student } from "../types.ts";

export function list(): Promise<Student[]> {
  return prisma.student.findMany({ orderBy: { id: "asc" } });
}

export function create(input: { email: string; fullName: string }): Promise<Student> {
  return prisma.student.create({ data: { email: input.email, fullName: input.fullName } });
}
`,
            "src/repositories/enrollments.ts": `import { prisma } from "../db.ts";
import { AppError } from "../errors.ts";
import type { Enrollment } from "../types.ts";

export function enroll(input: { studentId: number; courseId: number; amount: number }): Promise<Enrollment> {
  const { studentId, courseId, amount } = input;
  return prisma.$transaction(async (tx) => {
    const seat = await tx.course.updateMany({ where: { id: courseId, seats: { gt: 0 } }, data: { seats: { decrement: 1 } } });
    if (seat.count === 0) throw new AppError(409, "COURSE_FULL", \`Course \${courseId} has no seats left\`);
    const enrollment = await tx.enrollment.create({ data: { studentId, courseId } });
    if (!Number.isInteger(amount) || amount <= 0) throw new AppError(400, "INVALID_PAYMENT", "amount must be a positive whole number");
    await tx.payment.create({ data: { enrollmentId: enrollment.id, amount } });
    return enrollment;
  });
}

export function listForStudent(studentId: number) {
  return prisma.enrollment.findMany({
    where: { studentId },
    select: { id: true, enrolledAt: true, course: { select: { code: true, title: true } } },
    orderBy: { id: "asc" },
  });
}
`,
          },
          requests: [
            { label: "GET /courses?level=beginner", method: "GET", path: "/courses?level=beginner" },
            { label: "POST /enrollments", method: "POST", path: "/enrollments", body: { studentId: 1, courseId: 2, amount: 80000 } },
            { label: "GET /students/1/enrollments", method: "GET", path: "/students/1/enrollments" },
          ],
          tests: [
            NO_TYPE_ERRORS,
            { label: "Courses: list, filter, page, get, 404", check: `const a = await get("/courses?level=beginner&limit=2"); eq([a.json.data.map((c) => c.code), a.json.meta], [["BE-101", "CS-101"], { page: 1, limit: 2, total: 4 }], "page 1 of the beginner courses"); await sql("INSERT INTO courses (code, title, weeks, price) VALUES ('AA-001', 'From SQL', 1, 0)"); eq((await get("/courses?limit=1")).json.data[0].code, "AA-001", "a row inserted in PostgreSQL appears: the API reads the database"); eq((await get("/courses/2")).json.data.code, "DB-101", "GET /courses/2"); eq((await get("/courses/99")).status, 404, "GET /courses/99");` },
            { label: "Courses: create, conflict, update, delete", check: `eq((await post("/courses", { code: "AI-101", title: "AI Engineering", weeks: 12, price: 150000 })).status, 201, "POST"); const d = await post("/courses", { code: "AI-101", title: "Copy", weeks: 1, price: 0 }); eq([d.status, d.json.error?.code], [409, "CONFLICT"], "a duplicate code"); eq((await patch("/courses/3", { price: 95000 })).json.data.price, 95000, "PATCH"); eq((await patch("/courses/99", { price: 1 })).status, 404, "PATCH a missing course"); eq((await del("/courses/6")).status, 204, "DELETE DA-301"); eq((await del("/courses/6")).status, 404, "DELETE again");` },
            { label: "Students: create and duplicate email", check: `eq((await post("/students", { email: "dayo@example.com", fullName: "Dayo Bello" })).status, 201, "POST /students"); const d = await post("/students", { email: "ada@example.com", fullName: "Ada Again" }); eq([d.status, d.json.error?.code], [409, "CONFLICT"], "an email already used"); eq((await get("/students")).json.data.length, 4, "four students in PostgreSQL");` },
            { label: "Enrollment is one transaction", check: `eq((await post("/enrollments", { studentId: 1, courseId: 2, amount: 80000 })).status, 201, "Ada in DB-101"); const bad = await post("/enrollments", { studentId: 2, courseId: 2, amount: 0 }); eq([bad.status, bad.json.error?.code], [400, "INVALID_PAYMENT"], "amount 0"); for (const s of [1, 2]) await post("/enrollments", { studentId: s, courseId: 1, amount: 120000 }); const full = await post("/enrollments", { studentId: 3, courseId: 1, amount: 120000 }); eq([full.status, full.json.error?.code], [409, "COURSE_FULL"], "BE-101 is full"); eq((await post("/enrollments", { studentId: 99, courseId: 2, amount: 1 })).status, 400, "a missing student (P2003)"); eq(await sql("SELECT (SELECT seats FROM courses WHERE code = 'DB-101') AS db, (SELECT seats FROM courses WHERE code = 'BE-101') AS be, (SELECT count(*)::int FROM enrollments) AS enrollments, (SELECT count(*)::int FROM payments) AS payments"), [{ db: 29, be: 0, enrollments: 3, payments: 3 }], "seats, enrollments and payments add up");` },
            { label: "Everything survives a restart", check: `await restart(); eq((await get("/students/1/enrollments")).json.data.map((e) => e.course.code), ["DB-101", "BE-101"], "Ada's enrollments after a restart"); assert((await get("/students")).json.data.some((s) => s.email === "dayo@example.com"), "the student created through the API is still there");` },
          ],
          hint: "Lesson 80's queries for courses (updateMany / deleteMany return a count, which tells you if the row existed), Lesson 82's transaction for enroll, Lesson 81's error mapping. The routes and types are given.",
          successMessage: "A course-management API whose data lives in PostgreSQL, changes through migrations, and stays consistent under failures. Phase 3's last week makes it fast and safe under load.",
        },
      },
    ],
    task: {
      title: "Week 11 deliverable: a persistent course-management API using PostgreSQL and Prisma",
      intro: "Build the API on your computer with your PostgreSQL server.",
      prompts: [
        "In your course-api repository: npm install --save-dev prisma, npm install @prisma/client @prisma/adapter-pg dotenv, then npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills.",
        "Write the schema of Lesson 80, run npx prisma migrate dev --name init, then add seats and payments with a second migrate dev. Read each migration.sql before committing it.",
        "Write the seed of Lesson 79 and the repositories of Lesson 83; run the API and call every endpoint with curl, including the failures.",
        "Clone your repository into a new folder, point it at a new database, and run npx prisma migrate deploy && npx prisma generate && node prisma/seed.ts: the API must start with no other step.",
        "Checkpoint: your API keeps its data in PostgreSQL through migrations, uses only parameterized queries, and enrolls students in one transaction.",
      ],
      closing: "Next: Week 12, advanced database design and performance.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

/** The setup commands of Lesson 79, as they appeared in the terminal. */
function shownAllPrismaSetup() {
  return ["npx prisma init --datasource-provider postgresql --output ../src/generated/prisma --no-skills", "cat prisma7.config.ts"].map((c) => shown(REC, c)).join("\n\n");
}
