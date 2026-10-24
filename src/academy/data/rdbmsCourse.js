/**
 * RELATIONAL DATABASES (RDBMS) & SQL
 *
 * Authored from the Memora Smart Technologies RDBMS curriculum: six stages
 * over sixteen weeks, from what data is (Week 1) to a complete, documented
 * database project (Week 16). PostgreSQL is the main database throughout, as
 * the curriculum specifies; MySQL is installed and used alongside it from
 * Week 2, so a graduate can work on either. Week 2's topics 2.2 and 2.12 (MySQL
 * installation, and the two databases side by side) were added to the source
 * table for that reason.
 *
 * Course content is DATA, never markup, in exactly the shape of the other
 * courses, so the catalog, sidebar, player, progress engine and stats band
 * render it without a change.
 *
 * ── THE PRACTICE IS REAL SQL ON A REAL SERVER ────────────────────────────
 * Every SQL lab (`sqlLab`) and example (`sqlDemo`) runs on PostgreSQL 18 in
 * the page: PGlite, the PostgreSQL server compiled to WebAssembly (see
 * src/academy/sql/). Results, command tags, NOTICEs and errors are
 * PostgreSQL's own. `npm run validate:content` runs every lab on the same
 * engine in Node: its model answer must pass every check and its starter
 * must not. Terminal exercises replay sessions RECORDED on real PostgreSQL
 * 18.6 and MySQL 8.4 LTS servers (scripts/dbRecord.mjs), so installation,
 * psql, mysql, concurrency, backups and the Node.js backend show real output.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the source document's topic list for that
 * week, numbered N.1, N.2 … with N.P for the week's practical lab and
 * `checkpoint` holding its checkpoint. Every lesson declares the numbers it
 * `covers`, and `npm run test:academy` fails if any topic is not taught.
 */

export const RDBMS_COURSE = {
  id: "rdbms",
  slug: "rdbms",
  title: "Relational Databases (RDBMS) & SQL",
  subtitle: "Design, query and run real databases with PostgreSQL and MySQL",
  tagline:
    "From what data is to a complete, secured, backed-up database behind a working application.",
  description:
    "Sixteen weeks that take you from what data is to designing, building, querying, securing and operating real relational databases. You install PostgreSQL and MySQL on your own computer and learn their tools, then design databases properly: entities, relationships, keys, ER diagrams, normalization and the constraints that stop bad data getting in. Then SQL in depth: creating and changing structure, adding and changing records safely, filtering, grouping and reporting, joins and subqueries, CTEs, views and window functions. Then the professional work: transactions and concurrency, indexes and query plans, functions, procedures and triggers, roles and permissions, SQL injection, backups you have actually restored, and connecting a Node.js backend. The course ends with a capstone database you design, build, test, document and present. Every lesson makes you write SQL, run on a real PostgreSQL server in the page and checked before you move on.",

  status: "live",
  level: "Beginner → Professional",
  durationMonths: 4,
  hoursPerWeek: "8–10",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "postgresql",
      name: "PostgreSQL 18, psql & pgAdmin",
      short: "PostgreSQL",
      blurb: "The course's main database: installed on your computer and running in every lesson.",
      icon: "fas fa-database",
      accent: "#336791",
    },
    {
      id: "mysql",
      name: "MySQL 8.4 LTS & MySQL Workbench",
      short: "MySQL",
      blurb: "The other most-used open-source database, installed alongside PostgreSQL.",
      icon: "fas fa-server",
      accent: "#00758f",
    },
    {
      id: "sql",
      name: "SQL: DDL, DML, queries & analytics",
      short: "SQL",
      blurb: "Tables and constraints, safe changes, joins, aggregates, CTEs and window functions.",
      icon: "fas fa-table",
      accent: "#7c3aed",
    },
    {
      id: "engineering",
      name: "Transactions, indexes, security & Node.js",
      short: "Engineering",
      blurb: "Concurrency, query plans, triggers, roles, backups and a backend that uses it all.",
      icon: "fas fa-gears",
      accent: "#0f766e",
    },
  ],

  outcomes: [
    "Explain what databases and relational database management systems are, and when a spreadsheet is no longer enough",
    "Install, connect to and use PostgreSQL and MySQL with their command-line and graphical tools",
    "Turn business requirements into entities, relationships, keys and a readable ER diagram",
    "Normalize a design to Third Normal Form and enforce it with keys and constraints",
    "Create and change database structure safely, and add, change and remove records without damaging data",
    "Write SQL that filters, sorts, groups, joins and summarises data accurately, including CTEs and window functions",
    "Use transactions and isolation levels to keep data correct when many users work at once",
    "Diagnose slow queries with EXPLAIN and fix them with the right index",
    "Encapsulate logic in views, functions, procedures and triggers, and know when not to",
    "Secure a database with roles and least privilege, prevent SQL injection, and prove backups by restoring them",
    "Connect a backend application to PostgreSQL with parameterized queries, pooling and migrations",
  ],

  audience: [
    "Complete beginners who want to understand and work with databases",
    "Data analysts who use SQL and want to design and run databases properly",
    "Web and mobile developers whose applications need a database",
    "Anyone heading for a database, backend, data engineering or analyst role",
  ],

  requirements: [
    "A laptop or desktop computer (Windows, macOS or Linux)",
    "A stable internet connection",
    "Permission to install free software: PostgreSQL, MySQL and Node.js",
    "No previous database or programming experience is needed",
  ],

  /** Six stages; `weeks` are module orders. */
  phases: [
    { phase: 1, title: "Database foundations", weeks: [1, 2] },
    { phase: 2, title: "Relational database design", weeks: [3, 4] },
    { phase: 3, title: "SQL mastery", weeks: [5, 6, 7, 8] },
    { phase: 4, title: "Advanced SQL querying", weeks: [9, 10] },
    { phase: 5, title: "Professional database engineering", weeks: [11, 12, 13, 14] },
    { phase: 6, title: "Integration and portfolio", weeks: [15, 16] },
  ],

  months: [
    /* ═══════════════════════ MONTH 1 ═══════════════════════ */
    {
      month: 1,
      title: "Month 1 · Foundations and Database Design",
      focus: "Foundation",
      summary:
        "What data and databases are, PostgreSQL and MySQL installed and running, and how to design a relational database properly.",
      modules: [
        {
          id: "db-m1-foundations",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Week 1 · Understanding Data and Databases",
          summary:
            "Data, information and knowledge; structured and unstructured data; why databases exist; DBMS and RDBMS; servers, databases, tables, rows and columns; and the relational model.",
          objective:
            "Explain what a database is, why it exists, and how a relational database organizes information.",
          atoms: 22,
          topics: [
            "Data, information and knowledge",
            "Why databases exist",
            "Database systems, PostgreSQL and SQL",
            "How relational databases organize data",
          ],
          curriculum: [
            ["1.1", "What data is versus information"],
            ["1.2", "Raw facts, meaningful information, and knowledge"],
            ["1.3", "Structured, semi-structured, and unstructured data"],
            ["1.4", "Real-world examples: student records, sales, payments, and job applications"],
            ["1.5", "Managing records with paper, spreadsheets, and databases"],
            ["1.6", "Problems caused by duplicate records and inconsistent information"],
            ["1.7", "Data loss, concurrent updates, and difficulty retrieving information"],
            ["1.8", "When a spreadsheet is sufficient and when a database is more suitable"],
            ["1.9", "Database versus database management system (DBMS)"],
            ["1.10", "What a relational database management system (RDBMS) does"],
            ["1.11", "Database server, database, table, row, and column"],
            ["1.12", "Introduction to PostgreSQL and SQL"],
            ["1.13", "A high-level overview of how applications communicate with databases"],
            ["1.14", "Relations and tables"],
            ["1.15", "Records and attributes"],
            ["1.16", "Domains and data types"],
            ["1.17", "The relational model and its underlying ideas"],
            ["1.18", "How tables represent different aspects of a real-world system"],
            ["1.P", "Practical: inspect a messy student-registration spreadsheet and identify the problems a relational database should solve"],
          ],
          project:
            "Inspect a messy student-registration spreadsheet and identify which problems a relational database should solve.",
          checkpoint:
            "Given a business scenario, the learner can explain why a database is needed and identify the likely entities and attributes.",
        },
        {
          id: "db-m2-setup",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Week 2 · Database Setup and Basic SQL",
          summary:
            "PostgreSQL and MySQL installed on Windows, macOS or Linux; psql, pgAdmin and the mysql client; databases and schemas; CREATE TABLE, data types, INSERT and SELECT; readable SQL and its errors.",
          objective:
            "Set up a working database environment and create, inspect, and query a basic table.",
          atoms: 30,
          topics: [
            "Installing PostgreSQL and MySQL",
            "psql, pgAdmin, the mysql client and connecting",
            "Databases, schemas and CREATE TABLE",
            "Data types, INSERT and SELECT",
            "Readable SQL and syntax errors",
          ],
          curriculum: [
            ["2.1", "Installing or accessing PostgreSQL"],
            ["2.2", "Installing MySQL and connecting with the mysql client"],
            ["2.3", "Understanding PostgreSQL tools and connecting to a server"],
            ["2.4", "Creating a database and understanding database schemas"],
            ["2.5", "Creating tables using CREATE TABLE"],
            ["2.6", "Choosing appropriate data types: INTEGER, NUMERIC, TEXT, BOOLEAN, and date/time types"],
            ["2.7", "Inserting records using INSERT"],
            ["2.8", "Reading records using SELECT"],
            ["2.9", "Selecting individual columns and using column aliases"],
            ["2.10", "Understanding SQL statement structure and syntax errors"],
            ["2.11", "Writing readable SQL with consistent formatting"],
            ["2.12", "PostgreSQL and MySQL side by side: what changes between them"],
            ["2.P", "Practical: a student database of names, email addresses, enrollment dates, and course interests"],
          ],
          project:
            "Create a student database containing student names, email addresses, enrollment dates, and course interests.",
          checkpoint:
            "The learner independently creates a database and table, inserts sample data, and retrieves selected columns.",
        },
        {
          id: "db-m3-design",
          order: 3,
          phase: 2,
          week: "Week 3",
          title: "Week 3 · Entities, Relationships, Keys and ER Diagrams",
          summary:
            "Entities and attributes, one-to-one, one-to-many and many-to-many relationships, participation, candidate, primary, foreign and composite keys, natural and surrogate keys, and ER diagrams turned into tables.",
          objective:
            "Translate a real-world problem into a relational data model before writing SQL.",
          atoms: 22,
          topics: [
            "Entity identification",
            "Relationships and business rules",
            "Keys",
            "Entity-relationship diagrams",
          ],
          curriculum: [
            ["3.1", "What an entity represents"],
            ["3.2", "Entities versus attributes"],
            ["3.3", "Strong and dependent entities"],
            ["3.4", "Identifying entities in a school, shop, hospital, or job platform"],
            ["3.5", "One-to-one relationships"],
            ["3.6", "One-to-many relationships"],
            ["3.7", "Many-to-many relationships"],
            ["3.8", "Relationship participation and optionality"],
            ["3.9", "How business rules determine relationships"],
            ["3.10", "Candidate keys and superkeys"],
            ["3.11", "Primary keys"],
            ["3.12", "Foreign keys"],
            ["3.13", "Composite keys"],
            ["3.14", "Natural keys versus surrogate keys"],
            ["3.15", "Why names, phone numbers, and other changeable values are often poor primary keys"],
            ["3.16", "ERD notation: entities, attributes, and relationships"],
            ["3.17", "Cardinality and optionality"],
            ["3.18", "Converting requirements into an ERD"],
            ["3.19", "Translating an ERD into relational tables"],
            ["3.P", "Practical: an ERD for an academy where students enroll in courses, complete lessons, and receive certificates"],
          ],
          project:
            "Design an ERD for an academy where students enroll in courses, complete lessons, and receive certificates.",
          checkpoint:
            "Produce a readable ERD with correctly identified entities, keys, and relationships.",
        },
        {
          id: "db-m4-normalization",
          order: 4,
          phase: 2,
          week: "Week 4",
          title: "Week 4 · Normalization and Data Integrity",
          summary:
            "Update, insertion and deletion anomalies, First, Second and Third Normal Form, functional dependencies, BCNF and denormalization, and the constraints and referential actions that keep data consistent.",
          objective:
            "Design a database that minimizes duplication and protects the consistency of information.",
          atoms: 24,
          topics: [
            "The problems of poor database design",
            "First, Second and Third Normal Form",
            "BCNF and denormalization",
            "Integrity constraints and referential actions",
          ],
          curriculum: [
            ["4.1", "Repeated data and update anomalies"],
            ["4.2", "Insertion anomalies"],
            ["4.3", "Deletion anomalies"],
            ["4.4", "Why storing multiple values in one field causes problems"],
            ["4.5", "First Normal Form: atomic values"],
            ["4.6", "First Normal Form: repeating groups"],
            ["4.7", "Moving repeated values into related records"],
            ["4.8", "Functional dependencies"],
            ["4.9", "Second Normal Form: partial dependencies"],
            ["4.10", "Why composite keys matter"],
            ["4.11", "Third Normal Form: transitive dependencies"],
            ["4.12", "Separating facts that belong to different entities"],
            ["4.13", "Applying normalization without losing meaningful relationships"],
            ["4.14", "A brief introduction to Boyce–Codd Normal Form (BCNF)"],
            ["4.15", "When denormalization may be useful"],
            ["4.16", "Trade-offs between data consistency and read performance"],
            ["4.17", "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, and CHECK"],
            ["4.18", "Default values"],
            ["4.19", "Referential integrity"],
            ["4.20", "ON DELETE and ON UPDATE actions"],
            ["4.21", "Cascading actions and when they can be dangerous"],
            ["4.P", "Practical: normalize a badly designed enrollment table and implement it with constraints"],
          ],
          project:
            "Take a badly designed enrollment table, identify its anomalies, normalize it, and implement the resulting tables with constraints.",
          checkpoint:
            "Explain why each table exists and demonstrate that invalid data is rejected by the database.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 2 ═══════════════════════ */
    {
      month: 2,
      title: "Month 2 · SQL Mastery",
      focus: "SQL",
      summary:
        "Create and change structure, change records safely, and retrieve and summarise exactly the information a business needs.",
      modules: [
        {
          id: "db-m5-ddl",
          order: 5,
          phase: 3,
          week: "Week 5",
          title: "Week 5 · Data Definition Language (DDL)",
          summary:
            "CREATE DATABASE, SCHEMA and TABLE, columns and keys, ALTER, DROP and TRUNCATE, identity columns and MySQL's AUTO_INCREMENT, naming conventions, object dependencies and migrations.",
          objective: "Create and maintain the structure of a relational database.",
          atoms: 14,
          topics: [
            "Creating databases, schemas and tables",
            "Changing and removing structure",
            "Identity columns and naming",
            "Dependencies and migrations",
          ],
          curriculum: [
            ["5.1", "CREATE DATABASE, CREATE TABLE, and CREATE SCHEMA"],
            ["5.2", "Defining columns and data types"],
            ["5.3", "Primary keys and foreign keys"],
            ["5.4", "ALTER TABLE to add, modify, and remove schema elements"],
            ["5.5", "DROP TABLE and TRUNCATE TABLE"],
            ["5.6", "Identity columns and generated identifiers"],
            ["5.7", "Naming conventions for tables, columns, and constraints"],
            ["5.8", "Dependencies between database objects"],
            ["5.9", "Schema changes and migration fundamentals"],
            ["5.P", "Practical: the foundational schema of an online store, built from one script"],
          ],
          project:
            "Build the foundational schema for an online store with customers, products, orders, and order items.",
          checkpoint:
            "Deliver a SQL script that builds the database schema from scratch in the correct dependency order.",
        },
        {
          id: "db-m6-dml",
          order: 6,
          phase: 3,
          week: "Week 6",
          title: "Week 6 · Data Manipulation Language (DML)",
          summary:
            "INSERT, UPDATE and DELETE with conditions, RETURNING, related records and foreign keys, NULL, the missing WHERE clause, checking affected rows, and parameterized SQL.",
          objective: "Safely add, change, and remove database records.",
          atoms: 14,
          topics: [
            "INSERT, UPDATE and DELETE",
            "RETURNING and related records",
            "NULL and safe destructive operations",
            "Parameterized SQL",
          ],
          curriculum: [
            ["6.1", "INSERT INTO for one or multiple records"],
            ["6.2", "UPDATE with conditions"],
            ["6.3", "DELETE with conditions"],
            ["6.4", "RETURNING in PostgreSQL"],
            ["6.5", "Updating multiple columns"],
            ["6.6", "Inserting related records while preserving foreign keys"],
            ["6.7", "Handling NULL: why NULL is not zero or an empty string"],
            ["6.8", "The impact of missing WHERE clauses"],
            ["6.9", "Validating affected rows before destructive operations"],
            ["6.10", "Parameterized SQL and why user input must not be concatenated into SQL strings"],
            ["6.P", "Practical: manage product inventory, customers, order statuses, and cancellations"],
          ],
          project:
            "Manage product inventory, customer information, order statuses, and cancellations using SQL.",
          checkpoint:
            "Complete a set of record-management tasks and demonstrate safe handling of updates and deletions.",
        },
        {
          id: "db-m7-querying",
          order: 7,
          phase: 3,
          week: "Week 7",
          title: "Week 7 · Querying and Filtering Data",
          summary:
            "SELECT expressions, WHERE and its operators, IN, BETWEEN, LIKE and ILIKE, NULL tests, sorting, pagination, DISTINCT, calculated columns, CASE, precedence, and debugging wrong results.",
          objective: "Retrieve precisely the information required from a database.",
          atoms: 16,
          topics: [
            "SELECT, WHERE and logic",
            "Pattern matching and NULL",
            "Sorting, pagination and DISTINCT",
            "Calculations, CASE and debugging",
          ],
          curriculum: [
            ["7.1", "SELECT and column expressions"],
            ["7.2", "WHERE and comparison operators"],
            ["7.3", "AND, OR, and NOT"],
            ["7.4", "IN, BETWEEN, LIKE, and ILIKE"],
            ["7.5", "IS NULL and IS NOT NULL"],
            ["7.6", "ORDER BY and sorting by multiple columns"],
            ["7.7", "LIMIT and pagination concepts"],
            ["7.8", "DISTINCT and duplicate result elimination"],
            ["7.9", "Arithmetic expressions and calculated columns"],
            ["7.10", "CASE expressions for conditional results"],
            ["7.11", "Operator precedence and parentheses"],
            ["7.12", "Reading SQL errors and debugging incorrect query results"],
            ["7.P", "Practical: query the academy database for active students, courses, enrollment dates, and learners who have not completed"],
          ],
          project:
            "Query an academy database to find active students, courses, enrollment dates, and learners who have not completed a course.",
          checkpoint:
            "Solve progressively harder retrieval tasks without changing the underlying data.",
        },
        {
          id: "db-m8-aggregation",
          order: 8,
          phase: 3,
          week: "Week 8",
          title: "Week 8 · Aggregation, Grouping and SQL Functions",
          summary:
            "COUNT, SUM, AVG, MIN and MAX, GROUP BY and HAVING, NULL in aggregates, string, numeric and date functions, conditional aggregation and the mistakes that duplicate rows.",
          objective: "Turn raw records into useful summaries and business insights.",
          atoms: 15,
          topics: [
            "Aggregates and GROUP BY",
            "HAVING and NULL",
            "String, numeric and date functions",
            "Conditional aggregation and grouping mistakes",
          ],
          curriculum: [
            ["8.1", "Aggregate functions: COUNT, SUM, AVG, MIN, and MAX"],
            ["8.2", "GROUP BY and grouping by multiple columns"],
            ["8.3", "HAVING versus WHERE"],
            ["8.4", "Handling NULL in aggregates"],
            ["8.5", "String functions for cleaning and formatting text"],
            ["8.6", "Numeric functions and rounding"],
            ["8.7", "Date/time extraction, intervals, and date calculations"],
            ["8.8", "Conditional aggregation using CASE"],
            ["8.9", "Combining several aggregates in a single query"],
            ["8.10", "Common mistakes involving grouping and duplicated rows"],
            ["8.P", "Practical: enrollment counts, completion rates, average scores, and revenue by month"],
          ],
          project:
            "Produce a report showing course enrollment counts, completion rates, average assessment scores, and revenue by month using a supplied dataset.",
          checkpoint:
            "Build an accurate summary report and explain how each aggregate is calculated.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 3 ═══════════════════════ */
    {
      month: 3,
      title: "Month 3 · Advanced SQL and Database Engineering",
      focus: "Engineering",
      summary:
        "Joins, subqueries, CTEs and window functions, then transactions, indexes and the logic a database can run itself.",
      modules: [
        {
          id: "db-m9-joins",
          order: 9,
          phase: 4,
          week: "Week 9",
          title: "Week 9 · Joins, Subqueries and Set Operations",
          summary:
            "Inner, outer and self joins, joining many tables and junction tables, how join conditions and duplicated rows change results, scalar and correlated subqueries, EXISTS, and UNION, INTERSECT and EXCEPT.",
          objective: "Retrieve meaningful results from multiple related tables.",
          atoms: 17,
          topics: [
            "Inner and outer joins",
            "Self joins, many tables and junction tables",
            "Join conditions and multiplied rows",
            "Subqueries and EXISTS",
            "Set operations and duplicates",
          ],
          curriculum: [
            ["9.1", "Why related information is stored across multiple tables"],
            ["9.2", "INNER JOIN"],
            ["9.3", "LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN"],
            ["9.4", "Self joins"],
            ["9.5", "Joining three or more tables"],
            ["9.6", "Joining through junction tables for many-to-many relationships"],
            ["9.7", "Table aliases and qualified column names"],
            ["9.8", "How join conditions affect results"],
            ["9.9", "Why joins can accidentally multiply rows"],
            ["9.10", "Scalar and correlated subqueries"],
            ["9.11", "EXISTS and NOT EXISTS"],
            ["9.12", "UNION, UNION ALL, INTERSECT, and EXCEPT"],
            ["9.13", "Identifying and correcting duplicate-result problems"],
            ["9.P", "Practical: a report joining students, courses, enrollments, lessons, and certificates"],
          ],
          project:
            "Produce a report joining students, courses, enrollments, lessons, and certificates.",
          checkpoint:
            "Solve multi-table business questions and explain why a particular join type is appropriate.",
        },
        {
          id: "db-m10-analytics",
          order: 10,
          phase: 4,
          week: "Week 10",
          title: "Week 10 · CTEs, Views and Analytical SQL",
          summary:
            "Common table expressions and recursive CTEs, views and materialized views, window functions, ranking, PARTITION BY, running totals, moving averages, LAG and LEAD, top-N per group and cohort analysis.",
          objective: "Write maintainable queries and perform more advanced analysis.",
          atoms: 15,
          topics: [
            "CTEs and recursive CTEs",
            "Views and materialized views",
            "Window functions and ranking",
            "Running totals, LAG and LEAD",
            "Top-N per group and cohorts",
          ],
          curriculum: [
            ["10.1", "Common Table Expressions (CTEs) using WITH"],
            ["10.2", "Breaking complex queries into understandable steps"],
            ["10.3", "Recursive CTE fundamentals"],
            ["10.4", "Views and their role in reusable queries"],
            ["10.5", "Materialized views and refresh concepts"],
            ["10.6", "Window functions: grouped versus row-level calculations"],
            ["10.7", "ROW_NUMBER, RANK, and DENSE_RANK"],
            ["10.8", "PARTITION BY and window ordering"],
            ["10.9", "Running totals and moving averages"],
            ["10.10", "LAG and LEAD"],
            ["10.11", "Top-N records within groups"],
            ["10.12", "Introductory cohort and completion analysis"],
            ["10.P", "Practical: a learner-performance report with rankings, running totals and monthly completion rates"],
          ],
          project:
            "Build a learner-performance report ranking students within courses, calculating running enrollment totals, and comparing monthly completion rates.",
          checkpoint:
            "Deliver a readable analytical query using CTEs and at least two window functions.",
        },
        {
          id: "db-m11-transactions",
          order: 11,
          phase: 5,
          week: "Week 11",
          title: "Week 11 · Transactions and Concurrency Control",
          summary:
            "Transactions and ACID, BEGIN, COMMIT, ROLLBACK and savepoints, concurrent users, lost updates, isolation levels, locks, deadlocks and retries, and why money and stock need all of it.",
          objective:
            "Ensure that database operations remain consistent, even when multiple operations or users interact.",
          atoms: 16,
          topics: [
            "Transactions and ACID",
            "BEGIN, COMMIT, ROLLBACK and savepoints",
            "Concurrent users and lost updates",
            "Isolation levels, locks and deadlocks",
          ],
          curriculum: [
            ["11.1", "What a database transaction is and why it matters"],
            ["11.2", "Atomicity: all or nothing"],
            ["11.3", "Consistency: preserve database rules"],
            ["11.4", "Isolation: manage concurrent operations"],
            ["11.5", "Durability: committed changes persist according to the system's guarantees"],
            ["11.6", "BEGIN, COMMIT, and ROLLBACK"],
            ["11.7", "Savepoints and partial rollback"],
            ["11.8", "Transaction boundaries"],
            ["11.9", "Concurrent users reading and changing the same records"],
            ["11.10", "Lost updates and other concurrency problems"],
            ["11.11", "Isolation levels and their trade-offs"],
            ["11.12", "Deadlocks, locks, and retry strategies"],
            ["11.13", "Why financial transfers and inventory updates need transactions"],
            ["11.P", "Practical: a bank transfer that is rolled back when any part of it fails"],
          ],
          project:
            "Simulate a bank transfer between two accounts and demonstrate that if one part fails, the transaction is rolled back rather than leaving an incomplete transfer.",
          checkpoint:
            "Write and test a multi-step transaction that preserves account balances and rejects invalid transfers.",
        },
        {
          id: "db-m12-performance",
          order: 12,
          phase: 5,
          week: "Week 12",
          title: "Week 12 · Indexing and Query Performance",
          summary:
            "How databases find rows, B-tree, composite, partial and expression indexes, EXPLAIN and EXPLAIN ANALYZE, scan types and join strategies, efficient queries, and measuring before and after.",
          objective: "Diagnose slow queries and make evidence-based performance improvements.",
          atoms: 23,
          topics: [
            "How databases find records",
            "Index fundamentals",
            "Query analysis with EXPLAIN",
            "Performance optimization",
          ],
          curriculum: [
            ["12.1", "Sequential scans and index scans"],
            ["12.2", "Why searching every row can become expensive"],
            ["12.3", "The trade-off between storage, write performance, and read speed"],
            ["12.4", "What an index is"],
            ["12.5", "Primary-key and unique indexes"],
            ["12.6", "B-tree indexes"],
            ["12.7", "Single-column and composite indexes"],
            ["12.8", "Index column order"],
            ["12.9", "Partial and expression indexes"],
            ["12.10", "Using EXPLAIN"],
            ["12.11", "Reading basic execution plans"],
            ["12.12", "Using EXPLAIN ANALYZE carefully"],
            ["12.13", "Estimated versus actual row counts"],
            ["12.14", "Understanding scan types and join strategies"],
            ["12.15", "Filtering and joining efficiently"],
            ["12.16", "Identifying unnecessary data retrieval"],
            ["12.17", "Avoiding premature indexing"],
            ["12.18", "Recognizing inefficient query patterns"],
            ["12.19", "Measuring before-and-after performance"],
            ["12.20", "The effect of indexes on INSERT, UPDATE, and DELETE"],
            ["12.P", "Practical: measure a slow query on a large orders dataset, index it, and compare the plans"],
          ],
          project:
            "Generate a sizable synthetic orders dataset, measure a slow query, introduce a suitable index, and compare the execution plans.",
          checkpoint:
            "Submit a performance investigation with evidence explaining which changes improved performance and which did not.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 4 ═══════════════════════ */
    {
      month: 4,
      title: "Month 4 · Operating Databases, Applications and the Capstone",
      focus: "Production",
      summary:
        "Logic in the database, security, backups and operations, a backend connected to PostgreSQL, and a capstone database you present.",
      modules: [
        {
          id: "db-m13-programmability",
          order: 13,
          phase: 5,
          week: "Week 13",
          title: "Week 13 · Views, Functions, Procedures and Triggers",
          summary:
            "Views and materialized views, SQL and PL/pgSQL functions, conditions and loops, procedures and CALL, BEFORE and AFTER triggers, row and statement triggers, audit trails, and the risks of hidden logic.",
          objective:
            "Encapsulate reusable database logic and understand how the database can enforce business rules.",
          atoms: 15,
          topics: [
            "Views and materialized views",
            "Functions and PL/pgSQL",
            "Procedures and CALL",
            "Triggers and audit trails",
          ],
          curriculum: [
            ["13.1", "Creating and maintaining views"],
            ["13.2", "When materialized views are appropriate"],
            ["13.3", "PostgreSQL functions and return types"],
            ["13.4", "Parameters and return values"],
            ["13.5", "Basic PL/pgSQL syntax"],
            ["13.6", "Conditional statements and loops"],
            ["13.7", "Stored procedures and CALL"],
            ["13.8", "Trigger fundamentals and trigger timing"],
            ["13.9", "Row-level versus statement-level triggers"],
            ["13.10", "Audit trails and change history"],
            ["13.11", "Validation inside the database versus application code"],
            ["13.12", "Trigger risks, debugging, and hidden side effects"],
            ["13.P", "Practical: an audit mechanism that records changes to enrollment status and product inventory"],
          ],
          project:
            "Build an audit mechanism that records changes to important records, such as enrollment status or product inventory.",
          checkpoint:
            "Implement a reusable database function and an auditable change mechanism, explaining the trade-offs of each.",
        },
        {
          id: "db-m14-operations",
          order: 14,
          phase: 5,
          week: "Week 14",
          title: "Week 14 · Database Security, Administration and Recovery",
          summary:
            "Roles, GRANT and REVOKE and least privilege, SQL injection, credentials, network access and encryption, auditing, pg_dump, pg_restore and mysqldump, RPO and RTO, monitoring, logs, maintenance and migrations.",
          objective: "Operate a database responsibly and protect its data.",
          atoms: 25,
          topics: [
            "Users and permissions",
            "Secure database applications",
            "Backup and recovery",
            "Database operations",
          ],
          curriculum: [
            ["14.1", "Database roles and role membership"],
            ["14.2", "GRANT and REVOKE"],
            ["14.3", "Least-privilege access"],
            ["14.4", "Separating application, reporting, and administrative permissions"],
            ["14.5", "Schema and table permissions"],
            ["14.6", "SQL injection and parameterized queries"],
            ["14.7", "Safe handling of credentials and connection strings"],
            ["14.8", "Restricting network access"],
            ["14.9", "Encryption in transit and protection of stored data"],
            ["14.10", "Avoiding unnecessary access to personal information"],
            ["14.11", "Auditing privileged operations"],
            ["14.12", "Logical versus physical backups"],
            ["14.13", "Using PostgreSQL's pg_dump and pg_restore"],
            ["14.14", "Restoring a backup into a test environment"],
            ["14.15", "Backup scheduling and retention"],
            ["14.16", "Recovery objectives: RPO and RTO"],
            ["14.17", "Why a backup is not proven until restoration has been tested"],
            ["14.18", "Monitoring connections and database health"],
            ["14.19", "Understanding logs and common operational failures"],
            ["14.20", "Basic maintenance and statistics"],
            ["14.21", "Environment separation: development, testing, and production"],
            ["14.22", "Introduction to schema migration workflows"],
            ["14.P", "Practical: separate roles, a backup, a restore into a separate environment, and verified data"],
          ],
          project:
            "Create separate application and administrator roles, restrict their permissions, back up the database, restore it into a separate environment, and verify the restored data.",
          checkpoint:
            "Produce a security and recovery checklist and demonstrate a successful restore.",
        },
        {
          id: "db-m15-integration",
          order: 15,
          phase: 6,
          week: "Week 15",
          title: "Week 15 · Database Integration with Applications",
          summary:
            "Frontend, backend and database, drivers, connection strings and pooling, parameterized queries from Node.js with pg, mapping rows to objects, CRUD endpoints, transactions, constraint errors, migrations, ORMs and secrets.",
          objective: "Connect a relational database to an application and use it safely.",
          atoms: 17,
          topics: [
            "Applications, drivers and connections",
            "Queries from a backend",
            "CRUD through an API",
            "Transactions, validation and errors",
            "Migrations, ORMs and secrets",
          ],
          curriculum: [
            ["15.1", "How a frontend, backend, and database work together"],
            ["15.2", "Database drivers and connection libraries"],
            ["15.3", "Connection strings and environment variables"],
            ["15.4", "Connection pooling fundamentals"],
            ["15.5", "Sending SQL queries from a backend"],
            ["15.6", "Parameterized queries"],
            ["15.7", "Mapping database records to application objects"],
            ["15.8", "CRUD operations through an API"],
            ["15.9", "Handling transactions across related operations"],
            ["15.10", "Validation, errors, and database constraints"],
            ["15.11", "Schema migrations and version control"],
            ["15.12", "Separating application logic from database responsibilities"],
            ["15.13", "Introduction to object-relational mapping (ORM) and when direct SQL is useful"],
            ["15.14", "Managing secrets and avoiding credentials in source control"],
            ["15.P", "Practical: a Node.js backend with create, read, update and delete endpoints on PostgreSQL"],
          ],
          project:
            "Connect a small backend application to PostgreSQL and implement endpoints for creating, retrieving, updating, and deleting records.",
          checkpoint:
            "Demonstrate an application that persists data in PostgreSQL and handles invalid requests without corrupting the database.",
        },
        {
          id: "db-m16-capstone",
          order: 16,
          phase: 6,
          week: "Week 16",
          title: "Week 16 · Capstone Project and Professional Practice",
          type: "capstone",
          summary:
            "The full database lifecycle on a realistic problem: requirements, ERD, normalization, schema and constraints, sample data, queries and reports, transactions and permissions, tests, performance, backups, documentation and presentation.",
          objective: "Apply the full database development lifecycle to a realistic problem.",
          atoms: 15,
          topics: [
            "Requirements, entities and the ERD",
            "Schema, constraints and data",
            "Queries, transactions and permissions",
            "Testing, performance and backups",
            "Documentation and presentation",
          ],
          curriculum: [
            ["16.1", "Gathering requirements and defining business rules"],
            ["16.2", "Identifying entities and relationships"],
            ["16.3", "Creating an ERD"],
            ["16.4", "Normalizing the schema"],
            ["16.5", "Implementing tables, keys, and constraints"],
            ["16.6", "Loading realistic sample data"],
            ["16.7", "Writing CRUD queries and analytical reports"],
            ["16.8", "Implementing transactions and permissions"],
            ["16.9", "Testing invalid inputs and edge cases"],
            ["16.10", "Analyzing query performance"],
            ["16.11", "Creating and restoring backups"],
            ["16.12", "Documenting schema decisions and assumptions"],
            ["16.13", "Presenting technical decisions and trade-offs"],
            ["16.P", "Final deliverable: a complete relational database project with SQL scripts, an ERD, test evidence, documentation, and a demonstration"],
          ],
          project:
            "A complete relational database project with SQL scripts, an ERD, test evidence, documentation, and a demonstration.",
          checkpoint:
            "A reviewer can run your scripts from an empty server, see every rule enforced, read why each decision was made, and watch it demonstrated.",
        },
      ],
    },
  ],

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Relational Databases (RDBMS) & SQL",
    covers: "Database design & normalization • SQL from DDL to window functions • Transactions & indexing • Security, backup & recovery • PostgreSQL, MySQL & application integration",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every lesson check at 70% or above",
      "Complete the practical lab that ends each week",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Month 1 checkpoint",
      format: "A normalized academy database, designed as an ERD and built with constraints that reject invalid data.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Month 2 checkpoint",
      format: "An online store schema built from one script, managed safely with DML, and reported on with filters and aggregates.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Month 3 checkpoint",
      format: "Multi-table analytics with CTEs and window functions, a safe money transfer, and an evidence-based indexing investigation.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format: "A complete, secured, backed-up and documented database behind a working backend, presented as a capstone.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const RDBMS_MODULE_IDS = RDBMS_COURSE.months.flatMap((m) => m.modules.map((mod) => mod.id));

export default RDBMS_COURSE;
