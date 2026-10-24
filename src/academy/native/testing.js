/**
 * JEST AND REACT NATIVE TESTING LIBRARY ON THE PRACTICE PHONE
 *
 * Expo's recommended test setup is Jest (the jest-expo preset) with React
 * Native Testing Library. Test files in a lab (*.test.tsx, __tests__/…) run
 * here with the same API, so a learner's tests run unchanged in a real
 * project:
 *
 *   · describe / it / test / expect / beforeEach / jest.fn / jest.mock …;
 *   · render, screen, within, fireEvent, userEvent, waitFor, renderHook and
 *     the queries (getByText, getByRole, getByLabelText, getByPlaceholderText,
 *     getByDisplayValue, getByTestId, and their query/find/All forms);
 *   · the built-in matchers (toBeOnTheScreen, toHaveTextContent, toBeDisabled,
 *     toHaveDisplayValue, toHaveStyle, toBeChecked …);
 *   · renderRouter from expo-router/testing-library, with toHavePathname.
 *
 * Components render with react-native-web, so queries look at what a screen
 * reader would: hidden screens and aria-hidden content are left out, as RNTL
 * leaves out elements hidden from accessibility. fireEvent follows RNTL's
 * rule: it calls the nearest enabled handler prop up the component tree.
 */

import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { StyleSheet } from "react-native-web";

/* ── Visibility, as accessibility tools see it ───────────────────────── */
export function isHidden(el, stopAt = document.body) {
  for (let n = el; n && n !== stopAt.parentElement; n = n.parentElement) {
    if (n.nodeType !== 1) continue;
    if (n.getAttribute("aria-hidden") === "true") return true;
    const cs = getComputedStyle(n);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return true;
    if (n === stopAt) break;
  }
  return false;
}
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const isTextEl = (el) => el.getAttribute && el.getAttribute("dir") === "auto" && !/^(INPUT|TEXTAREA)$/.test(el.tagName);
const ROLE_ALIASES = { header: ["heading", "header"], heading: ["heading", "header"], image: ["img", "image"], img: ["img", "image"], text: ["text"], adjustable: ["slider", "adjustable"] };

export function nameOf(el) {
  if (!el) return "";
  const label = el.getAttribute("aria-label");
  if (label) return norm(label);
  const by = el.getAttribute("aria-labelledby");
  if (by) return by.split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
  return norm(el.textContent);
}

function matches(text, matcher, { exact = true, normalizer } = {}) {
  const value = normalizer ? normalizer(String(text ?? "")) : norm(text);
  if (matcher instanceof RegExp) return matcher.test(value);
  if (typeof matcher === "function") return Boolean(matcher(value));
  const want = normalizer ? String(matcher) : norm(matcher);
  return exact ? value === want : value.toLowerCase().includes(want.toLowerCase());
}

/** All elements under root, in document order, that a query may return. */
function candidates(root, opts = {}) {
  const all = [...root.querySelectorAll("*")];
  return opts.includeHiddenElements ? all : all.filter((el) => !isHidden(el, root));
}

function textMatches(root, matcher, opts) {
  const hits = candidates(root, opts).filter((el) => isTextEl(el) && matches(el.textContent, matcher, opts));
  // The outermost Text whose whole content matches, as RNTL returns.
  return hits.filter((el) => !hits.some((other) => other !== el && other.contains(el) && norm(other.textContent) === norm(el.textContent)));
}

const QUERIES = {
  Text: { find: textMatches, describe: (m) => `text: ${m}` },
  Role: {
    find(root, role, opts = {}) {
      const roles = ROLE_ALIASES[role] || [role];
      return candidates(root, opts).filter((el) => {
        if (!roles.includes(el.getAttribute("role"))) return false;
        if (opts.name !== undefined && !matches(nameOf(el), opts.name, { exact: opts.exact ?? true })) return false;
        if (opts.disabled !== undefined && (el.getAttribute("aria-disabled") === "true" || el.disabled === true) !== opts.disabled) return false;
        if (opts.checked !== undefined && (el.getAttribute("aria-checked") === "true" || el.checked === true) !== opts.checked) return false;
        if (opts.selected !== undefined && (el.getAttribute("aria-selected") === "true") !== opts.selected) return false;
        if (opts.expanded !== undefined && (el.getAttribute("aria-expanded") === "true") !== opts.expanded) return false;
        return true;
      });
    },
    describe: (role, opts = {}) => `role: ${role}${opts.name !== undefined ? `, name: ${opts.name}` : ""}`,
  },
  LabelText: {
    find: (root, m, opts) => candidates(root, opts).filter((el) => (el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")) && matches(nameOf(el), m, opts)),
    describe: (m) => `accessibility label: ${m}`,
  },
  PlaceholderText: {
    find: (root, m, opts) => candidates(root, opts).filter((el) => el.hasAttribute("placeholder") && matches(el.getAttribute("placeholder"), m, opts)),
    describe: (m) => `placeholder: ${m}`,
  },
  DisplayValue: {
    find: (root, m, opts) => candidates(root, opts).filter((el) => /^(INPUT|TEXTAREA)$/.test(el.tagName) && matches(el.value, m, opts)),
    describe: (m) => `display value: ${m}`,
  },
  TestId: {
    find: (root, m, opts) => candidates(root, { includeHiddenElements: true, ...opts }).filter((el) => el.hasAttribute("data-testid") && matches(el.getAttribute("data-testid"), m, { exact: true, ...opts })),
    describe: (m) => `testID: ${m}`,
  },
  HintText: {
    find: (root, m, opts) => candidates(root, opts).filter((el) => el.hasAttribute("aria-description") && matches(el.getAttribute("aria-description"), m, opts)),
    describe: (m) => `accessibility hint: ${m}`,
  },
};

async function waitForImpl(fn, { timeout = 1000, interval = 50 } = {}) {
  const end = Date.now() + timeout;
  let last;
  for (;;) {
    try {
      let value;
      await act(async () => {
        value = await fn();
      });
      return value;
    } catch (err) {
      last = err;
    }
    if (Date.now() > end) throw last;
    await act(async () => {
      await new Promise((r) => setTimeout(r, interval));
    });
  }
}

export function bindQueries(rootFn) {
  const out = {};
  for (const [name, q] of Object.entries(QUERIES)) {
    const all = (m, opts) => q.find(rootFn(), m, opts);
    out[`queryAllBy${name}`] = (m, opts) => all(m, opts);
    out[`getAllBy${name}`] = (m, opts) => {
      const r = all(m, opts);
      if (!r.length) throw new Error(`Unable to find an element with ${q.describe(m, opts)}`);
      return r;
    };
    out[`queryBy${name}`] = (m, opts) => {
      const r = all(m, opts);
      if (r.length > 1) throw new Error(`Found multiple elements with ${q.describe(m, opts)}`);
      return r[0] ?? null;
    };
    out[`getBy${name}`] = (m, opts) => {
      const r = all(m, opts);
      if (!r.length) throw new Error(`Unable to find an element with ${q.describe(m, opts)}`);
      if (r.length > 1) throw new Error(`Found multiple elements with ${q.describe(m, opts)}`);
      return r[0];
    };
    out[`findAllBy${name}`] = (m, opts, w) => waitForImpl(() => out[`getAllBy${name}`](m, opts), w);
    out[`findBy${name}`] = (m, opts, w) => waitForImpl(() => out[`getBy${name}`](m, opts), w);
  }
  return out;
}

/* ── Rendering ───────────────────────────────────────────────────────── */
const mounted = new Set();
let testRoot = null;
function hostForTests() {
  if (!testRoot || !testRoot.isConnected) {
    testRoot = document.createElement("div");
    testRoot.id = "__tests";
    testRoot.setAttribute("data-testing-library", "");
    Object.assign(testRoot.style, { position: "fixed", left: "-200vw", top: "0", width: `${window.innerWidth}px`, height: `${window.innerHeight}px`, display: "flex", opacity: "1", zIndex: "-1", pointerEvents: "none", overflow: "hidden" });
    document.body.appendChild(testRoot);
  }
  return testRoot;
}
let current = null;

/** RNTL 14: render, rerender and unmount are async (React 19's rendering model). */
export async function render(ui, { wrapper: Wrapper } = {}) {
  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex:1;flex-direction:column;";
  hostForTests().appendChild(container);
  const root = createRoot(container);
  const wrap = (node) => (Wrapper ? React.createElement(Wrapper, null, node) : node);
  await asyncAct(() => root.render(wrap(ui)));
  const entry = { root, container };
  mounted.add(entry);
  current = entry;
  return {
    ...bindQueries(() => container),
    get root() {
      return container.firstElementChild;
    },
    container,
    rerender: (next) => asyncAct(() => root.render(wrap(next))),
    unmount: async () => {
      await asyncAct(() => root.unmount());
      container.remove();
      mounted.delete(entry);
    },
    debug: () => console.log(container.innerText),
    toJSON: () => container.innerText,
  };
}

/** act, always async as in RNTL 14. */
export async function asyncAct(fn) {
  let value;
  await act(async () => {
    value = await fn();
  });
  return value;
}

export function cleanup() {
  for (const entry of mounted) {
    try {
      act(() => entry.root.unmount());
    } catch {
      /* already unmounted */
    }
    entry.container.remove();
  }
  mounted.clear();
  current = null;
}

export const screen = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === "getPathname") return () => routerInfo().pathname;
      if (prop === "getSegments") return () => routerInfo().segments;
      if (prop === "getSearchParams") return () => routerInfo().params;
      if (prop === "getPathnameWithParams") return () => routerInfo().pathnameWithParams;
      if (prop === "debug") return () => console.log((current?.container || document.body).innerText);
      const q = bindQueries(() => {
        if (!current) throw new Error("`render` method has not been called");
        return current.container;
      });
      return q[prop];
    },
  }
);

export const within = (el) => bindQueries(() => el);

/* ── Events: RNTL's rule, nearest enabled handler up the component tree ── */
/**
 * The element's CURRENT React fiber. The DOM node keeps a pointer to the fiber
 * it was created with, which may be the alternate (previous) copy whose props,
 * and so whose handlers' closures, are a render out of date.
 */
export const fiberOf = (el) => {
  const key = el && Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
  const f = key ? el[key] : null;
  if (!f) return null;
  let top = f;
  while (top.return) top = top.return;
  return top.stateNode && top.stateNode.current === top ? f : f.alternate || f;
};
function isDisabledProps(props) {
  return Boolean(props && (props.disabled === true || props.accessibilityState?.disabled === true || props["aria-disabled"] === true || props.editable === false));
}
function findHandler(el, name) {
  const prop = name.startsWith("on") ? name : `on${name[0].toUpperCase()}${name.slice(1)}`;
  for (let f = fiberOf(el); f; f = f.return) {
    const props = f.memoizedProps;
    if (props && typeof props[prop] === "function") {
      if (isDisabledProps(props) && /^on(Press|PressIn|PressOut|LongPress|ChangeText|SubmitEditing)$/.test(prop)) return null;
      return props[prop];
    }
    if (props && isDisabledProps(props) && /^on(Press|LongPress)$/.test(prop) && f.tag !== 5) return null;
    if (props && props.pointerEvents === "none") return null;
  }
  return null;
}
const pressEvent = () => ({ nativeEvent: { pageX: 0, pageY: 0, locationX: 0, locationY: 0, timestamp: Date.now(), changedTouches: [], touches: [] }, persist() {}, preventDefault() {}, stopPropagation() {}, currentTarget: {}, target: {} });

/** RNTL 14: fireEvent and its helpers are async. */
export async function fireEvent(el, name, ...data) {
  if (!el) throw new Error("fireEvent needs an element");
  const handler = findHandler(el, name);
  if (!handler) return undefined;
  return asyncAct(() => handler(...data));
}
fireEvent.press = (el, ...data) => fireEvent(el, "press", ...(data.length ? data : [pressEvent()]));
fireEvent.longPress = (el, ...data) => fireEvent(el, "longPress", ...(data.length ? data : [pressEvent()]));
fireEvent.changeText = (el, text) => fireEvent(el, "changeText", text);
fireEvent.scroll = (el, data) => fireEvent(el, "scroll", data);
fireEvent.focus = (el) => fireEvent(el, "focus", { nativeEvent: {} });
fireEvent.blur = (el) => fireEvent(el, "blur", { nativeEvent: {} });
fireEvent.submitEditing = (el, text) => fireEvent(el, "submitEditing", { nativeEvent: { text: text ?? el.value } });

function makeUser() {
  return userEvent.setup();
}
export const userEvent = {
  press: (el) => makeUser().press(el),
  longPress: (el) => makeUser().longPress(el),
  type: (el, text, opts) => makeUser().type(el, text, opts),
  clear: (el) => makeUser().clear(el),
  paste: (el, text) => makeUser().paste(el, text),
  scrollTo: (el, opts) => makeUser().scrollTo(el, opts),
  pullToRefresh: (el) => asyncAct(() => findHandler(el, "refresh")?.()),
  accessibilityAction: (el, actionName) => asyncAct(() => findHandler(el, "accessibilityAction")?.({ nativeEvent: { actionName } })),
  setup() {
    const step = async (fn) => {
      await act(async () => {
        fn();
        await new Promise((r) => setTimeout(r, 0));
      });
    };
    return {
      press: (el) => step(() => {
        findHandler(el, "pressIn")?.(pressEvent());
        findHandler(el, "press")?.(pressEvent());
        findHandler(el, "pressOut")?.(pressEvent());
      }),
      longPress: (el) => step(() => findHandler(el, "longPress")?.(pressEvent())),
      async type(el, text, { submitEditing = false } = {}) {
        if (findHandler(el, "changeText") === null && fiberOf(el) && isDisabledProps(fiberOf(el).memoizedProps)) return;
        let value = el.value || "";
        await step(() => findHandler(el, "focus")?.({ nativeEvent: {} }));
        for (const ch of String(text)) {
          value += ch;
          const v = value;
          await step(() => findHandler(el, "changeText")?.(v));
        }
        if (submitEditing) await step(() => findHandler(el, "submitEditing")?.({ nativeEvent: { text: value } }));
        await step(() => findHandler(el, "blur")?.({ nativeEvent: {} }));
      },
      clear: (el) => step(() => findHandler(el, "changeText")?.("")),
      paste: (el, text) => step(() => findHandler(el, "changeText")?.(String(text))),
      scrollTo: (el, opts = {}) => step(() => findHandler(el, "scroll")?.({ nativeEvent: { contentOffset: { x: opts.x || 0, y: opts.y || 0 }, contentSize: { width: 0, height: 0 }, layoutMeasurement: { width: 0, height: 0 } } })),
    };
  },
};

export const waitFor = (fn, opts) => waitForImpl(fn, opts);
export async function waitForElementToBeRemoved(fn, opts) {
  return waitForImpl(() => {
    const r = typeof fn === "function" ? fn() : fn;
    if (r && (!Array.isArray(r) || r.length) && (r.isConnected ?? true)) throw new Error("Timed out in waitForElementToBeRemoved.");
  }, opts);
}

export async function renderHook(hook, { initialProps, wrapper } = {}) {
  const result = { current: undefined };
  function Probe({ props }) {
    result.current = hook(props);
    return null;
  }
  const r = await render(React.createElement(Probe, { props: initialProps }), { wrapper });
  return { result, rerender: (props) => r.rerender(React.createElement(Probe, { props })), unmount: r.unmount };
}

/* ── expo-router/testing-library ─────────────────────────────────────── */
let routerHooks = null;
export function setRouterHooks(h) {
  routerHooks = h;
}
function routerInfo() {
  if (!routerHooks) return { pathname: "/", segments: [], params: {}, pathnameWithParams: "/" };
  return routerHooks.info();
}
export async function renderRouter(files = {}, { initialUrl = "/", ...opts } = {}) {
  if (!routerHooks) throw new Error("expo-router is not available in this lab");
  const r = await render(routerHooks.root(files, initialUrl), opts);
  await asyncAct(() => new Promise((res) => setTimeout(res, 30)));
  return {
    ...r,
    getPathname: () => routerInfo().pathname,
    getPathnameWithParams: () => routerInfo().pathnameWithParams,
    getSegments: () => routerInfo().segments,
    getSearchParams: () => routerInfo().params,
    getRouterState: () => routerHooks.state(),
  };
}
const settleRoute = () => asyncAct(() => new Promise((res) => setTimeout(res, 30)));
function assertPath(path) {
  if (path !== undefined && routerInfo().pathname !== path) throw new Error(`expected pathname ${JSON.stringify(path)}, got ${JSON.stringify(routerInfo().pathname)}`);
}
export const testRouter = {
  async navigate(path) {
    await asyncAct(() => routerHooks.router.navigate(path));
    await settleRoute();
    assertPath(path.split("?")[0]);
  },
  async push(path) {
    await asyncAct(() => routerHooks.router.push(path));
    await settleRoute();
    assertPath(path.split("?")[0]);
  },
  async replace(path) {
    await asyncAct(() => routerHooks.router.replace(path));
    await settleRoute();
    assertPath(path.split("?")[0]);
  },
  async back(path) {
    await asyncAct(() => routerHooks.router.back());
    await settleRoute();
    assertPath(path);
  },
  canGoBack: () => routerHooks.router.canGoBack(),
  async setParams(params, path) {
    await asyncAct(() => routerHooks.router.setParams(params));
    await settleRoute();
    assertPath(path);
  },
  async dismissAll() {
    await asyncAct(() => routerHooks.router.dismissAll());
    await settleRoute();
  },
};

/* ── Jest ────────────────────────────────────────────────────────────── */
const fmt = (v) => {
  try {
    if (v instanceof Element) return `<${v.tagName.toLowerCase()}${v.getAttribute("data-testid") ? ` testID="${v.getAttribute("data-testid")}"` : ""}>`;
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "function") return v.name ? `[Function ${v.name}]` : "[Function]";
    if (v && v.asymmetric) return v.toString();
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
};
function asym(name, test) {
  return { asymmetric: true, test, toString: () => name };
}
function deepEqual(a, b, strict) {
  if (b && b.asymmetric) return b.test(a);
  if (a && a.asymmetric) return a.test(b);
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  const ka = Object.keys(a).filter((k) => strict || a[k] !== undefined);
  const kb = Object.keys(b).filter((k) => strict || b[k] !== undefined);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k], strict));
}
function subset(actual, expected) {
  if (expected && expected.asymmetric) return expected.test(actual);
  if (typeof expected !== "object" || expected === null) return deepEqual(actual, expected);
  if (typeof actual !== "object" || actual === null) return false;
  if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && expected.every((e, i) => subset(actual[i], e));
  return Object.keys(expected).every((k) => subset(actual[k], expected[k]));
}
const isMock = (fn) => typeof fn === "function" && Array.isArray(fn.mock?.calls);
const textOf = (el) => norm(el?.textContent);
function styleOf(el) {
  for (let f = fiberOf(el); f; f = f.return) {
    if (f.memoizedProps && f.memoizedProps.style !== undefined && f.tag !== 5) return StyleSheet.flatten(f.memoizedProps.style) || {};
  }
  return {};
}
function propOf(el, name) {
  for (let f = fiberOf(el); f; f = f.return) {
    if (f.tag !== 5 && f.memoizedProps && name in f.memoizedProps) return f.memoizedProps[name];
  }
  return el?.getAttribute?.(name) ?? undefined;
}

export function expect(actual) {
  const make = (negate) => {
    const assert = (pass, message) => {
      if (pass === negate) throw new Error(negate ? `expect(received).not: ${message}` : message);
    };
    return {
      toBe: (e) => assert(Object.is(actual, e), `expected ${fmt(actual)} to be ${fmt(e)}`),
      toEqual: (e) => assert(deepEqual(actual, e, false), `expected ${fmt(actual)} to equal ${fmt(e)}`),
      toStrictEqual: (e) => assert(deepEqual(actual, e, true), `expected ${fmt(actual)} to strictly equal ${fmt(e)}`),
      toMatchObject: (e) => assert(subset(actual, e), `expected ${fmt(actual)} to match object ${fmt(e)}`),
      toBeTruthy: () => assert(Boolean(actual), `expected ${fmt(actual)} to be truthy`),
      toBeFalsy: () => assert(!actual, `expected ${fmt(actual)} to be falsy`),
      toBeNull: () => assert(actual === null, `expected ${fmt(actual)} to be null`),
      toBeUndefined: () => assert(actual === undefined, `expected ${fmt(actual)} to be undefined`),
      toBeDefined: () => assert(actual !== undefined, "expected a value, got undefined"),
      toBeNaN: () => assert(Number.isNaN(actual), `expected ${fmt(actual)} to be NaN`),
      toBeGreaterThan: (n) => assert(actual > n, `expected ${fmt(actual)} to be greater than ${n}`),
      toBeGreaterThanOrEqual: (n) => assert(actual >= n, `expected ${fmt(actual)} to be at least ${n}`),
      toBeLessThan: (n) => assert(actual < n, `expected ${fmt(actual)} to be less than ${n}`),
      toBeLessThanOrEqual: (n) => assert(actual <= n, `expected ${fmt(actual)} to be at most ${n}`),
      toBeCloseTo: (n, digits = 2) => assert(Math.abs(actual - n) < 10 ** -digits / 2, `expected ${fmt(actual)} to be close to ${n}`),
      toContain: (x) => assert(actual != null && actual.includes(x), `expected ${fmt(actual)} to contain ${fmt(x)}`),
      toContainEqual: (x) => assert(Array.isArray(actual) && actual.some((a) => deepEqual(a, x)), `expected ${fmt(actual)} to contain an item equal to ${fmt(x)}`),
      toHaveLength: (n) => assert(actual != null && actual.length === n, `expected length ${n}, got ${actual?.length}`),
      toMatch: (re) => assert(typeof re === "string" ? String(actual).includes(re) : re.test(String(actual)), `expected ${fmt(actual)} to match ${re}`),
      toHaveProperty: (k, v) => {
        const path = Array.isArray(k) ? k : String(k).split(".");
        let o = actual;
        for (const p of path) o = o == null ? undefined : o[p];
        assert(o !== undefined && (v === undefined || deepEqual(o, v)), `expected property ${path.join(".")}${v === undefined ? "" : ` = ${fmt(v)}`}`);
      },
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
      toHaveBeenCalled: () => assert(isMock(actual) && actual.mock.calls.length > 0, "expected the mock to have been called"),
      toHaveBeenCalledTimes: (n) => assert(isMock(actual) && actual.mock.calls.length === n, `expected ${n} call(s), got ${actual?.mock?.calls.length}`),
      toHaveBeenCalledWith: (...args) => assert(isMock(actual) && actual.mock.calls.some((c) => deepEqual(c, args, false)), `expected a call with ${fmt(args)}; calls were ${fmt(actual?.mock?.calls)}`),
      toHaveBeenLastCalledWith: (...args) => assert(isMock(actual) && deepEqual(actual.mock.calls[actual.mock.calls.length - 1], args), `expected the last call to be ${fmt(args)}`),
      toHaveBeenNthCalledWith: (n, ...args) => assert(isMock(actual) && deepEqual(actual.mock.calls[n - 1], args), `expected call ${n} to be ${fmt(args)}`),
      toHaveReturnedWith: (v) => assert(isMock(actual) && actual.mock.results.some((r) => deepEqual(r.value, v)), `expected a return value of ${fmt(v)}`),
      // React Native Testing Library's built-in matchers
      toBeOnTheScreen: () => assert(actual instanceof Element && actual.isConnected && !isHidden(actual), "expected the element to be on the screen"),
      toHaveTextContent: (t, opts = {}) => assert(actual instanceof Element && matches(textOf(actual), t, { exact: opts.exact ?? true }), `expected text ${fmt(t)}, got ${fmt(textOf(actual))}`),
      toBeDisabled: () => assert(actual instanceof Element && (actual.getAttribute("aria-disabled") === "true" || actual.disabled === true || Boolean(actual.closest?.("[aria-disabled=true]"))), "expected the element to be disabled"),
      toBeEnabled: () => assert(actual instanceof Element && actual.getAttribute("aria-disabled") !== "true" && actual.disabled !== true && !actual.closest?.("[aria-disabled=true]"), "expected the element to be enabled"),
      toBeVisible: () => assert(actual instanceof Element && actual.isConnected && !isHidden(actual), "expected the element to be visible"),
      toBeEmptyElement: () => assert(actual instanceof Element && actual.children.length === 0 && !actual.textContent, "expected the element to be empty"),
      toHaveDisplayValue: (v) => assert(actual && matches(actual.value, v), `expected display value ${fmt(v)}, got ${fmt(actual?.value)}`),
      toBeChecked: () => assert(actual && (actual.getAttribute?.("aria-checked") === "true" || actual.checked === true), "expected the element to be checked"),
      toBePartiallyChecked: () => assert(actual?.getAttribute?.("aria-checked") === "mixed", "expected the element to be partially checked"),
      toBeSelected: () => assert(actual?.getAttribute?.("aria-selected") === "true", "expected the element to be selected"),
      toBeExpanded: () => assert(actual?.getAttribute?.("aria-expanded") === "true", "expected the element to be expanded"),
      toBeCollapsed: () => assert(actual?.getAttribute?.("aria-expanded") === "false", "expected the element to be collapsed"),
      toBeBusy: () => assert(actual?.getAttribute?.("aria-busy") === "true", "expected the element to be busy"),
      toHaveAccessibleName: (n) => assert(actual instanceof Element && (n === undefined ? Boolean(nameOf(actual)) : matches(nameOf(actual), n)), `expected accessible name ${fmt(n)}, got ${fmt(nameOf(actual))}`),
      toHaveAccessibilityValue: (v) => assert(subset({ now: Number(actual?.getAttribute?.("aria-valuenow")), min: Number(actual?.getAttribute?.("aria-valuemin")), max: Number(actual?.getAttribute?.("aria-valuemax")), text: actual?.getAttribute?.("aria-valuetext") ?? undefined }, v), `expected accessibility value ${fmt(v)}`),
      toHaveStyle: (style) => {
        const got = styleOf(actual);
        const want = StyleSheet.flatten(style) || {};
        assert(Object.keys(want).every((k) => deepEqual(got[k], want[k])), `expected style ${fmt(want)}, got ${fmt(got)}`);
      },
      toHaveProp: (name, value) => {
        const got = propOf(actual, name);
        assert(got !== undefined && (value === undefined || deepEqual(got, value)), `expected prop ${name}${value === undefined ? "" : ` = ${fmt(value)}`}, got ${fmt(got)}`);
      },
      toContainElement: (child) => assert(actual instanceof Element && child instanceof Element && actual.contains(child), "expected the element to contain the other element"),
      // expo-router/testing-library
      toHavePathname: (p) => assert(actual === screen && routerInfo().pathname === p, `expected pathname ${fmt(p)}, got ${fmt(routerInfo().pathname)}`),
      toHavePathnameWithParams: (p) => assert(actual === screen && routerInfo().pathnameWithParams === p, `expected ${fmt(p)}, got ${fmt(routerInfo().pathnameWithParams)}`),
      toHaveSegments: (s) => assert(actual === screen && deepEqual(routerInfo().segments, s), `expected segments ${fmt(s)}, got ${fmt(routerInfo().segments)}`),
      toHaveSearchParams: (p) => assert(actual === screen && deepEqual(routerInfo().params, p), `expected search params ${fmt(p)}, got ${fmt(routerInfo().params)}`),
    };
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
          if (rejects) throw Object.assign(new Error("expected the promise to reject, but it resolved"), { __resolved: true });
        } catch (e) {
          if (!rejects || e.__resolved) throw e;
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
expect.any = (C) => asym(`Any<${C.name}>`, (v) => v != null && (v.constructor === C || v instanceof C || (C === Number && typeof v === "number") || (C === String && typeof v === "string") || (C === Boolean && typeof v === "boolean") || (C === Function && typeof v === "function")));
expect.anything = () => asym("Anything", (v) => v != null);
expect.objectContaining = (o) => asym(`ObjectContaining ${fmt(o)}`, (v) => subset(v, o));
expect.arrayContaining = (a) => asym(`ArrayContaining ${fmt(a)}`, (v) => Array.isArray(v) && a.every((x) => v.some((y) => deepEqual(y, x))));
expect.stringContaining = (s) => asym(`StringContaining ${fmt(s)}`, (v) => typeof v === "string" && v.includes(s));
expect.stringMatching = (re) => asym(`StringMatching ${re}`, (v) => typeof v === "string" && new RegExp(re).test(v));
expect.assertions = () => {};
expect.hasAssertions = () => {};

function fn(impl) {
  let implementation = impl;
  const once = [];
  const mock = function (...args) {
    mock.mock.calls.push(args);
    mock.mock.lastCall = args;
    const run = once.length ? once.shift() : implementation;
    let result;
    try {
      result = run ? run.apply(this, args) : undefined;
    } catch (err) {
      mock.mock.results.push({ type: "throw", value: err });
      throw err;
    }
    mock.mock.results.push({ type: "return", value: result });
    return result;
  };
  mock.mock = { calls: [], results: [], lastCall: undefined };
  mock._isMockFunction = true;
  mock.getMockName = () => "jest.fn()";
  mock.mockName = () => mock;
  mock.mockImplementation = (f) => ((implementation = f), mock);
  mock.mockImplementationOnce = (f) => (once.push(f), mock);
  mock.mockReturnValue = (v) => mock.mockImplementation(() => v);
  mock.mockReturnValueOnce = (v) => mock.mockImplementationOnce(() => v);
  mock.mockResolvedValue = (v) => mock.mockImplementation(() => Promise.resolve(v));
  mock.mockResolvedValueOnce = (v) => mock.mockImplementationOnce(() => Promise.resolve(v));
  mock.mockRejectedValue = (e) => mock.mockImplementation(() => Promise.reject(e));
  mock.mockRejectedValueOnce = (e) => mock.mockImplementationOnce(() => Promise.reject(e));
  mock.mockClear = () => ((mock.mock.calls = []), (mock.mock.results = []), mock);
  mock.mockReset = () => (mock.mockClear(), (implementation = undefined), (once.length = 0), mock);
  mock.mockRestore = () => mock.mockReset();
  allMocks.add(mock);
  return mock;
}
const allMocks = new Set();
const spies = [];

/* Fake timers: setTimeout and setInterval only (React schedules its own work). */
const real = { setTimeout: window.setTimeout.bind(window), clearTimeout: window.clearTimeout.bind(window), setInterval: window.setInterval.bind(window), clearInterval: window.clearInterval.bind(window), now: Date.now };
let fake = null;
function installFakeTimers() {
  fake = { now: real.now(), queue: [], seq: 0 };
  const add = (cb, ms, repeat, args) => {
    const id = ++fake.seq;
    fake.queue.push({ id, at: fake.now + Math.max(0, Number(ms) || 0), cb, ms: Math.max(0, Number(ms) || 0), repeat, args });
    return id;
  };
  window.setTimeout = (cb, ms, ...args) => add(cb, ms, false, args);
  window.setInterval = (cb, ms, ...args) => add(cb, ms, true, args);
  window.clearTimeout = window.clearInterval = (id) => {
    if (fake) fake.queue = fake.queue.filter((t) => t.id !== id);
  };
  Date.now = () => fake.now;
}
function advance(ms) {
  if (!fake) return;
  const until = fake.now + ms;
  for (;;) {
    fake.queue.sort((a, b) => a.at - b.at);
    const t = fake.queue[0];
    if (!t || t.at > until) break;
    fake.now = t.at;
    if (t.repeat) t.at += t.ms || 1;
    else fake.queue.shift();
    act(() => {
      t.cb(...(t.args || []));
    });
  }
  fake.now = until;
}
function uninstallFakeTimers() {
  Object.assign(window, { setTimeout: real.setTimeout, clearTimeout: real.clearTimeout, setInterval: real.setInterval, clearInterval: real.clearInterval });
  Date.now = real.now;
  fake = null;
}

export const moduleMocks = new Map();
export const jest = {
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
  mock(path, factory) {
    moduleMocks.set(path, { factory, from: jest.__currentFile });
    return jest;
  },
  unmock(path) {
    moduleMocks.delete(path);
    return jest;
  },
  doMock(path, factory) {
    return jest.mock(path, factory);
  },
  requireActual: (path) => jest.__requireActual(path),
  clearAllMocks() {
    for (const m of allMocks) m.mockClear();
  },
  resetAllMocks() {
    for (const m of allMocks) m.mockReset();
  },
  restoreAllMocks() {
    while (spies.length) spies.pop().mockRestore();
  },
  useFakeTimers() {
    if (!fake) installFakeTimers();
    return jest;
  },
  useRealTimers() {
    if (fake) uninstallFakeTimers();
    return jest;
  },
  advanceTimersByTime: (ms) => advance(ms),
  runOnlyPendingTimers() {
    if (!fake) return;
    const max = Math.max(fake.now, ...fake.queue.map((t) => t.at));
    advance(max - fake.now);
  },
  runAllTimers() {
    for (let i = 0; i < 100 && fake && fake.queue.length; i++) jest.runOnlyPendingTimers();
  },
  getTimerCount: () => (fake ? fake.queue.length : 0),
  setSystemTime(d) {
    if (fake) fake.now = new Date(d).getTime();
  },
  isMockFunction: (f) => isMock(f),
  __currentFile: "",
  __requireActual: () => {
    throw new Error("jest.requireActual is not available here");
  },
};

/* ── The runner ──────────────────────────────────────────────────────── */
const suites = [];
let path = [];
let hooks = { beforeEach: [], afterEach: [], beforeAll: [], afterAll: [] };
function addTest(name, fnc, opts = {}) {
  suites.push({ name: [...path, name].join(" › "), fn: fnc, hooks: { beforeEach: [...hooks.beforeEach], afterEach: [...hooks.afterEach] }, ...opts });
}
function describe(name, body) {
  const saved = hooks;
  hooks = { beforeEach: [...hooks.beforeEach], afterEach: [...hooks.afterEach], beforeAll: [], afterAll: [] };
  path.push(name);
  try {
    body();
  } finally {
    path.pop();
    hooks = saved;
  }
}
describe.skip = () => {};
describe.only = describe;
describe.each = (table) => (name, body) => table.forEach((row) => describe(interpolate(name, row), () => body(...[].concat(row))));
function interpolate(name, row) {
  const values = [].concat(row);
  let i = 0;
  return String(name).replace(/%[sdipfjo#]/g, (m) => (m === "%#" ? String(i) : fmt(values[i++]).replace(/^"|"$/g, ""))).replace(/\$(\w+)/g, (m, k) => (row && typeof row === "object" && k in row ? String(row[k]) : m));
}
const test = (name, body) => addTest(name, body);
test.skip = () => {};
test.todo = () => {};
test.only = test;
test.each = (table) => (name, body) => table.forEach((row, i) => addTest(interpolate(name, row).replace("%#", String(i)), () => body(...(Array.isArray(row) ? row : [row]))));
const it = test;
const beforeEach = (f) => hooks.beforeEach.push(f);
const afterEach = (f) => hooks.afterEach.push(f);
const beforeAll = (f) => hooks.beforeAll.push(f);
const afterAll = (f) => hooks.afterAll.push(f);
export const GLOBALS = { describe, it, test, expect, jest, beforeEach, afterEach, beforeAll, afterAll };

/** Run the test files with `load` (the module loader); returns Jest-style results. */
export async function runTestFiles(files, load) {
  const results = [];
  const started = Date.now();
  window.IS_REACT_ACT_ENVIRONMENT = true;
  for (const file of files) {
    suites.length = 0;
    hooks = { beforeEach: [], afterEach: [], beforeAll: [], afterAll: [] };
    let top;
    try {
      jest.__currentFile = file;
      load(file);
      top = hooks;
    } catch (err) {
      results.push({ file, name: "Test suite failed to run", passed: false, error: `${err.name}: ${err.message}` });
      continue;
    }
    for (const h of top.beforeAll) await h();
    for (const t of [...suites]) {
      let error = "";
      try {
        for (const h of t.hooks.beforeEach) await h();
        await Promise.race([
          t.fn(),
          new Promise((_, reject) => real.setTimeout(() => reject(new Error("Exceeded timeout of 5000 ms for a test.")), 5000)),
        ]);
      } catch (err) {
        error = `${err && err.name ? err.name : "Error"}: ${err && err.message ? err.message : err}`;
      }
      try {
        for (const h of t.hooks.afterEach) await h();
      } catch (err) {
        error = error || `afterEach: ${err.message}`;
      }
      cleanup();
      jest.restoreAllMocks();
      if (fake) uninstallFakeTimers();
      results.push({ file, name: t.name, passed: !error, error });
    }
    for (const h of top.afterAll) await h();
    moduleMocks.clear();
  }
  window.IS_REACT_ACT_ENVIRONMENT = false;
  const passed = results.filter((r) => r.passed).length;
  const failedFiles = new Set(results.filter((r) => !r.passed).map((r) => r.file));
  for (const file of files) {
    console.log(`${failedFiles.has(file) ? "FAIL" : "PASS"} ${file}`);
    for (const r of results.filter((x) => x.file === file)) console.log(`  ${r.passed ? "✓" : "✕"} ${r.name}${r.error ? `\n      ${r.error}` : ""}`);
  }
  console.log(`Test Suites: ${failedFiles.size ? `${failedFiles.size} failed, ` : ""}${files.length - failedFiles.size} passed, ${files.length} total`);
  console.log(`Tests:       ${results.length - passed ? `${results.length - passed} failed, ` : ""}${passed} passed, ${results.length} total`);
  console.log(`Time:        ${((Date.now() - started) / 1000).toFixed(2)} s`);
  return { results, passed, failed: results.length - passed, total: results.length };
}

const configure = () => {};
const resetToDefaults = () => {};
const getDefaultNormalizer = () => (s) => norm(s);
export const RNTL = {
  render, screen, within, fireEvent, userEvent, waitFor, waitForElementToBeRemoved, act: asyncAct, cleanup, renderHook,
  configure, resetToDefaults, getDefaultNormalizer, isHiddenFromAccessibility: (el) => isHidden(el), isInaccessible: (el) => isHidden(el),
};
export const EXPO_ROUTER_TESTING = { ...RNTL, renderRouter, testRouter };
