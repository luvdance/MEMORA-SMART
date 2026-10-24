/**
 * TESTS IN THE LAB — `npm test` runs Vitest-style test files, and
 * `supertest` sends real requests to an Express app.
 *
 *   import { describe, it, expect, vi, beforeEach } from "vitest";
 *   import request from "supertest";
 *   import app from "../src/app.js";
 *
 *   it("lists courses", async () => {
 *     const res = await request(app).get("/courses").expect(200);
 *     expect(res.body).toHaveLength(3);
 *   });
 *
 * The API is Vitest's and supertest's (with their failure messages), the
 * report is laid out as Vitest 5 prints it, and every test file gets a
 * fresh module registry, as Vitest isolates files. vi.mock() calls are
 * hoisted above the imports, as Vitest hoists them.
 */
import { inspect } from "./inspect.js";
import { deepEqual } from "./util.js";
import { STATUS_CODES } from "./http.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";
import { ModuleSystem } from "./modules.js";

/* ── Mocks ─────────────────────────────────────────────────────────── */

const allMocks = new Set();

export function fn(impl) {
  let implementation = impl;
  const onces = [];
  const mock = { calls: [], results: [], instances: [], lastCall: undefined };
  const spy = function (...args) {
    mock.calls.push(args);
    mock.lastCall = args;
    mock.instances.push(this);
    const use = onces.length ? onces.shift() : implementation;
    try {
      const value = use ? use.apply(this, args) : undefined;
      mock.results.push({ type: "return", value });
      return value;
    } catch (err) {
      mock.results.push({ type: "throw", value: err });
      throw err;
    }
  };
  spy.mock = mock;
  spy._isMockFunction = true;
  spy._name = "spy";
  spy.getMockName = () => spy._name;
  spy.mockName = (n) => {
    spy._name = n;
    return spy;
  };
  spy.mockImplementation = (f) => {
    implementation = f;
    return spy;
  };
  spy.mockImplementationOnce = (f) => {
    onces.push(f);
    return spy;
  };
  spy.mockReturnValue = (v) => spy.mockImplementation(() => v);
  spy.mockReturnValueOnce = (v) => spy.mockImplementationOnce(() => v);
  spy.mockResolvedValue = (v) => spy.mockImplementation(() => Promise.resolve(v));
  spy.mockResolvedValueOnce = (v) => spy.mockImplementationOnce(() => Promise.resolve(v));
  spy.mockRejectedValue = (e) => spy.mockImplementation(() => Promise.reject(e));
  spy.mockRejectedValueOnce = (e) => spy.mockImplementationOnce(() => Promise.reject(e));
  spy.mockClear = () => {
    mock.calls.length = 0;
    mock.results.length = 0;
    mock.instances.length = 0;
    mock.lastCall = undefined;
    return spy;
  };
  spy.mockReset = () => {
    spy.mockClear();
    implementation = impl;
    onces.length = 0;
    return spy;
  };
  spy.mockRestore = () => spy.mockReset();
  spy.getMockImplementation = () => implementation;
  allMocks.add(spy);
  return spy;
}

function spyOn(obj, method) {
  const original = obj[method];
  const spy = fn(function (...args) {
    return original.apply(this, args);
  });
  spy._name = method;
  spy.mockRestore = () => {
    obj[method] = original;
    return spy;
  };
  obj[method] = spy;
  return spy;
}

const isMock = (f) => typeof f === "function" && f._isMockFunction;

/* ── expect ────────────────────────────────────────────────────────── */

class Asymmetric {
  constructor(name, test, text) {
    this.name = name;
    this.test = test;
    this.text = text;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.text;
  }
}

function equals(a, b, strict = false) {
  if (b instanceof Asymmetric) return b.test(a);
  if (a instanceof Asymmetric) return a.test(b);
  if (Array.isArray(b) && Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => equals(x, b[i], strict));
  }
  if (b && typeof b === "object" && a && typeof a === "object" && !(b instanceof Date) && !(b instanceof RegExp) && !(b instanceof Map) && !(b instanceof Set) && !ArrayBuffer.isView(b)) {
    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
    const ka = Object.keys(a).filter((k) => strict || a[k] !== undefined);
    const kb = Object.keys(b).filter((k) => strict || b[k] !== undefined);
    if (ka.length !== kb.length) return false;
    return kb.every((k) => Object.prototype.hasOwnProperty.call(a, k) && equals(a[k], b[k], strict));
  }
  return deepEqual(a, b, true);
}

function matchesObject(actual, expected) {
  if (expected instanceof Asymmetric) return expected.test(actual);
  if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && expected.every((e, i) => matchesObject(actual[i], e));
  if (expected && typeof expected === "object" && !(expected instanceof Date) && !(expected instanceof RegExp)) {
    if (!actual || typeof actual !== "object") return false;
    return Object.keys(expected).every((k) => matchesObject(actual[k], expected[k]));
  }
  return equals(actual, expected);
}

const fmt = (v) => inspect(v);

export class AssertionError extends Error {
  constructor(message, actual, expected, showDiff = true) {
    super(message);
    this.name = "AssertionError";
    this.actual = actual;
    this.expected = expected;
    this.showDiff = showDiff;
  }
}

let assertionCount = 0;
let expectedAssertions = null;

function makeExpect(actual, negate = false, mode = null) {
  const check = (pass, message, notMessage, expected, showDiff = true) => {
    assertionCount += 1;
    if (pass === negate) throw new AssertionError(negate ? notMessage || message.replace(" to ", " not to ") : message, actual, expected, showDiff && !negate);
  };
  const name = () => (isMock(actual) ? `"${actual.getMockName()}"` : fmt(actual));
  const m = {
    toBe: (e) => check(Object.is(actual, e), `expected ${fmt(actual)} to be ${fmt(e)} // Object.is equality`, `expected ${fmt(actual)} not to be ${fmt(e)} // Object.is equality`, e),
    toEqual: (e) => check(equals(actual, e), `expected ${fmt(actual)} to deeply equal ${fmt(e)}`, `expected ${fmt(actual)} to not deeply equal ${fmt(e)}`, e),
    toStrictEqual: (e) => check(equals(actual, e, true), `expected ${fmt(actual)} to strictly equal ${fmt(e)}`, null, e),
    toBeTruthy: () => check(Boolean(actual), `expected ${fmt(actual)} to be truthy`, `expected ${fmt(actual)} to not be truthy`),
    toBeFalsy: () => check(!actual, `expected ${fmt(actual)} to be falsy`, `expected ${fmt(actual)} to not be falsy`),
    toBeNull: () => check(actual === null, `expected ${fmt(actual)} to be null`),
    toBeUndefined: () => check(actual === undefined, `expected ${fmt(actual)} to be undefined`),
    toBeDefined: () => check(actual !== undefined, `expected ${fmt(actual)} to be defined`, `expected ${fmt(actual)} to be undefined`),
    toBeNaN: () => check(Number.isNaN(actual), `expected ${fmt(actual)} to be NaN`),
    toBeTypeOf: (t) => check(typeof actual === t, `expected ${fmt(actual)} to be type of '${t}'`),
    toBeGreaterThan: (n) => check(actual > n, `expected ${fmt(actual)} to be greater than ${fmt(n)}`),
    toBeGreaterThanOrEqual: (n) => check(actual >= n, `expected ${fmt(actual)} to be greater than or equal to ${fmt(n)}`),
    toBeLessThan: (n) => check(actual < n, `expected ${fmt(actual)} to be less than ${fmt(n)}`),
    toBeLessThanOrEqual: (n) => check(actual <= n, `expected ${fmt(actual)} to be less than or equal to ${fmt(n)}`),
    toBeCloseTo: (n, digits = 2) => check(Math.abs(actual - n) < 10 ** -digits / 2, `expected ${fmt(actual)} to be close to ${fmt(n)}, received difference is ${Math.abs(actual - n)}, but expected ${10 ** -digits / 2}`),
    toContain: (x) => check(actual != null && (typeof actual === "string" ? actual.includes(x) : [...actual].includes(x)), `expected ${fmt(actual)} to include ${fmt(x)}`, `expected ${fmt(actual)} not to include ${fmt(x)}`),
    toContainEqual: (x) => check(actual != null && [...actual].some((a) => equals(a, x)), `expected ${fmt(actual)} to deep equally contain ${fmt(x)}`),
    toHaveLength: (n) => check(actual != null && actual.length === n, `expected ${fmt(actual)} to have a length of ${n} but got ${actual?.length}`, `expected ${fmt(actual)} to not have a length of ${n}`),
    toHaveProperty: (path, ...v) => {
      const keys = Array.isArray(path) ? path : String(path).split(".");
      let cur = actual;
      let has = true;
      for (const k of keys) {
        if (cur != null && Object.prototype.hasOwnProperty.call(Object(cur), k)) cur = cur[k];
        else {
          has = false;
          break;
        }
      }
      if (v.length) check(has && equals(cur, v[0]), `expected ${fmt(actual)} to have property "${keys.join(".")}" with value ${fmt(v[0])}`, null, v[0]);
      else check(has, `expected ${fmt(actual)} to have property "${keys.join(".")}"`, `expected ${fmt(actual)} not to have property "${keys.join(".")}"`);
    },
    toMatch: (re) => check(typeof re === "string" ? String(actual).includes(re) : re.test(String(actual)), `expected ${fmt(actual)} to ${typeof re === "string" ? "include" : "match"} ${fmt(re)}`, `expected ${fmt(actual)} not to ${typeof re === "string" ? "include" : "match"} ${fmt(re)}`),
    toMatchObject: (e) => check(matchesObject(actual, e), `expected ${fmt(actual)} to match object ${fmt(e)}`, null, e),
    toBeInstanceOf: (C) => check(actual instanceof C, `expected ${fmt(actual)} to be an instance of ${C?.name}`),
    toSatisfy: (f) => check(Boolean(f(actual)), `expected ${fmt(actual)} to satisfy ${f.name || "predicate"}`),
    toThrow: (expected) => {
      let threw = false;
      let err;
      if (mode === "rejects") {
        threw = true;
        err = actual;
      } else {
        try {
          actual();
        } catch (e) {
          threw = true;
          err = e;
        }
      }
      if (expected === undefined) return check(threw, "expected [Function] to throw an error", "expected [Function] to not throw an error but " + fmt(err) + " was thrown");
      const msg = err?.message ?? String(err);
      const ok = threw && (typeof expected === "string" ? msg.includes(expected) : expected instanceof RegExp ? expected.test(msg) : typeof expected === "function" ? err instanceof expected : expected instanceof Error ? msg === expected.message : matchesObject(err, expected));
      check(ok, threw ? `expected error to match ${fmt(expected)}, received: ${fmt(msg)}` : "expected [Function] to throw an error");
    },
    toHaveBeenCalled: () => check(isMock(actual) && actual.mock.calls.length > 0, `expected ${name()} to be called at least once`, `expected ${name()} to not be called at all, but actually been called ${actual?.mock?.calls.length} times`),
    toHaveBeenCalledOnce: () => check(isMock(actual) && actual.mock.calls.length === 1, `expected ${name()} to be called once, but got ${actual?.mock?.calls.length} times`),
    toHaveBeenCalledTimes: (n) => check(isMock(actual) && actual.mock.calls.length === n, `expected ${name()} to be called ${n} times, but got ${actual?.mock?.calls.length} times`),
    toHaveBeenCalledWith: (...args) => check(isMock(actual) && actual.mock.calls.some((c) => equals(c, args)), `expected ${name()} to be called with arguments: ${fmt(args)}\n\nReceived:\n${(actual?.mock?.calls || []).map((c, i) => `  ${i + 1}st spy call: ${fmt(c)}`).join("\n") || "  (no calls)"}`, `expected ${name()} to not be called with arguments: ${fmt(args)}`),
    toHaveBeenLastCalledWith: (...args) => check(isMock(actual) && equals(actual.mock.lastCall, args), `expected last ${name()} call to have been called with ${fmt(args)}`),
    toHaveBeenNthCalledWith: (n, ...args) => check(isMock(actual) && equals(actual.mock.calls[n - 1], args), `expected ${n}th ${name()} call to have been called with ${fmt(args)}`),
    toHaveReturned: () => check(isMock(actual) && actual.mock.results.some((r) => r.type === "return"), `expected ${name()} to be successfully called at least once`),
    toHaveReturnedWith: (v) => check(isMock(actual) && actual.mock.results.some((r) => r.type === "return" && equals(r.value, v)), `expected ${name()} to return ${fmt(v)}`),
  };
  m.toThrowError = m.toThrow;
  m.toBeCalled = m.toHaveBeenCalled;
  m.toBeCalledTimes = m.toHaveBeenCalledTimes;
  m.toBeCalledWith = m.toHaveBeenCalledWith;
  return m;
}

export function expect(actual, message) {
  void message;
  const api = makeExpect(actual);
  api.not = makeExpect(actual, true);
  const settle = (rejects) =>
    new Proxy(
      {},
      {
        get: (_, key) => (...args) =>
          Promise.resolve(actual).then(
            (v) => {
              if (rejects) throw new AssertionError(`promise resolved "${inspect(v)}" instead of rejecting`, v, undefined, false);
              return (key === "not" ? null : makeExpect(v))[key](...args);
            },
            (e) => {
              if (!rejects) throw new AssertionError(`promise rejected "${inspect(e)}" instead of resolving`, e, undefined, false);
              return makeExpect(e, false, "rejects")[key](...args);
            }
          ),
      }
    );
  api.resolves = settle(false);
  api.rejects = settle(true);
  return api;
}
expect.any = (C) =>
  new Asymmetric("Any", (v) => (C === Number ? typeof v === "number" || v instanceof Number : C === String ? typeof v === "string" || v instanceof String : C === Boolean ? typeof v === "boolean" : C === Function ? typeof v === "function" : C === Object ? typeof v === "object" && v !== null : v instanceof C), `Any<${C.name}>`);
expect.anything = () => new Asymmetric("Anything", (v) => v !== null && v !== undefined, "Anything");
expect.objectContaining = (o) => new Asymmetric("ObjectContaining", (v) => matchesObject(v, o), `ObjectContaining ${inspect(o)}`);
expect.arrayContaining = (arr) => new Asymmetric("ArrayContaining", (v) => Array.isArray(v) && arr.every((x) => v.some((y) => equals(y, x))), `ArrayContaining ${inspect(arr)}`);
expect.stringContaining = (s) => new Asymmetric("StringContaining", (v) => typeof v === "string" && v.includes(s), `StringContaining "${s}"`);
expect.stringMatching = (re) => new Asymmetric("StringMatching", (v) => typeof v === "string" && new RegExp(re).test(v), `StringMatching ${re}`);
expect.assertions = (n) => {
  expectedAssertions = n;
};
expect.hasAssertions = () => {
  expectedAssertions = -1;
};

/* ── describe / it ─────────────────────────────────────────────────── */

let currentSuite = null;

function makeSuite(name, parent) {
  return { name, parent, tests: [], suites: [], beforeAll: [], afterAll: [], beforeEach: [], afterEach: [], children: [], only: false, skip: false };
}

let defaultTestTimeout = 5000;
function addTest(name, fnBody, opts = {}) {
  const t = { type: "test", name, fn: fnBody, timeout: opts.timeout ?? defaultTestTimeout, skip: Boolean(opts.skip), only: Boolean(opts.only), todo: Boolean(opts.todo), suite: currentSuite };
  currentSuite.children.push(t);
  return t;
}

function testApi(opts = {}) {
  const t = (name, body, timeout) => addTest(name, body, { ...opts, timeout: typeof timeout === "number" ? timeout : timeout?.timeout });
  t.each = (table) => (name, body, timeout) => {
    for (const row of table) {
      const args = Array.isArray(row) ? row : [row];
      let i = 0;
      const title = String(name).replace(/%[sdiopjf#$%]/g, (mm) => (mm === "%%" ? "%" : mm === "%#" ? String(table.indexOf(row)) : inspect(args[i++])));
      const label = typeof row === "object" && !Array.isArray(row) ? title.replace(/\$(\w+)/g, (_, k) => inspect(row[k])) : title;
      t(label, () => body(...args), timeout);
    }
  };
  t.skip = (name, body) => addTest(name, body, { ...opts, skip: true });
  t.only = (name, body, timeout) => addTest(name, body, { ...opts, only: true, timeout });
  t.todo = (name) => addTest(name, null, { todo: true });
  t.skipIf = (cond) => (cond ? t.skip : t);
  t.runIf = (cond) => (cond ? t : t.skip);
  t.concurrent = t;
  return t;
}

export const it = testApi();
export const test = it;

export function describe(name, body) {
  const suite = makeSuite(name, currentSuite);
  suite.type = "suite";
  currentSuite.children.push(suite);
  const prev = currentSuite;
  currentSuite = suite;
  try {
    body?.();
  } finally {
    currentSuite = prev;
  }
}
describe.skip = (name, body) => {
  describe(name, body);
  currentSuite.children[currentSuite.children.length - 1].skip = true;
};
describe.only = (name, body) => {
  describe(name, body);
  currentSuite.children[currentSuite.children.length - 1].only = true;
};
describe.each = (table) => (name, body) => {
  for (const row of table) {
    const args = Array.isArray(row) ? row : [row];
    let i = 0;
    describe(String(name).replace(/%[sdio]/g, () => inspect(args[i++])), () => body(...args));
  }
};
export const suite = describe;

export const beforeAll = (f) => currentSuite.beforeAll.push(f);
export const afterAll = (f) => currentSuite.afterAll.push(f);
export const beforeEach = (f) => currentSuite.beforeEach.push(f);
export const afterEach = (f) => currentSuite.afterEach.push(f);

export const vi = {
  fn,
  spyOn,
  isMockFunction: isMock,
  mocked: (f) => f,
  clearAllMocks: () => allMocks.forEach((m) => m.mockClear()),
  resetAllMocks: () => allMocks.forEach((m) => m.mockReset()),
  restoreAllMocks: () => allMocks.forEach((m) => m.mockRestore()),
  mock: (spec, factory) => {
    const run = ctx.machine?.testRun;
    if (run) run.mocks.push({ spec, factory, from: run.file });
  },
  doMock: (spec, factory) => vi.mock(spec, factory),
  unmock: () => {},
  hoisted: (f) => f(),
  stubEnv: (k, v) => {
    if (!(k in ctx.machine.testRun.envBackup)) ctx.machine.testRun.envBackup[k] = ctx.machine.envObject()[k];
    ctx.machine.envObject()[k] = v;
  },
  unstubAllEnvs: () => {
    const run = ctx.machine.testRun;
    for (const [k, v] of Object.entries(run.envBackup)) {
      if (v === undefined) delete ctx.machine.envObject()[k];
      else ctx.machine.envObject()[k] = v;
    }
    run.envBackup = {};
  },
  useFakeTimers: () => vi,
  useRealTimers: () => vi,
  setSystemTime: (t) => {
    const loop = ctx.loop;
    loop.offset += new Date(t).getTime() - loop.now();
    return vi;
  },
  getRealSystemTime: () => globalThis.__labReal?.Date.now() ?? Date.now(),
  advanceTimersByTime: (ms) => {
    const loop = ctx.loop;
    const target = loop.now() + ms;
    for (;;) {
      const next = loop.nextTimer();
      if (!next || next._due > target) break;
      if (next._due > loop.now()) loop.offset += next._due - loop.now();
      loop.runDue();
    }
    if (target > loop.now()) loop.offset += target - loop.now();
    return vi;
  },
  advanceTimersByTimeAsync: async (ms) => {
    await ctx.loop.advance(ms);
    return vi;
  },
  runAllTimers: () => vi.advanceTimersByTime(24 * 3600 * 1000),
  runAllTimersAsync: async () => vi.advanceTimersByTimeAsync(24 * 3600 * 1000),
  waitFor: async (cb, { timeout = 1000, interval = 50 } = {}) => {
    const start = ctx.loop.now();
    for (;;) {
      try {
        return await cb();
      } catch (err) {
        if (ctx.loop.now() - start > timeout) throw err;
        await new Promise((r) => ctx.loop.setTimeout(r, interval));
      }
    }
  },
};

/** Move vi.mock(...) calls above the imports, as Vitest does. */
export function hoistMocks(source) {
  const calls = [];
  let i = 0;
  let out = "";
  for (;;) {
    const at = source.indexOf("vi.mock(", i);
    if (at === -1) {
      out += source.slice(i);
      break;
    }
    const lineStart = source.lastIndexOf("\n", at - 1) + 1;
    if (source.slice(lineStart, at).trim() !== "") {
      out += source.slice(i, at + 8);
      i = at + 8;
      continue;
    }
    let depth = 0;
    let j = at + 7;
    for (; j < source.length; j++) {
      if (source[j] === "(") depth++;
      else if (source[j] === ")") {
        depth--;
        if (depth === 0) break;
      }
    }
    let end = j + 1;
    if (source[end] === ";") end++;
    const call = source.slice(at, end);
    out += source.slice(i, at) + call.replace(/[^\n]/g, " ");
    calls.push(call);
    i = end;
  }
  if (!calls.length) return source;
  // After the vitest import (vi must exist), on the same line, so line numbers stay put.
  const vitestImport = /(^|\n)(\s*import\s[^;]*from\s*["']vitest["'];?)/.exec(out);
  if (vitestImport) {
    const pos = vitestImport.index + vitestImport[0].length;
    return `${out.slice(0, pos)} ${calls.join(" ")}${out.slice(pos)}`;
  }
  return `${calls.join(" ")} ${out}`;
}

/* ── Running test files ────────────────────────────────────────────── */

const TEST_FILE = /(^|\/)[^/]+\.(test|spec)\.(m?[jt]s|cjs|cts)$/;

export function findTestFiles(vol, filters = []) {
  const files = [];
  for (const [p, n] of vol.nodes) {
    if (n.type !== "file" || !p.startsWith("/app/") || p.includes("/node_modules/")) continue;
    const rel = p.slice(5);
    if (TEST_FILE.test(rel) && (!filters.length || filters.some((f) => rel.includes(f)))) files.push(p);
  }
  return files.sort();
}

function flatten(suite, path = []) {
  const out = [];
  for (const c of suite.children) {
    if (c.type === "suite") out.push(...flatten(c, [...path, c]));
    else out.push({ test: c, suites: path });
  }
  return out;
}

async function runHooks(list, loop, timeout = 10000) {
  for (const h of list) {
    const p = Promise.resolve().then(() => h());
    p.catch(() => {});
    const r = await loop.settle(p, { limit: timeout });
    if (r === "stuck") throw new Error(`Hook timed out in ${timeout}ms.`);
    await p;
  }
}

/**
 * Run the project's tests (`npm test`). Writes Vitest's report to stdout
 * and returns [{ file, name, path, state, error, duration }].
 */
/** vitest.config.{js,mjs,ts}: the `test` options the lab supports. */
async function loadConfig(machine) {
  for (const name of ["vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.config.mjs"]) {
    const file = `/app/${name}`;
    if (!machine.vol.node(file)) continue;
    const modules = new ModuleSystem(machine, { strictDependencies: machine.opts.strictDependencies !== false });
    const fmtOf = modules.formatOf(file);
    let exported;
    if (fmtOf === "esm" || name.endsWith("ts")) {
      const m = await modules.importFrom(file, null);
      exported = m.exports.default ?? m.exports;
    } else {
      exported = modules.requireFrom(file, null);
      exported = exported.default ?? exported;
    }
    if (typeof exported === "function") exported = await exported({ mode: "test" });
    return { file: name, ...(exported?.test || {}) };
  }
  return {};
}

const GLOBAL_NAMES = ["describe", "it", "test", "suite", "expect", "vi", "beforeAll", "afterAll", "beforeEach", "afterEach"];

function globMatch(pattern, rel) {
  const re = new RegExp(
    `^${pattern
      .replace(/^\.\//, "")
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*\//g, "(?:.*/)?")
      .replace(/\*\*/g, ".*")
      .replace(/\*/g, "[^/]*")
      .replace(/\?/g, ".")}$`
  );
  return re.test(rel);
}

export async function runTestFiles(machine, filters = []) {
  const loop = machine.loop;
  let config = {};
  try {
    config = await loadConfig(machine);
  } catch (err) {
    machine.writeStd("stderr", `failed to load config from /app/vitest.config

${err?.stack || err}
`);
    return { results: [], exitCode: 1 };
  }
  for (const [k, v] of Object.entries(config.env || {})) machine.envObject()[k] = String(v);
  let files = findTestFiles(machine.vol, filters);
  if (Array.isArray(config.include) && config.include.length) {
    files = [...machine.vol.nodes.keys()]
      .filter((p) => p.startsWith("/app/") && !p.includes("/node_modules/") && machine.vol.node(p).type === "file")
      .filter((p) => config.include.some((g) => globMatch(g, p.slice(5))) && (!filters.length || filters.some((f) => p.includes(f))))
      .sort();
  }
  const setupFiles = [].concat(config.setupFiles || []).map((f) => `/app/${String(f).replace(/^\.\//, "")}`);
  defaultTestTimeout = Number(config.testTimeout) || 5000;
  if (config.globals) for (const n of GLOBAL_NAMES) globalThis[n] = { describe, it, test, suite, expect, vi, beforeAll, afterAll, beforeEach, afterEach }[n];
  const started = loop.now();
  const results = [];
  machine.writeStd("stdout", `\n RUN  v5.0.5 /app\n\n`);
  if (!files.length) {
    machine.writeStd("stdout", `No test files found, exiting with code 1\n\ninclude: **/*.{test,spec}.?(c|m)[jt]s?(x)\nexclude:  **/node_modules/**, **/.git/**\n\n`);
    return { results, exitCode: 1 };
  }
  const failures = [];
  for (const file of files) {
    const rel = file.slice(5);
    const root = makeSuite("", null);
    root.type = "suite";
    currentSuite = root;
    machine.testRun = { file, mocks: [], envBackup: {} };
    const modules = new ModuleSystem(machine, { strictDependencies: machine.opts.strictDependencies !== false });
    modules.sourceHook = (id, source) => (id === file ? hoistMocks(source) : source);
    modules.mockHook = (spec, fromFile, resolved) => {
      const hit = machine.testRun.mocks.find((m) => {
        try {
          const r = modules.resolve(m.spec, m.from, modules.formatOf(m.from));
          return (r.kind === "file" ? r.id : r.id) === resolved;
        } catch {
          return m.spec === spec;
        }
      });
      if (!hit) return null;
      hit.value ??= hit.factory ? hit.factory() : {};
      return hit.value;
    };
    machine.modules = modules;
    const fileStart = loop.now();
    let collectError = null;
    try {
      for (const setup of setupFiles) {
        if (modules.formatOf(setup) === "esm") {
          const p = modules.importFrom(setup, null);
          p.catch(() => {});
          await loop.settle(p);
          await p;
        } else modules.requireFrom(setup, null);
      }
      const fmtOf = modules.formatOf(file);
      if (fmtOf === "esm") {
        const p = modules.importFrom(file, null);
        p.catch(() => {});
        await loop.settle(p);
        await p;
      } else {
        const m = modules.instantiate(file, null);
        modules.evaluateSync(m, null);
      }
    } catch (err) {
      collectError = err;
    }
    const all = flatten(root);
    const anyOnly = all.some((x) => x.test.only || x.suites.some((s) => s.only));
    const fileResults = [];
    if (collectError) {
      failures.push({ rel, title: rel, error: collectError, suiteError: true });
    } else {
      const ranBeforeAll = new Set();
      const suitesOf = (x) => [root, ...x.suites];
      for (const x of all) {
        const t = x.test;
        const chain = suitesOf(x);
        const names = x.suites.map((s) => s.name);
        const full = [...names, t.name].join(" > ");
        const skipped = t.skip || t.todo || x.suites.some((s) => s.skip) || (anyOnly && !t.only && !x.suites.some((s) => s.only));
        const record = { file: rel, name: full, title: t.name, path: names, state: skipped ? (t.todo ? "todo" : "skip") : "pass", error: null, duration: 0 };
        if (skipped) {
          fileResults.push(record);
          continue;
        }
        const t0 = loop.now();
        try {
          for (const s of chain) {
            if (!ranBeforeAll.has(s)) {
              ranBeforeAll.add(s);
              await runHooks(s.beforeAll, loop);
            }
          }
          for (const s of chain) await runHooks(s.beforeEach, loop);
          assertionCount = 0;
          expectedAssertions = null;
          const p = Promise.resolve().then(() => t.fn());
          p.catch(() => {});
          const r = await loop.settle(p, { limit: t.timeout });
          if (r === "stuck") throw new Error(`Test timed out in ${t.timeout}ms.\nIf this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".`);
          await p;
          if (expectedAssertions === -1 && assertionCount === 0) throw new AssertionError("expected any number of assertion, but got none", 0, undefined, false);
          if (expectedAssertions > 0 && assertionCount !== expectedAssertions) throw new AssertionError(`expected number of assertions to be ${expectedAssertions}, but got ${assertionCount}`, assertionCount, expectedAssertions, false);
          for (const s of [...chain].reverse()) await runHooks(s.afterEach, loop);
        } catch (err) {
          record.state = "fail";
          record.error = err;
          try {
            for (const s of [...chain].reverse()) await runHooks(s.afterEach, loop);
          } catch {
            /* the test already failed */
          }
        }
        record.duration = Math.max(1, Math.round(loop.now() - t0));
        fileResults.push(record);
        if (record.state === "fail") failures.push({ rel, title: [rel, ...names, t.name].join(" > "), error: record.error });
      }
      // afterAll hooks, innermost first
      const suites = new Set(all.flatMap((x) => x.suites));
      for (const s of [...suites].reverse()) await runHooks(s.afterAll, loop).catch(() => {});
      await runHooks(root.afterAll, loop).catch(() => {});
    }
    vi.unstubAllEnvs();
    results.push(...fileResults);
    const ms = Math.max(1, Math.round(loop.now() - fileStart));
    const failed = fileResults.filter((r) => r.state === "fail").length;
    const n = fileResults.length;
    if (collectError) {
      machine.writeStd("stdout", ` ❯ ${rel} (0 test)\n`);
    } else if (failed) {
      machine.writeStd("stdout", ` ❯ ${rel} (${n} test${n === 1 ? "" : "s"} | ${failed} failed) ${ms}ms\n`);
      for (const r of fileResults) {
        if (r.state === "fail") machine.writeStd("stdout", `   × ${r.name} ${r.duration}ms\n`);
      }
    } else {
      const skipped = fileResults.filter((r) => r.state !== "pass").length;
      machine.writeStd("stdout", ` ✓ ${rel} (${n} test${n === 1 ? "" : "s"}${skipped ? ` | ${skipped} skipped` : ""}) ${ms}ms\n`);
    }
  }
  const bar = "⎯".repeat(7);
  if (failures.length) {
    const suiteFails = failures.filter((f) => f.suiteError);
    const testFails = failures.filter((f) => !f.suiteError);
    if (suiteFails.length) {
      machine.writeStd("stdout", `\n${bar} Failed Suites ${suiteFails.length} ${bar}\n\n`);
      for (const f of suiteFails) machine.writeStd("stdout", ` FAIL  ${f.title} [ ${f.rel} ]\n${errorText(f.error)}\n\n`);
    }
    if (testFails.length) {
      machine.writeStd("stdout", `\n${bar} Failed Tests ${testFails.length} ${bar}\n\n`);
      testFails.forEach((f, i) => {
        machine.writeStd("stdout", ` FAIL  ${f.title}\n${errorText(f.error)}\n\n${"⎯".repeat(24)}[${i + 1}/${testFails.length}]⎯\n\n`);
      });
    }
  }
  const fileFails = new Set(results.filter((r) => r.state === "fail").map((r) => r.file));
  const fileCount = files.length;
  const failedFiles = new Set([...fileFails, ...failures.filter((f) => f.suiteError).map((f) => f.rel)]).size;
  const passed = results.filter((r) => r.state === "pass").length;
  const failedTests = results.filter((r) => r.state === "fail").length;
  const skippedTests = results.filter((r) => r.state === "skip" || r.state === "todo").length;
  const parts = (failed, pass, skip) => [failed ? `${failed} failed` : "", pass ? `${pass} passed` : "", skip ? `${skip} skipped` : ""].filter(Boolean).join(" | ");
  const start = new Date(started);
  const hhmmss = `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}:${String(start.getUTCSeconds()).padStart(2, "0")}`;
  machine.writeStd(
    "stdout",
    `\n Test Files  ${parts(failedFiles, fileCount - failedFiles, 0)} (${fileCount})\n      Tests  ${parts(failedTests, passed, skippedTests)} (${results.length})\n   Start at  ${hhmmss}\n   Duration  ${((loop.now() - started) / 1000 + 0.4).toFixed(2)}s\n\n`
  );
  machine.testRun = null;
  if (config.globals) for (const n of GLOBAL_NAMES) delete globalThis[n];
  return { results, exitCode: failures.length ? 1 : 0 };
}

function errorText(err) {
  if (!err) return "";
  const name = err.name || "Error";
  let text = `${name}: ${err.message}`;
  if (err instanceof AssertionError && err.showDiff && err.expected !== undefined) {
    const e = inspect(err.expected).split("\n");
    const a = inspect(err.actual).split("\n");
    text += "\n\n- Expected\n+ Received\n\n";
    if (e.length === 1 && a.length === 1) text += `- ${e[0]}\n+ ${a[0]}`;
    else {
      const max = Math.max(a.length, e.length);
      const lines = [];
      for (let i = 0; i < max; i++) {
        if (a[i] === e[i]) lines.push(`  ${a[i]}`);
        else {
          if (e[i] !== undefined) lines.push(`- ${e[i]}`);
          if (a[i] !== undefined) lines.push(`+ ${a[i]}`);
        }
      }
      text += lines.join("\n");
    }
  }
  const frame = String(err.stack || "").split("\n").find((l) => /\/app\/.*\.(test|spec)\./.test(l));
  if (frame) {
    const m = /((?:file:\/\/)?\/app\/[^\s():]+):(\d+):(\d+)/.exec(frame);
    if (m) text += `\n\n ❯ ${m[1].replace(/^file:\/\/\/app\//, "").replace(/^\/app\//, "")}:${m[2]}:${m[3]}`;
  }
  return text;
}

/* ── supertest ─────────────────────────────────────────────────────── */

class TestRequest {
  constructor(target, method, path, agent) {
    this._target = target;
    this._method = method.toUpperCase();
    this._path = path;
    this._headers = {};
    this._body = undefined;
    this._form = null;
    this._query = [];
    this._asserts = [];
    this._agent = agent;
    this._redirects = 0;
  }
  set(name, value) {
    if (name && typeof name === "object") for (const [k, v] of Object.entries(name)) this._headers[k] = String(v);
    else this._headers[name] = String(value);
    return this;
  }
  type(t) {
    const map = { json: "application/json", form: "application/x-www-form-urlencoded", html: "text/html", text: "text/plain", xml: "application/xml" };
    return this.set("Content-Type", map[t] || t);
  }
  accept(t) {
    const map = { json: "application/json", html: "text/html", text: "text/plain" };
    return this.set("Accept", map[t] || t);
  }
  auth(user, pass, opts) {
    if (pass && typeof pass === "object") opts = pass;
    if (opts?.type === "bearer") return this.set("Authorization", `Bearer ${user}`);
    return this.set("Authorization", `Basic ${Buffer.from(`${user}:${pass ?? ""}`).toString("base64")}`);
  }
  bearer(token) {
    return this.set("Authorization", `Bearer ${token}`);
  }
  query(q) {
    if (typeof q === "string") this._query.push(q);
    else this._query.push(new URLSearchParams(Object.entries(q).map(([k, v]) => [k, String(v)])).toString());
    return this;
  }
  send(body) {
    if (body && typeof body === "object" && !(body instanceof Uint8Array)) this._body = { ...(this._body || {}), ...body };
    else this._body = body;
    return this;
  }
  field(name, value) {
    this._form ||= new FormData();
    if (name && typeof name === "object") for (const [k, v] of Object.entries(name)) this._form.append(k, String(v));
    else this._form.append(name, String(value));
    return this;
  }
  attach(field, file, options) {
    this._form ||= new FormData();
    const filename = typeof options === "string" ? options : options?.filename || "file";
    const contentType = typeof options === "object" ? options?.contentType : undefined;
    const data = typeof file === "string" ? ctx.machine.builtin("fs").readFileSync(file) : file;
    this._form.append(field, new Blob([data], contentType ? { type: contentType } : {}), filename);
    return this;
  }
  redirects(n) {
    this._redirects = n;
    return this;
  }
  timeout() {
    return this;
  }
  retry() {
    return this;
  }
  expect(a, b, c) {
    if (typeof a === "function") {
      this._asserts.push((res) => a(res));
      return this;
    }
    if (typeof a === "number") {
      this._asserts.push((res) => {
        if (res.status !== a) throw new Error(`expected ${a} "${STATUS_CODES[a]}", got ${res.status} "${STATUS_CODES[res.status]}"`);
      });
      if (typeof b === "function") this._asserts.push((res) => b(res));
      else if (b !== undefined) this._asserts.push((res) => assertBody(b, res));
      void c;
      return this;
    }
    if (Array.isArray(a)) {
      this._asserts.push((res) => {
        if (!a.includes(res.status)) throw new Error(`expected one of "${a.join(", ")}", got ${res.status} "${STATUS_CODES[res.status]}"`);
      });
      return this;
    }
    if (typeof b === "string" || typeof b === "number" || b instanceof RegExp) {
      const field = String(a);
      this._asserts.push((res) => {
        const actual = res.headers[field.toLowerCase()];
        if (actual === undefined) throw new Error(`expected "${field}" header field`);
        if (b instanceof RegExp) {
          if (!b.test(actual)) throw new Error(`expected "${field}" matching ${b}, got "${actual}"`);
        } else if (String(b) !== String(actual)) throw new Error(`expected "${field}" of "${b}", got "${actual}"`);
      });
      return this;
    }
    this._asserts.push((res) => assertBody(a, res));
    return this;
  }

  async _send() {
    const machine = ctx.machine;
    let port;
    let server = null;
    const target = this._target;
    if (typeof target === "string") {
      const u = new URL(target);
      port = Number(u.port || 80);
    } else if (typeof target === "function") {
      const http = machine.builtin("http");
      server = http.createServer(target);
      server.listen(0);
      port = server._port;
    } else if (target && typeof target.address === "function") {
      if (!target.listening) target.listen(0);
      port = target._port;
    }
    const qs = this._query.length ? (this._path.includes("?") ? "&" : "?") + this._query.join("&") : "";
    const url = `http://127.0.0.1:${port}${this._path}${qs}`;
    const headers = { ...this._headers };
    if (this._agent?.cookies.size) headers.Cookie = [...this._agent.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
    let body;
    if (this._form) body = this._form;
    else if (this._body !== undefined) {
      const ct = Object.entries(headers).find(([k]) => k.toLowerCase() === "content-type")?.[1];
      if (typeof this._body === "string") {
        body = this._body;
        if (!ct) headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else if (this._body instanceof Uint8Array) body = this._body;
      else {
        body = ct && /urlencoded/.test(ct) ? new URLSearchParams(this._body).toString() : JSON.stringify(this._body);
        if (!ct) headers["Content-Type"] = "application/json";
      }
    }
    const res = await machine.fetch(url, { method: this._method, headers, body, redirect: this._redirects ? "follow" : "manual" });
    const text = await res.text();
    const hdrs = {};
    res.headers.forEach((v, k) => {
      hdrs[k] = v;
    });
    const setCookie = res.headers.getSetCookie?.() || [];
    if (setCookie.length) hdrs["set-cookie"] = setCookie;
    if (this._agent) {
      for (const c of setCookie) {
        const [pair] = c.split(";");
        const eq = pair.indexOf("=");
        const k = pair.slice(0, eq).trim();
        const v = pair.slice(eq + 1).trim();
        if (/max-age=0|expires=thu, 01 jan 1970/i.test(c) || v === "") this._agent.cookies.delete(k);
        else this._agent.cookies.set(k, v);
      }
    }
    if (server) server.close();
    const type = (hdrs["content-type"] || "").split(";")[0].trim();
    let parsed = {};
    if (/json/.test(type) && text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = {};
      }
    } else if (/x-www-form-urlencoded/.test(type)) parsed = Object.fromEntries(new URLSearchParams(text));
    const status = res.status;
    const out = {
      status,
      statusCode: status,
      headers: hdrs,
      header: hdrs,
      body: parsed,
      text,
      type,
      charset: /charset=([^;]+)/.exec(hdrs["content-type"] || "")?.[1],
      ok: status >= 200 && status < 300,
      redirect: [301, 302, 303, 307, 308].includes(status),
      clientError: status >= 400 && status < 500,
      serverError: status >= 500,
      notFound: status === 404,
      unauthorized: status === 401,
      forbidden: status === 403,
      badRequest: status === 400,
      noContent: status === 204,
      error: status >= 400 ? Object.assign(new Error(`cannot ${this._method} ${this._path} (${status})`), { status, text, method: this._method, path: this._path }) : false,
    };
    for (const a of this._asserts) a(out);
    return out;
  }
  then(resolve, reject) {
    this._promise ||= this._send();
    return this._promise.then(resolve, reject);
  }
  catch(reject) {
    return this.then(undefined, reject);
  }
  finally(f) {
    return this.then(
      (v) => {
        f();
        return v;
      },
      (e) => {
        f();
        throw e;
      }
    );
  }
  end(cb) {
    this.then(
      (res) => cb?.(null, res),
      (err) => cb?.(err)
    );
    return this;
  }
}

function assertBody(body, res) {
  if (typeof body === "object" && !(body instanceof RegExp)) {
    if (!deepEqual(body, res.body, true)) throw new Error(`expected ${inspect(body)} response body, got ${inspect(res.body)}`);
  } else if (body !== res.text) {
    if (body instanceof RegExp) {
      if (!body.test(res.text)) throw new Error(`expected body ${inspect(res.text)} to match ${body}`);
    } else throw new Error(`expected ${inspect(body)} response body, got ${inspect(res.text)}`);
  }
}

const METHODS = ["get", "post", "put", "patch", "delete", "del", "head", "options"];

export function supertest(target) {
  const api = {};
  for (const m of METHODS) api[m] = (path) => new TestRequest(target, m === "del" ? "DELETE" : m, path, null);
  return api;
}
supertest.agent = (target) => {
  const agent = { cookies: new Map() };
  for (const m of METHODS) agent[m] = (path) => new TestRequest(target, m === "del" ? "DELETE" : m, path, agent);
  return agent;
};
supertest.Test = TestRequest;
