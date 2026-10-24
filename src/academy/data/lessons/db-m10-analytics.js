/**
 * RELATIONAL DATABASES · WEEK 10 · CTEs, VIEWS AND ANALYTICAL SQL
 *
 * Curriculum 10.1 – 10.P. Common table expressions, breaking a query into
 * steps, recursive CTEs, views and materialized views, window functions
 * versus GROUP BY, ROW_NUMBER, RANK and DENSE_RANK, PARTITION BY and window
 * ordering, running totals and moving averages, LAG and LEAD, top-N per
 * group, and a first cohort analysis. The practical is a learner-performance
 * report built from CTEs and at least two window functions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY } from "./db-helpers.js";

export const SECTION_ID = "db-s10-analytics";
const MODULE = "db-m10-analytics";

const ask = (task, solution, { starter = "", ordered = false, hint, success, mustFail, rows, names = true, setup = ACADEMY, claims, revealSolution, extra = [] } = {}) => ({
  setup,
  task,
  starter,
  solution,
  checks: [{ label: ordered ? "The right rows, columns and order" : "The right rows and columns", result: { ordered, names } }, ...extra],
  hint,
  successMessage: success,
  ...(mustFail ? { mustFail } : {}),
  ...(rows !== undefined ? { expectRows: rows } : {}),
  ...(claims ? { claims } : {}),
  ...(revealSolution === false ? { revealSolution: false } : {}),
});

const STAFF = `CREATE TABLE staff (
  id         integer PRIMARY KEY,
  full_name  text NOT NULL,
  manager_id integer REFERENCES staff (id)
);
INSERT INTO staff VALUES
  (1, 'Funmi Adebayo', NULL), (2, 'Okafor Nnamdi', 1), (3, 'Bello Aisha', 1),
  (4, 'Musa Sani', 2), (5, 'Eze Ngozi', 2), (6, 'Ade Tolu', 3), (7, 'Grace Ibe', 1), (8, 'Kola Ade', 4);`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 10.1 – 10.3 · COMMON TABLE EXPRESSIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l51-ctes",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "Common Table Expressions",
    subtitle: "WITH, step-by-step queries, and recursion",
    estimatedMinutes: 45,
    intro:
      "Last week's reports grew subqueries inside subqueries. CTEs untangle them: you name each step, then build the next step on it, reading top to bottom.",
    atoms: [
      {
        id: "a-db-cte",
        title: "Common table expressions with WITH",
        explain:
          "WITH name AS (query) SELECT … FROM name; defines a named, temporary result that the main query can use like a table. Several CTEs are separated by commas, and each can use the ones before it: WITH paid AS (…), late AS (… FROM paid …) SELECT … The CTE exists only for that one statement. CTEs make long queries readable and let you test each step on its own. In PostgreSQL 12 and later the planner normally inlines simple CTEs, so they cost nothing extra.",
        sqlLab: ask(
          "Using a CTE named paid (enrollment_id and total paid per enrollment), return enrollment_id and total for enrollments that have paid at least the full price of their course. Join paid to enrollments and courses. Order by enrollment_id.",
          "WITH paid AS (\n  SELECT enrollment_id, sum(amount) AS total\n  FROM payments\n  GROUP BY enrollment_id\n)\nSELECT p.enrollment_id, p.total\nFROM paid AS p\nJOIN enrollments AS e ON e.id = p.enrollment_id\nJOIN courses AS c ON c.id = e.course_id\nWHERE p.total >= c.price\nORDER BY p.enrollment_id;\n",
          { ordered: true, rows: 13, hint: "WITH paid AS (SELECT enrollment_id, sum(amount) AS total FROM payments GROUP BY enrollment_id) — then join it like a table.", success: "First summarise, then compare: two clear steps instead of one tangled query.", extra: [{ label: "Uses a CTE called paid", source: "WITH\\s+paid\\s+AS" }] }
        ),
      },
      {
        id: "a-db-cte-steps",
        title: "Breaking a complex query into steps",
        explain:
          "Approach a hard question as a pipeline: one CTE per idea, each a small query you can run and check on its own. For 'students who owe money': step 1, what each enrollment cost (course price); step 2, what each enrollment paid; step 3, the difference; step 4, keep the debts and add names. When a number looks wrong, SELECT * FROM the step in question to find where it went wrong. Name steps after what they hold (paid, owed), not step1.",
        sqlLab: ask(
          "Students who still owe money. Build it in steps with CTEs: charges (enrollment id, student_id, course price) for enrollments that are not dropped; paid (enrollment_id, total paid); then return full_name, course title and owed (price minus paid, treating no payment as 0) where owed > 0, largest debt first, then full_name.",
          "WITH charges AS (\n  SELECT e.id, e.student_id, e.course_id, c.price\n  FROM enrollments AS e\n  JOIN courses AS c ON c.id = e.course_id\n  WHERE e.status <> 'dropped'\n),\npaid AS (\n  SELECT enrollment_id, sum(amount) AS total\n  FROM payments\n  GROUP BY enrollment_id\n)\nSELECT s.full_name,\n       co.title,\n       ch.price - coalesce(p.total, 0) AS owed\nFROM charges AS ch\nJOIN students AS s ON s.id = ch.student_id\nJOIN courses AS co ON co.id = ch.course_id\nLEFT JOIN paid AS p ON p.enrollment_id = ch.id\nWHERE ch.price - coalesce(p.total, 0) > 0\nORDER BY owed DESC, s.full_name;\n",
          { ordered: true, rows: 5, hint: "LEFT JOIN paid, so unpaid enrollments are kept, and coalesce(p.total, 0).", success: "A debtors' list in four readable steps. Run each CTE alone to see what it holds." }
        ),
      },
      {
        id: "a-db-recursive-cte",
        title: "Recursive CTE fundamentals",
        explain:
          "WITH RECURSIVE lets a CTE refer to itself, to walk hierarchies and sequences of unknown depth. It has two parts joined by UNION ALL: the ANCHOR (the starting rows) and the RECURSIVE term (rows derived from the previous step). It repeats until the recursive term returns nothing. Org charts, category trees, prerequisite chains and bill-of-materials are classic uses. Always make sure the recursion ends (it does when each step moves down a finite tree); an infinite one is stopped by the lab's time limit, and on a real server by statement_timeout.",
        sqlLab: ask(
          "Find everyone who reports, directly or indirectly, to Okafor Nnamdi (id 2): return id, full_name and level (1 for direct reports, 2 for their reports, …), ordered by level then id.",
          "WITH RECURSIVE team AS (\n  SELECT id, full_name, 1 AS level\n  FROM staff\n  WHERE manager_id = 2\n  UNION ALL\n  SELECT s.id, s.full_name, t.level + 1\n  FROM staff AS s\n  JOIN team AS t ON s.manager_id = t.id\n)\nSELECT id, full_name, level\nFROM team\nORDER BY level, id;\n",
          { setup: STAFF, ordered: true, rows: 3, hint: "Anchor: staff WHERE manager_id = 2, level 1. Recursive term: staff joined to team ON s.manager_id = t.id, level + 1.", success: "Musa and Eze report directly; Kola reports to Musa, so he is level 2." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 10.4 – 10.5 · VIEWS AND MATERIALIZED VIEWS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l52-views",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5"],
    title: "Views and Materialized Views",
    subtitle: "Saving queries as named, reusable objects",
    estimatedMinutes: 40,
    intro:
      "A good query is worth keeping. Views store it in the database under a name, so reports, dashboards and colleagues can use it like a table.",
    atoms: [
      {
        id: "a-db-views",
        title: "Views and their role in reusable queries",
        explain:
          "CREATE VIEW name AS query; saves the QUERY, not its result. Every SELECT from the view runs the query afresh, so the view is always up to date. Views hide complexity (a three-table join becomes one name), give everyone the same definition of a business figure, and support security (Week 14: give a role access to a view showing only some columns). CREATE OR REPLACE VIEW updates the definition. Simple single-table views can even be updated through. Views are covered again in Week 13 as part of database programming.",
        sqlLab: {
          ...ask(
            "Create a view enrollment_details with: enrollment id, student (full_name), course (title), enrolled_on and status, joining enrollments, students and courses. Then select the active rows from it, ordered by enrolled_on then id.",
            "CREATE VIEW enrollment_details AS\nSELECT e.id, s.full_name AS student, c.title AS course, e.enrolled_on, e.status\nFROM enrollments AS e\nJOIN students AS s ON s.id = e.student_id\nJOIN courses AS c ON c.id = e.course_id;\n\nSELECT *\nFROM enrollment_details\nWHERE status = 'active'\nORDER BY enrolled_on, id;\n",
            {
              ordered: true,
              rows: 11,
              hint: "CREATE VIEW enrollment_details AS SELECT …; then SELECT * FROM enrollment_details WHERE status = 'active' ORDER BY enrolled_on, id;",
              success: "Anyone can now ask for enrollment details without knowing the three tables behind them.",
              extra: [{ label: "enrollment_details is a view", assert: "SELECT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'enrollment_details')" }],
            }
          ),
        },
      },
      {
        id: "a-db-materialized-views",
        title: "Materialized views and refresh",
        explain:
          "CREATE MATERIALIZED VIEW name AS query; runs the query ONCE and STORES the result, like a table. Reading it is fast however expensive the query was, but the data is a snapshot: it does not change when the tables do, until you run REFRESH MATERIALIZED VIEW name. Use them for heavy reports read often and allowed to be a little stale (a nightly dashboard), refreshed on a schedule. REFRESH … CONCURRENTLY (with a unique index) lets people keep reading during the refresh. MySQL has no materialized views; a summary table refreshed by a scheduled job does the same work.",
        sqlLab: {
          ...ask(
            "Create a materialized view course_revenue (course_id, revenue = total payments). Then record a new payment of 50000 for enrollment 19 on 2026-06-15 by card, REFRESH the view, and select course_id and revenue from it ordered by course_id.",
            "CREATE MATERIALIZED VIEW course_revenue AS\nSELECT e.course_id, sum(p.amount) AS revenue\nFROM payments AS p\nJOIN enrollments AS e ON e.id = p.enrollment_id\nGROUP BY e.course_id;\n\nINSERT INTO payments (enrollment_id, amount, paid_on, method)\nVALUES (19, 50000, '2026-06-15', 'card');\n\nREFRESH MATERIALIZED VIEW course_revenue;\n\nSELECT course_id, revenue\nFROM course_revenue\nORDER BY course_id;\n",
            {
              ordered: true,
              rows: 5,
              hint: "Without the REFRESH, the view still shows the old Python revenue: it is a stored snapshot.",
              success: "Remove the REFRESH line and run it: course 3's revenue ignores the new payment until the view is refreshed.",
              mustFail: ["CREATE MATERIALIZED VIEW course_revenue AS SELECT e.course_id, sum(p.amount) AS revenue FROM payments p JOIN enrollments e ON e.id = p.enrollment_id GROUP BY e.course_id;\nINSERT INTO payments (enrollment_id, amount, paid_on, method) VALUES (19, 50000, '2026-06-15', 'card');\nSELECT course_id, revenue FROM course_revenue ORDER BY course_id;"],
            }
          ),
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 10.6 – 10.8 · WINDOW FUNCTIONS AND RANKING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l53-windows",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.6", "10.7", "10.8"],
    title: "Window Functions and Ranking",
    subtitle: "Row-level calculations over groups of rows",
    estimatedMinutes: 50,
    intro:
      "GROUP BY collapses rows into one per group. Window functions keep every row and add a calculation over a related set of rows: each student's score next to their course's average, or their rank in it.",
    atoms: [
      {
        id: "a-db-window-vs-group",
        title: "Window functions: grouped versus row-level calculations",
        explain:
          "An aggregate followed by OVER (…) becomes a WINDOW FUNCTION: avg(score) OVER (PARTITION BY course_id) gives each row the average of its course, WITHOUT collapsing the rows. The rows a window function sees are its WINDOW: OVER () is every row of the result; PARTITION BY splits it into groups. Window functions are computed after WHERE, GROUP BY and HAVING, so they cannot be used in WHERE; wrap the query in a CTE to filter on them.",
        sqlLab: ask(
          "For every enrollment that has a score: id, course_id, score, course_avg (the average score of that course, rounded to 1 dp, as a window function) and diff (score minus course_avg, rounded to 1 dp). Order by course_id, score DESC.",
          "SELECT id,\n       course_id,\n       score,\n       round(avg(score) OVER (PARTITION BY course_id), 1)         AS course_avg,\n       round(score - avg(score) OVER (PARTITION BY course_id), 1) AS diff\nFROM enrollments\nWHERE score IS NOT NULL\nORDER BY course_id, score DESC;\n",
          { ordered: true, rows: 7, hint: "avg(score) OVER (PARTITION BY course_id) — every row keeps its own score and gains its course's average.", success: "Seven rows, not three: the window added a group figure to each row instead of collapsing them.", extra: [{ label: "Uses a window function", source: "OVER\\s*\\(" }] }
        ),
      },
      {
        id: "a-db-ranking",
        title: "ROW_NUMBER, RANK and DENSE_RANK",
        explain:
          "Three ranking functions number rows in the window's ORDER BY. ROW_NUMBER() gives 1, 2, 3, 4… with no ties (ties are broken arbitrarily unless you add a tie-breaker). RANK() gives tied rows the same rank and then SKIPS: 1, 2, 2, 4. DENSE_RANK() gives ties the same rank WITHOUT gaps: 1, 2, 2, 3. They need ORDER BY inside OVER: rank() OVER (ORDER BY price DESC). Choose by meaning: competition places use RANK; 'the second-highest price' uses DENSE_RANK; picking exactly one row per position uses ROW_NUMBER.",
        sqlLab: ask(
          "Rank the courses by price, highest first: return code, price, row_number, rank and dense_rank (each as a column with that name), ordered by price DESC then code.",
          "SELECT code,\n       price,\n       row_number() OVER (ORDER BY price DESC, code) AS row_number,\n       rank()       OVER (ORDER BY price DESC)       AS rank,\n       dense_rank() OVER (ORDER BY price DESC)       AS dense_rank\nFROM courses\nORDER BY price DESC, code;\n",
          {
            setup: `${ACADEMY}\nUPDATE courses SET price = 60000 WHERE code = 'DB-101';`,
            ordered: true,
            rows: 5,
            hint: "Give row_number() a tie-breaker (price DESC, code) so its order is fixed. DB-101 now costs the same as DA-101.",
            success: "DA-101 and DB-101 tie at 60,000: rank gives both 3 and skips to 5; dense_rank gives both 3 and continues with 4.",
          }
        ),
      },
      {
        id: "a-db-partition-order",
        title: "PARTITION BY and window ordering",
        explain:
          "PARTITION BY splits the rows into independent windows, and the window's ORDER BY numbers or accumulates within each one: rank() OVER (PARTITION BY course_id ORDER BY score DESC) ranks students within their own course, restarting at 1 for each course. The window's ORDER BY is separate from the query's ORDER BY, which only sorts the final output. Several window functions with the same window can share it: WINDOW w AS (PARTITION BY course_id ORDER BY score DESC), then rank() OVER w.",
        sqlLab: ask(
          "Rank each scored enrollment within its course: course_id, student_id, score and place (dense_rank by score, highest first, restarting per course). Order by course_id, place, student_id.",
          "SELECT course_id,\n       student_id,\n       score,\n       dense_rank() OVER (PARTITION BY course_id ORDER BY score DESC) AS place\nFROM enrollments\nWHERE score IS NOT NULL\nORDER BY course_id, place, student_id;\n",
          { ordered: true, rows: 7, hint: "dense_rank() OVER (PARTITION BY course_id ORDER BY score DESC) AS place.", success: "Every course has its own first place." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 10.9 – 10.10 · RUNNING TOTALS, MOVING AVERAGES, LAG, LEAD
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l54-running",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.9", "10.10"],
    title: "Running Totals, Moving Averages, LAG and LEAD",
    subtitle: "Calculations that look along the rows",
    estimatedMinutes: 45,
    intro:
      "Business questions are often about change over time: revenue so far this year, the trend over the last three months, the difference from last month. Ordered windows answer all of them.",
    atoms: [
      {
        id: "a-db-running-moving",
        title: "Running totals and moving averages",
        explain:
          "With ORDER BY inside OVER, an aggregate becomes CUMULATIVE: sum(amount) OVER (ORDER BY paid_on) is the running total up to each row. The FRAME clause controls exactly which rows count: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW gives a 3-row moving window, so avg(…) over it is a 3-period moving average. Without a frame, an ordered window means 'from the first row to the current one, including rows that tie on the ORDER BY value'; specify ROWS explicitly when ties matter.",
        sqlLab: ask(
          "Monthly revenue with a running total and a 3-month moving average: month (date_trunc to date), revenue, running_total and moving_avg_3 (rounded to 2 dp). Aggregate per month in a CTE first, then apply the window functions. In month order.",
          "WITH monthly AS (\n  SELECT date_trunc('month', paid_on)::date AS month,\n         sum(amount)                       AS revenue\n  FROM payments\n  GROUP BY 1\n)\nSELECT month,\n       revenue,\n       sum(revenue) OVER (ORDER BY month)                                          AS running_total,\n       round(avg(revenue) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3\nFROM monthly\nORDER BY month;\n",
          { ordered: true, rows: 6, hint: "First a CTE with one row per month, then sum(revenue) OVER (ORDER BY month) and avg(revenue) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).", success: "The running total's last value is all revenue received; the moving average smooths month-to-month noise." }
        ),
      },
      {
        id: "a-db-lag-lead",
        title: "LAG and LEAD",
        explain:
          "LAG(value) OVER (ORDER BY …) returns the value from the PREVIOUS row of the window; LEAD from the NEXT. lag(revenue) OVER (ORDER BY month) is last month's revenue, so revenue − lag(revenue) is the change and the ratio is the growth rate. The first row has no previous row, so LAG gives NULL (or a default: lag(revenue, 1, 0)). With PARTITION BY, the previous row is looked up within the same group: each student's previous payment.",
        sqlLab: ask(
          "Month-over-month change: month, revenue, previous (last month's revenue), and change (revenue minus previous). Use a monthly CTE and LAG. In month order.",
          "WITH monthly AS (\n  SELECT date_trunc('month', paid_on)::date AS month,\n         sum(amount)                       AS revenue\n  FROM payments\n  GROUP BY 1\n)\nSELECT month,\n       revenue,\n       lag(revenue) OVER (ORDER BY month)           AS previous,\n       revenue - lag(revenue) OVER (ORDER BY month) AS change\nFROM monthly\nORDER BY month;\n",
          { ordered: true, rows: 6, hint: "lag(revenue) OVER (ORDER BY month) — the first month has no previous one, so it is NULL.", success: "January's change is NULL, honestly: there is no December to compare with." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 10.11 – 10.12 · TOP-N PER GROUP AND COHORTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l55-topn-cohorts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.11", "10.12"],
    title: "Top-N per Group and Cohort Analysis",
    subtitle: "The best few in each group, and following a group over time",
    estimatedMinutes: 45,
    intro:
      "Two patterns that appear in nearly every analytics job: 'the top three in each category' and 'how did the people who started together get on?'.",
    atoms: [
      {
        id: "a-db-top-n",
        title: "Top-N records within groups",
        explain:
          "LIMIT gives the top N of the WHOLE result, not of each group. For the top N per group: number the rows within each group with a window function in a CTE, then keep the rows numbered N or less in the outer query. Use ROW_NUMBER for exactly N per group, or RANK / DENSE_RANK to include ties. PostgreSQL's DISTINCT ON (group) … ORDER BY group, value DESC is a shortcut for the top 1.",
        sqlLab: ask(
          "The most recent payment of each payment method: method, paid_on, enrollment_id and amount, keeping exactly one row per method (latest paid_on; if two share a date, the higher payment id wins). Order by method.",
          "WITH numbered AS (\n  SELECT method, paid_on, enrollment_id, amount,\n         row_number() OVER (PARTITION BY method ORDER BY paid_on DESC, id DESC) AS n\n  FROM payments\n)\nSELECT method, paid_on, enrollment_id, amount\nFROM numbered\nWHERE n = 1\nORDER BY method;\n",
          {
            ordered: true,
            rows: 3,
            hint: "row_number() OVER (PARTITION BY method ORDER BY paid_on DESC, id DESC) in a CTE; then WHERE n = 1.",
            success: "One row per method. LIMIT 1 would have returned one row in total.",
            mustFail: ["SELECT method, paid_on, enrollment_id, amount FROM payments ORDER BY paid_on DESC LIMIT 3;"],
          }
        ),
      },
      {
        id: "a-db-cohorts",
        title: "Introductory cohort and completion analysis",
        explain:
          "A COHORT is a group that shares a starting point: students who enrolled in the same month. Cohort analysis follows each group: of January's enrollments, how many completed? Of February's? Comparing cohorts shows whether things are improving (did the new mentoring scheme from March help?) in a way overall totals cannot, because overall totals mix old and new students. The recipe: assign each row its cohort (date_trunc on the start date), then aggregate per cohort, often with FILTER for each outcome.",
        sqlLab: ask(
          "Enrollment cohorts: cohort (month of enrolled_on, as a date), enrolled (count), completed, dropped, and completion_pct (completed as a % of enrolled, 1 dp). In cohort order.",
          "SELECT date_trunc('month', enrolled_on)::date                              AS cohort,\n       count(*)                                                             AS enrolled,\n       count(*) FILTER (WHERE status = 'completed')                         AS completed,\n       count(*) FILTER (WHERE status = 'dropped')                           AS dropped,\n       round(count(*) FILTER (WHERE status = 'completed') * 100.0 / count(*), 1) AS completion_pct\nFROM enrollments\nGROUP BY 1\nORDER BY cohort;\n",
          { ordered: true, rows: 5, hint: "Group by date_trunc('month', enrolled_on)::date and count with FILTER.", success: "The early cohorts look better partly because they have had longer to finish: always ask how much time each cohort has had." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 10.P · PRACTICAL: THE LEARNER-PERFORMANCE REPORT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l56-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.P"],
    title: "Week 10 Practical: The Learner-Performance Report",
    subtitle: "Rankings, running totals and monthly completion rates",
    estimatedMinutes: 70,
    intro:
      "The checkpoint: a readable analytical query using CTEs and at least two window functions. Three parts, each checked on its result and on how it is written.",
    atoms: [
      {
        id: "a-db-p10-rank",
        title: "Rank students within their courses",
        explain:
          "For every scored enrollment: course (title), student (full_name), score, place (DENSE_RANK within the course by score, highest first) and gap_to_top (the course's best score minus this score, using max() OVER). Use a CTE for the joined, scored rows and window functions on top. Order by course, place, student.",
        sqlLab: ask(
          "Rank scored enrollments within each course: course, student, score, place (dense_rank in course, highest first), gap_to_top (course max minus score). Order by course, place, student. Use a CTE.",
          "WITH scored AS (\n  SELECT c.title AS course, s.full_name AS student, e.score\n  FROM enrollments AS e\n  JOIN students AS s ON s.id = e.student_id\n  JOIN courses  AS c ON c.id = e.course_id\n  WHERE e.score IS NOT NULL\n)\nSELECT course,\n       student,\n       score,\n       dense_rank() OVER (PARTITION BY course ORDER BY score DESC) AS place,\n       max(score)   OVER (PARTITION BY course) - score              AS gap_to_top\nFROM scored\nORDER BY course, place, student;\n",
          { ordered: true, rows: 7, revealSolution: false, hint: "Two window functions over PARTITION BY course: dense_rank() with ORDER BY score DESC, and max(score) with no ORDER BY.", success: "Places and gaps per course from one readable query.", extra: [{ label: "Uses a CTE", source: "\\bWITH\\b" }, { label: "Uses at least two window functions", source: "OVER[\\s\\S]*OVER" }] }
        ),
      },
      {
        id: "a-db-p10-running",
        title: "Running enrollment totals",
        explain:
          "Enrollments over time: for each date on which someone enrolled, the number of enrollments that day (new) and the running total of enrollments so far (to_date), in date order. Aggregate per day in a CTE, then a running sum.",
        sqlLab: ask(
          "Running enrollments: enrolled_on, new (enrollments that day), to_date (running total). In date order. Use a CTE and a window function.",
          "WITH daily AS (\n  SELECT enrolled_on, count(*) AS new\n  FROM enrollments\n  GROUP BY enrolled_on\n)\nSELECT enrolled_on,\n       new,\n       sum(new) OVER (ORDER BY enrolled_on) AS to_date\nFROM daily\nORDER BY enrolled_on;\n",
          { ordered: true, rows: 16, revealSolution: false, hint: "Per-day counts in a CTE, then sum(new) OVER (ORDER BY enrolled_on).", success: "The last to_date is every enrollment the academy has taken.", extra: [{ label: "Uses a CTE and a window function", source: "\\bWITH\\b[\\s\\S]*OVER" }] }
        ),
      },
      {
        id: "a-db-p10-monthly-completion",
        title: "Compare monthly completion rates",
        explain:
          "Completions by month of completion: month (date_trunc of completed_on), completions, avg_score (1 dp), and change_from_prev (this month's completions minus the previous month's, with LAG). Only rows with a completed_on. In month order.",
        sqlLab: ask(
          "Monthly completions: month, completions, avg_score (1 dp), change_from_prev (completions minus the previous month's, via LAG). Only completed enrollments. In month order. Use a CTE.",
          "WITH monthly AS (\n  SELECT date_trunc('month', completed_on)::date AS month,\n         count(*)                               AS completions,\n         round(avg(score), 1)                   AS avg_score\n  FROM enrollments\n  WHERE completed_on IS NOT NULL\n  GROUP BY 1\n)\nSELECT month,\n       completions,\n       avg_score,\n       completions - lag(completions) OVER (ORDER BY month) AS change_from_prev\nFROM monthly\nORDER BY month;\n",
          { ordered: true, rows: 3, revealSolution: false, hint: "A monthly CTE filtered to completed_on IS NOT NULL, then lag(completions) OVER (ORDER BY month).", success: "Three months of completions and how each compares with the one before.", extra: [{ label: "Uses LAG", source: "\\blag\\s*\\(" }] }
        ),
      },
    ],
    task: {
      title: "Week 10 practical: the learner-performance report",
      intro: "Combine the three parts into one documented report.",
      prompts: [
        "Run all three queries on your own server, and save the course-ranking query as a view called learner_rankings.",
        "Write a short paragraph for each part explaining what each window function computes and over which rows (its partition and order).",
        "Add the cohort query from Lesson 55 and comment on what it shows, including how much time each cohort has had.",
        "Make one of your queries a materialized view, add a payment or completion, and show the view before and after REFRESH.",
        "Checkpoint: deliver a readable analytical query using CTEs and at least two window functions.",
      ],
      closing: "Next: Week 11, transactions and concurrency: keeping data correct when many users act at once.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
