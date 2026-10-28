/**
 * THE BACKEND LAB RUNTIME — bundled by scripts/nodeLabRuntime.mjs into
 * public/lab/node-runtime.js.
 *
 * Node.js's built-in modules (this folder) and REAL npm packages from the
 * pinned workspace scripts/node-lab: Express 5, zod, jsonwebtoken, bcryptjs,
 * cors, helmet, cookie-parser, express-rate-limit, multer, dotenv, yaml,
 * node-cron and node-postgres. Services with no network to talk to in a
 * browser (Redis, WebSockets, SMTP email) are lab stand-ins with the real
 * libraries' interfaces, in services.js.
 *
 * Exports createMachine(), used by the backend lab worker in the browser
 * and by lib/academy/node in Node to prove every lab at build time.
 */
import expressPkg from "express";
import * as zodPkg from "zod";
import jsonwebtokenPkg from "jsonwebtoken";
import * as bcryptjsNs from "bcryptjs";
import corsPkg from "cors";
import helmetPkg from "helmet";
import cookieParserPkg from "cookie-parser";
import * as rateLimitNs from "express-rate-limit";
import multerPkg from "multer";
import dotenvPkg from "dotenv";
import * as yamlNs from "yaml";
import * as cronNs from "node-cron";

import { Machine, cleanStack } from "./machine.js";
import { ctx } from "./context.js";
import { inspect } from "./inspect.js";
import { Buffer } from "./buffer.js";
import fs, { promises as fsPromises } from "./fs.js";
import pathMod from "./path.js";
import http, { https } from "./http.js";
import EventEmitter, * as eventsNs from "./events.js";
import stream from "./stream.js";
import * as streamPromises from "./streamPromises.js";
import util, { types as utilTypes } from "./util.js";
import crypto from "./crypto.js";
import proc from "./process.js";
import bufferMod from "./buffer.js";
import * as sd from "string_decoder/lib/string_decoder.js";
import pg from "./labPg.js";
import { decodeMappings, originalPosition } from "./sourcemap.js";
import * as B from "./builtins.js";
import * as T from "./testing.js";
import * as S from "./services.js";


/** An ES module's namespace, usable by require() and import alike. */
function esm(ns) {
  const out = { ...ns, __esModule: true };
  if (!("default" in out)) out.default = ns;
  return out;
}

/** The npm packages a lab project can depend on (when its package.json lists them). */
export const PACKAGES = {
  express: () => expressPkg,
  zod: () => esm(zodPkg),
  "zod/v4": () => esm(zodPkg),
  jsonwebtoken: () => jsonwebtokenPkg,
  bcryptjs: () => esm(bcryptjsNs),
  bcrypt: () => esm(bcryptjsNs),
  argon2: () => S.argon2,
  cors: () => corsPkg,
  helmet: () => esm({ default: helmetPkg, ...helmetPkg }),
  "cookie-parser": () => cookieParserPkg,
  "express-rate-limit": () => esm(rateLimitNs),
  multer: () => multerPkg,
  dotenv: () => dotenvPkg,
  "dotenv/config": () => {
    // As dotenv's own config.cjs: a side-effect import is quiet unless DOTENV_QUIET / DOTENV_CONFIG_QUIET says otherwise.
    const quiet = proc.env.DOTENV_QUIET != null ? proc.env.DOTENV_QUIET : proc.env.DOTENV_CONFIG_QUIET;
    dotenvPkg.config({ quiet: quiet != null ? quiet : true });
    return {};
  },
  yaml: () => esm(yamlNs),
  "node-cron": () => esm(cronNs),
  pg: () => pg,
  redis: () => S.redis,
  ws: () => S.ws,
  nodemailer: () => S.nodemailer,
  uuid: () => S.uuid,
  supertest: () => Object.assign(T.supertest, { default: T.supertest }),
  "vitest/config": () => ({ __esModule: true, defineConfig: (c) => c, default: { defineConfig: (c) => c } }),
  vitest: () => ({
    __esModule: true,
    describe: T.describe,
    it: T.it,
    test: T.test,
    suite: T.suite,
    expect: T.expect,
    vi: T.vi,
    beforeAll: T.beforeAll,
    afterAll: T.afterAll,
    beforeEach: T.beforeEach,
    afterEach: T.afterEach,
  }),
};

/* ── Node's built-in modules ───────────────────────────────────────── */
const consoleModule = new Proxy({}, { get: (_, k) => ctx.machine?.console[k] });
export const BUILTINS = {
  fs,
  "fs/promises": fsPromises,
  path: pathMod,
  "path/posix": pathMod,
  http,
  https,
  events: Object.assign(EventEmitter, eventsNs, { default: EventEmitter }),
  stream,
  "stream/promises": streamPromises,
  buffer: bufferMod,
  util,
  "util/types": utilTypes,
  crypto,
  process: proc,
  os: B.os,
  net: B.net,
  url: B.url,
  querystring: B.querystring,
  string_decoder: sd,
  assert: B.assert,
  "assert/strict": B.assert.strict,
  zlib: B.zlib,
  readline: B.readline,
  "readline/promises": B.readlinePromises,
  timers: B.timers,
  "timers/promises": B.timersPromises,
  dns: B.dns,
  "dns/promises": B.dns.promises,
  async_hooks: B.asyncHooks,
  perf_hooks: B.perfHooks,
  child_process: B.childProcess,
  worker_threads: B.workerThreads,
  cluster: B.cluster,
  tty: B.tty,
  v8: B.v8,
  diagnostics_channel: B.diagnosticsChannel,
  console: consoleModule,
  module: {
    builtinModules: [],
    createRequire: (from) => {
      const file = String(from).replace(/^file:\/\//, "");
      return ctx.machine.modules.makeRequire({ id: file, children: [] });
    },
    isBuiltin: (s) => Object.prototype.hasOwnProperty.call(BUILTINS, String(s).replace(/^node:/, "")),
  },
};
// Node's deprecated `constants` module: fs.constants and os.constants together (graceful-fs still reads it).
BUILTINS.constants = { ...(fs.constants || {}), ...(B.os.constants?.errno || {}), ...(B.os.constants?.signals || {}) };
BUILTINS.module.builtinModules = Object.keys(BUILTINS);

const NODE_ONLY_MODULES = new Set(["tls", "http2", "inspector", "vm", "dgram", "repl", "domain", "punycode", "trace_events", "wasi", "sqlite", "sea", "test"]);

/** The require() that Prisma's pre-bundled packages call for Node's modules (see scripts/nodeLabRuntime.mjs). */
globalThis.__labRequire = (name) => {
  const id = String(name).replace(/^node:/, "");
  if (Object.prototype.hasOwnProperty.call(BUILTINS, id)) return BUILTINS[id];
  if (Object.prototype.hasOwnProperty.call(PACKAGES, id)) return PACKAGES[id]();
  // A Node module the lab does not have (tls, http2 …): Prisma's bundles require some at load and never use them.
  if (NODE_ONLY_MODULES.has(id)) {
    const missing = () => {
      throw new Error(`node:${id} is not available in this lab`);
    };
    return new Proxy({}, { get: (_, key) => (key === "__esModule" || typeof key === "symbol" ? undefined : missing) });
  }
  const err = new Error(`Cannot find module '${name}'`);
  err.code = "MODULE_NOT_FOUND";
  throw err;
};

inspect.isBuffer = (v) => Buffer.isBuffer(v);
inspect.cleanStack = cleanStack;

/* ── Stack traces show the project's code, not the lab runtime's ───── */
const LAB_FILE = /^(file:\/\/)?\/(?![A-Za-z]:)/;
function prepareStackTrace(err, frames) {
  let head;
  try {
    head = err === null || err === undefined ? String(err) : Error.prototype.toString.call(err);
  } catch {
    head = "Error";
  }
  const lines = [head];
  for (const f of frames) {
    const file = f.getScriptNameOrSourceURL?.() || f.getFileName?.() || "";
    if (!LAB_FILE.test(file) && !globalThis.__labDebugStacks) continue;
    let text = String(f).replace(/^eval /, "");
    // The module wrapper is Node's "Object.<anonymous>" (CommonJS) or nameless (ES modules).
    const esm = file.startsWith("file://");
    text = text.replace(/^(async )?(Object\.)?__labModule__ \((.*)\)$/, (_, a, __, loc) => (esm ? `${a || ""}${loc}` : `${a || ""}Object.<anonymous> (${loc})`));
    const offset = ctx.wrapperOffsets.get(file);
    const map = ctx.sourceMaps.get(file);
    text = text.replace(/:(\d+):(\d+)(\)?)$/, (whole, l, c, close) => {
      let line = Number(l);
      let col = Number(c);
      if (line === 1 && offset) col = Math.max(1, col - offset);
      if (map) {
        map.decoded ||= decodeMappings(map.mappings);
        const pos = originalPosition(map.decoded, line, col);
        if (pos) ({ line, column: col } = pos);
      }
      return `:${line}:${col}${close}`;
    });
    lines.push(`    at ${text}`);
  }
  return lines.join("\n");
}

/* ── Unhandled promise rejections reach the running process ────────── */
let hooked = false;
function hookRejections() {
  if (hooked) return;
  hooked = true;
  Error.prepareStackTrace = prepareStackTrace;
  Error.stackTraceLimit = 10;
  const report = (reason, promise) => ctx.machine?.unhandledRejection(reason, promise);
  if (typeof globalThis.addEventListener === "function" && typeof globalThis.WorkerGlobalScope !== "undefined") {
    globalThis.addEventListener("unhandledrejection", (event) => {
      event.preventDefault();
      report(event.reason, event.promise);
    });
  } else if (globalThis.process?.on) {
    globalThis.process.on("unhandledRejection", (reason, promise) => report(reason, promise));
  }
}

/**
 * Prisma (runtime/prisma.js) is large and only Prisma labs need it: the
 * bundler puts it in a chunk of its own, loaded the first time a machine's
 * package.json depends on Prisma.
 */
let prismaLoading = null;
export function loadPrisma() {
  prismaLoading ||= import("./prisma.js").then((P) => {
    Object.assign(PACKAGES, P.PRISMA_PACKAGES);
    return P;
  });
  return prismaLoading;
}

/**
 * Create a lab machine. opts: { files, env, database, services, stdin, port,
 * strictDependencies }. See machine.js.
 */
export function createMachine(opts = {}) {
  hookRejections();
  ctx.machine?.stop?.();
  const machine = new Machine({ ...opts, builtins: BUILTINS, packages: PACKAGES });
  machine.extensions.loadPrisma = loadPrisma;
  machine.extensions.runTestFiles = T.runTestFiles;
  machine.extensions.WebSocket = S.WebSocketClient;
  machine.activate();
  return machine;
}

export { inspect };
export const RUNTIME = { node: proc.version, express: "5.3.0" };
