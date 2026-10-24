/**
 * RELATIONAL DATABASES · WEEK 11 · TRANSACTIONS AND CONCURRENCY CONTROL
 *
 * Curriculum 11.1 – 11.P. Transactions and the ACID properties, BEGIN,
 * COMMIT and ROLLBACK, savepoints, transaction boundaries, concurrent users,
 * lost updates, isolation levels, locks, deadlocks and retries, and why money
 * and stock need all of it.
 *
 * Concurrency needs two sessions at once, which a lab in the page cannot
 * show honestly. So every two-session example is a RECORDING: two real psql
 * sessions on a PostgreSQL 18.6 server, driven step by step by
 * scripts/dbRecord.mjs (the "duets"), with each session's real output and the
 * moments one session was blocked by the other. Single-session behaviour
 * (BEGIN, ROLLBACK, savepoints, constraint failures) is practised in labs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BANK, STORE, decide, duet, term } from "./db-helpers.js";

export const SECTION_ID = "db-s11-transactions";
const MODULE = "db-m11-transactions";

const BALANCES = "SELECT id, owner, balance FROM accounts ORDER BY id";
const TRANSFERS = "SELECT from_account, to_account, amount FROM transfers ORDER BY id";
const RECORDED = "Recorded from two real psql sessions, A and B, on PostgreSQL 18.6 (accounts: Ada 5000.00, Bayo 3000.00).";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 11.1 – 11.5 · TRANSACTIONS AND ACID
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l57-acid",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3", "11.4", "11.5"],
    title: "Transactions and ACID",
    subtitle: "Atomicity, consistency, isolation and durability",
    estimatedMinutes: 50,
    intro:
      "Moving ₦1,000 from Ada to Bayo is two changes: take it from one account, add it to the other. If only one happens, money is created or destroyed. Transactions are how a database makes several changes behave as one.",
    atoms: [
      {
        id: "a-db-transaction",
        title: "What a transaction is and why it matters",
        explain:
          "A TRANSACTION is a group of statements the database treats as ONE unit of work: either all of their changes are kept, or none are. BEGIN starts one, COMMIT makes its changes permanent and visible to others, ROLLBACK discards them. Outside an explicit transaction, every statement is its own tiny transaction (AUTOCOMMIT). Any operation that changes several rows that must stay consistent with each other (a transfer, an order and its stock, an enrollment and its first payment) belongs in one transaction.",
        sqlLab: {
          setup: BANK,
          task:
            "Transfer 1000 from Ada (account 1) to Bayo (account 2) as one transaction: BEGIN; take it from Ada; add it to Bayo; record it in transfers (from_account, to_account, amount); COMMIT;",
          starter: "BEGIN;\n\n\n\nCOMMIT;\n",
          solution: "BEGIN;\n\nUPDATE accounts SET balance = balance - 1000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 1000 WHERE id = 2;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (1, 2, 1000);\n\nCOMMIT;\n",
          checks: [
            { label: "Ada has 4000.00 and Bayo 4000.00", query: BALANCES, ordered: true },
            { label: "The transfer is recorded", query: TRANSFERS, ordered: true },
            { label: "No money was created or destroyed", assert: "SELECT sum(balance) = 8250.00 FROM accounts" },
            { label: "Committed", noOpenTransaction: true },
          ],
          hint: "Two UPDATEs (minus on 1, plus on 2) and an INSERT into transfers, between BEGIN and COMMIT.",
          successMessage: "Three changes, one unit of work. The total across all accounts is unchanged: 8,250.00.",
        },
      },
      {
        id: "a-db-atomicity",
        title: "Atomicity: all or nothing",
        explain:
          "ATOMICITY means a transaction cannot be half done. If any statement fails (a constraint, a crash, a lost connection) the whole transaction is rolled back. Watch the difference: Chi has only 250. Without a transaction, 'add 5000 to Ada' succeeds and then 'take 5000 from Chi' fails its CHECK (balance >= 0): Ada got money from nowhere. Inside BEGIN … COMMIT, the failure aborts the transaction, COMMIT turns into ROLLBACK, and nothing changes. Run the example and look at the final balances.",
        sqlDemo: {
          setup: BANK,
          continueOnError: true,
          expectError: "violates check constraint",
          caption: "Without a transaction (first part) and with one (second part). The same failure, very different results.",
          code: "-- 1. No transaction: each statement commits on its own\nUPDATE accounts SET balance = balance + 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance - 5000 WHERE id = 3;\nSELECT id, owner, balance FROM accounts ORDER BY id;\n\n-- 2. Undo part 1's damage, then try again inside a transaction\nUPDATE accounts SET balance = 5000 WHERE id = 1;\nBEGIN;\nUPDATE accounts SET balance = balance + 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance - 5000 WHERE id = 3;\nCOMMIT;\nSELECT id, owner, balance FROM accounts ORDER BY id;",
        },
        decision: decide({
          scenario: "In the example's transaction, the second UPDATE failed. The script then sent COMMIT.",
          question: "What did PostgreSQL do with the COMMIT, and why?",
          right: ["It rolled the transaction back (psql shows ROLLBACK), because a transaction that hit an error can only end by rolling back", "An aborted transaction cannot commit any of its changes."],
          wrong: [
            ["It committed the first UPDATE only", "That would break atomicity."],
            ["It committed both, ignoring the error", "Failed changes are never committed."],
            ["It retried the failed UPDATE", "PostgreSQL never retries by itself."],
          ],
          at: 0,
          aftermath: "Ada ends with 5000.00 and Chi with 250.00: as if the failed transfer never happened.",
        }),
      },
      {
        id: "a-db-consistency",
        title: "Consistency: preserving the database's rules",
        explain:
          "CONSISTENCY means a transaction takes the database from one valid state to another: every constraint (CHECK, FOREIGN KEY, UNIQUE, NOT NULL) holds when it commits. The database enforces the declared rules; YOU are responsible for the rest of the business logic, such as 'money moved out equals money moved in'. Some constraints can be checked at COMMIT instead of after each statement (DEFERRABLE INITIALLY DEFERRED), which lets a transaction pass through a temporarily invalid state, such as inserting two rows that reference each other.",
        decision: decide({
          scenario: "A transfer transaction runs UPDATE … balance - 1000 for Ada and, by a bug, UPDATE … balance + 100 for Bayo, then COMMITs. Every CHECK constraint passes.",
          question: "Is the database consistent after COMMIT?",
          right: ["It satisfies every declared constraint, but the business rule (money conserved) is broken: the database only enforces the rules it is told", "Consistency in ACID covers declared rules; the rest is the application's job, or a rule you must declare."],
          wrong: [
            ["No, PostgreSQL will refuse the COMMIT", "Nothing declared forbids it."],
            ["Yes, completely: ACID guarantees the business logic", "ACID guarantees declared constraints, not arithmetic you got wrong."],
            ["No, the transfer will be rolled back automatically at midnight", "There is no such mechanism."],
          ],
          at: 2,
          aftermath: "Week 13 shows how a trigger or a function can enforce rules like this inside the database.",
        }),
      },
      {
        id: "a-db-isolation",
        title: "Isolation: managing concurrent operations",
        explain:
          "ISOLATION means concurrent transactions do not see each other's unfinished work. Below, session A takes 1000 from Ada inside a transaction. Before A commits, session B reads Ada's balance and still sees 5000.00: B never sees A's UNCOMMITTED change (no 'dirty reads' in PostgreSQL). After A commits, B sees 4000.00. How much isolation transactions get, and at what cost, is set by the ISOLATION LEVEL (Lesson 60).",
        example: `${RECORDED}\n\n${duet("no-dirty-reads")}`,
        decision: decide({
          scenario: "In the recording, B read 5000.00 while A's transaction had already subtracted 1000.",
          question: "Why did B see 5000.00?",
          right: ["A had not committed, and PostgreSQL never shows other sessions uncommitted changes", "Until COMMIT, A's change exists only inside A's transaction."],
          wrong: [
            ["B's query was cached", "Nothing was cached; B saw the last committed value."],
            ["A's UPDATE failed", "It reported UPDATE 1 and later committed."],
            ["B was reading a different table", "Same table, same row."],
          ],
          at: 1,
          aftermath: "This is why a half-finished transfer is never visible to anyone else.",
        }),
      },
      {
        id: "a-db-durability",
        title: "Durability: committed changes persist",
        explain:
          "DURABILITY means that once COMMIT returns, the change survives a crash or power cut. PostgreSQL writes every change to its WRITE-AHEAD LOG (WAL) and, at COMMIT, waits until the log is flushed to disk (fsync). After a crash, the server replays the WAL. Two settings control this: fsync (never turn it off on real data) and synchronous_commit (if off, COMMIT returns before the flush, which is faster but may lose the last fraction of a second of committed transactions after a crash: durability 'according to the system's guarantees'). Replicas and backups extend durability beyond one disk (Week 14).",
        terminalExercise: term("pg-locks", {
          only: ["SHOW synchronous_commit;", "SHOW fsync;", "SHOW default_transaction_isolation;"],
          goal: "Check whether this server waits for the write-ahead log to reach disk before confirming a COMMIT.",
          accept: ["SHOW synchronous_commit;"],
          near: [{ command: "SHOW fsync;", why: "fsync on means the server flushes to disk at all. Whether COMMIT WAITS for that flush is a separate setting." }],
          hint: "The setting's name says whether commits are synchronous with the log flush.",
          success: "synchronous_commit = on: COMMIT returns only after the WAL is safely on disk, the default and the durable choice.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 11.6 – 11.8 · BEGIN, COMMIT, ROLLBACK, SAVEPOINTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l58-begin-commit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.6", "11.7", "11.8"],
    title: "BEGIN, COMMIT, ROLLBACK and Savepoints",
    subtitle: "Controlling where a transaction starts and ends",
    estimatedMinutes: 40,
    intro:
      "Transactions are under your control: where they begin, where they end, and, with savepoints, how much of one to undo.",
    atoms: [
      {
        id: "a-db-commit-rollback",
        title: "BEGIN, COMMIT and ROLLBACK",
        explain:
          "BEGIN (or START TRANSACTION) opens a transaction; everything until COMMIT or ROLLBACK belongs to it. Inside it, your own session sees its changes immediately; others do not. ROLLBACK discards every change since BEGIN, which makes a transaction the safest place to try something: run it, look at the result, and keep it only if it is right. A session that disconnects with a transaction open has it rolled back. In PostgreSQL even CREATE TABLE and DROP TABLE can be rolled back.",
        sqlLab: {
          setup: STORE,
          task:
            "Try out a price change safely: BEGIN; raise every bag's unit_price by 20%; SELECT sku and unit_price of the bags to look at the result; then decide it is too steep and ROLLBACK; finally SELECT sku and unit_price of the bags again to show nothing changed.",
          starter: "BEGIN;\n\n",
          solution: "BEGIN;\n\nUPDATE products SET unit_price = unit_price * 1.20 WHERE category = 'bags';\n\nSELECT sku, unit_price FROM products WHERE category = 'bags' ORDER BY sku;\n\nROLLBACK;\n\nSELECT sku, unit_price FROM products WHERE category = 'bags' ORDER BY sku;\n",
          checks: [
            { label: "The final SELECT shows the original bag prices", result: { ordered: true } },
            { label: "Prices are unchanged", query: "SELECT sku, unit_price FROM products ORDER BY sku", ordered: true },
            { label: "Uses ROLLBACK", source: "\\bROLLBACK\\b" },
          ],
          hint: "BEGIN; UPDATE …; SELECT …; ROLLBACK; SELECT …; — the first SELECT shows the raised prices, the last the originals.",
          successMessage: "You saw the change, judged it, and threw it away. Nobody else ever saw the higher prices.",
        },
      },
      {
        id: "a-db-savepoints",
        title: "Savepoints and partial rollback",
        explain:
          "SAVEPOINT name marks a point inside a transaction; ROLLBACK TO SAVEPOINT name undoes everything after it while keeping the work before it, and the transaction continues. This lets a long transaction recover from one failed step: try an optional part, and if it fails, roll back to the savepoint and carry on. After an error, a transaction is aborted until you roll back (to a savepoint or entirely). RELEASE SAVEPOINT forgets one you no longer need. Drivers use savepoints to implement nested transactions.",
        sqlLab: {
          setup: BANK,
          continueOnError: true,
          task:
            "In ONE transaction: move 1000 from Ada (1) to Bayo (2); then SAVEPOINT bonus; try to move 500 from Chi (3) to Ada, which fails Chi's CHECK; ROLLBACK TO SAVEPOINT bonus; then COMMIT. Ada's transfer to Bayo must survive.",
          starter: "BEGIN;\n\n\nCOMMIT;\n",
          solution: "BEGIN;\n\nUPDATE accounts SET balance = balance - 1000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 1000 WHERE id = 2;\n\nSAVEPOINT bonus;\n\nUPDATE accounts SET balance = balance - 500 WHERE id = 3;\nUPDATE accounts SET balance = balance + 500 WHERE id = 1;\n\nROLLBACK TO SAVEPOINT bonus;\n\nCOMMIT;\n",
          checks: [
            { label: "Ada 4000.00, Bayo 4000.00, Chi 250.00", query: BALANCES, ordered: true },
            { label: "Uses a savepoint and rolls back to it", source: "SAVEPOINT\\s+bonus[\\s\\S]*ROLLBACK\\s+TO\\s+(SAVEPOINT\\s+)?bonus" },
            { label: "The transaction was committed", noOpenTransaction: true },
          ],
          hint: "After the failed UPDATE the transaction is aborted; ROLLBACK TO SAVEPOINT bonus clears the failure and keeps the first transfer.",
          successMessage: "The failed part was undone, the good part committed. Without the savepoint, the error would have rolled back everything.",
        },
      },
      {
        id: "a-db-boundaries",
        title: "Transaction boundaries",
        explain:
          "Where a transaction starts and ends is a design decision. Too SMALL (autocommit per statement) and related changes can be half applied. Too LARGE (a whole import of 100,000 rows, or a transaction left open while a user thinks or a network call runs) and it holds locks for a long time, blocks other users, and loses everything on one failure. Good boundaries wrap exactly one business operation (one transfer, one order), contain no waiting for humans or slow external services, and are as short as possible.",
        decision: decide({
          scenario: "A checkout page does: BEGIN; reserve stock; call the payment provider over the internet (2–20 seconds); record the payment; COMMIT.",
          question: "What is the problem with this boundary?",
          right: ["The transaction holds stock locks during a slow external call, blocking other customers; reserve and record in short transactions around the call instead", "Never wait for networks or people inside a transaction."],
          wrong: [
            ["Nothing; longer transactions are safer", "Long transactions block others and fail more often."],
            ["The payment call should be inside two transactions", "Nesting does not shorten the lock time."],
            ["It should use autocommit for every statement", "Then the stock and payment could disagree."],
          ],
          at: 3,
          aftermath: "Real systems use a 'pending' state: commit the reservation, call the provider, then commit the result (or release the reservation).",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 11.9 – 11.10 · CONCURRENT USERS AND LOST UPDATES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l59-concurrency",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.9", "11.10"],
    title: "Concurrent Users and Lost Updates",
    subtitle: "What happens when two sessions change the same row",
    estimatedMinutes: 45,
    intro:
      "A database with one user is easy. Real ones serve hundreds at once, and two of them will eventually change the same account at the same moment. These recordings show exactly what PostgreSQL does.",
    atoms: [
      {
        id: "a-db-concurrent-writes",
        title: "Concurrent users reading and changing the same records",
        explain:
          "When two transactions UPDATE the same row, PostgreSQL takes a ROW LOCK for the first; the second WAITS until the first commits or rolls back, then works on the latest committed version. Readers never wait for writers and writers never wait for readers (MVCC: each transaction sees a consistent snapshot). In the recording, A adds 500 to Ada and B, a moment later, subtracts 1000. B's UPDATE waits for A; when A commits, B's UPDATE runs on A's result. Final balance 4500.00: both changes kept.",
        example: `${RECORDED}\n\n${duet("atomic-update")}`,
        decision: decide({
          scenario: "In the recording, session B's UPDATE did not return until A committed.",
          question: "Why did B wait?",
          right: ["A held a row lock on Ada's account from its UPDATE until COMMIT; B needed the same row", "Concurrent writes to one row are serialized by row locks."],
          wrong: [
            ["B's network connection was slow", "The wait ended exactly when A committed."],
            ["PostgreSQL processes one query at a time on the whole server", "Other rows and readers proceed in parallel."],
            ["B was reading, and reads always wait", "Plain reads never wait for writers."],
          ],
          at: 0,
          aftermath: "Because B's UPDATE was relative (balance - 1000), it applied to A's committed result, and nothing was lost.",
        }),
      },
      {
        id: "a-db-lost-update",
        title: "Lost updates and other concurrency problems",
        explain:
          "A LOST UPDATE happens when two sessions READ a value, compute a new one in the application, and WRITE it back: the second write overwrites the first, using a value that was already out of date. In the recording, both sessions read 5000.00; A writes 5500.00 (a deposit of 500), B writes 4000.00 (a withdrawal of 1000). B waited for A's lock, then overwrote it: the final balance is 4000.00 and the deposit vanished. Other anomalies: non-repeatable reads (a row changes between two reads in one transaction) and phantoms (new rows appear in a repeated query). Fixes: write relative updates (SET balance = balance - 1000), lock the row when reading (SELECT … FOR UPDATE), or use a stricter isolation level.",
        example: `${RECORDED}\n\n${duet("lost-update")}`,
        sqlLab: {
          setup: BANK,
          task:
            "Rewrite this application-style 'read then write' withdrawal so it cannot lose an update: in a transaction, lock Ada's row as you read her balance with SELECT … FOR UPDATE, then update with a relative change (balance - 1000), and COMMIT.",
          starter: "BEGIN;\nSELECT balance FROM accounts WHERE id = 1;          -- the app reads 5000.00\nUPDATE accounts SET balance = 4000.00 WHERE id = 1; -- and writes back its own result\nCOMMIT;\n",
          solution: "BEGIN;\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\nUPDATE accounts SET balance = balance - 1000 WHERE id = 1;\nCOMMIT;\n",
          checks: [
            { label: "Ada has 4000.00", query: BALANCES, ordered: true },
            { label: "The read locks the row", source: "FOR\\s+UPDATE" },
            { label: "The update is relative, not a hard-coded result", source: "balance\\s*=\\s*balance\\s*-" },
            { label: "Committed", noOpenTransaction: true },
          ],
          hint: "Add FOR UPDATE to the SELECT, and write SET balance = balance - 1000.",
          successMessage: "Same result alone, but under concurrency the other session would now wait for your lock and then see your committed balance.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 11.11 – 11.12 · ISOLATION LEVELS, LOCKS AND DEADLOCKS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l60-isolation-locks",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.11", "11.12"],
    title: "Isolation Levels, Locks and Deadlocks",
    subtitle: "How strict, at what cost, and what to do when transactions collide",
    estimatedMinutes: 50,
    intro:
      "Isolation is a dial, not a switch. Stricter levels prevent more anomalies but make some transactions fail and need retrying. And sometimes two transactions wait for each other forever, until the database steps in.",
    atoms: [
      {
        id: "a-db-isolation-levels",
        title: "Isolation levels and their trade-offs",
        explain:
          "The SQL standard defines four levels. PostgreSQL implements three (READ UNCOMMITTED behaves as READ COMMITTED). READ COMMITTED (PostgreSQL's default): each STATEMENT sees data committed before it began, so a row can change between two SELECTs in one transaction (a non-repeatable read, first recording). REPEATABLE READ: the whole TRANSACTION sees one snapshot taken at its first statement, so repeated reads agree; if it then tries to update a row another transaction changed, it fails with 'could not serialize access due to concurrent update' (second recording) and must be retried. SERIALIZABLE: transactions behave as if run one after another; more retries. MySQL's InnoDB defaults to REPEATABLE READ.",
        example: `${RECORDED}\n\nREAD COMMITTED (the default):\n${duet("non-repeatable-read")}\n\nREPEATABLE READ:\n${duet("repeatable-read")}`,
        decision: decide({
          scenario: "An end-of-day report runs ten SELECTs inside one transaction and must see figures that add up, even while payments keep arriving.",
          question: "Which isolation level fits the report?",
          right: ["REPEATABLE READ (or SERIALIZABLE): every query in the transaction sees the same snapshot", "Under READ COMMITTED, payments committed between the queries would make the figures disagree."],
          wrong: [
            ["READ COMMITTED, the default", "Each SELECT would see a different moment."],
            ["READ UNCOMMITTED, to include payments still in progress", "PostgreSQL never shows uncommitted data, and you would not want it."],
            ["No transaction at all", "Then every SELECT is its own moment."],
          ],
          at: 1,
          aftermath: "Read-only reports at REPEATABLE READ never hit serialization failures; only writers can.",
        }),
      },
      {
        id: "a-db-deadlocks",
        title: "Deadlocks, locks and retry strategies",
        explain:
          "A DEADLOCK is two transactions each waiting for a lock the other holds: A locked row 1 and wants row 2; B locked row 2 and wants row 1. Neither can proceed. PostgreSQL checks for this after deadlock_timeout (1 second by default), aborts ONE of them with 'deadlock detected', and the other continues. In the recording, B was chosen. Prevention: take locks in a CONSISTENT ORDER (always lock the lower account id first), keep transactions short, and lock what you need early (SELECT … FOR UPDATE). Because deadlocks and serialization failures can always happen, applications must RETRY the whole transaction on errors 40P01 (deadlock) and 40001 (serialization failure), with a short random delay.",
        example: `${RECORDED}\n\n${duet("deadlock")}`,
        terminalExercise: term("pg-locks", {
          only: ["SHOW deadlock_timeout;", "SHOW default_transaction_isolation;", "SHOW synchronous_commit;"],
          goal: "Find how long PostgreSQL lets a session wait for a lock before checking whether it is part of a deadlock.",
          accept: ["SHOW deadlock_timeout;"],
          hint: "The setting is named after what it times.",
          success: "1s: after waiting one second, a blocked session checks the wait graph for a cycle, which is why the recording's error took about a second.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 11.13 · MONEY AND STOCK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l61-money-stock",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.13"],
    title: "Why Transfers and Inventory Need Transactions",
    subtitle: "Never overselling, never losing money",
    estimatedMinutes: 40,
    intro:
      "Two operations every business runs thousands of times a day, and where every concurrency mistake costs real money: moving money, and selling the last item in stock.",
    atoms: [
      {
        id: "a-db-inventory",
        title: "Inventory updates without overselling",
        explain:
          "The naive way to sell stock is: read stock, check it is enough in the application, then write stock − quantity. Two customers buying the last scarf at the same moment both read 1, both pass the check, and the store sells two. The safe pattern does the check and the change in ONE statement: UPDATE products SET stock = stock − 2 WHERE id = 7 AND stock >= 2 RETURNING id. The row lock makes concurrent buyers queue; the condition is re-checked on the latest value; if stock is short, 0 rows are updated and nothing is sold. Combine it with the order line in one transaction (or one statement, with a CTE).",
        sqlLab: {
          setup: STORE,
          task:
            "Sell 3 Aso-oke shirts (product 8, which has 4 in stock) to order 6 at their unit price, safely: in one statement, decrease the stock ONLY if at least 3 are available, and insert the order line ONLY if the decrease happened (WITH sold AS (UPDATE … WHERE … AND stock >= 3 RETURNING id, unit_price) INSERT INTO order_items … SELECT … FROM sold). Then try to sell 3 more the same way.",
          starter: "WITH sold AS (\n  UPDATE products\n  SET stock = stock - 3\n  WHERE id = 8\n  RETURNING id, unit_price\n)\nINSERT INTO order_items (order_id, product_id, quantity, unit_price)\nSELECT 6, id, 3, unit_price FROM sold;\n",
          solution: "WITH sold AS (\n  UPDATE products\n  SET stock = stock - 3\n  WHERE id = 8 AND stock >= 3\n  RETURNING id, unit_price\n)\nINSERT INTO order_items (order_id, product_id, quantity, unit_price)\nSELECT 6, id, 3, unit_price FROM sold;\n\nWITH sold AS (\n  UPDATE products\n  SET stock = stock - 3\n  WHERE id = 8 AND stock >= 3\n  RETURNING id, unit_price\n)\nINSERT INTO order_items (order_id, product_id, quantity, unit_price)\nSELECT 7, id, 3, unit_price FROM sold;\n",
          checks: [
            { label: "Only 1 shirt is left: the second sale did not happen", assert: "SELECT stock = 1 FROM products WHERE id = 8" },
            { label: "Exactly one order line for the shirts was added", query: "SELECT order_id, product_id, quantity FROM order_items WHERE product_id = 8 ORDER BY order_id", ordered: true },
            { label: "The stock check is part of the UPDATE", source: "stock\\s*>=\\s*3" },
          ],
          hint: "Add AND stock >= 3 to the UPDATE's WHERE. Run the same statement twice (the second for order 7): the first sells, the second updates 0 rows and inserts nothing.",
          successMessage: "INSERT 0 1, then INSERT 0 0: the shop refused to sell shirts it did not have, and no application check was needed.",
        },
      },
      {
        id: "a-db-transfers",
        title: "Financial transfers",
        explain:
          "A transfer must: (1) never leave the accounts out of balance (atomicity), (2) never overdraw (a CHECK constraint or a conditional update), (3) never lose an update when two transfers touch the same account (row locks via relative UPDATEs, or SELECT … FOR UPDATE), and (4) avoid deadlocks when two transfers go in opposite directions (lock both accounts in id order first). (5) Every transfer is recorded (an append-only transfers table), so balances can be audited against history. Banks add idempotency keys so a retried request is not applied twice.",
        decision: decide({
          scenario: "Two transfers run at once: Ada → Bayo and Bayo → Ada. Each locks its 'from' account first, then the 'to' account. They occasionally fail with deadlock detected.",
          question: "What is the best fix?",
          right: ["Lock both accounts in a fixed order (lowest id first) with SELECT … FOR UPDATE before updating, and retry on deadlock", "A consistent lock order makes the cycle impossible; retries handle the rest."],
          wrong: [
            ["Turn off deadlock detection", "Then the two would wait forever."],
            ["Use autocommit so no locks are held", "Then the debit and credit are not atomic."],
            ["Increase deadlock_timeout to an hour", "That only delays detection."],
          ],
          at: 0,
          aftermath: "Ordering locks is the classic, simple cure for deadlocks between similar transactions.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 11.P · PRACTICAL: THE BANK TRANSFER
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l62-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["11.P"],
    title: "Week 11 Practical: A Safe Bank Transfer",
    subtitle: "Valid transfers commit, invalid ones leave no trace",
    estimatedMinutes: 60,
    intro:
      "The checkpoint: a multi-step transfer transaction that preserves balances and rejects invalid transfers. The script below runs like psql: an error does not stop the script, so each transaction must protect itself.",
    atoms: [
      {
        id: "a-db-p11-transfers",
        title: "Three transfers, one of them invalid",
        explain:
          "Write three transfers, each as its own transaction that locks both accounts in id order (SELECT … WHERE id IN (…) ORDER BY id FOR UPDATE), debits, credits, records the transfer and commits. (1) Ada (1) → Bayo (2): 1500. (2) Chi (3) → Ada (1): 400, but Chi has only 250, so the debit must fail. (3) Bayo (2) → Chi (3): 700. The failed transfer must leave no trace: no balance change and no row in transfers. Notice that after the error, PostgreSQL reports ROLLBACK for that transaction's COMMIT.",
        sqlLab: {
          setup: BANK,
          continueOnError: true,
          task:
            "Three transfers, each its own BEGIN … COMMIT that locks both accounts (lowest id first) with FOR UPDATE, debits, credits and inserts into transfers: 1 → 2 for 1500; 3 → 1 for 400 (must fail and leave nothing behind); 2 → 3 for 700.",
          starter: "-- Transfer 1: 1 -> 2, 1500\n\n-- Transfer 2: 3 -> 1, 400\n\n-- Transfer 3: 2 -> 3, 700\n",
          solution: "-- Transfer 1: 1 -> 2, 1500\nBEGIN;\nSELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;\nUPDATE accounts SET balance = balance - 1500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 1500 WHERE id = 2;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (1, 2, 1500);\nCOMMIT;\n\n-- Transfer 2: 3 -> 1, 400 (Chi has only 250)\nBEGIN;\nSELECT id FROM accounts WHERE id IN (1, 3) ORDER BY id FOR UPDATE;\nUPDATE accounts SET balance = balance - 400 WHERE id = 3;\nUPDATE accounts SET balance = balance + 400 WHERE id = 1;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (3, 1, 400);\nCOMMIT;\n\n-- Transfer 3: 2 -> 3, 700\nBEGIN;\nSELECT id FROM accounts WHERE id IN (2, 3) ORDER BY id FOR UPDATE;\nUPDATE accounts SET balance = balance - 700 WHERE id = 2;\nUPDATE accounts SET balance = balance + 700 WHERE id = 3;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (2, 3, 700);\nCOMMIT;\n",
          checks: [
            { label: "Balances: Ada 3500.00, Bayo 3800.00, Chi 950.00", query: BALANCES, ordered: true },
            { label: "Only the two valid transfers are recorded", query: TRANSFERS, ordered: true },
            { label: "Money is conserved", assert: "SELECT sum(balance) = 8250.00 FROM accounts" },
            { label: "Each transfer locks its accounts first", source: "FOR\\s+UPDATE[\\s\\S]*FOR\\s+UPDATE[\\s\\S]*FOR\\s+UPDATE" },
            { label: "Nothing is left open", noOpenTransaction: true },
          ],
          hint: "Each transfer: BEGIN; SELECT … FOR UPDATE; two UPDATEs; INSERT; COMMIT;. The failing one needs no special code: its CHECK error aborts its own transaction only.",
          revealSolution: false,
          successMessage: "Transfer 2 failed on Chi's CHECK, its COMMIT became ROLLBACK, and transfers 1 and 3 committed untouched.",
        },
      },
      {
        id: "a-db-p11-test",
        title: "Test that invalid transfers are rejected",
        explain:
          "A tested transfer needs more than one bad case. With the constraints already on the bank tables, each of these must be refused by the database itself: a transfer of a negative amount, a transfer from an account to itself, a transfer to an account that does not exist, and a transfer that would overdraw. Write each as its own transaction attempt, after one valid transfer of 100 from Bayo to Ada, and make sure that after all of them only the valid one has changed anything.",
        sqlLab: {
          setup: BANK,
          continueOnError: true,
          task:
            "One valid transfer (2 → 1, 100), then four invalid attempts, each in its own BEGIN … COMMIT: amount -50 (1 → 2); from 1 to 1 (amount 10); 1 → 99 (account 99 does not exist, amount 10); 3 → 2 for 300 (overdraws Chi). Each attempt updates both balances and inserts into transfers. Only the valid transfer may change anything.",
          starter: "",
          solution: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 2;\nUPDATE accounts SET balance = balance + 100 WHERE id = 1;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (2, 1, 100);\nCOMMIT;\n\nBEGIN;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (1, 2, -50);\nUPDATE accounts SET balance = balance + 50 WHERE id = 1;\nUPDATE accounts SET balance = balance - 50 WHERE id = 2;\nCOMMIT;\n\nBEGIN;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (1, 1, 10);\nCOMMIT;\n\nBEGIN;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (1, 99, 10);\nUPDATE accounts SET balance = balance - 10 WHERE id = 1;\nCOMMIT;\n\nBEGIN;\nUPDATE accounts SET balance = balance - 300 WHERE id = 3;\nUPDATE accounts SET balance = balance + 300 WHERE id = 2;\nINSERT INTO transfers (from_account, to_account, amount) VALUES (3, 2, 300);\nCOMMIT;\n",
          checks: [
            { label: "Balances changed only by the valid transfer", query: BALANCES, ordered: true },
            { label: "Only the valid transfer is recorded", query: TRANSFERS, ordered: true },
            { label: "Four failed attempts were tried", source: "-50[\\s\\S]*\\(1,\\s*1,[\\s\\S]*99[\\s\\S]*300" },
            { label: "Nothing is left open", noOpenTransaction: true },
          ],
          hint: "Put each attempt's INSERT INTO transfers first: the transfers table's CHECKs and foreign keys reject the bad ones immediately, and the CHECK on balance catches the overdraft.",
          revealSolution: false,
          successMessage: "Four different rules, four refusals, and the accounts still add up. That is the checkpoint: a tested transaction that preserves balances and rejects invalid transfers.",
        },
      },
    ],
    task: {
      title: "Week 11 practical: the bank transfer",
      intro: "Repeat the experiments on your own server, with two psql windows open side by side.",
      prompts: [
        "Create the bank tables on your own PostgreSQL and run your three transfers from the lab. Paste psql's output, including the ROLLBACK reported for the failed one.",
        "Open two psql windows and reproduce the lost update from Lesson 59 with read-then-write, then show the fix with balance = balance - n and with SELECT … FOR UPDATE.",
        "Reproduce the deadlock with opposite-order updates, then show that locking both accounts in id order prevents it.",
        "Write down which isolation level you would use for transfers and for the end-of-day report, and why.",
        "Checkpoint: write and test a multi-step transaction that preserves account balances and rejects invalid transfers.",
      ],
      closing: "Next: Week 12, indexes and query performance: making the right queries fast, with evidence.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
