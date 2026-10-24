/**
 * RELATIONAL DATABASES — THE WEEK 15 NODE.JS BACKEND
 *
 * CLIENT-SAFE. The exact files of the small Node.js + PostgreSQL backend that
 * scripts/dbRecord.mjs writes to disk and RUNS against a real PostgreSQL 18
 * server, with the real `pg` driver, to record the Week 15 terminals. Lessons
 * show these strings, so the code a learner reads is the code that produced
 * the output they see.
 */

export const ENV_FILE = `# .env — never commit this file (it is listed in .gitignore)
DATABASE_URL=postgres://academy_app:app-password-change-me@localhost:5432/academy
PORT=3000
`;

export const GITIGNORE = `node_modules/
.env
`;

export const DB_JS = `// db.js — one pool for the whole application
require("dotenv").config({ quiet: true });
const { Pool, types } = require("pg");

// DATE columns stay as PostgreSQL's text, e.g. "2026-01-12". By default pg
// turns a DATE into a JavaScript Date at LOCAL midnight, and JSON then prints
// it in UTC: in Lagos (UTC+1) every date would come out a day early.
types.setTypeParser(types.builtins.DATE, (value) => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // at most 10 connections open at once
});

module.exports = { pool };
`;

export const CHECK_JS = `// check.js — can the application reach the database?
const { pool } = require("./db");

async function main() {
  const { rows } = await pool.query(
    "SELECT current_user, current_database(), version()"
  );
  console.log(rows[0]);
  await pool.end();
}

main().catch((err) => {
  console.error("Could not connect:", err.message);
  process.exit(1);
});
`;

export const SERVER_JS = `// server.js — a small students API on PostgreSQL
const http = require("node:http");
const { pool } = require("./db");

// Read a JSON request body.
function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Body is not valid JSON"));
      }
    });
  });
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

// A database row becomes an application object: snake_case to camelCase.
function toStudent(row) {
  return { id: row.id, fullName: row.full_name, email: row.email, enrolledOn: row.enrolled_on };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const match = url.pathname.match(/^\\/students\\/(\\d+)$/);
  try {
    if (req.method === "GET" && url.pathname === "/students") {
      const { rows } = await pool.query(
        "SELECT id, full_name, email, enrolled_on FROM students ORDER BY id"
      );
      return send(res, 200, rows.map(toStudent));
    }
    if (req.method === "GET" && match) {
      const { rows } = await pool.query(
        "SELECT id, full_name, email, enrolled_on FROM students WHERE id = $1",
        [match[1]]
      );
      if (rows.length === 0) return send(res, 404, { error: "No such student" });
      return send(res, 200, toStudent(rows[0]));
    }
    if (req.method === "POST" && url.pathname === "/students") {
      const body = await readJson(req);
      const { rows } = await pool.query(
        "INSERT INTO students (full_name, email) VALUES ($1, $2) RETURNING id, full_name, email, enrolled_on",
        [body.fullName, body.email]
      );
      return send(res, 201, toStudent(rows[0]));
    }
    if (req.method === "PATCH" && match) {
      const body = await readJson(req);
      const { rows } = await pool.query(
        "UPDATE students SET email = $1 WHERE id = $2 RETURNING id, full_name, email, enrolled_on",
        [body.email, match[1]]
      );
      if (rows.length === 0) return send(res, 404, { error: "No such student" });
      return send(res, 200, toStudent(rows[0]));
    }
    if (req.method === "DELETE" && match) {
      const { rowCount } = await pool.query("DELETE FROM students WHERE id = $1", [match[1]]);
      if (rowCount === 0) return send(res, 404, { error: "No such student" });
      res.writeHead(204);
      return res.end();
    }
    send(res, 404, { error: "Not found" });
  } catch (err) {
    // PostgreSQL's error codes say exactly what went wrong.
    if (err.code === "23505") return send(res, 409, { error: "That email is already registered" });
    if (err.code === "23502" || err.code === "23514") {
      return send(res, 400, { error: "Invalid student", detail: err.constraint || err.column });
    }
    if (err.message === "Body is not valid JSON") return send(res, 400, { error: err.message });
    console.error(err);
    send(res, 500, { error: "Something went wrong" });
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => console.log(\`Students API listening on http://localhost:\${port}\`));
`;

/** The schema the backend's database role works on (created as admin). */
export const SCHEMA_SQL = `CREATE TABLE students (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   text NOT NULL CHECK (length(trim(full_name)) > 0),
  email       text NOT NULL UNIQUE CHECK (email LIKE '%_@_%'),
  enrolled_on date NOT NULL DEFAULT current_date
);
INSERT INTO students (full_name, email, enrolled_on) VALUES
  ('Ada Obi', 'ada@example.com', '2026-01-12'),
  ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03');
CREATE ROLE academy_app LOGIN PASSWORD 'app-password-change-me';
GRANT SELECT, INSERT, UPDATE, DELETE ON students TO academy_app;`;

export const NEW_STUDENT_JSON = `{ "fullName": "Chiamaka Eze", "email": "chiamaka@example.com" }
`;

export const DUPLICATE_JSON = `{ "fullName": "Ada Again", "email": "ada@example.com" }
`;

export const INVALID_JSON = `{ "fullName": "No Email" }
`;

export const PATCH_JSON = `{ "email": "chiamaka.eze@example.com" }
`;
