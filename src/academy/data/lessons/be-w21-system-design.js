/**
 * BACKEND ENGINEERING · WEEK 21 · REQUIREMENTS ANALYSIS AND SYSTEM DESIGN
 *
 * Curriculum 21.1 – 21.P: the first capstone week. Every lab works on one
 * brief, Office Hours (students book short one-to-one slots with their
 * instructors), so the documents can be checked against each other the way
 * a reviewer would: stories and requirements, a schema that PostgreSQL
 * must accept and enforce, its ER diagram, an OpenAPI contract, an access
 * matrix that covers every operation of that contract, an architecture
 * diagram, a threat model, a plan, and a specification that traces each
 * requirement to a story, an endpoint and a test.
 *
 * The deliverable's prompts then apply the same to the learner's own project.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";
import { PARSE_ERD } from "./be-w9-relational.js";

export const SECTION_ID = "be-s21-system-design";
const MODULE = "be-w21-system-design";

const BRIEF = `# Brief: Office Hours

The academy's instructors hold office hours, but booking them happens in chat threads and goes wrong: double bookings, forgotten sessions, students who never show up.

Build the backend for Office Hours:

- Instructors publish availability as 20-minute slots for the courses they teach.
- Students book a free slot with an instructor of a course they are enrolled in, and can cancel up to 2 hours before it starts.
- Everyone gets an email reminder 24 hours before a booked slot.
- After the slot, the instructor marks the booking attended or no-show.
- A student with 2 no-shows in 30 days cannot book for the next 14 days.
- Admins see a weekly report of bookings, cancellations and no-shows per course.

The academy has about 6,000 students and 120 instructors; booking opens for the next week every Monday at 09:00 (Africa/Lagos), when most bookings happen within the first 15 minutes.
`;
const DOC_PKG = pkg({ name: "office-hours", deps: ["yaml"] });

/** Check preamble: Markdown helpers. */
const MD = `const md = (p) => file(p) || ""; const words = (t) => String(t).trim().split(/\\s+/).filter(Boolean).length; const tableRows = (t) => String(t).split("\\n").filter((l) => /^\\s*\\|/.test(l)).map((l) => l.trim().replace(/^\\||\\|$/g, "").split("|").map((c) => c.trim())).filter((cells) => !cells.every((c) => /^:?-{3,}:?$/.test(c)));`;
const YAML = `const YAML = await load("yaml"); const yamlOf = (p) => { const t = file(p); assert(t, p + " is missing"); return YAML.parse(t) || {}; };`;

/* ── The answers of the earlier labs, given to the later ones ─────────── */

const STORIES = `# User stories: Office Hours

### US-1: Publish availability
As an instructor, I want to publish 20-minute slots for my course so that students can book time with me.
Priority: Must
Acceptance criteria:
- Given I teach BE-101, when I publish a slot starting on a future quarter hour, then it appears as free to BE-101 students.
- Given I already have a slot at 10:00, when I publish another at 10:00, then it is refused with SLOT_OVERLAPS.

### US-2: Book a slot
As a student, I want to book a free slot with an instructor of my course so that I can get help one to one.
Priority: Must
Acceptance criteria:
- Given a free slot in my course, when I book it, then it is mine and nobody else can book it.
- Given two students book the same slot at the same moment, when both requests arrive, then exactly one succeeds and the other gets SLOT_TAKEN.

### US-3: Cancel a booking
As a student, I want to cancel my booking up to 2 hours before it starts so that the slot goes to someone else.
Priority: Must
Acceptance criteria:
- Given my booking starts in 3 hours, when I cancel it, then the slot is free again.
- Given my booking starts in 90 minutes, when I cancel it, then it is refused with TOO_LATE_TO_CANCEL.

### US-4: Get a reminder
As a student, I want an email reminder 24 hours before my slot so that I do not forget it.
Priority: Should
Acceptance criteria:
- Given a booking starting tomorrow at 10:00, when it is 10:00 today, then I receive one reminder email.
- Given I cancelled the booking, when the reminder time comes, then no email is sent.

### US-5: Record attendance
As an instructor, I want to mark each past booking attended or no-show so that the academy knows who comes.
Priority: Must
Acceptance criteria:
- Given a booking that has ended, when I mark it no-show, then it is recorded as no-show.
- Given a booking that has not started, when I try to mark it, then it is refused with NOT_FINISHED.

### US-6: Block repeated no-shows
As an instructor, I want students with 2 no-shows in 30 days to be blocked from booking for 14 days so that my time is not wasted.
Priority: Should
Acceptance criteria:
- Given a student has had 2 no-shows in the last 30 days, when they try to book, then it is refused with BOOKING_BLOCKED until 14 days after the second no-show.
- Given a student had their second no-show 15 days ago, when they book, then it succeeds.

### US-7: Weekly report
As an admin, I want a weekly report of bookings, cancellations and no-shows per course so that I can see where office hours work.
Priority: Could
Acceptance criteria:
- Given a week with bookings in two courses, when I open the report for that week, then each course shows its counts.
- Given I am a student, when I open the report, then I get FORBIDDEN.
`;
const REQUIREMENTS = `# Requirements: Office Hours

## Functional

- FR-1: Instructors can publish 20-minute slots, starting on a quarter hour, for courses they teach.
- FR-2: An instructor cannot have two slots that start at the same time.
- FR-3: Students can list free slots for the instructors of courses they are enrolled in, for a date range.
- FR-4: Students can book a free slot; a slot can have at most one active booking.
- FR-5: Students can cancel their booking until 2 hours before the slot starts.
- FR-6: The system emails a reminder 24 hours before each active booking.
- FR-7: Instructors can mark a finished booking attended or no-show.
- FR-8: A student with 2 no-shows in 30 days cannot book for 14 days after the second.
- FR-9: Admins can see a weekly report of bookings, cancellations and no-shows per course.
- FR-10: Users can see their own upcoming and past bookings.

## Non-functional

- NFR-1 (Performance): booking answers within 300 ms at the 95th percentile at 50 bookings per second (the Monday 09:00 peak).
- NFR-2 (Availability): 99.5% of requests succeed per 30 days, and 99.9% between Monday 08:45 and 10:00.
- NFR-3 (Correctness): 0 double bookings, enforced by a database constraint, under 100 concurrent attempts for one slot.
- NFR-4 (Security): 100% of endpoints except login require a session; students can read and change only their own bookings, tested for all 7 operations.
- NFR-5 (Privacy): attendance data is kept for 365 days, then deleted; reports show counts only, never names.
- NFR-6 (Reliability): a reminder is sent at most once and within 10 minutes of its time, even if the worker restarts.
- NFR-7 (Operability): restores from backup within 1 hour, with at most 5 minutes of lost data.
`;
const SCHEMA = `-- Office Hours: schema
CREATE TABLE users (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  full_name  text NOT NULL,
  role       text NOT NULL CHECK (role IN ('student', 'instructor', 'admin'))
);

CREATE TABLE courses (
  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code  text NOT NULL UNIQUE,
  title text NOT NULL
);

-- Who teaches and who studies what.
CREATE TABLE course_members (
  course_id integer NOT NULL REFERENCES courses (id),
  user_id   integer NOT NULL REFERENCES users (id),
  role      text NOT NULL CHECK (role IN ('student', 'instructor')),
  PRIMARY KEY (course_id, user_id)
);

CREATE TABLE slots (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  instructor_id integer NOT NULL REFERENCES users (id),
  course_id     integer NOT NULL REFERENCES courses (id),
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz NOT NULL,
  CHECK (ends_at - starts_at = interval '20 minutes'),
  CHECK (extract(minute FROM starts_at)::int % 15 = 0 AND extract(second FROM starts_at) = 0),
  UNIQUE (instructor_id, starts_at)
);

CREATE TABLE bookings (
  id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slot_id      integer NOT NULL REFERENCES slots (id),
  student_id   integer NOT NULL REFERENCES users (id),
  status       text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'attended', 'no_show')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  reminded_at  timestamptz
);

-- At most one active booking per slot: a cancelled one frees it.
CREATE UNIQUE INDEX bookings_one_active_per_slot ON bookings (slot_id) WHERE status <> 'cancelled';
CREATE INDEX bookings_student_idx ON bookings (student_id, created_at);
CREATE INDEX slots_course_time_idx ON slots (course_id, starts_at);
`;
const ERD_DOC = `# Office Hours: entity-relationship diagram

\`\`\`mermaid
erDiagram
  USER ||--o{ COURSE_MEMBER : "belongs to"
  COURSE ||--o{ COURSE_MEMBER : has
  USER ||--o{ SLOT : publishes
  COURSE ||--o{ SLOT : "offered for"
  SLOT ||--o{ BOOKING : "booked as"
  USER ||--o{ BOOKING : makes

  USER {
    int id PK
    text email
    text full_name
    text role
  }
  COURSE {
    int id PK
    text code
    text title
  }
  COURSE_MEMBER {
    int course_id PK, FK
    int user_id PK, FK
    text role
  }
  SLOT {
    int id PK
    int instructor_id FK
    int course_id FK
    timestamptz starts_at
    timestamptz ends_at
  }
  BOOKING {
    int id PK
    int slot_id FK
    int student_id FK
    text status
    timestamptz created_at
    timestamptz cancelled_at
    timestamptz reminded_at
  }
\`\`\`

A slot can have many bookings over time (cancelled ones stay for the history), but at most one that is not cancelled: the partial unique index bookings_one_active_per_slot enforces it.
`;
const ERROR_REF = { $ref: "#/components/schemas/Error" };
const errorResponse = (description) => ({ description, content: { "application/json": { schema: ERROR_REF } } });
const OPENAPI = (() => {
  const json = (schema) => ({ content: { "application/json": { schema } } });
  const data = (schema) => json({ type: "object", required: ["data"], properties: { data: schema } });
  const id = { name: "id", in: "path", required: true, schema: { type: "integer" } };
  return {
    openapi: "3.1.0",
    info: { title: "Office Hours API", version: "1.0.0" },
    security: [{ cookieAuth: [] }],
    paths: {
      "/instructors/{id}/slots": {
        get: {
          operationId: "listSlots",
          summary: "Free slots of an instructor, for a date range",
          parameters: [id, { name: "from", in: "query", required: true, schema: { type: "string", format: "date" } }, { name: "to", in: "query", required: true, schema: { type: "string", format: "date" } }],
          responses: { 200: { description: "Free slots", ...data({ type: "array", items: { $ref: "#/components/schemas/Slot" } }) }, 400: errorResponse("Invalid range"), 401: errorResponse("Not logged in"), 404: errorResponse("No such instructor") },
        },
      },
      "/slots": {
        post: {
          operationId: "createSlot",
          summary: "Publish a slot (instructors)",
          requestBody: { required: true, ...json({ $ref: "#/components/schemas/NewSlot" }) },
          responses: { 201: { description: "Created", ...data({ $ref: "#/components/schemas/Slot" }) }, 400: errorResponse("Invalid slot"), 401: errorResponse("Not logged in"), 403: errorResponse("Not an instructor of the course"), 409: errorResponse("SLOT_OVERLAPS") },
        },
      },
      "/bookings": {
        post: {
          operationId: "createBooking",
          summary: "Book a slot (students)",
          requestBody: { required: true, ...json({ type: "object", required: ["slotId"], properties: { slotId: { type: "integer" } } }) },
          responses: { 201: { description: "Booked", ...data({ $ref: "#/components/schemas/Booking" }) }, 401: errorResponse("Not logged in"), 403: errorResponse("BOOKING_BLOCKED or not enrolled"), 404: errorResponse("No such slot"), 409: errorResponse("SLOT_TAKEN") },
        },
      },
      "/bookings/{id}": {
        delete: {
          operationId: "cancelBooking",
          summary: "Cancel my booking",
          parameters: [id],
          responses: { 204: { description: "Cancelled" }, 401: errorResponse("Not logged in"), 404: errorResponse("No such booking of yours"), 409: errorResponse("TOO_LATE_TO_CANCEL") },
        },
        patch: {
          operationId: "markAttendance",
          summary: "Mark a finished booking attended or no-show (the slot's instructor)",
          parameters: [id],
          requestBody: { required: true, ...json({ type: "object", required: ["status"], properties: { status: { enum: ["attended", "no_show"] } } }) },
          responses: { 200: { description: "Updated", ...data({ $ref: "#/components/schemas/Booking" }) }, 401: errorResponse("Not logged in"), 403: errorResponse("Not your slot"), 404: errorResponse("No such booking"), 409: errorResponse("NOT_FINISHED") },
        },
      },
      "/me/bookings": {
        get: {
          operationId: "listMyBookings",
          summary: "My bookings, newest first",
          responses: { 200: { description: "Bookings", ...data({ type: "array", items: { $ref: "#/components/schemas/Booking" } }) }, 401: errorResponse("Not logged in") },
        },
      },
      "/reports/weekly": {
        get: {
          operationId: "weeklyReport",
          summary: "Bookings, cancellations and no-shows per course for a week (admins)",
          parameters: [{ name: "week", in: "query", required: true, schema: { type: "string", format: "date" } }],
          responses: { 200: { description: "The report", ...data({ type: "array", items: { $ref: "#/components/schemas/ReportRow" } }) }, 401: errorResponse("Not logged in"), 403: errorResponse("Admins only") },
        },
      },
    },
    components: {
      securitySchemes: { cookieAuth: { type: "apiKey", in: "cookie", name: "sid" } },
      schemas: {
        Error: { type: "object", required: ["error"], properties: { error: { type: "object", required: ["code", "message"], properties: { code: { type: "string" }, message: { type: "string" } } } } },
        NewSlot: { type: "object", required: ["courseId", "startsAt"], properties: { courseId: { type: "integer" }, startsAt: { type: "string", format: "date-time" } } },
        Slot: { type: "object", required: ["id", "instructorId", "courseId", "startsAt", "endsAt"], properties: { id: { type: "integer" }, instructorId: { type: "integer" }, courseId: { type: "integer" }, startsAt: { type: "string", format: "date-time" }, endsAt: { type: "string", format: "date-time" } } },
        Booking: { type: "object", required: ["id", "slotId", "studentId", "status"], properties: { id: { type: "integer" }, slotId: { type: "integer" }, studentId: { type: "integer" }, status: { enum: ["booked", "cancelled", "attended", "no_show"] }, startsAt: { type: "string", format: "date-time" } } },
        ReportRow: { type: "object", required: ["courseCode", "bookings", "cancellations", "noShows"], properties: { courseCode: { type: "string" }, bookings: { type: "integer" }, cancellations: { type: "integer" }, noShows: { type: "integer" } } },
      },
    },
  };
})();
/** OPENAPI as YAML (JSON is valid YAML 1.2, but people write block style). */
const toYaml = (value, indent = "") => {
  if (Array.isArray(value)) return value.length ? value.map((v) => `${indent}- ${toYaml(v, indent + "  ").trimStart()}`).join("\n") : `${indent}[]`;
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => {
        const key = /^[A-Za-z_$][\w$-]*$/.test(k) ? k : JSON.stringify(k);
        if (v && typeof v === "object" && (Array.isArray(v) ? v.length : Object.keys(v).length)) return `${indent}${key}:\n${toYaml(v, indent + "  ")}`;
        return `${indent}${key}: ${v && typeof v === "object" ? (Array.isArray(v) ? "[]" : "{}") : JSON.stringify(v)}`;
      })
      .join("\n");
  }
  return `${indent}${JSON.stringify(value)}`;
};
export const OPENAPI_YAML = toYaml(OPENAPI) + "\n";
const OPS = Object.entries(OPENAPI.paths).flatMap(([p, ops]) => Object.keys(ops).map((m) => `${m.toUpperCase()} ${p}`));
export const AUTH_DOC = `# Authentication and authorization: Office Hours

## Authentication

Users log in with email and password (Argon2id hashes) and get a session cookie sid: HttpOnly, Secure, SameSite=Lax, 7-day expiry, stored hashed in PostgreSQL so it can be revoked at once (logout, password change). Sessions rather than JWTs because the API serves one first-party web app and revocation matters more than statelessness. Login is rate-limited to 5 attempts per minute per IP and per email.

## Roles

- **student**: books, cancels and lists their own bookings; sees slots of instructors of courses they are enrolled in.
- **instructor**: publishes slots for courses they teach; marks attendance on bookings of their own slots.
- **admin**: reads the weekly report; no access to individual bookings through the API.

## Access matrix

"own" means the record must belong to the caller (checked in the query, answering 404 otherwise, so ids reveal nothing).

| Operation | student | instructor | admin |
| --- | --- | --- | --- |
| GET /instructors/{id}/slots | yes (enrolled courses) | yes | yes |
| POST /slots | no | own courses | no |
| POST /bookings | yes (enrolled courses) | no | no |
| DELETE /bookings/{id} | own | no | no |
| PATCH /bookings/{id} | no | own slots | no |
| GET /me/bookings | own | own | own |
| GET /reports/weekly | no | no | yes |

## Rules enforced outside the role table

- A student cannot book while blocked for no-shows (BOOKING_BLOCKED, 403).
- Cancelling closes 2 hours before the slot (TOO_LATE_TO_CANCEL, 409).
- Every denial is covered by an automated authorization test (one per cell marked no or own).
`;
export const ARCH_DOC = `# Office Hours: architecture

\`\`\`mermaid
flowchart LR
  browser[Web app in the browser] -->|HTTPS, session cookie| api[API: Node.js and Express]
  api -->|SQL| postgres[(PostgreSQL)]
  api -->|cache, rate limits, job queue| redis[(Redis)]
  worker[Worker: reminders and reports] -->|jobs| redis
  worker -->|SQL| postgres
  worker -->|SMTP| smtp[Email provider]
\`\`\`

## Components

- **browser**: the academy's web app; talks only to the API, over HTTPS, with the session cookie.
- **api**: stateless Express instances behind Caddy (two in production); validates, authorizes, applies booking rules and writes to PostgreSQL; queues reminder jobs.
- **worker**: one process (same image) that sends reminders 24 hours ahead from a scheduled scan with a lock, and builds the weekly report.
- **postgres**: the source of truth; the partial unique index guarantees one active booking per slot.
- **redis**: rate limits for login and booking, the job queue, and a short cache of free slots invalidated on every booking.
- **smtp**: the email provider; only the worker talks to it.

## Key flows

Booking at the Monday peak: the API checks the rules, inserts the booking and relies on the unique index for the race (the loser gets 409 SLOT_TAKEN), invalidates the cached free slots and answers; the reminder is found later by the worker's scan, so no email is sent inside the request.
`;
const THREATS_DOC = `# Threat model: Office Hours

Assets: student accounts and bookings, instructors' time, attendance records (personal data), the session store.

| Threat | STRIDE | Asset | Mitigation | Test |
| --- | --- | --- | --- | --- |
| Stolen or guessed passwords used to log in as a student | Spoofing | Accounts | Argon2id, login rate limit per IP and email, same error for unknown email and wrong password | Six failed logins answer 429; unknown email and wrong password answer identically |
| A student changes the id in DELETE /bookings/{id} to cancel someone else's booking | Tampering | Bookings | Ownership in the query (WHERE id = $1 AND student_id = $2), 404 otherwise | Cancelling another student's booking answers 404 and changes nothing |
| An instructor denies having marked a no-show that blocked a student | Repudiation | Attendance | Audit log row (who, when, old and new status) for every attendance change | Marking attendance writes an audit row with the instructor's id |
| A student lists another instructor's student names through the slots endpoint | Information disclosure | Personal data | Slots responses contain no student data; reports show counts only | GET /instructors/{id}/slots has no studentId or name fields |
| A script books every slot at 09:00 on Monday | Denial of service | Instructors' time | Booking rate limit (10 per minute per student), at most 3 active bookings per student | The fourth active booking answers 409 TOO_MANY_BOOKINGS; the eleventh request in a minute answers 429 |
| A student calls PATCH /bookings/{id} to mark their own no-show as attended | Elevation of privilege | Attendance | Only the slot's instructor may mark attendance | A student's PATCH answers 403 |
| Session cookie read by injected script | Information disclosure | Sessions | HttpOnly and Secure cookies, output encoding, Content-Security-Policy | Set-Cookie has HttpOnly, Secure and SameSite=Lax |
`;
const PLAN_DOC = `# Implementation plan: Office Hours

## Milestones

- M1 (Week 22, Wednesday): schema, auth and slots: instructors can publish slots, students can list them.
- M2 (Week 22, Sunday): booking, cancelling, attendance and the no-show block, with tests.
- M3 (Week 23, Sunday): reminders, report, documentation, deployment, load test of booking.

## Tasks

| ID | Task | Estimate | Depends on | Milestone |
| --- | --- | --- | --- | --- |
| T1 | Repository, CI, Docker Compose with PostgreSQL and Redis | 4h | - | M1 |
| T2 | Migrations for the schema, seed script | 4h | T1 | M1 |
| T3 | Login, sessions, logout, rate limit | 1d | T2 | M1 |
| T4 | Roles and course membership checks | 4h | T3 | M1 |
| T5 | POST /slots with validation and overlap error | 4h | T4 | M1 |
| T6 | GET /instructors/{id}/slots with date range | 4h | T5 | M1 |
| T7 | POST /bookings with the unique-index race handled | 1d | T6 | M2 |
| T8 | DELETE /bookings/{id} with the 2-hour rule | 4h | T7 | M2 |
| T9 | PATCH /bookings/{id} attendance and audit log | 4h | T7 | M2 |
| T10 | No-show block rule and its tests | 4h | T9 | M2 |
| T11 | Authorization test matrix | 1d | T10 | M2 |
| T12 | Reminder scan in the worker, with lock and reminded_at | 1d | T7 | M3 |
| T13 | Weekly report endpoint | 4h | T9 | M3 |
| T14 | OpenAPI served at /docs, README | 4h | T13 | M3 |
| T15 | Deployment pipeline and production deploy | 1d | T14 | M3 |
| T16 | Load test of booking at 50 requests per second | 4h | T15 | M3 |

## Risks

- The Monday peak: mitigated by the database constraint (correctness) and the load test in T16 (speed).
- Time zones: all times stored as timestamptz, displayed in Africa/Lagos; tests cover the hour boundaries.
`;

/* ── Check helpers for the diagrams ───────────────────────────────────── */

/** Check preamble: the first mermaid flowchart's node ids, labels and edges. */
const FLOW = (p) => `const flowDoc = file(${JSON.stringify(p)}) || ""; const flowBlock = (/\`\`\`mermaid\\s*([\\s\\S]*?)\`\`\`/.exec(flowDoc) || [])[1] || ""; assert(/^\\s*(flowchart|graph)\\b/.test(flowBlock), "a \`\`\`mermaid block starting with flowchart"); const NODE = "([A-Za-z_][\\\\w]*)(?:\\\\[\\\\((?:[^)]*)\\\\)\\\\]|\\\\[\\\\[[^\\\\]]*\\\\]\\\\]|\\\\[[^\\\\]]*\\\\]|\\\\(\\\\([^)]*\\\\)\\\\)|\\\\([^)]*\\\\)|\\\\{[^}]*\\\\})?"; const edgeRe = new RegExp(NODE + "\\\\s*-{2,3}>(?:\\\\|([^|]*)\\\\|)?\\\\s*" + NODE, "g"); const edges = [...flowBlock.matchAll(edgeRe)].map((m) => ({ from: m[1], to: m[3], label: (m[2] || "").trim() })); const nodes = new Set(edges.flatMap((e) => [e.from, e.to])); const edge = (a, b) => edges.find((e) => e.from === a && e.to === b);`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 145 · 21.1 – 21.2 · REQUIREMENTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l145-requirements",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["21.1", "21.2"],
    title: "Requirements Gathering, User Stories, Functional and Non-Functional Requirements",
    subtitle: "Knowing what to build before building it",
    estimatedMinutes: 90,
    intro:
      "The capstone starts with words, not code. This week turns one brief, Office Hours, into a specification precise enough that another engineer could build it; the deliverable then does the same for your own project.",
    atoms: [
      {
        id: "a-be-user-stories",
        title: "Requirements gathering and user stories",
        explain:
          "Requirements come from people: interview the users (students, instructors, admins), watch how they work today, and collect the failures they live with (double bookings, no-shows). A USER STORY captures one need from one role: \"As a <role>, I want <capability> so that <benefit>\". The benefit says why, which helps choose between designs. Each story gets a PRIORITY (MoSCoW: Must, Should, Could, Won't) and ACCEPTANCE CRITERIA written as Given / when / then examples, including the edge cases (two students at the same moment, cancelling too late). Small, independent, testable stories become the plan's tasks.",
        nodeLab: {
          task:
            "Read BRIEF.md and write STORIES.md: at least 6 stories, each a section \"### US-<n>: <title>\" containing the line \"As a <role>, I want … so that ….\", a line \"Priority: Must|Should|Could|Won't\", and an \"Acceptance criteria:\" list with at least two \"Given …, when …, then …\" items. Cover all three roles (student, instructor, admin) and the brief's rules: publishing slots, booking, cancelling (with the 2-hour limit), reminders, attendance and the no-show block. Mark at least three stories Must.",
          command: false,
          files: { "BRIEF.md": BRIEF, "STORIES.md": "# User stories: Office Hours\n" },
          readOnly: ["BRIEF.md"],
          open: "STORIES.md",
          solution: { "STORIES.md": STORIES },
          tests: [
            { label: "Stories in the standard form", check: `const parts = (file("STORIES.md") || "").split(/^### /m).slice(1); assert(parts.length >= 6, "at least 6 stories as ### US-<n>: <title> sections (found " + parts.length + ")"); parts.forEach((p, i) => { const title = p.split("\\n")[0]; assert(/^US-\\d+:\\s*\\S/.test(title), "story " + (i + 1) + " is titled US-<n>: <title> (" + title + ")"); assert(/^As an? (student|instructor|admin), I want .+ so that .+\\.$/m.test(p), title + ": a line As a <role>, I want … so that …."); assert(/^Priority: (Must|Should|Could|Won't)\\s*$/m.test(p), title + ": Priority: Must, Should, Could or Won't"); const ac = p.split(/^Acceptance criteria:\\s*$/m)[1] || ""; const items = ac.split("\\n").filter((l) => /^\\s*-\\s*Given\\b.+\\bwhen\\b.+\\bthen\\b/i.test(l)); assert(items.length >= 2, title + ": at least two acceptance criteria as - Given …, when …, then …"); });` },
            { label: "Every role, every rule of the brief", check: `const t = file("STORIES.md") || ""; for (const role of ["student", "instructor", "admin"]) assert(new RegExp("^As an? " + role + ",", "m").test(t), "a story for the " + role); for (const [re, what] of [[/publish|availability/i, "publishing slots"], [/\\bbook/i, "booking"], [/cancel/i, "cancelling"], [/2 hours|two hours/i, "the 2-hour cancellation limit"], [/remind/i, "reminders"], [/attend/i, "attendance"], [/no-show/i, "the no-show block"]]) assert(re.test(t), "cover " + what); assert((t.match(/^Priority: Must\\s*$/gm) || []).length >= 3, "at least three Must stories");` },
            { label: "Edge cases in the criteria", check: `const t = (file("STORIES.md") || "").toLowerCase(); assert(/same (moment|time)|at once|simultaneous|concurrent/.test(t), "an acceptance criterion for two students booking the same slot at the same moment"); assert(/(90 minutes|1 hour|an hour|less than 2 hours|too late)/.test(t), "a criterion for cancelling too late");` },
          ],
          hint: "One story per need, from the person who has it. The criteria are examples a tester could run: Given <a situation>, when <an action>, then <a result>. Include the awkward cases: the race for a slot, the cancellation at 90 minutes.",
          successMessage: "The brief is now a set of needs with reasons, priorities and test-ready examples, including the edge cases that cause real bugs.",
        },
      },
      {
        id: "a-be-functional-nonfunctional",
        title: "Functional and non-functional requirements",
        explain:
          "FUNCTIONAL requirements say what the system does (FR-4: students can book a free slot; a slot has at most one active booking). NON-FUNCTIONAL requirements say how well: performance, availability, security, privacy, reliability, operability, each MEASURABLE (p95 under 300 ms at 50 bookings per second; 99.5% availability), because \"fast\" and \"secure\" cannot be tested and therefore cannot be met. Number every requirement so designs, tests and the traceability table can point to it.",
        nodeLab: {
          task:
            "Write REQUIREMENTS.md with a ## Functional section of at least 8 items \"- FR-<n>: …\" (numbered from 1 without gaps) covering the brief, and a ## Non-functional section of at least 6 items \"- NFR-<n> (<category>): …\" with at least the categories Performance, Availability, Security, Privacy and Reliability. Every NFR must contain a number with a unit (ms, %, seconds, minutes, hours, days, requests per second…), and none may lean on vague words alone (fast, secure, scalable, user-friendly, robust).",
          command: false,
          files: { "BRIEF.md": BRIEF, "STORIES.md": STORIES, "REQUIREMENTS.md": "# Requirements: Office Hours\n" },
          readOnly: ["BRIEF.md", "STORIES.md"],
          open: "REQUIREMENTS.md",
          solution: { "REQUIREMENTS.md": REQUIREMENTS },
          tests: [
            { label: "Numbered functional requirements", check: `const t = file("REQUIREMENTS.md") || ""; const fr = section(t, "Functional").split("\\n").filter((l) => /^\\s*-\\s*FR-\\d+:/.test(l)); assert(fr.length >= 8, "at least 8 functional requirements (- FR-<n>: …), found " + fr.length); eq(fr.map((l) => Number(/FR-(\\d+)/.exec(l)[1])), fr.map((_, i) => i + 1), "numbered FR-1, FR-2, … without gaps"); const all = fr.join(" ").toLowerCase(); for (const [re, what] of [[/publish|slot/, "publishing slots"], [/book/, "booking"], [/cancel/, "cancelling"], [/remind/, "reminders"], [/attend|no-show/, "attendance"], [/report/, "the report"]]) assert(re.test(all), "a functional requirement for " + what);` },
            { label: "Measurable non-functional requirements", check: `const t = file("REQUIREMENTS.md") || ""; const nfr = section(t, "Non-functional").split("\\n").filter((l) => /^\\s*-\\s*NFR-\\d+/.test(l)); assert(nfr.length >= 6, "at least 6 non-functional requirements, found " + nfr.length); for (const l of nfr) { assert(/^\\s*-\\s*NFR-\\d+ \\(([A-Za-z ]+)\\):/.test(l), "format - NFR-<n> (<category>): … : " + l.trim()); assert(/\\d+(\\.\\d+)?\\s*(ms|%|seconds?|minutes?|hours?|days?|requests?|per second|concurrent)/i.test(l), "every NFR needs a number with a unit: " + l.trim()); } const cats = nfr.map((l) => (/\\(([^)]+)\\)/.exec(l) || [])[1]); for (const c of ["Performance", "Availability", "Security", "Privacy", "Reliability"]) assert(cats.includes(c), "a " + c + " requirement");` },
            { label: "No requirement rests on a vague word alone", check: `const t = section(file("REQUIREMENTS.md") || "", "Non-functional"); for (const l of t.split("\\n").filter((x) => /NFR-\\d+/.test(x))) { const vague = /\\b(fast|quick|secure|scalable|user-friendly|robust|reliable)\\b/i.exec(l.replace(/\\([^)]*\\)/, "")); if (vague) assert(/\\d/.test(l), l.trim() + ": '" + vague[1] + "' needs a measurable target"); } assert(/p95|95th percentile/i.test(t), "state latency as a percentile (p95)");` },
          ],
          hint: "Functional: one line per capability, from the stories. Non-functional: for each quality, the number that would prove it (p95 300 ms at 50 requests per second; 99.5% per 30 days; data deleted after 365 days; reminder within 10 minutes).",
          successMessage: "Every requirement now has an id and every quality a number: each can be designed for, tested and traced.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 146 · 21.3, 21.5 · SCHEMA AND ER DIAGRAM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l146-schema-api",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["21.3", "21.4"],
    title: "Database Schema Design and API Contract Design",
    subtitle: "The data, and the promises built on it",
    estimatedMinutes: 90,
    intro: "The data model outlives every other design decision, and the API contract is the promise built on top of it. Office Hours has one rule that must never break, one active booking per slot: the schema makes it impossible to break, and the contract says what clients hear when they try.",
    atoms: [
      {
        id: "a-be-schema-design",
        title: "Database schema design",
        explain:
          "Design the schema from the requirements: one table per entity (users, courses, course_members, slots, bookings), primary and foreign keys, NOT NULL wherever a value is required, CHECK constraints for the rules of a single row (a slot lasts exactly 20 minutes; a status is one of four), UNIQUE constraints for the rules across rows (an instructor's slots start at different times), and a PARTIAL unique index when the rule applies to some rows only (one booking per slot that is not cancelled). Constraints are the only defence that holds under concurrency, bugs and manual fixes. Add the indexes the main queries need.",
        nodeLab: {
          task:
            "Write schema.sql for Office Hours (node apply.js runs it): users (role student, instructor or admin), courses, course_members (course_id, user_id, role student or instructor; primary key of both ids), slots (instructor_id, course_id, starts_at, ends_at: exactly 20 minutes, starting on a quarter hour; unique per instructor and start time) and bookings (slot_id, student_id, status booked, cancelled, attended or no_show, default booked; created_at, cancelled_at, reminded_at). At most one booking per slot that is not cancelled, enforced by the database. Index bookings by student and slots by course and start time.",
          command: false,
          db: "SELECT 1;\n",
          files: {
            "package.json": pkg({ name: "office-hours", scripts: { start: "node --env-file=.env apply.js" }, deps: ["pg"] }),
            ".env": "DATABASE_URL=postgresql://academy_app:app-password@localhost:5432/academy\n",
            "apply.js": 'import { readFileSync } from "node:fs";\nimport pg from "pg";\n\nconst client = new pg.Client({ connectionString: process.env.DATABASE_URL });\nawait client.connect();\ntry {\n  await client.query(readFileSync("schema.sql", "utf8"));\n  console.log("schema applied");\n} catch (err) {\n  console.error(`schema.sql failed: ${err.message}`);\n  process.exitCode = 1;\n} finally {\n  await client.end();\n}\n',
            "BRIEF.md": BRIEF,
            "schema.sql": "-- Office Hours: schema\n",
          },
          readOnly: ["package.json", ".env", "apply.js", "BRIEF.md"],
          open: "schema.sql",
          solution: { "schema.sql": SCHEMA },
          tests: [
            { label: "PostgreSQL accepts the schema", check: `await run("node --env-file=.env apply.js"); eq(stdout().trim(), "schema applied", "node apply.js (" + stderr().trim() + ")"); const t = (await sql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1")).map((r) => r.table_name); for (const n of ["bookings", "course_members", "courses", "slots", "users"]) assert(t.includes(n), "a table " + n);` },
            { label: "Single-row rules: roles, statuses, 20-minute quarter-hour slots", check: `const code = async (q) => { try { await sql(q); return null; } catch (e) { return e.code; } }; await sql("INSERT INTO users (email, full_name, role) VALUES ('ngozi@example.com', 'Ngozi Eze', 'instructor'), ('ada@example.com', 'Ada Obi', 'student')"); eq(await code("INSERT INTO users (email, full_name, role) VALUES ('x@example.com', 'X', 'superuser')"), "23514", "a role outside student, instructor, admin"); await sql("INSERT INTO courses (code, title) VALUES ('BE-101', 'Backend Engineering')"); const ids = await sql("SELECT (SELECT id FROM users WHERE role = 'instructor') AS i, (SELECT id FROM users WHERE role = 'student') AS s, (SELECT id FROM courses) AS c"); const { i, s, c } = ids[0]; eq(await code("INSERT INTO course_members (course_id, user_id, role) VALUES (" + c + ", " + i + ", 'admin')"), "23514", "course_members.role is student or instructor"); eq(await code("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES (" + i + ", " + c + ", '2026-11-02 10:00+01', '2026-11-02 10:30+01')"), "23514", "a 30-minute slot"); eq(await code("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES (" + i + ", " + c + ", '2026-11-02 10:07+01', '2026-11-02 10:27+01')"), "23514", "a slot at 10:07"); eq(await code("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES (" + i + ", " + c + ", '2026-11-02 10:00+01', '2026-11-02 10:20+01')"), null, "a valid slot"); const slot = (await sql("SELECT id FROM slots"))[0].id; eq(await code("INSERT INTO bookings (slot_id, student_id, status) VALUES (" + slot + ", " + s + ", 'maybe')"), "23514", "an unknown booking status"); eq(await code("INSERT INTO bookings (slot_id, student_id) VALUES (999, " + s + ")"), "23503", "a booking for a slot that does not exist");` },
            { label: "Cross-row rules: one start per instructor, one active booking per slot", check: `const code = async (q) => { try { await sql(q); return null; } catch (e) { return e.code; } }; const { i, c, s } = (await sql("SELECT (SELECT id FROM users WHERE role = 'instructor') AS i, (SELECT id FROM courses) AS c, (SELECT id FROM users WHERE role = 'student') AS s"))[0]; eq(await code("INSERT INTO slots (instructor_id, course_id, starts_at, ends_at) VALUES (" + i + ", " + c + ", '2026-11-02 10:00+01', '2026-11-02 10:20+01')"), "23505", "a second slot at the same time for the same instructor"); const slot = (await sql("SELECT id FROM slots"))[0].id; await sql("INSERT INTO users (email, full_name, role) VALUES ('bayo@example.com', 'Bayo', 'student')"); const b = (await sql("SELECT id FROM users WHERE email = 'bayo@example.com'"))[0].id; eq(await code("INSERT INTO bookings (slot_id, student_id) VALUES (" + slot + ", " + s + ")"), null, "Ada books"); eq(await code("INSERT INTO bookings (slot_id, student_id) VALUES (" + slot + ", " + b + ")"), "23505", "Bayo cannot book the same slot"); await sql("UPDATE bookings SET status = 'cancelled', cancelled_at = now() WHERE student_id = " + s); eq(await code("INSERT INTO bookings (slot_id, student_id) VALUES (" + slot + ", " + b + ")"), null, "after Ada cancels, Bayo can (cancelled bookings stay, but do not hold the slot)"); eq((await sql("SELECT status FROM bookings WHERE student_id = " + b))[0].status, "booked", "status defaults to booked");` },
            { label: "Indexes for the main queries", check: `const idx = (await sql("SELECT tablename, indexdef FROM pg_indexes WHERE schemaname = 'public'")).map((r) => r.tablename + ": " + r.indexdef); assert(idx.some((d) => /^bookings: .*\\(student_id/.test(d)), "an index on bookings starting with student_id"); assert(idx.some((d) => /^slots: .*\\(course_id, starts_at/.test(d)), "an index on slots (course_id, starts_at)"); assert(idx.some((d) => /^bookings: CREATE UNIQUE INDEX .*\\(slot_id\\) WHERE/.test(d)), "the one-active-booking rule as a partial unique index on bookings (slot_id) WHERE …");` },
          ],
          hint: "CHECK (ends_at - starts_at = interval '20 minutes'); CHECK (extract(minute FROM starts_at)::int % 15 = 0); UNIQUE (instructor_id, starts_at). The booking rule: CREATE UNIQUE INDEX … ON bookings (slot_id) WHERE status <> 'cancelled'.",
          successMessage: "The database now makes double booking impossible, whatever the code does, and rejects every malformed slot and status.",
        },
      },
      {
        id: "a-be-api-contract",
        title: "API contract design",
        explain:
          "An OpenAPI document is the API's contract: every path and method, its parameters, request body, and every response (success and each error) with schemas. Design it from the stories, resource by resource (slots, bookings), with the conventions of Weeks 6 and 8: nouns in paths, 201 for creation, 204 for deletion, 409 for rule conflicts, one Error schema ({ error: { code, message } }) for every 4xx, and a security scheme that applies to everything. Front-end and back-end then work in parallel against the same file, and Week 16's contract tests keep the implementation honest.",
        nodeLab: {
          task:
            "Write openapi.yaml (OpenAPI 3.1) for Office Hours with these operations and operationIds: GET /instructors/{id}/slots (listSlots; query from and to, required), POST /slots (createSlot; 201, 409), POST /bookings (createBooking; 201, 403, 409), DELETE /bookings/{id} (cancelBooking; 204, 409), PATCH /bookings/{id} (markAttendance; 200, 403, 409), GET /me/bookings (listMyBookings) and GET /reports/weekly (weeklyReport; 403). A cookieAuth security scheme (cookie sid) applied globally; schemas Error, Slot, NewSlot, Booking and ReportRow; every 4xx response uses the Error schema, and every operation documents 401.",
          command: false,
          files: { "package.json": DOC_PKG, "STORIES.md": STORIES, "openapi.yaml": "openapi: 3.1.0\n" },
          readOnly: ["package.json", "STORIES.md"],
          open: "openapi.yaml",
          solution: { "openapi.yaml": OPENAPI_YAML },
          tests: [
            { label: "The operations, with their ids", check: `${YAML} const api = yamlOf("openapi.yaml"); assert(/^3\\.1/.test(String(api.openapi)), "openapi: 3.1.x"); assert(api.info?.title && api.info?.version, "info.title and info.version"); const want = ${JSON.stringify(Object.fromEntries(Object.entries(OPENAPI.paths).flatMap(([p, ops]) => Object.entries(ops).map(([m, o]) => [`${m.toUpperCase()} ${p}`, o.operationId]))))}; for (const [op, id] of Object.entries(want)) { const [m, p] = op.split(" "); const o = api.paths?.[p]?.[m.toLowerCase()]; assert(o, "the operation " + op); eq(o.operationId, id, op + " operationId"); }` },
            { label: "Status codes that match the rules", check: `${YAML} const api = yamlOf("openapi.yaml"); const codes = (p, m) => Object.keys(api.paths?.[p]?.[m]?.responses || {}).map(String); const need = { "/slots post": ["201", "409"], "/bookings post": ["201", "403", "409"], "/bookings/{id} delete": ["204", "409"], "/bookings/{id} patch": ["200", "403", "409"], "/reports/weekly get": ["200", "403"], "/instructors/{id}/slots get": ["200"], "/me/bookings get": ["200"] }; for (const [k, list] of Object.entries(need)) { const [p, m] = k.split(" "); for (const c of [...list, "401"]) assert(codes(p, m).includes(c), m.toUpperCase() + " " + p + " documents " + c); } const q = (api.paths?.["/instructors/{id}/slots"]?.get?.parameters || []).filter((x) => x.in === "query" && x.required).map((x) => x.name).sort(); eq(q, ["from", "to"], "listSlots: required query parameters from and to");` },
            { label: "One error shape and a global security scheme", check: `${YAML} const api = yamlOf("openapi.yaml"); const sch = api.components?.securitySchemes?.cookieAuth; eq([sch?.type, sch?.in, sch?.name], ["apiKey", "cookie", "sid"], "components.securitySchemes.cookieAuth: apiKey in the cookie sid"); assert((api.security || []).some((s) => "cookieAuth" in s), "security: [{ cookieAuth: [] }] at the top level"); for (const n of ["Error", "Slot", "NewSlot", "Booking", "ReportRow"]) assert(api.components?.schemas?.[n], "schema " + n); const e = api.components.schemas.Error; assert(e.properties?.error?.properties?.code && e.properties?.error?.properties?.message, "Error: { error: { code, message } }"); for (const [p, ops] of Object.entries(api.paths || {})) for (const [m, o] of Object.entries(ops)) for (const [c, r] of Object.entries(o.responses || {})) if (/^4/.test(String(c))) eq(r?.content?.["application/json"]?.schema?.$ref, "#/components/schemas/Error", m.toUpperCase() + " " + p + " " + c + " uses the Error schema");` },
          ],
          hint: "Start from components (the security scheme and the five schemas), then one path at a time. A reusable 4xx response: { description, content: { application/json: { schema: { $ref: \"#/components/schemas/Error\" } } } }.",
          successMessage: "The whole API exists on paper: the web app can be built against it today, and every rule has its status code.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 147 · 21.4, 21.6 · API CONTRACT AND AUTH DESIGN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l147-erd-auth",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["21.5", "21.6"],
    title: "Entity-Relationship Diagrams, and Authentication and Authorization Design",
    subtitle: "Seeing the data, and deciding who may touch it",
    estimatedMinutes: 100,
    intro: "Two reviews of the design so far: a diagram that shows the data model at a glance, and an access matrix that answers, for every operation of the contract, who may call it.",
    atoms: [
      {
        id: "a-be-erd-diagrams",
        title: "Entity-relationship diagrams",
        explain:
          "An ER DIAGRAM shows entities, their keys and the CARDINALITY of each relationship (one, zero or one, zero or more, one or more), which is where design discussions happen: can a slot have several bookings? (yes, over time; only one active). Mermaid's erDiagram keeps the diagram as text in the repository, reviewed with the schema it describes: a ||--o{ b means one a has zero or more b. Keep it in step with schema.sql, and write down in a sentence any rule the notation cannot show.",
        nodeLab: {
          task:
            "Write docs/erd.md with a ```mermaid erDiagram for schema.sql: entities USER, COURSE, COURSE_MEMBER, SLOT and BOOKING with their columns (id PK, foreign keys FK), and the relationships USER ||--o{ COURSE_MEMBER, COURSE ||--o{ COURSE_MEMBER, USER ||--o{ SLOT, COURSE ||--o{ SLOT, SLOT ||--o{ BOOKING and USER ||--o{ BOOKING, each with a label. Below it, a sentence explaining the one-active-booking rule.",
          command: false,
          files: { "schema.sql": SCHEMA, "docs/erd.md": "# Office Hours: entity-relationship diagram\n" },
          readOnly: ["schema.sql"],
          open: "docs/erd.md",
          solution: { "docs/erd.md": ERD_DOC },
          tests: [
            { label: "Five entities with keys", check: `${PARSE_ERD("docs/erd.md")} for (const e of ["USER", "COURSE", "COURSE_MEMBER", "SLOT", "BOOKING"]) assert(entities[e] && entities[e].length, "an entity " + e + " with its columns"); for (const e of ["USER", "COURSE", "SLOT", "BOOKING"]) assert(entities[e].some((a) => a.name === "id" && a.keys.includes("PK")), e + ": int id PK"); const fk = (e, n) => entities[e].some((a) => a.name === n && a.keys.includes("FK")); assert(fk("SLOT", "instructor_id") && fk("SLOT", "course_id"), "SLOT: instructor_id FK, course_id FK"); assert(fk("BOOKING", "slot_id") && fk("BOOKING", "student_id"), "BOOKING: slot_id FK, student_id FK"); assert(fk("COURSE_MEMBER", "course_id") && fk("COURSE_MEMBER", "user_id"), "COURSE_MEMBER: course_id and user_id are FKs (and together the PK)");` },
            { label: "Relationships and cardinalities", check: `${PARSE_ERD("docs/erd.md")} for (const [a, b] of [["USER", "COURSE_MEMBER"], ["COURSE", "COURSE_MEMBER"], ["USER", "SLOT"], ["COURSE", "SLOT"], ["SLOT", "BOOKING"], ["USER", "BOOKING"]]) { const r = rel(a, b); assert(r, "connect " + a + " and " + b); eq([r.left, r.right], ["||", "o{"], a + " ||--o{ " + b); assert(r.label, a + "–" + b + " needs a label"); }` },
            { label: "The rule the diagram cannot show is written down", check: `const t = (file("docs/erd.md") || "").split(/\`\`\`/).filter((_, i) => i % 2 === 0).join(" ").toLowerCase(); assert(/(one|single|at most).{0,40}(active|not cancelled)/.test(t) && /(unique|index)/.test(t), "explain, outside the diagram, that a slot has at most one active booking and how it is enforced");` },
          ],
          hint: "erDiagram, then one line per relationship (USER ||--o{ SLOT : publishes), then a block per entity: SLOT { int id PK  int instructor_id FK … }. Under the closing ``` add the sentence about the partial unique index.",
          successMessage: "The data model can now be reviewed at a glance, and the one rule the notation cannot express is written right under it.",
        },
      },
      {
        id: "a-be-auth-design",
        title: "Authentication and authorization design",
        explain:
          "Decide authentication once, with reasons: sessions in an HttpOnly cookie suit a first-party web app and can be revoked instantly; tokens suit third-party and mobile clients. Then design AUTHORIZATION as a matrix: every operation of the contract against every role, with the answer (yes, no, own records only, with conditions). The matrix is the specification Week 14's tests implement, cell by cell; an operation missing from it is an operation nobody thought about.",
        nodeLab: {
          task:
            "Write AUTH.md: ## Authentication (the mechanism, its cookie or token settings, and why), ## Roles (student, instructor, admin and what each does) and ## Access matrix, a table with one row per operation in openapi.yaml (\"GET /instructors/{id}/slots\", …) and the columns student, instructor and admin, each cell yes, no, own or a short condition. Every operation in the contract must appear, and nothing else.",
          command: false,
          files: { "package.json": DOC_PKG, "openapi.yaml": OPENAPI_YAML, "AUTH.md": "# Authentication and authorization: Office Hours\n" },
          readOnly: ["package.json", "openapi.yaml"],
          open: "AUTH.md",
          solution: { "AUTH.md": AUTH_DOC },
          tests: [
            { label: "Authentication, with its reasons and settings", check: `const a = section(file("AUTH.md") || "", "Authentication"); assert(a.split(/\\s+/).length >= 30, "## Authentication: describe it (30+ words)"); assert(/session|token|jwt/i.test(a), "name the mechanism"); assert(/because|so that|rather than|instead of/i.test(a), "say why this mechanism"); if (/cookie/i.test(a)) for (const f of ["HttpOnly", "Secure", "SameSite"]) has(a, f, "the cookie's " + f + " flag"); const r = section(file("AUTH.md") || "", "Roles").toLowerCase(); for (const role of ["student", "instructor", "admin"]) has(r, role, "## Roles: " + role);` },
            { label: "The matrix covers exactly the contract's operations", check: `${MD} ${YAML} const api = yamlOf("openapi.yaml"); const ops = Object.entries(api.paths).flatMap(([p, o]) => Object.keys(o).map((m) => m.toUpperCase() + " " + p)).sort(); const rows = tableRows(section(md("AUTH.md"), "Access matrix")); assert(rows.length > 1, "a table under ## Access matrix"); const head = rows[0].map((c) => c.toLowerCase()); eq(head.slice(1), ["student", "instructor", "admin"], "columns: Operation, student, instructor, admin"); const listed = rows.slice(1).map((r) => r[0].replace(/\`/g, "")).sort(); eq(listed, ops, "one row per operation in openapi.yaml"); for (const r of rows.slice(1)) for (const cell of r.slice(1)) assert(cell && /^(yes|no|own)\\b/i.test(cell), r[0] + ": every cell starts with yes, no or own (got '" + cell + "')");` },
            { label: "The decisions are the right ones", check: `${MD} const rows = Object.fromEntries(tableRows(section(md("AUTH.md"), "Access matrix")).slice(1).map((r) => [r[0].replace(/\`/g, ""), r.slice(1).map((c) => c.toLowerCase())])); const cell = (op, i) => (rows[op] || [])[i] || ""; assert(/^no/.test(cell("GET /reports/weekly", 0)) && /^no/.test(cell("GET /reports/weekly", 1)) && /^yes/.test(cell("GET /reports/weekly", 2)), "the report: admins only"); assert(/^own/.test(cell("DELETE /bookings/{id}", 0)), "students cancel only their own bookings"); assert(/^no/.test(cell("PATCH /bookings/{id}", 0)), "students never mark attendance"); assert(/^own/.test(cell("PATCH /bookings/{id}", 1)), "instructors mark attendance on their own slots only"); assert(/^no/.test(cell("POST /bookings", 2)), "admins do not book");` },
          ],
          hint: "Copy the operation list from openapi.yaml (method and path, exactly). For each cell ask: may this role call it at all (yes/no), or only for its own records (own)? Add the condition in brackets where it matters: yes (enrolled courses).",
          successMessage: "Every operation now has an explicit answer for every role, ready to be implemented and tested cell by cell.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 148 · 21.7 – 21.8 · ARCHITECTURE AND THREATS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l148-architecture-threats",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["21.7", "21.8"],
    title: "Architecture Diagrams and Threat Modeling",
    subtitle: "How the parts fit, and how they could be attacked",
    estimatedMinutes: 90,
    intro: "A diagram of the running system shows what talks to what; a threat model walks that diagram as an attacker would. Both fit on a page and both catch design mistakes while they are cheap.",
    atoms: [
      {
        id: "a-be-architecture-diagram",
        title: "Architecture diagrams",
        explain:
          "An architecture diagram at the CONTAINER level (the C4 model's second level) shows the deployable and external parts and how they communicate: the client, the API, the worker, the database, Redis, the email provider, with each arrow labelled by protocol or purpose. Keep it as Mermaid text next to the code, explain each component in a sentence, and walk through the most important flow (the Monday 09:00 booking peak) to show the design meets the non-functional requirements.",
        nodeLab: {
          task:
            "Write docs/architecture.md: a ```mermaid flowchart with the nodes browser, api, worker, postgres, redis and smtp, and labelled arrows browser → api, api → postgres, api → redis, worker → redis, worker → postgres and worker → smtp (and no arrow from api or browser to smtp: email goes through the worker). Then ## Components (a line for each of the six) and ## Key flows (the booking peak, mentioning the unique index and that no email is sent inside the request).",
          command: false,
          files: { "REQUIREMENTS.md": REQUIREMENTS, "docs/architecture.md": "# Office Hours: architecture\n" },
          readOnly: ["REQUIREMENTS.md"],
          open: "docs/architecture.md",
          solution: { "docs/architecture.md": ARCH_DOC },
          tests: [
            { label: "The six parts and their connections", check: `${FLOW("docs/architecture.md")} for (const n of ["browser", "api", "worker", "postgres", "redis", "smtp"]) assert(nodes.has(n), "a node with the id " + n); for (const [a, b] of [["browser", "api"], ["api", "postgres"], ["api", "redis"], ["worker", "redis"], ["worker", "postgres"], ["worker", "smtp"]]) { const e = edge(a, b); assert(e, "an arrow " + a + " --> " + b); assert(e.label, a + " --> " + b + " needs a label (-->|what| )"); } assert(!edge("api", "smtp") && !edge("browser", "smtp"), "email goes through the worker, never from the API or the browser");` },
            { label: "Components and the key flow explained", check: `const t = file("docs/architecture.md") || ""; const comps = section(t, "Components").toLowerCase(); for (const n of ["browser", "api", "worker", "postgres", "redis", "smtp"]) assert(comps.includes(n), "## Components: explain " + n); const flow = section(t, "Key flows").toLowerCase(); assert(/(peak|monday|09:00)/.test(flow), "## Key flows: the booking peak"); assert(/unique|constraint|index/.test(flow), "how double bookings are prevented under load"); assert(/(no|not|never)[^.]*email|email[^.]*(later|worker)/.test(flow), "that email is not sent inside the request");` },
          ],
          hint: "flowchart LR, then one arrow per line: browser[Web app] -->|HTTPS| api[API]. Database nodes look nice as postgres[(PostgreSQL)]. Under the diagram, the two sections in plain sentences.",
          successMessage: "One page now shows every part of Office Hours, how they talk, and how the busiest moment of the week is handled.",
        },
      },
      {
        id: "a-be-threat-model",
        title: "Threat modeling",
        explain:
          "THREAT MODELING asks, for each part and data flow: what could go wrong? STRIDE is a checklist: Spoofing (pretending to be someone), Tampering (changing data), Repudiation (denying an action), Information disclosure, Denial of service, Elevation of privilege. For each threat record the asset at risk, the MITIGATION, and the TEST that proves it, so the model turns into work in the plan rather than a document nobody reads. Revisit it whenever the architecture changes.",
        nodeLab: {
          task:
            "Write THREATS.md: a line naming the assets, then a table with the columns Threat, STRIDE, Asset, Mitigation, Test and at least 6 rows. Use every STRIDE category at least once (written in full: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege). Include cancelling another student's booking by changing the id, and a student marking their own attendance. Every mitigation and every test must be concrete (a test says what is sent and what must come back).",
          command: false,
          files: { "AUTH.md": AUTH_DOC, "docs/architecture.md": ARCH_DOC, "THREATS.md": "# Threat model: Office Hours\n" },
          readOnly: ["AUTH.md", "docs/architecture.md"],
          open: "THREATS.md",
          solution: { "THREATS.md": THREATS_DOC },
          tests: [
            { label: "A STRIDE table", check: `${MD} const rows = tableRows(md("THREATS.md")); assert(rows.length >= 7, "a table with a header and at least 6 threats"); eq(rows[0].map((c) => c.toLowerCase()), ["threat", "stride", "asset", "mitigation", "test"], "columns Threat, STRIDE, Asset, Mitigation, Test"); const cats = new Set(rows.slice(1).map((r) => r[1])); for (const c of ["Spoofing", "Tampering", "Repudiation", "Information disclosure", "Denial of service", "Elevation of privilege"]) assert(cats.has(c), "a threat in the category " + c); assert(/assets?:/i.test(md("THREATS.md")), "name the assets");` },
            { label: "Concrete mitigations and tests", check: `${MD} for (const r of tableRows(md("THREATS.md")).slice(1)) { assert(words(r[3]) >= 4, r[0] + ": a concrete mitigation"); assert(words(r[4]) >= 5, r[0] + ": a concrete test"); assert(/\\b(answers?|returns?|gets?|has|writes?|\\d{3})\\b/i.test(r[4]), r[0] + ": the test says what must come back (" + r[4] + ")"); }` },
            { label: "The two classic threats of this API", check: `${MD} const rows = tableRows(md("THREATS.md")).slice(1); const t = (r) => r.join(" ").toLowerCase(); assert(rows.some((r) => /another|someone else|other student/.test(t(r)) && /(id|cancel)/.test(t(r)) && /(own|student_id|404)/.test(t(r))), "cancelling another student's booking by changing the id (and the ownership check that stops it)"); assert(rows.some((r) => /attend|no-show/.test(t(r)) && /(instructor|403)/.test(t(r)) && r[1] === "Elevation of privilege"), "a student marking attendance, as Elevation of privilege, stopped by the instructor-only rule");` },
          ],
          hint: "Walk the architecture diagram: the login (spoofing), each endpoint that takes an id (tampering), the attendance change (repudiation: an audit log), the responses (disclosure), the Monday rush (denial of service), and the instructor-only actions (elevation). Write each test as request → expected answer.",
          successMessage: "Seven ways Office Hours could be attacked, each with the defence and the test that proves it, ready to go into the plan.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 149 · 21.9 – 21.10 · PLANNING AND ACCEPTANCE CRITERIA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l149-planning",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["21.9", "21.10"],
    title: "Project Planning, Task Breakdown and Measurable Acceptance Criteria",
    subtitle: "From a design to a sequence of days",
    estimatedMinutes: 70,
    intro: "A design becomes a project when it is broken into tasks small enough to finish in a day, ordered by what depends on what, and judged by criteria anyone can check.",
    atoms: [
      {
        id: "a-be-planning",
        title: "Project planning and task breakdown",
        explain:
          "Break the work into TASKS of at most one day each (bigger ones hide risk), each with its DEPENDENCIES, and group them into MILESTONES that each end in something demonstrable (M1: instructors publish slots, students see them). Order by risk: do the riskiest part (the concurrent booking rule, the reminder scheduling) early, while there is time to change course. Keep a short risk list with what you will do about each, and re-plan weekly from what actually happened.",
        nodeLab: {
          task:
            "Write PLAN.md: ## Milestones (M1, M2, M3, each with when and what can be demonstrated), ## Tasks (a table with the columns ID, Task, Estimate, Depends on, Milestone: at least 12 tasks T1, T2, …; estimates in hours (4h) or days (1d), none above 1 day; dependencies list existing task ids or -, never a cycle, and never a task in a later milestone; every task belongs to M1, M2 or M3) and ## Risks (at least two, each with its mitigation).",
          command: false,
          files: { "REQUIREMENTS.md": REQUIREMENTS, "openapi.yaml": OPENAPI_YAML, "PLAN.md": "# Implementation plan: Office Hours\n" },
          readOnly: ["REQUIREMENTS.md", "openapi.yaml"],
          open: "PLAN.md",
          solution: { "PLAN.md": PLAN_DOC },
          tests: [
            { label: "Milestones that can be demonstrated", check: `const ms = section(file("PLAN.md") || "", "Milestones").split("\\n").filter((l) => /^\\s*-\\s*M\\d/.test(l)); eq(ms.map((l) => /M(\\d)/.exec(l)[1]), ["1", "2", "3"], "milestones M1, M2, M3"); for (const l of ms) assert(l.split(/\\s+/).length >= 8, "say when and what can be demonstrated: " + l.trim());` },
            { label: "Small tasks with valid dependencies", check: `${MD} const rows = tableRows(section(md("PLAN.md"), "Tasks")); eq(rows[0].map((c) => c.toLowerCase()), ["id", "task", "estimate", "depends on", "milestone"], "columns ID, Task, Estimate, Depends on, Milestone"); const tasks = rows.slice(1).map((r) => ({ id: r[0], estimate: r[2], deps: r[3] === "-" ? [] : r[3].split(/[,\\s]+/).filter(Boolean), ms: r[4] })); assert(tasks.length >= 12, "at least 12 tasks"); const ids = new Set(tasks.map((t) => t.id)); tasks.forEach((t, i) => { eq(t.id, "T" + (i + 1), "task ids T1, T2, … in order"); assert(/^(\\d+(\\.\\d+)?h|0?\\.5d|1d)$/.test(t.estimate) && (t.estimate.endsWith("d") || Number(t.estimate.slice(0, -1)) <= 8), t.id + ": an estimate in hours or days, at most 1 day (" + t.estimate + ")"); assert(["M1", "M2", "M3"].includes(t.ms), t.id + ": milestone M1, M2 or M3"); for (const d of t.deps) { assert(ids.has(d), t.id + " depends on " + d + ", which does not exist"); const dep = tasks.find((x) => x.id === d); assert(dep.ms <= t.ms, t.id + " (" + t.ms + ") cannot depend on " + d + " from a later milestone (" + dep.ms + ")"); } }); const state = {}; const visit = (id, path) => { if (state[id] === 1) assert(false, "a dependency cycle: " + [...path, id].join(" → ")); if (state[id] === 2) return; state[id] = 1; for (const d of tasks.find((t) => t.id === id).deps) visit(d, [...path, id]); state[id] = 2; }; for (const t of tasks) visit(t.id, []);` },
            { label: "Risks with mitigations", check: `const r = section(file("PLAN.md") || "", "Risks").split("\\n").filter((l) => /^\\s*-\\s/.test(l)); assert(r.length >= 2, "at least two risks"); for (const l of r) assert(/(mitigat|by|with|test|limit|cover)/i.test(l) && l.split(/\\s+/).length >= 8, "each risk with what you will do about it: " + l.trim());` },
          ],
          hint: "Walk the contract and the requirements in order of dependency: infrastructure and schema, auth, slots, booking (the riskiest), cancelling and attendance, then reminders, report, docs, deployment and the load test. Split anything bigger than a day.",
          successMessage: "Office Hours is now sixteen day-sized tasks in an order that tackles the risky parts first, with three demonstrable checkpoints.",
        },
      },
      {
        id: "a-be-acceptance",
        title: "Defining measurable acceptance criteria",
        explain:
          "An acceptance criterion is MEASURABLE when two people would agree whether it is met: it names the situation, the action and the observable result, with numbers where quality matters (\"under 100 concurrent attempts for one slot, exactly one booking is created and the others get 409 SLOT_TAKEN\"; \"p95 under 300 ms at 50 bookings per second, measured with the load test against staging\"). Criteria that are measurable become automated tests, and the project is done when they pass, not when it feels finished.",
        decision: decide({
          scenario: "Four acceptance criteria are proposed for booking.",
          question: "Which one is measurable?",
          right: ["\"With 100 concurrent requests for the same free slot, exactly one returns 201 and 99 return 409 SLOT_TAKEN, and the database holds one active booking\"", "Situation, action, observable result, numbers."],
          wrong: [
            ["\"Booking should be fast and reliable\"", "Two people could disagree forever."],
            ["\"Double bookings are handled properly\"", "Properly is not observable."],
            ["\"The booking code is well tested\"", "Says nothing about behaviour."],
          ],
          at: 0,
          aftermath: "Week 22 turns criteria like this into the core tests.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 150 · 21.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l150-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["21.P"],
    title: "Deliverable: A Complete Technical Specification",
    subtitle: "Every requirement traced to a story, an endpoint and a test",
    estimatedMinutes: 120,
    intro: "The specification ties the week's documents together. Its heart is the traceability table: for every requirement, the story that motivates it, the endpoint that delivers it and the test that will prove it.",
    atoms: [
      {
        id: "a-be-specification",
        title: "A technical specification",
        explain:
          "A specification a reviewer can approve states the problem, the scope (what is in, and what is explicitly out), links each design document, records the main decisions, and TRACES every requirement: requirement → story → endpoint (or component) → test. Gaps in the trace are where projects go wrong: a requirement with no endpoint is forgotten, an endpoint with no requirement is scope creep, a requirement with no test is never really done.",
        nodeLab: {
          task:
            "Write SPEC.md: ## Overview (the problem and the solution in a paragraph), ## Scope (### In and ### Out, at least two items each), ## Documents (a link to each of STORIES.md, REQUIREMENTS.md, schema.sql, docs/erd.md, openapi.yaml, AUTH.md, docs/architecture.md, THREATS.md, PLAN.md), ## Decisions (at least three, each with its reason) and ## Traceability: a table with the columns Requirement, Story, Endpoint, Test, one row for every FR and NFR in REQUIREMENTS.md; each Story is a US-<n> from STORIES.md (or - for an NFR), each Endpoint an operation from openapi.yaml or a component of the architecture (worker, postgres…), each Test a concrete description.",
          command: false,
          files: {
            "package.json": DOC_PKG,
            "BRIEF.md": BRIEF,
            "STORIES.md": STORIES,
            "REQUIREMENTS.md": REQUIREMENTS,
            "schema.sql": SCHEMA,
            "docs/erd.md": ERD_DOC,
            "openapi.yaml": OPENAPI_YAML,
            "AUTH.md": AUTH_DOC,
            "docs/architecture.md": ARCH_DOC,
            "THREATS.md": THREATS_DOC,
            "PLAN.md": PLAN_DOC,
            "SPEC.md": "# Office Hours: technical specification\n",
          },
          readOnly: ["package.json", "BRIEF.md", "STORIES.md", "REQUIREMENTS.md", "schema.sql", "docs/erd.md", "openapi.yaml", "AUTH.md", "docs/architecture.md", "THREATS.md", "PLAN.md"],
          open: "SPEC.md",
          solution: {
            "SPEC.md": `# Office Hours: technical specification

## Overview

Instructors' office hours are booked today through chat threads, which causes double bookings, forgotten sessions and no-shows. Office Hours is a backend that lets instructors publish 20-minute slots, students book and cancel them under clear rules, sends reminders, records attendance and blocks repeated no-shows, with a weekly report for admins.

## Scope

### In

- Slots, booking, cancelling, attendance and the no-show block for students, instructors and admins.
- Email reminders 24 hours ahead and the weekly report.
- The API, the worker, deployment and monitoring.

### Out

- Video calls: sessions happen in the existing meeting tool; the booking only stores the time.
- Calendar sync (Google Calendar, Outlook): a possible later phase.
- A mobile app: the existing web app is the only client.

## Documents

- [User stories](STORIES.md)
- [Requirements](REQUIREMENTS.md)
- [Database schema](schema.sql) and [ER diagram](docs/erd.md)
- [API contract](openapi.yaml)
- [Authentication and authorization](AUTH.md)
- [Architecture](docs/architecture.md)
- [Threat model](THREATS.md)
- [Plan](PLAN.md)

## Decisions

- One active booking per slot is enforced by a partial unique index, because only the database is safe under the Monday 09:00 concurrency.
- Sessions in HttpOnly cookies rather than JWTs, because there is one first-party client and immediate revocation matters.
- Reminders are found by a scheduled scan in the worker (with a lock and reminded_at) rather than a job queued at booking time, because cancellations and edits then need no job management.
- A modular monolith (slots, bookings, reports modules) in one deployable, because the team is small and the boundaries can still be enforced in CI.

## Traceability

| Requirement | Story | Endpoint | Test |
| --- | --- | --- | --- |
| FR-1 | US-1 | POST /slots | An instructor of BE-101 publishes a slot at 10:00 and gets 201; a slot at 10:07 gets 400 |
| FR-2 | US-1 | POST /slots | A second slot at the same start time answers 409 SLOT_OVERLAPS |
| FR-3 | US-2 | GET /instructors/{id}/slots | An enrolled student lists free slots for a week; booked slots are not listed |
| FR-4 | US-2 | POST /bookings | 100 concurrent bookings of one slot: one 201, 99 answers 409 SLOT_TAKEN, one active booking |
| FR-5 | US-3 | DELETE /bookings/{id} | Cancelling 3 hours before answers 204; 90 minutes before answers 409 TOO_LATE_TO_CANCEL |
| FR-6 | US-4 | worker | With the clock 24 hours before a booking, the reminder scan sends one email; a cancelled booking gets none |
| FR-7 | US-5 | PATCH /bookings/{id} | The slot's instructor marks a finished booking no_show (200); before the start it answers 409 NOT_FINISHED |
| FR-8 | US-6 | POST /bookings | After two no-shows in 30 days, booking answers 403 BOOKING_BLOCKED for 14 days, then 201 |
| FR-9 | US-7 | GET /reports/weekly | An admin gets the counts per course for a week; a student gets 403 |
| FR-10 | US-2 | GET /me/bookings | A student sees only their own bookings, newest first |
| NFR-1 | - | POST /bookings | The load test at 50 bookings per second shows p95 under 300 ms on staging |
| NFR-2 | - | api | Uptime and error-rate SLO dashboards over 30 days show 99.5% or more |
| NFR-3 | US-2 | postgres | The concurrency test of FR-4 runs in CI on every push |
| NFR-4 | - | api | The authorization matrix test sends every operation as every role and checks the answers of AUTH.md |
| NFR-5 | - | worker | A retention job deletes attendance older than 365 days; the report contains no names |
| NFR-6 | US-4 | worker | Restarting the worker during a scan sends no reminder twice (reminded_at) and none later than 10 minutes |
| NFR-7 | - | postgres | The monthly restore drill completes within 1 hour with at most 5 minutes of data lost |
`,
          },
          tests: [
            { label: "Overview, scope, documents and decisions", check: `const t = file("SPEC.md") || ""; assert(section(t, "Overview").split(/\\s+/).length >= 30, "## Overview: the problem and the solution (30+ words)"); const scope = section(t, "Scope"); const items = (h) => (scope.split(new RegExp("^### " + h + "\\\\s*$", "m"))[1] || "").split(/^### /m)[0].split("\\n").filter((l) => /^\\s*-\\s/.test(l)).length; assert(items("In") >= 2, "### In: at least two items"); assert(items("Out") >= 2, "### Out: at least two items (saying what is NOT built is half of scope)"); const docs = section(t, "Documents"); for (const f of ["STORIES.md", "REQUIREMENTS.md", "schema.sql", "docs/erd.md", "openapi.yaml", "AUTH.md", "docs/architecture.md", "THREATS.md", "PLAN.md"]) assert(docs.includes("](" + f + ")"), "## Documents links " + f); const dec = section(t, "Decisions").split("\\n").filter((l) => /^\\s*-\\s/.test(l)); assert(dec.length >= 3, "at least three decisions"); for (const d of dec) assert(/because|so that|since|as /i.test(d), "each decision with its reason: " + d.trim());` },
            { label: "Every requirement is traced", check: `${MD} const reqs = (file("REQUIREMENTS.md") || "").match(/^\\s*-\\s*(N?FR-\\d+)/gm).map((l) => /(N?FR-\\d+)/.exec(l)[1]); const rows = tableRows(section(md("SPEC.md"), "Traceability")); eq(rows[0]?.map((c) => c.toLowerCase()), ["requirement", "story", "endpoint", "test"], "columns Requirement, Story, Endpoint, Test"); eq(rows.slice(1).map((r) => r[0]).sort(), [...reqs].sort(), "one row per requirement in REQUIREMENTS.md");` },
            { label: "…to stories, endpoints and tests that exist", check: `${MD} ${YAML} const stories = new Set(((file("STORIES.md") || "").match(/^### (US-\\d+)/gm) || []).map((l) => l.slice(4))); const api = yamlOf("openapi.yaml"); const ops = new Set(Object.entries(api.paths).flatMap(([p, o]) => Object.keys(o).map((m) => m.toUpperCase() + " " + p))); const components = ["browser", "api", "worker", "postgres", "redis", "smtp"]; for (const r of tableRows(section(md("SPEC.md"), "Traceability")).slice(1)) { const [req, story, endpoint, test] = r; if (req.startsWith("FR")) assert(stories.has(story), req + ": a story from STORIES.md (got " + story + ")"); else assert(story === "-" || stories.has(story), req + ": a story or -"); const ep = endpoint.replace(/\`/g, ""); assert(ops.has(ep) || components.includes(ep), req + ": an operation of openapi.yaml or a component (got " + ep + ")"); assert(words(test) >= 6, req + ": a concrete test"); } const covered = new Set(tableRows(section(md("SPEC.md"), "Traceability")).slice(1).map((r) => r[2].replace(/\`/g, ""))); for (const op of ops) assert(covered.has(op), op + " is not traced to any requirement (scope creep, or a missing requirement)");` },
          ],
          hint: "Build the traceability table first: copy every FR and NFR id, then fill each row from the documents you already have. If an operation in openapi.yaml appears in no row, either a requirement is missing or the operation is not needed.",
          successMessage: "The specification is complete and consistent: every requirement leads to the story, endpoint and test that will deliver it, and nothing in the contract is unaccounted for.",
        },
      },
    ],
    task: {
      title: "Week 21 deliverable: the specification of your capstone project",
      intro: "Choose your capstone project (or build Office Hours) and specify it the same way.",
      prompts: [
        "Write a one-page brief with the problem, the users and the numbers (users, peak load).",
        "Write STORIES.md and REQUIREMENTS.md: stories with priorities and Given/when/then criteria; numbered functional requirements and measurable non-functional ones.",
        "Design schema.sql (and apply it to a real PostgreSQL), the ER diagram, openapi.yaml and AUTH.md with the full access matrix.",
        "Draw the architecture, write the STRIDE threat model, and plan the implementation in day-sized tasks with milestones and risks.",
        "Checkpoint: write SPEC.md with the traceability table; a reviewer can read it and know exactly what will be built, how it is secured and how its completion will be measured.",
      ],
      closing: "Next: Week 22, building the core of the specification.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
