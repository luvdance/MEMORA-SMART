/**
 * THE LAB MACHINE — one Node.js process on a small Linux server.
 *
 *   files      the project at /app (server.js, package.json, .env …)
 *   network    servers listen on ports; localhost requests reach them;
 *              the lab's external services answer at their own https://
 *              origins; anything else is "getaddrinfo ENOTFOUND" (the lab
 *              has no internet, so every lab gives the same results)
 *   database   PostgreSQL (PGlite) behind the real `pg` driver, when the lab
 *              has one, at the lab's DATABASE_URL
 *   output     stdout and stderr, as a terminal shows them; a crash prints
 *              Node's own report and the process exits with code 1
 *
 * A command is run as on a server: `node server.js`, `node --env-file=.env
 * server.js`, `npm start`, `npm test` (Vitest), `npm run <script>`.
 */
import { Loop, makeDate, real, tick } from "./loop.js";
import { Volume } from "./fs.js";
import proc, { resetProcess, ProcessExit, NODE_VERSION, parseEnv, PID } from "./process.js";
import { ModuleSystem, ModuleSyntaxError } from "./modules.js";
import { ctx } from "./context.js";
import { inspect, format } from "./inspect.js";
import { Buffer } from "./buffer.js";
import { IncomingMessage, ServerResponse, Socket, fillRequest } from "./http.js";
import { Readable } from "./stream.js";
import { SessionLock } from "./pgSocket.js";
import * as fflate from "fflate";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]);

/* ── The network ───────────────────────────────────────────────────── */

class Network {
  constructor(machine) {
    this.machine = machine;
    this.servers = new Map();
    this.services = new Map(); // origin → request listener
    this.log = []; // outgoing requests to external services
    this.inflight = new Set();
  }
  listen(server, port) {
    const m = this.machine;
    if (port === 0) {
      port = 30000 + Math.floor(Math.random() * 20000);
      while (this.servers.has(port)) port += 1;
    }
    if (this.servers.has(port) && this.servers.get(port) !== server) {
      const err = new Error(`listen EADDRINUSE: address already in use :::${port}`);
      Object.assign(err, { code: "EADDRINUSE", errno: -98, syscall: "listen", address: "::", port });
      m.loop.setImmediate(() => server.emit("error", err));
      return;
    }
    this.servers.set(port, server);
    server._port = port;
    server.listening = true;
    m.loop.handles.add(server);
    m.loop.setImmediate(() => server.emit("listening"));
  }
  unlisten(server) {
    if (this.servers.get(server._port) === server) this.servers.delete(server._port);
    this.machine.loop.handles.delete(server);
  }
  knows(host) {
    for (const origin of this.services.keys()) if (new URL(origin).hostname === host) return true;
    return false;
  }
  firstPort() {
    return this.servers.keys().next().value ?? null;
  }

  /** Send one HTTP request; resolves { status, statusText, headers: [[k, v]], body: Buffer }. */
  send({ url, method = "GET", headers = [], body = null }) {
    const u = new URL(url);
    const host = u.hostname.replace(/^\[|\]$/g, "");
    if (LOCAL_HOSTS.has(u.hostname) || LOCAL_HOSTS.has(host)) {
      const port = Number(u.port || (u.protocol === "https:" ? 443 : 80));
      const server = this.servers.get(port);
      if (!server) {
        const addr = host === "localhost" ? "::1" : host;
        const err = new Error(`connect ECONNREFUSED ${addr}:${port}`);
        Object.assign(err, { errno: -111, code: "ECONNREFUSED", syscall: "connect", address: addr, port });
        return Promise.reject(err);
      }
      return this.dispatch((req, res) => server.emit("request", req, res), server, {
        method, path: u.pathname + u.search, headers, body, remoteAddress: host === "127.0.0.1" ? "127.0.0.1" : "::1", port,
      });
    }
    const listener = this.services.get(u.origin);
    if (!listener) {
      const err = new Error(`getaddrinfo ENOTFOUND ${u.hostname}`);
      Object.assign(err, { errno: -3008, code: "ENOTFOUND", syscall: "getaddrinfo", hostname: u.hostname });
      return Promise.reject(err);
    }
    const entry = {
      url: u.href,
      method: method.toUpperCase(),
      headers: Object.fromEntries(headers.map(([k, v]) => [k.toLowerCase(), v])),
      body: body ? Buffer.from(body).toString("utf8") : "",
      at: this.machine.loop.now(),
    };
    this.log.push(entry);
    return this.dispatch(listener, null, {
      method, path: u.pathname + u.search, headers, body, remoteAddress: "203.0.113.50", port: 443, encrypted: true,
    }).then((r) => {
      entry.status = r.status;
      return r;
    });
  }

  dispatch(listener, server, { method, path, headers, body, remoteAddress, port, encrypted }) {
    const m = this.machine;
    return new Promise((resolve, reject) => {
      const socket = new Socket({ remoteAddress, localPort: port, encrypted });
      const req = new IncomingMessage(socket);
      fillRequest(req, { method, url: path, headers });
      req._body = body && body.length ? Buffer.from(body) : null;
      const job = { reject };
      this.inflight.add(job);
      if (server) server._inflight += 1;
      const done = () => {
        this.inflight.delete(job);
        if (server) {
          server._inflight -= 1;
          server._maybeClosed();
        }
      };
      const res = new ServerResponse(req, {
        deliver: (response) => {
          done();
          resolve(response);
        },
      });
      try {
        listener(req, res);
      } catch (err) {
        m.uncaught(err);
      }
    });
  }

  /** The process died: every request still waiting gets "socket hang up". */
  abortAll() {
    for (const job of this.inflight) {
      const err = new Error("other side closed");
      err.code = "UND_ERR_SOCKET";
      job.reject(err);
    }
    this.inflight.clear();
    for (const server of this.servers.values()) server.listening = false;
    this.servers.clear();
  }
}

/* ── fetch, as Node's (undici) behaves ─────────────────────────────── */

const DEFAULT_HEADERS = [
  ["accept", "*/*"],
  ["accept-language", "*"],
  ["sec-fetch-mode", "cors"],
  ["user-agent", "node"],
  ["accept-encoding", "gzip, deflate"],
];

function fetchFailed(cause) {
  const err = new TypeError("fetch failed");
  err.cause = cause;
  return err;
}

export function makeFetch(machine) {
  return async function fetch(input, init = {}) {
    let url;
    const raw = input instanceof Request ? input.url : input instanceof URL ? input.href : String(input);
    try {
      url = new URL(raw);
    } catch {
      const cause = new TypeError("Invalid URL");
      cause.code = "ERR_INVALID_URL";
      cause.input = raw;
      const err = new TypeError(`Failed to parse URL from ${raw}`);
      err.cause = cause;
      throw err;
    }
    let request;
    try {
      request = new Request(url.href, input instanceof Request ? input : init);
      if (input instanceof Request && init && Object.keys(init).length) request = new Request(request, init);
    } catch (err) {
      throw new TypeError(err.message);
    }
    const signal = init.signal || (input instanceof Request ? input.signal : null);
    if (signal?.aborted) throw signal.reason;
    let method = request.method;
    let body = method === "GET" || method === "HEAD" ? null : Buffer.from(await request.arrayBuffer());
    const userHeaders = [];
    request.headers.forEach((v, k) => userHeaders.push([k, v]));
    // Headers the browser's Request drops (forbidden there) but Node sends: keep them from init.
    const initHeaders = init.headers instanceof Headers ? [...init.headers] : Array.isArray(init.headers) ? init.headers : Object.entries(init.headers || {});
    for (const [k, v] of initHeaders) {
      if (!userHeaders.some(([n]) => n === k.toLowerCase())) userHeaders.push([k.toLowerCase(), String(v)]);
    }
    let current = url;
    let redirects = 0;
    for (;;) {
      const headers = [["host", current.host], ["connection", "keep-alive"]];
      for (const [k, v] of userHeaders) if (k !== "host" && k !== "connection") headers.push([k, v]);
      for (const [k, v] of DEFAULT_HEADERS) if (!headers.some(([n]) => n === k)) headers.push([k, v]);
      if (body) headers.push(["content-length", String(body.length)]);
      let response;
      const sending = machine.network.send({ url: current.href, method, headers, body });
      try {
        response = signal
          ? await Promise.race([
              sending,
              new Promise((_, reject) => {
                if (signal.aborted) reject(signal.reason);
                signal.addEventListener("abort", () => reject(signal.reason), { once: true });
              }),
            ])
          : await sending;
      } catch (err) {
        if (signal?.aborted && err === signal.reason) throw err;
        throw fetchFailed(err);
      }
      const location = response.headers.find(([k]) => k.toLowerCase() === "location")?.[1];
      if ([301, 302, 303, 307, 308].includes(response.status) && location && (init.redirect || "follow") === "follow") {
        if (++redirects > 20) throw fetchFailed(new Error("redirect count exceeded"));
        current = new URL(location, current);
        if (response.status === 303 || ((response.status === 301 || response.status === 302) && method === "POST")) {
          method = "GET";
          body = null;
        }
        continue;
      }
      let payload = response.body;
      const encoding = response.headers.find(([k]) => k.toLowerCase() === "content-encoding")?.[1];
      if (payload.length && encoding === "gzip") payload = Buffer.from(fflate.gunzipSync(payload));
      else if (payload.length && encoding === "deflate") payload = Buffer.from(fflate.unzlibSync(payload));
      const nullBody = method === "HEAD" || [101, 103, 204, 205, 304].includes(response.status);
      const headersOut = new Headers();
      for (const [k, v] of response.headers) headersOut.append(k, v);
      const res = new Response(nullBody ? null : payload, {
        status: response.status < 200 ? 200 : response.status,
        statusText: response.statusText,
        headers: headersOut,
      });
      Object.defineProperty(res, "url", { value: current.href });
      Object.defineProperty(res, "redirected", { value: redirects > 0 });
      if (response.status < 200) Object.defineProperty(res, "status", { value: response.status });
      return res;
    }
  };
}

/* ── console ───────────────────────────────────────────────────────── */

function tableString(data, properties) {
  const rows = [];
  const keys = [];
  const valueKey = "Values";
  let hasValues = false;
  const entries = data instanceof Map ? [...data.entries()] : Object.entries(data);
  for (const [k, v] of entries) {
    const row = { "(index)": String(k) };
    if (v !== null && typeof v === "object") {
      for (const [ck, cv] of Object.entries(v)) {
        if (properties && !properties.includes(ck)) continue;
        if (!keys.includes(ck)) keys.push(ck);
        row[ck] = inspect(cv, { depth: 0 }).replace(/\n\s*/g, " ");
      }
    } else {
      hasValues = true;
      row[valueKey] = inspect(v);
    }
    rows.push(row);
  }
  const cols = ["(index)", ...keys, ...(hasValues ? [valueKey] : [])];
  const width = cols.map((c) => Math.max(c.length, ...rows.map((r) => (r[c] ?? "").length)) + 2);
  const line = (l, m, r) => l + width.map((w) => "─".repeat(w)).join(m) + r;
  const cell = (s, w) => ` ${s}${" ".repeat(w - s.length - 1)}`;
  const out = [line("┌", "┬", "┐"), `│${cols.map((c, i) => cell(c, width[i])).join("│")}│`, line("├", "┼", "┤")];
  for (const r of rows) out.push(`│${cols.map((c, i) => cell(r[c] ?? "", width[i])).join("│")}│`);
  out.push(line("└", "┴", "┘"));
  return out.join("\n");
}

function makeConsole(machine, quiet = false) {
  let indent = "";
  const counts = new Map();
  const timers = new Map();
  const write = (stream, args) => {
    if (quiet) return;
    const text = format(...args);
    machine.writeStd(stream, `${indent ? text.replace(/^/gm, indent) : text}\n`);
  };
  const c = {
    log: (...a) => write("stdout", a),
    info: (...a) => write("stdout", a),
    debug: (...a) => write("stdout", a),
    error: (...a) => write("stderr", a),
    warn: (...a) => write("stderr", a),
    trace: (...a) => write("stderr", [`Trace: ${format(...a)}`]),
    dir: (v, opts) => write("stdout", [inspect(v, opts || {})]),
    dirxml: (...a) => write("stdout", a),
    table: (data, props) => {
      if (data === null || typeof data !== "object") write("stdout", [data]);
      else write("stdout", [tableString(data, props)]);
    },
    assert: (cond, ...a) => {
      if (!cond) write("stderr", a.length ? [`Assertion failed: ${format(...a)}`] : ["Assertion failed"]);
    },
    count: (label = "default") => {
      const n = (counts.get(label) || 0) + 1;
      counts.set(label, n);
      write("stdout", [`${label}: ${n}`]);
    },
    countReset: (label = "default") => counts.delete(label),
    time: (label = "default") => timers.set(label, machine.loop.perfNow()),
    timeLog: (label = "default", ...a) => {
      const t = timers.get(label);
      if (t !== undefined) write("stdout", [`${label}: ${fmtMs(machine.loop.perfNow() - t)}`, ...a]);
    },
    timeEnd: (label = "default") => {
      const t = timers.get(label);
      if (t === undefined) return;
      timers.delete(label);
      write("stdout", [`${label}: ${fmtMs(machine.loop.perfNow() - t)}`]);
    },
    group: (...a) => {
      if (a.length) write("stdout", a);
      indent += "  ";
    },
    groupCollapsed: (...a) => c.group(...a),
    groupEnd: () => {
      indent = indent.slice(2);
    },
  };
  return c;
}

function fmtMs(ms) {
  if (ms >= 60000) return `${Math.floor(ms / 60000)}:${String(((ms % 60000) / 1000).toFixed(3)).padStart(6, "0")} (m:ss.mmm)`;
  if (ms >= 1000) return `${(ms / 1000).toFixed(3)}s`;
  return `${ms.toFixed(3)}ms`;
}

/* ── Crash reports, as Node prints them ────────────────────────────── */

const FRAME_FILE = /\(?((?:file:\/\/)?\/[^\s():]+):(\d+):(\d+)\)?\s*$/;

export function cleanStack(stack) {
  const lines = String(stack).split("\n");
  const out = [];
  let inFrames = false;
  for (const line of lines) {
    if (/^\s+at\s/.test(line)) {
      inFrames = true;
      const m = FRAME_FILE.exec(line);
      if (!m) continue;
      if (/^file:\/\/\/[A-Za-z]:/.test(m[1])) continue; // the lab runtime's own files (in Node)
      out.push(line.replace(/\bat eval \(/, "at ").replace(/at (async )?eval \((.*)\)$/, "at $1$2"));
    } else if (!inFrames) out.push(line);
  }
  return out.join("\n");
}

/* ── The machine ───────────────────────────────────────────────────── */

let VirtualDate = null;

export class Machine {
  /**
   * opts: {
   *   files       { "server.js": "…" } — the project, at /app
   *   env         environment variables (PORT, NODE_ENV …)
   *   builtins    { name: exports } — Node's built-in modules (entry.js)
   *   packages    { name: () => exports } — the bundled npm packages (entry.js)
   *   database    { db, user, password, host, port, database, version } or null
   *   services    { "https://api.example.com": "module source exporting a request listener" }
   *   stdin       text for process.stdin
   *   strictDependencies (default true)
   * }
   */
  constructor(opts) {
    this.opts = opts;
    this.cwd = "/app";
    this.loop = new Loop({ onError: (err) => this.uncaught(err) });
    this.startedAt = this.loop.now();
    this.vol = new Volume(() => this.loop.now());
    this.vol.load(opts.files || {}, "/app");
    this.vol.mkdirp("/tmp");
    this.network = new Network(this);
    this.output = []; // { stream, text }
    this.exited = false;
    this.exitCode = null;
    this.mailbox = [];
    this.builtins = opts.builtins;
    this.packages = opts.packages;
    this.extensions = {};
    this.pgServer = opts.database ? { ...opts.database, lock: new SessionLock() } : null;
    this.fetch = makeFetch(this);
    this.console = makeConsole(this);
    this.quietConsole = makeConsole(this, true);
    this.modules = null;
    this.globalNames = [
      "console", "process", "Buffer", "global", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
      "setImmediate", "clearImmediate", "fetch", "performance", "self", "postMessage", "importScripts", "location",
      "close", "onmessage", "WebSocket",
    ];
  }

  /** Make this the running machine: the clock, timers and fetch every package sees. */
  activate() {
    ctx.machine = this;
    if (!VirtualDate) VirtualDate = makeDate(() => ctx.loop);
    const g = globalThis;
    if (!g.__labReal) {
      // Bound: a browser refuses a timer function called with any other `this`.
      const bind = (f) => (typeof f === "function" ? f.bind(g) : f);
      g.__labReal = {
        Date: g.Date,
        setTimeout: bind(g.setTimeout),
        clearTimeout: bind(g.clearTimeout),
        setInterval: bind(g.setInterval),
        clearInterval: bind(g.clearInterval),
        setImmediate: bind(g.setImmediate),
        clearImmediate: bind(g.clearImmediate),
        timeout: AbortSignal.timeout,
      };
    }
    g.Date = VirtualDate;
    const loop = () => ctx.loop;
    g.setTimeout = (fn, ms, ...a) => (loop() ? loop().setTimeout(fn, ms, ...a) : g.__labReal.setTimeout(fn, ms, ...a));
    g.clearTimeout = (t) => (t && typeof t === "object" ? loop()?.clear(t) : t !== undefined && t !== null ? g.__labReal.clearTimeout(t) : undefined);
    g.setInterval = (fn, ms, ...a) => (loop() ? loop().setInterval(fn, ms, ...a) : g.__labReal.setInterval(fn, ms, ...a));
    g.clearInterval = (t) => (t && typeof t === "object" ? loop()?.clear(t) : t !== undefined && t !== null ? g.__labReal.clearInterval(t) : undefined);
    g.setImmediate = (fn, ...a) => loop().setImmediate(fn, ...a);
    g.clearImmediate = (i) => loop()?.clearImmediate(i);
    AbortSignal.timeout = (ms) => {
      const c = new AbortController();
      loop()
        .setTimeout(() => c.abort(new DOMException("The operation was aborted due to timeout", "TimeoutError")), ms)
        .unref();
      return c.signal;
    };
  }

  writeStd(stream, text) {
    if (!text) return;
    const last = this.output[this.output.length - 1];
    if (last && last.stream === stream) last.text += text;
    else this.output.push({ stream, text });
    this.onOutput?.(stream, text);
  }
  stdout() {
    return this.output.filter((o) => o.stream === "stdout").map((o) => o.text).join("");
  }
  stderr() {
    return this.output.filter((o) => o.stream === "stderr").map((o) => o.text).join("");
  }
  outputText() {
    return this.output.map((o) => o.text).join("");
  }

  builtin(name) {
    const b = this.builtins[name];
    if (!b) throw new Error(`No such built-in module: node:${name}`);
    return typeof b === "function" && b.__lazy ? b() : b;
  }

  moduleGlobals() {
    // The clock and network are those of the machine running NOW (read at call
    // time): an external service outlives restarts of the project (see
    // startServices), and a check may call a module after the program ended
    // (see load()).
    const loop = () => ctx.loop || this.loop;
    return {
      console: this.console,
      process: proc,
      Buffer,
      global: globalThis,
      setTimeout: (fn, ms, ...a) => loop().setTimeout(fn, ms, ...a),
      clearTimeout: (t) => loop().clear(t),
      setInterval: (fn, ms, ...a) => loop().setInterval(fn, ms, ...a),
      clearInterval: (t) => loop().clear(t),
      setImmediate: (fn, ...a) => loop().setImmediate(fn, ...a),
      clearImmediate: (i) => loop().clearImmediate(i),
      fetch: (...a) => (ctx.machine || this).fetch(...a),
      performance: this.builtins.perf_hooks.performance,
      self: undefined,
      postMessage: undefined,
      importScripts: undefined,
      location: undefined,
      close: undefined,
      onmessage: undefined,
      WebSocket: this.extensions.WebSocket,
    };
  }

  /* ── running a command ─────────────────────────────────────────── */

  packageJson() {
    try {
      return JSON.parse(this.vol.node("/app/package.json")?.data.toString("utf8") || "{}");
    } catch {
      return {};
    }
  }

  /** Run a shell command line. Resolves when the process exits or goes idle (a server waiting). */
  async run(command, { args: extraArgs = [] } = {}) {
    this.activate();
    await this.ensurePackages();
    const words = splitCommand(command);
    // NAME=value before a command sets it in that command's environment, as in a shell.
    while (words.length > 1 && /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[0])) {
      const [name, ...value] = words.shift().split("=");
      this.commandEnv = { ...(this.commandEnv || {}), [name]: value.join("=") };
    }
    if (words[0] === "npx") words.shift();
    const [cmd, ...rest] = words;
    if (cmd === "npm") return this.runNpm(rest);
    if (["node", "tsx", "nodemon", "ts-node"].includes(cmd)) return this.runNode(rest.concat(extraArgs));
    if (cmd === "tsc") return this.runTsc(rest);
    if (cmd === "prisma") return this.runPrisma(rest);
    if (cmd === "vitest") {
      resetProcess({ env: { ...this.baseEnv(), NODE_ENV: "test", VITEST: "true", ...(this.npmEnv || {}) }, argv: ["/usr/local/bin/node", "/app/node_modules/vitest/vitest.mjs", ...rest], stdin: Readable.from([]) });
      this.modules = new ModuleSystem(this, { strictDependencies: this.opts.strictDependencies !== false });
      return this.runTests(rest);
    }
    this.writeStd("stderr", `sh: 1: ${cmd}: not found\n`);
    this.exit(127);
    return "exit";
  }

  async runNpm(args) {
    const pkg = this.packageJson();
    let script = args[0] === "run" || args[0] === "run-script" ? args[1] : args[0];
    const passArgs = args.slice(args[0] === "run" ? 2 : 1).filter((a) => a !== "--");
    if (script === "t") script = "test";
    const body = pkg.scripts?.[script];
    if (!body) {
      if (script === "start" && this.vol.node("/app/server.js")) return this.runScript(pkg, "start", "node server.js", passArgs);
      this.writeStd("stderr", `npm error Missing script: "${script}"\nnpm error\nnpm error To see a list of scripts, run:\nnpm error   npm run\n`);
      this.exit(1);
      return "exit";
    }
    return this.runScript(pkg, script, body, passArgs);
  }

  async runScript(pkg, script, body, passArgs) {
    const full = [body, ...passArgs].join(" ");
    this.writeStd("stdout", `\n> ${pkg.name || "app"}${pkg.version ? `@${pkg.version}` : ""} ${script}\n> ${full}\n\n`);
    this.npmEnv = { npm_lifecycle_event: script, npm_package_name: pkg.name || "", npm_package_version: pkg.version || "" };
    return this.run(full);
  }

  async runNode(args) {
    const execArgv = [];
    let envFile = null;
    let i = 0;
    for (; i < args.length; i++) {
      const a = args[i];
      if (!a.startsWith("-")) break;
      execArgv.push(a);
      if (a.startsWith("--env-file=")) envFile = a.slice(11);
      else if (a === "--env-file") envFile = args[++i];
      else if (a === "--env-file-if-exists" || a.startsWith("--env-file-if-exists=")) {
        const f = a.includes("=") ? a.split("=")[1] : args[++i];
        if (this.vol.node(resolvePath(this.cwd, f))) envFile = f;
      } else if (a === "--import" || a === "--require" || a === "-r") i += 1;
    }
    const entryArg = args[i];
    const scriptArgs = args.slice(i + 1);
    // The shell's environment, then (as defaults) the --env-file's: Node never
    // lets the file override a variable that is already set.
    const shellEnv = { ...this.baseEnv(), ...(this.npmEnv || {}), ...(this.commandEnv || {}) };
    let env = { ...shellEnv };
    if (envFile) {
      const abs = resolvePath(this.cwd, envFile);
      const node = this.vol.node(abs);
      if (!node) {
        this.writeStd("stderr", `node: ${abs}: not found\n`);
        this.exit(9);
        return "exit";
      }
      env = { ...parseEnv(node.data.toString("utf8")), ...shellEnv };
    }
    const stdin = Readable.from(this.opts.stdin ? [Buffer.from(this.opts.stdin)] : []);
    stdin.isTTY = false;
    stdin.fd = 0;
    const entry = entryArg ? resolvePath(this.cwd, entryArg) : null;
    resetProcess({ env, argv: ["/usr/local/bin/node", ...(entry ? [entry] : []), ...scriptArgs], stdin, execArgv });
    this.modules = new ModuleSystem(this, { strictDependencies: this.opts.strictDependencies !== false });
    await this.startServices();
    if (!entry) {
      this.writeStd("stderr", "This lab runs programs, not the interactive REPL: name a file, e.g. node server.js\n");
      this.exit(1);
      return "exit";
    }
    try {
      const fmt = this.modules.exists(entry) ? this.modules.formatOf(entry) : "cjs";
      if (!this.modules.exists(entry)) {
        const err = new Error(`Cannot find module '${entry}'`);
        err.code = "MODULE_NOT_FOUND";
        err.requireStack = [];
        throw Object.assign(err, { labLoader: true });
      }
      if (fmt === "esm") {
        const p = this.modules.importFrom(entry, null);
        p.catch((err) => this.uncaught(err, "entry"));
        await this.loop.settle(p.catch(() => {}), { limit: 60000 });
      } else {
        const m = this.modules.instantiate(entry, null);
        this.modules.main = m;
        this.modules.evaluateSync(m, null);
      }
    } catch (err) {
      this.uncaught(err, "entry");
    }
    return this.settleScript();
  }

  /** Let the process run until it ends or only waits (a server, a timer far ahead). */
  async settleScript() {
    if (this.exited) return "exit";
    const r = await this.loop.settle(null, { limit: 10 * 60 * 1000 });
    if (this.exited) return "exit";
    if (r === "exit") {
      if (proc.listenerCount("beforeExit")) {
        proc.emit("beforeExit", proc.exitCode ?? 0);
        return this.settleScript();
      }
      this.exit(proc.exitCode ?? 0);
      return "exit";
    }
    return "running";
  }

  baseEnv() {
    return {
      PATH: "/usr/local/bin:/usr/bin:/bin",
      HOME: "/home/node",
      USER: "node",
      HOSTNAME: "lab-server",
      TZ: "UTC",
      LANG: "C.UTF-8",
      ...(this.opts.env || {}),
    };
  }

  /** The lab's external services (a payment provider, an email API …), each a request listener. */
  async startServices() {
    this.network.services.clear();
    const services = this.opts.services || {};
    // An external service keeps running while the project restarts (opts.serviceInstances).
    const running = this.opts.serviceInstances;
    for (const [origin, source] of Object.entries(services)) {
      const key = new URL(origin).origin;
      if (running?.has(key)) {
        this.network.services.set(key, running.get(key));
        continue;
      }
      const file = `/srv/${new URL(origin).hostname}/index.cjs`;
      this.vol.mkdirp(`/srv/${new URL(origin).hostname}`);
      this.vol.write(file, source);
      const sys = new ModuleSystem(this, { strictDependencies: false });
      const saved = this.console;
      this.console = this.quietConsole;
      try {
        const m = sys.instantiate(file, null);
        sys.evaluateSync(m, null);
        const listener = m.exports.default || m.exports;
        this.network.services.set(new URL(origin).origin, listener);
      } finally {
        this.console = saved;
      }
    }
  }
  service(origin) {
    return this.network.services.get(new URL(origin).origin);
  }

  /* ── requests from checks and the learner's Send button ────────── */

  async request({ method = "GET", path = "/", headers = {}, body, json, port, redirect = "manual", timeout = 120000 } = {}) {
    this.activate();
    const p = port || this.opts.port || this.network.firstPort() || 3000;
    // Like curl and the request panel: a redirect is shown, not followed.
    const init = { method, redirect, headers: { ...headers } };
    if (json !== undefined) {
      init.body = JSON.stringify(json);
      if (!Object.keys(init.headers).some((k) => k.toLowerCase() === "content-type")) init.headers["Content-Type"] = "application/json";
    } else if (body !== undefined) {
      init.body = typeof body === "string" || body instanceof Uint8Array || body instanceof FormData || body instanceof URLSearchParams ? body : JSON.stringify(body);
      if (typeof body === "object" && !(body instanceof Uint8Array) && !(body instanceof FormData) && !(body instanceof URLSearchParams) && !Object.keys(init.headers).some((k) => k.toLowerCase() === "content-type")) {
        init.headers["Content-Type"] = "application/json";
      }
    }
    const url = /^https?:\/\//.test(path) ? path : `http://localhost:${p}${path.startsWith("/") ? path : `/${path}`}`;
    const pending = (async () => {
      const res = await this.fetch(url, init);
      const text = await res.text();
      return { res, text };
    })();
    pending.catch(() => {});
    const r = await this.loop.settle(pending, { limit: timeout });
    if (r === "stuck") {
      return { status: 0, error: `No response after ${Math.round(timeout / 1000)} seconds: the request never got an answer (a route that never calls res.send/res.json, or a next() that is never called).`, headers: {}, text: "", body: null, json: undefined };
    }
    let out;
    try {
      out = await pending;
    } catch (err) {
      const why = err.cause ? `${err.message}: ${err.cause.message}` : err.message;
      return { status: 0, error: why, code: err.cause?.code, headers: {}, text: "", body: null, json: undefined };
    }
    const headersObj = {};
    out.res.headers.forEach((v, k) => {
      headersObj[k] = v;
    });
    const setCookie = out.res.headers.getSetCookie?.() || [];
    let parsed;
    try {
      parsed = out.text ? JSON.parse(out.text) : undefined;
    } catch {
      parsed = undefined;
    }
    await this.loop.idle();
    return {
      status: out.res.status,
      statusText: out.res.statusText,
      headers: headersObj,
      cookies: setCookie,
      text: out.text,
      json: parsed,
      body: parsed !== undefined ? parsed : out.text,
    };
  }

  /* ── exit, signals and crashes ─────────────────────────────────── */

  exit(code) {
    if (this.exited) return;
    this.exitCode = code;
    proc.exitCode = code;
    try {
      proc.emit("exit", code);
    } catch (err) {
      if (!err?.isProcessExit) this.writeStd("stderr", `${inspect(err)}\n`);
    }
    this.exited = true;
    this.network.abortAll();
    this.loop.stop();
    this.onExit?.(code);
  }

  signal(name) {
    if (this.exited) return;
    if (proc.listenerCount(name)) {
      proc.emit(name, name);
      return;
    }
    this.exit(proc.SIGNAL_CODES[name] ?? 1);
  }

  uncaught(err, origin = "uncaughtException") {
    if (err?.isProcessExit || err instanceof ProcessExit) return;
    if (this.exited) return;
    if (origin !== "entry" && proc.listenerCount("uncaughtException")) {
      try {
        proc.emit("uncaughtException", err, origin);
        return;
      } catch (inner) {
        err = inner;
      }
    }
    this.writeStd("stderr", this.crashReport(err, origin));
    this.exit(err?.labExitCode ?? 1);
  }

  unhandledRejection(reason, promise) {
    if (reason?.isProcessExit || this.exited) return;
    if (proc.listenerCount("unhandledRejection")) {
      proc.emit("unhandledRejection", reason, promise);
      return;
    }
    if (!(reason instanceof Error)) {
      const text =
        `node:internal/process/promises:392\n      new UnhandledPromiseRejection(reason);\n      ^\n\n` +
        `UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "${inspect(reason)}".\n` +
        `    at throwUnhandledRejectionsMode (node:internal/process/promises:392:7)\n    at processPromiseRejections (node:internal/process/promises:475:17)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:32) {\n  code: 'ERR_UNHANDLED_REJECTION'\n}\n\nNode.js v${NODE_VERSION}\n`;
      this.writeStd("stderr", text);
      this.exit(1);
      return;
    }
    this.writeStd("stderr", this.crashReport(reason, "unhandledRejection"));
    this.exit(1);
  }

  crashReport(err, origin) {
    const tail = `\n\nNode.js v${NODE_VERSION}\n`;
    if (err instanceof ModuleSyntaxError) {
      const where = `${err.labEsm ? "file://" : ""}${err.labFile}:${err.labLine}`;
      const caret = `${" ".repeat(Math.max(0, err.labColumn))}${"^".repeat(Math.max(1, err.labCaret || 1))}`;
      return `${where}\n${err.labLineText}\n${caret}\n${err.labEsm ? "" : "\n"}SyntaxError: ${err.message}${tail}`;
    }
    if (err?.labInternal) return `${err.labInternal}

${inspect(err)}${tail}`;
    if (err?.labUnhandledEvent) return `node:events:486
      throw er; // Unhandled 'error' event
      ^

${inspect(err)}${tail}`;
    if (err?.labLoader || (err?.code === "MODULE_NOT_FOUND" && origin === "entry" && err.requireStack?.length === 0)) {
      return `node:internal/modules/cjs/loader:1459\n  throw err;\n  ^\n\n${inspect(err)}${tail}`;
    }
    const text = err instanceof Error ? inspect(err) : `Uncaught ${inspect(err)}`;
    const stack = err instanceof Error ? cleanStack(err.stack || "") : "";
    const frame = stack.split("\n").map((l) => FRAME_FILE.exec(l)).find(Boolean);
    if (frame && /^\s+at\s/.test(stack.split("\n").find((l) => FRAME_FILE.test(l)) || "")) {
      const file = frame[1].replace(/^file:\/\//, "");
      const line = Number(frame[2]);
      const col = Number(frame[3]);
      const src = this.vol.node(file)?.data.toString("utf8").split("\n")[line - 1];
      if (src !== undefined) {
        const throwAt = origin === "unhandledRejection" ? -1 : src.indexOf("throw");
        const caretCol = throwAt >= 0 && throwAt < col ? throwAt : col - 1;
        return `${frame[1]}:${line}\n${src}\n${" ".repeat(caretCol)}^\n\n${text}${tail}`;
      }
    }
    if (err && typeof err === "object" && err.syscall) {
      return `node:events:486\n      throw er; // Unhandled 'error' event\n      ^\n\n${text}${tail}`;
    }
    return `${text}${tail}`;
  }

  envObject() {
    return proc.env;
  }

  /**
   * After the program has ended, checks may still call its modules' functions
   * (as a test runner would in a process of its own): give them a running
   * event loop on the same clock.
   */
  revive() {
    if (!this.loop.stopped) return;
    const offset = this.loop.offset;
    this.loop = new Loop({ onError: (err) => this.uncaught(err) });
    this.loop.offset = offset;
  }

  /** Run until `promise` settles, fast-forwarding the clock over timers. */
  async wait(promise) {
    this.revive();
    this.activate();
    const p = Promise.resolve(promise);
    p.catch(() => {});
    await this.loop.settle(p, { limit: 10 * 60 * 1000 });
    return p;
  }

  /** `tsc` (npx tsc --noEmit, npm run typecheck): the real TypeScript compiler, via the host. */
  async runTsc(args = []) {
    const pkg = this.packageJson();
    const installed = pkg.devDependencies?.typescript || pkg.dependencies?.typescript;
    if (!installed || !this.extensions.typecheck) {
      this.writeStd("stderr", "sh: 1: tsc: not found\n");
      this.exit(127);
      return "exit";
    }
    if (args.includes("-v") || args.includes("--version")) {
      this.writeStd("stdout", "Version 6.0.3\n");
      this.exit(0);
      return "exit";
    }
    const r = await this.loop.track(this.extensions.typecheck(this.vol.snapshot()));
    this.typeDiagnostics = r.diagnostics;
    if (r.text) this.writeStd("stdout", r.text);
    this.exit(r.diagnostics.some((d) => d.category === "error") ? 2 : 0);
    return "exit";
  }

  /**
   * Packages that live outside the main runtime bundle (Prisma) are loaded
   * when the project's package.json depends on them, before anything runs.
   */
  async ensurePackages() {
    if (this.prismaTools || !this.extensions.loadPrisma) return;
    const pkg = this.packageJson();
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps.prisma || deps["@prisma/client"] || deps["@prisma/adapter-pg"]) this.prismaTools = await this.extensions.loadPrisma();
  }

  /** `prisma …`: the Prisma CLI's commands that run in a lab (runtime/prisma.js). */
  async runPrisma(args = []) {
    const pkg = this.packageJson();
    if (!(pkg.devDependencies?.prisma || pkg.dependencies?.prisma) || !this.prismaTools) {
      this.writeStd("stderr", "sh: 1: prisma: not found\n");
      this.exit(127);
      return "exit";
    }
    const env = { ...this.baseEnv(), ...(this.npmEnv || {}), ...(this.commandEnv || {}) };
    resetProcess({ env, argv: ["/usr/local/bin/node", "/app/node_modules/prisma/build/index.js", ...args], stdin: Readable.from([]) });
    this.modules = new ModuleSystem(this, { strictDependencies: this.opts.strictDependencies !== false });
    const running = this.prismaTools.runPrisma(this, args);
    running.catch(() => {});
    await this.loop.settle(running, { limit: 120000 });
    this.exit(await running);
    return "exit";
  }

  /** Import one of the project's modules (checks call its functions directly). */
  async load(file) {
    this.revive();
    this.activate();
    await this.ensurePackages();
    if (!this.modules) {
      resetProcess({ env: { ...this.baseEnv() }, argv: ["/usr/local/bin/node", "/app/[check]"], stdin: Readable.from([]) });
      this.modules = new ModuleSystem(this, { strictDependencies: this.opts.strictDependencies !== false });
    }
    // A built-in (node:events) or package name is imported as it is; anything else is a project file.
    const spec = /^node:|^[@a-z]/i.test(file) && !/\.(m|c)?[jt]s$|\.json$/.test(file) ? file : resolvePath(this.cwd, file);
    const p = this.modules.dynamicImport(spec, "/app/[check].js");
    p.catch(() => {});
    if (!this.loop.stopped) await this.loop.settle(p, { limit: 60000 });
    return p;
  }

  /** `vitest run [filters]`: the project's tests, reported as Vitest prints them. */
  async runTests(args = []) {
    const filters = args.filter((a) => a !== "run" && !a.startsWith("-"));
    if (!proc.env || !this.modules) {
      resetProcess({ env: { ...this.baseEnv(), NODE_ENV: "test", VITEST: "true", ...(this.npmEnv || {}) }, argv: ["/usr/local/bin/node", "/app/node_modules/vitest/vitest.mjs", "run", ...filters], stdin: Readable.from([]) });
    } else {
      proc.env.NODE_ENV = "test";
      proc.env.VITEST = "true";
    }
    await this.startServices();
    const { results, exitCode } = await this.extensions.runTestFiles(this, filters);
    this.testResults = results;
    this.exit(exitCode);
    return "exit";
  }

  /* ── controls for checks ───────────────────────────────────────── */

  async advance(ms) {
    this.activate();
    await this.loop.advance(ms);
  }
  async idle() {
    this.activate();
    await this.loop.idle();
  }

  stop() {
    if (!this.exited) this.exit(137);
  }
}

export function splitCommand(command) {
  const out = [];
  let cur = "";
  let quote = null;
  for (const ch of String(command).trim()) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (/\s/.test(ch)) {
      if (cur) out.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

function resolvePath(cwd, p) {
  if (p.startsWith("/")) return p;
  const parts = `${cwd}/${p}`.split("/");
  const out = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return `/${out.join("/")}`;
}

export { real, tick, PID };
