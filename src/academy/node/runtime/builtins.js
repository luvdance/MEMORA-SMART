/**
 * The smaller Node built-ins: os, net, timers, url, querystring, assert,
 * zlib, readline, dns, async_hooks, perf_hooks, module and the modules a lab
 * machine cannot offer (child_process, worker_threads, cluster), which fail
 * with a clear message instead of pretending.
 */
import * as urlPkg from "url/url.js";
import qsPkg from "querystring-es3";
import * as fflate from "fflate";
import EventEmitter from "./events.js";
import { Readable, Transform } from "./stream.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";
import { inspect } from "./inspect.js";
import { deepEqual } from "./util.js";
import { Socket } from "./http.js";

const codeError = (code, message, Type = Error) => Object.assign(new Type(message), { code });

/* ── os ─────────────────────────────────────────────────────────────── */
const cpu = { model: "Intel(R) Xeon(R) Platinum 8375C CPU @ 2.90GHz", speed: 2900, times: { user: 252020, nice: 0, sys: 30340, idle: 1070356870, irq: 0 } };
export const os = {
  EOL: "\n",
  devNull: "/dev/null",
  platform: () => "linux",
  type: () => "Linux",
  release: () => "6.8.0-1015-aws",
  version: () => "#16-Ubuntu SMP",
  machine: () => "x86_64",
  arch: () => "x64",
  hostname: () => "lab-server",
  homedir: () => "/home/node",
  tmpdir: () => "/tmp",
  endianness: () => "LE",
  cpus: () => [cpu, cpu, cpu, cpu],
  availableParallelism: () => 4,
  totalmem: () => 4 * 1024 ** 3,
  freemem: () => 2.6 * 1024 ** 3,
  uptime: () => 86400 + Math.floor((ctx.loop?.now() ?? 0) / 1000) % 86400,
  loadavg: () => [0.08, 0.05, 0.01],
  networkInterfaces: () => ({ lo: [{ address: "127.0.0.1", netmask: "255.0.0.0", family: "IPv4", mac: "00:00:00:00:00:00", internal: true, cidr: "127.0.0.1/8" }] }),
  userInfo: () => ({ uid: 1000, gid: 1000, username: "node", homedir: "/home/node", shell: "/bin/sh" }),
  constants: { signals: { SIGHUP: 1, SIGINT: 2, SIGKILL: 9, SIGTERM: 15, SIGUSR2: 12 }, errno: {} },
};

/* ── net ────────────────────────────────────────────────────────────── */
const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
export function isIPv4(s) {
  return IPV4.test(String(s));
}
export function isIPv6(s) {
  const v = String(s);
  if (!v.includes(":") || /[^0-9a-fA-F:.%a-zA-Z]/.test(v)) return false;
  try {
    new URL(`http://[${v.split("%")[0]}]/`);
    return true;
  } catch {
    return false;
  }
}
export const net = {
  isIP: (s) => (isIPv4(s) ? 4 : isIPv6(s) ? 6 : 0),
  isIPv4,
  isIPv6,
  Socket,
  createServer: () => {
    throw codeError("ERR_LAB_UNSUPPORTED", "Raw TCP servers are not available in the lab: use http.createServer.");
  },
  connect: () => {
    throw codeError("ERR_LAB_UNSUPPORTED", "Raw TCP connections are not available in the lab: use fetch or http.request.");
  },
};
net.createConnection = net.connect;

/* ── timers ─────────────────────────────────────────────────────────── */
const loop = () => ctx.loop;
export const timers = {
  setTimeout: (...a) => loop().setTimeout(...a),
  clearTimeout: (t) => loop()?.clear(t),
  setInterval: (...a) => loop().setInterval(...a),
  clearInterval: (t) => loop()?.clear(t),
  setImmediate: (...a) => loop().setImmediate(...a),
  clearImmediate: (i) => loop()?.clearImmediate(i),
};

function abortError(signal) {
  const err = new Error("The operation was aborted");
  err.name = "AbortError";
  err.code = "ABORT_ERR";
  if (signal?.reason !== undefined) err.cause = signal.reason;
  return err;
}

export const timersPromises = {
  setTimeout(ms, value, { signal } = {}) {
    if (signal?.aborted) return Promise.reject(abortError(signal));
    return new Promise((resolve, reject) => {
      const t = loop().setTimeout(() => resolve(value), ms);
      signal?.addEventListener("abort", () => {
        loop().clear(t);
        reject(abortError(signal));
      }, { once: true });
    });
  },
  setImmediate(value) {
    return new Promise((resolve) => loop().setImmediate(() => resolve(value)));
  },
  async *setInterval(ms, value) {
    for (;;) {
      await timersPromises.setTimeout(ms);
      yield value;
    }
  },
  scheduler: {
    wait: (ms, opts) => timersPromises.setTimeout(ms, undefined, opts),
    yield: () => timersPromises.setImmediate(),
  },
};
timers.promises = timersPromises;

/* ── url ────────────────────────────────────────────────────────────── */
export function fileURLToPath(u) {
  const url = typeof u === "string" ? new URL(u) : u;
  if (url.protocol !== "file:") throw codeError("ERR_INVALID_URL_SCHEME", "The URL must be of scheme file", TypeError);
  return decodeURIComponent(url.pathname);
}
export function pathToFileURL(p) {
  return new URL(`file://${encodeURI(p.startsWith("/") ? p : `${ctx.machine?.cwd || "/app"}/${p}`)}`);
}
export const url = {
  URL: globalThis.URL,
  URLSearchParams: globalThis.URLSearchParams,
  parse: urlPkg.parse,
  format: urlPkg.format,
  resolve: urlPkg.resolve,
  Url: urlPkg.Url,
  fileURLToPath,
  pathToFileURL,
  domainToASCII: (d) => new URL(`http://${d}`).hostname,
  urlToHttpOptions: (u) => ({ protocol: u.protocol, hostname: u.hostname, hash: u.hash, search: u.search, pathname: u.pathname, path: `${u.pathname}${u.search}`, href: u.href, port: u.port ? Number(u.port) : undefined }),
};

export const querystring = {
  ...qsPkg,
  parse: qsPkg.parse || qsPkg.decode,
  stringify: qsPkg.stringify || qsPkg.encode,
  escape: (s) => encodeURIComponent(s),
  unescape: (s) => decodeURIComponent(s.replace(/\+/g, " ")),
};

/* ── assert ─────────────────────────────────────────────────────────── */
export class AssertionError extends Error {
  constructor({ message, actual, expected, operator, generated }) {
    super(message);
    this.name = "AssertionError";
    this.generatedMessage = Boolean(generated);
    this.code = "ERR_ASSERTION";
    this.actual = actual;
    this.expected = expected;
    this.operator = operator;
  }
}

function fail(message, generated, actual, expected, operator) {
  if (message instanceof Error) throw message;
  throw new AssertionError({ message: message ?? generated, actual, expected, operator, generated: message === undefined });
}

function diffLines(actual, expected) {
  const a = inspect(actual).split("\n");
  const e = inspect(expected).split("\n");
  if (a.length === 1 && e.length === 1) return `\n${a[0]} !== ${e[0]}\n`;
  const out = ["+ actual - expected", ""];
  const max = Math.max(a.length, e.length);
  for (let i = 0; i < max; i++) {
    if (a[i] === e[i]) out.push(`  ${a[i]}`);
    else {
      if (a[i] !== undefined) out.push(`+ ${a[i]}`);
      if (e[i] !== undefined) out.push(`- ${e[i]}`);
    }
  }
  return `${out.join("\n")}\n`;
}

function matches(err, expected) {
  if (expected === undefined) return true;
  if (typeof expected === "function") {
    if (expected.prototype !== undefined && err instanceof expected) return true;
    if (Object.prototype.isPrototypeOf.call(Error, expected) || expected === Error) return false;
    return expected(err) === true;
  }
  if (expected instanceof RegExp) return expected.test(String(err?.message ?? err));
  if (typeof expected === "object") return Object.keys(expected).every((k) => (expected[k] instanceof RegExp ? expected[k].test(err?.[k]) : deepEqual(err?.[k], expected[k], true)));
  return false;
}

function makeAssert(strict) {
  const ok = (value, message) => {
    if (!value) fail(message, "The expression evaluated to a falsy value:\n\n  assert.ok(" + inspect(value) + ")\n", value, true, "==");
  };
  const assert = (value, message) => ok(value, message);
  const strictEqual = (a, e, message) => {
    if (!Object.is(a, e)) fail(message === undefined ? undefined : `${message}\n${diffLines(a, e)}`, `Expected values to be strictly equal:\n${diffLines(a, e)}`, a, e, "strictEqual");
  };
  const deepStrictEqual = (a, e, message) => {
    if (!deepEqual(a, e, true)) fail(message, `Expected values to be strictly deep-equal:\n${diffLines(a, e)}`, a, e, "deepStrictEqual");
  };
  Object.assign(assert, {
    ok,
    AssertionError,
    strictEqual,
    deepStrictEqual,
    equal: strict ? strictEqual : (a, e, m) => {
      if (!(a == e || (a !== a && e !== e))) fail(m, `${inspect(a)} == ${inspect(e)}`, a, e, "==");
    },
    deepEqual: strict ? deepStrictEqual : (a, e, m) => {
      if (!deepEqual(a, e, false)) fail(m, `Expected values to be loosely deep-equal:\n\n${inspect(a)}\n\nshould loosely deep-equal\n\n${inspect(e)}`, a, e, "deepEqual");
    },
    notStrictEqual: (a, e, m) => {
      if (Object.is(a, e)) fail(m, `Expected "actual" to be strictly unequal to: ${inspect(e)}`, a, e, "notStrictEqual");
    },
    notDeepStrictEqual: (a, e, m) => {
      if (deepEqual(a, e, true)) fail(m, `Expected "actual" not to be strictly deep-equal to: ${inspect(e)}`, a, e, "notDeepStrictEqual");
    },
    notEqual: (a, e, m) => {
      if (a == e) fail(m, `${inspect(a)} != ${inspect(e)}`, a, e, "!=");
    },
    match: (s, re, m) => {
      if (!re.test(s)) fail(m, `The input did not match the regular expression ${re}. Input:\n\n${inspect(s)}\n`, s, re, "match");
    },
    doesNotMatch: (s, re, m) => {
      if (re.test(s)) fail(m, `The input was expected to not match the regular expression ${re}. Input:\n\n${inspect(s)}\n`, s, re, "doesNotMatch");
    },
    fail: (m = "Failed") => fail(m, m, undefined, undefined, "fail"),
    throws: (fn, expected, m) => {
      try {
        fn();
      } catch (err) {
        if (!matches(err, expected)) throw err;
        return;
      }
      fail(typeof expected === "string" ? expected : m, "Missing expected exception.", undefined, expected, "throws");
    },
    doesNotThrow: (fn, m) => {
      try {
        fn();
      } catch (err) {
        fail(m, `Got unwanted exception.\nActual message: "${err?.message}"`, err, undefined, "doesNotThrow");
      }
    },
    rejects: async (p, expected, m) => {
      try {
        await (typeof p === "function" ? p() : p);
      } catch (err) {
        if (!matches(err, expected)) throw err;
        return;
      }
      fail(typeof expected === "string" ? expected : m, "Missing expected rejection.", undefined, expected, "rejects");
    },
    doesNotReject: async (p, m) => {
      try {
        await (typeof p === "function" ? p() : p);
      } catch (err) {
        fail(m, `Got unwanted rejection.\nActual message: "${err?.message}"`, err, undefined, "doesNotReject");
      }
    },
    ifError: (v) => {
      if (v !== null && v !== undefined) throw v;
    },
  });
  return assert;
}
export const assert = makeAssert(false);
assert.strict = makeAssert(true);
assert.strict.strict = assert.strict;

/* ── zlib, with fflate ──────────────────────────────────────────────── */
function zlibTransform(make) {
  return (options) => {
    const chunks = [];
    return new Transform({
      transform(chunk, enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
      flush(cb) {
        try {
          this.push(Buffer.from(make(Buffer.concat(chunks), options)));
          cb();
        } catch (err) {
          cb(Object.assign(new Error(err.message || "zlib error"), { code: "Z_DATA_ERROR", errno: -3 }));
        }
      },
    });
  };
}
const sync = (fn) => (buf, options) => Buffer.from(fn(typeof buf === "string" ? Buffer.from(buf) : buf, options));
const gz = (b, o) => fflate.gzipSync(b, { level: o?.level ?? 6, mtime: 0 });
const gunz = (b) => fflate.gunzipSync(b);
const defl = (b, o) => fflate.zlibSync(b, { level: o?.level ?? 6 });
const infl = (b) => fflate.unzlibSync(b);
const rawDefl = (b, o) => fflate.deflateSync(b, { level: o?.level ?? 6 });
const rawInfl = (b) => fflate.inflateSync(b);
const noBrotli = () => {
  throw codeError("ERR_LAB_UNSUPPORTED", "Brotli is not available in the lab; use gzip.");
};
function cbVersion(fn) {
  return (buf, options, cb) => {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    let out;
    let error = null;
    try {
      out = fn(buf, options);
    } catch (e) {
      error = e;
    }
    loop().setImmediate(() => cb(error, out));
  };
}
export const zlib = {
  gzipSync: sync(gz),
  gunzipSync: sync(gunz),
  deflateSync: sync(defl),
  inflateSync: sync(infl),
  deflateRawSync: sync(rawDefl),
  inflateRawSync: sync(rawInfl),
  unzipSync: sync((b) => (b[0] === 0x1f ? gunz(b) : infl(b))),
  brotliCompressSync: noBrotli,
  brotliDecompressSync: noBrotli,
  createGzip: zlibTransform(gz),
  createGunzip: zlibTransform(gunz),
  createDeflate: zlibTransform(defl),
  createInflate: zlibTransform(infl),
  createDeflateRaw: zlibTransform(rawDefl),
  createInflateRaw: zlibTransform(rawInfl),
  createUnzip: zlibTransform((b) => (b[0] === 0x1f ? gunz(b) : infl(b))),
  createBrotliCompress: noBrotli,
  createBrotliDecompress: noBrotli,
  constants: { Z_NO_FLUSH: 0, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, BROTLI_PARAM_QUALITY: 1, BROTLI_OPERATION_FLUSH: 1, BROTLI_OPERATION_FINISH: 2 },
};
zlib.gzip = cbVersion(zlib.gzipSync);
zlib.gunzip = cbVersion(zlib.gunzipSync);
zlib.deflate = cbVersion(zlib.deflateSync);
zlib.inflate = cbVersion(zlib.inflateSync);
Object.assign(zlib, zlib.constants);

/* ── readline: lines from a stream (process.stdin in a CLI lab) ─────── */
class Interface extends EventEmitter {
  constructor(input, output, promised) {
    super();
    if (input && !input.on && input.input) {
      output = input.output;
      input = input.input;
    }
    this.input = input;
    this.output = output;
    this.closed = false;
    this.terminal = false;
    this.line = "";
    this._promised = promised;
    this._lines = [];
    this._waiters = [];
    this._questions = [];
    let buf = "";
    this._onData = (chunk) => {
      buf += typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");
      let i;
      while ((i = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, i).replace(/\r$/, "");
        buf = buf.slice(i + 1);
        this._deliver(line);
      }
    };
    this._onEnd = () => {
      if (buf) this._deliver(buf);
      buf = "";
      this.close();
    };
    input?.on?.("data", this._onData);
    input?.on?.("end", this._onEnd);
  }
  _deliver(line) {
    if (this.closed) return;
    const q = this._questions.shift();
    if (q) {
      q(line);
      return;
    }
    this.emit("line", line);
    if (this._waiters.length) this._waiters.shift()({ value: line, done: false });
    else if (this.listenerCount("line") === 0) this._lines.push(line);
  }
  setPrompt(p) {
    this._prompt = p;
  }
  getPrompt() {
    return this._prompt ?? "> ";
  }
  prompt() {
    this.output?.write(this.getPrompt());
  }
  write(data) {
    this.output?.write(data);
  }
  question(query, options, cb) {
    if (typeof options === "function") cb = options;
    this.output?.write(query);
    if (this._promised || !cb) {
      return new Promise((resolve, reject) => {
        if (this.closed) reject(codeError("ERR_USE_AFTER_CLOSE", "readline was closed"));
        else if (this._lines.length) resolve(this._lines.shift());
        else this._questions.push(resolve);
      });
    }
    if (this._lines.length) loop().setImmediate(cb, this._lines.shift());
    else this._questions.push(cb);
    return undefined;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.input?.removeListener?.("data", this._onData);
    this.input?.removeListener?.("end", this._onEnd);
    this.emit("close");
    while (this._waiters.length) this._waiters.shift()({ value: undefined, done: true });
  }
  [Symbol.asyncIterator]() {
    const self = this;
    return {
      next() {
        if (self._lines.length) return Promise.resolve({ value: self._lines.shift(), done: false });
        if (self.closed) return Promise.resolve({ value: undefined, done: true });
        return new Promise((resolve) => self._waiters.push(resolve));
      },
      return() {
        self.close();
        return Promise.resolve({ value: undefined, done: true });
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
}
export const readline = {
  Interface,
  createInterface: (input, output) => new Interface(input, output, false),
  clearLine: () => true,
  cursorTo: () => true,
  moveCursor: () => true,
  emitKeypressEvents: () => {},
};
export const readlinePromises = {
  Interface,
  createInterface: (input, output) => new Interface(input, output, true),
};
readline.promises = readlinePromises;

/* ── dns ────────────────────────────────────────────────────────────── */
function lookupSync(host) {
  if (["localhost", "127.0.0.1", "::1"].includes(host)) return { address: host === "::1" || host === "localhost" ? "::1" : "127.0.0.1", family: host === "127.0.0.1" ? 4 : 6 };
  if (ctx.machine?.network.knows(host)) return { address: "203.0.113.10", family: 4 };
  const err = new Error(`getaddrinfo ENOTFOUND ${host}`);
  Object.assign(err, { errno: -3008, code: "ENOTFOUND", syscall: "getaddrinfo", hostname: host });
  throw err;
}
export const dns = {
  lookup(host, options, cb) {
    if (typeof options === "function") cb = options;
    let r;
    let e = null;
    try {
      r = lookupSync(host);
    } catch (err) {
      e = err;
    }
    loop().setImmediate(() => (e ? cb(e) : cb(null, r.address, r.family)));
  },
  promises: { lookup: async (host) => lookupSync(host) },
  setDefaultResultOrder() {},
};

/* ── async_hooks ────────────────────────────────────────────────────── */
export class AsyncLocalStorage {
  constructor() {
    this._store = undefined;
  }
  getStore() {
    return this._store;
  }
  run(store, fn, ...args) {
    const prev = this._store;
    this._store = store;
    try {
      const r = fn(...args);
      if (r && typeof r.then === "function") return r.finally(() => (this._store = prev));
      this._store = prev;
      return r;
    } catch (err) {
      this._store = prev;
      throw err;
    }
  }
  enterWith(store) {
    this._store = store;
  }
  exit(fn, ...args) {
    return this.run(undefined, fn, ...args);
  }
  disable() {
    this._store = undefined;
  }
  static bind(fn) {
    return fn;
  }
  static snapshot() {
    return (fn, ...args) => fn(...args);
  }
}
export class AsyncResource {
  constructor(type) {
    this.type = type;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.apply(thisArg, args);
  }
  bind(fn) {
    return fn.bind(this);
  }
  emitDestroy() {
    return this;
  }
  asyncId() {
    return 1;
  }
  triggerAsyncId() {
    return 0;
  }
  static bind(fn) {
    return fn;
  }
}
export const asyncHooks = {
  AsyncLocalStorage,
  AsyncResource,
  createHook: () => ({ enable() { return this; }, disable() { return this; } }),
  executionAsyncId: () => 1,
  triggerAsyncId: () => 0,
};

/* ── perf_hooks ─────────────────────────────────────────────────────── */
export const perfHooks = {
  performance: {
    now: () => (ctx.loop ? ctx.loop.perfNow() : performance.now()),
    get timeOrigin() {
      return performance.timeOrigin;
    },
    mark: () => {},
    measure: () => {},
    eventLoopUtilization: () => ({ idle: 1000, active: 10, utilization: 0.01 }),
  },
  PerformanceObserver: class {
    observe() {}
    disconnect() {}
  },
  monitorEventLoopDelay: () => {
    const h = { min: 0, max: 0, mean: 0, stddev: 0, percentiles: new Map(), enable() { return true; }, disable() { return true; }, reset() {}, percentile: () => 0 };
    return h;
  },
};

/* ── what a lab machine cannot do ───────────────────────────────────── */
function unavailable(name, advice) {
  const thrower = () => {
    throw codeError("ERR_LAB_UNSUPPORTED", `${name} is not available in the lab machine. ${advice}`);
  };
  return new Proxy({}, { get: (_, key) => (key === "__esModule" ? false : key === "isMainThread" ? true : key === "isPrimary" || key === "isMaster" ? true : thrower) });
}
export const childProcess = unavailable("child_process", "Lessons that run other programs show a real recorded terminal instead.");
export const workerThreads = {
  isMainThread: true,
  parentPort: null,
  workerData: null,
  threadId: 0,
  Worker: class {
    constructor() {
      throw codeError("ERR_LAB_UNSUPPORTED", "worker_threads is not available in the lab machine.");
    }
  },
};
export const cluster = { isPrimary: true, isMaster: true, isWorker: false, fork: () => { throw codeError("ERR_LAB_UNSUPPORTED", "cluster is not available in the lab machine."); }, on() {} };
export const tty = { isatty: () => false, ReadStream: Readable, WriteStream: EventEmitter };
export const v8 = {
  getHeapStatistics: () => ({ total_heap_size: 18874368, used_heap_size: 11534336, heap_size_limit: 4345298944, total_available_size: 4333764608 }),
  serialize: (v) => Buffer.from(JSON.stringify(v)),
  deserialize: (b) => JSON.parse(Buffer.from(b).toString()),
};
export const diagnosticsChannel = {
  channel: () => ({ hasSubscribers: false, publish() {}, subscribe() {}, unsubscribe() {} }),
  hasSubscribers: () => false,
  subscribe() {},
  unsubscribe() {},
  tracingChannel: () => ({ hasSubscribers: false, traceSync: (fn, ctxObj, thisArg, ...args) => fn.apply(thisArg, args), tracePromise: (fn, ctxObj, thisArg, ...args) => fn.apply(thisArg, args), subscribe() {}, unsubscribe() {} }),
};
