/**
 * node:buffer — the npm "buffer" package (Node's Buffer for browsers), with
 * the "base64url" encoding added: Node has it, the package does not, and JWT
 * lessons decode tokens with Buffer.from(part, "base64url").
 */
import * as pkg from "buffer/index.js";

export const Buffer = pkg.Buffer;
// Bundled packages' free `Buffer` is this one (scripts/nodeLabRuntime.mjs defines Buffer as globalThis.__labBuffer).
globalThis.__labBuffer = Buffer;
const toB64 = (s) => {
  const t = String(s).replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  return t + "===".slice((t.length + 3) % 4);
};
const toUrl = (s) => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

if (!Buffer.__base64url) {
  Buffer.__base64url = true;
  const from = Buffer.from;
  Buffer.from = function (value, encodingOrOffset, length) {
    if (typeof value === "string" && encodingOrOffset === "base64url") return from.call(Buffer, toB64(value), "base64");
    return from.call(Buffer, value, encodingOrOffset, length);
  };
  const toString = Buffer.prototype.toString;
  Buffer.prototype.toString = function (encoding, start, end) {
    if (encoding === "base64url") return toUrl(toString.call(this, "base64", start, end));
    return toString.apply(this, arguments);
  };
  const byteLength = Buffer.byteLength;
  Buffer.byteLength = function (s, encoding) {
    if (typeof s === "string" && encoding === "base64url") return byteLength.call(Buffer, toB64(s), "base64");
    return byteLength.call(Buffer, s, encoding);
  };
  const isEncoding = Buffer.isEncoding;
  Buffer.isEncoding = (e) => String(e).toLowerCase() === "base64url" || isEncoding(e);
  // Node's fast paths, which busboy (multer) and others call directly.
  for (const enc of ["latin1", "utf8", "ascii", "hex", "base64", "ucs2"]) {
    const name = `${enc}Slice`;
    if (typeof Buffer.prototype[name] !== "function") {
      Buffer.prototype[name] = function (start = 0, end = this.length) {
        return toString.call(this, enc, start, end);
      };
    }
    const w = `${enc}Write`;
    if (typeof Buffer.prototype[w] !== "function") {
      Buffer.prototype[w] = function (string, offset = 0, length = this.length - offset) {
        return this.write(string, offset, length, enc);
      };
    }
  }
  // Node prints <Buffer 68 65 6c 6c 6f>; see util.inspect.
  Buffer.prototype.toJSON = function () {
    return { type: "Buffer", data: Array.from(this) };
  };
}

export const SlowBuffer = pkg.SlowBuffer;
export const INSPECT_MAX_BYTES = pkg.INSPECT_MAX_BYTES;
export const kMaxLength = pkg.kMaxLength;
export const constants = { MAX_LENGTH: pkg.kMaxLength, MAX_STRING_LENGTH: 536870888 };
export const Blob = globalThis.Blob;
export const File = globalThis.File;
export const atob = globalThis.atob;
export const btoa = globalThis.btoa;
export function isUtf8(input) {
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(input);
    return true;
  } catch {
    return false;
  }
}
export default { Buffer, SlowBuffer, INSPECT_MAX_BYTES, kMaxLength, constants, Blob, File, atob, btoa, isUtf8 };
