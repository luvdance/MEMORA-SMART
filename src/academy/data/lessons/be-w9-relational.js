/**
 * BACKEND ENGINEERING · WEEK 9 · RELATIONAL DATABASE FUNDAMENTALS
 *
 * Curriculum 9.1 – 9.P. What databases solve; relational and document
 * databases; tables, rows, columns and types; primary and foreign keys;
 * relationships; entity-relationship diagrams; normalization; constraints;
 * designing from requirements; the academy schema exercise; and an ER
 * diagram with its normalized schema.
 *
 * SQL labs run on PostgreSQL 18 (PGlite) through the RDBMS course's engine
 * (src/academy/sql); checks prove constraints by inserting rows that must
 * be accepted or rejected with PostgreSQL's own error codes. ER diagrams
 * are Mermaid erDiagrams in Markdown, parsed by the checks.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide } from "./be-helpers.js";
import { HAS } from "./db-helpers.js";

export const SECTION_ID = "be-s9-relational";
const MODULE = "be-w9-relational";

/**
 * A check's preamble that parses the first ```mermaid erDiagram in a Markdown file:
 * entities (with their attributes and keys) and relationships with cardinalities.
 *   entities: { STUDENT: [{ type, name, keys: ["PK"] }] }
 *   rels: [{ a, b, left: "||", right: "o{", label }]   (a ||--o{ b : label)
 */
export const PARSE_ERD = (file) => `
const doc = file(${JSON.stringify(file)}) || "";
const block = /\`\`\`mermaid\\s*([\\s\\S]*?)\`\`\`/.exec(doc);
assert(block, "put the diagram in a \`\`\`mermaid block");
assert(/^\\s*erDiagram\\b/.test(block[1]), "start the diagram with erDiagram");
const entities = {};
const rels = [];
let current = null;
for (const raw of block[1].split("\\n")) {
  const line = raw.trim();
  if (!line || line.startsWith("%%") || /^erDiagram\\b/.test(line)) continue;
  if (current) {
    if (line === "}") { current = null; continue; }
    const m = /^([\\w()]+)\\s+(\\w+)((?:\\s+(?:PK|FK|UK)\\s*,?)*)/.exec(line);
    if (m) entities[current].push({ type: m[1], name: m[2], keys: (m[3].match(/PK|FK|UK/g) || []) });
    continue;
  }
  const open = /^"?([\\w-]+)"?\\s*\\{\\s*$/.exec(line);
  if (open) { current = open[1].toUpperCase(); entities[current] = entities[current] || []; continue; }
  const r = /^"?([\\w-]+)"?\\s+(\\|\\||\\|o|o\\||\\}\\||\\}o|o\\{|\\|\\{)(--|\\.\\.)(\\|\\||\\|o|o\\||\\}\\||\\}o|o\\{|\\|\\{)\\s+"?([\\w-]+)"?\\s*:?\\s*"?([^"]*)"?/.exec(line);
  if (r) {
    const a = r[1].toUpperCase(), b = r[5].toUpperCase();
    rels.push({ a, b, left: r[2], right: r[4], label: r[6] });
    entities[a] = entities[a] || [];
    entities[b] = entities[b] || [];
  }
}
const many = (end) => /[{}]/.test(end);
/** The relationship between x and y, oriented so that the result reads x <left>--<right> y. */
const rel = (x, y) => {
  const f = rels.find((r) => r.a === x && r.b === y);
  if (f) return f;
  const g = rels.find((r) => r.a === y && r.b === x);
  if (!g) return null;
  const mirror = { "||": "||", "o|": "|o", "|o": "o|", "o{": "}o", "}o": "o{", "|{": "}|", "}|": "|{" };
  return { a: x, b: y, left: mirror[g.right], right: mirror[g.left], label: g.label };
};
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 9.1 – 9.2 · WHAT DATABASES SOLVE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l61-why-databases",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "What Databases Solve, Relational and Document",
    subtitle: "Why the courses array has to go",
    estimatedMinutes: 45,
    intro:
      "Phase 3 replaces the in-memory courses array with a database. Before writing SQL, it is worth being clear about what a database does that an array, or a JSON file, cannot.",
    atoms: [
      {
        id: "a-be-why-databases",
        title: "What databases solve",
        explain:
          "The Week 7 API keeps courses in an array: restart the server and every change is gone; run two servers and each has its own copy. Writing the array to a JSON file fixes persistence and nothing else. A DATABASE SERVER gives an API: DURABILITY (a committed change survives crashes and restarts), CONCURRENCY (many servers and requests read and write at once without overwriting each other), INTEGRITY (rules such as 'every enrollment refers to a real student' are enforced for every writer), QUERYING (find, filter, join and aggregate millions of rows quickly with indexes) and SECURITY (users and permissions). These guarantees are summarised as ACID: Atomic, Consistent, Isolated, Durable (Week 11).",
        decision: decide({
          scenario: "Two API servers behind a load balancer each keep enrollments in a JSON file and rewrite the whole file on every enrollment. Two students enroll at the same moment, one on each server.",
          question: "What happens, and what fixes it?",
          right: ["Each server has its own file, and even with a shared file the second rewrite would erase the first enrollment; a database server shared by both, which serialises the writes, fixes it", "Concurrency and a single source of truth."],
          wrong: [
            ["Nothing goes wrong: files are saved instantly", "Saving is fast, not atomic or shared."],
            ["Use a bigger JSON file", "Size is not the problem."],
            ["Keep the data in memory instead", "Lost on restart, and still one copy per server."],
          ],
          at: 1,
          aftermath: "This is the 'lost update': two writers read the same state and the last one wins. Databases prevent it; Week 12 shows the cases where you still have to think about it.",
        }),
      },
      {
        id: "a-be-relational-vs-document",
        title: "Relational vs document databases",
        explain:
          "A RELATIONAL database (PostgreSQL, MySQL, SQL Server, SQLite) stores data in TABLES with a fixed set of typed columns, links tables through keys, and answers questions with SQL, including JOINs across tables, inside transactions. A DOCUMENT database (MongoDB, Firestore, DynamoDB in document style) stores JSON-like documents, each with its own shape, grouped in collections; related data is often EMBEDDED in one document, so reading 'a course with its lessons' is one lookup, but questions that cut across documents ('which students failed any assessment this month?') are harder, and duplicated data must be kept in step by your code. Relational fits most business data (users, orders, enrollments, payments) because it is full of relationships and rules. PostgreSQL also stores JSON in jsonb columns when part of the data really has no fixed shape.",
        decision: decide({
          scenario: "The academy needs students, courses, enrollments, payments and certificates, with reports such as 'revenue per course per month' and rules such as 'a certificate only for a completed enrollment'.",
          question: "Which database fits best?",
          right: ["A relational database such as PostgreSQL: the data is relationships plus rules, and the reports are joins and aggregates", "The course uses PostgreSQL from here on."],
          wrong: [
            ["A document database, because JSON is easier", "Easier to start; harder to keep consistent and to report on."],
            ["One JSON document per student holding everything", "Course data would be duplicated in every student and drift."],
            ["Redis", "A cache and data-structure server (Week 12, 18), not the system of record for this data."],
          ],
          at: 0,
          aftermath: "Choosing PostgreSQL does not rule out flexible fields: a jsonb column can hold, say, a course's optional marketing metadata.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 9.3 – 9.4 · TABLES, TYPES AND KEYS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l62-tables-keys",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3", "9.4"],
    title: "Tables, Columns, Types and Keys",
    subtitle: "The shapes data takes in PostgreSQL",
    estimatedMinutes: 55,
    intro: "A table is a set of rows that all have the same columns. Choosing each column's type and the table's keys is most of database design, and mistakes here are expensive to fix later.",
    atoms: [
      {
        id: "a-be-tables-types",
        title: "Tables, rows, columns and data types",
        explain:
          "A TABLE describes one kind of thing (courses); each ROW is one of them; each COLUMN is one property with one TYPE. Common PostgreSQL types: integer and bigint (whole numbers), numeric(10,2) (exact decimals: money), text (any string; varchar(n) only when a limit is a real rule), boolean, date, timestamptz (a moment in time, stored in UTC: use it for created_at), uuid, and jsonb. NOT NULL makes a column required; DEFAULT gives a value when none is sent. Never store money in a float (0.1 + 0.2 is not 0.3) or dates in text.",
        sqlLab: {
          task:
            "Create the courses table: id (an auto-numbered integer primary key: integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY), code (text, required), title (text, required), weeks (integer, required), price (numeric(10,2), required: naira and kobo), published (boolean, required, default false) and created_at (timestamptz, required, default now()).",
          starter: "CREATE TABLE courses (\n  \n);\n",
          solution:
            "CREATE TABLE courses (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  code       text NOT NULL,\n  title      text NOT NULL,\n  weeks      integer NOT NULL,\n  price      numeric(10,2) NOT NULL,\n  published  boolean NOT NULL DEFAULT false,\n  created_at timestamptz NOT NULL DEFAULT now()\n);\n",
          checks: [
            { label: "courses exists with an identity primary key", assert: `SELECT (${HAS.pk("courses", ["id"])}) AND EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'courses'::regclass AND attname = 'id' AND attidentity = 'a')` },
            {
              label: "Each column has the right type",
              assert:
                "SELECT (SELECT array_agg(attname || ':' || format_type(atttypid, atttypmod) ORDER BY attnum) FROM pg_attribute WHERE attrelid = 'courses'::regclass AND attnum > 0 AND NOT attisdropped) = ARRAY['id:integer','code:text','title:text','weeks:integer','price:numeric(10,2)','published:boolean','created_at:timestamp with time zone']",
              message: "Columns, in order: id integer, code text, title text, weeks integer, price numeric(10,2), published boolean, created_at timestamptz.",
            },
            { label: "Defaults fill published and created_at", accepts: "INSERT INTO courses (code, title, weeks, price) VALUES ('BE-101', 'Backend Engineering', 24, 120000.50)" },
            { label: "published defaults to false and created_at to now()", assert: "SELECT published = false AND created_at > now() - interval '1 minute' FROM courses WHERE code = 'BE-101'" },
            { label: "A course without a title is refused", rejects: "INSERT INTO courses (code, weeks, price) VALUES ('DB-101', 16, 80000)", code: "23502" },
          ],
          hint: "Each column: name type [NOT NULL] [DEFAULT …]. The id line is integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY.",
          successMessage: "A table whose types say what the data is: exact money, a real moment for created_at, and defaults the database fills in.",
        },
      },
      {
        id: "a-be-keys",
        title: "Primary keys and foreign keys",
        explain:
          "A PRIMARY KEY identifies each row: unique and never NULL. Use a SURROGATE key (an id the database generates) rather than a NATURAL key that might change (an email); keep natural identifiers unique with UNIQUE. A FOREIGN KEY makes a column refer to another table's primary key: enrollments.student_id REFERENCES students (id) means every enrollment points to a real student, and PostgreSQL refuses an enrollment for student 99 (error 23503) and, by default, refuses deleting a student who has enrollments. ON DELETE CASCADE deletes the children too; ON DELETE SET NULL forgets the link; choose per relationship.",
        sqlLab: {
          setup: "CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL);\nINSERT INTO courses (code, title) VALUES ('BE-101', 'Backend Engineering'), ('DB-101', 'Relational Databases');\n",
          erd: true,
          task:
            "Create students (id identity primary key, email text required and unique, full_name text required) and enrollments (id identity primary key, student_id and course_id required foreign keys to students and courses, enrolled_on date required default current_date). Deleting a student must delete their enrollments (ON DELETE CASCADE); deleting a course that has enrollments must be refused (the default).",
          starter: "CREATE TABLE students (\n  \n);\n\nCREATE TABLE enrollments (\n  \n);\n",
          solution:
            "CREATE TABLE students (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email     text NOT NULL UNIQUE,\n  full_name text NOT NULL\n);\n\nCREATE TABLE enrollments (\n  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  student_id  integer NOT NULL REFERENCES students (id) ON DELETE CASCADE,\n  course_id   integer NOT NULL REFERENCES courses (id),\n  enrolled_on date NOT NULL DEFAULT current_date\n);\n",
          checks: [
            { label: "Both tables have their primary keys", assert: `SELECT (${HAS.pk("students", ["id"])}) AND (${HAS.pk("enrollments", ["id"])})` },
            { label: "enrollments refers to students and courses", assert: `SELECT (${HAS.fk("enrollments", "students", "student_id")}) AND (${HAS.fk("enrollments", "courses", "course_id")})` },
            { label: "A valid student and enrollment are accepted", accepts: "INSERT INTO students (email, full_name) VALUES ('ada@example.com', 'Ada Obi'); INSERT INTO enrollments (student_id, course_id) VALUES (1, 1), (1, 2)" },
            { label: "An enrollment for student 99 is refused", rejects: "INSERT INTO enrollments (student_id, course_id) VALUES (99, 1)", code: "23503" },
            { label: "A second student with the same email is refused", rejects: "INSERT INTO students (email, full_name) VALUES ('ada@example.com', 'Ada Again')", code: "23505" },
            { label: "Deleting a course with enrollments is refused", rejects: "DELETE FROM courses WHERE id = 1", code: "23503" },
            { label: "Deleting a student deletes their enrollments", accepts: "DELETE FROM students WHERE id = 1" },
            { label: "…and no enrollment is left behind", assert: "SELECT count(*) = 0 FROM enrollments" },
          ],
          hint: "student_id integer NOT NULL REFERENCES students (id) ON DELETE CASCADE; course_id has no ON DELETE clause, so the default (refuse) applies.",
          successMessage: "The database now refuses enrollments for students that do not exist, from every program that writes to it, not just your API.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 9.5 – 9.6 · RELATIONSHIPS AND ER DIAGRAMS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l63-relationships",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.5", "9.6"],
    title: "Relationships and Entity-Relationship Diagrams",
    subtitle: "One-to-one, one-to-many, many-to-many, and drawing them",
    estimatedMinutes: 60,
    intro: "Every relationship between two kinds of thing is one of three shapes, and each shape has one standard way to build it in tables.",
    atoms: [
      {
        id: "a-be-relationships",
        title: "One-to-one, one-to-many and many-to-many",
        explain:
          "ONE-TO-MANY (a course has many lessons; a lesson belongs to one course): a foreign key on the MANY side (lessons.course_id). ONE-TO-ONE (an enrollment has at most one certificate): a foreign key that is also UNIQUE (certificates.enrollment_id UNIQUE). MANY-TO-MANY (students take many courses; courses have many students): a JUNCTION table with a foreign key to each side (enrollments(student_id, course_id)), made unique, or the primary key, so a pair appears once. A junction table often grows its own data (enrolled_on, status, score): then it is an entity in its own right.",
        sqlLab: {
          setup:
            "CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE);\nCREATE TABLE instructors (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, full_name text NOT NULL);\nCREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, course_id integer NOT NULL REFERENCES courses (id));\nINSERT INTO courses (code) VALUES ('BE-101'), ('DB-101');\nINSERT INTO instructors (full_name) VALUES ('Ngozi Eze'), ('Tunde Bakare');\nINSERT INTO enrollments (course_id) VALUES (1), (1), (2);\n",
          erd: true,
          task:
            "Build three relationships. (1) One-to-many: lessons (id identity primary key, course_id required foreign key to courses, title text required). (2) One-to-one: certificates (id identity primary key, enrollment_id required foreign key to enrollments that is unique, certificate_no text required unique). (3) Many-to-many: course_instructors (course_id, instructor_id, both required foreign keys) with the pair as the primary key.",
          starter: "",
          solution:
            "CREATE TABLE lessons (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  course_id integer NOT NULL REFERENCES courses (id),\n  title     text NOT NULL\n);\n\nCREATE TABLE certificates (\n  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  enrollment_id  integer NOT NULL UNIQUE REFERENCES enrollments (id),\n  certificate_no text NOT NULL UNIQUE\n);\n\nCREATE TABLE course_instructors (\n  course_id     integer NOT NULL REFERENCES courses (id),\n  instructor_id integer NOT NULL REFERENCES instructors (id),\n  PRIMARY KEY (course_id, instructor_id)\n);\n",
          checks: [
            { label: "A course can have many lessons", accepts: "INSERT INTO lessons (course_id, title) VALUES (1, 'HTTP'), (1, 'Express'), (2, 'SELECT')" },
            { label: "An enrollment gets one certificate…", accepts: "INSERT INTO certificates (enrollment_id, certificate_no) VALUES (1, 'MST-0001')" },
            { label: "…and not a second one", rejects: "INSERT INTO certificates (enrollment_id, certificate_no) VALUES (1, 'MST-0002')", code: "23505" },
            { label: "Courses and instructors pair freely…", accepts: "INSERT INTO course_instructors VALUES (1, 1), (1, 2), (2, 1)" },
            { label: "…but each pair only once", rejects: "INSERT INTO course_instructors VALUES (1, 2)", code: "23505" },
            { label: "The keys are the right ones", assert: `SELECT (${HAS.pk("course_instructors", ["course_id", "instructor_id"])}) AND (${HAS.unique("certificates", ["enrollment_id"])}) AND (${HAS.fk("lessons", "courses", "course_id")}) AND (${HAS.fk("course_instructors", "instructors", "instructor_id")})` },
          ],
          hint: "One-to-many: the foreign key goes on the 'many' side. One-to-one: add UNIQUE to the foreign key. Many-to-many: a table of pairs with PRIMARY KEY (course_id, instructor_id).",
          successMessage: "Three shapes, three patterns. Open the diagram to see them drawn.",
        },
      },
      {
        id: "a-be-erd",
        title: "Entity-relationship diagrams",
        explain:
          "An ER DIAGRAM draws entities (boxes with their attributes, PK and FK marked) and the relationships between them, with their CARDINALITY at each end. In crow's-foot notation, which Mermaid's erDiagram uses: || means exactly one, o| zero or one, |{ one or more, o{ zero or more. STUDENT ||--o{ ENROLLMENT : makes reads 'a student makes zero or more enrollments; an enrollment belongs to exactly one student'. Draw the diagram before the SQL: it is where a team agrees on the model, and it is cheap to change. Mermaid diagrams live in Markdown, so they sit in the repository next to the code and render on GitHub.",
        nodeLab: {
          task:
            "In DESIGN.md, draw the academy's core model as a Mermaid erDiagram: entities STUDENT, COURSE, ENROLLMENT, LESSON and CERTIFICATE, each with its attributes (id marked PK, foreign keys marked FK); a student makes zero or more enrollments; a course has zero or more enrollments and zero or more lessons; an enrollment has zero or one certificate. Each enrollment belongs to exactly one student and one course.",
          command: false,
          files: {
            "DESIGN.md": "# Academy data model\n\n```mermaid\nerDiagram\n    STUDENT {\n        int id PK\n        text email\n    }\n```\n",
          },
          open: "DESIGN.md",
          solution: {
            "DESIGN.md":
              "# Academy data model\n\n```mermaid\nerDiagram\n    STUDENT ||--o{ ENROLLMENT : makes\n    COURSE ||--o{ ENROLLMENT : has\n    COURSE ||--o{ LESSON : contains\n    ENROLLMENT ||--o| CERTIFICATE : earns\n\n    STUDENT {\n        int id PK\n        text email UK\n        text full_name\n    }\n    COURSE {\n        int id PK\n        text code UK\n        text title\n        int weeks\n    }\n    ENROLLMENT {\n        int id PK\n        int student_id FK\n        int course_id FK\n        text status\n    }\n    LESSON {\n        int id PK\n        int course_id FK\n        int position\n        text title\n    }\n    CERTIFICATE {\n        int id PK\n        int enrollment_id FK\n        text certificate_no UK\n    }\n```\n",
          },
          tests: [
            { label: "A Mermaid erDiagram with the five entities", check: `${PARSE_ERD("DESIGN.md")} for (const e of ["STUDENT", "COURSE", "ENROLLMENT", "LESSON", "CERTIFICATE"]) assert(entities[e], "the diagram has no " + e);` },
            { label: "Each entity has an id PK; foreign keys are marked FK", check: `${PARSE_ERD("DESIGN.md")} for (const e of ["STUDENT", "COURSE", "ENROLLMENT", "LESSON", "CERTIFICATE"]) assert((entities[e] || []).some((a) => a.name === "id" && a.keys.includes("PK")), e + " needs an attribute: int id PK"); const fk = (e, n) => (entities[e] || []).some((a) => a.name === n && a.keys.includes("FK")); assert(fk("ENROLLMENT", "student_id") && fk("ENROLLMENT", "course_id"), "ENROLLMENT needs student_id FK and course_id FK"); assert(fk("LESSON", "course_id"), "LESSON needs course_id FK"); assert(fk("CERTIFICATE", "enrollment_id"), "CERTIFICATE needs enrollment_id FK");` },
            { label: "Student and course: one to zero-or-more enrollments", check: `${PARSE_ERD("DESIGN.md")} for (const p of ["STUDENT", "COURSE"]) { const r = rel(p, "ENROLLMENT"); assert(r, "connect " + p + " and ENROLLMENT"); eq([r.left, r.right], ["||", "o{"], p + " ||--o{ ENROLLMENT"); }` },
            { label: "Course to lessons, enrollment to certificate", check: `${PARSE_ERD("DESIGN.md")} const l = rel("COURSE", "LESSON"); assert(l, "connect COURSE and LESSON"); eq([l.left, l.right], ["||", "o{"], "COURSE ||--o{ LESSON"); const c = rel("ENROLLMENT", "CERTIFICATE"); assert(c, "connect ENROLLMENT and CERTIFICATE"); eq([c.left, c.right], ["||", "o|"], "ENROLLMENT ||--o| CERTIFICATE (zero or one)");` },
          ],
          hint: "Relationships are lines like STUDENT ||--o{ ENROLLMENT : makes. Attributes go in a block: ENROLLMENT { int id PK  int student_id FK … }, one per line.",
          successMessage: "A diagram anyone on the team can read, kept in the repository. Lesson 66 turns the full version into tables.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 9.7 · NORMALIZATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l64-normalization",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.7"],
    title: "Normalization: First, Second and Third Normal Forms",
    subtitle: "Every fact in one place",
    estimatedMinutes: 60,
    intro: "Spreadsheets repeat information: the course title on every enrollment row. Repeated facts drift apart. Normalization is the discipline of storing each fact once.",
    atoms: [
      {
        id: "a-be-normalization",
        title: "1NF, 2NF and 3NF",
        explain:
          "FIRST NORMAL FORM: every column holds one value (no 'BE-101, DB-101' lists in a cell, no phone1/phone2/phone3 columns), and rows are identified by a key. SECOND: in a table keyed by several columns, every other column depends on the WHOLE key: in an enrollment row keyed by (student_email, course_code), course_title depends only on course_code, so it belongs in courses. THIRD: no column depends on another non-key column: student_city → city_region means region belongs with the city. Symptoms of a design that is not normalized: UPDATE anomalies (rename a course in 300 rows, miss one), INSERT anomalies (cannot add a course until someone enrolls) and DELETE anomalies (removing the last enrollment loses the course).",
        sqlLab: {
          setup:
            "-- The enrollment spreadsheet, imported as it was.\nCREATE TABLE enrollment_sheet (\n  student_email text,\n  student_name  text,\n  course_code   text,\n  course_title  text,\n  course_weeks  integer,\n  enrolled_on   date\n);\nINSERT INTO enrollment_sheet VALUES\n  ('ada@example.com',   'Ada Obi',      'BE-101', 'Backend Engineering',  24, '2026-01-06'),\n  ('ada@example.com',   'Ada Obi',      'DB-101', 'Relational Databases', 16, '2026-02-01'),\n  ('bayo@example.com',  'Bayo Adeyemi', 'BE-101', 'Backend Engineering',  24, '2026-01-10'),\n  ('chi@example.com',   'Chiamaka Eze', 'DB-101', 'Relational Databases', 16, '2026-01-16'),\n  ('chi@example.com',   'Chiamaka Eze', 'WD-201', 'React Development',    16, '2026-03-02'),\n  ('dayo@example.com',  'Dayo Bello',   'BE-101', 'Backend Engineering',  24, '2026-02-03');\n",
          erd: true,
          task:
            "Normalize enrollment_sheet into three tables: students (id identity primary key, email unique, full_name), courses (id identity primary key, code unique, title, weeks) and enrollments (student_id and course_id foreign keys, enrolled_on, with (student_id, course_id) as the primary key). Fill them from enrollment_sheet with INSERT … SELECT (each student and course once), then DROP the sheet.",
          starter: "",
          solution:
            "CREATE TABLE students (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email     text NOT NULL UNIQUE,\n  full_name text NOT NULL\n);\n\nCREATE TABLE courses (\n  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  code  text NOT NULL UNIQUE,\n  title text NOT NULL,\n  weeks integer NOT NULL\n);\n\nCREATE TABLE enrollments (\n  student_id  integer NOT NULL REFERENCES students (id),\n  course_id   integer NOT NULL REFERENCES courses (id),\n  enrolled_on date NOT NULL,\n  PRIMARY KEY (student_id, course_id)\n);\n\nINSERT INTO students (email, full_name)\nSELECT DISTINCT student_email, student_name FROM enrollment_sheet ORDER BY student_email;\n\nINSERT INTO courses (code, title, weeks)\nSELECT DISTINCT course_code, course_title, course_weeks FROM enrollment_sheet ORDER BY course_code;\n\nINSERT INTO enrollments (student_id, course_id, enrolled_on)\nSELECT s.id, c.id, e.enrolled_on\nFROM enrollment_sheet e\nJOIN students s ON s.email = e.student_email\nJOIN courses c ON c.code = e.course_code;\n\nDROP TABLE enrollment_sheet;\n",
          checks: [
            { label: "Each student and each course is stored once", assert: "SELECT (SELECT count(*) FROM students) = 4 AND (SELECT count(*) FROM courses) = 3", message: "There are 4 different students and 3 different courses in the sheet." },
            { label: "Every enrollment is kept", query: "SELECT s.email, c.code, c.title, e.enrolled_on FROM enrollments e JOIN students s ON s.id = e.student_id JOIN courses c ON c.id = e.course_id ORDER BY 1, 2", ordered: true },
            { label: "The keys and links are in place", assert: `SELECT (${HAS.pk("enrollments", ["course_id", "student_id"])}) AND (${HAS.fk("enrollments", "students", "student_id")}) AND (${HAS.fk("enrollments", "courses", "course_id")}) AND (${HAS.unique("students", ["email"])}) AND (${HAS.unique("courses", ["code"])})` },
            { label: "The spreadsheet table is gone", assert: "SELECT to_regclass('enrollment_sheet') IS NULL" },
            { label: "Renaming a course now changes one row", accepts: "UPDATE courses SET title = 'Backend Engineering with Node.js' WHERE code = 'BE-101'" },
          ],
          hint: "SELECT DISTINCT gives each student (or course) once. For enrollments, join the sheet to the new students and courses tables on email and code to find their new ids.",
          successMessage: "Backend Engineering's title was stored three times; now it is stored once, and renaming it cannot leave an old copy behind.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 9.8 · CONSTRAINTS AND DATA INTEGRITY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l65-constraints",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.8"],
    title: "Constraints and Data Integrity",
    subtitle: "Rules the database enforces for every writer",
    estimatedMinutes: 50,
    intro: "Your API validates input with zod. But scripts, admin tools, other services and future code also write to the database. Rules that must always hold belong in the database as constraints, where nothing can bypass them.",
    atoms: [
      {
        id: "a-be-constraints",
        title: "Constraints",
        explain:
          "PostgreSQL's constraints: NOT NULL (required), UNIQUE (no duplicates, also on several columns together), PRIMARY KEY, FOREIGN KEY (with ON DELETE rules), CHECK (any condition on the row: price >= 0, status IN (…), ends_on > starts_on) and EXCLUDE (no overlapping ranges). Each violation has its own SQLSTATE code, which the API maps to a response (Week 11): 23502 not null, 23505 unique (→ 409), 23503 foreign key, 23514 check (→ 400). Name constraints (CONSTRAINT courses_price_positive CHECK …) so errors say what was broken. The API validates for good messages; the database validates for correctness.",
        sqlLab: {
          setup:
            "CREATE TABLE students (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text);\nCREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text, title text, price numeric(10,2), starts_on date, ends_on date);\nCREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, student_id integer, course_id integer, status text, score integer);\n",
          task:
            "These tables accept anything. Add constraints with ALTER TABLE (the tables are empty): students.email required and unique; courses.code required and unique, title required, price required and 0 or more, ends_on after starts_on; enrollments: student_id and course_id required foreign keys, status one of active, completed or dropped, score between 0 and 100 (or empty), and a student enrolled in a course only once. Name the price check courses_price_not_negative.",
          starter: "ALTER TABLE students\n  ALTER COLUMN email SET NOT NULL,\n  ADD UNIQUE (email);\n",
          solution:
            "ALTER TABLE students\n  ALTER COLUMN email SET NOT NULL,\n  ADD UNIQUE (email);\n\nALTER TABLE courses\n  ALTER COLUMN code SET NOT NULL,\n  ALTER COLUMN title SET NOT NULL,\n  ALTER COLUMN price SET NOT NULL,\n  ADD UNIQUE (code),\n  ADD CONSTRAINT courses_price_not_negative CHECK (price >= 0),\n  ADD CHECK (ends_on > starts_on);\n\nALTER TABLE enrollments\n  ALTER COLUMN student_id SET NOT NULL,\n  ALTER COLUMN course_id SET NOT NULL,\n  ADD FOREIGN KEY (student_id) REFERENCES students (id),\n  ADD FOREIGN KEY (course_id) REFERENCES courses (id),\n  ADD CHECK (status IN ('active', 'completed', 'dropped')),\n  ADD CHECK (score BETWEEN 0 AND 100),\n  ADD UNIQUE (student_id, course_id);\n",
          checks: [
            { label: "Valid rows are accepted", accepts: "INSERT INTO students (email) VALUES ('ada@example.com'); INSERT INTO courses (code, title, price, starts_on, ends_on) VALUES ('BE-101', 'Backend Engineering', 120000, '2026-01-05', '2026-06-20'); INSERT INTO enrollments (student_id, course_id, status, score) VALUES (1, 1, 'active', NULL)" },
            { label: "A duplicate or missing email is refused", rejects: "INSERT INTO students (email) VALUES ('ada@example.com')", code: "23505" },
            { label: "A student without an email is refused", rejects: "INSERT INTO students (email) VALUES (NULL)", code: "23502" },
            { label: "A negative price is refused by courses_price_not_negative", rejects: "INSERT INTO courses (code, title, price) VALUES ('X-101', 'Free money', -1)", error: "courses_price_not_negative" },
            { label: "A course ending before it starts is refused", rejects: "INSERT INTO courses (code, title, price, starts_on, ends_on) VALUES ('X-102', 'Backwards', 0, '2026-06-01', '2026-05-01')", code: "23514" },
            { label: "An enrollment for a missing course is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status) VALUES (1, 42, 'active')", code: "23503" },
            { label: "An unknown status or a score of 101 is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status, score) VALUES (1, 1, 'paused', 101)", code: "23514" },
            { label: "Enrolling twice in the same course is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status) VALUES (1, 1, 'active')", code: "23505" },
          ],
          hint: "ALTER TABLE t ALTER COLUMN c SET NOT NULL, ADD UNIQUE (c), ADD CONSTRAINT name CHECK (…), ADD FOREIGN KEY (c) REFERENCES other (id) — several actions separated by commas.",
          successMessage: "Seven kinds of bad data, each refused with its own error code, whichever program sends it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 9.9 – 9.10 · FROM REQUIREMENTS TO A SCHEMA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l66-academy-schema",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.9", "9.10"],
    title: "Designing a Database from Business Requirements",
    subtitle: "The academy's schema, from sentences to tables",
    estimatedMinutes: 90,
    intro: "Requirements arrive as sentences, not tables. This lesson turns the academy's requirements into its full schema: the one the rest of the course builds on.",
    atoms: [
      {
        id: "a-be-requirements",
        title: "Designing from business requirements",
        explain:
          "A method: (1) underline the NOUNS in the requirements: candidates for entities (student, course, lesson, assessment, attempt, certificate) and attributes (title, score, pass mark); (2) underline the VERBS: relationships (a student enrolls in a course; a student attempts an assessment); (3) for each relationship ask 'how many on each side?' to get its cardinality; (4) turn every RULE into a constraint ('a student may attempt an assessment up to three times' → attempt_no BETWEEN 1 AND 3 plus UNIQUE); (5) normalize; (6) check the design against the questions the business will ask ('who passed every assessment of DB-101?'). Ask about the cases nobody mentioned: can a student re-enroll after dropping? Is a certificate ever revoked?",
        decision: decide({
          scenario: "Requirement: 'A student can attempt each assessment up to three times; their best score counts.' Someone proposes adding best_score, attempt_1, attempt_2 and attempt_3 columns to enrollments.",
          question: "What is the better design?",
          right: ["An assessment_attempts table: one row per attempt (assessment, enrollment, attempt_no 1 to 3, score), unique per (assessment, enrollment, attempt_no); the best score is MAX(score), computed when needed", "Repeating columns break 1NF; a stored best_score can disagree with the attempts."],
          wrong: [
            ["The proposal is fine: it is simpler", "Simpler today, but it breaks for each new assessment and for a fourth attempt."],
            ["Store the attempts as a comma-separated text column", "Not first normal form; impossible to query or constrain."],
            ["Keep only best_score and discard attempts", "Loses the history the requirement implies."],
          ],
          at: 0,
          aftermath: "If computing MAX(score) ever became slow, a stored best score could be added deliberately and kept in step by the database (a trigger) or the service, with that trade-off written down.",
        }),
      },
      {
        id: "a-be-academy-schema",
        title: "Exercise: the academy database",
        explain:
          "The requirements. Students register with a unique email and a name. Courses have a unique code, a title, a length in weeks (1 to 52) and a price in naira (0 or more). A student enrolls in a course once; an enrollment is active, completed or dropped. A course has lessons in a fixed order (position 1, 2, 3…, unique within the course); deleting a course deletes its lessons. A lesson can have assessments, each with a pass mark from 0 to 100. A student attempts an assessment through their enrollment, at most three times (attempt 1, 2, 3), each with a score from 0 to 100. A completed enrollment earns at most one certificate, with a unique certificate number.",
        sqlLab: {
          erd: true,
          task:
            "Write the academy schema for these requirements: tables students, courses, enrollments, lessons, assessments, assessment_attempts and certificates, with identity primary keys, foreign keys and every rule as a constraint. Use these column names: students(email, full_name); courses(code, title, weeks, price); enrollments(student_id, course_id, status); lessons(course_id, position, title); assessments(lesson_id, title, pass_mark); assessment_attempts(assessment_id, enrollment_id, attempt_no, score); certificates(enrollment_id, certificate_no).",
          starter: "",
          solution:
            "CREATE TABLE students (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email     text NOT NULL UNIQUE,\n  full_name text NOT NULL\n);\n\nCREATE TABLE courses (\n  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  code  text NOT NULL UNIQUE,\n  title text NOT NULL,\n  weeks integer NOT NULL CHECK (weeks BETWEEN 1 AND 52),\n  price integer NOT NULL CHECK (price >= 0)\n);\n\nCREATE TABLE enrollments (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  student_id integer NOT NULL REFERENCES students (id),\n  course_id  integer NOT NULL REFERENCES courses (id),\n  status     text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),\n  UNIQUE (student_id, course_id)\n);\n\nCREATE TABLE lessons (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  course_id integer NOT NULL REFERENCES courses (id) ON DELETE CASCADE,\n  position  integer NOT NULL CHECK (position > 0),\n  title     text NOT NULL,\n  UNIQUE (course_id, position)\n);\n\nCREATE TABLE assessments (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  lesson_id integer NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,\n  title     text NOT NULL,\n  pass_mark integer NOT NULL CHECK (pass_mark BETWEEN 0 AND 100)\n);\n\nCREATE TABLE assessment_attempts (\n  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  assessment_id integer NOT NULL REFERENCES assessments (id) ON DELETE CASCADE,\n  enrollment_id integer NOT NULL REFERENCES enrollments (id),\n  attempt_no    integer NOT NULL CHECK (attempt_no BETWEEN 1 AND 3),\n  score         integer NOT NULL CHECK (score BETWEEN 0 AND 100),\n  UNIQUE (assessment_id, enrollment_id, attempt_no)\n);\n\nCREATE TABLE certificates (\n  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  enrollment_id  integer NOT NULL UNIQUE REFERENCES enrollments (id),\n  certificate_no text NOT NULL UNIQUE\n);\n",
          checks: [
            {
              label: "A complete, valid academy is accepted",
              accepts:
                "INSERT INTO students (email, full_name) VALUES ('ada@example.com', 'Ada Obi'), ('bayo@example.com', 'Bayo Adeyemi');\nINSERT INTO courses (code, title, weeks, price) VALUES ('BE-101', 'Backend Engineering', 24, 120000), ('DB-101', 'Relational Databases', 16, 0);\nINSERT INTO enrollments (student_id, course_id, status) VALUES (1, 1, 'completed'), (2, 1, 'active');\nINSERT INTO lessons (course_id, position, title) VALUES (1, 1, 'HTTP'), (1, 2, 'Express'), (2, 1, 'SELECT');\nINSERT INTO assessments (lesson_id, title, pass_mark) VALUES (1, 'HTTP quiz', 70);\nINSERT INTO assessment_attempts (assessment_id, enrollment_id, attempt_no, score) VALUES (1, 1, 1, 55), (1, 1, 2, 82);\nINSERT INTO certificates (enrollment_id, certificate_no) VALUES (1, 'MST-2026-0001')",
            },
            { label: "Duplicate emails, course codes and enrollments are refused", rejects: "INSERT INTO enrollments (student_id, course_id) VALUES (1, 1)", code: "23505" },
            { label: "Weeks outside 1 to 52 or a negative price are refused", rejects: "INSERT INTO courses (code, title, weeks, price) VALUES ('XX-101', 'Forever', 53, 10)", code: "23514" },
            { label: "An unknown enrollment status is refused", rejects: "INSERT INTO enrollments (student_id, course_id, status) VALUES (2, 2, 'paused')", code: "23514" },
            { label: "Two lessons in the same position of a course are refused", rejects: "INSERT INTO lessons (course_id, position, title) VALUES (1, 2, 'Routing')", code: "23505" },
            { label: "A pass mark over 100 is refused", rejects: "INSERT INTO assessments (lesson_id, title, pass_mark) VALUES (2, 'Express quiz', 120)", code: "23514" },
            { label: "A fourth attempt is refused", rejects: "INSERT INTO assessment_attempts (assessment_id, enrollment_id, attempt_no, score) VALUES (1, 1, 4, 90)", code: "23514" },
            { label: "Repeating an attempt number is refused", rejects: "INSERT INTO assessment_attempts (assessment_id, enrollment_id, attempt_no, score) VALUES (1, 1, 2, 90)", code: "23505" },
            { label: "An attempt for a missing enrollment is refused", rejects: "INSERT INTO assessment_attempts (assessment_id, enrollment_id, attempt_no, score) VALUES (1, 99, 1, 90)", code: "23503" },
            { label: "A second certificate for an enrollment is refused", rejects: "INSERT INTO certificates (enrollment_id, certificate_no) VALUES (1, 'MST-2026-0002')", code: "23505" },
            { label: "Deleting a course with no enrollments deletes its lessons and assessments", accepts: "DELETE FROM courses WHERE code = 'DB-101'" },
            { label: "…and leaves no orphan lessons", assert: "SELECT count(*) = 2 FROM lessons" },
          ],
          hint: "Go entity by entity: each requirement sentence becomes a column type, a NOT NULL, a UNIQUE (sometimes on two or three columns), a CHECK, or a REFERENCES with the right ON DELETE.",
          successMessage: "Seven tables, and every requirement is a rule PostgreSQL enforces. Open the diagram: it is the academy's whole model. Week 11 builds the API on it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 9.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l67-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["9.P"],
    title: "Deliverable: An ER Diagram and Normalized Schema",
    subtitle: "The design document your team reviews",
    estimatedMinutes: 75,
    intro: "Before anyone writes migrations, the design is reviewed. The deliverable is the document a reviewer reads: the full ER diagram, and how the design meets each normal form.",
    atoms: [
      {
        id: "a-be-schema-doc",
        title: "The design document",
        explain:
          "A schema review document holds: the ER DIAGRAM (every entity, attribute, key and cardinality); a NORMALIZATION note (why each table is in 3NF, and any deliberate exception, such as a stored total, with its reason); the RULES and the constraint enforcing each; and OPEN QUESTIONS for the business. Keeping it as Markdown in the repository means it is reviewed in pull requests and stays next to the migrations that implement it.",
        nodeLab: {
          task:
            "Write SCHEMA.md for the academy schema of Lesson 66. It needs: a Mermaid erDiagram with all seven entities (STUDENT, COURSE, ENROLLMENT, LESSON, ASSESSMENT, ASSESSMENT_ATTEMPT, CERTIFICATE), each with an id PK and its foreign keys marked FK, and the six relationships with their cardinalities (enrollment–certificate is zero or one); a ## Normalization section mentioning 1NF, 2NF and 3NF; and a ## Constraints section naming at least the attempt limit and the one-certificate rule.",
          command: false,
          files: { "SCHEMA.md": "# Academy schema\n\n```mermaid\nerDiagram\n```\n\n## Normalization\n\n## Constraints\n" },
          open: "SCHEMA.md",
          solution: {
            "SCHEMA.md":
              "# Academy schema\n\n```mermaid\nerDiagram\n    STUDENT ||--o{ ENROLLMENT : makes\n    COURSE ||--o{ ENROLLMENT : has\n    COURSE ||--o{ LESSON : contains\n    LESSON ||--o{ ASSESSMENT : has\n    ASSESSMENT ||--o{ ASSESSMENT_ATTEMPT : receives\n    ENROLLMENT ||--o{ ASSESSMENT_ATTEMPT : makes\n    ENROLLMENT ||--o| CERTIFICATE : earns\n\n    STUDENT {\n        int id PK\n        text email UK\n        text full_name\n    }\n    COURSE {\n        int id PK\n        text code UK\n        text title\n        int weeks\n        int price\n    }\n    ENROLLMENT {\n        int id PK\n        int student_id FK\n        int course_id FK\n        text status\n    }\n    LESSON {\n        int id PK\n        int course_id FK\n        int position\n        text title\n    }\n    ASSESSMENT {\n        int id PK\n        int lesson_id FK\n        text title\n        int pass_mark\n    }\n    ASSESSMENT_ATTEMPT {\n        int id PK\n        int assessment_id FK\n        int enrollment_id FK\n        int attempt_no\n        int score\n    }\n    CERTIFICATE {\n        int id PK\n        int enrollment_id FK\n        text certificate_no UK\n    }\n```\n\n## Normalization\n\n- 1NF: every column holds one value; attempts are rows, not attempt_1/attempt_2 columns.\n- 2NF: every table has a single-column key, so no column depends on part of a key.\n- 3NF: no column depends on another non-key column; a course's title lives only in courses, and best scores are computed with MAX(score), not stored.\n\n## Constraints\n\n- Attempt limit: attempt_no BETWEEN 1 AND 3, and UNIQUE (assessment_id, enrollment_id, attempt_no).\n- One certificate per enrollment: certificates.enrollment_id is UNIQUE.\n- One enrollment per student and course: UNIQUE (student_id, course_id).\n- Lesson order: UNIQUE (course_id, position).\n- Ranges: weeks 1 to 52, price 0 or more, pass_mark and score 0 to 100, status in active/completed/dropped.\n",
          },
          tests: [
            { label: "All seven entities, each with id PK", check: `${PARSE_ERD("SCHEMA.md")} for (const e of ["STUDENT", "COURSE", "ENROLLMENT", "LESSON", "ASSESSMENT", "ASSESSMENT_ATTEMPT", "CERTIFICATE"]) { assert(entities[e], "the diagram has no " + e); assert(entities[e].some((a) => a.name === "id" && a.keys.includes("PK")), e + " needs int id PK"); }` },
            { label: "Foreign keys are marked", check: `${PARSE_ERD("SCHEMA.md")} const fk = (e, n) => (entities[e] || []).some((a) => a.name === n && a.keys.includes("FK")); for (const [e, n] of [["ENROLLMENT", "student_id"], ["ENROLLMENT", "course_id"], ["LESSON", "course_id"], ["ASSESSMENT", "lesson_id"], ["ASSESSMENT_ATTEMPT", "assessment_id"], ["ASSESSMENT_ATTEMPT", "enrollment_id"], ["CERTIFICATE", "enrollment_id"]]) assert(fk(e, n), e + "." + n + " should be marked FK");` },
            { label: "The relationships and their cardinalities", check: `${PARSE_ERD("SCHEMA.md")} for (const [a, b, want] of [["STUDENT", "ENROLLMENT", "o{"], ["COURSE", "ENROLLMENT", "o{"], ["COURSE", "LESSON", "o{"], ["LESSON", "ASSESSMENT", "o{"], ["ASSESSMENT", "ASSESSMENT_ATTEMPT", "o{"], ["ENROLLMENT", "ASSESSMENT_ATTEMPT", "o{"], ["ENROLLMENT", "CERTIFICATE", "o|"]]) { const r = rel(a, b); assert(r, "connect " + a + " and " + b); eq([r.left, r.right], ["||", want], a + " ||--" + want + " " + b); }` },
            { label: "## Normalization and ## Constraints sections", check: `const t = file("SCHEMA.md"); const n = section(t, "Normalization") || ""; for (const nf of ["1NF", "2NF", "3NF"]) has(n, nf, "the Normalization section should explain " + nf); const c = section(t, "Constraints") || ""; assert(/attempt/i.test(c) && /3|three/i.test(c), "the Constraints section should describe the three-attempt limit"); assert(/certificate/i.test(c) && /unique|one/i.test(c), "the Constraints section should describe the one-certificate rule");` },
          ],
          hint: "Start from Lesson 63's diagram and add ASSESSMENT and ASSESSMENT_ATTEMPT. An attempt belongs to an assessment and to an enrollment: two ||--o{ lines.",
          successMessage: "A design a reviewer can approve without opening a SQL file. Week 10 fills this schema with realistic data and starts asking it questions.",
        },
      },
    ],
    task: {
      title: "Week 9 deliverable: an ER diagram and a normalized database schema",
      intro: "Produce the academy's design documents in your repository.",
      prompts: [
        "Commit SCHEMA.md (diagram, normalization notes, constraints) and schema.sql (Lesson 66's tables) to your course-api repository.",
        "Open SCHEMA.md on GitHub and check that the diagram renders.",
        "Ask someone to review it: give them the requirements from Lesson 66 and ask them to find a requirement the schema does not enforce.",
        "Add an ## Open questions section with at least two cases the requirements do not answer (re-enrolling after dropping; revoking a certificate).",
        "Checkpoint: your academy schema is in third normal form and its constraints reject every invalid row a reviewer tries to insert.",
      ],
      closing: "Next: Week 10, SQL and PostgreSQL: install PostgreSQL and query the academy.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
