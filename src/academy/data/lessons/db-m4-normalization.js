/**
 * RELATIONAL DATABASES · WEEK 4 · NORMALIZATION AND DATA INTEGRITY
 *
 * Curriculum 4.1 – 4.P. Update, insertion and deletion anomalies, multi-
 * valued fields, First, Second and Third Normal Form through functional,
 * partial and transitive dependencies, lossless decomposition, BCNF,
 * denormalization and its trade-offs, and the integrity constraints that make
 * a design hold: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT,
 * referential integrity and ON DELETE / ON UPDATE actions.
 *
 * Every anomaly is shown happening on a real flat table, and every fix is
 * built and then attacked with bad data that PostgreSQL must refuse.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { HAS, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s4-normalization";
const MODULE = "db-m4-normalization";

/** The badly designed enrollment table every lesson this week starts from. */
const SHEET = `CREATE TABLE enrollment_sheet (
  student_email    text,
  student_name     text,
  student_city     text,
  city_state       text,
  course_code      text,
  course_title     text,
  course_fee       numeric(10,2),
  instructor       text,
  instructor_email text,
  enrolled_on      date,
  score            integer
);

INSERT INTO enrollment_sheet VALUES
  ('ada@example.com',   'Ada Obi',      'Ikeja',   'Lagos',  'DA-101', 'Data Analysis',        60000, 'Mr. Okafor', 'okafor@academy.ng', '2026-01-06', 88),
  ('ada@example.com',   'Ada Obi',      'Ikeja',   'Lagos',  'DB-101', 'Relational Databases', 55000, 'Mrs. Bello', 'bello@academy.ng',  '2026-05-02', NULL),
  ('bayo@example.com',  'Bayo Adeyemi', 'Ibadan',  'Oyo',    'DB-101', 'Relational Databases', 55000, 'Mrs. Bello', 'bello@academy.ng',  '2026-01-10', 74),
  ('chi@example.com',   'Chiamaka Eze', 'Nsukka',  'Enugu',  'DA-101', 'Data Analysis',        60000, 'Mr. Okafor', 'okafor@academy.ng', '2026-01-16', 91),
  ('dayo@example.com',  'Dayo Bello',   'Ikeja',   'Lagos',  'DB-101', 'Relational Databases', 60000, 'Mrs. Bello', 'bello@academy.ng',  '2026-02-03', 67),
  ('fatima@example.com','Fatima Musa',  'Kano',    'Kano',   'CS-101', 'Cybersecurity',        80000, 'Mr. Musa',   'musa@academy.ng',   '2026-02-22', NULL);`;

/** A small, correctly normalized academy to attach constraints to. */
const BASE = `CREATE TABLE students (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  email     text NOT NULL UNIQUE
);
CREATE TABLE courses (
  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code  text NOT NULL UNIQUE,
  title text NOT NULL,
  fee   numeric(10,2) NOT NULL
);
INSERT INTO students (full_name, email) VALUES ('Ada Obi', 'ada@example.com'), ('Bayo Adeyemi', 'bayo@example.com');
INSERT INTO courses (code, title, fee) VALUES ('DA-101', 'Data Analysis', 60000), ('DB-101', 'Relational Databases', 55000);`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 4.1 – 4.4 · THE PROBLEMS OF POOR DESIGN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l18-anomalies",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3", "4.4"],
    title: "The Problems of Poor Database Design",
    subtitle: "Update, insertion and deletion anomalies, and multi-valued fields",
    estimatedMinutes: 40,
    intro:
      "Here is the table many first databases look like: one row per enrollment, with everything about the student, the course and the instructor copied onto it. It works, until you change anything.",
    atoms: [
      {
        id: "a-db-update-anomaly",
        title: "Repeated data and update anomalies",
        explain:
          "In enrollment_sheet, a course's title, fee and instructor are repeated on every enrollment in it. When the DB-101 fee changed, someone updated some rows and not others: the table now holds two different fees for one course, and nobody can tell which is right. That is an UPDATE ANOMALY: changing one fact requires changing many rows, and missing any leaves the data contradicting itself. The cause is not carelessness but design: the fact is stored more than once.",
        sqlDemo: {
          setup: SHEET,
          caption: "The flat table as it stands. Look at course_fee for DB-101.",
          code: "SELECT student_name, course_code, course_title, course_fee, instructor\nFROM enrollment_sheet;",
        },
        sqlLab: {
          setup: SHEET,
          task:
            "Prove the anomaly with a query: return the distinct combinations of course_code and course_fee for course DB-101 (two columns, course_code then course_fee).",
          starter: "SELECT DISTINCT course_code, course_fee\nFROM enrollment_sheet\n",
          solution: "SELECT DISTINCT course_code, course_fee\nFROM enrollment_sheet\nWHERE course_code = 'DB-101';\n",
          checks: [{ label: "Returns every distinct fee recorded for DB-101", result: true }],
          hint: "Add WHERE course_code = 'DB-101' to keep only that course's rows. DISTINCT removes repeated combinations.",
          successMessage: "Two fees for one course. A database that stores the fee once, in a courses table, could never show this.",
        },
      },
      {
        id: "a-db-insert-anomaly",
        title: "Insertion anomalies",
        explain:
          "An INSERTION ANOMALY is when you cannot record one fact without inventing another. The academy launches a new course, PY-101 Python Programming, fee 50000, before anyone enrolls. Where does it go? Every row of enrollment_sheet is an enrollment, so recording the course means inventing a fake student, or leaving the student columns empty (and every 'count the students' query is now wrong). Likewise you cannot record a new instructor who teaches nothing yet.",
        decision: decide({
          scenario: "Using enrollment_sheet, staff must record the new course PY-101 (Python Programming, ₦50,000, Mr. Okafor) a month before enrollment opens.",
          question: "What is the honest assessment?",
          right: ["The design cannot hold a course without an enrollment, so any workaround (a placeholder student, empty student columns) corrupts the data", "This is an insertion anomaly; the cure is a courses table of its own."],
          wrong: [
            ["Insert a row with student_name 'TBA'", "Then 'TBA' is counted as a student in every report."],
            ["Wait until someone enrolls", "The business needs the course on record now, for marketing and fees."],
            ["Add the course to a spreadsheet instead", "Splitting the truth across tools is exactly the problem a database solves."],
          ],
          at: 0,
          aftermath: "When a fact can only be recorded alongside an unrelated fact, two entities are sharing one table.",
        }),
      },
      {
        id: "a-db-delete-anomaly",
        title: "Deletion anomalies",
        explain:
          "A DELETION ANOMALY is losing facts you wanted to keep because they only lived on the rows you deleted. Fatima Musa is the only student on CS-101. If she withdraws and her row is deleted, the academy also loses CS-101's title, its fee and the fact that Mr. Musa teaches it, and his email. One delete, four unrelated facts gone.",
        sqlLab: {
          setup: SHEET,
          task:
            "Fatima withdraws. Delete her enrollment row (her email is fatima@example.com). Then, in the same script, ask the table for every row whose course_code is 'CS-101' (all columns) to see what is left of the course.",
          starter: "-- 1. Delete Fatima's enrollment\n\n-- 2. What does the table still know about CS-101?\n",
          solution: "DELETE FROM enrollment_sheet\nWHERE student_email = 'fatima@example.com';\n\nSELECT *\nFROM enrollment_sheet\nWHERE course_code = 'CS-101';\n",
          checks: [
            { label: "Fatima's row is gone", assert: "SELECT NOT EXISTS (SELECT 1 FROM enrollment_sheet WHERE student_email = 'fatima@example.com')" },
            { label: "Nothing else was deleted", assert: "SELECT count(*) = 5 FROM enrollment_sheet" },
            { label: "Ends with the CS-101 query", result: true },
          ],
          hint: "DELETE FROM enrollment_sheet WHERE student_email = '…'; then SELECT * FROM enrollment_sheet WHERE course_code = 'CS-101';",
          successMessage: "(0 rows): the course, its fee, its instructor and his email have vanished with one student's withdrawal.",
        },
      },
      {
        id: "a-db-multivalued",
        title: "Why multiple values in one field cause problems",
        explain:
          "Putting several values in one cell ('Python, SQL', or phones '0803…; 0805…') makes the database blind to them. You cannot put a foreign key on part of a cell, so 'SQL' cannot be checked against real courses; you cannot index, count or join the parts without splitting text; you cannot store a fact per value (the fee for each course); and every program that reads the column must re-implement the splitting rules, which drift ('Python,SQL' vs 'Python; SQL'). One value per cell is the first rule of normalization, next lesson.",
        sqlDemo: {
          caption: "To count who takes SQL, the query has to search inside text, and it is wrong: 'MySQL' and 'NoSQL' match too.",
          code: "CREATE TABLE applicants (name text, skills text);\nINSERT INTO applicants VALUES\n  ('Ada', 'Python, SQL'),\n  ('Bayo', 'MySQL, PHP'),\n  ('Chi', 'NoSQL, Go'),\n  ('Dayo', 'Excel');\n\nSELECT count(*) AS knows_sql\nFROM applicants\nWHERE skills LIKE '%SQL%';",
        },
        decision: decide({
          scenario: "A job board stores each applicant's skills as one text column, 'Python, SQL, Excel'. The company wants to search by skill, show how many applicants have each skill, and record years of experience per skill.",
          question: "What is the right design?",
          right: ["A skills table and an applicant_skills table with one row per applicant per skill, holding years_of_experience", "One value per cell lets the database search, count, join and attach facts to each skill."],
          wrong: [
            ["Keep the text and search with LIKE", "LIKE '%SQL%' also matches MySQL and NoSQL, and years per skill cannot be stored."],
            ["Columns skill1 … skill10", "Repeating groups: the limit is arbitrary and queries must check ten columns."],
            ["Store the skills as JSON", "Possible in PostgreSQL, but it gives up foreign keys and simple joins for the core data."],
          ],
          at: 2,
          aftermath: "That is exactly the move from an unnormalized table to First Normal Form.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 4.5 – 4.7 · FIRST NORMAL FORM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l19-1nf",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.5", "4.6", "4.7"],
    title: "First Normal Form (1NF)",
    subtitle: "Atomic values, no repeating groups, related records instead",
    estimatedMinutes: 35,
    intro:
      "Normalization is a sequence of checks, each removing one kind of redundancy. The first is about the shape of single cells and rows.",
    atoms: [
      {
        id: "a-db-1nf-atomic",
        title: "Atomic values",
        explain:
          "A table is in FIRST NORMAL FORM when every column holds a single, ATOMIC value of its declared type (no lists, no 'value1; value2'), every row is unique (it has a key), and there are no repeating groups. 'Atomic' means atomic for the business: a full name may be one value if you never need first and last names separately, but if you sort or address people by surname, it should be two columns. A date stored as text '12/01/2026' is not atomic in practice either: it hides a day, month and year in an ambiguous format.",
        sqlLab: {
          task:
            "This table stores two phone numbers in one cell. Re-create it in 1NF: a table customers (id integer primary key, full_name text NOT NULL) holding Ada (id 1) and Bayo (id 2), and a table customer_phones (customer_id referencing customers, phone text NOT NULL, primary key (customer_id, phone)) with one row per number: Ada has 0803 111 2001 and 0805 111 2002; Bayo has 0807 222 3003.",
          starter: "-- Not in 1NF:\n-- customers(id, full_name, phones)\n--   1  Ada Obi       '0803 111 2001; 0805 111 2002'\n--   2  Bayo Adeyemi  '0807 222 3003'\n\n",
          solution: "CREATE TABLE customers (\n  id        integer PRIMARY KEY,\n  full_name text NOT NULL\n);\n\nCREATE TABLE customer_phones (\n  customer_id integer NOT NULL REFERENCES customers (id),\n  phone       text NOT NULL,\n  PRIMARY KEY (customer_id, phone)\n);\n\nINSERT INTO customers (id, full_name) VALUES (1, 'Ada Obi'), (2, 'Bayo Adeyemi');\n\nINSERT INTO customer_phones (customer_id, phone) VALUES\n  (1, '0803 111 2001'),\n  (1, '0805 111 2002'),\n  (2, '0807 222 3003');\n",
          checks: [
            { label: "customers holds Ada (1) and Bayo (2)", query: "SELECT id, full_name FROM customers ORDER BY id", ordered: true },
            { label: "One row per phone number", query: "SELECT customer_id, phone FROM customer_phones ORDER BY customer_id, phone", ordered: true },
            { label: "customer_phones refers to customers", assert: HAS.fk("customer_phones", "customers", "customer_id") },
            { label: "No phone number cell contains a list", assert: "SELECT bool_and(phone NOT LIKE '%;%' AND phone NOT LIKE '%,%') FROM customer_phones" },
          ],
          hint: "Create both tables first (parents first), then insert the customers, then one customer_phones row per number.",
          successMessage: "Each number is now a value the database can index, check and join. A third number for Ada is just one more row.",
        },
      },
      {
        id: "a-db-1nf-repeating",
        title: "Repeating groups",
        explain:
          "A REPEATING GROUP is the same kind of fact stored in numbered columns: course1, course2, course3, or phone1, phone2. It looks tidier than a list in one cell but has the same problems: an arbitrary maximum, most cells empty, and every query must check every column ('which students take SQL?' becomes course1 = 'SQL' OR course2 = 'SQL' OR course3 = 'SQL'). Adding a fourth means changing the table and every query. 1NF forbids repeating groups as well as lists.",
        decision: decide({
          scenario: "A clinic table has columns patient_name, allergy1, allergy2, allergy3. A new patient has five allergies.",
          question: "What is the 1NF fix?",
          right: ["A patient_allergies table with one row per patient per allergy", "Any number of allergies, each a row, each checkable against a list of allergens."],
          wrong: [
            ["Add allergy4 and allergy5", "The next patient will have six; every query must check five columns."],
            ["Put the extra two in allergy3 separated by commas", "That breaks atomicity on top of the repeating group."],
            ["Record only the three most serious", "Losing medical facts to fit a design is dangerous."],
          ],
          at: 1,
          aftermath: "Repeated columns and lists in cells are the same mistake in two disguises.",
        }),
      },
      {
        id: "a-db-1nf-related-records",
        title: "Moving repeated values into related records",
        explain:
          "The general fix is always the same: move the repeated values into a CHILD table, one row per value, with a foreign key back to the parent and the pair as the key. The result can be queried directly: 'who has the skill SQL' is WHERE skill = 'SQL', exactly; 'how many skills does each applicant have' is a count per applicant. The child can carry facts about each value (years of experience, the date a phone was verified).",
        sqlLab: {
          setup: "CREATE TABLE applicants (id integer PRIMARY KEY, full_name text NOT NULL);\nINSERT INTO applicants VALUES (1, 'Ada'), (2, 'Bayo'), (3, 'Chi');\nCREATE TABLE applicant_skills (\n  applicant_id integer NOT NULL REFERENCES applicants (id),\n  skill        text NOT NULL,\n  years        integer NOT NULL,\n  PRIMARY KEY (applicant_id, skill)\n);\nINSERT INTO applicant_skills VALUES (1, 'Python', 3), (1, 'SQL', 2), (2, 'MySQL', 4), (2, 'PHP', 5), (3, 'NoSQL', 1), (3, 'SQL', 1);",
          task:
            "The skills are now one row each. Return the applicant_id and years of every applicant whose skill is exactly SQL (two columns: applicant_id, years). MySQL and NoSQL must not appear.",
          starter: "SELECT applicant_id, years\nFROM applicant_skills\n",
          solution: "SELECT applicant_id, years\nFROM applicant_skills\nWHERE skill = 'SQL';\n",
          checks: [{ label: "Exactly the applicants with the skill SQL", result: true }],
          hint: "With one value per row, an exact comparison works: WHERE skill = 'SQL'.",
          successMessage: "Ada and Chi, with their years. Compare that with the LIKE '%SQL%' guesswork from Lesson 18.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 4.8 – 4.13 · SECOND AND THIRD NORMAL FORM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l20-2nf-3nf",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.8", "4.9", "4.10", "4.11", "4.12", "4.13"],
    title: "Second and Third Normal Form",
    subtitle: "Functional, partial and transitive dependencies",
    estimatedMinutes: 50,
    intro:
      "1NF fixes the shape of cells. 2NF and 3NF fix where facts live, using one precise idea: which columns determine which.",
    atoms: [
      {
        id: "a-db-functional-dependency",
        title: "Functional dependencies",
        explain:
          "Column B is FUNCTIONALLY DEPENDENT on column A (written A → B) when each value of A determines exactly one value of B. In the academy: student_email → student_name (one email, one name); course_code → course_title, course_fee; (student_email, course_code) → enrolled_on, score. Dependencies come from the business rules, not from the data you happen to have. Normalization is the art of making every non-key column depend on THE KEY, THE WHOLE KEY, AND NOTHING BUT THE KEY.",
        decision: decide({
          scenario: "In enrollment_sheet, which dependency holds according to the academy's rules?",
          question: "Choose the true functional dependency.",
          right: ["course_code → course_title", "Each course code names exactly one course title."],
          wrong: [
            ["course_title → student_name", "Many students take each course."],
            ["student_city → student_email", "Many students live in one city."],
            ["score → course_code", "The same score happens in many courses."],
          ],
          at: 3,
          aftermath: "Write the dependencies down first; the tables then follow from them.",
        }),
      },
      {
        id: "a-db-2nf",
        title: "Second Normal Form: partial dependencies",
        explain:
          "2NF applies to tables whose key has several columns. A table is in 2NF when it is in 1NF and no non-key column depends on only PART of the key. In an enrollment table keyed by (student_email, course_code), course_title and course_fee depend on course_code alone: a PARTIAL DEPENDENCY. That is why they repeat on every enrollment in the course, and why the fee could disagree. The fix: move them to a table keyed by the part they depend on, courses(code, title, fee), and keep only the facts about the pairing (enrolled_on, score) in enrollments.",
        sqlLab: {
          setup: SHEET,
          erd: true,
          task:
            "Take course facts out of the sheet. Create courses (code text primary key, title text NOT NULL, fee numeric(10,2) NOT NULL) and fill it from enrollment_sheet with INSERT … SELECT DISTINCT course_code, course_title, course_fee. It will FAIL for DB-101, which has two fees. Read the error, then insert DB-101 with the correct fee, 55000, by filtering it out of the SELECT and inserting it separately.",
          starter: "CREATE TABLE courses (\n  code  text PRIMARY KEY,\n  title text NOT NULL,\n  fee   numeric(10,2) NOT NULL\n);\n\nINSERT INTO courses (code, title, fee)\nSELECT DISTINCT course_code, course_title, course_fee\nFROM enrollment_sheet;\n",
          solution: "CREATE TABLE courses (\n  code  text PRIMARY KEY,\n  title text NOT NULL,\n  fee   numeric(10,2) NOT NULL\n);\n\nINSERT INTO courses (code, title, fee)\nSELECT DISTINCT course_code, course_title, course_fee\nFROM enrollment_sheet\nWHERE course_code <> 'DB-101';\n\nINSERT INTO courses (code, title, fee)\nVALUES ('DB-101', 'Relational Databases', 55000);\n",
          checks: [
            { label: "courses has each course exactly once, with DB-101 at 55000", query: "SELECT code, title, fee FROM courses ORDER BY code", ordered: true },
            { label: "code is the primary key", assert: HAS.pk("courses", ["code"]) },
          ],
          hint: "The first INSERT fails with a duplicate key: DB-101 appears twice because of its two fees. Add WHERE course_code <> 'DB-101' and insert DB-101 on its own.",
          successMessage: "The primary key refused the contradiction the flat table had been hiding. Each course's facts now live in exactly one row.",
        },
      },
      {
        id: "a-db-composite-keys-matter",
        title: "Why composite keys matter",
        explain:
          "Partial dependencies can only exist when the key has more than one column, which is why 2NF is about composite keys. A table with a single-column key is automatically in 2NF once it is in 1NF. But replacing a composite key with a surrogate id does NOT remove the problem: if enrollments(id, student_email, course_code, course_title) has course_title depending on course_code, the redundancy is still there. Find the real candidate key ((student_email, course_code)) and normalize against it; a surrogate id is a convenience added afterwards.",
        decision: decide({
          scenario: "A teammate says: 'enrollments has a single id primary key, so 2NF does not apply and course_title can stay on it.'",
          question: "What is the flaw in that argument?",
          right: ["Normalization is judged against the candidate keys; course_title still depends on course_code, only part of the real key (student, course)", "A surrogate id hides the dependency; it does not remove the repetition."],
          wrong: [
            ["None; single-column keys are always in 2NF", "True of the key you check against, but the real candidate key here is composite."],
            ["course_title should be the primary key", "Titles are not unique per enrollment."],
            ["2NF only applies in MySQL", "Normal forms are database-independent theory."],
          ],
          at: 0,
          aftermath: "Keys first, then dependencies, then tables. Surrogates come last.",
        }),
      },
      {
        id: "a-db-3nf",
        title: "Third Normal Form: transitive dependencies",
        explain:
          "A table is in 3NF when it is in 2NF and no non-key column depends on ANOTHER non-key column. In students(email, name, city, state), email → city and city → state, so state depends on the key only THROUGH city: a TRANSITIVE DEPENDENCY. Every student in Ikeja repeats 'Lagos', and changing one could make Ikeja belong to two states. The fix: move the dependency into its own table, cities(city primary key, state), and keep city in students as a foreign key.",
        sqlLab: {
          setup: SHEET,
          erd: true,
          task:
            "Remove the transitive dependency city → state. Create cities (name text primary key, state text NOT NULL), fill it with the distinct student_city / city_state pairs from enrollment_sheet, then create students (email text primary key, full_name text NOT NULL, city text NOT NULL referencing cities) and fill it with the distinct email, name and city.",
          starter: "-- 1. cities\n\n-- 2. students\n",
          solution: "CREATE TABLE cities (\n  name  text PRIMARY KEY,\n  state text NOT NULL\n);\n\nINSERT INTO cities (name, state)\nSELECT DISTINCT student_city, city_state\nFROM enrollment_sheet;\n\nCREATE TABLE students (\n  email     text PRIMARY KEY,\n  full_name text NOT NULL,\n  city      text NOT NULL REFERENCES cities (name)\n);\n\nINSERT INTO students (email, full_name, city)\nSELECT DISTINCT student_email, student_name, student_city\nFROM enrollment_sheet;\n",
          checks: [
            { label: "cities holds each city once with its state", query: "SELECT name, state FROM cities ORDER BY name", ordered: true },
            { label: "students holds each student once with their city", query: "SELECT email, full_name, city FROM students ORDER BY email", ordered: true },
            { label: "students.city refers to cities", assert: HAS.fk("students", "cities", "city") },
            { label: "students has no state column any more", assert: `SELECT NOT (${HAS.column("students", "state")}) AND NOT (${HAS.column("students", "city_state")})` },
          ],
          hint: "INSERT INTO cities SELECT DISTINCT student_city, city_state FROM enrollment_sheet; then create students with city REFERENCES cities (name).",
          successMessage: "'Ikeja is in Lagos' is now stored once. Ada and Dayo both point at it.",
        },
      },
      {
        id: "a-db-separate-facts",
        title: "Separating facts that belong to different entities",
        explain:
          "2NF and 3NF are formal ways of asking one plain question about every column: WHAT IS THIS A FACT ABOUT? A course fee is a fact about a course; an instructor's email is a fact about an instructor; a score is a fact about one student in one course. Put each fact on the table of the thing it describes and the normal forms usually take care of themselves. The flat sheet mixes four subjects (students, courses, instructors, enrollments); a normalized design has a table for each, linked by keys.",
        decision: decide({
          scenario: "In the flat enrollment_sheet, where does instructor_email belong after normalization?",
          question: "Choose its home.",
          right: ["On an instructors table, with courses referring to the instructor", "It is a fact about the instructor, not about a course or an enrollment."],
          wrong: [
            ["On enrollments", "It would repeat on every enrollment of every course they teach."],
            ["On courses", "If an instructor teaches two courses, their email repeats and can disagree."],
            ["On students", "It has nothing to do with students."],
          ],
          at: 1,
          aftermath: "'The key, the whole key and nothing but the key' is the same question in a catchier form.",
        }),
      },
      {
        id: "a-db-lossless",
        title: "Normalizing without losing meaningful relationships",
        explain:
          "Splitting a table must be LOSSLESS: you must be able to rebuild the original rows exactly by joining the pieces on their keys. That is why each piece keeps the key columns that link it to the others: enrollments keeps student_email and course_code. If you split on columns that are not keys (separating names from scores with nothing to join them on), the relationship between them is lost forever, and joining back invents combinations that never happened. Run the example: the normalized tables join back into the original sheet's facts.",
        sqlDemo: {
          setup: `${SHEET}
CREATE TABLE courses AS SELECT DISTINCT course_code AS code, course_title AS title FROM enrollment_sheet;
CREATE TABLE students AS SELECT DISTINCT student_email AS email, student_name AS full_name FROM enrollment_sheet;
CREATE TABLE enrollments AS SELECT student_email, course_code, enrolled_on, score FROM enrollment_sheet;`,
          caption: "Three normalized tables, joined back on their keys, give back every enrollment with names and titles.",
          code: "SELECT s.full_name, c.title, e.enrolled_on, e.score\nFROM enrollments AS e\nJOIN students AS s ON s.email = e.student_email\nJOIN courses AS c ON c.code = e.course_code\nORDER BY e.enrolled_on;",
        },
        decision: decide({
          scenario: "Someone normalizes the sheet into students(email, name) and scores(score, enrolled_on), without carrying the email or course code into scores.",
          question: "What has gone wrong?",
          right: ["The split is lossy: nothing says whose score is whose, so the original enrollments can never be rebuilt", "Each piece must keep the key that links it back."],
          wrong: [
            ["Nothing; fewer columns is always better", "Losing the link loses the information itself."],
            ["scores needs a surrogate id to fix it", "An id would not say which student or course a score belongs to."],
            ["It is fine as long as rows stay in the same order", "Row order means nothing in a relational table."],
          ],
          at: 2,
          aftermath: "Normalize by moving facts, never by cutting links.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 4.14 – 4.16 · BEYOND THE BASICS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l21-bcnf-denormalization",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.14", "4.15", "4.16"],
    title: "BCNF and Denormalization",
    subtitle: "A stricter form, and when to deliberately break the rules",
    estimatedMinutes: 35,
    intro:
      "Third Normal Form is the target for most designs. Two more ideas round it off: a slightly stricter form, and the conscious decision to store something twice.",
    atoms: [
      {
        id: "a-db-bcnf",
        title: "Boyce–Codd Normal Form (BCNF)",
        explain:
          "BCNF tightens 3NF: for EVERY functional dependency A → B in a table, A must be a candidate key. Most 3NF tables are already in BCNF; the difference appears when there are overlapping candidate keys. Classic example: tutoring(student, subject, tutor) where each tutor teaches only one subject (tutor → subject) and a student has one tutor per subject. The key is (student, subject), but tutor → subject and tutor is not a key, so the fact 'Mr. Okafor teaches Maths' repeats for every student he tutors. BCNF splits it: tutors(tutor, subject) and tutoring(student, tutor).",
        decision: decide({
          scenario: "tutoring(student, subject, tutor): each tutor teaches exactly one subject; each student has one tutor per subject. The key is (student, subject).",
          question: "Why is this table not in BCNF?",
          right: ["tutor → subject holds, but tutor is not a candidate key", "BCNF requires every determinant to be a candidate key."],
          wrong: [
            ["Because it has three columns", "Column count is irrelevant."],
            ["Because student is not unique", "The key is (student, subject), which is unique."],
            ["Because it has a composite key", "Composite keys are fine in BCNF."],
          ],
          at: 0,
          aftermath: "In practice: if a non-key column determines something, give that something its own table.",
        }),
      },
      {
        id: "a-db-denormalization",
        title: "When denormalization may be useful",
        explain:
          "DENORMALIZATION is storing a fact more than once ON PURPOSE, usually to make frequent reads cheaper. Legitimate examples: an order line stores the unit_price at the time of sale (not a copy of the product's current price, but a historical fact of its own, so it is not really redundancy); a reporting table or materialized view (Week 10) pre-computes monthly totals for a dashboard; a posts table keeps comment_count so a feed does not count comments for every post. Each copy must have an owner that keeps it correct, often a trigger (Week 13), a scheduled refresh, or a transaction that updates both.",
        decision: decide({
          scenario: "An online shop's order_items table has a unit_price column, even though products also has a unit_price.",
          question: "Is this harmful redundancy?",
          right: ["No: the order line records the price actually charged when the order was placed, a different fact from today's product price", "When the product price changes, old orders must keep what customers paid."],
          wrong: [
            ["Yes: remove it and always use products.unit_price", "Then every past invoice would change whenever a price changes."],
            ["Yes: update every order line whenever a price changes", "That would rewrite history and every receipt."],
            ["It does not matter either way", "It matters a great deal to accounting."],
          ],
          at: 3,
          aftermath: "Before calling something redundant, ask whether it is the same fact or a different fact that happens to look alike.",
        }),
      },
      {
        id: "a-db-consistency-performance",
        title: "Consistency versus read performance",
        explain:
          "The trade-off is simple to state. A normalized design stores each fact once, so writes are cheap and consistency is guaranteed, but some reads must join several tables. A denormalized design makes those reads simpler and sometimes faster, but every write must update several places, and any bug leaves contradictions. The professional default is: normalize to 3NF, measure real performance (Week 12), and denormalize only a specific, proven bottleneck, with a clear mechanism that keeps the copy correct. Modern PostgreSQL joins thousands of rows in milliseconds; premature denormalization buys complexity, not speed.",
        sqlDemo: {
          setup: BASE + "\nCREATE TABLE enrollments (student_id integer REFERENCES students, course_id integer REFERENCES courses, PRIMARY KEY (student_id, course_id));\nINSERT INTO enrollments VALUES (1, 1), (1, 2), (2, 2);\nALTER TABLE courses ADD COLUMN student_count integer NOT NULL DEFAULT 0;\nUPDATE courses SET student_count = 2 WHERE code = 'DB-101';\nUPDATE courses SET student_count = 1 WHERE code = 'DA-101';",
          caption: "courses has a denormalized student_count. A new enrollment is added, but nothing updates the copy: now the two disagree.",
          code: "INSERT INTO enrollments VALUES (2, 1);\n\nSELECT c.code,\n       c.student_count AS stored_count,\n       (SELECT count(*) FROM enrollments AS e WHERE e.course_id = c.id) AS real_count\nFROM courses AS c\nORDER BY c.code;",
        },
        decision: decide({
          scenario: "A dashboard query joining four normalized tables takes 40 ms. A developer proposes copying customer names onto every order 'for performance'.",
          question: "What is the sound response?",
          right: ["Keep it normalized: 40 ms is fine, and the copy would add a consistency risk for no measurable gain", "Denormalize only a measured bottleneck, with a mechanism that keeps copies correct."],
          wrong: [
            ["Denormalize everything to be safe", "That trades guaranteed consistency for imagined speed."],
            ["Remove the joins by deleting the customers table", "That destroys the data model."],
            ["Copy the names, and fix any mismatches by hand", "Manual fixing does not scale and will be forgotten."],
          ],
          at: 1,
          aftermath: "Week 12 teaches how to measure first.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 4.17 – 4.21 · INTEGRITY CONSTRAINTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l22-constraints",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.17", "4.18", "4.19", "4.20", "4.21"],
    title: "Integrity Constraints and Referential Actions",
    subtitle: "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT, ON DELETE",
    estimatedMinutes: 50,
    intro:
      "A good design is a set of rules. Constraints are how you hand those rules to the database, so that no application, script or tired person at midnight can break them.",
    atoms: [
      {
        id: "a-db-constraints",
        title: "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL and CHECK",
        explain:
          "Five constraints carry most rules. PRIMARY KEY: identifies each row (unique, not null). FOREIGN KEY: a value must exist in another table. UNIQUE: no two rows share a value (or combination); unlike a primary key it allows NULLs. NOT NULL: a value is required. CHECK (condition): every row must satisfy a condition on its own columns, such as CHECK (score BETWEEN 0 AND 100) or CHECK (end_date > start_date). Name important constraints (CONSTRAINT enrollments_score_range CHECK (…)) so error messages are readable. Constraints are checked on every INSERT and UPDATE; a violation rolls the statement back and says which constraint failed.",
        sqlLab: {
          setup: BASE,
          task:
            "Create enrollments for the academy: student_id and course_id (required foreign keys, together the primary key), enrolled_on (date, required), status (text, required, only 'active', 'completed' or 'dropped'), and score (integer, optional, but if present between 0 and 100).",
          starter: "CREATE TABLE enrollments (\n  \n);\n",
          solution: "CREATE TABLE enrollments (\n  student_id  integer NOT NULL REFERENCES students (id),\n  course_id   integer NOT NULL REFERENCES courses (id),\n  enrolled_on date NOT NULL,\n  status      text NOT NULL CHECK (status IN ('active', 'completed', 'dropped')),\n  score       integer CHECK (score BETWEEN 0 AND 100),\n  PRIMARY KEY (student_id, course_id)\n);\n",
          checks: [
            { label: "A valid enrollment is accepted (score may be empty)", accepts: "INSERT INTO enrollments VALUES (1, 1, '2026-01-06', 'active', NULL)" },
            { label: "An unknown status is refused", rejects: "INSERT INTO enrollments VALUES (2, 1, '2026-01-06', 'paused', NULL)", code: "23514" },
            { label: "A score of 104 is refused", rejects: "INSERT INTO enrollments VALUES (2, 2, '2026-01-06', 'completed', 104)", code: "23514" },
            { label: "A missing status is refused", rejects: "INSERT INTO enrollments (student_id, course_id, enrolled_on) VALUES (2, 2, '2026-01-06')", code: "23502" },
            { label: "A course that does not exist is refused", rejects: "INSERT INTO enrollments VALUES (1, 9, '2026-01-06', 'active', NULL)", code: "23503" },
            { label: "The same student and course twice is refused", rejects: "INSERT INTO enrollments VALUES (1, 2, '2026-01-06', 'active', NULL), (1, 2, '2026-02-06', 'active', NULL)", code: "23505" },
          ],
          mustFail: [
            "CREATE TABLE enrollments (\n  student_id integer NOT NULL REFERENCES students (id),\n  course_id integer NOT NULL REFERENCES courses (id),\n  enrolled_on date NOT NULL,\n  status text NOT NULL,\n  score integer,\n  PRIMARY KEY (student_id, course_id)\n);",
          ],
          hint: "CHECK (status IN ('active', 'completed', 'dropped')) and CHECK (score BETWEEN 0 AND 100). A NULL score passes a CHECK, which is what 'optional' needs.",
          successMessage: "Five bad rows, five refusals, each naming its rule. That is what 'the database enforces the design' means.",
        },
      },
      {
        id: "a-db-defaults",
        title: "Default values",
        explain:
          "DEFAULT gives a column a value when an INSERT leaves it out: DEFAULT current_date, DEFAULT now(), DEFAULT 'active', DEFAULT 0, DEFAULT true. Defaults make inserts shorter and safer (a new enrollment is active unless someone says otherwise) and keep NOT NULL columns easy to fill. A default is only a starting value: it does not stop anyone storing something else, so combine it with CHECK when the domain matters. DEFAULT is also the keyword to ask for the default explicitly: VALUES (1, 2, DEFAULT).",
        sqlLab: {
          setup: BASE,
          task:
            "Create payments: id (auto-numbered primary key), student_id (required, references students), amount (numeric(10,2), required, must be more than 0), method (text, required, default 'transfer'), and paid_at (timestamptz, required, default now()). Then insert one payment of 30000 for student 1 giving only student_id and amount.",
          starter: "CREATE TABLE payments (\n  \n);\n\nINSERT INTO payments (student_id, amount) VALUES (1, 30000);\n",
          solution: "CREATE TABLE payments (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  student_id integer NOT NULL REFERENCES students (id),\n  amount     numeric(10,2) NOT NULL CHECK (amount > 0),\n  method     text NOT NULL DEFAULT 'transfer',\n  paid_at    timestamptz NOT NULL DEFAULT now()\n);\n\nINSERT INTO payments (student_id, amount) VALUES (1, 30000);\n",
          checks: [
            { label: "The payment got method 'transfer' and a paid_at time from the defaults", assert: "SELECT count(*) = 1 AND bool_and(method = 'transfer' AND paid_at IS NOT NULL) FROM payments" },
            { label: "A payment of 0 is refused", rejects: "INSERT INTO payments (student_id, amount) VALUES (1, 0)", code: "23514" },
            { label: "Another method can still be given", accepts: "INSERT INTO payments (student_id, amount, method) VALUES (2, 5000, 'card')" },
          ],
          hint: "method text NOT NULL DEFAULT 'transfer', paid_at timestamptz NOT NULL DEFAULT now(), amount … CHECK (amount > 0).",
          successMessage: "Two columns filled by the database itself, and a CHECK guarding the one that matters most.",
        },
      },
      {
        id: "a-db-referential-integrity",
        title: "Referential integrity",
        explain:
          "REFERENTIAL INTEGRITY means every foreign key value points at a row that exists. PostgreSQL protects it from both sides. On the child side, an INSERT or UPDATE that would point at nothing is refused. On the parent side, a DELETE (or a change of the key) that would leave children pointing at nothing is refused too, by default. The error's DETAIL names the row and the table involved. Without these guarantees, reports join to nothing and silently drop records, which is far harder to notice than an error.",
        sqlLab: {
          setup: BASE + "\nCREATE TABLE enrollments (student_id integer NOT NULL REFERENCES students (id), course_id integer NOT NULL REFERENCES courses (id), PRIMARY KEY (student_id, course_id));\nINSERT INTO enrollments VALUES (1, 1), (1, 2), (2, 2);",
          task:
            "Try DELETE FROM courses WHERE code = 'DB-101'; and read the error. The academy really does want to withdraw DB-101: delete its enrollments FIRST, then the course, in one script. (Course DB-101 has id 2.)",
          starter: "DELETE FROM courses WHERE code = 'DB-101';\n",
          solution: "DELETE FROM enrollments WHERE course_id = 2;\n\nDELETE FROM courses WHERE code = 'DB-101';\n",
          checks: [
            { label: "DB-101 is gone", assert: "SELECT NOT EXISTS (SELECT 1 FROM courses WHERE code = 'DB-101')" },
            { label: "No enrollment points at a missing course", assert: "SELECT NOT EXISTS (SELECT 1 FROM enrollments e WHERE NOT EXISTS (SELECT 1 FROM courses c WHERE c.id = e.course_id))" },
            { label: "DA-101 and its enrollment are untouched", assert: "SELECT EXISTS (SELECT 1 FROM courses WHERE code = 'DA-101') AND EXISTS (SELECT 1 FROM enrollments WHERE course_id = 1)" },
          ],
          hint: "Children before parents: DELETE FROM enrollments WHERE course_id = 2; then the course.",
          successMessage: "Order matters, and the database made you think about what happens to the enrollments. Next: telling it what to do automatically.",
        },
      },
      {
        id: "a-db-referential-actions",
        title: "ON DELETE and ON UPDATE actions",
        explain:
          "A foreign key can say what happens to children when the parent is deleted or its key changes. NO ACTION / RESTRICT (the default): refuse. CASCADE: delete (or update) the children too. SET NULL: set the children's foreign key to NULL (the column must allow NULL). SET DEFAULT: set it to its default. Choose per relationship from the business rule: an order's lines are part of the order (ON DELETE CASCADE); a customer with orders must not vanish (RESTRICT); a student's optional mentor leaving should not delete the student (SET NULL). ON UPDATE CASCADE matters when keys can change, which is one more reason to use stable surrogate keys.",
        sqlLab: {
          erd: true,
          task:
            "Create orders (id integer primary key) and order_items (order_id integer NOT NULL, product text NOT NULL, quantity integer NOT NULL, primary key (order_id, product)) so that deleting an order deletes its items automatically. Then insert order 1 with two items ('Tote', 2) and ('Scarf', 1), and delete order 1.",
          starter: "CREATE TABLE orders (\n  id integer PRIMARY KEY\n);\n\nCREATE TABLE order_items (\n  \n);\n",
          solution: "CREATE TABLE orders (\n  id integer PRIMARY KEY\n);\n\nCREATE TABLE order_items (\n  order_id integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,\n  product  text NOT NULL,\n  quantity integer NOT NULL,\n  PRIMARY KEY (order_id, product)\n);\n\nINSERT INTO orders VALUES (1);\nINSERT INTO order_items VALUES (1, 'Tote', 2), (1, 'Scarf', 1);\n\nDELETE FROM orders WHERE id = 1;\n",
          checks: [
            { label: "order_items.order_id refers to orders with ON DELETE CASCADE", assert: HAS.onDelete("order_items", "orders", "c") },
            { label: "Order 1 and its items are gone", assert: "SELECT NOT EXISTS (SELECT 1 FROM orders) AND NOT EXISTS (SELECT 1 FROM order_items)" },
          ],
          hint: "order_id integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE",
          successMessage: "One DELETE removed the order and its lines, because the lines are part of the order.",
        },
      },
      {
        id: "a-db-cascade-danger",
        title: "Cascading actions and when they are dangerous",
        explain:
          "CASCADE is powerful because it is silent. A delete on one row can remove thousands of rows in other tables, and cascades chain: delete a customer → their orders cascade → each order's items and payments cascade. Used on the wrong relationship, one mistaken DELETE erases financial history. Rules of thumb: CASCADE only for true PARTS of the parent (order lines, a post's attachments), never for independent things or records with legal or financial meaning (payments, invoices, audit logs). For people and accounts, prefer RESTRICT and a 'soft delete' (an is_active or deleted_at column). Run the example to watch one delete take out a customer's entire history.",
        sqlDemo: {
          caption: "Every foreign key here says ON DELETE CASCADE. Deleting one customer silently removes their orders, items and payments.",
          code: "CREATE TABLE customers (id integer PRIMARY KEY, name text);\nCREATE TABLE orders (id integer PRIMARY KEY, customer_id integer REFERENCES customers ON DELETE CASCADE);\nCREATE TABLE order_items (order_id integer REFERENCES orders ON DELETE CASCADE, product text);\nCREATE TABLE payments (order_id integer REFERENCES orders ON DELETE CASCADE, amount numeric);\n\nINSERT INTO customers VALUES (1, 'Amaka');\nINSERT INTO orders VALUES (10, 1), (11, 1);\nINSERT INTO order_items VALUES (10, 'Tote'), (10, 'Shea butter'), (11, 'Scarf');\nINSERT INTO payments VALUES (10, 14500), (11, 6000);\n\nDELETE FROM customers WHERE id = 1;\n\nSELECT (SELECT count(*) FROM orders) AS orders,\n       (SELECT count(*) FROM order_items) AS items,\n       (SELECT count(*) FROM payments) AS payments;",
        },
        decision: decide({
          scenario: "A shop's payments table refers to orders with ON DELETE CASCADE. Support staff delete a duplicate customer account, and that customer's orders cascade away.",
          question: "What should the design have been?",
          right: ["payments → orders and orders → customers with RESTRICT (the default), and customers deactivated rather than deleted", "Financial records must never disappear as a side effect of another delete."],
          wrong: [
            ["CASCADE is fine if staff are careful", "Designs must survive mistakes; this one turns a mistake into data loss."],
            ["SET NULL on payments.order_id", "Payments would survive but lose what they paid for."],
            ["Remove the foreign keys so nothing cascades", "Then payments could point at orders that do not exist."],
          ],
          at: 0,
          aftermath: "In Week 13 you will add an audit trail, so even permitted deletes leave a record.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 4.P · PRACTICAL: NORMALIZE THE ENROLLMENT SHEET
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l23-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.P"],
    title: "Week 4 Practical: Normalize the Enrollment Sheet",
    subtitle: "From one flat table to a design that rejects bad data",
    estimatedMinutes: 70,
    intro:
      "The checkpoint: take this week's flat enrollment_sheet, identify its anomalies, normalize it to 3NF, implement it with constraints, move the data across, and prove the database rejects invalid data. No model answer: the checks attack your design.",
    atoms: [
      {
        id: "a-db-p4-analyse",
        title: "Identify the anomalies",
        explain:
          "Before designing, list what is wrong with enrollment_sheet and why. For each column, write its functional dependency: student_email → student_name, student_city; student_city → city_state; course_code → course_title, course_fee, instructor; instructor → instructor_email; (student_email, course_code) → enrolled_on, score. Then name the anomaly each dependency causes in the flat table.",
        sqlDemo: {
          setup: SHEET,
          caption: "The sheet you will normalize.",
          code: "SELECT * FROM enrollment_sheet ORDER BY enrolled_on;",
        },
        decision: decide({
          scenario: "In enrollment_sheet, instructor_email depends on instructor, which depends on course_code, which is only part of the key (student_email, course_code).",
          question: "Which normal forms does that dependency chain break?",
          right: ["2NF (course facts depend on part of the key) and 3NF (instructor_email depends on instructor, a non-key column)", "Both partial and transitive dependencies are present."],
          wrong: [
            ["Only 1NF", "Every cell is a single value, so 1NF is satisfied."],
            ["None: it is in BCNF", "Partial and transitive dependencies both exist."],
            ["Only 3NF", "course_title depending on course_code alone also breaks 2NF."],
          ],
          at: 2,
          aftermath: "Each dependency you wrote down becomes a table whose key is its left-hand side.",
        }),
      },
      {
        id: "a-db-p4-implement",
        title: "Normalize and implement",
        explain:
          "Design and build the 3NF schema, then move the data from enrollment_sheet into it with INSERT … SELECT. Use exactly these tables and key columns so the checks can test them: cities(name PK, state), students(email PK, full_name, city → cities), instructors(name PK, email), courses(code PK, title, fee, instructor → instructors), enrollments(student_email → students, course_code → courses, enrolled_on, score; key (student_email, course_code)). Resolve the DB-101 fee conflict to 55000. Add constraints for every rule: fees above zero, scores 0 to 100 when present, instructor emails unique, everything required except score.",
        sqlLab: {
          setup: SHEET,
          erd: true,
          task:
            "Build cities, students, instructors, courses and enrollments in 3NF with every constraint from the brief, and fill them from enrollment_sheet (DB-101's fee is 55000). Keep enrollment_sheet; the checks compare against it.",
          starter: "-- Tables, parents first\n\n-- Data, parents first (INSERT … SELECT DISTINCT … FROM enrollment_sheet)\n",
          solution: "CREATE TABLE cities (\n  name  text PRIMARY KEY,\n  state text NOT NULL\n);\n\nCREATE TABLE students (\n  email     text PRIMARY KEY,\n  full_name text NOT NULL,\n  city      text NOT NULL REFERENCES cities (name)\n);\n\nCREATE TABLE instructors (\n  name  text PRIMARY KEY,\n  email text NOT NULL UNIQUE\n);\n\nCREATE TABLE courses (\n  code       text PRIMARY KEY,\n  title      text NOT NULL,\n  fee        numeric(10,2) NOT NULL CHECK (fee > 0),\n  instructor text NOT NULL REFERENCES instructors (name)\n);\n\nCREATE TABLE enrollments (\n  student_email text NOT NULL REFERENCES students (email),\n  course_code   text NOT NULL REFERENCES courses (code),\n  enrolled_on   date NOT NULL,\n  score         integer CHECK (score BETWEEN 0 AND 100),\n  PRIMARY KEY (student_email, course_code)\n);\n\nINSERT INTO cities (name, state)\nSELECT DISTINCT student_city, city_state FROM enrollment_sheet;\n\nINSERT INTO students (email, full_name, city)\nSELECT DISTINCT student_email, student_name, student_city FROM enrollment_sheet;\n\nINSERT INTO instructors (name, email)\nSELECT DISTINCT instructor, instructor_email FROM enrollment_sheet;\n\nINSERT INTO courses (code, title, fee, instructor)\nSELECT DISTINCT course_code, course_title, course_fee, instructor\nFROM enrollment_sheet\nWHERE course_code <> 'DB-101';\n\nINSERT INTO courses (code, title, fee, instructor)\nVALUES ('DB-101', 'Relational Databases', 55000, 'Mrs. Bello');\n\nINSERT INTO enrollments (student_email, course_code, enrolled_on, score)\nSELECT student_email, course_code, enrolled_on, score FROM enrollment_sheet;\n",
          checks: [
            { label: "Every enrollment in the sheet was moved across", query: "SELECT student_email, course_code, enrolled_on, score FROM enrollments ORDER BY 1, 2", ordered: true },
            { label: "Each course is stored once, DB-101 at 55000", query: "SELECT code, title, fee, instructor FROM courses ORDER BY code", ordered: true },
            { label: "Each city's state is stored once", query: "SELECT name, state FROM cities ORDER BY name", ordered: true },
            { label: "The links are foreign keys", assert: `SELECT (${HAS.fk("students", "cities")}) AND (${HAS.fk("courses", "instructors")}) AND (${HAS.fk("enrollments", "students")}) AND (${HAS.fk("enrollments", "courses")})` },
            { label: "The sheet's flat columns are not copied into students or enrollments", assert: `SELECT NOT (${HAS.column("students", "city_state")}) AND NOT (${HAS.column("enrollments", "course_title")}) AND NOT (${HAS.column("enrollments", "course_fee")})` },
          ],
          hint: "Parents first both times: cities, students, instructors, courses, enrollments. Remember DB-101 must be inserted separately with 55000.",
          revealSolution: false,
          successMessage: "Five tables, each fact stored once, joined by keys. Next, prove it refuses bad data.",
        },
      },
      {
        id: "a-db-p4-prove",
        title: "Prove invalid data is rejected",
        explain:
          "A design is only as good as what it refuses. Paste your whole script from the previous step, then the checks will try to break it: an enrollment for a student who does not exist, a score of 120, a course with a negative fee, a second DB-101, a city with two states, a duplicate enrollment, and deleting a course that has enrollments. Each must fail with a constraint error. If one is accepted, add the missing constraint.",
        sqlLab: {
          setup: SHEET,
          erd: true,
          task:
            "Paste your normalized schema and data load from the previous step. The checks then attack it: every invalid change must be refused by PostgreSQL.",
          starter: "-- Paste your script from the previous step here.\n",
          solution: "CREATE TABLE cities (\n  name  text PRIMARY KEY,\n  state text NOT NULL\n);\n\nCREATE TABLE students (\n  email     text PRIMARY KEY,\n  full_name text NOT NULL,\n  city      text NOT NULL REFERENCES cities (name)\n);\n\nCREATE TABLE instructors (\n  name  text PRIMARY KEY,\n  email text NOT NULL UNIQUE\n);\n\nCREATE TABLE courses (\n  code       text PRIMARY KEY,\n  title      text NOT NULL,\n  fee        numeric(10,2) NOT NULL CHECK (fee > 0),\n  instructor text NOT NULL REFERENCES instructors (name)\n);\n\nCREATE TABLE enrollments (\n  student_email text NOT NULL REFERENCES students (email),\n  course_code   text NOT NULL REFERENCES courses (code),\n  enrolled_on   date NOT NULL,\n  score         integer CHECK (score BETWEEN 0 AND 100),\n  PRIMARY KEY (student_email, course_code)\n);\n\nINSERT INTO cities (name, state)\nSELECT DISTINCT student_city, city_state FROM enrollment_sheet;\n\nINSERT INTO students (email, full_name, city)\nSELECT DISTINCT student_email, student_name, student_city FROM enrollment_sheet;\n\nINSERT INTO instructors (name, email)\nSELECT DISTINCT instructor, instructor_email FROM enrollment_sheet;\n\nINSERT INTO courses (code, title, fee, instructor)\nSELECT DISTINCT course_code, course_title, course_fee, instructor\nFROM enrollment_sheet\nWHERE course_code <> 'DB-101';\n\nINSERT INTO courses (code, title, fee, instructor)\nVALUES ('DB-101', 'Relational Databases', 55000, 'Mrs. Bello');\n\nINSERT INTO enrollments (student_email, course_code, enrolled_on, score)\nSELECT student_email, course_code, enrolled_on, score FROM enrollment_sheet;\n",
          checks: [
            { label: "The schema and data are in place", assert: "SELECT (SELECT count(*) FROM enrollments) = 6 AND (SELECT count(*) FROM courses) = 3" },
            { label: "Enrollment for an unknown student: refused", rejects: "INSERT INTO enrollments VALUES ('ghost@example.com', 'DA-101', '2026-03-01', NULL)", code: "23503" },
            { label: "A score of 120: refused", rejects: "UPDATE enrollments SET score = 120 WHERE student_email = 'ada@example.com' AND course_code = 'DA-101'", code: "23514" },
            { label: "A course with a negative fee: refused", rejects: "INSERT INTO courses VALUES ('PY-101', 'Python', -5, 'Mr. Okafor')", code: "23514" },
            { label: "A second DB-101: refused", rejects: "INSERT INTO courses VALUES ('DB-101', 'Databases again', 50000, 'Mrs. Bello')", code: "23505" },
            { label: "Ikeja in a second state: refused", rejects: "INSERT INTO cities VALUES ('Ikeja', 'Ogun')", code: "23505" },
            { label: "The same enrollment twice: refused", rejects: "INSERT INTO enrollments VALUES ('ada@example.com', 'DA-101', '2026-06-01', NULL)", code: "23505" },
            { label: "Deleting a course that has enrollments: refused", rejects: "DELETE FROM courses WHERE code = 'DA-101'", code: "23503" },
            { label: "A shared instructor email: refused", rejects: "INSERT INTO instructors VALUES ('Mr. Copy', 'okafor@academy.ng')", code: "23505" },
          ],
          hint: "If a check says PostgreSQL accepted bad data, find which rule it breaks and add that constraint: CHECK, UNIQUE, NOT NULL or REFERENCES.",
          revealSolution: false,
          successMessage: "Eight attacks, eight refusals. That is the checkpoint: a design that protects its own data.",
        },
      },
    ],
    task: {
      title: "Week 4 practical: normalize and protect the enrollment data",
      intro: "Write this up as a short design note you could hand to a colleague.",
      prompts: [
        "List the update, insertion and deletion anomalies in enrollment_sheet, each with a concrete example from its rows.",
        "Write every functional dependency you found, and show which normal form each one breaks.",
        "Show your final tables (or the ERD PostgreSQL drew), and for each table write one sentence on why it exists.",
        "Run your script on your own PostgreSQL server and paste the error messages PostgreSQL gave for at least four invalid changes.",
        "Checkpoint: explain why each table exists and demonstrate that invalid data is rejected by the database.",
      ],
      closing: "Next: Week 5, Data Definition Language in depth: building, changing and migrating a whole schema.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
