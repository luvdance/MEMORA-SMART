/**
 * RELATIONAL DATABASES · WEEK 7 · QUERYING AND FILTERING DATA
 *
 * Curriculum 7.1 – 7.P. SELECT expressions, WHERE and comparisons, AND, OR
 * and NOT, IN, BETWEEN, LIKE and ILIKE, IS NULL, ORDER BY, LIMIT and
 * pagination, DISTINCT, calculated columns, CASE, operator precedence, and
 * debugging wrong results. Every lab queries the academy database and is
 * graded by comparing its real result with the model answer's.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY } from "./db-helpers.js";

export const SECTION_ID = "db-s7-querying";
const MODULE = "db-m7-querying";

/** A query lab on the academy: the learner's final result must equal the model's. */
const ask = (task, solution, { starter = "", ordered = false, hint, success, mustFail, names = true, rows } = {}) => ({
  setup: ACADEMY,
  task,
  starter,
  solution,
  checks: [{ label: ordered ? "The right rows, columns and order" : "The right rows and columns", result: { ordered, names } }],
  hint,
  successMessage: success,
  ...(mustFail ? { mustFail } : {}),
  ...(rows !== undefined ? { expectRows: rows } : {}),
});

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 7.1 – 7.3 · SELECT, WHERE AND LOGIC
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l34-select-where",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3"],
    title: "SELECT, WHERE and Logical Operators",
    subtitle: "Choosing columns and expressions, filtering rows, combining conditions",
    estimatedMinutes: 40,
    intro:
      "From this week the academy database is your playground: twelve students, five courses, enrollments, lessons, payments and certificates. Every question a manager could ask, you will answer with a query, and none of them changes the data.",
    atoms: [
      {
        id: "a-db-select-expressions",
        title: "SELECT and column expressions",
        explain:
          "The SELECT list is not limited to column names: each item can be an EXPRESSION computed for every row. Text can be joined with ||, numbers calculated, functions applied: upper(city), price / 100, full_name || ' <' || email || '>'. Give each expression an alias so its column has a sensible heading. The order of the SELECT list is the order of the result's columns. Run the example, then try your own expressions.",
        sqlDemo: {
          setup: ACADEMY,
          caption: "Columns, a joined string, a function and a calculation, each with an alias.",
          code: "SELECT code,\n       title,\n       upper(category)         AS category,\n       price,\n       price / duration_weeks  AS price_per_week,\n       code || ' – ' || title  AS label\nFROM courses;",
        },
        sqlLab: ask(
          "For every course, return code, title, and a column called weekly_hours equal to duration_weeks multiplied by 8 (the course expects 8 hours a week).",
          "SELECT code,\n       title,\n       duration_weeks * 8 AS weekly_hours\nFROM courses;\n",
          { starter: "SELECT code, title\nFROM courses;\n", hint: "Add a third item to the SELECT list: duration_weeks * 8 AS weekly_hours.", success: "A column that does not exist in the table, computed for every row." }
        ),
      },
      {
        id: "a-db-where-comparison",
        title: "WHERE and comparison operators",
        explain:
          "WHERE condition keeps only the rows for which the condition is TRUE. The comparison operators are = (equal), <> or != (not equal), <, <=, > and >=. They work on numbers, text (alphabetical order), dates (earlier and later) and booleans. Text and dates are compared as values in quotes: joined_on >= '2026-03-01'. WHERE is evaluated row by row, before the SELECT list, so it cannot use a column alias defined in the SELECT.",
        sqlLab: ask(
          "Return the full_name and joined_on of every student who joined on or after 1 April 2026.",
          "SELECT full_name, joined_on\nFROM students\nWHERE joined_on >= '2026-04-01';\n",
          { rows: 4, hint: "WHERE joined_on >= '2026-04-01' — dates in 'YYYY-MM-DD' quotes.", success: "Four students, and on or after includes 1 April itself.", mustFail: ["SELECT full_name, joined_on FROM students WHERE joined_on > '2026-04-01';"] }
        ),
      },
      {
        id: "a-db-and-or-not",
        title: "AND, OR and NOT",
        explain:
          "AND requires BOTH conditions to be true; OR requires AT LEAST ONE; NOT reverses a condition. city = 'Lagos' AND is_active keeps active Lagos students. city = 'Lagos' OR city = 'Abuja' keeps students in either city. NOT is_active keeps inactive students. Booleans can be used directly (is_active, NOT is_active) instead of is_active = true. Remember that NULL is neither true nor false: NOT (phone = '…') does not match rows whose phone is NULL.",
        sqlLab: ask(
          "Return full_name and city of the ACTIVE students who live in Lagos or Enugu.",
          "SELECT full_name, city\nFROM students\nWHERE is_active\n  AND (city = 'Lagos' OR city = 'Enugu');\n",
          {
            rows: 5, hint: "Both cities in brackets with OR, then AND is_active. Without brackets, AND is applied first (Lesson 37).",
            success: "Five students: Ifeanyi in Enugu is inactive, so he is left out. Brackets made the OR a single condition.",
            mustFail: ["SELECT full_name, city FROM students WHERE city = 'Lagos' OR city = 'Enugu';", "SELECT full_name, city FROM students WHERE is_active AND city = 'Lagos' OR city = 'Enugu';"],
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 7.4 – 7.5 · IN, BETWEEN, LIKE AND NULL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l35-patterns-null",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.4", "7.5"],
    title: "IN, BETWEEN, LIKE, ILIKE and NULL Tests",
    subtitle: "Lists, ranges, text patterns and missing values",
    estimatedMinutes: 40,
    intro:
      "A handful of operators make common filters short and readable: lists of values, ranges, and text that matches a pattern.",
    atoms: [
      {
        id: "a-db-in-between",
        title: "IN and BETWEEN",
        explain:
          "column IN ('a', 'b', 'c') is shorthand for column = 'a' OR column = 'b' OR column = 'c'; NOT IN excludes them (careful: NOT IN with a NULL in the list matches nothing). column BETWEEN low AND high means column >= low AND column <= high: both ends INCLUDED. For dates, BETWEEN '2026-01-01' AND '2026-03-31' works for date columns; for timestamps prefer >= start AND < next day, so the whole last day is included.",
        sqlLab: ask(
          "Return code, title and price of the courses in the data or security categories whose price is between 55,000 and 80,000 inclusive.",
          "SELECT code, title, price\nFROM courses\nWHERE category IN ('data', 'security')\n  AND price BETWEEN 55000 AND 80000;\n",
          { rows: 3, hint: "category IN ('data', 'security') AND price BETWEEN 55000 AND 80000.", success: "IN for a list, BETWEEN for an inclusive range: both ends of 55,000–80,000 count." }
        ),
      },
      {
        id: "a-db-like-ilike",
        title: "LIKE and ILIKE",
        explain:
          "LIKE matches text against a PATTERN: % means any sequence of characters (including none), _ means exactly one character. full_name LIKE 'A%' starts with A; email LIKE '%@example.com' ends with it; code LIKE '__-101' is two characters, a dash, then 101. LIKE is case-sensitive in PostgreSQL; ILIKE is the case-insensitive version (PostgreSQL only; in MySQL LIKE is usually case-insensitive already). A pattern starting with % cannot use a normal index, so it reads every row (Week 12).",
        sqlLab: ask(
          "Find students whose full name contains 'ba' in any capitalisation (Bayo, Abba, BALA…). Return full_name and email.",
          "SELECT full_name, email\nFROM students\nWHERE full_name ILIKE '%ba%';\n",
          {
            rows: 1, hint: "ILIKE '%ba%' — % on both sides means 'anywhere in the text'.",
            success: "Only Bayo Adeyemi: his name has 'Ba' with a capital B, which the case-sensitive LIKE '%ba%' would have missed.",
            mustFail: ["SELECT full_name, email FROM students WHERE full_name LIKE '%ba%';"],
          }
        ),
      },
      {
        id: "a-db-is-null",
        title: "IS NULL and IS NOT NULL",
        explain:
          "Because = NULL is never true, missing values are found with IS NULL and IS NOT NULL. In the academy, a student's phone is NULL when unknown; an enrollment's completed_on and score are NULL until the course is finished. IS NULL is the honest way to ask 'which are missing', and IS NOT NULL to ask 'which have a value'. The two together split every row into exactly two groups, which = and <> cannot do when NULLs exist.",
        sqlLab: ask(
          "Return id, student_id and course_id of the enrollments that have a completed_on date but NO score recorded (a data-quality check; the answer may be empty, but write the query properly).",
          "SELECT id, student_id, course_id\nFROM enrollments\nWHERE completed_on IS NOT NULL\n  AND score IS NULL;\n",
          {
            rows: 0, hint: "completed_on IS NOT NULL AND score IS NULL.",
            success: "(0 rows): every completed enrollment has a score. A data-quality query that returns nothing is good news, as long as you know it was written correctly.",
            mustFail: ["SELECT id, student_id, course_id FROM enrollments WHERE score IS NULL;"],
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 7.6 – 7.8 · SORTING, PAGINATION AND DISTINCT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l36-sort-page",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.6", "7.7", "7.8"],
    title: "Sorting, Pagination and DISTINCT",
    subtitle: "ORDER BY, LIMIT and OFFSET, and removing duplicates",
    estimatedMinutes: 40,
    intro:
      "A table has no order and may hold more rows than anyone can read. These clauses decide what order a result comes in, how much of it you see, and whether repeats are shown.",
    atoms: [
      {
        id: "a-db-order-by",
        title: "ORDER BY and sorting by several columns",
        explain:
          "ORDER BY column sorts ascending (ASC, the default); DESC sorts descending. With several columns, rows are sorted by the first, and rows that tie are sorted by the second, and so on: ORDER BY city, full_name groups by city and alphabetises within each. You can sort by an expression or a SELECT alias (ORDER BY price_per_week DESC). NULLs sort LAST in ascending order and first in descending in PostgreSQL; NULLS FIRST or NULLS LAST overrides it. Without ORDER BY, row order is not guaranteed, even if it looks stable.",
        sqlLab: ask(
          "List every enrollment's student_id, course_id and score, highest score first; enrollments with no score go at the end; ties are broken by student_id ascending.",
          "SELECT student_id, course_id, score\nFROM enrollments\nORDER BY score DESC NULLS LAST,\n         student_id;\n",
          {
            ordered: true,
            rows: 21, hint: "ORDER BY score DESC NULLS LAST, student_id — DESC alone would put the NULLs first.",
            success: "Without NULLS LAST, the fourteen empty scores would have topped the list.",
            mustFail: ["SELECT student_id, course_id, score FROM enrollments ORDER BY score DESC, student_id;"],
          }
        ),
      },
      {
        id: "a-db-limit-pagination",
        title: "LIMIT and pagination",
        explain:
          "LIMIT n returns at most n rows; OFFSET k skips the first k. A page of 5 results is LIMIT 5 OFFSET 0, then LIMIT 5 OFFSET 5, and so on: page p (from 1) is OFFSET (p − 1) × 5. Pagination ONLY works with an ORDER BY that gives every row a definite position (add the id as a tie-breaker), otherwise pages can repeat or skip rows. Large OFFSETs are slow because the skipped rows are still read; big applications use KEYSET pagination instead: WHERE id > last_id_seen ORDER BY id LIMIT 5. The standard SQL spelling is FETCH FIRST 5 ROWS ONLY.",
        sqlLab: ask(
          "The students page shows 5 students per page, ordered by joined_on, then id. Return page 2: id, full_name and joined_on.",
          "SELECT id, full_name, joined_on\nFROM students\nORDER BY joined_on, id\nLIMIT 5 OFFSET 5;\n",
          { ordered: true, hint: "Page 2 skips the first 5: LIMIT 5 OFFSET 5, after ORDER BY joined_on, id.", success: "Students 6 to 10 by join date. Page 3 would be OFFSET 10 and hold the last two." }
        ),
      },
      {
        id: "a-db-distinct",
        title: "DISTINCT",
        explain:
          "SELECT DISTINCT removes duplicate ROWS from the result: SELECT DISTINCT city FROM students lists each city once. DISTINCT applies to the whole row of the SELECT list, so SELECT DISTINCT city, is_active gives each distinct pair. It does not change the table. Use it when duplicates are genuinely meaningless for the question; when they appear unexpectedly in a multi-table query, they usually reveal a join mistake that DISTINCT would only hide (Week 9). PostgreSQL also has DISTINCT ON (column) to keep the first row per group.",
        sqlLab: ask(
          "Which students have enrolled in at least one course? Return each student_id once, in ascending order.",
          "SELECT DISTINCT student_id\nFROM enrollments\nORDER BY student_id;\n",
          { ordered: true, rows: 12, hint: "SELECT DISTINCT student_id … ORDER BY student_id.", success: "Twelve ids from twenty-one enrollments: DISTINCT collapsed the repeats." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 7.9 – 7.12 · CALCULATIONS, CASE, PRECEDENCE, DEBUGGING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l37-calc-case",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.9", "7.10", "7.11", "7.12"],
    title: "Calculations, CASE, Precedence and Debugging",
    subtitle: "Computed columns, conditional values, and finding why a query is wrong",
    estimatedMinutes: 50,
    intro:
      "A query that runs is not the same as a query that is right. This lesson adds calculations and conditional logic, and then the habits that catch the queries that run but lie.",
    atoms: [
      {
        id: "a-db-arithmetic",
        title: "Arithmetic expressions and calculated columns",
        explain:
          "The usual operators work on numbers: + − * / and % (remainder). The TYPE decides the result: integer / integer is INTEGER division in PostgreSQL (7 / 2 = 3), so divide a numeric or write 7 / 2.0 for 3.5. Dates support arithmetic too: date − date is a number of days, date + 7 is a date. A calculated column is any such expression in the SELECT list; you can filter on the same expression in WHERE (but not on its alias) and sort by the alias.",
        sqlLab: ask(
          "For completed enrollments, return id, completed_on, enrolled_on and a column days_taken = completed_on minus enrolled_on, longest first.",
          "SELECT id,\n       completed_on,\n       enrolled_on,\n       completed_on - enrolled_on AS days_taken\nFROM enrollments\nWHERE status = 'completed'\nORDER BY days_taken DESC;\n",
          { ordered: true, hint: "completed_on - enrolled_on gives days. Filter status = 'completed' and ORDER BY the alias DESC.", success: "Subtracting two dates gives a whole number of days, ready to sort and compare." }
        ),
      },
      {
        id: "a-db-case",
        title: "CASE expressions",
        explain:
          "CASE turns conditions into values: CASE WHEN score >= 70 THEN 'distinction' WHEN score >= 50 THEN 'pass' ELSE 'fail' END. The WHEN branches are tested IN ORDER and the first true one wins, so put the strictest first. Without ELSE, unmatched rows (including NULLs) get NULL. CASE can appear anywhere an expression can: in SELECT, ORDER BY, even inside aggregates (Week 8). The 'simple' form CASE status WHEN 'active' THEN … compares one value against several.",
        sqlLab: ask(
          "For every enrollment with a score, return id, score and a column grade: 'distinction' for 80 and above, 'credit' for 70–79, 'pass' for 50–69, otherwise 'fail'.",
          "SELECT id,\n       score,\n       CASE\n         WHEN score >= 80 THEN 'distinction'\n         WHEN score >= 70 THEN 'credit'\n         WHEN score >= 50 THEN 'pass'\n         ELSE 'fail'\n       END AS grade\nFROM enrollments\nWHERE score IS NOT NULL;\n",
          {
            hint: "Test the highest band first; each WHEN only runs if the earlier ones were false.",
            success: "Order matters: with score >= 50 first, a 95 would have been a 'pass'.",
            mustFail: ["SELECT id, score, CASE WHEN score >= 50 THEN 'pass' WHEN score >= 70 THEN 'credit' WHEN score >= 80 THEN 'distinction' ELSE 'fail' END AS grade FROM enrollments WHERE score IS NOT NULL;"],
          }
        ),
      },
      {
        id: "a-db-precedence",
        title: "Operator precedence and parentheses",
        explain:
          "SQL evaluates NOT first, then AND, then OR, just as arithmetic does × before +. So WHERE city = 'Lagos' OR city = 'Abuja' AND is_active means city = 'Lagos' OR (city = 'Abuja' AND is_active): every Lagos student, active or not. The query runs without any error and quietly answers a different question. Rule: whenever AND and OR appear together, add brackets to say what you mean. The same goes for arithmetic: price * 1.075 + 500 is not price * (1.075 + 500).",
        sqlLab: ask(
          "This query is meant to list INACTIVE students in Lagos or Enugu, but it returns active Lagos students too. Fix it (full_name, city).",
          "SELECT full_name, city\nFROM students\nWHERE (city = 'Lagos' OR city = 'Enugu')\n  AND NOT is_active;\n",
          {
            starter: "SELECT full_name, city\nFROM students\nWHERE city = 'Lagos' OR city = 'Enugu' AND NOT is_active;\n",
            rows: 1, hint: "AND binds tighter than OR. Put the two cities in brackets.",
            success: "One student: Ifeanyi in Enugu. The broken version returned five, with no error to warn you.",
          }
        ),
      },
      {
        id: "a-db-debugging",
        title: "Reading errors and debugging wrong results",
        explain:
          "Two kinds of failure. ERRORS stop the query: read the message, the LINE and the caret, the DETAIL and the HINT; fix the first one first. WRONG RESULTS are worse because nothing complains. Debug them by: (1) stating the question in words; (2) checking row counts against what you expect (how many students are in Lagos, by counting another way?); (3) removing conditions one at a time to see which changes the count; (4) looking for the classic traps: = NULL instead of IS NULL, AND/OR without brackets, BETWEEN including both ends, LIKE being case-sensitive, integer division, and dates compared as text.",
        sqlLab: ask(
          "This query should return students who joined in March 2026 and have NO phone, but it returns nothing. Find the two bugs and fix it (full_name, joined_on).",
          "SELECT full_name, joined_on\nFROM students\nWHERE joined_on >= '2026-03-01'\n  AND joined_on < '2026-04-01'\n  AND phone IS NULL;\n",
          {
            starter: "SELECT full_name, joined_on\nFROM students\nWHERE joined_on BETWEEN '2026-03-01' AND '2026-03-31'\n  AND phone = NULL\n  AND joined_on LIKE '2026-03%';\n",
            rows: 1, hint: "phone = NULL is never true. And LIKE on a date fails or misleads; the BETWEEN (or >= and <) already restricts the month.",
            success: "Halima Yusuf. One condition was never true (= NULL) and one did not belong (LIKE on a date).",
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 7.P · PRACTICAL: QUESTIONS FROM THE ACADEMY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l38-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.P"],
    title: "Week 7 Practical: Questions from the Academy",
    subtitle: "Progressively harder retrieval, without changing the data",
    estimatedMinutes: 60,
    intro:
      "The academy's manager has questions. Answer each with one query. The checks compare your result with the right answer; none of these queries may change any data.",
    atoms: [
      {
        id: "a-db-p7-active",
        title: "Active students to contact",
        explain:
          "The manager wants to phone every ACTIVE student who has a phone number, starting with the most recent to join. Return id, full_name, phone, city, joined_on, sorted by joined_on newest first, then by full_name.",
        sqlLab: {
          ...ask(
            "Active students with a phone number: id, full_name, phone, city, joined_on; newest joiners first, ties by full_name.",
            "SELECT id, full_name, phone, city, joined_on\nFROM students\nWHERE is_active\n  AND phone IS NOT NULL\nORDER BY joined_on DESC, full_name;\n",
            { ordered: true, rows: 7, hint: "Two conditions (is_active, phone IS NOT NULL) and a two-column ORDER BY.", success: "Seven students to call, newest first." }
          ),
          revealSolution: false,
        },
      },
      {
        id: "a-db-p7-enrollments",
        title: "Recent enrollments in the data courses",
        explain:
          "The data courses are DA-101 (course 1) and DB-101 (course 4). Find enrollments in either course made between 1 February and 30 April 2026 inclusive that are still active, with how many days each had been running on 30 June 2026. Return id, student_id, course_id, enrolled_on and days_running (DATE '2026-06-30' − enrolled_on), longest-running first.",
        sqlLab: {
          ...ask(
            "Active enrollments in courses 1 or 4, enrolled from 2026-02-01 to 2026-04-30 inclusive: id, student_id, course_id, enrolled_on, days_running (to 2026-06-30), longest first.",
            "SELECT id,\n       student_id,\n       course_id,\n       enrolled_on,\n       DATE '2026-06-30' - enrolled_on AS days_running\nFROM enrollments\nWHERE course_id IN (1, 4)\n  AND enrolled_on BETWEEN '2026-02-01' AND '2026-04-30'\n  AND status = 'active'\nORDER BY days_running DESC;\n",
            { ordered: true, rows: 4, hint: "IN for the courses, BETWEEN for the dates (both ends included), status = 'active', and a date subtraction.", success: "Four enrollments, the oldest running for 128 days." }
          ),
          revealSolution: false,
        },
      },
      {
        id: "a-db-p7-not-completed",
        title: "Learners who have not completed",
        explain:
          "Finally: which learners have at least one enrollment that is NOT completed (active or dropped), and what is the situation? Return a label for each such enrollment: student_id, course_id, and a column situation that says 'in progress' for active enrollments and 'dropped out' for dropped ones. Sort by situation, then student_id, then course_id. Then the manager wants only the FIRST page of 6 rows.",
        sqlLab: {
          ...ask(
            "Not-completed enrollments: student_id, course_id, situation ('in progress' for active, 'dropped out' for dropped); ordered by situation, student_id, course_id; only the first 6 rows.",
            "SELECT student_id,\n       course_id,\n       CASE status\n         WHEN 'active' THEN 'in progress'\n         WHEN 'dropped' THEN 'dropped out'\n       END AS situation\nFROM enrollments\nWHERE status <> 'completed'\nORDER BY situation, student_id, course_id\nLIMIT 6;\n",
            { ordered: true, rows: 6, hint: "CASE status WHEN 'active' THEN … WHEN 'dropped' THEN … END, then ORDER BY the alias and LIMIT 6.", success: "'dropped out' sorts before 'in progress', so the three drop-outs come first." }
          ),
          revealSolution: false,
        },
      },
    ],
    task: {
      title: "Week 7 practical: retrieval drills",
      intro: "Load the academy dataset on your own server (copy it from any lab's Tables panel source in this week, or recreate it) and answer more questions.",
      prompts: [
        "List each course with its price per week, most expensive per week first.",
        "Find students whose email does not end in '@example.com' (the answer may be none: prove your query works by inserting one that does not).",
        "Show page 3 of enrollments ordered by enrolled_on, 4 per page, and explain why the ORDER BY must include id.",
        "Write one query with AND and OR that gives a wrong answer without brackets, and the corrected version, and explain the difference.",
        "Checkpoint: solve progressively harder retrieval tasks without changing the underlying data.",
      ],
      closing: "Next: Week 8, turning rows into summaries: COUNT, SUM, AVG, GROUP BY and HAVING.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
