/**
 * BACKEND ENGINEERING · WEEK 20 · PERFORMANCE, MONITORING AND PRODUCTION OPERATIONS
 *
 * Curriculum 20.1 – 20.P. Finding bottlenecks (Server-Timing per request,
 * through a request-scoped req.db); query optimisation; capacity planning; memory
 * (a bounded LRU) and event-loop blocking; HTTP caching; metrics in the
 * Prometheus format; alert rules; SLOs and error budgets from request logs;
 * backup retention; graceful shutdown (SIGTERM with requests in flight);
 * incidents and cost; four exercises; and an operations runbook.
 *
 * Timers, Date and performance.now run on the lab's clock, so a handler
 * that waits 300 ms measures 300 ms, and SIGTERM reaches the process like
 * a container stop.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s20-operations";
const MODULE = "be-w20-operations";

const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
const START = { start: "node --env-file=.env server.js" };
const PKG = (deps = ["express", "pg"]) => pkg({ name: "course-api", scripts: START, deps });
const ENV = `DATABASE_URL=${DB_URL}\n`;
const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;
const YAML = `const YAML = await load("yaml"); const yamlOf = (p) => { const t = file(p); assert(t, p + " is missing"); return YAML.parse(t) || {}; };`;
/** Check preamble: parse a Server-Timing header into { name: { dur, desc } }. */
const TIMING = `const timing = (r) => Object.fromEntries(String(r.headers["server-timing"] || "").split(",").map((part) => { const [name, ...params] = part.trim().split(";"); const p = Object.fromEntries(params.map((x) => { const [k, ...v] = x.trim().split("="); return [k, v.join("=").replace(/^"|"$/g, "")]; })); return [name, { dur: Number(p.dur), desc: p.desc }]; }));`;

/* ── 20.1 – 20.2: request instrumentation ─────────────────────────────── */

const INSTRUMENT_JS = `/**
 * Gives each request req.db: the pool, with every query made through it
 * counted and timed for that request; and sends the totals as Server-Timing:
 * db;dur=…;desc="N queries", app;dur=…, total;dur=…
 */
export function serverTiming(pool) {
  return (req, res, next) => {
    const stats = { queries: 0, dbMs: 0 };
    req.db = {
      async query(...args) {
        const start = performance.now();
        try {
          return await pool.query(...args);
        } finally {
          stats.queries += 1;
          stats.dbMs += performance.now() - start;
        }
      },
    };
    const start = performance.now();
    const writeHead = res.writeHead;
    res.writeHead = function (...args) {
      const total = performance.now() - start;
      const label = \`\${stats.queries} \${stats.queries === 1 ? "query" : "queries"}\`;
      res.setHeader("Server-Timing", \`db;dur=\${stats.dbMs.toFixed(1)};desc="\${label}", app;dur=\${(total - stats.dbMs).toFixed(1)}, total;dur=\${total.toFixed(1)}\`);
      return writeHead.apply(this, args);
    };
    next();
  };
}
`;
const N1_SQL = `CREATE TABLE instructors (id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, title text NOT NULL, instructor_id integer NOT NULL REFERENCES instructors (id));
CREATE TABLE enrollments (course_id integer NOT NULL REFERENCES courses (id), student_id integer NOT NULL);
INSERT INTO instructors VALUES (1, 'Ngozi Eze'), (2, 'Tunde Bakare'), (3, 'Amaka Nwosu');
INSERT INTO courses SELECT n, 'C-' || lpad(n::text, 3, '0'), 'Course ' || n, 1 + n % 3 FROM generate_series(1, 30) AS n;
INSERT INTO enrollments SELECT 1 + n % 30, n FROM generate_series(1, 900) AS n WHERE n % 7 <> 0;
`;
const N1_ROUTE = `app.get("/courses", async (req, res) => {
  const { rows: courses } = await req.db.query("SELECT id, code, title, instructor_id FROM courses ORDER BY id");
  for (const course of courses) {
    const instructor = await req.db.query("SELECT name FROM instructors WHERE id = $1", [course.instructor_id]);
    const enrolled = await req.db.query("SELECT count(*)::int AS n FROM enrollments WHERE course_id = $1", [course.id]);
    course.instructor = instructor.rows[0].name;
    course.students = enrolled.rows[0].n;
    delete course.instructor_id;
  }
  res.json({ data: courses });
});
`;

/* ── 20.4: an unbounded cache, and the LRU that replaces it ───────────── */

const LRU_JS = `/** A cache with at most max entries (least recently used goes first) that also expire after ttlMs. */
export function createLru({ max, ttlMs }) {
  const entries = new Map(); // Map keeps insertion order: the first key is the least recently used
  const fresh = (e) => Boolean(e) && Date.now() < e.expires;
  return {
    get(key) {
      const e = entries.get(key);
      if (!fresh(e)) {
        entries.delete(key);
        return undefined;
      }
      entries.delete(key); // move to the most-recent end
      entries.set(key, e);
      return e.value;
    },
    set(key, value) {
      entries.delete(key);
      entries.set(key, { value, expires: Date.now() + ttlMs });
      while (entries.size > max) entries.delete(entries.keys().next().value);
    },
    has(key) {
      return fresh(entries.get(key));
    },
    get size() {
      return entries.size;
    },
  };
}
`;

/* ── 20.8: request logs for the SLO report ────────────────────────────── */

/** Deterministic request logs: n lines, a few 5xx and a slow tail. */
function requestLog(n, seed, errorEvery, day) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  const routes = ["GET /courses", "GET /courses/:id", "POST /enrollments", "GET /me"];
  const lines = [];
  for (let i = 0; i < n; i++) {
    const r = rnd();
    const ms = r < 0.9 ? 20 + Math.floor(rnd() * 80) : r < 0.98 ? 100 + Math.floor(rnd() * 300) : 400 + Math.floor(rnd() * 1600);
    const status = i % errorEvery === errorEvery - 1 ? 500 + (i % 3) : rnd() < 0.05 ? 404 : 200;
    const t = new Date(Date.UTC(2026, 9, day, 0, 0, 0) + i * 61000).toISOString();
    lines.push(JSON.stringify({ time: t, route: routes[i % routes.length], status, ms }));
  }
  return lines.join("\n") + "\n";
}
const LOG_A = requestLog(400, 41, 97, 27);
const LOG_B = requestLog(150, 7, 1000, 26);
/** Check preamble: the reference SLO report for a log file. */
const SLO_REF = `const sloReport = (p, slo) => { const rows = file(p).split("\\n").filter(Boolean).map((l) => JSON.parse(l)); const n = rows.length; const errors = rows.filter((r) => r.status >= 500).length; const ms = rows.map((r) => r.ms).sort((a, b) => a - b); const pct = (q) => ms[Math.max(0, Math.ceil((q / 100) * n) - 1)]; const budget = Math.floor(n * (1 - slo / 100) + 1e-9); const used = budget ? Math.round((errors / budget) * 100) + "%" : (errors ? "exceeded" : "0%"); return ["Requests: " + n, "Availability: " + (((n - errors) / n) * 100).toFixed(2) + "% (" + errors + " errors)", "Latency: p50 " + pct(50) + " ms, p95 " + pct(95) + " ms, p99 " + pct(99) + " ms", "Error budget at " + slo + "%: " + budget + " request(s), used " + errors + " (" + used + ")"].join("\\n"); };`;

/* ── 20.9: backups on disk ────────────────────────────────────────────── */

/** Backup file names: one or two a day for 45 days before 2026-10-28. */
const BACKUPS = (() => {
  const names = [];
  for (let d = 0; d < 45; d++) {
    const day = new Date(Date.UTC(2026, 9, 28) - d * 86400000).toISOString().slice(0, 10);
    names.push(`academy-${day}T0200.dump`);
    if (d % 4 === 1) names.push(`academy-${day}T1400.dump`);
  }
  return names.sort();
})();
const RETENTION_REF = `const keepRef = (files, now) => { const at = (f) => Date.parse(f.slice(8, 18) + "T" + f.slice(19, 21) + ":" + f.slice(21, 23) + ":00Z"); const ageDays = (f) => Math.floor((now - at(f)) / 86400000); const newest = new Map(); for (const f of files) { const a = ageDays(f); if (a < 0) continue; const bucket = a < 7 ? "d" + a : a < 35 ? "w" + Math.floor((a - 7) / 7) : null; if (!bucket) continue; if (!newest.has(bucket) || at(f) > at(newest.get(bucket))) newest.set(bucket, f); } return new Set(newest.values()); };`;

/* ── 20.13: the slow report ───────────────────────────────────────────── */

const REPORT_SQL = `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL);
CREATE TABLE lesson_views (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, course_id integer NOT NULL, student_id integer NOT NULL, viewed_at timestamptz NOT NULL);
INSERT INTO courses SELECT n, 'C-' || lpad(n::text, 3, '0') FROM generate_series(1, 40) AS n;
INSERT INTO lesson_views (course_id, student_id, viewed_at)
  SELECT 1 + (n * 7919) % 40 * (n % 3) / 2 % 40, n % 1500, timestamptz '2026-10-01' + (n % 27) * interval '1 day'
  FROM generate_series(1, 30000) AS n;
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 139 · 20.1 – 20.3 · BOTTLENECKS, QUERIES, CAPACITY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l139-performance",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["20.1", "20.2", "20.3"],
    title: "Performance Bottlenecks, Query Optimization and Capacity Planning",
    subtitle: "Measure, then fix the biggest thing",
    estimatedMinutes: 90,
    intro: "Performance work starts with a measurement, never a guess. This lesson makes every response say where its time went, fixes the classic database bottleneck, and turns measurements into a capacity plan.",
    atoms: [
      {
        id: "a-be-bottlenecks",
        title: "Application performance bottlenecks",
        explain:
          "A request's time goes to the DATABASE (queries, and how many of them), the APPLICATION (JSON, templates, hashing, loops) and OTHER SERVICES (HTTP calls). Measure each per request before changing anything. The Server-Timing header (db;dur=12.3;desc=\"4 queries\", app;dur=1.2, total;dur=13.5) shows the split in the browser's network panel and in any HTTP client. To count per request, give each request its own handle on the database (req.db, a thin wrapper around the pool that counts and times the queries made through it), so concurrent requests never mix their numbers; Node's AsyncLocalStorage is the other way to carry per-request state through awaits without passing it along.",
        nodeLab: {
          task:
            "Write serverTiming(pool) in instrument.js: a middleware factory that gives each request its own stats and req.db, an object whose query(...) calls pool.query and adds 1 to the request's query count and the query's duration (performance.now) to its db time; just before the headers are sent (wrap res.writeHead) it sets Server-Timing: db;dur=<db ms, 1 decimal>;desc=\"<n> queries\" (\"1 query\" for one), app;dur=<total − db>, total;dur=<total>. server.js (given) queries through req.db.",
          db: N1_SQL,
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": DB_JS,
            "instrument.js": "/** Gives each request req.db (counted, timed queries) and a Server-Timing header. */\nexport function serverTiming(pool) {\n  return (req, res, next) => {\n    req.db = pool;\n    next();\n  };\n}\n",
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { serverTiming } from "./instrument.js";

const app = express();
app.use(serverTiming(pool));

${N1_ROUTE}
app.get("/courses/:id", async (req, res) => {
  const { rows } = await req.db.query("SELECT id, code, title FROM courses WHERE id = $1", [req.params.id]);
  res.json({ data: rows[0] ?? null });
});

app.get("/slow", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 250)); // stands in for slow application code
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "server.js"],
          open: "instrument.js",
          solution: { "instrument.js": INSTRUMENT_JS },
          tests: [
            { label: "Server-Timing counts this request's queries", check: `${TIMING} const r = await get("/courses/1"); const t = timing(r); assert(t.db && t.app && t.total, "Server-Timing with db, app and total: " + r.headers["server-timing"]); eq(t.db.desc, "1 query", "one query"); const all = timing(await get("/courses")); eq(all.db.desc, "61 queries", "GET /courses: 1 + 2 per course (30 courses): the N+1 problem, now visible");` },
            { label: "Durations add up", check: `${TIMING} const t = timing(await get("/slow")); eq(t.db.desc, "0 queries", "no queries"); assert(t.total.dur >= 250 && t.total.dur < 300, "total ≈ 250 ms (" + t.total.dur + ")"); assert(Math.abs(t.app.dur + t.db.dur - t.total.dur) < 0.25, "app + db = total"); assert(t.app.dur >= 250, "the time is in the application, not the database");` },
            { label: "Concurrent requests keep separate counts", check: `${TIMING} const [a, b] = await together(get("/courses"), get("/courses/2")); eq([timing(a).db.desc, timing(b).db.desc], ["61 queries", "1 query"], "each request sees only its own queries");` },
          ],
          hint: "Inside the returned middleware: const stats = { queries: 0, dbMs: 0 }; req.db = { async query(...args) { … } } timing await pool.query(...args) in try/finally; then keep the original res.writeHead and replace it with a function that sets the header and calls the original.",
          successMessage: "Every response now says where its time went, and GET /courses confesses to 61 queries.",
        },
      },
      {
        id: "a-be-query-optimization",
        title: "Database query optimization",
        explain:
          "The commonest backend bottleneck is not a slow query but MANY queries: the N+1 pattern (one query for the list, then one or more per item), each paying a network round trip. Replace them with one query that JOINs and aggregates (GROUP BY with count), or with two queries using WHERE id = ANY($1). Then make the remaining query fast: EXPLAIN ANALYZE, indexes on the columns you join and filter on, selecting only the columns you need, and LIMIT on lists. Week 12 covered the plans; this lab removes the round trips.",
        nodeLab: {
          task:
            "GET /courses makes 61 queries (see Server-Timing). Rewrite it as ONE query returning the same response: [{ id, code, title, instructor, students }] ordered by id, with students counted from enrollments (0 for a course nobody has joined).",
          db: N1_SQL,
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": DB_JS,
            "instrument.js": INSTRUMENT_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { serverTiming } from "./instrument.js";

const app = express();
app.use(serverTiming(pool));

${N1_ROUTE}
app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js", "instrument.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { serverTiming } from "./instrument.js";

const app = express();
app.use(serverTiming(pool));

app.get("/courses", async (req, res) => {
  const { rows } = await req.db.query(
    \`SELECT c.id, c.code, c.title, i.name AS instructor, count(e.student_id)::int AS students
       FROM courses c
       JOIN instructors i ON i.id = c.instructor_id
       LEFT JOIN enrollments e ON e.course_id = c.id
      GROUP BY c.id, i.name
      ORDER BY c.id\`
  );
  res.json({ data: rows });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "One query", check: `${TIMING} const r = await get("/courses"); eq(timing(r).db.desc, "1 query", "Server-Timing");` },
            { label: "The same response", check: `const r = await get("/courses"); const want = await sql("SELECT c.id, c.code, c.title, i.name AS instructor, (SELECT count(*)::int FROM enrollments e WHERE e.course_id = c.id) AS students FROM courses c JOIN instructors i ON i.id = c.instructor_id ORDER BY c.id"); eq(r.json?.data, want, "every course with its instructor and student count, in id order"); await sql("INSERT INTO courses VALUES (31, 'C-031', 'Brand new', 1)"); const fresh = (await get("/courses")).json.data.at(-1); eq([fresh.code, fresh.students], ["C-031", 0], "a course nobody has joined (LEFT JOIN, count 0)");` },
          ],
          hint: "SELECT c.id, c.code, c.title, i.name AS instructor, count(e.student_id)::int AS students FROM courses c JOIN instructors i … LEFT JOIN enrollments e ON e.course_id = c.id GROUP BY c.id, i.name ORDER BY c.id. count(column) skips the NULLs of the LEFT JOIN.",
          successMessage: "61 round trips became one; the response is identical, and Server-Timing proves it.",
        },
      },
      {
        id: "a-be-capacity",
        title: "Load testing and capacity planning",
        explain:
          "A LOAD TEST sends realistic traffic (the right mix of endpoints, at increasing rates) and records throughput, error rate and latency PERCENTILES (p50, p95, p99: averages hide the slow tail that users feel). Run it against a production-like environment, never production itself without care, and find the point where p95 starts to climb: that is the capacity of one instance. Little's law ties it together: requests in flight = arrival rate × time in system. Plan for peak (enrollment deadlines, campaign launches) with headroom (run at 50–70% of measured capacity), and remember the database is usually the shared limit that adding API instances does not raise.",
        decision: decide({
          scenario: "A load test shows one API instance serves 400 requests/s with p95 under 200 ms; above that p95 climbs steeply. The database connection pool has 20 connections and the average request holds one for 30 ms. Next month's enrollment day is expected to peak at 1,500 requests/s.",
          question: "What is the plan?",
          right: ["About 4 instances for the API at ~60–70% each, but also the database: 1,500 req/s × 0.03 s ≈ 45 connections busy at once, so raise pooled connections (or use a pooler) and test the database at that load", "Little's law shows the database limit that more instances would not fix."],
          wrong: [
            ["4 instances exactly (1,500 / 400)", "No headroom, and it ignores the database."],
            ["One bigger instance", "Same pool limit, and no redundancy."],
            ["Nothing: autoscaling handles it", "Autoscaling adds API instances, not database capacity."],
          ],
          at: 0,
          aftermath: "Exercise 20.12 builds the load-test tool that produces those percentiles.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 140 · 20.4 – 20.5 · MEMORY, EVENT LOOP, CACHING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l140-memory-caching",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["20.4", "20.5"],
    title: "Memory Usage, Event-Loop Blocking and Caching Strategies",
    subtitle: "What a single Node process can and cannot do",
    estimatedMinutes: 80,
    intro: "Node serves thousands of requests on one thread, which makes two mistakes expensive: memory that only grows, and work that blocks the thread. Caching, done at the right layer, saves both.",
    atoms: [
      {
        id: "a-be-memory",
        title: "Memory usage",
        explain:
          "A Node process that only grows is usually holding references: a module-level Map used as a cache with no limit, listeners added per request and never removed, arrays of every request for debugging. Watch process.memoryUsage().heapUsed over time (a sawtooth that returns to the same floor is healthy; a rising floor is a leak), and take heap snapshots to see what holds the memory. Every in-process cache needs a BOUND: a maximum number of entries with least-recently-used eviction, and a TTL.",
        nodeLab: {
          task:
            "cache.js's Map grows forever. Write createLru({ max, ttlMs }) in lru.js: get(key) returns the value (and marks it most recently used) or undefined if missing or expired; set(key, value) stores it with an expiry of ttlMs, evicting the least recently used entries while there are more than max; has(key) and a size getter. Use a Map (its insertion order is the recency order). Then use it in cache.js with max 500 and ttlMs 60 000.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "lru.js": "export function createLru({ max, ttlMs }) {\n  const entries = new Map();\n  return { get: (k) => entries.get(k), set: (k, v) => entries.set(k, v), has: (k) => entries.has(k), get size() { return entries.size; } };\n}\n",
            "cache.js": `// The profile lookup cache: one entry per user ever seen. It never shrinks.
const profiles = new Map();

export const profileCache = {
  get: (id) => profiles.get(id),
  set: (id, profile) => profiles.set(id, profile),
  get size() {
    return profiles.size;
  },
};
`,
          },
          readOnly: ["package.json"],
          open: "lru.js",
          solution: {
            "lru.js": LRU_JS,
            "cache.js": `import { createLru } from "./lru.js";

// At most 500 profiles, each for a minute: memory stays flat however many users there are.
export const profileCache = createLru({ max: 500, ttlMs: 60_000 });
`,
          },
          tests: [
            { label: "Bounded: the least recently used entry goes first", check: `const { createLru } = await load("lru.js"); const c = createLru({ max: 3, ttlMs: 60000 }); c.set("a", 1); c.set("b", 2); c.set("c", 3); eq(c.get("a"), 1, "a"); c.set("d", 4); eq([c.has("a"), c.has("b"), c.has("c"), c.has("d")], [true, false, true, true], "reading a made b the least recently used, so b was evicted"); eq(c.size, 3, "size"); c.set("c", 30); c.set("e", 5); eq([c.has("a"), c.get("c"), c.has("e")], [false, 30, true], "updating c refreshed it; a was evicted next");` },
            { label: "Entries expire", check: `const { createLru } = await load("lru.js"); const c = createLru({ max: 10, ttlMs: 60000 }); c.set("x", "v"); await advance(30000); eq(c.get("x"), "v", "still fresh after 30 s"); await advance(31000); eq([c.get("x"), c.has("x")], [undefined, false], "expired after 60 s"); c.set("y", 1); await advance(61000); eq(c.size <= 1, true, "an expired entry does not count once it is read");` },
            { label: "The profile cache stays flat", check: `const { profileCache } = await load("cache.js"); for (let i = 0; i < 20000; i++) profileCache.set(i, { id: i, name: "user " + i }); eq(profileCache.size, 500, "20 000 users later, still 500 entries"); eq(profileCache.get(19999)?.id, 19999, "the newest is there"); eq(profileCache.get(0), undefined, "the oldest is gone");` },
          ],
          hint: "Store { value, expires } in the Map. get: if missing or Date.now() >= expires, delete and return undefined; otherwise delete and re-set the key (moving it to the end). set: delete, set, then while (entries.size > max) delete entries.keys().next().value.",
          successMessage: "The cache keeps the useful entries and forgets the rest: memory is now bounded by design, not by luck.",
        },
      },
      {
        id: "a-be-event-loop-blocking",
        title: "Event-loop blocking",
        explain:
          "Node runs your JavaScript on ONE thread: while a handler computes (a synchronous bcrypt or pbkdf2, JSON.parse of a 50 MB body, a catastrophic regular expression, a loop over a million rows), every other request waits, and health checks time out. Measure it with perf_hooks.monitorEventLoopDelay(): a p99 delay above a few tens of milliseconds means something blocks. Fixes: the async versions of crypto functions (they run on the libuv thread pool), streaming instead of loading whole files, LIMIT and pagination instead of huge result sets, moving CPU-heavy work to a worker thread or a background job, and size limits on request bodies.",
        decision: decide({
          scenario: "Under load, all endpoints of the API slow down together whenever users log in, and /health/live sometimes times out. Login uses crypto.pbkdf2Sync with 600,000 iterations. CPU is at 100% on one core; the database is idle.",
          question: "What is happening, and what is the fix?",
          right: ["pbkdf2Sync blocks the event loop for every login, stalling all requests; use the async crypto.pbkdf2 (or argon2's async API) so hashing runs on the thread pool", "One thread, one blocking call, everyone waits."],
          wrong: [
            ["The database is slow; add indexes", "The database is idle."],
            ["Lower the iterations to 1,000", "Weakens password storage instead of fixing the blocking."],
            ["Add more database connections", "Not the bottleneck."],
          ],
          at: 1,
          aftermath: "Week 13's Argon2 hashing used the async API for exactly this reason.",
        }),
      },
      {
        id: "a-be-http-caching",
        title: "Caching strategies",
        explain:
          "Cache at the layer closest to the user that is still correct. HTTP CACHING: Cache-Control tells browsers and CDNs what they may keep (public, max-age=60, stale-while-revalidate=300 for a public catalogue; private, no-store for anything personal; public, max-age=31536000, immutable for fingerprinted files such as app.3f9c2a.js), and an ETag lets a client revalidate cheaply (If-None-Match → 304 Not Modified, no body). Behind that: a CDN, then the application cache (Redis, Week 18), then the database's own buffers. The fastest request is the one that never reaches your server; the most dangerous cache is a shared one holding personal data.",
        nodeLab: {
          task:
            "Set caching headers deliberately in server.js: GET /courses (public catalogue): Cache-Control: public, max-age=60, stale-while-revalidate=300 with an ETag (turn Express's etag back on), answering 304 to a matching If-None-Match; GET /me: Cache-Control: private, no-store; GET /assets/app.3f9c2a.js: public, max-age=31536000, immutable. After PATCH /courses/:id the catalogue's ETag must change.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] }),
            "server.js": `import express from "express";

const app = express();
app.set("etag", false);
app.use(express.json());

const courses = [
  { id: 1, code: "BE-101", title: "Backend Engineering", price: 120000 },
  { id: 2, code: "DB-101", title: "Relational Databases", price: 80000 },
];

app.get("/courses", (req, res) => res.json({ data: courses }));

app.patch("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  Object.assign(course, { price: req.body.price });
  res.json({ data: course });
});

app.get("/me", (req, res) => res.json({ data: { id: 7, email: "ada@example.com", balance: 15000 } }));

app.get("/assets/app.3f9c2a.js", (req, res) => res.type("js").send("console.log('academy');"));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";

const app = express();
app.set("etag", "strong"); // a strong ETag of each response body, so clients can revalidate
app.use(express.json());

const courses = [
  { id: 1, code: "BE-101", title: "Backend Engineering", price: 120000 },
  { id: 2, code: "DB-101", title: "Relational Databases", price: 80000 },
];

// Public and the same for everyone: browsers and CDNs may keep it for a minute.
app.get("/courses", (req, res) => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300").json({ data: courses });
});

app.patch("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  Object.assign(course, { price: req.body.price });
  res.json({ data: course });
});

// Personal: no shared cache may store it, and the browser should not keep it either.
app.get("/me", (req, res) => {
  res.set("Cache-Control", "private, no-store").json({ data: { id: 7, email: "ada@example.com", balance: 15000 } });
});

// The file name changes whenever the content does, so the content never changes: cache it for a year.
app.get("/assets/app.3f9c2a.js", (req, res) => {
  res.set("Cache-Control", "public, max-age=31536000, immutable").type("js").send("console.log('academy');");
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "The catalogue: public for a minute, with an ETag", check: `const r = await get("/courses"); eq(r.headers["cache-control"], "public, max-age=60, stale-while-revalidate=300", "Cache-Control"); assert(r.headers.etag, "an ETag header (Express's etag setting is off)");` },
            { label: "Revalidation: 304 Not Modified without a body", check: `const r = await get("/courses"); const again = await get("/courses", { headers: { "If-None-Match": r.headers.etag } }); eq(again.status, 304, "status"); eq(again.text, "", "no body"); await patch("/courses/2", { price: 85000 }); const changed = await get("/courses", { headers: { "If-None-Match": r.headers.etag } }); eq(changed.status, 200, "after a change the old ETag no longer matches"); assert(changed.headers.etag !== r.headers.etag, "a new ETag"); eq(changed.json.data[1].price, 85000, "the new data");` },
            { label: "Personal data is never stored; fingerprinted files for a year", check: `eq((await get("/me")).headers["cache-control"], "private, no-store", "GET /me"); eq((await get("/assets/app.3f9c2a.js")).headers["cache-control"], "public, max-age=31536000, immutable", "the fingerprinted asset");` },
          ],
          hint: "app.set(\"etag\", \"strong\") (or delete the line that turns it off): Express then answers matching If-None-Match with 304 by itself. Set each Cache-Control with res.set before sending.",
          successMessage: "Browsers and CDNs now absorb repeat catalogue requests (and revalidate them for the price of a header), personal data is never stored, and assets are fetched once a year.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 141 · 20.6 – 20.8 · METRICS, ALERTS, SLOS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l141-observability",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["20.6", "20.7", "20.8"],
    title: "Logs, Metrics, Tracing, Monitoring, Alerting, Uptime and Latency",
    subtitle: "Knowing before the users tell you",
    estimatedMinutes: 105,
    intro: "Week 16 made logs structured and traceable. Logs explain one request; METRICS describe all of them, cheaply, over time. This lesson exposes metrics, alerts on the ones that matter, and measures what users actually experience.",
    atoms: [
      {
        id: "a-be-metrics",
        title: "Structured logs, metrics and tracing",
        explain:
          "The three pillars: LOGS (one event, with detail: Week 16), METRICS (numbers aggregated over time: request rate, error rate, latency histograms, pool usage; cheap to keep for months) and TRACES (one request's path across services as timed spans, with OpenTelemetry). Prometheus scrapes GET /metrics in a text format: a COUNTER only goes up (http_requests_total), a HISTOGRAM counts observations into buckets (le = less than or equal) so percentiles can be computed later. Labels make series: use the route TEMPLATE (/courses/:id), never the raw URL or a user id, or the number of series explodes.",
        nodeLab: {
          task:
            "Write metrics.js: a middleware that, when each response finishes, increments http_requests_total{method, route, status} and observes its duration in seconds in http_request_duration_seconds{method, route} with buckets 0.05, 0.1, 0.25, 0.5, 1, 2.5 (and +Inf); route is req.baseUrl + req.route.path, or \"unmatched\" when no route matched. metricsHandler answers GET /metrics in Prometheus's text format: # HELP and # TYPE lines, then counters, then each histogram's cumulative _bucket lines, _sum and _count. Label order: method, route, status (le last).",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] }),
            "metrics.js": "export function metricsMiddleware(req, res, next) {\n  next();\n}\n\nexport function metricsHandler(req, res) {\n  res.type(\"text/plain\").send(\"\");\n}\n",
            "server.js": `import express from "express";
import { metricsHandler, metricsMiddleware } from "./metrics.js";

const app = express();
app.use(metricsMiddleware);

app.get("/metrics", metricsHandler);
app.get("/courses/:id", (req, res) => (req.params.id === "99" ? res.status(404).json({ error: { code: "COURSE_NOT_FOUND" } }) : res.json({ data: { id: Number(req.params.id) } })));
app.get("/reports/slow", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  res.json({ ok: true });
});
app.get("/boom", (req, res) => res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } }));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", "server.js"],
          open: "metrics.js",
          solution: {
            "metrics.js": `const BUCKETS = [0.05, 0.1, 0.25, 0.5, 1, 2.5];
const requests = new Map(); // label string → count
const durations = new Map(); // label string → { buckets: number[], sum, count }

const labels = (obj) => Object.entries(obj).map(([k, v]) => \`\${k}="\${String(v).replace(/["\\\\\\n]/g, "\\\\$&")}"\`).join(",");

export function metricsMiddleware(req, res, next) {
  const start = performance.now();
  res.on("finish", () => {
    const route = req.route ? req.baseUrl + req.route.path : "unmatched"; // the template, never the raw URL
    const seconds = (performance.now() - start) / 1000;
    const counterKey = labels({ method: req.method, route, status: res.statusCode });
    requests.set(counterKey, (requests.get(counterKey) ?? 0) + 1);
    const histKey = labels({ method: req.method, route });
    const h = durations.get(histKey) ?? { buckets: BUCKETS.map(() => 0), sum: 0, count: 0 };
    BUCKETS.forEach((le, i) => {
      if (seconds <= le) h.buckets[i] += 1;
    });
    h.sum += seconds;
    h.count += 1;
    durations.set(histKey, h);
  });
  next();
}

export function metricsHandler(req, res) {
  const lines = ["# HELP http_requests_total Requests handled.", "# TYPE http_requests_total counter"];
  for (const [key, n] of requests) lines.push(\`http_requests_total{\${key}} \${n}\`);
  lines.push("# HELP http_request_duration_seconds Request duration in seconds.", "# TYPE http_request_duration_seconds histogram");
  for (const [key, h] of durations) {
    BUCKETS.forEach((le, i) => lines.push(\`http_request_duration_seconds_bucket{\${key},le="\${le}"} \${h.buckets[i]}\`));
    lines.push(\`http_request_duration_seconds_bucket{\${key},le="+Inf"} \${h.count}\`);
    lines.push(\`http_request_duration_seconds_sum{\${key}} \${h.sum}\`);
    lines.push(\`http_request_duration_seconds_count{\${key}} \${h.count}\`);
  }
  res.type("text/plain; version=0.0.4").send(lines.join("\\n") + "\\n");
}
`,
          },
          tests: [
            { label: "Counters per method, route template and status", check: `for (const id of [1, 2, 3, 99]) await get("/courses/" + id); await get("/nope"); await get("/boom"); const m = (await get("/metrics")).text; for (const [line, why] of [['http_requests_total{method="GET",route="/courses/:id",status="200"} 3', "three 200s on the route template /courses/:id (not three different URLs)"], ['http_requests_total{method="GET",route="/courses/:id",status="404"} 1', "one 404"], ['http_requests_total{method="GET",route="unmatched",status="404"} 1', "unknown URLs are counted as route unmatched (or every scanner request would create a series)"], ['http_requests_total{method="GET",route="/boom",status="500"} 1', "the 500"]]) assert(m.split("\\n").includes(line), why + ": expected the line " + line); assert(m.includes("# TYPE http_requests_total counter"), "# TYPE … counter");` },
            { label: "A latency histogram with cumulative buckets", check: `await get("/reports/slow"); await get("/reports/slow"); const m = (await get("/metrics")).text; assert(m.includes("# TYPE http_request_duration_seconds histogram"), "# TYPE … histogram"); const v = (le) => Number((m.match(new RegExp('http_request_duration_seconds_bucket\\\\{method="GET",route="/reports/slow",le="' + le.replace("+", "\\\\+") + '"\\\\} (\\\\S+)')) || [])[1]); eq([v("0.05"), v("0.1"), v("0.25"), v("0.5"), v("1"), v("2.5"), v("+Inf")], [0, 0, 0, 2, 2, 2, 2], "two 300 ms requests: in every bucket from 0.5 up (buckets are cumulative)"); const count = Number((m.match(/http_request_duration_seconds_count\\{method="GET",route="\\/reports\\/slow"\\} (\\S+)/) || [])[1]); const sum = Number((m.match(/http_request_duration_seconds_sum\\{method="GET",route="\\/reports\\/slow"\\} (\\S+)/) || [])[1]); eq(count, 2, "_count"); assert(sum >= 0.6 && sum < 0.7, "_sum in seconds (" + sum + ")");` },
          ],
          hint: "On res \"finish\": route = req.route ? req.baseUrl + req.route.path : \"unmatched\". Keep a Map from a label string (method=\"GET\",route=\"…\",status=\"200\") to a count, and one per method+route for the histogram: an array of bucket counts (+1 to every bucket whose le ≥ the duration), a sum and a count.",
          successMessage: "Prometheus can now graph request rates, error rates and latency percentiles for every route, with a fixed, small number of series.",
        },
      },
      {
        id: "a-be-alerting",
        title: "Monitoring and alerting",
        explain:
          "Alert on SYMPTOMS users feel (the API is down, errors are high, requests are slow), not on every cause (CPU at 80% may be fine). Each alert needs a duration (for: 5m) so blips do not wake anyone, a SEVERITY (page a human now, or open a ticket for working hours), a summary, and a RUNBOOK link saying what to do. Too many alerts train people to ignore them; every page should be actionable. Error rate = rate of 5xx ÷ rate of all requests; p95 latency comes from histogram_quantile over the bucket rates.",
        nodeLab: {
          task:
            "Write alerts.yml (Prometheus alerting rules): one group named course-api with three rules. ApiDown: up{job=\"course-api\"} == 0 for 1m, severity page. HighErrorRate: the 5-minute rate of http_requests_total with status=~\"5..\" divided by the rate of all of them, above 0.05, for 5m, severity page. SlowRequests: histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m]))) > 0.5 for 10m, severity ticket. Each has annotations summary and runbook_url (https://runbooks.academy.example/<alert name>).",
          command: false,
          files: { "package.json": pkg({ name: "course-api", deps: ["yaml"] }), "alerts.yml": "groups:\n" },
          readOnly: ["package.json"],
          open: "alerts.yml",
          solution: {
            "alerts.yml": `groups:
  - name: course-api
    rules:
      - alert: ApiDown
        expr: up{job="course-api"} == 0
        for: 1m
        labels:
          severity: page
        annotations:
          summary: The course API is not answering Prometheus's scrapes.
          runbook_url: https://runbooks.academy.example/ApiDown

      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: page
        annotations:
          summary: More than 5% of requests are failing with 5xx.
          runbook_url: https://runbooks.academy.example/HighErrorRate

      - alert: SlowRequests
        expr: histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m]))) > 0.5
        for: 10m
        labels:
          severity: ticket
        annotations:
          summary: The 95th percentile latency has been above 500 ms for 10 minutes.
          runbook_url: https://runbooks.academy.example/SlowRequests
`,
          },
          tests: [
            { label: "One group, three alerts, each with a runbook", check: `${YAML} const g = yamlOf("alerts.yml").groups || []; eq(g.map((x) => x.name), ["course-api"], "one group named course-api"); const rules = g[0].rules || []; eq(rules.map((r) => r.alert), ["ApiDown", "HighErrorRate", "SlowRequests"], "the alerts"); for (const r of rules) { assert(r.annotations?.summary, r.alert + ": a summary"); eq(r.annotations?.runbook_url, "https://runbooks.academy.example/" + r.alert, r.alert + ": runbook_url"); }` },
            { label: "Expressions, durations and severities", check: `${YAML} const by = Object.fromEntries((yamlOf("alerts.yml").groups?.[0]?.rules || []).map((r) => [r.alert, r])); const norm = (e) => String(e || "").replace(/\\s+/g, ""); eq(norm(by.ApiDown?.expr), 'up{job="course-api"}==0', "ApiDown expr"); eq([by.ApiDown?.for, by.ApiDown?.labels?.severity], ["1m", "page"], "ApiDown: for 1m, page"); const e = norm(by.HighErrorRate?.expr); assert(/rate\\(http_requests_total\\{status=~"5\\.\\."\\}\\[5m\\]\\)/.test(e), "HighErrorRate: rate of 5xx over 5m"); assert(/\\/(sum\\()?rate\\(http_requests_total\\[5m\\]\\)/.test(e), "… divided by the rate of all requests"); assert(/>0\\.05$/.test(e), "… > 0.05"); eq([by.HighErrorRate?.for, by.HighErrorRate?.labels?.severity], ["5m", "page"], "HighErrorRate: for 5m, page"); const s = norm(by.SlowRequests?.expr); assert(/^histogram_quantile\\(0\\.95,sum(by\\(le\\))?\\(rate\\(http_request_duration_seconds_bucket\\[5m\\]\\)\\)(by\\(le\\))?\\)>0\\.5$/.test(s), "SlowRequests: histogram_quantile(0.95, sum by (le) (rate(…_bucket[5m]))) > 0.5"); eq([by.SlowRequests?.for, by.SlowRequests?.labels?.severity], ["10m", "ticket"], "SlowRequests: for 10m, a ticket rather than a page");` },
          ],
          hint: "groups: - name: course-api, rules: a list of { alert, expr, for, labels: { severity }, annotations: { summary, runbook_url } }. The error rate is sum(rate(…{status=~\"5..\"}[5m])) / sum(rate(…[5m])) > 0.05.",
          successMessage: "Three alerts on what users feel: the API is down, failing or slow, each with a severity and a page that says what to do.",
        },
      },
      {
        id: "a-be-slo",
        title: "Uptime and latency measurements",
        explain:
          "Measure what users experience as SERVICE LEVEL INDICATORS: availability (the share of requests that did not fail with 5xx) and latency percentiles. A SERVICE LEVEL OBJECTIVE sets the target (99.9% of requests succeed over 30 days; p95 under 300 ms). The ERROR BUDGET is what the objective allows to fail: 0.1% of the requests; while budget remains the team ships freely, when it is spent reliability work comes first. External UPTIME checks (from outside your network, every minute) catch what internal metrics cannot: DNS, certificates, the load balancer.",
        nodeLab: {
          task:
            "Write slo.js [file] [--slo 99.9]: read the JSON-lines request log (default logs/requests.log; each line { time, route, status, ms }) and print four lines. \"Requests: <n>\". \"Availability: <x.xx>% (<e> errors)\", where errors are statuses ≥ 500. \"Latency: p50 <a> ms, p95 <b> ms, p99 <c> ms\", nearest-rank percentiles: the value at position ceil(p/100 × n) in the sorted durations. \"Error budget at <slo>%: <budget> request(s), used <e> (<pct>%)\", where budget = floor(n × (1 − slo/100)) and pct = round(e / budget × 100), or \"exceeded\" when the budget is 0 and there are errors.",
          command: "node slo.js",
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "logs/requests.log": LOG_A,
            "logs/2026-10-26.log": LOG_B,
            "slo.js": "import { readFileSync } from \"node:fs\";\n\nconst args = process.argv.slice(2);\n",
          },
          readOnly: ["package.json", "logs/requests.log", "logs/2026-10-26.log"],
          open: "slo.js",
          solution: {
            "slo.js": `import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const sloAt = args.indexOf("--slo");
const slo = sloAt >= 0 ? Number(args[sloAt + 1]) : 99.9;
const file = args.find((a, i) => !a.startsWith("--") && i !== sloAt + 1) ?? "logs/requests.log";

const rows = readFileSync(file, "utf8").split("\\n").filter(Boolean).map((line) => JSON.parse(line));
const n = rows.length;
const errors = rows.filter((r) => r.status >= 500).length;
const ms = rows.map((r) => r.ms).sort((a, b) => a - b);
const percentile = (p) => ms[Math.max(0, Math.ceil((p / 100) * n) - 1)]; // nearest rank

const budget = Math.floor(n * (1 - slo / 100) + 1e-9); // + 1e-9: 1000 × 0.001 must be 1, not 0.999…
const used = budget ? \`\${Math.round((errors / budget) * 100)}%\` : errors ? "exceeded" : "0%";

console.log(\`Requests: \${n}\`);
console.log(\`Availability: \${(((n - errors) / n) * 100).toFixed(2)}% (\${errors} errors)\`);
console.log(\`Latency: p50 \${percentile(50)} ms, p95 \${percentile(95)} ms, p99 \${percentile(99)} ms\`);
console.log(\`Error budget at \${slo}%: \${budget} request(s), used \${errors} (\${used})\`);
`,
          },
          tests: [
            { label: "Today's report", check: `${SLO_REF} await run("node slo.js"); eq(stdout().trim(), sloReport("logs/requests.log", 99.9), "the report for logs/requests.log at 99.9%");` },
            { label: "Another objective and another file", check: `${SLO_REF} await run("node slo.js --slo 99"); eq(stdout().trim(), sloReport("logs/requests.log", 99), "--slo 99"); await run("node slo.js logs/2026-10-26.log --slo 99.5"); eq(stdout().trim(), sloReport("logs/2026-10-26.log", 99.5), "yesterday's file at 99.5%");` },
          ],
          hint: "Sort the durations once; the p-th percentile is sorted[Math.ceil(p / 100 * n) - 1]. Floating point: 400 × (1 − 0.999) is 0.39999…, so add a tiny epsilon before Math.floor. Arguments can come in either order: --slo takes the next value; anything else is the file.",
          successMessage: "One command turns raw request logs into the numbers an SLO is judged by: availability, latency percentiles and how much error budget is left.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 142 · 20.9 – 20.11 · BACKUPS, SHUTDOWN, INCIDENTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l142-reliability-ops",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["20.9", "20.10", "20.11"],
    title: "Backups and Disaster Recovery, Graceful Shutdown, Cost and Incidents",
    subtitle: "Planning for the bad day",
    estimatedMinutes: 95,
    intro: "Every system eventually loses a disk, deploys a bad release or has an outage. Operations is the work done beforehand that makes those days short.",
    atoms: [
      {
        id: "a-be-backup-retention",
        title: "Backup scheduling and disaster recovery",
        explain:
          "Two numbers drive a backup plan: the RECOVERY POINT OBJECTIVE (how much data you can lose: a nightly dump means up to a day; continuous WAL archiving or a managed database's point-in-time recovery means minutes) and the RECOVERY TIME OBJECTIVE (how long restoring may take). Follow 3-2-1 (three copies, two kinds of storage, one off-site), keep a RETENTION schedule (dailies for a week, weeklies for a month), encrypt backups, and above all TEST RESTORES regularly: an untested backup is a hope, not a backup (Week 12 restored one with pg_restore).",
        nodeLab: {
          task:
            "Write keep(files, now) in retention.js. Backup files are named academy-YYYY-MM-DDTHHMM.dump (UTC). Keep the newest backup of each of the last 7 days (backups 0 to 6 whole days old) and the newest of each of the 4 weeks before that (7–13, 14–20, 21–27 and 28–34 days old); everything older or not the newest in its period is deleted. Return { keep, remove }, both sorted. Ignore files whose names do not match (never delete them).",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "retention.js": "/** Which backups to keep and which to remove. now: a Date. */\nexport function keep(files, now) {\n  return { keep: [...files].sort(), remove: [] };\n}\n",
          },
          readOnly: ["package.json"],
          open: "retention.js",
          solution: {
            "retention.js": `const NAME = /^academy-(\\d{4}-\\d{2}-\\d{2})T(\\d{2})(\\d{2})\\.dump$/;
const DAY = 86_400_000;

/** The period a backup of this age belongs to: one per day for a week, then one per week for four weeks. */
function period(ageDays) {
  if (ageDays < 0) return null;
  if (ageDays < 7) return \`day-\${ageDays}\`;
  if (ageDays < 35) return \`week-\${Math.floor((ageDays - 7) / 7)}\`;
  return null;
}

/** Which backups to keep and which to remove. now: a Date. */
export function keep(files, now) {
  const newest = new Map(); // period → { file, at }
  const backups = [];
  for (const file of files) {
    const m = NAME.exec(file);
    if (!m) continue; // not ours: never delete it
    const at = Date.parse(\`\${m[1]}T\${m[2]}:\${m[3]}:00Z\`);
    backups.push(file);
    const p = period(Math.floor((now - at) / DAY));
    if (p && (!newest.has(p) || at > newest.get(p).at)) newest.set(p, { file, at });
  }
  const kept = new Set([...newest.values()].map((x) => x.file));
  return { keep: [...kept].sort(), remove: backups.filter((f) => !kept.has(f)).sort() };
}
`,
          },
          tests: [
            { label: "Seven dailies and four weeklies", check: `${RETENTION_REF} const { keep } = await load("retention.js"); const files = ${JSON.stringify(BACKUPS)}; const now = new Date("2026-10-28T03:00:00Z"); const r = keep(files, now); const want = keepRef(files, now); eq(r.keep, [...want].sort(), "kept"); eq(r.remove, files.filter((f) => !want.has(f)).sort(), "removed"); eq(r.keep.length, 11, "7 days + 4 weeks");` },
            { label: "Other files are never touched; other dates work", check: `${RETENTION_REF} const { keep } = await load("retention.js"); const files = ["notes.txt", "academy-2026-10-28.dump", ${JSON.stringify(BACKUPS.slice(10, 30)).slice(1, -1)}]; const now = new Date("2026-10-12T12:00:00Z"); const r = keep(files, now); assert(!r.remove.includes("notes.txt") && !r.remove.includes("academy-2026-10-28.dump"), "files that are not backups are never removed"); const want = keepRef(files.filter((f) => /^academy-\\d{4}-\\d{2}-\\d{2}T\\d{4}\\.dump$/.test(f)), now); eq(r.keep, [...want].sort(), "kept on 12 October"); eq(keep([], now), { keep: [], remove: [] }, "no backups");` },
          ],
          hint: "Parse the date and time from the name (a regular expression), compute the age in whole days with Math.floor((now - at) / 86400000), map the age to a period (day-0 … day-6, week-0 … week-3, or none), and keep the newest file per period.",
          successMessage: "Backups now follow a retention schedule a script can apply every night, keeping eleven restore points that reach back five weeks.",
        },
      },
      {
        id: "a-be-graceful-shutdown",
        title: "Graceful shutdown and connection management",
        explain:
          "Deploys, scaling and restarts stop processes with SIGTERM (then SIGKILL after a grace period, 10–30 seconds). A GRACEFUL shutdown uses that window: mark the instance not ready and wait a few seconds (so the load balancer notices and stops sending traffic), stop accepting new connections (server.close), let in-flight requests finish, close idle keep-alive connections, then close the database pool and other clients, and exit 0. A timer forces exit(1) if something hangs. Without this, every deploy cuts off requests mid-way: half-written payments, broken uploads, 502s.",
        nodeLab: {
          task:
            "Write installShutdown({ server, pool, state, timeoutMs = 10000, drainMs = 5000 }) in shutdown.js: on SIGTERM or SIGINT (once): log \"shutting down\", set state.shuttingDown = true (server.js's /health/ready then answers 503), wait drainMs so the load balancer notices, then call server.close() and server.closeIdleConnections(); when close's callback fires, await pool.end(), log \"shutdown complete\" and exit 0. If that has not happened timeoutMs after the signal, log \"forced shutdown\" and exit 1 (unref the timer so it does not keep the process alive).",
          db: "SELECT 1;\n",
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": DB_JS,
            "shutdown.js": "export function installShutdown({ server, pool, state, timeoutMs = 10_000, drainMs = 5_000 }) {}\n",
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { installShutdown } from "./shutdown.js";

const app = express();
const state = { shuttingDown: false };

app.get("/health/ready", (req, res) => res.status(state.shuttingDown ? 503 : 200).json({ status: state.shuttingDown ? "shutting down" : "ready" }));

// A request that takes 3 seconds: a report, an upload, a payment.
app.get("/reports/slow", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const { rows } = await pool.query("SELECT 42 AS answer");
  res.json({ data: rows[0] });
});

// A request that never finishes (a bug): shutdown must not wait for it forever.
app.get("/hang", () => {});

const server = app.listen(3000, () => console.log("Course API on http://localhost:3000"));
installShutdown({ server, pool, state });
`,
          },
          readOnly: ["package.json", ".env", "db.js", "server.js"],
          open: "shutdown.js",
          solution: {
            "shutdown.js": `/** Finishes in-flight requests, then closes everything, when the platform asks the process to stop. */
export function installShutdown({ server, pool, state, timeoutMs = 10_000, drainMs = 5_000 }) {
  let started = false;
  const shutdown = (signal) => {
    if (started) return;
    started = true;
    console.log(\`shutting down (\${signal})\`);
    state.shuttingDown = true; // readiness now fails: the load balancer stops sending traffic

    const force = setTimeout(() => {
      console.error("forced shutdown: requests still running after the grace period");
      process.exit(1);
    }, timeoutMs);
    force.unref();

    // Give the load balancer time to notice the failing readiness check, then stop accepting connections.
    setTimeout(() => {
      server.close(async () => {
        await pool.end();
        console.log("shutdown complete");
        process.exit(0);
      });
      server.closeIdleConnections?.();
    }, drainMs);
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
`,
          },
          tests: [
            { label: "An in-flight request finishes; then a clean exit", check: `const slow = get("/reports/slow"); await advance(500); await kill("SIGTERM"); const r = await slow; await advance(6000); eq([r.status, r.json?.data?.answer], [200, 42], "the 3-second request that was running when SIGTERM arrived still completes (with its database query)"); eq(exitCode(), 0, "exit code 0"); has(stdout(), "shutting down", "log the start"); has(stdout(), "shutdown complete", "log the end (after pool.end())");` },
            { label: "Readiness fails during the shutdown", check: `await run("npm start"); const slow = get("/reports/slow"); await advance(100); const done = kill("SIGTERM"); await advance(10); const ready = await get("/health/ready"); await done; await slow; eq(ready.status, 503, "/health/ready answers 503 while shutting down, so no new traffic is routed here");` },
            { label: "A hung request cannot block the exit forever", check: `await run("npm start"); get("/hang"); await advance(100); const t0 = now(); await kill("SIGTERM"); await advance(11000); eq(exitCode(), 1, "exit 1 after the 10 s grace period"); has(stderr() + stdout(), "forced shutdown", "say why"); assert(now() - t0 >= 10000, "not before the grace period");` },
          ],
          hint: "process.on(\"SIGTERM\", …) and SIGINT, guarded so it runs once. const force = setTimeout(…, timeoutMs); force.unref(). Then setTimeout(() => { server.close(async () => { await pool.end(); …; process.exit(0) }); server.closeIdleConnections(); }, drainMs).",
          successMessage: "Deploys no longer cut requests off: the instance leaves the load balancer, finishes its work, closes its connections and exits cleanly, or gives up after a bounded wait.",
        },
      },
      {
        id: "a-be-incidents",
        title: "Cost management and production incident response",
        explain:
          "INCIDENT RESPONSE: declare it early, assign an INCIDENT COMMANDER (coordinates, does not debug) and a communicator, MITIGATE first (roll back, scale up, switch off a feature flag) and find the root cause later, keep a timestamped log, update users on a status page, and afterwards write a BLAMELESS POSTMORTEM with action items that have owners and dates. COST: the bill grows with idle capacity and data. Right-size instances to measured load, scale down at night, set log and metric retention deliberately, delete old images and backups by policy, watch egress and managed-database storage, and put a budget alert on the account.",
        decision: decide({
          scenario: "At 14:05 the error rate jumps to 30% right after a deploy at 14:00. Two engineers start reading the new code to find the bug; nobody has said anything in the team channel; support is receiving complaints.",
          question: "What should happen first?",
          right: ["Declare an incident with a commander, roll back to the previous release to stop the damage, post a status update, and investigate the cause afterwards", "Mitigate first, coordinate and communicate."],
          wrong: [
            ["Keep debugging until the bug is found, then deploy a fix", "Users suffer for the whole investigation."],
            ["Restart the servers", "The bad release would start again."],
            ["Wait to see if it recovers", "A deploy-correlated spike will not."],
          ],
          at: 0,
          aftermath: "Exercise 20.15 writes the procedure and a postmortem.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 143 · 20.12 – 20.15 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l143-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["20.12", "20.13", "20.14", "20.15"],
    title: "Exercises: Measuring, Fixing, Watching and Recovering",
    subtitle: "Operations work on the academy API",
    estimatedMinutes: 200,
    intro: "Four exercises: a load-test tool, a real bottleneck fixed with evidence, a monitor that pages when the API is down, and the procedure for when it does.",
    atoms: [
      {
        id: "a-be-ex-load-test",
        title: "Exercise: load-test a list or search endpoint",
        explain:
          "A load-test tool needs three things: CONCURRENCY control (a fixed number of requests in flight, each worker starting the next as soon as one finishes), accurate per-request timing, and honest statistics (errors counted separately, percentiles rather than averages, throughput over the wall-clock duration). Tools like k6, autocannon and Gatling do this at scale; writing a small one shows exactly what their numbers mean.",
        nodeLab: {
          task:
            "Write runLoad({ url, requests, concurrency, fetch }) in loadtest.js (fetch defaults to the global fetch; tests pass a fake): start exactly `concurrency` workers that each loop until `requests` requests have been started, timing each one with performance.now. A request is an error if fetch throws or the status is not 2xx. Return { requests, errors, rps, p50, p95, p99, max } (latencies in ms, nearest-rank percentiles over all requests, rps = requests ÷ wall-clock seconds, rounded to 1 decimal). The checks run it against GET /courses/search and with a fake fetch.",
          db: `CREATE TABLE courses (id integer PRIMARY KEY, title text NOT NULL);\nINSERT INTO courses SELECT n, 'Course ' || n FROM generate_series(1, 200) AS n;\n`,
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
let inFlight = 0;
let maxInFlight = 0;

app.get("/courses/search", async (req, res) => {
  inFlight += 1;
  maxInFlight = Math.max(maxInFlight, inFlight);
  try {
    await new Promise((resolve) => setTimeout(resolve, 40)); // stands in for the query's time
    const { rows } = await pool.query("SELECT id, title FROM courses WHERE title ILIKE $1 ORDER BY id LIMIT 20", [\`%\${req.query.q ?? ""}%\`]);
    res.json({ data: rows });
  } finally {
    inFlight -= 1;
  }
});

app.get("/stats", (req, res) => res.json({ maxInFlight }));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "loadtest.js": "export async function runLoad({ url, requests, concurrency, fetch: request = fetch }) {\n  return {};\n}\n",
          },
          readOnly: ["package.json", ".env", "db.js", "server.js"],
          open: "loadtest.js",
          solution: {
            "loadtest.js": `/** Sends \`requests\` requests to url, \`concurrency\` at a time; returns throughput, errors and latency percentiles. */
export async function runLoad({ url, requests, concurrency, fetch: request = fetch }) {
  const latencies = [];
  let started = 0;
  let errors = 0;

  async function worker() {
    while (started < requests) {
      started += 1;
      const t0 = performance.now();
      try {
        const res = await request(url);
        await res.arrayBuffer?.();
        if (res.status < 200 || res.status >= 300) errors += 1;
      } catch {
        errors += 1;
      }
      latencies.push(performance.now() - t0);
    }
  }

  const begin = performance.now();
  await Promise.all(Array.from({ length: Math.min(concurrency, requests) }, worker));
  const seconds = (performance.now() - begin) / 1000;

  const sorted = latencies.sort((a, b) => a - b);
  const pct = (p) => Math.round(sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)]);
  return {
    requests: sorted.length,
    errors,
    rps: Math.round((sorted.length / seconds) * 10) / 10,
    p50: pct(50),
    p95: pct(95),
    p99: pct(99),
    max: Math.round(sorted.at(-1)),
  };
}
`,
          },
          tests: [
            { label: "Against the API: the requested concurrency, no more", check: `const { runLoad } = await load("loadtest.js"); const r = await wait(runLoad({ url: "http://localhost:3000/courses/search?q=1", requests: 60, concurrency: 6 })); eq([r.requests, r.errors], [60, 0], "60 requests, no errors"); eq((await get("/stats")).json?.maxInFlight, 6, "exactly 6 requests in flight at the peak"); assert(r.p50 >= 40 && r.p50 < 150, "p50 a little over the 40 ms the endpoint waits (" + r.p50 + ")"); assert(r.rps > 30 && r.rps <= 160, "at most 6 / 0.04 s = 150 requests per second (" + r.rps + ")");` },
            { label: "Percentiles and errors, with a fake fetch", check: `const { runLoad } = await load("loadtest.js"); let i = 0; const fake = () => { const n = ++i; return new Promise((resolve, reject) => setTimeout(() => (n % 10 === 0 ? reject(new Error("ECONNRESET")) : resolve({ status: n % 25 === 0 ? 503 : 200, arrayBuffer: async () => new ArrayBuffer(0) })), n)); }; const r = await wait(runLoad({ url: "x", requests: 100, concurrency: 1, fetch: fake })); eq([r.requests, r.errors], [100, 12], "100 requests; errors: 10 rejected (every 10th) + 2 answered 503 (25 and 75)"); const near = (got, want) => Math.abs(got - want) <= 1; assert(near(r.p50, 50) && near(r.p95, 95) && near(r.p99, 99) && near(r.max, 100), "request n took n ms, so p50 ≈ 50, p95 ≈ 95, p99 ≈ 99, max ≈ 100 (got " + [r.p50, r.p95, r.p99, r.max] + ")"); assert(r.rps >= 15 && r.rps <= 20, "about 100 requests in 5.05 s (1 + 2 + … + 100 ms, one at a time): " + r.rps);` },
          ],
          hint: "let started = 0; each worker: while (started < requests) { started += 1; time one fetch }. Promise.all of min(concurrency, requests) workers. A thrown fetch or a status outside 200–299 counts as an error; its latency still counts.",
          successMessage: "You can now put a number on any endpoint: throughput at a given concurrency, the error count and the latency tail.",
        },
      },
      {
        id: "a-be-ex-bottleneck",
        title: "Exercise: identify and fix a performance bottleneck",
        explain:
          "GET /reports/top-courses is the slowest endpoint. The headers show why: it pulls every lesson view (30,000 rows) into Node and counts them in a loop. Move the work to where the data is: PostgreSQL aggregates, sorts and limits, and sends back ten rows. Then check the evidence again, not your intuition.",
        nodeLab: {
          task:
            "Rewrite GET /reports/top-courses?since=YYYY-MM-DD so PostgreSQL does the work: count views per course since the date (and distinct students), join the course code, order by views descending then course id, LIMIT 10. The response must stay the same: [{ courseId, code, views, students }]. X-Db-Rows (given) shows how many rows came back from PostgreSQL: it must be at most 10.",
          db: REPORT_SQL,
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

/** Counts rows returned to Node for the current request (shown as X-Db-Rows). */
export async function query(res, text, params) {
  const result = await pool.query(text, params);
  res.locals.dbRows = (res.locals.dbRows ?? 0) + result.rowCount;
  if (!res.headersSent) res.set("X-Db-Rows", String(res.locals.dbRows));
  return result;
}
`,
            "server.js": `import express from "express";
import { query } from "./db.js";

const app = express();

app.get("/reports/top-courses", async (req, res) => {
  const since = req.query.since ?? "2026-10-01";
  const { rows: views } = await query(res, "SELECT course_id, student_id, viewed_at FROM lesson_views");
  const { rows: courses } = await query(res, "SELECT id, code FROM courses");
  const stats = new Map();
  for (const v of views) {
    if (v.viewed_at < new Date(since)) continue;
    const s = stats.get(v.course_id) ?? { views: 0, students: new Set() };
    s.views += 1;
    s.students.add(v.student_id);
    stats.set(v.course_id, s);
  }
  const report = [...stats]
    .map(([courseId, s]) => ({ courseId, code: courses.find((c) => c.id === courseId).code, views: s.views, students: s.students.size }))
    .sort((a, b) => b.views - a.views || a.courseId - b.courseId)
    .slice(0, 10);
  res.json({ data: report });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          readOnly: ["package.json", ".env", "db.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { query } from "./db.js";

const app = express();

app.get("/reports/top-courses", async (req, res) => {
  const since = req.query.since ?? "2026-10-01";
  const { rows } = await query(
    res,
    \`SELECT v.course_id AS "courseId", c.code, count(*)::int AS views, count(DISTINCT v.student_id)::int AS students
       FROM lesson_views v
       JOIN courses c ON c.id = v.course_id
      WHERE v.viewed_at >= $1::date
      GROUP BY v.course_id, c.code
      ORDER BY views DESC, v.course_id
      LIMIT 10\`,
    [since]
  );
  res.json({ data: rows });
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
          },
          tests: [
            { label: "PostgreSQL sends back at most ten rows", check: `const r = await get("/reports/top-courses"); eq(r.status, 200, "status"); assert(Number(r.headers["x-db-rows"]) <= 10, "X-Db-Rows: " + r.headers["x-db-rows"] + " rows came back to Node (at most 10)");` },
            { label: "The same report as before", check: `const want = async (since) => sql("SELECT v.course_id AS \\"courseId\\", c.code, count(*)::int AS views, count(DISTINCT v.student_id)::int AS students FROM lesson_views v JOIN courses c ON c.id = v.course_id WHERE v.viewed_at >= $1::date GROUP BY v.course_id, c.code ORDER BY views DESC, v.course_id LIMIT 10", [since]); eq((await get("/reports/top-courses")).json?.data, await want("2026-10-01"), "since the default date"); eq((await get("/reports/top-courses?since=2026-10-20")).json?.data, await want("2026-10-20"), "since 20 October");` },
          ],
          hint: "SELECT v.course_id AS \"courseId\", c.code, count(*)::int AS views, count(DISTINCT v.student_id)::int AS students FROM lesson_views v JOIN courses c … WHERE v.viewed_at >= $1::date GROUP BY … ORDER BY views DESC, v.course_id LIMIT 10.",
          successMessage: "30,000 rows across the wire became ten: the database does what it is built for, and the endpoint's cost no longer grows with the data.",
        },
      },
      {
        id: "a-be-ex-monitoring",
        title: "Exercise: configure application health monitoring",
        explain:
          "An uptime monitor checks the API from the outside on a schedule and notifies people when it changes state, not on every failed check: one failure is a blip, three in a row are an outage. It sends one DOWN notification (with when it started) and one UP notification (with how long it lasted), so the channel stays quiet enough that people read it.",
        nodeLab: {
          task:
            "Write createMonitor({ url, webhook, intervalMs = 30000, failuresBeforeAlert = 3 }) in monitor.js returning { start(), stop(), state }. Every intervalMs, GET url with a 5-second timeout; non-2xx or an error counts as a failure. After failuresBeforeAlert consecutive failures, POST { status: \"down\", url, since: <ISO time of the first failure>, failures } to webhook once; when a check succeeds again after that, POST { status: \"up\", url, downtimeSeconds } once (seconds since the first failure, rounded). state is \"up\" or \"down\". start.js (given) watches this API's /health/ready.",
          db: "SELECT 1;\n",
          services: {
            "https://hooks.example": `const express = require("express");\nconst app = express();\napp.use(express.json());\napp.locals.received = [];\napp.post("/alerts", (req, res) => { app.locals.received.push(req.body); res.status(204).end(); });\nmodule.exports = app;\n`,
          },
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();

app.get("/health/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
});

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "monitor.js": "export function createMonitor({ url, webhook, intervalMs = 30_000, failuresBeforeAlert = 3 }) {\n  return { start() {}, stop() {}, state: \"up\" };\n}\n",
          },
          readOnly: ["package.json", ".env", "db.js", "server.js"],
          open: "monitor.js",
          solution: {
            "monitor.js": `/** Checks url every intervalMs; notifies webhook once when it goes down and once when it recovers. */
export function createMonitor({ url, webhook, intervalMs = 30_000, failuresBeforeAlert = 3 }) {
  let timer = null;
  let failures = 0;
  let firstFailure = null;
  const monitor = { state: "up", start, stop };

  const notify = (body) =>
    fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch((err) =>
      console.error(\`monitor: could not notify: \${err.message}\`)
    );

  async function check() {
    let ok = false;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      ok = res.status >= 200 && res.status < 300;
    } catch {
      ok = false;
    }
    if (!ok) {
      failures += 1;
      firstFailure ??= new Date();
      if (failures === failuresBeforeAlert) {
        monitor.state = "down";
        await notify({ status: "down", url, since: firstFailure.toISOString(), failures });
      }
      return;
    }
    if (monitor.state === "down") {
      monitor.state = "up";
      await notify({ status: "up", url, downtimeSeconds: Math.round((Date.now() - firstFailure.getTime()) / 1000) });
    }
    failures = 0;
    firstFailure = null;
  }

  function start() {
    timer ??= setInterval(check, intervalMs);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  return monitor;
}
`,
          },
          tests: [
            { label: "Healthy: no notifications", check: `const { createMonitor } = await load("monitor.js"); const hooks = service("https://hooks.example"); const m = createMonitor({ url: "http://localhost:3000/health/ready", webhook: "https://hooks.example/alerts" }); m.start(); try { await advance(95000); eq(hooks.locals.received, [], "three healthy checks, nothing sent"); eq(m.state, "up", "state"); } finally { m.stop(); }` },
            { label: "Down after three failures, once; up once on recovery", check: `const { createMonitor } = await load("monitor.js"); const hooks = service("https://hooks.example"); hooks.locals.received = []; const m = createMonitor({ url: "http://localhost:3000/health/ready", webhook: "https://hooks.example/alerts" }); m.start(); try { await advance(1000); dbDown(); const firstFailureAt = now() + 29000; await advance(31000); await advance(30000); eq(hooks.locals.received, [], "two failures: still nothing (a blip is not an outage)"); await advance(30000); eq(hooks.locals.received.length, 1, "the third failure sends one notification"); const down = hooks.locals.received[0]; eq([down.status, down.url, down.failures], ["down", "http://localhost:3000/health/ready", 3], "the down notification"); assert(Math.abs(Date.parse(down.since) - firstFailureAt) < 2000, "since: the time of the FIRST failure"); eq(m.state, "down", "state"); await advance(90000); eq(hooks.locals.received.length, 1, "no repeats while it stays down"); dbDown(false); await advance(30000); eq(hooks.locals.received.length, 2, "one notification when it is back"); const up = hooks.locals.received[1]; eq([up.status, m.state], ["up", "up"], "up"); assert(up.downtimeSeconds >= 175 && up.downtimeSeconds <= 185, "downtimeSeconds ≈ 180 (" + up.downtimeSeconds + ")"); } finally { m.stop(); dbDown(false); }` },
          ],
          hint: "Keep failures and firstFailure in the closure. In check(): on failure count it, remember the first failure's time, and notify exactly when failures === failuresBeforeAlert; on success, if state was down, notify up; then reset. start() uses setInterval(check, intervalMs).",
          successMessage: "The academy now finds out it is down within 90 seconds, from a single message, and learns exactly how long the outage lasted.",
        },
      },
      {
        id: "a-be-ex-incident-doc",
        title: "Exercise: document an incident response and recovery procedure",
        explain:
          "Write the procedure before the incident, when everyone is calm: how severe is severe, who does what, the first fifteen minutes step by step, how users and the business are told, and the recovery procedures (roll back, restore a backup, fail over). After each incident, a blameless postmortem records what happened and what will change, with owners and dates so it actually does.",
        nodeLab: {
          task:
            "Write INCIDENT-RESPONSE.md with sections ## Severity levels (SEV1, SEV2 and SEV3 defined), ## Roles (incident commander and communications), ## First 15 minutes (numbered steps), ## Communication (the status page and how often to update), ## Recovery procedures (rolling back a release, and restoring the database from a backup with pg_restore, including how to verify it). Then write postmortems/2026-10-27-payment-timeouts.md for Week 16's failed checkout (request req-b7c2): ## Summary, ## Impact, ## Timeline (times), ## Root cause, ## What went well, ## Action items (each with an owner and a date).",
          command: false,
          files: { "INCIDENT-RESPONSE.md": "# Incident response\n", "postmortems/README.md": "Blameless postmortems, one file per incident: YYYY-MM-DD-short-title.md.\n" },
          readOnly: ["postmortems/README.md"],
          open: "INCIDENT-RESPONSE.md",
          solution: {
            "INCIDENT-RESPONSE.md": `# Incident response

## Severity levels

- **SEV1**: the API is down or payments fail for most users, or data is lost or exposed. Page immediately, all hands, status page within 15 minutes.
- **SEV2**: a major feature is broken or badly degraded for many users (enrollment errors above 5%, p95 above 2 seconds). Page the on-call engineer; status page update.
- **SEV3**: a minor feature is broken or a few users are affected, with a workaround. Ticket for working hours, no page.

## Roles

- **Incident commander**: declares the incident and its severity, coordinates, decides on mitigation, keeps the timeline. Does not debug.
- **Communications**: updates the status page, support and stakeholders on the agreed schedule, so engineers are not interrupted.
- **Responders**: investigate and carry out the mitigation the commander decides.

## First 15 minutes

1. Acknowledge the alert and open the incident channel; name the incident commander.
2. Set the severity from the table above.
3. Check what changed: the last deploy, configuration changes, a provider's status page.
4. Mitigate first: roll back the last release, disable the feature flag, or scale up; do not wait for the root cause.
5. Post the first status page update.
6. Start the timeline in the channel: every action with its time.

## Communication

The communications lead posts on the status page within 15 minutes of a SEV1 or SEV2 and updates it every 30 minutes until it is resolved, even when there is nothing new, then posts a resolution note. Support gets the same wording. A SEV1 also notifies the business owner by phone.

## Recovery procedures

**Rolling back a release**: on the server run \`scripts/deploy.sh <previous tag>\` (the tag is in .deployed-tag history and in the pipeline), then watch /health/ready and the error-rate dashboard for ten minutes. Migrations are expand-and-contract, so the previous release works with the current schema.

**Restoring the database from a backup**: stop the API and worker (\`docker compose -f compose.prod.yaml stop api worker\`), restore the newest good dump into a new database with \`pg_restore --no-owner --dbname=academy_restore academy-<date>.dump\`, verify it (row counts of students, enrollments and payments against the last known numbers, and the newest created_at), point DATABASE_URL at it, start the services, and check /health/ready. Record the data-loss window (the time between the backup and the incident) in the incident log.
`,
            "postmortems/2026-10-27-payment-timeouts.md": `# Postmortem: checkout failures from payment timeouts, 27 October 2026

## Summary

For about seven minutes, checkouts failed with a 500 error because the payments provider stopped answering within our 2-second timeout and our API did not handle the resulting ProviderUnavailableError. Request req-b7c2 is the first recorded failure.

## Impact

About 40 checkout attempts failed (users saw "Something went wrong"); no customer was charged without an order, because each charge was retried with the same idempotency key. No data was lost.

## Timeline

- 09:14:03 first failed checkout (req-b7c2): three payment attempts time out.
- 09:16:10 HighErrorRate alert pages the on-call engineer.
- 09:18:00 incident declared (SEV2); the provider's status page shows degraded performance.
- 09:19:30 checkout is switched to a maintenance message with a feature flag.
- 09:21:00 the provider recovers; checkout is switched back on at 09:23.
- 09:40 status page resolution note posted.

## Root cause

The payments provider's API slowed to 4–6 seconds per request. Our client correctly timed out and retried, but after three attempts it threw ProviderUnavailableError, which the checkout route did not catch, so the generic error handler answered 500 instead of a clear 503 with Retry-After.

## What went well

- Request ids let us trace the failed checkout through every log line in minutes.
- Idempotency keys meant no double charges despite the retries.
- The HighErrorRate alert fired within two minutes.

## Action items

- Handle ProviderUnavailableError in checkout with 503 PAYMENT_PROVIDER_UNAVAILABLE and Retry-After. Owner: Ada Obi. Due: 2026-11-03.
- Add a circuit breaker around the payments client so an outage fails fast. Owner: Bayo Adeyemi. Due: 2026-11-10.
- Add an alert on payment provider latency (p95 above 1 second for 5 minutes). Owner: Ngozi Eze. Due: 2026-11-07.
`,
          },
          tests: [
            { label: "Severity levels and roles", check: `const md = file("INCIDENT-RESPONSE.md") || ""; const sev = section(md, "Severity levels"); for (const s of ["SEV1", "SEV2", "SEV3"]) has(sev, s, "## Severity levels defines " + s); assert(sev.split(/\\s+/).length >= 40, "## Severity levels: say what each level means and how fast to respond"); const roles = section(md, "Roles").toLowerCase(); has(roles, "incident commander", "## Roles: the incident commander"); assert(/communicat/.test(roles), "## Roles: communications");` },
            { label: "The first 15 minutes, communication and recovery", check: `const md = file("INCIDENT-RESPONSE.md") || ""; const first = section(md, "First 15 minutes"); assert((first.match(/^\\s*\\d+\\.\\s/gm) || []).length >= 4, "## First 15 minutes: at least four numbered steps"); assert(/mitigat|roll ?back/i.test(first), "## First 15 minutes: mitigate (roll back) before finding the root cause"); const comm = section(md, "Communication").toLowerCase(); has(comm, "status page", "## Communication: the status page"); assert(/\\d+\\s*minutes/.test(comm), "## Communication: how often to update"); const rec = section(md, "Recovery procedures"); assert(/roll(ing)? ?back/i.test(rec), "## Recovery procedures: rolling back a release"); has(rec, "pg_restore", "## Recovery procedures: restoring with pg_restore"); assert(/verif/i.test(rec), "## Recovery procedures: how to verify the restore");` },
            { label: "A blameless postmortem with owned action items", check: `const md = file("postmortems/2026-10-27-payment-timeouts.md") || ""; assert(md, "postmortems/2026-10-27-payment-timeouts.md"); for (const s of ["Summary", "Impact", "Timeline", "Root cause", "What went well", "Action items"]) assert(section(md, s).trim().length > 30, "## " + s); has(section(md, "Summary") + section(md, "Timeline"), "req-b7c2", "name the failed request"); assert((section(md, "Timeline").match(/\\b\\d{1,2}:\\d{2}/g) || []).length >= 3, "## Timeline: at least three timestamped entries"); const items = section(md, "Action items").split("\\n").filter((l) => /^\\s*[-*\\d]/.test(l)); assert(items.length >= 2, "at least two action items"); for (const l of items) { assert(/owner/i.test(l), "each action item has an owner: " + l.trim()); assert(/\\d{4}-\\d{2}-\\d{2}/.test(l), "each action item has a due date: " + l.trim()); }` },
          ],
          hint: "Write the response document as instructions to a tired person at 2 a.m.: short, numbered, with the actual commands. The postmortem's root cause can come from Week 16's diagnosis: the provider timed out and the error was not handled.",
          successMessage: "The next incident starts from a written plan, and the last one has turned into owned, dated improvements.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 144 · 20.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l144-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["20.P"],
    title: "Deliverable: A Monitored Application with an Operations Runbook",
    subtitle: "Measurements, alerts, backups and a plan",
    estimatedMinutes: 120,
    intro: "The deliverable makes the academy API operable: it exposes its metrics, reports its readiness, shuts down cleanly, and comes with a runbook that states its objectives, its alerts, its backups and its measured performance.",
    atoms: [
      {
        id: "a-be-operations",
        title: "An operable service",
        explain:
          "An operable service tells you how it is doing (metrics, health), behaves well when stopped (graceful shutdown), and is documented for the people who run it: what 'good' means (SLOs), what pages whom (alerts), how data is protected (backups, RPO and RTO, restore tests), and how fast it actually is (measured baselines to compare against after each change).",
        nodeLab: {
          task:
            "Wire the given pieces into server.js: the metrics middleware and GET /metrics (metrics.js), GET /health/live and GET /health/ready (503 when the database does not answer within a second, or while shutting down), and installShutdown (shutdown.js) for graceful shutdown. Then write RUNBOOK.md with ## Service level objectives (availability and latency targets with numbers), ## Alerts (each alert, its severity and what to do), ## Backups (schedule, retention, RPO and RTO, and how often restores are tested), ## Performance baseline (p50 and p95 in ms for GET /courses at a stated concurrency) and ## On-call.",
          db: `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL);\nINSERT INTO courses VALUES (1, 'BE-101'), (2, 'DB-101');\n`,
          files: {
            "package.json": PKG(),
            ".env": ENV,
            "db.js": DB_JS,
            "metrics.js": "", // filled below
            "shutdown.js": "",
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();

app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code FROM courses ORDER BY id")).rows }));

const server = app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`,
            "RUNBOOK.md": "# Course API runbook\n",
          },
          readOnly: ["package.json", ".env", "db.js", "metrics.js", "shutdown.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { metricsHandler, metricsMiddleware } from "./metrics.js";
import { installShutdown } from "./shutdown.js";

const app = express();
const state = { shuttingDown: false };
app.use(metricsMiddleware);

function within(promise, ms) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => (timer = setTimeout(() => reject(new Error("timeout")), ms)))]).finally(() => clearTimeout(timer));
}

app.get("/metrics", metricsHandler);
app.get("/health/live", (req, res) => res.set("Cache-Control", "no-store").json({ status: "ok" }));
app.get("/health/ready", async (req, res) => {
  let ready = !state.shuttingDown;
  if (ready) {
    try {
      await within(pool.query("SELECT 1"), 1000);
    } catch {
      ready = false;
    }
  }
  res.set("Cache-Control", "no-store").status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable" });
});

app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code FROM courses ORDER BY id")).rows }));

const server = app.listen(3000, () => console.log("Course API on http://localhost:3000"));
installShutdown({ server, pool, state });
`,
            "RUNBOOK.md": `# Course API runbook

## Service level objectives

- Availability: 99.9% of requests succeed (no 5xx) over a rolling 30 days, an error budget of about 43 minutes of full outage.
- Latency: 95% of GET requests complete within 300 ms and 99% within 1,000 ms, measured at the load balancer.

## Alerts

- **ApiDown** (page): Prometheus cannot scrape the API for 1 minute. Check the hosts and containers, then the last deploy; roll back if it correlates.
- **HighErrorRate** (page): more than 5% of requests fail with 5xx for 5 minutes. Look at the error logs by request id, roll back a recent deploy, check the database and the payment provider.
- **SlowRequests** (ticket): p95 above 500 ms for 10 minutes. Check Server-Timing and slow query logs during working hours.

## Backups

PostgreSQL is dumped with pg_dump -Fc every night at 02:00 Africa/Lagos and WAL is archived continuously. Retention: the newest backup of each of the last 7 days and of each of the 4 weeks before. RPO: 5 minutes (WAL); RTO: 1 hour. A restore into a scratch database is tested on the first Monday of every month and the result is recorded.

## Performance baseline

Measured with the 20.12 load-test tool against staging, GET /courses, 200 requests at a concurrency of 10: p50 18 ms, p95 42 ms, p99 61 ms, 480 requests per second, 0 errors. Re-measure after every change to the query or the cache, and compare.

## On-call

One engineer is on call per week (Monday 09:00 handover), reachable by phone through the paging service. Pages are acknowledged within 5 minutes; the incident response document describes what happens next. Every page that was not actionable gets a ticket to fix the alert.
`,
          },
          tests: [
            { label: "Metrics, liveness and readiness", check: `await get("/courses"); const m = (await get("/metrics")).text; assert(m.split("\\n").includes('http_requests_total{method="GET",route="/courses",status="200"} 1'), "GET /metrics counts GET /courses"); eq((await get("/health/live")).status, 200, "live"); eq((await get("/health/ready")).status, 200, "ready"); dbDown(); const down = await get("/health/ready"); const live = await get("/health/live"); dbDown(false); eq([down.status, live.status], [503, 200], "database down: not ready, still live");` },
            { label: "Graceful shutdown", check: `const slow = get("/courses"); await kill("SIGTERM"); eq((await slow).status, 200, "the in-flight request finishes"); await advance(6000); eq(exitCode(), 0, "exit 0"); has(stdout(), "shutdown complete", "installShutdown is wired in");` },
            { label: "The runbook", check: `const md = file("RUNBOOK.md") || ""; for (const s of ["Service level objectives", "Alerts", "Backups", "Performance baseline", "On-call"]) assert(section(md, s).trim().split(/\\s+/).length >= 20, "## " + s + " (20+ words)"); const slo = section(md, "Service level objectives"); assert(/\\d{2}(\\.\\d+)?%/.test(slo) && /\\d+\\s*ms/.test(slo), "## Service level objectives: an availability percentage and a latency target in ms"); const alerts = section(md, "Alerts"); assert(/page/i.test(alerts) && /ticket/i.test(alerts), "## Alerts: severities (page, ticket)"); const b = section(md, "Backups"); assert(/RPO/.test(b) && /RTO/.test(b), "## Backups: RPO and RTO"); assert(/restore/i.test(b) && /(test|tested)/i.test(b), "## Backups: how often restores are tested"); const perf = section(md, "Performance baseline"); assert(/p50\\D+\\d+\\s*ms/.test(perf) && /p95\\D+\\d+\\s*ms/.test(perf), "## Performance baseline: p50 and p95 in ms"); assert(/concurrency\\D+\\d+|\\d+\\s+concurrent/i.test(perf), "## Performance baseline: at what concurrency");` },
          ],
          hint: "app.use(metricsMiddleware) first; app.get(\"/metrics\", metricsHandler); a readiness route that checks state.shuttingDown and races SELECT 1 against a 1-second timer; keep the result of app.listen and pass it to installShutdown({ server, pool, state }).",
          successMessage: "The academy API now reports its own health and performance, survives restarts gracefully, and comes with the runbook an on-call engineer needs.",
        },
      },
    ],
    task: {
      title: "Week 20 deliverable: a monitored application with performance measurements, backups and a runbook",
      intro: "Make your own course API operable.",
      prompts: [
        "Add Server-Timing (or tracing) and fix the worst bottleneck you find; load-test your busiest list or search endpoint and record p50, p95 and throughput.",
        "Expose /metrics, connect it to Prometheus and Grafana (or your platform's monitoring), and add alerts for down, error rate and latency with runbook links.",
        "Implement graceful shutdown and readiness, and set up an external uptime check.",
        "Schedule backups with retention, perform and document a test restore, and write RUNBOOK.md and INCIDENT-RESPONSE.md.",
        "Checkpoint: you can show your service's latency under load, what alerts when it degrades, and how to bring it back after a failure.",
      ],
      closing: "Next: Phase 6, the capstone. Week 21 turns a project idea into a specification.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

// The deliverable's given pieces are the answers of earlier labs in this week.
{
  const lab = LESSONS.at(-1).atoms[0].nodeLab;
  const answer = (id) => LESSONS.flatMap((l) => l.atoms).find((a) => a.id === id).nodeLab.solution;
  lab.files["metrics.js"] = answer("a-be-metrics")["metrics.js"];
  lab.files["shutdown.js"] = answer("a-be-graceful-shutdown")["shutdown.js"];
}
