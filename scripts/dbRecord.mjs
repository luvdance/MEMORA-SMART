/**
 * Records the terminal sessions of the Relational Databases (RDBMS) course.
 *
 * Every terminal in the course shows what these commands REALLY printed: this
 * script starts real PostgreSQL 18.6 and MySQL 8.4 LTS servers (the official
 * Windows binaries, cached in ~/.cache/rdbms-course), runs the commands a
 * learner types (initdb, pg_ctl, psql, pg_dump, pg_restore, mysqld, mysql,
 * mysqldump, node, npm, curl.exe) and writes
 * src/academy/data/lessons/db-transcripts.js.
 *
 * What is normalised, and nothing else:
 *   - folders are shown where the Windows installers put them
 *     (C:\Program Files\PostgreSQL\18, C:\Program Files\MySQL\MySQL Server
 *     8.4, its data in C:\ProgramData) and the home folder as C:\Users\ada;
 *   - the operating-system user is shown as "ada";
 *   - Windows cmd's ^ escapes in initdb's closing hint are removed;
 *   - in two-session (concurrency) recordings, psql's "psql:<stdin>:N: "
 *     prefix on errors is removed, as an interactive psql prints them;
 *   - mysql's -vvv echo of each statement is removed (the prompt shows it).
 *
 * Passwords: psql reads them from a pgpass file and the mysql client from the
 * [client] section of my.ini, exactly as Week 2 teaches, so every command is
 * shown as typed and none prompts.
 *
 *   node scripts/dbRecord.mjs          (about 3 minutes; npm install needs the network)
 */
import { spawn, spawnSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, tmpdir, userInfo } from "node:os";
import { join } from "node:path";
import * as APP from "../src/academy/data/lessons/db-node-app.js";

const ROOT = new URL("../", import.meta.url);
const CACHE = process.env.DB_RECORD_CACHE || join(homedir(), ".cache", "rdbms-course");
const PG = join(CACHE, "pg", "pgsql");
const PG_BIN = join(PG, "bin");
const MY = join(CACHE, "mysql", "mysql-8.4.13-winx64");
const MY_BIN = join(MY, "bin");
for (const dir of [PG_BIN, MY_BIN]) {
  if (!existsSync(dir)) {
    throw new Error(
      `Missing ${dir}. Download postgresql-18.6-1-windows-x64-binaries.zip (EDB) into ${CACHE}/pg and mysql-8.4.13-winx64.zip into ${CACHE}/mysql.`
    );
  }
}

const base = mkdtempSync(join(tmpdir(), "db-record-"));
const home = join(base, "ada");
const pgdata = join(base, "pgdata");
const mydata = join(base, "mysql-data");
const pgpass = join(base, "pgpass.conf");
const scratch = join(base, "out");
mkdirSync(home);
mkdirSync(scratch);

export const PG_PASSWORD = "Postgres-dev-2026";
export const MY_PASSWORD = "MySQL-dev-2026";

/* ── Display: paths as a standard install shows them ──────────────────── */

const MAP = [
  [pgdata, "C:\\Program Files\\PostgreSQL\\18\\data"],
  [PG, "C:\\Program Files\\PostgreSQL\\18"],
  [mydata, "C:\\ProgramData\\MySQL\\MySQL Server 8.4\\Data"],
  [MY, "C:\\Program Files\\MySQL\\MySQL Server 8.4"],
  [home, "C:\\Users\\ada"],
  [base, "C:\\Users\\ada\\AppData\\Local\\Temp"],
];

/** Each spelling of a real path, paired with the display path in the same style. */
function variants(p, shown) {
  const back = p.replace(/\//g, "\\");
  const fwd = back.replace(/\\/g, "/");
  const bash = fwd.replace(/^([A-Za-z]):/, (m, d) => `/${d.toLowerCase()}`);
  const shownFwd = shown.replace(/\\/g, "/");
  return [
    [back, shown],
    [fwd, shownFwd],
    [bash, shownFwd],
    [back.toLowerCase(), shown],
    [fwd.toLowerCase(), shownFwd],
  ];
}

const USER = userInfo().username;

function clean(text) {
  let out = String(text)
    .replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r(?!\n)/g, "\n");
  // initdb's hint is escaped for cmd.exe (^"C^:^\…); show it plainly.
  out = out
    .split("\n")
    .map((line) => (line.includes('^"') ? line.replace(/\^(.)/g, "$1") : line))
    .join("\n");
  for (const [from, to] of MAP) {
    for (const [v, shownAs] of variants(from, to)) out = out.split(v).join(shownAs);
  }
  out = out.replace(new RegExp(`\\b${USER}\\b`, "g"), "ada");
  out = out.replace(/^psql:<stdin>:\d+: /gm, "");
  const lines = out.split("\n").map((l) => l.trimEnd());
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\s*\n/, "").trimEnd();
}

/* ── Running commands ─────────────────────────────────────────────────── */

const env = { ...process.env };
for (const k of Object.keys(env)) {
  if (/^(PG|MYSQL)/i.test(k)) delete env[k];
}
const pathKey = Object.keys(env).find((k) => k.toLowerCase() === "path") || "PATH";
env[pathKey] = [PG_BIN, MY_BIN, env[pathKey]].join(";");
env.PGPASSFILE = pgpass;
env.NO_COLOR = "1";
env.npm_config_fund = "false";
env.npm_config_update_notifier = "false";
env.npm_config_audit = "false";
env.GIT_AUTHOR_NAME = env.GIT_COMMITTER_NAME = "Ada Obi";
env.GIT_AUTHOR_EMAIL = env.GIT_COMMITTER_EMAIL = "ada@example.com";

// Whatever happens, leave no server running.
process.on("exit", () => {
  spawnSync(join(PG_BIN, "pg_ctl.exe"), ["-D", pgdata, "stop", "-m", "fast"], { stdio: "ignore", env, windowsHide: true });
  spawnSync(join(MY_BIN, "mysqladmin.exe"), ["shutdown"], { stdio: "ignore", env, windowsHide: true, timeout: 20000 });
});

let outSeq = 0;
/**
 * Run a program and return its stdout and stderr, interleaved as they were
 * written. Output goes to a file, not a pipe, so a server a command leaves
 * running (pg_ctl start) cannot hold the recording open.
 */
function exec(file, args, { cwd = home, input, timeout = 300000 } = {}) {
  const outFile = join(scratch, `${++outSeq}.txt`);
  const fd = openSync(outFile, "w");
  const res = spawnSync(file, args, {
    cwd,
    env,
    input,
    timeout,
    stdio: [input === undefined ? "ignore" : "pipe", fd, fd],
    windowsHide: true,
  });
  closeSync(fd);
  if (res.error) throw res.error;
  return readFileSync(outFile, "utf8");
}

const bin = (name) => {
  for (const dir of [PG_BIN, MY_BIN]) if (existsSync(join(dir, `${name}.exe`))) return join(dir, `${name}.exe`);
  return name;
};

const TRANSCRIPTS = {};
const DUETS = {};

function save(session, command, output) {
  const s = (TRANSCRIPTS[session] ||= {});
  if (command in s) throw new Error(`${session}: "${command}" recorded twice (a terminal maps each command to one output)`);
  s[command] = output;
  process.stdout.write(`[${session}] ${command.split("\n")[0]}\n${output.split("\n").slice(0, 4).map((l) => `    ${l}`).join("\n")}\n`);
}

/** A shell command, shown exactly as typed at a PowerShell prompt. */
function sh(session, shown, file, args, opts = {}) {
  const started = Date.now();
  const output = clean(exec(bin(file), args, opts));
  if (Date.now() - started > 20000) process.stdout.write(`    (took ${Math.round((Date.now() - started) / 1000)} s)
`);
  save(session, shown, opts.transform ? opts.transform(output) : output);
  return output;
}

/** A statement typed at a psql prompt (dbname=#). */
function psql(session, sql, { db = "academy", user = "postgres" } = {}) {
  return sh(session, sql, "psql", ["-X", "-U", user, "-d", db, "-c", sql]);
}

/** Run SQL as setup, not recorded. Throws if it fails. */
function psqlSetup(sql, { db = "academy" } = {}) {
  const out = exec(bin("psql"), ["-X", "-q", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", db], { input: sql });
  if (/ERROR/.test(out)) throw new Error(`setup SQL failed:\n${out}`);
}

/** A statement typed at a mysql> prompt. */
function mysql(session, sql, { db } = {}) {
  const args = ["--table", "-vvv"];
  if (db) args.push("-D", db);
  args.push("-e", sql);
  return sh(session, sql, "mysql", args, {
    transform: (out) =>
      out
        .replace(/^-{14}\n[\s\S]*?\n-{14}\n\n?/gm, "")
        .split("\n")
        .filter((l) => l !== "Bye")
        .join("\n")
        .replace(/^\s*\n/, "")
        .trimEnd(),
  });
}

function mysqlSetup(sql, { db } = {}) {
  const args = [];
  if (db) args.push("-D", db);
  args.push("-e", sql);
  const out = exec(bin("mysql"), args);
  if (/ERROR/.test(out)) throw new Error(`MySQL setup failed:\n${out}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Two psql sessions at once ────────────────────────────────────────── */

/**
 * Drive two live psql connections, A and B, step by step, and record what
 * each printed. A statement that does not finish within `wait` ms is
 * recorded as WAITING (blocked by the other session); its output is
 * recorded when it arrives, after a later step.
 */
async function duet(name, steps, { db = "academy" } = {}) {
  const sessions = {};
  for (const who of ["A", "B"]) {
    const child = spawn(bin("psql"), ["-X", "-U", "postgres", "-d", db], { cwd: home, env, windowsHide: true });
    const s = { child, buf: "", pending: null };
    child.stdout.on("data", (d) => (s.buf += d));
    child.stderr.on("data", (d) => (s.buf += d));
    sessions[who] = s;
  }
  const record = [];
  let mark = 0;
  const take = (s) => {
    const i = s.buf.indexOf(s.pending.marker);
    if (i === -1) return null;
    const out = s.buf.slice(0, i);
    s.buf = s.buf.slice(i + s.pending.marker.length).replace(/^\r?\n/, "");
    return clean(out);
  };
  const settle = async (ms) => {
    const until = Date.now() + ms;
    for (;;) {
      let any = false;
      for (const who of ["A", "B"]) {
        const s = sessions[who];
        if (!s.pending) continue;
        const out = take(s);
        if (out !== null) {
          s.pending.entry.output = out;
          if (s.pending.entry.waiting) record.push({ who, late: true, sql: s.pending.entry.sql, output: out });
          s.pending = null;
          any = true;
        }
      }
      if (!Object.values(sessions).some((s) => s.pending) || Date.now() > until) return any;
      await sleep(50);
    }
  };
  for (const step of steps) {
    const [who, sql, opts = {}] = step;
    const s = sessions[who];
    if (s.pending) throw new Error(`${name}: session ${who} is still waiting; it cannot take "${sql}"`);
    const marker = `__done_${++mark}__`;
    const entry = { who, sql, output: "", waiting: false };
    record.push(entry);
    s.pending = { marker, entry };
    s.child.stdin.write(`${sql}\n\\echo ${marker}\n`);
    await settle(opts.wait ?? 1500);
    if (s.pending) entry.waiting = true;
    // Let the other session report if this step released it.
    await settle(opts.release ?? 800);
  }
  await settle(3000);
  for (const s of Object.values(sessions)) {
    s.child.stdin.end("\\q\n");
  }
  DUETS[name] = record.map(({ who, sql, output, waiting, late }) => ({ who, sql, output, waiting: Boolean(waiting), late: Boolean(late) }));
  process.stdout.write(`[duet ${name}] ${record.length} steps\n`);
}

/* ═══════════════════════ POSTGRESQL ═══════════════════════ */

writeFileSync(join(home, "pg-password.txt"), `${PG_PASSWORD}\n`);

sh("pg-setup", "psql --version", "psql", ["--version"]);
sh("pg-setup", "pg_ctl --version", "pg_ctl", ["--version"]);
sh(
  "pg-setup",
  'initdb -D "C:\\Program Files\\PostgreSQL\\18\\data" -U postgres -A scram-sha-256 -E UTF8 --pwfile=pg-password.txt',
  "initdb",
  ["-D", pgdata, "-U", "postgres", "-A", "scram-sha-256", "-E", "UTF8", "--pwfile=pg-password.txt"]
);
sh("pg-setup", 'pg_ctl -D "C:\\Program Files\\PostgreSQL\\18\\data" -l server.log start', "pg_ctl", ["-D", pgdata, "-l", join(home, "server.log"), "start"]);
sh("pg-setup", 'pg_ctl -D "C:\\Program Files\\PostgreSQL\\18\\data" status', "pg_ctl", ["-D", pgdata, "status"]);
sh("pg-setup", "pg_isready", "pg_isready", []);
// Before the pgpass file exists: no password, no connection.
sh("pg-setup", 'psql -U postgres -w -c "SELECT version();"', "psql", ["-X", "-U", "postgres", "-w", "-c", "SELECT version();"]);
writeFileSync(pgpass, `localhost:5432:*:postgres:${PG_PASSWORD}\n`);
sh("pg-setup", 'psql -U postgres -c "SELECT version();"', "psql", ["-X", "-U", "postgres", "-c", "SELECT version();"]);
sh("pg-setup", "psql -U postgres -l", "psql", ["-X", "-U", "postgres", "-l"]);
sh("pg-setup", 'psql -U postgres -c "SHOW port;" -c "SHOW data_directory;"', "psql", ["-X", "-U", "postgres", "-c", "SHOW port;", "-c", "SHOW data_directory;"]);
sh("pg-setup", 'psql -U postgres -d academy -c "SELECT 1;"', "psql", ["-X", "-U", "postgres", "-d", "academy", "-c", "SELECT 1;"]);

/* psql at the postgres=# prompt: databases */
psql("psql-server", "CREATE DATABASE academy;", { db: "postgres" });
psql("psql-server", "\\l", { db: "postgres" });
psql("psql-server", "\\conninfo", { db: "postgres" });
psql("psql-server", "\\c academy", { db: "postgres" });
// NOTE: each recorded command is its own connection, so a command whose
// output depends on an earlier one in the same session (a SET, \c,
// LAST_INSERT_ID()) must be recorded together with it.
psql("psql-academy", "SELECT current_database(), current_user;");

/* psql at the academy=# prompt: schemas, a table, rows */
psql("psql-academy", "\\conninfo");
psql("psql-academy", "\\dn");
psql("psql-academy", "SHOW search_path;");
psql("psql-academy", "CREATE SCHEMA reporting;");
psql(
  "psql-academy",
  `CREATE TABLE students (
  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name       text NOT NULL,
  email           text NOT NULL UNIQUE,
  enrolled_on     date NOT NULL DEFAULT current_date,
  course_interest text
);`
);
psql("psql-academy", "\\dt");
psql("psql-academy", "\\d students");
psql(
  "psql-academy",
  `INSERT INTO students (full_name, email, enrolled_on, course_interest)
VALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'),
       ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03', 'Web Development');`
);
psql("psql-academy", "SELECT * FROM students;");
psql("psql-academy", "SELECT full_name AS student, enrolled_on FROM students;");
psql("psql-academy", "SELEC full_name FROM students;");
psql("psql-academy", "SELECT full_name FROM student;");
psql("psql-academy", "\\dn+");

/* PostgreSQL's side of the dialect comparison */
psql("pg-dialect", "SELECT 'Ada' || ' ' || 'Obi' AS full_name;");
psql("pg-dialect", "SELECT 7 / 2 AS whole, 7 / 2.0 AS exact;");
psql("pg-dialect", "SELECT full_name FROM students WHERE full_name LIKE 'a%';");
psql("pg-dialect", "SELECT full_name FROM students WHERE full_name ILIKE 'a%';");
psql("pg-dialect", "INSERT INTO students (full_name, email) VALUES ('Chi Okeke', 'chi@example.com') RETURNING id, enrolled_on;");
psql("pg-dialect", "SELECT now()::date AS today, true AS yes;");

/* ── Concurrency (Week 11) ── */
psqlSetup(`CREATE TABLE accounts (
  id      integer PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts VALUES (1, 'Ada', 5000.00), (2, 'Bayo', 3000.00);`);
const resetAccounts = () => psqlSetup("UPDATE accounts SET balance = CASE id WHEN 1 THEN 5000.00 ELSE 3000.00 END;");

await duet("no-dirty-reads", [
  ["A", "BEGIN;"],
  ["A", "UPDATE accounts SET balance = balance - 1000 WHERE id = 1;"],
  ["B", "SELECT balance FROM accounts WHERE id = 1;"],
  ["A", "COMMIT;"],
  ["B", "SELECT balance FROM accounts WHERE id = 1;"],
]);
resetAccounts();
await duet("lost-update", [
  ["A", "BEGIN;"],
  ["A", "SELECT balance FROM accounts WHERE id = 1;"],
  ["B", "BEGIN;"],
  ["B", "SELECT balance FROM accounts WHERE id = 1;"],
  ["A", "UPDATE accounts SET balance = 5500.00 WHERE id = 1;"],
  ["B", "UPDATE accounts SET balance = 4000.00 WHERE id = 1;"],
  ["A", "COMMIT;"],
  ["B", "COMMIT;"],
  ["A", "SELECT balance FROM accounts WHERE id = 1;"],
]);
resetAccounts();
await duet("atomic-update", [
  ["A", "BEGIN;"],
  ["A", "UPDATE accounts SET balance = balance + 500 WHERE id = 1;"],
  ["B", "BEGIN;"],
  ["B", "UPDATE accounts SET balance = balance - 1000 WHERE id = 1;"],
  ["A", "COMMIT;"],
  ["B", "COMMIT;"],
  ["A", "SELECT balance FROM accounts WHERE id = 1;"],
]);
resetAccounts();
await duet("for-update", [
  ["A", "BEGIN;"],
  ["A", "SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;"],
  ["B", "BEGIN;"],
  ["B", "SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;"],
  ["A", "UPDATE accounts SET balance = 5500.00 WHERE id = 1;"],
  ["A", "COMMIT;"],
  ["B", "UPDATE accounts SET balance = 4500.00 WHERE id = 1;"],
  ["B", "COMMIT;"],
  ["A", "SELECT balance FROM accounts WHERE id = 1;"],
]);
resetAccounts();
await duet("non-repeatable-read", [
  ["A", "BEGIN;"],
  ["A", "SELECT balance FROM accounts WHERE id = 2;"],
  ["B", "UPDATE accounts SET balance = 2500.00 WHERE id = 2;"],
  ["A", "SELECT balance FROM accounts WHERE id = 2;"],
  ["A", "COMMIT;"],
]);
resetAccounts();
await duet("repeatable-read", [
  ["A", "BEGIN ISOLATION LEVEL REPEATABLE READ;"],
  ["A", "SELECT balance FROM accounts WHERE id = 2;"],
  ["B", "UPDATE accounts SET balance = 2500.00 WHERE id = 2;"],
  ["A", "SELECT balance FROM accounts WHERE id = 2;"],
  ["A", "UPDATE accounts SET balance = balance - 100 WHERE id = 2;"],
  ["A", "ROLLBACK;"],
]);
resetAccounts();
await duet("deadlock", [
  ["A", "BEGIN;"],
  ["A", "UPDATE accounts SET balance = balance - 100 WHERE id = 1;"],
  ["B", "BEGIN;"],
  ["B", "UPDATE accounts SET balance = balance - 200 WHERE id = 2;"],
  ["A", "UPDATE accounts SET balance = balance + 100 WHERE id = 2;"],
  ["B", "UPDATE accounts SET balance = balance + 200 WHERE id = 1;", { wait: 3000 }],
  ["A", "ROLLBACK;"],
  ["B", "ROLLBACK;"],
]);
resetAccounts();

/* Durability and locks, seen from the server */
psql("pg-locks", "SHOW synchronous_commit;");
psql("pg-locks", "SHOW fsync;");
psql("pg-locks", "SHOW deadlock_timeout;");
psql("pg-locks", "SHOW default_transaction_isolation;");

/* ── Roles and permissions (Week 14) ── */
psqlSetup(`INSERT INTO students (full_name, email, enrolled_on, course_interest) VALUES
  ('Dayo Bello', 'dayo@example.com', '2026-03-01', 'Python'),
  ('Efe Okoro', 'efe@example.com', '2026-03-15', 'Data Analysis');
CREATE TABLE payments (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id integer NOT NULL REFERENCES students,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  paid_on date NOT NULL
);
INSERT INTO payments (student_id, amount, paid_on) VALUES (1, 45000, '2026-01-12'), (2, 45000, '2026-02-03'), (4, 30000, '2026-03-02');`);
psql("pg-roles", "CREATE ROLE academy_app LOGIN PASSWORD 'app-password-change-me';");
psql("pg-roles", "CREATE ROLE reporting LOGIN PASSWORD 'reporting-password-change-me';");
psql("pg-roles", "GRANT CONNECT ON DATABASE academy TO academy_app, reporting;");
psql("pg-roles", "GRANT USAGE ON SCHEMA public TO academy_app, reporting;");
psql("pg-roles", "GRANT SELECT, INSERT, UPDATE ON students, payments TO academy_app;");
psql("pg-roles", "GRANT SELECT ON students, payments TO reporting;");
psql("pg-roles", "REVOKE SELECT ON payments FROM reporting;");
psql("pg-roles", "\\du");
psql("pg-roles", "\\dp students");
psql("pg-roles", "\\dp payments");
psql("pg-roles", "SELECT line_number, type, database, user_name, address, auth_method FROM pg_hba_file_rules;");
psql("pg-roles", "SHOW listen_addresses;");
psql("pg-roles", "SHOW ssl;");
psql("pg-roles", "SHOW password_encryption;");
writeFileSync(
  pgpass,
  `localhost:5432:*:postgres:${PG_PASSWORD}\nlocalhost:5432:academy:academy_app:app-password-change-me\nlocalhost:5432:academy:reporting:reporting-password-change-me\n`
);
sh("pg-login", 'psql -U reporting -d academy -c "SELECT count(*) FROM students;"', "psql", ["-X", "-U", "reporting", "-d", "academy", "-c", "SELECT count(*) FROM students;"]);
sh("pg-login", 'psql -U reporting -d academy -c "SELECT sum(amount) FROM payments;"', "psql", ["-X", "-U", "reporting", "-d", "academy", "-c", "SELECT sum(amount) FROM payments;"]);
sh("pg-login", 'psql -U reporting -d academy -c "DELETE FROM students;"', "psql", ["-X", "-U", "reporting", "-d", "academy", "-c", "DELETE FROM students;"]);
sh("pg-login", 'psql -U academy_app -d academy -c "DELETE FROM students WHERE id = 4;"', "psql", ["-X", "-U", "academy_app", "-d", "academy", "-c", "DELETE FROM students WHERE id = 4;"]);
sh("pg-login", 'psql -U academy_app -d academy -c "DROP TABLE payments;"', "psql", ["-X", "-U", "academy_app", "-d", "academy", "-c", "DROP TABLE payments;"]);
sh("pg-login", 'psql "postgresql://reporting:wrong-password@localhost:5432/academy" -c "SELECT 1;"', "psql", ["-X", "postgresql://reporting:wrong-password@localhost:5432/academy", "-c", "SELECT 1;"]);

/* ── Monitoring and maintenance (Week 14) ── */
psql("pg-monitor", "SELECT pid, usename, application_name, state, left(query, 40) AS query FROM pg_stat_activity WHERE datname = 'academy';");
psql("pg-monitor", "SHOW max_connections;");
psql("pg-monitor", "SELECT numbackends, xact_commit, xact_rollback, deadlocks FROM pg_stat_database WHERE datname = 'academy';");
psql("pg-monitor", "SELECT pg_size_pretty(pg_database_size('academy')) AS size;");
psql("pg-monitor", "VACUUM (VERBOSE, ANALYZE) students;");
psql("pg-monitor", "SELECT relname, n_live_tup, n_dead_tup, last_vacuum IS NOT NULL AS vacuumed, last_analyze IS NOT NULL AS analyzed FROM pg_stat_user_tables ORDER BY relname;");
psql("pg-monitor", "SHOW log_min_duration_statement;");
sh("pg-monitor-shell", "Get-Content server.log -Tail 6", "powershell.exe", ["-NoProfile", "-Command", "Get-Content server.log -Tail 6"]);

/* ── Backups (Week 14) ── */
sh("pg-backup", "pg_dump -U postgres -d academy -F c -f academy.dump", "pg_dump", ["-U", "postgres", "-d", "academy", "-F", "c", "-f", "academy.dump"]);
sh("pg-backup", "pg_restore -l academy.dump", "pg_restore", ["-l", "academy.dump"]);
sh("pg-backup", "createdb -U postgres academy_restore_test", "createdb", ["-U", "postgres", "academy_restore_test"]);
sh("pg-backup", "pg_restore -U postgres -d academy_restore_test academy.dump", "pg_restore", ["-U", "postgres", "-d", "academy_restore_test", "academy.dump"]);
sh("pg-backup", 'psql -U postgres -d academy -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"', "psql", ["-X", "-U", "postgres", "-d", "academy", "-c", "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"]);
sh("pg-backup", 'psql -U postgres -d academy_restore_test -c "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"', "psql", ["-X", "-U", "postgres", "-d", "academy_restore_test", "-c", "SELECT count(*) AS students, (SELECT sum(amount) FROM payments) AS paid FROM students;"]);
sh("pg-backup", "pg_dump -U postgres -d academy --schema-only -f academy-schema.sql", "pg_dump", ["-U", "postgres", "-d", "academy", "--schema-only", "-f", "academy-schema.sql"]);
sh("pg-backup", 'Select-String -Path academy-schema.sql -Pattern "CREATE TABLE"', "powershell.exe", ["-NoProfile", "-Command", 'Select-String -Path academy-schema.sql -Pattern "CREATE TABLE"']);
sh("pg-backup", "pg_dumpall -U postgres --roles-only", "pg_dumpall", ["-U", "postgres", "--roles-only"]);
sh("pg-backup", "pg_dump -U postgres -d academy -F p -f academy.sql", "pg_dump", ["-U", "postgres", "-d", "academy", "-F", "p", "-f", "academy.sql"]);
sh("pg-backup", "pg_verifybackup --version", "pg_verifybackup", ["--version"]);

/* ═══════════════════════ MYSQL ═══════════════════════ */

const fwd = (p) => p.replace(/\\/g, "/");
const myIni = join(MY, "my.ini");
const iniBase = `[mysqld]\nbasedir=${fwd(MY)}\ndatadir=${fwd(mydata)}\nport=3306\n\n[client]\nuser=root\n`;
writeFileSync(myIni, iniBase);

sh("mysql-setup", "mysqld --version", "mysqld", ["--version"]);
sh("mysql-setup", "mysqld --initialize-insecure --console", "mysqld", ["--initialize-insecure", "--console"]);
const mysqlLog = openSync(join(base, "mysqld.log"), "w");
const mysqld = spawn(bin("mysqld"), ["--console"], { cwd: home, env, stdio: ["ignore", mysqlLog, mysqlLog], windowsHide: true });
for (let i = 0; ; i += 1) {
  await sleep(1000);
  if (/ready for connections/.test(readFileSync(join(base, "mysqld.log"), "utf8"))) break;
  if (i > 60) throw new Error("mysqld did not start");
}
sh("mysql-setup", "mysql --version", "mysql", ["--version"]);
sh("mysql-setup", 'mysql -u root -e "SELECT CURRENT_USER(), VERSION();"', "mysql", ["--table", "-u", "root", "-e", "SELECT CURRENT_USER(), VERSION();"]);
sh("mysql-setup", `mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${MY_PASSWORD}';"`, "mysql", ["-u", "root", "-e", `ALTER USER 'root'@'localhost' IDENTIFIED BY '${MY_PASSWORD}';`]);
sh("mysql-setup", 'mysql -u root -e "SELECT 1;"', "mysql", ["--table", "-u", "root", "-e", "SELECT 1;"]);
sh("mysql-setup", 'mysql -u root -p"MySQL-dev-2026" -e "SELECT 1;"', "mysql", ["--table", "-u", "root", `-p${MY_PASSWORD}`, "-e", "SELECT 1;"]);
// The [client] section now carries the password, as Week 2 shows.
writeFileSync(myIni, `${iniBase}password=${MY_PASSWORD}\n`);
sh("mysql-setup", 'mysql -e "SELECT CURRENT_USER(), VERSION();"', "mysql", ["--table", "-e", "SELECT CURRENT_USER(), VERSION();"]);
sh("mysql-setup", "mysqladmin status", "mysqladmin", ["status"]);
sh("mysql-setup", "my_print_defaults client", "my_print_defaults", ["client"], {
  // Never show a real password in a lesson, even a practice one.
  transform: (out) => out.replace(MY_PASSWORD, "*****"),
});

/* mysql> : databases, a table, rows */
mysql("mysql-server", "SHOW DATABASES;");
mysql("mysql-server", "CREATE DATABASE academy;");
mysql("mysql-basics", "SHOW DATABASES;");
const MY_TABLE = `CREATE TABLE students (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  enrolled_on     DATE NOT NULL DEFAULT (CURRENT_DATE),
  course_interest VARCHAR(100)
);`;
mysql("mysql-academy", MY_TABLE, { db: "academy" });
mysql("mysql-academy", "SHOW TABLES;", { db: "academy" });
mysql("mysql-academy", "DESCRIBE students;", { db: "academy" });
mysql(
  "mysql-academy",
  `INSERT INTO students (full_name, email, enrolled_on, course_interest)
VALUES ('Ada Obi', 'ada@example.com', '2026-01-12', 'Data Analysis'),
       ('Bayo Adeyemi', 'bayo@example.com', '2026-02-03', 'Web Development');`,
  { db: "academy" }
);
mysql("mysql-academy", "SELECT * FROM students;", { db: "academy" });
mysql("mysql-academy", "SELECT full_name AS student, enrolled_on FROM students;", { db: "academy" });
mysql("mysql-academy", "SELEC full_name FROM students;", { db: "academy" });
mysql("mysql-academy", "SHOW CREATE TABLE students\\G", { db: "academy" });

/* MySQL's side of the dialect comparison */
mysql("mysql-dialect", "SELECT 'Ada' || ' ' || 'Obi' AS full_name;", { db: "academy" });
mysql("mysql-dialect", "SELECT CONCAT('Ada', ' ', 'Obi') AS full_name;", { db: "academy" });
mysql("mysql-dialect", "SELECT 7 / 2 AS exact, 7 DIV 2 AS whole;", { db: "academy" });
mysql("mysql-dialect", "SELECT full_name FROM students WHERE full_name LIKE 'a%';", { db: "academy" });
mysql("mysql-dialect", "SELECT full_name FROM students WHERE full_name ILIKE 'a%';", { db: "academy" });
mysql("mysql-dialect", "INSERT INTO students (full_name, email) VALUES ('Chi Okeke', 'chi@example.com') RETURNING id;", { db: "academy" });
mysql("mysql-dialect", "INSERT INTO students (full_name, email) VALUES ('Chi Okeke', 'chi@example.com'); SELECT LAST_INSERT_ID();", { db: "academy" });
mysql("mysql-dialect", "SELECT CURDATE() AS today, TRUE AS yes;", { db: "academy" });
mysql("mysql-dialect", "INSERT INTO students (full_name, email) VALUES ('Ada Again', 'ada@example.com');", { db: "academy" });

/* mysqldump (Week 14) */
sh("mysql-backup", "mysqldump academy --result-file=academy-mysql.sql", "mysqldump", ["academy", "--result-file=academy-mysql.sql"]);
sh("mysql-backup", 'Select-String -Path academy-mysql.sql -Pattern "CREATE TABLE|INSERT INTO"', "powershell.exe", ["-NoProfile", "-Command", 'Select-String -Path academy-mysql.sql -Pattern "CREATE TABLE|INSERT INTO" | ForEach-Object { $_.Line.Substring(0, [Math]::Min(70, $_.Line.Length)) }']);
sh("mysql-backup", 'mysql -e "CREATE DATABASE academy_restore_test;"', "mysql", ["-e", "CREATE DATABASE academy_restore_test;"]);
sh("mysql-backup", "mysql academy_restore_test < academy-mysql.sql", "powershell.exe", ["-NoProfile", "-Command", "mysql academy_restore_test < academy-mysql.sql"]);
sh("mysql-backup", 'mysql academy_restore_test -e "source academy-mysql.sql"', "mysql", ["academy_restore_test", "-e", "source academy-mysql.sql"]);
sh("mysql-backup", 'mysql --table academy_restore_test -e "SELECT COUNT(*) FROM students;"', "mysql", ["--table", "academy_restore_test", "-e", "SELECT COUNT(*) FROM students;"]);

exec(bin("mysqladmin"), ["shutdown"]);
await new Promise((r) => mysqld.once("exit", r));
writeFileSync(myIni, "");

/* ═══════════════════════ NODE.JS + pg (Week 15) ═══════════════════════ */

psqlSetup("DROP DATABASE academy WITH (FORCE);", { db: "postgres" });
psqlSetup("DROP DATABASE academy_restore_test WITH (FORCE);", { db: "postgres" });
psqlSetup("DROP ROLE academy_app; DROP ROLE reporting; CREATE DATABASE academy;", { db: "postgres" });
psqlSetup(APP.SCHEMA_SQL);
const api = join(home, "students-api");
mkdirSync(api);
const npm = (args) => ["npm.cmd", args];
sh("node-app", "node --version", "node", ["--version"], { cwd: api });
sh("node-app", "npm init -y", "cmd.exe", ["/d", "/s", "/c", "npm init -y"], { cwd: api });
sh("node-app", "npm install pg dotenv", "cmd.exe", ["/d", "/s", "/c", "npm install pg dotenv"], { cwd: api });
void npm;
writeFileSync(join(api, ".env"), APP.ENV_FILE);
writeFileSync(join(api, ".gitignore"), APP.GITIGNORE);
writeFileSync(join(api, "db.js"), APP.DB_JS);
writeFileSync(join(api, "check.js"), APP.CHECK_JS);
writeFileSync(join(api, "server.js"), APP.SERVER_JS);
writeFileSync(join(api, "new-student.json"), APP.NEW_STUDENT_JSON);
writeFileSync(join(api, "duplicate.json"), APP.DUPLICATE_JSON);
writeFileSync(join(api, "invalid.json"), APP.INVALID_JSON);
writeFileSync(join(api, "change-email.json"), APP.PATCH_JSON);
sh("node-app", "node check.js", "node", ["check.js"], { cwd: api });
sh("node-app", "git init", "git", ["init", "-q"], { cwd: api, transform: (o) => o || "" });
sh("node-app", "git status --short", "git", ["status", "--short", "-uall"], { cwd: api, transform: (o) => o.split("\n").filter((l) => !l.includes("node_modules")).join("\n") });

const serverLog = join(base, "api.log");
const logFd = openSync(serverLog, "w");
const apiServer = spawn(process.execPath, ["server.js"], { cwd: api, env, stdio: ["ignore", logFd, logFd], windowsHide: true });
for (let i = 0; !/listening/.test(readFileSync(serverLog, "utf8")); i += 1) {
  await sleep(250);
  if (i > 40) throw new Error(`the API did not start:\n${readFileSync(serverLog, "utf8")}`);
}
save("node-app", "node server.js", clean(readFileSync(serverLog, "utf8")));
const curl = (shown, args) => sh("node-app", shown, "curl.exe", args, { cwd: api });
curl("curl.exe -s http://localhost:3000/students", ["-s", "http://localhost:3000/students"]);
curl("curl.exe -s http://localhost:3000/students/2", ["-s", "http://localhost:3000/students/2"]);
curl("curl.exe -s -i http://localhost:3000/students/99", ["-s", "-i", "http://localhost:3000/students/99"]);
const post = (file) => [
  `curl.exe -s -i -X POST http://localhost:3000/students -H "Content-Type: application/json" --data-binary "@${file}"`,
  ["-s", "-i", "-X", "POST", "http://localhost:3000/students", "-H", "Content-Type: application/json", "--data-binary", `@${file}`],
];
curl(...post("new-student.json"));
curl(...post("duplicate.json"));
curl(...post("invalid.json"));
curl(
  'curl.exe -s -X PATCH http://localhost:3000/students/3 -H "Content-Type: application/json" --data-binary "@change-email.json"',
  ["-s", "-X", "PATCH", "http://localhost:3000/students/3", "-H", "Content-Type: application/json", "--data-binary", "@change-email.json"]
);
curl("curl.exe -s -i -X DELETE http://localhost:3000/students/3", ["-s", "-i", "-X", "DELETE", "http://localhost:3000/students/3"]);
curl("curl.exe -s -i -X DELETE http://localhost:3000/students/3 --fail-with-body", ["-s", "-i", "-X", "DELETE", "http://localhost:3000/students/3", "--fail-with-body"]);
apiServer.kill();
sh("node-app", 'psql -U postgres -d academy -c "SELECT * FROM students ORDER BY id;"', "psql", ["-X", "-U", "postgres", "-d", "academy", "-c", "SELECT * FROM students ORDER BY id;"], { cwd: api });

/* ── Stop the server ── */
sh("pg-stop", 'pg_ctl -D "C:\\Program Files\\PostgreSQL\\18\\data" stop', "pg_ctl", ["-D", pgdata, "stop"]);

/* ═══════════════════════ WRITE ═══════════════════════ */

const header = `/**
 * RELATIONAL DATABASES — RECORDED TERMINAL SESSIONS
 *
 * GENERATED by scripts/dbRecord.mjs. Do not edit by hand: every output here is
 * what a real PostgreSQL 18.6 or MySQL 8.4 server, psql, mysql, pg_dump, node
 * or curl.exe printed. Paths are shown as on a standard Windows install and
 * the home folder as C:\\Users\\ada. Recorded ${new Date().toISOString().slice(0, 10)}.
 *
 * TRANSCRIPTS: session → { command as typed → output }.
 * DUETS: two psql sessions, A and B, driven step by step; a step that was
 * blocked by the other session is marked waiting, and its output arrives
 * later as a "late" step.
 */
`;
const body = `${header}
export const TRANSCRIPTS = ${JSON.stringify(TRANSCRIPTS, null, 2)};

export const DUETS = ${JSON.stringify(DUETS, null, 2)};

export default TRANSCRIPTS;
`;
writeFileSync(new URL("src/academy/data/lessons/db-transcripts.js", ROOT), body.replace(/\r?\n/g, "\r\n"));
console.log(`\nrecorded ${Object.keys(TRANSCRIPTS).length} sessions and ${Object.keys(DUETS).length} duets in ${base}`);
process.exit(0);
