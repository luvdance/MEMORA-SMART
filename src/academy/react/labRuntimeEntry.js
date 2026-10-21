/**
 * THE REACT LAB RUNTIME (bundle source)
 *
 * The React course is practised in the same sandboxed preview as the web
 * development course (src/academy/webHarness.js), but a React project is not
 * three linked files: it is a Vite project, `index.html` loading
 * `/src/main.jsx`, which imports components, CSS and libraries. This file is
 * what makes that project run inside the sandbox, with no network and no
 * build server:
 *
 *   · every file under src/ is compiled the way Vite compiles it (JSX in .jsx
 *     and .tsx, TypeScript types stripped from .ts and .tsx, never checked);
 *   · `import` between the lab's files, CSS imports, CSS Modules and JSON work
 *     as in Vite, through a small module loader;
 *   · the libraries the course teaches (React 19 in development mode, React
 *     Router, Zod, Zustand, TanStack Query, Axios and Testing Library) are
 *     bundled in, so `import { useState } from "react"` just works;
 *   · test files (*.test.jsx) run with a Vitest-style describe/it/expect, and
 *     their results are what a lab's checks read.
 *
 * It is NOT imported by the app. `node scripts/reactLabRuntime.mjs` bundles it
 * with esbuild into public/lab/react-runtime.js, which the preview loads by
 * URL so the browser caches it once for every lab.
 */

import * as React from "react";
import * as JsxRuntime from "react/jsx-runtime";
import * as JsxDevRuntime from "react/jsx-dev-runtime";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as ReactRouter from "react-router";
import * as Zod from "zod";
import * as Zustand from "zustand";
import * as ZustandMiddleware from "zustand/middleware";
import * as ReactQuery from "@tanstack/react-query";
import axios from "axios";
import * as TestingLibrary from "@testing-library/react";
import userEventModule from "@testing-library/user-event";
import { transform } from "sucrase";

/* ── Routing in a sandbox ────────────────────────────────────────────────
 * A sandboxed srcdoc page has no real URL, so the browser's history cannot be
 * pushed. The browser routers are therefore backed by memory routers here:
 * the code a learner writes (BrowserRouter, createBrowserRouter, Link,
 * useNavigate, useParams…) is exactly what they write in a real project, and
 * the current path is reported to the preview's address bar and to checks. */
const startPath = () => (window.__labConfig && window.__labConfig.path) || "/";
function report(location) {
  const path = location.pathname + (location.search || "") + (location.hash || "");
  window.__labPath = path;
  if (window.__labSend) window.__labSend({ type: "location", path });
}
// Reported once the new screen is COMMITTED, not while it renders: React
// Router navigates inside a transition, whose render can finish well before
// the DOM changes, and a check that saw the new path must also see the page.
function LocationSpy() {
  const location = ReactRouter.useLocation();
  React.useLayoutEffect(() => report(location), [location]);
  return null;
}
function LabBrowserRouter({ children, ...rest }) {
  return React.createElement(
    ReactRouter.MemoryRouter,
    { initialEntries: [startPath()], ...rest },
    React.createElement(LocationSpy),
    children
  );
}
function labCreateRouter(routes, opts = {}) {
  const router = ReactRouter.createMemoryRouter(routes, { ...opts, initialEntries: [startPath()] });
  report(router.state.location);
  router.subscribe((state) => report(state.location));
  window.__labRouter = router;
  return router;
}
const Router = {
  ...ReactRouter,
  BrowserRouter: LabBrowserRouter,
  HashRouter: LabBrowserRouter,
  createBrowserRouter: labCreateRouter,
  createHashRouter: labCreateRouter,
};

// Axios normally uses XMLHttpRequest. The practice page answers requests
// through fetch (from the lab's declared mocks), so axios uses fetch here.
axios.defaults.adapter = "fetch";

const userEvent = userEventModule.default || userEventModule;

/* ── A Vitest-style test runner ──────────────────────────────────────────
 * The same names as Vitest (describe, it, test, expect, vi, beforeEach…), so
 * the tests a learner writes here run unchanged in a real project. */
const suites = [];
let currentPath = [];
let hooks = { beforeEach: [], afterEach: [] };
function addTest(name, fn) {
  suites.push({ name: [...currentPath, name].join(" › "), fn, hooks: { beforeEach: [...hooks.beforeEach], afterEach: [...hooks.afterEach] } });
}
function describe(name, fn) {
  const saved = hooks;
  hooks = { beforeEach: [...hooks.beforeEach], afterEach: [...hooks.afterEach] };
  currentPath.push(name);
  try {
    fn();
  } finally {
    currentPath.pop();
    hooks = saved;
  }
}
const test = (name, fn) => addTest(name, fn);
test.skip = () => {};
test.todo = () => {};
const it = test;
const beforeEach = (fn) => hooks.beforeEach.push(fn);
const afterEach = (fn) => hooks.afterEach.push(fn);

const fmt = (v) => {
  try {
    if (v instanceof Element) return `<${v.tagName.toLowerCase()}>`;
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "function") return v.name ? `[Function ${v.name}]` : "[Function]";
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
};
function deepEqual(a, b, strict) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  const ka = Object.keys(a).filter((k) => strict || a[k] !== undefined);
  const kb = Object.keys(b).filter((k) => strict || b[k] !== undefined);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k], strict));
}
const textOf = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
const isMock = (fn) => typeof fn === "function" && Array.isArray(fn.mock?.calls);

function expect(actual) {
  const make = (negate) => {
    const assert = (pass, message) => {
      if (pass === negate) throw new Error(negate ? `expected not: ${message}` : message);
    };
    const m = {
      toBe: (e) => assert(Object.is(actual, e), `expected ${fmt(actual)} to be ${fmt(e)}`),
      toEqual: (e) => assert(deepEqual(actual, e, false), `expected ${fmt(actual)} to equal ${fmt(e)}`),
      toStrictEqual: (e) => assert(deepEqual(actual, e, true), `expected ${fmt(actual)} to strictly equal ${fmt(e)}`),
      toBeTruthy: () => assert(Boolean(actual), `expected ${fmt(actual)} to be truthy`),
      toBeFalsy: () => assert(!actual, `expected ${fmt(actual)} to be falsy`),
      toBeNull: () => assert(actual === null, `expected ${fmt(actual)} to be null`),
      toBeUndefined: () => assert(actual === undefined, `expected ${fmt(actual)} to be undefined`),
      toBeDefined: () => assert(actual !== undefined, `expected a value, got undefined`),
      toBeGreaterThan: (n) => assert(actual > n, `expected ${fmt(actual)} to be greater than ${n}`),
      toBeGreaterThanOrEqual: (n) => assert(actual >= n, `expected ${fmt(actual)} to be at least ${n}`),
      toBeLessThan: (n) => assert(actual < n, `expected ${fmt(actual)} to be less than ${n}`),
      toBeLessThanOrEqual: (n) => assert(actual <= n, `expected ${fmt(actual)} to be at most ${n}`),
      toBeCloseTo: (n, digits = 2) => assert(Math.abs(actual - n) < 10 ** -digits / 2, `expected ${fmt(actual)} to be close to ${n}`),
      toContain: (x) => assert(actual != null && actual.includes(x), `expected ${fmt(actual)} to contain ${fmt(x)}`),
      toHaveLength: (n) => assert(actual != null && actual.length === n, `expected length ${n}, got ${actual?.length}`),
      toMatch: (re) => assert(typeof re === "string" ? String(actual).includes(re) : re.test(String(actual)), `expected ${fmt(actual)} to match ${re}`),
      toHaveProperty: (k, v) => assert(actual != null && k in Object(actual) && (v === undefined || deepEqual(actual[k], v)), `expected property ${k}`),
      toBeInstanceOf: (C) => assert(actual instanceof C, `expected an instance of ${C.name}`),
      toThrow: (match) => {
        let threw = false;
        let err;
        try {
          actual();
        } catch (e) {
          threw = true;
          err = e;
        }
        const ok = threw && (match === undefined || (typeof match === "string" ? String(err?.message).includes(match) : match instanceof RegExp ? match.test(String(err?.message)) : err instanceof match));
        assert(ok, threw ? `the error ${fmt(err?.message)} did not match ${match}` : "expected the function to throw");
      },
      // Mock functions (vi.fn)
      toHaveBeenCalled: () => assert(isMock(actual) && actual.mock.calls.length > 0, "expected the mock to have been called"),
      toHaveBeenCalledTimes: (n) => assert(isMock(actual) && actual.mock.calls.length === n, `expected ${n} call(s), got ${actual?.mock?.calls.length}`),
      toHaveBeenCalledWith: (...args) => assert(isMock(actual) && actual.mock.calls.some((c) => deepEqual(c, args, false)), `expected a call with ${fmt(args)}; calls were ${fmt(actual?.mock?.calls)}`),
      // The DOM matchers of @testing-library/jest-dom
      toBeInTheDocument: () => assert(actual instanceof Node && document.body.contains(actual), "expected the element to be in the document"),
      toHaveTextContent: (t) => assert(actual instanceof Node && (t instanceof RegExp ? t.test(textOf(actual)) : textOf(actual).includes(t)), `expected text ${fmt(t)}, got ${fmt(textOf(actual))}`),
      toBeDisabled: () => assert(Boolean(actual?.disabled) || actual?.getAttribute?.("aria-disabled") === "true", "expected the element to be disabled"),
      toBeEnabled: () => assert(!actual?.disabled, "expected the element to be enabled"),
      toHaveValue: (v) => assert(actual?.type === "number" ? Number(actual.value) === v : actual?.value === v, `expected value ${fmt(v)}, got ${fmt(actual?.value)}`),
      toBeChecked: () => assert(Boolean(actual?.checked), "expected the element to be checked"),
      toHaveAttribute: (name, v) => assert(actual?.hasAttribute?.(name) && (v === undefined || actual.getAttribute(name) === v), `expected attribute ${name}${v === undefined ? "" : `="${v}"`}`),
      toHaveClass: (c) => assert(actual?.classList?.contains(c), `expected class ${c}`),
      toBeVisible: () => assert(actual instanceof Element && actual.isConnected && getComputedStyle(actual).display !== "none" && !actual.closest("[hidden]"), "expected the element to be visible"),
      toHaveFocus: () => assert(document.activeElement === actual, "expected the element to have focus"),
      toHaveAccessibleName: (n) => assert(TestingLibrary.screen && actual && (actual.getAttribute("aria-label") || textOf(actual)) === n, `expected accessible name ${fmt(n)}`),
    };
    return m;
  };
  const api = make(false);
  api.not = make(true);
  const settle = (rejects) => {
    const wrap = {};
    for (const key of Object.keys(api)) {
      if (key === "not") continue;
      wrap[key] = async (...args) => {
        let value;
        try {
          value = await actual;
          if (rejects) throw new Error("expected the promise to reject, but it resolved");
        } catch (e) {
          if (!rejects) throw e;
          value = e;
        }
        return expect(value)[key](...args);
      };
    }
    return wrap;
  };
  api.resolves = settle(false);
  api.rejects = settle(true);
  return api;
}

function fn(impl) {
  let implementation = impl;
  const once = [];
  const mock = function (...args) {
    mock.mock.calls.push(args);
    const run = once.length ? once.shift() : implementation;
    const result = run ? run.apply(this, args) : undefined;
    mock.mock.results.push({ type: "return", value: result });
    return result;
  };
  mock.mock = { calls: [], results: [] };
  mock.mockImplementation = (f) => ((implementation = f), mock);
  mock.mockImplementationOnce = (f) => (once.push(f), mock);
  mock.mockReturnValue = (v) => mock.mockImplementation(() => v);
  mock.mockReturnValueOnce = (v) => mock.mockImplementationOnce(() => v);
  mock.mockResolvedValue = (v) => mock.mockImplementation(() => Promise.resolve(v));
  mock.mockResolvedValueOnce = (v) => mock.mockImplementationOnce(() => Promise.resolve(v));
  mock.mockRejectedValue = (e) => mock.mockImplementation(() => Promise.reject(e));
  mock.mockRejectedValueOnce = (e) => mock.mockImplementationOnce(() => Promise.reject(e));
  mock.mockClear = () => ((mock.mock.calls = []), (mock.mock.results = []), mock);
  mock.mockReset = () => (mock.mockClear(), (implementation = undefined), mock);
  return mock;
}
const spies = [];
const vi = {
  fn,
  spyOn(obj, key) {
    const original = obj[key];
    const spy = fn((...args) => original.apply(obj, args));
    spy.mockRestore = () => {
      obj[key] = original;
    };
    obj[key] = spy;
    spies.push(spy);
    return spy;
  },
  restoreAllMocks() {
    while (spies.length) spies.pop().mockRestore();
  },
  stubGlobal(name, value) {
    const original = globalThis[name];
    globalThis[name] = value;
    spies.push({ mockRestore: () => (globalThis[name] = original) });
  },
};
const VITEST = { describe, it, test, expect, vi, beforeEach, afterEach };

async function runTests(files) {
  const results = [];
  window.IS_REACT_ACT_ENVIRONMENT = true;
  for (const file of files) {
    suites.length = 0;
    try {
      requireFile(file);
    } catch (err) {
      results.push({ file, name: "(the test file itself)", passed: false, error: `${err.name}: ${err.message}` });
      continue;
    }
    for (const t of [...suites]) {
      let error = "";
      try {
        for (const h of t.hooks.beforeEach) await h();
        await Promise.race([
          t.fn(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("the test timed out after 3 seconds")), 3000)),
        ]);
      } catch (err) {
        error = `${err && err.name ? err.name : "Error"}: ${err && err.message ? err.message : err}`;
      }
      try {
        for (const h of t.hooks.afterEach) await h();
      } catch (err) {
        error = error || `afterEach: ${err.message}`;
      }
      TestingLibrary.cleanup();
      vi.restoreAllMocks();
      results.push({ file, name: t.name, passed: !error, error });
    }
  }
  window.IS_REACT_ACT_ENVIRONMENT = false;
  const passed = results.filter((r) => r.passed).length;
  for (const r of results) {
    console.log(`${r.passed ? "✓" : "✗"} ${r.name}${r.error ? `\n    ${r.error}` : ""}`);
  }
  console.log(`Tests: ${passed} passed, ${results.length - passed} failed, ${results.length} total`);
  return { results, passed, failed: results.length - passed, total: results.length };
}

/* ── createRoot, with a deterministic first render ───────────────────────
 * root.render() normally schedules the first render for a moment later. The
 * checks start once the page has loaded, and on a busy machine that moment
 * could come after them, so the FIRST render of each root is flushed at
 * once. Nothing a learner can observe changes: later renders, effects and
 * updates are scheduled exactly as in any React app. */
function createRoot(container, options) {
  const root = ReactDOMClient.createRoot(container, options);
  const render = root.render.bind(root);
  let first = true;
  root.render = (children) => {
    if (!first) return render(children);
    first = false;
    ReactDOM.flushSync(() => render(children));
  };
  return root;
}

/* ── The libraries a lab may import ──────────────────────────────────── */
const LIBS = {
  react: React,
  "react/jsx-runtime": JsxRuntime,
  "react/jsx-dev-runtime": JsxDevRuntime,
  "react-dom": ReactDOM,
  "react-dom/client": { ...ReactDOMClient, createRoot },
  "react-router": Router,
  "react-router-dom": Router,
  zod: Zod,
  zustand: Zustand,
  "zustand/middleware": ZustandMiddleware,
  "@tanstack/react-query": ReactQuery,
  axios: { default: axios, ...axios, __esModule: true },
  "@testing-library/user-event": { default: userEvent, userEvent, __esModule: true },
  vitest: VITEST,
};
// Testing Library binds `screen` to document.body when it is first imported,
// which here is in <head>, before the body exists. So it is bound on the
// first import from a test file instead, when the body is there.
let testingLibrary = null;
Object.defineProperty(LIBS, "@testing-library/react", {
  enumerable: true,
  get() {
    if (!testingLibrary) {
      const screen = { ...TestingLibrary.screen, ...TestingLibrary.within(document.body) };
      testingLibrary = { ...TestingLibrary, screen };
    }
    return testingLibrary;
  },
});

/* ── The module loader ───────────────────────────────────────────────── */
let FILES = {};
let ASSETS = {};
const cache = new Map();
const EXT = ["", ".jsx", ".tsx", ".js", ".ts", ".json", "/index.jsx", "/index.tsx", "/index.js", "/index.ts"];

function normalise(path) {
  const out = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}
function resolve(spec, from) {
  if (spec.startsWith("/")) spec = spec.slice(1);
  else if (spec.startsWith(".")) {
    const dir = from.split("/").slice(0, -1).join("/");
    spec = normalise(`${dir}/${spec}`);
  } else return null;
  for (const ext of EXT) if (FILES[spec + ext] !== undefined) return spec + ext;
  if (ASSETS[spec]) return spec;
  return undefined;
}

let hashSeed = 0;
function scopeCss(css, file) {
  const base = file.split("/").pop().replace(/\.module\.css$/, "");
  const id = (hashSeed++).toString(36);
  const map = {};
  // A selector follows the start of the file, the end of a rule, or the
  // opening brace of an at-rule such as @media, whose rules are scoped too.
  const scoped = css.replace(/(^|[{}])([^{}@]+)\{/g, (m, close, selector) => {
    // :global(…) is left exactly as written, as in Vite's CSS Modules.
    const replaced = selector.replace(/:global\(([^)]*)\)|\.(-?[_a-zA-Z][\w-]*)/g, (x, global, name) => {
      if (global !== undefined) return global;
      map[name] = map[name] || `${base}_${name}__${id}`;
      return `.${map[name]}`;
    });
    return `${close}${replaced}{`;
  });
  return { scoped, map };
}
function addStyle(css, file) {
  const style = document.createElement("style");
  style.setAttribute("data-file", file);
  style.textContent = css;
  document.head.appendChild(style);
}

function compile(code, file) {
  const ts = /\.tsx?$/.test(file);
  const jsx = /\.(jsx|tsx)$/.test(file);
  const transforms = ["imports"];
  if (ts) transforms.unshift("typescript");
  if (jsx) transforms.unshift("jsx");
  return transform(code, {
    transforms,
    filePath: file,
    jsxRuntime: "automatic",
    production: false,
    // Hooks and component names stay readable in errors and DevTools.
    preserveDynamicImport: false,
    disableESTransforms: true,
  }).code;
}

function requireFile(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const source = FILES[file];
  if (file.endsWith(".css")) {
    if (file.endsWith(".module.css")) {
      const { scoped, map } = scopeCss(source, file);
      addStyle(scoped, file);
      module.exports = { __esModule: true, default: map, ...map };
    } else addStyle(source, file);
    return module.exports;
  }
  if (file.endsWith(".json")) {
    module.exports = JSON.parse(source);
    return module.exports;
  }
  if (ASSETS[file]) {
    module.exports = { __esModule: true, default: ASSETS[file] };
    return module.exports;
  }
  let compiled;
  try {
    compiled = compile(source, file);
  } catch (err) {
    cache.delete(file);
    const e = new SyntaxError(`${file}: ${String(err.message).replace(/\s*\(\d+:\d+\)$/, "")}${err.loc ? ` (line ${err.loc.line})` : ""}`);
    throw e;
  }
  const localRequire = (spec) => {
    if (Object.prototype.hasOwnProperty.call(LIBS, spec)) return LIBS[spec];
    const target = resolve(spec, file);
    if (target === null) {
      throw new Error(
        `${file}: cannot import "${spec}". The practice page includes: ${Object.keys(LIBS).filter((k) => !k.includes("jsx-")).join(", ")}.`
      );
    }
    if (target === undefined) throw new Error(`${file}: there is no file "${spec}" next to it. Check the path and the file name.`);
    return requireFile(target);
  };
  // `import.meta.env` is Vite's; the lab's .env values are passed in.
  const meta = { env: { MODE: "development", DEV: true, PROD: false, ...((window.__labConfig && window.__labConfig.env) || {}) } };
  const body = compiled.replace(/\bimport\.meta\b/g, "__importMeta");
  const run = new Function("require", "module", "exports", "__importMeta", `${body}\n//# sourceURL=${file}`);
  run(localRequire, module, module.exports, meta);
  return module.exports;
}

/* ── A Vite-style error overlay ──────────────────────────────────────── */
function overlay(message) {
  let box = document.getElementById("__lab-overlay");
  if (!box) {
    box = document.createElement("div");
    box.id = "__lab-overlay";
    box.setAttribute("data-lab-overlay", "");
    Object.assign(box.style, {
      position: "fixed", inset: "0", background: "rgba(24,8,8,0.92)", color: "#fecaca",
      font: "14px/1.5 ui-monospace, Consolas, monospace", padding: "20px", whiteSpace: "pre-wrap",
      overflow: "auto", zIndex: "2147483647",
    });
    document.body.appendChild(box);
  }
  box.textContent += (box.textContent ? "\n\n" : "") + message;
}

function boot(config) {
  FILES = config.files || {};
  ASSETS = config.assets || {};
  window.__labConfig = config;
  window.__labPath = config.path || "/";
  window.addEventListener("error", (event) => {
    const err = event.error;
    overlay(err ? `${err.name}: ${err.message}` : String(event.message));
  });
  const start = () => {
    try {
      for (const entry of config.entries || []) requireFile(entry);
    } catch (err) {
      console.error(`${err.name}: ${err.message}`);
      window.__labErrors && window.__labErrors.push(`${err.name}: ${err.message}`);
      overlay(`${err.name}: ${err.message}`);
    }
    const tests = Object.keys(FILES).filter((f) => /\.(test|spec)\.(jsx?|tsx?)$/.test(f));
    window.__labTests = tests.length ? runTests(tests) : Promise.resolve(null);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
}

window.__labReact = { boot, libs: Object.keys(LIBS) };
