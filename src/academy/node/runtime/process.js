/**
 * The global `process` of the lab machine: environment variables, argv,
 * exit codes, signals, stdout/stderr, memory and timing. One object, reset
 * for each machine (bundled packages hold a reference to it).
 */
import EventEmitter from "./events.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";

export const NODE_VERSION = "24.14.1";
export const PID = 4242;

/** Thrown to unwind the stack when the program calls process.exit(). */
export class ProcessExit extends Error {
  constructor(code) {
    super(`process.exit(${code})`);
    this.exitCode = code;
    this.isProcessExit = true;
  }
}

function makeEnv(initial) {
  const store = {};
  for (const [k, v] of Object.entries(initial || {})) store[k] = String(v);
  return new Proxy(store, {
    set(target, key, value) {
      target[key] = String(value);
      return true;
    },
    defineProperty(target, key, desc) {
      target[key] = String(desc.value);
      return true;
    },
  });
}

class StdStream extends EventEmitter {
  constructor(name, fd) {
    super();
    this.name = name;
    this.fd = fd;
    this.isTTY = false;
    this.writable = true;
    this.columns = 80;
    this.rows = 24;
  }
  write(chunk, encoding, cb) {
    if (typeof encoding === "function") cb = encoding;
    const text = typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");
    ctx.machine?.writeStd(this.name, text);
    if (typeof cb === "function") ctx.loop?.setImmediate(cb);
    return true;
  }
  end(chunk, encoding, cb) {
    if (chunk) this.write(chunk, encoding);
    if (typeof cb === "function") ctx.loop?.setImmediate(cb);
  }
  cork() {}
  uncork() {}
  getColorDepth() {
    return 1;
  }
  hasColors() {
    return false;
  }
}

const proc = new EventEmitter();
proc.title = "node";
proc.version = `v${NODE_VERSION}`;
proc.versions = { node: NODE_VERSION, v8: "13.6.233.17-node.44", uv: "1.51.0", modules: "137", openssl: "3.5.5" };
proc.release = { name: "node", lts: "Krypton", sourceUrl: "", headersUrl: "" };
proc.platform = "linux";
proc.arch = "x64";
proc.pid = PID;
proc.ppid = 1;
proc.execPath = "/usr/local/bin/node";
proc.argv0 = "node";
proc.execArgv = [];
proc.features = { inspector: true, ipv6: true, tls: true, typescript: "strip" };
proc.config = { variables: {} };
proc.stdout = new StdStream("stdout", 1);
proc.stderr = new StdStream("stderr", 2);
proc.browser = false;
proc.exitCode = undefined;
proc.env = makeEnv({ NODE_ENV: undefined });
delete proc.env.NODE_ENV;
proc.argv = ["/usr/local/bin/node"];
proc.allowedNodeEnvironmentFlags = new Set();

proc.cwd = () => ctx.machine?.cwd || "/app";
proc.chdir = (dir) => {
  if (ctx.machine) ctx.machine.cwd = dir;
};
proc.umask = () => 0o22;
proc.getuid = () => 1000;
proc.geteuid = () => 1000;
proc.getgid = () => 1000;
proc.getegid = () => 1000;

proc.nextTick = (fn, ...args) => {
  queueMicrotask(() => {
    try {
      fn(...args);
    } catch (err) {
      ctx.machine?.uncaught(err);
    }
  });
};

proc.hrtime = (prev) => {
  const ms = ctx.loop ? ctx.loop.perfNow() : performance.now();
  const sec = Math.floor(ms / 1000);
  const ns = Math.floor((ms % 1000) * 1e6);
  if (!prev) return [sec, ns];
  let s = sec - prev[0];
  let n = ns - prev[1];
  if (n < 0) {
    s -= 1;
    n += 1e9;
  }
  return [s, n];
};
proc.hrtime.bigint = () => BigInt(Math.floor((ctx.loop ? ctx.loop.perfNow() : performance.now()) * 1e6));
proc.uptime = () => (ctx.machine ? (ctx.loop.now() - ctx.machine.startedAt) / 1000 : 0);

proc.memoryUsage = () => {
  const m = ctx.machine?.memory?.() || {};
  return {
    rss: m.rss ?? 52_428_800,
    heapTotal: m.heapTotal ?? 18_874_368,
    heapUsed: m.heapUsed ?? 11_534_336,
    external: m.external ?? 2_097_152,
    arrayBuffers: m.arrayBuffers ?? 65_536,
  };
};
proc.memoryUsage.rss = () => proc.memoryUsage().rss;
proc.cpuUsage = (prev) => {
  const us = Math.floor((ctx.loop ? ctx.loop.perfNow() : 0) * 100);
  const cur = { user: us, system: Math.floor(us / 5) };
  return prev ? { user: cur.user - prev.user, system: cur.system - prev.system } : cur;
};
proc.resourceUsage = () => ({ userCPUTime: 0, systemCPUTime: 0, maxRSS: 51200 });
proc.constrainedMemory = () => 0;
proc.availableMemory = () => 2 * 1024 ** 3;

proc.exit = (code) => {
  const c = code === undefined ? (proc.exitCode ?? 0) : Number(code) || 0;
  ctx.machine?.exit(c);
  throw new ProcessExit(c);
};
proc.reallyExit = proc.exit;
proc.abort = () => proc.exit(134);

const SIGNAL_CODES = { SIGTERM: 143, SIGINT: 130, SIGHUP: 129, SIGKILL: 137, SIGUSR2: 140 };
proc.kill = (pid, signal = "SIGTERM") => {
  if (pid !== PID && pid !== 0) {
    const err = new Error("kill ESRCH");
    err.code = "ESRCH";
    err.errno = -3;
    err.syscall = "kill";
    throw err;
  }
  ctx.machine?.signal(signal);
  return true;
};
proc.SIGNAL_CODES = SIGNAL_CODES;

let warnedOnce = false;
proc.emitWarning = (warning, type = "Warning", code) => {
  if (typeof type === "object" && type) {
    code = type.code;
    type = type.type || "Warning";
  }
  const w = warning instanceof Error ? warning : Object.assign(new Error(String(warning)), { name: type });
  if (code) w.code = code;
  proc.emit("warning", w);
  const line = `(node:${PID}) ${code ? `[${code}] ` : ""}${w.name}: ${w.message}\n`;
  ctx.machine?.writeStd("stderr", line);
  if (!warnedOnce) {
    warnedOnce = true;
    ctx.machine?.writeStd(
      "stderr",
      `(Use \`node --trace-${w.name === "DeprecationWarning" ? "deprecation" : "warnings"} ...\` to show where the warning was created)\n`
    );
  }
};

/** process.loadEnvFile (Node 21.7+): read KEY=value lines into process.env. */
proc.loadEnvFile = (path = ".env") => {
  const fs = ctx.machine.builtin("fs");
  const text = fs.readFileSync(path, "utf8");
  for (const [k, v] of Object.entries(parseEnv(text))) if (proc.env[k] === undefined) proc.env[k] = v;
};

export function parseEnv(text) {
  const out = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = /^(?:export\s+)?([\w.-]+)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].trim();
    const q = value[0];
    if ((q === '"' || q === "'" || q === "`") && value.indexOf(q, 1) > 0) {
      value = value.slice(1, value.indexOf(q, 1));
      if (q === '"') value = value.replace(/\\n/g, "\n");
    } else {
      const hash = value.indexOf(" #");
      if (hash !== -1) value = value.slice(0, hash).trim();
    }
    out[m[1]] = value;
  }
  return out;
}

proc.binding = () => {
  throw new Error("No such module");
};
proc.emit = EventEmitter.prototype.emit;

/** Start a machine: fresh environment, arguments, listeners and streams. */
export function resetProcess({ env, argv, stdin, execArgv = [] }) {
  proc.removeAllListeners();
  proc.stdout.removeAllListeners();
  proc.stderr.removeAllListeners();
  proc.env = makeEnv(env);
  proc.argv = argv;
  proc.execArgv = execArgv;
  proc.exitCode = undefined;
  warnedOnce = false;
  proc.stdin = stdin;
  return proc;
}

export default proc;
