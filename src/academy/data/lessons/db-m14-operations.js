/**
 * RELATIONAL DATABASES · WEEK 14 · SECURITY, ADMINISTRATION AND RECOVERY
 *
 * Curriculum 14.1 – 14.P. Roles and membership, GRANT and REVOKE, least
 * privilege, separating application, reporting and admin access, schema and
 * table permissions, SQL injection, credentials, network access, encryption,
 * personal data, auditing, logical and physical backups, pg_dump and
 * pg_restore (and mysqldump), restoring into a test environment, scheduling
 * and retention, RPO and RTO, tested restores, monitoring, logs, maintenance,
 * environments and migration workflows.
 *
 * Permission labs run on PostgreSQL in the page and prove access rules by
 * switching roles (SET ROLE) inside the checks. Logins, pg_hba.conf, server
 * logs, backups and restores need a real server and real files, so those are
 * terminals RECORDED on PostgreSQL 18.6 and MySQL 8.4 (scripts/dbRecord.mjs).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ACADEMY, decide, shown, shownAll, term } from "./db-helpers.js";

export const SECTION_ID = "db-s14-operations";
const MODULE = "db-m14-operations";

const as = (role, sql) => `SET ROLE ${role};\n${sql}`;
const PSQL_RESTORE = 'psql -U postgres -d academy_restore_test -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"';
const PSQL_LIVE = 'psql -U postgres -d academy -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 14.1 – 14.3 · ROLES, GRANT AND LEAST PRIVILEGE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l76-roles",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3"],
    title: "Roles, GRANT and Least Privilege",
    subtitle: "Who can connect, and what each of them can do",
    estimatedMinutes: 50,
    intro:
      "So far everything has run as postgres, a superuser who can do anything. Real systems never let applications or people work like that. This week the academy database gets proper accounts.",
    atoms: [
      {
        id: "a-db-roles",
        title: "Database roles and role membership",
        explain:
          "In PostgreSQL every account is a ROLE. A role with LOGIN (CREATE ROLE ada LOGIN PASSWORD '…', or CREATE USER, which is the same thing) can connect; a role without LOGIN is a GROUP that collects privileges. GRANT group TO member makes a role a member, and members inherit the group's privileges: create one 'analysts' group with the right permissions and add or remove people, instead of granting to each person. Roles belong to the whole server, not to one database. \\du lists them. Superuser and CREATEROLE are powerful attributes; keep them for administrators.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Create a group role analysts (NOLOGIN) that may read students and courses, and two login roles, ada_analyst and bayo_analyst (passwords of your choice), who are members of analysts. Do NOT grant anything to the two people directly.",
          starter: "CREATE ROLE analysts NOLOGIN;\n",
          solution: "CREATE ROLE analysts NOLOGIN;\nGRANT SELECT ON students, courses TO analysts;\n\nCREATE ROLE ada_analyst LOGIN PASSWORD 'change-me-1';\nCREATE ROLE bayo_analyst LOGIN PASSWORD 'change-me-2';\n\nGRANT analysts TO ada_analyst, bayo_analyst;\n",
          checks: [
            { label: "ada_analyst can read students through the group", accepts: as("ada_analyst", "SELECT count(*) FROM students") },
            { label: "bayo_analyst can read courses through the group", accepts: as("bayo_analyst", "SELECT count(*) FROM courses") },
            { label: "Neither can read payments", rejects: as("ada_analyst", "SELECT * FROM payments"), code: "42501" },
            { label: "Privileges were granted to the group, not the people", assert: "SELECT NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE grantee IN ('ada_analyst', 'bayo_analyst'))" },
            { label: "Both are members of analysts", assert: "SELECT pg_has_role('ada_analyst', 'analysts', 'MEMBER') AND pg_has_role('bayo_analyst', 'analysts', 'MEMBER')" },
          ],
          mustFail: [
            "CREATE ROLE analysts NOLOGIN;\nCREATE ROLE ada_analyst LOGIN;\nCREATE ROLE bayo_analyst LOGIN;\nGRANT SELECT ON students, courses TO ada_analyst, bayo_analyst;",
            "CREATE ROLE analysts NOLOGIN;\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO analysts;\nCREATE ROLE ada_analyst LOGIN;\nCREATE ROLE bayo_analyst LOGIN;\nGRANT analysts TO ada_analyst, bayo_analyst;",
          ],
          hint: "GRANT SELECT ON students, courses TO analysts; then GRANT analysts TO ada_analyst, bayo_analyst;",
          successMessage: "A new analyst next month is one GRANT analysts TO …; someone leaving is one REVOKE.",
        },
      },
      {
        id: "a-db-grant-revoke",
        title: "GRANT and REVOKE",
        explain:
          "GRANT privilege ON object TO role; gives a permission; REVOKE privilege ON object FROM role; takes it away. Table privileges: SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER (or ALL). Privileges can be column-specific: GRANT UPDATE (email, phone) ON students TO support. The table's OWNER (its creator) can do everything and grant to others. \\dp table shows the privileges as codes: r = SELECT (read), a = INSERT (append), w = UPDATE (write), d = DELETE, D = TRUNCATE, x = REFERENCES, t = TRIGGER, m = MAINTAIN. Below, real output after the academy's roles were set up.",
        example: shownAll("pg-roles", [
          "GRANT SELECT, INSERT, UPDATE ON students, payments TO academy_app;",
          "GRANT SELECT ON students, payments TO reporting;",
          "REVOKE SELECT ON payments FROM reporting;",
          "\\dp students",
        ]),
        terminalExercise: term("pg-roles", {
          only: ["\\du", "\\dp students", "\\dp payments"],
          goal: "Check exactly who may do what to the payments table now that reporting's access was revoked.",
          accept: ["\\dp payments"],
          near: [{ command: "\\du", why: "\\du lists roles and their attributes, not table permissions. Ask psql for a table's access privileges." }],
          hint: "\\dp followed by the table name shows its access privileges.",
          success: "postgres=arwdDxtm and academy_app=arw: the application may read, insert and update payments; reporting is gone from the list.",
        }),
      },
      {
        id: "a-db-least-privilege",
        title: "Least-privilege access",
        explain:
          "LEAST PRIVILEGE: every role gets exactly the permissions its job needs, and nothing more. If the reporting account's password leaks, an attacker can read reports, not delete students; if the application has a SQL injection bug, it cannot DROP TABLE because the application role does not own the tables. Start from nothing (new roles have no table privileges), grant specific privileges on specific objects, and review them. Never let applications connect as postgres or as the tables' owner.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "The help desk needs to look up students and correct their phone numbers, nothing else. Create a login role helpdesk that can SELECT students and UPDATE only the phone column of students.",
          starter: "CREATE ROLE helpdesk LOGIN PASSWORD 'change-me';\n",
          solution: "CREATE ROLE helpdesk LOGIN PASSWORD 'change-me';\n\nGRANT SELECT ON students TO helpdesk;\nGRANT UPDATE (phone) ON students TO helpdesk;\n",
          checks: [
            { label: "helpdesk can look students up", accepts: as("helpdesk", "SELECT full_name, phone FROM students WHERE id = 3") },
            { label: "helpdesk can correct a phone number", accepts: as("helpdesk", "UPDATE students SET phone = '0803 000 0000' WHERE id = 3") },
            { label: "helpdesk cannot change an email", rejects: as("helpdesk", "UPDATE students SET email = 'x@example.com' WHERE id = 3"), code: "42501" },
            { label: "helpdesk cannot delete students", rejects: as("helpdesk", "DELETE FROM students WHERE id = 3"), code: "42501" },
            { label: "helpdesk cannot read payments", rejects: as("helpdesk", "SELECT * FROM payments"), code: "42501" },
          ],
          mustFail: [
            "CREATE ROLE helpdesk LOGIN PASSWORD 'change-me';\nGRANT SELECT, UPDATE ON students TO helpdesk;",
            "CREATE ROLE helpdesk LOGIN PASSWORD 'change-me';\nGRANT ALL ON ALL TABLES IN SCHEMA public TO helpdesk;",
          ],
          hint: "GRANT SELECT ON students TO helpdesk; and a column-level GRANT UPDATE (phone) ON students TO helpdesk;",
          successMessage: "The help desk can do its job and nothing else, so a leaked help-desk password can do very little harm.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 14.4 – 14.5 · SEPARATING ACCESS, SCHEMA PERMISSIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l77-separation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.4", "14.5"],
    title: "Application, Reporting and Admin Access",
    subtitle: "Separate roles for separate jobs, and schema-level permissions",
    estimatedMinutes: 45,
    intro:
      "A typical database has three kinds of user: the application, the people who read reports, and the administrators who change structure. Each needs a different, deliberately limited set of permissions.",
    atoms: [
      {
        id: "a-db-separate-roles",
        title: "Separating application, reporting and administrative permissions",
        explain:
          "A common, robust layout: an OWNER role (NOLOGIN) owns the schema and tables, and migrations run as it; the APPLICATION role can SELECT, INSERT, UPDATE and maybe DELETE the tables it uses, but cannot ALTER or DROP anything; a REPORTING role can only SELECT, ideally only views; ADMINISTRATORS are personal login accounts (never a shared 'admin') with powerful rights, used rarely and logged. Below, real logins to a PostgreSQL 18 server as each role: reporting can read students but not payments and cannot delete; the application cannot delete or drop tables.",
        example: shownAll("pg-login", [
          'psql -U reporting -d academy -c "SELECT count(*) FROM students;"',
          'psql -U reporting -d academy -c "SELECT sum(amount) FROM payments;"',
          'psql -U academy_app -d academy -c "DROP TABLE payments;"',
        ]),
        terminalExercise: term("pg-login", {
          only: [
            'psql -U reporting -d academy -c "SELECT count(*) FROM students;"',
            'psql -U reporting -d academy -c "DELETE FROM students;"',
            'psql -U academy_app -d academy -c "DELETE FROM students WHERE id = 4;"',
            'psql -U academy_app -d academy -c "DROP TABLE payments;"',
          ],
          goal: "Show that even the APPLICATION's own account cannot delete a student.",
          accept: ['psql -U academy_app -d academy -c "DELETE FROM students WHERE id = 4;"'],
          near: [{ command: 'psql -U reporting -d academy -c "DELETE FROM students;"', why: "That proves the reporting account cannot delete. The goal is about the application's account, academy_app." }],
          hint: "Connect as academy_app and try a DELETE.",
          success: "permission denied for table students: academy_app was granted SELECT, INSERT and UPDATE only, so students are deactivated, never deleted.",
        }),
      },
      {
        id: "a-db-schema-permissions",
        title: "Schema and table permissions",
        explain:
          "Two levels of permission must both allow an action. SCHEMA: USAGE lets a role look up objects in it; CREATE lets it create new ones (since PostgreSQL 15, ordinary roles can no longer create objects in public). TABLE: SELECT, INSERT and so on. So reporting needs GRANT USAGE ON SCHEMA reporting and GRANT SELECT ON the tables. GRANT SELECT ON ALL TABLES IN SCHEMA reporting covers existing tables only; ALTER DEFAULT PRIVILEGES IN SCHEMA reporting GRANT SELECT ON TABLES TO reader makes FUTURE tables readable too.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Create a schema reporting with a view reporting.course_totals (course_id, enrollments). Create a login role report_reader that can use the reporting schema and read everything in it, including tables or views created there LATER, but cannot read the public tables directly.",
          starter: "CREATE SCHEMA reporting;\n\nCREATE VIEW reporting.course_totals AS\nSELECT course_id, count(*) AS enrollments\nFROM enrollments\nGROUP BY course_id;\n\nCREATE ROLE report_reader LOGIN PASSWORD 'change-me';\n",
          solution: "CREATE SCHEMA reporting;\n\nCREATE VIEW reporting.course_totals AS\nSELECT course_id, count(*) AS enrollments\nFROM enrollments\nGROUP BY course_id;\n\nCREATE ROLE report_reader LOGIN PASSWORD 'change-me';\n\nGRANT USAGE ON SCHEMA reporting TO report_reader;\nGRANT SELECT ON ALL TABLES IN SCHEMA reporting TO report_reader;\nALTER DEFAULT PRIVILEGES IN SCHEMA reporting GRANT SELECT ON TABLES TO report_reader;\n",
          checks: [
            { label: "report_reader can read the view", accepts: as("report_reader", "SELECT * FROM reporting.course_totals") },
            { label: "report_reader cannot read the students table directly", rejects: as("report_reader", "SELECT * FROM public.students"), code: "42501" },
            { label: "Views created later are readable too", accepts: "CREATE VIEW reporting.city_counts AS SELECT city, count(*) FROM students GROUP BY city;\nSET ROLE report_reader;\nSELECT * FROM reporting.city_counts" },
          ],
          hint: "Three grants: USAGE on the schema, SELECT ON ALL TABLES IN SCHEMA, and ALTER DEFAULT PRIVILEGES … GRANT SELECT ON TABLES.",
          successMessage: "The view reads students on report_reader's behalf (views run with their owner's rights), but report_reader cannot touch students itself.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 14.6 – 14.8 · SECURE DATABASE APPLICATIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l78-secure-apps",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.6", "14.7", "14.8"],
    title: "Securing the Way Applications Connect",
    subtitle: "Injection, credentials, and who can reach the server at all",
    estimatedMinutes: 45,
    intro:
      "Most real database breaches do not start with the database. They start with an injectable query, a password committed to GitHub, or a server reachable from the whole internet.",
    atoms: [
      {
        id: "a-db-injection-again",
        title: "SQL injection and parameterized queries",
        explain:
          "Week 6 showed SQL injection: input glued into SQL text becomes SQL code. The defence in depth: (1) ALWAYS parameterized queries ($1 placeholders) for values, so input can never change the statement; (2) allow-lists for anything that cannot be a parameter (a sort column chosen from a fixed list, never typed in); (3) least privilege, so even a successful injection through the application role cannot drop tables or read other schemas; (4) never show raw database errors to users (they help attackers map the schema). ORMs parameterize for you, but their 'raw SQL' escape hatches do not.",
        decision: decide({
          scenario: "A search page lets users choose the sort order by sending ?sort=price. The code builds \"… ORDER BY \" + sort. A developer says: 'It is a column name, so parameters cannot be used; it is fine.'",
          question: "What is the right fix?",
          right: ["Map the input through an allow-list of known columns (price → 'price', newest → 'created_on') and refuse anything else", "Names cannot be parameters, so they must come from a fixed set you control."],
          wrong: [
            ["Leave it: injection only happens in WHERE", "ORDER BY is just as injectable."],
            ["Remove quotes from the input", "Injection without quotes is still possible."],
            ["Put the column name in a $1 parameter", "Parameters bind values, not identifiers."],
          ],
          at: 1,
          aftermath: "Parameters for values, allow-lists for names, least privilege for when both fail.",
        }),
      },
      {
        id: "a-db-credentials",
        title: "Safe handling of credentials and connection strings",
        explain:
          "A connection string such as postgres://academy_app:secret@db.example.com:5432/academy contains a password, so treat it as a SECRET. Keep it out of source code and out of Git: put it in an ENVIRONMENT VARIABLE (DATABASE_URL), loaded from a .env file listed in .gitignore on development machines, and from the hosting platform's secret store in production. Use a different password per environment and per role, rotate them when people leave or a leak is suspected, and never log full connection strings. On your own machine, pgpass.conf and MySQL option files keep passwords off the command line, protected by file permissions.",
        decision: decide({
          scenario: "A developer discovers the production DATABASE_URL, with its password, was committed to a public GitHub repository three months ago, then removed in a later commit.",
          question: "What must happen?",
          right: ["Treat the password as compromised: rotate it immediately and review database logs for unknown access; removing the commit is not enough", "Git history keeps the old commit, and bots scan GitHub for secrets within minutes."],
          wrong: [
            ["Nothing: it was removed in a later commit", "The secret remains in the history and was public for three months."],
            ["Make the repository private", "It was already public; the secret must be assumed stolen."],
            ["Rename the database", "The credentials still work."],
          ],
          at: 0,
          aftermath: "Week 15 sets up .env and .gitignore properly for the Node.js backend.",
        }),
      },
      {
        id: "a-db-network-access",
        title: "Restricting network access",
        explain:
          "Two layers decide who can even try to log in. postgresql.conf's listen_addresses says which network interfaces the server listens on: 'localhost' (the default) means only programs on the same machine can connect. pg_hba.conf ('host-based authentication') then matches each connection by type, database, user and client address, and decides the method: scram-sha-256 passwords, certificates, or reject. Add a line only for the networks that need it (the application server's address, not 0.0.0.0/0), and put a firewall in front. Below, the real rules and settings of a fresh Windows installation.",
        example: shown("pg-roles", "SELECT line_number, type, database, user_name, address, auth_method FROM pg_hba_file_rules;"),
        terminalExercise: term("pg-roles", {
          only: ["SHOW listen_addresses;", "SHOW password_encryption;", "SHOW ssl;"],
          goal: "Find out which network addresses this PostgreSQL server accepts connections on at all.",
          accept: ["SHOW listen_addresses;"],
          hint: "The setting is about which addresses the server listens on.",
          success: "localhost: only programs on this machine can connect. To accept an application server you would add its address here and a matching pg_hba.conf line, nothing broader.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 14.9 – 14.11 · PROTECTING DATA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l79-protect-data",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.9", "14.10", "14.11"],
    title: "Encryption, Personal Data and Auditing",
    subtitle: "Protecting data in transit and at rest, and keeping a record of privileged actions",
    estimatedMinutes: 45,
    intro:
      "A database of students holds personal data: names, phone numbers, payments. Nigeria's NDPA, the EU's GDPR and similar laws require it to be protected, accessed only when needed, and accounted for.",
    atoms: [
      {
        id: "a-db-encryption",
        title: "Encryption in transit and protection of stored data",
        explain:
          "IN TRANSIT: with ssl = on and a certificate on the server, clients connect over TLS; insist on it from the client side with sslmode=require (or verify-full, which also checks the server's identity) in the connection string, and with hostssl lines in pg_hba.conf. Managed cloud databases require it by default. AT REST: encrypt the disk or volume the data directory and backups live on (cloud volumes do this by default; on your own servers use BitLocker, LUKS or similar), and encrypt backup files you copy elsewhere. Never store user PASSWORDS at all: store a slow, salted hash (bcrypt or argon2, computed in the application, or crypt() from the pgcrypto extension).",
        terminalExercise: term("pg-roles", {
          only: ["SHOW ssl;", "SHOW password_encryption;", "SHOW listen_addresses;"],
          goal: "Check whether this fresh server encrypts client connections.",
          accept: ["SHOW ssl;"],
          near: [{ command: "SHOW password_encryption;", why: "That is how role passwords are stored (scram-sha-256 hashes), not whether connections are encrypted." }],
          hint: "TLS for client connections is controlled by a setting named after the protocol's old name.",
          success: "ssl = off: fine while it listens only on localhost, but it must be turned on, with a certificate, before any connection crosses a network.",
        }),
      },
      {
        id: "a-db-personal-data",
        title: "Avoiding unnecessary access to personal information",
        explain:
          "Data protection principles: collect only what you need, and let each person and system see only what their job needs. In the database that means: reporting reads aggregated or MASKED views rather than raw tables; column-level grants keep phone numbers and emails from roles that do not need them; Row-Level Security policies (CREATE POLICY) can limit rows per user; test and development environments use anonymised copies, not production data. Every extra copy of personal data is one more place it can leak from.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "The marketing team may see each student's first name, city and a MASKED phone (only the last 4 digits, as '*** 2001'; NULL when there is no phone), but nothing else. Create a view students_marketing (id, first_name, city, phone_hint) and a role marketing that can read only that view.",
          starter: "CREATE VIEW students_marketing AS\nSELECT id,\n       split_part(full_name, ' ', 1) AS first_name,\n       city\nFROM students;\n",
          solution: "CREATE VIEW students_marketing AS\nSELECT id,\n       split_part(full_name, ' ', 1) AS first_name,\n       city,\n       '*** ' || right(phone, 4) AS phone_hint\nFROM students;\n\nCREATE ROLE marketing LOGIN PASSWORD 'change-me';\nGRANT SELECT ON students_marketing TO marketing;\n",
          checks: [
            { label: "The masked view shows only first names, cities and phone hints", query: "SELECT * FROM students_marketing ORDER BY id", ordered: true },
            { label: "marketing can read the view", accepts: as("marketing", "SELECT * FROM students_marketing") },
            { label: "marketing cannot read the students table", rejects: as("marketing", "SELECT email FROM students"), code: "42501" },
          ],
          hint: "'*** ' || right(phone, 4) gives the hint; with a NULL phone the whole expression is NULL, as required.",
          successMessage: "Marketing gets what it needs to segment by city, and no full contact details leave the core table.",
        },
      },
      {
        id: "a-db-audit-privileged",
        title: "Auditing privileged operations",
        explain:
          "Administrators can do anything, so what they do must be recorded. PostgreSQL's server log can record connections and disconnections (log_connections), failed logins (always logged), DDL (log_statement = 'ddl'), slow queries (log_min_duration_statement), and errors with the statement that caused them, all tagged with user, time and process. The pgAudit extension adds detailed, structured audit logging. Logs must go somewhere administrators cannot quietly edit (a central log service). Below, the real tail of the server log after this week's experiments: permission errors with their statements, and a failed login with the pg_hba.conf line it matched.",
        terminalExercise: term("pg-monitor-shell", {
          goal: "Show the most recent lines of the PostgreSQL server log, to see who tried to do what.",
          accept: ["Get-Content server.log -Tail 6"],
          hint: "In PowerShell, Get-Content with -Tail shows the end of a file.",
          success: "Each refused action is logged with time, process and statement, and the failed login says exactly which pg_hba.conf rule it hit.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 80 · 14.12 – 14.14 · BACKUPS AND RESTORES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l80-backups",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["14.12", "14.13", "14.14"],
    title: "Backups with pg_dump and pg_restore",
    subtitle: "Logical and physical backups, restoring into a test database, and mysqldump",
    estimatedMinutes: 55,
    intro:
      "Disks fail, people run DELETE without WHERE, ransomware encrypts servers. A backup is the only thing that brings data back, and only if it can actually be restored.",
    atoms: [
      {
        id: "a-db-logical-physical",
        title: "Logical versus physical backups",
        explain:
          "A LOGICAL backup is the database exported as SQL statements or an archive of them (pg_dump, mysqldump): portable between versions and platforms, selective (one database, one table), readable, but slow to restore for very large databases and only a snapshot of one moment. A PHYSICAL backup copies the data files themselves (pg_basebackup, or a filesystem snapshot), plus the write-ahead log (WAL) archived continuously: it restores large databases fast and, with WAL archiving, enables POINT-IN-TIME RECOVERY to any moment (just before the bad DELETE), but only to the same major version and platform. Serious systems use physical backups with WAL archiving, plus logical dumps for portability and selective restores.",
        decision: decide({
          scenario: "At 14:32 someone ran DELETE FROM payments with no WHERE on a 400 GB production database. The last nightly pg_dump was at 02:00.",
          question: "Which backup approach lets you recover the payments made between 02:00 and 14:31?",
          right: ["A physical base backup with continuous WAL archiving, restored to a point in time just before 14:32", "Point-in-time recovery replays the log up to the chosen moment."],
          wrong: [
            ["The 02:00 pg_dump", "It loses everything after 02:00."],
            ["Re-running the DELETE with ROLLBACK", "It was committed; ROLLBACK cannot undo it."],
            ["Copying the data directory now", "It already contains the deletion."],
          ],
          at: 2,
          aftermath: "The time between backups is your worst-case data loss; Lesson 81 calls it the RPO.",
        }),
      },
      {
        id: "a-db-pg-dump-restore",
        title: "Using pg_dump and pg_restore",
        explain:
          "pg_dump -U postgres -d academy -F c -f academy.dump writes one database in the CUSTOM format (-F c): compressed, and restorable selectively and in parallel with pg_restore. -F p writes plain SQL that psql can run; --schema-only and --data-only split structure from rows. pg_restore -l lists what an archive contains; pg_restore -d target restores into an existing database. pg_dump includes table privileges but not ROLES, which are server-wide: back them up with pg_dumpall --roles-only (which also exports their password hashes, so protect that file). Everything below was run on a real server.",
        example: shownAll("pg-backup", ["pg_dump -U postgres -d academy -F c -f academy.dump", "pg_dumpall -U postgres --roles-only"]),
        terminalExercise: term("pg-backup", {
          only: ["pg_dump -U postgres -d academy -F c -f academy.dump", "pg_restore -l academy.dump", "pg_verifybackup --version"],
          goal: "Before relying on academy.dump, list what the archive actually contains.",
          accept: ["pg_restore -l academy.dump"],
          hint: "pg_restore can list an archive's table of contents without restoring it.",
          success: "Every table, sequence, constraint, privilege and the data itself are in the archive, dumped from version 18.6.",
        }),
      },
      {
        id: "a-db-restore-test",
        title: "Restoring a backup into a test environment",
        explain:
          "Never restore over production to test a backup. Create an empty database (createdb academy_restore_test, ideally on another server), restore into it (pg_restore -d academy_restore_test academy.dump), and VERIFY: compare row counts and key totals with the source, run the application's own checks, and look at a few records. MySQL is similar: mysqldump academy --result-file=academy.sql, then load it into a new database. Note the PowerShell trap recorded below: PowerShell has no < input redirection, so 'mysql db < file.sql' fails there; use mysql -e \"source file.sql\" (or cmd.exe).",
        example: shownAll("mysql-backup", ["mysql academy_restore_test < academy-mysql.sql", 'mysql academy_restore_test -e "source academy-mysql.sql"', 'mysql --table academy_restore_test -e "SELECT COUNT(*) FROM students;"']),
        terminalExercise: term("pg-backup", {
          only: ["createdb -U postgres academy_restore_test", "pg_restore -U postgres -d academy_restore_test academy.dump", PSQL_LIVE, PSQL_RESTORE],
          goal: "The dump has been restored into academy_restore_test. Verify the RESTORED copy: count its students and total its payments.",
          accept: [PSQL_RESTORE],
          near: [{ command: PSQL_LIVE, why: "That checks the original database. The point is to check the restored copy, academy_restore_test, and compare the two." }],
          hint: "Run the verification query against academy_restore_test, then compare it with the same query on academy.",
          success: "5 students and 120,000.00 paid, matching the original exactly. Now, and only now, is this backup proven.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 81 · 14.15 – 14.17 · BACKUP STRATEGY AND RECOVERY OBJECTIVES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l81-recovery",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["14.15", "14.16", "14.17"],
    title: "Backup Strategy and Recovery Objectives",
    subtitle: "Scheduling, retention, RPO, RTO and tested restores",
    estimatedMinutes: 40,
    intro:
      "A backup strategy answers three questions: how much data can we afford to lose, how long can we afford to be down, and how do we know the backups work?",
    atoms: [
      {
        id: "a-db-schedule-retention",
        title: "Backup scheduling and retention",
        explain:
          "Schedule backups automatically (cron, Windows Task Scheduler, or the cloud provider's backup service), never by hand. RETENTION decides how long each backup is kept; a common pattern keeps daily backups for a week, weekly for a month, and monthly for a year, so you can go back far enough to before a slowly noticed problem. Follow the 3-2-1 rule: at least 3 copies, on 2 different kinds of storage, 1 off-site (or in another cloud account), with at least one copy that cannot be deleted or encrypted by an attacker who controls the server. Monitor the job: a backup that silently stopped running last March is the commonest disaster of all.",
        decision: decide({
          scenario: "A school's only backup is a nightly pg_dump written to a folder on the same server as the database, overwriting yesterday's file.",
          question: "Which risk is the worst?",
          right: ["A disk failure or ransomware on that server destroys the database and its only backup together, and a mistake noticed after a day cannot be undone", "One copy, same machine, no history."],
          wrong: [
            ["pg_dump files are too large", "Size is not the main risk."],
            ["Nightly is too often", "Nightly is a reasonable minimum."],
            ["pg_dump cannot back up schools", "pg_dump works for any database."],
          ],
          at: 0,
          aftermath: "3-2-1, with history and an off-site copy, fixes all three problems.",
        }),
      },
      {
        id: "a-db-rpo-rto",
        title: "Recovery objectives: RPO and RTO",
        explain:
          "Two numbers agreed with the business define the strategy. RPO (Recovery Point Objective): the maximum acceptable DATA LOSS, measured in time: with nightly backups the worst case is about 24 hours of lost work; an RPO of 5 minutes needs WAL archiving or replication. RTO (Recovery Time Objective): the maximum acceptable DOWNTIME, from failure to working again: restoring a 400 GB dump might take hours, so a 15-minute RTO needs a standby server ready to take over. Lower RPO and RTO cost more; a bank and a hobby blog need very different numbers.",
        decision: decide({
          scenario: "The academy agrees: 'We can lose at most 1 hour of enrollments and payments, and must be back within 4 hours.' Backups are currently one pg_dump per night.",
          question: "Which objective does the current setup fail?",
          right: ["The RPO: a nightly dump can lose up to 24 hours of data; WAL archiving (or hourly backups at least) is needed", "RPO is about data loss; RTO is about downtime."],
          wrong: [
            ["The RTO only", "A restore of a small database can fit in 4 hours; the data-loss window is the problem."],
            ["Neither", "24 hours of possible loss exceeds 1 hour."],
            ["Both RPO and RTO are about disk size", "Both are about time."],
          ],
          at: 3,
          aftermath: "Write the RPO and RTO into your recovery checklist (the practical).",
        }),
      },
      {
        id: "a-db-tested-restores",
        title: "A backup is not proven until it has been restored",
        explain:
          "Backups fail silently: the job stopped, the disk filled, the dump has no data for a table the role could not read, the file is corrupt, the encryption key is lost, or the restore needs roles nobody backed up. The only proof is a RESTORE, done regularly (monthly is common) into a separate environment, followed by verification, and TIMED, because that time is your real RTO. Write the procedure down as a runbook so someone else can follow it at 3 a.m. Earlier in this week, the restored academy_restore_test was verified by comparing counts and totals with the source.",
        decision: decide({
          scenario: "The backup job's dashboard has shown 'Success' every night for two years. Nobody has ever restored one.",
          question: "What can you honestly say about these backups?",
          right: ["Nothing yet: until one is restored and verified, their success is unknown", "'The job finished' is not 'the data is recoverable'."],
          wrong: [
            ["They are fine: the job reports success", "Jobs can succeed while producing unusable backups."],
            ["They are definitely broken", "Unknown is not broken; test one."],
            ["Restoring would damage production", "Restores go into a separate environment."],
          ],
          at: 1,
          aftermath: "Schedule the restore test like the backup itself.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 82 · 14.18 – 14.20 · MONITORING, LOGS AND MAINTENANCE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l82-monitoring",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["14.18", "14.19", "14.20"],
    title: "Monitoring, Logs and Maintenance",
    subtitle: "Keeping a running server healthy",
    estimatedMinutes: 45,
    intro:
      "Databases rarely fail suddenly. They fill up, slow down, run out of connections or accumulate dead rows, and the signs are visible long before users complain, if someone looks.",
    atoms: [
      {
        id: "a-db-monitoring",
        title: "Monitoring connections and database health",
        explain:
          "PostgreSQL reports on itself through statistics views. pg_stat_activity: every connection, who it is, its state (active, idle, idle in transaction) and current query; long 'idle in transaction' sessions hold locks and must be found. max_connections is a hard limit (100 by default): applications should use a connection POOL rather than opening one connection per request. pg_stat_database: commits, rollbacks, deadlocks and cache hits per database. pg_database_size and pg_relation_size: growth. Real numbers from a running server follow.",
        example: shownAll("pg-monitor", ["SHOW max_connections;", "SELECT numbackends, xact_commit, xact_rollback, deadlocks FROM pg_stat_database WHERE datname = 'academy';"]),
        terminalExercise: term("pg-monitor", {
          only: [
            "SELECT pid, usename, application_name, state, left(query, 40) AS query FROM pg_stat_activity WHERE datname = 'academy';",
            "SHOW max_connections;",
            "SELECT pg_size_pretty(pg_database_size('academy')) AS size;",
          ],
          goal: "List who is connected to the academy database right now, and what each connection is doing.",
          accept: ["SELECT pid, usename, application_name, state, left(query, 40) AS query FROM pg_stat_activity WHERE datname = 'academy';"],
          hint: "pg_stat_activity has one row per connection.",
          success: "One active connection: yours, running this very query. In production you would also look for long 'idle in transaction' sessions.",
        }),
      },
      {
        id: "a-db-logs-failures",
        title: "Understanding logs and common operational failures",
        explain:
          "The server log is the first place to look when something goes wrong. Common failures and their messages: 'FATAL: password authentication failed' (wrong password, or the wrong pg_hba.conf line); 'FATAL: sorry, too many clients already' (max_connections reached: add pooling, find leaks); 'could not extend file … No space left on device' (disk full: the database stops accepting writes); 'canceling statement due to statement timeout'; 'deadlock detected'; 'terminating connection due to idle-in-transaction timeout'. Set log_min_duration_statement (for example to 500 ms) to log slow queries; it is -1 (off) by default.",
        example: shown("pg-monitor", "SHOW log_min_duration_statement;"),
        decision: decide({
          scenario: "Users report errors at peak times. The log shows many 'FATAL: sorry, too many clients already' lines and pg_stat_activity shows 97 'idle' connections from the web servers.",
          question: "What is the most likely fix?",
          right: ["Use a connection pool (in the application or PgBouncer) so a few connections are shared, and fix code that does not release connections", "Idle connections are using up max_connections."],
          wrong: [
            ["Raise max_connections to 10,000", "Each connection uses memory; it hides the leak and can crash the server."],
            ["Restart PostgreSQL every hour", "That breaks everyone's work without fixing the cause."],
            ["Add more indexes", "Unrelated to connection limits."],
          ],
          at: 0,
          aftermath: "Week 15 sets up a pool in the Node.js backend.",
        }),
      },
      {
        id: "a-db-maintenance",
        title: "Basic maintenance and statistics",
        explain:
          "PostgreSQL's MVCC leaves DEAD ROWS behind every UPDATE and DELETE. VACUUM reclaims their space for reuse and keeps the transaction-id counter healthy; ANALYZE refreshes the planner's statistics. AUTOVACUUM does both automatically in the background and must stay on; check pg_stat_user_tables for tables with many dead tuples or no recent analyze. After a big load or delete, run VACUUM (ANALYZE) yourself. REINDEX rebuilds bloated indexes. Other routine work: watching disk space, applying minor version updates (18.x) promptly, and planning major upgrades (pg_upgrade). Below, a real VACUUM VERBOSE.",
        example: shown("pg-monitor", "SELECT relname, n_live_tup, n_dead_tup, last_vacuum IS NOT NULL AS vacuumed, last_analyze IS NOT NULL AS analyzed FROM pg_stat_user_tables ORDER BY relname;"),
        terminalExercise: term("pg-monitor", {
          only: [
            "VACUUM (VERBOSE, ANALYZE) students;",
            "SELECT relname, n_live_tup, n_dead_tup, last_vacuum IS NOT NULL AS vacuumed, last_analyze IS NOT NULL AS analyzed FROM pg_stat_user_tables ORDER BY relname;",
          ],
          goal: "Run the maintenance command that reclaims dead rows and refreshes the planner's statistics for the students table, with a full report of what it did.",
          accept: ["VACUUM (VERBOSE, ANALYZE) students;"],
          hint: "VACUUM with the VERBOSE and ANALYZE options.",
          success: "VACUUM reports pages and tuples examined and removed, then ANALYZE samples the live rows for the planner.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 83 · 14.21 – 14.22 · ENVIRONMENTS AND MIGRATIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l83-environments",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["14.21", "14.22"],
    title: "Environments and Migration Workflows",
    subtitle: "Development, testing and production, and changing them safely",
    estimatedMinutes: 40,
    intro:
      "Changes should reach production only after they have worked somewhere that does not matter. That needs separate environments, and a disciplined way to move schema changes between them.",
    atoms: [
      {
        id: "a-db-environments",
        title: "Environment separation: development, testing and production",
        explain:
          "DEVELOPMENT: each developer's own database (on their machine or in Docker), freely broken and rebuilt from scripts and sample data. TESTING (or staging): a shared copy shaped like production, where migrations and releases are rehearsed, with anonymised data. PRODUCTION: the real data, changed only by reviewed, automated releases, with personal admin accounts and audit logs. Each has its own server or database, its OWN credentials (a leaked development password must not open production), and configuration chosen by environment variables. Production data is never copied to development without anonymisation.",
        decision: decide({
          scenario: "To 'test with realistic data', a developer restores last night's production backup, with real names, phone numbers and payments, onto their laptop.",
          question: "What is wrong?",
          right: ["Personal data has left the protected environment without need or safeguards; use an anonymised copy or generated data", "Each copy of personal data must be justified and protected."],
          wrong: [
            ["Nothing: it is the company's own data", "Data protection law and least privilege still apply."],
            ["The backup is too old", "Age is not the issue."],
            ["Laptops cannot run PostgreSQL", "They can; that is not the problem."],
          ],
          at: 2,
          aftermath: "Anonymise on the way out of production: replace names and contacts, keep the shapes and volumes.",
        }),
      },
      {
        id: "a-db-migration-workflow",
        title: "Schema migration workflows",
        explain:
          "The workflow (Week 5 introduced migrations): write the change as a new numbered migration file in the application's repository; review it like code; run it against development, then testing, automatically in CI; then in production as part of the release, by the migration tool, which records it in a migrations table so it runs once. Make migrations BACKWARD-COMPATIBLE so old and new application versions can run during the deploy: add a nullable column first, deploy code that writes it, back-fill, then add NOT NULL in a later migration ('expand, then contract'). Never edit a migration that has already run anywhere; write a new one.",
        sqlLab: {
          setup: "CREATE TABLE schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());\nINSERT INTO schema_migrations (version) VALUES ('001_create_students');\nCREATE TABLE students (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, full_name text NOT NULL, email text NOT NULL UNIQUE);\nINSERT INTO students (full_name, email) VALUES ('Ada Obi', 'ada@example.com'), ('Bayo Adeyemi', 'bayo@example.com');",
          task:
            "Write the 'expand' step of a backward-compatible change as migration 002_add_phone: in one transaction, ADD COLUMN phone text (nullable, so the old application keeps working) and record '002_add_phone' in schema_migrations. Make it safe to run twice: use ADD COLUMN IF NOT EXISTS and INSERT … ON CONFLICT DO NOTHING.",
          starter: "BEGIN;\n\nCOMMIT;\n",
          solution: "BEGIN;\n\nALTER TABLE students ADD COLUMN IF NOT EXISTS phone text;\n\nINSERT INTO schema_migrations (version) VALUES ('002_add_phone')\nON CONFLICT (version) DO NOTHING;\n\nCOMMIT;\n",
          checks: [
            { label: "phone exists and is nullable", assert: "SELECT is_nullable = 'YES' FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'phone'" },
            { label: "The migration is recorded once", query: "SELECT version FROM schema_migrations ORDER BY version", ordered: true },
            { label: "The old application's INSERT (without phone) still works", accepts: "INSERT INTO students (full_name, email) VALUES ('Chi Okeke', 'chi@example.com')" },
            { label: "Running the migration twice is harmless", rerun: true },
          ],
          hint: "ALTER TABLE students ADD COLUMN IF NOT EXISTS phone text; and INSERT … ON CONFLICT (version) DO NOTHING; inside BEGIN … COMMIT.",
          successMessage: "Expand first: nothing breaks for the running application. The 'contract' step (NOT NULL) comes in a later release, after the data is filled.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 84 · 14.P · PRACTICAL: SECURE, BACK UP, RESTORE, VERIFY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "db-l84-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 9,
    covers: ["14.P"],
    title: "Week 14 Practical: Secure, Back Up, Restore and Verify",
    subtitle: "Application and admin roles, a tested restore, and a checklist",
    estimatedMinutes: 80,
    intro:
      "The checkpoint: separate application and administrator roles with restricted permissions, a backup restored into a separate environment and verified, and a security and recovery checklist.",
    atoms: [
      {
        id: "a-db-p14-roles",
        title: "Application and administrator roles",
        explain:
          "On the academy database, build the access model. academy_owner (NOLOGIN) must own the tables; academy_admins is a NOLOGIN group with full rights on the tables; ngozi_admin is a LOGIN member of academy_admins; academy_app is a LOGIN role that can read all tables, insert and update students, enrollments and payments, but delete nothing and change no structure; academy_reporting can only read, and never the payments table. Make academy_owner the owner of every table with ALTER TABLE … OWNER TO.",
        sqlLab: {
          setup: ACADEMY,
          task:
            "Create academy_owner (NOLOGIN), academy_admins (NOLOGIN), ngozi_admin (LOGIN, member of academy_admins), academy_app (LOGIN) and academy_reporting (LOGIN). Transfer ownership of all seven tables to academy_owner, grant ALL on all tables to academy_admins, grant academy_app SELECT on all tables plus INSERT and UPDATE on students, enrollments and payments, and grant academy_reporting SELECT on every table except payments.",
          starter: "-- roles\n\n-- ownership\n\n-- privileges\n",
          solution: "CREATE ROLE academy_owner NOLOGIN;\nCREATE ROLE academy_admins NOLOGIN;\nCREATE ROLE ngozi_admin LOGIN PASSWORD 'change-me-admin';\nGRANT academy_admins TO ngozi_admin;\nCREATE ROLE academy_app LOGIN PASSWORD 'change-me-app';\nCREATE ROLE academy_reporting LOGIN PASSWORD 'change-me-reporting';\n\nALTER TABLE students OWNER TO academy_owner;\nALTER TABLE courses OWNER TO academy_owner;\nALTER TABLE enrollments OWNER TO academy_owner;\nALTER TABLE lessons OWNER TO academy_owner;\nALTER TABLE lesson_completions OWNER TO academy_owner;\nALTER TABLE payments OWNER TO academy_owner;\nALTER TABLE certificates OWNER TO academy_owner;\n\nGRANT ALL ON ALL TABLES IN SCHEMA public TO academy_admins;\n\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO academy_app;\nGRANT INSERT, UPDATE ON students, enrollments, payments TO academy_app;\n\nGRANT SELECT ON students, courses, enrollments, lessons, lesson_completions, certificates TO academy_reporting;\n",
          checks: [
            { label: "academy_owner owns every table", assert: "SELECT bool_and(tableowner = 'academy_owner') FROM pg_tables WHERE schemaname = 'public'" },
            { label: "ngozi_admin can delete (through academy_admins)", accepts: as("ngozi_admin", "DELETE FROM lesson_completions WHERE student_id = 1 AND lesson_id = 1") },
            { label: "The app can record a payment", accepts: as("academy_app", "INSERT INTO payments (enrollment_id, amount, paid_on, method) VALUES (20, 40000, '2026-06-01', 'card')") },
            { label: "The app cannot delete students", rejects: as("academy_app", "DELETE FROM students WHERE id = 12"), code: "42501" },
            { label: "The app cannot change structure", rejects: as("academy_app", "ALTER TABLE students ADD COLUMN x int"), code: "42501" },
            { label: "The app cannot change course prices", rejects: as("academy_app", "UPDATE courses SET price = 1"), code: "42501" },
            { label: "Reporting can read enrollments", accepts: as("academy_reporting", "SELECT count(*) FROM enrollments") },
            { label: "Reporting cannot read payments", rejects: as("academy_reporting", "SELECT * FROM payments"), code: "42501" },
            { label: "Reporting cannot change anything", rejects: as("academy_reporting", "UPDATE students SET city = 'Lagos'"), code: "42501" },
          ],
          hint: "ALTER TABLE … OWNER TO academy_owner for each table; GRANT … ON ALL TABLES IN SCHEMA public for the broad grants; list tables explicitly for the narrow ones.",
          revealSolution: false,
          successMessage: "Nine checks across four roles: every account can do its job and nothing else.",
        },
      },
      {
        id: "a-db-p14-restore",
        title: "Back up, restore and verify",
        explain:
          "On your own server you will run the full cycle (see the task below). Here, confirm you know the verification step from the real recording: after restoring academy.dump into academy_restore_test, the checks must be run on the RESTORED database and compared with the source.",
        terminalExercise: term("pg-backup", {
          only: [
            "pg_dump -U postgres -d academy -F c -f academy.dump",
            "createdb -U postgres academy_restore_test",
            "pg_restore -U postgres -d academy_restore_test academy.dump",
            PSQL_LIVE,
            PSQL_RESTORE,
          ],
          goal: "Show the evidence that the restore succeeded: the restored copy's student count and payment total.",
          accept: [PSQL_RESTORE],
          near: [{ command: "pg_restore -U postgres -d academy_restore_test academy.dump", why: "pg_restore printing nothing means no errors, not that the data is complete. Verify the contents." }],
          hint: "Query academy_restore_test and compare with the same query on academy.",
          success: "5 students and 120,000.00 in both: a verified restore.",
        }),
      },
      {
        id: "a-db-p14-checklist",
        title: "The security and recovery checklist",
        explain:
          "A checklist turns this week into something an organisation can audit. It should cover: roles and who holds them; least-privilege grants per role; no application or person working as postgres; credentials in a secret store and rotated; listen_addresses and pg_hba.conf limited; TLS on for network connections; personal data minimised and masked for reporting; logging of failed logins and DDL; the backup schedule, retention and off-site copy; agreed RPO and RTO; the date of the last tested restore and how long it took; and the monitoring that alerts someone.",
        decision: decide({
          scenario: "An auditor reads your checklist. It lists nightly backups and 'restores are possible', but no date of a restore test.",
          question: "What will the auditor most likely conclude?",
          right: ["Recovery is unproven: without a recorded, timed restore test, the RTO and the backups themselves are assumptions", "Evidence beats intent."],
          wrong: [
            ["The checklist is complete", "The single most important proof is missing."],
            ["Backups are unnecessary if restores are possible", "Restores need backups."],
            ["Only the RPO matters", "Both RPO and RTO, and proof, matter."],
          ],
          at: 0,
          aftermath: "Record the date, duration and verification of every restore test.",
        }),
      },
    ],
    task: {
      title: "Week 14 practical: secure, back up, restore, verify",
      intro: "Do the full cycle on your own PostgreSQL server.",
      prompts: [
        "Create the roles from the lab on your academy database, then log in as each one with psql -U and show (with the real error messages) what each can and cannot do.",
        "Back up the database with pg_dump -F c and the roles with pg_dumpall --roles-only, restore both into a separate database (better: a second PostgreSQL in Docker), and verify row counts and payment totals match. Time the restore.",
        "Do the same with MySQL: mysqldump, load into a new database with source, and verify.",
        "Write your security and recovery checklist, including RPO and RTO and the date and duration of your restore test.",
        "Checkpoint: produce a security and recovery checklist and demonstrate a successful restore.",
      ],
      closing: "Next: Week 15, connecting a Node.js backend to PostgreSQL safely.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
