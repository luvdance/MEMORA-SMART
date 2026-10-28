/**
 * BACKEND ENGINEERING · WEEK 15 · BACKEND TESTING
 *
 * Curriculum 15.1 – 15.P. Why tests; test levels; TDD; fixtures and
 * factories; mocking; endpoint tests with supertest; database tests; auth
 * tests; negative and boundary tests; coverage and CI; five exercises; and
 * a test suite for the course API.
 *
 * Learners write Vitest tests (the lab's Vitest-compatible runner, the same
 * API and report format as Vitest 5). Each lab's application reads BUG from
 * the environment to switch one behaviour off; the checks run the learner's
 * suite against the correct app (everything must pass) and against each
 * broken variant (something must fail): the suite has to catch real bugs.
 * Coverage is shown from a real `vitest run --coverage` (session w15-tests).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg, shown, term } from "./be-helpers.js";

export const SECTION_ID = "be-s15-testing";
const MODULE = "be-w15-testing";

const TEST_PKG = (deps = ["express"]) =>
  pkg({ name: "course-api", scripts: { start: "node server.js", test: "vitest run" }, deps, dev: ["supertest", "vitest"] });
const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
const DB_ENV = { DATABASE_URL: DB_URL };
const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;
const BUG_JS = `/** For this exercise: BUG=<name> switches one behaviour off, to prove the tests notice. */
export const bug = (name) => process.env.BUG === name;
`;

/** The learner's suite passes on the correct app, with at least `min` tests. */
const PASSES = (min) => ({
  label: `Your tests pass against the correct app (${min}+ tests)`,
  check: `const results = await runTests("npm test"); assert(results.length >= ${min}, "write at least ${min} tests: found " + results.length); eq(results.filter((t) => t.state === "fail").map((t) => t.name), [], "every test should pass against the correct app");`,
});
/** The learner's suite fails when BUG=<bug> breaks the app. */
const CATCHES = (bug, what) => ({
  label: `They catch: ${what}`,
  check: `const r = await runTests("BUG=${bug} npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=${bug} (${what.replace(/"/g, "'")}) at least one of your tests must fail");`,
});

/* ── The quote service (pricing + route) ─────────────────────────────── */

const PRICING_JS = `import { bug } from "./bug.js";

/** The price of a course for a number of seats, in naira. */
export function quote(price, seats, { earlyBird = false } = {}) {
  if (!Number.isInteger(seats) || seats < 1) throw new RangeError("seats must be a whole number, 1 or more");
  let discount = 0;
  if (seats >= (bug("big-group") ? 11 : 10)) discount = 20;
  else if (bug("group-boundary") ? seats > 3 : seats >= 3) discount = 10;
  if (earlyBird && !bug("early-bird")) discount += 5;
  const unit = Math.round(price * (1 - discount / 100));
  return { unit, total: unit * seats, discount };
}
`;
const QUOTE_APP_JS = `import express from "express";
import { bug } from "./bug.js";
import { quote } from "./pricing.js";

export const app = express();
app.use(express.json());

const PRICES = { "BE-101": 120000, "DB-101": 80000 };

app.post("/quotes", (req, res) => {
  const { code, seats, earlyBird } = req.body ?? {};
  const price = PRICES[code];
  if (!price) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  if (!bug("route-validation") && (!Number.isInteger(seats) || seats < 1)) {
    return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "seats must be a whole number, 1 or more" } });
  }
  res.status(bug("route-status") ? 200 : 201).json({ data: { code, ...quote(price, seats, { earlyBird }) } });
});
`;

/* ── The in-memory course API (endpoint tests) ───────────────────────── */

const COURSES_APP_JS = `import express from "express";
import { bug } from "./bug.js";

export function createApp() {
  const courses = [
    { id: 1, code: "BE-101", title: "Backend Engineering", weeks: 24 },
    { id: 2, code: "DB-101", title: "Relational Databases", weeks: 16 },
  ];
  const app = express();
  app.use(express.json());

  app.get("/courses", (req, res) => res.json({ data: courses }));

  app.get("/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === Number(req.params.id));
    if (!course) return bug("missing-200") ? res.json({ data: null }) : res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
    res.json({ data: course });
  });

  app.post("/courses", (req, res) => {
    const { code, title, weeks } = req.body ?? {};
    const details = [];
    if (!/^[A-Z]{2,3}-\\d{3}$/.test(String(code))) details.push({ field: "code", message: "must look like BE-101" });
    if (typeof title !== "string" || title.trim().length < 3) details.push({ field: "title", message: "must be at least 3 characters" });
    if (!Number.isInteger(weeks) || weeks < 1 || weeks > 52) details.push({ field: "weeks", message: "must be from 1 to 52" });
    if (details.length && !bug("invalid-201")) return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid course", details } });
    const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title, weeks };
    courses.push(course);
    if (!bug("no-location")) res.location(\`/courses/\${course.id}\`);
    res.status(201).json({ data: course });
  });

  app.delete("/courses/:id", (req, res) => {
    const index = courses.findIndex((c) => c.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
    if (!bug("delete-noop")) courses.splice(index, 1);
    res.status(204).end();
  });

  return app;
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 107 · 15.1 – 15.2 · WHY TESTS, AND WHICH KIND
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l107-test-levels",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2"],
    title: "Why Automated Tests Matter: Unit, Integration and End-to-End",
    subtitle: "Proof that the code still does what it did yesterday",
    estimatedMinutes: 60,
    intro:
      "Every lab in this course has been checked by tests the course wrote. From this week you write them. A test that passes proves little; a test that fails when the code is wrong is worth its weight in gold. That is how your tests are graded here.",
    atoms: [
      {
        id: "a-be-why-tests",
        title: "Why automated tests matter",
        explain:
          "Automated tests are code that runs your code and checks the result. They catch REGRESSIONS (a change breaking something that worked), let you refactor with confidence (Week 7's restructuring was safe because checks ran after every step), document behaviour precisely (a test says exactly what 3 seats cost), and make reviews faster. Manual testing does not scale: nobody re-clicks 200 cases before every deploy. Tests are worth their cost where bugs are expensive: money, permissions, data integrity, and code that changes often.",
        decision: decide({
          scenario: "A team ships weekly. Each release, two people spend a day clicking through the main flows, and bugs in less-visited flows (refunds, instructor permissions) still reach production.",
          question: "What is the best next step?",
          right: ["Automate tests for the flows that matter most (payments, permissions, enrollment), run them on every change, and keep a short manual check for what cannot be automated", "Fast, repeatable, every time."],
          wrong: [
            ["Add a third tester", "More cost, same gaps."],
            ["Release less often", "Bigger releases, more bugs per release."],
            ["Test only in production with monitoring", "Users find the bugs."],
          ],
          at: 0,
          aftermath: "Week 16 and 19 add the other half: monitoring catches what tests missed, and CI runs the tests automatically.",
        }),
      },
      {
        id: "a-be-test-levels",
        title: "Unit, integration and end-to-end tests",
        explain:
          "UNIT tests check one function in isolation: fast (milliseconds), precise, many of them (quote(100000, 3) → 10% off). INTEGRATION tests check parts working together: a request through Express to the handler (and often a real database), answered with the right status and body. END-TO-END tests drive the whole system as a user would (a browser or a deployed API): the most realistic, the slowest and most fragile, so few. The 'testing pyramid': many unit tests, fewer integration tests, a handful of end-to-end ones. With Vitest: describe groups, it defines a test, expect(value).toBe / toEqual / toThrow asserts; supertest sends HTTP requests to an Express app without opening a port.",
        nodeLab: {
          task:
            "Write unit tests in test/pricing.test.js for quote(price, seats, options): full price for 1 seat, 10% off from 3 seats, 20% off from 10 seats, 5% more with earlyBird, and a RangeError for 0 seats. Write integration tests in test/quotes.test.js with supertest for POST /quotes: 201 with the quote for a valid request, 400 for seats 0, 404 for an unknown course code. The checks then run your suite against five broken versions of the code.",
          command: false,
          files: {
            "package.json": TEST_PKG(),
            "src/bug.js": BUG_JS,
            "src/pricing.js": PRICING_JS,
            "src/app.js": QUOTE_APP_JS,
            "test/pricing.test.js": `import { describe, expect, it } from "vitest";
import { quote } from "../src/pricing.js";

describe("quote", () => {
  it("charges the full price for one seat", () => {
    expect(quote(120000, 1)).toEqual({ unit: 120000, total: 120000, discount: 0 });
  });
});
`,
            "test/quotes.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("POST /quotes", () => {});
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/pricing.js", "src/app.js"],
          open: "test/pricing.test.js",
          solution: {
            "test/pricing.test.js": `import { describe, expect, it } from "vitest";
import { quote } from "../src/pricing.js";

describe("quote", () => {
  it("charges the full price for one seat", () => {
    expect(quote(120000, 1)).toEqual({ unit: 120000, total: 120000, discount: 0 });
  });

  it("gives 10% off from 3 seats", () => {
    expect(quote(100000, 3)).toEqual({ unit: 90000, total: 270000, discount: 10 });
  });

  it("gives 20% off from 10 seats", () => {
    expect(quote(100000, 10)).toEqual({ unit: 80000, total: 800000, discount: 20 });
  });

  it("adds 5% for early birds", () => {
    expect(quote(100000, 1, { earlyBird: true })).toEqual({ unit: 95000, total: 95000, discount: 5 });
  });

  it("refuses 0 seats", () => {
    expect(() => quote(100000, 0)).toThrow(RangeError);
  });
});
`,
            "test/quotes.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("POST /quotes", () => {
  it("answers 201 with the quote", async () => {
    const res = await request(app).post("/quotes").send({ code: "DB-101", seats: 3 });
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ code: "DB-101", unit: 72000, total: 216000, discount: 10 });
  });

  it("answers 400 for 0 seats", async () => {
    const res = await request(app).post("/quotes").send({ code: "DB-101", seats: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_FAILED");
  });

  it("answers 404 for an unknown course", async () => {
    const res = await request(app).post("/quotes").send({ code: "XX-999", seats: 1 });
    expect(res.status).toBe(404);
  });
});
`,
          },
          tests: [
            PASSES(8),
            CATCHES("group-boundary", "3 seats no longer get 10% off"),
            CATCHES("big-group", "10 seats no longer get 20% off"),
            CATCHES("early-bird", "the early-bird discount is ignored"),
            CATCHES("route-status", "POST /quotes answers 200 instead of 201"),
            CATCHES("route-validation", "POST /quotes accepts 0 seats"),
            { label: "Unit tests call quote; integration tests use supertest", check: `has(file("test/pricing.test.js"), "quote(", "test/pricing.test.js should call quote directly"); has(file("test/quotes.test.js"), "request(app)", "test/quotes.test.js should send requests with supertest's request(app)");` },
          ],
          hint: "Test the boundaries: 3 seats exactly (the first discounted number) and 10 exactly. In the integration tests: const res = await request(app).post(\"/quotes\").send({ … }); expect(res.status).toBe(201).",
          successMessage: "Five deliberate bugs, five failing test runs. That is what 'the tests pass' should mean.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 108 · 15.3 · TEST-DRIVEN DEVELOPMENT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l108-tdd",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.3"],
    title: "Test-Driven Development Fundamentals",
    subtitle: "Red, green, refactor",
    estimatedMinutes: 50,
    intro: "In test-driven development the test comes first: it describes behaviour that does not exist yet, fails, and then the simplest code that makes it pass is written. Here the tests are already written. Your job is to turn them green.",
    atoms: [
      {
        id: "a-be-tdd",
        title: "Test-driven development",
        explain:
          "The TDD loop: RED (write a small test for the next piece of behaviour; run it; see it fail for the right reason), GREEN (write the simplest code that passes), REFACTOR (clean up with the tests as a safety net), repeat. Benefits: every line of code exists because a test needed it, the design is usable from the caller's side, and edge cases are thought about before the code. TDD fits well-specified logic (pricing, parsing, validation, slugs); it is less natural for exploratory UI work. Run the suite constantly: npx vitest (watch mode) reruns tests on every save.",
        nodeLab: {
          task:
            "test/slug.test.js (written first, as in TDD) specifies slugify(title), which turns a course title into a URL slug. Implement src/slug.js until every test passes. Then add one test of your own for a case the file does not cover (for example digits: \"React 19 Basics\" → \"react-19-basics\") and keep everything green.",
          command: false,
          files: {
            "package.json": TEST_PKG([]),
            "src/slug.js": "export function slugify(title) {\n  return title;\n}\n",
            "test/slug.test.js": `import { describe, expect, it } from "vitest";
import { slugify } from "../src/slug.js";

describe("slugify", () => {
  it("lower-cases and joins words with hyphens", () => {
    expect(slugify("Backend Engineering")).toBe("backend-engineering");
  });

  it("trims and collapses spaces and hyphens", () => {
    expect(slugify("  Data -- Analysis  ")).toBe("data-analysis");
  });

  it("drops punctuation", () => {
    expect(slugify("Node.js & Express: the basics!")).toBe("nodejs-express-the-basics");
  });

  it("removes accents", () => {
    expect(slugify("Données Avancées")).toBe("donnees-avancees");
  });

  it("keeps at most 30 characters, cutting at a hyphen", () => {
    expect(slugify("An introduction to relational database design")).toBe("an-introduction-to-relational");
  });

  it("refuses a title with no letters or digits", () => {
    expect(() => slugify("!!!")).toThrow("A slug needs at least one letter or digit");
  });
});
`,
          },
          readOnly: ["package.json", "test/slug.test.js"],
          open: "src/slug.js",
          solution: {
            "src/slug.js": `const MAX = 30;

export function slugify(title) {
  const slug = String(title)
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "") // accents, now separate marks after NFD
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, "") // punctuation
    .trim()
    .replace(/[\\s-]+/g, "-");
  if (!/[a-z0-9]/.test(slug)) throw new Error("A slug needs at least one letter or digit");
  if (slug.length <= MAX) return slug;
  const cut = slug.slice(0, MAX + 1);
  return cut.slice(0, cut.lastIndexOf("-")).replace(/-+$/, "");
}
`,
            "test/slug-extra.test.js": `import { expect, it } from "vitest";
import { slugify } from "../src/slug.js";

it("keeps digits", () => {
  expect(slugify("React 19 Basics")).toBe("react-19-basics");
});
`,
          },
          tests: [
            { label: "Every given test passes", check: `const r = await runTests("npm test"); const given = r.filter((t) => t.file === "test/slug.test.js"); eq(given.length, 6, "the six given tests ran"); eq(given.filter((t) => t.state !== "pass").map((t) => t.title), [], "make the given tests pass");` },
            { label: "You added a test of your own, and it passes", check: `const r = await runTests("npm test"); const mine = r.filter((t) => t.file !== "test/slug.test.js" || !["lower-cases and joins words with hyphens", "trims and collapses spaces and hyphens", "drops punctuation", "removes accents", "keeps at most 30 characters, cutting at a hyphen", "refuses a title with no letters or digits"].includes(t.title)); assert(mine.length >= 1, "add at least one test of your own (in test/slug.test.js is read-only, so in a new file such as test/slug-extra.test.js)"); eq(mine.filter((t) => t.state !== "pass").map((t) => t.name), [], "your test should pass");` },
            { label: "slugify handles cases the tests did not list", check: `const { slugify } = await load("src/slug.js"); eq(slugify("React 19 Basics"), "react-19-basics", "digits"); eq(slugify("Ça va? Très bien"), "ca-va-tres-bien", "accents and punctuation together"); eq(slugify("Short"), "short", "a short title");` },
          ],
          hint: "A pipeline: normalize(\"NFD\") and drop the combining marks (\\u0300-\\u036f), lower-case, remove [^a-z0-9\\s-], trim, turn runs of spaces and hyphens into one hyphen. For the length, cut at the last hyphen before 31 characters.",
          successMessage: "Red to green, one behaviour at a time. The test file is now also the clearest specification of what slugify does.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 109 · 15.4 – 15.5 · FIXTURES, FACTORIES AND MOCKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l109-factories-mocks",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.4", "15.5"],
    title: "Fixtures, Factories, Isolated Data and Mocks",
    subtitle: "Tests that do not depend on each other or on the internet",
    estimatedMinutes: 75,
    intro: "Two things make test suites flaky: tests that share data (one test's leftovers break the next) and tests that call real external services. Factories and mocks fix both.",
    atoms: [
      {
        id: "a-be-factories",
        title: "Test fixtures, factories and isolated test data",
        explain:
          "A FIXTURE is known data a test starts from. A FACTORY builds valid test objects with sensible defaults, overridable per test (buildStudent({ email: \"x@y.z\" })), and unique values from a counter so tests never collide on UNIQUE columns. Each test must not depend on another: reset the database before each test (beforeEach: TRUNCATE … RESTART IDENTITY CASCADE), or run each test in a transaction that is rolled back. Then tests can run in any order, alone or together, any number of times.",
        nodeLab: {
          task:
            "Write test/factories.js: buildStudent(overrides) returns { email, fullName } with a unique email each call (student1@example.com, student2@example.com…), createStudent(overrides) and createCourse(overrides) insert through src/repo.js and return the rows. Then write test/enrollments.test.js: reset the tables before each test (TRUNCATE students, courses, enrollments RESTART IDENTITY CASCADE), and test enroll() and listForStudent() with your factories, including that enrolling twice throws. The checks run your suite twice in a row on the same database.",
          command: false,
          db: `CREATE TABLE students (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE, full_name text NOT NULL);
CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id));
`,
          env: DB_ENV,
          files: {
            "package.json": TEST_PKG(["pg"]),
            "src/bug.js": BUG_JS,
            "src/db.js": DB_JS,
            "src/repo.js": `import { bug } from "./bug.js";
import { pool } from "./db.js";

export async function insertStudent({ email, fullName }) {
  const { rows } = await pool.query('INSERT INTO students (email, full_name) VALUES ($1, $2) RETURNING id, email, full_name AS "fullName"', [email, fullName]);
  return rows[0];
}

export async function insertCourse({ code, title }) {
  const { rows } = await pool.query("INSERT INTO courses (code, title) VALUES ($1, $2) RETURNING id, code, title", [code, title]);
  return rows[0];
}

export async function enroll(studentId, courseId) {
  const existing = await pool.query("SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [studentId, courseId]);
  if (existing.rows.length && !bug("double-enroll")) throw new Error("Already enrolled");
  const { rows } = await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id, student_id AS "studentId", course_id AS "courseId"', [studentId, courseId]);
  return rows[0];
}

export async function listForStudent(studentId) {
  const { rows } = await pool.query(
    "SELECT c.code FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = $1 ORDER BY c.code",
    [bug("wrong-student") ? studentId + 1 : studentId]
  );
  return rows.map((r) => r.code);
}
`,
            "test/factories.js": "// buildStudent, createStudent, createCourse\n",
            "test/enrollments.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { pool } from "../src/db.js";
import { enroll, listForStudent } from "../src/repo.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/db.js", "src/repo.js"],
          open: "test/factories.js",
          solution: {
            "test/factories.js": `import { insertCourse, insertStudent } from "../src/repo.js";

let seq = 0;
const next = () => ++seq;

/** A valid student, unique on every call; override any field. */
export function buildStudent(overrides = {}) {
  const n = next();
  return { email: \`student\${n}@example.com\`, fullName: \`Student \${n}\`, ...overrides };
}

export const createStudent = (overrides) => insertStudent(buildStudent(overrides));

export function createCourse(overrides = {}) {
  const n = next();
  return insertCourse({ code: \`TC-\${String(n).padStart(3, "0")}\`, title: \`Test course \${n}\`, ...overrides });
}
`,
            "test/enrollments.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { pool } from "../src/db.js";
import { enroll, listForStudent } from "../src/repo.js";
import { buildStudent, createCourse, createStudent } from "./factories.js";

// Every test starts from empty tables.
beforeEach(async () => {
  await pool.query("TRUNCATE students, courses, enrollments RESTART IDENTITY CASCADE");
});

describe("factories", () => {
  it("build unique students", () => {
    expect(buildStudent().email).not.toBe(buildStudent().email);
  });
});

describe("enroll", () => {
  it("enrolls a student in a course", async () => {
    const student = await createStudent();
    const course = await createCourse();
    const enrollment = await enroll(student.id, course.id);
    expect(enrollment).toMatchObject({ studentId: student.id, courseId: course.id });
  });

  it("refuses a second enrollment in the same course", async () => {
    const student = await createStudent();
    const course = await createCourse();
    await enroll(student.id, course.id);
    await expect(enroll(student.id, course.id)).rejects.toThrow("Already enrolled");
  });
});

describe("listForStudent", () => {
  it("lists only that student's courses", async () => {
    const ada = await createStudent({ fullName: "Ada" });
    const bayo = await createStudent({ fullName: "Bayo" });
    const be = await createCourse({ code: "BE-101" });
    const db = await createCourse({ code: "DB-101" });
    await enroll(ada.id, be.id);
    await enroll(bayo.id, db.id);
    expect(await listForStudent(ada.id)).toEqual(["BE-101"]);
  });
});
`,
          },
          tests: [
            PASSES(4),
            { label: "…and again, on the same database (isolated data)", check: `await runTests("npm test"); const r = await runTests("npm test"); eq(r.filter((t) => t.state === "fail").map((t) => t.name), [], "the second run on the same database must pass too: reset the tables before each test and keep values unique");` },
            { label: "The factories build valid, unique data", check: `const f = await load("test/factories.js"); const a = f.buildStudent(); const b = f.buildStudent(); assert(a.email && a.fullName, "buildStudent returns an email and a fullName"); assert(a.email !== b.email, "two calls give two different emails"); eq(f.buildStudent({ email: "x@example.com" }).email, "x@example.com", "overrides win");` },
            CATCHES("double-enroll", "a student can enroll twice in the same course"),
            CATCHES("wrong-student", "listForStudent returns another student's courses"),
          ],
          hint: "In factories.js keep a counter (let seq = 0) and use it in every unique value. In the tests: beforeEach(async () => { await pool.query(\"TRUNCATE students, courses, enrollments RESTART IDENTITY CASCADE\"); }), then create what each test needs with the factories.",
          successMessage: "Each test builds exactly the data it needs and starts from a clean database: run them in any order, as often as you like.",
        },
      },
      {
        id: "a-be-mocking",
        title: "Mocking external services",
        explain:
          "Tests must not call real external services: they are slow, cost money, change state (a real charge) and fail for reasons unrelated to your code. Replace them with a TEST DOUBLE. The simplest way is dependency injection: the function takes its fetch (or its client) as a parameter, and the test passes a fake made with vi.fn() that returns exactly the response the test needs (success, 500, a timeout), then checks how it was called (toHaveBeenCalledWith). vi.mock(\"../src/payments.js\") replaces a whole module when injection is not possible. Mock at your boundary (the HTTP client), not deep inside your own code.",
        nodeLab: {
          task:
            "chargeCard(amountNaira, { fetch }) in src/payments.js calls the payment provider. Write test/payments.test.js with a fake fetch made with vi.fn(): test that a successful charge returns the provider's charge id, that the amount is sent in kobo (×100) to POST /v1/charges, that a 500 answer throws PaymentFailedError, and that a network error (fetch rejects) also throws PaymentFailedError. No test may reach the network.",
          command: false,
          files: {
            "package.json": TEST_PKG([]),
            "src/bug.js": BUG_JS,
            "src/payments.js": `import { bug } from "./bug.js";

export class PaymentFailedError extends Error {}

const API = "https://api.payments.example";

/** Charges a card through the provider. fetch is injectable for tests. */
export async function chargeCard(amountNaira, { fetch = globalThis.fetch } = {}) {
  let response;
  try {
    response = await fetch(\`\${API}/v1/charges\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: bug("naira") ? amountNaira : amountNaira * 100, currency: "NGN" }),
    });
  } catch (err) {
    if (bug("swallow-network")) return { id: null };
    throw new PaymentFailedError(\`The provider could not be reached: \${err.message}\`);
  }
  if (!response.ok && !bug("ignore-5xx")) throw new PaymentFailedError(\`The provider answered \${response.status}\`);
  const body = await response.json();
  return { id: body.id };
}
`,
            "test/payments.test.js": `import { describe, expect, it, vi } from "vitest";
import { PaymentFailedError, chargeCard } from "../src/payments.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/payments.js"],
          open: "test/payments.test.js",
          solution: {
            "test/payments.test.js": `import { describe, expect, it, vi } from "vitest";
import { PaymentFailedError, chargeCard } from "../src/payments.js";

/** A fake fetch answering with this status and JSON body. */
const answering = (status, body) => vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

describe("chargeCard", () => {
  it("returns the provider's charge id", async () => {
    const fetch = answering(201, { id: "ch_123" });
    expect(await chargeCard(1200, { fetch })).toEqual({ id: "ch_123" });
  });

  it("sends the amount in kobo to POST /v1/charges", async () => {
    const fetch = answering(201, { id: "ch_1" });
    await chargeCard(1200, { fetch });
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://api.payments.example/v1/charges");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ amount: 120000, currency: "NGN" });
  });

  it("throws PaymentFailedError when the provider answers 500", async () => {
    await expect(chargeCard(1200, { fetch: answering(500, { error: "boom" }) })).rejects.toBeInstanceOf(PaymentFailedError);
  });

  it("throws PaymentFailedError when the network fails", async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(chargeCard(1200, { fetch })).rejects.toBeInstanceOf(PaymentFailedError);
  });
});
`,
          },
          tests: [
            PASSES(4),
            { label: "No test reaches the network", check: `await runTests("npm test"); eq(outgoing().length, 0, "your tests made " + outgoing().length + " real request(s): pass a fake fetch instead");` },
            CATCHES("naira", "the amount is sent in naira, not kobo"),
            CATCHES("ignore-5xx", "a 500 from the provider is treated as success"),
            CATCHES("swallow-network", "a network error is silently ignored"),
            { label: "The fake is made with vi.fn()", check: `has(file("test/payments.test.js"), "vi.fn(", "make the fake fetch with vi.fn()");` },
          ],
          hint: "const fetch = vi.fn(async () => new Response(JSON.stringify({ id: \"ch_1\" }), { status: 201 })); then chargeCard(1200, { fetch }) and inspect fetch.mock.calls[0]. For the network error, make the fake throw.",
          successMessage: "The payment flow is tested in milliseconds, for success and both kinds of failure, without moving a kobo.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 110 · 15.6 – 15.7 · ENDPOINT AND DATABASE TESTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l110-endpoint-db-tests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.6", "15.7"],
    title: "Testing Express Endpoints and Database Operations",
    subtitle: "Integration tests that use the real HTTP layer and the real database",
    estimatedMinutes: 75,
    intro: "Most backend bugs live between the layers: a status code, a header, a validation rule, a query that does not roll back. Integration tests exercise those seams.",
    atoms: [
      {
        id: "a-be-supertest",
        title: "Testing Express endpoints with a test client",
        explain:
          "supertest takes the Express app (no listen, no port) and sends real HTTP requests through it: request(app).post(\"/courses\").send(body).expect(201). Assert the status, the important headers (Location, Content-Type) and the body, for success AND failure. Make the app a factory (createApp()) so each test gets fresh state, or reset shared state before each test. Test what clients rely on, not implementation details.",
        nodeLab: {
          task:
            "Write test/courses.test.js for the API made by createApp() (src/app.js): GET /courses lists two courses; GET /courses/:id answers the course or 404; POST /courses answers 201 with a Location header and the course, and 400 VALIDATION_FAILED with a detail per invalid field; DELETE /courses/:id answers 204 and the course is then gone (404). Create a fresh app in each test (or in beforeEach).",
          command: false,
          files: {
            "package.json": TEST_PKG(),
            "src/bug.js": BUG_JS,
            "src/app.js": COURSES_APP_JS,
            "test/courses.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/app.js"],
          open: "test/courses.test.js",
          solution: {
            "test/courses.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

let app;
beforeEach(() => {
  app = createApp();
});

describe("GET /courses", () => {
  it("lists the courses", async () => {
    const res = await request(app).get("/courses");
    expect(res.status).toBe(200);
    expect(res.body.data.map((c) => c.code)).toEqual(["BE-101", "DB-101"]);
  });
});

describe("GET /courses/:id", () => {
  it("answers one course", async () => {
    const res = await request(app).get("/courses/2");
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe("DB-101");
  });

  it("answers 404 for a missing course", async () => {
    const res = await request(app).get("/courses/99");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("COURSE_NOT_FOUND");
  });
});

describe("POST /courses", () => {
  it("creates a course with a Location header", async () => {
    const res = await request(app).post("/courses").send({ code: "AI-101", title: "AI Engineering", weeks: 12 });
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe(\`/courses/\${res.body.data.id}\`);
    expect(res.body.data).toMatchObject({ code: "AI-101", title: "AI Engineering", weeks: 12 });
  });

  it("refuses an invalid course with a detail per field", async () => {
    const res = await request(app).post("/courses").send({ code: "ai", title: "x", weeks: 99 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_FAILED");
    expect(res.body.error.details.map((d) => d.field)).toEqual(["code", "title", "weeks"]);
  });
});

describe("DELETE /courses/:id", () => {
  it("deletes the course", async () => {
    expect((await request(app).delete("/courses/1")).status).toBe(204);
    expect((await request(app).get("/courses/1")).status).toBe(404);
  });
});
`,
          },
          tests: [
            PASSES(6),
            CATCHES("no-location", "POST /courses no longer sends the Location header"),
            CATCHES("invalid-201", "POST /courses accepts invalid courses"),
            CATCHES("missing-200", "GET /courses/:id answers 200 null for a missing course"),
            CATCHES("delete-noop", "DELETE answers 204 but does not delete"),
          ],
          hint: "Each test: const res = await request(app).get(\"/courses/99\"); expect(res.status).toBe(404). For DELETE, check the effect: a GET afterwards must be 404.",
          successMessage: "Each endpoint's contract (status, headers, body, effect) is now written down as a test, and four ways of breaking it are caught.",
        },
      },
      {
        id: "a-be-db-tests",
        title: "Testing database operations",
        explain:
          "Database code is worth testing against a REAL database (PostgreSQL in Docker or CI, the lab's here), because mocks cannot tell you whether a query, a constraint or a transaction behaves. Test the outcomes in the database, not just return values: after a failed enrollment, the seats and enrollments are exactly as before. Use a separate test database (never production), reset it before each test, and give the suite the connection through the environment (DATABASE_URL), as CI will.",
        nodeLab: {
          task:
            "src/enroll.js takes a seat and creates an enrollment in one transaction. Write test/enroll.test.js (reset the tables and insert a course with 2 seats and three students before each test): a successful enrollment takes one seat; when the course is full, enrollStudent throws CourseFullError and nothing changes; a failed enrollment (the same student twice) leaves the seat count unchanged. Check the database itself with pool.query.",
          command: false,
          db: `CREATE TABLE students (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE);
CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, seats integer NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), UNIQUE (student_id, course_id));
`,
          env: DB_ENV,
          files: {
            "package.json": TEST_PKG(["pg"]),
            "src/bug.js": BUG_JS,
            "src/db.js": DB_JS,
            "src/enroll.js": `import { bug } from "./bug.js";
import { pool } from "./db.js";

export class CourseFullError extends Error {}

export async function enrollStudent(studentId, courseId) {
  const client = await pool.connect();
  try {
    if (!bug("no-transaction")) await client.query("BEGIN");
    const seat = await client.query(
      bug("no-seat-check") ? "UPDATE courses SET seats = seats - 1 WHERE id = $1 RETURNING seats" : "UPDATE courses SET seats = seats - 1 WHERE id = $1 AND seats > 0 RETURNING seats",
      [courseId]
    );
    if (seat.rowCount === 0) throw new CourseFullError("The course is full");
    await client.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)", [studentId, courseId]);
    if (!bug("no-transaction")) await client.query("COMMIT");
    return { seatsLeft: seat.rows[0].seats };
  } catch (err) {
    if (!bug("no-transaction")) await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
`,
            "test/enroll.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { pool } from "../src/db.js";
import { CourseFullError, enrollStudent } from "../src/enroll.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/db.js", "src/enroll.js"],
          open: "test/enroll.test.js",
          solution: {
            "test/enroll.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { pool } from "../src/db.js";
import { CourseFullError, enrollStudent } from "../src/enroll.js";

const count = async (sql) => (await pool.query(sql)).rows[0].n;
const seats = async () => (await pool.query("SELECT seats FROM courses WHERE id = 1")).rows[0].seats;

beforeEach(async () => {
  await pool.query("TRUNCATE students, courses, enrollments RESTART IDENTITY CASCADE");
  await pool.query("INSERT INTO courses (code, seats) VALUES ('BE-101', 2)");
  await pool.query("INSERT INTO students (email) VALUES ('ada@example.com'), ('bayo@example.com'), ('chi@example.com')");
});

describe("enrollStudent", () => {
  it("takes one seat", async () => {
    expect(await enrollStudent(1, 1)).toEqual({ seatsLeft: 1 });
    expect(await seats()).toBe(1);
    expect(await count("SELECT count(*)::int AS n FROM enrollments")).toBe(1);
  });

  it("refuses a full course and changes nothing", async () => {
    await enrollStudent(1, 1);
    await enrollStudent(2, 1);
    await expect(enrollStudent(3, 1)).rejects.toBeInstanceOf(CourseFullError);
    expect(await seats()).toBe(0);
    expect(await count("SELECT count(*)::int AS n FROM enrollments")).toBe(2);
  });

  it("gives the seat back when the enrollment fails", async () => {
    await enrollStudent(1, 1);
    await expect(enrollStudent(1, 1)).rejects.toThrow();
    expect(await seats()).toBe(1);
  });
});
`,
          },
          tests: [
            PASSES(3),
            CATCHES("no-transaction", "the seat is taken even when the enrollment fails"),
            CATCHES("no-seat-check", "a full course still accepts students"),
          ],
          hint: "In each test, call enrollStudent and then look at the tables with pool.query: seats for course 1, count(*) of enrollments. The duplicate test enrolls student 1 twice and expects the seats to be back where they were.",
          successMessage: "Your tests look inside PostgreSQL after each operation, which is the only way to prove a transaction rolled back.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 111 · 15.8 – 15.9 · AUTH TESTS, NEGATIVE AND BOUNDARY TESTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l111-auth-boundary-tests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["15.8", "15.9"],
    title: "Authentication, Authorization, Negative and Boundary Tests",
    subtitle: "Testing what must not happen",
    estimatedMinutes: 70,
    intro: "Happy-path tests prove features work. The tests that prevent incidents prove that the wrong things do NOT happen: unauthenticated access, privilege escalation, invalid data, and the values just past every limit.",
    atoms: [
      {
        id: "a-be-auth-middleware-tests",
        title: "Authentication and authorization tests",
        explain:
          "Test auth at two levels. UNIT: call the middleware with fake req, res and next (vi.fn()) and assert it calls next() for the right user and res.status(401) or 403 otherwise; fast and exact. INTEGRATION: send requests with and without credentials (Week 14's matrix). Always test the denial side: no credentials, an invalid or expired credential, the wrong role, someone else's record.",
        nodeLab: {
          task:
            "Write unit tests in test/auth.test.js for the middleware in src/auth.js, with fake req/res/next made with vi.fn(): requireAuth calls next() when req.user is set and answers 401 (without calling next) when it is not; requireRole(\"admin\") calls next() for an admin and answers 403 for a student; requireRole(\"instructor\", \"admin\") allows both roles.",
          command: false,
          files: {
            "package.json": TEST_PKG([]),
            "src/bug.js": BUG_JS,
            "src/auth.js": `import { bug } from "./bug.js";

export function requireAuth(req, res, next) {
  if (!req.user && !bug("auth-open")) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const ok = bug("role-first-only") ? req.user?.role === roles[0] : roles.includes(req.user?.role);
    if (bug("role-inverted") ? ok : !ok) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });
    next();
  };
}
`,
            "test/auth.test.js": `import { describe, expect, it, vi } from "vitest";
import { requireAuth, requireRole } from "../src/auth.js";

/** A fake Express response: status() and json() record their calls and chain. */
function fakeRes() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/auth.js"],
          open: "test/auth.test.js",
          solution: {
            "test/auth.test.js": `import { describe, expect, it, vi } from "vitest";
import { requireAuth, requireRole } from "../src/auth.js";

/** A fake Express response: status() and json() record their calls and chain. */
function fakeRes() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

describe("requireAuth", () => {
  it("lets a logged-in user through", () => {
    const next = vi.fn();
    requireAuth({ user: { id: 1, role: "student" } }, fakeRes(), next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("answers 401 without a user, and does not call next", () => {
    const res = fakeRes();
    const next = vi.fn();
    requireAuth({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("requireRole", () => {
  it("lets an admin call an admin route", () => {
    const next = vi.fn();
    requireRole("admin")({ user: { role: "admin" } }, fakeRes(), next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("answers 403 to a student on an admin route", () => {
    const res = fakeRes();
    const next = vi.fn();
    requireRole("admin")({ user: { role: "student" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("allows every listed role", () => {
    for (const role of ["instructor", "admin"]) {
      const next = vi.fn();
      requireRole("instructor", "admin")({ user: { role } }, fakeRes(), next);
      expect(next).toHaveBeenCalledOnce();
    }
  });
});
`,
          },
          tests: [
            PASSES(5),
            CATCHES("auth-open", "requireAuth lets anonymous requests through"),
            CATCHES("role-inverted", "requireRole allows exactly the wrong users"),
            CATCHES("role-first-only", "requireRole only allows the first role listed"),
          ],
          hint: "const res = fakeRes(); const next = vi.fn(); requireAuth({}, res, next); expect(res.status).toHaveBeenCalledWith(401); expect(next).not.toHaveBeenCalled().",
          successMessage: "The middleware that guards every route is now pinned down by tests that run in a millisecond each.",
        },
      },
      {
        id: "a-be-boundary-tests",
        title: "Negative tests and boundary conditions",
        explain:
          "Bugs cluster at BOUNDARIES: off-by-one comparisons (> instead of >=), empty strings, zero, the maximum length, the first and last valid value. For each rule test the last value inside and the first outside: weeks 1 and 52 accepted, 0 and 53 refused; a title of 3 characters accepted, 2 refused; price 0 accepted, -1 refused. NEGATIVE tests check that invalid input is refused with the right error. it.each([...]) keeps these tables readable.",
        nodeLab: {
          task:
            "validateCourse(input) in src/validate.js returns a list of the invalid fields ([] when valid). Its rules: weeks a whole number from 1 to 52; title 3 to 100 characters after trimming; price a whole number, 0 or more. Write test/validate.test.js with it.each tables that test both sides of every boundary (weeks 0, 1, 52, 53; title of 2, 3, 100 and 101 characters; price -1 and 0) plus a non-number for weeks.",
          command: false,
          files: {
            "package.json": TEST_PKG([]),
            "src/bug.js": BUG_JS,
            "src/validate.js": `import { bug } from "./bug.js";

/** The fields of a course that break the rules ([] when valid). */
export function validateCourse({ weeks, title, price }) {
  const invalid = [];
  if (!Number.isInteger(weeks) || weeks < 1 || (bug("weeks-52") ? weeks >= 52 : weeks > 52)) invalid.push("weeks");
  const length = String(title ?? "").trim().length;
  if ((bug("title-3") ? length <= 3 : length < 3) || length > (bug("title-100") ? 99 : 100)) invalid.push("title");
  if (!Number.isInteger(price) || (bug("price-zero") ? price <= 0 : price < 0)) invalid.push("price");
  return invalid;
}
`,
            "test/validate.test.js": `import { describe, expect, it } from "vitest";
import { validateCourse } from "../src/validate.js";

const valid = { weeks: 12, title: "Backend Engineering", price: 120000 };
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/validate.js"],
          open: "test/validate.test.js",
          solution: {
            "test/validate.test.js": `import { describe, expect, it } from "vitest";
import { validateCourse } from "../src/validate.js";

const valid = { weeks: 12, title: "Backend Engineering", price: 120000 };
const fieldsFor = (changes) => validateCourse({ ...valid, ...changes });

describe("weeks", () => {
  it.each([[1], [52]])("accepts %i", (weeks) => expect(fieldsFor({ weeks })).toEqual([]));
  it.each([[0], [53], [2.5], ["12"]])("refuses %s", (weeks) => expect(fieldsFor({ weeks })).toEqual(["weeks"]));
});

describe("title", () => {
  it.each([[3], [100]])("accepts %i characters", (n) => expect(fieldsFor({ title: "a".repeat(n) })).toEqual([]));
  it.each([[2], [101]])("refuses %i characters", (n) => expect(fieldsFor({ title: "a".repeat(n) })).toEqual(["title"]));
  it("counts characters after trimming", () => expect(fieldsFor({ title: "  ab  " })).toEqual(["title"]));
});

describe("price", () => {
  it("accepts 0", () => expect(fieldsFor({ price: 0 })).toEqual([]));
  it("refuses -1", () => expect(fieldsFor({ price: -1 })).toEqual(["price"]));
});
`,
          },
          tests: [
            PASSES(10),
            CATCHES("weeks-52", "52 weeks is refused (>= instead of >)"),
            CATCHES("title-3", "a 3-character title is refused"),
            CATCHES("title-100", "a 100-character title is refused"),
            CATCHES("price-zero", "a free course (price 0) is refused"),
            { label: "Tables of cases with it.each", check: `has(file("test/validate.test.js"), "it.each(", "use it.each for the tables of values");` },
          ],
          hint: "For each rule, the last valid value and the first invalid one on each side. it.each([[1], [52]])(\"accepts %i\", (weeks) => expect(validateCourse({ ...valid, weeks })).toEqual([])).",
          successMessage: "Four off-by-one bugs, each caught by the value right at the boundary: exactly the bugs that slip through tests of 'typical' values.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 112 · 15.10 · COVERAGE AND CONTINUOUS INTEGRATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l112-coverage-ci",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["15.10"],
    title: "Code Coverage and Continuous Integration Basics",
    subtitle: "How much is tested, and running it on every change",
    estimatedMinutes: 45,
    intro: "Coverage measures which code the tests ran; continuous integration runs the tests for every change. Both are tools, and both are easy to misread.",
    atoms: [
      {
        id: "a-be-coverage",
        title: "Code coverage",
        explain:
          "vitest run --coverage (with @vitest/coverage-v8) reports, per file, the percentage of STATEMENTS, BRANCHES, FUNCTIONS and LINES the tests executed, and the uncovered line numbers. Branch coverage is the most telling: the recording below shows 100% of lines but 83% of branches, because the 10-seat discount and the early-bird bonus never ran. Coverage shows what is NOT tested; it cannot show that tested code is tested WELL (a test without assertions covers everything). Use thresholds as a floor (coverage.thresholds in vitest.config.js), not a goal.",
        example: shown("w15-tests", "npx vitest run --coverage"),
        terminalExercise: term("w15-tests", {
          only: ["npm test", "npx vitest run --coverage", "npx vitest run"],
          goal: "Find out which lines and branches of src/pricing.js the tests never run.",
          accept: ["npx vitest run --coverage"],
          near: [{ command: "npm test", why: "That shows the tests pass, not what they leave untested." }],
          hint: "vitest run, with coverage.",
          success: "Lines 5 and 7 have untested branches: no test uses 10 seats or the early-bird option. 100% line coverage, and still two untested rules.",
        }),
      },
      {
        id: "a-be-ci-basics",
        title: "Continuous integration basics",
        explain:
          "CONTINUOUS INTEGRATION runs the build and the tests automatically for every push and pull request, on a clean machine, and reports the result on the pull request; a branch rule then blocks merging while it is red. GitHub Actions describes this in .github/workflows/*.yml: on (which events), jobs (on which machine), and steps (check out, set up Node, npm ci, npm test), with services such as PostgreSQL started for the job. Keep CI fast (minutes), deterministic (no flaky tests), and the same as running the tests locally.",
        decision: decide({
          scenario: "The test suite passes on every developer's laptop, but a pull request merged on Friday broke enrollment in production. The author had not run the tests before pushing.",
          question: "What prevents this next time?",
          right: ["Run the tests in CI on every pull request and require them to pass before merging", "The check no longer depends on memory."],
          wrong: [
            ["Ask everyone to remember to run the tests", "That is what failed."],
            ["Run the tests every Monday", "Bugs are merged in between."],
            ["Raise the coverage threshold to 100%", "Does not run the tests on the pull request."],
          ],
          at: 1,
          aftermath: "Exercise 15.15 writes the workflow; Week 19 extends it into deployment.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 113 · 15.11 – 15.15 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l113-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["15.11", "15.12", "15.13", "15.14", "15.15"],
    title: "Exercises: Testing the Academy API",
    subtitle: "Accounts, payloads, constraints, access, and CI",
    estimatedMinutes: 200,
    intro: "Five exercises that test the parts of the academy API where bugs cost the most, and make the suite run on every pull request.",
    atoms: [
      {
        id: "a-be-ex-test-auth",
        title: "Exercise: test registration and login",
        explain:
          "Registration and login have rules a user never sees until they break: passwords stored hashed, the same answer for unknown accounts, session cookies with the right flags. Test each one: through the HTTP API with supertest, and in the database where it matters.",
        nodeLab: {
          task:
            "Write test/auth.test.js for src/app.js (register, login and /me with a session cookie): registering answers 201 without a password in the body and stores an Argon2id hash (look in the database); a duplicate email is 409; login with the right password sets an HttpOnly sid cookie that opens GET /me; a wrong password and an unknown email answer exactly the same 401. Reset the users and sessions tables before each test.",
          command: false,
          db: `CREATE TABLE users (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE, password_hash text NOT NULL);
CREATE TABLE sessions (token_hash text PRIMARY KEY, user_id integer NOT NULL REFERENCES users (id) ON DELETE CASCADE);
`,
          env: DB_ENV,
          files: {
            "package.json": TEST_PKG(["argon2", "cookie-parser", "express", "pg"]),
            "src/bug.js": BUG_JS,
            "src/db.js": DB_JS,
            "src/app.js": `import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";
import cookieParser from "cookie-parser";
import express from "express";
import { bug } from "./bug.js";
import { pool } from "./db.js";

const hash = (t) => createHash("sha256").update(t).digest("hex");

export const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/auth/register", async (req, res) => {
  const email = String(req.body.email).toLowerCase();
  const stored = bug("plain-password") ? req.body.password : await argon2.hash(req.body.password);
  try {
    const { rows } = await pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email", [email, stored]);
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: { code: "EMAIL_TAKEN", message: "Email already registered" } });
    throw err;
  }
});

app.post("/auth/login", async (req, res) => {
  const { rows } = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [String(req.body.email).toLowerCase()]);
  const user = rows[0];
  if (!user) return res.status(401).json(bug("enumeration") ? { error: { code: "NO_ACCOUNT", message: "No account with this email" } } : { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  const ok = user.password_hash.startsWith("$argon2") ? await argon2.verify(user.password_hash, req.body.password) : user.password_hash === req.body.password;
  if (!ok) return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  const token = randomBytes(32).toString("base64url");
  await pool.query("INSERT INTO sessions (token_hash, user_id) VALUES ($1, $2)", [hash(token), user.id]);
  res.cookie("sid", token, { httpOnly: !bug("no-httponly"), secure: true, sameSite: "lax", path: "/" });
  res.status(204).end();
});

app.get("/me", async (req, res) => {
  const { rows } = await pool.query("SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1", [hash(String(req.cookies.sid ?? ""))]);
  if (!rows[0]) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  res.json({ data: rows[0] });
});
`,
            "test/auth.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/db.js", "src/app.js"],
          open: "test/auth.test.js",
          solution: {
            "test/auth.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";

const ada = { email: "ada@example.com", password: "correct horse battery staple" };

beforeEach(async () => {
  await pool.query("TRUNCATE users, sessions RESTART IDENTITY CASCADE");
});

describe("registration", () => {
  it("answers 201 without the password and stores an Argon2id hash", async () => {
    const res = await request(app).post("/auth/register").send(ada);
    expect(res.status).toBe(201);
    expect(JSON.stringify(res.body)).not.toContain(ada.password);
    const { rows } = await pool.query("SELECT password_hash FROM users WHERE email = $1", [ada.email]);
    expect(rows[0].password_hash.startsWith("$argon2id$")).toBe(true);
  });

  it("refuses a duplicate email with 409", async () => {
    await request(app).post("/auth/register").send(ada);
    const res = await request(app).post("/auth/register").send({ ...ada, email: "ADA@example.com" });
    expect(res.status).toBe(409);
  });
});

describe("login", () => {
  beforeEach(async () => {
    await request(app).post("/auth/register").send(ada);
  });

  it("sets an HttpOnly session cookie that opens /me", async () => {
    const res = await request(app).post("/auth/login").send(ada);
    expect(res.status).toBe(204);
    const cookie = res.headers["set-cookie"].find((c) => c.startsWith("sid="));
    expect(cookie).toContain("HttpOnly");
    const me = await request(app).get("/me").set("Cookie", cookie.split(";")[0]);
    expect(me.body.data.email).toBe(ada.email);
  });

  it("answers the same for a wrong password and an unknown email", async () => {
    const wrong = await request(app).post("/auth/login").send({ ...ada, password: "nope" });
    const unknown = await request(app).post("/auth/login").send({ email: "ghost@example.com", password: "nope" });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(wrong.status);
    expect(unknown.body).toEqual(wrong.body);
  });

  it("refuses /me without a session", async () => {
    expect((await request(app).get("/me")).status).toBe(401);
  });
});
`,
          },
          tests: [
            PASSES(5),
            CATCHES("plain-password", "passwords are stored in plain text"),
            CATCHES("enumeration", "an unknown email gets a different answer"),
            CATCHES("no-httponly", "the session cookie is readable by JavaScript"),
          ],
          hint: "After registering, query users for the password_hash. For the cookie: res.headers[\"set-cookie\"].find((c) => c.startsWith(\"sid=\")). For enumeration, compare status and body of the two failed logins with toEqual.",
          successMessage: "Three security properties of the account system, each guarded by a test that fails the moment someone breaks it.",
        },
      },
      {
        id: "a-be-ex-invalid-payloads",
        title: "Exercise: test invalid request payloads",
        explain:
          "An endpoint's validation is a list of rules; its tests are a table of payloads that break exactly one rule each, plus the corner cases: a missing body, the wrong type, extra fields that must be ignored. One it.each per endpoint keeps the table readable and easy to extend.",
        nodeLab: {
          task:
            "Write test/payloads.test.js for POST /enrollments (src/app.js): an it.each table of invalid payloads, each expecting 400 VALIDATION_FAILED with the right field in details: missing email, an invalid email, missing courseCode, a courseCode of the wrong shape, seats 0, seats as a string, a body that is not JSON. Also test that a valid payload is 201 and that an extra field (role: \"admin\") is not stored.",
          command: false,
          files: {
            "package.json": TEST_PKG(),
            "src/bug.js": BUG_JS,
            "src/app.js": `import express from "express";
import { bug } from "./bug.js";

export function createApp() {
  const enrollments = [];
  const app = express();
  app.use(express.json());

  app.post("/enrollments", (req, res) => {
    const body = req.body ?? {};
    const details = [];
    if (!bug("no-email-check") && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(body.email ?? ""))) details.push({ field: "email", message: "must be a valid email" });
    if (!/^[A-Z]{2,3}-\\d{3}$/.test(String(body.courseCode ?? ""))) details.push({ field: "courseCode", message: "must look like BE-101" });
    if (!Number.isInteger(body.seats) || body.seats < (bug("seats-zero") ? 0 : 1)) details.push({ field: "seats", message: "must be a whole number, 1 or more" });
    if (details.length) return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid enrollment", details } });
    const enrollment = bug("mass-assignment") ? { id: enrollments.length + 1, ...body } : { id: enrollments.length + 1, email: body.email, courseCode: body.courseCode, seats: body.seats };
    enrollments.push(enrollment);
    res.status(201).json({ data: enrollment });
  });

  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "The body is not valid JSON", details: [{ field: "body", message: "must be JSON" }] } });
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  });
  return app;
}
`,
            "test/payloads.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const valid = { email: "ada@example.com", courseCode: "BE-101", seats: 1 };
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/app.js"],
          open: "test/payloads.test.js",
          solution: {
            "test/payloads.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const valid = { email: "ada@example.com", courseCode: "BE-101", seats: 1 };
const without = (field) => Object.fromEntries(Object.entries(valid).filter(([k]) => k !== field));

describe("POST /enrollments refuses invalid payloads", () => {
  it.each([
    ["a missing email", without("email"), "email"],
    ["an invalid email", { ...valid, email: "ada@" }, "email"],
    ["a missing courseCode", without("courseCode"), "courseCode"],
    ["a malformed courseCode", { ...valid, courseCode: "be101" }, "courseCode"],
    ["0 seats", { ...valid, seats: 0 }, "seats"],
    ["seats as a string", { ...valid, seats: "2" }, "seats"],
  ])("%s", async (_name, payload, field) => {
    const res = await request(createApp()).post("/enrollments").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_FAILED");
    expect(res.body.error.details.map((d) => d.field)).toContain(field);
  });

  it("a body that is not JSON", async () => {
    const res = await request(createApp()).post("/enrollments").set("Content-Type", "application/json").send("{oops");
    expect(res.status).toBe(400);
  });
});

describe("POST /enrollments accepts a valid payload", () => {
  it("answers 201 and ignores extra fields", async () => {
    const res = await request(createApp()).post("/enrollments").send({ ...valid, role: "admin" });
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ id: 1, ...valid });
  });
});
`,
          },
          tests: [
            PASSES(8),
            CATCHES("no-email-check", "the email is not validated"),
            CATCHES("seats-zero", "0 seats is accepted"),
            CATCHES("mass-assignment", "extra fields such as role are stored"),
          ],
          hint: "it.each([[name, payload, field], …])(\"%s\", async (_name, payload, field) => { … expect(res.body.error.details.map((d) => d.field)).toContain(field) }). For invalid JSON: .set(\"Content-Type\", \"application/json\").send(\"{oops\").",
          successMessage: "The validation rules now have a table of tests next to them; adding a rule means adding a row.",
        },
      },
      {
        id: "a-be-ex-constraint-tests",
        title: "Exercise: test database constraints",
        explain:
          "Constraints are code too: a migration can drop one by accident, and nothing fails until bad data arrives. Test them directly: insert a row that breaks each rule and assert PostgreSQL's error code (23505 unique, 23503 foreign key, 23514 check, 23502 not null). Here the schema is created by createSchema() (as a migration would), so the tests run against exactly what it builds.",
        nodeLab: {
          task:
            "Write test/constraints.test.js: before each test, drop and recreate the tables with createSchema(pool) from src/schema.js. Then assert that PostgreSQL rejects, with the right SQLSTATE code: a duplicate student email (23505), an enrollment for a student who does not exist (23503), a negative course price (23514) and a course without a title (23502). Also check that a valid row is accepted.",
          command: false,
          env: DB_ENV,
          db: { setup: "" },
          files: {
            "package.json": TEST_PKG(["pg"]),
            "src/bug.js": BUG_JS,
            "src/db.js": DB_JS,
            "src/schema.js": `import { bug } from "./bug.js";

/** Builds the schema, as the migrations do. */
export async function createSchema(pool) {
  await pool.query("DROP TABLE IF EXISTS enrollments, students, courses");
  await pool.query(\`CREATE TABLE students (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL\${bug("no-unique-email") ? "" : " UNIQUE"})\`);
  await pool.query(\`CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title text\${bug("nullable-title") ? "" : " NOT NULL"}, price integer NOT NULL\${bug("no-price-check") ? "" : " CHECK (price >= 0)"})\`);
  await pool.query(\`CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL\${bug("no-fk") ? "" : " REFERENCES students (id)"}, course_id integer NOT NULL REFERENCES courses (id))\`);
}
`,
            "test/constraints.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { pool } from "../src/db.js";
import { createSchema } from "../src/schema.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/db.js", "src/schema.js"],
          open: "test/constraints.test.js",
          solution: {
            "test/constraints.test.js": `import { beforeEach, describe, expect, it } from "vitest";
import { pool } from "../src/db.js";
import { createSchema } from "../src/schema.js";

beforeEach(async () => {
  await createSchema(pool);
});

/** The SQLSTATE code PostgreSQL rejects this statement with (null if it is accepted). */
async function codeOf(sql, params) {
  try {
    await pool.query(sql, params);
    return null;
  } catch (err) {
    return err.code;
  }
}

describe("database constraints", () => {
  it("accept valid rows", async () => {
    expect(await codeOf("INSERT INTO students (email) VALUES ('ada@example.com')")).toBeNull();
    expect(await codeOf("INSERT INTO courses (title, price) VALUES ('Backend', 0)")).toBeNull();
  });

  it("refuse a duplicate email (23505)", async () => {
    await pool.query("INSERT INTO students (email) VALUES ('ada@example.com')");
    expect(await codeOf("INSERT INTO students (email) VALUES ('ada@example.com')")).toBe("23505");
  });

  it("refuse an enrollment for a missing student (23503)", async () => {
    await pool.query("INSERT INTO courses (title, price) VALUES ('Backend', 0)");
    expect(await codeOf("INSERT INTO enrollments (student_id, course_id) VALUES (99, 1)")).toBe("23503");
  });

  it("refuse a negative price (23514)", async () => {
    expect(await codeOf("INSERT INTO courses (title, price) VALUES ('Backend', -1)")).toBe("23514");
  });

  it("refuse a course without a title (23502)", async () => {
    expect(await codeOf("INSERT INTO courses (title, price) VALUES (NULL, 0)")).toBe("23502");
  });
});
`,
          },
          tests: [
            PASSES(5),
            CATCHES("no-unique-email", "the email column lost its UNIQUE constraint"),
            CATCHES("no-fk", "enrollments.student_id lost its foreign key"),
            CATCHES("no-price-check", "the price CHECK was dropped"),
            CATCHES("nullable-title", "courses.title became nullable"),
          ],
          hint: "A helper that runs the statement and returns err.code (or null when it succeeds) keeps each test one line: expect(await codeOf(\"INSERT …\")).toBe(\"23505\").",
          successMessage: "If a future migration drops a constraint, a test now fails before any bad data gets in.",
        },
      },
      {
        id: "a-be-ex-unauthorized",
        title: "Exercise: verify unauthorized requests are rejected",
        explain:
          "Week 14's matrix tests the routes you listed. A route added next month without protection is not in it. So also test the API as a whole: list every route the app has (test/routes.js reads Express's router), and assert that each one, except an explicit list of public routes, answers 401 without credentials. A new unprotected route then fails the build by itself.",
        nodeLab: {
          task:
            "Write test/unauthorized.test.js: using listRoutes(app) from test/routes.js (given), check every route except the public ones (GET /courses and GET /health) answers 401 to a request without a session, replacing :params with 1. Also check the public routes answer 200 without one. The checks add an unprotected route to the app (BUG=open-route) and expect your test to fail.",
          command: false,
          files: {
            "package.json": TEST_PKG(),
            "src/bug.js": BUG_JS,
            "src/app.js": `import express from "express";
import { bug } from "./bug.js";

const requireAuth = (req, res, next) => (req.get("authorization") === "Bearer valid" ? next() : res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in" } }));

export const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/courses", (req, res) => res.json({ data: [] }));
app.post("/courses", requireAuth, (req, res) => res.status(201).json({ data: {} }));
app.get("/me", requireAuth, (req, res) => res.json({ data: {} }));
app.get("/me/enrollments", requireAuth, (req, res) => res.json({ data: [] }));
app.delete("/enrollments/:id", requireAuth, (req, res) => res.status(204).end());
app.get("/admin/reports", requireAuth, (req, res) => res.json({ data: [] }));
if (bug("open-route")) app.get("/admin/export", (req, res) => res.json({ data: ["every student's email"] }));
`,
            "test/routes.js": `/** Every route the Express app has, as [method, path] pairs. */
export function listRoutes(app) {
  return app.router.stack
    .filter((layer) => layer.route)
    .flatMap((layer) => Object.keys(layer.route.methods).map((m) => [m.toUpperCase(), layer.route.path]));
}
`,
            "test/unauthorized.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { listRoutes } from "./routes.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/app.js", "test/routes.js"],
          open: "test/unauthorized.test.js",
          solution: {
            "test/unauthorized.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { listRoutes } from "./routes.js";

const PUBLIC = ["GET /health", "GET /courses"];
const routes = listRoutes(app);
const isPublic = ([method, path]) => PUBLIC.includes(\`\${method} \${path}\`);
const send = (method, path) => request(app)[method.toLowerCase()](path.replace(/:[^/]+/g, "1"));

describe("every private route needs a session", () => {
  it.each(routes.filter((r) => !isPublic(r)))("%s %s → 401", async (method, path) => {
    expect((await send(method, path)).status).toBe(401);
  });
});

describe("the public routes are public", () => {
  it.each(routes.filter(isPublic))("%s %s → 200", async (method, path) => {
    expect((await send(method, path)).status).toBe(200);
  });
});

it("finds the app's routes", () => {
  expect(routes.length).toBeGreaterThanOrEqual(7);
});
`,
          },
          tests: [
            PASSES(8),
            CATCHES("open-route", "a new route was added without requireAuth"),
            { label: "The test reads the routes from the app, not a hand-written list", check: `has(file("test/unauthorized.test.js"), "listRoutes(app)", "build the cases from listRoutes(app), so new routes are tested automatically");` },
          ],
          hint: "const routes = listRoutes(app); then it.each(routes.filter(notPublic))(\"%s %s → 401\", async (method, path) => { … request(app)[method.toLowerCase()](path.replace(/:[^/]+/g, \"1\")) … }).",
          successMessage: "The suite now protects routes nobody has written yet: the day someone forgets requireAuth, CI goes red.",
        },
      },
      {
        id: "a-be-ex-ci",
        title: "Exercise: run the test suite automatically on pull requests",
        explain:
          "A GitHub Actions workflow for a Node API with PostgreSQL: trigger on pull requests (and pushes to main); one job on ubuntu-latest; a postgres service container with a password, port 5432 and a health check, so tests wait until it is ready; steps: actions/checkout, actions/setup-node (Node 24, npm cache), npm ci (exactly the lockfile), run migrations, then npm test with DATABASE_URL pointing at the service. Then require the job in the branch protection rules.",
        nodeLab: {
          task:
            "Write .github/workflows/test.yml: run on pull_request and on push to main; a job named test on ubuntu-latest with a postgres:18 service (POSTGRES_PASSWORD set, port 5432:5432, a pg_isready health check); steps actions/checkout@v4, actions/setup-node@v4 with node-version 24 and cache npm, npm ci, npx prisma migrate deploy, and npm test, with DATABASE_URL set for the migration and test steps.",
          command: false,
          files: { "package.json": TEST_PKG(["yaml"]), ".github/workflows/test.yml": "name: Tests\n" },
          readOnly: ["package.json"],
          open: ".github/workflows/test.yml",
          solution: {
            ".github/workflows/test.yml": `name: Tests

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
          POSTGRES_DB: academy_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/academy_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm test
`,
          },
          tests: [
            { label: "It runs on pull requests and on pushes to main", check: `const YAML = await load("yaml"); const w = YAML.parse(file(".github/workflows/test.yml") || "") || {}; const on = w.on ?? w[true]; assert(on && "pull_request" in on, "trigger on pull_request"); assert([].concat(on.push?.branches || []).includes("main"), "and on push to main");` },
            { label: "A test job on ubuntu-latest with a healthy PostgreSQL service", check: `const YAML = await load("yaml"); const w = YAML.parse(file(".github/workflows/test.yml") || "") || {}; const job = w.jobs?.test; assert(job, "a job named test"); eq(job["runs-on"], "ubuntu-latest", "runs-on"); const pg = job.services?.postgres; assert(pg && /^postgres:18/.test(pg.image), "a postgres:18 service"); assert(pg.env?.POSTGRES_PASSWORD, "POSTGRES_PASSWORD"); assert([].concat(pg.ports || []).some((p) => String(p).includes("5432")), "port 5432"); has(String(pg.options || ""), "pg_isready", "a pg_isready health check");` },
            { label: "Checkout, Node 24 with npm cache, npm ci, migrations, npm test", check: `const YAML = await load("yaml"); const w = YAML.parse(file(".github/workflows/test.yml") || "") || {}; const steps = w.jobs?.test?.steps || []; const uses = steps.map((s) => s.uses).filter(Boolean); assert(uses.some((u) => /^actions\\/checkout@v\\d/.test(u)), "actions/checkout"); const node = steps.find((s) => /^actions\\/setup-node@v\\d/.test(s.uses || "")); assert(node, "actions/setup-node"); eq([String(node.with?.["node-version"]), node.with?.cache], ["24", "npm"], "node-version 24 and cache npm"); const runs = steps.map((s) => s.run).filter(Boolean); const at = (re) => runs.findIndex((r) => re.test(r)); assert(at(/^npm ci\\b/) >= 0, "npm ci (not npm install)"); assert(at(/prisma migrate deploy/) > at(/^npm ci\\b/), "migrations after npm ci"); assert(at(/^npm test\\b/) > at(/prisma migrate deploy/), "npm test after the migrations");` },
            { label: "DATABASE_URL reaches the migration and test steps", check: `const YAML = await load("yaml"); const w = YAML.parse(file(".github/workflows/test.yml") || "") || {}; const job = w.jobs?.test || {}; const steps = job.steps || []; const has = (s) => Boolean(job.env?.DATABASE_URL || w.env?.DATABASE_URL || s.env?.DATABASE_URL); for (const re of [/prisma migrate deploy/, /^npm test\\b/]) { const s = steps.find((x) => re.test(x.run || "")); assert(s && has(s), "set DATABASE_URL for: " + re.source); } assert(/localhost:5432/.test(JSON.stringify(job.env || w.env || steps.map((s) => s.env))), "DATABASE_URL should point at the service on localhost:5432");` },
          ],
          hint: "Copy the shape: on: { pull_request: , push: { branches: [main] } }, jobs.test with runs-on, services.postgres (image, env, ports, options with --health-cmd pg_isready), env.DATABASE_URL, and the five steps.",
          successMessage: "Every pull request now gets a fresh PostgreSQL, the exact dependencies, the migrations and the full suite, with the result shown on the pull request itself.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 114 · 15.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l114-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["15.P"],
    title: "Deliverable: A Test Suite for the Course API",
    subtitle: "Business logic, critical routes and security boundaries",
    estimatedMinutes: 120,
    intro: "The deliverable is a suite a reviewer can trust: it covers the business rules, the routes clients depend on and the security boundaries, and it fails when any of them is broken.",
    atoms: [
      {
        id: "a-be-test-suite",
        title: "A test suite worth trusting",
        explain:
          "A good backend suite: unit tests for the business rules (pricing, eligibility), integration tests for every critical route (success and failure), authorization tests for every boundary (anonymous, wrong role, someone else's record), all independent and fast enough to run on every change. The final check here works like a reviewer: it breaks the API in six different ways and expects your suite to notice every time.",
        nodeLab: {
          task:
            "Write the test suite for the enrollment API in src/app.js (read src/app.js first: it documents its rules). Cover the pricing rule (src/pricing.js), the routes (GET /courses, POST /enrollments with its validation and seats, GET /enrollments/:id) and the security boundaries (no token → 401, another student's enrollment → 404, admin access). Use as many test files in test/ as you like. The checks run your suite on the correct app and on six broken ones.",
          command: false,
          files: {
            "package.json": TEST_PKG(),
            "src/bug.js": BUG_JS,
            "src/pricing.js": `import { bug } from "./bug.js";

/** Price per seat in naira: 15% off for 5 seats or more, never below 5,000. */
export function seatPrice(price, seats) {
  const discounted = seats >= (bug("bulk-boundary") ? 6 : 5) ? price * 0.85 : price;
  return Math.max(bug("no-floor") ? 0 : 5000, Math.round(discounted));
}
`,
            "src/app.js": `import express from "express";
import { bug } from "./bug.js";
import { seatPrice } from "./pricing.js";

/**
 * The enrollment API. Tokens: "Bearer ada" and "Bearer bayo" (students), "Bearer kemi" (admin).
 * GET /courses                public
 * POST /enrollments           students; { courseCode, seats } (seats 1–10, enough left) → 201
 * GET /enrollments/:id        the enrollment's student or an admin; others 404
 */
const USERS = { ada: { id: 1, role: "student" }, bayo: { id: 2, role: "student" }, kemi: { id: 3, role: "admin" } };

export function createApp() {
  const courses = [{ code: "BE-101", price: 120000, seatsLeft: 6 }, { code: "QA-101", price: 5500, seatsLeft: 20 }];
  const enrollments = [];
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = USERS[(req.get("authorization") || "").replace("Bearer ", "")] ?? null;
    next();
  });
  const requireUser = (req, res, next) => (req.user || bug("auth-open") ? next() : res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in" } }));

  app.get("/courses", (req, res) => res.json({ data: courses.map(({ code, price, seatsLeft }) => ({ code, price, seatsLeft })) }));

  app.post("/enrollments", requireUser, (req, res) => {
    const { courseCode, seats } = req.body ?? {};
    const course = courses.find((c) => c.code === courseCode);
    if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
    if (!Number.isInteger(seats) || seats < 1 || seats > (bug("seat-limit") ? 100 : 10)) return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "seats must be 1 to 10" } });
    if (seats > course.seatsLeft && !bug("oversell")) return res.status(409).json({ error: { code: "NOT_ENOUGH_SEATS", message: "Not enough seats left" } });
    course.seatsLeft -= seats;
    const enrollment = { id: enrollments.length + 1, studentId: req.user?.id ?? 0, courseCode, seats, total: seatPrice(course.price, seats) * seats };
    enrollments.push(enrollment);
    res.status(201).json({ data: enrollment });
  });

  app.get("/enrollments/:id", requireUser, (req, res) => {
    const e = enrollments.find((x) => x.id === Number(req.params.id));
    const allowed = e && (bug("idor") || req.user?.role === "admin" || e.studentId === req.user?.id);
    if (!allowed) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
    res.json({ data: e });
  });

  return app;
}
`,
            "test/pricing.test.js": `import { describe, expect, it } from "vitest";
import { seatPrice } from "../src/pricing.js";
`,
          },
          readOnly: ["package.json", "src/bug.js", "src/pricing.js", "src/app.js"],
          open: "test/pricing.test.js",
          solution: {
            "test/pricing.test.js": `import { describe, expect, it } from "vitest";
import { seatPrice } from "../src/pricing.js";

describe("seatPrice", () => {
  it("charges the full price below 5 seats", () => expect(seatPrice(120000, 4)).toBe(120000));
  it("gives 15% off from 5 seats", () => expect(seatPrice(120000, 5)).toBe(102000));
  it("never goes below 5,000", () => expect(seatPrice(5500, 5)).toBe(5000));
});
`,
            "test/enrollments.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

let app;
beforeEach(() => {
  app = createApp();
});
const as = (name) => ({ Authorization: \`Bearer \${name}\` });
const enroll = (name, body) => request(app).post("/enrollments").set(as(name)).send(body);

describe("GET /courses", () => {
  it("is public", async () => {
    const res = await request(app).get("/courses");
    expect(res.status).toBe(200);
    expect(res.body.data.map((c) => c.code)).toEqual(["BE-101", "QA-101"]);
  });
});

describe("POST /enrollments", () => {
  it("enrolls a student and charges the total", async () => {
    const res = await enroll("ada", { courseCode: "BE-101", seats: 2 });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ studentId: 1, courseCode: "BE-101", seats: 2, total: 240000 });
  });

  it.each([[0], [11], ["3"]])("refuses %s seats", async (seats) => {
    expect((await enroll("ada", { courseCode: "BE-101", seats })).status).toBe(400);
  });

  it("refuses more seats than are left", async () => {
    await enroll("ada", { courseCode: "BE-101", seats: 5 });
    const res = await enroll("bayo", { courseCode: "BE-101", seats: 2 });
    expect(res.status).toBe(409);
  });

  it("answers 404 for an unknown course", async () => {
    expect((await enroll("ada", { courseCode: "XX-999", seats: 1 })).status).toBe(404);
  });

  it("needs a token", async () => {
    expect((await request(app).post("/enrollments").send({ courseCode: "BE-101", seats: 1 })).status).toBe(401);
  });
});

describe("GET /enrollments/:id", () => {
  beforeEach(async () => {
    await enroll("ada", { courseCode: "BE-101", seats: 1 });
  });

  it("shows the student her enrollment", async () => {
    expect((await request(app).get("/enrollments/1").set(as("ada"))).status).toBe(200);
  });

  it("hides it from another student", async () => {
    expect((await request(app).get("/enrollments/1").set(as("bayo"))).status).toBe(404);
  });

  it("shows it to an admin", async () => {
    expect((await request(app).get("/enrollments/1").set(as("kemi"))).status).toBe(200);
  });

  it("needs a token", async () => {
    expect((await request(app).get("/enrollments/1")).status).toBe(401);
  });
});
`,
          },
          tests: [
            PASSES(15),
            CATCHES("bulk-boundary", "5 seats no longer get the bulk discount"),
            CATCHES("no-floor", "the 5,000 minimum price is gone"),
            CATCHES("seat-limit", "more than 10 seats are accepted"),
            CATCHES("oversell", "more seats can be sold than are left"),
            CATCHES("idor", "any student can read any enrollment"),
            CATCHES("auth-open", "requests without a token are accepted"),
          ],
          hint: "Read the comment at the top of src/app.js: every rule there needs a test for the accepted side and the refused side. Each boundary (5 seats, 10 seats, the 5,000 floor) needs the value exactly at it.",
          successMessage: "Six different ways to break the API, and your suite caught every one. That is the suite to carry into the capstone.",
        },
      },
    ],
    task: {
      title: "Week 15 deliverable: an automated test suite for the course API",
      intro: "Test your own course API.",
      prompts: [
        "npm install --save-dev vitest supertest @vitest/coverage-v8; make app.js export the app (and server.js listen), and point the tests at a separate test database.",
        "Write unit tests for your business rules, integration tests for every critical route, and the authorization matrix and route sweep from this week.",
        "Break your own API on purpose (remove a check, change a boundary) and confirm a test fails each time; fix any gaps.",
        "Add the GitHub Actions workflow of Exercise 15.15 and make it required for merging. Look at the coverage report and test the branches it shows as missed.",
        "Checkpoint: your suite fails when a reviewer breaks the business logic, a route or a permission check, and runs on every pull request.",
      ],
      closing: "Next: Week 16, error handling, reliability and API quality.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
