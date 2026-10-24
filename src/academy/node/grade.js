/**
 * GRADING A BACKEND LAB
 *
 * A backend lab (`nodeLab` in a lesson) is a Node.js project: its files, the
 * command that starts it (npm start, node server.js, npm test), and checks
 * written as requirements. Grading starts the learner's project on a fresh
 * lab machine — fresh files, a fresh copy of the lab's database — runs the
 * command, then runs each check in order against the running process:
 *
 *   { label: "GET /courses lists the open courses",
 *     check: `const r = await get("/courses");
 *             eq(r.status, 200, "GET /courses should answer 200 OK");
 *             eq(r.body.length, 3, "It should list the 3 open courses");` }
 *
 * Checks share one running process, as requests to a real server do; a
 * check can call restart() for a fresh start (files and database kept).
 *
 * PURE: given createMachine (the runtime bundle) and freshDatabase(setup)
 * (a PGlite handle with the lab's SQL applied), it runs the same in the
 * browser's lab worker and in Node, where `npm run validate:content` proves
 * every lab: the model answer must pass every check and the starter must
 * fail at least one.
 */

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const DB_DEFAULTS = { user: "academy_app", password: "app-password", database: "academy", host: "localhost", port: 5432 };

/** The project the learner submitted: starter files overlaid with their edits. */
export function projectFiles(lab, files) {
  return { ...(lab.files || {}), ...(files || {}) };
}

/** The model answer's project: starter files overlaid with the solution's. */
export function solvedFiles(lab) {
  const out = { ...(lab.files || {}) };
  for (const [name, content] of Object.entries(lab.solution || {})) {
    if (content === null) delete out[name];
    else out[name] = content;
  }
  return out;
}

/** The command a lab runs: its own, else npm start / npm test, else node on the main file. */
export function labCommand(lab, files) {
  if (lab.command === false) return false;
  if (lab.command) return lab.command;
  let pkg = {};
  try {
    pkg = JSON.parse(files["package.json"] || "{}");
  } catch {
    pkg = {};
  }
  if (pkg.scripts?.start) return "npm start";
  if (pkg.scripts?.test && !files["server.js"] && !files["index.js"]) return "npm test";
  const main = pkg.main || ["server.js", "index.js", "app.js", "src/server.js", "src/index.js", "main.js"].find((f) => files[f] !== undefined) || "index.js";
  return `node ${main}`;
}

export function databaseConfig(lab) {
  if (!lab.db) return null;
  const spec = typeof lab.db === "string" ? { setup: lab.db } : lab.db;
  return { ...DB_DEFAULTS, ...spec };
}

/** DATABASE_URL for a lab's database, as the starter .env would hold it. */
export function databaseUrl(lab) {
  const d = databaseConfig(lab);
  return d ? `postgres://${d.user}:${d.password}@${d.host}:${d.port}/${d.database}` : null;
}

/* ── .gitignore (and .dockerignore) matching, by Git's rules ──────── */

function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        if (glob[i + 2] === "/") {
          re += "(?:.*/)?";
          i += 2;
        } else {
          re += ".*";
          i += 1;
        }
      } else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else if (c === "[") {
      const end = glob.indexOf("]", i);
      if (end === -1) re += "\\[";
      else {
        re += glob.slice(i, end + 1).replace(/^\[!/, "[^");
        i = end;
      }
    } else re += c.replace(/[.+^${}()|\\]/g, "\\$&");
  }
  return new RegExp(`^${re}$`);
}

/**
 * Is `path` (relative to the project, e.g. "node_modules/express/index.js")
 * ignored by these .gitignore rules? Git's rules: # comments, ! re-includes,
 * a trailing / matches directories only, a pattern with a / before its end
 * is relative to the project root, otherwise it matches a name at any depth,
 * the last matching rule wins, and nothing inside an ignored directory can
 * be re-included.
 */
export function isIgnored(text, path) {
  const rules = [];
  for (const raw of String(text).split(/\r?\n/)) {
    let line = raw.replace(/\s+$/, "");
    if (!line || line.startsWith("#")) continue;
    let negate = false;
    if (line.startsWith("!")) {
      negate = true;
      line = line.slice(1);
    }
    const dirOnly = line.endsWith("/");
    if (dirOnly) line = line.slice(0, -1);
    const anchored = line.includes("/");
    if (line.startsWith("/")) line = line.slice(1);
    rules.push({ negate, dirOnly, anchored, re: globToRegExp(line) });
  }
  const decide = (p, isDir) => {
    let result = false;
    const name = p.split("/").pop();
    for (const r of rules) {
      if (r.dirOnly && !isDir) continue;
      if (r.re.test(r.anchored ? p : name)) result = !r.negate;
    }
    return result;
  };
  const parts = String(path).replace(/^\.?\//, "").replace(/\/$/, "").split("/");
  for (let i = 1; i < parts.length; i++) if (decide(parts.slice(0, i).join("/"), true)) return true;
  return decide(parts.join("/"), String(path).endsWith("/"));
}

/* ── The helpers a check can use ───────────────────────────────────── */

class CheckFailure extends Error {}

function fmt(v) {
  try {
    return typeof v === "string" ? JSON.stringify(v) : JSON.stringify(v, (k, x) => (typeof x === "bigint" ? `${x}n` : x));
  } catch {
    return String(v);
  }
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

function makeHelpers(state) {
  const m = () => state.machine;
  const req = (method) => (path, a, b) => {
    // post("/x", { json }) or post("/x", body, { headers })
    let opts = {};
    if (a && typeof a === "object" && ("json" in a || "body" in a || "headers" in a || "port" in a) && !Array.isArray(a)) opts = a;
    else if (a !== undefined) opts = { json: a, ...(b || {}) };
    return m().request({ method, path, ...opts });
  };
  const helpers = {
    request: (method, path, opts = {}) => m().request({ method, path, ...opts }),
    get: req("GET"),
    post: req("POST"),
    put: req("PUT"),
    patch: req("PATCH"),
    del: req("DELETE"),
    head: req("HEAD"),
    options: req("OPTIONS"),
    output: () => m().outputText(),
    stdout: () => m().stdout(),
    stderr: () => m().stderr(),
    exitCode: () => m().exitCode,
    exited: () => m().exited,
    file: (p) => {
      const n = m().vol.node(p.startsWith("/") ? p : `/app/${p}`);
      return n && n.type === "file" ? n.data.toString("utf8") : null;
    },
    exists: (p) => Boolean(m().vol.node(p.startsWith("/") ? p : `/app/${p}`)),
    files: () => m().vol.snapshot(),
    source: (p) => state.files[p] ?? null,
    load: (p) => m().load(p),
    wait: (promise) => m().wait(promise),
    typecheck: async () => {
      if (!m().extensions.typecheck) throw new CheckFailure("TypeScript is not available in this lab.");
      return (await m().extensions.typecheck(m().vol.snapshot())).diagnostics;
    },
    advance: (ms) => m().advance(ms),
    idle: () => m().idle(),
    now: () => m().loop.now(),
    kill: async (signal = "SIGTERM") => {
      m().signal(signal);
      await m().settleScript?.();
      await m().idle();
    },
    restart: async (command) => {
      await state.restart(command);
    },
    run: async (command) => {
      await state.restart(command);
    },
    sql: async (text, params = []) => {
      if (!state.db) throw new CheckFailure("This lab has no database.");
      const r = await state.db.query(text, params);
      return r.rows;
    },
    outgoing: () => m().network.log.slice(),
    service: (origin) => m().service(origin),
    emails: () => m().mailbox.slice(),
    redisKeys: () => [...(m().redisData?.strings.keys() || [])],
    tests: () => m().testResults || [],
    runTests: async (command = "npm test") => {
      await state.restart(command);
      return m().testResults || [];
    },
    ws: (path, port) => {
      const W = m().extensions.WebSocket;
      const url = `ws://localhost:${port || m().network.firstPort() || 3000}${path}`;
      const client = new W(url);
      const messages = [];
      let closed = null;
      client.onmessage = (e) => messages.push(typeof e.data === "string" ? e.data : "[binary]");
      client.onclose = (e) => (closed = e);
      const opened = new Promise((resolve) => {
        client.onopen = () => resolve(true);
        client.onerror = () => resolve(false);
      });
      return {
        opened: () => m().loop.settle(opened).then(() => opened),
        messages,
        json: () => messages.map((x) => JSON.parse(x)),
        send: async (data) => {
          client.send(typeof data === "string" ? data : JSON.stringify(data));
          await m().idle();
        },
        close: async () => {
          client.close();
          await m().idle();
        },
        closed: () => closed,
        waitFor: async (n = 1, ms = 5000) => {
          const until = new Promise((resolve) => {
            const t0 = m().loop.now();
            const tick = () => (messages.length >= n || m().loop.now() - t0 > ms ? resolve() : m().loop.setTimeout(tick, 10));
            tick();
          });
          await m().loop.settle(until, { limit: ms + 100 });
          return messages;
        },
      };
    },
    together: (...promises) => Promise.all(promises),
    sleep: (ms) => m().advance(ms),
    assert: (cond, message) => {
      if (!cond) throw new CheckFailure(message || "A check failed.");
    },
    eq: (actual, expected, message) => {
      if (!deepEqual(actual, expected)) throw new CheckFailure(`${message || "Not what was expected"} (got ${fmt(actual)}, expected ${fmt(expected)})`);
    },
    has: (text, part, message) => {
      if (!String(text ?? "").includes(part)) throw new CheckFailure(message || `Expected to find ${fmt(part)}`);
    },
    lacks: (text, part, message) => {
      if (String(text ?? "").includes(part)) throw new CheckFailure(message || `Did not expect ${fmt(part)}`);
    },
    fail: (message) => {
      throw new CheckFailure(message);
    },
    json: (v) => JSON.stringify(v),
    ignored: (rules, path) => isIgnored(rules, path),
    /** The text of a Markdown "## heading" section (up to the next ## heading), or null. */
    section: (markdown, heading) => {
      const lines = String(markdown ?? "").split(/\r?\n/);
      const at = lines.findIndex((l) => new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i").test(l));
      if (at === -1) return null;
      const end = lines.findIndex((l, i) => i > at && /^##\s/.test(l));
      return lines.slice(at + 1, end === -1 ? lines.length : end).join("\n");
    },
    /** True when TypeScript code uses the type any (: any, <any>, any[], as any …), not the word "many". */
    usesAny: (code) => /(?:[:<,|&(]|\bas)\s*any\b(?!\w)|\bany\s*\[\]|<any>/.test(String(code).replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, "")),
  };
  return helpers;
}

/**
 * Run a project and its checks. Returns { passed, checks: [{ index, label,
 * passed, message }], output, exitCode }.
 *
 *   createMachine(opts)        the runtime bundle's factory
 *   freshDatabase(setup)       → a PGlite handle with `setup` applied (or null)
 */
export async function runLab(lab, files, { createMachine, freshDatabase, onOutput } = {}) {
  const dbConf = databaseConfig(lab);
  const state = { files, db: null, machine: null, restart: null };
  if (dbConf) state.db = await freshDatabase(dbConf.setup || "");
  const env = { ...(lab.env || {}) };
  const make = () => {
    const machine = createMachine({
      files: state.machine ? state.machine.vol.snapshot() : files,
      env,
      database: state.db ? { db: state.db, ...dbConf, version: "18.0" } : null,
      services: lab.services,
      stdin: lab.stdin,
      redis: lab.redis ? (lab.redis === true ? {} : lab.redis) : null,
      mail: lab.mail ? (lab.mail === true ? {} : lab.mail) : null,
      strictDependencies: lab.strictDependencies,
      serviceInstances: state.machine?.network.services,
    });
    if (state.machine?.redisData) machine.redisData = state.machine.redisData;
    if (state.machine?.mailbox) machine.mailbox = state.machine.mailbox;
    if (onOutput) machine.onOutput = onOutput;
    return machine;
  };
  state.restart = async (command) => {
    state.machine?.stop();
    state.machine = make();
    const cmd = command || labCommand(lab, files);
    if (cmd) await state.machine.run(cmd);
  };
  await state.restart();
  const helpers = makeHelpers(state);
  const names = Object.keys(helpers);
  const checks = [];
  for (const [index, t] of (lab.tests || []).entries()) {
    let passed = true;
    let message = "";
    try {
      // In a block of its own, so a check may declare names that shadow the helpers.
      const fn = new AsyncFunction(...names, `{\n${t.check}\n}`);
      await fn(...names.map((n) => helpers[n]));
    } catch (err) {
      passed = false;
      message = t.fail || (err instanceof CheckFailure ? err.message : `The check could not run: ${err?.message || err}`);
    }
    checks.push({ index, label: t.label, passed, message });
  }
  const output = state.machine.outputText();
  const exitCode = state.machine.exitCode;
  state.machine.stop();
  return { passed: checks.length > 0 && checks.every((c) => c.passed), checks, output, exitCode };
}
