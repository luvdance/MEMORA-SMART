/**
 * RELATIONAL DATABASES · WEEK 1 · UNDERSTANDING DATA AND DATABASES
 *
 * Curriculum 1.1 – 1.P. Data, information and knowledge; structured,
 * semi-structured and unstructured data; why databases exist and when a
 * spreadsheet is still enough; DBMS and RDBMS; servers, databases, tables,
 * rows and columns; PostgreSQL and SQL; how applications talk to databases;
 * and the relational model. Mostly ideas, so most practice is judgement, but
 * the learner runs SQL on a real PostgreSQL server from the first lesson.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY, REGISTRATIONS, decide } from "./db-helpers.js";

export const SECTION_ID = "db-s1-foundations";
const MODULE = "db-m1-foundations";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.4 · DATA AND INFORMATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l1-data",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2", "1.3", "1.4"],
    title: "Data, Information and Knowledge",
    subtitle: "Raw facts, meaning, and the shapes data comes in",
    estimatedMinutes: 30,
    intro:
      "Every app you use — your bank, your school portal, the shop that delivered your last order — is a front for a database. Before you build one, you need a clear idea of what it stores, and why storing it well matters so much.",
    atoms: [
      {
        id: "a-db-welcome",
        title: "How this course works: real SQL, from today",
        explain:
          "This course teaches relational databases by having you use one. Every lesson has SQL you run on a real PostgreSQL 18 server that starts inside this page: the results, the messages and the errors are PostgreSQL's own. Each run starts from a fresh copy of the lesson's database, so you cannot break anything. In Week 2 you also install PostgreSQL and MySQL on your own computer, and from then on you can run everything there too. Every lab has a checklist: write the SQL, press Run to see what it returns, then Check my SQL.",
        why:
          "Databases are learned by asking them questions and reading what comes back. Reading about SQL without running it is like reading about swimming.",
        sqlLab: {
          task:
            "Press Start PostgreSQL, then Run the query as it is. Then change 'Hello, PostgreSQL' to a greeting with your own name in it (keep the quotes and the AS greeting part), Run it again, and press Check my SQL.",
          starter: "SELECT 'Hello, PostgreSQL' AS greeting;\n",
          solution: "SELECT 'Hello, I am Ada' AS greeting;\n",
          checks: [
            { label: "It runs and returns one column called greeting", returns: { columns: ["greeting"], minRows: 1, maxRows: 1 } },
            { label: "The greeting is your own", returns: { differsFrom: "Hello, PostgreSQL" } },
          ],
          hint: "Change only the text between the single quotes, for example 'Good morning from Kano'. Keep the semicolon at the end.",
          successMessage:
            "That ran on a real PostgreSQL server. Everything you write in this course runs the same way.",
        },
      },
      {
        id: "a-db-data-vs-info",
        title: "Data versus information",
        explain:
          "DATA is raw recorded facts with no context: 74, 'Bayo', 2026-04-03. INFORMATION is data organised so that it answers a question: 'Bayo Adeyemi completed Python Programming on 3 April 2026 with a score of 74.' The same facts become information when they are connected (whose score? in what?) and placed in context (is 74 good? the pass mark is 50). Databases store data; queries turn it into information.",
        example:
          "Data:         74   Bayo   PY-101   2026-04-03\nInformation:  Bayo completed Python Programming (PY-101) on 3 April 2026, scoring 74 (pass mark 50).",
        decision: decide({
          scenario: "A head teacher is handed a sheet with a single column of 400 numbers between 12 and 98 and nothing else.",
          question: "Why is this data, not yet information?",
          right: ["The numbers have no context: we do not know whose scores they are, in which subject or term, or what a pass is", "Information needs context and connections. Without names, subjects and a pass mark, the numbers answer no question."],
          wrong: [
            ["Because there are too many numbers to read", "Quantity is not the issue; 4 numbers with no context would still be just data."],
            ["Because numbers can never be information", "Numbers become information as soon as they are placed in context."],
            ["Because it is on paper rather than in a computer", "The medium does not matter; context does."],
          ],
          at: 0,
          aftermath: "A database stores the context alongside the facts (student, subject, term), so the numbers can always be turned into answers.",
        }),
      },
      {
        id: "a-db-dik",
        title: "Raw facts, meaningful information and knowledge",
        explain:
          "Think of three levels. FACTS are recorded values. INFORMATION is facts organised to answer a question ('average score this term is 61'). KNOWLEDGE is understanding drawn from information that lets you act ('scores dropped after the timetable changed, so move maths back to the morning'). A database's job is to keep the facts complete and correct, so the information built from them can be trusted and turned into good decisions.",
        table: {
          caption: "The same school, at three levels.",
          headers: ["Level", "Example", "Question it answers"],
          rows: [
            ["Raw facts", "Score 58, student 8, PY-101, 2026-06-11", "None on its own"],
            ["Information", "Average Python score fell from 78 to 58 this term", "What happened?"],
            ["Knowledge", "Learners who skipped the loops lesson scored lowest; make it required", "What should we do?"],
          ],
        },
        decision: decide({
          scenario: "A shop's database shows that 70% of last month's orders came from Lagos, and the owner decides to offer free delivery only in Lagos to win more of them.",
          question: "Which part of this is knowledge?",
          right: ["The decision to target Lagos customers because that is where most orders come from", "Knowledge is understanding you can act on, drawn from information."],
          wrong: [
            ["Each order's delivery city as stored in the database", "Those are raw facts."],
            ["The figure '70% of orders came from Lagos'", "That is information: facts summarised to answer a question."],
            ["The database server itself", "The server stores and processes data; knowledge is what people derive from it."],
          ],
          at: 3,
          aftermath: "Bad facts produce wrong information and then wrong decisions. That is why so much of this course is about keeping data correct.",
        }),
      },
      {
        id: "a-db-structured",
        title: "Structured, semi-structured and unstructured data",
        explain:
          "STRUCTURED data fits a fixed shape: every record has the same named fields with known types, like rows in a table (student, course, date, score). Relational databases are built for it. SEMI-STRUCTURED data carries its own labels but each record may differ: JSON from an API, XML, a CSV export with optional columns. UNSTRUCTURED data has no field structure at all: emails, PDFs, photos, voice notes, video. Most organisations have all three; this course is about the first, and PostgreSQL can also store JSON (semi-structured) inside a structured table when that helps.",
        table: {
          caption: "One student, three shapes of data.",
          headers: ["Kind", "Example", "Where it usually lives"],
          rows: [
            ["Structured", "id 1 · Ada Obi · ada@example.com · Lagos · 2026-01-05", "A table in a relational database"],
            ["Semi-structured", '{"name": "Ada Obi", "socials": {"x": "@adaobi"}}', "JSON from an API, a document database, a jsonb column"],
            ["Unstructured", "A scanned copy of Ada's WAEC certificate", "File storage; the database stores where the file is"],
          ],
        },
        decision: decide({
          scenario: "A job platform receives three things for each applicant: a form (name, email, phone, years of experience), a CV as a PDF, and a list of skills from LinkedIn as JSON whose fields vary from person to person.",
          question: "Which is the best way to classify them?",
          right: ["Form: structured. Skills JSON: semi-structured. CV PDF: unstructured", "The form has fixed fields, the JSON labels itself but varies, and a PDF has no field structure the database can query."],
          wrong: [
            ["All three are structured because they are all about one applicant", "Being about the same person does not give data a fixed field structure."],
            ["Form: unstructured. JSON: structured. PDF: semi-structured", "That reverses them: forms are the classic structured data."],
            ["All three are unstructured until they are in a database", "The shape is a property of the data itself, not of where it is stored."],
          ],
          at: 1,
          aftermath: "A sensible design stores the form in a table, the skills in related rows (or a jsonb column), and the PDF in file storage with its path in the table.",
        }),
      },
      {
        id: "a-db-real-examples",
        title: "Real-world records: students, sales, payments and job applications",
        explain:
          "Look at any organisation and you find the same pattern: things it needs to remember (students, products, customers, applicants) and events that connect them (an enrollment, a sale, a payment, an application). Each kind of thing and each kind of event has a fixed set of facts worth recording. Below is the academy database this course uses from Week 7, running on PostgreSQL: run it and look at what one payment row records.",
        sqlDemo: {
          setup: ACADEMY,
          caption: "Payments recorded by the academy. Each row is one event that links a student's enrollment to money received.",
          code: "SELECT * FROM payments;",
        },
        decision: decide({
          scenario: "A small business sells phones on credit. For each sale it must later answer: who bought, what, for how much, how much has been paid, and when each instalment arrived.",
          question: "Which of these is an EVENT the database should record as its own record, not just as a detail of the customer?",
          right: ["Each instalment payment: an amount received on a date for one sale", "Payments happen many times per sale; each is its own record linked to the sale."],
          wrong: [
            ["The customer's name", "A name is a fact about the customer, not a separate event."],
            ["The phone model's colour", "That is a fact about the product."],
            ["The shop's address", "That is a fact about the business, recorded once."],
          ],
          at: 2,
          aftermath: "Spotting the repeating events (payments, enrollments, applications) is the first step of every database design you will do in Week 3.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.5 – 1.8 · WHY DATABASES EXIST
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l2-why-databases",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.5", "1.6", "1.7", "1.8"],
    title: "Why Databases Exist",
    subtitle: "Paper, spreadsheets, databases, and the problems in between",
    estimatedMinutes: 28,
    intro:
      "Most organisations start with paper or a spreadsheet, and that is not a mistake. The problems arrive as records, users and questions grow. Knowing exactly which problems a database solves is how you know when one is needed.",
    atoms: [
      {
        id: "a-db-paper-sheets-db",
        title: "Paper, spreadsheets and databases",
        explain:
          "PAPER records are cheap and need no power, but can be read by one person at a time, are slow to search, and are lost to fire or flood. A SPREADSHEET is fast to start, easy to read, and good for calculations, but it is one file: anyone can type anything in any cell, two people editing copies produce two versions, and nothing stops a student being entered twice. A DATABASE stores records in tables with declared types and rules, lets many users read and change them at once safely, answers questions with queries, and can be backed up and recovered.",
        table: {
          caption: "The same registration process three ways.",
          headers: ["", "Paper register", "Spreadsheet", "Database"],
          rows: [
            ["Finding one student", "Turn pages", "Ctrl+F", "A query, instant even with millions of rows"],
            ["Two staff updating at once", "Impossible", "Conflicting copies", "Handled safely"],
            ["Rejecting a bad date", "Nothing stops it", "Optional validation, easily bypassed", "Enforced by the column's type"],
            ["Recovering after a disaster", "Gone", "Only if someone kept a copy", "Backups and logs"],
          ],
        },
        decision: decide({
          scenario: "A tutorial centre with 40 students keeps its register in a spreadsheet that only the owner edits. It works well.",
          question: "What is the most sensible advice?",
          right: ["Keep the spreadsheet for now, and move to a database when several staff need to update it, records grow, or data starts going wrong", "Tools should match needs. A database adds value when its guarantees are needed."],
          wrong: [
            ["Move to a database immediately; spreadsheets are always wrong", "A one-person, 40-row register is exactly where a spreadsheet is fine."],
            ["Go back to paper; it cannot crash", "Paper loses the searching and backup a spreadsheet already gives."],
            ["Email the spreadsheet to all staff so everyone has a copy", "That creates the conflicting-copies problem."],
          ],
          at: 0,
          aftermath: "Section 1.8 makes this decision precise.",
        }),
      },
      {
        id: "a-db-duplicates",
        title: "Duplicate records and inconsistent information",
        explain:
          "When the same fact is typed in more than one place, the copies drift apart. A student entered twice ('Ada Obi' and 'ada obi') is counted twice. A course fee typed on every registration row is changed on some rows and not others, so the sheet now holds two different fees for one course. A city stored as 'Lagos', 'lagos' and 'LAGOS' splits one city into three in every report. Databases fight this by storing each fact ONCE and by rules that reject bad values, ideas you will build properly in Weeks 3 and 4.",
        example:
          "row 1  Ada Obi   ada@example.com      Lagos   SQL fee 55000\nrow 3  ada obi   ada.obi@example.com  lagos   SQL fee 55000\n\nOne person, two rows, two emails, two spellings of Lagos. Which email is right?",
        decision: decide({
          scenario: "The course fee for SQL is typed on each of 300 registration rows. The fee goes up, and a staff member updates 280 of the rows before going home.",
          question: "What is the real problem here?",
          right: ["The same fact (the fee) is stored 300 times, so the copies can disagree; it should be stored once, with the course", "Repetition is what made an inconsistent state possible at all."],
          wrong: [
            ["The staff member should have worked faster", "Any process that needs 300 identical edits will eventually be done partly."],
            ["Spreadsheets cannot store numbers reliably", "They store numbers fine; the design stores this one too many times."],
            ["Nothing: 20 rows is a small error", "Every report on revenue is now wrong, and nobody can tell which rows are right."],
          ],
          at: 0,
          aftermath: "This is called an update anomaly. Week 4 shows how normalization removes it by design.",
        }),
      },
      {
        id: "a-db-loss-concurrency",
        title: "Data loss, concurrent updates and slow retrieval",
        explain:
          "Three more problems grow with size. DATA LOSS: a laptop dies, a file is overwritten, someone deletes rows by mistake, and there is no history. CONCURRENT UPDATES: two people change the same file at once and the last save silently wins, losing the other's work. RETRIEVAL: 'which students in Abuja paid by transfer but have not finished any course?' takes an hour of filtering by hand. A database server keeps a write-ahead log so committed changes survive crashes, coordinates many simultaneous users with transactions (Week 11), and answers questions like that one in a single query.",
        decision: decide({
          scenario: "Two receptionists open the shared registration file at 9:00. One adds 12 new students, the other corrects 5 phone numbers. The first saves at 9:40, the second at 9:45.",
          question: "What most likely happens?",
          right: ["The 9:45 save overwrites the file, and the 12 new students disappear", "A plain file has no way to merge two people's changes: the last save wins. This is a lost update."],
          wrong: [
            ["Both changes are combined automatically", "Only systems built for concurrency (databases, some cloud editors) merge or coordinate changes."],
            ["The second receptionist gets an error and must try again", "A simple shared file gives no such warning."],
            ["The file is corrupted and nothing can be opened", "Usually the file is fine; one person's work is simply gone."],
          ],
          at: 3,
          aftermath: "Databases solve this at the level of each row, so 12 inserts and 5 phone updates never collide.",
        }),
      },
      {
        id: "a-db-when-database",
        title: "When a spreadsheet is enough, and when a database is better",
        explain:
          "A spreadsheet is enough when one person (or a few, one at a time) maintains a small dataset, mostly for calculation or a one-off analysis, and mistakes are cheap. Choose a database when several people or an application must change the data at the same time; records are related (students, courses, payments) and must stay consistent; the data will keep growing; rules must be enforced, not hoped for; you need security per user; or losing data would be serious. A useful test: if the data is the business's memory, not a personal tool, it belongs in a database.",
        table: {
          caption: "Signals that it is time for a database.",
          headers: ["Signal", "Example"],
          rows: [
            ["Many writers", "Three branches register students at the same time"],
            ["Related records", "Students, courses, enrollments and payments that must match"],
            ["An application needs it", "A website or app reads and writes the data"],
            ["Rules matter", "No enrollment without a real student; no negative fees"],
            ["Access must be controlled", "Tutors see grades; only finance sees payments"],
            ["Loss is unacceptable", "Payment records required by auditors"],
          ],
        },
        decision: decide({
          scenario: "Four situations: (1) a teacher averaging her own class's test scores; (2) a mobile money app recording transfers for 50,000 users; (3) a church listing volunteers for one event; (4) a hospital storing patients, appointments and prescriptions used by doctors, pharmacists and billing.",
          question: "Which need a database rather than a spreadsheet?",
          right: ["2 and 4", "Both have many simultaneous users, related records, strict rules and serious consequences of loss."],
          wrong: [
            ["All four", "1 and 3 are small, single-owner and low-risk: a spreadsheet does the job."],
            ["Only 2, because it has the most users", "The hospital's related records and access rules need a database as much."],
            ["1 and 3, because they are simpler", "Simplicity is a reason to keep a spreadsheet, not to need a database."],
          ],
          at: 0,
          aftermath: "Being able to say WHY a database is needed is this week's checkpoint.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.9 – 1.13 · DATABASE SYSTEMS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l3-database-systems",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.9", "1.10", "1.11", "1.12", "1.13"],
    title: "Database Systems, PostgreSQL and SQL",
    subtitle: "DBMS, RDBMS, servers, tables, and how apps talk to them",
    estimatedMinutes: 32,
    intro:
      "'Database' gets used for three different things: the data, the software that manages it, and the machine it runs on. Separating them is the first step to understanding how every real system is built.",
    atoms: [
      {
        id: "a-db-dbms",
        title: "A database versus a database management system (DBMS)",
        explain:
          "A DATABASE is an organised collection of related data: the academy's students, courses and payments. A DATABASE MANAGEMENT SYSTEM (DBMS) is the software that stores that data on disk and controls all access to it: it accepts requests, checks permissions, enforces rules, coordinates simultaneous users, writes logs for recovery, and runs queries. You never open the database's files directly; you ask the DBMS. PostgreSQL, MySQL, SQL Server, Oracle and SQLite are DBMSs.",
        analogy:
          "The database is the money in the vault; the DBMS is the bank: tellers, rules, records and security. Customers never walk into the vault themselves.",
        decision: decide({
          scenario: "A colleague says: 'Our database crashed, so I copied the PostgreSQL data folder to a USB drive and opened the files in Notepad to read the students.'",
          question: "What is the misunderstanding?",
          right: ["The data files are the DBMS's private storage format; data is read through the DBMS (with SQL), and backups are made with its tools", "Only the DBMS understands its files. Reading or copying them while it runs is unreliable."],
          wrong: [
            ["Nothing: data files are plain text", "PostgreSQL stores data in binary pages, not text."],
            ["He should have used Excel instead of Notepad", "The format is still the DBMS's own; no spreadsheet can read it."],
            ["The DBMS and the database are the same thing", "That is exactly the confusion: one is the software, the other the data it manages."],
          ],
          at: 0,
          aftermath: "Week 14 teaches pg_dump and pg_restore: the DBMS's own, safe way to copy a database.",
        }),
      },
      {
        id: "a-db-rdbms",
        title: "What a relational DBMS (RDBMS) does",
        explain:
          "A RELATIONAL DBMS stores data in tables (relations) and lets you combine them through shared values: an enrollment row holds a student's id and a course's id, so one query can ask for 'every student with their courses'. An RDBMS also guarantees things about the data: types (a date column holds only valid dates), constraints (every enrollment must point at a real student), and transactions (a payment and its receipt are saved together or not at all). Everything is done in SQL, a standard language. PostgreSQL and MySQL are the two most widely used open-source RDBMSs; Oracle, Microsoft SQL Server and SQLite are others.",
        decision: decide({
          scenario: "An RDBMS is told: 'An enrollment's student_id must match an existing student.' Someone then tries to save an enrollment for student 999, who does not exist.",
          question: "What does the RDBMS do?",
          right: ["Refuses to save it and returns an error, because the rule is part of the database", "Rules declared in the database are enforced for every program and every person, every time."],
          wrong: [
            ["Saves it and shows a warning", "A declared constraint is not a warning; the change is rejected."],
            ["Creates student 999 automatically", "The DBMS never invents data to satisfy a rule."],
            ["Saves it and fixes it at midnight", "Enforcement is immediate, at the moment of the change."],
          ],
          at: 2,
          aftermath: "You will see PostgreSQL do exactly this in Week 3.",
        }),
      },
      {
        id: "a-db-server-hierarchy",
        title: "Server, database, table, row and column",
        explain:
          "These nest inside one another. A DATABASE SERVER is a running PostgreSQL (or MySQL) program, listening on a network port (PostgreSQL's default is 5432, MySQL's 3306). One server holds several DATABASES (academy, shop, payroll), kept separate. Each database holds TABLES, each with one kind of thing (students). A table's COLUMNS are the facts recorded about that thing (full_name, email, city), each with a type. Each ROW is one thing (one student). A single value sits where a row meets a column.",
        example:
          "server   PostgreSQL 18 on localhost:5432\n└─ database   academy\n   └─ table      students\n      ├─ columns  id | full_name | email | city\n      └─ row      1  | Ada Obi   | ada@example.com | Lagos",
        sqlDemo: {
          setup: ACADEMY,
          caption: "Ask the server which database you are in and which tables it holds. Then run a SELECT on one of the tables.",
          code: "SELECT current_database() AS database, version();\n\nSELECT table_name\nFROM information_schema.tables\nWHERE table_schema = 'public'\nORDER BY table_name;\n\nSELECT * FROM courses;",
        },
        decision: decide({
          scenario: "Your company runs one PostgreSQL server. It needs to keep the HR data and the online shop's data apart, each with its own tables, so that the shop's application can never see salaries.",
          question: "What is the usual structure?",
          right: ["Two databases on the same server, hr and shop, each with its own tables and users", "Databases are the unit of separation inside a server."],
          wrong: [
            ["One table containing both HR and shop rows", "One table holds one kind of thing; mixing them breaks every query and every permission."],
            ["Two columns in the same table", "Columns are facts about one thing, not separate collections."],
            ["Two rows", "A row is a single record."],
          ],
          at: 1,
          aftermath: "In Week 2 you create the academy database on your own server with CREATE DATABASE.",
        }),
      },
      {
        id: "a-db-postgres-sql",
        title: "PostgreSQL and SQL",
        explain:
          "POSTGRESQL is a free, open-source RDBMS first released in 1996, grown out of the POSTGRES project at the University of California, Berkeley. It is known for correctness, standards compliance and features (JSON, full-text search, window functions, extensions), and is used by companies of every size. SQL (Structured Query Language) is the language every RDBMS speaks: you describe WHAT you want, and the database works out HOW. SQL has statements for structure (CREATE TABLE, Weeks 2 and 5), for changing data (INSERT, UPDATE, DELETE, Week 6) and for asking questions (SELECT, Weeks 7 onwards). The core is standard, so most of what you learn works in MySQL too; Week 2 shows where they differ.",
        origin:
          "SQL was designed at IBM in the 1970s by Donald Chamberlin and Raymond Boyce, based on Edgar Codd's 1970 relational model, and became an ANSI and ISO standard in 1986–87. It is older than most programming languages still in use, and still the most widely used language for data.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "This query lists every course. Change it so it lists every row of the students table instead, then Run it and Check it. You only need to change one word.",
          starter: "SELECT * FROM courses;\n",
          solution: "SELECT * FROM students;\n",
          checks: [{ label: "It returns every student, with every column", result: true }],
          hint: "The word after FROM is the table being read. The academy's tables include students, courses and enrollments.",
          successMessage: "Your first real query. SELECT * FROM table reads every column of every row; Week 2 shows how to choose columns, and Week 7 how to choose rows.",
        },
      },
      {
        id: "a-db-app-communication",
        title: "How applications communicate with databases",
        explain:
          "A user never talks to the database directly. They use a FRONTEND (a website or mobile app), which sends requests over the internet to a BACKEND (a server program in Node.js, Python, PHP, Java…). The backend holds a connection to the database server and sends it SQL through a DRIVER (a library such as pg for Node.js). The database runs the SQL and returns rows; the backend turns them into a response, usually JSON, and the frontend displays it. Keeping the database behind the backend means its password and its full contents are never exposed to users' devices. Week 15 builds exactly this.",
        example:
          "Phone app  ──HTTPS──▶  Backend (Node.js)  ──SQL via driver──▶  PostgreSQL\n   ◀── JSON ─────────────────      ◀────────── rows ─────────────────",
        decision: decide({
          scenario: "A developer building a quiz app wants to save time by putting the database username and password inside the mobile app, so the app can send SQL straight to PostgreSQL.",
          question: "Why is this a bad idea?",
          right: ["Anyone who downloads the app can extract the password and then read or change everything in the database", "Code shipped to users' devices is public. The backend exists to keep database credentials and full access off those devices."],
          wrong: [
            ["Mobile apps cannot send SQL", "They could technically; that is precisely the danger."],
            ["It would make the app too large to install", "Size is not the issue; security is."],
            ["PostgreSQL only accepts connections from websites", "PostgreSQL accepts any client that can reach it and log in."],
          ],
          at: 3,
          aftermath: "Frontend → backend → database is the architecture behind nearly every app you use.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.14 – 1.18 · THE RELATIONAL MODEL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l4-relational-model",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.14", "1.15", "1.16", "1.17", "1.18"],
    title: "How Relational Databases Organize Data",
    subtitle: "Relations, records, attributes, domains and the relational model",
    estimatedMinutes: 32,
    intro:
      "The relational model is a small set of ideas that has organised the world's important data for fifty years. Learn its vocabulary now and every later week will make sense.",
    atoms: [
      {
        id: "a-db-relations-tables",
        title: "Relations and tables",
        explain:
          "In the relational model a RELATION is a set of records that all have the same attributes. In practice, a relation is a TABLE. Its name says what one row is (students: each row is a student), its columns are fixed and named, and the order of its rows carries no meaning: a table is a set, so to get a particular order you must ask for one (ORDER BY, Week 7). The word 'relational' comes from relations (tables), not from relationships between tables, although tables are linked too.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "The academy has a table that records each course's lessons. Read all of it: write a query that returns every column and every row of the lessons table.",
          starter: "-- Read the whole lessons table\n",
          solution: "SELECT * FROM lessons;\n",
          checks: [{ label: "It returns every lesson, with every column", result: true }],
          hint: "SELECT * FROM table_name; reads everything in a table. Open the Tables panel above the editor to see the table names.",
          successMessage: "Fifteen lessons, five courses. Notice course_id: it says which course each lesson belongs to, a link you will use constantly.",
        },
      },
      {
        id: "a-db-records-attributes",
        title: "Records and attributes",
        explain:
          "A RECORD (also called a row or tuple) holds the facts about ONE instance: one student, one payment. An ATTRIBUTE (a column or field) is one named fact that every record has: email, city, joined_on. Good attributes are single facts (one phone number, not three in one cell), describe the table's thing directly (a student's city belongs in students; a course's price belongs in courses), and have clear names. You can choose which attributes a query returns by naming them instead of using *.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Return only two attributes of every student: their full_name and their city, in that order.",
          starter: "SELECT * FROM students;\n",
          solution: "SELECT full_name, city FROM students;\n",
          checks: [{ label: "Every student, with exactly full_name then city", result: true }],
          hint: "Replace * with the column names you want, separated by a comma: SELECT column_one, column_two FROM students;",
          successMessage: "Naming the attributes you need is a habit professionals keep: it is clearer and faster than SELECT *.",
        },
      },
      {
        id: "a-db-domains-types",
        title: "Domains and data types",
        explain:
          "Every attribute has a DOMAIN: the set of values it may legally hold. A score's domain is whole numbers 0 to 100; a status's is 'active', 'completed' or 'dropped'; a joined_on date's is valid calendar dates. A database expresses domains with DATA TYPES (integer, numeric, text, date, boolean) plus constraints (CHECK score BETWEEN 0 AND 100). A spreadsheet cell will accept 'next week' in a date column; a date column in PostgreSQL will not. Try it: the example below asks PostgreSQL to treat text as a date.",
        sqlDemo: {
          caption: "The first value is a valid date, so PostgreSQL accepts it. Change '2026-01-15' to 'next week' or '2026-02-30' and Run again: the date type's domain rejects it.",
          code: "SELECT DATE '2026-01-15' AS valid_date,\n       DATE '2026-01-15' + 30 AS thirty_days_later;",
        },
        decision: decide({
          scenario: "In the academy's enrollments table, score is declared integer with CHECK (score BETWEEN 0 AND 100). A tutor tries to save a score of 104.",
          question: "What happens, and why?",
          right: ["PostgreSQL rejects it: 104 is outside the column's domain", "The type says whole number; the CHECK narrows the domain to 0–100."],
          wrong: [
            ["It is saved as 100", "Databases do not silently change your data to fit; they reject it."],
            ["It is saved, because 104 is an integer", "The type allows it, but the CHECK constraint does not."],
            ["It is saved as text", "A column has one type; values are never stored as a different one."],
          ],
          at: 1,
          aftermath: "Choosing types and constraints is a design decision you make in Weeks 2 and 4.",
        }),
      },
      {
        id: "a-db-relational-model",
        title: "The relational model and its ideas",
        explain:
          "Edgar F. Codd, a mathematician at IBM, published the relational model in 1970. Its core ideas: (1) all data is held in relations (tables) of rows and columns; (2) each row is identified by a KEY, values that are unique to it, never by its position; (3) tables are linked by storing one table's key in another (a FOREIGN KEY), not by pointers; (4) you ask for data by describing what you want (a declarative language, which became SQL), and the system finds it; (5) rules about the data (integrity constraints) belong in the database. Because programs ask for data by meaning rather than by location, the storage can change without breaking them.",
        origin:
          "Codd's paper 'A Relational Model of Data for Large Shared Data Banks' (1970) replaced databases navigated by pointers, which broke whenever their structure changed. He received the Turing Award for it in 1981.",
        decision: decide({
          scenario: "In an old system, a program found a customer's orders by following a disk address stored in the customer record. When the data was reorganised, every program broke.",
          question: "Which relational idea prevents this?",
          right: ["Rows are linked by key values (the order stores the customer's id), not by physical locations", "Keys are meaningful values the DBMS can look up however the data is stored."],
          wrong: [
            ["Tables have names", "Names help people, but links by location would still break."],
            ["Rows are stored in a fixed order", "The relational model says the opposite: row order carries no meaning."],
            ["Every value is text", "Values have many types; that is unrelated to how rows are linked."],
          ],
          at: 0,
          aftermath: "Keys and foreign keys are Week 3's subject.",
        }),
      },
      {
        id: "a-db-tables-real-world",
        title: "How tables represent a real-world system",
        explain:
          "A relational design gives each kind of THING its own table (students, courses, lessons) and each kind of RELATIONSHIP or EVENT its own table too (enrollments: a student joining a course on a date; payments: money received for an enrollment). A row in enrollments holds a student_id and a course_id, linking the two. Together, the tables are a model of how the academy works. The query below joins three tables to turn ids back into names: you will write queries like it in Week 9.",
        sqlDemo: {
          setup: ACADEMY,
          caption: "Each enrollment links one student to one course. This query follows those links to show names instead of numbers.",
          code: "SELECT s.full_name, c.title, e.enrolled_on, e.status\nFROM enrollments AS e\nJOIN students AS s ON s.id = e.student_id\nJOIN courses AS c ON c.id = e.course_id\nORDER BY e.enrolled_on\nLIMIT 8;",
        },
        decision: decide({
          scenario: "A hospital wants to record patients, doctors, and appointments (a patient seeing a doctor at a date and time).",
          question: "Which set of tables models this best?",
          right: ["patients, doctors, appointments (each appointment storing a patient_id and a doctor_id)", "Two things, plus one event linking them."],
          wrong: [
            ["One table, hospital, with every fact in its columns", "One table would repeat each patient and doctor on every appointment."],
            ["patients and doctors only, with the appointment times in the doctors table", "A doctor has many appointments; one row cannot hold them all."],
            ["appointments only, with patient and doctor details typed into each row", "Patient details would be repeated and drift apart."],
          ],
          at: 2,
          aftermath: "This 'things plus events' pattern is how you will approach every design in Week 3.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.P · PRACTICAL: THE MESSY REGISTRATION SHEET
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l5-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.P"],
    title: "Week 1 Practical: The Messy Registration Sheet",
    subtitle: "Find what a relational database should fix",
    estimatedMinutes: 40,
    intro:
      "A training centre has kept registrations in one spreadsheet for a year. It has been loaded, exactly as typed, into a single PostgreSQL table so you can inspect it. Your job is to find what goes wrong when everything lives in one sheet.",
    atoms: [
      {
        id: "a-db-p1-inspect",
        title: "Inspect the sheet",
        explain:
          "Run the query and read every row carefully, column by column. Look for: the same person entered twice; the same fact spelt differently; several values crammed into one cell; values that are not what the column claims (a 'date' that is not a date, an email with no domain); and facts about something other than the registration (the instructor's phone) repeated on every row.",
        sqlDemo: {
          setup: REGISTRATIONS,
          caption: "The registration sheet, one row per line as it was typed.",
          code: "SELECT * FROM registrations ORDER BY row_no;",
        },
        decision: decide({
          scenario: "Look at rows 1 and 3, and at Mr. Okafor's phone number on rows 1, 3 and 4.",
          question: "Which two problems do they show?",
          right: ["A duplicate person (Ada Obi entered twice with different spellings and emails) and an inconsistent repeated fact (Mr. Okafor's phone differs on row 4)", "Both come from typing the same facts in several places."],
          wrong: [
            ["Rows 1 and 3 are two different students who share a name", "Same phone number, same course, same instructor: almost certainly one person typed twice."],
            ["Nothing is wrong; spreadsheets allow this", "Allowed is not the same as correct; every report will now count Ada twice."],
            ["The phone numbers are fine because they are all valid numbers", "Two different numbers for one instructor means at least one is wrong, and nobody knows which."],
          ],
          at: 0,
          aftermath: "A database stores each student once (with a unique email) and each instructor once, so these cannot happen.",
        }),
      },
      {
        id: "a-db-p1-values",
        title: "Values that break their column",
        explain:
          "Spreadsheet columns have no real types or rules, so 'registered' holds 12/01/2026, 2026-01-15 and 'next week'; 'city' holds Lagos, lagos, LAGOS and P/H; fees_paid holds '50000; 55000' and an empty string; and 'courses' holds a comma-separated list. Every one of these breaks a report: you cannot sort the dates, count by city, add up fees, or find who takes SQL without picking text apart. Run the query to see PostgreSQL try to read the registered column as dates. Two things go wrong: it stops at row 3's 20/01/2026, which is not a valid month-first date, and, worse, it silently accepted row 1's 12/01/2026 as 1 December, not 12 January. Text dates are ambiguous; a real date column never is. Change the query to read only row 1 (add WHERE row_no = 1 before ORDER BY) to see it.",
        sqlDemo: {
          setup: REGISTRATIONS,
          caption: "Casting the text to dates. It fails on the first value that cannot be a month-first date.",
          code: "SELECT row_no, registered, registered::date AS as_a_date\nFROM registrations\nORDER BY row_no;",
          expectError: "date/time field value out of range",
        },
        decision: decide({
          scenario: "The manager asks: 'How many people registered for SQL, and how much did they pay in total?'",
          question: "Why is this hard to answer from the sheet?",
          right: ["Courses and fees are packed as lists inside single cells, so they must be split by hand, and the duplicate Ada would be counted twice", "One fact per cell, and one row per person per course, is what makes such questions one query."],
          wrong: [
            ["Because spreadsheets cannot add numbers", "They can; the numbers here are trapped inside text lists."],
            ["Because there are only six rows", "The problem is the shape, not the size; at 6,000 rows it is worse."],
            ["Because SQL cannot count", "SQL counts easily once the data has a proper shape."],
          ],
          at: 2,
          aftermath: "Week 4 calls this a First Normal Form violation and shows how to fix it.",
        }),
      },
      {
        id: "a-db-p1-entities",
        title: "Find the entities and attributes",
        explain:
          "A database design starts by asking: what THINGS does this sheet describe, and what is recorded about each? Here: STUDENTS (name, email, phone, city), COURSES (name, fee), INSTRUCTORS (name, phone), and REGISTRATIONS, the event that links a student to a course on a date with a payment. Each will become its own table, so each fact is stored once. You will draw this properly as an ERD in Week 3.",
        table: {
          caption: "The sheet's columns, sorted by what they describe.",
          headers: ["Entity", "Attributes found in the sheet"],
          rows: [
            ["Student", "student_name, email, phone, city"],
            ["Course", "course name (inside courses), fee (inside fees_paid)"],
            ["Instructor", "instructor, instructor_phone"],
            ["Registration (student + course)", "registered date, amount paid"],
          ],
        },
        decision: decide({
          scenario: "Someone suggests keeping one table but adding columns course1, course2, course3 and fee1, fee2, fee3 to fix the lists.",
          question: "What is the better design?",
          right: ["Separate students, courses and instructors tables, plus a registrations table with one row per student per course", "Each fact is stored once and any number of courses is possible."],
          wrong: [
            ["course1–course3 is fine: nobody takes more than three courses", "The day someone takes four, the design breaks, and every query must check three columns."],
            ["Add a fourth column, course4, to be safe", "Repeating groups of columns have the same problems at any size."],
            ["Keep the lists; they save space", "They make the data impossible to query, count or validate reliably."],
          ],
          at: 1,
          aftermath: "Spotting entities hidden in a flat sheet is the skill this week's checkpoint asks for.",
        }),
      },
    ],
    task: {
      title: "Week 1 practical: inspect the registration sheet",
      intro: "Use the registrations table above (and, if you have one, a real spreadsheet from your school, church or work).",
      prompts: [
        "List every problem you can find in the sheet: duplicates, inconsistent spellings, several values in one cell, values that are not what their column claims, and facts repeated on many rows. For each, write what report or decision it would break.",
        "For each problem, say which feature of a relational database would prevent it: a unique key, a data type, a constraint, or storing a fact once in its own table.",
        "Write down the entities (things and events) the sheet describes and the attributes that belong to each.",
        "Checkpoint: choose a business you know (a pharmacy, a school, a delivery service). In a few sentences, explain why it needs a database rather than a spreadsheet, and list its likely entities and their attributes.",
      ],
      closing: "Next: Week 2, installing PostgreSQL and MySQL on your own computer and writing your first tables.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
