/**
 * BACKEND ENGINEERING · WEEK 24 · PROJECT DEFENSE AND PORTFOLIO PRESENTATION
 *
 * Curriculum 24.1 – 24.P: presenting and defending the capstone. Decisions
 * rehearse the questions a panel asks; the written pieces (the pitch, the
 * demo script, the bug story, the trade-offs, the case study) are checked
 * for structure and evidence, and the demo script (a REST Client .http file)
 * is EXECUTED against Office Hours: every request must answer the status it
 * promises.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";
import { ALL_RO, OH_SQL, PROJECT } from "./be-w22-implementation.js";

export const SECTION_ID = "be-s24-defense";
const MODULE = "be-w24-defense";

const DOC_PKG = pkg({ name: "office-hours", deps: [] });
/** Office Hours with free slots at 09:00 UTC on each of the next 10 days for Ngozi (BE-101). */
const DEMO_SQL = `${OH_SQL}INSERT INTO slots (instructor_id, course_id, starts_at, ends_at)
  SELECT 1, 1, date_trunc('day', now()) + d * interval '1 day' + interval '9 hours', date_trunc('day', now()) + d * interval '1 day' + interval '9 hours 20 minutes'
  FROM generate_series(1, 10) AS d;
`;

/** Check preamble: run a REST Client .http file against the lab's API. */
const HTTP_FILE = `const runHttpFile = async (text) => {
  const named = {}; let cookie = null; const results = [];
  const sub = (s) => s
    .replace(/\\{\\{\\s*\\$datetime\\s+"YYYY-MM-DD"\\s+(-?\\d+)\\s+d\\s*\\}\\}/g, (_, n) => new Date(now() + Number(n) * 86400000).toISOString().slice(0, 10))
    .replace(/\\{\\{\\s*(\\w+)\\.response\\.body\\.\\$?\\.?([\\w.\\[\\]]+)\\s*\\}\\}/g, (_, name, path) => { let v = named[name]; for (const k of path.replace(/\\[(\\d+)\\]/g, ".$1").split(".").filter(Boolean)) v = v?.[k]; return String(v); });
  for (const block of text.split(/^###.*$/m).map((b) => b.trim()).filter(Boolean)) {
    const meta = {}; const lines = [];
    for (const l of block.split("\\n")) { const m = /^\\s*(?:#|\\/\\/)\\s*@?(name|expect)\\s+(\\S+)/.exec(l); if (m) meta[m[1]] = m[2]; else if (!/^\\s*(#|\\/\\/)/.test(l)) lines.push(l); }
    while (lines.length && !lines[0].trim()) lines.shift();
    if (!lines.length) continue;
    const [method, url] = sub(lines.shift()).trim().split(/\\s+/);
    const headers = {};
    while (lines.length && lines[0].trim()) { const h = lines.shift(); const i = h.indexOf(":"); headers[h.slice(0, i).trim()] = sub(h.slice(i + 1).trim()); }
    const body = sub(lines.join("\\n").trim());
    const path = url.replace(/^https?:\\/\\/localhost:3000/, "");
    if (cookie) headers.Cookie = cookie;
    const r = await request(method.toUpperCase(), path, body ? { headers, body } : { headers });
    const sid = (r.cookies || []).find((c) => c.startsWith("sid="));
    if (sid) cookie = sid.split(";")[0];
    if (meta.name) named[meta.name] = r.json;
    results.push({ method: method.toUpperCase(), path: path.split("?")[0], expect: meta.expect ? Number(meta.expect) : null, status: r.status, code: r.json?.error?.code });
  }
  return results;
};`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 161 · 24.1 – 24.2 · PROBLEM, SOLUTION, ARCHITECTURE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l161-defense-story",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["24.1", "24.2"],
    title: "Presenting the Problem, the Solution and the Architecture",
    subtitle: "The first five minutes",
    estimatedMinutes: 60,
    intro: "A project defense is a conversation with engineers who will probe what you built. The first minutes decide how it goes: a clear problem, a solution that fits it, and an architecture explained at the right level.",
    atoms: [
      {
        id: "a-be-defense-pitch",
        title: "Present the problem and solution",
        explain:
          "Open with the PROBLEM in the users' terms, with numbers (6,000 students, double bookings every week, sessions lost to no-shows), then the SOLUTION in one paragraph (what it does, for whom), then the DEMO PLAN (the journey you will show, in a few steps), then RESULTS (what is measurably better or proven: tests, load, uptime). Panels remember a problem they understood; they forget features listed without one.",
        nodeLab: {
          task:
            "Write PITCH.md for Office Hours: ## Problem (who has it, what goes wrong, at least one number), ## Solution (one paragraph, at most 80 words), ## Demo plan (3 to 6 bullet steps, each naming a role and an action), ## Results (at least three measurable results, each with a number).",
          command: false,
          files: { "package.json": DOC_PKG, "PITCH.md": "# Office Hours\n" },
          readOnly: ["package.json"],
          open: "PITCH.md",
          solution: {
            "PITCH.md": `# Office Hours

## Problem

The academy's 120 instructors hold office hours for 6,000 students, booked through chat threads. Every week some slots are double-booked, students forget sessions, and about one booking in eight ends in a no-show, wasting the scarcest resource in the academy: instructors' time.

## Solution

Office Hours is a backend that lets instructors publish 20-minute slots, lets enrolled students book and cancel them under clear rules, reminds everyone a day ahead, records attendance, and blocks repeated no-shows, with a weekly report for admins.

## Demo plan

- Ngozi (instructor) publishes three slots for BE-101.
- Ada (student) finds and books one; Bayo (student) tries the same slot and is refused.
- Ada (student) cancels; Bayo (student) books the freed slot.
- After the session, Ngozi (instructor) marks Bayo a no-show.
- Kemi (admin) reads the weekly report.

## Results

- 0 double bookings in a 120-request concurrent load test (the database enforces one active booking per slot).
- p95 booking latency of 42 ms at 10 concurrent requests on staging.
- 45 automated tests, including every cell of the access matrix, pass on every push.
`,
          },
          tests: [
            { label: "Problem and solution", check: `const md = file("PITCH.md") || ""; const p = section(md, "Problem"); assert(p.split(/\\s+/).length >= 30, "## Problem: who has it and what goes wrong (30+ words)"); assert(/\\d/.test(p), "## Problem: at least one number"); const s = section(md, "Solution").trim(); const w = s.split(/\\s+/).length; assert(w >= 20 && w <= 80, "## Solution: one paragraph of 20–80 words (" + w + ")"); assert(!s.includes("\\n\\n"), "## Solution: one paragraph");` },
            { label: "A demo plan of journeys, and measurable results", check: `const md = file("PITCH.md") || ""; const steps = section(md, "Demo plan").split("\\n").filter((l) => /^\\s*-\\s/.test(l)); assert(steps.length >= 3 && steps.length <= 6, "## Demo plan: 3 to 6 steps (" + steps.length + ")"); for (const l of steps) assert(/\\((student|instructor|admin)\\)|\\b(student|instructor|admin)\\b/i.test(l), "each step names a role: " + l.trim()); const res = section(md, "Results").split("\\n").filter((l) => /^\\s*-\\s/.test(l)); assert(res.length >= 3, "## Results: at least three"); for (const l of res) assert(/\\d/.test(l), "each result has a number: " + l.trim());` },
          ],
          hint: "Write the problem as a user would describe it, with a number. Then one paragraph for the solution, the demo as role-and-action steps, and results you can prove (tests, load test, latency).",
          successMessage: "In five short sections the panel knows why the project exists, what it does, what they are about to see and what you can prove.",
        },
      },
      {
        id: "a-be-defense-architecture",
        title: "Explain the system architecture",
        explain:
          "Explain architecture top-down and tied to the problem: the context (who uses it, what it talks to), then the containers (API, worker, database, Redis, email) with one sentence each on why it exists, then ONE deep dive into the part that carries the hardest requirement (the booking race at Monday 09:00). Use the diagram from your repository; avoid listing libraries. Expect 'why not X?' and answer with the trade-off you made.",
        decision: decide({
          scenario: "The panel says: 'Walk us through your architecture.' You have three minutes.",
          question: "Which approach is strongest?",
          right: ["Show the container diagram, say in one sentence why each part exists, then go deep on how a booking flows at the Monday peak and why the database decides races", "Top-down, then one deep dive on the hardest requirement."],
          wrong: [
            ["List every npm package and its version", "Libraries are not architecture."],
            ["Open the code and scroll through the files", "The panel loses the big picture."],
            ["Describe every endpoint one by one", "Three minutes gone before the interesting part."],
          ],
          at: 0,
          aftermath: "The deep dive is where follow-up questions come from; choose it deliberately.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 162 · 24.3 – 24.4 · DATABASE AND DEMO
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l162-defense-demo",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["24.3", "24.4"],
    title: "Defending the Database Design and Demonstrating the API",
    subtitle: "Why the data looks like this, and proof that it works",
    estimatedMinutes: 80,
    intro: "Two parts of every defense: questions about the schema, which test whether the design was thought through, and the live demo, which must work the first time.",
    atoms: [
      {
        id: "a-be-defense-database",
        title: "Defend the database design",
        explain:
          "Database questions probe the decisions behind the schema: why this table, why this key, why this constraint, what happens under concurrency, what you would change at ten times the data. Answer with the requirement that drove the decision, the alternative you rejected, and the evidence (a test, a plan, a measurement). It is fine to name a weakness, with what you would do about it.",
        decision: decide({
          scenario: "A panel member asks: 'Why a partial unique index on bookings? Couldn't you just check in the code that the slot is free before inserting?'",
          question: "Which answer is best?",
          right: ["A check in code can be passed by two requests at the same moment; the index makes the second INSERT fail, which the API turns into 409 SLOT_TAKEN. It is partial so cancelled bookings stay for history without blocking the slot, and the concurrency test proves it with 20 simultaneous requests", "Requirement, alternative, mechanism, evidence."],
          wrong: [
            ["Indexes make queries faster", "True in general, but not why this one exists."],
            ["The tutorial did it that way", "Not a reason a panel accepts."],
            ["Checking in code would also work if requests are quick", "It does not, under concurrency."],
          ],
          at: 0,
          aftermath: "Have the concurrency test ready to show: it turns the answer into a fact.",
        }),
      },
      {
        id: "a-be-defense-demo",
        title: "Demonstrate API endpoints",
        explain:
          "A live demo fails for boring reasons: a typo, an expired session, an id from yesterday's database. Script it in a file you run, not commands you type: a REST Client .http file (VS Code's REST Client, JetBrains' HTTP client) with named requests whose ids flow into later ones ({{book.response.body.$.data.id}}), dates relative to today ({{$datetime \"YYYY-MM-DD\" 1 d}}), and a comment with the status each step should return. Rehearse it against a fresh seed, and keep a recording in case the network fails.",
        nodeLab: {
          task:
            "Write demo.http (REST Client format, requests separated by ###; the session cookie is kept between requests) for Office Hours, with a # @expect <status> comment on every request and # @name where a later request needs its response. Show: Ada logs in (204) and lists Ngozi's slots for the next 7 days (200); she books the first one (201); Bayo logs in and tries the same slot (409); Ada logs in again and cancels her booking (204); Bayo, logged in again, books it (201) and cannot read the admin report (403); Kemi logs in and reads this week's report (200). Use http://localhost:3000. The checks run the file.",
          db: DEMO_SQL,
          files: { ...PROJECT(), "demo.http": "### Ada logs in\n# @expect 204\nPOST http://localhost:3000/auth/login\nContent-Type: application/json\n\n{ \"email\": \"ada@example.com\", \"password\": \"correct horse battery staple\" }\n" },
          readOnly: ALL_RO,
          open: "demo.http",
          solution: {
            "demo.http": `### Ada logs in
# @expect 204
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "ada@example.com", "password": "correct horse battery staple" }

### Ada lists Ngozi's free slots for the next 7 days
# @name slots
# @expect 200
GET http://localhost:3000/instructors/1/slots?from={{$datetime "YYYY-MM-DD" 1 d}}&to={{$datetime "YYYY-MM-DD" 7 d}}

### Ada books the first one
# @name book
# @expect 201
POST http://localhost:3000/bookings
Content-Type: application/json

{ "slotId": {{slots.response.body.$.data[0].id}} }

### Bayo logs in
# @expect 204
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "bayo@example.com", "password": "correct horse battery staple" }

### Bayo tries the same slot: refused
# @expect 409
POST http://localhost:3000/bookings
Content-Type: application/json

{ "slotId": {{slots.response.body.$.data[0].id}} }

### Ada logs in again
# @expect 204
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "ada@example.com", "password": "correct horse battery staple" }

### Ada cancels
# @expect 204
DELETE http://localhost:3000/bookings/{{book.response.body.$.data.id}}

### Bayo logs in again
# @expect 204
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "bayo@example.com", "password": "correct horse battery staple" }

### Bayo books the freed slot
# @expect 201
POST http://localhost:3000/bookings
Content-Type: application/json

{ "slotId": {{slots.response.body.$.data[0].id}} }

### Bayo cannot read the admin report
# @expect 403
GET http://localhost:3000/reports/weekly?week={{monday}}

### Kemi logs in
# @expect 204
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "kemi@example.com", "password": "correct horse battery staple" }

### Kemi reads this week's report
# @expect 200
GET http://localhost:3000/reports/weekly?week={{monday}}
`,
          },
          tests: [
            { label: "Every request answers what the script promises", check: `${HTTP_FILE} const d = new Date(Math.floor(now() / 86400000) * 86400000); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); const text = (file("demo.http") || "").replace(/\\{\\{monday\\}\\}/g, d.toISOString().slice(0, 10)); const results = await runHttpFile(text); assert(results.length >= 10, "at least 10 requests (" + results.length + ")"); for (const [i, r] of results.entries()) { assert(r.expect !== null, "request " + (i + 1) + " (" + r.method + " " + r.path + ") needs a # @expect <status> comment"); eq(r.status, r.expect, "request " + (i + 1) + " " + r.method + " " + r.path + (r.code ? " (" + r.code + ")" : "")); }` },
            { label: "The script tells the whole story", check: `${HTTP_FILE} const d = new Date(Math.floor(now() / 86400000) * 86400000); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); await sql("DELETE FROM bookings"); const results = await runHttpFile((file("demo.http") || "").replace(/\\{\\{monday\\}\\}/g, d.toISOString().slice(0, 10))); const has_ = (m, p, s) => results.some((r) => r.method === m && r.path.replace(/\\/\\d+$/, "/:id").replace(/^\\/instructors\\/\\d+/, "/instructors/:id") === p && r.status === s); for (const [m, p, s, what] of [["POST", "/auth/login", 204, "logging in"], ["GET", "/instructors/:id/slots", 200, "listing slots"], ["POST", "/bookings", 201, "a booking"], ["POST", "/bookings", 409, "the refused second booking"], ["DELETE", "/bookings/:id", 204, "a cancellation"], ["GET", "/reports/weekly", 403, "a forbidden report"], ["GET", "/reports/weekly", 200, "the admin's report"]]) assert(has_(m, p, s), "show " + what + " (" + m + " " + p + " → " + s + ")"); const ids = results.filter((r) => r.method === "POST" && r.path === "/bookings").length; assert(ids >= 3, "three booking attempts"); has(file("demo.http") || "", ".response.body.", "ids flow from earlier responses (no hard-coded ids from yesterday's database)");` },
          ],
          hint: "Name the slot list (# @name slots) and use {{slots.response.body.$.data[0].id}} for the slot id; name the booking to cancel it by {{book.response.body.$.data.id}}. Switching users means logging in as them (the cookie is replaced). For the report week you may write {{monday}}: the checks fill in this week's Monday.",
          successMessage: "The demo is now a script that runs the same way every time, on any fresh database, with every expected answer written down.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 163 · 24.5 – 24.7 · AUTH, TESTS, A HARD BUG
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l163-defense-depth",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["24.5", "24.6", "24.7"],
    title: "Authentication, Automated Tests and a Difficult Bug",
    subtitle: "The questions that show depth",
    estimatedMinutes: 70,
    intro: "Panels test depth with three topics: how the system decides who may do what, how you know it works, and the hardest problem you solved.",
    atoms: [
      {
        id: "a-be-defense-auth",
        title: "Explain authentication and authorization",
        explain:
          "Explain auth as a chain a request passes through: how the caller is identified (the session cookie and its flags, the hashed token, expiry), how roles and course membership are checked, and where ownership is enforced (in the query, answering 404). Then show the evidence: the access matrix and its test. Be ready for the classic follow-ups: why sessions over JWTs, what happens on password change, how brute force is limited.",
        decision: decide({
          scenario: "A panel member asks: 'What stops a student from cancelling another student's booking?'",
          question: "Which answer is most convincing?",
          right: ["The DELETE query includes WHERE student_id = the session's user, so another student's booking is simply not found and the API answers 404 without revealing it exists; the authorization matrix test sends exactly that request as Bayo", "Mechanism plus evidence."],
          wrong: [
            ["The web app hides the cancel button for other people's bookings", "Anyone can call the API directly."],
            ["Booking ids are hard to guess", "Ids leak; ownership must be checked."],
            ["Students would not do that", "Security cannot rely on good behaviour."],
          ],
          at: 0,
          aftermath: "Every 'what stops…' question has the same shape of answer: where it is enforced, and which test proves it.",
        }),
      },
      {
        id: "a-be-defense-tests",
        title: "Show automated tests",
        explain:
          "Showing tests well means showing the RIGHT ones briefly: the suite running green in CI (with the count), one test for the most important rule (the booking race), the authorization matrix, and evidence that the tests catch bugs (a deliberately broken rule turns them red). Coverage numbers alone convince nobody; a failing test for a planted bug convinces everyone.",
        decision: decide({
          scenario: "You have two minutes to show your tests to the panel.",
          question: "What should you show?",
          right: ["The green CI run with the test count, the concurrency test for booking, the access-matrix table, and a quick demonstration that removing the ownership check makes a test fail", "Proof the tests protect what matters."],
          wrong: [
            ["The coverage percentage only", "Says nothing about what the tests check."],
            ["Every test file, scrolled quickly", "Nothing is understood."],
            ["Tests of getters and setters", "The least valuable tests."],
          ],
          at: 0,
          aftermath: "The week-15 habit of breaking the code on purpose is also the best demonstration.",
        }),
      },
      {
        id: "a-be-defense-bug",
        title: "Explain a difficult bug and how it was resolved",
        explain:
          "'Tell us about a hard bug' tests how you think. Structure it: the SYMPTOM (what users or tests saw), the INVESTIGATION (hypotheses and how you tested them: logs by request id, a failing test, EXPLAIN, reproducing the race), the ROOT CAUSE (precisely), the FIX (and why it is the right one), and the PREVENTION (the test or check that stops it coming back). Choose a bug where your reasoning, not luck, found the answer.",
        nodeLab: {
          task:
            "Write BUG-STORY.md about a bug from your project (or one of Office Hours' regression bugs #41–#46): ## Symptom, ## Investigation (at least two steps, as a list, including a hypothesis you ruled out), ## Root cause (specific: the file, the line or the condition), ## Fix, ## Prevention (the test that now guards it, by name or file).",
          command: false,
          files: { "package.json": DOC_PKG, "BUG-STORY.md": "# A difficult bug\n" },
          readOnly: ["package.json"],
          open: "BUG-STORY.md",
          solution: {
            "BUG-STORY.md": `# A difficult bug: slots vanishing on the last day of a range

## Symptom

Pilot students reported that Friday's office hours never appeared when they searched Monday to Friday, although instructors had published them. Searching Monday to Saturday showed them. Issue #41.

## Investigation

- First hypothesis: a time-zone problem, because the slots were at 09:00 Lagos time (08:00 UTC). I created a slot at 12:00 UTC on the last day: it was missing too, so the time zone was ruled out.
- I wrote a failing test (test/regression.test.js, #41): a slot three days ahead, a range ending that day, expecting one slot. It failed with zero.
- I logged the SQL and its parameters for that request by request id: the range condition was starts_at < $3::date, with $3 the last day.

## Root cause

In src/slots.js the range query compared starts_at < $3::date. A date casts to midnight at the start of that day, so every slot on the last day of the range was excluded: the range was exclusive where the API contract says inclusive.

## Fix

Change the condition to starts_at < $3::date + 1, the midnight after the last day, keeping the index-friendly half-open interval rather than casting each starts_at to a date (which would prevent the index on (course_id, starts_at) from being used).

## Prevention

The regression test #41 in test/regression.test.js now runs in CI on every push, and the contract test for listSlots checks a one-day range returns that day's slots.
`,
          },
          tests: [
            { label: "Symptom, investigation, root cause, fix, prevention", check: `const md = file("BUG-STORY.md") || ""; for (const s of ["Symptom", "Investigation", "Root cause", "Fix", "Prevention"]) assert(section(md, s).trim().split(/\\s+/).length >= 15, "## " + s + " (15+ words)"); const steps = section(md, "Investigation").split("\\n").filter((l) => /^\\s*(-|\\d+\\.)\\s/.test(l)); assert(steps.length >= 2, "## Investigation: at least two steps as a list"); assert(/hypothes|ruled out|suspected|thought/i.test(section(md, "Investigation")), "## Investigation: a hypothesis you tested and ruled out");` },
            { label: "Specific and guarded", check: `const md = file("BUG-STORY.md") || ""; assert(/[\\w/]+\\.(js|ts|sql)\\b|line \\d+|<|>|===|\\bWHERE\\b/.test(section(md, "Root cause")), "## Root cause names the file, line or condition"); assert(/test/i.test(section(md, "Prevention")) && /[\\w/-]+\\.test\\.(js|ts)|#\\d+|\\btest named\\b|it\\(/i.test(section(md, "Prevention")), "## Prevention names the test that guards it");` },
          ],
          hint: "Tell it in order, as it happened. The investigation is the interesting part: what you suspected, how you checked, what the evidence showed. The root cause should be precise enough to find in the code.",
          successMessage: "A story that shows how you think: from a vague symptom, through tested hypotheses, to a precise cause and a guard against its return.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 164 · 24.8 – 24.10 · TRADE-OFFS, RECOVERY, QUESTIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l164-defense-judgement",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["24.8", "24.9", "24.10"],
    title: "Trade-offs, Deployment and Recovery, and Answering Questions",
    subtitle: "Judgement under questioning",
    estimatedMinutes: 70,
    intro: "The last part of a defense is about judgement: the trade-offs you made knowingly, your ability to operate what you built, and how you handle a question you cannot fully answer.",
    atoms: [
      {
        id: "a-be-defense-tradeoffs",
        title: "Discuss performance and security trade-offs",
        explain:
          "Every design gave something up. Name the trade-offs yourself before the panel does: the decision, the alternative, why you chose it for THIS project's requirements, what it costs, and what would make you change it (the TRIGGER). Performance and security trade-offs are the ones panels probe most: caching versus freshness, Argon2 cost versus login latency, sessions versus tokens, a monolith versus services.",
        nodeLab: {
          task:
            "Write TRADEOFFS.md: a table with the columns Decision, Alternative, Why, Cost, Trigger and at least 4 rows, at least one about performance and one about security (say which in the Decision or Why). Every Cost must name a real downside, and every Trigger a measurable condition (a number) under which you would revisit it.",
          command: false,
          files: { "package.json": DOC_PKG, "TRADEOFFS.md": "# Trade-offs\n" },
          readOnly: ["package.json"],
          open: "TRADEOFFS.md",
          solution: {
            "TRADEOFFS.md": `# Trade-offs

| Decision | Alternative | Why | Cost | Trigger |
| --- | --- | --- | --- | --- |
| Sessions in a database table (security) | Stateless JWTs | One first-party web app; logout and password changes must revoke access at once | One indexed query per request | Session lookups above 5 ms at p95, or a second (mobile) client |
| Argon2id with 64 MiB memory (security) | bcrypt, or lower Argon2 memory | Strongest resistance to GPU cracking for stolen hashes | About 150 ms of CPU per login | Login p95 above 500 ms at the Monday peak |
| No cache on the free-slot list (performance) | Redis cache invalidated on booking | Freshness matters most at the peak, and the indexed query takes 4 ms | Every list request reaches PostgreSQL | More than 200 list requests per second, or list p95 above 100 ms |
| Reminders by a scheduled scan every 10 minutes (performance) | A delayed job per booking | No job cleanup on cancel or reschedule | Reminders up to 10 minutes late | Complaints about lateness, or more than 50,000 bookings a week |
| A modular monolith | Separate booking and reporting services | One team of three; one deploy, one database | Modules scale together | One module needing 3 times the capacity of the others, or a second team of 3+ engineers |
`,
          },
          tests: [
            { label: "A trade-off table", check: `const rows = (file("TRADEOFFS.md") || "").split("\\n").filter((l) => /^\\s*\\|/.test(l)).map((l) => l.trim().replace(/^\\||\\|$/g, "").split("|").map((c) => c.trim())).filter((c) => !c.every((x) => /^:?-{3,}:?$/.test(x))); eq(rows[0]?.map((c) => c.toLowerCase()), ["decision", "alternative", "why", "cost", "trigger"], "columns Decision, Alternative, Why, Cost, Trigger"); const body = rows.slice(1); assert(body.length >= 4, "at least 4 trade-offs"); assert(body.some((r) => /performance|latency|cache|throughput/i.test(r[0] + r[2])), "at least one performance trade-off"); assert(body.some((r) => /security|auth|session|password|hash|token/i.test(r[0] + r[2])), "at least one security trade-off");` },
            { label: "Honest costs and measurable triggers", check: `const rows = (file("TRADEOFFS.md") || "").split("\\n").filter((l) => /^\\s*\\|/.test(l)).map((l) => l.trim().replace(/^\\||\\|$/g, "").split("|").map((c) => c.trim())).filter((c) => !c.every((x) => /^:?-{3,}:?$/.test(x))).slice(1); for (const r of rows) { assert(r[3] && r[3].split(/\\s+/).length >= 3 && !/^(none|n\\/a|-)$/i.test(r[3]), r[0] + ": a real cost"); assert(/\\d/.test(r[4] || ""), r[0] + ": a trigger with a number (" + r[4] + ")"); }` },
          ],
          hint: "For each decision ask: what did I give up, and at what number would I choose differently? A trigger like 'login p95 above 500 ms' turns a debate into a measurement.",
          successMessage: "Your trade-offs are on the table before anyone asks, each with its price and the number that would change your mind.",
        },
      },
      {
        id: "a-be-defense-recovery",
        title: "Demonstrate deployment and recovery procedures",
        explain:
          "Show that you can operate the system: the pipeline from a commit to production (a recent run), the deployed version and how you know it is healthy (the smoke test, the dashboards), and a REHEARSED recovery: rolling back to the previous image, and restoring the database from a backup into a scratch database with the time it took. A recovery you have practised is evidence; one you describe from memory is a promise.",
        decision: decide({
          scenario: "The panel asks: 'Your latest release breaks booking. What do you do, and how long does it take?'",
          question: "Which answer is strongest?",
          right: ["Roll back by deploying the previous tag with the deploy script (it is in .deployed-tag); the smoke test confirms health. I rehearsed it last week: under 3 minutes, and migrations are backward compatible, so no database change is needed", "A practised procedure with a measured time."],
          wrong: [
            ["Fix the bug quickly and deploy again", "Users wait for the whole fix."],
            ["Restore last night's database backup", "Loses a day of bookings for a code problem."],
            ["Restart the servers", "The bad release starts again."],
          ],
          at: 0,
          aftermath: "Bring the timestamps of your rehearsal; numbers end the discussion.",
        }),
      },
      {
        id: "a-be-defense-questions",
        title: "Answer technical questions about your code",
        explain:
          "Questions about your code test understanding, not memory. Restate the question if it is ambiguous, answer the part you know precisely (open the file if needed), and say clearly where your knowledge ends: 'I have not measured that, but I would expect X because Y, and I would check it with Z'. Never bluff: a panel forgives 'I don't know yet' and never forgives a confident wrong answer. If a question reveals a real weakness, acknowledge it and say how you would fix it.",
        decision: decide({
          scenario: "A panel member asks: 'What happens to your booking endpoint if PostgreSQL fails over to a replica in the middle of a request?' You never tested that.",
          question: "How should you answer?",
          right: ["Say you have not tested a failover; explain what you expect (the in-flight query fails, the error handler answers 500 or 503, the pool reconnects, and the client can retry safely because a failed INSERT created nothing), and how you would verify it with a failover drill", "Honest, reasoned, and with a way to find out."],
          wrong: [
            ["Say it is handled, and move on", "A bluff that a follow-up question exposes."],
            ["Say the database never fails", "Every database does."],
            ["Refuse to answer because it was not in scope", "Shows no reasoning."],
          ],
          at: 0,
          aftermath: "Reasoning out loud from what you built is itself a strong answer.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 165 · 24.P · FINAL DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l165-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["24.P"],
    title: "Final Deliverable: A Production-Style Project and Its Case Study",
    subtitle: "A portfolio a hiring team can verify",
    estimatedMinutes: 150,
    intro: "The course ends with a portfolio piece: your project's source code, live deployment, documentation, tests and diagrams, tied together by a technical case study that a hiring team can read in ten minutes and verify in twenty.",
    atoms: [
      {
        id: "a-be-case-study",
        title: "A technical case study",
        explain:
          "A case study is the project's story for someone deciding whether to hire you: the problem and your role, the architecture (with the diagram), the key decisions and their trade-offs, the hardest problem and how you solved it, measurable results, and what you would do next. Everything is VERIFIABLE: links to the repository, the live API and its documentation, the CI runs, and numbers that the reader can reproduce.",
        nodeLab: {
          task:
            "Write CASE_STUDY.md: ## Summary (at most 60 words), ## Problem, ## My role, ## Architecture (a ```mermaid diagram with at least 4 components and a paragraph), ## Key decisions (at least 3, each with its trade-off), ## Hardest problem, ## Results (at least 3, each with a number), ## What I would do next (at least 2), and ## Links: Repository, Live API, API documentation and CI, each a Markdown link to an https:// URL.",
          command: false,
          files: { "package.json": DOC_PKG, "CASE_STUDY.md": "# Office Hours: a technical case study\n" },
          readOnly: ["package.json"],
          open: "CASE_STUDY.md",
          solution: {
            "CASE_STUDY.md": `# Office Hours: a technical case study

## Summary

I designed, built, tested and deployed the backend that lets 6,000 students book office hours with 120 instructors without double bookings, with reminders, attendance tracking and a no-show policy. It runs in production behind a delivery pipeline, with 45 automated tests and a rehearsed rollback.

## Problem

Office hours were arranged in chat threads: slots were double-booked every week, students forgot sessions and about one booking in eight was a no-show. Monday 09:00, when the next week opens, concentrates most bookings into fifteen minutes.

## My role

I worked alone over the capstone's four weeks: requirements and specification, schema and API design, implementation, tests, deployment and operations. An instructor and two students acted as pilot users.

## Architecture

\`\`\`mermaid
flowchart LR
  browser[Web app] -->|HTTPS| api[API: Node.js, Express]
  api --> postgres[(PostgreSQL)]
  api --> redis[(Redis)]
  worker[Worker] --> postgres
  worker --> smtp[Email provider]
\`\`\`

Stateless API instances behind Caddy handle requests; PostgreSQL is the source of truth and enforces the booking rule; a worker sends reminders from a scheduled scan; Redis holds rate limits. Everything ships as one Docker image built once per commit.

## Key decisions

- **A partial unique index decides booking races.** Trade-off: the API must translate a database error into 409 SLOT_TAKEN, but correctness no longer depends on timing.
- **Sessions instead of JWTs.** Trade-off: one database lookup per request, in exchange for immediate revocation.
- **A modular monolith.** Trade-off: modules scale together, but one team ships one deploy with enforced module boundaries.

## Hardest problem

Slots on the last day of a search range were silently missing. I ruled out time zones with a test at 12:00 UTC, reproduced it with a failing regression test, and found the range used starts_at < the last date (midnight at its start). The fix, < last date + 1, kept the query index-friendly; the regression test now guards it.

## Results

- 0 double bookings in a 120-request concurrent load test, and in eight weeks of pilot use.
- p95 booking latency of 42 ms at 10 concurrent requests on staging.
- 45 automated tests, including all 28 cells of the access matrix, run on every push; rollback rehearsed in under 3 minutes.

## What I would do next

- A waiting list that offers a cancelled slot to the next student automatically.
- Calendar invitations (iCalendar attachments) with the reminders.
- Point-in-time recovery drills every month, measured against the 1-hour RTO.

## Links

- Repository: [github.com/ada-obi/office-hours](https://github.com/ada-obi/office-hours)
- Live API: [office-hours.academy.example](https://office-hours.academy.example/health/live)
- API documentation: [office-hours.academy.example/docs](https://office-hours.academy.example/docs)
- CI: [GitHub Actions runs](https://github.com/ada-obi/office-hours/actions)
`,
          },
          tests: [
            { label: "The story, in order", check: `const md = file("CASE_STUDY.md") || ""; const order = ["Summary", "Problem", "My role", "Architecture", "Key decisions", "Hardest problem", "Results", "What I would do next", "Links"]; const heads = (md.match(/^## (.+)$/gm) || []).map((h) => h.slice(3).trim()); eq(heads.filter((h) => order.includes(h)), order, "the sections, in this order"); const sw = section(md, "Summary").trim().split(/\\s+/).length; assert(sw >= 20 && sw <= 60, "## Summary: 20–60 words (" + sw + ")"); for (const s of ["Problem", "My role", "Hardest problem"]) assert(section(md, s).trim().split(/\\s+/).length >= 25, "## " + s + " (25+ words)");` },
            { label: "Architecture, decisions and results with evidence", check: `const md = file("CASE_STUDY.md") || ""; const arch = section(md, "Architecture"); const block = (/\`\`\`mermaid\\s*([\\s\\S]*?)\`\`\`/.exec(arch) || [])[1] || ""; assert(/^\\s*(flowchart|graph)/.test(block), "## Architecture: a mermaid flowchart"); const ids = new Set([...block.matchAll(/(^|-->|\\|)\\s*([A-Za-z_]\\w*)/gm)].map((m) => m[2]).filter((x) => !["flowchart", "graph", "LR", "TD", "TB", "RL", "BT"].includes(x))); assert(ids.size >= 4, "at least 4 components in the diagram"); assert(arch.replace(/\`\`\`[\\s\\S]*?\`\`\`/, "").trim().split(/\\s+/).length >= 20, "a paragraph explaining the diagram"); const dec = section(md, "Key decisions").split("\\n").filter((l) => /^\\s*-\\s/.test(l)); assert(dec.length >= 3, "at least 3 key decisions"); for (const d of dec) assert(/trade-?off|cost|in exchange|but /i.test(d), "each decision states its trade-off: " + d.trim().slice(0, 60)); const res = section(md, "Results").split("\\n").filter((l) => /^\\s*-\\s/.test(l)); assert(res.length >= 3 && res.every((l) => /\\d/.test(l)), "at least 3 results, each with a number"); assert(section(md, "What I would do next").split("\\n").filter((l) => /^\\s*-\\s/.test(l)).length >= 2, "at least 2 next steps");` },
            { label: "Everything is verifiable", check: `const links = section(file("CASE_STUDY.md") || "", "Links"); for (const k of ["Repository", "Live API", "API documentation", "CI"]) assert(new RegExp("^\\\\s*-\\\\s*" + k + ":\\\\s*\\\\[[^\\\\]]+\\\\]\\\\(https:\\\\/\\\\/[^)\\\\s]+\\\\)", "m").test(links), "## Links: " + k + ": [text](https://…)");` },
          ],
          hint: "Write it for a busy reader: summary first, numbers everywhere, and a link for every claim that can be checked (repository, live API, docs, CI runs).",
          successMessage: "The case study turns twenty-four weeks of work into a story a hiring team can read in ten minutes and verify in twenty. Congratulations on completing the course.",
        },
      },
    ],
    task: {
      title: "Final deliverable: your production-style backend, presented and defended",
      intro: "Bring the capstone together and defend it.",
      prompts: [
        "Make sure the repository has the source, migrations and seeds, tests with CI, the OpenAPI documentation served at /docs, architecture and ER diagrams, the runbooks, and a README that gets a newcomer running.",
        "Keep the live deployment healthy, and rehearse a rollback and a database restore, recording their times.",
        "Write PITCH.md, demo.http, BUG-STORY.md, TRADEOFFS.md and CASE_STUDY.md, and rehearse the demo against a fresh seed.",
        "Present: the problem and solution, the architecture, the database design, a live demo, authentication, tests, a difficult bug, the trade-offs, deployment and recovery, then questions.",
        "Checkpoint: you present the project, answer questions about any part of the code, and leave a portfolio a hiring team can verify.",
      ],
      closing: "This is the end of the Backend Engineering course. Keep building, measuring and writing down why.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
