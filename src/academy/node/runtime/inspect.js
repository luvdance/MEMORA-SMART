/**
 * util.inspect and util.format — how Node prints values.
 *
 * A port of the parts of Node 24's lib/internal/util/inspect.js that decide
 * what console.log shows: quoting, the 80-column line-breaking rule
 * ("compact: 3"), grouping of long arrays into columns, depth 2, circular
 * references, Errors with their extra properties, Buffers, Maps, Sets, class
 * instances and null-prototype objects. Colours are never used (a lab's
 * output is a log file, not a TTY).
 */

const BREAK = 80;
const DEPTH = 2;
const COMPACT = 3;
const MAX_ARRAY = 100;
const MAX_STRING = 10000;

// eslint-disable-next-line no-control-regex
const strEscapeSequencesRegExp = /[\x00-\x1f\x27\x5c\x7f-\x9f]/;
const meta = [
  "\\x00", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\x07", "\\b", "\\t", "\\n", "\\x0B", "\\f", "\\r",
  "\\x0E", "\\x0F", "\\x10", "\\x11", "\\x12", "\\x13", "\\x14", "\\x15", "\\x16", "\\x17", "\\x18", "\\x19", "\\x1A",
  "\\x1B", "\\x1C", "\\x1D", "\\x1E", "\\x1F",
];

export function strEscape(str) {
  let singleQuote = 39;
  if (str.includes("'")) {
    if (!str.includes('"')) singleQuote = -2;
    else if (!str.includes("`") && !str.includes("${")) singleQuote = -1;
  }
  const quote = singleQuote === 39 ? "'" : singleQuote === -2 ? '"' : "`";
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) return quote + str + quote;
  let out = "";
  for (const ch of str) {
    const c = ch.charCodeAt(0);
    if (c === singleQuote || c === 92 || c < 32 || (c > 126 && c < 160)) {
      if (c === 39 && singleQuote !== 39) out += ch;
      else if (c === 92) out += "\\\\";
      else if (c === 39) out += "\\'";
      else if (c < 32) out += meta[c];
      else out += `\\x${c.toString(16).toUpperCase()}`;
    } else out += ch;
  }
  return quote + out + quote;
}

const keyStrRegExp = /^[a-zA-Z_][a-zA-Z_0-9]*$/;

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

function isBelowBreakLength(ctx, output, start, base) {
  let total = output.length + start;
  if (total + output.length > BREAK) return false;
  for (const s of output) {
    total += s.length;
    if (total > BREAK) return false;
  }
  return base === "" || !base.includes("\n");
}

function reduceToSingleString(ctx, output, base, braces, extrasType, recurseTimes, value) {
  let entries = output.length;
  if (extrasType === "array" && entries > 6) output = groupArrayElements(ctx, output, value);
  if (ctx.currentDepth - recurseTimes < COMPACT && entries === output.length) {
    const start = output.length + ctx.indentationLvl + braces[0].length + base.length + 10;
    if (isBelowBreakLength(ctx, output, start, base)) {
      const joined = output.join(", ");
      if (!joined.includes("\n")) return `${base ? `${base} ` : ""}${braces[0]} ${joined} ${braces[1]}`;
    }
  }
  const indentation = `\n${" ".repeat(ctx.indentationLvl)}`;
  return `${base ? `${base} ` : ""}${braces[0]}${indentation}  ${output.join(`,${indentation}  `)}${indentation}${braces[1]}`;
}

function groupArrayElements(ctx, output, value) {
  let totalLength = 0;
  let maxLength = 0;
  let i = 0;
  let outputLength = output.length;
  if (ctx.extra > 0) outputLength -= 1; // "... more items"
  const separatorSpace = 2;
  const dataLen = new Array(outputLength);
  for (; i < outputLength; i++) {
    const len = output[i].length;
    dataLen[i] = len;
    totalLength += len + separatorSpace;
    if (maxLength < len) maxLength = len;
  }
  const actualMax = maxLength + separatorSpace;
  if (actualMax * 3 + ctx.indentationLvl < BREAK && (totalLength / actualMax > 5 || maxLength <= 6)) {
    const approxCharHeights = 2.5;
    const averageBias = Math.sqrt(actualMax - totalLength / output.length);
    const biasedMax = Math.max(actualMax - 3 - averageBias, 1);
    const columns = Math.min(
      Math.round(Math.sqrt(approxCharHeights * biasedMax * outputLength) / biasedMax),
      Math.floor((BREAK - ctx.indentationLvl) / actualMax),
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
    const numeric = value !== undefined && value.every?.((v) => typeof v === "number" || typeof v === "bigint");
    for (let r = 0; r < outputLength; r += columns) {
      const max = Math.min(r + columns, outputLength);
      let str = "";
      let j = r;
      for (; j < max - 1; j++) {
        const padding = maxLineLength[j - r] + output[j].length - dataLen[j];
        str += numeric ? `${output[j]}, `.padStart(padding, " ") : `${output[j]}, `.padEnd(padding, " ");
      }
      if (numeric) {
        const padding = maxLineLength[j - r] + output[j].length - dataLen[j] - separatorSpace;
        str += output[j].padStart(padding, " ");
      } else str += output[j];
      tmp.push(str);
    }
    if (ctx.extra > 0) tmp.push(output[outputLength]);
    output = tmp;
  }
  return output;
}

function formatPrimitive(value, ctx) {
  if (typeof value === "string") {
    let trailer = "";
    if (value.length > MAX_STRING) {
      trailer = `... ${value.length - MAX_STRING} more character${value.length - MAX_STRING > 1 ? "s" : ""}`;
      value = value.slice(0, MAX_STRING);
    }
    if (value.length > 16 && value.length > BREAK - ctx.indentationLvl - 4 && value.includes("\n")) {
      return value
        .split(/(?<=\n)/)
        .map((line) => strEscape(line))
        .join(` +\n${" ".repeat(ctx.indentationLvl + 2)}`) + trailer;
    }
    return strEscape(value) + trailer;
  }
  if (typeof value === "number") return Object.is(value, -0) ? "-0" : `${value}`;
  if (typeof value === "bigint") return `${value}n`;
  if (typeof value === "boolean") return `${value}`;
  if (typeof value === "undefined") return "undefined";
  return value.toString(); // symbol
}

function isError(v) {
  return v instanceof Error || Object.prototype.toString.call(v) === "[object Error]";
}

function formatError(err, ctx, keys) {
  const name = err.name != null ? String(err.name) : "Error";
  let stack = typeof err.stack === "string" && err.stack ? err.stack : Error.prototype.toString.call(err);
  if (ctx.cleanStack) stack = ctx.cleanStack(stack);
  // A plain "Error: msg" stack with no frames prints as [Error: msg] in Node.
  const lines = stack.split("\n");
  if (!lines.slice(1).some((l) => /^\s+at\s/.test(l))) stack = `[${stack}]`;
  if (err.cause !== undefined && !keys.includes("cause")) keys.push("cause");
  void name;
  return stack;
}

function formatValue(ctx, value, recurseTimes) {
  if (typeof value !== "object" && typeof value !== "function") return formatPrimitive(value, ctx);
  if (value === null) return "null";
  if (ctx.seen.includes(value)) {
    let index = 1;
    if (ctx.circular === undefined) {
      ctx.circular = new Map();
      ctx.circular.set(value, index);
    } else {
      index = ctx.circular.get(value);
      if (index === undefined) {
        index = ctx.circular.size + 1;
        ctx.circular.set(value, index);
      }
    }
    return `[Circular *${index}]`;
  }
  if (typeof value[Symbol.for("nodejs.util.inspect.custom")] === "function" && ctx.customInspect !== false) {
    const out = value[Symbol.for("nodejs.util.inspect.custom")](DEPTH - recurseTimes, { depth: DEPTH }, inspect);
    if (out !== value) return typeof out === "string" ? out : formatValue(ctx, out, recurseTimes);
  }
  return formatRaw(ctx, value, recurseTimes);
}

function getKeys(value, showHidden) {
  const keys = Object.keys(value);
  const symbols = Object.getOwnPropertySymbols(value).filter((s) => Object.prototype.propertyIsEnumerable.call(value, s));
  void showHidden;
  return [...keys, ...symbols];
}

function formatProperty(ctx, value, recurseTimes, key, type) {
  let name;
  let str;
  const desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key], enumerable: true };
  if (desc.value !== undefined) {
    const diff = ctx.compact !== true || type !== "object" ? 2 : 3;
    ctx.indentationLvl += diff;
    str = formatValue(ctx, desc.value, recurseTimes);
    if (diff === 3 && ctx.breakLength < str.length) str = str.replace(/\n/g, `\n${" ".repeat(ctx.indentationLvl)}`);
    ctx.indentationLvl -= diff;
  } else if (desc.get !== undefined) {
    str = desc.set !== undefined ? "[Getter/Setter]" : "[Getter]";
  } else if (desc.set !== undefined) {
    str = "[Setter]";
  } else str = "undefined";
  if (type === "arrayItem") return str;
  name = formatKey(key);
  return `${name}: ${str}`;
}

function formatRaw(ctx, value, recurseTimes) {
  let keys;
  const ctor = constructorName(value);
  let tag = value[Symbol.toStringTag];
  if (typeof tag !== "string" || (tag !== "" && tag === ctor)) tag = "";
  let base = "";
  let formatter = () => [];
  let braces;
  let noIterator = true;
  let extrasType = "object";
  let i = 0;
  ctx.extra = 0;

  if (Array.isArray(value)) {
    keys = getKeys(value).filter((k) => typeof k === "symbol" || !/^(0|[1-9][0-9]*)$/.test(k));
    const prefix = ctor !== "Array" || tag !== "" ? getPrefix(ctor, tag, "Array", `(${value.length})`) : "";
    braces = [`${prefix}[`, "]"];
    if (value.length === 0 && keys.length === 0) return `${braces[0]}]`;
    extrasType = "array";
    formatter = (c, v, r) => formatArray(c, v, r);
    noIterator = false;
  } else if (value instanceof Map) {
    keys = getKeys(value);
    const prefix = getPrefix(ctor, tag, "Map", `(${value.size})`);
    formatter = (c, v, r) => [...v].map(([k, val]) => `${formatValue(c, k, r)} => ${formatValue(c, val, r)}`);
    if (value.size === 0 && keys.length === 0) return `${prefix}{}`;
    braces = [`${prefix}{`, "}"];
    noIterator = false;
  } else if (value instanceof Set) {
    keys = getKeys(value);
    const prefix = getPrefix(ctor, tag, "Set", `(${value.size})`);
    formatter = (c, v, r) => [...v].map((x) => formatValue(c, x, r));
    if (value.size === 0 && keys.length === 0) return `${prefix}{}`;
    braces = [`${prefix}{`, "}"];
    noIterator = false;
  } else if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    const isBuffer = ctx.isBuffer?.(value);
    if (isBuffer) {
      const max = 50;
      const bytes = Array.from(value.subarray(0, max), (b) => b.toString(16).padStart(2, "0")).join(" ");
      const remaining = value.length - max;
      return `<${ctor || "Buffer"} ${bytes}${remaining > 0 ? ` ... ${remaining} more byte${remaining > 1 ? "s" : ""}` : ""}>`.replace(/<Buffer >/, "<Buffer >");
    }
    keys = getKeys(value).filter((k) => typeof k === "symbol" || !/^(0|[1-9][0-9]*)$/.test(k));
    const size = value.length;
    const fallback = tag || ctor;
    braces = [`${getPrefix(ctor, tag, fallback, `(${size})`)}[`, "]"];
    if (value.length === 0 && keys.length === 0) return `${braces[0]}]`;
    formatter = (c, v) => Array.from(v.subarray(0, MAX_ARRAY), (x) => formatPrimitive(typeof x === "bigint" ? x : Number(x), c)).concat(v.length > MAX_ARRAY ? [`... ${v.length - MAX_ARRAY} more item${v.length - MAX_ARRAY > 1 ? "s" : ""}`] : []);
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
      base = formatError(value, ctx, keys);
      if (keys.length === 0) return base;
    } else if (value instanceof Promise) {
      braces[0] = `${getPrefix(ctor, tag, "Promise")}{`;
      formatter = () => ["<pending>"];
    } else if (value instanceof WeakSet || value instanceof WeakMap) {
      braces[0] = `${getPrefix(ctor, tag, value instanceof WeakSet ? "WeakSet" : "WeakMap")}{`;
      formatter = () => ["<items unknown>"];
    } else if (value instanceof ArrayBuffer) {
      const bytes = Array.from(new Uint8Array(value).subarray(0, 50), (b) => b.toString(16).padStart(2, "0")).join(" ");
      braces[0] = `${getPrefix(ctor, tag, "ArrayBuffer")}{`;
      formatter = () => [`[Uint8Contents]: <${bytes}>`, `byteLength: ${value.byteLength}`];
    } else if (value instanceof Number || value instanceof String || value instanceof Boolean) {
      const type = value instanceof Number ? "Number" : value instanceof String ? "String" : "Boolean";
      base = `[${type}: ${formatPrimitive(value.valueOf(), ctx)}]`;
      if (value instanceof String) keys = keys.filter((k) => !/^(0|[1-9][0-9]*)$/.test(k) && k !== "length");
      if (keys.length === 0) return base;
    } else if (typeof URL !== "undefined" && value instanceof URL) {
      const props = ["href", "origin", "protocol", "username", "password", "host", "hostname", "port", "pathname", "search", "searchParams", "hash"];
      braces[0] = "URL {";
      formatter = (c, v, r) =>
        props.map((p) => `${p}: ${p === "searchParams" ? `URLSearchParams {${[...v.searchParams].length ? ` ${[...v.searchParams].map(([k, x]) => `${strEscape(k)} => ${strEscape(x)}`).join(", ")} ` : ""}}` : formatValue(c, v[p], r)}`);
    } else {
      if (keys.length === 0) return `${getPrefix(ctor, tag, "Object")}{}`;
      braces[0] = `${getPrefix(ctor, tag, "Object")}{`;
    }
  }

  if (recurseTimes > ctx.depth) {
    let name = getPrefix(ctor, tag, "Object").slice(0, -1);
    if (ctor !== null) name = `[${name}]`;
    if (Array.isArray(value)) return "[Array]";
    return name;
  }
  recurseTimes += 1;
  ctx.seen.push(value);
  ctx.currentDepth = recurseTimes;
  let output;
  try {
    output = formatter(ctx, value, recurseTimes);
    for (i = 0; i < keys.length; i++) output.push(formatProperty(ctx, value, recurseTimes, keys[i], extrasType === "array" ? "arrayKey" : "object"));
  } finally {
    ctx.seen.pop();
  }
  if (ctx.circular !== undefined) {
    const index = ctx.circular.get(value);
    if (index !== undefined) {
      const reference = `<ref *${index}>`;
      if (base === "") braces[0] = `${reference} ${braces[0]}`;
      else base = `${reference} ${base}`;
    }
  }
  const res = reduceToSingleString(ctx, output, base, braces, extrasType, recurseTimes, value);
  return res;
}

function getFunctionBase(value, ctor, tag) {
  const src = Function.prototype.toString.call(value);
  if (/^class[\s{]/.test(src)) {
    let base = `[class ${value.name || "(anonymous)"}`;
    const superName = Object.getPrototypeOf(value)?.name;
    if (superName) base += ` extends ${superName}`;
    return `${base}]`;
  }
  let type = "Function";
  if (ctor === "AsyncFunction") type = "AsyncFunction";
  else if (ctor === "GeneratorFunction") type = "GeneratorFunction";
  else if (ctor === "AsyncGeneratorFunction") type = "AsyncGeneratorFunction";
  let base = `[${type}`;
  if (value.name === "") base += " (anonymous)";
  else base += `: ${value.name}`;
  base += "]";
  if (ctor !== type && ctor !== null) base += ` ${ctor}`;
  if (tag !== "" && ctor !== tag) base += ` [${tag}]`;
  return base;
}

function formatArray(ctx, value, recurseTimes) {
  const len = value.length;
  const outLen = Math.min(MAX_ARRAY, len);
  const remaining = len - outLen;
  const output = [];
  let holes = 0;
  for (let i = 0; i < outLen; i++) {
    if (!Object.prototype.hasOwnProperty.call(value, i)) {
      holes += 1;
      continue;
    }
    if (holes) {
      output.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
      holes = 0;
    }
    output.push(formatProperty(ctx, value, recurseTimes, i, "arrayItem"));
  }
  if (holes) output.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
  if (remaining > 0) {
    output.push(`... ${remaining} more item${remaining > 1 ? "s" : ""}`);
    ctx.extra = 1;
  }
  return output;
}

export function inspect(value, opts = {}) {
  const ctx = {
    seen: [],
    indentationLvl: 0,
    currentDepth: 0,
    breakLength: BREAK,
    compact: COMPACT,
    isBuffer: inspect.isBuffer,
    cleanStack: inspect.cleanStack,
    customInspect: opts.customInspect,
    depth: opts.depth === undefined ? DEPTH : opts.depth === null ? Infinity : opts.depth,
  };
  return formatValue(ctx, value, 0);
}
inspect.custom = Symbol.for("nodejs.util.inspect.custom");
inspect.defaultOptions = { depth: DEPTH, breakLength: BREAK, compact: COMPACT };
/** Set by the runtime: recognise Buffers, and tidy stack traces. */
inspect.isBuffer = null;
inspect.cleanStack = null;

/** util.format: printf-style %s %d %i %f %j %o %O %c %%, then the rest inspected. */
export function format(...args) {
  const first = args[0];
  let a = 0;
  let str = "";
  if (typeof first === "string") {
    if (args.length === 1) return first;
    let lastPos = 0;
    a = 1;
    for (let i = 0; i < first.length - 1; i++) {
      if (first.charCodeAt(i) !== 37) continue;
      const c = first[i + 1];
      if (a !== args.length) {
        let temp;
        switch (c) {
          case "s": {
            const x = args[a];
            temp =
              typeof x === "number" ? (Object.is(x, -0) ? "-0" : `${x}`)
                : typeof x === "bigint" ? `${x}n`
                  : typeof x !== "object" || x === null ? String(x)
                    : isError(x) ? (x.stack || String(x))
                      : inspect(x, { depth: 0 });
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
            const x = args[a];
            temp = typeof x === "bigint" ? `${x}n` : typeof x === "symbol" ? "NaN" : `${Number(x)}`;
            break;
          }
          case "O":
          case "o":
            temp = inspect(args[a]);
            break;
          case "i": {
            const x = args[a];
            temp = typeof x === "bigint" ? `${x}n` : typeof x === "symbol" ? "NaN" : `${parseInt(x)}`;
            break;
          }
          case "f": {
            const x = args[a];
            temp = typeof x === "symbol" ? "NaN" : `${parseFloat(x)}`;
            break;
          }
          case "c":
            temp = "";
            break;
          case "%":
            str += first.slice(lastPos, i);
            lastPos = i + 1;
            continue;
          default:
            continue;
        }
        if (lastPos !== i) str += first.slice(lastPos, i);
        str += temp;
        lastPos = i + 2;
        i += 1;
        a += 1;
      } else if (c === "%") {
        str += first.slice(lastPos, i);
        lastPos = i + 1;
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
