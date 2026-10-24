/**
 * node:crypto — hashes, HMACs, key derivation, random values and AES-GCM,
 * computed with the audited @noble libraries, so every digest, signature and
 * derived key is byte-for-byte what Node produces (the differential check in
 * lib/academy/node proves the lab's model answers against real Node).
 * Errors carry Node's messages and codes.
 */
import { sha224, sha256, sha384, sha512 } from "@noble/hashes/sha2.js";
import { md5, sha1 } from "@noble/hashes/legacy.js";
import { hmac } from "@noble/hashes/hmac.js";
import { pbkdf2 as nPbkdf2 } from "@noble/hashes/pbkdf2.js";
import { scrypt as nScrypt } from "@noble/hashes/scrypt.js";
import { gcm, cbc } from "@noble/ciphers/aes.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";

const HASHES = { sha256, sha1, md5, sha512, sha384, sha224, "sha-256": sha256, "sha-1": sha1, "sha-512": sha512 };

function nodeError(code, message, Type = Error) {
  const err = new Type(message);
  err.code = code;
  return err;
}

function hashFn(algorithm) {
  const fn = HASHES[String(algorithm).toLowerCase()];
  if (!fn) throw new Error("Digest method not supported");
  return fn;
}

function toBytes(data, encoding) {
  if (typeof data === "string") return Buffer.from(data, encoding || "utf8");
  if (data instanceof KeyObject) return data._key;
  if (ArrayBuffer.isView(data)) return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  throw nodeError("ERR_INVALID_ARG_TYPE", `The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received ${data === undefined ? "undefined" : data === null ? "null" : typeof data}`, TypeError);
}

function out(bytes, encoding) {
  const buf = Buffer.from(bytes);
  return encoding ? buf.toString(encoding) : buf;
}

class Hash {
  constructor(algorithm, state) {
    this._alg = algorithm;
    this._h = state || hashFn(algorithm).create();
    this._done = false;
  }
  update(data, encoding) {
    if (this._done) throw nodeError("ERR_CRYPTO_HASH_FINALIZED", "Digest already called");
    this._h.update(toBytes(data, encoding));
    return this;
  }
  digest(encoding) {
    if (this._done) throw nodeError("ERR_CRYPTO_HASH_FINALIZED", "Digest already called");
    this._done = true;
    return out(this._h.digest(), encoding);
  }
  copy() {
    return new Hash(this._alg, this._h.clone());
  }
}

export function createHash(algorithm) {
  return new Hash(algorithm);
}

/** crypto.hash(algorithm, data, outputEncoding = "hex") — Node 21.7+. */
export function hash(algorithm, data, outputEncoding = "hex") {
  return createHash(algorithm).update(data).digest(outputEncoding === "buffer" ? undefined : outputEncoding);
}

class Hmac {
  constructor(algorithm, key) {
    this._h = hmac.create(hashFn(algorithm), toBytes(key));
    this._done = false;
  }
  update(data, encoding) {
    if (this._done) throw nodeError("ERR_CRYPTO_HASH_FINALIZED", "Digest already called");
    this._h.update(toBytes(data, encoding));
    return this;
  }
  digest(encoding) {
    if (this._done) throw nodeError("ERR_CRYPTO_HASH_FINALIZED", "Digest already called");
    this._done = true;
    return out(this._h.digest(), encoding);
  }
}

export function createHmac(algorithm, key) {
  if (key === undefined || key === null) {
    throw nodeError("ERR_INVALID_ARG_TYPE", `The "key" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, DataView, KeyObject, or CryptoKey. Received ${key}`, TypeError);
  }
  return new Hmac(algorithm, key);
}

export function randomBytes(size, cb) {
  const buf = Buffer.alloc(size);
  for (let i = 0; i < size; i += 65536) globalThis.crypto.getRandomValues(buf.subarray(i, Math.min(size, i + 65536)));
  if (typeof cb === "function") {
    ctx.loop ? ctx.loop.setImmediate(cb, null, buf) : queueMicrotask(() => cb(null, buf));
    return undefined;
  }
  return buf;
}
export const pseudoRandomBytes = randomBytes;

export function randomFillSync(buf) {
  globalThis.crypto.getRandomValues(buf);
  return buf;
}

export function randomUUID() {
  return globalThis.crypto.randomUUID();
}

export function randomInt(min, max, cb) {
  if (max === undefined || typeof max === "function") {
    cb = max;
    max = min;
    min = 0;
  }
  const range = max - min;
  if (!(range > 0)) {
    throw nodeError("ERR_OUT_OF_RANGE", `The value of "max" is out of range. It must be greater than the value of "min" (${min}). Received ${max}`, RangeError);
  }
  const limit = 2 ** 48 - (2 ** 48 % range);
  let n;
  do {
    const b = randomBytes(6);
    n = b.readUIntBE(0, 6);
  } while (n >= limit);
  const value = min + (n % range);
  if (typeof cb === "function") {
    ctx.loop.setImmediate(cb, null, value);
    return undefined;
  }
  return value;
}

export function timingSafeEqual(a, b) {
  const x = toBytes(a);
  const y = toBytes(b);
  if (x.length !== y.length) throw nodeError("ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH", "Input buffers must have the same byte length", RangeError);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export function pbkdf2Sync(password, salt, iterations, keylen, digest) {
  return Buffer.from(nPbkdf2(hashFn(digest), toBytes(password), toBytes(salt), { c: iterations, dkLen: keylen }));
}
export function pbkdf2(password, salt, iterations, keylen, digest, cb) {
  let result;
  let error = null;
  try {
    result = pbkdf2Sync(password, salt, iterations, keylen, digest);
  } catch (e) {
    error = e;
  }
  ctx.loop.setImmediate(() => (error ? cb(error) : cb(null, result)));
}

export function scryptSync(password, salt, keylen, options = {}) {
  const N = options.N ?? options.cost ?? 16384;
  const r = options.r ?? options.blockSize ?? 8;
  const p = options.p ?? options.parallelization ?? 1;
  if (N < 2 || (N & (N - 1)) !== 0) throw nodeError("ERR_CRYPTO_INVALID_SCRYPT_PARAMS", "Invalid scrypt params", RangeError);
  return Buffer.from(nScrypt(toBytes(password), toBytes(salt), { N, r, p, dkLen: keylen }));
}
export function scrypt(password, salt, keylen, options, cb) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  let result;
  let error = null;
  try {
    result = scryptSync(password, salt, keylen, options);
  } catch (e) {
    error = e;
  }
  ctx.loop.setImmediate(() => (error ? cb(error) : cb(null, result)));
}

/* ── Keys: enough of KeyObject for jsonwebtoken's HMAC path ────────── */

export class KeyObject {
  constructor(type, key) {
    this.type = type;
    Object.defineProperty(this, "_key", { value: key });
  }
  get symmetricKeySize() {
    return this.type === "secret" ? this._key.length : undefined;
  }
  get asymmetricKeyType() {
    return undefined;
  }
  export(options) {
    if (options?.format === "jwk") return { kty: "oct", k: this._key.toString("base64url") };
    return Buffer.from(this._key);
  }
  equals(other) {
    return other instanceof KeyObject && timingSafeEqual(this._key, other._key);
  }
}

export function createSecretKey(key, encoding) {
  return new KeyObject("secret", Buffer.from(toBytes(key, encoding)));
}

export function createPrivateKey(key) {
  const text = typeof key === "string" ? key : Buffer.isBuffer(key) ? key.toString() : key?.key;
  if (typeof text === "string" && text.includes("-----BEGIN")) {
    throw nodeError("ERR_FEATURE_UNAVAILABLE_ON_PLATFORM", "This lab supports HMAC keys (HS256); RSA and EC keys need a real Node.js server");
  }
  throw nodeError("ERR_OSSL_UNSUPPORTED", "error:1E08010C:DECODER routines::unsupported");
}
export const createPublicKey = createPrivateKey;

/* ── AES-256-GCM and AES-CBC, for encrypting sensitive fields ──────── */

const CIPHERS = {
  "aes-256-gcm": { key: 32, mode: "gcm" },
  "aes-192-gcm": { key: 24, mode: "gcm" },
  "aes-128-gcm": { key: 16, mode: "gcm" },
  "aes-256-cbc": { key: 32, mode: "cbc" },
  "aes-128-cbc": { key: 16, mode: "cbc" },
};

class Cipher {
  constructor(decrypt, algorithm, key, iv) {
    const spec = CIPHERS[String(algorithm).toLowerCase()];
    if (!spec) throw nodeError("ERR_CRYPTO_UNKNOWN_CIPHER", "Unknown cipher");
    const k = toBytes(key);
    if (k.length !== spec.key) throw nodeError("ERR_CRYPTO_INVALID_KEYLEN", "Invalid key length", RangeError);
    this._spec = spec;
    this._key = k;
    this._iv = toBytes(iv);
    this._decrypt = decrypt;
    this._chunks = [];
    this._tag = null;
    this._aad = null;
  }
  setAAD(buf) {
    this._aad = toBytes(buf);
    return this;
  }
  setAuthTag(tag) {
    this._tag = toBytes(tag);
    return this;
  }
  getAuthTag() {
    if (!this._authTag) throw new Error("Invalid state for operation getAuthTag");
    return Buffer.from(this._authTag);
  }
  update(data, inputEncoding, outputEncoding) {
    this._chunks.push(toBytes(data, inputEncoding));
    return outputEncoding ? "" : Buffer.alloc(0);
  }
  final(outputEncoding) {
    const input = Buffer.concat(this._chunks);
    let result;
    if (this._spec.mode === "gcm") {
      const c = gcm(this._key, this._iv, this._aad || undefined);
      if (this._decrypt) {
        if (!this._tag) throw new Error("Unsupported state or unable to authenticate data");
        try {
          result = c.decrypt(Buffer.concat([input, this._tag]));
        } catch {
          throw new Error("Unsupported state or unable to authenticate data");
        }
      } else {
        const sealed = c.encrypt(input);
        result = sealed.subarray(0, sealed.length - 16);
        this._authTag = sealed.subarray(sealed.length - 16);
      }
    } else {
      const c = cbc(this._key, this._iv);
      try {
        result = this._decrypt ? c.decrypt(input) : c.encrypt(input);
      } catch {
        throw nodeError("ERR_OSSL_BAD_DECRYPT", "error:1C800064:Provider routines::bad decrypt");
      }
    }
    return out(result, outputEncoding);
  }
}

export function createCipheriv(algorithm, key, iv) {
  return new Cipher(false, algorithm, key, iv);
}
export function createDecipheriv(algorithm, key, iv) {
  return new Cipher(true, algorithm, key, iv);
}

export function getHashes() {
  return ["md5", "sha1", "sha224", "sha256", "sha384", "sha512"];
}
export function getCiphers() {
  return Object.keys(CIPHERS);
}

export const webcrypto = globalThis.crypto;
export const subtle = globalThis.crypto?.subtle;
export function getRandomValues(arr) {
  return globalThis.crypto.getRandomValues(arr);
}
export const constants = {};

export default {
  createHash, hash, createHmac, randomBytes, pseudoRandomBytes, randomFillSync, randomUUID, randomInt, timingSafeEqual,
  pbkdf2, pbkdf2Sync, scrypt, scryptSync, KeyObject, createSecretKey, createPrivateKey, createPublicKey,
  createCipheriv, createDecipheriv, getHashes, getCiphers, webcrypto, subtle, getRandomValues, constants,
};
