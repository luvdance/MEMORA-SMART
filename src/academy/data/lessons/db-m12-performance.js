/**
 * RELATIONAL DATABASES · WEEK 12 · INDEXING AND QUERY PERFORMANCE
 *
 * Curriculum 12.1 – 12.P. Sequential and index scans, why scanning gets
 * expensive, the storage/write/read trade-off, what an index is, primary-key
 * and unique indexes, B-trees, single and composite indexes, column order,
 * partial and expression indexes, EXPLAIN and EXPLAIN ANALYZE, estimated
 * versus actual rows, scan types and join strategies, efficient filtering and
 * joining, unnecessary retrieval, premature indexing, inefficient patterns,
 * measuring before and after, and the cost of indexes on writes.
 *
 * Every lab works on 50,000 synthetic orders (BIG_ORDERS), and checks the
 * plan PostgreSQL really chooses through the lab helper lab_plan(query),
 * which returns EXPLAIN's plan as one line. Timings vary from run to run and
 * machine to machine, so labs never check a time, only plans and results.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BIG_ORDERS, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s12-performance";
const MODULE = "db-m12-performance";

/** True when PostgreSQL's plan for `query` contains `text` (SQL quotes doubled). */
const q2 = (s) => s.replace(/'/g, "''");
const planHas = (query, text) => `SELECT lab_plan('${q2(query)}') LIKE '%${q2(text)}%'`;
const planLacks = (query, text) => `SELECT lab_plan('${q2(query)}') NOT LIKE '%${q2(text)}%'`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 12.1 – 12.3 · HOW DATABASES FIND RECORDS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l63-scans",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3"],
    title: "How Databases Find Records",
    subtitle: "Sequential scans, index scans, and what each costs",
    estimatedMinutes: 40,
    intro:
      "This week's database holds 50,000 orders from 2,000 customers. Every query on it is a search, and the difference between searching well and badly is the difference between a page that loads instantly and one that times out.",
    atoms: [
      {
        id: "a-db-seq-vs-index",
        title: "Sequential scans and index scans",
        explain:
          "With no useful index, PostgreSQL answers WHERE customer_id = 42 with a SEQUENTIAL SCAN: it reads every row of the table and keeps the ones that match. With an index on customer_id it can do an INDEX SCAN (or a Bitmap Index Scan followed by a Bitmap Heap Scan for a moderate number of rows): look up 42 in the index, which points straight at the matching rows. EXPLAIN shows which one the planner chose. Run the example: the same query, before and after an index.",
        sqlDemo: {
          setup: BIG_ORDERS,
          caption: "EXPLAIN ANALYZE before and after CREATE INDEX. Compare the first line of each plan and 'Rows Removed by Filter'.",
          code: "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42;\n\nCREATE INDEX orders_customer_id_idx ON orders (customer_id);\n\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42;",
        },
        decision: decide({
          scenario: "The first plan says Seq Scan on orders … Rows Removed by Filter: 49975. The second says Bitmap Index Scan on orders_customer_id_idx.",
          question: "What did the index change?",
          right: ["PostgreSQL went from reading all 50,000 rows to reading only the 25 that match", "The index tells it exactly where those rows are."],
          wrong: [
            ["It changed which rows the query returns", "Indexes never change results, only how they are found."],
            ["It made the table smaller", "The table is the same; the index is extra storage."],
            ["Nothing: both plans read every row", "Rows Removed by Filter disappears in the second plan."],
          ],
          at: 0,
          aftermath: "Indexes change HOW rows are found, never WHICH rows a query returns.",
        }),
      },
      {
        id: "a-db-scan-cost",
        title: "Why searching every row becomes expensive",
        explain:
          "A sequential scan's cost grows with the TABLE, not with the answer: finding 25 orders among 50,000 reads all 50,000; among 50 million it reads 50 million. A table that is fast with test data becomes slow in production as it grows, and slow queries hold connections and locks, so one slow query can make a whole application slow. A B-tree index lookup grows only with the logarithm of the size: a few page reads whether the table has thousands or billions of rows. That is why a missing index often appears suddenly, months after launch.",
        decision: decide({
          scenario: "A query takes 3 ms on the developer's laptop (2,000 orders) and 4 seconds in production (40 million orders). It filters on customer_id, which has no index.",
          question: "What best explains the difference?",
          right: ["A sequential scan reads every row, so its cost grew with the table, 20,000 times larger in production", "Seq-scan cost scales with table size, not result size."],
          wrong: [
            ["Production servers are slower", "Not by a factor of a thousand."],
            ["The network adds the delay", "The time is spent reading rows."],
            ["The query returns more rows in production", "One customer's orders are still few; the table is what grew."],
          ],
          at: 2,
          aftermath: "Always test performance with realistic data volumes, which is why this week's labs use 50,000 rows.",
        }),
      },
      {
        id: "a-db-index-tradeoffs",
        title: "The trade-off: storage, writes and reads",
        explain:
          "An index is a separate structure the database must store and keep up to date. It speeds up READS that can use it, but costs DISK SPACE (often a large fraction of the table), and makes every INSERT, UPDATE of an indexed column, and DELETE slower, because each index must be changed too. Ten indexes on a busy table can make writes several times slower. So you index for the queries that actually run, not 'every column, just in case'. Run the example to compare the sizes of a table and an index on it.",
        sqlDemo: {
          setup: BIG_ORDERS,
          caption: "An index is real storage: here, a single-column index next to its table.",
          code: "CREATE INDEX orders_customer_id_idx ON orders (customer_id);\n\nSELECT pg_size_pretty(pg_relation_size('orders'))                 AS table_size,\n       pg_size_pretty(pg_relation_size('orders_customer_id_idx')) AS index_size;",
        },
        decision: decide({
          scenario: "A colleague proposes indexing all 14 columns of a payments table that receives thousands of inserts a minute, 'so every query is fast'.",
          question: "What is the problem?",
          right: ["Every insert would have to update 14 indexes, slowing writes and using a lot of storage, mostly for queries nobody runs", "Index what real queries need."],
          wrong: [
            ["None; indexes only help", "They cost space and write time."],
            ["PostgreSQL allows only one index per table", "It allows many."],
            ["Indexes make SELECT results wrong", "Results never change."],
          ],
          at: 1,
          aftermath: "Lesson 67 returns to this: avoiding premature indexing.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 12.4 – 12.6 · INDEX FUNDAMENTALS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l64-index-basics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.4", "12.5", "12.6"],
    title: "Index Fundamentals",
    subtitle: "What an index is, key indexes, and B-trees",
    estimatedMinutes: 40,
    intro:
      "An index is to a table what the index at the back of a textbook is to its pages: a sorted list of values with directions to where each one appears.",
    atoms: [
      {
        id: "a-db-what-index",
        title: "What an index is",
        explain:
          "An INDEX is a separate, sorted data structure built from one or more columns of a table, with each entry pointing at the row it came from. CREATE INDEX name ON table (column); builds it (and keeps it updated from then on). The planner decides whether to use it for each query; you never mention an index in a SELECT. DROP INDEX name; removes it. Name indexes after table and columns (orders_customer_id_idx). On a big production table, CREATE INDEX CONCURRENTLY builds it without blocking writes.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Customer service looks up orders by customer constantly. Create an index named orders_customer_id_idx on orders (customer_id), then run the lookup for customer 1234: SELECT id, ordered_on, status, total FROM orders WHERE customer_id = 1234 ORDER BY id;",
          starter: "SELECT id, ordered_on, status, total\nFROM orders\nWHERE customer_id = 1234\nORDER BY id;\n",
          solution: "CREATE INDEX orders_customer_id_idx ON orders (customer_id);\n\nSELECT id, ordered_on, status, total\nFROM orders\nWHERE customer_id = 1234\nORDER BY id;\n",
          checks: [
            { label: "The lookup returns customer 1234's orders", result: { ordered: true } },
            { label: "The index exists", assert: "SELECT to_regclass('orders_customer_id_idx') IS NOT NULL" },
            { label: "PostgreSQL now uses an index for the lookup", assert: planHas("SELECT id FROM orders WHERE customer_id = 1234", "orders_customer_id_idx") },
          ],
          hint: "CREATE INDEX orders_customer_id_idx ON orders (customer_id); before the SELECT.",
          successMessage: "Same 25 rows as without the index; found by lookup instead of by reading 50,000.",
        },
      },
      {
        id: "a-db-key-indexes",
        title: "Primary-key and unique indexes",
        explain:
          "You already have indexes you never created: PRIMARY KEY and UNIQUE constraints are ENFORCED by unique indexes, which PostgreSQL builds automatically (orders_pkey, customers_email_key). That is why lookups by id are always fast, and why checking uniqueness on insert is fast. FOREIGN KEY columns, however, get NO automatic index in PostgreSQL (MySQL's InnoDB does create one). Joins and ON DELETE checks on an unindexed foreign key scan the child table, so indexing foreign keys that are joined or deleted on is a common first improvement. pg_indexes lists a table's indexes.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "List the indexes that already exist on the orders and customers tables: return tablename and indexname from pg_indexes for those two tables, ordered by tablename, indexname.",
          starter: "SELECT tablename, indexname\nFROM pg_indexes\n",
          solution: "SELECT tablename, indexname\nFROM pg_indexes\nWHERE tablename IN ('orders', 'customers')\nORDER BY tablename, indexname;\n",
          checks: [{ label: "The existing indexes of both tables", result: { ordered: true } }],
          expectRows: 2,
          hint: "WHERE tablename IN ('orders', 'customers').",
          successMessage: "Two indexes, one per primary key, and nothing on orders.customer_id, even though it is a foreign key.",
        },
      },
      {
        id: "a-db-btree",
        title: "B-tree indexes",
        explain:
          "PostgreSQL's default index is a B-TREE: a balanced tree of sorted pages, a few levels deep even for millions of rows. Because it is SORTED, it serves equality (=), ranges (<, <=, >, >=, BETWEEN), IN lists, ORDER BY on the indexed column, and LIKE 'prefix%' (with the C collation, as here, or a text_pattern_ops index on servers using a language collation). It cannot help LIKE '%suffix', or conditions on a CALCULATION of the column, such as lower(email) or extract(year FROM date), unless the index is on that same expression (Lesson 65). Other types exist for special data: GIN for arrays and full-text, GiST for geometry, BRIN for huge naturally ordered tables, hash for equality only.",
        decision: decide({
          scenario: "orders has a B-tree index on ordered_on. Four queries: (1) WHERE ordered_on = '2026-06-01'; (2) WHERE ordered_on BETWEEN '2026-06-01' AND '2026-06-07'; (3) ORDER BY ordered_on DESC LIMIT 10; (4) WHERE extract(year FROM ordered_on) = 2026.",
          question: "Which can the B-tree help with?",
          right: ["1, 2 and 3", "Equality, ranges and ordering all use a sorted index; a function on the column hides it."],
          wrong: [
            ["All four", "extract() on the column is not what the index stores."],
            ["Only 1", "B-trees also serve ranges and ORDER BY."],
            ["Only 4", "That is the one it cannot help."],
          ],
          at: 3,
          aftermath: "Rewrite query 4 as a range (ordered_on >= '2026-01-01' AND ordered_on < '2027-01-01') and the index works again.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 12.7 – 12.9 · COMPOSITE, PARTIAL AND EXPRESSION INDEXES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l65-composite",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.7", "12.8", "12.9"],
    title: "Composite, Partial and Expression Indexes",
    subtitle: "Indexes shaped to the queries you actually run",
    estimatedMinutes: 50,
    intro:
      "A single-column index answers single-column questions. Real queries filter on several columns, on a subset of rows, or on a calculation; indexes can be built for each.",
    atoms: [
      {
        id: "a-db-composite-index",
        title: "Single-column and composite indexes",
        explain:
          "A COMPOSITE (multi-column) index sorts by its first column, then by the second within each first-column value, like a phone book sorted by surname, then first name. CREATE INDEX ON orders (status, ordered_on) serves WHERE status = 'cancelled' AND ordered_on >= '2026-06-01' in one lookup: jump to 'cancelled', then to the date range within it. Two separate single-column indexes can be combined with a BitmapAnd, but one composite index matching the query is usually better. A composite index on (a, b) also serves queries on a alone, so it can make a single index on a redundant.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "The fraud team runs: SELECT id, customer_id, total FROM orders WHERE status = 'cancelled' AND ordered_on >= '2026-06-01' ORDER BY id; Create ONE composite index, orders_status_ordered_on_idx, that serves both conditions, then run the query.",
          starter: "SELECT id, customer_id, total\nFROM orders\nWHERE status = 'cancelled'\n  AND ordered_on >= '2026-06-01'\nORDER BY id;\n",
          solution: "CREATE INDEX orders_status_ordered_on_idx ON orders (status, ordered_on);\n\nSELECT id, customer_id, total\nFROM orders\nWHERE status = 'cancelled'\n  AND ordered_on >= '2026-06-01'\nORDER BY id;\n",
          checks: [
            { label: "The query's result is unchanged", result: { ordered: true } },
            { label: "The plan uses orders_status_ordered_on_idx for both conditions", assert: planHas("SELECT id FROM orders WHERE status = 'cancelled' AND ordered_on >= '2026-06-01'", "Index Cond: ((status = 'cancelled'::text) AND (ordered_on") },
          ],
          hint: "CREATE INDEX orders_status_ordered_on_idx ON orders (status, ordered_on);",
          successMessage: "One index lookup handles both conditions: Index Cond lists status AND ordered_on.",
        },
      },
      {
        id: "a-db-column-order",
        title: "Index column order",
        explain:
          "Order matters because the index is sorted by its FIRST column. An index on (customer_id, ordered_on) is excellent for 'customer 42's orders since January' and for 'customer 42's orders', but a query on ordered_on ALONE cannot use the sorted order: the dates are scattered across 2,000 customer sections, so PostgreSQL scans the table instead. Rules of thumb: put columns tested with = first and range or ORDER BY columns last; put the column most queries filter on first. (PostgreSQL 18 can sometimes 'skip scan' a composite index when the leading column has only a few distinct values, but do not design on that.)",
        sqlLab: {
          setup: `${BIG_ORDERS}\nCREATE INDEX orders_cust_date_idx ON orders (customer_id, ordered_on);`,
          task:
            "An index on (customer_id, ordered_on) already exists, but the daily dashboard runs SELECT count(*) FROM orders WHERE ordered_on = '2026-06-24'; and still scans the table. Create the index that query needs (orders_ordered_on_idx), then run the count.",
          starter: "SELECT count(*)\nFROM orders\nWHERE ordered_on = '2026-06-24';\n",
          solution: "CREATE INDEX orders_ordered_on_idx ON orders (ordered_on);\n\nSELECT count(*)\nFROM orders\nWHERE ordered_on = '2026-06-24';\n",
          checks: [
            { label: "The count is unchanged", result: true },
            { label: "The date query now uses an index on ordered_on", assert: planHas("SELECT count(*) FROM orders WHERE ordered_on = '2026-06-24'", "orders_ordered_on_idx") },
          ],
          claims: [{ sql: "SELECT lab_plan('SELECT count(*) FROM orders WHERE ordered_on = ''2026-06-24''') LIKE '%Seq Scan%'", equals: "t" }],
          hint: "The existing index is sorted by customer first; dates alone need an index that starts with ordered_on.",
          successMessage: "Run EXPLAIN on the count before and after: a Seq Scan became an index lookup.",
        },
      },
      {
        id: "a-db-partial-expression",
        title: "Partial and expression indexes",
        explain:
          "A PARTIAL index covers only rows matching a WHERE: CREATE INDEX ON orders (ordered_on) WHERE status = 'pending'. It is small and cheap to maintain, and serves queries that include the same condition: perfect for 'the work queue' (pending orders) in a table of mostly finished ones. A partial UNIQUE index enforces rules such as 'one open loan per book'. An EXPRESSION index stores a computed value: CREATE INDEX ON customers (lower(email)) serves WHERE lower(email) = …, which a plain index on email cannot. The query must use the same expression as the index.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Logins look customers up by email typed in any case: SELECT id, city FROM customers WHERE lower(email) = 'customer777@example.com'; Create the index that lets this use an index (customers_lower_email_idx), then run the query.",
          starter: "CREATE INDEX customers_email_idx ON customers (email);\n\nSELECT id, city\nFROM customers\nWHERE lower(email) = 'customer777@example.com';\n",
          solution: "CREATE INDEX customers_lower_email_idx ON customers (lower(email));\n\nSELECT id, city\nFROM customers\nWHERE lower(email) = 'customer777@example.com';\n",
          checks: [
            { label: "Finds customer 777", result: true },
            { label: "The lookup uses an index on lower(email)", assert: planHas("SELECT id FROM customers WHERE lower(email) = 'customer777@example.com'", "Index") },
          ],
          hint: "The index must be on the same expression the query uses: (lower(email)).",
          successMessage: "The starter's index on email was useless here: the query asks about lower(email), so the index must store exactly that.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 12.10 – 12.14 · QUERY ANALYSIS WITH EXPLAIN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l66-explain",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.10", "12.11", "12.12", "12.13", "12.14"],
    title: "Query Analysis with EXPLAIN",
    subtitle: "Reading plans, measuring them, and trusting the estimates",
    estimatedMinutes: 55,
    intro:
      "Guessing why a query is slow wastes days. EXPLAIN shows exactly what PostgreSQL plans to do, and EXPLAIN ANALYZE what it actually did.",
    atoms: [
      {
        id: "a-db-explain",
        title: "Using EXPLAIN",
        explain:
          "EXPLAIN query shows the PLAN the planner chose, without running the query: a tree of NODES (Seq Scan, Index Scan, Hash Join, Sort, Aggregate…), each with an estimated cost and row count: cost=startup..total rows=N width=bytes. Costs are in arbitrary units (roughly page reads), useful for comparing plans for the same query, not as seconds. The planner chooses between plans using STATISTICS about the data (how many rows, how values are distributed), gathered by ANALYZE.",
        sqlLab: {
          setup: BIG_ORDERS,
          task: "Show the plan PostgreSQL would use to count Kano's customers: EXPLAIN SELECT count(*) FROM customers WHERE city = 'Kano';",
          starter: "",
          solution: "EXPLAIN\nSELECT count(*) FROM customers WHERE city = 'Kano';\n",
          checks: [
            { label: "Returns the query plan", returns: { columns: ["query plan"], minRows: 2 } },
            { label: "Uses EXPLAIN (without running the query)", source: "^\\s*EXPLAIN\\s+SELECT" },
          ],
          hint: "Put EXPLAIN in front of the SELECT.",
          successMessage: "Read it bottom-up: a Seq Scan on customers with a Filter, feeding an Aggregate that counts.",
        },
      },
      {
        id: "a-db-reading-plans",
        title: "Reading basic execution plans",
        explain:
          "Read a plan from the most indented lines (which run first) outwards. Each node passes rows to its parent. Look for: the SCAN on each table (Seq Scan, Index Scan, Bitmap Heap Scan, Index Only Scan); Filter lines (conditions checked row by row after reading) versus Index Cond lines (conditions answered by the index); the JOIN node and its condition; Sort and Aggregate nodes. A Seq Scan on a big table with a Filter that keeps few rows is the classic sign of a missing index; a Seq Scan that keeps most of the table is fine.",
        sqlDemo: {
          setup: BIG_ORDERS,
          caption: "A join plan. Find the two scans, the join, and the aggregate on top.",
          code: "EXPLAIN\nSELECT c.city, sum(o.total)\nFROM orders AS o\nJOIN customers AS c ON c.id = o.customer_id\nWHERE o.status = 'delivered'\nGROUP BY c.city;",
        },
        decision: decide({
          scenario: "A plan shows: Seq Scan on orders  Filter: (customer_id = 42)  Rows Removed by Filter: 49975.",
          question: "What does this tell you?",
          right: ["PostgreSQL read all 50,000 rows to keep 25: an index on customer_id would likely help", "A filter that discards almost everything is the sign of a missing index."],
          wrong: [
            ["The query is wrong", "The result is right; the method is slow."],
            ["There is an index, but it is broken", "No index is mentioned at all."],
            ["49,975 rows were deleted", "Rows Removed by Filter means skipped, not deleted."],
          ],
          at: 1,
          aftermath: "Compare it with a Seq Scan that keeps 40,000 of 50,000 rows: there, reading everything is the right plan.",
        }),
      },
      {
        id: "a-db-explain-analyze",
        title: "Using EXPLAIN ANALYZE carefully",
        explain:
          "EXPLAIN ANALYZE RUNS the query and reports, for each node, the actual time, actual rows and loops next to the estimates; add BUFFERS to see pages read. Because it really runs the statement, EXPLAIN ANALYZE on an UPDATE or DELETE CHANGES DATA: wrap it in BEGIN … ROLLBACK. Timings vary between runs (caching, other load), so run it a few times and compare like with like. On production, run it on a copy, or at quiet times, for statements you understand.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Measure what cancelling all pending orders from before 2025-02-01 would do, without actually doing it: BEGIN; EXPLAIN ANALYZE the UPDATE orders SET status = 'cancelled' WHERE status = 'pending' AND ordered_on < '2025-02-01'; ROLLBACK;",
          starter: "EXPLAIN ANALYZE\nUPDATE orders SET status = 'cancelled'\nWHERE status = 'pending' AND ordered_on < '2025-02-01';\n",
          solution: "BEGIN;\n\nEXPLAIN ANALYZE\nUPDATE orders SET status = 'cancelled'\nWHERE status = 'pending' AND ordered_on < '2025-02-01';\n\nROLLBACK;\n",
          checks: [
            { label: "No order was actually changed", query: "SELECT status, count(*) FROM orders GROUP BY status ORDER BY status", ordered: true },
            { label: "The UPDATE was measured with EXPLAIN ANALYZE", source: "EXPLAIN\\s+ANALYZE\\s+UPDATE" },
            { label: "It was wrapped in a transaction that was rolled back", source: "\\bBEGIN\\b[\\s\\S]*\\bROLLBACK\\b" },
          ],
          hint: "BEGIN; before EXPLAIN ANALYZE, and ROLLBACK; after it.",
          successMessage: "You saw how many rows it would update and how long it took, and nothing changed.",
        },
      },
      {
        id: "a-db-estimates",
        title: "Estimated versus actual row counts",
        explain:
          "In EXPLAIN ANALYZE output, compare rows=N (estimate) with actual rows. When they differ hugely, the planner chose its plan on bad information, and may have picked a nested loop for 30,000 rows or a seq scan for 3. The usual cause is OUT-OF-DATE STATISTICS after a big load or change: ANALYZE table refreshes them (autovacuum normally does it in the background on a real server, sometimes not soon enough). The example loads 30,000 orders and looks before and after ANALYZE.",
        sqlLab: {
          setup: `${BIG_ORDERS}\nCREATE INDEX orders_ordered_on_idx ON orders (ordered_on);\nINSERT INTO orders SELECT g + 100000, 1 + g % 2000, 1, date '2026-06-30', 'pending', 10 FROM generate_series(1, 30000) AS g;`,
          task:
            "30,000 orders for 2026-06-30 were just loaded. Run EXPLAIN ANALYZE SELECT * FROM orders WHERE ordered_on = '2026-06-30'; and compare the estimated rows with the actual rows. Then refresh the table's statistics and run the same EXPLAIN ANALYZE again.",
          starter: "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE ordered_on = '2026-06-30';\n",
          solution: "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE ordered_on = '2026-06-30';\n\nANALYZE orders;\n\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE ordered_on = '2026-06-30';\n",
          checks: [
            { label: "The planner's statistics now know about the new rows", assert: "SELECT reltuples >= 80000 FROM pg_class WHERE relname = 'orders'" },
            { label: "Refreshed with ANALYZE between two measurements", source: "EXPLAIN\\s+ANALYZE[\\s\\S]*\\bANALYZE\\s+orders[\\s\\S]*EXPLAIN\\s+ANALYZE" },
          ],
          hint: "ANALYZE orders; between the two EXPLAIN ANALYZE statements.",
          successMessage: "Before: an estimate of about a hundred rows for 30,000 actual. After ANALYZE: the estimate matches reality, and the planner can choose well.",
        },
      },
      {
        id: "a-db-scan-join-types",
        title: "Scan types and join strategies",
        explain:
          "SCANS: Seq Scan (read everything); Index Scan (walk the index, fetch each row); Bitmap Index Scan + Bitmap Heap Scan (collect matching locations, then read the table pages in order: good for moderate numbers of rows); Index Only Scan (answer from the index alone, when it holds every column needed). JOINS: Nested Loop (for each outer row, look up matches, ideally through an index: best when one side is small); Hash Join (build a hash table of the smaller input, probe it with the larger: good for big unsorted joins); Merge Join (walk two inputs sorted on the join key). The planner picks by estimated cost; your job is to recognise when its choice is wrong.",
        sqlDemo: {
          setup: BIG_ORDERS,
          caption: "Two joins of the same tables: one order (a nested loop through two primary keys) and all delivered orders by city (a hash join).",
          code: "EXPLAIN\nSELECT o.id, c.email\nFROM orders AS o\nJOIN customers AS c ON c.id = o.customer_id\nWHERE o.id = 5;\n\nEXPLAIN\nSELECT c.city, count(*)\nFROM orders AS o\nJOIN customers AS c ON c.id = o.customer_id\nGROUP BY c.city;",
        },
        decision: decide({
          scenario: "Looking up ONE order with its customer gives a Nested Loop with two Index Scans; counting ALL orders per city gives a Hash Join over two Seq Scans.",
          question: "Why different strategies for the same two tables?",
          right: ["For one row, two key lookups are cheapest; for all rows, reading both tables once and hashing is cheapest", "The planner picks the cheapest strategy for the number of rows involved."],
          wrong: [
            ["The second query is badly written", "It is the right plan for an all-rows join."],
            ["Hash joins are always better", "Not for a single-row lookup."],
            ["The indexes were dropped between the queries", "Both ran on the same database."],
          ],
          at: 0,
          aftermath: "A plan is only 'bad' relative to the rows it handles.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 12.15 – 12.20 · PERFORMANCE OPTIMIZATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l67-optimization",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["12.15", "12.16", "12.17", "12.18", "12.19", "12.20"],
    title: "Performance Optimization",
    subtitle: "Efficient queries, measured improvements, and the cost of indexes",
    estimatedMinutes: 55,
    intro:
      "Most performance problems are not solved by hardware or by more indexes, but by writing the query so the database can use what it already has, and by measuring instead of guessing.",
    atoms: [
      {
        id: "a-db-efficient-filters",
        title: "Filtering and joining efficiently",
        explain:
          "Write conditions the database can use an index for (SARGABLE conditions): compare the plain column with a value. A function or calculation ON THE COLUMN hides it from an ordinary index: extract(month FROM ordered_on) = 6, ordered_on + 30 > current_date, total * 1.075 > 1000. Rewrite them as ranges on the bare column: ordered_on >= '2026-06-01' AND ordered_on < '2026-07-01'. Join on indexed keys of the same type (joining integer to text forces a conversion). Filter as early as possible, so joins and sorts handle fewer rows.",
        sqlLab: {
          setup: `${BIG_ORDERS}\nCREATE INDEX orders_ordered_on_idx ON orders (ordered_on);`,
          task:
            "This June-2026 report ignores the index on ordered_on because of the functions on the column. Rewrite the WHERE as a range on the bare column so it returns the same result using the index.",
          starter: "SELECT count(*) AS orders, sum(total) AS revenue\nFROM orders\nWHERE extract(year FROM ordered_on) = 2026\n  AND extract(month FROM ordered_on) = 6;\n",
          solution: "SELECT count(*) AS orders, sum(total) AS revenue\nFROM orders\nWHERE ordered_on >= '2026-06-01'\n  AND ordered_on < '2026-07-01';\n",
          checks: [
            { label: "Same result as the original report", result: true },
            { label: "No function on the column", forbid: "extract\\s*\\(" },
            { label: "The range can use the index", assert: planHas("SELECT count(*) FROM orders WHERE ordered_on >= '2026-06-01' AND ordered_on < '2026-07-01'", "orders_ordered_on_idx") },
          ],
          hint: "ordered_on >= '2026-06-01' AND ordered_on < '2026-07-01': start of the month included, start of the next excluded.",
          successMessage: "Same numbers, but now from an index range instead of reading every order.",
        },
      },
      {
        id: "a-db-unnecessary-data",
        title: "Identifying unnecessary data retrieval",
        explain:
          "Every column and row a query returns is read, transferred over the network, and processed by the application. SELECT * fetches columns nobody uses (and breaks when columns are added); fetching 50,000 rows to show 20 on a page wastes almost all the work (use LIMIT, or aggregate in SQL instead of counting in the application); and running one query per row in a loop (the 'N+1' problem: one query for the orders, then one per order for its customer) multiplies round trips. Ask the database for exactly what the screen or report needs.",
        decision: decide({
          scenario: "An admin page shows the 20 most recent orders with customer emails. The code runs SELECT * FROM orders, sorts the 50,000 rows in the application, keeps 20, then runs one query per order to fetch its customer.",
          question: "What is the best rewrite?",
          right: ["One query: join customers, select only the needed columns, ORDER BY ordered_on DESC LIMIT 20", "The database sorts, limits and joins far more efficiently, in one round trip."],
          wrong: [
            ["Cache all 50,000 orders in memory", "It still transfers everything and grows with the table."],
            ["Add an index on every column", "The problem is what is fetched, not missing indexes."],
            ["Run the 21 queries in parallel", "Fewer round trips beat parallel wasted work."],
          ],
          at: 2,
          aftermath: "The N+1 pattern is the commonest performance bug in applications that use ORMs (Week 15).",
        }),
      },
      {
        id: "a-db-premature-indexing",
        title: "Avoiding premature indexing",
        explain:
          "Indexes should answer MEASURED needs. Before adding one, find the slow queries (pg_stat_statements on a real server, or the application's slow-query log), check their plans, and add the index that fits them. Indexes that help nothing still cost writes and space: a column with very few distinct values (a status, a boolean) often does not help on its own: when a query matches a large share of the table, a sequential scan is cheaper and the planner ignores the index. Whether it helps depends on the value and the query, which is exactly why you check plans instead of guessing. Review unused indexes periodically (pg_stat_user_indexes.idx_scan = 0) and drop them.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Someone added an index on orders (status) 'to speed up reports'. The main report counts every order that is not cancelled. Create the index, show the plan for SELECT count(*) FROM orders WHERE status <> 'cancelled'; with EXPLAIN, and finally drop the index, because that report cannot use it.",
          starter: "CREATE INDEX orders_status_idx ON orders (status);\n\nEXPLAIN\nSELECT count(*) FROM orders WHERE status <> 'cancelled';\n",
          solution: "CREATE INDEX orders_status_idx ON orders (status);\n\nEXPLAIN\nSELECT count(*) FROM orders WHERE status <> 'cancelled';\n\nDROP INDEX orders_status_idx;\n",
          checks: [
            { label: "The useless index is gone", assert: "SELECT to_regclass('orders_status_idx') IS NULL" },
            { label: "You checked the plan before dropping it", source: "EXPLAIN[\\s\\S]*DROP\\s+INDEX" },
          ],
          claims: [{ sql: "CREATE INDEX orders_status_idx ON orders (status); SELECT lab_plan('SELECT count(*) FROM orders WHERE status <> ''cancelled''') LIKE '%Seq Scan%'", equals: "t" }],
          hint: "Read the plan: a Seq Scan even with the index. Then DROP INDEX orders_status_idx;",
          successMessage: "The report wants about 86% of all orders, so PostgreSQL reads the table and ignores the index, which only costs space and slower writes. (For a rare value such as 'cancelled' it may use the index: check real queries, not guesses.)",
        },
      },
      {
        id: "a-db-inefficient-patterns",
        title: "Recognizing inefficient query patterns",
        explain:
          "Patterns worth recognising on sight: a leading wildcard (LIKE '%42@example.com') cannot use a B-tree; OR across different columns often defeats indexes (sometimes a UNION of two indexed queries is faster); NOT IN with a subquery is slow and wrong with NULLs (use NOT EXISTS); correlated subqueries that run once per row of a big table; sorting or DISTINCT on huge results to remove duplicates created by a bad join; large OFFSETs for deep pagination (use keyset pagination); and computing the same aggregate repeatedly in the SELECT list. None is always wrong; each is worth a look in EXPLAIN.",
        sqlLab: {
          setup: `${BIG_ORDERS}\nCREATE INDEX orders_customer_id_idx ON orders (customer_id);`,
          task:
            "This 'customers with no orders in 2026' query uses NOT IN, which is slow here and returns nothing if the subquery ever produces a NULL. Rewrite it with NOT EXISTS, keeping the same result (customer id and email, ordered by id).",
          starter: "SELECT c.id, c.email\nFROM customers AS c\nWHERE c.id NOT IN (\n  SELECT o.customer_id FROM orders AS o WHERE o.ordered_on >= '2026-01-01'\n)\nORDER BY c.id;\n",
          solution: "SELECT c.id, c.email\nFROM customers AS c\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM orders AS o\n  WHERE o.customer_id = c.id\n    AND o.ordered_on >= '2026-01-01'\n)\nORDER BY c.id;\n",
          checks: [
            { label: "Same customers as before", result: { ordered: true } },
            { label: "Uses NOT EXISTS, not NOT IN", source: "NOT\\s+EXISTS" },
            { label: "No NOT IN", forbid: "NOT\\s+IN" },
          ],
          hint: "WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.ordered_on >= '2026-01-01').",
          successMessage: "Correct even if a NULL ever appears, and the correlated condition can use the customer_id index.",
        },
      },
      {
        id: "a-db-measuring",
        title: "Measuring before-and-after performance",
        explain:
          "An optimization is only real if you measured it. The routine: (1) capture the BEFORE: the plan and timing (EXPLAIN (ANALYZE, BUFFERS)), several runs; (2) make ONE change; (3) capture the AFTER the same way; (4) check the RESULT is identical; (5) keep the change only if it helped meaningfully, and record what you did and why. BUFFERS (pages read) is steadier than milliseconds for comparisons. Changes that did not help are worth recording too, so nobody tries them again.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Investigate SELECT id, total FROM orders WHERE customer_id = 99 ORDER BY ordered_on DESC LIMIT 5; Measure it with EXPLAIN (ANALYZE, BUFFERS), add an index on (customer_id, ordered_on) named orders_cust_date_idx, measure again, and finally run the query itself to confirm its result.",
          starter: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT id, total FROM orders\nWHERE customer_id = 99\nORDER BY ordered_on DESC\nLIMIT 5;\n",
          solution: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT id, total FROM orders\nWHERE customer_id = 99\nORDER BY ordered_on DESC\nLIMIT 5;\n\nCREATE INDEX orders_cust_date_idx ON orders (customer_id, ordered_on);\n\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, total FROM orders\nWHERE customer_id = 99\nORDER BY ordered_on DESC\nLIMIT 5;\n\nSELECT id, total FROM orders\nWHERE customer_id = 99\nORDER BY ordered_on DESC\nLIMIT 5;\n",
          checks: [
            { label: "The final query returns customer 99's five latest orders", result: { ordered: true } },
            { label: "Measured before and after the index", source: "EXPLAIN\\s*\\(\\s*ANALYZE,\\s*BUFFERS\\s*\\)[\\s\\S]*CREATE\\s+INDEX[\\s\\S]*EXPLAIN\\s*\\(\\s*ANALYZE,\\s*BUFFERS\\s*\\)" },
            { label: "The new plan reads the index in order, with no Sort", assert: `SELECT (${planHas("SELECT id, total FROM orders WHERE customer_id = 99 ORDER BY ordered_on DESC LIMIT 5", "orders_cust_date_idx")}) AND (${planLacks("SELECT id, total FROM orders WHERE customer_id = 99 ORDER BY ordered_on DESC LIMIT 5", "Sort")})` },
          ],
          hint: "EXPLAIN (ANALYZE, BUFFERS) … then CREATE INDEX orders_cust_date_idx ON orders (customer_id, ordered_on); then the same EXPLAIN, then the query.",
          successMessage: "Before: scan everything, sort, keep 5. After: walk the index backwards and stop after 5 rows. Compare the Buffers lines.",
        },
      },
      {
        id: "a-db-index-write-cost",
        title: "The effect of indexes on INSERT, UPDATE and DELETE",
        explain:
          "Each index on a table must be updated on every INSERT and DELETE, and on every UPDATE that changes an indexed column (PostgreSQL can skip index updates for other columns, a 'HOT' update, when there is room on the page). So a write-heavy table pays for every index on every write. Run the example: the same 20,000-row insert into a table with no secondary indexes and into one with four. Your exact times will differ, but the second is consistently slower. Bulk loads are often done by dropping indexes, loading, and recreating them.",
        sqlDemo: {
          caption: "The same insert twice. Compare the two timings at the end (they vary per run and per machine; the gap does not).",
          code: "CREATE TABLE plain (id integer PRIMARY KEY, a integer, b text, c date, d numeric);\nCREATE TABLE indexed (id integer PRIMARY KEY, a integer, b text, c date, d numeric);\nCREATE INDEX ON indexed (a);\nCREATE INDEX ON indexed (b);\nCREATE INDEX ON indexed (c);\nCREATE INDEX ON indexed (d);\n\nCREATE TABLE timings (target text, ms numeric);\n\nDO $$\nDECLARE t0 timestamptz;\nBEGIN\n  t0 := clock_timestamp();\n  INSERT INTO plain SELECT g, g % 97, md5(g::text), date '2026-01-01' + g % 365, g * 1.5 FROM generate_series(1, 20000) g;\n  INSERT INTO timings VALUES ('no extra indexes', extract(epoch FROM clock_timestamp() - t0) * 1000);\n  t0 := clock_timestamp();\n  INSERT INTO indexed SELECT g, g % 97, md5(g::text), date '2026-01-01' + g % 365, g * 1.5 FROM generate_series(1, 20000) g;\n  INSERT INTO timings VALUES ('four extra indexes', extract(epoch FROM clock_timestamp() - t0) * 1000);\nEND\n$$;\n\nSELECT target, round(ms) AS milliseconds FROM timings;",
        },
        decision: decide({
          scenario: "A logging table receives 5,000 inserts per second and is queried once a day for a report. It has six indexes.",
          question: "What is the sensible approach?",
          right: ["Keep only the indexes the daily report truly needs (perhaps one), or report from a copy; every index slows the constant inserts", "Optimise for the workload that dominates."],
          wrong: [
            ["Add more indexes so the report is faster", "That slows 5,000 writes a second to speed up one daily read."],
            ["Remove the primary key too", "The key protects integrity and is usually worth keeping."],
            ["Indexes do not affect inserts", "Every index is updated on every insert."],
          ],
          at: 3,
          aftermath: "Read-heavy tables can afford more indexes; write-heavy ones cannot.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 12.P · PRACTICAL: A PERFORMANCE INVESTIGATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l68-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["12.P"],
    title: "Week 12 Practical: A Performance Investigation",
    subtitle: "Measure, change one thing, measure again, keep the evidence",
    estimatedMinutes: 70,
    intro:
      "The checkpoint: a performance investigation with evidence of what improved performance and what did not. The labs check the plans; your write-up records the measurements.",
    atoms: [
      {
        id: "a-db-p12-slow-query",
        title: "Fix the slow report",
        explain:
          "The customer-service screen runs this query for every call: the latest 10 shipped or delivered orders of one customer in the last 90 days before 2026-06-24, with totals. It is slow. Measure it, design ONE index that lets PostgreSQL find the rows by customer and date without scanning the table, measure again, and confirm the result is unchanged. Name the index orders_customer_recent_idx.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Measure with EXPLAIN (ANALYZE, BUFFERS), create orders_customer_recent_idx, measure again, then run the query: SELECT id, ordered_on, status, total FROM orders WHERE customer_id = 1500 AND status IN ('shipped', 'delivered') AND ordered_on >= DATE '2026-06-24' - 90 ORDER BY ordered_on DESC LIMIT 10;",
          starter: "SELECT id, ordered_on, status, total\nFROM orders\nWHERE customer_id = 1500\n  AND status IN ('shipped', 'delivered')\n  AND ordered_on >= DATE '2026-06-24' - 90\nORDER BY ordered_on DESC\nLIMIT 10;\n",
          solution: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT id, ordered_on, status, total\nFROM orders\nWHERE customer_id = 1500\n  AND status IN ('shipped', 'delivered')\n  AND ordered_on >= DATE '2026-06-24' - 90\nORDER BY ordered_on DESC\nLIMIT 10;\n\nCREATE INDEX orders_customer_recent_idx ON orders (customer_id, ordered_on);\n\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, ordered_on, status, total\nFROM orders\nWHERE customer_id = 1500\n  AND status IN ('shipped', 'delivered')\n  AND ordered_on >= DATE '2026-06-24' - 90\nORDER BY ordered_on DESC\nLIMIT 10;\n\nSELECT id, ordered_on, status, total\nFROM orders\nWHERE customer_id = 1500\n  AND status IN ('shipped', 'delivered')\n  AND ordered_on >= DATE '2026-06-24' - 90\nORDER BY ordered_on DESC\nLIMIT 10;\n",
          checks: [
            { label: "The result is unchanged", result: { ordered: true } },
            { label: "The index exists", assert: "SELECT to_regclass('orders_customer_recent_idx') IS NOT NULL" },
            { label: "The query no longer scans the whole table", assert: `SELECT (${planHas("SELECT id FROM orders WHERE customer_id = 1500 AND status IN ('shipped', 'delivered') AND ordered_on >= DATE '2026-06-24' - 90 ORDER BY ordered_on DESC LIMIT 10", "orders_customer_recent_idx")}) AND (${planLacks("SELECT id FROM orders WHERE customer_id = 1500 AND status IN ('shipped', 'delivered') AND ordered_on >= DATE '2026-06-24' - 90 ORDER BY ordered_on DESC LIMIT 10", "Seq Scan")})` },
            { label: "Measured before and after", source: "EXPLAIN[\\s\\S]*CREATE\\s+INDEX[\\s\\S]*EXPLAIN" },
          ],
          hint: "The equality column first (customer_id), then the range and ORDER BY column (ordered_on).",
          revealSolution: false,
          successMessage: "The plan went from scanning every order to a short index range for one customer. Write down both plans' Buffers lines.",
        },
      },
      {
        id: "a-db-p12-no-help",
        title: "Record what did not help",
        explain:
          "An honest investigation also records failed ideas. Try an index on orders (status) alone for the 'shipped or delivered' condition, check the plan for a status-only report (SELECT count(*) FROM orders WHERE status IN ('shipped', 'delivered')), and note that PostgreSQL ignores it because those statuses are over half of all orders. Then drop it.",
        sqlLab: {
          setup: BIG_ORDERS,
          task:
            "Create orders_status_idx on orders (status), EXPLAIN the status-only count SELECT count(*) FROM orders WHERE status IN ('shipped', 'delivered'), then drop the index because the plan does not use it.",
          starter: "",
          solution: "CREATE INDEX orders_status_idx ON orders (status);\n\nEXPLAIN\nSELECT count(*) FROM orders WHERE status IN ('shipped', 'delivered');\n\nDROP INDEX orders_status_idx;\n",
          checks: [
            { label: "Checked the plan with the index in place", source: "CREATE\\s+INDEX\\s+orders_status_idx[\\s\\S]*EXPLAIN[\\s\\S]*DROP\\s+INDEX\\s+orders_status_idx" },
            { label: "The index is gone", assert: "SELECT to_regclass('orders_status_idx') IS NULL" },
          ],
          claims: [{ sql: "CREATE INDEX orders_status_idx ON orders (status); SELECT lab_plan('SELECT count(*) FROM orders WHERE status IN (''shipped'', ''delivered'')') LIKE '%Seq Scan%'", equals: "t" }],
          hint: "CREATE INDEX …; EXPLAIN SELECT …; DROP INDEX …;",
          revealSolution: false,
          successMessage: "Seq Scan even with the index: the evidence says this change does not help, so it does not stay.",
        },
      },
      {
        id: "a-db-p12-writeup",
        title: "Write up the evidence",
        explain:
          "A performance investigation is a short document: the problem (query and how slow), the BEFORE plan with its numbers, each change tried, the AFTER plan, whether the result stayed identical, and the decision for each change (kept or dropped, and why). Include the cost side: the size of any index you kept and the write-heavy tables it affects.",
        decision: decide({
          scenario: "Your write-up says: 'Added an index; the query is faster now.'",
          question: "What is missing to make it evidence?",
          right: ["The before-and-after plans and measurements, proof the result is unchanged, and the cost of the index", "Claims need numbers, and trade-offs need stating."],
          wrong: [
            ["Nothing; faster is faster", "Without measurements nobody can check it."],
            ["The colour scheme of the report", "Presentation is not evidence."],
            ["A promise to check again next year", "The evidence belongs in this document."],
          ],
          at: 0,
          aftermath: "That is the checkpoint: evidence for what improved performance and what did not.",
        }),
      },
    ],
    task: {
      title: "Week 12 practical: the performance investigation",
      intro: "Do the investigation on your own server with more data.",
      prompts: [
        "On your own PostgreSQL, create the orders tables with 1,000,000 rows (change the generate_series limits), and ANALYZE them.",
        "For the customer-service query, record EXPLAIN (ANALYZE, BUFFERS) before any index, after an index on (customer_id) only, and after (customer_id, ordered_on). Run each three times and note the times and Buffers.",
        "Record the status-index experiment and explain, with its plan, why it did not help.",
        "Measure how long inserting 100,000 rows takes with no extra indexes and with three, and include the sizes from pg_relation_size.",
        "Checkpoint: submit a performance investigation with evidence explaining which changes improved performance and which did not.",
      ],
      closing: "Next: Week 13, putting logic inside the database with views, functions, procedures and triggers.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
