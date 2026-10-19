/**
 * PYTHON PROGRAMMING · MODULE 18 · DATABASES AND SQL WITH PYTHON
 *
 * Curriculum 18.1 – 18.10. Why databases, tables and keys, SQL CRUD,
 * filtering, sorting, grouping and joins, relationships and normalisation,
 * sqlite3, parameterised queries, transactions and error handling. Every
 * example uses SQLite, which ships with Python; in the page, Pyodide loads
 * the sqlite3 module automatically when the code imports it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s18-databases";

const PY = "python";

// A small school database, built fresh by checks that need one.
const SCHOOL_DB = [
  "import sqlite3",
  "def school_db():",
  "    conn = sqlite3.connect(\":memory:\")",
  "    conn.executescript('''",
  "        CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, class TEXT NOT NULL);",
  "        CREATE TABLE scores (student_id INTEGER REFERENCES students(id), subject TEXT, score INTEGER);",
  "        INSERT INTO students (id, name, class) VALUES (1, 'Ada', 'SS1'), (2, 'Bayo', 'SS1'), (3, 'Chi', 'SS2'), (4, 'Dan', 'SS2');",
  "        INSERT INTO scores VALUES (1, 'Maths', 80), (1, 'English', 70), (2, 'Maths', 45), (2, 'English', 55), (3, 'Maths', 92), (3, 'English', 88), (4, 'Maths', 60);",
  "    ''')",
  "    return conn",
  "",
].join("\n");

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 18.1 – 18.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l74-db-basics",
    moduleId: "pp-m18-databases",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2", "18.3"],
    title: "Why Databases, Tables and Keys",
    subtitle: "Structured storage, records and fields, primary and foreign keys",
    estimatedMinutes: 22,
    intro:
      "JSON files work for one user and a few hundred records. Real systems need many users at once, millions of records, fast searches and guarantees that data stays consistent. That is what a database is for, and SQL is the language nearly all of them speak.",

    atoms: [
      {
        id: "a-pp-why-databases",
        title: "Why databases are needed",
        explain:
          "A database management system stores data so it can be searched quickly (indexes), changed safely by many users at the same time, kept consistent by rules (no score for a student who does not exist), and recovered after a crash. A RELATIONAL database stores data in tables and is queried with SQL. SQLite is a small relational database stored in a single file, built into Python and into every Android and iPhone.",
        decision: {
          scenario: "Your school app stores everything in one students.json file. It now has 20,000 students and 30 teachers entering scores at the same time.",
          question: "What is the biggest problem with staying on one JSON file?",
          options: [
            {
              id: "a",
              text: "Two teachers saving at the same moment can overwrite each other's changes, and every search must load and scan the whole file",
              why: "Files have no concurrency control or indexes. Databases handle simultaneous writes safely and search with indexes.",
            },
            {
              id: "b",
              text: "JSON cannot store numbers",
              whyWrong: "It can; the problems are concurrency, consistency and speed at scale.",
            },
            {
              id: "c",
              text: "Python cannot read big files",
              whyWrong: "It can, but reading the whole file for every search is slow and wasteful.",
            },
            {
              id: "d",
              text: "There is no problem",
              whyWrong: "Lost updates from simultaneous saves would quietly destroy teachers' work.",
            },
          ],
          correct: "a",
          aftermath: "Many users, lots of data, rules to enforce: that is when a database earns its place.",
        },
      },
      {
        id: "a-pp-tables-records",
        title: "Tables, records, fields and data types",
        explain:
          "A TABLE holds one kind of thing: students, products, orders. Each ROW (record) is one item; each COLUMN (field) is one property, with a declared type. SQLite's types are INTEGER, REAL (decimals), TEXT and BLOB, and NOT NULL forbids missing values. CREATE TABLE defines a table; INSERT adds rows; SELECT reads them.",
        code: {
          language: PY,
          code: 'import sqlite3\nconn = sqlite3.connect(":memory:")   # a database in memory, gone when closed\nconn.execute("CREATE TABLE products (name TEXT NOT NULL, price REAL, stock INTEGER)")\nconn.execute("INSERT INTO products VALUES (\'Rice 5kg\', 9500.0, 12)")\nconn.execute("INSERT INTO products VALUES (\'Oil 1L\', 2800.0, 30)")\nfor row in conn.execute("SELECT name, price FROM products"):\n    print(row)\nconn.close()\n',
          expectedOutput: "('Rice 5kg', 9500.0)\n('Oil 1L', 2800.0)",
        },
      },
      {
        id: "a-pp-keys",
        title: "Primary keys and foreign keys",
        explain:
          "A PRIMARY KEY uniquely identifies each row: id INTEGER PRIMARY KEY gives every row its own number automatically. A FOREIGN KEY is a column that refers to another table's primary key, linking the tables: an enrolment's student_id refers to students(id). With PRAGMA foreign_keys = ON, SQLite refuses a foreign key that points at nothing, which keeps the data consistent.",
        codeChallenge: {
          task: "Write create_tables(conn) that creates two tables: courses with id INTEGER PRIMARY KEY and title TEXT NOT NULL; and enrolments with id INTEGER PRIMARY KEY, student_name TEXT NOT NULL, and course_id INTEGER that REFERENCES courses(id). Also turn on foreign key enforcement with conn.execute(\"PRAGMA foreign_keys = ON\").",
          starter: "import sqlite3\n\ndef create_tables(conn):\n    pass\n",
          sample: "Inserting an enrolment for course_id 99 (which does not exist) should then fail.",
          tests: [
            {
              check:
                'import sqlite3\n' +
                'conn = sqlite3.connect(":memory:")\n' +
                'create_tables(conn)\n' +
                'cols = {r[1]: (r[2].upper(), r[3], r[5]) for r in conn.execute("PRAGMA table_info(courses)")}\n' +
                'assert cols.get("id") == ("INTEGER", 0, 1) and cols.get("title", ("",))[0] == "TEXT" and cols["title"][1] == 1, "courses needs id INTEGER PRIMARY KEY and title TEXT NOT NULL. Got " + repr(cols)\n' +
                'fks = list(conn.execute("PRAGMA foreign_key_list(enrolments)"))\n' +
                'assert fks and fks[0][2] == "courses" and fks[0][3] == "course_id", "enrolments.course_id must REFERENCE courses(id)."\n' +
                'conn.execute("INSERT INTO courses (title) VALUES (\'Python\')")\n' +
                'conn.execute("INSERT INTO enrolments (student_name, course_id) VALUES (\'Ada\', 1)")\n' +
                'try:\n' +
                '    conn.execute("INSERT INTO enrolments (student_name, course_id) VALUES (\'Bo\', 99)")\n' +
                '    assert False, "An enrolment for a course that does not exist should be refused: turn on PRAGMA foreign_keys = ON."\n' +
                'except sqlite3.IntegrityError:\n' +
                '    pass',
            },
          ],
          solution: 'import sqlite3\n\ndef create_tables(conn):\n    conn.execute("PRAGMA foreign_keys = ON")\n    conn.execute("CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL)")\n    conn.execute(\n        "CREATE TABLE enrolments ("\n        "id INTEGER PRIMARY KEY, "\n        "student_name TEXT NOT NULL, "\n        "course_id INTEGER REFERENCES courses(id))"\n    )\n',
          hint: "course_id INTEGER REFERENCES courses(id) inside the CREATE TABLE enrolments statement. Run the PRAGMA on the same connection.",
          successMessage: "The database itself now refuses inconsistent data. Rules enforced by the database cannot be forgotten by any program that uses it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 18.4 – 18.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l75-sql-queries",
    moduleId: "pp-m18-databases",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.4", "18.5"],
    title: "SQL: CRUD, Filtering, Grouping and Joins",
    subtitle: "SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, GROUP BY and JOIN",
    estimatedMinutes: 28,
    intro:
      "Four statements cover creating, reading, updating and deleting data (CRUD). A handful of clauses then let you ask precise questions: which students, in what order, averaged how, joined to which scores. SQL describes WHAT you want; the database works out how.",

    atoms: [
      {
        id: "a-pp-sql-crud",
        title: "SQL basics: SELECT, INSERT, UPDATE and DELETE",
        explain:
          "INSERT INTO t (cols) VALUES (...) adds a row. SELECT cols FROM t reads rows (* for every column). UPDATE t SET col = value WHERE condition changes rows. DELETE FROM t WHERE condition removes rows. Without a WHERE, UPDATE and DELETE affect EVERY row, so always write the WHERE first. After changes, call conn.commit() to save them. In this module the ? marks are placeholders for values, explained properly in Lesson 76.",
        code: {
          language: PY,
          code: 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, qty INTEGER)")\nconn.execute("INSERT INTO items (name, qty) VALUES (?, ?)", ("pens", 50))\nconn.execute("INSERT INTO items (name, qty) VALUES (?, ?)", ("books", 20))\nconn.execute("UPDATE items SET qty = qty - 5 WHERE name = ?", ("pens",))\nconn.execute("DELETE FROM items WHERE qty < ?", (25,))\nconn.commit()\nprint(conn.execute("SELECT * FROM items").fetchall())\n',
          expectedOutput: "[(1, 'pens', 45)]",
        },
        codeChallenge: {
          task: "Inventory database. Given a connection with a products table (id INTEGER PRIMARY KEY, name TEXT UNIQUE, price REAL, stock INTEGER), write add_product(conn, name, price, stock) returning the new row's id (cursor.lastrowid), restock(conn, name, amount) adding to the stock, remove_product(conn, name) deleting it, and list_products(conn) returning a list of (name, price, stock) tuples ordered by name. Use ? placeholders and commit after each change.",
          starter: "import sqlite3\n\ndef add_product(conn, name, price, stock):\n    pass\n\ndef restock(conn, name, amount):\n    pass\n\ndef remove_product(conn, name):\n    pass\n\ndef list_products(conn):\n    pass\n",
          sample: "list_products(conn) → [('Oil', 2800.0, 30), ('Rice', 9500.0, 17)]",
          tests: [
            {
              check:
                'import sqlite3\n' +
                'conn = sqlite3.connect(":memory:")\n' +
                'conn.execute("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT UNIQUE, price REAL, stock INTEGER)")\n' +
                'a = add_product(conn, "Rice", 9500.0, 12)\n' +
                'b = add_product(conn, "Oil", 2800.0, 30)\n' +
                'add_product(conn, "Salt", 300.0, 5)\n' +
                'assert (a, b) == (1, 2), "add_product should return the new id (cursor.lastrowid). Got " + repr((a, b))\n' +
                'restock(conn, "Rice", 5)\n' +
                'remove_product(conn, "Salt")\n' +
                'assert list_products(conn) == [("Oil", 2800.0, 30), ("Rice", 9500.0, 17)], "Got " + repr(list_products(conn))\n' +
                'assert not conn.in_transaction, "Commit after each change."\n' +
                'assert "?" in source, "Use ? placeholders for values."',
            },
          ],
          solution: 'import sqlite3\n\ndef add_product(conn, name, price, stock):\n    cur = conn.execute("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", (name, price, stock))\n    conn.commit()\n    return cur.lastrowid\n\ndef restock(conn, name, amount):\n    conn.execute("UPDATE products SET stock = stock + ? WHERE name = ?", (amount, name))\n    conn.commit()\n\ndef remove_product(conn, name):\n    conn.execute("DELETE FROM products WHERE name = ?", (name,))\n    conn.commit()\n\ndef list_products(conn):\n    return conn.execute("SELECT name, price, stock FROM products ORDER BY name").fetchall()\n',
          hint: "conn.execute(sql, (values,)) returns a cursor; cursor.lastrowid is the new id. A one-value tuple needs a trailing comma: (name,).",
          successMessage: "Full CRUD on a real database. Every inventory, booking and banking system is built on these four statements.",
        },
      },
      {
        id: "a-pp-sql-filter-join",
        title: "Filtering, sorting, grouping and joins",
        explain:
          "WHERE filters rows (AND, OR, LIKE 'A%' for patterns, BETWEEN, IN). ORDER BY sorts (DESC for largest first); LIMIT keeps the first n. Aggregate functions (COUNT, SUM, AVG, MIN, MAX) summarise, and GROUP BY applies them per group; HAVING filters groups. JOIN combines tables on matching keys: FROM scores JOIN students ON scores.student_id = students.id.",
        code: {
          language: PY,
          code: SCHOOL_DB + 'conn = school_db()\nprint(conn.execute("SELECT name FROM students WHERE class = \'SS2\' ORDER BY name").fetchall())\nprint(conn.execute("SELECT subject, MAX(score) FROM scores GROUP BY subject ORDER BY subject").fetchall())\nprint(conn.execute("SELECT s.name, sc.score FROM scores sc JOIN students s ON sc.student_id = s.id WHERE sc.subject = \'Maths\' AND sc.score >= 60 ORDER BY sc.score DESC").fetchall())\n',
          expectedOutput: "[('Chi',), ('Dan',)]\n[('English', 88), ('Maths', 92)]\n[('Chi', 92), ('Ada', 80), ('Dan', 60)]",
        },
        codeChallenge: {
          task: "The school database (students and scores tables, as in the example) is provided by school_db(). Write three functions, each running ONE SQL query: class_averages(conn) returning (class, average score rounded to 1 dp) per class, ordered by class; top_students(conn, n) returning the n (name, average) pairs with the highest average score (rounded to 1 dp), best first; and failing(conn) returning the sorted names of students with any score below 50.",
          starter: SCHOOL_DB + "\ndef class_averages(conn):\n    pass\n\ndef top_students(conn, n):\n    pass\n\ndef failing(conn):\n    pass\n",
          sample: "class_averages(conn) → [('SS1', 62.5), ('SS2', 80.0)]",
          tests: [
            {
              check:
                'conn = school_db()\n' +
                'assert class_averages(conn) == [("SS1", 62.5), ("SS2", 80.0)], "Got " + repr(class_averages(conn))\n' +
                'assert top_students(conn, 2) == [("Chi", 90.0), ("Ada", 75.0)], "Got " + repr(top_students(conn, 2))\n' +
                'assert failing(conn) == ["Bayo"], "Got " + repr(failing(conn))\n' +
                'assert source.upper().count("GROUP BY") >= 2 and "JOIN" in source.upper(), "Use GROUP BY and JOIN in your SQL rather than Python loops."',
            },
          ],
          solution: SCHOOL_DB + '\ndef class_averages(conn):\n    return conn.execute(\n        "SELECT s.class, ROUND(AVG(sc.score), 1) FROM scores sc "\n        "JOIN students s ON sc.student_id = s.id GROUP BY s.class ORDER BY s.class"\n    ).fetchall()\n\ndef top_students(conn, n):\n    return conn.execute(\n        "SELECT s.name, ROUND(AVG(sc.score), 1) AS avg_score FROM scores sc "\n        "JOIN students s ON sc.student_id = s.id GROUP BY s.id "\n        "ORDER BY avg_score DESC LIMIT ?",\n        (n,),\n    ).fetchall()\n\ndef failing(conn):\n    rows = conn.execute(\n        "SELECT DISTINCT s.name FROM scores sc JOIN students s ON sc.student_id = s.id "\n        "WHERE sc.score < 50 ORDER BY s.name"\n    ).fetchall()\n    return [r[0] for r in rows]\n',
          hint: "Join scores to students on student_id = id. GROUP BY s.class (or s.id) with ROUND(AVG(sc.score), 1). LIMIT ? takes n as a parameter. DISTINCT removes repeated names.",
          successMessage: "Reports that would take loops and dictionaries in Python, each answered by one query. The database does the heavy lifting.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 18.6 – 18.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l76-relations-safety",
    moduleId: "pp-m18-databases",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.6", "18.7", "18.8"],
    title: "Relationships, sqlite3 and SQL Injection",
    subtitle: "Normalising data, using Python's sqlite3 well, and parameterised queries",
    estimatedMinutes: 26,
    intro:
      "Good database design stores each fact once and links tables with keys. Python's sqlite3 module connects your programs to that design. And one rule protects every database you will ever touch: never build SQL by pasting user input into a string.",

    atoms: [
      {
        id: "a-pp-normalisation",
        title: "Relationships and normalisation fundamentals",
        explain:
          "Relationships: ONE-TO-MANY (one class has many students: students.class_id refers to classes.id) and MANY-TO-MANY (students take many courses, courses have many students: a linking table enrolments(student_id, course_id)). NORMALISATION means storing each fact in exactly one place. If a teacher's phone number is repeated on every student row, changing it means updating hundreds of rows, and missing one leaves the data contradicting itself.",
        decision: {
          scenario: "A table has columns: student_name, class_name, class_teacher, teacher_phone. The teacher_phone is repeated for every student in the class.",
          question: "What is the normalised design?",
          options: [
            {
              id: "a",
              text: "A teachers table (id, name, phone), a classes table (id, name, teacher_id), and students with a class_id: each fact stored once and linked by keys",
              why: "Now a phone number lives in one row. Change it once and every student's class shows the new number.",
            },
            {
              id: "b",
              text: "Keep one table and be careful when updating",
              whyWrong: "Careful humans still miss rows; the design should make contradictions impossible.",
            },
            {
              id: "c",
              text: "Store everything as one long text column",
              whyWrong: "That throws away types, searching and every database guarantee.",
            },
            {
              id: "d",
              text: "Delete the teacher_phone column",
              whyWrong: "The information is needed; it just belongs in its own table.",
            },
          ],
          correct: "a",
          aftermath: "One fact, one place, linked by keys. Joins (Lesson 75) bring it back together when you query.",
        },
      },
      {
        id: "a-pp-sqlite3",
        title: "SQLite using Python's sqlite3",
        explain:
          "sqlite3.connect(\"school.db\") opens (or creates) a database file; \":memory:\" makes a temporary one. conn.execute() runs SQL and returns a cursor; fetchone() gives one row, fetchall() a list. Setting conn.row_factory = sqlite3.Row lets you read columns by name, row[\"name\"]. executemany() inserts many rows in one call. Call conn.commit() to save changes and conn.close() when finished.",
        code: {
          language: PY,
          code: 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.row_factory = sqlite3.Row\nconn.execute("CREATE TABLE staff (name TEXT, role TEXT)")\nconn.executemany("INSERT INTO staff VALUES (?, ?)", [("Ada", "teacher"), ("Bo", "bursar")])\nconn.commit()\nrow = conn.execute("SELECT * FROM staff WHERE role = ?", ("bursar",)).fetchone()\nprint(row["name"], row["role"])\nprint(conn.execute("SELECT COUNT(*) FROM staff").fetchone()[0])\nconn.close()\n',
          expectedOutput: "Bo bursar\n2",
        },
      },
      {
        id: "a-pp-sql-injection",
        title: "Parameterised queries and SQL injection prevention",
        explain:
          "Building SQL with f-strings, such as f\"SELECT * FROM users WHERE name = '{name}'\", lets a user type SQL: a name of ' OR '1'='1 turns the query into one that returns every user. This is SQL INJECTION, one of the most damaging and common security flaws. The fix is always the same: write ? placeholders in the SQL and pass the values separately as a tuple. The database then treats them as data, never as SQL.",
        code: {
          language: PY,
          code: 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE users (name TEXT, secret TEXT)")\nconn.executemany("INSERT INTO users VALUES (?, ?)", [("ada", "a1"), ("bo", "b2")])\nattack = "x\' OR \'1\'=\'1"\nunsafe = conn.execute(f"SELECT name FROM users WHERE name = \'{attack}\'").fetchall()\nsafe = conn.execute("SELECT name FROM users WHERE name = ?", (attack,)).fetchall()\nprint("unsafe:", unsafe)\nprint("safe:", safe)\n',
          expectedOutput: "unsafe: [('ada',), ('bo',)]\nsafe: []",
        },
        codeChallenge: {
          task: "This login check is vulnerable to SQL injection. Rewrite check_login(conn, username, password) using ? placeholders so it returns True only for a matching username AND password, and False for anything else, including injection attempts.",
          starter: 'import sqlite3\n\ndef check_login(conn, username, password):\n    sql = f"SELECT COUNT(*) FROM users WHERE username = \'{username}\' AND password = \'{password}\'"\n    return conn.execute(sql).fetchone()[0] > 0\n',
          sample: "check_login(conn, \"ada\", \"' OR '1'='1\") → False",
          tests: [
            {
              check:
                'import sqlite3\n' +
                'conn = sqlite3.connect(":memory:")\n' +
                'conn.execute("CREATE TABLE users (username TEXT, password TEXT)")\n' +
                'conn.execute("INSERT INTO users VALUES (\'ada\', \'Py#2026\')")\n' +
                'assert check_login(conn, "ada", "Py#2026") is True, "The correct password logs in."\n' +
                'assert check_login(conn, "ada", "wrong") is False, "A wrong password is refused."\n' +
                'assert check_login(conn, "ada", "\' OR \'1\'=\'1") is False, "The injection attempt must be refused."\n' +
                'assert check_login(conn, "\' OR 1=1 --", "x") is False, "A comment-based injection must be refused."\n' +
                'assert check_login(conn, "O\'Brien", "x") is False, "A name containing a quote must not crash."\n' +
                'assert "?" in source and "f\\"SELECT" not in source and "f\'SELECT" not in source, "Use ? placeholders, not an f-string."',
            },
          ],
          solution: 'import sqlite3\n\ndef check_login(conn, username, password):\n    row = conn.execute(\n        "SELECT COUNT(*) FROM users WHERE username = ? AND password = ?",\n        (username, password),\n    ).fetchone()\n    return row[0] > 0\n',
          hint: "Write the SQL with two ? marks and pass (username, password) as the second argument to execute().",
          successMessage: "Injection-proof, and names like O'Brien no longer crash it. (A real system also stores passwords hashed, never as plain text: that is security beyond this module, but remember it.)",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 18.9 – 18.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l77-transactions",
    moduleId: "pp-m18-databases",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["18.9", "18.10"],
    title: "Transactions and Error Handling",
    subtitle: "All-or-nothing changes, and handling database errors",
    estimatedMinutes: 24,
    intro:
      "A transfer between two accounts is two updates. If the program crashes between them, money vanishes. Transactions make a group of changes all-or-nothing. Then the last piece: handling the errors databases raise, and closing connections properly.",

    atoms: [
      {
        id: "a-pp-transactions",
        title: "Transactions and commit/rollback",
        explain:
          "A TRANSACTION groups changes so they either ALL happen (commit) or NONE do (rollback). sqlite3 starts a transaction automatically before a change; conn.commit() makes it permanent and conn.rollback() undoes everything since the last commit. Using the connection as a context manager, with conn:, commits if the block succeeds and rolls back if it raises.",
        code: {
          language: PY,
          code: 'import sqlite3\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE acc (name TEXT, bal INTEGER)")\nconn.executemany("INSERT INTO acc VALUES (?, ?)", [("Ada", 500), ("Bo", 100)])\nconn.commit()\ntry:\n    with conn:\n        conn.execute("UPDATE acc SET bal = bal - 300 WHERE name = \'Ada\'")\n        raise RuntimeError("power cut!")\nexcept RuntimeError:\n    pass\nprint(conn.execute("SELECT * FROM acc").fetchall())\n',
          expectedOutput: "[('Ada', 500), ('Bo', 100)]",
        },
        why: "The update to Ada happened, then the error struck before Bo was credited. with conn: rolled the whole transaction back, so no money vanished.",
        codeChallenge: {
          task: "Write transfer(conn, sender, receiver, amount) for an accounts table (name TEXT PRIMARY KEY, balance INTEGER). Inside with conn:, subtract from the sender and add to the receiver; if either account does not exist or the sender's balance would go below 0, raise ValueError so the transaction rolls back and NOTHING changes. Return the sender's new balance on success.",
          starter: 'import sqlite3\n\ndef transfer(conn, sender, receiver, amount):\n    conn.execute("UPDATE accounts SET balance = balance - ? WHERE name = ?", (amount, sender))\n    conn.execute("UPDATE accounts SET balance = balance + ? WHERE name = ?", (amount, receiver))\n    conn.commit()\n',
          sample: "transfer(conn, \"Ada\", \"Bo\", 200) → 300",
          tests: [
            {
              check:
                'import sqlite3\n' +
                'conn = sqlite3.connect(":memory:")\n' +
                'conn.execute("CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER)")\n' +
                'conn.executemany("INSERT INTO accounts VALUES (?, ?)", [("Ada", 500), ("Bo", 100)])\n' +
                'conn.commit()\n' +
                'state = lambda: dict(conn.execute("SELECT name, balance FROM accounts"))\n' +
                'assert transfer(conn, "Ada", "Bo", 200) == 300 and state() == {"Ada": 300, "Bo": 300}, "A valid transfer moves the money. State: " + repr(state())\n' +
                'for args in [("Ada", "Bo", 1000), ("Ada", "Zed", 50), ("Zed", "Bo", 50)]:\n' +
                '    try:\n' +
                '        transfer(conn, *args)\n' +
                '        assert False, f"transfer{args} should raise ValueError"\n' +
                '    except ValueError:\n' +
                '        pass\n' +
                '    assert state() == {"Ada": 300, "Bo": 300}, f"After the failed transfer{args} nothing may change. State: " + repr(state())',
            },
          ],
          solution: 'import sqlite3\n\ndef transfer(conn, sender, receiver, amount):\n    with conn:\n        cur = conn.execute("UPDATE accounts SET balance = balance - ? WHERE name = ?", (amount, sender))\n        if cur.rowcount == 0:\n            raise ValueError("unknown sender")\n        cur = conn.execute("UPDATE accounts SET balance = balance + ? WHERE name = ?", (amount, receiver))\n        if cur.rowcount == 0:\n            raise ValueError("unknown receiver")\n        balance = conn.execute("SELECT balance FROM accounts WHERE name = ?", (sender,)).fetchone()[0]\n        if balance < 0:\n            raise ValueError("insufficient funds")\n    return balance\n',
          hint: "cursor.rowcount tells you how many rows an UPDATE changed: 0 means the account does not exist. Raising inside with conn: rolls everything back.",
          successMessage: "All-or-nothing: an unknown account or insufficient funds leaves both balances untouched. This is how banks keep money from disappearing.",
        },
      },
      {
        id: "a-pp-db-errors",
        title: "Database connections and error handling",
        explain:
          "sqlite3 raises its own exceptions: IntegrityError when a rule is broken (duplicate UNIQUE value, NOT NULL, foreign key), OperationalError for bad SQL or a missing table, and the base class sqlite3.Error for everything. Catch the specific one you can handle. Always close connections: contextlib.closing(sqlite3.connect(path)) closes it when the block ends (with conn: alone commits but does not close).",
        codeChallenge: {
          task: "Write register(conn, email, name) for a users table where email is TEXT UNIQUE NOT NULL. Insert the user and return True; if the email is already registered (sqlite3.IntegrityError), return False instead of crashing. Then write count_users(path) that opens the database file at path with contextlib.closing, returns the number of users, and returns 0 if the users table does not exist yet (sqlite3.OperationalError).",
          starter: "import sqlite3\nfrom contextlib import closing\n\ndef register(conn, email, name):\n    with conn:\n        conn.execute(\"INSERT INTO users (email, name) VALUES (?, ?)\", (email, name))\n    return True\n\ndef count_users(path):\n    pass\n",
          sample: "register(conn, \"ada@x.ng\", \"Ada\") → True; again → False",
          tests: [
            {
              check:
                'import sqlite3\n' +
                'conn = sqlite3.connect("school.db")\n' +
                'conn.execute("CREATE TABLE IF NOT EXISTS users (email TEXT UNIQUE NOT NULL, name TEXT)")\n' +
                'conn.execute("DELETE FROM users")\n' +
                'conn.commit()\n' +
                'assert register(conn, "ada@x.ng", "Ada") is True, "A new email registers."\n' +
                'assert register(conn, "ada@x.ng", "Ada again") is False, "A duplicate email returns False."\n' +
                'assert register(conn, "bo@x.ng", "Bo") is True, "The connection still works after the error."\n' +
                'conn.close()\n' +
                'assert count_users("school.db") == 2, "count_users should read the file and count 2 users."\n' +
                'assert count_users("empty.db") == 0, "A database with no users table counts 0."\n' +
                'assert "closing" in source and "IntegrityError" in source and "OperationalError" in source, "Use closing() and catch the specific sqlite3 errors."',
            },
          ],
          solution: 'import sqlite3\nfrom contextlib import closing\n\ndef register(conn, email, name):\n    try:\n        with conn:\n            conn.execute("INSERT INTO users (email, name) VALUES (?, ?)", (email, name))\n    except sqlite3.IntegrityError:\n        return False\n    return True\n\ndef count_users(path):\n    with closing(sqlite3.connect(path)) as conn:\n        try:\n            return conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]\n        except sqlite3.OperationalError:\n            return 0\n',
          hint: "Wrap the with conn: block in try/except sqlite3.IntegrityError. In count_users, with closing(sqlite3.connect(path)) as conn: then try the SELECT.",
          successMessage: "Expected database failures handled precisely, and connections always closed. Your data layer is now production-shaped.",
        },
      },
    ],

    task: {
      title: "Module 18 practice: a persistent registration or inventory system",
      intro: "Build it on your own machine with a real .db file. The milestone is to store, retrieve, update and delete structured data safely.",
      prompts: [
        "Design at least three related tables (for example students, courses, enrolments) with primary and foreign keys, and draw the relationships.",
        "Write functions for create, read, update and delete on each table, every one using ? placeholders.",
        "Add three reports using JOIN, GROUP BY and ORDER BY (for example, number of students per course).",
        "Make any multi-step change (such as moving a student between courses) a single transaction.",
        "Handle IntegrityError for duplicates and missing references, and write tests that use a fresh :memory: database for each test.",
      ],
      closing: "Next: APIs and HTTP, so your Python programs can talk to other services over the internet, and offer their own.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
