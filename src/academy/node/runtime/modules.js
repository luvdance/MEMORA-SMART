/**
 * THE MODULE LOADER — require() and import, as Node 24 does them.
 *
 *   · .cjs files, and .js files when package.json has no "type": "module",
 *     are CommonJS: require, module.exports, __dirname, extension lookup
 *     (./db → ./db.js, ./routes → ./routes/index.js), JSON files.
 *   · .mjs files, and .js files under "type": "module", are ES modules:
 *     import/export, top-level await, import.meta.dirname, exact paths
 *     (./db fails; ./db.js works, with Node's "Did you mean" hint), named
 *     imports checked ("does not provide an export named"), and require /
 *     __dirname undefined, with Node's ReferenceError.
 *   · .ts/.mts/.cts files run as Node 24 runs them: types are stripped
 *     (sucrase) and nothing else changes, so `import type` is needed for
 *     type-only imports, exactly as with Node's type stripping.
 *
 * Packages come from the lab's bundle (real Express, zod, jsonwebtoken …),
 * but only when package.json lists them: a missing dependency fails with
 * "Cannot find module 'express'", as it does before `npm install`.
 */
import { transform } from "sucrase";
import * as acorn from "acorn";
import pathMod from "./path.js";
import { ctx } from "./context.js";

function codeError(code, message, Type = Error) {
  const err = new Type(message);
  err.code = code;
  return err;
}

/*
 * Errors raised inside Node's module loader print the loader's own location
 * and frames above the caller's. Copied from Node 24.14.1's real output.
 */
const L = (s) => s.split("\n").map((f) => `    at ${f}`);
const LOADER = {
  cjsNotFound: {
    header: "node:internal/modules/cjs/loader:1459\n  throw err;\n  ^",
    frames: L("Module._resolveFilename (node:internal/modules/cjs/loader:1456:15)\ndefaultResolveImpl (node:internal/modules/cjs/loader:1066:19)\nresolveForCJSWithHooks (node:internal/modules/cjs/loader:1071:22)\nModule._load (node:internal/modules/cjs/loader:1242:25)\nwrapModuleLoad (node:internal/modules/cjs/loader:255:19)\nModule.require (node:internal/modules/cjs/loader:1556:12)\nrequire (node:internal/modules/helpers:152:16)"),
  },
  esmPackage: {
    header: "node:internal/modules/package_json_reader:301\n  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);\n        ^",
    frames: L("Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)\npackageResolve (node:internal/modules/esm/resolve:768:81)\nmoduleResolve (node:internal/modules/esm/resolve:859:18)\ndefaultResolve (node:internal/modules/esm/resolve:991:11)\n#cachedDefaultResolve (node:internal/modules/esm/loader:719:20)\n#resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:736:38)\nModuleLoader.resolveSync (node:internal/modules/esm/loader:765:52)\n#resolve (node:internal/modules/esm/loader:701:17)\nModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:621:35)\nModuleJob.syncLink (node:internal/modules/esm/module_job:160:33)"),
  },
  esmFile: {
    header: "node:internal/modules/run_main:107\n    triggerUncaughtException(\n    ^",
    frames: L("finalizeResolution (node:internal/modules/esm/resolve:275:11)\nmoduleResolve (node:internal/modules/esm/resolve:865:10)\ndefaultResolve (node:internal/modules/esm/resolve:991:11)\n#cachedDefaultResolve (node:internal/modules/esm/loader:719:20)\n#resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:736:38)\nModuleLoader.resolveSync (node:internal/modules/esm/loader:765:52)\n#resolve (node:internal/modules/esm/loader:701:17)\nModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:621:35)\nModuleJob.syncLink (node:internal/modules/esm/module_job:160:33)\nModuleJob.link (node:internal/modules/esm/module_job:245:17)"),
  },
  requireAsync: {
    header: "node:internal/modules/esm/module_job:530\n      throw new ERR_REQUIRE_ASYNC_MODULE(filename, parentFilename);\n      ^",
    frames: L("ModuleJobSync.runSync (node:internal/modules/esm/module_job:530:13)\nModuleLoader.importSyncForRequire (node:internal/modules/esm/loader:388:47)\nloadESMFromCJS (node:internal/modules/cjs/loader:1629:24)\nModule._compile (node:internal/modules/cjs/loader:1794:5)\nObject..js (node:internal/modules/cjs/loader:1943:10)\nModule.load (node:internal/modules/cjs/loader:1533:32)\nModule._load (node:internal/modules/cjs/loader:1335:12)\nwrapModuleLoad (node:internal/modules/cjs/loader:255:19)\nModule.require (node:internal/modules/cjs/loader:1556:12)\nrequire (node:internal/modules/helpers:152:16)"),
  },
};

/** Give a loader error Node's stack: "Error [CODE]: …", the loader's frames, then the caller's. */
function loaderError(err, kind) {
  const spec = LOADER[kind];
  const userFrames = String(err.stack || "").split("\n").filter((l) => /^\s+at\s/.test(l));
  const head = err.code && err.code.startsWith("ERR_") ? `${err.name} [${err.code}]: ${err.message}` : `${err.name}: ${err.message}`;
  Object.defineProperty(err, "stack", { value: [head, ...[...spec.frames, ...userFrames].slice(0, 10)].join("\n"), writable: true, configurable: true });
  Object.defineProperty(err, "labInternal", { value: spec.header, configurable: true });
  return err;
}

/* ── A light scanner: code outside strings, comments and templates ───── */

/**
 * Calls onIdent(name, start) for each identifier in CODE (not in strings,
 * comments, regex literals or template text; template ${…} is code).
 */
function scanIdentifiers(src, onIdent) {
  let i = 0;
  const n = src.length;
  const braceStack = [];
  let prevSignificant = "";
  const isIdStart = (c) => /[A-Za-z_$]/.test(c);
  const isId = (c) => /[A-Za-z0-9_$]/.test(c);
  let lastWord = "";
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && d === "*") {
      i = src.indexOf("*/", i + 2);
      i = i === -1 ? n : i + 2;
      continue;
    }
    if (c === "'" || c === '"') {
      i++;
      while (i < n && src[i] !== c) {
        if (src[i] === "\\") i++;
        i++;
      }
      i++;
      prevSignificant = "a";
      continue;
    }
    if (c === "`") {
      i++;
      for (;;) {
        if (i >= n) break;
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "`") {
          i++;
          break;
        }
        if (src[i] === "$" && src[i + 1] === "{") {
          braceStack.push("tpl");
          i += 2;
          break;
        }
        i++;
      }
      prevSignificant = "a";
      continue;
    }
    if (c === "}" && braceStack.length && braceStack[braceStack.length - 1] === "tpl") {
      braceStack.pop();
      // continue the template
      i++;
      for (;;) {
        if (i >= n) break;
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "`") {
          i++;
          break;
        }
        if (src[i] === "$" && src[i + 1] === "{") {
          braceStack.push("tpl");
          i += 2;
          break;
        }
        i++;
      }
      prevSignificant = "a";
      continue;
    }
    if (c === "{") braceStack.push("{");
    if (c === "}") braceStack.pop();
    if (c === "/") {
      // A regex literal can start where an expression is expected.
      const regexOk = !prevSignificant || /[(,=:[!&|?{};+\-*%<>~^]/.test(prevSignificant) || ["return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "yield", "await"].includes(lastWord);
      if (regexOk) {
        i++;
        let inClass = false;
        while (i < n) {
          const ch = src[i];
          if (ch === "\\") {
            i += 2;
            continue;
          }
          if (ch === "[") inClass = true;
          else if (ch === "]") inClass = false;
          else if (ch === "/" && !inClass) break;
          else if (ch === "\n") break;
          i++;
        }
        i++;
        while (i < n && isId(src[i])) i++;
        prevSignificant = "a";
        continue;
      }
    }
    if (isIdStart(c)) {
      const start = i;
      while (i < n && isId(src[i])) i++;
      const word = src.slice(start, i);
      onIdent(word, start, i);
      lastWord = word;
      prevSignificant = "a";
      continue;
    }
    if (!/\s/.test(c)) {
      prevSignificant = c;
      lastWord = "";
    }
    i++;
  }
}

/** Replace free uses of identifiers in code (not property names, not object keys). */
function replaceFree(src, map) {
  const edits = [];
  scanIdentifiers(src, (word, start, end) => {
    if (!Object.prototype.hasOwnProperty.call(map, word)) return;
    let j = start - 1;
    while (j >= 0 && /\s/.test(src[j])) j--;
    if (src[j] === "." && src[j - 1] !== ".") return; // obj.require
    let k = end;
    while (k < src.length && /[ \t]/.test(src[k])) k++;
    if (src[k] === ":" && src[k + 1] !== ":" && /[{,]\s*$/.test(src.slice(Math.max(0, start - 40), start))) return; // { require: … }
    edits.push([start, end, map[word]]);
  });
  let out = src;
  for (const [s, e, r] of edits.reverse()) out = out.slice(0, s) + r + out.slice(e);
  return out;
}

/** The named imports of an ES module source: [{ names: [...], spec, line, column, hasAttributes }]. */
function importsOf(src) {
  const masked = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(m.length - p.length));
  const out = [];
  const re = /(^|[;\n])\s*import\s+(type\s+)?([\w$]+\s*,?\s*)?(\{[^}]*\}|\*\s*as\s+[\w$]+)?\s*(from\s*)?(['"])([^'"\n]+)\6(\s*(?:with|assert)\s*\{[^}]*\})?/g;
  let m;
  while ((m = re.exec(masked))) {
    if (m[2]) continue; // import type
    const names = [];
    if (m[4] && m[4].startsWith("{")) {
      for (const part of m[4].slice(1, -1).split(",")) {
        const p = part.trim();
        if (!p || p.startsWith("type ")) continue;
        names.push(p.split(/\s+as\s+/)[0].trim());
      }
    }
    if (m[3] && m[3].replace(/[\s,]/g, "")) names.unshift("default");
    const index = m.index + m[1].length;
    const before = src.slice(0, index);
    const line = before.split("\n").length;
    const lineStart = before.lastIndexOf("\n") + 1;
    const namesAt = names.length && m[4] ? src.indexOf(m[4], index) + 2 - lineStart : index - lineStart;
    out.push({ names, spec: m[7], line, column: namesAt, attributes: m[8] || "" });
  }
  return out;
}

/* ── Errors as Node words them ──────────────────────────────────────── */

export class ModuleSyntaxError extends SyntaxError {
  constructor(message, file, line, column, lineText, esm, caretLength = 1) {
    super(message);
    const hidden = { labFile: file, labLine: line, labColumn: column, labLineText: lineText, labEsm: esm, labCaret: caretLength };
    for (const [k, v] of Object.entries(hidden)) Object.defineProperty(this, k, { value: v, configurable: true });
  }
}

/* ── The loader ─────────────────────────────────────────────────────── */

const BUILTIN_NAMES = [
  "assert", "assert/strict", "async_hooks", "buffer", "child_process", "cluster", "console", "crypto", "diagnostics_channel",
  "dns", "dns/promises", "events", "fs", "fs/promises", "http", "https", "module", "net", "os", "path", "path/posix",
  "perf_hooks", "process", "querystring", "readline", "readline/promises", "stream", "stream/promises", "string_decoder",
  "timers", "timers/promises", "tty", "url", "util", "util/types", "v8", "worker_threads", "zlib",
];

export class Module {
  constructor(id, kind) {
    this.id = id;
    this.filename = id;
    this.path = pathMod.dirname(id);
    this.kind = kind; // "cjs" | "esm" | "json" | "builtin" | "package"
    this.exports = {};
    this.loaded = false;
    this.children = [];
    this.parent = null;
    this.evaluation = null; // promise for ESM
    this.error = null;
  }
}

export class ModuleSystem {
  /**
   * machine: { vol, cwd, builtin(name), packages: { name: () => exports },
   *            globals(module) → { name: value } injected into every module }
   */
  constructor(machine, { strictDependencies = true } = {}) {
    this.machine = machine;
    this.cache = new Map();
    this.strictDependencies = strictDependencies;
  }

  vol() {
    return this.machine.vol;
  }

  exists(p) {
    const n = this.vol().node(p);
    return n && n.type === "file";
  }
  isDir(p) {
    return this.vol().node(p)?.type === "dir";
  }
  read(p) {
    return this.vol().node(p).data.toString("utf8");
  }

  /** The package.json that governs a file (nearest one up the tree). */
  packageScope(file) {
    let dir = pathMod.dirname(file);
    for (;;) {
      const pj = pathMod.join(dir, "package.json");
      if (this.exists(pj)) {
        try {
          return { dir, json: JSON.parse(this.read(pj)) };
        } catch {
          return { dir, json: {} };
        }
      }
      if (dir === "/") return { dir: "/", json: {} };
      dir = pathMod.dirname(dir);
    }
  }

  formatOf(file) {
    if (file.endsWith(".mjs") || file.endsWith(".mts")) return "esm";
    if (file.endsWith(".cjs") || file.endsWith(".cts")) return "cjs";
    if (file.endsWith(".json")) return "json";
    return this.packageScope(file).json.type === "module" ? "esm" : "cjs";
  }

  dependencyListed(name, fromFile) {
    if (!this.strictDependencies) return true;
    const { json } = this.packageScope(fromFile);
    return Boolean(json.dependencies?.[name] || json.devDependencies?.[name] || json.optionalDependencies?.[name]);
  }

  packageName(spec) {
    const parts = spec.split("/");
    return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
  }

  /**
   * Resolve a specifier. Returns { kind: "builtin"|"package"|"file", id }.
   * Throws Node's error when it cannot be found.
   */
  resolve(spec, fromFile, mode) {
    const from = fromFile || pathMod.join(this.machine.cwd, "[eval]");
    if (spec.startsWith("node:")) {
      const name = spec.slice(5);
      if (BUILTIN_NAMES.includes(name) || name === "test" || name === "sqlite") return { kind: "builtin", id: name };
      throw codeError("ERR_UNKNOWN_BUILTIN_MODULE", `No such built-in module: ${spec}`);
    }
    if (BUILTIN_NAMES.includes(spec)) return { kind: "builtin", id: spec };
    if (spec.startsWith("file://")) spec = decodeURIComponent(new URL(spec).pathname);
    const relative = spec.startsWith("./") || spec.startsWith("../") || spec.startsWith("/") || spec === "." || spec === "..";
    if (!relative) {
      if (spec.startsWith("#")) return this.resolveImports(spec, from, mode);
      const name = this.packageName(spec);
      const pkgs = this.machine.packages;
      const known = Object.prototype.hasOwnProperty.call(pkgs, spec) || Object.prototype.hasOwnProperty.call(pkgs, name);
      if (known && this.dependencyListed(name, from)) return { kind: "package", id: Object.prototype.hasOwnProperty.call(pkgs, spec) ? spec : name };
      if (mode === "esm") {
        throw loaderError(codeError("ERR_MODULE_NOT_FOUND", `Cannot find package '${name}' imported from ${from}`), "esmPackage");
      }
      const err = new Error(`Cannot find module '${spec}'\nRequire stack:\n- ${from}`);
      err.code = "MODULE_NOT_FOUND";
      err.requireStack = [from];
      throw loaderError(err, "cjsNotFound");
    }
    const base = pathMod.resolve(pathMod.dirname(from), spec);
    if (mode === "esm") {
      if (this.exists(base)) return { kind: "file", id: base };
      if (this.isDir(base)) {
        throw codeError("ERR_UNSUPPORTED_DIR_IMPORT", `Directory import '${base}' is not supported resolving ES modules imported from ${from}`);
      }
      let hint = "";
      for (const ext of [".js", ".ts", ".mjs", ".cjs", ".json"]) {
        if (this.exists(base + ext)) {
          hint = `\nDid you mean to import "${spec}${ext}"?`;
          break;
        }
      }
      if (!hint && this.exists(pathMod.join(base, "index.js"))) hint = `\nDid you mean to import "${spec.replace(/\/$/, "")}/index.js"?`;
      const nf = codeError("ERR_MODULE_NOT_FOUND", `Cannot find module '${base}' imported from ${from}${hint}`);
      nf.url = `file://${base}`;
      throw loaderError(nf, "esmFile");
    }
    const tries = [base, `${base}.js`, `${base}.json`, `${base}.node`];
    for (const t of tries) if (this.exists(t)) return { kind: "file", id: t };
    if (this.isDir(base)) {
      const pj = pathMod.join(base, "package.json");
      if (this.exists(pj)) {
        try {
          const main = JSON.parse(this.read(pj)).main;
          if (main) {
            const m = pathMod.resolve(base, main);
            for (const t of [m, `${m}.js`, `${m}.json`, pathMod.join(m, "index.js")]) if (this.exists(t)) return { kind: "file", id: t };
          }
        } catch {
          /* fall through */
        }
      }
      for (const t of [pathMod.join(base, "index.js"), pathMod.join(base, "index.json")]) if (this.exists(t)) return { kind: "file", id: t };
    }
    const err = new Error(`Cannot find module '${spec}'\nRequire stack:\n- ${from}`);
    err.code = "MODULE_NOT_FOUND";
    err.requireStack = [from];
    throw loaderError(err, "cjsNotFound");
  }

  /** package.json "imports" (#db → ./src/db.js), Node's subpath imports. */
  resolveImports(spec, from, mode) {
    const { dir, json } = this.packageScope(from);
    const map = json.imports || {};
    let target = map[spec];
    if (target === undefined) {
      for (const [k, v] of Object.entries(map)) {
        if (k.endsWith("*") && spec.startsWith(k.slice(0, -1))) {
          const rest = spec.slice(k.length - 1);
          const t = typeof v === "string" ? v : v.default || v.node || v.import || v.require;
          target = t.replace("*", rest);
          break;
        }
      }
    }
    if (target && typeof target === "object") target = target.default || target.node || target.import || target.require;
    if (typeof target !== "string") {
      throw codeError("ERR_PACKAGE_IMPORT_NOT_DEFINED", `Package import specifier "${spec}" is not defined in package ${pathMod.join(dir, "package.json")} imported from ${from}`, TypeError);
    }
    return this.resolve(pathMod.resolve(dir, target), from, mode);
  }

  /* ── Loading ───────────────────────────────────────────────────── */

  builtinModule(id) {
    const key = `node:${id}`;
    let m = this.cache.get(key);
    if (!m) {
      m = new Module(key, "builtin");
      m.exports = this.machine.builtin(id);
      m.loaded = true;
      this.cache.set(key, m);
    }
    return m;
  }

  packageModule(id) {
    const key = `pkg:${id}`;
    let m = this.cache.get(key);
    if (!m) {
      m = new Module(key, "package");
      m.exports = this.machine.packages[id]();
      m.loaded = true;
      this.cache.set(key, m);
    }
    return m;
  }

  /** Synchronous require (CommonJS, and require(esm) without top-level await). */
  requireFrom(spec, fromFile, parent) {
    const r = this.resolve(spec, fromFile, "cjs");
    const mocked = this.mockHook?.(spec, fromFile, r.id);
    if (mocked) return mocked;
    if (r.kind === "builtin") return this.builtinModule(r.id).exports;
    if (r.kind === "package") return this.packageModule(r.id).exports;
    let m = this.cache.get(r.id);
    if (m) {
      if (m.kind === "esm" && m.evaluation && !m.loaded && !m.error) {
        if (m.tla) throw loaderError(codeError("ERR_REQUIRE_ASYNC_MODULE", `require() cannot be used on an ESM graph with top-level await. Use import() instead. To see where the top-level await comes from, use --experimental-print-required-tla.\n  From ${fromFile} \n  Requiring ${r.id} `), "requireAsync");
      }
      if (m.error) throw m.error;
      return m.exports;
    }
    m = this.instantiate(r.id, parent);
    this.evaluateSync(m, fromFile);
    return m.exports;
  }

  instantiate(id, parent) {
    const kind = this.formatOf(id);
    const m = new Module(id, kind);
    m.parent = parent || null;
    if (parent) parent.children.push(m);
    this.cache.set(id, m);
    return m;
  }

  evaluateSync(m, fromFile) {
    if (m.kind === "json") {
      const text = this.read(m.id);
      try {
        m.exports = JSON.parse(text);
      } catch (err) {
        this.cache.delete(m.id);
        const e = new SyntaxError(`${m.id}: ${err.message}`);
        throw e;
      }
      m.loaded = true;
      return;
    }
    if (m.kind === "esm") {
      const compiled = this.compile(m);
      if (compiled.tla) {
        m.tla = true;
        throw loaderError(codeError("ERR_REQUIRE_ASYNC_MODULE", `require() cannot be used on an ESM graph with top-level await. Use import() instead. To see where the top-level await comes from, use --experimental-print-required-tla.\n  From ${fromFile} \n  Requiring ${m.id} `), "requireAsync");
      }
      // No top-level await: the module body runs to completion synchronously.
      const p = this.runCompiled(m, compiled);
      m.evaluation = p;
      p.catch(() => {});
      if (m.error) throw m.error;
      return;
    }
    const compiled = this.compile(m);
    try {
      compiled.fn.call(m.exports, ...this.args(m, compiled));
      m.loaded = true;
    } catch (err) {
      this.cache.delete(m.id);
      throw err;
    }
  }

  /** Asynchronous import (ESM entry points, import(), import declarations). */
  async importFrom(spec, fromFile) {
    const r = this.resolve(spec, fromFile, "esm");
    const mocked = this.mockHook?.(spec, fromFile, r.id);
    if (mocked) {
      const fake = new Module(`mock:${r.id}`, "esm");
      fake.exports = mocked;
      fake.loaded = true;
      return fake;
    }
    if (r.kind === "builtin") return this.builtinModule(r.id);
    if (r.kind === "package") return this.packageModule(r.id);
    let m = this.cache.get(r.id);
    if (m) {
      if (m.evaluation) await m.evaluation.catch(() => {});
      if (m.error) throw m.error;
      return m;
    }
    m = this.instantiate(r.id, null);
    if (m.kind === "json") {
      this.evaluateSync(m, fromFile);
      return m;
    }
    if (m.kind === "cjs") {
      this.evaluateSync(m, fromFile);
      return m;
    }
    const compiled = this.compile(m);
    m.evaluation = (async () => {
      // Dependencies first, as ES modules are linked before they run.
      for (const imp of compiled.imports) {
        const dep = await this.importFrom(imp.spec, m.id);
        if (dep.kind === "json" && !/type\s*:\s*['"]json['"]/.test(imp.attributes)) {
          throw codeError("ERR_IMPORT_ATTRIBUTE_MISSING", `Module "file://${dep.id}" needs an import attribute of "type: json"`, TypeError);
        }
        if (dep.kind === "esm") {
          for (const name of imp.names) {
            if (!(name in dep.exports)) {
              const lines = compiled.source.split("\n");
              throw new ModuleSyntaxError(`The requested module '${imp.spec}' does not provide an export named '${name}'`, m.id, imp.line, imp.column, lines[imp.line - 1], true, name.length);
            }
          }
        }
      }
      return this.runCompiled(m, compiled);
    })();
    try {
      await m.evaluation;
    } catch (err) {
      m.error = err;
      throw err;
    }
    return m;
  }

  /** The values a module's wrapper function receives. */
  args(m, compiled) {
    const req = this.makeRequire(m);
    const g = this.machine.moduleGlobals(m);
    const base = [m.exports, req, m, m.id, pathMod.dirname(m.id)];
    if (compiled.esm) {
      const meta = {
        url: `file://${m.id}`,
        filename: m.id,
        dirname: pathMod.dirname(m.id),
        resolve: (s) => {
          const r = this.resolve(s, m.id, "esm");
          return r.kind === "file" ? `file://${r.id}` : r.kind === "builtin" ? `node:${r.id}` : r.id;
        },
      };
      base.push(meta, (spec) => this.dynamicImport(spec, m.id), (name) => this.noCommonJs(name));
    }
    return [...base, ...compiled.globalNames.map((n) => g[n])];
  }

  noCommonJs(name) {
    throw new ReferenceError(`${name} is not defined in ES module scope, you can use import instead`);
  }

  async dynamicImport(spec, fromFile) {
    const m = await this.importFrom(spec, fromFile);
    if (m.kind === "esm") return m.exports;
    // import() of CommonJS or JSON: { default: module.exports, ...named }
    const ex = m.exports;
    const ns = { default: ex };
    if (ex && (typeof ex === "object" || typeof ex === "function") && m.kind !== "json") for (const k of Object.keys(ex)) if (k !== "default") ns[k] = ex[k];
    if (m.kind === "package" && ex && ex.__esModule) return ex;
    return ns;
  }

  makeRequire(m) {
    const req = (spec) => {
      if (typeof spec !== "string") {
        throw codeError("ERR_INVALID_ARG_TYPE", `The "id" argument must be of type string. Received ${spec === undefined ? "undefined" : typeof spec}`, TypeError);
      }
      return this.requireFrom(spec, m.id, m);
    };
    req.resolve = (spec) => {
      const r = this.resolve(spec, m.id, "cjs");
      return r.kind === "file" ? r.id : r.kind === "builtin" ? (spec.startsWith("node:") ? spec : r.id) : `/app/node_modules/${r.id}/index.js`;
    };
    req.cache = new Proxy({}, { get: (_, k) => this.cache.get(k), deleteProperty: (_, k) => this.cache.delete(k), ownKeys: () => [...this.cache.keys()].filter((k) => k.startsWith("/")), getOwnPropertyDescriptor: (_, k) => (this.cache.has(k) ? { enumerable: true, configurable: true, value: this.cache.get(k) } : undefined) });
    req.main = this.main;
    return req;
  }

  /** Transform and wrap a file's source. */
  compile(m) {
    const source = this.sourceHook ? this.sourceHook(m.id, this.read(m.id)) : this.read(m.id);
    const esm = m.kind === "esm";
    const ts = /\.(c|m)?ts$/.test(m.id);
    let code = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
    if (code.startsWith("#!")) code = `//${code.slice(2)}`;
    let imports = [];
    if (esm) {
      imports = importsOf(code);
      // In an ES module, require / module / exports / __dirname / __filename do not exist.
      code = replaceFree(code, {
        require: '__labNoCjs("require")',
        module: '__labNoCjs("module")',
        exports: '__labNoCjs("exports")',
        __dirname: '__labNoCjs("__dirname")',
        __filename: '__labNoCjs("__filename")',
      });
    }
    let out;
    let map = null;
    try {
      const transforms = [...(esm ? ["imports"] : []), ...(ts ? ["typescript"] : [])];
      const r = transform(code, {
        transforms,
        preserveDynamicImport: true,
        keepUnusedImports: true,
        disableESTransforms: true,
        filePath: m.id,
        ...(transforms.length ? { sourceMapOptions: { compiledFilename: m.id } } : {}),
      });
      out = r.code;
      map = r.sourceMap || null;
    } catch (err) {
      const loc = /\((\d+):(\d+)\)\s*$/.exec(err.message);
      const msg = err.message.replace(/^Error transforming [^:]+: /, "").replace(/\s*\(\d+:\d+\)\s*$/, "");
      throw syntaxErrorOf(code, { esm, ts, file: m.id, fallback: niceSyntax(msg), line: loc ? Number(loc[1]) : 1, column: loc ? Number(loc[2]) : 0 });
    }
    if (esm) {
      out = replaceFree(out, { import: "__labImportKeyword" })
        .replace(/__labImportKeyword\s*\.\s*meta\b/g, "__labImportMeta")
        .replace(/__labImportKeyword\s*\(/g, "__labDynamicImport(");
    } else if (/\bimport\s*\(/.test(out)) {
      out = replaceFree(out, { import: "__labImportKeyword" }).replace(/__labImportKeyword\s*\(/g, "__labDynamicImport(");
    }
    const tla = esm && hasTopLevelAwait(out) && !compilesWithoutAwait(out);
    const globalNames = this.machine.globalNames;
    const params = ["exports", "require", "module", "__filename", "__dirname", ...(esm ? ["__labImportMeta", "__labDynamicImport", "__labNoCjs"] : []), ...globalNames];
    if (!esm && /\b__labDynamicImport\(/.test(out)) params.splice(5, 0, "__labDynamicImport");
    const head = `(${esm ? "async " : ""}function __labModule__(${params.join(", ")}) {${esm ? '"use strict";' : ""}`;
    const sourceURL = esm ? `file://${m.id}` : m.id;
    // Stack frames on line 1 are shifted by the wrapper; prepareStackTrace takes it off again,
    // and maps rewritten (ES module, TypeScript) positions back to the file as written.
    ctx.wrapperOffsets.set(sourceURL, head.length);
    if (map) ctx.sourceMaps.set(sourceURL, { mappings: map.mappings, decoded: null });
    else ctx.sourceMaps.delete(sourceURL);
    let fn;
    try {
      fn = (0, eval)(`${head}${out}\n})\n//# sourceURL=${sourceURL}`);
    } catch (err) {
      if (err instanceof SyntaxError) throw syntaxErrorOf(code, { esm, ts, file: m.id, fallback: err.message, line: 1, column: 0, v8: err.message });
      throw err;
    }
    const compiled = { fn, esm, tla, imports, source, globalNames, needsDynamic: params.includes("__labDynamicImport") };
    return compiled;
  }

  runCompiled(m, compiled) {
    const args = this.args(m, compiled);
    if (!compiled.esm && compiled.needsDynamic) {
      // CommonJS that uses import(): slot the dynamic import function in.
      args.splice(5, 0, (spec) => this.dynamicImport(spec, m.id));
    }
    let p;
    try {
      p = Promise.resolve(compiled.fn.call(compiled.esm ? undefined : m.exports, ...args));
    } catch (err) {
      m.error = err;
      return Promise.reject(err);
    }
    return p.then(
      () => {
        m.loaded = true;
      },
      (err) => {
        m.error = err;
        throw err;
      }
    );
  }
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/**
 * A SyntaxError as Node reports it: V8's own wording (the engine compiles
 * the code to find out), at the place acorn's parser stops, with the
 * offending token underlined.
 */
function syntaxErrorOf(code, { esm, ts, file, fallback, line, column, v8 }) {
  let message = v8 || null;
  if (!message && !ts) {
    const body = esm ? code.replace(/^\s*(import\s[^;\n]*|export\s+(\*|\{[^}]*\})[^;\n]*);?\s*$/gm, "").replace(/^(\s*)export\s+(default\s+)?/gm, "$1") : code;
    try {
      if (esm) new AsyncFunction(body);
      else new Function(body);
    } catch (err) {
      if (err instanceof SyntaxError) message = err.message;
    }
  }
  if (!ts) {
    try {
      acorn.parse(code, { ecmaVersion: "latest", sourceType: esm ? "module" : "script", allowAwaitOutsideFunction: true, allowReturnOutsideFunction: !esm, allowHashBang: true });
    } catch (err) {
      if (err.loc) {
        line = err.loc.line;
        column = err.loc.column;
      }
    }
  }
  const lineText = code.split("\n")[line - 1] || "";
  const rest = lineText.slice(column);
  const token = /^("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|`[^`]*`?|[\w$]+|\S)/.exec(rest)?.[0] || " ";
  return new ModuleSyntaxError(message || fallback, file, line, column, lineText, esm, token.length);
}

function niceSyntax(msg) {
  // Sucrase's wording, nudged towards V8's for the usual beginner mistakes.
  return msg
    .replace(/^Unexpected token, expected "(.)"$/, (_, c) => (c === ")" ? "missing ) after argument list" : `Unexpected token, expected "${c}"`))
    .replace(/^Unterminated string constant$/, "Invalid or unexpected token")
    .replace(/^Unexpected token$/, "Unexpected token");
}

/**
 * The masking heuristic cannot see where an expression-bodied arrow ends
 * (async (req, res) => res.json({ data: await x })), so a positive is
 * confirmed by the engine: top-level await only fails to compile as a plain function.
 */
function compilesWithoutAwait(code) {
  try {
    new Function(`"use strict";${code}`);
    return true;
  } catch {
    return false;
  }
}

function hasTopLevelAwait(code) {
  return /(^|[^\w$.])await\b/.test(maskFunctionBodies(code));
}

const BLOCK_WORDS = new Set(["if", "for", "while", "switch", "catch", "with"]);

/** Blank out the bodies of functions, methods and classes, so any `await` left is top-level. */
function maskFunctionBodies(code) {
  const plain = code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/g, (m) => " ".repeat(m.length));
  const isFnBrace = (idx) => {
    let j = idx - 1;
    while (j >= 0 && /\s/.test(plain[j])) j--;
    if (plain[j] === ">" && plain[j - 1] === "=") return true; // arrow function
    if (plain[j] === ")") {
      let depth = 0;
      for (; j >= 0; j--) {
        if (plain[j] === ")") depth++;
        else if (plain[j] === "(") {
          depth--;
          if (depth === 0) break;
        }
      }
      j--;
      while (j >= 0 && /\s/.test(plain[j])) j--;
      let k = j;
      while (k >= 0 && /[\w$]/.test(plain[k])) k--;
      return !BLOCK_WORDS.has(plain.slice(k + 1, j + 1));
    }
    // class Foo { … } / class Foo extends Bar { … }
    return /\bclass\b[^{};]*$/.test(plain.slice(Math.max(0, idx - 120), idx));
  };
  const out = plain.split("");
  const stack = [];
  for (let i = 0; i < plain.length; i++) {
    const c = plain[i];
    if (c === "{") stack.push(isFnBrace(i) || (stack.length > 0 && stack[stack.length - 1]));
    else if (c === "}") stack.pop();
    else if (stack.length && stack[stack.length - 1]) out[i] = " ";
  }
  return out.join("");
}

