/**
 * BACKEND ENGINEERING · WEEK 7 · EXPRESS.JS AND MIDDLEWARE
 *
 * Curriculum 7.1 – 7.P. Application setup; routing; middleware order;
 * request and response objects; application- and router-level middleware;
 * centralized error handling; validation with zod; logging and request
 * ids; 404s; routes, controllers and services; four exercises that turn
 * the Week 6 catalogue into a modular API; and a deliverable that adds a
 * resource to it.
 *
 * The teaching labs are small single-file servers; the exercises (Lesson
 * 52) grow one project, stage by stage, into the layout the rest of the
 * course uses:
 *
 *   src/app.js  src/server.js  src/errors.js  src/data.js
 *   src/middleware/{requestId,logger,validate,notFound,errorHandler}.js
 *   src/schemas/  src/routes/  src/controllers/  src/services/
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";
import { COURSES_DATA } from "./be-w6-http-rest.js";

export const SECTION_ID = "be-s7-express";
const MODULE = "be-w7-express";

const PKG = pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] });
const PKG_ZOD = pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express", "zod"] });
const PKG_SRC = pkg({ name: "course-api", scripts: { start: "node src/server.js" }, deps: ["express", "zod"] });

const LISTEN = `app.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`;

/* ── Shared pieces of the modular project ─────────────────────────────── */

const ERRORS = `export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
`;

const SRC_SERVER = `import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(\`Course API on http://localhost:\${port}\`));
`;

const REQUEST_ID = `import { randomUUID } from "node:crypto";

// Reuse the caller's id (a gateway or another service may have set one), if it looks safe to log.
export function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && /^[\\w-]{1,64}$/.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.id);
  next();
}
`;

const JSON_LOGGER = `export function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      JSON.stringify({
        level: "info",
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      })
    );
  });
  next();
}
`;

const COURSE_SCHEMA = `import { z } from "zod";

export const createCourseSchema = z.object({
  code: z.string().regex(/^[A-Z]{2,3}-\\d{3}$/, "must look like BE-101"),
  title: z.string().trim().min(3, "must be 3 to 100 characters").max(100, "must be 3 to 100 characters"),
  weeks: z.int("must be a whole number").min(1, "must be from 1 to 52").max(52, "must be from 1 to 52"),
  level: z.enum(["beginner", "intermediate", "advanced"], "must be beginner, intermediate or advanced"),
  price: z.int("must be a whole number").min(0, "cannot be negative"),
});

// The code identifies a course: it cannot change.
export const updateCourseSchema = createCourseSchema.omit({ code: true }).partial();
`;

const VALIDATE_DIRECT = `export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
    return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid request body", details } });
  }
  req.body = result.data;
  next();
};
`;

const VALIDATE = `import { AppError } from "../errors.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
    return next(new AppError(400, "VALIDATION_FAILED", "Invalid request body", details));
  }
  req.body = result.data;
  next();
};
`;

const NOT_FOUND_MW = `import { AppError } from "../errors.js";

export function notFound(req, res, next) {
  next(new AppError(404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));
}
`;

const ERROR_HANDLER = `import { AppError } from "../errors.js";

// Four parameters: that is how Express knows this is the error handler.
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    const { status, code, message, details } = err;
    return res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { code: "INVALID_JSON", message: "The request body is not valid JSON" } });
  }
  console.error(JSON.stringify({ level: "error", requestId: req.id, message: err.message, stack: err.stack }));
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
}
`;

/* Stage A: the Week 6 catalogue as one file (the starting point of 7.11). */
const MONOLITH = `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

const LEVELS = ["beginner", "intermediate", "advanced"];
const apiError = (res, status, code, message, details) =>
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });

function validateCourse(input, partial = false) {
  const details = [];
  const check = (field, ok, message) => {
    if (input?.[field] === undefined) {
      if (!partial) details.push({ field, message: "is required" });
    } else if (!ok(input[field])) details.push({ field, message });
  };
  if (!partial) check("code", (v) => /^[A-Z]{2,3}-\\d{3}$/.test(v), "must look like BE-101");
  check("title", (v) => typeof v === "string" && v.trim().length >= 3 && v.trim().length <= 100, "must be 3 to 100 characters");
  check("weeks", (v) => Number.isInteger(v) && v >= 1 && v <= 52, "must be from 1 to 52");
  check("level", (v) => LEVELS.includes(v), "must be beginner, intermediate or advanced");
  check("price", (v) => Number.isInteger(v) && v >= 0, "cannot be negative");
  return details;
}

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/courses", (req, res) => {
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data, meta: { total: data.length } });
});

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json(course);
});

app.post("/courses", (req, res) => {
  const details = validateCourse(req.body);
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid request body", details);
  const { code, title, weeks, level, price } = req.body;
  if (courses.some((c) => c.code === code)) return apiError(res, 409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title: title.trim(), weeks, level, price };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

app.patch("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  const details = validateCourse(req.body, true);
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid request body", details);
  for (const field of ["title", "weeks", "level", "price"]) if (req.body?.[field] !== undefined) course[field] = req.body[field];
  res.json(course);
});

app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  courses.splice(index, 1);
  res.status(204).end();
});

app.use((req, res) => apiError(res, 404, "ROUTE_NOT_FOUND", \`No route for \${req.method} \${req.path}\`));

app.listen(3000, () => console.log("Course API on http://localhost:3000"));
`;

/* Stage B: the same routes in a router, with their hand-written validation. */
const ROUTES_HANDWRITTEN = `import { Router } from "express";
import { courses } from "../data.js";

const LEVELS = ["beginner", "intermediate", "advanced"];
const apiError = (res, status, code, message, details) =>
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });

function validateCourse(input, partial = false) {
  const details = [];
  const check = (field, ok, message) => {
    if (input?.[field] === undefined) {
      if (!partial) details.push({ field, message: "is required" });
    } else if (!ok(input[field])) details.push({ field, message });
  };
  if (!partial) check("code", (v) => /^[A-Z]{2,3}-\\d{3}$/.test(v), "must look like BE-101");
  check("title", (v) => typeof v === "string" && v.trim().length >= 3 && v.trim().length <= 100, "must be 3 to 100 characters");
  check("weeks", (v) => Number.isInteger(v) && v >= 1 && v <= 52, "must be from 1 to 52");
  check("level", (v) => LEVELS.includes(v), "must be beginner, intermediate or advanced");
  check("price", (v) => Number.isInteger(v) && v >= 0, "cannot be negative");
  return details;
}

export const coursesRouter = Router();

coursesRouter.get("/", (req, res) => {
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data, meta: { total: data.length } });
});

coursesRouter.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json(course);
});

coursesRouter.post("/", (req, res) => {
  const details = validateCourse(req.body);
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid request body", details);
  const { code, title, weeks, level, price } = req.body;
  if (courses.some((c) => c.code === code)) return apiError(res, 409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title: title.trim(), weeks, level, price };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

coursesRouter.patch("/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  const details = validateCourse(req.body, true);
  if (details.length) return apiError(res, 400, "VALIDATION_FAILED", "Invalid request body", details);
  for (const field of ["title", "weeks", "level", "price"]) if (req.body?.[field] !== undefined) course[field] = req.body[field];
  res.json(course);
});

coursesRouter.delete("/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  courses.splice(index, 1);
  res.status(204).end();
});
`;

const APP_B = `import express from "express";
import { coursesRouter } from "./routes/courses.routes.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/courses", coursesRouter);

app.use((req, res) =>
  res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } })
);

export default app;
`;

/* Stage C: B with a request id and JSON request logs. */
const APP_C = `import express from "express";
import { requestId } from "./middleware/requestId.js";
import { logger } from "./middleware/logger.js";
import { coursesRouter } from "./routes/courses.routes.js";

const app = express();
app.use(requestId);
app.use(logger);
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/courses", coursesRouter);

app.use((req, res) =>
  res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } })
);

export default app;
`;

/* Stage D: the router validates with zod schemas. */
const ROUTES_ZOD = `import { Router } from "express";
import { courses } from "../data.js";
import { validate } from "../middleware/validate.js";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema.js";

const apiError = (res, status, code, message) => res.status(status).json({ error: { code, message } });

export const coursesRouter = Router();

coursesRouter.get("/", (req, res) => {
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data, meta: { total: data.length } });
});

coursesRouter.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json(course);
});

coursesRouter.post("/", validate(createCourseSchema), (req, res) => {
  if (courses.some((c) => c.code === req.body.code)) {
    return apiError(res, 409, "DUPLICATE_CODE", \`A course with code \${req.body.code} already exists\`);
  }
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

coursesRouter.patch("/:id", validate(updateCourseSchema), (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  Object.assign(course, req.body);
  res.json(course);
});

coursesRouter.delete("/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return apiError(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  courses.splice(index, 1);
  res.status(204).end();
});
`;

/* Stage D, as 7.14 receives it: the error responses drifted apart. */
const ROUTES_DRIFTED = `import { Router } from "express";
import { courses } from "../data.js";
import { validate } from "../middleware/validate.js";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema.js";

export const coursesRouter = Router();

// Pretend this asks the reporting service, which is down today.
async function enrollmentReport(course) {
  await new Promise((resolve) => setTimeout(resolve, 20));
  throw new Error(\`report service unreachable at 10.0.4.12:7000 (course \${course.code})\`);
}

coursesRouter.get("/", (req, res) => {
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data, meta: { total: data.length } });
});

coursesRouter.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.json(course);
});

coursesRouter.get("/:id/report", async (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ message: "no such course" });
  res.json(await enrollmentReport(course));
});

coursesRouter.post("/", validate(createCourseSchema), (req, res) => {
  if (courses.some((c) => c.code === req.body.code)) {
    return res.status(409).json({ ok: false, reason: "duplicate" });
  }
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

coursesRouter.patch("/:id", validate(updateCourseSchema), (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.sendStatus(404);
  Object.assign(course, req.body);
  res.json(course);
});

coursesRouter.delete("/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "not found" });
  courses.splice(index, 1);
  res.status(204).end();
});
`;

const ROUTES_APPERROR = `import { Router } from "express";
import { courses } from "../data.js";
import { AppError } from "../errors.js";
import { validate } from "../middleware/validate.js";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema.js";

export const coursesRouter = Router();

// Pretend this asks the reporting service, which is down today.
async function enrollmentReport(course) {
  await new Promise((resolve) => setTimeout(resolve, 20));
  throw new Error(\`report service unreachable at 10.0.4.12:7000 (course \${course.code})\`);
}

function findCourse(id) {
  const course = courses.find((c) => c.id === Number(id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
  return course;
}

coursesRouter.get("/", (req, res) => {
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data, meta: { total: data.length } });
});

coursesRouter.get("/:id", (req, res) => {
  res.json(findCourse(req.params.id));
});

coursesRouter.get("/:id/report", async (req, res) => {
  res.json(await enrollmentReport(findCourse(req.params.id)));
});

coursesRouter.post("/", validate(createCourseSchema), (req, res) => {
  if (courses.some((c) => c.code === req.body.code)) {
    throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${req.body.code} already exists\`);
  }
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

coursesRouter.patch("/:id", validate(updateCourseSchema), (req, res) => {
  res.json(Object.assign(findCourse(req.params.id), req.body));
});

coursesRouter.delete("/:id", (req, res) => {
  const course = findCourse(req.params.id);
  courses.splice(courses.indexOf(course), 1);
  res.status(204).end();
});
`;

const APP_E = `import express from "express";
import { requestId } from "./middleware/requestId.js";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { coursesRouter } from "./routes/courses.routes.js";

const app = express();
app.use(requestId);
app.use(logger);
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/courses", coursesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
`;

/* The layered project (7.10's structure on the exercises' result): the deliverable's start. */
const LAYERED_DATA = `${COURSES_DATA}
export const instructors = [
  { id: 1, name: "Ngozi Eze", email: "ngozi@academy.example", courseIds: [1, 2] },
  { id: 2, name: "Tunde Bakare", email: "tunde@academy.example", courseIds: [3] },
];
`;

const COURSES_SERVICE = `import { courses } from "../data.js";
import { AppError } from "../errors.js";

export function listCourses({ level } = {}) {
  return level ? courses.filter((c) => c.level === level) : courses;
}

export function getCourse(id) {
  const course = courses.find((c) => c.id === Number(id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
  return course;
}

export function createCourse(input) {
  if (courses.some((c) => c.code === input.code)) {
    throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${input.code} already exists\`);
  }
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, ...input };
  courses.push(course);
  return course;
}

export function updateCourse(id, changes) {
  return Object.assign(getCourse(id), changes);
}

export function deleteCourse(id) {
  const course = getCourse(id);
  courses.splice(courses.indexOf(course), 1);
}
`;

const COURSES_CONTROLLER = `import * as service from "../services/courses.service.js";

export function list(req, res) {
  const data = service.listCourses({ level: req.query.level });
  res.json({ data, meta: { total: data.length } });
}

export function show(req, res) {
  res.json(service.getCourse(req.params.id));
}

export function create(req, res) {
  const course = service.createCourse(req.body);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
}

export function update(req, res) {
  res.json(service.updateCourse(req.params.id, req.body));
}

export function remove(req, res) {
  service.deleteCourse(req.params.id);
  res.status(204).end();
}
`;

const COURSES_ROUTES_LAYERED = `import { Router } from "express";
import * as controller from "../controllers/courses.controller.js";
import { validate } from "../middleware/validate.js";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema.js";

export const coursesRouter = Router();

coursesRouter.get("/", controller.list);
coursesRouter.get("/:id", controller.show);
coursesRouter.post("/", validate(createCourseSchema), controller.create);
coursesRouter.patch("/:id", validate(updateCourseSchema), controller.update);
coursesRouter.delete("/:id", controller.remove);
`;

const LAYERED = {
  "package.json": PKG_SRC,
  "src/data.js": LAYERED_DATA,
  "src/server.js": SRC_SERVER,
  "src/app.js": APP_E,
  "src/errors.js": ERRORS,
  "src/middleware/requestId.js": REQUEST_ID,
  "src/middleware/logger.js": JSON_LOGGER,
  "src/middleware/validate.js": VALIDATE,
  "src/middleware/notFound.js": NOT_FOUND_MW,
  "src/middleware/errorHandler.js": ERROR_HANDLER,
  "src/schemas/course.schema.js": COURSE_SCHEMA,
  "src/services/courses.service.js": COURSES_SERVICE,
  "src/controllers/courses.controller.js": COURSES_CONTROLLER,
  "src/routes/courses.routes.js": COURSES_ROUTES_LAYERED,
};

/** Checks shared by the exercises: the catalogue behaves as in Week 6. */
const CATALOGUE_BEHAVES = [
  { label: "GET /health, GET /courses and GET /courses/:id work", check: `eq((await get("/health")).json, { status: "ok" }, "GET /health"); eq((await get("/courses?level=beginner")).json.meta.total, 4, "GET /courses?level=beginner"); eq((await get("/courses/3")).json.code, "WD-201", "GET /courses/3"); eq((await get("/courses/99")).json.error.code, "COURSE_NOT_FOUND", "GET /courses/99");` },
  { label: "POST, PATCH and DELETE work", check: `const c = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }); eq([c.status, c.headers.location], [201, "/courses/7"], "POST"); eq((await post("/courses", {})).json.error.code, "VALIDATION_FAILED", "an invalid POST"); eq((await patch("/courses/7", { weeks: 10 })).json.weeks, 10, "PATCH"); eq((await del("/courses/7")).status, 204, "DELETE");` },
];

/** A JSON log line from the output, for the request with this id and status. */
const LOG_LINES = `const logs = output().split("\\n").filter((l) => l.startsWith("{")).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 7.1 – 7.2 · EXPRESS APPLICATIONS AND ROUTING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l46-express-routing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2"],
    title: "Express Applications and Routing",
    subtitle: "What express() gives you, and how it picks a handler",
    estimatedMinutes: 55,
    intro:
      "Week 6 used Express without looking inside. This week opens it up. Express is a thin layer over Node's http module: an app is a function (req, res) that Node's server calls for every request, and inside it a list of handlers and middleware that Express walks through in order.",
    atoms: [
      {
        id: "a-be-express-setup",
        title: "Setting up an Express application",
        explain:
          "express() creates the app; app.use(express.json()) adds body parsing; app.get/post/… register routes; app.listen(port) starts Node's http server with the app as its handler. Real projects SEPARATE the app from the server: src/app.js builds and exports the app (no listen), src/server.js imports it and listens on process.env.PORT. The tests of Week 15 import app.js directly without opening a port, and the deployment of Week 19 sets PORT. npm start runs node src/server.js.",
        nodeLab: {
          task:
            "src/server.js does everything. Move the application into src/app.js (create the app, add express.json(), the GET /courses route and a new GET /health route answering { \"status\": \"ok\" }) and export it as the default export. src/server.js then only imports the app and listens on process.env.PORT, or 3000 when PORT is not set.",
          files: {
            "package.json": PKG_SRC,
            "src/data.js": COURSES_DATA,
            "src/server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json(courses));

${LISTEN}`,
            "src/app.js": "",
          },
          readOnly: ["package.json", "src/data.js"],
          open: "src/server.js",
          solution: {
            "src/app.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/courses", (req, res) => res.json(courses));

export default app;
`,
            "src/server.js": SRC_SERVER,
          },
          requests: [
            { label: "GET /health", method: "GET", path: "/health" },
            { label: "GET /courses", method: "GET", path: "/courses" },
          ],
          tests: [
            { label: "GET /health → { status: \"ok\" }, GET /courses still works", check: `eq((await get("/health")).json, { status: "ok" }, "GET /health"); eq((await get("/courses")).json.length, 6, "GET /courses");` },
            { label: "src/app.js exports the app as its default export, without listening", check: `const mod = await load("src/app.js"); assert(typeof mod.default === "function" && typeof mod.default.use === "function", "src/app.js should end with export default app"); lacks(file("src/app.js"), ".listen(", "src/app.js should not call listen: src/server.js does");` },
            { label: "src/server.js only starts the server", check: `const s = file("src/server.js"); assert(!/\\.(get|post|put|patch|delete|use)\\(/.test(s), "src/server.js should not define routes or middleware"); has(s, "./app.js", "src/server.js should import the app from ./app.js");` },
            { label: "The port comes from PORT", check: `await run("PORT=4000 npm start"); eq((await get("/health", { port: 4000 })).status, 200, "with PORT=4000 the API should answer on port 4000");` },
          ],
          hint: "Move everything except app.listen into src/app.js and add export default app; in src/server.js: import app from \"./app.js\", const port = Number(process.env.PORT ?? 3000), app.listen(port, …).",
          successMessage: "An app you can import without starting a server, and a server that runs wherever PORT says. Every project from here on has this shape.",
        },
      },
      {
        id: "a-be-routing",
        title: "Routing and route handlers",
        explain:
          "A route is a method, a path pattern and one or more handlers. Express tries routes IN THE ORDER THEY WERE REGISTERED and uses the first that matches, so /courses/featured must come before /courses/:id, or \"featured\" is taken as an id. app.route(\"/courses\").get(…).post(…) groups the methods of one path; .all(…) at the end catches every other method, which is how an API answers 405 Method Not Allowed with an Allow header listing what is allowed. Route parameters can be several (/courses/:id/lessons/:number). Express answers HEAD with the GET handler automatically.",
        nodeLab: {
          task:
            "Fix and complete the routing. GET /courses/featured (the 24-week courses) is answered by the /:id route: make it work. Then use app.route() for /courses (GET, POST) and /courses/:id (GET, DELETE), each ending with .all() that answers 405 with an Allow header (\"GET, POST\" and \"GET, DELETE\") and { error: { code: \"METHOD_NOT_ALLOWED\", message: \"PUT is not allowed on /courses\" } } (the method and path of the request).",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json(courses));

app.post("/courses", (req, res) => {
  const { code, title, weeks, level, price } = req.body ?? {};
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title, weeks, level, price };
  courses.push(course);
  res.status(201).json(course);
});

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  res.json(course);
});

app.get("/courses/featured", (req, res) => res.json(courses.filter((c) => c.weeks === 24)));

app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  courses.splice(index, 1);
  res.status(204).end();
});

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

const notAllowed = (allow) => (req, res) =>
  res
    .status(405)
    .set("Allow", allow)
    .json({ error: { code: "METHOD_NOT_ALLOWED", message: \`\${req.method} is not allowed on \${req.path}\` } });

// Before /courses/:id, or "featured" would be taken as an id.
app.get("/courses/featured", (req, res) => res.json(courses.filter((c) => c.weeks === 24)));

app
  .route("/courses")
  .get((req, res) => res.json(courses))
  .post((req, res) => {
    const { code, title, weeks, level, price } = req.body ?? {};
    const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title, weeks, level, price };
    courses.push(course);
    res.status(201).json(course);
  })
  .all(notAllowed("GET, POST"));

app
  .route("/courses/:id")
  .get((req, res) => {
    const course = courses.find((c) => c.id === Number(req.params.id));
    if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
    res.json(course);
  })
  .delete((req, res) => {
    const index = courses.findIndex((c) => c.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
    courses.splice(index, 1);
    res.status(204).end();
  })
  .all(notAllowed("GET, DELETE"));

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses/featured", method: "GET", path: "/courses/featured" },
            { label: "PUT /courses", method: "PUT", path: "/courses", body: {} },
            { label: "PATCH /courses/2", method: "PATCH", path: "/courses/2", body: {} },
            { label: "HEAD /courses", method: "HEAD", path: "/courses" },
          ],
          tests: [
            { label: "GET /courses/featured lists the 24-week courses", check: `const r = await get("/courses/featured"); eq(r.status, 200, "status"); eq(r.json.map((c) => c.code), ["BE-101", "MD-101"], "the featured courses");` },
            { label: "PUT /courses → 405 with Allow: GET, POST", check: `const r = await put("/courses", {}); eq(r.status, 405, "status"); eq(r.headers.allow, "GET, POST", "the Allow header"); eq(r.json, { error: { code: "METHOD_NOT_ALLOWED", message: "PUT is not allowed on /courses" } }, "body");` },
            { label: "PATCH /courses/2 → 405 with Allow: GET, DELETE", check: `const r = await patch("/courses/2", {}); eq(r.status, 405, "status"); eq(r.headers.allow, "GET, DELETE", "the Allow header"); eq(r.json.error.message, "PATCH is not allowed on /courses/2", "message");` },
            { label: "The allowed methods still work, and HEAD comes free", check: `eq((await get("/courses/2")).json.code, "DB-101", "GET /courses/2"); eq((await post("/courses", { code: "AI-101", title: "AI" })).status, 201, "POST /courses"); eq((await del("/courses/6")).status, 204, "DELETE /courses/6"); eq((await head("/courses")).status, 200, "HEAD /courses");` },
          ],
          hint: "Move GET /courses/featured above the /:id routes. A helper notAllowed(allow) returning (req, res) => res.status(405).set(\"Allow\", allow).json(…) keeps both .all() calls short.",
          successMessage: "Order decides which handler runs, and every path now says clearly which methods it supports.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 7.3 – 7.4 · MIDDLEWARE, REQUEST AND RESPONSE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l47-middleware",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.3", "7.4"],
    title: "Middleware and the Request and Response Objects",
    subtitle: "A pipeline every request walks through",
    estimatedMinutes: 60,
    intro: "Almost everything in Express is middleware: body parsing, logging, authentication, CORS, error handling. Understanding the order they run in explains most Express bugs.",
    atoms: [
      {
        id: "a-be-middleware-order",
        title: "Middleware execution order",
        explain:
          "A middleware is a function (req, res, next). It can read or change req and res, answer the request (and stop), or call next() to pass it on. Express runs app.use() middleware and routes in the ORDER THEY ARE REGISTERED: a middleware registered after a route never runs for requests that route answers. So the usual order is: request id and logging first, then body parsing (express.json), then security (CORS, authentication), then routes, then the 404 handler, then the error handler. A middleware that neither answers nor calls next() leaves the request hanging until the client times out.",
        nodeLab: {
          task:
            "The pieces are all there, in the wrong order. Without rewriting them, reorder server.js so that POST /courses can read its JSON body, EVERY response (including 404s) has the X-Api-Version: 1 header, and GET /stats counts every request, including the /stats request itself.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
const stats = { requests: 0 };

app.post("/courses", (req, res) => {
  const { code, title } = req.body;
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json(course);
});

app.use(express.json());

app.get("/courses", (req, res) => res.json(courses));
app.get("/stats", (req, res) => res.json(stats));

app.use((req, res, next) => {
  res.set("X-Api-Version", "1");
  next();
});

app.use((req, res, next) => {
  stats.requests++;
  next();
});

app.use((req, res) => res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } }));

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
const stats = { requests: 0 };

app.use((req, res, next) => {
  stats.requests++;
  next();
});

app.use((req, res, next) => {
  res.set("X-Api-Version", "1");
  next();
});

app.use(express.json());

app.post("/courses", (req, res) => {
  const { code, title } = req.body;
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json(course);
});

app.get("/courses", (req, res) => res.json(courses));
app.get("/stats", (req, res) => res.json(stats));

app.use((req, res) => res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } }));

${LISTEN}`,
          },
          requests: [
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation" } },
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /nope", method: "GET", path: "/nope" },
            { label: "GET /stats", method: "GET", path: "/stats" },
          ],
          tests: [
            { label: "POST /courses reads its JSON body", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation" }); eq(r.status, 201, "status"); eq([r.json.code, r.json.title], ["AI-101", "AI & Automation"], "the stored course");` },
            { label: "Every response has X-Api-Version: 1", check: `for (const [m, p] of [["GET", "/courses"], ["GET", "/stats"], ["GET", "/nope"], ["POST", "/courses"]]) { const r = await request(m, p, m === "POST" ? { json: { code: "X-1", title: "x" } } : {}); eq(r.headers["x-api-version"], "1", m + " " + p); }` },
            { label: "/stats counts every request, itself included", check: `const a = (await get("/stats")).json.requests; await get("/courses"); await get("/nope"); const b = (await get("/stats")).json.requests; eq(b - a, 3, "three requests between the two /stats calls (GET /courses, GET /nope, and the second /stats)");` },
            { label: "Nothing was rewritten", check: `const s = file("server.js"); has(s, "stats.requests++", "keep the counting middleware"); has(s, 'res.set("X-Api-Version", "1")', "keep the version middleware"); eq((s.match(/app\\.use\\(/g) || []).length, 4, "the same four app.use calls");` },
          ],
          hint: "Middleware that should affect every request goes before the routes: the counter, the version header and express.json() first, then the routes, then the 404 handler last.",
          successMessage: "Same code, right order. When something 'does not run' in Express, the first thing to check is where it was registered.",
        },
      },
      {
        id: "a-be-req-res",
        title: "Request and response objects",
        explain:
          "Express adds helpers to Node's req and res. On req: req.params, req.query, req.body, req.get(\"header\"), req.path and req.originalUrl, req.method, req.accepts(…) (which format the client prefers, from its Accept header). On res: res.status(), res.set(), res.type(), res.json(), res.send(), res.end(), res.location(), res.redirect(status, url), res.sendStatus(). Most return res, so they chain: res.status(201).location(url).json(body). Content negotiation lets one URL answer JSON to programs and text to a terminal.",
        nodeLab: {
          task:
            "Three improvements. (1) GET /courses/:id answers the text \"BE-101 · Backend Engineering (24 weeks)\" (Content-Type text/plain) when the client prefers text (req.accepts([\"json\", \"text\"]) is \"text\"), and JSON otherwise. (2) GET /courses?fields=code,title answers only those fields of each course. (3) The old URL GET /catalogue/:code (by course code, as BE-101) redirects with 301 to /courses/<id>, or answers 404 COURSE_NOT_FOUND for an unknown code.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

const notFound = (res, what) => res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${what} does not exist\` } });

app.get("/courses", (req, res) => {
  res.json(courses);
});

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return notFound(res, req.params.id);
  res.json(course);
});

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

const notFound = (res, what) => res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${what} does not exist\` } });

app.get("/courses", (req, res) => {
  if (!req.query.fields) return res.json(courses);
  const fields = String(req.query.fields).split(",");
  res.json(courses.map((c) => Object.fromEntries(fields.filter((f) => f in c).map((f) => [f, c[f]]))));
});

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return notFound(res, req.params.id);
  if (req.accepts(["json", "text"]) === "text") {
    return res.type("text").send(\`\${course.code} · \${course.title} (\${course.weeks} weeks)\`);
  }
  res.json(course);
});

app.get("/catalogue/:code", (req, res) => {
  const course = courses.find((c) => c.code === req.params.code);
  if (!course) return notFound(res, req.params.code);
  res.redirect(301, \`/courses/\${course.id}\`);
});

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses/1 (JSON)", method: "GET", path: "/courses/1" },
            { label: "GET /courses/1 (text)", method: "GET", path: "/courses/1", headers: { Accept: "text/plain" } },
            { label: "?fields=code,title", method: "GET", path: "/courses?fields=code,title" },
            { label: "GET /catalogue/DB-101", method: "GET", path: "/catalogue/DB-101" },
          ],
          tests: [
            { label: "Accept: text/plain gets one line of text; others get JSON", check: `const t = await get("/courses/1", { headers: { Accept: "text/plain" } }); eq(t.text, "BE-101 · Backend Engineering (24 weeks)", "the text answer"); has(t.headers["content-type"], "text/plain", "Content-Type"); const j = await get("/courses/1"); eq(j.json.code, "BE-101", "JSON by default"); const k = await get("/courses/1", { headers: { Accept: "application/json" } }); has(k.headers["content-type"], "application/json", "Accept: application/json");` },
            { label: "?fields=code,title answers only those fields", check: `const r = await get("/courses?fields=code,title"); eq(r.json[0], { code: "BE-101", title: "Backend Engineering" }, "the first course"); eq(r.json.length, 6, "all six courses"); eq((await get("/courses")).json[0].price, 120000, "without fields, the whole course");` },
            { label: "/catalogue/:code redirects with 301", check: `const r = await get("/catalogue/DB-101"); eq(r.status, 301, "status"); eq(r.headers.location, "/courses/2", "Location"); const n = await get("/catalogue/XX-000"); eq([n.status, n.json.error.code], [404, "COURSE_NOT_FOUND"], "an unknown code");` },
          ],
          hint: "req.accepts([\"json\", \"text\"]) returns the one the client prefers; res.type(\"text\").send(…) answers text. For fields: String(req.query.fields).split(\",\") and Object.fromEntries. res.redirect(301, url) for the old URL.",
          successMessage: "One resource, several representations, and old links that keep working. That is req and res doing what HTTP was designed for.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 7.5 – 7.6 · ROUTERS AND CENTRALIZED ERROR HANDLING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l48-routers-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.5", "7.6"],
    title: "Routers and Centralized Error Handling",
    subtitle: "Middleware where it belongs, errors in one place",
    estimatedMinutes: 65,
    intro: "As an API grows, two kinds of repetition appear: the same check pasted into many handlers, and the same try/catch with slightly different error responses. Routers and an error-handling middleware remove both.",
    atoms: [
      {
        id: "a-be-routers",
        title: "Application-level and router-level middleware",
        explain:
          "APPLICATION-LEVEL middleware (app.use(fn)) runs for every request. A ROUTER (express.Router()) is a mini-app with its own routes and middleware, mounted on a path: app.use(\"/admin\", adminRouter). ROUTER-LEVEL middleware (adminRouter.use(fn)) runs only for requests that reach that router, so a check written once protects every admin route and nothing else. Inside a router, paths are relative to the mount point: adminRouter.get(\"/stats\") answers GET /admin/stats. Each resource gets its own router file, which keeps app.js short.",
        nodeLab: {
          task:
            "Split server.js into routers. Create routes/courses.js exporting coursesRouter (GET / and GET /:id), mounted at /courses, and routes/admin.js exporting adminRouter (GET /stats and DELETE /courses/:id), mounted at /admin. The admin key check must be written ONCE, as router-level middleware in routes/admin.js (adminRouter.use), so every admin route is protected and the public routes are not. ADMIN_KEY comes from config.js.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "config.js": `// Week 13 replaces this key with real authentication; until then it would come from an environment variable.\nexport const ADMIN_KEY = "academy-admin-key";\n`,
            "server.js": `import express from "express";
import { courses } from "./data.js";
import { ADMIN_KEY } from "./config.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json(courses));

app.get("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  res.json(course);
});

app.get("/admin/stats", (req, res) => {
  if (req.get("x-admin-key") !== ADMIN_KEY) {
    return res.status(401).json({ error: { code: "ADMIN_KEY_REQUIRED", message: "Send a valid X-Admin-Key header" } });
  }
  res.json({ courses: courses.length, weeks: courses.reduce((sum, c) => sum + c.weeks, 0) });
});

app.delete("/admin/courses/:id", (req, res) => {
  if (req.get("x-admin-key") !== ADMIN_KEY) {
    return res.status(401).json({ error: { code: "ADMIN_KEY_REQUIRED", message: "Send a valid X-Admin-Key header" } });
  }
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  courses.splice(index, 1);
  res.status(204).end();
});

${LISTEN}`,
            "routes/courses.js": "",
            "routes/admin.js": "",
          },
          readOnly: ["package.json", "data.js", "config.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { coursesRouter } from "./routes/courses.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
app.use(express.json());

app.use("/courses", coursesRouter);
app.use("/admin", adminRouter);

${LISTEN}`,
            "routes/courses.js": `import { Router } from "express";
import { courses } from "../data.js";

export const coursesRouter = Router();

coursesRouter.get("/", (req, res) => res.json(courses));

coursesRouter.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  res.json(course);
});
`,
            "routes/admin.js": `import { Router } from "express";
import { courses } from "../data.js";
import { ADMIN_KEY } from "../config.js";

export const adminRouter = Router();

// Router-level: runs for every /admin request, and for nothing else.
adminRouter.use((req, res, next) => {
  if (req.get("x-admin-key") !== ADMIN_KEY) {
    return res.status(401).json({ error: { code: "ADMIN_KEY_REQUIRED", message: "Send a valid X-Admin-Key header" } });
  }
  next();
});

adminRouter.get("/stats", (req, res) => {
  res.json({ courses: courses.length, weeks: courses.reduce((sum, c) => sum + c.weeks, 0) });
});

adminRouter.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  courses.splice(index, 1);
  res.status(204).end();
});
`,
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /admin/stats (no key)", method: "GET", path: "/admin/stats" },
            { label: "GET /admin/stats (key)", method: "GET", path: "/admin/stats", headers: { "X-Admin-Key": "academy-admin-key" } },
            { label: "DELETE /admin/courses/6", method: "DELETE", path: "/admin/courses/6", headers: { "X-Admin-Key": "academy-admin-key" } },
          ],
          tests: [
            { label: "Public routes need no key", check: `eq((await get("/courses")).json.length, 6, "GET /courses"); eq((await get("/courses/2")).json.code, "DB-101", "GET /courses/2"); eq((await get("/courses/99")).status, 404, "GET /courses/99");` },
            { label: "Admin routes need the key", check: `const KEY = { headers: { "X-Admin-Key": "academy-admin-key" } }; const no = await get("/admin/stats"); eq(no.status, 401, "without a key"); eq(no.json.error.code, "ADMIN_KEY_REQUIRED", "error code"); eq((await get("/admin/stats", { headers: { "X-Admin-Key": "wrong" } })).status, 401, "a wrong key"); eq((await get("/admin/stats", KEY)).json, { courses: 6, weeks: 108 }, "with the key"); eq((await del("/admin/courses/6")).status, 401, "DELETE without a key"); eq((await del("/admin/courses/6", KEY)).status, 204, "DELETE with the key");` },
            { label: "Two routers, mounted at /courses and /admin", check: `has(file("routes/courses.js"), "Router(", "routes/courses.js should create a Router"); has(file("routes/admin.js"), "Router(", "routes/admin.js should create a Router"); const s = file("server.js"); assert(/app\\.use\\(\\s*["']\\/courses["']/.test(s), "mount the courses router with app.use(\\"/courses\\", …)"); assert(/app\\.use\\(\\s*["']\\/admin["']/.test(s), "mount the admin router with app.use(\\"/admin\\", …)"); lacks(s, "x-admin-key", "server.js should no longer check the key");` },
            { label: "The key is checked once, in router-level middleware", check: `const a = file("routes/admin.js"); eq((a.match(/get\\(\\s*["']x-admin-key/gi) || []).length, 1, "routes/admin.js should check the X-Admin-Key header in one place"); has(a, "adminRouter.use(", "check it with adminRouter.use(…)");` },
          ],
          hint: "In routes/admin.js: export const adminRouter = Router(); adminRouter.use((req, res, next) => { …check…; next(); }); then the two routes with paths relative to /admin (\"/stats\", \"/courses/:id\").",
          successMessage: "A new admin route is now protected the moment it is added, and app.js reads like a table of contents.",
        },
      },
      {
        id: "a-be-error-handler",
        title: "Centralized error-handling middleware",
        explain:
          "An error-handling middleware has FOUR parameters, (err, req, res, next): Express calls it when a handler throws, calls next(err), or (Express 5) returns a rejected promise. Register it LAST. With it, handlers stop catching errors: they throw an AppError(status, code, message) for expected problems (404, 409) and let unexpected ones (a bug, a dead service) fly. The handler turns AppErrors into their response, turns express.json()'s parse error (err.type \"entity.parse.failed\") into a 400, and answers everything else with a generic 500 while LOGGING the real error for you. Without one, Express answers with an HTML page containing the stack trace.",
        nodeLab: {
          task:
            "Remove the try/catch and the hand-made error responses from the routes: throw AppError (from errors.js) instead, with 404 COURSE_NOT_FOUND \"Course <id> does not exist\" and 400 VALIDATION_FAILED \"code and title are required\". Add an error-handling middleware at the end: AppError → its status and { error: { code, message } }; invalid JSON → 400 INVALID_JSON; anything else → console.error(err) and 500 { error: { code: \"INTERNAL_ERROR\", message: \"Something went wrong\" } }, revealing nothing about the cause.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "errors.js": ERRORS,
            "server.js": `import express from "express";
import { courses } from "./data.js";
import { AppError } from "./errors.js";

const app = express();
app.use(express.json());

// Pretend this asks the reporting service, which is down today.
async function enrollmentReport(course) {
  await new Promise((resolve) => setTimeout(resolve, 20));
  throw new Error(\`report service unreachable at 10.0.4.12:7000 (course \${course.code})\`);
}

app.get("/courses/:id", (req, res) => {
  try {
    const course = courses.find((c) => c.id === Number(req.params.id));
    if (!course) return res.status(404).send("not found");
    res.json(course);
  } catch (err) {
    res.status(500).send("error");
  }
});

app.post("/courses", (req, res) => {
  const { code, title } = req.body ?? {};
  if (!code || !title) return res.status(400).json({ msg: "bad input", ok: false });
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json(course);
});

app.get("/courses/:id/report", async (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  res.json(await enrollmentReport(course));
});

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js", "errors.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { courses } from "./data.js";
import { AppError } from "./errors.js";

const app = express();
app.use(express.json());

// Pretend this asks the reporting service, which is down today.
async function enrollmentReport(course) {
  await new Promise((resolve) => setTimeout(resolve, 20));
  throw new Error(\`report service unreachable at 10.0.4.12:7000 (course \${course.code})\`);
}

function findCourse(id) {
  const course = courses.find((c) => c.id === Number(id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
  return course;
}

app.get("/courses/:id", (req, res) => {
  res.json(findCourse(req.params.id));
});

app.post("/courses", (req, res) => {
  const { code, title } = req.body ?? {};
  if (!code || !title) throw new AppError(400, "VALIDATION_FAILED", "code and title are required");
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json(course);
});

// Express 5 passes a rejected promise to the error handler by itself.
app.get("/courses/:id/report", async (req, res) => {
  res.json(await enrollmentReport(findCourse(req.params.id)));
});

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { code: "INVALID_JSON", message: "The request body is not valid JSON" } });
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses/99", method: "GET", path: "/courses/99" },
            { label: "POST {}", method: "POST", path: "/courses", body: {} },
            { label: "POST invalid JSON", method: "POST", path: "/courses", body: "{oops", headers: { "Content-Type": "application/json" } },
            { label: "GET /courses/1/report", method: "GET", path: "/courses/1/report" },
          ],
          tests: [
            { label: "Expected errors use their AppError", check: `const a = await get("/courses/99"); eq(a.status, 404, "GET /courses/99"); eq(a.json, { error: { code: "COURSE_NOT_FOUND", message: "Course 99 does not exist" } }, "body"); const b = await post("/courses", { code: "AI-101" }); eq(b.status, 400, "POST without a title"); eq(b.json, { error: { code: "VALIDATION_FAILED", message: "code and title are required" } }, "body"); eq((await get("/courses/99/report")).status, 404, "the report of a missing course");` },
            { label: "Invalid JSON → 400 INVALID_JSON", check: `const r = await request("POST", "/courses", { body: "{oops", headers: { "Content-Type": "application/json" } }); eq(r.status, 400, "status"); eq(r.json, { error: { code: "INVALID_JSON", message: "The request body is not valid JSON" } }, "body");` },
            { label: "An unexpected failure → a generic 500, logged on the server", check: `const r = await get("/courses/1/report"); eq(r.status, 500, "status"); eq(r.json, { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } }, "the body reveals nothing"); lacks(r.text, "10.0.4.12", "never send internal addresses to clients"); has(output(), "report service unreachable", "the real error should be logged with console.error");` },
            { label: "No try/catch left in the routes; valid requests work", check: `assert(!/\\btry\\s*\\{/.test(file("server.js")), "the routes should throw and let the error handler answer: remove the try/catch"); has(file("server.js"), "throw new AppError", "throw AppError for expected errors"); eq((await get("/courses/2")).json.code, "DB-101", "GET /courses/2"); eq((await post("/courses", { code: "AI-101", title: "AI" })).status, 201, "a valid POST");` },
          ],
          hint: "A findCourse(id) helper that throws the 404 keeps the routes short. The error handler goes after every route and must declare all four parameters: (err, req, res, next).",
          successMessage: "Handlers describe what should happen; one place decides what an error looks like. The cause of the 500 is in your log, not in your client's hands.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 7.7 · VALIDATION WITH ZOD
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l49-validation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.7"],
    title: "Request Validation with a Schema Library",
    subtitle: "Describe the data once; let zod check it",
    estimatedMinutes: 60,
    intro: "Week 6's validate function worked, and grew with every field. A schema library replaces it with a description of the data that checks, converts and cleans the input in one step.",
    atoms: [
      {
        id: "a-be-zod",
        title: "Validating requests with zod",
        explain:
          "zod describes data: z.object({ title: z.string().trim().min(3, \"must be 3 to 100 characters\"), weeks: z.int().min(1), level: z.enum([\"beginner\", …]) }). schema.safeParse(input) returns { success: true, data } or { success: false, error } where error.issues lists every problem with its path and message. data is CLEANED: strings trimmed, unknown keys removed (so no mass assignment). Schemas compose: createSchema.omit({ code: true }).partial() is the PATCH schema. A validate(schema) middleware runs it before the handler, answers 400 with one detail per issue, and replaces req.body with the clean data. (Express 5 makes req.query read-only: put a parsed query in res.locals instead.) Joi and Yup do the same job; zod also gives TypeScript types (Week 8).",
        nodeLab: {
          task:
            "Write createCourseSchema in schemas.js (code like BE-101 with the message \"must look like BE-101\"; title trimmed, 3 to 100 characters; weeks a whole number from 1 to 52; level beginner, intermediate or advanced; price a whole number, 0 or more) and updateCourseSchema (the same without code, every field optional). Write validate(schema) in validate.js: on failure, 400 { error: { code: \"VALIDATION_FAILED\", message: \"Invalid request body\", details: [{ field, message }] } } with one entry per issue; on success, req.body becomes the parsed data. Use it on POST /courses and PATCH /courses/:id.",
          files: {
            "package.json": PKG_ZOD,
            "data.js": COURSES_DATA,
            "errors.js": ERRORS,
            "schemas.js": `import { z } from "zod";

export const createCourseSchema = z.object({
  // code, title, weeks, level, price
});

// The same fields without code, all optional.
export const updateCourseSchema = createCourseSchema.partial();
`,
            "validate.js": `// validate(schema) returns a middleware that checks req.body against the schema.
export const validate = (schema) => (req, res, next) => {
  next();
};
`,
            "server.js": `import express from "express";
import { courses } from "./data.js";
import { AppError } from "./errors.js";

const app = express();
app.use(express.json());

app.post("/courses", (req, res) => {
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.status(201).json(course);
});

app.patch("/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  Object.assign(course, req.body);
  res.json(course);
});

app.use((err, req, res, next) => {
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js", "errors.js"],
          open: "schemas.js",
          solution: {
            "schemas.js": COURSE_SCHEMA,
            "validate.js": VALIDATE_DIRECT,
            "server.js": `import express from "express";
import { courses } from "./data.js";
import { AppError } from "./errors.js";
import { validate } from "./validate.js";
import { createCourseSchema, updateCourseSchema } from "./schemas.js";

const app = express();
app.use(express.json());

app.post("/courses", validate(createCourseSchema), (req, res) => {
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...req.body };
  courses.push(course);
  res.status(201).json(course);
});

app.patch("/courses/:id", validate(updateCourseSchema), (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  Object.assign(course, req.body);
  res.json(course);
});

app.use((err, req, res, next) => {
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN}`,
          },
          requests: [
            { label: "POST valid", method: "POST", path: "/courses", body: { code: "AI-101", title: "  AI & Automation ", weeks: 12, level: "beginner", price: 70000, featured: true } },
            { label: "POST invalid", method: "POST", path: "/courses", body: { code: "ai101", title: "AI", weeks: 2.5, level: "expert", price: -5 } },
            { label: "PATCH /courses/3", method: "PATCH", path: "/courses/3", body: { weeks: 18, code: "XX-999" } },
          ],
          tests: [
            { label: "A valid course is stored cleaned: trimmed, unknown fields dropped", check: `const r = await post("/courses", { code: "AI-101", title: "  AI & Automation ", weeks: 12, level: "beginner", price: 70000, featured: true }); eq(r.status, 201, "status"); eq(r.json, { id: 7, code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }, "the stored course");` },
            { label: "Every invalid field is reported", check: `const r = await post("/courses", { code: "ai101", title: "AI", weeks: 2.5, level: "expert", price: -5 }); eq(r.status, 400, "status"); eq([r.json.error.code, r.json.error.message], ["VALIDATION_FAILED", "Invalid request body"], "code and message"); eq(r.json.error.details.map((d) => d.field), ["code", "title", "weeks", "level", "price"], "one detail per field"); eq(r.json.error.details[0], { field: "code", message: "must look like BE-101" }, "the code's message"); eq((await post("/courses", { code: "AI-102", title: "Some title", weeks: 4, level: "beginner" })).json.error.details.map((d) => d.field), ["price"], "a missing price");` },
            { label: "PATCH validates only what was sent, and cannot change the code", check: `const r = await patch("/courses/3", { weeks: 18, code: "XX-999" }); eq(r.status, 200, "status"); eq([r.json.weeks, r.json.code, r.json.title], [18, "WD-201", "React Development"], "weeks changed, code kept"); const bad = await patch("/courses/3", { weeks: 99 }); eq(bad.status, 400, "weeks 99"); eq(bad.json.error.details.map((d) => d.field), ["weeks"], "details"); eq((await patch("/courses/99", { weeks: 2 })).status, 404, "a missing course");` },
            { label: "validate(schema) is used on both routes", check: `eq((file("server.js").match(/validate\\(/g) || []).length, 2, "use validate(createCourseSchema) on POST and validate(updateCourseSchema) on PATCH"); has(file("validate.js"), "safeParse", "validate should call schema.safeParse(req.body)");` },
          ],
          hint: "z.string().regex(/^[A-Z]{2,3}-\\d{3}$/, \"must look like BE-101\"), z.string().trim().min(3).max(100), z.int().min(1).max(52), z.enum([…]), z.int().min(0). updateCourseSchema = createCourseSchema.omit({ code: true }).partial(). In validate: map result.error.issues to { field: issue.path.join(\".\"), message: issue.message }.",
          successMessage: "Twenty lines of if-statements became a schema you can read at a glance, and the handlers only ever see clean data.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 7.8 – 7.9 · LOGGING, REQUEST IDS AND 404S
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l50-logging-404",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.8", "7.9"],
    title: "Logging, Request IDs and 404s",
    subtitle: "Knowing what your API did, request by request",
    estimatedMinutes: 55,
    intro: "When a user reports 'it failed at 10:42', you need to find that request among thousands. A log line per request, tagged with an id the user can also see, makes that possible.",
    atoms: [
      {
        id: "a-be-request-logging",
        title: "Logging and request IDs",
        explain:
          "A REQUEST ID is a unique id given to each request at the start (crypto.randomUUID()), or taken from an X-Request-Id header a gateway already set, if it looks safe. It is stored on req.id, sent back in the X-Request-Id response header, and written in every log line about that request, so one id finds everything. The ACCESS LOG writes one line when the response has been sent (res.on(\"finish\")), with the method, URL, status and duration. Libraries do this (morgan for access logs, pino for structured logs); writing it once yourself shows there is no magic.",
        nodeLab: {
          task:
            "Add two middleware at the top of server.js. requestId: req.id is the incoming X-Request-Id if it matches /^[\\w-]{1,64}$/, else crypto.randomUUID(); send it back as X-Request-Id. logger: when the response finishes, console.log a line \"[<id>] <METHOD> <originalUrl> <status> <ms>ms\", as [3f…] GET /courses?level=beginner 200 2ms. The error handler must log \"[<id>] \" followed by the error message.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "server.js": `import express from "express";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => {
  const data = req.query.level ? courses.filter((c) => c.level === req.query.level) : courses;
  res.json(data);
});

app.get("/crash", () => {
  throw new Error("database connection lost");
});

app.use((req, res) => res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { randomUUID } from "node:crypto";
import { courses } from "./data.js";

const app = express();

app.use((req, res, next) => {
  const incoming = req.get("x-request-id");
  req.id = incoming && /^[\\w-]{1,64}$/.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.id);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => console.log(\`[\${req.id}] \${req.method} \${req.originalUrl} \${res.statusCode} \${Date.now() - start}ms\`));
  next();
});

app.use(express.json());

app.get("/courses", (req, res) => {
  const data = req.query.level ? courses.filter((c) => c.level === req.query.level) : courses;
  res.json(data);
});

app.get("/crash", () => {
  throw new Error("database connection lost");
});

app.use((req, res) => res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: \`No route for \${req.method} \${req.path}\` } }));

app.use((err, req, res, next) => {
  console.error(\`[\${req.id}] \${err.message}\`);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses?level=beginner", method: "GET", path: "/courses?level=beginner" },
            { label: "with X-Request-Id", method: "GET", path: "/courses", headers: { "X-Request-Id": "mobile-7f3a" } },
            { label: "GET /nope", method: "GET", path: "/nope" },
            { label: "GET /crash", method: "GET", path: "/crash" },
          ],
          tests: [
            { label: "Every response has an X-Request-Id (a UUID)", check: `const a = await get("/courses"); const b = await get("/courses"); assert(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(a.headers["x-request-id"] || ""), "X-Request-Id should be a UUID from crypto.randomUUID()"); assert(a.headers["x-request-id"] !== b.headers["x-request-id"], "each request gets its own id");` },
            { label: "A safe incoming X-Request-Id is reused; an unsafe one is replaced", check: `eq((await get("/courses", { headers: { "X-Request-Id": "mobile-7f3a" } })).headers["x-request-id"], "mobile-7f3a", "a safe id is kept"); const r = await get("/courses", { headers: { "X-Request-Id": "evil id\\" injected" } }); assert(r.headers["x-request-id"] !== "evil id\\" injected", "an id with spaces or quotes should be replaced");` },
            { label: "One access-log line per request, after it finished", check: `const r = await get("/courses?level=beginner"); const id = r.headers["x-request-id"]; const line = output().split("\\n").find((l) => l.startsWith("[" + id + "]")); assert(line, "no log line starts with [" + id + "]"); assert(/^\\[[^\\]]+\\] GET \\/courses\\?level=beginner 200 \\d+ms$/.test(line), "the line should look like [id] GET /courses?level=beginner 200 2ms, got: " + line); const n = await get("/nope"); has(output(), "[" + n.headers["x-request-id"] + "] GET /nope 404 ", "404s are logged too");` },
            { label: "Errors are logged with the request id", check: `const r = await get("/crash"); const id = r.headers["x-request-id"]; eq(r.status, 500, "status"); has(output(), "[" + id + "] database connection lost", "the error handler should log [id] and the message"); has(output(), "[" + id + "] GET /crash 500 ", "the failed request is in the access log");` },
          ],
          hint: "The two middleware go before express.json() and the routes. res.on(\"finish\", …) runs once the response is sent, when res.statusCode is final.",
          successMessage: "A user can now quote the X-Request-Id from a failed response, and one search in the logs shows exactly what happened.",
        },
      },
      {
        id: "a-be-not-found",
        title: "Handling 404 errors",
        explain:
          "An API has two different 404s. An UNKNOWN ROUTE (GET /coursse/1, a typo, or a removed endpoint) is answered by a catch-all middleware after all the routes: next(new AppError(404, \"ROUTE_NOT_FOUND\", …)), so it uses the error format like everything else. A MISSING RESOURCE (GET /courses/999: the route exists, the course does not) is answered by the handler: COURSE_NOT_FOUND. Different codes let a client tell a bug in its URL from data that is gone. Order: routes, then the 404 middleware, then the error handler.",
        decision: decide({
          scenario: "A client calls GET /coursse/1 (a typo) and GET /courses/999 (a course that was deleted). Today both get Express's default HTML page \"Cannot GET …\".",
          question: "What should the API answer?",
          right: ["Both 404 in the JSON error format, with ROUTE_NOT_FOUND for the typo and COURSE_NOT_FOUND for the deleted course", "One shape, two codes the client can act on."],
          wrong: [
            ["400 for the typo and 404 for the course", "An unknown URL is 'not found', not a malformed request."],
            ["200 with an empty object for both", "Hides both problems."],
            ["Leave Express's HTML page: it is a 404 after all", "JSON clients cannot parse it, and it differs from every other error."],
          ],
          at: 0,
          aftermath: "The catch-all goes after the routes and before the error handler: app.use(notFound); app.use(errorHandler).",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 7.10 · ROUTES, CONTROLLERS AND SERVICES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l51-layers",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["7.10"],
    title: "Separating Routes, Controllers and Business Logic",
    subtitle: "Each file with one job",
    estimatedMinutes: 60,
    intro: "A handler that parses the request, applies business rules, touches the data and builds the response is hard to test and hard to reuse. Splitting it into layers gives each concern one home.",
    atoms: [
      {
        id: "a-be-layers",
        title: "Routes, controllers and services",
        explain:
          "ROUTES map a method and path to middleware and a controller function, and nothing else. CONTROLLERS speak HTTP: they read req (params, query, body), call a service, and choose the status and response. SERVICES hold the business logic and data access: plain functions such as createCourse(input) that know nothing about req or res, throw AppError for rule violations, and could be called from a script, a job queue or a test. Week 8 adds REPOSITORIES under the services for data access, and Week 11 replaces the array with PostgreSQL there, without touching routes or controllers.",
        nodeLab: {
          task:
            "routes/courses.routes.js does everything. Split it: services/courses.service.js exports listCourses({ level }), getCourse(id), createCourse(input) and deleteCourse(id) (data and rules, throwing AppError, no req or res); controllers/courses.controller.js exports list, show, create and remove (HTTP only, calling the service); routes/courses.routes.js only maps paths to controllers. Behaviour stays the same.",
          files: {
            "package.json": PKG,
            "data.js": COURSES_DATA,
            "errors.js": ERRORS,
            "server.js": `import express from "express";
import { AppError } from "./errors.js";
import { coursesRouter } from "./routes/courses.routes.js";

const app = express();
app.use(express.json());
app.use("/courses", coursesRouter);

app.use((err, req, res, next) => {
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});

${LISTEN}`,
            "routes/courses.routes.js": `import { Router } from "express";
import { courses } from "../data.js";
import { AppError } from "../errors.js";

export const coursesRouter = Router();

coursesRouter.get("/", (req, res) => {
  const data = req.query.level ? courses.filter((c) => c.level === req.query.level) : courses;
  res.json({ data, meta: { total: data.length } });
});

coursesRouter.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json(course);
});

coursesRouter.post("/", (req, res) => {
  const { code, title, weeks, level, price } = req.body;
  if (courses.some((c) => c.code === code)) throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title, weeks, level, price };
  courses.push(course);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
});

coursesRouter.delete("/:id", (req, res) => {
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  courses.splice(index, 1);
  res.status(204).end();
});
`,
            "controllers/courses.controller.js": "",
            "services/courses.service.js": "",
          },
          readOnly: ["package.json", "data.js", "errors.js", "server.js"],
          open: "routes/courses.routes.js",
          solution: {
            "services/courses.service.js": `import { courses } from "../data.js";
import { AppError } from "../errors.js";

export function listCourses({ level } = {}) {
  return level ? courses.filter((c) => c.level === level) : courses;
}

export function getCourse(id) {
  const course = courses.find((c) => c.id === Number(id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
  return course;
}

export function createCourse({ code, title, weeks, level, price }) {
  if (courses.some((c) => c.code === code)) throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${code} already exists\`);
  const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, code, title, weeks, level, price };
  courses.push(course);
  return course;
}

export function deleteCourse(id) {
  const course = getCourse(id);
  courses.splice(courses.indexOf(course), 1);
}
`,
            "controllers/courses.controller.js": `import * as service from "../services/courses.service.js";

export function list(req, res) {
  const data = service.listCourses({ level: req.query.level });
  res.json({ data, meta: { total: data.length } });
}

export function show(req, res) {
  res.json(service.getCourse(req.params.id));
}

export function create(req, res) {
  const course = service.createCourse(req.body);
  res.location(\`/courses/\${course.id}\`).status(201).json(course);
}

export function remove(req, res) {
  service.deleteCourse(req.params.id);
  res.status(204).end();
}
`,
            "routes/courses.routes.js": `import { Router } from "express";
import * as controller from "../controllers/courses.controller.js";

export const coursesRouter = Router();

coursesRouter.get("/", controller.list);
coursesRouter.get("/:id", controller.show);
coursesRouter.post("/", controller.create);
coursesRouter.delete("/:id", controller.remove);
`,
          },
          requests: [
            { label: "GET /courses?level=advanced", method: "GET", path: "/courses?level=advanced" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 } },
            { label: "DELETE /courses/6", method: "DELETE", path: "/courses/6" },
          ],
          tests: [
            { label: "The API behaves as before", check: `eq((await get("/courses?level=advanced")).json, { data: [{ id: 6, code: "DA-301", title: "Advanced Data Analysis", weeks: 12, level: "advanced", price: 100000 }], meta: { total: 1 } }, "GET /courses?level=advanced"); eq((await get("/courses/99")).json.error.code, "COURSE_NOT_FOUND", "GET /courses/99"); const c = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }); eq([c.status, c.headers.location], [201, "/courses/7"], "POST"); eq((await post("/courses", { code: "BE-101" })).status, 409, "a duplicate"); eq((await del("/courses/6")).status, 204, "DELETE");` },
            { label: "The service works on its own, without HTTP", check: `const s = await load("services/courses.service.js"); for (const f of ["listCourses", "getCourse", "createCourse", "deleteCourse"]) assert(typeof s[f] === "function", "services/courses.service.js should export " + f); eq(s.getCourse(2).code, "DB-101", "getCourse(2)"); eq(s.listCourses({ level: "intermediate" }).map((c) => c.code), ["WD-201"], "listCourses({ level })"); let err; try { s.getCourse(99); } catch (e) { err = e; } eq(err?.code, "COURSE_NOT_FOUND", "getCourse(99) should throw an AppError");` },
            { label: "The service knows nothing about HTTP", check: `const code = file("services/courses.service.js").replace(/\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\//g, ""); assert(!/\\b(req|res)\\b/.test(code), "services should not use req or res"); lacks(code, "express", "services should not import Express");` },
            { label: "Routes only map; controllers do not touch the data", check: `const r = file("routes/courses.routes.js"); lacks(r, "data.js", "routes should not import the data"); lacks(r, "res.", "routes should not build responses: controllers do"); lacks(file("controllers/courses.controller.js"), "data.js", "controllers should call the service, not the data");` },
          ],
          hint: "Move each handler's logic into a service function that takes plain values and returns plain values. The controller reads req, calls the service, sends res. The router becomes four one-line routes.",
          successMessage: "Three thin layers. The service can be tested without a server (Week 15), and moving to PostgreSQL (Week 11) changes only the service.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 7.11 – 7.14 · EXERCISES: THE MODULAR COURSE API
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l52-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["7.11", "7.12", "7.13", "7.14"],
    title: "Exercises: The Modular Course API",
    subtitle: "From one file to a project you can grow",
    estimatedMinutes: 120,
    intro: "Four exercises, one project: the Week 6 catalogue, written as one server file, becomes a modular Express API. Each exercise starts where the previous one ended.",
    atoms: [
      {
        id: "a-be-ex-modular",
        title: "Exercise: refactor the course API into modular routes",
        explain:
          "Start with the structure: src/app.js builds the app, src/server.js listens, and src/routes/courses.routes.js holds the course routes in a Router mounted at /courses. Move code without changing what it does: the API must answer exactly as before, which the checks verify for every endpoint.",
        nodeLab: {
          task:
            "src/server.js holds the whole catalogue API. Split it into src/app.js (the app, express.json(), GET /health, the router mounted at /courses and the 404 handler; export default app), src/routes/courses.routes.js (export const coursesRouter, with the five course routes and their validation) and src/server.js (only listening on PORT, or 3000).",
          files: { "package.json": PKG_SRC, "src/data.js": COURSES_DATA, "src/server.js": MONOLITH, "src/app.js": "", "src/routes/courses.routes.js": "" },
          readOnly: ["package.json", "src/data.js"],
          open: "src/server.js",
          solution: { "src/server.js": SRC_SERVER, "src/app.js": APP_B, "src/routes/courses.routes.js": ROUTES_HANDWRITTEN },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "POST invalid", method: "POST", path: "/courses", body: { code: "x" } },
            { label: "GET /nope", method: "GET", path: "/nope" },
          ],
          tests: [
            ...CATALOGUE_BEHAVES,
            { label: "Three files, each with its job", check: `const mod = await load("src/app.js"); assert(typeof mod.default?.use === "function", "src/app.js should export default app"); lacks(file("src/app.js"), ".listen(", "src/app.js should not listen"); has(file("src/routes/courses.routes.js"), "Router(", "src/routes/courses.routes.js should create a Router"); assert(/app\\.use\\(\\s*["']\\/courses["']/.test(file("src/app.js")), "mount the router at /courses in src/app.js"); assert(!/\\.(get|post|patch|delete|use)\\(/.test(file("src/server.js")), "src/server.js should only listen");` },
            { label: "Unknown routes still answer ROUTE_NOT_FOUND", check: `const r = await get("/nope"); eq([r.status, r.json.error.code], [404, "ROUTE_NOT_FOUND"], "GET /nope");` },
          ],
          hint: "The router paths lose their /courses prefix (\"/\" and \"/:id\"); the validation helper moves with the routes.",
          successMessage: "Same API, three files. Adding students or instructors now means adding a router, not scrolling through one long file.",
        },
      },
      {
        id: "a-be-ex-logging",
        title: "Exercise: add request logging",
        explain:
          "Production logs are read by machines first (log search, alerts, dashboards), so they are STRUCTURED: one JSON object per line, with fixed field names, instead of free text. Add the request id middleware and a JSON access logger in src/middleware, and register them first in app.js.",
        nodeLab: {
          task:
            "Create src/middleware/requestId.js (export function requestId: reuse a safe X-Request-Id matching /^[\\w-]{1,64}$/ or create one with randomUUID; set req.id and the X-Request-Id header) and src/middleware/logger.js (export function logger: when each response finishes, console.log one JSON line { level: \"info\", requestId, method, path (the original URL), status, durationMs }). Register both first in src/app.js.",
          files: { "package.json": PKG_SRC, "src/data.js": COURSES_DATA, "src/server.js": SRC_SERVER, "src/app.js": APP_B, "src/routes/courses.routes.js": ROUTES_HANDWRITTEN, "src/middleware/requestId.js": "", "src/middleware/logger.js": "" },
          readOnly: ["package.json", "src/data.js", "src/server.js"],
          open: "src/app.js",
          solution: { "src/app.js": APP_C, "src/middleware/requestId.js": REQUEST_ID, "src/middleware/logger.js": JSON_LOGGER },
          requests: [
            { label: "GET /courses?level=beginner", method: "GET", path: "/courses?level=beginner" },
            { label: "with X-Request-Id", method: "GET", path: "/courses/1", headers: { "X-Request-Id": "web-4410" } },
            { label: "POST invalid", method: "POST", path: "/courses", body: {} },
          ],
          tests: [
            ...CATALOGUE_BEHAVES,
            { label: "X-Request-Id on every response; a safe incoming one is kept", check: `const a = await get("/courses"); assert(/^[0-9a-f-]{36}$/.test(a.headers["x-request-id"] || ""), "X-Request-Id should be a UUID"); eq((await get("/courses/1", { headers: { "X-Request-Id": "web-4410" } })).headers["x-request-id"], "web-4410", "a safe id is kept"); assert((await get("/health", { headers: { "X-Request-Id": "bad id!" } })).headers["x-request-id"] !== "bad id!", "an unsafe id is replaced");` },
            { label: "One JSON log line per request", check: `const r = await get("/courses?level=beginner"); const id = r.headers["x-request-id"]; ${LOG_LINES} const line = logs.find((l) => l.requestId === id); assert(line, "no JSON log line has requestId " + id); eq({ ...line, durationMs: typeof line.durationMs }, { level: "info", requestId: id, method: "GET", path: "/courses?level=beginner", status: 200, durationMs: "number" }, "the log line");` },
            { label: "Failed requests are logged with their status", check: `const r = await post("/courses", {}); const n = await get("/nope"); ${LOG_LINES} eq(logs.find((l) => l.requestId === r.headers["x-request-id"])?.status, 400, "the invalid POST"); eq(logs.find((l) => l.requestId === n.headers["x-request-id"])?.status, 404, "the unknown route");` },
          ],
          hint: "In logger: const start = Date.now(); res.on(\"finish\", () => console.log(JSON.stringify({ … }))); next(). In app.js: app.use(requestId); app.use(logger); before express.json().",
          successMessage: "Every request leaves one searchable line. Week 20 sends these lines to a log platform and builds alerts on them.",
        },
      },
      {
        id: "a-be-ex-validate",
        title: "Exercise: validate incoming course data",
        explain:
          "Replace the hand-written validateCourse with zod: a schema file describing a course, and a reusable validate(schema) middleware that any router can put in front of a handler. The error format stays exactly the same, so clients notice nothing except cleaner data.",
        nodeLab: {
          task:
            "Create src/schemas/course.schema.js (createCourseSchema and updateCourseSchema, with the same rules and messages as validateCourse) and src/middleware/validate.js (export const validate = (schema) => middleware answering 400 VALIDATION_FAILED \"Invalid request body\" with details, or replacing req.body with the parsed data). Use them in the router, and delete validateCourse.",
          files: { "package.json": PKG_SRC, "src/data.js": COURSES_DATA, "src/server.js": SRC_SERVER, "src/app.js": APP_C, "src/middleware/requestId.js": REQUEST_ID, "src/middleware/logger.js": JSON_LOGGER, "src/routes/courses.routes.js": ROUTES_HANDWRITTEN, "src/schemas/course.schema.js": "", "src/middleware/validate.js": "" },
          readOnly: ["package.json", "src/data.js", "src/server.js", "src/app.js", "src/middleware/requestId.js", "src/middleware/logger.js"],
          open: "src/routes/courses.routes.js",
          solution: { "src/routes/courses.routes.js": ROUTES_ZOD, "src/schemas/course.schema.js": COURSE_SCHEMA, "src/middleware/validate.js": VALIDATE_DIRECT },
          requests: [
            { label: "POST valid", method: "POST", path: "/courses", body: { code: "AI-101", title: " AI & Automation ", weeks: 12, level: "beginner", price: 70000, isFree: true } },
            { label: "POST invalid", method: "POST", path: "/courses", body: { code: "ai", title: "AI", weeks: 0, level: "expert", price: 1.5 } },
            { label: "PATCH /courses/2", method: "PATCH", path: "/courses/2", body: { price: 90000 } },
          ],
          tests: [
            ...CATALOGUE_BEHAVES,
            { label: "Input is cleaned and checked by the schema", check: `const r = await post("/courses", { code: "AI-101", title: " AI & Automation ", weeks: 12, level: "beginner", price: 70000, isFree: true }); eq(r.json, { id: 7, code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }, "trimmed, unknown fields dropped"); const bad = await post("/courses", { code: "ai", title: "AI", weeks: 0, level: "expert", price: 1.5 }); eq(bad.json.error.details.map((d) => d.field), ["code", "title", "weeks", "level", "price"], "every invalid field"); eq(bad.json.error.details[0].message, "must look like BE-101", "the code's message");` },
            { label: "PATCH uses the update schema", check: `eq((await patch("/courses/2", { price: 90000, code: "ZZ-999" })).json, { id: 2, code: "DB-101", title: "Relational Databases", weeks: 16, level: "beginner", price: 90000 }, "price changed, code kept"); eq((await patch("/courses/2", { level: "guru" })).json.error.details.map((d) => d.field), ["level"], "an invalid level");` },
            { label: "zod replaced validateCourse", check: `const r = file("src/routes/courses.routes.js"); lacks(r, "validateCourse", "delete the hand-written validateCourse"); eq((r.match(/validate\\(/g) || []).length, 2, "use validate(…) on POST and PATCH"); has(file("src/schemas/course.schema.js"), "zod", "the schemas use zod");` },
          ],
          hint: "The schemas are Lesson 49's. With validate in front, the POST handler only checks for a duplicate code and stores { id, ...req.body }; PATCH does Object.assign(course, req.body).",
          successMessage: "The router lost half its lines and every rule lives in one schema file. Week 8 derives TypeScript types from the same schemas.",
        },
      },
      {
        id: "a-be-ex-errors",
        title: "Exercise: implement consistent error responses",
        explain:
          "The last step makes errors uniform. Over time the router's error responses drifted into five different shapes, and a new report endpoint crashes into Express's HTML error page. Add src/errors.js (AppError), a notFound middleware and an errorHandler middleware, make validate pass its error on with next(), and let the routes throw.",
        nodeLab: {
          task:
            "Make every error { error: { code, message, details? } }. Create src/errors.js (AppError, as in Lesson 48), src/middleware/notFound.js (export function notFound: next(new AppError(404, \"ROUTE_NOT_FOUND\", \"No route for <METHOD> <path>\"))) and src/middleware/errorHandler.js (export function errorHandler: AppError → its response; invalid JSON → 400 INVALID_JSON; anything else → logged with console.error and answered 500 INTERNAL_ERROR \"Something went wrong\"). validate.js calls next(new AppError(…)) instead of answering; the routes throw AppError (404 COURSE_NOT_FOUND, 409 DUPLICATE_CODE); app.js registers notFound and errorHandler last.",
          files: { "package.json": PKG_SRC, "src/data.js": COURSES_DATA, "src/server.js": SRC_SERVER, "src/app.js": APP_C, "src/middleware/requestId.js": REQUEST_ID, "src/middleware/logger.js": JSON_LOGGER, "src/schemas/course.schema.js": COURSE_SCHEMA, "src/middleware/validate.js": VALIDATE_DIRECT, "src/routes/courses.routes.js": ROUTES_DRIFTED, "src/errors.js": "", "src/middleware/notFound.js": "", "src/middleware/errorHandler.js": "" },
          readOnly: ["package.json", "src/data.js", "src/server.js", "src/middleware/requestId.js", "src/middleware/logger.js", "src/schemas/course.schema.js"],
          open: "src/routes/courses.routes.js",
          solution: { "src/app.js": APP_E, "src/middleware/validate.js": VALIDATE, "src/routes/courses.routes.js": ROUTES_APPERROR, "src/errors.js": ERRORS, "src/middleware/notFound.js": NOT_FOUND_MW, "src/middleware/errorHandler.js": ERROR_HANDLER },
          requests: [
            { label: "GET /courses/99", method: "GET", path: "/courses/99" },
            { label: "PATCH /courses/99", method: "PATCH", path: "/courses/99", body: { weeks: 3 } },
            { label: "POST duplicate", method: "POST", path: "/courses", body: { code: "BE-101", title: "Copy", weeks: 4, level: "beginner", price: 0 } },
            { label: "GET /courses/1/report", method: "GET", path: "/courses/1/report" },
            { label: "POST invalid JSON", method: "POST", path: "/courses", body: "{oops", headers: { "Content-Type": "application/json" } },
          ],
          tests: [
            ...CATALOGUE_BEHAVES,
            { label: "Every missing course answers COURSE_NOT_FOUND", check: `const want = { error: { code: "COURSE_NOT_FOUND", message: "Course 99 does not exist" } }; for (const [m, p] of [["GET", "/courses/99"], ["PATCH", "/courses/99"], ["DELETE", "/courses/99"], ["GET", "/courses/99/report"]]) { const r = await request(m, p, m === "PATCH" ? { json: { weeks: 3 } } : {}); eq([r.status, r.json], [404, want], m + " " + p); }` },
            { label: "Duplicates, invalid JSON and unknown routes use the format", check: `const d = await post("/courses", { code: "BE-101", title: "Copy", weeks: 4, level: "beginner", price: 0 }); eq([d.status, d.json], [409, { error: { code: "DUPLICATE_CODE", message: "A course with code BE-101 already exists" } }], "a duplicate code"); const j = await request("POST", "/courses", { body: "{oops", headers: { "Content-Type": "application/json" } }); eq([j.status, j.json.error.code], [400, "INVALID_JSON"], "invalid JSON"); const n = await request("PUT", "/teachers/1"); eq(n.json, { error: { code: "ROUTE_NOT_FOUND", message: "No route for PUT /teachers/1" } }, "an unknown route");` },
            { label: "A crash answers a generic 500 and is logged", check: `const r = await get("/courses/1/report"); eq([r.status, r.json], [500, { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } }], "the report"); lacks(r.text, "10.0.4.12", "no internals in the response"); has(output(), "report service unreachable", "the real error is logged"); has(r.headers["content-type"], "application/json", "JSON, not an HTML error page");` },
            { label: "Errors flow through the error handler", check: `const v = file("src/middleware/validate.js"); has(v, "next(", "validate should pass the error on with next(new AppError(…))"); lacks(v, "res.status(", "validate should not answer the error itself"); assert(!/res\\.(status\\((4|5)\\d\\d\\)|sendStatus)/.test(file("src/routes/courses.routes.js")), "the routes should throw AppError instead of answering errors");` },
          ],
          hint: "Lesson 48's error handler and Lesson 50's catch-all, moved into src/middleware. A findCourse(id) helper in the router that throws COURSE_NOT_FOUND removes four different 404s at once.",
          successMessage: "Every error, from any layer, in one format, and every crash logged with its request id. This is the skeleton every API in the rest of the course is built on.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 7.P · DELIVERABLE: A MODULAR EXPRESS API
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l53-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["7.P"],
    title: "Deliverable: A Modular Express API",
    subtitle: "Proving the structure by adding to it",
    estimatedMinutes: 90,
    intro: "Good structure shows when you add something. The finished course API (layered as in Lesson 51, with all the middleware from the exercises) gets a second resource, instructors, written the same way and reusing every middleware.",
    atoms: [
      {
        id: "a-be-instructors",
        title: "Adding a resource to a modular API",
        explain:
          "A new resource touches the same layers in the same order: a schema (what valid input is), a service (the data and the rules), a controller (HTTP in and out), a router (paths to controllers, with validate in front), and one app.use line. Nothing in the middleware changes: the request id, the logs, the validation format, the 404s and the error handler work for instructors the moment the router is mounted.",
        nodeLab: {
          task:
            "Add /instructors. GET /instructors lists them ({ data, meta: { total } }); GET /instructors/:id answers one or 404 INSTRUCTOR_NOT_FOUND \"Instructor <id> does not exist\"; POST /instructors creates one (201, Location) from { name (trimmed, 2 to 80 characters), email (a valid email), courseIds (an array of whole numbers, default []) }: invalid input is 400 VALIDATION_FAILED with details, an email already used is 409 DUPLICATE_EMAIL, and a course id that does not exist is 400 UNKNOWN_COURSE \"Course <id> does not exist\". Write it in layers: src/schemas/instructor.schema.js, src/services/instructors.service.js, src/controllers/instructors.controller.js, src/routes/instructors.routes.js, mounted in src/app.js.",
          files: { ...LAYERED, "src/schemas/instructor.schema.js": "", "src/services/instructors.service.js": "", "src/controllers/instructors.controller.js": "", "src/routes/instructors.routes.js": "" },
          readOnly: ["package.json", "src/data.js", "src/server.js", "src/errors.js", "src/middleware/requestId.js", "src/middleware/logger.js", "src/middleware/validate.js", "src/middleware/notFound.js", "src/middleware/errorHandler.js"],
          open: "src/routes/instructors.routes.js",
          solution: {
            "src/app.js": APP_E.replace(
              `import { coursesRouter } from "./routes/courses.routes.js";\n`,
              `import { coursesRouter } from "./routes/courses.routes.js";\nimport { instructorsRouter } from "./routes/instructors.routes.js";\n`
            ).replace(`app.use("/courses", coursesRouter);\n`, `app.use("/courses", coursesRouter);\napp.use("/instructors", instructorsRouter);\n`),
            "src/schemas/instructor.schema.js": `import { z } from "zod";

export const createInstructorSchema = z.object({
  name: z.string().trim().min(2, "must be 2 to 80 characters").max(80, "must be 2 to 80 characters"),
  email: z.email("must be a valid email"),
  courseIds: z.array(z.int("must be whole numbers"), "must be a list of course ids").default([]),
});
`,
            "src/services/instructors.service.js": `import { courses, instructors } from "../data.js";
import { AppError } from "../errors.js";

export function listInstructors() {
  return instructors;
}

export function getInstructor(id) {
  const instructor = instructors.find((i) => i.id === Number(id));
  if (!instructor) throw new AppError(404, "INSTRUCTOR_NOT_FOUND", \`Instructor \${id} does not exist\`);
  return instructor;
}

export function createInstructor({ name, email, courseIds }) {
  if (instructors.some((i) => i.email.toLowerCase() === email.toLowerCase())) {
    throw new AppError(409, "DUPLICATE_EMAIL", \`An instructor with email \${email} already exists\`);
  }
  const missing = courseIds.find((id) => !courses.some((c) => c.id === id));
  if (missing !== undefined) throw new AppError(400, "UNKNOWN_COURSE", \`Course \${missing} does not exist\`);
  const instructor = { id: Math.max(0, ...instructors.map((i) => i.id)) + 1, name, email, courseIds };
  instructors.push(instructor);
  return instructor;
}
`,
            "src/controllers/instructors.controller.js": `import * as service from "../services/instructors.service.js";

export function list(req, res) {
  const data = service.listInstructors();
  res.json({ data, meta: { total: data.length } });
}

export function show(req, res) {
  res.json(service.getInstructor(req.params.id));
}

export function create(req, res) {
  const instructor = service.createInstructor(req.body);
  res.location(\`/instructors/\${instructor.id}\`).status(201).json(instructor);
}
`,
            "src/routes/instructors.routes.js": `import { Router } from "express";
import * as controller from "../controllers/instructors.controller.js";
import { validate } from "../middleware/validate.js";
import { createInstructorSchema } from "../schemas/instructor.schema.js";

export const instructorsRouter = Router();

instructorsRouter.get("/", controller.list);
instructorsRouter.get("/:id", controller.show);
instructorsRouter.post("/", validate(createInstructorSchema), controller.create);
`,
          },
          requests: [
            { label: "GET /instructors", method: "GET", path: "/instructors" },
            { label: "POST /instructors", method: "POST", path: "/instructors", body: { name: " Amaka Okafor ", email: "amaka@academy.example", courseIds: [4, 5] } },
            { label: "POST invalid", method: "POST", path: "/instructors", body: { name: "A", email: "nope", courseIds: ["x"] } },
            { label: "POST unknown course", method: "POST", path: "/instructors", body: { name: "Bola Ade", email: "bola@academy.example", courseIds: [42] } },
            { label: "GET /instructors/9", method: "GET", path: "/instructors/9" },
          ],
          tests: [
            { label: "GET /instructors and GET /instructors/:id", check: `const l = await get("/instructors"); eq(l.json.meta, { total: 2 }, "meta"); eq(l.json.data[0].name, "Ngozi Eze", "the first instructor"); eq((await get("/instructors/2")).json.email, "tunde@academy.example", "GET /instructors/2"); const n = await get("/instructors/9"); eq([n.status, n.json], [404, { error: { code: "INSTRUCTOR_NOT_FOUND", message: "Instructor 9 does not exist" } }], "GET /instructors/9");` },
            { label: "POST creates a cleaned instructor (201, Location)", check: `const r = await post("/instructors", { name: " Amaka Okafor ", email: "amaka@academy.example", courseIds: [4, 5], admin: true }); eq(r.status, 201, "status"); eq(r.headers.location, "/instructors/3", "Location"); eq(r.json, { id: 3, name: "Amaka Okafor", email: "amaka@academy.example", courseIds: [4, 5] }, "body"); eq((await post("/instructors", { name: "Kemi Lawal", email: "kemi@academy.example" })).json.courseIds, [], "courseIds defaults to []");` },
            { label: "Validation, duplicates and unknown courses", check: `const v = await post("/instructors", { name: "A", email: "nope", courseIds: ["x"] }); eq(v.status, 400, "invalid input"); eq(v.json.error.code, "VALIDATION_FAILED", "code"); eq([...new Set(v.json.error.details.map((d) => d.field.split(".")[0]))], ["name", "email", "courseIds"], "details for each field"); const d = await post("/instructors", { name: "Ngozi Again", email: "NGOZI@academy.example" }); eq([d.status, d.json.error.code], [409, "DUPLICATE_EMAIL"], "an email already used (in any case)"); const u = await post("/instructors", { name: "Bola Ade", email: "bola@academy.example", courseIds: [1, 42] }); eq([u.status, u.json], [400, { error: { code: "UNKNOWN_COURSE", message: "Course 42 does not exist" } }], "an unknown course id");` },
            { label: "The shared middleware covers instructors", check: `const r = await get("/instructors/1"); const id = r.headers["x-request-id"]; assert(id, "X-Request-Id on /instructors"); ${LOG_LINES} assert(logs.some((l) => l.requestId === id && l.path === "/instructors/1" && l.status === 200), "a JSON log line for GET /instructors/1"); eq((await request("DELETE", "/instructors/1")).json.error.code, "ROUTE_NOT_FOUND", "an unsupported method falls through to the 404 handler"); eq((await get("/courses/1")).json.code, "BE-101", "courses still work");` },
            { label: "Written in layers", check: `for (const f of ["src/schemas/instructor.schema.js", "src/services/instructors.service.js", "src/controllers/instructors.controller.js", "src/routes/instructors.routes.js"]) assert((file(f) || "").trim(), f + " is empty"); const s = file("src/services/instructors.service.js").replace(/\\/\\/[^\\n]*/g, ""); assert(!/\\b(req|res)\\b/.test(s), "the service should not use req or res"); lacks(file("src/routes/instructors.routes.js"), "data.js", "the router should not touch the data"); has(file("src/routes/instructors.routes.js"), "validate(", "validate the POST body with validate(schema)");` },
          ],
          hint: "Copy the courses files as a pattern. The service checks the email (compare lowercased) and the course ids against courses from data.js, throwing AppError; the schema handles the rest.",
          successMessage: "A whole resource, and not one line of middleware written for it: that is what reusable middleware and clean layers buy you.",
        },
      },
    ],
    task: {
      title: "Week 7 deliverable: a modular Express API",
      intro: "Build the modular course API on your computer.",
      prompts: [
        "Recreate the project layout from Lesson 52 in your repository (npm install express zod), with courses and instructors.",
        "Run it and call every endpoint with curl -i, including errors: check that each response has an X-Request-Id and each request a JSON log line.",
        "Send a request with a deliberately broken JSON body and one to an unknown route: both must answer in the error format.",
        "Update API.md from Week 6 with the instructors endpoints and the INVALID_JSON, ROUTE_NOT_FOUND and INTERNAL_ERROR codes.",
        "Checkpoint: your API logs every request with an id, validates every input with a schema and answers every error, including unknown routes, in one consistent format.",
      ],
      closing: "Next: Week 8, TypeScript in the backend: typed requests, DTOs, repositories, OpenAPI, uploads, rate limits and webhooks.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
