/**
 * RELATIONAL DATABASES · WEEK 8 · AGGREGATION, GROUPING AND SQL FUNCTIONS
 *
 * Curriculum 8.1 – 8.P. COUNT, SUM, AVG, MIN and MAX; GROUP BY one and
 * several columns; HAVING versus WHERE; NULL in aggregates; string, numeric
 * and date/time functions; conditional aggregation with CASE and FILTER;
 * several aggregates in one query; and the mistakes that produce wrong
 * totals. The practical is a monthly business report on the academy.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s8-aggregation";
const MODULE = "db-m8-aggregation";

const ask = (task, solution, { starter = "", ordered = false, hint, success, mustFail, rows, names = true, setup = ACADEMY, claims } = {}) => ({
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
});

/** Messy sign-up data for the string-function lab. */
const SIGNUPS = `CREATE TABLE signups (id integer PRIMARY KEY, raw_name text, raw_email text, raw_phone text);
INSERT INTO signups VALUES
  (1, '  ada OBI ', 'Ada.Obi@Example.COM ', '0803-111-2001'),
  (2, 'BAYO adeyemi', ' bayo@example.com', '0805 222 3002'),
  (3, 'chiamaka  eze', 'CHIAMAKA@example.com', '(0807) 333 4003');`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 8.1 – 8.2 · AGGREGATES AND GROUP BY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l39-aggregates",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2"],
    title: "Aggregate Functions and GROUP BY",
    subtitle: "COUNT, SUM, AVG, MIN, MAX, per group",
    estimatedMinutes: 40,
    intro:
      "Managers rarely ask for rows. They ask how many, how much, on average, at most. Aggregate functions turn many rows into one answer, and GROUP BY gives one answer per group.",
    atoms: [
      {
        id: "a-db-aggregates",
        title: "COUNT, SUM, AVG, MIN and MAX",
        explain:
          "An AGGREGATE function reads many rows and returns one value. COUNT(*) counts rows; SUM(amount) adds; AVG(score) averages; MIN and MAX find the smallest and largest (they also work on dates and text). With no GROUP BY, the whole result (after WHERE) is one group, so the query returns exactly one row. Aggregates can take expressions: SUM(quantity * unit_price). AVG on integers returns a numeric with many decimals; ROUND it for display (Lesson 41).",
        sqlLab: ask(
          "Summarise all payments in one row: payments (the number of payments), total (sum of amount), average (average amount, rounded to 2 decimal places), first_payment and last_payment (earliest and latest paid_on).",
          "SELECT count(*)              AS payments,\n       sum(amount)           AS total,\n       round(avg(amount), 2) AS average,\n       min(paid_on)          AS first_payment,\n       max(paid_on)          AS last_payment\nFROM payments;\n",
          { rows: 1, hint: "Five aggregates in one SELECT, each with its alias. round(avg(amount), 2) rounds the average.", success: "Nineteen payments, summarised in one row.", claims: [{ sql: "SELECT count(*) FROM payments", equals: 19 }] }
        ),
      },
      {
        id: "a-db-group-by",
        title: "GROUP BY",
        explain:
          "GROUP BY column splits the rows into groups that share a value, and each aggregate is computed per group: one result row per group. SELECT course_id, count(*) FROM enrollments GROUP BY course_id gives the enrollment count for each course. THE RULE: every column in the SELECT list must either be in the GROUP BY or inside an aggregate; otherwise PostgreSQL refuses ('must appear in the GROUP BY clause or be used in an aggregate function'), because a group has many values for it and SQL will not pick one for you.",
        sqlLab: ask(
          "For each course_id, return the number of enrollments (as enrollments) and the highest score (as best_score), ordered by course_id.",
          "SELECT course_id,\n       count(*)   AS enrollments,\n       max(score) AS best_score\nFROM enrollments\nGROUP BY course_id\nORDER BY course_id;\n",
          { ordered: true, rows: 5, hint: "GROUP BY course_id, then count(*) and max(score) per group.", success: "One row per course. Course 5 has no scores yet, so its best_score is NULL.", claims: [{ sql: "SELECT count(score) FROM enrollments WHERE course_id = 5", equals: 0 }] }
        ),
      },
      {
        id: "a-db-group-by-many",
        title: "Grouping by several columns",
        explain:
          "GROUP BY a, b makes one group for each distinct COMBINATION of a and b: GROUP BY course_id, status gives the number of active, completed and dropped enrollments in each course, as separate rows. Combinations that do not occur produce no row at all (there is no 'course 5, completed: 0' row): to see zeros you need conditional aggregation (Lesson 42) or a join (Week 9). You can also group by an expression, such as the month of a date.",
        sqlLab: ask(
          "Count students per city and active flag: return city, is_active and students, ordered by city then is_active.",
          "SELECT city,\n       is_active,\n       count(*) AS students\nFROM students\nGROUP BY city, is_active\nORDER BY city, is_active;\n",
          { ordered: true, rows: 7, hint: "GROUP BY city, is_active — both columns appear in the SELECT list too.", success: "Enugu appears twice: one active student, one inactive." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 8.3 – 8.4 · HAVING AND NULL IN AGGREGATES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l40-having-null",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.3", "8.4"],
    title: "HAVING, WHERE and NULL in Aggregates",
    subtitle: "Filtering rows versus filtering groups",
    estimatedMinutes: 35,
    intro:
      "Two filters, applied at different moments: WHERE before grouping, HAVING after. And one quiet trap: what aggregates do with missing values.",
    atoms: [
      {
        id: "a-db-having",
        title: "HAVING versus WHERE",
        explain:
          "A query runs in this order: FROM → WHERE (filter ROWS) → GROUP BY → aggregates → HAVING (filter GROUPS) → SELECT → ORDER BY → LIMIT. So WHERE cannot use an aggregate (the groups do not exist yet), and HAVING is where conditions on count(*), sum() and so on go: HAVING count(*) >= 5. Use WHERE for anything about individual rows (it also makes the query faster, because fewer rows are grouped) and HAVING only for conditions on the groups.",
        sqlLab: ask(
          "Which enrollments have paid more than 50,000 in total? From payments, return enrollment_id and total (sum of amount) for each enrollment whose payments add up to more than 50,000, ordered by total descending, then enrollment_id.",
          "SELECT enrollment_id,\n       sum(amount) AS total\nFROM payments\nGROUP BY enrollment_id\nHAVING sum(amount) > 50000\nORDER BY total DESC, enrollment_id;\n",
          {
            ordered: true,
            rows: 9,
            hint: "The condition is on sum(amount), so it belongs in HAVING, after GROUP BY.",
            success: "WHERE sum(amount) > 50000 would have been an error: rows are filtered before sums exist.",
            mustFail: ["SELECT enrollment_id, sum(amount) AS total FROM payments WHERE amount > 50000 GROUP BY enrollment_id ORDER BY total DESC, enrollment_id;"],
          }
        ),
      },
      {
        id: "a-db-null-aggregates",
        title: "NULL in aggregates",
        explain:
          "Aggregates IGNORE NULLs, except COUNT(*), which counts rows. So COUNT(score) counts only the scores that exist, AVG(score) is the average of the KNOWN scores (not counting missing ones as zero), and SUM of a column of only NULLs is NULL, not 0. That is usually right, but you must decide: is a missing score 'not finished yet' (exclude it) or 'scored zero' (COALESCE(score, 0))? COUNT(DISTINCT col) counts different non-NULL values.",
        sqlLab: ask(
          "For each course_id: enrollments (all rows), scored (how many have a score), avg_known (average of the existing scores, rounded to 1 dp) and avg_as_zero (average treating a missing score as 0, rounded to 1 dp). Order by course_id.",
          "SELECT course_id,\n       count(*)                          AS enrollments,\n       count(score)                      AS scored,\n       round(avg(score), 1)              AS avg_known,\n       round(avg(coalesce(score, 0)), 1) AS avg_as_zero\nFROM enrollments\nGROUP BY course_id\nORDER BY course_id;\n",
          { ordered: true, rows: 5, hint: "count(score) skips NULLs; avg(coalesce(score, 0)) counts them as 0.", success: "Same data, very different averages. Which one is right depends on what a missing score means." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 8.5 – 8.7 · STRING, NUMERIC AND DATE FUNCTIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l41-functions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.5", "8.6", "8.7"],
    title: "String, Numeric and Date Functions",
    subtitle: "Cleaning text, rounding numbers, and working with dates",
    estimatedMinutes: 50,
    intro:
      "Raw data arrives with stray spaces, odd capitals, too many decimals and timestamps where you need months. SQL's built-in functions clean and reshape it inside the query.",
    atoms: [
      {
        id: "a-db-string-functions",
        title: "String functions for cleaning and formatting",
        explain:
          "Common PostgreSQL string functions: trim(s) removes surrounding spaces; lower(s), upper(s), initcap(s) (capitalise each word); length(s); replace(s, from, to); substr(s, start, length); split_part(s, delimiter, n); left(s, n) and right(s, n); concat_ws(separator, a, b, …) joins with a separator and skips NULLs; regexp_replace(s, pattern, replacement, 'g') replaces every match of a regular expression. They compose: initcap(trim(raw_name)).",
        sqlLab: ask(
          "Clean the sign-ups: return id, full_name (trimmed, each word capitalised, double spaces made single), email (trimmed and lower case) and phone (only the digits: remove every non-digit character), ordered by id.",
          "SELECT id,\n       initcap(regexp_replace(trim(raw_name), '\\s+', ' ', 'g')) AS full_name,\n       lower(trim(raw_email))                                 AS email,\n       regexp_replace(raw_phone, '[^0-9]', '', 'g')           AS phone\nFROM signups\nORDER BY id;\n",
          {
            setup: SIGNUPS,
            ordered: true,
            rows: 3,
            hint: "initcap(regexp_replace(trim(raw_name), '\\s+', ' ', 'g')) collapses runs of spaces; regexp_replace(raw_phone, '[^0-9]', '', 'g') keeps digits only.",
            success: "'  ada OBI ' became 'Ada Obi' and '(0807) 333 4003' became 08073334003: clean values that can now be compared and kept UNIQUE.",
          }
        ),
      },
      {
        id: "a-db-numeric-functions",
        title: "Numeric functions and rounding",
        explain:
          "round(x, n) rounds to n decimal places (half away from zero for numeric); round(x) to a whole number. ceil and floor round up and down; trunc cuts decimals off; abs gives the absolute value; mod(a, b) or a % b the remainder; power and sqrt as expected. Round only for DISPLAY, at the end: rounding intermediate values in a calculation accumulates errors. Money stays numeric throughout; to_char(x, 'FM999,999,990.00') formats it with thousands separators for a report.",
        sqlLab: ask(
          "For each course: code, price, price_with_vat (price × 1.075, rounded to 2 dp), weekly (price ÷ duration_weeks rounded UP to a whole naira with ceil), and display (price formatted with to_char as 'FM999,999,990.00'). Order by code.",
          "SELECT code,\n       price,\n       round(price * 1.075, 2)                AS price_with_vat,\n       ceil(price / duration_weeks)           AS weekly,\n       to_char(price, 'FM999,999,990.00')     AS display\nFROM courses\nORDER BY code;\n",
          { ordered: true, rows: 5, hint: "round(price * 1.075, 2), ceil(price / duration_weeks), to_char(price, 'FM999,999,990.00').", success: "75,000.00 reads better on a report; 75000.00 is better for arithmetic. Keep both roles apart." }
        ),
      },
      {
        id: "a-db-date-parts",
        title: "Extracting parts of dates",
        explain:
          "extract(field FROM date) returns a number: extract(year FROM paid_on), extract(month …), extract(dow …) (day of week, 0 = Sunday), extract(quarter …). date_trunc('month', paid_on) rounds a date or timestamp DOWN to the start of its month, which is the standard way to group by month (it keeps the year, unlike extract(month)). to_char(paid_on, 'YYYY-MM') or 'Mon YYYY' formats it as text for display.",
        sqlLab: ask(
          "Revenue per month: return month (date_trunc('month', paid_on) cast to date), payments (count) and revenue (sum of amount), in month order.",
          "SELECT date_trunc('month', paid_on)::date AS month,\n       count(*)                          AS payments,\n       sum(amount)                       AS revenue\nFROM payments\nGROUP BY date_trunc('month', paid_on)::date\nORDER BY month;\n",
          {
            ordered: true,
            rows: 6,
            hint: "Group by the same expression you select: date_trunc('month', paid_on)::date.",
            success: "Six months of revenue. Grouping by extract(month) alone would merge January 2026 with January 2027.",
          }
        ),
      },
      {
        id: "a-db-date-intervals",
        title: "Intervals and date calculations",
        explain:
          "An INTERVAL is a length of time: interval '16 weeks', '3 months', '45 days'. Adding one to a date gives a timestamp (cast ::date to get a date back): enrolled_on + interval '16 weeks'. Subtracting dates gives days (an integer); subtracting timestamps gives an interval. age(later, earlier) gives a readable interval in years, months and days. current_date and now() are today and this moment, so a query using them gives a different answer each day: for reports, use a fixed 'as of' date.",
        sqlLab: ask(
          "For each ACTIVE enrollment: id, enrolled_on, expected_end (enrolled_on plus the course's 16 weeks, as a date: use interval '16 weeks'), and overdue (true when expected_end is before 2026-07-01). Order by id.",
          "SELECT id,\n       enrolled_on,\n       (enrolled_on + interval '16 weeks')::date                 AS expected_end,\n       (enrolled_on + interval '16 weeks')::date < '2026-07-01' AS overdue\nFROM enrollments\nWHERE status = 'active'\nORDER BY id;\n",
          { ordered: true, rows: 11, hint: "(enrolled_on + interval '16 weeks')::date, and compare it with DATE '2026-07-01'.", success: "A fixed 'as of' date keeps the report reproducible tomorrow." }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 8.8 – 8.10 · CONDITIONAL AGGREGATION AND MISTAKES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l42-conditional",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.8", "8.9", "8.10"],
    title: "Conditional Aggregation and Grouping Mistakes",
    subtitle: "Counting only some rows, several aggregates at once, and wrong totals",
    estimatedMinutes: 45,
    intro:
      "The most useful report queries count different things side by side: completed versus dropped, card versus transfer. And the most common reporting bugs are quiet ones in GROUP BY.",
    atoms: [
      {
        id: "a-db-conditional-aggregation",
        title: "Conditional aggregation with CASE (and FILTER)",
        explain:
          "Put a CASE inside an aggregate to count or sum only the rows that meet a condition: count(CASE WHEN status = 'completed' THEN 1 END) counts completions (CASE gives NULL otherwise, and count ignores NULL); sum(CASE WHEN method = 'card' THEN amount ELSE 0 END) sums card payments. PostgreSQL has a neater standard form: count(*) FILTER (WHERE status = 'completed'). This turns ROWS into COLUMNS (a pivot), and unlike GROUP BY status it shows zeros for groups with no matching rows.",
        sqlLab: ask(
          "For each course_id: total (all enrollments), active, completed and dropped (counts by status), ordered by course_id. Courses with no enrollments of a status must show 0.",
          "SELECT course_id,\n       count(*)                                      AS total,\n       count(*) FILTER (WHERE status = 'active')     AS active,\n       count(*) FILTER (WHERE status = 'completed')  AS completed,\n       count(*) FILTER (WHERE status = 'dropped')    AS dropped\nFROM enrollments\nGROUP BY course_id\nORDER BY course_id;\n",
          { ordered: true, rows: 5, hint: "count(*) FILTER (WHERE status = 'active') AS active, and the same for the others. count(CASE WHEN … THEN 1 END) also works.", success: "One row per course, statuses side by side, zeros included." }
        ),
      },
      {
        id: "a-db-combined-aggregates",
        title: "Combining several aggregates in one query",
        explain:
          "One query can compute many aggregates over the same groups, and combine them in expressions: a completion rate is count(*) FILTER (WHERE status = 'completed') * 100.0 / count(*). Multiply by 100.0 (not 100) to avoid integer division. Guard against dividing by zero with NULLIF(denominator, 0), which turns a zero into NULL so the division gives NULL instead of an error.",
        sqlLab: ask(
          "Per payment method: method, payments (count), revenue (sum), average (rounded to 2 dp), and share_pct: this method's revenue as a percentage of ALL revenue, rounded to 1 dp (use sum(amount) * 100.0 / (SELECT sum(amount) FROM payments)). Largest revenue first.",
          "SELECT method,\n       count(*)                                                   AS payments,\n       sum(amount)                                                AS revenue,\n       round(avg(amount), 2)                                      AS average,\n       round(sum(amount) * 100.0 / (SELECT sum(amount) FROM payments), 1) AS share_pct\nFROM payments\nGROUP BY method\nORDER BY revenue DESC;\n",
          { ordered: true, rows: 3, hint: "The total for the percentage comes from a small subquery: (SELECT sum(amount) FROM payments).", success: "Add up share_pct: it comes to 100% (allowing for rounding), a quick sanity check on any share calculation." }
        ),
      },
      {
        id: "a-db-grouping-mistakes",
        title: "Common grouping mistakes and duplicated rows",
        explain:
          "Three classic errors. (1) Grouping by too MUCH: GROUP BY student_id, enrolled_on when you wanted per student splits each student into several rows. (2) COUNT(*) where you meant COUNT(DISTINCT …): 'how many students paid?' counted from payments counts PAYMENTS, and a student who paid in instalments is counted twice. (3) Totals over duplicated rows: when rows are repeated before aggregation (by a join, Week 9, or by a careless UNION ALL), SUM adds the same money twice. Always ask what ONE row of the input represents before aggregating it.",
        sqlLab: ask(
          "The finance team asks: how many DIFFERENT enrollments have made at least one payment, and how many payments were made in total? Return paying_enrollments and payments in one row.",
          "SELECT count(DISTINCT enrollment_id) AS paying_enrollments,\n       count(*)                      AS payments\nFROM payments;\n",
          {
            rows: 1,
            starter: "SELECT count(enrollment_id) AS paying_enrollments,\n       count(*)              AS payments\nFROM payments;\n",
            hint: "Instalments mean some enrollments have several payments. Count the distinct ids.",
            success: "17 enrollments, 19 payments: two enrollments paid in instalments. The starter counted 19 'paying enrollments'.",
            claims: [
              { sql: "SELECT count(DISTINCT enrollment_id) FROM payments", equals: 17 },
              { sql: "SELECT count(*) FROM payments", equals: 19 },
            ],
          }
        ),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 8.P · PRACTICAL: THE MONTHLY REPORT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l43-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.P"],
    title: "Week 8 Practical: The Academy Report",
    subtitle: "Enrollments, completion rates, scores and revenue by month",
    estimatedMinutes: 60,
    intro:
      "The checkpoint: the academy's management report, built query by query from the raw data. Each figure must be right, and you must be able to say how each one was calculated.",
    atoms: [
      {
        id: "a-db-p8-courses",
        title: "Course performance",
        explain:
          "One row per course_id with: enrollments (all), completed, completion_rate (completed as a percentage of ALL enrollments, 1 dp), avg_score (average of known scores, 1 dp) and paid_in (total payments received for that course's enrollments, using a subquery: (SELECT sum(p.amount) FROM payments p WHERE p.enrollment_id IN (SELECT id FROM enrollments e2 WHERE e2.course_id = enrollments.course_id))). Order by completion_rate descending, then course_id.",
        sqlLab: {
          ...ask(
            "Course report: course_id, enrollments, completed, completion_rate (% of all enrollments, 1 dp), avg_score (1 dp), paid_in (total payments for the course's enrollments). Order by completion_rate DESC, course_id.",
            "SELECT course_id,\n       count(*)                                                    AS enrollments,\n       count(*) FILTER (WHERE status = 'completed')                AS completed,\n       round(count(*) FILTER (WHERE status = 'completed') * 100.0 / count(*), 1) AS completion_rate,\n       round(avg(score), 1)                                        AS avg_score,\n       (SELECT sum(p.amount)\n        FROM payments AS p\n        WHERE p.enrollment_id IN (SELECT e2.id FROM enrollments AS e2 WHERE e2.course_id = enrollments.course_id)) AS paid_in\nFROM enrollments\nGROUP BY course_id\nORDER BY completion_rate DESC, course_id;\n",
            { ordered: true, rows: 5, hint: "Build it a column at a time and Run after each. Multiply by 100.0 for the rate. The paid_in subquery refers to the outer row's enrollments.course_id.", success: "A real management table, every number computed from raw rows." }
          ),
          revealSolution: false,
        },
      },
      {
        id: "a-db-p8-revenue",
        title: "Revenue by month",
        explain:
          "Monthly revenue with a breakdown by payment method: month (as text 'YYYY-MM' using to_char), total, card, transfer and ussd (sums by method, 0 when none), and payments (count). In month order.",
        sqlLab: {
          ...ask(
            "Revenue by month: month ('YYYY-MM' text), total, card, transfer, ussd (0 when none), payments. In month order.",
            "SELECT to_char(paid_on, 'YYYY-MM')                              AS month,\n       sum(amount)                                               AS total,\n       coalesce(sum(amount) FILTER (WHERE method = 'card'), 0)     AS card,\n       coalesce(sum(amount) FILTER (WHERE method = 'transfer'), 0) AS transfer,\n       coalesce(sum(amount) FILTER (WHERE method = 'ussd'), 0)     AS ussd,\n       count(*)                                                  AS payments\nFROM payments\nGROUP BY to_char(paid_on, 'YYYY-MM')\nORDER BY month;\n",
            { ordered: true, rows: 6, hint: "sum(amount) FILTER (WHERE method = 'card') is NULL in a month with no card payments: wrap it in coalesce(…, 0).", success: "'YYYY-MM' text also sorts correctly, because the year comes first." }
          ),
          revealSolution: false,
        },
      },
      {
        id: "a-db-p8-explain",
        title: "Explain how each figure is calculated",
        explain:
          "A report is only trusted when its author can explain every number. For your course report, write down for each column: which rows it counts, what it does with NULLs, and what its denominator is. The decision below is the kind of question a manager will ask.",
        decision: decide({
          scenario: "The manager reads course 4's completion_rate and asks: 'Does that include students who dropped out?'",
          question: "What is the accurate answer for the report as built?",
          right: ["Yes: the rate is completed divided by ALL enrollments, including dropped and still-active ones", "The denominator was count(*), every enrollment of the course."],
          wrong: [
            ["No: dropped students are ignored by count(*)", "count(*) counts every row, whatever its status."],
            ["It only counts students who finished", "That is the numerator, not the denominator."],
            ["It depends on the scores", "Scores play no part in the rate."],
          ],
          at: 2,
          aftermath: "Many disputes over 'the numbers' are really disagreements about a denominator. State it on the report.",
        }),
      },
    ],
    task: {
      title: "Week 8 practical: the academy report",
      intro: "Produce the report on your own server and write it up.",
      prompts: [
        "Run your course report and monthly revenue queries on your own PostgreSQL and paste the results into a document.",
        "Under each table, explain every column: what it counts, how NULLs are treated, and the denominator of every rate.",
        "Add one more figure of your own (for example, average days from enrollment to completion per course) and explain it.",
        "Show one grouping mistake (such as counting payments instead of distinct enrollments) next to the corrected query, with the different result.",
        "Checkpoint: build an accurate summary report and explain how each aggregate is calculated.",
      ],
      closing: "Next: Week 9, joins: putting names, titles and payments side by side from several tables.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
