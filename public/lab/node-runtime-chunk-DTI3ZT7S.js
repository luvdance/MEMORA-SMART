import {
  crypto_exports,
  init_crypto
} from "./node-runtime-chunk-DGMGKRAL.js";
import {
  Readable,
  Stream,
  Transform,
  init_path,
  init_stream,
  path_exports,
  require_events,
  require_fs,
  require_string_decoder,
  stream_exports
} from "./node-runtime-chunk-GTV3XHWV.js";
import {
  Buffer as Buffer2,
  __commonJS,
  __esm,
  __export,
  __name,
  __toCommonJS,
  __toESM,
  console,
  ctx,
  events_default,
  init_buffer,
  init_context,
  init_events,
  init_globals,
  init_process,
  process,
  process_default,
  process_exports
} from "./node-runtime-chunk-WY7WQXFC.js";

// src/academy/node/runtime/inspect.js
function strEscape(str) {
  let singleQuote = 39;
  if (str.includes("'")) {
    if (!str.includes('"')) singleQuote = -2;
    else if (!str.includes("`") && !str.includes("${")) singleQuote = -1;
  }
  const quote = singleQuote === 39 ? "'" : singleQuote === -2 ? '"' : "`";
  if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) return quote + str + quote;
  let out = "";
  for (const ch of str) {
    const c = ch.charCodeAt(0);
    if (c === singleQuote || c === 92 || c < 32 || c > 126 && c < 160) {
      if (c === 39 && singleQuote !== 39) out += ch;
      else if (c === 92) out += "\\\\";
      else if (c === 39) out += "\\'";
      else if (c < 32) out += meta[c];
      else out += `\\x${c.toString(16).toUpperCase()}`;
    } else out += ch;
  }
  return quote + out + quote;
}
function formatKey(key) {
  if (typeof key === "symbol") return `[${key.toString()}]`;
  if (keyStrRegExp.test(key)) return key;
  return strEscape(key);
}
function getPrefix(constructor, tag, fallback, size = "") {
  if (constructor === null) {
    if (tag !== "" && fallback !== tag) return `[${fallback}${size}: null prototype] [${tag}] `;
    return `[${fallback}${size}: null prototype] `;
  }
  if (tag !== "" && constructor !== tag) return `${constructor}${size} [${tag}] `;
  return `${constructor}${size} `;
}
function constructorName(obj) {
  let o = obj;
  while (o) {
    const d = Object.getOwnPropertyDescriptor(o, "constructor");
    if (d && typeof d.value === "function" && d.value.name !== "") return d.value.name;
    o = Object.getPrototypeOf(o);
  }
  return null;
}
function isBelowBreakLength(ctx2, output, start, base) {
  let total = output.length + start;
  if (total + output.length > BREAK) return false;
  for (const s of output) {
    total += s.length;
    if (total > BREAK) return false;
  }
  return base === "" || !base.includes("\n");
}
function reduceToSingleString(ctx2, output, base, braces, extrasType, recurseTimes, value) {
  let entries = output.length;
  if (extrasType === "array" && entries > 6) output = groupArrayElements(ctx2, output, value);
  if (ctx2.currentDepth - recurseTimes < COMPACT && entries === output.length) {
    const start = output.length + ctx2.indentationLvl + braces[0].length + base.length + 10;
    if (isBelowBreakLength(ctx2, output, start, base)) {
      const joined = output.join(", ");
      if (!joined.includes("\n")) return `${base ? `${base} ` : ""}${braces[0]} ${joined} ${braces[1]}`;
    }
  }
  const indentation = `
${" ".repeat(ctx2.indentationLvl)}`;
  return `${base ? `${base} ` : ""}${braces[0]}${indentation}  ${output.join(`,${indentation}  `)}${indentation}${braces[1]}`;
}
function groupArrayElements(ctx2, output, value) {
  let totalLength = 0;
  let maxLength = 0;
  let i2 = 0;
  let outputLength = output.length;
  if (ctx2.extra > 0) outputLength -= 1;
  const separatorSpace = 2;
  const dataLen = new Array(outputLength);
  for (; i2 < outputLength; i2++) {
    const len = output[i2].length;
    dataLen[i2] = len;
    totalLength += len + separatorSpace;
    if (maxLength < len) maxLength = len;
  }
  const actualMax = maxLength + separatorSpace;
  if (actualMax * 3 + ctx2.indentationLvl < BREAK && (totalLength / actualMax > 5 || maxLength <= 6)) {
    const approxCharHeights = 2.5;
    const averageBias = Math.sqrt(actualMax - totalLength / output.length);
    const biasedMax = Math.max(actualMax - 3 - averageBias, 1);
    const columns = Math.min(
      Math.round(Math.sqrt(approxCharHeights * biasedMax * outputLength) / biasedMax),
      Math.floor((BREAK - ctx2.indentationLvl) / actualMax),
      COMPACT * 4,
      15
    );
    if (columns <= 1) return output;
    const tmp = [];
    const maxLineLength = [];
    for (let c = 0; c < columns; c++) {
      let lineLength = 0;
      for (let j = c; j < output.length; j += columns) if (dataLen[j] > lineLength) lineLength = dataLen[j];
      maxLineLength.push(lineLength + separatorSpace);
    }
    const numeric = value !== void 0 && value.every?.((v) => typeof v === "number" || typeof v === "bigint");
    for (let r = 0; r < outputLength; r += columns) {
      const max2 = Math.min(r + columns, outputLength);
      let str = "";
      let j = r;
      for (; j < max2 - 1; j++) {
        const padding = maxLineLength[j - r] + output[j].length - dataLen[j];
        str += numeric ? `${output[j]}, `.padStart(padding, " ") : `${output[j]}, `.padEnd(padding, " ");
      }
      if (numeric) {
        const padding = maxLineLength[j - r] + output[j].length - dataLen[j] - separatorSpace;
        str += output[j].padStart(padding, " ");
      } else str += output[j];
      tmp.push(str);
    }
    if (ctx2.extra > 0) tmp.push(output[outputLength]);
    output = tmp;
  }
  return output;
}
function formatPrimitive(value, ctx2) {
  if (typeof value === "string") {
    let trailer = "";
    if (value.length > MAX_STRING) {
      trailer = `... ${value.length - MAX_STRING} more character${value.length - MAX_STRING > 1 ? "s" : ""}`;
      value = value.slice(0, MAX_STRING);
    }
    if (value.length > 16 && value.length > BREAK - ctx2.indentationLvl - 4 && value.includes("\n")) {
      return value.split(/(?<=\n)/).map((line) => strEscape(line)).join(` +
${" ".repeat(ctx2.indentationLvl + 2)}`) + trailer;
    }
    return strEscape(value) + trailer;
  }
  if (typeof value === "number") return Object.is(value, -0) ? "-0" : `${value}`;
  if (typeof value === "bigint") return `${value}n`;
  if (typeof value === "boolean") return `${value}`;
  if (typeof value === "undefined") return "undefined";
  return value.toString();
}
function isError(v) {
  return v instanceof Error || Object.prototype.toString.call(v) === "[object Error]";
}
function formatError(err2, ctx2, keys) {
  const name = err2.name != null ? String(err2.name) : "Error";
  let stack = typeof err2.stack === "string" && err2.stack ? err2.stack : Error.prototype.toString.call(err2);
  if (ctx2.cleanStack) stack = ctx2.cleanStack(stack);
  const lines = stack.split("\n");
  if (!lines.slice(1).some((l) => /^\s+at\s/.test(l))) stack = `[${stack}]`;
  if (err2.cause !== void 0 && !keys.includes("cause")) keys.push("cause");
  void name;
  return stack;
}
function formatValue(ctx2, value, recurseTimes) {
  if (typeof value !== "object" && typeof value !== "function") return formatPrimitive(value, ctx2);
  if (value === null) return "null";
  if (ctx2.seen.includes(value)) {
    let index = 1;
    if (ctx2.circular === void 0) {
      ctx2.circular = /* @__PURE__ */ new Map();
      ctx2.circular.set(value, index);
    } else {
      index = ctx2.circular.get(value);
      if (index === void 0) {
        index = ctx2.circular.size + 1;
        ctx2.circular.set(value, index);
      }
    }
    return `[Circular *${index}]`;
  }
  if (typeof value[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] === "function" && ctx2.customInspect !== false) {
    const out = value[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](DEPTH - recurseTimes, { depth: DEPTH }, inspect);
    if (out !== value) return typeof out === "string" ? out : formatValue(ctx2, out, recurseTimes);
  }
  return formatRaw(ctx2, value, recurseTimes);
}
function getKeys(value, showHidden) {
  const keys = Object.keys(value);
  const symbols = Object.getOwnPropertySymbols(value).filter((s) => Object.prototype.propertyIsEnumerable.call(value, s));
  void showHidden;
  return [...keys, ...symbols];
}
function formatProperty(ctx2, value, recurseTimes, key, type2) {
  let name;
  let str;
  const desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key], enumerable: true };
  if (desc.value !== void 0) {
    const diff = ctx2.compact !== true || type2 !== "object" ? 2 : 3;
    ctx2.indentationLvl += diff;
    str = formatValue(ctx2, desc.value, recurseTimes);
    if (diff === 3 && ctx2.breakLength < str.length) str = str.replace(/\n/g, `
${" ".repeat(ctx2.indentationLvl)}`);
    ctx2.indentationLvl -= diff;
  } else if (desc.get !== void 0) {
    str = desc.set !== void 0 ? "[Getter/Setter]" : "[Getter]";
  } else if (desc.set !== void 0) {
    str = "[Setter]";
  } else str = "undefined";
  if (type2 === "arrayItem") return str;
  name = formatKey(key);
  return `${name}: ${str}`;
}
function formatRaw(ctx2, value, recurseTimes) {
  let keys;
  const ctor = constructorName(value);
  let tag = value[Symbol.toStringTag];
  if (typeof tag !== "string" || tag !== "" && tag === ctor) tag = "";
  let base = "";
  let formatter = /* @__PURE__ */ __name(() => [], "formatter");
  let braces;
  let noIterator = true;
  let extrasType = "object";
  let i2 = 0;
  ctx2.extra = 0;
  if (Array.isArray(value)) {
    keys = getKeys(value).filter((k) => typeof k === "symbol" || !/^(0|[1-9][0-9]*)$/.test(k));
    const prefix = ctor !== "Array" || tag !== "" ? getPrefix(ctor, tag, "Array", `(${value.length})`) : "";
    braces = [`${prefix}[`, "]"];
    if (value.length === 0 && keys.length === 0) return `${braces[0]}]`;
    extrasType = "array";
    formatter = /* @__PURE__ */ __name((c, v, r) => formatArray(c, v, r), "formatter");
    noIterator = false;
  } else if (value instanceof Map) {
    keys = getKeys(value);
    const prefix = getPrefix(ctor, tag, "Map", `(${value.size})`);
    formatter = /* @__PURE__ */ __name((c, v, r) => [...v].map(([k, val]) => `${formatValue(c, k, r)} => ${formatValue(c, val, r)}`), "formatter");
    if (value.size === 0 && keys.length === 0) return `${prefix}{}`;
    braces = [`${prefix}{`, "}"];
    noIterator = false;
  } else if (value instanceof Set) {
    keys = getKeys(value);
    const prefix = getPrefix(ctor, tag, "Set", `(${value.size})`);
    formatter = /* @__PURE__ */ __name((c, v, r) => [...v].map((x2) => formatValue(c, x2, r)), "formatter");
    if (value.size === 0 && keys.length === 0) return `${prefix}{}`;
    braces = [`${prefix}{`, "}"];
    noIterator = false;
  } else if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    const isBuffer = ctx2.isBuffer?.(value);
    if (isBuffer) {
      const max2 = 50;
      const bytes = Array.from(value.subarray(0, max2), (b) => b.toString(16).padStart(2, "0")).join(" ");
      const remaining = value.length - max2;
      return `<${ctor || "Buffer"} ${bytes}${remaining > 0 ? ` ... ${remaining} more byte${remaining > 1 ? "s" : ""}` : ""}>`.replace(/<Buffer >/, "<Buffer >");
    }
    keys = getKeys(value).filter((k) => typeof k === "symbol" || !/^(0|[1-9][0-9]*)$/.test(k));
    const size = value.length;
    const fallback = tag || ctor;
    braces = [`${getPrefix(ctor, tag, fallback, `(${size})`)}[`, "]"];
    if (value.length === 0 && keys.length === 0) return `${braces[0]}]`;
    formatter = /* @__PURE__ */ __name((c, v) => Array.from(v.subarray(0, MAX_ARRAY), (x2) => formatPrimitive(typeof x2 === "bigint" ? x2 : Number(x2), c)).concat(v.length > MAX_ARRAY ? [`... ${v.length - MAX_ARRAY} more item${v.length - MAX_ARRAY > 1 ? "s" : ""}`] : []), "formatter");
    extrasType = "array";
    noIterator = false;
  }
  if (noIterator) {
    keys = getKeys(value);
    braces = ["{", "}"];
    if (ctor === "Object" && !tag) {
      if (keys.length === 0) return "{}";
    } else if (typeof value === "function") {
      base = getFunctionBase(value, ctor, tag);
      if (keys.length === 0) return base;
    } else if (value instanceof RegExp) {
      base = RegExp.prototype.toString.call(value);
      const prefix = getPrefix(ctor, tag, "RegExp");
      if (prefix !== "RegExp ") base = `${prefix}${base}`;
      if (keys.length === 0) return base;
    } else if (value instanceof Date) {
      base = Number.isNaN(value.getTime()) ? "Invalid Date" : Date.prototype.toISOString.call(value);
      const prefix = getPrefix(ctor, tag, "Date");
      if (prefix !== "Date ") base = `${prefix}${base}`;
      if (keys.length === 0) return base;
    } else if (isError(value)) {
      keys = keys.filter((k) => k !== "stack" && k !== "message");
      base = formatError(value, ctx2, keys);
      if (keys.length === 0) return base;
    } else if (value instanceof Promise) {
      braces[0] = `${getPrefix(ctor, tag, "Promise")}{`;
      formatter = /* @__PURE__ */ __name(() => ["<pending>"], "formatter");
    } else if (value instanceof WeakSet || value instanceof WeakMap) {
      braces[0] = `${getPrefix(ctor, tag, value instanceof WeakSet ? "WeakSet" : "WeakMap")}{`;
      formatter = /* @__PURE__ */ __name(() => ["<items unknown>"], "formatter");
    } else if (value instanceof ArrayBuffer) {
      const bytes = Array.from(new Uint8Array(value).subarray(0, 50), (b) => b.toString(16).padStart(2, "0")).join(" ");
      braces[0] = `${getPrefix(ctor, tag, "ArrayBuffer")}{`;
      formatter = /* @__PURE__ */ __name(() => [`[Uint8Contents]: <${bytes}>`, `byteLength: ${value.byteLength}`], "formatter");
    } else if (value instanceof Number || value instanceof String || value instanceof Boolean) {
      const type2 = value instanceof Number ? "Number" : value instanceof String ? "String" : "Boolean";
      base = `[${type2}: ${formatPrimitive(value.valueOf(), ctx2)}]`;
      if (value instanceof String) keys = keys.filter((k) => !/^(0|[1-9][0-9]*)$/.test(k) && k !== "length");
      if (keys.length === 0) return base;
    } else if (typeof URL !== "undefined" && value instanceof URL) {
      const props = ["href", "origin", "protocol", "username", "password", "host", "hostname", "port", "pathname", "search", "searchParams", "hash"];
      braces[0] = "URL {";
      formatter = /* @__PURE__ */ __name((c, v, r) => props.map((p) => `${p}: ${p === "searchParams" ? `URLSearchParams {${[...v.searchParams].length ? ` ${[...v.searchParams].map(([k, x2]) => `${strEscape(k)} => ${strEscape(x2)}`).join(", ")} ` : ""}}` : formatValue(c, v[p], r)}`), "formatter");
    } else {
      if (keys.length === 0) return `${getPrefix(ctor, tag, "Object")}{}`;
      braces[0] = `${getPrefix(ctor, tag, "Object")}{`;
    }
  }
  if (recurseTimes > ctx2.depth) {
    let name = getPrefix(ctor, tag, "Object").slice(0, -1);
    if (ctor !== null) name = `[${name}]`;
    if (Array.isArray(value)) return "[Array]";
    return name;
  }
  recurseTimes += 1;
  ctx2.seen.push(value);
  ctx2.currentDepth = recurseTimes;
  let output;
  try {
    output = formatter(ctx2, value, recurseTimes);
    for (i2 = 0; i2 < keys.length; i2++) output.push(formatProperty(ctx2, value, recurseTimes, keys[i2], extrasType === "array" ? "arrayKey" : "object"));
  } finally {
    ctx2.seen.pop();
  }
  if (ctx2.circular !== void 0) {
    const index = ctx2.circular.get(value);
    if (index !== void 0) {
      const reference = `<ref *${index}>`;
      if (base === "") braces[0] = `${reference} ${braces[0]}`;
      else base = `${reference} ${base}`;
    }
  }
  const res = reduceToSingleString(ctx2, output, base, braces, extrasType, recurseTimes, value);
  return res;
}
function getFunctionBase(value, ctor, tag) {
  const src = Function.prototype.toString.call(value);
  if (/^class[\s{]/.test(src)) {
    let base2 = `[class ${value.name || "(anonymous)"}`;
    const superName = Object.getPrototypeOf(value)?.name;
    if (superName) base2 += ` extends ${superName}`;
    return `${base2}]`;
  }
  let type2 = "Function";
  if (ctor === "AsyncFunction") type2 = "AsyncFunction";
  else if (ctor === "GeneratorFunction") type2 = "GeneratorFunction";
  else if (ctor === "AsyncGeneratorFunction") type2 = "AsyncGeneratorFunction";
  let base = `[${type2}`;
  if (value.name === "") base += " (anonymous)";
  else base += `: ${value.name}`;
  base += "]";
  if (ctor !== type2 && ctor !== null) base += ` ${ctor}`;
  if (tag !== "" && ctor !== tag) base += ` [${tag}]`;
  return base;
}
function formatArray(ctx2, value, recurseTimes) {
  const len = value.length;
  const outLen = Math.min(MAX_ARRAY, len);
  const remaining = len - outLen;
  const output = [];
  let holes = 0;
  for (let i2 = 0; i2 < outLen; i2++) {
    if (!Object.prototype.hasOwnProperty.call(value, i2)) {
      holes += 1;
      continue;
    }
    if (holes) {
      output.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
      holes = 0;
    }
    output.push(formatProperty(ctx2, value, recurseTimes, i2, "arrayItem"));
  }
  if (holes) output.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
  if (remaining > 0) {
    output.push(`... ${remaining} more item${remaining > 1 ? "s" : ""}`);
    ctx2.extra = 1;
  }
  return output;
}
function inspect(value, opts = {}) {
  const ctx2 = {
    seen: [],
    indentationLvl: 0,
    currentDepth: 0,
    breakLength: BREAK,
    compact: COMPACT,
    isBuffer: inspect.isBuffer,
    cleanStack: inspect.cleanStack,
    customInspect: opts.customInspect,
    depth: opts.depth === void 0 ? DEPTH : opts.depth === null ? Infinity : opts.depth
  };
  return formatValue(ctx2, value, 0);
}
function format(...args) {
  const first = args[0];
  let a = 0;
  let str = "";
  if (typeof first === "string") {
    if (args.length === 1) return first;
    let lastPos = 0;
    a = 1;
    for (let i2 = 0; i2 < first.length - 1; i2++) {
      if (first.charCodeAt(i2) !== 37) continue;
      const c = first[i2 + 1];
      if (a !== args.length) {
        let temp;
        switch (c) {
          case "s": {
            const x2 = args[a];
            temp = typeof x2 === "number" ? Object.is(x2, -0) ? "-0" : `${x2}` : typeof x2 === "bigint" ? `${x2}n` : typeof x2 !== "object" || x2 === null ? String(x2) : isError(x2) ? x2.stack || String(x2) : inspect(x2, { depth: 0 });
            break;
          }
          case "j":
            try {
              temp = JSON.stringify(args[a]);
            } catch {
              temp = "[Circular]";
            }
            break;
          case "d": {
            const x2 = args[a];
            temp = typeof x2 === "bigint" ? `${x2}n` : typeof x2 === "symbol" ? "NaN" : `${Number(x2)}`;
            break;
          }
          case "O":
          case "o":
            temp = inspect(args[a]);
            break;
          case "i": {
            const x2 = args[a];
            temp = typeof x2 === "bigint" ? `${x2}n` : typeof x2 === "symbol" ? "NaN" : `${parseInt(x2)}`;
            break;
          }
          case "f": {
            const x2 = args[a];
            temp = typeof x2 === "symbol" ? "NaN" : `${parseFloat(x2)}`;
            break;
          }
          case "c":
            temp = "";
            break;
          case "%":
            str += first.slice(lastPos, i2);
            lastPos = i2 + 1;
            continue;
          default:
            continue;
        }
        if (lastPos !== i2) str += first.slice(lastPos, i2);
        str += temp;
        lastPos = i2 + 2;
        i2 += 1;
        a += 1;
      } else if (c === "%") {
        str += first.slice(lastPos, i2);
        lastPos = i2 + 1;
      }
    }
    if (lastPos !== 0) {
      a = a || 1;
      if (lastPos < first.length) str += first.slice(lastPos);
    } else {
      str = first;
      a = 1;
    }
  }
  while (a < args.length) {
    const value = args[a];
    str += (str || a > 0 ? " " : "") + (typeof value === "string" ? value : inspect(value));
    a += 1;
  }
  return str;
}
var BREAK, DEPTH, COMPACT, MAX_ARRAY, MAX_STRING, strEscapeSequencesRegExp, meta, keyStrRegExp;
var init_inspect = __esm({
  "src/academy/node/runtime/inspect.js"() {
    init_globals();
    BREAK = 80;
    DEPTH = 2;
    COMPACT = 3;
    MAX_ARRAY = 100;
    MAX_STRING = 1e4;
    strEscapeSequencesRegExp = /[\x00-\x1f\x27\x5c\x7f-\x9f]/;
    meta = [
      "\\x00",
      "\\x01",
      "\\x02",
      "\\x03",
      "\\x04",
      "\\x05",
      "\\x06",
      "\\x07",
      "\\b",
      "\\t",
      "\\n",
      "\\x0B",
      "\\f",
      "\\r",
      "\\x0E",
      "\\x0F",
      "\\x10",
      "\\x11",
      "\\x12",
      "\\x13",
      "\\x14",
      "\\x15",
      "\\x16",
      "\\x17",
      "\\x18",
      "\\x19",
      "\\x1A",
      "\\x1B",
      "\\x1C",
      "\\x1D",
      "\\x1E",
      "\\x1F"
    ];
    __name(strEscape, "strEscape");
    keyStrRegExp = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
    __name(formatKey, "formatKey");
    __name(getPrefix, "getPrefix");
    __name(constructorName, "constructorName");
    __name(isBelowBreakLength, "isBelowBreakLength");
    __name(reduceToSingleString, "reduceToSingleString");
    __name(groupArrayElements, "groupArrayElements");
    __name(formatPrimitive, "formatPrimitive");
    __name(isError, "isError");
    __name(formatError, "formatError");
    __name(formatValue, "formatValue");
    __name(getKeys, "getKeys");
    __name(formatProperty, "formatProperty");
    __name(formatRaw, "formatRaw");
    __name(getFunctionBase, "getFunctionBase");
    __name(formatArray, "formatArray");
    __name(inspect, "inspect");
    inspect.custom = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
    inspect.defaultOptions = { depth: DEPTH, breakLength: BREAK, compact: COMPACT };
    inspect.isBuffer = null;
    inspect.cleanStack = null;
    __name(format, "format");
  }
});

// src/academy/node/runtime/util.js
var util_exports = {};
__export(util_exports, {
  TextDecoder: () => TextDecoder2,
  TextEncoder: () => TextEncoder2,
  callbackify: () => callbackify,
  debug: () => debug,
  debuglog: () => debuglog,
  deepEqual: () => deepEqual,
  default: () => util_default,
  deprecate: () => deprecate,
  format: () => format,
  formatWithOptions: () => formatWithOptions,
  inherits: () => inherits,
  inspect: () => inspect,
  isArray: () => isArray,
  isDeepStrictEqual: () => isDeepStrictEqual,
  isError: () => isError2,
  parseArgs: () => parseArgs,
  promisify: () => promisify,
  stripVTControlCharacters: () => stripVTControlCharacters,
  styleText: () => styleText,
  toUSVString: () => toUSVString,
  types: () => types
});
function formatWithOptions(_opts, ...args) {
  return format(...args);
}
function inherits(ctor, superCtor) {
  Object.defineProperty(ctor, "super_", { value: superCtor, writable: true, configurable: true });
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}
function promisify(original) {
  if (typeof original !== "function") {
    const err2 = new TypeError(`The "original" argument must be of type function. Received ${original === void 0 ? "undefined" : typeof original}`);
    err2.code = "ERR_INVALID_ARG_TYPE";
    throw err2;
  }
  if (original[kCustomPromisify]) return original[kCustomPromisify];
  function fn(...args) {
    return new Promise((resolve3, reject) => {
      original.call(this, ...args, (err2, ...values) => {
        if (err2) return reject(err2);
        resolve3(values[0]);
      });
    });
  }
  __name(fn, "fn");
  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisify, { value: fn });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
function callbackify(original) {
  return function(...args) {
    const cb = args.pop();
    original.apply(this, args).then(
      (v) => process_default.nextTick(cb, null, v),
      (e) => process_default.nextTick(cb, e || new Error("Promise was rejected with a falsy value"))
    );
  };
}
function deprecate(fn, msg2, code) {
  return function(...args) {
    if (!warned.has(msg2)) {
      warned.add(msg2);
      process_default.emitWarning(msg2, "DeprecationWarning", code);
    }
    return fn.apply(this, args);
  };
}
function debuglog() {
  const log = /* @__PURE__ */ __name(() => {
  }, "log");
  log.enabled = false;
  return log;
}
function isDeepStrictEqual(a, b) {
  return deepEqual(a, b, true);
}
function deepEqual(a, b, strict, seen = []) {
  if (strict ? Object.is(a, b) : a == b || Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (seen.some(([x2, y]) => x2 === a && y === b)) return true;
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
    for (let i2 = 0; i2 < a.length; i2++) if (a[i2] !== b[i2]) return false;
    return true;
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual(a[k], b[k], strict, seen)) return false;
  return true;
}
function styleText(_format, text) {
  return String(text);
}
function stripVTControlCharacters(s) {
  return String(s).replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");
}
function toUSVString(s) {
  return String(s).toWellFormed ? String(s).toWellFormed() : String(s);
}
function parseArgs({ args, options = {}, strict = true, allowPositionals = !strict, tokens: wantTokens = false } = {}) {
  const argv = args ?? process_default.argv.slice(2);
  const values = /* @__PURE__ */ Object.create(null);
  const positionals = [];
  const tokens = [];
  const byShort = Object.fromEntries(Object.entries(options).filter(([, o]) => o.short).map(([k, o]) => [o.short, k]));
  const err2 = /* @__PURE__ */ __name((code, message) => {
    const e = new TypeError(message);
    e.code = code;
    return e;
  }, "err");
  const label = /* @__PURE__ */ __name((name) => {
    const o = options[name];
    return `${o?.short ? `-${o.short}, ` : ""}--${name}`;
  }, "label");
  const store = /* @__PURE__ */ __name((name, value) => {
    const o = options[name];
    if (o?.multiple) (values[name] ||= []).push(value);
    else values[name] = value;
  }, "store");
  for (let i2 = 0; i2 < argv.length; i2++) {
    const arg = argv[i2];
    if (arg === "--") {
      positionals.push(...argv.slice(i2 + 1));
      break;
    }
    let name = null;
    let inline;
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      name = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
      inline = eq === -1 ? void 0 : arg.slice(eq + 1);
    } else if (arg.startsWith("-") && arg.length > 1) {
      const short = arg[1];
      name = byShort[short] || short;
      if (arg.length > 2) inline = arg.slice(2);
    }
    if (name === null) {
      if (strict && !allowPositionals) throw err2("ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL", `Unexpected argument '${arg}'. This command does not take positional arguments`);
      positionals.push(arg);
      continue;
    }
    const opt = options[name];
    if (!opt) {
      if (strict) throw err2("ERR_PARSE_ARGS_UNKNOWN_OPTION", `Unknown option '${arg.startsWith("--") ? `--${name}` : arg.slice(0, 2)}'. To specify a positional argument starting with a '-', place it at the end of the command after '--', as in '-- "${arg}"`);
      store(name, inline ?? true);
      continue;
    }
    if (opt.type === "boolean") {
      if (inline !== void 0 && strict) throw err2("ERR_PARSE_ARGS_INVALID_OPTION_VALUE", `Option '${label(name)}' does not take an argument`);
      store(name, true);
    } else {
      let value = inline;
      if (value === void 0) {
        const next = argv[i2 + 1];
        if (next === void 0 || strict && next.startsWith("-")) throw err2("ERR_PARSE_ARGS_INVALID_OPTION_VALUE", `Option '${label(name)} <value>' argument missing`);
        value = next;
        i2 += 1;
      }
      store(name, value);
    }
    tokens.push({ kind: "option", name });
  }
  for (const [name, o] of Object.entries(options)) if (values[name] === void 0 && o.default !== void 0) values[name] = o.default;
  const out = { values, positionals };
  if (wantTokens) out.tokens = tokens;
  return out;
}
var kCustomPromisify, warned, debug, types, isArray, isError2, TextEncoder2, TextDecoder2, util_default;
var init_util = __esm({
  "src/academy/node/runtime/util.js"() {
    init_globals();
    init_inspect();
    init_process();
    __name(formatWithOptions, "formatWithOptions");
    __name(inherits, "inherits");
    kCustomPromisify = /* @__PURE__ */ Symbol.for("nodejs.util.promisify.custom");
    __name(promisify, "promisify");
    promisify.custom = kCustomPromisify;
    __name(callbackify, "callbackify");
    warned = /* @__PURE__ */ new Set();
    __name(deprecate, "deprecate");
    __name(debuglog, "debuglog");
    debug = debuglog;
    __name(isDeepStrictEqual, "isDeepStrictEqual");
    __name(deepEqual, "deepEqual");
    types = {
      isPromise: /* @__PURE__ */ __name((v) => v instanceof Promise, "isPromise"),
      isDate: /* @__PURE__ */ __name((v) => v instanceof Date, "isDate"),
      isRegExp: /* @__PURE__ */ __name((v) => v instanceof RegExp, "isRegExp"),
      isMap: /* @__PURE__ */ __name((v) => v instanceof Map, "isMap"),
      isSet: /* @__PURE__ */ __name((v) => v instanceof Set, "isSet"),
      isNativeError: /* @__PURE__ */ __name((v) => v instanceof Error, "isNativeError"),
      isAsyncFunction: /* @__PURE__ */ __name((v) => typeof v === "function" && v.constructor?.name === "AsyncFunction", "isAsyncFunction"),
      isGeneratorFunction: /* @__PURE__ */ __name((v) => typeof v === "function" && /GeneratorFunction$/.test(v.constructor?.name || ""), "isGeneratorFunction"),
      isUint8Array: /* @__PURE__ */ __name((v) => v instanceof Uint8Array, "isUint8Array"),
      isTypedArray: /* @__PURE__ */ __name((v) => ArrayBuffer.isView(v) && !(v instanceof DataView), "isTypedArray"),
      isArrayBuffer: /* @__PURE__ */ __name((v) => v instanceof ArrayBuffer, "isArrayBuffer"),
      isAnyArrayBuffer: /* @__PURE__ */ __name((v) => v instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && v instanceof SharedArrayBuffer, "isAnyArrayBuffer"),
      isArrayBufferView: /* @__PURE__ */ __name((v) => ArrayBuffer.isView(v), "isArrayBufferView"),
      isBoxedPrimitive: /* @__PURE__ */ __name((v) => v instanceof Number || v instanceof String || v instanceof Boolean, "isBoxedPrimitive"),
      isKeyObject: /* @__PURE__ */ __name((v) => v?.constructor?.name === "KeyObject" || v?.constructor?.name === "SecretKeyObject", "isKeyObject"),
      isCryptoKey: /* @__PURE__ */ __name((v) => typeof CryptoKey !== "undefined" && v instanceof CryptoKey, "isCryptoKey"),
      isProxy: /* @__PURE__ */ __name(() => false, "isProxy")
    };
    isArray = Array.isArray;
    isError2 = /* @__PURE__ */ __name((v) => v instanceof Error, "isError");
    TextEncoder2 = globalThis.TextEncoder;
    TextDecoder2 = globalThis.TextDecoder;
    __name(styleText, "styleText");
    __name(stripVTControlCharacters, "stripVTControlCharacters");
    __name(toUSVString, "toUSVString");
    __name(parseArgs, "parseArgs");
    util_default = {
      inspect,
      format,
      formatWithOptions,
      inherits,
      promisify,
      callbackify,
      deprecate,
      debuglog,
      debug,
      isDeepStrictEqual,
      types,
      isArray,
      isError: isError2,
      TextEncoder: TextEncoder2,
      TextDecoder: TextDecoder2,
      styleText,
      stripVTControlCharacters,
      toUSVString,
      parseArgs
    };
  }
});

// src/academy/node/runtime/http.js
var http_exports = {};
__export(http_exports, {
  Agent: () => Agent,
  ClientRequest: () => ClientRequest,
  IncomingMessage: () => IncomingMessage,
  METHODS: () => METHODS,
  OutgoingMessage: () => OutgoingMessage,
  STATUS_CODES: () => STATUS_CODES,
  Server: () => Server,
  ServerResponse: () => ServerResponse,
  Socket: () => Socket,
  createServer: () => createServer,
  default: () => http_default,
  fillRequest: () => fillRequest,
  get: () => get,
  globalAgent: () => globalAgent,
  https: () => https,
  maxHeaderSize: () => maxHeaderSize,
  request: () => request,
  validateHeaderName: () => validateHeaderName,
  validateHeaderValue: () => validateHeaderValue
});
function codeError(code, message, Type = Error) {
  const err2 = new Type(message);
  err2.code = code;
  return err2;
}
function validateHeaderName(name) {
  if (typeof name !== "string" || !name || !TOKEN.test(name)) {
    throw codeError("ERR_INVALID_HTTP_TOKEN", `Header name must be a valid HTTP token ["${name}"]`, TypeError);
  }
}
function validateHeaderValue(name, value) {
  if (value === void 0) throw codeError("ERR_HTTP_INVALID_HEADER_VALUE", `Invalid value "${value}" for header "${name}"`, TypeError);
  const values = Array.isArray(value) ? value : [value];
  if (values.some((v) => BAD_VALUE.test(String(v)))) throw codeError("ERR_INVALID_CHAR", `Invalid character in header content ["${name}"]`, TypeError);
}
function addHeader(headers, name, value) {
  const key = name.toLowerCase();
  if (key === "set-cookie") (headers[key] ||= []).push(value);
  else if (headers[key] === void 0) headers[key] = value;
  else if (["content-type", "content-length", "user-agent", "referer", "host", "authorization", "proxy-authorization", "if-modified-since", "if-unmodified-since", "from", "location", "max-forwards", "retry-after", "etag", "last-modified", "server", "age", "expires"].includes(key)) {
  } else if (key === "cookie") headers[key] += `; ${value}`;
  else headers[key] += `, ${value}`;
}
function fillRequest(req, { method, url: url2, headers }) {
  req.method = String(method || "GET").toUpperCase();
  req.url = url2;
  const list = Array.isArray(headers) ? headers : Object.entries(headers || {});
  for (const [name, value] of list) {
    for (const v of Array.isArray(value) ? value : [value]) {
      req.rawHeaders.push(name, String(v));
      addHeader(req.headers, name, String(v));
    }
  }
}
function createServer(options, listener) {
  return new Server(options, listener);
}
function request(input, options, cb) {
  return new ClientRequest(input, options, cb, "http:");
}
function get(input, options, cb) {
  const req = request(input, options, cb);
  req.end();
  return req;
}
var STATUS_CODES, METHODS, maxHeaderSize, TOKEN, BAD_VALUE, portSeq, Socket, IncomingMessage, OutgoingMessage, ServerResponse, Server, ClientRequest, Agent, globalAgent, http, http_default, https;
var init_http = __esm({
  "src/academy/node/runtime/http.js"() {
    init_globals();
    init_events();
    init_stream();
    init_buffer();
    init_context();
    STATUS_CODES = {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",
      103: "Early Hints",
      200: "OK",
      201: "Created",
      202: "Accepted",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      208: "Already Reported",
      226: "IM Used",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      308: "Permanent Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Payload Too Large",
      414: "URI Too Long",
      415: "Unsupported Media Type",
      416: "Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a Teapot",
      421: "Misdirected Request",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      425: "Too Early",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      451: "Unavailable For Legal Reasons",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      509: "Bandwidth Limit Exceeded",
      510: "Not Extended",
      511: "Network Authentication Required"
    };
    METHODS = [
      "ACL",
      "BIND",
      "CHECKOUT",
      "CONNECT",
      "COPY",
      "DELETE",
      "GET",
      "HEAD",
      "LINK",
      "LOCK",
      "M-SEARCH",
      "MERGE",
      "MKACTIVITY",
      "MKCALENDAR",
      "MKCOL",
      "MOVE",
      "NOTIFY",
      "OPTIONS",
      "PATCH",
      "POST",
      "PROPFIND",
      "PROPPATCH",
      "PURGE",
      "PUT",
      "QUERY",
      "REBIND",
      "REPORT",
      "SEARCH",
      "SOURCE",
      "SUBSCRIBE",
      "TRACE",
      "UNBIND",
      "UNLINK",
      "UNLOCK",
      "UNSUBSCRIBE"
    ];
    maxHeaderSize = 16384;
    __name(codeError, "codeError");
    TOKEN = /^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]+$/;
    BAD_VALUE = /[^\t\x20-\x7e\x80-\xff]/;
    __name(validateHeaderName, "validateHeaderName");
    __name(validateHeaderValue, "validateHeaderValue");
    portSeq = 5e4;
    Socket = class extends events_default {
      static {
        __name(this, "Socket");
      }
      constructor({ remoteAddress = "::1", localPort = 3e3, encrypted } = {}) {
        super();
        this.remoteAddress = remoteAddress;
        this.remoteFamily = remoteAddress.includes(":") ? "IPv6" : "IPv4";
        this.remotePort = ++portSeq;
        this.localAddress = remoteAddress;
        this.localPort = localPort;
        if (encrypted) this.encrypted = true;
        this.readable = true;
        this.writable = true;
        this.destroyed = false;
        this.bytesRead = 0;
        this.bytesWritten = 0;
      }
      setTimeout() {
        return this;
      }
      setNoDelay() {
        return this;
      }
      setKeepAlive() {
        return this;
      }
      address() {
        return { address: this.localAddress, family: this.remoteFamily, port: this.localPort };
      }
      ref() {
        return this;
      }
      unref() {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      cork() {
      }
      uncork() {
      }
      write() {
        return true;
      }
      end() {
        this.writable = false;
        return this;
      }
      destroy(err2) {
        if (this.destroyed) return this;
        this.destroyed = true;
        this.readable = false;
        this.writable = false;
        if (err2) this.emit("error", err2);
        this.emit("close", Boolean(err2));
        return this;
      }
    };
    IncomingMessage = class extends Readable {
      static {
        __name(this, "IncomingMessage");
      }
      constructor(socket) {
        super();
        this.socket = socket;
        this.httpVersionMajor = 1;
        this.httpVersionMinor = 1;
        this.httpVersion = "1.1";
        this.complete = false;
        this.rawHeaders = [];
        this.rawTrailers = [];
        this.headers = {};
        this.trailers = {};
        this.aborted = false;
        this.upgrade = false;
        this.url = "";
        this.method = null;
        this.statusCode = null;
        this.statusMessage = null;
        this._body = null;
      }
      get connection() {
        return this.socket;
      }
      get headersDistinct() {
        const out = /* @__PURE__ */ Object.create(null);
        for (let i2 = 0; i2 < this.rawHeaders.length; i2 += 2) (out[this.rawHeaders[i2].toLowerCase()] ||= []).push(this.rawHeaders[i2 + 1]);
        return out;
      }
      setTimeout(ms, cb) {
        if (cb) this.on("timeout", cb);
        return this;
      }
      _read() {
        if (this._fed) return;
        this._fed = true;
        const body = this._body;
        const loop2 = ctx.loop;
        const feed = /* @__PURE__ */ __name(() => {
          if (body && body.length) this.push(body);
          this.complete = true;
          this.push(null);
        }, "feed");
        if (loop2) loop2.setImmediate(feed);
        else queueMicrotask(feed);
      }
    };
    __name(addHeader, "addHeader");
    __name(fillRequest, "fillRequest");
    OutgoingMessage = class extends Stream {
      static {
        __name(this, "OutgoingMessage");
      }
      constructor() {
        super();
        this._headers = /* @__PURE__ */ new Map();
        this._header = null;
        this.headersSent = false;
        this.sendDate = false;
        this.finished = false;
        this.writableEnded = false;
        this.writableFinished = false;
        this.writable = true;
        this.destroyed = false;
        this.chunkedEncoding = false;
        this._chunks = [];
        this._wroteBody = false;
      }
      setHeader(name, value) {
        if (this._header) throw codeError("ERR_HTTP_HEADERS_SENT", "Cannot set headers after they are sent to the client");
        validateHeaderName(name);
        validateHeaderValue(name, value);
        this._headers.set(name.toLowerCase(), [name, value]);
        return this;
      }
      setHeaders(headers) {
        const entries = headers instanceof Map || typeof Headers !== "undefined" && headers instanceof Headers ? [...headers.entries()] : Object.entries(headers);
        for (const [k, v] of entries) this.setHeader(k, v);
        return this;
      }
      appendHeader(name, value) {
        const cur = this.getHeader(name);
        if (cur === void 0) return this.setHeader(name, value);
        return this.setHeader(name, [].concat(cur, value));
      }
      getHeader(name) {
        return this._headers.get(String(name).toLowerCase())?.[1];
      }
      getHeaders() {
        const out = /* @__PURE__ */ Object.create(null);
        for (const [key, [, v]] of this._headers) out[key] = v;
        return out;
      }
      getHeaderNames() {
        return [...this._headers.keys()];
      }
      getRawHeaderNames() {
        return [...this._headers.values()].map(([n]) => n);
      }
      hasHeader(name) {
        return this._headers.has(String(name).toLowerCase());
      }
      removeHeader(name) {
        if (this._header) throw codeError("ERR_HTTP_HEADERS_SENT", "Cannot remove headers after they are sent to the client");
        this._headers.delete(String(name).toLowerCase());
      }
      flushHeaders() {
        if (!this._header) this._implicitHeader();
      }
      cork() {
      }
      uncork() {
      }
      setTimeout(ms, cb) {
        if (cb) this.on("timeout", cb);
        return this;
      }
      destroy(err2) {
        if (this.destroyed) return this;
        this.destroyed = true;
        this.socket?.destroy(err2);
        return this;
      }
    };
    ServerResponse = class extends OutgoingMessage {
      static {
        __name(this, "ServerResponse");
      }
      constructor(req, options = {}) {
        super();
        this.req = req;
        this.socket = req?.socket || null;
        this.statusCode = 200;
        this.statusMessage = void 0;
        this.sendDate = true;
        this._head = req?.method === "HEAD";
        this._deliver = options.deliver || null;
        this.strictContentLength = false;
      }
      get connection() {
        return this.socket;
      }
      assignSocket(socket) {
        this.socket = socket;
      }
      detachSocket() {
      }
      writeContinue() {
      }
      writeProcessing() {
      }
      writeEarlyHints() {
      }
      _implicitHeader() {
        this.writeHead(this.statusCode);
      }
      writeHead(statusCode, reason, obj) {
        if (this._header) throw codeError("ERR_HTTP_HEADERS_SENT", "Cannot write headers after they are sent to the client");
        const code = statusCode | 0;
        if (code < 100 || code > 999) throw codeError("ERR_HTTP_INVALID_STATUS_CODE", `Invalid status code: ${statusCode}`, RangeError);
        if (typeof reason === "string") this.statusMessage = reason;
        else {
          obj = reason;
          this.statusMessage ||= STATUS_CODES[code] || "unknown";
        }
        this.statusCode = code;
        if (obj) {
          if (Array.isArray(obj)) {
            for (let i2 = 0; i2 < obj.length; i2 += 2) this.appendHeader(obj[i2], obj[i2 + 1]);
          } else for (const [k, v] of Object.entries(obj)) if (v !== void 0) this.setHeader(k, v);
        }
        this._header = true;
        this.headersSent = true;
        return this;
      }
      /** The final header list, in wire order, with what Node adds itself. */
      _wireHeaders(bodyLength, chunked) {
        const list = [];
        for (const [, [name, value]] of this._headers) {
          for (const v of Array.isArray(value) ? value : [value]) list.push([name, String(v)]);
        }
        const has = /* @__PURE__ */ __name((n) => this._headers.has(n), "has");
        if (this.sendDate && !has("date")) list.push(["Date", (/* @__PURE__ */ new Date()).toUTCString()]);
        if (!has("connection")) list.push(["Connection", "keep-alive"]);
        if (!has("keep-alive")) list.push(["Keep-Alive", "timeout=5"]);
        const noBody = this._head || this.statusCode === 204 || this.statusCode === 304 || this.statusCode >= 100 && this.statusCode < 200;
        if (!has("content-length") && !has("transfer-encoding") && !noBody) {
          if (chunked) list.push(["Transfer-Encoding", "chunked"]);
          else if (bodyLength !== null) list.push(["Content-Length", String(bodyLength)]);
        }
        return list;
      }
      write(chunk, encoding, cb) {
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = void 0;
        }
        if (this.writableEnded) {
          const err2 = codeError("ERR_STREAM_WRITE_AFTER_END", "write after end");
          ctx.loop?.setImmediate(() => {
            if (cb) cb(err2);
            this.emit("error", err2);
          });
          return false;
        }
        if (chunk === void 0 || chunk === null) {
          throw codeError("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
        }
        if (!this._header) {
          this._implicitHeader();
          if (!this._headers.has("content-length")) this.chunkedEncoding = true;
        }
        const buf = typeof chunk === "string" ? Buffer2.from(chunk, encoding || "utf8") : Buffer2.from(chunk);
        if (buf.length) this._chunks.push(buf);
        this._wroteBody = true;
        if (cb) ctx.loop?.setImmediate(cb);
        return true;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = void 0;
        } else if (typeof encoding === "function") {
          cb = encoding;
          encoding = void 0;
        }
        if (this.writableEnded) {
          if (cb) ctx.loop?.setImmediate(cb);
          return this;
        }
        let lengthKnown = null;
        if (this._header && !this._wroteBody && !this._headers.has("content-length")) this.chunkedEncoding = true;
        if (!this._header) {
          const buf = chunk === void 0 || chunk === null ? Buffer2.alloc(0) : typeof chunk === "string" ? Buffer2.from(chunk, encoding || "utf8") : Buffer2.from(chunk);
          if (buf.length) this._chunks.push(buf);
          lengthKnown = buf.length;
          this._implicitHeader();
        } else if (chunk !== void 0 && chunk !== null) {
          this._chunks.push(typeof chunk === "string" ? Buffer2.from(chunk, encoding || "utf8") : Buffer2.from(chunk));
        }
        this.writableEnded = true;
        this.finished = true;
        this.writable = false;
        const body = Buffer2.concat(this._chunks);
        const noBody = this._head || this.statusCode === 204 || this.statusCode === 304;
        const response = {
          status: this.statusCode,
          statusText: this.statusMessage || STATUS_CODES[this.statusCode] || "",
          headers: this._wireHeaders(lengthKnown, this.chunkedEncoding),
          body: noBody ? Buffer2.alloc(0) : body
        };
        const loop2 = ctx.loop;
        const finish = /* @__PURE__ */ __name(() => {
          this.writableFinished = true;
          this.emit("prefinish");
          this.emit("finish");
          if (cb) cb();
          this._deliver?.(response);
          const close = /* @__PURE__ */ __name(() => {
            this.emit("close");
            if (this.req && !this.req.destroyed) this.req.emit("close");
          }, "close");
          if (loop2) loop2.setImmediate(close);
          else queueMicrotask(close);
        }, "finish");
        if (loop2) queueMicrotask(finish);
        else queueMicrotask(finish);
        return this;
      }
      addTrailers() {
      }
    };
    Server = class extends events_default {
      static {
        __name(this, "Server");
      }
      constructor(options, listener) {
        super();
        if (typeof options === "function") {
          listener = options;
          options = {};
        }
        this.options = options || {};
        if (listener) this.on("request", listener);
        this.listening = false;
        this._port = null;
        this._inflight = 0;
        this._closing = false;
        this._ref = true;
        this.timeout = 0;
        this.keepAliveTimeout = 5e3;
        this.headersTimeout = 6e4;
        this.requestTimeout = 3e5;
        this.maxHeadersCount = null;
        this.maxRequestsPerSocket = 0;
        this.maxConnections = void 0;
      }
      listen(...args) {
        let port;
        let host;
        let cb = typeof args[args.length - 1] === "function" ? args.pop() : null;
        if (args[0] && typeof args[0] === "object") {
          port = args[0].port;
          host = args[0].host;
        } else {
          [port, host] = args;
        }
        if (cb) this.once("listening", cb);
        const machine = ctx.machine;
        const n = port === void 0 || port === null || port === "" ? 0 : Number(port);
        if (!Number.isInteger(n) || n < 0 || n > 65535) {
          throw codeError("ERR_SOCKET_BAD_PORT", `options.port should be >= 0 and < 65536. Received type ${typeof port} (${typeof port === "string" ? `'${port}'` : port}).`, RangeError);
        }
        this._host = host;
        machine.network.listen(this, n);
        return this;
      }
      address() {
        if (!this.listening) return null;
        return { address: this._host && this._host !== "0.0.0.0" ? this._host : "::", family: this._host && this._host.includes(".") ? "IPv4" : "IPv6", port: this._port };
      }
      close(cb) {
        const machine = ctx.machine;
        if (!this.listening) {
          if (cb) machine.loop.setImmediate(cb, codeError("ERR_SERVER_NOT_RUNNING", "Server is not running."));
          return this;
        }
        machine.network.unlisten(this);
        this.listening = false;
        this._closing = true;
        if (cb) this.once("close", cb);
        this._maybeClosed();
        return this;
      }
      _maybeClosed() {
        if (this._closing && this._inflight === 0) {
          this._closing = false;
          ctx.loop?.setImmediate(() => this.emit("close"));
        }
      }
      closeAllConnections() {
      }
      closeIdleConnections() {
      }
      getConnections(cb) {
        ctx.loop.setImmediate(cb, null, this._inflight);
      }
      setTimeout(ms, cb) {
        this.timeout = ms;
        if (cb) this.on("timeout", cb);
        return this;
      }
      ref() {
        this._ref = true;
        return this;
      }
      unref() {
        this._ref = false;
        return this;
      }
      [Symbol.asyncDispose]() {
        return new Promise((resolve3) => this.close(() => resolve3()));
      }
    };
    __name(createServer, "createServer");
    ClientRequest = class extends Stream {
      static {
        __name(this, "ClientRequest");
      }
      constructor(input, options, cb, scheme = "http:") {
        super();
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        let url2;
        if (typeof input === "string" || input instanceof URL) {
          url2 = new URL(String(input));
          options = { ...options };
        } else {
          options = { ...input, ...options };
          const host = options.hostname || options.host || "localhost";
          url2 = new URL(`${options.protocol || scheme}//${host.includes(":") && !host.startsWith("[") ? `[${host}]` : host}${options.port ? `:${options.port}` : ""}${options.path || "/"}`);
        }
        this.method = String(options.method || "GET").toUpperCase();
        this.path = url2.pathname + url2.search;
        this.host = url2.hostname;
        this.protocol = url2.protocol;
        this._url = url2;
        this._headers = /* @__PURE__ */ new Map();
        for (const [k, v] of Object.entries(options.headers || {})) this._headers.set(k.toLowerCase(), [k, v]);
        this._chunks = [];
        this._timeout = options.timeout;
        this._signal = options.signal;
        this.writable = true;
        this.finished = false;
        this.aborted = false;
        this.destroyed = false;
        if (cb) this.once("response", cb);
      }
      setHeader(name, value) {
        this._headers.set(name.toLowerCase(), [name, value]);
      }
      getHeader(name) {
        return this._headers.get(name.toLowerCase())?.[1];
      }
      removeHeader(name) {
        this._headers.delete(name.toLowerCase());
      }
      setTimeout(ms, cb) {
        this._timeout = ms;
        if (cb) this.once("timeout", cb);
        return this;
      }
      write(chunk, encoding) {
        this._chunks.push(typeof chunk === "string" ? Buffer2.from(chunk, encoding || "utf8") : Buffer2.from(chunk));
        return true;
      }
      destroy(err2) {
        if (this.destroyed) return this;
        this.destroyed = true;
        this.aborted = true;
        if (err2) ctx.loop.setImmediate(() => this.emit("error", err2));
        ctx.loop.setImmediate(() => this.emit("close"));
        return this;
      }
      abort() {
        this.destroy();
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = void 0;
        }
        if (chunk !== void 0 && chunk !== null) this.write(chunk, encoding);
        this.finished = true;
        const machine = ctx.machine;
        const headers = [...this._headers.values()].map(([k, v]) => [k, String(v)]);
        const body = this._chunks.length ? Buffer2.concat(this._chunks) : null;
        if (body && !this._headers.has("content-length")) headers.push(["Content-Length", String(body.length)]);
        if (!this._headers.has("host")) headers.unshift(["Host", this._url.host]);
        let timer = null;
        if (this._timeout) {
          timer = machine.loop.setTimeout(() => this.emit("timeout"), this._timeout);
        }
        machine.network.send({ url: this._url.href, method: this.method, headers, body }).then((r) => {
          if (timer) machine.loop.clear(timer);
          if (this.destroyed) return;
          const res = new IncomingMessage(new Socket({ remoteAddress: "127.0.0.1" }));
          res.statusCode = r.status;
          res.statusMessage = r.statusText;
          for (const [k, v] of r.headers) {
            res.rawHeaders.push(k, v);
            addHeader(res.headers, k, v);
          }
          res._body = r.body;
          this.res = res;
          this.emit("response", res);
          if (this.listenerCount("response") === 0) res.resume();
        }).catch((err2) => {
          if (timer) machine.loop.clear(timer);
          if (!this.destroyed) this.emit("error", err2);
        });
        if (cb) machine.loop.setImmediate(cb);
        return this;
      }
    };
    __name(request, "request");
    __name(get, "get");
    Agent = class extends events_default {
      static {
        __name(this, "Agent");
      }
      constructor(options = {}) {
        super();
        this.options = options;
        this.keepAlive = Boolean(options.keepAlive);
        this.maxSockets = options.maxSockets ?? Infinity;
        this.sockets = {};
        this.freeSockets = {};
        this.requests = {};
      }
      destroy() {
      }
    };
    globalAgent = new Agent({ keepAlive: true });
    http = {
      STATUS_CODES,
      METHODS,
      maxHeaderSize,
      validateHeaderName,
      validateHeaderValue,
      IncomingMessage,
      OutgoingMessage,
      ServerResponse,
      Server,
      createServer,
      ClientRequest,
      request,
      get,
      Agent,
      globalAgent
    };
    http_default = http;
    https = {
      ...http,
      createServer: /* @__PURE__ */ __name((options, listener) => new Server(options, listener), "createServer"),
      request: /* @__PURE__ */ __name((input, options, cb) => new ClientRequest(input, options, cb, "https:"), "request"),
      get: /* @__PURE__ */ __name((input, options, cb) => {
        const req = new ClientRequest(input, options, cb, "https:");
        req.end();
        return req;
      }, "get"),
      globalAgent: new Agent({ keepAlive: true })
    };
  }
});

// scripts/node-lab/node_modules/punycode/punycode.js
var require_punycode = __commonJS({
  "scripts/node-lab/node_modules/punycode/punycode.js"(exports, module) {
    init_globals();
    (function(root) {
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = typeof module == "object" && module && !module.nodeType && module;
      var freeGlobal = typeof globalThis == "object" && globalThis;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
      function error(type2) {
        throw new RangeError(errors[type2]);
      }
      __name(error, "error");
      function map(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      __name(map, "map");
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      __name(mapDomain, "mapDomain");
      function ucs2decode(string) {
        var output = [], counter = 0, length = string.length, value, extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      __name(ucs2decode, "ucs2decode");
      function ucs2encode(array) {
        return map(array, function(value) {
          var output = "";
          if (value > 65535) {
            value -= 65536;
            output += stringFromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          output += stringFromCharCode(value);
          return output;
        }).join("");
      }
      __name(ucs2encode, "ucs2encode");
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      __name(basicToDigit, "basicToDigit");
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      __name(digitToBasic, "digitToBasic");
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      __name(adapt, "adapt");
      function decode(input) {
        var output = [], inputLength = input.length, out, i2 = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i2, w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i2) / w)) {
              error("overflow");
            }
            i2 += digit * w;
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i2 - oldi, out, oldi == 0);
          if (floor(i2 / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i2 / out);
          i2 %= out;
          output.splice(i2++, 0, n);
        }
        return ucs2encode(output);
      }
      __name(decode, "decode");
      function encode(input) {
        var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n = initialN;
        delta = 0;
        bias = initialBias;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n) {
              for (q = delta, k = base; ; k += base) {
                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }
      __name(encode, "encode");
      function toUnicode(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      __name(toUnicode, "toUnicode");
      function toASCII(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }
      __name(toASCII, "toASCII");
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "1.4.1",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define("punycode", function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    })(exports);
  }
});

// scripts/node-lab/node_modules/es-errors/type.js
var require_type = __commonJS({
  "scripts/node-lab/node_modules/es-errors/type.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = TypeError;
  }
});

// src/academy/node/runtime/gen/util.cjs
var require_util = __commonJS({
  "src/academy/node/runtime/gen/util.cjs"(exports, module) {
    init_globals();
    var m = (init_util(), __toCommonJS(util_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/object-inspect/util.inspect.js
var require_util_inspect = __commonJS({
  "scripts/node-lab/node_modules/object-inspect/util.inspect.js"(exports, module) {
    init_globals();
    module.exports = require_util().inspect;
  }
});

// scripts/node-lab/node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "scripts/node-lab/node_modules/object-inspect/index.js"(exports, module) {
    init_globals();
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    __name(addNumericSeparator, "addNumericSeparator");
    var utilInspect = require_util_inspect();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module.exports = /* @__PURE__ */ __name(function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray2(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect2(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      __name(inspect2, "inspect");
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect2);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i2 = 0; i2 < attrs.length; i2++) {
          s += " " + attrs[i2].name + "=" + wrapQuotes(quote(attrs[i2].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray2(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect2);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError3(obj)) {
        var parts = arrObjKeys(obj, inspect2);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect2(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect2(key, obj, true) + " => " + inspect2(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect2(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect2(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect2(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect2(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof globalThis !== "undefined" && obj === globalThis) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect2);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    }, "inspect_");
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    __name(wrapQuotes, "wrapQuotes");
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    __name(quote, "quote");
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    __name(canTrustToString, "canTrustToString");
    function isArray2(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    __name(isArray2, "isArray");
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    __name(isDate, "isDate");
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    __name(isRegExp, "isRegExp");
    function isError3(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    __name(isError3, "isError");
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    __name(isString, "isString");
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    __name(isNumber, "isNumber");
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    __name(isBoolean, "isBoolean");
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    __name(isSymbol, "isSymbol");
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    __name(isBigInt, "isBigInt");
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn.call(obj, key);
    }
    __name(has, "has");
    function toStr(obj) {
      return objectToString.call(obj);
    }
    __name(toStr, "toStr");
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    __name(nameOf, "nameOf");
    function indexOf(xs, x2) {
      if (xs.indexOf) {
        return xs.indexOf(x2);
      }
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        if (xs[i2] === x2) {
          return i2;
        }
      }
      return -1;
    }
    __name(indexOf, "indexOf");
    function isMap(x2) {
      if (!mapSize || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        mapSize.call(x2);
        try {
          setSize.call(x2);
        } catch (s) {
          return true;
        }
        return x2 instanceof Map;
      } catch (e) {
      }
      return false;
    }
    __name(isMap, "isMap");
    function isWeakMap(x2) {
      if (!weakMapHas || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x2, weakMapHas);
        try {
          weakSetHas.call(x2, weakSetHas);
        } catch (s) {
          return true;
        }
        return x2 instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    __name(isWeakMap, "isWeakMap");
    function isWeakRef(x2) {
      if (!weakRefDeref || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x2);
        return true;
      } catch (e) {
      }
      return false;
    }
    __name(isWeakRef, "isWeakRef");
    function isSet(x2) {
      if (!setSize || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        setSize.call(x2);
        try {
          mapSize.call(x2);
        } catch (m) {
          return true;
        }
        return x2 instanceof Set;
      } catch (e) {
      }
      return false;
    }
    __name(isSet, "isSet");
    function isWeakSet(x2) {
      if (!weakSetHas || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x2, weakSetHas);
        try {
          weakMapHas.call(x2, weakMapHas);
        } catch (s) {
          return true;
        }
        return x2 instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    __name(isWeakSet, "isWeakSet");
    function isElement(x2) {
      if (!x2 || typeof x2 !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x2 instanceof HTMLElement) {
        return true;
      }
      return typeof x2.nodeName === "string" && typeof x2.getAttribute === "function";
    }
    __name(isElement, "isElement");
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    __name(inspectString, "inspectString");
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x2 = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x2) {
        return "\\" + x2;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    __name(lowbyte, "lowbyte");
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    __name(markBoxed, "markBoxed");
    function weakCollectionOf(type2) {
      return type2 + " { ? }";
    }
    __name(weakCollectionOf, "weakCollectionOf");
    function collectionOf(type2, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type2 + " (" + size + ") {" + joinedEntries + "}";
    }
    __name(collectionOf, "collectionOf");
    function singleLineValues(xs) {
      for (var i2 = 0; i2 < xs.length; i2++) {
        if (indexOf(xs[i2], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    __name(singleLineValues, "singleLineValues");
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    __name(getIndent, "getIndent");
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    __name(indentedJoin, "indentedJoin");
    function arrObjKeys(obj, inspect2) {
      var isArr = isArray2(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i2 = 0; i2 < obj.length; i2++) {
          xs[i2] = has(obj, i2) ? inspect2(obj[i2], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect2(key, obj) + ": " + inspect2(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect2(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect2(syms[j]) + "]: " + inspect2(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
    __name(arrObjKeys, "arrObjKeys");
  }
});

// scripts/node-lab/node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "scripts/node-lab/node_modules/side-channel-list/index.js"(exports, module) {
    "use strict";
    init_globals();
    var inspect2 = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = /* @__PURE__ */ __name(function(list, key, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    }, "listGetNode");
    var listGet = /* @__PURE__ */ __name(function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    }, "listGet");
    var listSet = /* @__PURE__ */ __name(function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key,
          next: objects.next,
          value
        };
      }
    }, "listSet");
    var listHas = /* @__PURE__ */ __name(function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    }, "listHas");
    var listDelete = /* @__PURE__ */ __name(function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    }, "listDelete");
    module.exports = /* @__PURE__ */ __name(function getSideChannelList() {
      var $o;
      var channel = {
        assert: /* @__PURE__ */ __name(function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect2(key));
          }
        }, "assert"),
        "delete": /* @__PURE__ */ __name(function(key) {
          var deletedNode = listDelete($o, key);
          if (deletedNode && $o && !$o.next) {
            $o = void 0;
          }
          return !!deletedNode;
        }, "delete"),
        get: /* @__PURE__ */ __name(function(key) {
          return listGet($o, key);
        }, "get"),
        has: /* @__PURE__ */ __name(function(key) {
          return listHas($o, key);
        }, "has"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key,
            value
          );
        }, "set")
      };
      return channel;
    }, "getSideChannelList");
  }
});

// scripts/node-lab/node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "scripts/node-lab/node_modules/es-object-atoms/index.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Object;
  }
});

// scripts/node-lab/node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "scripts/node-lab/node_modules/es-errors/index.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Error;
  }
});

// scripts/node-lab/node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "scripts/node-lab/node_modules/es-errors/eval.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = EvalError;
  }
});

// scripts/node-lab/node_modules/es-errors/range.js
var require_range = __commonJS({
  "scripts/node-lab/node_modules/es-errors/range.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = RangeError;
  }
});

// scripts/node-lab/node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "scripts/node-lab/node_modules/es-errors/ref.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = ReferenceError;
  }
});

// scripts/node-lab/node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "scripts/node-lab/node_modules/es-errors/syntax.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = SyntaxError;
  }
});

// scripts/node-lab/node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "scripts/node-lab/node_modules/es-errors/uri.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = URIError;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/abs.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Math.abs;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/floor.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Math.floor;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/max.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Math.max;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/min.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Math.min;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/pow.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Math.pow;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/round.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Math.round;
  }
});

// scripts/node-lab/node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/isNaN.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Number.isNaN || /* @__PURE__ */ __name(function isNaN2(a) {
      return a !== a;
    }, "isNaN");
  }
});

// scripts/node-lab/node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "scripts/node-lab/node_modules/math-intrinsics/sign.js"(exports, module) {
    "use strict";
    init_globals();
    var $isNaN = require_isNaN();
    module.exports = /* @__PURE__ */ __name(function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    }, "sign");
  }
});

// scripts/node-lab/node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "scripts/node-lab/node_modules/gopd/gOPD.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Object.getOwnPropertyDescriptor;
  }
});

// scripts/node-lab/node_modules/gopd/index.js
var require_gopd = __commonJS({
  "scripts/node-lab/node_modules/gopd/index.js"(exports, module) {
    "use strict";
    init_globals();
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  }
});

// scripts/node-lab/node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "scripts/node-lab/node_modules/es-define-property/index.js"(exports, module) {
    "use strict";
    init_globals();
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module.exports = $defineProperty;
  }
});

// scripts/node-lab/node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "scripts/node-lab/node_modules/has-symbols/shams.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = /* @__PURE__ */ __name(function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = /* @__PURE__ */ Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    }, "hasSymbols");
  }
});

// scripts/node-lab/node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "scripts/node-lab/node_modules/has-symbols/index.js"(exports, module) {
    "use strict";
    init_globals();
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = /* @__PURE__ */ __name(function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    }, "hasNativeSymbols");
  }
});

// scripts/node-lab/node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "scripts/node-lab/node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// scripts/node-lab/node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "scripts/node-lab/node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
    "use strict";
    init_globals();
    var $Object = require_es_object_atoms();
    module.exports = $Object.getPrototypeOf || null;
  }
});

// scripts/node-lab/node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "scripts/node-lab/node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    init_globals();
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max2 = Math.max;
    var funcType = "[object Function]";
    var concatty = /* @__PURE__ */ __name(function concatty2(a, b) {
      var arr = [];
      for (var i2 = 0; i2 < a.length; i2 += 1) {
        arr[i2] = a[i2];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    }, "concatty");
    var slicy = /* @__PURE__ */ __name(function slicy2(arrLike, offset) {
      var arr = [];
      for (var i2 = offset || 0, j = 0; i2 < arrLike.length; i2 += 1, j += 1) {
        arr[j] = arrLike[i2];
      }
      return arr;
    }, "slicy");
    var joiny = /* @__PURE__ */ __name(function(arr, joiner) {
      var str = "";
      for (var i2 = 0; i2 < arr.length; i2 += 1) {
        str += arr[i2];
        if (i2 + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    }, "joiny");
    module.exports = /* @__PURE__ */ __name(function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = /* @__PURE__ */ __name(function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      }, "binder");
      var boundLength = max2(0, target.length - args.length);
      var boundArgs = [];
      for (var i2 = 0; i2 < boundLength; i2++) {
        boundArgs[i2] = "$" + i2;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = /* @__PURE__ */ __name(function Empty2() {
        }, "Empty");
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    }, "bind");
  }
});

// scripts/node-lab/node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "scripts/node-lab/node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    init_globals();
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// scripts/node-lab/node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "scripts/node-lab/node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Function.prototype.call;
  }
});

// scripts/node-lab/node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "scripts/node-lab/node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = Function.prototype.apply;
  }
});

// scripts/node-lab/node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "scripts/node-lab/node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// scripts/node-lab/node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "scripts/node-lab/node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
    "use strict";
    init_globals();
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module.exports = $reflectApply || bind.call($call, $apply);
  }
});

// scripts/node-lab/node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "scripts/node-lab/node_modules/call-bind-apply-helpers/index.js"(exports, module) {
    "use strict";
    init_globals();
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module.exports = /* @__PURE__ */ __name(function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    }, "callBindBasic");
  }
});

// scripts/node-lab/node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "scripts/node-lab/node_modules/dunder-proto/get.js"(exports, module) {
    "use strict";
    init_globals();
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      /* @__PURE__ */ __name(function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }, "getDunder")
    ) : false;
  }
});

// scripts/node-lab/node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "scripts/node-lab/node_modules/get-proto/index.js"(exports, module) {
    "use strict";
    init_globals();
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module.exports = reflectGetProto ? /* @__PURE__ */ __name(function getProto(O) {
      return reflectGetProto(O);
    }, "getProto") : originalGetProto ? /* @__PURE__ */ __name(function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    }, "getProto") : getDunderProto ? /* @__PURE__ */ __name(function getProto(O) {
      return getDunderProto(O);
    }, "getProto") : null;
  }
});

// scripts/node-lab/node_modules/hasown/index.js
var require_hasown = __commonJS({
  "scripts/node-lab/node_modules/hasown/index.js"(exports, module) {
    "use strict";
    init_globals();
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module.exports = bind.call(call, $hasOwn);
  }
});

// scripts/node-lab/node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "scripts/node-lab/node_modules/get-intrinsic/index.js"(exports, module) {
    "use strict";
    init_globals();
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max2 = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    }, "getEvalledConstructor");
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = /* @__PURE__ */ __name(function() {
      throw new $TypeError();
    }, "throwTypeError");
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max2,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = /* @__PURE__ */ __name(function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    }, "doEval");
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    }, "stringToPath");
    var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    }, "getBaseIntrinsic");
    module.exports = /* @__PURE__ */ __name(function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i2 = 1, isOwn = true; i2 < parts.length; i2 += 1) {
        var part = parts[i2];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i2 + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    }, "GetIntrinsic");
  }
});

// scripts/node-lab/node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "scripts/node-lab/node_modules/call-bound/index.js"(exports, module) {
    "use strict";
    init_globals();
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module.exports = /* @__PURE__ */ __name(function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    }, "callBoundIntrinsic");
  }
});

// scripts/node-lab/node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "scripts/node-lab/node_modules/side-channel-map/index.js"(exports, module) {
    "use strict";
    init_globals();
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect2 = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
    /* @__PURE__ */ __name(function getSideChannelMap() {
      var $m;
      var channel = {
        assert: /* @__PURE__ */ __name(function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect2(key));
          }
        }, "assert"),
        "delete": /* @__PURE__ */ __name(function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        }, "delete"),
        get: /* @__PURE__ */ __name(function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        }, "get"),
        has: /* @__PURE__ */ __name(function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        }, "has"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }, "set")
      };
      return channel;
    }, "getSideChannelMap");
  }
});

// scripts/node-lab/node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "scripts/node-lab/node_modules/side-channel-weakmap/index.js"(exports, module) {
    "use strict";
    init_globals();
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect2 = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module.exports = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      /* @__PURE__ */ __name(function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: /* @__PURE__ */ __name(function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect2(key));
            }
          }, "assert"),
          "delete": /* @__PURE__ */ __name(function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          }, "delete"),
          get: /* @__PURE__ */ __name(function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          }, "get"),
          has: /* @__PURE__ */ __name(function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          }, "has"),
          set: /* @__PURE__ */ __name(function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }, "set")
        };
        return channel;
      }, "getSideChannelWeakMap")
    ) : getSideChannelMap;
  }
});

// scripts/node-lab/node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "scripts/node-lab/node_modules/side-channel/index.js"(exports, module) {
    "use strict";
    init_globals();
    var $TypeError = require_type();
    var inspect2 = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module.exports = /* @__PURE__ */ __name(function getSideChannel() {
      var $channelData;
      var channel = {
        assert: /* @__PURE__ */ __name(function(key) {
          if (!channel.has(key)) {
            var keyDesc = key && Object(key) === key ? "the given object key" : inspect2(key);
            throw new $TypeError("Side channel does not contain " + keyDesc);
          }
        }, "assert"),
        "delete": /* @__PURE__ */ __name(function(key) {
          return !!$channelData && $channelData["delete"](key);
        }, "delete"),
        get: /* @__PURE__ */ __name(function(key) {
          return $channelData && $channelData.get(key);
        }, "get"),
        has: /* @__PURE__ */ __name(function(key) {
          return !!$channelData && $channelData.has(key);
        }, "has"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }, "set")
      };
      return channel;
    }, "getSideChannel");
  }
});

// scripts/node-lab/node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "scripts/node-lab/node_modules/qs/lib/formats.js"(exports, module) {
    "use strict";
    init_globals();
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: /* @__PURE__ */ __name(function(value) {
          return replace.call(value, percentTwenties, "+");
        }, "RFC1738"),
        RFC3986: /* @__PURE__ */ __name(function(value) {
          return String(value);
        }, "RFC3986")
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// scripts/node-lab/node_modules/qs/lib/utils.js
var require_utils = __commonJS({
  "scripts/node-lab/node_modules/qs/lib/utils.js"(exports, module) {
    "use strict";
    init_globals();
    var formats = require_formats();
    var getSideChannel = require_side_channel();
    var defineProperty = require_es_define_property();
    var has = Object.prototype.hasOwnProperty;
    var isArray2 = Array.isArray;
    var overflowChannel = getSideChannel();
    var markOverflow = /* @__PURE__ */ __name(function markOverflow2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
      return obj;
    }, "markOverflow");
    var isOverflow = /* @__PURE__ */ __name(function isOverflow2(obj) {
      return overflowChannel.has(obj);
    }, "isOverflow");
    var getMaxIndex = /* @__PURE__ */ __name(function getMaxIndex2(obj) {
      return overflowChannel.get(obj);
    }, "getMaxIndex");
    var setMaxIndex = /* @__PURE__ */ __name(function setMaxIndex2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
    }, "setMaxIndex");
    var conflictChannel = getSideChannel();
    var markConflict = /* @__PURE__ */ __name(function markConflict2(obj, maxIndex) {
      conflictChannel.set(obj, maxIndex);
      return obj;
    }, "markConflict");
    var isConflict = /* @__PURE__ */ __name(function isConflict2(obj) {
      return conflictChannel.has(obj);
    }, "isConflict");
    var getConflictIndex = /* @__PURE__ */ __name(function getConflictIndex2(obj) {
      return conflictChannel.get(obj);
    }, "getConflictIndex");
    var hexTable = (function() {
      var array = [];
      for (var i2 = 0; i2 < 256; ++i2) {
        array[array.length] = "%" + ((i2 < 16 ? "0" : "") + i2.toString(16)).toUpperCase();
      }
      return array;
    })();
    var compactQueue = /* @__PURE__ */ __name(function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];
        if (isArray2(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted[compacted.length] = obj[j];
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    }, "compactQueue");
    var arrayToObject = /* @__PURE__ */ __name(function arrayToObject2(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i2 = 0; i2 < source.length; ++i2) {
        if (typeof source[i2] !== "undefined") {
          obj[i2] = source[i2];
        }
      }
      return obj;
    }, "arrayToObject");
    var setProperty = /* @__PURE__ */ __name(function setProperty2(obj, key, value) {
      if (key === "__proto__" && defineProperty) {
        defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      } else {
        obj[key] = value;
      }
    }, "setProperty");
    var maxNumericIndex = /* @__PURE__ */ __name(function maxNumericIndex2(obj, min) {
      var max2 = min;
      var keys = Object.keys(obj);
      for (var i2 = 0; i2 < keys.length; ++i2) {
        var num = parseInt(keys[i2], 10);
        if (String(num) === keys[i2] && num > max2) {
          max2 = num;
        }
      }
      return max2;
    }, "maxNumericIndex");
    var limitedPair = /* @__PURE__ */ __name(function limitedPair2(first, second, options) {
      var pair = [first, second];
      if (options && typeof options.arrayLimit === "number" && pair.length > options.arrayLimit) {
        if (options.throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        return markOverflow(arrayToObject(pair, options), 1);
      }
      return pair;
    }, "limitedPair");
    var merge = /* @__PURE__ */ __name(function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray2(target)) {
          var nextIndex = target.length;
          if (options && typeof options.arrayLimit === "number" && nextIndex >= options.arrayLimit) {
            if (options.throwOnLimitExceeded) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
          }
          target[nextIndex] = source;
        } else if (target && typeof target === "object") {
          if (isOverflow(target)) {
            var newIndex = getMaxIndex(target) + 1;
            target[newIndex] = source;
            setMaxIndex(target, newIndex);
          } else if (options && options.strictMerge && isConflict(target)) {
            var nextConflict = getConflictIndex(target) + 1;
            if (options.throwOnLimitExceeded && typeof options.arrayLimit === "number" && nextConflict >= options.arrayLimit) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            target[nextConflict] = source;
            markConflict(target, nextConflict);
          } else if (options && options.strictMerge) {
            var conflict = limitedPair(target, source, options);
            return isArray2(conflict) ? markConflict(conflict, 1) : conflict;
          } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return limitedPair(target, source, options);
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        if (isOverflow(source)) {
          var sourceKeys = Object.keys(source);
          var result = options && options.plainObjects ? { __proto__: null, 0: target } : { 0: target };
          for (var m = 0; m < sourceKeys.length; m++) {
            var oldKey = parseInt(sourceKeys[m], 10);
            result[oldKey + 1] = source[sourceKeys[m]];
          }
          return markOverflow(result, getMaxIndex(source) + 1);
        }
        var combined = [target].concat(source);
        if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          return markOverflow(arrayToObject(combined, options), combined.length - 1);
        }
        return combined;
      }
      var mergeTarget = target;
      if (isArray2(target) && !isArray2(source)) {
        mergeTarget = arrayToObject(target, options);
        if (isConflict(target)) {
          markConflict(mergeTarget, target.length - 1);
        }
      }
      if (isArray2(target) && isArray2(source)) {
        source.forEach(function(item, i2) {
          if (has.call(target, i2)) {
            var targetItem = target[i2];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i2] = merge2(targetItem, item, options);
            } else {
              target[target.length] = item;
            }
          } else {
            target[i2] = item;
          }
        });
        if (options && typeof options.arrayLimit === "number" && target.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          return markOverflow(arrayToObject(target, options), target.length - 1);
        }
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          setProperty(acc, key, merge2(acc[key], value, options));
        } else {
          setProperty(acc, key, value);
        }
        if (isOverflow(source) && !isOverflow(acc)) {
          markOverflow(acc, maxNumericIndex(acc, getMaxIndex(source)));
        }
        if (isOverflow(acc)) {
          var keyNum = parseInt(key, 10);
          if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) {
            setMaxIndex(acc, keyNum);
          }
        }
        if (isConflict(acc)) {
          var conflictKey = parseInt(key, 10);
          if (String(conflictKey) === key && conflictKey > getConflictIndex(acc)) {
            markConflict(acc, conflictKey);
          }
        }
        return acc;
      }, mergeTarget);
    }, "merge");
    var assign = /* @__PURE__ */ __name(function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        setProperty(acc, key, source[key]);
        return acc;
      }, target);
    }, "assignSingleSource");
    var decode = /* @__PURE__ */ __name(function(str, defaultDecoder, charset) {
      if (typeof str === "string" && str.indexOf("%") === -1) {
        return str.indexOf("+") === -1 ? str : str.replace(/\+/g, " ");
      }
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    }, "decode");
    var hasToPrimitive = typeof Symbol === "function" && typeof Symbol.toPrimitive === "symbol";
    var arrayJoin = Array.prototype.join;
    var arrayToString = Array.prototype.toString;
    var objectToString = Object.prototype.toString;
    var toCoercible = /* @__PURE__ */ __name(function toCoercible2(value, joining) {
      if (!value || typeof value !== "object" && typeof value !== "function") {
        return value;
      }
      if (hasToPrimitive && value[Symbol.toPrimitive] != null) {
        return value;
      }
      if (isArray2(value) && value.toString === arrayToString && value.join === arrayJoin) {
        var ancestors = joining || getSideChannel();
        if (ancestors.has(value)) {
          return "";
        }
        ancestors.set(value, true);
        var copy;
        for (var i2 = 0; i2 < value.length; i2 += 1) {
          var item = value[i2];
          var coerced = toCoercible2(item, ancestors);
          if (!copy && coerced !== item) {
            copy = [];
            for (var j = 0; j < i2; j += 1) {
              copy[j] = value[j];
            }
          }
          if (copy) {
            copy[i2] = coerced;
          }
        }
        ancestors["delete"](value);
        return copy || value;
      }
      if (typeof value.toString === "function") {
        return value;
      }
      var valueOf = value.valueOf;
      if (typeof valueOf === "function") {
        var primitive = valueOf.call(value);
        if (!primitive || typeof primitive !== "object" && typeof primitive !== "function") {
          return String(primitive);
        }
      }
      return objectToString.call(value);
    }, "toCoercible");
    var limit = 1024;
    var encode = /* @__PURE__ */ __name(function encode2(str, defaultEncoder, charset, kind, format4) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(toCoercible(str));
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        }).replace(/\+/g, "%2B");
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        if (j + limit < string.length) {
          var last = segment.charCodeAt(segment.length - 1);
          if (last >= 55296 && last <= 56319) {
            segment = segment.slice(0, -1);
            j -= 1;
          }
        }
        var arr = [];
        for (var i2 = 0; i2 < segment.length; ++i2) {
          var c = segment.charCodeAt(i2);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format4 === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i2);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i2 += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i2) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    }, "encode");
    var compact = /* @__PURE__ */ __name(function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = getSideChannel();
      for (var i2 = 0; i2 < queue.length; ++i2) {
        var item = queue[i2];
        var obj = item.obj[item.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj[key];
          if (typeof val === "object" && val !== null && !refs.has(val)) {
            queue[queue.length] = { obj, prop: key };
            refs.set(val, true);
          }
        }
      }
      compactQueue(queue);
      return value;
    }, "compact");
    var isRegExp = /* @__PURE__ */ __name(function isRegExp2(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    }, "isRegExp");
    var isBuffer = /* @__PURE__ */ __name(function isBuffer2(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj));
    }, "isBuffer");
    var combine = /* @__PURE__ */ __name(function combine2(a, b, arrayLimit, plainObjects, throwOnLimitExceeded) {
      if (isOverflow(a)) {
        if (throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        var bValues = isArray2(b) ? b : [b];
        var newIndex = getMaxIndex(a);
        for (var i2 = 0; i2 < bValues.length; ++i2) {
          newIndex += 1;
          a[newIndex] = bValues[i2];
        }
        setMaxIndex(a, newIndex);
        return a;
      }
      var result = [].concat(a, b);
      if (result.length > arrayLimit) {
        if (throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
      }
      return result;
    }, "combine");
    var maybeMap = /* @__PURE__ */ __name(function maybeMap2(val, fn) {
      if (isArray2(val)) {
        var mapped = [];
        for (var i2 = 0; i2 < val.length; i2 += 1) {
          mapped[mapped.length] = fn(val[i2]);
        }
        return mapped;
      }
      return fn(val);
    }, "maybeMap");
    module.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isOverflow,
      isRegExp,
      markOverflow,
      maybeMap,
      merge,
      toCoercible
    };
  }
});

// scripts/node-lab/node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "scripts/node-lab/node_modules/qs/lib/stringify.js"(exports, module) {
    "use strict";
    init_globals();
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: /* @__PURE__ */ __name(function brackets(prefix) {
        return prefix + "[]";
      }, "brackets"),
      comma: "comma",
      indices: /* @__PURE__ */ __name(function indices(prefix, key) {
        return prefix + "[" + key + "]";
      }, "indices"),
      repeat: /* @__PURE__ */ __name(function repeat(prefix) {
        return prefix;
      }, "repeat")
    };
    var isArray2 = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = /* @__PURE__ */ __name(function(arr, valueOrArray) {
      push.apply(arr, isArray2(valueOrArray) ? valueOrArray : [valueOrArray]);
    }, "pushToArray");
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults2 = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      depth: Infinity,
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: /* @__PURE__ */ __name(function serializeDate(date) {
        return toISO.call(date);
      }, "serializeDate"),
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = /* @__PURE__ */ __name(function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    }, "isNonNullishPrimitive");
    var sentinel = {};
    var stringify = /* @__PURE__ */ __name(function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format4, formatter, encodeValuesOnly, charset, sideChannel, depth, currentDepth) {
      var obj = object;
      if (currentDepth > depth) {
        throw new RangeError("Input depth exceeded depth option of " + depth);
      }
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      obj = typeof filter === "function" ? filter(prefix, obj) : obj;
      if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray2(obj)) {
        obj = utils.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults2.encoder, charset, "key", format4) : prefix);
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults2.encoder, charset, "key", format4);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults2.encoder, charset, "value", format4))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray2(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils.maybeMap(obj, function(v) {
            return v == null ? v : encoder(v, defaults2.encoder, charset, "value", format4);
          });
        }
        objKeys = [{ value: obj.length > 0 ? utils.toCoercible(obj).join(",") || null : void 0 }];
      } else if (isArray2(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray2(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray2(obj) && obj.length === 0 && Object.keys(obj).length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray2(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify2(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray2(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format4,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel,
          depth,
          currentDepth + 1
        ));
      }
      return values;
    }, "stringify");
    var normalizeStringifyOptions = /* @__PURE__ */ __name(function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults2;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults2.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format4 = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format4 = opts.format;
      }
      var formatter = formats.formatters[format4];
      var filter = defaults2.filter;
      if (typeof opts.filter === "function" || isArray2(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (has.call(arrayPrefixGenerators, opts.arrayFormat)) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults2.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults2.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults2.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults2.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults2.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults2.delimiter : opts.delimiter,
        depth: typeof opts.depth === "number" ? opts.depth : defaults2.depth,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults2.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults2.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults2.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults2.encodeValuesOnly,
        filter,
        format: format4,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults2.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults2.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults2.strictNullHandling
      };
    }, "normalizeStringifyOptions");
    module.exports = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray2(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i2 = 0; i2 < objKeys.length; ++i2) {
        var key = objKeys[i2];
        if (typeof key === "undefined" || key === null) {
          continue;
        }
        var value = obj[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        var encodedKey = options.encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        pushToArray(keys, stringify(
          value,
          encodedKey,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel,
          options.depth,
          0
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B" + options.delimiter;
        } else {
          prefix += "utf8=%E2%9C%93" + options.delimiter;
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// scripts/node-lab/node_modules/qs/lib/parse.js
var require_parse = __commonJS({
  "scripts/node-lab/node_modules/qs/lib/parse.js"(exports, module) {
    "use strict";
    init_globals();
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var has = Object.prototype.hasOwnProperty;
    var isArray2 = Array.isArray;
    var getPrototypeOf = Object.getPrototypeOf;
    var isPlainContainer = /* @__PURE__ */ __name(function isPlainContainer2(value) {
      if (!value || typeof value !== "object") {
        return false;
      }
      if (isArray2(value)) {
        return true;
      }
      var proto = getPrototypeOf(value);
      return proto === Object.prototype || proto === null;
    }, "isPlainContainer");
    var emptyCopyOf = /* @__PURE__ */ __name(function emptyCopyOf2(value) {
      if (isArray2(value)) {
        var arr = [];
        arr.length = value.length;
        return arr;
      }
      return getPrototypeOf(value) === null ? { __proto__: null } : {};
    }, "emptyCopyOf");
    var copyInput = /* @__PURE__ */ __name(function copyInput2(input) {
      var copies = getSideChannel();
      var result = {};
      var queue = [{ source: input, target: result }];
      for (var i2 = 0; i2 < queue.length; ++i2) {
        var source = queue[i2].source;
        var target = queue[i2].target;
        var keys = Object.keys(source);
        for (var j = 0; j < keys.length; ++j) {
          var value = source[keys[j]];
          if (isPlainContainer(value)) {
            if (!copies.has(value)) {
              var copy = emptyCopyOf(value);
              copies.set(value, copy);
              queue[queue.length] = { source: value, target: copy };
            }
            target[keys[j]] = copies.get(value);
          } else {
            target[keys[j]] = value;
          }
        }
      }
      return result;
    }, "copyInput");
    var defaults2 = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictMerge: true,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = /* @__PURE__ */ __name(function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    }, "interpretNumericEntities");
    var parseArrayValue = /* @__PURE__ */ __name(function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        if (options.throwOnLimitExceeded) {
          var commaCount = 0;
          var commaIndex = val.indexOf(",");
          while (commaIndex > -1) {
            commaCount += 1;
            if (commaCount >= options.arrayLimit) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            commaIndex = val.indexOf(",", commaIndex + 1);
          }
        }
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    }, "parseArrayValue");
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = /* @__PURE__ */ __name(function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded && typeof limit !== "undefined" ? limit + 1 : limit
      );
      if (options.throwOnLimitExceeded && typeof limit !== "undefined" && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i2;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i2 = 0; i2 < parts.length; ++i2) {
          if (parts[i2].indexOf("utf8=") === 0) {
            if (parts[i2] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i2] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i2;
            i2 = parts.length;
          }
        }
      }
      for (i2 = 0; i2 < parts.length; ++i2) {
        if (i2 === skipIndex) {
          continue;
        }
        var part = parts[i2];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var isEmptyBracketKey = pos > 1 && part.slice(pos - 2, pos) === "[]";
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults2.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults2.decoder, charset, "key");
          if (key !== null) {
            val = utils.maybeMap(
              parseArrayValue(
                part.slice(pos + 1),
                options,
                isArray2(obj[key]) ? obj[key].length : 0
              ),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults2.decoder, charset, "value");
              }
            );
          }
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (isEmptyBracketKey) {
          val = isArray2(val) ? [val] : val;
        }
        if (options.comma && isArray2(val) && val.length > options.arrayLimit) {
          val = utils.combine([], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
        }
        if (key !== null) {
          var existing = has.call(obj, key);
          if (existing && (options.duplicates === "combine" || isEmptyBracketKey)) {
            obj[key] = utils.combine(
              obj[key],
              val,
              options.arrayLimit,
              options.plainObjects,
              options.throwOnLimitExceeded
            );
          } else if (!existing || options.duplicates === "last") {
            obj[key] = val;
          }
        }
      }
      return obj;
    }, "parseQueryStringValues");
    var parseObject = /* @__PURE__ */ __name(function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i2 = chain.length - 1; i2 >= 0; --i2) {
        var obj;
        var root = chain[i2];
        if (root === "[]" && options.parseArrays) {
          if (utils.isOverflow(leaf)) {
            obj = leaf;
          } else {
            obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine(
              [],
              leaf,
              options.arrayLimit,
              options.plainObjects,
              options.throwOnLimitExceeded
            );
          }
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (isValidArrayIndex && index < options.arrayLimit) {
            obj = [];
            obj[index] = leaf;
          } else if (isValidArrayIndex && options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          } else if (isValidArrayIndex) {
            obj[index] = leaf;
            utils.markOverflow(obj, index);
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    }, "parseObject");
    var topLevelDotsToBrackets = /* @__PURE__ */ __name(function topLevelDotsToBrackets2(key) {
      var result = "";
      var depth = 0;
      for (var i2 = 0; i2 < key.length; i2 += 1) {
        var cu = key.charCodeAt(i2);
        if (cu === 91) {
          depth += 1;
          result += "[";
        } else if (cu === 93) {
          if (depth > 0) {
            depth -= 1;
          }
          result += "]";
        } else if (cu === 46 && depth === 0 && i2 + 1 < key.length && key.charCodeAt(i2 + 1) !== 46 && key.charCodeAt(i2 + 1) !== 91) {
          var start = i2 + 1;
          var j = start;
          while (j < key.length && key.charCodeAt(j) !== 46 && key.charCodeAt(j) !== 91) {
            j += 1;
          }
          result += "[" + key.slice(start, j) + "]";
          i2 = j - 1;
        } else {
          result += key.charAt(i2);
        }
      }
      return result;
    }, "topLevelDotsToBrackets");
    var splitKeyIntoSegments = /* @__PURE__ */ __name(function splitKeyIntoSegments2(originalKey, options) {
      var key = options.allowDots ? topLevelDotsToBrackets(originalKey) : originalKey;
      if (options.depth <= 0) {
        if (!options.plainObjects && has.call(Object.prototype, key)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        return [key];
      }
      var segments = [];
      var first = key.indexOf("[");
      var parent = first >= 0 ? key.slice(0, first) : key;
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        segments[segments.length] = parent;
      }
      var n = key.length;
      var open = first;
      var collected = 0;
      while (open >= 0 && collected < options.depth) {
        var level = 1;
        var i2 = open + 1;
        var close = -1;
        while (i2 < n && close < 0) {
          var cu = key.charCodeAt(i2);
          if (cu === 91) {
            level += 1;
          } else if (cu === 93) {
            level -= 1;
            if (level === 0) {
              close = i2;
            }
          }
          i2 += 1;
        }
        if (close < 0) {
          segments[segments.length] = "[" + key.slice(open) + "]";
          return segments;
        }
        var seg = key.slice(open, close + 1);
        var content = seg.slice(1, -1);
        if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) {
          return;
        }
        segments[segments.length] = seg;
        collected += 1;
        open = key.indexOf("[", close + 1);
      }
      if (open >= 0) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        segments[segments.length] = "[" + key.slice(open) + "]";
      }
      return segments;
    }, "splitKeyIntoSegments");
    var parseKeys = /* @__PURE__ */ __name(function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var keys = splitKeyIntoSegments(givenKey, options);
      if (!keys) {
        return;
      }
      return parseObject(keys, val, options, valuesParsed);
    }, "parseQueryStringKeys");
    var normalizeParseOptions = /* @__PURE__ */ __name(function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults2;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults2.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults2.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults2.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults2.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults2.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults2.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults2.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults2.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults2.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults2.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults2.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults2.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults2.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults2.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults2.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults2.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults2.strictDepth,
        strictMerge: typeof opts.strictMerge === "boolean" ? !!opts.strictMerge : defaults2.strictMerge,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults2.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    }, "normalizeParseOptions");
    module.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : copyInput(str);
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i2 = 0; i2 < keys.length; ++i2) {
        var key = keys[i2];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj = utils.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils.compact(obj);
    };
  }
});

// scripts/node-lab/node_modules/qs/lib/index.js
var require_lib = __commonJS({
  "scripts/node-lab/node_modules/qs/lib/index.js"(exports, module) {
    "use strict";
    init_globals();
    var stringify = require_stringify();
    var parse3 = require_parse();
    var formats = require_formats();
    module.exports = {
      formats,
      parse: parse3,
      stringify
    };
  }
});

// scripts/node-lab/node_modules/url/url.js
var require_url = __commonJS({
  "scripts/node-lab/node_modules/url/url.js"(exports) {
    "use strict";
    init_globals();
    var punycode = require_punycode();
    function Url3() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    __name(Url3, "Url");
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/;
    var delims = [
      "<",
      ">",
      '"',
      "`",
      " ",
      "\r",
      "\n",
      "	"
    ];
    var unwise = [
      "{",
      "}",
      "|",
      "\\",
      "^",
      "`"
    ].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = [
      "%",
      "/",
      "?",
      ";",
      "#"
    ].concat(autoEscape);
    var hostEndingChars = [
      "/",
      "?",
      "#"
    ];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      javascript: true,
      "javascript:": true
    };
    var hostlessProtocol = {
      javascript: true,
      "javascript:": true
    };
    var slashedProtocol = {
      http: true,
      https: true,
      ftp: true,
      gopher: true,
      file: true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring2 = require_lib();
    function urlParse(url2, parseQueryString, slashesDenoteHost) {
      if (url2 && typeof url2 === "object" && url2 instanceof Url3) {
        return url2;
      }
      var u = new Url3();
      u.parse(url2, parseQueryString, slashesDenoteHost);
      return u;
    }
    __name(urlParse, "urlParse");
    Url3.prototype.parse = function(url2, parseQueryString, slashesDenoteHost) {
      if (typeof url2 !== "string") {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url2);
      }
      var queryIndex = url2.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url2.indexOf("#") ? "?" : "#", uSplit = url2.split(splitter), slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, "/");
      url2 = uSplit.join(splitter);
      var rest = url2;
      rest = rest.trim();
      if (!slashesDenoteHost && url2.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring2.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = "";
            this.query = {};
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i2 = 0; i2 < hostEndingChars.length; i2++) {
          var hec = rest.indexOf(hostEndingChars[i2]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i2 = 0; i2 < nonHostChars.length; i2++) {
          var hec = rest.indexOf(nonHostChars[i2]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        if (hostEnd === -1) {
          hostEnd = rest.length;
        }
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i2 = 0, l = hostparts.length; i2 < l; i2++) {
            var part = hostparts[i2];
            if (!part) {
              continue;
            }
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i2);
                var notHost = hostparts.slice(i2 + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          this.hostname = punycode.toASCII(this.hostname);
        }
        var p = this.port ? ":" + this.port : "";
        var h = this.hostname || "";
        this.host = h + p;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i2 = 0, l = autoEscape.length; i2 < l; i2++) {
          var ae = autoEscape[i2];
          if (rest.indexOf(ae) === -1) {
            continue;
          }
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring2.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest) {
        this.pathname = rest;
      }
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p = this.pathname || "";
        var s = this.search || "";
        this.path = p + s;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (typeof obj === "string") {
        obj = urlParse(obj);
      }
      if (!(obj instanceof Url3)) {
        return Url3.prototype.format.call(obj);
      }
      return obj.format();
    }
    __name(urlFormat, "urlFormat");
    Url3.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && typeof this.query === "object" && Object.keys(this.query).length) {
        query = querystring2.stringify(this.query, {
          arrayFormat: "repeat",
          addQueryPrefix: false
        });
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":") {
        protocol += ":";
      }
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/") {
          pathname = "/" + pathname;
        }
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#") {
        hash = "#" + hash;
      }
      if (search && search.charAt(0) !== "?") {
        search = "?" + search;
      }
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    __name(urlResolve, "urlResolve");
    Url3.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source) {
        return relative;
      }
      return urlParse(source, false, true).resolveObject(relative);
    }
    __name(urlResolveObject, "urlResolveObject");
    Url3.prototype.resolveObject = function(relative) {
      if (typeof relative === "string") {
        var rel = new Url3();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url3();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== "protocol") {
            result[rkey] = relative[rkey];
          }
        }
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.pathname = "/";
          result.path = result.pathname;
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift())) {
          }
          if (!relative.host) {
            relative.host = "";
          }
          if (!relative.hostname) {
            relative.hostname = "";
          }
          if (relPath[0] !== "") {
            relPath.unshift("");
          }
          if (relPath.length < 2) {
            relPath.unshift("");
          }
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p = result.pathname || "";
          var s = result.search || "";
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "") {
            srcPath[0] = result.host;
          } else {
            srcPath.unshift(result.host);
          }
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "") {
              relPath[0] = relative.host;
            } else {
              relPath.unshift(relative.host);
            }
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath) {
          srcPath = [];
        }
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (relative.search != null) {
        if (psychotic) {
          result.host = srcPath.shift();
          result.hostname = result.host;
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.hostname = authInHost.shift();
            result.host = result.hostname;
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (result.pathname !== null || result.search !== null) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i2 = srcPath.length; i2 >= 0; i2--) {
        last = srcPath[i2];
        if (last === ".") {
          srcPath.splice(i2, 1);
        } else if (last === "..") {
          srcPath.splice(i2, 1);
          up++;
        } else if (up) {
          srcPath.splice(i2, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        result.host = result.hostname;
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.hostname = authInHost.shift();
          result.host = result.hostname;
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (srcPath.length > 0) {
        result.pathname = srcPath.join("/");
      } else {
        result.pathname = null;
        result.path = null;
      }
      if (result.pathname !== null || result.search !== null) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url3.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) {
        this.hostname = host;
      }
    };
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    exports.Url = Url3;
  }
});

// scripts/node-lab/node_modules/querystring-es3/decode.js
var require_decode = __commonJS({
  "scripts/node-lab/node_modules/querystring-es3/decode.js"(exports, module) {
    "use strict";
    init_globals();
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    __name(hasOwnProperty, "hasOwnProperty");
    module.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i2 = 0; i2 < len; ++i2) {
        var x2 = qs[i2].replace(regexp, "%20"), idx = x2.indexOf(eq), kstr, vstr, k, v;
        if (idx >= 0) {
          kstr = x2.substr(0, idx);
          vstr = x2.substr(idx + 1);
        } else {
          kstr = x2;
          vstr = "";
        }
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (isArray2(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
      return obj;
    };
    var isArray2 = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// scripts/node-lab/node_modules/querystring-es3/encode.js
var require_encode = __commonJS({
  "scripts/node-lab/node_modules/querystring-es3/encode.js"(exports, module) {
    "use strict";
    init_globals();
    var stringifyPrimitive = /* @__PURE__ */ __name(function(v) {
      switch (typeof v) {
        case "string":
          return v;
        case "boolean":
          return v ? "true" : "false";
        case "number":
          return isFinite(v) ? v : "";
        default:
          return "";
      }
    }, "stringifyPrimitive");
    module.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return map(objectKeys(obj), function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (isArray2(obj[k])) {
            return map(obj[k], function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }
      if (!name) return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
    var isArray2 = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
    function map(xs, f) {
      if (xs.map) return xs.map(f);
      var res = [];
      for (var i2 = 0; i2 < xs.length; i2++) {
        res.push(f(xs[i2], i2));
      }
      return res;
    }
    __name(map, "map");
    var objectKeys = Object.keys || function(obj) {
      var res = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
      }
      return res;
    };
  }
});

// scripts/node-lab/node_modules/querystring-es3/index.js
var require_querystring_es3 = __commonJS({
  "scripts/node-lab/node_modules/querystring-es3/index.js"(exports) {
    "use strict";
    init_globals();
    exports.decode = exports.parse = require_decode();
    exports.encode = exports.stringify = require_encode();
  }
});

// scripts/node-lab/node_modules/fflate/esm/browser.js
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gzipSync(data, opts) {
  if (!opts)
    opts = {};
  var c = crc(), l = data.length;
  c.p(data);
  var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
function zlibSync(data, opts) {
  if (!opts)
    opts = {};
  var a = adler();
  a.p(data);
  var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var u8, u16, i32, fleb, fdeb, clim, freb, _a, fl, revfl, _b, fd, revfd, rev, x, i, hMap, flt, i, i, i, i, fdt, i, flm, flrm, fdm, fdrm, max, bits, bits16, shft, slc, ec, err, inflt, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, deo, et, dflt, crct, crc, adler, dopt, wbytes, gzh, gzs, gzl, gzhl, zlh, zls, td, tds;
var init_browser = __esm({
  "scripts/node-lab/node_modules/fflate/esm/browser.js"() {
    init_globals();
    u8 = Uint8Array;
    u16 = Uint16Array;
    i32 = Int32Array;
    fleb = new u8([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      /* unused */
      0,
      0,
      /* impossible */
      0
    ]);
    fdeb = new u8([
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      /* unused */
      0,
      0
    ]);
    clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    freb = /* @__PURE__ */ __name(function(eb, start) {
      var b = new u16(31);
      for (var i2 = 0; i2 < 31; ++i2) {
        b[i2] = start += 1 << eb[i2 - 1];
      }
      var r = new i32(b[30]);
      for (var i2 = 1; i2 < 30; ++i2) {
        for (var j = b[i2]; j < b[i2 + 1]; ++j) {
          r[j] = j - b[i2] << 5 | i2;
        }
      }
      return { b, r };
    }, "freb");
    _a = freb(fleb, 2);
    fl = _a.b;
    revfl = _a.r;
    fl[28] = 258, revfl[258] = 28;
    _b = freb(fdeb, 0);
    fd = _b.b;
    revfd = _b.r;
    rev = new u16(32768);
    for (i = 0; i < 32768; ++i) {
      x = (i & 43690) >> 1 | (i & 21845) << 1;
      x = (x & 52428) >> 2 | (x & 13107) << 2;
      x = (x & 61680) >> 4 | (x & 3855) << 4;
      rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
    }
    hMap = /* @__PURE__ */ __name((function(cd, mb, r) {
      var s = cd.length;
      var i2 = 0;
      var l = new u16(mb);
      for (; i2 < s; ++i2) {
        if (cd[i2])
          ++l[cd[i2] - 1];
      }
      var le = new u16(mb);
      for (i2 = 1; i2 < mb; ++i2) {
        le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
      }
      var co;
      if (r) {
        co = new u16(1 << mb);
        var rvb = 15 - mb;
        for (i2 = 0; i2 < s; ++i2) {
          if (cd[i2]) {
            var sv = i2 << 4 | cd[i2];
            var r_1 = mb - cd[i2];
            var v = le[cd[i2] - 1]++ << r_1;
            for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
              co[rev[v] >> rvb] = sv;
            }
          }
        }
      } else {
        co = new u16(s);
        for (i2 = 0; i2 < s; ++i2) {
          if (cd[i2]) {
            co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
          }
        }
      }
      return co;
    }), "hMap");
    flt = new u8(288);
    for (i = 0; i < 144; ++i)
      flt[i] = 8;
    for (i = 144; i < 256; ++i)
      flt[i] = 9;
    for (i = 256; i < 280; ++i)
      flt[i] = 7;
    for (i = 280; i < 288; ++i)
      flt[i] = 8;
    fdt = new u8(32);
    for (i = 0; i < 32; ++i)
      fdt[i] = 5;
    flm = /* @__PURE__ */ hMap(flt, 9, 0);
    flrm = /* @__PURE__ */ hMap(flt, 9, 1);
    fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
    fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
    max = /* @__PURE__ */ __name(function(a) {
      var m = a[0];
      for (var i2 = 1; i2 < a.length; ++i2) {
        if (a[i2] > m)
          m = a[i2];
      }
      return m;
    }, "max");
    bits = /* @__PURE__ */ __name(function(d, p, m) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
    }, "bits");
    bits16 = /* @__PURE__ */ __name(function(d, p) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
    }, "bits16");
    shft = /* @__PURE__ */ __name(function(p) {
      return (p + 7) / 8 | 0;
    }, "shft");
    slc = /* @__PURE__ */ __name(function(v, s, e) {
      if (s == null || s < 0)
        s = 0;
      if (e == null || e > v.length)
        e = v.length;
      return new u8(v.subarray(s, e));
    }, "slc");
    ec = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      // determined by compression function
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data"
      // determined by unknown compression method
    ];
    err = /* @__PURE__ */ __name(function(ind, msg2, nt) {
      var e = new Error(msg2 || ec[ind]);
      e.code = ind;
      if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
      if (!nt)
        throw e;
      return e;
    }, "err");
    inflt = /* @__PURE__ */ __name(function(dat, st, buf, dict) {
      var sl = dat.length, dl = dict ? dict.length : 0;
      if (!sl || st.f && !st.l)
        return buf || new u8(0);
      var noBuf = !buf;
      var resize = noBuf || st.i != 2;
      var noSt = st.i;
      if (noBuf)
        buf = new u8(sl * 3);
      var cbuf = /* @__PURE__ */ __name(function(l2) {
        var bl = buf.length;
        if (l2 > bl) {
          var nbuf = new u8(Math.max(bl * 2, l2));
          nbuf.set(buf);
          buf = nbuf;
        }
      }, "cbuf");
      var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
      var tbts = sl * 8;
      do {
        if (!lm) {
          final = bits(dat, pos, 1);
          var type2 = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type2) {
            var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
            if (t > sl) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + l);
            buf.set(dat.subarray(s, t), bt);
            st.b = bt += l, st.p = pos = t * 8, st.f = final;
            continue;
          } else if (type2 == 1)
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          else if (type2 == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
            var tl = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            var ldt = new u8(tl);
            var clt = new u8(19);
            for (var i2 = 0; i2 < hcLen; ++i2) {
              clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
            }
            pos += hcLen * 3;
            var clb = max(clt), clbmsk = (1 << clb) - 1;
            var clm = hMap(clt, clb, 1);
            for (var i2 = 0; i2 < tl; ) {
              var r = clm[bits(dat, pos, clbmsk)];
              pos += r & 15;
              var s = r >> 4;
              if (s < 16) {
                ldt[i2++] = s;
              } else {
                var c = 0, n = 0;
                if (s == 16)
                  n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
                else if (s == 17)
                  n = 3 + bits(dat, pos, 7), pos += 3;
                else if (s == 18)
                  n = 11 + bits(dat, pos, 127), pos += 7;
                while (n--)
                  ldt[i2++] = c;
              }
            }
            var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
            lbt = max(lt);
            dbt = max(dt);
            lm = hMap(lt, lbt, 1);
            dm = hMap(dt, dbt, 1);
          } else
            err(1);
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
        }
        if (resize)
          cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (; ; lpos = pos) {
          var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
          pos += c & 15;
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (!c)
            err(2);
          if (sym < 256)
            buf[bt++] = sym;
          else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            if (sym > 264) {
              var i2 = sym - 257, b = fleb[i2];
              add = bits(dat, pos, (1 << b) - 1) + fl[i2];
              pos += b;
            }
            var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
            if (!d)
              err(3);
            pos += d & 15;
            var dt = fd[dsym];
            if (dsym > 3) {
              var b = fdeb[dsym];
              dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
            }
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + 131072);
            var end = bt + add;
            if (bt < dt) {
              var shift = dl - dt, dend = Math.min(dt, end);
              if (shift + bt < 0)
                err(3);
              for (; bt < dend; ++bt)
                buf[bt] = dict[shift + bt];
            }
            for (; bt < end; ++bt)
              buf[bt] = buf[bt - dt];
          }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
          final = 1, st.m = lbt, st.d = dm, st.n = dbt;
      } while (!final);
      return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
    }, "inflt");
    wbits = /* @__PURE__ */ __name(function(d, p, v) {
      v <<= p & 7;
      var o = p / 8 | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
    }, "wbits");
    wbits16 = /* @__PURE__ */ __name(function(d, p, v) {
      v <<= p & 7;
      var o = p / 8 | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
      d[o + 2] |= v >> 16;
    }, "wbits16");
    hTree = /* @__PURE__ */ __name(function(d, mb) {
      var t = [];
      for (var i2 = 0; i2 < d.length; ++i2) {
        if (d[i2])
          t.push({ s: i2, f: d[i2] });
      }
      var s = t.length;
      var t2 = t.slice();
      if (!s)
        return { t: et, l: 0 };
      if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
      }
      t.sort(function(a, b) {
        return a.f - b.f;
      });
      t.push({ s: -1, f: 25001 });
      var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
      t[0] = { s: -1, f: l.f + r.f, l, r };
      while (i1 != s - 1) {
        l = t[t[i0].f < t[i22].f ? i0++ : i22++];
        r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
        t[i1++] = { s: -1, f: l.f + r.f, l, r };
      }
      var maxSym = t2[0].s;
      for (var i2 = 1; i2 < s; ++i2) {
        if (t2[i2].s > maxSym)
          maxSym = t2[i2].s;
      }
      var tr = new u16(maxSym + 1);
      var mbt = ln(t[i1 - 1], tr, 0);
      if (mbt > mb) {
        var i2 = 0, dt = 0;
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function(a, b) {
          return tr[b.s] - tr[a.s] || a.f - b.f;
        });
        for (; i2 < s; ++i2) {
          var i2_1 = t2[i2].s;
          if (tr[i2_1] > mb) {
            dt += cst - (1 << mbt - tr[i2_1]);
            tr[i2_1] = mb;
          } else
            break;
        }
        dt >>= lft;
        while (dt > 0) {
          var i2_2 = t2[i2].s;
          if (tr[i2_2] < mb)
            dt -= 1 << mb - tr[i2_2]++ - 1;
          else
            ++i2;
        }
        for (; i2 >= 0 && dt; --i2) {
          var i2_3 = t2[i2].s;
          if (tr[i2_3] == mb) {
            --tr[i2_3];
            ++dt;
          }
        }
        mbt = mb;
      }
      return { t: new u8(tr), l: mbt };
    }, "hTree");
    ln = /* @__PURE__ */ __name(function(n, l, d) {
      return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
    }, "ln");
    lc = /* @__PURE__ */ __name(function(c) {
      var s = c.length;
      while (s && !c[--s])
        ;
      var cl = new u16(++s);
      var cli = 0, cln = c[0], cls = 1;
      var w = /* @__PURE__ */ __name(function(v) {
        cl[cli++] = v;
      }, "w");
      for (var i2 = 1; i2 <= s; ++i2) {
        if (c[i2] == cln && i2 != s)
          ++cls;
        else {
          if (!cln && cls > 2) {
            for (; cls > 138; cls -= 138)
              w(32754);
            if (cls > 2) {
              w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
              cls = 0;
            }
          } else if (cls > 3) {
            w(cln), --cls;
            for (; cls > 6; cls -= 6)
              w(8304);
            if (cls > 2)
              w(cls - 3 << 5 | 8208), cls = 0;
          }
          while (cls--)
            w(cln);
          cls = 1;
          cln = c[i2];
        }
      }
      return { c: cl.subarray(0, cli), n: s };
    }, "lc");
    clen = /* @__PURE__ */ __name(function(cf, cl) {
      var l = 0;
      for (var i2 = 0; i2 < cl.length; ++i2)
        l += cf[i2] * cl[i2];
      return l;
    }, "clen");
    wfblk = /* @__PURE__ */ __name(function(out, pos, dat) {
      var s = dat.length;
      var o = shft(pos + 2);
      out[o] = s & 255;
      out[o + 1] = s >> 8;
      out[o + 2] = out[o] ^ 255;
      out[o + 3] = out[o + 1] ^ 255;
      for (var i2 = 0; i2 < s; ++i2)
        out[o + i2 + 4] = dat[i2];
      return (o + 4 + s) * 8;
    }, "wfblk");
    wblk = /* @__PURE__ */ __name(function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
      wbits(out, p++, final);
      ++lf[256];
      var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
      var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
      var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
      var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
      var lcfreq = new u16(19);
      for (var i2 = 0; i2 < lclt.length; ++i2)
        ++lcfreq[lclt[i2] & 31];
      for (var i2 = 0; i2 < lcdt.length; ++i2)
        ++lcfreq[lcdt[i2] & 31];
      var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
      var nlcc = 19;
      for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
      var flen = bl + 5 << 3;
      var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
      var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
      if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
      var lm, ll, dm, dl;
      wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
      if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i2 = 0; i2 < nlcc; ++i2)
          wbits(out, p + 3 * i2, lct[clim[i2]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
          var clct = lcts[it];
          for (var i2 = 0; i2 < clct.length; ++i2) {
            var len = clct[i2] & 31;
            wbits(out, p, llm[len]), p += lct[len];
            if (len > 15)
              wbits(out, p, clct[i2] >> 5 & 127), p += clct[i2] >> 12;
          }
        }
      } else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
      }
      for (var i2 = 0; i2 < li; ++i2) {
        var sym = syms[i2];
        if (sym > 255) {
          var len = sym >> 18 & 31;
          wbits16(out, p, lm[len + 257]), p += ll[len + 257];
          if (len > 7)
            wbits(out, p, sym >> 23 & 31), p += fleb[len];
          var dst = sym & 31;
          wbits16(out, p, dm[dst]), p += dl[dst];
          if (dst > 3)
            wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
        } else {
          wbits16(out, p, lm[sym]), p += ll[sym];
        }
      }
      wbits16(out, p, lm[256]);
      return p + ll[256];
    }, "wblk");
    deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
    et = /* @__PURE__ */ new u8(0);
    dflt = /* @__PURE__ */ __name(function(dat, lvl, plvl, pre, post, st) {
      var s = st.z || dat.length;
      var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
      var w = o.subarray(pre, o.length - post);
      var lst = st.l;
      var pos = (st.r || 0) & 7;
      if (lvl) {
        if (pos)
          w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = /* @__PURE__ */ __name(function(i3) {
          return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
        }, "hsh");
        var syms = new i32(25e3);
        var lf = new u16(288), df = new u16(32);
        var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i2 + 2 < s; ++i2) {
          var hv = hsh(i2);
          var imod = i2 & 32767, pimod = head[hv];
          prev[imod] = pimod;
          head[hv] = imod;
          if (wi <= i2) {
            var rem = s - i2;
            if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
              pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
              li = lc_1 = eb = 0, bs = i2;
              for (var j = 0; j < 286; ++j)
                lf[j] = 0;
              for (var j = 0; j < 30; ++j)
                df[j] = 0;
            }
            var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
            if (rem > 2 && hv == hsh(i2 - dif)) {
              var maxn = Math.min(n, rem) - 1;
              var maxd = Math.min(32767, i2);
              var ml = Math.min(258, rem);
              while (dif <= maxd && --ch_1 && imod != pimod) {
                if (dat[i2 + l] == dat[i2 + l - dif]) {
                  var nl = 0;
                  for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                    ;
                  if (nl > l) {
                    l = nl, d = dif;
                    if (nl > maxn)
                      break;
                    var mmd = Math.min(dif, nl - 2);
                    var md = 0;
                    for (var j = 0; j < mmd; ++j) {
                      var ti = i2 - dif + j & 32767;
                      var pti = prev[ti];
                      var cd = ti - pti & 32767;
                      if (cd > md)
                        md = cd, pimod = ti;
                    }
                  }
                }
                imod = pimod, pimod = prev[imod];
                dif += imod - pimod & 32767;
              }
            }
            if (d) {
              syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
              var lin = revfl[l] & 31, din = revfd[d] & 31;
              eb += fleb[lin] + fdeb[din];
              ++lf[257 + lin];
              ++df[din];
              wi = i2 + l;
              ++lc_1;
            } else {
              syms[li++] = dat[i2];
              ++lf[dat[i2]];
            }
          }
        }
        for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
        if (!lst) {
          st.r = pos & 7 | w[pos / 8 | 0] << 3;
          pos -= 7;
          st.h = head, st.p = prev, st.i = i2, st.w = wi;
        }
      } else {
        for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
          var e = i2 + 65535;
          if (e >= s) {
            w[pos / 8 | 0] = lst;
            e = s;
          }
          pos = wfblk(w, pos + 1, dat.subarray(i2, e));
        }
        st.i = s;
      }
      return slc(o, 0, pre + shft(pos) + post);
    }, "dflt");
    crct = /* @__PURE__ */ (function() {
      var t = new Int32Array(256);
      for (var i2 = 0; i2 < 256; ++i2) {
        var c = i2, k = 9;
        while (--k)
          c = (c & 1 && -306674912) ^ c >>> 1;
        t[i2] = c;
      }
      return t;
    })();
    crc = /* @__PURE__ */ __name(function() {
      var c = -1;
      return {
        p: /* @__PURE__ */ __name(function(d) {
          var cr = c;
          for (var i2 = 0; i2 < d.length; ++i2)
            cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
          c = cr;
        }, "p"),
        d: /* @__PURE__ */ __name(function() {
          return ~c;
        }, "d")
      };
    }, "crc");
    adler = /* @__PURE__ */ __name(function() {
      var a = 1, b = 0;
      return {
        p: /* @__PURE__ */ __name(function(d) {
          var n = a, m = b;
          var l = d.length | 0;
          for (var i2 = 0; i2 != l; ) {
            var e = Math.min(i2 + 2655, l);
            for (; i2 < e; ++i2)
              m += n += d[i2];
            n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
          }
          a = n, b = m;
        }, "p"),
        d: /* @__PURE__ */ __name(function() {
          a %= 65521, b %= 65521;
          return (a & 255) << 24 | (a & 65280) << 8 | (b & 255) << 8 | b >> 8;
        }, "d")
      };
    }, "adler");
    dopt = /* @__PURE__ */ __name(function(dat, opt, pre, post, st) {
      if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
          var dict = opt.dictionary.subarray(-32768);
          var newDat = new u8(dict.length + dat.length);
          newDat.set(dict);
          newDat.set(dat, dict.length);
          dat = newDat;
          st.w = dict.length;
        }
      }
      return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
    }, "dopt");
    wbytes = /* @__PURE__ */ __name(function(d, b, v) {
      for (; v; ++b)
        d[b] = v, v >>>= 8;
    }, "wbytes");
    gzh = /* @__PURE__ */ __name(function(c, o) {
      var fn = o.filename;
      c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3;
      if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3));
      if (fn) {
        c[3] = 8;
        for (var i2 = 0; i2 <= fn.length; ++i2)
          c[i2 + 10] = fn.charCodeAt(i2);
      }
    }, "gzh");
    gzs = /* @__PURE__ */ __name(function(d) {
      if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, "invalid gzip data");
      var flg = d[3];
      var st = 10;
      if (flg & 4)
        st += (d[10] | d[11] << 8) + 2;
      for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
      return st + (flg & 2);
    }, "gzs");
    gzl = /* @__PURE__ */ __name(function(d) {
      var l = d.length;
      return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
    }, "gzl");
    gzhl = /* @__PURE__ */ __name(function(o) {
      return 10 + (o.filename ? o.filename.length + 1 : 0);
    }, "gzhl");
    zlh = /* @__PURE__ */ __name(function(c, o) {
      var lv = o.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
      c[0] = 120, c[1] = fl2 << 6 | (o.dictionary && 32);
      c[1] |= 31 - (c[0] << 8 | c[1]) % 31;
      if (o.dictionary) {
        var h = adler();
        h.p(o.dictionary);
        wbytes(c, 2, h.d());
      }
    }, "zlh");
    zls = /* @__PURE__ */ __name(function(d, dict) {
      if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
        err(6, "invalid zlib data");
      if ((d[1] >> 5 & 1) == +!dict)
        err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
      return (d[1] >> 3 & 4) + 2;
    }, "zls");
    __name(deflateSync, "deflateSync");
    __name(inflateSync, "inflateSync");
    __name(gzipSync, "gzipSync");
    __name(gunzipSync, "gunzipSync");
    __name(zlibSync, "zlibSync");
    __name(unzlibSync, "unzlibSync");
    td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
    tds = 0;
    try {
      td.decode(et, { stream: true });
      tds = 1;
    } catch (e) {
    }
  }
});

// src/academy/node/runtime/builtins.js
function isIPv4(s) {
  return IPV4.test(String(s));
}
function isIPv6(s) {
  const v = String(s);
  if (!v.includes(":") || /[^0-9a-fA-F:.%a-zA-Z]/.test(v)) return false;
  try {
    new URL(`http://[${v.split("%")[0]}]/`);
    return true;
  } catch {
    return false;
  }
}
function abortError(signal) {
  const err2 = new Error("The operation was aborted");
  err2.name = "AbortError";
  err2.code = "ABORT_ERR";
  if (signal?.reason !== void 0) err2.cause = signal.reason;
  return err2;
}
function fileURLToPath(u) {
  const url2 = typeof u === "string" ? new URL(u) : u;
  if (url2.protocol !== "file:") throw codeError2("ERR_INVALID_URL_SCHEME", "The URL must be of scheme file", TypeError);
  return decodeURIComponent(url2.pathname);
}
function pathToFileURL(p) {
  return new URL(`file://${encodeURI(p.startsWith("/") ? p : `${ctx.machine?.cwd || "/app"}/${p}`)}`);
}
function fail(message, generated, actual, expected, operator) {
  if (message instanceof Error) throw message;
  throw new AssertionError({ message: message ?? generated, actual, expected, operator, generated: message === void 0 });
}
function diffLines(actual, expected) {
  const a = inspect(actual).split("\n");
  const e = inspect(expected).split("\n");
  if (a.length === 1 && e.length === 1) return `
${a[0]} !== ${e[0]}
`;
  const out = ["+ actual - expected", ""];
  const max2 = Math.max(a.length, e.length);
  for (let i2 = 0; i2 < max2; i2++) {
    if (a[i2] === e[i2]) out.push(`  ${a[i2]}`);
    else {
      if (a[i2] !== void 0) out.push(`+ ${a[i2]}`);
      if (e[i2] !== void 0) out.push(`- ${e[i2]}`);
    }
  }
  return `${out.join("\n")}
`;
}
function matches(err2, expected) {
  if (expected === void 0) return true;
  if (typeof expected === "function") {
    if (expected.prototype !== void 0 && err2 instanceof expected) return true;
    if (Object.prototype.isPrototypeOf.call(Error, expected) || expected === Error) return false;
    return expected(err2) === true;
  }
  if (expected instanceof RegExp) return expected.test(String(err2?.message ?? err2));
  if (typeof expected === "object") return Object.keys(expected).every((k) => expected[k] instanceof RegExp ? expected[k].test(err2?.[k]) : deepEqual(err2?.[k], expected[k], true));
  return false;
}
function makeAssert(strict) {
  const ok = /* @__PURE__ */ __name((value, message) => {
    if (!value) fail(message, "The expression evaluated to a falsy value:\n\n  assert.ok(" + inspect(value) + ")\n", value, true, "==");
  }, "ok");
  const assert2 = /* @__PURE__ */ __name((value, message) => ok(value, message), "assert");
  const strictEqual = /* @__PURE__ */ __name((a, e, message) => {
    if (!Object.is(a, e)) fail(message === void 0 ? void 0 : `${message}
${diffLines(a, e)}`, `Expected values to be strictly equal:
${diffLines(a, e)}`, a, e, "strictEqual");
  }, "strictEqual");
  const deepStrictEqual = /* @__PURE__ */ __name((a, e, message) => {
    if (!deepEqual(a, e, true)) fail(message, `Expected values to be strictly deep-equal:
${diffLines(a, e)}`, a, e, "deepStrictEqual");
  }, "deepStrictEqual");
  Object.assign(assert2, {
    ok,
    AssertionError,
    strictEqual,
    deepStrictEqual,
    equal: strict ? strictEqual : (a, e, m) => {
      if (!(a == e || a !== a && e !== e)) fail(m, `${inspect(a)} == ${inspect(e)}`, a, e, "==");
    },
    deepEqual: strict ? deepStrictEqual : (a, e, m) => {
      if (!deepEqual(a, e, false)) fail(m, `Expected values to be loosely deep-equal:

${inspect(a)}

should loosely deep-equal

${inspect(e)}`, a, e, "deepEqual");
    },
    notStrictEqual: /* @__PURE__ */ __name((a, e, m) => {
      if (Object.is(a, e)) fail(m, `Expected "actual" to be strictly unequal to: ${inspect(e)}`, a, e, "notStrictEqual");
    }, "notStrictEqual"),
    notDeepStrictEqual: /* @__PURE__ */ __name((a, e, m) => {
      if (deepEqual(a, e, true)) fail(m, `Expected "actual" not to be strictly deep-equal to: ${inspect(e)}`, a, e, "notDeepStrictEqual");
    }, "notDeepStrictEqual"),
    notEqual: /* @__PURE__ */ __name((a, e, m) => {
      if (a == e) fail(m, `${inspect(a)} != ${inspect(e)}`, a, e, "!=");
    }, "notEqual"),
    match: /* @__PURE__ */ __name((s, re, m) => {
      if (!re.test(s)) fail(m, `The input did not match the regular expression ${re}. Input:

${inspect(s)}
`, s, re, "match");
    }, "match"),
    doesNotMatch: /* @__PURE__ */ __name((s, re, m) => {
      if (re.test(s)) fail(m, `The input was expected to not match the regular expression ${re}. Input:

${inspect(s)}
`, s, re, "doesNotMatch");
    }, "doesNotMatch"),
    fail: /* @__PURE__ */ __name((m = "Failed") => fail(m, m, void 0, void 0, "fail"), "fail"),
    throws: /* @__PURE__ */ __name((fn, expected, m) => {
      try {
        fn();
      } catch (err2) {
        if (!matches(err2, expected)) throw err2;
        return;
      }
      fail(typeof expected === "string" ? expected : m, "Missing expected exception.", void 0, expected, "throws");
    }, "throws"),
    doesNotThrow: /* @__PURE__ */ __name((fn, m) => {
      try {
        fn();
      } catch (err2) {
        fail(m, `Got unwanted exception.
Actual message: "${err2?.message}"`, err2, void 0, "doesNotThrow");
      }
    }, "doesNotThrow"),
    rejects: /* @__PURE__ */ __name(async (p, expected, m) => {
      try {
        await (typeof p === "function" ? p() : p);
      } catch (err2) {
        if (!matches(err2, expected)) throw err2;
        return;
      }
      fail(typeof expected === "string" ? expected : m, "Missing expected rejection.", void 0, expected, "rejects");
    }, "rejects"),
    doesNotReject: /* @__PURE__ */ __name(async (p, m) => {
      try {
        await (typeof p === "function" ? p() : p);
      } catch (err2) {
        fail(m, `Got unwanted rejection.
Actual message: "${err2?.message}"`, err2, void 0, "doesNotReject");
      }
    }, "doesNotReject"),
    ifError: /* @__PURE__ */ __name((v) => {
      if (v !== null && v !== void 0) throw v;
    }, "ifError")
  });
  return assert2;
}
function zlibTransform(make) {
  return (options) => {
    const chunks = [];
    return new Transform({
      transform(chunk, enc, cb) {
        chunks.push(Buffer2.from(chunk));
        cb();
      },
      flush(cb) {
        try {
          this.push(Buffer2.from(make(Buffer2.concat(chunks), options)));
          cb();
        } catch (err2) {
          cb(Object.assign(new Error(err2.message || "zlib error"), { code: "Z_DATA_ERROR", errno: -3 }));
        }
      }
    });
  };
}
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
function lookupSync(host) {
  if (["localhost", "127.0.0.1", "::1"].includes(host)) return { address: host === "::1" || host === "localhost" ? "::1" : "127.0.0.1", family: host === "127.0.0.1" ? 4 : 6 };
  if (ctx.machine?.network.knows(host)) return { address: "203.0.113.10", family: 4 };
  const err2 = new Error(`getaddrinfo ENOTFOUND ${host}`);
  Object.assign(err2, { errno: -3008, code: "ENOTFOUND", syscall: "getaddrinfo", hostname: host });
  throw err2;
}
function unavailable(name, advice) {
  const thrower = /* @__PURE__ */ __name(() => {
    throw codeError2("ERR_LAB_UNSUPPORTED", `${name} is not available in the lab machine. ${advice}`);
  }, "thrower");
  return new Proxy({}, { get: /* @__PURE__ */ __name((_, key) => key === "__esModule" ? false : key === "isMainThread" ? true : key === "isPrimary" || key === "isMaster" ? true : thrower, "get") });
}
var urlPkg, import_querystring_es3, codeError2, cpu, os, IPV4, net, loop, timers, timersPromises, url, querystring, AssertionError, assert, sync, gz, gunz, defl, infl, rawDefl, rawInfl, noBrotli, zlib, Interface, readline, readlinePromises, dns, AsyncLocalStorage, AsyncResource, asyncHooks, perfHooks, childProcess, workerThreads, cluster, tty, v8, diagnosticsChannel;
var init_builtins = __esm({
  "src/academy/node/runtime/builtins.js"() {
    init_globals();
    urlPkg = __toESM(require_url(), 1);
    import_querystring_es3 = __toESM(require_querystring_es3(), 1);
    init_browser();
    init_events();
    init_stream();
    init_buffer();
    init_context();
    init_inspect();
    init_util();
    init_http();
    codeError2 = /* @__PURE__ */ __name((code, message, Type = Error) => Object.assign(new Type(message), { code }), "codeError");
    cpu = { model: "Intel(R) Xeon(R) Platinum 8375C CPU @ 2.90GHz", speed: 2900, times: { user: 252020, nice: 0, sys: 30340, idle: 1070356870, irq: 0 } };
    os = {
      EOL: "\n",
      devNull: "/dev/null",
      platform: /* @__PURE__ */ __name(() => "linux", "platform"),
      type: /* @__PURE__ */ __name(() => "Linux", "type"),
      release: /* @__PURE__ */ __name(() => "6.8.0-1015-aws", "release"),
      version: /* @__PURE__ */ __name(() => "#16-Ubuntu SMP", "version"),
      machine: /* @__PURE__ */ __name(() => "x86_64", "machine"),
      arch: /* @__PURE__ */ __name(() => "x64", "arch"),
      hostname: /* @__PURE__ */ __name(() => "lab-server", "hostname"),
      homedir: /* @__PURE__ */ __name(() => "/home/node", "homedir"),
      tmpdir: /* @__PURE__ */ __name(() => "/tmp", "tmpdir"),
      endianness: /* @__PURE__ */ __name(() => "LE", "endianness"),
      cpus: /* @__PURE__ */ __name(() => [cpu, cpu, cpu, cpu], "cpus"),
      availableParallelism: /* @__PURE__ */ __name(() => 4, "availableParallelism"),
      totalmem: /* @__PURE__ */ __name(() => 4 * 1024 ** 3, "totalmem"),
      freemem: /* @__PURE__ */ __name(() => 2.6 * 1024 ** 3, "freemem"),
      uptime: /* @__PURE__ */ __name(() => 86400 + Math.floor((ctx.loop?.now() ?? 0) / 1e3) % 86400, "uptime"),
      loadavg: /* @__PURE__ */ __name(() => [0.08, 0.05, 0.01], "loadavg"),
      networkInterfaces: /* @__PURE__ */ __name(() => ({ lo: [{ address: "127.0.0.1", netmask: "255.0.0.0", family: "IPv4", mac: "00:00:00:00:00:00", internal: true, cidr: "127.0.0.1/8" }] }), "networkInterfaces"),
      userInfo: /* @__PURE__ */ __name(() => ({ uid: 1e3, gid: 1e3, username: "node", homedir: "/home/node", shell: "/bin/sh" }), "userInfo"),
      constants: { signals: { SIGHUP: 1, SIGINT: 2, SIGKILL: 9, SIGTERM: 15, SIGUSR2: 12 }, errno: {} }
    };
    IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    __name(isIPv4, "isIPv4");
    __name(isIPv6, "isIPv6");
    net = {
      isIP: /* @__PURE__ */ __name((s) => isIPv4(s) ? 4 : isIPv6(s) ? 6 : 0, "isIP"),
      isIPv4,
      isIPv6,
      Socket,
      createServer: /* @__PURE__ */ __name(() => {
        throw codeError2("ERR_LAB_UNSUPPORTED", "Raw TCP servers are not available in the lab: use http.createServer.");
      }, "createServer"),
      connect: /* @__PURE__ */ __name(() => {
        throw codeError2("ERR_LAB_UNSUPPORTED", "Raw TCP connections are not available in the lab: use fetch or http.request.");
      }, "connect")
    };
    net.createConnection = net.connect;
    loop = /* @__PURE__ */ __name(() => ctx.loop, "loop");
    timers = {
      setTimeout: /* @__PURE__ */ __name((...a) => loop().setTimeout(...a), "setTimeout"),
      clearTimeout: /* @__PURE__ */ __name((t) => loop()?.clear(t), "clearTimeout"),
      setInterval: /* @__PURE__ */ __name((...a) => loop().setInterval(...a), "setInterval"),
      clearInterval: /* @__PURE__ */ __name((t) => loop()?.clear(t), "clearInterval"),
      setImmediate: /* @__PURE__ */ __name((...a) => loop().setImmediate(...a), "setImmediate"),
      clearImmediate: /* @__PURE__ */ __name((i2) => loop()?.clearImmediate(i2), "clearImmediate")
    };
    __name(abortError, "abortError");
    timersPromises = {
      setTimeout(ms, value, { signal } = {}) {
        if (signal?.aborted) return Promise.reject(abortError(signal));
        return new Promise((resolve3, reject) => {
          const t = loop().setTimeout(() => resolve3(value), ms);
          signal?.addEventListener("abort", () => {
            loop().clear(t);
            reject(abortError(signal));
          }, { once: true });
        });
      },
      setImmediate(value) {
        return new Promise((resolve3) => loop().setImmediate(() => resolve3(value)));
      },
      async *setInterval(ms, value) {
        for (; ; ) {
          await timersPromises.setTimeout(ms);
          yield value;
        }
      },
      scheduler: {
        wait: /* @__PURE__ */ __name((ms, opts) => timersPromises.setTimeout(ms, void 0, opts), "wait"),
        yield: /* @__PURE__ */ __name(() => timersPromises.setImmediate(), "yield")
      }
    };
    timers.promises = timersPromises;
    __name(fileURLToPath, "fileURLToPath");
    __name(pathToFileURL, "pathToFileURL");
    url = {
      URL: globalThis.URL,
      URLSearchParams: globalThis.URLSearchParams,
      parse: urlPkg.parse,
      format: urlPkg.format,
      resolve: urlPkg.resolve,
      Url: urlPkg.Url,
      fileURLToPath,
      pathToFileURL,
      domainToASCII: /* @__PURE__ */ __name((d) => new URL(`http://${d}`).hostname, "domainToASCII"),
      urlToHttpOptions: /* @__PURE__ */ __name((u) => ({ protocol: u.protocol, hostname: u.hostname, hash: u.hash, search: u.search, pathname: u.pathname, path: `${u.pathname}${u.search}`, href: u.href, port: u.port ? Number(u.port) : void 0 }), "urlToHttpOptions")
    };
    querystring = {
      ...import_querystring_es3.default,
      parse: import_querystring_es3.default.parse || import_querystring_es3.default.decode,
      stringify: import_querystring_es3.default.stringify || import_querystring_es3.default.encode,
      escape: /* @__PURE__ */ __name((s) => encodeURIComponent(s), "escape"),
      unescape: /* @__PURE__ */ __name((s) => decodeURIComponent(s.replace(/\+/g, " ")), "unescape")
    };
    AssertionError = class extends Error {
      static {
        __name(this, "AssertionError");
      }
      constructor({ message, actual, expected, operator, generated }) {
        super(message);
        this.name = "AssertionError";
        this.generatedMessage = Boolean(generated);
        this.code = "ERR_ASSERTION";
        this.actual = actual;
        this.expected = expected;
        this.operator = operator;
      }
    };
    __name(fail, "fail");
    __name(diffLines, "diffLines");
    __name(matches, "matches");
    __name(makeAssert, "makeAssert");
    assert = makeAssert(false);
    assert.strict = makeAssert(true);
    assert.strict.strict = assert.strict;
    __name(zlibTransform, "zlibTransform");
    sync = /* @__PURE__ */ __name((fn) => (buf, options) => Buffer2.from(fn(typeof buf === "string" ? Buffer2.from(buf) : buf, options)), "sync");
    gz = /* @__PURE__ */ __name((b, o) => gzipSync(b, { level: o?.level ?? 6, mtime: 0 }), "gz");
    gunz = /* @__PURE__ */ __name((b) => gunzipSync(b), "gunz");
    defl = /* @__PURE__ */ __name((b, o) => zlibSync(b, { level: o?.level ?? 6 }), "defl");
    infl = /* @__PURE__ */ __name((b) => unzlibSync(b), "infl");
    rawDefl = /* @__PURE__ */ __name((b, o) => deflateSync(b, { level: o?.level ?? 6 }), "rawDefl");
    rawInfl = /* @__PURE__ */ __name((b) => inflateSync(b), "rawInfl");
    noBrotli = /* @__PURE__ */ __name(() => {
      throw codeError2("ERR_LAB_UNSUPPORTED", "Brotli is not available in the lab; use gzip.");
    }, "noBrotli");
    __name(cbVersion, "cbVersion");
    zlib = {
      gzipSync: sync(gz),
      gunzipSync: sync(gunz),
      deflateSync: sync(defl),
      inflateSync: sync(infl),
      deflateRawSync: sync(rawDefl),
      inflateRawSync: sync(rawInfl),
      unzipSync: sync((b) => b[0] === 31 ? gunz(b) : infl(b)),
      brotliCompressSync: noBrotli,
      brotliDecompressSync: noBrotli,
      createGzip: zlibTransform(gz),
      createGunzip: zlibTransform(gunz),
      createDeflate: zlibTransform(defl),
      createInflate: zlibTransform(infl),
      createDeflateRaw: zlibTransform(rawDefl),
      createInflateRaw: zlibTransform(rawInfl),
      createUnzip: zlibTransform((b) => b[0] === 31 ? gunz(b) : infl(b)),
      createBrotliCompress: noBrotli,
      createBrotliDecompress: noBrotli,
      constants: { Z_NO_FLUSH: 0, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, BROTLI_PARAM_QUALITY: 1, BROTLI_OPERATION_FLUSH: 1, BROTLI_OPERATION_FINISH: 2 }
    };
    zlib.gzip = cbVersion(zlib.gzipSync);
    zlib.gunzip = cbVersion(zlib.gunzipSync);
    zlib.deflate = cbVersion(zlib.deflateSync);
    zlib.inflate = cbVersion(zlib.inflateSync);
    Object.assign(zlib, zlib.constants);
    Interface = class extends events_default {
      static {
        __name(this, "Interface");
      }
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
          buf += typeof chunk === "string" ? chunk : Buffer2.from(chunk).toString("utf8");
          let i2;
          while ((i2 = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, i2).replace(/\r$/, "");
            buf = buf.slice(i2 + 1);
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
          return new Promise((resolve3, reject) => {
            if (this.closed) reject(codeError2("ERR_USE_AFTER_CLOSE", "readline was closed"));
            else if (this._lines.length) resolve3(this._lines.shift());
            else this._questions.push(resolve3);
          });
        }
        if (this._lines.length) loop().setImmediate(cb, this._lines.shift());
        else this._questions.push(cb);
        return void 0;
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
        while (this._waiters.length) this._waiters.shift()({ value: void 0, done: true });
      }
      [Symbol.asyncIterator]() {
        const self = this;
        return {
          next() {
            if (self._lines.length) return Promise.resolve({ value: self._lines.shift(), done: false });
            if (self.closed) return Promise.resolve({ value: void 0, done: true });
            return new Promise((resolve3) => self._waiters.push(resolve3));
          },
          return() {
            self.close();
            return Promise.resolve({ value: void 0, done: true });
          },
          [Symbol.asyncIterator]() {
            return this;
          }
        };
      }
    };
    readline = {
      Interface,
      createInterface: /* @__PURE__ */ __name((input, output) => new Interface(input, output, false), "createInterface"),
      clearLine: /* @__PURE__ */ __name(() => true, "clearLine"),
      cursorTo: /* @__PURE__ */ __name(() => true, "cursorTo"),
      moveCursor: /* @__PURE__ */ __name(() => true, "moveCursor"),
      emitKeypressEvents: /* @__PURE__ */ __name(() => {
      }, "emitKeypressEvents")
    };
    readlinePromises = {
      Interface,
      createInterface: /* @__PURE__ */ __name((input, output) => new Interface(input, output, true), "createInterface")
    };
    readline.promises = readlinePromises;
    __name(lookupSync, "lookupSync");
    dns = {
      lookup(host, options, cb) {
        if (typeof options === "function") cb = options;
        let r;
        let e = null;
        try {
          r = lookupSync(host);
        } catch (err2) {
          e = err2;
        }
        loop().setImmediate(() => e ? cb(e) : cb(null, r.address, r.family));
      },
      promises: { lookup: /* @__PURE__ */ __name(async (host) => lookupSync(host), "lookup") },
      setDefaultResultOrder() {
      }
    };
    AsyncLocalStorage = class {
      static {
        __name(this, "AsyncLocalStorage");
      }
      constructor() {
        this._store = void 0;
      }
      getStore() {
        return this._store;
      }
      run(store, fn, ...args) {
        const prev = this._store;
        this._store = store;
        try {
          const r = fn(...args);
          if (r && typeof r.then === "function") return r.finally(() => this._store = prev);
          this._store = prev;
          return r;
        } catch (err2) {
          this._store = prev;
          throw err2;
        }
      }
      enterWith(store) {
        this._store = store;
      }
      exit(fn, ...args) {
        return this.run(void 0, fn, ...args);
      }
      disable() {
        this._store = void 0;
      }
      static bind(fn) {
        return fn;
      }
      static snapshot() {
        return (fn, ...args) => fn(...args);
      }
    };
    AsyncResource = class {
      static {
        __name(this, "AsyncResource");
      }
      constructor(type2) {
        this.type = type2;
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
    };
    asyncHooks = {
      AsyncLocalStorage,
      AsyncResource,
      createHook: /* @__PURE__ */ __name(() => ({ enable() {
        return this;
      }, disable() {
        return this;
      } }), "createHook"),
      executionAsyncId: /* @__PURE__ */ __name(() => 1, "executionAsyncId"),
      triggerAsyncId: /* @__PURE__ */ __name(() => 0, "triggerAsyncId")
    };
    perfHooks = {
      performance: {
        now: /* @__PURE__ */ __name(() => ctx.loop ? ctx.loop.perfNow() : performance.now(), "now"),
        get timeOrigin() {
          return performance.timeOrigin;
        },
        mark: /* @__PURE__ */ __name(() => {
        }, "mark"),
        measure: /* @__PURE__ */ __name(() => {
        }, "measure"),
        eventLoopUtilization: /* @__PURE__ */ __name(() => ({ idle: 1e3, active: 10, utilization: 0.01 }), "eventLoopUtilization")
      },
      PerformanceObserver: class {
        static {
          __name(this, "PerformanceObserver");
        }
        observe() {
        }
        disconnect() {
        }
      },
      monitorEventLoopDelay: /* @__PURE__ */ __name(() => {
        const h = { min: 0, max: 0, mean: 0, stddev: 0, percentiles: /* @__PURE__ */ new Map(), enable() {
          return true;
        }, disable() {
          return true;
        }, reset() {
        }, percentile: /* @__PURE__ */ __name(() => 0, "percentile") };
        return h;
      }, "monitorEventLoopDelay")
    };
    __name(unavailable, "unavailable");
    childProcess = unavailable("child_process", "Lessons that run other programs show a real recorded terminal instead.");
    workerThreads = {
      isMainThread: true,
      parentPort: null,
      workerData: null,
      threadId: 0,
      Worker: class {
        static {
          __name(this, "Worker");
        }
        constructor() {
          throw codeError2("ERR_LAB_UNSUPPORTED", "worker_threads is not available in the lab machine.");
        }
      }
    };
    cluster = { isPrimary: true, isMaster: true, isWorker: false, fork: /* @__PURE__ */ __name(() => {
      throw codeError2("ERR_LAB_UNSUPPORTED", "cluster is not available in the lab machine.");
    }, "fork"), on() {
    } };
    tty = { isatty: /* @__PURE__ */ __name(() => false, "isatty"), ReadStream: Readable, WriteStream: events_default };
    v8 = {
      getHeapStatistics: /* @__PURE__ */ __name(() => ({ total_heap_size: 18874368, used_heap_size: 11534336, heap_size_limit: 4345298944, total_available_size: 4333764608 }), "getHeapStatistics"),
      serialize: /* @__PURE__ */ __name((v) => Buffer2.from(JSON.stringify(v)), "serialize"),
      deserialize: /* @__PURE__ */ __name((b) => JSON.parse(Buffer2.from(b).toString()), "deserialize")
    };
    diagnosticsChannel = {
      channel: /* @__PURE__ */ __name(() => ({ hasSubscribers: false, publish() {
      }, subscribe() {
      }, unsubscribe() {
      } }), "channel"),
      hasSubscribers: /* @__PURE__ */ __name(() => false, "hasSubscribers"),
      subscribe() {
      },
      unsubscribe() {
      },
      tracingChannel: /* @__PURE__ */ __name(() => ({ hasSubscribers: false, traceSync: /* @__PURE__ */ __name((fn, ctxObj, thisArg, ...args) => fn.apply(thisArg, args), "traceSync"), tracePromise: /* @__PURE__ */ __name((fn, ctxObj, thisArg, ...args) => fn.apply(thisArg, args), "tracePromise"), subscribe() {
      }, unsubscribe() {
      } }), "tracingChannel")
    };
  }
});

// scripts/node-lab/node_modules/postgres-array/index.js
var require_postgres_array = __commonJS({
  "scripts/node-lab/node_modules/postgres-array/index.js"(exports) {
    "use strict";
    init_globals();
    exports.parse = function(source, transform) {
      return new ArrayParser(source, transform).parse();
    };
    var ArrayParser = class _ArrayParser {
      static {
        __name(this, "ArrayParser");
      }
      constructor(source, transform) {
        this.source = source;
        this.transform = transform || identity;
        this.position = 0;
        this.entries = [];
        this.recorded = [];
        this.dimension = 0;
      }
      isEof() {
        return this.position >= this.source.length;
      }
      nextCharacter() {
        var character = this.source[this.position++];
        if (character === "\\") {
          return {
            value: this.source[this.position++],
            escaped: true
          };
        }
        return {
          value: character,
          escaped: false
        };
      }
      record(character) {
        this.recorded.push(character);
      }
      newEntry(includeEmpty) {
        var entry;
        if (this.recorded.length > 0 || includeEmpty) {
          entry = this.recorded.join("");
          if (entry === "NULL" && !includeEmpty) {
            entry = null;
          }
          if (entry !== null) entry = this.transform(entry);
          this.entries.push(entry);
          this.recorded = [];
        }
      }
      consumeDimensions() {
        if (this.source[0] === "[") {
          while (!this.isEof()) {
            var char = this.nextCharacter();
            if (char.value === "=") break;
          }
        }
      }
      parse(nested) {
        var character, parser, quote;
        this.consumeDimensions();
        while (!this.isEof()) {
          character = this.nextCharacter();
          if (character.value === "{" && !quote) {
            this.dimension++;
            if (this.dimension > 1) {
              parser = new _ArrayParser(this.source.substr(this.position - 1), this.transform);
              this.entries.push(parser.parse(true));
              this.position += parser.position - 2;
            }
          } else if (character.value === "}" && !quote) {
            this.dimension--;
            if (!this.dimension) {
              this.newEntry();
              if (nested) return this.entries;
            }
          } else if (character.value === '"' && !character.escaped) {
            if (quote) this.newEntry(true);
            quote = !quote;
          } else if (character.value === "," && !quote) {
            this.newEntry();
          } else {
            this.record(character.value);
          }
        }
        if (this.dimension !== 0) {
          throw new Error("array dimension not balanced");
        }
        return this.entries;
      }
    };
    function identity(value) {
      return value;
    }
    __name(identity, "identity");
  }
});

// scripts/node-lab/node_modules/pg-types/lib/arrayParser.js
var require_arrayParser = __commonJS({
  "scripts/node-lab/node_modules/pg-types/lib/arrayParser.js"(exports, module) {
    init_globals();
    var array = require_postgres_array();
    module.exports = {
      create: /* @__PURE__ */ __name(function(source, transform) {
        return {
          parse: /* @__PURE__ */ __name(function() {
            return array.parse(source, transform);
          }, "parse")
        };
      }, "create")
    };
  }
});

// scripts/node-lab/node_modules/postgres-date/index.js
var require_postgres_date = __commonJS({
  "scripts/node-lab/node_modules/postgres-date/index.js"(exports, module) {
    "use strict";
    init_globals();
    var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
    var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
    var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
    var INFINITY = /^-?infinity$/;
    module.exports = /* @__PURE__ */ __name(function parseDate(isoDate) {
      if (INFINITY.test(isoDate)) {
        return Number(isoDate.replace("i", "I"));
      }
      var matches2 = DATE_TIME.exec(isoDate);
      if (!matches2) {
        return getDate(isoDate) || null;
      }
      var isBC = !!matches2[8];
      var year = parseInt(matches2[1], 10);
      if (isBC) {
        year = bcYearToNegativeYear(year);
      }
      var month = parseInt(matches2[2], 10) - 1;
      var day = matches2[3];
      var hour = parseInt(matches2[4], 10);
      var minute = parseInt(matches2[5], 10);
      var second = parseInt(matches2[6], 10);
      var ms = matches2[7];
      ms = ms ? 1e3 * parseFloat(ms) : 0;
      var date;
      var offset = timeZoneOffset(isoDate);
      if (offset != null) {
        date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
        if (is0To99(year)) {
          date.setUTCFullYear(year);
        }
        if (offset !== 0) {
          date.setTime(date.getTime() - offset);
        }
      } else {
        date = new Date(year, month, day, hour, minute, second, ms);
        if (is0To99(year)) {
          date.setFullYear(year);
        }
      }
      return date;
    }, "parseDate");
    function getDate(isoDate) {
      var matches2 = DATE.exec(isoDate);
      if (!matches2) {
        return;
      }
      var year = parseInt(matches2[1], 10);
      var isBC = !!matches2[4];
      if (isBC) {
        year = bcYearToNegativeYear(year);
      }
      var month = parseInt(matches2[2], 10) - 1;
      var day = matches2[3];
      var date = new Date(year, month, day);
      if (is0To99(year)) {
        date.setFullYear(year);
      }
      return date;
    }
    __name(getDate, "getDate");
    function timeZoneOffset(isoDate) {
      if (isoDate.endsWith("+00")) {
        return 0;
      }
      var zone = TIME_ZONE.exec(isoDate.split(" ")[1]);
      if (!zone) return;
      var type2 = zone[1];
      if (type2 === "Z") {
        return 0;
      }
      var sign = type2 === "-" ? -1 : 1;
      var offset = parseInt(zone[2], 10) * 3600 + parseInt(zone[3] || 0, 10) * 60 + parseInt(zone[4] || 0, 10);
      return offset * sign * 1e3;
    }
    __name(timeZoneOffset, "timeZoneOffset");
    function bcYearToNegativeYear(year) {
      return -(year - 1);
    }
    __name(bcYearToNegativeYear, "bcYearToNegativeYear");
    function is0To99(num) {
      return num >= 0 && num < 100;
    }
    __name(is0To99, "is0To99");
  }
});

// scripts/node-lab/node_modules/xtend/mutable.js
var require_mutable = __commonJS({
  "scripts/node-lab/node_modules/xtend/mutable.js"(exports, module) {
    init_globals();
    module.exports = extend;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function extend(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2];
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    }
    __name(extend, "extend");
  }
});

// scripts/node-lab/node_modules/postgres-interval/index.js
var require_postgres_interval = __commonJS({
  "scripts/node-lab/node_modules/postgres-interval/index.js"(exports, module) {
    "use strict";
    init_globals();
    var extend = require_mutable();
    module.exports = PostgresInterval;
    function PostgresInterval(raw) {
      if (!(this instanceof PostgresInterval)) {
        return new PostgresInterval(raw);
      }
      extend(this, parse3(raw));
    }
    __name(PostgresInterval, "PostgresInterval");
    var properties = ["seconds", "minutes", "hours", "days", "months", "years"];
    PostgresInterval.prototype.toPostgres = function() {
      var filtered = properties.filter(this.hasOwnProperty, this);
      if (this.milliseconds && filtered.indexOf("seconds") < 0) {
        filtered.push("seconds");
      }
      if (filtered.length === 0) return "0";
      return filtered.map(function(property) {
        var value = this[property] || 0;
        if (property === "seconds" && this.milliseconds) {
          value = (value + this.milliseconds / 1e3).toFixed(6).replace(/\.?0+$/, "");
        }
        return value + " " + property;
      }, this).join(" ");
    };
    var propertiesISOEquivalent = {
      years: "Y",
      months: "M",
      days: "D",
      hours: "H",
      minutes: "M",
      seconds: "S"
    };
    var dateProperties = ["years", "months", "days"];
    var timeProperties = ["hours", "minutes", "seconds"];
    PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function() {
      var datePart = dateProperties.map(buildProperty, this).join("");
      var timePart = timeProperties.map(buildProperty, this).join("");
      return "P" + datePart + "T" + timePart;
      function buildProperty(property) {
        var value = this[property] || 0;
        if (property === "seconds" && this.milliseconds) {
          value = (value + this.milliseconds / 1e3).toFixed(6).replace(/0+$/, "");
        }
        return value + propertiesISOEquivalent[property];
      }
      __name(buildProperty, "buildProperty");
    };
    var NUMBER = "([+-]?\\d+)";
    var YEAR = NUMBER + "\\s+years?";
    var MONTH = NUMBER + "\\s+mons?";
    var DAY = NUMBER + "\\s+days?";
    var TIME = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?";
    var INTERVAL = new RegExp([YEAR, MONTH, DAY, TIME].map(function(regexString) {
      return "(" + regexString + ")?";
    }).join("\\s*"));
    var positions = {
      years: 2,
      months: 4,
      days: 6,
      hours: 9,
      minutes: 10,
      seconds: 11,
      milliseconds: 12
    };
    var negatives = ["hours", "minutes", "seconds", "milliseconds"];
    function parseMilliseconds(fraction) {
      var microseconds = fraction + "000000".slice(fraction.length);
      return parseInt(microseconds, 10) / 1e3;
    }
    __name(parseMilliseconds, "parseMilliseconds");
    function parse3(interval) {
      if (!interval) return {};
      var matches2 = INTERVAL.exec(interval);
      var isNegative = matches2[8] === "-";
      return Object.keys(positions).reduce(function(parsed, property) {
        var position = positions[property];
        var value = matches2[position];
        if (!value) return parsed;
        value = property === "milliseconds" ? parseMilliseconds(value) : parseInt(value, 10);
        if (!value) return parsed;
        if (isNegative && ~negatives.indexOf(property)) {
          value *= -1;
        }
        parsed[property] = value;
        return parsed;
      }, {});
    }
    __name(parse3, "parse");
  }
});

// scripts/node-lab/node_modules/postgres-bytea/index.js
var require_postgres_bytea = __commonJS({
  "scripts/node-lab/node_modules/postgres-bytea/index.js"(exports, module) {
    "use strict";
    init_globals();
    var bufferFrom = globalThis.__labBuffer.from || globalThis.__labBuffer;
    module.exports = /* @__PURE__ */ __name(function parseBytea(input) {
      if (/^\\x/.test(input)) {
        return bufferFrom(input.substr(2), "hex");
      }
      var output = "";
      var i2 = 0;
      while (i2 < input.length) {
        if (input[i2] !== "\\") {
          output += input[i2];
          ++i2;
        } else {
          if (/[0-7]{3}/.test(input.substr(i2 + 1, 3))) {
            output += String.fromCharCode(parseInt(input.substr(i2 + 1, 3), 8));
            i2 += 4;
          } else {
            var backslashes = 1;
            while (i2 + backslashes < input.length && input[i2 + backslashes] === "\\") {
              backslashes++;
            }
            for (var k = 0; k < Math.floor(backslashes / 2); ++k) {
              output += "\\";
            }
            i2 += Math.floor(backslashes / 2) * 2;
          }
        }
      }
      return bufferFrom(output, "binary");
    }, "parseBytea");
  }
});

// scripts/node-lab/node_modules/pg-types/lib/textParsers.js
var require_textParsers = __commonJS({
  "scripts/node-lab/node_modules/pg-types/lib/textParsers.js"(exports, module) {
    init_globals();
    var array = require_postgres_array();
    var arrayParser = require_arrayParser();
    var parseDate = require_postgres_date();
    var parseInterval = require_postgres_interval();
    var parseByteA = require_postgres_bytea();
    function allowNull(fn) {
      return /* @__PURE__ */ __name(function nullAllowed(value) {
        if (value === null) return value;
        return fn(value);
      }, "nullAllowed");
    }
    __name(allowNull, "allowNull");
    function parseBool(value) {
      if (value === null) return value;
      return value === "TRUE" || value === "t" || value === "true" || value === "y" || value === "yes" || value === "on" || value === "1";
    }
    __name(parseBool, "parseBool");
    function parseBoolArray(value) {
      if (!value) return null;
      return array.parse(value, parseBool);
    }
    __name(parseBoolArray, "parseBoolArray");
    function parseBaseTenInt(string) {
      return parseInt(string, 10);
    }
    __name(parseBaseTenInt, "parseBaseTenInt");
    function parseIntegerArray(value) {
      if (!value) return null;
      return array.parse(value, allowNull(parseBaseTenInt));
    }
    __name(parseIntegerArray, "parseIntegerArray");
    function parseBigIntegerArray(value) {
      if (!value) return null;
      return array.parse(value, allowNull(function(entry) {
        return parseBigInteger(entry).trim();
      }));
    }
    __name(parseBigIntegerArray, "parseBigIntegerArray");
    var parsePointArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parsePoint(entry);
        }
        return entry;
      });
      return p.parse();
    }, "parsePointArray");
    var parseFloatArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parseFloat(entry);
        }
        return entry;
      });
      return p.parse();
    }, "parseFloatArray");
    var parseStringArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value);
      return p.parse();
    }, "parseStringArray");
    var parseDateArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parseDate(entry);
        }
        return entry;
      });
      return p.parse();
    }, "parseDateArray");
    var parseIntervalArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
          entry = parseInterval(entry);
        }
        return entry;
      });
      return p.parse();
    }, "parseIntervalArray");
    var parseByteAArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      return array.parse(value, allowNull(parseByteA));
    }, "parseByteAArray");
    var parseInteger = /* @__PURE__ */ __name(function(value) {
      return parseInt(value, 10);
    }, "parseInteger");
    var parseBigInteger = /* @__PURE__ */ __name(function(value) {
      var valStr = String(value);
      if (/^\d+$/.test(valStr)) {
        return valStr;
      }
      return value;
    }, "parseBigInteger");
    var parseJsonArray = /* @__PURE__ */ __name(function(value) {
      if (!value) {
        return null;
      }
      return array.parse(value, allowNull(JSON.parse));
    }, "parseJsonArray");
    var parsePoint = /* @__PURE__ */ __name(function(value) {
      if (value[0] !== "(") {
        return null;
      }
      value = value.substring(1, value.length - 1).split(",");
      return {
        x: parseFloat(value[0]),
        y: parseFloat(value[1])
      };
    }, "parsePoint");
    var parseCircle = /* @__PURE__ */ __name(function(value) {
      if (value[0] !== "<" && value[1] !== "(") {
        return null;
      }
      var point = "(";
      var radius = "";
      var pointParsed = false;
      for (var i2 = 2; i2 < value.length - 1; i2++) {
        if (!pointParsed) {
          point += value[i2];
        }
        if (value[i2] === ")") {
          pointParsed = true;
          continue;
        } else if (!pointParsed) {
          continue;
        }
        if (value[i2] === ",") {
          continue;
        }
        radius += value[i2];
      }
      var result = parsePoint(point);
      result.radius = parseFloat(radius);
      return result;
    }, "parseCircle");
    var init = /* @__PURE__ */ __name(function(register) {
      register(20, parseBigInteger);
      register(21, parseInteger);
      register(23, parseInteger);
      register(26, parseInteger);
      register(700, parseFloat);
      register(701, parseFloat);
      register(16, parseBool);
      register(1082, parseDate);
      register(1114, parseDate);
      register(1184, parseDate);
      register(600, parsePoint);
      register(651, parseStringArray);
      register(718, parseCircle);
      register(1e3, parseBoolArray);
      register(1001, parseByteAArray);
      register(1005, parseIntegerArray);
      register(1007, parseIntegerArray);
      register(1028, parseIntegerArray);
      register(1016, parseBigIntegerArray);
      register(1017, parsePointArray);
      register(1021, parseFloatArray);
      register(1022, parseFloatArray);
      register(1231, parseFloatArray);
      register(1014, parseStringArray);
      register(1015, parseStringArray);
      register(1008, parseStringArray);
      register(1009, parseStringArray);
      register(1040, parseStringArray);
      register(1041, parseStringArray);
      register(1115, parseDateArray);
      register(1182, parseDateArray);
      register(1185, parseDateArray);
      register(1186, parseInterval);
      register(1187, parseIntervalArray);
      register(17, parseByteA);
      register(114, JSON.parse.bind(JSON));
      register(3802, JSON.parse.bind(JSON));
      register(199, parseJsonArray);
      register(3807, parseJsonArray);
      register(3907, parseStringArray);
      register(2951, parseStringArray);
      register(791, parseStringArray);
      register(1183, parseStringArray);
      register(1270, parseStringArray);
    }, "init");
    module.exports = {
      init
    };
  }
});

// scripts/node-lab/node_modules/pg-int8/index.js
var require_pg_int8 = __commonJS({
  "scripts/node-lab/node_modules/pg-int8/index.js"(exports, module) {
    "use strict";
    init_globals();
    var BASE = 1e6;
    function readInt8(buffer) {
      var high = buffer.readInt32BE(0);
      var low = buffer.readUInt32BE(4);
      var sign = "";
      if (high < 0) {
        high = ~high + (low === 0);
        low = ~low + 1 >>> 0;
        sign = "-";
      }
      var result = "";
      var carry;
      var t;
      var digits;
      var pad;
      var l;
      var i2;
      {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 4294967296 * carry + low;
        low = t / BASE >>> 0;
        digits = "" + (t - BASE * low);
        if (low === 0 && high === 0) {
          return sign + digits + result;
        }
        pad = "";
        l = 6 - digits.length;
        for (i2 = 0; i2 < l; i2++) {
          pad += "0";
        }
        result = pad + digits + result;
      }
      {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 4294967296 * carry + low;
        low = t / BASE >>> 0;
        digits = "" + (t - BASE * low);
        if (low === 0 && high === 0) {
          return sign + digits + result;
        }
        pad = "";
        l = 6 - digits.length;
        for (i2 = 0; i2 < l; i2++) {
          pad += "0";
        }
        result = pad + digits + result;
      }
      {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 4294967296 * carry + low;
        low = t / BASE >>> 0;
        digits = "" + (t - BASE * low);
        if (low === 0 && high === 0) {
          return sign + digits + result;
        }
        pad = "";
        l = 6 - digits.length;
        for (i2 = 0; i2 < l; i2++) {
          pad += "0";
        }
        result = pad + digits + result;
      }
      {
        carry = high % BASE;
        t = 4294967296 * carry + low;
        digits = "" + t % BASE;
        return sign + digits + result;
      }
    }
    __name(readInt8, "readInt8");
    module.exports = readInt8;
  }
});

// scripts/node-lab/node_modules/pg-types/lib/binaryParsers.js
var require_binaryParsers = __commonJS({
  "scripts/node-lab/node_modules/pg-types/lib/binaryParsers.js"(exports, module) {
    init_globals();
    var parseInt64 = require_pg_int8();
    var parseBits = /* @__PURE__ */ __name(function(data, bits2, offset, invert, callback) {
      offset = offset || 0;
      invert = invert || false;
      callback = callback || function(lastValue, newValue, bits3) {
        return lastValue * Math.pow(2, bits3) + newValue;
      };
      var offsetBytes = offset >> 3;
      var inv = /* @__PURE__ */ __name(function(value) {
        if (invert) {
          return ~value & 255;
        }
        return value;
      }, "inv");
      var mask = 255;
      var firstBits = 8 - offset % 8;
      if (bits2 < firstBits) {
        mask = 255 << 8 - bits2 & 255;
        firstBits = bits2;
      }
      if (offset) {
        mask = mask >> offset % 8;
      }
      var result = 0;
      if (offset % 8 + bits2 >= 8) {
        result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
      }
      var bytes = bits2 + offset >> 3;
      for (var i2 = offsetBytes + 1; i2 < bytes; i2++) {
        result = callback(result, inv(data[i2]), 8);
      }
      var lastBits = (bits2 + offset) % 8;
      if (lastBits > 0) {
        result = callback(result, inv(data[bytes]) >> 8 - lastBits, lastBits);
      }
      return result;
    }, "parseBits");
    var parseFloatFromBits = /* @__PURE__ */ __name(function(data, precisionBits, exponentBits) {
      var bias = Math.pow(2, exponentBits - 1) - 1;
      var sign = parseBits(data, 1);
      var exponent = parseBits(data, exponentBits, 1);
      if (exponent === 0) {
        return 0;
      }
      var precisionBitsCounter = 1;
      var parsePrecisionBits = /* @__PURE__ */ __name(function(lastValue, newValue, bits2) {
        if (lastValue === 0) {
          lastValue = 1;
        }
        for (var i2 = 1; i2 <= bits2; i2++) {
          precisionBitsCounter /= 2;
          if ((newValue & 1 << bits2 - i2) > 0) {
            lastValue += precisionBitsCounter;
          }
        }
        return lastValue;
      }, "parsePrecisionBits");
      var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);
      if (exponent == Math.pow(2, exponentBits + 1) - 1) {
        if (mantissa === 0) {
          return sign === 0 ? Infinity : -Infinity;
        }
        return NaN;
      }
      return (sign === 0 ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
    }, "parseFloatFromBits");
    var parseInt16 = /* @__PURE__ */ __name(function(value) {
      if (parseBits(value, 1) == 1) {
        return -1 * (parseBits(value, 15, 1, true) + 1);
      }
      return parseBits(value, 15, 1);
    }, "parseInt16");
    var parseInt32 = /* @__PURE__ */ __name(function(value) {
      if (parseBits(value, 1) == 1) {
        return -1 * (parseBits(value, 31, 1, true) + 1);
      }
      return parseBits(value, 31, 1);
    }, "parseInt32");
    var parseFloat32 = /* @__PURE__ */ __name(function(value) {
      return parseFloatFromBits(value, 23, 8);
    }, "parseFloat32");
    var parseFloat64 = /* @__PURE__ */ __name(function(value) {
      return parseFloatFromBits(value, 52, 11);
    }, "parseFloat64");
    var parseNumeric = /* @__PURE__ */ __name(function(value) {
      var sign = parseBits(value, 16, 32);
      if (sign == 49152) {
        return NaN;
      }
      var weight = Math.pow(1e4, parseBits(value, 16, 16));
      var result = 0;
      var digits = [];
      var ndigits = parseBits(value, 16);
      for (var i2 = 0; i2 < ndigits; i2++) {
        result += parseBits(value, 16, 64 + 16 * i2) * weight;
        weight /= 1e4;
      }
      var scale = Math.pow(10, parseBits(value, 16, 48));
      return (sign === 0 ? 1 : -1) * Math.round(result * scale) / scale;
    }, "parseNumeric");
    var parseDate = /* @__PURE__ */ __name(function(isUTC, value) {
      var sign = parseBits(value, 1);
      var rawValue = parseBits(value, 63, 1);
      var result = new Date((sign === 0 ? 1 : -1) * rawValue / 1e3 + 9466848e5);
      if (!isUTC) {
        result.setTime(result.getTime() + result.getTimezoneOffset() * 6e4);
      }
      result.usec = rawValue % 1e3;
      result.getMicroSeconds = function() {
        return this.usec;
      };
      result.setMicroSeconds = function(value2) {
        this.usec = value2;
      };
      result.getUTCMicroSeconds = function() {
        return this.usec;
      };
      return result;
    }, "parseDate");
    var parseArray = /* @__PURE__ */ __name(function(value) {
      var dim = parseBits(value, 32);
      var flags = parseBits(value, 32, 32);
      var elementType = parseBits(value, 32, 64);
      var offset = 96;
      var dims = [];
      for (var i2 = 0; i2 < dim; i2++) {
        dims[i2] = parseBits(value, 32, offset);
        offset += 32;
        offset += 32;
      }
      var parseElement = /* @__PURE__ */ __name(function(elementType2) {
        var length = parseBits(value, 32, offset);
        offset += 32;
        if (length == 4294967295) {
          return null;
        }
        var result;
        if (elementType2 == 23 || elementType2 == 20) {
          result = parseBits(value, length * 8, offset);
          offset += length * 8;
          return result;
        } else if (elementType2 == 25) {
          result = value.toString(this.encoding, offset >> 3, (offset += length << 3) >> 3);
          return result;
        } else {
          console.log("ERROR: ElementType not implemented: " + elementType2);
        }
      }, "parseElement");
      var parse3 = /* @__PURE__ */ __name(function(dimension, elementType2) {
        var array = [];
        var i3;
        if (dimension.length > 1) {
          var count = dimension.shift();
          for (i3 = 0; i3 < count; i3++) {
            array[i3] = parse3(dimension, elementType2);
          }
          dimension.unshift(count);
        } else {
          for (i3 = 0; i3 < dimension[0]; i3++) {
            array[i3] = parseElement(elementType2);
          }
        }
        return array;
      }, "parse");
      return parse3(dims, elementType);
    }, "parseArray");
    var parseText = /* @__PURE__ */ __name(function(value) {
      return value.toString("utf8");
    }, "parseText");
    var parseBool = /* @__PURE__ */ __name(function(value) {
      if (value === null) return null;
      return parseBits(value, 8) > 0;
    }, "parseBool");
    var init = /* @__PURE__ */ __name(function(register) {
      register(20, parseInt64);
      register(21, parseInt16);
      register(23, parseInt32);
      register(26, parseInt32);
      register(1700, parseNumeric);
      register(700, parseFloat32);
      register(701, parseFloat64);
      register(16, parseBool);
      register(1114, parseDate.bind(null, false));
      register(1184, parseDate.bind(null, true));
      register(1e3, parseArray);
      register(1007, parseArray);
      register(1016, parseArray);
      register(1008, parseArray);
      register(1009, parseArray);
      register(25, parseText);
    }, "init");
    module.exports = {
      init
    };
  }
});

// scripts/node-lab/node_modules/pg-types/lib/builtins.js
var require_builtins = __commonJS({
  "scripts/node-lab/node_modules/pg-types/lib/builtins.js"(exports, module) {
    init_globals();
    module.exports = {
      BOOL: 16,
      BYTEA: 17,
      CHAR: 18,
      INT8: 20,
      INT2: 21,
      INT4: 23,
      REGPROC: 24,
      TEXT: 25,
      OID: 26,
      TID: 27,
      XID: 28,
      CID: 29,
      JSON: 114,
      XML: 142,
      PG_NODE_TREE: 194,
      SMGR: 210,
      PATH: 602,
      POLYGON: 604,
      CIDR: 650,
      FLOAT4: 700,
      FLOAT8: 701,
      ABSTIME: 702,
      RELTIME: 703,
      TINTERVAL: 704,
      CIRCLE: 718,
      MACADDR8: 774,
      MONEY: 790,
      MACADDR: 829,
      INET: 869,
      ACLITEM: 1033,
      BPCHAR: 1042,
      VARCHAR: 1043,
      DATE: 1082,
      TIME: 1083,
      TIMESTAMP: 1114,
      TIMESTAMPTZ: 1184,
      INTERVAL: 1186,
      TIMETZ: 1266,
      BIT: 1560,
      VARBIT: 1562,
      NUMERIC: 1700,
      REFCURSOR: 1790,
      REGPROCEDURE: 2202,
      REGOPER: 2203,
      REGOPERATOR: 2204,
      REGCLASS: 2205,
      REGTYPE: 2206,
      UUID: 2950,
      TXID_SNAPSHOT: 2970,
      PG_LSN: 3220,
      PG_NDISTINCT: 3361,
      PG_DEPENDENCIES: 3402,
      TSVECTOR: 3614,
      TSQUERY: 3615,
      GTSVECTOR: 3642,
      REGCONFIG: 3734,
      REGDICTIONARY: 3769,
      JSONB: 3802,
      REGNAMESPACE: 4089,
      REGROLE: 4096
    };
  }
});

// scripts/node-lab/node_modules/pg-types/index.js
var require_pg_types = __commonJS({
  "scripts/node-lab/node_modules/pg-types/index.js"(exports) {
    init_globals();
    var textParsers = require_textParsers();
    var binaryParsers = require_binaryParsers();
    var arrayParser = require_arrayParser();
    var builtinTypes = require_builtins();
    exports.getTypeParser = getTypeParser;
    exports.setTypeParser = setTypeParser;
    exports.arrayParser = arrayParser;
    exports.builtins = builtinTypes;
    var typeParsers = {
      text: {},
      binary: {}
    };
    function noParse(val) {
      return String(val);
    }
    __name(noParse, "noParse");
    function getTypeParser(oid, format4) {
      format4 = format4 || "text";
      if (!typeParsers[format4]) {
        return noParse;
      }
      return typeParsers[format4][oid] || noParse;
    }
    __name(getTypeParser, "getTypeParser");
    function setTypeParser(oid, format4, parseFn) {
      if (typeof format4 == "function") {
        parseFn = format4;
        format4 = "text";
      }
      typeParsers[format4][oid] = parseFn;
    }
    __name(setTypeParser, "setTypeParser");
    textParsers.init(function(oid, converter) {
      typeParsers.text[oid] = converter;
    });
    binaryParsers.init(function(oid, converter) {
      typeParsers.binary[oid] = converter;
    });
  }
});

// scripts/node-lab/node_modules/pg/lib/defaults.js
var require_defaults = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/defaults.js"(exports, module) {
    "use strict";
    init_globals();
    var user;
    try {
      user = process.platform === "win32" ? process.env.USERNAME : process.env.USER;
    } catch {
    }
    module.exports = {
      // database host. defaults to localhost
      host: "localhost",
      // database user's name
      user,
      // name of database to connect
      database: void 0,
      // database user's password
      password: null,
      // a Postgres connection string to be used instead of setting individual connection items
      // NOTE:  Setting this value will cause it to override any other value (such as database or user) defined
      // in the defaults object.
      connectionString: void 0,
      // database port
      port: 5432,
      // number of rows to return at a time from a prepared statement's
      // portal. 0 will return all rows at once
      rows: 0,
      // binary result mode
      binary: false,
      // Connection pool options - see https://github.com/brianc/node-pg-pool
      // number of connections to use in connection pool
      // 0 will disable connection pooling
      max: 10,
      // max milliseconds a client can go unused before it is removed
      // from the pool and destroyed
      idleTimeoutMillis: 3e4,
      client_encoding: "",
      ssl: false,
      // SSL negotiation style: 'postgres' (traditional SSLRequest) or 'direct'
      sslnegotiation: void 0,
      application_name: void 0,
      fallback_application_name: void 0,
      options: void 0,
      parseInputDatesAsUTC: false,
      // max milliseconds any query using this connection will execute for before timing out in error.
      // false=unlimited
      statement_timeout: false,
      // Abort any statement that waits longer than the specified duration in milliseconds while attempting to acquire a lock.
      // false=unlimited
      lock_timeout: false,
      // Terminate any session with an open transaction that has been idle for longer than the specified duration in milliseconds
      // false=unlimited
      idle_in_transaction_session_timeout: false,
      // max milliseconds to wait for query to complete (client side)
      query_timeout: false,
      connect_timeout: 0,
      keepalives: 1,
      keepalives_idle: 0
    };
    var pgTypes = require_pg_types();
    var parseBigInteger = pgTypes.getTypeParser(20, "text");
    var parseBigIntegerArray = pgTypes.getTypeParser(1016, "text");
    module.exports.__defineSetter__("parseInt8", function(val) {
      pgTypes.setTypeParser(20, "text", val ? pgTypes.getTypeParser(23, "text") : parseBigInteger);
      pgTypes.setTypeParser(1016, "text", val ? pgTypes.getTypeParser(1007, "text") : parseBigIntegerArray);
    });
  }
});

// src/academy/node/runtime/builtin-util-types.js
var builtin_util_types_exports = {};
__export(builtin_util_types_exports, {
  default: () => builtin_util_types_default
});
var builtin_util_types_default;
var init_builtin_util_types = __esm({
  "src/academy/node/runtime/builtin-util-types.js"() {
    init_globals();
    init_util();
    builtin_util_types_default = types;
  }
});

// src/academy/node/runtime/gen/util_types.cjs
var require_util_types = __commonJS({
  "src/academy/node/runtime/gen/util_types.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_util_types(), __toCommonJS(builtin_util_types_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/pg/lib/utils.js
var require_utils2 = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/utils.js"(exports, module) {
    "use strict";
    init_globals();
    var defaults2 = require_defaults();
    var nodeUtils = require_util();
    var { isDate } = require_util_types();
    var invalidDateDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "Sending an invalid date to Postgres is deprecated and will throw an error in the next major version of pg. Ensure any Date object passed as a query parameter is valid.",
      "PG_INVALID_DATE"
    );
    function escapeElement(elementRepresentation) {
      const escaped = elementRepresentation.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return '"' + escaped + '"';
    }
    __name(escapeElement, "escapeElement");
    function arrayString(val) {
      let result = "{";
      for (let i2 = 0; i2 < val.length; i2++) {
        if (i2 > 0) {
          result += ",";
        }
        let item = val[i2];
        if (item == null) {
          result += "NULL";
        } else if (Array.isArray(item)) {
          result += arrayString(item);
        } else if (ArrayBuffer.isView(item)) {
          if (!(item instanceof globalThis.__labBuffer)) {
            item = globalThis.__labBuffer.from(item.buffer, item.byteOffset, item.byteLength);
          }
          result += "\\\\x" + item.toString("hex");
        } else {
          result += escapeElement(prepareValue(item));
        }
      }
      result += "}";
      return result;
    }
    __name(arrayString, "arrayString");
    var prepareValue = /* @__PURE__ */ __name(function(val, seen) {
      if (val == null) {
        return null;
      }
      if (typeof val === "object") {
        if (val instanceof globalThis.__labBuffer) {
          return val;
        }
        if (ArrayBuffer.isView(val)) {
          return globalThis.__labBuffer.from(val.buffer, val.byteOffset, val.byteLength);
        }
        if (isDate(val)) {
          if (isNaN(val.getTime())) {
            invalidDateDeprecationNotice();
          }
          if (defaults2.parseInputDatesAsUTC) {
            return dateToStringUTC(val);
          } else {
            return dateToString(val);
          }
        }
        if (Array.isArray(val)) {
          return arrayString(val);
        }
        return prepareObject(val, seen);
      }
      return val.toString();
    }, "prepareValue");
    function prepareObject(val, seen) {
      if (val && typeof val.toPostgres === "function") {
        seen = seen || [];
        if (seen.indexOf(val) !== -1) {
          throw new Error('circular reference detected while preparing "' + val + '" for query');
        }
        seen.push(val);
        return prepareValue(val.toPostgres(prepareValue), seen);
      }
      return JSON.stringify(val);
    }
    __name(prepareObject, "prepareObject");
    function dateToString(date) {
      let offset = -date.getTimezoneOffset();
      let year = date.getFullYear();
      const isBCYear = year < 1;
      if (isBCYear) year = Math.abs(year) + 1;
      let ret = String(year).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + "T" + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0") + "." + String(date.getMilliseconds()).padStart(3, "0");
      if (offset < 0) {
        ret += "-";
        offset *= -1;
      } else {
        ret += "+";
      }
      ret += String(Math.floor(offset / 60)).padStart(2, "0") + ":" + String(offset % 60).padStart(2, "0");
      if (isBCYear) ret += " BC";
      return ret;
    }
    __name(dateToString, "dateToString");
    function dateToStringUTC(date) {
      let year = date.getUTCFullYear();
      const isBCYear = year < 1;
      if (isBCYear) year = Math.abs(year) + 1;
      let ret = String(year).padStart(4, "0") + "-" + String(date.getUTCMonth() + 1).padStart(2, "0") + "-" + String(date.getUTCDate()).padStart(2, "0") + "T" + String(date.getUTCHours()).padStart(2, "0") + ":" + String(date.getUTCMinutes()).padStart(2, "0") + ":" + String(date.getUTCSeconds()).padStart(2, "0") + "." + String(date.getUTCMilliseconds()).padStart(3, "0");
      ret += "+00:00";
      if (isBCYear) ret += " BC";
      return ret;
    }
    __name(dateToStringUTC, "dateToStringUTC");
    function normalizeQueryConfig(config, values, callback) {
      config = typeof config === "string" ? { text: config } : cloneQueryConfig(config);
      if (values) {
        if (typeof values === "function") {
          config.callback = values;
        } else {
          config.values = values;
        }
      }
      if (callback) {
        config.callback = callback;
      }
      return config;
    }
    __name(normalizeQueryConfig, "normalizeQueryConfig");
    function cloneQueryConfig(config) {
      if (config == null) {
        return config;
      }
      return Object.defineProperties(Object.create(Object.getPrototypeOf(config)), Object.getOwnPropertyDescriptors(config));
    }
    __name(cloneQueryConfig, "cloneQueryConfig");
    var escapeIdentifier2 = /* @__PURE__ */ __name(function(str) {
      return '"' + str.replace(/"/g, '""') + '"';
    }, "escapeIdentifier");
    var escapeLiteral2 = /* @__PURE__ */ __name(function(str) {
      let hasBackslash = false;
      let escaped = "'";
      if (str == null) {
        return "''";
      }
      if (typeof str !== "string") {
        return "''";
      }
      for (let i2 = 0; i2 < str.length; i2++) {
        const c = str[i2];
        if (c === "'") {
          escaped += c + c;
        } else if (c === "\\") {
          escaped += c + c;
          hasBackslash = true;
        } else {
          escaped += c;
        }
      }
      escaped += "'";
      if (hasBackslash === true) {
        escaped = " E" + escaped;
      }
      return escaped;
    }, "escapeLiteral");
    module.exports = {
      prepareValue: /* @__PURE__ */ __name(function prepareValueWrapper(value) {
        return prepareValue(value);
      }, "prepareValueWrapper"),
      normalizeQueryConfig,
      escapeIdentifier: escapeIdentifier2,
      escapeLiteral: escapeLiteral2
    };
  }
});

// src/academy/node/runtime/gen/crypto.cjs
var require_crypto = __commonJS({
  "src/academy/node/runtime/gen/crypto.cjs"(exports, module) {
    init_globals();
    var m = (init_crypto(), __toCommonJS(crypto_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/pg/lib/crypto/utils.js
var require_utils3 = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/crypto/utils.js"(exports, module) {
    init_globals();
    var nodeCrypto = require_crypto();
    module.exports = {
      postgresMd5PasswordHash,
      randomBytes,
      deriveKey,
      sha256,
      hashByName,
      hmacSha256,
      md5
    };
    var webCrypto = nodeCrypto.webcrypto || globalThis.crypto;
    var subtleCrypto = webCrypto.subtle;
    var textEncoder = new TextEncoder();
    function randomBytes(length) {
      return webCrypto.getRandomValues(globalThis.__labBuffer.alloc(length));
    }
    __name(randomBytes, "randomBytes");
    async function md5(string) {
      try {
        return nodeCrypto.createHash("md5").update(string, "utf-8").digest("hex");
      } catch (e) {
        const data = typeof string === "string" ? textEncoder.encode(string) : string;
        const hash = await subtleCrypto.digest("MD5", data);
        return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    }
    __name(md5, "md5");
    async function postgresMd5PasswordHash(user, password, salt) {
      const inner = await md5(password + user);
      const outer = await md5(globalThis.__labBuffer.concat([globalThis.__labBuffer.from(inner), salt]));
      return "md5" + outer;
    }
    __name(postgresMd5PasswordHash, "postgresMd5PasswordHash");
    async function sha256(text) {
      return await subtleCrypto.digest("SHA-256", text);
    }
    __name(sha256, "sha256");
    async function hashByName(hashName, text) {
      return await subtleCrypto.digest(hashName, text);
    }
    __name(hashByName, "hashByName");
    async function hmacSha256(keyBuffer, msg2) {
      const key = await subtleCrypto.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      return await subtleCrypto.sign("HMAC", key, textEncoder.encode(msg2));
    }
    __name(hmacSha256, "hmacSha256");
    async function deriveKey(password, salt, iterations) {
      const key = await subtleCrypto.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveBits"]);
      const params = { name: "PBKDF2", hash: "SHA-256", salt, iterations };
      return await subtleCrypto.deriveBits(params, key, 32 * 8, ["deriveBits"]);
    }
    __name(deriveKey, "deriveKey");
  }
});

// scripts/node-lab/node_modules/pg/lib/crypto/cert-signatures.js
var require_cert_signatures = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/crypto/cert-signatures.js"(exports, module) {
    init_globals();
    function x509Error(msg2, cert) {
      return new Error("SASL channel binding: " + msg2 + " when parsing public certificate " + cert.toString("base64"));
    }
    __name(x509Error, "x509Error");
    function readASN1Length(data, index) {
      let length = data[index++];
      if (length < 128) return { length, index };
      const lengthBytes = length & 127;
      if (lengthBytes > 4) throw x509Error("bad length", data);
      length = 0;
      for (let i2 = 0; i2 < lengthBytes; i2++) {
        length = length << 8 | data[index++];
      }
      return { length, index };
    }
    __name(readASN1Length, "readASN1Length");
    function readASN1OID(data, index) {
      if (data[index++] !== 6) throw x509Error("non-OID data", data);
      const { length: OIDLength, index: indexAfterOIDLength } = readASN1Length(data, index);
      index = indexAfterOIDLength;
      const lastIndex = index + OIDLength;
      const byte1 = data[index++];
      let oid = (byte1 / 40 >> 0) + "." + byte1 % 40;
      while (index < lastIndex) {
        let value = 0;
        while (index < lastIndex) {
          const nextByte = data[index++];
          value = value << 7 | nextByte & 127;
          if (nextByte < 128) break;
        }
        oid += "." + value;
      }
      return { oid, index };
    }
    __name(readASN1OID, "readASN1OID");
    function expectASN1Seq(data, index) {
      if (data[index++] !== 48) throw x509Error("non-sequence data", data);
      return readASN1Length(data, index);
    }
    __name(expectASN1Seq, "expectASN1Seq");
    function signatureAlgorithmHashFromCertificate(data, index) {
      if (index === void 0) index = 0;
      index = expectASN1Seq(data, index).index;
      const { length: certInfoLength, index: indexAfterCertInfoLength } = expectASN1Seq(data, index);
      index = indexAfterCertInfoLength + certInfoLength;
      index = expectASN1Seq(data, index).index;
      const { oid, index: indexAfterOID } = readASN1OID(data, index);
      switch (oid) {
        // RSA
        case "1.2.840.113549.1.1.4":
          return "MD5";
        case "1.2.840.113549.1.1.5":
          return "SHA-1";
        case "1.2.840.113549.1.1.11":
          return "SHA-256";
        case "1.2.840.113549.1.1.12":
          return "SHA-384";
        case "1.2.840.113549.1.1.13":
          return "SHA-512";
        case "1.2.840.113549.1.1.14":
          return "SHA-224";
        case "1.2.840.113549.1.1.15":
          return "SHA512-224";
        case "1.2.840.113549.1.1.16":
          return "SHA512-256";
        // ECDSA
        case "1.2.840.10045.4.1":
          return "SHA-1";
        case "1.2.840.10045.4.3.1":
          return "SHA-224";
        case "1.2.840.10045.4.3.2":
          return "SHA-256";
        case "1.2.840.10045.4.3.3":
          return "SHA-384";
        case "1.2.840.10045.4.3.4":
          return "SHA-512";
        // RSASSA-PSS: hash is indicated separately
        case "1.2.840.113549.1.1.10": {
          index = indexAfterOID;
          index = expectASN1Seq(data, index).index;
          if (data[index++] !== 160) throw x509Error("non-tag data", data);
          index = readASN1Length(data, index).index;
          index = expectASN1Seq(data, index).index;
          const { oid: hashOID } = readASN1OID(data, index);
          switch (hashOID) {
            // standalone hash OIDs
            case "1.2.840.113549.2.5":
              return "MD5";
            case "1.3.14.3.2.26":
              return "SHA-1";
            case "2.16.840.1.101.3.4.2.1":
              return "SHA-256";
            case "2.16.840.1.101.3.4.2.2":
              return "SHA-384";
            case "2.16.840.1.101.3.4.2.3":
              return "SHA-512";
          }
          throw x509Error("unknown hash OID " + hashOID, data);
        }
        // Ed25519 -- see https://github.com/openssl/openssl/issues/15477
        case "1.3.101.110":
        case "1.3.101.112":
          return "SHA-512";
        // Ed448 -- still not in pg 17.2 (if supported, digest would be SHAKE256 x 64 bytes)
        case "1.3.101.111":
        case "1.3.101.113":
          throw x509Error("Ed448 certificate channel binding is not currently supported by Postgres");
      }
      throw x509Error("unknown OID " + oid, data);
    }
    __name(signatureAlgorithmHashFromCertificate, "signatureAlgorithmHashFromCertificate");
    module.exports = { signatureAlgorithmHashFromCertificate };
  }
});

// scripts/node-lab/node_modules/pg/lib/crypto/sasl.js
var require_sasl = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/crypto/sasl.js"(exports, module) {
    "use strict";
    init_globals();
    var crypto = require_utils3();
    var { signatureAlgorithmHashFromCertificate } = require_cert_signatures();
    function saslprep(password) {
      const nonAsciiSpace = /[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g;
      const mappedToNothing = /[\u00AD\u034F\u1806\u180B\u180C\u180D\u200C\u200D\u2060\uFE00-\uFE0F\uFEFF]/g;
      return password.replace(nonAsciiSpace, " ").replace(mappedToNothing, "").normalize("NFKC");
    }
    __name(saslprep, "saslprep");
    var DEFAULT_MAX_SCRAM_ITERATIONS = 1e5;
    function startSession(mechanisms, stream, scramMaxIterations = DEFAULT_MAX_SCRAM_ITERATIONS) {
      const candidates = ["SCRAM-SHA-256"];
      if (stream) candidates.unshift("SCRAM-SHA-256-PLUS");
      const mechanism = candidates.find((candidate) => mechanisms.includes(candidate));
      if (!mechanism) {
        throw new Error("SASL: Only mechanism(s) " + candidates.join(" and ") + " are supported");
      }
      if (mechanism === "SCRAM-SHA-256-PLUS" && typeof stream.getPeerCertificate !== "function") {
        throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");
      }
      const clientNonce = crypto.randomBytes(18).toString("base64");
      const gs2Header = mechanism === "SCRAM-SHA-256-PLUS" ? "p=tls-server-end-point" : stream ? "y" : "n";
      return {
        mechanism,
        clientNonce,
        response: gs2Header + ",,n=*,r=" + clientNonce,
        message: "SASLInitialResponse",
        scramMaxIterations
      };
    }
    __name(startSession, "startSession");
    async function continueSession(session, password, serverData, stream) {
      if (session.message !== "SASLInitialResponse") {
        throw new Error("SASL: Last message was not SASLInitialResponse");
      }
      if (typeof password !== "string") {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
      }
      if (password === "") {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");
      }
      if (typeof serverData !== "string") {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
      }
      const sv = parseServerFirstMessage(serverData);
      if (!sv.nonce.startsWith(session.clientNonce)) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
      } else if (sv.nonce.length === session.clientNonce.length) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
      }
      const scramMaxIterations = typeof session.scramMaxIterations === "number" ? session.scramMaxIterations : DEFAULT_MAX_SCRAM_ITERATIONS;
      if (scramMaxIterations !== 0 && sv.iteration > scramMaxIterations) {
        throw new Error(
          "SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration count " + sv.iteration + " exceeds scramMaxIterations of " + scramMaxIterations
        );
      }
      const clientFirstMessageBare = "n=*,r=" + session.clientNonce;
      const serverFirstMessage = "r=" + sv.nonce + ",s=" + sv.salt + ",i=" + sv.iteration;
      let channelBinding = stream ? "eSws" : "biws";
      if (session.mechanism === "SCRAM-SHA-256-PLUS") {
        const peerCert = stream.getPeerCertificate().raw;
        let hashName = signatureAlgorithmHashFromCertificate(peerCert);
        if (hashName === "MD5" || hashName === "SHA-1") hashName = "SHA-256";
        const certHash = await crypto.hashByName(hashName, peerCert);
        const bindingData = globalThis.__labBuffer.concat([globalThis.__labBuffer.from("p=tls-server-end-point,,"), globalThis.__labBuffer.from(certHash)]);
        channelBinding = bindingData.toString("base64");
      }
      const clientFinalMessageWithoutProof = "c=" + channelBinding + ",r=" + sv.nonce;
      const authMessage = clientFirstMessageBare + "," + serverFirstMessage + "," + clientFinalMessageWithoutProof;
      const saltBytes = globalThis.__labBuffer.from(sv.salt, "base64");
      const saltedPassword = await crypto.deriveKey(saslprep(password), saltBytes, sv.iteration);
      const clientKey = await crypto.hmacSha256(saltedPassword, "Client Key");
      const storedKey = await crypto.sha256(clientKey);
      const clientSignature = await crypto.hmacSha256(storedKey, authMessage);
      const clientProof = xorBuffers(globalThis.__labBuffer.from(clientKey), globalThis.__labBuffer.from(clientSignature)).toString("base64");
      const serverKey = await crypto.hmacSha256(saltedPassword, "Server Key");
      const serverSignatureBytes = await crypto.hmacSha256(serverKey, authMessage);
      session.message = "SASLResponse";
      session.serverSignature = globalThis.__labBuffer.from(serverSignatureBytes).toString("base64");
      session.response = clientFinalMessageWithoutProof + ",p=" + clientProof;
    }
    __name(continueSession, "continueSession");
    function finalizeSession(session, serverData) {
      if (session.message !== "SASLResponse") {
        throw new Error("SASL: Last message was not SASLResponse");
      }
      if (typeof serverData !== "string") {
        throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
      }
      const { serverSignature } = parseServerFinalMessage(serverData);
      if (serverSignature !== session.serverSignature) {
        throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
      }
    }
    __name(finalizeSession, "finalizeSession");
    function isPrintableChars(text) {
      if (typeof text !== "string") {
        throw new TypeError("SASL: text must be a string");
      }
      return text.split("").map((_, i2) => text.charCodeAt(i2)).every((c) => c >= 33 && c <= 43 || c >= 45 && c <= 126);
    }
    __name(isPrintableChars, "isPrintableChars");
    function isBase64(text) {
      return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text);
    }
    __name(isBase64, "isBase64");
    function parseAttributePairs(text) {
      if (typeof text !== "string") {
        throw new TypeError("SASL: attribute pairs text must be a string");
      }
      return new Map(
        text.split(",").map((attrValue) => {
          if (!/^.=/.test(attrValue)) {
            throw new Error("SASL: Invalid attribute pair entry");
          }
          const name = attrValue[0];
          const value = attrValue.substring(2);
          return [name, value];
        })
      );
    }
    __name(parseAttributePairs, "parseAttributePairs");
    function parseServerFirstMessage(data) {
      const attrPairs = parseAttributePairs(data);
      const nonce = attrPairs.get("r");
      if (!nonce) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
      } else if (!isPrintableChars(nonce)) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
      }
      const salt = attrPairs.get("s");
      if (!salt) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
      } else if (!isBase64(salt)) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
      }
      const iterationText = attrPairs.get("i");
      if (!iterationText) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
      } else if (!/^[1-9][0-9]*$/.test(iterationText)) {
        throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
      }
      const iteration = parseInt(iterationText, 10);
      return {
        nonce,
        salt,
        iteration
      };
    }
    __name(parseServerFirstMessage, "parseServerFirstMessage");
    function parseServerFinalMessage(serverData) {
      const attrPairs = parseAttributePairs(serverData);
      const error = attrPairs.get("e");
      const serverSignature = attrPairs.get("v");
      if (error) {
        throw new Error(`SASL: SCRAM-SERVER-FINAL-MESSAGE: server returned error: "${error}"`);
      }
      if (!serverSignature) {
        throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
      } else if (!isBase64(serverSignature)) {
        throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
      }
      return {
        serverSignature
      };
    }
    __name(parseServerFinalMessage, "parseServerFinalMessage");
    function xorBuffers(a, b) {
      if (!globalThis.__labBuffer.isBuffer(a)) {
        throw new TypeError("first argument must be a Buffer");
      }
      if (!globalThis.__labBuffer.isBuffer(b)) {
        throw new TypeError("second argument must be a Buffer");
      }
      if (a.length !== b.length) {
        throw new Error("Buffer lengths must match");
      }
      if (a.length === 0) {
        throw new Error("Buffers cannot be empty");
      }
      return globalThis.__labBuffer.from(a.map((_, i2) => a[i2] ^ b[i2]));
    }
    __name(xorBuffers, "xorBuffers");
    module.exports = {
      startSession,
      continueSession,
      finalizeSession,
      DEFAULT_MAX_SCRAM_ITERATIONS
    };
  }
});

// scripts/node-lab/node_modules/pg/lib/type-overrides.js
var require_type_overrides = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/type-overrides.js"(exports, module) {
    "use strict";
    init_globals();
    var types3 = require_pg_types();
    function TypeOverrides2(userTypes) {
      this._types = userTypes || types3;
      this.text = {};
      this.binary = {};
    }
    __name(TypeOverrides2, "TypeOverrides");
    TypeOverrides2.prototype.getOverrides = function(format4) {
      switch (format4) {
        case "text":
          return this.text;
        case "binary":
          return this.binary;
        default:
          return {};
      }
    };
    TypeOverrides2.prototype.setTypeParser = function(oid, format4, parseFn) {
      if (typeof format4 === "function") {
        parseFn = format4;
        format4 = "text";
      }
      this.getOverrides(format4)[oid] = parseFn;
    };
    TypeOverrides2.prototype.getTypeParser = function(oid, format4) {
      format4 = format4 || "text";
      return this.getOverrides(format4)[oid] || this._types.getTypeParser(oid, format4);
    };
    module.exports = TypeOverrides2;
  }
});

// src/academy/node/runtime/builtin-dns.js
var builtin_dns_exports = {};
__export(builtin_dns_exports, {
  default: () => builtin_dns_default,
  lookup: () => lookup,
  promises: () => promises
});
var builtin_dns_default, lookup, promises;
var init_builtin_dns = __esm({
  "src/academy/node/runtime/builtin-dns.js"() {
    init_globals();
    init_builtins();
    builtin_dns_default = dns;
    ({ lookup, promises } = dns);
  }
});

// src/academy/node/runtime/gen/dns.cjs
var require_dns = __commonJS({
  "src/academy/node/runtime/gen/dns.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_dns(), __toCommonJS(builtin_dns_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/pg-connection-string/index.js
var require_pg_connection_string = __commonJS({
  "scripts/node-lab/node_modules/pg-connection-string/index.js"(exports, module) {
    "use strict";
    init_globals();
    function parse3(str, options = {}) {
      if (str.charAt(0) === "/") {
        const config2 = str.split(" ");
        return { host: config2[0], database: config2[1] };
      }
      const config = /* @__PURE__ */ Object.create(null);
      let result;
      let dummyHost = false;
      if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
        str = encodeURI(str).replace(/%25(\d\d)/g, "%$1");
      }
      try {
        try {
          result = new URL(str, "postgres://base");
        } catch (e) {
          result = new URL(str.replace("@/", "@___DUMMY___/"), "postgres://base");
          dummyHost = true;
        }
      } catch (err2) {
        err2.input && (err2.input = "*****REDACTED*****");
        throw err2;
      }
      for (const entry of result.searchParams.entries()) {
        config[entry[0]] = entry[1];
      }
      config.user = config.user || decodeURIComponent(result.username);
      config.password = config.password || decodeURIComponent(result.password);
      if (result.protocol == "socket:") {
        config.host = decodeURI(result.pathname);
        config.database = result.searchParams.get("db");
        config.client_encoding = result.searchParams.get("encoding");
        return config;
      }
      const hostname2 = (dummyHost ? "" : result.hostname).replace(/^\[(.+)\]$/, "$1");
      if (!config.host) {
        config.host = decodeURIComponent(hostname2);
      } else if (hostname2 && /^%2f/i.test(hostname2)) {
        result.pathname = hostname2 + result.pathname;
      }
      if (!config.port) {
        config.port = result.port;
      }
      const pathname = result.pathname.slice(1) || null;
      config.database = pathname ? decodeURI(pathname) : null;
      if (config.ssl === "true" || config.ssl === "1") {
        config.ssl = true;
      }
      if (config.ssl === "0") {
        config.ssl = false;
      }
      if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
        config.ssl = {};
      }
      if (config.sslnegotiation === "direct" && config.ssl === void 0) {
        config.ssl = true;
      }
      const fs = config.sslcert || config.sslkey || config.sslrootcert ? require_fs() : null;
      if (config.sslcert) {
        config.ssl.cert = fs.readFileSync(config.sslcert).toString();
      }
      if (config.sslkey) {
        config.ssl.key = fs.readFileSync(config.sslkey).toString();
      }
      if (config.sslrootcert) {
        config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
      }
      if (options.useLibpqCompat && config.uselibpqcompat) {
        throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");
      }
      if (config.uselibpqcompat === "true" || options.useLibpqCompat) {
        switch (config.sslmode) {
          case "disable": {
            config.ssl = false;
            break;
          }
          case "prefer": {
            config.ssl.rejectUnauthorized = false;
            break;
          }
          case "require": {
            if (config.sslrootcert) {
              config.ssl.checkServerIdentity = function() {
              };
            } else {
              config.ssl.rejectUnauthorized = false;
            }
            break;
          }
          case "verify-ca": {
            if (!config.ssl.ca) {
              throw new Error(
                "SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security."
              );
            }
            config.ssl.checkServerIdentity = function() {
            };
            break;
          }
          case "verify-full": {
            break;
          }
        }
      } else {
        switch (config.sslmode) {
          case "disable": {
            config.ssl = false;
            break;
          }
          case "prefer":
          case "require":
          case "verify-ca":
          case "verify-full": {
            if (config.sslmode !== "verify-full") {
              deprecatedSslModeWarning(config.sslmode);
            }
            break;
          }
          case "no-verify": {
            config.ssl.rejectUnauthorized = false;
            break;
          }
        }
      }
      return config;
    }
    __name(parse3, "parse");
    function toConnectionOptions(sslConfig) {
      const connectionOptions = Object.entries(sslConfig).reduce((c, [key, value]) => {
        if (value !== void 0 && value !== null) {
          c[key] = value;
        }
        return c;
      }, /* @__PURE__ */ Object.create(null));
      return connectionOptions;
    }
    __name(toConnectionOptions, "toConnectionOptions");
    function toClientConfig(config) {
      const poolConfig = Object.entries(config).reduce((c, [key, value]) => {
        if (key === "ssl") {
          const sslConfig = value;
          if (typeof sslConfig === "boolean") {
            c[key] = sslConfig;
          }
          if (typeof sslConfig === "object") {
            c[key] = toConnectionOptions(sslConfig);
          }
        } else if (value !== void 0 && value !== null) {
          if (key === "port") {
            if (value !== "") {
              const v = parseInt(value, 10);
              if (isNaN(v)) {
                throw new Error(`Invalid ${key}: ${value}`);
              }
              c[key] = v;
            }
          } else {
            c[key] = value;
          }
        }
        return c;
      }, /* @__PURE__ */ Object.create(null));
      return poolConfig;
    }
    __name(toClientConfig, "toClientConfig");
    function parseIntoClientConfig(str) {
      return toClientConfig(parse3(str));
    }
    __name(parseIntoClientConfig, "parseIntoClientConfig");
    function deprecatedSslModeWarning(sslmode) {
      if (!deprecatedSslModeWarning.warned && typeof process !== "undefined" && process.emitWarning) {
        deprecatedSslModeWarning.warned = true;
        process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${sslmode}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`);
      }
    }
    __name(deprecatedSslModeWarning, "deprecatedSslModeWarning");
    module.exports = parse3;
    parse3.parse = parse3;
    parse3.toClientConfig = toClientConfig;
    parse3.parseIntoClientConfig = parseIntoClientConfig;
  }
});

// scripts/node-lab/node_modules/pg/lib/connection-parameters.js
var require_connection_parameters = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/connection-parameters.js"(exports, module) {
    "use strict";
    init_globals();
    var dns2 = require_dns();
    var defaults2 = require_defaults();
    var parse3 = require_pg_connection_string().parse;
    var val = /* @__PURE__ */ __name(function(key, config, envVar) {
      if (config[key]) {
        return config[key];
      }
      if (envVar === void 0) {
        envVar = process.env["PG" + key.toUpperCase()];
      } else if (envVar === false) {
      } else {
        envVar = process.env[envVar];
      }
      return envVar || defaults2[key];
    }, "val");
    var readSSLConfigFromEnvironment = /* @__PURE__ */ __name(function() {
      switch (process.env.PGSSLMODE) {
        case "disable":
          return false;
        case "prefer":
        case "require":
        case "verify-ca":
        case "verify-full":
          return true;
        case "no-verify":
          return { rejectUnauthorized: false };
      }
      return defaults2.ssl;
    }, "readSSLConfigFromEnvironment");
    var quoteParamValue = /* @__PURE__ */ __name(function(value) {
      return "'" + ("" + value).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
    }, "quoteParamValue");
    var add = /* @__PURE__ */ __name(function(params, config, paramName) {
      const value = config[paramName];
      if (value !== void 0 && value !== null) {
        params.push(paramName + "=" + quoteParamValue(value));
      }
    }, "add");
    var ConnectionParameters = class {
      static {
        __name(this, "ConnectionParameters");
      }
      constructor(config) {
        config = typeof config === "string" ? parse3(config) : config || {};
        if (config.connectionString) {
          config = Object.assign({}, config, parse3(config.connectionString));
        }
        this.user = val("user", config);
        this.database = val("database", config);
        if (this.database === void 0) {
          this.database = this.user;
        }
        this.port = parseInt(val("port", config), 10);
        this.host = val("host", config);
        Object.defineProperty(this, "password", {
          configurable: true,
          enumerable: false,
          writable: true,
          value: val("password", config)
        });
        this.binary = val("binary", config);
        this.options = val("options", config);
        this.ssl = typeof config.ssl === "undefined" ? readSSLConfigFromEnvironment() : config.ssl;
        if (typeof this.ssl === "string") {
          if (this.ssl === "true") {
            this.ssl = true;
          }
        }
        if (this.ssl === "no-verify") {
          this.ssl = { rejectUnauthorized: false };
        }
        if (this.ssl && this.ssl.key) {
          Object.defineProperty(this.ssl, "key", {
            enumerable: false
          });
        }
        this.sslnegotiation = val("sslnegotiation", config, "PGSSLNEGOTIATION");
        if (this.sslnegotiation !== void 0 && this.sslnegotiation !== "postgres" && this.sslnegotiation !== "direct") {
          throw new Error(
            `Invalid sslnegotiation value: "${this.sslnegotiation}". Valid values are "postgres" and "direct".`
          );
        }
        if (this.sslnegotiation === "direct" && !this.ssl) {
          throw new Error("sslnegotiation=direct requires SSL to be enabled");
        }
        this.client_encoding = val("client_encoding", config);
        this.replication = val("replication", config);
        this.isDomainSocket = !(this.host || "").indexOf("/");
        this.application_name = val("application_name", config, "PGAPPNAME");
        this.fallback_application_name = val("fallback_application_name", config, false);
        this.statement_timeout = val("statement_timeout", config, false);
        this.lock_timeout = val("lock_timeout", config, false);
        this.idle_in_transaction_session_timeout = val("idle_in_transaction_session_timeout", config, false);
        this.query_timeout = val("query_timeout", config, false);
        if (config.connectionTimeoutMillis === void 0) {
          this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0;
        } else {
          this.connect_timeout = Math.floor(config.connectionTimeoutMillis / 1e3);
        }
        if (config.keepAlive === false) {
          this.keepalives = 0;
        } else if (config.keepAlive === true) {
          this.keepalives = 1;
        }
        if (typeof config.keepAliveInitialDelayMillis === "number") {
          this.keepalives_idle = Math.floor(config.keepAliveInitialDelayMillis / 1e3);
        }
      }
      getLibpqConnectionString(cb) {
        const params = [];
        add(params, this, "user");
        add(params, this, "password");
        add(params, this, "port");
        add(params, this, "application_name");
        add(params, this, "fallback_application_name");
        add(params, this, "connect_timeout");
        add(params, this, "options");
        const ssl = typeof this.ssl === "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
        add(params, ssl, "sslmode");
        add(params, ssl, "sslca");
        add(params, ssl, "sslkey");
        add(params, ssl, "sslcert");
        add(params, ssl, "sslrootcert");
        add(params, this, "sslnegotiation");
        if (this.database) {
          params.push("dbname=" + quoteParamValue(this.database));
        }
        if (this.replication) {
          params.push("replication=" + quoteParamValue(this.replication));
        }
        if (this.host) {
          params.push("host=" + quoteParamValue(this.host));
        }
        if (this.isDomainSocket) {
          return cb(null, params.join(" "));
        }
        if (this.client_encoding) {
          params.push("client_encoding=" + quoteParamValue(this.client_encoding));
        }
        dns2.lookup(this.host, function(err2, address) {
          if (err2) return cb(err2, null);
          params.push("hostaddr=" + quoteParamValue(address));
          return cb(null, params.join(" "));
        });
      }
    };
    module.exports = ConnectionParameters;
  }
});

// scripts/node-lab/node_modules/pg/lib/result.js
var require_result = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/result.js"(exports, module) {
    "use strict";
    init_globals();
    var types3 = require_pg_types();
    var matchRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;
    var Result2 = class {
      static {
        __name(this, "Result");
      }
      constructor(rowMode, types4) {
        this.command = null;
        this.rowCount = null;
        this.oid = null;
        this.rows = [];
        this.fields = [];
        this._parsers = void 0;
        this._types = types4;
        this.RowCtor = null;
        this.rowAsArray = rowMode === "array";
        if (this.rowAsArray) {
          this.parseRow = this._parseRowAsArray;
        }
        this._prebuiltEmptyResultObject = null;
      }
      // adds a command complete message
      addCommandComplete(msg2) {
        let match;
        if (msg2.text) {
          match = matchRegexp.exec(msg2.text);
        } else {
          match = matchRegexp.exec(msg2.command);
        }
        if (match) {
          this.command = match[1];
          if (match[3]) {
            this.oid = parseInt(match[2], 10);
            this.rowCount = parseInt(match[3], 10);
          } else if (match[2]) {
            this.rowCount = parseInt(match[2], 10);
          }
        }
      }
      _parseRowAsArray(rowData) {
        const row = new Array(rowData.length);
        for (let i2 = 0, len = rowData.length; i2 < len; i2++) {
          const rawValue = rowData[i2];
          if (rawValue !== null) {
            row[i2] = this._parsers[i2](rawValue);
          } else {
            row[i2] = null;
          }
        }
        return row;
      }
      parseRow(rowData) {
        const row = { ...this._prebuiltEmptyResultObject };
        for (let i2 = 0, len = rowData.length; i2 < len; i2++) {
          const rawValue = rowData[i2];
          const field = this.fields[i2].name;
          if (rawValue !== null) {
            const v = this.fields[i2].format === "binary" ? globalThis.__labBuffer.from(rawValue) : rawValue;
            row[field] = this._parsers[i2](v);
          } else {
            row[field] = null;
          }
        }
        return row;
      }
      addRow(row) {
        this.rows.push(row);
      }
      addFields(fieldDescriptions) {
        this.fields = fieldDescriptions;
        if (this.fields.length) {
          this._parsers = new Array(fieldDescriptions.length);
        }
        const row = /* @__PURE__ */ Object.create(null);
        for (let i2 = 0; i2 < fieldDescriptions.length; i2++) {
          const desc = fieldDescriptions[i2];
          row[desc.name] = null;
          if (this._types) {
            this._parsers[i2] = this._types.getTypeParser(desc.dataTypeID, desc.format || "text");
          } else {
            this._parsers[i2] = types3.getTypeParser(desc.dataTypeID, desc.format || "text");
          }
        }
        this._prebuiltEmptyResultObject = { ...row };
      }
    };
    module.exports = Result2;
  }
});

// scripts/node-lab/node_modules/pg/lib/query.js
var require_query = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/query.js"(exports, module) {
    "use strict";
    init_globals();
    var { EventEmitter } = require_events();
    var Result2 = require_result();
    var utils = require_utils2();
    var Query2 = class extends EventEmitter {
      static {
        __name(this, "Query");
      }
      constructor(config, values, callback) {
        super();
        config = utils.normalizeQueryConfig(config, values, callback);
        this.text = config.text;
        this.values = config.values;
        this.rows = config.rows;
        this.types = config.types;
        this.name = config.name;
        this.queryMode = config.queryMode;
        this.binary = config.binary;
        this.portal = config.portal || "";
        this.callback = config.callback;
        this._rowMode = config.rowMode;
        if (process.domain && config.callback) {
          this.callback = process.domain.bind(config.callback);
        }
        this._result = new Result2(this._rowMode, this.types);
        this._results = this._result;
        this._canceledDueToError = false;
      }
      requiresPreparation() {
        if (this.queryMode === "extended") {
          return true;
        }
        if (this.name) {
          return true;
        }
        if (this.rows) {
          return true;
        }
        if (!this.text) {
          return false;
        }
        if (!this.values) {
          return false;
        }
        return this.values.length > 0;
      }
      _checkForMultirow() {
        if (this._result.command) {
          if (!Array.isArray(this._results)) {
            this._results = [this._result];
          }
          this._result = new Result2(this._rowMode, this._result._types);
          this._results.push(this._result);
        }
      }
      // associates row metadata from the supplied
      // message with this query object
      // metadata used when parsing row results
      handleRowDescription(msg2) {
        this._checkForMultirow();
        this._result.addFields(msg2.fields);
        this._accumulateRows = this.callback || !this.listeners("row").length;
      }
      handleDataRow(msg2) {
        let row;
        if (this._canceledDueToError) {
          return;
        }
        try {
          row = this._result.parseRow(msg2.fields);
        } catch (err2) {
          this._canceledDueToError = err2;
          return;
        }
        this.emit("row", row, this._result);
        if (this._accumulateRows) {
          this._result.addRow(row);
        }
      }
      handleCommandComplete(msg2, connection) {
        this._checkForMultirow();
        this._result.addCommandComplete(msg2);
        if (this.rows) {
          connection.sync();
        }
      }
      // if a named prepared statement is created with empty query text
      // the backend will send an emptyQuery message but *not* a command complete message
      // since we pipeline sync immediately after execute we don't need to do anything here
      // unless we have rows specified, in which case we did not pipeline the initial sync call
      handleEmptyQuery(connection) {
        if (this.rows) {
          connection.sync();
        }
      }
      handleError(err2, connection) {
        if (this._canceledDueToError) {
          err2 = this._canceledDueToError;
          this._canceledDueToError = false;
        }
        if (this.callback) {
          return this.callback(err2);
        }
        this.emit("error", err2);
      }
      handleReadyForQuery(con) {
        if (this._canceledDueToError) {
          return this.handleError(this._canceledDueToError, con);
        }
        if (this.callback) {
          try {
            this.callback(null, this._results);
          } catch (err2) {
            process.nextTick(() => {
              throw err2;
            });
          }
        }
        this.emit("end", this._results);
      }
      submit(connection) {
        if (typeof this.text !== "string" && typeof this.name !== "string") {
          return new Error("A query must have either text or a name. Supplying neither is unsupported.");
        }
        const previous = connection.parsedStatements[this.name] || connection.submittedNamedStatements[this.name];
        if (this.text && previous && this.text !== previous) {
          return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
        }
        if (this.values && !Array.isArray(this.values)) {
          return new Error("Query values must be an array");
        }
        if (this.requiresPreparation()) {
          connection.stream.cork && connection.stream.cork();
          try {
            this.prepare(connection);
          } finally {
            connection.stream.uncork && connection.stream.uncork();
          }
        } else {
          connection.query(this.text);
        }
        return null;
      }
      hasBeenParsed(connection) {
        return this.name && (connection.parsedStatements[this.name] !== void 0 || connection.submittedNamedStatements[this.name] !== void 0);
      }
      handlePortalSuspended(connection) {
        this._getRows(connection, this.rows);
      }
      _getRows(connection, rows) {
        connection.execute({
          portal: this.portal,
          rows
        });
        if (!rows) {
          connection.sync();
        } else {
          connection.flush();
        }
      }
      // http://developer.postgresql.org/pgdocs/postgres/protocol-flow.html#PROTOCOL-FLOW-EXT-QUERY
      prepare(connection) {
        if (!this.hasBeenParsed(connection)) {
          connection.parse({
            text: this.text,
            name: this.name,
            types: this.types
          });
          if (this.name) {
            connection.submittedNamedStatements[this.name] = this.text;
          }
        }
        try {
          connection.bind({
            portal: this.portal,
            statement: this.name,
            values: this.values,
            binary: this.binary,
            valueMapper: utils.prepareValue
          });
        } catch (err2) {
          connection.close({ type: "S", name: this.name });
          connection.sync();
          this.handleError(err2, connection);
          return;
        }
        connection.describe({
          type: "P",
          name: this.portal || ""
        });
        this._getRows(connection, this.rows);
      }
      handleCopyInResponse(connection) {
        connection.sendCopyFail("No source stream defined");
      }
      handleCopyData(msg2, connection) {
      }
    };
    module.exports = Query2;
  }
});

// scripts/node-lab/node_modules/pg-protocol/dist/messages.js
var require_messages = __commonJS({
  "scripts/node-lab/node_modules/pg-protocol/dist/messages.js"(exports) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoticeMessage = exports.DataRowMessage = exports.CommandCompleteMessage = exports.ReadyForQueryMessage = exports.NotificationResponseMessage = exports.BackendKeyDataMessage = exports.AuthenticationMD5Password = exports.ParameterStatusMessage = exports.ParameterDescriptionMessage = exports.RowDescriptionMessage = exports.Field = exports.CopyResponse = exports.CopyDataMessage = exports.DatabaseError = exports.copyDone = exports.emptyQuery = exports.replicationStart = exports.portalSuspended = exports.noData = exports.closeComplete = exports.bindComplete = exports.parseComplete = void 0;
    exports.parseComplete = {
      name: "parseComplete",
      length: 5
    };
    exports.bindComplete = {
      name: "bindComplete",
      length: 5
    };
    exports.closeComplete = {
      name: "closeComplete",
      length: 5
    };
    exports.noData = {
      name: "noData",
      length: 5
    };
    exports.portalSuspended = {
      name: "portalSuspended",
      length: 5
    };
    exports.replicationStart = {
      name: "replicationStart",
      length: 4
    };
    exports.emptyQuery = {
      name: "emptyQuery",
      length: 4
    };
    exports.copyDone = {
      name: "copyDone",
      length: 4
    };
    var DatabaseError2 = class extends Error {
      static {
        __name(this, "DatabaseError");
      }
      constructor(message, length, name) {
        super(message);
        this.length = length;
        this.name = name;
      }
    };
    exports.DatabaseError = DatabaseError2;
    var CopyDataMessage = class {
      static {
        __name(this, "CopyDataMessage");
      }
      constructor(length, chunk) {
        this.length = length;
        this.chunk = chunk;
        this.name = "copyData";
      }
    };
    exports.CopyDataMessage = CopyDataMessage;
    var CopyResponse = class {
      static {
        __name(this, "CopyResponse");
      }
      constructor(length, name, binary, columnCount) {
        this.length = length;
        this.name = name;
        this.binary = binary;
        this.columnTypes = new Array(columnCount);
      }
    };
    exports.CopyResponse = CopyResponse;
    var Field = class {
      static {
        __name(this, "Field");
      }
      constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format4) {
        this.name = name;
        this.tableID = tableID;
        this.columnID = columnID;
        this.dataTypeID = dataTypeID;
        this.dataTypeSize = dataTypeSize;
        this.dataTypeModifier = dataTypeModifier;
        this.format = format4;
      }
    };
    exports.Field = Field;
    var RowDescriptionMessage = class {
      static {
        __name(this, "RowDescriptionMessage");
      }
      constructor(length, fieldCount) {
        this.length = length;
        this.fieldCount = fieldCount;
        this.name = "rowDescription";
        this.fields = new Array(this.fieldCount);
      }
    };
    exports.RowDescriptionMessage = RowDescriptionMessage;
    var ParameterDescriptionMessage = class {
      static {
        __name(this, "ParameterDescriptionMessage");
      }
      constructor(length, parameterCount) {
        this.length = length;
        this.parameterCount = parameterCount;
        this.name = "parameterDescription";
        this.dataTypeIDs = new Array(this.parameterCount);
      }
    };
    exports.ParameterDescriptionMessage = ParameterDescriptionMessage;
    var ParameterStatusMessage = class {
      static {
        __name(this, "ParameterStatusMessage");
      }
      constructor(length, parameterName, parameterValue) {
        this.length = length;
        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
        this.name = "parameterStatus";
      }
    };
    exports.ParameterStatusMessage = ParameterStatusMessage;
    var AuthenticationMD5Password = class {
      static {
        __name(this, "AuthenticationMD5Password");
      }
      constructor(length, salt) {
        this.length = length;
        this.salt = salt;
        this.name = "authenticationMD5Password";
      }
    };
    exports.AuthenticationMD5Password = AuthenticationMD5Password;
    var BackendKeyDataMessage = class {
      static {
        __name(this, "BackendKeyDataMessage");
      }
      constructor(length, processID, secretKey) {
        this.length = length;
        this.processID = processID;
        this.secretKey = secretKey;
        this.name = "backendKeyData";
      }
    };
    exports.BackendKeyDataMessage = BackendKeyDataMessage;
    var NotificationResponseMessage = class {
      static {
        __name(this, "NotificationResponseMessage");
      }
      constructor(length, processId, channel, payload) {
        this.length = length;
        this.processId = processId;
        this.channel = channel;
        this.payload = payload;
        this.name = "notification";
      }
    };
    exports.NotificationResponseMessage = NotificationResponseMessage;
    var ReadyForQueryMessage = class {
      static {
        __name(this, "ReadyForQueryMessage");
      }
      constructor(length, status) {
        this.length = length;
        this.status = status;
        this.name = "readyForQuery";
      }
    };
    exports.ReadyForQueryMessage = ReadyForQueryMessage;
    var CommandCompleteMessage = class {
      static {
        __name(this, "CommandCompleteMessage");
      }
      constructor(length, text) {
        this.length = length;
        this.text = text;
        this.name = "commandComplete";
      }
    };
    exports.CommandCompleteMessage = CommandCompleteMessage;
    var DataRowMessage = class {
      static {
        __name(this, "DataRowMessage");
      }
      constructor(length, fields) {
        this.length = length;
        this.fields = fields;
        this.name = "dataRow";
        this.fieldCount = fields.length;
      }
    };
    exports.DataRowMessage = DataRowMessage;
    var NoticeMessage = class {
      static {
        __name(this, "NoticeMessage");
      }
      constructor(length, message) {
        this.length = length;
        this.message = message;
        this.name = "notice";
      }
    };
    exports.NoticeMessage = NoticeMessage;
  }
});

// scripts/node-lab/node_modules/pg-protocol/dist/buffer-writer.js
var require_buffer_writer = __commonJS({
  "scripts/node-lab/node_modules/pg-protocol/dist/buffer-writer.js"(exports) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Writer = void 0;
    var Writer = class {
      static {
        __name(this, "Writer");
      }
      constructor(size = 256) {
        this.size = size;
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = globalThis.__labBuffer.allocUnsafe(size);
      }
      ensure(size) {
        const remaining = this.buffer.length - this.offset;
        if (remaining < size) {
          const oldBuffer = this.buffer;
          const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
          this.buffer = globalThis.__labBuffer.allocUnsafe(newSize);
          oldBuffer.copy(this.buffer, 0, 0, this.offset);
        }
      }
      addInt32(num) {
        this.ensure(4);
        this.buffer[this.offset++] = num >>> 24 & 255;
        this.buffer[this.offset++] = num >>> 16 & 255;
        this.buffer[this.offset++] = num >>> 8 & 255;
        this.buffer[this.offset++] = num >>> 0 & 255;
        return this;
      }
      addInt16(num) {
        this.ensure(2);
        this.buffer[this.offset++] = num >>> 8 & 255;
        this.buffer[this.offset++] = num >>> 0 & 255;
        return this;
      }
      addCString(string) {
        if (!string) {
          this.ensure(1);
        } else {
          const len = globalThis.__labBuffer.byteLength(string);
          this.ensure(len + 1);
          this.buffer.write(string, this.offset, "utf-8");
          this.offset += len;
        }
        this.buffer[this.offset++] = 0;
        return this;
      }
      addString(string = "") {
        const len = globalThis.__labBuffer.byteLength(string);
        this.ensure(len);
        this.buffer.write(string, this.offset);
        this.offset += len;
        return this;
      }
      // Write an Int32 byte-length prefix immediately followed by the string's UTF-8
      // bytes. Postgres' Bind wire format prefixes every parameter with its length,
      // and doing it in one method computes Buffer.byteLength ONCE — the previous
      // `addInt32(Buffer.byteLength(s)).addString(s)` pairing scanned the string
      // three times (byteLength for the prefix, byteLength again inside addString,
      // then the encode), which is costly for large text parameters.
      addInt32PrefixedString(string) {
        const len = globalThis.__labBuffer.byteLength(string);
        this.ensure(4 + len);
        const buffer = this.buffer;
        let offset = this.offset;
        buffer[offset++] = len >>> 24 & 255;
        buffer[offset++] = len >>> 16 & 255;
        buffer[offset++] = len >>> 8 & 255;
        buffer[offset++] = len >>> 0 & 255;
        buffer.write(string, offset, "utf-8");
        this.offset = offset + len;
        return this;
      }
      add(otherBuffer) {
        this.ensure(otherBuffer.length);
        otherBuffer.copy(this.buffer, this.offset);
        this.offset += otherBuffer.length;
        return this;
      }
      /**
       * Appends an uninitialized block of {@link size} bytes to the buffer and returns its offset.
       */
      reserveUnsafe(size) {
        const offset = this.offset;
        this.ensure(size);
        this.offset += size;
        return offset;
      }
      join(code) {
        if (code) {
          this.buffer[this.headerPosition] = code;
          const length = this.offset - (this.headerPosition + 1);
          this.buffer.writeInt32BE(length, this.headerPosition + 1);
        }
        return this.buffer.slice(code ? 0 : 5, this.offset);
      }
      flush(code) {
        const result = this.join(code);
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = globalThis.__labBuffer.allocUnsafe(this.size);
        return result;
      }
      clear() {
        this.offset = 5;
        this.headerPosition = 0;
      }
    };
    exports.Writer = Writer;
  }
});

// scripts/node-lab/node_modules/pg-protocol/dist/serializer.js
var require_serializer = __commonJS({
  "scripts/node-lab/node_modules/pg-protocol/dist/serializer.js"(exports) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serialize = void 0;
    var buffer_writer_1 = require_buffer_writer();
    var writer = new buffer_writer_1.Writer();
    var startup = /* @__PURE__ */ __name((opts) => {
      writer.addInt16(3).addInt16(0);
      for (const key of Object.keys(opts)) {
        writer.addCString(key).addCString(opts[key]);
      }
      writer.addCString("client_encoding").addCString("UTF8");
      const bodyBuffer = writer.addCString("").flush();
      const length = bodyBuffer.length + 4;
      return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
    }, "startup");
    var requestSsl = /* @__PURE__ */ __name(() => {
      const response = globalThis.__labBuffer.allocUnsafe(8);
      response.writeInt32BE(8, 0);
      response.writeInt32BE(80877103, 4);
      return response;
    }, "requestSsl");
    var password = /* @__PURE__ */ __name((password2) => {
      return writer.addCString(password2).flush(
        112
        /* code.startup */
      );
    }, "password");
    var sendSASLInitialResponseMessage = /* @__PURE__ */ __name(function(mechanism, initialResponse) {
      writer.addCString(mechanism).addInt32PrefixedString(initialResponse);
      return writer.flush(
        112
        /* code.startup */
      );
    }, "sendSASLInitialResponseMessage");
    var sendSCRAMClientFinalMessage = /* @__PURE__ */ __name(function(additionalData) {
      return writer.addString(additionalData).flush(
        112
        /* code.startup */
      );
    }, "sendSCRAMClientFinalMessage");
    var query = /* @__PURE__ */ __name((text) => {
      return writer.addCString(text).flush(
        81
        /* code.query */
      );
    }, "query");
    var emptyArray = [];
    var parse3 = /* @__PURE__ */ __name((query2) => {
      const name = query2.name || "";
      if (name.length > 63) {
        console.error("Warning! Postgres only supports 63 characters for query names.");
        console.error("You supplied %s (%s)", name, name.length);
        console.error("This can cause conflicts and silent errors executing queries");
      }
      const types3 = query2.types || emptyArray;
      const len = types3.length;
      const buffer = writer.addCString(name).addCString(query2.text).addInt16(len);
      for (let i2 = 0; i2 < len; i2++) {
        buffer.addInt32(types3[i2]);
      }
      return writer.flush(
        80
        /* code.parse */
      );
    }, "parse");
    var writeValues = /* @__PURE__ */ __name(function(values, valueMapper, formatsOffset) {
      const len = values.length;
      for (let i2 = 0; i2 < len; i2++) {
        const mappedVal = valueMapper ? valueMapper(values[i2], i2) : values[i2];
        let formatByte = 0;
        if (mappedVal == null) {
          writer.addInt32(-1);
        } else if (mappedVal instanceof globalThis.__labBuffer) {
          formatByte = 1;
          writer.addInt32(mappedVal.length);
          writer.add(mappedVal);
        } else {
          writer.addInt32PrefixedString(mappedVal);
        }
        const buf = writer.buffer;
        buf[formatsOffset++] = 0;
        buf[formatsOffset++] = formatByte;
      }
    }, "writeValues");
    var bind = /* @__PURE__ */ __name((config = {}) => {
      const portal = config.portal || "";
      const statement = config.statement || "";
      const binary = config.binary || false;
      const values = config.values || emptyArray;
      const len = values.length;
      writer.addCString(portal).addCString(statement);
      writer.addInt16(len);
      const formatsOffset = writer.reserveUnsafe(len * 2);
      writer.addInt16(len);
      try {
        writeValues(values, config.valueMapper, formatsOffset);
      } catch (err2) {
        writer.clear();
        throw err2;
      }
      writer.addInt16(1);
      writer.addInt16(
        binary ? 1 : 0
        /* ParamType.STRING */
      );
      return writer.flush(
        66
        /* code.bind */
      );
    }, "bind");
    var emptyExecute = globalThis.__labBuffer.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]);
    var execute = /* @__PURE__ */ __name((config) => {
      if (!config || !config.portal && !config.rows) {
        return emptyExecute;
      }
      const portal = config.portal || "";
      const rows = config.rows || 0;
      const portalLength = globalThis.__labBuffer.byteLength(portal);
      const len = 4 + portalLength + 1 + 4;
      const buff = globalThis.__labBuffer.allocUnsafe(1 + len);
      buff[0] = 69;
      buff.writeInt32BE(len, 1);
      buff.write(portal, 5, "utf-8");
      buff[portalLength + 5] = 0;
      buff.writeUInt32BE(rows, buff.length - 4);
      return buff;
    }, "execute");
    var cancel = /* @__PURE__ */ __name((processID, secretKey) => {
      const buffer = globalThis.__labBuffer.allocUnsafe(16);
      buffer.writeInt32BE(16, 0);
      buffer.writeInt16BE(1234, 4);
      buffer.writeInt16BE(5678, 6);
      buffer.writeInt32BE(processID, 8);
      buffer.writeInt32BE(secretKey, 12);
      return buffer;
    }, "cancel");
    var cstringMessage = /* @__PURE__ */ __name((code, string) => {
      const stringLen = globalThis.__labBuffer.byteLength(string);
      const len = 4 + stringLen + 1;
      const buffer = globalThis.__labBuffer.allocUnsafe(1 + len);
      buffer[0] = code;
      buffer.writeInt32BE(len, 1);
      buffer.write(string, 5, "utf-8");
      buffer[len] = 0;
      return buffer;
    }, "cstringMessage");
    var emptyDescribePortal = writer.addCString("P").flush(
      68
      /* code.describe */
    );
    var emptyDescribeStatement = writer.addCString("S").flush(
      68
      /* code.describe */
    );
    var describe = /* @__PURE__ */ __name((msg2) => {
      return msg2.name ? cstringMessage(68, `${msg2.type}${msg2.name || ""}`) : msg2.type === "P" ? emptyDescribePortal : emptyDescribeStatement;
    }, "describe");
    var close = /* @__PURE__ */ __name((msg2) => {
      const text = `${msg2.type}${msg2.name || ""}`;
      return cstringMessage(67, text);
    }, "close");
    var copyData = /* @__PURE__ */ __name((chunk) => {
      return writer.add(chunk).flush(
        100
        /* code.copyFromChunk */
      );
    }, "copyData");
    var copyFail = /* @__PURE__ */ __name((message) => {
      return cstringMessage(102, message);
    }, "copyFail");
    var codeOnlyBuffer = /* @__PURE__ */ __name((code) => globalThis.__labBuffer.from([code, 0, 0, 0, 4]), "codeOnlyBuffer");
    var flushBuffer = codeOnlyBuffer(
      72
      /* code.flush */
    );
    var syncBuffer = codeOnlyBuffer(
      83
      /* code.sync */
    );
    var endBuffer = codeOnlyBuffer(
      88
      /* code.end */
    );
    var copyDoneBuffer = codeOnlyBuffer(
      99
      /* code.copyDone */
    );
    var serialize = {
      startup,
      password,
      requestSsl,
      sendSASLInitialResponseMessage,
      sendSCRAMClientFinalMessage,
      query,
      parse: parse3,
      bind,
      execute,
      describe,
      close,
      flush: /* @__PURE__ */ __name(() => flushBuffer, "flush"),
      sync: /* @__PURE__ */ __name(() => syncBuffer, "sync"),
      end: /* @__PURE__ */ __name(() => endBuffer, "end"),
      copyData,
      copyDone: /* @__PURE__ */ __name(() => copyDoneBuffer, "copyDone"),
      copyFail,
      cancel
    };
    exports.serialize = serialize;
  }
});

// scripts/node-lab/node_modules/pg-protocol/dist/buffer-reader.js
var require_buffer_reader = __commonJS({
  "scripts/node-lab/node_modules/pg-protocol/dist/buffer-reader.js"(exports) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BufferReader = void 0;
    var BufferReader = class {
      static {
        __name(this, "BufferReader");
      }
      constructor(offset = 0) {
        this.offset = offset;
        this.buffer = globalThis.__labBuffer.allocUnsafe(0);
        this.encoding = "utf-8";
      }
      setBuffer(offset, buffer) {
        this.offset = offset;
        this.buffer = buffer;
      }
      int16() {
        const result = this.buffer.readInt16BE(this.offset);
        this.offset += 2;
        return result;
      }
      byte() {
        const result = this.buffer[this.offset];
        this.offset++;
        return result;
      }
      int32() {
        const result = this.buffer.readInt32BE(this.offset);
        this.offset += 4;
        return result;
      }
      uint32() {
        const result = this.buffer.readUInt32BE(this.offset);
        this.offset += 4;
        return result;
      }
      string(length) {
        const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
        this.offset += length;
        return result;
      }
      cstring() {
        const start = this.offset;
        let end = start;
        while (this.buffer[end++]) {
        }
        this.offset = end;
        return this.buffer.toString(this.encoding, start, end - 1);
      }
      bytes(length) {
        const result = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return result;
      }
    };
    exports.BufferReader = BufferReader;
  }
});

// scripts/node-lab/node_modules/pg-protocol/dist/parser.js
var require_parser = __commonJS({
  "scripts/node-lab/node_modules/pg-protocol/dist/parser.js"(exports) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parser = void 0;
    var messages_1 = require_messages();
    var buffer_reader_1 = require_buffer_reader();
    var CODE_LENGTH = 1;
    var LEN_LENGTH = 4;
    var HEADER_LENGTH = CODE_LENGTH + LEN_LENGTH;
    var LATEINIT_LENGTH = -1;
    var emptyBuffer = globalThis.__labBuffer.allocUnsafe(0);
    var Parser = class {
      static {
        __name(this, "Parser");
      }
      constructor(opts) {
        this.buffer = emptyBuffer;
        this.bufferLength = 0;
        this.bufferOffset = 0;
        this.reader = new buffer_reader_1.BufferReader();
        if ((opts === null || opts === void 0 ? void 0 : opts.mode) === "binary") {
          throw new Error("Binary mode not supported yet");
        }
        this.mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || "text";
      }
      parse(buffer, callback) {
        this.mergeBuffer(buffer);
        const bufferFullLength = this.bufferOffset + this.bufferLength;
        let offset = this.bufferOffset;
        while (offset + HEADER_LENGTH <= bufferFullLength) {
          const code = this.buffer[offset];
          const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
          const fullMessageLength = CODE_LENGTH + length;
          if (fullMessageLength + offset <= bufferFullLength) {
            const message = this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer);
            callback(message);
            offset += fullMessageLength;
          } else {
            break;
          }
        }
        if (offset === bufferFullLength) {
          this.buffer = emptyBuffer;
          this.bufferLength = 0;
          this.bufferOffset = 0;
        } else {
          this.bufferLength = bufferFullLength - offset;
          this.bufferOffset = offset;
        }
      }
      mergeBuffer(buffer) {
        if (this.bufferLength > 0) {
          const newLength = this.bufferLength + buffer.byteLength;
          const newFullLength = newLength + this.bufferOffset;
          if (newFullLength > this.buffer.byteLength) {
            let newBuffer;
            if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) {
              newBuffer = this.buffer;
            } else {
              let newBufferLength = this.buffer.byteLength * 2;
              while (newLength >= newBufferLength) {
                newBufferLength *= 2;
              }
              newBuffer = globalThis.__labBuffer.allocUnsafe(newBufferLength);
            }
            this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
            this.buffer = newBuffer;
            this.bufferOffset = 0;
          }
          buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
          this.bufferLength = newLength;
        } else {
          this.buffer = buffer;
          this.bufferOffset = 0;
          this.bufferLength = buffer.byteLength;
        }
      }
      handlePacket(offset, code, length, bytes) {
        const { reader } = this;
        reader.setBuffer(offset, bytes);
        let message;
        switch (code) {
          case 50:
            message = messages_1.bindComplete;
            break;
          case 49:
            message = messages_1.parseComplete;
            break;
          case 51:
            message = messages_1.closeComplete;
            break;
          case 110:
            message = messages_1.noData;
            break;
          case 115:
            message = messages_1.portalSuspended;
            break;
          case 99:
            message = messages_1.copyDone;
            break;
          case 87:
            message = messages_1.replicationStart;
            break;
          case 73:
            message = messages_1.emptyQuery;
            break;
          case 68:
            message = parseDataRowMessage(reader);
            break;
          case 67:
            message = parseCommandCompleteMessage(reader);
            break;
          case 90:
            message = parseReadyForQueryMessage(reader);
            break;
          case 65:
            message = parseNotificationMessage(reader);
            break;
          case 82:
            message = parseAuthenticationResponse(reader, length);
            break;
          case 83:
            message = parseParameterStatusMessage(reader);
            break;
          case 75:
            message = parseBackendKeyData(reader);
            break;
          case 69:
            message = parseErrorMessage(reader, "error");
            break;
          case 78:
            message = parseErrorMessage(reader, "notice");
            break;
          case 84:
            message = parseRowDescriptionMessage(reader);
            break;
          case 116:
            message = parseParameterDescriptionMessage(reader);
            break;
          case 71:
            message = parseCopyInMessage(reader);
            break;
          case 72:
            message = parseCopyOutMessage(reader);
            break;
          case 100:
            message = parseCopyData(reader, length);
            break;
          default:
            return new messages_1.DatabaseError("received invalid response: " + code.toString(16), length, "error");
        }
        reader.setBuffer(0, emptyBuffer);
        message.length = length;
        return message;
      }
    };
    exports.Parser = Parser;
    var parseReadyForQueryMessage = /* @__PURE__ */ __name((reader) => {
      const status = reader.string(1);
      return new messages_1.ReadyForQueryMessage(LATEINIT_LENGTH, status);
    }, "parseReadyForQueryMessage");
    var parseCommandCompleteMessage = /* @__PURE__ */ __name((reader) => {
      const text = reader.cstring();
      return new messages_1.CommandCompleteMessage(LATEINIT_LENGTH, text);
    }, "parseCommandCompleteMessage");
    var parseCopyData = /* @__PURE__ */ __name((reader, length) => {
      const chunk = reader.bytes(length - 4);
      return new messages_1.CopyDataMessage(LATEINIT_LENGTH, chunk);
    }, "parseCopyData");
    var parseCopyInMessage = /* @__PURE__ */ __name((reader) => parseCopyMessage(reader, "copyInResponse"), "parseCopyInMessage");
    var parseCopyOutMessage = /* @__PURE__ */ __name((reader) => parseCopyMessage(reader, "copyOutResponse"), "parseCopyOutMessage");
    var parseCopyMessage = /* @__PURE__ */ __name((reader, messageName) => {
      const isBinary = reader.byte() !== 0;
      const columnCount = reader.int16();
      const message = new messages_1.CopyResponse(LATEINIT_LENGTH, messageName, isBinary, columnCount);
      for (let i2 = 0; i2 < columnCount; i2++) {
        message.columnTypes[i2] = reader.int16();
      }
      return message;
    }, "parseCopyMessage");
    var parseNotificationMessage = /* @__PURE__ */ __name((reader) => {
      const processId = reader.int32();
      const channel = reader.cstring();
      const payload = reader.cstring();
      return new messages_1.NotificationResponseMessage(LATEINIT_LENGTH, processId, channel, payload);
    }, "parseNotificationMessage");
    var parseRowDescriptionMessage = /* @__PURE__ */ __name((reader) => {
      const fieldCount = reader.int16();
      const message = new messages_1.RowDescriptionMessage(LATEINIT_LENGTH, fieldCount);
      for (let i2 = 0; i2 < fieldCount; i2++) {
        message.fields[i2] = parseField(reader);
      }
      return message;
    }, "parseRowDescriptionMessage");
    var parseField = /* @__PURE__ */ __name((reader) => {
      const name = reader.cstring();
      const tableID = reader.uint32();
      const columnID = reader.int16();
      const dataTypeID = reader.uint32();
      const dataTypeSize = reader.int16();
      const dataTypeModifier = reader.int32();
      const mode = reader.int16() === 0 ? "text" : "binary";
      return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
    }, "parseField");
    var parseParameterDescriptionMessage = /* @__PURE__ */ __name((reader) => {
      const parameterCount = reader.int16();
      const message = new messages_1.ParameterDescriptionMessage(LATEINIT_LENGTH, parameterCount);
      for (let i2 = 0; i2 < parameterCount; i2++) {
        message.dataTypeIDs[i2] = reader.uint32();
      }
      return message;
    }, "parseParameterDescriptionMessage");
    var parseDataRowMessage = /* @__PURE__ */ __name((reader) => {
      const fieldCount = reader.int16();
      const fields = new Array(fieldCount);
      for (let i2 = 0; i2 < fieldCount; i2++) {
        const len = reader.int32();
        fields[i2] = len === -1 ? null : reader.string(len);
      }
      return new messages_1.DataRowMessage(LATEINIT_LENGTH, fields);
    }, "parseDataRowMessage");
    var parseParameterStatusMessage = /* @__PURE__ */ __name((reader) => {
      const name = reader.cstring();
      const value = reader.cstring();
      return new messages_1.ParameterStatusMessage(LATEINIT_LENGTH, name, value);
    }, "parseParameterStatusMessage");
    var parseBackendKeyData = /* @__PURE__ */ __name((reader) => {
      const processID = reader.int32();
      const secretKey = reader.int32();
      return new messages_1.BackendKeyDataMessage(LATEINIT_LENGTH, processID, secretKey);
    }, "parseBackendKeyData");
    var parseAuthenticationResponse = /* @__PURE__ */ __name((reader, length) => {
      const code = reader.int32();
      const message = {
        name: "authenticationOk",
        length
      };
      switch (code) {
        case 0:
          break;
        case 3:
          if (message.length === 8) {
            message.name = "authenticationCleartextPassword";
          }
          break;
        case 5:
          if (message.length === 12) {
            message.name = "authenticationMD5Password";
            const salt = reader.bytes(4);
            return new messages_1.AuthenticationMD5Password(LATEINIT_LENGTH, salt);
          }
          break;
        case 10:
          {
            message.name = "authenticationSASL";
            message.mechanisms = [];
            let mechanism;
            do {
              mechanism = reader.cstring();
              if (mechanism) {
                message.mechanisms.push(mechanism);
              }
            } while (mechanism);
          }
          break;
        case 11:
          message.name = "authenticationSASLContinue";
          message.data = reader.string(length - 8);
          break;
        case 12:
          message.name = "authenticationSASLFinal";
          message.data = reader.string(length - 8);
          break;
        default:
          throw new Error("Unknown authenticationOk message type " + code);
      }
      return message;
    }, "parseAuthenticationResponse");
    var parseErrorMessage = /* @__PURE__ */ __name((reader, name) => {
      const fields = {};
      let fieldType = reader.string(1);
      while (fieldType !== "\0") {
        fields[fieldType] = reader.cstring();
        fieldType = reader.string(1);
      }
      const messageValue = fields.M;
      const message = name === "notice" ? new messages_1.NoticeMessage(LATEINIT_LENGTH, messageValue) : new messages_1.DatabaseError(messageValue, LATEINIT_LENGTH, name);
      message.severity = fields.S;
      message.code = fields.C;
      message.detail = fields.D;
      message.hint = fields.H;
      message.position = fields.P;
      message.internalPosition = fields.p;
      message.internalQuery = fields.q;
      message.where = fields.W;
      message.schema = fields.s;
      message.table = fields.t;
      message.column = fields.c;
      message.dataType = fields.d;
      message.constraint = fields.n;
      message.file = fields.F;
      message.line = fields.L;
      message.routine = fields.R;
      return message;
    }, "parseErrorMessage");
  }
});

// scripts/node-lab/node_modules/pg-protocol/dist/index.js
var require_dist = __commonJS({
  "scripts/node-lab/node_modules/pg-protocol/dist/index.js"(exports) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabaseError = exports.serialize = void 0;
    exports.parse = parse3;
    var messages_1 = require_messages();
    Object.defineProperty(exports, "DatabaseError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return messages_1.DatabaseError;
    }, "get") });
    var serializer_1 = require_serializer();
    Object.defineProperty(exports, "serialize", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return serializer_1.serialize;
    }, "get") });
    var parser_1 = require_parser();
    function parse3(stream, callback) {
      const parser = new parser_1.Parser();
      stream.on("data", (buffer) => parser.parse(buffer, callback));
      return new Promise((resolve3) => stream.on("end", () => resolve3()));
    }
    __name(parse3, "parse");
  }
});

// src/academy/node/runtime/builtin-net.js
var builtin_net_exports = {};
__export(builtin_net_exports, {
  Socket: () => Socket2,
  connect: () => connect,
  createConnection: () => createConnection,
  createServer: () => createServer2,
  default: () => builtin_net_default,
  isIP: () => isIP,
  isIPv4: () => isIPv42,
  isIPv6: () => isIPv62
});
var builtin_net_default, isIP, isIPv42, isIPv62, Socket2, createServer2, connect, createConnection;
var init_builtin_net = __esm({
  "src/academy/node/runtime/builtin-net.js"() {
    init_globals();
    init_builtins();
    builtin_net_default = net;
    ({ isIP, isIPv4: isIPv42, isIPv6: isIPv62, Socket: Socket2, createServer: createServer2, connect, createConnection } = net);
  }
});

// src/academy/node/runtime/gen/net.cjs
var require_net = __commonJS({
  "src/academy/node/runtime/gen/net.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_net(), __toCommonJS(builtin_net_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/gen/tls.cjs
var require_tls = __commonJS({
  "src/academy/node/runtime/gen/tls.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_net(), __toCommonJS(builtin_net_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// empty:pg-cloudflare
var require_pg_cloudflare = __commonJS({
  "empty:pg-cloudflare"(exports, module) {
    init_globals();
    module.exports = {};
  }
});

// scripts/node-lab/node_modules/pg/lib/stream.js
var require_stream = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/stream.js"(exports, module) {
    init_globals();
    var { getStream, getSecureStream } = getStreamFuncs();
    module.exports = {
      /**
       * Get a socket stream compatible with the current runtime environment.
       * @returns {Duplex}
       */
      getStream,
      /**
       * Get a TLS secured socket, compatible with the current environment,
       * using the socket and other settings given in `options`.
       * @returns {Duplex}
       */
      getSecureStream
    };
    function getNodejsStreamFuncs() {
      function getStream2(ssl) {
        const net2 = require_net();
        return new net2.Socket();
      }
      __name(getStream2, "getStream");
      function getSecureStream2(options) {
        const tls = require_tls();
        return tls.connect(options);
      }
      __name(getSecureStream2, "getSecureStream");
      return {
        getStream: getStream2,
        getSecureStream: getSecureStream2
      };
    }
    __name(getNodejsStreamFuncs, "getNodejsStreamFuncs");
    function getCloudflareStreamFuncs() {
      function getStream2(ssl) {
        const { CloudflareSocket } = require_pg_cloudflare();
        return new CloudflareSocket(ssl);
      }
      __name(getStream2, "getStream");
      function getSecureStream2(options) {
        options.socket.startTls(options);
        return options.socket;
      }
      __name(getSecureStream2, "getSecureStream");
      return {
        getStream: getStream2,
        getSecureStream: getSecureStream2
      };
    }
    __name(getCloudflareStreamFuncs, "getCloudflareStreamFuncs");
    function isCloudflareRuntime() {
      if (typeof navigator === "object" && navigator !== null && typeof navigator.userAgent === "string") {
        return navigator.userAgent === "Cloudflare-Workers";
      }
      if (typeof Response === "function") {
        const resp = new Response(null, { cf: { thing: true } });
        if (typeof resp.cf === "object" && resp.cf !== null && resp.cf.thing) {
          return true;
        }
      }
      return false;
    }
    __name(isCloudflareRuntime, "isCloudflareRuntime");
    function getStreamFuncs() {
      if (isCloudflareRuntime()) {
        return getCloudflareStreamFuncs();
      }
      return getNodejsStreamFuncs();
    }
    __name(getStreamFuncs, "getStreamFuncs");
  }
});

// scripts/node-lab/node_modules/pg/lib/connection.js
var require_connection = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/connection.js"(exports, module) {
    "use strict";
    init_globals();
    var EventEmitter = require_events().EventEmitter;
    var { parse: parse3, serialize } = require_dist();
    var stream = require_stream();
    var { getStream } = stream;
    var flushBuffer = serialize.flush();
    var syncBuffer = serialize.sync();
    var endBuffer = serialize.end();
    var Connection2 = class extends EventEmitter {
      static {
        __name(this, "Connection");
      }
      constructor(config) {
        super();
        config = config || {};
        this.stream = config.stream || getStream(config.ssl);
        if (typeof this.stream === "function") {
          this.stream = this.stream(config);
        }
        this._keepAlive = config.keepAlive;
        this._keepAliveInitialDelayMillis = config.keepAliveInitialDelayMillis;
        this.parsedStatements = {};
        this.submittedNamedStatements = {};
        this.ssl = config.ssl || false;
        this.sslNegotiation = config.sslNegotiation || "postgres";
        this._ending = false;
        this._emitMessage = false;
        const self = this;
        this.on("newListener", function(eventName) {
          if (eventName === "message") {
            self._emitMessage = true;
          }
        });
      }
      connect(port, host) {
        const self = this;
        this._connecting = true;
        this.stream.setNoDelay(true);
        this.stream.connect(port, host);
        this.stream.once("connect", function() {
          if (self._keepAlive) {
            self.stream.setKeepAlive(true, self._keepAliveInitialDelayMillis);
          }
          self.emit("connect");
        });
        const reportStreamError = /* @__PURE__ */ __name(function(error) {
          if (self._ending && (error.code === "ECONNRESET" || error.code === "EPIPE")) {
            return;
          }
          self.emit("error", error);
        }, "reportStreamError");
        this.stream.on("error", reportStreamError);
        this.stream.on("close", function() {
          self.emit("end");
        });
        if (!this.ssl) {
          return this.attachListeners(this.stream);
        }
        if (this.sslNegotiation === "direct") {
          return this.stream.once("connect", function() {
            self.upgradeToSSL(host, reportStreamError);
          });
        }
        this.stream.once("data", function(buffer) {
          const responseCode = buffer.toString("utf8");
          switch (responseCode) {
            case "S":
              break;
            case "N":
              self.stream.end();
              return self.emit("error", new Error("The server does not support SSL connections"));
            default:
              self.stream.end();
              return self.emit("error", new Error("There was an error establishing an SSL connection"));
          }
          self.upgradeToSSL(host, reportStreamError);
        });
      }
      upgradeToSSL(host, reportStreamError) {
        const self = this;
        const options = {
          socket: self.stream,
          // tls.connect checks the server identity against `servername`, falling
          // back to `host` and then to 'localhost'. `servername` must stay unset
          // for IP addresses (see below), so `host` is needed to keep certificate
          // validation working when connecting to an IP address.
          host
        };
        if (self.ssl !== true) {
          Object.assign(options, self.ssl);
          if ("key" in self.ssl) {
            options.key = self.ssl.key;
          }
        }
        if (self.sslNegotiation === "direct") {
          options.ALPNProtocols = ["postgresql"];
        }
        const net2 = require_net();
        if (net2.isIP && net2.isIP(host) === 0) {
          options.servername = host;
        }
        try {
          self.stream = stream.getSecureStream(options);
        } catch (err2) {
          return self.emit("error", err2);
        }
        self.attachListeners(self.stream);
        self.stream.on("error", reportStreamError);
        self.emit("sslconnect");
      }
      attachListeners(stream2) {
        parse3(stream2, (msg2) => {
          const eventName = msg2.name === "error" ? "errorMessage" : msg2.name;
          if (this._emitMessage) {
            this.emit("message", msg2);
          }
          this.emit(eventName, msg2);
        });
      }
      requestSsl() {
        this.stream.write(serialize.requestSsl());
      }
      startup(config) {
        this.stream.write(serialize.startup(config));
      }
      cancel(processID, secretKey) {
        this._send(serialize.cancel(processID, secretKey));
      }
      password(password) {
        this._send(serialize.password(password));
      }
      sendSASLInitialResponseMessage(mechanism, initialResponse) {
        this._send(serialize.sendSASLInitialResponseMessage(mechanism, initialResponse));
      }
      sendSCRAMClientFinalMessage(additionalData) {
        this._send(serialize.sendSCRAMClientFinalMessage(additionalData));
      }
      _send(buffer) {
        if (!this.stream.writable) {
          return false;
        }
        return this.stream.write(buffer);
      }
      query(text) {
        this._send(serialize.query(text));
      }
      // send parse message
      parse(query) {
        this._send(serialize.parse(query));
      }
      // send bind message
      bind(config) {
        this._send(serialize.bind(config));
      }
      // send execute message
      execute(config) {
        this._send(serialize.execute(config));
      }
      flush() {
        if (this.stream.writable) {
          this.stream.write(flushBuffer);
        }
      }
      sync() {
        this._send(syncBuffer);
      }
      ref() {
        this.stream.ref();
      }
      unref() {
        this.stream.unref();
      }
      end() {
        this._ending = true;
        if (!this._connecting || !this.stream.writable) {
          this.stream.end();
          return;
        }
        return this.stream.write(endBuffer, () => {
          this.stream.end();
        });
      }
      close(msg2) {
        this._send(serialize.close(msg2));
      }
      describe(msg2) {
        this._send(serialize.describe(msg2));
      }
      sendCopyFromChunk(chunk) {
        this._send(serialize.copyData(chunk));
      }
      endCopyFrom() {
        this._send(serialize.copyDone());
      }
      sendCopyFail(msg2) {
        this._send(serialize.copyFail(msg2));
      }
    };
    module.exports = Connection2;
  }
});

// src/academy/node/runtime/gen/path.cjs
var require_path = __commonJS({
  "src/academy/node/runtime/gen/path.cjs"(exports, module) {
    init_globals();
    var m = (init_path(), __toCommonJS(path_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/gen/stream.cjs
var require_stream2 = __commonJS({
  "src/academy/node/runtime/gen/stream.cjs"(exports, module) {
    init_globals();
    var m = (init_stream(), __toCommonJS(stream_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/split2/index.js
var require_split2 = __commonJS({
  "scripts/node-lab/node_modules/split2/index.js"(exports, module) {
    "use strict";
    init_globals();
    var { Transform: Transform2 } = require_stream2();
    var { StringDecoder } = require_string_decoder();
    var kLast = /* @__PURE__ */ Symbol("last");
    var kDecoder = /* @__PURE__ */ Symbol("decoder");
    function transform(chunk, enc, cb) {
      let list;
      if (this.overflow) {
        const buf = this[kDecoder].write(chunk);
        list = buf.split(this.matcher);
        if (list.length === 1) return cb();
        list.shift();
        this.overflow = false;
      } else {
        this[kLast] += this[kDecoder].write(chunk);
        list = this[kLast].split(this.matcher);
      }
      this[kLast] = list.pop();
      for (let i2 = 0; i2 < list.length; i2++) {
        try {
          push(this, this.mapper(list[i2]));
        } catch (error) {
          return cb(error);
        }
      }
      this.overflow = this[kLast].length > this.maxLength;
      if (this.overflow && !this.skipOverflow) {
        cb(new Error("maximum buffer reached"));
        return;
      }
      cb();
    }
    __name(transform, "transform");
    function flush(cb) {
      this[kLast] += this[kDecoder].end();
      if (this[kLast]) {
        try {
          push(this, this.mapper(this[kLast]));
        } catch (error) {
          return cb(error);
        }
      }
      cb();
    }
    __name(flush, "flush");
    function push(self, val) {
      if (val !== void 0) {
        self.push(val);
      }
    }
    __name(push, "push");
    function noop(incoming) {
      return incoming;
    }
    __name(noop, "noop");
    function split(matcher, mapper, options) {
      matcher = matcher || /\r?\n/;
      mapper = mapper || noop;
      options = options || {};
      switch (arguments.length) {
        case 1:
          if (typeof matcher === "function") {
            mapper = matcher;
            matcher = /\r?\n/;
          } else if (typeof matcher === "object" && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
            options = matcher;
            matcher = /\r?\n/;
          }
          break;
        case 2:
          if (typeof matcher === "function") {
            options = mapper;
            mapper = matcher;
            matcher = /\r?\n/;
          } else if (typeof mapper === "object") {
            options = mapper;
            mapper = noop;
          }
      }
      options = Object.assign({}, options);
      options.autoDestroy = true;
      options.transform = transform;
      options.flush = flush;
      options.readableObjectMode = true;
      const stream = new Transform2(options);
      stream[kLast] = "";
      stream[kDecoder] = new StringDecoder("utf8");
      stream.matcher = matcher;
      stream.mapper = mapper;
      stream.maxLength = options.maxLength;
      stream.skipOverflow = options.skipOverflow || false;
      stream.overflow = false;
      stream._destroy = function(err2, cb) {
        this._writableState.errorEmitted = false;
        cb(err2);
      };
      return stream;
    }
    __name(split, "split");
    module.exports = split;
  }
});

// scripts/node-lab/node_modules/pgpass/lib/helper.js
var require_helper = __commonJS({
  "scripts/node-lab/node_modules/pgpass/lib/helper.js"(exports, module) {
    "use strict";
    init_globals();
    var path = require_path();
    var Stream2 = require_stream2().Stream;
    var split = require_split2();
    var util = require_util();
    var defaultPort = 5432;
    var isWin = process.platform === "win32";
    var warnStream = process.stderr;
    var S_IRWXG = 56;
    var S_IRWXO = 7;
    var S_IFMT = 61440;
    var S_IFREG = 32768;
    function isRegFile(mode) {
      return (mode & S_IFMT) == S_IFREG;
    }
    __name(isRegFile, "isRegFile");
    var fieldNames = ["host", "port", "database", "user", "password"];
    var nrOfFields = fieldNames.length;
    var passKey = fieldNames[nrOfFields - 1];
    function warn() {
      var isWritable = warnStream instanceof Stream2 && true === warnStream.writable;
      if (isWritable) {
        var args = Array.prototype.slice.call(arguments).concat("\n");
        warnStream.write(util.format.apply(util, args));
      }
    }
    __name(warn, "warn");
    Object.defineProperty(module.exports, "isWin", {
      get: /* @__PURE__ */ __name(function() {
        return isWin;
      }, "get"),
      set: /* @__PURE__ */ __name(function(val) {
        isWin = val;
      }, "set")
    });
    module.exports.warnTo = function(stream) {
      var old = warnStream;
      warnStream = stream;
      return old;
    };
    module.exports.getFileName = function(rawEnv) {
      var env = rawEnv || process.env;
      var file = env.PGPASSFILE || (isWin ? path.join(env.APPDATA || "./", "postgresql", "pgpass.conf") : path.join(env.HOME || "./", ".pgpass"));
      return file;
    };
    module.exports.usePgPass = function(stats, fname) {
      if (Object.prototype.hasOwnProperty.call(process.env, "PGPASSWORD")) {
        return false;
      }
      if (isWin) {
        return true;
      }
      fname = fname || "<unkn>";
      if (!isRegFile(stats.mode)) {
        warn('WARNING: password file "%s" is not a plain file', fname);
        return false;
      }
      if (stats.mode & (S_IRWXG | S_IRWXO)) {
        warn('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', fname);
        return false;
      }
      return true;
    };
    var matcher = module.exports.match = function(connInfo, entry) {
      return fieldNames.slice(0, -1).reduce(function(prev, field, idx) {
        if (idx == 1) {
          if (Number(connInfo[field] || defaultPort) === Number(entry[field])) {
            return prev && true;
          }
        }
        return prev && (entry[field] === "*" || entry[field] === connInfo[field]);
      }, true);
    };
    module.exports.getPassword = function(connInfo, stream, cb) {
      var pass;
      var lineStream = stream.pipe(split());
      function onLine(line) {
        var entry = parseLine(line);
        if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
          pass = entry[passKey];
          lineStream.end();
        }
      }
      __name(onLine, "onLine");
      var onEnd = /* @__PURE__ */ __name(function() {
        stream.destroy();
        cb(pass);
      }, "onEnd");
      var onErr = /* @__PURE__ */ __name(function(err2) {
        stream.destroy();
        warn("WARNING: error on reading file: %s", err2);
        cb(void 0);
      }, "onErr");
      stream.on("error", onErr);
      lineStream.on("data", onLine).on("end", onEnd).on("error", onErr);
    };
    var parseLine = module.exports.parseLine = function(line) {
      if (line.length < 11 || line.match(/^\s+#/)) {
        return null;
      }
      var curChar = "";
      var prevChar = "";
      var fieldIdx = 0;
      var startIdx = 0;
      var endIdx = 0;
      var obj = {};
      var isLastField = false;
      var addToObj = /* @__PURE__ */ __name(function(idx, i0, i1) {
        var field = line.substring(i0, i1);
        if (!Object.hasOwnProperty.call(process.env, "PGPASS_NO_DEESCAPE")) {
          field = field.replace(/\\([:\\])/g, "$1");
        }
        obj[fieldNames[idx]] = field;
      }, "addToObj");
      for (var i2 = 0; i2 < line.length - 1; i2 += 1) {
        curChar = line.charAt(i2 + 1);
        prevChar = line.charAt(i2);
        isLastField = fieldIdx == nrOfFields - 1;
        if (isLastField) {
          addToObj(fieldIdx, startIdx);
          break;
        }
        if (i2 >= 0 && curChar == ":" && prevChar !== "\\") {
          addToObj(fieldIdx, startIdx, i2 + 1);
          startIdx = i2 + 2;
          fieldIdx += 1;
        }
      }
      obj = Object.keys(obj).length === nrOfFields ? obj : null;
      return obj;
    };
    var isValidEntry = module.exports.isValidEntry = function(entry) {
      var rules = {
        // host
        0: function(x2) {
          return x2.length > 0;
        },
        // port
        1: function(x2) {
          if (x2 === "*") {
            return true;
          }
          x2 = Number(x2);
          return isFinite(x2) && x2 > 0 && x2 < 9007199254740992 && Math.floor(x2) === x2;
        },
        // database
        2: function(x2) {
          return x2.length > 0;
        },
        // username
        3: function(x2) {
          return x2.length > 0;
        },
        // password
        4: function(x2) {
          return x2.length > 0;
        }
      };
      for (var idx = 0; idx < fieldNames.length; idx += 1) {
        var rule = rules[idx];
        var value = entry[fieldNames[idx]] || "";
        var res = rule(value);
        if (!res) {
          return false;
        }
      }
      return true;
    };
  }
});

// scripts/node-lab/node_modules/pgpass/lib/index.js
var require_lib2 = __commonJS({
  "scripts/node-lab/node_modules/pgpass/lib/index.js"(exports, module) {
    "use strict";
    init_globals();
    var path = require_path();
    var fs = require_fs();
    var helper = require_helper();
    module.exports = function(connInfo, cb) {
      var file = helper.getFileName();
      fs.stat(file, function(err2, stat) {
        if (err2 || !helper.usePgPass(stat, file)) {
          return cb(void 0);
        }
        var st = fs.createReadStream(file);
        helper.getPassword(connInfo, st, cb);
      });
    };
    module.exports.warnTo = helper.warnTo;
  }
});

// scripts/node-lab/node_modules/pg/lib/client.js
var require_client = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/client.js"(exports, module) {
    init_globals();
    var EventEmitter = require_events().EventEmitter;
    var utils = require_utils2();
    var nodeUtils = require_util();
    var sasl = require_sasl();
    var TypeOverrides2 = require_type_overrides();
    var ConnectionParameters = require_connection_parameters();
    var Query2 = require_query();
    var defaults2 = require_defaults();
    var Connection2 = require_connection();
    var crypto = require_utils3();
    var activeQueryDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "Client.activeQuery is deprecated and will be removed in pg@9.0"
    );
    var queryQueueDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "Client.queryQueue is deprecated and will be removed in pg@9.0."
    );
    var pgPassDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "pgpass support is deprecated and will be removed in pg@9.0. You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code."
    );
    var byoPromiseDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0."
    );
    var queryQueueLengthDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead."
    );
    function coerceNumberOrDefault(value, defaultValue) {
      if (typeof value === "number") {
        return Number.isFinite(value) ? value : defaultValue;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        return Number.isFinite(n) ? n : defaultValue;
      }
      return defaultValue;
    }
    __name(coerceNumberOrDefault, "coerceNumberOrDefault");
    var Client3 = class extends EventEmitter {
      static {
        __name(this, "Client");
      }
      constructor(config) {
        super();
        this.connectionParameters = new ConnectionParameters(config);
        this.user = this.connectionParameters.user;
        this.database = this.connectionParameters.database;
        this.port = this.connectionParameters.port;
        this.host = this.connectionParameters.host;
        Object.defineProperty(this, "password", {
          configurable: true,
          enumerable: false,
          writable: true,
          value: this.connectionParameters.password
        });
        this.replication = this.connectionParameters.replication;
        const c = config || {};
        if (c.Promise) {
          byoPromiseDeprecationNotice();
        }
        this._Promise = c.Promise || globalThis.Promise;
        this._types = new TypeOverrides2(c.types);
        this._ending = false;
        this._ended = false;
        this._connecting = false;
        this._connected = false;
        this._connectionError = false;
        this._queryable = true;
        this._activeQuery = null;
        this._txStatus = null;
        this.enableChannelBinding = Boolean(c.enableChannelBinding);
        this.scramMaxIterations = coerceNumberOrDefault(c.scramMaxIterations, sasl.DEFAULT_MAX_SCRAM_ITERATIONS);
        this.connection = c.connection || new Connection2({
          stream: c.stream,
          ssl: this.connectionParameters.ssl,
          sslNegotiation: this.connectionParameters.sslnegotiation,
          keepAlive: c.keepAlive || false,
          keepAliveInitialDelayMillis: c.keepAliveInitialDelayMillis || 0,
          encoding: this.connectionParameters.client_encoding || "utf8"
        });
        this._queryQueue = [];
        this._sentQueryQueue = [];
        this.pipeline = Boolean(c.pipeline);
        this.binary = c.binary || defaults2.binary;
        this.processID = null;
        this.secretKey = null;
        this.ssl = this.connectionParameters.ssl || false;
        this.sslNegotiation = this.connectionParameters.sslnegotiation || "postgres";
        if (this.ssl && this.ssl.key) {
          Object.defineProperty(this.ssl, "key", {
            enumerable: false
          });
        }
        this._connectionTimeoutMillis = c.connectionTimeoutMillis || 0;
      }
      get activeQuery() {
        activeQueryDeprecationNotice();
        return this._activeQuery;
      }
      set activeQuery(val) {
        activeQueryDeprecationNotice();
        this._activeQuery = val;
      }
      _getActiveQuery() {
        return this._activeQuery;
      }
      _errorAllQueries(err2) {
        const enqueueError = /* @__PURE__ */ __name((query) => {
          process.nextTick(() => {
            query.handleError(err2, this.connection);
          });
        }, "enqueueError");
        const activeQuery = this._getActiveQuery();
        if (activeQuery) {
          enqueueError(activeQuery);
          this._activeQuery = null;
        }
        this._sentQueryQueue.forEach(enqueueError);
        this._sentQueryQueue.length = 0;
        this._queryQueue.forEach(enqueueError);
        this._queryQueue.length = 0;
      }
      _connect(callback) {
        const self = this;
        const con = this.connection;
        this._connectionCallback = callback;
        if (this._connecting || this._connected) {
          const err2 = new Error("Client has already been connected. You cannot reuse a client.");
          process.nextTick(() => {
            callback(err2);
          });
          return;
        }
        this._connecting = true;
        if (this._connectionTimeoutMillis > 0) {
          this.connectionTimeoutHandle = setTimeout(() => {
            con._ending = true;
            con.stream.destroy(new Error("timeout expired"));
          }, this._connectionTimeoutMillis);
          if (this.connectionTimeoutHandle.unref) {
            this.connectionTimeoutHandle.unref();
          }
        }
        if (this.host && this.host.indexOf("/") === 0) {
          con.connect(this.host + "/.s.PGSQL." + this.port);
        } else {
          con.connect(this.port, this.host);
        }
        con.on("connect", function() {
          if (self.ssl) {
            if (self.sslNegotiation !== "direct") {
              con.requestSsl();
            }
          } else {
            con.startup(self.getStartupConf());
          }
        });
        con.on("sslconnect", function() {
          con.startup(self.getStartupConf());
        });
        this._attachListeners(con);
        con.once("end", () => {
          const error = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
          clearTimeout(this.connectionTimeoutHandle);
          this._errorAllQueries(error);
          this._ended = true;
          if (!this._ending) {
            if (this._connecting && !this._connectionError) {
              if (this._connectionCallback) {
                this._connectionCallback(error);
              } else {
                this._handleErrorEvent(error);
              }
            } else if (!this._connectionError) {
              this._handleErrorEvent(error);
            }
          }
          process.nextTick(() => {
            this.emit("end");
          });
        });
      }
      connect(callback) {
        if (callback) {
          this._connect(callback);
          return;
        }
        return new this._Promise((resolve3, reject) => {
          this._connect((error) => {
            if (error) {
              reject(error);
            } else {
              resolve3(this);
            }
          });
        });
      }
      _attachListeners(con) {
        con.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this));
        con.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this));
        con.on("authenticationSASL", this._handleAuthSASL.bind(this));
        con.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this));
        con.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this));
        con.on("backendKeyData", this._handleBackendKeyData.bind(this));
        con.on("error", this._handleErrorEvent.bind(this));
        con.on("errorMessage", this._handleErrorMessage.bind(this));
        con.on("readyForQuery", this._handleReadyForQuery.bind(this));
        con.on("notice", this._handleNotice.bind(this));
        con.on("rowDescription", this._handleRowDescription.bind(this));
        con.on("dataRow", this._handleDataRow.bind(this));
        con.on("portalSuspended", this._handlePortalSuspended.bind(this));
        con.on("emptyQuery", this._handleEmptyQuery.bind(this));
        con.on("commandComplete", this._handleCommandComplete.bind(this));
        con.on("parseComplete", this._handleParseComplete.bind(this));
        con.on("copyInResponse", this._handleCopyInResponse.bind(this));
        con.on("copyData", this._handleCopyData.bind(this));
        con.on("notification", this._handleNotification.bind(this));
      }
      _getPassword(cb) {
        const con = this.connection;
        if (typeof this.password === "function") {
          this._Promise.resolve().then(() => this.password(this.connectionParameters)).then((pass) => {
            if (pass !== void 0) {
              if (typeof pass !== "string") {
                con.emit("error", new TypeError("Password must be a string"));
                return;
              }
              this.connectionParameters.password = this.password = pass;
            } else {
              this.connectionParameters.password = this.password = null;
            }
            cb();
          }).catch((err2) => {
            con.emit("error", err2);
          });
        } else if (this.password !== null) {
          cb();
        } else {
          try {
            const pgPass = require_lib2();
            pgPass(this.connectionParameters, (pass) => {
              if (void 0 !== pass) {
                pgPassDeprecationNotice();
                this.connectionParameters.password = this.password = pass;
              }
              cb();
            });
          } catch (e) {
            this.emit("error", e);
          }
        }
      }
      _handleAuthCleartextPassword(msg2) {
        this._getPassword(() => {
          this.connection.password(this.password);
        });
      }
      _handleAuthMD5Password(msg2) {
        this._getPassword(async () => {
          try {
            const hashedPassword = await crypto.postgresMd5PasswordHash(this.user, this.password, msg2.salt);
            this.connection.password(hashedPassword);
          } catch (e) {
            this.emit("error", e);
          }
        });
      }
      _handleAuthSASL(msg2) {
        this._getPassword(() => {
          try {
            this.saslSession = sasl.startSession(
              msg2.mechanisms,
              this.enableChannelBinding && this.connection.stream,
              this.scramMaxIterations
            );
            this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
          } catch (err2) {
            this.connection.emit("error", err2);
          }
        });
      }
      async _handleAuthSASLContinue(msg2) {
        try {
          await sasl.continueSession(
            this.saslSession,
            this.password,
            msg2.data,
            this.enableChannelBinding && this.connection.stream
          );
          this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
        } catch (err2) {
          this.connection.emit("error", err2);
        }
      }
      _handleAuthSASLFinal(msg2) {
        try {
          sasl.finalizeSession(this.saslSession, msg2.data);
          this.saslSession = null;
        } catch (err2) {
          this.connection.emit("error", err2);
        }
      }
      _handleBackendKeyData(msg2) {
        this.processID = msg2.processID;
        this.secretKey = msg2.secretKey;
      }
      _handleReadyForQuery(msg2) {
        if (this._connecting) {
          this._connecting = false;
          this._connected = true;
          clearTimeout(this.connectionTimeoutHandle);
          if (this._connectionCallback) {
            this._connectionCallback(null, this);
            this._connectionCallback = null;
          }
          this.emit("connect");
        }
        const activeQuery = this._getActiveQuery();
        this._activeQuery = null;
        this._txStatus = msg2?.status ?? null;
        this.readyForQuery = true;
        if (activeQuery) {
          activeQuery.handleReadyForQuery(this.connection);
        }
        this._pulseQueryQueue();
      }
      // if we receive an error event or error message
      // during the connection process we handle it here
      _handleErrorWhileConnecting(err2) {
        if (this._connectionError) {
          return;
        }
        this._connectionError = true;
        clearTimeout(this.connectionTimeoutHandle);
        if (this._connectionCallback) {
          return this._connectionCallback(err2);
        }
        this.emit("error", err2);
      }
      // if we're connected and we receive an error event from the connection
      // this means the socket is dead - do a hard abort of all queries and emit
      // the socket error on the client as well
      _handleErrorEvent(err2) {
        if (this._connecting) {
          return this._handleErrorWhileConnecting(err2);
        }
        this._queryable = false;
        this._errorAllQueries(err2);
        this.emit("error", err2);
      }
      // handle error messages from the postgres backend
      _handleErrorMessage(msg2) {
        if (this._connecting) {
          return this._handleErrorWhileConnecting(msg2);
        }
        const activeQuery = this._getActiveQuery();
        if (!activeQuery) {
          this._handleErrorEvent(msg2);
          return;
        }
        this._activeQuery = null;
        if (activeQuery.name) {
          delete this.connection.submittedNamedStatements[activeQuery.name];
        }
        activeQuery.handleError(msg2, this.connection);
      }
      _handleRowDescription(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected rowDescription message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handleRowDescription(msg2);
      }
      _handleDataRow(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected dataRow message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handleDataRow(msg2);
      }
      _handlePortalSuspended(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected portalSuspended message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handlePortalSuspended(this.connection);
      }
      _handleEmptyQuery(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected emptyQuery message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handleEmptyQuery(this.connection);
      }
      _handleCommandComplete(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected commandComplete message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handleCommandComplete(msg2, this.connection);
      }
      _handleParseComplete() {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected parseComplete message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        if (activeQuery.name) {
          this.connection.parsedStatements[activeQuery.name] = activeQuery.text;
          delete this.connection.submittedNamedStatements[activeQuery.name];
        }
      }
      _handleCopyInResponse(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected copyInResponse message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handleCopyInResponse(this.connection);
      }
      _handleCopyData(msg2) {
        const activeQuery = this._getActiveQuery();
        if (activeQuery == null) {
          const error = new Error("Received unexpected copyData message from backend.");
          this._handleErrorEvent(error);
          return;
        }
        activeQuery.handleCopyData(msg2, this.connection);
      }
      _handleNotification(msg2) {
        this.emit("notification", msg2);
      }
      _handleNotice(msg2) {
        this.emit("notice", msg2);
      }
      getStartupConf() {
        const params = this.connectionParameters;
        const data = {
          user: params.user,
          database: params.database
        };
        const appName = params.application_name || params.fallback_application_name;
        if (appName) {
          data.application_name = appName;
        }
        if (params.replication) {
          data.replication = "" + params.replication;
        }
        if (params.statement_timeout) {
          data.statement_timeout = String(parseInt(params.statement_timeout, 10));
        }
        if (params.lock_timeout) {
          data.lock_timeout = String(parseInt(params.lock_timeout, 10));
        }
        if (params.idle_in_transaction_session_timeout) {
          data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10));
        }
        if (params.options) {
          data.options = params.options;
        }
        return data;
      }
      cancel(client, query) {
        if (client.activeQuery === query) {
          const con = this.connection;
          if (this.host && this.host.indexOf("/") === 0) {
            con.connect(this.host + "/.s.PGSQL." + this.port);
          } else {
            con.connect(this.port, this.host);
          }
          con.on("connect", function() {
            con.cancel(client.processID, client.secretKey);
          });
        } else if (client._queryQueue.indexOf(query) !== -1) {
          client._queryQueue.splice(client._queryQueue.indexOf(query), 1);
        } else if (client._sentQueryQueue.indexOf(query) !== -1) {
          query.callback = () => {
          };
        }
      }
      setTypeParser(oid, format4, parseFn) {
        return this._types.setTypeParser(oid, format4, parseFn);
      }
      getTypeParser(oid, format4) {
        return this._types.getTypeParser(oid, format4);
      }
      // escapeIdentifier and escapeLiteral moved to utility functions & exported
      // on PG
      // re-exported here for backwards compatibility
      escapeIdentifier(str) {
        return utils.escapeIdentifier(str);
      }
      escapeLiteral(str) {
        return utils.escapeLiteral(str);
      }
      _pulseQueryQueue() {
        if (this.pipeline) {
          this._pulsePipelinedQueryQueue();
          return;
        }
        if (this.readyForQuery === true) {
          this._activeQuery = this._queryQueue.shift();
          const activeQuery = this._getActiveQuery();
          if (activeQuery) {
            this.readyForQuery = false;
            this.hasExecuted = true;
            const queryError = activeQuery.submit(this.connection);
            if (queryError) {
              process.nextTick(() => {
                activeQuery.handleError(queryError, this.connection);
                this.readyForQuery = true;
                this._pulseQueryQueue();
              });
            }
          } else if (this.hasExecuted) {
            this._activeQuery = null;
            this.emit("drain");
          }
        }
      }
      _pulsePipelinedQueryQueue() {
        if (!this._connected || !this._queryable) {
          return;
        }
        while (this._queryQueue.length > 0) {
          const query = this._queryQueue.shift();
          this.hasExecuted = true;
          const queryError = query.submit(this.connection);
          if (queryError) {
            process.nextTick(() => {
              query.handleError(queryError, this.connection);
            });
            continue;
          }
          this._sentQueryQueue.push(query);
        }
        if (this.readyForQuery && !this._activeQuery && this._sentQueryQueue.length > 0) {
          this._activeQuery = this._sentQueryQueue.shift();
          this.readyForQuery = false;
        }
        if (!this._activeQuery && this._sentQueryQueue.length === 0 && this._queryQueue.length === 0 && this.hasExecuted) {
          this.emit("drain");
        }
      }
      query(config, values, callback) {
        let query;
        let result;
        if (config == null) {
          throw new TypeError("Client was passed a null or undefined query");
        }
        if (typeof config.submit === "function") {
          result = query = config;
          if (!query.callback) {
            if (typeof values === "function") {
              query.callback = values;
            } else if (callback) {
              query.callback = callback;
            }
          }
        } else {
          query = new Query2(config, values, callback);
          if (!query.callback) {
            result = new this._Promise((resolve3, reject) => {
              query.callback = (err2, res) => err2 ? reject(err2) : resolve3(res);
            }).catch((err2) => {
              Error.captureStackTrace(err2);
              throw err2;
            });
          } else if (typeof query.callback !== "function") {
            throw new TypeError("callback is not a function");
          }
        }
        const readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
        if (readTimeout) {
          const queryCallback = query.callback || (() => {
          });
          const readTimeoutTimer = setTimeout(() => {
            const error = new Error("Query read timeout");
            process.nextTick(() => {
              query.handleError(error, this.connection);
            });
            queryCallback(error);
            query.callback = () => {
            };
            const index = this._queryQueue.indexOf(query);
            if (index > -1) {
              this._queryQueue.splice(index, 1);
            } else if (this.pipeline) {
              this.connection.stream.destroy();
              return;
            }
            this._pulseQueryQueue();
          }, readTimeout);
          query.callback = (err2, res) => {
            clearTimeout(readTimeoutTimer);
            queryCallback(err2, res);
          };
        }
        if (this.binary && !query.binary) {
          query.binary = true;
        }
        if (query._result && !query._result._types) {
          query._result._types = this._types;
        }
        if (this.pipeline) {
          const portalQuery = typeof config.submit === "function" && !(query instanceof Query2) ? "Custom query classes such as pg-cursor and pg-query-stream are" : query.rows ? "The `rows` option is" : null;
          if (portalQuery) {
            process.nextTick(() => {
              query.handleError(new Error(`${portalQuery} not supported in pipeline mode`), this.connection);
            });
            return result;
          }
        }
        if (!this._queryable) {
          process.nextTick(() => {
            query.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
          });
          return result;
        }
        if (this._ending) {
          process.nextTick(() => {
            query.handleError(new Error("Client was closed and is not queryable"), this.connection);
          });
          return result;
        }
        if (this._queryQueue.length > 0 && !this.pipeline) {
          queryQueueLengthDeprecationNotice();
        }
        this._queryQueue.push(query);
        this._pulseQueryQueue();
        return result;
      }
      ref() {
        this.connection.ref();
      }
      unref() {
        this.connection.unref();
      }
      getTransactionStatus() {
        return this._txStatus;
      }
      end(cb) {
        this._ending = true;
        if (!this.connection._connecting || this._ended) {
          if (cb) {
            cb();
            return;
          } else {
            return this._Promise.resolve();
          }
        }
        if (!this._queryable) {
          this.connection.stream.destroy();
        } else if (this.pipeline && (this._getActiveQuery() || this._sentQueryQueue.length > 0 || this._queryQueue.length > 0)) {
          this.once("drain", () => this.connection.end());
        } else if (this._getActiveQuery()) {
          this.connection.stream.destroy();
        } else {
          this.connection.end();
        }
        if (cb) {
          this.connection.once("end", cb);
        } else {
          return new this._Promise((resolve3) => {
            this.connection.once("end", resolve3);
          });
        }
      }
      get queryQueue() {
        queryQueueDeprecationNotice();
        return this._queryQueue;
      }
    };
    Client3.Query = Query2;
    module.exports = Client3;
  }
});

// scripts/node-lab/node_modules/pg-pool/index.js
var require_pg_pool = __commonJS({
  "scripts/node-lab/node_modules/pg-pool/index.js"(exports, module) {
    "use strict";
    init_globals();
    var EventEmitter = require_events().EventEmitter;
    var NOOP = /* @__PURE__ */ __name(function() {
    }, "NOOP");
    var removeWhere = /* @__PURE__ */ __name((list, predicate) => {
      const i2 = list.findIndex(predicate);
      return i2 === -1 ? void 0 : list.splice(i2, 1)[0];
    }, "removeWhere");
    var IdleItem = class {
      static {
        __name(this, "IdleItem");
      }
      constructor(client, idleListener, timeoutId) {
        this.client = client;
        this.idleListener = idleListener;
        this.timeoutId = timeoutId;
      }
    };
    var PendingItem = class {
      static {
        __name(this, "PendingItem");
      }
      constructor(callback) {
        this.callback = callback;
      }
    };
    function throwOnDoubleRelease() {
      throw new Error("Release called on client which has already been released to the pool.");
    }
    __name(throwOnDoubleRelease, "throwOnDoubleRelease");
    function promisify2(Promise2, callback) {
      if (callback) {
        return { callback, result: void 0 };
      }
      let rej;
      let res;
      const cb = /* @__PURE__ */ __name(function(err2, client) {
        err2 ? rej(err2) : res(client);
      }, "cb");
      const result = new Promise2(function(resolve3, reject) {
        res = resolve3;
        rej = reject;
      }).catch((err2) => {
        Error.captureStackTrace(err2);
        throw err2;
      });
      return { callback: cb, result };
    }
    __name(promisify2, "promisify");
    function makeIdleListener(pool, client) {
      return /* @__PURE__ */ __name(function idleListener(err2) {
        err2.client = client;
        client.removeListener("error", idleListener);
        client.on("error", () => {
          pool.log("additional client error after disconnection due to error", err2);
        });
        pool._remove(client);
        pool.emit("error", err2, client);
      }, "idleListener");
    }
    __name(makeIdleListener, "makeIdleListener");
    var Pool3 = class extends EventEmitter {
      static {
        __name(this, "Pool");
      }
      constructor(options, Client3) {
        super();
        this.options = Object.assign({}, options);
        if (options != null && "password" in options) {
          Object.defineProperty(this.options, "password", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: options.password
          });
        }
        if (options != null && options.ssl && options.ssl.key) {
          Object.defineProperty(this.options.ssl, "key", {
            enumerable: false
          });
        }
        this.options.max = this.options.max || this.options.poolSize || 10;
        this.options.min = this.options.min || 0;
        this.options.maxUses = this.options.maxUses || Infinity;
        this.options.allowExitOnIdle = this.options.allowExitOnIdle || false;
        this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0;
        this.log = this.options.log || function() {
        };
        this.Client = this.options.Client || Client3 || require_lib3().Client;
        this.Promise = this.options.Promise || globalThis.Promise;
        if (typeof this.options.idleTimeoutMillis === "undefined") {
          this.options.idleTimeoutMillis = 1e4;
        }
        this._clients = [];
        this._idle = [];
        this._expired = /* @__PURE__ */ new WeakSet();
        this._pendingQueue = [];
        this._endCallback = void 0;
        this.ending = false;
        this.ended = false;
      }
      _promiseTry(f) {
        const Promise2 = this.Promise;
        if (typeof Promise2.try === "function") {
          return Promise2.try(f);
        }
        return new Promise2((resolve3) => resolve3(f()));
      }
      _isFull() {
        return this._clients.length >= this.options.max;
      }
      _isAboveMin() {
        return this._clients.length > this.options.min;
      }
      _pulseQueue() {
        this.log("pulse queue");
        if (this.ended) {
          this.log("pulse queue ended");
          return;
        }
        if (this.ending) {
          this.log("pulse queue on ending");
          if (this._idle.length) {
            this._idle.slice().map((item) => {
              this._remove(item.client);
            });
          }
          if (!this._clients.length) {
            this.ended = true;
            this._endCallback();
          }
          return;
        }
        if (!this._pendingQueue.length) {
          this.log("no queued requests");
          return;
        }
        if (!this._idle.length && this._isFull()) {
          return;
        }
        const pendingItem = this._pendingQueue.shift();
        if (this._idle.length) {
          const idleItem = this._idle.pop();
          clearTimeout(idleItem.timeoutId);
          const client = idleItem.client;
          client.ref && client.ref();
          const idleListener = idleItem.idleListener;
          return this._acquireClient(client, pendingItem, idleListener, false);
        }
        if (!this._isFull()) {
          return this.newClient(pendingItem);
        }
        throw new Error("unexpected condition");
      }
      _remove(client, callback) {
        const removed = removeWhere(this._idle, (item) => item.client === client);
        if (removed !== void 0) {
          clearTimeout(removed.timeoutId);
        }
        this._clients = this._clients.filter((c) => c !== client);
        const context = this;
        client.end(() => {
          context.emit("remove", client);
          if (typeof callback === "function") {
            callback();
          }
        });
      }
      connect(cb) {
        if (this.ending) {
          const err2 = new Error("Cannot use a pool after calling end on the pool");
          return cb ? cb(err2) : this.Promise.reject(err2);
        }
        const response = promisify2(this.Promise, cb);
        const result = response.result;
        if (this._isFull() || this._idle.length) {
          if (this._idle.length) {
            process.nextTick(() => this._pulseQueue());
          }
          if (!this.options.connectionTimeoutMillis) {
            this._pendingQueue.push(new PendingItem(response.callback));
            return result;
          }
          const queueCallback = /* @__PURE__ */ __name((err2, res, done) => {
            clearTimeout(tid);
            response.callback(err2, res, done);
          }, "queueCallback");
          const pendingItem = new PendingItem(queueCallback);
          const tid = setTimeout(() => {
            removeWhere(this._pendingQueue, (i2) => i2.callback === queueCallback);
            pendingItem.timedOut = true;
            response.callback(new Error("timeout exceeded when trying to connect"));
          }, this.options.connectionTimeoutMillis);
          if (tid.unref) {
            tid.unref();
          }
          this._pendingQueue.push(pendingItem);
          return result;
        }
        this.newClient(new PendingItem(response.callback));
        return result;
      }
      newClient(pendingItem) {
        const client = new this.Client(this.options);
        this._clients.push(client);
        const idleListener = makeIdleListener(this, client);
        this.log("checking client timeout");
        let tid;
        let timeoutHit = false;
        if (this.options.connectionTimeoutMillis) {
          tid = setTimeout(() => {
            if (client.connection) {
              this.log("ending client due to timeout");
              timeoutHit = true;
              client.connection.stream.destroy();
            } else if (!client.isConnected()) {
              this.log("ending client due to timeout");
              timeoutHit = true;
              client.end();
            }
          }, this.options.connectionTimeoutMillis);
        }
        this.log("connecting new client");
        client.connect((err2) => {
          if (tid) {
            clearTimeout(tid);
          }
          client.on("error", idleListener);
          if (err2) {
            this.log("client failed to connect", err2);
            this._clients = this._clients.filter((c) => c !== client);
            if (timeoutHit) {
              err2 = new Error("Connection terminated due to connection timeout", { cause: err2 });
            }
            this._pulseQueue();
            if (!pendingItem.timedOut) {
              pendingItem.callback(err2, void 0, NOOP);
            }
          } else {
            this.log("new client connected");
            if (this.options.onConnect) {
              this._promiseTry(() => this.options.onConnect(client)).then(
                () => {
                  this._afterConnect(client, pendingItem, idleListener);
                },
                (hookErr) => {
                  this._clients = this._clients.filter((c) => c !== client);
                  client.end(() => {
                    this._pulseQueue();
                    if (!pendingItem.timedOut) {
                      pendingItem.callback(hookErr, void 0, NOOP);
                    }
                  });
                }
              );
              return;
            }
            return this._afterConnect(client, pendingItem, idleListener);
          }
        });
      }
      _afterConnect(client, pendingItem, idleListener) {
        if (this.options.maxLifetimeSeconds !== 0) {
          const maxLifetimeTimeout = setTimeout(() => {
            this.log("ending client due to expired lifetime");
            this._expired.add(client);
            const idleIndex = this._idle.findIndex((idleItem) => idleItem.client === client);
            if (idleIndex !== -1) {
              this._acquireClient(
                client,
                new PendingItem((err2, client2, clientRelease) => clientRelease()),
                idleListener,
                false
              );
            }
          }, this.options.maxLifetimeSeconds * 1e3);
          maxLifetimeTimeout.unref();
          client.once("end", () => clearTimeout(maxLifetimeTimeout));
        }
        return this._acquireClient(client, pendingItem, idleListener, true);
      }
      // acquire a client for a pending work item
      _acquireClient(client, pendingItem, idleListener, isNew) {
        if (isNew) {
          this.emit("connect", client);
        }
        this.emit("acquire", client);
        client.release = this._releaseOnce(client, idleListener);
        client.removeListener("error", idleListener);
        if (!pendingItem.timedOut) {
          if (isNew && this.options.verify) {
            this.options.verify(client, (err2) => {
              if (err2) {
                client.release(err2);
                return pendingItem.callback(err2, void 0, NOOP);
              }
              pendingItem.callback(void 0, client, client.release);
            });
          } else {
            pendingItem.callback(void 0, client, client.release);
          }
        } else {
          if (isNew && this.options.verify) {
            this.options.verify(client, client.release);
          } else {
            client.release();
          }
        }
      }
      // returns a function that wraps _release and throws if called more than once
      _releaseOnce(client, idleListener) {
        let released = false;
        return (err2) => {
          if (released) {
            throwOnDoubleRelease();
          }
          released = true;
          this._release(client, idleListener, err2);
        };
      }
      // release a client back to the poll, include an error
      // to remove it from the pool
      _release(client, idleListener, err2) {
        client.on("error", idleListener);
        client._poolUseCount = (client._poolUseCount || 0) + 1;
        this.emit("release", err2, client);
        if (err2 || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
          if (client._poolUseCount >= this.options.maxUses) {
            this.log("remove expended client");
          }
          return this._remove(client, this._pulseQueue.bind(this));
        }
        const isExpired = this._expired.has(client);
        if (isExpired) {
          this.log("remove expired client");
          this._expired.delete(client);
          return this._remove(client, this._pulseQueue.bind(this));
        }
        let tid;
        if (this.options.idleTimeoutMillis && this._isAboveMin()) {
          tid = setTimeout(() => {
            if (this._isAboveMin()) {
              this.log("remove idle client");
              this._remove(client, this._pulseQueue.bind(this));
            }
          }, this.options.idleTimeoutMillis);
          if (this.options.allowExitOnIdle) {
            tid.unref();
          }
        }
        if (this.options.allowExitOnIdle) {
          client.unref();
        }
        this._idle.push(new IdleItem(client, idleListener, tid));
        this._pulseQueue();
      }
      query(text, values, cb) {
        if (typeof text === "function") {
          const response2 = promisify2(this.Promise, text);
          setImmediate(function() {
            return response2.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
          });
          return response2.result;
        }
        if (typeof values === "function") {
          cb = values;
          values = void 0;
        }
        const response = promisify2(this.Promise, cb);
        cb = response.callback;
        this.connect((err2, client) => {
          if (err2) {
            return cb(err2);
          }
          let clientReleased = false;
          const onError = /* @__PURE__ */ __name((err3) => {
            if (clientReleased) {
              return;
            }
            clientReleased = true;
            client.release(err3);
            cb(err3);
          }, "onError");
          client.once("error", onError);
          this.log("dispatching query");
          try {
            client.query(text, values, (err3, res) => {
              this.log("query dispatched");
              client.removeListener("error", onError);
              if (clientReleased) {
                return;
              }
              clientReleased = true;
              client.release(err3);
              if (err3) {
                return cb(err3);
              }
              return cb(void 0, res);
            });
          } catch (err3) {
            client.release(err3);
            return cb(err3);
          }
        });
        return response.result;
      }
      end(cb) {
        this.log("ending");
        if (this.ending) {
          const err2 = new Error("Called end on pool more than once");
          return cb ? cb(err2) : this.Promise.reject(err2);
        }
        this.ending = true;
        const promised = promisify2(this.Promise, cb);
        this._endCallback = promised.callback;
        this._pulseQueue();
        return promised.result;
      }
      get waitingCount() {
        return this._pendingQueue.length;
      }
      get idleCount() {
        return this._idle.length;
      }
      get expiredCount() {
        return this._clients.reduce((acc, client) => acc + (this._expired.has(client) ? 1 : 0), 0);
      }
      get totalCount() {
        return this._clients.length;
      }
    };
    module.exports = Pool3;
  }
});

// empty:pg-native
var require_pg_native = __commonJS({
  "empty:pg-native"(exports, module) {
    init_globals();
    module.exports = {};
  }
});

// scripts/node-lab/node_modules/pg/lib/native/query.js
var require_query2 = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/native/query.js"(exports, module) {
    "use strict";
    init_globals();
    var EventEmitter = require_events().EventEmitter;
    var util = require_util();
    var utils = require_utils2();
    var NativeQuery = module.exports = function(config, values, callback) {
      EventEmitter.call(this);
      config = utils.normalizeQueryConfig(config, values, callback);
      this.text = config.text;
      this.values = config.values;
      this.name = config.name;
      this.queryMode = config.queryMode;
      this.callback = config.callback;
      this.state = "new";
      this._arrayMode = config.rowMode === "array";
      this._emitRowEvents = false;
      this.on(
        "newListener",
        function(event) {
          if (event === "row") this._emitRowEvents = true;
        }.bind(this)
      );
    };
    util.inherits(NativeQuery, EventEmitter);
    var errorFieldMap = {
      sqlState: "code",
      statementPosition: "position",
      messagePrimary: "message",
      messageDetail: "detail",
      messageHint: "hint",
      context: "where",
      schemaName: "schema",
      tableName: "table",
      columnName: "column",
      dataTypeName: "dataType",
      constraintName: "constraint",
      sourceFile: "file",
      sourceLine: "line",
      sourceFunction: "routine"
    };
    NativeQuery.prototype.handleError = function(err2) {
      const fields = this.native && this.native.pq.resultErrorFields();
      if (fields) {
        for (const key in fields) {
          const normalizedFieldName = errorFieldMap[key] || key;
          err2[normalizedFieldName] = fields[key];
        }
      }
      if (this.callback) {
        this.callback(err2);
      } else {
        this.emit("error", err2);
      }
      this.state = "error";
    };
    NativeQuery.prototype.then = function(onSuccess, onFailure) {
      return this._getPromise().then(onSuccess, onFailure);
    };
    NativeQuery.prototype.catch = function(callback) {
      return this._getPromise().catch(callback);
    };
    NativeQuery.prototype._getPromise = function() {
      if (this._promise) return this._promise;
      this._promise = new Promise(
        function(resolve3, reject) {
          this._once("end", resolve3);
          this._once("error", reject);
        }.bind(this)
      );
      return this._promise;
    };
    NativeQuery.prototype.submit = function(client) {
      this.state = "running";
      const self = this;
      this.native = client.native;
      client.native.arrayMode = this._arrayMode;
      let after = /* @__PURE__ */ __name(function(err2, rows, results) {
        client.native.arrayMode = false;
        setImmediate(function() {
          self.emit("_done");
        });
        if (err2) {
          return self.handleError(err2);
        }
        if (self._emitRowEvents) {
          if (results.length > 1) {
            rows.forEach((rowOfRows, i2) => {
              rowOfRows.forEach((row) => {
                self.emit("row", row, results[i2]);
              });
            });
          } else {
            rows.forEach(function(row) {
              self.emit("row", row, results);
            });
          }
        }
        self.state = "end";
        self.emit("end", results);
        if (self.callback) {
          self.callback(null, results);
        }
      }, "after");
      if (process.domain) {
        after = process.domain.bind(after);
      }
      if (this.name) {
        if (this.name.length > 63) {
          console.error("Warning! Postgres only supports 63 characters for query names.");
          console.error("You supplied %s (%s)", this.name, this.name.length);
          console.error("This can cause conflicts and silent errors executing queries");
        }
        const values = (this.values || []).map(utils.prepareValue);
        if (client.namedQueries[this.name] !== void 0) {
          if (this.text && client.namedQueries[this.name] !== this.text) {
            const err2 = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
            return after(err2);
          }
          return client.native.execute(this.name, values, after);
        }
        return client.native.prepare(this.name, this.text, values.length, function(err2) {
          if (err2) return after(err2);
          client.namedQueries[self.name] = self.text;
          return self.native.execute(self.name, values, after);
        });
      } else if (this.values) {
        if (!Array.isArray(this.values)) {
          const err2 = new Error("Query values must be an array");
          return after(err2);
        }
        const vals = this.values.map(utils.prepareValue);
        client.native.query(this.text, vals, after);
      } else if (this.queryMode === "extended") {
        client.native.query(this.text, [], after);
      } else {
        client.native.query(this.text, after);
      }
    };
  }
});

// scripts/node-lab/node_modules/pg/lib/native/client.js
var require_client2 = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/native/client.js"(exports, module) {
    init_globals();
    var nodeUtils = require_util();
    var Native;
    try {
      Native = require_pg_native();
    } catch (e) {
      throw e;
    }
    var TypeOverrides2 = require_type_overrides();
    var EventEmitter = require_events().EventEmitter;
    var util = require_util();
    var ConnectionParameters = require_connection_parameters();
    var NativeQuery = require_query2();
    var queryQueueLengthDeprecationNotice = nodeUtils.deprecate(
      () => {
      },
      "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead."
    );
    var Client3 = module.exports = function(config) {
      EventEmitter.call(this);
      config = config || {};
      this._Promise = config.Promise || globalThis.Promise;
      this._types = new TypeOverrides2(config.types);
      this.native = new Native({
        types: this._types
      });
      this._queryQueue = [];
      this._ending = false;
      this._connecting = false;
      this._connected = false;
      this._queryable = true;
      this.pipeline = Boolean(config.pipeline);
      this._pipelineInFlight = false;
      const cp = this.connectionParameters = new ConnectionParameters(config);
      if (config.nativeConnectionString) cp.nativeConnectionString = config.nativeConnectionString;
      this.user = cp.user;
      Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: cp.password
      });
      this.database = cp.database;
      this.host = cp.host;
      this.port = cp.port;
      this.namedQueries = {};
    };
    Client3.Query = NativeQuery;
    util.inherits(Client3, EventEmitter);
    Client3.prototype._errorAllQueries = function(err2) {
      const enqueueError = /* @__PURE__ */ __name((query) => {
        process.nextTick(() => {
          query.native = this.native;
          query.handleError(err2);
        });
      }, "enqueueError");
      if (this._hasActiveQuery()) {
        enqueueError(this._activeQuery);
        this._activeQuery = null;
      }
      this._queryQueue.forEach(enqueueError);
      this._queryQueue.length = 0;
    };
    Client3.prototype._connect = function(cb) {
      const self = this;
      if (this._connecting) {
        process.nextTick(() => cb(new Error("Client has already been connected. You cannot reuse a client.")));
        return;
      }
      this._connecting = true;
      this.connectionParameters.getLibpqConnectionString(function(err2, conString) {
        if (self.connectionParameters.nativeConnectionString) conString = self.connectionParameters.nativeConnectionString;
        if (err2) return cb(err2);
        self.native.connect(conString, function(err3) {
          if (err3) {
            self.native.end();
            return cb(err3);
          }
          self._connected = true;
          self.native.on("error", function(err4) {
            self._queryable = false;
            self._errorAllQueries(err4);
            self.emit("error", err4);
          });
          self.native.on("notification", function(msg2) {
            self.emit("notification", {
              channel: msg2.relname,
              payload: msg2.extra
            });
          });
          self.emit("connect");
          self._pulseQueryQueue(true);
          cb(null, this);
        });
      });
    };
    Client3.prototype.connect = function(callback) {
      if (callback) {
        this._connect(callback);
        return;
      }
      return new this._Promise((resolve3, reject) => {
        this._connect((error) => {
          if (error) {
            reject(error);
          } else {
            resolve3(this);
          }
        });
      });
    };
    Client3.prototype.query = function(config, values, callback) {
      let query;
      let result;
      let readTimeout;
      let readTimeoutTimer;
      let queryCallback;
      if (config === null || config === void 0) {
        throw new TypeError("Client was passed a null or undefined query");
      } else if (typeof config.submit === "function") {
        readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
        result = query = config;
        if (typeof values === "function") {
          config.callback = values;
        }
      } else {
        readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
        query = new NativeQuery(config, values, callback);
        if (!query.callback) {
          let resolveOut, rejectOut;
          result = new this._Promise((resolve3, reject) => {
            resolveOut = resolve3;
            rejectOut = reject;
          }).catch((err2) => {
            Error.captureStackTrace(err2);
            throw err2;
          });
          query.callback = (err2, res) => err2 ? rejectOut(err2) : resolveOut(res);
        }
      }
      if (readTimeout) {
        queryCallback = query.callback || (() => {
        });
        readTimeoutTimer = setTimeout(() => {
          const error = new Error("Query read timeout");
          process.nextTick(() => {
            query.handleError(error, this.connection);
          });
          queryCallback(error);
          query.callback = () => {
          };
          const index = this._queryQueue.indexOf(query);
          if (index > -1) {
            this._queryQueue.splice(index, 1);
          }
          this._pulseQueryQueue();
        }, readTimeout);
        query.callback = (err2, res) => {
          clearTimeout(readTimeoutTimer);
          queryCallback(err2, res);
        };
      }
      if (!this._queryable) {
        query.native = this.native;
        process.nextTick(() => {
          query.handleError(new Error("Client has encountered a connection error and is not queryable"));
        });
        return result;
      }
      if (this._ending) {
        query.native = this.native;
        process.nextTick(() => {
          query.handleError(new Error("Client was closed and is not queryable"));
        });
        return result;
      }
      if (this._queryQueue.length > 0 && !this.pipeline) {
        queryQueueLengthDeprecationNotice();
      }
      this._queryQueue.push(query);
      this._pulseQueryQueue();
      return result;
    };
    Client3.prototype.end = function(cb) {
      const self = this;
      this._ending = true;
      if (this._connecting && !this._connected) {
        this.once("connect", () => {
          this.end(() => {
          });
        });
      }
      let result;
      if (!cb) {
        result = new this._Promise(function(resolve3, reject) {
          cb = /* @__PURE__ */ __name((err2) => err2 ? reject(err2) : resolve3(), "cb");
        });
      }
      const doEnd = /* @__PURE__ */ __name(function() {
        self.native.end(function() {
          self._connected = false;
          self._errorAllQueries(new Error("Connection terminated"));
          process.nextTick(() => {
            self.emit("end");
            if (cb) cb();
          });
        });
      }, "doEnd");
      if (this.pipeline && (this._pipelineInFlight || this._queryQueue.length > 0)) {
        this.once("drain", doEnd);
      } else {
        doEnd();
      }
      return result;
    };
    Client3.prototype._hasActiveQuery = function() {
      return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
    };
    Client3.prototype._pulseQueryQueue = function(initialConnection) {
      if (!this._connected) {
        return;
      }
      if (this.pipeline && !initialConnection) {
        return this._pulsePipelinedQueryQueue();
      }
      if (this._hasActiveQuery()) {
        return;
      }
      const query = this._queryQueue.shift();
      if (!query) {
        if (!initialConnection) {
          this.emit("drain");
        }
        return;
      }
      this._activeQuery = query;
      query.submit(this);
      const self = this;
      query.once("_done", function() {
        self._pulseQueryQueue();
      });
    };
    Client3.prototype._pulsePipelinedQueryQueue = function() {
      if (!this._connected || this._pipelineInFlight) {
        return;
      }
      if (this._queryQueue.length === 0) {
        if (this.hasExecuted) {
          this.emit("drain");
        }
        return;
      }
      this._pipelineInFlight = true;
      const self = this;
      const queries = [];
      const nativeQueries = [];
      const utils = require_utils2();
      while (this._queryQueue.length > 0) {
        const query = this._queryQueue.shift();
        this.hasExecuted = true;
        nativeQueries.push(query);
        const values = query.values ? query.values.map(utils.prepareValue) : null;
        const pipelineEntry = { text: query.text, name: query.name, arrayMode: query._arrayMode };
        if (values) {
          pipelineEntry.values = values;
        }
        if (query.name && this.namedQueries[query.name]) {
          pipelineEntry._alreadyPrepared = true;
        }
        queries.push(pipelineEntry);
      }
      this.native.pipeline(queries, function(err2, results) {
        self._pipelineInFlight = false;
        if (err2) {
          self._connected = false;
          self._queryable = false;
          for (let i2 = 0; i2 < nativeQueries.length; i2++) {
            const q = nativeQueries[i2];
            q.native = self.native;
            q.handleError(err2);
          }
          self._errorAllQueries(err2);
          self.emit("error", err2);
          self.emit("end");
          return;
        }
        for (let i2 = 0; i2 < nativeQueries.length; i2++) {
          const q = nativeQueries[i2];
          const r = results[i2];
          q.native = self.native;
          if (r.err) {
            q.handleError(r.err);
          } else {
            if (q.name) {
              self.namedQueries[q.name] = q.text;
            }
            q.state = "end";
            q.emit("end", r.result);
            if (q.callback) {
              q.callback(null, r.result);
            }
          }
          setImmediate(function() {
            q.emit("_done");
          });
        }
        self._pulsePipelinedQueryQueue();
      });
    };
    Client3.prototype.cancel = function(query) {
      if (this._activeQuery === query) {
        this.native.cancel(function() {
        });
      } else if (this._queryQueue.indexOf(query) !== -1) {
        this._queryQueue.splice(this._queryQueue.indexOf(query), 1);
      }
    };
    Client3.prototype.ref = function() {
    };
    Client3.prototype.unref = function() {
    };
    Client3.prototype.setTypeParser = function(oid, format4, parseFn) {
      return this._types.setTypeParser(oid, format4, parseFn);
    };
    Client3.prototype.getTypeParser = function(oid, format4) {
      return this._types.getTypeParser(oid, format4);
    };
    Client3.prototype.isConnected = function() {
      return this._connected;
    };
    Client3.prototype.getTransactionStatus = function() {
      return this.native.getTransactionStatus();
    };
  }
});

// scripts/node-lab/node_modules/pg/lib/native/index.js
var require_native = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/native/index.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = require_client2();
  }
});

// scripts/node-lab/node_modules/pg/lib/index.js
var require_lib3 = __commonJS({
  "scripts/node-lab/node_modules/pg/lib/index.js"(exports, module) {
    "use strict";
    init_globals();
    var Client3 = require_client();
    var defaults2 = require_defaults();
    var Connection2 = require_connection();
    var Result2 = require_result();
    var utils = require_utils2();
    var Pool3 = require_pg_pool();
    var TypeOverrides2 = require_type_overrides();
    var { DatabaseError: DatabaseError2 } = require_dist();
    var { escapeIdentifier: escapeIdentifier2, escapeLiteral: escapeLiteral2 } = require_utils2();
    var poolFactory = /* @__PURE__ */ __name((Client4) => {
      return class BoundPool extends Pool3 {
        static {
          __name(this, "BoundPool");
        }
        constructor(options) {
          super(options, Client4);
        }
      };
    }, "poolFactory");
    var PG = /* @__PURE__ */ __name(function(clientConstructor2) {
      this.defaults = defaults2;
      this.Client = clientConstructor2;
      this.Query = this.Client.Query;
      this.Pool = poolFactory(this.Client);
      this._pools = [];
      this.Connection = Connection2;
      this.types = require_pg_types();
      this.DatabaseError = DatabaseError2;
      this.TypeOverrides = TypeOverrides2;
      this.escapeIdentifier = escapeIdentifier2;
      this.escapeLiteral = escapeLiteral2;
      this.Result = Result2;
      this.utils = utils;
    }, "PG");
    var clientConstructor = Client3;
    var forceNative = false;
    try {
      forceNative = !!process.env.NODE_PG_FORCE_NATIVE;
    } catch {
    }
    if (forceNative) {
      clientConstructor = require_native();
    }
    module.exports = new PG(clientConstructor);
    Object.defineProperty(module.exports, "native", {
      configurable: true,
      enumerable: false,
      get() {
        let native = null;
        try {
          native = new PG(require_native());
        } catch (err2) {
          if (err2.code !== "MODULE_NOT_FOUND") {
            throw err2;
          }
        }
        Object.defineProperty(module.exports, "native", {
          value: native
        });
        return native;
      }
    });
  }
});

// src/academy/node/runtime/builtin-os.js
var builtin_os_exports = {};
__export(builtin_os_exports, {
  EOL: () => EOL,
  arch: () => arch,
  availableParallelism: () => availableParallelism,
  constants: () => constants,
  cpus: () => cpus,
  default: () => builtin_os_default,
  endianness: () => endianness,
  freemem: () => freemem,
  homedir: () => homedir,
  hostname: () => hostname,
  loadavg: () => loadavg,
  networkInterfaces: () => networkInterfaces,
  platform: () => platform,
  release: () => release,
  tmpdir: () => tmpdir,
  totalmem: () => totalmem,
  type: () => type,
  uptime: () => uptime,
  userInfo: () => userInfo
});
var builtin_os_default, EOL, platform, type, release, hostname, homedir, tmpdir, endianness, cpus, availableParallelism, totalmem, freemem, uptime, loadavg, networkInterfaces, userInfo, constants, arch;
var init_builtin_os = __esm({
  "src/academy/node/runtime/builtin-os.js"() {
    init_globals();
    init_builtins();
    builtin_os_default = os;
    ({ EOL, platform, type, release, hostname, homedir, tmpdir, endianness, cpus, availableParallelism, totalmem, freemem, uptime, loadavg, networkInterfaces, userInfo, constants, arch } = os);
  }
});

// src/academy/node/runtime/gen/os.cjs
var require_os = __commonJS({
  "src/academy/node/runtime/gen/os.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_os(), __toCommonJS(builtin_os_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/builtin-async-hooks.js
var builtin_async_hooks_exports = {};
__export(builtin_async_hooks_exports, {
  AsyncLocalStorage: () => AsyncLocalStorage2,
  AsyncResource: () => AsyncResource2,
  createHook: () => createHook,
  default: () => builtin_async_hooks_default,
  executionAsyncId: () => executionAsyncId,
  triggerAsyncId: () => triggerAsyncId
});
var builtin_async_hooks_default, AsyncLocalStorage2, AsyncResource2, createHook, executionAsyncId, triggerAsyncId;
var init_builtin_async_hooks = __esm({
  "src/academy/node/runtime/builtin-async-hooks.js"() {
    init_globals();
    init_builtins();
    builtin_async_hooks_default = asyncHooks;
    ({ AsyncLocalStorage: AsyncLocalStorage2, AsyncResource: AsyncResource2, createHook, executionAsyncId, triggerAsyncId } = asyncHooks);
  }
});

// src/academy/node/runtime/gen/async_hooks.cjs
var require_async_hooks = __commonJS({
  "src/academy/node/runtime/gen/async_hooks.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_async_hooks(), __toCommonJS(builtin_async_hooks_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/builtin-url.js
var builtin_url_exports = {};
__export(builtin_url_exports, {
  URL: () => URL2,
  URLSearchParams: () => URLSearchParams,
  Url: () => Url2,
  default: () => builtin_url_default,
  domainToASCII: () => domainToASCII,
  fileURLToPath: () => fileURLToPath2,
  format: () => format3,
  parse: () => parse2,
  pathToFileURL: () => pathToFileURL2,
  resolve: () => resolve2,
  urlToHttpOptions: () => urlToHttpOptions
});
var builtin_url_default, URL2, URLSearchParams, parse2, format3, resolve2, Url2, fileURLToPath2, pathToFileURL2, domainToASCII, urlToHttpOptions;
var init_builtin_url = __esm({
  "src/academy/node/runtime/builtin-url.js"() {
    init_globals();
    init_builtins();
    builtin_url_default = url;
    ({ URL: URL2, URLSearchParams, parse: parse2, format: format3, resolve: resolve2, Url: Url2, fileURLToPath: fileURLToPath2, pathToFileURL: pathToFileURL2, domainToASCII, urlToHttpOptions } = url);
  }
});

// src/academy/node/runtime/gen/url.cjs
var require_url2 = __commonJS({
  "src/academy/node/runtime/gen/url.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_url(), __toCommonJS(builtin_url_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/builtin-unsupported.js
var builtin_unsupported_exports = {};
__export(builtin_unsupported_exports, {
  Script: () => Script,
  createContext: () => createContext,
  default: () => builtin_unsupported_default,
  exec: () => exec,
  execSync: () => execSync,
  fork: () => fork,
  isMaster: () => isMaster,
  isPrimary: () => isPrimary,
  spawn: () => spawn
});
var builtin_unsupported_default, fork, spawn, exec, execSync, isPrimary, isMaster, createContext, Script;
var init_builtin_unsupported = __esm({
  "src/academy/node/runtime/builtin-unsupported.js"() {
    init_globals();
    init_builtins();
    builtin_unsupported_default = childProcess;
    fork = /* @__PURE__ */ __name((...a) => childProcess.fork(...a), "fork");
    spawn = /* @__PURE__ */ __name((...a) => childProcess.spawn(...a), "spawn");
    exec = /* @__PURE__ */ __name((...a) => childProcess.exec(...a), "exec");
    execSync = /* @__PURE__ */ __name((...a) => childProcess.execSync(...a), "execSync");
    isPrimary = true;
    isMaster = true;
    createContext = /* @__PURE__ */ __name((...a) => childProcess.createContext(...a), "createContext");
    Script = /* @__PURE__ */ __name(function() {
      return childProcess.Script();
    }, "Script");
  }
});

// src/academy/node/runtime/gen/child_process.cjs
var require_child_process = __commonJS({
  "src/academy/node/runtime/gen/child_process.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_unsupported(), __toCommonJS(builtin_unsupported_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/gen/process.cjs
var require_process = __commonJS({
  "src/academy/node/runtime/gen/process.cjs"(exports, module) {
    init_globals();
    var m = (init_process(), __toCommonJS(process_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/builtin-zlib.js
var builtin_zlib_exports = {};
__export(builtin_zlib_exports, {
  constants: () => constants2,
  createBrotliDecompress: () => createBrotliDecompress,
  createDeflate: () => createDeflate,
  createDeflateRaw: () => createDeflateRaw,
  createGunzip: () => createGunzip,
  createGzip: () => createGzip,
  createInflate: () => createInflate,
  createInflateRaw: () => createInflateRaw,
  createUnzip: () => createUnzip,
  default: () => builtin_zlib_default,
  deflateSync: () => deflateSync2,
  gunzip: () => gunzip,
  gunzipSync: () => gunzipSync2,
  gzip: () => gzip,
  gzipSync: () => gzipSync2,
  inflateSync: () => inflateSync2
});
var builtin_zlib_default, gzipSync2, gunzipSync2, deflateSync2, inflateSync2, createGzip, createGunzip, createDeflate, createInflate, createInflateRaw, createDeflateRaw, createUnzip, createBrotliDecompress, constants2, gzip, gunzip;
var init_builtin_zlib = __esm({
  "src/academy/node/runtime/builtin-zlib.js"() {
    init_globals();
    init_builtins();
    builtin_zlib_default = zlib;
    ({ gzipSync: gzipSync2, gunzipSync: gunzipSync2, deflateSync: deflateSync2, inflateSync: inflateSync2, createGzip, createGunzip, createDeflate, createInflate, createInflateRaw, createDeflateRaw, createUnzip, createBrotliDecompress, constants: constants2, gzip, gunzip } = zlib);
  }
});

// src/academy/node/runtime/gen/zlib.cjs
var require_zlib = __commonJS({
  "src/academy/node/runtime/gen/zlib.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_zlib(), __toCommonJS(builtin_zlib_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/gen/http.cjs
var require_http = __commonJS({
  "src/academy/node/runtime/gen/http.cjs"(exports, module) {
    init_globals();
    var m = (init_http(), __toCommonJS(http_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/builtin-tty.js
var builtin_tty_exports = {};
__export(builtin_tty_exports, {
  ReadStream: () => ReadStream,
  WriteStream: () => WriteStream,
  default: () => builtin_tty_default,
  isatty: () => isatty
});
var builtin_tty_default, isatty, ReadStream, WriteStream;
var init_builtin_tty = __esm({
  "src/academy/node/runtime/builtin-tty.js"() {
    init_globals();
    init_builtins();
    builtin_tty_default = tty;
    ({ isatty, ReadStream, WriteStream } = tty);
  }
});

// src/academy/node/runtime/gen/tty.cjs
var require_tty = __commonJS({
  "src/academy/node/runtime/gen/tty.cjs"(exports, module) {
    init_globals();
    var m = (init_builtin_tty(), __toCommonJS(builtin_tty_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// src/academy/node/runtime/labPg.js
init_globals();

// scripts/node-lab/node_modules/pg/esm/index.mjs
init_globals();
var import_lib = __toESM(require_lib3(), 1);
var Client = import_lib.default.Client;
var Pool = import_lib.default.Pool;
var Connection = import_lib.default.Connection;
var types2 = import_lib.default.types;
var Query = import_lib.default.Query;
var DatabaseError = import_lib.default.DatabaseError;
var escapeIdentifier = import_lib.default.escapeIdentifier;
var escapeLiteral = import_lib.default.escapeLiteral;
var Result = import_lib.default.Result;
var TypeOverrides = import_lib.default.TypeOverrides;
var defaults = import_lib.default.defaults;
var esm_default = import_lib.default;

// src/academy/node/runtime/labPg.js
init_context();
init_process();

// src/academy/node/runtime/pgSocket.js
init_globals();
init_events();
init_buffer();
init_context();
var LOCK_WAIT_MS = 15e3;
var SessionLock = class {
  static {
    __name(this, "SessionLock");
  }
  constructor() {
    this.owner = null;
    this.queue = [];
  }
  acquire(socket) {
    if (this.owner === null || this.owner === socket) {
      this.owner = socket;
      return Promise.resolve();
    }
    return new Promise((resolve3, reject) => {
      const entry = { socket, resolve: resolve3, reject, timer: null };
      const loop2 = ctx.loop;
      if (loop2) {
        entry.timer = loop2.setTimeout(() => {
          this.queue = this.queue.filter((e) => e !== entry);
          reject(
            Object.assign(
              new Error(
                "This query waited 15 seconds for a transaction on another connection to finish. The lab's PostgreSQL gives a transaction the database to itself, so a query sent with pool.query() while your code holds a client inside BEGIN \u2026 COMMIT waits for that transaction. Inside a transaction, send every query through the transaction's client (client.query), and always COMMIT or ROLLBACK and release() it."
              ),
              { code: "LAB_LOCK_TIMEOUT" }
            )
          );
        }, LOCK_WAIT_MS);
        entry.timer.unref();
      }
      this.queue.push(entry);
    });
  }
  release(socket) {
    if (this.owner !== socket) return;
    this.owner = null;
    const next = this.queue.shift();
    if (next) {
      if (next.timer) ctx.loop?.clear(next.timer);
      this.owner = next.socket;
      next.resolve();
    }
  }
  drop(socket) {
    this.queue = this.queue.filter((e) => e.socket !== socket);
    this.release(socket);
  }
};
function msg(type2, body) {
  const b = Buffer2.alloc(5 + body.length);
  b.write(type2, 0, "latin1");
  b.writeInt32BE(4 + body.length, 1);
  body.copy(b, 5);
  return b;
}
__name(msg, "msg");
var int32 = /* @__PURE__ */ __name((n) => {
  const b = Buffer2.alloc(4);
  b.writeInt32BE(n, 0);
  return b;
}, "int32");
var cstr = /* @__PURE__ */ __name((s) => Buffer2.from(`${s}\0`, "utf8"), "cstr");
function errorResponse(fields) {
  const parts = Object.entries(fields).map(([k, v]) => Buffer2.concat([Buffer2.from(k, "latin1"), cstr(v)]));
  return msg("E", Buffer2.concat([...parts, Buffer2.from([0])]));
}
__name(errorResponse, "errorResponse");
function lastReadyStatus(buf) {
  let status = null;
  let i2 = 0;
  while (i2 + 5 <= buf.length) {
    const type2 = String.fromCharCode(buf[i2]);
    const len = buf.readInt32BE(i2 + 1);
    if (type2 === "Z") status = String.fromCharCode(buf[i2 + 5]);
    i2 += 1 + len;
  }
  return status;
}
__name(lastReadyStatus, "lastReadyStatus");
function frames(buf) {
  const out = [];
  let i2 = 0;
  while (i2 + 5 <= buf.length) {
    const len = buf.readInt32BE(i2 + 1);
    if (i2 + 1 + len > buf.length) break;
    out.push(buf.subarray(i2, i2 + 1 + len));
    i2 += 1 + len;
  }
  return [out, buf.subarray(i2)];
}
__name(frames, "frames");
var backendPid = 1e3;
var LabPgSocket = class extends events_default {
  static {
    __name(this, "LabPgSocket");
  }
  /**
   * server: { db, lock, host, port, user, password, database, version } —
   * the lab database (machine.js), or null when the lab has no database.
   */
  constructor(server) {
    super();
    this.server = server;
    this.connecting = false;
    this.readable = true;
    this.writable = true;
    this.destroyed = false;
    this._started = false;
    this._pending = Buffer2.alloc(0);
    this._batch = [];
    this._state = "startup";
    this._chain = Promise.resolve();
    this._startup = null;
  }
  setNoDelay() {
    return this;
  }
  setKeepAlive() {
    return this;
  }
  setTimeout() {
    return this;
  }
  ref() {
    return this;
  }
  unref() {
    return this;
  }
  cork() {
  }
  uncork() {
  }
  connect(port, host) {
    this.connecting = true;
    const loop2 = ctx.loop;
    const s = this.server;
    const fail2 = /* @__PURE__ */ __name(() => {
      const addr = host === "localhost" || !host ? "127.0.0.1" : host;
      const err2 = new Error(`connect ECONNREFUSED ${addr}:${port}`);
      Object.assign(err2, { errno: -111, code: "ECONNREFUSED", syscall: "connect", address: addr, port: Number(port) });
      this.destroyed = true;
      this.emit("error", err2);
      this.emit("close", true);
    }, "fail");
    const known = /* @__PURE__ */ __name((h) => ["localhost", "127.0.0.1", "::1"].includes(h) ? "localhost" : h, "known");
    loop2.setImmediate(() => {
      if (!s || known(String(host || "localhost")) !== known(s.host) || Number(port || 5432) !== Number(s.port)) {
        if (s && !["localhost", "127.0.0.1", "::1"].includes(String(host || "localhost")) && known(String(host)) !== known(s.host)) {
          const err2 = new Error(`getaddrinfo ENOTFOUND ${host}`);
          Object.assign(err2, { errno: -3008, code: "ENOTFOUND", syscall: "getaddrinfo", hostname: host });
          this.destroyed = true;
          this.emit("error", err2);
          this.emit("close", true);
          return;
        }
        fail2();
        return;
      }
      this.connecting = false;
      this.emit("connect");
    });
    return this;
  }
  write(data, encoding, cb) {
    if (typeof encoding === "function") cb = encoding;
    const chunk = typeof data === "string" ? Buffer2.from(data, encoding || "utf8") : Buffer2.from(data);
    this._chain = this._chain.then(() => this._receive(chunk)).catch((err2) => this._fatal(err2));
    if (typeof cb === "function") ctx.loop.setImmediate(cb);
    return true;
  }
  end(data) {
    if (data) this.write(data);
    this._chain = this._chain.then(() => this._close());
    return this;
  }
  destroy(err2) {
    if (this.destroyed) return this;
    this._chain = this._chain.then(() => this._close(err2));
    return this;
  }
  async _close(err2) {
    if (this.destroyed) return;
    this.destroyed = true;
    const s = this.server;
    if (s && s.lock.owner === this) {
      try {
        await s.db.execProtocolRaw(msg("Q", cstr("ROLLBACK")));
      } catch {
      }
    }
    s?.lock.drop(this);
    ctx.loop?.setImmediate(() => {
      if (err2) this.emit("error", err2);
      this.emit("end");
      this.emit("close", Boolean(err2));
    });
  }
  _push(buf) {
    if (this.destroyed) return;
    this.emit("data", buf);
  }
  _fatal(err2) {
    this.emit("error", err2);
  }
  async _receive(chunk) {
    if (this.destroyed) return;
    if (this._state === "startup") {
      const len = chunk.readInt32BE(0);
      const code = chunk.readInt32BE(4);
      if (code === 80877103) {
        this._push(Buffer2.from("N"));
        if (chunk.length > len) await this._receive(chunk.subarray(len));
        return;
      }
      const fields = chunk.subarray(8, len).toString("utf8").split("\0");
      const params = {};
      for (let i2 = 0; i2 + 1 < fields.length; i2 += 2) if (fields[i2]) params[fields[i2]] = fields[i2 + 1];
      this._startup = params;
      this._state = "password";
      this._push(msg("R", int32(3)));
      return;
    }
    if (this._state === "password") {
      const [messages2] = frames(chunk);
      const pw = messages2[0] ? messages2[0].subarray(5).toString("utf8").replace(/\0$/, "") : "";
      const s = this.server;
      const user = this._startup.user;
      const database = this._startup.database || user;
      if (user !== s.user || pw !== s.password) {
        this._push(errorResponse({ S: "FATAL", V: "FATAL", C: "28P01", M: `password authentication failed for user "${user}"`, R: "auth_failed" }));
        await this._close();
        return;
      }
      if (database !== s.database) {
        this._push(errorResponse({ S: "FATAL", V: "FATAL", C: "3D000", M: `database "${database}" does not exist`, R: "InitPostgres" }));
        await this._close();
        return;
      }
      const status = /* @__PURE__ */ __name((k, v) => msg("S", Buffer2.concat([cstr(k), cstr(v)])), "status");
      const key = Buffer2.concat([int32(++backendPid), int32(24301)]);
      this._push(
        Buffer2.concat([
          msg("R", int32(0)),
          status("application_name", this._startup.application_name || ""),
          status("client_encoding", "UTF8"),
          status("DateStyle", "ISO, MDY"),
          status("default_transaction_read_only", "off"),
          status("in_hot_standby", "off"),
          status("integer_datetimes", "on"),
          status("IntervalStyle", "postgres"),
          status("is_superuser", "off"),
          status("server_encoding", "UTF8"),
          status("server_version", s.version || "18.0"),
          status("session_authorization", user),
          status("standard_conforming_strings", "on"),
          status("TimeZone", "UTC"),
          msg("K", key),
          msg("Z", Buffer2.from("I"))
        ])
      );
      this._state = "ready";
      return;
    }
    const [messages, rest] = frames(Buffer2.concat([this._pending, chunk]));
    this._pending = rest;
    for (const m of messages) {
      const type2 = String.fromCharCode(m[0]);
      if (type2 === "X") {
        await this._close();
        return;
      }
      this._batch.push(m);
      if (type2 === "S" || type2 === "Q") {
        const batch = Buffer2.concat(this._batch);
        this._batch = [];
        await this._run(batch);
      }
    }
  }
  async _run(batch) {
    const s = this.server;
    try {
      await s.lock.acquire(this);
    } catch (err2) {
      this._push(errorResponse({ S: "ERROR", V: "ERROR", C: "57014", M: err2.message }));
      this._push(msg("Z", Buffer2.from("I")));
      return;
    }
    const loop2 = ctx.loop;
    const out = Buffer2.from(await loop2.track(s.db.execProtocolRaw(batch)));
    const status = lastReadyStatus(out);
    if (status === "I") s.lock.release(this);
    this._push(out);
  }
};

// src/academy/node/runtime/labPg.js
var labStream = /* @__PURE__ */ __name(() => new LabPgSocket(ctx.machine?.pgServer || null), "labStream");
var pgDefaults = /* @__PURE__ */ __name(() => {
  esm_default.defaults.user = process_default.env.PGUSER || process_default.env.USER;
}, "pgDefaults");
var Pool2 = class extends esm_default.Pool {
  static {
    __name(this, "Pool");
  }
  constructor(config) {
    pgDefaults();
    super({ ...typeof config === "string" ? { connectionString: config } : config || {}, stream: labStream });
  }
};
var Client2 = class extends esm_default.Client {
  static {
    __name(this, "Client");
  }
  constructor(config) {
    pgDefaults();
    super({ ...typeof config === "string" ? { connectionString: config } : config || {}, stream: labStream });
  }
};
var pg2 = {
  Pool: Pool2,
  Client: Client2,
  types: esm_default.types,
  DatabaseError: esm_default.DatabaseError,
  escapeIdentifier: esm_default.escapeIdentifier,
  escapeLiteral: esm_default.escapeLiteral,
  Result: esm_default.Result,
  TypeOverrides: esm_default.TypeOverrides,
  defaults: esm_default.defaults
};
pg2.default = pg2;
var labPg_default = pg2;

export {
  inspect,
  format,
  init_inspect,
  deepEqual,
  types,
  util_default,
  init_util,
  require_util,
  require_lib,
  gunzipSync,
  unzlibSync,
  init_browser,
  STATUS_CODES,
  Socket,
  IncomingMessage,
  fillRequest,
  ServerResponse,
  http_default,
  https,
  init_http,
  os,
  net,
  timers,
  timersPromises,
  url,
  querystring,
  assert,
  zlib,
  readline,
  readlinePromises,
  dns,
  asyncHooks,
  perfHooks,
  childProcess,
  workerThreads,
  cluster,
  tty,
  v8,
  diagnosticsChannel,
  init_builtins,
  require_tty,
  require_os,
  require_path,
  require_stream2 as require_stream,
  require_async_hooks,
  require_zlib,
  fileURLToPath2 as fileURLToPath,
  pathToFileURL2 as pathToFileURL,
  init_builtin_url,
  require_url2 as require_url,
  require_http,
  require_crypto,
  isIP,
  isIPv62 as isIPv6,
  init_builtin_net,
  require_net,
  fork,
  init_builtin_unsupported,
  require_child_process,
  require_process,
  SessionLock,
  labPg_default
};
