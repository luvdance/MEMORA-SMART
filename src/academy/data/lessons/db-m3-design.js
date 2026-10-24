/**
 * RELATIONAL DATABASES · WEEK 3 · ENTITIES, RELATIONSHIPS, KEYS AND ERDS
 *
 * Curriculum 3.1 – 3.P. Entities and attributes, strong and dependent
 * entities, one-to-one, one-to-many and many-to-many relationships,
 * participation and optionality, business rules, superkeys, candidate,
 * primary, foreign and composite keys, natural and surrogate keys, ERD
 * notation, and turning requirements into an ERD and an ERD into tables.
 *
 * Design is practised by building: every schema lab draws the learner's
 * tables as an ERD read from PostgreSQL's own catalog, so the diagram can
 * only show relationships the database really enforces.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY, HAS, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s3-design";
const MODULE = "db-m3-design";

const STUDENTS_COURSES = `CREATE TABLE students (
  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  email     text NOT NULL UNIQUE
);
CREATE TABLE courses (
  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code  text NOT NULL UNIQUE,
  title text NOT NULL
);
INSERT INTO students (full_name, email) VALUES
  ('Ada Obi', 'ada@example.com'), ('Bayo Adeyemi', 'bayo@example.com'), ('Chiamaka Eze', 'chiamaka@example.com');
INSERT INTO courses (code, title) VALUES
  ('DA-101', 'Data Analysis'), ('DB-101', 'Relational Databases');`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 3.1 – 3.4 · ENTITIES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l13-entities",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3", "3.4"],
    title: "Identifying Entities",
    subtitle: "Entities, attributes, strong and dependent entities",
    estimatedMinutes: 35,
    intro:
      "Design happens before SQL. A database that models the wrong things is wrong forever, however good its queries. This week you learn to see the things, the facts about them, and the links between them.",
    atoms: [
      {
        id: "a-db-entity",
        title: "What an entity represents",
        explain:
          "An ENTITY is a kind of thing, person, place, event or concept that the organisation needs to keep facts about, and that can be told apart from others of its kind: a student, a course, a payment, a hospital ward. In a design, the entity TYPE (Student) becomes a table, and each entity INSTANCE (Ada Obi) becomes a row. A useful test: if the business needs to store several facts about it, and there can be many of them, each identifiable, it is probably an entity. Entity names are singular nouns in a diagram (Student) and usually plural in table names (students).",
        decision: decide({
          scenario: "A logistics company's brief says: 'Riders deliver parcels to customers. Each parcel has a weight and a delivery fee. We need to know which rider delivered which parcel, and when.'",
          question: "Which list contains only entities?",
          right: ["Rider, Parcel, Customer, Delivery", "Each is something with several facts and many instances. 'Delivery' is the event linking a rider and a parcel at a time."],
          wrong: [
            ["Rider, Weight, Fee, When", "Weight, fee and time are facts ABOUT parcels and deliveries: attributes."],
            ["Company, Brief, Parcel", "The company and the brief are not things the system stores many of."],
            ["Deliver, Know, Store", "Verbs describe relationships or actions, not entities."],
          ],
          at: 0,
          aftermath: "Nouns in a brief suggest entities; verbs suggest relationships; adjectives and measurements suggest attributes.",
        }),
      },
      {
        id: "a-db-entity-vs-attribute",
        title: "Entities versus attributes",
        explain:
          "An ATTRIBUTE is a single fact about an entity: a student's email, a course's price. The same word can be either, depending on the business. If all you need is a city's NAME, city is an attribute of Student. If you need facts ABOUT cities (their state, their delivery fee, their branch manager) and many students share each city, City becomes an entity with its own table, and students refer to it. The question is always: do we only record it, or do we record things about it?",
        table: {
          caption: "The same word, two designs.",
          headers: ["Requirement", "City is…", "Design"],
          rows: [
            ["'Store each student's city'", "an attribute", "students.city text"],
            ["'Each city has a delivery fee and a branch'", "an entity", "cities (id, name, delivery_fee, branch_id); students.city_id"],
          ],
        },
        decision: decide({
          scenario: "A school records each teacher's department. Departments have a name, a head of department (a teacher), a budget and a room.",
          question: "How should department be modelled?",
          right: ["As an entity (a departments table) that teachers refer to", "It has facts of its own (head, budget, room), shared by many teachers."],
          wrong: [
            ["As a text attribute of teachers", "Then the budget and head would be repeated on every teacher's row."],
            ["As four attributes of teachers: department, head, budget, room", "Every teacher in a department would repeat the same three facts."],
            ["Not at all; departments are not people", "Entities are any things the organisation keeps facts about."],
          ],
          at: 2,
          aftermath: "When you find yourself repeating a group of facts on many rows, you have found an entity hiding inside another.",
        }),
      },
      {
        id: "a-db-strong-dependent",
        title: "Strong and dependent entities",
        explain:
          "A STRONG (independent) entity exists on its own and has its own identifier: a student, a course, a product. A DEPENDENT (weak) entity only exists as part of another, and is often identified with the help of its owner: a lesson is 'lesson 3 of DB-101', an order line is 'line 2 of order 1001', a hotel room is 'room 12 of a particular hotel'. Delete the owner and the dependent has no meaning. In tables, a dependent entity carries its owner's key, which is often part of its own key, and is usually deleted with its owner.",
        sqlLab: {
          setup: STUDENTS_COURSES,
          erd: true,
          task:
            "Lessons depend on courses: a lesson is 'lesson number 3 of a course'. Create a table lessons with course_id (integer, required, referencing courses), position (integer, required), and title (text, required), whose primary key is the pair (course_id, position).",
          starter: "CREATE TABLE lessons (\n  \n);\n",
          solution: "CREATE TABLE lessons (\n  course_id integer NOT NULL REFERENCES courses (id),\n  position  integer NOT NULL,\n  title     text NOT NULL,\n  PRIMARY KEY (course_id, position)\n);\n",
          checks: [
            { label: "lessons.course_id refers to courses", assert: HAS.fk("lessons", "courses", "course_id") },
            { label: "The primary key is (course_id, position)", assert: HAS.pk("lessons", ["course_id", "position"]) },
            { label: "A course cannot have two lesson 1s", rejects: "INSERT INTO lessons VALUES (1, 1, 'Intro'), (1, 1, 'Intro again')", code: "23505" },
            { label: "A lesson cannot belong to a course that does not exist", rejects: "INSERT INTO lessons VALUES (99, 1, 'Orphan')", code: "23503" },
          ],
          hint: "PRIMARY KEY (course_id, position) goes on its own line after the columns. REFERENCES courses (id) makes course_id a foreign key.",
          successMessage: "Look at the ERD: lessons hangs off courses, and its key includes the course. That is a dependent entity.",
        },
      },
      {
        id: "a-db-identify-domains",
        title: "Identifying entities in a school, a shop, a hospital and a job platform",
        explain:
          "Practise on familiar systems. SCHOOL: Student, Teacher, Class, Subject, Term, Enrollment (a student in a class for a term), Result. SHOP: Customer, Product, Category, Order, OrderLine, Payment, Delivery. HOSPITAL: Patient, Doctor, Ward, Bed, Appointment, Admission, Prescription, Drug. JOB PLATFORM: Employer, JobPost, Applicant, Application (an applicant applying to a post), Interview, Offer. Notice that each system has a few independent things and several EVENTS that connect them; the events are where most of the data, and most of the value, lives.",
        decision: decide({
          scenario: "A job platform must record: employers, the jobs they post, applicants, and every application (one applicant applying to one job on a date, with a status).",
          question: "Which is an event entity that connects two others?",
          right: ["Application, connecting an Applicant to a JobPost", "It has its own facts (date, status) and links two independent entities."],
          wrong: [
            ["Employer", "An employer is an independent entity."],
            ["Status", "Status is an attribute of an application."],
            ["Date", "A date is an attribute."],
          ],
          at: 1,
          aftermath: "In Lesson 14 you will see that events like Application are exactly how many-to-many relationships are stored.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 3.5 – 3.9 · RELATIONSHIPS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l14-relationships",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.5", "3.6", "3.7", "3.8", "3.9"],
    title: "Relationships",
    subtitle: "One-to-one, one-to-many, many-to-many, and who must take part",
    estimatedMinutes: 45,
    intro:
      "Entities are only half a model. How they relate (how many of one go with one of the other, and whether they must) is what the business rules are really about.",
    atoms: [
      {
        id: "a-db-one-to-many",
        title: "One-to-many relationships",
        explain:
          "The commonest relationship: ONE course has MANY lessons; ONE customer places MANY orders; each lesson or order belongs to exactly one. It is stored by putting a FOREIGN KEY on the MANY side, pointing at the one: orders.customer_id references customers.id. Never the other way round: a customer row cannot hold a list of order ids. Read it in both directions to check: 'a customer places zero or more orders' and 'an order is placed by exactly one customer'.",
        sqlLab: {
          setup: STUDENTS_COURSES,
          erd: true,
          task:
            "Each payment is made by exactly one student, and a student can make many payments. Create payments with: id (auto-numbered primary key), student_id (required, referencing students), amount (numeric(10,2), required) and paid_on (date, required).",
          starter: "CREATE TABLE payments (\n  \n);\n",
          solution: "CREATE TABLE payments (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  student_id integer NOT NULL REFERENCES students (id),\n  amount     numeric(10,2) NOT NULL,\n  paid_on    date NOT NULL\n);\n",
          checks: [
            { label: "payments.student_id refers to students", assert: HAS.fk("payments", "students", "student_id") },
            { label: "Every payment must have a student", assert: HAS.notNull("payments", "student_id") },
            { label: "One student can make several payments", accepts: "INSERT INTO payments (student_id, amount, paid_on) VALUES (1, 30000, '2026-01-10'), (1, 30000, '2026-02-10')" },
            { label: "A payment for a student who does not exist is refused", rejects: "INSERT INTO payments (student_id, amount, paid_on) VALUES (42, 1000, '2026-01-10')", code: "23503" },
          ],
          hint: "The foreign key goes on the MANY side: student_id integer NOT NULL REFERENCES students (id).",
          successMessage: "The ERD shows students on the left, payments on the right, with || (exactly one student) and o< (zero or many payments).",
        },
      },
      {
        id: "a-db-one-to-one",
        title: "One-to-one relationships",
        explain:
          "In a ONE-TO-ONE relationship each row on one side matches at most one row on the other: a student has at most one profile; an enrollment earns at most one certificate. It is stored like one-to-many plus a UNIQUE constraint on the foreign key, so no second row can point at the same parent. Use one-to-one when the second part is optional, large, rarely read, or more sensitive (a separate table can have stricter permissions); otherwise the columns usually belong in the same table.",
        sqlLab: {
          setup: STUDENTS_COURSES,
          erd: true,
          task:
            "Each student may have at most one profile. Create student_profiles with: student_id (required, referencing students, and unique), bio (text) and linkedin_url (text).",
          starter: "CREATE TABLE student_profiles (\n  \n);\n",
          solution: "CREATE TABLE student_profiles (\n  student_id   integer NOT NULL UNIQUE REFERENCES students (id),\n  bio          text,\n  linkedin_url text\n);\n",
          checks: [
            { label: "student_profiles.student_id refers to students", assert: HAS.fk("student_profiles", "students", "student_id") },
            { label: "A student cannot have two profiles", rejects: "INSERT INTO student_profiles (student_id, bio) VALUES (1, 'One'), (1, 'Two')", code: "23505" },
            { label: "Different students can each have a profile", accepts: "INSERT INTO student_profiles (student_id, bio) VALUES (1, 'Ada'), (2, 'Bayo')" },
          ],
          hint: "A foreign key that is also UNIQUE makes the relationship one-to-one. (Making student_id the primary key works too.)",
          successMessage: "The ERD now shows o| at the profiles end: zero or one profile per student.",
        },
      },
      {
        id: "a-db-many-to-many",
        title: "Many-to-many relationships",
        explain:
          "A student takes MANY courses and a course has MANY students. Neither table can hold the other's key, because one row would need many values. The answer is a JUNCTION table (also called a bridge, link or associative table) with one row per PAIR: enrollments(student_id, course_id). Each side becomes an ordinary one-to-many with the junction table. Usually the pair is unique (a student enrolls in a course once), and the junction table often carries facts about the pairing itself: the date enrolled, the status, the score. That is why it is so often a real entity, Enrollment.",
        sqlLab: {
          setup: STUDENTS_COURSES,
          erd: true,
          task:
            "Model 'students enroll in courses' with a junction table enrollments: student_id and course_id (both required foreign keys), enrolled_on (date, required, default today), with the pair (student_id, course_id) as the primary key.",
          starter: "CREATE TABLE enrollments (\n  \n);\n",
          solution: "CREATE TABLE enrollments (\n  student_id  integer NOT NULL REFERENCES students (id),\n  course_id   integer NOT NULL REFERENCES courses (id),\n  enrolled_on date NOT NULL DEFAULT current_date,\n  PRIMARY KEY (student_id, course_id)\n);\n",
          checks: [
            { label: "enrollments refers to students", assert: HAS.fk("enrollments", "students", "student_id") },
            { label: "enrollments refers to courses", assert: HAS.fk("enrollments", "courses", "course_id") },
            { label: "The key is the pair (student_id, course_id)", assert: HAS.pk("enrollments", ["student_id", "course_id"]) },
            { label: "One student in two courses, and two students in one course, are both fine", accepts: "INSERT INTO enrollments (student_id, course_id) VALUES (1, 1), (1, 2), (2, 1)" },
            { label: "The same student cannot enroll in the same course twice", rejects: "INSERT INTO enrollments (student_id, course_id) VALUES (3, 2), (3, 2)", code: "23505" },
          ],
          hint: "Two REFERENCES columns and a composite PRIMARY KEY (student_id, course_id).",
          successMessage: "The ERD shows students and courses both pointing into enrollments: two one-to-manys make one many-to-many.",
        },
      },
      {
        id: "a-db-participation",
        title: "Participation and optionality",
        explain:
          "PARTICIPATION says whether an entity MUST take part in a relationship. Mandatory: every order must have a customer, so orders.customer_id is NOT NULL. Optional: a student MAY have a mentor (another person), so students.mentor_id allows NULL. The other direction is about the parent: a customer may have no orders yet (optional), but if the business says 'a course must have at least one lesson', no simple constraint can enforce it; it becomes a rule for the application or a check run before publishing. In an ERD, a circle (o) marks optional and a bar (|) mandatory.",
        sqlLab: {
          setup: STUDENTS_COURSES,
          erd: true,
          task:
            "Add a table mentors (id auto-numbered primary key, full_name required). Then add to students an OPTIONAL mentor: a column mentor_id that refers to mentors and may be empty. Use ALTER TABLE students ADD COLUMN for the second part.",
          starter: "CREATE TABLE mentors (\n  \n);\n\nALTER TABLE students ADD COLUMN ...;\n",
          solution: "CREATE TABLE mentors (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name text NOT NULL\n);\n\nALTER TABLE students ADD COLUMN mentor_id integer REFERENCES mentors (id);\n",
          checks: [
            { label: "students.mentor_id refers to mentors", assert: HAS.fk("students", "mentors", "mentor_id") },
            { label: "A student may have no mentor", assert: HAS.nullable("students", "mentor_id") },
            { label: "Existing students keep working without a mentor", accepts: "INSERT INTO students (full_name, email) VALUES ('Dayo Bello', 'dayo@example.com')" },
            { label: "A mentor that does not exist is refused", rejects: "UPDATE students SET mentor_id = 77 WHERE id = 1", code: "23503" },
          ],
          hint: "ALTER TABLE students ADD COLUMN mentor_id integer REFERENCES mentors (id); — no NOT NULL, so it is optional.",
          successMessage: "The ERD marks the mentor end with o|: zero or one mentor. Optional participation is a nullable foreign key.",
        },
      },
      {
        id: "a-db-business-rules",
        title: "How business rules determine relationships",
        explain:
          "The same two entities can relate differently in different businesses, and the RULES decide. 'A course is taught by one instructor' is one-to-many (instructor_id on courses). 'Courses are co-taught' makes it many-to-many (a course_instructors table). 'Each department has exactly one head' is one-to-one between departments and teachers. So never guess: ask the business, write the rule down as a sentence in both directions, and design from the sentences. When a rule changes later (co-teaching starts), the relationship changes, which is why written rules are worth keeping.",
        decision: decide({
          scenario: "A clinic's rule today: 'each patient is registered with one doctor'. The manager adds: 'but patients often see several doctors, and we need every doctor who has treated them.'",
          question: "What does the full rule require?",
          right: ["A one-to-many (patient's registered doctor) AND a many-to-many through an event table such as consultations(patient_id, doctor_id, date)", "Two different relationships between the same entities, each from its own rule."],
          wrong: [
            ["Only patients.doctor_id", "That records one doctor, not everyone who treated them."],
            ["A column doctors_seen holding a list of names", "Lists in a column break First Normal Form (Week 4)."],
            ["Merge patients and doctors into one table", "They are different entities with different facts."],
          ],
          at: 3,
          aftermath: "Two entities can have more than one relationship. Name each one after its rule.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 3.10 – 3.15 · KEYS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l15-keys",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.10", "3.11", "3.12", "3.13", "3.14", "3.15"],
    title: "Keys",
    subtitle: "Superkeys, candidate, primary, foreign, composite, natural and surrogate keys",
    estimatedMinutes: 45,
    intro:
      "Keys are how a relational database knows which row is which, and how one row points at another. Get them right and everything else follows.",
    atoms: [
      {
        id: "a-db-superkeys-candidates",
        title: "Superkeys and candidate keys",
        explain:
          "A SUPERKEY is any set of columns whose values are different for every row: for students, {id}, {email}, {id, email} and {email, full_name} are all superkeys. A CANDIDATE KEY is a MINIMAL superkey: remove any column and it stops being unique. {id} and {email} are candidate keys; {email, full_name} is not, because email alone is already unique. Candidate keys are found from the business rules ('no two students share an email'), not from today's data: the current rows might happen to have unique names, but names are not unique in principle.",
        decision: decide({
          scenario: "An exam board records results with columns candidate_number, subject_code, exam_year, score. A candidate sits each subject once per year, and candidate numbers are unique.",
          question: "Which is a candidate key of the results table?",
          right: ["{candidate_number, subject_code, exam_year}", "That combination identifies exactly one result, and no column can be dropped."],
          wrong: [
            ["{candidate_number}", "A candidate has many results, so it is not unique on its own."],
            ["{candidate_number, subject_code, exam_year, score}", "Unique, but not minimal: score is unnecessary. It is a superkey."],
            ["{score}", "Many results share a score."],
          ],
          at: 0,
          aftermath: "One of the candidate keys is chosen as the primary key; the others become UNIQUE constraints.",
        }),
      },
      {
        id: "a-db-primary-key",
        title: "Primary keys",
        explain:
          "The PRIMARY KEY is the candidate key chosen to identify rows. PostgreSQL enforces two things on it: values must be UNIQUE and NOT NULL, and it creates an index so lookups by key are fast. Every table should have one. A good primary key is unique, never empty, and STABLE (it never changes, because other tables store it). Declare it inline (id integer PRIMARY KEY) or as a table constraint (PRIMARY KEY (a, b)) for several columns.",
        sqlLab: {
          task:
            "Create a table branches with: code (text, the primary key, e.g. 'LOS'), name (text, required), and city (text, required). The code is the branch's permanent identifier.",
          starter: "CREATE TABLE branches (\n  \n);\n",
          solution: "CREATE TABLE branches (\n  code text PRIMARY KEY,\n  name text NOT NULL,\n  city text NOT NULL\n);\n",
          checks: [
            { label: "code is the primary key", assert: HAS.pk("branches", ["code"]) },
            { label: "Two branches cannot share a code", rejects: "INSERT INTO branches VALUES ('LOS', 'Lagos Island', 'Lagos'), ('LOS', 'Lekki', 'Lagos')", code: "23505" },
            { label: "A branch must have a code", rejects: "INSERT INTO branches (name, city) VALUES ('No Code', 'Abuja')", code: "23502" },
          ],
          hint: "code text PRIMARY KEY — a primary key is automatically NOT NULL and unique.",
          successMessage: "PRIMARY KEY gave you uniqueness, NOT NULL and an index in two words.",
        },
      },
      {
        id: "a-db-foreign-key",
        title: "Foreign keys",
        explain:
          "A FOREIGN KEY is a column (or columns) whose values must match a key in another table: enrollments.student_id REFERENCES students (id). PostgreSQL then refuses any value that points at nothing, and refuses to delete a student while enrollments still point at them (Week 4 shows how to change that). This is REFERENTIAL INTEGRITY: every reference leads somewhere real. The referenced column must be a primary key or unique. A foreign key may be NULL unless you add NOT NULL, which is how optional relationships work.",
        sqlDemo: {
          setup: ACADEMY,
          caption: "The academy's enrollments refer to students. Watch PostgreSQL refuse an enrollment for student 999, then refuse to delete a student who has enrollments.",
          code: "INSERT INTO enrollments (student_id, course_id, enrolled_on, status)\nVALUES (999, 1, '2026-06-01', 'active');",
          expectError: "violates foreign key constraint",
        },
        sqlLab: {
          setup: ACADEMY,
          task:
            "Ada Obi (student 1) has enrollments. Try to delete her with DELETE FROM students WHERE id = 1; Run it and read PostgreSQL's DETAIL. Then replace it with a query that shows WHY: every enrollment whose student_id is 1 (all columns).",
          starter: "DELETE FROM students WHERE id = 1;\n",
          solution: "SELECT *\nFROM enrollments\nWHERE student_id = 1;\n",
          checks: [
            { label: "Returns Ada's enrollments", result: true },
            { label: "Ada is still in the database", assert: "SELECT EXISTS (SELECT 1 FROM students WHERE id = 1)" },
          ],
          hint: "SELECT * FROM enrollments WHERE student_id = 1; — those are the rows that still refer to her.",
          successMessage: "Those two enrollments are why the database protects her row. Deleting her would leave them pointing at nothing.",
        },
      },
      {
        id: "a-db-composite-key",
        title: "Composite keys",
        explain:
          "A COMPOSITE KEY uses more than one column because no single column is unique: in lesson_completions, a student completes many lessons and a lesson is completed by many students, but the PAIR (student_id, lesson_id) happens once. Composite primary keys are natural for junction tables and dependent entities. A foreign key that points at a composite key must itself be composite: FOREIGN KEY (course_id, position) REFERENCES lessons (course_id, position).",
        sqlLab: {
          setup: STUDENTS_COURSES + "\nCREATE TABLE lessons (\n  course_id integer NOT NULL REFERENCES courses (id),\n  position  integer NOT NULL,\n  title     text NOT NULL,\n  PRIMARY KEY (course_id, position)\n);\nINSERT INTO lessons VALUES (1, 1, 'What data is'), (1, 2, 'Cleaning data'), (2, 1, 'Tables and keys');",
          erd: true,
          task:
            "lessons has the composite key (course_id, position). Create lesson_completions recording that a student completed a lesson on a date: student_id (references students), course_id and position (together referencing lessons), completed_on (date, required). Its primary key: (student_id, course_id, position).",
          starter: "CREATE TABLE lesson_completions (\n  \n);\n",
          solution: "CREATE TABLE lesson_completions (\n  student_id   integer NOT NULL REFERENCES students (id),\n  course_id    integer NOT NULL,\n  position     integer NOT NULL,\n  completed_on date NOT NULL,\n  PRIMARY KEY (student_id, course_id, position),\n  FOREIGN KEY (course_id, position) REFERENCES lessons (course_id, position)\n);\n",
          checks: [
            { label: "It refers to students", assert: HAS.fk("lesson_completions", "students", "student_id") },
            { label: "(course_id, position) refers to lessons", assert: HAS.fk("lesson_completions", "lessons", "position") },
            { label: "The primary key is (student_id, course_id, position)", assert: HAS.pk("lesson_completions", ["student_id", "course_id", "position"]) },
            { label: "A completion of a lesson that does not exist is refused", rejects: "INSERT INTO lesson_completions VALUES (1, 2, 9, '2026-03-01')", code: "23503" },
          ],
          hint: "A composite foreign key is a table constraint: FOREIGN KEY (course_id, position) REFERENCES lessons (course_id, position).",
          successMessage: "A three-column key and a two-column foreign key. Composite keys are exact, but they spread: this is one reason surrogate keys exist.",
        },
      },
      {
        id: "a-db-natural-surrogate",
        title: "Natural keys versus surrogate keys",
        explain:
          "A NATURAL KEY comes from the real world: an email, a course code, a NIN, an ISBN. A SURROGATE KEY is a value the database invents with no meaning: an identity integer or a UUID. Natural keys are meaningful and avoid an extra column, but they can change, can be shared or missing, and can be long. Surrogates are small, stable and always unique, but mean nothing to a person. Common practice: give each table a surrogate primary key (id), and protect the natural candidate key with a UNIQUE constraint, so you get stability AND the business rule.",
        sqlLab: {
          task:
            "Create products the recommended way: id as an auto-numbered surrogate primary key, sku (text, required) protected as unique because it is the natural key, name (text, required), and unit_price (numeric(10,2), required).",
          starter: "CREATE TABLE products (\n  \n);\n",
          solution: "CREATE TABLE products (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  sku        text NOT NULL UNIQUE,\n  name       text NOT NULL,\n  unit_price numeric(10,2) NOT NULL\n);\n",
          checks: [
            { label: "id is the primary key", assert: HAS.pk("products", ["id"]) },
            { label: "sku is unique", assert: HAS.unique("products", ["sku"]) },
            { label: "Two products cannot share a SKU", rejects: "INSERT INTO products (sku, name, unit_price) VALUES ('BAG-001', 'Tote', 8500), ('BAG-001', 'Other tote', 9000)", code: "23505" },
            { label: "ids are generated", accepts: "INSERT INTO products (sku, name, unit_price) VALUES ('SHE-001', 'Shea butter', 3000)" },
          ],
          hint: "id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, then sku text NOT NULL UNIQUE.",
          successMessage: "Stable surrogate for the database, enforced natural key for the business.",
        },
      },
      {
        id: "a-db-bad-keys",
        title: "Why names and phone numbers make poor primary keys",
        explain:
          "A primary key is copied into every table that refers to the row. If it CHANGES, every copy must change too; if it is not truly UNIQUE, two people collide; if it can be MISSING, a row cannot be stored. Names fail all three: two Ada Obis exist, and people change names. Phone numbers change, are shared by families, are recycled by networks, and are sometimes unknown. Emails change too. Even a 'unique' national ID may be unknown at registration. Keep such values as attributes, perhaps UNIQUE, and key the row on a surrogate.",
        decision: decide({
          scenario: "A loyalty programme keys customers by phone number. A customer changes networks and gets a new number; her 2,000 past purchases reference the old number in orders, receipts and points tables.",
          question: "What is the root cause of the trouble?",
          right: ["A changeable real-world value was used as the primary key, so a change must ripple through every referencing table", "A surrogate id would let her phone change in one place."],
          wrong: [
            ["She should not have changed networks", "Real-world values change; designs must allow it."],
            ["Phone numbers are too long to be keys", "Length is not the main problem; stability is."],
            ["Foreign keys should be removed", "Removing integrity would make things worse."],
          ],
          at: 2,
          aftermath: "Stable, meaningless keys are boring, and boring is exactly what a key should be.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 3.16 – 3.19 · ENTITY-RELATIONSHIP DIAGRAMS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l16-erd",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.16", "3.17", "3.18", "3.19"],
    title: "Entity-Relationship Diagrams",
    subtitle: "Reading, drawing and implementing ERDs",
    estimatedMinutes: 45,
    intro:
      "An ERD is a design you can argue about before it costs anything. Teams draw one, check it against the business rules, and only then write CREATE TABLE.",
    atoms: [
      {
        id: "a-db-erd-notation",
        title: "ERD notation: entities, attributes and relationships",
        explain:
          "In an ERD each ENTITY is a box titled with its name; its ATTRIBUTES are listed inside, with the primary key marked (PK, often underlined) and foreign keys marked FK. RELATIONSHIPS are lines between boxes. This course uses CROW'S FOOT notation, the most common in industry: the line's ends say how many. Other notations exist (Chen's diamonds and ovals in textbooks, UML class diagrams), but they express the same ideas. Tools such as dbdiagram.io, draw.io, pgAdmin's ERD tool and MySQL Workbench draw them. The diagram below is drawn by PostgreSQL's own catalog for the academy database.",
        sqlDemo: {
          setup: ACADEMY,
          erd: true,
          caption: "The academy's tables, keys and relationships, drawn from the database itself.",
          code: "SELECT table_name, count(*) AS columns\nFROM information_schema.columns\nWHERE table_schema = 'public'\nGROUP BY table_name\nORDER BY table_name;",
        },
        decision: decide({
          scenario: "In the academy ERD, the certificates box lists enrollment_id marked FK, and it is also UNIQUE.",
          question: "What does that tell you?",
          right: ["Each certificate belongs to one enrollment, and an enrollment can have at most one certificate", "A unique foreign key is a one-to-one relationship."],
          wrong: [
            ["A certificate can cover many enrollments", "The FK holds one enrollment per certificate."],
            ["Each enrollment must have a certificate", "Nothing forces an enrollment to have one: most do not."],
            ["certificates is the parent of enrollments", "The table holding the FK is the child."],
          ],
          at: 1,
          aftermath: "Read every line twice, once from each end. That is how you check a diagram against the rules.",
        }),
      },
      {
        id: "a-db-cardinality-optionality",
        title: "Cardinality and optionality",
        explain:
          "Each end of a crow's-foot line has two marks. The inner mark is the MAXIMUM (cardinality): a bar | means one, a crow's foot < means many. The outer mark is the MINIMUM (optionality): a bar | means at least one (mandatory), a circle o means zero (optional). So || is 'exactly one', o| 'zero or one', |< 'one or many' and o< 'zero or many'. 'A customer places zero or many orders; an order is placed by exactly one customer' is drawn with || at the customer end and o< at the order end. A NOT NULL foreign key is what makes the parent end ||; a nullable one makes it o|.",
        table: {
          caption: "Crow's-foot ends.",
          headers: ["Mark", "Reads as", "Typical implementation"],
          rows: [
            ["||", "exactly one", "foreign key NOT NULL (seen from the child)"],
            ["o|", "zero or one", "nullable foreign key, or UNIQUE foreign key on the child"],
            ["o<", "zero or many", "the child side of an ordinary foreign key"],
            ["|<", "one or many", "a business rule the application must enforce"],
          ],
        },
        decision: decide({
          scenario: "A rule says: 'every delivery is made by exactly one rider; a rider may have made no deliveries yet'.",
          question: "Which ends belong on the rider–delivery line?",
          right: ["|| at the rider end, o< at the delivery end", "Each delivery has exactly one rider; each rider has zero or many deliveries."],
          wrong: [
            ["o| at the rider end, o< at the delivery end", "o| would mean a delivery might have no rider."],
            ["|| at both ends", "That is one-to-one, mandatory both ways."],
            ["o< at the rider end, || at the delivery end", "That reverses the relationship."],
          ],
          at: 0,
          aftermath: "In SQL: deliveries.rider_id integer NOT NULL REFERENCES riders (id).",
        }),
      },
      {
        id: "a-db-requirements-to-erd",
        title: "Converting requirements into an ERD",
        explain:
          "A dependable method. (1) Underline the NOUNS in the requirements: candidate entities. (2) Strike out those that are only facts about another: those become attributes. (3) For each pair of entities that the requirements connect, write the rule as two sentences ('a teacher teaches zero or many classes'; 'a class is taught by exactly one teacher') and decide the cardinality and optionality. (4) Replace each many-to-many with a junction entity, and give it the facts that belong to the pairing. (5) Choose keys. (6) Check the diagram against every requirement, aloud, with the people who wrote them.",
        decision: decide({
          scenario: "Requirements: 'Members borrow books. Each loan records the date borrowed and the date returned. A member may have several books at once; a book copy can be out with only one member at a time.'",
          question: "Which ERD is right?",
          right: ["Member ||—o< Loan >o—|| BookCopy, with borrowed_on and returned_on on Loan", "Loan is the event; over time a member has many loans and a copy has many loans."],
          wrong: [
            ["Member ||—o< BookCopy, with the dates on BookCopy", "Then a copy's loan history is lost each time it is borrowed again."],
            ["Member >o—o< BookCopy with no Loan entity", "A many-to-many needs a junction, and the dates must live somewhere."],
            ["One Library entity with every fact", "That is the flat spreadsheet again."],
          ],
          at: 2,
          aftermath: "'Only one member at a time' is a rule about loans that are not yet returned; it can be enforced later with a partial unique index (Week 12).",
        }),
      },
      {
        id: "a-db-erd-to-tables",
        title: "Translating an ERD into tables",
        explain:
          "The translation is mechanical once the ERD is right. Each entity becomes a TABLE; its attributes become COLUMNS with types; its identifier becomes the PRIMARY KEY. Each one-to-many becomes a FOREIGN KEY on the many side (NOT NULL if the parent is mandatory). Each one-to-one becomes a UNIQUE foreign key on the dependent side. Each many-to-many becomes a JUNCTION table with two foreign keys and a composite primary key (or a surrogate id plus UNIQUE on the pair). Tables must be created parents first, because a foreign key cannot refer to a table that does not exist yet.",
        sqlLab: {
          erd: true,
          task:
            "Implement this ERD for a library: members (id PK, full_name required, email required unique); books (id PK, title required, isbn unique); loans (id PK, member_id required FK → members, book_id required FK → books, borrowed_on date required, returned_on date optional). Use auto-numbered ids and create the tables in a working order.",
          starter: "-- members\n\n-- books\n\n-- loans\n",
          solution: "CREATE TABLE members (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name text NOT NULL,\n  email     text NOT NULL UNIQUE\n);\n\nCREATE TABLE books (\n  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL,\n  isbn  text UNIQUE\n);\n\nCREATE TABLE loans (\n  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  member_id   integer NOT NULL REFERENCES members (id),\n  book_id     integer NOT NULL REFERENCES books (id),\n  borrowed_on date NOT NULL,\n  returned_on date\n);\n",
          checks: [
            { label: "members, books and loans exist", assert: `SELECT (${HAS.table("members")}) AND (${HAS.table("books")}) AND (${HAS.table("loans")})` },
            { label: "loans.member_id refers to members and is required", assert: `SELECT (${HAS.fk("loans", "members", "member_id")}) AND (${HAS.notNull("loans", "member_id")})` },
            { label: "loans.book_id refers to books and is required", assert: `SELECT (${HAS.fk("loans", "books", "book_id")}) AND (${HAS.notNull("loans", "book_id")})` },
            { label: "member emails and book ISBNs are unique", assert: `SELECT (${HAS.unique("members", ["email"])}) AND (${HAS.unique("books", ["isbn"])})` },
            { label: "A loan may not be returned yet", assert: HAS.nullable("loans", "returned_on") },
          ],
          hint: "Parents first: members and books, then loans with two REFERENCES columns.",
          successMessage: "The ERD below is your design, drawn back from PostgreSQL. Compare it with the brief.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 3.P · PRACTICAL: THE ACADEMY ERD
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l17-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.P"],
    title: "Week 3 Practical: Design the Academy",
    subtitle: "Students, courses, lessons, enrollments and certificates",
    estimatedMinutes: 60,
    intro:
      "This week's checkpoint: design the database for an academy like this one, then build it, and let PostgreSQL draw your ERD back to you. There is no model answer to copy: the checks test the rules.",
    atoms: [
      {
        id: "a-db-p3-rules",
        title: "The business rules",
        explain:
          "The academy's rules. Students register with a full name and a unique email. Courses have a unique code and a title. A course is made of lessons, numbered within the course (lesson 1, 2, 3 of that course); each lesson has a title. Students enroll in courses; a student can enroll in many courses and a course has many students, but a student enrolls in a given course only once, on a date. Students complete lessons; record the date each lesson was completed, once per student per lesson. When a student finishes a course they receive a certificate with a unique certificate number and an issue date; there is at most one certificate per enrollment. Before building, sketch the ERD on paper.",
        decision: decide({
          scenario: "Reading the rules, a teammate proposes putting certificate_no and issued_on as columns on students.",
          question: "What is wrong with that?",
          right: ["A student can earn several certificates (one per completed course); certificates belong to an enrollment, at most one each", "The rule ties a certificate to finishing a COURSE, so it hangs off the enrollment, one-to-one."],
          wrong: [
            ["Nothing; each student gets one certificate", "The rules allow many courses, so many certificates."],
            ["Certificates should go on courses", "A course has many students, so many certificates."],
            ["Certificates should not be stored at all", "They must be verifiable later by their number."],
          ],
          at: 1,
          aftermath: "Locate each fact on the entity it is about: that single habit prevents most design mistakes.",
        }),
      },
      {
        id: "a-db-p3-build",
        title: "Build the academy schema",
        explain:
          "Implement your ERD in one script, parents first. Use exactly these table names: students, courses, lessons, enrollments, lesson_completions, certificates. Choose keys yourself (surrogate ids or composite keys are both acceptable where they make sense), but every rule above must be enforced by the database. The checks insert test data through the columns described below, so name the key columns as given.",
        sqlLab: {
          erd: true,
          task:
            "Build the academy: students(id, full_name, email), courses(id, code, title), lessons(id, course_id, position, title), enrollments(id, student_id, course_id, enrolled_on), lesson_completions(student_id, lesson_id, completed_on), certificates(id, enrollment_id, certificate_no, issued_on). Ids are auto-numbered. Enforce every rule from the brief with keys, UNIQUE, NOT NULL and REFERENCES.",
          starter: "-- Parents first. Six tables.\n",
          solution: "CREATE TABLE students (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name text NOT NULL,\n  email     text NOT NULL UNIQUE\n);\n\nCREATE TABLE courses (\n  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  code  text NOT NULL UNIQUE,\n  title text NOT NULL\n);\n\nCREATE TABLE lessons (\n  id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  course_id integer NOT NULL REFERENCES courses (id),\n  position  integer NOT NULL,\n  title     text NOT NULL,\n  UNIQUE (course_id, position)\n);\n\nCREATE TABLE enrollments (\n  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  student_id  integer NOT NULL REFERENCES students (id),\n  course_id   integer NOT NULL REFERENCES courses (id),\n  enrolled_on date NOT NULL,\n  UNIQUE (student_id, course_id)\n);\n\nCREATE TABLE lesson_completions (\n  student_id   integer NOT NULL REFERENCES students (id),\n  lesson_id    integer NOT NULL REFERENCES lessons (id),\n  completed_on date NOT NULL,\n  PRIMARY KEY (student_id, lesson_id)\n);\n\nCREATE TABLE certificates (\n  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  enrollment_id  integer NOT NULL UNIQUE REFERENCES enrollments (id),\n  certificate_no text NOT NULL UNIQUE,\n  issued_on      date NOT NULL\n);\n",
          checks: [
            { label: "All six tables exist", assert: `SELECT ${["students", "courses", "lessons", "enrollments", "lesson_completions", "certificates"].map((t) => `(${HAS.table(t)})`).join(" AND ")}` },
            { label: "Valid data goes in", accepts: "INSERT INTO students (full_name, email) VALUES ('Ada Obi', 'ada@example.com'), ('Bayo Adeyemi', 'bayo@example.com');\nINSERT INTO courses (code, title) VALUES ('DB-101', 'Relational Databases');\nINSERT INTO lessons (course_id, position, title) VALUES (1, 1, 'Tables'), (1, 2, 'Keys');\nINSERT INTO enrollments (student_id, course_id, enrolled_on) VALUES (1, 1, '2026-01-10'), (2, 1, '2026-01-12');\nINSERT INTO lesson_completions (student_id, lesson_id, completed_on) VALUES (1, 1, '2026-01-20'), (1, 2, '2026-02-01');\nINSERT INTO certificates (enrollment_id, certificate_no, issued_on) VALUES (1, 'MST-0001', '2026-03-01');" },
            { label: "Student emails are unique", rejects: "INSERT INTO students (full_name, email) VALUES ('Ada Again', 'ada@example.com')", code: "23505" },
            { label: "Course codes are unique", rejects: "INSERT INTO courses (code, title) VALUES ('DB-101', 'A second DB-101')", code: "23505" },
            { label: "A course cannot have two lesson 1s", rejects: "INSERT INTO lessons (course_id, position, title) VALUES (1, 1, 'Duplicate')", code: "23505" },
            { label: "A student cannot enroll in the same course twice", rejects: "INSERT INTO enrollments (student_id, course_id, enrolled_on) VALUES (1, 1, '2026-04-01')", code: "23505" },
            { label: "A lesson is completed once per student", rejects: "INSERT INTO lesson_completions (student_id, lesson_id, completed_on) VALUES (1, 1, '2026-04-01')", code: "23505" },
            { label: "At most one certificate per enrollment", rejects: "INSERT INTO certificates (enrollment_id, certificate_no, issued_on) VALUES (1, 'MST-0002', '2026-03-02')", code: "23505" },
            { label: "No enrollment for a student who does not exist", rejects: "INSERT INTO enrollments (student_id, course_id, enrolled_on) VALUES (99, 1, '2026-04-01')", code: "23503" },
            { label: "No certificate without its enrollment", rejects: "INSERT INTO certificates (certificate_no, issued_on) VALUES ('MST-0003', '2026-03-03')", code: "23502" },
          ],
          hint: "Go rule by rule: each 'unique', 'only once' or 'at most one' is a UNIQUE or PRIMARY KEY; each 'must' is NOT NULL; each link is REFERENCES.",
          revealSolution: false,
          successMessage: "Every rule enforced. Look at the ERD: six entities, and every line is a rule you can read aloud.",
        },
      },
      {
        id: "a-db-p3-review",
        title: "Review the ERD against the rules",
        explain:
          "Read your diagram aloud, one line at a time, in both directions: 'a course has zero or many lessons; a lesson belongs to exactly one course'. Each sentence must match a rule in the brief. Then look for what the brief did NOT say: can a certificate be issued for an enrollment whose lessons are not all complete? The schema allows it. Some rules (completeness, at-least-one) are beyond simple constraints and must be enforced by the application or a check before issuing (triggers can do it; Week 13).",
        decision: decide({
          scenario: "Reviewing the academy design, someone notices that nothing stops a certificate being issued for an enrollment whose student has completed no lessons.",
          question: "What is the right response?",
          right: ["Record it as a business rule the schema does not enforce, and decide where it will be enforced (application check or a trigger in Week 13)", "Not every rule is a key or constraint; the important thing is that each rule has a known place of enforcement."],
          wrong: [
            ["Add NOT NULL to certificates.issued_on", "That is already there and does not check completions."],
            ["Ignore it; databases cannot enforce such rules", "They can (with triggers), and the application can too; ignoring it is the mistake."],
            ["Delete the certificates table", "Certificates are a requirement."],
          ],
          at: 0,
          aftermath: "Documenting which rules are enforced where is part of the capstone in Week 16.",
        }),
      },
    ],
    task: {
      title: "Week 3 practical: the academy ERD",
      intro: "Use the rules in this lesson and the schema you built.",
      prompts: [
        "Draw the ERD by hand or in a tool (dbdiagram.io, draw.io, or pgAdmin's ERD Tool after running your script on your own server), with every primary key, foreign key and crow's-foot end marked.",
        "Under the diagram, write each relationship as two sentences, one from each end, and the rule from the brief it comes from.",
        "Run your script on your own PostgreSQL in a new database called academy_design and confirm that the bad inserts from the checks are refused there too.",
        "List any rule the schema does not enforce, and say where it should be enforced.",
        "Checkpoint: produce a readable ERD with correctly identified entities, keys and relationships, and explain it to someone who has not seen the brief.",
      ],
      closing: "Next: Week 4, normalization and integrity constraints: why this design is better than one big table, proved step by step.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
