/**
 * FINAL CERTIFICATION EXAM — RELATIONAL DATABASES (RDBMS) & SQL
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate.
 *
 * Five domains follow the course's six stages. Every SQL `predict` item in
 * the bank is RUN on PostgreSQL 18 (PGlite) by `npm run validate:content`
 * against the preamble the candidate sees, and its expected output compared
 * with what PostgreSQL really returns.
 */

export const DOMAINS = [
  {
    id: "db-d1-foundations",
    name: "Data, databases, setup and basic SQL",
    short: "Foundations",
    items: { core: 4, advanced: 2 },
    covers: [
      "Data, information, DBMS and RDBMS",
      "Installing and connecting to PostgreSQL and MySQL",
      "CREATE TABLE, data types, INSERT and SELECT",
      "PostgreSQL and MySQL differences",
    ],
    review: ["db-m1-foundations", "db-m2-setup"],
  },
  {
    id: "db-d2-design",
    name: "Relational design, normalization and integrity",
    short: "Design",
    items: { core: 4, advanced: 2 },
    covers: [
      "Entities, relationships and cardinality",
      "Keys and ER diagrams",
      "Anomalies and 1NF, 2NF, 3NF, BCNF",
      "Constraints and referential actions",
    ],
    review: ["db-m3-design", "db-m4-normalization"],
  },
  {
    id: "db-d3-sql",
    name: "SQL: DDL, DML, querying and aggregation",
    short: "SQL",
    items: { core: 4, advanced: 2 },
    covers: [
      "CREATE, ALTER, DROP, identity columns and migrations",
      "INSERT, UPDATE, DELETE, RETURNING and parameters",
      "Filtering, NULL, sorting, pagination and CASE",
      "Aggregates, GROUP BY, HAVING and functions",
    ],
    review: ["db-m5-ddl", "db-m6-dml", "db-m7-querying", "db-m8-aggregation"],
  },
  {
    id: "db-d4-advanced",
    name: "Joins, analytics, transactions and concurrency",
    short: "Advanced SQL",
    items: { core: 4, advanced: 2 },
    covers: [
      "Joins, subqueries, EXISTS and set operations",
      "CTEs, views and window functions",
      "Transactions, ACID and savepoints",
      "Isolation levels, locks and deadlocks",
    ],
    review: ["db-m9-joins", "db-m10-analytics", "db-m11-transactions"],
  },
  {
    id: "db-d5-engineering",
    name: "Performance, programmability, operations and integration",
    short: "Engineering",
    items: { core: 4, advanced: 2 },
    covers: [
      "Indexes and EXPLAIN",
      "Functions, procedures and triggers",
      "Roles, injection, backups and recovery",
      "Application integration and the project lifecycle",
    ],
    review: ["db-m12-performance", "db-m13-programmability", "db-m14-operations", "db-m15-integration", "db-m16-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-db-final",
  version: "2026.1",
  courseId: "rdbms",
  courseCode: "DB-101",
  courseTitle: "Relational Databases (RDBMS) & SQL",
  title: "Memora Smart Certification — Relational Databases (RDBMS) & SQL",
  subtitle: "Foundations · Design · SQL · Advanced SQL · Engineering",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show a few small tables and a SQL query, and ask exactly what it returns: every one has been run on PostgreSQL 18, so the expected answer is what PostgreSQL really returns. The rest test judgement: design, normalization, SQL, transactions, indexes, security, backups and application integration.",

  requiresModules: [
    "db-m1-foundations",
    "db-m2-setup",
    "db-m3-design",
    "db-m4-normalization",
    "db-m5-ddl",
    "db-m6-dml",
    "db-m7-querying",
    "db-m8-aggregation",
    "db-m9-joins",
    "db-m10-analytics",
    "db-m11-transactions",
    "db-m12-performance",
    "db-m13-programmability",
    "db-m14-operations",
    "db-m15-integration",
    "db-m16-capstone",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 75,
  attemptLimit: null,
  /** No case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Relational Databases (RDBMS) & SQL",
    covers: "Database design & normalization • SQL from DDL to window functions • Transactions & indexing • Security, backup & recovery • PostgreSQL, MySQL & application integration",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
