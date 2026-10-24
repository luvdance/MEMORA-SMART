/** node:util — Node's own formatting (inspect.js) plus the helpers backends use. */
import { inspect, format } from "./inspect.js";
import proc from "./process.js";

export { inspect, format };

export function formatWithOptions(_opts, ...args) {
  return format(...args);
}

export function inherits(ctor, superCtor) {
  Object.defineProperty(ctor, "super_", { value: superCtor, writable: true, configurable: true });
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}

const kCustomPromisify = Symbol.for("nodejs.util.promisify.custom");
export function promisify(original) {
  if (typeof original !== "function") {
    const err = new TypeError(`The "original" argument must be of type function. Received ${original === undefined ? "undefined" : typeof original}`);
    err.code = "ERR_INVALID_ARG_TYPE";
    throw err;
  }
  if (original[kCustomPromisify]) return original[kCustomPromisify];
  function fn(...args) {
    return new Promise((resolve, reject) => {
      original.call(this, ...args, (err, ...values) => {
        if (err) return reject(err);
        resolve(values[0]);
      });
    });
  }
  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisify, { value: fn });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify.custom = kCustomPromisify;

export function callbackify(original) {
  return function (...args) {
    const cb = args.pop();
    original.apply(this, args).then(
      (v) => proc.nextTick(cb, null, v),
      (e) => proc.nextTick(cb, e || new Error("Promise was rejected with a falsy value"))
    );
  };
}

const warned = new Set();
export function deprecate(fn, msg, code) {
  return function (...args) {
    if (!warned.has(msg)) {
      warned.add(msg);
      proc.emitWarning(msg, "DeprecationWarning", code);
    }
    return fn.apply(this, args);
  };
}

export function debuglog() {
  const log = () => {};
  log.enabled = false;
  return log;
}
export const debug = debuglog;

export function isDeepStrictEqual(a, b) {
  return deepEqual(a, b, true);
}

export function deepEqual(a, b, strict, seen = []) {
  if (strict ? Object.is(a, b) : a == b || Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (seen.some(([x, y]) => x === a && y === b)) return true;
  seen = [...seen, [a, b]];
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return String(a) === String(b);
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) if (!b.has(k) || !deepEqual(v, b.get(k), strict, seen)) return false;
    return true;
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }
  if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual(a[k], b[k], strict, seen)) return false;
  return true;
}

export const types = {
  isPromise: (v) => v instanceof Promise,
  isDate: (v) => v instanceof Date,
  isRegExp: (v) => v instanceof RegExp,
  isMap: (v) => v instanceof Map,
  isSet: (v) => v instanceof Set,
  isNativeError: (v) => v instanceof Error,
  isAsyncFunction: (v) => typeof v === "function" && v.constructor?.name === "AsyncFunction",
  isGeneratorFunction: (v) => typeof v === "function" && /GeneratorFunction$/.test(v.constructor?.name || ""),
  isUint8Array: (v) => v instanceof Uint8Array,
  isTypedArray: (v) => ArrayBuffer.isView(v) && !(v instanceof DataView),
  isArrayBuffer: (v) => v instanceof ArrayBuffer,
  isAnyArrayBuffer: (v) => v instanceof ArrayBuffer || (typeof SharedArrayBuffer !== "undefined" && v instanceof SharedArrayBuffer),
  isArrayBufferView: (v) => ArrayBuffer.isView(v),
  isBoxedPrimitive: (v) => v instanceof Number || v instanceof String || v instanceof Boolean,
  isKeyObject: (v) => v?.constructor?.name === "KeyObject" || v?.constructor?.name === "SecretKeyObject",
  isCryptoKey: (v) => typeof CryptoKey !== "undefined" && v instanceof CryptoKey,
  isProxy: () => false,
};

export const isArray = Array.isArray;
export const isError = (v) => v instanceof Error;
export const TextEncoder = globalThis.TextEncoder;
export const TextDecoder = globalThis.TextDecoder;

export function styleText(_format, text) {
  // Lab output is a log, not a terminal: Node prints no colours there.
  return String(text);
}

export function stripVTControlCharacters(s) {
  // eslint-disable-next-line no-control-regex
  return String(s).replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");
}

export function toUSVString(s) {
  return String(s).toWellFormed ? String(s).toWellFormed() : String(s);
}

/** util.parseArgs — the subset command-line tools use, with Node's errors. */
export function parseArgs({ args, options = {}, strict = true, allowPositionals = !strict, tokens: wantTokens = false } = {}) {
  const argv = args ?? proc.argv.slice(2);
  const values = Object.create(null);
  const positionals = [];
  const tokens = [];
  const byShort = Object.fromEntries(Object.entries(options).filter(([, o]) => o.short).map(([k, o]) => [o.short, k]));
  const err = (code, message) => {
    const e = new TypeError(message);
    e.code = code;
    return e;
  };
  const label = (name) => {
    const o = options[name];
    return `${o?.short ? `-${o.short}, ` : ""}--${name}`;
  };
  const store = (name, value) => {
    const o = options[name];
    if (o?.multiple) (values[name] ||= []).push(value);
    else values[name] = value;
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    let name = null;
    let inline;
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      name = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
      inline = eq === -1 ? undefined : arg.slice(eq + 1);
    } else if (arg.startsWith("-") && arg.length > 1) {
      const short = arg[1];
      name = byShort[short] || short;
      if (arg.length > 2) inline = arg.slice(2);
    }
    if (name === null) {
      if (strict && !allowPositionals) throw err("ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL", `Unexpected argument '${arg}'. This command does not take positional arguments`);
      positionals.push(arg);
      continue;
    }
    const opt = options[name];
    if (!opt) {
      if (strict) throw err("ERR_PARSE_ARGS_UNKNOWN_OPTION", `Unknown option '${arg.startsWith("--") ? `--${name}` : arg.slice(0, 2)}'. To specify a positional argument starting with a '-', place it at the end of the command after '--', as in '-- "${arg}"`);
      store(name, inline ?? true);
      continue;
    }
    if (opt.type === "boolean") {
      if (inline !== undefined && strict) throw err("ERR_PARSE_ARGS_INVALID_OPTION_VALUE", `Option '${label(name)}' does not take an argument`);
      store(name, true);
    } else {
      let value = inline;
      if (value === undefined) {
        const next = argv[i + 1];
        if (next === undefined || (strict && next.startsWith("-"))) throw err("ERR_PARSE_ARGS_INVALID_OPTION_VALUE", `Option '${label(name)} <value>' argument missing`);
        value = next;
        i += 1;
      }
      store(name, value);
    }
    tokens.push({ kind: "option", name });
  }
  for (const [name, o] of Object.entries(options)) if (values[name] === undefined && o.default !== undefined) values[name] = o.default;
  const out = { values, positionals };
  if (wantTokens) out.tokens = tokens;
  return out;
}

export default {
  inspect, format, formatWithOptions, inherits, promisify, callbackify, deprecate, debuglog, debug, isDeepStrictEqual,
  types, isArray, isError, TextEncoder, TextDecoder, styleText, stripVTControlCharacters, toUSVString, parseArgs,
};
