/**
 * FINAL CERTIFICATION EXAM — BACKEND ENGINEERING WITH NODE.JS
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate.
 *
 * Six domains follow the course's six phases. The questions are scenarios and
 * judgement calls from real backend work: what a response, log, query plan or
 * design means, and what to do about it.
 */

export const DOMAINS = [
  {
    id: "be-d1-foundations",
    name: "The web, JavaScript, TypeScript, tools and Node.js",
    short: "Foundations",
    items: { core: 4, advanced: 2 },
    covers: [
      "How web applications, HTTP and servers work",
      "JavaScript, asynchronous code and TypeScript",
      "Git, the terminal, npm and environment variables",
      "The Node.js runtime, modules, files, streams and HTTP",
    ],
    review: ["be-w1-web", "be-w2-javascript", "be-w3-async-ts", "be-w4-tools", "be-w5-node"],
  },
  {
    id: "be-d2-apis",
    name: "HTTP, REST, Express and API design",
    short: "APIs",
    items: { core: 4, advanced: 2 },
    covers: [
      "Methods, status codes, headers and REST resources",
      "Express routing, middleware and error handling",
      "Validation, pagination, versioning and OpenAPI",
      "External services, webhooks and uploads",
    ],
    review: ["be-w6-http-rest", "be-w7-express", "be-w8-api-design"],
  },
  {
    id: "be-d3-data",
    name: "Relational databases, SQL, Node.js and PostgreSQL",
    short: "Data",
    items: { core: 4, advanced: 2 },
    covers: [
      "Relational design, keys, constraints and normalization",
      "SQL queries, joins, aggregation and transactions",
      "node-postgres, Prisma, migrations and SQL injection",
      "Indexes, query plans, N+1 queries and caching",
    ],
    review: ["be-w9-relational", "be-w10-sql", "be-w11-node-postgres", "be-w12-db-performance"],
  },
  {
    id: "be-d4-security-quality",
    name: "Authentication, security, testing and reliability",
    short: "Security & quality",
    items: { core: 4, advanced: 2 },
    covers: [
      "Passwords, sessions, tokens and account flows",
      "Authorization, the OWASP API risks and secrets",
      "Unit, integration and authorization tests",
      "Error handling, retries, idempotency and health checks",
    ],
    review: ["be-w13-authentication", "be-w14-security", "be-w15-testing", "be-w16-reliability"],
  },
  {
    id: "be-d5-production",
    name: "Architecture, advanced capabilities, delivery and operations",
    short: "Production",
    items: { core: 4, advanced: 2 },
    covers: [
      "Layers, modules, dependency injection and refactoring",
      "Background jobs, caching, WebSockets and events",
      "Docker, Compose, CI/CD and migrations in deployment",
      "Performance, metrics, alerting, backups and incidents",
    ],
    review: ["be-w17-architecture", "be-w18-advanced", "be-w19-devops", "be-w20-operations"],
  },
  {
    id: "be-d6-capstone",
    name: "System design, implementation, hardening and defense",
    short: "Capstone",
    items: { core: 4, advanced: 2 },
    covers: [
      "Requirements, user stories and measurable criteria",
      "Schema, API contract, access matrix and threat model",
      "Building, testing and releasing an MVP",
      "Presenting and defending engineering decisions",
    ],
    review: ["be-w21-system-design", "be-w22-implementation", "be-w23-hardening", "be-w24-defense"],
  },
];

export const BLUEPRINT = {
  id: "mst-be-final",
  version: "2026.1",
  courseId: "backend-engineering",
  courseCode: "BE-101",
  courseTitle: "Backend Engineering with Node.js",
  title: "Memora Smart Certification — Backend Engineering with Node.js",
  subtitle: "Foundations · APIs · Data · Security & quality · Production · Capstone",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "The questions are situations from real backend work: an HTTP response, a log line, a query plan, a failing test, a design under review. Each asks what it means or what you would do, and every option is something a working engineer might plausibly choose.",

  requiresModules: [
    "be-w1-web",
    "be-w2-javascript",
    "be-w3-async-ts",
    "be-w4-tools",
    "be-w5-node",
    "be-w6-http-rest",
    "be-w7-express",
    "be-w8-api-design",
    "be-w9-relational",
    "be-w10-sql",
    "be-w11-node-postgres",
    "be-w12-db-performance",
    "be-w13-authentication",
    "be-w14-security",
    "be-w15-testing",
    "be-w16-reliability",
    "be-w17-architecture",
    "be-w18-advanced",
    "be-w19-devops",
    "be-w20-operations",
    "be-w21-system-design",
    "be-w22-implementation",
    "be-w23-hardening",
    "be-w24-defense",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 90,
  attemptLimit: null,
  /** No case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Backend Engineering with Node.js",
    covers: "REST APIs with Node.js, Express & TypeScript • PostgreSQL, SQL & Prisma • Authentication, security & testing • Reliability, architecture & background work • Docker, CI/CD & operations",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
