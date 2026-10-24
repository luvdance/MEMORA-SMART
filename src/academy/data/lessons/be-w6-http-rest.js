/**
 * BACKEND ENGINEERING · WEEK 6 · HTTP AND REST API DEVELOPMENT
 *
 * Curriculum 6.1 – 6.P. Methods, status codes and headers; paths, query and
 * route parameters; bodies and JSON; REST and resource naming; CRUD;
 * pagination, filtering, sorting and search; versioning; idempotency and
 * safe methods; error conventions; the course catalogue API; and a
 * documented course-management API.
 *
 * Routing uses Express from the first lab (Week 5 showed routing by hand;
 * Week 7 opens Express up). The labs keep courses in memory: Week 11 moves
 * them into PostgreSQL. Every lab's model answer is also run on real
 * Node.js and must answer byte for byte the same (scripts/beCheck.mjs).
 *
 * The course's error convention, used from here on:
 *   { "error": { "code": "COURSE_NOT_FOUND", "message": "…", "details": [ … ] } }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s6-http-rest";
const MODULE = "be-w6-http-rest";

const PKG = pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] });

/** The catalogue every lab starts from. */
export const COURSES_DATA = `export const courses = [
  { id: 1, code: "BE-101", title: "Backend Engineering", weeks: 24, level: "beginner", price: 120000 },
  { id: 2, code: "DB-101", title: "Relational Databases", weeks: 16, level: "beginner", price: 80000 },
  { id: 3, code: "WD-201", title: "React Development", weeks: 16, level: "intermediate", price: 90000 },
  { id: 4, code: "CS-101", title: "Cybersecurity", weeks: 16, level: "beginner", price: 85000 },
  { id: 5, code: "MD-101", title: "Mobile App Development", weeks: 24, level: "beginner", price: 120000 },
  { id: 6, code: "DA-301", title: "Advanced Data Analysis", weeks: 12, level: "advanced", price: 100000 },
];
`;

const SERVER_HEAD = `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());
`;
const SERVER_TAIL = `
app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;
const server = (routes) => `${SERVER_HEAD}\n${routes.trim()}\n${SERVER_TAIL}`;

const NOT_FOUND = (id) => `{ error: { code: "COURSE_NOT_FOUND", message: \`Course \${${id}} does not exist\` } }`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 6.1 – 6.2 · METHODS, STATUS CODES AND HEADERS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l39-methods-status",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2"],
    title: "HTTP Methods, Status Codes and Headers",
    subtitle: "The vocabulary every API speaks",
    estimatedMinutes: 60,
    intro:
      "From this week the course builds a course-management API. Last week you routed requests by hand; from now on Express does the routing: app.get(\"/courses\", (req, res) => …) registers a handler for GET /courses, res.status(201).json(body) answers. Week 7 shows how Express works inside. This lesson is about HTTP itself.",
    atoms: [
      {
        id: "a-be-methods",
        title: "HTTP methods",
        explain:
          "The METHOD says what the client wants done to the resource at the URL. GET reads it (never changes anything). POST creates a new resource in a collection (POST /courses) or triggers an action. PUT replaces a resource entirely with the body sent. PATCH changes some of its fields. DELETE removes it. HEAD is GET without the body; OPTIONS asks what is allowed (CORS uses it, Week 14). Using the right method is not style: caches, proxies, browsers and retry logic all behave differently depending on it. A GET that deletes something will one day be triggered by a crawler or a link preview.",
        decision: decide({
          scenario: "A developer adds GET /courses/3/delete to remove course 3, because 'it is easy to test in the browser'.",
          question: "What is wrong with it?",
          right: ["GET must never change anything: crawlers, link previews, prefetching and caches send GETs freely, and would delete courses. Use DELETE /courses/3", "Methods carry meaning that the whole web relies on."],
          wrong: [
            ["Nothing, as long as only admins know the URL", "URLs leak, and machines follow links."],
            ["It should be POST /courses/3/delete", "Works, but DELETE /courses/3 is the REST way."],
            ["URLs cannot contain verbs", "They can; the method should carry the verb."],
          ],
          at: 1,
          aftermath: "GET is SAFE: it must have no side effects. Lesson 43 adds idempotency to the vocabulary.",
        }),
      },
      {
        id: "a-be-status-codes",
        title: "Status codes",
        explain:
          "The status code is the first thing a client reads. The ones an API uses daily: 200 OK (here is the result), 201 Created (with a Location header pointing at the new resource), 204 No Content (done, nothing to send, as after a DELETE), 400 Bad Request (the input is invalid), 401 Unauthorized (who are you? log in), 403 Forbidden (I know who you are, and you may not), 404 Not Found, 405 Method Not Allowed, 409 Conflict (clashes with the current state, as a duplicate code), 422 Unprocessable Content (some APIs use it for validation errors), 429 Too Many Requests, 500 Internal Server Error (our bug), 503 Service Unavailable (try later). 2xx success, 4xx the client's fault, 5xx ours.",
        nodeLab: {
          task:
            "Every route in server.js answers 200, whatever happens. Fix the status codes: POST /courses answers 201; a missing course (GET or DELETE /courses/:id) answers 404; DELETE of an existing course answers 204 with no body; POST with a code that already exists answers 409. Do not change the bodies.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.json(${NOT_FOUND("req.params.id")});
  res.json(course);
});

app.post("/courses", (req, res) => {
  if (courses.some((c) => c.code === req.body.code)) {
    return res.json({ error: { code: "DUPLICATE_CODE", message: \`A course with code \${req.body.code} already exists\` } });
  }
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.json(course);
});

app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.json(${NOT_FOUND("req.params.id")});
  courses.splice(index, 1);
  res.json({ deleted: true });
});`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json(${NOT_FOUND("req.params.id")});
  res.json(course);
});

app.post("/courses", (req, res) => {
  if (courses.some((c) => c.code === req.body.code)) {
    return res.status(409).json({ error: { code: "DUPLICATE_CODE", message: \`A course with code \${req.body.code} already exists\` } });
  }
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.status(201).json(course);
});

app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json(${NOT_FOUND("req.params.id")});
  courses.splice(index, 1);
  res.status(204).end();
});`),
          },
          requests: [
            { label: "GET /courses/1", method: "GET", path: "/courses/1" },
            { label: "GET /courses/99", method: "GET", path: "/courses/99" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 } },
            { label: "POST duplicate", method: "POST", path: "/courses", body: { code: "BE-101", title: "Copy" } },
            { label: "DELETE /courses/2", method: "DELETE", path: "/courses/2" },
          ],
          tests: [
            { label: "GET /courses/99 → 404", check: `const r = await get("/courses/99"); eq(r.status, 404, "a missing course"); eq(r.json.error.code, "COURSE_NOT_FOUND", "the body is unchanged");` },
            { label: "POST /courses → 201", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation" }); eq(r.status, 201, "a created course");` },
            { label: "A duplicate code → 409", check: `const r = await post("/courses", { code: "BE-101", title: "Copy" }); eq(r.status, 409, "a clash with an existing course");` },
            { label: "DELETE an existing course → 204 with no body; a missing one → 404", check: `const r = await del("/courses/3"); eq(r.status, 204, "DELETE /courses/3"); eq(r.text, "", "204 has no body"); eq((await del("/courses/3")).status, 404, "deleting it again");` },
          ],
          hint: "res.status(404).json(…), res.status(201).json(course), res.status(409).json(…), and res.status(204).end() for the delete.",
          successMessage: "Same bodies, honest status codes: a client can now branch on 404 or 409 without parsing messages.",
        },
      },
      {
        id: "a-be-headers",
        title: "Headers",
        explain:
          "Headers carry information about the message. Request headers: Content-Type (what the body is), Accept (what the client can read), Authorization (credentials, Week 13), User-Agent. Response headers: Content-Type, Location (where a created resource lives: 201 Created should send it), Cache-Control (whether and how long it may be cached), Allow (on 405), Retry-After (on 429 and 503), ETag (a version for caching). Express sets Content-Type for you with res.json; res.location() and res.set() set others. Names are case-insensitive.",
        nodeLab: {
          task:
            "Improve the headers. POST /courses must answer 201 with a Location header pointing at the new course (/courses/<id>). GET /courses must send Cache-Control: public, max-age=60 (the list may be cached for a minute). GET /courses/:id must send Cache-Control: no-store (always fetch fresh).",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
app.get("/courses", (req, res) => {
  res.json(courses);
});

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json(${NOT_FOUND("req.params.id")});
  res.json(course);
});

app.post("/courses", (req, res) => {
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.status(201).json(course);
});`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
app.get("/courses", (req, res) => {
  res.set("Cache-Control", "public, max-age=60");
  res.json(courses);
});

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json(${NOT_FOUND("req.params.id")});
  res.set("Cache-Control", "no-store");
  res.json(course);
});

app.post("/courses", (req, res) => {
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});`),
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /courses/1", method: "GET", path: "/courses/1" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation" } },
          ],
          tests: [
            { label: "POST /courses → 201 with Location: /courses/7", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation" }); eq(r.status, 201, "status"); eq(r.headers.location, "/courses/" + r.json.id, "the Location header should point at the new course");` },
            { label: "GET /courses → Cache-Control: public, max-age=60", check: `eq((await get("/courses")).headers["cache-control"], "public, max-age=60", "the list's Cache-Control");` },
            { label: "GET /courses/:id → Cache-Control: no-store", check: `eq((await get("/courses/1")).headers["cache-control"], "no-store", "a single course's Cache-Control");` },
          ],
          hint: "res.set(\"Cache-Control\", \"…\") before res.json; res.location(`/courses/${course.id}`) before the 201.",
          successMessage: "A client that created a course now knows where to find it, and caches know what they may keep. Headers are how HTTP stays efficient at scale.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 6.3 – 6.4 · URLS, PARAMETERS, BODIES AND JSON
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l40-urls-bodies",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.3", "6.4"],
    title: "Paths, Parameters, Bodies and JSON",
    subtitle: "Where a request carries its information",
    estimatedMinutes: 55,
    intro: "A request carries information in four places: the path, the query string, the headers and the body. Choosing the right place for each piece is half of API design.",
    atoms: [
      {
        id: "a-be-params",
        title: "Paths, route parameters and query parameters",
        explain:
          "The PATH names the resource: /courses is the collection, /courses/3 one course. A ROUTE PARAMETER is a variable part of the path: Express's /courses/:id puts \"3\" in req.params.id (always a string: convert it). The QUERY STRING, after ?, refines the request without naming a different resource: /courses?level=beginner&sort=title, in req.query (also strings; a repeated key becomes an array). Rule of thumb: identity in the path, options (filters, sorting, paging) in the query. A route parameter that is not a valid id (/courses/abc) should be a 400 or 404, never a crash.",
        nodeLab: {
          task:
            "Add GET /courses/:id/price: it answers { \"code\": …, \"price\": … } for the course, with the price converted when ?currency=USD is given (divide by 1500 and round to 2 decimals; NGN is the default and returns the price as it is). An id that is not a whole number answers 400 { error: { code: \"INVALID_ID\", message: \"id must be a whole number\" } }; a missing course 404; an unknown currency 400 with code \"UNSUPPORTED_CURRENCY\".",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
// GET /courses/:id/price
`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
const RATES = { NGN: 1, USD: 1500 };

app.get("/courses/:id/price", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "id must be a whole number" } });
  const course = courses.find((c) => c.id === id);
  if (!course) return res.status(404).json(${NOT_FOUND("id")});
  const currency = String(req.query.currency ?? "NGN").toUpperCase();
  if (!RATES[currency]) return res.status(400).json({ error: { code: "UNSUPPORTED_CURRENCY", message: \`Currency \${currency} is not supported\` } });
  const price = currency === "NGN" ? course.price : Math.round((course.price / RATES[currency]) * 100) / 100;
  res.json({ code: course.code, currency, price });
});`),
          },
          requests: [
            { label: "GET /courses/2/price", method: "GET", path: "/courses/2/price" },
            { label: "…?currency=USD", method: "GET", path: "/courses/2/price?currency=USD" },
            { label: "GET /courses/abc/price", method: "GET", path: "/courses/abc/price" },
          ],
          tests: [
            { label: "GET /courses/2/price → the price in naira", check: `const r = await get("/courses/2/price"); eq(r.status, 200, "status"); eq([r.json.code, r.json.price], ["DB-101", 80000], "code and price");` },
            { label: "?currency=USD converts at 1500 per dollar", check: `const r = await get("/courses/2/price?currency=USD"); eq(r.json.price, 53.33, "80000 / 1500 rounded to 2 decimals"); eq((await get("/courses/1/price?currency=usd")).json.price, 80, "currency should not depend on case");` },
            { label: "/courses/abc/price → 400 INVALID_ID", check: `const r = await get("/courses/abc/price"); eq(r.status, 400, "status"); eq(r.json, { error: { code: "INVALID_ID", message: "id must be a whole number" } }, "body");` },
            { label: "Missing course → 404; unknown currency → 400", check: `eq((await get("/courses/99/price")).status, 404, "missing course"); const r = await get("/courses/1/price?currency=XYZ"); eq(r.status, 400, "unknown currency"); eq(r.json.error.code, "UNSUPPORTED_CURRENCY", "the error code");` },
          ],
          hint: "Number(req.params.id) and Number.isInteger; String(req.query.currency ?? \"NGN\").toUpperCase(); a RATES object for the supported currencies.",
          successMessage: "The id identifies, the currency refines: path and query each doing their job, and every bad value answered with a 4xx instead of NaN.",
        },
      },
      {
        id: "a-be-bodies",
        title: "Request bodies and JSON",
        explain:
          "POST, PUT and PATCH send data in the BODY; the Content-Type header says its format, usually application/json. Express's express.json() middleware parses it into req.body, but only when the Content-Type is JSON: a body sent as text/plain leaves req.body undefined. Invalid JSON makes express.json() answer 400 by itself. Never trust the body: it can be missing, the wrong type, have extra fields (a client sending { \"id\": 1, \"isAdmin\": true }), or be huge (express.json({ limit: \"100kb\" })). Copy only the fields you accept: that blocks MASS ASSIGNMENT.",
        nodeLab: {
          task:
            "POST /courses currently stores the whole body ({ id, ...req.body }), so a client can set any field, even \"id\" or \"featured\". Copy only code, title, weeks, level and price into the new course. If the body is missing or not an object (for example a text/plain request), answer 400 { error: { code: \"INVALID_BODY\", message: \"Send a JSON object\" } }.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
app.post("/courses", (req, res) => {
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.status(201).json(course);
});`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
app.post("/courses", (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: { code: "INVALID_BODY", message: "Send a JSON object" } });
  }
  const { code, title, weeks, level, price } = body;
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title, weeks, level, price };
  courses.push(course);
  res.status(201).json(course);
});`),
          },
          requests: [
            { label: "POST a course", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 } },
            { label: "POST with extra fields", method: "POST", path: "/courses", body: { id: 1, code: "X-1", title: "Sneaky", featured: true } },
            { label: "POST text/plain", method: "POST", path: "/courses", body: "code=X", headers: { "Content-Type": "text/plain" } },
          ],
          tests: [
            { label: "A normal course is created with exactly the accepted fields", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }); eq(r.status, 201, "status"); eq(r.json, { id: 7, code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }, "the stored course");` },
            { label: "Extra fields, including id, are ignored", check: `const r = await post("/courses", { id: 1, code: "X-1", title: "Sneaky", featured: true }); assert(r.json.id !== 1, "the client must not choose the id"); assert(!("featured" in r.json), "unknown fields must not be stored");` },
            { label: "A text/plain body → 400 INVALID_BODY", check: `const r = await request("POST", "/courses", { body: "code=X", headers: { "Content-Type": "text/plain" } }); eq(r.status, 400, "status"); eq(r.json, { error: { code: "INVALID_BODY", message: "Send a JSON object" } }, "body");` },
            { label: "Invalid JSON is rejected by express.json() with 400", check: `const r = await request("POST", "/courses", { body: "{oops", headers: { "Content-Type": "application/json" } }); eq(r.status, 400, "status");` },
          ],
          hint: "Check the body first; then const { code, title, weeks, level, price } = body; and build the course from exactly those names.",
          successMessage: "An allow-list of fields: the client can no longer choose ids or switch on flags it should not control. Week 7 does this with a zod schema.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 6.5 – 6.6 · REST AND CRUD
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l41-rest-crud",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.5", "6.6"],
    title: "REST Principles, Resource Naming and CRUD",
    subtitle: "Designing URLs around things, not actions",
    estimatedMinutes: 60,
    intro: "REST is a set of conventions that make APIs predictable: once a developer has used one well-designed API, they can guess how yours works.",
    atoms: [
      {
        id: "a-be-rest",
        title: "REST principles and resource naming",
        explain:
          "REST models an API as RESOURCES (courses, students, enrollments) at URLs, acted on with the standard methods. Name resources with plural NOUNS: /courses, /courses/3, never /getCourses or /createCourse (the method is the verb). Nest only for true ownership, one level deep: /courses/3/lessons. Use lowercase and hyphens (/learning-paths). Requests are STATELESS: each carries everything needed (including credentials). Responses use standard status codes and a consistent JSON shape. Actions that are not CRUD become resources too: POST /enrollments rather than POST /enrollCourse; POST /courses/3/publish when it really is an action.",
        decision: decide({
          scenario: "Four designs for the same feature: a student enrolls in course 3.",
          question: "Which is the most RESTful?",
          right: ["POST /enrollments with { \"studentId\": 12, \"courseId\": 3 } → 201 and the new enrollment", "The enrollment is a resource; creating one is a POST to its collection."],
          wrong: [
            ["GET /enrollStudent?student=12&course=3", "A GET that changes data, and a verb in the URL."],
            ["POST /api/doEnrollment", "A verb in the URL; the method already says 'do'."],
            ["PUT /students/12/courses/3/enroll/now", "Deep nesting with verbs; hard to guess and to extend."],
          ],
          at: 0,
          aftermath: "GET /enrollments?studentId=12 then lists them, and DELETE /enrollments/77 cancels one: the same pattern everywhere.",
        }),
      },
      {
        id: "a-be-crud",
        title: "CRUD operations",
        explain:
          "CRUD (Create, Read, Update, Delete) maps onto the methods: POST /courses creates (201 + Location), GET /courses and GET /courses/:id read (200, or 404), PATCH /courses/:id updates some fields (200 with the updated resource), PUT /courses/:id replaces it, DELETE /courses/:id removes it (204). Each handler follows the same shape: find the resource (404 if missing), check the input (400), apply the change, answer with the right status and body. Here, a complete set, without PUT.",
        nodeLab: {
          task:
            "Complete the CRUD routes: GET /courses (all), GET /courses/:id (404 if missing), POST /courses (201, Location, only code/title/weeks/level/price), PATCH /courses/:id (update only the fields sent, among title/weeks/level/price; 404 if missing; answer the updated course), DELETE /courses/:id (204, or 404). Errors use the COURSE_NOT_FOUND shape.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
const findCourse = (id) => courses.find((c) => c.id === Number(id));

// GET /courses, GET /courses/:id, POST /courses, PATCH /courses/:id, DELETE /courses/:id
`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
const findCourse = (id) => courses.find((c) => c.id === Number(id));
const notFound = (res, id) => res.status(404).json(${NOT_FOUND("id")});

app.get("/courses", (req, res) => res.json(courses));

app.get("/courses/:id", (req, res) => {
  const course = findCourse(req.params.id);
  if (!course) return notFound(res, req.params.id);
  res.json(course);
});

app.post("/courses", (req, res) => {
  const { code, title, weeks, level, price } = req.body ?? {};
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title, weeks, level, price };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

app.patch("/courses/:id", (req, res) => {
  const course = findCourse(req.params.id);
  if (!course) return notFound(res, req.params.id);
  for (const field of ["title", "weeks", "level", "price"]) {
    if (req.body?.[field] !== undefined) course[field] = req.body[field];
  }
  res.json(course);
});

app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return notFound(res, req.params.id);
  courses.splice(index, 1);
  res.status(204).end();
});`),
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /courses/3", method: "GET", path: "/courses/3" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 } },
            { label: "PATCH /courses/3", method: "PATCH", path: "/courses/3", body: { price: 95000 } },
            { label: "DELETE /courses/6", method: "DELETE", path: "/courses/6" },
          ],
          tests: [
            { label: "GET /courses lists all six; GET /courses/3 gets one; /courses/99 → 404", check: `eq((await get("/courses")).json.length, 6, "the list"); eq((await get("/courses/3")).json.code, "WD-201", "course 3"); const r = await get("/courses/99"); eq(r.status, 404, "missing"); eq(r.json.error.code, "COURSE_NOT_FOUND", "error code");` },
            { label: "POST creates (201 + Location) and GET finds it", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000, featured: true }); eq(r.status, 201, "status"); eq(r.headers.location, "/courses/" + r.json.id, "Location"); assert(!("featured" in r.json), "only the accepted fields"); eq((await get("/courses/" + r.json.id)).json.title, "AI & Automation", "the new course can be read");` },
            { label: "PATCH changes only the fields sent", check: `const r = await patch("/courses/3", { price: 95000 }); eq(r.status, 200, "status"); eq(r.json, { id: 3, code: "WD-201", title: "React Development", weeks: 16, level: "intermediate", price: 95000 }, "only price changed"); eq((await patch("/courses/99", { price: 1 })).status, 404, "PATCH a missing course");` },
            { label: "PATCH cannot change the id or the code", check: `const r = await patch("/courses/4", { id: 400, code: "HACK" }); eq([r.json.id, r.json.code], [4, "CS-101"], "id and code should not change");` },
            { label: "DELETE → 204, then the course is gone", check: `eq((await del("/courses/6")).status, 204, "DELETE"); eq((await get("/courses/6")).status, 404, "after DELETE"); eq((await del("/courses/6")).status, 404, "DELETE again");` },
          ],
          hint: "A small notFound(res, id) helper keeps the 404s consistent. For PATCH, loop over the allowed fields and copy each one that is present in the body.",
          successMessage: "Five routes, one shape: find, check, change, answer. That shape repeats in every API you will build.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 6.7 · PAGINATION, FILTERING, SORTING AND SEARCH
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l42-collections",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.7"],
    title: "Pagination, Filtering, Sorting and Search",
    subtitle: "Collections that stay usable at any size",
    estimatedMinutes: 60,
    intro: "A collection endpoint that returns everything works with six courses and fails with six hundred thousand. Clients need to page, filter, sort and search, through the query string.",
    atoms: [
      {
        id: "a-be-pagination",
        title: "Pagination, filtering, sorting and search",
        explain:
          "Conventions most APIs share: PAGINATION with ?page=2&limit=20 (limit capped, say at 100; defaults 1 and 20), answering { data: [...], meta: { page, limit, total, totalPages } } so clients can draw page links; FILTERING with field names (?level=beginner&weeks=16); SORTING with ?sort=price (ascending) or ?sort=-price (descending), only on allowed fields; SEARCH with ?q=react, matching titles case-insensitively. Validate every parameter: an unknown sort field is a 400, not silently ignored. Order matters: filter and search first, then sort, then cut the page. Week 12 shows offset pagination's weakness and cursor-based pagination.",
        nodeLab: {
          task:
            "Make GET /courses support ?q (case-insensitive title search), ?level (exact), ?sort (title, price or weeks; - for descending), ?page and ?limit (defaults 1 and 3, limit at most 50). Answer { data, meta: { page, limit, total, totalPages } } where total counts the matching courses. An unknown sort field or a page or limit that is not a positive whole number → 400 { error: { code: \"INVALID_QUERY\", message } }.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
app.get("/courses", (req, res) => {
  res.json(courses);
});`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
const SORTABLE = ["title", "price", "weeks"];
const invalid = (res, message) => res.status(400).json({ error: { code: "INVALID_QUERY", message } });
const positiveInt = (value, fallback) => (value === undefined ? fallback : /^[1-9]\\d*$/.test(String(value)) ? Number(value) : null);

app.get("/courses", (req, res) => {
  const { q, level, sort } = req.query;
  const page = positiveInt(req.query.page, 1);
  const limit = positiveInt(req.query.limit, 3);
  if (page === null) return invalid(res, "page must be a positive whole number");
  if (limit === null || limit > 50) return invalid(res, "limit must be a whole number from 1 to 50");

  let result = courses;
  if (q) result = result.filter((c) => c.title.toLowerCase().includes(String(q).toLowerCase()));
  if (level) result = result.filter((c) => c.level === level);
  if (sort) {
    const desc = String(sort).startsWith("-");
    const field = desc ? String(sort).slice(1) : String(sort);
    if (!SORTABLE.includes(field)) return invalid(res, \`sort must be one of \${SORTABLE.join(", ")}\`);
    result = [...result].sort((a, b) => (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0) * (desc ? -1 : 1));
  }
  const total = result.length;
  const data = result.slice((page - 1) * limit, page * limit);
  res.json({ data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});`),
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "page 2", method: "GET", path: "/courses?page=2" },
            { label: "beginner, by price desc", method: "GET", path: "/courses?level=beginner&sort=-price&limit=10" },
            { label: "search react", method: "GET", path: "/courses?q=REACT" },
            { label: "bad sort", method: "GET", path: "/courses?sort=secret" },
          ],
          tests: [
            { label: "Defaults: page 1 of 3, 3 per page, with meta", check: `const r = await get("/courses"); eq(r.json.data.map((c) => c.id), [1, 2, 3], "the first page"); eq(r.json.meta, { page: 1, limit: 3, total: 6, totalPages: 2 }, "meta");` },
            { label: "?page=2&limit=4 gives the rest", check: `const r = await get("/courses?page=2&limit=4"); eq(r.json.data.map((c) => c.id), [5, 6], "page 2 of 4 per page"); eq(r.json.meta, { page: 2, limit: 4, total: 6, totalPages: 2 }, "meta");` },
            { label: "Filter, search and sort combine, before paging", check: `const a = await get("/courses?level=beginner&sort=-price&limit=10"); eq(a.json.data.map((c) => c.code), ["BE-101", "MD-101", "CS-101", "DB-101"], "beginner courses by price, highest first"); eq(a.json.meta.total, 4, "total counts the filtered courses"); const b = await get("/courses?q=REACT"); eq(b.json.data.map((c) => c.code), ["WD-201"], "case-insensitive search"); const c = await get("/courses?sort=title&limit=2&page=2"); eq(c.json.data.map((x) => x.title), ["Cybersecurity", "Mobile App Development"], "sorted before paging");` },
            { label: "Invalid sort, page or limit → 400 INVALID_QUERY", check: `for (const q of ["sort=secret", "page=0", "page=abc", "limit=500", "limit=-1"]) { const r = await get("/courses?" + q); eq(r.status, 400, "?" + q); eq(r.json.error.code, "INVALID_QUERY", "?" + q + " error code"); }` },
          ],
          hint: "Validate page and limit first. Then filter (q, level), then sort a copy ([...result].sort), then slice((page - 1) * limit, page * limit). total is the length before slicing.",
          successMessage: "A collection endpoint clients can rely on at any size. The database will do the filtering, sorting and paging from Week 11; the query-string contract stays the same.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 6.8 – 6.10 · VERSIONING, IDEMPOTENCY AND ERRORS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l43-contracts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.8", "6.9", "6.10"],
    title: "Versioning, Idempotency and Error Conventions",
    subtitle: "Keeping promises to clients",
    estimatedMinutes: 65,
    intro: "An API is a promise: clients you will never meet build on it. Three things keep that promise as the API evolves: versioning, predictable behaviour on retries, and errors with a fixed shape.",
    atoms: [
      {
        id: "a-be-versioning",
        title: "API versioning fundamentals",
        explain:
          "Once clients depend on your API, some changes BREAK them: removing or renaming a field, changing a type, changing what a status code means, making an optional field required. Others are safe: adding an endpoint, adding an optional field, adding a field to a response. Breaking changes go into a new VERSION while the old one keeps working for a while: most commonly in the path (/v1/courses, /v2/courses), sometimes in a header (Accept: application/vnd.academy.v2+json). Announce deprecations (a Deprecation header, a sunset date) and give clients time to move.",
        decision: decide({
          scenario: "Mobile apps already in users' hands read course.price as a number in naira. The product team wants prices as { amount, currency } objects.",
          question: "What should the API do?",
          right: ["Keep /v1 unchanged, add /v2/courses with the new shape, and retire /v1 only after the apps have moved", "Old apps keep working; new ones use v2."],
          wrong: [
            ["Change price in /v1 and ask users to update their apps", "Every old app breaks the moment you deploy."],
            ["Send both formats in the same field depending on the day", "Unpredictable."],
            ["Never change anything again", "APIs must evolve; versioning lets them."],
          ],
          at: 1,
          aftermath: "Adding a new field (priceDetails) to v1 would also have been safe: additions do not break clients that ignore unknown fields.",
        }),
      },
      {
        id: "a-be-idempotency",
        title: "Idempotency and safe methods",
        explain:
          "A method is SAFE if it changes nothing (GET, HEAD, OPTIONS). It is IDEMPOTENT if doing it twice has the same effect as doing it once: GET, PUT (replace course 3 with this body: twice leaves the same result), DELETE (deleting twice still leaves it deleted, although the second answers 404). POST is NOT idempotent: two POST /courses create two courses. This matters because networks fail: a client that sent a request and got no answer does not know whether it worked, and will retry. Retrying idempotent requests is safe; retrying a POST may duplicate (Week 16 fixes that with idempotency keys).",
        nodeLab: {
          task:
            "Add PUT /courses/:id, which REPLACES a course: the body must have code, title, weeks, level and price (else 400 { error: { code: \"INVALID_BODY\", message: \"code, title, weeks, level and price are required\" } }). If the course exists, replace it and answer 200; if it does not, create it with that id and answer 201. Sending the same PUT twice must leave the same state.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json(${NOT_FOUND("req.params.id")});
  res.json(course);
});

// PUT /courses/:id replaces the course (or creates it with this id)
`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json(${NOT_FOUND("req.params.id")});
  res.json(course);
});

app.put("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const { code, title, weeks, level, price } = req.body ?? {};
  if ([code, title, weeks, level, price].some((v) => v === undefined)) {
    return res.status(400).json({ error: { code: "INVALID_BODY", message: "code, title, weeks, level and price are required" } });
  }
  const course = { id, code, title, weeks, level, price };
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) {
    courses.push(course);
    return res.status(201).json(course);
  }
  courses[index] = course;
  res.json(course);
});`),
          },
          requests: [
            { label: "PUT /courses/2", method: "PUT", path: "/courses/2", body: { code: "DB-101", title: "Relational Databases & SQL", weeks: 16, level: "beginner", price: 85000 } },
            { label: "PUT /courses/10", method: "PUT", path: "/courses/10", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 } },
            { label: "PUT incomplete", method: "PUT", path: "/courses/2", body: { title: "Only a title" } },
          ],
          tests: [
            { label: "PUT an existing course replaces it (200)", check: `const body = { code: "DB-101", title: "Relational Databases & SQL", weeks: 16, level: "beginner", price: 85000 }; const r = await put("/courses/2", body); eq(r.status, 200, "status"); eq(r.json, { id: 2, ...body }, "the replaced course"); eq((await get("/courses/2")).json, { id: 2, ...body }, "stored");` },
            { label: "PUT a new id creates it (201)", check: `const body = { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }; const r = await put("/courses/10", body); eq(r.status, 201, "status"); eq((await get("/courses/10")).json, { id: 10, ...body }, "stored with id 10");` },
            { label: "The same PUT twice leaves the same state", check: `const body = { code: "XX-1", title: "Twice", weeks: 1, level: "beginner", price: 1 }; await put("/courses/20", body); await put("/courses/20", body); const all = await get("/courses/20"); eq(all.json, { id: 20, ...body }, "one course 20, unchanged by the repeat");` },
            { label: "An incomplete body → 400 INVALID_BODY", check: `const before = (await get("/courses/5")).json; const r = await put("/courses/5", { title: "Only a title" }); eq(r.status, 400, "status"); eq(r.json.error.code, "INVALID_BODY", "code"); eq((await get("/courses/5")).json, before, "the course is unchanged");` },
          ],
          hint: "Require all five fields; build the new course with the id from the URL; replace it at its index, or push it when the index is -1 (and answer 201).",
          successMessage: "Run the same PUT as often as you like: one course, one state. That is what makes PUT safe to retry, and POST not.",
        },
      },
      {
        id: "a-be-error-conventions",
        title: "API error response conventions",
        explain:
          "Clients handle errors in code, so errors need a FIXED SHAPE across every endpoint. This course uses { \"error\": { \"code\": \"COURSE_NOT_FOUND\", \"message\": \"Course 9 does not exist\", \"details\": [ … ] } }: a stable machine-readable code clients branch on, a human message (which may change), and optional details (one per invalid field). Many APIs use RFC 9457 'problem details' (application/problem+json with type, title, status, detail) instead; what matters is choosing one and using it everywhere. Never leak internals: no stack traces, SQL or file paths in responses. Log those on the server.",
        nodeLab: {
          task:
            "The routes answer errors in three different shapes. Make every error use { error: { code, message } } (plus details for validation): GET /courses/:id → 404 COURSE_NOT_FOUND \"Course <id> does not exist\"; POST /courses with a missing title or code → 400 VALIDATION_FAILED \"Invalid course\" with details [{ field, message: \"is required\" }] for each missing field; and unknown routes → 404 ROUTE_NOT_FOUND \"No route for <METHOD> <path>\" (add a final app.use handler).",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).send("not found");
  res.json(course);
});

app.post("/courses", (req, res) => {
  const { code, title } = req.body ?? {};
  if (!code || !title) return res.status(400).json({ message: "bad request", ok: false });
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json(course);
});`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
const apiError = (res, status, code, message, details) =>
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json(course);
});

app.post("/courses", (req, res) => {
  const { code, title } = req.body ?? {};
  const details = [];
  if (!code) details.push({ field: "code", message: "is required" });
  if (!title) details.push({ field: "title", message: "is required" });
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid course", details);
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json(course);
});

app.use((req, res) => apiError(res, 404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));`),
          },
          requests: [
            { label: "GET /courses/99", method: "GET", path: "/courses/99" },
            { label: "POST {}", method: "POST", path: "/courses", body: {} },
            { label: "GET /nope", method: "GET", path: "/nope" },
          ],
          tests: [
            { label: "GET /courses/99 → 404 COURSE_NOT_FOUND", check: `const r = await get("/courses/99"); eq(r.status, 404, "status"); eq(r.json, { error: { code: "COURSE_NOT_FOUND", message: "Course 99 does not exist" } }, "body");` },
            { label: "POST with missing fields → 400 VALIDATION_FAILED with details", check: `const r = await post("/courses", {}); eq(r.status, 400, "status"); eq(r.json, { error: { code: "VALIDATION_FAILED", message: "Invalid course", details: [{ field: "code", message: "is required" }, { field: "title", message: "is required" }] } }, "body"); const one = await post("/courses", { code: "X-1" }); eq(one.json.error.details, [{ field: "title", message: "is required" }], "only the missing field");` },
            { label: "Unknown routes → 404 ROUTE_NOT_FOUND as JSON", check: `const r = await request("DELETE", "/nowhere"); eq(r.status, 404, "status"); eq(r.json, { error: { code: "ROUTE_NOT_FOUND", message: "No route for DELETE /nowhere" } }, "body"); has(r.headers["content-type"], "application/json", "JSON, not Express's HTML page");` },
            { label: "Valid requests still work", check: `eq((await post("/courses", { code: "AI-101", title: "AI" })).status, 201, "a valid POST"); eq((await get("/courses/1")).status, 200, "a valid GET");` },
          ],
          hint: "One helper apiError(res, status, code, message, details) used everywhere, and app.use((req, res) => …) after all the routes for unknown routes.",
          successMessage: "Every error, everywhere, has the same shape. A client writes one error handler, and Express's default HTML 404 page never reaches a JSON client again.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 6.11 · EXERCISE: THE COURSE CATALOGUE API
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l44-catalogue",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["6.11"],
    title: "Exercise: The Course Catalogue API",
    subtitle: "GET, POST, PATCH and DELETE /courses, built to the conventions",
    estimatedMinutes: 90,
    intro: "Build the whole catalogue API from an empty server, using everything this week: methods, status codes, headers, parameters, validation and the error convention.",
    atoms: [
      {
        id: "a-be-catalogue-api",
        title: "The catalogue API",
        explain:
          "The specification: GET /courses (with ?level and ?q, answering { data, meta: { total } }); GET /courses/:id; POST /courses (code matches two or three capital letters, a hyphen and three digits, as BE-101; title 3 to 100 characters; weeks a whole number from 1 to 52; level beginner, intermediate or advanced; price a whole number of naira, 0 or more; a duplicate code is 409 DUPLICATE_CODE); PATCH /courses/:id (any of title, weeks, level, price, with the same rules; the code cannot change); DELETE /courses/:id. Validation errors are 400 VALIDATION_FAILED with one details entry per invalid field. Write a validate(input, { partial }) function and use it for both POST and PATCH.",
        nodeLab: {
          task:
            "Build the course catalogue API in server.js to the specification above, starting from the six courses in data.js. Every error uses { error: { code, message, details? } }; unknown routes are 404 ROUTE_NOT_FOUND.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": server(`
// GET /courses  GET /courses/:id  POST /courses  PATCH /courses/:id  DELETE /courses/:id
`),
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": server(`
const LEVELS = ["beginner", "intermediate", "advanced"];
const apiError = (res, status, code, message, details) =>
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });
const find = (id) => courses.find((c) => c.id === Number(id));
const notFound = (res, id) => apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);

const RULES = {
  code: (v) => typeof v === "string" && /^[A-Z]{2,3}-\\d{3}$/.test(v) || "must look like BE-101",
  title: (v) => (typeof v === "string" && v.trim().length >= 3 && v.trim().length <= 100) || "must be 3 to 100 characters",
  weeks: (v) => (Number.isInteger(v) && v >= 1 && v <= 52) || "must be a whole number from 1 to 52",
  level: (v) => LEVELS.includes(v) || \`must be one of \${LEVELS.join(", ")}\`,
  price: (v) => (Number.isInteger(v) && v >= 0) || "must be a whole number of naira, 0 or more",
};

function validate(input, { partial = false, fields = Object.keys(RULES) } = {}) {
  const details = [];
  for (const field of fields) {
    if (input?.[field] === undefined) {
      if (!partial) details.push({ field, message: "is required" });
      continue;
    }
    const result = RULES[field](input[field]);
    if (result !== true) details.push({ field, message: result });
  }
  return details;
}

app.get("/courses", (req, res) => {
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  if (req.query.q) data = data.filter((c) => c.title.toLowerCase().includes(String(req.query.q).toLowerCase()));
  res.json({ data, meta: { total: data.length } });
});

app.get("/courses/:id", (req, res) => {
  const course = find(req.params.id);
  if (!course) return notFound(res, req.params.id);
  res.json(course);
});

app.post("/courses", (req, res) => {
  const details = validate(req.body);
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid course", details);
  const { code, title, weeks, level, price } = req.body;
  if (courses.some((c) => c.code === code)) return apiError(res, 409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title: title.trim(), weeks, level, price };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

app.patch("/courses/:id", (req, res) => {
  const course = find(req.params.id);
  if (!course) return notFound(res, req.params.id);
  if (req.body?.code !== undefined) return apiError(res, 400, "VALIDATION_FAILED", "Invalid course", [{ field: "code", message: "cannot be changed" }]);
  const details = validate(req.body, { partial: true, fields: ["title", "weeks", "level", "price"] });
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid course", details);
  for (const field of ["title", "weeks", "level", "price"]) if (req.body?.[field] !== undefined) course[field] = req.body[field];
  res.json(course);
});

app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return notFound(res, req.params.id);
  courses.splice(index, 1);
  res.status(204).end();
});

app.use((req, res) => apiError(res, 404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));`),
          },
          requests: [
            { label: "GET /courses?level=beginner", method: "GET", path: "/courses?level=beginner" },
            { label: "POST valid", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 } },
            { label: "POST invalid", method: "POST", path: "/courses", body: { code: "ai101", title: "AI", weeks: 0, level: "expert", price: -5 } },
            { label: "PATCH /courses/3", method: "PATCH", path: "/courses/3", body: { weeks: 18 } },
            { label: "DELETE /courses/6", method: "DELETE", path: "/courses/6" },
          ],
          tests: [
            { label: "GET /courses with ?level and ?q", check: `eq((await get("/courses")).json.meta.total, 6, "all courses"); eq((await get("/courses?level=beginner")).json.data.map((c) => c.id), [1, 2, 4, 5], "level filter"); eq((await get("/courses?q=data")).json.data.map((c) => c.code), ["DB-101", "DA-301"], "search");` },
            { label: "POST creates a valid course (201, Location)", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }); eq(r.status, 201, "status"); eq(r.headers.location, "/courses/7", "Location"); eq(r.json, { id: 7, code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }, "body");` },
            { label: "POST reports every invalid field", check: `const r = await post("/courses", { code: "ai101", title: "AI", weeks: 0, level: "expert", price: -5 }); eq(r.status, 400, "status"); eq(r.json.error.code, "VALIDATION_FAILED", "code"); eq(r.json.error.details.map((d) => d.field), ["code", "title", "weeks", "level", "price"], "one entry per invalid field"); const missing = await post("/courses", {}); eq(missing.json.error.details.length, 5, "all five missing"); assert(missing.json.error.details.every((d) => d.message === "is required"), "missing fields say is required");` },
            { label: "A duplicate code → 409 DUPLICATE_CODE", check: `const r = await post("/courses", { code: "BE-101", title: "Copy", weeks: 4, level: "beginner", price: 0 }); eq(r.status, 409, "status"); eq(r.json.error.code, "DUPLICATE_CODE", "code");` },
            { label: "PATCH validates partially and cannot change the code", check: `const ok = await patch("/courses/3", { weeks: 18 }); eq([ok.status, ok.json.weeks, ok.json.title], [200, 18, "React Development"], "PATCH weeks only"); const bad = await patch("/courses/3", { weeks: 99 }); eq(bad.status, 400, "invalid weeks"); eq(bad.json.error.details, [{ field: "weeks", message: "must be a whole number from 1 to 52" }], "details"); eq((await patch("/courses/3", { code: "XX-999" })).status, 400, "the code cannot change"); eq((await patch("/courses/99", { weeks: 2 })).status, 404, "missing course");` },
            { label: "DELETE, and unknown routes", check: `eq((await del("/courses/6")).status, 204, "DELETE"); eq((await get("/courses/6")).status, 404, "gone"); const r = await get("/teachers"); eq([r.status, r.json.error.code], [404, "ROUTE_NOT_FOUND"], "unknown route");` },
          ],
          hint: "Write RULES as one small function per field returning true or a message, then validate(input, { partial, fields }) collects details. POST uses all fields; PATCH uses partial: true without code.",
          successMessage: "A complete, consistent REST API. Notice how much of it is validation: Week 7 replaces your RULES with a zod schema, and Week 11 replaces the array with PostgreSQL.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 6.P · DELIVERABLE: A DOCUMENTED COURSE-MANAGEMENT API
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l45-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["6.P"],
    title: "Deliverable: A Documented Course-Management API",
    subtitle: "An API others can use without asking you",
    estimatedMinutes: 75,
    intro: "An API nobody can use without asking its author is unfinished. This week's deliverable is your catalogue API plus the document a client developer needs: every endpoint, its parameters, bodies, responses and errors.",
    atoms: [
      {
        id: "a-be-api-docs",
        title: "Documenting an API",
        explain:
          "API documentation lists, for each endpoint: the method and path; what it does; path and query parameters with types and defaults; the request body with each field's rules; every response status with an example body; and the errors it can return, with their codes. Start with the shared conventions (base URL, content type, the error format, pagination) so you do not repeat them. Examples should be real, copy-pasteable requests (curl) and responses. Week 8 writes the same information as an OpenAPI document that tools can read; the Markdown version is for humans first.",
        nodeLab: {
          task:
            "Write API.md for the catalogue API you built. It needs a ## Conventions section mentioning the error format (VALIDATION_FAILED) and the base URL; then one ## section per endpoint, titled with the method and path exactly (## GET /courses, ## GET /courses/:id, ## POST /courses, ## PATCH /courses/:id, ## DELETE /courses/:id), each listing the status codes it can return and at least one example in a code block. POST /courses must list its five fields and its 409 error.",
          command: false,
          files: {
            "API.md": "# Course Catalogue API\n\n## Conventions\n",
          },
          open: "API.md",
          solution: {
            "API.md":
              "# Course Catalogue API\n\n## Conventions\n\nBase URL: `http://localhost:3000`. Requests and responses are JSON (`Content-Type: application/json`).\n\nEvery error has the same shape:\n\n```json\n{ \"error\": { \"code\": \"VALIDATION_FAILED\", \"message\": \"Invalid course\", \"details\": [{ \"field\": \"title\", \"message\": \"is required\" }] } }\n```\n\nCodes: VALIDATION_FAILED (400), COURSE_NOT_FOUND (404), DUPLICATE_CODE (409), ROUTE_NOT_FOUND (404).\n\n## GET /courses\n\nLists courses. Query: `level` (beginner, intermediate, advanced), `q` (search in titles).\n\nResponses: 200.\n\n```bash\ncurl \"http://localhost:3000/courses?level=beginner\"\n```\n\n```json\n{ \"data\": [{ \"id\": 1, \"code\": \"BE-101\", \"title\": \"Backend Engineering\", \"weeks\": 24, \"level\": \"beginner\", \"price\": 120000 }], \"meta\": { \"total\": 4 } }\n```\n\n## GET /courses/:id\n\nOne course. Responses: 200, 404 COURSE_NOT_FOUND.\n\n```bash\ncurl http://localhost:3000/courses/1\n```\n\n## POST /courses\n\nCreates a course. Body fields:\n\n| Field | Rule |\n| --- | --- |\n| code | two or three capital letters, a hyphen, three digits (BE-101); unique |\n| title | 3 to 100 characters |\n| weeks | whole number, 1 to 52 |\n| level | beginner, intermediate or advanced |\n| price | whole number of naira, 0 or more |\n\nResponses: 201 with a Location header, 400 VALIDATION_FAILED, 409 DUPLICATE_CODE.\n\n```bash\ncurl -X POST http://localhost:3000/courses -H \"Content-Type: application/json\" -d '{\"code\":\"AI-101\",\"title\":\"AI & Automation\",\"weeks\":12,\"level\":\"beginner\",\"price\":70000}'\n```\n\n## PATCH /courses/:id\n\nChanges any of title, weeks, level, price (same rules). The code cannot change.\n\nResponses: 200, 400 VALIDATION_FAILED, 404 COURSE_NOT_FOUND.\n\n```bash\ncurl -X PATCH http://localhost:3000/courses/3 -H \"Content-Type: application/json\" -d '{\"weeks\":18}'\n```\n\n## DELETE /courses/:id\n\nDeletes a course. Responses: 204 (no body), 404 COURSE_NOT_FOUND.\n\n```bash\ncurl -X DELETE http://localhost:3000/courses/6\n```\n",
          },
          tests: [
            { label: "## Conventions mentions the error format and the base URL", check: `const s = section(file("API.md"), "Conventions"); assert(s && s.trim(), "add a ## Conventions section"); has(s, "VALIDATION_FAILED", "describe the error format, including VALIDATION_FAILED"); assert(/localhost:3000|base url/i.test(s), "give the base URL");` },
            { label: "One section per endpoint, titled with its method and path", check: `const t = file("API.md"); for (const h of ["GET /courses", "GET /courses/:id", "POST /courses", "PATCH /courses/:id", "DELETE /courses/:id"]) assert(section(t, h) !== null, "missing the section ## " + h);` },
            { label: "Each endpoint lists its status codes and has an example", check: `const t = file("API.md"); const want = { "GET /courses": ["200"], "GET /courses/:id": ["200", "404"], "POST /courses": ["201", "400", "409"], "PATCH /courses/:id": ["200", "400", "404"], "DELETE /courses/:id": ["204", "404"] }; for (const [h, codes] of Object.entries(want)) { const s = section(t, h) || ""; for (const c of codes) has(s, c, h + " should list status " + c); assert(/\`\`\`/.test(s), h + " needs an example in a code block"); }` },
            { label: "POST /courses lists its five fields", check: `const s = section(file("API.md"), "POST /courses") || ""; for (const f of ["code", "title", "weeks", "level", "price"]) has(s, f, "POST /courses should document the field " + f); has(s, "DUPLICATE_CODE", "POST /courses should document its 409 DUPLICATE_CODE error");` },
          ],
          hint: "Write the conventions once (base URL, JSON, the error shape and its codes), then for each endpoint: what it does, parameters or body, the status codes, and a curl example in a ```bash block.",
          successMessage: "A client developer can now use the API without reading your code or asking you. Week 8 turns this into OpenAPI, which generates interactive docs and client code from the same information.",
        },
      },
    ],
    task: {
      title: "Week 6 deliverable: a documented course-management API",
      intro: "Run the catalogue API on your computer and publish it with its documentation.",
      prompts: [
        "Create the project on your computer (npm install express) with your catalogue server from Lesson 44, and run it.",
        "Call every endpoint with curl -i, including every error case, and check each status code and body against API.md.",
        "Add pagination (?page and ?limit with meta) and sorting (?sort=-price) from Lesson 42 to GET /courses, and document them.",
        "Commit server.js, data.js and API.md to your repository, with a README that links to API.md.",
        "Checkpoint: every endpoint of your course API returns the right status code and a consistent body for valid, invalid and missing resources.",
      ],
      closing: "Next: Week 7, Express in depth: middleware, routers, validation with zod, logging and centralized error handling.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
