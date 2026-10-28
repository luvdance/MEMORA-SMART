/**
 * BACKEND ENGINEERING · WEEK 10 · SQL AND POSTGRESQL
 *
 * Curriculum 10.1 – 10.P. Installing and configuring PostgreSQL; databases
 * and tables; SELECT/INSERT/UPDATE/DELETE; filtering, sorting and limits;
 * aggregates; joins and subqueries; CTEs; constraints and indexes; views
 * and permissions; execution plans; four query exercises on the academy;
 * and realistic sample data with the queries that use it.
 *
 * Terminals were recorded against a real PostgreSQL 18 server (sessions
 * w10-psql, w10-roles); SQL labs run on PostgreSQL (PGlite) with the
 * academy dataset of the RDBMS course (db-helpers ACADEMY), and compare the
 * learner's result with the model answer's.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { shown, term } from "./be-helpers.js";
import { ACADEMY } from "./db-helpers.js";

export const SECTION_ID = "be-s10-sql";
const MODULE = "be-w10-sql";

/** The academy's tables without its rows. */
const ACADEMY_SCHEMA = ACADEMY.slice(0, ACADEMY.indexOf("INSERT INTO"));

/** A query lab on the academy: the learner's final result must equal the model's. */
const ask = (task, solution, { ordered = true, hint, success, rows, setup = ACADEMY, checks = [], mustFail } = {}) => ({
  setup,
  erd: true,
  task,
  starter: "",
  solution,
  checks: [{ label: ordered ? "The right rows, columns and order" : "The right rows and columns", result: { ordered, names: true } }, ...checks],
  hint,
  successMessage: success,
  ...(rows !== undefined ? { expectRows: rows } : {}),
  // Wrong answers the checks must reject: { sql, why } (why documents the mistake).
  ...(mustFail ? { mustFail: mustFail.map((m) => m.sql) } : {}),
});

/** An index on exactly these columns, in this order. */
const INDEX_ON = (table, cols) =>
  `SELECT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = '${table}'::regclass AND (SELECT array_agg(a.attname::text ORDER BY k.ord) FROM unnest(i.indkey::int2[]) WITH ORDINALITY AS k(attnum, ord) JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = k.attnum) = ARRAY[${cols.map((c) => `'${c}'`).join(", ")}])`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 10.1 – 10.2 · INSTALLING POSTGRESQL, DATABASES, TABLES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l68-postgres",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2"],
    title: "Installing PostgreSQL, Creating Databases and Tables",
    subtitle: "A real server on your laptop",
    estimatedMinutes: 50,
    intro:
      "From this week the course uses a PostgreSQL server like the one production runs. Install it once, create the academy database, and load the schema from Week 9 with sample data.",
    atoms: [
      {
        id: "a-be-install-postgres",
        title: "Installing and configuring PostgreSQL",
        explain:
          "Install PostgreSQL 18: on macOS brew install postgresql@18 then brew services start postgresql@18; on Ubuntu or Debian sudo apt install postgresql; on Windows the EDB installer (or run it in WSL). Week 19 runs it in Docker instead. The server listens on port 5432 and has ROLES (users); create one for yourself (sudo -u postgres createuser --superuser $USER on Linux) so psql and createdb work without -U. The tools: psql (the interactive client), createdb and dropdb, pg_dump and pg_restore (backups, Week 12). Configuration lives in postgresql.conf (memory, connections, logging) and pg_hba.conf (who may connect, how). The terminals in this lesson were recorded against a fresh PostgreSQL 18 server with the role ada.",
        example: shown("w10-psql", "psql --version"),
        terminalExercise: term("w10-psql", {
          only: ["psql --version", "createdb academy", "psql -l"],
          goal: "Create a database called academy on the server.",
          accept: ["createdb academy"],
          near: [{ command: "psql -l", why: "That lists the databases; it does not create one." }],
          hint: "createdb, followed by the database's name.",
          success: "No output means success. psql -l now lists academy next to postgres and the two templates every new database is copied from.",
        }),
      },
      {
        id: "a-be-psql-load",
        title: "Creating tables from a script",
        explain:
          "Schemas are written in .sql files kept in the repository and run with psql -d academy -f academy.sql (psql reports each statement: CREATE TABLE, INSERT 0 12 meaning 12 rows inserted). Then explore with psql's meta-commands, which start with a backslash and are psql's own, not SQL: \\dt lists tables, \\d enrollments describes one (columns, indexes, constraints, references), \\conninfo shows the connection, \\l lists databases, \\q quits. Run one with -c, or interactively after psql -d academy. A typo in a name gives PostgreSQL's error with a caret under the problem.",
        example: shown("w10-psql", 'psql -d academy -c "SELECT * FROM course;"'),
        terminalExercise: term("w10-psql", {
          only: ["psql -d academy -f academy.sql", 'psql -d academy -c "\\dt"', 'psql -d academy -c "\\d enrollments"', 'psql -d academy -c "\\conninfo"'],
          goal: "Show the enrollments table's columns, indexes and constraints.",
          accept: ['psql -d academy -c "\\d enrollments"'],
          near: [{ command: 'psql -d academy -c "\\dt"', why: "\\dt lists the tables; \\d with a table's name describes that table." }],
          hint: "\\d followed by the table name, run with -c.",
          success: "Everything Week 9 designed is visible: the identity column, the unique (student_id, course_id) pair, the CHECKs, the foreign keys, and which tables refer to enrollments.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 10.3 – 10.4 · CRUD, FILTERING, SORTING, LIMITS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l69-crud-sql",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.3", "10.4"],
    title: "SELECT, INSERT, UPDATE, DELETE, Filtering and Sorting",
    subtitle: "The four statements behind every endpoint",
    estimatedMinutes: 55,
    intro: "Every endpoint of Week 6's API becomes one of four SQL statements. Open the diagram in each lab to see the academy's tables.",
    atoms: [
      {
        id: "a-be-crud-sql",
        title: "SELECT, INSERT, UPDATE and DELETE",
        explain:
          "INSERT INTO students (full_name, email, city, joined_on) VALUES (…) adds rows (list the columns; the id is generated); add RETURNING id to get the new id back, which is what POST /students needs. SELECT columns FROM table reads. UPDATE students SET is_active = true WHERE email = '…' changes rows; DELETE FROM … WHERE … removes them. ALWAYS write the WHERE first: an UPDATE or DELETE without one changes every row. Look rows up by something unique (an email, a code), or by a subquery: WHERE student_id = (SELECT id FROM students WHERE email = '…').",
        sqlLab: {
          setup: ACADEMY,
          erd: true,
          task:
            "Three changes. (1) Add the student Musa Bello: email musa@example.com, city Kano, joined 2026-06-01 (no phone). (2) Ifeanyi Nwosu (ifeanyi@example.com) is back: make him active. (3) Delete Efe Okoro's dropped enrollment (efe@example.com, course WD-101). Change nothing else.",
          starter: "",
          solution:
            "INSERT INTO students (full_name, email, city, joined_on)\nVALUES ('Musa Bello', 'musa@example.com', 'Kano', '2026-06-01');\n\nUPDATE students SET is_active = true WHERE email = 'ifeanyi@example.com';\n\nDELETE FROM enrollments\nWHERE student_id = (SELECT id FROM students WHERE email = 'efe@example.com')\n  AND course_id = (SELECT id FROM courses WHERE code = 'WD-101');\n",
          checks: [
            { label: "Musa Bello is a student", query: "SELECT full_name, email, phone, city, joined_on, is_active FROM students WHERE email = 'musa@example.com'" },
            { label: "Ifeanyi is active again", query: "SELECT full_name, is_active FROM students WHERE email = 'ifeanyi@example.com'" },
            { label: "Efe's WD-101 enrollment is gone", query: "SELECT count(*) AS efe_enrollments FROM enrollments e JOIN students s ON s.id = e.student_id WHERE s.email = 'efe@example.com'" },
            { label: "Nothing else changed", query: "SELECT (SELECT count(*) FROM students) AS students, (SELECT count(*) FILTER (WHERE is_active) FROM students) AS active, (SELECT count(*) FROM enrollments) AS enrollments" },
          ],
          hint: "INSERT INTO students (columns) VALUES (…); UPDATE … SET … WHERE email = …; DELETE … WHERE student_id = (SELECT id …) AND course_id = (SELECT id …).",
          successMessage: "Three statements, each with a WHERE (or a VALUES) that names exactly the rows it means. That is the discipline that keeps production data safe.",
        },
      },
      {
        id: "a-be-filter-sort",
        title: "Filtering, sorting and limiting",
        explain:
          "WHERE filters rows: comparisons (=, <>, <, >=), AND / OR / NOT (with parentheses), IN ('Lagos', 'Abuja'), BETWEEN, LIKE 'A%' (ILIKE ignores case) and IS NULL (never = NULL). ORDER BY sorts (ASC by default, DESC, several columns); without it, row order is not guaranteed. LIMIT 10 OFFSET 20 takes a page: Week 6's ?page and ?limit become exactly this, and the sort must be stable (end with a unique column) or pages repeat or skip rows.",
        sqlLab: ask(
          "Active students who live in Lagos or Enugu, newest first (latest joined_on first): full_name, city and joined_on. Only the first 4.",
          "SELECT full_name, city, joined_on\nFROM students\nWHERE is_active AND city IN ('Lagos', 'Enugu')\nORDER BY joined_on DESC\nLIMIT 4;\n",
          {
            rows: 4,
            hint: "WHERE is_active AND city IN (…), ORDER BY joined_on DESC, LIMIT 4.",
            success: "Week 6's filters, sorting and pagination, now done by the database instead of JavaScript.",
            mustFail: [{ sql: "SELECT full_name, city, joined_on FROM students WHERE city = 'Enugu' OR city = 'Lagos' AND is_active ORDER BY joined_on DESC LIMIT 4;", why: "AND binds tighter than OR: inactive Lagos students would slip in without parentheses" }],
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 10.5 · AGGREGATES AND GROUP BY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l70-aggregates",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.5"],
    title: "Aggregate Functions and GROUP BY",
    subtitle: "Turning rows into numbers",
    estimatedMinutes: 45,
    intro: "Dashboards and reports are aggregates: totals, counts and averages per something. The database computes them far faster than fetching rows into Node.",
    atoms: [
      {
        id: "a-be-group-by",
        title: "Aggregates and GROUP BY",
        explain:
          "count(*), count(column) (non-NULL values), sum, avg, min, max collapse rows into one value. GROUP BY course_id gives one result row per group, and every selected column must be grouped or aggregated. WHERE filters rows before grouping; HAVING filters groups after (HAVING sum(amount) > 100000). count(*) FILTER (WHERE status = 'completed') counts a subset inside the same group. Sum money in the database, never by adding JavaScript floats.",
        sqlLab: ask(
          "Revenue per course: code, title, the number of payments (payments) and the total paid (total_paid, the sum of payments.amount), only for courses that took more than ₦100,000, highest total first.",
          "SELECT c.code, c.title, count(p.id) AS payments, sum(p.amount) AS total_paid\nFROM payments p\nJOIN enrollments e ON e.id = p.enrollment_id\nJOIN courses c ON c.id = e.course_id\nGROUP BY c.id, c.code, c.title\nHAVING sum(p.amount) > 100000\nORDER BY total_paid DESC;\n",
          {
            rows: 4,
            hint: "Join payments to enrollments to courses, GROUP BY the course, HAVING sum(p.amount) > 100000.",
            success: "Four courses over ₦100,000, computed in one statement. Cybersecurity, with one payment of ₦40,000, is filtered out by HAVING.",
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 10.6 – 10.7 · JOINS, SUBQUERIES AND CTES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l71-joins",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.6", "10.7"],
    title: "Joins, Subqueries and Common Table Expressions",
    subtitle: "Questions that span tables",
    estimatedMinutes: 70,
    intro: "Normalized data lives in many tables; joins put it back together for each question. Subqueries and CTEs let one statement answer a question in steps.",
    atoms: [
      {
        id: "a-be-joins",
        title: "Joins",
        explain:
          "JOIN (INNER) keeps pairs that match: FROM enrollments e JOIN students s ON s.id = e.student_id. LEFT JOIN keeps every row of the left table, with NULLs where nothing matches: the way to include courses with no completed students. Careful: a condition on the right table in WHERE (WHERE e.status = 'completed') removes those NULL rows again and turns the LEFT JOIN back into an inner one; put it in the ON clause instead. count(e.id) counts matches, count(*) would count the NULL row as 1.",
        sqlLab: ask(
          "Every course with its number of completed enrollments, including courses with none: code and completed, ordered by code.",
          "SELECT c.code, count(e.id) AS completed\nFROM courses c\nLEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'completed'\nGROUP BY c.code\nORDER BY c.code;\n",
          {
            rows: 5,
            hint: "LEFT JOIN enrollments with the status condition inside ON, then count(e.id).",
            success: "Web Development and Cybersecurity have no completions yet, and still appear with 0: that is what the LEFT JOIN and the condition in ON are for.",
            mustFail: [
              { sql: "SELECT c.code, count(e.id) AS completed FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id WHERE e.status = 'completed' GROUP BY c.code ORDER BY c.code;", why: "the WHERE removes the courses with no completed enrollments" },
              { sql: "SELECT c.code, count(*) AS completed FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'completed' GROUP BY c.code ORDER BY c.code;", why: "count(*) counts the NULL row: 1 instead of 0" },
            ],
          }
        ),
      },
      {
        id: "a-be-subqueries",
        title: "Subqueries",
        explain:
          "A subquery is a query inside another. As a value: WHERE price > (SELECT avg(price) FROM courses). As a list: WHERE id IN (SELECT student_id FROM …). As a test: WHERE NOT EXISTS (SELECT 1 FROM … WHERE … = s.id) keeps rows with no match, the clearest way to ask 'who has never…'. EXISTS stops at the first match and handles NULLs safely, unlike NOT IN, which returns nothing at all if the list contains a NULL.",
        sqlLab: ask(
          "Students who have never paid anything: full_name and email, ordered by full_name. (Payments belong to enrollments, which belong to students.)",
          "SELECT s.full_name, s.email\nFROM students s\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM enrollments e\n  JOIN payments p ON p.enrollment_id = e.id\n  WHERE e.student_id = s.id\n)\nORDER BY s.full_name;\n",
          {
            rows: 2,
            hint: "WHERE NOT EXISTS (SELECT 1 FROM enrollments e JOIN payments p … WHERE e.student_id = s.id).",
            success: "Two students have never paid: both dropped their only courses. A query like this feeds a 'follow up with these students' list.",
          }
        ),
      },
      {
        id: "a-be-ctes",
        title: "Common table expressions",
        explain:
          "WITH name AS (SELECT …) SELECT … FROM name gives a subquery a name, so a complex question reads top to bottom in steps: first compute each student's total, then compare totals with their average. Several CTEs can follow one another (WITH a AS (…), b AS (… FROM a …)). A CTE can be referenced twice, which a subquery cannot. WITH RECURSIVE walks hierarchies (a staff chart, prerequisites).",
        sqlLab: ask(
          "Using a CTE: students whose total paid is above the average total of students who paid anything. Columns full_name and total_paid, highest first, then by full_name.",
          "WITH totals AS (\n  SELECT s.full_name, sum(p.amount) AS total_paid\n  FROM students s\n  JOIN enrollments e ON e.student_id = s.id\n  JOIN payments p ON p.enrollment_id = e.id\n  GROUP BY s.id, s.full_name\n)\nSELECT full_name, total_paid\nFROM totals\nWHERE total_paid > (SELECT avg(total_paid) FROM totals)\nORDER BY total_paid DESC, full_name;\n",
          {
            rows: 5,
            checks: [{ label: "It uses a CTE (WITH … AS)", source: "\\bWITH\\b[\\s\\S]*\\bAS\\s*\\(", flags: "i" }],
            hint: "WITH totals AS (… GROUP BY the student) SELECT … FROM totals WHERE total_paid > (SELECT avg(total_paid) FROM totals).",
            success: "The average of paying students is ₦88,000, and five students are above it. The CTE named the totals once and used them twice.",
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 10.8 – 10.9 · INDEXES, VIEWS AND PERMISSIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l72-indexes-views",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.8", "10.9"],
    title: "Indexes, Views and Permissions",
    subtitle: "Fast lookups, named queries, least privilege",
    estimatedMinutes: 65,
    intro: "Week 9 covered constraints. This lesson adds the three tools that make a database fit for an API in production: indexes for speed, views for reusable queries, and roles so each program can do only its job.",
    atoms: [
      {
        id: "a-be-indexes",
        title: "Constraints and indexes",
        explain:
          "An INDEX lets PostgreSQL find rows without reading the whole table, like a book's index. Primary keys and UNIQUE constraints create one automatically; FOREIGN KEYS DO NOT: index the columns your queries filter, join or sort on (enrollments.course_id, payments.enrollment_id). A COMPOSITE index (course_id, status) serves WHERE course_id = … AND status = … and also WHERE course_id = … alone (its leading column), but not WHERE status = … alone. Indexes cost: every INSERT and UPDATE maintains them, and they take space. Add them for real queries, and check with EXPLAIN (Lesson 73).",
        sqlLab: {
          setup: ACADEMY,
          erd: true,
          task:
            "The API runs these queries thousands of times a day:\n  SELECT … FROM enrollments WHERE course_id = $1 AND status = $2;\n  SELECT … FROM payments WHERE enrollment_id = $1 ORDER BY paid_on;\nCreate the two composite indexes that serve them: enrollments_course_status_idx on enrollments (course_id, status) and payments_enrollment_paid_idx on payments (enrollment_id, paid_on).",
          starter: "",
          solution: "CREATE INDEX enrollments_course_status_idx ON enrollments (course_id, status);\nCREATE INDEX payments_enrollment_paid_idx ON payments (enrollment_id, paid_on);\n",
          checks: [
            { label: "enrollments has an index on (course_id, status)", assert: INDEX_ON("enrollments", ["course_id", "status"]), message: "The columns must be in this order: course_id first (always filtered), then status." },
            { label: "payments has an index on (enrollment_id, paid_on)", assert: INDEX_ON("payments", ["enrollment_id", "paid_on"]) },
            { label: "The indexes have the names asked for", assert: "SELECT count(*) = 2 FROM pg_indexes WHERE indexname IN ('enrollments_course_status_idx', 'payments_enrollment_paid_idx')" },
          ],
          hint: "CREATE INDEX name ON table (first_column, second_column);",
          successMessage: "Each index matches a query's WHERE (and, for payments, its ORDER BY), so PostgreSQL can jump to the rows already in order.",
        },
      },
      {
        id: "a-be-views",
        title: "Views",
        explain:
          "A VIEW is a named query: CREATE VIEW course_report AS SELECT … . It is queried like a table (SELECT * FROM course_report) but stores no data: each query runs the view's SELECT on the current rows. Views give a stable name to a complex query (dashboards, reports), and are a security tool: a role can be granted a view that shows per-course numbers without being able to read the personal data in the tables underneath. A MATERIALIZED VIEW stores its result and must be refreshed (REFRESH MATERIALIZED VIEW): fast to read, stale between refreshes.",
        sqlLab: {
          setup: ACADEMY,
          erd: true,
          task:
            "Create the view course_report: for every course (even with no enrollments), code, title, enrollments (the number of enrollments) and completed (the number with status completed), ordered by code.",
          starter: "CREATE VIEW course_report AS\n",
          solution:
            "CREATE VIEW course_report AS\nSELECT c.code, c.title,\n       count(e.id) AS enrollments,\n       count(e.id) FILTER (WHERE e.status = 'completed') AS completed\nFROM courses c\nLEFT JOIN enrollments e ON e.course_id = c.id\nGROUP BY c.id\nORDER BY c.code;\n",
          checks: [
            { label: "course_report is a view", assert: "SELECT EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'course_report')" },
            { label: "It returns the per-course numbers", query: "SELECT * FROM course_report", ordered: true },
            { label: "It shows new data without being rebuilt", query: "INSERT INTO enrollments (student_id, course_id, enrolled_on, status) VALUES (12, 5, '2026-06-01', 'active'); SELECT code, enrollments FROM course_report WHERE code = 'CS-101'" },
          ],
          hint: "Lesson 71's LEFT JOIN with count(e.id), plus count(e.id) FILTER (WHERE e.status = 'completed').",
          successMessage: "A report anyone can query by name, always current. The next atom gives it to a reporting role that cannot see the students table at all.",
        },
      },
      {
        id: "a-be-db-permissions",
        title: "Basic database permissions",
        explain:
          "Connect your API as a role with only what it needs, not as the superuser: GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO academy_app lets it work with rows but not DROP or ALTER tables (only the owner can). A reporting role gets SELECT on the view and nothing else. GRANT … ON ALL TABLES covers tables that exist NOW: a view created later is not included (ALTER DEFAULT PRIVILEGES changes that for future objects). If the API is ever compromised, least privilege limits what the attacker's SQL can do. The recording below ran roles.sql, then tried each role.",
        example: shown("w10-roles", 'psql -U academy_app -d academy -c "DROP TABLE payments;"'),
        terminalExercise: term("w10-roles", {
          only: [
            "psql -d academy -f roles.sql",
            'psql -U academy_app -d academy -c "SELECT count(*) FROM students;"',
            'psql -U academy_app -d academy -c "SELECT * FROM course_report;"',
            'psql -U reporting -d academy -c "SELECT * FROM course_report;"',
            'psql -U reporting -d academy -c "SELECT email FROM students LIMIT 1;"',
          ],
          goal: "Show that the reporting role cannot read students' personal data.",
          accept: ['psql -U reporting -d academy -c "SELECT email FROM students LIMIT 1;"'],
          near: [
            { command: 'psql -U reporting -d academy -c "SELECT * FROM course_report;"', why: "That shows what reporting CAN read. Try the students table as reporting." },
            { command: 'psql -U academy_app -d academy -c "SELECT count(*) FROM students;"', why: "That is the API's role, which may read students." },
          ],
          hint: "Connect as reporting (-U reporting) and select from students.",
          success: "permission denied for table students: the reporting role sees course numbers through the view and nothing personal. Notice too that academy_app was refused the view: it was granted ALL TABLES before the view existed.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 10.10 · EXECUTION PLANS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l73-explain",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.10"],
    title: "Querying and Interpreting Execution Plans",
    subtitle: "Asking PostgreSQL how it will run a query",
    estimatedMinutes: 50,
    intro: "A slow endpoint usually means a slow query, and a slow query usually means PostgreSQL is reading far more rows than it returns. EXPLAIN shows exactly what it does.",
    atoms: [
      {
        id: "a-be-explain",
        title: "Execution plans with EXPLAIN",
        explain:
          "EXPLAIN SELECT … prints the PLAN: a tree of steps, innermost first, each with an estimated cost (startup..total, in arbitrary units) and estimated rows. Seq Scan reads every row of a table; Index Scan / Index Only Scan / Bitmap Index Scan use an index; Hash Join, Nested Loop and Merge Join combine tables; Sort and HashAggregate do the ORDER BY and GROUP BY. A Seq Scan with a Filter that removes almost every row, on a big table, is the classic missing index. EXPLAIN ANALYZE actually runs the query and adds the real time and rows of each step (Week 12). After creating an index, the planner may still choose a Seq Scan for tiny tables: reading 10 rows directly is cheaper.",
        sqlLab: {
          setup:
            "-- 200,000 lesson views from 5,000 students.\nCREATE TABLE lesson_views (\n  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  student_id integer NOT NULL,\n  lesson_id  integer NOT NULL,\n  viewed_at  timestamptz NOT NULL\n);\nINSERT INTO lesson_views (student_id, lesson_id, viewed_at)\nSELECT 1 + (n * 7919) % 5000, 1 + n % 300, timestamptz '2026-01-01' + n * interval '2 minutes'\nFROM generate_series(1, 200000) AS n;\nANALYZE lesson_views;\n\n-- plan(query) returns EXPLAIN's text, for the checks.\nCREATE FUNCTION plan(q text) RETURNS text LANGUAGE plpgsql AS $$\nDECLARE line text; result text := '';\nBEGIN\n  FOR line IN EXECUTE 'EXPLAIN ' || q LOOP result := result || line || E'\\n'; END LOOP;\n  RETURN result;\nEND $$;\n",
          task:
            "The progress page runs SELECT count(*) FROM lesson_views WHERE student_id = 4242. Run EXPLAIN on it and read the plan (a Seq Scan over 200,000 rows). Then create an index so that the plan uses it, and EXPLAIN again.",
          starter: "EXPLAIN SELECT count(*) FROM lesson_views WHERE student_id = 4242;\n",
          solution: "CREATE INDEX lesson_views_student_idx ON lesson_views (student_id);\n\nEXPLAIN SELECT count(*) FROM lesson_views WHERE student_id = 4242;\n",
          checks: [
            { label: "The plan uses an index on student_id", assert: "SELECT plan('SELECT count(*) FROM lesson_views WHERE student_id = 4242') ~ 'Index (Only )?Scan|Bitmap Index Scan'", message: "EXPLAIN still shows a Seq Scan: create an index whose first column is student_id." },
            { label: "No more Seq Scan of lesson_views", assert: "SELECT plan('SELECT count(*) FROM lesson_views WHERE student_id = 4242') !~ 'Seq Scan'" },
            { label: "You ran EXPLAIN on the query", source: "\\bEXPLAIN\\b", flags: "i" },
          ],
          hint: "CREATE INDEX … ON lesson_views (student_id); then EXPLAIN the same query.",
          successMessage: "From reading 200,000 rows to reading about 40 through the index. Week 12 measures the difference with EXPLAIN ANALYZE.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 10.11 – 10.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l74-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["10.11", "10.12", "10.13", "10.14"],
    title: "Exercises: Questions the Academy Asks",
    subtitle: "Four reports from real requests",
    estimatedMinutes: 100,
    intro: "Each exercise is a request the academy's staff actually make. Each one combines this week's tools.",
    atoms: [
      {
        id: "a-be-ex-enrolled",
        title: "Exercise: retrieve students enrolled in each course",
        explain:
          "string_agg(expression, separator ORDER BY …) joins a group's values into one string, so one row per course can list its students. Decide what 'enrolled' means first: here, every enrollment that was not dropped.",
        sqlLab: ask(
          "For each course: code, title, students (the number of students enrolled, not counting dropped enrollments) and names (their full names in alphabetical order, separated by ', '). Order by code.",
          "SELECT c.code, c.title,\n       count(s.id) AS students,\n       string_agg(s.full_name, ', ' ORDER BY s.full_name) AS names\nFROM courses c\nLEFT JOIN enrollments e ON e.course_id = c.id AND e.status <> 'dropped'\nLEFT JOIN students s ON s.id = e.student_id\nGROUP BY c.id, c.code, c.title\nORDER BY c.code;\n",
          { rows: 5, hint: "Join courses → enrollments (not dropped) → students, GROUP BY the course, and use string_agg(s.full_name, ', ' ORDER BY s.full_name).", success: "One line per course, ready to paste into an email to each course's instructor." }
        ),
      },
      {
        id: "a-be-ex-completion",
        title: "Exercise: calculate course completion rates",
        explain:
          "A rate is a ratio of two counts in the same group: count(*) FILTER (WHERE status = 'completed') over count(*). Multiply by 100.0 (not 100) so the division is decimal, not integer, and round(…, 1) to one decimal place.",
        sqlLab: ask(
          "For each course: code, enrollments (all of them), completed, and completion_rate: completed ÷ enrollments × 100, rounded to 1 decimal. Highest rate first, then by code.",
          "SELECT c.code,\n       count(*) AS enrollments,\n       count(*) FILTER (WHERE e.status = 'completed') AS completed,\n       round(100.0 * count(*) FILTER (WHERE e.status = 'completed') / count(*), 1) AS completion_rate\nFROM courses c\nJOIN enrollments e ON e.course_id = c.id\nGROUP BY c.code\nORDER BY completion_rate DESC, c.code;\n",
          {
            rows: 5,
            setup: `${ACADEMY}\n\n-- A new enrollment this week.\nINSERT INTO enrollments (student_id, course_id, enrolled_on, status) VALUES (12, 1, '2026-06-02', 'active');\n`,
            hint: "round(100.0 * count(*) FILTER (WHERE e.status = 'completed') / count(*), 1).",
            success: "Python Programming completes 60% of enrollments and Data Analysis 33.3%; Web Development and Cybersecurity none yet. Integer division would have turned 33.3 into 33.",
            mustFail: [{ sql: "SELECT c.code, count(*) AS enrollments, count(*) FILTER (WHERE e.status = 'completed') AS completed, round(100 * count(*) FILTER (WHERE e.status = 'completed') / count(*), 1) AS completion_rate FROM courses c JOIN enrollments e ON e.course_id = c.id GROUP BY c.code ORDER BY completion_rate DESC, c.code;", why: "integer division: 100 * 2 / 6 is 33, not 33.3" }],
          }
        ),
      },
      {
        id: "a-be-ex-verified",
        title: "Exercise: find candidates with verified certifications",
        explain:
          "An employer asks which certificates can be verified. A certificate counts only if its enrollment is completed AND the course is fully paid. Sum a related table's rows in a correlated subquery (SELECT coalesce(sum(amount), 0) FROM payments WHERE enrollment_id = e.id), not by joining payments, which would duplicate the certificate row once per payment.",
        sqlLab: ask(
          "Verified certificates: those whose enrollment is completed and whose payments add up to at least the course price. Columns full_name, code (the course), certificate_no and issued_on, ordered by issued_on.",
          "SELECT s.full_name, c.code, cert.certificate_no, cert.issued_on\nFROM certificates cert\nJOIN enrollments e ON e.id = cert.enrollment_id\nJOIN students s ON s.id = e.student_id\nJOIN courses c ON c.id = e.course_id\nWHERE e.status = 'completed'\n  AND (SELECT coalesce(sum(p.amount), 0) FROM payments p WHERE p.enrollment_id = e.id) >= c.price\nORDER BY cert.issued_on;\n",
          {
            rows: 5,
            setup: `${ACADEMY}\n\n-- Two certificates should not have been issued yet.\nINSERT INTO certificates (enrollment_id, certificate_no, issued_on) VALUES (2, 'MST-2026-0007', '2026-06-30');\nDELETE FROM payments WHERE enrollment_id = 12;\n`,
            hint: "Join certificates → enrollments → students and courses; WHERE status = 'completed' AND (SELECT coalesce(sum(amount), 0) … ) >= c.price.",
            success: "Five verified; MST-2026-0007 (an enrollment still active) and Gbenga's DB-101 certificate (no payment on record) are rightly left out.",
            mustFail: [{ sql: "SELECT s.full_name, c.code, cert.certificate_no, cert.issued_on FROM certificates cert JOIN enrollments e ON e.id = cert.enrollment_id JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id ORDER BY cert.issued_on;", why: "every certificate, verified or not" }],
          }
        ),
      },
      {
        id: "a-be-ex-rank",
        title: "Exercise: rank results with window functions",
        explain:
          "A WINDOW FUNCTION computes over a group of rows without collapsing them: RANK() OVER (PARTITION BY course_id ORDER BY score DESC) numbers each student within their own course. RANK gives equal scores the same rank and skips the next (1, 1, 3); DENSE_RANK does not skip (1, 1, 2); ROW_NUMBER never ties. Other window functions: sum() OVER for running totals, lag() for 'compared with last month'.",
        sqlLab: ask(
          "Rank the completed students within each course by score, highest first (equal scores share a rank, as RANK does): code, full_name, score and rank_in_course, ordered by code, then rank_in_course, then full_name.",
          "SELECT c.code, s.full_name, e.score,\n       rank() OVER (PARTITION BY c.code ORDER BY e.score DESC) AS rank_in_course\nFROM enrollments e\nJOIN students s ON s.id = e.student_id\nJOIN courses c ON c.id = e.course_id\nWHERE e.status = 'completed'\nORDER BY c.code, rank_in_course, s.full_name;\n",
          { rows: 7, hint: "rank() OVER (PARTITION BY c.code ORDER BY e.score DESC) AS rank_in_course.", success: "Each course ranks its own students: Gbenga leads DB-101 with 95, Chiamaka leads DA-101 with 91." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 10.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l75-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["10.P"],
    title: "Deliverable: Realistic Sample Data and Useful Queries",
    subtitle: "A database worth testing against",
    estimatedMinutes: 80,
    intro: "Twelve students hide problems that two hundred reveal: slow queries, pagination bugs, reports that only look right. The deliverable fills the academy with realistic data generated in SQL.",
    atoms: [
      {
        id: "a-be-seed-data",
        title: "Generating realistic data",
        explain:
          "generate_series(1, 200) produces numbers to build rows from: INSERT INTO students (…) SELECT 'Student ' || n, 'student' || n || '@example.com', … FROM generate_series(1, 200) AS n. Spread values deterministically with modulo arithmetic ((ARRAY['Lagos', 'Abuja', …])[1 + n % 6], date '2026-01-01' + n * 37 % 300) so every run gives the same data, which makes bugs reproducible. Respect the constraints: a cross join filtered by modulo ((s.id + c.id) % 5 < 3) gives each student three different courses, so UNIQUE (student_id, course_id) holds. Include the awkward cases: missing phones, inactive students, dropped enrollments.",
        sqlLab: {
          setup: ACADEMY_SCHEMA,
          erd: true,
          task:
            "The academy's tables are empty. Fill them with generated data: the 5 courses (any codes and prices that satisfy the constraints); 200 students with unique emails, at least 5 different cities, some without a phone and some inactive; and at least 500 enrollments, every course with at least 50, all three statuses present (at least 50 of each), and every completed enrollment with a completed_on after its enrolled_on and a score. Other enrollments have no completed_on and no score.",
          starter: "",
          solution:
            "INSERT INTO courses (code, title, category, price, duration_weeks) VALUES\n  ('DA-101', 'Data Analysis', 'data', 60000, 16),\n  ('WD-101', 'Web Development', 'web', 75000, 24),\n  ('PY-101', 'Python Programming', 'programming', 50000, 12),\n  ('DB-101', 'Relational Databases', 'data', 55000, 16),\n  ('CS-101', 'Cybersecurity', 'security', 80000, 16);\n\nINSERT INTO students (full_name, email, phone, city, joined_on, is_active)\nSELECT 'Student ' || n,\n       'student' || n || '@example.com',\n       CASE WHEN n % 4 = 0 THEN NULL ELSE '080' || lpad((n * 7919 % 100000000)::text, 8, '0') END,\n       (ARRAY['Lagos', 'Abuja', 'Ibadan', 'Kano', 'Enugu', 'Port Harcourt'])[1 + n % 6],\n       date '2026-01-01' + n * 37 % 300,\n       n % 10 <> 0\nFROM generate_series(1, 200) AS n;\n\nINSERT INTO enrollments (student_id, course_id, enrolled_on, status, completed_on, score)\nSELECT s.id, c.id, s.joined_on + 1,\n       (ARRAY['active', 'completed', 'dropped'])[1 + (s.id + c.id) % 3],\n       CASE WHEN (s.id + c.id) % 3 = 1 THEN s.joined_on + 1 + c.duration_weeks * 7 END,\n       CASE WHEN (s.id + c.id) % 3 = 1 THEN 40 + (s.id * c.id) % 61 END\nFROM students s\nJOIN courses c ON (s.id + c.id) % 5 < 3;\n",
          checks: [
            { label: "5 courses and 200 students with unique emails", assert: "SELECT (SELECT count(*) FROM courses) = 5 AND (SELECT count(*) FROM students) = 200 AND (SELECT count(DISTINCT email) FROM students) = 200" },
            { label: "Varied students: 5+ cities, some without phones, some inactive", assert: "SELECT count(DISTINCT city) >= 5 AND count(*) FILTER (WHERE phone IS NULL) > 0 AND count(*) FILTER (WHERE NOT is_active) > 0 FROM students" },
            { label: "500+ enrollments, every course with 50+", assert: "SELECT (SELECT count(*) FROM enrollments) >= 500 AND (SELECT min(n) FROM (SELECT count(e.id) AS n FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id GROUP BY c.id) t) >= 50" },
            { label: "All three statuses, 50+ of each", assert: "SELECT count(*) = 3 FROM (SELECT status FROM enrollments GROUP BY status HAVING count(*) >= 50) t" },
            { label: "Completed enrollments are complete; others are not", assert: "SELECT NOT EXISTS (SELECT 1 FROM enrollments WHERE (status = 'completed' AND (completed_on IS NULL OR completed_on <= enrolled_on OR score IS NULL)) OR (status <> 'completed' AND (completed_on IS NOT NULL OR score IS NOT NULL)))" },
            { label: "The data is generated, not typed row by row", source: "generate_series", flags: "i" },
          ],
          hint: "Students: INSERT … SELECT … FROM generate_series(1, 200) AS n. Enrollments: FROM students s JOIN courses c ON (s.id + c.id) % 5 < 3, with the status chosen from an array by (s.id + c.id) % 3 and CASE for completed_on and score.",
          successMessage: "Six hundred enrollments that respect every constraint, identical on every run. Rerun the exercises of Lesson 74 on this data: the same queries, now with numbers that look like a real academy's.",
        },
      },
    ],
    task: {
      title: "Week 10 deliverable: a relational database with realistic data and useful queries",
      intro: "Build the academy database on your own PostgreSQL server.",
      prompts: [
        "On your PostgreSQL server: createdb academy, then psql -d academy -f schema.sql with your Week 9 schema.",
        "Write seed.sql that generates the data of Lesson 75 and run it with psql -f.",
        "Write queries.sql with the four exercise queries of Lesson 74, each preceded by a comment saying what question it answers, and run it.",
        "Run EXPLAIN on each query; add the indexes they need (Lesson 72) and note in a comment which plan changed.",
        "Commit schema.sql, seed.sql and queries.sql. Checkpoint: your queries return correct answers on realistic data, and you can read the plan that runs them.",
      ],
      closing: "Next: Week 11 connects the course API to this database with node-postgres and Prisma.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
