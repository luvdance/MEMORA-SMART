/**
 * Builds the Mobile App Development course's practice phone:
 *
 *   public/lab/native-runtime.js   src/academy/native/labRuntimeEntry.js, bundled
 *                                  with the REAL Expo Router (SDK 58), React 19.3,
 *                                  react-native-web and react-native-svg from the
 *                                  pinned workspace in scripts/native-lab/;
 *   public/lab/sqlite.js           SQLite compiled to WebAssembly (sql.js), with its
 *                                  .wasm inlined, loaded only by labs that use SQLite.
 *
 * Inside the bundle, "react-native" resolves to src/academy/native/rnInternal.js
 * (react-native-web plus the practice phone's Linking, BackHandler, Appearance,
 * Keyboard and Alert), and the Expo modules that Expo Router itself imports
 * (constants, linking, splash screen, status bar, safe areas) resolve to the
 * practice phone's versions, so the router's headers, deep links and back
 * button behave as on a device.
 *
 * Writes src/academy/native/runtimeVersion.js with a hash of both files, so a
 * rebuilt runtime is never served from a stale cache.
 *
 * Run:  node scripts/nativeLabRuntime.mjs        (installs the workspace first if needed)
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE = join(ROOT, "scripts", "native-lab");
const NATIVE = join(ROOT, "src", "academy", "native");
const OUT = join(ROOT, "public", "lab");
mkdirSync(OUT, { recursive: true });

if (!existsSync(join(WORKSPACE, "node_modules", "expo-router"))) {
  console.log("installing the native lab workspace (scripts/native-lab)…");
  execSync("npm install --no-audit --no-fund --legacy-peer-deps", { cwd: WORKSPACE, stdio: "inherit" });
}
const { build } = await import(pathToFileURL(join(WORKSPACE, "node_modules", "esbuild", "lib", "main.js")).href);

/* Modules replaced by the practice phone's own, for every importer. */
const ALIASES = {
  "react-native": join(NATIVE, "rnInternal.js"),
  "react-native-safe-area-context": join(NATIVE, "safeArea.js"),
  "expo-constants": join(NATIVE, "alias", "constants.js"),
  "expo-linking": join(NATIVE, "alias", "linking.js"),
  "expo-splash-screen": join(NATIVE, "alias", "splash.js"),
  "expo-status-bar": join(NATIVE, "alias", "statusBar.js"),
  "@react-native/assets-registry/registry": join(NATIVE, "alias", "assetsRegistry.js"),
};

/** Expo Router's native variants of its linking, back button and history modules. */
const NATIVE_VARIANTS = /(useLinking|useBackButton|browserHistory|browserHistoryAdapter)$/;

const phonePlugin = {
  name: "practice-phone",
  setup(b) {
    // Expo's dev-server machinery (hot reload over a WebSocket) has no server here.
    b.onResolve({ filter: /async-require/ }, (args) => (/[\\/]expo[\\/]build/.test(args.importer) || args.path.startsWith("expo/") ? { path: args.path, namespace: "empty" } : undefined));
    b.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "export {}", loader: "js" }));

    b.onResolve({ filter: /^[^./]/ }, async (args) => {
      if (ALIASES[args.path] && !args.importer.startsWith(join(NATIVE, "alias")) && !(args.path === "react-native" && args.importer === ALIASES["react-native"])) {
        return { path: ALIASES[args.path] };
      }
      // Bare imports from the runtime's own files resolve in the pinned workspace.
      if (args.importer.startsWith(NATIVE) && !args.pluginData) {
        const r = await b.resolve(args.path, { resolveDir: WORKSPACE, kind: args.kind, pluginData: true });
        if (r.errors.length) return { errors: r.errors };
        return { path: r.path };
      }
      return undefined;
    });

    // React Native reads accessibilityState ({ checked, disabled, selected, expanded, busy });
    // react-native-web 0.21 only reads the aria-* forms. Map one to the other, so a
    // screen reader on the practice phone hears what VoiceOver and TalkBack would.
    b.onLoad({ filter: /react-native-web[\\/]dist[\\/]modules[\\/]createDOMProps[\\/]index\.js$/ }, async (args) => {
      const { readFile } = await import("node:fs/promises");
      const source = await readFile(args.path, "utf8");
      const anchor = "  if (!props) {\n    props = emptyObject;\n  }";
      if (!source.includes(anchor)) throw new Error("react-native-web's createDOMProps changed: update the accessibilityState mapping");
      const mapping =
        anchor +
        "\n  if (props.accessibilityState) {\n    var __s = props.accessibilityState, __a = {};\n" +
        "    for (var __k of ['checked', 'disabled', 'selected', 'expanded', 'busy']) if (__s[__k] !== undefined && props['aria-' + __k] == null) __a['aria-' + __k] = __s[__k];\n" +
        "    props = Object.assign({}, props, __a);\n  }";
      return { contents: source.replace(anchor, mapping), loader: "js" };
    });
    // ...and let accessibilityState through to createDOMProps in the first place.
    b.onLoad({ filter: /react-native-web[\\/]dist[\\/]modules[\\/]forwardedProps[\\/]index\.js$/ }, async (args) => {
      const { readFile } = await import("node:fs/promises");
      const source = await readFile(args.path, "utf8");
      const anchor = "  accessibilityChecked: true,";
      if (!source.includes(anchor)) throw new Error("react-native-web's forwardedProps changed: update the accessibilityState mapping");
      return { contents: source.replace(anchor, `${anchor}\n  accessibilityState: true,`), loader: "js" };
    });

    b.onResolve({ filter: /^\./ }, (args) => {
      if (!/expo-router[\\/]build/.test(args.importer)) return undefined;
      // The router's web SafeAreaProvider gives zero insets; the phone has real ones.
      if (/(^|\/)SafeAreaProvider$/.test(args.path)) return { path: join(NATIVE, "alias", "routerSafeArea.js") };
      if (!NATIVE_VARIANTS.test(args.path)) return undefined;
      const base = resolvePath(dirname(args.importer), args.path);
      return existsSync(`${base}.native.js`) ? { path: `${base}.native.js` } : undefined;
    });
  },
};

const result = await build({
  entryPoints: [join(NATIVE, "labRuntimeEntry.js")],
  outfile: join(OUT, "native-runtime.js"),
  absWorkingDir: WORKSPACE,
  nodePaths: [join(WORKSPACE, "node_modules")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: true,
  keepNames: true,
  legalComments: "none",
  resolveExtensions: [".web.tsx", ".web.ts", ".web.js", ".web.jsx", ".tsx", ".ts", ".jsx", ".js", ".json"],
  mainFields: ["browser", "module", "main"],
  conditions: ["browser", "import", "default"],
  loader: { ".js": "jsx", ".png": "dataurl", ".ttf": "dataurl" },
  jsx: "automatic",
  plugins: [phonePlugin],
  define: {
    "process.env.NODE_ENV": '"development"',
    "process.env.EXPO_OS": '"web"',
    "process.env.EXPO_ROUTER_APP_ROOT": '"app"',
    "process.env.EXPO_ROUTER_IMPORT_MODE": '"sync"',
    "process.env.EXPO_BASE_URL": '""',
    __DEV__: "true",
    global: "globalThis",
  },
  banner: { js: 'var process = globalThis.process || (globalThis.process = { env: { NODE_ENV: "development", EXPO_OS: "web" } });' },
  logLevel: "warning",
  metafile: true,
});
writeFileSync(join(WORKSPACE, "meta.json"), JSON.stringify(result.metafile));

/* SQLite: sql.js's loader with its WebAssembly binary inlined as base64. */
const sqlDir = join(WORKSPACE, "node_modules", "sql.js", "dist");
const wasm = readFileSync(join(sqlDir, "sql-wasm.wasm")).toString("base64");
writeFileSync(
  join(OUT, "sqlite.js"),
  `/* SQLite ${JSON.parse(readFileSync(join(WORKSPACE, "node_modules", "sql.js", "package.json"), "utf8")).version} (sql.js), MIT. Loaded by Mobile App Development labs that use SQLite. */\n` +
    readFileSync(join(sqlDir, "sql-wasm.js"), "utf8") +
    `\nwindow.initSqlJs = typeof initSqlJs !== "undefined" ? initSqlJs : window.initSqlJs;\nwindow.__sqliteWasm = "${wasm}";\n`
);

const hash = createHash("sha256")
  .update(readFileSync(join(OUT, "native-runtime.js")))
  .update(readFileSync(join(OUT, "sqlite.js")))
  .digest("hex")
  .slice(0, 12);
writeFileSync(
  join(NATIVE, "runtimeVersion.js"),
  `/** GENERATED by scripts/nativeLabRuntime.mjs. A hash of the practice phone's runtime files. */\nexport const NATIVE_RUNTIME_VERSION = "${hash}";\n`
);

const size = (name) => `${(readFileSync(join(OUT, name)).length / 1024).toFixed(0)} KB`;
console.log(`native-runtime.js ${size("native-runtime.js")}, sqlite.js ${size("sqlite.js")}, version ${hash}`);
