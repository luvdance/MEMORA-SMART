/**
 * THE MOBILE LAB RUNTIME (bundle source)
 *
 * The Mobile App Development course is practised on a simulated phone that
 * runs the learner's real Expo project, files and all, inside the sandboxed
 * preview of the web labs (src/academy/webHarness.js):
 *
 *   · routes in src/app/ are run by the REAL Expo Router (SDK 58), with its
 *     native-stack headers, tabs and linking, on react-native-web (which is
 *     how Expo itself runs React Native code on the web);
 *   · every file is compiled as Metro compiles it: TypeScript and JSX, the
 *     "@/" path alias, platform files (Button.ios.tsx / Button.android.tsx),
 *     image assets, and EXPO_PUBLIC_ variables from .env inlined;
 *   · `react-native` and the Expo modules talk to the practice phone
 *     (phone.js): its OS, safe areas, keyboard, permissions, storage, camera,
 *     location, notifications and network;
 *   · test files run with Jest and React Native Testing Library's API
 *     (testing.js), Maestro flows drive the whole app (maestro.js), and a
 *     lab's server/ files are a backend the app reaches with fetch (server.js).
 *
 * It is NOT imported by the app. `node scripts/nativeLabRuntime.mjs` bundles
 * it, from the pinned workspace in scripts/native-lab/, into
 * public/lab/native-runtime.js.
 */

import * as React from "react";
import * as JsxRuntime from "react/jsx-runtime";
import * as JsxDevRuntime from "react/jsx-dev-runtime";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { transform } from "sucrase";

import * as ExpoRouter from "expo-router";
import { Stack } from "expo-router/stack";
import { Tabs } from "expo-router/tabs";
import * as ExpoRouterUI from "expo-router/ui";
import { navigationRef } from "expo-router/build/global-state/navigationRef";
import { getRouteInfoFromState } from "expo-router/build/global-state/getRouteInfoFromState";

import * as Svg from "react-native-svg";
import * as Zod from "zod";
import * as Zustand from "zustand";
import * as ZustandMiddleware from "zustand/middleware";
import * as ReactQuery from "@tanstack/react-query";
import * as I18n from "i18n-js";

import * as RN from "./rn.js";
import { Linking, linkingState, pressBack, Appearance } from "./rnInternal.js";
import * as SafeArea from "./safeArea.js";
import * as Phone from "./phone.js";
import * as Expo from "./expo.js";
import * as HW from "./hardware.js";
import * as Store from "./storage.js";
import * as Server from "./server.js";
import * as Testing from "./testing.js";
import { runFlow } from "./maestro.js";

const { device, ui, emit, on, stores } = Phone;

/* ── Expo Router's NativeTabs, drawn with its JavaScript tabs ────────────
 * The SDK 58 template's tab bar uses NativeTabs (the platform's own tab bar).
 * The practice phone draws it with Expo Router's JavaScript Tabs, keeping
 * each trigger's name, label and badge. */
function triggerOptions(trigger) {
  const opts = {};
  for (const child of React.Children.toArray(trigger.props.children)) {
    if (child?.type === NativeTabs.Trigger.Label) opts.title = String(React.Children.toArray(child.props.children).join(""));
    if (child?.type === NativeTabs.Trigger.Badge) opts.tabBarBadge = child.props.children;
  }
  if (trigger.props.hidden) opts.href = null;
  return opts;
}
function NativeTabs({ children, backgroundColor, tintColor }) {
  const triggers = React.Children.toArray(children).filter((c) => c?.type === NativeTabs.Trigger);
  return React.createElement(
    Tabs,
    { screenOptions: { headerShown: false, tabBarActiveTintColor: tintColor, tabBarStyle: backgroundColor ? { backgroundColor } : undefined } },
    triggers.map((t) => React.createElement(Tabs.Screen, { key: t.props.name, name: t.props.name, options: triggerOptions(t) }))
  );
}
NativeTabs.Trigger = function Trigger() {
  return null;
};
NativeTabs.Trigger.Label = () => null;
NativeTabs.Trigger.Icon = () => null;
NativeTabs.Trigger.Badge = () => null;
NativeTabs.Trigger.VectorIcon = () => null;

/* ── The libraries a lab may import ──────────────────────────────────── */
const esm = (obj, def) => ({ __esModule: true, ...obj, default: def === undefined ? obj : def });
const iconModule = (name) => esm({ [name]: Expo.VectorIcons[name] }, Expo.VectorIcons[name]);

function libraries() {
  const libs = {
    react: React,
    "react/jsx-runtime": JsxRuntime,
    "react/jsx-dev-runtime": JsxDevRuntime,
    "react-native": RN,
    "react-native-safe-area-context": SafeArea,
    expo: esm({ registerRootComponent: () => {}, isRunningInExpoGo: () => device.build === "expo-go", PermissionStatus: { GRANTED: "granted", DENIED: "denied", UNDETERMINED: "undetermined" } }),
    "expo-router": esm({ ...ExpoRouter, Stack, Tabs }),
    "expo-router/stack": esm({ Stack }, Stack),
    "expo-router/tabs": esm({ Tabs }, Tabs),
    "expo-router/js-tabs": esm({ Tabs }, Tabs),
    "expo-router/ui": ExpoRouterUI,
    "expo-router/native-tabs": esm({ NativeTabs }),
    "expo-router/testing-library": esm(Testing.EXPO_ROUTER_TESTING),
    "expo-status-bar": esm(Expo.ExpoStatusBar),
    "expo-constants": esm({ ExecutionEnvironment: Expo.ExecutionEnvironment, AppOwnership: Expo.AppOwnership }, Expo.Constants),
    "expo-linking": esm(Expo.ExpoLinking),
    "expo-splash-screen": esm(Expo.SplashScreen),
    "expo-system-ui": esm({ setBackgroundColorAsync: async () => {}, getBackgroundColorAsync: async () => null }),
    "expo-font": esm(Expo.Font),
    "@expo/vector-icons": esm(Expo.VectorIcons),
    "expo-symbols": esm({ SymbolView: Expo.SymbolView }),
    "expo-image": esm({ Image: Expo.ExpoImage, ImageBackground: RN.ImageBackground }),
    "expo-linear-gradient": esm({ LinearGradient: Expo.LinearGradient }),
    "expo-haptics": esm(Expo.Haptics),
    "expo-clipboard": esm(Expo.Clipboard),
    "expo-device": esm(Expo.Device),
    "expo-application": esm(Expo.Application),
    "expo-localization": esm(Expo.Localization),
    "expo-web-browser": esm(Expo.WebBrowser),
    "expo-updates": esm(Expo.Updates),
    "expo-crypto": esm(Expo.ExpoCrypto),
    "expo-network": esm(Expo.ExpoNetwork),
    "expo-keep-awake": esm({ useKeepAwake: () => {}, activateKeepAwakeAsync: async () => {}, deactivateKeepAwake: async () => {} }),
    "@react-native-community/netinfo": esm({ ...Expo.NetInfo, useNetInfo: Expo.NetInfo.useNetInfo }, Expo.NetInfo),
    "@react-native-async-storage/async-storage": esm({ useAsyncStorage: Store.useAsyncStorage }, Store.AsyncStorage),
    "expo-secure-store": esm(Store.SecureStore),
    "expo-sqlite": esm({
      openDatabaseSync: Store.openDatabaseSync,
      openDatabaseAsync: Store.openDatabaseAsync,
      deleteDatabaseSync: Store.deleteDatabaseSync,
      deleteDatabaseAsync: Store.deleteDatabaseAsync,
      SQLiteProvider: Store.SQLiteProvider,
      useSQLiteContext: Store.useSQLiteContext,
      addDatabaseChangeListener: Store.addDatabaseChangeListener,
      SQLiteDatabase: Store.SQLiteDatabase,
      Storage: Store.KVStore,
    }),
    "expo-sqlite/kv-store": esm({ Storage: Store.KVStore }, Store.KVStore),
    "expo-image-picker": esm(HW.ImagePicker),
    "expo-camera": esm({ ...HW.Camera, Camera: HW.Camera }),
    "expo-image-manipulator": esm({ ImageManipulator: HW.ImageManipulator, manipulateAsync: HW.manipulateAsync, useImageManipulator: HW.useImageManipulator, SaveFormat: HW.SaveFormat, FlipType: HW.FlipType }),
    "expo-file-system": esm({ File: HW.File, Directory: HW.Directory, Paths: HW.Paths }),
    "expo-location": esm(HW.Location),
    "react-native-maps": esm({ MapView: HW.MapView, Marker: HW.Marker, Callout: HW.Callout, Polyline: HW.Polyline, Polygon: HW.Polygon, Circle: HW.Circle, PROVIDER_GOOGLE: HW.PROVIDER_GOOGLE, PROVIDER_DEFAULT: HW.PROVIDER_DEFAULT }, HW.MapView),
    "expo-notifications": esm(HW.Notifications),
    "expo-document-picker": esm(HW.DocumentPicker),
    "expo-sharing": esm(HW.Sharing),
    "expo-local-authentication": esm(HW.LocalAuthentication),
    "expo-task-manager": esm(HW.TaskManager),
    "expo-background-task": esm(HW.BackgroundTask),
    "react-native-svg": esm(Svg, Svg.default),
    zod: Zod,
    zustand: Zustand,
    "zustand/middleware": ZustandMiddleware,
    "@tanstack/react-query": ReactQuery,
    "i18n-js": I18n,
    "@testing-library/react-native": esm(Testing.RNTL),
    "practice-server": esm(Server.SERVER_LIB),
  };
  for (const name of Object.keys(Expo.VectorIcons)) libs[`@expo/vector-icons/${name}`] = iconModule(name);
  return libs;
}
let LIBS = {};

/* ── Built-in images: the template's assets, with real sizes ─────────── */
function placeholder(width, height, label, from, to) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="100%" height="100%" rx="${Math.round(width / 9)}" fill="url(#g)"/>` +
    `<text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="${Math.round(Math.min(width, height) / 6)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
const IMAGE_ASSETS = {
  "icon.png": [1024, 1024, "icon", "#0f766e", "#1d4ed8"],
  "adaptive-icon.png": [1024, 1024, "icon", "#0f766e", "#1d4ed8"],
  "android-icon-foreground.png": [432, 432, "fg", "#0f766e", "#1d4ed8"],
  "android-icon-background.png": [432, 432, "bg", "#e6f4fe", "#e6f4fe"],
  "android-icon-monochrome.png": [432, 432, "mono", "#111827", "#374151"],
  "splash-icon.png": [200, 200, "splash", "#208aef", "#0f766e"],
  "favicon.png": [48, 48, "f", "#0f766e", "#1d4ed8"],
  "react-logo.png": [100, 100, "React", "#0891b2", "#1e3a8a"],
  "logo.png": [240, 240, "logo", "#111827", "#374151"],
  "avatar.png": [256, 256, "AO", "#b45309", "#be123c"],
  "profile.jpg": [600, 600, "profile", "#b45309", "#be123c"],
  "product.jpg": [800, 800, "product", "#0369a1", "#0f766e"],
  "hero.jpg": [1600, 900, "hero", "#0f766e", "#1e3a8a"],
  "onboarding-1.png": [600, 600, "1", "#7c3aed", "#db2777"],
  "onboarding-2.png": [600, 600, "2", "#0369a1", "#0f766e"],
  "onboarding-3.png": [600, 600, "3", "#b45309", "#be123c"],
  "empty.png": [400, 300, "empty", "#94a3b8", "#cbd5e1"],
};
function assetFor(path) {
  if (/\.(ttf|otf)$/i.test(path)) return { uri: path, __asset: path, type: "font" };
  const name = path.split("/").pop().replace(/@[23]x(?=\.)/, "");
  const spec = IMAGE_ASSETS[name] || [400, 400, name.replace(/\.\w+$/, ""), "#475569", "#1e293b"];
  return { uri: placeholder(...spec), width: spec[0], height: spec[1], __asset: path };
}

/* ── The module loader ───────────────────────────────────────────────── */
let FILES = {};
let ENV = {};
const appCache = new Map();
const serverCache = new Map();
// Images and fonts are assets, as in Metro: requiring one gives a reference, not code.
const IMAGE = /\.(png|jpe?g|gif|webp|svg|bmp|ttf|otf)$/i;
const CODE_EXT = [".tsx", ".ts", ".jsx", ".js"];

function normalise(path) {
  const out = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}
/** Metro's resolution: platform file first, then the shared one, then index files. */
function candidatesFor(base) {
  const os = device.os;
  const list = [base];
  for (const ext of CODE_EXT) list.push(`${base}.${os}${ext}`, `${base}.native${ext}`, `${base}${ext}`);
  list.push(`${base}.json`);
  for (const ext of CODE_EXT) list.push(`${base}/index.${os}${ext}`, `${base}/index.native${ext}`, `${base}/index${ext}`);
  return list;
}
function resolve(spec, from) {
  let base;
  if (spec.startsWith("@/assets/")) base = normalise(`assets/${spec.slice(9)}`);
  else if (spec.startsWith("@/")) base = normalise(`src/${spec.slice(2)}`);
  else if (spec.startsWith("/")) base = normalise(spec);
  else if (spec.startsWith(".")) base = normalise(`${from.split("/").slice(0, -1).join("/")}/${spec}`);
  else return null;
  if (IMAGE.test(base)) return base;
  for (const c of candidatesFor(base)) if (FILES[c] !== undefined && !(c === base && /\/$/.test(c))) return c;
  if (FILES[base] !== undefined) return base;
  return undefined;
}

function compile(code, file, { jest = false } = {}) {
  const ts = /\.tsx?$/.test(file);
  const jsx = /\.(jsx|tsx|js)$/.test(file);
  const transforms = ["imports"];
  if (ts) transforms.unshift("typescript");
  if (jsx) transforms.unshift("jsx");
  if (jest) transforms.push("jest");
  return transform(code, { transforms, filePath: file, jsxRuntime: "automatic", production: false, disableESTransforms: true }).code;
}

/** process.env as Metro inlines it: only EXPO_PUBLIC_ variables reach app code. */
function processFor(kind) {
  const env = { NODE_ENV: "development", EXPO_OS: device.os };
  if (kind === "server") Object.assign(env, ENV);
  else for (const [k, v] of Object.entries(ENV)) if (k.startsWith("EXPO_PUBLIC_")) env[k] = v;
  return { env, platform: "ios" };
}

const isTestFile = (f) => /\.(test|spec)\.[jt]sx?$/.test(f) || /(^|\/)__tests__\//.test(f);
const isServerFile = (f) => f.startsWith("server/");

function makeLoader(cache, kind, { mocks = null } = {}) {
  function load(file, { actual = false } = {}) {
    if (!actual && mocks) {
      const mocked = mockFor(file);
      if (mocked) return mocked;
    }
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    if (IMAGE.test(file)) {
      module.exports = assetFor(file);
      return module.exports;
    }
    const source = FILES[file];
    if (file.endsWith(".json")) {
      module.exports = JSON.parse(source);
      return module.exports;
    }
    if (file.endsWith(".css")) return module.exports;
    let compiled;
    try {
      compiled = compile(source, file, { jest: Boolean(mocks) && isTestFile(file) });
    } catch (err) {
      cache.delete(file);
      throw new SyntaxError(`${file}: ${String(err.message).replace(/\s*\(\d+:\d+\)$/, "")}${err.loc ? ` (${err.loc.line}:${err.loc.column})` : ""}`);
    }
    const localRequire = (spec) => {
      if (mocks) {
        const m = mocks.get(spec);
        if (m && Object.prototype.hasOwnProperty.call(LIBS, spec)) return mockValue(m, () => LIBS[spec]);
      }
      if (Object.prototype.hasOwnProperty.call(LIBS, spec)) return LIBS[spec];
      const target = resolve(spec, file);
      if (target === null) {
        const pkg = spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/");
        throw new Error(`Unable to resolve module ${spec} from ${file}: ${pkg} could not be found within the project. The practice phone includes the Expo SDK 58 modules this course uses; install others in your own project with npx expo install ${pkg}.`);
      }
      if (target === undefined) throw new Error(`Unable to resolve module ${spec} from ${file}: none of these files exist: ${candidatesFor(spec).slice(0, 3).join(", ")}`);
      return load(target);
    };
    localRequire.context = () => {
      throw new Error("require.context is not available on the practice phone");
    };
    const meta = { env: processFor(kind).env };
    const body = compiled.replace(/\bimport\.meta\b/g, "__importMeta");
    const globals = Testing.GLOBALS;
    const run = new Function(
      "require", "module", "exports", "__importMeta", "process", "__DEV__", "jest", "describe", "it", "test", "expect", "beforeEach", "afterEach", "beforeAll", "afterAll",
      `${body}\n//# sourceURL=${file}`
    );
    try {
      run(localRequire, module, module.exports, meta, processFor(kind), device.build !== "production", globals.jest, globals.describe, globals.it, globals.test, globals.expect, globals.beforeEach, globals.afterEach, globals.beforeAll, globals.afterAll);
    } catch (err) {
      cache.delete(file);
      throw err;
    }
    return module.exports;
  }

  function mockValue(entry, actual) {
    if (entry.value) return entry.value;
    if (entry.factory) entry.value = entry.factory();
    else {
      const real = actual();
      entry.value = Object.fromEntries(Object.entries(real).map(([k, v]) => [k, typeof v === "function" ? Testing.jest.fn() : v]));
      if (typeof real.default === "function") entry.value.default = Testing.jest.fn();
    }
    if (entry.value && typeof entry.value === "object" && !("__esModule" in entry.value) && !("default" in entry.value)) entry.value = { __esModule: true, ...entry.value, default: entry.value };
    return entry.value;
  }
  function mockFor(file) {
    for (const [spec, entry] of mocks) {
      const from = entry.from || "";
      if (Object.prototype.hasOwnProperty.call(LIBS, spec)) continue;
      if (resolve(spec, from) === file) return mockValue(entry, () => load(file, { actual: true }));
    }
    return null;
  }
  load.resolve = resolve;
  return load;
}

/* ── Error screens: React Native's red box ───────────────────────────── */
function redBox(title, message) {
  let box = document.getElementById("__lab-overlay");
  if (!box) {
    box = document.createElement("div");
    box.id = "__lab-overlay";
    box.setAttribute("data-lab-overlay", "");
    Object.assign(box.style, { position: "fixed", inset: "0", background: "#b51e1e", color: "#fff", font: "14px/1.5 ui-monospace, Menlo, Consolas, monospace", padding: `${Phone.screen().insets.top + 12}px 16px 24px`, whiteSpace: "pre-wrap", overflow: "auto", zIndex: "2147483600" });
    document.body.appendChild(box);
  }
  const head = document.createElement("div");
  head.style.cssText = "font:600 18px/1.3 -apple-system,Roboto,Arial,sans-serif;margin-bottom:8px";
  head.textContent = title;
  const body = document.createElement("div");
  body.textContent = message;
  box.appendChild(head);
  box.appendChild(body);
}

/* ── The app ─────────────────────────────────────────────────────────── */
let root = null;
let rootEl = null;
let loadApp = null;
let appRootDir = "src/app";
let routeWatch = false;

function routeContext() {
  const prefix = `${appRootDir}/`;
  const keys = Object.keys(FILES)
    .filter((f) => f.startsWith(prefix) && /\.[jt]sx?$/.test(f) && !/\+(api|html)\.[jt]sx?$/.test(f) && !isTestFile(f))
    .filter((f) => !/\.(ios|android|native|web)\.[jt]sx?$/.test(f));
  const map = Object.fromEntries(keys.map((f) => [`./${f.slice(prefix.length)}`, f]));
  const ctx = (key) => loadApp(map[key]);
  ctx.keys = () => Object.keys(map);
  ctx.resolve = (key) => key;
  ctx.id = "0";
  return ctx;
}

function setInitialPath(path) {
  const clean = String(path || "/").replace(/^\/+/, "");
  linkingState.initialURL = clean ? `${device.app.scheme || "myapp"}://${clean}` : null;
}

/**
 * The route the app opens at: the path inside the link that launched it.
 * Expo Router on the web would read the page's own address, which in the
 * practice phone is meaningless, so ExpoRoot is given it explicitly.
 */
function initialLocation() {
  const url = linkingState.initialURL;
  if (!url) return "/";
  if (/^https?:\/\//.test(url)) {
    const u = new URL(url);
    return `${u.pathname}${u.search}`;
  }
  const rest = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").replace(/^\/+/, "");
  return `/${rest}`;
}

function mount() {
  rootEl = document.getElementById("root");
  appCache.clear();
  loadApp = makeLoader(appCache, "app");
  const hasRoutes = Object.keys(FILES).some((f) => f.startsWith(`${appRootDir}/`));
  const splashCfg = Expo.splashConfig();
  Expo.splash.prevented = false;
  if (splashCfg) {
    Expo.splash.visible = true;
    ui.splash(splashCfg);
  }
  root = createRoot(rootEl, {
    onUncaughtError(err, info) {
      redBox("Render Error", `${err && err.message ? err.message : err}${info?.componentStack ? `\n${info.componentStack.split("\n").slice(0, 6).join("\n")}` : ""}`);
      window.__labErrors?.push(`${err && err.name ? err.name : "Error"}: ${err && err.message ? err.message : err}`);
      console.error(`Render Error: ${err && err.message ? err.message : err}`);
    },
  });
  try {
    let element;
    if (hasRoutes) {
      element = React.createElement(ExpoRouter.ExpoRoot, { context: routeContext(), location: initialLocation() });
    } else {
      const entry = ["App.tsx", "App.jsx", "App.js", "App.ts"].find((f) => FILES[f] !== undefined);
      if (!entry) throw new Error("This project has no src/app/ routes and no App.tsx, so there is nothing to show.");
      const App = loadApp(entry).default;
      element = React.createElement(SafeArea.SafeAreaProvider, null, React.createElement(App));
    }
    flushSync(() => root.render(element));
  } catch (err) {
    redBox(err instanceof SyntaxError ? "Syntax Error" : "Error", `${err.message}`);
    window.__labErrors?.push(`${err.name}: ${err.message}`);
    console.error(`${err.name}: ${err.message}`);
  }
  // The preview shows the current route, as Expo's dev tools do.
  if (!routeWatch && hasRoutes) {
    routeWatch = true;
    const report = () => window.__labSend?.({ type: "location", path: routeInfo().pathname });
    const tryListen = () => {
      if (navigationRef.isReady?.()) {
        navigationRef.addListener("state", report);
        report();
      } else setTimeout(tryListen, 100);
    };
    tryListen();
  }
  // The splash screen hides by itself once the app has drawn, unless the app
  // asked to keep it (SplashScreen.preventAutoHideAsync) until it is ready.
  if (splashCfg) setTimeout(() => !Expo.splash.prevented && Expo.SplashScreen.hide(), 120);
  device.appState = "active";
  emit("appstate", null);
}

function unmount() {
  try {
    root?.unmount();
  } catch {
    /* already gone */
  }
  root = null;
  document.getElementById("__lab-overlay")?.remove();
  ui.splash(null);
  HW.notifications.handler = null;
  HW.notifications.received.clear();
  HW.notifications.responses.clear();
  HW.notifications.dropped.clear();
  Appearance.setColorScheme(null);
  device.statusBar = { style: "auto", hidden: false };
}

/** Close the app completely and open it again (a cold start). Stored data stays. */
async function restart({ clearState = false, url = null, path = null } = {}) {
  unmount();
  if (clearState) {
    Phone.clearStores();
    device.permissions = {};
  }
  if (url) linkingState.initialURL = url;
  else setInitialPath(path || "/");
  await new Promise((r) => setTimeout(r, 30));
  mount();
  await settle(300);
}

const settle = (ms = 120) => new Promise((r) => setTimeout(r, ms));

/* ── The phone's controls, for the preview toolbar and the checks ────── */
function setAppState(state) {
  if (device.appState === state) return;
  device.appState = state;
  emit("appstate", null);
}

function keyboardWatch() {
  const inApp = (el) => el && /^(INPUT|TEXTAREA)$/.test(el.tagName) && !el.closest("#__phone") && !el.closest("#__tests") && el.type !== "checkbox";
  document.addEventListener("focusin", (e) => {
    if (inApp(e.target)) ui.keyboard(true, e.target.getAttribute("inputmode") || (e.target.type === "email" ? "email" : e.target.type === "tel" ? "tel" : "default"));
  });
  document.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!inApp(document.activeElement)) ui.keyboard(false);
    }, 0);
  });
}

function routeInfo() {
  try {
    const state = navigationRef.isReady?.() ? navigationRef.getRootState() : null;
    if (!state) return { pathname: "/", segments: [], params: {}, pathnameWithParams: "/" };
    return getRouteInfoFromState(state);
  } catch {
    return { pathname: "/", segments: [], params: {}, pathnameWithParams: "/" };
  }
}

/* Visible = what a person (or a screen reader) can perceive right now. */
const isVisible = (el) => el && el.isConnected && !Testing.isHidden(el) && !el.closest("#__tests") && (el.getBoundingClientRect().width > 0 || el.getBoundingClientRect().height > 0);
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
// React Native's <Modal> renders through a portal on <body> (react-native-web), outside #root.
const appNodes = () => [...document.querySelectorAll("#root *, body > div:not(#__phone) [aria-modal=true], body > div:not(#__phone) [aria-modal=true] *")].filter(isVisible);
const textNodes = () => appNodes().filter((el) => el.getAttribute("dir") === "auto" && !/^(INPUT|TEXTAREA)$/.test(el.tagName));

function findAll(target) {
  if (!target) return [];
  if (target instanceof Element) return [target];
  const t = typeof target === "string" ? { text: target } : target;
  const nodes = appNodes();
  const eq = (a, b) => (b instanceof RegExp ? b.test(norm(a)) : norm(a) === norm(b));
  let hits = [];
  if (t.testID !== undefined) hits = nodes.filter((el) => el.getAttribute("data-testid") === t.testID);
  else if (t.label !== undefined) hits = nodes.filter((el) => eq(el.getAttribute("aria-label") || "", t.label));
  else if (t.placeholder !== undefined) hits = nodes.filter((el) => eq(el.getAttribute("placeholder") || "", t.placeholder));
  else if (t.role !== undefined) {
    const roles = t.role === "header" ? ["heading", "header"] : [t.role];
    // The navigation bar's title is a level-1 heading (see screenTitle); content headers have no level.
    hits = nodes.filter((el) => roles.includes(el.getAttribute("role")) && !(t.role === "header" && el.getAttribute("aria-level") === "1") && (t.name === undefined || eq(Testing.nameOf(el), t.name)));
  } else if (t.text !== undefined) {
    const texts = textNodes().filter((el) => eq(el.textContent, t.text));
    const outer = texts.filter((el) => !texts.some((o) => o !== el && o.contains(el)));
    const labelled = nodes.filter((el) => el.hasAttribute("aria-label") && eq(el.getAttribute("aria-label"), t.text));
    hits = [...outer, ...labelled.filter((l) => !outer.some((o) => l.contains(o) || o.contains(l)))];
  }
  return hits;
}
const find = (target) => findAll(target)[0] || null;
const pressTarget = (el) => el && (el.closest("[role=button],[role=link],[role=tab],[role=switch],[role=checkbox],[role=radio],[role=menuitem],[tabindex],a,button") || el);
const fiberProps = (el, prop) => {
  for (let f = Testing.fiberOf(el); f; f = f.return) if (f.memoizedProps && typeof f.memoizedProps[prop] === "function") return f.memoizedProps[prop];
  return null;
};
const setNative = (node, value) => {
  let proto = Object.getPrototypeOf(node);
  while (proto && !Object.getOwnPropertyDescriptor(proto, "value")) proto = Object.getPrototypeOf(proto);
  Object.getOwnPropertyDescriptor(proto, "value").set.call(node, value);
  node.dispatchEvent(new Event("input", { bubbles: true }));
};
const inputFor = (target) => {
  const el = find(typeof target === "string" ? { placeholder: target } : target) || find(typeof target === "string" ? { label: target } : null) || find(typeof target === "string" ? { testID: target } : null);
  return el && (/^(INPUT|TEXTAREA)$/.test(el.tagName) ? el : el.querySelector("input,textarea"));
};

function makeHelpers() {
  const h = {
    async waitFor(fn, ms = 2000) {
      const end = Date.now() + ms;
      for (;;) {
        try {
          if (await fn()) return true;
        } catch {
          /* not yet */
        }
        if (Date.now() > end) return false;
        await new Promise((r) => setTimeout(r, 25));
      }
    },
    /** Everything visible on the phone's screen, as text. */
    screen: () => norm(textNodes().filter((el) => !textNodes().some((o) => o !== el && o.contains(el))).map((el) => el.textContent).join(" | ")),
    texts: () => textNodes().filter((el) => !textNodes().some((o) => o !== el && o.contains(el))).map((el) => norm(el.textContent)),
    has: (text) => findAll(typeof text === "string" ? { text } : text).length > 0,
    hasText: (part) => textNodes().some((el) => el.textContent.includes(part)),
    find,
    findAll,
    exists: (target) => Boolean(find(target)),
    /** The title in the navigation bar (the header Expo Router draws), if there is one. */
    screenTitle: () => norm(appNodes().find((el) => el.getAttribute("role") === "heading" && el.getAttribute("aria-level") === "1")?.textContent || ""),
    async press(target) {
      // When the same words appear twice (a screen title and a button), press the one that can be pressed.
      const all = findAll(target);
      const pressable = (n) => n && n.matches("[role=button],[role=link],[role=tab],[role=switch],[role=checkbox],[role=radio],[role=menuitem],[tabindex],a,button");
      const el = all.map(pressTarget).find(pressable) || pressTarget(all[0]);
      if (!el) throw new Error(`Nothing on the screen matches ${JSON.stringify(target)}`);
      el.click();
      await settle(180);
      return true;
    },
    async longPress(target) {
      const el = find(target);
      const fn = el && fiberProps(el, "onLongPress");
      if (fn) fn({ nativeEvent: {} });
      await settle(150);
      return Boolean(fn);
    },
    async typeInto(target, text) {
      const el = inputFor(target);
      if (!el) throw new Error(`No text field matches ${JSON.stringify(target)}`);
      el.focus();
      el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      // A real tap opens the keyboard; focus() in a background page fires no focus event.
      if (!device.keyboardHeight) ui.keyboard(true, el.getAttribute("inputmode") || (el.type === "email" ? "email" : "default"));
      setNative(el, String(text));
      await settle(150);
      return true;
    },
    /** The user leaves a text field (taps elsewhere): it blurs and the keyboard closes. */
    async leave(target) {
      const el = inputFor(target);
      if (!el) throw new Error(`No text field matches ${JSON.stringify(target)}`);
      el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      el.blur();
      ui.keyboard(false);
      await settle(120);
      return true;
    },
    async submit(target) {
      const el = inputFor(target);
      if (!el) throw new Error(`No text field matches ${JSON.stringify(target)}`);
      // The Return key, as the keyboard sends it: the TextInput turns it into onSubmitEditing.
      const fn = fiberProps(el, "onSubmitEditing");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
      await settle(150);
      return Boolean(fn);
    },
    inputValue: (target) => inputFor(target)?.value ?? null,
    async toggle(target) {
      const el = find(target);
      const sw = el && (el.matches("[role=switch],input[type=checkbox]") ? el : el.querySelector("[role=switch],input[type=checkbox]") || el.closest("[role=switch]"));
      (sw || el)?.click();
      await settle(120);
    },
    async scrollDown(px = 600) {
      for (const sc of document.querySelectorAll("#root *")) {
        if (isVisible(sc) && sc.scrollHeight > sc.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY)) {
          sc.scrollTop += px;
          sc.dispatchEvent(new Event("scroll"));
        }
      }
      await settle(200);
    },
    styleOf(target) {
      const el = find(target);
      for (let f = Testing.fiberOf(el); f; f = f.return) if (f.tag !== 5 && f.memoizedProps && f.memoizedProps.style !== undefined) return RN.StyleSheet.flatten(f.memoizedProps.style) || {};
      return {};
    },
    css: (target, prop) => {
      const el = find(target);
      return el ? getComputedStyle(el).getPropertyValue(prop).trim() : "";
    },
    rectOf: (target) => find(target)?.getBoundingClientRect() || { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 },
    /** The size of the area a finger can hit: the pressable element's box. */
    tapSize(target) {
      const el = pressTarget(find(target));
      if (!el) return { width: 0, height: 0 };
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    },
    /** WCAG contrast ratio between a text's colour and the background actually behind it. */
    contrastOf(target) {
      const el = find(target);
      if (!el) return 0;
      const rgb = (c) => (String(c).match(/[\d.]+/g) || []).map(Number);
      const lum = ([r, g, b]) => {
        const ch = [r, g, b].map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
      };
      let bg = null;
      for (let n = el; n && !bg; n = n.parentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c.length < 4 || c[3] > 0.5)) bg = c;
      }
      bg = bg || (device.scheme === "dark" ? [0, 0, 0] : [255, 255, 255]);
      const [l1, l2] = [lum(rgb(getComputedStyle(el).color)), lum(bg)].sort((x, y) => y - x);
      return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
    },
    fontSize: (target) => parseFloat(find(target) ? getComputedStyle(find(target)).fontSize : "0") || 0,
    nameOf: (target) => Testing.nameOf(find(target)),
    roleOf: (target) => find(target)?.getAttribute("role") || "",
    disabled: (target) => {
      const el = pressTarget(find(target));
      return Boolean(el && (el.getAttribute("aria-disabled") === "true" || el.disabled));
    },
    // Icons are hidden from screen readers on purpose, so look past their own aria-hidden.
    icons: () =>
      [...document.querySelectorAll("#root [data-icon]")]
        .filter((el) => el.getBoundingClientRect().width > 0 && !(el.parentElement && Testing.isHidden(el.parentElement)))
        .map((el) => el.getAttribute("data-icon")),
    images: () => appNodes().filter((el) => el.tagName === "IMG" || getComputedStyle(el).backgroundImage.startsWith("url(")).length,
    // navigation
    path: () => routeInfo().pathname,
    segments: () => routeInfo().segments,
    params: () => routeInfo().params,
    async back() {
      if (device.os === "android") pressBack();
      else if (ExpoRouter.router.canGoBack()) ExpoRouter.router.back();
      await settle(300);
    },
    canGoBack: () => ExpoRouter.router.canGoBack(),
    async navigate(href) {
      ExpoRouter.router.navigate(href);
      await settle(300);
    },
    /** A link opened from outside the app (a browser, a message, a QR code) while it runs. */
    async openLink(url) {
      await Linking.openURL(url).catch(() => {});
      await settle(350);
    },
    /** The app was closed; a link launches it (a cold start). */
    async coldLink(url) {
      await restart({ url });
    },
    restart: (opts) => restart(opts),
    async background() {
      setAppState("background");
      await settle(80);
    },
    async foreground() {
      setAppState("active");
      await settle(80);
    },
    appState: () => device.appState,
    async setOnline(value) {
      device.online = Boolean(value);
      emit("network", null);
      await settle(80);
    },
    async setScheme(value) {
      device.scheme = value === "dark" ? "dark" : "light";
      emit("scheme", null);
      ui.drawChrome();
      await settle(100);
    },
    async setLocation(latitude, longitude) {
      HW.moveTo({ latitude, longitude });
      await settle(100);
    },
    // the phone's own interface
    dialog: () => {
      const m = ui.modal();
      return m && m.type === "dialog" ? { title: m.title, message: m.message, buttons: m.buttons, permission: m.permission, kind: m.kind } : null;
    },
    modal: () => {
      const m = ui.modal();
      return m ? { type: m.type, kind: m.kind, title: m.title, buttons: m.buttons, url: m.url } : null;
    },
    async tap(label) {
      await h.waitFor(() => ui.modal(), 1500);
      const ok = ui.tap(label);
      await settle(200);
      return ok;
    },
    async allow() {
      await h.waitFor(() => ui.modal()?.permission, 1500);
      const m = ui.modal();
      if (!m?.permission) return false;
      ui.tap(device.os === "ios" ? "Allow" : m.buttons.includes("Allow") ? "Allow" : "While using the app");
      await settle(200);
      return true;
    },
    async deny() {
      await h.waitFor(() => ui.modal()?.permission, 1500);
      if (!ui.modal()?.permission) return false;
      ui.tap(device.os === "ios" ? "Don’t Allow" : "Don’t allow");
      await settle(200);
      return true;
    },
    async pickPhoto(n = 1) {
      await h.waitFor(() => ui.modal()?.kind === "photo-picker", 1500);
      const ok = ui.tap(`photo ${n}`);
      await settle(250);
      return ok;
    },
    async pickDocument(name) {
      await h.waitFor(() => ui.modal()?.kind === "document-picker", 1500);
      const ok = ui.tap(name);
      await settle(200);
      return ok;
    },
    async shutter() {
      await h.waitFor(() => ui.modal()?.kind === "camera", 1500);
      const ok = ui.tap("Take photo");
      await settle(250);
      return ok;
    },
    async cancel() {
      await h.waitFor(() => ui.modal(), 1500);
      const ok = ui.tap("Cancel") || ui.tap("Done");
      await settle(200);
      return ok;
    },
    async biometric(result = "match") {
      await h.waitFor(() => ui.modal()?.type === "biometric", 1500);
      const ok = ui.tap(result === "success" ? "match" : result);
      await settle(200);
      return ok;
    },
    permission: (name) => Phone.permission(name),
    async setPermission(name, status) {
      device.permissions[name] = { status, canAskAgain: status !== "denied", denials: status === "denied" ? 1 : 0 };
      emit("permissions", { name });
      await settle(60);
    },
    keyboard: () => ({ visible: device.keyboardHeight > 0, height: device.keyboardHeight, type: document.querySelector("#__phone .ph-keyboard")?.getAttribute("data-keyboard") || null }),
    keyboardTop: () => Phone.screen().height - device.keyboardHeight,
    async dismissKeyboard() {
      RN.Keyboard.dismiss();
      await settle(80);
    },
    statusBar: () => ({ style: Phone.statusBarStyle(), hidden: device.statusBar.hidden }),
    insets: () => Phone.screen().insets,
    splashVisible: () => Expo.splash.visible,
    // notifications
    notifications: () => HW.notifications.delivered.map((n) => ({ title: n.request.content.title, body: n.request.content.body, data: n.request.content.data, shown: n.shown, remote: n.remote, id: n.request.identifier })),
    scheduled: () => HW.notifications.scheduled.map((s) => ({ id: s.request.identifier, title: s.request.content.title, body: s.request.content.body, trigger: s.request.trigger, inSeconds: Math.round((s.fireAt - Date.now()) / 1000) })),
    async advance(seconds) {
      Phone.clock.offset += seconds * 1000;
      HW.advanceClock(seconds);
      await settle(150);
    },
    async tapNotification(index = -1) {
      const list = HW.notifications.delivered;
      const n = index < 0 ? list[list.length + index] : list[index];
      if (!n) return false;
      document.querySelector(`#__phone [data-phone-banner="${n.request.identifier}"]`)?.remove();
      HW.respond(n);
      await settle(300);
      return true;
    },
    /** A notification arrives (as a push from a server would), shown if permitted. */
    async notify(content = {}) {
      const id = `test-${Date.now()}`;
      await HW.deliver({ identifier: id, content: { title: null, subtitle: null, body: null, data: {}, sound: null, badge: null, ...content }, trigger: { type: "push" } }, { remote: true });
      await settle(150);
      return id;
    },
    pushToken: () => HW.notifications.tokens.expo,
    badge: () => HW.notifications.badge,
    channels: () => Object.values(HW.notifications.channels),
    async runBackgroundTasks() {
      const r = await HW.runBackgroundTasks();
      await settle(100);
      return r;
    },
    registeredTasks: () => [...HW.backgroundRegistry.registered.keys()],
    scanBarcode: async (data, type) => {
      const ok = HW.scanBarcode(data, type);
      await settle(150);
      return ok;
    },
    // logs of what the app asked the phone to do
    haptics: () => device.log.haptics.slice(),
    vibrations: () => device.log.vibrations.slice(),
    clipboard: () => device.clipboard.text,
    shares: () => device.log.shares.slice(),
    opened: () => device.log.opened.slice(),
    browser: () => device.log.browser.slice(),
    alerts: () => device.log.alerts.filter((a) => a.kind === "alert"),
    toasts: () => device.log.toasts.slice(),
    announcements: () => device.log.announcements.slice(),
    // storage
    asyncStore: () => Object.fromEntries(stores.async),
    secureStore: () => Object.fromEntries(stores.secure),
    kvStore: () => Object.fromEntries(stores.kv),
    sql(name, query, params = []) {
      const db = stores.sqlite.get(name);
      if (!db) return null;
      const stmt = db.prepare(query);
      stmt.bind(params);
      const out = [];
      while (stmt.step()) out.push(stmt.getAsObject());
      stmt.free();
      return out;
    },
    databases: () => [...stores.sqlite.keys()],
    // the practice server
    serverRequests: () => Server.requests.slice(),
    serverLog: () => Server.serverLog.slice(),
    // tests
    async maestro(file) {
      const source = FILES[file];
      if (source === undefined) throw new Error(`No flow file ${file}`);
      return runFlow(source, {
        root: () => document.getElementById("root"),
        restart: (o) => restart(o),
        stop: async () => unmount(),
        back: () => h.back(),
        longPress: (el) => h.longPress(el),
        openLink: (u) => h.openLink(u),
        setLocation: (a, b) => HW.moveTo({ latitude: a, longitude: b }),
        deviceName: `${device.phone.model} - ${device.phone.osName} ${device.phone.osVersion}`,
        appId: device.os === "ios" ? device.app.config.ios?.bundleIdentifier || "host.exp.Exponent" : device.app.config.android?.package || "host.exp.exponent",
      }, { name: file.split("/").pop().replace(/\.ya?ml$/, "") });
    },
    /** One of the app's own modules, as the app itself loaded it (functions can be called). */
    load(file) {
      if (FILES[file] === undefined) throw new Error(`No file ${file} in this project`);
      return (loadApp || makeLoader(appCache, "app"))(file);
    },
    device: () => ({ os: device.os, model: device.phone.model, build: device.build, scheme: device.scheme, online: device.online, orientation: device.orientation }),
    config: () => device.app.config,
    files: () => Object.keys(FILES),
  };
  return h;
}

/* ── Boot ────────────────────────────────────────────────────────────── */
function parseEnv(files) {
  const env = {};
  // Expo CLI's order in development: .env, .env.development, .env.local, .env.development.local (later wins).
  for (const name of [".env", ".env.development", ".env.local", ".env.development.local"]) {
    for (const line of String(files[name] ?? "").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !line.trim().startsWith("#")) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

async function boot(config) {
  FILES = config.files || {};
  ENV = parseEnv(FILES);
  let appJson = {};
  try {
    appJson = JSON.parse(FILES["app.json"] || "{}");
  } catch (err) {
    redBox("app.json is not valid JSON", err.message);
  }
  const expo = appJson.expo || appJson;
  device.app = { name: expo.name || "My App", slug: expo.slug || "my-app", scheme: [].concat(expo.scheme || "myapp")[0], config: expo };
  Phone.configure(config.device || {});
  Phone.seedStores(config.device?.storage || {});
  appRootDir = Object.keys(FILES).some((f) => f.startsWith("src/app/")) ? "src/app" : "app";
  LIBS = libraries();
  window.__labConfig = config;

  Testing.setRouterHooks({
    info: routeInfo,
    state: () => (navigationRef.isReady?.() ? navigationRef.getRootState() : undefined),
    router: ExpoRouter.router,
    root(files, initialUrl) {
      const map = {};
      for (const [name, value] of Object.entries(files)) {
        const key = `./${name.replace(/^\.\//, "")}${/\.[jt]sx?$/.test(name) ? "" : ".tsx"}`;
        map[key] = typeof value === "function" ? { default: value } : value;
      }
      const ctx = (key) => map[key];
      ctx.keys = () => Object.keys(map);
      ctx.resolve = (k) => k;
      ctx.id = "test";
      setInitialPath(initialUrl);
      return React.createElement(ExpoRouter.ExpoRoot, { context: ctx, location: initialLocation() });
    },
  });

  const start = async () => {
    ui.drawChrome();
    on("statusbar", () => ui.drawChrome());
    on("scheme", () => ui.drawChrome());
    Server.installNetwork();
    keyboardWatch();
    on("reload", () => restart({}));
    on("exit", () => setAppState("background"));
    window.addEventListener("message", (event) => {
      const d = event.data || {};
      if (d.__labControl !== config.nonce) return;
      const h = window.__labExtraHelpers;
      if (d.action === "back") h.back();
      else if (d.action === "restart") restart({});
      else if (d.action === "scheme") h.setScheme(d.value);
      else if (d.action === "online") h.setOnline(d.value);
      else if (d.action === "background") h.background();
      else if (d.action === "foreground") h.foreground();
      else if (d.action === "advance") h.advance(d.value || 60);
      else if (d.action === "deepLink") h.openLink(d.value);
    });
    window.addEventListener("error", (event) => {
      if (!document.getElementById("__lab-overlay") && event.error) redBox("Uncaught Error", `${event.error.name}: ${event.error.message}`);
    });
    try {
      if (typeof window.initSqlJs === "function") {
        await Store.loadSqlite();
        window.__sqlEngine = () => window.__sqlEngineCtor;
      }
    } catch (err) {
      console.error(err.message);
    }
    // The backend starts first and keeps running while the app restarts.
    const serverLoad = makeLoader(serverCache, "server");
    for (const f of Object.keys(FILES).filter((x) => isServerFile(x) && /(^|\/)index\.[jt]s$/.test(x))) {
      try {
        serverLoad(f);
      } catch (err) {
        console.error(`[server] ${err.name}: ${err.message}`);
        window.__labErrors?.push(`[server] ${err.name}: ${err.message}`);
      }
    }
    setInitialPath(config.path || "/");
    const helpers = makeHelpers();
    window.__labExtraHelpers = helpers;
    const tests = Object.keys(FILES).filter(isTestFile);
    const runAppTests = Object.keys(FILES).some((f) => f.startsWith(`${appRootDir}/`) || /^App\.[jt]sx?$/.test(f));
    if (runAppTests && config.mountApp !== false) mount();
    await settle(250);
    window.__labTests = tests.length
      ? (async () => {
          const out = await Testing.runTestFiles(tests, (file) => {
            const cache = new Map();
            const loader = makeLoader(cache, "app", { mocks: Testing.moduleMocks });
            Testing.jest.__requireActual = (spec) => (Object.prototype.hasOwnProperty.call(LIBS, spec) ? LIBS[spec] : loader(resolve(spec, file), { actual: true }));
            return loader(file);
          });
          return out;
        })()
      : Promise.resolve(null);
    return true;
  };
  window.__labNativeReady = new Promise((resolveReady) => {
    const go = () => start().then(resolveReady, (err) => {
      console.error(err);
      resolveReady(false);
    });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go, { once: true });
    else go();
  });
}

window.__labNative = { boot, libs: () => Object.keys(libraries()), phones: Phone.PHONES };
