import {
  Buffer,
  __commonJS,
  __esm,
  __export,
  __name,
  __toCommonJS,
  __toESM,
  buffer_exports,
  console,
  ctx,
  events_exports,
  init_buffer,
  init_context,
  init_events,
  init_globals,
  init_process,
  process,
  process_exports
} from "./node-runtime-chunk-WY7WQXFC.js";

// src/academy/node/runtime/gen/buffer.cjs
var require_buffer = __commonJS({
  "src/academy/node/runtime/gen/buffer.cjs"(exports, module) {
    init_globals();
    var m = (init_buffer(), __toCommonJS(buffer_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "scripts/node-lab/node_modules/safe-buffer/index.js"(exports, module) {
    init_globals();
    var buffer = require_buffer();
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    __name(copyProps, "copyProps");
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    __name(SafeBuffer, "SafeBuffer");
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// scripts/node-lab/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "scripts/node-lab/node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    init_globals();
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    __name(_normalizeEncoding, "_normalizeEncoding");
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    __name(normalizeEncoding, "normalizeEncoding");
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    __name(StringDecoder, "StringDecoder");
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    __name(utf8CheckByte, "utf8CheckByte");
    function utf8CheckIncomplete(self, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    __name(utf8CheckIncomplete, "utf8CheckIncomplete");
    function utf8CheckExtraBytes(self, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self.lastNeed = 0;
        return "\uFFFD";
      }
      if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self.lastNeed = 1;
          return "\uFFFD";
        }
        if (self.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    __name(utf8CheckExtraBytes, "utf8CheckExtraBytes");
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    __name(utf8FillLast, "utf8FillLast");
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    __name(utf8Text, "utf8Text");
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    __name(utf8End, "utf8End");
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    __name(utf16Text, "utf16Text");
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    __name(utf16End, "utf16End");
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    __name(base64Text, "base64Text");
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    __name(base64End, "base64End");
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    __name(simpleWrite, "simpleWrite");
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
    __name(simpleEnd, "simpleEnd");
  }
});

// empty:stream
var require_stream = __commonJS({
  "empty:stream"(exports, module) {
    init_globals();
    module.exports = {};
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/ours/primordials.js
var require_primordials = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/ours/primordials.js"(exports, module) {
    "use strict";
    init_globals();
    var AggregateError = class extends Error {
      static {
        __name(this, "AggregateError");
      }
      constructor(errors) {
        if (!Array.isArray(errors)) {
          throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
        }
        let message = "";
        for (let i = 0; i < errors.length; i++) {
          message += `    ${errors[i].stack}
`;
        }
        super(message);
        this.name = "AggregateError";
        this.errors = errors;
      }
    };
    module.exports = {
      AggregateError,
      ArrayIsArray(self) {
        return Array.isArray(self);
      },
      ArrayPrototypeIncludes(self, el) {
        return self.includes(el);
      },
      ArrayPrototypeIndexOf(self, el) {
        return self.indexOf(el);
      },
      ArrayPrototypeJoin(self, sep2) {
        return self.join(sep2);
      },
      ArrayPrototypeMap(self, fn) {
        return self.map(fn);
      },
      ArrayPrototypePop(self, el) {
        return self.pop(el);
      },
      ArrayPrototypePush(self, el) {
        return self.push(el);
      },
      ArrayPrototypeSlice(self, start, end) {
        return self.slice(start, end);
      },
      Error,
      FunctionPrototypeCall(fn, thisArgs, ...args) {
        return fn.call(thisArgs, ...args);
      },
      FunctionPrototypeSymbolHasInstance(self, instance) {
        return Function.prototype[Symbol.hasInstance].call(self, instance);
      },
      MathFloor: Math.floor,
      Number,
      NumberIsInteger: Number.isInteger,
      NumberIsNaN: Number.isNaN,
      NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
      NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
      NumberParseInt: Number.parseInt,
      ObjectDefineProperties(self, props) {
        return Object.defineProperties(self, props);
      },
      ObjectDefineProperty(self, name, prop) {
        return Object.defineProperty(self, name, prop);
      },
      ObjectGetOwnPropertyDescriptor(self, name) {
        return Object.getOwnPropertyDescriptor(self, name);
      },
      ObjectKeys(obj) {
        return Object.keys(obj);
      },
      ObjectSetPrototypeOf(target, proto) {
        return Object.setPrototypeOf(target, proto);
      },
      Promise,
      PromisePrototypeCatch(self, fn) {
        return self.catch(fn);
      },
      PromisePrototypeThen(self, thenFn, catchFn) {
        return self.then(thenFn, catchFn);
      },
      PromiseReject(err) {
        return Promise.reject(err);
      },
      PromiseResolve(val) {
        return Promise.resolve(val);
      },
      ReflectApply: Reflect.apply,
      RegExpPrototypeTest(self, value) {
        return self.test(value);
      },
      SafeSet: Set,
      String,
      StringPrototypeSlice(self, start, end) {
        return self.slice(start, end);
      },
      StringPrototypeToLowerCase(self) {
        return self.toLowerCase();
      },
      StringPrototypeToUpperCase(self) {
        return self.toUpperCase();
      },
      StringPrototypeTrim(self) {
        return self.trim();
      },
      Symbol,
      SymbolFor: Symbol.for,
      SymbolAsyncIterator: Symbol.asyncIterator,
      SymbolHasInstance: Symbol.hasInstance,
      SymbolIterator: Symbol.iterator,
      SymbolDispose: Symbol.dispose || /* @__PURE__ */ Symbol("Symbol.dispose"),
      SymbolAsyncDispose: Symbol.asyncDispose || /* @__PURE__ */ Symbol("Symbol.asyncDispose"),
      TypedArrayPrototypeSet(self, buf, len) {
        return self.set(buf, len);
      },
      Boolean,
      Uint8Array
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/ours/util/inspect.js
var require_inspect = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/ours/util/inspect.js"(exports, module) {
    "use strict";
    init_globals();
    module.exports = {
      format(format2, ...args) {
        return format2.replace(/%([sdifj])/g, function(...[_unused, type]) {
          const replacement = args.shift();
          if (type === "f") {
            return replacement.toFixed(6);
          } else if (type === "j") {
            return JSON.stringify(replacement);
          } else if (type === "s" && typeof replacement === "object") {
            const ctor = replacement.constructor !== Object ? replacement.constructor.name : "";
            return `${ctor} {}`.trim();
          } else {
            return replacement.toString();
          }
        });
      },
      inspect(value) {
        switch (typeof value) {
          case "string":
            if (value.includes("'")) {
              if (!value.includes('"')) {
                return `"${value}"`;
              } else if (!value.includes("`") && !value.includes("${")) {
                return `\`${value}\``;
              }
            }
            return `'${value}'`;
          case "number":
            if (isNaN(value)) {
              return "NaN";
            } else if (Object.is(value, -0)) {
              return String(value);
            }
            return value;
          case "bigint":
            return `${String(value)}n`;
          case "boolean":
          case "undefined":
            return String(value);
          case "object":
            return "{}";
        }
      }
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/ours/errors.js
var require_errors = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/ours/errors.js"(exports, module) {
    "use strict";
    init_globals();
    var { format: format2, inspect } = require_inspect();
    var { AggregateError: CustomAggregateError } = require_primordials();
    var AggregateError = globalThis.AggregateError || CustomAggregateError;
    var kIsNodeError = /* @__PURE__ */ Symbol("kIsNodeError");
    var kTypes = [
      "string",
      "function",
      "number",
      "object",
      // Accept 'Function' and 'Object' as alternative to the lower cased version.
      "Function",
      "Object",
      "boolean",
      "bigint",
      "symbol"
    ];
    var classRegExp = /^([A-Z][a-z0-9]*)+$/;
    var nodeInternalPrefix = "__node_internal_";
    var codes = {};
    function assert(value, message) {
      if (!value) {
        throw new codes.ERR_INTERNAL_ASSERTION(message);
      }
    }
    __name(assert, "assert");
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    __name(addNumericalSeparator, "addNumericalSeparator");
    function getMessage(key, msg, args) {
      if (typeof msg === "function") {
        assert(
          msg.length <= args.length,
          // Default options do not count.
          `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
        );
        return msg(...args);
      }
      const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
      assert(
        expectedLength === args.length,
        `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
      );
      if (args.length === 0) {
        return msg;
      }
      return format2(msg, ...args);
    }
    __name(getMessage, "getMessage");
    function E(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      class NodeError extends Base {
        static {
          __name(this, "NodeError");
        }
        constructor(...args) {
          super(getMessage(code, message, args));
        }
        toString() {
          return `${this.name} [${code}]: ${this.message}`;
        }
      }
      Object.defineProperties(NodeError.prototype, {
        name: {
          value: Base.name,
          writable: true,
          enumerable: false,
          configurable: true
        },
        toString: {
          value() {
            return `${this.name} [${code}]: ${this.message}`;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      NodeError.prototype.code = code;
      NodeError.prototype[kIsNodeError] = true;
      codes[code] = NodeError;
    }
    __name(E, "E");
    function hideStackFrames(fn) {
      const hidden = nodeInternalPrefix + fn.name;
      Object.defineProperty(fn, "name", {
        value: hidden
      });
      return fn;
    }
    __name(hideStackFrames, "hideStackFrames");
    function aggregateTwoErrors(innerError, outerError) {
      if (innerError && outerError && innerError !== outerError) {
        if (Array.isArray(outerError.errors)) {
          outerError.errors.push(innerError);
          return outerError;
        }
        const err = new AggregateError([outerError, innerError], outerError.message);
        err.code = outerError.code;
        return err;
      }
      return innerError || outerError;
    }
    __name(aggregateTwoErrors, "aggregateTwoErrors");
    var AbortError = class extends Error {
      static {
        __name(this, "AbortError");
      }
      constructor(message = "The operation was aborted", options = void 0) {
        if (options !== void 0 && typeof options !== "object") {
          throw new codes.ERR_INVALID_ARG_TYPE("options", "Object", options);
        }
        super(message, options);
        this.code = "ABORT_ERR";
        this.name = "AbortError";
      }
    };
    E("ERR_ASSERTION", "%s", Error);
    E(
      "ERR_INVALID_ARG_TYPE",
      (name, expected, actual) => {
        assert(typeof name === "string", "'name' must be a string");
        if (!Array.isArray(expected)) {
          expected = [expected];
        }
        let msg = "The ";
        if (name.endsWith(" argument")) {
          msg += `${name} `;
        } else {
          msg += `"${name}" ${name.includes(".") ? "property" : "argument"} `;
        }
        msg += "must be ";
        const types = [];
        const instances = [];
        const other = [];
        for (const value of expected) {
          assert(typeof value === "string", "All expected entries have to be of type string");
          if (kTypes.includes(value)) {
            types.push(value.toLowerCase());
          } else if (classRegExp.test(value)) {
            instances.push(value);
          } else {
            assert(value !== "object", 'The value "object" should be written as "Object"');
            other.push(value);
          }
        }
        if (instances.length > 0) {
          const pos = types.indexOf("object");
          if (pos !== -1) {
            types.splice(types, pos, 1);
            instances.push("Object");
          }
        }
        if (types.length > 0) {
          switch (types.length) {
            case 1:
              msg += `of type ${types[0]}`;
              break;
            case 2:
              msg += `one of type ${types[0]} or ${types[1]}`;
              break;
            default: {
              const last = types.pop();
              msg += `one of type ${types.join(", ")}, or ${last}`;
            }
          }
          if (instances.length > 0 || other.length > 0) {
            msg += " or ";
          }
        }
        if (instances.length > 0) {
          switch (instances.length) {
            case 1:
              msg += `an instance of ${instances[0]}`;
              break;
            case 2:
              msg += `an instance of ${instances[0]} or ${instances[1]}`;
              break;
            default: {
              const last = instances.pop();
              msg += `an instance of ${instances.join(", ")}, or ${last}`;
            }
          }
          if (other.length > 0) {
            msg += " or ";
          }
        }
        switch (other.length) {
          case 0:
            break;
          case 1:
            if (other[0].toLowerCase() !== other[0]) {
              msg += "an ";
            }
            msg += `${other[0]}`;
            break;
          case 2:
            msg += `one of ${other[0]} or ${other[1]}`;
            break;
          default: {
            const last = other.pop();
            msg += `one of ${other.join(", ")}, or ${last}`;
          }
        }
        if (actual == null) {
          msg += `. Received ${actual}`;
        } else if (typeof actual === "function" && actual.name) {
          msg += `. Received function ${actual.name}`;
        } else if (typeof actual === "object") {
          var _actual$constructor;
          if ((_actual$constructor = actual.constructor) !== null && _actual$constructor !== void 0 && _actual$constructor.name) {
            msg += `. Received an instance of ${actual.constructor.name}`;
          } else {
            const inspected = inspect(actual, {
              depth: -1
            });
            msg += `. Received ${inspected}`;
          }
        } else {
          let inspected = inspect(actual, {
            colors: false
          });
          if (inspected.length > 25) {
            inspected = `${inspected.slice(0, 25)}...`;
          }
          msg += `. Received type ${typeof actual} (${inspected})`;
        }
        return msg;
      },
      TypeError
    );
    E(
      "ERR_INVALID_ARG_VALUE",
      (name, value, reason = "is invalid") => {
        let inspected = inspect(value);
        if (inspected.length > 128) {
          inspected = inspected.slice(0, 128) + "...";
        }
        const type = name.includes(".") ? "property" : "argument";
        return `The ${type} '${name}' ${reason}. Received ${inspected}`;
      },
      TypeError
    );
    E(
      "ERR_INVALID_RETURN_VALUE",
      (input, name, value) => {
        var _value$constructor;
        const type = value !== null && value !== void 0 && (_value$constructor = value.constructor) !== null && _value$constructor !== void 0 && _value$constructor.name ? `instance of ${value.constructor.name}` : `type ${typeof value}`;
        return `Expected ${input} to be returned from the "${name}" function but got ${type}.`;
      },
      TypeError
    );
    E(
      "ERR_MISSING_ARGS",
      (...args) => {
        assert(args.length > 0, "At least one arg needs to be specified");
        let msg;
        const len = args.length;
        args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(" or ");
        switch (len) {
          case 1:
            msg += `The ${args[0]} argument`;
            break;
          case 2:
            msg += `The ${args[0]} and ${args[1]} arguments`;
            break;
          default:
            {
              const last = args.pop();
              msg += `The ${args.join(", ")}, and ${last} arguments`;
            }
            break;
        }
        return `${msg} must be specified`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      (str, range, input) => {
        assert(range, 'Missing "range" argument');
        let received;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          const limit = BigInt(2) ** BigInt(32);
          if (input > limit || input < -limit) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        } else {
          received = inspect(input);
        }
        return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`;
      },
      RangeError
    );
    E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
    E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
    E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
    E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
    E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
    E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
    E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
    E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
    E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
    E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
    module.exports = {
      AbortError,
      aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
      hideStackFrames,
      codes
    };
  }
});

// scripts/node-lab/node_modules/event-target-shim/dist/event-target-shim.js
var require_event_target_shim = __commonJS({
  "scripts/node-lab/node_modules/event-target-shim/dist/event-target-shim.js"(exports, module) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    var privateData = /* @__PURE__ */ new WeakMap();
    var wrappers = /* @__PURE__ */ new WeakMap();
    function pd(event) {
      const retv = privateData.get(event);
      console.assert(
        retv != null,
        "'this' is expected an Event object, but got",
        event
      );
      return retv;
    }
    __name(pd, "pd");
    function setCancelFlag(data) {
      if (data.passiveListener != null) {
        if (typeof console !== "undefined" && typeof console.error === "function") {
          console.error(
            "Unable to preventDefault inside passive event listener invocation.",
            data.passiveListener
          );
        }
        return;
      }
      if (!data.event.cancelable) {
        return;
      }
      data.canceled = true;
      if (typeof data.event.preventDefault === "function") {
        data.event.preventDefault();
      }
    }
    __name(setCancelFlag, "setCancelFlag");
    function Event(eventTarget, event) {
      privateData.set(this, {
        eventTarget,
        event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        immediateStopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now()
      });
      Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });
      const keys = Object.keys(event);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in this)) {
          Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
      }
    }
    __name(Event, "Event");
    Event.prototype = {
      /**
       * The type of this event.
       * @type {string}
       */
      get type() {
        return pd(this).event.type;
      },
      /**
       * The target of this event.
       * @type {EventTarget}
       */
      get target() {
        return pd(this).eventTarget;
      },
      /**
       * The target of this event.
       * @type {EventTarget}
       */
      get currentTarget() {
        return pd(this).currentTarget;
      },
      /**
       * @returns {EventTarget[]} The composed path of this event.
       */
      composedPath() {
        const currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
          return [];
        }
        return [currentTarget];
      },
      /**
       * Constant of NONE.
       * @type {number}
       */
      get NONE() {
        return 0;
      },
      /**
       * Constant of CAPTURING_PHASE.
       * @type {number}
       */
      get CAPTURING_PHASE() {
        return 1;
      },
      /**
       * Constant of AT_TARGET.
       * @type {number}
       */
      get AT_TARGET() {
        return 2;
      },
      /**
       * Constant of BUBBLING_PHASE.
       * @type {number}
       */
      get BUBBLING_PHASE() {
        return 3;
      },
      /**
       * The target of this event.
       * @type {number}
       */
      get eventPhase() {
        return pd(this).eventPhase;
      },
      /**
       * Stop event bubbling.
       * @returns {void}
       */
      stopPropagation() {
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.stopPropagation === "function") {
          data.event.stopPropagation();
        }
      },
      /**
       * Stop event bubbling.
       * @returns {void}
       */
      stopImmediatePropagation() {
        const data = pd(this);
        data.stopped = true;
        data.immediateStopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
          data.event.stopImmediatePropagation();
        }
      },
      /**
       * The flag to be bubbling.
       * @type {boolean}
       */
      get bubbles() {
        return Boolean(pd(this).event.bubbles);
      },
      /**
       * The flag to be cancelable.
       * @type {boolean}
       */
      get cancelable() {
        return Boolean(pd(this).event.cancelable);
      },
      /**
       * Cancel this event.
       * @returns {void}
       */
      preventDefault() {
        setCancelFlag(pd(this));
      },
      /**
       * The flag to indicate cancellation state.
       * @type {boolean}
       */
      get defaultPrevented() {
        return pd(this).canceled;
      },
      /**
       * The flag to be composed.
       * @type {boolean}
       */
      get composed() {
        return Boolean(pd(this).event.composed);
      },
      /**
       * The unix time of this event.
       * @type {number}
       */
      get timeStamp() {
        return pd(this).timeStamp;
      },
      /**
       * The target of this event.
       * @type {EventTarget}
       * @deprecated
       */
      get srcElement() {
        return pd(this).eventTarget;
      },
      /**
       * The flag to stop event bubbling.
       * @type {boolean}
       * @deprecated
       */
      get cancelBubble() {
        return pd(this).stopped;
      },
      set cancelBubble(value) {
        if (!value) {
          return;
        }
        const data = pd(this);
        data.stopped = true;
        if (typeof data.event.cancelBubble === "boolean") {
          data.event.cancelBubble = true;
        }
      },
      /**
       * The flag to indicate cancellation state.
       * @type {boolean}
       * @deprecated
       */
      get returnValue() {
        return !pd(this).canceled;
      },
      set returnValue(value) {
        if (!value) {
          setCancelFlag(pd(this));
        }
      },
      /**
       * Initialize this event object. But do nothing under event dispatching.
       * @param {string} type The event type.
       * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
       * @param {boolean} [cancelable=false] The flag to be possible to cancel.
       * @deprecated
       */
      initEvent() {
      }
    };
    Object.defineProperty(Event.prototype, "constructor", {
      value: Event,
      configurable: true,
      writable: true
    });
    if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
      Object.setPrototypeOf(Event.prototype, window.Event.prototype);
      wrappers.set(window.Event.prototype, Event);
    }
    function defineRedirectDescriptor(key) {
      return {
        get() {
          return pd(this).event[key];
        },
        set(value) {
          pd(this).event[key] = value;
        },
        configurable: true,
        enumerable: true
      };
    }
    __name(defineRedirectDescriptor, "defineRedirectDescriptor");
    function defineCallDescriptor(key) {
      return {
        value() {
          const event = pd(this).event;
          return event[key].apply(event, arguments);
        },
        configurable: true,
        enumerable: true
      };
    }
    __name(defineCallDescriptor, "defineCallDescriptor");
    function defineWrapper(BaseEvent, proto) {
      const keys = Object.keys(proto);
      if (keys.length === 0) {
        return BaseEvent;
      }
      function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
      }
      __name(CustomEvent, "CustomEvent");
      CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: { value: CustomEvent, configurable: true, writable: true }
      });
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in BaseEvent.prototype)) {
          const descriptor = Object.getOwnPropertyDescriptor(proto, key);
          const isFunc = typeof descriptor.value === "function";
          Object.defineProperty(
            CustomEvent.prototype,
            key,
            isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key)
          );
        }
      }
      return CustomEvent;
    }
    __name(defineWrapper, "defineWrapper");
    function getWrapper(proto) {
      if (proto == null || proto === Object.prototype) {
        return Event;
      }
      let wrapper = wrappers.get(proto);
      if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
      }
      return wrapper;
    }
    __name(getWrapper, "getWrapper");
    function wrapEvent(eventTarget, event) {
      const Wrapper = getWrapper(Object.getPrototypeOf(event));
      return new Wrapper(eventTarget, event);
    }
    __name(wrapEvent, "wrapEvent");
    function isStopped(event) {
      return pd(event).immediateStopped;
    }
    __name(isStopped, "isStopped");
    function setEventPhase(event, eventPhase) {
      pd(event).eventPhase = eventPhase;
    }
    __name(setEventPhase, "setEventPhase");
    function setCurrentTarget(event, currentTarget) {
      pd(event).currentTarget = currentTarget;
    }
    __name(setCurrentTarget, "setCurrentTarget");
    function setPassiveListener(event, passiveListener) {
      pd(event).passiveListener = passiveListener;
    }
    __name(setPassiveListener, "setPassiveListener");
    var listenersMap = /* @__PURE__ */ new WeakMap();
    var CAPTURE = 1;
    var BUBBLE = 2;
    var ATTRIBUTE = 3;
    function isObject(x) {
      return x !== null && typeof x === "object";
    }
    __name(isObject, "isObject");
    function getListeners(eventTarget) {
      const listeners = listenersMap.get(eventTarget);
      if (listeners == null) {
        throw new TypeError(
          "'this' is expected an EventTarget object, but got another value."
        );
      }
      return listeners;
    }
    __name(getListeners, "getListeners");
    function defineEventAttributeDescriptor(eventName) {
      return {
        get() {
          const listeners = getListeners(this);
          let node = listeners.get(eventName);
          while (node != null) {
            if (node.listenerType === ATTRIBUTE) {
              return node.listener;
            }
            node = node.next;
          }
          return null;
        },
        set(listener) {
          if (typeof listener !== "function" && !isObject(listener)) {
            listener = null;
          }
          const listeners = getListeners(this);
          let prev = null;
          let node = listeners.get(eventName);
          while (node != null) {
            if (node.listenerType === ATTRIBUTE) {
              if (prev !== null) {
                prev.next = node.next;
              } else if (node.next !== null) {
                listeners.set(eventName, node.next);
              } else {
                listeners.delete(eventName);
              }
            } else {
              prev = node;
            }
            node = node.next;
          }
          if (listener !== null) {
            const newNode = {
              listener,
              listenerType: ATTRIBUTE,
              passive: false,
              once: false,
              next: null
            };
            if (prev === null) {
              listeners.set(eventName, newNode);
            } else {
              prev.next = newNode;
            }
          }
        },
        configurable: true,
        enumerable: true
      };
    }
    __name(defineEventAttributeDescriptor, "defineEventAttributeDescriptor");
    function defineEventAttribute(eventTargetPrototype, eventName) {
      Object.defineProperty(
        eventTargetPrototype,
        `on${eventName}`,
        defineEventAttributeDescriptor(eventName)
      );
    }
    __name(defineEventAttribute, "defineEventAttribute");
    function defineCustomEventTarget(eventNames) {
      function CustomEventTarget() {
        EventTarget.call(this);
      }
      __name(CustomEventTarget, "CustomEventTarget");
      CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: {
          value: CustomEventTarget,
          configurable: true,
          writable: true
        }
      });
      for (let i = 0; i < eventNames.length; ++i) {
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
      }
      return CustomEventTarget;
    }
    __name(defineCustomEventTarget, "defineCustomEventTarget");
    function EventTarget() {
      if (this instanceof EventTarget) {
        listenersMap.set(this, /* @__PURE__ */ new Map());
        return;
      }
      if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0]);
      }
      if (arguments.length > 0) {
        const types = new Array(arguments.length);
        for (let i = 0; i < arguments.length; ++i) {
          types[i] = arguments[i];
        }
        return defineCustomEventTarget(types);
      }
      throw new TypeError("Cannot call a class as a function");
    }
    __name(EventTarget, "EventTarget");
    EventTarget.prototype = {
      /**
       * Add a given listener to this event target.
       * @param {string} eventName The event name to add.
       * @param {Function} listener The listener to add.
       * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
       * @returns {void}
       */
      addEventListener(eventName, listener, options) {
        if (listener == null) {
          return;
        }
        if (typeof listener !== "function" && !isObject(listener)) {
          throw new TypeError("'listener' should be a function or an object.");
        }
        const listeners = getListeners(this);
        const optionsIsObj = isObject(options);
        const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        const newNode = {
          listener,
          listenerType,
          passive: optionsIsObj && Boolean(options.passive),
          once: optionsIsObj && Boolean(options.once),
          next: null
        };
        let node = listeners.get(eventName);
        if (node === void 0) {
          listeners.set(eventName, newNode);
          return;
        }
        let prev = null;
        while (node != null) {
          if (node.listener === listener && node.listenerType === listenerType) {
            return;
          }
          prev = node;
          node = node.next;
        }
        prev.next = newNode;
      },
      /**
       * Remove a given listener from this event target.
       * @param {string} eventName The event name to remove.
       * @param {Function} listener The listener to remove.
       * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
       * @returns {void}
       */
      removeEventListener(eventName, listener, options) {
        if (listener == null) {
          return;
        }
        const listeners = getListeners(this);
        const capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        let prev = null;
        let node = listeners.get(eventName);
        while (node != null) {
          if (node.listener === listener && node.listenerType === listenerType) {
            if (prev !== null) {
              prev.next = node.next;
            } else if (node.next !== null) {
              listeners.set(eventName, node.next);
            } else {
              listeners.delete(eventName);
            }
            return;
          }
          prev = node;
          node = node.next;
        }
      },
      /**
       * Dispatch a given event.
       * @param {Event|{type:string}} event The event to dispatch.
       * @returns {boolean} `false` if canceled.
       */
      dispatchEvent(event) {
        if (event == null || typeof event.type !== "string") {
          throw new TypeError('"event.type" should be a string.');
        }
        const listeners = getListeners(this);
        const eventName = event.type;
        let node = listeners.get(eventName);
        if (node == null) {
          return true;
        }
        const wrappedEvent = wrapEvent(this, event);
        let prev = null;
        while (node != null) {
          if (node.once) {
            if (prev !== null) {
              prev.next = node.next;
            } else if (node.next !== null) {
              listeners.set(eventName, node.next);
            } else {
              listeners.delete(eventName);
            }
          } else {
            prev = node;
          }
          setPassiveListener(
            wrappedEvent,
            node.passive ? node.listener : null
          );
          if (typeof node.listener === "function") {
            try {
              node.listener.call(this, wrappedEvent);
            } catch (err) {
              if (typeof console !== "undefined" && typeof console.error === "function") {
                console.error(err);
              }
            }
          } else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
            node.listener.handleEvent(wrappedEvent);
          }
          if (isStopped(wrappedEvent)) {
            break;
          }
          node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);
        return !wrappedEvent.defaultPrevented;
      }
    };
    Object.defineProperty(EventTarget.prototype, "constructor", {
      value: EventTarget,
      configurable: true,
      writable: true
    });
    if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") {
      Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
    }
    exports.defineEventAttribute = defineEventAttribute;
    exports.EventTarget = EventTarget;
    exports.default = EventTarget;
    module.exports = EventTarget;
    module.exports.EventTarget = module.exports["default"] = EventTarget;
    module.exports.defineEventAttribute = defineEventAttribute;
  }
});

// scripts/node-lab/node_modules/abort-controller/dist/abort-controller.js
var require_abort_controller = __commonJS({
  "scripts/node-lab/node_modules/abort-controller/dist/abort-controller.js"(exports, module) {
    "use strict";
    init_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    var eventTargetShim = require_event_target_shim();
    var AbortSignal = class extends eventTargetShim.EventTarget {
      static {
        __name(this, "AbortSignal");
      }
      /**
       * AbortSignal cannot be constructed directly.
       */
      constructor() {
        super();
        throw new TypeError("AbortSignal cannot be constructed directly");
      }
      /**
       * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
       */
      get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
          throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
      }
    };
    eventTargetShim.defineEventAttribute(AbortSignal.prototype, "abort");
    function createAbortSignal() {
      const signal = Object.create(AbortSignal.prototype);
      eventTargetShim.EventTarget.call(signal);
      abortedFlags.set(signal, false);
      return signal;
    }
    __name(createAbortSignal, "createAbortSignal");
    function abortSignal(signal) {
      if (abortedFlags.get(signal) !== false) {
        return;
      }
      abortedFlags.set(signal, true);
      signal.dispatchEvent({ type: "abort" });
    }
    __name(abortSignal, "abortSignal");
    var abortedFlags = /* @__PURE__ */ new WeakMap();
    Object.defineProperties(AbortSignal.prototype, {
      aborted: { enumerable: true }
    });
    if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
      Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal"
      });
    }
    var AbortController = class {
      static {
        __name(this, "AbortController");
      }
      /**
       * Initialize this controller.
       */
      constructor() {
        signals.set(this, createAbortSignal());
      }
      /**
       * Returns the `AbortSignal` object associated with this object.
       */
      get signal() {
        return getSignal(this);
      }
      /**
       * Abort and signal to any observers that the associated activity is to be aborted.
       */
      abort() {
        abortSignal(getSignal(this));
      }
    };
    var signals = /* @__PURE__ */ new WeakMap();
    function getSignal(controller) {
      const signal = signals.get(controller);
      if (signal == null) {
        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
      }
      return signal;
    }
    __name(getSignal, "getSignal");
    Object.defineProperties(AbortController.prototype, {
      signal: { enumerable: true },
      abort: { enumerable: true }
    });
    if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
      Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController"
      });
    }
    exports.AbortController = AbortController;
    exports.AbortSignal = AbortSignal;
    exports.default = AbortController;
    module.exports = AbortController;
    module.exports.AbortController = module.exports["default"] = AbortController;
    module.exports.AbortSignal = AbortSignal;
  }
});

// src/academy/node/runtime/gen/events.cjs
var require_events = __commonJS({
  "src/academy/node/runtime/gen/events.cjs"(exports, module) {
    init_globals();
    var m = (init_events(), __toCommonJS(events_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/ours/util.js
var require_util = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/ours/util.js"(exports, module) {
    "use strict";
    init_globals();
    var bufferModule = require_buffer();
    var { format: format2, inspect } = require_inspect();
    var {
      codes: { ERR_INVALID_ARG_TYPE }
    } = require_errors();
    var { kResistStopPropagation, AggregateError, SymbolDispose } = require_primordials();
    var AbortSignal = globalThis.AbortSignal || require_abort_controller().AbortSignal;
    var AbortController = globalThis.AbortController || require_abort_controller().AbortController;
    var AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    var Blob = globalThis.Blob || bufferModule.Blob;
    var isBlob = typeof Blob !== "undefined" ? /* @__PURE__ */ __name(function isBlob2(b) {
      return b instanceof Blob;
    }, "isBlob") : /* @__PURE__ */ __name(function isBlob2(b) {
      return false;
    }, "isBlob");
    var validateAbortSignal = /* @__PURE__ */ __name((signal, name) => {
      if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    }, "validateAbortSignal");
    var validateFunction = /* @__PURE__ */ __name((value, name) => {
      if (typeof value !== "function") {
        throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
      }
    }, "validateFunction");
    module.exports = {
      AggregateError,
      kEmptyObject: Object.freeze({}),
      once(callback) {
        let called = false;
        return function(...args) {
          if (called) {
            return;
          }
          called = true;
          callback.apply(this, args);
        };
      },
      createDeferredPromise: /* @__PURE__ */ __name(function() {
        let resolve2;
        let reject;
        const promise = new Promise((res, rej) => {
          resolve2 = res;
          reject = rej;
        });
        return {
          promise,
          resolve: resolve2,
          reject
        };
      }, "createDeferredPromise"),
      promisify(fn) {
        return new Promise((resolve2, reject) => {
          fn((err, ...args) => {
            if (err) {
              return reject(err);
            }
            return resolve2(...args);
          });
        });
      },
      debuglog() {
        return function() {
        };
      },
      format: format2,
      inspect,
      types: {
        isAsyncFunction(fn) {
          return fn instanceof AsyncFunction;
        },
        isArrayBufferView(arr) {
          return ArrayBuffer.isView(arr);
        }
      },
      isBlob,
      deprecate(fn, message) {
        return fn;
      },
      addAbortListener: require_events().addAbortListener || /* @__PURE__ */ __name(function addAbortListener(signal, listener) {
        if (signal === void 0) {
          throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", signal);
        }
        validateAbortSignal(signal, "signal");
        validateFunction(listener, "listener");
        let removeEventListener;
        if (signal.aborted) {
          queueMicrotask(() => listener());
        } else {
          signal.addEventListener("abort", listener, {
            __proto__: null,
            once: true,
            [kResistStopPropagation]: true
          });
          removeEventListener = /* @__PURE__ */ __name(() => {
            signal.removeEventListener("abort", listener);
          }, "removeEventListener");
        }
        return {
          __proto__: null,
          [SymbolDispose]() {
            var _removeEventListener;
            (_removeEventListener = removeEventListener) === null || _removeEventListener === void 0 ? void 0 : _removeEventListener();
          }
        };
      }, "addAbortListener"),
      AbortSignalAny: AbortSignal.any || /* @__PURE__ */ __name(function AbortSignalAny(signals) {
        if (signals.length === 1) {
          return signals[0];
        }
        const ac = new AbortController();
        const abort = /* @__PURE__ */ __name(() => ac.abort(), "abort");
        signals.forEach((signal) => {
          validateAbortSignal(signal, "signals");
          signal.addEventListener("abort", abort, {
            once: true
          });
        });
        ac.signal.addEventListener(
          "abort",
          () => {
            signals.forEach((signal) => signal.removeEventListener("abort", abort));
          },
          {
            once: true
          }
        );
        return ac.signal;
      }, "AbortSignalAny")
    };
    module.exports.promisify.custom = /* @__PURE__ */ Symbol.for("nodejs.util.promisify.custom");
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/validators.js
var require_validators = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/validators.js"(exports, module) {
    "use strict";
    init_globals();
    var {
      ArrayIsArray,
      ArrayPrototypeIncludes,
      ArrayPrototypeJoin,
      ArrayPrototypeMap,
      NumberIsInteger,
      NumberIsNaN,
      NumberMAX_SAFE_INTEGER,
      NumberMIN_SAFE_INTEGER,
      NumberParseInt,
      ObjectPrototypeHasOwnProperty,
      RegExpPrototypeExec,
      String: String2,
      StringPrototypeToUpperCase,
      StringPrototypeTrim
    } = require_primordials();
    var {
      hideStackFrames,
      codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
    } = require_errors();
    var { normalizeEncoding } = require_util();
    var { isAsyncFunction, isArrayBufferView } = require_util().types;
    var signals = {};
    function isInt32(value) {
      return value === (value | 0);
    }
    __name(isInt32, "isInt32");
    function isUint32(value) {
      return value === value >>> 0;
    }
    __name(isUint32, "isUint32");
    var octalReg = /^[0-7]+$/;
    var modeDesc = "must be a 32-bit unsigned integer or an octal string";
    function parseFileMode(value, name, def) {
      if (typeof value === "undefined") {
        value = def;
      }
      if (typeof value === "string") {
        if (RegExpPrototypeExec(octalReg, value) === null) {
          throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
        }
        value = NumberParseInt(value, 8);
      }
      validateUint32(value, name);
      return value;
    }
    __name(parseFileMode, "parseFileMode");
    var validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
      if (typeof value !== "number") throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      if (!NumberIsInteger(value)) throw new ERR_OUT_OF_RANGE(name, "an integer", value);
      if (value < min || value > max) throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    });
    var validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
      if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      }
      if (!NumberIsInteger(value)) {
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
      }
      if (value < min || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
      }
    });
    var validateUint32 = hideStackFrames((value, name, positive = false) => {
      if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      }
      if (!NumberIsInteger(value)) {
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
      }
      const min = positive ? 1 : 0;
      const max = 4294967295;
      if (value < min || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
      }
    });
    function validateString(value, name) {
      if (typeof value !== "string") throw new ERR_INVALID_ARG_TYPE(name, "string", value);
    }
    __name(validateString, "validateString");
    function validateNumber(value, name, min = void 0, max) {
      if (typeof value !== "number") throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      if (min != null && value < min || max != null && value > max || (min != null || max != null) && NumberIsNaN(value)) {
        throw new ERR_OUT_OF_RANGE(
          name,
          `${min != null ? `>= ${min}` : ""}${min != null && max != null ? " && " : ""}${max != null ? `<= ${max}` : ""}`,
          value
        );
      }
    }
    __name(validateNumber, "validateNumber");
    var validateOneOf = hideStackFrames((value, name, oneOf) => {
      if (!ArrayPrototypeIncludes(oneOf, value)) {
        const allowed = ArrayPrototypeJoin(
          ArrayPrototypeMap(oneOf, (v) => typeof v === "string" ? `'${v}'` : String2(v)),
          ", "
        );
        const reason = "must be one of: " + allowed;
        throw new ERR_INVALID_ARG_VALUE(name, value, reason);
      }
    });
    function validateBoolean(value, name) {
      if (typeof value !== "boolean") throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
    }
    __name(validateBoolean, "validateBoolean");
    function getOwnPropertyValueOrDefault(options, key, defaultValue) {
      return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key];
    }
    __name(getOwnPropertyValueOrDefault, "getOwnPropertyValueOrDefault");
    var validateObject = hideStackFrames((value, name, options = null) => {
      const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
      const allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
      const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
      if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
        throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
      }
    });
    var validateDictionary = hideStackFrames((value, name) => {
      if (value != null && typeof value !== "object" && typeof value !== "function") {
        throw new ERR_INVALID_ARG_TYPE(name, "a dictionary", value);
      }
    });
    var validateArray = hideStackFrames((value, name, minLength = 0) => {
      if (!ArrayIsArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
      }
      if (value.length < minLength) {
        const reason = `must be longer than ${minLength}`;
        throw new ERR_INVALID_ARG_VALUE(name, value, reason);
      }
    });
    function validateStringArray(value, name) {
      validateArray(value, name);
      for (let i = 0; i < value.length; i++) {
        validateString(value[i], `${name}[${i}]`);
      }
    }
    __name(validateStringArray, "validateStringArray");
    function validateBooleanArray(value, name) {
      validateArray(value, name);
      for (let i = 0; i < value.length; i++) {
        validateBoolean(value[i], `${name}[${i}]`);
      }
    }
    __name(validateBooleanArray, "validateBooleanArray");
    function validateAbortSignalArray(value, name) {
      validateArray(value, name);
      for (let i = 0; i < value.length; i++) {
        const signal = value[i];
        const indexedName = `${name}[${i}]`;
        if (signal == null) {
          throw new ERR_INVALID_ARG_TYPE(indexedName, "AbortSignal", signal);
        }
        validateAbortSignal(signal, indexedName);
      }
    }
    __name(validateAbortSignalArray, "validateAbortSignalArray");
    function validateSignalName(signal, name = "signal") {
      validateString(signal, name);
      if (signals[signal] === void 0) {
        if (signals[StringPrototypeToUpperCase(signal)] !== void 0) {
          throw new ERR_UNKNOWN_SIGNAL(signal + " (signals must use all capital letters)");
        }
        throw new ERR_UNKNOWN_SIGNAL(signal);
      }
    }
    __name(validateSignalName, "validateSignalName");
    var validateBuffer = hideStackFrames((buffer, name = "buffer") => {
      if (!isArrayBufferView(buffer)) {
        throw new ERR_INVALID_ARG_TYPE(name, ["Buffer", "TypedArray", "DataView"], buffer);
      }
    });
    function validateEncoding(data, encoding) {
      const normalizedEncoding = normalizeEncoding(encoding);
      const length = data.length;
      if (normalizedEncoding === "hex" && length % 2 !== 0) {
        throw new ERR_INVALID_ARG_VALUE("encoding", encoding, `is invalid for data of length ${length}`);
      }
    }
    __name(validateEncoding, "validateEncoding");
    function validatePort(port, name = "Port", allowZero = true) {
      if (typeof port !== "number" && typeof port !== "string" || typeof port === "string" && StringPrototypeTrim(port).length === 0 || +port !== +port >>> 0 || port > 65535 || port === 0 && !allowZero) {
        throw new ERR_SOCKET_BAD_PORT(name, port, allowZero);
      }
      return port | 0;
    }
    __name(validatePort, "validatePort");
    var validateAbortSignal = hideStackFrames((signal, name) => {
      if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    });
    var validateFunction = hideStackFrames((value, name) => {
      if (typeof value !== "function") throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
    });
    var validatePlainFunction = hideStackFrames((value, name) => {
      if (typeof value !== "function" || isAsyncFunction(value)) throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
    });
    var validateUndefined = hideStackFrames((value, name) => {
      if (value !== void 0) throw new ERR_INVALID_ARG_TYPE(name, "undefined", value);
    });
    function validateUnion(value, name, union) {
      if (!ArrayPrototypeIncludes(union, value)) {
        throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
      }
    }
    __name(validateUnion, "validateUnion");
    var linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
    function validateLinkHeaderFormat(value, name) {
      if (typeof value === "undefined" || !RegExpPrototypeExec(linkValueRegExp, value)) {
        throw new ERR_INVALID_ARG_VALUE(
          name,
          value,
          'must be an array or string of format "</styles.css>; rel=preload; as=style"'
        );
      }
    }
    __name(validateLinkHeaderFormat, "validateLinkHeaderFormat");
    function validateLinkHeaderValue(hints) {
      if (typeof hints === "string") {
        validateLinkHeaderFormat(hints, "hints");
        return hints;
      } else if (ArrayIsArray(hints)) {
        const hintsLength = hints.length;
        let result = "";
        if (hintsLength === 0) {
          return result;
        }
        for (let i = 0; i < hintsLength; i++) {
          const link = hints[i];
          validateLinkHeaderFormat(link, "hints");
          result += link;
          if (i !== hintsLength - 1) {
            result += ", ";
          }
        }
        return result;
      }
      throw new ERR_INVALID_ARG_VALUE(
        "hints",
        hints,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"'
      );
    }
    __name(validateLinkHeaderValue, "validateLinkHeaderValue");
    module.exports = {
      isInt32,
      isUint32,
      parseFileMode,
      validateArray,
      validateStringArray,
      validateBooleanArray,
      validateAbortSignalArray,
      validateBoolean,
      validateBuffer,
      validateDictionary,
      validateEncoding,
      validateFunction,
      validateInt32,
      validateInteger,
      validateNumber,
      validateObject,
      validateOneOf,
      validatePlainFunction,
      validatePort,
      validateSignalName,
      validateString,
      validateUint32,
      validateUndefined,
      validateUnion,
      validateAbortSignal,
      validateLinkHeaderValue
    };
  }
});

// src/academy/node/runtime/gen/process_.cjs
var require_process = __commonJS({
  "src/academy/node/runtime/gen/process_.cjs"(exports, module) {
    init_globals();
    var m = (init_process(), __toCommonJS(process_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/shims/process.js
var require_process2 = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/shims/process.js"(exports, module) {
    "use strict";
    init_globals();
    var process2 = ((base, esmKey, keys, isValid) => {
      if (esmKey in base && base[esmKey] === true) {
        let candidate;
        for (const key of keys) {
          if (!(key in base)) {
            continue;
          }
          candidate = base[key];
          if (isValid(candidate)) {
            return candidate;
          }
        }
      }
      return base;
    })(require_process(), "__esModule", ["default", "process"], (candidate) => "nextTick" in candidate);
    module.exports = process2;
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/utils.js
var require_utils = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/utils.js"(exports, module) {
    "use strict";
    init_globals();
    var { SymbolAsyncIterator, SymbolIterator, SymbolFor } = require_primordials();
    var kIsDestroyed = SymbolFor("nodejs.stream.destroyed");
    var kIsErrored = SymbolFor("nodejs.stream.errored");
    var kIsReadable = SymbolFor("nodejs.stream.readable");
    var kIsWritable = SymbolFor("nodejs.stream.writable");
    var kIsDisturbed = SymbolFor("nodejs.stream.disturbed");
    var kIsClosedPromise = SymbolFor("nodejs.webstream.isClosedPromise");
    var kControllerErrorFunction = SymbolFor("nodejs.webstream.controllerErrorFunction");
    function isReadableNodeStream(obj, strict = false) {
      var _obj$_readableState;
      return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!strict || typeof obj.pause === "function" && typeof obj.resume === "function") && (!obj._writableState || ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === void 0 ? void 0 : _obj$_readableState.readable) !== false) && // Duplex
      (!obj._writableState || obj._readableState));
    }
    __name(isReadableNodeStream, "isReadableNodeStream");
    function isWritableNodeStream(obj) {
      var _obj$_writableState;
      return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === void 0 ? void 0 : _obj$_writableState.writable) !== false));
    }
    __name(isWritableNodeStream, "isWritableNodeStream");
    function isDuplexNodeStream(obj) {
      return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
    }
    __name(isDuplexNodeStream, "isDuplexNodeStream");
    function isNodeStream(obj) {
      return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
    }
    __name(isNodeStream, "isNodeStream");
    function isReadableStream(obj) {
      return !!(obj && !isNodeStream(obj) && typeof obj.pipeThrough === "function" && typeof obj.getReader === "function" && typeof obj.cancel === "function");
    }
    __name(isReadableStream, "isReadableStream");
    function isWritableStream(obj) {
      return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === "function" && typeof obj.abort === "function");
    }
    __name(isWritableStream, "isWritableStream");
    function isTransformStream(obj) {
      return !!(obj && !isNodeStream(obj) && typeof obj.readable === "object" && typeof obj.writable === "object");
    }
    __name(isTransformStream, "isTransformStream");
    function isWebStream(obj) {
      return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj);
    }
    __name(isWebStream, "isWebStream");
    function isIterable(obj, isAsync) {
      if (obj == null) return false;
      if (isAsync === true) return typeof obj[SymbolAsyncIterator] === "function";
      if (isAsync === false) return typeof obj[SymbolIterator] === "function";
      return typeof obj[SymbolAsyncIterator] === "function" || typeof obj[SymbolIterator] === "function";
    }
    __name(isIterable, "isIterable");
    function isDestroyed(stream2) {
      if (!isNodeStream(stream2)) return null;
      const wState = stream2._writableState;
      const rState = stream2._readableState;
      const state = wState || rState;
      return !!(stream2.destroyed || stream2[kIsDestroyed] || state !== null && state !== void 0 && state.destroyed);
    }
    __name(isDestroyed, "isDestroyed");
    function isWritableEnded(stream2) {
      if (!isWritableNodeStream(stream2)) return null;
      if (stream2.writableEnded === true) return true;
      const wState = stream2._writableState;
      if (wState !== null && wState !== void 0 && wState.errored) return false;
      if (typeof (wState === null || wState === void 0 ? void 0 : wState.ended) !== "boolean") return null;
      return wState.ended;
    }
    __name(isWritableEnded, "isWritableEnded");
    function isWritableFinished(stream2, strict) {
      if (!isWritableNodeStream(stream2)) return null;
      if (stream2.writableFinished === true) return true;
      const wState = stream2._writableState;
      if (wState !== null && wState !== void 0 && wState.errored) return false;
      if (typeof (wState === null || wState === void 0 ? void 0 : wState.finished) !== "boolean") return null;
      return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
    }
    __name(isWritableFinished, "isWritableFinished");
    function isReadableEnded(stream2) {
      if (!isReadableNodeStream(stream2)) return null;
      if (stream2.readableEnded === true) return true;
      const rState = stream2._readableState;
      if (!rState || rState.errored) return false;
      if (typeof (rState === null || rState === void 0 ? void 0 : rState.ended) !== "boolean") return null;
      return rState.ended;
    }
    __name(isReadableEnded, "isReadableEnded");
    function isReadableFinished(stream2, strict) {
      if (!isReadableNodeStream(stream2)) return null;
      const rState = stream2._readableState;
      if (rState !== null && rState !== void 0 && rState.errored) return false;
      if (typeof (rState === null || rState === void 0 ? void 0 : rState.endEmitted) !== "boolean") return null;
      return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
    }
    __name(isReadableFinished, "isReadableFinished");
    function isReadable(stream2) {
      if (stream2 && stream2[kIsReadable] != null) return stream2[kIsReadable];
      if (typeof (stream2 === null || stream2 === void 0 ? void 0 : stream2.readable) !== "boolean") return null;
      if (isDestroyed(stream2)) return false;
      return isReadableNodeStream(stream2) && stream2.readable && !isReadableFinished(stream2);
    }
    __name(isReadable, "isReadable");
    function isWritable(stream2) {
      if (stream2 && stream2[kIsWritable] != null) return stream2[kIsWritable];
      if (typeof (stream2 === null || stream2 === void 0 ? void 0 : stream2.writable) !== "boolean") return null;
      if (isDestroyed(stream2)) return false;
      return isWritableNodeStream(stream2) && stream2.writable && !isWritableEnded(stream2);
    }
    __name(isWritable, "isWritable");
    function isFinished(stream2, opts) {
      if (!isNodeStream(stream2)) {
        return null;
      }
      if (isDestroyed(stream2)) {
        return true;
      }
      if ((opts === null || opts === void 0 ? void 0 : opts.readable) !== false && isReadable(stream2)) {
        return false;
      }
      if ((opts === null || opts === void 0 ? void 0 : opts.writable) !== false && isWritable(stream2)) {
        return false;
      }
      return true;
    }
    __name(isFinished, "isFinished");
    function isWritableErrored(stream2) {
      var _stream$_writableStat, _stream$_writableStat2;
      if (!isNodeStream(stream2)) {
        return null;
      }
      if (stream2.writableErrored) {
        return stream2.writableErrored;
      }
      return (_stream$_writableStat = (_stream$_writableStat2 = stream2._writableState) === null || _stream$_writableStat2 === void 0 ? void 0 : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== void 0 ? _stream$_writableStat : null;
    }
    __name(isWritableErrored, "isWritableErrored");
    function isReadableErrored(stream2) {
      var _stream$_readableStat, _stream$_readableStat2;
      if (!isNodeStream(stream2)) {
        return null;
      }
      if (stream2.readableErrored) {
        return stream2.readableErrored;
      }
      return (_stream$_readableStat = (_stream$_readableStat2 = stream2._readableState) === null || _stream$_readableStat2 === void 0 ? void 0 : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== void 0 ? _stream$_readableStat : null;
    }
    __name(isReadableErrored, "isReadableErrored");
    function isClosed(stream2) {
      if (!isNodeStream(stream2)) {
        return null;
      }
      if (typeof stream2.closed === "boolean") {
        return stream2.closed;
      }
      const wState = stream2._writableState;
      const rState = stream2._readableState;
      if (typeof (wState === null || wState === void 0 ? void 0 : wState.closed) === "boolean" || typeof (rState === null || rState === void 0 ? void 0 : rState.closed) === "boolean") {
        return (wState === null || wState === void 0 ? void 0 : wState.closed) || (rState === null || rState === void 0 ? void 0 : rState.closed);
      }
      if (typeof stream2._closed === "boolean" && isOutgoingMessage(stream2)) {
        return stream2._closed;
      }
      return null;
    }
    __name(isClosed, "isClosed");
    function isOutgoingMessage(stream2) {
      return typeof stream2._closed === "boolean" && typeof stream2._defaultKeepAlive === "boolean" && typeof stream2._removedConnection === "boolean" && typeof stream2._removedContLen === "boolean";
    }
    __name(isOutgoingMessage, "isOutgoingMessage");
    function isServerResponse(stream2) {
      return typeof stream2._sent100 === "boolean" && isOutgoingMessage(stream2);
    }
    __name(isServerResponse, "isServerResponse");
    function isServerRequest(stream2) {
      var _stream$req;
      return typeof stream2._consuming === "boolean" && typeof stream2._dumped === "boolean" && ((_stream$req = stream2.req) === null || _stream$req === void 0 ? void 0 : _stream$req.upgradeOrConnect) === void 0;
    }
    __name(isServerRequest, "isServerRequest");
    function willEmitClose(stream2) {
      if (!isNodeStream(stream2)) return null;
      const wState = stream2._writableState;
      const rState = stream2._readableState;
      const state = wState || rState;
      return !state && isServerResponse(stream2) || !!(state && state.autoDestroy && state.emitClose && state.closed === false);
    }
    __name(willEmitClose, "willEmitClose");
    function isDisturbed(stream2) {
      var _stream$kIsDisturbed;
      return !!(stream2 && ((_stream$kIsDisturbed = stream2[kIsDisturbed]) !== null && _stream$kIsDisturbed !== void 0 ? _stream$kIsDisturbed : stream2.readableDidRead || stream2.readableAborted));
    }
    __name(isDisturbed, "isDisturbed");
    function isErrored(stream2) {
      var _ref, _ref2, _ref3, _ref4, _ref5, _stream$kIsErrored, _stream$_readableStat3, _stream$_writableStat3, _stream$_readableStat4, _stream$_writableStat4;
      return !!(stream2 && ((_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_stream$kIsErrored = stream2[kIsErrored]) !== null && _stream$kIsErrored !== void 0 ? _stream$kIsErrored : stream2.readableErrored) !== null && _ref5 !== void 0 ? _ref5 : stream2.writableErrored) !== null && _ref4 !== void 0 ? _ref4 : (_stream$_readableStat3 = stream2._readableState) === null || _stream$_readableStat3 === void 0 ? void 0 : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== void 0 ? _ref3 : (_stream$_writableStat3 = stream2._writableState) === null || _stream$_writableStat3 === void 0 ? void 0 : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== void 0 ? _ref2 : (_stream$_readableStat4 = stream2._readableState) === null || _stream$_readableStat4 === void 0 ? void 0 : _stream$_readableStat4.errored) !== null && _ref !== void 0 ? _ref : (_stream$_writableStat4 = stream2._writableState) === null || _stream$_writableStat4 === void 0 ? void 0 : _stream$_writableStat4.errored));
    }
    __name(isErrored, "isErrored");
    module.exports = {
      isDestroyed,
      kIsDestroyed,
      isDisturbed,
      kIsDisturbed,
      isErrored,
      kIsErrored,
      isReadable,
      kIsReadable,
      kIsClosedPromise,
      kControllerErrorFunction,
      kIsWritable,
      isClosed,
      isDuplexNodeStream,
      isFinished,
      isIterable,
      isReadableNodeStream,
      isReadableStream,
      isReadableEnded,
      isReadableFinished,
      isReadableErrored,
      isNodeStream,
      isWebStream,
      isWritable,
      isWritableNodeStream,
      isWritableStream,
      isWritableEnded,
      isWritableFinished,
      isWritableErrored,
      isServerRequest,
      isServerResponse,
      willEmitClose,
      isTransformStream
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
    "use strict";
    init_globals();
    var process2 = require_process2();
    var { AbortError, codes } = require_errors();
    var { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes;
    var { kEmptyObject, once } = require_util();
    var { validateAbortSignal, validateFunction, validateObject, validateBoolean } = require_validators();
    var { Promise: Promise2, PromisePrototypeThen, SymbolDispose } = require_primordials();
    var {
      isClosed,
      isReadable,
      isReadableNodeStream,
      isReadableStream,
      isReadableFinished,
      isReadableErrored,
      isWritable,
      isWritableNodeStream,
      isWritableStream,
      isWritableFinished,
      isWritableErrored,
      isNodeStream,
      willEmitClose: _willEmitClose,
      kIsClosedPromise
    } = require_utils();
    var addAbortListener;
    function isRequest(stream2) {
      return stream2.setHeader && typeof stream2.abort === "function";
    }
    __name(isRequest, "isRequest");
    var nop = /* @__PURE__ */ __name(() => {
    }, "nop");
    function eos(stream2, options, callback) {
      var _options$readable, _options$writable;
      if (arguments.length === 2) {
        callback = options;
        options = kEmptyObject;
      } else if (options == null) {
        options = kEmptyObject;
      } else {
        validateObject(options, "options");
      }
      validateFunction(callback, "callback");
      validateAbortSignal(options.signal, "options.signal");
      callback = once(callback);
      if (isReadableStream(stream2) || isWritableStream(stream2)) {
        return eosWeb(stream2, options, callback);
      }
      if (!isNodeStream(stream2)) {
        throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream2);
      }
      const readable = (_options$readable = options.readable) !== null && _options$readable !== void 0 ? _options$readable : isReadableNodeStream(stream2);
      const writable = (_options$writable = options.writable) !== null && _options$writable !== void 0 ? _options$writable : isWritableNodeStream(stream2);
      const wState = stream2._writableState;
      const rState = stream2._readableState;
      const onlegacyfinish = /* @__PURE__ */ __name(() => {
        if (!stream2.writable) {
          onfinish();
        }
      }, "onlegacyfinish");
      let willEmitClose = _willEmitClose(stream2) && isReadableNodeStream(stream2) === readable && isWritableNodeStream(stream2) === writable;
      let writableFinished = isWritableFinished(stream2, false);
      const onfinish = /* @__PURE__ */ __name(() => {
        writableFinished = true;
        if (stream2.destroyed) {
          willEmitClose = false;
        }
        if (willEmitClose && (!stream2.readable || readable)) {
          return;
        }
        if (!readable || readableFinished) {
          callback.call(stream2);
        }
      }, "onfinish");
      let readableFinished = isReadableFinished(stream2, false);
      const onend = /* @__PURE__ */ __name(() => {
        readableFinished = true;
        if (stream2.destroyed) {
          willEmitClose = false;
        }
        if (willEmitClose && (!stream2.writable || writable)) {
          return;
        }
        if (!writable || writableFinished) {
          callback.call(stream2);
        }
      }, "onend");
      const onerror = /* @__PURE__ */ __name((err) => {
        callback.call(stream2, err);
      }, "onerror");
      let closed = isClosed(stream2);
      const onclose = /* @__PURE__ */ __name(() => {
        closed = true;
        const errored = isWritableErrored(stream2) || isReadableErrored(stream2);
        if (errored && typeof errored !== "boolean") {
          return callback.call(stream2, errored);
        }
        if (readable && !readableFinished && isReadableNodeStream(stream2, true)) {
          if (!isReadableFinished(stream2, false)) return callback.call(stream2, new ERR_STREAM_PREMATURE_CLOSE());
        }
        if (writable && !writableFinished) {
          if (!isWritableFinished(stream2, false)) return callback.call(stream2, new ERR_STREAM_PREMATURE_CLOSE());
        }
        callback.call(stream2);
      }, "onclose");
      const onclosed = /* @__PURE__ */ __name(() => {
        closed = true;
        const errored = isWritableErrored(stream2) || isReadableErrored(stream2);
        if (errored && typeof errored !== "boolean") {
          return callback.call(stream2, errored);
        }
        callback.call(stream2);
      }, "onclosed");
      const onrequest = /* @__PURE__ */ __name(() => {
        stream2.req.on("finish", onfinish);
      }, "onrequest");
      if (isRequest(stream2)) {
        stream2.on("complete", onfinish);
        if (!willEmitClose) {
          stream2.on("abort", onclose);
        }
        if (stream2.req) {
          onrequest();
        } else {
          stream2.on("request", onrequest);
        }
      } else if (writable && !wState) {
        stream2.on("end", onlegacyfinish);
        stream2.on("close", onlegacyfinish);
      }
      if (!willEmitClose && typeof stream2.aborted === "boolean") {
        stream2.on("aborted", onclose);
      }
      stream2.on("end", onend);
      stream2.on("finish", onfinish);
      if (options.error !== false) {
        stream2.on("error", onerror);
      }
      stream2.on("close", onclose);
      if (closed) {
        process2.nextTick(onclose);
      } else if (wState !== null && wState !== void 0 && wState.errorEmitted || rState !== null && rState !== void 0 && rState.errorEmitted) {
        if (!willEmitClose) {
          process2.nextTick(onclosed);
        }
      } else if (!readable && (!willEmitClose || isReadable(stream2)) && (writableFinished || isWritable(stream2) === false)) {
        process2.nextTick(onclosed);
      } else if (!writable && (!willEmitClose || isWritable(stream2)) && (readableFinished || isReadable(stream2) === false)) {
        process2.nextTick(onclosed);
      } else if (rState && stream2.req && stream2.aborted) {
        process2.nextTick(onclosed);
      }
      const cleanup = /* @__PURE__ */ __name(() => {
        callback = nop;
        stream2.removeListener("aborted", onclose);
        stream2.removeListener("complete", onfinish);
        stream2.removeListener("abort", onclose);
        stream2.removeListener("request", onrequest);
        if (stream2.req) stream2.req.removeListener("finish", onfinish);
        stream2.removeListener("end", onlegacyfinish);
        stream2.removeListener("close", onlegacyfinish);
        stream2.removeListener("finish", onfinish);
        stream2.removeListener("end", onend);
        stream2.removeListener("error", onerror);
        stream2.removeListener("close", onclose);
      }, "cleanup");
      if (options.signal && !closed) {
        const abort = /* @__PURE__ */ __name(() => {
          const endCallback = callback;
          cleanup();
          endCallback.call(
            stream2,
            new AbortError(void 0, {
              cause: options.signal.reason
            })
          );
        }, "abort");
        if (options.signal.aborted) {
          process2.nextTick(abort);
        } else {
          addAbortListener = addAbortListener || require_util().addAbortListener;
          const disposable = addAbortListener(options.signal, abort);
          const originalCallback = callback;
          callback = once((...args) => {
            disposable[SymbolDispose]();
            originalCallback.apply(stream2, args);
          });
        }
      }
      return cleanup;
    }
    __name(eos, "eos");
    function eosWeb(stream2, options, callback) {
      let isAborted = false;
      let abort = nop;
      if (options.signal) {
        abort = /* @__PURE__ */ __name(() => {
          isAborted = true;
          callback.call(
            stream2,
            new AbortError(void 0, {
              cause: options.signal.reason
            })
          );
        }, "abort");
        if (options.signal.aborted) {
          process2.nextTick(abort);
        } else {
          addAbortListener = addAbortListener || require_util().addAbortListener;
          const disposable = addAbortListener(options.signal, abort);
          const originalCallback = callback;
          callback = once((...args) => {
            disposable[SymbolDispose]();
            originalCallback.apply(stream2, args);
          });
        }
      }
      const resolverFn = /* @__PURE__ */ __name((...args) => {
        if (!isAborted) {
          process2.nextTick(() => callback.apply(stream2, args));
        }
      }, "resolverFn");
      PromisePrototypeThen(stream2[kIsClosedPromise].promise, resolverFn, resolverFn);
      return nop;
    }
    __name(eosWeb, "eosWeb");
    function finished2(stream2, opts) {
      var _opts;
      let autoCleanup = false;
      if (opts === null) {
        opts = kEmptyObject;
      }
      if ((_opts = opts) !== null && _opts !== void 0 && _opts.cleanup) {
        validateBoolean(opts.cleanup, "cleanup");
        autoCleanup = opts.cleanup;
      }
      return new Promise2((resolve2, reject) => {
        const cleanup = eos(stream2, opts, (err) => {
          if (autoCleanup) {
            cleanup();
          }
          if (err) {
            reject(err);
          } else {
            resolve2();
          }
        });
      });
    }
    __name(finished2, "finished");
    module.exports = eos;
    module.exports.finished = finished2;
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    init_globals();
    var process2 = require_process2();
    var {
      aggregateTwoErrors,
      codes: { ERR_MULTIPLE_CALLBACK },
      AbortError
    } = require_errors();
    var { Symbol: Symbol2 } = require_primordials();
    var { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = require_utils();
    var kDestroy = Symbol2("kDestroy");
    var kConstruct = Symbol2("kConstruct");
    function checkError(err, w, r) {
      if (err) {
        err.stack;
        if (w && !w.errored) {
          w.errored = err;
        }
        if (r && !r.errored) {
          r.errored = err;
        }
      }
    }
    __name(checkError, "checkError");
    function destroy3(err, cb) {
      const r = this._readableState;
      const w = this._writableState;
      const s = w || r;
      if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
        if (typeof cb === "function") {
          cb();
        }
        return this;
      }
      checkError(err, w, r);
      if (w) {
        w.destroyed = true;
      }
      if (r) {
        r.destroyed = true;
      }
      if (!s.constructed) {
        this.once(kDestroy, function(er) {
          _destroy(this, aggregateTwoErrors(er, err), cb);
        });
      } else {
        _destroy(this, err, cb);
      }
      return this;
    }
    __name(destroy3, "destroy");
    function _destroy(self, err, cb) {
      let called = false;
      function onDestroy(err2) {
        if (called) {
          return;
        }
        called = true;
        const r = self._readableState;
        const w = self._writableState;
        checkError(err2, w, r);
        if (w) {
          w.closed = true;
        }
        if (r) {
          r.closed = true;
        }
        if (typeof cb === "function") {
          cb(err2);
        }
        if (err2) {
          process2.nextTick(emitErrorCloseNT, self, err2);
        } else {
          process2.nextTick(emitCloseNT, self);
        }
      }
      __name(onDestroy, "onDestroy");
      try {
        self._destroy(err || null, onDestroy);
      } catch (err2) {
        onDestroy(err2);
      }
    }
    __name(_destroy, "_destroy");
    function emitErrorCloseNT(self, err) {
      emitErrorNT(self, err);
      emitCloseNT(self);
    }
    __name(emitErrorCloseNT, "emitErrorCloseNT");
    function emitCloseNT(self) {
      const r = self._readableState;
      const w = self._writableState;
      if (w) {
        w.closeEmitted = true;
      }
      if (r) {
        r.closeEmitted = true;
      }
      if (w !== null && w !== void 0 && w.emitClose || r !== null && r !== void 0 && r.emitClose) {
        self.emit("close");
      }
    }
    __name(emitCloseNT, "emitCloseNT");
    function emitErrorNT(self, err) {
      const r = self._readableState;
      const w = self._writableState;
      if (w !== null && w !== void 0 && w.errorEmitted || r !== null && r !== void 0 && r.errorEmitted) {
        return;
      }
      if (w) {
        w.errorEmitted = true;
      }
      if (r) {
        r.errorEmitted = true;
      }
      self.emit("error", err);
    }
    __name(emitErrorNT, "emitErrorNT");
    function undestroy() {
      const r = this._readableState;
      const w = this._writableState;
      if (r) {
        r.constructed = true;
        r.closed = false;
        r.closeEmitted = false;
        r.destroyed = false;
        r.errored = null;
        r.errorEmitted = false;
        r.reading = false;
        r.ended = r.readable === false;
        r.endEmitted = r.readable === false;
      }
      if (w) {
        w.constructed = true;
        w.destroyed = false;
        w.closed = false;
        w.closeEmitted = false;
        w.errored = null;
        w.errorEmitted = false;
        w.finalCalled = false;
        w.prefinished = false;
        w.ended = w.writable === false;
        w.ending = w.writable === false;
        w.finished = w.writable === false;
      }
    }
    __name(undestroy, "undestroy");
    function errorOrDestroy(stream2, err, sync) {
      const r = stream2._readableState;
      const w = stream2._writableState;
      if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
        return this;
      }
      if (r !== null && r !== void 0 && r.autoDestroy || w !== null && w !== void 0 && w.autoDestroy)
        stream2.destroy(err);
      else if (err) {
        err.stack;
        if (w && !w.errored) {
          w.errored = err;
        }
        if (r && !r.errored) {
          r.errored = err;
        }
        if (sync) {
          process2.nextTick(emitErrorNT, stream2, err);
        } else {
          emitErrorNT(stream2, err);
        }
      }
    }
    __name(errorOrDestroy, "errorOrDestroy");
    function construct(stream2, cb) {
      if (typeof stream2._construct !== "function") {
        return;
      }
      const r = stream2._readableState;
      const w = stream2._writableState;
      if (r) {
        r.constructed = false;
      }
      if (w) {
        w.constructed = false;
      }
      stream2.once(kConstruct, cb);
      if (stream2.listenerCount(kConstruct) > 1) {
        return;
      }
      process2.nextTick(constructNT, stream2);
    }
    __name(construct, "construct");
    function constructNT(stream2) {
      let called = false;
      function onConstruct(err) {
        if (called) {
          errorOrDestroy(stream2, err !== null && err !== void 0 ? err : new ERR_MULTIPLE_CALLBACK());
          return;
        }
        called = true;
        const r = stream2._readableState;
        const w = stream2._writableState;
        const s = w || r;
        if (r) {
          r.constructed = true;
        }
        if (w) {
          w.constructed = true;
        }
        if (s.destroyed) {
          stream2.emit(kDestroy, err);
        } else if (err) {
          errorOrDestroy(stream2, err, true);
        } else {
          process2.nextTick(emitConstructNT, stream2);
        }
      }
      __name(onConstruct, "onConstruct");
      try {
        stream2._construct((err) => {
          process2.nextTick(onConstruct, err);
        });
      } catch (err) {
        process2.nextTick(onConstruct, err);
      }
    }
    __name(constructNT, "constructNT");
    function emitConstructNT(stream2) {
      stream2.emit(kConstruct);
    }
    __name(emitConstructNT, "emitConstructNT");
    function isRequest(stream2) {
      return (stream2 === null || stream2 === void 0 ? void 0 : stream2.setHeader) && typeof stream2.abort === "function";
    }
    __name(isRequest, "isRequest");
    function emitCloseLegacy(stream2) {
      stream2.emit("close");
    }
    __name(emitCloseLegacy, "emitCloseLegacy");
    function emitErrorCloseLegacy(stream2, err) {
      stream2.emit("error", err);
      process2.nextTick(emitCloseLegacy, stream2);
    }
    __name(emitErrorCloseLegacy, "emitErrorCloseLegacy");
    function destroyer(stream2, err) {
      if (!stream2 || isDestroyed(stream2)) {
        return;
      }
      if (!err && !isFinished(stream2)) {
        err = new AbortError();
      }
      if (isServerRequest(stream2)) {
        stream2.socket = null;
        stream2.destroy(err);
      } else if (isRequest(stream2)) {
        stream2.abort();
      } else if (isRequest(stream2.req)) {
        stream2.req.abort();
      } else if (typeof stream2.destroy === "function") {
        stream2.destroy(err);
      } else if (typeof stream2.close === "function") {
        stream2.close();
      } else if (err) {
        process2.nextTick(emitErrorCloseLegacy, stream2, err);
      } else {
        process2.nextTick(emitCloseLegacy, stream2);
      }
      if (!stream2.destroyed) {
        stream2[kIsDestroyed] = true;
      }
    }
    __name(destroyer, "destroyer");
    module.exports = {
      construct,
      destroyer,
      destroy: destroy3,
      undestroy,
      errorOrDestroy
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/legacy.js
var require_legacy = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/legacy.js"(exports, module) {
    "use strict";
    init_globals();
    var { ArrayIsArray, ObjectSetPrototypeOf } = require_primordials();
    var { EventEmitter: EE } = require_events();
    function Stream3(opts) {
      EE.call(this, opts);
    }
    __name(Stream3, "Stream");
    ObjectSetPrototypeOf(Stream3.prototype, EE.prototype);
    ObjectSetPrototypeOf(Stream3, EE);
    Stream3.prototype.pipe = function(dest, options) {
      const source = this;
      function ondata(chunk) {
        if (dest.writable && dest.write(chunk) === false && source.pause) {
          source.pause();
        }
      }
      __name(ondata, "ondata");
      source.on("data", ondata);
      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }
      __name(ondrain, "ondrain");
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend);
        source.on("close", onclose);
      }
      let didOnEnd = false;
      function onend() {
        if (didOnEnd) return;
        didOnEnd = true;
        dest.end();
      }
      __name(onend, "onend");
      function onclose() {
        if (didOnEnd) return;
        didOnEnd = true;
        if (typeof dest.destroy === "function") dest.destroy();
      }
      __name(onclose, "onclose");
      function onerror(er) {
        var _this$listenerCount;
        cleanup();
        if (((_this$listenerCount = this.listenerCount) === null || _this$listenerCount === void 0 ? void 0 : _this$listenerCount.call(this, "error")) === 0) {
          this.emit("error", er);
        }
      }
      __name(onerror, "onerror");
      prependListener(source, "error", onerror);
      prependListener(dest, "error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      __name(cleanup, "cleanup");
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (ArrayIsArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    __name(prependListener, "prependListener");
    module.exports = {
      Stream: Stream3,
      prependListener
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js
var require_add_abort_signal = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js"(exports, module) {
    "use strict";
    init_globals();
    var { SymbolDispose } = require_primordials();
    var { AbortError, codes } = require_errors();
    var { isNodeStream, isWebStream, kControllerErrorFunction } = require_utils();
    var eos = require_end_of_stream();
    var { ERR_INVALID_ARG_TYPE } = codes;
    var addAbortListener;
    var validateAbortSignal = /* @__PURE__ */ __name((signal, name) => {
      if (typeof signal !== "object" || !("aborted" in signal)) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    }, "validateAbortSignal");
    module.exports.addAbortSignal = /* @__PURE__ */ __name(function addAbortSignal2(signal, stream2) {
      validateAbortSignal(signal, "signal");
      if (!isNodeStream(stream2) && !isWebStream(stream2)) {
        throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream2);
      }
      return module.exports.addAbortSignalNoValidate(signal, stream2);
    }, "addAbortSignal");
    module.exports.addAbortSignalNoValidate = function(signal, stream2) {
      if (typeof signal !== "object" || !("aborted" in signal)) {
        return stream2;
      }
      const onAbort = isNodeStream(stream2) ? () => {
        stream2.destroy(
          new AbortError(void 0, {
            cause: signal.reason
          })
        );
      } : () => {
        stream2[kControllerErrorFunction](
          new AbortError(void 0, {
            cause: signal.reason
          })
        );
      };
      if (signal.aborted) {
        onAbort();
      } else {
        addAbortListener = addAbortListener || require_util().addAbortListener;
        const disposable = addAbortListener(signal, onAbort);
        eos(stream2, disposable[SymbolDispose]);
      }
      return stream2;
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
    "use strict";
    init_globals();
    var { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array: Uint8Array2 } = require_primordials();
    var { Buffer: Buffer2 } = require_buffer();
    var { inspect } = require_util();
    module.exports = class BufferList {
      static {
        __name(this, "BufferList");
      }
      constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      push(v) {
        const entry = {
          data: v,
          next: null
        };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
      }
      unshift(v) {
        const entry = {
          data: v,
          next: this.head
        };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      }
      shift() {
        if (this.length === 0) return;
        const ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret;
      }
      clear() {
        this.head = this.tail = null;
        this.length = 0;
      }
      join(s) {
        if (this.length === 0) return "";
        let p = this.head;
        let ret = "" + p.data;
        while ((p = p.next) !== null) ret += s + p.data;
        return ret;
      }
      concat(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        const ret = Buffer2.allocUnsafe(n >>> 0);
        let p = this.head;
        let i = 0;
        while (p) {
          TypedArrayPrototypeSet(ret, p.data, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
      consume(n, hasStrings) {
        const data = this.head.data;
        if (n < data.length) {
          const slice = data.slice(0, n);
          this.head.data = data.slice(n);
          return slice;
        }
        if (n === data.length) {
          return this.shift();
        }
        return hasStrings ? this._getString(n) : this._getBuffer(n);
      }
      first() {
        return this.head.data;
      }
      *[SymbolIterator]() {
        for (let p = this.head; p; p = p.next) {
          yield p.data;
        }
      }
      // Consumes a specified amount of characters from the buffered data.
      _getString(n) {
        let ret = "";
        let p = this.head;
        let c = 0;
        do {
          const str = p.data;
          if (n > str.length) {
            ret += str;
            n -= str.length;
          } else {
            if (n === str.length) {
              ret += str;
              ++c;
              if (p.next) this.head = p.next;
              else this.head = this.tail = null;
            } else {
              ret += StringPrototypeSlice(str, 0, n);
              this.head = p;
              p.data = StringPrototypeSlice(str, n);
            }
            break;
          }
          ++c;
        } while ((p = p.next) !== null);
        this.length -= c;
        return ret;
      }
      // Consumes a specified amount of bytes from the buffered data.
      _getBuffer(n) {
        const ret = Buffer2.allocUnsafe(n);
        const retLen = n;
        let p = this.head;
        let c = 0;
        do {
          const buf = p.data;
          if (n > buf.length) {
            TypedArrayPrototypeSet(ret, buf, retLen - n);
            n -= buf.length;
          } else {
            if (n === buf.length) {
              TypedArrayPrototypeSet(ret, buf, retLen - n);
              ++c;
              if (p.next) this.head = p.next;
              else this.head = this.tail = null;
            } else {
              TypedArrayPrototypeSet(ret, new Uint8Array2(buf.buffer, buf.byteOffset, n), retLen - n);
              this.head = p;
              p.data = buf.slice(n);
            }
            break;
          }
          ++c;
        } while ((p = p.next) !== null);
        this.length -= c;
        return ret;
      }
      // Make sure the linked list only shows the minimal necessary information.
      [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](_, options) {
        return inspect(this, {
          ...options,
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: false
        });
      }
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
    "use strict";
    init_globals();
    var { MathFloor, NumberIsInteger } = require_primordials();
    var { validateInteger } = require_validators();
    var { ERR_INVALID_ARG_VALUE } = require_errors().codes;
    var defaultHighWaterMarkBytes = 16 * 1024;
    var defaultHighWaterMarkObjectMode = 16;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    __name(highWaterMarkFrom, "highWaterMarkFrom");
    function getDefaultHighWaterMark(objectMode) {
      return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes;
    }
    __name(getDefaultHighWaterMark, "getDefaultHighWaterMark");
    function setDefaultHighWaterMark(objectMode, value) {
      validateInteger(value, "value", 0);
      if (objectMode) {
        defaultHighWaterMarkObjectMode = value;
      } else {
        defaultHighWaterMarkBytes = value;
      }
    }
    __name(setDefaultHighWaterMark, "setDefaultHighWaterMark");
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!NumberIsInteger(hwm) || hwm < 0) {
          const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
          throw new ERR_INVALID_ARG_VALUE(name, hwm);
        }
        return MathFloor(hwm);
      }
      return getDefaultHighWaterMark(state.objectMode);
    }
    __name(getHighWaterMark, "getHighWaterMark");
    module.exports = {
      getHighWaterMark,
      getDefaultHighWaterMark,
      setDefaultHighWaterMark
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/from.js"(exports, module) {
    "use strict";
    init_globals();
    var process2 = require_process2();
    var { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = require_primordials();
    var { Buffer: Buffer2 } = require_buffer();
    var { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = require_errors().codes;
    function from(Readable2, iterable, opts) {
      let iterator;
      if (typeof iterable === "string" || iterable instanceof Buffer2) {
        return new Readable2({
          objectMode: true,
          ...opts,
          read() {
            this.push(iterable);
            this.push(null);
          }
        });
      }
      let isAsync;
      if (iterable && iterable[SymbolAsyncIterator]) {
        isAsync = true;
        iterator = iterable[SymbolAsyncIterator]();
      } else if (iterable && iterable[SymbolIterator]) {
        isAsync = false;
        iterator = iterable[SymbolIterator]();
      } else {
        throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
      }
      const readable = new Readable2({
        objectMode: true,
        highWaterMark: 1,
        // TODO(ronag): What options should be allowed?
        ...opts
      });
      let reading = false;
      readable._read = function() {
        if (!reading) {
          reading = true;
          next();
        }
      };
      readable._destroy = function(error, cb) {
        PromisePrototypeThen(
          close2(error),
          () => process2.nextTick(cb, error),
          // nextTick is here in case cb throws
          (e) => process2.nextTick(cb, e || error)
        );
      };
      async function close2(error) {
        const hadError = error !== void 0 && error !== null;
        const hasThrow = typeof iterator.throw === "function";
        if (hadError && hasThrow) {
          const { value, done } = await iterator.throw(error);
          await value;
          if (done) {
            return;
          }
        }
        if (typeof iterator.return === "function") {
          const { value } = await iterator.return();
          await value;
        }
      }
      __name(close2, "close");
      async function next() {
        for (; ; ) {
          try {
            const { value, done } = isAsync ? await iterator.next() : iterator.next();
            if (done) {
              readable.push(null);
            } else {
              const res = value && typeof value.then === "function" ? await value : value;
              if (res === null) {
                reading = false;
                throw new ERR_STREAM_NULL_VALUES();
              } else if (readable.push(res)) {
                continue;
              } else {
                reading = false;
              }
            }
          } catch (err) {
            readable.destroy(err);
          }
          break;
        }
      }
      __name(next, "next");
      return readable;
    }
    __name(from, "from");
    module.exports = from;
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/readable.js
var require_readable = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/readable.js"(exports, module) {
    "use strict";
    init_globals();
    var process2 = require_process2();
    var {
      ArrayPrototypeIndexOf,
      NumberIsInteger,
      NumberIsNaN,
      NumberParseInt,
      ObjectDefineProperties,
      ObjectKeys,
      ObjectSetPrototypeOf,
      Promise: Promise2,
      SafeSet,
      SymbolAsyncDispose,
      SymbolAsyncIterator,
      Symbol: Symbol2
    } = require_primordials();
    module.exports = Readable2;
    Readable2.ReadableState = ReadableState;
    var { EventEmitter: EE } = require_events();
    var { Stream: Stream3, prependListener } = require_legacy();
    var { Buffer: Buffer2 } = require_buffer();
    var { addAbortSignal: addAbortSignal2 } = require_add_abort_signal();
    var eos = require_end_of_stream();
    var debug = require_util().debuglog("stream", (fn) => {
      debug = fn;
    });
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy();
    var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
    var {
      aggregateTwoErrors,
      codes: {
        ERR_INVALID_ARG_TYPE,
        ERR_METHOD_NOT_IMPLEMENTED,
        ERR_OUT_OF_RANGE,
        ERR_STREAM_PUSH_AFTER_EOF,
        ERR_STREAM_UNSHIFT_AFTER_END_EVENT
      },
      AbortError
    } = require_errors();
    var { validateObject } = require_validators();
    var kPaused = Symbol2("kPaused");
    var { StringDecoder } = require_string_decoder();
    var from = require_from();
    ObjectSetPrototypeOf(Readable2.prototype, Stream3.prototype);
    ObjectSetPrototypeOf(Readable2, Stream3);
    var nop = /* @__PURE__ */ __name(() => {
    }, "nop");
    var { errorOrDestroy } = destroyImpl;
    var kObjectMode = 1 << 0;
    var kEnded = 1 << 1;
    var kEndEmitted = 1 << 2;
    var kReading = 1 << 3;
    var kConstructed = 1 << 4;
    var kSync = 1 << 5;
    var kNeedReadable = 1 << 6;
    var kEmittedReadable = 1 << 7;
    var kReadableListening = 1 << 8;
    var kResumeScheduled = 1 << 9;
    var kErrorEmitted = 1 << 10;
    var kEmitClose = 1 << 11;
    var kAutoDestroy = 1 << 12;
    var kDestroyed = 1 << 13;
    var kClosed = 1 << 14;
    var kCloseEmitted = 1 << 15;
    var kMultiAwaitDrain = 1 << 16;
    var kReadingMore = 1 << 17;
    var kDataEmitted = 1 << 18;
    function makeBitMapDescriptor(bit) {
      return {
        enumerable: false,
        get() {
          return (this.state & bit) !== 0;
        },
        set(value) {
          if (value) this.state |= bit;
          else this.state &= ~bit;
        }
      };
    }
    __name(makeBitMapDescriptor, "makeBitMapDescriptor");
    ObjectDefineProperties(ReadableState.prototype, {
      objectMode: makeBitMapDescriptor(kObjectMode),
      ended: makeBitMapDescriptor(kEnded),
      endEmitted: makeBitMapDescriptor(kEndEmitted),
      reading: makeBitMapDescriptor(kReading),
      // Stream is still being constructed and cannot be
      // destroyed until construction finished or failed.
      // Async construction is opt in, therefore we start as
      // constructed.
      constructed: makeBitMapDescriptor(kConstructed),
      // A flag to be able to tell if the event 'readable'/'data' is emitted
      // immediately, or on a later tick.  We set this to true at first, because
      // any actions that shouldn't happen until "later" should generally also
      // not happen before the first read call.
      sync: makeBitMapDescriptor(kSync),
      // Whenever we return null, then we set a flag to say
      // that we're awaiting a 'readable' event emission.
      needReadable: makeBitMapDescriptor(kNeedReadable),
      emittedReadable: makeBitMapDescriptor(kEmittedReadable),
      readableListening: makeBitMapDescriptor(kReadableListening),
      resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
      // True if the error was already emitted and should not be thrown again.
      errorEmitted: makeBitMapDescriptor(kErrorEmitted),
      emitClose: makeBitMapDescriptor(kEmitClose),
      autoDestroy: makeBitMapDescriptor(kAutoDestroy),
      // Has it been destroyed.
      destroyed: makeBitMapDescriptor(kDestroyed),
      // Indicates whether the stream has finished destroying.
      closed: makeBitMapDescriptor(kClosed),
      // True if close has been emitted or would have been emitted
      // depending on emitClose.
      closeEmitted: makeBitMapDescriptor(kCloseEmitted),
      multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
      // If true, a maybeReadMore has been scheduled.
      readingMore: makeBitMapDescriptor(kReadingMore),
      dataEmitted: makeBitMapDescriptor(kDataEmitted)
    });
    function ReadableState(options, stream2, isDuplex) {
      if (typeof isDuplex !== "boolean") isDuplex = stream2 instanceof require_duplex();
      this.state = kEmitClose | kAutoDestroy | kConstructed | kSync;
      if (options && options.objectMode) this.state |= kObjectMode;
      if (isDuplex && options && options.readableObjectMode) this.state |= kObjectMode;
      this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = [];
      this.flowing = null;
      this[kPaused] = null;
      if (options && options.emitClose === false) this.state &= ~kEmitClose;
      if (options && options.autoDestroy === false) this.state &= ~kAutoDestroy;
      this.errored = null;
      this.defaultEncoding = options && options.defaultEncoding || "utf8";
      this.awaitDrainWriters = null;
      this.decoder = null;
      this.encoding = null;
      if (options && options.encoding) {
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    __name(ReadableState, "ReadableState");
    function Readable2(options) {
      if (!(this instanceof Readable2)) return new Readable2(options);
      const isDuplex = this instanceof require_duplex();
      this._readableState = new ReadableState(options, this, isDuplex);
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.construct === "function") this._construct = options.construct;
        if (options.signal && !isDuplex) addAbortSignal2(options.signal, this);
      }
      Stream3.call(this, options);
      destroyImpl.construct(this, () => {
        if (this._readableState.needReadable) {
          maybeReadMore(this, this._readableState);
        }
      });
    }
    __name(Readable2, "Readable");
    Readable2.prototype.destroy = destroyImpl.destroy;
    Readable2.prototype._undestroy = destroyImpl.undestroy;
    Readable2.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable2.prototype[EE.captureRejectionSymbol] = function(err) {
      this.destroy(err);
    };
    Readable2.prototype[SymbolAsyncDispose] = function() {
      let error;
      if (!this.destroyed) {
        error = this.readableEnded ? null : new AbortError();
        this.destroy(error);
      }
      return new Promise2((resolve2, reject) => eos(this, (err) => err && err !== error ? reject(err) : resolve2(null)));
    };
    Readable2.prototype.push = function(chunk, encoding) {
      return readableAddChunk(this, chunk, encoding, false);
    };
    Readable2.prototype.unshift = function(chunk, encoding) {
      return readableAddChunk(this, chunk, encoding, true);
    };
    function readableAddChunk(stream2, chunk, encoding, addToFront) {
      debug("readableAddChunk", chunk);
      const state = stream2._readableState;
      let err;
      if ((state.state & kObjectMode) === 0) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (state.encoding !== encoding) {
            if (addToFront && state.encoding) {
              chunk = Buffer2.from(chunk, encoding).toString(state.encoding);
            } else {
              chunk = Buffer2.from(chunk, encoding);
              encoding = "";
            }
          }
        } else if (chunk instanceof Buffer2) {
          encoding = "";
        } else if (Stream3._isUint8Array(chunk)) {
          chunk = Stream3._uint8ArrayToBuffer(chunk);
          encoding = "";
        } else if (chunk != null) {
          err = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
        }
      }
      if (err) {
        errorOrDestroy(stream2, err);
      } else if (chunk === null) {
        state.state &= ~kReading;
        onEofChunk(stream2, state);
      } else if ((state.state & kObjectMode) !== 0 || chunk && chunk.length > 0) {
        if (addToFront) {
          if ((state.state & kEndEmitted) !== 0) errorOrDestroy(stream2, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
          else if (state.destroyed || state.errored) return false;
          else addChunk(stream2, state, chunk, true);
        } else if (state.ended) {
          errorOrDestroy(stream2, new ERR_STREAM_PUSH_AFTER_EOF());
        } else if (state.destroyed || state.errored) {
          return false;
        } else {
          state.state &= ~kReading;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0) addChunk(stream2, state, chunk, false);
            else maybeReadMore(stream2, state);
          } else {
            addChunk(stream2, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.state &= ~kReading;
        maybeReadMore(stream2, state);
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    __name(readableAddChunk, "readableAddChunk");
    function addChunk(stream2, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync && stream2.listenerCount("data") > 0) {
        if ((state.state & kMultiAwaitDrain) !== 0) {
          state.awaitDrainWriters.clear();
        } else {
          state.awaitDrainWriters = null;
        }
        state.dataEmitted = true;
        stream2.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if ((state.state & kNeedReadable) !== 0) emitReadable(stream2);
      }
      maybeReadMore(stream2, state);
    }
    __name(addChunk, "addChunk");
    Readable2.prototype.isPaused = function() {
      const state = this._readableState;
      return state[kPaused] === true || state.flowing === false;
    };
    Readable2.prototype.setEncoding = function(enc) {
      const decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      const buffer = this._readableState.buffer;
      let content = "";
      for (const data of buffer) {
        content += decoder.write(data);
      }
      buffer.clear();
      if (content !== "") buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n > MAX_HWM) {
        throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    __name(computeNewHighWaterMark, "computeNewHighWaterMark");
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if ((state.state & kObjectMode) !== 0) return 1;
      if (NumberIsNaN(n)) {
        if (state.flowing && state.length) return state.buffer.first().length;
        return state.length;
      }
      if (n <= state.length) return n;
      return state.ended ? state.length : 0;
    }
    __name(howMuchToRead, "howMuchToRead");
    Readable2.prototype.read = function(n) {
      debug("read", n);
      if (n === void 0) {
        n = NaN;
      } else if (!NumberIsInteger(n)) {
        n = NumberParseInt(n, 10);
      }
      const state = this._readableState;
      const nOrig = n;
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n !== 0) state.state &= ~kEmittedReadable;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      let doRead = (state.state & kNeedReadable) !== 0;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
        doRead = false;
        debug("reading, ended or constructing", doRead);
      } else if (doRead) {
        debug("do read");
        state.state |= kReading | kSync;
        if (state.length === 0) state.state |= kNeedReadable;
        try {
          this._read(state.highWaterMark);
        } catch (err) {
          errorOrDestroy(this, err);
        }
        state.state &= ~kSync;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      let ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        if (state.multiAwaitDrain) {
          state.awaitDrainWriters.clear();
        } else {
          state.awaitDrainWriters = null;
        }
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
        state.dataEmitted = true;
        this.emit("data", ret);
      }
      return ret;
    };
    function onEofChunk(stream2, state) {
      debug("onEofChunk");
      if (state.ended) return;
      if (state.decoder) {
        const chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream2);
      } else {
        state.needReadable = false;
        state.emittedReadable = true;
        emitReadable_(stream2);
      }
    }
    __name(onEofChunk, "onEofChunk");
    function emitReadable(stream2) {
      const state = stream2._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        process2.nextTick(emitReadable_, stream2);
      }
    }
    __name(emitReadable, "emitReadable");
    function emitReadable_(stream2) {
      const state = stream2._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && !state.errored && (state.length || state.ended)) {
        stream2.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream2);
    }
    __name(emitReadable_, "emitReadable_");
    function maybeReadMore(stream2, state) {
      if (!state.readingMore && state.constructed) {
        state.readingMore = true;
        process2.nextTick(maybeReadMore_, stream2, state);
      }
    }
    __name(maybeReadMore, "maybeReadMore");
    function maybeReadMore_(stream2, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        const len = state.length;
        debug("maybeReadMore read 0");
        stream2.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    __name(maybeReadMore_, "maybeReadMore_");
    Readable2.prototype._read = function(n) {
      throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
    };
    Readable2.prototype.pipe = function(dest, pipeOpts) {
      const src = this;
      const state = this._readableState;
      if (state.pipes.length === 1) {
        if (!state.multiAwaitDrain) {
          state.multiAwaitDrain = true;
          state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : []);
        }
      }
      state.pipes.push(dest);
      debug("pipe count=%d opts=%j", state.pipes.length, pipeOpts);
      const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process2.stdout && dest !== process2.stderr;
      const endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) process2.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      __name(onunpipe, "onunpipe");
      function onend() {
        debug("onend");
        dest.end();
      }
      __name(onend, "onend");
      let ondrain;
      let cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        if (ondrain) {
          dest.removeListener("drain", ondrain);
        }
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      __name(cleanup, "cleanup");
      function pause() {
        if (!cleanedUp) {
          if (state.pipes.length === 1 && state.pipes[0] === dest) {
            debug("false write response, pause", 0);
            state.awaitDrainWriters = dest;
            state.multiAwaitDrain = false;
          } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
            debug("false write response, pause", state.awaitDrainWriters.size);
            state.awaitDrainWriters.add(dest);
          }
          src.pause();
        }
        if (!ondrain) {
          ondrain = pipeOnDrain(src, dest);
          dest.on("drain", ondrain);
        }
      }
      __name(pause, "pause");
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        const ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          pause();
        }
      }
      __name(ondata, "ondata");
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (dest.listenerCount("error") === 0) {
          const s = dest._writableState || dest._readableState;
          if (s && !s.errorEmitted) {
            errorOrDestroy(dest, er);
          } else {
            dest.emit("error", er);
          }
        }
      }
      __name(onerror, "onerror");
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      __name(onclose, "onclose");
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      __name(onfinish, "onfinish");
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      __name(unpipe, "unpipe");
      dest.emit("pipe", src);
      if (dest.writableNeedDrain === true) {
        pause();
      } else if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src, dest) {
      return /* @__PURE__ */ __name(function pipeOnDrainFunctionResult() {
        const state = src._readableState;
        if (state.awaitDrainWriters === dest) {
          debug("pipeOnDrain", 1);
          state.awaitDrainWriters = null;
        } else if (state.multiAwaitDrain) {
          debug("pipeOnDrain", state.awaitDrainWriters.size);
          state.awaitDrainWriters.delete(dest);
        }
        if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount("data")) {
          src.resume();
        }
      }, "pipeOnDrainFunctionResult");
    }
    __name(pipeOnDrain, "pipeOnDrain");
    Readable2.prototype.unpipe = function(dest) {
      const state = this._readableState;
      const unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipes.length === 0) return this;
      if (!dest) {
        const dests = state.pipes;
        state.pipes = [];
        this.pause();
        for (let i = 0; i < dests.length; i++)
          dests[i].emit("unpipe", this, {
            hasUnpiped: false
          });
        return this;
      }
      const index = ArrayPrototypeIndexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      if (state.pipes.length === 0) this.pause();
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable2.prototype.on = function(ev, fn) {
      const res = Stream3.prototype.on.call(this, ev, fn);
      const state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false) this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            process2.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res;
    };
    Readable2.prototype.addListener = Readable2.prototype.on;
    Readable2.prototype.removeListener = function(ev, fn) {
      const res = Stream3.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process2.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable2.prototype.off = Readable2.prototype.removeListener;
    Readable2.prototype.removeAllListeners = function(ev) {
      const res = Stream3.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process2.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self) {
      const state = self._readableState;
      state.readableListening = self.listenerCount("readable") > 0;
      if (state.resumeScheduled && state[kPaused] === false) {
        state.flowing = true;
      } else if (self.listenerCount("data") > 0) {
        self.resume();
      } else if (!state.readableListening) {
        state.flowing = null;
      }
    }
    __name(updateReadableListening, "updateReadableListening");
    function nReadingNextTick(self) {
      debug("readable nexttick read 0");
      self.read(0);
    }
    __name(nReadingNextTick, "nReadingNextTick");
    Readable2.prototype.resume = function() {
      const state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state[kPaused] = false;
      return this;
    };
    function resume(stream2, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process2.nextTick(resume_, stream2, state);
      }
    }
    __name(resume, "resume");
    function resume_(stream2, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream2.read(0);
      }
      state.resumeScheduled = false;
      stream2.emit("resume");
      flow(stream2);
      if (state.flowing && !state.reading) stream2.read(0);
    }
    __name(resume_, "resume_");
    Readable2.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState[kPaused] = true;
      return this;
    };
    function flow(stream2) {
      const state = stream2._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream2.read() !== null) ;
    }
    __name(flow, "flow");
    Readable2.prototype.wrap = function(stream2) {
      let paused = false;
      stream2.on("data", (chunk) => {
        if (!this.push(chunk) && stream2.pause) {
          paused = true;
          stream2.pause();
        }
      });
      stream2.on("end", () => {
        this.push(null);
      });
      stream2.on("error", (err) => {
        errorOrDestroy(this, err);
      });
      stream2.on("close", () => {
        this.destroy();
      });
      stream2.on("destroy", () => {
        this.destroy();
      });
      this._read = () => {
        if (paused && stream2.resume) {
          paused = false;
          stream2.resume();
        }
      };
      const streamKeys = ObjectKeys(stream2);
      for (let j = 1; j < streamKeys.length; j++) {
        const i = streamKeys[j];
        if (this[i] === void 0 && typeof stream2[i] === "function") {
          this[i] = stream2[i].bind(stream2);
        }
      }
      return this;
    };
    Readable2.prototype[SymbolAsyncIterator] = function() {
      return streamToAsyncIterator(this);
    };
    Readable2.prototype.iterator = function(options) {
      if (options !== void 0) {
        validateObject(options, "options");
      }
      return streamToAsyncIterator(this, options);
    };
    function streamToAsyncIterator(stream2, options) {
      if (typeof stream2.read !== "function") {
        stream2 = Readable2.wrap(stream2, {
          objectMode: true
        });
      }
      const iter = createAsyncIterator(stream2, options);
      iter.stream = stream2;
      return iter;
    }
    __name(streamToAsyncIterator, "streamToAsyncIterator");
    async function* createAsyncIterator(stream2, options) {
      let callback = nop;
      function next(resolve2) {
        if (this === stream2) {
          callback();
          callback = nop;
        } else {
          callback = resolve2;
        }
      }
      __name(next, "next");
      stream2.on("readable", next);
      let error;
      const cleanup = eos(
        stream2,
        {
          writable: false
        },
        (err) => {
          error = err ? aggregateTwoErrors(error, err) : null;
          callback();
          callback = nop;
        }
      );
      try {
        while (true) {
          const chunk = stream2.destroyed ? null : stream2.read();
          if (chunk !== null) {
            yield chunk;
          } else if (error) {
            throw error;
          } else if (error === null) {
            return;
          } else {
            await new Promise2(next);
          }
        }
      } catch (err) {
        error = aggregateTwoErrors(error, err);
        throw error;
      } finally {
        if ((error || (options === null || options === void 0 ? void 0 : options.destroyOnReturn) !== false) && (error === void 0 || stream2._readableState.autoDestroy)) {
          destroyImpl.destroyer(stream2, null);
        } else {
          stream2.off("readable", next);
          cleanup();
        }
      }
    }
    __name(createAsyncIterator, "createAsyncIterator");
    ObjectDefineProperties(Readable2.prototype, {
      readable: {
        __proto__: null,
        get() {
          const r = this._readableState;
          return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
        },
        set(val) {
          if (this._readableState) {
            this._readableState.readable = !!val;
          }
        }
      },
      readableDidRead: {
        __proto__: null,
        enumerable: false,
        get: /* @__PURE__ */ __name(function() {
          return this._readableState.dataEmitted;
        }, "get")
      },
      readableAborted: {
        __proto__: null,
        enumerable: false,
        get: /* @__PURE__ */ __name(function() {
          return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
        }, "get")
      },
      readableHighWaterMark: {
        __proto__: null,
        enumerable: false,
        get: /* @__PURE__ */ __name(function() {
          return this._readableState.highWaterMark;
        }, "get")
      },
      readableBuffer: {
        __proto__: null,
        enumerable: false,
        get: /* @__PURE__ */ __name(function() {
          return this._readableState && this._readableState.buffer;
        }, "get")
      },
      readableFlowing: {
        __proto__: null,
        enumerable: false,
        get: /* @__PURE__ */ __name(function() {
          return this._readableState.flowing;
        }, "get"),
        set: /* @__PURE__ */ __name(function(state) {
          if (this._readableState) {
            this._readableState.flowing = state;
          }
        }, "set")
      },
      readableLength: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState.length;
        }
      },
      readableObjectMode: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.objectMode : false;
        }
      },
      readableEncoding: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.encoding : null;
        }
      },
      errored: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.errored : null;
        }
      },
      closed: {
        __proto__: null,
        get() {
          return this._readableState ? this._readableState.closed : false;
        }
      },
      destroyed: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.destroyed : false;
        },
        set(value) {
          if (!this._readableState) {
            return;
          }
          this._readableState.destroyed = value;
        }
      },
      readableEnded: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.endEmitted : false;
        }
      }
    });
    ObjectDefineProperties(ReadableState.prototype, {
      // Legacy getter for `pipesCount`.
      pipesCount: {
        __proto__: null,
        get() {
          return this.pipes.length;
        }
      },
      // Legacy property for `paused`.
      paused: {
        __proto__: null,
        get() {
          return this[kPaused] !== false;
        },
        set(value) {
          this[kPaused] = !!value;
        }
      }
    });
    Readable2._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0) return null;
      let ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.first();
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    __name(fromList, "fromList");
    function endReadable(stream2) {
      const state = stream2._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process2.nextTick(endReadableNT, state, stream2);
      }
    }
    __name(endReadable, "endReadable");
    function endReadableNT(state, stream2) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream2.emit("end");
        if (stream2.writable && stream2.allowHalfOpen === false) {
          process2.nextTick(endWritableNT, stream2);
        } else if (state.autoDestroy) {
          const wState = stream2._writableState;
          const autoDestroy = !wState || wState.autoDestroy && // We don't expect the writable to ever 'finish'
          // if writable is explicitly set to false.
          (wState.finished || wState.writable === false);
          if (autoDestroy) {
            stream2.destroy();
          }
        }
      }
    }
    __name(endReadableNT, "endReadableNT");
    function endWritableNT(stream2) {
      const writable = stream2.writable && !stream2.writableEnded && !stream2.destroyed;
      if (writable) {
        stream2.end();
      }
    }
    __name(endWritableNT, "endWritableNT");
    Readable2.from = function(iterable, opts) {
      return from(Readable2, iterable, opts);
    };
    var webStreamsAdapters;
    function lazyWebStreams() {
      if (webStreamsAdapters === void 0) webStreamsAdapters = {};
      return webStreamsAdapters;
    }
    __name(lazyWebStreams, "lazyWebStreams");
    Readable2.fromWeb = function(readableStream, options) {
      return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options);
    };
    Readable2.toWeb = function(streamReadable, options) {
      return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options);
    };
    Readable2.wrap = function(src, options) {
      var _ref, _src$readableObjectMo;
      return new Readable2({
        objectMode: (_ref = (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== void 0 ? _src$readableObjectMo : src.objectMode) !== null && _ref !== void 0 ? _ref : true,
        ...options,
        destroy(err, callback) {
          destroyImpl.destroyer(src, err);
          callback(err);
        }
      }).wrap(src);
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/writable.js
var require_writable = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/writable.js"(exports, module) {
    "use strict";
    init_globals();
    var process2 = require_process2();
    var {
      ArrayPrototypeSlice,
      Error: Error2,
      FunctionPrototypeSymbolHasInstance,
      ObjectDefineProperty,
      ObjectDefineProperties,
      ObjectSetPrototypeOf,
      StringPrototypeToLowerCase,
      Symbol: Symbol2,
      SymbolHasInstance
    } = require_primordials();
    module.exports = Writable2;
    Writable2.WritableState = WritableState;
    var { EventEmitter: EE } = require_events();
    var Stream3 = require_legacy().Stream;
    var { Buffer: Buffer2 } = require_buffer();
    var destroyImpl = require_destroy();
    var { addAbortSignal: addAbortSignal2 } = require_add_abort_signal();
    var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
    var {
      ERR_INVALID_ARG_TYPE,
      ERR_METHOD_NOT_IMPLEMENTED,
      ERR_MULTIPLE_CALLBACK,
      ERR_STREAM_CANNOT_PIPE,
      ERR_STREAM_DESTROYED,
      ERR_STREAM_ALREADY_FINISHED,
      ERR_STREAM_NULL_VALUES,
      ERR_STREAM_WRITE_AFTER_END,
      ERR_UNKNOWN_ENCODING
    } = require_errors().codes;
    var { errorOrDestroy } = destroyImpl;
    ObjectSetPrototypeOf(Writable2.prototype, Stream3.prototype);
    ObjectSetPrototypeOf(Writable2, Stream3);
    function nop() {
    }
    __name(nop, "nop");
    var kOnFinished = Symbol2("kOnFinished");
    function WritableState(options, stream2, isDuplex) {
      if (typeof isDuplex !== "boolean") isDuplex = stream2 instanceof require_duplex();
      this.objectMode = !!(options && options.objectMode);
      if (isDuplex) this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
      this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      const noDecode = !!(options && options.decodeStrings === false);
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options && options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = onwrite.bind(void 0, stream2);
      this.writecb = null;
      this.writelen = 0;
      this.afterWriteTickInfo = null;
      resetBuffer(this);
      this.pendingcb = 0;
      this.constructed = true;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = !options || options.emitClose !== false;
      this.autoDestroy = !options || options.autoDestroy !== false;
      this.errored = null;
      this.closed = false;
      this.closeEmitted = false;
      this[kOnFinished] = [];
    }
    __name(WritableState, "WritableState");
    function resetBuffer(state) {
      state.buffered = [];
      state.bufferedIndex = 0;
      state.allBuffers = true;
      state.allNoop = true;
    }
    __name(resetBuffer, "resetBuffer");
    WritableState.prototype.getBuffer = /* @__PURE__ */ __name(function getBuffer() {
      return ArrayPrototypeSlice(this.buffered, this.bufferedIndex);
    }, "getBuffer");
    ObjectDefineProperty(WritableState.prototype, "bufferedRequestCount", {
      __proto__: null,
      get() {
        return this.buffered.length - this.bufferedIndex;
      }
    });
    function Writable2(options) {
      const isDuplex = this instanceof require_duplex();
      if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable2, this)) return new Writable2(options);
      this._writableState = new WritableState(options, this, isDuplex);
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
        if (typeof options.construct === "function") this._construct = options.construct;
        if (options.signal) addAbortSignal2(options.signal, this);
      }
      Stream3.call(this, options);
      destroyImpl.construct(this, () => {
        const state = this._writableState;
        if (!state.writing) {
          clearBuffer(this, state);
        }
        finishMaybe(this, state);
      });
    }
    __name(Writable2, "Writable");
    ObjectDefineProperty(Writable2, SymbolHasInstance, {
      __proto__: null,
      value: /* @__PURE__ */ __name(function(object) {
        if (FunctionPrototypeSymbolHasInstance(this, object)) return true;
        if (this !== Writable2) return false;
        return object && object._writableState instanceof WritableState;
      }, "value")
    });
    Writable2.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function _write(stream2, chunk, encoding, cb) {
      const state = stream2._writableState;
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = state.defaultEncoding;
      } else {
        if (!encoding) encoding = state.defaultEncoding;
        else if (encoding !== "buffer" && !Buffer2.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding);
        if (typeof cb !== "function") cb = nop;
      }
      if (chunk === null) {
        throw new ERR_STREAM_NULL_VALUES();
      } else if (!state.objectMode) {
        if (typeof chunk === "string") {
          if (state.decodeStrings !== false) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "buffer";
          }
        } else if (chunk instanceof Buffer2) {
          encoding = "buffer";
        } else if (Stream3._isUint8Array(chunk)) {
          chunk = Stream3._uint8ArrayToBuffer(chunk);
          encoding = "buffer";
        } else {
          throw new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
        }
      }
      let err;
      if (state.ending) {
        err = new ERR_STREAM_WRITE_AFTER_END();
      } else if (state.destroyed) {
        err = new ERR_STREAM_DESTROYED("write");
      }
      if (err) {
        process2.nextTick(cb, err);
        errorOrDestroy(stream2, err, true);
        return err;
      }
      state.pendingcb++;
      return writeOrBuffer(stream2, state, chunk, encoding, cb);
    }
    __name(_write, "_write");
    Writable2.prototype.write = function(chunk, encoding, cb) {
      return _write(this, chunk, encoding, cb) === true;
    };
    Writable2.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable2.prototype.uncork = function() {
      const state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing) clearBuffer(this, state);
      }
    };
    Writable2.prototype.setDefaultEncoding = /* @__PURE__ */ __name(function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = StringPrototypeToLowerCase(encoding);
      if (!Buffer2.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    }, "setDefaultEncoding");
    function writeOrBuffer(stream2, state, chunk, encoding, callback) {
      const len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      const ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked || state.errored || !state.constructed) {
        state.buffered.push({
          chunk,
          encoding,
          callback
        });
        if (state.allBuffers && encoding !== "buffer") {
          state.allBuffers = false;
        }
        if (state.allNoop && callback !== nop) {
          state.allNoop = false;
        }
      } else {
        state.writelen = len;
        state.writecb = callback;
        state.writing = true;
        state.sync = true;
        stream2._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      return ret && !state.errored && !state.destroyed;
    }
    __name(writeOrBuffer, "writeOrBuffer");
    function doWrite(stream2, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev) stream2._writev(chunk, state.onwrite);
      else stream2._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    __name(doWrite, "doWrite");
    function onwriteError(stream2, state, er, cb) {
      --state.pendingcb;
      cb(er);
      errorBuffer(state);
      errorOrDestroy(stream2, er);
    }
    __name(onwriteError, "onwriteError");
    function onwrite(stream2, er) {
      const state = stream2._writableState;
      const sync = state.sync;
      const cb = state.writecb;
      if (typeof cb !== "function") {
        errorOrDestroy(stream2, new ERR_MULTIPLE_CALLBACK());
        return;
      }
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
      if (er) {
        er.stack;
        if (!state.errored) {
          state.errored = er;
        }
        if (stream2._readableState && !stream2._readableState.errored) {
          stream2._readableState.errored = er;
        }
        if (sync) {
          process2.nextTick(onwriteError, stream2, state, er, cb);
        } else {
          onwriteError(stream2, state, er, cb);
        }
      } else {
        if (state.buffered.length > state.bufferedIndex) {
          clearBuffer(stream2, state);
        }
        if (sync) {
          if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
            state.afterWriteTickInfo.count++;
          } else {
            state.afterWriteTickInfo = {
              count: 1,
              cb,
              stream: stream2,
              state
            };
            process2.nextTick(afterWriteTick, state.afterWriteTickInfo);
          }
        } else {
          afterWrite(stream2, state, 1, cb);
        }
      }
    }
    __name(onwrite, "onwrite");
    function afterWriteTick({ stream: stream2, state, count, cb }) {
      state.afterWriteTickInfo = null;
      return afterWrite(stream2, state, count, cb);
    }
    __name(afterWriteTick, "afterWriteTick");
    function afterWrite(stream2, state, count, cb) {
      const needDrain = !state.ending && !stream2.destroyed && state.length === 0 && state.needDrain;
      if (needDrain) {
        state.needDrain = false;
        stream2.emit("drain");
      }
      while (count-- > 0) {
        state.pendingcb--;
        cb();
      }
      if (state.destroyed) {
        errorBuffer(state);
      }
      finishMaybe(stream2, state);
    }
    __name(afterWrite, "afterWrite");
    function errorBuffer(state) {
      if (state.writing) {
        return;
      }
      for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
        var _state$errored;
        const { chunk, callback } = state.buffered[n];
        const len = state.objectMode ? 1 : chunk.length;
        state.length -= len;
        callback(
          (_state$errored = state.errored) !== null && _state$errored !== void 0 ? _state$errored : new ERR_STREAM_DESTROYED("write")
        );
      }
      const onfinishCallbacks = state[kOnFinished].splice(0);
      for (let i = 0; i < onfinishCallbacks.length; i++) {
        var _state$errored2;
        onfinishCallbacks[i](
          (_state$errored2 = state.errored) !== null && _state$errored2 !== void 0 ? _state$errored2 : new ERR_STREAM_DESTROYED("end")
        );
      }
      resetBuffer(state);
    }
    __name(errorBuffer, "errorBuffer");
    function clearBuffer(stream2, state) {
      if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
        return;
      }
      const { buffered, bufferedIndex, objectMode } = state;
      const bufferedLength = buffered.length - bufferedIndex;
      if (!bufferedLength) {
        return;
      }
      let i = bufferedIndex;
      state.bufferProcessing = true;
      if (bufferedLength > 1 && stream2._writev) {
        state.pendingcb -= bufferedLength - 1;
        const callback = state.allNoop ? nop : (err) => {
          for (let n = i; n < buffered.length; ++n) {
            buffered[n].callback(err);
          }
        };
        const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
        chunks.allBuffers = state.allBuffers;
        doWrite(stream2, state, true, state.length, chunks, "", callback);
        resetBuffer(state);
      } else {
        do {
          const { chunk, encoding, callback } = buffered[i];
          buffered[i++] = null;
          const len = objectMode ? 1 : chunk.length;
          doWrite(stream2, state, false, len, chunk, encoding, callback);
        } while (i < buffered.length && !state.writing);
        if (i === buffered.length) {
          resetBuffer(state);
        } else if (i > 256) {
          buffered.splice(0, i);
          state.bufferedIndex = 0;
        } else {
          state.bufferedIndex = i;
        }
      }
      state.bufferProcessing = false;
    }
    __name(clearBuffer, "clearBuffer");
    Writable2.prototype._write = function(chunk, encoding, cb) {
      if (this._writev) {
        this._writev(
          [
            {
              chunk,
              encoding
            }
          ],
          cb
        );
      } else {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
      }
    };
    Writable2.prototype._writev = null;
    Writable2.prototype.end = function(chunk, encoding, cb) {
      const state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      let err;
      if (chunk !== null && chunk !== void 0) {
        const ret = _write(this, chunk, encoding);
        if (ret instanceof Error2) {
          err = ret;
        }
      }
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (err) {
      } else if (!state.errored && !state.ending) {
        state.ending = true;
        finishMaybe(this, state, true);
        state.ended = true;
      } else if (state.finished) {
        err = new ERR_STREAM_ALREADY_FINISHED("end");
      } else if (state.destroyed) {
        err = new ERR_STREAM_DESTROYED("end");
      }
      if (typeof cb === "function") {
        if (err || state.finished) {
          process2.nextTick(cb, err);
        } else {
          state[kOnFinished].push(cb);
        }
      }
      return this;
    };
    function needFinish(state) {
      return state.ending && !state.destroyed && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
    }
    __name(needFinish, "needFinish");
    function callFinal(stream2, state) {
      let called = false;
      function onFinish(err) {
        if (called) {
          errorOrDestroy(stream2, err !== null && err !== void 0 ? err : ERR_MULTIPLE_CALLBACK());
          return;
        }
        called = true;
        state.pendingcb--;
        if (err) {
          const onfinishCallbacks = state[kOnFinished].splice(0);
          for (let i = 0; i < onfinishCallbacks.length; i++) {
            onfinishCallbacks[i](err);
          }
          errorOrDestroy(stream2, err, state.sync);
        } else if (needFinish(state)) {
          state.prefinished = true;
          stream2.emit("prefinish");
          state.pendingcb++;
          process2.nextTick(finish, stream2, state);
        }
      }
      __name(onFinish, "onFinish");
      state.sync = true;
      state.pendingcb++;
      try {
        stream2._final(onFinish);
      } catch (err) {
        onFinish(err);
      }
      state.sync = false;
    }
    __name(callFinal, "callFinal");
    function prefinish(stream2, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream2._final === "function" && !state.destroyed) {
          state.finalCalled = true;
          callFinal(stream2, state);
        } else {
          state.prefinished = true;
          stream2.emit("prefinish");
        }
      }
    }
    __name(prefinish, "prefinish");
    function finishMaybe(stream2, state, sync) {
      if (needFinish(state)) {
        prefinish(stream2, state);
        if (state.pendingcb === 0) {
          if (sync) {
            state.pendingcb++;
            process2.nextTick(
              (stream3, state2) => {
                if (needFinish(state2)) {
                  finish(stream3, state2);
                } else {
                  state2.pendingcb--;
                }
              },
              stream2,
              state
            );
          } else if (needFinish(state)) {
            state.pendingcb++;
            finish(stream2, state);
          }
        }
      }
    }
    __name(finishMaybe, "finishMaybe");
    function finish(stream2, state) {
      state.pendingcb--;
      state.finished = true;
      const onfinishCallbacks = state[kOnFinished].splice(0);
      for (let i = 0; i < onfinishCallbacks.length; i++) {
        onfinishCallbacks[i]();
      }
      stream2.emit("finish");
      if (state.autoDestroy) {
        const rState = stream2._readableState;
        const autoDestroy = !rState || rState.autoDestroy && // We don't expect the readable to ever 'end'
        // if readable is explicitly set to false.
        (rState.endEmitted || rState.readable === false);
        if (autoDestroy) {
          stream2.destroy();
        }
      }
    }
    __name(finish, "finish");
    ObjectDefineProperties(Writable2.prototype, {
      closed: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.closed : false;
        }
      },
      destroyed: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.destroyed : false;
        },
        set(value) {
          if (this._writableState) {
            this._writableState.destroyed = value;
          }
        }
      },
      writable: {
        __proto__: null,
        get() {
          const w = this._writableState;
          return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
        },
        set(val) {
          if (this._writableState) {
            this._writableState.writable = !!val;
          }
        }
      },
      writableFinished: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.finished : false;
        }
      },
      writableObjectMode: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.objectMode : false;
        }
      },
      writableBuffer: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.getBuffer();
        }
      },
      writableEnded: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.ending : false;
        }
      },
      writableNeedDrain: {
        __proto__: null,
        get() {
          const wState = this._writableState;
          if (!wState) return false;
          return !wState.destroyed && !wState.ending && wState.needDrain;
        }
      },
      writableHighWaterMark: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.highWaterMark;
        }
      },
      writableCorked: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.corked : 0;
        }
      },
      writableLength: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.length;
        }
      },
      errored: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._writableState ? this._writableState.errored : null;
        }
      },
      writableAborted: {
        __proto__: null,
        enumerable: false,
        get: /* @__PURE__ */ __name(function() {
          return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
        }, "get")
      }
    });
    var destroy3 = destroyImpl.destroy;
    Writable2.prototype.destroy = function(err, cb) {
      const state = this._writableState;
      if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
        process2.nextTick(errorBuffer, state);
      }
      destroy3.call(this, err, cb);
      return this;
    };
    Writable2.prototype._undestroy = destroyImpl.undestroy;
    Writable2.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Writable2.prototype[EE.captureRejectionSymbol] = function(err) {
      this.destroy(err);
    };
    var webStreamsAdapters;
    function lazyWebStreams() {
      if (webStreamsAdapters === void 0) webStreamsAdapters = {};
      return webStreamsAdapters;
    }
    __name(lazyWebStreams, "lazyWebStreams");
    Writable2.fromWeb = function(writableStream, options) {
      return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options);
    };
    Writable2.toWeb = function(streamWritable) {
      return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable);
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/duplexify.js
var require_duplexify = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/duplexify.js"(exports, module) {
    init_globals();
    var process2 = require_process2();
    var bufferModule = require_buffer();
    var {
      isReadable,
      isWritable,
      isIterable,
      isNodeStream,
      isReadableNodeStream,
      isWritableNodeStream,
      isDuplexNodeStream,
      isReadableStream,
      isWritableStream
    } = require_utils();
    var eos = require_end_of_stream();
    var {
      AbortError,
      codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
    } = require_errors();
    var { destroyer } = require_destroy();
    var Duplex2 = require_duplex();
    var Readable2 = require_readable();
    var Writable2 = require_writable();
    var { createDeferredPromise } = require_util();
    var from = require_from();
    var Blob = globalThis.Blob || bufferModule.Blob;
    var isBlob = typeof Blob !== "undefined" ? /* @__PURE__ */ __name(function isBlob2(b) {
      return b instanceof Blob;
    }, "isBlob") : /* @__PURE__ */ __name(function isBlob2(b) {
      return false;
    }, "isBlob");
    var AbortController = globalThis.AbortController || require_abort_controller().AbortController;
    var { FunctionPrototypeCall } = require_primordials();
    var Duplexify = class extends Duplex2 {
      static {
        __name(this, "Duplexify");
      }
      constructor(options) {
        super(options);
        if ((options === null || options === void 0 ? void 0 : options.readable) === false) {
          this._readableState.readable = false;
          this._readableState.ended = true;
          this._readableState.endEmitted = true;
        }
        if ((options === null || options === void 0 ? void 0 : options.writable) === false) {
          this._writableState.writable = false;
          this._writableState.ending = true;
          this._writableState.ended = true;
          this._writableState.finished = true;
        }
      }
    };
    module.exports = /* @__PURE__ */ __name(function duplexify(body, name) {
      if (isDuplexNodeStream(body)) {
        return body;
      }
      if (isReadableNodeStream(body)) {
        return _duplexify({
          readable: body
        });
      }
      if (isWritableNodeStream(body)) {
        return _duplexify({
          writable: body
        });
      }
      if (isNodeStream(body)) {
        return _duplexify({
          writable: false,
          readable: false
        });
      }
      if (isReadableStream(body)) {
        return _duplexify({
          readable: Readable2.fromWeb(body)
        });
      }
      if (isWritableStream(body)) {
        return _duplexify({
          writable: Writable2.fromWeb(body)
        });
      }
      if (typeof body === "function") {
        const { value, write: write2, final, destroy: destroy3 } = fromAsyncGen(body);
        if (isIterable(value)) {
          return from(Duplexify, value, {
            // TODO (ronag): highWaterMark?
            objectMode: true,
            write: write2,
            final,
            destroy: destroy3
          });
        }
        const then2 = value === null || value === void 0 ? void 0 : value.then;
        if (typeof then2 === "function") {
          let d;
          const promise = FunctionPrototypeCall(
            then2,
            value,
            (val) => {
              if (val != null) {
                throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
              }
            },
            (err) => {
              destroyer(d, err);
            }
          );
          return d = new Duplexify({
            // TODO (ronag): highWaterMark?
            objectMode: true,
            readable: false,
            write: write2,
            final(cb) {
              final(async () => {
                try {
                  await promise;
                  process2.nextTick(cb, null);
                } catch (err) {
                  process2.nextTick(cb, err);
                }
              });
            },
            destroy: destroy3
          });
        }
        throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
      }
      if (isBlob(body)) {
        return duplexify(body.arrayBuffer());
      }
      if (isIterable(body)) {
        return from(Duplexify, body, {
          // TODO (ronag): highWaterMark?
          objectMode: true,
          writable: false
        });
      }
      if (isReadableStream(body === null || body === void 0 ? void 0 : body.readable) && isWritableStream(body === null || body === void 0 ? void 0 : body.writable)) {
        return Duplexify.fromWeb(body);
      }
      if (typeof (body === null || body === void 0 ? void 0 : body.writable) === "object" || typeof (body === null || body === void 0 ? void 0 : body.readable) === "object") {
        const readable = body !== null && body !== void 0 && body.readable ? isReadableNodeStream(body === null || body === void 0 ? void 0 : body.readable) ? body === null || body === void 0 ? void 0 : body.readable : duplexify(body.readable) : void 0;
        const writable = body !== null && body !== void 0 && body.writable ? isWritableNodeStream(body === null || body === void 0 ? void 0 : body.writable) ? body === null || body === void 0 ? void 0 : body.writable : duplexify(body.writable) : void 0;
        return _duplexify({
          readable,
          writable
        });
      }
      const then = body === null || body === void 0 ? void 0 : body.then;
      if (typeof then === "function") {
        let d;
        FunctionPrototypeCall(
          then,
          body,
          (val) => {
            if (val != null) {
              d.push(val);
            }
            d.push(null);
          },
          (err) => {
            destroyer(d, err);
          }
        );
        return d = new Duplexify({
          objectMode: true,
          writable: false,
          read() {
          }
        });
      }
      throw new ERR_INVALID_ARG_TYPE(
        name,
        [
          "Blob",
          "ReadableStream",
          "WritableStream",
          "Stream",
          "Iterable",
          "AsyncIterable",
          "Function",
          "{ readable, writable } pair",
          "Promise"
        ],
        body
      );
    }, "duplexify");
    function fromAsyncGen(fn) {
      let { promise, resolve: resolve2 } = createDeferredPromise();
      const ac = new AbortController();
      const signal = ac.signal;
      const value = fn(
        (async function* () {
          while (true) {
            const _promise = promise;
            promise = null;
            const { chunk, done, cb } = await _promise;
            process2.nextTick(cb);
            if (done) return;
            if (signal.aborted)
              throw new AbortError(void 0, {
                cause: signal.reason
              });
            ({ promise, resolve: resolve2 } = createDeferredPromise());
            yield chunk;
          }
        })(),
        {
          signal
        }
      );
      return {
        value,
        write(chunk, encoding, cb) {
          const _resolve = resolve2;
          resolve2 = null;
          _resolve({
            chunk,
            done: false,
            cb
          });
        },
        final(cb) {
          const _resolve = resolve2;
          resolve2 = null;
          _resolve({
            done: true,
            cb
          });
        },
        destroy(err, cb) {
          ac.abort();
          cb(err);
        }
      };
    }
    __name(fromAsyncGen, "fromAsyncGen");
    function _duplexify(pair) {
      const r = pair.readable && typeof pair.readable.read !== "function" ? Readable2.wrap(pair.readable) : pair.readable;
      const w = pair.writable;
      let readable = !!isReadable(r);
      let writable = !!isWritable(w);
      let ondrain;
      let onfinish;
      let onreadable;
      let onclose;
      let d;
      function onfinished(err) {
        const cb = onclose;
        onclose = null;
        if (cb) {
          cb(err);
        } else if (err) {
          d.destroy(err);
        }
      }
      __name(onfinished, "onfinished");
      d = new Duplexify({
        // TODO (ronag): highWaterMark?
        readableObjectMode: !!(r !== null && r !== void 0 && r.readableObjectMode),
        writableObjectMode: !!(w !== null && w !== void 0 && w.writableObjectMode),
        readable,
        writable
      });
      if (writable) {
        eos(w, (err) => {
          writable = false;
          if (err) {
            destroyer(r, err);
          }
          onfinished(err);
        });
        d._write = function(chunk, encoding, callback) {
          if (w.write(chunk, encoding)) {
            callback();
          } else {
            ondrain = callback;
          }
        };
        d._final = function(callback) {
          w.end();
          onfinish = callback;
        };
        w.on("drain", function() {
          if (ondrain) {
            const cb = ondrain;
            ondrain = null;
            cb();
          }
        });
        w.on("finish", function() {
          if (onfinish) {
            const cb = onfinish;
            onfinish = null;
            cb();
          }
        });
      }
      if (readable) {
        eos(r, (err) => {
          readable = false;
          if (err) {
            destroyer(r, err);
          }
          onfinished(err);
        });
        r.on("readable", function() {
          if (onreadable) {
            const cb = onreadable;
            onreadable = null;
            cb();
          }
        });
        r.on("end", function() {
          d.push(null);
        });
        d._read = function() {
          while (true) {
            const buf = r.read();
            if (buf === null) {
              onreadable = d._read;
              return;
            }
            if (!d.push(buf)) {
              return;
            }
          }
        };
      }
      d._destroy = function(err, callback) {
        if (!err && onclose !== null) {
          err = new AbortError();
        }
        onreadable = null;
        ondrain = null;
        onfinish = null;
        if (onclose === null) {
          callback(err);
        } else {
          onclose = callback;
          destroyer(w, err);
          destroyer(r, err);
        }
      };
      return d;
    }
    __name(_duplexify, "_duplexify");
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/duplex.js
var require_duplex = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/duplex.js"(exports, module) {
    "use strict";
    init_globals();
    var {
      ObjectDefineProperties,
      ObjectGetOwnPropertyDescriptor,
      ObjectKeys,
      ObjectSetPrototypeOf
    } = require_primordials();
    module.exports = Duplex2;
    var Readable2 = require_readable();
    var Writable2 = require_writable();
    ObjectSetPrototypeOf(Duplex2.prototype, Readable2.prototype);
    ObjectSetPrototypeOf(Duplex2, Readable2);
    {
      const keys = ObjectKeys(Writable2.prototype);
      for (let i = 0; i < keys.length; i++) {
        const method = keys[i];
        if (!Duplex2.prototype[method]) Duplex2.prototype[method] = Writable2.prototype[method];
      }
    }
    function Duplex2(options) {
      if (!(this instanceof Duplex2)) return new Duplex2(options);
      Readable2.call(this, options);
      Writable2.call(this, options);
      if (options) {
        this.allowHalfOpen = options.allowHalfOpen !== false;
        if (options.readable === false) {
          this._readableState.readable = false;
          this._readableState.ended = true;
          this._readableState.endEmitted = true;
        }
        if (options.writable === false) {
          this._writableState.writable = false;
          this._writableState.ending = true;
          this._writableState.ended = true;
          this._writableState.finished = true;
        }
      } else {
        this.allowHalfOpen = true;
      }
    }
    __name(Duplex2, "Duplex");
    ObjectDefineProperties(Duplex2.prototype, {
      writable: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writable")
      },
      writableHighWaterMark: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableHighWaterMark")
      },
      writableObjectMode: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableObjectMode")
      },
      writableBuffer: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableBuffer")
      },
      writableLength: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableLength")
      },
      writableFinished: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableFinished")
      },
      writableCorked: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableCorked")
      },
      writableEnded: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableEnded")
      },
      writableNeedDrain: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableNeedDrain")
      },
      destroyed: {
        __proto__: null,
        get() {
          if (this._readableState === void 0 || this._writableState === void 0) {
            return false;
          }
          return this._readableState.destroyed && this._writableState.destroyed;
        },
        set(value) {
          if (this._readableState && this._writableState) {
            this._readableState.destroyed = value;
            this._writableState.destroyed = value;
          }
        }
      }
    });
    var webStreamsAdapters;
    function lazyWebStreams() {
      if (webStreamsAdapters === void 0) webStreamsAdapters = {};
      return webStreamsAdapters;
    }
    __name(lazyWebStreams, "lazyWebStreams");
    Duplex2.fromWeb = function(pair, options) {
      return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options);
    };
    Duplex2.toWeb = function(duplex) {
      return lazyWebStreams().newReadableWritablePairFromDuplex(duplex);
    };
    var duplexify;
    Duplex2.from = function(body) {
      if (!duplexify) {
        duplexify = require_duplexify();
      }
      return duplexify(body, "body");
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/transform.js
var require_transform = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/transform.js"(exports, module) {
    "use strict";
    init_globals();
    var { ObjectSetPrototypeOf, Symbol: Symbol2 } = require_primordials();
    module.exports = Transform2;
    var { ERR_METHOD_NOT_IMPLEMENTED } = require_errors().codes;
    var Duplex2 = require_duplex();
    var { getHighWaterMark } = require_state();
    ObjectSetPrototypeOf(Transform2.prototype, Duplex2.prototype);
    ObjectSetPrototypeOf(Transform2, Duplex2);
    var kCallback = Symbol2("kCallback");
    function Transform2(options) {
      if (!(this instanceof Transform2)) return new Transform2(options);
      const readableHighWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", true) : null;
      if (readableHighWaterMark === 0) {
        options = {
          ...options,
          highWaterMark: null,
          readableHighWaterMark,
          // TODO (ronag): 0 is not optimal since we have
          // a "bug" where we check needDrain before calling _write and not after.
          // Refs: https://github.com/nodejs/node/pull/32887
          // Refs: https://github.com/nodejs/node/pull/35941
          writableHighWaterMark: options.writableHighWaterMark || 0
        };
      }
      Duplex2.call(this, options);
      this._readableState.sync = false;
      this[kCallback] = null;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    __name(Transform2, "Transform");
    function final(cb) {
      if (typeof this._flush === "function" && !this.destroyed) {
        this._flush((er, data) => {
          if (er) {
            if (cb) {
              cb(er);
            } else {
              this.destroy(er);
            }
            return;
          }
          if (data != null) {
            this.push(data);
          }
          this.push(null);
          if (cb) {
            cb();
          }
        });
      } else {
        this.push(null);
        if (cb) {
          cb();
        }
      }
    }
    __name(final, "final");
    function prefinish() {
      if (this._final !== final) {
        final.call(this);
      }
    }
    __name(prefinish, "prefinish");
    Transform2.prototype._final = final;
    Transform2.prototype._transform = function(chunk, encoding, callback) {
      throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
    };
    Transform2.prototype._write = function(chunk, encoding, callback) {
      const rState = this._readableState;
      const wState = this._writableState;
      const length = rState.length;
      this._transform(chunk, encoding, (err, val) => {
        if (err) {
          callback(err);
          return;
        }
        if (val != null) {
          this.push(val);
        }
        if (wState.ended || // Backwards compat.
        length === rState.length || // Backwards compat.
        rState.length < rState.highWaterMark) {
          callback();
        } else {
          this[kCallback] = callback;
        }
      });
    };
    Transform2.prototype._read = function() {
      if (this[kCallback]) {
        const callback = this[kCallback];
        this[kCallback] = null;
        callback();
      }
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/passthrough.js
var require_passthrough = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/passthrough.js"(exports, module) {
    "use strict";
    init_globals();
    var { ObjectSetPrototypeOf } = require_primordials();
    module.exports = PassThrough2;
    var Transform2 = require_transform();
    ObjectSetPrototypeOf(PassThrough2.prototype, Transform2.prototype);
    ObjectSetPrototypeOf(PassThrough2, Transform2);
    function PassThrough2(options) {
      if (!(this instanceof PassThrough2)) return new PassThrough2(options);
      Transform2.call(this, options);
    }
    __name(PassThrough2, "PassThrough");
    PassThrough2.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
    init_globals();
    var process2 = require_process2();
    var { ArrayIsArray, Promise: Promise2, SymbolAsyncIterator, SymbolDispose } = require_primordials();
    var eos = require_end_of_stream();
    var { once } = require_util();
    var destroyImpl = require_destroy();
    var Duplex2 = require_duplex();
    var {
      aggregateTwoErrors,
      codes: {
        ERR_INVALID_ARG_TYPE,
        ERR_INVALID_RETURN_VALUE,
        ERR_MISSING_ARGS,
        ERR_STREAM_DESTROYED,
        ERR_STREAM_PREMATURE_CLOSE
      },
      AbortError
    } = require_errors();
    var { validateFunction, validateAbortSignal } = require_validators();
    var {
      isIterable,
      isReadable,
      isReadableNodeStream,
      isNodeStream,
      isTransformStream,
      isWebStream,
      isReadableStream,
      isReadableFinished
    } = require_utils();
    var AbortController = globalThis.AbortController || require_abort_controller().AbortController;
    var PassThrough2;
    var Readable2;
    var addAbortListener;
    function destroyer(stream2, reading, writing) {
      let finished2 = false;
      stream2.on("close", () => {
        finished2 = true;
      });
      const cleanup = eos(
        stream2,
        {
          readable: reading,
          writable: writing
        },
        (err) => {
          finished2 = !err;
        }
      );
      return {
        destroy: /* @__PURE__ */ __name((err) => {
          if (finished2) return;
          finished2 = true;
          destroyImpl.destroyer(stream2, err || new ERR_STREAM_DESTROYED("pipe"));
        }, "destroy"),
        cleanup
      };
    }
    __name(destroyer, "destroyer");
    function popCallback(streams) {
      validateFunction(streams[streams.length - 1], "streams[stream.length - 1]");
      return streams.pop();
    }
    __name(popCallback, "popCallback");
    function makeAsyncIterable(val) {
      if (isIterable(val)) {
        return val;
      } else if (isReadableNodeStream(val)) {
        return fromReadable(val);
      }
      throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable"], val);
    }
    __name(makeAsyncIterable, "makeAsyncIterable");
    async function* fromReadable(val) {
      if (!Readable2) {
        Readable2 = require_readable();
      }
      yield* Readable2.prototype[SymbolAsyncIterator].call(val);
    }
    __name(fromReadable, "fromReadable");
    async function pumpToNode(iterable, writable, finish, { end }) {
      let error;
      let onresolve = null;
      const resume = /* @__PURE__ */ __name((err) => {
        if (err) {
          error = err;
        }
        if (onresolve) {
          const callback = onresolve;
          onresolve = null;
          callback();
        }
      }, "resume");
      const wait = /* @__PURE__ */ __name(() => new Promise2((resolve2, reject) => {
        if (error) {
          reject(error);
        } else {
          onresolve = /* @__PURE__ */ __name(() => {
            if (error) {
              reject(error);
            } else {
              resolve2();
            }
          }, "onresolve");
        }
      }), "wait");
      writable.on("drain", resume);
      const cleanup = eos(
        writable,
        {
          readable: false
        },
        resume
      );
      try {
        if (writable.writableNeedDrain) {
          await wait();
        }
        for await (const chunk of iterable) {
          if (!writable.write(chunk)) {
            await wait();
          }
        }
        if (end) {
          writable.end();
          await wait();
        }
        finish();
      } catch (err) {
        finish(error !== err ? aggregateTwoErrors(error, err) : err);
      } finally {
        cleanup();
        writable.off("drain", resume);
      }
    }
    __name(pumpToNode, "pumpToNode");
    async function pumpToWeb(readable, writable, finish, { end }) {
      if (isTransformStream(writable)) {
        writable = writable.writable;
      }
      const writer = writable.getWriter();
      try {
        for await (const chunk of readable) {
          await writer.ready;
          writer.write(chunk).catch(() => {
          });
        }
        await writer.ready;
        if (end) {
          await writer.close();
        }
        finish();
      } catch (err) {
        try {
          await writer.abort(err);
          finish(err);
        } catch (err2) {
          finish(err2);
        }
      }
    }
    __name(pumpToWeb, "pumpToWeb");
    function pipeline2(...streams) {
      return pipelineImpl(streams, once(popCallback(streams)));
    }
    __name(pipeline2, "pipeline");
    function pipelineImpl(streams, callback, opts) {
      if (streams.length === 1 && ArrayIsArray(streams[0])) {
        streams = streams[0];
      }
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      const ac = new AbortController();
      const signal = ac.signal;
      const outerSignal = opts === null || opts === void 0 ? void 0 : opts.signal;
      const lastStreamCleanup = [];
      validateAbortSignal(outerSignal, "options.signal");
      function abort() {
        finishImpl(new AbortError());
      }
      __name(abort, "abort");
      addAbortListener = addAbortListener || require_util().addAbortListener;
      let disposable;
      if (outerSignal) {
        disposable = addAbortListener(outerSignal, abort);
      }
      let error;
      let value;
      const destroys = [];
      let finishCount = 0;
      function finish(err) {
        finishImpl(err, --finishCount === 0);
      }
      __name(finish, "finish");
      function finishImpl(err, final) {
        var _disposable;
        if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
          error = err;
        }
        if (!error && !final) {
          return;
        }
        while (destroys.length) {
          destroys.shift()(error);
        }
        ;
        (_disposable = disposable) === null || _disposable === void 0 ? void 0 : _disposable[SymbolDispose]();
        ac.abort();
        if (final) {
          if (!error) {
            lastStreamCleanup.forEach((fn) => fn());
          }
          process2.nextTick(callback, error, value);
        }
      }
      __name(finishImpl, "finishImpl");
      let ret;
      for (let i = 0; i < streams.length; i++) {
        const stream2 = streams[i];
        const reading = i < streams.length - 1;
        const writing = i > 0;
        const end = reading || (opts === null || opts === void 0 ? void 0 : opts.end) !== false;
        const isLastStream = i === streams.length - 1;
        if (isNodeStream(stream2)) {
          let onError2 = function(err) {
            if (err && err.name !== "AbortError" && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
              finish(err);
            }
          };
          var onError = onError2;
          __name(onError2, "onError");
          if (end) {
            const { destroy: destroy3, cleanup } = destroyer(stream2, reading, writing);
            destroys.push(destroy3);
            if (isReadable(stream2) && isLastStream) {
              lastStreamCleanup.push(cleanup);
            }
          }
          stream2.on("error", onError2);
          if (isReadable(stream2) && isLastStream) {
            lastStreamCleanup.push(() => {
              stream2.removeListener("error", onError2);
            });
          }
        }
        if (i === 0) {
          if (typeof stream2 === "function") {
            ret = stream2({
              signal
            });
            if (!isIterable(ret)) {
              throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
            }
          } else if (isIterable(stream2) || isReadableNodeStream(stream2) || isTransformStream(stream2)) {
            ret = stream2;
          } else {
            ret = Duplex2.from(stream2);
          }
        } else if (typeof stream2 === "function") {
          if (isTransformStream(ret)) {
            var _ret;
            ret = makeAsyncIterable((_ret = ret) === null || _ret === void 0 ? void 0 : _ret.readable);
          } else {
            ret = makeAsyncIterable(ret);
          }
          ret = stream2(ret, {
            signal
          });
          if (reading) {
            if (!isIterable(ret, true)) {
              throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
            }
          } else {
            var _ret2;
            if (!PassThrough2) {
              PassThrough2 = require_passthrough();
            }
            const pt = new PassThrough2({
              objectMode: true
            });
            const then = (_ret2 = ret) === null || _ret2 === void 0 ? void 0 : _ret2.then;
            if (typeof then === "function") {
              finishCount++;
              then.call(
                ret,
                (val) => {
                  value = val;
                  if (val != null) {
                    pt.write(val);
                  }
                  if (end) {
                    pt.end();
                  }
                  process2.nextTick(finish);
                },
                (err) => {
                  pt.destroy(err);
                  process2.nextTick(finish, err);
                }
              );
            } else if (isIterable(ret, true)) {
              finishCount++;
              pumpToNode(ret, pt, finish, {
                end
              });
            } else if (isReadableStream(ret) || isTransformStream(ret)) {
              const toRead = ret.readable || ret;
              finishCount++;
              pumpToNode(toRead, pt, finish, {
                end
              });
            } else {
              throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
            }
            ret = pt;
            const { destroy: destroy3, cleanup } = destroyer(ret, false, true);
            destroys.push(destroy3);
            if (isLastStream) {
              lastStreamCleanup.push(cleanup);
            }
          }
        } else if (isNodeStream(stream2)) {
          if (isReadableNodeStream(ret)) {
            finishCount += 2;
            const cleanup = pipe(ret, stream2, finish, {
              end
            });
            if (isReadable(stream2) && isLastStream) {
              lastStreamCleanup.push(cleanup);
            }
          } else if (isTransformStream(ret) || isReadableStream(ret)) {
            const toRead = ret.readable || ret;
            finishCount++;
            pumpToNode(toRead, stream2, finish, {
              end
            });
          } else if (isIterable(ret)) {
            finishCount++;
            pumpToNode(ret, stream2, finish, {
              end
            });
          } else {
            throw new ERR_INVALID_ARG_TYPE(
              "val",
              ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
              ret
            );
          }
          ret = stream2;
        } else if (isWebStream(stream2)) {
          if (isReadableNodeStream(ret)) {
            finishCount++;
            pumpToWeb(makeAsyncIterable(ret), stream2, finish, {
              end
            });
          } else if (isReadableStream(ret) || isIterable(ret)) {
            finishCount++;
            pumpToWeb(ret, stream2, finish, {
              end
            });
          } else if (isTransformStream(ret)) {
            finishCount++;
            pumpToWeb(ret.readable, stream2, finish, {
              end
            });
          } else {
            throw new ERR_INVALID_ARG_TYPE(
              "val",
              ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
              ret
            );
          }
          ret = stream2;
        } else {
          ret = Duplex2.from(stream2);
        }
      }
      if (signal !== null && signal !== void 0 && signal.aborted || outerSignal !== null && outerSignal !== void 0 && outerSignal.aborted) {
        process2.nextTick(abort);
      }
      return ret;
    }
    __name(pipelineImpl, "pipelineImpl");
    function pipe(src, dst, finish, { end }) {
      let ended = false;
      dst.on("close", () => {
        if (!ended) {
          finish(new ERR_STREAM_PREMATURE_CLOSE());
        }
      });
      src.pipe(dst, {
        end: false
      });
      if (end) {
        let endFn2 = function() {
          ended = true;
          dst.end();
        };
        var endFn = endFn2;
        __name(endFn2, "endFn");
        if (isReadableFinished(src)) {
          process2.nextTick(endFn2);
        } else {
          src.once("end", endFn2);
        }
      } else {
        finish();
      }
      eos(
        src,
        {
          readable: true,
          writable: false
        },
        (err) => {
          const rState = src._readableState;
          if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
            src.once("end", finish).once("error", finish);
          } else {
            finish(err);
          }
        }
      );
      return eos(
        dst,
        {
          readable: false,
          writable: true
        },
        finish
      );
    }
    __name(pipe, "pipe");
    module.exports = {
      pipelineImpl,
      pipeline: pipeline2
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/compose.js
var require_compose = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/compose.js"(exports, module) {
    "use strict";
    init_globals();
    var { pipeline: pipeline2 } = require_pipeline();
    var Duplex2 = require_duplex();
    var { destroyer } = require_destroy();
    var {
      isNodeStream,
      isReadable,
      isWritable,
      isWebStream,
      isTransformStream,
      isWritableStream,
      isReadableStream
    } = require_utils();
    var {
      AbortError,
      codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
    } = require_errors();
    var eos = require_end_of_stream();
    module.exports = /* @__PURE__ */ __name(function compose2(...streams) {
      if (streams.length === 0) {
        throw new ERR_MISSING_ARGS("streams");
      }
      if (streams.length === 1) {
        return Duplex2.from(streams[0]);
      }
      const orgStreams = [...streams];
      if (typeof streams[0] === "function") {
        streams[0] = Duplex2.from(streams[0]);
      }
      if (typeof streams[streams.length - 1] === "function") {
        const idx = streams.length - 1;
        streams[idx] = Duplex2.from(streams[idx]);
      }
      for (let n = 0; n < streams.length; ++n) {
        if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
          continue;
        }
        if (n < streams.length - 1 && !(isReadable(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))) {
          throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
        }
        if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
          throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
        }
      }
      let ondrain;
      let onfinish;
      let onreadable;
      let onclose;
      let d;
      function onfinished(err) {
        const cb = onclose;
        onclose = null;
        if (cb) {
          cb(err);
        } else if (err) {
          d.destroy(err);
        } else if (!readable && !writable) {
          d.destroy();
        }
      }
      __name(onfinished, "onfinished");
      const head = streams[0];
      const tail = pipeline2(streams, onfinished);
      const writable = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head));
      const readable = !!(isReadable(tail) || isReadableStream(tail) || isTransformStream(tail));
      d = new Duplex2({
        // TODO (ronag): highWaterMark?
        writableObjectMode: !!(head !== null && head !== void 0 && head.writableObjectMode),
        readableObjectMode: !!(tail !== null && tail !== void 0 && tail.readableObjectMode),
        writable,
        readable
      });
      if (writable) {
        if (isNodeStream(head)) {
          d._write = function(chunk, encoding, callback) {
            if (head.write(chunk, encoding)) {
              callback();
            } else {
              ondrain = callback;
            }
          };
          d._final = function(callback) {
            head.end();
            onfinish = callback;
          };
          head.on("drain", function() {
            if (ondrain) {
              const cb = ondrain;
              ondrain = null;
              cb();
            }
          });
        } else if (isWebStream(head)) {
          const writable2 = isTransformStream(head) ? head.writable : head;
          const writer = writable2.getWriter();
          d._write = async function(chunk, encoding, callback) {
            try {
              await writer.ready;
              writer.write(chunk).catch(() => {
              });
              callback();
            } catch (err) {
              callback(err);
            }
          };
          d._final = async function(callback) {
            try {
              await writer.ready;
              writer.close().catch(() => {
              });
              onfinish = callback;
            } catch (err) {
              callback(err);
            }
          };
        }
        const toRead = isTransformStream(tail) ? tail.readable : tail;
        eos(toRead, () => {
          if (onfinish) {
            const cb = onfinish;
            onfinish = null;
            cb();
          }
        });
      }
      if (readable) {
        if (isNodeStream(tail)) {
          tail.on("readable", function() {
            if (onreadable) {
              const cb = onreadable;
              onreadable = null;
              cb();
            }
          });
          tail.on("end", function() {
            d.push(null);
          });
          d._read = function() {
            while (true) {
              const buf = tail.read();
              if (buf === null) {
                onreadable = d._read;
                return;
              }
              if (!d.push(buf)) {
                return;
              }
            }
          };
        } else if (isWebStream(tail)) {
          const readable2 = isTransformStream(tail) ? tail.readable : tail;
          const reader = readable2.getReader();
          d._read = async function() {
            while (true) {
              try {
                const { value, done } = await reader.read();
                if (!d.push(value)) {
                  return;
                }
                if (done) {
                  d.push(null);
                  return;
                }
              } catch {
                return;
              }
            }
          };
        }
      }
      d._destroy = function(err, callback) {
        if (!err && onclose !== null) {
          err = new AbortError();
        }
        onreadable = null;
        ondrain = null;
        onfinish = null;
        if (onclose === null) {
          callback(err);
        } else {
          onclose = callback;
          if (isNodeStream(tail)) {
            destroyer(tail, err);
          }
        }
      };
      return d;
    }, "compose");
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/internal/streams/operators.js
var require_operators = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/internal/streams/operators.js"(exports, module) {
    "use strict";
    init_globals();
    var AbortController = globalThis.AbortController || require_abort_controller().AbortController;
    var {
      codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
      AbortError
    } = require_errors();
    var { validateAbortSignal, validateInteger, validateObject } = require_validators();
    var kWeakHandler = require_primordials().Symbol("kWeak");
    var kResistStopPropagation = require_primordials().Symbol("kResistStopPropagation");
    var { finished: finished2 } = require_end_of_stream();
    var staticCompose = require_compose();
    var { addAbortSignalNoValidate } = require_add_abort_signal();
    var { isWritable, isNodeStream } = require_utils();
    var { deprecate } = require_util();
    var {
      ArrayPrototypePush,
      Boolean: Boolean2,
      MathFloor,
      Number: Number2,
      NumberIsNaN,
      Promise: Promise2,
      PromiseReject,
      PromiseResolve,
      PromisePrototypeThen,
      Symbol: Symbol2
    } = require_primordials();
    var kEmpty = Symbol2("kEmpty");
    var kEof = Symbol2("kEof");
    function compose2(stream2, options) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      if (isNodeStream(stream2) && !isWritable(stream2)) {
        throw new ERR_INVALID_ARG_VALUE("stream", stream2, "must be writable");
      }
      const composedStream = staticCompose(this, stream2);
      if (options !== null && options !== void 0 && options.signal) {
        addAbortSignalNoValidate(options.signal, composedStream);
      }
      return composedStream;
    }
    __name(compose2, "compose");
    function map(fn, options) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      let concurrency = 1;
      if ((options === null || options === void 0 ? void 0 : options.concurrency) != null) {
        concurrency = MathFloor(options.concurrency);
      }
      let highWaterMark = concurrency - 1;
      if ((options === null || options === void 0 ? void 0 : options.highWaterMark) != null) {
        highWaterMark = MathFloor(options.highWaterMark);
      }
      validateInteger(concurrency, "options.concurrency", 1);
      validateInteger(highWaterMark, "options.highWaterMark", 0);
      highWaterMark += concurrency;
      return (/* @__PURE__ */ __name(async function* map2() {
        const signal = require_util().AbortSignalAny(
          [options === null || options === void 0 ? void 0 : options.signal].filter(Boolean2)
        );
        const stream2 = this;
        const queue = [];
        const signalOpt = {
          signal
        };
        let next;
        let resume;
        let done = false;
        let cnt = 0;
        function onCatch() {
          done = true;
          afterItemProcessed();
        }
        __name(onCatch, "onCatch");
        function afterItemProcessed() {
          cnt -= 1;
          maybeResume();
        }
        __name(afterItemProcessed, "afterItemProcessed");
        function maybeResume() {
          if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
            resume();
            resume = null;
          }
        }
        __name(maybeResume, "maybeResume");
        async function pump() {
          try {
            for await (let val of stream2) {
              if (done) {
                return;
              }
              if (signal.aborted) {
                throw new AbortError();
              }
              try {
                val = fn(val, signalOpt);
                if (val === kEmpty) {
                  continue;
                }
                val = PromiseResolve(val);
              } catch (err) {
                val = PromiseReject(err);
              }
              cnt += 1;
              PromisePrototypeThen(val, afterItemProcessed, onCatch);
              queue.push(val);
              if (next) {
                next();
                next = null;
              }
              if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
                await new Promise2((resolve2) => {
                  resume = resolve2;
                });
              }
            }
            queue.push(kEof);
          } catch (err) {
            const val = PromiseReject(err);
            PromisePrototypeThen(val, afterItemProcessed, onCatch);
            queue.push(val);
          } finally {
            done = true;
            if (next) {
              next();
              next = null;
            }
          }
        }
        __name(pump, "pump");
        pump();
        try {
          while (true) {
            while (queue.length > 0) {
              const val = await queue[0];
              if (val === kEof) {
                return;
              }
              if (signal.aborted) {
                throw new AbortError();
              }
              if (val !== kEmpty) {
                yield val;
              }
              queue.shift();
              maybeResume();
            }
            await new Promise2((resolve2) => {
              next = resolve2;
            });
          }
        } finally {
          done = true;
          if (resume) {
            resume();
            resume = null;
          }
        }
      }, "map")).call(this);
    }
    __name(map, "map");
    function asIndexedPairs(options = void 0) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      return (/* @__PURE__ */ __name(async function* asIndexedPairs2() {
        let index = 0;
        for await (const val of this) {
          var _options$signal;
          if (options !== null && options !== void 0 && (_options$signal = options.signal) !== null && _options$signal !== void 0 && _options$signal.aborted) {
            throw new AbortError({
              cause: options.signal.reason
            });
          }
          yield [index++, val];
        }
      }, "asIndexedPairs")).call(this);
    }
    __name(asIndexedPairs, "asIndexedPairs");
    async function some(fn, options = void 0) {
      for await (const unused of filter.call(this, fn, options)) {
        return true;
      }
      return false;
    }
    __name(some, "some");
    async function every(fn, options = void 0) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      return !await some.call(
        this,
        async (...args) => {
          return !await fn(...args);
        },
        options
      );
    }
    __name(every, "every");
    async function find(fn, options) {
      for await (const result of filter.call(this, fn, options)) {
        return result;
      }
      return void 0;
    }
    __name(find, "find");
    async function forEach(fn, options) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      async function forEachFn(value, options2) {
        await fn(value, options2);
        return kEmpty;
      }
      __name(forEachFn, "forEachFn");
      for await (const unused of map.call(this, forEachFn, options)) ;
    }
    __name(forEach, "forEach");
    function filter(fn, options) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      async function filterFn(value, options2) {
        if (await fn(value, options2)) {
          return value;
        }
        return kEmpty;
      }
      __name(filterFn, "filterFn");
      return map.call(this, filterFn, options);
    }
    __name(filter, "filter");
    var ReduceAwareErrMissingArgs = class extends ERR_MISSING_ARGS {
      static {
        __name(this, "ReduceAwareErrMissingArgs");
      }
      constructor() {
        super("reduce");
        this.message = "Reduce of an empty stream requires an initial value";
      }
    };
    async function reduce(reducer, initialValue, options) {
      var _options$signal2;
      if (typeof reducer !== "function") {
        throw new ERR_INVALID_ARG_TYPE("reducer", ["Function", "AsyncFunction"], reducer);
      }
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      let hasInitialValue = arguments.length > 1;
      if (options !== null && options !== void 0 && (_options$signal2 = options.signal) !== null && _options$signal2 !== void 0 && _options$signal2.aborted) {
        const err = new AbortError(void 0, {
          cause: options.signal.reason
        });
        this.once("error", () => {
        });
        await finished2(this.destroy(err));
        throw err;
      }
      const ac = new AbortController();
      const signal = ac.signal;
      if (options !== null && options !== void 0 && options.signal) {
        const opts = {
          once: true,
          [kWeakHandler]: this,
          [kResistStopPropagation]: true
        };
        options.signal.addEventListener("abort", () => ac.abort(), opts);
      }
      let gotAnyItemFromStream = false;
      try {
        for await (const value of this) {
          var _options$signal3;
          gotAnyItemFromStream = true;
          if (options !== null && options !== void 0 && (_options$signal3 = options.signal) !== null && _options$signal3 !== void 0 && _options$signal3.aborted) {
            throw new AbortError();
          }
          if (!hasInitialValue) {
            initialValue = value;
            hasInitialValue = true;
          } else {
            initialValue = await reducer(initialValue, value, {
              signal
            });
          }
        }
        if (!gotAnyItemFromStream && !hasInitialValue) {
          throw new ReduceAwareErrMissingArgs();
        }
      } finally {
        ac.abort();
      }
      return initialValue;
    }
    __name(reduce, "reduce");
    async function toArray(options) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      const result = [];
      for await (const val of this) {
        var _options$signal4;
        if (options !== null && options !== void 0 && (_options$signal4 = options.signal) !== null && _options$signal4 !== void 0 && _options$signal4.aborted) {
          throw new AbortError(void 0, {
            cause: options.signal.reason
          });
        }
        ArrayPrototypePush(result, val);
      }
      return result;
    }
    __name(toArray, "toArray");
    function flatMap(fn, options) {
      const values = map.call(this, fn, options);
      return (/* @__PURE__ */ __name(async function* flatMap2() {
        for await (const val of values) {
          yield* val;
        }
      }, "flatMap")).call(this);
    }
    __name(flatMap, "flatMap");
    function toIntegerOrInfinity(number) {
      number = Number2(number);
      if (NumberIsNaN(number)) {
        return 0;
      }
      if (number < 0) {
        throw new ERR_OUT_OF_RANGE("number", ">= 0", number);
      }
      return number;
    }
    __name(toIntegerOrInfinity, "toIntegerOrInfinity");
    function drop(number, options = void 0) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      number = toIntegerOrInfinity(number);
      return (/* @__PURE__ */ __name(async function* drop2() {
        var _options$signal5;
        if (options !== null && options !== void 0 && (_options$signal5 = options.signal) !== null && _options$signal5 !== void 0 && _options$signal5.aborted) {
          throw new AbortError();
        }
        for await (const val of this) {
          var _options$signal6;
          if (options !== null && options !== void 0 && (_options$signal6 = options.signal) !== null && _options$signal6 !== void 0 && _options$signal6.aborted) {
            throw new AbortError();
          }
          if (number-- <= 0) {
            yield val;
          }
        }
      }, "drop")).call(this);
    }
    __name(drop, "drop");
    function take(number, options = void 0) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      number = toIntegerOrInfinity(number);
      return (/* @__PURE__ */ __name(async function* take2() {
        var _options$signal7;
        if (options !== null && options !== void 0 && (_options$signal7 = options.signal) !== null && _options$signal7 !== void 0 && _options$signal7.aborted) {
          throw new AbortError();
        }
        for await (const val of this) {
          var _options$signal8;
          if (options !== null && options !== void 0 && (_options$signal8 = options.signal) !== null && _options$signal8 !== void 0 && _options$signal8.aborted) {
            throw new AbortError();
          }
          if (number-- > 0) {
            yield val;
          }
          if (number <= 0) {
            return;
          }
        }
      }, "take")).call(this);
    }
    __name(take, "take");
    module.exports.streamReturningOperators = {
      asIndexedPairs: deprecate(asIndexedPairs, "readable.asIndexedPairs will be removed in a future version."),
      drop,
      filter,
      flatMap,
      map,
      take,
      compose: compose2
    };
    module.exports.promiseReturningOperators = {
      every,
      forEach,
      reduce,
      toArray,
      some,
      find
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/stream/promises.js
var require_promises = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/stream/promises.js"(exports, module) {
    "use strict";
    init_globals();
    var { ArrayPrototypePop, Promise: Promise2 } = require_primordials();
    var { isIterable, isNodeStream, isWebStream } = require_utils();
    var { pipelineImpl: pl } = require_pipeline();
    var { finished: finished2 } = require_end_of_stream();
    require_stream2();
    function pipeline2(...streams) {
      return new Promise2((resolve2, reject) => {
        let signal;
        let end;
        const lastArg = streams[streams.length - 1];
        if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg) && !isWebStream(lastArg)) {
          const options = ArrayPrototypePop(streams);
          signal = options.signal;
          end = options.end;
        }
        pl(
          streams,
          (err, value) => {
            if (err) {
              reject(err);
            } else {
              resolve2(value);
            }
          },
          {
            signal,
            end
          }
        );
      });
    }
    __name(pipeline2, "pipeline");
    module.exports = {
      finished: finished2,
      pipeline: pipeline2
    };
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/stream.js
var require_stream2 = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/stream.js"(exports, module) {
    "use strict";
    init_globals();
    var { Buffer: Buffer2 } = require_buffer();
    var { ObjectDefineProperty, ObjectKeys, ReflectApply } = require_primordials();
    var {
      promisify: { custom: customPromisify }
    } = require_util();
    var { streamReturningOperators, promiseReturningOperators } = require_operators();
    var {
      codes: { ERR_ILLEGAL_CONSTRUCTOR }
    } = require_errors();
    var compose2 = require_compose();
    var { setDefaultHighWaterMark, getDefaultHighWaterMark } = require_state();
    var { pipeline: pipeline2 } = require_pipeline();
    var { destroyer } = require_destroy();
    var eos = require_end_of_stream();
    var promises3 = require_promises();
    var utils = require_utils();
    var Stream3 = module.exports = require_legacy().Stream;
    Stream3.isDestroyed = utils.isDestroyed;
    Stream3.isDisturbed = utils.isDisturbed;
    Stream3.isErrored = utils.isErrored;
    Stream3.isReadable = utils.isReadable;
    Stream3.isWritable = utils.isWritable;
    Stream3.Readable = require_readable();
    for (const key of ObjectKeys(streamReturningOperators)) {
      let fn = function(...args) {
        if (new.target) {
          throw ERR_ILLEGAL_CONSTRUCTOR();
        }
        return Stream3.Readable.from(ReflectApply(op, this, args));
      };
      __name(fn, "fn");
      const op = streamReturningOperators[key];
      ObjectDefineProperty(fn, "name", {
        __proto__: null,
        value: op.name
      });
      ObjectDefineProperty(fn, "length", {
        __proto__: null,
        value: op.length
      });
      ObjectDefineProperty(Stream3.Readable.prototype, key, {
        __proto__: null,
        value: fn,
        enumerable: false,
        configurable: true,
        writable: true
      });
    }
    for (const key of ObjectKeys(promiseReturningOperators)) {
      let fn = function(...args) {
        if (new.target) {
          throw ERR_ILLEGAL_CONSTRUCTOR();
        }
        return ReflectApply(op, this, args);
      };
      __name(fn, "fn");
      const op = promiseReturningOperators[key];
      ObjectDefineProperty(fn, "name", {
        __proto__: null,
        value: op.name
      });
      ObjectDefineProperty(fn, "length", {
        __proto__: null,
        value: op.length
      });
      ObjectDefineProperty(Stream3.Readable.prototype, key, {
        __proto__: null,
        value: fn,
        enumerable: false,
        configurable: true,
        writable: true
      });
    }
    Stream3.Writable = require_writable();
    Stream3.Duplex = require_duplex();
    Stream3.Transform = require_transform();
    Stream3.PassThrough = require_passthrough();
    Stream3.pipeline = pipeline2;
    var { addAbortSignal: addAbortSignal2 } = require_add_abort_signal();
    Stream3.addAbortSignal = addAbortSignal2;
    Stream3.finished = eos;
    Stream3.destroy = destroyer;
    Stream3.compose = compose2;
    Stream3.setDefaultHighWaterMark = setDefaultHighWaterMark;
    Stream3.getDefaultHighWaterMark = getDefaultHighWaterMark;
    ObjectDefineProperty(Stream3, "promises", {
      __proto__: null,
      configurable: true,
      enumerable: true,
      get() {
        return promises3;
      }
    });
    ObjectDefineProperty(pipeline2, customPromisify, {
      __proto__: null,
      enumerable: true,
      get() {
        return promises3.pipeline;
      }
    });
    ObjectDefineProperty(eos, customPromisify, {
      __proto__: null,
      enumerable: true,
      get() {
        return promises3.finished;
      }
    });
    Stream3.Stream = Stream3;
    Stream3._isUint8Array = /* @__PURE__ */ __name(function isUint8Array(value) {
      return value instanceof Uint8Array;
    }, "isUint8Array");
    Stream3._uint8ArrayToBuffer = /* @__PURE__ */ __name(function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    }, "_uint8ArrayToBuffer");
  }
});

// scripts/node-lab/node_modules/readable-stream/lib/ours/index.js
var require_ours = __commonJS({
  "scripts/node-lab/node_modules/readable-stream/lib/ours/index.js"(exports, module) {
    "use strict";
    init_globals();
    var Stream3 = require_stream();
    if (Stream3 && process.env.READABLE_STREAM === "disable") {
      const promises3 = Stream3.promises;
      module.exports._uint8ArrayToBuffer = Stream3._uint8ArrayToBuffer;
      module.exports._isUint8Array = Stream3._isUint8Array;
      module.exports.isDisturbed = Stream3.isDisturbed;
      module.exports.isErrored = Stream3.isErrored;
      module.exports.isReadable = Stream3.isReadable;
      module.exports.Readable = Stream3.Readable;
      module.exports.Writable = Stream3.Writable;
      module.exports.Duplex = Stream3.Duplex;
      module.exports.Transform = Stream3.Transform;
      module.exports.PassThrough = Stream3.PassThrough;
      module.exports.addAbortSignal = Stream3.addAbortSignal;
      module.exports.finished = Stream3.finished;
      module.exports.destroy = Stream3.destroy;
      module.exports.pipeline = Stream3.pipeline;
      module.exports.compose = Stream3.compose;
      Object.defineProperty(Stream3, "promises", {
        configurable: true,
        enumerable: true,
        get() {
          return promises3;
        }
      });
      module.exports.Stream = Stream3.Stream;
    } else {
      const CustomStream = require_stream2();
      const promises3 = require_promises();
      const originalDestroy = CustomStream.Readable.destroy;
      module.exports = CustomStream.Readable;
      module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
      module.exports._isUint8Array = CustomStream._isUint8Array;
      module.exports.isDisturbed = CustomStream.isDisturbed;
      module.exports.isErrored = CustomStream.isErrored;
      module.exports.isReadable = CustomStream.isReadable;
      module.exports.Readable = CustomStream.Readable;
      module.exports.Writable = CustomStream.Writable;
      module.exports.Duplex = CustomStream.Duplex;
      module.exports.Transform = CustomStream.Transform;
      module.exports.PassThrough = CustomStream.PassThrough;
      module.exports.addAbortSignal = CustomStream.addAbortSignal;
      module.exports.finished = CustomStream.finished;
      module.exports.destroy = CustomStream.destroy;
      module.exports.destroy = originalDestroy;
      module.exports.pipeline = CustomStream.pipeline;
      module.exports.compose = CustomStream.compose;
      Object.defineProperty(CustomStream, "promises", {
        configurable: true,
        enumerable: true,
        get() {
          return promises3;
        }
      });
      module.exports.Stream = CustomStream.Stream;
    }
    module.exports.default = module.exports;
  }
});

// src/academy/node/runtime/stream.js
var stream_exports = {};
__export(stream_exports, {
  Duplex: () => Duplex,
  PassThrough: () => PassThrough,
  Readable: () => Readable,
  Stream: () => Stream2,
  Transform: () => Transform,
  Writable: () => Writable,
  addAbortSignal: () => addAbortSignal,
  compose: () => compose,
  default: () => stream_default,
  destroy: () => destroy2,
  finished: () => finished,
  pipeline: () => pipeline,
  promises: () => promises
});
var rs, stream, stream_default, Readable, Writable, Duplex, Transform, PassThrough, Stream2, finished, pipeline, addAbortSignal, compose, destroy2, promises;
var init_stream = __esm({
  "src/academy/node/runtime/stream.js"() {
    init_globals();
    rs = __toESM(require_ours(), 1);
    stream = rs.default || rs.Stream;
    stream_default = stream;
    ({ Readable, Writable, Duplex, Transform, PassThrough, Stream: Stream2, finished, pipeline, addAbortSignal, compose } = rs);
    destroy2 = rs.destroy;
    promises = stream.promises;
  }
});

// scripts/node-lab/node_modules/path-browserify/index.js
var require_path_browserify = __commonJS({
  "scripts/node-lab/node_modules/path-browserify/index.js"(exports, module) {
    "use strict";
    init_globals();
    function assertPath(path2) {
      if (typeof path2 !== "string") {
        throw new TypeError("Path must be a string. Received " + JSON.stringify(path2));
      }
    }
    __name(assertPath, "assertPath");
    function normalizeStringPosix(path2, allowAboveRoot) {
      var res = "";
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var code;
      for (var i = 0; i <= path2.length; ++i) {
        if (i < path2.length)
          code = path2.charCodeAt(i);
        else if (code === 47)
          break;
        else
          code = 47;
        if (code === 47) {
          if (lastSlash === i - 1 || dots === 1) {
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf("/");
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = "";
                    lastSegmentLength = 0;
                  } else {
                    res = res.slice(0, lastSlashIndex);
                    lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                  }
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0)
                res += "/..";
              else
                res = "..";
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0)
              res += "/" + path2.slice(lastSlash + 1, i);
            else
              res = path2.slice(lastSlash + 1, i);
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === 46 && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    __name(normalizeStringPosix, "normalizeStringPosix");
    function _format(sep2, pathObject) {
      var dir = pathObject.dir || pathObject.root;
      var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep2 + base;
    }
    __name(_format, "_format");
    var posix2 = {
      // path.resolve([from ...], to)
      resolve: /* @__PURE__ */ __name(function resolve2() {
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd3;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path2;
          if (i >= 0)
            path2 = arguments[i];
          else {
            if (cwd3 === void 0)
              cwd3 = process.cwd();
            path2 = cwd3;
          }
          assertPath(path2);
          if (path2.length === 0) {
            continue;
          }
          resolvedPath = path2 + "/" + resolvedPath;
          resolvedAbsolute = path2.charCodeAt(0) === 47;
        }
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0)
            return "/" + resolvedPath;
          else
            return "/";
        } else if (resolvedPath.length > 0) {
          return resolvedPath;
        } else {
          return ".";
        }
      }, "resolve"),
      normalize: /* @__PURE__ */ __name(function normalize2(path2) {
        assertPath(path2);
        if (path2.length === 0) return ".";
        var isAbsolute2 = path2.charCodeAt(0) === 47;
        var trailingSeparator = path2.charCodeAt(path2.length - 1) === 47;
        path2 = normalizeStringPosix(path2, !isAbsolute2);
        if (path2.length === 0 && !isAbsolute2) path2 = ".";
        if (path2.length > 0 && trailingSeparator) path2 += "/";
        if (isAbsolute2) return "/" + path2;
        return path2;
      }, "normalize"),
      isAbsolute: /* @__PURE__ */ __name(function isAbsolute2(path2) {
        assertPath(path2);
        return path2.length > 0 && path2.charCodeAt(0) === 47;
      }, "isAbsolute"),
      join: /* @__PURE__ */ __name(function join2() {
        if (arguments.length === 0)
          return ".";
        var joined;
        for (var i = 0; i < arguments.length; ++i) {
          var arg = arguments[i];
          assertPath(arg);
          if (arg.length > 0) {
            if (joined === void 0)
              joined = arg;
            else
              joined += "/" + arg;
          }
        }
        if (joined === void 0)
          return ".";
        return posix2.normalize(joined);
      }, "join"),
      relative: /* @__PURE__ */ __name(function relative2(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to) return "";
        from = posix2.resolve(from);
        to = posix2.resolve(to);
        if (from === to) return "";
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
          if (from.charCodeAt(fromStart) !== 47)
            break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        var toStart = 1;
        for (; toStart < to.length; ++toStart) {
          if (to.charCodeAt(toStart) !== 47)
            break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
          if (i === length) {
            if (toLen > length) {
              if (to.charCodeAt(toStart + i) === 47) {
                return to.slice(toStart + i + 1);
              } else if (i === 0) {
                return to.slice(toStart + i);
              }
            } else if (fromLen > length) {
              if (from.charCodeAt(fromStart + i) === 47) {
                lastCommonSep = i;
              } else if (i === 0) {
                lastCommonSep = 0;
              }
            }
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i);
          var toCode = to.charCodeAt(toStart + i);
          if (fromCode !== toCode)
            break;
          else if (fromCode === 47)
            lastCommonSep = i;
        }
        var out = "";
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
          if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0)
              out += "..";
            else
              out += "/..";
          }
        }
        if (out.length > 0)
          return out + to.slice(toStart + lastCommonSep);
        else {
          toStart += lastCommonSep;
          if (to.charCodeAt(toStart) === 47)
            ++toStart;
          return to.slice(toStart);
        }
      }, "relative"),
      _makeLong: /* @__PURE__ */ __name(function _makeLong(path2) {
        return path2;
      }, "_makeLong"),
      dirname: /* @__PURE__ */ __name(function dirname2(path2) {
        assertPath(path2);
        if (path2.length === 0) return ".";
        var code = path2.charCodeAt(0);
        var hasRoot = code === 47;
        var end = -1;
        var matchedSlash = true;
        for (var i = path2.length - 1; i >= 1; --i) {
          code = path2.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              end = i;
              break;
            }
          } else {
            matchedSlash = false;
          }
        }
        if (end === -1) return hasRoot ? "/" : ".";
        if (hasRoot && end === 1) return "//";
        return path2.slice(0, end);
      }, "dirname"),
      basename: /* @__PURE__ */ __name(function basename2(path2, ext) {
        if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
        assertPath(path2);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
          if (ext.length === path2.length && ext === path2) return "";
          var extIdx = ext.length - 1;
          var firstNonSlashEnd = -1;
          for (i = path2.length - 1; i >= 0; --i) {
            var code = path2.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else {
              if (firstNonSlashEnd === -1) {
                matchedSlash = false;
                firstNonSlashEnd = i + 1;
              }
              if (extIdx >= 0) {
                if (code === ext.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    end = i;
                  }
                } else {
                  extIdx = -1;
                  end = firstNonSlashEnd;
                }
              }
            }
          }
          if (start === end) end = firstNonSlashEnd;
          else if (end === -1) end = path2.length;
          return path2.slice(start, end);
        } else {
          for (i = path2.length - 1; i >= 0; --i) {
            if (path2.charCodeAt(i) === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
          }
          if (end === -1) return "";
          return path2.slice(start, end);
        }
      }, "basename"),
      extname: /* @__PURE__ */ __name(function extname2(path2) {
        assertPath(path2);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var preDotState = 0;
        for (var i = path2.length - 1; i >= 0; --i) {
          var code = path2.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46) {
            if (startDot === -1)
              startDot = i;
            else if (preDotState !== 1)
              preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          return "";
        }
        return path2.slice(startDot, end);
      }, "extname"),
      format: /* @__PURE__ */ __name(function format2(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format("/", pathObject);
      }, "format"),
      parse: /* @__PURE__ */ __name(function parse2(path2) {
        assertPath(path2);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path2.length === 0) return ret;
        var code = path2.charCodeAt(0);
        var isAbsolute2 = code === 47;
        var start;
        if (isAbsolute2) {
          ret.root = "/";
          start = 1;
        } else {
          start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path2.length - 1;
        var preDotState = 0;
        for (; i >= start; --i) {
          code = path2.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute2) ret.base = ret.name = path2.slice(1, end);
            else ret.base = ret.name = path2.slice(startPart, end);
          }
        } else {
          if (startPart === 0 && isAbsolute2) {
            ret.name = path2.slice(1, startDot);
            ret.base = path2.slice(1, end);
          } else {
            ret.name = path2.slice(startPart, startDot);
            ret.base = path2.slice(startPart, end);
          }
          ret.ext = path2.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path2.slice(0, startPart - 1);
        else if (isAbsolute2) ret.dir = "/";
        return ret;
      }, "parse"),
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null
    };
    posix2.posix = posix2;
    module.exports = posix2;
  }
});

// src/academy/node/runtime/path.js
var path_exports = {};
__export(path_exports, {
  basename: () => basename,
  default: () => path_default,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep
});
var import_path_browserify, cwd, posix, path_default, join, dirname, basename, extname, normalize, relative, isAbsolute, sep, delimiter, parse, format, resolve;
var init_path = __esm({
  "src/academy/node/runtime/path.js"() {
    init_globals();
    import_path_browserify = __toESM(require_path_browserify(), 1);
    init_context();
    cwd = /* @__PURE__ */ __name(() => ctx.machine?.cwd || "/app", "cwd");
    posix = {
      ...import_path_browserify.default,
      resolve: /* @__PURE__ */ __name((...parts) => import_path_browserify.default.resolve(cwd(), ...parts), "resolve"),
      matchesGlob: void 0,
      toNamespacedPath: /* @__PURE__ */ __name((p) => p, "toNamespacedPath")
    };
    posix.posix = posix;
    posix.win32 = posix;
    path_default = posix;
    ({ join, dirname, basename, extname, normalize, relative, isAbsolute, sep, delimiter, parse, format } = posix);
    resolve = posix.resolve;
  }
});

// src/academy/node/runtime/fs.js
var fs_exports = {};
__export(fs_exports, {
  Dirent: () => Dirent,
  F_OK: () => F_OK,
  R_OK: () => R_OK,
  ReadStream: () => ReadStream,
  Stats: () => Stats,
  Volume: () => Volume,
  W_OK: () => W_OK,
  WriteStream: () => WriteStream,
  X_OK: () => X_OK,
  access: () => access,
  accessSync: () => accessSync,
  appendFile: () => appendFile,
  appendFileSync: () => appendFileSync,
  chmod: () => chmod,
  chmodSync: () => chmodSync,
  close: () => close,
  closeSync: () => closeSync,
  constants: () => constants,
  copyFile: () => copyFile,
  copyFileSync: () => copyFileSync,
  createReadStream: () => createReadStream,
  createWriteStream: () => createWriteStream,
  default: () => fs_default,
  exists: () => exists,
  existsSync: () => existsSync,
  fsError: () => fsError,
  fstat: () => fstat,
  fstatSync: () => fstatSync,
  fsync: () => fsync,
  fsyncSync: () => fsyncSync,
  lstat: () => lstat,
  lstatSync: () => lstatSync,
  mkdir: () => mkdir,
  mkdirSync: () => mkdirSync,
  mkdtemp: () => mkdtemp,
  mkdtempSync: () => mkdtempSync,
  open: () => open,
  openSync: () => openSync,
  promises: () => promises2,
  readFile: () => readFile,
  readFileSync: () => readFileSync,
  readdir: () => readdir,
  readdirSync: () => readdirSync,
  realpath: () => realpath,
  realpathSync: () => realpathSync,
  rename: () => rename,
  renameSync: () => renameSync,
  rm: () => rm,
  rmSync: () => rmSync,
  rmdir: () => rmdir,
  rmdirSync: () => rmdirSync,
  stat: () => stat,
  statSync: () => statSync,
  unlink: () => unlink,
  unlinkSync: () => unlinkSync,
  utimesSync: () => utimesSync,
  watch: () => watch,
  write: () => write,
  writeFile: () => writeFile,
  writeFileSync: () => writeFileSync,
  writeSync: () => writeSync
});
function fsError(code, syscall, path2, dest) {
  const where = path2 === void 0 ? "" : ` '${path2}'${dest ? ` -> '${dest}'` : ""}`;
  const err = new Error(`${code}: ${TEXT[code]}, ${syscall}${where}`);
  err.errno = ERRNO[code];
  err.code = code;
  err.syscall = syscall;
  if (path2 !== void 0) err.path = path2;
  if (dest !== void 0) err.dest = dest;
  return err;
}
function toPath(p) {
  if (p instanceof URL) p = decodeURIComponent(p.pathname);
  if (Buffer.isBuffer(p)) p = p.toString();
  if (typeof p !== "string") {
    const err = new TypeError(`The "path" argument must be of type string or an instance of Buffer or URL. Received ${p === void 0 ? "undefined" : typeof p}`);
    err.code = "ERR_INVALID_ARG_TYPE";
    throw err;
  }
  return p;
}
function encodingOf(options) {
  if (typeof options === "string") return options;
  return options?.encoding ?? null;
}
function checkParent(p, syscall) {
  const parent = vol().node(path_default.dirname(p));
  if (!parent) throw fsError("ENOENT", syscall, p);
  if (parent.type !== "dir") throw fsError("ENOTDIR", syscall, p);
}
function existsSync(p) {
  try {
    return vol().nodes.has(abs(p));
  } catch {
    return false;
  }
}
function readFileSync(p, options) {
  if (typeof p === "number") throw fsError("EBADF", "read");
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "open", a);
  if (n.type === "dir") throw fsError("EISDIR", "read");
  const enc = encodingOf(options);
  const copy = Buffer.from(n.data);
  return enc ? copy.toString(enc) : copy;
}
function writeImpl(p, data, options, append, syscall = "open") {
  const a = abs(p);
  const existing = vol().node(a);
  if (existing?.type === "dir") throw fsError("EISDIR", syscall, a);
  checkParent(a, syscall);
  const flag = typeof options === "object" && options ? options.flag : void 0;
  if (flag === "wx" && existing) throw fsError("EEXIST", syscall, a);
  const enc = encodingOf(options) || "utf8";
  let buf;
  if (typeof data === "string") buf = Buffer.from(data, enc);
  else if (ArrayBuffer.isView(data)) buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  else {
    const err = new TypeError(`The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received ${data === null ? "null" : typeof data === "object" ? "an instance of " + (data.constructor?.name || "Object") : `type ${typeof data} (${String(data)})`}`);
    err.code = "ERR_INVALID_ARG_TYPE";
    throw err;
  }
  const next = append || flag === "a" ? Buffer.concat([existing?.data || Buffer.alloc(0), buf]) : buf;
  vol().write(a, next);
}
function writeFileSync(p, data, options) {
  writeImpl(p, data, options, false);
}
function appendFileSync(p, data, options) {
  writeImpl(p, data, options, true);
}
function mkdirSync(p, options) {
  const a = abs(p);
  const recursive = typeof options === "object" && options?.recursive;
  const v = vol();
  if (v.node(a)) {
    if (recursive && v.node(a).type === "dir") return void 0;
    throw fsError("EEXIST", "mkdir", a);
  }
  if (recursive) {
    let first = a;
    let cur = a;
    while (cur !== "/" && !v.node(cur)) {
      first = cur;
      cur = path_default.dirname(cur);
    }
    if (v.node(cur)?.type !== "dir") throw fsError("ENOTDIR", "mkdir", a);
    v.mkdirp(a);
    return first;
  }
  checkParent(a, "mkdir");
  v.mkdirp(a);
  return void 0;
}
function readdirSync(p, options) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "scandir", a);
  if (n.type !== "dir") throw fsError("ENOTDIR", "scandir", a);
  const names = vol().children(a);
  if (options?.withFileTypes) return names.map((name) => new Dirent(name, vol().node(path_default.join(a, name)), a));
  if (options?.recursive) {
    const out = [];
    const walk = /* @__PURE__ */ __name((dir, rel) => {
      for (const name of vol().children(dir)) {
        const r = rel ? `${rel}/${name}` : name;
        out.push(r);
        if (vol().node(path_default.join(dir, name)).type === "dir") walk(path_default.join(dir, name), r);
      }
    }, "walk");
    walk(a, "");
    return out;
  }
  return names;
}
function statSync(p, options) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) {
    if (options?.throwIfNoEntry === false) return void 0;
    throw fsError("ENOENT", "stat", a);
  }
  return new Stats(n);
}
function unlinkSync(p) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "unlink", a);
  if (n.type === "dir") throw fsError("EISDIR", "unlink", a);
  vol().nodes.delete(a);
}
function rmSync(p, options = {}) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) {
    if (options.force) return;
    throw fsError("ENOENT", "rm", a);
  }
  if (n.type === "dir") {
    if (!options.recursive) {
      const err = new Error(`Path is a directory: rm returned EISDIR (is a directory) ${a}`);
      err.code = "ERR_FS_EISDIR";
      throw err;
    }
    for (const key of [...vol().nodes.keys()]) if (key === a || key.startsWith(a + "/")) vol().nodes.delete(key);
    return;
  }
  vol().nodes.delete(a);
}
function rmdirSync(p) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "rmdir", a);
  if (n.type !== "dir") throw fsError("ENOTDIR", "rmdir", a);
  if (vol().children(a).length) throw fsError("ENOTEMPTY", "rmdir", a);
  vol().nodes.delete(a);
}
function renameSync(from, to) {
  const a = abs(from);
  const b = abs(to);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "rename", a, b);
  checkParent(b, "rename");
  const moves = [...vol().nodes.entries()].filter(([k]) => k === a || k.startsWith(a + "/"));
  for (const [k] of moves) vol().nodes.delete(k);
  for (const [k, v] of moves) vol().nodes.set(b + k.slice(a.length), v);
}
function copyFileSync(from, to) {
  const a = abs(from);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "copyfile", a, abs(to));
  if (n.type === "dir") throw fsError("EISDIR", "copyfile", a, abs(to));
  checkParent(abs(to), "copyfile");
  vol().write(abs(to), n.data);
}
function accessSync(p) {
  const a = abs(p);
  if (!vol().node(a)) throw fsError("ENOENT", "access", a);
}
function realpathSync(p) {
  const a = abs(p);
  if (!vol().node(a)) throw fsError("ENOENT", "realpath", a);
  return a;
}
function mkdtempSync(prefix) {
  const p = `${prefix}${(++tmpSeq).toString(36).padStart(6, "x")}`;
  mkdirSync(p, { recursive: true });
  return abs(p);
}
function chmodSync(p, mode) {
  const n = vol().node(abs(p));
  if (!n) throw fsError("ENOENT", "chmod", abs(p));
  n.mode = n.mode & ~511 | Number(mode) & 511;
}
function utimesSync(p, atime, mtime) {
  const n = vol().node(abs(p));
  if (!n) throw fsError("ENOENT", "utime", abs(p));
  n.mtime = typeof mtime === "number" ? mtime * 1e3 : new Date(mtime).getTime();
}
function openSync(p, flags = "r") {
  const a = abs(p);
  const n = vol().node(a);
  if (String(flags).startsWith("r") && !n) throw fsError("ENOENT", "open", a);
  if (!n) writeImpl(a, "", {}, false);
  if (String(flags).startsWith("w")) vol().write(a, "");
  const fd = ++fdSeq;
  fds.set(fd, a);
  return fd;
}
function writeSync(fd, data) {
  if (fd === 1 || fd === 2) {
    ctx.machine?.writeStd(fd === 1 ? "stdout" : "stderr", String(data));
    return String(data).length;
  }
  const p = fds.get(fd);
  if (!p) throw fsError("EBADF", "write");
  appendFileSync(p, data);
  return Buffer.byteLength(String(data));
}
function closeSync(fd) {
  fds.delete(fd);
}
function fsyncSync() {
}
function fstatSync(fd) {
  const p = fds.get(fd);
  if (!p) throw fsError("EBADF", "fstat");
  return statSync(p);
}
function later(fn) {
  const loop = ctx.loop;
  if (loop) loop.setImmediate(fn);
  else queueMicrotask(fn);
}
function callbackify(sync) {
  return function(...args) {
    const cb = args.pop();
    if (typeof cb !== "function") {
      const err = new TypeError(`The "cb" argument must be of type function. Received ${cb === void 0 ? "undefined" : typeof cb}`);
      err.code = "ERR_INVALID_ARG_TYPE";
      throw err;
    }
    let result;
    let error = null;
    try {
      result = sync(...args);
    } catch (e) {
      error = e;
    }
    later(() => error ? cb(error) : cb(null, result));
  };
}
function exists(p, cb) {
  const r = existsSync(p);
  later(() => cb(r));
}
function write(fd, data, ...rest) {
  const cb = rest.pop();
  let n = 0;
  let error = null;
  try {
    n = writeSync(fd, data);
  } catch (e) {
    error = e;
  }
  later(() => cb(error, n, data));
}
function fsync(fd, cb) {
  later(() => cb(null));
}
function promisify(sync) {
  return (...args) => new Promise((resolve2, reject) => {
    let result;
    try {
      result = sync(...args);
    } catch (e) {
      later(() => reject(e));
      return;
    }
    later(() => resolve2(result));
  });
}
function createReadStream(p, options) {
  return new ReadStream(abs(p), options);
}
function createWriteStream(p, options) {
  return new WriteStream(abs(p), options);
}
function watch() {
  return { close() {
  }, on() {
    return this;
  }, unref() {
    return this;
  }, ref() {
    return this;
  } };
}
var ERRNO, TEXT, Volume, vol, cwd2, abs, Stats, Dirent, lstatSync, tmpSeq, fds, fdSeq, readFile, writeFile, appendFile, mkdir, readdir, stat, lstat, unlink, rm, rmdir, rename, copyFile, access, realpath, mkdtemp, chmod, open, close, fstat, FileHandle, promises2, ReadStream, WriteStream, constants, F_OK, R_OK, W_OK, X_OK, fs, fs_default;
var init_fs = __esm({
  "src/academy/node/runtime/fs.js"() {
    init_globals();
    init_buffer();
    init_stream();
    init_path();
    init_context();
    ERRNO = { ENOENT: -2, EISDIR: -21, EEXIST: -17, ENOTDIR: -20, ENOTEMPTY: -39, EACCES: -13, EBADF: -9, EINVAL: -22 };
    TEXT = {
      ENOENT: "no such file or directory",
      EISDIR: "illegal operation on a directory",
      EEXIST: "file already exists",
      ENOTDIR: "not a directory",
      ENOTEMPTY: "directory not empty",
      EACCES: "permission denied",
      EBADF: "bad file descriptor",
      EINVAL: "invalid argument"
    };
    __name(fsError, "fsError");
    Volume = class {
      static {
        __name(this, "Volume");
      }
      constructor(now = () => Date.now()) {
        this.now = now;
        this.nodes = /* @__PURE__ */ new Map();
        this.mkdirp("/");
      }
      /** Seed files: { "server.js": "…", "data/notes.json": "…" } under `root`. */
      load(files, root = "/app") {
        this.mkdirp(root);
        for (const [name, content] of Object.entries(files || {})) {
          const abs2 = path_default.resolve(root, name);
          this.mkdirp(path_default.dirname(abs2));
          this.write(abs2, content);
        }
      }
      node(p) {
        return this.nodes.get(p);
      }
      mkdirp(p) {
        const parts = p.split("/").filter(Boolean);
        let cur = "";
        if (!this.nodes.has("/")) this.nodes.set("/", { type: "dir", mtime: this.now(), birthtime: this.now(), mode: 16877 });
        for (const part of parts) {
          cur += "/" + part;
          const n = this.nodes.get(cur);
          if (!n) this.nodes.set(cur, { type: "dir", mtime: this.now(), birthtime: this.now(), mode: 16877 });
        }
      }
      write(p, content) {
        const data = typeof content === "string" ? Buffer.from(content, "utf8") : Buffer.from(content);
        const prev = this.nodes.get(p);
        this.nodes.set(p, { type: "file", data, mtime: this.now(), birthtime: prev?.birthtime || this.now(), mode: prev?.mode || 33188 });
      }
      children(p) {
        const prefix = p === "/" ? "/" : p + "/";
        const out = [];
        for (const key of this.nodes.keys()) {
          if (key !== p && key.startsWith(prefix) && !key.slice(prefix.length).includes("/")) out.push(key.slice(prefix.length));
        }
        return out.sort();
      }
      /** Every file as { relative path: text } (for checks and the editor). */
      snapshot(root = "/app") {
        const out = {};
        for (const [key, n] of this.nodes) {
          if (n.type === "file" && key.startsWith(root + "/")) out[key.slice(root.length + 1)] = n.data.toString("utf8");
        }
        return out;
      }
    };
    vol = /* @__PURE__ */ __name(() => {
      if (!ctx.vol) throw new Error("No lab machine is running");
      return ctx.vol;
    }, "vol");
    cwd2 = /* @__PURE__ */ __name(() => ctx.machine?.cwd || "/app", "cwd");
    __name(toPath, "toPath");
    abs = /* @__PURE__ */ __name((p) => path_default.resolve(cwd2(), toPath(p)), "abs");
    __name(encodingOf, "encodingOf");
    Stats = class {
      static {
        __name(this, "Stats");
      }
      constructor(n) {
        const t = /* @__PURE__ */ __name((v) => new Date(v), "t");
        this.dev = 2049;
        this.mode = n.mode;
        this.nlink = 1;
        this.uid = 1e3;
        this.gid = 1e3;
        this.rdev = 0;
        this.blksize = 4096;
        this.ino = 0;
        this.size = n.type === "file" ? n.data.length : 4096;
        this.blocks = Math.ceil(this.size / 512);
        this.atimeMs = n.mtime;
        this.mtimeMs = n.mtime;
        this.ctimeMs = n.mtime;
        this.birthtimeMs = n.birthtime;
        this.atime = t(n.mtime);
        this.mtime = t(n.mtime);
        this.ctime = t(n.mtime);
        this.birthtime = t(n.birthtime);
        Object.defineProperty(this, "_type", { value: n.type });
      }
      isFile() {
        return this._type === "file";
      }
      isDirectory() {
        return this._type === "dir";
      }
      isSymbolicLink() {
        return false;
      }
      isFIFO() {
        return false;
      }
      isSocket() {
        return false;
      }
      isBlockDevice() {
        return false;
      }
      isCharacterDevice() {
        return false;
      }
    };
    Dirent = class {
      static {
        __name(this, "Dirent");
      }
      constructor(name, n, parentPath) {
        this.name = name;
        this.parentPath = parentPath;
        this.path = parentPath;
        Object.defineProperty(this, "_type", { value: n.type });
      }
      isFile() {
        return this._type === "file";
      }
      isDirectory() {
        return this._type === "dir";
      }
      isSymbolicLink() {
        return false;
      }
    };
    __name(checkParent, "checkParent");
    __name(existsSync, "existsSync");
    __name(readFileSync, "readFileSync");
    __name(writeImpl, "writeImpl");
    __name(writeFileSync, "writeFileSync");
    __name(appendFileSync, "appendFileSync");
    __name(mkdirSync, "mkdirSync");
    __name(readdirSync, "readdirSync");
    __name(statSync, "statSync");
    lstatSync = statSync;
    __name(unlinkSync, "unlinkSync");
    __name(rmSync, "rmSync");
    __name(rmdirSync, "rmdirSync");
    __name(renameSync, "renameSync");
    __name(copyFileSync, "copyFileSync");
    __name(accessSync, "accessSync");
    __name(realpathSync, "realpathSync");
    realpathSync.native = realpathSync;
    tmpSeq = 0;
    __name(mkdtempSync, "mkdtempSync");
    __name(chmodSync, "chmodSync");
    __name(utimesSync, "utimesSync");
    fds = /* @__PURE__ */ new Map();
    fdSeq = 10;
    __name(openSync, "openSync");
    __name(writeSync, "writeSync");
    __name(closeSync, "closeSync");
    __name(fsyncSync, "fsyncSync");
    __name(fstatSync, "fstatSync");
    __name(later, "later");
    __name(callbackify, "callbackify");
    readFile = callbackify(readFileSync);
    writeFile = callbackify(writeFileSync);
    appendFile = callbackify(appendFileSync);
    mkdir = callbackify(mkdirSync);
    readdir = callbackify(readdirSync);
    stat = callbackify(statSync);
    lstat = callbackify(statSync);
    unlink = callbackify(unlinkSync);
    rm = callbackify(rmSync);
    rmdir = callbackify(rmdirSync);
    rename = callbackify(renameSync);
    copyFile = callbackify(copyFileSync);
    access = callbackify(accessSync);
    realpath = callbackify(realpathSync);
    realpath.native = realpath;
    mkdtemp = callbackify(mkdtempSync);
    chmod = callbackify(chmodSync);
    open = callbackify(openSync);
    close = callbackify(closeSync);
    fstat = callbackify(fstatSync);
    __name(exists, "exists");
    __name(write, "write");
    __name(fsync, "fsync");
    __name(promisify, "promisify");
    FileHandle = class {
      static {
        __name(this, "FileHandle");
      }
      constructor(path2, flags) {
        this.path = path2;
        this.flags = flags;
        this.fd = ++fdSeq;
      }
      readFile(options) {
        return promises2.readFile(this.path, options);
      }
      writeFile(data, options) {
        return promises2.writeFile(this.path, data, options);
      }
      appendFile(data, options) {
        return promises2.appendFile(this.path, data, options);
      }
      stat() {
        return promises2.stat(this.path);
      }
      async close() {
      }
      async sync() {
      }
    };
    promises2 = {
      readFile: promisify(readFileSync),
      writeFile: promisify(writeFileSync),
      appendFile: promisify(appendFileSync),
      mkdir: promisify(mkdirSync),
      readdir: promisify(readdirSync),
      stat: promisify(statSync),
      lstat: promisify(statSync),
      unlink: promisify(unlinkSync),
      rm: promisify(rmSync),
      rmdir: promisify(rmdirSync),
      rename: promisify(renameSync),
      copyFile: promisify(copyFileSync),
      access: promisify(accessSync),
      realpath: promisify(realpathSync),
      mkdtemp: promisify(mkdtempSync),
      chmod: promisify(chmodSync),
      utimes: promisify(utimesSync),
      open: promisify((p, flags = "r") => {
        const a = abs(p);
        if (String(flags).startsWith("r") && !vol().node(a)) throw fsError("ENOENT", "open", a);
        if (String(flags).startsWith("w")) writeImpl(a, "", {}, false);
        return new FileHandle(a, flags);
      }),
      constants: void 0
    };
    ReadStream = class extends Readable {
      static {
        __name(this, "ReadStream");
      }
      constructor(p, options = {}) {
        if (typeof options === "string") options = { encoding: options };
        super({ highWaterMark: options.highWaterMark || 64 * 1024, encoding: options.encoding });
        this.path = typeof p === "string" ? p : toPath(p);
        this.start = options.start;
        this.end = options.end;
        this.bytesRead = 0;
        this.pending = true;
        this._data = null;
        this._pos = 0;
      }
      _read(size) {
        if (!this._data) {
          try {
            const all = readFileSync(this.path);
            const s = this.start || 0;
            const e = this.end === void 0 ? all.length : this.end + 1;
            this._data = all.subarray(s, e);
            this.pending = false;
            this.emit("open", 3);
            this.emit("ready");
          } catch (err) {
            later(() => this.destroy(err));
            return;
          }
        }
        const chunk = this._data.subarray(this._pos, this._pos + size);
        this._pos += chunk.length;
        this.bytesRead += chunk.length;
        later(() => this.push(chunk.length ? chunk : null));
      }
      close(cb) {
        this.destroy();
        if (cb) later(cb);
      }
    };
    WriteStream = class extends Writable {
      static {
        __name(this, "WriteStream");
      }
      constructor(p, options = {}) {
        if (typeof options === "string") options = { encoding: options };
        super({ decodeStrings: true });
        this.path = typeof p === "string" ? p : toPath(p);
        this.bytesWritten = 0;
        this.pending = true;
        this._append = String(options.flags || "w").startsWith("a");
        try {
          if (!this._append || !existsSync(this.path)) writeImpl(this.path, "", {}, false);
          this.pending = false;
          later(() => {
            this.emit("open", 4);
            this.emit("ready");
          });
        } catch (err) {
          later(() => this.destroy(err));
        }
      }
      _write(chunk, encoding, cb) {
        try {
          appendFileSync(this.path, chunk);
          this.bytesWritten += chunk.length;
          cb();
        } catch (err) {
          cb(err);
        }
      }
      close(cb) {
        this.end(cb);
      }
    };
    __name(createReadStream, "createReadStream");
    __name(createWriteStream, "createWriteStream");
    __name(watch, "watch");
    constants = {
      F_OK: 0,
      R_OK: 4,
      W_OK: 2,
      X_OK: 1,
      O_RDONLY: 0,
      O_WRONLY: 1,
      O_RDWR: 2,
      O_CREAT: 64,
      O_EXCL: 128,
      O_TRUNC: 512,
      O_APPEND: 1024,
      S_IFMT: 61440,
      S_IFREG: 32768,
      S_IFDIR: 16384,
      COPYFILE_EXCL: 1
    };
    promises2.constants = constants;
    F_OK = 0;
    R_OK = 4;
    W_OK = 2;
    X_OK = 1;
    fs = {
      existsSync,
      readFileSync,
      writeFileSync,
      appendFileSync,
      mkdirSync,
      readdirSync,
      statSync,
      lstatSync,
      unlinkSync,
      rmSync,
      rmdirSync,
      renameSync,
      copyFileSync,
      accessSync,
      realpathSync,
      mkdtempSync,
      chmodSync,
      utimesSync,
      openSync,
      writeSync,
      closeSync,
      fsyncSync,
      fstatSync,
      readFile,
      writeFile,
      appendFile,
      mkdir,
      readdir,
      stat,
      lstat,
      unlink,
      rm,
      rmdir,
      rename,
      copyFile,
      access,
      realpath,
      mkdtemp,
      chmod,
      open,
      close,
      fstat,
      exists,
      write,
      fsync,
      promises: promises2,
      createReadStream,
      createWriteStream,
      ReadStream,
      WriteStream,
      watch,
      constants,
      F_OK,
      R_OK,
      W_OK,
      X_OK,
      Stats,
      Dirent
    };
    fs_default = fs;
  }
});

// src/academy/node/runtime/gen/fs.cjs
var require_fs = __commonJS({
  "src/academy/node/runtime/gen/fs.cjs"(exports, module) {
    init_globals();
    var m = (init_fs(), __toCommonJS(fs_exports));
    module.exports = m && m.default !== void 0 ? m.default : m;
  }
});

export {
  require_buffer,
  require_events,
  require_safe_buffer,
  require_string_decoder,
  stream_default,
  Readable,
  Transform,
  Stream2 as Stream,
  stream_exports,
  init_stream,
  path_default,
  dirname,
  resolve,
  path_exports,
  init_path,
  Volume,
  promises2 as promises,
  fs_default,
  init_fs,
  require_fs
};
