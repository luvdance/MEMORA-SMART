/**
 * BACKEND ENGINEERING · WEEK 18 · ADVANCED BACKEND CAPABILITIES
 *
 * Curriculum 18.1 – 18.P. Background jobs on a Redis queue (the API and the
 * worker are separate processes: the checks start one, then the other);
 * scheduled jobs with node-cron and a Redis lock; email notifications;
 * cache invalidation; shared rate limits; object storage with signed URLs;
 * PostgreSQL full-text search; WebSockets; in-process events; message
 * queues; four exercises; and a service with a worker, a cache and an
 * asynchronous workflow.
 *
 * Redis, SMTP and WebSockets are the lab's stand-ins (runtime/services.js)
 * with the real clients' APIs; node-cron, ws's API, multer and pg are the
 * real packages. Redis data, the mailbox and the database survive a
 * restart, as real services would.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s18-advanced";
const MODULE = "be-w18-advanced";

const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
const REDIS_URL = "redis://localhost:6379";
const ENV = (extra = "") => `DATABASE_URL=${DB_URL}\nREDIS_URL=${REDIS_URL}\n${extra}`;
const SMTP = "SMTP_HOST=localhost\nSMTP_PORT=1025\n";
const START = { start: "node --env-file=.env server.js", worker: "node --env-file=.env worker.js" };
const PKG = (deps) => pkg({ name: "course-api", scripts: START, deps });
const WORKER = "node --env-file=.env worker.js";

const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;
const REDIS_JS = `import { createClient } from "redis";

export const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (err) => console.error("Redis:", err.message));
await redis.connect();
`;
const MAILER_JS = `import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) });

export const sendMail = (mail) => transport.sendMail({ from: "Academy <no-reply@academy.example>", ...mail });
`;
const ESCAPE_JS = `const HTML = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => HTML[c]);
`;

/** The Redis job queue (18.1's answer, given in later labs). */
const QUEUE_JS = `import { randomUUID } from "node:crypto";
import { redis } from "./redis.js";

export const QUEUE = "jobs:queue";
export const DEAD = "jobs:dead";
export const MAX_ATTEMPTS = 3;

const key = (id) => \`job:\${id}\`;

/** Adds a job; returns its id. The job's status lives in the hash job:<id>. */
export async function enqueue(type, payload) {
  const job = { id: randomUUID(), type, payload, attempts: 0 };
  await redis.hSet(key(job.id), { type, status: "queued", attempts: 0 });
  await redis.lPush(QUEUE, JSON.stringify(job));
  return job.id;
}

export async function jobStatus(id) {
  const h = await redis.hGetAll(key(id));
  if (!h.status) return null;
  return {
    id,
    type: h.type,
    status: h.status,
    attempts: Number(h.attempts),
    ...(h.result ? { result: JSON.parse(h.result) } : {}),
    ...(h.error ? { error: h.error } : {}),
  };
}

/**
 * Runs queued jobs, oldest first, until the queue is empty; returns how many ran.
 * A failed job is retried (at the back of the queue) up to MAX_ATTEMPTS times,
 * then moved to the dead-letter list.
 */
export async function drain(handlers, log = console.log) {
  let ran = 0;
  for (;;) {
    const raw = await redis.rPop(QUEUE);
    if (!raw) return ran;
    const job = JSON.parse(raw);
    ran += 1;
    job.attempts += 1;
    try {
      const handler = handlers[job.type];
      if (!handler) throw new Error(\`No handler for \${job.type}\`);
      const result = await handler(job.payload);
      await redis.hSet(key(job.id), { status: "done", attempts: job.attempts, result: JSON.stringify(result ?? null) });
      log(\`job \${job.id} \${job.type}: done\`);
    } catch (err) {
      const dead = job.attempts >= MAX_ATTEMPTS;
      await redis.hSet(key(job.id), { status: dead ? "failed" : "queued", attempts: job.attempts, error: err.message });
      if (dead) await redis.lPush(DEAD, JSON.stringify({ ...job, error: err.message }));
      else await redis.lPush(QUEUE, JSON.stringify(job));
      log(\`job \${job.id} \${job.type}: attempt \${job.attempts} failed: \${err.message}\`);
    }
  }
}
`;
/** Check preamble: the app's Redis client (to look at queues). */
const RQ = `const R = async () => (await load("redis.js")).redis; const redis = await R();`;

/* ── 18.6: an S3-like object store ────────────────────────────────────── */

const STORAGE_API = "https://storage.example";
const STORAGE_SERVICE = `const crypto = require("node:crypto");
const express = require("express");
const app = express();
app.locals.objects = new Map(); // "bucket/key" → { body, contentType }
const SIGNING_SECRET = "storage-signing-secret";
const authorised = (req) => req.get("authorization") === "Bearer storage-key";

app.put("/:bucket/*key", express.raw({ type: () => true, limit: "5mb" }), (req, res) => {
  if (!authorised(req)) return res.status(403).send("Forbidden");
  const name = req.params.bucket + "/" + [].concat(req.params.key).join("/");
  app.locals.objects.set(name, { body: Buffer.from(req.body), contentType: req.get("content-type") || "application/octet-stream" });
  res.status(200).set("ETag", '"' + crypto.createHash("md5").update(req.body).digest("hex") + '"').end();
});

app.delete("/:bucket/*key", (req, res) => {
  if (!authorised(req)) return res.status(403).send("Forbidden");
  app.locals.objects.delete(req.params.bucket + "/" + [].concat(req.params.key).join("/"));
  res.status(204).end();
});

// A signed URL: anyone holding it may read the object until it expires.
app.get("/:bucket/*key", (req, res) => {
  const name = req.params.bucket + "/" + [].concat(req.params.key).join("/");
  const expires = Number(req.query.expires);
  const expected = crypto.createHmac("sha256", SIGNING_SECRET).update("GET\\n/" + name + "\\n" + expires).digest("hex");
  const given = String(req.query.signature || "");
  if (!expires || given.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) return res.status(403).send("Bad signature");
  if (expires * 1000 < Date.now()) return res.status(403).send("Expired");
  const object = app.locals.objects.get(name);
  if (!object) return res.status(404).send("Not found");
  res.type(object.contentType).send(object.body);
});

module.exports = app;
`;
const PNG = "new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82])";
const UPLOAD = (bytes, type, name) => `(() => { const fd = new FormData(); fd.append("avatar", new Blob([${bytes}], { type: "${type}" }), "${name}"); return fd; })()`;

/* ── 18.7: course search ──────────────────────────────────────────────── */

const SEARCH_SQL = `CREATE TABLE courses (
  id          integer PRIMARY KEY,
  code        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text NOT NULL,
  level       text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  price       integer NOT NULL,
  -- Kept up to date by PostgreSQL; titles weigh more than descriptions.
  search      tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', description), 'B')) STORED
);
CREATE INDEX courses_search_idx ON courses USING gin (search);
INSERT INTO courses (id, code, title, description, level, price) VALUES
  (1, 'DB-101', 'Relational Database Design', 'Model data with tables, keys and normal forms, then query it with SQL.', 'beginner', 80000),
  (2, 'DB-201', 'Database Performance', 'Indexes, query plans and designing schemas that stay fast as data grows.', 'advanced', 110000),
  (3, 'BE-101', 'Backend Engineering', 'Build APIs with Node.js and Express backed by a relational database.', 'beginner', 120000),
  (4, 'WD-101', 'Responsive Web Design', 'Layouts with CSS grid and flexbox that adapt to every screen.', 'beginner', 60000),
  (5, 'WD-201', 'React Development', 'Components, state and hooks for interactive interfaces.', 'intermediate', 90000),
  (6, 'DS-101', 'Data Analysis with Python', 'Clean, explore and visualise data with pandas.', 'beginner', 70000),
  (7, 'AI-101', 'AI Engineering', 'Build applications on large language models: prompts, tools and evaluation.', 'intermediate', 150000),
  (8, 'SE-301', 'Software Design Patterns', 'Strategies, adapters and other designs that keep code easy to change.', 'advanced', 100000);
`;

/* ── 18.8 and 18.14: users, tokens, WebSockets ────────────────────────── */

const RT_SQL = `CREATE TABLE users (id integer PRIMARY KEY, name text NOT NULL, role text NOT NULL, token text NOT NULL UNIQUE);
CREATE TABLE enrollments (student_id integer NOT NULL REFERENCES users (id), course_id integer NOT NULL, PRIMARY KEY (student_id, course_id));
INSERT INTO users VALUES (1, 'Ada Obi', 'student', 'ada-token'), (2, 'Bayo Adeyemi', 'student', 'bayo-token'), (3, 'Ngozi Eze', 'instructor', 'ngozi-token'), (4, 'Chi Okafor', 'student', 'chi-token');
INSERT INTO enrollments VALUES (1, 1), (2, 1), (2, 2), (4, 2);
`;
const AUTH_HELPER = `import { pool } from "./db.js";

/** The user a bearer token (or ?token= on a WebSocket URL) belongs to, or null. */
export async function userForToken(token) {
  if (!token) return null;
  const { rows } = await pool.query("SELECT id, name, role FROM users WHERE token = $1", [token]);
  return rows[0] ?? null;
}

export async function requireUser(req, res, next) {
  req.user = await userForToken((req.get("authorization") || "").replace(/^Bearer /, ""));
  if (!req.user) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  next();
}
`;

/* ── 18.9: the event bus (given again in 18.14) ───────────────────────── */

const EVENTS_JS = `import { randomUUID } from "node:crypto";

/**
 * An in-process event bus. publish() returns at once; each handler runs
 * afterwards, on its own: one failing handler never affects the publisher
 * or the other handlers.
 */
export function createEventBus({ log = console.error } = {}) {
  const handlers = new Map(); // type → [{ name, fn }]
  return {
    on(type, name, fn) {
      const list = handlers.get(type) ?? [];
      const entry = { name, fn };
      handlers.set(type, [...list, entry]);
      return () => handlers.set(type, (handlers.get(type) ?? []).filter((h) => h !== entry));
    },
    publish(type, data) {
      const event = { id: randomUUID(), type, occurredAt: new Date().toISOString(), data };
      for (const { name, fn } of handlers.get(type) ?? []) {
        setImmediate(async () => {
          try {
            await fn(event);
          } catch (err) {
            log(\`event handler \${name} failed for \${type} \${event.id}: \${err.message}\`);
          }
        });
      }
      return event;
    },
  };
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 127 · 18.1 – 18.3 · JOBS, SCHEDULES, EMAIL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l127-jobs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2", "18.3"],
    title: "Background Jobs, Scheduled Tasks and Email Notifications",
    subtitle: "Work that does not belong in the request",
    estimatedMinutes: 110,
    intro:
      "A request should do only what the client must wait for. Reports, emails, certificates and clean-ups go to background workers, triggered by a request or by the clock, and they must survive failures and run exactly when they should.",
    atoms: [
      {
        id: "a-be-job-queue",
        title: "Background jobs and task queues",
        explain:
          "A TASK QUEUE decouples asking for work from doing it: the API pushes a job (type and payload) onto a queue and answers 202 Accepted with a job id at once; a WORKER, a separate process, pops jobs and runs them. A Redis list is the simplest durable queue: LPUSH to add, RPOP (or BRPOP, which waits) to take, so the oldest job runs first. The job's status lives next to it (queued, done, failed) so clients can poll GET /jobs/:id. Failures are retried a limited number of times; jobs that keep failing go to a DEAD-LETTER list for a human. Libraries such as BullMQ add delays, priorities and dashboards to the same idea.",
        nodeLab: {
          task:
            "Write queue.js: enqueue(type, payload) stores { type, status: \"queued\", attempts: 0 } in the hash job:<id>, pushes { id, type, payload, attempts } onto the list jobs:queue (LPUSH) and returns the id; jobStatus(id) returns { id, type, status, attempts, result?, error? } or null; drain(handlers) pops jobs oldest first (RPOP) and runs handlers[type](payload) until the queue is empty: success stores status done and the JSON result; a failure counts an attempt and re-queues the job, and after 3 attempts marks it failed and pushes it onto jobs:dead. server.js and worker.js are given.",
          db: `CREATE TABLE enrollments (student_id integer NOT NULL, course_id integer NOT NULL, progress integer NOT NULL);
INSERT INTO enrollments VALUES (1, 1, 100), (2, 1, 40), (3, 1, 100), (1, 2, 10);
`,
          redis: true,
          files: {
            "package.json": PKG(["express", "pg", "redis"]),
            ".env": ENV(),
            "db.js": DB_JS,
            "redis.js": REDIS_JS,
            "queue.js": `import { randomUUID } from "node:crypto";
import { redis } from "./redis.js";

export const QUEUE = "jobs:queue";
export const DEAD = "jobs:dead";
export const MAX_ATTEMPTS = 3;

export async function enqueue(type, payload) {}

export async function jobStatus(id) {
  return null;
}

export async function drain(handlers, log = console.log) {
  return 0;
}
`,
            "server.js": `import express from "express";
import { enqueue, jobStatus } from "./queue.js";

const app = express();
app.use(express.json());

// A report takes seconds to build: the API only asks for it.
app.post("/reports", async (req, res) => {
  const id = await enqueue("course-report", { courseId: Number(req.body?.courseId) });
  res.status(202).location(\`/jobs/\${id}\`).json({ data: { jobId: id } });
});

app.get("/jobs/:id", async (req, res) => {
  const job = await jobStatus(req.params.id);
  if (!job) return res.status(404).json({ error: { code: "JOB_NOT_FOUND", message: "No such job" } });
  res.json({ data: job });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": `import { pool } from "./db.js";
import { drain } from "./queue.js";
import { redis } from "./redis.js";

const handlers = {
  async "course-report"({ courseId }) {
    const { rows } = await pool.query(
      "SELECT count(*)::int AS students, count(*) FILTER (WHERE progress = 100)::int AS completed FROM enrollments WHERE course_id = $1",
      [courseId]
    );
    if (rows[0].students === 0) throw new Error(\`No enrollments for course \${courseId}\`);
    return { courseId, ...rows[0] };
  },
};

// In production the worker runs forever (BRPOP); here it drains the queue and stops.
const ran = await drain(handlers);
console.log(\`worker: \${ran} job(s) run\`);
await redis.quit();
await pool.end();
`,
          },
          readOnly: ["package.json", ".env", "db.js", "redis.js", "server.js", "worker.js"],
          open: "queue.js",
          solution: { "queue.js": QUEUE_JS },
          tests: [
            { label: "POST /reports answers 202 with a job id, and queues it", check: `${RQ} const r = await post("/reports", { courseId: 1 }); eq(r.status, 202, "status"); const id = r.json?.data?.jobId; assert(/^[0-9a-f-]{36}$/.test(id || ""), "a job id (UUID)"); eq(r.headers.location, "/jobs/" + id, "Location"); eq((await get("/jobs/" + id)).json?.data, { id, type: "course-report", status: "queued", attempts: 0 }, "GET /jobs/:id before the worker runs"); eq(await (await R()).lLen("jobs:queue"), 1, "one job on jobs:queue"); const queued = JSON.parse((await (await R()).lRange("jobs:queue", 0, -1))[0]); eq([queued.id, queued.type, queued.payload, queued.attempts], [id, "course-report", { courseId: 1 }, 0], "the queued job");` },
            { label: "The worker runs it; the API reports the result", check: `const id = (await post("/reports", { courseId: 2 })).json.data.jobId; await run("${WORKER}"); has(stdout(), "worker: 2 job(s) run", "the worker drains both queued jobs"); await run("npm start"); const job = (await get("/jobs/" + id)).json?.data; eq([job?.status, job?.attempts, job?.result], ["done", 1, { courseId: 2, students: 1, completed: 0 }], "job for course 2");` },
            { label: "Oldest first", check: `const ids = []; for (const c of [1, 2, 1]) ids.push((await post("/reports", { courseId: c })).json.data.jobId); await run("${WORKER}"); const order = stdout().split("\\n").filter((l) => l.startsWith("job ")).map((l) => l.split(" ")[1]); eq(order, ids, "jobs run in the order they were queued (LPUSH + RPOP)");` },
            { label: "A failing job: three attempts, then the dead-letter list", check: `${RQ} await run("npm start"); const id = (await post("/reports", { courseId: 99 })).json.data.jobId; await run("${WORKER}"); eq(stdout().split("\\n").filter((l) => l.includes(id) && l.includes("failed")).length, 3, "three attempts"); await run("npm start"); const job = (await get("/jobs/" + id)).json?.data; eq([job?.status, job?.attempts, job?.error], ["failed", 3, "No enrollments for course 99"], "the job's status"); const dead = (await (await R()).lRange("jobs:dead", 0, -1)).map((j) => JSON.parse(j)); eq(dead.map((j) => [j.id, j.error]), [[id, "No enrollments for course 99"]], "jobs:dead"); eq(await (await R()).lLen("jobs:queue"), 0, "the queue is empty");` },
            { label: "Unknown jobs: 404", check: `eq((await get("/jobs/nope")).status, 404, "GET /jobs/nope");` },
          ],
          hint: "enqueue: build the job with randomUUID(), hSet(\"job:\" + id, { type, status: \"queued\", attempts: 0 }), lPush(QUEUE, JSON.stringify(job)). drain: loop on rPop until it returns null; attempts += 1 before running; on failure lPush back onto QUEUE (or onto DEAD after MAX_ATTEMPTS).",
          successMessage: "The API answers in milliseconds, the worker does the slow part in its own process, and failures are retried and then parked where a person can see them.",
        },
      },
      {
        id: "a-be-scheduled",
        title: "Scheduled jobs and recurring tasks",
        explain:
          "Some work runs on the clock: delete expired sessions every night, send reminders every 15 minutes. A CRON expression says when (minute hour day-of-month month day-of-week: \"0 2 * * *\" is 02:00 daily, \"*/15 * * * *\" every quarter hour), and the TIME ZONE matters (02:00 in Lagos is 01:00 UTC). With several instances of the API, every instance's scheduler fires, so the job would run several times: take a LOCK first (Redis SET lock:<job> <instance> NX EX <seconds>): only the instance that gets it runs the job. A job's error must be caught and logged, never crash the process.",
        nodeLab: {
          task:
            "Write startSchedules({ redis, instance, jobs }) in schedule.js with node-cron: cleanup-sessions at 02:00 every day in Africa/Lagos (lock 600 s) runs jobs.cleanupSessions; send-reminders every 15 minutes (lock 60 s) runs jobs.sendReminders. Before running, take the lock lock:<name> with SET NX EX (value: instance); without it, skip. Catch and log errors (console.error with the job's name). Return the node-cron tasks as { \"cleanup-sessions\": task, \"send-reminders\": task }.",
          command: false,
          redis: true,
          env: { REDIS_URL },
          files: {
            "package.json": pkg({ name: "course-api", deps: ["node-cron", "redis"] }),
            "redis.js": REDIS_JS,
            "schedule.js": `import cron from "node-cron";

export function startSchedules({ redis, instance, jobs }) {
  return {};
}
`,
          },
          readOnly: ["package.json", "redis.js"],
          open: "schedule.js",
          solution: {
            "schedule.js": `import cron from "node-cron";

/** Runs fn only if this instance takes the job's lock (every instance's scheduler fires). */
async function withLock(redis, instance, name, seconds, fn) {
  const locked = await redis.set(\`lock:\${name}\`, instance, { NX: true, EX: seconds });
  if (!locked) return;
  try {
    const n = await fn();
    console.log(\`\${instance}: \${name} done (\${n ?? 0})\`);
  } catch (err) {
    console.error(\`\${instance}: \${name} failed: \${err.message}\`);
  }
}

export function startSchedules({ redis, instance, jobs }) {
  return {
    "cleanup-sessions": cron.schedule("0 2 * * *", () => withLock(redis, instance, "cleanup-sessions", 600, jobs.cleanupSessions), { timezone: "Africa/Lagos" }),
    "send-reminders": cron.schedule("*/15 * * * *", () => withLock(redis, instance, "send-reminders", 60, jobs.sendReminders)),
  };
}
`,
          },
          tests: [
            { label: "Cleanup at 02:00 Lagos time; reminders on the quarter hour", check: `${RQ} const { startSchedules } = await load("schedule.js"); const tasks = startSchedules({ redis, instance: "api-1", jobs: { cleanupSessions: async () => 0, sendReminders: async () => 0 } }); try { const cleanup = tasks["cleanup-sessions"]?.getNextRun?.(); const reminders = tasks["send-reminders"]?.getNextRun?.(); assert(cleanup && reminders, "return the node-cron tasks under their names"); eq(cleanup.toISOString().slice(11, 19), "01:00:00", "02:00 in Africa/Lagos is 01:00 UTC"); assert(cleanup - now() <= 86400000, "cleanup runs daily"); eq([reminders.getUTCMinutes() % 15, reminders.getUTCSeconds()], [0, 0], "reminders at :00, :15, :30, :45"); assert(reminders - now() <= 15 * 60000, "within 15 minutes"); } finally { for (const t of Object.values(tasks)) t.stop?.(); }` },
            { label: "Two instances: each run happens once", check: `${RQ} const { startSchedules } = await load("schedule.js"); const runs = []; const jobs = (who) => ({ cleanupSessions: async () => 0, sendReminders: async () => { runs.push(who); return 1; } }); const a = startSchedules({ redis, instance: "api-1", jobs: jobs("api-1") }); const b = startSchedules({ redis, instance: "api-2", jobs: jobs("api-2") }); try { const next = a["send-reminders"].getNextRun(); await advance(next - now() + 2000); eq(runs.length, 1, "one quarter hour, two schedulers: the job ran " + runs.length + " time(s)"); await advance(15 * 60000); eq(runs.length, 2, "the next quarter hour runs it once more (the 60 s lock has expired)"); } finally { for (const t of [...Object.values(a), ...Object.values(b)]) t.stop(); }` },
            { label: "A failing job is logged, not fatal", check: `${RQ} const { startSchedules } = await load("schedule.js"); await (await R()).del("lock:send-reminders"); let calls = 0; const tasks = startSchedules({ redis, instance: "api-3", jobs: { cleanupSessions: async () => 0, sendReminders: async () => { calls += 1; throw new Error("SMTP is down"); } } }); try { await advance(tasks["send-reminders"].getNextRun() - now() + 2000); eq(calls, 1, "the job ran"); has(stderr(), "send-reminders", "log which job failed"); has(stderr(), "SMTP is down", "and why"); await advance(15 * 60000); eq(calls, 2, "and the schedule keeps going"); } finally { for (const t of Object.values(tasks)) t.stop(); }` },
          ],
          hint: "cron.schedule(expression, fn, { timezone: \"Africa/Lagos\" }) returns a task. Inside fn: const locked = await redis.set(\"lock:\" + name, instance, { NX: true, EX: seconds }); if (!locked) return; then try { await job() } catch (err) { console.error(…) }.",
          successMessage: "Each job runs at the right local time, exactly once however many instances are running, and its failures are logged instead of taking the API down.",
        },
      },
      {
        id: "a-be-email-notifications",
        title: "Email notifications",
        explain:
          "Notification emails are part of the product: TRANSACTIONAL emails (an enrollment confirmation, a password reset) are always sent; MARKETING emails (a new course) respect each user's opt-out and carry an unsubscribe link and a List-Unsubscribe header, which mail providers and the law expect. Send both a text and an HTML part, escape every user-supplied value in the HTML (a name is data, not markup), and use a development mail server (Mailpit, MailHog) locally so no real customer ever gets a test email.",
        nodeLab: {
          task:
            "Write sendNotification(template, user, data) in notify.js for two templates. enrollment-confirmed (transactional): subject \"You're enrolled in <code>\", text \"Hi <name>, you are enrolled in <title>.\", the same in HTML with the values escaped. new-course (marketing): skipped with { sent: false, reason: \"opted-out\" } when user.marketingOptOut; otherwise subject \"New course: <title>\", a text that ends with the unsubscribe link https://academy.example/unsubscribe?user=<id>&sig=<signature> (signature: unsubscribeSignature(user.id), given) and a List-Unsubscribe header <that link>. Return { sent: true } after sending through sendMail.",
          command: false,
          mail: true,
          env: { SMTP_HOST: "localhost", SMTP_PORT: "1025", UNSUBSCRIBE_SECRET: "unsub-secret" },
          files: {
            "package.json": pkg({ name: "course-api", deps: ["nodemailer"] }),
            "mailer.js": MAILER_JS,
            "html.js": ESCAPE_JS,
            "signing.js": `import { createHmac } from "node:crypto";

/** The signature that proves an unsubscribe link was made by us. */
export const unsubscribeSignature = (userId) => createHmac("sha256", process.env.UNSUBSCRIBE_SECRET).update(String(userId)).digest("hex").slice(0, 32);
`,
            "notify.js": `import { escapeHtml } from "./html.js";
import { sendMail } from "./mailer.js";
import { unsubscribeSignature } from "./signing.js";

/** Sends one notification email. user: { id, email, name, marketingOptOut }. */
export async function sendNotification(template, user, data) {
  return { sent: false };
}
`,
          },
          readOnly: ["package.json", "mailer.js", "html.js", "signing.js"],
          open: "notify.js",
          solution: {
            "notify.js": `import { escapeHtml } from "./html.js";
import { sendMail } from "./mailer.js";
import { unsubscribeSignature } from "./signing.js";

const unsubscribeLink = (user) => \`https://academy.example/unsubscribe?user=\${user.id}&sig=\${unsubscribeSignature(user.id)}\`;

const TEMPLATES = {
  "enrollment-confirmed": {
    marketing: false,
    render: (user, { code, title }) => ({
      subject: \`You're enrolled in \${code}\`,
      text: \`Hi \${user.name}, you are enrolled in \${title}.\`,
      html: \`<p>Hi \${escapeHtml(user.name)}, you are enrolled in <strong>\${escapeHtml(title)}</strong>.</p>\`,
    }),
  },
  "new-course": {
    marketing: true,
    render: (user, { title }) => ({
      subject: \`New course: \${title}\`,
      text: \`Hi \${user.name}, \${title} is now open for enrollment.\\n\\nUnsubscribe: \${unsubscribeLink(user)}\`,
      html: \`<p>Hi \${escapeHtml(user.name)}, <strong>\${escapeHtml(title)}</strong> is now open for enrollment.</p><p><a href="\${escapeHtml(unsubscribeLink(user))}">Unsubscribe</a></p>\`,
    }),
  },
};

/** Sends one notification email. user: { id, email, name, marketingOptOut }. */
export async function sendNotification(template, user, data) {
  const t = TEMPLATES[template];
  if (!t) throw new Error(\`Unknown email template: \${template}\`);
  if (t.marketing && user.marketingOptOut) return { sent: false, reason: "opted-out" };
  const mail = { to: user.email, ...t.render(user, data) };
  if (t.marketing) mail.headers = { "List-Unsubscribe": \`<\${unsubscribeLink(user)}>\` };
  await sendMail(mail);
  return { sent: true };
}
`,
          },
          tests: [
            { label: "Enrollment confirmed: text and escaped HTML", check: `const { sendNotification } = await load("notify.js"); const user = { id: 7, email: "ada@example.com", name: "Ada <b>Obi</b>", marketingOptOut: true }; eq(await wait(sendNotification("enrollment-confirmed", user, { code: "BE-101", title: "Backend & APIs" })), { sent: true }, "the result (transactional mail is sent even to people who opted out of marketing)"); const m = emails().at(-1); eq([m?.to?.[0], m?.subject, m?.text], ["ada@example.com", "You're enrolled in BE-101", "Hi Ada <b>Obi</b>, you are enrolled in Backend & APIs."], "to, subject, text"); has(m.html, "Ada &lt;b&gt;Obi&lt;/b&gt;", "the name is escaped in the HTML"); has(m.html, "Backend &amp; APIs", "and the title"); lacks(m.html, "<b>Obi", "no raw user markup in the HTML");` },
            { label: "Marketing respects the opt-out", check: `const { sendNotification } = await load("notify.js"); const before = emails().length; eq(await wait(sendNotification("new-course", { id: 8, email: "bayo@example.com", name: "Bayo", marketingOptOut: true }, { title: "AI Engineering" })), { sent: false, reason: "opted-out" }, "an opted-out user"); eq(emails().length, before, "no email sent");` },
            { label: "…and carries a signed unsubscribe link and header", check: `const { sendNotification } = await load("notify.js"); const { unsubscribeSignature } = await load("signing.js"); eq(await wait(sendNotification("new-course", { id: 9, email: "chi@example.com", name: "Chi", marketingOptOut: false }, { title: "AI Engineering" })), { sent: true }, "sent"); const m = emails().at(-1); const link = "https://academy.example/unsubscribe?user=9&sig=" + unsubscribeSignature(9); eq(m?.subject, "New course: AI Engineering", "subject"); assert(m.text.trim().endsWith(link), "the text ends with the unsubscribe link " + link); eq(m.headers?.["List-Unsubscribe"], "<" + link + ">", "the List-Unsubscribe header"); has(m.html, "unsubscribe?user=9&amp;sig=", "the HTML links it too (with & escaped)");` },
          ],
          hint: "A table of templates, each with marketing: true/false and render(user, data) → { subject, text, html }. In sendNotification: look up the template, return early for opted-out marketing, add headers: { \"List-Unsubscribe\": `<${link}>` } for marketing, then await sendMail({ to: user.email, … }).",
          successMessage: "Both kinds of notification follow the rules mail providers enforce: transactional always, marketing only with consent and a one-click way out.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 128 · 18.4 – 18.5 · CACHE INVALIDATION, SHARED RATE LIMITS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l128-cache-limits",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.4", "18.5"],
    title: "Redis Caching, Cache Invalidation and Shared Rate Limits",
    subtitle: "State that every instance of the API shares",
    estimatedMinutes: 85,
    intro: "Week 12 cached one list. Real APIs cache many variants of many things, and must forget each of them at the right moment. The same Redis also lets every instance enforce one rate limit together.",
    atoms: [
      {
        id: "a-be-cache-invalidation",
        title: "Redis caching and cache invalidation",
        explain:
          "Invalidation is the hard part of caching. A record's own key is easy: delete course:3 when course 3 changes. LISTS are harder: GET /courses?level=beginner and every other filter and page is its own cached answer, and you cannot list them all to delete. VERSIONED KEYS solve it: put a version number in every list key (courses:v7:level=beginner); a change INCRements the version, so every old list key is simply never read again and expires through its TTL. Always set a TTL as a safety net, invalidate AFTER the database write succeeds, and never cache errors.",
        nodeLab: {
          task:
            "Cache GET /courses/:id under course:<id> and GET /courses (with its optional ?level=) under courses:v<version>:<level or all>, where the version is the number in the key courses:version (0 if unset); both for 300 seconds, with X-Cache: HIT or MISS. PATCH /courses/:id must delete course:<id> and INCR courses:version after the update succeeds. A missing course (404) is not cached.",
          db: `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, title text NOT NULL, level text NOT NULL, price integer NOT NULL);
INSERT INTO courses VALUES (1, 'BE-101', 'Backend Engineering', 'beginner', 120000), (2, 'DB-201', 'Database Performance', 'advanced', 110000), (3, 'DB-101', 'Relational Databases', 'beginner', 80000);
`,
          redis: true,
          files: {
            "package.json": PKG(["express", "pg", "redis"]),
            ".env": ENV(),
            "db.js": DB_JS,
            "redis.js": REDIS_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { redis } from "./redis.js";

const app = express();
app.use(express.json());
const COLUMNS = "id, code, title, level, price";

app.get("/courses", async (req, res) => {
  const level = req.query.level ? String(req.query.level) : null;
  const { rows } = await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE $1::text IS NULL OR level = $1 ORDER BY id\`, [level]);
  res.json({ data: rows });
});

app.get("/courses/:id", async (req, res) => {
  const { rows } = await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE id = $1\`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.json({ data: rows[0] });
});

app.patch("/courses/:id", async (req, res) => {
  const { title, level, price } = req.body ?? {};
  const { rows } = await pool.query(
    \`UPDATE courses SET title = COALESCE($2, title), level = COALESCE($3, level), price = COALESCE($4, price) WHERE id = $1 RETURNING \${COLUMNS}\`,
    [req.params.id, title ?? null, level ?? null, price ?? null]
  );
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "redis.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { redis } from "./redis.js";

const app = express();
app.use(express.json());
const COLUMNS = "id, code, title, level, price";
const TTL = 300;

/** Cache-aside: answer from Redis, or compute, store for TTL seconds and answer. */
async function cached(res, key, load) {
  const hit = await redis.get(key);
  if (hit) return res.set("X-Cache", "HIT").json(JSON.parse(hit));
  const body = await load();
  if (body) await redis.set(key, JSON.stringify(body), { EX: TTL });
  return body;
}

const listVersion = async () => Number((await redis.get("courses:version")) ?? 0);

app.get("/courses", async (req, res) => {
  const level = req.query.level ? String(req.query.level) : null;
  const key = \`courses:v\${await listVersion()}:\${level ?? "all"}\`;
  const body = await cached(res, key, async () => {
    const { rows } = await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE $1::text IS NULL OR level = $1 ORDER BY id\`, [level]);
    return { data: rows };
  });
  if (body) res.set("X-Cache", "MISS").json(body);
});

app.get("/courses/:id", async (req, res) => {
  const body = await cached(res, \`course:\${req.params.id}\`, async () => {
    const { rows } = await pool.query(\`SELECT \${COLUMNS} FROM courses WHERE id = $1\`, [req.params.id]);
    return rows[0] ? { data: rows[0] } : null; // never cache a 404
  });
  if (res.headersSent) return;
  if (!body) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.set("X-Cache", "MISS").json(body);
});

app.patch("/courses/:id", async (req, res) => {
  const { title, level, price } = req.body ?? {};
  const { rows } = await pool.query(
    \`UPDATE courses SET title = COALESCE($2, title), level = COALESCE($3, level), price = COALESCE($4, price) WHERE id = $1 RETURNING \${COLUMNS}\`,
    [req.params.id, title ?? null, level ?? null, price ?? null]
  );
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  // After the write succeeded: forget this course, and every cached list at once.
  await redis.del(\`course:\${rows[0].id}\`);
  await redis.incr("courses:version");
  res.json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "Detail: MISS, then HIT, with a TTL", check: `${RQ} const a = await get("/courses/1"); const b = await get("/courses/1"); eq([a.headers["x-cache"], b.headers["x-cache"]], ["MISS", "HIT"], "X-Cache"); eq(b.json, a.json, "the cached body is the same"); const ttl = await (await R()).ttl("course:1"); assert(ttl > 0 && ttl <= 300, "course:1 expires within 300 s (ttl " + ttl + ")");` },
            { label: "Lists: one key per filter, under the current version", check: `${RQ} eq((await get("/courses?level=beginner")).headers["x-cache"], "MISS", "first beginner list"); eq((await get("/courses?level=beginner")).headers["x-cache"], "HIT", "second"); eq((await get("/courses")).headers["x-cache"], "MISS", "the unfiltered list is another key"); assert(await (await R()).get("courses:v0:beginner"), "key courses:v0:beginner"); assert(await (await R()).get("courses:v0:all"), "key courses:v0:all");` },
            { label: "A change is visible at once, everywhere", check: `const r = await patch("/courses/3", { title: "Relational Database Design", level: "advanced" }); eq(r.status, 200, "PATCH"); const one = await get("/courses/3"); eq([one.headers["x-cache"], one.json?.data?.title], ["MISS", "Relational Database Design"], "the detail is fresh"); eq((await get("/courses?level=beginner")).json?.data?.map((c) => c.code), ["BE-101"], "the beginner list no longer has DB-101"); eq((await get("/courses?level=advanced")).json?.data?.map((c) => c.code), ["DB-201", "DB-101"], "the advanced list has it"); eq((await get("/courses")).json?.data?.[2]?.title, "Relational Database Design", "the full list too");` },
            { label: "Other courses stay cached; 404s are not cached", check: `${RQ} await get("/courses/2"); await patch("/courses/1", { price: 125000 }); eq((await get("/courses/2")).headers["x-cache"], "HIT", "course 2 was not touched by changing course 1"); eq(await (await R()).get("courses:version"), "2", "two changes, version 2"); eq((await get("/courses/99")).status, 404, "a missing course"); eq(await (await R()).get("course:99"), null, "the 404 must not be cached"); eq((await patch("/courses/99", { price: 1 })).status, 404, "PATCH a missing course"); eq(await (await R()).get("courses:version"), "2", "a failed update must not invalidate");` },
          ],
          hint: "A helper cached(res, key, load) keeps it short: redis.get(key) → if found, set X-Cache: HIT and answer; else run load(), redis.set(key, JSON.stringify(body), { EX: 300 }) unless it is null. The list key reads courses:version first. In PATCH, del and incr after the UPDATE returned a row.",
          successMessage: "Every variant of the list is invalidated by one INCR, each course by one DEL, and nothing stale or broken is ever served from the cache.",
        },
      },
      {
        id: "a-be-shared-rate-limit",
        title: "Rate limiting with shared storage",
        explain:
          "A rate limit kept in the API's memory is per INSTANCE: with four instances behind a load balancer a client gets four times the limit, and every restart forgets the counts. Keep the counters in Redis and every instance enforces one limit. A FIXED WINDOW is the simplest: INCR ratelimit:<who>:<window number>, and on the first hit EXPIRE it for the window's length; above the limit answer 429 with Retry-After. Tell clients where they stand with the RateLimit-Limit, RateLimit-Remaining and RateLimit-Reset headers. (express-rate-limit accepts a Redis store for the same purpose.)",
        nodeLab: {
          task:
            "Write rateLimit({ limit, windowSeconds, prefix }) in rateLimit.js: an Express middleware that counts requests per client IP (req.ip) in Redis under <prefix>:<ip>:<window number> (window number = Math.floor(seconds since epoch / windowSeconds)), with INCR and, for the first request of a window, EXPIRE windowSeconds. Set RateLimit-Limit, RateLimit-Remaining (never below 0) and RateLimit-Reset (seconds until the window ends) on every response; above the limit answer 429 RATE_LIMITED with Retry-After. server.js puts it on POST /auth/login: 5 per 60 seconds.",
          redis: true,
          files: {
            "package.json": PKG(["express", "redis"]),
            ".env": ENV(),
            "redis.js": REDIS_JS,
            "rateLimit.js": `import { redis } from "./redis.js";

export function rateLimit({ limit, windowSeconds, prefix }) {
  return (req, res, next) => next();
}
`,
            "server.js": `import express from "express";
import { rateLimit } from "./rateLimit.js";

const app = express();
app.use(express.json());

app.post("/auth/login", rateLimit({ limit: 5, windowSeconds: 60, prefix: "ratelimit:login" }), (req, res) => {
  res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "redis.js", "server.js"],
          open: "rateLimit.js",
          solution: {
            "rateLimit.js": `import { redis } from "./redis.js";

/** A fixed-window limit shared by every instance of the API through Redis. */
export function rateLimit({ limit, windowSeconds, prefix }) {
  return async (req, res, next) => {
    const nowSeconds = Date.now() / 1000;
    const window = Math.floor(nowSeconds / windowSeconds);
    const key = \`\${prefix}:\${req.ip}:\${window}\`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    const reset = Math.ceil((window + 1) * windowSeconds - nowSeconds);
    res.set({ "RateLimit-Limit": String(limit), "RateLimit-Remaining": String(Math.max(0, limit - count)), "RateLimit-Reset": String(reset) });
    if (count > limit) {
      return res.set("Retry-After", String(reset)).status(429).json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } });
    }
    next();
  };
}
`,
          },
          tests: [
            { label: "Five attempts, then 429 with Retry-After", check: `const seen = []; for (let i = 0; i < 6; i++) { const r = await post("/auth/login", { email: "ada@example.com", password: "x" }); seen.push([r.status, r.headers["ratelimit-remaining"]]); } eq(seen, [[401, "4"], [401, "3"], [401, "2"], [401, "1"], [401, "0"], [429, "0"]], "status and RateLimit-Remaining for six attempts"); const last = await post("/auth/login", {}); eq(last.json?.error?.code, "RATE_LIMITED", "code"); eq(last.headers["ratelimit-limit"], "5", "RateLimit-Limit"); const retry = Number(last.headers["retry-after"]); assert(retry >= 1 && retry <= 60, "Retry-After in seconds (" + last.headers["retry-after"] + ")"); eq(last.headers["ratelimit-reset"], last.headers["retry-after"], "RateLimit-Reset");` },
            { label: "The count is in Redis, so a restart (or another instance) shares it", check: `await run("npm start"); eq((await post("/auth/login", {})).status, 429, "after a restart the limit still applies: an in-memory counter would have forgotten");` },
            { label: "Keys expire with their window; a new window starts fresh", check: `${RQ} const keys = await (await R()).keys("ratelimit:login:*"); eq(keys.length, 1, "one key for this client and window"); const ttl = await (await R()).ttl(keys[0]); assert(ttl > 0 && ttl <= 60, "the key expires with its window (ttl " + ttl + ")"); await advance(61000); const r = await post("/auth/login", {}); eq([r.status, r.headers["ratelimit-remaining"]], [401, "4"], "a new window");` },
          ],
          hint: "const key = `${prefix}:${req.ip}:${Math.floor(Date.now() / 1000 / windowSeconds)}`; const count = await redis.incr(key); if (count === 1) await redis.expire(key, windowSeconds). The window ends at (window + 1) * windowSeconds seconds since the epoch.",
          successMessage: "One limit for the whole fleet, kept across restarts, and clients are told exactly how many attempts they have left.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 129 · 18.6 – 18.7 · OBJECT STORAGE AND SEARCH
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l129-storage-search",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.6", "18.7"],
    title: "Object Storage for Files, and Search and Filtering",
    subtitle: "Files that outlive servers, and finding things by meaning",
    estimatedMinutes: 90,
    intro: "Two capabilities most backends need sooner or later: storing files somewhere better than the server's disk, and letting users search text rather than match it exactly.",
    atoms: [
      {
        id: "a-be-object-storage",
        title: "Object storage for uploaded files",
        explain:
          "A server's disk is the wrong place for uploads: containers are replaced, instances do not share disks, and backups miss it. OBJECT STORAGE (Amazon S3, Cloudflare R2, Google Cloud Storage, MinIO locally) stores each file as an object under a key in a bucket, over HTTP. The API validates the upload, chooses the key itself (avatars/<user>/<uuid>.png), PUTs the bytes, and records the key and metadata in PostgreSQL. To serve a private file, it answers with a short-lived SIGNED URL that the storage service verifies, so the bytes never pass through the API. Replace means upload the new object, update the row, delete the old object.",
        nodeLab: {
          task:
            "Implement POST /me/avatar and GET /me/avatar (the user is X-User-Id). POST: multer memory storage, at most 512 KB (413), PNG or JPEG by magic bytes (415); PUT the bytes to ${STORAGE_URL}/${STORAGE_BUCKET}/avatars/<user>/<uuid>.<png|jpg> with Authorization: Bearer ${STORAGE_KEY} and the Content-Type; upsert user_files; delete the previous object; 201 { data: { key, size } }. GET: 302 to the object's signed URL valid 300 seconds: ?expires=<unix seconds>&signature=<HMAC-SHA256 hex of \"GET\\n/<bucket>/<key>\\n<expires>\" with STORAGE_SIGNING_SECRET>; 404 AVATAR_NOT_FOUND without one.",
          db: `CREATE TABLE user_files (user_id integer PRIMARY KEY, key text NOT NULL, content_type text NOT NULL, size integer NOT NULL, uploaded_at timestamptz NOT NULL DEFAULT now());\n`,
          services: { [STORAGE_API]: STORAGE_SERVICE },
          files: {
            "package.json": PKG(["express", "multer", "pg"]),
            ".env": `DATABASE_URL=${DB_URL}\nSTORAGE_URL=${STORAGE_API}\nSTORAGE_BUCKET=academy-uploads\nSTORAGE_KEY=storage-key\nSTORAGE_SIGNING_SECRET=storage-signing-secret\n`,
            "db.js": DB_JS,
            "server.js": `import { createHmac, randomUUID } from "node:crypto";
import express from "express";
import multer from "multer";
import { pool } from "./db.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 512 * 1024 } });
const { STORAGE_URL, STORAGE_BUCKET, STORAGE_KEY, STORAGE_SIGNING_SECRET } = process.env;

app.use((req, res, next) => {
  req.userId = Number(req.get("x-user-id"));
  if (!Number.isInteger(req.userId) || req.userId < 1) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  next();
});

app.post("/me/avatar", upload.single("avatar"), async (req, res) => {
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Not implemented yet" } });
});

app.get("/me/avatar", async (req, res) => {
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Not implemented yet" } });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: { code: "FILE_TOO_LARGE", message: "At most 512 KB" } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "server.js": `import { createHmac, randomUUID } from "node:crypto";
import express from "express";
import multer from "multer";
import { pool } from "./db.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 512 * 1024 } });
const { STORAGE_URL, STORAGE_BUCKET, STORAGE_KEY, STORAGE_SIGNING_SECRET } = process.env;
const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });

/** The image type, from the file's first bytes (never from what the client claims). */
function imageType(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return { ext: "jpg", type: "image/jpeg" };
  return null;
}

const objectUrl = (key) => \`\${STORAGE_URL}/\${STORAGE_BUCKET}/\${key}\`;
const auth = { Authorization: \`Bearer \${STORAGE_KEY}\` };

function signedUrl(key, seconds) {
  const expires = Math.floor(Date.now() / 1000) + seconds;
  const signature = createHmac("sha256", STORAGE_SIGNING_SECRET).update(\`GET\\n/\${STORAGE_BUCKET}/\${key}\\n\${expires}\`).digest("hex");
  return \`\${objectUrl(key)}?expires=\${expires}&signature=\${signature}\`;
}

app.use((req, res, next) => {
  req.userId = Number(req.get("x-user-id"));
  if (!Number.isInteger(req.userId) || req.userId < 1) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  next();
});

app.post("/me/avatar", upload.single("avatar"), async (req, res) => {
  if (!req.file) return fail(res, 400, "FILE_REQUIRED", "Send the image in the field avatar");
  const image = imageType(req.file.buffer);
  if (!image) return fail(res, 415, "UNSUPPORTED_FILE", "Only PNG and JPEG images");
  const key = \`avatars/\${req.userId}/\${randomUUID()}.\${image.ext}\`;
  const put = await fetch(objectUrl(key), { method: "PUT", headers: { ...auth, "Content-Type": image.type }, body: req.file.buffer });
  if (!put.ok) throw new Error(\`Storage answered \${put.status}\`);
  const previous = (await pool.query("SELECT key FROM user_files WHERE user_id = $1", [req.userId])).rows[0];
  await pool.query(
    "INSERT INTO user_files (user_id, key, content_type, size) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET key = $2, content_type = $3, size = $4, uploaded_at = now()",
    [req.userId, key, image.type, req.file.size]
  );
  if (previous) await fetch(objectUrl(previous.key), { method: "DELETE", headers: auth }); // the row no longer points at it
  res.status(201).json({ data: { key, size: req.file.size } });
});

app.get("/me/avatar", async (req, res) => {
  const { rows } = await pool.query("SELECT key FROM user_files WHERE user_id = $1", [req.userId]);
  if (!rows[0]) return fail(res, 404, "AVATAR_NOT_FOUND", "No avatar yet");
  res.redirect(302, signedUrl(rows[0].key, 300));
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: { code: "FILE_TOO_LARGE", message: "At most 512 KB" } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "An upload goes to object storage, under a key the server chose", check: `const store = service("${STORAGE_API}"); const r = await request("POST", "/me/avatar", { body: ${UPLOAD(PNG, "image/png", "../../me.png")}, headers: { "X-User-Id": "1" } }); eq(r.status, 201, "status"); const key = r.json?.data?.key || ""; assert(/^avatars\\/1\\/[0-9a-f-]{36}\\.png$/.test(key), "key avatars/1/<uuid>.png (got " + key + ")"); eq(r.json.data.size, 16, "size"); const obj = store.locals.objects.get("academy-uploads/" + key); assert(obj, "the object is in the bucket"); eq([obj.body.length, obj.contentType], [16, "image/png"], "its bytes and Content-Type"); eq((await sql("SELECT key, content_type, size FROM user_files WHERE user_id = 1"))[0], { key, content_type: "image/png", size: 16 }, "the user_files row"); assert(!Object.keys(files()).some((p) => p.startsWith("uploads/")), "nothing is written to the server's disk");` },
            { label: "GET /me/avatar redirects to a signed URL that expires in 5 minutes", check: `const { createHmac } = await load("node:crypto"); const r = await get("/me/avatar", { headers: { "X-User-Id": "1" } }); eq(r.status, 302, "status"); const u = new URL(r.headers.location); eq(u.origin, "${STORAGE_API}", "the storage service"); const key = (await sql("SELECT key FROM user_files WHERE user_id = 1"))[0].key; eq(u.pathname, "/academy-uploads/" + key, "the object's path"); const expires = Number(u.searchParams.get("expires")); assert(Math.abs(expires - (Math.floor(now() / 1000) + 300)) <= 2, "expires 300 s from now"); eq(u.searchParams.get("signature"), createHmac("sha256", "storage-signing-secret").update("GET\\n/academy-uploads/" + key + "\\n" + expires).digest("hex"), "the signature"); lacks(r.headers.location, "storage-key", "never put the storage key in a URL");` },
            { label: "Replacing it deletes the old object", check: `const store = service("${STORAGE_API}"); const old = (await sql("SELECT key FROM user_files WHERE user_id = 1"))[0].key; const r = await request("POST", "/me/avatar", { body: ${UPLOAD("new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70])", "image/jpeg", "me.jpg")}, headers: { "X-User-Id": "1" } }); eq(r.status, 201, "status"); assert(r.json.data.key.endsWith(".jpg"), "a JPEG key"); assert(!store.locals.objects.has("academy-uploads/" + old), "the old object was deleted"); assert(store.locals.objects.has("academy-uploads/" + r.json.data.key), "the new one is there"); eq((await sql("SELECT count(*)::int AS n FROM user_files"))[0].n, 1, "still one row");` },
            { label: "Refusals: not an image, too big, no avatar", check: `const fake = await request("POST", "/me/avatar", { body: ${UPLOAD('"<script>alert(1)</script>"', "image/png", "x.png")}, headers: { "X-User-Id": "2" } }); eq([fake.status, fake.json?.error?.code], [415, "UNSUPPORTED_FILE"], "text claiming to be a PNG"); const big = await request("POST", "/me/avatar", { body: ${UPLOAD("new Uint8Array(600 * 1024)", "image/png", "big.png")}, headers: { "X-User-Id": "2" } }); eq(big.status, 413, "600 KB"); const none = await get("/me/avatar", { headers: { "X-User-Id": "2" } }); eq([none.status, none.json?.error?.code], [404, "AVATAR_NOT_FOUND"], "user 2 has no avatar"); eq(service("${STORAGE_API}").locals.objects.size, 1, "nothing else was stored");` },
          ],
          hint: "Check the magic bytes first, then build the key with randomUUID(). fetch(url, { method: \"PUT\", headers: { Authorization, \"Content-Type\" }, body: req.file.buffer }). The signed URL is the object URL plus ?expires=…&signature=createHmac(\"sha256\", secret).update(`GET\\n/${bucket}/${key}\\n${expires}`).digest(\"hex\").",
          successMessage: "Files now live in object storage, the database knows where, old objects are cleaned up, and private files are handed out by URLs that expire on their own.",
        },
      },
      {
        id: "a-be-search",
        title: "Search and filtering strategies",
        explain:
          "FILTERING matches exact values (level = 'beginner', price <= 90000) and is a WHERE clause with indexes. SEARCH matches meaning in text: 'designs' should find 'Design', and better matches should come first. PostgreSQL's full-text search does this: to_tsvector('english', text) reduces words to stems (design, databas), websearch_to_tsquery('english', $1) turns what a user types (\"database design\", quotes for phrases, -word to exclude) into a query, @@ matches, ts_rank orders by relevance, and a GIN index on a stored tsvector column makes it fast. ILIKE '%term%' cannot use a normal index and knows nothing about word forms. Dedicated engines (Elasticsearch, Meilisearch, Typesense) add typo tolerance and facets when PostgreSQL is not enough.",
        nodeLab: {
          task:
            "Implement GET /courses/search?q=&level=&maxPrice=&limit= with the search column (a GIN-indexed tsvector, title weighted above description): match search @@ websearch_to_tsquery('english', q), filter by level and maxPrice when given, order by ts_rank(search, query) descending then id, limit (default 10, at most 50), and answer { data: [{ id, code, title, level, price }] }. Validate: q of at least 2 characters (400 QUERY_TOO_SHORT); level one of beginner, intermediate, advanced and maxPrice a positive whole number (400 VALIDATION_FAILED).",
          db: SEARCH_SQL,
          files: {
            "package.json": PKG(["express", "pg"]),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            "db.js": DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();

app.get("/courses/search", async (req, res) => {
  const { rows } = await pool.query(\`SELECT id, code, title, level, price FROM courses WHERE title ILIKE '%\${req.query.q}%'\`);
  res.json({ data: rows });
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
const LEVELS = ["beginner", "intermediate", "advanced"];
const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });

app.get("/courses/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (q.length < 2) return fail(res, 400, "QUERY_TOO_SHORT", "Search for at least 2 characters");
  const level = req.query.level === undefined ? null : String(req.query.level);
  if (level !== null && !LEVELS.includes(level)) return fail(res, 400, "VALIDATION_FAILED", \`level must be one of \${LEVELS.join(", ")}\`);
  const maxPrice = req.query.maxPrice === undefined ? null : Number(req.query.maxPrice);
  if (maxPrice !== null && !(Number.isInteger(maxPrice) && maxPrice > 0)) return fail(res, 400, "VALIDATION_FAILED", "maxPrice must be a positive whole number");
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));

  const { rows } = await pool.query(
    \`SELECT id, code, title, level, price
       FROM courses, websearch_to_tsquery('english', $1) AS query
      WHERE search @@ query
        AND ($2::text IS NULL OR level = $2)
        AND ($3::int IS NULL OR price <= $3)
      ORDER BY ts_rank(search, query) DESC, id
      LIMIT $4\`,
    [q, level, maxPrice, limit]
  );
  res.json({ data: rows });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "Word forms match, and the best match comes first", check: `const r = await get("/courses/search?q=database%20designs"); eq(r.status, 200, "status"); eq(r.json?.data?.map((c) => c.code), ["DB-101", "DB-201"], "'database designs': DB-101 has both words in its title; DB-201 has database in its title and designing in its description"); eq(r.json.data[0], { id: 1, code: "DB-101", title: "Relational Database Design", level: "beginner", price: 80000 }, "the fields");` },
            { label: "Web-style queries: phrases and exclusions", check: `eq((await get("/courses/search?q=" + encodeURIComponent('"relational database"'))).json?.data?.map((c) => c.code), ["DB-101", "BE-101"], "the phrase \\"relational database\\": DB-101 has it in its title (weight A), BE-101 in its description"); eq((await get("/courses/search?q=" + encodeURIComponent("database -performance"))).json?.data?.map((c) => c.code), ["DB-101", "BE-101"], "database without performance"); eq((await get("/courses/search?q=kubernetes")).json?.data, [], "no match");` },
            { label: "Filters and limit", check: `eq((await get("/courses/search?q=data&level=beginner")).json?.data?.map((c) => c.code), ["DS-101", "DB-101"], "data, beginner only (DS-101 has data in its title)"); eq((await get("/courses/search?q=data&maxPrice=75000")).json?.data?.map((c) => c.code), ["DS-101"], "data, at most 75 000"); eq((await get("/courses/search?q=data&limit=1")).json?.data?.length, 1, "limit=1"); eq((await get("/courses/search?q=design&limit=500")).status, 200, "a huge limit is capped, not an error");` },
            { label: "Validation, and no injection", check: `eq((await get("/courses/search?q=a")).json?.error?.code, "QUERY_TOO_SHORT", "one character"); eq((await get("/courses/search")).status, 400, "no q"); eq((await get("/courses/search?q=data&level=expert")).json?.error?.code, "VALIDATION_FAILED", "an unknown level"); eq((await get("/courses/search?q=data&maxPrice=cheap")).status, 400, "a non-numeric maxPrice"); const evil = await get("/courses/search?q=" + encodeURIComponent("x'; DROP TABLE courses; --")); eq(evil.status, 200, "a hostile query is just a search"); eq((await sql("SELECT count(*)::int AS n FROM courses"))[0].n, 8, "the table is intact"); lacks(file("server.js"), "ILIKE", "use the full-text search, not ILIKE");` },
          ],
          hint: "FROM courses, websearch_to_tsquery('english', $1) AS query lets you use query twice: WHERE search @@ query … ORDER BY ts_rank(search, query) DESC, id. Optional filters: AND ($2::text IS NULL OR level = $2). Every value goes in as a parameter.",
          successMessage: "Search now understands word forms, phrases and exclusions, ranks by relevance with a GIN index behind it, and filters stay exact.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 130 · 18.8 – 18.10 · WEBSOCKETS, EVENTS, MESSAGE QUEUES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l130-realtime-events",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["18.8", "18.9", "18.10"],
    title: "WebSockets, Event-Driven Architecture and Message Queues",
    subtitle: "Telling clients and other parts of the system that something happened",
    estimatedMinutes: 110,
    intro: "Requests ask; events tell. This lesson pushes updates to browsers over WebSockets, decouples the parts of the backend with events, and compares the ways messages travel between processes.",
    atoms: [
      {
        id: "a-be-websockets",
        title: "Real-time communication with WebSockets",
        explain:
          "HTTP is request and response: the server cannot speak first. A WEBSOCKET is one long-lived, two-way connection that starts as an HTTP request with Upgrade: websocket; after it, either side sends messages (JSON by convention: { type, … }) at any time. AUTHENTICATE during the upgrade (a token in the URL or a cookie): refuse with 401 before the connection exists. Group connections into ROOMS (all students of course 1), check permission before joining one, and remove sockets when they close. With several instances, each only knows its own sockets, so broadcasts go through Redis pub/sub to every instance.",
        nodeLab: {
          task:
            "Add WebSockets to server.js on /ws with ws's WebSocketServer({ noServer: true }): on the HTTP server's upgrade event, authenticate ?token= with userForToken (no user: write \"HTTP/1.1 401 Unauthorized\\r\\n\\r\\n\" and destroy the socket). A client sends { type: \"subscribe\", courseId }: if the user is enrolled, add the socket to that course's room and reply { type: \"subscribed\", courseId }; otherwise { type: \"error\", code: \"NOT_ENROLLED\" }. POST /courses/:id/announcements (instructors) saves the text and sends { type: \"announcement\", courseId, text } to that room only; 201 { data: { id, delivered } } with the number of sockets reached.",
          db: `${RT_SQL}CREATE TABLE announcements (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, course_id integer NOT NULL, text text NOT NULL);\n`,
          files: {
            "package.json": PKG(["express", "pg", "ws"]),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            "db.js": DB_JS,
            "auth.js": AUTH_HELPER,
            "server.js": `import { createServer } from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { requireUser, userForToken } from "./auth.js";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.post("/courses/:id/announcements", requireUser, async (req, res) => {
  if (req.user.role !== "instructor") return res.status(403).json({ error: { code: "FORBIDDEN", message: "Instructors only" } });
  const { rows } = await pool.query("INSERT INTO announcements (course_id, text) VALUES ($1, $2) RETURNING id", [req.params.id, req.body.text]);
  res.status(201).json({ data: { id: rows[0].id, delivered: 0 } });
});

const server = createServer(app);
server.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "auth.js"],
          open: "server.js",
          solution: {
            "server.js": `import { createServer } from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { requireUser, userForToken } from "./auth.js";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

/** courseId → the sockets listening to it */
const rooms = new Map();

function broadcast(courseId, message) {
  const sockets = rooms.get(courseId) ?? new Set();
  for (const socket of sockets) socket.send(JSON.stringify(message));
  return sockets.size;
}

app.post("/courses/:id/announcements", requireUser, async (req, res) => {
  if (req.user.role !== "instructor") return res.status(403).json({ error: { code: "FORBIDDEN", message: "Instructors only" } });
  const courseId = Number(req.params.id);
  const { rows } = await pool.query("INSERT INTO announcements (course_id, text) VALUES ($1, $2) RETURNING id", [courseId, req.body.text]);
  const delivered = broadcast(courseId, { type: "announcement", courseId, text: req.body.text });
  res.status(201).json({ data: { id: rows[0].id, delivered } });
});

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Authenticate before the WebSocket exists.
server.on("upgrade", async (req, socket, head) => {
  const url = new URL(req.url, "http://localhost");
  const user = url.pathname === "/ws" ? await userForToken(url.searchParams.get("token")) : null;
  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\\r\\n\\r\\n");
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, user));
});

wss.on("connection", (ws, user) => {
  const joined = new Set();
  ws.on("message", async (raw) => {
    let message;
    try {
      message = JSON.parse(raw);
    } catch {
      return ws.send(JSON.stringify({ type: "error", code: "INVALID_MESSAGE" }));
    }
    if (message.type !== "subscribe") return ws.send(JSON.stringify({ type: "error", code: "UNKNOWN_TYPE" }));
    const courseId = Number(message.courseId);
    const { rowCount } = await pool.query("SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2", [user.id, courseId]);
    if (!rowCount) return ws.send(JSON.stringify({ type: "error", code: "NOT_ENROLLED", courseId }));
    if (!rooms.has(courseId)) rooms.set(courseId, new Set());
    rooms.get(courseId).add(ws);
    joined.add(courseId);
    ws.send(JSON.stringify({ type: "subscribed", courseId }));
  });
  ws.on("close", () => {
    for (const courseId of joined) rooms.get(courseId)?.delete(ws);
  });
});

server.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "Without a valid token the upgrade is refused", check: `const anon = ws("/ws"); eq(await anon.opened(), false, "no token: the connection must not open"); const bad = ws("/ws?token=forged"); eq(await bad.opened(), false, "a forged token");` },
            { label: "Subscribing checks enrollment", check: `const ada = ws("/ws?token=ada-token"); eq(await ada.opened(), true, "Ada connects"); await ada.send({ type: "subscribe", courseId: 1 }); await ada.waitFor(1); eq(ada.json()[0], { type: "subscribed", courseId: 1 }, "Ada is enrolled in course 1"); await ada.send({ type: "subscribe", courseId: 2 }); await ada.waitFor(2); eq([ada.json()[1].type, ada.json()[1].code], ["error", "NOT_ENROLLED"], "but not in course 2"); await ada.close();` },
            { label: "Announcements reach exactly the course's room", check: `const ada = ws("/ws?token=ada-token"), bayo = ws("/ws?token=bayo-token"), chi = ws("/ws?token=chi-token"); for (const c of [ada, bayo, chi]) await c.opened(); await ada.send({ type: "subscribe", courseId: 1 }); await bayo.send({ type: "subscribe", courseId: 1 }); await chi.send({ type: "subscribe", courseId: 2 }); for (const c of [ada, bayo, chi]) await c.waitFor(1); const r = await post("/courses/1/announcements", { text: "Live session at 18:00" }, { headers: { Authorization: "Bearer ngozi-token" } }); eq([r.status, r.json?.data?.delivered], [201, 2], "201, delivered to 2 sockets"); await ada.waitFor(2); await bayo.waitFor(2); eq(ada.json()[1], { type: "announcement", courseId: 1, text: "Live session at 18:00" }, "Ada's message"); eq(bayo.json()[1]?.text, "Live session at 18:00", "Bayo's"); await chi.waitFor(2, 200); eq(chi.messages.length, 1, "Chi (course 2) gets nothing"); for (const c of [ada, bayo, chi]) await c.close();` },
            { label: "Closed sockets leave their rooms; only instructors announce", check: `const r = await post("/courses/1/announcements", { text: "Anyone there?" }, { headers: { Authorization: "Bearer ngozi-token" } }); eq(r.json?.data?.delivered, 0, "after everyone closed, nobody is left in the room"); eq((await post("/courses/1/announcements", { text: "hi" }, { headers: { Authorization: "Bearer ada-token" } })).status, 403, "a student cannot announce");` },
          ],
          hint: "const wss = new WebSocketServer({ noServer: true }); server.on(\"upgrade\", async (req, socket, head) => { …userForToken(new URL(req.url, \"http://localhost\").searchParams.get(\"token\"))…; wss.handleUpgrade(req, socket, head, (ws) => wss.emit(\"connection\", ws, user)); }). Rooms: a Map from courseId to a Set of sockets; delete on close.",
          successMessage: "Students hear about announcements the moment they happen, only for courses they belong to, and nobody connects without a valid token.",
        },
      },
      {
        id: "a-be-event-driven",
        title: "Event-driven architecture fundamentals",
        explain:
          "In EVENT-DRIVEN code a module announces a fact (enrollment.created, with an id and when it happened) and does not know who reacts; other modules SUBSCRIBE (send the welcome email, open an invoice, update statistics). Adding a reaction no longer edits the enrolling code, and a slow or failing reaction no longer breaks the request. Rules: publish only after the transaction COMMITs (or a handler may act on data that was rolled back); give each event an id so handlers can ignore duplicates; isolate handlers from each other and log their failures. In one process an event bus is enough; across processes the same events travel through a queue or a broker.",
        nodeLab: {
          task:
            "Write createEventBus({ log }) in events.js: on(type, name, handler) subscribes (and returns a function that unsubscribes); publish(type, data) builds the event { id (UUID), type, occurredAt (ISO), data }, returns it at once, and runs each handler afterwards (setImmediate), separately, catching any error and logging \"event handler <name> failed for <type> <event id>: <message>\" with log (console.error by default). server.js publishes enrollment.created after COMMIT; three handlers are given, one of them broken.",
          db: `CREATE TABLE students (id integer PRIMARY KEY, email text NOT NULL, name text NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_code text NOT NULL);
CREATE TABLE invoices (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, enrollment_id integer NOT NULL UNIQUE, amount integer NOT NULL);
INSERT INTO students VALUES (1, 'ada@example.com', 'Ada Obi'), (2, 'bayo@example.com', 'Bayo Adeyemi');
`,
          mail: true,
          files: {
            "package.json": PKG(["express", "nodemailer", "pg"]),
            ".env": `DATABASE_URL=${DB_URL}\n${SMTP}`,
            "db.js": DB_JS,
            "mailer.js": MAILER_JS,
            "events.js": `export function createEventBus({ log = console.error } = {}) {
  return {
    on(type, name, handler) {},
    publish(type, data) {},
  };
}
`,
            "handlers.js": `import { pool } from "./db.js";
import { sendMail } from "./mailer.js";

export function registerHandlers(bus) {
  bus.on("enrollment.created", "welcome-email", async ({ data }) => {
    await sendMail({ to: data.email, subject: \`Welcome to \${data.courseCode}\`, text: \`Hi \${data.name}, you are enrolled in \${data.courseCode}.\` });
  });
  bus.on("enrollment.created", "analytics", async () => {
    throw new Error("analytics service is down");
  });
  bus.on("enrollment.created", "invoice", async ({ data }) => {
    await pool.query("INSERT INTO invoices (enrollment_id, amount) VALUES ($1, $2) ON CONFLICT DO NOTHING", [data.enrollmentId, 120000]);
  });
}
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { createEventBus } from "./events.js";
import { registerHandlers } from "./handlers.js";

const bus = createEventBus();
registerHandlers(bus);

const app = express();
app.use(express.json());

app.post("/enrollments", async (req, res) => {
  const { studentId, courseCode } = req.body ?? {};
  const client = await pool.connect();
  let enrollment;
  try {
    await client.query("BEGIN");
    const student = (await client.query("SELECT id, email, name FROM students WHERE id = $1", [studentId])).rows[0];
    if (!student) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: { code: "STUDENT_NOT_FOUND", message: "No such student" } });
    }
    enrollment = (await client.query("INSERT INTO enrollments (student_id, course_code) VALUES ($1, $2) RETURNING id", [studentId, courseCode])).rows[0];
    await client.query("COMMIT");
    // Only after COMMIT: the enrollment really exists now.
    const event = bus.publish("enrollment.created", { enrollmentId: enrollment.id, studentId, courseCode, email: student.email, name: student.name });
    res.status(201).json({ data: { id: enrollment.id, eventId: event.id } });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "mailer.js", "handlers.js", "server.js"],
          open: "events.js",
          solution: { "events.js": EVENTS_JS },
          tests: [
            { label: "Publishing returns the event at once", check: `const { createEventBus } = await load("events.js"); const bus = createEventBus({ log: () => {} }); let ran = false; bus.on("x.happened", "h", async () => { ran = true; }); const event = bus.publish("x.happened", { n: 1 }); assert(event && /^[0-9a-f-]{36}$/.test(event.id), "publish returns the event with a UUID id"); eq([event.type, event.data], ["x.happened", { n: 1 }], "type and data"); assert(!Number.isNaN(Date.parse(event.occurredAt)), "occurredAt (ISO time)"); eq(ran, false, "handlers run afterwards, not inside publish()"); await idle(); eq(ran, true, "…and they do run");` },
            { label: "Every handler gets the event; a failing one is isolated and logged", check: `const { createEventBus } = await load("events.js"); const logged = []; const bus = createEventBus({ log: (m) => logged.push(m) }); const got = []; bus.on("t", "first", async (e) => got.push(["first", e.data])); bus.on("t", "broken", async () => { throw new Error("boom"); }); bus.on("t", "third", async (e) => got.push(["third", e.data])); const e = bus.publish("t", 42); await idle(); eq(got, [["first", 42], ["third", 42]], "the other handlers still ran"); eq(logged, ["event handler broken failed for t " + e.id + ": boom"], "the failure is logged with the handler, type and event id");` },
            { label: "Unsubscribing, and events nobody listens to", check: `const { createEventBus } = await load("events.js"); const bus = createEventBus({ log: () => {} }); let n = 0; const off = bus.on("t", "h", async () => { n += 1; }); bus.publish("t"); await idle(); off(); bus.publish("t"); await idle(); eq(n, 1, "after unsubscribing, the handler is not called"); assert(bus.publish("nobody.listens", {}).id, "publishing without subscribers is fine");` },
            { label: "In the API: the request succeeds, the reactions follow", check: `const r = await post("/enrollments", { studentId: 1, courseCode: "BE-101" }); eq(r.status, 201, "the request succeeds even though the analytics handler fails"); await idle(); const mail = emails().at(-1); eq([mail?.to?.[0], mail?.subject], ["ada@example.com", "Welcome to BE-101"], "the welcome email"); eq((await sql("SELECT count(*)::int AS n FROM invoices WHERE enrollment_id = " + r.json.data.id))[0].n, 1, "the invoice"); has(stderr(), "event handler analytics failed for enrollment.created " + r.json.data.eventId + ": analytics service is down", "the analytics failure is logged");` },
          ],
          hint: "Keep a Map from type to a list of { name, fn }. publish builds the event with randomUUID() and new Date().toISOString(), then for each handler setImmediate(async () => { try { await fn(event) } catch (err) { log(`event handler ${name} failed for ${type} ${event.id}: ${err.message}`) } }), and returns the event.",
          successMessage: "Enrolling now announces a fact; email, invoicing and analytics react on their own, and the broken one is logged without hurting the rest.",
        },
      },
      {
        id: "a-be-message-queues",
        title: "Message queues and asynchronous processing",
        explain:
          "Ways to move messages between processes: a WORK QUEUE (a Redis list, BullMQ, Amazon SQS, RabbitMQ): each message is processed by ONE worker, retried on failure; PUB/SUB (Redis pub/sub): every subscriber that is connected right now gets it, nobody else, ever (fine for live notifications, wrong for anything that must not be lost); an EVENT LOG (Kafka, Redis Streams): messages are kept, and each consumer group reads at its own pace and can replay. Most brokers deliver AT LEAST ONCE: a worker can crash after doing the work but before acknowledging it, so the message comes again. Consumers must therefore be IDEMPOTENT (use the message id or a unique constraint) and failures must end in a dead-letter queue, not in silence.",
        decision: decide({
          scenario: "When a student completes a course, three things must happen: a PDF certificate is generated (slow), the finance system books revenue (it must never miss one), and any browser tab the student has open shows a toast.",
          question: "Which delivery mechanism fits each?",
          right: ["Certificate: a work queue; finance: a durable queue or event log with an idempotent consumer; toast: pub/sub to the WebSocket instances", "Match durability to what losing a message costs."],
          wrong: [
            ["All three through Redis pub/sub", "Finance would miss every event published while it was down."],
            ["All three inside the HTTP request", "Slow, and one failure fails the request."],
            ["All three through the same work queue, processed by one worker", "Only one consumer would get each message; the toast needs every instance."],
          ],
          at: 0,
          aftermath: "The exercises build the queue-based certificate and email workflows and the live notifications.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 131 · 18.11 – 18.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l131-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["18.11", "18.12", "18.13", "18.14"],
    title: "Exercises: Asynchronous Workflows in the Academy",
    subtitle: "Emails, certificates, a cache and live grades",
    estimatedMinutes: 200,
    intro: "Four exercises that move the academy's slow and real-time work to the right places: a worker for emails and certificates, Redis for an expensive endpoint, and WebSockets for grades.",
    atoms: [
      {
        id: "a-be-ex-async-email",
        title: "Exercise: send course enrollment emails asynchronously",
        explain:
          "Sending email inside the request makes enrollment as slow and as fragile as the SMTP server: when it is down, enrolling fails. Queue the email instead: the request saves the enrollment and queues a job with only the ENROLLMENT ID (the worker loads fresh data when it runs, and personal data does not sit in Redis); the worker sends it, retries if SMTP is down, and dead-letters it after three attempts, while the enrollment itself already succeeded.",
        nodeLab: {
          task:
            "POST /enrollments sends the confirmation email inside the request. Change it to enqueue(\"enrollment-email\", { enrollmentId }) after the INSERT (queue.js is given), and write worker.js: drain the queue with a handler that loads the enrollment, student and course from PostgreSQL and sends the email (same subject and text as now), then quit Redis and end the pool. A failed INSERT must not queue anything.",
          db: `CREATE TABLE students (id integer PRIMARY KEY, email text NOT NULL, name text NOT NULL);
CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, title text NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), UNIQUE (student_id, course_id));
INSERT INTO students VALUES (1, 'ada@example.com', 'Ada Obi'), (2, 'bayo@example.com', 'Bayo Adeyemi');
INSERT INTO courses VALUES (1, 'BE-101', 'Backend Engineering'), (2, 'DB-101', 'Relational Databases');
`,
          redis: true,
          mail: true,
          files: {
            "package.json": PKG(["express", "nodemailer", "pg", "redis"]),
            ".env": ENV(SMTP),
            "db.js": DB_JS,
            "redis.js": REDIS_JS,
            "mailer.js": MAILER_JS,
            "queue.js": QUEUE_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";

const app = express();
app.use(express.json());

app.post("/enrollments", async (req, res) => {
  const { studentId, courseId } = req.body ?? {};
  let enrollment;
  try {
    enrollment = (await pool.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id", [studentId, courseId])).rows[0];
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: { code: "ALREADY_ENROLLED", message: "Already enrolled" } });
    if (err.code === "23503") return res.status(404).json({ error: { code: "NOT_FOUND", message: "No such student or course" } });
    throw err;
  }
  const { rows } = await pool.query(
    "SELECT s.email, s.name, c.code, c.title FROM enrollments e JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id WHERE e.id = $1",
    [enrollment.id]
  );
  const info = rows[0];
  await sendMail({ to: info.email, subject: \`You're enrolled in \${info.code}\`, text: \`Hi \${info.name}, you are enrolled in \${info.title}.\` });
  res.status(201).json({ data: { id: enrollment.id } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": "// Drain the queue: send each enrollment-email job's email.\n",
          },
          readOnly: ["package.json", ".env", "db.js", "redis.js", "mailer.js", "queue.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { enqueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post("/enrollments", async (req, res) => {
  const { studentId, courseId } = req.body ?? {};
  let enrollment;
  try {
    enrollment = (await pool.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id", [studentId, courseId])).rows[0];
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: { code: "ALREADY_ENROLLED", message: "Already enrolled" } });
    if (err.code === "23503") return res.status(404).json({ error: { code: "NOT_FOUND", message: "No such student or course" } });
    throw err;
  }
  // Only the id: the worker loads fresh data, and no personal data waits in Redis.
  await enqueue("enrollment-email", { enrollmentId: enrollment.id });
  res.status(201).json({ data: { id: enrollment.id } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": `import { pool } from "./db.js";
import { sendMail } from "./mailer.js";
import { drain } from "./queue.js";
import { redis } from "./redis.js";

const handlers = {
  async "enrollment-email"({ enrollmentId }) {
    const { rows } = await pool.query(
      "SELECT s.email, s.name, c.code, c.title FROM enrollments e JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id WHERE e.id = $1",
      [enrollmentId]
    );
    const info = rows[0];
    if (!info) return { skipped: "enrollment no longer exists" };
    await sendMail({ to: info.email, subject: \`You're enrolled in \${info.code}\`, text: \`Hi \${info.name}, you are enrolled in \${info.title}.\` });
    return { sentTo: info.email };
  },
};

const ran = await drain(handlers);
console.log(\`worker: \${ran} job(s) run\`);
await redis.quit();
await pool.end();
`,
          },
          tests: [
            { label: "Enrolling queues the email instead of sending it", check: `${RQ} const before = emails().length; const r = await post("/enrollments", { studentId: 1, courseId: 1 }); eq(r.status, 201, "status"); eq(emails().length, before, "no email inside the request"); const jobs = (await (await R()).lRange("jobs:queue", 0, -1)).map((j) => JSON.parse(j)); eq(jobs.map((j) => [j.type, j.payload]), [["enrollment-email", { enrollmentId: r.json.data.id }]], "one enrollment-email job carrying only the enrollment id");` },
            { label: "The worker sends it, once", check: `await run("${WORKER}"); const sent = emails().filter((m) => m.to.includes("ada@example.com")); eq(sent.map((m) => [m.subject, m.text]), [["You're enrolled in BE-101", "Hi Ada Obi, you are enrolled in Backend Engineering."]], "Ada's email"); eq(exitCode(), 0, "the worker exits cleanly (quit Redis, end the pool)"); await run("${WORKER}"); eq(emails().filter((m) => m.to.includes("ada@example.com")).length, 1, "running the worker again sends nothing more");` },
            { label: "Refused enrollments queue nothing", check: `${RQ} await run("npm start"); eq((await post("/enrollments", { studentId: 1, courseId: 1 })).status, 409, "a duplicate"); eq((await post("/enrollments", { studentId: 9, courseId: 1 })).status, 404, "a missing student"); eq(await (await R()).lLen("jobs:queue"), 0, "nothing queued");` },
            { label: "SMTP down: enrolling still works; the job dead-letters", check: `${RQ} eq((await post("/enrollments", { studentId: 2, courseId: 2 })).status, 201, "enrolling does not depend on SMTP any more"); await run("SMTP_PORT=2525 ${WORKER}"); await run("npm start"); eq(emails().filter((m) => m.to.includes("bayo@example.com")).length, 0, "nothing could be sent"); const dead = (await (await R()).lRange("jobs:dead", 0, -1)).map((j) => JSON.parse(j)); eq(dead.map((j) => [j.type, j.attempts]), [["enrollment-email", 3]], "after three attempts the job is in jobs:dead, for someone to replay");` },
          ],
          hint: "In the route, replace the SELECT and sendMail with await enqueue(\"enrollment-email\", { enrollmentId: enrollment.id }). worker.js: a handlers object with that key (the SELECT and sendMail moved there), await drain(handlers), then await redis.quit() and await pool.end().",
          successMessage: "Enrolling is now as fast and as reliable as one INSERT; the email follows within seconds, and an SMTP outage costs a retry, not a lost enrollment.",
        },
      },
      {
        id: "a-be-ex-certificate-job",
        title: "Exercise: generate certificates through a background job",
        explain:
          "Generating a certificate (rendering, signing, storing) is slow, so the API answers 202 Accepted with the job's URL and the client polls it. The job must be IDEMPOTENT: a double-click or a retried job must not produce two certificates, so the worker inserts with ON CONFLICT and returns the existing certificate. User data inside the generated document is escaped like any other output.",
        nodeLab: {
          task:
            "POST /certificates { enrollmentId }: 404 ENROLLMENT_NOT_FOUND, 409 NOT_COMPLETED below 100% progress, else enqueue(\"certificate\", { enrollmentId }) and answer 202 { data: { jobId } } with Location /jobs/<id>. GET /jobs/:id shows the job. In worker.js, the handler builds the SVG with renderCertificate (given) and inserts it into certificates (code <course code>-<enrollment id as 5 digits>, enrollment_id unique); for an enrollment that already has one, it keeps the existing one. It returns { code, url: \"/certificates/<code>.svg\" }. GET /certificates/:code.svg serves it as image/svg+xml.",
          db: `CREATE TABLE students (id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, title text NOT NULL);
CREATE TABLE enrollments (id integer PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), progress integer NOT NULL);
CREATE TABLE certificates (code text PRIMARY KEY, enrollment_id integer NOT NULL UNIQUE REFERENCES enrollments (id), svg text NOT NULL, issued_at timestamptz NOT NULL DEFAULT now());
INSERT INTO students VALUES (1, 'Ada Obi'), (2, 'Bayo <Adeyemi>');
INSERT INTO courses VALUES (1, 'BE-101', 'Backend Engineering');
INSERT INTO enrollments VALUES (11, 1, 1, 100), (12, 2, 1, 100), (13, 1, 1, 60);
`,
          redis: true,
          files: {
            "package.json": PKG(["express", "pg", "redis"]),
            ".env": ENV(),
            "db.js": DB_JS,
            "redis.js": REDIS_JS,
            "queue.js": QUEUE_JS,
            "html.js": ESCAPE_JS,
            "certificate.js": `import { escapeHtml } from "./html.js";

/** The certificate as an SVG image. Every value is escaped: it is user data. */
export const renderCertificate = ({ code, name, title, date }) => \`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
  <rect width="800" height="560" fill="#fffdf7" stroke="#1d3557" stroke-width="12"/>
  <text x="400" y="150" text-anchor="middle" font-size="40" font-family="Georgia">Certificate of Completion</text>
  <text x="400" y="260" text-anchor="middle" font-size="34" font-family="Georgia">\${escapeHtml(name)}</text>
  <text x="400" y="330" text-anchor="middle" font-size="22" font-family="Georgia">completed \${escapeHtml(title)}</text>
  <text x="400" y="480" text-anchor="middle" font-size="14" font-family="monospace">\${escapeHtml(code)} · \${escapeHtml(date)}</text>
</svg>
\`;
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { enqueue, jobStatus } from "./queue.js";

const app = express();
app.use(express.json());

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": "// Drain the queue: generate each certificate job's certificate.\n",
          },
          readOnly: ["package.json", ".env", "db.js", "redis.js", "queue.js", "html.js", "certificate.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { enqueue, jobStatus } from "./queue.js";

const app = express();
app.use(express.json());
const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });

app.post("/certificates", async (req, res) => {
  const enrollmentId = Number(req.body?.enrollmentId);
  const { rows } = await pool.query("SELECT id, progress FROM enrollments WHERE id = $1", [enrollmentId]);
  if (!rows[0]) return fail(res, 404, "ENROLLMENT_NOT_FOUND", "No such enrollment");
  if (rows[0].progress < 100) return fail(res, 409, "NOT_COMPLETED", "The course is not completed yet");
  const jobId = await enqueue("certificate", { enrollmentId });
  res.status(202).location(\`/jobs/\${jobId}\`).json({ data: { jobId } });
});

app.get("/jobs/:id", async (req, res) => {
  const job = await jobStatus(req.params.id);
  if (!job) return fail(res, 404, "JOB_NOT_FOUND", "No such job");
  res.json({ data: job });
});

app.get("/certificates/:code.svg", async (req, res) => {
  const { rows } = await pool.query("SELECT svg FROM certificates WHERE code = $1", [req.params.code]);
  if (!rows[0]) return fail(res, 404, "CERTIFICATE_NOT_FOUND", "No such certificate");
  res.type("image/svg+xml").send(rows[0].svg);
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": `import { renderCertificate } from "./certificate.js";
import { pool } from "./db.js";
import { drain } from "./queue.js";
import { redis } from "./redis.js";

const handlers = {
  async certificate({ enrollmentId }) {
    const { rows } = await pool.query(
      "SELECT e.id, s.name, c.code AS course, c.title FROM enrollments e JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id WHERE e.id = $1",
      [enrollmentId]
    );
    const e = rows[0];
    if (!e) throw new Error(\`Enrollment \${enrollmentId} not found\`);
    const code = \`\${e.course}-\${String(e.id).padStart(5, "0")}\`;
    const svg = renderCertificate({ code, name: e.name, title: e.title, date: new Date().toISOString().slice(0, 10) });
    // Idempotent: a second job for the same enrollment keeps the first certificate.
    await pool.query("INSERT INTO certificates (code, enrollment_id, svg) VALUES ($1, $2, $3) ON CONFLICT (enrollment_id) DO NOTHING", [code, e.id, svg]);
    const saved = (await pool.query("SELECT code FROM certificates WHERE enrollment_id = $1", [e.id])).rows[0];
    return { code: saved.code, url: \`/certificates/\${saved.code}.svg\` };
  },
};

const ran = await drain(handlers);
console.log(\`worker: \${ran} job(s) run\`);
await redis.quit();
await pool.end();
`,
          },
          tests: [
            { label: "POST /certificates: 202 and a job to poll", check: `const r = await post("/certificates", { enrollmentId: 11 }); eq(r.status, 202, "status"); const id = r.json?.data?.jobId; eq(r.headers.location, "/jobs/" + id, "Location"); eq((await get("/jobs/" + id)).json?.data?.status, "queued", "queued until the worker runs"); eq((await sql("SELECT count(*)::int AS n FROM certificates"))[0].n, 0, "nothing generated inside the request");` },
            { label: "Refusals happen in the request", check: `const nf = await post("/certificates", { enrollmentId: 99 }); eq([nf.status, nf.json?.error?.code], [404, "ENROLLMENT_NOT_FOUND"], "a missing enrollment"); const nc = await post("/certificates", { enrollmentId: 13 }); eq([nc.status, nc.json?.error?.code], [409, "NOT_COMPLETED"], "60% progress");` },
            { label: "The worker generates it; the job points at it", check: `const id = (await post("/certificates", { enrollmentId: 12 })).json.data.jobId; await run("${WORKER}"); await run("npm start"); const job = (await get("/jobs/" + id)).json?.data; eq([job?.status, job?.result], ["done", { code: "BE-101-00012", url: "/certificates/BE-101-00012.svg" }], "the job's result"); const svg = await get("/certificates/BE-101-00012.svg"); eq(svg.status, 200, "GET the SVG"); has(svg.headers["content-type"], "image/svg+xml", "Content-Type"); has(svg.text, "Bayo &lt;Adeyemi&gt;", "the name, escaped"); lacks(svg.text, "<Adeyemi>", "never raw user data inside the SVG");` },
            { label: "Twice for the same enrollment: one certificate", check: `const a = (await post("/certificates", { enrollmentId: 11 })).json.data.jobId; const b = (await post("/certificates", { enrollmentId: 11 })).json.data.jobId; await run("${WORKER}"); await run("npm start"); const ra = (await get("/jobs/" + a)).json?.data?.result; const rb = (await get("/jobs/" + b)).json?.data?.result; eq(ra?.code, "BE-101-00011", "the first job"); eq(rb, ra, "the second job returns the same certificate"); eq((await sql("SELECT count(*)::int AS n FROM certificates WHERE enrollment_id = 11"))[0].n, 1, "one row for enrollment 11"); eq((await get("/certificates/NOPE-1.svg")).status, 404, "an unknown code");` },
          ],
          hint: "The route validates, then enqueue(\"certificate\", { enrollmentId }) and res.status(202).location(`/jobs/${jobId}`). The worker's handler: SELECT the name, course code and title; build the code; INSERT … ON CONFLICT (enrollment_id) DO NOTHING; SELECT the saved code; return { code, url }.",
          successMessage: "Certificates are generated off the request path, idempotently, and the client follows the job to the finished file.",
        },
      },
      {
        id: "a-be-ex-cache-endpoint",
        title: "Exercise: cache a frequently requested endpoint",
        explain:
          "Course pages show live statistics computed from thousands of enrollment rows on every view. Most views see the same numbers, so cache them per course; but a new enrollment or a progress change must show up immediately for THAT course (and only that course), so the writes that change the numbers delete that course's key. Measure first: the X-Response-Time header shows what the cache saves.",
        nodeLab: {
          task:
            "Cache GET /courses/:id/stats in Redis under course-stats:<id> for 300 seconds (X-Cache: HIT or MISS). Invalidate exactly that key when POST /courses/:id/enrollments adds an enrollment or PATCH /enrollments/:id changes progress (for the enrollment's course). An unknown course is a 404, not cached.",
          db: `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, course_id integer NOT NULL REFERENCES courses (id), progress integer NOT NULL DEFAULT 0);
INSERT INTO courses VALUES (1, 'BE-101'), (2, 'DB-101');
INSERT INTO enrollments (course_id, progress) SELECT 1 + (n % 2), (n * 37) % 101 FROM generate_series(1, 4000) AS n;
`,
          redis: true,
          files: {
            "package.json": PKG(["express", "pg", "redis"]),
            ".env": ENV(),
            "db.js": DB_JS,
            "redis.js": REDIS_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { redis } from "./redis.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const start = performance.now();
  const end = res.end;
  res.end = function (...args) {
    res.set("X-Response-Time", \`\${(performance.now() - start).toFixed(1)}ms\`);
    return end.apply(this, args);
  };
  next();
});

async function stats(courseId) {
  const { rows } = await pool.query(
    \`SELECT c.code, count(e.id)::int AS students,
            count(e.id) FILTER (WHERE e.progress = 100)::int AS completed,
            COALESCE(round(avg(e.progress)), 0)::int AS "averageProgress"
       FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE c.id = $1 GROUP BY c.code\`,
    [courseId]
  );
  return rows[0] ?? null;
}

app.get("/courses/:id/stats", async (req, res) => {
  const data = await stats(req.params.id);
  if (!data) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.json({ data });
});

app.post("/courses/:id/enrollments", async (req, res) => {
  const { rows } = await pool.query("INSERT INTO enrollments (course_id) VALUES ($1) RETURNING id, course_id AS \\"courseId\\", progress", [req.params.id]);
  res.status(201).json({ data: rows[0] });
});

app.patch("/enrollments/:id", async (req, res) => {
  const { rows } = await pool.query("UPDATE enrollments SET progress = $2 WHERE id = $1 RETURNING id, course_id AS \\"courseId\\", progress", [req.params.id, req.body.progress]);
  if (!rows[0]) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  res.json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "redis.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { redis } from "./redis.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const start = performance.now();
  const end = res.end;
  res.end = function (...args) {
    res.set("X-Response-Time", \`\${(performance.now() - start).toFixed(1)}ms\`);
    return end.apply(this, args);
  };
  next();
});

const statsKey = (courseId) => \`course-stats:\${courseId}\`;

async function stats(courseId) {
  const { rows } = await pool.query(
    \`SELECT c.code, count(e.id)::int AS students,
            count(e.id) FILTER (WHERE e.progress = 100)::int AS completed,
            COALESCE(round(avg(e.progress)), 0)::int AS "averageProgress"
       FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id
      WHERE c.id = $1 GROUP BY c.code\`,
    [courseId]
  );
  return rows[0] ?? null;
}

app.get("/courses/:id/stats", async (req, res) => {
  const key = statsKey(Number(req.params.id));
  const hit = await redis.get(key);
  if (hit) return res.set("X-Cache", "HIT").json({ data: JSON.parse(hit) });
  const data = await stats(req.params.id);
  if (!data) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  await redis.set(key, JSON.stringify(data), { EX: 300 });
  res.set("X-Cache", "MISS").json({ data });
});

app.post("/courses/:id/enrollments", async (req, res) => {
  const { rows } = await pool.query("INSERT INTO enrollments (course_id) VALUES ($1) RETURNING id, course_id AS \\"courseId\\", progress", [req.params.id]);
  await redis.del(statsKey(rows[0].courseId));
  res.status(201).json({ data: rows[0] });
});

app.patch("/enrollments/:id", async (req, res) => {
  const { rows } = await pool.query("UPDATE enrollments SET progress = $2 WHERE id = $1 RETURNING id, course_id AS \\"courseId\\", progress", [req.params.id, req.body.progress]);
  if (!rows[0]) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  await redis.del(statsKey(rows[0].courseId));
  res.json({ data: rows[0] });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "MISS, then HIT, for 300 seconds", check: `${RQ} const a = await get("/courses/1/stats"); const b = await get("/courses/1/stats"); eq([a.headers["x-cache"], b.headers["x-cache"]], ["MISS", "HIT"], "X-Cache"); eq(b.json, a.json, "the same numbers"); eq(a.json?.data?.students, 2000, "course 1 has 2000 students"); const ttl = await (await R()).ttl("course-stats:1"); assert(ttl > 0 && ttl <= 300, "TTL (" + ttl + ")");` },
            { label: "A new enrollment shows up at once, for that course only", check: `await get("/courses/2/stats"); const r = await post("/courses/1/enrollments", {}); eq(r.status, 201, "enroll"); const s1 = await get("/courses/1/stats"); eq([s1.headers["x-cache"], s1.json?.data?.students], ["MISS", 2001], "course 1 is fresh"); eq((await get("/courses/2/stats")).headers["x-cache"], "HIT", "course 2's cache was not touched");` },
            { label: "A progress change too", check: `const s = (await get("/courses/1/stats")).json.data; const id = (await post("/courses/1/enrollments", {})).json.data.id; await get("/courses/1/stats"); eq((await patch("/enrollments/" + id, { progress: 100 })).status, 200, "PATCH"); const after = await get("/courses/1/stats"); eq([after.headers["x-cache"], after.json.data.completed], ["MISS", s.completed + 1], "one more completed");` },
            { label: "404s are not cached", check: `${RQ} eq((await get("/courses/9/stats")).status, 404, "an unknown course"); eq(await (await R()).get("course-stats:9"), null, "no key for it");` },
          ],
          hint: "Same cache-aside shape as before, with the key course-stats:<id>. Both writes return the enrollment's courseId: use it to redis.del(\"course-stats:\" + courseId) after the query succeeds.",
          successMessage: "The expensive aggregate now runs once per change instead of once per view, and nobody ever sees numbers older than the last write.",
        },
      },
      {
        id: "a-be-ex-realtime-grades",
        title: "Exercise: send real-time notifications when an assessment is graded",
        explain:
          "When an instructor grades an assessment, the student should see it at once if they are online, and find it later if they are not. The grading route publishes assessment.graded; one handler stores a notification (the durable record), another pushes it to that student's open sockets (every tab), never to anyone else. The REST endpoint GET /me/notifications serves the same notifications to clients that were offline.",
        nodeLab: {
          task:
            "POST /assessments/:id/grades { studentId, score } (instructors; 201) saves the grade and publishes assessment.graded with the event bus (events.js, given). Register two handlers: one inserts into notifications (user_id, type \"assessment.graded\", payload { assessmentId, title, score }); the other sends { type: \"assessment.graded\", assessmentId, title, score } to every WebSocket of that student. WebSockets: /ws?token=… (refuse unknown tokens with 401), keep each user's sockets in a Map and remove them on close. GET /me/notifications returns the user's notifications, newest first: [{ id, type, payload, createdAt }].",
          db: `${RT_SQL}CREATE TABLE assessments (id integer PRIMARY KEY, course_id integer NOT NULL, title text NOT NULL);
CREATE TABLE grades (assessment_id integer NOT NULL REFERENCES assessments (id), student_id integer NOT NULL REFERENCES users (id), score integer NOT NULL, PRIMARY KEY (assessment_id, student_id));
CREATE TABLE notifications (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id integer NOT NULL REFERENCES users (id), type text NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO assessments VALUES (5, 1, 'Week 7 quiz'), (6, 1, 'Week 8 project');
`,
          files: {
            "package.json": PKG(["express", "pg", "ws"]),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            "db.js": DB_JS,
            "auth.js": AUTH_HELPER,
            "events.js": EVENTS_JS,
            "server.js": `import { createServer } from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { requireUser, userForToken } from "./auth.js";
import { pool } from "./db.js";
import { createEventBus } from "./events.js";

const bus = createEventBus();
const app = express();
app.use(express.json());

const server = createServer(app);
server.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "auth.js", "events.js"],
          open: "server.js",
          solution: {
            "server.js": `import { createServer } from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { requireUser, userForToken } from "./auth.js";
import { pool } from "./db.js";
import { createEventBus } from "./events.js";

const bus = createEventBus();
const app = express();
app.use(express.json());

/** userId → that user's open sockets (one per tab) */
const sockets = new Map();

bus.on("assessment.graded", "store-notification", async ({ data }) => {
  await pool.query("INSERT INTO notifications (user_id, type, payload) VALUES ($1, 'assessment.graded', $2)", [
    data.studentId,
    { assessmentId: data.assessmentId, title: data.title, score: data.score },
  ]);
});

bus.on("assessment.graded", "push-notification", async ({ data }) => {
  const message = JSON.stringify({ type: "assessment.graded", assessmentId: data.assessmentId, title: data.title, score: data.score });
  for (const ws of sockets.get(data.studentId) ?? []) ws.send(message);
});

app.post("/assessments/:id/grades", requireUser, async (req, res) => {
  if (req.user.role !== "instructor") return res.status(403).json({ error: { code: "FORBIDDEN", message: "Instructors only" } });
  const assessment = (await pool.query("SELECT id, title FROM assessments WHERE id = $1", [req.params.id])).rows[0];
  if (!assessment) return res.status(404).json({ error: { code: "ASSESSMENT_NOT_FOUND", message: "No such assessment" } });
  const { studentId, score } = req.body ?? {};
  await pool.query(
    "INSERT INTO grades (assessment_id, student_id, score) VALUES ($1, $2, $3) ON CONFLICT (assessment_id, student_id) DO UPDATE SET score = $3",
    [assessment.id, studentId, score]
  );
  bus.publish("assessment.graded", { assessmentId: assessment.id, title: assessment.title, studentId, score });
  res.status(201).json({ data: { assessmentId: assessment.id, studentId, score } });
});

app.get("/me/notifications", requireUser, async (req, res) => {
  const { rows } = await pool.query('SELECT id, type, payload, created_at AS "createdAt" FROM notifications WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
  res.json({ data: rows });
});

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", async (req, socket, head) => {
  const url = new URL(req.url, "http://localhost");
  const user = url.pathname === "/ws" ? await userForToken(url.searchParams.get("token")) : null;
  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\\r\\n\\r\\n");
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    if (!sockets.has(user.id)) sockets.set(user.id, new Set());
    sockets.get(user.id).add(ws);
    ws.on("close", () => sockets.get(user.id)?.delete(ws));
  });
});

server.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "The graded student hears it in every tab; nobody else does", check: `const tab1 = ws("/ws?token=ada-token"), tab2 = ws("/ws?token=ada-token"), bayo = ws("/ws?token=bayo-token"); for (const c of [tab1, tab2, bayo]) eq(await c.opened(), true, "connected"); const r = await post("/assessments/5/grades", { studentId: 1, score: 87 }, { headers: { Authorization: "Bearer ngozi-token" } }); eq(r.status, 201, "grading"); await tab1.waitFor(1); await tab2.waitFor(1); const want = { type: "assessment.graded", assessmentId: 5, title: "Week 7 quiz", score: 87 }; eq(tab1.json(), [want], "Ada's first tab"); eq(tab2.json(), [want], "Ada's second tab"); await bayo.waitFor(1, 200); eq(bayo.messages, [], "Bayo gets nothing"); for (const c of [tab1, tab2, bayo]) await c.close();` },
            { label: "Offline students find it later", check: `await post("/assessments/6/grades", { studentId: 2, score: 64 }, { headers: { Authorization: "Bearer ngozi-token" } }); await idle(); const r = await get("/me/notifications", { headers: { Authorization: "Bearer bayo-token" } }); eq(r.status, 200, "status"); eq(r.json?.data?.map((n) => [n.type, n.payload]), [["assessment.graded", { assessmentId: 6, title: "Week 8 project", score: 64 }]], "Bayo's notification"); const ada = (await get("/me/notifications", { headers: { Authorization: "Bearer ada-token" } })).json?.data; eq(ada?.map((n) => n.payload.assessmentId), [5], "Ada's (stored while she was online too)"); assert(!Number.isNaN(Date.parse(ada?.[0]?.createdAt)), "createdAt");` },
            { label: "Newest first; closed tabs are forgotten", check: `await post("/assessments/6/grades", { studentId: 1, score: 91 }, { headers: { Authorization: "Bearer ngozi-token" } }); await idle(); eq((await get("/me/notifications", { headers: { Authorization: "Bearer ada-token" } })).json?.data?.map((n) => n.payload.assessmentId), [6, 5], "newest first"); assert(!/failed/.test(stderr()), "no handler failed (sending to closed sockets must not happen): " + stderr().split("\\n").find((l) => /failed/.test(l)));` },
            { label: "Only instructors grade; only valid tokens connect", check: `eq((await post("/assessments/5/grades", { studentId: 1, score: 100 }, { headers: { Authorization: "Bearer ada-token" } })).status, 403, "a student grading herself"); eq((await post("/assessments/99/grades", { studentId: 1, score: 1 }, { headers: { Authorization: "Bearer ngozi-token" } })).status, 404, "an unknown assessment"); eq(await ws("/ws?token=nope").opened(), false, "a forged token");` },
          ],
          hint: "Two bus.on(\"assessment.graded\", …) handlers: an INSERT INTO notifications, and a loop over sockets.get(studentId). In the upgrade handler, add the socket to the user's Set and delete it on close. The route publishes after saving the grade.",
          successMessage: "Grades now arrive in every open tab the moment they are given, and wait in the notification list for anyone who was offline.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 132 · 18.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l132-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["18.P"],
    title: "Deliverable: A Service with a Worker, a Cache and an Asynchronous Workflow",
    subtitle: "Course completion, done properly",
    estimatedMinutes: 150,
    intro: "The deliverable rebuilds course completion: today one slow request generates the certificate, sends the email and recomputes the catalogue. Split it into a fast API, a worker and a cache that never goes stale.",
    atoms: [
      {
        id: "a-be-async-service",
        title: "A service with a background worker, caching and an asynchronous workflow",
        explain:
          "The finished shape: the API validates, writes, queues and answers in milliseconds; the worker does the slow parts (rendering, email) with retries and idempotency; Redis caches what is read often and is invalidated by the writes that change it; and the user is told about the result through a notification they can fetch when they come back.",
        nodeLab: {
          task:
            "Rework the service. PATCH /enrollments/:id { progress }: save it; when it reaches 100 and the enrollment has no certificate job yet (enrollments.certificate_job is null), enqueue(\"complete-course\", { enrollmentId }), store the job id in certificate_job, and answer 200 at once with { data: { id, progress, jobId } }. worker.js: the handler generates the certificate (renderCertificate; code <course code>-<enrollment id as 5 digits>; idempotent), emails the student (subject \"Your <course code> certificate\") and inserts a notification of type course.completed with payload { code }. Cache GET /courses (courses:all, 300 s, X-Cache) and invalidate it in PATCH /courses/:id. GET /me/notifications as in 18.14 (X-User-Id identifies the user here).",
          db: `CREATE TABLE students (id integer PRIMARY KEY, email text NOT NULL, name text NOT NULL);
CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, title text NOT NULL, price integer NOT NULL);
CREATE TABLE enrollments (id integer PRIMARY KEY, student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), progress integer NOT NULL DEFAULT 0, certificate_job text);
CREATE TABLE certificates (code text PRIMARY KEY, enrollment_id integer NOT NULL UNIQUE REFERENCES enrollments (id), svg text NOT NULL);
CREATE TABLE notifications (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id integer NOT NULL REFERENCES students (id), type text NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO students VALUES (1, 'ada@example.com', 'Ada Obi'), (2, 'bayo@example.com', 'Bayo Adeyemi');
INSERT INTO courses VALUES (1, 'BE-101', 'Backend Engineering', 120000), (2, 'DB-101', 'Relational Databases', 80000);
INSERT INTO enrollments (id, student_id, course_id, progress) VALUES (21, 1, 1, 90), (22, 2, 1, 50), (23, 2, 2, 95);
`,
          redis: true,
          mail: true,
          files: {
            "package.json": PKG(["express", "nodemailer", "pg", "redis"]),
            ".env": ENV(SMTP),
            "db.js": DB_JS,
            "redis.js": REDIS_JS,
            "mailer.js": MAILER_JS,
            "queue.js": QUEUE_JS,
            "html.js": ESCAPE_JS,
            "certificate.js": `import { escapeHtml } from "./html.js";

export const renderCertificate = ({ code, name, title }) =>
  \`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560"><text x="400" y="200" text-anchor="middle">\${escapeHtml(name)}</text><text x="400" y="280" text-anchor="middle">completed \${escapeHtml(title)}</text><text x="400" y="480" text-anchor="middle">\${escapeHtml(code)}</text></svg>\`;
`,
            "server.js": `import express from "express";
import { renderCertificate } from "./certificate.js";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";

const app = express();
app.use(express.json());

app.get("/courses", async (req, res) => {
  res.json({ data: (await pool.query("SELECT id, code, title, price FROM courses ORDER BY id")).rows });
});

app.patch("/courses/:id", async (req, res) => {
  const { rows } = await pool.query("UPDATE courses SET price = $2 WHERE id = $1 RETURNING id, code, title, price", [req.params.id, req.body.price]);
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.json({ data: rows[0] });
});

// Everything inside the request: slow, and an SMTP outage fails the progress update.
app.patch("/enrollments/:id", async (req, res) => {
  const { rows } = await pool.query("UPDATE enrollments SET progress = $2 WHERE id = $1 RETURNING id, student_id, course_id, progress", [req.params.id, req.body.progress]);
  const e = rows[0];
  if (!e) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  if (e.progress === 100) {
    const info = (await pool.query("SELECT s.email, s.name, c.code, c.title FROM students s, courses c WHERE s.id = $1 AND c.id = $2", [e.student_id, e.course_id])).rows[0];
    const code = \`\${info.code}-\${String(e.id).padStart(5, "0")}\`;
    await pool.query("INSERT INTO certificates (code, enrollment_id, svg) VALUES ($1, $2, $3)", [code, e.id, renderCertificate({ code, name: info.name, title: info.title })]);
    await sendMail({ to: info.email, subject: \`Your \${info.code} certificate\`, text: \`Congratulations \${info.name}! Your certificate: /certificates/\${code}.svg\` });
  }
  res.json({ data: { id: e.id, progress: e.progress } });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": "// Drain the queue: run each complete-course job.\n",
          },
          readOnly: ["package.json", ".env", "db.js", "redis.js", "mailer.js", "queue.js", "html.js", "certificate.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { enqueue } from "./queue.js";
import { redis } from "./redis.js";

const app = express();
app.use(express.json());
const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } });
const COURSES_KEY = "courses:all";

app.get("/courses", async (req, res) => {
  const hit = await redis.get(COURSES_KEY);
  if (hit) return res.set("X-Cache", "HIT").json(JSON.parse(hit));
  const body = { data: (await pool.query("SELECT id, code, title, price FROM courses ORDER BY id")).rows };
  await redis.set(COURSES_KEY, JSON.stringify(body), { EX: 300 });
  res.set("X-Cache", "MISS").json(body);
});

app.patch("/courses/:id", async (req, res) => {
  const { rows } = await pool.query("UPDATE courses SET price = $2 WHERE id = $1 RETURNING id, code, title, price", [req.params.id, req.body.price]);
  if (!rows[0]) return fail(res, 404, "COURSE_NOT_FOUND", "No such course");
  await redis.del(COURSES_KEY);
  res.json({ data: rows[0] });
});

app.patch("/enrollments/:id", async (req, res) => {
  const progress = req.body?.progress;
  if (!Number.isInteger(progress) || progress < 0 || progress > 100) return fail(res, 400, "VALIDATION_FAILED", "progress must be 0 to 100");
  const { rows } = await pool.query("UPDATE enrollments SET progress = $2 WHERE id = $1 RETURNING id, progress, certificate_job", [req.params.id, progress]);
  const e = rows[0];
  if (!e) return fail(res, 404, "ENROLLMENT_NOT_FOUND", "No such enrollment");
  let jobId = e.certificate_job;
  if (e.progress === 100 && !jobId) {
    jobId = await enqueue("complete-course", { enrollmentId: e.id });
    // Only the first request to set the job wins; a concurrent one keeps the stored id.
    const saved = await pool.query("UPDATE enrollments SET certificate_job = $2 WHERE id = $1 AND certificate_job IS NULL RETURNING certificate_job", [e.id, jobId]);
    if (!saved.rowCount) jobId = (await pool.query("SELECT certificate_job FROM enrollments WHERE id = $1", [e.id])).rows[0].certificate_job;
  }
  res.json({ data: { id: e.id, progress: e.progress, jobId: jobId ?? null } });
});

app.get("/me/notifications", async (req, res) => {
  const { rows } = await pool.query('SELECT id, type, payload, created_at AS "createdAt" FROM notifications WHERE user_id = $1 ORDER BY id DESC', [Number(req.get("x-user-id"))]);
  res.json({ data: rows });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "worker.js": `import { renderCertificate } from "./certificate.js";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";
import { drain } from "./queue.js";
import { redis } from "./redis.js";

const handlers = {
  async "complete-course"({ enrollmentId }) {
    const { rows } = await pool.query(
      "SELECT e.id, e.student_id, s.email, s.name, c.code AS course, c.title FROM enrollments e JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id WHERE e.id = $1",
      [enrollmentId]
    );
    const e = rows[0];
    if (!e) throw new Error(\`Enrollment \${enrollmentId} not found\`);
    const code = \`\${e.course}-\${String(e.id).padStart(5, "0")}\`;
    const created = await pool.query("INSERT INTO certificates (code, enrollment_id, svg) VALUES ($1, $2, $3) ON CONFLICT (enrollment_id) DO NOTHING", [
      code,
      e.id,
      renderCertificate({ code, name: e.name, title: e.title }),
    ]);
    if (created.rowCount) {
      // Only for a new certificate, so a retried job does not email twice.
      await sendMail({ to: e.email, subject: \`Your \${e.course} certificate\`, text: \`Congratulations \${e.name}! Your certificate: /certificates/\${code}.svg\` });
      await pool.query("INSERT INTO notifications (user_id, type, payload) VALUES ($1, 'course.completed', $2)", [e.student_id, { code }]);
    }
    return { code };
  },
};

const ran = await drain(handlers);
console.log(\`worker: \${ran} job(s) run\`);
await redis.quit();
await pool.end();
`,
          },
          tests: [
            { label: "Completing a course answers at once and queues the work", check: `${RQ} const before = emails().length; const r = await patch("/enrollments/21", { progress: 100 }); eq(r.status, 200, "status"); eq([r.json?.data?.id, r.json?.data?.progress], [21, 100], "body"); assert(/^[0-9a-f-]{36}$/.test(r.json?.data?.jobId || ""), "the job id"); eq(emails().length, before, "no email inside the request"); eq((await sql("SELECT count(*)::int AS n FROM certificates"))[0].n, 0, "no certificate inside the request"); eq((await sql("SELECT certificate_job FROM enrollments WHERE id = 21"))[0].certificate_job, r.json.data.jobId, "the job id is stored on the enrollment"); eq(await (await R()).lLen("jobs:queue"), 1, "one job");` },
            { label: "Repeating it queues nothing more", check: `${RQ} const first = (await sql("SELECT certificate_job FROM enrollments WHERE id = 21"))[0].certificate_job; const again = await patch("/enrollments/21", { progress: 100 }); eq(again.json?.data?.jobId, first, "the same job id"); eq(await (await R()).lLen("jobs:queue"), 1, "still one job"); eq((await patch("/enrollments/22", { progress: 70 })).json?.data?.jobId, null, "below 100: no job");` },
            { label: "The worker issues, emails and notifies, once", check: `await run("${WORKER}"); const cert = (await sql("SELECT code FROM certificates WHERE enrollment_id = 21"))[0]; eq(cert?.code, "BE-101-00021", "the certificate"); const mails = emails().filter((m) => m.to.includes("ada@example.com")); eq(mails.map((m) => m.subject), ["Your BE-101 certificate"], "one email"); await run("npm start"); const n = (await get("/me/notifications", { headers: { "X-User-Id": "1" } })).json?.data; eq(n?.map((x) => [x.type, x.payload]), [["course.completed", { code: "BE-101-00021" }]], "Ada's notification"); await run("${WORKER}"); eq(emails().filter((m) => m.to.includes("ada@example.com")).length, 1, "a second worker run sends nothing");` },
            { label: "SMTP down: the progress update still succeeds", check: `await run("SMTP_PORT=2525 npm start"); eq((await patch("/enrollments/23", { progress: 100 })).status, 200, "the API no longer talks to SMTP at all"); await run("${WORKER}"); eq(emails().filter((m) => m.to.includes("bayo@example.com")).map((m) => m.subject), ["Your DB-101 certificate"], "the worker sends Bayo's email later");` },
            { label: "GET /courses is cached and invalidated by changes", check: `await run("npm start"); eq((await get("/courses")).headers["x-cache"], "MISS", "first"); eq((await get("/courses")).headers["x-cache"], "HIT", "second"); eq((await patch("/courses/2", { price: 85000 })).status, 200, "change a price"); const after = await get("/courses"); eq([after.headers["x-cache"], after.json?.data?.[1]?.price], ["MISS", 85000], "fresh after the change");` },
          ],
          hint: "The PATCH route: update, then if progress is 100 and certificate_job is null, enqueue and store the id (UPDATE … WHERE certificate_job IS NULL guards against a double request). The worker's handler: SELECT what it needs, INSERT the certificate ON CONFLICT DO NOTHING, and only when that inserted a row send the email and insert the notification.",
          successMessage: "Completing a course is now one fast UPDATE; certificates, emails and notifications follow from the worker, once each, whatever fails along the way.",
        },
      },
    ],
    task: {
      title: "Week 18 deliverable: a backend service with a worker, caching and an asynchronous workflow",
      intro: "Add these capabilities to your own course API.",
      prompts: [
        "Add a Redis-backed job queue (your own or BullMQ) and a worker process (npm run worker); move every email and any slow generation out of request handlers.",
        "Add at least one scheduled job with a lock, so it runs once however many instances you start.",
        "Cache your most-read endpoint with a TTL and explicit invalidation in every write that changes it; put your login and other sensitive routes behind a Redis rate limit.",
        "Add one real-time or event-driven feature: WebSocket notifications, or events with isolated handlers.",
        "Checkpoint: the service answers fast because slow work runs in a worker, its cache never serves stale data after a change, and clients hear about events as they happen.",
      ],
      closing: "Next: Week 19, containers, Docker and continuous delivery.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
