/**
 * THE BACKEND LAB — route handlers on a real PostgreSQL database.
 *
 * Week 15 of the Relational Databases course connects an application to the
 * database. Its labs run the learner's JavaScript route handlers against the
 * same PostgreSQL 18 engine as every SQL lab, through two small stand-ins
 * with the real libraries' interfaces:
 *
 *   pool   node-postgres (pg): pool.query(text, params) → { rows, rowCount },
 *          pool.connect() → client with query() and release(), for
 *          transactions. $1, $2 … placeholders are sent as real bind
 *          parameters, so injection behaves exactly as with pg. Errors carry
 *          PostgreSQL's code, constraint, detail and column, as pg's do.
 *          Like pg, int8 (count(*)) and numeric arrive as STRINGS; dates
 *          arrive as 'YYYY-MM-DD' text (as with the type parser in Lesson 87).
 *   app    an Express-style router: app.get / post / put / patch / delete,
 *          :params, req.body, req.query, res.status().json() / send() /
 *          sendStatus().
 *
 * Checks send requests to the app in order and compare each response, and
 * the database afterwards, with what the model answer produced on its own
 * fresh database. The same code proves every lab in Node at build time.
 *
 * Pure module: given a database handle (engine.js freshOn), never creates one.
 */

/** Parsers that make PGlite's values look like node-postgres's defaults. */
const AS_TEXT = (value) => value;
const PG_LIKE_PARSERS = {
  20: AS_TEXT, // int8 (count(*), bigint): pg returns a string
  1700: AS_TEXT, // numeric: pg returns a string
  1082: AS_TEXT, // date: text, as with types.setTypeParser in Lesson 87
  1114: AS_TEXT, // timestamp
  1184: AS_TEXT, // timestamptz
  1186: AS_TEXT, // interval
};

/** An error shaped like node-postgres's DatabaseError. */
function pgError(err) {
  const e = new Error(err?.message || String(err));
  for (const k of ["code", "detail", "hint", "constraint", "table", "column", "severity", "position"]) {
    if (err && err[k] !== undefined) e[k] = err[k];
  }
  return e;
}

export function makePool(db, log = []) {
  const query = async (text, params = []) => {
    if (typeof text === "object" && text !== null) {
      params = text.values || [];
      text = text.text;
    }
    log.push({ text, params });
    try {
      const res = await db.query(text, params, { parsers: PG_LIKE_PARSERS });
      return { rows: res.rows, rowCount: res.affectedRows ?? res.rows.length, fields: res.fields };
    } catch (err) {
      throw pgError(err);
    }
  };
  return {
    query,
    async connect() {
      return { query, release() {} };
    },
    async end() {},
  };
}

/* ── A small Express-style router ──────────────────────────────────────── */

function compile(path) {
  const keys = [];
  const pattern = path
    .split("/")
    .map((part) => {
      if (part.startsWith(":")) {
        keys.push(part.slice(1));
        return "([^/]+)";
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return { re: new RegExp(`^${pattern}/?$`), keys };
}

export function makeApp() {
  const routes = [];
  const add = (method) => (path, handler) => routes.push({ method, ...compile(path), handler, path });
  const app = {
    get: add("GET"),
    post: add("POST"),
    put: add("PUT"),
    patch: add("PATCH"),
    delete: add("DELETE"),
    /** Send one request; resolves with { status, body } (body parsed from JSON when it is JSON). */
    async request({ method = "GET", path = "/", body }) {
      const url = new URL(path, "http://lab.local");
      const route = routes.find((r) => r.method === method.toUpperCase() && r.re.test(url.pathname));
      if (!route) return { status: 404, body: { error: `Cannot ${method.toUpperCase()} ${url.pathname}` } };
      const m = route.re.exec(url.pathname);
      const params = Object.fromEntries(route.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      const req = { method: method.toUpperCase(), path: url.pathname, params, query: Object.fromEntries(url.searchParams), body: body ?? {} };
      let status = 200;
      let sent = null;
      const res = {
        status(code) {
          status = code;
          return res;
        },
        json(obj) {
          sent = { status, body: JSON.parse(JSON.stringify(obj ?? null)) };
          return res;
        },
        send(text) {
          sent = { status, body: text === undefined ? "" : text };
          return res;
        },
        sendStatus(code) {
          status = code;
          sent = { status, body: "" };
          return res;
        },
        end() {
          sent = sent || { status, body: "" };
          return res;
        },
      };
      try {
        await route.handler(req, res);
      } catch (err) {
        return { status: 500, body: { error: "Unhandled error in the route", detail: err?.message || String(err) }, crashed: true };
      }
      return sent || { status: 500, body: { error: "The route never sent a response" }, crashed: true };
    },
  };
  return app;
}

/* ── Running learner code ──────────────────────────────────────────────── */

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/**
 * Load route code into a new app over `db`. The code sees `app`, `pool` and
 * `console` (whose output is captured). Returns { app, error, logs, queries }.
 */
export async function loadRoutes(db, code) {
  const logs = [];
  const queries = [];
  const consoleShim = {
    log: (...a) => logs.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")),
    error: (...a) => logs.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")),
  };
  consoleShim.warn = consoleShim.error;
  consoleShim.info = consoleShim.log;
  const app = makeApp();
  const pool = makePool(db, queries);
  try {
    await new AsyncFunction("app", "pool", "console", code)(app, pool, consoleShim);
    return { app, error: null, logs, queries };
  } catch (err) {
    return { app, error: err?.message || String(err), logs, queries };
  }
}

/** JSON with sorted keys, so { a, b } equals { b, a }. */
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

const show = (body) => (typeof body === "string" ? JSON.stringify(body) : canonical(body));

/**
 * Grade a backend lab. lab = { setup, solution, checks }, where each check is
 *   { label, request: { method, path, body }, expect?: { status, body } }
 *       the response must equal `expect` if given, otherwise the model's
 *   { label, request, status }               only the status must match
 *   { label, query, ordered? }               SQL run afterwards; same rows as the model's database
 *   { label, source | forbid, flags? }       the code must / must not match
 * `fresh()` returns a database handle with lab.setup applied (engine.js freshOn).
 */
export async function gradeApi(lab, code, { fresh, runScript, lastResult, compareResults }) {
  const checks = lab.checks || [];
  const model = {};
  {
    const db = await fresh();
    const loaded = await loadRoutes(db, lab.solution || "");
    if (loaded.error) throw new Error(`The model answer does not load: ${loaded.error}`);
    for (const [i, check] of checks.entries()) {
      if (check.request) model[i] = await loaded.app.request(check.request);
      if (check.query) {
        const r = await runScript(db, check.query);
        if (r.error) throw new Error(`Check "${check.label}" fails on the model answer: ${r.error.message}`);
        model[i] = lastResult(r);
      }
    }
  }
  const db = await fresh();
  const loaded = await loadRoutes(db, code);
  const results = [];
  const exchanges = [];
  for (const [i, check] of checks.entries()) {
    const label = check.label || "Check";
    const pass = () => results.push({ label, passed: true, message: "" });
    const fail = (message) => results.push({ label, passed: false, message: check.message || message });
    if (check.source || check.forbid) {
      const hit = new RegExp(check.source || check.forbid, check.flags ?? "").test(code);
      if (check.source ? hit : !hit) pass();
      else fail(check.source ? "Your code does not use what this check looks for." : "Your code uses something this task asks you not to.");
      continue;
    }
    if (loaded.error) {
      fail(`Your code stopped with an error while loading: ${loaded.error}`);
      continue;
    }
    if (check.request) {
      const got = await loaded.app.request(check.request);
      exchanges.push({ request: check.request, response: got });
      const want = check.expect || model[i];
      const req = `${(check.request.method || "GET").toUpperCase()} ${check.request.path}`;
      if (got.status !== (check.status ?? want.status)) {
        fail(`${req} answered ${got.status}; it should answer ${check.status ?? want.status}.${got.crashed ? ` (${got.body.detail || got.body.error})` : ""}`);
      } else if (check.status === undefined && check.expect?.body !== undefined && show(got.body) !== show(check.expect.body)) {
        fail(`${req} answered ${show(got.body)}; it should answer ${show(check.expect.body)}.`);
      } else if (check.status === undefined && !check.expect && show(got.body) !== show(want.body)) {
        fail(`${req} answered ${show(got.body)}; it should answer ${show(want.body)}.`);
      } else pass();
      continue;
    }
    if (check.query) {
      const r = await runScript(db, check.query);
      if (r.error) {
        fail(`Checking the database raised: ${r.error.message}`);
        continue;
      }
      const cmp = compareResults(lastResult(r), model[i], { ordered: check.ordered, names: false });
      if (cmp.ok) pass();
      else fail(`The database is not in the expected state: ${cmp.message}`);
      continue;
    }
    throw new Error(`Unknown check kind in "${label}"`);
  }
  return { passed: results.length > 0 && results.every((r) => r.passed), results, exchanges, logs: loaded.logs, loadError: loaded.error, queries: loaded.queries };
}

/** Run the code and send the lab's requests, for the Run button (ungraded). */
export async function tryApi(lab, code, { fresh }) {
  const db = await fresh();
  const loaded = await loadRoutes(db, code);
  const exchanges = [];
  if (!loaded.error) {
    for (const check of lab.checks || []) {
      if (check.request) exchanges.push({ request: check.request, response: await loaded.app.request(check.request) });
    }
  }
  return { exchanges, logs: loaded.logs, loadError: loaded.error, queries: loaded.queries };
}
