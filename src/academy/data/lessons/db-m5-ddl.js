/**
 * RELATIONAL DATABASES · WEEK 5 · DATA DEFINITION LANGUAGE (DDL)
 *
 * Curriculum 5.1 – 5.P. CREATE DATABASE, SCHEMA and TABLE; columns, types,
 * primary and foreign keys; ALTER TABLE to add, change and remove; DROP and
 * TRUNCATE; identity columns, sequences, UUIDs and MySQL's AUTO_INCREMENT;
 * naming conventions; dependencies between objects; and migrations. The
 * practical is the online store's schema as one script that rebuilds it from
 * nothing, in dependency order, and can be run again.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { HAS, STORE, decide, shown, term } from "./db-helpers.js";

export const SECTION_ID = "db-s5-ddl";
const MODULE = "db-m5-ddl";

const PRODUCTS = `CREATE TABLE products (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku        text NOT NULL UNIQUE,
  name       text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  stock      integer NOT NULL DEFAULT 0
);
INSERT INTO products (sku, name, unit_price, stock) VALUES
  ('BAG-001', 'Ankara tote bag', 8500, 24),
  ('SHE-001', 'Shea butter 250g', 3000, 60),
  ('SCA-001', 'Adire scarf', 6000, 12);`;

const MY_INSERT_ID = "INSERT INTO students (full_name, email) VALUES ('Chi Okeke', 'chi@example.com'); SELECT LAST_INSERT_ID();";
const MY_RETURNING = "INSERT INTO students (full_name, email) VALUES ('Chi Okeke', 'chi@example.com') RETURNING id;";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 5.1 – 5.3 · CREATING STRUCTURE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l24-create",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Creating Databases, Schemas and Tables",
    subtitle: "CREATE statements, column definitions, primary and foreign keys",
    estimatedMinutes: 40,
    intro:
      "SQL has two halves. DDL (Data Definition Language) builds and changes the structure: databases, schemas, tables, constraints. DML (next week) works with the rows inside. This week the online store gets built, properly.",
    atoms: [
      {
        id: "a-db-create-statements",
        title: "CREATE DATABASE, CREATE SCHEMA and CREATE TABLE",
        explain:
          "The three CREATE statements nest like the objects they make. CREATE DATABASE store; makes an isolated database on the server (in psql, \\c store to use it). CREATE SCHEMA sales; makes a namespace inside the current database. CREATE TABLE sales.products (…); makes a table inside a schema. IF NOT EXISTS makes CREATE SCHEMA and CREATE TABLE do nothing when the object already exists, instead of failing, which is useful in setup scripts (PostgreSQL has no IF NOT EXISTS for CREATE DATABASE). In MySQL, DATABASE and SCHEMA mean the same thing, so CREATE SCHEMA store creates a whole database.",
        example: shown("psql-server", "CREATE DATABASE academy;"),
        sqlLab: {
          task:
            "Create a schema called store, and inside it a table categories with id (auto-numbered primary key) and name (text, required, unique). Write both statements with IF NOT EXISTS so the script can run twice.",
          starter: "",
          solution: "CREATE SCHEMA IF NOT EXISTS store;\n\nCREATE TABLE IF NOT EXISTS store.categories (\n  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n",
          checks: [
            { label: "store.categories exists", assert: HAS.table("store.categories") },
            { label: "name is required and unique", assert: `SELECT (${HAS.notNull("store.categories", "name")}) AND (${HAS.unique("store.categories", ["name"])})` },
            { label: "The script can run a second time", rerun: true },
          ],
          hint: "CREATE SCHEMA IF NOT EXISTS store; then CREATE TABLE IF NOT EXISTS store.categories (…);",
          successMessage: "A table in its own schema, from a script that is safe to run again.",
        },
      },
      {
        id: "a-db-column-definitions",
        title: "Defining columns and data types",
        explain:
          "A column definition is: name, type, then optional constraints and a default, in any order after the type: unit_price numeric(10,2) NOT NULL CHECK (unit_price > 0). Choose the type from the domain (Week 2): integer for counts, numeric(p,s) for money, text for names, boolean for flags, date or timestamptz for time. Constraints that involve several columns are written after the columns as TABLE CONSTRAINTS: PRIMARY KEY (a, b), UNIQUE (a, b), CHECK (ends_on > starts_on), FOREIGN KEY (a) REFERENCES t (id).",
        sqlLab: {
          task:
            "Create promotions with: id (auto-numbered primary key), code (text, required, unique), percent_off (integer, required, between 1 and 90), starts_on and ends_on (dates, required), and a table constraint that ends_on is after starts_on.",
          starter: "CREATE TABLE promotions (\n  \n);\n",
          solution: "CREATE TABLE promotions (\n  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  code        text NOT NULL UNIQUE,\n  percent_off integer NOT NULL CHECK (percent_off BETWEEN 1 AND 90),\n  starts_on   date NOT NULL,\n  ends_on     date NOT NULL,\n  CHECK (ends_on > starts_on)\n);\n",
          checks: [
            { label: "A valid promotion is accepted", accepts: "INSERT INTO promotions (code, percent_off, starts_on, ends_on) VALUES ('EASTER10', 10, '2026-04-01', '2026-04-10')" },
            { label: "95% off is refused", rejects: "INSERT INTO promotions (code, percent_off, starts_on, ends_on) VALUES ('MADNESS', 95, '2026-04-01', '2026-04-10')", code: "23514" },
            { label: "Ending before it starts is refused", rejects: "INSERT INTO promotions (code, percent_off, starts_on, ends_on) VALUES ('BACKWARDS', 10, '2026-04-10', '2026-04-01')", code: "23514" },
            { label: "A duplicate code is refused", rejects: "INSERT INTO promotions (code, percent_off, starts_on, ends_on) VALUES ('X1', 5, '2026-05-01', '2026-05-02'), ('X1', 5, '2026-05-01', '2026-05-02')", code: "23505" },
          ],
          hint: "The two-date rule refers to two columns, so write it after the columns: CHECK (ends_on > starts_on).",
          successMessage: "Column constraints guard single values; the table constraint guards how two of them relate.",
        },
      },
      {
        id: "a-db-keys-ddl",
        title: "Primary keys and foreign keys in DDL",
        explain:
          "A primary key can be declared inline (id integer PRIMARY KEY) or as a table constraint (PRIMARY KEY (order_id, product_id)). A foreign key can be inline (customer_id integer REFERENCES customers (id)) or a table constraint (FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE RESTRICT). If you omit the column list after the referenced table, the primary key is used: REFERENCES customers. Give important constraints names with CONSTRAINT name … so errors and later ALTERs are readable; otherwise PostgreSQL invents names such as orders_customer_id_fkey.",
        sqlLab: {
          setup: "CREATE TABLE customers (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, full_name text NOT NULL);\n" + PRODUCTS,
          erd: true,
          task:
            "Create orders (id auto-numbered primary key, customer_id required, ordered_on date required default today) with a foreign key NAMED orders_customer_fk to customers. Then order_items (order_id, product_id, quantity integer required > 0, unit_price numeric(10,2) required) with primary key (order_id, product_id), order_id cascading on delete, product_id referencing products.",
          starter: "CREATE TABLE orders (\n  \n);\n\nCREATE TABLE order_items (\n  \n);\n",
          solution: "CREATE TABLE orders (\n  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id integer NOT NULL,\n  ordered_on  date NOT NULL DEFAULT current_date,\n  CONSTRAINT orders_customer_fk FOREIGN KEY (customer_id) REFERENCES customers (id)\n);\n\nCREATE TABLE order_items (\n  order_id   integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,\n  product_id integer NOT NULL REFERENCES products (id),\n  quantity   integer NOT NULL CHECK (quantity > 0),\n  unit_price numeric(10,2) NOT NULL,\n  PRIMARY KEY (order_id, product_id)\n);\n",
          checks: [
            { label: "orders has a foreign key named orders_customer_fk", assert: "SELECT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_customer_fk' AND contype = 'f' AND confrelid = to_regclass('customers'))" },
            { label: "order_items is keyed by (order_id, product_id)", assert: HAS.pk("order_items", ["order_id", "product_id"]) },
            { label: "Items cascade with their order", assert: HAS.onDelete("order_items", "orders", "c") },
            { label: "Items refer to real products", assert: HAS.fk("order_items", "products", "product_id") },
            { label: "A quantity of 0 is refused", rejects: "INSERT INTO customers (full_name) VALUES ('A'); INSERT INTO orders (customer_id) VALUES (1); INSERT INTO order_items VALUES (1, 1, 0, 8500)", code: "23514" },
          ],
          hint: "CONSTRAINT orders_customer_fk FOREIGN KEY (customer_id) REFERENCES customers (id) goes after the columns.",
          successMessage: "Try an order for customer 99 and read the error: it names orders_customer_fk, which you chose.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 5.4 – 5.5 · ALTER, DROP AND TRUNCATE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l25-alter-drop",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5"],
    title: "Changing and Removing Structure",
    subtitle: "ALTER TABLE, DROP TABLE and TRUNCATE TABLE",
    estimatedMinutes: 45,
    intro:
      "No schema survives contact with the business unchanged. ALTER TABLE changes a live table in place, keeping its rows; DROP and TRUNCATE remove things, and deserve respect.",
    atoms: [
      {
        id: "a-db-alter-add",
        title: "ALTER TABLE: adding columns and constraints",
        explain:
          "ALTER TABLE products ADD COLUMN weight_grams integer; adds a column to every existing row (as NULL, or its DEFAULT if you give one). Adding a NOT NULL column to a table with rows needs a DEFAULT, or PostgreSQL refuses because existing rows would break the rule. ADD CONSTRAINT adds a rule afterwards: ALTER TABLE products ADD CONSTRAINT products_price_positive CHECK (unit_price > 0); PostgreSQL checks the existing rows first and refuses if any break it, so you learn about dirty data before the constraint exists.",
        sqlLab: {
          setup: PRODUCTS,
          task:
            "The products table already has rows. Add a column is_listed (boolean, required, default true), then add a constraint named products_price_positive requiring unit_price > 0.",
          starter: "ALTER TABLE products\n",
          solution: "ALTER TABLE products\n  ADD COLUMN is_listed boolean NOT NULL DEFAULT true;\n\nALTER TABLE products\n  ADD CONSTRAINT products_price_positive CHECK (unit_price > 0);\n",
          checks: [
            { label: "Every existing product is listed", assert: "SELECT bool_and(is_listed) AND count(*) = 3 FROM products" },
            { label: "is_listed is required", assert: HAS.notNull("products", "is_listed") },
            { label: "products_price_positive exists and works", rejects: "UPDATE products SET unit_price = 0 WHERE sku = 'BAG-001'", error: "products_price_positive" },
          ],
          hint: "ADD COLUMN is_listed boolean NOT NULL DEFAULT true — the default fills the existing rows. Then ADD CONSTRAINT name CHECK (…).",
          successMessage: "Three existing rows got true automatically, and the new rule now guards every future change.",
        },
      },
      {
        id: "a-db-alter-modify",
        title: "ALTER TABLE: renaming and changing columns",
        explain:
          "Other changes: RENAME COLUMN old TO new; RENAME TO new_table_name; ALTER COLUMN name SET NOT NULL / DROP NOT NULL; ALTER COLUMN name SET DEFAULT value / DROP DEFAULT; and ALTER COLUMN name TYPE new_type, which converts every value (add USING expression when PostgreSQL cannot convert by itself, such as text to integer). Each can be several clauses in one ALTER TABLE, separated by commas. MySQL uses MODIFY COLUMN and CHANGE COLUMN for some of these, so its syntax differs.",
        sqlLab: {
          setup: "CREATE TABLE customers (id integer PRIMARY KEY, name text, phone text, points text);\nINSERT INTO customers VALUES (1, 'Amaka Nnaji', '0803 100 2000', '120'), (2, 'Tunde Bakare', NULL, '45');",
          task:
            "Tidy the customers table with ALTER TABLE: rename name to full_name; make full_name required; change points from text to integer; and give points a default of 0.",
          starter: "ALTER TABLE customers\n",
          solution: "ALTER TABLE customers RENAME COLUMN name TO full_name;\n\nALTER TABLE customers\n  ALTER COLUMN full_name SET NOT NULL,\n  ALTER COLUMN points TYPE integer USING points::integer,\n  ALTER COLUMN points SET DEFAULT 0;\n",
          checks: [
            { label: "full_name exists and is required", assert: `SELECT (${HAS.notNull("customers", "full_name")}) AND NOT (${HAS.column("customers", "name")})` },
            { label: "points is an integer, with its values kept", query: "SELECT id, points, pg_typeof(points)::text FROM customers ORDER BY id", ordered: true },
            { label: "points defaults to 0", assert: "WITH x AS (INSERT INTO customers (id, full_name) VALUES (3, 'Zainab Ali') RETURNING points) SELECT points = 0 FROM x" },
          ],
          hint: "RENAME COLUMN must be its own ALTER TABLE. Converting text to integer needs USING points::integer.",
          successMessage: "The rows survived every change: 120 and 45 are now real integers you can add up.",
        },
      },
      {
        id: "a-db-alter-remove",
        title: "ALTER TABLE: removing columns and constraints",
        explain:
          "ALTER TABLE products DROP COLUMN weight_grams; removes a column and its data for every row; there is no undo outside a transaction or a backup. ALTER TABLE products DROP CONSTRAINT products_price_positive; removes a rule (one more reason to name constraints). If something depends on the column (a view, a foreign key), PostgreSQL refuses, and DROP COLUMN … CASCADE would drop the dependents too, so read what it lists before using it. IF EXISTS avoids an error when the column is already gone.",
        sqlLab: {
          setup: PRODUCTS + "\nALTER TABLE products ADD COLUMN legacy_code text, ADD CONSTRAINT products_stock_limit CHECK (stock < 100);",
          task:
            "The store no longer uses legacy_code, and the products_stock_limit rule was a mistake (a supplier delivered 150 bags). Remove both, then set the tote bag's (BAG-001) stock to 150.",
          starter: "",
          solution: "ALTER TABLE products DROP COLUMN legacy_code;\n\nALTER TABLE products DROP CONSTRAINT products_stock_limit;\n\nUPDATE products SET stock = 150 WHERE sku = 'BAG-001';\n",
          checks: [
            { label: "legacy_code is gone", assert: `SELECT NOT (${HAS.column("products", "legacy_code")})` },
            { label: "The stock limit is gone", assert: "SELECT NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_stock_limit')" },
            { label: "BAG-001 has 150 in stock, the others unchanged", query: "SELECT sku, stock FROM products ORDER BY sku", ordered: true },
          ],
          hint: "ALTER TABLE products DROP COLUMN …; ALTER TABLE products DROP CONSTRAINT …; then UPDATE … WHERE sku = 'BAG-001'.",
          successMessage: "Structure changed, data intact, and the UPDATE that failed before now succeeds.",
        },
      },
      {
        id: "a-db-drop-truncate",
        title: "DROP TABLE and TRUNCATE TABLE",
        explain:
          "DROP TABLE removes a table entirely: its structure, rows, indexes and constraints. TRUNCATE TABLE keeps the table but removes ALL its rows, very fast, without scanning them; add RESTART IDENTITY to reset its identity counter, and CASCADE to truncate tables that reference it. DELETE FROM t (next week) also removes rows, but row by row, firing triggers and respecting WHERE. All three are permanent once committed. Both DROP and TRUNCATE refuse when other tables' foreign keys depend on the target, unless you add CASCADE, which spreads the destruction. Use IF EXISTS in scripts. In PostgreSQL, DROP and TRUNCATE can be rolled back inside a transaction (Week 11); in MySQL they cannot.",
        sqlDemo: {
          setup: PRODUCTS,
          caption: "TRUNCATE empties the table and, with RESTART IDENTITY, the next product is id 1 again. The table itself remains.",
          code: "TRUNCATE TABLE products RESTART IDENTITY;\n\nINSERT INTO products (sku, name, unit_price) VALUES ('TEA-001', 'Zobo tea 100g', 1800);\n\nSELECT id, sku, name FROM products;",
        },
        sqlLab: {
          setup: STORE,
          task:
            "Reset the store's test data: remove every row from orders and order_items (which references orders) with ONE TRUNCATE, restarting the orders' id numbering. Customers and products must keep their rows.",
          starter: "TRUNCATE TABLE orders;\n",
          solution: "TRUNCATE TABLE order_items, orders RESTART IDENTITY;\n",
          checks: [
            { label: "orders and order_items are empty", assert: "SELECT NOT EXISTS (SELECT 1 FROM orders) AND NOT EXISTS (SELECT 1 FROM order_items)" },
            { label: "Customers and products are untouched", assert: "SELECT (SELECT count(*) FROM customers) = 6 AND (SELECT count(*) FROM products) = 8" },
            { label: "The next order is number 1 again", assert: "WITH x AS (INSERT INTO orders (customer_id) VALUES (1) RETURNING id) SELECT id = 1 FROM x" },
          ],
          mustFail: ["TRUNCATE TABLE customers, orders, order_items RESTART IDENTITY CASCADE;", "TRUNCATE TABLE order_items, orders;"],
          hint: "TRUNCATE accepts several tables: TRUNCATE TABLE order_items, orders RESTART IDENTITY; — listing both satisfies the foreign key without CASCADE.",
          successMessage: "Exactly the two tables you meant. CASCADE on orders would also have worked here; on customers it would have emptied far more.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 5.6 – 5.7 · IDENTITY COLUMNS AND NAMING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l26-identity-naming",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.6", "5.7"],
    title: "Identity Columns and Naming Conventions",
    subtitle: "Generated ids, sequences, UUIDs, AUTO_INCREMENT, and good names",
    estimatedMinutes: 40,
    intro:
      "Two small decisions that touch every table: how rows get their ids, and what everything is called.",
    atoms: [
      {
        id: "a-db-identity",
        title: "Identity columns and sequences",
        explain:
          "id integer GENERATED ALWAYS AS IDENTITY numbers rows from a SEQUENCE, a counter object PostgreSQL keeps for the column. ALWAYS refuses an id typed by hand (you can force one with OVERRIDING SYSTEM VALUE, for data migrations); GENERATED BY DEFAULT uses the sequence only when no id is given. Sequence numbers are never reused and can have GAPS: a failed or rolled-back insert still consumes a number, so never treat ids as a count. Older PostgreSQL code uses serial, which does almost the same thing; identity is the SQL-standard form. Use bigint for tables that may pass two billion rows.",
        sqlDemo: {
          caption: "The second INSERT fails a CHECK, but its id is used up anyway: the next row gets 3, not 2. Gaps are normal.",
          code: "CREATE TABLE tickets (\n  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL CHECK (title <> '')\n);\nINSERT INTO tickets (title) VALUES ('Login fails');\nINSERT INTO tickets (title) VALUES ('');\nINSERT INTO tickets (title) VALUES ('Receipt missing');\nSELECT * FROM tickets;",
          continueOnError: true,
          expectError: "violates check constraint",
        },
        sqlLab: {
          task:
            "Create tickets with id integer GENERATED ALWAYS AS IDENTITY primary key and title text required. Then insert 'Login fails' normally, and import an old ticket with id 500 titled 'Legacy issue' by overriding the identity.",
          starter: "",
          solution: "CREATE TABLE tickets (\n  id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL\n);\n\nINSERT INTO tickets (title) VALUES ('Login fails');\n\nINSERT INTO tickets (id, title) OVERRIDING SYSTEM VALUE\nVALUES (500, 'Legacy issue');\n",
          checks: [
            { label: "Both tickets exist with ids 1 and 500", query: "SELECT id, title FROM tickets ORDER BY id", ordered: true },
            { label: "ids are GENERATED ALWAYS", assert: "SELECT attidentity = 'a' FROM pg_attribute WHERE attrelid = to_regclass('tickets') AND attname = 'id'" },
            { label: "A hand-typed id without OVERRIDING is still refused", rejects: "INSERT INTO tickets (id, title) VALUES (7, 'Sneaky')", code: "428C9" },
          ],
          hint: "INSERT INTO tickets (id, title) OVERRIDING SYSTEM VALUE VALUES (500, 'Legacy issue');",
          successMessage: "ALWAYS protects the counter from accidents, and OVERRIDING SYSTEM VALUE is the deliberate escape hatch for migrations.",
        },
      },
      {
        id: "a-db-auto-increment-uuid",
        title: "MySQL's AUTO_INCREMENT, and UUIDs",
        explain:
          "MySQL numbers rows with id INT AUTO_INCREMENT PRIMARY KEY. It has no INSERT … RETURNING; instead, SELECT LAST_INSERT_ID(); in the SAME session gives the id just generated (drivers expose it as insertId). In another session it means nothing: it is per connection. A different approach in both databases is a UUID: a 128-bit random identifier such as 3f1c…, generated with gen_random_uuid() in PostgreSQL (type uuid) or UUID() in MySQL. UUIDs can be made anywhere (even on a phone, offline) without colliding, and do not reveal how many rows exist; they are larger and less readable than integers.",
        example: shown("mysql-dialect", MY_INSERT_ID),
        terminalExercise: term("mysql-dialect", {
          only: [MY_RETURNING, MY_INSERT_ID],
          goal: "In MySQL, insert a student and find out which id AUTO_INCREMENT gave them.",
          accept: [MY_INSERT_ID],
          near: [{ command: MY_RETURNING, why: "RETURNING is PostgreSQL's. MySQL rejects it with a syntax error; it has a function that reports the last id in your session." }],
          hint: "MySQL's function for the most recent AUTO_INCREMENT value in your session is LAST_INSERT_ID().",
          success: "3: the id MySQL generated in that same session.",
        }),
      },
      {
        id: "a-db-naming",
        title: "Naming conventions for tables, columns and constraints",
        explain:
          "Consistent names make a schema readable without documentation. Common PostgreSQL conventions: lowercase snake_case for everything (never quoted MixedCase, which then needs quotes forever); table names plural nouns (customers, order_items); a primary key called id; foreign keys called <singular>_id (customer_id); booleans as is_ or has_ (is_listed); dates as _on, moments as _at (ordered_on, paid_at); constraints named <table>_<columns>_<kind>: products_sku_key, orders_customer_id_fkey, products_price_check (PostgreSQL's own default names follow this pattern). Avoid reserved words as names (user, order, group): they need quoting.",
        sqlLab: {
          task:
            "Create a table following the conventions: suppliers, with id (auto-numbered primary key), company_name (required), contact_email (required, with a unique constraint named suppliers_contact_email_key), is_active (boolean, required, default true) and joined_on (date, required, default today).",
          starter: "",
          solution: "CREATE TABLE suppliers (\n  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  company_name  text NOT NULL,\n  contact_email text NOT NULL,\n  is_active     boolean NOT NULL DEFAULT true,\n  joined_on     date NOT NULL DEFAULT current_date,\n  CONSTRAINT suppliers_contact_email_key UNIQUE (contact_email)\n);\n",
          checks: [
            { label: "The columns are id, company_name, contact_email, is_active, joined_on", query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'suppliers' ORDER BY ordinal_position", ordered: true },
            { label: "The unique constraint is named suppliers_contact_email_key", assert: "SELECT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'suppliers_contact_email_key' AND contype = 'u')" },
            { label: "Defaults fill is_active and joined_on", assert: "WITH x AS (INSERT INTO suppliers (company_name, contact_email) VALUES ('Kano Leather Co', 'sales@kanoleather.ng') RETURNING is_active, joined_on) SELECT is_active AND joined_on = current_date FROM x" },
          ],
          hint: "CONSTRAINT suppliers_contact_email_key UNIQUE (contact_email) as a table constraint.",
          successMessage: "Anyone reading suppliers.is_active or an error naming suppliers_contact_email_key knows exactly what it is.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 5.8 – 5.9 · DEPENDENCIES AND MIGRATIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l27-dependencies-migrations",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.8", "5.9"],
    title: "Object Dependencies and Migrations",
    subtitle: "What depends on what, and changing a schema safely over time",
    estimatedMinutes: 45,
    intro:
      "A real database is a web of objects that depend on each other, and it changes every month while holding data that must not be lost. This lesson is about changing it without breaking it.",
    atoms: [
      {
        id: "a-db-dependencies",
        title: "Dependencies between database objects",
        explain:
          "PostgreSQL tracks which objects depend on which: a foreign key depends on the table it references; a view depends on its tables' columns; an index or constraint depends on its table; a sequence on its identity column. It refuses to drop or change an object that others depend on, and its error lists them (DETAIL: constraint … on table … depends on table …). That is why scripts CREATE parents before children and DROP children before parents. DROP … CASCADE drops every dependent too; it is sometimes what you want, but always read what it will remove first.",
        sqlDemo: {
          setup: STORE,
          caption: "products cannot be dropped while order_items refers to it. The error says exactly what depends on it.",
          code: "DROP TABLE products;",
          expectError: "cannot drop table products because other objects depend on it",
        },
        sqlLab: {
          setup: STORE,
          task:
            "The store is being rebuilt. Drop all four tables (customers, products, orders, order_items) WITHOUT using CASCADE: drop them in an order that respects their dependencies.",
          starter: "DROP TABLE customers;\n",
          solution: "DROP TABLE order_items;\nDROP TABLE orders;\nDROP TABLE products;\nDROP TABLE customers;\n",
          checks: [
            { label: "All four tables are gone", assert: `SELECT NOT (${HAS.table("customers")}) AND NOT (${HAS.table("products")}) AND NOT (${HAS.table("orders")}) AND NOT (${HAS.table("order_items")})` },
            { label: "No CASCADE was used", forbid: "\\bCASCADE\\b" },
          ],
          hint: "order_items depends on orders and products; orders depends on customers. Drop the most dependent first.",
          successMessage: "Children first, parents last: the reverse of the order you create them in.",
        },
      },
      {
        id: "a-db-migrations",
        title: "Schema changes and migration fundamentals",
        explain:
          "In a real project the schema is never edited by hand on the server. Each change is a MIGRATION: a numbered SQL file kept in version control (001_create_customers.sql, 002_add_is_listed.sql …), applied in order to every environment (your laptop, testing, production), and recorded in a table such as schema_migrations so each runs exactly once. Good migrations are small, written to work on a database that already holds data (add a column with a default, back-fill, then add NOT NULL), and, where possible, have a matching DOWN migration that undoes them. Tools (Flyway, Liquibase, node-pg-migrate, Prisma Migrate, Django and Laravel migrations) automate the bookkeeping. In PostgreSQL, DDL is TRANSACTIONAL: a migration wrapped in BEGIN … COMMIT either applies completely or not at all. MySQL commits after each DDL statement, so a half-applied migration is possible there.",
        sqlLab: {
          setup: PRODUCTS + "\nCREATE TABLE schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());\nINSERT INTO schema_migrations (version) VALUES ('001_create_products');",
          task:
            "Write migration 002_add_weight as one transaction: BEGIN; add a column weight_grams integer to products; set it to 250 for every existing product; make it NOT NULL; record '002_add_weight' in schema_migrations; COMMIT;",
          starter: "BEGIN;\n\n-- 002_add_weight\n\nCOMMIT;\n",
          solution: "BEGIN;\n\nALTER TABLE products ADD COLUMN weight_grams integer;\n\nUPDATE products SET weight_grams = 250;\n\nALTER TABLE products ALTER COLUMN weight_grams SET NOT NULL;\n\nINSERT INTO schema_migrations (version) VALUES ('002_add_weight');\n\nCOMMIT;\n",
          checks: [
            { label: "weight_grams exists, is required, and every product has 250", assert: `SELECT (${HAS.notNull("products", "weight_grams")}) AND (SELECT bool_and(weight_grams = 250) FROM products)` },
            { label: "The migration is recorded", query: "SELECT version FROM schema_migrations ORDER BY version", ordered: true },
            { label: "The transaction was committed", noOpenTransaction: true },
            { label: "It is wrapped in BEGIN … COMMIT", source: "\\bBEGIN\\b[\\s\\S]*\\bCOMMIT\\b" },
          ],
          hint: "Add the column without NOT NULL, fill it, then SET NOT NULL. All between BEGIN; and COMMIT;.",
          successMessage: "Add, back-fill, then constrain: the standard way to add a required column to a table that already has data, applied all-or-nothing.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 5.P · PRACTICAL: THE ONLINE STORE SCHEMA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l28-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.P"],
    title: "Week 5 Practical: The Online Store Schema",
    subtitle: "One script that builds the whole schema from nothing",
    estimatedMinutes: 60,
    intro:
      "The checkpoint: a single SQL script that builds the online store from an empty database, in the correct dependency order, with every rule enforced, and that can be run again to rebuild it.",
    atoms: [
      {
        id: "a-db-p5-script",
        title: "Write the build script",
        explain:
          "The store's rules. CUSTOMERS: auto id; full name and email required; email unique; phone optional; city required; created_on defaults to today. PRODUCTS: auto id; SKU required and unique; name and category required; unit price required and above zero; stock required, never negative, default 0; is_listed required, default true. ORDERS: auto id; a customer (required; a customer with orders cannot be deleted); ordered_on defaults to today; status required, default 'pending', one of pending, paid, shipped, delivered, cancelled. ORDER_ITEMS: the order and the product (key: the pair); quantity required and above zero; unit_price (the price charged) required and above zero; deleting an order deletes its items. The script must start by dropping the four tables if they exist (children first), so it can rebuild the schema any time.",
        sqlLab: {
          erd: true,
          task:
            "Write store.sql: DROP TABLE IF EXISTS for the four tables (children first), then CREATE TABLE customers, products, orders and order_items (parents first) enforcing every rule in the brief. Use exactly these table and column names: customers(id, full_name, email, phone, city, created_on), products(id, sku, name, category, unit_price, stock, is_listed), orders(id, customer_id, ordered_on, status), order_items(order_id, product_id, quantity, unit_price).",
          starter: "-- store.sql: rebuilds the online store schema from nothing\n\n-- 1. Drop (children first)\n\n-- 2. Create (parents first)\n",
          solution: "-- store.sql: rebuilds the online store schema from nothing\n\nDROP TABLE IF EXISTS order_items;\nDROP TABLE IF EXISTS orders;\nDROP TABLE IF EXISTS products;\nDROP TABLE IF EXISTS customers;\n\nCREATE TABLE customers (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name  text NOT NULL,\n  email      text NOT NULL UNIQUE,\n  phone      text,\n  city       text NOT NULL,\n  created_on date NOT NULL DEFAULT current_date\n);\n\nCREATE TABLE products (\n  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  sku        text NOT NULL UNIQUE,\n  name       text NOT NULL,\n  category   text NOT NULL,\n  unit_price numeric(10,2) NOT NULL CHECK (unit_price > 0),\n  stock      integer NOT NULL DEFAULT 0 CHECK (stock >= 0),\n  is_listed  boolean NOT NULL DEFAULT true\n);\n\nCREATE TABLE orders (\n  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id integer NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,\n  ordered_on  date NOT NULL DEFAULT current_date,\n  status      text NOT NULL DEFAULT 'pending'\n              CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled'))\n);\n\nCREATE TABLE order_items (\n  order_id   integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,\n  product_id integer NOT NULL REFERENCES products (id),\n  quantity   integer NOT NULL CHECK (quantity > 0),\n  unit_price numeric(10,2) NOT NULL CHECK (unit_price > 0),\n  PRIMARY KEY (order_id, product_id)\n);\n",
          checks: [
            { label: "Sample data loads", accepts: "INSERT INTO customers (full_name, email, city) VALUES ('Amaka Nnaji', 'amaka@example.com', 'Lagos'), ('Tunde Bakare', 'tunde@example.com', 'Ibadan');\nINSERT INTO products (sku, name, category, unit_price, stock) VALUES ('BAG-001', 'Ankara tote bag', 'bags', 8500, 24), ('SHE-001', 'Shea butter 250g', 'beauty', 3000, 60);\nINSERT INTO orders (customer_id) VALUES (1), (2);\nINSERT INTO order_items VALUES (1, 1, 2, 8500), (1, 2, 1, 3000), (2, 2, 3, 3000);" },
            { label: "Defaults: created_on, stock, is_listed, ordered_on, status", assert: "WITH x AS (INSERT INTO products (sku, name, category, unit_price) VALUES ('TEA-001', 'Zobo tea 100g', 'food', 1800) RETURNING stock, is_listed) SELECT (SELECT stock = 0 AND is_listed FROM x) AND (SELECT bool_and(created_on = current_date) FROM customers) AND (SELECT bool_and(status = 'pending' AND ordered_on = current_date) FROM orders)" },
            { label: "Duplicate emails are refused", rejects: "INSERT INTO customers (full_name, email, city) VALUES ('Copy', 'amaka@example.com', 'Abuja')", code: "23505" },
            { label: "Duplicate SKUs are refused", rejects: "INSERT INTO products (sku, name, category, unit_price) VALUES ('BAG-001', 'Another tote', 'bags', 9000)", code: "23505" },
            { label: "Prices must be above zero", rejects: "INSERT INTO products (sku, name, category, unit_price) VALUES ('FREE-1', 'Free thing', 'misc', 0)", code: "23514" },
            { label: "Stock can never go negative", rejects: "UPDATE products SET stock = stock - 100 WHERE sku = 'BAG-001'", code: "23514" },
            { label: "Only the five statuses are allowed", rejects: "UPDATE orders SET status = 'lost' WHERE id = 1", code: "23514" },
            { label: "Quantities must be above zero", rejects: "INSERT INTO order_items VALUES (2, 1, 0, 8500)", code: "23514" },
            { label: "A customer with orders cannot be deleted", rejects: "DELETE FROM customers WHERE id = 1", error: "foreign key constraint" },
            { label: "Deleting an order deletes its items", assert: "WITH d AS (DELETE FROM orders WHERE id = 2 RETURNING id) SELECT count(*) = 1 FROM d" },
            { label: "The script rebuilds the schema when run again", rerun: true },
            { label: "After a rebuild, the tables are empty and fresh", assert: "SELECT NOT EXISTS (SELECT 1 FROM customers) AND NOT EXISTS (SELECT 1 FROM order_items)" },
          ],
          hint: "Every rule in the brief maps to NOT NULL, UNIQUE, CHECK, DEFAULT or a foreign key action. Drops use IF EXISTS so the first run works on an empty database.",
          revealSolution: false,
          successMessage: "One script, empty database to working store, and it can rebuild itself. That is the checkpoint.",
        },
      },
      {
        id: "a-db-p5-order",
        title: "Why the order of the script matters",
        explain:
          "Read your script from top to bottom as PostgreSQL does. Each CREATE TABLE with REFERENCES needs its target to exist already, so creation runs parents → children (customers and products, then orders, then order_items). Each DROP must not leave a dependent behind, so dropping runs children → parents. A script that only works because tables happened to exist on your laptop is a script that fails on the new server at 2 a.m.",
        decision: decide({
          scenario: "A colleague's store.sql creates order_items first, then orders, customers and products. It works on their laptop every time.",
          question: "What is most likely going on?",
          right: ["Their laptop already has the tables from earlier runs, so the REFERENCES succeed there; on an empty server the first CREATE fails", "A build script must be tested against an empty database."],
          wrong: [
            ["PostgreSQL reorders CREATE statements automatically", "It runs statements exactly in the order given."],
            ["Foreign keys are checked only when data is inserted", "REFERENCES requires the table at creation time."],
            ["The order does not matter for CREATE TABLE", "It does whenever a table references another."],
          ],
          at: 3,
          aftermath: "This is why the checks ran your script on a brand-new database, and then ran it again.",
        }),
      },
    ],
    task: {
      title: "Week 5 practical: store.sql",
      intro: "Save your script as store.sql in a folder you will keep for the rest of the course.",
      prompts: [
        "Create a database called store on your own PostgreSQL and run the script with psql: psql -U postgres -d store -f store.sql. Run it twice and confirm the second run also succeeds.",
        "Use \\dt and \\d orders to inspect the result, and draw (or generate in pgAdmin) the ERD.",
        "Write migration 002 as a separate file that adds products.weight_grams (filled for existing rows, then required) inside BEGIN … COMMIT.",
        "Port store.sql to MySQL (AUTO_INCREMENT, VARCHAR, DEFAULT (CURRENT_DATE)) and list each change you had to make.",
        "Checkpoint: deliver a SQL script that builds the database schema from scratch in the correct dependency order.",
      ],
      closing: "Next: Week 6, putting data into this schema and changing it safely with INSERT, UPDATE and DELETE.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
