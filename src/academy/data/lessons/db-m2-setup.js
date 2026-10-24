/**
 * RELATIONAL DATABASES · WEEK 2 · DATABASE SETUP AND BASIC SQL
 *
 * Curriculum 2.1 – 2.P. PostgreSQL 18 installed on Windows, macOS or Linux
 * (or run in Docker or the cloud), MySQL 8.4 LTS installed beside it, psql,
 * pgAdmin and the mysql client, connecting and storing passwords safely,
 * databases and schemas, CREATE TABLE and data types, INSERT and SELECT,
 * statement structure, errors and formatting, and the two databases side by
 * side. Every terminal replays a RECORDED session on real servers
 * (scripts/dbRecord.mjs); every lab runs on PostgreSQL 18 in the page.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { WEEK2_STUDENTS, decide, shown, shownAll, term } from "./db-helpers.js";

export const SECTION_ID = "db-s2-setup";
const MODULE = "db-m2-setup";

const PG_DATA = 'pg_ctl -D "C:\\Program Files\\PostgreSQL\\18\\data"';
const COLUMNS = (table) =>
  `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}' ORDER BY ordinal_position`;
const TYPES = (table) =>
  `SELECT column_name, format_type(atttypid, atttypmod) FROM information_schema.columns c JOIN pg_attribute a ON a.attrelid = '${table}'::regclass AND a.attname = c.column_name WHERE c.table_name = '${table}' ORDER BY ordinal_position`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.1 · INSTALLING POSTGRESQL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l6-install-postgres",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1"],
    title: "Installing PostgreSQL",
    subtitle: "Windows, macOS, Linux, Docker or the cloud, then proving it works",
    estimatedMinutes: 45,
    intro:
      "Today PostgreSQL goes onto your own computer. The labs in this course also run in the page, but a real installation is what you will use at work, and setting one up yourself takes the mystery out of every database you will ever connect to.",
    atoms: [
      {
        id: "a-db-pg-windows",
        title: "Installing PostgreSQL 18 on Windows",
        explain:
          "Go to postgresql.org, choose Download → Windows, and download the installer for PostgreSQL 18 (it is built by EDB). Run it and accept the defaults, paying attention to four screens: (1) Components: keep PostgreSQL Server, pgAdmin 4 and Command Line Tools; Stack Builder is optional. (2) Data directory: C:\\Program Files\\PostgreSQL\\18\\data, where the database files live. (3) Password: the password for the 'postgres' superuser. Choose a strong one and write it in your password manager; you will need it constantly. (4) Port: keep 5432. The installer creates a Windows service, so PostgreSQL starts with your computer. Finally, add C:\\Program Files\\PostgreSQL\\18\\bin to your PATH (Start → 'environment variables' → Path → New) so psql works in any terminal. Open a NEW PowerShell window and check.",
        why:
          "psql --version proves two things at once: the tools are installed, and your PATH finds them. 'psql is not recognized' almost always means the PATH step was missed or the terminal was opened before it.",
        terminalExercise: term("pg-setup", {
          only: ["psql --version", "pg_ctl --version"],
          goal: "Confirm that the PostgreSQL command-line client is installed and on your PATH, and which version it is.",
          accept: ["psql --version"],
          hint: "Every PostgreSQL tool answers --version. The client you will use most is psql.",
          success: "psql 18.6: installed and on the PATH. If yours says 'not recognized', fix the PATH and open a new terminal.",
        }),
      },
      {
        id: "a-db-pg-mac-linux",
        title: "Installing on macOS and Linux",
        explain:
          "On macOS the simplest option is Postgres.app (postgresapp.com): drag it to Applications, open it, press Initialize, then add its bin folder to your PATH as its instructions show. With Homebrew: brew install postgresql@18, then brew services start postgresql@18. On Ubuntu or Debian, use the PostgreSQL project's own repository so you get version 18: sudo apt install -y postgresql-common, then sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh, then sudo apt install -y postgresql-18. The service starts automatically. Linux creates an operating-system user called postgres; connect first with sudo -u postgres psql and set a password with \\password postgres.",
        example:
          "# macOS (Homebrew)\nbrew install postgresql@18\nbrew services start postgresql@18\n\n# Ubuntu / Debian\nsudo apt install -y postgresql-common\nsudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh\nsudo apt install -y postgresql-18\nsudo -u postgres psql",
        decision: decide({
          scenario: "On Ubuntu, a learner installs PostgreSQL, types psql, and gets: FATAL: role \"amaka\" does not exist.",
          question: "What is happening, and what should she do?",
          right: ["psql tried to log in as a database role named after her Linux user, which does not exist; connect as postgres with sudo -u postgres psql", "On Linux, psql defaults to a role with your operating-system user name, and only the postgres role exists after installation."],
          wrong: [
            ["The installation failed; reinstall PostgreSQL", "The server answered, so it is running fine. The message is about the login role."],
            ["She must create a Linux user called postgres", "The installer already created it; she needs to use it."],
            ["PostgreSQL does not run on Ubuntu", "Ubuntu is one of PostgreSQL's most common platforms."],
          ],
          at: 1,
          aftermath: "'role does not exist' and 'database does not exist' are the two errors every new installation shows once. Both mean the server is working.",
        }),
      },
      {
        id: "a-db-pg-docker-cloud",
        title: "Other ways to access PostgreSQL: Docker and the cloud",
        explain:
          "If you cannot install software, or want a throwaway server, there are two alternatives. DOCKER runs PostgreSQL in a container: docker run --name pg18 -e POSTGRES_PASSWORD=choose-a-password -p 5432:5432 -d postgres:18 gives you a server on port 5432 in seconds (Docker Desktop must be installed). MANAGED CLOUD services (Neon, Supabase, Amazon RDS, Azure, Google Cloud SQL) run PostgreSQL for you; they give you a connection string such as postgresql://user:password@host:5432/dbname?sslmode=require. They are how most production databases are run today, but a local installation is best for learning: it is free, fast, and you can break it.",
        example:
          "docker run --name pg18 -e POSTGRES_PASSWORD=choose-a-password -p 5432:5432 -d postgres:18\ndocker exec -it pg18 psql -U postgres",
        decision: decide({
          scenario: "A learner's work laptop does not allow installing software, but Docker Desktop is already approved. She already has another program listening on port 5432.",
          question: "What is the sensible way to run PostgreSQL?",
          right: ["Run the postgres:18 container and map a different host port, for example -p 5433:5432, then connect to port 5433", "The container still listens on 5432 inside; the host side can be any free port."],
          wrong: [
            ["She cannot use PostgreSQL at all", "Docker is a standard, supported way to run it."],
            ["Stop the other program permanently so PostgreSQL can have 5432", "There is no need: any free port works."],
            ["Use port 3306 inside the container", "PostgreSQL inside the official image listens on 5432; 3306 is MySQL's default."],
          ],
          at: 2,
          aftermath: "Port, host, database, user and password: whatever the setup, these five things are how you connect.",
        }),
      },
      {
        id: "a-db-pg-server-running",
        title: "What the installer did: initdb, the service, and pg_isready",
        explain:
          "Behind the installer's screens, two things happened, and it helps to see them. initdb created a DATABASE CLUSTER: the data directory holding the system catalogs, the template databases and a 'postgres' database, owned by the superuser you named, with password authentication (scram-sha-256). Then the server was started; the installer makes it a Windows service, and pg_ctl is the manual way. pg_isready is the quickest health check: it asks the server whether it is accepting connections. Below is a real run of all three, with the folder the Windows installer uses.",
        example: shownAll("pg-setup", [
          'initdb -D "C:\\Program Files\\PostgreSQL\\18\\data" -U postgres -A scram-sha-256 -E UTF8 --pwfile=pg-password.txt',
          `${PG_DATA} -l server.log start`,
        ]),
        terminalExercise: term("pg-setup", {
          only: [`${PG_DATA} status`, "pg_isready"],
          goal: "Check, in the quickest way, whether the PostgreSQL server is accepting connections.",
          accept: ["pg_isready"],
          near: [{ command: `${PG_DATA} status`, why: "That tells you the server process is running. The tool made for 'can clients connect right now?' is shorter: try it." }],
          hint: "There is a PostgreSQL tool whose whole job is to answer 'is the server ready?'.",
          success: "accepting connections on port 5432. When an application cannot connect, this is the first thing to run.",
        }),
      },
      {
        id: "a-db-pg-first-connection",
        title: "Your first connection, and a password file",
        explain:
          "psql -U postgres connects as the superuser. When you type it, psql asks for the password. To avoid typing it every time on your OWN computer, PostgreSQL reads a password file: on Windows %APPDATA%\\postgresql\\pgpass.conf, on macOS and Linux ~/.pgpass (which must be chmod 600). Each line is host:port:database:user:password, for example localhost:5432:*:postgres:your-password. The first command below was run with -w (never prompt) before the file existed: the server refused, because no password was supplied. After the file was created, the same connection works. Never keep a password file on a shared computer.",
        example: shown("pg-setup", 'psql -U postgres -w -c "SELECT version();"'),
        terminalExercise: term("pg-setup", {
          only: ['psql -U postgres -c "SELECT version();"', "psql -U postgres -l", 'psql -U postgres -c "SHOW port;" -c "SHOW data_directory;"', 'psql -U postgres -d academy -c "SELECT 1;"'],
          goal: "Connect as postgres and ask the server for its full version string, with SQL.",
          accept: ['psql -U postgres -c "SELECT version();"'],
          near: [{ command: 'psql -U postgres -d academy -c "SELECT 1;"', why: "That fails: there is no academy database yet (you create it in Lesson 8). It still proves the server and the password work." }],
          hint: "psql -c runs one SQL statement and exits. SELECT version(); returns the server's version.",
          success: "PostgreSQL 18.6, 64-bit. You are connected to your own database server.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.2 · INSTALLING MYSQL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l7-install-mysql",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.2"],
    title: "Installing MySQL",
    subtitle: "MySQL 8.4 LTS beside PostgreSQL, and the mysql client",
    estimatedMinutes: 40,
    intro:
      "MySQL is the other open-source database you will meet everywhere: WordPress, Laravel and countless company systems run on it. Installing it next to PostgreSQL lets you see, from your first week, what is the same in every relational database and what is not.",
    atoms: [
      {
        id: "a-db-my-install",
        title: "Installing MySQL 8.4 LTS",
        explain:
          "Use the Long-Term Support release, MySQL 8.4. On Windows: from dev.mysql.com/downloads choose MySQL Community Server 8.4 and download the MSI installer. Accept the defaults: Development Computer, port 3306, strong password encryption, a root password (store it in your password manager), and run as a Windows service named MySQL84. Optionally install MySQL Workbench, the graphical tool. Add C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin to your PATH. On macOS: the DMG from the same page, or brew install mysql@8.4 and brew services start mysql@8.4. On Ubuntu: sudo apt install mysql-server, then sudo mysql_secure_installation. With Docker: docker run --name mysql84 -e MYSQL_ROOT_PASSWORD=choose-a-password -p 3306:3306 -d mysql:8.4. MySQL and PostgreSQL run happily side by side because they use different ports.",
        terminalExercise: term("mysql-setup", {
          only: ["mysqld --version", "mysql --version"],
          goal: "Check that the MySQL command-line CLIENT is installed and on your PATH.",
          accept: ["mysql --version"],
          near: [{ command: "mysqld --version", why: "mysqld is the SERVER program. The client you type SQL into is mysql." }],
          hint: "The server is mysqld (d for daemon); the client is mysql.",
          success: "mysql Ver 8.4.13: the client is installed. Like psql, it is how you talk to the server from a terminal.",
        }),
      },
      {
        id: "a-db-my-root",
        title: "The root account and its password",
        explain:
          "MySQL's superuser is root@localhost. The MSI installer asks for its password. If you install from the ZIP archive instead, you create the data folder yourself with mysqld --initialize-insecure, which makes root with an EMPTY password and warns you about it, as the real run below shows. The first thing to do is set a password with ALTER USER. Notice what happens next: connecting without a password is refused (Access denied … using password: NO), and putting the password on the command line works but prints a warning, because anyone who can see your command history or process list can read it.",
        example: shownAll("mysql-setup", [
          "mysqld --initialize-insecure --console",
          `mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'MySQL-dev-2026';"`,
          'mysql -u root -e "SELECT 1;"',
          'mysql -u root -p"MySQL-dev-2026" -e "SELECT 1;"',
        ]),
        decision: decide({
          scenario: "A colleague's deployment script runs mysql -u root -pSuperSecret123 -e \"…\" on a shared server every night.",
          question: "What is the problem, and the better approach?",
          right: ["The password is visible in the process list and shell history; use an option file readable only by that user (or mysql_config_editor), and a less powerful account than root", "MySQL's own warning says so. Credentials belong in protected files, and scripts should not run as root."],
          wrong: [
            ["Nothing; the warning is only cosmetic", "The warning describes a real exposure on a shared machine."],
            ["Use -p without the password so it prompts", "A nightly script has nobody to type the password."],
            ["Put the password in the script's file name", "That exposes it even more widely."],
          ],
          at: 0,
          aftermath: "Week 14 returns to credentials: where they live, who can read them, and least privilege.",
        }),
      },
      {
        id: "a-db-my-option-file",
        title: "Logging in without typing the password: option files",
        explain:
          "MySQL clients read OPTION FILES. On Windows the installer's my.ini (and on macOS or Linux ~/.my.cnf, with chmod 600) can hold a [client] section: user=root and password=… on separate lines. Then mysql with no options logs you in. my_print_defaults client shows what the client will read (the password is hidden below). This is fine on your own development machine; never on a shared one. In the recorded run below the [client] section was added after the password was set, and plain mysql connected.",
        example: shown("mysql-setup", "my_print_defaults client"),
        terminalExercise: term("mysql-setup", {
          only: ['mysql -e "SELECT CURRENT_USER(), VERSION();"', "mysqladmin status", "my_print_defaults client"],
          goal: "Using the option file's login, ask the server which account you are connected as and which version it runs.",
          accept: ['mysql -e "SELECT CURRENT_USER(), VERSION();"'],
          near: [{ command: "mysqladmin status", why: "That proves the server is up (uptime, threads, queries), but does not say who you are. Ask with SQL." }],
          hint: "CURRENT_USER() and VERSION() are MySQL functions; mysql -e runs SQL and exits.",
          success: "root@localhost on 8.4.13, with no password typed. You now have two database servers on your computer.",
        }),
      },
      {
        id: "a-db-my-client",
        title: "The mysql client and MySQL Workbench",
        explain:
          "Type mysql (or mysql -u root -p) to open the interactive client. The prompt is mysql>. Statements end with a semicolon; the client answers with a table, or with 'Query OK, n rows affected (time)'. SHOW DATABASES; lists databases, CREATE DATABASE academy; creates one, USE academy; makes it current, and exit leaves. MySQL Workbench is the graphical equivalent of pgAdmin: a connection list, a schema browser and a SQL editor. A fresh server already holds four system databases: information_schema, mysql, performance_schema and sys. Leave them alone.",
        example: shownAll("mysql-server", ["SHOW DATABASES;", "CREATE DATABASE academy;"]),
        terminalExercise: term("mysql-basics", {
          goal: "At the mysql> prompt, confirm that the academy database now exists.",
          accept: ["SHOW DATABASES;"],
          hint: "MySQL has a SHOW command for listing databases.",
          success: "academy is listed beside the four system databases.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.3 – 2.4 · TOOLS, CONNECTIONS, DATABASES AND SCHEMAS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l8-tools-connect",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.3", "2.4"],
    title: "PostgreSQL Tools, Databases and Schemas",
    subtitle: "psql, pgAdmin, connection details, CREATE DATABASE and schemas",
    estimatedMinutes: 40,
    intro:
      "Every connection to any database needs the same five things. Once you know them, psql, pgAdmin, VS Code extensions and application code all become the same task.",
    atoms: [
      {
        id: "a-db-connection-details",
        title: "Connecting to a server: the five details",
        explain:
          "To connect you need: HOST (the server's address: localhost for your own computer), PORT (5432 for PostgreSQL, 3306 for MySQL), DATABASE (which database on that server), USER (a role the server knows), and PASSWORD. psql takes them as -h, -p, -d and -U (the password comes from a prompt or the password file). Applications usually take them as one CONNECTION STRING: postgresql://user:password@host:5432/database. When a connection fails, the error says which detail is wrong: 'database \"academy\" does not exist' means the server and password were fine, but that database was not.",
        example: shown("pg-setup", 'psql -U postgres -d academy -c "SELECT 1;"'),
        decision: decide({
          scenario: "An application's settings are host=localhost, port=5432, database=shop, user=shop_app. It fails with: connection to server at \"localhost\" (::1), port 5432 failed: FATAL: password authentication failed for user \"shop_app\".",
          question: "What does the error tell you?",
          right: ["The server was reached on the right port; the password for shop_app is wrong (or the role has no password set)", "A FATAL authentication error comes from a running server, so host and port are fine."],
          wrong: [
            ["The server is not running", "A stopped server gives 'connection refused', not an authentication failure."],
            ["The database shop does not exist", "That would say 'database \"shop\" does not exist'."],
            ["Port 5432 is wrong", "The server answered on 5432."],
          ],
          at: 2,
          aftermath: "Read connection errors word by word: each one names the detail that failed.",
        }),
      },
      {
        id: "a-db-psql",
        title: "psql: the PostgreSQL command line",
        explain:
          "psql is PostgreSQL's interactive terminal. Its prompt shows the current database: postgres=# (the # means you are a superuser; ordinary roles see =>). You type SQL ending with a semicolon, or META-COMMANDS starting with a backslash, which psql answers itself: \\l lists databases, \\c academy connects to another database, \\dt lists tables, \\d students describes a table, \\dn lists schemas, \\du lists roles, \\conninfo shows the connection, \\? lists every meta-command and \\q quits. Meta-commands are psql's, not SQL, so they do not work in pgAdmin or in an application.",
        example: shown("psql-server", "\\conninfo"),
        terminalExercise: term("psql-academy", {
          only: ["\\conninfo", "\\dn", "\\dt", "\\d students"],
          goal: "In the academy database, describe the students table: its columns, their types, which may be empty, defaults, and indexes.",
          accept: ["\\d students"],
          near: [{ command: "\\dt", why: "\\dt lists the tables. To DESCRIBE one table, give \\d its name." }],
          hint: "\\d followed by a table name describes that table.",
          success: "Every column with its type, NOT NULL, defaults, and the two indexes PostgreSQL made for the primary key and the UNIQUE email.",
        }),
      },
      {
        id: "a-db-pgadmin",
        title: "pgAdmin: the graphical tool",
        explain:
          "pgAdmin 4 is installed with PostgreSQL on Windows (and available for macOS and Linux). Open it, set a master password (it protects the passwords pgAdmin stores), then Servers → Register → Server: give it a name, and on the Connection tab enter host localhost, port 5432, maintenance database postgres, user postgres and your password. The tree on the left shows Databases → academy → Schemas → public → Tables. Tools → Query Tool opens a SQL editor whose results appear in a grid. pgAdmin is excellent for browsing and for seeing a table's definition; psql is faster for typing and is available on every server, including ones you reach over SSH. Learn both.",
        decision: decide({
          scenario: "You are connected to a production server over SSH with only a terminal. You need to see the columns of the orders table.",
          question: "Which tool and command?",
          right: ["psql, then \\d orders", "psql is installed wherever PostgreSQL is, and works in any terminal."],
          wrong: [
            ["pgAdmin's tree view", "pgAdmin is a graphical program; you have only a terminal."],
            ["Run \\d orders from your application code", "Meta-commands are psql's own and are not SQL."],
            ["Open the data directory and read the files", "Data files are binary and private to the server."],
          ],
          at: 0,
          aftermath: "A graphical tool when you have one, psql always: that is how most professionals work.",
        }),
      },
      {
        id: "a-db-create-database",
        title: "Creating a database",
        explain:
          "One server holds many databases; create one per application or project. CREATE DATABASE academy; makes a new, empty database (copied from the template1 database). Database names are lowercase with underscores by convention. A connection is always to ONE database: in psql, \\c academy switches to it, and the prompt changes to academy=#. You cannot query another database's tables from the current one, which is exactly the separation databases exist for. Below, the database is created, listed, and connected to.",
        example: shownAll("psql-server", ["CREATE DATABASE academy;", "\\c academy"]),
        terminalExercise: term("psql-server", {
          only: ["\\l", "\\conninfo"],
          goal: "After CREATE DATABASE academy;, list every database on the server to confirm it is there and see its owner and encoding.",
          accept: ["\\l"],
          hint: "The psql meta-command for listing databases is one letter.",
          success: "academy, owned by postgres, encoding UTF8, beside postgres and the two templates.",
        }),
      },
      {
        id: "a-db-schemas",
        title: "Schemas: folders inside a database",
        explain:
          "A SCHEMA is a named container for tables (and other objects) INSIDE a database, like folders on a disk. Every new database has a schema called public, and tables go there unless you say otherwise. CREATE SCHEMA reporting; creates another, and reporting.daily_signups names a table inside it. When you write a table name without a schema, PostgreSQL looks along the search_path (\"$user\", public by default). Schemas separate parts of one application (sales, hr, reporting) and make permissions easier: a reporting role can be given one schema and nothing else (Week 14). MySQL uses the word schema to mean a database: in MySQL, CREATE SCHEMA and CREATE DATABASE are the same command.",
        sqlLab: {
          task:
            "Create a schema called reporting, then, inside it, a table called daily_signups with two columns: day (date) and signups (integer).",
          starter: "-- 1. Create the schema\n\n-- 2. Create reporting.daily_signups\n",
          solution: "CREATE SCHEMA reporting;\n\nCREATE TABLE reporting.daily_signups (\n  day     date,\n  signups integer\n);\n",
          checks: [
            { label: "The reporting schema exists", assert: "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'reporting')" },
            { label: "daily_signups is inside reporting, not public", assert: "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'reporting' AND table_name = 'daily_signups') AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_signups')" },
            { label: "It has day (date) then signups (integer)", query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'reporting' AND table_name = 'daily_signups' ORDER BY ordinal_position", ordered: true },
          ],
          hint: "Create the schema first. Then write CREATE TABLE reporting.daily_signups (...) with the schema name and a dot in front of the table name.",
          successMessage: "A table in its own schema. Open the Tables panel: it is listed as reporting.daily_signups.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.5 – 2.6 · CREATE TABLE AND DATA TYPES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l9-create-table",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.5", "2.6"],
    title: "Creating Tables and Choosing Data Types",
    subtitle: "CREATE TABLE, INTEGER, NUMERIC, TEXT, BOOLEAN, dates and times",
    estimatedMinutes: 45,
    intro:
      "A table's definition is a promise about every row it will ever hold. Choosing the right type for each column is the cheapest data-quality decision you will ever make.",
    atoms: [
      {
        id: "a-db-create-table",
        title: "CREATE TABLE",
        explain:
          "CREATE TABLE name ( column type, column type, … ); defines a table. Each column has a name and a data type, and may carry options: NOT NULL (a value is required), DEFAULT (the value used when none is given), UNIQUE, and PRIMARY KEY. The commonest pattern for an id is: id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, which numbers rows 1, 2, 3… automatically (Week 5 explains it fully). Names are lowercase with underscores (full_name, not FullName). Below is the students table recorded in psql, and \\d showing what PostgreSQL made of it.",
        example: shownAll("psql-academy", [
          "CREATE TABLE students (\n  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name       text NOT NULL,\n  email           text NOT NULL UNIQUE,\n  enrolled_on     date NOT NULL DEFAULT current_date,\n  course_interest text\n);",
          "\\d students",
        ]),
        sqlLab: {
          task:
            "Create a table called courses with four columns, in this order: id (integer, generated always as identity, primary key), title (text, required), category (text, optional), and duration_weeks (integer, required).",
          starter: "CREATE TABLE courses (\n  \n);\n",
          solution: "CREATE TABLE courses (\n  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title          text NOT NULL,\n  category       text,\n  duration_weeks integer NOT NULL\n);\n",
          checks: [
            { label: "courses has id, title, category, duration_weeks, with the right types and NOT NULLs", query: COLUMNS("courses"), ordered: true },
            { label: "id is filled in automatically", accepts: "INSERT INTO courses (title, duration_weeks) VALUES ('SQL', 16)" },
            { label: "id is the primary key", assert: "SELECT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'courses' AND constraint_type = 'PRIMARY KEY')" },
            { label: "A course must have a title", rejects: "INSERT INTO courses (duration_weeks) VALUES (12)", code: "23502" },
          ],
          hint: "Columns are separated by commas, with no comma after the last one. Required means NOT NULL.",
          successMessage: "PostgreSQL now refuses a course with no title, and numbers every course itself.",
        },
      },
      {
        id: "a-db-types-numbers",
        title: "Numbers: INTEGER, NUMERIC and why not floating point for money",
        explain:
          "INTEGER (int, 4 bytes) holds whole numbers up to about ±2.1 billion; BIGINT goes to about 9.2 quintillion, for ids that may exceed that; SMALLINT is for small ranges. NUMERIC(precision, scale) stores EXACT decimals: numeric(10,2) holds up to 10 digits, 2 after the point, which is right for money and scores with decimals. REAL and DOUBLE PRECISION are binary floating point: fast and fine for measurements, but they cannot represent most decimal fractions exactly. Run the example: 0.1 + 0.2 is not exactly 0.3 in floating point. Money in a float is a bug waiting for an auditor.",
        sqlDemo: {
          caption: "The same sum in floating point and in NUMERIC. Then see what numeric(10,2) does with too many decimals.",
          code: "SELECT 0.1::double precision + 0.2::double precision AS float_sum,\n       0.1::numeric + 0.2::numeric                   AS numeric_sum,\n       (0.1::double precision + 0.2 = 0.3)           AS float_equal,\n       1234.567::numeric(10,2)                       AS rounded_to_2dp;",
        },
        sqlLab: {
          task:
            "Create a table fees with: course_code (text, required), amount (exact money with 2 decimal places, up to 10 digits in total, required), and installments (whole number, required).",
          starter: "CREATE TABLE fees (\n  \n);\n",
          solution: "CREATE TABLE fees (\n  course_code  text NOT NULL,\n  amount       numeric(10,2) NOT NULL,\n  installments integer NOT NULL\n);\n",
          checks: [
            { label: "Columns course_code, amount, installments with the right types", query: TYPES("fees"), ordered: true },
            { label: "All three are required", assert: "SELECT bool_and(is_nullable = 'NO') FROM information_schema.columns WHERE table_name = 'fees'" },
            { label: "Amounts keep exactly 2 decimals", assert: "WITH x AS (INSERT INTO fees VALUES ('DB-101', 55000.456, 2) RETURNING amount) SELECT amount = 55000.46 FROM x" },
          ],
          hint: "Exact money is numeric(10,2): 10 digits in total, 2 after the decimal point.",
          successMessage: "numeric(10,2) rounds 55000.456 to 55000.46 and will never drift like a float.",
        },
      },
      {
        id: "a-db-types-text-bool",
        title: "Text and BOOLEAN",
        explain:
          "TEXT holds strings of any length and is PostgreSQL's usual choice. VARCHAR(n) holds up to n characters and rejects longer ones: use it when a limit is a real rule (a 3-letter currency code: char(3) or varchar(3)), not as a guess about lengths. In MySQL, VARCHAR(n) is the norm and TEXT behaves differently, so MySQL schemas say VARCHAR(255) a lot. BOOLEAN holds true, false or NULL (unknown); psql displays them as t and f. Never store yes/no as 'Y', 'yes', 1 and 'true' mixed in a text column.",
        sqlDemo: {
          caption: "A varchar(3) column refuses a 4-character code; a boolean column accepts true and 'yes' (PostgreSQL understands both) but not 'maybe'.",
          code: "CREATE TABLE currencies (code varchar(3), is_active boolean);\nINSERT INTO currencies VALUES ('NGN', true), ('USD', 'yes');\nSELECT * FROM currencies;\nINSERT INTO currencies VALUES ('NAIRA', true);",
          expectError: "value too long for type character varying(3)",
        },
        sqlLab: {
          task:
            "Create a table instructors with: full_name (text, required), staff_code (at most 6 characters, required), and is_full_time (true/false, required).",
          starter: "CREATE TABLE instructors (\n  \n);\n",
          solution: "CREATE TABLE instructors (\n  full_name    text NOT NULL,\n  staff_code   varchar(6) NOT NULL,\n  is_full_time boolean NOT NULL\n);\n",
          checks: [
            { label: "full_name text, staff_code varchar(6), is_full_time boolean", query: TYPES("instructors"), ordered: true },
            { label: "A 7-character staff code is refused", rejects: "INSERT INTO instructors VALUES ('Ada Obi', 'MST1234', true)", code: "22001" },
            { label: "A valid instructor is accepted", accepts: "INSERT INTO instructors VALUES ('Ada Obi', 'MST123', false)" },
          ],
          hint: "At most 6 characters is varchar(6). A true/false column is boolean.",
          successMessage: "The database now enforces the staff-code rule for every program that will ever write to this table.",
        },
      },
      {
        id: "a-db-types-dates",
        title: "Dates, times, timestamps and intervals",
        explain:
          "DATE is a calendar day (2026-01-12). TIME is a time of day. TIMESTAMP is a date and time with no time zone; TIMESTAMPTZ (timestamp with time zone) stores an exact moment and shows it in the session's time zone: use it for 'when did this happen', like a payment or a login. INTERVAL is a length of time ('30 days', '2 hours'). Always write dates as 'YYYY-MM-DD' (ISO 8601): '12/01/2026' means different days in different countries, as Week 1 showed. current_date and now() give today and this moment. Dates support arithmetic: a date plus 30 is 30 days later; one date minus another is a number of days.",
        sqlDemo: {
          caption: "Date arithmetic, an interval, and a timestamptz shown in UTC (these labs run in UTC; your own server uses your time zone, Africa/Lagos in Nigeria).",
          code: "SELECT DATE '2026-01-12' + 30                    AS plus_30_days,\n       DATE '2026-06-30' - DATE '2026-01-12'     AS days_between,\n       TIMESTAMPTZ '2026-01-12 09:30:00+01'      AS paid_at,\n       INTERVAL '16 weeks'                       AS course_length;",
        },
        sqlLab: {
          task:
            "Create a table sessions for live classes with: title (text, required), held_on (a calendar date, required), starts_at (an exact moment with time zone, required), and length (a length of time, required, default 1 hour).",
          starter: "CREATE TABLE sessions (\n  \n);\n",
          solution: "CREATE TABLE sessions (\n  title     text NOT NULL,\n  held_on   date NOT NULL,\n  starts_at timestamptz NOT NULL,\n  length    interval NOT NULL DEFAULT '1 hour'\n);\n",
          checks: [
            { label: "title text, held_on date, starts_at timestamptz, length interval", query: TYPES("sessions"), ordered: true },
            { label: "length defaults to 1 hour", assert: "WITH x AS (INSERT INTO sessions (title, held_on, starts_at) VALUES ('Joins', '2026-03-01', '2026-03-01 18:00+01') RETURNING length) SELECT length = interval '1 hour' FROM x" },
            { label: "An impossible date is refused", rejects: "INSERT INTO sessions VALUES ('X', '2026-02-30', now(), '1 hour')" },
          ],
          hint: "An exact moment with time zone is timestamptz. A length of time is interval. A default is written DEFAULT '1 hour'.",
          successMessage: "Each column now accepts only its own kind of value. 30 February is rejected without a single line of application code.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 2.7 – 2.9 · INSERT AND SELECT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l10-insert-select",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.7", "2.8", "2.9"],
    title: "Inserting and Reading Records",
    subtitle: "INSERT, SELECT, choosing columns and aliases",
    estimatedMinutes: 40,
    intro:
      "A table is only a promise until it holds rows. Two statements do most of the everyday work: INSERT puts records in, SELECT reads them out.",
    atoms: [
      {
        id: "a-db-insert",
        title: "INSERT: adding records",
        explain:
          "INSERT INTO students (full_name, email, enrolled_on, course_interest) VALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'); adds one row. Always LIST THE COLUMNS: the values then match by name, the statement survives a column being added later, and columns you leave out get their DEFAULT (or NULL). Text and dates go in single quotes; numbers and true/false do not. Several rows can be inserted at once by separating value lists with commas. psql answers INSERT 0 2: the 2 is the number of rows inserted (the 0 is historical).",
        example: shown(
          "psql-academy",
          "INSERT INTO students (full_name, email, enrolled_on, course_interest)\nVALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'),\n       ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03', 'Web Development');"
        ),
        sqlLab: {
          setup: WEEK2_STUDENTS,
          task:
            "The students table already holds three students. Add two more in one INSERT: Dayo Bello, dayo@example.com, enrolled 2026-03-01, interested in Python; and Efe Okoro, efe@example.com, enrolled 2026-03-15, interested in Cybersecurity. List the columns.",
          starter: "INSERT INTO students (full_name, email, enrolled_on, course_interest)\nVALUES ",
          solution: "INSERT INTO students (full_name, email, enrolled_on, course_interest)\nVALUES ('Dayo Bello', 'dayo@example.com', '2026-03-01', 'Python'),\n       ('Efe Okoro', 'efe@example.com', '2026-03-15', 'Cybersecurity');\n",
          checks: [
            { label: "Both students are stored exactly as given", query: "SELECT id, full_name, email, enrolled_on, course_interest FROM students ORDER BY id", ordered: true },
            { label: "The columns are named in the INSERT", source: "INSERT\\s+INTO\\s+students\\s*\\(" },
          ],
          hint: "Each row is a bracketed list of values in the same order as the column list; rows are separated by commas and the statement ends with a semicolon.",
          successMessage: "Five students. Notice you never typed an id: PostgreSQL gave them 4 and 5.",
        },
      },
      {
        id: "a-db-insert-defaults",
        title: "Defaults and leaving columns out",
        explain:
          "When you leave a column out of an INSERT, PostgreSQL uses its DEFAULT if it has one, and NULL otherwise. enrolled_on has DEFAULT current_date, so a student inserted without a date is enrolled today. A NOT NULL column with no default cannot be left out: PostgreSQL refuses the row and names the column. You can also write DEFAULT explicitly in the VALUES list. An identity column is never typed at all.",
        sqlLab: {
          setup: WEEK2_STUDENTS,
          task:
            "Insert one student, Fatima Musa, fatima@example.com, with NO course interest and letting enrolled_on take its default. Name only the columns you are giving values for.",
          starter: "",
          solution: "INSERT INTO students (full_name, email)\nVALUES ('Fatima Musa', 'fatima@example.com');\n",
          checks: [
            { label: "Fatima is stored, with no course interest", assert: "SELECT EXISTS (SELECT 1 FROM students WHERE full_name = 'Fatima Musa' AND email = 'fatima@example.com' AND course_interest IS NULL)" },
            { label: "Her enrolled_on came from the default (today)", assert: "SELECT enrolled_on = current_date FROM students WHERE email = 'fatima@example.com'" },
            { label: "Only one row was added", assert: "SELECT count(*) = 4 FROM students" },
          ],
          hint: "INSERT INTO students (full_name, email) VALUES (…, …); — leave out every column you want the database to fill.",
          successMessage: "Fatima got today's date from the DEFAULT and NULL for her interest. The database filled the gaps by the rules in the table's definition.",
        },
      },
      {
        id: "a-db-select",
        title: "SELECT: reading records",
        explain:
          "SELECT … FROM table reads rows. SELECT * returns every column, in the table's order, which is handy for a quick look. Without a WHERE clause (Week 7) you get every row; without ORDER BY the order is whatever the database finds convenient. psql prints the rows as a table and ends with (n rows). Nothing is changed by a SELECT, so you can run it as often as you like.",
        example: shown("psql-academy", "SELECT * FROM students;"),
        sqlLab: {
          setup: WEEK2_STUDENTS,
          task: "Read every column of every student.",
          starter: "",
          solution: "SELECT * FROM students;\n",
          checks: [{ label: "Every student, every column", result: true }],
          hint: "SELECT, an asterisk, FROM and the table name.",
          successMessage: "Three students, five columns, and Chiamaka's course_interest is NULL: shown here as NULL, and as an empty cell in psql.",
        },
      },
      {
        id: "a-db-select-columns",
        title: "Choosing columns and naming them with aliases",
        explain:
          "List the columns you need, in the order you want: SELECT full_name, email FROM students. An ALIAS renames a column in the result: SELECT full_name AS student. Aliases do not change the table, only the heading of this result. Use them to make results readable, and whenever a column is calculated. An alias with spaces or capitals must be in double quotes (AS \"Enrolled on\"); single quotes are for values, double quotes are for names.",
        example: shown("psql-academy", "SELECT full_name AS student, enrolled_on FROM students;"),
        sqlLab: {
          setup: WEEK2_STUDENTS,
          task:
            "Return, for every student, their email under the heading contact and their enrolled_on under the heading \"Enrolled on\" (with the capital E and the space), in that order.",
          starter: "SELECT\nFROM students;\n",
          solution: "SELECT email AS contact,\n       enrolled_on AS \"Enrolled on\"\nFROM students;\n",
          checks: [{ label: "Two columns, headed contact and Enrolled on", result: { names: true } }],
          hint: "SELECT email AS contact, enrolled_on AS \"Enrolled on\" — double quotes keep the capital and the space.",
          successMessage: "The table is unchanged; only this result's headings are. Aliases matter most once you calculate columns in Week 7.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 2.10 – 2.12 · STRUCTURE, ERRORS, STYLE, AND MYSQL
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l11-sql-style",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["2.10", "2.11", "2.12"],
    title: "SQL Structure, Errors, Style, and MySQL Side by Side",
    subtitle: "Reading errors, writing readable SQL, and what changes in MySQL",
    estimatedMinutes: 45,
    intro:
      "Every beginner's SQL fails, often. The skill is not avoiding errors but reading them: PostgreSQL tells you exactly what it did not understand and where.",
    atoms: [
      {
        id: "a-db-statement-structure",
        title: "The structure of a SQL statement",
        explain:
          "A statement is made of CLAUSES, each starting with a KEYWORD: SELECT list FROM table WHERE condition ORDER BY columns; Keywords (SELECT, FROM) are not case-sensitive. IDENTIFIERS name things (students, full_name); unquoted they are folded to lowercase, so Students and students are the same table. LITERALS are values: 'text' and '2026-01-12' in single quotes, numbers bare. A statement ends with a semicolon. Clauses must come in a fixed order (SELECT … FROM … WHERE … ORDER BY), and SQL does not care about line breaks or extra spaces.",
        table: {
          caption: "One statement, taken apart.",
          headers: ["Part", "In SELECT full_name FROM students WHERE city = 'Lagos';"],
          rows: [
            ["Keywords", "SELECT, FROM, WHERE"],
            ["Identifiers", "full_name, students, city"],
            ["Literal", "'Lagos' (single quotes: a value)"],
            ["Operator", "="],
            ["Terminator", ";"],
          ],
        },
        sqlLab: {
          setup: WEEK2_STUDENTS,
          task:
            "This statement has three mistakes: a misspelt keyword, a value in the wrong kind of quotes, and missing commas between columns. Fix it so it returns full_name and email for the student whose course_interest is Data Analysis.",
          starter: "SELCT full_name email\nFROM students\nWHERE course_interest = \"Data Analysis\";\n",
          solution: "SELECT full_name, email\nFROM students\nWHERE course_interest = 'Data Analysis';\n",
          checks: [{ label: "Returns Ada's full_name and email", result: true }],
          hint: "Run it after each fix and read the error. Values take single quotes; double quotes are for names. Columns are separated by commas.",
          successMessage: "Three errors, each named by PostgreSQL. Notice that with double quotes it looked for a COLUMN called Data Analysis.",
        },
      },
      {
        id: "a-db-reading-errors",
        title: "Reading error messages",
        explain:
          "psql prints ERROR: and a message, then LINE n: with the statement and a caret ^ under the place PostgreSQL got stuck. 'syntax error at or near \"SELEC\"' means the grammar broke at that word. 'relation \"student\" does not exist' means no table (or view) of that name in the search path: a typo, a missing schema prefix, or the wrong database. 'column \"fullname\" does not exist' often comes with a HINT suggesting the column you meant. Fix the FIRST error first; later ones are often caused by it. The two errors below were recorded on a real server.",
        example: shownAll("psql-academy", ["SELEC full_name FROM students;", "SELECT full_name FROM student;"]),
        sqlLab: {
          setup: WEEK2_STUDENTS,
          task:
            "This query fails. Run it, read the error and its HINT, and fix it so it returns every student's full name and enrollment date.",
          starter: "SELECT fullname, enrolled_on\nFROM students;\n",
          solution: "SELECT full_name, enrolled_on\nFROM students;\n",
          checks: [{ label: "Returns full_name and enrolled_on for every student", result: true }],
          hint: "PostgreSQL's HINT line suggests the column name it thinks you meant.",
          successMessage: "PostgreSQL even told you the answer. Always read the HINT and DETAIL lines.",
        },
      },
      {
        id: "a-db-formatting",
        title: "Writing readable SQL",
        explain:
          "SQL you write today is read many times later, by you and by others. Common conventions: keywords in UPPERCASE and names in lowercase snake_case; each major clause (SELECT, FROM, WHERE, ORDER BY) on its own line; one column per line when there are several, with commas at the line ends; indentation for continued lines; meaningful aliases; and comments with -- for anything a reader could not guess. Consistency matters more than which convention you pick; teams usually adopt a style guide or a formatter.",
        example:
          "-- Hard to read\nselect full_name,email,enrolled_on from students where course_interest='Python' order by enrolled_on\n\n-- Readable\nSELECT full_name,\n       email,\n       enrolled_on\nFROM students\nWHERE course_interest = 'Python'   -- this term's Python cohort\nORDER BY enrolled_on;",
        decision: decide({
          scenario: "A teammate's 40-line report query is written on two lines, in lowercase, with single-letter column aliases a, b, c. It works.",
          question: "What is the best review comment?",
          right: ["Ask for one clause per line, UPPERCASE keywords and meaningful aliases, so the next person can check and change it safely", "Working is the minimum; readable is what makes it maintainable."],
          wrong: [
            ["Approve it: it returns the right rows", "Unreadable SQL hides bugs and slows every future change."],
            ["Rewrite it yourself without telling them", "Style is a team agreement; explain it."],
            ["Ask them to remove all whitespace to make it faster", "Whitespace has no effect on speed."],
          ],
          at: 1,
          aftermath: "From here on, the model answers in this course follow this style.",
        }),
      },
      {
        id: "a-db-mysql-same",
        title: "PostgreSQL and MySQL: what stays the same",
        explain:
          "Most of what you write is standard SQL and works in both: CREATE TABLE with NOT NULL, DEFAULT, PRIMARY KEY and UNIQUE; INSERT with a column list; SELECT with column lists, aliases, WHERE and ORDER BY. Below is this week's students table created in MySQL. Look at the differences in DESCRIBE's output: MySQL's id uses AUTO_INCREMENT (PostgreSQL's identity), text columns are VARCHAR(n), and a default that is an expression must be in brackets: DEFAULT (CURRENT_DATE). Then MySQL answers an INSERT with 'Query OK, 2 rows affected' and 'Records: 2  Duplicates: 0  Warnings: 0'.",
        example: shownAll("mysql-academy", [
          "CREATE TABLE students (\n  id              INT AUTO_INCREMENT PRIMARY KEY,\n  full_name       VARCHAR(100) NOT NULL,\n  email           VARCHAR(255) NOT NULL UNIQUE,\n  enrolled_on     DATE NOT NULL DEFAULT (CURRENT_DATE),\n  course_interest VARCHAR(100)\n);",
          "DESCRIBE students;",
        ]),
        terminalExercise: term("mysql-academy", {
          only: [
            "SHOW TABLES;",
            "DESCRIBE students;",
            "INSERT INTO students (full_name, email, enrolled_on, course_interest)\nVALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'),\n       ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03', 'Web Development');",
            "SELECT * FROM students;",
            "SELECT full_name AS student, enrolled_on FROM students;",
            "SELEC full_name FROM students;",
          ],
          goal: "In MySQL, read the students' names under the heading student, with their enrollment dates: the same query you ran in PostgreSQL.",
          accept: ["SELECT full_name AS student, enrolled_on FROM students;"],
          hint: "It is character for character the PostgreSQL query from Lesson 10.",
          success: "Identical SQL, identical answer, different table drawing. Then run the misspelt SELEC to compare MySQL's error with PostgreSQL's.",
        }),
      },
      {
        id: "a-db-mysql-differs",
        title: "PostgreSQL and MySQL: what changes",
        explain:
          "Differences you will meet early. String joining: PostgreSQL uses ||; in MySQL || means OR, so 'Ada' || 'Obi' returns 0 with warnings: use CONCAT(). Division: in PostgreSQL 7 / 2 is 3 (integer division) and 7 / 2.0 is 3.5; in MySQL 7 / 2 is 3.5000 and DIV is integer division. Case: PostgreSQL's LIKE is case-sensitive and ILIKE is not; MySQL's LIKE is usually case-insensitive and has no ILIKE. New rows: PostgreSQL's INSERT … RETURNING id gives back the new row; MySQL uses LAST_INSERT_ID() in the same session. Booleans: PostgreSQL has a real boolean (t/f); MySQL stores TRUE as 1. Run the commands in the MySQL terminal and compare them with PostgreSQL's below.",
        example: shownAll("pg-dialect", [
          "SELECT 'Ada' || ' ' || 'Obi' AS full_name;",
          "SELECT 7 / 2 AS whole, 7 / 2.0 AS exact;",
          "SELECT full_name FROM students WHERE full_name LIKE 'a%';",
          "SELECT full_name FROM students WHERE full_name ILIKE 'a%';",
        ]),
        terminalExercise: term("mysql-dialect", {
          goal: "In MySQL, return the full name 'Ada Obi' built from 'Ada', a space and 'Obi', correctly.",
          accept: ["SELECT CONCAT('Ada', ' ', 'Obi') AS full_name;"],
          near: [{ command: "SELECT 'Ada' || ' ' || 'Obi' AS full_name;", why: "In MySQL || is the OR operator, so this returns 0 (with warnings). MySQL joins strings with a function." }],
          hint: "MySQL joins strings with a function whose name means 'join together'.",
          success: "CONCAT works in both databases, so it is the portable choice.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 2.P · PRACTICAL: THE STUDENT DATABASE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l12-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["2.P"],
    title: "Week 2 Practical: A Student Database",
    subtitle: "Create, fill and query your first table, on your own",
    estimatedMinutes: 50,
    intro:
      "This is the week's checkpoint: build a working student database without a model answer to copy. Do it here, then again on your own PostgreSQL and MySQL installations.",
    atoms: [
      {
        id: "a-db-p2-table",
        title: "Create the table",
        explain:
          "Design a table called learners for a training centre. It must store: an automatically numbered id that is the primary key; the learner's full name (required); their email address (required, and no two learners may share one); the date they enrolled (required, defaulting to today); and their course interest (optional, at most 60 characters). Choose the types yourself.",
        sqlLab: {
          task:
            "Create the learners table: id (auto-numbered primary key), full_name (required), email (required, unique), enrolled_on (date, required, default today), course_interest (optional, at most 60 characters). Use exactly these column names.",
          starter: "",
          solution: "CREATE TABLE learners (\n  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name       text NOT NULL,\n  email           text NOT NULL UNIQUE,\n  enrolled_on     date NOT NULL DEFAULT current_date,\n  course_interest varchar(60)\n);\n",
          checks: [
            { label: "The five columns exist, in order, with sensible types", query: "SELECT column_name, CASE WHEN data_type IN ('text', 'character varying') THEN 'text' ELSE data_type END, is_nullable FROM information_schema.columns WHERE table_name = 'learners' ORDER BY ordinal_position", ordered: true },
            { label: "id is filled in and enrolled_on defaults to today", assert: "WITH x AS (INSERT INTO learners (full_name, email) VALUES ('Test One', 't1@example.com') RETURNING id, enrolled_on) SELECT id IS NOT NULL AND enrolled_on = current_date FROM x" },
            { label: "Two learners cannot share an email", rejects: "INSERT INTO learners (full_name, email) VALUES ('A', 'same@example.com'), ('B', 'same@example.com')", code: "23505" },
            { label: "A learner must have an email", rejects: "INSERT INTO learners (full_name) VALUES ('No Email')", code: "23502" },
            { label: "course_interest is limited to 60 characters", rejects: "INSERT INTO learners (full_name, email, course_interest) VALUES ('Long', 'long@example.com', repeat('x', 61))", code: "22001" },
          ],
          hint: "Look back at Lessons 9 and 10: identity primary key, NOT NULL, UNIQUE, DEFAULT current_date, varchar(60).",
          revealSolution: false,
          successMessage: "Your table enforces every rule in the brief. Keep the script: you will run it on your own server next.",
        },
      },
      {
        id: "a-db-p2-insert",
        title: "Fill it with sample learners",
        explain:
          "Write the CREATE TABLE from the previous step again at the top (each run starts from an empty database), then insert at least five learners of your own choosing in one INSERT, with real-looking names, unique emails, dates in 2026 written as 'YYYY-MM-DD', and a course interest for most but not all of them. End with SELECT * FROM learners; so you can see the result.",
        sqlLab: {
          task:
            "Re-create learners, insert at least five learners (at least one with no course interest), and finish with SELECT * FROM learners;",
          starter: "-- 1. CREATE TABLE learners (...)\n\n-- 2. INSERT INTO learners (...) VALUES ...\n\n-- 3. SELECT * FROM learners;\n",
          solution: "CREATE TABLE learners (\n  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name       text NOT NULL,\n  email           text NOT NULL UNIQUE,\n  enrolled_on     date NOT NULL DEFAULT current_date,\n  course_interest varchar(60)\n);\n\nINSERT INTO learners (full_name, email, enrolled_on, course_interest)\nVALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'),\n       ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03', 'Web Development'),\n       ('Chiamaka Eze', 'chiamaka@example.com', '2026-02-14', NULL),\n       ('Dayo Bello', 'dayo@example.com', '2026-03-01', 'Python'),\n       ('Efe Okoro', 'efe@example.com', '2026-03-15', 'Cybersecurity');\n\nSELECT * FROM learners;\n",
          checks: [
            { label: "learners exists with the five columns", assert: "SELECT count(*) = 5 FROM information_schema.columns WHERE table_name = 'learners' AND column_name IN ('id', 'full_name', 'email', 'enrolled_on', 'course_interest')" },
            { label: "At least five learners", assert: "SELECT count(*) >= 5 FROM learners" },
            { label: "At least one has no course interest, and most have one", assert: "SELECT count(*) FILTER (WHERE course_interest IS NULL) >= 1 AND count(*) FILTER (WHERE course_interest IS NOT NULL) > count(*) / 2 FROM learners" },
            { label: "Every email looks like an email", assert: "SELECT bool_and(email LIKE '%_@_%._%') FROM learners" },
            { label: "It ends by showing the table", returns: { minRows: 5 } },
          ],
          hint: "One INSERT with several bracketed rows separated by commas. Use NULL (no quotes) for the missing interest.",
          revealSolution: false,
          successMessage: "A populated table that rejects bad data. That is a database, not a spreadsheet.",
        },
      },
      {
        id: "a-db-p2-select",
        title: "Retrieve selected columns",
        explain:
          "Finally, the question the centre actually asks: who joined, when, and what do they want to study? Using the learners you inserted, write a query that returns only those three things, with readable headings.",
        sqlLab: {
          task:
            "Re-create and fill learners as before (paste your script), then end with ONE query returning three columns headed learner, joined and interest: each learner's full name, enrollment date and course interest.",
          starter: "-- Your CREATE TABLE and INSERT from the previous step\n\n-- The report:\n",
          solution: "CREATE TABLE learners (\n  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name       text NOT NULL,\n  email           text NOT NULL UNIQUE,\n  enrolled_on     date NOT NULL DEFAULT current_date,\n  course_interest varchar(60)\n);\n\nINSERT INTO learners (full_name, email, enrolled_on, course_interest)\nVALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'),\n       ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03', 'Web Development'),\n       ('Chiamaka Eze', 'chiamaka@example.com', '2026-02-14', NULL),\n       ('Dayo Bello', 'dayo@example.com', '2026-03-01', 'Python'),\n       ('Efe Okoro', 'efe@example.com', '2026-03-15', 'Cybersecurity');\n\nSELECT full_name       AS learner,\n       enrolled_on     AS joined,\n       course_interest AS interest\nFROM learners;\n",
          checks: [
            { label: "Three columns headed learner, joined, interest", returns: { columns: ["learner", "joined", "interest"], minRows: 5 } },
            { label: "One row per learner in the table", assert: "SELECT count(*) >= 5 FROM learners" },
            { label: "The values come from the table", source: "AS\\s+learner" },
          ],
          hint: "SELECT column AS heading, … FROM learners; — three columns, three aliases.",
          revealSolution: false,
          successMessage: "Checkpoint complete in the page. Now do it for real on your own servers.",
        },
      },
    ],
    task: {
      title: "Week 2 practical: your student database, on your own servers",
      intro: "Use the script you wrote in the labs above.",
      prompts: [
        "In psql: CREATE DATABASE training; then \\c training, run your CREATE TABLE, INSERT and SELECT, and use \\dt and \\d learners to inspect the result.",
        "Open pgAdmin, find the training database and the learners table in the tree, and run your SELECT in the Query Tool.",
        "In MySQL: CREATE DATABASE training; USE training; and adapt the CREATE TABLE (INT AUTO_INCREMENT, VARCHAR(255) for text, DEFAULT (CURRENT_DATE)). Note every change you had to make.",
        "Try to insert a learner with a duplicate email and one with no email in BOTH databases, and compare the error messages.",
        "Checkpoint: without notes, create a database and table, insert sample data, and retrieve selected columns with aliases, then explain each statement to someone else.",
      ],
      closing: "Next: Week 3, designing a database properly before writing SQL: entities, relationships, keys and ER diagrams.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
