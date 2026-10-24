/**
 * RELATIONAL DATABASES · WEEK 13 · VIEWS, FUNCTIONS, PROCEDURES AND TRIGGERS
 *
 * Curriculum 13.1 – 13.P. Creating and maintaining views, when materialized
 * views fit, SQL and PL/pgSQL functions, parameters and return values,
 * PL/pgSQL syntax, conditions and loops, procedures and CALL, trigger timing,
 * row-level and statement-level triggers, audit trails, validation in the
 * database versus the application, and the risks of hidden logic.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY, BANK, STORE, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s13-programmability";
const MODULE = "db-m13-programmability";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 13.1 – 13.2 · VIEWS AND MATERIALIZED VIEWS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l69-views",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2"],
    title: "Creating and Maintaining Views",
    subtitle: "Views as an interface, and when to materialize",
    estimatedMinutes: 40,
    intro:
      "Week 10 used views to reuse queries. This week they become part of the database's design: a stable interface that applications and people use, whatever happens to the tables behind it.",
    atoms: [
      {
        id: "a-db-maintain-views",
        title: "Creating and maintaining views",
        explain:
          "CREATE OR REPLACE VIEW changes a view's definition in place, as long as existing columns keep their names, types and order (new columns go at the end); otherwise DROP VIEW and recreate it, along with anything that depends on it. A view can hide columns (no phone numbers for the reporting team), rename them, and join tables, so applications depend on the VIEW rather than the table layout: when the tables are refactored, the view is updated and the applications keep working. Simple views over one table are AUTOMATICALLY UPDATABLE: INSERT and UPDATE through them work, and WITH CHECK OPTION stops changes that would fall outside the view's WHERE.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Create a view active_students with id, full_name, city and joined_on of active students only (no email or phone). Then CREATE OR REPLACE it to add one more column at the end: courses, the number of enrollments of each student (a correlated subquery). Finally SELECT * FROM active_students ORDER BY id.",
          starter: "CREATE VIEW active_students AS\nSELECT id, full_name, city, joined_on\nFROM students\nWHERE is_active;\n",
          solution: "CREATE VIEW active_students AS\nSELECT id, full_name, city, joined_on\nFROM students\nWHERE is_active;\n\nCREATE OR REPLACE VIEW active_students AS\nSELECT id, full_name, city, joined_on,\n       (SELECT count(*) FROM enrollments AS e WHERE e.student_id = students.id) AS courses\nFROM students\nWHERE is_active;\n\nSELECT * FROM active_students ORDER BY id;\n",
          checks: [
            { label: "The view returns active students with their course counts", result: { ordered: true } },
            { label: "active_students is a view without email or phone", assert: "SELECT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'active_students') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'active_students' AND column_name IN ('email', 'phone'))" },
          ],
          expectRows: 10,
          hint: "CREATE OR REPLACE VIEW keeps the first four columns as they were and adds courses at the end.",
          successMessage: "Ten active students, no contact details, and the view changed without anyone using it having to change.",
        },
      },
      {
        id: "a-db-when-materialize",
        title: "When materialized views are appropriate",
        explain:
          "Materialize a view when ALL of these hold: the query is expensive; it is read far more often than the data changes; and readers can accept data as old as the last refresh. Typical: dashboards refreshed every few minutes or nightly, leaderboards, search indexes of denormalized data. Avoid it when users must see their own changes immediately (an account balance), or when refreshing costs more than the reads save. REFRESH MATERIALIZED VIEW CONCURRENTLY (it needs a UNIQUE index on the view) refreshes without blocking readers; schedule refreshes with a job (pg_cron, or the application's scheduler).",
        decision: decide({
          scenario: "Three candidates for a materialized view: (1) a student's own balance shown right after they pay; (2) a management dashboard of monthly revenue by course, viewed hundreds of times a day; (3) a list of today's live classes that changes every few minutes and is read a few times a day.",
          question: "Which is the best fit?",
          right: ["2: expensive, read constantly, and fine if refreshed every hour", "All three conditions hold."],
          wrong: [
            ["1: balances are important", "Students must see their payment immediately; a snapshot would confuse them."],
            ["3: it changes often", "Frequent changes and rare reads are the opposite of what materializing suits."],
            ["All three", "Only one meets the conditions."],
          ],
          at: 1,
          aftermath: "When in doubt, start with a plain view and materialize only once you have measured a problem.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 13.3 – 13.4 · FUNCTIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l70-functions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.3", "13.4"],
    title: "PostgreSQL Functions",
    subtitle: "Return types, parameters and return values",
    estimatedMinutes: 45,
    intro:
      "A function packages a calculation inside the database under a name, so every query, report and application computes it the same way.",
    atoms: [
      {
        id: "a-db-functions-return",
        title: "Functions and return types",
        explain:
          "CREATE FUNCTION name(params) RETURNS type LANGUAGE sql AS $$ … $$; defines a function whose body is SQL; the last statement's result is returned. Return types: a single value (numeric, text, boolean…); SETOF type (many rows); TABLE (col type, …) (many rows with named columns); or void. Mark functions that do not modify data and depend only on their inputs IMMUTABLE (or STABLE if they read tables), which lets PostgreSQL optimise and index them. The body is in dollar quotes ($$ … $$) so it can contain single quotes. Call it like any built-in: SELECT amount_owed(14);",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Create a SQL function amount_owed(enrollment integer) RETURNS numeric that returns the course price minus everything paid for that enrollment (0 paid if there are no payments). Then return, for enrollments 1, 3 and 21, the id and amount_owed(id) AS owed, ordered by id.",
          starter: "CREATE FUNCTION amount_owed(enrollment integer) RETURNS numeric\nLANGUAGE sql STABLE AS $$\n  \n$$;\n",
          solution: "CREATE FUNCTION amount_owed(enrollment integer) RETURNS numeric\nLANGUAGE sql STABLE AS $$\n  SELECT c.price - coalesce((SELECT sum(p.amount) FROM payments AS p WHERE p.enrollment_id = e.id), 0)\n  FROM enrollments AS e\n  JOIN courses AS c ON c.id = e.course_id\n  WHERE e.id = enrollment\n$$;\n\nSELECT id, amount_owed(id) AS owed\nFROM enrollments\nWHERE id IN (1, 3, 21)\nORDER BY id;\n",
          checks: [
            { label: "Returns the right amounts owed", result: { ordered: true } },
            { label: "amount_owed works for any enrollment", query: "SELECT id, amount_owed(id) FROM enrollments ORDER BY id", ordered: true },
          ],
          hint: "The body is one SELECT: the course price minus coalesce(sum of payments, 0), for the enrollment given as the parameter.",
          successMessage: "One definition of 'amount owed', usable from any query, report or application.",
        },
      },
      {
        id: "a-db-function-params",
        title: "Parameters and return values",
        explain:
          "Parameters have names and types, and may have DEFAULTs: CREATE FUNCTION courses_in(cat text, max_price numeric DEFAULT 1000000). Call by position (courses_in('data')) or by name (courses_in(cat => 'data', max_price => 60000)). A function can return a whole table: RETURNS TABLE (code text, title text, price numeric) and then be used in FROM like a table: SELECT * FROM courses_in('data');. Functions with the same name but different parameter types are different functions (overloading), so DROP FUNCTION needs the parameter types.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Create courses_in(cat text, max_price numeric DEFAULT 1000000) RETURNS TABLE (code text, title text, price numeric) returning courses in that category at or below max_price, ordered by price. Then call it as SELECT * FROM courses_in('data', 58000);",
          starter: "CREATE FUNCTION courses_in(cat text, max_price numeric DEFAULT 1000000)\nRETURNS TABLE (code text, title text, price numeric)\nLANGUAGE sql STABLE AS $$\n  \n$$;\n",
          solution: "CREATE FUNCTION courses_in(cat text, max_price numeric DEFAULT 1000000)\nRETURNS TABLE (code text, title text, price numeric)\nLANGUAGE sql STABLE AS $$\n  SELECT c.code, c.title, c.price\n  FROM courses AS c\n  WHERE c.category = cat\n    AND c.price <= max_price\n  ORDER BY c.price\n$$;\n\nSELECT * FROM courses_in('data', 58000);\n",
          checks: [
            { label: "courses_in('data', 58000) returns the right courses", result: { ordered: true } },
            { label: "The default max_price works", query: "SELECT * FROM courses_in('data')", ordered: true },
          ],
          expectRows: 1,
          hint: "Qualify the table's columns (c.price) so they are not confused with the output column names.",
          successMessage: "A parameterised, reusable 'table' that any query can select from.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 13.5 – 13.6 · PL/pgSQL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l71-plpgsql",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.5", "13.6"],
    title: "PL/pgSQL: Variables, Conditions and Loops",
    subtitle: "Procedural code inside PostgreSQL",
    estimatedMinutes: 50,
    intro:
      "SQL describes sets of rows. Some logic is naturally step by step: decide, then do one thing or another. PL/pgSQL is PostgreSQL's procedural language for that.",
    atoms: [
      {
        id: "a-db-plpgsql-syntax",
        title: "Basic PL/pgSQL syntax",
        explain:
          "A PL/pgSQL function has the shape: CREATE FUNCTION f(…) RETURNS type LANGUAGE plpgsql AS $$ DECLARE variable type; BEGIN statements; RETURN value; END $$; Variables are declared in DECLARE (with := for an initial value), assigned with :=, and filled from a query with SELECT … INTO variable. Every statement ends with a semicolon. RAISE NOTICE 'text %', value prints a message (shown under the results here, and by psql); RAISE EXCEPTION aborts with an error. DO $$ … $$; runs an anonymous block once, handy for scripts.",
        sqlDemo: {
          setup: ACADEMY,
          caption: "A DO block with a variable, SELECT … INTO and RAISE NOTICE. The NOTICE appears above the result.",
          code: "DO $$\nDECLARE\n  total numeric;\nBEGIN\n  SELECT sum(amount) INTO total FROM payments;\n  RAISE NOTICE 'Total received so far: %', total;\nEND\n$$;",
        },
        sqlLab: {
          setup: ACADEMY,
          task:
            "Write a PL/pgSQL function student_summary(sid integer) RETURNS text that looks up the student's full_name and counts their enrollments into variables, and returns 'Name: N course(s)', for example 'Ada Obi: 2 course(s)'. Then SELECT student_summary(1) AS summary;",
          starter: "CREATE FUNCTION student_summary(sid integer) RETURNS text\nLANGUAGE plpgsql AS $$\nDECLARE\n  name text;\n  n integer;\nBEGIN\n  \nEND\n$$;\n",
          solution: "CREATE FUNCTION student_summary(sid integer) RETURNS text\nLANGUAGE plpgsql AS $$\nDECLARE\n  name text;\n  n integer;\nBEGIN\n  SELECT full_name INTO name FROM students WHERE id = sid;\n  SELECT count(*) INTO n FROM enrollments WHERE student_id = sid;\n  RETURN name || ': ' || n || ' course(s)';\nEND\n$$;\n\nSELECT student_summary(1) AS summary;\n",
          checks: [
            { label: "student_summary(1) returns 'Ada Obi: 2 course(s)'", result: true },
            { label: "It works for any student", query: "SELECT id, student_summary(id) FROM students ORDER BY id", ordered: true },
            { label: "Written in PL/pgSQL", source: "LANGUAGE\\s+plpgsql" },
          ],
          hint: "SELECT full_name INTO name FROM students WHERE id = sid; and SELECT count(*) INTO n …; then RETURN name || ': ' || n || ' course(s)';",
          successMessage: "Variables, SELECT … INTO and RETURN: the core of every PL/pgSQL function.",
        },
      },
      {
        id: "a-db-plpgsql-control",
        title: "Conditional statements and loops",
        explain:
          "PL/pgSQL has IF condition THEN … ELSIF … ELSE … END IF; CASE … END CASE; and loops: FOR i IN 1..10 LOOP … END LOOP; FOR row IN SELECT … LOOP … END LOOP; (iterating over query results), WHILE condition LOOP … END LOOP; with EXIT and CONTINUE. Prefer set-based SQL when it can do the job (one UPDATE beats a loop of UPDATEs, usually by a lot); use loops for genuinely step-by-step logic, or when each row needs a decision SQL cannot express simply.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Write a PL/pgSQL function grade(score integer) RETURNS text using IF / ELSIF: NULL score → 'not graded'; 80 and above → 'distinction'; 70 and above → 'credit'; 50 and above → 'pass'; otherwise 'fail'. Then return id, score and grade(score) AS grade for all enrollments, ordered by id.",
          starter: "CREATE FUNCTION grade(score integer) RETURNS text\nLANGUAGE plpgsql IMMUTABLE AS $$\nBEGIN\n  \nEND\n$$;\n",
          solution: "CREATE FUNCTION grade(score integer) RETURNS text\nLANGUAGE plpgsql IMMUTABLE AS $$\nBEGIN\n  IF score IS NULL THEN\n    RETURN 'not graded';\n  ELSIF score >= 80 THEN\n    RETURN 'distinction';\n  ELSIF score >= 70 THEN\n    RETURN 'credit';\n  ELSIF score >= 50 THEN\n    RETURN 'pass';\n  ELSE\n    RETURN 'fail';\n  END IF;\nEND\n$$;\n\nSELECT id, score, grade(score) AS grade\nFROM enrollments\nORDER BY id;\n",
          checks: [
            { label: "Every enrollment gets the right grade", result: { ordered: true } },
            { label: "Boundary scores are graded correctly", query: "SELECT s, grade(s) FROM (VALUES (NULL::int), (49), (50), (69), (70), (79), (80), (100)) AS t(s)" },
            { label: "Uses IF … ELSIF", source: "\\bELSIF\\b" },
          ],
          hint: "Test IS NULL first, then the highest band. ELSIF (not ELSE IF) continues the chain.",
          successMessage: "One definition of grading, used by every query. Change the bands once, and every report follows.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 13.7 · PROCEDURES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l72-procedures",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.7"],
    title: "Stored Procedures and CALL",
    subtitle: "Named operations that change data",
    estimatedMinutes: 40,
    intro:
      "Functions compute values and are used inside queries. Procedures perform operations: a transfer, a month-end close. They are run on their own with CALL.",
    atoms: [
      {
        id: "a-db-procedures",
        title: "Stored procedures and CALL",
        explain:
          "CREATE PROCEDURE name(params) LANGUAGE plpgsql AS $$ … $$; then CALL name(args); A procedure returns no value (though it can have OUT/INOUT parameters) and, unlike a function, may COMMIT or ROLLBACK inside its body (when called outside an explicit transaction), so it can process work in batches. Use procedures for operations the database should perform the same way every time, whoever calls them. RAISE EXCEPTION inside a procedure aborts it and rolls back its changes. MySQL also has stored procedures, with different syntax (DELIMITER, BEGIN … END).",
        sqlLab: {
          setup: BANK,
          continueOnError: true,
          task:
            "Create a procedure transfer(from_id integer, to_id integer, amt numeric) that raises an exception 'Amount must be positive' if amt <= 0, then debits, credits and inserts into transfers. Then CALL transfer(1, 2, 700); CALL transfer(2, 3, -5); (which must fail and change nothing), and finally SELECT id, balance FROM accounts ORDER BY id;",
          starter: "CREATE PROCEDURE transfer(from_id integer, to_id integer, amt numeric)\nLANGUAGE plpgsql AS $$\nBEGIN\n  \nEND\n$$;\n",
          solution: "CREATE PROCEDURE transfer(from_id integer, to_id integer, amt numeric)\nLANGUAGE plpgsql AS $$\nBEGIN\n  IF amt <= 0 THEN\n    RAISE EXCEPTION 'Amount must be positive';\n  END IF;\n  UPDATE accounts SET balance = balance - amt WHERE id = from_id;\n  UPDATE accounts SET balance = balance + amt WHERE id = to_id;\n  INSERT INTO transfers (from_account, to_account, amount) VALUES (from_id, to_id, amt);\nEND\n$$;\n\nCALL transfer(1, 2, 700);\nCALL transfer(2, 3, -5);\n\nSELECT id, balance FROM accounts ORDER BY id;\n",
          checks: [
            { label: "Balances after one good and one rejected transfer", result: { ordered: true } },
            { label: "Only the good transfer is recorded", query: "SELECT from_account, to_account, amount FROM transfers ORDER BY id", ordered: true },
            { label: "A zero transfer is rejected with your message", rejects: "CALL transfer(1, 2, 0)", error: "Amount must be positive" },
          ],
          hint: "IF amt <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF; then the two UPDATEs and the INSERT.",
          successMessage: "Every transfer now goes through one tested path, and bad ones are refused before anything changes.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 13.8 – 13.9 · TRIGGERS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l73-triggers",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["13.8", "13.9"],
    title: "Triggers",
    subtitle: "Code that runs automatically when data changes",
    estimatedMinutes: 50,
    intro:
      "A trigger runs a function automatically whenever rows are inserted, updated or deleted. Nobody has to remember to call it, which is both its strength and its danger.",
    atoms: [
      {
        id: "a-db-trigger-timing",
        title: "Trigger fundamentals and timing",
        explain:
          "A trigger is two parts: a TRIGGER FUNCTION (RETURNS trigger, LANGUAGE plpgsql) and CREATE TRIGGER name {BEFORE | AFTER} {INSERT | UPDATE | DELETE} ON table FOR EACH ROW EXECUTE FUNCTION f(); Inside a row trigger, NEW is the row being written and OLD the row before the change. A BEFORE trigger runs before the row is stored and can CHANGE it (modify NEW and RETURN NEW) or skip it (RETURN NULL): good for normalising and validating. An AFTER trigger runs once the change is done and sees the final row: good for side effects such as audit logs.",
        sqlLab: {
          setup: STORE,
          task:
            "Make the store always store emails trimmed and in lower case, whoever inserts or updates them: a BEFORE INSERT OR UPDATE trigger on customers that sets NEW.email := lower(trim(NEW.email)). Then insert a customer ' Kemi.Adewale@Example.COM ' (name Kemi Adewale, city Lagos) and select her email.",
          starter: "CREATE FUNCTION normalise_email() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  \nEND\n$$;\n\nCREATE TRIGGER customers_normalise_email\n  BEFORE INSERT OR UPDATE ON customers\n  FOR EACH ROW EXECUTE FUNCTION normalise_email();\n",
          solution: "CREATE FUNCTION normalise_email() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  NEW.email := lower(trim(NEW.email));\n  RETURN NEW;\nEND\n$$;\n\nCREATE TRIGGER customers_normalise_email\n  BEFORE INSERT OR UPDATE ON customers\n  FOR EACH ROW EXECUTE FUNCTION normalise_email();\n\nINSERT INTO customers (full_name, email, city)\nVALUES ('Kemi Adewale', ' Kemi.Adewale@Example.COM ', 'Lagos');\n\nSELECT email FROM customers WHERE full_name = 'Kemi Adewale';\n",
          checks: [
            { label: "Kemi's email is stored normalised", result: true },
            { label: "Updates are normalised too", assert: "WITH u AS (UPDATE customers SET email = '  AMAKA@EXAMPLE.COM' WHERE id = 1 RETURNING email) SELECT email = 'amaka@example.com' FROM u" },
            { label: "A duplicate that differs only in case is now caught", rejects: "INSERT INTO customers (full_name, email, city) VALUES ('Copy', 'ZAINAB@example.com', 'Kano')", code: "23505" },
          ],
          hint: "In the function: NEW.email := lower(trim(NEW.email)); RETURN NEW; — a BEFORE trigger must return the (changed) row.",
          successMessage: "Because the trigger runs BEFORE the row is stored, the UNIQUE constraint now sees the normalised email and catches case-only duplicates.",
        },
      },
      {
        id: "a-db-row-vs-statement",
        title: "Row-level versus statement-level triggers",
        explain:
          "FOR EACH ROW triggers run once per affected row, with NEW and OLD. FOR EACH STATEMENT triggers run once per statement, however many rows it touched (even zero), without NEW and OLD; since PostgreSQL 10 an AFTER statement trigger can see all changed rows through TRANSITION TABLES (REFERENCING NEW TABLE AS new_rows). An UPDATE of 10,000 rows runs a row trigger 10,000 times and a statement trigger once, so statement triggers suit summary work (log 'price list updated', refresh a cache) and row triggers suit per-row work (normalise, audit each change).",
        sqlLab: {
          setup: STORE + "\nCREATE TABLE price_changes (changed_at timestamptz NOT NULL DEFAULT now(), products_changed integer NOT NULL);",
          task:
            "Log each price-change STATEMENT once: an AFTER UPDATE trigger on products, FOR EACH STATEMENT, using REFERENCING NEW TABLE AS new_rows, that inserts (SELECT count(*) FROM new_rows) into price_changes.products_changed. Then raise all bag prices by 5% in one UPDATE and select products_changed from price_changes.",
          starter: "CREATE FUNCTION log_price_change() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  \n  RETURN NULL;\nEND\n$$;\n",
          solution: "CREATE FUNCTION log_price_change() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO price_changes (products_changed)\n  SELECT count(*) FROM new_rows;\n  RETURN NULL;\nEND\n$$;\n\nCREATE TRIGGER products_price_change\n  AFTER UPDATE ON products\n  REFERENCING NEW TABLE AS new_rows\n  FOR EACH STATEMENT EXECUTE FUNCTION log_price_change();\n\nUPDATE products SET unit_price = unit_price * 1.05 WHERE category = 'bags';\n\nSELECT products_changed FROM price_changes;\n",
          checks: [
            { label: "One log row for one statement, counting the bags", result: true },
            { label: "It is a statement-level trigger", source: "FOR\\s+EACH\\s+STATEMENT" },
            { label: "A statement touching no rows still logs once (with 0)", assert: "UPDATE products SET unit_price = unit_price WHERE category = 'toys';\nSELECT count(*) = 2 AND min(products_changed) = 0 FROM price_changes" },
          ],
          hint: "AFTER UPDATE ON products REFERENCING NEW TABLE AS new_rows FOR EACH STATEMENT EXECUTE FUNCTION log_price_change();",
          successMessage: "One UPDATE, one log row, products_changed = 2. A row trigger would have written two rows.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 13.10 – 13.12 · AUDIT TRAILS, VALIDATION, RISKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l74-audit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["13.10", "13.11", "13.12"],
    title: "Audit Trails, Validation and Trigger Risks",
    subtitle: "Recording history, deciding where rules live, and hidden side effects",
    estimatedMinutes: 50,
    intro:
      "Triggers' best-known use is history: who changed what, when, from what to what. Their best-known problem is that they act out of sight.",
    atoms: [
      {
        id: "a-db-audit-trail",
        title: "Audit trails and change history",
        explain:
          "An AUDIT TRAIL records every change to important data in an append-only table: the record's key, the old and new values, when, and by whom (current_user, or an application user passed in with SET LOCAL app.user = …). An AFTER UPDATE row trigger can compare OLD and NEW and log only real changes (WHEN (OLD.status IS DISTINCT FROM NEW.status) on the trigger avoids running it at all otherwise). Audit tables are never updated or deleted by applications (revoke those privileges, Week 14), and are often written to a separate schema.",
        sqlLab: {
          setup: ACADEMY + "\nCREATE TABLE enrollment_history (\n  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  enrollment_id integer NOT NULL,\n  old_status    text,\n  new_status    text,\n  changed_by    text NOT NULL,\n  changed_at    timestamptz NOT NULL DEFAULT now()\n);",
          task:
            "Audit enrollment status changes: an AFTER UPDATE trigger on enrollments, FOR EACH ROW, firing only WHEN (OLD.status IS DISTINCT FROM NEW.status), that inserts the enrollment id, old status, new status and current_user into enrollment_history. Then mark enrollment 2 completed with score 77 and completed_on '2026-08-20', update enrollment 3's score only, and select enrollment_id, old_status, new_status from enrollment_history.",
          starter: "CREATE FUNCTION log_status_change() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  \n  RETURN NEW;\nEND\n$$;\n",
          solution: "CREATE FUNCTION log_status_change() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO enrollment_history (enrollment_id, old_status, new_status, changed_by)\n  VALUES (NEW.id, OLD.status, NEW.status, current_user);\n  RETURN NEW;\nEND\n$$;\n\nCREATE TRIGGER enrollments_status_audit\n  AFTER UPDATE ON enrollments\n  FOR EACH ROW\n  WHEN (OLD.status IS DISTINCT FROM NEW.status)\n  EXECUTE FUNCTION log_status_change();\n\nUPDATE enrollments SET status = 'completed', score = 77, completed_on = '2026-08-20' WHERE id = 2;\nUPDATE enrollments SET score = 60 WHERE id = 3;\n\nSELECT enrollment_id, old_status, new_status FROM enrollment_history;\n",
          checks: [
            { label: "Only the real status change was logged", result: true },
            { label: "Further status changes are logged too", assert: "UPDATE enrollments SET status = 'dropped' WHERE id = 10;\nSELECT count(*) = 1 FROM enrollment_history WHERE enrollment_id = 10 AND old_status = 'active' AND new_status = 'dropped'" },
            { label: "The trigger fires only when status changes", source: "IS\\s+DISTINCT\\s+FROM" },
          ],
          hint: "In the function, INSERT … VALUES (NEW.id, OLD.status, NEW.status, current_user). On the trigger, WHEN (OLD.status IS DISTINCT FROM NEW.status).",
          successMessage: "Enrollment 2's change from active to completed is on record; enrollment 3's score-only update is not, by design.",
        },
      },
      {
        id: "a-db-validation-where",
        title: "Validation in the database versus application code",
        explain:
          "Put a rule where it cannot be bypassed and where it is cheapest to keep correct. In the DATABASE: rules about the data itself that must hold whatever program writes it (types, NOT NULL, UNIQUE, foreign keys, CHECKs, and some trigger-enforced invariants). In the APPLICATION: rules about user interaction and context (friendly error messages, multi-step workflows, rules that need external systems, permissions tied to the logged-in user). Many rules belong in BOTH: the form checks the email format for a helpful message, and the database's UNIQUE and CHECK are the last line of defence for every other path (scripts, imports, other services).",
        decision: decide({
          scenario: "A rule: 'a course's price can never be negative'. The web form already validates it. A data-import script and a second service also write to courses.",
          question: "Where should the rule be enforced?",
          right: ["In the database with CHECK (price >= 0), and also in the form for a friendly message", "The constraint protects every path; the form helps users."],
          wrong: [
            ["Only in the form", "The import script and the other service bypass it."],
            ["Only in the import script", "The other writers still bypass it."],
            ["Nowhere: prices are always typed correctly", "Every rule eventually meets bad data."],
          ],
          at: 0,
          aftermath: "Constraints are documentation that cannot go out of date.",
        }),
      },
      {
        id: "a-db-trigger-risks",
        title: "Trigger risks, debugging and hidden side effects",
        explain:
          "Triggers run invisibly: a developer runs a simple UPDATE and three other tables change, or the UPDATE fails with an error from a function they have never seen. Risks: HIDDEN behaviour nobody remembers; CASCADES of triggers firing other triggers (even recursively); SLOW bulk operations (a row trigger per row); ORDER between several triggers on one table (they fire alphabetically by name); and logic split between the database and the application. Mitigations: keep triggers small and documented, name them clearly, prefer constraints when they suffice, log with RAISE NOTICE while debugging, and list them with \\dS table or pg_trigger. Run the example: one innocent UPDATE, and a surprise.",
        sqlDemo: {
          setup: STORE,
          caption: "Someone once added a trigger that 'helpfully' marks products unlisted when stock reaches 0. Later, a stock correction hides a product from the shop.",
          code: "CREATE FUNCTION hide_when_empty() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  IF NEW.stock = 0 THEN\n    NEW.is_listed := false;\n    RAISE NOTICE 'trigger hide_when_empty: % unlisted', NEW.sku;\n  END IF;\n  RETURN NEW;\nEND\n$$;\n\nCREATE TRIGGER products_hide_when_empty\n  BEFORE UPDATE ON products\n  FOR EACH ROW EXECUTE FUNCTION hide_when_empty();\n\n-- Months later: a stock count finds the scarves were miscounted\nUPDATE products SET stock = 0 WHERE sku = 'SCA-001';\nUPDATE products SET stock = 12 WHERE sku = 'SCA-001';\n\nSELECT sku, stock, is_listed FROM products WHERE sku = 'SCA-001';",
        },
        decision: decide({
          scenario: "After the stock correction, the scarf has 12 in stock but is still unlisted, and nobody on the team knew a trigger existed.",
          question: "What is the lesson for using triggers?",
          right: ["Hidden side effects need visibility: document triggers, name them clearly, and make their behaviour reversible or explicit (or do it in the application)", "Triggers that change unrelated data surprise people."],
          wrong: [
            ["Never use triggers", "Audit trails and normalisation are good uses."],
            ["Add another trigger to relist products", "More hidden logic makes it worse."],
            ["The UPDATE was written wrongly", "The UPDATE did exactly what was asked; the trigger added the surprise."],
          ],
          at: 2,
          aftermath: "Before changing data in an unfamiliar database, list its triggers: SELECT tgname FROM pg_trigger WHERE NOT tgisinternal.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 13.P · PRACTICAL: AN AUDITABLE CHANGE MECHANISM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l75-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["13.P"],
    title: "Week 13 Practical: Auditing Inventory Changes",
    subtitle: "A reusable function and an audit mechanism, with their trade-offs",
    estimatedMinutes: 70,
    intro:
      "The checkpoint: a reusable database function and an auditable change mechanism, built on the online store, then explained.",
    atoms: [
      {
        id: "a-db-p13-audit",
        title: "Audit every stock change",
        explain:
          "The store must be able to answer, for any product, 'who changed the stock, when, from what to what, and why'. Build: a table stock_audit (id identity, product_id, old_stock, new_stock, change integer, reason text, changed_by text default current_user, changed_at timestamptz default now()); and an AFTER UPDATE row trigger on products, firing only when stock changes, that records the change. The REASON comes from the application: read it with current_setting('app.reason', true) (which returns NULL when it is not set); an application sets it per transaction with SET LOCAL app.reason = '…'.",
        sqlLab: {
          setup: STORE,
          task:
            "Create stock_audit and the trigger described above. Then, in one transaction, SET LOCAL app.reason = 'delivery'; and add 10 to the stock of product 1; in a second transaction SET LOCAL app.reason = 'stock count'; and set product 3's stock to 58. Finally select product_id, old_stock, new_stock, change, reason from stock_audit ORDER BY id.",
          starter: "-- stock_audit table\n\n-- trigger function and trigger\n\n-- two changes, each in its own transaction with a reason\n",
          solution: "CREATE TABLE stock_audit (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  product_id integer NOT NULL,\n  old_stock  integer NOT NULL,\n  new_stock  integer NOT NULL,\n  change     integer NOT NULL,\n  reason     text,\n  changed_by text NOT NULL DEFAULT current_user,\n  changed_at timestamptz NOT NULL DEFAULT now()\n);\n\nCREATE FUNCTION audit_stock() RETURNS trigger\nLANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO stock_audit (product_id, old_stock, new_stock, change, reason)\n  VALUES (NEW.id, OLD.stock, NEW.stock, NEW.stock - OLD.stock, current_setting('app.reason', true));\n  RETURN NEW;\nEND\n$$;\n\nCREATE TRIGGER products_stock_audit\n  AFTER UPDATE ON products\n  FOR EACH ROW\n  WHEN (OLD.stock IS DISTINCT FROM NEW.stock)\n  EXECUTE FUNCTION audit_stock();\n\nBEGIN;\nSET LOCAL app.reason = 'delivery';\nUPDATE products SET stock = stock + 10 WHERE id = 1;\nCOMMIT;\n\nBEGIN;\nSET LOCAL app.reason = 'stock count';\nUPDATE products SET stock = 58 WHERE id = 3;\nCOMMIT;\n\nSELECT product_id, old_stock, new_stock, change, reason\nFROM stock_audit\nORDER BY id;\n",
          checks: [
            { label: "Both stock changes are audited with their reasons", result: { ordered: true } },
            { label: "Price-only changes are not audited", assert: "UPDATE products SET unit_price = unit_price + 1 WHERE id = 2;\nSELECT NOT EXISTS (SELECT 1 FROM stock_audit WHERE product_id = 2)" },
            { label: "Any later stock change is audited", assert: "UPDATE products SET stock = stock - 1 WHERE id = 5;\nSELECT EXISTS (SELECT 1 FROM stock_audit WHERE product_id = 5 AND change = -1)" },
            { label: "Changes record who made them", assert: "SELECT bool_and(changed_by IS NOT NULL) FROM stock_audit" },
          ],
          hint: "current_setting('app.reason', true) reads the reason; SET LOCAL lasts only until the end of the transaction.",
          revealSolution: false,
          successMessage: "Every stock change now explains itself, and no application code can forget to log it.",
        },
      },
      {
        id: "a-db-p13-function",
        title: "A reusable stock function",
        explain:
          "Write a reusable function to be used by any report: stock_value(category text) RETURNS numeric, the total value of stock (stock × unit_price) of LISTED products in a category, 0 for a category with nothing. Then use it in a query that lists each distinct category with its stock value, ordered by category.",
        sqlLab: {
          setup: STORE,
          task:
            "Create stock_value(cat text) RETURNS numeric (sum of stock * unit_price for listed products in that category, 0 if none). Then return category and stock_value(category) AS value for each distinct category, ordered by category.",
          starter: "",
          solution: "CREATE FUNCTION stock_value(cat text) RETURNS numeric\nLANGUAGE sql STABLE AS $$\n  SELECT coalesce(sum(stock * unit_price), 0)\n  FROM products\n  WHERE category = cat\n    AND is_listed\n$$;\n\nSELECT category, stock_value(category) AS value\nFROM (SELECT DISTINCT category FROM products) AS c\nORDER BY category;\n",
          checks: [
            { label: "Each category's stock value", result: { ordered: true } },
            { label: "An unknown category gives 0", assert: "SELECT stock_value('toys') = 0" },
            { label: "Unlisted products are excluded", assert: "SELECT stock_value('food') = (SELECT sum(stock * unit_price) FROM products WHERE category = 'food' AND is_listed)" },
          ],
          hint: "coalesce(sum(stock * unit_price), 0) … WHERE category = cat AND is_listed.",
          revealSolution: false,
          successMessage: "One definition of stock value for every report that needs it.",
        },
      },
      {
        id: "a-db-p13-tradeoffs",
        title: "Explain the trade-offs",
        explain:
          "The checkpoint asks you to explain the trade-offs. The trigger guarantees every change is audited, whatever program makes it, but it is invisible, adds work to every stock update, and its reason depends on the application setting app.reason. The function centralises a calculation, but logic in the database must be versioned, tested and migrated like application code.",
        decision: decide({
          scenario: "A developer suggests replacing the audit trigger with 'just logging stock changes in the application code'.",
          question: "What is the main thing that would be lost?",
          right: ["Coverage: changes made by scripts, other services or by hand in psql would no longer be audited", "The trigger audits every path into the table."],
          wrong: [
            ["Speed: application logging is always slower", "Speed is not the main difference."],
            ["Nothing at all", "Every non-application write would go unrecorded."],
            ["The ability to store reasons", "The application could store reasons too."],
          ],
          at: 3,
          aftermath: "A good answer names what each choice guarantees and what it costs.",
        }),
      },
    ],
    task: {
      title: "Week 13 practical: auditable inventory",
      intro: "Build it on your own server and document it.",
      prompts: [
        "Run your stock_audit table, trigger and stock_value function on your own store database, and change stock from psql, from a second psql session as another user, and in a transaction that rolls back. Show what the audit table recorded each time.",
        "Add the enrollment status audit from Lesson 74 to your academy database.",
        "List every trigger in the database with SELECT tgrelid::regclass, tgname FROM pg_trigger WHERE NOT tgisinternal; and write one sentence documenting each.",
        "Write a short paragraph on the trade-offs of the trigger and the function.",
        "Checkpoint: implement a reusable database function and an auditable change mechanism, explaining the trade-offs of each.",
      ],
      closing: "Next: Week 14, security, administration and recovery: roles, injection, backups you have restored, and keeping a server healthy.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
