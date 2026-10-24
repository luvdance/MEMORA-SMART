/**
 * BACKEND ENGINEERING · WEEK 8 · API DESIGN AND TYPESCRIPT BACKEND PATTERNS
 *
 * Curriculum 8.1 – 8.P. Typed requests and responses; DTOs; controllers,
 * services and repositories; configuration; contracts and response
 * schemas; OpenAPI; file uploads; rate limits and quotas; external APIs
 * with timeouts; webhook signatures; four exercises (a payment provider
 * integration, its webhook, its OpenAPI document, a controller refactor);
 * and a typed, documented API that survives a failing external service.
 *
 * TypeScript labs are type-checked by the real compiler (npx tsc --noEmit)
 * and run by Node's type stripping (node src/server.ts), as in Week 3.
 *
 * Two lab services stand in for real providers (lab.services):
 *   https://api.rates.example      exchange rates (Bearer rates-key-123)
 *   https://api.payments.example   a card-payment provider (Bearer sk_test_academy)
 * Checks set their app.locals (failNext, delayMs, badData) to make them
 * slow or broken.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { pkg } from "./be-helpers.js";
import { NO_TYPE_ERRORS, TSCONFIG } from "./be-w3-async-ts.js";
import { COURSES_DATA } from "./be-w6-http-rest.js";

export const SECTION_ID = "be-s8-api-design";
const MODULE = "be-w8-api-design";

const PKG = (deps = ["express"]) => pkg({ name: "course-api", scripts: { start: "node server.js" }, deps });
const TS_PKG = (deps = ["express", "zod"], start = "node src/server.ts") =>
  pkg({ name: "course-api", scripts: { start, typecheck: "tsc --noEmit" }, deps, dev: ["typescript", "@types/node", "@types/express"] });

const LISTEN = `app.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`;

/** No `any` anywhere in the project's TypeScript. */
const NO_ANY = (files) => ({
  label: "No any",
  check: `for (const f of ${JSON.stringify(files)}) assert(!usesAny(file(f) || ""), f + " still uses the type any");`,
});

/* ── The lab services ─────────────────────────────────────────────────── */

export const RATES_API = "https://api.rates.example";
export const PAYMENTS_API = "https://api.payments.example";

const RATES_SERVICE = `const express = require("express");
const app = express();
app.locals.failNext = 0;
app.locals.delayMs = 0;
app.locals.badData = false;

app.use(async (req, res, next) => {
  if (app.locals.delayMs) await new Promise((resolve) => setTimeout(resolve, app.locals.delayMs));
  if (app.locals.failNext > 0) {
    app.locals.failNext -= 1;
    return res.status(503).json({ error: "Service temporarily unavailable" });
  }
  if (req.get("authorization") !== "Bearer rates-key-123") return res.status(401).json({ error: "Invalid API key" });
  next();
});

app.get("/v1/rates", (req, res) => {
  if (req.query.base !== "NGN") return res.status(400).json({ error: "Only base=NGN is supported" });
  if (app.locals.badData) return res.json({ base: "NGN", rates: { USD: "cheap" } });
  res.json({ base: "NGN", rates: { USD: 0.00066, GBP: 0.00052, EUR: 0.00061 }, updatedAt: "2026-10-23T08:00:00Z" });
});

module.exports = app;
`;

const PAYMENTS_SERVICE = `const express = require("express");
const app = express();
app.use(express.json());
app.locals.failNext = 0;
app.locals.delayMs = 0;
app.locals.checkouts = [];

app.use(async (req, res, next) => {
  if (app.locals.delayMs) await new Promise((resolve) => setTimeout(resolve, app.locals.delayMs));
  if (app.locals.failNext > 0) {
    app.locals.failNext -= 1;
    return res.status(500).json({ error: "Internal error" });
  }
  if (req.get("authorization") !== "Bearer sk_test_academy") return res.status(401).json({ error: "Invalid secret key" });
  next();
});

app.post("/v1/checkouts", (req, res) => {
  const key = req.get("idempotency-key");
  const existing = key && app.locals.checkouts.find((c) => c.idempotencyKey === key);
  if (existing) return res.status(200).json(existing.checkout);
  const { amount, currency, reference } = req.body ?? {};
  if (!Number.isInteger(amount) || amount <= 0 || currency !== "NGN" || !reference) {
    return res.status(400).json({ error: "amount (in kobo), currency NGN and reference are required" });
  }
  const id = \`chk_\${app.locals.checkouts.length + 1}\`;
  const checkout = { id, reference, amount, currency, status: "open", url: \`https://pay.payments.example/c/\${id}\` };
  app.locals.checkouts.push({ idempotencyKey: key, checkout });
  res.status(201).json(checkout);
});

module.exports = app;
`;

const RATES_ENV = { RATES_API_URL: RATES_API, RATES_API_KEY: "rates-key-123" };
const PAYMENTS_ENV = { PAYMENTS_API_URL: PAYMENTS_API, PAYMENTS_SECRET_KEY: "sk_test_academy", PAYMENTS_WEBHOOK_SECRET: "whsec_academy" };

/** Signs a webhook body as the payment provider does (in a check). */
const SIGN = `const { createHmac } = await load("node:crypto"); const sign = (body, t = Math.floor(now() / 1000), secret = "whsec_academy") => "t=" + t + ",v1=" + createHmac("sha256", secret).update(t + "." + body).digest("hex");`;

/* ── TypeScript course data ───────────────────────────────────────────── */

const TYPES_TS = `export type Level = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: number;
  code: string;
  title: string;
  weeks: number;
  level: Level;
  price: number;
}
`;

const DATA_TS = `import type { Course } from "./types.ts";

${COURSES_DATA.replace("export const courses = [", "export const courses: Course[] = [")}`;

const ERRORS_TS = `export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}
`;

const ERRORS_JS = `export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}
`;

const ERROR_HANDLER_JS = `app.use((err, req, res, next) => {
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: { code: "INVALID_JSON", message: "The request body is not valid JSON" } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});
`;

const ERROR_HANDLER_TS = `app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});
`;

/* ── Configuration (8.4), reused by the deliverable ───────────────────── */

const CONFIG_TS = `import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  RATES_API_URL: z.url(),
  RATES_API_KEY: z.string().min(1),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(2000),
});

export type Config = Readonly<z.infer<typeof EnvSchema>>;

/** Reads and checks the environment once, at startup: a bad value stops the server with every problem listed. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const result = EnvSchema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => \`  \${issue.path.join(".")}: \${issue.message}\`).join("\\n");
    throw new Error(\`Invalid configuration:\\n\${problems}\`);
  }
  return Object.freeze(result.data);
}
`;

/* ── The webhook signature (8.10), reused by 8.12 ─────────────────────── */

const SIGNATURE_JS = `import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Checks a "t=<unix seconds>,v1=<hex HMAC-SHA256 of '<t>.<raw body>'>" header.
 * False for a missing or malformed header, a wrong signature, or a timestamp
 * more than toleranceSeconds away from now (a replayed old request).
 */
export function verifySignature(rawBody, header, secret, { toleranceSeconds = 300, now = Date.now() } = {}) {
  const parts = Object.fromEntries(
    String(header ?? "")
      .split(",")
      .map((part) => part.trim().split("="))
  );
  const timestamp = Number(parts.t);
  if (!Number.isInteger(timestamp) || !/^[0-9a-f]{64}$/.test(parts.v1 ?? "")) return false;
  if (Math.abs(now / 1000 - timestamp) > toleranceSeconds) return false;
  const expected = createHmac("sha256", secret).update(\`\${timestamp}.\${rawBody}\`).digest();
  return timingSafeEqual(expected, Buffer.from(parts.v1, "hex"));
}
`;

/* ── The enrollments API (8.11 – 8.13) ────────────────────────────────── */

const ENROLLMENTS_DATA = `${COURSES_DATA}
export const enrollments = [
  { id: 1, courseId: 2, email: "ngozi@example.com", status: "paid", reference: "enr_1", checkoutId: "chk_old_1" },
];
`;

const ENROLLMENTS_BASE = `import express from "express";
import { z } from "zod";
import { courses, enrollments } from "./data.js";
import { AppError } from "./errors.js";

const app = express();

const createEnrollmentSchema = z.object({
  courseId: z.int("must be a whole number"),
  email: z.email("must be a valid email"),
});

app.get("/enrollments/:id", (req, res) => {
  const enrollment = enrollments.find((e) => e.id === Number(req.params.id));
  if (!enrollment) throw new AppError(404, "ENROLLMENT_NOT_FOUND", \`Enrollment \${req.params.id} does not exist\`);
  res.json({ data: enrollment });
});
`;

const CREATE_CHECKOUT = `const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Asks the provider for a checkout page. Retries once on a 5xx: the Idempotency-Key makes that safe. */
async function createCheckout(enrollment, amountKobo) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    let response;
    try {
      response = await fetch(\`\${process.env.PAYMENTS_API_URL}/v1/checkouts\`, {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${process.env.PAYMENTS_SECRET_KEY}\`,
          "Content-Type": "application/json",
          "Idempotency-Key": enrollment.reference,
        },
        body: JSON.stringify({ amount: amountKobo, currency: "NGN", reference: enrollment.reference }),
        signal: AbortSignal.timeout(3000),
      });
    } catch (err) {
      if (err.name === "TimeoutError") throw new AppError(504, "PAYMENT_PROVIDER_TIMEOUT", "The payment provider did not answer in time");
      throw new AppError(502, "PAYMENT_PROVIDER_ERROR", "The payment provider could not be reached");
    }
    if (response.ok) return response.json();
    if (response.status < 500 || attempt === 2) {
      console.error(\`[payments] HTTP \${response.status} for \${enrollment.reference}\`);
      throw new AppError(502, "PAYMENT_PROVIDER_ERROR", "The payment provider refused the checkout");
    }
    await sleep(200);
  }
}

app.post("/enrollments", express.json(), async (req, res) => {
  const parsed = createEnrollmentSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, "VALIDATION_FAILED", "Invalid request body");
  const course = courses.find((c) => c.id === parsed.data.courseId);
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${parsed.data.courseId} does not exist\`);
  const id = Math.max(0, ...enrollments.map((e) => e.id)) + 1;
  const enrollment = { id, courseId: course.id, email: parsed.data.email, status: "pending", reference: \`enr_\${id}\`, checkoutId: null };
  enrollments.push(enrollment);
  try {
    const checkout = await createCheckout(enrollment, course.price * 100);
    enrollment.checkoutId = checkout.id;
    res.status(201).json({ data: { id, status: enrollment.status, checkoutUrl: checkout.url } });
  } catch (err) {
    enrollment.status = "failed";
    throw err;
  }
});
`;

const WEBHOOK_ROUTE = `const processedEvents = new Set();
const NEXT_STATUS = { "checkout.completed": "paid", "checkout.expired": "expired" };

// express.raw: the signature covers the exact bytes sent, so they are verified before any JSON parsing.
app.post("/webhooks/payments", express.raw({ type: "application/json" }), (req, res) => {
  const raw = req.body.toString("utf8");
  if (!verifySignature(raw, req.get("payments-signature"), process.env.PAYMENTS_WEBHOOK_SECRET)) {
    throw new AppError(400, "INVALID_SIGNATURE", "The webhook signature is not valid");
  }
  const event = JSON.parse(raw);
  if (processedEvents.has(event.id)) return res.json({ received: true, duplicate: true });
  processedEvents.add(event.id);
  const status = NEXT_STATUS[event.type];
  if (!status) return res.json({ received: true, ignored: true });
  const enrollment = enrollments.find((e) => e.reference === event.data?.reference);
  if (!enrollment) {
    console.error(\`[webhook] \${event.type} for unknown reference \${event.data?.reference}\`);
    return res.json({ received: true, ignored: true });
  }
  if (enrollment.status === "pending") enrollment.status = status;
  res.json({ received: true });
});
`;

const ENROLLMENTS_OPENAPI_BASE = `openapi: 3.1.0
info:
  title: Course API
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /courses/{id}:
    get:
      summary: One course
      parameters:
        - $ref: "#/components/parameters/Id"
      responses:
        "200":
          description: The course
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    $ref: "#/components/schemas/Course"
        "404":
          $ref: "#/components/responses/Error"
components:
  parameters:
    Id:
      name: id
      in: path
      required: true
      schema:
        type: integer
  responses:
    Error:
      description: An error, in the API's error format
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
  schemas:
    Course:
      type: object
      required: [id, code, title, weeks, level, price]
      properties:
        id: { type: integer }
        code: { type: string, example: BE-101 }
        title: { type: string }
        weeks: { type: integer, minimum: 1, maximum: 52 }
        level: { type: string, enum: [beginner, intermediate, advanced] }
        price: { type: integer, description: Price in naira }
    Error:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string, example: COURSE_NOT_FOUND }
            message: { type: string }
`;

const ENROLLMENTS_OPENAPI = ENROLLMENTS_OPENAPI_BASE.replace(
  "components:\n  parameters:",
  `  /enrollments:
    post:
      summary: Enroll in a course and get a checkout page
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateEnrollment"
      responses:
        "201":
          description: The enrollment, pending payment, with the page where the student pays
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    type: object
                    required: [id, status, checkoutUrl]
                    properties:
                      id: { type: integer }
                      status: { type: string, enum: [pending] }
                      checkoutUrl: { type: string, format: uri }
        "400":
          $ref: "#/components/responses/Error"
        "404":
          $ref: "#/components/responses/Error"
        "502":
          $ref: "#/components/responses/Error"
        "504":
          $ref: "#/components/responses/Error"
  /enrollments/{id}:
    get:
      summary: One enrollment
      parameters:
        - $ref: "#/components/parameters/Id"
      responses:
        "200":
          description: The enrollment
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    $ref: "#/components/schemas/Enrollment"
        "404":
          $ref: "#/components/responses/Error"
  /webhooks/payments:
    post:
      summary: Payment events from the payment provider
      description: Signed with HMAC-SHA256. Events are processed once; unknown types are acknowledged and ignored.
      parameters:
        - name: Payments-Signature
          in: header
          required: true
          description: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PaymentEvent"
      responses:
        "200":
          description: The event was received
        "400":
          $ref: "#/components/responses/Error"
components:
  parameters:`
).replace(
  "    Error:\n      type: object",
  `    CreateEnrollment:
      type: object
      required: [courseId, email]
      properties:
        courseId: { type: integer }
        email: { type: string, format: email }
    Enrollment:
      type: object
      required: [id, courseId, email, status, reference]
      properties:
        id: { type: integer }
        courseId: { type: integer }
        email: { type: string, format: email }
        status: { type: string, enum: [pending, paid, expired, failed] }
        reference: { type: string, example: enr_2 }
        checkoutId: { type: [string, "null"] }
    PaymentEvent:
      type: object
      required: [id, type, data]
      properties:
        id: { type: string, example: evt_1 }
        type: { type: string, example: checkout.completed }
        data:
          type: object
          properties:
            reference: { type: string }
    Error:
      type: object`
);

/* ── The deliverable's price API (8.P) ────────────────────────────────── */

const RATES_TS = `import { z } from "zod";
import type { Config } from "./config.ts";

const RatesSchema = z.object({
  base: z.literal("NGN"),
  rates: z.record(z.string(), z.number().positive()),
});

export interface RatesResult {
  rates: Record<string, number>;
  stale: boolean;
}

export class RatesUnavailableError extends Error {}

const FRESH_MS = 10 * 60 * 1000;
const USABLE_MS = 60 * 60 * 1000;
let cache: { rates: Record<string, number>; at: number } | null = null;

export async function getRates(config: Config): Promise<RatesResult> {
  if (cache && Date.now() - cache.at < FRESH_MS) return { rates: cache.rates, stale: false };
  try {
    const response = await fetch(\`\${config.RATES_API_URL}/v1/rates?base=NGN\`, {
      headers: { Authorization: \`Bearer \${config.RATES_API_KEY}\` },
      signal: AbortSignal.timeout(config.REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(\`rates API answered HTTP \${response.status}\`);
    const body = RatesSchema.parse(await response.json());
    cache = { rates: body.rates, at: Date.now() };
    return { rates: body.rates, stale: false };
  } catch (err) {
    console.error(\`[rates] \${err instanceof Error ? err.message : String(err)}\`);
    if (cache && Date.now() - cache.at < USABLE_MS) return { rates: cache.rates, stale: true };
    throw new RatesUnavailableError("Exchange rates are unavailable");
  }
}
`;

const PRICE_APP_TS = `import { readFileSync } from "node:fs";
import express, { type NextFunction, type Request, type Response } from "express";
import YAML from "yaml";
import type { Config } from "./config.ts";
import { courses } from "./data.ts";
import { AppError } from "./errors.ts";
import { getRates, RatesUnavailableError } from "./rates.ts";

const CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;
type Currency = (typeof CURRENCIES)[number];

export interface Price {
  code: string;
  currency: Currency;
  amount: number;
  stale: boolean;
}

const isCurrency = (value: string): value is Currency => (CURRENCIES as readonly string[]).includes(value);

export function createApp(config: Config) {
  const app = express();
  const openapi: unknown = YAML.parse(readFileSync("openapi.yaml", "utf8"));

  app.get("/openapi.json", (req: Request, res: Response) => {
    res.json(openapi);
  });

  app.get("/courses/:id/price", async (req: Request<{ id: string }, { data: Price }, unknown, { currency?: string }>, res: Response<{ data: Price }>) => {
    const course = courses.find((c) => c.id === Number(req.params.id));
    if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
    const currency = String(req.query.currency ?? "NGN").toUpperCase();
    if (!isCurrency(currency)) throw new AppError(400, "UNSUPPORTED_CURRENCY", \`Currency \${currency} is not supported\`);
    if (currency === "NGN") {
      res.json({ data: { code: course.code, currency, amount: course.price, stale: false } });
      return;
    }
    try {
      const { rates, stale } = await getRates(config);
      const rate = rates[currency];
      if (rate === undefined) throw new RatesUnavailableError(\`No rate for \${currency}\`);
      res.json({ data: { code: course.code, currency, amount: Math.round(course.price * rate * 100) / 100, stale } });
    } catch (err) {
      if (err instanceof RatesUnavailableError) throw new AppError(503, "RATES_UNAVAILABLE", "Prices in other currencies are unavailable right now");
      throw err;
    }
  });

${ERROR_HANDLER_TS.replace(/^/gm, "  ").replace(/^  $/gm, "")}
  return app;
}
`;

const PRICE_SERVER_TS = `import { createApp } from "./app.ts";
import { loadConfig } from "./config.ts";

const config = loadConfig();
createApp(config).listen(config.PORT, () => console.log(\`Course API on http://localhost:\${config.PORT}\`));
`;

const PRICE_OPENAPI = `openapi: 3.1.0
info:
  title: Course Price API
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /courses/{id}/price:
    get:
      summary: The price of a course in a currency
      description: Prices in other currencies use the exchange-rate service. If it is down, a rate up to an hour old is used and stale is true; older than that, the answer is 503.
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
        - name: currency
          in: query
          required: false
          schema:
            type: string
            enum: [NGN, USD, GBP, EUR]
            default: NGN
      responses:
        "200":
          description: The price
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    $ref: "#/components/schemas/Price"
        "400":
          $ref: "#/components/responses/Error"
        "404":
          $ref: "#/components/responses/Error"
        "503":
          $ref: "#/components/responses/Error"
components:
  responses:
    Error:
      description: An error, in the API's error format
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
  schemas:
    Price:
      type: object
      required: [code, currency, amount, stale]
      properties:
        code: { type: string, example: BE-101 }
        currency: { type: string, enum: [NGN, USD, GBP, EUR] }
        amount: { type: number, example: 79.2 }
        stale: { type: boolean, description: True when the exchange rate is older than ten minutes }
    Error:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string, example: RATES_UNAVAILABLE }
            message: { type: string }
`;

/** Loads openapi.yaml in a check. */
const DOC = `const YAML = await load("yaml"); let doc; try { doc = YAML.parse(file("openapi.yaml")); } catch (e) { fail("openapi.yaml is not valid YAML: " + e.message); } assert(doc && typeof doc === "object", "openapi.yaml is empty");`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 8.1 – 8.2 · TYPED REQUESTS, RESPONSES AND DTOS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l54-typed-api",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2"],
    title: "Typed Requests, Responses and DTOs",
    subtitle: "Letting the compiler check what goes in and out",
    estimatedMinutes: 65,
    intro:
      "From this week the API is written in TypeScript, as most new Node backends are. Week 3 typed functions and data; here the types reach the edges of the API: what a request carries and what a response may contain.",
    atoms: [
      {
        id: "a-be-typed-express",
        title: "Strongly typed request and response objects",
        explain:
          "Express's types are generic: Request<Params, ResBody, ReqBody, Query> and Response<ResBody>. Request<{ id: string }> says req.params.id exists and is a string (route parameters always are); Request<…, …, …, { page?: string }> types req.query; Response<ListResponse<Course>> makes res.json() refuse a body of the wrong shape. With them, tsc catches a misspelt field in a response, a string compared to a number, or arithmetic on a query string, before a client does. Types still check nothing at runtime: body and query come from outside and need validation (zod) as well.",
        nodeLab: {
          task:
            "Run npx tsc --noEmit: the handlers use any, so tsc finds nothing, yet GET /courses/1 always answers 404 and GET /courses has bugs. Replace each any with Express's Request and Response types, using the interfaces in src/types.ts (Request<CourseParams>, Response<Course | ApiError>, Request<Record<string, never>, ListResponse<Course>, unknown, ListQuery>, Response<ListResponse<Course>>). Then fix every error tsc reports.",
          command: "npx tsc --noEmit",
          files: {
            "package.json": TS_PKG(["express"]),
            "tsconfig.json": TSCONFIG,
            "src/types.ts": `${TYPES_TS}
export interface ApiError {
  error: { code: string; message: string };
}

export interface ListResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export interface CourseParams {
  id: string;
}

export interface ListQuery {
  page?: string;
  level?: string;
}
`,
            "src/data.ts": DATA_TS,
            "src/server.ts": `import express from "express";
import { courses } from "./data.ts";

const app = express();
app.use(express.json());

app.get("/courses", (req: any, res: any) => {
  const page = req.query.page ?? 1;
  const limit = 2;
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data: data.slice((page - 1) * limit, page * limit), meta: { page, limit, totl: data.length } });
});

app.get("/courses/:id", (req: any, res: any) => {
  const course = courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  res.json(course);
});

${LISTEN}`,
          },
          readOnly: ["package.json", "tsconfig.json", "src/types.ts", "src/data.ts"],
          open: "src/server.ts",
          solution: {
            "src/server.ts": `import express, { type Request, type Response } from "express";
import { courses } from "./data.ts";
import type { ApiError, Course, CourseParams, ListQuery, ListResponse } from "./types.ts";

const app = express();
app.use(express.json());

app.get("/courses", (req: Request<Record<string, never>, ListResponse<Course>, unknown, ListQuery>, res: Response<ListResponse<Course>>) => {
  const page = Number(req.query.page ?? 1);
  const limit = 2;
  let data = courses;
  if (req.query.level) data = data.filter((c) => c.level === req.query.level);
  res.json({ data: data.slice((page - 1) * limit, page * limit), meta: { page, limit, total: data.length } });
});

app.get("/courses/:id", (req: Request<CourseParams>, res: Response<Course | ApiError>) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) {
    res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
    return;
  }
  res.json(course);
});

${LISTEN}`,
          },
          tests: [
            NO_TYPE_ERRORS,
            NO_ANY(["src/server.ts"]),
            { label: "The handlers use Express's Request and Response types", check: `const s = file("src/server.ts"); assert(/Request</.test(s) && /Response</.test(s), "type the handlers with Request<…> and Response<…>"); has(s, "ListResponse<Course>", "type the list response as ListResponse<Course>");` },
            { label: "GET /courses/1 finds the course; the list has a correct meta", check: `await run("npm start"); eq((await get("/courses/1")).json.code, "BE-101", "GET /courses/1"); const r = await get("/courses?page=2"); eq(r.json.meta, { page: 2, limit: 2, total: 6 }, "meta for page 2: page is a number and total is spelt total"); eq(r.json.data.map((c) => c.id), [3, 4], "page 2");` },
          ],
          hint: "import express, { type Request, type Response } from \"express\". Once typed, tsc points at three lines: compare c.id with Number(req.params.id), convert page with Number(…), and spell total correctly. A handler typed Response<…> should not return res.status(…): call it, then return.",
          successMessage: "Three bugs found by the compiler, none by a user. Typed responses make the shape you promise clients something tsc enforces.",
        },
      },
      {
        id: "a-be-dtos",
        title: "DTOs (Data Transfer Objects)",
        explain:
          "A DTO is the shape of data as it crosses the API boundary, which is NOT the shape you store. The stored record may hold internal fields (cost price, notes, who created it) that must never leave the server, and clients may send only some fields. So an API has input DTOs (CreateCourseDto: what a client may send, validated by a zod schema and typed with z.infer<typeof schema>) and output DTOs (CourseDto: what a client may see, produced by a mapper such as toCourseDto(record) that copies only public fields). Mapping explicitly means a new internal column never leaks by accident.",
        nodeLab: {
          task:
            "The API returns stored records as they are, leaking costPrice, internalNotes and createdBy, and POST stores whatever it is sent. In src/dto.ts write createCourseSchema (code, title, weeks, level, price), export type CreateCourseDto = z.infer<typeof createCourseSchema>, an interface CourseDto with the six public fields, and toCourseDto(record: CourseRecord): CourseDto. Use them in src/server.ts: every response is a CourseDto, and POST validates (400 VALIDATION_FAILED) then stores { ...dto, costPrice: 0, internalNotes: \"\", createdBy: \"api\" }.",
          files: {
            "package.json": TS_PKG(),
            "tsconfig.json": TSCONFIG,
            "src/records.ts": `${TYPES_TS}
/** A course as stored: the public fields plus internal ones. */
export interface CourseRecord extends Course {
  costPrice: number;
  internalNotes: string;
  createdBy: string;
}

export const records: CourseRecord[] = [
  { id: 1, code: "BE-101", title: "Backend Engineering", weeks: 24, level: "beginner", price: 120000, costPrice: 41000, internalNotes: "Flagship", createdBy: "ngozi" },
  { id: 2, code: "DB-101", title: "Relational Databases", weeks: 16, level: "beginner", price: 80000, costPrice: 23000, internalNotes: "", createdBy: "tunde" },
  { id: 3, code: "WD-201", title: "React Development", weeks: 16, level: "intermediate", price: 90000, costPrice: 30000, internalNotes: "Discount allowed", createdBy: "ngozi" },
];
`,
            "src/dto.ts": `import { z } from "zod";
import type { CourseRecord } from "./records.ts";

// createCourseSchema, CreateCourseDto, CourseDto, toCourseDto
`,
            "src/server.ts": `import express, { type Request, type Response } from "express";
import { records } from "./records.ts";

const app = express();
app.use(express.json());

app.get("/courses", (req: Request, res: Response) => {
  res.json({ data: records });
});

app.get("/courses/:id", (req: Request<{ id: string }>, res: Response) => {
  const record = records.find((r) => r.id === Number(req.params.id));
  if (!record) {
    res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
    return;
  }
  res.json({ data: record });
});

app.post("/courses", (req: Request, res: Response) => {
  const record = { id: Math.max(...records.map((r) => r.id)) + 1, ...req.body };
  records.push(record);
  res.status(201).json({ data: record });
});

${LISTEN}`,
          },
          readOnly: ["package.json", "tsconfig.json", "src/records.ts"],
          open: "src/dto.ts",
          solution: {
            "src/dto.ts": `import { z } from "zod";
import type { CourseRecord } from "./records.ts";

/** What a client may send to create a course. */
export const createCourseSchema = z.object({
  code: z.string().regex(/^[A-Z]{2,3}-\\d{3}$/, "must look like BE-101"),
  title: z.string().trim().min(3).max(100),
  weeks: z.int().min(1).max(52),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.int().min(0),
});

export type CreateCourseDto = z.infer<typeof createCourseSchema>;

/** What a client may see of a course. */
export interface CourseDto {
  id: number;
  code: string;
  title: string;
  weeks: number;
  level: CourseRecord["level"];
  price: number;
}

export function toCourseDto(record: CourseRecord): CourseDto {
  const { id, code, title, weeks, level, price } = record;
  return { id, code, title, weeks, level, price };
}
`,
            "src/server.ts": `import express, { type Request, type Response } from "express";
import { type CourseDto, createCourseSchema, type CreateCourseDto, toCourseDto } from "./dto.ts";
import { type CourseRecord, records } from "./records.ts";

const app = express();
app.use(express.json());

app.get("/courses", (req: Request, res: Response<{ data: CourseDto[] }>) => {
  res.json({ data: records.map(toCourseDto) });
});

app.get("/courses/:id", (req: Request<{ id: string }>, res: Response) => {
  const record = records.find((r) => r.id === Number(req.params.id));
  if (!record) {
    res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
    return;
  }
  res.json({ data: toCourseDto(record) });
});

app.post("/courses", (req: Request, res: Response) => {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
    res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid request body", details } });
    return;
  }
  const dto: CreateCourseDto = parsed.data;
  const record: CourseRecord = { id: Math.max(...records.map((r) => r.id)) + 1, ...dto, costPrice: 0, internalNotes: "", createdBy: "api" };
  records.push(record);
  res.status(201).json({ data: toCourseDto(record) });
});

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "GET /courses/1", method: "GET", path: "/courses/1" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000, costPrice: 1, createdBy: "hacker" } },
          ],
          tests: [
            NO_TYPE_ERRORS,
            { label: "Responses contain only the public fields", check: `const PUBLIC = ["id", "code", "title", "weeks", "level", "price"]; const list = await get("/courses"); for (const c of list.json.data) eq(Object.keys(c), PUBLIC, "GET /courses: course " + c.id); eq(Object.keys((await get("/courses/1")).json.data), PUBLIC, "GET /courses/1");` },
            { label: "POST validates, and ignores internal fields a client sends", check: `const r = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000, costPrice: 1, createdBy: "hacker" }); eq(r.status, 201, "status"); eq(r.json.data, { id: 4, code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }, "the created course, as a DTO"); const bad = await post("/courses", { code: "x" }); eq([bad.status, bad.json.error.code], [400, "VALIDATION_FAILED"], "an invalid course");` },
            { label: "The DTOs are defined in src/dto.ts", check: `const d = file("src/dto.ts"); has(d, "z.infer<typeof createCourseSchema>", "type CreateCourseDto with z.infer<typeof createCourseSchema>"); const { toCourseDto } = await load("src/dto.ts"); eq(toCourseDto({ id: 9, code: "X-100", title: "T", weeks: 1, level: "beginner", price: 5, costPrice: 1, internalNotes: "n", createdBy: "c" }), { id: 9, code: "X-100", title: "T", weeks: 1, level: "beginner", price: 5 }, "toCourseDto copies only the public fields");` },
            NO_ANY(["src/dto.ts", "src/server.ts"]),
          ],
          hint: "toCourseDto destructures the six public fields and returns a new object with them. In server.ts map every record through it before res.json.",
          successMessage: "The stored shape and the public shape are now separate: adding an internal field next month cannot leak it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 8.3 – 8.4 · REPOSITORIES, DEPENDENCIES AND CONFIGURATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l55-repositories-config",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.3", "8.4"],
    title: "Repositories, Dependencies and Configuration",
    subtitle: "Code that does not care where data or settings come from",
    estimatedMinutes: 70,
    intro: "Week 7 split routes, controllers and services. Two things still tie the service to one environment: it imports its data directly, and settings are read from process.env all over the code. This lesson removes both ties.",
    atoms: [
      {
        id: "a-be-repositories",
        title: "Controllers, services and repositories",
        explain:
          "A REPOSITORY is the only code that knows how data is stored. It exposes an interface in the language of the domain (findById, findByCode, create) and hides whether that is an array, PostgreSQL or another API. The SERVICE holds the rules and receives its repository through its constructor: DEPENDENCY INJECTION. One place, the composition root (app.ts), creates the real repository and passes it in. A test passes a fake one instead, and Week 11 passes a PostgreSQL repository, with no change to the service. (With erasableSyntaxOnly, Node's type stripping, fields are declared and assigned explicitly: no constructor(private repo) shorthand.)",
        nodeLab: {
          task:
            "CourseService imports the courses array directly. In src/repositories/course.repository.ts, export an interface CourseRepository (findAll, findById(id), findByCode(code), create(input: NewCourse), all async) and a class InMemoryCourseRepository implementing it over an array passed to its constructor. Make CourseService take a CourseRepository in its constructor and use only it, then create both in src/app.ts. Behaviour stays the same.",
          files: {
            "package.json": TS_PKG(),
            "tsconfig.json": TSCONFIG,
            "src/types.ts": `${TYPES_TS}
export type NewCourse = Omit<Course, "id">;
`,
            "src/data.ts": DATA_TS,
            "src/errors.ts": ERRORS_TS,
            "src/repositories/course.repository.ts": `import type { Course, NewCourse } from "../types.ts";

// export interface CourseRepository { … }
// export class InMemoryCourseRepository implements CourseRepository { … }
`,
            "src/services/course.service.ts": `import { courses } from "../data.ts";
import { AppError } from "../errors.ts";
import type { Course, NewCourse } from "../types.ts";

export class CourseService {
  async list(): Promise<Course[]> {
    return courses;
  }

  async get(id: number): Promise<Course> {
    const course = courses.find((c) => c.id === id);
    if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
    return course;
  }

  async create(input: NewCourse): Promise<Course> {
    if (courses.some((c) => c.code === input.code)) {
      throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${input.code} already exists\`);
    }
    const course = { id: Math.max(0, ...courses.map((c) => c.id)) + 1, ...input };
    courses.push(course);
    return course;
  }
}
`,
            "src/app.ts": `import express, { type NextFunction, type Request, type Response } from "express";
import { AppError } from "./errors.ts";
import { CourseService } from "./services/course.service.ts";
import type { NewCourse } from "./types.ts";

const service = new CourseService();

export const app = express();
app.use(express.json());

app.get("/courses", async (req: Request, res: Response) => {
  res.json({ data: await service.list() });
});

app.get("/courses/:id", async (req: Request<{ id: string }>, res: Response) => {
  res.json({ data: await service.get(Number(req.params.id)) });
});

app.post("/courses", async (req: Request<Record<string, never>, unknown, NewCourse>, res: Response) => {
  res.status(201).json({ data: await service.create(req.body) });
});

${ERROR_HANDLER_TS}`,
            "src/server.ts": `import { app } from "./app.ts";\n\n${LISTEN}`,
          },
          readOnly: ["package.json", "tsconfig.json", "src/types.ts", "src/data.ts", "src/errors.ts", "src/server.ts"],
          open: "src/repositories/course.repository.ts",
          solution: {
            "src/repositories/course.repository.ts": `import type { Course, NewCourse } from "../types.ts";

export interface CourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | undefined>;
  findByCode(code: string): Promise<Course | undefined>;
  create(input: NewCourse): Promise<Course>;
}

export class InMemoryCourseRepository implements CourseRepository {
  private readonly courses: Course[];

  constructor(courses: Course[]) {
    this.courses = courses;
  }

  async findAll(): Promise<Course[]> {
    return this.courses;
  }

  async findById(id: number): Promise<Course | undefined> {
    return this.courses.find((c) => c.id === id);
  }

  async findByCode(code: string): Promise<Course | undefined> {
    return this.courses.find((c) => c.code === code);
  }

  async create(input: NewCourse): Promise<Course> {
    const course = { id: Math.max(0, ...this.courses.map((c) => c.id)) + 1, ...input };
    this.courses.push(course);
    return course;
  }
}
`,
            "src/services/course.service.ts": `import { AppError } from "../errors.ts";
import type { CourseRepository } from "../repositories/course.repository.ts";
import type { Course, NewCourse } from "../types.ts";

export class CourseService {
  private readonly repo: CourseRepository;

  constructor(repo: CourseRepository) {
    this.repo = repo;
  }

  list(): Promise<Course[]> {
    return this.repo.findAll();
  }

  async get(id: number): Promise<Course> {
    const course = await this.repo.findById(id);
    if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${id} does not exist\`);
    return course;
  }

  async create(input: NewCourse): Promise<Course> {
    if (await this.repo.findByCode(input.code)) {
      throw new AppError(409, "DUPLICATE_CODE", \`A course with code \${input.code} already exists\`);
    }
    return this.repo.create(input);
  }
}
`,
            "src/app.ts": `import express, { type NextFunction, type Request, type Response } from "express";
import { courses } from "./data.ts";
import { AppError } from "./errors.ts";
import { InMemoryCourseRepository } from "./repositories/course.repository.ts";
import { CourseService } from "./services/course.service.ts";
import type { NewCourse } from "./types.ts";

// The composition root: the one place that decides which implementations are used.
const service = new CourseService(new InMemoryCourseRepository(courses));

export const app = express();
app.use(express.json());

app.get("/courses", async (req: Request, res: Response) => {
  res.json({ data: await service.list() });
});

app.get("/courses/:id", async (req: Request<{ id: string }>, res: Response) => {
  res.json({ data: await service.get(Number(req.params.id)) });
});

app.post("/courses", async (req: Request<Record<string, never>, unknown, NewCourse>, res: Response) => {
  res.status(201).json({ data: await service.create(req.body) });
});

${ERROR_HANDLER_TS}`,
          },
          requests: [
            { label: "GET /courses/2", method: "GET", path: "/courses/2" },
            { label: "POST duplicate", method: "POST", path: "/courses", body: { code: "BE-101", title: "Copy", weeks: 1, level: "beginner", price: 0 } },
          ],
          tests: [
            NO_TYPE_ERRORS,
            { label: "The API behaves as before", check: `eq((await get("/courses/2")).json.data.code, "DB-101", "GET /courses/2"); eq((await get("/courses/99")).json.error.code, "COURSE_NOT_FOUND", "GET /courses/99"); eq((await post("/courses", { code: "BE-101", title: "Copy", weeks: 1, level: "beginner", price: 0 })).status, 409, "a duplicate"); eq((await post("/courses", { code: "AI-101", title: "AI", weeks: 12, level: "beginner", price: 1 })).json.data.id, 7, "a new course");` },
            { label: "CourseService works with any repository passed to it", check: `const { CourseService } = await load("src/services/course.service.ts"); const stored = [{ id: 40, code: "QA-101", title: "Testing", weeks: 4, level: "beginner", price: 10 }]; const fake = { findAll: async () => stored, findById: async (id) => stored.find((c) => c.id === id), findByCode: async (code) => stored.find((c) => c.code === code), create: async (input) => ({ id: 41, ...input }) }; const service = new CourseService(fake); eq((await wait(service.get(40))).code, "QA-101", "get(40) from the fake repository"); eq((await wait(service.create({ code: "QA-102", title: "More", weeks: 2, level: "beginner", price: 0 }))).id, 41, "create through the fake repository"); let err; try { await wait(service.create({ code: "QA-101", title: "Dup", weeks: 2, level: "beginner", price: 0 })); } catch (e) { err = e; } eq(err?.code, "DUPLICATE_CODE", "the duplicate rule uses findByCode");` },
            { label: "InMemoryCourseRepository implements the interface", check: `const { InMemoryCourseRepository } = await load("src/repositories/course.repository.ts"); const repo = new InMemoryCourseRepository([]); const c = await wait(repo.create({ code: "X-101", title: "X", weeks: 1, level: "beginner", price: 0 })); eq(c.id, 1, "the first id in an empty repository"); eq((await wait(repo.findByCode("X-101")))?.id, 1, "findByCode");` },
            { label: "The service no longer knows where data lives", check: `lacks(file("src/services/course.service.ts"), "data.ts", "the service should not import the data"); has(file("src/app.ts"), "new InMemoryCourseRepository(", "create the repository in src/app.ts");` },
          ],
          hint: "Declare private readonly repo: CourseRepository; and assign it in the constructor. The service's methods become await this.repo.findById(id) and so on.",
          successMessage: "The service now depends on an interface, not an array. The check just ran it against a fake repository; Week 11 runs it against PostgreSQL.",
        },
      },
      {
        id: "a-be-app-config",
        title: "Dependency management and configuration",
        explain:
          "Two kinds of things a project depends on. PACKAGES: pin them with package-lock.json, install exactly with npm ci in CI and deployment, update deliberately (npm outdated, then test) and audit them (npm audit). SETTINGS: ports, URLs, secrets, timeouts, read from the environment (Week 4's .env locally, the platform's variables in production). Read them in ONE module, validate them with a schema at startup, convert types (PORT is a string in process.env), apply defaults, and FAIL FAST with every problem listed, instead of discovering an undefined URL on the first request at 3 a.m. Then pass the typed config to the code that needs it.",
        nodeLab: {
          task:
            "src/config.ts reads process.env loosely: PORT stays a string, a missing RATES_API_URL becomes undefined. Rewrite it to export loadConfig(env = process.env): validate with zod (NODE_ENV development, test or production, default development; PORT a number from 1 to 65535, default 3000; RATES_API_URL a URL; RATES_API_KEY non-empty; REQUEST_TIMEOUT_MS a positive number, default 2000), return a frozen, typed object, and throw an Error starting with \"Invalid configuration\" listing every bad variable. export type Config = Readonly<z.infer<…>>. src/server.ts calls loadConfig() at startup.",
          command: "npm start",
          files: {
            "package.json": TS_PKG(["express", "zod"], "node --env-file=.env src/server.ts"),
            "tsconfig.json": TSCONFIG,
            ".env": "RATES_API_URL=https://api.rates.example\nRATES_API_KEY=rates-key-123\nPORT=3000\n",
            "src/config.ts": `export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  ratesApiUrl: process.env.RATES_API_URL,
  ratesApiKey: process.env.RATES_API_KEY,
  timeoutMs: process.env.REQUEST_TIMEOUT_MS || 2000,
};
`,
            "src/server.ts": `import express from "express";
import { config } from "./config.ts";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: config.env });
});

app.listen(config.port, () => console.log(\`Course API on http://localhost:\${config.port}\`));
`,
          },
          readOnly: ["package.json", "tsconfig.json", ".env"],
          open: "src/config.ts",
          solution: {
            "src/config.ts": CONFIG_TS,
            "src/server.ts": `import express from "express";
import { loadConfig } from "./config.ts";

const config = loadConfig();
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: config.NODE_ENV });
});

app.listen(config.PORT, () => console.log(\`Course API on http://localhost:\${config.PORT}\`));
`,
          },
          requests: [{ label: "GET /health", method: "GET", path: "/health" }],
          tests: [
            NO_TYPE_ERRORS,
            { label: "loadConfig converts types and applies defaults", check: `const { loadConfig } = await load("src/config.ts"); assert(typeof loadConfig === "function", "export function loadConfig"); const c = loadConfig({ RATES_API_URL: "https://api.rates.example", RATES_API_KEY: "k", PORT: "8080" }); eq({ ...c }, { NODE_ENV: "development", PORT: 8080, RATES_API_URL: "https://api.rates.example", RATES_API_KEY: "k", REQUEST_TIMEOUT_MS: 2000 }, "the config for PORT=8080"); assert(Object.isFrozen(c), "the config object should be frozen (Object.freeze)");` },
            { label: "Invalid settings are all reported at once", check: `const { loadConfig } = await load("src/config.ts"); let err; try { loadConfig({ PORT: "abc", NODE_ENV: "staging", RATES_API_KEY: "k" }); } catch (e) { err = e; } assert(err, "loadConfig should throw for PORT=abc, NODE_ENV=staging and no RATES_API_URL"); assert(err.message.startsWith("Invalid configuration"), "the message should start with Invalid configuration"); for (const name of ["PORT", "NODE_ENV", "RATES_API_URL"]) has(err.message, name, "the message should name " + name);` },
            { label: "The server refuses to start without its settings", check: `await run("node src/server.ts"); assert(exited() && exitCode() !== 0, "without .env the server should stop with an error, not start half-configured"); has(output(), "Invalid configuration", "the startup error");` },
            { label: "npm start runs with the .env settings", check: `await run("npm start"); eq((await get("/health")).json, { status: "ok", env: "development" }, "GET /health"); await run("NODE_ENV=production PORT=4100 npm start"); eq((await get("/health", { port: 4100 })).json.env, "production", "NODE_ENV and PORT from the shell");` },
          ],
          hint: "z.coerce.number() turns \"8080\" into 8080; .default(…) fills missing values; z.url() checks the URL. Map result.error.issues to lines naming issue.path. In server.ts: const config = loadConfig(); then use config.PORT and config.NODE_ENV.",
          successMessage: "A misconfigured server now stops at startup and says exactly what is wrong, and the rest of the code gets typed, checked settings.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 8.5 – 8.6 · CONTRACTS AND OPENAPI
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l56-contracts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.5", "8.6"],
    title: "API Contracts and OpenAPI",
    subtitle: "Promises that machines can check",
    estimatedMinutes: 70,
    intro: "Week 6 documented the API in Markdown, for people. This lesson writes the same promises in forms machines can check: response schemas the API is tested against, and an OpenAPI document that tools turn into docs, clients and tests.",
    atoms: [
      {
        id: "a-be-contracts",
        title: "API contracts and consistent response schemas",
        explain:
          "An API CONTRACT is the exact shape of every request and response. Consistency makes it learnable: this course wraps every success in { data } (a list adds meta: { page, limit, total }) and every failure in { error: { code, message, details? } }, so a client unwraps everything the same way and can add fields later without breaking. Writing the contract as schemas (zod here) lets tests check real responses against it: a CONTRACT TEST fails the moment an endpoint drifts from what clients were promised.",
        nodeLab: {
          task:
            "src/contract.ts (read-only) holds the contract: ItemResponse, ListResponse and ErrorResponse. The routes in src/server.ts answer in four different shapes. Make every response match the contract: GET /courses → ListResponse (page and limit from the query, defaults 1 and 10), GET /courses/:id and POST /courses → ItemResponse, every error → ErrorResponse (COURSE_NOT_FOUND, VALIDATION_FAILED with details).",
          files: {
            "package.json": TS_PKG(),
            "tsconfig.json": TSCONFIG,
            "src/types.ts": TYPES_TS,
            "src/data.ts": DATA_TS,
            "src/contract.ts": `import { z } from "zod";

// strictObject: an unexpected field is a broken contract too.
export const CourseSchema = z.strictObject({
  id: z.int(),
  code: z.string(),
  title: z.string(),
  weeks: z.int(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.int(),
});

export const ItemResponse = z.strictObject({ data: CourseSchema });

export const ListResponse = z.strictObject({
  data: z.array(CourseSchema),
  meta: z.strictObject({ page: z.int().min(1), limit: z.int().min(1), total: z.int().min(0) }),
});

export const ErrorResponse = z.strictObject({
  error: z.strictObject({
    code: z.string(),
    message: z.string(),
    details: z.array(z.strictObject({ field: z.string(), message: z.string() })).optional(),
  }),
});
`,
            "src/server.ts": `import express, { type Request, type Response } from "express";
import { z } from "zod";
import { courses } from "./data.ts";

const app = express();
app.use(express.json());

const createCourseSchema = z.object({
  code: z.string().regex(/^[A-Z]{2,3}-\\d{3}$/),
  title: z.string().trim().min(3).max(100),
  weeks: z.int().min(1).max(52),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.int().min(0),
});

app.get("/courses", (req: Request, res: Response) => {
  res.json(courses);
});

app.get("/courses/:id", (req: Request<{ id: string }>, res: Response) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) {
    res.status(404).json({ message: "Course not found" });
    return;
  }
  res.json({ course });
});

app.post("/courses", (req: Request, res: Response) => {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...parsed.data };
  courses.push(course);
  res.status(201).json(course);
});

${LISTEN}`,
          },
          readOnly: ["package.json", "tsconfig.json", "src/types.ts", "src/data.ts", "src/contract.ts"],
          open: "src/server.ts",
          solution: {
            "src/server.ts": `import express, { type Request, type Response } from "express";
import { z } from "zod";
import { courses } from "./data.ts";

const app = express();
app.use(express.json());

const createCourseSchema = z.object({
  code: z.string().regex(/^[A-Z]{2,3}-\\d{3}$/),
  title: z.string().trim().min(3).max(100),
  weeks: z.int().min(1).max(52),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.int().min(0),
});

const fail = (res: Response, status: number, code: string, message: string, details?: { field: string; message: string }[]) => {
  res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });
};

app.get("/courses", (req: Request<Record<string, never>, unknown, unknown, { page?: string; limit?: string }>, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  res.json({ data: courses.slice((page - 1) * limit, page * limit), meta: { page, limit, total: courses.length } });
});

app.get("/courses/:id", (req: Request<{ id: string }>, res: Response) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return fail(res, 404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  res.json({ data: course });
});

app.post("/courses", (req: Request, res: Response) => {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
    return fail(res, 400, "VALIDATION_FAILED", "Invalid request body", details);
  }
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, ...parsed.data };
  courses.push(course);
  res.status(201).json({ data: course });
});

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses?limit=2", method: "GET", path: "/courses?limit=2" },
            { label: "GET /courses/1", method: "GET", path: "/courses/1" },
            { label: "GET /courses/99", method: "GET", path: "/courses/99" },
            { label: "POST invalid", method: "POST", path: "/courses", body: { code: "x" } },
          ],
          tests: [
            NO_TYPE_ERRORS,
            { label: "GET /courses matches ListResponse", check: `const C = await load("src/contract.ts"); const r = await get("/courses?page=2&limit=4"); const p = C.ListResponse.safeParse(r.json); assert(p.success, "GET /courses?page=2&limit=4 breaks the contract: " + (p.error?.issues.map((i) => i.path.join(".") + " " + i.message).join("; ") || "")); eq(r.json.meta, { page: 2, limit: 4, total: 6 }, "meta"); eq((await get("/courses")).json.meta, { page: 1, limit: 10, total: 6 }, "the defaults");` },
            { label: "GET /courses/:id and POST /courses match ItemResponse", check: `const C = await load("src/contract.ts"); const a = await get("/courses/1"); assert(C.ItemResponse.safeParse(a.json).success, "GET /courses/1 should answer { data: course }"); const b = await post("/courses", { code: "AI-101", title: "AI & Automation", weeks: 12, level: "beginner", price: 70000 }); eq(b.status, 201, "POST status"); assert(C.ItemResponse.safeParse(b.json).success, "POST /courses should answer { data: course }");` },
            { label: "Every error matches ErrorResponse", check: `const C = await load("src/contract.ts"); const a = await get("/courses/99"); eq(a.status, 404, "status"); assert(C.ErrorResponse.safeParse(a.json).success, "GET /courses/99 should answer { error: { code, message } }"); eq(a.json.error.code, "COURSE_NOT_FOUND", "code"); const b = await post("/courses", { code: "x" }); eq(b.status, 400, "status"); const p = C.ErrorResponse.safeParse(b.json); assert(p.success, "a validation error should match ErrorResponse (details are { field, message })"); eq(b.json.error.code, "VALIDATION_FAILED", "code"); assert(b.json.error.details.length >= 5, "one detail per problem");` },
          ],
          hint: "A small fail(res, status, code, message, details?) helper gives every error the same shape. Map zod issues to { field: issue.path.join(\".\"), message: issue.message }.",
          successMessage: "The responses now pass the contract tests. Clients unwrap data and error in one place, whichever endpoint they call.",
        },
      },
      {
        id: "a-be-openapi",
        title: "OpenAPI and Swagger documentation",
        explain:
          "OpenAPI (formerly Swagger) is the standard, machine-readable description of an HTTP API, in YAML or JSON. Its parts: openapi (the version, 3.1.0), info (title, version), servers, paths (each path, then each method: parameters, requestBody, responses by status code), and components (reusable schemas, responses and parameters, referenced with $ref: \"#/components/schemas/Course\"). Path parameters are written {id}. From one document, Swagger UI or Redoc draw interactive docs, generators produce typed clients, and validators check requests and responses. Serve it from the API (GET /openapi.json) so the docs always match the deployed version.",
        nodeLab: {
          task:
            "Write openapi.yaml (OpenAPI 3.1.0) for the course API in server.js: info with a title and version; paths /courses (get with page and limit query parameters; post with a requestBody referencing #/components/schemas/CreateCourse) and /courses/{id} (get, patch, delete, with the id path parameter); each operation listing its responses (200/201/204 and 400, 404, 409 where they apply); and components.schemas Course, CreateCourse and Error. server.js already serves the document at GET /openapi.json.",
          files: {
            "package.json": PKG(["express", "yaml"]),
            "data.js": COURSES_DATA,
            "server.js": `import { readFileSync } from "node:fs";
import express from "express";
import YAML from "yaml";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

// The document is read at startup and served as JSON: the docs always match the running version.
app.get("/openapi.json", (req, res) => res.json(YAML.parse(readFileSync("openapi.yaml", "utf8"))));

// GET /courses?page&limit → 200 { data, meta }
// POST /courses → 201 { data } | 400 VALIDATION_FAILED | 409 DUPLICATE_CODE
// GET /courses/:id → 200 { data } | 404 COURSE_NOT_FOUND
// PATCH /courses/:id → 200 { data } | 400 VALIDATION_FAILED | 404 COURSE_NOT_FOUND
// DELETE /courses/:id → 204 | 404 COURSE_NOT_FOUND
app.get("/courses", (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  res.json({ data: courses.slice((page - 1) * limit, page * limit), meta: { page, limit, total: courses.length } });
});

${LISTEN}`,
            "openapi.yaml": "openapi: 3.1.0\ninfo:\n  title: Course API\n  version: 1.0.0\npaths: {}\n",
          },
          readOnly: ["package.json", "data.js", "server.js"],
          open: "openapi.yaml",
          solution: {
            "openapi.yaml": `openapi: 3.1.0
info:
  title: Course API
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /courses:
    get:
      summary: List courses
      parameters:
        - name: page
          in: query
          schema: { type: integer, minimum: 1, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
      responses:
        "200":
          description: A page of courses
          content:
            application/json:
              schema:
                type: object
                required: [data, meta]
                properties:
                  data:
                    type: array
                    items: { $ref: "#/components/schemas/Course" }
                  meta:
                    type: object
                    required: [page, limit, total]
                    properties:
                      page: { type: integer }
                      limit: { type: integer }
                      total: { type: integer }
    post:
      summary: Create a course
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/CreateCourse" }
      responses:
        "201": { $ref: "#/components/responses/Course" }
        "400": { $ref: "#/components/responses/Error" }
        "409": { $ref: "#/components/responses/Error" }
  /courses/{id}:
    parameters:
      - name: id
        in: path
        required: true
        schema: { type: integer }
    get:
      summary: One course
      responses:
        "200": { $ref: "#/components/responses/Course" }
        "404": { $ref: "#/components/responses/Error" }
    patch:
      summary: Change some fields of a course
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/UpdateCourse" }
      responses:
        "200": { $ref: "#/components/responses/Course" }
        "400": { $ref: "#/components/responses/Error" }
        "404": { $ref: "#/components/responses/Error" }
    delete:
      summary: Delete a course
      responses:
        "204": { description: Deleted }
        "404": { $ref: "#/components/responses/Error" }
components:
  responses:
    Course:
      description: One course
      content:
        application/json:
          schema:
            type: object
            required: [data]
            properties:
              data: { $ref: "#/components/schemas/Course" }
    Error:
      description: An error, in the API's error format
      content:
        application/json:
          schema: { $ref: "#/components/schemas/Error" }
  schemas:
    CreateCourse:
      type: object
      required: [code, title, weeks, level, price]
      properties:
        code: { type: string, pattern: "^[A-Z]{2,3}-\\\\d{3}$", example: BE-101 }
        title: { type: string, minLength: 3, maxLength: 100 }
        weeks: { type: integer, minimum: 1, maximum: 52 }
        level: { type: string, enum: [beginner, intermediate, advanced] }
        price: { type: integer, minimum: 0, description: Price in naira }
    UpdateCourse:
      type: object
      properties:
        title: { type: string, minLength: 3, maxLength: 100 }
        weeks: { type: integer, minimum: 1, maximum: 52 }
        level: { type: string, enum: [beginner, intermediate, advanced] }
        price: { type: integer, minimum: 0 }
    Course:
      allOf:
        - type: object
          required: [id]
          properties:
            id: { type: integer }
        - $ref: "#/components/schemas/CreateCourse"
    Error:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string, example: COURSE_NOT_FOUND }
            message: { type: string }
            details:
              type: array
              items:
                type: object
                properties:
                  field: { type: string }
                  message: { type: string }
`,
          },
          requests: [{ label: "GET /openapi.json", method: "GET", path: "/openapi.json" }],
          tests: [
            { label: "A valid OpenAPI 3.1 document, served at /openapi.json", check: `${DOC} assert(String(doc.openapi).startsWith("3.1"), "openapi should be 3.1.0"); assert(doc.info?.title && doc.info?.version, "info needs a title and a version"); eq((await get("/openapi.json")).json, doc, "GET /openapi.json serves the document");` },
            { label: "Every operation is documented, with its status codes", check: `${DOC} const want = { "/courses": { get: ["200"], post: ["201", "400", "409"] }, "/courses/{id}": { get: ["200", "404"], patch: ["200", "400", "404"], delete: ["204", "404"] } }; for (const [path, ops] of Object.entries(want)) { assert(doc.paths?.[path], "paths should include " + path); for (const [method, codes] of Object.entries(ops)) { const op = doc.paths[path][method]; assert(op, path + " needs a " + method + " operation"); for (const c of codes) assert(op.responses?.[c] ?? op.responses?.[Number(c)], method.toUpperCase() + " " + path + " should document the response " + c); } }` },
            { label: "Parameters: page and limit in the query, id in the path", check: `${DOC} const q = (doc.paths["/courses"].get.parameters || []).map((p) => p.in + ":" + p.name); for (const n of ["query:page", "query:limit"]) assert(q.includes(n), "GET /courses should document the " + n.replace(":", " parameter ")); const item = doc.paths["/courses/{id}"]; const ids = [...(item.parameters || []), ...(item.get?.parameters || [])].filter((p) => p.name === "id"); assert(ids.length && ids.every((p) => p.in === "path" && p.required === true), "the id parameter must be in: path and required: true");` },
            { label: "Schemas: Course, CreateCourse and Error, used by $ref", check: `${DOC} const s = doc.components?.schemas || {}; for (const n of ["Course", "CreateCourse", "Error"]) assert(s[n], "components.schemas should define " + n); eq([...(s.CreateCourse.required || [])].sort(), ["code", "level", "price", "title", "weeks"], "CreateCourse's required fields"); eq(doc.paths["/courses"].post.requestBody?.content?.["application/json"]?.schema?.$ref, "#/components/schemas/CreateCourse", "POST /courses's body should $ref CreateCourse"); assert(JSON.stringify(doc).includes("#/components/schemas/Error"), "error responses should $ref the Error schema");` },
          ],
          hint: "Put shared things in components and point at them with $ref. A parameters list can sit on the path item (/courses/{id}) and apply to all of its methods. Status codes are written as strings: \"200\":.",
          successMessage: "One document now describes the whole API. Paste /openapi.json into Swagger UI or Redoc and you have interactive docs; give it to a generator and you have a typed client.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 8.7 – 8.8 · FILE UPLOADS AND RATE LIMITS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l57-uploads-limits",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.7", "8.8"],
    title: "File Uploads and Rate Limits",
    subtitle: "Accepting files and traffic without being overwhelmed",
    estimatedMinutes: 70,
    intro: "Two features where trusting the client is dangerous: files (anything can be in them) and request volume (anyone can send a million). Both need limits enforced on the server.",
    atoms: [
      {
        id: "a-be-uploads",
        title: "File uploads and file validation",
        explain:
          "Browsers upload files as multipart/form-data. multer parses it: upload.single(\"cover\") puts the file in req.file (fieldname, originalname, mimetype, size, and buffer with memoryStorage). Treat every part as hostile: limit the size (limits: { fileSize }) so a 2 GB upload is cut off; do not trust mimetype or the extension, which the client chose: check the file's first bytes (its MAGIC NUMBER: PNG starts 89 50 4E 47, JPEG FF D8 FF); never use originalname as a path (\"../../server.js\"): generate the name yourself. Big files in production go to object storage (S3 and similar), not the server's disk.",
        nodeLab: {
          task:
            "POST /courses/:id/cover saves whatever it receives under the client's file name. Make it safe: limit files to 1 MB (multer's limits; a bigger file → 413 FILE_TOO_LARGE); require a file in the field cover (400 FILE_REQUIRED, and any other multer error → 400 INVALID_UPLOAD); accept only real PNG or JPEG images, checked by their first bytes (else 415 UNSUPPORTED_FILE); save it as uploads/course-<id>.png or .jpg; answer 201 { data: { coverUrl: \"/uploads/course-<id>.png\", size } }. A missing course is 404 COURSE_NOT_FOUND.",
          files: {
            "package.json": PKG(["express", "multer"]),
            "data.js": COURSES_DATA,
            "errors.js": ERRORS_JS,
            "server.js": `import { mkdir, writeFile } from "node:fs/promises";
import express from "express";
import multer from "multer";
import { courses } from "./data.js";
import { AppError } from "./errors.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/courses/:id/cover", upload.single("cover"), async (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  await mkdir("uploads", { recursive: true });
  await writeFile(\`uploads/\${req.file.originalname}\`, req.file.buffer);
  course.coverUrl = \`/uploads/\${req.file.originalname}\`;
  res.status(201).json({ data: { coverUrl: course.coverUrl, size: req.file.size } });
});

${ERROR_HANDLER_JS}
${LISTEN}`,
          },
          readOnly: ["package.json", "data.js", "errors.js"],
          open: "server.js",
          solution: {
            "server.js": `import { mkdir, writeFile } from "node:fs/promises";
import express from "express";
import multer from "multer";
import { courses } from "./data.js";
import { AppError } from "./errors.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024, files: 1 } });

// The first bytes of each accepted format: the client's mimetype and file name prove nothing.
const IMAGE_TYPES = [
  { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
];

app.post("/courses/:id/cover", upload.single("cover"), async (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${req.params.id} does not exist\`);
  if (!req.file) throw new AppError(400, "FILE_REQUIRED", "Send the image in a form field named cover");
  const type = IMAGE_TYPES.find((t) => t.magic.every((byte, i) => req.file.buffer[i] === byte));
  if (!type) throw new AppError(415, "UNSUPPORTED_FILE", "The cover must be a PNG or JPEG image");
  const name = \`course-\${course.id}.\${type.ext}\`;
  await mkdir("uploads", { recursive: true });
  await writeFile(\`uploads/\${name}\`, req.file.buffer);
  course.coverUrl = \`/uploads/\${name}\`;
  res.status(201).json({ data: { coverUrl: course.coverUrl, size: req.file.size } });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: { code: "FILE_TOO_LARGE", message: "Files can be at most 1 MB" } });
    return res.status(400).json({ error: { code: "INVALID_UPLOAD", message: err.message } });
  }
  next(err);
});

${ERROR_HANDLER_JS}
${LISTEN}`,
          },
          tests: [
            { label: "A real PNG is saved under a name the server chose", check: `const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82]); const fd = new FormData(); fd.append("cover", new Blob([png], { type: "image/png" }), "../../server.js"); const r = await request("POST", "/courses/1/cover", { body: fd }); eq(r.status, 201, "status"); eq(r.json, { data: { coverUrl: "/uploads/course-1.png", size: 16 } }, "body"); assert(exists("uploads/course-1.png"), "the file should be saved as uploads/course-1.png"); has(file("server.js"), "express", "server.js must not be overwritten by an upload named ../../server.js");` },
            { label: "A JPEG gets .jpg", check: `const fd = new FormData(); fd.append("cover", new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16])], { type: "image/jpeg" }), "photo.jpeg"); const r = await request("POST", "/courses/2/cover", { body: fd }); eq([r.status, r.json?.data?.coverUrl], [201, "/uploads/course-2.jpg"], "a JPEG cover");` },
            { label: "A text file posing as a PNG → 415", check: `const fd = new FormData(); fd.append("cover", new Blob(["<?php system($_GET['c']); ?>"], { type: "image/png" }), "cover.png"); const r = await request("POST", "/courses/3/cover", { body: fd }); eq([r.status, r.json?.error?.code], [415, "UNSUPPORTED_FILE"], "the mimetype says PNG, the bytes do not"); assert(!exists("uploads/course-3.png"), "nothing should be saved");` },
            { label: "Over 1 MB → 413; no file or the wrong field → 400; missing course → 404", check: `const big = new Uint8Array(1024 * 1024 + 10); big.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); let fd = new FormData(); fd.append("cover", new Blob([big], { type: "image/png" }), "big.png"); let r = await request("POST", "/courses/1/cover", { body: fd }); eq([r.status, r.json?.error?.code], [413, "FILE_TOO_LARGE"], "a 1 MB + 10 bytes file"); fd = new FormData(); fd.append("title", "no file"); r = await request("POST", "/courses/1/cover", { body: fd }); eq([r.status, r.json?.error?.code], [400, "FILE_REQUIRED"], "no file"); fd = new FormData(); fd.append("image", new Blob([new Uint8Array([0xff, 0xd8, 0xff])]), "a.jpg"); r = await request("POST", "/courses/1/cover", { body: fd }); eq([r.status, r.json?.error?.code], [400, "INVALID_UPLOAD"], "a file in another field"); fd = new FormData(); fd.append("cover", new Blob([new Uint8Array([0xff, 0xd8, 0xff])]), "a.jpg"); r = await request("POST", "/courses/99/cover", { body: fd }); eq([r.status, r.json?.error?.code], [404, "COURSE_NOT_FOUND"], "a missing course");` },
          ],
          hint: "multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } }). Compare req.file.buffer's first bytes with each format's magic number. multer's errors are instances of multer.MulterError with codes such as LIMIT_FILE_SIZE: handle them in an error middleware before the general one.",
          successMessage: "Size, content and name are now the server's decisions. A file called ../../server.js is just bytes in uploads/course-1.png.",
        },
      },
      {
        id: "a-be-rate-limits",
        title: "Rate-limiting concepts and API quotas",
        explain:
          "A RATE LIMIT caps how many requests a client may make in a window (30 per minute), protecting the API from abuse, runaway scripts and brute force. A QUOTA is the same idea over a longer period, often per API key and per plan (10,000 calls a day). Over the limit, answer 429 Too Many Requests with a Retry-After header; the standard RateLimit and RateLimit-Policy headers tell well-behaved clients where they stand. Limits are per client: by IP address, or better by API key or user. Expensive or sensitive endpoints (login, sign-up, creating things) get stricter limits than cheap reads. express-rate-limit implements the windows; with several servers the counters go in Redis (Week 18).",
        nodeLab: {
          task:
            "Add rate limits with express-rate-limit: a general limit of 30 requests per minute for every route, and a stricter limit of 3 per minute on POST /courses. Use the standard headers (standardHeaders: \"draft-8\", legacyHeaders: false), and answer over-limit requests 429 in the error format: { error: { code: \"RATE_LIMITED\", message } }.",
          files: {
            "package.json": PKG(["express", "express-rate-limit"]),
            "data.js": COURSES_DATA,
            "server.js": `import express from "express";
import { rateLimit } from "express-rate-limit";
import { courses } from "./data.js";

const app = express();
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: courses }));

app.post("/courses", (req, res) => {
  const { code, title } = req.body ?? {};
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json({ data: course });
});

${LISTEN}`,
          },
          readOnly: ["package.json", "data.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { rateLimit } from "express-rate-limit";
import { courses } from "./data.js";

const app = express();

const limiter = (limit, message) =>
  rateLimit({
    windowMs: 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res, next, options) => res.status(options.statusCode).json({ error: { code: "RATE_LIMITED", message } }),
  });

app.use(limiter(30, "Too many requests: try again in a minute"));
app.use(express.json());

app.get("/courses", (req, res) => res.json({ data: courses }));

app.post("/courses", limiter(3, "Too many courses created: try again in a minute"), (req, res) => {
  const { code, title } = req.body ?? {};
  const course = { id: Math.max(...courses.map((c) => c.id)) + 1, code, title };
  courses.push(course);
  res.status(201).json({ data: course });
});

${LISTEN}`,
          },
          requests: [
            { label: "GET /courses", method: "GET", path: "/courses" },
            { label: "POST /courses", method: "POST", path: "/courses", body: { code: "AI-101", title: "AI" } },
          ],
          tests: [
            { label: "The 4th POST in a minute → 429 RATE_LIMITED with Retry-After", check: `for (let i = 1; i <= 3; i++) eq((await post("/courses", { code: "T-10" + i, title: "t" })).status, 201, "POST " + i); const r = await post("/courses", { code: "T-104", title: "t" }); eq(r.status, 429, "the 4th POST"); eq(r.json?.error?.code, "RATE_LIMITED", "the error format"); assert(Number(r.headers["retry-after"]) > 0, "a Retry-After header in seconds");` },
            { label: "The window resets after a minute", check: `await advance(61 * 1000); eq((await post("/courses", { code: "T-105", title: "t" })).status, 201, "a POST a minute later");` },
            { label: "Reads have their own, larger limit", check: `await advance(61 * 1000); for (let i = 0; i < 30; i++) { const r = await get("/courses"); if (r.status !== 200) fail("GET number " + (i + 1) + " answered " + r.status); } const r = await get("/courses"); eq([r.status, r.json?.error?.code], [429, "RATE_LIMITED"], "the 31st request in a minute");` },
            { label: "The standard RateLimit headers are sent", check: `await advance(61 * 1000); const r = await get("/courses"); assert(r.headers["ratelimit-policy"], "a RateLimit-Policy header (standardHeaders: \\"draft-8\\")"); assert(r.headers["ratelimit"], "a RateLimit header"); assert(!r.headers["x-ratelimit-limit"], "no legacy X-RateLimit-* headers");` },
          ],
          hint: "rateLimit({ windowMs: 60 * 1000, limit, standardHeaders: \"draft-8\", legacyHeaders: false, handler: (req, res, next, options) => res.status(options.statusCode).json(…) }). Use one with app.use for everything, and pass another as route middleware to app.post.",
          successMessage: "A script hammering POST /courses now gets a polite 429 after three tries, and every client can read its remaining budget from the headers.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 8.9 – 8.10 · EXTERNAL APIS AND WEBHOOKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l58-integrations",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.9", "8.10"],
    title: "External APIs, Timeouts and Webhooks",
    subtitle: "Talking to services you do not control",
    estimatedMinutes: 75,
    intro: "Most backends depend on other APIs: payments, email, exchange rates, maps. Those services are slow sometimes, down sometimes, and occasionally send nonsense. Integrations must be written for those days, in both directions: calls you make, and webhooks they send you.",
    atoms: [
      {
        id: "a-be-external-api",
        title: "External API integration and timeouts",
        explain:
          "Calling another API safely: (1) a TIMEOUT on every request (AbortSignal.timeout(ms)): fetch waits forever by default, and one slow provider would tie up all your requests; (2) check response.ok; (3) VALIDATE the response with a schema, because their data is input too; (4) CACHE what changes slowly (exchange rates for minutes) so you call less and survive short outages; (5) DEGRADE gracefully: serve a slightly stale value, marked as such, rather than an error; and when that is impossible, answer 503 (or 502/504) quickly in your own error format. Keys go in the Authorization header, from configuration.",
        nodeLab: {
          task:
            "Write getRates() in rates.js for the exchange-rate service (RATES_API_URL, RATES_API_KEY in the environment): GET <url>/v1/rates?base=NGN with Authorization: Bearer <key> and a 2-second timeout; reject non-OK answers; validate the body with zod ({ base: \"NGN\", rates: an object of positive numbers }). Cache the rates for 10 minutes. If a call fails and cached rates less than an hour old exist, return them with stale: true; otherwise throw. It returns { rates, stale }. server.js uses it.",
          files: {
            "package.json": PKG(["express", "zod"]),
            "data.js": COURSES_DATA,
            "rates.js": `export async function getRates() {
  const response = await fetch(\`\${process.env.RATES_API_URL}/v1/rates?base=NGN\`);
  const body = await response.json();
  return { rates: body.rates, stale: false };
}
`,
            "server.js": `import express from "express";
import { courses } from "./data.js";
import { getRates } from "./rates.js";

const app = express();

app.get("/courses/:id/price", async (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: \`Course \${req.params.id} does not exist\` } });
  const currency = String(req.query.currency ?? "USD").toUpperCase();
  try {
    const { rates, stale } = await getRates();
    if (!(currency in rates)) return res.status(400).json({ error: { code: "UNSUPPORTED_CURRENCY", message: \`Currency \${currency} is not supported\` } });
    res.json({ data: { code: course.code, currency, amount: Math.round(course.price * rates[currency] * 100) / 100, stale } });
  } catch (err) {
    console.error(\`[rates] \${err.message}\`);
    res.status(503).json({ error: { code: "RATES_UNAVAILABLE", message: "Prices in other currencies are unavailable right now" } });
  }
});

${LISTEN}`,
          },
          env: RATES_ENV,
          services: { [RATES_API]: RATES_SERVICE },
          readOnly: ["package.json", "data.js", "server.js"],
          open: "rates.js",
          solution: {
            "rates.js": `import { z } from "zod";

const RatesSchema = z.object({
  base: z.literal("NGN"),
  rates: z.record(z.string(), z.number().positive()),
});

const FRESH_MS = 10 * 60 * 1000;
const USABLE_MS = 60 * 60 * 1000;
let cache = null; // { rates, at }

export async function getRates() {
  if (cache && Date.now() - cache.at < FRESH_MS) return { rates: cache.rates, stale: false };
  try {
    const response = await fetch(\`\${process.env.RATES_API_URL}/v1/rates?base=NGN\`, {
      headers: { Authorization: \`Bearer \${process.env.RATES_API_KEY}\` },
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) throw new Error(\`rates API answered HTTP \${response.status}\`);
    const { rates } = RatesSchema.parse(await response.json());
    cache = { rates, at: Date.now() };
    return { rates, stale: false };
  } catch (err) {
    if (cache && Date.now() - cache.at < USABLE_MS) return { rates: cache.rates, stale: true };
    throw err;
  }
}
`,
          },
          requests: [
            { label: "GET /courses/2/price?currency=USD", method: "GET", path: "/courses/2/price?currency=USD" },
            { label: "…?currency=GBP", method: "GET", path: "/courses/1/price?currency=GBP" },
          ],
          tests: [
            { label: "A hanging service is cut off after 2 seconds", check: `const { getRates } = await load("rates.js"); const api = service("${RATES_API}"); api.locals.delayMs = 30000; const t0 = now(); let err; try { await wait(getRates()); } catch (e) { err = e; } api.locals.delayMs = 0; assert(err, "with no cached rates, getRates should throw when the service hangs"); const took = now() - t0; assert(took >= 1900 && took < 3000, "it should give up after about 2 seconds (took " + Math.round(took) + " ms)");` },
            { label: "Malformed data from the service is rejected", check: `const { getRates } = await load("rates.js"); const api = service("${RATES_API}"); api.locals.badData = true; let err, result; try { result = await wait(getRates()); } catch (e) { err = e; } api.locals.badData = false; assert(err, "rates: { USD: \\"cheap\\" } should fail validation, not be returned (got " + JSON.stringify(result) + ")");` },
            { label: "A price in USD, fetched with the API key", check: `const r = await get("/courses/2/price?currency=USD"); eq(r.status, 200, "status (the service answers 401 without the Authorization header)"); eq(r.json.data, { code: "DB-101", currency: "USD", amount: 52.8, stale: false }, "80000 NGN in USD"); const call = outgoing().find((o) => o.url.startsWith("${RATES_API}")); eq(call?.headers.authorization, "Bearer rates-key-123", "the Authorization header");` },
            { label: "Rates are cached for 10 minutes", check: `const calls = () => outgoing().filter((o) => o.url.startsWith("${RATES_API}")).length; const before = calls(); await get("/courses/1/price?currency=GBP"); await get("/courses/3/price?currency=EUR"); eq(calls() - before, 0, "no new calls within 10 minutes"); await advance(11 * 60 * 1000); await get("/courses/1/price?currency=GBP"); eq(calls() - before, 1, "one new call after 11 minutes");` },
            { label: "When the service fails, recent rates are served as stale", check: `await advance(11 * 60 * 1000); service("${RATES_API}").locals.failNext = 5; const r = await get("/courses/2/price?currency=USD"); service("${RATES_API}").locals.failNext = 0; eq(r.status, 200, "an outage should not break prices while the cached rates are under an hour old"); eq(r.json.data.stale, true, "stale: true");` },
          ],
          hint: "Keep let cache = null at module level. Inside try: fetch with headers and signal: AbortSignal.timeout(2000), check response.ok, RatesSchema.parse(await response.json()), store { rates, at: Date.now() }. In catch: return the cache as stale if it is under an hour old, else rethrow.",
          successMessage: "Slow, down or nonsensical: the rate service can now be all three and prices keep working, or fail fast and clearly.",
        },
      },
      {
        id: "a-be-webhook-signatures",
        title: "Webhooks and signature verification",
        explain:
          "A WEBHOOK is the provider calling YOUR API when something happens (a payment succeeded). Anyone can POST to that URL, so providers SIGN each request: an HMAC-SHA256 of the raw body (often with a timestamp) using a secret only you and they know, sent in a header such as t=1761200000,v1=<hex>. Verify it on the RAW bytes (before JSON parsing changes them, so use express.raw on that route), compare with crypto.timingSafeEqual (a normal === leaks timing information), and reject old timestamps (more than five minutes) so a captured request cannot be replayed.",
        nodeLab: {
          task:
            "Write verifySignature(rawBody, header, secret, { toleranceSeconds = 300, now = Date.now() } = {}) in signature.js. The header is \"t=<unix seconds>,v1=<hex>\" where hex is the HMAC-SHA256 of \"<t>.<rawBody>\" with the secret. Return true only for a well-formed header with a matching signature (compared with timingSafeEqual) and a timestamp within toleranceSeconds of now. server.js uses it for POST /webhooks/payments.",
          files: {
            "package.json": PKG(),
            "signature.js": `export function verifySignature(rawBody, header, secret, { toleranceSeconds = 300, now = Date.now() } = {}) {
  return String(header).includes("v1=");
}
`,
            "server.js": `import express from "express";
import { verifySignature } from "./signature.js";

const app = express();
const received = [];

// express.raw keeps the exact bytes: the signature was computed over them.
app.post("/webhooks/payments", express.raw({ type: "application/json" }), (req, res) => {
  const raw = req.body.toString("utf8");
  if (!verifySignature(raw, req.get("payments-signature"), "whsec_academy")) {
    return res.status(400).json({ error: { code: "INVALID_SIGNATURE", message: "The webhook signature is not valid" } });
  }
  received.push(JSON.parse(raw));
  res.json({ received: true });
});

app.get("/webhooks/received", (req, res) => res.json({ data: received }));

${LISTEN}`,
          },
          readOnly: ["package.json", "server.js"],
          open: "signature.js",
          solution: { "signature.js": SIGNATURE_JS },
          tests: [
            { label: "A correctly signed event is accepted", check: `${SIGN} const body = JSON.stringify({ id: "evt_1", type: "checkout.completed", data: { reference: "enr_2" } }); const r = await request("POST", "/webhooks/payments", { body, headers: { "Content-Type": "application/json", "Payments-Signature": sign(body) } }); eq([r.status, r.json], [200, { received: true }], "a valid signature");` },
            { label: "A wrong secret, a changed body or a missing header → 400", check: `${SIGN} const body = JSON.stringify({ id: "evt_2", type: "checkout.completed", data: { reference: "enr_2" } }); const send = (b, sig) => request("POST", "/webhooks/payments", { body: b, headers: { "Content-Type": "application/json", ...(sig ? { "Payments-Signature": sig } : {}) } }); eq((await send(body, sign(body, undefined, "whsec_wrong"))).status, 400, "signed with another secret"); eq((await send(body.replace("enr_2", "enr_9"), sign(body))).status, 400, "the body changed after signing"); eq((await send(body)).status, 400, "no signature header"); eq((await send(body, "t=abc,v1=xyz")).status, 400, "a malformed header");` },
            { label: "An old timestamp is rejected (replay protection)", check: `${SIGN} const body = JSON.stringify({ id: "evt_3", type: "checkout.completed", data: {} }); const old = Math.floor(now() / 1000) - 600; const r = await request("POST", "/webhooks/payments", { body, headers: { "Content-Type": "application/json", "Payments-Signature": sign(body, old) } }); eq(r.status, 400, "a request signed 10 minutes ago"); const { verifySignature } = await load("signature.js"); eq(verifySignature(body, sign(body, old), "whsec_academy", { toleranceSeconds: 900 }), true, "accepted with a 15-minute tolerance");` },
            { label: "verifySignature compares with timingSafeEqual", check: `has(file("signature.js"), "timingSafeEqual", "compare the signatures with crypto.timingSafeEqual, not === or !==");` },
          ],
          hint: "Split the header on , then on = to get t and v1. Check t is a whole number within the tolerance of now / 1000 and v1 is 64 hex characters, compute createHmac(\"sha256\", secret).update(`${t}.${rawBody}`).digest(), and compare it with Buffer.from(v1, \"hex\") using timingSafeEqual.",
          successMessage: "Only the provider, holding the secret, can now produce an event your API accepts, and only within five minutes.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 8.11 – 8.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l59-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["8.11", "8.12", "8.13", "8.14"],
    title: "Exercises: Payments, Webhooks, OpenAPI and a Refactor",
    subtitle: "Integrating a payment provider end to end",
    estimatedMinutes: 150,
    intro:
      "Students now pay for courses. The first three exercises integrate a card-payment provider (its test API runs at https://api.payments.example): create a checkout, receive its webhook, document both. The fourth cleans up a controller that grew too clever.",
    atoms: [
      {
        id: "a-be-ex-integrate",
        title: "Exercise: integrate an external service",
        explain:
          "The payment flow: POST /enrollments creates a pending enrollment and asks the provider for a CHECKOUT (POST /v1/checkouts with the amount in kobo, the currency and our reference, authenticated with the secret key), then answers with the checkout's URL, where the student pays. Payment is confirmed later by webhook (next exercise). A retry is only safe because the provider supports an Idempotency-Key header: the same key twice returns the same checkout instead of a second one.",
        nodeLab: {
          task:
            "Implement POST /enrollments: validate { courseId, email } (400 VALIDATION_FAILED); 404 COURSE_NOT_FOUND; store a pending enrollment with reference enr_<id>; create a checkout at PAYMENTS_API_URL/v1/checkouts (Authorization: Bearer PAYMENTS_SECRET_KEY, Idempotency-Key: the reference, body { amount: price × 100, currency: \"NGN\", reference }) with a 3-second timeout; answer 201 { data: { id, status: \"pending\", checkoutUrl } }. On a provider 5xx, retry once after 200 ms with the same key; still failing → 502 PAYMENT_PROVIDER_ERROR; a timeout → 504 PAYMENT_PROVIDER_TIMEOUT. A failed enrollment gets status \"failed\".",
          files: {
            "package.json": PKG(["express", "zod"]),
            "data.js": ENROLLMENTS_DATA,
            "errors.js": ERRORS_JS,
            "server.js": `${ENROLLMENTS_BASE}
// POST /enrollments

${ERROR_HANDLER_JS}
${LISTEN}`,
          },
          env: PAYMENTS_ENV,
          services: { [PAYMENTS_API]: PAYMENTS_SERVICE },
          readOnly: ["package.json", "data.js", "errors.js"],
          open: "server.js",
          solution: {
            "server.js": `${ENROLLMENTS_BASE}
${CREATE_CHECKOUT}
${ERROR_HANDLER_JS}
${LISTEN}`,
          },
          requests: [
            { label: "POST /enrollments", method: "POST", path: "/enrollments", body: { courseId: 1, email: "amaka@example.com" } },
            { label: "GET /enrollments/2", method: "GET", path: "/enrollments/2" },
          ],
          tests: [
            { label: "An enrollment gets a checkout URL from the provider", check: `const r = await post("/enrollments", { courseId: 1, email: "amaka@example.com" }); eq(r.status, 201, "status"); eq(r.json, { data: { id: 2, status: "pending", checkoutUrl: "https://pay.payments.example/c/chk_1" } }, "body"); const call = outgoing().find((o) => o.url === "${PAYMENTS_API}/v1/checkouts"); assert(call, "POST ${PAYMENTS_API}/v1/checkouts"); eq(call.headers.authorization, "Bearer sk_test_academy", "Authorization"); eq(call.headers["idempotency-key"], "enr_2", "Idempotency-Key"); eq(JSON.parse(call.body), { amount: 12000000, currency: "NGN", reference: "enr_2" }, "120000 naira in kobo"); eq((await get("/enrollments/2")).json.data.checkoutId, "chk_1", "the checkout id is stored");` },
            { label: "Validation and a missing course", check: `eq((await post("/enrollments", { courseId: 1, email: "nope" })).json.error.code, "VALIDATION_FAILED", "an invalid email"); eq((await post("/enrollments", { courseId: 99, email: "a@b.co" })).json.error.code, "COURSE_NOT_FOUND", "course 99"); assert(!outgoing().some((o) => o.body.includes("a@b.co")), "nothing is sent to the provider for an invalid request");` },
            { label: "One 5xx is retried with the same Idempotency-Key", check: `const before = outgoing().length; service("${PAYMENTS_API}").locals.failNext = 1; const r = await post("/enrollments", { courseId: 2, email: "bola@example.com" }); eq(r.status, 201, "the retry succeeds"); const calls = outgoing().slice(before); eq(calls.length, 2, "two attempts"); eq(calls.map((c) => c.headers["idempotency-key"]), ["enr_3", "enr_3"], "the same key both times"); assert(calls[1].at - calls[0].at >= 200, "wait 200 ms before retrying");` },
            { label: "A failing provider → 502; a hanging one → 504 within 3 seconds", check: `const api = service("${PAYMENTS_API}"); api.locals.failNext = 2; const a = await post("/enrollments", { courseId: 3, email: "c@example.com" }); eq([a.status, a.json.error.code], [502, "PAYMENT_PROVIDER_ERROR"], "two 5xx"); eq((await get("/enrollments/4")).json.data?.status, "failed", "the enrollment is marked failed"); api.locals.delayMs = 10000; const t0 = now(); const b = await post("/enrollments", { courseId: 3, email: "d@example.com" }); api.locals.delayMs = 0; eq([b.status, b.json.error.code], [504, "PAYMENT_PROVIDER_TIMEOUT"], "a provider that never answers"); assert(now() - t0 < 4000, "give up after 3 seconds, not " + Math.round(now() - t0) + " ms");` },
          ],
          hint: "Write createCheckout(enrollment, amountKobo) with a for loop of two attempts. fetch(…, { signal: AbortSignal.timeout(3000) }) throws an error named TimeoutError on timeout. Mark the enrollment failed in a catch around the call, then rethrow.",
          successMessage: "Students get a payment page, and a flaky provider costs at most one retry, never a double charge.",
        },
      },
      {
        id: "a-be-ex-webhook",
        title: "Exercise: build a webhook endpoint",
        explain:
          "The provider sends checkout.completed when a student has paid and checkout.expired when they gave up, each with our reference. Webhooks arrive AT LEAST ONCE: the provider retries until it gets a 2xx, so the same event can arrive twice and must be processed once (remember event ids). Answer quickly with 200 once the signature is valid, even for event types you ignore; otherwise the provider keeps retrying them.",
        nodeLab: {
          task:
            "Add POST /webhooks/payments: verify the Payments-Signature header with verifySignature (signature.js) over the raw body and PAYMENTS_WEBHOOK_SECRET (invalid → 400 INVALID_SIGNATURE); process each event id once (a repeat → 200 { received: true, duplicate: true }); checkout.completed sets the enrollment with that reference to \"paid\", checkout.expired to \"expired\" (only from \"pending\"); other types → 200 { received: true, ignored: true }; otherwise 200 { received: true }.",
          files: {
            "package.json": PKG(["express", "zod"]),
            "data.js": ENROLLMENTS_DATA.replace(/\];\n$/, `  { id: 2, courseId: 1, email: "amaka@example.com", status: "pending", reference: "enr_2", checkoutId: "chk_1" },\n  { id: 3, courseId: 3, email: "bola@example.com", status: "pending", reference: "enr_3", checkoutId: "chk_2" },\n];\n`),
            "errors.js": ERRORS_JS,
            "signature.js": SIGNATURE_JS,
            "server.js": `${ENROLLMENTS_BASE.replace(`import { AppError } from "./errors.js";\n`, `import { AppError } from "./errors.js";\nimport { verifySignature } from "./signature.js";\n`)}
// POST /webhooks/payments

${ERROR_HANDLER_JS}
${LISTEN}`,
          },
          env: PAYMENTS_ENV,
          readOnly: ["package.json", "data.js", "errors.js", "signature.js"],
          open: "server.js",
          solution: {
            "server.js": `${ENROLLMENTS_BASE.replace(`import { AppError } from "./errors.js";\n`, `import { AppError } from "./errors.js";\nimport { verifySignature } from "./signature.js";\n`)}
${WEBHOOK_ROUTE}
${ERROR_HANDLER_JS}
${LISTEN}`,
          },
          tests: [
            { label: "checkout.completed marks the enrollment paid", check: `${SIGN} const body = JSON.stringify({ id: "evt_10", type: "checkout.completed", data: { reference: "enr_2" } }); const r = await request("POST", "/webhooks/payments", { body, headers: { "Content-Type": "application/json", "Payments-Signature": sign(body) } }); eq([r.status, r.json], [200, { received: true }], "the response"); eq((await get("/enrollments/2")).json.data.status, "paid", "enrollment 2");` },
            { label: "A bad signature → 400, and nothing changes", check: `${SIGN} const body = JSON.stringify({ id: "evt_11", type: "checkout.completed", data: { reference: "enr_3" } }); const r = await request("POST", "/webhooks/payments", { body, headers: { "Content-Type": "application/json", "Payments-Signature": sign(body, undefined, "whsec_guess") } }); eq([r.status, r.json.error?.code], [400, "INVALID_SIGNATURE"], "a forged event"); eq((await get("/enrollments/3")).json.data.status, "pending", "enrollment 3 is still pending");` },
            { label: "A repeated event is processed once", check: `${SIGN} const body = JSON.stringify({ id: "evt_12", type: "checkout.expired", data: { reference: "enr_3" } }); const send = () => request("POST", "/webhooks/payments", { body, headers: { "Content-Type": "application/json", "Payments-Signature": sign(body) } }); eq((await send()).json, { received: true }, "the first delivery"); eq((await get("/enrollments/3")).json.data.status, "expired", "expired"); eq((await send()).json, { received: true, duplicate: true }, "the same event again");` },
            { label: "Unknown event types are acknowledged and ignored; paid stays paid", check: `${SIGN} const send = (e) => { const body = JSON.stringify(e); return request("POST", "/webhooks/payments", { body, headers: { "Content-Type": "application/json", "Payments-Signature": sign(body) } }); }; eq((await send({ id: "evt_13", type: "customer.updated", data: {} })).json, { received: true, ignored: true }, "an unknown type"); await send({ id: "evt_14", type: "checkout.expired", data: { reference: "enr_1" } }); eq((await get("/enrollments/1")).json.data.status, "paid", "a paid enrollment does not become expired");` },
          ],
          hint: "Register the route with express.raw({ type: \"application/json\" }) so req.body is a Buffer. Keep a Set of processed event ids, and a map from event type to the new status.",
          successMessage: "Forged events are refused, retried ones are harmless, and enrollments move from pending to paid exactly once.",
        },
      },
      {
        id: "a-be-ex-openapi",
        title: "Exercise: document the API with OpenAPI",
        explain:
          "The enrollments API needs the same treatment as courses: every operation, its body, parameters, responses and errors. The webhook endpoint is documented too, with its required signature header, because the provider's dashboard asks for the URL and your team needs to know what arrives there. Reuse what components already defines.",
        nodeLab: {
          task:
            "openapi.yaml documents GET /courses/{id}. Add POST /enrollments (requestBody $ref CreateEnrollment; responses 201, 400, 404, 502, 504), GET /enrollments/{id} (200 with an Enrollment, 404) and POST /webhooks/payments (a required Payments-Signature header parameter; responses 200 and 400), plus components.schemas CreateEnrollment (courseId and email required), Enrollment (status enum pending, paid, expired, failed) and PaymentEvent.",
          files: {
            "package.json": PKG(["express", "yaml"]),
            "server.js": `import { readFileSync } from "node:fs";
import express from "express";
import YAML from "yaml";

const app = express();
app.get("/openapi.json", (req, res) => res.json(YAML.parse(readFileSync("openapi.yaml", "utf8"))));

${LISTEN}`,
            "openapi.yaml": ENROLLMENTS_OPENAPI_BASE,
          },
          readOnly: ["package.json", "server.js"],
          open: "openapi.yaml",
          solution: { "openapi.yaml": ENROLLMENTS_OPENAPI },
          requests: [{ label: "GET /openapi.json", method: "GET", path: "/openapi.json" }],
          tests: [
            { label: "POST /enrollments: body and every response", check: `${DOC} const op = doc.paths?.["/enrollments"]?.post; assert(op, "document POST /enrollments"); eq(op.requestBody?.content?.["application/json"]?.schema?.$ref, "#/components/schemas/CreateEnrollment", "the request body should $ref CreateEnrollment"); for (const c of ["201", "400", "404", "502", "504"]) assert(op.responses?.[c], "POST /enrollments should document " + c);` },
            { label: "GET /enrollments/{id}", check: `${DOC} const op = doc.paths?.["/enrollments/{id}"]?.get; assert(op, "document GET /enrollments/{id}"); for (const c of ["200", "404"]) assert(op.responses?.[c], "GET /enrollments/{id} should document " + c); const params = [...(doc.paths["/enrollments/{id}"].parameters || []), ...(op.parameters || [])]; assert(params.some((p) => p.$ref === "#/components/parameters/Id" || (p.name === "id" && p.in === "path")), "the id path parameter"); assert(JSON.stringify(op.responses["200"]).includes("#/components/schemas/Enrollment"), "the 200 response should use the Enrollment schema");` },
            { label: "POST /webhooks/payments with its signature header", check: `${DOC} const op = doc.paths?.["/webhooks/payments"]?.post; assert(op, "document POST /webhooks/payments"); const h = (op.parameters || []).find((p) => p.in === "header" && String(p.name).toLowerCase() === "payments-signature"); assert(h && h.required === true, "a required Payments-Signature header parameter"); for (const c of ["200", "400"]) assert(op.responses?.[c], "the webhook should document " + c);` },
            { label: "The new schemas", check: `${DOC} const s = doc.components?.schemas || {}; eq([...(s.CreateEnrollment?.required || [])].sort(), ["courseId", "email"], "CreateEnrollment's required fields"); eq([...(s.Enrollment?.properties?.status?.enum || [])].sort(), ["expired", "failed", "paid", "pending"], "Enrollment.status's values"); assert(s.PaymentEvent, "a PaymentEvent schema"); eq((await get("/openapi.json")).json.paths["/enrollments"] !== undefined, true, "the served document includes the new paths");` },
          ],
          hint: "Copy the shape of /courses/{id}: parameters (or the shared #/components/parameters/Id), responses with $ref: \"#/components/responses/Error\" for the errors. A header parameter is { name: Payments-Signature, in: header, required: true, schema: { type: string } }.",
          successMessage: "The payment flow is documented down to the webhook's header: the next developer, or the provider's support team, can work from the document alone.",
        },
      },
      {
        id: "a-be-ex-refactor",
        title: "Exercise: refactor a controller with excessive business logic",
        explain:
          "Controllers attract logic: a discount rule here, a database query there, until the HTTP layer is the only place the business rules exist and they cannot be tested without HTTP. The refactor moves rules to a service (pure, testable), data access to a repository, and leaves the controller to translate between HTTP and the service. Behaviour must not change: the checks call the API before and after.",
        nodeLab: {
          task:
            "QuoteController.create holds the pricing rules (an early-bird discount of 10% more than 30 days before the start date, 15% for three or more seats, never both: the bigger one wins; a minimum of ₦5,000 per seat) and reads courses directly. Move the rules into PricingService.quote(course, seats, startDate, today) in src/services/pricing.service.ts and the data access into a CourseRepository (src/repositories/course.repository.ts, findById). The controller keeps only HTTP: parse, call, answer. tsc must pass.",
          files: {
            "package.json": TS_PKG(),
            "tsconfig.json": TSCONFIG,
            "src/types.ts": `${TYPES_TS}
export interface Quote {
  courseCode: string;
  seats: number;
  unitPrice: number;
  discountPercent: number;
  total: number;
}
`,
            "src/data.ts": DATA_TS,
            "src/errors.ts": ERRORS_TS,
            "src/controllers/quote.controller.ts": `import type { Request, Response } from "express";
import { courses } from "../data.ts";
import { AppError } from "../errors.ts";
import type { Quote } from "../types.ts";

interface QuoteBody {
  courseId: number;
  seats: number;
  startDate: string;
}

export class QuoteController {
  create = (req: Request<Record<string, never>, { data: Quote }, QuoteBody>, res: Response<{ data: Quote }>) => {
    const { courseId, seats, startDate } = req.body;
    if (!Number.isInteger(seats) || seats < 1) throw new AppError(400, "VALIDATION_FAILED", "seats must be a whole number, 1 or more");
    const course = courses.find((c) => c.id === courseId);
    if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${courseId} does not exist\`);
    const daysAhead = (new Date(startDate).getTime() - new Date("2026-10-23").getTime()) / 86_400_000;
    let discount = 0;
    if (daysAhead > 30) discount = 10;
    if (seats >= 3 && 15 > discount) discount = 15;
    const unitPrice = Math.max(5000, Math.round(course.price * (1 - discount / 100)));
    res.status(201).json({ data: { courseCode: course.code, seats, unitPrice, discountPercent: discount, total: unitPrice * seats } });
  };
}
`,
            "src/services/pricing.service.ts": "",
            "src/repositories/course.repository.ts": "",
            "src/app.ts": `import express, { type NextFunction, type Request, type Response } from "express";
import { QuoteController } from "./controllers/quote.controller.ts";
import { AppError } from "./errors.ts";

const quotes = new QuoteController();

export const app = express();
app.use(express.json());
app.post("/quotes", quotes.create);

${ERROR_HANDLER_TS}`,
            "src/server.ts": `import { app } from "./app.ts";\n\n${LISTEN}`,
          },
          readOnly: ["package.json", "tsconfig.json", "src/types.ts", "src/data.ts", "src/errors.ts", "src/server.ts"],
          open: "src/controllers/quote.controller.ts",
          solution: {
            "src/repositories/course.repository.ts": `import type { Course } from "../types.ts";

export interface CourseRepository {
  findById(id: number): Promise<Course | undefined>;
}

export class InMemoryCourseRepository implements CourseRepository {
  private readonly courses: Course[];

  constructor(courses: Course[]) {
    this.courses = courses;
  }

  async findById(id: number): Promise<Course | undefined> {
    return this.courses.find((c) => c.id === id);
  }
}
`,
            "src/services/pricing.service.ts": `import type { Course, Quote } from "../types.ts";

const DAY_MS = 86_400_000;
const EARLY_BIRD = { minDaysAhead: 30, percent: 10 };
const GROUP = { minSeats: 3, percent: 15 };
const MIN_UNIT_PRICE = 5000;

/** The pricing rules, with no HTTP and no data access: the same answer for the same inputs. */
export class PricingService {
  quote(course: Course, seats: number, startDate: Date, today: Date): Quote {
    const daysAhead = (startDate.getTime() - today.getTime()) / DAY_MS;
    const earlyBird = daysAhead > EARLY_BIRD.minDaysAhead ? EARLY_BIRD.percent : 0;
    const group = seats >= GROUP.minSeats ? GROUP.percent : 0;
    const discountPercent = Math.max(earlyBird, group);
    const unitPrice = Math.max(MIN_UNIT_PRICE, Math.round(course.price * (1 - discountPercent / 100)));
    return { courseCode: course.code, seats, unitPrice, discountPercent, total: unitPrice * seats };
  }
}
`,
            "src/controllers/quote.controller.ts": `import type { Request, Response } from "express";
import { AppError } from "../errors.ts";
import type { CourseRepository } from "../repositories/course.repository.ts";
import type { PricingService } from "../services/pricing.service.ts";
import type { Quote } from "../types.ts";

interface QuoteBody {
  courseId: number;
  seats: number;
  startDate: string;
}

export class QuoteController {
  private readonly courses: CourseRepository;
  private readonly pricing: PricingService;

  constructor(courses: CourseRepository, pricing: PricingService) {
    this.courses = courses;
    this.pricing = pricing;
  }

  create = async (req: Request<Record<string, never>, { data: Quote }, QuoteBody>, res: Response<{ data: Quote }>) => {
    const { courseId, seats, startDate } = req.body;
    if (!Number.isInteger(seats) || seats < 1) throw new AppError(400, "VALIDATION_FAILED", "seats must be a whole number, 1 or more");
    const course = await this.courses.findById(courseId);
    if (!course) throw new AppError(404, "COURSE_NOT_FOUND", \`Course \${courseId} does not exist\`);
    res.status(201).json({ data: this.pricing.quote(course, seats, new Date(startDate), new Date("2026-10-23")) });
  };
}
`,
            "src/app.ts": `import express, { type NextFunction, type Request, type Response } from "express";
import { QuoteController } from "./controllers/quote.controller.ts";
import { courses } from "./data.ts";
import { AppError } from "./errors.ts";
import { InMemoryCourseRepository } from "./repositories/course.repository.ts";
import { PricingService } from "./services/pricing.service.ts";

const quotes = new QuoteController(new InMemoryCourseRepository(courses), new PricingService());

export const app = express();
app.use(express.json());
app.post("/quotes", quotes.create);

${ERROR_HANDLER_TS}`,
          },
          requests: [
            { label: "POST /quotes (early bird)", method: "POST", path: "/quotes", body: { courseId: 1, seats: 1, startDate: "2026-12-15" } },
            { label: "POST /quotes (group)", method: "POST", path: "/quotes", body: { courseId: 2, seats: 4, startDate: "2026-11-01" } },
          ],
          tests: [
            NO_TYPE_ERRORS,
            { label: "The API answers exactly as before", check: `const q = (body) => post("/quotes", body).then((r) => [r.status, r.json]); eq(await q({ courseId: 1, seats: 1, startDate: "2026-12-15" }), [201, { data: { courseCode: "BE-101", seats: 1, unitPrice: 108000, discountPercent: 10, total: 108000 } }], "early bird"); eq(await q({ courseId: 2, seats: 4, startDate: "2026-12-15" }), [201, { data: { courseCode: "DB-101", seats: 4, unitPrice: 68000, discountPercent: 15, total: 272000 } }], "group beats early bird"); eq((await q({ courseId: 2, seats: 0, startDate: "2026-11-01" }))[1].error.code, "VALIDATION_FAILED", "0 seats"); eq((await q({ courseId: 9, seats: 1, startDate: "2026-11-01" }))[1].error.code, "COURSE_NOT_FOUND", "course 9");` },
            { label: "PricingService.quote holds the rules, testable on its own", check: `const { PricingService } = await load("src/services/pricing.service.ts"); const p = new PricingService(); const course = { id: 1, code: "MINI-1", title: "Mini", weeks: 1, level: "beginner", price: 5200 }; const today = new Date("2026-01-01"); eq(p.quote(course, 1, new Date("2026-01-10"), today), { courseCode: "MINI-1", seats: 1, unitPrice: 5200, discountPercent: 0, total: 5200 }, "no discount"); eq(p.quote(course, 3, new Date("2026-03-01"), today).unitPrice, 5000, "the ₦5,000 minimum per seat");` },
            { label: "The controller only does HTTP", check: `const c = file("src/controllers/quote.controller.ts"); lacks(c, "data.ts", "the controller should get courses from a CourseRepository, not import the data"); assert(!/0\\.1|\\b15\\b|5000|86_?400_?000/.test(c), "the discount rules, the minimum and the date arithmetic belong in PricingService"); has(c, "quote(", "the controller should call PricingService.quote");` },
            NO_ANY(["src/controllers/quote.controller.ts", "src/services/pricing.service.ts", "src/repositories/course.repository.ts", "src/app.ts"]),
          ],
          hint: "PricingService.quote takes plain values and returns a Quote. The controller receives a CourseRepository and a PricingService in its constructor (declare the fields explicitly) and becomes four lines; src/app.ts creates all three.",
          successMessage: "The pricing rules can now be tested with a calendar and a calculator, no server required, and the controller reads like a sentence.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 8.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l60-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["8.P"],
    title: "Deliverable: A Typed, Documented API with an External Service",
    subtitle: "Prices in any currency, on any day",
    estimatedMinutes: 100,
    intro:
      "The course price API converts naira prices with the exchange-rate service. It works on a good day. The deliverable makes it the API Week 8 described: strictly typed, configured from a validated environment, resilient when the rate service is slow or broken, and matching its OpenAPI document.",
    atoms: [
      {
        id: "a-be-price-api",
        title: "The price API",
        explain:
          "Checklist for an integration-backed endpoint: configuration validated at startup (loadConfig, from Lesson 55) and passed in; every value typed, no any; the external call with a timeout from configuration, an Authorization header, an ok check and a schema; a cache with stale fallback; errors mapped to the API's format (503 RATES_UNAVAILABLE, never a hang or a stack trace); and an OpenAPI document that says all of that, served by the API itself.",
        nodeLab: {
          task:
            "Finish the price API. src/rates.ts: type it (no any) and make getRates(config) safe: timeout config.REQUEST_TIMEOUT_MS, Authorization header, ok check, zod validation, 10-minute cache, stale fallback under an hour, else throw RatesUnavailableError. src/app.ts: type the handler, answer { data: { code, currency, amount, stale } } (NGN needs no rates), 400 UNSUPPORTED_CURRENCY, 404 COURSE_NOT_FOUND, 503 RATES_UNAVAILABLE. openapi.yaml: document GET /courses/{id}/price (id path parameter, currency query parameter with enum NGN, USD, GBP, EUR; responses 200, 400, 404, 503) and components.schemas Price (required code, currency, amount, stale) and Error.",
          files: {
            "package.json": TS_PKG(["express", "zod", "yaml"], "node --env-file=.env src/server.ts"),
            "tsconfig.json": TSCONFIG,
            ".env": "RATES_API_URL=https://api.rates.example\nRATES_API_KEY=rates-key-123\nREQUEST_TIMEOUT_MS=2000\n",
            "src/types.ts": TYPES_TS,
            "src/data.ts": DATA_TS,
            "src/errors.ts": ERRORS_TS,
            "src/config.ts": CONFIG_TS,
            "src/server.ts": PRICE_SERVER_TS,
            "src/rates.ts": `import type { Config } from "./config.ts";

export class RatesUnavailableError extends Error {}

export async function getRates(config: Config): Promise<any> {
  const response = await fetch(\`\${config.RATES_API_URL}/v1/rates?base=NGN\`, {
    headers: { Authorization: \`Bearer \${config.RATES_API_KEY}\` },
  });
  const body: any = await response.json();
  return { rates: body.rates, stale: false };
}
`,
            "src/app.ts": `import { readFileSync } from "node:fs";
import express, { type NextFunction, type Request, type Response } from "express";
import YAML from "yaml";
import type { Config } from "./config.ts";
import { courses } from "./data.ts";
import { AppError } from "./errors.ts";
import { getRates } from "./rates.ts";

export function createApp(config: Config) {
  const app = express();
  const openapi: unknown = YAML.parse(readFileSync("openapi.yaml", "utf8"));

  app.get("/openapi.json", (req: Request, res: Response) => {
    res.json(openapi);
  });

  app.get("/courses/:id/price", async (req: any, res: any) => {
    const course = courses.find((c) => c.id === Number(req.params.id));
    const currency = req.query.currency || "NGN";
    const { rates } = await getRates(config);
    res.json({ code: course.code, currency, amount: course.price * rates[currency] });
  });

${ERROR_HANDLER_TS.replace(/^/gm, "  ").replace(/^  $/gm, "")}
  return app;
}
`,
            "openapi.yaml": "openapi: 3.1.0\ninfo:\n  title: Course Price API\n  version: 1.0.0\npaths: {}\n",
          },
          services: { [RATES_API]: RATES_SERVICE },
          readOnly: ["package.json", "tsconfig.json", ".env", "src/types.ts", "src/data.ts", "src/errors.ts", "src/config.ts", "src/server.ts"],
          open: "src/rates.ts",
          solution: { "src/rates.ts": RATES_TS, "src/app.ts": PRICE_APP_TS, "openapi.yaml": PRICE_OPENAPI },
          requests: [
            { label: "GET /courses/1/price?currency=USD", method: "GET", path: "/courses/1/price?currency=USD" },
            { label: "GET /courses/1/price", method: "GET", path: "/courses/1/price" },
            { label: "GET /openapi.json", method: "GET", path: "/openapi.json" },
          ],
          tests: [
            NO_TYPE_ERRORS,
            NO_ANY(["src/rates.ts", "src/app.ts"]),
            { label: "A rate service that hangs → 503 within the timeout", check: `const api = service("${RATES_API}"); api.locals.delayMs = 30000; const t0 = now(); const r = await get("/courses/1/price?currency=USD"); api.locals.delayMs = 0; eq([r.status, r.json?.error?.code], [503, "RATES_UNAVAILABLE"], "with no cached rates"); assert(now() - t0 < 3000, "answer within REQUEST_TIMEOUT_MS (2 s), took " + Math.round(now() - t0) + " ms");` },
            { label: "Bad data is not trusted", check: `const api = service("${RATES_API}"); api.locals.badData = true; const r = await get("/courses/1/price?currency=USD"); api.locals.badData = false; eq(r.status, 503, "rates: { USD: \\"cheap\\" } must not produce a price");` },
            { label: "Prices, NGN without the service, and errors", check: `const r = await get("/courses/1/price?currency=usd"); eq(r.json, { data: { code: "BE-101", currency: "USD", amount: 79.2, stale: false } }, "120000 NGN in USD"); const before = outgoing().length; eq((await get("/courses/2/price")).json, { data: { code: "DB-101", currency: "NGN", amount: 80000, stale: false } }, "NGN"); eq(outgoing().length, before, "NGN needs no call to the rate service"); eq((await get("/courses/1/price?currency=JPY")).json.error.code, "UNSUPPORTED_CURRENCY", "JPY"); eq((await get("/courses/99/price?currency=USD")).json.error.code, "COURSE_NOT_FOUND", "course 99");` },
            { label: "Cached, then stale during an outage", check: `const calls = () => outgoing().filter((o) => o.url.startsWith("${RATES_API}")).length; const before = calls(); await get("/courses/3/price?currency=GBP"); eq(calls(), before, "cached for 10 minutes"); await advance(11 * 60 * 1000); service("${RATES_API}").locals.failNext = 5; const r = await get("/courses/3/price?currency=GBP"); service("${RATES_API}").locals.failNext = 0; eq([r.status, r.json?.data?.stale], [200, true], "stale rates during an outage");` },
            { label: "openapi.yaml documents the endpoint, and the API matches it", check: `${DOC} const op = doc.paths?.["/courses/{id}/price"]?.get; assert(op, "document GET /courses/{id}/price"); const params = op.parameters || []; assert(params.some((p) => p.name === "id" && p.in === "path" && p.required === true), "the id path parameter (required)"); const cur = params.find((p) => p.name === "currency" && p.in === "query"); eq([...(cur?.schema?.enum || [])].sort(), ["EUR", "GBP", "NGN", "USD"], "the currency parameter's enum"); for (const c of ["200", "400", "404", "503"]) assert(op.responses?.[c], "document the response " + c); const price = doc.components?.schemas?.Price; eq([...(price?.required || [])].sort(), ["amount", "code", "currency", "stale"], "Price's required fields"); assert(doc.components?.schemas?.Error, "an Error schema"); const r = await get("/courses/2/price?currency=EUR"); for (const k of price.required) assert(k in r.json.data, "the response is missing " + k + ", which the document promises"); eq((await get("/openapi.json")).json, doc, "GET /openapi.json serves the document");` },
          ],
          hint: "Lesson 58's rates.js is most of src/rates.ts: add types (a RatesResult interface, the cache's type) and take the URL, key and timeout from config. In the handler, check the course and the currency first, answer NGN directly, and turn RatesUnavailableError into AppError(503, …).",
          successMessage: "A typed API that documents itself, checks its settings at startup, and keeps quoting prices while its rate provider has a bad day. That is Phase 2 done: next comes the database.",
        },
      },
    ],
    task: {
      title: "Week 8 deliverable: a typed, documented API that integrates with an external service",
      intro: "Build the price API on your computer in TypeScript, against a real exchange-rate API.",
      prompts: [
        "Create the project (npm install express zod yaml; npm install -D typescript @types/node @types/express) with the tsconfig.json from Week 3 and the files of Lesson 60.",
        "Sign up for a free exchange-rate API, put its URL and key in .env (never in git), and adapt the zod schema to its response.",
        "Run npx tsc --noEmit until it is clean, then test with curl: a normal price, an unknown currency, and the rate API's URL changed to one that does not exist.",
        "Serve openapi.yaml at /openapi.json, open it in an online Swagger UI or Redoc viewer, and check every response you saw with curl is described.",
        "Checkpoint: your TypeScript API matches its OpenAPI document, verifies webhook signatures (Lesson 59) and survives a slow or failing external service.",
      ],
      closing: "Next: Phase 3, databases: Week 9, relational fundamentals.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
