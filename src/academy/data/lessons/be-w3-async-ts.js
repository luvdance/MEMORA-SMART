/**
 * BACKEND ENGINEERING · WEEK 3 · ADVANCED JAVASCRIPT, ASYNC AND TYPESCRIPT
 *
 * Curriculum 3.1 – 3.P. Callbacks and higher-order functions, closures,
 * prototypes and classes, try/catch/finally, promises and async/await, the
 * event loop, JSON, fetch, environment configuration, TypeScript, four
 * exercises and a typed asynchronous application.
 *
 * Labs run on the lab machine's virtual clock: a call that waits 300 ms
 * waits 300 virtual ms, so checks can measure whether work ran in parallel.
 * The labs' "public API" is the Academy Data API, an Express app hosted in
 * the lab at https://api.academydata.example (the lab has no internet);
 * checks can make it fail or slow down on purpose. A recorded terminal shows
 * the same code against a real public API. TypeScript labs are type-checked
 * by the real compiler (npx tsc --noEmit) against the real type definitions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { JS, decide, pkg, shown, term } from "./be-helpers.js";

export const SECTION_ID = "be-s3-async-ts";
const MODULE = "be-w3-async-ts";

const PKG = pkg({ name: "academy-async", scripts: { start: "node index.js" } });

/* ── The Academy Data API: the labs' public API ───────────────────────── */

export const DATA_API = "https://api.academydata.example";

/** The service, as an Express app. Checks set app.locals.failNext / delayMs. */
export const DATA_API_SERVICE = `const express = require("express");
const app = express();
app.locals.failNext = 0;
app.locals.delayMs = 0;
app.locals.requests = 0;

const courses = [
  { id: 1, code: "BE-101", title: "Backend Engineering", weeks: 24, level: "beginner", rating: 4.8 },
  { id: 2, code: "DB-101", title: "Relational Databases", weeks: 16, level: "beginner", rating: 4.7 },
  { id: 3, code: "WD-201", title: "React Development", weeks: 16, level: "intermediate", rating: 4.6 },
  { id: 4, code: "CS-101", title: "Cybersecurity", weeks: 16, level: "beginner", rating: 4.5 },
  { id: 5, code: "MD-101", title: "Mobile App Development", weeks: 24, level: "beginner", rating: 4.9 },
];

app.use(async (req, res, next) => {
  app.locals.requests += 1;
  if (app.locals.delayMs) await new Promise((resolve) => setTimeout(resolve, app.locals.delayMs));
  if (app.locals.failNext > 0) {
    app.locals.failNext -= 1;
    return res.status(503).json({ error: "Service temporarily unavailable" });
  }
  next();
});

app.get("/v1/courses", (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = 2;
  const totalPages = Math.ceil(courses.length / perPage);
  res.json({ page, totalPages, data: courses.slice((page - 1) * perPage, page * perPage) });
});

app.get("/v1/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

module.exports = app;
`;

const SERVICES = { [DATA_API]: DATA_API_SERVICE };

/* ── TypeScript projects ─────────────────────────────────────────────── */

export const TSCONFIG = `${JSON.stringify(
  {
    compilerOptions: {
      target: "es2023",
      module: "nodenext",
      moduleResolution: "nodenext",
      strict: true,
      noEmit: true,
      allowImportingTsExtensions: true,
      verbatimModuleSyntax: true,
      erasableSyntaxOnly: true,
      skipLibCheck: true,
      types: ["node"],
    },
    include: ["src"],
  },
  null,
  2
)}\n`;

const TS_PKG = (name, start = "node src/index.ts") =>
  pkg({ name, scripts: { start, typecheck: "tsc --noEmit" }, dev: ["typescript", "@types/node"] });

export const NO_TYPE_ERRORS = { label: "npx tsc --noEmit finds no type errors", check: `const errs = (await typecheck()).filter((d) => d.category === "error"); assert(errs.length === 0, "tsc reports type errors:\\n" + errs.map((d) => d.file + ":" + d.line + " " + d.code + " " + d.message).join("\\n"));` };

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 3.1 – 3.2 · HIGHER-ORDER FUNCTIONS AND CLOSURES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l17-closures",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2"],
    title: "Callbacks, Higher-Order Functions and Closures",
    subtitle: "Functions that take functions, and functions that remember",
    estimatedMinutes: 55,
    intro:
      "In JavaScript a function is a value: you can pass it, return it and store it. Express is built on this: every route handler and middleware is a function you hand to Express to call later. This lesson makes the idea, and its partner the closure, second nature.",
    atoms: [
      {
        id: "a-be-callbacks",
        title: "Callbacks and higher-order functions",
        explain:
          "A CALLBACK is a function you pass to another function so that it can call it: scores.map((s) => s * 2) passes the arrow function as a callback. A HIGHER-ORDER FUNCTION takes or returns functions: map, filter, sort and setTimeout are all higher-order, and so are Express's app.get(path, handler) and app.use(middleware). Pass the function itself (handler), not its result (handler()): the first hands it over to be called later, the second calls it now. Callbacks were also Node's original way of saying 'tell me when you are done', as in fs.readFile(path, callback); promises (Lesson 19) replaced most of those.",
        codeExercise: {
          language: JS,
          code: 'function applyTwice(fn, value) {\n  return fn(fn(value));\n}\nconst addVat = (amount) => amount * 1.1;\nconst shout = (text) => text.toUpperCase() + "!";\n\nconsole.log(applyTwice(shout, "hi"));\nconsole.log(Math.round(applyTwice(addVat, 1000)));\nconsole.log(["b", "a", "c"].sort((x, y) => (x < y ? 1 : -1)).join(""));\n',
          question: "applyTwice calls the function it is given twice. What is printed?",
          expectedOutput: "HI!!\n1210\ncba",
          hint: "shout(\"hi\") is \"HI!\", and shout of that is \"HI!!\". 1000 × 1.1 × 1.1 = 1210. The sort callback puts larger letters first.",
          successMessage: "applyTwice does not know or care what the function does: that is the power of passing behaviour as a value. Middleware works the same way.",
        },
      },
      {
        id: "a-be-closures",
        title: "Lexical scope and closures",
        explain:
          "A function can use the variables of the scope it was WRITTEN in (lexical scope), and it keeps them even after that scope has finished running. That combination, a function plus the variables it remembers, is a CLOSURE. makeCounter() below returns a function that remembers its own count; two counters have two separate counts, and nothing outside can touch them. Closures are everywhere in backends: a middleware factory like requireRole(\"admin\") returns a function that remembers which role it checks (Week 14), and a rate limiter remembers how many requests each client made (Week 8).",
        codeExercise: {
          language: JS,
          code: "function makeCounter(start = 0) {\n  let count = start;\n  return () => {\n    count += 1;\n    return count;\n  };\n}\nconst visits = makeCounter();\nconst signups = makeCounter(100);\nvisits();\nvisits();\nconsole.log(visits(), signups(), visits());\n",
          question: "Two counters, each with its own remembered count. What is printed?",
          expectedOutput: "3 101 4",
          hint: "visits was called twice before the log, so the next call gives 3. signups started at 100. Each closure has its own count.",
          successMessage: "Each call of makeCounter created a new count, and each returned function closed over its own. Private state without a class.",
        },
      },
      {
        id: "a-be-closures-lab",
        title: "Functions that build functions",
        explain:
          "Two classic closures you will use in backends. An ID GENERATOR remembers the last number it handed out, so every call gives the next one. MEMOIZATION wraps a slow function so that repeated calls with the same argument return the remembered answer instead of doing the work again: a small cache living inside a closure. Week 18 does the same with Redis, shared by every server.",
        nodeLab: {
          task:
            "In tools.js write: makeIdGenerator(prefix) → a function that returns prefix-0001, then prefix-0002, and so on (four digits, padded with zeros); and memoize(fn) → a function that calls fn(arg) the first time it sees an argument and returns the remembered result for the same argument after that. Each generator has its own count.",
          files: {
            "package.json": PKG,
            "tools.js": "export function makeIdGenerator(prefix) {\n}\n\nexport function memoize(fn) {\n}\n",
            "index.js": 'import { makeIdGenerator, memoize } from "./tools.js";\n\nconst studentId = makeIdGenerator("STU");\nconst courseId = makeIdGenerator("CRS");\nconsole.log(studentId(), studentId(), courseId(), studentId());\n\nconst slowSquare = (n) => {\n  console.log(`  computing ${n} * ${n}…`);\n  return n * n;\n};\nconst fastSquare = memoize(slowSquare);\nconsole.log(fastSquare(12), fastSquare(12), fastSquare(5));\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "tools.js",
          solution: {
            "tools.js":
              'export function makeIdGenerator(prefix) {\n  let last = 0;\n  return () => {\n    last += 1;\n    return `${prefix}-${String(last).padStart(4, "0")}`;\n  };\n}\n\nexport function memoize(fn) {\n  const cache = new Map();\n  return (arg) => {\n    if (!cache.has(arg)) cache.set(arg, fn(arg));\n    return cache.get(arg);\n  };\n}\n',
          },
          tests: [
            { label: "Each generator counts on its own: STU-0001, STU-0002, CRS-0001", check: `const { makeIdGenerator } = await load("tools.js"); const a = makeIdGenerator("STU"); const b = makeIdGenerator("CRS"); eq([a(), a(), b(), a()], ["STU-0001", "STU-0002", "CRS-0001", "STU-0003"], "ids from two generators");` },
            { label: "Numbers are padded to four digits", check: `const { makeIdGenerator } = await load("tools.js"); const g = makeIdGenerator("X"); let id; for (let i = 0; i < 12; i++) id = g(); eq(id, "X-0012", "the 12th id");` },
            { label: "memoize calls the function once per argument", check: `const { memoize } = await load("tools.js"); let calls = 0; const f = memoize((n) => { calls++; return n * 2; }); eq([f(3), f(3), f(4), f(3)], [6, 6, 8, 6], "the results"); eq(calls, 2, "the wrapped function should run only for 3 and 4");` },
            { label: "Two memoized functions keep separate caches", check: `const { memoize } = await load("tools.js"); const sq = memoize((n) => n * n); const neg = memoize((n) => -n); eq([sq(2), neg(2)], [4, -2], "each wrapper remembers its own results");` },
          ],
          hint: "Declare let last = 0 (or const cache = new Map()) inside the outer function, and return an arrow function that uses it.",
          successMessage: "Run index.js and watch the log: 'computing 12 * 12' appears once. The cache lives in the closure, private to each memoized function.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 3.3 – 3.4 · OBJECTS, PROTOTYPES, CLASSES AND ERRORS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l18-classes",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.3", "3.4"],
    title: "Objects, Prototypes, Classes and Error Handling",
    subtitle: "Modelling things, and failing in a way callers can handle",
    estimatedMinutes: 60,
    intro:
      "Classes give a name and a shape to the things your backend models: a course, an enrollment, a payment. Errors are how a function says it could not do its job. Together they let business rules fail with a precise, catchable reason.",
    atoms: [
      {
        id: "a-be-classes",
        title: "Objects, prototypes and classes",
        explain:
          "Every JavaScript object has a PROTOTYPE, another object it falls back to when a property is missing: that is how every array has map without each array storing it. A CLASS is the modern way to set up that sharing: class Course { constructor(title, seats) { this.title = title; this.seats = seats; } enroll(student) { … } } creates objects with new Course(\"Node\", 30); each has its own title and seats, and they all share one enroll method on Course.prototype. extends builds on another class and super calls its version. #fields are truly private. Use classes for things with behaviour and rules; plain objects for plain data.",
        codeExercise: {
          language: JS,
          code: 'class Course {\n  #enrolled = [];\n  constructor(title, seats) {\n    this.title = title;\n    this.seats = seats;\n  }\n  enroll(name) {\n    this.#enrolled.push(name);\n    return this.seats - this.#enrolled.length;\n  }\n}\nconst node = new Course("Node.js", 2);\nconsole.log(node.enroll("Ada"), node.enroll("Bayo"));\nconsole.log(Object.keys(node));\nconsole.log(typeof node.enroll, node.enroll === new Course("SQL", 5).enroll);\n',
          question: "What does this print?",
          expectedOutput: "1 0\n[ 'title', 'seats' ]\nfunction true",
          hint: "enroll returns the seats left after each enrollment. #enrolled is private, so Object.keys does not list it. All courses share the same enroll method from the prototype.",
          successMessage: "Each course has its own title and seats; enroll lives once, on Course.prototype, shared by every course. The private #enrolled list cannot be read or changed from outside.",
        },
      },
      {
        id: "a-be-try-catch",
        title: "try, catch and finally",
        explain:
          "throw stops a function and hands an error to whoever called it, all the way up until something CATCHES it. try { … } catch (err) { … } runs the try block and, if anything inside throws, jumps to catch with the error. finally runs afterwards in every case, error or not, even after a return: the place to release resources (close a file, return a database connection to the pool, Week 11). Catch errors where you can do something useful with them: retry, translate them into an HTTP status, or log them. Catching to ignore is how bugs hide.",
        codeExercise: {
          language: JS,
          code: 'function withdraw(balance, amount) {\n  try {\n    console.log("checking");\n    if (amount > balance) throw new Error("Insufficient funds");\n    return balance - amount;\n  } catch (err) {\n    console.log("caught:", err.message);\n    return balance;\n  } finally {\n    console.log("audit logged");\n  }\n}\nconsole.log(withdraw(100, 30));\nconsole.log(withdraw(100, 300));\n',
          question: "finally always runs. In what order are the lines printed?",
          expectedOutput: "checking\naudit logged\n70\nchecking\ncaught: Insufficient funds\naudit logged\n100",
          hint: "The first call returns 70, but finally runs before the caller gets it. The second throws, is caught, returns 100, and finally still runs first.",
          successMessage: "finally ran even when try returned: that guarantee is why connections are released in finally blocks.",
        },
      },
      {
        id: "a-be-custom-errors",
        title: "Errors with a meaning",
        explain:
          "new Error(\"Course is full\") tells a human what went wrong, but code should not branch on message text. Define ERROR CLASSES: class CourseFullError extends Error with name set and extra fields, such as a statusCode an API can use (409 Conflict). Callers then test err instanceof CourseFullError, and an Express error handler can turn every such error into the right HTTP response in one place (Week 7). This is how business rules fail precisely.",
        nodeLab: {
          task:
            "In course.js, write two error classes that extend Error: CourseFullError (name \"CourseFullError\", statusCode 409, message \"<title> is full\") and AlreadyEnrolledError (name \"AlreadyEnrolledError\", statusCode 409, message \"<student> is already enrolled in <title>\"). Then finish Course.enroll(student): throw AlreadyEnrolledError for a repeat, CourseFullError when no seats are left, otherwise add the student and return the seats left.",
          files: {
            "package.json": PKG,
            "course.js":
              'export class CourseFullError extends Error {\n}\n\nexport class AlreadyEnrolledError extends Error {\n}\n\nexport class Course {\n  constructor(title, seats) {\n    this.title = title;\n    this.seats = seats;\n    this.students = [];\n  }\n\n  enroll(student) {\n    // Already enrolled → AlreadyEnrolledError. Full → CourseFullError.\n    this.students.push(student);\n    return this.seats - this.students.length;\n  }\n}\n',
            "index.js":
              'import { Course, CourseFullError } from "./course.js";\n\nconst course = new Course("Node.js", 2);\nfor (const name of ["Ada", "Bayo", "Ada", "Chiamaka"]) {\n  try {\n    console.log(`${name}: enrolled, ${course.enroll(name)} seat(s) left`);\n  } catch (err) {\n    const kind = err instanceof CourseFullError ? "full" : "other";\n    console.log(`${name}: ${err.name} (${err.statusCode}, ${kind}): ${err.message}`);\n  }\n}\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "course.js",
          solution: {
            "course.js":
              'export class CourseFullError extends Error {\n  constructor(title) {\n    super(`${title} is full`);\n    this.name = "CourseFullError";\n    this.statusCode = 409;\n  }\n}\n\nexport class AlreadyEnrolledError extends Error {\n  constructor(student, title) {\n    super(`${student} is already enrolled in ${title}`);\n    this.name = "AlreadyEnrolledError";\n    this.statusCode = 409;\n  }\n}\n\nexport class Course {\n  constructor(title, seats) {\n    this.title = title;\n    this.seats = seats;\n    this.students = [];\n  }\n\n  enroll(student) {\n    if (this.students.includes(student)) throw new AlreadyEnrolledError(student, this.title);\n    if (this.students.length >= this.seats) throw new CourseFullError(this.title);\n    this.students.push(student);\n    return this.seats - this.students.length;\n  }\n}\n',
          },
          tests: [
            { label: "enroll returns the seats left", check: `const { Course } = await load("course.js"); const c = new Course("SQL", 3); eq([c.enroll("A"), c.enroll("B")], [2, 1], "seats left after each enrollment");` },
            { label: "A full course throws CourseFullError (409, '<title> is full')", check: `const { Course, CourseFullError } = await load("course.js"); const c = new Course("SQL", 1); c.enroll("A"); let e = null; try { c.enroll("B"); } catch (x) { e = x; } assert(e, "enrolling in a full course should throw"); assert(e instanceof CourseFullError, "the error should be a CourseFullError"); assert(e instanceof Error, "CourseFullError should extend Error"); eq([e.name, e.statusCode, e.message], ["CourseFullError", 409, "SQL is full"], "name, statusCode and message");` },
            { label: "A repeat throws AlreadyEnrolledError, and is not added twice", check: `const { Course, AlreadyEnrolledError } = await load("course.js"); const c = new Course("SQL", 5); c.enroll("Ada"); let e = null; try { c.enroll("Ada"); } catch (x) { e = x; } assert(e instanceof AlreadyEnrolledError, "a repeat enrollment should throw AlreadyEnrolledError"); eq([e.name, e.statusCode, e.message], ["AlreadyEnrolledError", 409, "Ada is already enrolled in SQL"], "name, statusCode and message"); eq(c.students, ["Ada"], "Ada should be listed once");` },
            { label: "A repeat is reported even when the course is full", check: `const { Course, AlreadyEnrolledError } = await load("course.js"); const c = new Course("SQL", 1); c.enroll("Ada"); let e = null; try { c.enroll("Ada"); } catch (x) { e = x; } assert(e instanceof AlreadyEnrolledError, "Ada is already in: say so, rather than that the course is full");` },
          ],
          hint: "class CourseFullError extends Error { constructor(title) { super(`${title} is full`); this.name = \"CourseFullError\"; this.statusCode = 409; } }. In enroll, check the repeat first, then the seats.",
          successMessage: "Errors with names and status codes: callers can tell them apart with instanceof, and an API can answer 409 with the message. Week 7 turns these into HTTP responses in one error handler.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 3.5 – 3.6 · PROMISES, ASYNC/AWAIT AND THE EVENT LOOP
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l19-async",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.5", "3.6"],
    title: "Promises, async/await and the Event Loop",
    subtitle: "Doing many things at once on one thread",
    estimatedMinutes: 65,
    intro:
      "A backend spends most of its time waiting: for the database, for another API, for a file. Node.js does not sit idle while it waits; it starts other work. Promises and async/await are how you write code that waits without blocking, and the event loop is what makes it work.",
    atoms: [
      {
        id: "a-be-promises",
        title: "Promises and async/await",
        explain:
          "A PROMISE is a placeholder for a result that is not ready yet. It is pending, then either fulfilled with a value or rejected with an error. fetch(), database queries and file reads return promises. await promise pauses the current async function until it settles, giving the value or throwing the error, so asynchronous code reads like normal code, and try/catch handles failures. An async function always returns a promise. Forgetting await is a classic bug: you get a Promise object instead of the data, and a rejection nobody catches.",
        codeExercise: {
          language: JS,
          code: 'function findCourse(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id === 1) resolve({ id, title: "Node.js" });\n      else reject(new Error(`Course ${id} not found`));\n    }, 10);\n  });\n}\n\nasync function show(id) {\n  try {\n    const course = await findCourse(id);\n    console.log("found", course.title);\n  } catch (err) {\n    console.log("error:", err.message);\n  }\n}\n\nasync function main() {\n  const p = findCourse(1);\n  console.log(p instanceof Promise);\n  await show(1);\n  await show(2);\n  console.log("done");\n}\nmain();\n',
          question: "What is printed, in order?",
          expectedOutput: "true\nfound Node.js\nerror: Course 2 not found\ndone",
          hint: "findCourse returns a promise at once. Each await show(…) waits for its lookup; the rejection for id 2 lands in show's catch.",
          successMessage: "await turned the promise into its value (or its error), so try/catch handled the failure like any thrown error.",
        },
      },
      {
        id: "a-be-event-loop",
        title: "The event loop and non-blocking I/O",
        explain:
          "Node.js runs your JavaScript on ONE thread. When code starts slow input/output (a query, a request, a file read), Node hands the waiting to the operating system and moves on; when the result is ready, a callback is queued. The EVENT LOOP runs queued callbacks one at a time: first all the synchronous code, then promise reactions (the MICROTASK queue), then timers and I/O callbacks. That is why one Node process can serve thousands of waiting requests. The catch: while your code is computing, nothing else runs. A slow synchronous loop blocks every user (Week 20).",
        codeExercise: {
          language: JS,
          code: 'console.log("1 start");\nsetTimeout(() => console.log("4 timer"), 0);\nPromise.resolve().then(() => console.log("3 promise"));\nconsole.log("2 end of script");\n',
          question: "A timer of 0 ms and a resolved promise. In what order do the four lines print?",
          expectedOutput: "1 start\n2 end of script\n3 promise\n4 timer",
          hint: "All synchronous code runs first. Then promise reactions (microtasks). Timers come after, even with 0 ms.",
          successMessage: "Synchronous code, then microtasks, then timers. 0 ms means 'as soon as the loop gets there', never 'now'.",
        },
      },
      {
        id: "a-be-parallel",
        title: "Sequential or parallel",
        explain:
          "Three independent lookups that each take 300 ms: awaited one after another they take 900 ms; started together and awaited with Promise.all([a(), b(), c()]) they take about 300 ms, because the waiting overlaps. Promise.all rejects as soon as any one rejects; Promise.allSettled waits for all and reports each result. Only parallelise work that is independent: if b needs a's result, it must wait. This lab runs on the lab's clock, so the checks can measure exactly how long your code waited.",
        nodeLab: {
          task:
            "loadDashboard(userId) in dashboard.js awaits three independent lookups one after another, so it takes 900 ms. Make it start all three together with Promise.all so it takes about 300 ms, and still return { profile, courses, notifications }. api.js is the data layer: do not change it.",
          files: {
            "package.json": PKG,
            "api.js":
              'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nexport async function getProfile(userId) {\n  await wait(300);\n  return { id: userId, name: "Ada Obi" };\n}\n\nexport async function getCourses(userId) {\n  await wait(300);\n  return ["Backend Engineering", "Relational Databases"];\n}\n\nexport async function getNotifications(userId) {\n  await wait(300);\n  return [{ text: "Week 3 is open" }];\n}\n',
            "dashboard.js":
              'import { getProfile, getCourses, getNotifications } from "./api.js";\n\nexport async function loadDashboard(userId) {\n  const profile = await getProfile(userId);\n  const courses = await getCourses(userId);\n  const notifications = await getNotifications(userId);\n  return { profile, courses, notifications };\n}\n',
            "index.js":
              'import { loadDashboard } from "./dashboard.js";\n\nconst started = performance.now();\nconst dashboard = await loadDashboard(7);\nconsole.log(dashboard.profile.name, "-", dashboard.courses.length, "courses");\nconsole.log(`Loaded in ${Math.round(performance.now() - started)} ms`);\n',
          },
          readOnly: ["package.json", "api.js", "index.js"],
          open: "dashboard.js",
          solution: {
            "dashboard.js":
              'import { getProfile, getCourses, getNotifications } from "./api.js";\n\nexport async function loadDashboard(userId) {\n  const [profile, courses, notifications] = await Promise.all([\n    getProfile(userId),\n    getCourses(userId),\n    getNotifications(userId),\n  ]);\n  return { profile, courses, notifications };\n}\n',
          },
          tests: [
            { label: "loadDashboard still returns profile, courses and notifications", check: `const { loadDashboard } = await load("dashboard.js"); const d = await wait(loadDashboard(7)); eq(d, { profile: { id: 7, name: "Ada Obi" }, courses: ["Backend Engineering", "Relational Databases"], notifications: [{ text: "Week 3 is open" }] }, "the dashboard");` },
            { label: "It takes about 300 ms, not 900", check: `const { loadDashboard } = await load("dashboard.js"); const t0 = now(); await wait(loadDashboard(7)); const took = now() - t0; assert(took < 400, "loadDashboard took " + Math.round(took) + " ms: the three lookups are still waiting one after another");` },
            { label: "It uses Promise.all", check: `has(source("dashboard.js"), "Promise.all", "start the three lookups together with Promise.all");` },
          ],
          hint: "const [profile, courses, notifications] = await Promise.all([getProfile(userId), getCourses(userId), getNotifications(userId)]);",
          successMessage: "Run index.js: 'Loaded in 300 ms' (on the lab's clock). The three waits overlapped. That is the most common performance win in backend code.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 3.7 – 3.9 · JSON, FETCH AND CONFIGURATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l20-json-fetch",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.7", "3.8", "3.9"],
    title: "JSON, Fetching Remote Data and Configuration",
    subtitle: "Talking to other services, configured from outside",
    estimatedMinutes: 65,
    intro:
      "Backends talk to other backends: payment providers, email services, other teams' APIs. They speak JSON over HTTP, and they are configured from the environment, never from values baked into the code.",
    atoms: [
      {
        id: "a-be-json",
        title: "JSON serialization and parsing",
        explain:
          "JSON is the text format APIs exchange: objects, arrays, strings (double quotes only), numbers, true, false and null. JSON.stringify(value) turns a value into JSON text; JSON.parse(text) turns it back. Some things do not survive the trip: undefined properties and functions are dropped, Dates become ISO strings (and stay strings when parsed back), Map and Set become {}. JSON.parse throws SyntaxError on invalid text, which every API must expect from its clients. JSON.stringify(value, null, 2) pretty-prints for logs and files.",
        codeExercise: {
          language: JS,
          code: 'const enrollment = {\n  student: "Ada",\n  paid: true,\n  note: undefined,\n  enrolledOn: new Date("2026-01-12T09:00:00Z"),\n  tags: new Set(["new"]),\n};\nconst text = JSON.stringify(enrollment);\nconsole.log(text);\nconst back = JSON.parse(text);\nconsole.log(typeof back.enrolledOn);\ntry {\n  JSON.parse("{ student: \'Ada\' }");\n} catch (err) {\n  console.log(err.name);\n}\n',
          question: "What survives the round trip through JSON?",
          expectedOutput: '{"student":"Ada","paid":true,"enrolledOn":"2026-01-12T09:00:00.000Z","tags":{}}\nstring\nSyntaxError',
          hint: "undefined is dropped, the Date becomes its ISO string, a Set becomes {}. JSON needs double-quoted names and strings.",
          successMessage: "Dates come back as strings and Sets as empty objects: convert deliberately on both sides. And JSON.parse of a client's body can always throw.",
        },
      },
      {
        id: "a-be-fetch",
        title: "Fetching remote data",
        explain:
          "fetch(url, options) sends an HTTP request and returns a promise of a Response. Read its status and headers, then its body with await response.json() (or .text()). Two failures look very different: an HTTP error (404, 500, 503) still RESOLVES, with response.ok false, so you must check it; a network failure (no such host, connection refused, timeout) REJECTS with TypeError: fetch failed and a cause. Below is a real public API, then a missing resource and a host that does not exist. In the lab, the Academy Data API stands in for the internet.",
        example: `${shown("w3-fetch", "node fetch-users.js")}\n\n${shown("w3-fetch", "node fetch-missing.js")}\n\n${shown("w3-fetch", "node fetch-down.js")}`,
        nodeLab: {
          task: `Finish courses.js: getCourse(id) fetches ${DATA_API}/v1/courses/<id> and returns the course object; if the response is not ok, it throws new Error("Course <id> not found (HTTP <status>)"). index.js prints a course and handles a missing one.`,
          files: {
            "package.json": PKG,
            "courses.js": `const API = "${DATA_API}";\n\nexport async function getCourse(id) {\n  // fetch \`\${API}/v1/courses/\${id}\`, check response.ok, return the JSON\n}\n`,
            "index.js": 'import { getCourse } from "./courses.js";\n\nconst course = await getCourse(1);\nconsole.log(course.code, course.title);\ntry {\n  await getCourse(99);\n} catch (err) {\n  console.log("Error:", err.message);\n}\n',
          },
          services: SERVICES,
          readOnly: ["package.json", "index.js"],
          open: "courses.js",
          solution: {
            "courses.js": `const API = "${DATA_API}";\n\nexport async function getCourse(id) {\n  const response = await fetch(\`\${API}/v1/courses/\${id}\`);\n  if (!response.ok) throw new Error(\`Course \${id} not found (HTTP \${response.status})\`);\n  return response.json();\n}\n`,
          },
          tests: [
            { label: "getCourse(1) returns BE-101, fetched from the API", check: `const { getCourse } = await load("courses.js"); const c = await wait(getCourse(1)); eq(c.code, "BE-101", "course 1"); assert(outgoing().some((r) => r.url === "${DATA_API}/v1/courses/1"), "getCourse should request ${DATA_API}/v1/courses/1");` },
            { label: "A missing course throws 'Course 99 not found (HTTP 404)'", check: `const { getCourse } = await load("courses.js"); let e = null; try { await wait(getCourse(99)); } catch (x) { e = x; } assert(e, "getCourse(99) should throw: the API answered 404, which fetch does not treat as an error"); eq(e.message, "Course 99 not found (HTTP 404)", "the error message");` },
            { label: "index.js prints the course and the error", check: `has(stdout(), "BE-101 Backend Engineering", "index.js should print the course"); has(stdout(), "Error: Course 99 not found (HTTP 404)", "index.js should print the error");` },
          ],
          hint: "const response = await fetch(`${API}/v1/courses/${id}`); if (!response.ok) throw new Error(…); return response.json();",
          successMessage: "fetch resolved for the 404; your check of response.ok turned it into an error your code handles. Forgetting that check is one of the most common integration bugs.",
        },
      },
      {
        id: "a-be-config",
        title: "Environment variables and configuration",
        explain:
          "The same code runs on your laptop, in tests and in production, with different settings: database address, API keys, ports, timeouts. Those come from ENVIRONMENT VARIABLES, read as process.env.NAME, always strings or undefined. Locally you keep them in a .env file and run node --env-file=.env app.js (Node 20.6+), or load it with dotenv; in production the platform sets them. Read configuration ONCE, in one module, convert types (Number(process.env.TIMEOUT_MS)), apply defaults for optional settings, and fail at startup with a clear message when a required one is missing, rather than failing on the first request.",
        nodeLab: {
          task:
            "Write config.js: export a config object built from the environment. apiUrl comes from DATA_API_URL and is required: if it is missing, throw new Error(\"DATA_API_URL is not set\"). timeoutMs comes from TIMEOUT_MS as a number, default 5000; if it is set but not a positive number, throw new Error(\"TIMEOUT_MS must be a positive number\"). env is NODE_ENV, default \"development\". The project runs with node --env-file=.env.",
          command: "node --env-file=.env index.js",
          files: {
            "package.json": pkg({ name: "academy-async", scripts: { start: "node --env-file=.env index.js" } }),
            ".env": `DATA_API_URL=${DATA_API}\nTIMEOUT_MS=2500\n`,
            ".env.minimal": `DATA_API_URL=${DATA_API}\n`,
            ".env.broken": "TIMEOUT_MS=soon\nDATA_API_URL=https://api.example\n",
            ".env.empty": "# nothing set\n",
            "config.js": "export const config = {\n  apiUrl: process.env.DATA_API_URL,\n  timeoutMs: process.env.TIMEOUT_MS,\n  env: process.env.NODE_ENV,\n};\n",
            "index.js": 'import { config } from "./config.js";\n\nconsole.log(config);\nconsole.log(typeof config.timeoutMs);\n',
          },
          readOnly: ["package.json", "index.js", ".env", ".env.minimal", ".env.broken", ".env.empty"],
          open: "config.js",
          solution: {
            "config.js":
              'function required(name) {\n  const value = process.env[name];\n  if (!value) throw new Error(`${name} is not set`);\n  return value;\n}\n\nfunction positiveNumber(name, fallback) {\n  const raw = process.env[name];\n  if (raw === undefined || raw === "") return fallback;\n  const n = Number(raw);\n  if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} must be a positive number`);\n  return n;\n}\n\nexport const config = {\n  apiUrl: required("DATA_API_URL"),\n  timeoutMs: positiveNumber("TIMEOUT_MS", 5000),\n  env: process.env.NODE_ENV ?? "development",\n};\n',
          },
          tests: [
            { label: "With .env: apiUrl, timeoutMs 2500 (a number) and env development", check: `has(stdout(), "apiUrl: '${DATA_API}'", "apiUrl should come from DATA_API_URL"); has(stdout(), "timeoutMs: 2500", "timeoutMs should be the number 2500, not the string '2500'"); has(stdout(), "env: 'development'", "env should default to development"); has(stdout(), "number", "typeof config.timeoutMs should be number");` },
            { label: "Without TIMEOUT_MS, timeoutMs is 5000", check: `await run("node --env-file=.env.minimal index.js"); has(stdout(), "timeoutMs: 5000", "the default timeout should be 5000");` },
            { label: "A missing DATA_API_URL stops the program at startup", check: `await run("node --env-file=.env.empty index.js"); eq(exitCode(), 1, "the program should stop with exit code 1"); has(stderr(), "Error: DATA_API_URL is not set", "the error message");` },
            { label: "TIMEOUT_MS=soon is refused", check: `await run("node --env-file=.env.broken index.js"); eq(exitCode(), 1, "an invalid TIMEOUT_MS should stop the program"); has(stderr(), "TIMEOUT_MS must be a positive number", "the error message");` },
          ],
          hint: "Write two helpers: required(name) throws when process.env[name] is missing; positiveNumber(name, fallback) returns fallback when unset, Number(value) when valid, and throws otherwise.",
          successMessage: "Configuration in one place, typed, defaulted and validated at startup: a misconfigured deployment now fails immediately with a message that says exactly what to fix.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 3.10 · INTRODUCTION TO TYPESCRIPT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l21-typescript",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.10"],
    title: "Introduction to TypeScript",
    subtitle: "Types, interfaces, unions, generics and narrowing",
    estimatedMinutes: 75,
    intro:
      "TypeScript is JavaScript with types. You describe the shape of your data once, and the compiler checks every use of it before the code runs, catching misspelled properties, missing cases and wrong arguments while you type. Node.js 24 runs .ts files directly; the compiler, tsc, is what checks them. These labs run the real compiler on your code.",
    atoms: [
      {
        id: "a-be-ts-types",
        title: "Types and interfaces",
        explain:
          "Annotate values with types: let title: string, function fee(weeks: number): number. Describe object shapes with an INTERFACE (or a type alias): interface Course { id: number; title: string; weeks: number; level?: string } where ? marks an optional property. Arrays are Course[]. TypeScript INFERS most types from values, so you annotate function parameters and data shapes, not every variable. Types exist only for the compiler: Node strips them and runs the JavaScript left over, so types never check data at runtime (Week 7 validates input with zod for that). Run npx tsc --noEmit to type-check without producing files.",
        nodeLab: {
          task:
            "Run npx tsc --noEmit (it is the command below): the compiler finds two bugs in src/courses.ts that JavaScript would only reveal later, or never. Fix the code (not the interface) so tsc reports no errors, and run node src/courses.ts to see the result.",
          command: "npx tsc --noEmit",
          files: {
            "package.json": TS_PKG("academy-ts", "node src/courses.ts"),
            "tsconfig.json": TSCONFIG,
            "src/courses.ts":
              'interface Course {\n  id: number;\n  title: string;\n  weeks: number;\n  level?: string;\n}\n\nconst courses: Course[] = [\n  { id: 1, title: "Backend Engineering", weeks: 24 },\n  { id: 2, title: "Relational Databases", weeks: 16, level: "beginner" },\n];\n\nfunction totalWeeks(list: Course[]): number {\n  return list.reduce((sum, c) => sum + c.week, 0);\n}\n\nfunction describe(course: Course): string {\n  return `${course.title}: ${course.weeks} weeks`;\n}\n\nconsole.log(totalWeeks(courses));\nconsole.log(describe(courses[1].title));\n',
          },
          readOnly: ["package.json", "tsconfig.json"],
          open: "src/courses.ts",
          solution: {
            "src/courses.ts":
              'interface Course {\n  id: number;\n  title: string;\n  weeks: number;\n  level?: string;\n}\n\nconst courses: Course[] = [\n  { id: 1, title: "Backend Engineering", weeks: 24 },\n  { id: 2, title: "Relational Databases", weeks: 16, level: "beginner" },\n];\n\nfunction totalWeeks(list: Course[]): number {\n  return list.reduce((sum, c) => sum + c.weeks, 0);\n}\n\nfunction describe(course: Course): string {\n  return `${course.title}: ${course.weeks} weeks`;\n}\n\nconsole.log(totalWeeks(courses));\nconsole.log(describe(courses[1]));\n',
          },
          tests: [
            NO_TYPE_ERRORS,
            { label: "The interface is unchanged", check: `has(source("src/courses.ts"), "interface Course {\\n  id: number;\\n  title: string;\\n  weeks: number;\\n  level?: string;\\n}", "fix the code that uses Course, not the interface");` },
            { label: "node src/courses.ts prints 40 and the description", check: `await run("node src/courses.ts"); has(stdout(), "40", "totalWeeks should add up to 40"); has(stdout(), "Relational Databases: 16 weeks", "describe should get the whole course");` },
          ],
          hint: "tsc points at both lines: c.week is not a property of Course (Did you mean 'weeks'?), and describe expects a Course, not a string.",
          successMessage: "Run the original with node and it prints NaN and 'undefined: undefined weeks' without complaint. tsc caught both bugs before the code ever ran.",
        },
      },
      {
        id: "a-be-ts-unions",
        title: "Unions and narrowing",
        explain:
          "A UNION type allows one of several types: string | null, or \"draft\" | \"published\" | \"archived\" (literal types). TypeScript makes you handle each possibility: to use a string | null as a string, you must first rule out null, and the compiler follows your checks (if (x !== null), typeof x === \"string\", \"error\" in result, a switch on a shared property). That is NARROWING. A DISCRIMINATED union uses one shared property to tell the cases apart: { ok: true; data: Course } | { ok: false; error: string }. Inside if (result.ok) TypeScript knows data exists.",
        nodeLab: {
          task:
            "In src/result.ts, finish message(result: LookupResult): for { ok: true, course } return \"<code>: <title>\"; for { ok: false, reason: \"not-found\" } return \"No such course\"; for { ok: false, reason: \"network\", retryAfter } return \"Try again in <retryAfter>s\". The types are given: narrow on ok and reason. tsc must report no errors.",
          command: "npx tsc --noEmit",
          files: {
            "package.json": TS_PKG("academy-ts", "node src/result.ts"),
            "tsconfig.json": TSCONFIG,
            "src/result.ts":
              'export interface Course {\n  code: string;\n  title: string;\n}\n\nexport type LookupResult =\n  | { ok: true; course: Course }\n  | { ok: false; reason: "not-found" }\n  | { ok: false; reason: "network"; retryAfter: number };\n\nexport function message(result: LookupResult): string {\n  return result.course.code;\n}\n\nconsole.log(message({ ok: true, course: { code: "BE-101", title: "Backend Engineering" } }));\nconsole.log(message({ ok: false, reason: "not-found" }));\nconsole.log(message({ ok: false, reason: "network", retryAfter: 30 }));\n',
          },
          readOnly: ["package.json", "tsconfig.json"],
          open: "src/result.ts",
          solution: {
            "src/result.ts":
              'export interface Course {\n  code: string;\n  title: string;\n}\n\nexport type LookupResult =\n  | { ok: true; course: Course }\n  | { ok: false; reason: "not-found" }\n  | { ok: false; reason: "network"; retryAfter: number };\n\nexport function message(result: LookupResult): string {\n  if (result.ok) return `${result.course.code}: ${result.course.title}`;\n  if (result.reason === "not-found") return "No such course";\n  return `Try again in ${result.retryAfter}s`;\n}\n\nconsole.log(message({ ok: true, course: { code: "BE-101", title: "Backend Engineering" } }));\nconsole.log(message({ ok: false, reason: "not-found" }));\nconsole.log(message({ ok: false, reason: "network", retryAfter: 30 }));\n',
          },
          tests: [
            NO_TYPE_ERRORS,
            { label: "Each case gives its message", check: `const { message } = await load("src/result.ts"); eq(message({ ok: true, course: { code: "BE-101", title: "Backend Engineering" } }), "BE-101: Backend Engineering", "a found course"); eq(message({ ok: false, reason: "not-found" }), "No such course", "not-found"); eq(message({ ok: false, reason: "network", retryAfter: 30 }), "Try again in 30s", "network");` },
            { label: "No casts or any: the compiler narrows for you", check: `const src = source("src/result.ts"); lacks(src, " as ", "narrow with checks instead of casting with as"); assert(!usesAny(src), "do not use any");` },
          ],
          hint: "if (result.ok) { … result.course is available here … } then if (result.reason === \"not-found\") …; whatever is left must be the network case, with retryAfter.",
          successMessage: "Inside each branch TypeScript knew exactly which shape it had. Add a fourth case to the union and the compiler points at every place that must handle it.",
        },
      },
      {
        id: "a-be-ts-generics",
        title: "Generics",
        explain:
          "A GENERIC function works for any type while keeping track of which one: function first<T>(items: T[]): T | undefined returns a Course when given Course[] and a string when given string[]. Without generics you would lose the type (returning unknown) or write one function per type. Promise<T>, Array<T> and Map<K, V> are generic types you already use. Constraints narrow what T may be: function byId<T extends { id: number }>(items: T[], id: number). The file types.test.ts below holds type tests: each // @ts-expect-error line must be a type error, so a lazy answer using any fails them.",
        nodeLab: {
          task:
            "In src/collections.ts, write two generic functions: first<T>(items: T[]): T | undefined, and byId<T extends { id: number }>(items: T[], id: number): T | undefined. Do not use any. The type tests in src/types.test.ts must pass (npx tsc --noEmit finds no errors) and the functions must work.",
          command: "npx tsc --noEmit",
          files: {
            "package.json": TS_PKG("academy-ts", "node src/types.test.ts"),
            "tsconfig.json": TSCONFIG,
            "src/collections.ts": "export function first(items) {\n  return items[0];\n}\n\nexport function byId(items, id) {\n  return items.find((item) => item.id === id);\n}\n",
            "src/types.test.ts":
              '// Type tests: the compiler checks them. Each @ts-expect-error line MUST be an error.\nimport { first, byId } from "./collections.ts";\n\ninterface Course { id: number; title: string }\nconst courses: Course[] = [{ id: 1, title: "Node.js" }];\n\nconst c = first(courses);\nconst title: string | undefined = c?.title;\n// @ts-expect-error first(courses) is Course | undefined, not a number\nconst wrong: number = first(courses);\n\nconst n = first([1, 2, 3]);\n// @ts-expect-error first([1, 2, 3]) is number | undefined, so it has no .title\nn?.title;\n\nconst found = byId(courses, 1);\nconst foundTitle: string | undefined = found?.title;\n// @ts-expect-error byId only accepts items with a numeric id\nbyId(["a", "b"], 1);\n\nconsole.log(title, foundTitle, wrong, n);\n',
          },
          readOnly: ["package.json", "tsconfig.json", "src/types.test.ts"],
          open: "src/collections.ts",
          solution: {
            "src/collections.ts":
              "export function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nexport function byId<T extends { id: number }>(items: T[], id: number): T | undefined {\n  return items.find((item) => item.id === id);\n}\n",
          },
          tests: [
            NO_TYPE_ERRORS,
            { label: "first and byId work", check: `const { first, byId } = await load("src/collections.ts"); eq(first([3, 4]), 3, "first([3, 4])"); eq(first([]), undefined, "first([])"); eq(byId([{ id: 1 }, { id: 2, t: "x" }], 2), { id: 2, t: "x" }, "byId(…, 2)");` },
            { label: "No any", check: `assert(!usesAny(source("src/collections.ts")), "use type parameters, not any");` },
          ],
          hint: "first<T>(items: T[]): T | undefined. For byId, constrain T: <T extends { id: number }>.",
          successMessage: "Try replacing your types with any and run tsc: the @ts-expect-error lines become 'Unused @ts-expect-error directive' errors. Type tests check that your types are precise, not just present.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 3.11 – 3.13 · EXERCISES: PUBLIC API, REGISTRATION, FAILURES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l22-async-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["3.11", "3.12", "3.13"],
    title: "Exercises: Public APIs, Registration and Failed Requests",
    subtitle: "Asynchronous code that survives the real world",
    estimatedMinutes: 80,
    intro:
      "Three exercises in asynchronous code. Fetch every page of a public API, simulate a registration that waits on a database, and make a client that copes when the other side fails.",
    atoms: [
      {
        id: "a-be-fetch-all-pages",
        title: "Exercise: fetch every page of a public API",
        explain: `APIs rarely return everything at once: they PAGINATE. The Academy Data API answers GET /v1/courses?page=N with { page, totalPages, data }. To collect everything, request page 1, read totalPages, then request the rest (one after another is simplest; Promise.all is faster when the API allows it). Respect the API: request each page once, stop at totalPages. The API is at ${DATA_API}.`,
        terminalExercise: term("w3-fetch", {
          goal: "See what a real public API returns: run the program that fetches its users.",
          accept: ["node fetch-users.js"],
          near: [{ command: "node fetch-missing.js", why: "That asks for a user that does not exist. The goal is the list of users." }],
          hint: "fetch-users.js fetches https://jsonplaceholder.typicode.com/users.",
          success: "Status 200, a JSON content type, and ten real users: the same fetch you use in the lab, against the real internet.",
        }),
      },
      {
        id: "a-be-fetch-pages-lab",
        title: "Collect every page",
        explain: "Now the lab version against the Academy Data API, which pages its five courses two at a time.",
        nodeLab: {
          task: `In catalog.js write getAllCourses(): fetch ${DATA_API}/v1/courses?page=1, then every further page up to totalPages, and return all the courses in one array, in order. Throw an Error if any response is not ok. Then summary(courses) returns { count, totalWeeks, topRated } where topRated is the code of the highest-rated course.`,
          files: {
            "package.json": PKG,
            "catalog.js": `const API = "${DATA_API}";\n\nexport async function getAllCourses() {\n}\n\nexport function summary(courses) {\n}\n`,
            "index.js": 'import { getAllCourses, summary } from "./catalog.js";\n\nconst courses = await getAllCourses();\nconsole.log(courses.map((c) => c.code).join(", "));\nconsole.log(summary(courses));\n',
          },
          services: SERVICES,
          readOnly: ["package.json", "index.js"],
          open: "catalog.js",
          solution: {
            "catalog.js": `const API = "${DATA_API}";\n\nasync function getPage(page) {\n  const response = await fetch(\`\${API}/v1/courses?page=\${page}\`);\n  if (!response.ok) throw new Error(\`Page \${page} failed with HTTP \${response.status}\`);\n  return response.json();\n}\n\nexport async function getAllCourses() {\n  const first = await getPage(1);\n  const courses = [...first.data];\n  for (let page = 2; page <= first.totalPages; page++) {\n    const next = await getPage(page);\n    courses.push(...next.data);\n  }\n  return courses;\n}\n\nexport function summary(courses) {\n  const totalWeeks = courses.reduce((sum, c) => sum + c.weeks, 0);\n  const top = courses.reduce((best, c) => (c.rating > best.rating ? c : best), courses[0]);\n  return { count: courses.length, totalWeeks, topRated: top.code };\n}\n`,
          },
          tests: [
            { label: "getAllCourses returns all five courses, in order", check: `const { getAllCourses } = await load("catalog.js"); const all = await wait(getAllCourses()); eq(all.map((c) => c.code), ["BE-101", "DB-101", "WD-201", "CS-101", "MD-101"], "every course from every page");` },
            { label: "It requests each page exactly once", check: `const { getAllCourses } = await load("catalog.js"); const before = outgoing().length; await wait(getAllCourses()); const pages = outgoing().slice(before).map((r) => new URL(r.url).searchParams.get("page")); eq(pages.sort(), ["1", "2", "3"], "pages 1, 2 and 3, once each");` },
            { label: "summary gives count, totalWeeks and topRated", check: `const { summary } = await load("catalog.js"); eq(summary([{ code: "A", weeks: 4, rating: 4.1 }, { code: "B", weeks: 6, rating: 4.9 }]), { count: 2, totalWeeks: 10, topRated: "B" }, "summary of two courses");` },
            { label: "A failing page throws", check: `service("${DATA_API}").locals.failNext = 1; const { getAllCourses } = await load("catalog.js"); let e = null; try { await wait(getAllCourses()); } catch (x) { e = x; } assert(e, "when the API answers 503, getAllCourses should throw instead of returning partial data");` },
          ],
          hint: "A small getPage(page) helper that fetches, checks response.ok and returns the JSON; then loop from page 2 to first.totalPages.",
          successMessage: "Five courses from three requests. A partial list returned silently when a page failed would be worse than an error: the caller would believe it had everything.",
        },
      },
      {
        id: "a-be-async-registration",
        title: "Exercise: asynchronous user registration",
        explain:
          "Registration waits on slow things: checking the email is free, saving the user, sending a welcome email. Simulate it: db.js below stores users after a short delay, like a database, and rejects a duplicate email. register() must validate first (no network round trip for bad input), then save, then 'send' the email, and report failures as rejected promises with clear messages. Two registrations with the same email at the same moment must not both succeed.",
        nodeLab: {
          task:
            "In register.js, finish register({ email, name }): reject with Error(\"Invalid email\") if email has no @, and Error(\"Name is required\") if name is empty; otherwise await db.saveUser, then await mailer.sendWelcome, and resolve with the saved user. If saveUser rejects (a duplicate), let the error through. Never send a welcome email for a failed registration.",
          files: {
            "package.json": PKG,
            "db.js":
              'const users = new Map();\nlet nextId = 1;\nconst wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nexport async function saveUser({ email, name }) {\n  await wait(200);\n  const key = email.toLowerCase();\n  if (users.has(key)) throw new Error(`${email} is already registered`);\n  const user = { id: nextId++, email: key, name };\n  users.set(key, user);\n  return user;\n}\n',
            "mailer.js": 'export const sent = [];\n\nexport async function sendWelcome(user) {\n  await new Promise((resolve) => setTimeout(resolve, 100));\n  sent.push(user.email);\n}\n',
            "register.js": 'import * as db from "./db.js";\nimport * as mailer from "./mailer.js";\n\nexport async function register({ email, name }) {\n}\n',
            "index.js":
              'import { register } from "./register.js";\n\nfor (const input of [{ email: "ada@example.com", name: "Ada" }, { email: "ADA@example.com", name: "Ada again" }, { email: "nope", name: "X" }]) {\n  try {\n    const user = await register(input);\n    console.log("registered", user);\n  } catch (err) {\n    console.log("failed:", err.message);\n  }\n}\n',
          },
          readOnly: ["package.json", "db.js", "mailer.js", "index.js"],
          open: "register.js",
          solution: {
            "register.js":
              'import * as db from "./db.js";\nimport * as mailer from "./mailer.js";\n\nexport async function register({ email, name }) {\n  if (!email || !email.includes("@")) throw new Error("Invalid email");\n  if (!name || !name.trim()) throw new Error("Name is required");\n  const user = await db.saveUser({ email, name: name.trim() });\n  await mailer.sendWelcome(user);\n  return user;\n}\n',
          },
          tests: [
            { label: "A valid registration resolves with the saved user and sends one welcome email", check: `const { register } = await load("register.js"); const { sent } = await load("mailer.js"); const u = await wait(register({ email: "Bo@Example.com", name: "Bo" })); eq([u.email, u.name], ["bo@example.com", "Bo"], "the saved user"); assert(typeof u.id === "number", "the user should have an id from the database"); eq(sent.filter((e) => e === "bo@example.com").length, 1, "one welcome email");` },
            { label: "Bad input is rejected before touching the database", check: `const { register } = await load("register.js"); for (const [input, msg] of [[{ email: "nope", name: "X" }, "Invalid email"], [{ email: "x@y.z", name: "  " }, "Name is required"]]) { const t0 = now(); let e = null; try { await wait(register(input)); } catch (x) { e = x; } assert(e, "register(" + JSON.stringify(input) + ") should reject"); eq(e.message, msg, "the error"); assert(now() - t0 < 50, "validation should happen before waiting on the database"); }` },
            { label: "A duplicate email rejects, and gets no welcome email", check: `const { register } = await load("register.js"); const { sent } = await load("mailer.js"); await wait(register({ email: "cy@example.com", name: "Cy" })); let e = null; try { await wait(register({ email: "CY@example.com", name: "Cy 2" })); } catch (x) { e = x; } assert(e, "a duplicate email should reject"); has(e.message, "already registered", "the database's message"); eq(sent.filter((x) => x === "cy@example.com").length, 1, "only the first registration gets an email");` },
            { label: "Two registrations at the same moment: exactly one succeeds", check: `const { register } = await load("register.js"); const results = await wait(Promise.allSettled([register({ email: "dee@example.com", name: "Dee" }), register({ email: "dee@example.com", name: "Dee" })])); eq(results.map((r) => r.status).sort(), ["fulfilled", "rejected"], "one fulfilled, one rejected");` },
          ],
          hint: "Validate and throw first (an async function turns a throw into a rejection), then const user = await db.saveUser(…); await mailer.sendWelcome(user); return user.",
          successMessage: "Validation first, then the slow work, and errors flowing back as rejections. The uniqueness rule held because the database (here db.js) is the one place that checks it; Week 12 does the same with a real constraint.",
        },
      },
      {
        id: "a-be-failed-requests",
        title: "Exercise: handle failed network requests",
        explain:
          "Other services fail: they answer 503 for a moment during a deploy, or hang. A robust client sets a TIMEOUT on every request (fetch(url, { signal: AbortSignal.timeout(2000) }) aborts after 2 s), RETRIES only failures that may succeed next time (503, timeouts, connection errors; never 400 or 404), waits a little longer before each retry (BACKOFF: 100 ms, 200 ms, 400 ms), and gives up after a few attempts with a clear error. Week 16 builds this into an API; here it is a function.",
        nodeLab: {
          task: `In client.js, write fetchWithRetry(url, { retries = 3, timeoutMs = 1000 } = {}): try the request with a timeout; on a 5xx response or a network error/timeout, wait 100 ms, then 200 ms, then 400 ms … and try again, up to retries extra attempts; on success return the parsed JSON; on a 4xx, throw at once without retrying; when attempts run out, throw new Error("Gave up after <n> attempts"). The API at ${DATA_API} can be made to fail by the checks.`,
          files: {
            "package.json": PKG,
            "client.js": "export async function fetchWithRetry(url, { retries = 3, timeoutMs = 1000 } = {}) {\n}\n",
            "index.js": `import { fetchWithRetry } from "./client.js";\n\nconst course = await fetchWithRetry("${DATA_API}/v1/courses/2");\nconsole.log(course.title);\n`,
          },
          services: SERVICES,
          readOnly: ["package.json", "index.js"],
          open: "client.js",
          solution: {
            "client.js":
              'const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n\nexport async function fetchWithRetry(url, { retries = 3, timeoutMs = 1000 } = {}) {\n  for (let attempt = 0; attempt <= retries; attempt++) {\n    if (attempt > 0) await sleep(100 * 2 ** (attempt - 1));\n    let response;\n    try {\n      response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });\n    } catch {\n      continue; // network error or timeout: try again\n    }\n    if (response.ok) return response.json();\n    if (response.status < 500) throw new Error(`Request failed with HTTP ${response.status}`);\n  }\n  throw new Error(`Gave up after ${retries + 1} attempts`);\n}\n',
          },
          tests: [
            { label: "Success on the first try returns the JSON", check: `const { fetchWithRetry } = await load("client.js"); const c = await wait(fetchWithRetry("${DATA_API}/v1/courses/2")); eq(c.code, "DB-101", "course 2");` },
            { label: "Two 503s, then success: it retries with backoff (100 ms, then 200 ms)", check: `const api = service("${DATA_API}"); api.locals.failNext = 2; const { fetchWithRetry } = await load("client.js"); const before = outgoing().length; const t0 = now(); const c = await wait(fetchWithRetry("${DATA_API}/v1/courses/3")); eq(c.code, "WD-201", "the course after two failures"); eq(outgoing().length - before, 3, "three attempts"); const took = now() - t0; assert(took >= 300 && took < 400, "the waits should be 100 ms then 200 ms (total " + Math.round(took) + " ms)");` },
            { label: "A 404 is not retried", check: `const { fetchWithRetry } = await load("client.js"); const before = outgoing().length; let e = null; try { await wait(fetchWithRetry("${DATA_API}/v1/courses/42")); } catch (x) { e = x; } assert(e, "a 404 should throw"); eq(outgoing().length - before, 1, "a 404 will not fix itself: do not retry it");` },
            { label: "A hanging API times out and is retried; then it gives up", check: `const api = service("${DATA_API}"); api.locals.delayMs = 5000; const { fetchWithRetry } = await load("client.js"); const before = outgoing().length; let e = null; try { await wait(fetchWithRetry("${DATA_API}/v1/courses/1", { retries: 2, timeoutMs: 1000 })); } catch (x) { e = x; } api.locals.delayMs = 0; assert(e, "it should give up"); eq(e.message, "Gave up after 3 attempts", "the final error"); eq(outgoing().length - before, 3, "three attempts, each cut off by the timeout");` },
          ],
          hint: "Loop attempt = 0 … retries. Before each retry, await a sleep of 100 * 2 ** (attempt - 1). Wrap fetch in try/catch to catch timeouts; return JSON when ok; throw at once for status < 500.",
          successMessage: "Timeouts, retries only when they can help, exponential backoff and a clear final error: the four rules of calling another service. On the lab's clock the waits are exact: 100 ms, then 200 ms.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 3.14 · EXERCISE: CONVERT A PROJECT TO TYPESCRIPT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l23-convert",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["3.14"],
    title: "Exercise: Convert a JavaScript Project to TypeScript",
    subtitle: "Adding types to working code, one error at a time",
    estimatedMinutes: 60,
    intro:
      "Most TypeScript code you meet was JavaScript once. Converting is a skill: rename the files, turn on strict checking, and let the compiler show you every place that needs a type. The errors are a to-do list.",
    atoms: [
      {
        id: "a-be-convert-ts",
        title: "Convert the enrollments module",
        explain:
          "The steps: rename .js files to .ts (and imports to ./file.ts, which Node 24's type stripping needs); add tsconfig.json with \"strict\": true; run npx tsc --noEmit and work through the errors. Most will be 'Parameter implicitly has an any type': give each function's parameters and return value a type, and describe your data with interfaces. Resist any and as: they silence the compiler without fixing anything. The behaviour must not change, which is what tests are for (Week 15).",
        nodeLab: {
          task:
            "src/enrollments.ts was renamed from JavaScript and has no types yet: npx tsc --noEmit reports implicit any errors. Add an Enrollment interface (student: string, course: string, progress: number, paid: boolean) and type every parameter and return value, so tsc reports no errors, without any, as or ts-ignore. The behaviour must stay the same.",
          command: "npx tsc --noEmit",
          files: {
            "package.json": TS_PKG("academy-ts", "node src/main.ts"),
            "tsconfig.json": TSCONFIG,
            "src/enrollments.ts":
              "export function unpaid(enrollments) {\n  return enrollments.filter((e) => !e.paid);\n}\n\nexport function averageProgress(enrollments, course) {\n  const onCourse = enrollments.filter((e) => e.course === course);\n  if (onCourse.length === 0) return null;\n  return Math.round(onCourse.reduce((sum, e) => sum + e.progress, 0) / onCourse.length);\n}\n\nexport function byStudent(enrollments) {\n  const map = new Map();\n  for (const e of enrollments) {\n    const list = map.get(e.student) ?? [];\n    list.push(e.course);\n    map.set(e.student, list);\n  }\n  return map;\n}\n",
            "src/main.ts":
              'import { unpaid, averageProgress, byStudent } from "./enrollments.ts";\n\nconst enrollments = [\n  { student: "Ada", course: "BE-101", progress: 40, paid: true },\n  { student: "Ada", course: "DB-101", progress: 90, paid: false },\n  { student: "Bayo", course: "BE-101", progress: 70, paid: true },\n];\nconsole.log(unpaid(enrollments).length, averageProgress(enrollments, "BE-101"), averageProgress(enrollments, "XX-000"));\nconsole.log(byStudent(enrollments));\n',
          },
          readOnly: ["package.json", "tsconfig.json", "src/main.ts"],
          open: "src/enrollments.ts",
          solution: {
            "src/enrollments.ts":
              "export interface Enrollment {\n  student: string;\n  course: string;\n  progress: number;\n  paid: boolean;\n}\n\nexport function unpaid(enrollments: Enrollment[]): Enrollment[] {\n  return enrollments.filter((e) => !e.paid);\n}\n\nexport function averageProgress(enrollments: Enrollment[], course: string): number | null {\n  const onCourse = enrollments.filter((e) => e.course === course);\n  if (onCourse.length === 0) return null;\n  return Math.round(onCourse.reduce((sum, e) => sum + e.progress, 0) / onCourse.length);\n}\n\nexport function byStudent(enrollments: Enrollment[]): Map<string, string[]> {\n  const map = new Map<string, string[]>();\n  for (const e of enrollments) {\n    const list = map.get(e.student) ?? [];\n    list.push(e.course);\n    map.set(e.student, list);\n  }\n  return map;\n}\n",
          },
          tests: [
            NO_TYPE_ERRORS,
            { label: "An Enrollment interface describes the data", check: `const src = source("src/enrollments.ts"); assert(/interface\\s+Enrollment\\s*\\{/.test(src), "declare interface Enrollment"); for (const f of ["student: string", "course: string", "progress: number", "paid: boolean"]) has(src, f, "Enrollment should have " + f);` },
            { label: "No any, as or ts-ignore", check: `const src = source("src/enrollments.ts"); assert(!usesAny(src), "do not use any"); for (const bad of [" as ", "@ts-ignore", "@ts-nocheck"]) lacks(src, bad, "do not use " + bad.trim());` },
            { label: "The behaviour is unchanged", check: `await run("node src/main.ts"); has(stdout(), "1 55 null", "unpaid, averageProgress and the empty case"); has(stdout(), "Map(2) { 'Ada' => [ 'BE-101', 'DB-101' ], 'Bayo' => [ 'BE-101' ] }", "byStudent");` },
          ],
          hint: "Declare interface Enrollment, then: unpaid(enrollments: Enrollment[]): Enrollment[]; averageProgress(…, course: string): number | null; byStudent(…): Map<string, string[]> with new Map<string, string[]>().",
          successMessage: "Every function now says what it takes and gives. averageProgress's number | null forces every caller to handle the empty course, which JavaScript let them forget.",
        },
      },
      {
        id: "a-be-ts-tradeoffs",
        title: "What TypeScript does and does not do",
        explain:
          "TypeScript checks your code against the types you declared, before it runs. It does not check data from outside: a request body, a database row, an API response are whatever arrives, and a type annotation on them is a promise you make, not a check. Types are erased, so const course: Course = await response.json() compiles even if the API sends something else. That is why backends VALIDATE external data at runtime (zod, Week 7) and can then derive the type from the validator. Use TypeScript for the shape of your code, validation for the shape of your inputs.",
        decision: decide({
          scenario: "A teammate writes: const user: User = JSON.parse(req.body); and says the User type guarantees the request has a valid email.",
          question: "Is the request validated?",
          right: ["No: the type is only a claim; the body can be anything at runtime. Validate it (with zod) before trusting it", "Types are erased; validation runs."],
          wrong: [
            ["Yes, TypeScript checks it when the request arrives", "TypeScript is gone by the time code runs."],
            ["Yes, if strict mode is on", "Strict mode is compile-time only."],
            ["Only in development", "Never at runtime."],
          ],
          at: 1,
          aftermath: "Week 7 validates every request with zod and derives the TypeScript type from the same schema, so the two can never disagree.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 3.P · DELIVERABLE: A TYPED ASYNCHRONOUS APPLICATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l24-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["3.P"],
    title: "Deliverable: A Typed Asynchronous Application",
    subtitle: "Fetch, survive failures, process and report, in TypeScript",
    estimatedMinutes: 90,
    intro:
      "This week's deliverable brings everything together in TypeScript: configuration from the environment, an asynchronous client that pages through an API and survives its failures, typed processing, and a clean report.",
    atoms: [
      {
        id: "a-be-w3-deliverable",
        title: "The course report",
        explain: `The application reads DATA_API_URL from the environment, fetches every course from the Academy Data API (paged, with retries on 503 and a timeout), groups them by level, and prints a report: one line per level with the number of courses and average rating, then the total. If the API cannot be reached after the retries, it prints one error line to stderr and exits with code 1. It is written in TypeScript, checked by tsc, and run with node src/report.ts.`,
        nodeLab: {
          task:
            "Finish the three modules in src/. config.ts exports apiUrl from DATA_API_URL (throw if missing). api.ts exports fetchAllCourses(apiUrl): Promise<Course[]>, paging through /v1/courses with up to 3 retries on 5xx (backoff 100/200/400 ms). report.ts prints, for each level in alphabetical order, \"<level>: <n> courses, average rating <x.x>\", then \"Total: <n> courses\"; on failure, \"Error: <message>\" on stderr and exit code 1. tsc must report no errors and no any.",
          command: "node --env-file=.env src/report.ts",
          files: {
            "package.json": TS_PKG("course-report", "node --env-file=.env src/report.ts"),
            "tsconfig.json": TSCONFIG,
            ".env": `DATA_API_URL=${DATA_API}\n`,
            "src/types.ts": 'export interface Course {\n  id: number;\n  code: string;\n  title: string;\n  weeks: number;\n  level: "beginner" | "intermediate" | "advanced";\n  rating: number;\n}\n\nexport interface CoursePage {\n  page: number;\n  totalPages: number;\n  data: Course[];\n}\n',
            "src/config.ts": "export const apiUrl = \"\";\n",
            "src/api.ts": 'import type { Course } from "./types.ts";\n\nexport async function fetchAllCourses(apiUrl: string): Promise<Course[]> {\n  return [];\n}\n',
            "src/report.ts": 'import { apiUrl } from "./config.ts";\nimport { fetchAllCourses } from "./api.ts";\n\nconst courses = await fetchAllCourses(apiUrl);\nconsole.log(courses);\n',
          },
          services: SERVICES,
          readOnly: ["package.json", "tsconfig.json", ".env", "src/types.ts"],
          open: "src/api.ts",
          solution: {
            "src/config.ts": 'const value = process.env.DATA_API_URL;\nif (!value) throw new Error("DATA_API_URL is not set");\n\nexport const apiUrl: string = value;\n',
            "src/api.ts":
              'import type { Course, CoursePage } from "./types.ts";\n\nconst sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));\n\nasync function getJson<T>(url: string, retries = 3): Promise<T> {\n  for (let attempt = 0; attempt <= retries; attempt++) {\n    if (attempt > 0) await sleep(100 * 2 ** (attempt - 1));\n    let response: Response;\n    try {\n      response = await fetch(url, { signal: AbortSignal.timeout(2000) });\n    } catch {\n      continue;\n    }\n    if (response.ok) return (await response.json()) as T;\n    if (response.status < 500) throw new Error(`${url} answered HTTP ${response.status}`);\n  }\n  throw new Error(`Could not reach ${url} after ${retries + 1} attempts`);\n}\n\nexport async function fetchAllCourses(apiUrl: string): Promise<Course[]> {\n  const first = await getJson<CoursePage>(`${apiUrl}/v1/courses?page=1`);\n  const courses = [...first.data];\n  for (let page = 2; page <= first.totalPages; page++) {\n    const next = await getJson<CoursePage>(`${apiUrl}/v1/courses?page=${page}`);\n    courses.push(...next.data);\n  }\n  return courses;\n}\n',
            "src/report.ts":
              'import { apiUrl } from "./config.ts";\nimport { fetchAllCourses } from "./api.ts";\nimport type { Course } from "./types.ts";\n\nfunction byLevel(courses: Course[]): Map<string, Course[]> {\n  const groups = new Map<string, Course[]>();\n  for (const c of courses) groups.set(c.level, [...(groups.get(c.level) ?? []), c]);\n  return groups;\n}\n\ntry {\n  const courses = await fetchAllCourses(apiUrl);\n  const groups = byLevel(courses);\n  for (const level of [...groups.keys()].sort()) {\n    const list = groups.get(level) ?? [];\n    const avg = list.reduce((sum, c) => sum + c.rating, 0) / list.length;\n    console.log(`${level}: ${list.length} courses, average rating ${avg.toFixed(1)}`);\n  }\n  console.log(`Total: ${courses.length} courses`);\n} catch (err) {\n  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);\n  process.exit(1);\n}\n',
          },
          tests: [
            NO_TYPE_ERRORS,
            { label: "It prints the report by level, then the total", check: `const out = stdout(); has(out, "beginner: 4 courses, average rating 4.7", "the beginner line"); has(out, "intermediate: 1 courses, average rating 4.6", "the intermediate line"); has(out, "Total: 5 courses", "the total"); assert(out.indexOf("beginner:") < out.indexOf("intermediate:"), "levels in alphabetical order"); eq(exitCode(), 0, "exit code 0");` },
            { label: "It survives two 503s", check: `service("${DATA_API}").locals.failNext = 2; await run("node --env-file=.env src/report.ts"); has(stdout(), "Total: 5 courses", "the report should still complete after two failures"); eq(exitCode(), 0, "exit code 0");` },
            { label: "When the API stays down: one Error line on stderr, exit code 1", check: `service("${DATA_API}").locals.failNext = 50; await run("node --env-file=.env src/report.ts"); eq(exitCode(), 1, "exit code 1"); assert(/^Error: /m.test(stderr()), "print a line starting with Error: to stderr"); lacks(stderr(), "    at ", "no stack trace: catch the error and print one line"); service("${DATA_API}").locals.failNext = 0;` },
            { label: "No any", check: `for (const f of ["src/config.ts", "src/api.ts", "src/report.ts"]) assert(!usesAny(source(f)), f + " uses any");` },
          ],
          hint: "Reuse your retry loop from Lesson 22 as a generic getJson<T>(url) in api.ts. In report.ts, group with a Map<string, Course[]>, sort the keys, and wrap everything in try/catch.",
          successMessage: "A typed, configured, resilient program: the shape of every integration you will write. Week 8 puts the same pieces behind an API of your own.",
        },
      },
    ],
    task: {
      title: "Week 3 deliverable: a typed asynchronous application",
      intro: "Build it here until every check passes, then make it real.",
      prompts: [
        "On your computer, create the project with the lab's files, run npm install --save-dev typescript @types/node, then npx tsc --noEmit and node --env-file=.env src/report.ts.",
        "Point it at a real public API instead: for example https://jsonplaceholder.typicode.com (users and their posts). Write the interfaces for its data, and report something useful (posts per user, the most active user).",
        "Make the retries visible: log each retry with its attempt number and wait, to stderr.",
        "Add a README.md: what it does, how to configure it, and what happens when the API is down.",
        "Checkpoint: your TypeScript program fetches remote data, survives failed requests and produces a correct typed result, with tsc reporting no errors.",
      ],
      closing: "Next: Week 4, the developer's tools: the terminal, npm, Git and GitHub.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
