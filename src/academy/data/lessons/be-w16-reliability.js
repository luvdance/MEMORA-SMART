/**
 * BACKEND ENGINEERING · WEEK 16 · ERROR HANDLING, RELIABILITY AND API QUALITY
 *
 * Curriculum 16.1 – 16.P. Kinds of errors; structured error responses and
 * classification; logs without secrets; request ids; timeouts, retries and
 * backoff; third-party failures (a circuit breaker); idempotency keys;
 * contract tests; health checks; four exercises; and a reliable API.
 *
 * The labs talk to a payment provider that runs inside the lab (the same
 * origin as Week 8's): the checks make it fail, rate-limit, hang, or make a
 * charge and then lose the answer, and count the charges it really made.
 * dbDown() in a check takes the lab's PostgreSQL down and back up.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s16-reliability";
const MODULE = "be-w16-reliability";

const PAY_API = "https://api.payments.example";
const PAY_KEY = "sk_test_academy";
const PAY_ENV = { PAYMENTS_API_URL: PAY_API, PAYMENTS_SECRET_KEY: PAY_KEY };
const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
const ENV_FILE = `DATABASE_URL=${DB_URL}\nPAYMENTS_API_URL=${PAY_API}\nPAYMENTS_SECRET_KEY=${PAY_KEY}\n`;
const ENV_PAY_FILE = `PAYMENTS_API_URL=${PAY_API}\nPAYMENTS_SECRET_KEY=${PAY_KEY}\n`;
const START = { start: "node --env-file=.env server.js" };
const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// Without this, an idle connection that the database drops crashes the process.
pool.on("error", (err) => console.error(\`database pool: \${err.message}\`));
`;

/**
 * The payment provider. locals: failNext (answer failStatus to the next n
 * requests), limitNext (429 with Retry-After: 2), delayMs (answer slowly),
 * loseNext (make the charge, then never answer in time), charges (made).
 */
const PAY_SERVICE = `const express = require("express");
const app = express();
app.use(express.json());
Object.assign(app.locals, { failNext: 0, failStatus: 500, limitNext: 0, delayMs: 0, loseNext: 0, charges: [], keys: new Map() });

app.use(async (req, res, next) => {
  if (app.locals.delayMs) await new Promise((resolve) => setTimeout(resolve, app.locals.delayMs));
  if (app.locals.limitNext > 0) {
    app.locals.limitNext -= 1;
    res.set("Retry-After", "2");
    return res.status(429).json({ error: { code: "rate_limited", message: "Too many requests" } });
  }
  if (app.locals.failNext > 0) {
    app.locals.failNext -= 1;
    return res.status(app.locals.failStatus).json({ error: { code: "provider_error", message: "Internal error" } });
  }
  if (req.get("authorization") !== "Bearer sk_test_academy") return res.status(401).json({ error: { code: "invalid_key", message: "Invalid secret key" } });
  next();
});

app.post("/v1/charges", async (req, res) => {
  const key = req.get("idempotency-key");
  if (key && app.locals.keys.has(key)) {
    const saved = app.locals.keys.get(key);
    res.set("Idempotent-Replayed", "true");
    return res.status(saved.status).json(saved.body);
  }
  const { amount, currency, reference, card } = req.body || {};
  let status, body;
  if (!Number.isInteger(amount) || amount <= 0 || currency !== "NGN" || !reference) {
    status = 400;
    body = { error: { code: "invalid_request", message: "amount (in kobo), currency NGN and reference are required" } };
  } else if (card === "4000000000000002") {
    status = 402;
    body = { error: { code: "card_declined", message: "The card was declined" } };
  } else {
    const charge = { id: "ch_" + (app.locals.charges.length + 1), amount, currency, reference, status: "succeeded" };
    app.locals.charges.push(charge);
    status = 201;
    body = charge;
  }
  if (key) app.locals.keys.set(key, { status, body });
  if (app.locals.loseNext > 0) {
    // The charge is made, but the answer arrives far too late.
    app.locals.loseNext -= 1;
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
  res.status(status).json(body);
});

app.get("/v1/charges", (req, res) => {
  res.json({ data: app.locals.charges.filter((c) => !req.query.reference || c.reference === req.query.reference) });
});

module.exports = app;
`;
const SERVICES = { [PAY_API]: PAY_SERVICE };

/** Check preamble: the provider, and how many charges it made for a reference. */
const PAY = `const pay = service("${PAY_API}"); const charges = (ref) => pay.locals.charges.filter((c) => c.reference === ref).length; const calls = () => outgoing().filter((o) => o.url.startsWith("${PAY_API}"));`;
/** Check preamble: stdout's JSON lines. */
const LINES = `const lines = () => stdout().split("\\n").filter((l) => l.trim() && !l.startsWith("> ")).map((l) => { try { return JSON.parse(l); } catch { return { notJson: l }; } });`;
const UUID = `const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;`;

const ORDERS_SQL = `CREATE TABLE orders (
  id         integer PRIMARY KEY,
  student_id integer NOT NULL,
  amount     integer NOT NULL, -- kobo
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'unknown')),
  charge_id  text
);
INSERT INTO orders (id, student_id, amount) VALUES (1, 1, 12000000), (2, 1, 8000000), (3, 2, 9000000), (4, 2, 12000000), (5, 3, 8000000), (6, 3, 9000000);
`;
const GOOD_CARD = "4242424242424242";
const BAD_CARD = "4000000000000002";

/* ── Week 16's retrying payments client (16.6, used again in 16.P) ────── */

const PAYMENTS_CLIENT_JS = (timeoutMs) => `import { randomUUID } from "node:crypto";

export class ProviderUnavailableError extends Error {}

const retryable = (status) => status === 408 || status === 429 || status >= 500;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a charge. Retries timeouts, network errors, 408, 429 and 5xx with
 * exponential backoff (or the Retry-After the provider asks for), always with
 * the same Idempotency-Key, so a retry can never charge twice.
 * Returns { status, body } for any other answer.
 */
export async function charge(body, { idempotencyKey = randomUUID(), retries = 3, baseMs = 200, timeoutMs = ${timeoutMs} } = {}) {
  let last;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(last.retryAfterMs ?? baseMs * 2 ** (attempt - 1));
    try {
      const res = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/charges\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\`,
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!retryable(res.status)) return { status: res.status, body: await res.json() };
      const after = Number(res.headers.get("retry-after"));
      last = { message: \`the provider answered \${res.status}\`, retryAfterMs: after > 0 ? after * 1000 : undefined };
    } catch (err) {
      last = { message: \`the provider could not be reached (\${err.name})\` };
    }
  }
  throw new ProviderUnavailableError(\`Payments: \${last.message}, after \${retries + 1} attempts\`);
}
`;

/** The learner's suite passes (min tests). */
const PASSES = (min) => ({
  label: `Your tests pass against the correct app (${min}+ tests)`,
  check: `const results = await runTests("npm test"); assert(results.length >= ${min}, "write at least ${min} tests: found " + results.length); eq(results.filter((t) => t.state === "fail").map((t) => t.name), [], "every test should pass against the correct app");`,
});
const CATCHES = (bug, what) => ({
  label: `They catch: ${what}`,
  check: `const r = await runTests("BUG=${bug} npm test"); assert(r.some((t) => t.state === "fail"), "with BUG=${bug} (${what.replace(/"/g, "'")}) at least one of your tests must fail");`,
});
const BUG_JS = `/** For this exercise: BUG=<name> switches one behaviour off, to prove the tests notice. */
export const bug = (name) => process.env.BUG === name;
`;

/* ── The structured-logging pieces (16.4, given in 16.5) ──────────────── */

const LOGGER_JS = `const SECRET = /pass(word)?|token|secret|authorization|cookie|card|cvv|api[-_]?key/i;

/** A copy of value with every secret-looking field replaced, at any depth. */
export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, SECRET.test(k) ? "[REDACTED]" : redact(v)]));
  }
  return value;
}

/** The URL with secret-looking query parameters replaced. */
export function redactUrl(url) {
  const [path, query] = url.split("?");
  if (!query) return url;
  const params = new URLSearchParams(query);
  for (const key of [...params.keys()]) if (SECRET.test(key)) params.set(key, "[REDACTED]");
  return \`\${path}?\${params}\`;
}

/** One JSON line per event: easy to search, filter and ship to a log service. */
export function log(level, msg, fields = {}) {
  console.log(JSON.stringify({ time: new Date().toISOString(), level, msg, ...redact(fields) }));
}

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    log(res.statusCode >= 500 ? "error" : "info", "request", {
      requestId: req.id,
      method: req.method,
      path: redactUrl(req.originalUrl),
      status: res.statusCode,
      ms: Date.now() - start,
      headers: req.headers,
      body: req.body,
    });
  });
  next();
}
`;

/* ── 16.14: two days of logs from two API instances ───────────────────── */

const logFile = (day, entries) =>
  entries.map(([time, instance, level, requestId, msg, extra = {}]) => JSON.stringify({ time: `${day}T${time}Z`, level, instance, ...(requestId ? { requestId } : {}), msg, ...extra })).join("\n") + "\n";
const TIMEOUT_ERR = (n) => ({ err: { name: "TimeoutError", message: `payments: attempt ${n} got no answer within 2000 ms` } });
// Each instance appends to its own file; the files were joined, so the lines are not in time order.
const LOG_TODAY = logFile("2026-10-27", [
  ["09:14:01.020", "api-1", "info", null, "listening", { port: 3000 }],
  ["09:14:02.101", "api-1", "info", "req-a1f3", "request started", { method: "GET", path: "/courses" }],
  ["09:14:02.164", "api-1", "info", "req-a1f3", "request finished", { status: 200, ms: 63 }],
  ["09:14:04.010", "api-1", "info", "req-c9d4", "request started", { method: "POST", path: "/orders/42/pay" }],
  ["09:14:04.031", "api-1", "info", "req-c9d4", "charging card", { orderId: 42, amount: 8000000 }],
  ["09:14:04.402", "api-1", "info", "req-c9d4", "order paid", { orderId: 42, chargeId: "ch_918" }],
  ["09:14:04.405", "api-1", "info", "req-c9d4", "request finished", { status: 200, ms: 395 }],
  ["09:14:07.700", "api-1", "warn", "req-e5f0", "slow query", { ms: 840, query: "SELECT … FROM lesson_views" }],
  ["09:14:01.050", "api-2", "info", null, "listening", { port: 3000 }],
  ["09:14:03.120", "api-2", "info", "req-b7c2", "request started", { method: "POST", path: "/orders/41/pay" }],
  ["09:14:03.140", "api-2", "info", "req-b7c2", "charging card", { orderId: 41, amount: 12000000 }],
  ["09:14:05.141", "api-2", "warn", "req-b7c2", "payment attempt failed", TIMEOUT_ERR(1)],
  ["09:14:05.342", "api-2", "info", "req-d2e8", "request started", { method: "GET", path: "/courses/99" }],
  ["09:14:05.350", "api-2", "warn", "req-d2e8", "request finished", { status: 404, ms: 8 }],
  ["09:14:07.543", "api-2", "warn", "req-b7c2", "payment attempt failed", TIMEOUT_ERR(2)],
  ["09:14:09.944", "api-2", "warn", "req-b7c2", "payment attempt failed", TIMEOUT_ERR(3)],
  ["09:14:09.946", "api-2", "error", "req-b7c2", "unhandled error", { err: { name: "ProviderUnavailableError", message: "payments: no answer after 3 attempts" } }],
  ["09:14:09.950", "api-2", "error", "req-b7c2", "request finished", { status: 500, ms: 6830 }],
]);
const LOG_YESTERDAY = logFile("2026-10-26", [
  ["16:02:10.000", "api-2", "info", "req-y1a0", "request started", { method: "GET", path: "/me" }],
  ["16:02:10.410", "api-2", "error", "req-y1a0", "unhandled error", { err: { name: "Error", message: "connect ECONNREFUSED 10.0.3.7:5432" } }],
  ["16:02:10.412", "api-2", "error", "req-y1a0", "request finished", { status: 500, ms: 412 }],
  ["16:02:09.100", "api-1", "info", "req-y0z9", "request started", { method: "GET", path: "/courses" }],
  ["16:02:09.900", "api-1", "error", "req-y0z9", "unhandled error", { err: { name: "Error", message: "connect ECONNREFUSED 10.0.3.7:5432" } }],
  ["16:02:09.903", "api-1", "error", "req-y0z9", "request finished", { status: 500, ms: 803 }],
]);
/** Check preamble: the reference trace of a request, and the reference error list. */
const TRACE = `const parseLog = (p) => file(p).split("\\n").filter(Boolean).map((l) => JSON.parse(l)).sort((a, b) => a.time.localeCompare(b.time)); const fmt = (e) => e.time.slice(11, 23) + " [" + e.instance + "] " + e.level.toUpperCase() + " " + e.msg + (e.err ? ": " + e.err.message : ""); const expectTrace = (p, id) => parseLog(p).filter((e) => e.requestId === id).map(fmt).join("\\n"); const expectErrors = (p) => parseLog(p).filter((e) => e.level === "error" && e.err).map((e) => e.requestId + " " + e.msg + ": " + e.err.message).join("\\n");`;

/* ── 16.9: the web app team's contract, and the API it describes ──────── */

const CONTRACT = JSON.stringify(
  {
    consumer: "academy-web",
    provider: "course-api",
    rules:
      'A type ("string", "integer", "number", "boolean", or alternatives such as "string|null") matches any value of that type; any other string must match exactly. An object matches when every listed field matches (extra fields are fine). An array must be non-empty and every item must match its one element.',
    interactions: [
      { description: "the course list", request: { method: "GET", path: "/courses" }, response: { status: 200, body: { data: [{ id: "integer", code: "string", title: "string", price: "integer", instructor: { name: "string" } }] } } },
      { description: "one course", request: { method: "GET", path: "/courses/1" }, response: { status: 200, body: { data: { id: "integer", code: "string", title: "string", price: "integer", instructor: { name: "string" }, startsAt: "string|null" } } } },
      { description: "a missing course", request: { method: "GET", path: "/courses/99" }, response: { status: 404, body: { error: { code: "COURSE_NOT_FOUND", message: "string" } } } },
      { description: "an invalid enrollment", request: { method: "POST", path: "/enrollments", body: { courseId: 1 } }, response: { status: 400, body: { error: { code: "VALIDATION_FAILED", message: "string", details: [{ field: "string", message: "string" }] } } } },
      { description: "an enrollment", request: { method: "POST", path: "/enrollments", body: { courseId: 1, email: "ada@example.com" } }, response: { status: 201, body: { data: { id: "integer", courseId: "integer", status: "string" } } } },
    ],
  },
  null,
  2
) + "\n";
const CONTRACT_APP_JS = `import express from "express";
import { bug } from "./bug.js";

export function createApp() {
  const courses = [
    { id: 1, code: "BE-101", title: "Backend Engineering", price: 120000, instructor: { id: 3, name: "Ngozi Eze" }, startsAt: "2026-11-02" },
    { id: 2, code: "DB-101", title: "Relational Databases", price: 80000, instructor: { id: 3, name: "Ngozi Eze" }, startsAt: null },
  ];
  const view = (c) => ({
    id: c.id,
    code: c.code,
    [bug("renamed-title") ? "name" : "title"]: c.title,
    price: bug("price-string") ? String(c.price) : c.price,
    instructor: { name: c.instructor.name },
    startsAt: c.startsAt,
    weeks: 24, // a field the web app does not use: allowed
  });
  const enrollments = [];
  const app = express();
  app.use(express.json());

  app.get("/courses", (req, res) => res.json({ data: courses.map(view) }));

  app.get("/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === Number(req.params.id));
    if (!course) return res.status(404).json(bug("error-shape") ? { message: "No such course" } : { error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
    res.json({ data: view(course) });
  });

  app.post("/enrollments", (req, res) => {
    const { courseId, email } = req.body ?? {};
    const details = [];
    if (!courses.some((c) => c.id === courseId)) details.push({ field: "courseId", message: "must be an existing course" });
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(email ?? ""))) details.push({ field: "email", message: "must be a valid email" });
    if (details.length) return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid enrollment", ...(bug("no-details") ? {} : { details }) } });
    const enrollment = { id: enrollments.length + 1, courseId, email, status: "active" };
    enrollments.push(enrollment);
    res.status(bug("enroll-200") ? 200 : 201).json({ data: enrollment });
  });

  return app;
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 115 · 16.1 – 16.3 · ERRORS: KINDS, RESPONSES, CLASSIFICATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l115-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3"],
    title: "Operational vs Programming Errors, Structured Responses and Classification",
    subtitle: "Every failure answered on purpose",
    estimatedMinutes: 85,
    intro:
      "Production APIs fail all the time: bad input, missing records, a database restart, a slow provider. A reliable API decides in advance how each kind of failure is answered, logged and recovered from, so clients can react and engineers can diagnose.",
    atoms: [
      {
        id: "a-be-error-kinds",
        title: "Operational vs programming errors",
        explain:
          "OPERATIONAL errors are expected conditions of a running system, not bugs: invalid input, a record not found, a duplicate email, a timeout from the payment provider, a database restart. Handle them: answer a precise 4xx (the client can fix it) or 503/504 (try again later), and maybe retry. PROGRAMMING errors are bugs: reading a property of undefined, a typo in a column name (42P01), a wrong argument. They cannot be handled sensibly at runtime: answer a generic 500 that reveals nothing, log the full stack trace with the request id, alert, and fix the code. A process in an unknown state after an uncaught exception should exit and be restarted by its supervisor.",
        decision: decide({
          scenario: "POST /enrollments fails in three ways in one day: (1) the email is malformed, (2) PostgreSQL was restarting and refused the connection, (3) the handler read req.body.course.id when the client sent courseId.",
          question: "How should each be answered?",
          right: ["(1) 400 with the field's detail, (2) 503 so the client retries later, (3) a generic 500, the stack trace logged and a bug filed", "Two operational errors, one programming error."],
          wrong: [
            ["All three: 500 Internal Server Error", "The client cannot tell what to fix or when to retry."],
            ["All three: 400 with err.message", "Blames the client for the server's problems and leaks internals."],
            ["(3) 400, because the client sent unexpected input", "The code is wrong: the client used the documented field."],
          ],
          at: 0,
          aftermath: "The next two labs turn this classification into code: one error handler, one classifier.",
        }),
      },
      {
        id: "a-be-error-responses",
        title: "Structured error responses",
        explain:
          "Every error from the API has the same shape, so clients need one piece of code to handle them: { error: { code, message, details? } }. code is a stable, machine-readable constant (COURSE_NOT_FOUND: clients branch on it), message is for humans (it may change), details lists per-field problems. Express 5 sends thrown errors (also from async handlers) to the error-handling middleware, a function with four arguments registered last. Error classes carry the status and code (throw new NotFoundError(\"Course\")); the handler turns them into the response. Anything that is not one of your errors is a programming error: a generic 500, with the stack trace only in the logs.",
        nodeLab: {
          task:
            "In errors.js, write AppError(status, code, message, details) and its subclasses ValidationError(details) → 400 VALIDATION_FAILED \"The request is invalid\"; NotFoundError(\"Course\") → 404 COURSE_NOT_FOUND \"Course not found\"; ConflictError(code, message) → 409. Then notFound (unknown routes: 404 ROUTE_NOT_FOUND \"No route for GET /path\") and errorHandler: AppErrors as { error: { code, message, details? } }; a body that is not JSON → 400 INVALID_JSON \"The request body is not valid JSON\"; anything else → log it with console.error and answer 500 INTERNAL_ERROR \"Something went wrong\".",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] }),
            "errors.js": `export class AppError extends Error {}
export class ValidationError extends AppError {}
export class NotFoundError extends AppError {}
export class ConflictError extends AppError {}

export function notFound(req, res, next) {
  next();
}

export function errorHandler(err, req, res, next) {
  next(err);
}
`,
            "server.js": `import express from "express";
import { ConflictError, NotFoundError, ValidationError, errorHandler, notFound } from "./errors.js";

const app = express();
app.use(express.json());

const courses = [{ id: 1, code: "BE-101", title: "Backend Engineering" }];

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) throw new NotFoundError("Course");
  res.json({ data: course });
});

app.post("/courses", (req, res) => {
  const { code, title } = req.body ?? {};
  const details = [];
  if (!/^[A-Z]{2,3}-\\d{3}$/.test(String(code ?? ""))) details.push({ field: "code", message: "must look like BE-101" });
  if (typeof title !== "string" || title.trim().length < 3) details.push({ field: "title", message: "must be at least 3 characters" });
  if (details.length) throw new ValidationError(details);
  if (courses.some((c) => c.code === code)) throw new ConflictError("COURSE_EXISTS", \`A course with code \${code} already exists\`);
  const course = { id: courses.length + 1, code, title };
  courses.push(course);
  res.status(201).json({ data: course });
});

// A programming error: report is undefined.
app.get("/reports/broken", (req, res) => {
  const report = undefined;
  res.json({ total: report.total });
});

app.use(notFound);
app.use(errorHandler);

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", "server.js"],
          open: "errors.js",
          solution: {
            "errors.js": `/** An error the API answers on purpose: it carries its status and code. */
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    if (details) this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(details) {
    super(400, "VALIDATION_FAILED", "The request is invalid", details);
  }
}

export class NotFoundError extends AppError {
  constructor(what) {
    super(404, \`\${what.toUpperCase()}_NOT_FOUND\`, \`\${what} not found\`);
  }
}

export class ConflictError extends AppError {
  constructor(code, message) {
    super(409, code, message);
  }
}

export function notFound(req, res, next) {
  next(new AppError(404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));
}

export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") err = new AppError(400, "INVALID_JSON", "The request body is not valid JSON");
  if (!(err instanceof AppError)) {
    console.error(err); // a programming error: the stack trace is for us, not the client
    err = new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  }
  const error = { code: err.code, message: err.message };
  if (err.details) error.details = err.details;
  res.status(err.status).json({ error });
}
`,
          },
          tests: [
            { label: "The error classes carry status and code", check: `const m = await load("errors.js"); const e = new m.NotFoundError("Course"); assert(e instanceof m.AppError && e instanceof Error, "NotFoundError should extend AppError, which extends Error"); eq([e.status, e.code, e.message], [404, "COURSE_NOT_FOUND", "Course not found"], "NotFoundError(\\"Course\\")"); const v = new m.ValidationError([{ field: "x", message: "y" }]); eq([v.status, v.code, v.details], [400, "VALIDATION_FAILED", [{ field: "x", message: "y" }]], "ValidationError(details)"); const c = new m.ConflictError("COURSE_EXISTS", "Taken"); eq([c.status, c.code], [409, "COURSE_EXISTS"], "ConflictError");` },
            { label: "Not found: 404 COURSE_NOT_FOUND", check: `const r = await get("/courses/9"); eq(r.status, 404, "status"); eq(r.json, { error: { code: "COURSE_NOT_FOUND", message: "Course not found" } }, "body");` },
            { label: "Invalid input: 400 with a detail per field", check: `const r = await post("/courses", { code: "be1", title: "x" }); eq(r.status, 400, "status"); eq(r.json, { error: { code: "VALIDATION_FAILED", message: "The request is invalid", details: [{ field: "code", message: "must look like BE-101" }, { field: "title", message: "must be at least 3 characters" }] } }, "body");` },
            { label: "A duplicate: 409 COURSE_EXISTS", check: `const r = await post("/courses", { code: "BE-101", title: "Backend again" }); eq(r.status, 409, "status"); eq(r.json, { error: { code: "COURSE_EXISTS", message: "A course with code BE-101 already exists" } }, "body");` },
            { label: "A body that is not JSON: 400 INVALID_JSON", check: `const r = await request("POST", "/courses", { body: "{oops", headers: { "Content-Type": "application/json" } }); eq(r.status, 400, "status"); eq(r.json, { error: { code: "INVALID_JSON", message: "The request body is not valid JSON" } }, "body (not Express's HTML error page)");` },
            { label: "An unknown route: 404 ROUTE_NOT_FOUND", check: `const r = await get("/nope"); eq(r.status, 404, "status"); eq(r.json, { error: { code: "ROUTE_NOT_FOUND", message: "No route for GET /nope" } }, "body");` },
            { label: "A programming error: a generic 500, the stack trace in the log", check: `const r = await get("/reports/broken"); eq(r.status, 500, "status"); eq(r.json, { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } }, "body"); lacks(r.text, "Cannot read", "the client must not see the internal error message"); has(stderr(), "TypeError", "log the error (with its stack trace) with console.error");` },
            { label: "Success still works", check: `const r = await post("/courses", { code: "DB-101", title: "Relational Databases" }); eq(r.status, 201, "status");` },
          ],
          hint: "class AppError extends Error { constructor(status, code, message, details) { super(message); this.status = status; this.code = code; … } }. In errorHandler: if (err.type === \"entity.parse.failed\") … ; if (!(err instanceof AppError)) { console.error(err); err = new AppError(500, …) }.",
          successMessage: "Every failure of this API now has one shape and a deliberate status, and bugs no longer leak their messages to clients.",
        },
      },
      {
        id: "a-be-error-classification",
        title: "Request validation and error classification",
        explain:
          "Errors reach your handler from many libraries, each in its own form: zod throws a ZodError with issues (path, message); Express's JSON parser sets type: \"entity.parse.failed\"; pg errors carry a SQLSTATE code (23505 unique, 23503 foreign key, 23514 check, 22P02 bad format); network errors carry ECONNREFUSED; fetch timeouts are a TimeoutError. A CLASSIFIER maps each to a status, a stable code, whether it is operational, and whether retrying could help. Note what it does NOT map: 42P01 (undefined table) is a bug in your SQL, so it stays a 500 like any unknown error.",
        nodeLab: {
          task:
            "Write classifyError(err) in classify.js, returning { status, code, message, operational, retryable } (and details for validation): a ZodError → 400 VALIDATION_FAILED with details [{ field: issue.path joined by \".\", message }]; a JSON parse error → 400 INVALID_JSON; pg 23505 → 409 ALREADY_EXISTS; 23503 → 422 INVALID_REFERENCE; 23514 and 22P02 → 400 INVALID_INPUT; ECONNREFUSED, ECONNRESET and 57P01 (database restarting) → 503 SERVICE_UNAVAILABLE, retryable; TimeoutError → 504 UPSTREAM_TIMEOUT, retryable; anything else → 500 INTERNAL_ERROR \"Something went wrong\", not operational.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: ["zod"] }),
            "classify.js": `/** How the API answers err: { status, code, message, operational, retryable, details? }. */
export function classifyError(err) {
  return { status: 500, code: "INTERNAL_ERROR", message: "Something went wrong", operational: false, retryable: false };
}
`,
          },
          readOnly: ["package.json"],
          open: "classify.js",
          solution: {
            "classify.js": `const PG = {
  23505: [409, "ALREADY_EXISTS", "A record with these values already exists"],
  23503: [422, "INVALID_REFERENCE", "A record this refers to does not exist"],
  23514: [400, "INVALID_INPUT", "A value breaks a rule"],
  "22P02": [400, "INVALID_INPUT", "A value has the wrong format"],
};
const UNAVAILABLE = new Set(["ECONNREFUSED", "ECONNRESET", "57P01"]);

const operational = (status, code, message, retryable = false) => ({ status, code, message, operational: true, retryable });

/** How the API answers err: { status, code, message, operational, retryable, details? }. */
export function classifyError(err) {
  if (err?.name === "ZodError") {
    const details = err.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
    return { ...operational(400, "VALIDATION_FAILED", "The request is invalid"), details };
  }
  if (err?.type === "entity.parse.failed") return operational(400, "INVALID_JSON", "The request body is not valid JSON");
  if (PG[err?.code]) return operational(...PG[err.code]);
  if (UNAVAILABLE.has(err?.code)) return operational(503, "SERVICE_UNAVAILABLE", "A service we depend on is unavailable", true);
  if (err?.name === "TimeoutError") return operational(504, "UPSTREAM_TIMEOUT", "A service we depend on did not answer in time", true);
  // Everything else is a bug (including 42P01, a table that does not exist).
  return { status: 500, code: "INTERNAL_ERROR", message: "Something went wrong", operational: false, retryable: false };
}
`,
          },
          tests: [
            { label: "A ZodError: 400 VALIDATION_FAILED with a detail per issue", check: `const { classifyError } = await load("classify.js"); const { z } = await load("zod"); const parsed = z.object({ email: z.email(), seats: z.number().int().min(1), address: z.object({ city: z.string() }) }).safeParse({ email: "ada@", seats: 0, address: {} }); const c = classifyError(parsed.error); eq([c.status, c.code, c.operational, c.retryable], [400, "VALIDATION_FAILED", true, false], "status, code, operational, retryable"); eq((c.details || []).map((d) => d.field), ["email", "seats", "address.city"], "one detail per issue, nested paths joined with ."); assert(c.details.every((d) => typeof d.message === "string" && d.message), "each detail has zod's message");` },
            { label: "A JSON parse error: 400 INVALID_JSON", check: `const { classifyError } = await load("classify.js"); const c = classifyError(Object.assign(new SyntaxError("Unexpected token o in JSON"), { type: "entity.parse.failed", status: 400 })); eq([c.status, c.code, c.operational], [400, "INVALID_JSON", true], "a JSON parse error");` },
            { label: "PostgreSQL errors by SQLSTATE", check: `const { classifyError } = await load("classify.js"); const pg = (code) => { const c = classifyError(Object.assign(new Error("db error " + code), { code, severity: "ERROR" })); return [c.status, c.code, c.operational]; }; eq(pg("23505"), [409, "ALREADY_EXISTS", true], "23505 unique violation"); eq(pg("23503"), [422, "INVALID_REFERENCE", true], "23503 foreign key violation"); eq(pg("23514"), [400, "INVALID_INPUT", true], "23514 check violation"); eq(pg("22P02"), [400, "INVALID_INPUT", true], "22P02 invalid text representation"); eq(pg("42P01"), [500, "INTERNAL_ERROR", false], "42P01 undefined table is a bug in the SQL, not something the client did");` },
            { label: "Unavailable services and timeouts: 503/504, retryable", check: `const { classifyError } = await load("classify.js"); for (const code of ["ECONNREFUSED", "ECONNRESET", "57P01"]) { const c = classifyError(Object.assign(new Error("connection problem"), { code })); eq([c.status, c.code, c.retryable], [503, "SERVICE_UNAVAILABLE", true], code); } const t = classifyError(new DOMException("The operation was aborted due to timeout", "TimeoutError")); eq([t.status, t.code, t.retryable], [504, "UPSTREAM_TIMEOUT", true], "a fetch timeout");` },
            { label: "Anything else: a generic 500 that hides the message", check: `const { classifyError } = await load("classify.js"); const c = classifyError(new TypeError("Cannot read properties of undefined (reading 'id')")); eq(c, { status: 500, code: "INTERNAL_ERROR", message: "Something went wrong", operational: false, retryable: false }, "a TypeError"); eq(classifyError("a string was thrown").status, 500, "even a thrown string"); eq(classifyError(undefined).status, 500, "or undefined");` },
          ],
          hint: "Check the most specific signs first: err.name === \"ZodError\", err.type === \"entity.parse.failed\", err.code in a table of SQLSTATEs, err.code in a set of network codes, err.name === \"TimeoutError\"; then the 500. Use err?.… so a thrown string or undefined does not crash the classifier.",
          successMessage: "One function now decides, for every error any library can throw, what the client hears and whether a retry could help.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 116 · 16.4 – 16.5 · SAFE LOGS AND REQUEST IDS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l116-logging",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.4", "16.5"],
    title: "Logging Without Secrets, Request IDs and Traceable Errors",
    subtitle: "Logs you can search, share and trust",
    estimatedMinutes: 75,
    intro: "When something fails in production, the logs are all you have. They must say exactly what happened to which request, and they must never become a second copy of your users' passwords and tokens.",
    atoms: [
      {
        id: "a-be-log-redaction",
        title: "Logging without exposing passwords or tokens",
        explain:
          "Logs are copied to log services, shared in tickets and kept for months, so treat them as widely readable. STRUCTURED logs write one JSON object per line ({ time, level, msg, …fields }), which log tools can filter (level = error AND path = /checkout). REDACTION happens in the logger, not at each call site: every field whose name looks secret (password, token, secret, authorization, cookie, card, cvv, api key) is replaced with [REDACTED], at any depth, including query strings (/reset-password?token=…). Log what helps diagnosis: method, path, status, duration, ids.",
        nodeLab: {
          task:
            "Finish logger.js: redact(value) returns a copy in which every field whose name matches password, token, secret, authorization, cookie, card, cvv or api key (any case, at any depth, inside arrays too) is \"[REDACTED]\"; redactUrl(url) does the same for query parameters; log() and requestLogger must use them. The request log line keeps method, path, status, ms, headers and body, minus the secrets.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] }),
            "logger.js": `/** A copy of value with every secret-looking field replaced, at any depth. */
export function redact(value) {
  return value;
}

/** The URL with secret-looking query parameters replaced. */
export function redactUrl(url) {
  return url;
}

/** One JSON line per event. */
export function log(level, msg, fields = {}) {
  console.log(JSON.stringify({ time: new Date().toISOString(), level, msg, ...fields }));
}

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    log("info", "request", { method: req.method, path: req.originalUrl, status: res.statusCode, ms: Date.now() - start, headers: req.headers, body: req.body });
  });
  next();
}
`,
            "server.js": `import express from "express";
import { log, requestLogger } from "./logger.js";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.post("/auth/login", (req, res) => res.status(204).end());

app.post("/payments", (req, res) => {
  log("info", "payment received", { studentId: 1, payment: req.body });
  res.status(201).json({ data: { id: 1 } });
});

app.get("/auth/reset-password", (req, res) => res.json({ data: { valid: true } }));

app.listen(3000, () => log("info", "listening", { port: 3000 }));
`,
          },
          readOnly: ["package.json", "server.js"],
          open: "logger.js",
          solution: { "logger.js": LOGGER_JS.replace("      requestId: req.id,\n", "").replace('log(res.statusCode >= 500 ? "error" : "info", "request"', 'log("info", "request"') },
          tests: [
            { label: "Every line is JSON with time, level and msg", check: `${LINES} await get("/auth/reset-password"); const all = lines(); assert(all.length >= 2, "expected the listening line and a request line"); for (const l of all) { assert(!l.notJson, "not JSON: " + l.notJson); assert(l.time && l.level && l.msg, "each line needs time, level and msg: " + JSON.stringify(l)); }` },
            { label: "A login is logged without the password, the token or the cookie", check: `${LINES} await post("/auth/login", { email: "ada@example.com", password: "hunter2-secret" }, { headers: { Authorization: "Bearer tok_live_123", Cookie: "sid=abc123session" } }); for (const secret of ["hunter2-secret", "tok_live_123", "abc123session"]) lacks(stdout(), secret, "the logs contain " + secret); const line = lines().find((l) => l.msg === "request" && l.path === "/auth/login"); assert(line, "a request line for POST /auth/login"); eq([line.method, line.status, line.body?.email, line.body?.password, line.headers?.authorization, line.headers?.cookie], ["POST", 204, "ada@example.com", "[REDACTED]", "[REDACTED]", "[REDACTED]"], "method, status, email kept; password, Authorization and Cookie redacted"); assert(typeof line.ms === "number", "ms");` },
            { label: "Nested secrets and arrays are redacted too", check: `${LINES} await post("/payments", { amount: 120000, card: { number: "4242424242424242", cvv: "9x7" }, billing: { name: "Ada Obi" }, apiKeys: ["key_abc"], items: [{ courseId: 1, accessToken: "tok_nested_9" }] }); for (const secret of ["4242424242424242", "9x7", "key_abc", "tok_nested_9"]) lacks(stdout(), secret, "the logs contain " + secret); const line = lines().find((l) => l.msg === "payment received"); eq([line?.payment?.amount, line?.payment?.billing?.name, line?.payment?.items?.[0]?.courseId], [120000, "Ada Obi", 1], "the harmless fields stay");` },
            { label: "Secret query parameters are redacted", check: `${LINES} await get("/auth/reset-password?token=rst_secret_42&email=ada%40example.com"); lacks(stdout(), "rst_secret_42", "the reset token is in the logs"); const line = lines().findLast((l) => l.msg === "request" && String(l.path).startsWith("/auth/reset-password")); assert(line && /email=ada/.test(line.path) && /token=/.test(line.path), "keep the path, the email parameter and the token parameter's name (its value redacted): " + line?.path);` },
            { label: "redact() copies; it does not change the original", check: `const { redact } = await load("logger.js"); const input = { user: { name: "Ada", Password: "p" }, list: [{ refresh_token: "t" }], n: 1, when: null }; eq(redact(input), { user: { name: "Ada", Password: "[REDACTED]" }, list: [{ refresh_token: "[REDACTED]" }], n: 1, when: null }, "redacted copy"); eq(input.user.Password, "p", "the original object must be unchanged (the handler still needs it)");` },
          ],
          hint: "Test each key against one case-insensitive pattern: /pass(word)?|token|secret|authorization|cookie|card|cvv|api[-_]?key/i. redact recurses: arrays map, objects become Object.fromEntries of redacted entries. For URLs, new URLSearchParams(query) and params.set(key, \"[REDACTED]\").",
          successMessage: "The logger itself now guarantees that secrets never reach the logs, whatever a handler passes to it.",
        },
      },
      {
        id: "a-be-request-ids",
        title: "Request IDs and traceable errors",
        explain:
          "A REQUEST ID ties together everything that happened for one request: every log line, the error's stack trace, the response the client got, and the calls to other services. Accept an incoming X-Request-Id (from a load balancer or another of your services) if it looks safe (letters, digits, . _ -, at most 64 characters), otherwise create a UUID; send it back in the X-Request-Id response header and in error bodies (a user can quote it to support), put it in every log line, and pass it on to the services you call. Then one search for the id shows the whole story.",
        nodeLab: {
          task:
            "Write the requestId middleware in requestId.js (req.id from a valid incoming X-Request-Id, else crypto.randomUUID(); the X-Request-Id response header). In errors.js, add requestId to every error body, and log 500s with log(\"error\", \"unhandled error\", { requestId, method, path, err: { name, message, stack } }). In server.js, pass the request id on to the payment provider in an X-Request-Id header.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: START, deps: ["express"] }),
            ".env": ENV_PAY_FILE,
            "logger.js": LOGGER_JS,
            "requestId.js": `export function requestId(req, res, next) {
  next();
}
`,
            "errors.js": `import { log } from "./logger.js";

export function errorHandler(err, req, res, next) {
  if (err.status && err.status < 500) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
}
`,
            "server.js": `import express from "express";
import { errorHandler } from "./errors.js";
import { log, requestLogger } from "./logger.js";
import { requestId } from "./requestId.js";

const app = express();
app.use(requestId);
app.use(express.json());
app.use(requestLogger);

app.post("/checkout", async (req, res) => {
  const response = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/charges\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\`,
    },
    body: JSON.stringify({ amount: 12000000, currency: "NGN", reference: "order-1" }),
  });
  res.status(201).json({ data: await response.json() });
});

app.get("/reports/broken", () => {
  throw new TypeError("report.total is undefined");
});

app.use(errorHandler);

app.listen(3000, () => log("info", "listening", { port: 3000 }));
`,
          },
          readOnly: ["package.json", ".env", "logger.js"],
          services: SERVICES,
          open: "requestId.js",
          solution: {
            "requestId.js": `import { randomUUID } from "node:crypto";

const SAFE = /^[A-Za-z0-9._-]{1,64}$/;

/** req.id: the caller's X-Request-Id if it is safe to log, else a new UUID. */
export function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && SAFE.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.id);
  next();
}
`,
            "errors.js": `import { log } from "./logger.js";

export function errorHandler(err, req, res, next) {
  if (err.status && err.status < 500) return res.status(err.status).json({ error: { code: err.code, message: err.message, requestId: req.id } });
  log("error", "unhandled error", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    err: { name: err.name, message: err.message, stack: err.stack },
  });
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong", requestId: req.id } });
}
`,
            "server.js": `import express from "express";
import { errorHandler } from "./errors.js";
import { log, requestLogger } from "./logger.js";
import { requestId } from "./requestId.js";

const app = express();
app.use(requestId);
app.use(express.json());
app.use(requestLogger);

app.post("/checkout", async (req, res) => {
  const response = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/charges\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\`,
      "X-Request-Id": req.id,
    },
    body: JSON.stringify({ amount: 12000000, currency: "NGN", reference: "order-1" }),
  });
  res.status(201).json({ data: await response.json() });
});

app.get("/reports/broken", () => {
  throw new TypeError("report.total is undefined");
});

app.use(errorHandler);

app.listen(3000, () => log("info", "listening", { port: 3000 }));
`,
          },
          tests: [
            { label: "Every response gets a new UUID in X-Request-Id", check: `${UUID} const a = await post("/checkout", {}); const b = await post("/checkout", {}); assert(UUID.test(a.headers["x-request-id"] || ""), "X-Request-Id should be a UUID: " + a.headers["x-request-id"]); assert(a.headers["x-request-id"] !== b.headers["x-request-id"], "each request gets its own id");` },
            { label: "A safe incoming id is kept; an unsafe one is replaced", check: `${UUID} const kept = await post("/checkout", {}, { headers: { "X-Request-Id": "lb-7f3a.01_x" } }); eq(kept.headers["x-request-id"], "lb-7f3a.01_x", "keep the load balancer's id"); for (const bad of ["has spaces in it", "x".repeat(65), "<script>"]) { const r = await post("/checkout", {}, { headers: { "X-Request-Id": bad } }); assert(UUID.test(r.headers["x-request-id"] || ""), "replace " + JSON.stringify(bad.slice(0, 20)) + " with a new UUID"); }` },
            { label: "A 500 tells the client its request id", check: `const r = await get("/reports/broken", { headers: { "X-Request-Id": "req-500-test" } }); eq(r.status, 500, "status"); eq(r.json, { error: { code: "INTERNAL_ERROR", message: "Something went wrong", requestId: "req-500-test" } }, "body");` },
            { label: "…and the log has the stack trace under the same id", check: `${LINES} await get("/reports/broken", { headers: { "X-Request-Id": "req-500-log" } }); const errLine = lines().find((l) => l.level === "error" && l.msg === "unhandled error" && l.requestId === "req-500-log"); assert(errLine, "log(\\"error\\", \\"unhandled error\\", { requestId, … }) for the 500"); has(String(errLine.err?.stack || ""), "TypeError: report.total is undefined", "err.stack"); eq([errLine.method, errLine.path], ["GET", "/reports/broken"], "method and path"); assert(lines().some((l) => l.msg === "request" && l.requestId === "req-500-log" && l.status === 500), "the request line carries the same id");` },
            { label: "The id is passed on to the payment provider", check: `${PAY} await post("/checkout", {}, { headers: { "X-Request-Id": "req-pay-1" } }); const last = calls().at(-1); eq(last?.headers["x-request-id"], "req-pay-1", "send X-Request-Id: req.id to the provider");` },
          ],
          hint: "const id = req.get(\"x-request-id\"); req.id = id && /^[A-Za-z0-9._-]{1,64}$/.test(id) ? id : randomUUID(); res.set(\"X-Request-Id\", req.id). In errors.js put requestId: req.id into each body and use log(\"error\", …) instead of console.error.",
          successMessage: "A user quotes one id from an error message, and one search shows every log line, the stack trace and the provider call for that request.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 117 · 16.6 – 16.8 · RETRIES, THIRD-PARTY FAILURES, IDEMPOTENCY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l117-resilience",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.6", "16.7", "16.8"],
    title: "Timeouts, Retries, Third-Party Failures and Idempotency Keys",
    subtitle: "Surviving the services you depend on, and the clients that depend on you",
    estimatedMinutes: 110,
    intro:
      "Every call over a network can be slow, fail, or succeed without you hearing about it. Timeouts bound the wait, retries recover from short failures, a circuit breaker stops hammering a service that is down, and idempotency keys make every retry safe.",
    atoms: [
      {
        id: "a-be-backoff",
        title: "Timeouts, retries and exponential backoff",
        explain:
          "Always set a TIMEOUT on outgoing calls (AbortSignal.timeout(ms) with fetch): without one, a hanging provider holds your requests open until your users give up. RETRY only what can succeed next time: timeouts, network errors, 408, 429 and 5xx; never 400, 401, 402 or 404. Wait between attempts with EXPONENTIAL BACKOFF (200 ms, 400, 800…) so a struggling service gets room to recover, and honour Retry-After when the service sends it. Cap the attempts. Retrying a POST is only safe with an IDEMPOTENCY KEY: the same key on every attempt lets the provider recognise a repeat and answer it without charging again.",
        nodeLab: {
          task:
            "Write charge(body, { idempotencyKey, retries = 3, baseMs = 200, timeoutMs = 3000 }) in payments.js: POST ${PAYMENTS_API_URL}/v1/charges with the secret key and an Idempotency-Key header (a new UUID when none is given, the SAME on every attempt), each attempt cut off after timeoutMs. Retry timeouts, network errors, 408, 429 and 5xx, waiting baseMs × 2^n (200, 400, 800 ms) or the Retry-After seconds; return { status, body } for any other answer; after the last attempt throw ProviderUnavailableError.",
          command: false,
          env: PAY_ENV,
          services: SERVICES,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "payments.js": `export class ProviderUnavailableError extends Error {}

/** Creates a charge at the payment provider. */
export async function charge(body, { idempotencyKey, retries = 3, baseMs = 200, timeoutMs = 3000 } = {}) {
  const res = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/charges\`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\` },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}
`,
          },
          readOnly: ["package.json"],
          open: "payments.js",
          solution: { "payments.js": PAYMENTS_CLIENT_JS(3000) },
          tests: [
            { label: "A healthy provider: one attempt, the charge returned", check: `${PAY} const { charge } = await load("payments.js"); const before = calls().length; const r = await wait(charge({ amount: 12000000, currency: "NGN", reference: "r-ok" })); eq([r.status, r.body.status], [201, "succeeded"], "status and charge"); eq(calls().length - before, 1, "one attempt"); assert(calls().at(-1).headers["idempotency-key"], "send an Idempotency-Key header (a new UUID when none is given)");` },
            { label: "Two 500s: three attempts, 200 then 400 ms apart, one key", check: `${PAY} const { charge } = await load("payments.js"); pay.locals.failNext = 2; const before = calls().length; const t0 = now(); const r = await wait(charge({ amount: 12000000, currency: "NGN", reference: "r-500" }, { idempotencyKey: "key-500" })); const took = now() - t0; eq(r.status, 201, "it succeeds on the third attempt"); const attempts = calls().slice(before); eq(attempts.length, 3, "attempts"); eq(attempts.map((a) => a.headers["idempotency-key"]), ["key-500", "key-500", "key-500"], "the same Idempotency-Key on every attempt"); assert(took >= 600 && took < 700, "wait 200 ms, then 400 ms (took " + Math.round(took) + " ms)");` },
            { label: "429 with Retry-After: 2 waits two seconds", check: `${PAY} const { charge } = await load("payments.js"); pay.locals.limitNext = 1; const t0 = now(); const r = await wait(charge({ amount: 12000000, currency: "NGN", reference: "r-429" })); const took = now() - t0; eq(r.status, 201, "succeeds after the rate limit"); assert(took >= 2000 && took < 2300, "honour Retry-After: 2 (took " + Math.round(took) + " ms)");` },
            { label: "Answers that will not change are not retried", check: `${PAY} const { charge } = await load("payments.js"); let before = calls().length; const declined = await wait(charge({ amount: 12000000, currency: "NGN", reference: "r-402", card: "${BAD_CARD}" })); eq([declined.status, declined.body.error?.code], [402, "card_declined"], "a declined card is returned"); eq(calls().length - before, 1, "402: one attempt"); before = calls().length; const invalid = await wait(charge({ amount: -1, currency: "NGN", reference: "r-400" })); eq(invalid.status, 400, "400 is returned"); eq(calls().length - before, 1, "400: one attempt");` },
            { label: "A provider that stays down: four attempts, then ProviderUnavailableError", check: `${PAY} const m = await load("payments.js"); pay.locals.failNext = 10; const before = calls().length; const t0 = now(); let err = null; try { await wait(m.charge({ amount: 12000000, currency: "NGN", reference: "r-down" })); } catch (e) { err = e; } const took = now() - t0; pay.locals.failNext = 0; assert(err instanceof m.ProviderUnavailableError, "throw ProviderUnavailableError (got " + (err?.name || "a result") + ")"); eq(calls().length - before, 4, "1 attempt + 3 retries"); assert(took >= 1400 && took < 1500, "200 + 400 + 800 ms of backoff (took " + Math.round(took) + " ms)");` },
            { label: "A hanging provider is cut off at timeoutMs", check: `${PAY} const m = await load("payments.js"); pay.locals.delayMs = 10000; const before = calls().length; const t0 = now(); let err = null; try { await wait(m.charge({ amount: 12000000, currency: "NGN", reference: "r-slow" }, { retries: 1 })); } catch (e) { err = e; } const took = now() - t0; pay.locals.delayMs = 0; assert(err instanceof m.ProviderUnavailableError, "after the timeouts, throw ProviderUnavailableError"); eq(calls().length - before, 2, "two attempts"); assert(took >= 6200 && took < 6600, "3000 ms + 200 ms + 3000 ms (took " + Math.round(took) + " ms): use AbortSignal.timeout(timeoutMs)");` },
            { label: "A lost answer is retried without charging twice", check: `${PAY} const { charge } = await load("payments.js"); pay.locals.loseNext = 1; const r = await wait(charge({ amount: 12000000, currency: "NGN", reference: "r-lost" })); eq(r.status, 201, "the retry gets the charge"); eq(charges("r-lost"), 1, "the provider made exactly one charge (the retry reused the Idempotency-Key)");` },
          ],
          hint: "Loop attempt = 0…retries. Before every attempt except the first, sleep (Retry-After × 1000 if the last answer had one, else baseMs * 2 ** (attempt - 1)). Pass signal: AbortSignal.timeout(timeoutMs) to fetch; a rejected fetch (timeout or network) and a retryable status both go round again. Create the key once, before the loop.",
          successMessage: "Short outages and rate limits are now invisible to your users, and a lost answer can never turn into a second charge.",
        },
      },
      {
        id: "a-be-circuit-breaker",
        title: "Handling third-party service failures",
        explain:
          "When a provider is DOWN (not just blipping), retries make things worse: every request waits for timeouts, threads and connections pile up, and the provider is hammered as it tries to recover. A CIRCUIT BREAKER counts consecutive failures: after a threshold it OPENS and fails fast, without calling, for a cool-down period; then it lets one trial call through (HALF-OPEN): success closes it, failure opens it again. Meanwhile, DEGRADE gracefully: answer 503 with a clear code and Retry-After, keep the parts of the API that do not need the provider working, and never mark an order paid when you do not know.",
        nodeLab: {
          task:
            "Write createBreaker(fn, { failureThreshold = 3, resetMs = 30000 }) in breaker.js, returning { call(...args), state }: call runs fn; a thrown error counts a failure; failureThreshold consecutive failures open the circuit; while open, call throws CircuitOpenError without running fn; after resetMs the state is \"half-open\" and one call is tried: success closes the circuit (and resets the count), failure opens it again. server.js (given) uses it for POST /checkout.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: START, deps: ["express"] }),
            ".env": ENV_PAY_FILE,
            "breaker.js": `export class CircuitOpenError extends Error {}

export function createBreaker(fn, { failureThreshold = 3, resetMs = 30000 } = {}) {
  return {
    state: "closed",
    call: (...args) => fn(...args),
  };
}
`,
            "server.js": `import express from "express";
import { createBreaker } from "./breaker.js";

class ProviderError extends Error {}

async function providerCharge(body) {
  const res = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/charges\`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(3000),
  });
  if (res.status >= 500) throw new ProviderError(\`The provider answered \${res.status}\`);
  return { status: res.status, body: await res.json() };
}

const payments = createBreaker(providerCharge, { failureThreshold: 3, resetMs: 30000 });

const app = express();
app.use(express.json());
let nextOrder = 1;

app.post("/checkout", async (req, res) => {
  try {
    const charge = await payments.call({ amount: 12000000, currency: "NGN", reference: \`order-\${nextOrder++}\` });
    if (charge.status !== 201) return res.status(402).json({ error: { code: "PAYMENT_DECLINED", message: "The payment was not accepted" } });
    res.status(201).json({ data: charge.body });
  } catch (err) {
    console.error(\`checkout failed: \${err.message}\`);
    res.set("Retry-After", "30").status(503).json({ error: { code: "PAYMENTS_UNAVAILABLE", message: "Payments are temporarily unavailable. Try again shortly." } });
  }
});

app.get("/health/circuits", (req, res) => res.json({ payments: payments.state }));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "server.js"],
          services: SERVICES,
          open: "breaker.js",
          solution: {
            "breaker.js": `export class CircuitOpenError extends Error {}

/**
 * Wraps fn. After failureThreshold consecutive failures the circuit opens:
 * calls fail fast for resetMs; then one trial call decides.
 */
export function createBreaker(fn, { failureThreshold = 3, resetMs = 30000 } = {}) {
  let failures = 0;
  let openedAt = null;
  const breaker = {
    get state() {
      if (openedAt === null) return "closed";
      return Date.now() - openedAt >= resetMs ? "half-open" : "open";
    },
    async call(...args) {
      if (breaker.state === "open") throw new CircuitOpenError("The circuit is open: not calling a failing service");
      const trial = breaker.state === "half-open";
      try {
        const result = await fn(...args);
        failures = 0;
        openedAt = null;
        return result;
      } catch (err) {
        failures += 1;
        if (trial || failures >= failureThreshold) openedAt = Date.now();
        throw err;
      }
    },
  };
  return breaker;
}
`,
          },
          tests: [
            { label: "A healthy provider: 201 and a closed circuit", check: `const r = await post("/checkout", {}); eq(r.status, 201, "status"); eq((await get("/health/circuits")).json, { payments: "closed" }, "state");` },
            { label: "Failures only count when they are consecutive", check: `${PAY} pay.locals.failNext = 2; await post("/checkout", {}); await post("/checkout", {}); eq((await post("/checkout", {})).status, 201, "a success after two failures"); pay.locals.failNext = 2; await post("/checkout", {}); await post("/checkout", {}); pay.locals.failNext = 0; eq((await get("/health/circuits")).json.payments, "closed", "2 failures, a success, 2 failures: the success reset the count, so the circuit stays closed");` },
            { label: "Three failures open it; then it fails fast without calling", check: `${PAY} eq((await post("/checkout", {})).status, 201, "start from a working provider"); pay.locals.failNext = 3; for (let i = 0; i < 3; i++) eq((await post("/checkout", {})).status, 503, "failure " + (i + 1)); eq((await get("/health/circuits")).json.payments, "open", "state after 3 consecutive failures"); const before = calls().length; const r = await post("/checkout", {}); eq(r.status, 503, "while open, checkout answers 503"); eq(r.headers["retry-after"], "30", "with Retry-After"); eq(calls().length - before, 0, "while open, the provider is not called at all");` },
            { label: "After 30 s, one trial call closes it again", check: `${PAY} await advance(30000); eq((await get("/health/circuits")).json.payments, "half-open", "state after resetMs"); const before = calls().length; eq((await post("/checkout", {})).status, 201, "the trial call succeeds"); eq(calls().length - before, 1, "one call"); eq((await get("/health/circuits")).json.payments, "closed", "closed after a successful trial");` },
            { label: "A failed trial opens it again at once", check: `${PAY} pay.locals.failNext = 3; for (let i = 0; i < 3; i++) await post("/checkout", {}); await advance(30000); pay.locals.failNext = 1; await post("/checkout", {}); eq((await get("/health/circuits")).json.payments, "open", "one failed trial reopens the circuit"); const before = calls().length; await post("/checkout", {}); eq(calls().length - before, 0, "and it fails fast again"); pay.locals.failNext = 0;` },
            { label: "CircuitOpenError is thrown while open", check: `const m = await load("breaker.js"); const b = m.createBreaker(async () => { throw new Error("down"); }, { failureThreshold: 2, resetMs: 1000 }); for (let i = 0; i < 2; i++) { try { await b.call(); } catch {} } let err = null; try { await b.call(); } catch (e) { err = e; } assert(err instanceof m.CircuitOpenError, "the third call should throw CircuitOpenError, not run fn");` },
          ],
          hint: "Keep failures and openedAt in the closure. state is a getter: closed when openedAt is null, half-open once Date.now() - openedAt >= resetMs, otherwise open. In call: throw when open; on success reset both; on failure count it and set openedAt when the count reaches the threshold or the call was the half-open trial.",
          successMessage: "When the provider goes down, checkout now fails in milliseconds with a clear 503, the provider gets room to recover, and one trial call per 30 seconds notices when it is back.",
        },
      },
      {
        id: "a-be-idempotency-keys",
        title: "Idempotency keys for retryable operations",
        explain:
          "Your clients retry too: a phone loses signal after sending POST /payments, so did it work? An IDEMPOTENCY KEY (a UUID the client generates per operation and sends as the Idempotency-Key header) makes the retry safe. The first request with a key stores the key (and a hash of the body) before doing the work, then stores the response. A repeat with the same key and body REPLAYS the stored response without doing the work again; the same key with a different body is a client bug (422); a repeat while the first is still running gets 409. Store the key with a unique constraint so two simultaneous requests cannot both win, and expire keys after a day or so.",
        nodeLab: {
          task:
            "Write the idempotent middleware in idempotency.js and put it on POST /payments in server.js: no Idempotency-Key → 400 IDEMPOTENCY_KEY_REQUIRED; claim the key with INSERT … ON CONFLICT DO NOTHING (with a SHA-256 hash of the JSON body); for a key already claimed: a different body hash → 422 IDEMPOTENCY_KEY_REUSED, no stored response yet → 409 REQUEST_IN_PROGRESS, else replay the stored status and body with Idempotent-Replayed: true. Store the response (status_code, response) when the handler sends it; on a 5xx delete the key so the client can retry.",
          db: `CREATE TABLE payments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL, amount integer NOT NULL);
CREATE TABLE idempotency_keys (
  key          text PRIMARY KEY,
  request_hash text NOT NULL,
  status_code  integer,          -- NULL while the first request is still running
  response     jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
`,
          files: {
            "package.json": pkg({ name: "course-api", scripts: START, deps: ["express", "pg"] }),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            "db.js": DB_JS,
            "idempotency.js": `import { createHash } from "node:crypto";
import { pool } from "./db.js";

export async function idempotent(req, res, next) {
  next();
}
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { idempotent } from "./idempotency.js";

const app = express();
app.use(express.json());

app.post("/payments", async (req, res) => {
  const { studentId, amount } = req.body ?? {};
  if (!Number.isInteger(studentId) || !Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "studentId and a positive amount are required" } });
  }
  const { rows } = await pool.query('INSERT INTO payments (student_id, amount) VALUES ($1, $2) RETURNING id, student_id AS "studentId", amount', [studentId, amount]);
  res.status(201).json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "idempotency.js",
          solution: {
            "idempotency.js": `import { createHash } from "node:crypto";
import { pool } from "./db.js";

const hashOf = (body) => createHash("sha256").update(JSON.stringify(body ?? {})).digest("hex");

/** Replays the stored response for a repeated Idempotency-Key instead of doing the work twice. */
export async function idempotent(req, res, next) {
  const key = req.get("idempotency-key");
  if (!key) return res.status(400).json({ error: { code: "IDEMPOTENCY_KEY_REQUIRED", message: "Send an Idempotency-Key header" } });
  const hash = hashOf(req.body);

  // Claim the key; the primary key makes sure only one request can.
  const claimed = await pool.query("INSERT INTO idempotency_keys (key, request_hash) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", [key, hash]);
  if (claimed.rowCount === 0) {
    const { rows } = await pool.query("SELECT request_hash, status_code, response FROM idempotency_keys WHERE key = $1", [key]);
    const saved = rows[0];
    if (saved.request_hash !== hash) return res.status(422).json({ error: { code: "IDEMPOTENCY_KEY_REUSED", message: "This Idempotency-Key was used with a different request" } });
    if (saved.status_code === null) return res.status(409).json({ error: { code: "REQUEST_IN_PROGRESS", message: "A request with this Idempotency-Key is still running" } });
    return res.set("Idempotent-Replayed", "true").status(saved.status_code).json(saved.response);
  }

  // Store the response before it is sent.
  const send = res.json.bind(res);
  res.json = async (body) => {
    if (res.statusCode >= 500) await pool.query("DELETE FROM idempotency_keys WHERE key = $1", [key]);
    else await pool.query("UPDATE idempotency_keys SET status_code = $2, response = $3 WHERE key = $1", [key, res.statusCode, body]);
    return send(body);
  };
  next();
}
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { idempotent } from "./idempotency.js";

const app = express();
app.use(express.json());

app.post("/payments", idempotent, async (req, res) => {
  const { studentId, amount } = req.body ?? {};
  if (!Number.isInteger(studentId) || !Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "studentId and a positive amount are required" } });
  }
  const { rows } = await pool.query('INSERT INTO payments (student_id, amount) VALUES ($1, $2) RETURNING id, student_id AS "studentId", amount', [studentId, amount]);
  res.status(201).json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "No key: 400 IDEMPOTENCY_KEY_REQUIRED, nothing stored", check: `const r = await post("/payments", { studentId: 1, amount: 5000 }); eq(r.status, 400, "status"); eq(r.json?.error?.code, "IDEMPOTENCY_KEY_REQUIRED", "code"); eq((await sql("SELECT count(*)::int AS n FROM payments"))[0].n, 0, "no payment without a key");` },
            { label: "A retry replays the first response; one payment", check: `const opts = { headers: { "Idempotency-Key": "key-retry-1" } }; const first = await post("/payments", { studentId: 1, amount: 120000 }, opts); eq(first.status, 201, "the first request"); const again = await post("/payments", { studentId: 1, amount: 120000 }, opts); eq(again.status, 201, "the retry gets the same status"); eq(again.json, first.json, "and the same body"); eq(again.headers["idempotent-replayed"], "true", "Idempotent-Replayed: true on the replay"); eq((await sql("SELECT count(*)::int AS n FROM payments WHERE amount = 120000"))[0].n, 1, "one payment row");` },
            { label: "The key row stores the response", check: `const rows = await sql("SELECT status_code, response FROM idempotency_keys WHERE key = 'key-retry-1'"); eq(rows[0]?.status_code, 201, "status_code"); eq(rows[0]?.response?.data?.amount, 120000, "response (jsonb)");` },
            { label: "The same key with a different body: 422", check: `const r = await post("/payments", { studentId: 1, amount: 999 }, { headers: { "Idempotency-Key": "key-retry-1" } }); eq(r.status, 422, "status"); eq(r.json?.error?.code, "IDEMPOTENCY_KEY_REUSED", "code"); eq((await sql("SELECT count(*)::int AS n FROM payments WHERE amount = 999"))[0].n, 0, "nothing charged");` },
            { label: "A double-click: one payment, never two", check: `const opts = { headers: { "Idempotency-Key": "key-double" } }; const [a, b] = await together(post("/payments", { studentId: 2, amount: 80000 }, opts), post("/payments", { studentId: 2, amount: 80000 }, opts)); const statuses = [a.status, b.status].sort(); assert(statuses.includes(201) && statuses.every((s) => s === 201 || s === 409), "one 201, and the other a 409 (still running) or a replayed 201: got " + statuses); eq((await sql("SELECT count(*)::int AS n FROM payments WHERE amount = 80000"))[0].n, 1, "one payment row");` },
            { label: "Different keys are different payments", check: `await post("/payments", { studentId: 3, amount: 7000 }, { headers: { "Idempotency-Key": "key-a" } }); await post("/payments", { studentId: 3, amount: 7000 }, { headers: { "Idempotency-Key": "key-b" } }); eq((await sql("SELECT count(*)::int AS n FROM payments WHERE amount = 7000"))[0].n, 2, "two keys, two payments");` },
          ],
          hint: "await pool.query(\"INSERT INTO idempotency_keys (key, request_hash) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING\", …): rowCount 0 means the key was already there. To store the response, wrap res.json: const send = res.json.bind(res); res.json = async (body) => { await pool.query(\"UPDATE …\"); return send(body); }.",
          successMessage: "Clients can now retry a payment as often as their network makes them, and the student is charged exactly once.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 118 · 16.9 – 16.10 · CONTRACT TESTS AND HEALTH CHECKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l118-contracts-health",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.9", "16.10"],
    title: "API Contract Testing, Health Checks and Readiness Checks",
    subtitle: "Promises to clients, and to the platform that runs you",
    estimatedMinutes: 70,
    intro: "Two audiences depend on your API without reading its code: the clients that parse its responses, and the platform that decides whether to send it traffic. Contract tests keep the first promise; health and readiness checks the second.",
    atoms: [
      {
        id: "a-be-contract-tests",
        title: "API contract testing",
        explain:
          "A CONTRACT is the part of the API a consumer relies on: the requests it sends and, for each, the status and the response SHAPE (fields and types) it reads. In consumer-driven contract testing the consumer (the web app team) writes the contract, and the provider (you) runs it as tests on every change: renaming title to name, sending a price as a string, or dropping error.details breaks the build before it breaks the web app. Contracts check shape, not exact values, and tolerate extra fields, so the API can grow without breaking anyone. Tools like Pact add a broker that shares contracts between teams; the idea fits in one test file.",
        nodeLab: {
          task:
            "contract/web-app.json is the web app team's contract (its rules field explains the format). Write test/contract.test.js: a function that checks a response body against a shape (types, exact strings, objects with extra fields allowed, non-empty arrays), and one test per interaction that sends the request to createApp() with supertest and checks the status and the body's shape. The checks then break the API in five ways the web app would notice.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", scripts: { test: "vitest run" }, deps: ["express"], dev: ["supertest", "vitest"] }),
            "contract/web-app.json": CONTRACT,
            "src/bug.js": BUG_JS,
            "src/app.js": CONTRACT_APP_JS,
            "test/contract.test.js": `import { readFileSync } from "node:fs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const contract = JSON.parse(readFileSync("contract/web-app.json", "utf8"));
`,
          },
          readOnly: ["package.json", "contract/web-app.json", "src/bug.js", "src/app.js"],
          open: "test/contract.test.js",
          solution: {
            "test/contract.test.js": `import { readFileSync } from "node:fs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const contract = JSON.parse(readFileSync("contract/web-app.json", "utf8"));

const TYPES = {
  string: (v) => typeof v === "string",
  integer: (v) => Number.isInteger(v),
  number: (v) => typeof v === "number",
  boolean: (v) => typeof v === "boolean",
  null: (v) => v === null,
};

/** Where value breaks shape ("" when it matches). */
function mismatch(shape, value, at = "body") {
  if (typeof shape === "string") {
    const types = shape.split("|");
    if (types.every((t) => t in TYPES)) return types.some((t) => TYPES[t](value)) ? "" : \`\${at}: expected \${shape}, got \${JSON.stringify(value)}\`;
    return value === shape ? "" : \`\${at}: expected "\${shape}", got \${JSON.stringify(value)}\`;
  }
  if (Array.isArray(shape)) {
    if (!Array.isArray(value) || value.length === 0) return \`\${at}: expected a non-empty array\`;
    for (const [i, item] of value.entries()) {
      const problem = mismatch(shape[0], item, \`\${at}[\${i}]\`);
      if (problem) return problem;
    }
    return "";
  }
  if (!value || typeof value !== "object") return \`\${at}: expected an object, got \${JSON.stringify(value)}\`;
  for (const [key, inner] of Object.entries(shape)) {
    const problem = mismatch(inner, value[key], \`\${at}.\${key}\`);
    if (problem) return problem;
  }
  return "";
}

describe(\`contract: \${contract.consumer} → \${contract.provider}\`, () => {
  it.each(contract.interactions.map((i) => [i.description, i]))("%s", async (_description, { request: req, response }) => {
    let call = request(createApp())[req.method.toLowerCase()](req.path);
    if (req.body) call = call.send(req.body);
    const res = await call;
    expect(res.status).toBe(response.status);
    expect(mismatch(response.body, res.body)).toBe("");
  });
});
`,
          },
          tests: [
            PASSES(5),
            CATCHES("renamed-title", "title renamed to name"),
            CATCHES("price-string", "price sent as a string"),
            CATCHES("error-shape", "the 404 body lost its error object"),
            CATCHES("no-details", "validation errors without details"),
            CATCHES("enroll-200", "POST /enrollments answers 200 instead of 201"),
            { label: "The tests come from the contract file", check: `has(file("test/contract.test.js"), "contract.interactions", "build the tests from contract.interactions, so a new interaction in the contract is tested automatically");` },
          ],
          hint: "mismatch(shape, value): a string shape is either type names (split on |) or an exact value; an array shape checks every item against shape[0]; an object shape checks each listed key. Then it.each(contract.interactions.map((i) => [i.description, i]))(\"%s\", …).",
          successMessage: "The web app's expectations now run as your tests: you can rename internals freely, and the build tells you the moment a change would break a consumer.",
        },
      },
      {
        id: "a-be-health",
        title: "Health checks and readiness checks",
        explain:
          "Platforms (Kubernetes, load balancers, Docker) ask two different questions. LIVENESS (GET /health/live): is the process working at all? Answer 200 without touching dependencies; if it fails, the platform RESTARTS the process. READINESS (GET /health/ready): can it serve requests right now? Check the database (SELECT 1, with a short timeout) and other essentials; if it fails, the platform stops SENDING TRAFFIC to this instance until it recovers, without restarting it. Mixing them up is a classic outage: a liveness check that queries the database turns one database blip into every instance restarting at once. Keep both fast, uncached (Cache-Control: no-store) and free of secrets.",
        decision: decide({
          scenario: "During a 40-second database failover, every API pod was restarted by Kubernetes, and the API took 4 minutes to recover. The liveness probe calls GET /health, which runs SELECT 1 against the database.",
          question: "What should change?",
          right: ["Liveness only checks the process (no database); a separate readiness probe checks the database, so pods stop receiving traffic during the failover but are not restarted", "Restart for a broken process, drain for a broken dependency."],
          wrong: [
            ["Increase the liveness timeout to 5 minutes", "A truly stuck process would then be left running for 5 minutes."],
            ["Remove all probes", "Broken pods would keep receiving traffic."],
            ["Make /health always return 200", "The platform could no longer route around a broken database connection."],
          ],
          at: 2,
          aftermath: "Exercise 16.13 builds both endpoints.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 119 · 16.11 – 16.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l119-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["16.11", "16.12", "16.13", "16.14"],
    title: "Exercises: Failing Payments, Safe Retries, Health and Diagnosis",
    subtitle: "Reliability work on the academy's checkout",
    estimatedMinutes: 190,
    intro: "Four exercises on the parts of the academy where failure handling matters most: taking payments, and finding out what went wrong.",
    atoms: [
      {
        id: "a-be-ex-payment-failure",
        title: "Exercise: simulate a failed payment-provider request",
        explain:
          "A charge request has four outcomes and each needs its own handling: SUCCESS (mark the order paid, keep the charge id), DECLINED (the provider answered no: mark it failed, tell the user), PROVIDER ERROR (5xx: nothing happened, the order stays pending and can be retried) and UNKNOWN (a timeout: the charge may or may not exist). An unknown outcome must never be guessed: record it, and RECONCILE by asking the provider what happened (here GET /v1/charges?reference=order-<id>).",
        nodeLab: {
          task:
            "Make POST /orders/:id/pay ({ card }) in server.js handle every outcome: a 201 charge → order paid with charge_id, 200 { data: { id, status, chargeId } }; 402 → order failed, 402 PAYMENT_DECLINED; 5xx → order stays pending, 502 PAYMENT_PROVIDER_ERROR; no answer within 3 seconds → order unknown, 504 PAYMENT_OUTCOME_UNKNOWN. A paid or unknown order answers 409 (ALREADY_PAID, PAYMENT_OUTCOME_UNKNOWN) without charging. Then POST /orders/:id/reconcile: for an unknown order, look up the charge by reference: found → paid; not found → pending. Missing orders → 404 ORDER_NOT_FOUND.",
          db: ORDERS_SQL,
          services: SERVICES,
          files: {
            "package.json": pkg({ name: "course-api", scripts: START, deps: ["express", "pg"] }),
            ".env": ENV_FILE,
            "db.js": DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

const PROVIDER = process.env.PAYMENTS_API_URL;
const AUTH = { Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\` };

app.post("/orders/:id/pay", async (req, res) => {
  const { rows } = await pool.query("SELECT id, amount, status FROM orders WHERE id = $1", [req.params.id]);
  const order = rows[0];
  const response = await fetch(\`\${PROVIDER}/v1/charges\`, {
    method: "POST",
    headers: { ...AUTH, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: order.amount, currency: "NGN", reference: \`order-\${order.id}\`, card: req.body.card }),
  });
  const charge = await response.json();
  await pool.query("UPDATE orders SET status = 'paid', charge_id = $2 WHERE id = $1", [order.id, charge.id]);
  res.json({ data: { id: order.id, status: "paid", chargeId: charge.id } });
});

app.post("/orders/:id/reconcile", async (req, res) => {
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Not implemented yet" } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

const PROVIDER = process.env.PAYMENTS_API_URL;
const AUTH = { Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\` };
const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });
const view = (o) => ({ id: o.id, status: o.status, chargeId: o.charge_id });

async function setStatus(id, status, chargeId = null) {
  const { rows } = await pool.query("UPDATE orders SET status = $2, charge_id = $3 WHERE id = $1 RETURNING id, status, charge_id", [id, status, chargeId]);
  return rows[0];
}

app.post("/orders/:id/pay", async (req, res) => {
  const { rows } = await pool.query("SELECT id, amount, status FROM orders WHERE id = $1", [req.params.id]);
  const order = rows[0];
  if (!order) return fail(res, 404, "ORDER_NOT_FOUND", "No such order");
  if (order.status === "paid") return fail(res, 409, "ALREADY_PAID", "This order is already paid");
  if (order.status === "unknown") return fail(res, 409, "PAYMENT_OUTCOME_UNKNOWN", "A payment for this order is being checked");

  let response;
  try {
    response = await fetch(\`\${PROVIDER}/v1/charges\`, {
      method: "POST",
      headers: { ...AUTH, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: order.amount, currency: "NGN", reference: \`order-\${order.id}\`, card: req.body.card }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    if (err.name === "TimeoutError") {
      // The charge may exist: do not guess, reconcile.
      await setStatus(order.id, "unknown");
      console.error(\`order \${order.id}: payment outcome unknown (timeout)\`);
      return fail(res, 504, "PAYMENT_OUTCOME_UNKNOWN", "The payment provider did not answer; we are checking whether the payment went through");
    }
    return fail(res, 502, "PAYMENT_PROVIDER_ERROR", "The payment provider could not be reached; try again");
  }
  if (response.status >= 500) return fail(res, 502, "PAYMENT_PROVIDER_ERROR", "The payment provider failed; try again");
  const body = await response.json();
  if (response.status === 402) {
    await setStatus(order.id, "failed");
    return fail(res, 402, "PAYMENT_DECLINED", "The card was declined");
  }
  if (response.status !== 201) throw new Error(\`Unexpected answer from the provider: \${response.status}\`);
  res.json({ data: view(await setStatus(order.id, "paid", body.id)) });
});

app.post("/orders/:id/reconcile", async (req, res) => {
  const { rows } = await pool.query("SELECT id, status, charge_id FROM orders WHERE id = $1", [req.params.id]);
  const order = rows[0];
  if (!order) return fail(res, 404, "ORDER_NOT_FOUND", "No such order");
  if (order.status !== "unknown") return res.json({ data: view(order) });
  const response = await fetch(\`\${PROVIDER}/v1/charges?reference=order-\${order.id}\`, { headers: AUTH, signal: AbortSignal.timeout(3000) });
  const { data } = await response.json();
  const charge = data.find((c) => c.status === "succeeded");
  res.json({ data: view(await setStatus(order.id, charge ? "paid" : "pending", charge?.id ?? null)) });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "A successful charge: the order is paid", check: `const r = await post("/orders/1/pay", { card: "${GOOD_CARD}" }); eq(r.status, 200, "status"); eq([r.json?.data?.id, r.json?.data?.status], [1, "paid"], "body"); assert(/^ch_/.test(r.json?.data?.chargeId || ""), "chargeId"); eq((await sql("SELECT status, charge_id FROM orders WHERE id = 1"))[0], { status: "paid", charge_id: r.json.data.chargeId }, "the order row");` },
            { label: "A declined card: 402, the order failed, and it can be paid with another card", check: `const r = await post("/orders/2/pay", { card: "${BAD_CARD}" }); eq(r.status, 402, "status"); eq(r.json?.error?.code, "PAYMENT_DECLINED", "code"); eq((await sql("SELECT status FROM orders WHERE id = 2"))[0].status, "failed", "order 2 is failed"); eq((await post("/orders/2/pay", { card: "${GOOD_CARD}" })).status, 200, "a failed order can be paid with another card");` },
            { label: "A provider error: 502, and the order stays pending", check: `${PAY} pay.locals.failNext = 1; const r = await post("/orders/3/pay", { card: "${GOOD_CARD}" }); eq(r.status, 502, "status"); eq(r.json?.error?.code, "PAYMENT_PROVIDER_ERROR", "code"); eq((await sql("SELECT status FROM orders WHERE id = 3"))[0].status, "pending", "nothing happened, so the order stays pending"); eq(charges("order-3"), 0, "no charge");` },
            { label: "No answer: 504 after 3 s, and the order is unknown", check: `${PAY} pay.locals.loseNext = 1; const t0 = now(); const r = await post("/orders/4/pay", { card: "${GOOD_CARD}" }); const took = now() - t0; eq(r.status, 504, "status"); eq(r.json?.error?.code, "PAYMENT_OUTCOME_UNKNOWN", "code"); assert(took >= 3000 && took < 3500, "give up after 3 seconds (took " + Math.round(took) + " ms)"); eq((await sql("SELECT status FROM orders WHERE id = 4"))[0].status, "unknown", "the order is unknown (the charge may exist: it does)");` },
            { label: "Paid and unknown orders are not charged again", check: `${PAY} const before = calls().length; const paid = await post("/orders/1/pay", { card: "${GOOD_CARD}" }); eq([paid.status, paid.json?.error?.code], [409, "ALREADY_PAID"], "a paid order"); const unknown = await post("/orders/4/pay", { card: "${GOOD_CARD}" }); eq([unknown.status, unknown.json?.error?.code], [409, "PAYMENT_OUTCOME_UNKNOWN"], "an unknown order"); eq(calls().length - before, 0, "no calls to the provider"); eq((await post("/orders/99/pay", { card: "${GOOD_CARD}" })).status, 404, "a missing order");` },
            { label: "Reconciling finds the lost charge", check: `${PAY} const r = await post("/orders/4/reconcile"); eq(r.status, 200, "status"); eq(r.json?.data?.status, "paid", "the provider has a charge for order-4"); const row = (await sql("SELECT status, charge_id FROM orders WHERE id = 4"))[0]; eq(row.status, "paid", "order 4 is paid"); eq(row.charge_id, pay.locals.charges.find((c) => c.reference === "order-4")?.id, "with the provider's charge id"); eq(charges("order-4"), 1, "one charge");` },
            { label: "…and returns an order without a charge to pending", check: `await sql("UPDATE orders SET status = 'unknown' WHERE id = 6"); const r = await post("/orders/6/reconcile"); eq(r.json?.data?.status, "pending", "no charge for order-6"); eq((await sql("SELECT status FROM orders WHERE id = 6"))[0].status, "pending", "order 6 is pending again, so it can be paid");` },
          ],
          hint: "Wrap the fetch in try/catch with signal: AbortSignal.timeout(3000): err.name === \"TimeoutError\" means unknown, any other rejection means the provider could not be reached. Then branch on response.status: 5xx, 402, 201. For reconcile, GET ${PAYMENTS_API_URL}/v1/charges?reference=order-<id> with the Authorization header.",
          successMessage: "Each of the four outcomes now leaves the order in a state that matches reality, and an unknown one is resolved by asking the provider, not by guessing.",
        },
      },
      {
        id: "a-be-ex-retry-idempotency",
        title: "Exercise: implement safe retries and idempotency",
        explain:
          "Retries and idempotency keys work as a pair. Your API retries the provider (timeouts, 5xx) with backoff, sending the SAME Idempotency-Key on every attempt; the key identifies one payment attempt (this order, this card), so a lost answer, a retry or a double-click all lead to the same single charge. The endpoint itself becomes idempotent too: paying an order that is already paid simply returns it.",
        nodeLab: {
          task:
            "Rewrite POST /orders/:id/pay so it is safe to retry at every level: call the provider through charge() in payments.js (write it as in 16.6: timeout 2 s, 3 retries, 200/400/800 ms backoff, Retry-After) with the Idempotency-Key order-<id>-<last 4 digits of the card>. 201 → paid, 200 { data: { id, status, chargeId } }; 402 → failed, 402 PAYMENT_DECLINED; retries exhausted → 503 PAYMENT_PROVIDER_UNAVAILABLE, order still pending. A paid order answers 200 with the order, without calling the provider.",
          db: ORDERS_SQL,
          services: SERVICES,
          files: {
            "package.json": pkg({ name: "course-api", scripts: START, deps: ["express", "pg"] }),
            ".env": ENV_FILE,
            "db.js": DB_JS,
            "payments.js": `export class ProviderUnavailableError extends Error {}

/** Creates a charge: retried with backoff, always with the same Idempotency-Key. */
export async function charge(body, { idempotencyKey, retries = 3, baseMs = 200, timeoutMs = 2000 } = {}) {
  throw new ProviderUnavailableError("Not written yet");
}
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { ProviderUnavailableError, charge } from "./payments.js";

const app = express();
app.use(express.json());

app.post("/orders/:id/pay", async (req, res) => {
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Not implemented yet" } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "payments.js": PAYMENTS_CLIENT_JS(2000),
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { ProviderUnavailableError, charge } from "./payments.js";

const app = express();
app.use(express.json());

const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });
const view = (o) => ({ id: o.id, status: o.status, chargeId: o.charge_id });

app.post("/orders/:id/pay", async (req, res) => {
  const card = String(req.body?.card ?? "");
  if (!/^\\d{16}$/.test(card)) return fail(res, 400, "VALIDATION_FAILED", "card must be 16 digits");
  const { rows } = await pool.query("SELECT id, amount, status, charge_id FROM orders WHERE id = $1", [req.params.id]);
  const order = rows[0];
  if (!order) return fail(res, 404, "ORDER_NOT_FOUND", "No such order");
  if (order.status === "paid") return res.json({ data: view(order) }); // already done: same answer, no new charge

  let result;
  try {
    result = await charge(
      { amount: order.amount, currency: "NGN", reference: \`order-\${order.id}\`, card },
      { idempotencyKey: \`order-\${order.id}-\${card.slice(-4)}\` } // one key per payment attempt: this order, this card
    );
  } catch (err) {
    if (err instanceof ProviderUnavailableError) return fail(res, 503, "PAYMENT_PROVIDER_UNAVAILABLE", "Payments are unavailable; try again shortly");
    throw err;
  }
  if (result.status === 402) {
    await pool.query("UPDATE orders SET status = 'failed' WHERE id = $1", [order.id]);
    return fail(res, 402, "PAYMENT_DECLINED", "The card was declined");
  }
  if (result.status !== 201) throw new Error(\`Unexpected answer from the provider: \${result.status}\`);
  const paid = await pool.query("UPDATE orders SET status = 'paid', charge_id = $2 WHERE id = $1 RETURNING id, status, charge_id", [order.id, result.body.id]);
  res.json({ data: view(paid.rows[0]) });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "Two provider errors: paid on the third attempt, one key", check: `${PAY} pay.locals.failNext = 2; const before = calls().length; const t0 = now(); const r = await post("/orders/1/pay", { card: "${GOOD_CARD}" }); const took = now() - t0; eq([r.status, r.json?.data?.status], [200, "paid"], "status and order"); const attempts = calls().slice(before); eq(attempts.length, 3, "three attempts"); eq([...new Set(attempts.map((a) => a.headers["idempotency-key"]))], ["order-1-4242"], "every attempt sends Idempotency-Key: order-1-4242"); assert(took >= 600 && took < 800, "200 + 400 ms of backoff (took " + Math.round(took) + " ms)");` },
            { label: "A lost answer: the retry gets the same charge", check: `${PAY} pay.locals.loseNext = 1; const t0 = now(); const r = await post("/orders/2/pay", { card: "${GOOD_CARD}" }); const took = now() - t0; eq([r.status, r.json?.data?.status], [200, "paid"], "order 2 is paid"); eq(charges("order-2"), 1, "exactly one charge"); assert(took >= 2000 && took < 2600, "the first attempt is cut off after 2 s (took " + Math.round(took) + " ms)");` },
            { label: "A double-click: one charge", check: `${PAY} const [a, b] = await together(post("/orders/3/pay", { card: "${GOOD_CARD}" }), post("/orders/3/pay", { card: "${GOOD_CARD}" })); eq([a.status, b.status], [200, 200], "both answers are 200"); eq(charges("order-3"), 1, "one charge for order 3"); eq(a.json?.data?.chargeId, b.json?.data?.chargeId, "the same charge id");` },
            { label: "Provider down: 503, still pending; later it works", check: `${PAY} pay.locals.failNext = 10; const before = calls().length; const r = await post("/orders/4/pay", { card: "${GOOD_CARD}" }); pay.locals.failNext = 0; eq([r.status, r.json?.error?.code], [503, "PAYMENT_PROVIDER_UNAVAILABLE"], "status and code"); eq(calls().length - before, 4, "1 attempt + 3 retries"); eq((await sql("SELECT status FROM orders WHERE id = 4"))[0].status, "pending", "the order is still pending"); eq((await post("/orders/4/pay", { card: "${GOOD_CARD}" })).json?.data?.status, "paid", "paying again later works"); eq(charges("order-4"), 1, "one charge");` },
            { label: "A paid order is returned, not charged again", check: `${PAY} const before = calls().length; const r = await post("/orders/1/pay", { card: "${GOOD_CARD}" }); eq([r.status, r.json?.data?.status], [200, "paid"], "200 with the paid order"); eq(calls().length - before, 0, "no call to the provider");` },
            { label: "A declined card is not retried; another card works", check: `${PAY} const before = calls().length; const r = await post("/orders/5/pay", { card: "${BAD_CARD}" }); eq([r.status, r.json?.error?.code], [402, "PAYMENT_DECLINED"], "declined"); eq(calls().length - before, 1, "a decline is final: one attempt"); eq((await sql("SELECT status FROM orders WHERE id = 5"))[0].status, "failed", "order 5 failed"); const again = await post("/orders/5/pay", { card: "${GOOD_CARD}" }); eq(again.json?.data?.status, "paid", "a different card is a different attempt (a different key), so it is charged");` },
          ],
          hint: "payments.js is the 16.6 client with timeoutMs = 2000. In the route: return the order if it is paid; otherwise await charge({ amount, currency: \"NGN\", reference: `order-${id}`, card }, { idempotencyKey: `order-${id}-${card.slice(-4)}` }) inside try/catch for ProviderUnavailableError.",
          successMessage: "Retries at every level (the provider call, the client, the double-click) now converge on one charge per order and card.",
        },
      },
      {
        id: "a-be-ex-health",
        title: "Exercise: build health-check endpoints",
        explain:
          "GET /health/live answers 200 { status: \"ok\" } from the process alone. GET /health/ready runs each dependency check with a short timeout and answers 200 or 503 with which check failed, never the error itself (it may contain hostnames or credentials; log it instead). Both send Cache-Control: no-store so no proxy serves a stale answer. The pg pool needs an error listener, or a database restart crashes the process (db.js has one).",
        nodeLab: {
          task:
            "Add the health endpoints to server.js: GET /health/live → 200 { status: \"ok\" }, never touching the database; GET /health/ready → SELECT 1 with a 1-second timeout and a check that PAYMENTS_API_URL is configured: 200 { status: \"ready\", checks: { database: \"up\", payments: \"configured\" } } or 503 { status: \"unavailable\", checks: { database: \"down\", … } }, logging the reason with console.error. Both with Cache-Control: no-store. The checks take the database down and bring it back.",
          db: ORDERS_SQL,
          files: {
            "package.json": pkg({ name: "course-api", scripts: START, deps: ["express", "pg"] }),
            ".env": ENV_FILE,
            "db.js": DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/orders/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, status FROM orders WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: { code: "ORDER_NOT_FOUND", message: "No such order" } });
  res.json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

/** Rejects if promise takes longer than ms. */
function within(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(\`no answer within \${ms} ms\`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

app.get("/health/live", (req, res) => {
  res.set("Cache-Control", "no-store").json({ status: "ok" });
});

app.get("/health/ready", async (req, res) => {
  const checks = { database: "up", payments: process.env.PAYMENTS_API_URL ? "configured" : "missing" };
  try {
    await within(pool.query("SELECT 1"), 1000);
  } catch (err) {
    checks.database = "down";
    console.error(\`readiness: database check failed: \${err.message}\`);
  }
  const ready = checks.database === "up" && checks.payments === "configured";
  res.set("Cache-Control", "no-store").status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable", checks });
});

app.get("/orders/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, status FROM orders WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: { code: "ORDER_NOT_FOUND", message: "No such order" } });
  res.json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "Live: 200 { status: \"ok\" }, not cached", check: `const r = await get("/health/live"); eq(r.status, 200, "status"); eq(r.json, { status: "ok" }, "body"); eq(r.headers["cache-control"], "no-store", "Cache-Control");` },
            { label: "Ready: 200 with each check", check: `const r = await get("/health/ready"); eq(r.status, 200, "status"); eq(r.json, { status: "ready", checks: { database: "up", payments: "configured" } }, "body"); eq(r.headers["cache-control"], "no-store", "Cache-Control");` },
            { label: "Database down: ready answers 503 quickly; live stays 200", check: `await get("/orders/1"); dbDown(); const t0 = now(); const r = await get("/health/ready"); const took = now() - t0; eq(r.status, 503, "status while the database is down"); eq(r.json, { status: "unavailable", checks: { database: "down", payments: "configured" } }, "body"); assert(took < 1500, "answer within the 1-second timeout (took " + Math.round(took) + " ms)"); eq((await get("/health/live")).status, 200, "liveness must not depend on the database (or the platform restarts every instance)"); lacks(r.text, "ECONNREFUSED", "keep error details out of the response"); has(stderr(), "database", "log why the check failed"); dbDown(false);` },
            { label: "…and ready again when the database is back", check: `dbDown(true); await get("/health/ready"); dbDown(false); const r = await get("/health/ready"); eq(r.status, 200, "ready again (the pool reconnects)"); eq((await get("/orders/1")).status, 200, "and the API works");` },
            { label: "The process survives the outage", check: `eq(exited(), false, "the server should still be running");` },
          ],
          hint: "Promise.race between pool.query(\"SELECT 1\") and a promise that rejects after 1000 ms. Build checks first, then choose 200 or 503. res.set(\"Cache-Control\", \"no-store\") on both endpoints.",
          successMessage: "The platform can now tell a broken process (restart it) from a broken dependency (stop sending it traffic), and the API rides out a database restart.",
        },
      },
      {
        id: "a-be-ex-diagnose-logs",
        title: "Exercise: diagnose errors using structured logs",
        explain:
          "Structured logs pay off during an incident. Several instances write interleaved lines; the request id ties together one request's story, and sorting by time puts it in order. A small script that prints one request's trace (and lists all errors) is often the fastest diagnosis tool; log platforms do the same with a query such as requestId = \"…\" ORDER BY time.",
        nodeLab: {
          task:
            "logs/app.log has this morning's logs from two API instances (each instance's lines were appended separately, so they are not in time order). Write trace.js: node trace.js <requestId> [file] prints that request's lines sorted by time as \"HH:MM:SS.mmm [instance] LEVEL msg\", followed by \": <err.message>\" when the line has an err; node trace.js --errors [file] prints \"<requestId> <msg>: <err.message>\" for each error line, in time order. The file defaults to logs/app.log. Then write DIAGNOSIS.md with a ## Request section (the failed checkout's request id) and a ## Cause section.",
          command: "node trace.js --errors",
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "logs/app.log": LOG_TODAY,
            "logs/2026-10-26.log": LOG_YESTERDAY,
            "trace.js": `import { readFileSync } from "node:fs";

const [arg, path = "logs/app.log"] = process.argv.slice(2);
`,
            "DIAGNOSIS.md": "# Diagnosis: failed checkout, 27 October\n\n## Request\n\n## Cause\n",
          },
          readOnly: ["package.json", "logs/app.log", "logs/2026-10-26.log"],
          open: "trace.js",
          solution: {
            "trace.js": `import { readFileSync } from "node:fs";

const [arg, path = "logs/app.log"] = process.argv.slice(2);

const entries = readFileSync(path, "utf8")
  .split("\\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .sort((a, b) => a.time.localeCompare(b.time)); // ISO times sort as text

const format = (e) => \`\${e.time.slice(11, 23)} [\${e.instance}] \${e.level.toUpperCase()} \${e.msg}\${e.err ? \`: \${e.err.message}\` : ""}\`;

if (arg === "--errors") {
  for (const e of entries.filter((x) => x.level === "error" && x.err)) console.log(\`\${e.requestId} \${e.msg}: \${e.err.message}\`);
} else {
  for (const e of entries.filter((x) => x.requestId === arg)) console.log(format(e));
}
`,
            "DIAGNOSIS.md": `# Diagnosis: failed checkout, 27 October

## Request

req-b7c2: POST /orders/41/pay on api-2, answered 500 after 6830 ms.

## Cause

The payments provider did not answer: all three attempts hit the 2000 ms timeout, then the client threw ProviderUnavailableError, which nothing handled, so the user got a 500. Fixes: answer 503 PAYMENT_PROVIDER_UNAVAILABLE for this error (it is operational), and investigate the provider's latency.
`,
          },
          tests: [
            { label: "A request's trace, in time order", check: `${TRACE} await run("node trace.js req-b7c2"); eq(stdout().trim(), expectTrace("logs/app.log", "req-b7c2"), "the trace of req-b7c2");` },
            { label: "Another request, another file", check: `${TRACE} await run("node trace.js req-c9d4"); eq(stdout().trim(), expectTrace("logs/app.log", "req-c9d4"), "the trace of req-c9d4"); await run("node trace.js req-y0z9 logs/2026-10-26.log"); eq(stdout().trim(), expectTrace("logs/2026-10-26.log", "req-y0z9"), "a request from yesterday's file");` },
            { label: "--errors lists every error, in time order", check: `${TRACE} await run("node trace.js --errors"); eq(stdout().trim(), expectErrors("logs/app.log"), "today's errors"); await run("node trace.js --errors logs/2026-10-26.log"); eq(stdout().trim(), expectErrors("logs/2026-10-26.log"), "yesterday's errors (sorted by time, across both instances)");` },
            { label: "DIAGNOSIS.md names the request and the cause", check: `const md = file("DIAGNOSIS.md") || ""; has(section(md, "Request"), "req-b7c2", "## Request: the failed checkout's request id"); const cause = section(md, "Cause").toLowerCase(); assert(/payment/.test(cause) && /time(d)? ?out/.test(cause), "## Cause: what failed (the payments provider) and how (timeouts)"); assert(/503|unhandled|operational|500/.test(cause), "## Cause: also say why the user got a 500, and what it should have been");` },
          ],
          hint: "Read the file, split on \\n, JSON.parse each line, sort with a.time.localeCompare(b.time) (ISO times sort as text). e.time.slice(11, 23) is HH:MM:SS.mmm. Run node trace.js --errors first: it points straight at the failed request.",
          successMessage: "From one command to the root cause: a provider timing out, and an operational error nobody handled. Both are now in the diagnosis.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 120 · 16.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l120-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["16.P"],
    title: "Deliverable: A Reliable API",
    subtitle: "Predictable failures, safe retries, and tests that keep it that way",
    estimatedMinutes: 150,
    intro: "The deliverable takes a fragile checkout API and makes it reliable: every failure answered on purpose, every request traceable, payments safe to retry, health visible to the platform, and regression tests that keep it so.",
    atoms: [
      {
        id: "a-be-reliable-api",
        title: "A reliable API",
        explain:
          "Reliability is the sum of this week's habits: structured errors with request ids, a classifier that separates operational errors from bugs, timeouts and retries with idempotency keys on every outgoing call, health and readiness endpoints, and automated tests for the failure paths, which are the paths manual testing never reaches.",
        nodeLab: {
          task:
            "Make the API in app.js reliable: X-Request-Id on every response (a safe incoming one kept); errors as { error: { code, message, requestId } } with 404 ROUTE_NOT_FOUND and a generic 500 INTERNAL_ERROR (GET /reports/revenue has a bug: leave it); POST /orders/:id/pay through a retrying charge() in payments.js (2 s timeout, 3 retries, key order-<id>-<last 4>): paid → 200, decline → 402 PAYMENT_DECLINED, provider down → 503 PAYMENT_PROVIDER_UNAVAILABLE, a paid order returned without a new charge; GET /health/live and /health/ready (503 when the database is down). Write at least 6 tests in test/ (npm test).",
          db: ORDERS_SQL.replace("INSERT INTO orders", "CREATE TABLE revenue_by_day (day date PRIMARY KEY, total bigint NOT NULL);\nINSERT INTO orders"),
          env: { DATABASE_URL: DB_URL, ...PAY_ENV },
          services: SERVICES,
          files: {
            "package.json": pkg({ name: "course-api", scripts: { ...START, test: "vitest run" }, deps: ["express", "pg"], dev: ["supertest", "vitest"] }),
            ".env": ENV_FILE,
            "db.js": DB_JS,
            "server.js": `import { app } from "./app.js";

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "payments.js": `/** Creates a charge at the payment provider. */
export async function charge(body) {
  const res = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/charges\`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\` },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}
`,
            "app.js": `import express from "express";
import { pool } from "./db.js";
import { charge } from "./payments.js";

export const app = express();
app.use(express.json());

app.get("/orders/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, amount, status, charge_id FROM orders WHERE id = $1", [req.params.id]);
  res.json({ data: rows[0] });
});

app.post("/orders/:id/pay", async (req, res) => {
  const { rows } = await pool.query("SELECT id, amount FROM orders WHERE id = $1", [req.params.id]);
  const result = await charge({ amount: rows[0].amount, currency: "NGN", reference: \`order-\${rows[0].id}\`, card: req.body.card });
  await pool.query("UPDATE orders SET status = 'paid', charge_id = $2 WHERE id = $1", [rows[0].id, result.body.id]);
  res.json({ data: { id: rows[0].id, status: "paid", chargeId: result.body.id } });
});

// A bug: the table is revenue_by_day.
app.get("/reports/revenue", async (req, res) => {
  const { rows } = await pool.query("SELECT day, total FROM revenue_daily ORDER BY day");
  res.json({ data: rows });
});
`,
            "test/app.test.js": `import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";
`,
          },
          readOnly: ["package.json", ".env", "db.js", "server.js"],
          open: "app.js",
          solution: {
            "payments.js": PAYMENTS_CLIENT_JS(2000),
            "app.js": `import { randomUUID } from "node:crypto";
import express from "express";
import { pool } from "./db.js";
import { ProviderUnavailableError, charge } from "./payments.js";

class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const SAFE_ID = /^[A-Za-z0-9._-]{1,64}$/;
const view = (o) => ({ id: o.id, amount: o.amount, status: o.status, chargeId: o.charge_id });

function within(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(\`no answer within \${ms} ms\`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export const app = express();

app.use((req, res, next) => {
  const incoming = req.get("x-request-id");
  req.id = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.id);
  next();
});
app.use(express.json());

app.get("/health/live", (req, res) => res.set("Cache-Control", "no-store").json({ status: "ok" }));

app.get("/health/ready", async (req, res) => {
  let database = "up";
  try {
    await within(pool.query("SELECT 1"), 1000);
  } catch (err) {
    database = "down";
    console.error(JSON.stringify({ level: "error", msg: "readiness: database down", requestId: req.id, err: err.message }));
  }
  res.set("Cache-Control", "no-store").status(database === "up" ? 200 : 503).json({ status: database === "up" ? "ready" : "unavailable", checks: { database } });
});

app.get("/orders/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, amount, status, charge_id FROM orders WHERE id = $1", [req.params.id]);
  if (!rows[0]) throw new AppError(404, "ORDER_NOT_FOUND", "No such order");
  res.json({ data: view(rows[0]) });
});

app.post("/orders/:id/pay", async (req, res) => {
  const card = String(req.body?.card ?? "");
  if (!/^\\d{16}$/.test(card)) throw new AppError(400, "VALIDATION_FAILED", "card must be 16 digits");
  const { rows } = await pool.query("SELECT id, amount, status, charge_id FROM orders WHERE id = $1", [req.params.id]);
  const order = rows[0];
  if (!order) throw new AppError(404, "ORDER_NOT_FOUND", "No such order");
  if (order.status === "paid") return res.json({ data: view(order) });

  let result;
  try {
    result = await charge({ amount: order.amount, currency: "NGN", reference: \`order-\${order.id}\`, card }, { idempotencyKey: \`order-\${order.id}-\${card.slice(-4)}\` });
  } catch (err) {
    if (err instanceof ProviderUnavailableError) throw new AppError(503, "PAYMENT_PROVIDER_UNAVAILABLE", "Payments are unavailable; try again shortly");
    throw err;
  }
  if (result.status === 402) {
    await pool.query("UPDATE orders SET status = 'failed' WHERE id = $1", [order.id]);
    throw new AppError(402, "PAYMENT_DECLINED", "The card was declined");
  }
  if (result.status !== 201) throw new Error(\`Unexpected answer from the provider: \${result.status}\`);
  const paid = await pool.query("UPDATE orders SET status = 'paid', charge_id = $2 WHERE id = $1 RETURNING id, amount, status, charge_id", [order.id, result.body.id]);
  res.json({ data: view(paid.rows[0]) });
});

// A bug: the table is revenue_by_day.
app.get("/reports/revenue", async (req, res) => {
  const { rows } = await pool.query("SELECT day, total FROM revenue_daily ORDER BY day");
  res.json({ data: rows });
});

app.use((req, res, next) => next(new AppError(404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`)));

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") err = new AppError(400, "INVALID_JSON", "The request body is not valid JSON");
  if (!(err instanceof AppError)) {
    console.error(JSON.stringify({ level: "error", msg: "unhandled error", requestId: req.id, method: req.method, path: req.originalUrl, err: { message: err.message, stack: err.stack } }));
    err = new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  }
  res.status(err.status).json({ error: { code: err.code, message: err.message, requestId: req.id } });
});
`,
            "test/app.test.js": `import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../app.js";
import { pool } from "../db.js";

beforeEach(async () => {
  await pool.query("UPDATE orders SET status = 'pending', charge_id = NULL");
});

describe("request ids and errors", () => {
  it("gives every response an X-Request-Id", async () => {
    const res = await request(app).get("/health/live");
    expect(res.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("keeps a safe incoming id", async () => {
    const res = await request(app).get("/health/live").set("X-Request-Id", "lb-123");
    expect(res.headers["x-request-id"]).toBe("lb-123");
  });

  it("answers unknown routes with a structured 404", async () => {
    const res = await request(app).get("/nope").set("X-Request-Id", "t-404");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { code: "ROUTE_NOT_FOUND", message: "No route for GET /nope", requestId: "t-404" } });
  });

  it("hides a bug behind a generic 500", async () => {
    const res = await request(app).get("/reports/revenue");
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(res.body)).not.toContain("revenue_daily");
  });
});

describe("health", () => {
  it("is live and ready", async () => {
    expect((await request(app).get("/health/live")).status).toBe(200);
    expect((await request(app).get("/health/ready")).body).toEqual({ status: "ready", checks: { database: "up" } });
  });
});

describe("POST /orders/:id/pay", () => {
  it("pays an order", async () => {
    const res = await request(app).post("/orders/6/pay").send({ card: "4242424242424242" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("paid");
  });

  it("returns a paid order without paying again", async () => {
    const first = await request(app).post("/orders/6/pay").send({ card: "4242424242424242" });
    const again = await request(app).post("/orders/6/pay").send({ card: "4242424242424242" });
    expect(again.body.data.chargeId).toBe(first.body.data.chargeId);
  });

  it("answers 402 for a declined card", async () => {
    const res = await request(app).post("/orders/6/pay").send({ card: "4000000000000002" });
    expect(res.status).toBe(402);
    expect(res.body.error.code).toBe("PAYMENT_DECLINED");
  });

  it("refuses a malformed card and a missing order", async () => {
    expect((await request(app).post("/orders/6/pay").send({ card: "42" })).status).toBe(400);
    expect((await request(app).post("/orders/99/pay").send({ card: "4242424242424242" })).status).toBe(404);
  });
});
`,
          },
          tests: [
            { label: "X-Request-Id on every response", check: `${UUID} const r = await get("/health/live"); assert(UUID.test(r.headers["x-request-id"] || ""), "a UUID in X-Request-Id"); eq((await get("/health/live", { headers: { "X-Request-Id": "lb-77" } })).headers["x-request-id"], "lb-77", "a safe incoming id is kept");` },
            { label: "Structured errors with the request id; bugs hidden", check: `const nf = await get("/nope", { headers: { "X-Request-Id": "rq-404" } }); eq([nf.status, nf.json], [404, { error: { code: "ROUTE_NOT_FOUND", message: "No route for GET /nope", requestId: "rq-404" } }], "an unknown route"); const bug = await get("/reports/revenue", { headers: { "X-Request-Id": "rq-500" } }); eq([bug.status, bug.json], [500, { error: { code: "INTERNAL_ERROR", message: "Something went wrong", requestId: "rq-500" } }], "the revenue bug"); lacks(bug.text, "revenue_daily", "the SQL error stays in the logs"); has(stderr(), "rq-500", "the 500 is logged with its request id");` },
            { label: "Health: live, ready, and 503 when the database is down", check: `eq((await get("/health/live")).status, 200, "live"); eq((await get("/health/ready")).status, 200, "ready"); dbDown(); const down = await get("/health/ready"); const live = await get("/health/live"); dbDown(false); eq(down.status, 503, "ready while the database is down"); eq(live.status, 200, "live while the database is down"); eq((await get("/health/ready")).status, 200, "ready again");` },
            { label: "Paying: paid once; a paid order is not charged again", check: `${PAY} const r = await post("/orders/1/pay", { card: "${GOOD_CARD}" }); eq([r.status, r.json?.data?.status], [200, "paid"], "order 1 paid"); const before = calls().length; const again = await post("/orders/1/pay", { card: "${GOOD_CARD}" }); eq([again.status, again.json?.data?.chargeId], [200, r.json.data.chargeId], "paying again returns the same order"); eq(calls().length - before, 0, "without calling the provider");` },
            { label: "A lost answer and provider errors: retried, one charge", check: `${PAY} pay.locals.loseNext = 1; eq((await post("/orders/2/pay", { card: "${GOOD_CARD}" })).json?.data?.status, "paid", "order 2 after a lost answer"); eq(charges("order-2"), 1, "one charge for order 2"); pay.locals.failNext = 2; eq((await post("/orders/3/pay", { card: "${GOOD_CARD}" })).json?.data?.status, "paid", "order 3 after two 500s"); eq(charges("order-3"), 1, "one charge for order 3");` },
            { label: "Provider down: 503, order pending", check: `${PAY} pay.locals.failNext = 10; const r = await post("/orders/4/pay", { card: "${GOOD_CARD}" }); pay.locals.failNext = 0; eq([r.status, r.json?.error?.code], [503, "PAYMENT_PROVIDER_UNAVAILABLE"], "status and code"); eq((await sql("SELECT status FROM orders WHERE id = 4"))[0].status, "pending", "order 4 is still pending");` },
            { label: "A declined card: 402, order failed", check: `const r = await post("/orders/5/pay", { card: "${BAD_CARD}" }); eq([r.status, r.json?.error?.code], [402, "PAYMENT_DECLINED"], "status and code"); eq((await sql("SELECT status FROM orders WHERE id = 5"))[0].status, "failed", "order 5 failed");` },
            PASSES(6),
          ],
          hint: "Reuse this week's pieces: the request-id middleware (16.5), an AppError and an error handler registered last (16.2), the 16.6 charge() with timeoutMs 2000, the 16.12 pay route and the 16.13 health endpoints. In the tests, reset the orders in beforeEach so they can run in any order.",
          successMessage: "The checkout now survives lost answers, outages, declines, double charges and database restarts, and its tests will catch the day someone breaks one of those paths.",
        },
      },
    ],
    task: {
      title: "Week 16 deliverable: a reliable API with predictable failure handling",
      intro: "Apply this week to your own course API.",
      prompts: [
        "Add AppError classes, a classifier and one error handler: every error as { error: { code, message, details?, requestId } }, and bugs as a generic 500 with the stack trace logged.",
        "Add structured JSON logging with redaction and a request-id middleware; pass X-Request-Id on to every service you call.",
        "Give every outgoing call a timeout; retry the safe ones with backoff and an Idempotency-Key; accept Idempotency-Key on your own POST endpoints that create payments or enrollments.",
        "Add /health/live and /health/ready, and write tests for the failure paths: invalid input, missing records, a failing dependency, a repeated request.",
        "Checkpoint: a customer is charged exactly once however often a client retries, and every failure can be traced from its request id.",
      ],
      closing: "Next: Phase 5 begins with Week 17, software architecture and clean code.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
