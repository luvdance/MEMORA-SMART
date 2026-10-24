/**
 * RELATIONAL DATABASES · WEEK 16 · CAPSTONE PROJECT AND PROFESSIONAL PRACTICE
 *
 * Curriculum 16.1 – 16.P. The whole database lifecycle on a new problem, a
 * clinic's appointment system: requirements and business rules, entities and
 * relationships, the ERD, normalization, tables and constraints, realistic
 * sample data, CRUD and analytical queries, transactions and permissions,
 * tests of invalid input, performance, backups, documentation and
 * presentation. Each lab builds one stage on the previous ones; the final
 * deliverable is the learner's own project, built on their own server.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { HAS, decide, shownAll, term } from "./db-helpers.js";

export const SECTION_ID = "db-s16-capstone";
const MODULE = "db-m16-capstone";

/** The clinic schema, as a learner finishing Lesson 93 would have it. */
const CLINIC_SCHEMA = `CREATE TABLE departments (
  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);
CREATE TABLE doctors (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name     text NOT NULL,
  department_id integer NOT NULL REFERENCES departments (id),
  fee           numeric(10,2) NOT NULL CHECK (fee >= 0),
  is_active     boolean NOT NULL DEFAULT true
);
CREATE TABLE patients (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name  text NOT NULL,
  phone      text NOT NULL UNIQUE,
  birth_date date NOT NULL CHECK (birth_date > '1900-01-01'),
  email      text UNIQUE
);
CREATE TABLE appointments (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id integer NOT NULL REFERENCES patients (id),
  doctor_id  integer NOT NULL REFERENCES doctors (id),
  starts_at  timestamptz NOT NULL,
  status     text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'attended', 'cancelled', 'no_show')),
  CONSTRAINT appointments_doctor_slot UNIQUE (doctor_id, starts_at)
);
CREATE TABLE payments (
  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  appointment_id integer NOT NULL UNIQUE REFERENCES appointments (id),
  amount         numeric(10,2) NOT NULL CHECK (amount > 0),
  method         text NOT NULL CHECK (method IN ('cash', 'card', 'transfer', 'insurance')),
  paid_at        timestamptz NOT NULL
);`;

const CLINIC_DATA = `INSERT INTO departments (name) VALUES ('General Practice'), ('Paediatrics'), ('Dental');
INSERT INTO doctors (full_name, department_id, fee) VALUES
  ('Dr. Amina Bello', 1, 15000), ('Dr. Tunde Okafor', 1, 15000),
  ('Dr. Grace Eze', 2, 20000), ('Dr. Musa Ibrahim', 3, 25000);
INSERT INTO patients (full_name, phone, birth_date, email) VALUES
  ('Ada Obi', '0803 111 2001', '1990-04-12', 'ada@example.com'),
  ('Bayo Adeyemi', '0805 222 3002', '1985-09-30', NULL),
  ('Chidi Nwosu', '0807 333 4003', '2019-02-01', NULL),
  ('Fatima Musa', '0809 444 5004', '1978-12-15', 'fatima@example.com'),
  ('Kemi Adewale', '0812 555 6005', '2001-07-21', 'kemi@example.com');
INSERT INTO appointments (patient_id, doctor_id, starts_at, status) VALUES
  (1, 1, '2026-06-01 09:00+01', 'attended'),
  (2, 1, '2026-06-01 09:30+01', 'attended'),
  (3, 3, '2026-06-01 10:00+01', 'attended'),
  (4, 4, '2026-06-02 11:00+01', 'no_show'),
  (5, 2, '2026-06-02 14:00+01', 'attended'),
  (1, 4, '2026-06-08 09:00+01', 'attended'),
  (2, 2, '2026-06-08 10:00+01', 'cancelled'),
  (3, 3, '2026-06-15 10:00+01', 'booked'),
  (4, 1, '2026-06-15 11:00+01', 'booked'),
  (5, 4, '2026-06-16 15:00+01', 'booked');
INSERT INTO payments (appointment_id, amount, method, paid_at) VALUES
  (1, 15000, 'card', '2026-06-01 09:40+01'),
  (2, 15000, 'cash', '2026-06-01 10:05+01'),
  (3, 20000, 'insurance', '2026-06-01 10:45+01'),
  (5, 15000, 'transfer', '2026-06-02 14:50+01'),
  (6, 25000, 'card', '2026-06-08 09:45+01');`;

const CLINIC = `${CLINIC_SCHEMA}\n\n${CLINIC_DATA}`;

const TABLES = ["departments", "doctors", "patients", "appointments", "payments"];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 92 · 16.1 – 16.3 · REQUIREMENTS, ENTITIES AND THE ERD
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l92-requirements",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3"],
    title: "Requirements, Entities and the ERD",
    subtitle: "From a client's description to a model you can defend",
    estimatedMinutes: 50,
    intro:
      "The capstone works through a full database project for a new client: a private clinic. This week's labs build it with you, step by step; the final deliverable is your own project, on your own server, for a business you choose.",
    atoms: [
      {
        id: "a-db-cap-requirements",
        title: "Gathering requirements and defining business rules",
        explain:
          "Start by INTERVIEWING the people who will use the system, and write what you learn as numbered BUSINESS RULES, each a short testable sentence. The clinic's: (R1) Patients register with name, phone and date of birth; email is optional; a phone belongs to one patient. (R2) Doctors belong to one department and have a consultation fee. (R3) A patient books an appointment with a doctor at a date and time. (R4) A doctor cannot have two appointments at the same time. (R5) An appointment is booked, attended, cancelled or no_show. (R6) An attended appointment is paid once, by cash, card, transfer or insurance. (R7) Reception books and records payments; doctors see their own day; management sees reports. Ask about volumes, history and edge cases: 'can a patient's phone change?', 'what happens to past appointments of a doctor who leaves?'.",
        decision: decide({
          scenario: "The clinic manager says: 'Doctors leave sometimes. Just delete them.' Past appointments and payments refer to those doctors.",
          question: "What rule should you write instead, and why?",
          right: ["Doctors are deactivated (is_active = false), never deleted, because their past appointments and payments must keep referring to them", "History has legal and financial meaning; the rule protects it."],
          wrong: [
            ["Delete them with ON DELETE CASCADE", "That deletes medical and financial history."],
            ["Delete them and set appointments' doctor to NULL", "The record of who saw the patient is lost."],
            ["Do whatever the manager says without discussion", "Your job is to surface consequences, then agree a rule."],
          ],
          at: 0,
          aftermath: "Writing the rule down is how you avoid building the wrong thing.",
        }),
      },
      {
        id: "a-db-cap-entities",
        title: "Identifying entities and relationships",
        explain:
          "From the rules: entities PATIENT, DOCTOR, DEPARTMENT, APPOINTMENT (an event linking a patient and a doctor at a time) and PAYMENT (an event belonging to an appointment). Relationships, each read both ways: a department has many doctors, a doctor belongs to one department (1:N); a patient has many appointments, an appointment is for one patient (1:N); a doctor has many appointments, an appointment is with one doctor (1:N); patients and doctors are therefore many-to-many THROUGH appointments; an appointment has at most one payment, a payment is for exactly one appointment (1:0..1).",
        decision: decide({
          scenario: "A teammate models 'patients see doctors' as a junction table patient_doctors(patient_id, doctor_id) and puts the appointment time on patients.",
          question: "What is wrong?",
          right: ["A patient has many appointments over time, so the time belongs to an Appointment entity, which is itself the patient–doctor link", "The event carries the time, status and payment."],
          wrong: [
            ["Nothing; the junction table is enough", "It cannot record more than one visit's details."],
            ["The time belongs on doctors", "A doctor has many appointments."],
            ["Patients and doctors should be one table", "They are different entities with different facts."],
          ],
          at: 1,
          aftermath: "When a many-to-many relationship has facts of its own, the junction table becomes a real entity.",
        }),
      },
      {
        id: "a-db-cap-erd",
        title: "Creating the ERD",
        explain:
          "Draw the ERD from the entities and relationships, then check every line against a rule. Build the first two pieces here as SQL and let PostgreSQL draw them: departments and doctors (R2). The diagram below the lab is generated from your tables, so it shows only the relationships you really declared.",
        sqlLab: {
          erd: true,
          task:
            "Create departments (id identity PK, name required and unique) and doctors (id identity PK, full_name required, department_id required FK to departments, fee numeric(10,2) required and not negative, is_active boolean required default true).",
          starter: "",
          solution: "CREATE TABLE departments (\n  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nCREATE TABLE doctors (\n  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name     text NOT NULL,\n  department_id integer NOT NULL REFERENCES departments (id),\n  fee           numeric(10,2) NOT NULL CHECK (fee >= 0),\n  is_active     boolean NOT NULL DEFAULT true\n);\n",
          checks: [
            { label: "doctors.department_id is a required foreign key", assert: `SELECT (${HAS.fk("doctors", "departments", "department_id")}) AND (${HAS.notNull("doctors", "department_id")})` },
            { label: "Department names are unique", assert: HAS.unique("departments", ["name"]) },
            { label: "A negative fee is refused", rejects: "INSERT INTO departments (name) VALUES ('GP');\nINSERT INTO doctors (full_name, department_id, fee) VALUES ('Dr. X', 1, -1)", code: "23514" },
            { label: "New doctors are active by default", assert: "INSERT INTO departments (name) VALUES ('Dental');\nWITH d AS (INSERT INTO doctors (full_name, department_id, fee) VALUES ('Dr. Y', (SELECT id FROM departments WHERE name = 'Dental'), 25000) RETURNING is_active) SELECT is_active FROM d" },
          ],
          hint: "Parents first: departments, then doctors with department_id … REFERENCES departments (id) and CHECK (fee >= 0).",
          successMessage: "Two entities and one 1:N relationship, drawn back from the database. The other three follow in Lesson 93.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 93 · 16.4 – 16.6 · NORMALIZATION, SCHEMA AND SAMPLE DATA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l93-schema",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.4", "16.5", "16.6"],
    title: "Normalization, Schema and Sample Data",
    subtitle: "A schema that enforces the rules, filled with realistic data",
    estimatedMinutes: 60,
    intro:
      "Normalize the model, implement every rule as a constraint the database enforces, and load data realistic enough to test it.",
    atoms: [
      {
        id: "a-db-cap-normalize",
        title: "Normalizing the schema",
        explain:
          "Check each table against the normal forms. Every column must be a single fact (1NF), about the whole key (2NF) and nothing but the key (3NF). Common traps in a clinic: storing the doctor's fee on each appointment (a copy of a doctor fact, unless the business needs the fee CHARGED at the time, a different fact that belongs on the payment); storing the department name on doctors (it belongs in departments); storing a patient's age (it changes; store the birth date and compute age).",
        decision: decide({
          scenario: "Someone proposes appointments(…, doctor_name, department_name, doctor_fee).",
          question: "Which is the correct normalized treatment?",
          right: ["Store only doctor_id on appointments; names come from doctors and departments by join, and the amount actually charged lives on the payment", "Each fact stored once, on the entity it describes."],
          wrong: [
            ["Keep all three for faster reports", "They would drift from the source tables (update anomalies)."],
            ["Keep doctor_name but drop doctor_id", "Names are not stable keys."],
            ["Move all three to patients", "They are not facts about patients."],
          ],
          at: 2,
          aftermath: "Ask 'what is this a fact about?' for every column you are unsure of.",
        }),
      },
      {
        id: "a-db-cap-implement",
        title: "Implementing tables, keys and constraints",
        explain:
          "Turn every rule into structure. R1: patients.phone NOT NULL UNIQUE, email optional but UNIQUE. R3: appointments has patient_id and doctor_id foreign keys and starts_at timestamptz. R4: UNIQUE (doctor_id, starts_at) so a doctor cannot be double-booked at the same start time. R5: a CHECK on status with a default of 'booked'. R6: payments.appointment_id UNIQUE (one payment per appointment), amount > 0, method from a fixed list. Departments and doctors exist already (Lesson 92's lab, rebuilt here as setup).",
        sqlLab: {
          setup: CLINIC_SCHEMA.slice(0, CLINIC_SCHEMA.indexOf("CREATE TABLE patients")),
          erd: true,
          task:
            "Create patients, appointments and payments enforcing R1, R3–R6 exactly as described: patients(id, full_name, phone, birth_date, email); appointments(id, patient_id, doctor_id, starts_at, status) with the double-booking rule as a constraint named appointments_doctor_slot; payments(id, appointment_id, amount, method, paid_at).",
          starter: "-- patients\n\n-- appointments\n\n-- payments\n",
          solution: CLINIC_SCHEMA.slice(CLINIC_SCHEMA.indexOf("CREATE TABLE patients")),
          checks: [
            { label: "All five tables exist", assert: `SELECT ${TABLES.map((t) => `(${HAS.table(t)})`).join(" AND ")}` },
            { label: "Valid data loads", accepts: CLINIC_DATA },
            { label: "R1: two patients cannot share a phone", rejects: "INSERT INTO patients (full_name, phone, birth_date) VALUES ('Copy Ada', '0803 111 2001', '1990-01-01')", code: "23505" },
            { label: "R4: a doctor cannot be booked twice at the same time", rejects: "INSERT INTO appointments (patient_id, doctor_id, starts_at) VALUES (2, 1, '2026-06-01 09:00+01')", error: "appointments_doctor_slot" },
            { label: "R5: an unknown status is refused", rejects: "INSERT INTO appointments (patient_id, doctor_id, starts_at, status) VALUES (1, 2, '2026-07-01 09:00+01', 'late')", code: "23514" },
            { label: "R6: an appointment is paid only once", rejects: "INSERT INTO payments (appointment_id, amount, method, paid_at) VALUES (1, 100, 'cash', now())", code: "23505" },
            { label: "R6: only the four payment methods are allowed", rejects: "INSERT INTO payments (appointment_id, amount, method, paid_at) VALUES (9, 100, 'crypto', now())", code: "23514" },
          ],
          hint: "Read each rule and ask which constraint enforces it: UNIQUE, CHECK, NOT NULL, REFERENCES or DEFAULT. Name the double-booking constraint with CONSTRAINT appointments_doctor_slot UNIQUE (doctor_id, starts_at).",
          revealSolution: false,
          successMessage: "Every business rule is now a constraint the database enforces, and the ERD shows the whole model.",
        },
      },
      {
        id: "a-db-cap-sample-data",
        title: "Loading realistic sample data",
        explain:
          "Test data should look like the real thing: realistic names and phone formats, a spread of dates, every status, edge cases (a patient with no email, a child patient, a cancelled appointment, an unpaid one), and enough volume to test performance (generate_series for thousands of rows). Load it with a script, parents first, so the database can be rebuilt any time. Never use real people's data from production.",
        sqlLab: {
          setup: CLINIC,
          task:
            "The clinic's schema and a small hand-made dataset are loaded. Add VOLUME for performance tests: insert 2,000 generated appointments for patient 1 with doctor 2 (Dr. Tunde Okafor), one every 30 minutes starting 2027-01-04 08:00+01 (use generate_series over 0..1999 and an interval), status 'booked'. Then return the number of appointments per status, ordered by status.",
          starter: "INSERT INTO appointments (patient_id, doctor_id, starts_at, status)\nSELECT 1, 2, ..., 'booked'\nFROM generate_series(0, 1999) AS g;\n",
          solution: "INSERT INTO appointments (patient_id, doctor_id, starts_at, status)\nSELECT 1, 2, TIMESTAMPTZ '2027-01-04 08:00+01' + g * interval '30 minutes', 'booked'\nFROM generate_series(0, 1999) AS g;\n\nSELECT status, count(*)\nFROM appointments\nGROUP BY status\nORDER BY status;\n",
          checks: [
            { label: "Counts per status after the load", result: { ordered: true } },
            { label: "No slot clashed: every new appointment is a different time", assert: "SELECT count(DISTINCT starts_at) = 2000 FROM appointments WHERE starts_at >= '2027-01-01'" },
          ],
          hint: "TIMESTAMPTZ '2027-01-04 08:00+01' + g * interval '30 minutes' gives one slot per row.",
          successMessage: "2,000 realistic rows, and the double-booking constraint accepted them all because each slot is different.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 94 · 16.7 – 16.8 · QUERIES, TRANSACTIONS AND PERMISSIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l94-queries",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.7", "16.8"],
    title: "Queries, Reports, Transactions and Permissions",
    subtitle: "Making the database useful, safe and properly accessed",
    estimatedMinutes: 60,
    intro:
      "With the schema built and filled, write what the clinic actually runs every day: its everyday operations, its reports, and the roles that keep each user to their job.",
    atoms: [
      {
        id: "a-db-cap-reports",
        title: "Writing CRUD queries and analytical reports",
        explain:
          "A project's queries fall into two groups. CRUD for daily operations (book, reschedule, cancel, record payment, look up a patient), each parameterized and touching as few rows as necessary. REPORTS for management, built with joins, grouping and window functions: revenue by department and month, no-show rates per doctor, busiest hours. Write each report as a CTE pipeline, check its numbers by a second method, and consider saving the important ones as views.",
        sqlLab: {
          setup: CLINIC,
          task:
            "Management report: for each department, return department (name), appointments (all appointments with its doctors), attended, no_show_pct (no_show appointments as a % of all, 1 dp) and revenue (sum of payments, 0 when none). Ordered by revenue descending, then department. Every department must appear.",
          starter: "",
          solution: "WITH appts AS (\n  SELECT dep.name AS department, a.id, a.status, p.amount\n  FROM departments AS dep\n  LEFT JOIN doctors AS d ON d.department_id = dep.id\n  LEFT JOIN appointments AS a ON a.doctor_id = d.id\n  LEFT JOIN payments AS p ON p.appointment_id = a.id\n)\nSELECT department,\n       count(id)                                                     AS appointments,\n       count(*) FILTER (WHERE status = 'attended')                   AS attended,\n       round(count(*) FILTER (WHERE status = 'no_show') * 100.0 / nullif(count(id), 0), 1) AS no_show_pct,\n       coalesce(sum(amount), 0)                                      AS revenue\nFROM appts\nGROUP BY department\nORDER BY revenue DESC, department;\n",
          checks: [{ label: "The department report", result: { ordered: true } }],
          expectRows: 3,
          hint: "Start from departments with LEFT JOINs (doctors, appointments, payments). One payment per appointment, so the joins cannot fan out. Guard the percentage with nullif(count(id), 0).",
          revealSolution: false,
          successMessage: "A report the clinic's management can act on, from one readable query.",
        },
      },
      {
        id: "a-db-cap-tx-permissions",
        title: "Implementing transactions and permissions",
        explain:
          "Two final protections. TRANSACTIONS for operations that touch several rows: recording an attended visit must set the appointment's status AND insert its payment together. PERMISSIONS for each kind of user: reception (book and record payments, read patients), doctors (read appointments, update status only), reporting (read only, no patient contact details). Build the reception role and the visit procedure here.",
        sqlLab: {
          setup: CLINIC,
          continueOnError: true,
          task:
            "Create a procedure record_visit(appt integer, amt numeric, how text) that, in one go, sets that appointment's status to 'attended' and inserts its payment (paid_at = now()). Create a login role reception that may SELECT patients, doctors and appointments, INSERT and UPDATE appointments, INSERT payments, and EXECUTE record_visit (but not delete anything). Finally CALL record_visit(9, 15000, 'card').",
          starter: "CREATE PROCEDURE record_visit(appt integer, amt numeric, how text)\nLANGUAGE plpgsql AS $$\nBEGIN\n  \nEND\n$$;\n",
          solution: "CREATE PROCEDURE record_visit(appt integer, amt numeric, how text)\nLANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE appointments SET status = 'attended' WHERE id = appt;\n  INSERT INTO payments (appointment_id, amount, method, paid_at) VALUES (appt, amt, how, now());\nEND\n$$;\n\nCREATE ROLE reception LOGIN PASSWORD 'change-me';\nGRANT SELECT ON patients, doctors, appointments TO reception;\nGRANT INSERT, UPDATE ON appointments TO reception;\nGRANT INSERT ON payments TO reception;\nGRANT EXECUTE ON PROCEDURE record_visit(integer, numeric, text) TO reception;\n\nCALL record_visit(9, 15000, 'card');\n",
          checks: [
            { label: "Appointment 9 is attended and paid", query: "SELECT a.status, p.amount, p.method FROM appointments a JOIN payments p ON p.appointment_id = a.id WHERE a.id = 9" },
            { label: "A visit with an invalid method is refused", rejects: "CALL record_visit(10, 25000, 'crypto')", code: "23514" },
            { label: "…and changes nothing: appointment 10 is still booked (atomic)", assert: "SELECT status = 'booked' FROM appointments WHERE id = 10" },
            { label: "reception can record a visit", accepts: "SET ROLE reception;\nCALL record_visit(8, 20000, 'cash')" },
            { label: "reception cannot delete appointments", rejects: "SET ROLE reception;\nDELETE FROM appointments WHERE id = 7", code: "42501" },
            { label: "reception cannot change payments already recorded", rejects: "SET ROLE reception;\nUPDATE payments SET amount = 1", code: "42501" },
          ],
          hint: "The procedure's two statements succeed or fail together when called. Grant table privileges precisely, then GRANT EXECUTE ON PROCEDURE record_visit(integer, numeric, text).",
          revealSolution: false,
          successMessage: "One call records a visit atomically, and reception can do exactly its job.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 95 · 16.9 – 16.10 · TESTING AND PERFORMANCE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l95-testing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.9", "16.10"],
    title: "Testing Edge Cases and Analyzing Performance",
    subtitle: "Proving the rules hold, and the queries stay fast",
    estimatedMinutes: 55,
    intro:
      "A database project is finished when you can show it refuses what it should and answers quickly with realistic volumes, with evidence for both.",
    atoms: [
      {
        id: "a-db-cap-edge-cases",
        title: "Testing invalid inputs and edge cases",
        explain:
          "Write a TEST SCRIPT: for each business rule, a statement that should succeed and one that should fail, run in order, with the expected outcome written next to it. Edge cases worth testing: boundary values (a fee of exactly 0, a birth date of 1900-01-02), missing optional data (no email), duplicates differing only in case or spaces, references to missing rows, impossible states (paying a cancelled appointment). A rule with no failing test is a rule you have not proven. Some rules (the R4 time-overlap case: 09:00–09:30 and 09:15–09:45) need more than a UNIQUE; PostgreSQL's EXCLUDE constraints with ranges handle overlaps, which you can explore on your own server.",
        sqlLab: {
          setup: CLINIC,
          continueOnError: true,
          task:
            "Write a test script against the clinic database: one statement per line, in this order, each with a -- comment saying 'ok' or 'fails'. (1) a new patient with no email (ok); (2) a patient with Ada's phone (fails); (3) an appointment for Dr. Amina Bello (doctor 1) at 2026-06-01 09:00+01 (fails: she is booked); (4) a second payment for appointment 1 (fails); (5) a payment of 0 for appointment 9 (fails); (6) a doctor with a fee of exactly 0 (ok). End with SELECT count(*) FROM patients;",
          starter: "-- 1 ok\n\n-- 2 fails\n\n-- 3 fails\n\n-- 4 fails\n\n-- 5 fails\n\n-- 6 ok\n\nSELECT count(*) FROM patients;\n",
          solution: "-- 1 ok\nINSERT INTO patients (full_name, phone, birth_date) VALUES ('Ngozi Peters', '0813 666 7006', '1995-05-05');\n-- 2 fails\nINSERT INTO patients (full_name, phone, birth_date) VALUES ('Copy Ada', '0803 111 2001', '1990-01-01');\n-- 3 fails\nINSERT INTO appointments (patient_id, doctor_id, starts_at) VALUES (2, 1, '2026-06-01 09:00+01');\n-- 4 fails\nINSERT INTO payments (appointment_id, amount, method, paid_at) VALUES (1, 15000, 'cash', now());\n-- 5 fails\nINSERT INTO payments (appointment_id, amount, method, paid_at) VALUES (9, 0, 'cash', now());\n-- 6 ok\nINSERT INTO doctors (full_name, department_id, fee) VALUES ('Dr. Volunteer', 1, 0);\n\nSELECT count(*) FROM patients;\n",
          checks: [
            { label: "Exactly the two valid statements took effect", query: "SELECT (SELECT count(*) FROM patients), (SELECT count(*) FROM doctors), (SELECT count(*) FROM appointments), (SELECT count(*) FROM payments)" },
            { label: "Ends with the patient count", result: true },
            { label: "The four invalid statements were all attempted", source: "0803 111 2001[\\s\\S]*2026-06-01 09:00\\+01[\\s\\S]*\\(1,\\s*15000[\\s\\S]*\\(9,\\s*0," },
            { label: "Every test says what it expects", raw: true, source: "--\\s*1 ok[\\s\\S]*--\\s*2 fails[\\s\\S]*--\\s*6 ok" },
          ],
          hint: "Each failing statement is just the invalid INSERT. In this lab, as in psql, an error does not stop the script.",
          revealSolution: false,
          successMessage: "Six tests, six expected outcomes, and the database behaved as the rules say. Keep the script: it is evidence for your documentation.",
        },
      },
      {
        id: "a-db-cap-performance",
        title: "Analyzing query performance",
        explain:
          "With realistic volumes loaded, check the queries that will run most: reception's 'today for doctor X', the patient lookup by phone, the monthly report. Read each plan with EXPLAIN (ANALYZE, BUFFERS), add an index only where a frequent query scans a large table, measure again, and record both. Remember that UNIQUE constraints already created indexes (patients.phone, appointments (doctor_id, starts_at)): check whether a query can use them before adding more.",
        sqlLab: {
          setup: `${CLINIC}\nINSERT INTO appointments (patient_id, doctor_id, starts_at, status)\nSELECT 1 + g % 5, 2, TIMESTAMPTZ '2027-01-04 08:00+01' + g * interval '30 minutes', 'booked' FROM generate_series(0, 19999) AS g;\nANALYZE appointments;\nCREATE FUNCTION lab_plan(query text) RETURNS text LANGUAGE plpgsql AS $$ DECLARE line text; plan text := ''; BEGIN FOR line IN EXECUTE 'EXPLAIN (COSTS OFF) ' || query LOOP plan := plan || line || ' / '; END LOOP; RETURN plan; END $$;`,
          task:
            "Reception's most frequent query lists one patient's upcoming appointments: SELECT id, doctor_id, starts_at FROM appointments WHERE patient_id = 3 AND starts_at >= '2027-03-01' ORDER BY starts_at LIMIT 10; With 20,000 appointments it scans the table. Add the index it needs, named appointments_patient_time_idx, then run the query.",
          starter: "SELECT id, doctor_id, starts_at\nFROM appointments\nWHERE patient_id = 3\n  AND starts_at >= '2027-03-01'\nORDER BY starts_at\nLIMIT 10;\n",
          solution: "CREATE INDEX appointments_patient_time_idx ON appointments (patient_id, starts_at);\n\nSELECT id, doctor_id, starts_at\nFROM appointments\nWHERE patient_id = 3\n  AND starts_at >= '2027-03-01'\nORDER BY starts_at\nLIMIT 10;\n",
          checks: [
            { label: "Same result", result: { ordered: true } },
            { label: "The query now uses the new index", assert: "SELECT lab_plan('SELECT id FROM appointments WHERE patient_id = 3 AND starts_at >= ''2027-03-01'' ORDER BY starts_at LIMIT 10') LIKE '%appointments_patient_time_idx%'" },
          ],
          claims: [{ sql: "SELECT lab_plan('SELECT id FROM appointments WHERE patient_id = 3 AND starts_at >= ''2027-03-01'' ORDER BY starts_at LIMIT 10') LIKE '%Seq Scan%'", equals: "t" }],
          hint: "Equality column first, then the range and ORDER BY column: (patient_id, starts_at).",
          revealSolution: false,
          successMessage: "The existing (doctor_id, starts_at) index could not help a patient query; the right composite index can.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 96 · 16.11 – 16.13 · BACKUPS, DOCUMENTATION, PRESENTATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l96-docs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["16.11", "16.12", "16.13"],
    title: "Backups, Documentation and Presentation",
    subtitle: "Making the project recoverable, understandable and convincing",
    estimatedMinutes: 45,
    intro:
      "The last stretch is what separates a project from a professional deliverable: it can be recovered, someone else can understand it, and you can explain why it is built the way it is.",
    atoms: [
      {
        id: "a-db-cap-backups",
        title: "Creating and restoring backups",
        explain:
          "For the capstone, back up your database with pg_dump -F c (and roles with pg_dumpall --roles-only), restore it into a NEW database, and verify it with the same checks you use on the original: row counts per table, a total or two, and your test script run against the restored copy. Record the commands, the time the restore took, and the verification results. The recorded run below is the pattern to follow.",
        example: shownAll("pg-backup", [
          "pg_dump -U postgres -d academy -F c -f academy.dump",
          "createdb -U postgres academy_restore_test",
          "pg_restore -U postgres -d academy_restore_test academy.dump",
        ]),
        terminalExercise: term("pg-backup", {
          only: [
            'psql -U postgres -d academy -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"',
            'psql -U postgres -d academy_restore_test -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"',
          ],
          goal: "Produce the evidence for your documentation: the restored database's counts, to compare with the original's.",
          accept: ['psql -U postgres -d academy_restore_test -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"'],
          hint: "Query the restored database, academy_restore_test.",
          success: "Identical figures in both databases: a backup proven by a restore, ready to paste into your documentation.",
        }),
      },
      {
        id: "a-db-cap-documentation",
        title: "Documenting schema decisions and assumptions",
        explain:
          "Good database documentation is short and specific: the business rules (numbered) and where each is enforced (constraint name, trigger, procedure or application); the ERD; a data dictionary (each table and column: meaning, type, allowed values, example); DECISIONS with their reasons and rejected alternatives ('doctors are deactivated, not deleted, because…'; 'the fee charged is stored on payments because…'); ASSUMPTIONS ('appointments are 30 minutes'); and how to build, load, test, back up and restore it. Keep it in the repository beside the SQL, in Markdown, so it changes with the schema.",
        decision: decide({
          scenario: "A reviewer reads your schema and sees payments.amount stored separately from doctors.fee, and asks 'isn't that redundant?'.",
          question: "Which documentation entry answers that best?",
          right: ["A decision record: 'The amount charged is a fact of the payment (discounts, insurance and fee changes make it differ from the current fee), so it is stored on payments.'", "A decision with its reason, written before anyone asks."],
          wrong: [
            ["'We followed best practice.'", "It explains nothing."],
            ["A screenshot of the payments table", "Shows the what, not the why."],
            ["No entry; reviewers should read the SQL", "SQL shows structure, not reasons."],
          ],
          at: 1,
          aftermath: "Every non-obvious design choice deserves one or two sentences of 'why'.",
        }),
      },
      {
        id: "a-db-cap-presentation",
        title: "Presenting technical decisions and trade-offs",
        explain:
          "In the demonstration, tell the story of the database, not of the SQL: the problem and the rules (1 minute); the ERD and the key decisions with their trade-offs (3 minutes); a LIVE demo: valid operations succeeding, invalid ones refused with the database's own errors, a report, and the restore verification (4 minutes); what you would do next and the risks you know about (1 minute). Prepare for the questions reviewers always ask: what happens when two people book the same slot at once? what is your RPO? who can see patients' phone numbers? how did you measure that it is fast?",
        decision: decide({
          scenario: "During your demo a reviewer asks: 'What happens if two receptionists book Dr. Bello at 09:00 at the same moment?'",
          question: "Which answer shows the best understanding?",
          right: ["'The UNIQUE (doctor_id, starts_at) constraint means one INSERT succeeds and the other fails with a unique violation, which the application turns into \"slot just taken\"; overlapping but different start times would need an exclusion constraint, which I documented as a known limitation.'", "It names the mechanism, the user-facing behaviour and the limit."],
          wrong: [
            ["'That will not happen in practice.'", "It will, and reviewers know it."],
            ["'The application checks first, so it is fine.'", "Check-then-insert races; only the constraint is reliable."],
            ["'PostgreSQL handles it somehow.'", "Vague answers lose reviewers' confidence."],
          ],
          at: 0,
          aftermath: "Precise answers about concurrency, recovery and access are what make a database project convincing.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 97 · 16.P · THE FINAL DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l97-capstone",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["16.P"],
    title: "Capstone: Your Relational Database Project",
    subtitle: "SQL scripts, an ERD, test evidence, documentation and a demonstration",
    estimatedMinutes: 120,
    intro:
      "The final deliverable is your own: a complete relational database project for a business you choose (a pharmacy, a hostel, a school, a delivery service, an event ticketing site…). The lab below is the last proof of the full build on the clinic; the task list is your project.",
    atoms: [
      {
        id: "a-db-cap-full-build",
        title: "The complete build, in one script",
        explain:
          "Rebuild the clinic from nothing in ONE re-runnable script: drop the five tables if they exist (children first), create them with every constraint (as in Lesson 93), load the sample data, create the department report as a view called department_report, and end with SELECT * FROM department_report ORDER BY department; This is the shape your own project's build script must have.",
        sqlLab: {
          erd: true,
          task:
            "One script: DROP TABLE IF EXISTS (children first); CREATE the five clinic tables with all constraints; INSERT the sample data from Lesson 93's setup (departments, 4 doctors, 5 patients, 10 appointments, 5 payments); CREATE OR REPLACE VIEW department_report (department, appointments, attended, revenue); then SELECT * FROM department_report ORDER BY department;",
          starter: "-- 1. drop\n\n-- 2. create\n\n-- 3. load\n\n-- 4. report view\n\n-- 5. show it\n",
          solution: `DROP VIEW IF EXISTS department_report;\nDROP TABLE IF EXISTS payments;\nDROP TABLE IF EXISTS appointments;\nDROP TABLE IF EXISTS patients;\nDROP TABLE IF EXISTS doctors;\nDROP TABLE IF EXISTS departments;\n\n${CLINIC}\n\nCREATE OR REPLACE VIEW department_report AS\nSELECT dep.name AS department,\n       count(a.id) AS appointments,\n       count(a.id) FILTER (WHERE a.status = 'attended') AS attended,\n       coalesce(sum(p.amount), 0) AS revenue\nFROM departments AS dep\nLEFT JOIN doctors AS d ON d.department_id = dep.id\nLEFT JOIN appointments AS a ON a.doctor_id = d.id\nLEFT JOIN payments AS p ON p.appointment_id = a.id\nGROUP BY dep.name;\n\nSELECT * FROM department_report ORDER BY department;\n`,
          checks: [
            { label: "The report is right", result: { ordered: true } },
            { label: "The data loaded completely", query: "SELECT (SELECT count(*) FROM doctors), (SELECT count(*) FROM patients), (SELECT count(*) FROM appointments), (SELECT count(*) FROM payments)" },
            { label: "Double booking is still refused", rejects: "INSERT INTO appointments (patient_id, doctor_id, starts_at) VALUES (2, 1, '2026-06-01 09:00+01')", code: "23505" },
            { label: "department_report is a view", assert: "SELECT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'department_report')" },
            { label: "The whole script runs again cleanly", rerun: true },
          ],
          hint: "Drop the view first (it depends on the tables), then the tables children-first. Reuse your Lesson 93 tables and data.",
          revealSolution: false,
          successMessage: "Empty server to working, reporting database in one script that rebuilds itself. Now do it for your own project.",
        },
      },
      {
        id: "a-db-cap-deliverable",
        title: "What your final deliverable contains",
        explain:
          "Your project folder: README.md (the problem, how to build, test, back up and restore), rules.md (numbered business rules, each with where it is enforced), erd.png or .pdf, schema.sql (drop and create, re-runnable), data.sql (realistic sample data, including generated volume), queries.sql (the CRUD operations and at least three analytical reports, one using window functions), security.sql (roles and grants), tests.sql (a passing and a failing case per rule, with expected outcomes), performance.md (before-and-after plans for your key queries), backup.md (commands, restore time, verification), decisions.md (decisions, trade-offs and known limitations), and a short recorded or live demonstration.",
        decision: decide({
          scenario: "A learner submits a perfect schema.sql and an ERD, but no tests, no backup evidence and no documentation, saying 'the SQL speaks for itself'.",
          question: "How will a reviewer judge it against the final deliverable?",
          right: ["Incomplete: the deliverable requires test evidence, documentation and a demonstration, which prove the design works and explain why it is built that way", "Professional work is verified and explained, not only written."],
          wrong: [
            ["Complete: the schema is what matters", "The brief asks for evidence and documentation too."],
            ["Complete if the ERD is colourful", "Presentation does not replace evidence."],
            ["Incomplete only because it lacks a logo", "Branding is not part of the deliverable."],
          ],
          at: 2,
          aftermath: "Use the checklist in the task below before you submit.",
        }),
      },
    ],
    task: {
      title: "Final deliverable: your relational database project",
      intro: "Choose a business you know well and build its database through the whole lifecycle, on your own PostgreSQL (and, for extra credit, port the schema to MySQL).",
      prompts: [
        "Requirements: interview someone who runs (or works in) the business, or write a realistic brief, and number its business rules.",
        "Design: identify entities and relationships, draw the ERD, normalize to 3NF, and record each decision and assumption.",
        "Build: schema.sql (re-runnable, with every rule enforced), data.sql (realistic, including thousands of generated rows), security.sql (at least three roles with least privilege) and at least one transaction-based procedure.",
        "Query: CRUD statements and at least three analytical reports, one with CTEs and window functions; save the key reports as views.",
        "Prove: tests.sql with a passing and failing case per rule; EXPLAIN (ANALYZE, BUFFERS) before and after for your two most frequent queries; a backup restored into a new database and verified.",
        "Document and present: README, rules, decisions and limitations, then a 10-minute demonstration including live refusals of invalid data and the restore verification.",
        "Checkpoint: a complete relational database project with SQL scripts, an ERD, test evidence, documentation and a demonstration.",
      ],
      closing: "Congratulations on completing the course. When your project is done, sit the certification exam: it covers every week, from data and design to SQL, engineering and operations.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
