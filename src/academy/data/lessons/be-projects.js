/**
 * BACKEND ENGINEERING — PROJECT FILES SHOWN AND RUN
 *
 * CLIENT-SAFE. The exact files of the small projects that
 * scripts/beRecord.mjs writes to disk and RUNS to record the course's
 * terminals, and that lessons show and give to labs. The code a learner
 * reads is the code that produced the output they see.
 */

/* ── Week 1: the smallest web application, on Node's http module ──────── */
export const W1_SERVER = `// server.js — the smallest web application: a page and an API
const http = require("node:http");

const courses = [
  { id: 1, title: "Backend Engineering", weeks: 24 },
  { id: 2, title: "Relational Databases", weeks: 16 },
];

const server = http.createServer((req, res) => {
  console.log(\`\${req.method} \${req.url}\`);
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Memora Academy</h1><p>Two courses are open.</p>");
  } else if (req.url === "/api/courses") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(courses));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
`;

export const W1_LOOKUP = `// lookup.js — ask DNS for a domain's IP addresses, the browser's first step
const dns = require("node:dns/promises");

const domain = process.argv[2] || "example.com";

dns
  .lookup(domain, { all: true })
  .then((addresses) => {
    for (const a of addresses) console.log(\`\${domain} -> \${a.address} (IPv\${a.family})\`);
  })
  .catch((err) => console.error(\`\${domain}: \${err.code}\`));
`;

/* ── Week 3: fetching from a real public API ─────────────────────────── */
export const W3_FETCH_USERS = `// fetch-users.js — fetch real data from a public API and use it
const url = "https://jsonplaceholder.typicode.com/users";

const response = await fetch(url);
console.log("Status:", response.status, response.statusText);
console.log("Content-Type:", response.headers.get("content-type"));

const users = await response.json();
console.log(\`\${users.length} users\`);
for (const user of users.slice(0, 3)) {
  console.log(\`- \${user.name} (\${user.email}), \${user.address.city}\`);
}
`;

export const W3_FETCH_MISSING = `// fetch-missing.js — fetch does not throw for 404: check response.ok
const response = await fetch("https://jsonplaceholder.typicode.com/users/9999");
console.log("ok:", response.ok, "status:", response.status);
const body = await response.json();
console.log("body:", body);
`;

export const W3_FETCH_DOWN = `// fetch-down.js — a host that does not exist: fetch rejects
try {
  await fetch("https://no-such-api.example/users");
} catch (err) {
  console.log(err.name + ": " + err.message);
  console.log("cause:", err.cause.code);
}
`;

/* ── Week 4: the course API project, for the terminal, npm and Git ────── */
export const W4_SERVER = `// server.js — the course API
import express from "express";
import { courses } from "./src/routes/courses.js";

const app = express();
app.use(express.json());
app.use("/courses", courses);

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;

export const W4_SERVER_PORT_ENV = W4_SERVER.replace(
  'app.listen(3000, () => console.log("Course API on http://localhost:3000"));',
  'const port = process.env.PORT || 3000;\napp.listen(port, () => console.log(`Course API on http://localhost:${port}`));'
);

export const W4_SERVER_PORT_8080 = W4_SERVER.replace(
  'app.listen(3000, () => console.log("Course API on http://localhost:3000"));',
  'app.listen(8080, () => console.log("Course API on http://localhost:8080"));'
);

export const W4_SERVER_RESOLVED = W4_SERVER.replace(
  'app.listen(3000, () => console.log("Course API on http://localhost:3000"));',
  'const port = process.env.PORT || 8080;\napp.listen(port, () => console.log(`Course API on http://localhost:${port}`));'
);

export const W4_ROUTES = `// src/routes/courses.js — the /courses routes
import { Router } from "express";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../../data/courses.json", import.meta.url), "utf8"));
export const courses = Router();

courses.get("/", (req, res) => res.json(data));
`;

export const W4_ROUTES_SEARCH = W4_ROUTES.replace(
  'courses.get("/", (req, res) => res.json(data));',
  'courses.get("/", (req, res) => {\n  const q = String(req.query.q ?? "").toLowerCase();\n  res.json(q ? data.filter((c) => c.title.toLowerCase().includes(q)) : data);\n});'
);

export const W4_COURSES_JSON = `[
  { "id": 1, "title": "Backend Engineering", "weeks": 24 },
  { "id": 2, "title": "Relational Databases", "weeks": 16 }
]
`;

export const W4_PACKAGE = `{
  "name": "course-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.3.0"
  }
}
`;

export const W4_NOTES = "Ideas: search, filters, pagination.\n";

export const W4_README = `# Course API

The academy's course catalogue as a JSON API.
`;

export const W4_ENV_LEAK = "DATABASE_URL=postgres://academy:S3cret-Pa55@db.academy.example:5432/academy\nJWT_SECRET=dev-secret-do-not-share\n";

export const W4_GITIGNORE = "node_modules/\n.env\n";

export const W4_MESSY = `import express from "express"
import { readFileSync } from 'node:fs'

const app = express()
const unused = 42
app.get("/health", (req, res) => { res.json({status:"ok", uptime: proces.uptime()}) })

app.listen(3000)
`;

export const W4_TIDY = `import express from "express";

const app = express();
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(3000);
`;

export const W4_ESLINT_CONFIG = `// eslint.config.js — ESLint's recommended rules, for Node.js code
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  { languageOptions: { globals: globals.node } },
];
`;

/* ── Week 10: roles and a reporting view (psql -f roles.sql) ─────────── */

export const W10_ROLES = `-- The API's role: reads and writes rows, never changes the schema.
CREATE ROLE academy_app LOGIN PASSWORD 'app-password';
GRANT CONNECT ON DATABASE academy TO academy_app;
GRANT USAGE ON SCHEMA public TO academy_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO academy_app;

-- Per-course numbers for reporting, with no personal data.
CREATE VIEW course_report AS
SELECT c.code, c.title,
       count(e.id) AS enrollments,
       count(e.id) FILTER (WHERE e.status = 'completed') AS completed
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
GROUP BY c.id
ORDER BY c.code;

-- The reporting role sees the view and nothing else.
CREATE ROLE reporting LOGIN PASSWORD 'reporting-password';
GRANT CONNECT ON DATABASE academy TO reporting;
GRANT USAGE ON SCHEMA public TO reporting;
GRANT SELECT ON course_report TO reporting;
`;

/* ── Week 11: the course API's Prisma schema, as it evolves ──────────── */

export const W11_SCHEMA = `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Course {
  id          Int          @id @default(autoincrement())
  code        String       @unique
  title       String
  weeks       Int
  price       Int
  createdAt   DateTime     @default(now()) @map("created_at")
  enrollments Enrollment[]

  @@map("courses")
}

model Student {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  fullName    String       @map("full_name")
  enrollments Enrollment[]

  @@map("students")
}

model Enrollment {
  id         Int      @id @default(autoincrement())
  student    Student  @relation(fields: [studentId], references: [id])
  studentId  Int      @map("student_id")
  course     Course   @relation(fields: [courseId], references: [id])
  courseId   Int      @map("course_id")
  enrolledAt DateTime @default(now()) @map("enrolled_at")

  @@unique([studentId, courseId])
  @@map("enrollments")
}
`;

/** Week 11, second migration: a level with a default (safe: existing rows get it). */
export const W11_SCHEMA_LEVEL = W11_SCHEMA.replace(
  "  price       Int\n",
  '  price       Int\n  level       String       @default("beginner")\n'
);

/** Week 11, a careless change: renaming title in the schema (Prisma drops and re-adds the column). */
export const W11_SCHEMA_RENAME = W11_SCHEMA_LEVEL.replace("  title       String\n", "  name        String\n");

export const W11_PRISMA_CONFIG = `import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
`;

export const W11_DB = `import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
`;

export const W11_TRY = `import { prisma } from "./db.ts";

const course = await prisma.course.create({
  data: { code: "BE-101", title: "Backend Engineering", weeks: 24, price: 120000 },
});
console.log(course);

const student = await prisma.student.create({
  data: {
    email: "ada@example.com",
    fullName: "Ada Obi",
    enrollments: { create: { courseId: course.id } },
  },
  include: { enrollments: true },
});
console.log(student);

console.log(await prisma.course.findMany({ select: { code: true, _count: { select: { enrollments: true } } } }));
await prisma.$disconnect();
`;

/** Week 11, the safe rename: the field is called name in code, the column keeps its name. */
export const W11_SCHEMA_MAPPED = W11_SCHEMA_LEVEL.replace("  title       String\n", '  name        String       @map("title")\n');

/** Week 11, later: seats per course, and payments for enrollments. */
export const W11_SCHEMA_SEATS = W11_SCHEMA_LEVEL.replace(
  '  level       String       @default("beginner")\n',
  '  level       String       @default("beginner")\n  seats       Int          @default(30)\n'
)
  .replace(
    /model Enrollment \{[\s\S]*?\n\}\n/,
    `model Enrollment {
  id         Int       @id @default(autoincrement())
  student    Student   @relation(fields: [studentId], references: [id])
  studentId  Int       @map("student_id")
  course     Course    @relation(fields: [courseId], references: [id])
  courseId   Int       @map("course_id")
  enrolledAt DateTime  @default(now()) @map("enrolled_at")
  payments   Payment[]

  @@unique([studentId, courseId])
  @@map("enrollments")
}
`
  )
  .concat(`
model Payment {
  id           Int        @id @default(autoincrement())
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id])
  enrollmentId Int        @map("enrollment_id")
  amount       Int
  paidAt       DateTime   @default(now()) @map("paid_at")

  @@map("payments")
}
`);

/** Week 11 exercise: only seats added to the level schema (the migration the learner writes by hand). */
export const W11_SCHEMA_LEVEL_SEATS = W11_SCHEMA_LEVEL.replace(
  '  level       String       @default("beginner")\n',
  '  level       String       @default("beginner")\n  seats       Int          @default(30)\n'
);

/* ── Week 12: a million lesson views for measuring queries ───────────── */

export const W12_PERF = `CREATE TABLE lesson_views (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id integer NOT NULL,
  lesson_id  integer NOT NULL,
  viewed_at  timestamptz NOT NULL
);

-- 1,000,000 views by 20,000 students of 600 lessons over 2026.
INSERT INTO lesson_views (student_id, lesson_id, viewed_at)
SELECT 1 + (n::bigint * 7919) % 20000,
       1 + n % 600,
       timestamptz '2026-01-01' + (n * 31) % 31536000 * interval '1 second'
FROM generate_series(1, 1000000) AS n;

ANALYZE lesson_views;
`;

/* ── Week 15: a priced quote and its tests (vitest, real coverage) ───── */

export const W15_PRICING = `/** The price of a course for a number of seats, in naira. */
export function quote(price, seats, { earlyBird = false } = {}) {
  if (!Number.isInteger(seats) || seats < 1) throw new RangeError("seats must be a whole number, 1 or more");
  let discount = 0;
  if (seats >= 10) discount = 20;
  else if (seats >= 3) discount = 10;
  if (earlyBird) discount += 5;
  const unit = Math.round(price * (1 - discount / 100));
  return { unit, total: unit * seats, discount };
}
`;

export const W15_PRICING_TEST = `import { describe, expect, it } from "vitest";
import { quote } from "../src/pricing.js";

describe("quote", () => {
  it("charges the full price for one seat", () => {
    expect(quote(120000, 1)).toEqual({ unit: 120000, total: 120000, discount: 0 });
  });

  it("gives 10% off from 3 seats", () => {
    expect(quote(100000, 3)).toEqual({ unit: 90000, total: 270000, discount: 10 });
  });

  it("refuses 0 seats", () => {
    expect(() => quote(100000, 0)).toThrow(RangeError);
  });
});
`;

/** The same function with a boundary bug: 3 seats no longer get the group discount. */
export const W15_PRICING_BUG = W15_PRICING.replace("else if (seats >= 3) discount = 10;", "else if (seats > 3) discount = 10;");
