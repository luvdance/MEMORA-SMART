/**
 * RELATIONAL DATABASES · WEEK 9 · JOINS, SUBQUERIES AND SET OPERATIONS
 *
 * Curriculum 9.1 – 9.P. Why data is split across tables; INNER, LEFT, RIGHT
 * and FULL OUTER joins; self joins; three or more tables and junction tables;
 * aliases and qualified names; how join conditions change results (ON versus
 * WHERE); why joins multiply rows; scalar and correlated subqueries; EXISTS
 * and NOT EXISTS (and the NOT IN trap); UNION, UNION ALL, INTERSECT and
 * EXCEPT; and finding and fixing duplicate results.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s9-joins";
const MODULE = "db-m9-joins";

const ask = (task, solution, { starter = "", ordered = false, hint, success, mustFail, rows, names = true, setup = ACADEMY, claims, revealSolution } = {}) => ({
  setup,
  task,
  starter,
  solution,
  checks: [{ label: ordered ? "The right rows, columns and order" : "The right rows and columns", result: { ordered, names } }],
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
  role       text NOT NULL,
  manager_id integer REFERENCES staff (id)
);
INSERT INTO staff VALUES
  (1, 'Funmi Adebayo', 'Director',            NULL),
  (2, 'Okafor Nnamdi', 'Head of Data',        1),
  (3, 'Bello Aisha',   'Head of Engineering', 1),
  (4, 'Musa Sani',     'Instructor',          2),
  (5, 'Eze Ngozi',     'Instructor',          2),
  (6, 'Ade Tolu',      'Instructor',          3),
  (7, 'Grace Ibe',     'Administrator',       1);`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 9.1 – 9.2 · WHY JOIN, AND INNER JOIN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l44-inner-join",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "Why Join, and INNER JOIN",
    subtitle: "Putting the pieces of a normalized database back together",
    estimatedMinutes: 40,
    intro:
      "Normalization split the academy into tables so each fact is stored once. Joins are how you ask questions that need facts from several of them at once.",
    atoms: [
      {
        id: "a-db-why-join",
        title: "Why related information is stored across tables",
        explain:
          "An enrollment row holds student_id 3 and course_id 1, not 'Chiamaka Eze' and 'Data Analysis'. That is deliberate (Week 4): the name and the title are stored once, in students and courses, so they cannot disagree and can be changed in one place. The price is that a question like 'which students are taking Data Analysis?' needs facts from three tables. A JOIN combines rows from two tables wherever a condition matches, usually a foreign key equal to the primary key it references: ON enrollments.student_id = students.id.",
        decision: decide({
          scenario: "A new developer proposes adding student_name and course_title columns to enrollments 'so reports do not need joins'.",
          question: "What is the best response?",
          right: ["Keep the design normalized and join in queries; copied names would drift out of date and reintroduce update anomalies", "Joins are cheap; inconsistent data is expensive."],
          wrong: [
            ["Agree: joins are always slow", "Joins on keys are what relational databases are built to do quickly."],
            ["Agree, and remove students and courses", "Then student and course facts are lost."],
            ["Add the columns but never update them", "Then they are wrong as soon as anything changes."],
          ],
          at: 0,
          aftermath: "Store facts once; reassemble them with joins whenever you need them.",
        }),
      },
      {
        id: "a-db-inner-join",
        title: "INNER JOIN",
        explain:
          "FROM enrollments JOIN students ON students.id = enrollments.student_id pairs every enrollment with the student it refers to. INNER JOIN (JOIN means the same) keeps only PAIRS THAT MATCH: a row with no partner on the other side disappears from the result. You can then select columns from both tables. Join on the keys that model the relationship; the condition decides what 'matching' means. Joins can be chained: … JOIN courses ON courses.id = enrollments.course_id.",
        sqlLab: ask(
          "List every enrollment with the student's full_name, the course's title and the enrollment's status, ordered by full_name then title.",
          "SELECT students.full_name, courses.title, enrollments.status\nFROM enrollments\nJOIN students ON students.id = enrollments.student_id\nJOIN courses  ON courses.id  = enrollments.course_id\nORDER BY students.full_name, courses.title;\n",
          { ordered: true, rows: 21, hint: "Two JOINs, each ON a foreign key = primary key. Select full_name, title and status.", success: "Twenty-one enrollments, now with names and titles instead of numbers." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 9.3 · OUTER JOINS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l45-outer-joins",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3"],
    title: "LEFT, RIGHT and FULL OUTER JOIN",
    subtitle: "Keeping rows that have no match",
    estimatedMinutes: 40,
    intro:
      "Some of the most important questions are about what is missing: students with no payments, courses with no certificates, enrollments with no score. Inner joins hide exactly those rows. Outer joins keep them.",
    atoms: [
      {
        id: "a-db-left-join",
        title: "LEFT JOIN",
        explain:
          "A LEFT JOIN keeps EVERY row of the left table, matched or not; where there is no match, the right table's columns are NULL. FROM enrollments LEFT JOIN certificates ON certificates.enrollment_id = enrollments.id lists all enrollments, with a certificate number where one exists and NULL where not. Add WHERE certificates.id IS NULL to keep only the unmatched rows: an 'anti-join', the standard way to find what is missing.",
        sqlLab: ask(
          "Which COMPLETED enrollments have no certificate yet? Return enrollment id, student_id and completed_on for completed enrollments with no matching row in certificates.",
          "SELECT e.id, e.student_id, e.completed_on\nFROM enrollments AS e\nLEFT JOIN certificates AS c ON c.enrollment_id = e.id\nWHERE e.status = 'completed'\n  AND c.id IS NULL;\n",
          {
            rows: 1,
            hint: "LEFT JOIN certificates, then keep rows where the certificate side IS NULL.",
            success: "One completed enrollment (Halima's Python, enrollment 14) still has no certificate: a job for the admin team, found by a query.",
            claims: [{ sql: "SELECT e.id FROM enrollments e LEFT JOIN certificates c ON c.enrollment_id = e.id WHERE e.status = 'completed' AND c.id IS NULL", equals: 14 }],
            mustFail: ["SELECT e.id, e.student_id, e.completed_on FROM enrollments e JOIN certificates c ON c.enrollment_id = e.id WHERE e.status = 'completed';"],
          }
        ),
      },
      {
        id: "a-db-right-full",
        title: "RIGHT JOIN and FULL OUTER JOIN",
        explain:
          "A RIGHT JOIN is the mirror image: it keeps every row of the RIGHT table. A RIGHT JOIN B is the same as B LEFT JOIN A, so most people write LEFT JOINs only and put the 'keep everything' table first. A FULL OUTER JOIN keeps unmatched rows from BOTH sides: useful for reconciliation, such as comparing two lists to find what is in one but not the other. MySQL has no FULL OUTER JOIN; it is emulated with a LEFT JOIN UNION a RIGHT JOIN.",
        sqlLab: ask(
          "The academy has just added a UI/UX Design course. For EVERY course (including any with no enrollments), return title and enrollments (the number of enrollments, 0 if none), ordered by title. Use a LEFT JOIN from courses.",
          "SELECT c.title,\n       count(e.id) AS enrollments\nFROM courses AS c\nLEFT JOIN enrollments AS e ON e.course_id = c.id\nGROUP BY c.title\nORDER BY c.title;\n",
          {
            setup: `${ACADEMY}\nINSERT INTO courses (code, title, category, price, duration_weeks) VALUES ('UX-101', 'UI/UX Design', 'design', 65000, 12);`,
            ordered: true,
            rows: 6,
            hint: "count(e.id), not count(*): a course with no enrollments still has one row from the LEFT JOIN, with e.id NULL.",
            success: "The brand-new UI/UX Design course shows 0. An inner join would hide it, and count(*) would claim it has 1.",
            mustFail: [
              "SELECT c.title, count(*) AS enrollments FROM courses c JOIN enrollments e ON e.course_id = c.id GROUP BY c.title ORDER BY c.title;",
              "SELECT c.title, count(*) AS enrollments FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id GROUP BY c.title ORDER BY c.title;",
            ],
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 9.4 – 9.7 · SELF JOINS, MANY TABLES, JUNCTIONS, ALIASES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l46-self-multi",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.4", "9.5", "9.6", "9.7"],
    title: "Self Joins, Many Tables and Junction Tables",
    subtitle: "Joining a table to itself, chaining joins, and aliases",
    estimatedMinutes: 50,
    intro:
      "Real reports chain several joins: through junction tables, across four or five tables, and sometimes back into the same table.",
    atoms: [
      {
        id: "a-db-self-join",
        title: "Self joins",
        explain:
          "A SELF JOIN joins a table to itself, for relationships between rows of the same table: an employee and their manager (both in staff), a lesson and its prerequisite, a referral and the referrer. The table must appear twice with different ALIASES so each copy can be named: FROM staff AS s JOIN staff AS m ON m.id = s.manager_id. Use a LEFT JOIN to keep the person at the top, who has no manager.",
        sqlLab: ask(
          "List every staff member's full_name as employee and their manager's full_name as manager (NULL for the director), ordered by employee.",
          "SELECT s.full_name AS employee,\n       m.full_name AS manager\nFROM staff AS s\nLEFT JOIN staff AS m ON m.id = s.manager_id\nORDER BY employee;\n",
          {
            setup: STAFF,
            ordered: true,
            rows: 7,
            hint: "staff twice: s for the employee, m for the manager, joined ON m.id = s.manager_id. LEFT JOIN keeps the director.",
            success: "Seven people. An inner join would have dropped the director, who reports to nobody.",
          }
        ),
      },
      {
        id: "a-db-many-tables",
        title: "Joining three or more tables",
        explain:
          "Joins chain left to right: each JOIN adds one table, connected by its own ON condition to a table already in the query. To go from payments to the student who paid, follow the keys: payments → enrollments (payments.enrollment_id = enrollments.id) → students (enrollments.student_id = students.id), and → courses for the title. Draw the path on the ERD first; every hop needs a condition, and a missing one multiplies rows (Lesson 47).",
        sqlLab: ask(
          "List every payment with paid_on, the student's full_name, the course title and the amount, ordered by paid_on then full_name.",
          "SELECT p.paid_on, s.full_name, c.title, p.amount\nFROM payments AS p\nJOIN enrollments AS e ON e.id = p.enrollment_id\nJOIN students    AS s ON s.id = e.student_id\nJOIN courses     AS c ON c.id = e.course_id\nORDER BY p.paid_on, s.full_name;\n",
          { ordered: true, rows: 19, hint: "payments → enrollments → students, and enrollments → courses. Three JOINs.", success: "Nineteen payments, each traced to a person and a course across four tables." }
        ),
      },
      {
        id: "a-db-junction-join",
        title: "Joining through junction tables",
        explain:
          "A many-to-many relationship is stored in a junction table (Week 3), so querying it always takes TWO joins: from one side INTO the junction, and OUT to the other side. 'Which courses has Ada taken?' is students → enrollments → courses. 'Which lessons has Chiamaka completed, in which course?' is students → lesson_completions → lessons → courses. The junction table often carries the most interesting facts (dates, statuses, scores), so select from it too.",
        sqlLab: ask(
          "Which lessons has Chiamaka Eze completed? Return course title, lesson position, lesson title and completed_on, ordered by completed_on.",
          "SELECT c.title AS course, l.position, l.title AS lesson, lc.completed_on\nFROM students AS s\nJOIN lesson_completions AS lc ON lc.student_id = s.id\nJOIN lessons AS l ON l.id = lc.lesson_id\nJOIN courses AS c ON c.id = l.course_id\nWHERE s.full_name = 'Chiamaka Eze'\nORDER BY lc.completed_on;\n",
          { ordered: true, rows: 4, hint: "students → lesson_completions → lessons → courses, filtered on the student's name. Name your columns course, position, lesson, completed_on.", success: "Four lessons across two courses, via the junction table that records each completion." }
        ),
      },
      {
        id: "a-db-aliases-qualified",
        title: "Table aliases and qualified column names",
        explain:
          "When two joined tables have a column with the same name (id, title, created_on), an unqualified reference is AMBIGUOUS and PostgreSQL refuses: 'column reference \"title\" is ambiguous'. QUALIFY it with the table: courses.title, lessons.title. Table ALIASES (FROM courses AS c, or just courses c) keep qualified names short. Good practice in any multi-table query: alias every table and qualify every column, even unambiguous ones, so the reader knows where each comes from and adding a table later cannot break the query.",
        sqlLab: ask(
          "This query fails because of ambiguous names. Fix it with aliases so it returns the course title as course, the lesson title as lesson, and minutes, for all lessons of 30 minutes or less, ordered by course then lesson.",
          "SELECT c.title AS course, l.title AS lesson, l.minutes\nFROM lessons AS l\nJOIN courses AS c ON c.id = l.course_id\nWHERE l.minutes <= 30\nORDER BY course, lesson;\n",
          {
            starter: "SELECT title, title, minutes\nFROM lessons\nJOIN courses ON id = course_id\nWHERE minutes <= 30\nORDER BY title;\n",
            ordered: true,
            rows: 4,
            hint: "Alias lessons as l and courses as c, then write c.title AS course, l.title AS lesson, and ON c.id = l.course_id.",
            success: "Every column now says where it comes from, and the query cannot become ambiguous later.",
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 9.8 – 9.9 · JOIN CONDITIONS AND MULTIPLIED ROWS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l47-join-conditions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.8", "9.9"],
    title: "How Join Conditions Change Results",
    subtitle: "ON versus WHERE, and joins that multiply rows",
    estimatedMinutes: 45,
    intro:
      "Most wrong reports are not syntax errors. They are joins that silently drop rows or silently count them twice. This lesson is about recognising both.",
    atoms: [
      {
        id: "a-db-on-vs-where",
        title: "How join conditions affect results: ON versus WHERE",
        explain:
          "In an INNER JOIN it makes no difference whether a filter is in ON or WHERE. In a LEFT JOIN it matters a great deal. A condition on the RIGHT table in the ON clause restricts which rows MATCH, and unmatched left rows are still kept (with NULLs). The same condition in WHERE runs after the join and throws away every row where the right side is NULL, quietly turning the LEFT JOIN into an inner join. Rule: in a LEFT JOIN, conditions about the right-hand table go in ON.",
        sqlLab: ask(
          "For EVERY student, count their card payments (0 if none). Return full_name and card_payments, ordered by full_name. The starter loses students; fix it.",
          "SELECT s.full_name, count(p.id) AS card_payments\nFROM students AS s\nLEFT JOIN enrollments AS e ON e.student_id = s.id\nLEFT JOIN payments AS p ON p.enrollment_id = e.id AND p.method = 'card'\nGROUP BY s.full_name\nORDER BY s.full_name;\n",
          {
            starter: "SELECT s.full_name, count(p.id) AS card_payments\nFROM students AS s\nLEFT JOIN enrollments AS e ON e.student_id = s.id\nLEFT JOIN payments AS p ON p.enrollment_id = e.id\nWHERE p.method = 'card'\nGROUP BY s.full_name\nORDER BY s.full_name;\n",
            ordered: true,
            rows: 12,
            hint: "Move p.method = 'card' from WHERE into the payments JOIN's ON clause.",
            success: "All twelve students, with zeros. The WHERE version dropped everyone who never paid by card.",
          }
        ),
      },
      {
        id: "a-db-row-multiplication",
        title: "Why joins can multiply rows",
        explain:
          "A join produces one row per MATCHING PAIR. Joining a student to their 2 enrollments gives 2 rows; joining those to 3 payments and 4 lesson completions gives every combination, 2 × 3 × 4 rows, and every SUM over them counts the same money several times. This 'fan-out' is the commonest cause of inflated totals. The cure: aggregate each child table SEPARATELY first (in a subquery or CTE), then join the one-row-per-key summaries, or use subqueries in the SELECT list.",
        sqlLab: ask(
          "The starter reports each student's total paid and lessons completed, but the totals are inflated by fan-out. Fix it so total_paid and lessons are correct: aggregate payments and completions per student SEPARATELY, then join. Return full_name, total_paid (0 if none), lessons (0 if none), ordered by full_name.",
          "SELECT s.full_name,\n       coalesce(pay.total_paid, 0) AS total_paid,\n       coalesce(done.lessons, 0)   AS lessons\nFROM students AS s\nLEFT JOIN (\n  SELECT e.student_id, sum(p.amount) AS total_paid\n  FROM payments AS p\n  JOIN enrollments AS e ON e.id = p.enrollment_id\n  GROUP BY e.student_id\n) AS pay ON pay.student_id = s.id\nLEFT JOIN (\n  SELECT student_id, count(*) AS lessons\n  FROM lesson_completions\n  GROUP BY student_id\n) AS done ON done.student_id = s.id\nORDER BY s.full_name;\n",
          {
            starter: "SELECT s.full_name,\n       coalesce(sum(p.amount), 0) AS total_paid,\n       count(lc.lesson_id)        AS lessons\nFROM students AS s\nLEFT JOIN enrollments AS e ON e.student_id = s.id\nLEFT JOIN payments AS p ON p.enrollment_id = e.id\nLEFT JOIN lesson_completions AS lc ON lc.student_id = s.id\nGROUP BY s.full_name\nORDER BY s.full_name;\n",
            ordered: true,
            rows: 12,
            hint: "Two subqueries in FROM, each grouped by student_id, then LEFT JOIN both to students. Each summary has one row per student, so nothing multiplies.",
            success: "Compare with the starter: Ada had paid 115,000, not the 460,000 the fan-out reported.",
            claims: [{ sql: "SELECT sum(p.amount) FROM payments p JOIN enrollments e ON e.id = p.enrollment_id WHERE e.student_id = 1", equals: "115000.00" }],
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 9.10 – 9.11 · SUBQUERIES AND EXISTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l48-subqueries",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.10", "9.11"],
    title: "Subqueries, EXISTS and NOT EXISTS",
    subtitle: "Queries inside queries",
    estimatedMinutes: 45,
    intro:
      "A subquery is a query used as a value, a list or a table inside another query. Some questions are clearer as a subquery than as a join, especially 'is there any…?' and 'is there none…?'.",
    atoms: [
      {
        id: "a-db-scalar-correlated",
        title: "Scalar and correlated subqueries",
        explain:
          "A SCALAR subquery returns one value and can be used wherever a value can: WHERE price > (SELECT avg(price) FROM courses). It must return at most one row and one column. A CORRELATED subquery refers to the outer query's current row, so it is evaluated once per row: (SELECT count(*) FROM enrollments AS e WHERE e.course_id = c.id) gives each course's own count. Correlated subqueries in the SELECT list are a clean way to add per-row figures without fan-out.",
        sqlLab: ask(
          "Return each course's title, price, and two subquery columns: students (the number of enrollments in that course, correlated) and above_avg_price (true when the price is above the average price of all courses, scalar). Order by title.",
          "SELECT c.title,\n       c.price,\n       (SELECT count(*) FROM enrollments AS e WHERE e.course_id = c.id) AS students,\n       c.price > (SELECT avg(price) FROM courses)                       AS above_avg_price\nFROM courses AS c\nORDER BY c.title;\n",
          { ordered: true, rows: 5, hint: "The correlated subquery's WHERE refers to c.id from the outer query.", success: "One subquery ran per course; the other ran once and was compared with every price." }
        ),
      },
      {
        id: "a-db-exists",
        title: "EXISTS and NOT EXISTS",
        explain:
          "EXISTS (subquery) is true when the subquery returns at least one row; NOT EXISTS when it returns none. It answers 'is there any…' without counting or multiplying rows: students WHERE EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id AND e.status = 'dropped'). Beware NOT IN with a subquery: if the subquery returns any NULL, x NOT IN (…) is never true and the query silently returns nothing. NOT EXISTS has no such trap, so prefer it.",
        sqlLab: ask(
          "Which students have NEVER completed a single lesson? Return full_name, ordered by full_name, using NOT EXISTS.",
          "SELECT s.full_name\nFROM students AS s\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM lesson_completions AS lc\n  WHERE lc.student_id = s.id\n)\nORDER BY s.full_name;\n",
          {
            ordered: true,
            rows: 3,
            hint: "WHERE NOT EXISTS (SELECT 1 FROM lesson_completions lc WHERE lc.student_id = s.id).",
            success: "Three students with no completed lessons: candidates for a friendly reminder.",
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 9.12 – 9.13 · SET OPERATIONS AND DUPLICATES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l49-set-ops",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.12", "9.13"],
    title: "Set Operations and Duplicate Results",
    subtitle: "UNION, UNION ALL, INTERSECT, EXCEPT, and where duplicates come from",
    estimatedMinutes: 40,
    intro:
      "Joins put tables side by side. Set operations stack the results of two queries on top of each other, or compare them.",
    atoms: [
      {
        id: "a-db-set-operations",
        title: "UNION, UNION ALL, INTERSECT and EXCEPT",
        explain:
          "Set operations combine two queries with the SAME number of columns and compatible types. UNION returns the rows in either result, removing duplicates; UNION ALL keeps every row (faster, and correct when duplicates are meaningful, such as summing). INTERSECT returns rows in both; EXCEPT returns rows in the first but not the second. Column names come from the first query; ORDER BY goes once, at the end. MySQL 8 supports UNION; INTERSECT and EXCEPT arrived in 8.0.31.",
        sqlLab: ask(
          "Which student_ids enrolled in course 1 (Data Analysis) but NOT in course 3 (Python Programming)? Use EXCEPT; order by student_id.",
          "SELECT student_id FROM enrollments WHERE course_id = 1\nEXCEPT\nSELECT student_id FROM enrollments WHERE course_id = 3\nORDER BY student_id;\n",
          { ordered: true, rows: 2, hint: "Two SELECTs of student_id joined by EXCEPT, then one ORDER BY at the end.", success: "Data Analysis students who have not tried Python: a ready-made marketing list." }
        ),
      },
      {
        id: "a-db-duplicate-results",
        title: "Identifying and correcting duplicate-result problems",
        explain:
          "When a query returns repeated rows you did not expect, find out WHY before reaching for DISTINCT. Typical causes: a join to a 'many' table you did not need (joining enrollments to list students repeats each student per enrollment); a missing or wrong join condition; UNION ALL where UNION was meant. DISTINCT hides the symptom but keeps the cost and can hide real errors. Better fixes: remove the unneeded join, use EXISTS for 'has any', or aggregate first. Check by counting: SELECT count(*), count(DISTINCT student_id).",
        sqlLab: ask(
          "The starter lists students who have paid by transfer, but repeats some of them. Rewrite it with EXISTS (no DISTINCT, no join in the outer query) so each student appears once: full_name, ordered by full_name.",
          "SELECT s.full_name\nFROM students AS s\nWHERE EXISTS (\n  SELECT 1\n  FROM enrollments AS e\n  JOIN payments AS p ON p.enrollment_id = e.id\n  WHERE e.student_id = s.id\n    AND p.method = 'transfer'\n)\nORDER BY s.full_name;\n",
          {
            starter: "SELECT s.full_name\nFROM students AS s\nJOIN enrollments AS e ON e.student_id = s.id\nJOIN payments AS p ON p.enrollment_id = e.id\nWHERE p.method = 'transfer'\nORDER BY s.full_name;\n",
            ordered: true,
            rows: 6,
            hint: "WHERE EXISTS (SELECT 1 FROM enrollments e JOIN payments p ON … WHERE e.student_id = s.id AND p.method = 'transfer').",
            success: "Each student once, because the outer query only reads students: the many-side never fans out.",
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 9.P · PRACTICAL: THE STUDENT PROGRESS REPORT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l50-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["9.P"],
    title: "Week 9 Practical: The Student Progress Report",
    subtitle: "Students, courses, enrollments, lessons and certificates in one report",
    estimatedMinutes: 70,
    intro:
      "The checkpoint: the academy's progress report, joining five tables correctly, without losing rows that matter or counting anything twice. Then justify the join you chose.",
    atoms: [
      {
        id: "a-db-p9-report",
        title: "The progress report",
        explain:
          "One row per ENROLLMENT: student (full_name), course (title), status, lessons_done (how many of THAT course's lessons the student has completed: a correlated count joining lesson_completions to lessons on the course), lessons_total (how many lessons the course has), and certificate (the certificate_no, or NULL). Every enrollment must appear, with or without completions or a certificate. Order by student then course.",
        sqlLab: ask(
          "Progress report, one row per enrollment: student, course, status, lessons_done (that student's completed lessons of that course), lessons_total (lessons in that course), certificate (certificate_no or NULL). Order by student, course.",
          "SELECT s.full_name AS student,\n       c.title     AS course,\n       e.status,\n       (SELECT count(*)\n        FROM lesson_completions AS lc\n        JOIN lessons AS l ON l.id = lc.lesson_id\n        WHERE lc.student_id = e.student_id\n          AND l.course_id = e.course_id) AS lessons_done,\n       (SELECT count(*) FROM lessons AS l2 WHERE l2.course_id = e.course_id) AS lessons_total,\n       cert.certificate_no AS certificate\nFROM enrollments AS e\nJOIN students AS s ON s.id = e.student_id\nJOIN courses  AS c ON c.id = e.course_id\nLEFT JOIN certificates AS cert ON cert.enrollment_id = e.id\nORDER BY student, course;\n",
          { ordered: true, rows: 21, revealSolution: false, hint: "Start from enrollments; inner join students and courses (every enrollment has both); LEFT JOIN certificates; use correlated subqueries for the two counts so nothing fans out.", success: "Twenty-one rows, one per enrollment, and every count belongs to the right course." }
        ),
      },
      {
        id: "a-db-p9-incomplete",
        title: "Who is behind?",
        explain:
          "From the same tables: list ACTIVE enrollments where the student has completed FEWER than all of the course's lessons, with student, course and lessons_left (total minus done). Order by lessons_left descending, then student. Build on the previous query: a CTE (next week) or a subquery in FROM lets you filter on its computed columns.",
        sqlLab: ask(
          "Active enrollments not yet finished: student, course, lessons_left (course lessons minus the student's completed lessons of that course), only where lessons_left > 0. Order by lessons_left DESC, student.",
          "SELECT student, course, lessons_total - lessons_done AS lessons_left\nFROM (\n  SELECT s.full_name AS student,\n         c.title     AS course,\n         e.status,\n         (SELECT count(*)\n          FROM lesson_completions AS lc\n          JOIN lessons AS l ON l.id = lc.lesson_id\n          WHERE lc.student_id = e.student_id\n            AND l.course_id = e.course_id) AS lessons_done,\n         (SELECT count(*) FROM lessons AS l2 WHERE l2.course_id = e.course_id) AS lessons_total\n  FROM enrollments AS e\n  JOIN students AS s ON s.id = e.student_id\n  JOIN courses  AS c ON c.id = e.course_id\n) AS progress\nWHERE status = 'active'\n  AND lessons_total - lessons_done > 0\nORDER BY lessons_left DESC, student;\n",
          { ordered: true, rows: 11, revealSolution: false, hint: "Wrap the report (without the certificate) in a subquery in FROM, then filter and compute lessons_left outside it.", success: "Every active learner who still has lessons to do, the furthest behind first." }
        ),
      },
      {
        id: "a-db-p9-justify",
        title: "Justify the join type",
        explain:
          "The checkpoint asks you to explain WHY each join is the type it is. In the progress report, students and courses are inner joins because every enrollment must have both (the foreign keys are NOT NULL). certificates is a LEFT JOIN because most enrollments have none, and they must still appear.",
        decision: decide({
          scenario: "A colleague changes the progress report's LEFT JOIN certificates to an INNER JOIN 'to tidy it up'.",
          question: "What happens to the report?",
          right: ["It shrinks to the six certified enrollments; every enrollment without a certificate disappears", "An inner join keeps only matching pairs."],
          wrong: [
            ["Nothing changes", "Only six enrollments have a certificate."],
            ["Enrollments without certificates show NULL", "That is what the LEFT JOIN did."],
            ["It fails with an error", "It runs; it just answers a different question."],
          ],
          at: 1,
          aftermath: "For every join, ask: must every row on this side appear, even with no match? If yes, it is an outer join.",
        }),
      },
    ],
    task: {
      title: "Week 9 practical: the progress report",
      intro: "Run the report on your own server and document it.",
      prompts: [
        "Run your progress report and 'who is behind' queries on your own PostgreSQL, and paste the results.",
        "For every join in your report, write one sentence saying why it is INNER or LEFT.",
        "Deliberately write a version that fans out (join payments and lesson_completions to the same enrollment) and show how its totals differ from the correct ones.",
        "Answer three business questions of your own that need at least three tables each.",
        "Checkpoint: solve multi-table business questions and explain why a particular join type is appropriate.",
      ],
      closing: "Next: Week 10, writing maintainable analytical SQL with CTEs, views and window functions.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
