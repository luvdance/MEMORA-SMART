/**
 * BACKEND ENGINEERING · WEEK 17 · SOFTWARE ARCHITECTURE AND CLEAN CODE
 *
 * Curriculum 17.1 – 17.P. Separation of concerns; single responsibility and
 * dependency management (an import cycle that crashes at start); layers;
 * controllers, services and repositories; domain models; dependency
 * injection; DDD; the modular monolith (a boundary checker); patterns
 * (strategy); refactoring under tests; four exercises; and a new module
 * added to a modular codebase.
 *
 * Structure is checked the way a reviewer's tooling would: the checks read
 * the project's import graph (GRAPH below) for layer rules, module
 * boundaries and cycles, and run the behaviour over HTTP and in PostgreSQL.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s17-architecture";
const MODULE = "be-w17-architecture";

const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
const START = { start: "node --env-file=.env server.js" };
const PKG = (deps = ["express", "pg"]) => pkg({ name: "course-api", scripts: START, deps });

/**
 * Check preamble: the project's JavaScript files, their imports (resolved to
 * project paths) and import cycles.
 */
const GRAPH = `const SRC = () => Object.fromEntries(Object.entries(files()).filter(([p]) => /\\.m?js$/.test(p) && !p.startsWith("node_modules/") && !p.startsWith("fixtures/") && !p.startsWith("reference/")));
const importsOf = (code) => [...code.matchAll(/(?:^|\\n)\\s*(?:import|export)\\b[^;"']*?\\bfrom\\s*["']([^"']+)["']|(?:^|\\n)\\s*import\\s*["']([^"']+)["']|\\bimport\\(\\s*["']([^"']+)["']\\s*\\)/g)].map((m) => m[1] || m[2] || m[3]);
const resolveFrom = (from, spec) => { if (!spec.startsWith(".")) return spec; const parts = from.split("/").slice(0, -1); for (const s of spec.split("/")) { if (s === "..") parts.pop(); else if (s !== ".") parts.push(s); } return parts.join("/"); };
const deps = (p) => importsOf(SRC()[p] || "").map((s) => resolveFrom(p, s));
const filesIn = (dir) => Object.keys(SRC()).filter((p) => p.startsWith(dir));
const cycle = () => { const g = Object.fromEntries(Object.keys(SRC()).map((p) => [p, deps(p)])); const state = {}; const walk = (p, path) => { if (state[p] === 1) return [...path.slice(path.indexOf(p)), p]; if (state[p] === 2 || !g[p]) return null; state[p] = 1; for (const d of g[p]) { const c = walk(d, [...path, p]); if (c) return c; } state[p] = 2; return null; }; for (const p of Object.keys(g)) { const c = walk(p, []); if (c) return c; } return null; };
const noCycle = () => { const c = cycle(); assert(!c, "import cycle: " + (c || []).join(" → ")); };
const sqlIn = (p) => /\\b(SELECT|INSERT|UPDATE|DELETE)\\b/.test(SRC()[p] || "");
const boundaryViolations = () => Object.keys(SRC()).flatMap((p) => deps(p).filter((d) => { const m = /^src\\/modules\\/([^/]+)\\//.exec(d); return m && !p.startsWith("src/modules/" + m[1] + "/") && d !== "src/modules/" + m[1] + "/index.js"; }).map((d) => p + " → " + d));`;

const ERRORS_JS = `export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFound(req, res, next) {
  next(new AppError(404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));
}

export function errorHandler(err, req, res, next) {
  if (!(err instanceof AppError)) {
    console.error(err);
    err = new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  }
  res.status(err.status).json({ error: { code: err.code, message: err.message } });
}
`;
const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;

/* ── 17.2: an import cycle ────────────────────────────────────────────── */

const CYCLE_COURSES = [
  '  { id: 1, code: "BE-101", title: "Backend Engineering", seats: 2 },',
  '  { id: 2, code: "DB-101", title: "Relational Databases", seats: 30 },',
  '  { id: 3, code: "WD-201", title: "React Development", seats: 30 },',
  '  { id: 4, code: "AI-101", title: "AI Engineering", seats: 30 },',
].join("\n");
const CYCLE_ENROLL_BODY = `export const countForCourse = (courseId) => enrollments.filter((e) => e.courseId === courseId).length;
export const listForStudent = (studentId) => enrollments.filter((e) => e.studentId === studentId);
export const seatsLeft = (course) => course.seats - countForCourse(course.id);

export function enroll(studentId, courseId) {
  const course = findCourse(courseId);
  if (!course) return { status: 404, error: { code: "COURSE_NOT_FOUND", message: "No such course" } };
  const mine = listForStudent(studentId);
  if (mine.some((e) => e.courseId === courseId)) return { status: 409, error: { code: "ALREADY_ENROLLED", message: "Already enrolled" } };
  if (mine.length >= MAX_PER_STUDENT) return { status: 409, error: { code: "TOO_MANY_COURSES", message: \`At most \${MAX_PER_STUDENT} courses at a time\` } };
  if (seatsLeft(course) <= 0) return { status: 409, error: { code: "COURSE_FULL", message: "This course is full" } };
  const enrollment = { id: enrollments.length + 1, studentId, courseId };
  enrollments.push(enrollment);
  return { enrollment };
}
`;

/* ── 17.4: the fat route, and its layers ──────────────────────────────── */

const LAYERS_SQL = `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL, seats integer NOT NULL);
CREATE TABLE students (id integer PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id));
INSERT INTO courses VALUES (1, 'BE-101', 'Backend Engineering', 30), (2, 'DB-101', 'Relational Databases', 1), (3, 'WD-201', 'React Development', 30);
INSERT INTO students VALUES (1, 'ada@example.com'), (2, 'bayo@example.com'), (3, 'chi@example.com');
INSERT INTO enrollments (student_id, course_id) VALUES (1, 1);
`;
const FAT_SERVER = `import express from "express";
import { pool } from "./src/db.js";
import { AppError, errorHandler, notFound } from "./src/errors.js";

const app = express();
app.use(express.json());

app.post("/enrollments", async (req, res) => {
  const studentId = Number(req.body?.studentId);
  const courseId = Number(req.body?.courseId);
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) throw new AppError(400, "VALIDATION_FAILED", "studentId and courseId are required");
  const course = (await pool.query("SELECT id, seats FROM courses WHERE id = $1", [courseId])).rows[0];
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
  const taken = (await pool.query("SELECT count(*)::int AS n FROM enrollments WHERE course_id = $1", [courseId])).rows[0].n;
  if (taken >= course.seats) throw new AppError(409, "COURSE_FULL", "This course is full");
  const existing = await pool.query("SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [studentId, courseId]);
  if (existing.rowCount) throw new AppError(409, "ALREADY_ENROLLED", "Already enrolled in this course");
  const { rows } = await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id, student_id AS "studentId", course_id AS "courseId"', [studentId, courseId]);
  res.status(201).json({ data: rows[0] });
});

app.get("/students/:id/enrollments", async (req, res) => {
  const { rows } = await pool.query("SELECT e.id, c.code, c.title FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 ORDER BY e.id", [req.params.id]);
  res.json({ data: rows });
});

app.use(notFound);
app.use(errorHandler);

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;
const LAYER_RULES = [
  { label: "Routes only talk to services", check: `${GRAPH} const routes = filesIn("src/routes/"); assert(routes.length, "put the controllers in src/routes/"); for (const p of routes) { const bad = deps(p).filter((d) => d === "pg" || d === "src/db.js" || d.startsWith("src/repositories/")); eq(bad, [], p + " must not import the database or repositories (go through a service)"); assert(!sqlIn(p), p + " contains SQL"); }` },
  { label: "Services know nothing about HTTP or SQL", check: `${GRAPH} const services = filesIn("src/services/"); assert(services.length, "put the business logic in src/services/"); for (const p of services) { const bad = deps(p).filter((d) => d === "express" || d === "pg" || d === "src/db.js"); eq(bad, [], p + " must not import express or the database"); assert(!sqlIn(p), p + " contains SQL: move it to a repository"); assert(!/\\b(req|res)\\.(body|params|query|status|json|send)\\b/.test(SRC()[p]), p + " uses req/res: services take plain values"); }` },
  { label: "Repositories hold all the SQL", check: `${GRAPH} const repos = filesIn("src/repositories/"); assert(repos.length, "put the SQL in src/repositories/"); for (const p of repos) eq(deps(p).filter((d) => d === "express" || d.startsWith("src/services/") || d.startsWith("src/routes/")), [], p + " must not depend on the layers above it"); assert(!sqlIn("server.js"), "server.js still contains SQL"); noCycle();` },
];

/* ── 17.6: dependency injection ───────────────────────────────────────── */

const DI_SQL = `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, title text NOT NULL, opens_at timestamptz NOT NULL, closes_at timestamptz NOT NULL);
CREATE TABLE students (id integer PRIMARY KEY, email text NOT NULL UNIQUE, full_name text NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), enrolled_at timestamptz NOT NULL, UNIQUE (student_id, course_id));
INSERT INTO courses VALUES
  (1, 'BE-101', 'Backend Engineering', '2026-01-01', '2099-01-01'),
  (2, 'AI-101', 'AI Engineering', '2099-01-01', '2099-06-01'),
  (3, 'DB-101', 'Relational Databases', '2020-01-01', '2020-06-01');
INSERT INTO students VALUES (1, 'ada@example.com', 'Ada Obi'), (2, 'bayo@example.com', 'Bayo Adeyemi');
`;
const DI_REPO = `/** Enrollment data in PostgreSQL. */
export function createEnrollmentRepository(pool) {
  const one = async (sql, params) => (await pool.query(sql, params)).rows[0] ?? null;
  return {
    findCourse: (id) => one('SELECT id, code, title, opens_at AS "opensAt", closes_at AS "closesAt" FROM courses WHERE id = $1', [id]),
    findStudent: (id) => one('SELECT id, email, full_name AS "fullName" FROM students WHERE id = $1', [id]),
    exists: async (studentId, courseId) => Boolean(await one("SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [studentId, courseId])),
    insert: (studentId, courseId, enrolledAt) =>
      one('INSERT INTO enrollments (student_id, course_id, enrolled_at) VALUES ($1, $2, $3) RETURNING id, student_id AS "studentId", course_id AS "courseId", enrolled_at AS "enrolledAt"', [studentId, courseId, enrolledAt]),
  };
}
`;
const DI_MAILER = `import nodemailer from "nodemailer";

/** A mailer that sends through an SMTP server: { send({ to, subject, text }) }. */
export function createSmtpMailer({ host, port, from }) {
  const transport = nodemailer.createTransport({ host, port });
  return { send: ({ to, subject, text }) => transport.sendMail({ from, to, subject, text }) };
}
`;
const DI_APP = `import express from "express";
import { errorHandler, notFound } from "./errors.js";

/** The HTTP layer. It receives its services; it does not build them. */
export function createApp({ enrollments }) {
  const app = express();
  app.use(express.json());
  app.post("/enrollments", async (req, res) => {
    const enrollment = await enrollments.enroll(Number(req.body?.studentId), Number(req.body?.courseId));
    res.status(201).json({ data: enrollment });
  });
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
`;

/* ── 17.8: the modular monolith and its boundary checker ──────────────── */

const MOD_FILES = (violating) => {
  const root = violating ? "fixtures/violating/" : "";
  const f = {
    "src/shared/db.js": DB_JS,
    "src/modules/courses/repository.js": 'import { pool } from "../../shared/db.js";\n\nexport const findCourse = async (id) => (await pool.query("SELECT id, code, price FROM courses WHERE id = $1", [id])).rows[0] ?? null;\n',
    "src/modules/courses/service.js": violating
      ? 'import { findCourse } from "./repository.js";\n\nexport const getCourse = (id) => findCourse(id);\nexport { priceFor } from "../billing/internal/prices.js";\n'
      : 'import { findCourse } from "./repository.js";\n\nexport const getCourse = (id) => findCourse(id);\n',
    "src/modules/courses/index.js": 'export { getCourse } from "./service.js";\n',
    "src/modules/enrollments/repository.js": 'import { pool } from "../../shared/db.js";\n\nexport const countForStudent = async (id) => (await pool.query("SELECT count(*)::int AS n FROM enrollments WHERE student_id = $1", [id])).rows[0].n;\n',
    "src/modules/enrollments/service.js": 'import { getCourse } from "../courses/index.js";\nimport { countForStudent } from "./repository.js";\n\nexport async function enrollmentSummary(studentId, courseId) {\n  return { course: await getCourse(courseId), courses: await countForStudent(studentId) };\n}\n',
    "src/modules/enrollments/index.js": 'export { enrollmentSummary } from "./service.js";\n',
    "src/modules/billing/internal/prices.js": "export const priceFor = (course, seats) => course.price * seats;\n",
    "src/modules/billing/service.js": violating
      ? 'import { enrollmentSummary } from "../enrollments/index.js";\nimport {\n  countForStudent,\n} from "../enrollments/repository.js";\nimport { priceFor } from "./internal/prices.js";\n\nexport async function invoiceFor(studentId, courseId) {\n  const { course } = await enrollmentSummary(studentId, courseId);\n  return { amount: priceFor(course, 1), previous: await countForStudent(studentId) };\n}\n'
      : 'import { enrollmentSummary } from "../enrollments/index.js";\nimport { priceFor } from "./internal/prices.js";\n\nexport async function invoiceFor(studentId, courseId) {\n  const { course } = await enrollmentSummary(studentId, courseId);\n  return { amount: priceFor(course, 1) };\n}\n',
    "src/modules/billing/index.js": 'export { invoiceFor } from "./service.js";\n',
    "src/app.js": violating
      ? 'import { getCourse } from "./modules/courses/index.js";\nimport { invoiceFor } from "./modules/billing/service.js";\n\nexport const api = { getCourse, invoiceFor };\n'
      : 'import { getCourse } from "./modules/courses/index.js";\nimport { invoiceFor } from "./modules/billing/index.js";\n\nexport const api = { getCourse, invoiceFor };\n',
  };
  return Object.fromEntries(Object.entries(f).map(([p, c]) => [root + p, c]));
};
const BOUNDARY_VIOLATIONS = [
  "src/app.js → src/modules/billing/service.js",
  "src/modules/billing/service.js → src/modules/enrollments/repository.js",
  "src/modules/courses/service.js → src/modules/billing/internal/prices.js",
];

/* ── 17.10: the legacy report ─────────────────────────────────────────── */

const REPORT_ORIGINAL = `// Builds the course report. Do not touch: nobody knows how it works.
export function buildReport(enrollments) {
  const result = [];
  for (let i = 0; i < enrollments.length; i++) {
    const e = enrollments[i];
    let found = null;
    for (let j = 0; j < result.length; j++) {
      if (result[j].course === e.course) {
        found = result[j];
      }
    }
    if (found === null) {
      found = { course: e.course, students: 0, completed: 0, completionRate: 0, revenue: 0, atRisk: [] };
      result.push(found);
    }
    found.students = found.students + 1;
    if (e.progress === 100) {
      found.completed = found.completed + 1;
    }
    if (e.paid > 0) {
      if (!e.refunded) {
        found.revenue = found.revenue + e.paid;
        if (e.progress < 30) {
          if (found.atRisk.indexOf(e.student) === -1) {
            found.atRisk.push(e.student);
          }
        }
      }
    }
  }
  for (let k = 0; k < result.length; k++) {
    if (result[k].students > 0) {
      result[k].completionRate = Math.round((result[k].completed / result[k].students) * 100);
    } else {
      result[k].completionRate = 0;
    }
    result[k].atRisk.sort();
  }
  result.sort(function (a, b) {
    if (a.course < b.course) {
      return -1;
    }
    if (a.course > b.course) {
      return 1;
    }
    return 0;
  });
  return result;
}
`;

/* ── 17.11 and 17.P: the academy API, as a monolith and as modules ────── */

const ARCH_SQL = `CREATE TABLE students (id integer PRIMARY KEY, email text NOT NULL UNIQUE, full_name text NOT NULL);
CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL, price integer NOT NULL, seats integer NOT NULL);
CREATE TABLE enrollments (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id integer NOT NULL REFERENCES students (id),
  course_id  integer NOT NULL REFERENCES courses (id),
  progress   integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  UNIQUE (student_id, course_id)
);
-- Billing owns its data: an invoice keeps its own copy of what was sold.
CREATE TABLE invoices (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL, description text NOT NULL, amount integer NOT NULL, status text NOT NULL DEFAULT 'open');
INSERT INTO students VALUES (1, 'ada@example.com', 'Ada Obi'), (2, 'bayo@example.com', 'Bayo Adeyemi'), (3, 'chi@example.com', 'Chi Okafor');
INSERT INTO courses VALUES (1, 'BE-101', 'Backend Engineering', 120000, 30), (2, 'DB-101', 'Relational Databases', 80000, 1), (3, 'WD-201', 'React Development', 90000, 30);
INSERT INTO enrollments (student_id, course_id, progress) VALUES (1, 1, 100), (2, 1, 40);
INSERT INTO invoices (student_id, description, amount, status) VALUES (1, 'BE-101 Backend Engineering', 120000, 'paid'), (2, 'BE-101 Backend Engineering', 120000, 'open');
`;
const MONOLITH = `import express from "express";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(express.json());

class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

app.get("/courses", async (req, res) => {
  res.json({ data: (await pool.query("SELECT id, code, title, price, seats FROM courses ORDER BY id")).rows });
});

app.get("/courses/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, code, title, price, seats FROM courses WHERE id = $1", [req.params.id]);
  if (!rows[0]) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
  res.json({ data: rows[0] });
});

app.post("/enrollments", async (req, res) => {
  const studentId = Number(req.body?.studentId);
  const courseId = Number(req.body?.courseId);
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) throw new AppError(400, "VALIDATION_FAILED", "studentId and courseId are required");
  const course = (await pool.query("SELECT id, code, title, price, seats FROM courses WHERE id = $1", [courseId])).rows[0];
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
  const taken = (await pool.query("SELECT count(*)::int AS n FROM enrollments WHERE course_id = $1", [courseId])).rows[0].n;
  if (taken >= course.seats) throw new AppError(409, "COURSE_FULL", "This course is full");
  if ((await pool.query("SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [studentId, courseId])).rowCount) {
    throw new AppError(409, "ALREADY_ENROLLED", "Already enrolled in this course");
  }
  const { rows } = await pool.query(
    'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id, student_id AS "studentId", course_id AS "courseId", progress',
    [studentId, courseId]
  );
  await pool.query("INSERT INTO invoices (student_id, description, amount) VALUES ($1, $2, $3)", [studentId, \`\${course.code} \${course.title}\`, course.price]);
  res.status(201).json({ data: rows[0] });
});

app.patch("/enrollments/:id/progress", async (req, res) => {
  const progress = req.body?.progress;
  if (!Number.isInteger(progress) || progress < 0 || progress > 100) throw new AppError(400, "VALIDATION_FAILED", "progress must be 0 to 100");
  const { rows } = await pool.query(
    'UPDATE enrollments SET progress = $2 WHERE id = $1 RETURNING id, student_id AS "studentId", course_id AS "courseId", progress',
    [req.params.id, progress]
  );
  if (!rows[0]) throw new AppError(404, "ENROLLMENT_NOT_FOUND", "No such enrollment");
  res.json({ data: rows[0] });
});

app.get("/students/:id/invoices", async (req, res) => {
  const { rows } = await pool.query("SELECT id, description, amount, status FROM invoices WHERE student_id = $1 ORDER BY id", [req.params.id]);
  res.json({ data: rows });
});

app.use((req, res, next) => next(new AppError(404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`)));
app.use((err, req, res, next) => {
  if (!(err instanceof AppError)) {
    console.error(err);
    err = new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  }
  res.status(err.status).json({ error: { code: err.code, message: err.message } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;
const ENROLL_COLS = 'id, student_id AS "studentId", course_id AS "courseId", progress';
const MODULAR = (withFind = false) => ({
  "server.js": 'import { app } from "./src/app.js";\n\napp.listen(3000, () => console.log("Course API on http://localhost:3000"));\n',
  "src/app.js": `import express from "express";
import { billingRouter } from "./modules/billing/index.js";
import { coursesRouter } from "./modules/courses/index.js";
import { enrollmentsRouter } from "./modules/enrollments/index.js";
import { errorHandler, notFound } from "./shared/errors.js";

export const app = express();
app.use(express.json());
app.use(coursesRouter);
app.use(enrollmentsRouter);
app.use(billingRouter);
app.use(notFound);
app.use(errorHandler);
`,
  "src/shared/db.js": DB_JS,
  "src/shared/errors.js": ERRORS_JS,
  "src/modules/courses/index.js": '/** The courses module\'s public API: nothing else may be imported from outside. */\nexport { coursesRouter } from "./routes.js";\nexport { getCourse } from "./service.js";\n',
  "src/modules/courses/repository.js": `import { pool } from "../../shared/db.js";

const COLUMNS = "id, code, title, price, seats";

export const findAll = async () => (await pool.query(\`SELECT \${COLUMNS} FROM courses ORDER BY id\`)).rows;
export const findById = async (id) => (await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE id = $1\`, [id])).rows[0] ?? null;
`,
  "src/modules/courses/service.js": `import { AppError } from "../../shared/errors.js";
import * as repo from "./repository.js";

export const listCourses = () => repo.findAll();

export async function getCourse(id) {
  const course = await repo.findById(id);
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
  return course;
}
`,
  "src/modules/courses/routes.js": `import { Router } from "express";
import { getCourse, listCourses } from "./service.js";

export const coursesRouter = Router();

coursesRouter.get("/courses", async (req, res) => res.json({ data: await listCourses() }));
coursesRouter.get("/courses/:id", async (req, res) => res.json({ data: await getCourse(Number(req.params.id)) }));
`,
  "src/modules/enrollments/index.js": `/** The enrollments module's public API. */
export { enrollmentsRouter } from "./routes.js";
${withFind ? 'export { findEnrollment } from "./service.js";\n' : ""}`,
  "src/modules/enrollments/repository.js": `import { pool } from "../../shared/db.js";

const COLUMNS = '${ENROLL_COLS}';
const one = async (sql, params) => (await pool.query(sql, params)).rows[0] ?? null;

export const countForCourse = async (courseId) => (await pool.query("SELECT count(*)::int AS n FROM enrollments WHERE course_id = $1", [courseId])).rows[0].n;
export const find = (studentId, courseId) => one(\`SELECT \${COLUMNS} FROM enrollments WHERE student_id = $1 AND course_id = $2\`, [studentId, courseId]);
export const insert = (studentId, courseId) => one(\`INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING \${COLUMNS}\`, [studentId, courseId]);
export const setProgress = (id, progress) => one(\`UPDATE enrollments SET progress = $2 WHERE id = $1 RETURNING \${COLUMNS}\`, [id, progress]);
`,
  "src/modules/enrollments/service.js": `import { createInvoice } from "../billing/index.js";
import { getCourse } from "../courses/index.js";
import { AppError } from "../../shared/errors.js";
import * as repo from "./repository.js";

export async function enroll(studentId, courseId) {
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) throw new AppError(400, "VALIDATION_FAILED", "studentId and courseId are required");
  const course = await getCourse(courseId);
  if ((await repo.countForCourse(courseId)) >= course.seats) throw new AppError(409, "COURSE_FULL", "This course is full");
  if (await repo.find(studentId, courseId)) throw new AppError(409, "ALREADY_ENROLLED", "Already enrolled in this course");
  const enrollment = await repo.insert(studentId, courseId);
  await createInvoice({ studentId, description: \`\${course.code} \${course.title}\`, amount: course.price });
  return enrollment;
}

export async function updateProgress(id, progress) {
  if (!Number.isInteger(progress) || progress < 0 || progress > 100) throw new AppError(400, "VALIDATION_FAILED", "progress must be 0 to 100");
  const enrollment = await repo.setProgress(id, progress);
  if (!enrollment) throw new AppError(404, "ENROLLMENT_NOT_FOUND", "No such enrollment");
  return enrollment;
}
${withFind ? "\n/** A student's enrollment in a course, or null. */\nexport const findEnrollment = (studentId, courseId) => repo.find(studentId, courseId);\n" : ""}`,
  "src/modules/enrollments/routes.js": `import { Router } from "express";
import { enroll, updateProgress } from "./service.js";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/enrollments", async (req, res) => {
  res.status(201).json({ data: await enroll(Number(req.body?.studentId), Number(req.body?.courseId)) });
});

enrollmentsRouter.patch("/enrollments/:id/progress", async (req, res) => {
  res.json({ data: await updateProgress(Number(req.params.id), req.body?.progress) });
});
`,
  "src/modules/billing/index.js": '/** The billing module\'s public API. */\nexport { billingRouter } from "./routes.js";\nexport { createInvoice } from "./service.js";\n',
  "src/modules/billing/repository.js": `import { pool } from "../../shared/db.js";

export const insert = async ({ studentId, description, amount }) =>
  (await pool.query("INSERT INTO invoices (student_id, description, amount) VALUES ($1, $2, $3) RETURNING id, description, amount, status", [studentId, description, amount])).rows[0];
export const forStudent = async (studentId) => (await pool.query("SELECT id, description, amount, status FROM invoices WHERE student_id = $1 ORDER BY id", [studentId])).rows;
`,
  "src/modules/billing/service.js": `import * as repo from "./repository.js";

export const createInvoice = (invoice) => repo.insert(invoice);
export const invoicesFor = (studentId) => repo.forStudent(studentId);
`,
  "src/modules/billing/routes.js": `import { Router } from "express";
import { invoicesFor } from "./service.js";

export const billingRouter = Router();

billingRouter.get("/students/:id/invoices", async (req, res) => res.json({ data: await invoicesFor(Number(req.params.id)) }));
`,
});
/** HTTP behaviour of the academy API (the same before and after the refactor). */
const API_BEHAVIOUR = [
  { label: "Courses: list, one, 404", check: `const all = await get("/courses"); eq(all.status, 200, "GET /courses"); eq(all.json?.data?.map((c) => c.code), ["BE-101", "DB-101", "WD-201"], "codes"); eq((await get("/courses/2")).json?.data, { id: 2, code: "DB-101", title: "Relational Databases", price: 80000, seats: 1 }, "GET /courses/2"); const nf = await get("/courses/99"); eq([nf.status, nf.json?.error?.code], [404, "COURSE_NOT_FOUND"], "a missing course");` },
  { label: "Enrolling creates the enrollment and its invoice", check: `const r = await post("/enrollments", { studentId: 3, courseId: 3 }); eq(r.status, 201, "status"); eq(r.json?.data, { id: r.json?.data?.id, studentId: 3, courseId: 3, progress: 0 }, "body"); eq((await get("/students/3/invoices")).json?.data?.map((i) => [i.description, i.amount, i.status]), [["WD-201 React Development", 90000, "open"]], "Chi's invoice");` },
  { label: "Enrollment rules: full, duplicate, missing, invalid", check: `eq((await post("/enrollments", { studentId: 1, courseId: 2 })).status, 201, "the last seat in DB-101"); const full = await post("/enrollments", { studentId: 2, courseId: 2 }); eq([full.status, full.json?.error?.code], [409, "COURSE_FULL"], "DB-101 is full"); const dup = await post("/enrollments", { studentId: 1, courseId: 1 }); eq([dup.status, dup.json?.error?.code], [409, "ALREADY_ENROLLED"], "a duplicate"); eq((await post("/enrollments", { studentId: 1, courseId: 99 })).json?.error?.code, "COURSE_NOT_FOUND", "a missing course"); eq((await post("/enrollments", { studentId: "x" })).status, 400, "invalid input"); eq((await sql("SELECT count(*)::int AS n FROM invoices WHERE student_id = 2"))[0].n, 1, "no invoice for refused enrollments");` },
  { label: "Progress and invoices", check: `const r = await patch("/enrollments/2/progress", { progress: 75 }); eq([r.status, r.json?.data?.progress], [200, 75], "PATCH progress"); eq((await patch("/enrollments/2/progress", { progress: 101 })).status, 400, "progress over 100"); eq((await patch("/enrollments/999/progress", { progress: 5 })).json?.error?.code, "ENROLLMENT_NOT_FOUND", "a missing enrollment"); eq((await get("/students/1/invoices")).json?.data?.[0], { id: 1, description: "BE-101 Backend Engineering", amount: 120000, status: "paid" }, "Ada's first invoice"); eq((await get("/nope")).json?.error?.code, "ROUTE_NOT_FOUND", "unknown routes");` },
];
const MODULE_RULES = (modules) => [
  { label: "Each module has a public index.js; other code imports only that", check: `${GRAPH} for (const m of ${JSON.stringify(modules)}) assert(SRC()["src/modules/" + m + "/index.js"], "src/modules/" + m + "/index.js (the module's public API)"); eq(boundaryViolations(), [], "imports that reach inside another module (import its index.js instead)"); noCycle();` },
  { label: "Inside each module: routes → service → repository", check: `${GRAPH} for (const p of filesIn("src/modules/")) { const name = p.split("/").pop(); const d = deps(p); if (name === "routes.js") { assert(!sqlIn(p) && !d.some((x) => x === "pg" || x.endsWith("/db.js") || x.endsWith("/repository.js")), p + ": routes call the module's service, never SQL or the repository"); } if (name === "service.js") { assert(!sqlIn(p) && !d.some((x) => x === "express" || x === "pg" || x.endsWith("/db.js")), p + ": no express, no SQL"); } if (!name.startsWith("repository") && name !== "db.js") assert(!sqlIn(p), p + " contains SQL: only repositories do"); }` },
  { label: "server.js only starts the app", check: `const lines = (file("server.js") || "").split("\\n").filter((l) => l.trim()).length; assert(lines <= 5, "server.js should import the app and listen (it has " + lines + " lines)"); has(file("src/app.js") || "", "app.use(", "src/app.js composes the modules' routers");` },
];

/* ── 17.13: two payment providers ─────────────────────────────────────── */

const EXAMPLE_API = "https://api.payments.example";
const PAYGATE_API = "https://api.paygate.example";
const EXAMPLE_SERVICE = `const express = require("express");
const app = express();
app.use(express.json());
app.locals.charges = [];
app.post("/v1/charges", (req, res) => {
  if (req.get("authorization") !== "Bearer sk_test_academy") return res.status(401).json({ error: { code: "invalid_key" } });
  const { amount, currency, reference, card } = req.body || {};
  if (!Number.isInteger(amount) || currency !== "NGN" || !reference) return res.status(400).json({ error: { code: "invalid_request" } });
  if (card === "4000000000000002") return res.status(402).json({ error: { code: "card_declined", message: "The card was declined" } });
  const charge = { id: "ch_" + (app.locals.charges.length + 1), amount, currency, reference, status: "succeeded" };
  app.locals.charges.push(charge);
  res.status(201).json(charge);
});
module.exports = app;
`;
const PAYGATE_SERVICE = `const express = require("express");
const app = express();
app.use(express.json());
app.locals.transactions = [];
// A different provider, a different API: amounts in naira, an API-key header, always 200.
app.post("/transactions", (req, res) => {
  if (req.get("x-api-key") !== "pg_test_key") return res.status(401).json({ message: "bad key" });
  const { amountNaira, ref, cardNumber } = req.body || {};
  if (typeof amountNaira !== "number" || !ref || !cardNumber) return res.status(422).json({ message: "amountNaira, ref and cardNumber are required" });
  const declined = cardNumber === "4000000000000002";
  const transaction = { id: "tx_" + (app.locals.transactions.length + 1), reference: ref, amountNaira, state: declined ? "DECLINED" : "APPROVED" };
  app.locals.transactions.push(transaction);
  res.json({ transaction });
});
module.exports = app;
`;
const ORDERS_SQL = `CREATE TABLE orders (id integer PRIMARY KEY, amount integer NOT NULL, status text NOT NULL DEFAULT 'pending', charge_id text);
INSERT INTO orders (id, amount) VALUES (1, 12000000), (2, 8000000), (3, 9000000), (4, 12000000);
`;
const ORDERS_JS = `import { AppError } from "./errors.js";
import { pool } from "./db.js";

/**
 * The orders service needs a payment gateway: an object with
 *   charge({ reference, amountKobo, card }) → { ok: true, chargeId } | { ok: false, reason: "declined" }
 * It does not know, or care, which provider is behind it.
 */
export function createOrderService({ gateway }) {
  return {
    async pay(orderId, card) {
      const { rows } = await pool.query("SELECT id, amount, status FROM orders WHERE id = $1", [orderId]);
      const order = rows[0];
      if (!order) throw new AppError(404, "ORDER_NOT_FOUND", "No such order");
      if (order.status === "paid") throw new AppError(409, "ALREADY_PAID", "This order is already paid");
      const result = await gateway.charge({ reference: \`order-\${order.id}\`, amountKobo: order.amount, card });
      if (!result.ok) throw new AppError(402, "PAYMENT_DECLINED", "The card was declined");
      const paid = await pool.query("UPDATE orders SET status = 'paid', charge_id = $2 WHERE id = $1 RETURNING id, status, charge_id AS \\"chargeId\\"", [order.id, result.chargeId]);
      return paid.rows[0];
    },
  };
}
`;

/* ── 17.12: the refund rules ──────────────────────────────────────────── */

const REFUND_SQL = `CREATE TABLE enrollments (id integer PRIMARY KEY, student_id integer NOT NULL, course_code text NOT NULL, price integer NOT NULL, enrolled_at timestamptz NOT NULL, progress integer NOT NULL, refunded_at timestamptz);
INSERT INTO enrollments VALUES
  (1, 1, 'BE-101', 120000, now() - interval '3 days', 10, NULL),
  (2, 1, 'DB-101', 80000, now() - interval '10 days', 20, NULL),
  (3, 2, 'BE-101', 120000, now() - interval '20 days', 5, NULL),
  (4, 2, 'WD-201', 90000, now() - interval '2 days', 45, NULL),
  (5, 3, 'BE-101', 120000, now() - interval '1 day', 0, now() - interval '1 hour'),
  (6, 3, 'DB-101', 80000, now() - interval '9 days', 29, NULL);
`;
const REFUND_SERVER = `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.post("/enrollments/:id/refund", async (req, res) => {
  const { rows } = await pool.query('SELECT id, price, enrolled_at AS "enrolledAt", progress, refunded_at AS "refundedAt" FROM enrollments WHERE id = $1', [req.params.id]);
  const e = rows[0];
  if (!e) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  if (e.refundedAt) return res.status(409).json({ error: { code: "ALREADY_REFUNDED", message: "Already refunded" } });
  const days = (Date.now() - new Date(e.enrolledAt).getTime()) / 86400000;
  if (days > 14) return res.status(409).json({ error: { code: "TOO_LATE", message: "Refunds are possible for 14 days" } });
  if (e.progress >= 30) return res.status(409).json({ error: { code: "TOO_MUCH_PROGRESS", message: "Refunds are possible until 30% of the course" } });
  const amount = days <= 7 ? e.price : Math.round(e.price / 2);
  await pool.query("UPDATE enrollments SET refunded_at = now() WHERE id = $1", [e.id]);
  res.json({ data: { id: e.id, amount } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 121 · 17.1 – 17.3 · CONCERNS, RESPONSIBILITIES, LAYERS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l121-separation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2", "17.3"],
    title: "Separation of Concerns, Single Responsibility and Layers",
    subtitle: "Code that changes for one reason, in one place",
    estimatedMinutes: 75,
    intro:
      "So far each lab was small enough to live in a file or two. Real codebases grow for years, and the cost of a change depends on how the code is divided: whether a pricing change touches one file or twelve, and whether one module can be understood without reading all the others.",
    atoms: [
      {
        id: "a-be-separation",
        title: "Separation of concerns",
        explain:
          "A CONCERN is one kind of knowledge: HTTP (status codes, headers, parsing), business rules (who may enroll, what it costs), persistence (SQL, tables), and integrations (email, payments). When one route handler holds all four, every change risks the others, nothing can be tested without a server and a database, and the same rule gets copied into the next handler. Separating concerns puts each kind of knowledge in its own place, with narrow connections between them.",
        decision: decide({
          scenario: "POST /enrollments is a 140-line handler: it parses the body, runs six SQL queries, computes discounts, decides whether the course is full, charges the card through fetch and sends an email. The pricing team wants a new discount, and the same discount logic is also copied in POST /orders.",
          question: "What is the core problem?",
          right: ["Different concerns (HTTP, rules, SQL, integrations) are mixed, so a rule cannot be changed, reused or tested on its own", "Pricing should live in one place both routes call."],
          wrong: [
            ["The handler is too long; splitting it into three handlers fixes it", "Shorter, but still mixed."],
            ["It should use an ORM instead of SQL", "Persistence is one concern among four."],
            ["Express is the wrong framework", "The problem is the structure, not the framework."],
          ],
          at: 0,
          aftermath: "The rest of the week gives each concern its home.",
        }),
      },
      {
        id: "a-be-dependency-cycles",
        title: "Single responsibility and dependency management",
        explain:
          "SINGLE RESPONSIBILITY: a module should have one reason to change. DEPENDENCIES should point one way, from the module that USES to the module that is used, never back. An import CYCLE (A imports B, B imports A) is the usual sign that responsibilities are tangled, and in ES modules it can crash at start: one module runs before the other has initialised its exports (ReferenceError: Cannot access … before initialization). Fix cycles by moving shared knowledge into a module both can depend on, or by moving a function to the module whose data it uses.",
        nodeLab: {
          task:
            "server.js crashes at start because courses.js and enrollments.js import each other. Break the cycle so dependencies point one way: courses.js knows nothing about enrollments; the per-student limit (MAX_PER_STUDENT) lives in a new policy.js that both import; seatsLeft lives with the enrollments it counts; and the catalog with seats left, which needs both, gets its own catalog.js. Keep every endpoint's behaviour.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] }),
            "server.js": `import express from "express";
import { enroll, listForStudent } from "./enrollments.js";
import { catalog } from "./courses.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: catalog() }));

app.post("/enrollments", (req, res) => {
  const result = enroll(req.body.studentId, req.body.courseId);
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.status(201).json({ data: result.enrollment });
});

app.get("/students/:id/enrollments", (req, res) => res.json({ data: listForStudent(Number(req.params.id)) }));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "courses.js": `import { MAX_PER_STUDENT, seatsLeft } from "./enrollments.js";

const COURSES = [
${CYCLE_COURSES}
];

// Shown on every course card.
const NOTE = \`Each student can take up to \${MAX_PER_STUDENT} courses at a time.\`;

export const findCourse = (id) => COURSES.find((c) => c.id === id);
export const catalog = () => COURSES.map((c) => ({ ...c, seatsLeft: seatsLeft(c), note: NOTE }));
`,
            "enrollments.js": `import { findCourse } from "./courses.js";

export const MAX_PER_STUDENT = 3;
const enrollments = [];

${CYCLE_ENROLL_BODY}`,
          },
          readOnly: ["package.json"],
          open: "courses.js",
          solution: {
            "policy.js": "/** Enrollment policy shared by the catalog and enrollments. */\nexport const MAX_PER_STUDENT = 3;\n",
            "courses.js": `import { MAX_PER_STUDENT } from "./policy.js";

const COURSES = [
${CYCLE_COURSES}
];

// Shown on every course card.
export const NOTE = \`Each student can take up to \${MAX_PER_STUDENT} courses at a time.\`;

export const allCourses = () => COURSES;
export const findCourse = (id) => COURSES.find((c) => c.id === id);
`,
            "enrollments.js": `import { findCourse } from "./courses.js";
import { MAX_PER_STUDENT } from "./policy.js";

const enrollments = [];

${CYCLE_ENROLL_BODY}`,
            "catalog.js": `import { NOTE, allCourses } from "./courses.js";
import { seatsLeft } from "./enrollments.js";

/** The course list as the website shows it: it needs both courses and enrollments. */
export const catalog = () => allCourses().map((c) => ({ ...c, seatsLeft: seatsLeft(c), note: NOTE }));
`,
            "server.js": `import express from "express";
import { catalog } from "./catalog.js";
import { enroll, listForStudent } from "./enrollments.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: catalog() }));

app.post("/enrollments", (req, res) => {
  const result = enroll(req.body.studentId, req.body.courseId);
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.status(201).json({ data: result.enrollment });
});

app.get("/students/:id/enrollments", (req, res) => res.json({ data: listForStudent(Number(req.params.id)) }));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "The server starts and lists the courses", check: `const r = await get("/courses"); eq(r.status, 200, "GET /courses (the server crashed at start: " + stderr().split("\\n").find((l) => /Error/.test(l)) + ")"); eq(r.json.data[0], { id: 1, code: "BE-101", title: "Backend Engineering", seats: 2, seatsLeft: 2, note: "Each student can take up to 3 courses at a time." }, "the first course");` },
            { label: "No import cycle; courses.js knows nothing about enrollments", check: `${GRAPH} noCycle(); eq(deps("courses.js").filter((d) => d.includes("enrollments") || d.includes("catalog")), [], "courses.js must not import enrollments or catalog"); assert(deps("courses.js").includes("policy.js") && deps("enrollments.js").includes("policy.js"), "courses.js and enrollments.js both take MAX_PER_STUDENT from policy.js"); const { MAX_PER_STUDENT } = await load("policy.js"); eq(MAX_PER_STUDENT, 3, "policy.js exports MAX_PER_STUDENT");` },
            { label: "The rules still hold: seats, duplicates, the per-student limit", check: `eq((await post("/enrollments", { studentId: 1, courseId: 1 })).status, 201, "Ada into BE-101"); eq((await post("/enrollments", { studentId: 1, courseId: 1 })).json?.error?.code, "ALREADY_ENROLLED", "twice"); eq((await post("/enrollments", { studentId: 2, courseId: 1 })).status, 201, "Bayo takes the last seat"); eq((await post("/enrollments", { studentId: 3, courseId: 1 })).json?.error?.code, "COURSE_FULL", "BE-101 is full"); eq((await get("/courses")).json.data[0].seatsLeft, 0, "seatsLeft"); for (const c of [2, 3]) await post("/enrollments", { studentId: 1, courseId: c }); eq((await post("/enrollments", { studentId: 1, courseId: 4 })).json?.error?.code, "TOO_MANY_COURSES", "a fourth course for Ada"); eq((await get("/students/1/enrollments")).json.data.length, 3, "Ada's enrollments");` },
          ],
          hint: "Run it first and read the error. Then: MAX_PER_STUDENT → policy.js; seatsLeft is already in enrollments.js, so courses.js only needs to stop importing it; catalog() moves to catalog.js, which imports from both; server.js imports catalog from there.",
          successMessage: "Dependencies now point one way (catalog → enrollments → courses → policy), so each file can be read, tested and changed without the others.",
        },
      },
      {
        id: "a-be-layered-architecture",
        title: "Layered architecture",
        explain:
          "A LAYERED architecture stacks the concerns: the HTTP layer (routes or controllers: parse requests, send responses), the service layer (business rules and use cases), and the data layer (repositories: SQL), with dependencies pointing DOWN only. A service never sees req or res; a repository never decides a business rule; routes never write SQL. The payoff: rules are tested without HTTP, SQL can change without touching rules, and a second entry point (a CLI, a queue worker) reuses the services unchanged.",
        decision: decide({
          scenario: "A code review of a layered API finds four imports.",
          question: "Which one breaks the layering?",
          right: ["src/repositories/courses.js imports isFull() from src/services/enrollments.js", "A lower layer depending on a higher one: the data layer now holds a business rule."],
          wrong: [
            ["src/routes/enrollments.js imports enroll() from src/services/enrollments.js", "Routes calling services is the intended direction."],
            ["src/services/enrollments.js imports findCourse() from src/repositories/courses.js", "Services use repositories."],
            ["src/repositories/courses.js imports pool from src/db.js", "Repositories use the database."],
          ],
          at: 2,
          aftermath: "Next lesson splits a real handler into those three layers.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 122 · 17.4 – 17.5 · CONTROLLERS, SERVICES, REPOSITORIES; DOMAIN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l122-layers-domain",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.4", "17.5"],
    title: "Controllers, Services, Repositories and Domain Models",
    subtitle: "Where each line of a feature belongs",
    estimatedMinutes: 90,
    intro: "Two labs: first split a fat route into its three layers, then go one step further and put the business rules of a course into a domain model that knows nothing about HTTP, SQL or the clock.",
    atoms: [
      {
        id: "a-be-controllers-services",
        title: "Controllers, services and repositories",
        explain:
          "CONTROLLER (route handler): turns the request into plain values, calls one service function, turns the result into a response; no SQL, no rules. SERVICE: one function per use case (enroll, listForStudent) that applies the rules and coordinates repositories; it throws errors with codes and returns plain data. REPOSITORY: one function per query (findCourse, countForCourse, insert), returning plain objects; no rules. An Express Router per feature keeps the routes together, and server.js only assembles them.",
        nodeLab: {
          task:
            "Split server.js into layers without changing behaviour: src/routes/enrollments.js (an Express Router with both routes, calling the service), src/services/enrollments.js (enroll(studentId, courseId) and listForStudent(studentId), with the four rules, throwing AppError), and src/repositories/enrollments.js (every SQL query). server.js keeps only the app setup. Routes must not touch the database or repositories; services must not import express or the database.",
          db: LAYERS_SQL,
          files: {
            "package.json": PKG(),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            "src/db.js": DB_JS,
            "src/errors.js": ERRORS_JS,
            "server.js": FAT_SERVER,
          },
          readOnly: ["package.json", ".env", "src/db.js", "src/errors.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { errorHandler, notFound } from "./src/errors.js";
import { enrollmentsRouter } from "./src/routes/enrollments.js";

const app = express();
app.use(express.json());
app.use(enrollmentsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "src/routes/enrollments.js": `import { Router } from "express";
import { enroll, listForStudent } from "../services/enrollments.js";

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/enrollments", async (req, res) => {
  const enrollment = await enroll(Number(req.body?.studentId), Number(req.body?.courseId));
  res.status(201).json({ data: enrollment });
});

enrollmentsRouter.get("/students/:id/enrollments", async (req, res) => {
  res.json({ data: await listForStudent(Number(req.params.id)) });
});
`,
            "src/services/enrollments.js": `import { AppError } from "../errors.js";
import * as repo from "../repositories/enrollments.js";

export async function enroll(studentId, courseId) {
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) throw new AppError(400, "VALIDATION_FAILED", "studentId and courseId are required");
  const course = await repo.findCourse(courseId);
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
  if ((await repo.countForCourse(courseId)) >= course.seats) throw new AppError(409, "COURSE_FULL", "This course is full");
  if (await repo.exists(studentId, courseId)) throw new AppError(409, "ALREADY_ENROLLED", "Already enrolled in this course");
  return repo.insert(studentId, courseId);
}

export const listForStudent = (studentId) => repo.listForStudent(studentId);
`,
            "src/repositories/enrollments.js": `import { pool } from "../db.js";

export const findCourse = async (id) => (await pool.query("SELECT id, seats FROM courses WHERE id = $1", [id])).rows[0] ?? null;

export const countForCourse = async (courseId) => (await pool.query("SELECT count(*)::int AS n FROM enrollments WHERE course_id = $1", [courseId])).rows[0].n;

export const exists = async (studentId, courseId) =>
  (await pool.query("SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [studentId, courseId])).rowCount > 0;

export const insert = async (studentId, courseId) =>
  (await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id, student_id AS "studentId", course_id AS "courseId"', [studentId, courseId])).rows[0];

export const listForStudent = async (studentId) =>
  (await pool.query("SELECT e.id, c.code, c.title FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 ORDER BY e.id", [studentId])).rows;
`,
          },
          tests: [
            { label: "The behaviour is unchanged", check: `const r = await post("/enrollments", { studentId: 2, courseId: 2 }); eq([r.status, r.json?.data?.studentId, r.json?.data?.courseId], [201, 2, 2], "Bayo into DB-101"); eq((await post("/enrollments", { studentId: 3, courseId: 2 })).json?.error?.code, "COURSE_FULL", "DB-101 has one seat"); eq((await post("/enrollments", { studentId: 1, courseId: 1 })).json?.error?.code, "ALREADY_ENROLLED", "a duplicate"); eq((await post("/enrollments", { studentId: 1, courseId: 9 })).json?.error?.code, "COURSE_NOT_FOUND", "a missing course"); eq((await post("/enrollments", {})).status, 400, "invalid input"); eq((await get("/students/2/enrollments")).json?.data, [{ id: r.json.data.id, code: "DB-101", title: "Relational Databases" }], "Bayo's enrollments");` },
            ...LAYER_RULES,
            { label: "The service works without HTTP", check: `const s = await load("src/services/enrollments.js"); const e = await s.enroll(3, 3); eq([e.studentId, e.courseId], [3, 3], "enroll(3, 3) returns the enrollment"); let err = null; try { await s.enroll(3, 99); } catch (x) { err = x; } eq([err?.status, err?.code], [404, "COURSE_NOT_FOUND"], "enroll(3, 99) throws the AppError");` },
          ],
          hint: "Start with the repository: one exported function per query, copied from server.js. Then the service: the same if/throw lines, calling repository functions. The router's handlers become two lines each. Finally server.js: app.use(enrollmentsRouter) between express.json() and notFound.",
          successMessage: "Each layer now has one job, and the service can be called from a test, a script or a queue worker as easily as from HTTP.",
        },
      },
      {
        id: "a-be-domain-model",
        title: "Domain models and business rules",
        explain:
          "A DOMAIN MODEL is an object that holds business data together with the rules about it: a Course knows its seats, enrollment window, prerequisites and who is enrolled, and course.enroll(student, now) either records the enrollment or throws a DomainError with a reason. It imports nothing: no database, no HTTP, not even the clock (now is passed in), so every rule is a plain function call in a test. Invariants are checked in the constructor, so an invalid Course cannot exist.",
        nodeLab: {
          task:
            "Write src/domain/course.js: DomainError(code) and class Course({ id, code, seats, opensAt, closesAt, prerequisites = [], enrolledIds = [] }). The constructor throws DomainError(\"INVALID_COURSE\") unless seats is a whole number ≥ 1 and closesAt is after opensAt. seatsLeft is a getter. checkEnrollment(student, now) returns the first broken rule or null, in this order: ALREADY_ENROLLED, NOT_OPEN (now before opensAt), CLOSED (now at or after closesAt), FULL, MISSING_PREREQUISITE (a prerequisite code not in student.completed). enroll(student, now) throws DomainError(rule) or adds the student and returns { courseId, studentId, enrolledAt: now }.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "src/domain/course.js": "export class DomainError extends Error {}\n\nexport class Course {}\n",
          },
          readOnly: ["package.json"],
          open: "src/domain/course.js",
          solution: {
            "src/domain/course.js": `/** A broken business rule. code names it (FULL, CLOSED, …). */
export class DomainError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

export class Course {
  constructor({ id, code, seats, opensAt, closesAt, prerequisites = [], enrolledIds = [] }) {
    if (!Number.isInteger(seats) || seats < 1) throw new DomainError("INVALID_COURSE", "seats must be a whole number, 1 or more");
    if (!(closesAt > opensAt)) throw new DomainError("INVALID_COURSE", "closesAt must be after opensAt");
    Object.assign(this, { id, code, seats, opensAt, closesAt, prerequisites: [...prerequisites], enrolledIds: [...enrolledIds] });
  }

  get seatsLeft() {
    return this.seats - this.enrolledIds.length;
  }

  /** The first rule this enrollment would break, or null. */
  checkEnrollment(student, now) {
    if (this.enrolledIds.includes(student.id)) return "ALREADY_ENROLLED";
    if (now < this.opensAt) return "NOT_OPEN";
    if (now >= this.closesAt) return "CLOSED";
    if (this.seatsLeft === 0) return "FULL";
    if (this.prerequisites.some((p) => !student.completed?.includes(p))) return "MISSING_PREREQUISITE";
    return null;
  }

  enroll(student, now) {
    const broken = this.checkEnrollment(student, now);
    if (broken) throw new DomainError(broken);
    this.enrolledIds.push(student.id);
    return { courseId: this.id, studentId: student.id, enrolledAt: now };
  }
}
`,
          },
          tests: [
            { label: "Invalid courses cannot be created", check: `const { Course, DomainError } = await load("src/domain/course.js"); const base = { id: 1, code: "BE-101", seats: 2, opensAt: new Date("2026-11-01"), closesAt: new Date("2026-12-01") }; for (const bad of [{ seats: 0 }, { seats: 2.5 }, { closesAt: new Date("2026-10-01") }, { closesAt: new Date("2026-11-01") }]) { let err = null; try { new Course({ ...base, ...bad }); } catch (e) { err = e; } assert(err instanceof DomainError && err.code === "INVALID_COURSE", "new Course(" + JSON.stringify(bad) + ") should throw DomainError INVALID_COURSE"); } eq(new Course(base).seatsLeft, 2, "seatsLeft");` },
            { label: "Each rule, in order", check: `const { Course } = await load("src/domain/course.js"); const mk = (x = {}) => new Course({ id: 1, code: "BE-101", seats: 2, opensAt: new Date("2026-11-01"), closesAt: new Date("2026-12-01"), prerequisites: ["DB-101"], ...x }); const ada = { id: 1, completed: ["DB-101"] }; const inside = new Date("2026-11-10"); eq(mk().checkEnrollment(ada, inside), null, "allowed"); eq(mk({ enrolledIds: [1] }).checkEnrollment(ada, new Date("2027-01-01")), "ALREADY_ENROLLED", "already enrolled comes first"); eq(mk().checkEnrollment(ada, new Date("2026-10-31")), "NOT_OPEN", "before opensAt"); eq(mk().checkEnrollment(ada, new Date("2026-12-01")), "CLOSED", "exactly at closesAt"); eq(mk({ enrolledIds: [7, 8] }).checkEnrollment(ada, inside), "FULL", "no seats left"); eq(mk().checkEnrollment({ id: 2, completed: [] }, inside), "MISSING_PREREQUISITE", "without DB-101"); eq(mk().checkEnrollment({ id: 2 }, inside), "MISSING_PREREQUISITE", "a student without a completed list"); eq(mk({ enrolledIds: [7, 8] }).checkEnrollment({ id: 2, completed: [] }, new Date("2027-01-01")), "CLOSED", "CLOSED before FULL before MISSING_PREREQUISITE");` },
            { label: "enroll() records the student or throws the rule", check: `const { Course, DomainError } = await load("src/domain/course.js"); const c = new Course({ id: 4, code: "AI-101", seats: 1, opensAt: new Date("2026-11-01"), closesAt: new Date("2026-12-01") }); const now = new Date("2026-11-05T10:00:00Z"); eq(c.enroll({ id: 9, completed: [] }, now), { courseId: 4, studentId: 9, enrolledAt: now }, "the enrollment"); eq([c.seatsLeft, c.enrolledIds], [0, [9]], "the student is recorded"); let err = null; try { c.enroll({ id: 10, completed: [] }, now); } catch (e) { err = e; } assert(err instanceof DomainError && err.code === "FULL", "a second student: DomainError FULL"); eq(c.enrolledIds, [9], "nothing recorded on failure");` },
            { label: "The model imports nothing and never reads the clock", check: `const src = file("src/domain/course.js") || ""; assert(!/^\\s*import\\b/m.test(src), "a domain model imports nothing: no database, no framework"); assert(!/Date\\.now\\(|new Date\\(\\s*\\)/.test(src), "take now as a parameter instead of reading the clock (tests can then pick any time)");` },
          ],
          hint: "Copy the arrays in the constructor ([...enrolledIds]) so callers cannot change the model behind its back. checkEnrollment is a list of if (…) return \"CODE\" in the given order; enroll calls it and throws.",
          successMessage: "The course's rules now live in one class you can read in a minute and test without a server, a database or a clock.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 123 · 17.6 – 17.8 · DI, DDD, MODULAR MONOLITH
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l123-di-ddd-modules",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.6", "17.7", "17.8"],
    title: "Dependency Injection, Domain-Driven Design and the Modular Monolith",
    subtitle: "Who builds what, what words mean, and where the walls are",
    estimatedMinutes: 100,
    intro: "Three ideas for code that has outgrown one folder: give each part its dependencies instead of letting it grab them, name things the way the business does, and divide one application into modules with walls a tool can check.",
    atoms: [
      {
        id: "a-be-dependency-injection",
        title: "Dependency injection",
        explain:
          "A service that imports the database pool, nodemailer and the system clock can only ever run against the real database, send real email and live in the present. With DEPENDENCY INJECTION it RECEIVES them instead: createEnrollmentService({ repo, mailer, clock }). Production code wires the real implementations in one place, the COMPOSITION ROOT (server.js); a test passes an in-memory repo, a mailer that records messages and a fixed clock. No framework is needed: factory functions taking an object of dependencies are the whole technique.",
        nodeLab: {
          task:
            "Rewrite src/services/enrollments.js as createEnrollmentService({ repo, mailer, clock }) returning { enroll(studentId, courseId) }: 404 COURSE_NOT_FOUND / STUDENT_NOT_FOUND, 409 NOT_OPEN (clock.now() before opensAt), CLOSED (at or after closesAt), ALREADY_ENROLLED; then repo.insert(studentId, courseId, clock.now()) and mailer.send({ to: student.email, subject: \"Welcome to <code>\", text: \"Hi <fullName>, you are enrolled in <title>.\" }). It must import nothing but errors.js. Then make server.js the composition root: the real repository, the SMTP mailer and a system clock.",
          db: DI_SQL,
          mail: true,
          files: {
            "package.json": PKG(["express", "nodemailer", "pg"]),
            ".env": `DATABASE_URL=${DB_URL}\nSMTP_HOST=localhost\nSMTP_PORT=1025\n`,
            "src/db.js": DB_JS,
            "src/errors.js": ERRORS_JS,
            "src/repositories/enrollments.js": DI_REPO,
            "src/adapters/smtpMailer.js": DI_MAILER,
            "src/app.js": DI_APP,
            "src/services/enrollments.js": `import nodemailer from "nodemailer";
import { pool } from "../db.js";
import { AppError } from "../errors.js";
import { createEnrollmentRepository } from "../repositories/enrollments.js";

// Hard-wired: the real database, real email and the real clock, always.
const repo = createEnrollmentRepository(pool);
const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) });

export async function enroll(studentId, courseId) {
  const course = await repo.findCourse(courseId);
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
  const student = await repo.findStudent(studentId);
  if (!student) throw new AppError(404, "STUDENT_NOT_FOUND", "No such student");
  const now = new Date();
  if (now < course.opensAt) throw new AppError(409, "NOT_OPEN", "Enrollment has not opened yet");
  if (now >= course.closesAt) throw new AppError(409, "CLOSED", "Enrollment has closed");
  if (await repo.exists(studentId, courseId)) throw new AppError(409, "ALREADY_ENROLLED", "Already enrolled in this course");
  const enrollment = await repo.insert(studentId, courseId, now);
  await transport.sendMail({ from: "Academy <no-reply@academy.example>", to: student.email, subject: \`Welcome to \${course.code}\`, text: \`Hi \${student.fullName}, you are enrolled in \${course.title}.\` });
  return enrollment;
}
`,
            "server.js": `import { createApp } from "./src/app.js";
import { enroll } from "./src/services/enrollments.js";

createApp({ enrollments: { enroll } }).listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "src/db.js", "src/errors.js", "src/repositories/enrollments.js", "src/adapters/smtpMailer.js", "src/app.js"],
          open: "src/services/enrollments.js",
          solution: {
            "src/services/enrollments.js": `import { AppError } from "../errors.js";

/**
 * The enrollment use case. Its dependencies are passed in:
 *   repo    findCourse, findStudent, exists, insert
 *   mailer  send({ to, subject, text })
 *   clock   now() → Date
 */
export function createEnrollmentService({ repo, mailer, clock }) {
  return {
    async enroll(studentId, courseId) {
      const course = await repo.findCourse(courseId);
      if (!course) throw new AppError(404, "COURSE_NOT_FOUND", "No such course");
      const student = await repo.findStudent(studentId);
      if (!student) throw new AppError(404, "STUDENT_NOT_FOUND", "No such student");
      const now = clock.now();
      if (now < course.opensAt) throw new AppError(409, "NOT_OPEN", "Enrollment has not opened yet");
      if (now >= course.closesAt) throw new AppError(409, "CLOSED", "Enrollment has closed");
      if (await repo.exists(studentId, courseId)) throw new AppError(409, "ALREADY_ENROLLED", "Already enrolled in this course");
      const enrollment = await repo.insert(studentId, courseId, now);
      await mailer.send({ to: student.email, subject: \`Welcome to \${course.code}\`, text: \`Hi \${student.fullName}, you are enrolled in \${course.title}.\` });
      return enrollment;
    },
  };
}
`,
            "server.js": `import { createSmtpMailer } from "./src/adapters/smtpMailer.js";
import { createApp } from "./src/app.js";
import { pool } from "./src/db.js";
import { createEnrollmentRepository } from "./src/repositories/enrollments.js";
import { createEnrollmentService } from "./src/services/enrollments.js";

// The composition root: the one place that knows which implementations are used.
const enrollments = createEnrollmentService({
  repo: createEnrollmentRepository(pool),
  mailer: createSmtpMailer({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), from: "Academy <no-reply@academy.example>" }),
  clock: { now: () => new Date() },
});

createApp({ enrollments }).listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "It works for real: enrollment saved, welcome email sent", check: `const r = await post("/enrollments", { studentId: 1, courseId: 1 }); eq([r.status, r.json?.data?.studentId], [201, 1], "Ada into BE-101"); const mail = emails().at(-1); eq([mail?.to?.[0], mail?.subject, mail?.text], ["ada@example.com", "Welcome to BE-101", "Hi Ada Obi, you are enrolled in Backend Engineering."], "the welcome email"); eq((await post("/enrollments", { studentId: 1, courseId: 2 })).json?.error?.code, "NOT_OPEN", "AI-101 opens in 2099"); eq((await post("/enrollments", { studentId: 1, courseId: 3 })).json?.error?.code, "CLOSED", "DB-101 closed in 2020");` },
            { label: "…and with fakes: an in-memory repo, a recording mailer, a fixed clock", check: `const { createEnrollmentService } = await load("src/services/enrollments.js"); assert(typeof createEnrollmentService === "function", "export createEnrollmentService({ repo, mailer, clock })"); const saved = [], sent = []; const repo = { findCourse: async (id) => (id === 7 ? { id: 7, code: "QA-101", title: "Testing", opensAt: new Date("2030-01-01"), closesAt: new Date("2030-02-01") } : null), findStudent: async (id) => (id === 5 ? { id: 5, email: "eve@example.com", fullName: "Eve Ani" } : null), exists: async (s, c) => saved.some((e) => e.studentId === s && e.courseId === c), insert: async (studentId, courseId, enrolledAt) => { const e = { id: saved.length + 1, studentId, courseId, enrolledAt }; saved.push(e); return e; } }; let now = new Date("2030-01-15T09:00:00Z"); const svc = createEnrollmentService({ repo, mailer: { send: async (m) => { sent.push(m); } }, clock: { now: () => now } }); const e = await svc.enroll(5, 7); eq(e.enrolledAt, now, "enrolledAt comes from the injected clock"); eq(sent, [{ to: "eve@example.com", subject: "Welcome to QA-101", text: "Hi Eve Ani, you are enrolled in Testing." }], "the email went to the injected mailer"); let err = null; try { await svc.enroll(5, 7); } catch (x) { err = x; } eq(err?.code, "ALREADY_ENROLLED", "a duplicate, seen through the fake repo"); now = new Date("2030-02-01T00:00:00Z"); err = null; try { await svc.enroll(6, 7); } catch (x) { err = x; } eq(err?.code, "STUDENT_NOT_FOUND", "student 6"); err = null; try { await svc.enroll(5, 1); } catch (x) { err = x; } eq(err?.code, "COURSE_NOT_FOUND", "course 1");` },
            { label: "The service grabs nothing itself", check: `${GRAPH} eq(deps("src/services/enrollments.js").filter((d) => d !== "src/errors.js"), [], "the service imports only errors.js: its database, mailer and clock are passed in"); assert(!/Date\\.now\\(|new Date\\(\\s*\\)/.test(SRC()["src/services/enrollments.js"]), "use clock.now(), not the system clock"); const root = SRC()["server.js"] || ""; for (const f of ["createEnrollmentService(", "createEnrollmentRepository(", "createSmtpMailer("]) has(root, f, "server.js (the composition root) wires the real implementations");` },
          ],
          hint: "Wrap the existing enroll in export function createEnrollmentService({ repo, mailer, clock }) { return { async enroll(…) { … } } }, replace new Date() with clock.now() and transport.sendMail with mailer.send({ to, subject, text }), and delete the imports that are no longer needed. Move the wiring into server.js.",
          successMessage: "The same use case now runs against PostgreSQL and SMTP in production and against three tiny fakes in a test, with no change to its code.",
        },
      },
      {
        id: "a-be-ddd",
        title: "Domain-driven design fundamentals",
        explain:
          "DOMAIN-DRIVEN DESIGN starts from the business, not the database. The UBIQUITOUS LANGUAGE: code uses the words domain experts use (enrollment, cohort, refund window), so conversations and code match. BOUNDED CONTEXTS: the same word can mean different things in different parts of the business (a 'student' in Learning has progress and certificates; in Billing the same person is a 'customer' with invoices and a tax id); each context gets its own model and its own module, and they talk through explicit interfaces rather than one giant shared model. ENTITIES have identity (an enrollment), VALUE OBJECTS are defined by their values (an amount in naira), and AGGREGATES group what must change together under one root (a course and its enrolled seats).",
        decision: decide({
          scenario: "The academy has one User table with 47 columns used by learning, billing and support. Every change to it breaks something; the billing team wants VAT numbers and invoice addresses, the learning team wants study streaks.",
          question: "What does domain-driven design suggest?",
          right: ["Separate bounded contexts (Learning, Billing, Support), each with its own model of the person (Student, Customer, Requester) linked by id", "Each context changes on its own terms."],
          wrong: [
            ["Add the new columns to the User table", "Makes the shared model worse."],
            ["Split the table into two at random", "Splits must follow the business contexts."],
            ["Move everything into microservices first", "Boundaries come first; deployment is a separate decision."],
          ],
          at: 0,
          aftermath: "A modular monolith gives each context a module with walls, before (or instead of) separate services.",
        }),
      },
      {
        id: "a-be-modular-boundaries",
        title: "Modular monolith architecture",
        explain:
          "A MODULAR MONOLITH is one deployable application divided into modules along business lines (courses, enrollments, billing), each owning its code and its tables and exposing a small PUBLIC API (its index.js). Other modules may import only that index, never a module's internals (its repository, its helpers), so a module can be rewritten inside without breaking others, and could later become a separate service along a seam that already exists. Boundaries erode one convenient import at a time, so teams enforce them with a tool in CI (dependency-cruiser, eslint-plugin-boundaries, or a short script like this one).",
        nodeLab: {
          task:
            "Write scripts/check-boundaries.js [root]: scan every .js file under <root>/src (root defaults to \".\"), find its imports and exports … from (also multi-line ones), and report each import of a file inside src/modules/<m>/ from outside that module, unless it is src/modules/<m>/index.js. Print each violation as \"<file> → <imported file>\" (paths relative to root, sorted), then \"<n> boundary violation(s)\", and exit 1; with none, print \"No boundary violations in <count> files\" and exit 0. fixtures/violating has three violations to find.",
          command: "node scripts/check-boundaries.js fixtures/violating",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { "lint:boundaries": "node scripts/check-boundaries.js" }, deps: [] }),
            ...MOD_FILES(false),
            ...MOD_FILES(true),
            "scripts/check-boundaries.js": `import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.argv[2] ?? ".";
`,
          },
          readOnly: ["package.json", ...Object.keys(MOD_FILES(false)), ...Object.keys(MOD_FILES(true))],
          open: "scripts/check-boundaries.js",
          solution: {
            "scripts/check-boundaries.js": `import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.argv[2] ?? ".";
const IMPORT = /(?:^|\\n)\\s*(?:import|export)\\b[^;"']*?\\bfrom\\s*["']([^"']+)["']|(?:^|\\n)\\s*import\\s*["']([^"']+)["']/g;

/** Every .js file under dir, as paths relative to root with forward slashes. */
function jsFiles(dir) {
  return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = \`\${dir}/\${entry.name}\`;
    if (entry.isDirectory()) return jsFiles(rel);
    return entry.name.endsWith(".js") ? [rel] : [];
  });
}

const moduleOf = (file) => /^src\\/modules\\/([^/]+)\\//.exec(file)?.[1] ?? null;

const files = jsFiles("src");
const violations = [];
for (const file of files) {
  const code = readFileSync(path.join(root, file), "utf8");
  for (const match of code.matchAll(IMPORT)) {
    const spec = match[1] ?? match[2];
    if (!spec.startsWith(".")) continue; // a package
    const target = path.posix.join(path.posix.dirname(file), spec);
    const owner = moduleOf(target);
    if (owner && moduleOf(file) !== owner && target !== \`src/modules/\${owner}/index.js\`) violations.push(\`\${file} → \${target}\`);
  }
}

if (violations.length) {
  for (const v of violations.sort()) console.log(v);
  console.log(\`\${violations.length} boundary violation(s)\`);
  process.exit(1);
}
console.log(\`No boundary violations in \${files.length} files\`);
`,
          },
          tests: [
            { label: "The clean codebase passes", check: `await run("node scripts/check-boundaries.js"); const count = Object.keys(files()).filter((p) => p.startsWith("src/") && p.endsWith(".js")).length; eq(stdout().trim(), "No boundary violations in " + count + " files", "output"); eq(exitCode(), 0, "exit code");` },
            { label: "It finds the three violations, sorted", check: `await run("node scripts/check-boundaries.js fixtures/violating"); eq(stdout().trim().split("\\n"), ${JSON.stringify([...BOUNDARY_VIOLATIONS, "3 boundary violation(s)"])}, "output: an import from outside a module, a multi-line import, and an export … from"); eq(exitCode(), 1, "exit code 1, so CI fails");` },
          ],
          hint: "Walk the folders with readdirSync(dir, { withFileTypes: true }), recursing into directories. For each relative import, path.posix.join(path.posix.dirname(file), spec) gives the imported file. A path's module is the folder after src/modules/. Use the IMPORT pattern with [^;\"']*? so multi-line import lists match.",
          successMessage: "The module walls are now a CI check: the day someone reaches into another module's repository, the build tells them, with the exact import.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 124 · 17.9 – 17.10 · PATTERNS AND REFACTORING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l124-patterns-refactoring",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["17.9", "17.10"],
    title: "Design Patterns, Refactoring and Technical Debt",
    subtitle: "Changing the shape of code without changing what it does",
    estimatedMinutes: 85,
    intro: "Patterns are named solutions to problems that keep coming back; refactoring is how code gets to them safely. Both are worth it only when they make the next change cheaper.",
    atoms: [
      {
        id: "a-be-strategy",
        title: "Design patterns where they solve real problems",
        explain:
          "A pattern earns its place when it removes a real pain. STRATEGY: a family of interchangeable rules behind one interface (discount rules, each { name, percent(ctx) }), so adding a rule means adding an object, not editing a growing if/else. ADAPTER: wraps a third-party API in the interface your code expects (Exercise 17.13). REPOSITORY and FACTORY you have already used. The warning sign is the opposite case: an interface with one implementation and no second one coming, or a factory that builds one thing. Prefer plain functions until the problem appears.",
        nodeLab: {
          task:
            "pricing.js's quote(ctx) is a tangle of ifs, and marketing wants a fifth discount. Refactor it into strategies: export RULES, an array of { name, percent(ctx) } in this order: earlyBird (10% when daysBeforeStart ≥ 30), group (15% for 5+ seats), scholarship (50% for scholarship students), returning (5% when the student completed 1+ courses), and the new referral (12% when referralCode matches REF- and 6 capital letters or digits). quote(ctx, rules = RULES) applies the single best discount (the first rule wins a tie) and returns { unit, total, discount: { name, percent } or null }.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "pricing.js": `/** The price for ctx: { price, seats, daysBeforeStart, student: { scholarship, completedCourses }, referralCode }. */
export function quote(ctx) {
  let percent = 0;
  let name = null;
  if (ctx.student && ctx.student.scholarship) {
    percent = 50;
    name = "scholarship";
  } else {
    if (ctx.seats >= 5) {
      percent = 15;
      name = "group";
    }
    if (ctx.daysBeforeStart >= 30) {
      if (10 > percent) {
        percent = 10;
        name = "earlyBird";
      }
    }
    if (ctx.student && ctx.student.completedCourses >= 1) {
      if (5 > percent) {
        percent = 5;
        name = "returning";
      }
    }
  }
  const unit = Math.round(ctx.price * (1 - percent / 100));
  return { unit, total: unit * ctx.seats, discount: name ? { name, percent } : null };
}
`,
          },
          readOnly: ["package.json"],
          open: "pricing.js",
          solution: {
            "pricing.js": `/**
 * Discount strategies: each rule says how much it gives for a context
 * (0 when it does not apply). ctx: { price, seats, daysBeforeStart,
 * student: { scholarship, completedCourses }, referralCode }.
 */
export const RULES = [
  { name: "earlyBird", percent: (ctx) => (ctx.daysBeforeStart >= 30 ? 10 : 0) },
  { name: "group", percent: (ctx) => (ctx.seats >= 5 ? 15 : 0) },
  { name: "scholarship", percent: (ctx) => (ctx.student?.scholarship ? 50 : 0) },
  { name: "returning", percent: (ctx) => ((ctx.student?.completedCourses ?? 0) >= 1 ? 5 : 0) },
  { name: "referral", percent: (ctx) => (/^REF-[A-Z0-9]{6}$/.test(ctx.referralCode ?? "") ? 12 : 0) },
];

/** The single best discount wins (the first rule wins a tie). */
export function quote(ctx, rules = RULES) {
  let best = null;
  for (const rule of rules) {
    const percent = rule.percent(ctx);
    if (percent > 0 && (!best || percent > best.percent)) best = { name: rule.name, percent };
  }
  const unit = Math.round(ctx.price * (1 - (best?.percent ?? 0) / 100));
  return { unit, total: unit * ctx.seats, discount: best };
}
`,
          },
          tests: [
            { label: "RULES: five strategies, in order", check: `const { RULES } = await load("pricing.js"); assert(Array.isArray(RULES), "export RULES (an array)"); eq(RULES.map((r) => r.name), ["earlyBird", "group", "scholarship", "returning", "referral"], "rule names, in order"); assert(RULES.every((r) => typeof r.percent === "function"), "each rule has percent(ctx)"); eq(RULES.map((r) => r.percent({ price: 1000, seats: 1, daysBeforeStart: 0, student: {} })), [0, 0, 0, 0, 0], "no rule applies to a plain order");` },
            { label: "The same prices as before", check: `const { quote } = await load("pricing.js"); const ctx = (x) => ({ price: 100000, seats: 1, daysBeforeStart: 0, student: { scholarship: false, completedCourses: 0 }, ...x }); eq(quote(ctx({})), { unit: 100000, total: 100000, discount: null }, "no discount"); eq(quote(ctx({ daysBeforeStart: 30 })).discount, { name: "earlyBird", percent: 10 }, "30 days early"); eq(quote(ctx({ seats: 5, daysBeforeStart: 45 })), { unit: 85000, total: 425000, discount: { name: "group", percent: 15 } }, "group beats early bird"); eq(quote(ctx({ seats: 6, student: { scholarship: true, completedCourses: 3 } })).discount, { name: "scholarship", percent: 50 }, "scholarship"); eq(quote(ctx({ student: { completedCourses: 1 } })).discount, { name: "returning", percent: 5 }, "returning"); eq(quote(ctx({ student: undefined })).discount, null, "no student object");` },
            { label: "The new referral rule", check: `const { quote } = await load("pricing.js"); const ctx = (x) => ({ price: 100000, seats: 1, daysBeforeStart: 0, student: { completedCourses: 0 }, ...x }); eq(quote(ctx({ referralCode: "REF-AB12CD" })), { unit: 88000, total: 88000, discount: { name: "referral", percent: 12 } }, "a valid code"); eq(quote(ctx({ referralCode: "REF-ab12cd" })).discount, null, "lower case is not valid"); eq(quote(ctx({ referralCode: "REF-AB12CD", seats: 5 })).discount.name, "group", "15% beats 12%"); eq(quote(ctx({ referralCode: "REF-AB12CD", daysBeforeStart: 40 })).discount.name, "referral", "12% beats 10%");` },
            { label: "New rules plug in without editing quote()", check: `const { quote, RULES } = await load("pricing.js"); const staff = { name: "staff", percent: (c) => (c.staff ? 100 : 0) }; eq(quote({ price: 50000, seats: 2, daysBeforeStart: 0, staff: true }, [...RULES, staff]), { unit: 0, total: 0, discount: { name: "staff", percent: 100 } }, "a rule passed in"); const tieA = { name: "a", percent: () => 10 }, tieB = { name: "b", percent: () => 10 }; eq(quote({ price: 1000, seats: 1 }, [tieA, tieB]).discount.name, "a", "a tie goes to the first rule"); eq(quote({ price: 1000, seats: 1 }, []).discount, null, "no rules, no discount");` },
          ],
          hint: "Each old if becomes one rule object whose percent(ctx) returns the discount or 0. quote loops over the rules, keeps the largest percent (strictly larger, so the first wins a tie), and computes unit and total as before.",
          successMessage: "Discounts are now data: marketing's next rule is one object in RULES, and quote() never changes.",
        },
      },
      {
        id: "a-be-refactoring",
        title: "Refactoring and technical debt",
        explain:
          "REFACTORING changes the structure of code without changing its behaviour, in small steps, with tests run after each one: extract a function, rename, replace nested loops with grouping, remove duplication. TECHNICAL DEBT is the extra cost every change pays because of past shortcuts; like money debt it can be a good deal (ship now, clean up next sprint) but its interest compounds. Pay it down where you are already working (the 'boy scout rule'), make large clean-ups visible as planned work, and never mix a refactor with a behaviour change in the same commit.",
        nodeLab: {
          task:
            "report.js's buildReport is twelve spaces deep. Refactor it without changing its output: extract at least two named helper functions, group enrollments by course instead of searching the result array, and keep every line indented at most 6 spaces. test/report.test.js (read-only) must stay green, and the checks compare your output with the original (reference/report.original.js) on 300 random datasets.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", scripts: { test: "vitest run" }, deps: [], dev: ["vitest"] }),
            "report.js": REPORT_ORIGINAL,
            "reference/report.original.js": REPORT_ORIGINAL,
            "test/report.test.js": `import { describe, expect, it } from "vitest";
import { buildReport } from "../report.js";

const rows = [
  { student: "Ada", course: "DB-101", progress: 100, paid: 80000, refunded: false },
  { student: "Bayo", course: "BE-101", progress: 20, paid: 120000, refunded: false },
  { student: "Chi", course: "BE-101", progress: 100, paid: 120000, refunded: false },
  { student: "Dayo", course: "BE-101", progress: 10, paid: 120000, refunded: true },
  { student: "Ebi", course: "BE-101", progress: 0, paid: 0, refunded: false },
];

describe("buildReport", () => {
  it("summarises each course, sorted by code", () => {
    expect(buildReport(rows).map((r) => r.course)).toEqual(["BE-101", "DB-101"]);
  });

  it("counts students and completions", () => {
    const be = buildReport(rows)[0];
    expect([be.students, be.completed, be.completionRate]).toEqual([4, 1, 25]);
  });

  it("counts revenue from payments that were not refunded", () => {
    expect(buildReport(rows).map((r) => r.revenue)).toEqual([240000, 80000]);
  });

  it("lists paying students under 30% progress as at risk", () => {
    expect(buildReport(rows)[0].atRisk).toEqual(["Bayo"]);
  });

  it("returns nothing for no enrollments", () => {
    expect(buildReport([])).toEqual([]);
  });
});
`,
          },
          readOnly: ["package.json", "reference/report.original.js", "test/report.test.js"],
          open: "report.js",
          solution: {
            "report.js": `const AT_RISK_BELOW = 30;

const counts = (e) => e.paid > 0 && !e.refunded;
const atRisk = (e) => counts(e) && e.progress < AT_RISK_BELOW;
const percent = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);
const byCode = (a, b) => (a.course < b.course ? -1 : a.course > b.course ? 1 : 0);

/** One course's summary from its enrollments. */
function summarise(course, rows) {
  const completed = rows.filter((e) => e.progress === 100).length;
  return {
    course,
    students: rows.length,
    completed,
    completionRate: percent(completed, rows.length),
    revenue: rows.filter(counts).reduce((sum, e) => sum + e.paid, 0),
    atRisk: [...new Set(rows.filter(atRisk).map((e) => e.student))].sort(),
  };
}

/** One summary per course, sorted by course code. */
export function buildReport(enrollments) {
  const byCourse = Map.groupBy(enrollments, (e) => e.course);
  return [...byCourse].map(([course, rows]) => summarise(course, rows)).sort(byCode);
}
`,
          },
          tests: [
            { label: "The tests stay green", check: `const r = await runTests("npm test"); eq(r.length, 5, "the five tests ran"); eq(r.filter((t) => t.state !== "pass").map((t) => t.name), [], "every test passes");` },
            { label: "Exactly the original's output on 300 random datasets", check: `const mine = (await load("report.js")).buildReport; const original = (await load("reference/report.original.js")).buildReport; let seed = 17; const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; }; const pick = (a) => a[rnd(a.length)]; for (let i = 0; i < 300; i++) { const data = Array.from({ length: rnd(14) }, () => ({ student: pick(["Ada", "Bayo", "Chi", "Dayo", "Ebi"]), course: pick(["WD-201", "BE-101", "DB-101", "AI-101"]), progress: pick([0, 10, 29, 30, 50, 99, 100]), paid: pick([0, 0, 80000, 120000]), refunded: rnd(4) === 0 })); const want = JSON.stringify(original(structuredClone(data))); const got = JSON.stringify(mine(structuredClone(data))); if (got !== want) { eq(JSON.parse(got), JSON.parse(want), "dataset " + JSON.stringify(data)); } }` },
            { label: "Flatter, with named helpers", check: `const src = file("report.js") || ""; const deepest = Math.max(...src.split("\\n").filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length)); assert(deepest <= 6, "the deepest line is indented " + deepest + " spaces (at most 6)"); const named = (src.match(/\\bfunction\\s+\\w+|\\bconst\\s+\\w+\\s*=\\s*(?:\\([^)]*\\)|\\w+)\\s*=>/g) || []).length; assert(named >= 3, "extract at least two named helpers besides buildReport (found " + Math.max(0, named - 1) + ")"); lacks(src, "for (let j", "no more searching the result array for each row");` },
          ],
          hint: "Group first: Map.groupBy(enrollments, (e) => e.course) gives each course's rows. Then one summarise(course, rows) builds a summary with filter/reduce, and small predicates (paid and not refunded; at risk) remove the nested ifs. Run the tests after every step.",
          successMessage: "Same output on 300 datasets, half the nesting, and each rule (what counts as revenue, who is at risk) now has a name.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 125 · 17.11 – 17.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l125-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["17.11", "17.12", "17.13", "17.14"],
    title: "Exercises: Restructuring the Academy API",
    subtitle: "Modules, rules, replaceable services, and recorded decisions",
    estimatedMinutes: 220,
    intro: "Four exercises that turn the academy API into a codebase a team can grow: modules with walls, business rules in one place, payment providers behind an interface, and decisions written down.",
    atoms: [
      {
        id: "a-be-ex-modules",
        title: "Exercise: refactor the academy API into clearly separated modules",
        explain:
          "The refactor follows the business: courses, enrollments and billing each become a module under src/modules with routes.js, service.js, repository.js and a public index.js. Enrollments may use courses and billing only through their index.js. Each module owns its tables; billing keeps its own description of what was sold rather than joining enrollments. src/app.js assembles the routers; server.js just listens.",
        nodeLab: {
          task:
            "Restructure server.js into src/modules/courses, src/modules/enrollments and src/modules/billing (routes.js, service.js, repository.js, index.js each), with src/shared/db.js and src/shared/errors.js, src/app.js exporting the assembled app, and a server.js that only listens. Enrolling uses getCourse from courses and createInvoice from billing, through their index.js. Keep every endpoint's behaviour.",
          db: ARCH_SQL,
          files: { "package.json": PKG(), ".env": `DATABASE_URL=${DB_URL}\n`, "server.js": MONOLITH },
          readOnly: ["package.json", ".env"],
          open: "server.js",
          solution: MODULAR(false),
          tests: [...API_BEHAVIOUR, ...MODULE_RULES(["courses", "enrollments", "billing"])],
          hint: "Move one module at a time and run the checks after each: courses first (nothing depends on it), then billing, then enrollments, whose service imports { getCourse } from \"../courses/index.js\" and { createInvoice } from \"../billing/index.js\". Each index.js exports the router and the functions other modules need.",
          successMessage: "The academy API is now three modules with explicit public APIs; each can be understood, tested and changed on its own.",
        },
      },
      {
        id: "a-be-ex-rules-out",
        title: "Exercise: move business rules out of route handlers",
        explain:
          "The refund policy (14 days, 30% progress, full refund within 7 days, half after) is business knowledge, but it lives inside an HTTP handler mixed with SQL and status codes, and nobody can test it without a database and a clock. Moved into a pure function with the policy's numbers named in one constant, it can be tested with plain dates, shown to the finance team, and changed in one place.",
        nodeLab: {
          task:
            "Move the refund rules into src/domain/refunds.js: export REFUND_POLICY = { fullRefundDays: 7, refundDays: 14, maxProgress: 30 } and refundDecision({ price, enrolledAt, progress, refundedAt }, now) → { ok: true, amount } or { ok: false, reason } with reasons ALREADY_REFUNDED, TOO_LATE, TOO_MUCH_PROGRESS (checked in that order). It imports nothing and takes now as a parameter. The route keeps the SQL and maps reasons to 409s; none of the policy's numbers stay in server.js.",
          db: REFUND_SQL,
          files: { "package.json": PKG(), ".env": `DATABASE_URL=${DB_URL}\n`, "db.js": DB_JS, "server.js": REFUND_SERVER },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "src/domain/refunds.js": `export const REFUND_POLICY = { fullRefundDays: 7, refundDays: 14, maxProgress: 30 };

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whether an enrollment can be refunded at now, and how much. */
export function refundDecision({ price, enrolledAt, progress, refundedAt }, now, policy = REFUND_POLICY) {
  if (refundedAt) return { ok: false, reason: "ALREADY_REFUNDED" };
  const days = (now - new Date(enrolledAt)) / DAY_MS;
  if (days > policy.refundDays) return { ok: false, reason: "TOO_LATE" };
  if (progress >= policy.maxProgress) return { ok: false, reason: "TOO_MUCH_PROGRESS" };
  return { ok: true, amount: days <= policy.fullRefundDays ? price : Math.round(price / 2) };
}
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { refundDecision } from "./src/domain/refunds.js";

const app = express();
app.use(express.json());

const REASONS = {
  ALREADY_REFUNDED: "Already refunded",
  TOO_LATE: "The refund period has ended",
  TOO_MUCH_PROGRESS: "Too much of the course has been completed for a refund",
};

app.post("/enrollments/:id/refund", async (req, res) => {
  const { rows } = await pool.query('SELECT id, price, enrolled_at AS "enrolledAt", progress, refunded_at AS "refundedAt" FROM enrollments WHERE id = $1', [req.params.id]);
  const enrollment = rows[0];
  if (!enrollment) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  const decision = refundDecision(enrollment, new Date());
  if (!decision.ok) return res.status(409).json({ error: { code: decision.reason, message: REASONS[decision.reason] } });
  await pool.query("UPDATE enrollments SET refunded_at = now() WHERE id = $1", [enrollment.id]);
  res.json({ data: { id: enrollment.id, amount: decision.amount } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "refundDecision follows the policy", check: `const { refundDecision, REFUND_POLICY } = await load("src/domain/refunds.js"); eq(REFUND_POLICY, { fullRefundDays: 7, refundDays: 14, maxProgress: 30 }, "REFUND_POLICY"); const now = new Date("2026-11-20T12:00:00Z"); const ago = (days) => new Date(now.getTime() - days * 86400000); const e = (x) => ({ price: 120000, enrolledAt: ago(3), progress: 10, refundedAt: null, ...x }); eq(refundDecision(e({}), now), { ok: true, amount: 120000 }, "3 days: full refund"); eq(refundDecision(e({ enrolledAt: ago(7) }), now), { ok: true, amount: 120000 }, "exactly 7 days: still full"); eq(refundDecision(e({ enrolledAt: ago(10), price: 80001 }), now), { ok: true, amount: 40001 }, "10 days: half, rounded"); eq(refundDecision(e({ enrolledAt: ago(14) }), now).ok, true, "exactly 14 days: still allowed"); eq(refundDecision(e({ enrolledAt: ago(15) }), now), { ok: false, reason: "TOO_LATE" }, "15 days"); eq(refundDecision(e({ progress: 30 }), now), { ok: false, reason: "TOO_MUCH_PROGRESS" }, "30% progress"); eq(refundDecision(e({ progress: 29 }), now).ok, true, "29%"); eq(refundDecision(e({ refundedAt: ago(1), enrolledAt: ago(20), progress: 90 }), now), { ok: false, reason: "ALREADY_REFUNDED" }, "already refunded comes first"); eq(refundDecision(e({ enrolledAt: ago(20), progress: 90 }), now).reason, "TOO_LATE", "TOO_LATE before TOO_MUCH_PROGRESS");` },
            { label: "The rules are pure and in one place", check: `const src = file("src/domain/refunds.js") || ""; assert(!/^\\s*import\\b/m.test(src), "refunds.js imports nothing"); assert(!/Date\\.now\\(|new Date\\(\\s*\\)/.test(src), "take now as a parameter"); const server = (file("server.js") || "").replace(/\\$\\d/g, ""); for (const n of ["14", "30", "86400000", "86_400_000"]) assert(!new RegExp("\\\\b" + n + "\\\\b").test(server), "server.js still contains the policy number " + n + ": it belongs in REFUND_POLICY"); has(server, "refundDecision(", "the route asks refundDecision");` },
            { label: "The endpoint behaves as before", check: `const full = await post("/enrollments/1/refund"); eq([full.status, full.json?.data], [200, { id: 1, amount: 120000 }], "3 days in: full refund"); eq((await post("/enrollments/2/refund")).json?.data, { id: 2, amount: 40000 }, "10 days in: half"); const cases = [[3, "TOO_LATE"], [4, "TOO_MUCH_PROGRESS"], [5, "ALREADY_REFUNDED"], [1, "ALREADY_REFUNDED"]]; for (const [id, code] of cases) { const r = await post("/enrollments/" + id + "/refund"); eq([r.status, r.json?.error?.code], [409, code], "enrollment " + id); } eq((await post("/enrollments/6/refund")).json?.data?.amount, 40000, "29% progress, 9 days: half"); eq((await post("/enrollments/99/refund")).status, 404, "a missing enrollment"); eq((await sql("SELECT count(*)::int AS n FROM enrollments WHERE refunded_at IS NOT NULL"))[0].n, 4, "refunded rows");` },
          ],
          hint: "Copy the ifs into refundDecision, replacing each response with a return of { ok: false, reason } and the numbers with policy.refundDays and friends. The route then becomes: load the row, call refundDecision(row, new Date()), answer 409 with decision.reason or update and answer the amount.",
          successMessage: "The refund policy is now a ten-line pure function with a named policy, tested to the day, and the handler only speaks HTTP and SQL.",
        },
      },
      {
        id: "a-be-ex-interfaces",
        title: "Exercise: make external services replaceable through interfaces",
        explain:
          "The orders service depends on an INTERFACE it defines itself (a PORT): charge({ reference, amountKobo, card }) → { ok, chargeId } or { ok: false, reason }. Each provider gets an ADAPTER that translates between that interface and the provider's API (kobo or naira, Bearer or X-Api-Key, 402 or a DECLINED state). Swapping providers is then one configuration value, a test uses a fake gateway, and no provider detail leaks into business code.",
        nodeLab: {
          task:
            "src/orders.js (read-only) needs a gateway with charge({ reference, amountKobo, card }). Write two adapters: src/payments/payments-example.js createPaymentsExampleGateway({ url, secretKey }) (POST /v1/charges, Bearer key, amount in kobo, 201 or 402) and src/payments/paygate.js createPaygateGateway({ url, apiKey }) (POST /transactions, X-Api-Key, amountNaira, ref, cardNumber; APPROVED or DECLINED). Add src/payments/fake.js createFakeGateway() (records .charges; card 4000000000000002 is declined) and src/payments/index.js createGateway(env), choosing by env.PAYMENTS_PROVIDER (payments-example, paygate, fake; anything else throws).",
          db: ORDERS_SQL,
          services: { [EXAMPLE_API]: EXAMPLE_SERVICE, [PAYGATE_API]: PAYGATE_SERVICE },
          files: {
            "package.json": PKG(),
            ".env": `DATABASE_URL=${DB_URL}\nPAYMENTS_PROVIDER=payments-example\nPAYMENTS_EXAMPLE_URL=${EXAMPLE_API}\nPAYMENTS_EXAMPLE_SECRET_KEY=sk_test_academy\nPAYGATE_URL=${PAYGATE_API}\nPAYGATE_API_KEY=pg_test_key\n`,
            "db.js": DB_JS,
            "errors.js": ERRORS_JS,
            "orders.js": ORDERS_JS,
            "server.js": `import express from "express";
import { errorHandler, notFound } from "./errors.js";
import { createOrderService } from "./orders.js";
import { createGateway } from "./src/payments/index.js";

const orders = createOrderService({ gateway: createGateway(process.env) });

const app = express();
app.use(express.json());
app.post("/orders/:id/pay", async (req, res) => res.json({ data: await orders.pay(Number(req.params.id), req.body?.card) }));
app.use(notFound);
app.use(errorHandler);

app.listen(3000, () => console.log(\`Course API on http://localhost:3000 (payments: \${process.env.PAYMENTS_PROVIDER})\`));
`,
            "src/payments/index.js": `/** The gateway for this environment. */
export function createGateway(env) {
  throw new Error(\`Unknown PAYMENTS_PROVIDER: \${env.PAYMENTS_PROVIDER}\`);
}
`,
          },
          readOnly: ["package.json", ".env", "db.js", "errors.js", "orders.js", "server.js"],
          open: "src/payments/index.js",
          solution: {
            "src/payments/payments-example.js": `/** Adapter: Payments Example's API → the gateway interface. */
export function createPaymentsExampleGateway({ url, secretKey }) {
  return {
    async charge({ reference, amountKobo, card }) {
      const res = await fetch(\`\${url}/v1/charges\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: \`Bearer \${secretKey}\` },
        body: JSON.stringify({ amount: amountKobo, currency: "NGN", reference, card }),
      });
      if (res.status === 402) return { ok: false, reason: "declined" };
      if (res.status !== 201) throw new Error(\`Payments Example answered \${res.status}\`);
      return { ok: true, chargeId: (await res.json()).id };
    },
  };
}
`,
            "src/payments/paygate.js": `/** Adapter: PayGate's API (naira, X-Api-Key, approval states) → the gateway interface. */
export function createPaygateGateway({ url, apiKey }) {
  return {
    async charge({ reference, amountKobo, card }) {
      const res = await fetch(\`\${url}/transactions\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
        body: JSON.stringify({ amountNaira: amountKobo / 100, ref: reference, cardNumber: card }),
      });
      if (!res.ok) throw new Error(\`PayGate answered \${res.status}\`);
      const { transaction } = await res.json();
      return transaction.state === "APPROVED" ? { ok: true, chargeId: transaction.id } : { ok: false, reason: "declined" };
    },
  };
}
`,
            "src/payments/fake.js": `/** A gateway for tests and local development: no network, every charge recorded. */
export function createFakeGateway() {
  const charges = [];
  return {
    charges,
    async charge({ reference, amountKobo, card }) {
      if (card === "4000000000000002") return { ok: false, reason: "declined" };
      charges.push({ reference, amountKobo });
      return { ok: true, chargeId: \`fake_\${charges.length}\` };
    },
  };
}
`,
            "src/payments/index.js": `import { createFakeGateway } from "./fake.js";
import { createPaygateGateway } from "./paygate.js";
import { createPaymentsExampleGateway } from "./payments-example.js";

/** The gateway for this environment: the one place that names the providers. */
export function createGateway(env) {
  switch (env.PAYMENTS_PROVIDER) {
    case "payments-example":
      return createPaymentsExampleGateway({ url: env.PAYMENTS_EXAMPLE_URL, secretKey: env.PAYMENTS_EXAMPLE_SECRET_KEY });
    case "paygate":
      return createPaygateGateway({ url: env.PAYGATE_URL, apiKey: env.PAYGATE_API_KEY });
    case "fake":
      return createFakeGateway();
    default:
      throw new Error(\`Unknown PAYMENTS_PROVIDER: \${env.PAYMENTS_PROVIDER}\`);
  }
}
`,
          },
          tests: [
            { label: "Payments Example: paid, in kobo", check: `const r = await post("/orders/1/pay", { card: "4242424242424242" }); eq([r.status, r.json?.data?.status, r.json?.data?.chargeId], [200, "paid", "ch_1"], "order 1"); const call = outgoing().find((o) => o.url === "${EXAMPLE_API}/v1/charges"); eq(JSON.parse(call?.body || "{}").amount, 12000000, "the amount in kobo"); eq((await post("/orders/2/pay", { card: "4000000000000002" })).json?.error?.code, "PAYMENT_DECLINED", "a declined card");` },
            { label: "PayGate: one setting, same behaviour", check: `await run("PAYMENTS_PROVIDER=paygate npm start"); const r = await post("/orders/3/pay", { card: "4242424242424242" }); eq([r.status, r.json?.data?.status, r.json?.data?.chargeId], [200, "paid", "tx_1"], "order 3 through PayGate"); const call = outgoing().find((o) => o.url === "${PAYGATE_API}/transactions"); eq(JSON.parse(call?.body || "{}"), { amountNaira: 90000, ref: "order-3", cardNumber: "4242424242424242" }, "PayGate's request body"); eq(call?.headers["x-api-key"], "pg_test_key", "X-Api-Key"); eq((await post("/orders/4/pay", { card: "4000000000000002" })).json?.error?.code, "PAYMENT_DECLINED", "a PayGate decline maps to the same error");` },
            { label: "A fake gateway for tests; unknown providers refused", check: `const { createGateway } = await load("src/payments/index.js"); const fake = createGateway({ PAYMENTS_PROVIDER: "fake" }); const before = outgoing().length; eq(await fake.charge({ reference: "t-1", amountKobo: 500, card: "4242424242424242" }), { ok: true, chargeId: "fake_1" }, "a fake charge"); eq(await fake.charge({ reference: "t-2", amountKobo: 500, card: "4000000000000002" }), { ok: false, reason: "declined" }, "a fake decline"); eq(fake.charges, [{ reference: "t-1", amountKobo: 500 }], "recorded charges"); eq(outgoing().length, before, "no network"); let err = null; try { createGateway({ PAYMENTS_PROVIDER: "stripe-ish" }); } catch (e) { err = e; } assert(err, "an unknown provider throws at start-up instead of failing on the first payment");` },
            { label: "Provider details stay in their adapters", check: `const all = files(); for (const [p, src] of Object.entries(all)) { if (!/\\.js$/.test(p) || p.startsWith("node_modules/")) continue; if (p !== "src/payments/paygate.js" && /amountNaira|cardNumber|X-Api-Key|\\/transactions/.test(src)) assert(false, p + " knows PayGate's API: keep it in src/payments/paygate.js"); if (p !== "src/payments/payments-example.js" && /\\/v1\\/charges/.test(src)) assert(false, p + " knows Payments Example's API: keep it in its adapter"); }` },
          ],
          hint: "Each adapter is a factory returning { async charge({ reference, amountKobo, card }) { … } } that calls its provider and translates the answer to { ok: true, chargeId } or { ok: false, reason: \"declined\" }. PayGate wants amountKobo / 100. index.js is a switch on env.PAYMENTS_PROVIDER.",
          successMessage: "Changing payment provider is now one line in .env, tests can run on the fake, and the orders service never learned the difference.",
        },
      },
      {
        id: "a-be-ex-adr",
        title: "Exercise: document major architectural decisions",
        explain:
          "An ARCHITECTURE DECISION RECORD (ADR) is a short file per significant decision: its title and number, a STATUS (Proposed, Accepted, or Superseded by ADR-n), the CONTEXT (the forces and constraints at the time), the DECISION, and its CONSEQUENCES (good and bad). ADRs live in the repository (docs/adr/0001-….md), are written when the decision is made, and are never rewritten: a changed decision gets a new ADR that supersedes the old one. A year later, they answer 'why is it like this?' without archaeology.",
        nodeLab: {
          task:
            "Write at least three ADRs in docs/adr/ for this week's decisions, named NNNN-short-title.md (0001-…): one on structuring the API as a modular monolith, one on putting payment providers behind a gateway interface, and one of your choice (for example dependency injection or where business rules live). Each starts with \"# <n>. <Title>\" and has ## Status, ## Context, ## Decision and ## Consequences sections, the consequences naming at least one cost. List every ADR in docs/adr/README.md.",
          command: false,
          files: {
            "docs/adr/README.md": "# Architecture decision records\n\n| ADR | Title | Status |\n| --- | --- | --- |\n",
            "docs/adr/template.md": "# N. Title\n\n## Status\n\nProposed | Accepted | Superseded by ADR-N\n\n## Context\n\nWhat forces are at play? What constraints, what problem?\n\n## Decision\n\nWhat we decided, in full sentences.\n\n## Consequences\n\nWhat becomes easier, what becomes harder, what it costs.\n",
          },
          readOnly: ["docs/adr/template.md"],
          open: "docs/adr/README.md",
          solution: {
            "docs/adr/README.md": "# Architecture decision records\n\n| ADR | Title | Status |\n| --- | --- | --- |\n| [0001](0001-modular-monolith.md) | Structure the API as a modular monolith | Accepted |\n| [0002](0002-payment-gateway-interface.md) | Payment providers behind a gateway interface | Accepted |\n| [0003](0003-dependency-injection.md) | Inject dependencies through factory functions | Accepted |\n",
            "docs/adr/0001-modular-monolith.md": "# 1. Structure the API as a modular monolith\n\n## Status\n\nAccepted\n\n## Context\n\nThe academy API grew as one 600-line server.js. Courses, enrollments and billing changed for different reasons and by different people, and every change risked the others. We are three developers with one database and one deployment pipeline; separate services would multiply our operational work.\n\n## Decision\n\nWe split the code into modules by business area under src/modules (courses, enrollments, billing). Each module owns its tables and exposes a public API in its index.js; other modules import only that file. A CI script (npm run lint:boundaries) fails the build on any other cross-module import. The application stays one deployable process.\n\n## Consequences\n\nModules can be understood and changed on their own, and a module could later become a service along an existing seam. The cost: some data is duplicated (invoices keep their own description), cross-module queries become function calls instead of joins, and the boundary rule must be maintained in CI.\n",
            "docs/adr/0002-payment-gateway-interface.md": "# 2. Payment providers behind a gateway interface\n\n## Status\n\nAccepted\n\n## Context\n\nWe use Payments Example today, but its fees are rising and PayGate is cheaper for Nigerian cards. Provider-specific code (amount units, headers, decline formats) was spread through the orders code, so switching would mean editing business logic.\n\n## Decision\n\nThe orders service depends on a gateway interface it defines: charge({ reference, amountKobo, card }) returning { ok, chargeId } or { ok: false, reason }. Each provider gets an adapter in src/payments, a fake gateway serves tests, and PAYMENTS_PROVIDER selects one at start-up.\n\n## Consequences\n\nSwitching providers is a configuration change, and tests run without the network. The cost: the interface only exposes what all providers share, so provider-specific features (saved cards, instalments) need the interface extended deliberately, and each adapter needs its own integration tests against the provider's sandbox.\n",
            "docs/adr/0003-dependency-injection.md": "# 3. Inject dependencies through factory functions\n\n## Status\n\nAccepted\n\n## Context\n\nServices imported the database pool, the mailer and the system clock directly, so they could only be tested against a real database and real email, and time-dependent rules could not be tested at all.\n\n## Decision\n\nServices are created by factory functions that receive their dependencies (createEnrollmentService({ repo, mailer, clock })). server.js is the only composition root. We do not use a DI framework.\n\n## Consequences\n\nServices are tested with in-memory fakes and a fixed clock in milliseconds. The cost: wiring in server.js grows with the number of services, and a missing dependency is only discovered when the service is created, so the composition root needs a start-up test.\n",
          },
          tests: [
            { label: "At least three ADRs, numbered and named", check: `const adrs = Object.keys(files()).filter((p) => /^docs\\/adr\\/\\d{4}-[a-z0-9-]+\\.md$/.test(p)).sort(); assert(adrs.length >= 3, "write at least three ADRs as docs/adr/NNNN-short-title.md (found " + adrs.length + ")"); adrs.forEach((p, i) => { const n = Number(p.slice(9, 13)); eq(n, i + 1, p + " should be number " + (i + 1)); const title = (file(p).match(/^# (\\d+)\\. (.+)$/m) || []); eq(Number(title[1]), n, p + " starts with \\"# " + n + ". <Title>\\""); });` },
            { label: "Each has Status, Context, Decision and Consequences", check: `const adrs = Object.keys(files()).filter((p) => /^docs\\/adr\\/\\d{4}-[a-z0-9-]+\\.md$/.test(p)); for (const p of adrs) { const md = file(p); assert(/^(Proposed|Accepted|Deprecated|Superseded by ADR-\\d+)\\b/m.test(section(md, "Status").trim()), p + ": ## Status is Proposed, Accepted, Deprecated or Superseded by ADR-N"); for (const s of ["Context", "Decision", "Consequences"]) assert(section(md, s).trim().split(/\\s+/).length >= 25, p + ": ## " + s + " needs real content (25+ words)"); assert(/\\b(cost|costs|harder|downside|trade-?off|but|however|drawback)\\b/i.test(section(md, "Consequences")), p + ": ## Consequences should name at least one cost, not only benefits"); }` },
            { label: "The modular monolith and the payment gateway are covered", check: `const adrs = Object.keys(files()).filter((p) => /^docs\\/adr\\/\\d{4}-[a-z0-9-]+\\.md$/.test(p)).map((p) => file(p).toLowerCase()); assert(adrs.some((t) => /modular monolith|modules?\\b.*boundar|boundar.*modules?/.test(t)), "an ADR on the modular monolith (modules and their boundaries)"); assert(adrs.some((t) => /payment/.test(t) && /(interface|adapter|gateway)/.test(t)), "an ADR on payment providers behind an interface");` },
            { label: "The README lists every ADR", check: `const readme = file("docs/adr/README.md") || ""; const adrs = Object.keys(files()).filter((p) => /^docs\\/adr\\/\\d{4}-[a-z0-9-]+\\.md$/.test(p)); for (const p of adrs) has(readme, p.slice(9), "docs/adr/README.md links " + p.slice(9));` },
          ],
          hint: "Copy template.md for each ADR. Context is the situation before the decision (with its constraints), Decision is what was chosen in full sentences, Consequences is honest about what it costs. Add a row per ADR to the README table.",
          successMessage: "The next developer can learn why the code is shaped this way in five minutes, from the repository itself.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 126 · 17.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l126-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["17.P"],
    title: "Deliverable: A Maintainable Codebase with Clear Module Boundaries",
    subtitle: "Proving the architecture by adding a feature",
    estimatedMinutes: 130,
    intro: "An architecture is tested by the next feature. The deliverable adds certificates to the modular academy API: a new module that follows the same rules, extends another module's public API properly, and is recorded in the architecture document.",
    atoms: [
      {
        id: "a-be-architecture",
        title: "A codebase with clear architecture and module boundaries",
        explain:
          "A maintainable codebase makes the right change easy: the new feature gets its own module with the familiar files, its rule is a pure function, it uses other modules only through their public APIs (extending one when it needs more, instead of reaching into its repository), and the architecture document is updated in the same change, so the map stays true.",
        nodeLab: {
          task:
            "Add a certificates module (src/modules/certificates: routes.js, service.js, repository.js, domain.js, index.js). POST /certificates { studentId, courseId }: 404 ENROLLMENT_NOT_FOUND, 409 NOT_COMPLETED below 100% progress, 201 with { code, studentId, courseId, issuedAt } where code is <course code>-<student id as 4 digits> (BE-101-0001), and 200 with the same certificate when it already exists. GET /certificates/:code verifies one (404 CERTIFICATE_NOT_FOUND). domain.js exports canIssue(enrollment) → null or \"NOT_COMPLETED\". Get the enrollment through the enrollments module's index.js (add findEnrollment to its public API). Then update ARCHITECTURE.md.",
          db: `${ARCH_SQL}CREATE TABLE certificates (code text PRIMARY KEY, student_id integer NOT NULL, course_id integer NOT NULL, issued_at timestamptz NOT NULL DEFAULT now(), UNIQUE (student_id, course_id));
`,
          files: {
            "package.json": PKG(),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            ...MODULAR(false),
            "ARCHITECTURE.md": `# Architecture

The academy API is a modular monolith: one Express application, one PostgreSQL database, divided into modules by business area.

## Modules

- **courses**: the catalogue (courses table). Public API: coursesRouter, getCourse.
- **enrollments**: who is enrolled in what, and their progress (enrollments table). Public API: enrollmentsRouter.
- **billing**: invoices (invoices table). Public API: billingRouter, createInvoice.

## Dependencies

- enrollments → courses (getCourse)
- enrollments → billing (createInvoice)

## Rules

- Each module lives in src/modules/<name> with routes.js, service.js, repository.js and a public index.js.
- Code outside a module imports only its index.js (checked by npm run lint:boundaries).
- Only repositories contain SQL; services contain the rules and never import express.
- Each module owns its tables; no module queries another module's tables.
`,
          },
          readOnly: ["package.json", ".env", "src/shared/db.js", "src/shared/errors.js"],
          open: "ARCHITECTURE.md",
          solution: {
            ...Object.fromEntries(Object.entries(MODULAR(true)).filter(([p]) => !p.startsWith("src/shared/"))),
            "src/app.js": MODULAR(false)["src/app.js"].replace('import { billingRouter } from "./modules/billing/index.js";\n', 'import { billingRouter } from "./modules/billing/index.js";\nimport { certificatesRouter } from "./modules/certificates/index.js";\n').replace("app.use(billingRouter);\n", "app.use(billingRouter);\napp.use(certificatesRouter);\n"),
            "src/modules/certificates/domain.js": `/** Whether a certificate can be issued for this enrollment: null, or the reason it cannot. */
export const canIssue = (enrollment) => (enrollment.progress === 100 ? null : "NOT_COMPLETED");

/** A certificate's public code: the course code and the student id. */
export const certificateCode = (courseCode, studentId) => \`\${courseCode}-\${String(studentId).padStart(4, "0")}\`;
`,
            "src/modules/certificates/repository.js": `import { pool } from "../../shared/db.js";

const COLUMNS = 'code, student_id AS "studentId", course_id AS "courseId", issued_at AS "issuedAt"';
const one = async (sql, params) => (await pool.query(sql, params)).rows[0] ?? null;

export const findByCode = (code) => one(\`SELECT \${COLUMNS} FROM certificates WHERE code = $1\`, [code]);
export const findFor = (studentId, courseId) => one(\`SELECT \${COLUMNS} FROM certificates WHERE student_id = $1 AND course_id = $2\`, [studentId, courseId]);
export const insert = (code, studentId, courseId) => one(\`INSERT INTO certificates (code, student_id, course_id) VALUES ($1, $2, $3) RETURNING \${COLUMNS}\`, [code, studentId, courseId]);
`,
            "src/modules/certificates/service.js": `import { getCourse } from "../courses/index.js";
import { findEnrollment } from "../enrollments/index.js";
import { AppError } from "../../shared/errors.js";
import { canIssue, certificateCode } from "./domain.js";
import * as repo from "./repository.js";

/** Issues the certificate (or returns the existing one): { certificate, created }. */
export async function issueCertificate(studentId, courseId) {
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) throw new AppError(400, "VALIDATION_FAILED", "studentId and courseId are required");
  const enrollment = await findEnrollment(studentId, courseId);
  if (!enrollment) throw new AppError(404, "ENROLLMENT_NOT_FOUND", "No such enrollment");
  const reason = canIssue(enrollment);
  if (reason) throw new AppError(409, reason, "The course is not completed yet");
  const existing = await repo.findFor(studentId, courseId);
  if (existing) return { certificate: existing, created: false };
  const course = await getCourse(courseId);
  return { certificate: await repo.insert(certificateCode(course.code, studentId), studentId, courseId), created: true };
}

export async function verifyCertificate(code) {
  const certificate = await repo.findByCode(code);
  if (!certificate) throw new AppError(404, "CERTIFICATE_NOT_FOUND", "No such certificate");
  return certificate;
}
`,
            "src/modules/certificates/routes.js": `import { Router } from "express";
import { issueCertificate, verifyCertificate } from "./service.js";

export const certificatesRouter = Router();

certificatesRouter.post("/certificates", async (req, res) => {
  const { certificate, created } = await issueCertificate(Number(req.body?.studentId), Number(req.body?.courseId));
  res.status(created ? 201 : 200).json({ data: certificate });
});

certificatesRouter.get("/certificates/:code", async (req, res) => res.json({ data: await verifyCertificate(req.params.code) }));
`,
            "src/modules/certificates/index.js": '/** The certificates module\'s public API. */\nexport { certificatesRouter } from "./routes.js";\n',
            "ARCHITECTURE.md": `# Architecture

The academy API is a modular monolith: one Express application, one PostgreSQL database, divided into modules by business area.

## Modules

- **courses**: the catalogue (courses table). Public API: coursesRouter, getCourse.
- **enrollments**: who is enrolled in what, and their progress (enrollments table). Public API: enrollmentsRouter, findEnrollment.
- **billing**: invoices (invoices table). Public API: billingRouter, createInvoice.
- **certificates**: certificates for completed courses, and their public verification (certificates table). Public API: certificatesRouter.

## Dependencies

- enrollments → courses (getCourse)
- enrollments → billing (createInvoice)
- certificates → enrollments (findEnrollment)
- certificates → courses (getCourse)

## Rules

- Each module lives in src/modules/<name> with routes.js, service.js, repository.js and a public index.js; rules that need no I/O live in domain.js.
- Code outside a module imports only its index.js (checked by npm run lint:boundaries).
- Only repositories contain SQL; services contain the rules and never import express.
- Each module owns its tables; no module queries another module's tables.
`,
          },
          tests: [
            { label: "Issuing: 201 for a completed course, 200 the second time", check: `const r = await post("/certificates", { studentId: 1, courseId: 1 }); eq(r.status, 201, "status"); eq([r.json?.data?.code, r.json?.data?.studentId, r.json?.data?.courseId], ["BE-101-0001", 1, 1], "body"); assert(!Number.isNaN(Date.parse(r.json?.data?.issuedAt)), "issuedAt"); const again = await post("/certificates", { studentId: 1, courseId: 1 }); eq([again.status, again.json?.data], [200, r.json.data], "asking again returns the same certificate"); eq((await sql("SELECT count(*)::int AS n FROM certificates"))[0].n, 1, "one row");` },
            { label: "Refusals: not completed, not enrolled", check: `const nc = await post("/certificates", { studentId: 2, courseId: 1 }); eq([nc.status, nc.json?.error?.code], [409, "NOT_COMPLETED"], "Bayo is at 40%"); const ne = await post("/certificates", { studentId: 3, courseId: 1 }); eq([ne.status, ne.json?.error?.code], [404, "ENROLLMENT_NOT_FOUND"], "Chi is not enrolled"); await patch("/enrollments/2/progress", { progress: 100 }); eq((await post("/certificates", { studentId: 2, courseId: 1 })).json?.data?.code, "BE-101-0002", "after Bayo completes the course");` },
            { label: "Verification", check: `const ok = await get("/certificates/BE-101-0001"); eq([ok.status, ok.json?.data?.studentId], [200, 1], "a real certificate"); const nf = await get("/certificates/BE-101-9999"); eq([nf.status, nf.json?.error?.code], [404, "CERTIFICATE_NOT_FOUND"], "a forged code");` },
            { label: "The rule is a pure function in domain.js", check: `const { canIssue } = await load("src/modules/certificates/domain.js"); eq([canIssue({ progress: 100 }), canIssue({ progress: 99 }), canIssue({ progress: 0 })], [null, "NOT_COMPLETED", "NOT_COMPLETED"], "canIssue"); assert(!/^\\s*import\\b/m.test(file("src/modules/certificates/domain.js") || ""), "domain.js imports nothing");` },
            ...MODULE_RULES(["courses", "enrollments", "billing", "certificates"]),
            { label: "Certificates read enrollments through its public API", check: `${GRAPH} const svc = deps("src/modules/certificates/service.js"); assert(svc.includes("src/modules/enrollments/index.js"), "certificates/service.js imports from ../enrollments/index.js"); has(SRC()["src/modules/enrollments/index.js"] || "", "findEnrollment", "the enrollments module exports findEnrollment from its index.js"); for (const p of filesIn("src/modules/certificates/")) lacks(SRC()[p], "FROM enrollments", p + " must not query the enrollments table (it belongs to the enrollments module)");` },
            { label: "ARCHITECTURE.md describes the new module", check: `const md = file("ARCHITECTURE.md") || ""; has(section(md, "Modules").toLowerCase(), "certificates", "## Modules lists certificates"); has(section(md, "Modules"), "findEnrollment", "## Modules: the enrollments public API now includes findEnrollment"); const deps = section(md, "Dependencies").split("\\n"); assert(deps.some((l) => /certificates\\s*→\\s*enrollments/.test(l)), "## Dependencies: certificates → enrollments"); assert(deps.some((l) => /certificates\\s*→\\s*courses/.test(l)), "## Dependencies: certificates → courses");` },
          ],
          hint: "Copy the shape of the billing module. In enrollments, add export const findEnrollment = (studentId, courseId) => repo.find(studentId, courseId) to service.js and export it from index.js. The certificates service: findEnrollment, canIssue, the existing certificate if there is one, else getCourse for the code and insert. Mount certificatesRouter in src/app.js.",
          successMessage: "A whole feature added without touching another module's internals, with its rule in a pure function and the map updated: that is what the architecture was for.",
        },
      },
    ],
    task: {
      title: "Week 17 deliverable: a maintainable backend with clear module boundaries",
      intro: "Restructure your own course API.",
      prompts: [
        "Split your API into modules by business area under src/modules, each with routes, service, repository and a public index.js; assemble them in src/app.js and keep server.js to listening.",
        "Move business rules into pure functions or domain models with no I/O, and pass dependencies (repositories, mailers, gateways, the clock) into services from one composition root.",
        "Put each external service behind an interface with an adapter and a fake; add the boundary check to npm scripts and CI.",
        "Write ARCHITECTURE.md (modules, dependencies, rules) and an ADR for each major decision in docs/adr.",
        "Checkpoint: a business rule changes in one place, an external service is swapped by changing one line, and decisions are recorded.",
      ],
      closing: "Next: Week 18, advanced backend capabilities: background jobs, caching, real-time features and files.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
