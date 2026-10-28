/**
 * Builds the Backend Engineering course's in-browser Node.js:
 *
 *   public/lab/node-runtime.js    src/academy/node/runtime/entry.js, bundled with
 *                                 the REAL npm packages pinned in scripts/node-lab
 *                                 (Express 5, zod, jsonwebtoken, bcryptjs, cors,
 *                                 helmet, cookie-parser, express-rate-limit,
 *                                 multer, dotenv, yaml, node-cron, node-postgres)
 *                                 and the lab's own Node built-ins.
 *
 * Every import of a Node built-in (fs, http, node:crypto …) from any module
 * in the bundle resolves to the lab's version in src/academy/node/runtime,
 * and the packages' free `process`, `Buffer` and `console` are the running
 * lab machine's (globals.js).
 *
 * Writes src/academy/node/runtimeVersion.js with a hash of the bundle, so a
 * rebuilt runtime is never served from a stale cache.
 *
 * Run:  node scripts/nodeLabRuntime.mjs        (installs the workspace first if needed)
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE = join(ROOT, "scripts", "node-lab");
const RUNTIME = join(ROOT, "src", "academy", "node", "runtime");
const OUT = join(ROOT, "public", "lab");
mkdirSync(OUT, { recursive: true });

if (!existsSync(join(WORKSPACE, "node_modules", "express"))) {
  console.log("installing the node lab workspace (scripts/node-lab)…");
  execSync("npm install --no-audit --no-fund", { cwd: WORKSPACE, stdio: "inherit" });
}
const { build } = await import(pathToFileURL(join(WORKSPACE, "node_modules", "esbuild", "lib", "main.js")).href);

/* Node built-in → the lab's module. */
const R = (f) => join(RUNTIME, f);
const BUILTIN = {
  fs: R("fs.js"),
  "fs/promises": R("builtin-fs-promises.js"),
  path: R("path.js"),
  "path/posix": R("path.js"),
  http: R("http.js"),
  https: R("builtin-https.js"),
  http2: R("builtin-unsupported.js"),
  events: R("events.js"),
  stream: R("stream.js"),
  "stream/promises": R("streamPromises.js"),
  "stream/web": R("builtin-stream-web.js"),
  buffer: R("buffer.js"),
  util: R("util.js"),
  "util/types": R("builtin-util-types.js"),
  crypto: R("crypto.js"),
  process: R("process.js"),
  "process/": R("process.js"),
  os: R("builtin-os.js"),
  net: R("builtin-net.js"),
  tls: R("builtin-net.js"),
  url: R("builtin-url.js"),
  querystring: R("builtin-querystring.js"),
  string_decoder: join(WORKSPACE, "node_modules", "string_decoder", "lib", "string_decoder.js"),
  assert: R("builtin-assert.js"),
  zlib: R("builtin-zlib.js"),
  readline: R("builtin-readline.js"),
  timers: R("builtin-timers.js"),
  "timers/promises": R("builtin-timers-promises.js"),
  dns: R("builtin-dns.js"),
  async_hooks: R("builtin-async-hooks.js"),
  perf_hooks: R("builtin-perf-hooks.js"),
  child_process: R("builtin-unsupported.js"),
  worker_threads: R("builtin-worker-threads.js"),
  cluster: R("builtin-unsupported.js"),
  tty: R("builtin-tty.js"),
  v8: R("builtin-v8.js"),
  vm: R("builtin-unsupported.js"),
  diagnostics_channel: R("builtin-diagnostics-channel.js"),
  constants: R("builtin-constants.js"),
  module: R("builtin-module.js"),
};

/* Small re-export files so packages can import a built-in by its own name. */
const SHIMS = {
  "builtin-fs-promises.js": `import { promises } from "./fs.js";\nexport default promises;\nexport const { readFile, writeFile, appendFile, mkdir, readdir, stat, lstat, unlink, rm, rmdir, rename, copyFile, access, realpath, mkdtemp, chmod, utimes, open } = promises;\n`,
  "builtin-https.js": `import { https } from "./http.js";\nexport default https;\nexport const { createServer, request, get, Agent, globalAgent, STATUS_CODES, METHODS } = https;\n`,
  "builtin-stream-web.js": `export const ReadableStream = globalThis.ReadableStream;\nexport const WritableStream = globalThis.WritableStream;\nexport const TransformStream = globalThis.TransformStream;\nexport const TextEncoderStream = globalThis.TextEncoderStream;\nexport const TextDecoderStream = globalThis.TextDecoderStream;\nexport default { ReadableStream, WritableStream, TransformStream, TextEncoderStream, TextDecoderStream };\n`,
  "builtin-util-types.js": `import { types } from "./util.js";\nexport default types;\n`,
  "builtin-os.js": `import { os } from "./builtins.js";\nexport default os;\nexport const { EOL, platform, type, release, hostname, homedir, tmpdir, endianness, cpus, availableParallelism, totalmem, freemem, uptime, loadavg, networkInterfaces, userInfo, constants, arch } = os;\n`,
  "builtin-net.js": `import { net } from "./builtins.js";\nexport default net;\nexport const { isIP, isIPv4, isIPv6, Socket, createServer, connect, createConnection } = net;\n`,
  "builtin-url.js": `import { url } from "./builtins.js";\nexport default url;\nexport const { URL, URLSearchParams, parse, format, resolve, Url, fileURLToPath, pathToFileURL, domainToASCII, urlToHttpOptions } = url;\n`,
  "builtin-querystring.js": `import { querystring } from "./builtins.js";\nexport default querystring;\nexport const { parse, stringify, escape, unescape, encode, decode } = querystring;\n`,
  "builtin-assert.js": `import { assert } from "./builtins.js";\nexport default assert;\nexport const { ok, strictEqual, deepStrictEqual, equal, deepEqual, notStrictEqual, throws, rejects, AssertionError, fail, match } = assert;\nexport const strict = assert.strict;\n`,
  "builtin-zlib.js": `import { zlib } from "./builtins.js";\nexport default zlib;\nexport const { gzipSync, gunzipSync, deflateSync, inflateSync, createGzip, createGunzip, createDeflate, createInflate, createInflateRaw, createDeflateRaw, createUnzip, createBrotliDecompress, constants, gzip, gunzip } = zlib;\n`,
  "builtin-readline.js": `import { readline } from "./builtins.js";\nexport default readline;\nexport const { createInterface, Interface, clearLine, cursorTo, moveCursor, emitKeypressEvents } = readline;\n`,
  "builtin-timers.js": `import { timers } from "./builtins.js";\nexport default timers;\nexport const { setTimeout, clearTimeout, setInterval, clearInterval, setImmediate, clearImmediate, promises } = timers;\n`,
  "builtin-timers-promises.js": `import { timersPromises } from "./builtins.js";\nexport default timersPromises;\nexport const { setTimeout, setImmediate, setInterval, scheduler } = timersPromises;\n`,
  "builtin-dns.js": `import { dns } from "./builtins.js";\nexport default dns;\nexport const { lookup, promises } = dns;\n`,
  "builtin-async-hooks.js": `import { asyncHooks } from "./builtins.js";\nexport default asyncHooks;\nexport const { AsyncLocalStorage, AsyncResource, createHook, executionAsyncId, triggerAsyncId } = asyncHooks;\n`,
  "builtin-perf-hooks.js": `import { perfHooks } from "./builtins.js";\nexport default perfHooks;\nexport const { performance, PerformanceObserver, monitorEventLoopDelay } = perfHooks;\n`,
  "builtin-worker-threads.js": `import { workerThreads } from "./builtins.js";\nexport default workerThreads;\nexport const { isMainThread, parentPort, workerData, threadId, Worker } = workerThreads;\n`,
  "builtin-tty.js": `import { tty } from "./builtins.js";\nexport default tty;\nexport const { isatty, ReadStream, WriteStream } = tty;\n`,
  "builtin-v8.js": `import { v8 } from "./builtins.js";\nexport default v8;\nexport const { getHeapStatistics, serialize, deserialize } = v8;\n`,
  "builtin-diagnostics-channel.js": `import { diagnosticsChannel } from "./builtins.js";\nexport default diagnosticsChannel;\nexport const { channel, hasSubscribers, subscribe, unsubscribe, tracingChannel } = diagnosticsChannel;\n`,
  "builtin-module.js": `import { ctx } from "./context.js";\nexport const createRequire = (from) => ctx.machine.modules.makeRequire({ id: String(from).replace("file://", ""), children: [] });\nexport const builtinModules = [];\nexport const isBuiltin = (name) => String(name).startsWith("node:");\nexport default { createRequire, builtinModules, isBuiltin };\n`,
  "builtin-constants.js": `export default { O_RDONLY: 0, O_WRONLY: 1, O_RDWR: 2, S_IFMT: 61440, S_IFREG: 32768, S_IFDIR: 16384 };\n`,
  "builtin-unsupported.js": `import { childProcess } from "./builtins.js";\nexport default childProcess;\nexport const fork = (...a) => childProcess.fork(...a);\nexport const spawn = (...a) => childProcess.spawn(...a);\nexport const exec = (...a) => childProcess.exec(...a);\nexport const execSync = (...a) => childProcess.execSync(...a);\nexport const isPrimary = true;\nexport const isMaster = true;\nexport const createContext = (...a) => childProcess.createContext(...a);\nexport const Script = function () { return childProcess.Script(); };\n`,
};
for (const [name, text] of Object.entries(SHIMS)) {
  const file = join(RUNTIME, name);
  if (!existsSync(file) || readFileSync(file, "utf8") !== text) writeFileSync(file, `// generated by scripts/nodeLabRuntime.mjs\n${text}`);
}

/* What CommonJS packages get from require("<built-in>"): the module's default export
   (require("stream") must be the Stream function, require("events") EventEmitter). */
const GEN = join(RUNTIME, "gen");
mkdirSync(GEN, { recursive: true });
const CJS = {};
for (const [name, target] of Object.entries(BUILTIN)) {
  if (target.includes("node_modules")) {
    CJS[name] = target;
    continue;
  }
  const file = join(GEN, `${name.replace(/[^a-z_]/g, "_")}.cjs`);
  const rel = `../${target.slice(RUNTIME.length + 1).replace(/\\/g, "/")}`;
  const text = `// generated by scripts/nodeLabRuntime.mjs
const m = require(${JSON.stringify(rel)});
module.exports = m && m.default !== undefined ? m.default : m;
`;
  if (!existsSync(file) || readFileSync(file, "utf8") !== text) writeFileSync(file, text);
  CJS[name] = file;
}

const EMPTY = new Set(["pg-native", "pg-cloudflare", "cloudflare:sockets", "fsevents"]);

/* Prisma (runtime/prisma.js, a chunk of its own) needs three adjustments. */
const PRISMA_SCHEMA_WASM = /prisma-schema-wasm[\\/]src[\\/]prisma_schema_build\.js$/;
const PRISMA_DYNAMIC_REQUIRE = /var __require = \/\* @__PURE__ \*\/ \(\(x\) => typeof require !== "undefined" \? require :[\s\S]*?is not supported'\);\r?\n\}\);/;
const prismaPlugin = {
  name: "node-lab-prisma",
  setup(b) {
    // @prisma/adapter-pg's node-postgres is the lab's, so Prisma reaches the lab's PostgreSQL.
    b.onResolve({ filter: /^pg$/ }, (args) => (/[\\/]@prisma[\\/]/.test(args.importer) ? { path: join(RUNTIME, "labPg.js") } : undefined));
    // The schema parser reads its WebAssembly from a file next to it: here the bytes are inlined.
    b.onLoad({ filter: PRISMA_SCHEMA_WASM }, (args) => {
      const source = readFileSync(args.path, "utf8");
      const wasm = readFileSync(join(dirname(args.path), "prisma_schema_build_bg.wasm")).toString("base64");
      const patched = source.replace(
        "const wasmBytes = require('fs').readFileSync(wasmPath);",
        `const wasmBytes = Buffer.from(${JSON.stringify(wasm)}, "base64");`
      );
      if (patched === source) throw new Error("prisma-schema-wasm changed: update the wasm inlining in scripts/nodeLabRuntime.mjs");
      return { contents: patched, loader: "js" };
    });
    // Prisma's packages are bundles with their own __require for Node's modules, which needs a global
    // require; here it asks the lab runtime for its built-in modules (entry.js, globalThis.__labRequire).
    b.onLoad({ filter: /[\\/]@prisma[\\/].*\.[cm]?js$/ }, (args) => {
      const source = readFileSync(args.path, "utf8");
      let patched = source;
      if (source.includes("Dynamic require of")) {
        patched = patched.replace(PRISMA_DYNAMIC_REQUIRE, "var __require = (x) => globalThis.__labRequire(x);");
        if (patched === source) throw new Error(`${args.path}: Prisma's __require changed: update PRISMA_DYNAMIC_REQUIRE in scripts/nodeLabRuntime.mjs`);
      }
      // eval("__dirname") hides the identifier from the bundler: give those the same path as the define below.
      patched = patched
        .split("eval(`require('path').join(__dirname, '..')`)").join('"/app/node_modules"')
        .split('eval("__dirname")').join('"/app/node_modules/.lab"');
      return patched === source ? undefined : { contents: patched, loader: "js" };
    });
    // Prisma imports TypeScript only to print its version.
    b.onResolve({ filter: /^typescript$/ }, (args) => (/[\\/]@prisma[\\/]/.test(args.importer) ? { path: "typescript", namespace: "empty" } : undefined));
    // Config files are loaded by the lab's own module system; Prisma's loader for them (c12, jiti) is never used.
    b.onResolve({ filter: /^(c12|jiti)$/ }, (args) => ({ path: args.path, namespace: "empty" }));
  },
};

const labPlugin = {
  name: "node-lab",
  setup(b) {
    b.onResolve({ filter: /^(node:)?[a-z_/]+\/?$/ }, (args) => {
      const name = args.path.replace(/^node:/, "");
      if (EMPTY.has(name)) return { path: name, namespace: "empty" };
      // The lab's own built-in files import the npm packages they wrap by subpath; only bare names are built-ins.
      if (Object.prototype.hasOwnProperty.call(BUILTIN, name)) {
        if (args.importer === BUILTIN[name]) return undefined;
        // readable-stream looks for Node's own stream only to defer to it; there is none here.
        if (name === "stream" && /readable-stream/.test(args.importer)) return { path: "stream", namespace: "empty" };
        // ES modules in the bundle import the ESM file; CommonJS require() gets the default export.
        return { path: args.kind === "require-call" ? CJS[name] : BUILTIN[name] };
      }
      return undefined;
    });
    // fflate's "node" build loads worker_threads; the browser build is the same code without it.
    b.onResolve({ filter: /^fflate$/ }, () => ({ path: join(WORKSPACE, "node_modules", "fflate", "esm", "browser.js") }));
    b.onResolve({ filter: /^(pg-native|pg-cloudflare|cloudflare:sockets|fsevents)$/ }, (args) => ({ path: args.path, namespace: "empty" }));
    b.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "module.exports = {};", loader: "js" }));
    // Bare imports from the runtime's own files resolve in the pinned workspace.
    b.onResolve({ filter: /^[^./]/ }, async (args) => {
      if (args.pluginData?.fromLab || !args.importer.startsWith(RUNTIME)) return undefined;
      const r = await b.resolve(args.path, { resolveDir: WORKSPACE, kind: args.kind, pluginData: { fromLab: true } });
      if (r.errors.length) return { errors: r.errors };
      return { path: r.path };
    });
  },
};

// Chunks from earlier builds (their names carry a content hash).
for (const f of readdirSync(OUT)) if (/^node-runtime-chunk-.*\.js$/.test(f)) rmSync(join(OUT, f));
const result = await build({
  entryPoints: { "node-runtime": join(RUNTIME, "entry.js") },
  outdir: OUT,
  splitting: true,
  chunkNames: "node-runtime-chunk-[hash]",
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  mainFields: ["module", "main"],
  conditions: ["node"],
  nodePaths: [join(WORKSPACE, "node_modules")],
  inject: [join(RUNTIME, "globals.js")],
  // Packages that locate their own files (node-cron) see a file: URL, as on a server.
  define: {
    global: "globalThis",
    Buffer: "globalThis.__labBuffer",
    // Bundled CommonJS packages that look at their own location see a path in node_modules, as on a server.
    __dirname: JSON.stringify("/app/node_modules/.lab"),
    __filename: JSON.stringify("/app/node_modules/.lab/runtime.js"),
    "process.env.NODE_DEBUG": "undefined", "import.meta.url": JSON.stringify("file:///app/node_modules/.lab/runtime.js") },
  plugins: [prismaPlugin, labPlugin],
  keepNames: true,
  minify: !process.argv.includes("--dev"),
  legalComments: "none",
  metafile: true,
  logLevel: "warning",
});

/* ── public/lab/node-typescript.js: tsc for labs that type-check ──────── */
const { collectTypeFiles } = await import(pathToFileURL(join(ROOT, "lib", "academy", "node", "typeFiles.mjs")).href);
const TS_DIR = join(ROOT, "src", "academy", "node", "typescript");
const typesJson = JSON.stringify(collectTypeFiles());
writeFileSync(join(TS_DIR, "gen-types.json"), typesJson);
const NODE_ONLY = /^(fs|path|os|inspector|perf_hooks|crypto|buffer|module|child_process|readline|worker_threads|url|util|stream|events|assert|v8|net|tty|node:.*)$/;
// The TypeScript bundle is large and slow to minify: rebuild it only when its inputs change.
const tsInputs = createHash("sha256")
  .update(typesJson)
  .update(readFileSync(join(TS_DIR, "tsEntry.js")))
  .update(readFileSync(join(TS_DIR, "bundle.js")))
  .update(readFileSync(join(WORKSPACE, "node_modules", "typescript", "package.json")))
  .update(String(!process.argv.includes("--dev")))
  .digest("hex");
const tsStamp = join(OUT, "node-typescript.inputs");
const tsFresh = existsSync(join(OUT, "node-typescript.js")) && existsSync(tsStamp) && readFileSync(tsStamp, "utf8") === tsInputs;
if (!tsFresh) await build({
  entryPoints: [join(TS_DIR, "bundle.js")],
  outfile: join(OUT, "node-typescript.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  mainFields: ["main"],
  nodePaths: [join(WORKSPACE, "node_modules")],
  plugins: [
    {
      name: "typescript-in-a-worker",
      setup(b) {
        // The compiler only touches Node's modules when it runs as the tsc command; here it never does.
        b.onResolve({ filter: NODE_ONLY }, (args) => ({ path: args.path, namespace: "empty" }));
        b.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "module.exports = {};", loader: "js" }));
        b.onResolve({ filter: /^typescript$/ }, () => ({ path: join(WORKSPACE, "node_modules", "typescript", "lib", "typescript.js") }));
      },
    },
  ],
  // The compiler sets itself up as the tsc command when it sees Node; it is a library here.
  define: { "process.env.NODE_ENV": '"production"', "process.browser": "true" },
  minify: !process.argv.includes("--dev"),
  legalComments: "none",
  logLevel: "warning",
});

writeFileSync(tsStamp, tsInputs);

const bundle = readFileSync(join(OUT, "node-runtime.js"));
const hash = createHash("sha256").update(bundle).digest("hex").slice(0, 12);
const tsBundle = readFileSync(join(OUT, "node-typescript.js"));
const tsHash = createHash("sha256").update(tsBundle).digest("hex").slice(0, 12);
writeFileSync(
  join(ROOT, "src", "academy", "node", "runtimeVersion.js"),
  `// generated by scripts/nodeLabRuntime.mjs\nexport const NODE_RUNTIME_VERSION = "${hash}";\nexport const NODE_TYPESCRIPT_VERSION = "${tsHash}";\n`
);
const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`public/lab/node-runtime.js  ${kb(bundle.length)}  (${hash})`);
console.log(`public/lab/node-typescript.js  ${kb(tsBundle.length)}  (${tsHash})`);
if (process.argv.includes("--analyze")) {
  const inputs = Object.entries(result.metafile.outputs[Object.keys(result.metafile.outputs)[0]].inputs)
    .map(([f, v]) => [f.replace(/.*node_modules[\\/]/, ""), v.bytesInOutput])
    .reduce((acc, [f, n]) => {
      const pkg = f.startsWith("@") ? f.split(/[\\/]/).slice(0, 2).join("/") : f.split(/[\\/]/)[0];
      acc[pkg] = (acc[pkg] || 0) + n;
      return acc;
    }, {});
  for (const [pkg, n] of Object.entries(inputs).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`  ${pkg.padEnd(40)} ${kb(n)}`);
}
