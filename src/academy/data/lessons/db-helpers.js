/**
 * RELATIONAL DATABASES — LESSON HELPERS AND DATASETS
 *
 * CLIENT-SAFE. Three things every lesson file of the course uses:
 *
 *   term(session, spec)   a terminal built from a RECORDED session
 *                         (./db-transcripts.js, scripts/dbRecord.mjs), so a
 *                         lesson can choose commands but never type an output
 *   duet(name)            a two-session concurrency recording, laid out as
 *                         the two psql windows printed it
 *   the datasets          the SQL that builds each lab database (the academy,
 *                         the online store, the bank, …), shared so every
 *                         lesson works on the same, consistent data
 *
 * A session or command that was not recorded throws when the lesson file
 * loads, so a typo fails the build instead of shipping an empty terminal.
 */

import { DUETS, TRANSCRIPTS } from "./db-transcripts.js";

/* ── Terminals ────────────────────────────────────────────────────────── */

const PS = "PS C:\\Users\\ada>";

/** The prompt each recorded session was typed at. */
export const PROMPTS = {
  "pg-setup": PS,
  "pg-login": PS,
  "pg-backup": PS,
  "pg-monitor-shell": PS,
  "pg-stop": PS,
  "mysql-setup": PS,
  "mysql-backup": PS,
  "node-app": "PS C:\\Users\\ada\\students-api>",
  "psql-server": "postgres=#",
  "psql-academy": "academy=#",
  "pg-dialect": "academy=#",
  "pg-locks": "academy=#",
  "pg-roles": "academy=#",
  "pg-monitor": "academy=#",
  "mysql-server": "mysql>",
  "mysql-basics": "mysql>",
  "mysql-academy": "mysql>",
  "mysql-dialect": "mysql>",
};

const RECORDED = "Recorded on real PostgreSQL 18.6 and MySQL 8.4 servers on Windows (folders shown as the installers create them).";

/**
 * A terminal from a recorded session. Pass `only` to offer a subset of the
 * session's commands (in recorded order); every offered command must exist.
 */
export function term(session, spec = {}) {
  const all = TRANSCRIPTS[session];
  if (!all) throw new Error(`RDBMS: no recorded session "${session}"`);
  const names = spec.only || Object.keys(all);
  const commands = {};
  for (const c of names) {
    if (all[c] === undefined) throw new Error(`RDBMS: "${c}" was not recorded in ${session}`);
    commands[c] = all[c];
  }
  for (const c of spec.accept || []) {
    if (!(c in commands)) throw new Error(`RDBMS: accepted command "${c}" is not offered in ${session}`);
  }
  const { only: _only, ...rest } = spec;
  return {
    session,
    prompt: PROMPTS[session] || PS,
    commands,
    available: Object.keys(commands),
    ...rest,
    intro: spec.intro ? `${spec.intro} ${RECORDED}` : RECORDED,
  };
}

/** One recorded output, for quoting in an explanation or example. */
export function out(session, command) {
  const output = TRANSCRIPTS[session]?.[command];
  if (output === undefined) throw new Error(`RDBMS: "${command}" was not recorded in ${session}`);
  return output;
}

/** A recorded command and its output, laid out as it appeared at the prompt. */
export function shown(session, command) {
  const output = out(session, command);
  const prompt = PROMPTS[session] || PS;
  return output ? `${prompt} ${command}\n${output}` : `${prompt} ${command}`;
}

/** Several recorded commands from one session, one after another. */
export function shownAll(session, commands) {
  return commands.map((c) => shown(session, c)).join("\n\n");
}

/**
 * A two-session recording as text: each step prefixed with the session that
 * typed it. A step that had to wait for the other session's lock says so,
 * and its output appears where it really arrived.
 */
export function duet(name) {
  const steps = DUETS[name];
  if (!steps) throw new Error(`RDBMS: no recorded duet "${name}"`);
  const lines = [];
  for (const s of steps) {
    if (s.late) {
      lines.push(`[${s.who}]  …the waiting statement now finishes:`);
      if (s.output) lines.push(...s.output.split("\n").map((l) => `      ${l}`));
      continue;
    }
    lines.push(`[${s.who}] academy=# ${s.sql}`);
    if (s.waiting) lines.push(`      (waiting: blocked by session ${s.who === "A" ? "B" : "A"})`);
    else if (s.output) lines.push(...s.output.split("\n").map((l) => `      ${l}`));
  }
  return lines.join("\n");
}

/* ── Judgement calls ──────────────────────────────────────────────────── */

/**
 * A `decision` practice. `right` is [text, why]; each of `wrong` is
 * [text, whyWrong]; `at` (0–3) is where the right answer appears, so the
 * answers are not always in the same place.
 */
export function decide({ scenario, question, right, wrong, at = 0, aftermath }) {
  const options = wrong.map(([text, whyWrong]) => ({ text, whyWrong }));
  options.splice(Math.min(at, options.length), 0, { text: right[0], why: right[1], right: true });
  const ids = "abcdef";
  const built = options.map((o, i) => {
    const { right: isRight, ...rest } = o;
    void isRight;
    return { id: ids[i], ...rest };
  });
  return {
    scenario,
    question,
    options: built,
    correct: ids[options.findIndex((o) => o.right)],
    aftermath,
  };
}

/* ── Structural checks (SQL that returns true when the schema is right) ── */

const sqlList = (cols) => cols.map((c) => `'${c}'`).join(", ");

/**
 * Lab checks about a schema, read from PostgreSQL's catalog. Each returns a
 * SQL query whose single value is true when the structure is as required,
 * and false (never an error) when a table is missing.
 */
export const HAS = {
  table: (t) => `SELECT to_regclass('${t}') IS NOT NULL`,
  column: (t, col) =>
    `SELECT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = to_regclass('${t}') AND attname = '${col}' AND attnum > 0 AND NOT attisdropped)`,
  /** A foreign key from `from` to `to` (optionally on column `col`). */
  fk: (from, to, col) =>
    `SELECT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey) WHERE c.contype = 'f' AND c.conrelid = to_regclass('${from}') AND c.confrelid = to_regclass('${to}')${col ? ` AND a.attname = '${col}'` : ""})`,
  /** The primary key is exactly these columns. */
  pk: (t, cols) =>
    `SELECT coalesce((SELECT array_agg(a.attname::text ORDER BY a.attname::text) FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY (i.indkey) WHERE i.indrelid = to_regclass('${t}') AND i.indisprimary) = (SELECT array_agg(x ORDER BY x) FROM unnest(ARRAY[${sqlList(cols)}]::text[]) AS x), false)`,
  /** Some unique index or constraint (or the primary key) covers exactly these columns. */
  unique: (t, cols) =>
    `SELECT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = to_regclass('${t}') AND i.indisunique AND (SELECT array_agg(a.attname::text ORDER BY a.attname::text) FROM pg_attribute a WHERE a.attrelid = i.indrelid AND a.attnum = ANY (i.indkey)) = (SELECT array_agg(x ORDER BY x) FROM unnest(ARRAY[${sqlList(cols)}]::text[]) AS x))`,
  notNull: (t, col) =>
    `SELECT coalesce((SELECT attnotnull FROM pg_attribute WHERE attrelid = to_regclass('${t}') AND attname = '${col}'), false)`,
  nullable: (t, col) =>
    `SELECT coalesce((SELECT NOT attnotnull FROM pg_attribute WHERE attrelid = to_regclass('${t}') AND attname = '${col}'), false)`,
  /** The ON DELETE action of the foreign key from `from` to `to`: a = no action, r = restrict, c = cascade, n = set null, d = set default. */
  onDelete: (from, to, action) =>
    `SELECT EXISTS (SELECT 1 FROM pg_constraint WHERE contype = 'f' AND conrelid = to_regclass('${from}') AND confrelid = to_regclass('${to}') AND confdeltype = '${action}')`,
  check: (t) => `SELECT EXISTS (SELECT 1 FROM pg_constraint WHERE contype = 'c' AND conrelid = to_regclass('${t}'))`,
};

/* ══════════════════════════ DATASETS ══════════════════════════════════ */

/**
 * THE ACADEMY. The course's main database from Week 7 on: students, courses,
 * enrollments, lessons, lesson completions, payments and certificates. Small
 * enough to read in full, with the awkward cases real data has: inactive
 * students, missing phone numbers, dropped and unfinished enrollments,
 * unpaid courses and instalments.
 */
export const ACADEMY = `CREATE TABLE students (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name  text NOT NULL,
  email      text NOT NULL UNIQUE,
  phone      text,
  city       text NOT NULL,
  joined_on  date NOT NULL,
  is_active  boolean NOT NULL DEFAULT true
);

CREATE TABLE courses (
  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code           text NOT NULL UNIQUE,
  title          text NOT NULL,
  category       text NOT NULL,
  price          numeric(10,2) NOT NULL CHECK (price >= 0),
  duration_weeks integer NOT NULL CHECK (duration_weeks > 0)
);

CREATE TABLE enrollments (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id   integer NOT NULL REFERENCES students (id),
  course_id    integer NOT NULL REFERENCES courses (id),
  enrolled_on  date NOT NULL,
  status       text NOT NULL CHECK (status IN ('active', 'completed', 'dropped')),
  completed_on date,
  score        integer CHECK (score BETWEEN 0 AND 100),
  UNIQUE (student_id, course_id)
);

CREATE TABLE lessons (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id integer NOT NULL REFERENCES courses (id),
  position  integer NOT NULL,
  title     text NOT NULL,
  minutes   integer NOT NULL,
  UNIQUE (course_id, position)
);

CREATE TABLE lesson_completions (
  student_id   integer NOT NULL REFERENCES students (id),
  lesson_id    integer NOT NULL REFERENCES lessons (id),
  completed_on date NOT NULL,
  PRIMARY KEY (student_id, lesson_id)
);

CREATE TABLE payments (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enrollment_id integer NOT NULL REFERENCES enrollments (id),
  amount        numeric(10,2) NOT NULL CHECK (amount > 0),
  paid_on       date NOT NULL,
  method        text NOT NULL CHECK (method IN ('card', 'transfer', 'ussd'))
);

CREATE TABLE certificates (
  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enrollment_id  integer NOT NULL UNIQUE REFERENCES enrollments (id),
  certificate_no text NOT NULL UNIQUE,
  issued_on      date NOT NULL
);

INSERT INTO students (full_name, email, phone, city, joined_on, is_active) VALUES
  ('Ada Obi',         'ada@example.com',      '0803 111 2001', 'Lagos',         '2026-01-05', true),
  ('Bayo Adeyemi',    'bayo@example.com',     '0805 222 3002', 'Ibadan',        '2026-01-09', true),
  ('Chiamaka Eze',    'chiamaka@example.com', NULL,            'Enugu',         '2026-01-15', true),
  ('Dayo Bello',      'dayo@example.com',     '0807 444 5004', 'Lagos',         '2026-02-02', true),
  ('Efe Okoro',       'efe@example.com',      NULL,            'Port Harcourt', '2026-02-10', false),
  ('Fatima Musa',     'fatima@example.com',   '0809 666 7006', 'Kano',          '2026-02-21', true),
  ('Gbenga Ola',      'gbenga@example.com',   '0802 777 8007', 'Abuja',         '2026-03-03', true),
  ('Halima Yusuf',    'halima@example.com',   NULL,            'Abuja',         '2026-03-18', true),
  ('Ifeanyi Nwosu',   'ifeanyi@example.com',  '0806 999 0009', 'Enugu',         '2026-04-01', false),
  ('Joy Etim',        'joy@example.com',      '0810 123 4010', 'Lagos',         '2026-04-14', true),
  ('Kunle Ajayi',     'kunle@example.com',    '0811 234 5011', 'Ibadan',        '2026-05-06', true),
  ('Lola Hassan',     'lola@example.com',     NULL,            'Lagos',         '2026-05-20', true);

INSERT INTO courses (code, title, category, price, duration_weeks) VALUES
  ('DA-101', 'Data Analysis',        'data',        60000.00, 16),
  ('WD-101', 'Web Development',      'web',         75000.00, 24),
  ('PY-101', 'Python Programming',   'programming', 50000.00, 12),
  ('DB-101', 'Relational Databases', 'data',        55000.00, 16),
  ('CS-101', 'Cybersecurity',        'security',    80000.00, 16);

INSERT INTO enrollments (student_id, course_id, enrolled_on, status, completed_on, score) VALUES
  (1,  1, '2026-01-06', 'completed', '2026-04-28', 88),
  (1,  4, '2026-05-02', 'active',    NULL,         NULL),
  (2,  2, '2026-01-10', 'active',    NULL,         NULL),
  (2,  3, '2026-01-10', 'completed', '2026-04-03', 74),
  (3,  1, '2026-01-16', 'completed', '2026-05-08', 91),
  (3,  3, '2026-02-01', 'dropped',   NULL,         NULL),
  (4,  4, '2026-02-03', 'completed', '2026-05-26', 67),
  (4,  5, '2026-03-01', 'active',    NULL,         NULL),
  (5,  2, '2026-02-11', 'dropped',   NULL,         NULL),
  (6,  1, '2026-02-22', 'active',    NULL,         NULL),
  (6,  3, '2026-02-22', 'completed', '2026-05-17', 82),
  (7,  4, '2026-03-04', 'completed', '2026-06-24', 95),
  (7,  2, '2026-03-20', 'active',    NULL,         NULL),
  (8,  3, '2026-03-19', 'completed', '2026-06-11', 58),
  (8,  1, '2026-04-02', 'active',    NULL,         NULL),
  (9,  5, '2026-04-02', 'dropped',   NULL,         NULL),
  (10, 1, '2026-04-15', 'active',    NULL,         NULL),
  (10, 4, '2026-04-15', 'active',    NULL,         NULL),
  (11, 3, '2026-05-07', 'active',    NULL,         NULL),
  (11, 5, '2026-05-07', 'active',    NULL,         NULL),
  (12, 2, '2026-05-21', 'active',    NULL,         NULL);

INSERT INTO lessons (course_id, position, title, minutes) VALUES
  (1, 1, 'What data is', 30), (1, 2, 'Cleaning data', 45), (1, 3, 'Pivot tables', 50),
  (2, 1, 'HTML structure', 40), (2, 2, 'CSS layout', 55), (2, 3, 'JavaScript basics', 60),
  (3, 1, 'Variables', 25), (3, 2, 'Loops', 35), (3, 3, 'Functions', 40),
  (4, 1, 'Tables and keys', 35), (4, 2, 'SELECT', 30), (4, 3, 'Joins', 50),
  (5, 1, 'Threats', 30), (5, 2, 'Networks', 45), (5, 3, 'Defence', 50);

INSERT INTO lesson_completions (student_id, lesson_id, completed_on) VALUES
  (1, 1, '2026-01-20'), (1, 2, '2026-02-18'), (1, 3, '2026-03-30'), (1, 10, '2026-05-15'),
  (2, 4, '2026-01-25'), (2, 7, '2026-01-28'), (2, 8, '2026-02-25'), (2, 9, '2026-03-20'),
  (3, 1, '2026-02-01'), (3, 2, '2026-03-05'), (3, 3, '2026-04-20'), (3, 7, '2026-02-14'),
  (4, 10, '2026-02-20'), (4, 11, '2026-03-25'), (4, 12, '2026-05-10'), (4, 13, '2026-03-21'),
  (6, 1, '2026-03-10'), (6, 7, '2026-03-05'), (6, 8, '2026-04-02'), (6, 9, '2026-05-01'),
  (7, 10, '2026-03-25'), (7, 11, '2026-04-30'), (7, 12, '2026-06-10'), (7, 4, '2026-04-08'),
  (8, 7, '2026-04-01'), (8, 8, '2026-05-02'), (8, 9, '2026-06-01'),
  (10, 1, '2026-05-01'), (10, 10, '2026-05-03'), (11, 7, '2026-05-20');

INSERT INTO payments (enrollment_id, amount, paid_on, method) VALUES
  (1,  60000.00, '2026-01-06', 'card'),
  (2,  27500.00, '2026-05-02', 'transfer'),
  (2,  27500.00, '2026-06-02', 'transfer'),
  (3,  37500.00, '2026-01-10', 'ussd'),
  (4,  50000.00, '2026-01-10', 'card'),
  (5,  60000.00, '2026-01-16', 'transfer'),
  (7,  55000.00, '2026-02-03', 'card'),
  (8,  40000.00, '2026-03-01', 'transfer'),
  (10, 30000.00, '2026-02-22', 'ussd'),
  (10, 30000.00, '2026-03-22', 'ussd'),
  (11, 50000.00, '2026-02-22', 'card'),
  (12, 55000.00, '2026-03-04', 'card'),
  (13, 75000.00, '2026-03-20', 'transfer'),
  (14, 50000.00, '2026-03-19', 'transfer'),
  (15, 60000.00, '2026-04-02', 'card'),
  (17, 30000.00, '2026-04-15', 'ussd'),
  (18, 55000.00, '2026-04-15', 'card'),
  (19, 50000.00, '2026-05-07', 'transfer'),
  (21, 37500.00, '2026-05-21', 'card');

INSERT INTO certificates (enrollment_id, certificate_no, issued_on) VALUES
  (1,  'MST-2026-0001', '2026-04-30'),
  (4,  'MST-2026-0002', '2026-04-06'),
  (5,  'MST-2026-0003', '2026-05-11'),
  (7,  'MST-2026-0004', '2026-05-28'),
  (11, 'MST-2026-0005', '2026-05-19'),
  (12, 'MST-2026-0006', '2026-06-26');`;

/**
 * THE ONLINE STORE. Built by learners in Week 5; this is the finished
 * schema with sample data, used from Week 6.
 */
export const STORE_SCHEMA = `CREATE TABLE customers (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name  text NOT NULL,
  email      text NOT NULL UNIQUE,
  phone      text,
  city       text NOT NULL,
  created_on date NOT NULL DEFAULT current_date
);

CREATE TABLE products (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku         text NOT NULL UNIQUE,
  name        text NOT NULL,
  category    text NOT NULL,
  unit_price  numeric(10,2) NOT NULL CHECK (unit_price > 0),
  stock       integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_listed   boolean NOT NULL DEFAULT true
);

CREATE TABLE orders (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers (id),
  ordered_on  date NOT NULL DEFAULT current_date,
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled'))
);

CREATE TABLE order_items (
  order_id   integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products (id),
  quantity   integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price > 0),
  PRIMARY KEY (order_id, product_id)
);`;

export const STORE_DATA = `INSERT INTO customers (full_name, email, phone, city, created_on) VALUES
  ('Amaka Nnaji',   'amaka@example.com',  '0803 100 2000', 'Lagos',   '2026-01-03'),
  ('Tunde Bakare',  'tunde@example.com',  NULL,            'Ibadan',  '2026-01-11'),
  ('Zainab Ali',    'zainab@example.com', '0805 300 4000', 'Kano',    '2026-02-07'),
  ('Emeka Obi',     'emeka@example.com',  '0807 500 6000', 'Enugu',   '2026-02-19'),
  ('Ngozi Peters',  'ngozi@example.com',  NULL,            'Abuja',   '2026-03-02'),
  ('Sola Adebayo',  'sola@example.com',   '0809 700 8000', 'Lagos',   '2026-03-28');

INSERT INTO products (sku, name, category, unit_price, stock, is_listed) VALUES
  ('BAG-001', 'Ankara tote bag',      'bags',        8500.00, 24, true),
  ('BAG-002', 'Leather laptop bag',   'bags',       32000.00,  6, true),
  ('SHE-001', 'Shea butter 250g',     'beauty',      3000.00, 60, true),
  ('SHE-002', 'Black soap 500g',      'beauty',      2500.00,  0, true),
  ('TEA-001', 'Zobo tea 100g',        'food',        1800.00, 40, true),
  ('TEA-002', 'Moringa tea 100g',     'food',        2200.00, 15, false),
  ('SCA-001', 'Adire scarf',          'clothing',    6000.00, 12, true),
  ('SHI-001', 'Aso-oke shirt',        'clothing',   18500.00,  4, true);

INSERT INTO orders (customer_id, ordered_on, status) VALUES
  (1, '2026-04-02', 'delivered'),
  (2, '2026-04-05', 'shipped'),
  (1, '2026-04-11', 'paid'),
  (3, '2026-04-12', 'pending'),
  (4, '2026-04-15', 'cancelled'),
  (5, '2026-04-20', 'pending'),
  (3, '2026-04-22', 'paid');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 2,  8500.00), (1, 3, 3,  3000.00),
  (2, 2, 1, 32000.00),
  (3, 7, 1,  6000.00), (3, 5, 4,  1800.00),
  (4, 8, 1, 18500.00),
  (5, 1, 1,  8500.00),
  (6, 3, 2,  3000.00), (6, 5, 1,  1800.00),
  (7, 7, 2,  6000.00);`;

export const STORE = `${STORE_SCHEMA}\n\n${STORE_DATA}`;

/** THE BANK. Week 11's accounts, with a transfers log. */
export const BANK = `CREATE TABLE accounts (
  id      integer PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance >= 0)
);

CREATE TABLE transfers (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_account integer NOT NULL REFERENCES accounts (id),
  to_account   integer NOT NULL REFERENCES accounts (id),
  amount       numeric(12,2) NOT NULL CHECK (amount > 0),
  made_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (from_account <> to_account)
);

INSERT INTO accounts VALUES
  (1, 'Ada',   5000.00),
  (2, 'Bayo',  3000.00),
  (3, 'Chi',    250.00);`;

/**
 * THE MESSY SPREADSHEET. Week 1's student-registration sheet, loaded as one
 * wide table exactly as it was typed: courses in a list, fees in a list,
 * dates as text in two formats, a city spelt three ways, a student entered
 * twice, and the instructor's phone copied onto every row.
 */
export const REGISTRATIONS = `CREATE TABLE registrations (
  row_no           integer,
  student_name     text,
  email            text,
  phone            text,
  city             text,
  courses          text,
  fees_paid        text,
  registered       text,
  instructor       text,
  instructor_phone text
);

INSERT INTO registrations VALUES
  (1, 'Ada Obi',        'ada@example.com',      '08031112001', 'Lagos',  'Python, SQL',            '50000; 55000', '12/01/2026', 'Mr. Okafor', '0802 555 0100'),
  (2, 'Bayo Adeyemi',   'bayo@example.com',     '08052223002', 'Ibadan', 'Web Development',        '75000',        '2026-01-15', 'Mrs. Bello', '0803 555 0200'),
  (3, 'ada obi',        'ada.obi@example.com',  '0803 111 2001', 'lagos', 'SQL',                   '55000',        '20/01/2026', 'Mr. Okafor', '0802 555 0100'),
  (4, 'Chiamaka Eze',   'chiamaka@example.com', NULL,          'Enugu',  'Python',                 '',             '03/02/2026', 'Mr. Okafor', '0802 555 0199'),
  (5, 'Dayo Bello',     'dayo@example',         '08074445004', 'LAGOS',  'Data Analysis, Python', '60000',        '2026-02-03', 'Mrs. Bello', '0803 555 0200'),
  (6, 'Efe Okoro',      'efe@example.com',      '08085556005', 'P/H',    'Cybersecurity',          '80000',        'next week',  'Mr. Musa',   '0805 555 0300');`;

/** The student table of Week 2 onwards, as the learner builds it. */
export const WEEK2_STUDENTS = `CREATE TABLE students (
  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name       text NOT NULL,
  email           text NOT NULL UNIQUE,
  enrolled_on     date NOT NULL DEFAULT current_date,
  course_interest text
);

INSERT INTO students (full_name, email, enrolled_on, course_interest) VALUES
  ('Ada Obi',      'ada@example.com',      '2026-01-12', 'Data Analysis'),
  ('Bayo Adeyemi', 'bayo@example.com',     '2026-02-03', 'Web Development'),
  ('Chiamaka Eze', 'chiamaka@example.com', '2026-02-14', NULL);`;

/**
 * THE BIG ORDERS TABLE (Week 12). 50,000 synthetic orders across 2,000
 * customers and 200 products, made by generate_series with deterministic
 * arithmetic, so every learner (and the build) gets the same data, and
 * ANALYZEd so the planner's estimates are realistic.
 */
export const BIG_ORDERS = `CREATE TABLE customers (
  id    integer PRIMARY KEY,
  email text NOT NULL,
  city  text NOT NULL
);
INSERT INTO customers
SELECT g,
       'customer' || g || '@example.com',
       (ARRAY['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Enugu', 'Port Harcourt'])[1 + g % 6]
FROM generate_series(1, 2000) AS g;

CREATE TABLE orders (
  id          integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers (id),
  product_id  integer NOT NULL,
  ordered_on  date NOT NULL,
  status      text NOT NULL,
  total       numeric(10,2) NOT NULL
);
INSERT INTO orders
SELECT g,
       1 + (g * 7919) % 2000,
       1 + (g::bigint * 104729) % 200,
       date '2025-01-01' + (g * 37) % 540,
       (ARRAY['delivered', 'delivered', 'delivered', 'shipped', 'paid', 'pending', 'cancelled'])[1 + g % 7],
       ((g * 9973) % 90000 + 1000) / 100.0
FROM generate_series(1, 50000) AS g;

ANALYZE customers;
ANALYZE orders;

-- A lab helper: the plan PostgreSQL chooses for a query, as one line of text.
CREATE FUNCTION lab_plan(query text) RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  line text;
  plan text := '';
BEGIN
  FOR line IN EXECUTE 'EXPLAIN (COSTS OFF) ' || query LOOP
    plan := plan || line || ' / ';
  END LOOP;
  RETURN plan;
END
$$;`;
