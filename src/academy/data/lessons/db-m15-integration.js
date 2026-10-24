/**
 * RELATIONAL DATABASES · WEEK 15 · DATABASE INTEGRATION WITH APPLICATIONS
 *
 * Curriculum 15.1 – 15.P. How frontend, backend and database work together,
 * drivers, connection strings and environment variables, pooling, sending SQL
 * from a backend, parameterized queries, mapping rows to objects, CRUD
 * through an API, transactions across operations, validation and constraint
 * errors, migrations and version control, separating responsibilities, ORMs,
 * and secrets.
 *
 * Two kinds of practice. Terminals replay a RECORDED run of a real Node.js
 * backend (db-node-app.js) using the real `pg` driver against PostgreSQL
 * 18.6, called with curl.exe. Backend labs (`apiLab`) run the learner's
 * Express-style routes in the page, with a node-postgres-style pool on the
 * same PostgreSQL engine as every SQL lab (src/academy/sql/apiLab.js), and
 * compare each response and the database afterwards with the model answer's.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, shown, shownAll, term } from "./db-helpers.js";
import { DB_JS, ENV_FILE, GITIGNORE, SERVER_JS } from "./db-node-app.js";

export const SECTION_ID = "db-s15-integration";
const MODULE = "db-m15-integration";

/** The backend labs' database: students, courses, enrollments and payments. */
const API_DB = `CREATE TABLE students (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL CHECK (length(trim(full_name)) > 0),
  email       text NOT NULL UNIQUE CHECK (email LIKE '%_@_%'),
  enrolled_on date NOT NULL DEFAULT '2026-01-01'
);
CREATE TABLE courses (
  id      integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code    text NOT NULL UNIQUE,
  title   text NOT NULL,
  price   numeric(10,2) NOT NULL CHECK (price >= 0),
  is_open boolean NOT NULL DEFAULT true
);
CREATE TABLE enrollments (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id  integer NOT NULL REFERENCES students (id),
  course_id   integer NOT NULL REFERENCES courses (id),
  enrolled_on date NOT NULL DEFAULT '2026-06-01',
  UNIQUE (student_id, course_id)
);
CREATE TABLE payments (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enrollment_id integer NOT NULL REFERENCES enrollments (id) ON DELETE CASCADE,
  amount        numeric(10,2) NOT NULL CHECK (amount > 0),
  paid_on       date NOT NULL DEFAULT '2026-06-01'
);
INSERT INTO students (full_name, email, enrolled_on) VALUES
  ('Ada Obi', 'ada@example.com', '2026-01-12'),
  ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03'),
  ('Chiamaka Eze', 'chiamaka@example.com', '2026-02-14');
INSERT INTO courses (code, title, price, is_open) VALUES
  ('DA-101', 'Data Analysis', 60000, true),
  ('DB-101', 'Relational Databases', 55000, true),
  ('PY-101', 'Python Programming', 50000, true),
  ('XX-001', 'Retired Course', 10000, false);
INSERT INTO enrollments (student_id, course_id, enrolled_on) VALUES (1, 1, '2026-01-12'), (1, 2, '2026-05-02'), (2, 2, '2026-02-03');
INSERT INTO payments (enrollment_id, amount, paid_on) VALUES (1, 60000, '2026-01-12'), (2, 27500, '2026-05-02'), (3, 55000, '2026-02-03');`;

const CURL_POST = (file) => `curl.exe -s -i -X POST http://localhost:3000/students -H "Content-Type: application/json" --data-binary "@${file}"`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 85 · 15.1 – 15.4 · APPLICATIONS, DRIVERS AND CONNECTIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l85-architecture",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4"],
    title: "Applications, Drivers and Connections",
    subtitle: "How a backend reaches PostgreSQL, and how it should",
    estimatedMinutes: 45,
    intro:
      "This week the database gets a real application in front of it: a small Node.js backend for the academy's students, built, run and called on a real server, then practised in labs.",
    atoms: [
      {
        id: "a-db-three-tiers",
        title: "How a frontend, backend and database work together",
        explain:
          "The FRONTEND (a website or mobile app) runs on the user's device and talks HTTP to the BACKEND, typically sending and receiving JSON: GET /students/2, POST /students. The BACKEND (here, Node.js) checks who is asking and whether the request is valid, sends parameterized SQL to the DATABASE through a driver, turns the rows into JSON and chooses the HTTP status (200 OK, 201 Created, 404 Not Found, 409 Conflict, 400 Bad Request). Only the backend holds database credentials. The database enforces the rules that must always hold, whoever is calling. Below: the recorded backend answering real requests made with curl.exe.",
        example: shownAll("node-app", ["curl.exe -s http://localhost:3000/students/2", "curl.exe -s -i http://localhost:3000/students/99"]),
        decision: decide({
          scenario: "A mobile app needs a student's details. Where does each step happen?",
          question: "Which description is right?",
          right: ["The app sends GET /students/2 to the backend; the backend runs SELECT … WHERE id = $1 with its own credentials and returns JSON", "Only the backend talks SQL to the database."],
          wrong: [
            ["The app connects to PostgreSQL and runs the SELECT itself", "That would put database credentials on every phone."],
            ["The database sends JSON straight to the app", "The database talks only to its clients over its own protocol."],
            ["The backend stores a copy of every table in memory", "It queries the database on demand."],
          ],
          at: 0,
          aftermath: "Frontend → backend → database: each layer has its own job and its own trust boundary.",
        }),
      },
      {
        id: "a-db-drivers",
        title: "Database drivers and connection libraries",
        explain:
          "A DRIVER is the library that speaks the database's network protocol: pg (node-postgres) for Node.js and PostgreSQL; mysql2 for Node.js and MySQL; psycopg for Python; JDBC drivers for Java; Npgsql for .NET. The driver opens connections, sends SQL with parameters, and returns rows as the language's objects. Install it into the project like any package: npm install pg (and dotenv, for loading environment variables from a .env file). Below, the real installation and a first query through pg as the academy_app role.",
        example: shownAll("node-app", ["npm install pg dotenv", "node check.js"]),
        terminalExercise: term("node-app", {
          only: ["node --version", "npm init -y", "npm install pg dotenv", "node check.js"],
          goal: "Prove that the Node.js project can reach PostgreSQL through the pg driver, as the application's role.",
          accept: ["node check.js"],
          near: [{ command: "npm install pg dotenv", why: "That installs the driver. Proving the connection needs code that uses it: check.js." }],
          hint: "check.js connects with the pool and asks for current_user and version().",
          success: "current_user is academy_app, not postgres: the application connects with its own limited role.",
        }),
      },
      {
        id: "a-db-connection-strings",
        title: "Connection strings and environment variables",
        explain:
          "The backend needs host, port, database, user and password, usually as one CONNECTION STRING: postgres://user:password@host:5432/database (add ?sslmode=require across a network). It must not be written in the code. The code reads process.env.DATABASE_URL; on a developer's machine the value comes from a .env file loaded by dotenv; in production from the hosting platform's settings or secret manager. Each environment (development, testing, production) has a different value, and the code never changes. These are the real project files.",
        example: `.env\n${ENV_FILE}\ndb.js\n${DB_JS}`,
        decision: decide({
          scenario: "The same backend code must connect to a local database on a developer's laptop and to a managed database in production.",
          question: "How should it get the right connection details in each place?",
          right: ["Read DATABASE_URL from the environment; set it from .env locally and in the hosting platform's settings in production", "Configuration lives outside the code."],
          wrong: [
            ["Write both URLs in the code and pick one with an if", "Production credentials would be in the repository."],
            ["Hard-code localhost and change it before each deploy", "Error-prone, and the change would be committed."],
            ["Ask the user for the password at startup", "Servers start unattended."],
          ],
          at: 1,
          aftermath: "Lesson 90 returns to keeping .env out of Git.",
        }),
      },
      {
        id: "a-db-pooling",
        title: "Connection pooling fundamentals",
        explain:
          "Opening a PostgreSQL connection is slow (a new server process, authentication, maybe TLS) and each one uses server memory; max_connections is limited (100 by default). So backends keep a POOL: a set of open connections (max: 10 in db.js) that requests borrow and return. pool.query() borrows a connection for one query; pool.connect() borrows one for several statements, such as a transaction, and client.release() returns it (always, even after an error). Size the pool to the database, not to the number of users; with many backend instances, an external pooler such as PgBouncer shares connections between them.",
        decision: decide({
          scenario: "A backend opens a new database connection for every HTTP request and never closes some of them. At busy times it fails with 'too many clients already'.",
          question: "What is the right fix?",
          right: ["Create one pool at startup and use it for all requests, releasing every client in finally", "A pool caps and reuses connections."],
          wrong: [
            ["Set max_connections to 100,000", "Each connection costs memory; this only delays the crash."],
            ["Open two connections per request", "That makes it worse."],
            ["Restart the database every hour", "It does not fix the leak."],
          ],
          at: 2,
          aftermath: "In the labs, pool is already created for you, exactly as db.js creates it.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 86 · 15.5 – 15.7 · QUERIES FROM A BACKEND
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l86-queries",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.5", "15.6", "15.7"],
    title: "Sending Queries from a Backend",
    subtitle: "pool.query, parameters, and turning rows into objects",
    estimatedMinutes: 50,
    intro:
      "From here on you write the backend. Each lab gives you app (an Express-style router) and pool (a node-postgres pool on a real PostgreSQL database); you write routes, and the lab sends real requests to them.",
    atoms: [
      {
        id: "a-db-sending-sql",
        title: "Sending SQL queries from a backend",
        explain:
          "With node-postgres, const { rows } = await pool.query('SELECT …') sends the SQL and resolves with the result: rows is an array of plain objects, one per row, keyed by column name; rowCount is the number of rows returned or affected. A route handler awaits the query and sends the result: res.json(rows). Select only the columns the client needs, with ORDER BY when order matters, and let the database do the filtering instead of fetching everything and filtering in JavaScript.",
        apiLab: {
          setup: API_DB,
          task:
            "Write the route GET /courses that returns the OPEN courses as JSON: an array of objects with code, title and price, ordered by code. Retired (is_open = false) courses must not appear.",
          starter: 'app.get("/courses", async (req, res) => {\n  // query the database and send the rows\n});\n',
          solution: 'app.get("/courses", async (req, res) => {\n  const { rows } = await pool.query(\n    "SELECT code, title, price FROM courses WHERE is_open ORDER BY code"\n  );\n  res.json(rows);\n});\n',
          checks: [
            { label: "GET /courses returns the open courses, in order", request: { method: "GET", path: "/courses" } },
            { label: "The filtering is done in SQL", source: "WHERE\\s+is_open" },
          ],
          hint: "const { rows } = await pool.query(\"SELECT code, title, price FROM courses WHERE is_open ORDER BY code\"); res.json(rows);",
          successMessage: "Notice price arrives as a string (\"60000.00\"): node-postgres returns numeric that way, so money keeps its exact decimals.",
        },
      },
      {
        id: "a-db-parameterized-backend",
        title: "Parameterized queries",
        explain:
          "Values from the request (req.params, req.query, req.body) are passed as PARAMETERS: pool.query('SELECT … WHERE id = $1', [req.params.id]). The SQL and the values travel separately, so '1 OR 1=1' is just a value: PostgreSQL tries to read it as an integer and fails cleanly instead of returning every row. Concatenating ('… WHERE id = ' + req.params.id) is SQL injection waiting to happen, as Week 6 showed. In mysql2 the placeholders are ? instead of $1.",
        apiLab: {
          setup: API_DB,
          task:
            "Write GET /students/:id returning that student's id, full_name and email as one JSON object, or status 404 with { \"error\": \"No such student\" } when there is none. Use a $1 parameter. An id that is not a number should make PostgreSQL raise an error (status 500 here), never return data.",
          starter: 'app.get("/students/:id", async (req, res) => {\n  \n});\n',
          solution: 'app.get("/students/:id", async (req, res) => {\n  const { rows } = await pool.query(\n    "SELECT id, full_name, email FROM students WHERE id = $1",\n    [req.params.id]\n  );\n  if (rows.length === 0) {\n    return res.status(404).json({ error: "No such student" });\n  }\n  res.json(rows[0]);\n});\n',
          checks: [
            { label: "GET /students/2 returns Bayo", request: { method: "GET", path: "/students/2" } },
            { label: "GET /students/99 is a 404 with the error message", request: { method: "GET", path: "/students/99" } },
            { label: "An injection attempt returns no data", request: { method: "GET", path: "/students/1%20OR%201=1" }, status: 500 },
            { label: "Uses a $1 parameter", source: "\\$1" },
          ],
          mustFail: ['app.get("/students/:id", async (req, res) => {\n  const { rows } = await pool.query("SELECT id, full_name, email FROM students WHERE id = " + req.params.id);\n  if (rows.length === 0) return res.status(404).json({ error: "No such student" });\n  res.json(rows[0]);\n});\n'],
          hint: "pool.query(\"… WHERE id = $1\", [req.params.id]); check rows.length before sending rows[0].",
          successMessage: "With $1, '1 OR 1=1' is rejected by PostgreSQL as an invalid integer. With concatenation it would have returned a student.",
        },
      },
      {
        id: "a-db-mapping",
        title: "Mapping database records to application objects",
        explain:
          "Database rows and application objects follow different conventions, so backends MAP between them: snake_case columns become camelCase properties (full_name → fullName); NUMERIC money and BIGINT counts arrive from pg as STRINGS (to avoid precision loss), so convert deliberately with Number() when the value is safe in JavaScript; and dates need care: by default pg turns a DATE into a JavaScript Date at local midnight, which JSON then prints in UTC, a day early in Lagos (UTC+1). The recorded backend fixes that with types.setTypeParser in db.js; in these labs dates arrive as 'YYYY-MM-DD' text.",
        apiLab: {
          setup: API_DB,
          task:
            "Write GET /courses/:code/summary returning { code, title, price, enrollments } for that course, where price is a JavaScript number and enrollments is the number of enrollments as a number (count(*) arrives as a string). 404 with { \"error\": \"No such course\" } if the code does not exist.",
          starter: 'app.get("/courses/:code/summary", async (req, res) => {\n  const { rows } = await pool.query(\n    `SELECT c.code, c.title, c.price, count(e.id) AS enrollments\n     FROM courses AS c\n     LEFT JOIN enrollments AS e ON e.course_id = c.id\n     WHERE c.code = $1\n     GROUP BY c.id`,\n    [req.params.code]\n  );\n  res.json(rows[0]);\n});\n',
          solution: 'app.get("/courses/:code/summary", async (req, res) => {\n  const { rows } = await pool.query(\n    `SELECT c.code, c.title, c.price, count(e.id) AS enrollments\n     FROM courses AS c\n     LEFT JOIN enrollments AS e ON e.course_id = c.id\n     WHERE c.code = $1\n     GROUP BY c.id`,\n    [req.params.code]\n  );\n  if (rows.length === 0) {\n    return res.status(404).json({ error: "No such course" });\n  }\n  const row = rows[0];\n  res.json({\n    code: row.code,\n    title: row.title,\n    price: Number(row.price),\n    enrollments: Number(row.enrollments),\n  });\n});\n',
          checks: [
            { label: "DB-101's summary has numbers, not strings", request: { method: "GET", path: "/courses/DB-101/summary" }, expect: { status: 200, body: { code: "DB-101", title: "Relational Databases", price: 55000, enrollments: 2 } } },
            { label: "A course with no enrollments shows 0", request: { method: "GET", path: "/courses/PY-101/summary" }, expect: { status: 200, body: { code: "PY-101", title: "Python Programming", price: 50000, enrollments: 0 } } },
            { label: "An unknown code is a 404", request: { method: "GET", path: "/courses/ZZ-999/summary" }, expect: { status: 404, body: { error: "No such course" } } },
          ],
          hint: "Build the object yourself: price: Number(row.price), enrollments: Number(row.enrollments). Return 404 when rows is empty.",
          successMessage: "The API's shape is now a deliberate contract, not whatever the driver happened to return.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 87 · 15.8 · CRUD THROUGH AN API
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l87-crud",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.8"],
    title: "CRUD Operations through an API",
    subtitle: "POST, GET, PATCH and DELETE, with the right status codes",
    estimatedMinutes: 50,
    intro:
      "Create, read, update and delete map onto HTTP methods and SQL statements one-to-one. Getting the details right (status codes, RETURNING, not-found cases) is what makes an API pleasant and safe to use.",
    atoms: [
      {
        id: "a-db-crud-recorded",
        title: "CRUD on a real server",
        explain:
          "The conventional mapping: POST /students → INSERT … RETURNING, answering 201 Created with the new record; GET /students and GET /students/:id → SELECT, 200 or 404; PATCH /students/:id → UPDATE … WHERE id = $n RETURNING, 200 with the updated record or 404; DELETE /students/:id → DELETE, 204 No Content or 404 (check rowCount). Below, the recorded server handling each one. The full server.js is shown in the example at the end of this atom.",
        example: `${shownAll("node-app", [CURL_POST("new-student.json"), 'curl.exe -s -X PATCH http://localhost:3000/students/3 -H "Content-Type: application/json" --data-binary "@change-email.json"'])}\n\nserver.js\n${SERVER_JS}`,
        terminalExercise: term("node-app", {
          only: ["curl.exe -s http://localhost:3000/students", "curl.exe -s -i -X DELETE http://localhost:3000/students/3", "curl.exe -s -i -X DELETE http://localhost:3000/students/3 --fail-with-body"],
          goal: "Delete student 3 through the API and confirm the status code the server answers with.",
          accept: ["curl.exe -s -i -X DELETE http://localhost:3000/students/3"],
          near: [{ command: "curl.exe -s -i -X DELETE http://localhost:3000/students/3 --fail-with-body", why: "That was the second attempt, after the student was gone: 404. The first DELETE is the one that removed her." }],
          hint: "-X DELETE with -i to see the status line.",
          success: "204 No Content: deleted, and nothing to send back. Deleting again gives 404, because rowCount is 0.",
        }),
      },
      {
        id: "a-db-crud-lab",
        title: "Build create, update and delete routes",
        explain:
          "Write the write-side routes for courses. Use RETURNING to send back exactly what the database stored (including generated ids and defaults), and rowCount to detect a missing record on DELETE. Read values from req.body and req.params and pass them as parameters.",
        apiLab: {
          setup: API_DB,
          task:
            "Write three routes for courses. POST /courses with body { code, title, price } inserts it and answers 201 with the new row's code, title, price and is_open. PATCH /courses/:code with body { price } updates the price and answers 200 with code and price, or 404 { \"error\": \"No such course\" }. DELETE /courses/:code answers 204 (with res.sendStatus(204)) or 404 { \"error\": \"No such course\" }.",
          starter: 'app.post("/courses", async (req, res) => {\n  \n});\n\napp.patch("/courses/:code", async (req, res) => {\n  \n});\n\napp.delete("/courses/:code", async (req, res) => {\n  \n});\n',
          solution: 'app.post("/courses", async (req, res) => {\n  const { code, title, price } = req.body;\n  const { rows } = await pool.query(\n    "INSERT INTO courses (code, title, price) VALUES ($1, $2, $3) RETURNING code, title, price, is_open",\n    [code, title, price]\n  );\n  res.status(201).json(rows[0]);\n});\n\napp.patch("/courses/:code", async (req, res) => {\n  const { rows } = await pool.query(\n    "UPDATE courses SET price = $1 WHERE code = $2 RETURNING code, price",\n    [req.body.price, req.params.code]\n  );\n  if (rows.length === 0) return res.status(404).json({ error: "No such course" });\n  res.json(rows[0]);\n});\n\napp.delete("/courses/:code", async (req, res) => {\n  const { rowCount } = await pool.query("DELETE FROM courses WHERE code = $1", [req.params.code]);\n  if (rowCount === 0) return res.status(404).json({ error: "No such course" });\n  res.sendStatus(204);\n});\n',
          checks: [
            { label: "POST creates a course and answers 201 with it", request: { method: "POST", path: "/courses", body: { code: "CS-101", title: "Cybersecurity", price: 80000 } } },
            { label: "PATCH updates the price", request: { method: "PATCH", path: "/courses/CS-101", body: { price: 75000 } } },
            { label: "PATCH of an unknown course is a 404", request: { method: "PATCH", path: "/courses/ZZ-999", body: { price: 1 } } },
            { label: "DELETE removes it with 204", request: { method: "DELETE", path: "/courses/CS-101" } },
            { label: "Deleting it again is a 404", request: { method: "DELETE", path: "/courses/CS-101" } },
            { label: "The courses table ends as it began", query: "SELECT code, title, price FROM courses ORDER BY code", ordered: true },
          ],
          hint: "INSERT … RETURNING code, title, price, is_open; UPDATE … RETURNING code, price; for DELETE, check rowCount.",
          successMessage: "Full write-side CRUD, every value parameterized, every not-found case handled.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 88 · 15.9 – 15.10 · TRANSACTIONS, VALIDATION AND ERRORS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l88-transactions-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.9", "15.10"],
    title: "Transactions, Validation and Constraint Errors",
    subtitle: "All-or-nothing requests, and turning database errors into good responses",
    estimatedMinutes: 55,
    intro:
      "A request that changes several tables must change all of them or none. And when the database refuses bad data, the application must turn that refusal into a clear answer, not a crash.",
    atoms: [
      {
        id: "a-db-backend-transactions",
        title: "Handling transactions across related operations",
        explain:
          "pool.query() may use a different connection for each call, so a transaction must run on ONE client: const client = await pool.connect(); then try { await client.query('BEGIN'); … await client.query('COMMIT'); } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }. If any statement fails, ROLLBACK undoes the earlier ones; finally always returns the connection to the pool. Keep transactions short: no waiting for other services inside them (Week 11).",
        apiLab: {
          setup: API_DB,
          task:
            "Write POST /enrollments with body { studentId, courseId, amount } that, in ONE transaction on one client, inserts the enrollment (RETURNING id) and its first payment of amount. Answer 201 with { enrollmentId } (a number). If anything fails (for example amount 0 breaks the payments CHECK), roll back so no enrollment is left behind, and answer 400 with { \"error\": \"Enrollment failed\" }. Always release the client.",
          starter: 'app.post("/enrollments", async (req, res) => {\n  const client = await pool.connect();\n  try {\n    \n  } finally {\n    client.release();\n  }\n});\n',
          solution: 'app.post("/enrollments", async (req, res) => {\n  const { studentId, courseId, amount } = req.body;\n  const client = await pool.connect();\n  try {\n    await client.query("BEGIN");\n    const { rows } = await client.query(\n      "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id",\n      [studentId, courseId]\n    );\n    await client.query(\n      "INSERT INTO payments (enrollment_id, amount) VALUES ($1, $2)",\n      [rows[0].id, amount]\n    );\n    await client.query("COMMIT");\n    res.status(201).json({ enrollmentId: rows[0].id });\n  } catch (err) {\n    await client.query("ROLLBACK");\n    res.status(400).json({ error: "Enrollment failed" });\n  } finally {\n    client.release();\n  }\n});\n',
          checks: [
            { label: "A valid enrollment with payment answers 201", request: { method: "POST", path: "/enrollments", body: { studentId: 3, courseId: 3, amount: 25000 } } },
            { label: "An enrollment with a payment of 0 is refused with 400", request: { method: "POST", path: "/enrollments", body: { studentId: 2, courseId: 1, amount: 0 } } },
            { label: "The refused request left no enrollment behind", query: "SELECT student_id, course_id FROM enrollments ORDER BY id", ordered: true },
            { label: "Only the valid payment was recorded", query: "SELECT enrollment_id, amount FROM payments ORDER BY id", ordered: true },
            { label: "Uses BEGIN, COMMIT and ROLLBACK", source: "BEGIN[\\s\\S]*COMMIT[\\s\\S]*ROLLBACK" },
          ],
          mustFail: ['app.post("/enrollments", async (req, res) => {\n  const { studentId, courseId, amount } = req.body;\n  try {\n    const { rows } = await pool.query("INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id", [studentId, courseId]);\n    await pool.query("INSERT INTO payments (enrollment_id, amount) VALUES ($1, $2)", [rows[0].id, amount]);\n    res.status(201).json({ enrollmentId: rows[0].id });\n  } catch (err) {\n    res.status(400).json({ error: "Enrollment failed" });\n  }\n});\n'],
          hint: "Every query goes through client (not pool). BEGIN first, COMMIT after the payment, ROLLBACK in catch.",
          successMessage: "Without the transaction, the failed request would leave Bayo enrolled in Data Analysis with no payment.",
        },
      },
      {
        id: "a-db-constraint-errors",
        title: "Validation, errors and database constraints",
        explain:
          "Validate input in the backend for friendly messages (a missing field, a malformed email), and let the database's constraints be the final guard. When a constraint fires, the driver's error carries PostgreSQL's SQLSTATE code: 23505 unique_violation → 409 Conflict ('already registered'); 23502 not_null_violation and 23514 check_violation → 400 Bad Request; 23503 foreign_key_violation → 400 or 404. Map them to clear responses, log anything unexpected, and answer 500 without leaking internal details to the client. Below, the recorded server doing exactly that.",
        example: shownAll("node-app", [CURL_POST("duplicate.json"), CURL_POST("invalid.json")]),
        apiLab: {
          setup: API_DB,
          task:
            "Write POST /students with body { fullName, email }. Insert it and answer 201 with { id, fullName, email } (map the column names). Map errors: a duplicate email (23505) → 409 { \"error\": \"That email is already registered\" }; a missing value or failed check (23502 or 23514) → 400 { \"error\": \"Invalid student\" }; anything else → 500 { \"error\": \"Something went wrong\" }.",
          starter: 'app.post("/students", async (req, res) => {\n  const { fullName, email } = req.body;\n  const { rows } = await pool.query(\n    "INSERT INTO students (full_name, email) VALUES ($1, $2) RETURNING id, full_name, email",\n    [fullName, email]\n  );\n  res.status(201).json(rows[0]);\n});\n',
          solution: 'app.post("/students", async (req, res) => {\n  const { fullName, email } = req.body;\n  try {\n    const { rows } = await pool.query(\n      "INSERT INTO students (full_name, email) VALUES ($1, $2) RETURNING id, full_name, email",\n      [fullName, email]\n    );\n    const s = rows[0];\n    res.status(201).json({ id: s.id, fullName: s.full_name, email: s.email });\n  } catch (err) {\n    if (err.code === "23505") {\n      return res.status(409).json({ error: "That email is already registered" });\n    }\n    if (err.code === "23502" || err.code === "23514") {\n      return res.status(400).json({ error: "Invalid student" });\n    }\n    console.error(err.message);\n    res.status(500).json({ error: "Something went wrong" });\n  }\n});\n',
          checks: [
            { label: "A valid student is created (201)", request: { method: "POST", path: "/students", body: { fullName: "Dayo Bello", email: "dayo@example.com" } } },
            { label: "A duplicate email is a 409", request: { method: "POST", path: "/students", body: { fullName: "Ada Again", email: "ada@example.com" } } },
            { label: "A missing email is a 400", request: { method: "POST", path: "/students", body: { fullName: "No Email" } } },
            { label: "A malformed email is a 400", request: { method: "POST", path: "/students", body: { fullName: "Bad Email", email: "not-an-email" } } },
            { label: "Only the valid student was stored", query: "SELECT full_name, email FROM students ORDER BY id", ordered: true },
          ],
          hint: "Wrap the query in try/catch and branch on err.code. Map full_name to fullName in the success response.",
          successMessage: "The database refused the bad data; your code turned each refusal into an answer the client can act on.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 89 · 15.11 – 15.12 · MIGRATIONS AND RESPONSIBILITIES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l89-migrations",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["15.11", "15.12"],
    title: "Migrations, Version Control and Responsibilities",
    subtitle: "The schema lives with the code; each layer does its own job",
    estimatedMinutes: 35,
    intro:
      "An application's code and its database schema change together. They must be versioned together, deployed together, and each must do the job it is best at.",
    atoms: [
      {
        id: "a-db-migrations-vcs",
        title: "Schema migrations and version control",
        explain:
          "In an application project, migrations live in the repository beside the code (migrations/001_create_students.sql, 002_add_phone.sql …), are reviewed in the same pull request as the code that needs them, and are run by a tool (node-pg-migrate, Knex, Prisma Migrate, Flyway…) during deployment, before the new code starts. The tool records applied migrations in a table, so every environment (each developer's laptop, testing, production) reaches the same schema by running the same files. Nobody changes a shared database's schema by hand.",
        decision: decide({
          scenario: "A developer adds a phone column to the production database by hand in pgAdmin to fix an urgent bug, and pushes the code that uses it. Two weeks later a new developer sets up the project from the repository.",
          question: "What happens to the new developer?",
          right: ["Their database has no phone column, because the change exists only in production; the code fails for them", "Schema changes that bypass migrations are invisible to everyone else."],
          wrong: [
            ["Nothing: pgAdmin changes sync automatically", "They do not."],
            ["Git copies the column", "Git only tracks files."],
            ["The code adds the column by itself", "Nothing in the code does that."],
          ],
          at: 3,
          aftermath: "The fix: write migration 00N_add_phone.sql (with IF NOT EXISTS, since production already has it) and commit it.",
        }),
      },
      {
        id: "a-db-responsibilities",
        title: "Separating application logic from database responsibilities",
        explain:
          "A sound division of labour. The DATABASE guarantees the data's integrity (types, keys, constraints, transactions), does set-based work close to the data (filtering, joining, aggregating), and enforces access rules per role. The APPLICATION owns business workflows and decisions that involve users and other systems (sign-up flows, sending emails, payment providers), input validation with friendly messages, authentication of users, and HTTP. Common mistakes in both directions: fetching whole tables to filter in JavaScript; and burying complex business workflows in triggers no application developer can see.",
        decision: decide({
          scenario: "A dashboard endpoint fetches all 200,000 payments with SELECT * and sums them in JavaScript to show monthly totals.",
          question: "What is the better split?",
          right: ["Let the database do the set-based work: GROUP BY month with sum(), returning twelve rows", "Aggregate where the data is; send the answer, not the raw rows."],
          wrong: [
            ["Cache the 200,000 rows in the browser", "Still moves everything, and is out of date."],
            ["Write a trigger that emails the totals", "Moves a reporting concern into hidden database logic."],
            ["Fetch the rows in pages of 1,000 and sum them", "Still 200,000 rows over the network."],
          ],
          at: 0,
          aftermath: "Week 12's 'unnecessary data retrieval' in application form.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 90 · 15.13 – 15.14 · ORMs AND SECRETS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l90-orm-secrets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["15.13", "15.14"],
    title: "ORMs, Direct SQL and Secrets",
    subtitle: "When an ORM helps, when SQL is better, and keeping credentials out of Git",
    estimatedMinutes: 40,
    intro:
      "Two practical decisions every backend project makes early: whether to write SQL or let a library write it, and how to keep the database password away from everyone who can read the code.",
    atoms: [
      {
        id: "a-db-orm",
        title: "Object-relational mapping, and when direct SQL is useful",
        explain:
          "An ORM (Object-Relational Mapper) maps tables to classes or models and generates SQL from method calls: Prisma, Sequelize, TypeORM and Drizzle in Node.js; SQLAlchemy and Django ORM in Python; Eloquent in Laravel. Benefits: less repetitive code for simple CRUD, migrations and types generated from the schema, and safe parameterization by default. Costs: generated SQL you did not write (and may not be efficient: the N+1 problem), weaker support for advanced SQL (window functions, CTEs, upserts), and a layer to learn and debug. Most teams use both: the ORM for routine CRUD, hand-written parameterized SQL for reports and performance-critical queries. Knowing SQL is what makes either safe.",
        decision: decide({
          scenario: "A team using an ORM finds the student dashboard runs 301 queries per page: one for 300 students, then one per student for their latest payment.",
          question: "What is the best response?",
          right: ["Use the ORM's eager loading, or write one SQL query with a join or LATERAL subquery for this report", "The N+1 pattern is fixed by fetching related data in one query."],
          wrong: [
            ["Drop the ORM from the whole project", "It is fine for routine CRUD; fix this query."],
            ["Add an index on every column", "The problem is 301 round trips, not missing indexes."],
            ["Cache the page for a week", "Payments would be wrong for a week."],
          ],
          at: 1,
          aftermath: "Turn on query logging in development: an ORM's SQL should never be a surprise.",
        }),
      },
      {
        id: "a-db-secrets",
        title: "Managing secrets and avoiding credentials in source control",
        explain:
          "The .env file holds DATABASE_URL with its password, so it must never be committed: list it in .gitignore BEFORE the first commit (the recorded project's .gitignore contains node_modules/ and .env). Commit a .env.example with placeholder values so others know which variables to set. In production, set variables in the hosting platform or a secret manager, give each environment its own credentials, and rotate a password immediately if it ever reaches a repository, a chat or a screenshot. Tools such as GitHub secret scanning and gitleaks catch mistakes.",
        example: `.gitignore\n${GITIGNORE}\n${shown("node-app", "git status --short")}`,
        terminalExercise: term("node-app", {
          only: ["git init", "git status --short"],
          goal: "Before the first commit, check which files Git would track, and confirm .env is not among them.",
          accept: ["git status --short"],
          hint: "git status --short lists untracked (??) files.",
          success: "Every project file is listed except .env (and node_modules): .gitignore is doing its job, so the password can never be committed by accident.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 91 · 15.P · PRACTICAL: A BACKEND ON POSTGRESQL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l91-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["15.P"],
    title: "Week 15 Practical: The Courses API",
    subtitle: "Create, read, update and delete, safely",
    estimatedMinutes: 80,
    intro:
      "The checkpoint: an application that persists data in PostgreSQL and handles invalid requests without corrupting the database. Build the complete courses API; the checks send valid and invalid requests and then inspect the database.",
    atoms: [
      {
        id: "a-db-p15-api",
        title: "The complete courses API",
        explain:
          "Requirements. GET /courses → 200, all courses (code, title, price as a number, isOpen) ordered by code. GET /courses/:code → 200 with that course in the same shape, or 404 { error: 'No such course' }. POST /courses with { code, title, price } → 201 with the new course; a duplicate code → 409 { error: 'Course code already exists' }; a negative price or a missing field → 400 { error: 'Invalid course' }. PATCH /courses/:code with { price } → 200 with the course, 404 if missing, 400 if the price is negative. DELETE /courses/:code → 204, 404 if missing, and 409 { error: 'Course has enrollments' } if enrollments still refer to it (foreign key, 23503). Every value parameterized. No request may leave the database invalid.",
        apiLab: {
          setup: API_DB,
          task:
            "Implement GET /courses, GET /courses/:code, POST /courses, PATCH /courses/:code and DELETE /courses/:code exactly as specified above, mapping rows to { code, title, price (number), isOpen } and every database error to the specified status.",
          starter: "// GET /courses\n\n// GET /courses/:code\n\n// POST /courses\n\n// PATCH /courses/:code\n\n// DELETE /courses/:code\n",
          solution: 'const toCourse = (row) => ({ code: row.code, title: row.title, price: Number(row.price), isOpen: row.is_open });\n\napp.get("/courses", async (req, res) => {\n  const { rows } = await pool.query("SELECT code, title, price, is_open FROM courses ORDER BY code");\n  res.json(rows.map(toCourse));\n});\n\napp.get("/courses/:code", async (req, res) => {\n  const { rows } = await pool.query("SELECT code, title, price, is_open FROM courses WHERE code = $1", [req.params.code]);\n  if (rows.length === 0) return res.status(404).json({ error: "No such course" });\n  res.json(toCourse(rows[0]));\n});\n\napp.post("/courses", async (req, res) => {\n  const { code, title, price } = req.body;\n  try {\n    const { rows } = await pool.query(\n      "INSERT INTO courses (code, title, price) VALUES ($1, $2, $3) RETURNING code, title, price, is_open",\n      [code, title, price]\n    );\n    res.status(201).json(toCourse(rows[0]));\n  } catch (err) {\n    if (err.code === "23505") return res.status(409).json({ error: "Course code already exists" });\n    if (err.code === "23502" || err.code === "23514") return res.status(400).json({ error: "Invalid course" });\n    res.status(500).json({ error: "Something went wrong" });\n  }\n});\n\napp.patch("/courses/:code", async (req, res) => {\n  try {\n    const { rows } = await pool.query(\n      "UPDATE courses SET price = $1 WHERE code = $2 RETURNING code, title, price, is_open",\n      [req.body.price, req.params.code]\n    );\n    if (rows.length === 0) return res.status(404).json({ error: "No such course" });\n    res.json(toCourse(rows[0]));\n  } catch (err) {\n    if (err.code === "23514" || err.code === "23502") return res.status(400).json({ error: "Invalid course" });\n    res.status(500).json({ error: "Something went wrong" });\n  }\n});\n\napp.delete("/courses/:code", async (req, res) => {\n  try {\n    const { rowCount } = await pool.query("DELETE FROM courses WHERE code = $1", [req.params.code]);\n    if (rowCount === 0) return res.status(404).json({ error: "No such course" });\n    res.sendStatus(204);\n  } catch (err) {\n    if (err.code === "23503") return res.status(409).json({ error: "Course has enrollments" });\n    res.status(500).json({ error: "Something went wrong" });\n  }\n});\n',
          checks: [
            { label: "GET /courses lists every course in the agreed shape", request: { method: "GET", path: "/courses" } },
            { label: "GET /courses/DA-101", request: { method: "GET", path: "/courses/DA-101" } },
            { label: "GET of an unknown course is a 404", request: { method: "GET", path: "/courses/ZZ-999" } },
            { label: "POST creates a course (201)", request: { method: "POST", path: "/courses", body: { code: "CS-101", title: "Cybersecurity", price: 80000 } } },
            { label: "POST with an existing code is a 409", request: { method: "POST", path: "/courses", body: { code: "DA-101", title: "Copy", price: 1 } } },
            { label: "POST with a negative price is a 400", request: { method: "POST", path: "/courses", body: { code: "NEG-1", title: "Negative", price: -5 } } },
            { label: "POST with no title is a 400", request: { method: "POST", path: "/courses", body: { code: "NT-1", price: 100 } } },
            { label: "PATCH changes a price", request: { method: "PATCH", path: "/courses/CS-101", body: { price: 70000 } } },
            { label: "PATCH to a negative price is a 400", request: { method: "PATCH", path: "/courses/CS-101", body: { price: -1 } } },
            { label: "PATCH of an unknown course is a 404", request: { method: "PATCH", path: "/courses/ZZ-999", body: { price: 1 } } },
            { label: "DELETE of a course with enrollments is a 409", request: { method: "DELETE", path: "/courses/DB-101" } },
            { label: "DELETE of the new course is a 204", request: { method: "DELETE", path: "/courses/CS-101" } },
            { label: "DELETE of an unknown course is a 404", request: { method: "DELETE", path: "/courses/ZZ-999" } },
            { label: "The database is exactly as it should be afterwards", query: "SELECT code, title, price, is_open FROM courses ORDER BY code", ordered: true },
            { label: "Enrollments are untouched", query: "SELECT student_id, course_id FROM enrollments ORDER BY id", ordered: true },
            { label: "Every value is parameterized", forbid: "\\+\\s*req\\.|`[^`]*\\$\\{\\s*req\\." },
          ],
          hint: "Write a toCourse(row) mapper once. Wrap each write in try/catch and branch on err.code: 23505, 23502, 23514, 23503.",
          revealSolution: false,
          successMessage: "Thirteen requests, valid and invalid, and the database ends exactly as it should. That is the checkpoint.",
        },
      },
      {
        id: "a-db-p15-review",
        title: "Review: what keeps the database safe?",
        explain:
          "Look back at what protected the data in your API: parameters (no injection), constraints (bad values refused even if your validation had a gap), the foreign key (a course with enrollments cannot vanish), status codes (the client knows what happened), and the application role's limited privileges on the real server (it could not drop tables even if your code tried).",
        decision: decide({
          scenario: "A teammate removes the CHECK (price >= 0) constraint, saying 'the API already validates prices'.",
          question: "Why is that a mistake?",
          right: ["Other writers (scripts, admin tools, future endpoints, a bug in this one) bypass the API's validation; the constraint protects every path", "Validation in the app is for messages; constraints are for guarantees."],
          wrong: [
            ["It is fine: one check is enough", "The API is not the only way data reaches the table."],
            ["Constraints make the API slower", "The cost is negligible."],
            ["The CHECK would return the wrong status code", "Your code maps it to 400."],
          ],
          at: 2,
          aftermath: "Defence in depth: application validation, parameterized SQL, constraints and least privilege, together.",
        }),
      },
    ],
    task: {
      title: "Week 15 practical: a backend on your own PostgreSQL",
      intro: "Build and run the courses API for real.",
      prompts: [
        "On your own machine, create a folder, run npm init -y and npm install pg dotenv, and create .env (with DATABASE_URL for a limited role, not postgres), .gitignore, db.js and server.js following the recorded project.",
        "Implement the courses API from the lab with Node's http module (as in server.js) or Express, and call every endpoint with curl.exe (or Invoke-RestMethod), including every invalid case. Paste the responses.",
        "Run git init and git status --short and show that .env is not listed. Add a .env.example.",
        "Show with psql that the database is unchanged after the invalid requests.",
        "Checkpoint: demonstrate an application that persists data in PostgreSQL and handles invalid requests without corrupting the database.",
      ],
      closing: "Next: Week 16, the capstone: a complete database project from requirements to presentation.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
