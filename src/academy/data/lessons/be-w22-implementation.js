/**
 * BACKEND ENGINEERING · WEEK 22 · CORE IMPLEMENTATION
 *
 * Curriculum 22.1 – 22.P: building the Office Hours MVP specified in Week 21.
 * The labs share one codebase (src/db.js, errors.js, auth.js, validation.js,
 * slots.js, bookings.js, me.js, reports.js, app.js); each lab gives every
 * module but the one being built, in its finished form, so the project
 * grows a piece at a time and every check runs real journeys over HTTP
 * against PostgreSQL.
 *
 * Times in the checks are relative to the lab clock (AT below), so the
 * labs never go stale. Seed users all have the password
 * "correct horse battery staple" (a real Argon2id hash).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s22-implementation";
const MODULE = "be-w22-implementation";

export const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
export const PKG = pkg({ name: "office-hours", scripts: { start: "node --env-file=.env server.js", test: "vitest run" }, deps: ["argon2", "cookie-parser", "express", "pg", "zod"], dev: ["supertest", "vitest"] });
export const ENV = `DATABASE_URL=${DB_URL}\n`;
const PASSWORD_HASH = "$argon2id$v=19$m=65536,t=3,p=4$CzBVep/E6Q4zWH2ix+wRNg$k/p+2l+YoJJ3hvilArqsF53o7lkg7NADrKtJY5hI8yM";

/* ── The database ─────────────────────────────────────────────────────── */

export const SCHEMA_SQL = `CREATE TABLE users (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  full_name     text NOT NULL,
  role          text NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  password_hash text NOT NULL
);
CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL);
CREATE TABLE course_members (
  course_id integer NOT NULL REFERENCES courses (id),
  user_id   integer NOT NULL REFERENCES users (id),
  role      text NOT NULL CHECK (role IN ('student', 'instructor')),
  PRIMARY KEY (course_id, user_id)
);
CREATE TABLE slots (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  instructor_id integer NOT NULL REFERENCES users (id),
  course_id     integer NOT NULL REFERENCES courses (id),
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz NOT NULL,
  CHECK (ends_at - starts_at = interval '20 minutes'),
  CONSTRAINT slots_one_per_start UNIQUE (instructor_id, starts_at)
);
CREATE TABLE bookings (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slot_id      integer NOT NULL REFERENCES slots (id),
  student_id   integer NOT NULL REFERENCES users (id),
  status       text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'attended', 'no_show')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz
);
CREATE UNIQUE INDEX bookings_one_active_per_slot ON bookings (slot_id) WHERE status <> 'cancelled';
CREATE INDEX bookings_student_idx ON bookings (student_id, created_at);
CREATE INDEX slots_course_time_idx ON slots (course_id, starts_at);
`;
export const SESSIONS_SQL = `CREATE TABLE sessions (
  token_hash text PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE TABLE attendance_audit (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id  integer NOT NULL REFERENCES bookings (id),
  changed_by  integer NOT NULL REFERENCES users (id),
  old_status  text NOT NULL,
  new_status  text NOT NULL,
  changed_at  timestamptz NOT NULL DEFAULT now()
);
`;
const SEED_USERS = [
  ["ngozi@example.com", "Ngozi Eze", "instructor"],
  ["tunde@example.com", "Tunde Bakare", "instructor"],
  ["ada@example.com", "Ada Obi", "student"],
  ["bayo@example.com", "Bayo Adeyemi", "student"],
  ["chi@example.com", "Chi Okafor", "student"],
  ["kemi@example.com", "Kemi Lawal", "admin"],
];
export const SEED_SQL = `INSERT INTO users (email, full_name, role, password_hash) VALUES
${SEED_USERS.map(([e, n, r]) => `  ('${e}', '${n}', '${r}', '${PASSWORD_HASH}')`).join(",\n")};
INSERT INTO courses (code, title) VALUES ('BE-101', 'Backend Engineering'), ('DB-101', 'Relational Databases');
-- Ngozi (1) teaches BE-101, Tunde (2) DB-101; Ada (3) and Bayo (4) study BE-101; Bayo and Chi (5) study DB-101.
INSERT INTO course_members VALUES (1, 1, 'instructor'), (2, 2, 'instructor'), (1, 3, 'student'), (1, 4, 'student'), (2, 4, 'student'), (2, 5, 'student');
`;
export const OH_SQL = SCHEMA_SQL + SESSIONS_SQL + SEED_SQL;

/* ── The modules ──────────────────────────────────────────────────────── */

export const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", (err) => console.error(\`database pool: \${err.message}\`));
`;
export const ERRORS_JS = (constraints) => `import { ZodError } from "zod";

export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    if (details) this.details = details;
  }
}
${
  constraints
    ? `
/** Database constraints that are business rules, and how the API reports them. */
const CONSTRAINTS = {
  bookings_one_active_per_slot: [409, "SLOT_TAKEN", "This slot has just been booked by someone else"],
  slots_one_per_start: [409, "SLOT_OVERLAPS", "You already have a slot at that time"],
};
`
    : ""
}
export const notFound = (req, res, next) => next(new AppError(404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    err = new AppError(400, "VALIDATION_FAILED", "The request is invalid", err.issues.map((i) => ({ field: i.path.join("."), message: i.message })));
  } else if (err?.type === "entity.parse.failed") {
    err = new AppError(400, "INVALID_JSON", "The request body is not valid JSON");
  }${constraints ? ` else if (err?.code === "23505" && CONSTRAINTS[err.constraint]) {
    err = new AppError(...CONSTRAINTS[err.constraint]);
  }` : ""}
  if (!(err instanceof AppError)) {
    console.error(err);
    err = new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  }
  res.status(err.status).json({ error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) } });
}
`;
const AUTH_HEAD = `import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";
import { Router } from "express";
import { z } from "zod";
import { pool } from "./db.js";
import { AppError } from "./errors.js";

const hash = (token) => createHash("sha256").update(token).digest("hex");
const WEEK = 7 * 24 * 60 * 60 * 1000;
const COOKIE = { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: WEEK };

export const authRouter = Router();
`;
export const AUTH_JS = `${AUTH_HEAD}
const Login = z.object({ email: z.email(), password: z.string().min(1) });

authRouter.post("/auth/login", async (req, res) => {
  const { email, password } = Login.parse(req.body ?? {});
  const user = (await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email.toLowerCase()])).rows[0];
  const ok = user ? await argon2.verify(user.password_hash, password) : false;
  if (!ok) throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  const token = randomBytes(32).toString("base64url");
  await pool.query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)", [hash(token), user.id, new Date(Date.now() + WEEK)]);
  res.cookie("sid", token, COOKIE).status(204).end();
});

authRouter.post("/auth/logout", async (req, res) => {
  if (req.cookies?.sid) await pool.query("DELETE FROM sessions WHERE token_hash = $1", [hash(req.cookies.sid)]);
  res.clearCookie("sid", { path: "/" }).status(204).end();
});

/** req.user = { id, email, fullName, role } for a valid session, or 401. */
export async function requireUser(req, res, next) {
  const token = req.cookies?.sid;
  const { rows } = token
    ? await pool.query('SELECT u.id, u.email, u.full_name AS "fullName", u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > $2', [hash(token), new Date()])
    : { rows: [] };
  if (!rows[0]) return next(new AppError(401, "UNAUTHENTICATED", "Log in to continue"));
  req.user = rows[0];
  next();
}

export const requireRole = (...roles) => (req, res, next) => (roles.includes(req.user.role) ? next() : next(new AppError(403, "FORBIDDEN", "You cannot do this")));

/** The user's role in a course (student, instructor) or null. */
export async function memberRole(userId, courseId) {
  const { rows } = await pool.query("SELECT role FROM course_members WHERE user_id = $1 AND course_id = $2", [userId, courseId]);
  return rows[0]?.role ?? null;
}
`;
export const VALIDATION_JS = `import { z } from "zod";

const DAY = 24 * 60 * 60 * 1000;

export const NewSlot = z.object({
  courseId: z.number().int().positive(),
  startsAt: z.iso
    .datetime({ offset: true })
    .refine((s) => {
      const d = new Date(s);
      return Number.isNaN(d.getTime()) || (d.getUTCMinutes() % 15 === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0);
    }, "must start on a quarter hour")
    .refine((s) => Number.isNaN(Date.parse(s)) || new Date(s) > new Date(), "must be in the future"),
});

export const SlotRange = z
  .object({ from: z.iso.date(), to: z.iso.date() })
  .refine((r) => r.to >= r.from, { path: ["to"], message: "must not be before from" })
  .refine((r) => (Date.parse(r.to) - Date.parse(r.from)) / DAY <= 31, { path: ["to"], message: "the range is at most 31 days" });

export const NewBooking = z.object({ slotId: z.number().int().positive() });

export const Attendance = z.object({ status: z.enum(["attended", "no_show"]) });

export const Week = z.object({ week: z.iso.date().refine((d) => new Date(d).getUTCDay() === 1, "must be a Monday") });
`;
export const SLOTS_JS = `import { Router } from "express";
import { memberRole, requireRole, requireUser } from "./auth.js";
import { pool } from "./db.js";
import { AppError } from "./errors.js";
import { NewSlot, SlotRange } from "./validation.js";

export const slotsRouter = Router();
const COLUMNS = 's.id, s.instructor_id AS "instructorId", s.course_id AS "courseId", s.starts_at AS "startsAt", s.ends_at AS "endsAt"';

slotsRouter.post("/slots", requireUser, requireRole("instructor"), async (req, res) => {
  const { courseId, startsAt } = NewSlot.parse(req.body ?? {});
  if ((await memberRole(req.user.id, courseId)) !== "instructor") throw new AppError(403, "NOT_COURSE_INSTRUCTOR", "You do not teach this course");
  const starts = new Date(startsAt);
  const { rows } = await pool.query(
    \`INSERT INTO slots AS s (instructor_id, course_id, starts_at, ends_at) VALUES ($1, $2, $3, $4) RETURNING \${COLUMNS}\`,
    [req.user.id, courseId, starts, new Date(starts.getTime() + 20 * 60 * 1000)]
  );
  res.status(201).json({ data: rows[0] });
});

/** An instructor's free slots in a date range; students see only the courses they are enrolled in. */
slotsRouter.get("/instructors/:id/slots", requireUser, async (req, res) => {
  const { from, to } = SlotRange.parse(req.query);
  const instructorId = Number(req.params.id);
  const found = await pool.query("SELECT 1 FROM users WHERE id = $1 AND role = 'instructor'", [instructorId]);
  if (!found.rowCount) throw new AppError(404, "INSTRUCTOR_NOT_FOUND", "No such instructor");
  const { rows } = await pool.query(
    \`SELECT \${COLUMNS} FROM slots s
      WHERE s.instructor_id = $1 AND s.starts_at >= $2::date AND s.starts_at < $3::date + 1 AND s.starts_at > now()
        AND NOT EXISTS (SELECT 1 FROM bookings b WHERE b.slot_id = s.id AND b.status <> 'cancelled')
        AND ($4 <> 'student' OR EXISTS (SELECT 1 FROM course_members m WHERE m.course_id = s.course_id AND m.user_id = $5 AND m.role = 'student'))
      ORDER BY s.starts_at\`,
    [instructorId, from, to, req.user.role, req.user.id]
  );
  res.json({ data: rows });
});
`;
const BOOKINGS_HEAD = `import { Router } from "express";
import { memberRole, requireRole, requireUser } from "./auth.js";
import { pool } from "./db.js";
import { AppError } from "./errors.js";
import { Attendance, NewBooking } from "./validation.js";

export const bookingsRouter = Router();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export async function bookingView(id) {
  const { rows } = await pool.query(
    'SELECT b.id, b.slot_id AS "slotId", b.student_id AS "studentId", b.status, s.starts_at AS "startsAt" FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.id = $1',
    [id]
  );
  return rows[0];
}
`;
const BOOKINGS_RULES = (catch23505) => `
/** When a student blocked for no-shows may book again (null: not blocked). Two no-shows within 30 days block for 14 days after the second. */
export async function blockedUntil(studentId, now = new Date()) {
  const { rows } = await pool.query(
    "SELECT s.ends_at FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.student_id = $1 AND b.status = 'no_show' AND s.ends_at > $2 ORDER BY s.ends_at",
    [studentId, new Date(now.getTime() - 44 * DAY)]
  );
  let until = null;
  for (let i = 1; i < rows.length; i++) {
    const second = rows[i].ends_at.getTime();
    if (second - rows[i - 1].ends_at.getTime() <= 30 * DAY && second + 14 * DAY > now.getTime()) until = new Date(second + 14 * DAY);
  }
  return until;
}

bookingsRouter.post("/bookings", requireUser, requireRole("student"), async (req, res) => {
  const { slotId } = NewBooking.parse(req.body ?? {});
  const slot = (await pool.query("SELECT id, course_id, starts_at FROM slots WHERE id = $1", [slotId])).rows[0];
  if (!slot) throw new AppError(404, "SLOT_NOT_FOUND", "No such slot");
  if ((await memberRole(req.user.id, slot.course_id)) !== "student") throw new AppError(403, "NOT_ENROLLED", "You are not enrolled in this course");
  if (slot.starts_at <= new Date()) throw new AppError(409, "SLOT_IN_PAST", "This slot has already started");
  const until = await blockedUntil(req.user.id);
  if (until) throw new AppError(403, "BOOKING_BLOCKED", \`After two no-shows you can book again from \${until.toISOString()}\`);
${
  catch23505
    ? `  let inserted;
  try {
    // The partial unique index decides races: of two simultaneous bookings, one INSERT fails with 23505.
    inserted = await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2) RETURNING id", [slotId, req.user.id]);
  } catch (err) {
    if (err.code === "23505") throw new AppError(409, "SLOT_TAKEN", "This slot has just been booked by someone else");
    throw err;
  }
  res.status(201).json({ data: await bookingView(inserted.rows[0].id) });`
    : `  // The partial unique index decides races; the error handler turns its 23505 into 409 SLOT_TAKEN.
  const inserted = await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2) RETURNING id", [slotId, req.user.id]);
  res.status(201).json({ data: await bookingView(inserted.rows[0].id) });`
}
});

bookingsRouter.delete("/bookings/:id", requireUser, async (req, res) => {
  const b = (await pool.query("SELECT b.id, b.status, s.starts_at FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.id = $1 AND b.student_id = $2", [req.params.id, req.user.id])).rows[0];
  if (!b) throw new AppError(404, "BOOKING_NOT_FOUND", "No such booking");
  if (b.status !== "booked") throw new AppError(409, "NOT_CANCELLABLE", \`A \${b.status} booking cannot be cancelled\`);
  if (b.starts_at.getTime() - Date.now() < 2 * HOUR) throw new AppError(409, "TOO_LATE_TO_CANCEL", "Bookings can be cancelled until 2 hours before they start");
  await pool.query("UPDATE bookings SET status = 'cancelled', cancelled_at = now() WHERE id = $1", [b.id]);
  res.status(204).end();
});

bookingsRouter.patch("/bookings/:id", requireUser, requireRole("instructor"), async (req, res) => {
  const { status } = Attendance.parse(req.body ?? {});
  const b = (await pool.query("SELECT b.id, b.status, s.instructor_id, s.ends_at FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.id = $1", [req.params.id])).rows[0];
  if (!b) throw new AppError(404, "BOOKING_NOT_FOUND", "No such booking");
  if (b.instructor_id !== req.user.id) throw new AppError(403, "NOT_YOUR_SLOT", "Only the slot's instructor can record attendance");
  if (b.status === "cancelled") throw new AppError(409, "BOOKING_CANCELLED", "This booking was cancelled");
  if (b.ends_at > new Date()) throw new AppError(409, "NOT_FINISHED", "Attendance can be recorded once the slot has ended");
  await pool.query("UPDATE bookings SET status = $2 WHERE id = $1", [b.id, status]);
  await pool.query("INSERT INTO attendance_audit (booking_id, changed_by, old_status, new_status) VALUES ($1, $2, $3, $4)", [b.id, req.user.id, b.status, status]);
  res.json({ data: await bookingView(b.id) });
});
`;
export const BOOKINGS_JS = (catch23505 = false) => BOOKINGS_HEAD + BOOKINGS_RULES(catch23505);
export const ME_JS = `import { Router } from "express";
import { requireUser } from "./auth.js";
import { pool } from "./db.js";

export const meRouter = Router();

/** Students: their bookings. Instructors: the bookings of their slots. Newest slot first. */
meRouter.get("/me/bookings", requireUser, async (req, res) => {
  const column = req.user.role === "instructor" ? "s.instructor_id" : "b.student_id";
  const { rows } = await pool.query(
    \`SELECT b.id, b.slot_id AS "slotId", b.student_id AS "studentId", b.status, s.starts_at AS "startsAt"
       FROM bookings b JOIN slots s ON s.id = b.slot_id
      WHERE \${column} = $1
      ORDER BY s.starts_at DESC, b.id DESC\`,
    [req.user.id]
  );
  res.json({ data: rows });
});
`;
export const REPORTS_JS = `import { Router } from "express";
import { requireRole, requireUser } from "./auth.js";
import { pool } from "./db.js";
import { Week } from "./validation.js";

export const reportsRouter = Router();

/** Per course, for slots starting in the week (Monday to Sunday, UTC): counts only, no names. */
reportsRouter.get("/reports/weekly", requireUser, requireRole("admin"), async (req, res) => {
  const { week } = Week.parse(req.query);
  const { rows } = await pool.query(
    \`SELECT c.code AS "courseCode",
            count(b.id)::int AS bookings,
            count(b.id) FILTER (WHERE b.status = 'cancelled')::int AS cancellations,
            count(b.id) FILTER (WHERE b.status = 'no_show')::int AS "noShows"
       FROM courses c
       JOIN slots s ON s.course_id = c.id AND s.starts_at >= $1::date AND s.starts_at < $1::date + 7
       JOIN bookings b ON b.slot_id = s.id
      GROUP BY c.code
      ORDER BY c.code\`,
    [week]
  );
  res.json({ data: rows });
});
`;
export const APP_JS = (routers = ["auth", "slots", "bookings", "me", "reports"]) => `import cookieParser from "cookie-parser";
import express from "express";
${routers.map((r) => `import { ${r}Router } from "./${r}.js";`).join("\n")}
import { errorHandler, notFound } from "./errors.js";

export const app = express();
app.use(express.json());
app.use(cookieParser());
${routers.map((r) => `app.use(${r}Router);`).join("\n")}
app.use(notFound);
app.use(errorHandler);
`;
export const SERVER_JS = 'import { app } from "./src/app.js";\n\napp.listen(3000, () => console.log("Office Hours API on http://localhost:3000"));\n';

/** The whole project, optionally without some files and with replacements. */
export const PROJECT = ({ constraints = true, routers, catch23505 = false } = {}) => ({
  "package.json": PKG,
  ".env": ENV,
  "server.js": SERVER_JS,
  "src/db.js": DB_JS,
  "src/errors.js": ERRORS_JS(constraints),
  "src/auth.js": AUTH_JS,
  "src/validation.js": VALIDATION_JS,
  "src/slots.js": SLOTS_JS,
  "src/bookings.js": BOOKINGS_JS(catch23505),
  "src/me.js": ME_JS,
  "src/reports.js": REPORTS_JS,
  "src/app.js": APP_JS(routers),
});
export const ALL_RO = Object.keys(PROJECT());

/* ── Check preambles ──────────────────────────────────────────────────── */

/** as("ada") logs in (once) and returns request options with her session cookie. */
export const AS = `const PW = "correct horse battery staple"; const sids = {}; const as = async (who, extra = {}) => { if (!sids[who]) { const r = await post("/auth/login", { email: who + "@example.com", password: PW }); assert(r.status === 204, "logging in as " + who + " answered " + r.status + " " + r.text); sids[who] = (r.cookies || []).find((c) => c.startsWith("sid=")).split(";")[0]; } return { ...extra, headers: { ...(extra.headers || {}), Cookie: sids[who] } }; };`;
/** at(days, hours, minutes): an ISO time that many days after today (UTC midnight), on the lab clock. */
export const AT = `const DAY = 86400000; const at = (days, h, m = 0) => new Date(Math.floor(now() / DAY) * DAY + days * DAY + (h * 60 + m) * 60000).toISOString(); const dayOf = (days) => at(days, 0).slice(0, 10);`;
/** A slot inserted directly (also in the past): returns its id. */
export const SLOT = `const slotAt = async (instructor, course, iso) => (await sql("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES ($1, $2, $3, $3::timestamptz + interval '20 minutes') RETURNING id", [instructor, course, iso]))[0].id;`;
export const BOOK = `const bookAs = async (who, slotId) => post("/bookings", { slotId }, await as(who));`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 151 · 22.1 – 22.2 · DATABASE AND ENDPOINTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l151-mvp-data-endpoints",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["22.1", "22.2"],
    title: "A Persistent Database and Well-Structured API Endpoints",
    subtitle: "The specification becomes running code",
    estimatedMinutes: 110,
    intro: "Week 22 builds Office Hours from the Week 21 specification, one module at a time, each checked by real journeys over HTTP against PostgreSQL. It starts at the bottom: migrations and seed data, then the first endpoints of the contract.",
    atoms: [
      {
        id: "a-be-mvp-database",
        title: "Requirement: a persistent database",
        explain:
          "The database is built by MIGRATIONS (Week 19's runner applies migrations/*.sql in order, once each) and filled by a SEED script for development and tests. The seed must be IDEMPOTENT: running it twice leaves the same data, using INSERT … ON CONFLICT … DO NOTHING (or DO UPDATE) on natural keys such as email and course code, so developers and CI can run it any time. Seed passwords are hashed like real ones; never commit real user data.",
        nodeLab: {
          task:
            "migrations/001_schema.sql is given (Week 21's schema). Write migrations/002_sessions_and_audit.sql (sessions: token_hash primary key, user_id referencing users with ON DELETE CASCADE, expires_at; attendance_audit: id, booking_id, changed_by, old_status, new_status, changed_at default now()) and seed.js: the six users (passwords hashed with argon2), the two courses and the course memberships listed in seed-data.js, inserted idempotently by email, course code and membership key. npm run setup migrates then seeds.",
          command: false,
          db: "SELECT 1;\n",
          files: {
            "package.json": pkg({ name: "office-hours", scripts: { setup: "node --env-file=.env migrate.js && node --env-file=.env seed.js" }, deps: ["argon2", "pg"] }),
            ".env": ENV,
            "migrate.js": `import { readdirSync, readFileSync } from "node:fs";
import pg from "pg";

// Week 19's runner: each pending migrations/*.sql once, in order, in a transaction.
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  for (const name of readdirSync("migrations").filter((f) => f.endsWith(".sql") && !done.has(f)).sort()) {
    await client.query("BEGIN");
    try {
      await client.query(readFileSync(\`migrations/\${name}\`, "utf8"));
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
      await client.query("COMMIT");
      console.log(\`applied \${name}\`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(\`Migration \${name} failed: \${err.message}\`);
    }
  }
} finally {
  await client.end();
}
`,
            "migrations/001_schema.sql": SCHEMA_SQL,
            "migrations/002_sessions_and_audit.sql": "",
            "seed-data.js": `export const PASSWORD = "correct horse battery staple"; // development only

export const USERS = ${JSON.stringify(SEED_USERS.map(([email, fullName, role]) => ({ email, fullName, role })), null, 2)};

export const COURSES = [
  { code: "BE-101", title: "Backend Engineering" },
  { code: "DB-101", title: "Relational Databases" },
];

/** [course code, email, role] */
export const MEMBERS = [
  ["BE-101", "ngozi@example.com", "instructor"],
  ["DB-101", "tunde@example.com", "instructor"],
  ["BE-101", "ada@example.com", "student"],
  ["BE-101", "bayo@example.com", "student"],
  ["DB-101", "bayo@example.com", "student"],
  ["DB-101", "chi@example.com", "student"],
];
`,
            "seed.js": "// Insert USERS, COURSES and MEMBERS from seed-data.js, idempotently.\n",
          },
          readOnly: ["package.json", ".env", "migrate.js", "migrations/001_schema.sql", "seed-data.js"],
          open: "migrations/002_sessions_and_audit.sql",
          solution: {
            "migrations/002_sessions_and_audit.sql": SESSIONS_SQL,
            "seed.js": `import argon2 from "argon2";
import pg from "pg";
import { COURSES, MEMBERS, PASSWORD, USERS } from "./seed-data.js";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const passwordHash = await argon2.hash(PASSWORD); // one hash for every development user
  for (const u of USERS) {
    await client.query("INSERT INTO users (email, full_name, role, password_hash) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING", [u.email, u.fullName, u.role, passwordHash]);
  }
  for (const c of COURSES) {
    await client.query("INSERT INTO courses (code, title) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING", [c.code, c.title]);
  }
  for (const [code, email, role] of MEMBERS) {
    await client.query(
      \`INSERT INTO course_members (course_id, user_id, role)
       SELECT c.id, u.id, $3 FROM courses c, users u WHERE c.code = $1 AND u.email = $2
       ON CONFLICT (course_id, user_id) DO NOTHING\`,
      [code, email, role]
    );
  }
  console.log(\`seeded \${USERS.length} users, \${COURSES.length} courses, \${MEMBERS.length} memberships\`);
} finally {
  await client.end();
}
`,
          },
          tests: [
            { label: "npm run setup builds and fills the database", check: `await run("npm run setup"); has(stdout(), "applied 001_schema.sql", "the first migration"); has(stdout(), "applied 002_sessions_and_audit.sql", "your migration"); eq(exitCode(), 0, "exit code (" + stderr().trim().split("\\n").pop() + ")"); const n = async (t) => (await sql("SELECT count(*)::int AS n FROM " + t))[0].n; eq([await n("users"), await n("courses"), await n("course_members")], [6, 2, 6], "users, courses, memberships");` },
            { label: "Sessions and the audit table", check: `const cols = async (t) => (await sql("SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position", [t])).map((r) => r.column_name); eq(await cols("sessions"), ["token_hash", "user_id", "expires_at"], "sessions columns"); eq(await cols("attendance_audit"), ["id", "booking_id", "changed_by", "old_status", "new_status", "changed_at"], "attendance_audit columns"); const fk = await sql("SELECT confdeltype FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND contype = 'f'"); eq(fk[0]?.confdeltype, "c", "sessions.user_id references users ON DELETE CASCADE"); const pk = await sql("SELECT a.attname FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE i.indrelid = 'sessions'::regclass AND i.indisprimary"); eq(pk.map((r) => r.attname), ["token_hash"], "token_hash is the primary key");` },
            { label: "Seeding is idempotent, and passwords are hashed", check: `await run("node --env-file=.env seed.js"); eq(exitCode(), 0, "seeding a second time works"); const n = async (t) => (await sql("SELECT count(*)::int AS n FROM " + t))[0].n; eq([await n("users"), await n("courses"), await n("course_members")], [6, 2, 6], "the same rows after two runs"); const u = await sql("SELECT password_hash FROM users WHERE email = 'ada@example.com'"); assert(u[0].password_hash.startsWith("$argon2id$"), "Argon2id hashes, never the password itself"); const m = await sql("SELECT c.code, u.email, m.role FROM course_members m JOIN courses c ON c.id = m.course_id JOIN users u ON u.id = m.user_id ORDER BY c.code, u.email"); eq(m.map((r) => [r.code, r.email, r.role]), [["BE-101", "ada@example.com", "student"], ["BE-101", "bayo@example.com", "student"], ["BE-101", "ngozi@example.com", "instructor"], ["DB-101", "bayo@example.com", "student"], ["DB-101", "chi@example.com", "student"], ["DB-101", "tunde@example.com", "instructor"]], "memberships, looked up by code and email (not by guessed ids)");` },
          ],
          hint: "002: CREATE TABLE sessions (…user_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE…) and CREATE TABLE attendance_audit. seed.js: hash the password once with argon2.hash, then INSERT … ON CONFLICT (email) DO NOTHING, ON CONFLICT (code) …, and for memberships INSERT … SELECT c.id, u.id FROM courses c, users u WHERE c.code = $1 AND u.email = $2 ON CONFLICT DO NOTHING.",
          successMessage: "Any machine can now build the Office Hours database from nothing with one command, as many times as it likes.",
        },
      },
      {
        id: "a-be-mvp-endpoints",
        title: "Requirement: well-structured API endpoints",
        explain:
          "Implement the contract exactly: the paths, methods, status codes and response shapes of openapi.yaml, so the web app built against it works unchanged. A router per resource (slots, bookings), handlers that validate, authorize, call the database and answer { data } or { error }. Times travel as ISO 8601 strings in UTC; ids as integers; field names in camelCase even when columns are snake_case (AS \"startsAt\").",
        nodeLab: {
          task:
            "Implement src/slots.js: POST /slots (instructors; body { courseId, startsAt }; the slot lasts 20 minutes) answering 201 { data: Slot }, and GET /instructors/:id/slots?from=YYYY-MM-DD&to=YYYY-MM-DD answering { data: [Slot] }: that instructor's future slots in the range (inclusive), without slots that have an active booking, in time order, and for students only those of courses they are enrolled in; 404 INSTRUCTOR_NOT_FOUND for an unknown instructor. Slot = { id, instructorId, courseId, startsAt, endsAt }. Use requireUser, requireRole and memberRole from auth.js and the schemas in validation.js; an instructor publishing for a course they do not teach gets 403 NOT_COURSE_INSTRUCTOR.",
          db: OH_SQL,
          files: { ...PROJECT(), "src/slots.js": 'import { Router } from "express";\nimport { memberRole, requireRole, requireUser } from "./auth.js";\nimport { pool } from "./db.js";\nimport { AppError } from "./errors.js";\nimport { NewSlot, SlotRange } from "./validation.js";\n\nexport const slotsRouter = Router();\n' },
          readOnly: ALL_RO.filter((p) => p !== "src/slots.js"),
          open: "src/slots.js",
          solution: { "src/slots.js": SLOTS_JS },
          tests: [
            { label: "POST /slots creates a 20-minute slot", check: `${AS} ${AT} const r = await post("/slots", { courseId: 1, startsAt: at(3, 9) }, await as("ngozi")); eq(r.status, 201, "status (" + r.text + ")"); eq(r.json?.data, { id: r.json?.data?.id, instructorId: 1, courseId: 1, startsAt: at(3, 9), endsAt: at(3, 9, 20) }, "the slot, in the contract's shape"); const other = await post("/slots", { courseId: 2, startsAt: at(3, 10) }, await as("ngozi")); eq([other.status, other.json?.error?.code], [403, "NOT_COURSE_INSTRUCTOR"], "Ngozi does not teach DB-101"); eq((await post("/slots", { courseId: 1, startsAt: at(3, 11) }, await as("ada"))).status, 403, "a student cannot publish"); eq((await post("/slots", { courseId: 1, startsAt: at(3, 12) })).status, 401, "without a session");` },
            { label: "GET /instructors/:id/slots: free, future, in range, in order", check: `${AS} ${AT} ${SLOT} for (const [d, h] of [[4, 14], [4, 9], [5, 9], [12, 9]]) await post("/slots", { courseId: 1, startsAt: at(d, h) }, await as("ngozi")); const past = await slotAt(1, 1, at(-1, 9)); const taken = await slotAt(1, 1, at(4, 11)); await sql("INSERT INTO bookings (slot_id, student_id) VALUES ($1, 4)", [taken]); const r = await get("/instructors/1/slots?from=" + dayOf(4) + "&to=" + dayOf(5), await as("ada")); eq(r.status, 200, "status (" + r.text + ")"); eq(r.json?.data?.map((s) => s.startsAt), [at(4, 9), at(4, 14), at(5, 9)], "days 4 to 5 inclusive, in time order, without the booked slot at 11:00 or the slot 12 days away"); eq(Object.keys(r.json.data[0]).sort(), ["courseId", "endsAt", "id", "instructorId", "startsAt"], "Slot fields"); const all = await get("/instructors/1/slots?from=" + dayOf(-2) + "&to=" + dayOf(2), await as("ada")); assert(!all.json?.data?.some((s) => s.id === past), "slots that have started are never offered");` },
            { label: "Students see only their courses' slots", check: `${AS} ${AT} await post("/slots", { courseId: 2, startsAt: at(6, 9) }, await as("tunde")); const chi = await get("/instructors/2/slots?from=" + dayOf(6) + "&to=" + dayOf(6), await as("chi")); eq(chi.json?.data?.length, 1, "Chi (DB-101) sees Tunde's DB-101 slot"); const ada = await get("/instructors/2/slots?from=" + dayOf(6) + "&to=" + dayOf(6), await as("ada")); eq(ada.json?.data, [], "Ada (BE-101 only) sees none"); eq((await get("/instructors/2/slots?from=" + dayOf(6) + "&to=" + dayOf(6), await as("kemi"))).json?.data?.length, 1, "an admin sees them"); const nf = await get("/instructors/3/slots?from=" + dayOf(1) + "&to=" + dayOf(2), await as("ada")); eq([nf.status, nf.json?.error?.code], [404, "INSTRUCTOR_NOT_FOUND"], "user 3 is a student, not an instructor"); eq((await get("/instructors/1/slots?from=" + dayOf(1), await as("ada"))).status, 400, "to is required (validation.js)");` },
          ],
          hint: "POST: NewSlot.parse(req.body), check memberRole(req.user.id, courseId) === \"instructor\", INSERT … RETURNING with AS \"startsAt\" aliases, ends_at = starts + 20 minutes. GET: SlotRange.parse(req.query); one SELECT with starts_at >= $from::date AND starts_at < $to::date + 1 AND starts_at > now(), NOT EXISTS an active booking, and for students EXISTS a student membership in the slot's course.",
          successMessage: "Instructors publish and students browse exactly as the contract says, with the right slots for the right people.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 152 · 22.3 – 22.4 · AUTH AND VALIDATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l152-mvp-auth-validation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["22.3", "22.4"],
    title: "Authentication, Authorization and Input Validation",
    subtitle: "Who is asking, and whether what they sent makes sense",
    estimatedMinutes: 100,
    intro: "Two layers every endpoint passes through before any business rule runs: proving who the caller is and what they may do, and rejecting malformed input with a precise answer.",
    atoms: [
      {
        id: "a-be-mvp-auth",
        title: "Requirement: authentication and authorization",
        explain:
          "AUTH.md is the specification: sessions in an HttpOnly, Secure, SameSite cookie; Argon2id passwords; the same answer for an unknown email and a wrong password; three roles; and the access matrix. Implement it with Weeks 13 and 14's pieces: a login route that creates a hashed session, requireUser, requireRole, and a memberRole lookup for the course-level checks, so each cell of the matrix maps to one middleware or one query condition.",
        nodeLab: {
          task:
            "Write src/auth.js: POST /auth/login ({ email, password }, validated with zod): verify the Argon2id hash; 401 INVALID_CREDENTIALS for an unknown email or a wrong password alike; otherwise store sha256(token) in sessions with a 7-day expiry and set the cookie sid (HttpOnly, Secure, SameSite=Lax, path /, 7 days); 204. POST /auth/logout deletes the session and clears the cookie (204). requireUser (req.user = { id, email, fullName, role } from a valid, unexpired session, else 401 UNAUTHENTICATED), requireRole(...roles) (403 FORBIDDEN) and memberRole(userId, courseId) (the user's role in the course, or null).",
          db: OH_SQL,
          files: { ...PROJECT(), "src/auth.js": AUTH_HEAD + "\nexport async function requireUser(req, res, next) {\n  next();\n}\n\nexport const requireRole = (...roles) => (req, res, next) => next();\n\nexport async function memberRole(userId, courseId) {\n  return null;\n}\n" },
          readOnly: ALL_RO.filter((p) => p !== "src/auth.js"),
          open: "src/auth.js",
          solution: { "src/auth.js": AUTH_JS },
          tests: [
            { label: "Logging in sets a safe session cookie", check: `const r = await post("/auth/login", { email: "ada@example.com", password: "correct horse battery staple" }); eq(r.status, 204, "status (" + r.text + ")"); const c = (r.cookies || []).find((x) => x.startsWith("sid=")); assert(c, "a sid cookie"); for (const f of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/"]) has(c, f, "the cookie has " + f); assert(/Max-Age=604800|Expires=/i.test(c), "7 days (Max-Age=604800)"); const token = c.split(";")[0].slice(4); const { createHash } = await load("node:crypto"); const row = await sql("SELECT user_id FROM sessions WHERE token_hash = $1", [createHash("sha256").update(token).digest("hex")]); eq(row[0]?.user_id, 3, "the session is stored as sha256(token), for Ada"); eq((await sql("SELECT count(*)::int AS n FROM sessions WHERE token_hash = $1", [token]))[0].n, 0, "never the token itself");` },
            { label: "Wrong password and unknown email: the same 401", check: `const wrong = await post("/auth/login", { email: "ada@example.com", password: "nope" }); const unknown = await post("/auth/login", { email: "ghost@example.com", password: "nope" }); eq([wrong.status, wrong.json?.error?.code], [401, "INVALID_CREDENTIALS"], "a wrong password"); eq([unknown.status, unknown.json], [wrong.status, wrong.json], "an unknown email gets exactly the same answer"); eq((await post("/auth/login", { email: "not-an-email", password: "x" })).status, 400, "an invalid body is a 400 (zod)");` },
            { label: "Sessions identify the user; logout ends them", check: `${AS} ${AT} const opts = await as("ngozi"); eq((await post("/slots", { courseId: 1, startsAt: at(3, 9) }, opts)).status, 201, "Ngozi's session works (requireUser and requireRole)"); eq((await post("/slots", { courseId: 1, startsAt: at(3, 9, 15) }, await as("ada"))).json?.error?.code, "FORBIDDEN", "a student is not an instructor (requireRole)"); eq((await post("/slots", { courseId: 2, startsAt: at(3, 10) }, opts)).json?.error?.code, "NOT_COURSE_INSTRUCTOR", "memberRole: Ngozi does not teach DB-101"); eq((await post("/auth/logout", {}, opts)).status, 204, "logout"); const after = await post("/slots", { courseId: 1, startsAt: at(3, 11) }, opts); eq([after.status, after.json?.error?.code], [401, "UNAUTHENTICATED"], "the old cookie no longer works"); await sql("UPDATE sessions SET expires_at = now() - interval '1 minute'"); eq((await get("/me/bookings", await as("ada"))).status, 401, "an expired session is refused");` },
          ],
          hint: "Login: Login.parse(req.body), SELECT the user, argon2.verify only if found (ok = false otherwise), then randomBytes(32).toString(\"base64url\"), INSERT hash(token), res.cookie(\"sid\", token, COOKIE). requireUser: SELECT … FROM sessions JOIN users WHERE token_hash = $1 AND expires_at > $2 with new Date(), next(new AppError(401, …)) when there is no row.",
          successMessage: "Every request now carries a verified identity and role, and every cell of the access matrix has a mechanism behind it.",
        },
      },
      {
        id: "a-be-mvp-validation",
        title: "Requirement: input validation",
        explain:
          "Validate every input at the edge, with one schema per body and query (zod), so handlers only ever see well-formed values: types (an integer courseId, not \"1\"), formats (ISO dates with an offset), ranges (at most 31 days) and the domain's own shape rules (slots start on a quarter hour, in the future). The error handler turns a ZodError into 400 VALIDATION_FAILED with one detail per problem, naming the field, so clients can show the message next to the right input.",
        nodeLab: {
          task:
            "Write the schemas in src/validation.js used by the routers: NewSlot { courseId: positive integer, startsAt: ISO datetime with an offset, on a quarter hour (\"must start on a quarter hour\") and in the future (\"must be in the future\") }; SlotRange { from, to: ISO dates; to not before from and at most 31 days later, both reported on the field to }; NewBooking { slotId: positive integer }; Attendance { status: attended or no_show }; Week { week: an ISO date that is a Monday }.",
          db: OH_SQL,
          files: { ...PROJECT(), "src/validation.js": 'import { z } from "zod";\n\nexport const NewSlot = z.any();\nexport const SlotRange = z.any();\nexport const NewBooking = z.any();\nexport const Attendance = z.any();\nexport const Week = z.any();\n' },
          readOnly: ALL_RO.filter((p) => p !== "src/validation.js"),
          open: "src/validation.js",
          solution: { "src/validation.js": VALIDATION_JS },
          tests: [
            { label: "Slots: types, quarter hours, the future", check: `${AS} ${AT} const o = await as("ngozi"); const fields = (r) => (r.json?.error?.details || []).map((d) => d.field + ": " + d.message); const a = await post("/slots", { courseId: "1", startsAt: "tomorrow" }, o); eq([a.status, a.json?.error?.code], [400, "VALIDATION_FAILED"], "a string courseId and a non-date"); eq(fields(a).map((f) => f.split(":")[0]).sort(), ["courseId", "startsAt"], "one detail per field"); const b = await post("/slots", { courseId: 1, startsAt: at(3, 9, 7) }, o); eq(fields(b), ["startsAt: must start on a quarter hour"], "09:07"); const c = await post("/slots", { courseId: 1, startsAt: at(-2, 9) }, o); eq(fields(c), ["startsAt: must be in the future"], "two days ago"); eq((await post("/slots", { courseId: 1, startsAt: at(3, 9).replace("Z", "") }, o)).status, 400, "a datetime without an offset is ambiguous"); eq((await post("/slots", { courseId: 1, startsAt: at(3, 9, 45) }, o)).status, 201, "09:45 is fine");` },
            { label: "Ranges, bookings, attendance and weeks", check: `${AS} ${AT} const o = await as("ada"); const fields = (r) => (r.json?.error?.details || []).map((d) => d.field + ": " + d.message); eq(fields(await get("/instructors/1/slots?from=" + dayOf(5) + "&to=" + dayOf(3), o)), ["to: must not be before from"], "to before from"); eq(fields(await get("/instructors/1/slots?from=" + dayOf(1) + "&to=" + dayOf(40), o)), ["to: the range is at most 31 days"], "40 days"); eq((await get("/instructors/1/slots?from=" + dayOf(1) + "&to=" + dayOf(32), o)).status, 200, "exactly 31 days is allowed"); eq((await get("/instructors/1/slots?from=nope&to=" + dayOf(2), o)).status, 400, "a bad date"); eq(fields(await post("/bookings", { slotId: -4 }, o)).map((f) => f.split(":")[0]), ["slotId"], "a negative slotId"); eq((await patch("/bookings/1", { status: "late" }, await as("ngozi"))).json?.error?.code, "VALIDATION_FAILED", "an unknown attendance status"); const k = await as("kemi"); const monday = (() => { const d = new Date(Math.floor(now() / 86400000) * 86400000); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); })(); const tuesday = new Date(Date.parse(monday) + 86400000).toISOString().slice(0, 10); eq((await get("/reports/weekly?week=" + monday, k)).status, 200, "a Monday"); eq(fields(await get("/reports/weekly?week=" + tuesday, k)), ["week: must be a Monday"], "a Tuesday");` },
          ],
          hint: "z.iso.datetime({ offset: true }).refine(…, \"must start on a quarter hour\").refine(…, \"must be in the future\"). For the range: z.object({ from: z.iso.date(), to: z.iso.date() }).refine(check, { path: [\"to\"], message }). Compare quarter hours with getUTCMinutes() % 15 and seconds 0.",
          successMessage: "No malformed value reaches a handler any more, and every rejection tells the client exactly which field to fix and why.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 153 · 22.5 – 22.6 · RULES AND ERRORS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l153-mvp-rules-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["22.5", "22.6"],
    title: "Business Rules, Database Constraints and Consistent Error Handling",
    subtitle: "The heart of the product, and how it says no",
    estimatedMinutes: 120,
    intro: "Booking is where Office Hours earns its keep: the race for a slot, the cancellation window, attendance and the no-show block. Then every way the API can refuse is made to look the same.",
    atoms: [
      {
        id: "a-be-mvp-booking-rules",
        title: "Requirement: business rules and database constraints",
        explain:
          "Rules live in two places that work together. The DATABASE guarantees what must hold under any concurrency (one active booking per slot, the partial unique index), and the code turns its violation (SQLSTATE 23505) into the product's answer (409 SLOT_TAKEN). The CODE checks what needs context (membership, time windows, the no-show history) before writing. Times are compared in one place with one clock, and every rule has a named error code from the contract.",
        nodeLab: {
          task:
            "Write the booking routes in src/bookings.js (bookingView and the head are given). POST /bookings (students): 404 SLOT_NOT_FOUND; 403 NOT_ENROLLED unless enrolled in the slot's course; 409 SLOT_IN_PAST once it has started; 403 BOOKING_BLOCKED after 2 no-shows whose slots ended within 30 days of each other, until 14 days after the second (write blockedUntil(studentId)); then INSERT, turning a 23505 from the unique index into 409 SLOT_TAKEN; 201 with the booking. DELETE /bookings/:id: only your own (else 404), only if booked (409 NOT_CANCELLABLE), at least 2 hours before the start (409 TOO_LATE_TO_CANCEL); 204. PATCH /bookings/:id (instructors): 404, 403 NOT_YOUR_SLOT, 409 BOOKING_CANCELLED, 409 NOT_FINISHED before the slot ends; update and insert an attendance_audit row; 200.",
          db: OH_SQL,
          files: { ...PROJECT({ constraints: false }), "src/bookings.js": BOOKINGS_HEAD },
          readOnly: ALL_RO.filter((p) => p !== "src/bookings.js"),
          open: "src/bookings.js",
          solution: { "src/bookings.js": BOOKINGS_JS(true) },
          tests: [
            { label: "Booking, and the race for one slot", check: `${AS} ${AT} ${SLOT} ${BOOK} const s = await slotAt(1, 1, at(3, 9)); const r = await bookAs("ada", s); eq(r.status, 201, "status (" + r.text + ")"); eq(r.json?.data, { id: r.json?.data?.id, slotId: s, studentId: 3, status: "booked", startsAt: at(3, 9) }, "the booking"); const s2 = await slotAt(1, 1, at(3, 10)); await as("bayo"); const [a, b] = await together(bookAs("ada", s2), bookAs("bayo", s2)); eq([a.status, b.status].sort(), [201, 409], "two students at once: one wins"); eq([a, b].find((x) => x.status === 409).json?.error?.code, "SLOT_TAKEN", "the loser gets SLOT_TAKEN (from the unique index, not a crash)"); eq((await bookAs("bayo", s)).json?.error?.code, "SLOT_TAKEN", "a slot already booked");` },
            { label: "Who may book, and when", check: `${AS} ${AT} ${SLOT} ${BOOK} const db101 = await slotAt(2, 2, at(3, 9)); eq((await bookAs("ada", db101)).json?.error?.code, "NOT_ENROLLED", "Ada is not in DB-101"); eq((await bookAs("ada", 9999)).json?.error?.code, "SLOT_NOT_FOUND", "an unknown slot"); const started = await slotAt(1, 1, new Date(now() - 5 * 60000).toISOString().replace(/:\\d\\d\\.\\d+Z$/, ":00.000Z")); eq((await bookAs("ada", started)).json?.error?.code, "SLOT_IN_PAST", "a slot that has started"); eq((await post("/bookings", { slotId: db101 }, await as("tunde"))).status, 403, "instructors do not book");` },
            { label: "Cancelling: own bookings, until 2 hours before", check: `${AS} ${AT} ${SLOT} ${BOOK} const far = (await bookAs("ada", await slotAt(1, 1, at(5, 9)))).json.data.id; eq((await del("/bookings/" + far, await as("bayo"))).status, 404, "Bayo cannot cancel Ada's booking (and cannot tell it exists)"); eq((await del("/bookings/" + far, await as("ada"))).status, 204, "Ada cancels 5 days ahead"); eq((await sql("SELECT status FROM bookings WHERE id = $1", [far]))[0].status, "cancelled", "status cancelled"); eq((await del("/bookings/" + far, await as("ada"))).json?.error?.code, "NOT_CANCELLABLE", "twice"); const soonIso = new Date(Math.ceil((now() + 90 * 60000) / 900000) * 900000).toISOString(); const soon = await slotAt(1, 1, soonIso); const sb = (await bookAs("ada", soon)).json.data.id; const late = await del("/bookings/" + sb, await as("ada")); eq([late.status, late.json?.error?.code], [409, "TOO_LATE_TO_CANCEL"], "less than 2 hours before");` },
            { label: "Attendance, with an audit trail", check: `${AS} ${AT} ${SLOT} ${BOOK} const past = await slotAt(1, 1, at(-1, 9)); const bid = (await sql("INSERT INTO bookings (slot_id, student_id) VALUES ($1, 3) RETURNING id", [past]))[0].id; eq((await patch("/bookings/" + bid, { status: "no_show" }, await as("tunde"))).json?.error?.code, "NOT_YOUR_SLOT", "Tunde did not hold this slot"); eq((await patch("/bookings/" + bid, { status: "no_show" }, await as("ada"))).status, 403, "the student cannot mark her own attendance"); const r = await patch("/bookings/" + bid, { status: "no_show" }, await as("ngozi")); eq([r.status, r.json?.data?.status], [200, "no_show"], "Ngozi marks it"); const audit = await sql("SELECT changed_by, old_status, new_status FROM attendance_audit WHERE booking_id = $1", [bid]); eq(audit, [{ changed_by: 1, old_status: "booked", new_status: "no_show" }], "the audit row"); const future = (await bookAs("ada", await slotAt(1, 1, at(6, 9)))).json.data.id; eq((await patch("/bookings/" + future, { status: "attended" }, await as("ngozi"))).json?.error?.code, "NOT_FINISHED", "a slot that has not happened");` },
            { label: "Two no-shows within 30 days block booking for 14 days", check: `${AS} ${AT} ${SLOT} ${BOOK} const noShow = async (days) => { const s = await slotAt(1, 1, at(days, 9, 30)); await sql("INSERT INTO bookings (slot_id, student_id, status) VALUES ($1, 4, 'no_show')", [s]); }; await noShow(-25); const ok = await bookAs("bayo", await slotAt(1, 1, at(7, 9))); eq(ok.status, 201, "one no-show does not block"); await noShow(-3); const blocked = await bookAs("bayo", await slotAt(1, 1, at(7, 10))); eq([blocked.status, blocked.json?.error?.code], [403, "BOOKING_BLOCKED"], "the second no-show, 22 days after the first, blocks"); has(blocked.json?.error?.message || "", at(11, 9, 50).slice(0, 16), "the message says when booking reopens (14 days after the second no-show ended)"); eq((await bookAs("ada", await slotAt(1, 1, at(7, 11)))).status, 201, "other students are not affected");` },
          ],
          hint: "Check in order: slot exists, membership, not started, blockedUntil(req.user.id). In blockedUntil, SELECT the no-shows' ends_at (ascending) since 44 days ago, and for each consecutive pair within 30 days compute second + 14 days. Wrap the INSERT in try/catch: err.code === \"23505\" → AppError(409, \"SLOT_TAKEN\", …).",
          successMessage: "The booking rules are in: races are decided by the database, windows by one clock, and every refusal has its documented code.",
        },
      },
      {
        id: "a-be-mvp-errors",
        title: "Requirement: consistent error handling",
        explain:
          "Consistency means a client needs ONE piece of error-handling code: every failure, from every layer (a 404 route, invalid JSON, a zod error, a business rule, a database constraint, a bug), comes back as { error: { code, message, details? } } with the right status. Map the constraints that are business rules to their codes in the error handler (by constraint name), instead of repeating try/catch in each route, and let everything else become a generic 500.",
        nodeLab: {
          task:
            "In src/errors.js, map database constraint violations in the error handler: a 23505 on bookings_one_active_per_slot → 409 SLOT_TAKEN, on slots_one_per_start → 409 SLOT_OVERLAPS (look the constraint name up in a table). Then remove the try/catch around the booking INSERT in src/bookings.js: the handler now does it for every route. Every error, from every layer, must have the same shape.",
          db: OH_SQL,
          files: { ...PROJECT({ constraints: false, catch23505: true }) },
          readOnly: ALL_RO.filter((p) => !["src/errors.js", "src/bookings.js"].includes(p)),
          open: "src/errors.js",
          solution: { "src/errors.js": ERRORS_JS(true), "src/bookings.js": BOOKINGS_JS(false) },
          tests: [
            { label: "Constraints become the contract's codes", check: `${AS} ${AT} ${SLOT} ${BOOK} const o = await as("ngozi"); await post("/slots", { courseId: 1, startsAt: at(3, 9) }, o); const dup = await post("/slots", { courseId: 1, startsAt: at(3, 9) }, o); eq([dup.status, dup.json?.error?.code], [409, "SLOT_OVERLAPS"], "a second slot at the same time (it was a 500 before)"); const s = await slotAt(1, 1, at(4, 9)); await as("bayo"); const [a, b] = await together(bookAs("ada", s), bookAs("bayo", s)); eq([a.status, b.status].sort(), [201, 409], "the race"); eq([a, b].find((x) => x.status === 409).json?.error?.code, "SLOT_TAKEN", "SLOT_TAKEN, now from the error handler");` },
            { label: "No more try/catch in the route", check: `const src = file("src/bookings.js") || ""; assert(!/code\\s*===\\s*["']23505/.test(src), "src/bookings.js no longer handles 23505 itself: the error handler maps constraints for every route"); has(file("src/errors.js") || "", "bookings_one_active_per_slot", "the constraint table in errors.js");` },
            { label: "Every failure has the same shape", check: `${AS} const shape = (r, status, code) => { eq(r.status, status, code + ": status"); eq(Object.keys(r.json || {}), ["error"], code + ": only an error field"); eq(r.json.error.code, code, code + ": code"); assert(typeof r.json.error.message === "string" && r.json.error.message, code + ": a message"); }; shape(await get("/nope"), 404, "ROUTE_NOT_FOUND"); shape(await request("POST", "/auth/login", { body: "{oops", headers: { "Content-Type": "application/json" } }), 400, "INVALID_JSON"); shape(await get("/me/bookings"), 401, "UNAUTHENTICATED"); const v = await post("/slots", { courseId: "x" }, await as("ngozi")); shape(v, 400, "VALIDATION_FAILED"); assert(Array.isArray(v.json.error.details) && v.json.error.details.every((d) => d.field && d.message), "validation errors carry details [{ field, message }]"); shape(await get("/reports/weekly?week=2026-11-02", await as("ada")), 403, "FORBIDDEN"); shape(await del("/bookings/424242", await as("ada")), 404, "BOOKING_NOT_FOUND");` },
          ],
          hint: "const CONSTRAINTS = { bookings_one_active_per_slot: [409, \"SLOT_TAKEN\", …], slots_one_per_start: [409, \"SLOT_OVERLAPS\", …] }; in errorHandler: else if (err.code === \"23505\" && CONSTRAINTS[err.constraint]) err = new AppError(...CONSTRAINTS[err.constraint]). pg errors carry the constraint's name in err.constraint.",
          successMessage: "Every refusal of the API, from the router to the database, now speaks one language, and new constraints need one line in one table.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 154 · 22.7 – 22.8 · TESTS AND COMMITS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l154-mvp-tests-commits",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["22.7", "22.8"],
    title: "Automated Tests for Core Functionality, and a Repository with Meaningful Commits",
    subtitle: "Proof that it works, and a history that explains it",
    estimatedMinutes: 100,
    intro: "The MVP is only done when its core is protected by tests that fail when a rule breaks, and when its history tells a reviewer how it was built.",
    atoms: [
      {
        id: "a-be-mvp-tests",
        title: "Requirement: automated tests for core functionality",
        explain:
          "Test the journeys and rules that would hurt most if broken: booking (and the race), cancelling (and its window), attendance permissions and the no-show block, each through the real HTTP layer against a real database reset before each test. test/helpers.js gives the plumbing: resetDatabase(), login(email), slot(...). As in Week 15, the proof that tests are good is that they fail when the code is wrong.",
        nodeLab: {
          task:
            "Write test/core.test.js with supertest and the helpers in test/helpers.js (reset the database before each test): booking a free slot (201), the second booking of the same slot (409 SLOT_TAKEN), booking another course's slot (403 NOT_ENROLLED), cancelling 3 days ahead (204) and 90 minutes ahead (409 TOO_LATE_TO_CANCEL), another instructor marking attendance (403), and the no-show block (403 BOOKING_BLOCKED after two no-shows). The checks run your suite against the correct app and five broken ones (BUG=…).",
          command: false,
          db: OH_SQL,
          env: { DATABASE_URL: DB_URL },
          files: {
            ...PROJECT(),
            "src/bug.js": "/** For this exercise: BUG=<name> switches one rule off, to prove the tests notice. */\nexport const bug = (name) => process.env.BUG === name;\n",
            "src/bookings.js": BOOKINGS_JS(false)
              .replace('import { Attendance, NewBooking } from "./validation.js";', 'import { bug } from "./bug.js";\nimport { Attendance, NewBooking } from "./validation.js";')
              .replace('if ((await memberRole(req.user.id, slot.course_id)) !== "student")', 'if (!bug("any-course") && (await memberRole(req.user.id, slot.course_id)) !== "student")')
              .replace("if (b.starts_at.getTime() - Date.now() < 2 * HOUR)", 'if (!bug("late-cancel") && b.starts_at.getTime() - Date.now() < 2 * HOUR)')
              .replace("if (b.instructor_id !== req.user.id)", 'if (!bug("any-instructor") && b.instructor_id !== req.user.id)')
              .replace("if (until) throw", 'if (until && !bug("no-block")) throw')
              .replace('const inserted = await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2) RETURNING id", [slotId, req.user.id]);', 'if (bug("double-book")) await pool.query("UPDATE bookings SET status = \'cancelled\' WHERE slot_id = $1 AND status = \'booked\'", [slotId]);\n  const inserted = await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2) RETURNING id", [slotId, req.user.id]);'),
            "test/helpers.js": `import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";

const DAY = 24 * 60 * 60 * 1000;

/** Removes every slot, booking, session and audit row (users, courses and memberships stay as seeded). */
export async function resetDatabase() {
  await pool.query("TRUNCATE attendance_audit, bookings, slots, sessions RESTART IDENTITY CASCADE");
}

/** A logged-in request helper: const ada = await login("ada"); await ada.post("/bookings").send(…). */
export async function login(name) {
  const res = await request(app).post("/auth/login").send({ email: \`\${name}@example.com\`, password: "correct horse battery staple" });
  const cookie = res.headers["set-cookie"].find((c) => c.startsWith("sid=")).split(";")[0];
  const withCookie = (method) => (path) => request(app)[method](path).set("Cookie", cookie);
  return { get: withCookie("get"), post: withCookie("post"), patch: withCookie("patch"), delete: withCookie("delete") };
}

/** Inserts a 20-minute slot directly (it may be in the past); returns its id. instructor 1 = Ngozi (BE-101 = course 1), 2 = Tunde (DB-101 = 2). */
export async function slot({ instructor = 1, course = 1, startsInMinutes }) {
  const starts = new Date(Math.ceil((Date.now() + startsInMinutes * 60 * 1000) / 60000) * 60000);
  const { rows } = await pool.query("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES ($1, $2, $3, $3::timestamptz + interval '20 minutes') RETURNING id", [instructor, course, starts]);
  return rows[0].id;
}

/** Records a no-show for a student (3 = Ada, 4 = Bayo, 5 = Chi) on a slot that ended daysAgo. */
export async function noShow({ student, daysAgo }) {
  const id = await slot({ startsInMinutes: -daysAgo * 24 * 60 });
  await pool.query("INSERT INTO bookings (slot_id, student_id, status) VALUES ($1, $2, 'no_show')", [id, student]);
}

export { DAY };
`,
            "test/core.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { login, noShow, resetDatabase, slot } from "./helpers.js";

beforeEach(resetDatabase);
`,
          },
          readOnly: [...ALL_RO, "src/bug.js", "test/helpers.js"],
          open: "test/core.test.js",
          solution: {
            "test/core.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { login, noShow, resetDatabase, slot } from "./helpers.js";

beforeEach(resetDatabase);

describe("booking", () => {
  it("books a free slot", async () => {
    const ada = await login("ada");
    const id = await slot({ startsInMinutes: 3 * 24 * 60 });
    const res = await ada.post("/bookings").send({ slotId: id });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ slotId: id, studentId: 3, status: "booked" });
  });

  it("refuses a slot that is already booked", async () => {
    const id = await slot({ startsInMinutes: 3 * 24 * 60 });
    await (await login("ada")).post("/bookings").send({ slotId: id });
    const res = await (await login("bayo")).post("/bookings").send({ slotId: id });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("SLOT_TAKEN");
  });

  it("refuses another course's slot", async () => {
    const id = await slot({ instructor: 2, course: 2, startsInMinutes: 3 * 24 * 60 });
    const res = await (await login("ada")).post("/bookings").send({ slotId: id });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("NOT_ENROLLED");
  });
});

describe("cancelling", () => {
  it("cancels three days ahead", async () => {
    const ada = await login("ada");
    const booking = (await ada.post("/bookings").send({ slotId: await slot({ startsInMinutes: 3 * 24 * 60 }) })).body.data;
    expect((await ada.delete(\`/bookings/\${booking.id}\`)).status).toBe(204);
  });

  it("refuses 90 minutes ahead", async () => {
    const ada = await login("ada");
    const booking = (await ada.post("/bookings").send({ slotId: await slot({ startsInMinutes: 90 }) })).body.data;
    const res = await ada.delete(\`/bookings/\${booking.id}\`);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("TOO_LATE_TO_CANCEL");
  });
});

describe("attendance", () => {
  it("only the slot's instructor marks it", async () => {
    const id = await slot({ startsInMinutes: -60 });
    const { pool } = await import("../src/db.js");
    const past = (await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, 3) RETURNING id", [id])).rows[0].id;
    const res = await (await login("tunde")).patch(\`/bookings/\${past}\`).send({ status: "no_show" });
    expect(res.status).toBe(403);
    expect((await (await login("ngozi")).patch(\`/bookings/\${past}\`).send({ status: "no_show" })).status).toBe(200);
  });
});

describe("the no-show block", () => {
  it("blocks after two no-shows in 30 days", async () => {
    await noShow({ student: 4, daysAgo: 20 });
    await noShow({ student: 4, daysAgo: 2 });
    const res = await (await login("bayo")).post("/bookings").send({ slotId: await slot({ startsInMinutes: 3 * 24 * 60 }) });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("BOOKING_BLOCKED");
  });

  it("does not block after one", async () => {
    await noShow({ student: 4, daysAgo: 2 });
    const res = await (await login("bayo")).post("/bookings").send({ slotId: await slot({ startsInMinutes: 3 * 24 * 60 }) });
    expect(res.status).toBe(201);
  });
});
`,
          },
          tests: [
            { label: "Your tests pass against the correct app (7+ tests)", check: `const r = await runTests("npm test"); assert(r.length >= 7, "write at least 7 tests: found " + r.length); eq(r.filter((t) => t.state === "fail").map((t) => t.name), [], "every test should pass against the correct app");` },
            ...[
              ["double-book", "a booked slot can be booked again"],
              ["any-course", "students can book other courses' slots"],
              ["late-cancel", "cancelling is allowed at any time"],
              ["any-instructor", "any instructor can mark attendance"],
              ["no-block", "the no-show block is off"],
            ].map(([b, what]) => ({ label: `They catch: ${what}`, check: `const r = await runTests("BUG=${b} npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=${b} (${what}) at least one of your tests must fail");` })),
          ],
          hint: "Each test: const ada = await login(\"ada\"); const id = await slot({ startsInMinutes: 3 * 24 * 60 }); const res = await ada.post(\"/bookings\").send({ slotId: id }); expect(res.status)…. For the block: two noShow({ student: 4, daysAgo }) calls, then Bayo books.",
          successMessage: "The rules that matter most are now guarded: five different ways to break them, and the suite caught every one.",
        },
      },
      {
        id: "a-be-mvp-commits",
        title: "Requirement: a GitHub repository with meaningful commits",
        explain:
          "A reviewer (and your future self) reads the history to understand how the project grew. Commit SMALL, COHERENT changes (one migration and its code, one endpoint and its tests), each leaving the build green; write messages that say what and why in the imperative (\"Enforce one active booking per slot with a partial unique index\"), optionally with a conventional prefix (feat:, fix:, test:, refactor:); never commit secrets, generated files or node_modules; and work on branches merged by pull request, so every change on main has passed CI and review.",
        decision: decide({
          scenario: "The capstone repository's history so far: \"initial commit\" (the whole MVP, 4,000 lines), \"fix\", \"more fixes\", \"wip\", and \"final version\". A hiring manager will read it.",
          question: "How should the rest of the project be committed?",
          right: ["Small commits, each a coherent change with its tests that leaves the build green, with imperative messages that say what and why, through pull requests", "History that explains the project."],
          wrong: [
            ["One commit at the end with everything", "Impossible to review or bisect."],
            ["A commit every 10 minutes with \"save\"", "Noise without meaning."],
            ["Rewrite all history into one perfect commit", "Loses the story of the work."],
          ],
          at: 0,
          aftermath: "Week 24's defense walks a reviewer through this history.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 155 · 22.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l155-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["22.P"],
    title: "Deliverable: A Working Backend MVP",
    subtitle: "Every primary journey, end to end",
    estimatedMinutes: 120,
    intro: "The MVP is complete when every primary journey in the stories works end to end. Two endpoints remain; then the checks walk the whole product, from login to the admin report.",
    atoms: [
      {
        id: "a-be-mvp",
        title: "A working MVP",
        explain:
          "An MVP is the smallest product that delivers the core value, complete along its primary journeys rather than broad and half-done. Demonstrate it as journeys, not endpoints: an instructor publishes, a student finds and books, cancels and rebooks, the session happens, attendance is recorded, an admin reads the week. Everything not on those journeys waits.",
        nodeLab: {
          task:
            "Write the last two modules and mount them in src/app.js. src/me.js: GET /me/bookings: for students their bookings, for instructors the bookings of their slots, newest slot first, as [{ id, slotId, studentId, status, startsAt }]. src/reports.js: GET /reports/weekly?week=<a Monday> (admins): per course with bookings for slots starting that week (Monday to Sunday, UTC), { courseCode, bookings, cancellations, noShows }, ordered by course code; counts only, never names.",
          db: OH_SQL,
          files: { ...PROJECT({ routers: ["auth", "slots", "bookings"] }), "src/me.js": "", "src/reports.js": "" },
          readOnly: ALL_RO.filter((p) => !["src/me.js", "src/reports.js", "src/app.js"].includes(p)),
          open: "src/me.js",
          solution: { "src/me.js": ME_JS, "src/reports.js": REPORTS_JS, "src/app.js": APP_JS() },
          tests: [
            { label: "Journey: publish, find, book, cancel, rebook", check: `${AS} ${AT} const ng = await as("ngozi"), ada = await as("ada"), bayo = await as("bayo"); const s = (await post("/slots", { courseId: 1, startsAt: at(3, 9) }, ng)).json?.data; assert(s?.id, "Ngozi publishes"); const found = await get("/instructors/1/slots?from=" + dayOf(3) + "&to=" + dayOf(3), ada); eq(found.json?.data?.map((x) => x.id), [s.id], "Ada finds it"); const b = (await post("/bookings", { slotId: s.id }, ada)).json?.data; eq(b?.status, "booked", "Ada books"); eq((await get("/instructors/1/slots?from=" + dayOf(3) + "&to=" + dayOf(3), bayo)).json?.data, [], "it disappears for Bayo"); eq((await del("/bookings/" + b.id, ada)).status, 204, "Ada cancels"); eq((await post("/bookings", { slotId: s.id }, bayo)).status, 201, "Bayo books the freed slot"); const mine = (await get("/me/bookings", ada)).json?.data; eq(mine?.map((x) => [x.slotId, x.status]), [[s.id, "cancelled"]], "Ada's history"); const ngs = (await get("/me/bookings", ng)).json?.data; eq(ngs?.map((x) => [x.studentId, x.status]), [[4, "booked"], [3, "cancelled"]], "Ngozi sees the bookings of her slot");` },
            { label: "My bookings: newest slot first, only mine", check: `${AS} ${AT} ${SLOT} for (const d of [2, 9, 5]) await post("/bookings", { slotId: await slotAt(1, 1, at(d, 9)) }, await as("ada")); await post("/bookings", { slotId: await slotAt(1, 1, at(4, 9)) }, await as("bayo")); const r = await get("/me/bookings", await as("ada")); eq(r.json?.data?.map((x) => x.startsAt), [at(9, 9), at(5, 9), at(3, 9), at(2, 9)], "newest slot first (with the cancelled booking from the first journey)"); eq(Object.keys(r.json.data[0]).sort(), ["id", "slotId", "startsAt", "status", "studentId"], "fields"); assert(r.json.data.every((x) => x.studentId === 3), "never anyone else's"); eq((await get("/me/bookings")).status, 401, "a session is required");` },
            { label: "Journey: the session happens; an admin reads the week", check: `${AS} ${SLOT} const monday = (() => { const d = new Date(Math.floor(now() / 86400000) * 86400000); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) - 7); return d.toISOString().slice(0, 10); })(); const day = (n, h) => new Date(Date.parse(monday) + n * 86400000 + h * 3600000).toISOString(); const be = [await slotAt(1, 1, day(0, 9)), await slotAt(1, 1, day(2, 9)), await slotAt(1, 1, day(6, 23))]; const db = await slotAt(2, 2, day(3, 9)); const outside = await slotAt(1, 1, day(7, 9)); await sql("INSERT INTO bookings (slot_id, student_id, status) VALUES ($1, 3, 'attended'), ($2, 4, 'no_show'), ($3, 3, 'cancelled'), ($4, 5, 'attended'), ($5, 3, 'attended')", [be[0], be[1], be[2], db, outside]); const r = await get("/reports/weekly?week=" + monday, await as("kemi")); eq(r.status, 200, "status (" + r.text + ")"); eq(r.json?.data, [{ courseCode: "BE-101", bookings: 3, cancellations: 1, noShows: 1 }, { courseCode: "DB-101", bookings: 1, cancellations: 0, noShows: 0 }], "last week, Monday to Sunday (the following Monday's slot is not included)"); assert(!/ada|bayo|obi/i.test(r.text), "counts only, never names"); eq((await get("/reports/weekly?week=" + monday, await as("ngozi"))).status, 403, "admins only");` },
          ],
          hint: "me.js: one SELECT joining bookings and slots, WHERE b.student_id = $1 for students or s.instructor_id = $1 for instructors, ORDER BY s.starts_at DESC. reports.js: Week.parse(req.query), then count(b.id) with FILTER (WHERE status = …) grouped by course, for slots with starts_at >= $1::date AND < $1::date + 7. Add both routers to src/app.js.",
          successMessage: "Office Hours works end to end: every primary journey in the stories, from publishing a slot to the admin's weekly report, runs on real data.",
        },
      },
    ],
    task: {
      title: "Week 22 deliverable: a working backend MVP of your capstone",
      intro: "Build your own project's core, following your Week 21 specification.",
      prompts: [
        "Set up the repository, CI, Docker Compose, migrations and an idempotent seed; commit in small, meaningful steps from the first day.",
        "Implement the primary journeys' endpoints exactly as in your contract, with authentication, the access matrix and zod validation.",
        "Enforce every cross-row business rule with a database constraint and map it to its error code in one error handler.",
        "Write tests for the core rules and journeys that fail when the rules break, and run them in CI.",
        "Checkpoint: demonstrate every primary user journey end to end on a backend whose tests pass.",
      ],
      closing: "Next: Week 23, hardening, documentation and deployment.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
