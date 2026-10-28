/**
 * BACKEND ENGINEERING · WEEK 12 · ADVANCED DATABASE DESIGN AND PERFORMANCE
 *
 * Curriculum 12.1 – 12.P. Index selection and composite indexes; EXPLAIN
 * ANALYZE; isolation anomalies; locking and deadlocks; offset and cursor
 * pagination; business constraints; backups and restoration; soft deletion
 * and audit records; database permissions (row-level security); Redis and
 * caching; four exercises; and a documented, optimized API with a backup
 * and restore procedure.
 *
 * Timings come from real PostgreSQL 18 (sessions w12-perf, w12-backup);
 * the concurrency duets are the RDBMS course's recordings of two real psql
 * sessions (db-helpers duet()). SQL labs check plans with EXPLAIN on
 * PostgreSQL (PGlite); backend labs fire concurrent requests at the API.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg, shown, term } from "./be-helpers.js";
import { ACADEMY, duet } from "./db-helpers.js";

export const SECTION_ID = "be-s12-db-performance";
const MODULE = "be-w12-db-performance";

const DUET_NOTE = "Two real psql sessions, A and B, on PostgreSQL 18, interleaved as shown (recorded for the RDBMS course).";

/** plan(query): EXPLAIN's text, for checks. */
const PLAN_FN = `CREATE FUNCTION plan(q text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE line text; result text := '';
BEGIN
  FOR line IN EXECUTE 'EXPLAIN ' || q LOOP result := result || line || E'\\n'; END LOOP;
  RETURN result;
END $$;
`;

const PG_PKG = pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js" }, deps: ["express", "pg"] });
const PG_ENV = "DATABASE_URL=postgresql://academy_app:app-password@localhost:5432/academy\n";
const PG_DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;
const LISTEN_JS = `app.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`;

/** 300,000 enrollments over 400 courses, for plans. */
const BIG_ENROLLMENTS = `CREATE TABLE enrollments (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id  integer NOT NULL,
  course_id   integer NOT NULL,
  status      text NOT NULL CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at timestamptz NOT NULL
);
INSERT INTO enrollments (student_id, course_id, status, enrolled_at)
SELECT 1 + (n::bigint * 7919) % 50000,
       1 + n % 400,
       (ARRAY['active', 'completed', 'dropped'])[1 + (n / 7) % 3],
       timestamptz '2026-01-01' + n * interval '97 seconds'
FROM generate_series(1, 300000) AS n;
ANALYZE enrollments;

${PLAN_FN}`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 84 · 12.1 – 12.2 · INDEX SELECTION AND EXPLAIN ANALYZE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l84-indexes",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2"],
    title: "Index Selection, Composite Indexes and EXPLAIN ANALYZE",
    subtitle: "Measuring before and after",
    estimatedMinutes: 65,
    intro: "Week 10 showed that an index changes a plan. This lesson chooses indexes for real query shapes and measures the effect, on a million rows, with EXPLAIN ANALYZE.",
    atoms: [
      {
        id: "a-be-composite-index",
        title: "Index selection and composite indexes",
        explain:
          "Design an index from the query, not the table: equality columns first (course_id = $1 AND status = $2), then the range or sort column (ORDER BY enrolled_at DESC). Such an index serves the WHERE and returns rows already in order, so there is no Sort step and LIMIT 20 stops after 20 index entries. A PARTIAL index (WHERE status = 'active') is smaller when queries always filter the same value. Every index slows writes and takes space (the recording below: 30 MB for one composite index on a million rows), so drop indexes no query uses (pg_stat_user_indexes shows idx_scan = 0).",
        example: shown("w12-perf", 'psql -d perf -c "\\di+ lesson_views*"'),
        sqlLab: {
          setup: BIG_ENROLLMENTS,
          task:
            "The course page runs: SELECT id, student_id, enrolled_at FROM enrollments WHERE course_id = 42 AND status = 'active' ORDER BY enrolled_at DESC LIMIT 20. Its plan scans and sorts. Create one index that lets PostgreSQL read just those 20 rows, already in order: no Seq Scan and no Sort in the plan.",
          starter: "EXPLAIN SELECT id, student_id, enrolled_at FROM enrollments WHERE course_id = 42 AND status = 'active' ORDER BY enrolled_at DESC LIMIT 20;\n",
          solution:
            "CREATE INDEX enrollments_course_status_time_idx ON enrollments (course_id, status, enrolled_at DESC);\n\nEXPLAIN SELECT id, student_id, enrolled_at FROM enrollments WHERE course_id = 42 AND status = 'active' ORDER BY enrolled_at DESC LIMIT 20;\n",
          checks: [
            { label: "The plan uses an index", assert: "SELECT plan($q$SELECT id, student_id, enrolled_at FROM enrollments WHERE course_id = 42 AND status = 'active' ORDER BY enrolled_at DESC LIMIT 20$q$) ~ 'Index Scan'", message: "The plan does not use an index scan yet." },
            { label: "…with no Sort step and no Seq Scan", assert: "SELECT plan($q$SELECT id, student_id, enrolled_at FROM enrollments WHERE course_id = 42 AND status = 'active' ORDER BY enrolled_at DESC LIMIT 20$q$) !~ 'Sort|Seq Scan'", message: "The plan still sorts or scans: put the equality columns first and enrolled_at (DESC) last." },
            { label: "One new index is enough", assert: "SELECT count(*) = 2 FROM pg_indexes WHERE tablename = 'enrollments'", message: "Create exactly one index (the primary key is the other)." },
          ],
          hint: "CREATE INDEX … ON enrollments (course_id, status, enrolled_at DESC); — or a partial index on (course_id, enrolled_at DESC) WHERE status = 'active'.",
          successMessage: "The index answers the WHERE and the ORDER BY at once: PostgreSQL walks 20 index entries and stops.",
        },
      },
      {
        id: "a-be-explain-analyze",
        title: "Reading query plans with EXPLAIN ANALYZE",
        explain:
          "EXPLAIN ANALYZE runs the query and shows, for each step, the estimate and the reality: (cost=… rows=21) (actual time=1.4..44.1 rows=16.67 loops=3). Read it from the innermost step out. Look for: a large gap between estimated and actual rows (stale statistics: ANALYZE the table); Rows Removed by Filter far larger than the rows returned (a missing index); Sort and Hash steps spilling to disk; loops multiplying a small cost. BUFFERS adds pages read (shared hit = from memory, read = from disk). Execution Time is the measurement to compare before and after a change; run it twice, since the first run warms the cache. Careful: ANALYZE really executes, so wrap writes in BEGIN … ROLLBACK.",
        example: shown("w12-perf", 'psql -d perf -c "EXPLAIN ANALYZE SELECT count(*) FROM lesson_views WHERE student_id = 4242;"'),
        terminalExercise: term("w12-perf", {
          only: [
            'psql -d perf -c "EXPLAIN ANALYZE SELECT count(*) FROM lesson_views WHERE student_id = 4242;"',
            'psql -d perf -c "CREATE INDEX lesson_views_student_idx ON lesson_views (student_id);"',
            'psql -d perf -c "EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM lesson_views WHERE student_id = 4242;"',
            'psql -d perf -c "\\di+ lesson_views*"',
          ],
          goal: "Measure how long the count really takes once the index exists, and how many pages it reads.",
          accept: ['psql -d perf -c "EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM lesson_views WHERE student_id = 4242;"'],
          near: [{ command: 'psql -d perf -c "EXPLAIN ANALYZE SELECT count(*) FROM lesson_views WHERE student_id = 4242;"', why: "That is the measurement before the index: a parallel Seq Scan reading 6,370 pages." }],
          hint: "EXPLAIN with both ANALYZE and BUFFERS, after creating the index.",
          success: "From about 88 ms and 6,370 pages to about 1 ms and 53 pages: the index turned 'read a million rows, keep 50' into 'read 50'.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 85 · 12.3 – 12.4 · ANOMALIES, LOCKS AND DEADLOCKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l85-concurrency",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.3", "12.4"],
    title: "Isolation Anomalies, Locking and Deadlocks",
    subtitle: "What happens when two requests touch the same rows",
    estimatedMinutes: 60,
    intro: "Week 11 introduced isolation levels. Here are the anomalies they allow, recorded in two real PostgreSQL sessions, and the locks and deadlocks that come with concurrent updates.",
    atoms: [
      {
        id: "a-be-anomalies",
        title: "Transactions and isolation anomalies",
        explain:
          "Anomalies are what one transaction can see of another's changes. A NON-REPEATABLE READ: the same SELECT, twice in one transaction, returns different values because another transaction committed in between (allowed at READ COMMITTED). A PHANTOM: a range query returns new rows the second time. A LOST UPDATE: two transactions read, compute and write, and one write erases the other. REPEATABLE READ gives the whole transaction one snapshot (no non-repeatable reads or phantoms in PostgreSQL); SERIALIZABLE additionally aborts transactions whose combined effect could not have happened one after the other (error 40001: retry). Choose per operation: READ COMMITTED with atomic UPDATEs covers most API writes.",
        example: `${DUET_NOTE}\n\nREAD COMMITTED (the default):\n${duet("non-repeatable-read")}\n\nREPEATABLE READ:\n${duet("repeatable-read")}`,
        decision: decide({
          scenario: "A report computes 'total paid' and then 'number of payments' with two SELECTs in one transaction, and the two numbers sometimes disagree because payments arrive in between.",
          question: "Which isolation level makes both SELECTs see the same data?",
          right: ["REPEATABLE READ: the whole transaction reads one snapshot", "BEGIN ISOLATION LEVEL REPEATABLE READ."],
          wrong: [
            ["READ COMMITTED, the default", "Each statement sees a new snapshot: that is the problem."],
            ["READ UNCOMMITTED", "PostgreSQL runs it as READ COMMITTED."],
            ["No transaction at all", "Worse: each statement is on its own."],
          ],
          at: 1,
          aftermath: "Read-only reports at REPEATABLE READ never block writers in PostgreSQL: snapshots are versions of rows (MVCC), not locks.",
        }),
      },
      {
        id: "a-be-deadlocks",
        title: "Locking, deadlocks and concurrent updates",
        explain:
          "An UPDATE or DELETE locks the rows it changes until the transaction ends; another transaction updating the same row WAITS. SELECT … FOR UPDATE takes the same lock when you must read before writing. A DEADLOCK is two transactions each waiting for a row the other holds: PostgreSQL detects it within deadlock_timeout (1 s) and aborts one (error 40P01) so the other can finish. Prevent it by locking rows in a CONSISTENT ORDER (always the lower id first), keeping transactions short (no HTTP calls inside them), and retrying the aborted one.",
        example: `${DUET_NOTE}\n\n${duet("deadlock")}`,
        decision: decide({
          scenario: "A transfer of a course seat between two students updates both students' rows. Transfer A→B locks A then B; at the same moment transfer B→A locks B then A. PostgreSQL aborts one with 'deadlock detected'.",
          question: "What is the standard fix?",
          right: ["Always lock the rows in the same order (for example by ascending id), and retry a transaction aborted with 40P01", "Same order: no cycle can form."],
          wrong: [
            ["Increase deadlock_timeout", "The deadlock still happens, only later."],
            ["Remove the transaction", "Loses atomicity; half-transfers appear."],
            ["Use LOCK TABLE on every request", "Serializes everything; the API crawls."],
          ],
          at: 0,
          aftermath: "Ordering by id is easy in code: const [first, second] = [a, b].sort((x, y) => x - y); then SELECT … FOR UPDATE them in that order.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 86 · 12.5 · PAGINATION STRATEGIES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l86-pagination",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.5"],
    title: "Pagination Strategies: Offset and Cursor-Based",
    subtitle: "Pages that stay fast and correct",
    estimatedMinutes: 60,
    intro: "Week 6's ?page=&limit= becomes OFFSET in SQL. It has two problems on large or busy tables, and cursor-based pagination solves both.",
    atoms: [
      {
        id: "a-be-cursor-pagination",
        title: "Offset and cursor-based pagination",
        explain:
          "OFFSET 900000 makes PostgreSQL read and discard 900,000 rows (228 ms in the recording, against 0.16 ms for the keyset query): pages get slower the deeper you go. Worse, if a row is inserted while a client pages through a feed, OFFSET shifts and the client sees a row twice (or misses one). CURSOR (keyset) pagination remembers where the last page ended and asks for what comes after it: WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20. The id breaks ties so the order is total. Give clients an opaque nextCursor (base64url of the last row's created_at and id) and null on the last page. The trade-off: no 'jump to page 37'.",
        example: shown("w12-perf", 'psql -d perf -c "EXPLAIN ANALYZE SELECT id, lesson_id FROM lesson_views ORDER BY id LIMIT 20 OFFSET 900000;"'),
        nodeLab: {
          task:
            "GET /announcements uses ?page with OFFSET. Change it to cursor pagination, newest first: ?limit (default 5, max 50) and ?cursor; answer { data: [{ id, title, createdAt }], nextCursor } where nextCursor is base64url of \"<createdAt ISO>|<id>\" of the last row, or null when there are no more rows. Order by created_at DESC, id DESC (several announcements share a timestamp). A malformed cursor → 400 INVALID_CURSOR. No OFFSET.",
          db: `CREATE TABLE announcements (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text NOT NULL,
  created_at timestamptz NOT NULL
);
-- 23 announcements; several share the same created_at.
INSERT INTO announcements (title, created_at)
SELECT 'Announcement ' || n, timestamptz '2026-06-01 09:00:00+00' + (n / 3) * interval '1 hour'
FROM generate_series(1, 23) AS n;
`,
          files: {
            "package.json": PG_PKG,
            ".env": PG_ENV,
            "db.js": PG_DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/announcements", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 5;
  const { rows } = await pool.query(
    'SELECT id, title, created_at AS "createdAt" FROM announcements ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, (page - 1) * limit]
  );
  res.json({ data: rows, page });
});

app.post("/announcements", async (req, res) => {
  const { rows } = await pool.query('INSERT INTO announcements (title, created_at) VALUES ($1, now()) RETURNING id, title, created_at AS "createdAt"', [req.body.title]);
  res.status(201).json({ data: rows[0] });
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

const encodeCursor = (row) => Buffer.from(\`\${row.createdAt.toISOString()}|\${row.id}\`).toString("base64url");
function decodeCursor(cursor) {
  const [at, id] = Buffer.from(String(cursor), "base64url").toString("utf8").split("|");
  const date = new Date(at);
  if (!id || !/^\\d+$/.test(id) || Number.isNaN(date.getTime())) return null;
  return { at: date, id: Number(id) };
}

app.get("/announcements", async (req, res) => {
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));
  const after = req.query.cursor ? decodeCursor(req.query.cursor) : null;
  if (req.query.cursor && !after) return res.status(400).json({ error: { code: "INVALID_CURSOR", message: "The cursor is not valid" } });
  // One row more than asked tells us whether another page exists.
  const { rows } = after
    ? await pool.query(
        'SELECT id, title, created_at AS "createdAt" FROM announcements WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT $3',
        [after.at, after.id, limit + 1]
      )
    : await pool.query('SELECT id, title, created_at AS "createdAt" FROM announcements ORDER BY created_at DESC, id DESC LIMIT $1', [limit + 1]);
  const data = rows.slice(0, limit);
  res.json({ data, nextCursor: rows.length > limit ? encodeCursor(data[data.length - 1]) : null });
});

app.post("/announcements", async (req, res) => {
  const { rows } = await pool.query('INSERT INTO announcements (title, created_at) VALUES ($1, now()) RETURNING id, title, created_at AS "createdAt"', [req.body.title]);
  res.status(201).json({ data: rows[0] });
});

${LISTEN_JS}`,
          },
          requests: [
            { label: "GET /announcements", method: "GET", path: "/announcements" },
            { label: "?limit=10", method: "GET", path: "/announcements?limit=10" },
            { label: "?cursor=nonsense", method: "GET", path: "/announcements?cursor=nonsense" },
          ],
          tests: [
            { label: "The first page: newest first, with a nextCursor", check: `const r = await get("/announcements"); eq(r.json.data.map((a) => a.title), ["Announcement 23", "Announcement 22", "Announcement 21", "Announcement 20", "Announcement 19"], "the 5 newest (ties broken by id, highest first)"); assert(typeof r.json.nextCursor === "string" && r.json.nextCursor.length > 0, "nextCursor should be a string");` },
            { label: "Following the cursors visits every row exactly once", check: `const seen = []; let cursor = null; for (let i = 0; i < 20; i++) { const r = await get("/announcements?limit=4" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : "")); seen.push(...r.json.data.map((a) => a.id)); cursor = r.json.nextCursor; if (!cursor) break; } eq(seen.length, 23, "23 announcements in all"); eq(new Set(seen).size, 23, "no duplicates"); eq(seen, [...seen].sort((a, b) => b - a), "newest first throughout"); eq(cursor, null, "the last page has nextCursor null");` },
            { label: "A new announcement does not shift the next page", check: `const p1 = await get("/announcements?limit=5"); await post("/announcements", { title: "Breaking news" }); const p2 = await get("/announcements?limit=5&cursor=" + encodeURIComponent(p1.json.nextCursor)); eq(p2.json.data.map((a) => a.title), ["Announcement 18", "Announcement 17", "Announcement 16", "Announcement 15", "Announcement 14"], "page 2 continues after page 1, with no repeats");` },
            { label: "A bad cursor → 400; no OFFSET left", check: `const r = await get("/announcements?cursor=nonsense"); eq([r.status, r.json?.error?.code], [400, "INVALID_CURSOR"], "?cursor=nonsense"); lacks(file("server.js").toUpperCase(), "OFFSET", "cursor pagination needs no OFFSET");` },
          ],
          hint: "Fetch limit + 1 rows: if you get the extra one, there is a next page. The WHERE for later pages is (created_at, id) < ($1, $2) with the cursor's two values. Buffer.from(text).toString(\"base64url\") encodes the cursor.",
          successMessage: "Each page is now an index lookup from where the last one ended: as fast at row 900,000 as at row 1, and a new announcement cannot make a client see one twice.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 87 · 12.6 · DATA INTEGRITY AND BUSINESS CONSTRAINTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l87-business-constraints",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.6"],
    title: "Data Integrity and Business Constraints",
    subtitle: "Rules that span columns and rows",
    estimatedMinutes: 50,
    intro: "Week 9's constraints guard single values. Business rules are subtler: 'one active enrollment per course, but re-enrolling after dropping is fine'; 'completed exactly when there is a completion date'. PostgreSQL can enforce those too.",
    atoms: [
      {
        id: "a-be-business-constraints",
        title: "Business constraints in the database",
        explain:
          "A PARTIAL UNIQUE INDEX enforces uniqueness only for some rows: CREATE UNIQUE INDEX … ON enrollments (student_id, course_id) WHERE status <> 'dropped' allows any number of dropped enrollments but only one live one. A CHECK can tie columns together: CHECK ((status = 'completed') = (completed_on IS NOT NULL)). An EXCLUDE constraint forbids overlaps (two bookings of the same room at the same time). Prefer these to application checks, which two concurrent requests can both pass.",
        sqlLab: {
          setup: `CREATE TABLE enrollments (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id   integer NOT NULL,
  course_id    integer NOT NULL,
  status       text NOT NULL CHECK (status IN ('active', 'completed', 'dropped')),
  completed_on date,
  score        integer
);
INSERT INTO enrollments (student_id, course_id, status, completed_on, score) VALUES
  (1, 1, 'dropped', NULL, NULL),
  (1, 1, 'active', NULL, NULL),
  (2, 1, 'completed', '2026-05-01', 88);
`,
          task:
            "Add three rules. (1) A student may have only one enrollment in a course that is not dropped (dropped ones may repeat): a partial unique index named enrollments_one_live_idx. (2) An enrollment is completed exactly when it has a completed_on: CHECK constraint enrollments_completed_date. (3) A score exists only for completed enrollments, between 0 and 100: CHECK constraint enrollments_score_rule.",
          starter: "",
          solution:
            "CREATE UNIQUE INDEX enrollments_one_live_idx ON enrollments (student_id, course_id) WHERE status <> 'dropped';\n\nALTER TABLE enrollments\n  ADD CONSTRAINT enrollments_completed_date CHECK ((status = 'completed') = (completed_on IS NOT NULL)),\n  ADD CONSTRAINT enrollments_score_rule CHECK (score IS NULL OR (status = 'completed' AND score BETWEEN 0 AND 100));\n",
          checks: [
            { label: "Re-enrolling after dropping is allowed", accepts: "INSERT INTO enrollments (student_id, course_id, status) VALUES (3, 2, 'dropped'), (3, 2, 'dropped'), (3, 2, 'active')" },
            { label: "A second live enrollment is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status) VALUES (1, 1, 'active')", code: "23505" },
            { label: "Completed without a date is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status) VALUES (4, 1, 'completed')", error: "enrollments_completed_date" },
            { label: "A date on an active enrollment is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status, completed_on) VALUES (5, 1, 'active', '2026-05-01')", error: "enrollments_completed_date" },
            { label: "A score on an active enrollment, or above 100, is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status, score) VALUES (6, 1, 'active', 70)", error: "enrollments_score_rule" },
            { label: "…and above 100", rejects: "INSERT INTO enrollments (student_id, course_id, status, completed_on, score) VALUES (7, 1, 'completed', '2026-05-02', 101)", error: "enrollments_score_rule" },
            { label: "A correct completion is accepted", accepts: "INSERT INTO enrollments (student_id, course_id, status, completed_on, score) VALUES (8, 1, 'completed', '2026-05-03', 75)" },
            { label: "The live-enrollment index is partial", assert: "SELECT indexdef ~* 'WHERE' AND indexdef ~* 'UNIQUE' FROM pg_indexes WHERE indexname = 'enrollments_one_live_idx'" },
          ],
          hint: "CREATE UNIQUE INDEX name ON enrollments (student_id, course_id) WHERE status <> 'dropped'; and CHECK ((status = 'completed') = (completed_on IS NOT NULL)).",
          successMessage: "Three business rules that hold for every writer, including two requests racing each other.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 88 · 12.7 – 12.8 · BACKUPS, SOFT DELETION AND AUDIT RECORDS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l88-backups-audit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["12.7", "12.8"],
    title: "Backups, Restoration, Soft Deletion and Audit Records",
    subtitle: "Getting data back, and knowing who changed it",
    estimatedMinutes: 70,
    intro: "Every database will one day lose data: a bug, a DELETE without WHERE, a failed disk. Backups bring it back; soft deletion and audit records often mean you never need them.",
    atoms: [
      {
        id: "a-be-backups",
        title: "Database backups and restoration",
        explain:
          "pg_dump -F c -f academy.dump writes a consistent snapshot of one database in the compressed custom format; pg_restore -d target academy.dump restores it, all of it or parts (--table=payments, --data-only, --schema-only); pg_restore -l lists the contents. Restore into a NEW database first and check it, rather than over the damaged one. Production adds continuous archiving (WAL) for point-in-time recovery, which managed PostgreSQL services provide. A backup you have never restored is a hope, not a backup: schedule restore tests. The recording: a DELETE without WHERE, then two ways back.",
        example: shown("w12-backup", 'psql -d academy -c "DELETE FROM payments;"'),
        terminalExercise: term("w12-backup", {
          only: [
            "pg_dump -d academy -F c -f academy.dump",
            "pg_restore -l academy.dump | head -n 12",
            "createdb academy_restored",
            "pg_restore -d academy_restored academy.dump",
            "pg_restore -d academy --data-only --table=payments academy.dump",
            'psql -d academy -c "SELECT count(*) AS payments, sum(amount) AS total FROM payments;"',
          ],
          goal: "Put the deleted payments back into the academy database itself, without touching its other tables.",
          accept: ["pg_restore -d academy --data-only --table=payments academy.dump"],
          near: [{ command: "pg_restore -d academy_restored academy.dump", why: "That restores everything into a separate database: good for checking a backup, but the academy database still has no payments." }],
          hint: "pg_restore into academy, only the data, only the payments table.",
          success: "19 payments, ₦880,000, back in place. The academy_restored copy proved the backup was good before anything touched the real database.",
        }),
      },
      {
        id: "a-be-soft-delete-audit",
        title: "Soft deletion and audit records",
        explain:
          "SOFT DELETION marks a row deleted (deleted_at timestamptz) instead of removing it: recoverable, and references stay valid. Queries must then exclude deleted rows everywhere; a view (live_courses) or a partial index helps, and unique constraints usually become partial (WHERE deleted_at IS NULL). AUDIT RECORDS answer 'who changed this, when, from what to what?': an append-only audit table filled by a TRIGGER, a function PostgreSQL runs on every INSERT, UPDATE or DELETE, so no code path can forget it. Store old and new rows as jsonb (to_jsonb(OLD), to_jsonb(NEW)).",
        sqlLab: {
          setup: `CREATE TABLE courses (
  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code  text NOT NULL UNIQUE,
  title text NOT NULL,
  price integer NOT NULL
);
INSERT INTO courses (code, title, price) VALUES ('BE-101', 'Backend Engineering', 120000), ('DB-101', 'Relational Databases', 80000), ('WD-201', 'React Development', 90000);
`,
          task:
            "(1) Soft deletion: add deleted_at (timestamptz, NULL by default) to courses and create the view live_courses (the courses with no deleted_at). (2) Audit: create audit_log (id identity primary key, table_name text, action text, row_id integer, old_row jsonb, new_row jsonb, changed_at timestamptz default now()) and a trigger courses_audit that, after every UPDATE or DELETE on courses, inserts the table name, TG_OP, the row's id, to_jsonb(OLD) and to_jsonb(NEW) (NULL for deletes).",
          starter: "ALTER TABLE courses ADD COLUMN deleted_at timestamptz;\n",
          solution:
            "ALTER TABLE courses ADD COLUMN deleted_at timestamptz;\n\nCREATE VIEW live_courses AS\nSELECT * FROM courses WHERE deleted_at IS NULL;\n\nCREATE TABLE audit_log (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  table_name text NOT NULL,\n  action     text NOT NULL,\n  row_id     integer NOT NULL,\n  old_row    jsonb,\n  new_row    jsonb,\n  changed_at timestamptz NOT NULL DEFAULT now()\n);\n\nCREATE FUNCTION audit_courses() RETURNS trigger LANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO audit_log (table_name, action, row_id, old_row, new_row)\n  VALUES (TG_TABLE_NAME, TG_OP, OLD.id, to_jsonb(OLD), CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END);\n  RETURN NULL;\nEND $$;\n\nCREATE TRIGGER courses_audit\nAFTER UPDATE OR DELETE ON courses\nFOR EACH ROW EXECUTE FUNCTION audit_courses();\n",
          checks: [
            { label: "Soft-deleting hides a course from live_courses", accepts: "UPDATE courses SET deleted_at = now() WHERE code = 'WD-201'" },
            { label: "…but keeps it in courses", query: "SELECT (SELECT array_agg(code ORDER BY code) FROM live_courses) AS live, (SELECT count(*) FROM courses) AS stored" },
            { label: "A price change is audited with the old and new rows", query: "UPDATE courses SET price = 95000 WHERE code = 'DB-101'; SELECT table_name, action, old_row->>'price' AS old_price, new_row->>'price' AS new_price FROM audit_log WHERE row_id = 2 ORDER BY id" },
            { label: "A hard delete is audited too", query: "DELETE FROM courses WHERE code = 'BE-101'; SELECT action, old_row->>'code' AS code, new_row IS NULL AS no_new_row FROM audit_log WHERE action = 'DELETE'" },
            { label: "The trigger is on courses", assert: "SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'courses_audit' AND tgrelid = 'courses'::regclass)" },
          ],
          hint: "The trigger function inserts into audit_log using TG_TABLE_NAME, TG_OP, OLD.id, to_jsonb(OLD) and, unless TG_OP = 'DELETE', to_jsonb(NEW); an AFTER trigger returns NULL.",
          successMessage: "Deleted courses can come back, and every change to courses leaves a record, whichever program made it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 89 · 12.9 – 12.10 · PERMISSIONS AND CACHING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l89-permissions-cache",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["12.9", "12.10"],
    title: "Database Access Permissions and Caching with Redis",
    subtitle: "Who sees which rows, and what not to ask the database twice",
    estimatedMinutes: 75,
    intro: "Two last tools before Phase 4: row-level security, so the database itself limits which rows a user's queries can see, and a cache, so the database is not asked the same question a thousand times a minute.",
    atoms: [
      {
        id: "a-be-row-security",
        title: "Database access permissions",
        explain:
          "Week 10's GRANTs decide which TABLES a role may use. ROW-LEVEL SECURITY decides which ROWS: ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY, then CREATE POLICY … USING (condition) — every query by a non-owner role gets that condition added, whatever SQL it sends. The API tells PostgreSQL who the current user is per transaction (SET LOCAL app.instructor_id = '7', read with current_setting('app.instructor_id')), so even a buggy query in the API cannot read another tenant's rows. Superusers and table owners bypass RLS unless FORCE ROW LEVEL SECURITY: test policies as the API's real role.",
        sqlLab: {
          setup: `CREATE TABLE courses (id integer PRIMARY KEY, code text NOT NULL, instructor_id integer NOT NULL);
CREATE TABLE enrollments (id integer PRIMARY KEY, course_id integer NOT NULL REFERENCES courses (id), student_email text NOT NULL);
INSERT INTO courses VALUES (1, 'BE-101', 7), (2, 'DB-101', 7), (3, 'WD-201', 9);
INSERT INTO enrollments VALUES (1, 1, 'ada@example.com'), (2, 1, 'bayo@example.com'), (3, 2, 'chi@example.com'), (4, 3, 'dayo@example.com'), (5, 3, 'efe@example.com');
CREATE ROLE instructor_app;
GRANT SELECT ON courses, enrollments TO instructor_app;
`,
          task:
            "Instructors use the API through the role instructor_app, which sets app.instructor_id for each request. Enable row-level security on enrollments and create the policy instructor_sees_own_courses so that instructor_app sees only the enrollments of courses whose instructor_id equals current_setting('app.instructor_id')::integer.",
          starter: "",
          solution:
            "ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY instructor_sees_own_courses ON enrollments\n  FOR SELECT\n  TO instructor_app\n  USING (course_id IN (SELECT id FROM courses WHERE instructor_id = current_setting('app.instructor_id')::integer));\n",
          checks: [
            { label: "Instructor 7 sees only BE-101 and DB-101 students", query: "SET ROLE instructor_app; SET app.instructor_id = '7'; SELECT student_email FROM enrollments ORDER BY id" },
            { label: "Instructor 9 sees only WD-201 students", query: "SET ROLE instructor_app; SET app.instructor_id = '9'; SELECT student_email FROM enrollments ORDER BY id" },
            { label: "An unknown instructor sees nothing", query: "SET ROLE instructor_app; SET app.instructor_id = '42'; SELECT count(*) AS visible FROM enrollments" },
            { label: "Row-level security is on, with the named policy", assert: "SELECT relrowsecurity AND EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'instructor_sees_own_courses' AND tablename = 'enrollments') FROM pg_class WHERE relname = 'enrollments'" },
          ],
          hint: "ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY; CREATE POLICY name ON enrollments FOR SELECT TO instructor_app USING (course_id IN (SELECT id FROM courses WHERE instructor_id = current_setting('app.instructor_id')::integer));",
          successMessage: "The same SELECT returns different rows for different instructors, decided by PostgreSQL. A forgotten WHERE in the API can no longer leak another instructor's students.",
        },
      },
      {
        id: "a-be-redis-cache",
        title: "Introduction to Redis and when to use a cache",
        explain:
          "REDIS is an in-memory data store: GET and SET in well under a millisecond, with expiry (SET key value EX 60). A CACHE keeps answers to expensive, frequently repeated, rarely changing questions (the course catalogue; not a bank balance). CACHE-ASIDE: on a read, try Redis; on a miss, query PostgreSQL, store the answer with a TTL, return it; on a write, DELETE the cached key so the next read is fresh. Caches add a second copy that can be stale, so use them only after measuring a real need, and always set a TTL. With node-redis: const redis = createClient({ url: process.env.REDIS_URL }); await redis.connect(). Week 18 adds rate limiting and queues on Redis.",
        nodeLab: {
          task:
            "Cache GET /courses in Redis (cache-aside): use the key courses:all, stored as JSON for 60 seconds. Send X-Cache: HIT when the answer came from Redis and X-Cache: MISS when it came from PostgreSQL. POST /courses must delete the key so the next GET is fresh.",
          db: `CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL);
INSERT INTO courses (code, title) VALUES ('BE-101', 'Backend Engineering'), ('DB-101', 'Relational Databases');
`,
          redis: true,
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js" }, deps: ["express", "pg", "redis"] }),
            ".env": `${PG_ENV}REDIS_URL=redis://localhost:6379\n`,
            "db.js": `${PG_DB_JS}`,
            "cache.js": `import { createClient } from "redis";

export const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (err) => console.error("Redis:", err.message));
await redis.connect();
`,
            "server.js": `import express from "express";
import { redis } from "./cache.js";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/courses", async (req, res) => {
  const { rows } = await pool.query("SELECT id, code, title FROM courses ORDER BY id");
  res.json({ data: rows });
});

app.post("/courses", async (req, res) => {
  const { rows } = await pool.query("INSERT INTO courses (code, title) VALUES ($1, $2) RETURNING id, code, title", [req.body.code, req.body.title]);
  res.status(201).json({ data: rows[0] });
});

${LISTEN_JS}`,
          },
          readOnly: ["package.json", ".env", "db.js", "cache.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { redis } from "./cache.js";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

const KEY = "courses:all";

app.get("/courses", async (req, res) => {
  const cached = await redis.get(KEY);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.json({ data: JSON.parse(cached) });
  }
  const { rows } = await pool.query("SELECT id, code, title FROM courses ORDER BY id");
  await redis.set(KEY, JSON.stringify(rows), { EX: 60 });
  res.set("X-Cache", "MISS");
  res.json({ data: rows });
});

app.post("/courses", async (req, res) => {
  const { rows } = await pool.query("INSERT INTO courses (code, title) VALUES ($1, $2) RETURNING id, code, title", [req.body.code, req.body.title]);
  await redis.del(KEY); // the next GET reads PostgreSQL again
  res.status(201).json({ data: rows[0] });
});

${LISTEN_JS}`,
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "WD-201", title: "React Development" } },
          ],
          tests: [
            { label: "The first GET is a MISS and fills the cache", check: `const r = await get("/courses"); eq(r.headers["x-cache"], "MISS", "X-Cache on the first request"); eq(r.json.data.map((c) => c.code), ["BE-101", "DB-101"], "the courses"); assert(redisKeys().includes("courses:all"), "the key courses:all should be in Redis");` },
            { label: "The next GET is a HIT, without asking PostgreSQL", check: `await get("/courses"); await sql("UPDATE courses SET title = 'Changed behind the cache' WHERE code = 'BE-101'"); const r = await get("/courses"); eq(r.headers["x-cache"], "HIT", "X-Cache"); eq(r.json.data[0].title, "Backend Engineering", "a HIT answers from Redis (so it does not see a change made directly in the database)");` },
            { label: "The cache expires after 60 seconds", check: `await advance(61 * 1000); const r = await get("/courses"); eq(r.headers["x-cache"], "MISS", "after 61 seconds"); eq(r.json.data[0].title, "Changed behind the cache", "fresh data from PostgreSQL");` },
            { label: "POST invalidates the cached list", check: `await get("/courses"); eq((await post("/courses", { code: "WD-201", title: "React Development" })).status, 201, "POST"); const r = await get("/courses"); eq(r.headers["x-cache"], "MISS", "the GET after a POST"); assert(r.json.data.some((c) => c.code === "WD-201"), "the new course is listed");` },
          ],
          hint: "const cached = await redis.get(\"courses:all\"); if (cached) … JSON.parse; else query, then redis.set(\"courses:all\", JSON.stringify(rows), { EX: 60 }). In POST: await redis.del(\"courses:all\").",
          successMessage: "Most GETs now never reach PostgreSQL, a write makes the next read fresh, and the TTL bounds how stale anything can be.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 90 · 12.11 – 12.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l90-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["12.11", "12.12", "12.13", "12.14"],
    title: "Exercises: Fast, Unique, Concurrent, Recoverable",
    subtitle: "Four incidents from a busy academy",
    estimatedMinutes: 150,
    intro: "Each exercise starts from a real kind of incident: a slow page, duplicate records, an overbooked course, and lost data.",
    atoms: [
      {
        id: "a-be-ex-slow-search",
        title: "Exercise: optimize a slow search endpoint",
        explain:
          "Two common causes of a slow search: a function on the column (lower(title) LIKE 'intro%') makes a plain index on title useless, so index the EXPRESSION (lower(title) text_pattern_ops, the operator class that serves LIKE prefixes); and a filter that is always the same (published = true) is a candidate for a PARTIAL index, smaller and faster. Measure with the plan before and after.",
        sqlLab: {
          setup: `CREATE TABLE courses (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title         text NOT NULL,
  instructor_id integer NOT NULL,
  published     boolean NOT NULL,
  created_at    timestamptz NOT NULL
);
INSERT INTO courses (title, instructor_id, published, created_at)
SELECT (ARRAY['Intro to ', 'Advanced ', 'Practical ', 'Applied '])[1 + n % 4] || (ARRAY['SQL', 'Node.js', 'React', 'Security', 'Data'])[1 + (n / 4) % 5] || ' ' || n,
       1 + n % 2000,
       n % 10 <> 0,
       timestamptz '2025-01-01' + n * interval '5 minutes'
FROM generate_series(1, 200000) AS n;
ANALYZE courses;

${PLAN_FN}`,
          task:
            "The search endpoint runs two queries that both scan 200,000 rows:\n  (a) SELECT id, title FROM courses WHERE lower(title) LIKE 'intro to sql%' ORDER BY id LIMIT 20;\n  (b) SELECT id, title FROM courses WHERE instructor_id = 77 AND published ORDER BY created_at DESC LIMIT 20;\nCreate the indexes that make both plans use an index instead of a Seq Scan: an expression index for (a) and a partial index for (b).",
          starter: "EXPLAIN SELECT id, title FROM courses WHERE lower(title) LIKE 'intro to sql%' ORDER BY id LIMIT 20;\n",
          solution:
            "CREATE INDEX courses_title_lower_idx ON courses (lower(title) text_pattern_ops);\nCREATE INDEX courses_instructor_published_idx ON courses (instructor_id, created_at DESC) WHERE published;\n\nEXPLAIN SELECT id, title FROM courses WHERE lower(title) LIKE 'intro to sql%' ORDER BY id LIMIT 20;\n",
          checks: [
            { label: "(a) the prefix search uses an index", assert: "SELECT plan($q$SELECT id, title FROM courses WHERE lower(title) LIKE 'intro to sql%' ORDER BY id LIMIT 20$q$) !~ 'Seq Scan'", message: "(a) still scans the table: index lower(title) with text_pattern_ops." },
            { label: "(b) the instructor's page uses an index, with no Sort", assert: "SELECT plan($q$SELECT id, title FROM courses WHERE instructor_id = 77 AND published ORDER BY created_at DESC LIMIT 20$q$) !~ 'Seq Scan|Sort'", message: "(b) scans or sorts: index (instructor_id, created_at DESC) WHERE published." },
            { label: "(b)'s index is partial", assert: "SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'courses' AND indexdef ~* 'instructor_id' AND indexdef ~* 'WHERE')" },
            { label: "(a)'s index is on the expression", assert: "SELECT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'courses' AND indexdef ~* 'lower\\(title\\)')" },
          ],
          hint: "CREATE INDEX … ON courses (lower(title) text_pattern_ops); CREATE INDEX … ON courses (instructor_id, created_at DESC) WHERE published;",
          successMessage: "Both queries now read a handful of index entries. The partial index skips unpublished courses entirely, so it is also smaller than a full one.",
        },
      },
      {
        id: "a-be-ex-duplicates",
        title: "Exercise: prevent duplicate enrollments",
        explain:
          "A double-click enrolled some students twice, because the table had no unique constraint. Fixing it takes two steps, in order: remove the duplicates (keep the earliest enrollment of each pair: DELETE … USING with a self-join, or ROW_NUMBER() OVER (PARTITION BY …)), then add the constraint, which fails while duplicates remain. Payments may point at duplicates: move them to the kept row first.",
        sqlLab: {
          setup: `CREATE TABLE enrollments (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id  integer NOT NULL,
  course_id   integer NOT NULL,
  enrolled_at timestamptz NOT NULL
);
CREATE TABLE payments (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enrollment_id integer NOT NULL REFERENCES enrollments (id),
  amount        integer NOT NULL
);
INSERT INTO enrollments (student_id, course_id, enrolled_at) VALUES
  (1, 1, '2026-03-01 10:00:00+00'), (1, 1, '2026-03-01 10:00:01+00'),
  (2, 1, '2026-03-02 09:00:00+00'),
  (2, 2, '2026-03-02 09:05:00+00'), (2, 2, '2026-03-02 09:05:01+00'), (2, 2, '2026-03-02 09:05:02+00'),
  (3, 2, '2026-03-03 12:00:00+00');
INSERT INTO payments (enrollment_id, amount) VALUES (2, 120000), (4, 80000), (7, 80000);
`,
          task:
            "Remove the duplicate enrollments, keeping the earliest of each (student_id, course_id); first move their payments to the kept enrollment. Then add the constraint enrollments_student_course_key: UNIQUE (student_id, course_id).",
          starter: "",
          solution:
            "-- Point payments at the earliest enrollment of the same student and course.\nUPDATE payments p\nSET enrollment_id = keep.id\nFROM enrollments dup\nJOIN LATERAL (\n  SELECT e.id FROM enrollments e\n  WHERE e.student_id = dup.student_id AND e.course_id = dup.course_id\n  ORDER BY e.enrolled_at, e.id\n  LIMIT 1\n) keep ON true\nWHERE p.enrollment_id = dup.id AND keep.id <> dup.id;\n\n-- Delete every enrollment that has an earlier twin.\nDELETE FROM enrollments e\nUSING enrollments earlier\nWHERE earlier.student_id = e.student_id\n  AND earlier.course_id = e.course_id\n  AND (earlier.enrolled_at, earlier.id) < (e.enrolled_at, e.id);\n\nALTER TABLE enrollments ADD CONSTRAINT enrollments_student_course_key UNIQUE (student_id, course_id);\n",
          checks: [
            { label: "The earliest enrollment of each pair is kept", query: "SELECT id, student_id, course_id FROM enrollments ORDER BY id", ordered: true },
            { label: "Every payment still belongs to an enrollment of the same student and course", query: "SELECT p.amount, e.student_id, e.course_id FROM payments p JOIN enrollments e ON e.id = p.enrollment_id ORDER BY p.id", ordered: true },
            { label: "The constraint now refuses duplicates", rejects: "INSERT INTO enrollments (student_id, course_id, enrolled_at) VALUES (1, 1, now())", error: "enrollments_student_course_key" },
          ],
          hint: "Payments first (UPDATE … FROM, setting enrollment_id to the earliest twin's id), then DELETE … USING enrollments earlier WHERE same pair AND earlier comes first, then ALTER TABLE … ADD CONSTRAINT … UNIQUE (student_id, course_id).",
          successMessage: "Four duplicates gone, no payment lost, and a constraint so a double-click can never do it again: the API will get a 23505 and answer 409.",
        },
      },
      {
        id: "a-be-ex-concurrent",
        title: "Exercise: handle concurrent course enrollment",
        explain:
          "The bug: read the seats, check them in JavaScript, write the new number. Ten requests arriving together all read the same number. The checks really send concurrent requests. The fix is to make the check and the change one atomic statement (UPDATE … SET seats = seats - 1 WHERE id = $1 AND seats > 0 RETURNING seats), inside the transaction that also creates the enrollment.",
        nodeLab: {
          task:
            "POST /courses/:id/enroll { studentId } oversells: ten students arriving together for 3 seats all get in. Make it correct under concurrency: take the seat with one atomic UPDATE (WHERE seats > 0), create the enrollment in the same transaction, and answer 409 COURSE_FULL when no seat was taken (201 { data: { seatsLeft } } otherwise).",
          db: `CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, seats integer NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer NOT NULL, course_id integer NOT NULL REFERENCES courses (id), UNIQUE (student_id, course_id));
INSERT INTO courses (code, seats) VALUES ('BE-101', 3), ('DB-101', 30);
`,
          files: {
            "package.json": PG_PKG,
            ".env": PG_ENV,
            "db.js": PG_DB_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.post("/courses/:id/enroll", async (req, res) => {
  const courseId = Number(req.params.id);
  const { rows } = await pool.query("SELECT seats FROM courses WHERE id = $1", [courseId]);
  if (rows[0].seats <= 0) return res.status(409).json({ error: { code: "COURSE_FULL", message: "No seats left" } });
  await pool.query("UPDATE courses SET seats = $2 WHERE id = $1", [courseId, rows[0].seats - 1]);
  await pool.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)", [req.body.studentId, courseId]);
  res.status(201).json({ data: { seatsLeft: rows[0].seats - 1 } });
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

app.post("/courses/:id/enroll", async (req, res) => {
  const courseId = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // The check and the change in one statement: no two requests can take the same seat.
    const seat = await client.query("UPDATE courses SET seats = seats - 1 WHERE id = $1 AND seats > 0 RETURNING seats", [courseId]);
    if (seat.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: { code: "COURSE_FULL", message: "No seats left" } });
    }
    await client.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)", [req.body.studentId, courseId]);
    await client.query("COMMIT");
    res.status(201).json({ data: { seatsLeft: seat.rows[0].seats } });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

${LISTEN_JS}`,
          },
          requests: [{ label: "POST enroll", method: "POST", path: "/courses/1/enroll", body: { studentId: 1 } }],
          tests: [
            { label: "Ten students at once for 3 seats: exactly 3 get in", check: `const rs = await together(...Array.from({ length: 10 }, (_, i) => post("/courses/1/enroll", { studentId: i + 1 }))); eq(rs.filter((r) => r.status === 201).length, 3, "three 201 answers"); eq(rs.filter((r) => r.status === 409).length, 7, "seven 409 COURSE_FULL answers"); eq(await sql("SELECT (SELECT seats FROM courses WHERE id = 1) AS seats, (SELECT count(*)::int FROM enrollments WHERE course_id = 1) AS enrolled"), [{ seats: 0, enrolled: 3 }], "0 seats left and 3 enrollments");` },
            { label: "seatsLeft counts down correctly under concurrency", check: `const rs = await together(...Array.from({ length: 5 }, (_, i) => post("/courses/2/enroll", { studentId: 100 + i }))); eq(rs.map((r) => r.json.data?.seatsLeft).sort((a, b) => a - b), [25, 26, 27, 28, 29], "five different seat counts, one per request"); eq(await sql("SELECT seats FROM courses WHERE id = 2"), [{ seats: 25 }], "25 seats left");` },
            { label: "A failed enrollment gives its seat back", check: `const r = await post("/courses/2/enroll", { studentId: 100 }); assert(r.status >= 400, "a duplicate enrollment fails"); eq(await sql("SELECT seats FROM courses WHERE id = 2"), [{ seats: 25 }], "the seat taken before the duplicate insert failed was rolled back");` },
          ],
          hint: "In a transaction on one client: UPDATE courses SET seats = seats - 1 WHERE id = $1 AND seats > 0 RETURNING seats; if rowCount is 0, ROLLBACK and answer 409; otherwise insert the enrollment and COMMIT.",
          successMessage: "Ten at once, three seats, three enrollments, every time. The read-then-write version let all ten in.",
        },
      },
      {
        id: "a-be-ex-restore",
        title: "Exercise: restore a database from backup",
        explain:
          "A restore drill: take the backup, restore it into a NEW database, and verify it against what you expect (row counts, totals) before using it. Only then repair the live database, or switch the application to the restored one. Write down every command: in a real incident, the runbook is what you follow.",
        terminalExercise: term("w12-backup", {
          only: [
            "pg_dump -d academy -F c -f academy.dump",
            'psql -d academy -c "DELETE FROM payments;"',
            "createdb academy_restored",
            "pg_restore -d academy_restored academy.dump",
            'psql -d academy_restored -c "SELECT count(*) AS payments, sum(amount) AS total FROM payments;"',
          ],
          goal: "Restore the whole backup into the empty database academy_restored, to check it before touching the damaged one.",
          accept: ["pg_restore -d academy_restored academy.dump"],
          near: [{ command: "createdb academy_restored", why: "That creates the empty database to restore into; the restore comes next." }],
          hint: "pg_restore, with -d naming the new database, and the dump file.",
          success: "The restored copy has all 19 payments (₦880,000): the backup is good, and the live database can be repaired from it with confidence.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 91 · 12.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l91-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["12.P"],
    title: "Deliverable: Documented Performance and a Backup Procedure",
    subtitle: "Evidence, not opinions",
    estimatedMinutes: 90,
    intro: "Performance work is only finished when it is written down with measurements, and a backup is only real when its restore is written down and tested. The deliverable is those two documents for your course API.",
    atoms: [
      {
        id: "a-be-perf-doc",
        title: "Documenting performance work and recovery",
        explain:
          "A performance note per change: the slow endpoint and its query; the plan and Execution Time BEFORE (EXPLAIN ANALYZE output); the change (the index, the rewritten query); the plan and time AFTER; and the cost (index size, slower writes). A backup runbook: what is backed up, how often and where (pg_dump -F c nightly, kept 14 days, off the server); the exact restore commands; how the restore is verified (row counts, totals); and when it was last tested. Both live in the repository next to the code.",
        nodeLab: {
          task:
            "Write PERFORMANCE.md and BACKUP.md. PERFORMANCE.md: a ## section per optimization (at least two), each with Before and After execution times in ms from EXPLAIN ANALYZE (for example the recordings of this week), the change (a CREATE INDEX), and its cost. BACKUP.md: ## Backup (with the pg_dump command and the schedule), ## Restore (pg_restore commands, restoring into a new database first), ## Verification (what you count or sum to check the restore) and ## Last tested (a date).",
          command: false,
          files: { "PERFORMANCE.md": "# Performance\n", "BACKUP.md": "# Backup and restore\n" },
          open: "PERFORMANCE.md",
          solution: {
            "PERFORMANCE.md":
              "# Performance\n\n## Student progress count\n\nQuery: `SELECT count(*) FROM lesson_views WHERE student_id = $1` on 1,000,000 rows.\n\n- Before: Parallel Seq Scan, Execution Time: 88.4 ms (6,370 pages read).\n- Change: `CREATE INDEX lesson_views_student_idx ON lesson_views (student_id);`\n- After: Bitmap Index Scan, Execution Time: 1.0 ms (53 pages).\n- Cost: 7 MB of index; every insert into lesson_views also updates it.\n\n## Latest lesson views of a student\n\nQuery: `… WHERE student_id = $1 ORDER BY viewed_at DESC LIMIT 10`.\n\n- Before: index scan plus a top-N Sort, Execution Time: 0.62 ms.\n- Change: `CREATE INDEX lesson_views_student_time_idx ON lesson_views (student_id, viewed_at DESC);`\n- After: Index Scan, no Sort, Execution Time: 0.25 ms.\n- Cost: 30 MB; consider dropping lesson_views_student_idx, which the new index covers.\n\n## Feed pagination\n\n- Before: `LIMIT 20 OFFSET 900000`, Execution Time: 227.9 ms.\n- Change: cursor pagination, `WHERE id > $1 ORDER BY id LIMIT 20`.\n- After: Execution Time: 0.16 ms, at any depth.\n- Cost: no page numbers; clients follow nextCursor.\n",
            "BACKUP.md":
              "# Backup and restore\n\n## Backup\n\nEvery night at 02:00 UTC:\n\n```bash\npg_dump -d academy -F c -f academy-$(date +%F).dump\n```\n\nCopied to object storage outside the database server; kept for 14 days.\n\n## Restore\n\nAlways into a new database first:\n\n```bash\ncreatedb academy_restored\npg_restore -d academy_restored academy-2026-10-28.dump\n```\n\nTo repair one table in the live database: `pg_restore -d academy --data-only --table=payments academy-2026-10-28.dump`.\n\n## Verification\n\nCompare row counts and totals with the live database and the last known figures:\n\n```sql\nSELECT count(*), sum(amount) FROM payments;\nSELECT count(*) FROM enrollments;\n```\n\n## Last tested\n\n2026-10-28: restored into academy_restored; 19 payments, ₦880,000, as expected.\n",
          },
          tests: [
            { label: "PERFORMANCE.md: at least two optimizations, each with Before and After times", check: `const t = file("PERFORMANCE.md") || ""; const sections = t.split(/^## /m).slice(1); assert(sections.length >= 2, "add at least two ## sections, one per optimization"); for (const s of sections) { const title = s.split("\\n")[0]; assert(/before/i.test(s) && /after/i.test(s), "the section '" + title + "' needs a Before and an After"); assert((s.match(/\\d+(\\.\\d+)?\\s*ms/g) || []).length >= 2, "the section '" + title + "' needs two execution times in ms"); }` },
            { label: "PERFORMANCE.md names the changes and their cost", check: `const t = file("PERFORMANCE.md") || ""; assert(/CREATE INDEX/i.test(t), "show the CREATE INDEX statements you added"); assert(/cost|size|MB|kB|slower writes/i.test(t), "say what each index costs (its size, or slower writes)");` },
            { label: "BACKUP.md: backup, restore, verification, last tested", check: `const t = file("BACKUP.md") || ""; const b = section(t, "Backup") || ""; assert(/pg_dump/.test(b), "## Backup should show the pg_dump command"); assert(/daily|nightly|every|hour|cron/i.test(b), "## Backup should say how often it runs"); const r = section(t, "Restore") || ""; assert(/pg_restore/.test(r), "## Restore should show pg_restore"); assert(/createdb|new database|_restored/i.test(r), "## Restore should restore into a new database first"); const v = section(t, "Verification") || ""; assert(/count|sum/i.test(v), "## Verification should count or sum something"); const l = section(t, "Last tested") || ""; assert(/\\d{4}-\\d{2}-\\d{2}/.test(l), "## Last tested should give a date (yyyy-mm-dd)");` },
          ],
          hint: "Use this week's recordings for the numbers: the count query went from about 88 ms to about 1 ms with lesson_views_student_idx; OFFSET 900000 took about 228 ms against 0.16 ms for the cursor query.",
          successMessage: "Two documents a reviewer can trust: every claim has a measurement, and the restore has been done, not imagined.",
        },
      },
    ],
    task: {
      title: "Week 12 deliverable: an optimized database-backed API with documented performance and a backup procedure",
      intro: "Apply the week to your own course API and database.",
      prompts: [
        "Load your Week 10 seed with ten times more data, find your two slowest endpoints, and record EXPLAIN ANALYZE for their queries.",
        "Add the indexes (as a Prisma migration, or SQL migration) and record EXPLAIN ANALYZE again; write PERFORMANCE.md with both measurements.",
        "Switch one list endpoint to cursor pagination and add the partial unique index for live enrollments.",
        "Take a pg_dump, restore it into a new database, verify it, and write BACKUP.md with the date of that test.",
        "Checkpoint: you can show a measured speed-up from an index, an enrollment that stays correct under concurrent requests, and a restore that brings the data back.",
      ],
      closing: "Next: Phase 4 begins with Week 13, authentication.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
