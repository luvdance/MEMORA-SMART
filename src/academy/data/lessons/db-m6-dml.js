/**
 * RELATIONAL DATABASES · WEEK 6 · DATA MANIPULATION LANGUAGE (DML)
 *
 * Curriculum 6.1 – 6.P. INSERT one and many rows, UPDATE and DELETE with
 * conditions, RETURNING, several columns at once, related records with their
 * foreign keys, NULL and three-valued logic, the missing WHERE clause,
 * checking affected rows before committing, and parameterized SQL versus
 * concatenating input into SQL strings. Every lab works on the online store
 * built in Week 5, filled with sample data.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { STORE, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s6-dml";
const MODULE = "db-m6-dml";

const PRODUCTS_NOW = "SELECT sku, name, unit_price, stock, is_listed FROM products ORDER BY sku";
const ORDERS_NOW = "SELECT id, customer_id, status FROM orders ORDER BY id";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 6.1 – 6.3 · INSERT, UPDATE AND DELETE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l29-insert-update-delete",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3"],
    title: "INSERT, UPDATE and DELETE",
    subtitle: "Adding, changing and removing records, precisely",
    estimatedMinutes: 40,
    intro:
      "Three statements change data. Each is simple to write and, used carelessly, simple to regret. This week is about writing them so that they change exactly the rows you intend, and nothing else.",
    atoms: [
      {
        id: "a-db-insert-many",
        title: "INSERT INTO for one or many records",
        explain:
          "INSERT INTO table (columns) VALUES (…); adds one row; VALUES (…), (…), (…) adds several in one statement, which is faster and all-or-nothing: if any row breaks a constraint, none are inserted. INSERT INTO table (columns) SELECT … inserts the RESULT of a query, which is how data is copied between tables (you did it in Week 4). psql reports INSERT 0 n.",
        sqlLab: {
          setup: STORE,
          task:
            "The store receives three new products. Insert them in ONE statement: ('TEA-003', 'Hibiscus tea 100g', 'food', 2000, 30), ('BAG-003', 'Raffia beach bag', 'bags', 12500, 8), ('SHE-003', 'Coconut oil 500ml', 'beauty', 4200, 25). The columns are sku, name, category, unit_price, stock.",
          starter: "INSERT INTO products (sku, name, category, unit_price, stock)\nVALUES ",
          solution: "INSERT INTO products (sku, name, category, unit_price, stock)\nVALUES ('TEA-003', 'Hibiscus tea 100g', 'food', 2000, 30),\n       ('BAG-003', 'Raffia beach bag', 'bags', 12500, 8),\n       ('SHE-003', 'Coconut oil 500ml', 'beauty', 4200, 25);\n",
          checks: [
            { label: "The three products are stored exactly", query: PRODUCTS_NOW, ordered: true },
            { label: "One INSERT statement", source: "^(?![\\s\\S]*INSERT[\\s\\S]*INSERT)[\\s\\S]*INSERT" },
          ],
          hint: "One INSERT INTO … VALUES with three bracketed rows separated by commas.",
          successMessage: "Eleven products. A multi-row INSERT is one statement, so a single bad row would have stopped all three.",
        },
      },
      {
        id: "a-db-update-where",
        title: "UPDATE with conditions",
        explain:
          "UPDATE table SET column = value WHERE condition; changes the matching rows. The new value can use the old one: SET stock = stock + 10 adds ten to whatever is there, which is safer than calculating the new number yourself and typing it in. The WHERE clause decides WHICH rows; write it first and check it with a SELECT using the same WHERE. psql reports UPDATE n: how many rows changed. Constraints still apply: an UPDATE that would make stock negative is refused.",
        sqlLab: {
          setup: STORE,
          task:
            "A delivery arrives: add 20 to the stock of the Adire scarf (SKU SCA-001) and 12 to the Aso-oke shirt (SKU SHI-001). Use stock = stock + n, one UPDATE per product.",
          starter: "UPDATE products\nSET stock = stock + 20\n",
          solution: "UPDATE products\nSET stock = stock + 20\nWHERE sku = 'SCA-001';\n\nUPDATE products\nSET stock = stock + 12\nWHERE sku = 'SHI-001';\n",
          checks: [
            { label: "SCA-001 has 32, SHI-001 has 16, every other product is unchanged", query: PRODUCTS_NOW, ordered: true },
            { label: "Stock is increased relative to its current value", source: "stock\\s*=\\s*stock\\s*\\+" },
          ],
          mustFail: ["UPDATE products SET stock = stock + 20;\nUPDATE products SET stock = stock + 12 WHERE sku = 'SHI-001';"],
          hint: "Each UPDATE needs a WHERE sku = '…' so only that product changes. Without it, every product gets the extra stock.",
          successMessage: "Two products changed, eight untouched. Try the starter as it is: it adds 20 to every product.",
        },
      },
      {
        id: "a-db-delete-where",
        title: "DELETE with conditions",
        explain:
          "DELETE FROM table WHERE condition; removes the matching rows; psql reports DELETE n. Foreign keys still protect references: you cannot delete a product that order lines refer to (with the default action). Many businesses rarely delete real records at all: they mark them (is_listed = false, status = 'cancelled', deleted_at = now()) so history survives, and keep DELETE for genuinely wrong or temporary data.",
        sqlLab: {
          setup: STORE,
          task:
            "Remove the products that are NOT listed (is_listed is false) and have NO stock left. Only rows meeting both conditions may be deleted.",
          starter: "DELETE FROM products\n",
          solution: "DELETE FROM products\nWHERE is_listed = false\n  AND stock = 0;\n",
          checks: [
            { label: "Only unlisted, out-of-stock products were removed", query: PRODUCTS_NOW, ordered: true },
          ],
          mustFail: ["DELETE FROM products WHERE is_listed = false;", "DELETE FROM products WHERE stock = 0;"],
          hint: "Two conditions joined with AND. Check with SELECT … WHERE … first: in this data, no product is both.",
          successMessage: "DELETE 0: no product is both unlisted and out of stock, so nothing was removed. A condition that matches nothing is not an error; check the count when it matters.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 6.4 – 6.6 · RETURNING, MULTI-COLUMN UPDATES, RELATED RECORDS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l30-returning-related",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.4", "6.5", "6.6"],
    title: "RETURNING, Multi-Column Updates and Related Records",
    subtitle: "Getting back what changed, and inserting parents and children",
    estimatedMinutes: 45,
    intro:
      "Real changes rarely touch one value in one table. An order needs a customer, the order row and its lines, linked by ids that the database generates as it goes.",
    atoms: [
      {
        id: "a-db-returning",
        title: "RETURNING in PostgreSQL",
        explain:
          "INSERT, UPDATE and DELETE can end with RETURNING columns, which makes them return the affected rows like a SELECT: the generated id and defaults of an INSERT, the new values after an UPDATE, the rows a DELETE removed. It saves a second query and avoids guessing (never SELECT max(id) to find 'your' new row: another user may have inserted since). MySQL has no RETURNING; MariaDB and SQLite do.",
        sqlLab: {
          setup: STORE,
          task:
            "Insert a new customer, Kemi Adewale, kemi@example.com, in Lagos, and in the same statement return her id, full_name and created_on.",
          starter: "INSERT INTO customers (full_name, email, city)\nVALUES ('Kemi Adewale', 'kemi@example.com', 'Lagos')\n",
          solution: "INSERT INTO customers (full_name, email, city)\nVALUES ('Kemi Adewale', 'kemi@example.com', 'Lagos')\nRETURNING id, full_name, created_on;\n",
          checks: [
            { label: "Returns the new id, full_name and created_on", result: { names: true } },
            { label: "Kemi is stored once", assert: "SELECT count(*) = 1 FROM customers WHERE email = 'kemi@example.com'" },
          ],
          hint: "Add RETURNING id, full_name, created_on before the semicolon.",
          successMessage: "id 7 and today's date, which the database generated, handed straight back.",
        },
      },
      {
        id: "a-db-update-multiple",
        title: "Updating several columns at once",
        explain:
          "One UPDATE can set several columns: SET status = 'shipped', shipped_on = current_date. All the new values are computed from the row as it was BEFORE the update, so SET a = b, b = a swaps two columns. Updating related columns in one statement keeps them consistent: no other session can see a row with the new status but without its date. Combine with RETURNING to see the result.",
        sqlLab: {
          setup: STORE,
          task:
            "Products are re-priced: every product in the clothing category gets 10% added to unit_price, AND is marked is_listed = true, in ONE UPDATE. Return the sku and new unit_price of each changed product.",
          starter: "UPDATE products\nSET\n",
          solution: "UPDATE products\nSET unit_price = unit_price * 1.10,\n    is_listed = true\nWHERE category = 'clothing'\nRETURNING sku, unit_price;\n",
          checks: [
            { label: "Returns each clothing product's sku and new price", result: true },
            { label: "Only clothing changed", query: PRODUCTS_NOW, ordered: true },
          ],
          hint: "SET unit_price = unit_price * 1.10, is_listed = true WHERE category = 'clothing' RETURNING sku, unit_price;",
          successMessage: "numeric(10,2) rounded 6600.000 and 20350.000 to two decimals, exactly as money should be.",
        },
      },
      {
        id: "a-db-related-inserts",
        title: "Inserting related records and preserving foreign keys",
        explain:
          "A new order means rows in three tables: the order (which needs the customer's id) and its items (which need the order's new id). Insert parents first and carry their generated ids forward. In PostgreSQL you can do it in ONE statement with data-modifying CTEs: WITH new_order AS (INSERT INTO orders (customer_id) VALUES (3) RETURNING id) INSERT INTO order_items (order_id, product_id, quantity, unit_price) SELECT id, 5, 2, 1800 FROM new_order; The foreign keys guarantee you cannot get it wrong silently: an item with a made-up order id is refused. In application code the same is done with RETURNING inside a transaction (Week 15).",
        sqlLab: {
          setup: STORE,
          task:
            "Zainab Ali (customer 3) orders 2 × product 5 (Zobo tea, 1800 each) and 1 × product 1 (Ankara tote, 8500). Create the order and both items in ONE statement using WITH … RETURNING, so you never type the new order's id.",
          starter: "WITH new_order AS (\n  INSERT INTO orders (customer_id)\n  VALUES (3)\n  RETURNING id\n)\n",
          solution: "WITH new_order AS (\n  INSERT INTO orders (customer_id)\n  VALUES (3)\n  RETURNING id\n)\nINSERT INTO order_items (order_id, product_id, quantity, unit_price)\nSELECT id, 5, 2, 1800 FROM new_order\nUNION ALL\nSELECT id, 1, 1, 8500 FROM new_order;\n",
          checks: [
            { label: "There is one new order for customer 3", query: ORDERS_NOW, ordered: true },
            { label: "It has exactly the two items", query: "SELECT product_id, quantity, unit_price FROM order_items WHERE order_id = (SELECT max(id) FROM orders) ORDER BY product_id", ordered: true },
            { label: "No order id was typed by hand", forbid: "VALUES\\s*\\(\\s*8\\s*," },
          ],
          hint: "After the CTE: INSERT INTO order_items (…) SELECT id, 5, 2, 1800 FROM new_order UNION ALL SELECT id, 1, 1, 8500 FROM new_order;",
          successMessage: "Parent and children in one statement, linked by an id nobody typed. If any part fails, none of it is saved.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 6.7 – 6.9 · NULL, MISSING WHERE, AFFECTED ROWS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l31-null-safety",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.7", "6.8", "6.9"],
    title: "NULL, and Changing Data Safely",
    subtitle: "Unknown values, the missing WHERE, and checking before committing",
    estimatedMinutes: 45,
    intro:
      "Most data disasters are not hacks. They are an UPDATE without a WHERE, or a condition that silently skipped the NULLs. This lesson is about not being the person who caused one.",
    atoms: [
      {
        id: "a-db-null",
        title: "NULL is not zero and not an empty string",
        explain:
          "NULL means 'no value' or 'unknown'. It is not 0 (a known number) and not '' (a known, empty text). Any comparison with NULL gives NULL, not true or false: phone = NULL is never true, and phone <> '0803…' does not match rows where phone is NULL. Test for it with IS NULL and IS NOT NULL. Arithmetic with NULL gives NULL (price + NULL is NULL). COALESCE(value, fallback) replaces a NULL with a fallback: COALESCE(phone, 'no phone'). A WHERE keeps only rows where the condition is TRUE, so rows where it is NULL silently disappear.",
        sqlDemo: {
          setup: STORE,
          caption: "Two customers have no phone. '= NULL' finds nobody; IS NULL finds them; COALESCE fills the gap for display.",
          code: "SELECT count(*) AS equals_null FROM customers WHERE phone = NULL;\n\nSELECT full_name FROM customers WHERE phone IS NULL;\n\nSELECT full_name, COALESCE(phone, 'no phone') AS phone\nFROM customers\nORDER BY id;",
        },
        sqlLab: {
          setup: STORE,
          task:
            "Marketing wants to SMS every customer EXCEPT those in Lagos. Return the full_name and phone of customers who have a phone and are not in Lagos.",
          starter: "SELECT full_name, phone\nFROM customers\nWHERE city <> 'Lagos';\n",
          solution: "SELECT full_name, phone\nFROM customers\nWHERE city <> 'Lagos'\n  AND phone IS NOT NULL;\n",
          checks: [{ label: "Customers outside Lagos who have a phone", result: true }],
          hint: "A customer with no phone cannot receive an SMS. Add AND phone IS NOT NULL.",
          successMessage: "Tunde and Ngozi have no phone, so they are left out; the SMS system would have choked on their NULLs.",
        },
      },
      {
        id: "a-db-missing-where",
        title: "The impact of a missing WHERE clause",
        explain:
          "UPDATE products SET unit_price = 0; and DELETE FROM orders; are valid SQL. Without WHERE they apply to EVERY row, instantly, and psql simply reports how many. In autocommit mode (the default) there is no undo; only a backup, if one exists, can bring the data back, and everything since the backup is lost. Habits that prevent it: write the WHERE before the SET; run the same WHERE as a SELECT first; do dangerous changes inside BEGIN … COMMIT and look before committing (next atom); and on production, use an account that is not allowed to make bulk changes (Week 14).",
        sqlDemo: {
          setup: STORE,
          caption: "One missing line. Every product is now free.",
          code: "UPDATE products\nSET unit_price = 1;\n-- WHERE sku = 'TEA-001';   (the line that was forgotten)\n\nSELECT sku, unit_price FROM products ORDER BY sku;",
        },
        decision: decide({
          scenario: "At 4:55 p.m. a support agent runs UPDATE customers SET email = 'new.address@example.com'; meaning to change one customer. psql replies UPDATE 6.",
          question: "What is the honest situation?",
          right: ["All six customers now have the same email; the old emails can only be recovered from a backup or logs", "Autocommitted changes cannot be undone with SQL."],
          wrong: [
            ["Run UNDO to reverse it", "SQL has no UNDO for committed changes."],
            ["Only the first customer changed", "UPDATE 6 says six rows changed."],
            ["Nothing is saved until the end of the working day", "In autocommit mode each statement is saved the moment it succeeds."],
          ],
          at: 1,
          aftermath: "This is why the next atom exists, and why Week 14 is about backups you have actually restored.",
        }),
      },
      {
        id: "a-db-check-affected",
        title: "Validating affected rows before destructive operations",
        explain:
          "The professional routine for any risky change: (1) run the WHERE as a SELECT count(*) and look at the number; (2) BEGIN a transaction; (3) run the UPDATE or DELETE and compare its reported row count with what you expected; (4) look at the result; (5) COMMIT only if everything matches, otherwise ROLLBACK, which undoes it all. Until COMMIT, nobody else sees the change. RETURNING shows exactly which rows were affected. Inside a transaction, a mistake costs nothing.",
        sqlLab: {
          setup: STORE,
          task:
            "Cancel every PENDING order placed before 2026-04-15. Do it safely: BEGIN; UPDATE orders SET status = 'cancelled' WHERE status = 'pending' AND ordered_on < '2026-04-15' RETURNING id; then COMMIT;",
          starter: "BEGIN;\n\n-- the UPDATE, with RETURNING id\n\n",
          solution: "BEGIN;\n\nUPDATE orders\nSET status = 'cancelled'\nWHERE status = 'pending'\n  AND ordered_on < '2026-04-15'\nRETURNING id;\n\nCOMMIT;\n",
          checks: [
            { label: "Only order 4 was cancelled", query: ORDERS_NOW, ordered: true },
            { label: "The UPDATE returned the cancelled order's id", result: true },
            { label: "The transaction was committed", noOpenTransaction: true },
          ],
          hint: "Write BEGIN; then the UPDATE with both conditions and RETURNING id; then COMMIT;. Leaving out COMMIT means the change is rolled back.",
          successMessage: "RETURNING showed exactly one order before you committed. Change COMMIT to ROLLBACK and run it: nothing changes at all.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 6.10 · PARAMETERIZED SQL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l32-parameterized",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.10"],
    title: "Parameterized SQL",
    subtitle: "Why user input must never be glued into SQL text",
    estimatedMinutes: 35,
    intro:
      "Applications build SQL from what users type: a search box, a login form, an order id in a URL. How that input reaches the database decides whether the application is safe.",
    atoms: [
      {
        id: "a-db-concatenation",
        title: "What goes wrong when input is concatenated",
        explain:
          "Suppose an application builds 'SELECT * FROM customers WHERE email = ''' || input || '''' and a user types x' OR '1'='1 into the search box. The SQL becomes WHERE email = 'x' OR '1'='1', which is true for every row: the 'search' returns every customer. Worse inputs can end the statement and start another. This is SQL INJECTION, one of the most common and damaging vulnerabilities on the web. The cause is treating DATA as part of the CODE. The example simulates the vulnerable application inside PostgreSQL, so you can see the generated SQL and its result.",
        sqlDemo: {
          setup: STORE,
          caption: "A function that builds SQL by gluing text, as a vulnerable application would. Look at the SQL it builds, then at what it returns for one 'search'.",
          code: "CREATE FUNCTION unsafe_find(input text) RETURNS SETOF customers\nLANGUAGE plpgsql AS $$\nDECLARE\n  query text := 'SELECT * FROM customers WHERE email = ''' || input || '''';\nBEGIN\n  RAISE NOTICE 'SQL sent: %', query;\n  RETURN QUERY EXECUTE query;\nEND\n$$;\n\nSELECT full_name, email FROM unsafe_find('amaka@example.com');\n\nSELECT full_name, email FROM unsafe_find($$x' OR '1'='1$$);",
        },
        decision: decide({
          scenario: "A login form checks a password with: \"SELECT id FROM users WHERE email = '\" + email + \"' AND password_hash = '\" + hash + \"'\". An attacker types admin@site.com' -- as the email.",
          question: "What happens?",
          right: ["The -- turns the rest of the SQL into a comment, so the password check disappears and the attacker logs in as admin", "Input became SQL code."],
          wrong: [
            ["The login fails because the email has a quote in it", "The quote is exactly what lets the input escape into SQL."],
            ["PostgreSQL detects and blocks the attack", "The database receives valid SQL; it cannot know the text came from a user."],
            ["Only that user's password is changed", "Nothing is changed; the check is bypassed."],
          ],
          at: 0,
          aftermath: "The fix is not cleverer string handling. It is never mixing data into SQL text at all.",
        }),
      },
      {
        id: "a-db-parameters",
        title: "Parameterized queries",
        explain:
          "A PARAMETERIZED query sends the SQL with PLACEHOLDERS ($1, $2 in PostgreSQL; ? in MySQL drivers) and sends the values SEPARATELY. The database parses the SQL first, so the values can only ever be values: x' OR '1'='1 is simply an email that matches nobody. PostgreSQL shows this directly with PREPARE and EXECUTE: PREPARE find_customer(text) AS SELECT … WHERE email = $1; EXECUTE find_customer('…'); Every database driver works this way (pool.query('… WHERE email = $1', [email]) in Node's pg, Week 15). Parameters cannot replace table or column names, only values; names that come from users must be checked against a fixed list.",
        sqlLab: {
          setup: STORE,
          task:
            "Write a prepared statement find_customer(text) that returns full_name and email of the customer whose email equals $1. Then EXECUTE it with the attack string x' OR '1'='1 (written as a normal SQL string: 'x'' OR ''1''=''1'), and finally EXECUTE it with 'zainab@example.com'.",
          starter: "PREPARE find_customer(text) AS\n  SELECT full_name, email\n  FROM customers\n  WHERE email = ;\n",
          solution: "PREPARE find_customer(text) AS\n  SELECT full_name, email\n  FROM customers\n  WHERE email = $1;\n\nEXECUTE find_customer('x'' OR ''1''=''1');\n\nEXECUTE find_customer('zainab@example.com');\n",
          checks: [
            { label: "The last EXECUTE returns only Zainab", result: true },
            { label: "Uses a $1 placeholder", source: "email\\s*=\\s*\\$1" },
            { label: "The attack string is executed as a value", source: "EXECUTE\\s+find_customer\\s*\\(\\s*'x''\\s*OR" },
          ],
          hint: "The placeholder is $1. Inside a SQL string, a single quote is written twice: 'x'' OR ''1''=''1'.",
          successMessage: "Run it and look at the first EXECUTE: (0 rows). The attack is just a strange email address that nobody has.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 6.P · PRACTICAL: RUNNING THE STORE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l33-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.P"],
    title: "Week 6 Practical: Running the Store",
    subtitle: "Inventory, customers, order statuses and cancellations",
    estimatedMinutes: 60,
    intro:
      "The checkpoint: a day of real record-management tasks on the store. Each lab is checked on the resulting data, and the risky ones must be done inside a transaction.",
    atoms: [
      {
        id: "a-db-p6-inventory",
        title: "Inventory and customer records",
        explain:
          "Morning tasks. (1) Restock: Black soap (SHE-002) receives 40 units. (2) The Moringa tea (TEA-002) is back on sale: list it and set its price to 2400. (3) Tunde Bakare (customer 2) gives his phone number: 0812 345 6789. (4) Ngozi Peters (customer 5) moves to Port Harcourt. Use stock = stock + n for restocking, and make each change touch only its own row.",
        sqlLab: {
          setup: STORE,
          task:
            "Do the four morning tasks: restock SHE-002 by 40; list TEA-002 and set its price to 2400; set customer 2's phone to '0812 345 6789'; move customer 5 to Port Harcourt.",
          starter: "",
          solution: "UPDATE products SET stock = stock + 40 WHERE sku = 'SHE-002';\n\nUPDATE products SET is_listed = true, unit_price = 2400 WHERE sku = 'TEA-002';\n\nUPDATE customers SET phone = '0812 345 6789' WHERE id = 2;\n\nUPDATE customers SET city = 'Port Harcourt' WHERE id = 5;\n",
          checks: [
            { label: "Products are exactly as required, every other product unchanged", query: PRODUCTS_NOW, ordered: true },
            { label: "Customers are exactly as required, every other customer unchanged", query: "SELECT id, full_name, phone, city FROM customers ORDER BY id", ordered: true },
          ],
          hint: "Four UPDATEs, each with a WHERE on the sku or id. Two columns can change in one SET.",
          revealSolution: false,
          successMessage: "Four changes, each landing on exactly one row.",
        },
      },
      {
        id: "a-db-p6-cancel",
        title: "Cancel an order and return its stock",
        explain:
          "Afternoon: customer 3 (Zainab) cancels order 7, which is paid but not shipped. Cancelling means BOTH setting the order's status to 'cancelled' AND putting its items back into stock (quantity added back to each product). These two changes belong together: inside one transaction, so the store never shows a cancelled order whose stock was not returned. Do not delete the order: its record must stay.",
        sqlLab: {
          setup: STORE,
          task:
            "In ONE transaction: set order 7's status to 'cancelled', and add each of its items' quantity back to the matching product's stock (UPDATE products … FROM order_items WHERE …). Commit at the end. Do not delete anything.",
          starter: "BEGIN;\n\n\nCOMMIT;\n",
          solution: "BEGIN;\n\nUPDATE orders\nSET status = 'cancelled'\nWHERE id = 7;\n\nUPDATE products AS p\nSET stock = p.stock + oi.quantity\nFROM order_items AS oi\nWHERE oi.order_id = 7\n  AND oi.product_id = p.id;\n\nCOMMIT;\n",
          checks: [
            { label: "Order 7 is cancelled; the others are unchanged", query: ORDERS_NOW, ordered: true },
            { label: "Its items' quantities are back in stock", query: PRODUCTS_NOW, ordered: true },
            { label: "Nothing was deleted", assert: "SELECT (SELECT count(*) FROM orders) = 7 AND (SELECT count(*) FROM order_items) = 10" },
            { label: "Done in a committed transaction", noOpenTransaction: true },
            { label: "Wrapped in BEGIN … COMMIT", source: "\\bBEGIN\\b[\\s\\S]*\\bCOMMIT\\b" },
          ],
          hint: "UPDATE products AS p SET stock = p.stock + oi.quantity FROM order_items AS oi WHERE oi.order_id = 7 AND oi.product_id = p.id; — UPDATE … FROM joins another table into the update.",
          revealSolution: false,
          successMessage: "The order keeps its history, and its 2 scarves went back on the shelf in the same transaction.",
        },
      },
      {
        id: "a-db-p6-safe-delete",
        title: "A safe clean-up",
        explain:
          "End of day: the database contains test orders that were never paid. Delete every order whose status is 'pending' AND was placed before 2026-04-21, together with its items (the foreign key cascades). Do it safely: first count the orders that match, then delete them inside a transaction with RETURNING, and commit. Before committing, you would compare the RETURNING list with your count; here the checks do that for you.",
        sqlLab: {
          setup: STORE,
          task:
            "Count the pending orders placed before 2026-04-21 (SELECT count(*) …). Then BEGIN; DELETE those orders RETURNING id; COMMIT;. The items go with them because order_items cascades.",
          starter: "SELECT count(*)\nFROM orders\nWHERE \n",
          solution: "SELECT count(*)\nFROM orders\nWHERE status = 'pending'\n  AND ordered_on < '2026-04-21';\n\nBEGIN;\n\nDELETE FROM orders\nWHERE status = 'pending'\n  AND ordered_on < '2026-04-21'\nRETURNING id;\n\nCOMMIT;\n",
          checks: [
            { label: "Only the old pending orders were deleted", query: ORDERS_NOW, ordered: true },
            { label: "Their items went with them, and no others", query: "SELECT order_id, product_id FROM order_items ORDER BY 1, 2", ordered: true },
            { label: "The DELETE returned what it removed", result: true },
            { label: "You counted first", source: "count\\(\\*\\)[\\s\\S]*DELETE" },
            { label: "Committed", noOpenTransaction: true },
          ],
          hint: "Use the same WHERE in the count and in the DELETE: status = 'pending' AND ordered_on < '2026-04-21'.",
          revealSolution: false,
          successMessage: "The count said 2 and the DELETE returned 2 ids (orders 4 and 6): the numbers matched, so committing was safe.",
        },
      },
    ],
    task: {
      title: "Week 6 practical: a day of record management",
      intro: "Run the same tasks on the store database on your own server.",
      prompts: [
        "Load your Week 5 store.sql and some sample data, then run every task from the three labs on your own PostgreSQL, inside transactions where the lab required one.",
        "For the cancellation, try a version without a transaction and stop the script halfway (run only the first UPDATE). Describe the inconsistent state left behind.",
        "Write down, for each UPDATE and DELETE you ran, the SELECT you used to check its WHERE first, and the row count you expected.",
        "Try the vulnerable unsafe_find example on your own server, then show the same search done safely with PREPARE and EXECUTE.",
        "Checkpoint: complete a set of record-management tasks and demonstrate safe handling of updates and deletions.",
      ],
      closing: "Next: Week 7, retrieving exactly the information you need: filtering, sorting, pagination and CASE.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
