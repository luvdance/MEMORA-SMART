/**
 * THE SQL ENGINE — real PostgreSQL, statement by statement.
 *
 * Every SQL lab and example in the Relational Databases course runs on
 * PGlite: PostgreSQL 18 compiled to WebAssembly. It is not an imitation of
 * PostgreSQL. It is the PostgreSQL server itself, so every result, command
 * tag, NOTICE and error message a learner sees is what PostgreSQL really
 * produces.
 *
 * This module is PURE: it is handed a PGlite instance and never creates one,
 * so the same code runs in the browser (inside sqlWorker.js) and in Node,
 * where `npm run validate:content` proves every lab with it. A lab that
 * passes at build time therefore passes in the page, because it is the same
 * engine running the same statements.
 *
 * HOW A SCRIPT RUNS
 * The learner's SQL is split into statements and each one is sent on its own
 * with the simple-query protocol, exactly as psql does with a script. Each
 * statement auto-commits unless the script opened a transaction. The first
 * error stops the script (psql's ON_ERROR_STOP), and a transaction still open
 * when the script ends is rolled back, which is what PostgreSQL does when a
 * session disconnects. Values come back as PostgreSQL's own text output, so
 * a date reads 2026-01-15 and a boolean reads t, as in psql.
 */

/* ── Splitting a script into statements ─────────────────────────────────── */

const IDENT = /[A-Za-z0-9_$]/;

/**
 * Split SQL on top-level semicolons. Quotes ('…', E'…' with backslash
 * escapes), quoted identifiers ("…"), dollar quoting ($$…$$, $tag$…$tag$),
 * line comments and nested block comments are respected, so a PL/pgSQL body
 * full of semicolons stays one statement. Statements that hold only comments
 * are dropped. Each piece keeps its offset in the original text, so an error
 * position can be turned back into a line of the learner's editor.
 */
export function splitStatements(sql) {
  const text = String(sql ?? "");
  const out = [];
  let start = 0;
  let i = 0;
  let meaningful = false;
  const push = (end) => {
    if (meaningful) {
      const raw = text.slice(start, end);
      const lead = raw.length - raw.trimStart().length;
      out.push({ text: raw.trim(), start: start + lead });
    }
    meaningful = false;
  };
  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];
    if (c === "-" && next === "-") {
      const nl = text.indexOf("\n", i);
      i = nl === -1 ? text.length : nl + 1;
      continue;
    }
    if (c === "/" && next === "*") {
      let depth = 1;
      i += 2;
      while (i < text.length && depth) {
        if (text[i] === "/" && text[i + 1] === "*") { depth += 1; i += 2; }
        else if (text[i] === "*" && text[i + 1] === "/") { depth -= 1; i += 2; }
        else i += 1;
      }
      continue;
    }
    if (c === ";") {
      push(i);
      i += 1;
      start = i;
      continue;
    }
    if (!/\s/.test(c)) meaningful = true;
    if (c === "'") {
      const escapes = /[Ee]/.test(text[i - 1] || "") && !IDENT.test(text[i - 2] || "");
      i += 1;
      while (i < text.length) {
        if (escapes && text[i] === "\\") { i += 2; continue; }
        if (text[i] === "'") {
          if (text[i + 1] === "'") { i += 2; continue; }
          break;
        }
        i += 1;
      }
      i += 1;
      continue;
    }
    if (c === '"') {
      i += 1;
      while (i < text.length) {
        if (text[i] === '"') {
          if (text[i + 1] === '"') { i += 2; continue; }
          break;
        }
        i += 1;
      }
      i += 1;
      continue;
    }
    if (c === "$" && !IDENT.test(text[i - 1] || "")) {
      const m = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(text.slice(i));
      if (m) {
        const tag = m[0];
        const close = text.indexOf(tag, i + tag.length);
        i = close === -1 ? text.length : close + tag.length;
        continue;
      }
    }
    i += 1;
  }
  push(text.length);
  return out;
}

/** Remove comments, so a source check never matches a word in a comment. */
export function stripComments(sql) {
  return splitStatements(sql)
    .map((s) => s.text.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, ""))
    .join(";\n");
}

/* ── The wire protocol ──────────────────────────────────────────────────── */

const encoder = new TextEncoder();

/** A simple-query ('Q') message: what psql sends for each statement. */
function queryMessage(text) {
  const body = encoder.encode(text);
  const msg = new Uint8Array(body.length + 6);
  const view = new DataView(msg.buffer);
  msg[0] = 81; // 'Q'
  view.setInt32(1, body.length + 5);
  msg.set(body, 5);
  msg[msg.length - 1] = 0;
  return msg;
}

/** PostgreSQL's numeric types: right-aligned in a result, as psql does. */
export const NUMERIC_TYPES = new Set([20, 21, 23, 26, 700, 701, 790, 1700]);

function errorOf(m) {
  return {
    severity: m.severity || "ERROR",
    code: m.code || "",
    message: m.message || String(m),
    detail: m.detail || "",
    hint: m.hint || "",
    position: m.position ? Number(m.position) : 0,
    where: m.where || "",
    constraint: m.constraint || "",
    table: m.table || "",
    column: m.column || "",
  };
}

/**
 * Send ONE piece of SQL and collect everything PostgreSQL answered: result
 * sets (column names, type ids, rows of text values), command tags, NOTICEs
 * and errors. Never throws for a SQL error; it is returned instead.
 */
export async function sendQuery(db, text) {
  const notices = [];
  const results = [];
  let current = { fields: [], types: [], rows: [] };
  let error = null;
  let txStatus = "I";
  // NOTICEs arrive among the messages, so no onNotice callback (it would
  // report each one twice).
  const { messages } = await db.execProtocol(queryMessage(text), { throwOnError: false });
  for (const m of messages) {
    switch (m.name) {
      case "rowDescription":
        current = { fields: m.fields.map((f) => f.name), types: m.fields.map((f) => f.dataTypeID), rows: [] };
        break;
      case "dataRow":
        current.rows.push(m.fields.map((v) => (v === null ? null : String(v))));
        break;
      case "commandComplete":
        results.push({ ...current, tag: m.text, hasRows: current.fields.length > 0 });
        current = { fields: [], types: [], rows: [] };
        break;
      case "notice":
        notices.push(errorOf(m));
        break;
      case "error":
        error = errorOf(m);
        break;
      case "readyForQuery":
        txStatus = m.status;
        break;
      default:
        break;
    }
  }
  return { results, notices, error, txStatus };
}

/* ── Running a learner's script ─────────────────────────────────────────── */

/** psql meta-commands are not SQL; say so instead of showing a syntax error. */
function metaCommand(text) {
  const m = /^\\([a-zA-Z?+]+)/.exec(text.trim());
  return m ? `\\${m[1]}` : null;
}

function lineOf(sql, offset) {
  return sql.slice(0, offset).split("\n").length;
}

/**
 * Run a whole script, statement by statement.
 *
 *   stopOnError   stop at the first error (default), as psql -v ON_ERROR_STOP=1
 *   keepOpen      leave an open transaction open (the grader rolls back itself)
 *
 * Returns { steps, error, openTransaction, txStatus } where each step is
 * { sql, line, tag, fields, types, rows, hasRows, notices, error }.
 */
export async function runScript(db, sql, { stopOnError = true, keepOpen = false } = {}) {
  const steps = [];
  let firstError = null;
  let txStatus = "I";
  for (const stmt of splitStatements(sql)) {
    const line = lineOf(sql, stmt.start);
    const meta = metaCommand(stmt.text);
    if (meta) {
      const error = {
        severity: "ERROR",
        code: "META",
        message: `${meta} is a psql command, not SQL. psql runs it in a terminal; here, query the database with SQL (the Tables panel shows every table and column).`,
        detail: "",
        hint: "",
        position: 0,
        line,
      };
      steps.push({ sql: stmt.text, line, tag: "", fields: [], types: [], rows: [], hasRows: false, notices: [], error });
      firstError = firstError || error;
      if (stopOnError) break;
      continue;
    }
    const res = await sendQuery(db, stmt.text);
    txStatus = res.txStatus;
    const error = res.error
      ? { ...res.error, line: res.error.position ? lineOf(sql, stmt.start + res.error.position - 1) : line, column: res.error.column }
      : null;
    if (error && res.error.position) {
      // The text of the offending line and where in it PostgreSQL pointed.
      const at = stmt.start + res.error.position - 1;
      const lineStart = sql.lastIndexOf("\n", at - 1) + 1;
      const lineEnd = sql.indexOf("\n", at);
      error.lineText = sql.slice(lineStart, lineEnd === -1 ? sql.length : lineEnd);
      error.caret = at - lineStart;
    }
    const last = res.results[res.results.length - 1];
    if (res.results.length > 1) {
      // A statement the splitter could not separate: keep every result.
      for (const r of res.results.slice(0, -1)) steps.push({ sql: stmt.text, line, ...r, notices: [], error: null });
    }
    steps.push({
      sql: stmt.text,
      line,
      tag: last?.tag || "",
      fields: last?.fields || [],
      types: last?.types || [],
      rows: last?.rows || [],
      hasRows: Boolean(last?.hasRows),
      notices: res.notices,
      error,
    });
    if (error) {
      firstError = firstError || error;
      if (stopOnError) break;
    }
  }
  let openTransaction = false;
  if (txStatus !== "I") {
    openTransaction = true;
    if (!keepOpen) {
      await sendQuery(db, "ROLLBACK");
      txStatus = "I";
    }
  }
  return { steps, error: firstError, openTransaction, txStatus };
}

/** The last result set a script produced (the answer to "what did it return?"). */
export function lastResult(run) {
  for (let i = run.steps.length - 1; i >= 0; i -= 1) {
    if (run.steps[i].hasRows) return run.steps[i];
  }
  return null;
}

/* ── Displaying results ─────────────────────────────────────────────────── */

/** One row as psql would print it inline: (Ada, 20, NULL). */
export function rowText(row) {
  return `(${row.map((v) => (v === null ? "NULL" : v)).join(", ")})`;
}

/**
 * A result in psql's aligned format, column headers centred, numbers right
 * aligned, a (n rows) footer. Used for terminal-style output and in tests.
 */
export function formatTable(result) {
  if (!result?.hasRows) return result?.tag || "";
  const cells = result.rows.map((r) => r.map((v) => (v === null ? "" : v)));
  const widths = result.fields.map((f, i) => Math.max(f.length, ...cells.map((r) => r[i].length)));
  const numeric = result.types.map((t) => NUMERIC_TYPES.has(t));
  const head = result.fields
    .map((f, i) => {
      const pad = widths[i] - f.length;
      const left = Math.floor(pad / 2);
      return " ".repeat(left) + f + " ".repeat(pad - left);
    })
    .map((h) => ` ${h} `)
    .join("|");
  const rule = widths.map((w) => "-".repeat(w + 2)).join("+");
  const body = cells.map((r) =>
    r.map((v, i) => ` ${numeric[i] ? v.padStart(widths[i]) : v.padEnd(widths[i])} `).join("|")
  );
  const n = result.rows.length;
  return [head, rule, ...body, `(${n} ${n === 1 ? "row" : "rows"})`].map((l) => l.trimEnd()).join("\n");
}

/** An error laid out as psql prints it: ERROR, LINE with a caret, DETAIL, HINT. */
export function formatError(error) {
  if (!error) return "";
  const lines = [`${error.severity || "ERROR"}:  ${error.message}`];
  if (error.lineText !== undefined) {
    const label = `LINE ${error.line}: `;
    lines.push(label + error.lineText);
    lines.push(" ".repeat(label.length + (error.caret || 0)) + "^");
  }
  if (error.detail) lines.push(`DETAIL:  ${error.detail}`);
  if (error.hint) lines.push(`HINT:  ${error.hint}`);
  return lines.join("\n");
}

/* ── Comparing results ──────────────────────────────────────────────────── */

const key = (row) => JSON.stringify(row);

/**
 * Compare a learner's result with the model answer's. `ordered` when the task
 * asks for a sort order; `names` (default true) when column names matter.
 * Returns { ok, message } with a message a beginner can act on.
 */
export function compareResults(got, want, { ordered = false, names = true } = {}) {
  if (!want) return { ok: false, message: "The model answer returned no rows to compare with." };
  if (!got) {
    return { ok: false, message: "Your SQL did not return a result to check. End it with the SELECT (or RETURNING) the task asks for." };
  }
  const gotNames = got.fields.map((f) => f.toLowerCase());
  const wantNames = want.fields.map((f) => f.toLowerCase());
  if (names && gotNames.join("\u0000") !== wantNames.join("\u0000")) {
    return {
      ok: false,
      message: `Your result's columns are (${got.fields.join(", ")}); the task asks for (${want.fields.join(", ")}), in that order.`,
    };
  }
  if (!names && got.fields.length !== want.fields.length) {
    return {
      ok: false,
      message: `Your result has ${got.fields.length} column(s); the task needs ${want.fields.length}.`,
    };
  }
  if (got.rows.length !== want.rows.length) {
    return {
      ok: false,
      message: `Your query returned ${got.rows.length} row(s); it should return ${want.rows.length}.`,
    };
  }
  if (ordered) {
    for (let i = 0; i < want.rows.length; i += 1) {
      if (key(got.rows[i]) !== key(want.rows[i])) {
        const sameSet = got.rows.map(key).sort().join() === want.rows.map(key).sort().join();
        return {
          ok: false,
          message: sameSet
            ? `The right rows, in the wrong order: row ${i + 1} should be ${rowText(want.rows[i])}. Check your ORDER BY.`
            : `Row ${i + 1} should be ${rowText(want.rows[i])}, but yours is ${rowText(got.rows[i])}.`,
        };
      }
    }
    return { ok: true, message: "" };
  }
  const counts = new Map();
  for (const r of want.rows) counts.set(key(r), (counts.get(key(r)) || 0) + 1);
  for (const r of got.rows) {
    const k = key(r);
    if (!counts.get(k)) return { ok: false, message: `Your result has a row the task does not expect: ${rowText(r)}.` };
    counts.set(k, counts.get(k) - 1);
  }
  return { ok: true, message: "" };
}

/* ── The schema, for the Tables panel and the ERD ───────────────────────── */

const SCHEMA_SQL = `
SELECT c.table_schema, c.table_name, c.column_name, c.ordinal_position,
       format_type(a.atttypid, a.atttypmod) AS type, c.is_nullable,
       EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = a.attrelid AND i.indisprimary AND a.attnum = ANY (i.indkey)) AS pk,
       t.table_type
FROM information_schema.columns c
JOIN information_schema.tables t ON t.table_schema = c.table_schema AND t.table_name = c.table_name
JOIN pg_attribute a ON a.attrelid = (quote_ident(c.table_schema) || '.' || quote_ident(c.table_name))::regclass AND a.attname = c.column_name
WHERE c.table_schema NOT IN ('pg_catalog', 'information_schema') AND c.table_schema NOT LIKE 'pg_%'
ORDER BY c.table_schema, c.table_name, c.ordinal_position`;

const FK_SQL = `
SELECT con.conname, ns.nspname AS from_schema, cl.relname AS from_table,
       (SELECT string_agg(a.attname, ',' ORDER BY k.n) FROM unnest(con.conkey) WITH ORDINALITY k(attnum, n)
          JOIN pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = k.attnum) AS from_cols,
       fns.nspname AS to_schema, fcl.relname AS to_table,
       (SELECT string_agg(a.attname, ',' ORDER BY k.n) FROM unnest(con.confkey) WITH ORDINALITY k(attnum, n)
          JOIN pg_attribute a ON a.attrelid = con.confrelid AND a.attnum = k.attnum) AS to_cols,
       EXISTS (SELECT 1 FROM pg_constraint u WHERE u.conrelid = con.conrelid AND u.contype IN ('u','p')
          AND u.conkey::int2[] @> con.conkey::int2[] AND u.conkey::int2[] <@ con.conkey::int2[]) AS one_to_one,
       NOT EXISTS (SELECT 1 FROM unnest(con.conkey) k(attnum) JOIN pg_attribute a ON a.attrelid = con.conrelid
          AND a.attnum = k.attnum WHERE NOT a.attnotnull) AS required
FROM pg_constraint con
JOIN pg_class cl ON cl.oid = con.conrelid JOIN pg_namespace ns ON ns.oid = cl.relnamespace
JOIN pg_class fcl ON fcl.oid = con.confrelid JOIN pg_namespace fns ON fns.oid = fcl.relnamespace
WHERE con.contype = 'f'
ORDER BY 2, 3, 1`;

/**
 * Every table and view the learner can see, with columns (type, NOT NULL,
 * primary key) and foreign keys (with whether the link is one-to-one and
 * whether it is required). Read from the real catalog after each run.
 */
export async function describeSchema(db) {
  const cols = await sendQuery(db, SCHEMA_SQL);
  const fks = await sendQuery(db, FK_SQL);
  const tables = new Map();
  for (const [schema, table, column, , type, nullable, pk, kind] of cols.results[0]?.rows || []) {
    const name = schema === "public" ? table : `${schema}.${table}`;
    if (!tables.has(name)) tables.set(name, { name, view: kind !== "BASE TABLE", columns: [] });
    tables.get(name).columns.push({ name: column, type, notNull: nullable === "NO", pk: pk === "t", fk: false });
  }
  const links = [];
  for (const [name, fs, ft, fc, ts, tt, tc, oneToOne, required] of fks.results[0]?.rows || []) {
    const from = fs === "public" ? ft : `${fs}.${ft}`;
    const to = ts === "public" ? tt : `${ts}.${tt}`;
    const fromCols = fc.split(",");
    for (const col of tables.get(from)?.columns || []) if (fromCols.includes(col.name)) col.fk = true;
    links.push({ name, from, fromCols, to, toCols: tc.split(","), oneToOne: oneToOne === "t", required: required === "t" });
  }
  return { tables: [...tables.values()], links };
}

/* ── A fresh database, every run ────────────────────────────────────────── */

/**
 * Put a server back to the state of a brand-new PostgreSQL installation:
 * every schema, role, database and event trigger a script created is
 * dropped, the public schema is recreated exactly as initdb makes it, and
 * session and role settings are reset. Much faster than starting a server,
 * and every run, the learner's and the model answer's, starts from it.
 *
 * The session time zone is UTC, as on most servers, so a timestamptz prints
 * the same for every learner and at build time wherever the machine is.
 */
const RESET_SQL = `
RESET ROLE;
RESET SESSION AUTHORIZATION;
DISCARD ALL;
DO $reset$
DECLARE r record;
BEGIN
  FOR r IN SELECT evtname FROM pg_event_trigger LOOP
    EXECUTE format('DROP EVENT TRIGGER %I', r.evtname);
  END LOOP;
  FOR r IN SELECT nspname FROM pg_namespace
           WHERE nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
             AND nspname NOT LIKE 'pg\\_temp\\_%' AND nspname NOT LIKE 'pg\\_toast\\_temp\\_%' LOOP
    EXECUTE format('DROP SCHEMA %I CASCADE', r.nspname);
  END LOOP;
  FOR r IN SELECT rolname FROM pg_roles WHERE oid >= 16384 AND rolname <> current_user LOOP
    EXECUTE format('DROP OWNED BY %I CASCADE', r.rolname);
    EXECUTE format('DROP ROLE %I', r.rolname);
  END LOOP;
  EXECUTE format('ALTER ROLE %I RESET ALL', current_user);
END
$reset$;
ALTER DATABASE postgres RESET ALL;
GRANT CONNECT, TEMPORARY ON DATABASE postgres TO PUBLIC;
CREATE SCHEMA public AUTHORIZATION pg_database_owner;
COMMENT ON SCHEMA public IS 'standard public schema';
GRANT USAGE ON SCHEMA public TO PUBLIC;
DISCARD ALL;
SET TimeZone = 'UTC';`;

export async function resetDatabase(db) {
  const first = await sendQuery(db, "SELECT 1");
  if (first.txStatus !== "I") await sendQuery(db, "ROLLBACK");
  // DROP DATABASE cannot run inside a function, so databases go one by one.
  const dbs = await sendQuery(db, "SELECT quote_ident(datname) FROM pg_database WHERE datname NOT IN ('postgres', 'template0', 'template1')");
  for (const [name] of dbs.results[0]?.rows || []) await sendQuery(db, `DROP DATABASE ${name} WITH (FORCE)`);
  const run = await runScript(db, RESET_SQL);
  if (run.error) throw new Error(`Could not reset the lab database: ${formatError(run.error)}`);
}

/**
 * A `fresh` function over ONE server: each call resets it and applies the
 * setup. The returned handle's close() does nothing, so the grader can treat
 * it like a database of its own. Calls must not overlap.
 */
export function freshOn(db, setup = "") {
  return async () => {
    await resetDatabase(db);
    if (setup.trim()) {
      const run = await runScript(db, setup);
      if (run.error) throw new Error(`The lab's setup SQL fails: ${formatError(run.error)}`);
    }
    return { execProtocol: (...args) => db.execProtocol(...args), query: (...args) => db.query(...args), close: async () => {} };
  };
}

/* ── Grading a lab ──────────────────────────────────────────────────────── */

/**
 * Run one check's SQL on the learner's (or model's) database, then put the
 * session back as it was: an unfinished transaction is rolled back and any
 * SET ROLE is undone, so one check can never change what the next one sees.
 */
async function runCheck(db, sql) {
  const res = await runScript(db, sql, { keepOpen: true });
  if (res.txStatus !== "I") await sendQuery(db, "ROLLBACK");
  await sendQuery(db, "RESET ROLE");
  return res;
}

function firstValue(run) {
  const r = lastResult(run);
  return r?.rows?.[0]?.[0] ?? null;
}

/**
 * Grade a learner's SQL against a lab.
 *
 *   lab.checks   the checklist, run in order against the learner's database
 *   lab.solution the model answer, run first on its own fresh database when
 *                a check compares results
 *   fresh()      returns a fresh database with lab.setup applied (see
 *                freshOn); the grader closes every handle it opens and never
 *                holds two at once, so one server is enough
 *
 * Check kinds (each has a `label`, and an optional failure `message`):
 *   { result: true | { ordered, names } }   final result equals the model's
 *   { returns: { columns, minRows, maxRows, noNulls, differsFrom } }
 *                                           final result has this shape
 *   { query, ordered, names }               this query returns the same in both
 *   { assert }                              this query's first value is true
 *   { rejects, code?, error? }              this statement must fail
 *   { accepts }                             this statement must succeed
 *   { source, flags?, raw? } / { forbid, … } the SQL (comments stripped unless raw) must / must not match
 *   { noOpenTransaction: true }             the script must end its transaction
 *   { rerun: true }                         the script runs again without error
 */
/**
 * The model answer's side of every comparison, computed first on its own
 * fresh database: its final result, and the result of each `query` check,
 * with the statements of `rejects` / `accepts` checks played in the same
 * order so the model's database goes through what the learner's will.
 */
async function modelOutcomes(lab, fresh) {
  const checks = lab.checks || [];
  if (!checks.some((c) => c.result || c.query)) return null;
  const db = await fresh();
  try {
    const run = await runScript(db, lab.solution || "", { stopOnError: !lab.continueOnError });
    if (run.error && !lab.continueOnError && !lab.allowError) throw new Error(`The model answer fails: ${formatError(run.error)}`);
    const queries = {};
    for (const [i, check] of checks.entries()) {
      const statement = check.query || check.rejects || check.accepts;
      if (!statement) continue;
      const res = await runCheck(db, statement);
      if (check.query) {
        if (res.error) throw new Error(`Check "${check.label}" fails on the model answer: ${formatError(res.error)}`);
        queries[i] = lastResult(res);
      }
    }
    return { result: lastResult(run), queries };
  } finally {
    await db.close();
  }
}

export async function gradeLab(lab, sql, { fresh, schema: wantSchema = false } = {}) {
  const results = [];
  const model = await modelOutcomes(lab, fresh);
  const db = await fresh();
  try {
    // continueOnError: like psql's default, an error does not stop the script.
    const run = await runScript(db, sql, { stopOnError: !lab.continueOnError });
    const blocked = run.error && !lab.allowError && !lab.continueOnError;
    const text = stripComments(sql);
    for (const [index, check] of (lab.checks || []).entries()) {
      const label = check.label || "Check";
      const fail = (message) => results.push({ label, passed: false, message: check.message || message });
      const pass = () => results.push({ label, passed: true, message: "" });
      if (blocked && !check.source && !check.forbid) {
        results.push({ label, passed: false, message: "Your SQL stopped with an error before this could be checked. Fix the error shown under your results first." });
        continue;
      }
      if (check.source || check.forbid) {
        const re = new RegExp(check.source || check.forbid, check.flags ?? "i");
        // raw: test the SQL as written, comments included (a check ABOUT comments).
        const hit = re.test(check.raw ? sql : text);
        if (check.source ? hit : !hit) pass();
        else fail(check.source ? "Your SQL does not use what this check looks for." : "Your SQL uses something this task asks you not to.");
        continue;
      }
      if (check.rerun) {
        // A rebuild script must work on a database it has already built.
        const again = await runScript(db, sql);
        if (again.error) fail(`Running your script a second time fails: ${again.error.message}`);
        else pass();
        continue;
      }
      if (check.noOpenTransaction) {
        if (run.openTransaction) fail("Your script ended with a transaction still open, so PostgreSQL rolled it back. End it with COMMIT (or ROLLBACK).");
        else pass();
        continue;
      }
      if (check.returns) {
        // The SHAPE of the result, for tasks whose values are the learner's own.
        const r = lastResult(run);
        const want = check.returns;
        const names = (r?.fields || []).map((f) => f.toLowerCase());
        if (!r) fail("Your SQL did not return a result. End it with a SELECT.");
        else if (want.columns && names.join() !== want.columns.join()) fail(`Your result's columns are (${r.fields.join(", ")}); the task asks for (${want.columns.join(", ")}).`);
        else if (want.minRows !== undefined && r.rows.length < want.minRows) fail(`Your result has ${r.rows.length} row(s); the task needs at least ${want.minRows}.`);
        else if (want.maxRows !== undefined && r.rows.length > want.maxRows) fail(`Your result has ${r.rows.length} row(s); the task needs at most ${want.maxRows}.`);
        else if (want.noNulls && r.rows.some((row) => row.includes(null))) fail("Your result has an empty (NULL) value where the task needs one.");
        else if (want.differsFrom && r.rows.some((row) => row.includes(want.differsFrom))) fail(`Your result still shows "${want.differsFrom}". Change it to your own value.`);
        else pass();
        continue;
      }
      if (check.result) {
        const opts = check.result === true ? {} : check.result;
        const cmp = compareResults(lastResult(run), model.result, opts);
        if (cmp.ok) pass();
        else results.push({ label, passed: false, message: cmp.message });
        continue;
      }
      if (check.query) {
        const mine = await runCheck(db, check.query);
        if (mine.error) {
          fail(`Checking your database raised: ${mine.error.message}`);
          continue;
        }
        const cmp = compareResults(lastResult(mine), model.queries[index], { ordered: check.ordered, names: check.names ?? false });
        if (cmp.ok) pass();
        else fail(cmp.message);
        continue;
      }
      if (check.assert) {
        const res = await runCheck(db, check.assert);
        if (res.error) fail(`Checking your database raised: ${res.error.message}`);
        else if (firstValue(res) === "t") pass();
        else fail("Your database is not in the state this check expects.");
        continue;
      }
      if (check.rejects) {
        const res = await runCheck(db, check.rejects);
        const err = res.error;
        if (!err) fail(`PostgreSQL accepted data it should refuse: ${check.rejects.trim()}`);
        else if (check.code && err.code !== check.code) fail(`That statement failed, but for another reason: ${err.message}`);
        else if (check.error && !err.message.includes(check.error)) fail(`That statement failed, but for another reason: ${err.message}`);
        else pass();
        continue;
      }
      if (check.accepts) {
        const res = await runCheck(db, check.accepts);
        if (res.error) fail(`PostgreSQL refused something it should accept: ${res.error.message}`);
        else pass();
        continue;
      }
      throw new Error(`Unknown check kind in "${label}"`);
    }
    const schema = wantSchema ? await describeSchema(db) : null;
    return { passed: results.length > 0 && results.every((r) => r.passed), results, run, schema };
  } finally {
    await db.close();
  }
}

/** Run a script on a fresh database for display (Run button, examples). */
export async function runOnFresh(sql, { fresh, schema: wantSchema = false, stopOnError = true } = {}) {
  const db = await fresh();
  try {
    const run = await runScript(db, sql, { stopOnError });
    const schema = wantSchema ? await describeSchema(db) : null;
    return { run, schema };
  } finally {
    await db.close();
  }
}
