/**
 * BACKEND ENGINEERING · WEEK 23 · HARDENING, TESTING AND DEPLOYMENT
 *
 * Curriculum 23.1 – 23.P: the Office Hours MVP of Week 22 made ready for
 * real users. Integration and concurrency tests, an authorization test
 * matrix (both graded by breaking the app with BUG=… and expecting a test
 * to fail), a migration and demo seed, served API documentation,
 * environment configuration, the delivery pipeline, request logs and
 * health checks, a load test with correctness invariants, fixing the bugs
 * a regression suite finds, and release notes whose numbers are checked.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { pkg } from "./be-helpers.js";
import { AUTH_DOC, OPENAPI_YAML } from "./be-w21-system-design.js";
import {
  ALL_RO,
  APP_JS,
  AS,
  AT,
  BOOK,
  DB_URL,
  ENV,
  LESSONS as W22,
  ME_JS,
  OH_SQL,
  PROJECT,
  REPORTS_JS,
  SLOT,
  SLOTS_JS,
  BOOKINGS_JS,
} from "./be-w22-implementation.js";

export const SECTION_ID = "be-s23-hardening";
const MODULE = "be-w23-hardening";

const w22Lab = (id) => W22.flatMap((l) => l.atoms).find((a) => a.id === id).nodeLab;
const HELPERS_JS = w22Lab("a-be-mvp-tests").files["test/helpers.js"];
const BUG_JS = "/** For this exercise: BUG=<name> switches one rule off, to prove the tests notice. */\nexport const bug = (name) => process.env.BUG === name;\n";
const BUGGY_BOOKINGS = w22Lab("a-be-mvp-tests").files["src/bookings.js"];
const BUGGY_SLOTS = SLOTS_JS.replace('import { NewSlot, SlotRange } from "./validation.js";', 'import { bug } from "./bug.js";\nimport { NewSlot, SlotRange } from "./validation.js";')
  .replace('slotsRouter.post("/slots", requireUser, requireRole("instructor"), async', 'slotsRouter.post("/slots", requireUser, (req, res, next) => (bug("students-publish") ? next() : requireRole("instructor")(req, res, next)), async')
  .replace('if ((await memberRole(req.user.id, courseId)) !== "instructor")', 'if (!bug("students-publish") && (await memberRole(req.user.id, courseId)) !== "instructor")')
  .replace("AND NOT EXISTS (SELECT 1 FROM bookings b WHERE b.slot_id = s.id AND b.status <> 'cancelled')", "AND ($6 OR NOT EXISTS (SELECT 1 FROM bookings b WHERE b.slot_id = s.id AND b.status <> 'cancelled'))")
  .replace("[instructorId, from, to, req.user.role, req.user.id]", '[instructorId, from, to, req.user.role, req.user.id, bug("list-booked")]');
const BUGGY_REPORTS = REPORTS_JS.replace('import { Week } from "./validation.js";', 'import { bug } from "./bug.js";\nimport { Week } from "./validation.js";').replace('requireRole("admin")', 'requireRole(...(bug("report-open") ? ["admin", "instructor"] : ["admin"]))');
const BUGGY_ME = ME_JS.replace('import { pool } from "./db.js";', 'import { bug } from "./bug.js";\nimport { pool } from "./db.js";')
  .replace("WHERE ${column} = $1", "WHERE ($2 OR ${column} = $1)")
  .replace("[req.user.id]\n  );", '[req.user.id, bug("me-everyone")]\n  );');
const TEST_PROJECT = {
  ...PROJECT(),
  "src/bug.js": BUG_JS,
  "src/bookings.js": BUGGY_BOOKINGS,
  "src/slots.js": BUGGY_SLOTS,
  "src/reports.js": BUGGY_REPORTS,
  "src/me.js": BUGGY_ME,
  "test/helpers.js": HELPERS_JS,
};
const TEST_RO = [...ALL_RO, "src/bug.js", "test/helpers.js"];
const PASSES = (min) => ({
  label: `Your tests pass against the correct app (${min}+ tests)`,
  check: `const r = await runTests("npm test"); assert(r.length >= ${min}, "write at least ${min} tests: found " + r.length); eq(r.filter((t) => t.state === "fail").map((t) => t.name), [], "every test should pass against the correct app");`,
});
const CATCHES = (b, what) => ({ label: `They catch: ${what}`, check: `const r = await runTests("BUG=${b} npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=${b} (${what}) at least one of your tests must fail");` });
const YAML = `const YAML = await load("yaml"); const yamlOf = (p) => { const t = file(p); assert(t, p + " is missing"); return YAML.parse(t, { merge: true }) || {}; };`;

/* ── 23.9: the regression suite and the bugs it finds ─────────────────── */

const REGRESSION_TEST = `import { beforeEach, describe, expect, it } from "vitest";
import { login, noShow, resetDatabase, slot } from "./helpers.js";
import { pool } from "../src/db.js";

beforeEach(resetDatabase);
const day = (offset) => new Date(Date.now() + offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

describe("regressions reported by the pilot users", () => {
  it("#41 a slot on the last day of the range is listed", async () => {
    await slot({ startsInMinutes: 3 * 24 * 60 });
    const res = await (await login("ada")).get(\`/instructors/1/slots?from=\${day(1)}&to=\${day(3)}\`);
    expect(res.body.data).toHaveLength(1);
  });

  it("#42 cancelling 3 hours ahead is allowed", async () => {
    const ada = await login("ada");
    const booking = (await ada.post("/bookings").send({ slotId: await slot({ startsInMinutes: 3 * 60 }) })).body.data;
    expect((await ada.delete(\`/bookings/\${booking.id}\`)).status).toBe(204);
  });

  it("#43 cancelling 1 hour ahead is refused", async () => {
    const ada = await login("ada");
    const booking = (await ada.post("/bookings").send({ slotId: await slot({ startsInMinutes: 60 }) })).body.data;
    expect((await ada.delete(\`/bookings/\${booking.id}\`)).body.error.code).toBe("TOO_LATE_TO_CANCEL");
  });

  it("#44 cancelled bookings are not counted as no-shows", async () => {
    const id = await slot({ startsInMinutes: -2 * 24 * 60 });
    await pool.query("INSERT INTO bookings (slot_id, student_id, status) VALUES ($1, 3, 'cancelled')", [id]);
    const monday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
    const res = await (await login("kemi")).get(\`/reports/weekly?week=\${monday.toISOString().slice(0, 10)}\`);
    expect(res.body.data[0]).toMatchObject({ courseCode: "BE-101", bookings: 1, cancellations: 1, noShows: 0 });
  });

  it("#45 my bookings come newest first", async () => {
    const ada = await login("ada");
    for (const days of [2, 6, 4]) await ada.post("/bookings").send({ slotId: await slot({ startsInMinutes: days * 24 * 60 }) });
    const starts = (await ada.get("/me/bookings")).body.data.map((b) => b.startsAt);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  it("#46 a student blocked once is not blocked forever", async () => {
    await noShow({ student: 4, daysAgo: 40 });
    await noShow({ student: 4, daysAgo: 35 });
    const res = await (await login("bayo")).post("/bookings").send({ slotId: await slot({ startsInMinutes: 3 * 24 * 60 }) });
    expect(res.status).toBe(201);
  });
});
`;
const BROKEN = {
  "src/slots.js": SLOTS_JS.replace("s.starts_at < $3::date + 1", "s.starts_at < $3::date"),
  "src/bookings.js": BOOKINGS_JS(false)
    .replace("const HOUR = 60 * 60 * 1000;", "const HOUR = 60 * 60 * 1000;\nconst CANCEL_WINDOW = 2 * HOUR;")
    .replace("if (b.starts_at.getTime() - Date.now() < 2 * HOUR)", "if (Date.now() - b.starts_at.getTime() < CANCEL_WINDOW)")
    .replace("second + 14 * DAY > now.getTime()", "second + 14 * DAY > now.getTime() - 30 * DAY"),
  "src/reports.js": REPORTS_JS.replace("count(b.id) FILTER (WHERE b.status = 'no_show')::int AS \"noShows\"", "count(b.id) FILTER (WHERE b.status IN ('no_show', 'cancelled'))::int AS \"noShows\""),
  "src/me.js": ME_JS.replace("ORDER BY s.starts_at DESC, b.id DESC", "ORDER BY s.starts_at, b.id"),
};

/* ── 23.7: request logs and health ────────────────────────────────────── */

const OBSERVABILITY_JS = `import { randomUUID } from "node:crypto";
import { Router } from "express";
import { pool } from "./db.js";

const SAFE_ID = /^[A-Za-z0-9._-]{1,64}$/;

/** req.id from a safe incoming X-Request-Id, else a new UUID; echoed in the response. */
export function requestContext(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.id);
  next();
}

/** One JSON line per request: the route template (never the raw URL), status, duration, who. */
export function requestLog(req, res, next) {
  const start = performance.now();
  res.on("finish", () => {
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        level: res.statusCode >= 500 ? "error" : "info",
        msg: "request",
        requestId: req.id,
        method: req.method,
        route: req.route ? req.baseUrl + req.route.path : "unmatched",
        status: res.statusCode,
        ms: Math.round(performance.now() - start),
        userId: req.user?.id ?? null,
      })
    );
  });
  next();
}

function within(promise, ms) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => (timer = setTimeout(() => reject(new Error("timeout")), ms)))]).finally(() => clearTimeout(timer));
}

export const healthRouter = Router();
healthRouter.get("/health/live", (req, res) => res.set("Cache-Control", "no-store").json({ status: "ok" }));
healthRouter.get("/health/ready", async (req, res) => {
  let database = "up";
  try {
    await within(pool.query("SELECT 1"), 1000);
  } catch {
    database = "down";
  }
  res.set("Cache-Control", "no-store").status(database === "up" ? 200 : 503).json({ status: database === "up" ? "ready" : "unavailable", checks: { database } });
});
`;
const OBS_APP_JS = `import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./auth.js";
import { bookingsRouter } from "./bookings.js";
import { errorHandler, notFound } from "./errors.js";
import { meRouter } from "./me.js";
import { healthRouter, requestContext, requestLog } from "./observability.js";
import { reportsRouter } from "./reports.js";
import { slotsRouter } from "./slots.js";

export const app = express();
app.use(requestContext);
app.use(requestLog);
app.use(express.json());
app.use(cookieParser());
app.use(healthRouter);
app.use(authRouter);
app.use(slotsRouter);
app.use(bookingsRouter);
app.use(meRouter);
app.use(reportsRouter);
app.use(notFound);
app.use(errorHandler);
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 156 · 23.1 – 23.2 · INTEGRATION AND SECURITY TESTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l156-hardening-tests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["23.1", "23.2"],
    title: "Critical Integration Tests, and Security and Permission Checks",
    subtitle: "Proving the journeys and the walls",
    estimatedMinutes: 110,
    intro: "Week 22's tests protected individual rules. Hardening adds the tests that cross modules (whole journeys, and the race for one slot under real concurrency) and a test for every cell of the access matrix.",
    atoms: [
      {
        id: "a-be-hardening-integration",
        title: "Requirement: complete critical integration tests",
        explain:
          "Integration tests exercise the system as clients do: several requests in sequence across modules (publish, list, book, cancel, rebook, history), asserting what each step changes for the next. Add the CONCURRENCY test that a reviewer will ask about: many simultaneous bookings of one slot must produce exactly one success and only 409s for the rest, never a 500 and never two active bookings. These are slower than unit tests, so keep them few and focused on what would hurt most.",
        nodeLab: {
          task:
            "Write test/journeys.test.js (helpers given): (1) the booking journey: Ngozi publishes a slot through POST /slots; Ada finds it in GET /instructors/1/slots; Ada books; the slot disappears from Bayo's list; Ada cancels; Bayo books it; GET /me/bookings shows each their own. (2) Concurrency: 20 students (create them in the test: users with the seeded password hash, enrolled in BE-101) book the same slot at once with Promise.all: exactly one 201, nineteen 409 SLOT_TAKEN, no 5xx, and one active booking in the database. The checks also break the app in two ways.",
          command: false,
          db: OH_SQL,
          env: { DATABASE_URL: DB_URL },
          files: { ...TEST_PROJECT, "test/journeys.test.js": 'import request from "supertest";\nimport { beforeEach, describe, expect, it } from "vitest";\nimport { app } from "../src/app.js";\nimport { pool } from "../src/db.js";\nimport { login, resetDatabase, slot } from "./helpers.js";\n\nbeforeEach(resetDatabase);\n' },
          readOnly: TEST_RO,
          open: "test/journeys.test.js",
          solution: {
            "test/journeys.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";
import { login, resetDatabase, slot } from "./helpers.js";

beforeEach(resetDatabase);

const inDays = (n, hour) => {
  const d = new Date(Date.now() + n * 24 * 60 * 60 * 1000);
  d.setUTCHours(hour, 0, 0, 0);
  return d;
};

describe("the booking journey", () => {
  it("publish, find, book, cancel, rebook, history", async () => {
    const [ngozi, ada, bayo] = [await login("ngozi"), await login("ada"), await login("bayo")];
    const startsAt = inDays(3, 9).toISOString();
    const day = startsAt.slice(0, 10);
    const created = await ngozi.post("/slots").send({ courseId: 1, startsAt });
    expect(created.status).toBe(201);
    const slotId = created.body.data.id;

    const list = (who) => who.get(\`/instructors/1/slots?from=\${day}&to=\${day}\`);
    expect((await list(ada)).body.data.map((s) => s.id)).toEqual([slotId]);

    const booking = await ada.post("/bookings").send({ slotId });
    expect(booking.status).toBe(201);
    expect((await list(bayo)).body.data).toEqual([]);

    expect((await ada.delete(\`/bookings/\${booking.body.data.id}\`)).status).toBe(204);
    expect((await bayo.post("/bookings").send({ slotId })).status).toBe(201);

    expect((await ada.get("/me/bookings")).body.data.map((b) => b.status)).toEqual(["cancelled"]);
    expect((await bayo.get("/me/bookings")).body.data.map((b) => b.status)).toEqual(["booked"]);
  });
});

describe("the race for one slot", () => {
  it("20 simultaneous bookings: exactly one wins", async () => {
    const { rows: [ada] } = await pool.query("SELECT password_hash FROM users WHERE email = 'ada@example.com'");
    const names = Array.from({ length: 20 }, (_, i) => \`racer\${i}\`);
    for (const name of names) {
      const { rows } = await pool.query("INSERT INTO users (email, full_name, role, password_hash) VALUES ($1, $2, 'student', $3) RETURNING id", [\`\${name}@example.com\`, name, ada.password_hash]);
      await pool.query("INSERT INTO course_members (course_id, user_id, role) VALUES (1, $1, 'student')", [rows[0].id]);
    }
    const students = await Promise.all(names.map((n) => login(n)));
    const slotId = await slot({ startsInMinutes: 3 * 24 * 60 });

    const results = await Promise.all(students.map((s) => s.post("/bookings").send({ slotId })));
    const statuses = results.map((r) => r.status);
    expect(statuses.filter((s) => s === 201)).toHaveLength(1);
    expect(statuses.filter((s) => s === 409)).toHaveLength(19);
    expect(results.filter((r) => r.status === 409).every((r) => r.body.error.code === "SLOT_TAKEN")).toBe(true);
    const { rows } = await pool.query("SELECT count(*)::int AS n FROM bookings WHERE slot_id = $1 AND status <> 'cancelled'", [slotId]);
    expect(rows[0].n).toBe(1);
  }, 60_000);
});

void request;
void app;
`,
          },
          tests: [PASSES(2), CATCHES("double-book", "a booked slot can be booked again"), CATCHES("list-booked", "booked slots are still offered"), CATCHES("me-everyone", "students see bookings that are not theirs")],
          hint: "Use login(name) for each actor and chain the steps, asserting after each. For the race, insert the 20 users with the seeded password_hash and BE-101 memberships, log them all in, then Promise.all their POST /bookings and count the statuses.",
          successMessage: "The main journey and the Monday race are now proven end to end, through every module, on every change.",
        },
      },
      {
        id: "a-be-hardening-authz",
        title: "Requirement: security and permission checks",
        explain:
          "Turn AUTH.md's access matrix into ONE data-driven test: a table of cases (operation, caller, expected status), one row per cell, run with it.each. Include anonymous callers (401), wrong roles (403) and other people's records (404). A new endpoint or role then means new rows, and any permission that silently widens fails the build. Add the other checks from the threat model: cookie flags, identical login failures.",
        nodeLab: {
          task:
            "Write test/authz.test.js: an it.each table covering every operation of the contract for anonymous, ada (student), ngozi (instructor of BE-101) and kemi (admin), with the expected status from AUTH.md's matrix (use a future BE-101 slot, a booking of Ada's, and a finished booking on Ngozi's slot as fixtures, created before each test). At least 20 cases, and they must include: anonymous → 401 everywhere except POST /auth/login; students cannot publish slots or read the report; instructors cannot read the report or book; Bayo cannot cancel Ada's booking (404); Tunde cannot mark attendance on Ngozi's slot (403).",
          command: false,
          db: OH_SQL,
          env: { DATABASE_URL: DB_URL },
          files: { ...TEST_PROJECT, "AUTH.md": w22Lab("a-be-mvp-endpoints") ? "# See Week 21's AUTH.md (access matrix).\n" : "", "test/authz.test.js": 'import { beforeEach, describe, expect, it } from "vitest";\nimport request from "supertest";\nimport { app } from "../src/app.js";\nimport { pool } from "../src/db.js";\nimport { login, resetDatabase, slot } from "./helpers.js";\n\nbeforeEach(resetDatabase);\n' },
          readOnly: [...TEST_RO, "AUTH.md"],
          open: "test/authz.test.js",
          solution: {
            "test/authz.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";
import { login, resetDatabase, slot } from "./helpers.js";

let ids;
beforeEach(async () => {
  await resetDatabase();
  const future = await slot({ startsInMinutes: 5 * 24 * 60 });
  const other = await slot({ startsInMinutes: 6 * 24 * 60 });
  const past = await slot({ startsInMinutes: -2 * 24 * 60 });
  const adaBooking = (await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, 3) RETURNING id", [other])).rows[0].id;
  const finished = (await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, 3) RETURNING id", [past])).rows[0].id;
  ids = { future, adaBooking, finished };
});

const monday = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};
const inDays = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const startsAt = () => {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  d.setUTCHours(10, 0, 0, 0);
  return d.toISOString();
};

/** [operation, who, expected status]; who is null for an anonymous caller. */
const OPERATIONS = {
  "GET /instructors/1/slots": (c) => c.get(\`/instructors/1/slots?from=\${inDays(1)}&to=\${inDays(10)}\`),
  "POST /slots": (c) => c.post("/slots").send({ courseId: 1, startsAt: startsAt() }),
  "POST /bookings": (c) => c.post("/bookings").send({ slotId: ids.future }),
  "DELETE /bookings/:ada": (c) => c.delete(\`/bookings/\${ids.adaBooking}\`),
  "PATCH /bookings/:finished": (c) => c.patch(\`/bookings/\${ids.finished}\`).send({ status: "attended" }),
  "GET /me/bookings": (c) => c.get("/me/bookings"),
  "GET /reports/weekly": (c) => c.get(\`/reports/weekly?week=\${monday()}\`),
};

const CASES = [
  ...Object.keys(OPERATIONS).map((op) => [op, null, 401]),
  ["GET /instructors/1/slots", "ada", 200],
  ["GET /instructors/1/slots", "ngozi", 200],
  ["GET /instructors/1/slots", "kemi", 200],
  ["POST /slots", "ada", 403],
  ["POST /slots", "ngozi", 201],
  ["POST /slots", "tunde", 403],
  ["POST /slots", "kemi", 403],
  ["POST /bookings", "ada", 201],
  ["POST /bookings", "ngozi", 403],
  ["POST /bookings", "kemi", 403],
  ["POST /bookings", "chi", 403],
  ["DELETE /bookings/:ada", "ada", 204],
  ["DELETE /bookings/:ada", "bayo", 404],
  ["DELETE /bookings/:ada", "ngozi", 404],
  ["PATCH /bookings/:finished", "ngozi", 200],
  ["PATCH /bookings/:finished", "tunde", 403],
  ["PATCH /bookings/:finished", "ada", 403],
  ["PATCH /bookings/:finished", "kemi", 403],
  ["GET /me/bookings", "ada", 200],
  ["GET /reports/weekly", "ada", 403],
  ["GET /reports/weekly", "ngozi", 403],
  ["GET /reports/weekly", "kemi", 200],
];

describe("the access matrix", () => {
  it.each(CASES)("%s as %s → %i", async (op, who, status) => {
    const client = who ? await login(who) : { get: (p) => request(app).get(p), post: (p) => request(app).post(p), patch: (p) => request(app).patch(p), delete: (p) => request(app).delete(p) };
    expect((await OPERATIONS[op](client)).status).toBe(status);
  });

  it("students only ever see their own bookings", async () => {
    await pool.query("INSERT INTO bookings (slot_id, student_id) VALUES ($1, 4)", [ids.future]);
    const mine = (await (await login("ada")).get("/me/bookings")).body.data;
    expect(mine.every((b) => b.studentId === 3)).toBe(true);
  });
});
`,
          },
          tests: [
            PASSES(20),
            CATCHES("students-publish", "students can publish slots"),
            CATCHES("report-open", "instructors can read the admin report"),
            CATCHES("any-instructor", "any instructor can mark attendance"),
            CATCHES("me-everyone", "students see bookings that are not theirs"),
            { label: "The table is data-driven", check: `has(file("test/authz.test.js") || "", "it.each(", "drive the cases from a table with it.each");` },
          ],
          hint: "Map each operation name to a function that sends it with a given client, and keep a CASES array of [operation, who, status]. For anonymous calls, use request(app) directly. Create the fixtures in beforeEach after resetDatabase().",
          successMessage: "Every cell of the access matrix is now a test, and widening any permission breaks the build.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 157 · 23.3 – 23.5 · MIGRATIONS, DOCS, CONFIGURATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l157-hardening-ops",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["23.3", "23.4", "23.5"],
    title: "Migrations and Seed Scripts, API Documentation and Environment Configuration",
    subtitle: "What another developer needs on day one",
    estimatedMinutes: 110,
    intro: "Hardening is also making the project usable by people who did not build it: the schema evolves by migrations, a demo dataset appears with one command, the API documents itself, and every environment is configured explicitly.",
    atoms: [
      {
        id: "a-be-hardening-migrations",
        title: "Requirement: database migrations and seed scripts",
        explain:
          "Every schema change after the first release is a new, numbered migration, never an edit to an old one (the old one has already run in production). Reminders need a column and an index that finds due bookings fast: a PARTIAL index on exactly the rows the reminder scan reads. A DEMO seed creates realistic data for local runs and demos, relative to today (next week's slots), and is idempotent like the base seed.",
        nodeLab: {
          task:
            "Write migrations/003_reminders.sql: add bookings.reminded_at (timestamptz, nullable) and a partial index bookings_reminder_due on bookings (slot_id) WHERE status = 'booked' AND reminded_at IS NULL. Then seed-demo.js: for each instructor and course they teach (course_members), create slots next week (Monday to Friday, UTC) at 09:00, 09:30 and 10:00, idempotently (ON CONFLICT ON CONSTRAINT slots_one_per_start DO NOTHING), and print how many it created. The database already has migrations 001 and 002 (see schema_migrations).",
          command: false,
          db: `${OH_SQL}CREATE TABLE schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());\nINSERT INTO schema_migrations (name) VALUES ('001_schema.sql'), ('002_sessions_and_audit.sql');\n`,
          files: {
            "package.json": pkg({ name: "office-hours", scripts: { migrate: "node --env-file=.env migrate.js", "seed:demo": "node --env-file=.env seed-demo.js" }, deps: ["pg"] }),
            ".env": ENV,
            "migrate.js": w22Lab("a-be-mvp-database").files["migrate.js"],
            "migrations/001_schema.sql": "-- applied (see Week 22)\n",
            "migrations/002_sessions_and_audit.sql": "-- applied (see Week 22)\n",
            "migrations/003_reminders.sql": "",
            "seed-demo.js": "import pg from \"pg\";\n\n// Next week's demo slots for every instructor.\n",
          },
          readOnly: ["package.json", ".env", "migrate.js", "migrations/001_schema.sql", "migrations/002_sessions_and_audit.sql"],
          open: "migrations/003_reminders.sql",
          solution: {
            "migrations/003_reminders.sql": "-- Reminders: when each booking was reminded, and a small index of the bookings still to remind.\nALTER TABLE bookings ADD COLUMN reminded_at timestamptz;\nCREATE INDEX bookings_reminder_due ON bookings (slot_id) WHERE status = 'booked' AND reminded_at IS NULL;\n",
            "seed-demo.js": `import pg from "pg";

// Next week's demo slots for every instructor: Monday to Friday, 09:00, 09:30 and 10:00 UTC.
const DAY = 24 * 60 * 60 * 1000;
const today = new Date(Math.floor(Date.now() / DAY) * DAY);
const nextMonday = new Date(today.getTime() + ((8 - today.getUTCDay()) % 7 || 7) * DAY);

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rows: teaching } = await client.query("SELECT user_id, course_id FROM course_members WHERE role = 'instructor' ORDER BY user_id");
  let created = 0;
  for (const { user_id: instructor, course_id: course } of teaching) {
    for (let d = 0; d < 5; d++) {
      for (const minutes of [9 * 60, 9 * 60 + 30, 10 * 60]) {
        const starts = new Date(nextMonday.getTime() + d * DAY + minutes * 60 * 1000);
        const r = await client.query(
          "INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES ($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT slots_one_per_start DO NOTHING",
          [instructor, course, starts, new Date(starts.getTime() + 20 * 60 * 1000)]
        );
        created += r.rowCount;
      }
    }
  }
  console.log(\`created \${created} demo slots\`);
} finally {
  await client.end();
}
`,
          },
          tests: [
            { label: "The migration runs once, after the others", check: `await run("npm run migrate"); has(stdout(), "applied 003_reminders.sql", "your migration runs"); lacks(stdout(), "applied 001", "001 and 002 are recorded as applied and do not run again"); eq((await sql("SELECT name FROM schema_migrations ORDER BY name")).map((r) => r.name).at(-1), "003_reminders.sql", "recorded"); const col = await sql("SELECT data_type, is_nullable FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'reminded_at'"); eq(col[0], { data_type: "timestamp with time zone", is_nullable: "YES" }, "bookings.reminded_at"); const idx = await sql("SELECT indexdef FROM pg_indexes WHERE indexname = 'bookings_reminder_due'"); assert(idx[0] && /\\(slot_id\\) WHERE/.test(idx[0].indexdef) && /reminded_at IS NULL/.test(idx[0].indexdef) && /'booked'/.test(idx[0].indexdef), "a partial index on bookings (slot_id) WHERE status = 'booked' AND reminded_at IS NULL (" + (idx[0]?.indexdef || "missing") + ")");` },
            { label: "Demo slots for next week, idempotently", check: `await run("npm run seed:demo"); eq(stdout().trim().split("\\n").pop(), "created 30 demo slots", "2 instructors × 5 days × 3 slots"); const rows = await sql("SELECT instructor_id, course_id, starts_at FROM slots ORDER BY instructor_id, starts_at"); const DAY = 86400000; const today = Math.floor(now() / DAY) * DAY; const monday = today + (((8 - new Date(today).getUTCDay()) % 7) || 7) * DAY; eq(rows[0].starts_at.toISOString(), new Date(monday + 9 * 3600000).toISOString(), "the first slot: next Monday 09:00 UTC"); eq(rows.at(-1).starts_at.toISOString(), new Date(monday + 4 * DAY + 10 * 3600000).toISOString(), "the last: Friday 10:00"); eq([...new Set(rows.map((r) => r.instructor_id + "/" + r.course_id))], ["1/1", "2/2"], "each instructor's own course"); await run("npm run seed:demo"); eq(stdout().trim().split("\\n").pop(), "created 0 demo slots", "running it again creates nothing");` },
          ],
          hint: "ALTER TABLE bookings ADD COLUMN reminded_at timestamptz; CREATE INDEX … ON bookings (slot_id) WHERE …. In seed-demo.js, next Monday is today + ((8 − weekday) % 7 || 7) days; loop over the instructors' memberships, 5 days and 3 times, and add up rowCount.",
          successMessage: "The schema grows by a reviewed migration, and anyone can get a realistic demo week with one idempotent command.",
        },
      },
      {
        id: "a-be-hardening-docs",
        title: "Requirement: API documentation",
        explain:
          "Documentation that lives next to the code stays true: serve the OpenAPI file itself (GET /openapi.yaml) and a rendered reference (GET /docs, an HTML page that loads Redoc or Swagger UI and points it at that file), both public and cacheable for a short time. The README gets a developer from clone to running tests: what the project is, prerequisites, setup commands, environment variables, how to run and test, and where the API docs are.",
        nodeLab: {
          task:
            "Add src/docs.js with docsRouter (mounted in src/app.js, before the other routers): GET /openapi.yaml serves openapi.yaml with Content-Type application/yaml; GET /docs serves an HTML page titled \"Office Hours API\" that loads https://cdn.jsdelivr.net/npm/redoc@2.5.0/bundles/redoc.standalone.js and renders <redoc spec-url=\"/openapi.yaml\">; both public, with Cache-Control: public, max-age=300. Then write README.md with the sections ## Getting started (the commands), ## Environment variables (each with its meaning), ## Running the tests and ## API documentation (the /docs link).",
          db: OH_SQL,
          files: { ...PROJECT(), "openapi.yaml": OPENAPI_YAML, "src/docs.js": 'import { readFileSync } from "node:fs";\nimport { Router } from "express";\n\nexport const docsRouter = Router();\n', "README.md": "# Office Hours API\n" },
          readOnly: [...ALL_RO.filter((p) => p !== "src/app.js"), "openapi.yaml"],
          open: "src/docs.js",
          solution: {
            "src/docs.js": `import { readFileSync } from "node:fs";
import { Router } from "express";

export const docsRouter = Router();
const spec = readFileSync("openapi.yaml", "utf8");
const page = \`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Office Hours API</title>
  </head>
  <body>
    <redoc spec-url="/openapi.yaml"></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.5.0/bundles/redoc.standalone.js"></script>
  </body>
</html>
\`;

docsRouter.get("/openapi.yaml", (req, res) => res.set("Cache-Control", "public, max-age=300").type("application/yaml").send(spec));
docsRouter.get("/docs", (req, res) => res.set("Cache-Control", "public, max-age=300").type("html").send(page));
`,
            "src/app.js": APP_JS(["docs", "auth", "slots", "bookings", "me", "reports"]),
            "README.md": `# Office Hours API

Students book 20-minute office-hour slots with their instructors; instructors publish slots and record attendance; admins read a weekly report.

## Getting started

Requires Node.js 24 and Docker.

\`\`\`sh
git clone https://github.com/academy/office-hours.git
cd office-hours
cp .env.example .env
docker compose up -d db redis
npm ci
npm run migrate
npm run seed && npm run seed:demo
npm start            # http://localhost:3000
\`\`\`

## Environment variables

| Variable | Meaning |
| --- | --- |
| DATABASE_URL | PostgreSQL connection string |
| PORT | The port to listen on (default 3000) |
| NODE_ENV | development, test or production |
| COOKIE_SECURE | Whether the session cookie is sent over HTTPS only (true in production) |
| CORS_ORIGIN | The web app's origin, allowed to call the API with credentials |
| LOG_LEVEL | debug, info, warn or error |

## Running the tests

\`\`\`sh
npm test            # unit, integration and authorization tests (needs DATABASE_URL to a test database)
\`\`\`

The tests reset their own data before each test; never point DATABASE_URL at production.

## API documentation

Run the API and open http://localhost:3000/docs for the reference (rendered from openapi.yaml, also served at /openapi.yaml).
`,
          },
          tests: [
            { label: "GET /openapi.yaml serves the contract", check: `const r = await get("/openapi.yaml"); eq(r.status, 200, "status (it must be public: no session needed)"); has(r.headers["content-type"] || "", "application/yaml", "Content-Type"); eq(r.text, file("openapi.yaml"), "exactly the file"); eq(r.headers["cache-control"], "public, max-age=300", "Cache-Control");` },
            { label: "GET /docs renders it with Redoc", check: `const r = await get("/docs"); eq(r.status, 200, "status"); has(r.headers["content-type"] || "", "text/html", "an HTML page"); has(r.text, "<title>Office Hours API</title>", "the title"); has(r.text, "https://cdn.jsdelivr.net/npm/redoc@2.5.0/bundles/redoc.standalone.js", "loads Redoc 2.5.0 (a pinned version)"); assert(/<redoc[^>]*spec-url="\\/openapi\\.yaml"/.test(r.text), "<redoc spec-url=\\"/openapi.yaml\\">"); eq(r.headers["cache-control"], "public, max-age=300", "Cache-Control");` },
            { label: "The README gets a newcomer running", check: `const md = file("README.md") || ""; const gs = section(md, "Getting started"); for (const c of ["npm ci", "npm run migrate", "npm start"]) has(gs, c, "## Getting started: " + c); const env = section(md, "Environment variables"); for (const v of ["DATABASE_URL", "PORT", "NODE_ENV"]) has(env, v, "## Environment variables: " + v); has(section(md, "Running the tests"), "npm test", "## Running the tests: npm test"); has(section(md, "API documentation"), "/docs", "## API documentation: the /docs link");` },
          ],
          hint: "readFileSync(\"openapi.yaml\", \"utf8\") once at start-up; res.type(\"application/yaml\").send(spec). The page is a small HTML string with <redoc spec-url=\"/openapi.yaml\"></redoc> and the script tag. Add \"docs\" first in src/app.js.",
          successMessage: "The contract is now served by the API itself and readable at /docs, and the README takes a newcomer from clone to running tests.",
        },
      },
      {
        id: "a-be-hardening-config",
        title: "Requirement: environment-specific configuration",
        explain:
          "Week 19's configuration loader, applied to Office Hours: what differs by environment is explicit and validated at start-up. Production refuses to start without a database URL, an HTTPS web origin for CORS, and secure cookies; development runs with sensible defaults; tests use their own database. Code reads config, never process.env directly, so every setting is listed in one place.",
        nodeLab: {
          task:
            "Write loadConfig(env) in src/config.js returning { env, port, databaseUrl, cookieSecure, corsOrigin, sessionDays, logLevel }. NODE_ENV development (default), test or production. PORT a number (default 3000). DATABASE_URL: required in production; defaults postgresql://localhost:5432/office_hours_dev (development) and …_test (test). COOKIE_SECURE: \"true\"/\"false\"; default true in production, false otherwise; in production it cannot be false. CORS_ORIGIN: required in production and must start with https://; default http://localhost:5173 otherwise. SESSION_DAYS a whole number 1–30 (default 7). LOG_LEVEL default debug, warn, info by environment. Throw one Error \"Invalid configuration: \" + every problem joined with \"; \".",
          command: false,
          files: { "package.json": pkg({ name: "office-hours", deps: [] }), "src/config.js": "export function loadConfig(env) {\n  return {};\n}\n" },
          readOnly: ["package.json"],
          open: "src/config.js",
          solution: {
            "src/config.js": `const ENVS = ["development", "test", "production"];
const LOG = { development: "debug", test: "warn", production: "info" };

/** The application's configuration, validated, from an environment object (process.env). */
export function loadConfig(env) {
  const problems = [];
  const name = env.NODE_ENV ?? "development";
  if (!ENVS.includes(name)) problems.push(\`NODE_ENV must be one of \${ENVS.join(", ")}\`);
  const prod = name === "production";

  const port = env.PORT === undefined ? 3000 : Number(env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) problems.push("PORT must be a whole number from 1 to 65535");

  const databaseUrl = env.DATABASE_URL ?? (prod ? undefined : \`postgresql://localhost:5432/office_hours_\${name === "test" ? "test" : "dev"}\`);
  if (!databaseUrl) problems.push("DATABASE_URL is required");

  let cookieSecure = prod;
  if (env.COOKIE_SECURE !== undefined) {
    if (!["true", "false"].includes(env.COOKIE_SECURE)) problems.push("COOKIE_SECURE must be true or false");
    else cookieSecure = env.COOKIE_SECURE === "true";
  }
  if (prod && !cookieSecure) problems.push("COOKIE_SECURE cannot be false in production");

  const corsOrigin = env.CORS_ORIGIN ?? (prod ? undefined : "http://localhost:5173");
  if (!corsOrigin) problems.push("CORS_ORIGIN is required");
  else if (prod && !corsOrigin.startsWith("https://")) problems.push("CORS_ORIGIN must be an https:// origin in production");

  const sessionDays = env.SESSION_DAYS === undefined ? 7 : Number(env.SESSION_DAYS);
  if (!Number.isInteger(sessionDays) || sessionDays < 1 || sessionDays > 30) problems.push("SESSION_DAYS must be a whole number from 1 to 30");

  if (problems.length) throw new Error(\`Invalid configuration: \${problems.join("; ")}\`);
  return { env: name, port, databaseUrl, cookieSecure, corsOrigin, sessionDays, logLevel: env.LOG_LEVEL ?? LOG[name] };
}
`,
          },
          tests: [
            { label: "Development and test defaults", check: `const { loadConfig } = await load("src/config.js"); eq(loadConfig({}), { env: "development", port: 3000, databaseUrl: "postgresql://localhost:5432/office_hours_dev", cookieSecure: false, corsOrigin: "http://localhost:5173", sessionDays: 7, logLevel: "debug" }, "loadConfig({})"); const t = loadConfig({ NODE_ENV: "test" }); eq([t.databaseUrl, t.logLevel], ["postgresql://localhost:5432/office_hours_test", "warn"], "test");` },
            { label: "Production: required, secure, https", check: `const { loadConfig } = await load("src/config.js"); const msg = (e) => { try { loadConfig(e); return null; } catch (x) { return x.message; } }; eq(msg({ NODE_ENV: "production" }), "Invalid configuration: DATABASE_URL is required; CORS_ORIGIN is required", "nothing set"); const base = { NODE_ENV: "production", DATABASE_URL: "postgresql://db/office_hours", CORS_ORIGIN: "https://academy.example" }; const ok = loadConfig(base); eq([ok.cookieSecure, ok.logLevel, ok.sessionDays], [true, "info", 7], "production defaults"); eq(msg({ ...base, COOKIE_SECURE: "false" }), "Invalid configuration: COOKIE_SECURE cannot be false in production", "insecure cookies"); eq(msg({ ...base, CORS_ORIGIN: "http://academy.example" }), "Invalid configuration: CORS_ORIGIN must be an https:// origin in production", "an http origin");` },
            { label: "Bad values are listed together", check: `const { loadConfig } = await load("src/config.js"); const msg = (e) => { try { loadConfig(e); return null; } catch (x) { return x.message; } }; eq(msg({ PORT: "eighty", COOKIE_SECURE: "yes", SESSION_DAYS: "90" }), "Invalid configuration: PORT must be a whole number from 1 to 65535; COOKIE_SECURE must be true or false; SESSION_DAYS must be a whole number from 1 to 30", "three problems in one message"); eq(loadConfig({ COOKIE_SECURE: "true", SESSION_DAYS: "14", LOG_LEVEL: "error" }).cookieSecure, true, "COOKIE_SECURE=true in development"); eq(msg({ NODE_ENV: "staging" }), "Invalid configuration: NODE_ENV must be one of development, test, production", "an unknown environment");` },
          ],
          hint: "Collect problems in order (NODE_ENV, PORT, DATABASE_URL, COOKIE_SECURE, CORS_ORIGIN, SESSION_DAYS) and throw once. Defaults depend on prod = name === \"production\".",
          successMessage: "Every setting Office Hours depends on is listed, defaulted and validated in one place, and production cannot start insecure.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 158 · 23.6 – 23.7 · PIPELINE, LOGS AND HEALTH
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l158-hardening-delivery",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["23.6", "23.7"],
    title: "A Deployment Pipeline, Logging and Health Checks",
    subtitle: "Shipping it, and seeing it run",
    estimatedMinutes: 100,
    intro: "Weeks 16 and 19 built these pieces in isolation; here they are fitted to Office Hours: a pipeline that tests against a migrated, seeded database and deploys behind a smoke test, and an app that logs every request and reports its health.",
    atoms: [
      {
        id: "a-be-hardening-pipeline",
        title: "Requirement: a deployment pipeline",
        explain:
          "The capstone's pipeline: on every pull request and push, a test job with a PostgreSQL service that runs the migrations, the seed and the full test suite (as CI must exercise the same migration path as production); on main, a build job that pushes an image tagged with the commit; and a deploy job behind the production environment that deploys that tag and smoke-tests the live readiness endpoint and documentation page.",
        nodeLab: {
          task:
            "Write .github/workflows/delivery.yml: on pull_request and push to main. Job test: ubuntu-latest; a postgres:18 service with a pg_isready health check; DATABASE_URL in the job env; steps checkout, setup-node 24 with the npm cache, npm ci, npm run migrate, npm run seed, npm test (in that order). Job build: needs test, only on push to main, permissions contents read and packages write, logs in to ghcr.io and pushes ghcr.io/${{ github.repository }}:${{ github.sha }} with docker/build-push-action. Job deploy: needs build, environment production, runs ./scripts/deploy.sh ${{ github.sha }}, then smoke-tests with curl --fail https://office-hours.academy.example/health/ready and …/docs.",
          command: false,
          files: { "package.json": pkg({ name: "office-hours", deps: ["yaml"] }), ".github/workflows/delivery.yml": "name: Delivery\n" },
          readOnly: ["package.json"],
          open: ".github/workflows/delivery.yml",
          solution: {
            ".github/workflows/delivery.yml": `name: Delivery

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: office_hours_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/office_hours_test
      NODE_ENV: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run migrate
      - run: npm run seed
      - run: npm test

  build:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh \${{ github.sha }}
      - name: Smoke test
        run: |
          curl --fail --retry 5 --retry-delay 5 https://office-hours.academy.example/health/ready
          curl --fail https://office-hours.academy.example/docs
`,
          },
          tests: [
            { label: "test: a migrated, seeded database, then the suite", check: `${YAML} const w = yamlOf(".github/workflows/delivery.yml"); const on = w.on ?? w[true]; assert(on && "pull_request" in on && [].concat(on.push?.branches || []).includes("main"), "on pull_request and push to main"); const t = w.jobs?.test; const pg = t?.services?.postgres; assert(pg && /^postgres:18/.test(pg.image) && /pg_isready/.test(String(pg.options || "")), "a postgres:18 service with pg_isready"); assert(t.env?.DATABASE_URL, "DATABASE_URL in the job env"); const runs = (t.steps || []).map((s) => s.run).filter(Boolean); eq(runs, ["npm ci", "npm run migrate", "npm run seed", "npm test"], "the steps, in order (the same migration path as production)"); const node = (t.steps || []).find((s) => /^actions\\/setup-node@/.test(s.uses || "")); eq([String(node?.with?.["node-version"]), node?.with?.cache], ["24", "npm"], "Node 24 with the npm cache");` },
            { label: "build: only from main, a SHA-tagged image", check: `${YAML} const b = yamlOf(".github/workflows/delivery.yml").jobs?.build; eq([].concat(b?.needs || []), ["test"], "needs: test"); const c = String(b?.if || ""); assert(/refs\\/heads\\/main/.test(c) && /event_name == 'push'/.test(c), "only on push to main"); eq([b?.permissions?.contents, b?.permissions?.packages], ["read", "write"], "permissions"); assert((b?.steps || []).some((s) => /^docker\\/login-action@/.test(s.uses || "") && s.with?.registry === "ghcr.io"), "log in to ghcr.io"); const p = (b?.steps || []).find((s) => /^docker\\/build-push-action@/.test(s.uses || "")); has(String(p?.with?.tags || ""), ":\${{ github.sha }}", "tag with the commit SHA"); eq(String(p?.with?.push), "true", "push: true");` },
            { label: "deploy: the built tag, then a smoke test", check: `${YAML} const d = yamlOf(".github/workflows/delivery.yml").jobs?.deploy; eq([].concat(d?.needs || []), ["build"], "needs: build"); eq(typeof d?.environment === "object" ? d.environment.name : d?.environment, "production", "environment: production"); const steps = d?.steps || []; const dep = steps.findIndex((s) => /\\.\\/scripts\\/deploy\\.sh \\$\\{\\{ github\\.sha \\}\\}/.test(s.run || "")); assert(dep >= 0, "./scripts/deploy.sh \${{ github.sha }}"); const smoke = steps.slice(dep + 1).map((s) => s.run || "").join("\\n"); assert(/curl --fail[^\\n]*https:\\/\\/office-hours\\.academy\\.example\\/health\\/ready/.test(smoke), "after deploying: curl --fail …/health/ready"); assert(/curl --fail[^\\n]*https:\\/\\/office-hours\\.academy\\.example\\/docs/.test(smoke), "and …/docs");` },
          ],
          hint: "Week 19's pipeline with two extra test steps (npm run migrate, npm run seed) before npm test, and a smoke-test step with two curl --fail lines after the deploy.",
          successMessage: "Every change to Office Hours is now tested against a database built the production way, and every deploy proves itself live.",
        },
      },
      {
        id: "a-be-hardening-observability",
        title: "Requirement: logging and health checks",
        explain:
          "Fit Week 16 and 20's observability to the app: a request id on every response, one JSON log line per request with the route TEMPLATE (never the raw URL with its ids), status, duration, request id and user id (never names, emails or tokens), and the two health endpoints, live without dependencies and ready with a bounded database check. These are what the pipeline's smoke test and the platform's probes will call.",
        nodeLab: {
          task:
            "Write src/observability.js (src/app.js already uses it): requestContext (req.id from a safe X-Request-Id, else a UUID; X-Request-Id on the response); requestLog (on finish, one JSON line: time, level (error for 5xx, else info), msg \"request\", requestId, method, route (req.baseUrl + req.route.path, or \"unmatched\"), status, ms, userId (req.user's id or null)); and healthRouter with GET /health/live ({ status: \"ok\" }) and GET /health/ready (SELECT 1 within 1 second: 200 { status: \"ready\", checks: { database: \"up\" } } or 503 with \"unavailable\" and \"down\"), both Cache-Control: no-store.",
          db: OH_SQL,
          files: { ...PROJECT(), "src/app.js": OBS_APP_JS, "src/observability.js": 'import { randomUUID } from "node:crypto";\nimport { Router } from "express";\nimport { pool } from "./db.js";\n\nexport const requestContext = (req, res, next) => next();\nexport const requestLog = (req, res, next) => next();\nexport const healthRouter = Router();\n' },
          readOnly: [...ALL_RO],
          open: "src/observability.js",
          solution: { "src/observability.js": OBSERVABILITY_JS },
          tests: [
            { label: "Request ids", check: `const r = await get("/health/live"); assert(/^[0-9a-f-]{36}$/.test(r.headers["x-request-id"] || ""), "a UUID X-Request-Id"); eq((await get("/health/live", { headers: { "X-Request-Id": "lb-91.a" } })).headers["x-request-id"], "lb-91.a", "a safe incoming id is kept"); assert(/^[0-9a-f-]{36}$/.test((await get("/health/live", { headers: { "X-Request-Id": "bad id!" } })).headers["x-request-id"]), "an unsafe one is replaced");` },
            { label: "One JSON line per request, with the route template and the user", check: `${AS} await get("/instructors/1/slots?from=2026-01-01&to=2026-01-02", await as("ada")); await get("/nope", { headers: { "X-Request-Id": "rq-404" } }); const lines = stdout().split("\\n").filter((l) => l.startsWith("{")).map((l) => JSON.parse(l)).filter((l) => l.msg === "request"); const list = lines.find((l) => l.route === "/instructors/:id/slots"); assert(list, "a request line with route /instructors/:id/slots (the template, not /instructors/1/slots)"); eq([list.method, list.status, list.userId, list.level], ["GET", 200, 3, "info"], "method, status, Ada's user id, level"); assert(typeof list.ms === "number" && list.time && list.requestId, "ms, time and requestId"); const nf = lines.find((l) => l.requestId === "rq-404"); eq([nf?.route, nf?.status, nf?.userId], ["unmatched", 404, null], "an unknown URL"); lacks(stdout(), "ada@example.com", "no emails in the logs"); lacks(stdout(), "correct horse", "no passwords in the logs");` },
            { label: "Health: live, ready, and the database down", check: `const live = await get("/health/live"); eq([live.status, live.json, live.headers["cache-control"]], [200, { status: "ok" }, "no-store"], "live"); eq((await get("/health/ready")).json, { status: "ready", checks: { database: "up" } }, "ready"); dbDown(); const down = await get("/health/ready"); const stillLive = await get("/health/live"); dbDown(false); eq([down.status, down.json], [503, { status: "unavailable", checks: { database: "down" } }], "ready while the database is down"); eq(stillLive.status, 200, "live does not touch the database");` },
          ],
          hint: "Week 16's requestId middleware and Week 20's health endpoints, plus a res.on(\"finish\") logger. The route is only known after routing: read req.route inside the finish handler.",
          successMessage: "Office Hours now explains every request in one searchable line and tells the platform, honestly, whether it can serve.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 159 · 23.8 – 23.9 · PERFORMANCE AND BUG FIXES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l159-hardening-quality",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["23.8", "23.9"],
    title: "Performance Testing of Critical Endpoints, and Bug Fixes from Test Results",
    subtitle: "Fast enough, and right",
    estimatedMinutes: 110,
    intro: "Two last quality gates: the booking endpoint under Monday-morning load (fast, and still correct), and the bugs a regression suite from the pilot users has found.",
    atoms: [
      {
        id: "a-be-hardening-performance",
        title: "Requirement: performance testing of critical endpoints",
        explain:
          "A performance test of a critical endpoint measures latency and throughput AND checks correctness under load, because races appear only under concurrency. For booking: many students booking many slots at once, then assert the INVARIANTS (no slot with two active bookings, every 201 matches a row, no 5xx) next to p50 and p95. Run it against a production-like environment, record the numbers, and compare them with the NFR (p95 under 300 ms at 50 bookings per second).",
        nodeLab: {
          task:
            "Write perf/booking.js (run with node --env-file=.env perf/booking.js): start the app on port 3100; create 30 students enrolled in BE-101 (with the seeded password hash) and 40 future slots; log the students in; then each student books 4 random slots, 10 requests at a time (use runLoad-style workers), timing every booking. Print \"bookings: <201s> created, <409s> conflicts, <other> other\", \"latency: p50 <n> ms, p95 <n> ms\", then check the invariants and print \"invariant ok: <name>\" or \"invariant FAILED: <name>\" for one-active-booking-per-slot, created-equals-rows and no-5xx; exit 1 if any failed. Close the server and pool at the end.",
          command: false,
          db: OH_SQL,
          files: { ...PROJECT(), "perf/booking.js": 'import { app } from "../src/app.js";\nimport { pool } from "../src/db.js";\n\n// Booking under load: 30 students, 40 slots, 10 requests at a time.\n' },
          readOnly: ALL_RO,
          open: "perf/booking.js",
          solution: {
            "perf/booking.js": `import { app } from "../src/app.js";
import { pool } from "../src/db.js";

// Booking under load: 30 students, 40 slots, 10 requests at a time.
const STUDENTS = 30;
const SLOTS = 40;
const PER_STUDENT = 4;
const CONCURRENCY = 10;
const BASE = "http://localhost:3100";

const server = app.listen(3100);
let failed = false;
try {
  // Fixtures: students with the seeded password, enrolled in BE-101, and future slots.
  const { rows: [{ password_hash: hash }] } = await pool.query("SELECT password_hash FROM users WHERE email = 'ada@example.com'");
  const names = Array.from({ length: STUDENTS }, (_, i) => \`load\${i}\`);
  for (const name of names) {
    const { rows } = await pool.query("INSERT INTO users (email, full_name, role, password_hash) VALUES ($1, $2, 'student', $3) RETURNING id", [\`\${name}@example.com\`, name, hash]);
    await pool.query("INSERT INTO course_members (course_id, user_id, role) VALUES (1, $1, 'student')", [rows[0].id]);
  }
  const start = Math.ceil(Date.now() / 3_600_000) * 3_600_000 + 2 * 24 * 3_600_000;
  const slotIds = [];
  for (let i = 0; i < SLOTS; i++) {
    const at = new Date(start + i * 30 * 60_000);
    const { rows } = await pool.query("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES (1, 1, $1, $2) RETURNING id", [at, new Date(at.getTime() + 20 * 60_000)]);
    slotIds.push(rows[0].id);
  }

  const cookies = [];
  for (const name of names) {
    const res = await fetch(\`\${BASE}/auth/login\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: \`\${name}@example.com\`, password: "correct horse battery staple" }) });
    cookies.push(res.headers.getSetCookie().find((c) => c.startsWith("sid=")).split(";")[0]);
  }

  // The work: every student books PER_STUDENT random slots.
  const jobs = cookies.flatMap((cookie) => Array.from({ length: PER_STUDENT }, () => ({ cookie, slotId: slotIds[Math.floor(Math.random() * SLOTS)] })));
  const latencies = [];
  const counts = { created: 0, conflicts: 0, other: 0 };
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      const t0 = performance.now();
      const res = await fetch(\`\${BASE}/bookings\`, { method: "POST", headers: { "Content-Type": "application/json", Cookie: job.cookie }, body: JSON.stringify({ slotId: job.slotId }) });
      await res.arrayBuffer();
      latencies.push(performance.now() - t0);
      if (res.status === 201) counts.created += 1;
      else if (res.status === 409) counts.conflicts += 1;
      else counts.other += 1;
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  latencies.sort((a, b) => a - b);
  const pct = (p) => Math.round(latencies[Math.max(0, Math.ceil((p / 100) * latencies.length) - 1)]);
  console.log(\`bookings: \${counts.created} created, \${counts.conflicts} conflicts, \${counts.other} other\`);
  console.log(\`latency: p50 \${pct(50)} ms, p95 \${pct(95)} ms\`);

  const check = (name, ok) => {
    console.log(\`invariant \${ok ? "ok" : "FAILED"}: \${name}\`);
    if (!ok) failed = true;
  };
  const doubled = await pool.query("SELECT slot_id FROM bookings WHERE status <> 'cancelled' GROUP BY slot_id HAVING count(*) > 1");
  check("one-active-booking-per-slot", doubled.rowCount === 0);
  const rows = await pool.query("SELECT count(*)::int AS n FROM bookings");
  check("created-equals-rows", rows.rows[0].n === counts.created);
  check("no-5xx", counts.other === 0);
} finally {
  server.close();
  await pool.end();
}
process.exitCode = failed ? 1 : 0;
`,
          },
          tests: [
            { label: "The report and the invariants", check: `await run("node --env-file=.env perf/booking.js"); const out = stdout(); const m = /^bookings: (\\d+) created, (\\d+) conflicts, (\\d+) other$/m.exec(out); assert(m, "a line: bookings: <n> created, <n> conflicts, <n> other (" + out.slice(-300) + ")"); const [created, conflicts, other] = m.slice(1).map(Number); eq(created + conflicts + other, 120, "30 students × 4 bookings"); eq(other, 0, "no other statuses"); const rows = (await sql("SELECT count(*)::int AS n FROM bookings"))[0].n; eq(created, rows, "the created count matches the database"); assert(created <= 40 && created >= 30, "at most one booking per slot, and most slots booked (" + created + ")"); assert(/^latency: p50 \\d+ ms, p95 \\d+ ms$/m.test(out), "latency: p50 <n> ms, p95 <n> ms"); for (const inv of ["one-active-booking-per-slot", "created-equals-rows", "no-5xx"]) has(out, "invariant ok: " + inv, "invariant " + inv); eq(exitCode(), 0, "exit code 0 when all hold");` },
            { label: "It really fails when an invariant breaks", check: `const src = file("perf/booking.js") || ""; assert(/invariant FAILED/.test(src) || /"FAILED"/.test(src) || /FAILED/.test(src), "print invariant FAILED: <name> when one does not hold"); assert(/exitCode\\s*=|process\\.exit\\(\\s*1/.test(src), "and exit with code 1"); const doubled = await sql("SELECT slot_id FROM bookings WHERE status <> 'cancelled' GROUP BY slot_id HAVING count(*) > 1"); eq(doubled, [], "and in the database: no slot booked twice");` },
          ],
          hint: "Create fixtures with pool.query, log everyone in with fetch (res.headers.getSetCookie()), build a job list, and run 10 async workers that take jobs until none are left, timing each fetch. After the run, query the database for the invariants.",
          successMessage: "120 bookings at 10 at a time: the latency is measured, and the rule that matters most held under load.",
        },
      },
      {
        id: "a-be-hardening-bugfix",
        title: "Requirement: bug fixes based on test results",
        explain:
          "When a test fails, read it as a bug report: what was expected, what happened, and which rule is wrong. Reproduce it with the failing test, find the smallest code change that makes it right (often an off-by-one in a range, a comparison the wrong way round, or a condition in the wrong place), run the whole suite, and keep the test as a regression guard. Never change the test to fit the bug.",
        nodeLab: {
          task:
            "The pilot users reported six bugs, and test/regression.test.js (read-only) reproduces them: five fail. Fix the code in src/slots.js, src/bookings.js, src/reports.js and src/me.js until all six pass, changing as little as possible.",
          command: false,
          db: OH_SQL,
          env: { DATABASE_URL: DB_URL },
          files: { ...PROJECT(), ...BROKEN, "test/helpers.js": HELPERS_JS, "test/regression.test.js": REGRESSION_TEST },
          readOnly: [...ALL_RO.filter((p) => !Object.keys(BROKEN).includes(p)), "test/helpers.js", "test/regression.test.js"],
          open: "test/regression.test.js",
          solution: { "src/slots.js": SLOTS_JS, "src/bookings.js": BOOKINGS_JS(false), "src/reports.js": REPORTS_JS, "src/me.js": ME_JS },
          tests: [
            { label: "All six regression tests pass", check: `const r = await runTests("npm test"); eq(r.length, 6, "the six tests ran"); eq(r.filter((t) => t.state !== "pass").map((t) => t.title), [], "fix the code until every regression test passes");` },
            { label: "The rules are right, not just the tests", check: `${AS} ${AT} ${SLOT} ${BOOK} await run("npm start"); const s = await slotAt(1, 1, at(4, 9)); eq((await get("/instructors/1/slots?from=" + at(4, 0).slice(0, 10) + "&to=" + at(4, 0).slice(0, 10), await as("ada"))).json?.data?.length, 1, "a one-day range includes that day"); const soon = await slotAt(1, 1, new Date(Math.ceil((now() + 100 * 60000) / 60000) * 60000).toISOString()); const b = (await bookAs("ada", soon)).json?.data?.id; eq((await del("/bookings/" + b, await as("ada"))).json?.error?.code, "TOO_LATE_TO_CANCEL", "100 minutes ahead is too late"); const far = (await bookAs("ada", s)).json?.data?.id; eq((await del("/bookings/" + far, await as("ada"))).status, 204, "4 days ahead is fine");` },
          ],
          hint: "Run the tests and read each failure. #41: the range's end date. #42 and #43: the cancellation window compares the wrong way round. #44: what counts as a no-show. #45: the order. #46: when a block ends.",
          successMessage: "Six reported bugs, each reproduced by a test and fixed with a small change; the tests stay as guards.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 160 · 23.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l160-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["23.P"],
    title: "Deliverable: A Deployed, Tested, Documented Backend",
    subtitle: "Release 1.0",
    estimatedMinutes: 90,
    intro: "Release 1.0 of Office Hours: the hardened code, its documentation, and release notes whose claims are checked against the code itself.",
    atoms: [
      {
        id: "a-be-release",
        title: "A release",
        explain:
          "A release is a promise with evidence: what it contains, how it was verified (test counts, the load-test numbers, the security checks), what is known not to work, and how to roll it back. A CHANGELOG (Keep a Changelog format: Added, Changed, Fixed, with versions and dates) tells users what changed between releases. Numbers in release notes must be true: a reviewer will run the tests.",
        nodeLab: {
          task:
            "Write RELEASE.md for Office Hours 1.0.0 with ## What's included (the journeys), ## Verification (the exact number of automated tests in test/ and that they all pass, plus the load-test result and the authorization matrix), ## Known issues (at least one) and ## Rollback (how). Write CHANGELOG.md in Keep a Changelog format: a ## [1.0.0] - YYYY-MM-DD section with ### Added and ### Fixed (the six regression fixes, by issue number #41–#46).",
          command: false,
          db: OH_SQL,
          env: { DATABASE_URL: DB_URL },
          files: { ...PROJECT(), "test/helpers.js": HELPERS_JS, "test/regression.test.js": REGRESSION_TEST, "RELEASE.md": "# Office Hours 1.0.0\n", "CHANGELOG.md": "# Changelog\n" },
          readOnly: [...ALL_RO, "test/helpers.js", "test/regression.test.js"],
          open: "RELEASE.md",
          solution: {
            "RELEASE.md": `# Office Hours 1.0.0

## What's included

- Instructors publish 20-minute slots for the courses they teach.
- Students find free slots of their courses' instructors, book them (one booking per slot, enforced by the database), and cancel up to 2 hours before.
- Instructors record attendance; two no-shows within 30 days block booking for 14 days.
- Admins read a weekly report per course (counts only).
- API documentation at /docs, health checks at /health/live and /health/ready.

## Verification

- 6 automated tests in test/ pass (npm test), run in CI against a migrated and seeded PostgreSQL on every push.
- Load test (perf/booking.js): 120 bookings by 30 students, 10 at a time; all three invariants held (one active booking per slot, created equals rows, no 5xx).
- The authorization matrix test covers every operation for anonymous users and every role.

## Known issues

- Reminders are sent by the worker's scan every 10 minutes, so a reminder can arrive up to 10 minutes after the 24-hour mark.
- Time zones: slots are stored in UTC and displayed by the web app; the weekly report uses UTC weeks.

## Rollback

Deploy the previous image tag with scripts/deploy.sh <tag> (the tag is recorded in .deployed-tag on the server). Migration 003 only adds a column and an index, so the previous release runs unchanged on the current schema.
`,
            "CHANGELOG.md": `# Changelog

All notable changes to this project are documented here. The format follows Keep a Changelog, and the project uses semantic versioning.

## [1.0.0] - 2026-11-16

### Added

- Slots, bookings, cancellations, attendance and the no-show block.
- The weekly report for admins.
- API documentation at /docs, request logs and health checks.

### Fixed

- #41 A slot on the last day of the requested range is now listed.
- #42 Cancelling more than 2 hours ahead is allowed again.
- #43 Cancelling less than 2 hours ahead is refused.
- #44 Cancelled bookings are no longer counted as no-shows in the report.
- #45 My bookings are listed newest first.
- #46 The no-show block ends 14 days after the second no-show.
`,
          },
          tests: [
            { label: "Release notes with true numbers", check: `const md = file("RELEASE.md") || ""; for (const s of ["What's included", "Verification", "Known issues", "Rollback"]) assert(section(md, s).trim().split(/\\s+/).length >= 15, "## " + s + " (15+ words)"); const r = await runTests("npm test"); const passing = r.filter((t) => t.state === "pass").length; eq(passing, r.length, "the release's tests all pass"); const claimed = /(\\d+) (automated )?tests/.exec(section(md, "Verification")); assert(claimed, "## Verification states the number of tests"); eq(Number(claimed[1]), r.length, "the number of tests in ## Verification matches what npm test runs"); assert(/load/i.test(section(md, "Verification")) && /authori[sz]ation/i.test(section(md, "Verification")), "## Verification mentions the load test and the authorization matrix"); has(section(md, "Rollback"), "deploy.sh", "## Rollback: how");` },
            { label: "A changelog in Keep a Changelog format", check: `const md = file("CHANGELOG.md") || ""; const head = /^## \\[1\\.0\\.0\\] - (\\d{4}-\\d{2}-\\d{2})$/m.exec(md); assert(head, "## [1.0.0] - YYYY-MM-DD"); const body = md.slice(head.index); const fixed = (body.split(/^### Fixed\\s*$/m)[1] || "").split(/^## /m)[0]; assert(/^### Added\\s*$/m.test(body), "### Added"); for (let i = 41; i <= 46; i++) assert(fixed.includes("#" + i), "### Fixed lists #" + i);` },
          ],
          hint: "Run npm test to count the tests before writing the number. The changelog's Fixed list comes straight from the regression test names.",
          successMessage: "Office Hours 1.0.0 ships with release notes a reviewer can verify and a changelog users can read.",
        },
      },
    ],
    task: {
      title: "Week 23 deliverable: your capstone, deployed, tested and documented",
      intro: "Harden and ship your own project.",
      prompts: [
        "Add integration tests for your primary journeys and a concurrency test for your most contended rule; add a data-driven authorization matrix test.",
        "Add migrations for every change since Week 22, a demo seed, served OpenAPI documentation at /docs and a README that gets a newcomer running.",
        "Validate configuration per environment; set up the delivery pipeline with migrations, seed and tests in CI, and a smoke-tested deploy.",
        "Add request logs and health checks; load-test your critical endpoint with invariants; fix what the tests find and keep the tests.",
        "Checkpoint: your backend is live, documented, monitored, and passes its integration, security and performance tests; publish release notes with true numbers.",
      ],
      closing: "Next: Week 24, defending the project.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
