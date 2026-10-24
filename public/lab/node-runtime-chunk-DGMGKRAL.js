import {
  Buffer,
  __esm,
  __export,
  __name,
  ctx,
  init_buffer,
  init_context,
  init_globals
} from "./node-runtime-chunk-WY7WQXFC.js";

// scripts/node-lab/node_modules/@noble/hashes/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function setU64FromNum(view, byteOffset, n, isLE3) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE3 ? l : h, isLE3);
  view.setUint32(byteOffset + 4, isLE3 ? h : l, isLE3);
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK64, _32n, fromNumH, fromNumL, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
var init_u64 = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/_u64.js"() {
    init_globals();
    U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
    _32n = /* @__PURE__ */ BigInt(32);
    __name(fromBig, "fromBig");
    __name(split, "split");
    fromNumH = /* @__PURE__ */ __name((n) => n / 2 ** 32 | 0, "fromNumH");
    fromNumL = /* @__PURE__ */ __name((n) => n >>> 0, "fromNumL");
    __name(setU64FromNum, "setU64FromNum");
    shrSH = /* @__PURE__ */ __name((h, _l, s) => h >>> s, "shrSH");
    shrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "shrSL");
    rotrSH = /* @__PURE__ */ __name((h, l, s) => h >>> s | l << 32 - s, "rotrSH");
    rotrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "rotrSL");
    rotrBH = /* @__PURE__ */ __name((h, l, s) => h << 64 - s | l >>> s - 32, "rotrBH");
    rotrBL = /* @__PURE__ */ __name((h, l, s) => h >>> s - 32 | l << 64 - s, "rotrBL");
    __name(add, "add");
    add3L = /* @__PURE__ */ __name((Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0), "add3L");
    add3H = /* @__PURE__ */ __name((low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0, "add3H");
    add4L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0), "add4L");
    add4H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0, "add4H");
    add5L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0), "add5L");
    add5H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0, "add5H");
  }
});

// scripts/node-lab/node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes(value, length, title = "") {
  if (isBytes(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber(length, "length");
  const bytes = isBytes(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("expected hash wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
  if (h.outputLen < 1 || h.blockLen < 1)
    throw new Error("hash blockLen / outputLen must be >= 1");
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out2, instance) {
  abytes(out2, void 0, "output");
  const min = instance.outputLen;
  if (!(out2.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new TypeError("string expected");
  const encoded = new TextEncoder().encode(str);
  try {
    return new Uint8Array(encoded);
  } finally {
    clean(encoded);
  }
}
function kdfInputToBytes(data, errorTitle = "") {
  if (typeof data === "string")
    return utf8ToBytes(data);
  return abytes(data, void 0, errorTitle);
}
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = /* @__PURE__ */ __name((msg, opts) => hashCons(opts).update(msg).digest(), "hashC");
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var atitle, aobject, aopts, isLE, swap32IfBE, oidNist;
var init_utils = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/utils.js"() {
    init_globals();
    __name(isBytes, "isBytes");
    atitle = /* @__PURE__ */ __name((title) => title ? `"${title}" ` : "", "atitle");
    __name(anumber, "anumber");
    __name(abytes, "abytes");
    __name(ahash, "ahash");
    aobject = /* @__PURE__ */ __name((value, label) => {
      if (value === null || typeof value !== "object" || Array.isArray(value))
        throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
    }, "aobject");
    aopts = /* @__PURE__ */ __name((value, label) => {
      aobject(value, label);
      const proto = Object.getPrototypeOf(value);
      if (proto !== Object.prototype && proto !== null)
        throw new TypeError(`"${label}" expected plain object`);
      if (Object.hasOwn(value, "__proto__"))
        throw new TypeError(`"${label}.__proto__" is not allowed`);
    }, "aopts");
    __name(aexists, "aexists");
    __name(aoutput, "aoutput");
    __name(u32, "u32");
    __name(clean, "clean");
    __name(createView, "createView");
    __name(rotr, "rotr");
    __name(rotl, "rotl");
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    __name(byteSwap, "byteSwap");
    __name(byteSwap32, "byteSwap32");
    swap32IfBE = isLE ? (u) => u : byteSwap32;
    __name(utf8ToBytes, "utf8ToBytes");
    __name(kdfInputToBytes, "kdfInputToBytes");
    __name(checkOpts, "checkOpts");
    __name(createHasher, "createHasher");
    oidNist = /* @__PURE__ */ __name((suffix) => ({
      // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
      // Larger suffix values would need base-128 OID encoding and a different length byte.
      oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
    }), "oidNist");
  }
});

// scripts/node-lab/node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV, SHA224_IV, SHA384_IV, SHA512_IV;
var init_md = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/_md.js"() {
    init_globals();
    init_u64();
    init_utils();
    __name(Chi, "Chi");
    __name(Maj, "Maj");
    HashMD = class {
      static {
        __name(this, "HashMD");
      }
      blockLen;
      outputLen;
      canXOF = false;
      padOffset;
      isLE;
      // For partial updates less than block size
      buffer;
      view;
      finished = false;
      length = 0;
      pos = 0;
      destroyed = false;
      constructor(blockLen, outputLen, padOffset, isLE3) {
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE3;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
      }
      update(data) {
        aexists(this);
        abytes(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        let processed = false;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            processed = true;
            continue;
          }
          buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
            processed = true;
          }
        }
        this.length += data.length;
        if (processed)
          this.roundClean();
        return this;
      }
      digestInto(out2) {
        aexists(this);
        aoutput(out2, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE3 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        buffer.fill(0, pos);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          buffer.fill(0);
        }
        setU64FromNum(view, blockLen - 8, this.length * 8, isLE3);
        this.process(view, 0);
        this.roundClean();
        const oview = out2 === buffer ? view : createView(out2);
        const len = this.outputLen;
        const outLen = len / 4;
        const state = this.get();
        if (len % 4 || outLen > state.length)
          throw new Error("invalid outputLen");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE3);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneIntoMeta(to) {
        const { buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (pos)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    SHA224_IV = /* @__PURE__ */ Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]);
    SHA384_IV = /* @__PURE__ */ Uint32Array.from([
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ]);
    SHA512_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// scripts/node-lab/node_modules/@noble/hashes/sha2.js
var SHA256_K, SHA256_W, SHA2_32B, _SHA256, _SHA224, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, _SHA384, sha256, sha224, sha512, sha384;
var init_sha2 = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/sha2.js"() {
    init_globals();
    init_md();
    init_u64();
    init_utils();
    SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    SHA2_32B = class extends HashMD {
      static {
        __name(this, "SHA2_32B");
      }
      // We cannot use array here since array allows indexing by variable
      // which means optimizer/compiler cannot use registers.
      // Numeric initializers matter: starting the fields as `undefined` changes
      // V8's field representation and makes sha256 3x slower (measured).
      A = 0;
      B = 0;
      C = 0;
      D = 0;
      E = 0;
      F = 0;
      G = 0;
      H = 0;
      constructor(outputLen, IV) {
        super(64, outputLen, 8, false);
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
          const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean(SHA256_W);
      }
      destroy() {
        this.destroyed = true;
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    _SHA256 = class extends SHA2_32B {
      static {
        __name(this, "_SHA256");
      }
      constructor() {
        super(32, SHA256_IV);
      }
    };
    _SHA224 = class extends SHA2_32B {
      static {
        __name(this, "_SHA224");
      }
      constructor() {
        super(28, SHA224_IV);
      }
    };
    K512 = /* @__PURE__ */ (() => split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    SHA2_64B = class extends HashMD {
      static {
        __name(this, "SHA2_64B");
      }
      // We cannot use array here since array allows indexing by variable
      // which means optimizer/compiler cannot use registers.
      // h -- high 32 bits, l -- low 32 bits
      // Numeric initializers matter: starting the fields as `undefined` changes
      // V8's field representation and slows hashing down (measured on sha256).
      Ah = 0;
      Al = 0;
      Bh = 0;
      Bl = 0;
      Ch = 0;
      Cl = 0;
      Dh = 0;
      Dl = 0;
      Eh = 0;
      El = 0;
      Fh = 0;
      Fl = 0;
      Gh = 0;
      Gl = 0;
      Hh = 0;
      Hl = 0;
      constructor(outputLen, IV) {
        super(128, outputLen, 16, false);
        this.Ah = IV[0] | 0;
        this.Al = IV[1] | 0;
        this.Bh = IV[2] | 0;
        this.Bl = IV[3] | 0;
        this.Ch = IV[4] | 0;
        this.Cl = IV[5] | 0;
        this.Dh = IV[6] | 0;
        this.Dl = IV[7] | 0;
        this.Eh = IV[8] | 0;
        this.El = IV[9] | 0;
        this.Fh = IV[10] | 0;
        this.Fl = IV[11] | 0;
        this.Gh = IV[12] | 0;
        this.Gl = IV[13] | 0;
        this.Hh = IV[14] | 0;
        this.Hl = IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
          const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
          const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
          const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
          const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
          const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = add3L(T1l, sigma0l, MAJl);
          Ah = add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        clean(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        this.destroyed = true;
        clean(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    _SHA512 = class extends SHA2_64B {
      static {
        __name(this, "_SHA512");
      }
      constructor() {
        super(64, SHA512_IV);
      }
    };
    _SHA384 = class extends SHA2_64B {
      static {
        __name(this, "_SHA384");
      }
      constructor() {
        super(48, SHA384_IV);
      }
    };
    sha256 = /* @__PURE__ */ createHasher(
      () => new _SHA256(),
      /* @__PURE__ */ oidNist(1)
    );
    sha224 = /* @__PURE__ */ createHasher(
      () => new _SHA224(),
      /* @__PURE__ */ oidNist(4)
    );
    sha512 = /* @__PURE__ */ createHasher(
      () => new _SHA512(),
      /* @__PURE__ */ oidNist(3)
    );
    sha384 = /* @__PURE__ */ createHasher(
      () => new _SHA384(),
      /* @__PURE__ */ oidNist(2)
    );
  }
});

// scripts/node-lab/node_modules/@noble/hashes/legacy.js
var SHA1_IV, SHA1_W, _SHA1, sha1, p32, K, MD5_IV, MD5_W, MD5_SHIFTS, _MD5, md5;
var init_legacy = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/legacy.js"() {
    init_globals();
    init_md();
    init_utils();
    SHA1_IV = /* @__PURE__ */ Uint32Array.from([
      1732584193,
      4023233417,
      2562383102,
      271733878,
      3285377520
    ]);
    SHA1_W = /* @__PURE__ */ new Uint32Array(80);
    _SHA1 = class extends HashMD {
      static {
        __name(this, "_SHA1");
      }
      A = SHA1_IV[0] | 0;
      B = SHA1_IV[1] | 0;
      C = SHA1_IV[2] | 0;
      D = SHA1_IV[3] | 0;
      E = SHA1_IV[4] | 0;
      constructor() {
        super(64, 20, 8, false);
      }
      get() {
        const { A, B, C, D, E } = this;
        return [A, B, C, D, E];
      }
      set(A, B, C, D, E) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA1_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 80; i++)
          SHA1_W[i] = rotl(SHA1_W[i - 3] ^ SHA1_W[i - 8] ^ SHA1_W[i - 14] ^ SHA1_W[i - 16], 1);
        let { A, B, C, D, E } = this;
        for (let i = 0; i < 80; i++) {
          let F, K2;
          if (i < 20) {
            F = Chi(B, C, D);
            K2 = 1518500249;
          } else if (i < 40) {
            F = B ^ C ^ D;
            K2 = 1859775393;
          } else if (i < 60) {
            F = Maj(B, C, D);
            K2 = 2400959708;
          } else {
            F = B ^ C ^ D;
            K2 = 3395469782;
          }
          const T = rotl(A, 5) + F + E + K2 + SHA1_W[i] | 0;
          E = D;
          D = C;
          C = rotl(B, 30);
          B = A;
          A = T;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        this.set(A, B, C, D, E);
      }
      roundClean() {
        clean(SHA1_W);
      }
      destroy() {
        this.destroyed = true;
        this.set(0, 0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    sha1 = /* @__PURE__ */ createHasher(() => new _SHA1());
    p32 = /* @__PURE__ */ Math.pow(2, 32);
    K = /* @__PURE__ */ Array.from({ length: 64 }, (_, i) => Math.floor(p32 * Math.abs(Math.sin(i + 1))));
    MD5_IV = /* @__PURE__ */ SHA1_IV.slice(0, 4);
    MD5_W = /* @__PURE__ */ new Uint32Array(16);
    MD5_SHIFTS = /* @__PURE__ */ (() => {
      const S = [
        [7, 12, 17, 22],
        [5, 9, 14, 20],
        [4, 11, 16, 23],
        [6, 10, 15, 21]
      ];
      return Uint8Array.from({ length: 64 }, (_, i) => S[Math.floor(i / 16)][i % 4]);
    })();
    _MD5 = class extends HashMD {
      static {
        __name(this, "_MD5");
      }
      A = MD5_IV[0] | 0;
      B = MD5_IV[1] | 0;
      C = MD5_IV[2] | 0;
      D = MD5_IV[3] | 0;
      constructor() {
        super(64, 16, 8, true);
      }
      get() {
        const { A, B, C, D } = this;
        return [A, B, C, D];
      }
      set(A, B, C, D) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          MD5_W[i] = view.getUint32(offset, true);
        let { A, B, C, D } = this;
        for (let i = 0; i < 64; i++) {
          let F, g;
          if (i < 16) {
            F = Chi(B, C, D);
            g = i;
          } else if (i < 32) {
            F = Chi(D, B, C);
            g = (5 * i + 1) % 16;
          } else if (i < 48) {
            F = B ^ C ^ D;
            g = (3 * i + 5) % 16;
          } else {
            F = C ^ (B | ~D);
            g = 7 * i % 16;
          }
          F = F + A + K[i] + MD5_W[g];
          A = D;
          D = C;
          C = B;
          B = B + rotl(F, MD5_SHIFTS[i]);
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        this.set(A, B, C, D);
      }
      roundClean() {
        clean(MD5_W);
      }
      destroy() {
        this.destroyed = true;
        this.set(0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    md5 = /* @__PURE__ */ createHasher(() => new _MD5());
  }
});

// scripts/node-lab/node_modules/@noble/hashes/hmac.js
var _HMAC, hmac;
var init_hmac = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/hmac.js"() {
    init_globals();
    init_utils();
    _HMAC = class {
      static {
        __name(this, "_HMAC");
      }
      oHash;
      iHash;
      blockLen;
      outputLen;
      canXOF = false;
      finished = false;
      destroyed = false;
      constructor(hash2, key) {
        ahash(hash2);
        abytes(key, void 0, "key");
        this.iHash = hash2.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("expected Hash instance");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash2.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        clean(pad);
      }
      update(buf) {
        aexists(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out2) {
        aexists(this);
        aoutput(out2, this);
        this.finished = true;
        const buf = out2.subarray(0, this.outputLen);
        this.iHash.digestInto(buf);
        this.oHash.update(buf);
        this.oHash.digestInto(buf);
        this.destroy();
      }
      digest() {
        const out2 = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out2);
        return out2;
      }
      _cloneInto(to) {
        to ||= Object.create(Object.getPrototypeOf(this), {});
        const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.canXOF = canXOF;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = /* @__PURE__ */ (() => {
      const hmac_ = /* @__PURE__ */ __name(((hash2, key, message) => new _HMAC(hash2, key).update(message).digest()), "hmac_");
      hmac_.create = (hash2, key) => new _HMAC(hash2, key);
      return hmac_;
    })();
  }
});

// scripts/node-lab/node_modules/@noble/hashes/pbkdf2.js
function pbkdf2Init(hash2, _password, _salt, _opts) {
  ahash(hash2);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber(c, "c");
  anumber(dkLen, "dkLen");
  anumber(asyncTick, "asyncTick");
  if (c < 1)
    throw new Error('"c" (iterations) must be >= 1');
  if (dkLen < 1)
    throw new Error('"dkLen" must be >= 1');
  if (dkLen > (2 ** 32 - 1) * hash2.outputLen)
    throw new Error("derived key too long");
  const p = kdfInputToBytes(_password, "password");
  try {
    const s = kdfInputToBytes(_salt, "salt");
    try {
      const DK = new Uint8Array(dkLen);
      const { iHash, oHash, outputLen } = hmac.create(hash2, p);
      const u = new Uint8Array(outputLen);
      const eng = pbkdf2Engine(iHash, oHash, s, u);
      return { c, dkLen, asyncTick, DK, outputLen, eng };
    } finally {
      if (typeof _salt === "string")
        clean(s);
    }
  } finally {
    if (typeof _password === "string")
      clean(p);
  }
}
function pbkdf2Engine(iHash, oHash, salt, u) {
  const counter = new Uint8Array(4);
  const view = createView(counter);
  const salted = iHash._cloneInto().update(salt);
  const work = oHash._cloneInto();
  const iClone = iHash._cloneInto;
  const oClone = oHash._cloneInto;
  return {
    u1: /* @__PURE__ */ __name((ti, Ti) => {
      view.setInt32(0, ti, false);
      salted._cloneInto(work).update(counter).digestInto(u);
      oHash._cloneInto(work).update(u).digestInto(u);
      Ti.set(u.subarray(0, Ti.length));
    }, "u1"),
    // Whole `F` inner loop for the sync variant: one optimized function owns the hot loop.
    rounds: /* @__PURE__ */ __name((c, Ti) => {
      for (let ui = 1; ui < c; ui++) {
        iClone.call(iHash, work).update(u).digestInto(u);
        oClone.call(oHash, work).update(u).digestInto(u);
        for (let i = 0; i < Ti.length; i++)
          Ti[i] ^= u[i];
      }
    }, "rounds"),
    output: /* @__PURE__ */ __name((DK) => {
      iHash.destroy();
      oHash.destroy();
      salted.destroy();
      work.destroy();
      clean(u);
      return DK;
    }, "output")
  };
}
function pbkdf2(hash2, password, salt, opts) {
  const { c, dkLen, DK, outputLen, eng } = pbkdf2Init(hash2, password, salt, opts);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += outputLen) {
    const Ti = DK.subarray(pos, pos + outputLen);
    eng.u1(ti, Ti);
    eng.rounds(c, Ti);
  }
  return eng.output(DK);
}
var init_pbkdf2 = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/pbkdf2.js"() {
    init_globals();
    init_hmac();
    init_utils();
    __name(pbkdf2Init, "pbkdf2Init");
    __name(pbkdf2Engine, "pbkdf2Engine");
    __name(pbkdf2, "pbkdf2");
  }
});

// scripts/node-lab/node_modules/@noble/hashes/scrypt.js
function XorAndSalsa(prev, pi, input, ii, out2, oi) {
  let y00 = prev[pi++] ^ input[ii++], y01 = prev[pi++] ^ input[ii++];
  let y02 = prev[pi++] ^ input[ii++], y03 = prev[pi++] ^ input[ii++];
  let y04 = prev[pi++] ^ input[ii++], y05 = prev[pi++] ^ input[ii++];
  let y06 = prev[pi++] ^ input[ii++], y07 = prev[pi++] ^ input[ii++];
  let y08 = prev[pi++] ^ input[ii++], y09 = prev[pi++] ^ input[ii++];
  let y10 = prev[pi++] ^ input[ii++], y11 = prev[pi++] ^ input[ii++];
  let y12 = prev[pi++] ^ input[ii++], y13 = prev[pi++] ^ input[ii++];
  let y14 = prev[pi++] ^ input[ii++], y15 = prev[pi++] ^ input[ii++];
  let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
  for (let i = 0; i < 8; i += 2) {
    x04 ^= rotl(x00 + x12 | 0, 7);
    x08 ^= rotl(x04 + x00 | 0, 9);
    x12 ^= rotl(x08 + x04 | 0, 13);
    x00 ^= rotl(x12 + x08 | 0, 18);
    x09 ^= rotl(x05 + x01 | 0, 7);
    x13 ^= rotl(x09 + x05 | 0, 9);
    x01 ^= rotl(x13 + x09 | 0, 13);
    x05 ^= rotl(x01 + x13 | 0, 18);
    x14 ^= rotl(x10 + x06 | 0, 7);
    x02 ^= rotl(x14 + x10 | 0, 9);
    x06 ^= rotl(x02 + x14 | 0, 13);
    x10 ^= rotl(x06 + x02 | 0, 18);
    x03 ^= rotl(x15 + x11 | 0, 7);
    x07 ^= rotl(x03 + x15 | 0, 9);
    x11 ^= rotl(x07 + x03 | 0, 13);
    x15 ^= rotl(x11 + x07 | 0, 18);
    x01 ^= rotl(x00 + x03 | 0, 7);
    x02 ^= rotl(x01 + x00 | 0, 9);
    x03 ^= rotl(x02 + x01 | 0, 13);
    x00 ^= rotl(x03 + x02 | 0, 18);
    x06 ^= rotl(x05 + x04 | 0, 7);
    x07 ^= rotl(x06 + x05 | 0, 9);
    x04 ^= rotl(x07 + x06 | 0, 13);
    x05 ^= rotl(x04 + x07 | 0, 18);
    x11 ^= rotl(x10 + x09 | 0, 7);
    x08 ^= rotl(x11 + x10 | 0, 9);
    x09 ^= rotl(x08 + x11 | 0, 13);
    x10 ^= rotl(x09 + x08 | 0, 18);
    x12 ^= rotl(x15 + x14 | 0, 7);
    x13 ^= rotl(x12 + x15 | 0, 9);
    x14 ^= rotl(x13 + x12 | 0, 13);
    x15 ^= rotl(x14 + x13 | 0, 18);
  }
  out2[oi++] = y00 + x00 | 0;
  out2[oi++] = y01 + x01 | 0;
  out2[oi++] = y02 + x02 | 0;
  out2[oi++] = y03 + x03 | 0;
  out2[oi++] = y04 + x04 | 0;
  out2[oi++] = y05 + x05 | 0;
  out2[oi++] = y06 + x06 | 0;
  out2[oi++] = y07 + x07 | 0;
  out2[oi++] = y08 + x08 | 0;
  out2[oi++] = y09 + x09 | 0;
  out2[oi++] = y10 + x10 | 0;
  out2[oi++] = y11 + x11 | 0;
  out2[oi++] = y12 + x12 | 0;
  out2[oi++] = y13 + x13 | 0;
  out2[oi++] = y14 + x14 | 0;
  out2[oi++] = y15 + x15 | 0;
}
function BlockMix(input, ii, out2, oi, r) {
  let head = oi + 0;
  let tail = oi + 16 * r;
  for (let i = 0; i < 16; i++)
    out2[tail + i] = input[ii + (2 * r - 1) * 16 + i];
  for (let i = 0; i < r; i++, head += 16, ii += 16) {
    XorAndSalsa(out2, tail, input, ii, out2, head);
    if (i > 0)
      tail += 16;
    XorAndSalsa(out2, head, input, ii += 16, out2, tail);
  }
}
function scryptInit(password, salt, _opts) {
  const opts = checkOpts({
    dkLen: 32,
    asyncTick: 10,
    maxmem: SCRYPT_DEFAULT_MAXMEM
  }, _opts);
  const { N, r, p, dkLen, asyncTick, maxmem, onProgress } = opts;
  anumber(N, "N");
  anumber(r, "r");
  anumber(p, "p");
  anumber(dkLen, "dkLen");
  anumber(asyncTick, "asyncTick");
  anumber(maxmem, "maxmem");
  if (onProgress !== void 0 && typeof onProgress !== "function")
    throw new Error('"onProgress" must be a function');
  if (r < 1)
    throw new Error('"r" expected integer >= 1');
  const blockSize = 128 * r;
  const blockSize32 = blockSize / 4;
  const pow32 = Math.pow(2, 32);
  if (N <= 1 || (N & N - 1) !== 0 || N > pow32)
    throw new Error('"N" expected a power of 2, and 2^1 <= N <= 2^32');
  if (p < 1 || p > (pow32 - 1) * 32 / blockSize)
    throw new Error('"p" expected integer 1..((2^32 - 1) * 32) / (128 * r)');
  if (dkLen < 1 || dkLen > (pow32 - 1) * 32)
    throw new Error('"dkLen" expected integer 1..(2^32 - 1) * 32');
  const memUsed = blockSize * (N + p + 1);
  if (memUsed > maxmem)
    throw new Error('"maxmem" limit was hit: memUsed(128*r*(N+p+1))=' + memUsed + ", maxmem=" + maxmem);
  const B = pbkdf2(sha256, password, salt, { c: 1, dkLen: blockSize * p });
  const B32 = u32(B);
  const V = u32(new Uint8Array(blockSize * N));
  const tmp = u32(new Uint8Array(blockSize));
  let blockMixCb = /* @__PURE__ */ __name(() => {
  }, "blockMixCb");
  if (onProgress) {
    const totalBlockMix = 2 * N * p;
    const callbackPer = Math.max(Math.floor(totalBlockMix / 1e4), 1);
    let blockMixCnt = 0;
    blockMixCb = /* @__PURE__ */ __name(() => {
      blockMixCnt++;
      if (onProgress && (!(blockMixCnt % callbackPer) || blockMixCnt === totalBlockMix)) {
        try {
          onProgress(blockMixCnt / totalBlockMix);
        } catch (e) {
          clean(B, V, tmp);
          throw e;
        }
      }
    }, "blockMixCb");
  }
  return { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick };
}
function scryptOutput(password, dkLen, B, V, tmp) {
  const res = pbkdf2(sha256, password, B, { c: 1, dkLen });
  clean(B, V, tmp);
  return res;
}
function scrypt(password, salt, opts) {
  const { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb } = scryptInit(password, salt, opts);
  swap32IfBE(B32);
  for (let pi = 0; pi < p; pi++) {
    const Pi = blockSize32 * pi;
    for (let i = 0; i < blockSize32; i++)
      V[i] = B32[Pi + i];
    for (let i = 0, pos = 0; i < N - 1; i++) {
      BlockMix(V, pos, V, pos += blockSize32, r);
      blockMixCb();
    }
    BlockMix(V, (N - 1) * blockSize32, B32, Pi, r);
    blockMixCb();
    for (let i = 0; i < N; i++) {
      const j = (B32[Pi + blockSize32 - 16] & N - 1) >>> 0;
      for (let k = 0; k < blockSize32; k++)
        tmp[k] = B32[Pi + k] ^ V[j * blockSize32 + k];
      BlockMix(tmp, 0, B32, Pi, r);
      blockMixCb();
    }
  }
  swap32IfBE(B32);
  return scryptOutput(password, dkLen, B, V, tmp);
}
var SCRYPT_DEFAULT_MAXMEM;
var init_scrypt = __esm({
  "scripts/node-lab/node_modules/@noble/hashes/scrypt.js"() {
    init_globals();
    init_pbkdf2();
    init_sha2();
    init_utils();
    __name(XorAndSalsa, "XorAndSalsa");
    __name(BlockMix, "BlockMix");
    SCRYPT_DEFAULT_MAXMEM = 128 * 8 * (2 ** 20 + 1 + 1);
    __name(scryptInit, "scryptInit");
    __name(scryptOutput, "scryptOutput");
    __name(scrypt, "scrypt");
  }
});

// scripts/node-lab/node_modules/@noble/ciphers/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abool(value, title = "") {
  if (typeof value !== "boolean")
    throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value);
  return value;
}
function anumber2(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle2(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle2(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes2(value, length, title = "") {
  if (isBytes2(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber2(length, "length");
  const bytes = isBytes2(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle2(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput2(out2, instance) {
  abytes2(out2, void 0, "output");
  const min = instance.outputLen;
  if (!(out2.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function aoutput32(out2, instance) {
  aoutput2(out2, instance);
  if (!isAligned32(out2))
    throw new Error("invalid output, must be aligned");
}
function u8(arr) {
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
function u322(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean2(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function byteSwap2(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap322(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap2(arr[i]);
  }
  return arr;
}
function overlapBytes(a, b) {
  if (!a.byteLength || !b.byteLength)
    return false;
  return a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
  a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
  b.byteOffset < a.byteOffset + a.byteLength;
}
function complexOverlapBytes(input, output) {
  if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function equalBytes(a, b) {
  a = abytes2(a);
  b = abytes2(b);
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function wrapMacConstructor(keyLen, macCons, fromMsg) {
  const mac = macCons;
  const getArgs = fromMsg || (() => []);
  const macC = /* @__PURE__ */ __name((msg, key) => mac(key, ...getArgs(msg)).update(msg).digest(), "macC");
  const tmp = mac(new Uint8Array(keyLen), ...getArgs(new Uint8Array(0)));
  macC.outputLen = tmp.outputLen;
  macC.blockLen = tmp.blockLen;
  macC.create = (key, ...args) => mac(key, ...args);
  return macC;
}
function getOutput(expectedLength, out2, onlyAligned = true) {
  if (out2 === void 0)
    return new Uint8Array(expectedLength);
  abytes2(out2, expectedLength, "output");
  if (onlyAligned && !isAligned32(out2))
    throw new Error("invalid output, must be aligned");
  return out2;
}
function u64Lengths(dataLength, aadLength, isLE3) {
  anumber2(dataLength);
  anumber2(aadLength);
  abool(isLE3);
  const num = new Uint8Array(16);
  const view = createView2(num);
  view.setBigUint64(0, BigInt(aadLength), isLE3);
  view.setBigUint64(8, BigInt(dataLength), isLE3);
  return num;
}
function isAligned32(bytes) {
  return bytes.byteOffset % 4 === 0;
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes2(bytes));
}
var atitle2, isLE2, swap8IfBE, swap32IfBE2, wrapCipher;
var init_utils2 = __esm({
  "scripts/node-lab/node_modules/@noble/ciphers/utils.js"() {
    init_globals();
    __name(isBytes2, "isBytes");
    atitle2 = /* @__PURE__ */ __name((title) => title ? `"${title}" ` : "", "atitle");
    __name(abool, "abool");
    __name(anumber2, "anumber");
    __name(abytes2, "abytes");
    __name(aexists2, "aexists");
    __name(aoutput2, "aoutput");
    __name(aoutput32, "aoutput32");
    __name(u8, "u8");
    __name(u322, "u32");
    __name(clean2, "clean");
    __name(createView2, "createView");
    isLE2 = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    __name(byteSwap2, "byteSwap");
    swap8IfBE = isLE2 ? (n) => n : (n) => byteSwap2(n) >>> 0;
    __name(byteSwap322, "byteSwap32");
    swap32IfBE2 = isLE2 ? (u) => u : byteSwap322;
    __name(overlapBytes, "overlapBytes");
    __name(complexOverlapBytes, "complexOverlapBytes");
    __name(equalBytes, "equalBytes");
    __name(wrapMacConstructor, "wrapMacConstructor");
    wrapCipher = /* @__PURE__ */ __name(/* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
      function wrappedCipher(key, ...args) {
        abytes2(key, void 0, "key");
        if (params.nonceLength !== void 0) {
          const nonce = args[0];
          abytes2(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
        }
        const tagl = params.tagLength;
        const aadStart = params.nonceLength !== void 0 ? 1 : 0;
        if (!params.withAAD) {
          for (let i = aadStart; i < args.length; i++)
            if (isBytes2(args[i]))
              throw new Error("AAD not supported");
        }
        if (params.withAAD && args[aadStart] !== void 0)
          abytes2(args[aadStart], void 0, "AAD");
        const cipher = constructor(key, ...args);
        const checkOutput = /* @__PURE__ */ __name((fnLength, output) => {
          if (output !== void 0) {
            if (fnLength !== 2)
              throw new Error("cipher output not supported");
            abytes2(output, void 0, "output");
          }
        }, "checkOutput");
        let called = false;
        const wrCipher = {
          encrypt(data, output) {
            if (called)
              throw new Error("cannot encrypt() twice with same key + nonce");
            called = true;
            abytes2(data, void 0, "data");
            checkOutput(cipher.encrypt.length, output);
            return cipher.encrypt(data, output);
          },
          decrypt(data, output) {
            abytes2(data, void 0, "data");
            if (tagl && data.length < tagl)
              throw new Error('"ciphertext" expected length >= tagLength=' + tagl);
            checkOutput(cipher.decrypt.length, output);
            return cipher.decrypt(data, output);
          }
        };
        return wrCipher;
      }
      __name(wrappedCipher, "wrappedCipher");
      Object.assign(wrappedCipher, params);
      return wrappedCipher;
    }, "wrapCipher");
    __name(getOutput, "getOutput");
    __name(u64Lengths, "u64Lengths");
    __name(isAligned32, "isAligned32");
    __name(copyBytes, "copyBytes");
  }
});

// scripts/node-lab/node_modules/@noble/ciphers/_polyval.js
var BLOCK_SIZE, ZEROS16, ZEROS32, POLY, mul2, swapLE, estimateWindow, GHASH, ghash;
var init_polyval = __esm({
  "scripts/node-lab/node_modules/@noble/ciphers/_polyval.js"() {
    init_globals();
    init_utils2();
    BLOCK_SIZE = 16;
    ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
    ZEROS32 = /* @__PURE__ */ u322(ZEROS16);
    POLY = 225;
    mul2 = /* @__PURE__ */ __name((s0, s1, s2, s3) => {
      const hiBit = s3 & 1;
      return {
        s3: s2 << 31 | s3 >>> 1,
        s2: s1 << 31 | s2 >>> 1,
        s1: s0 << 31 | s1 >>> 1,
        // NIST SP 800-38D §6.3 applies `V >> 1` and XORs R on carry. In this
        // 4x32-bit split, R = 0xe1 || 0^120 lives in the top byte of s0.
        s0: s0 >>> 1 ^ POLY << 24 & -(hiBit & 1)
        // reduce % poly
      };
    }, "mul2");
    swapLE = /* @__PURE__ */ __name((n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0, "swapLE");
    estimateWindow = /* @__PURE__ */ __name((bytes) => {
      if (bytes > 64 * 1024)
        return 8;
      if (bytes > 1024)
        return 4;
      return 2;
    }, "estimateWindow");
    GHASH = class {
      static {
        __name(this, "GHASH");
      }
      blockLen = BLOCK_SIZE;
      outputLen = BLOCK_SIZE;
      s0 = 0;
      s1 = 0;
      s2 = 0;
      s3 = 0;
      finished = false;
      destroyed = false;
      t;
      W;
      windowSize;
      // We select bits per window adaptively based on expectedLength
      constructor(key, expectedLength) {
        abytes2(key, 16, "key");
        key = copyBytes(key);
        const kView = createView2(key);
        let k0 = kView.getUint32(0, false);
        let k1 = kView.getUint32(4, false);
        let k2 = kView.getUint32(8, false);
        let k3 = kView.getUint32(12, false);
        const doubles = [];
        for (let i = 0; i < 128; i++) {
          doubles.push({ s0: swapLE(k0), s1: swapLE(k1), s2: swapLE(k2), s3: swapLE(k3) });
          ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2(k0, k1, k2, k3));
        }
        const W = estimateWindow(expectedLength || 1024);
        if (![1, 2, 4, 8].includes(W))
          throw new Error("ghash: invalid window size, expected 2, 4 or 8");
        this.W = W;
        const bits = 128;
        const windows = bits / W;
        const windowSize = this.windowSize = 2 ** W;
        const items = [];
        for (let w = 0; w < windows; w++) {
          for (let byte = 0; byte < windowSize; byte++) {
            let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
            for (let j = 0; j < W; j++) {
              const bit = byte >>> W - j - 1 & 1;
              if (!bit)
                continue;
              const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
              s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
            }
            items.push({ s0, s1, s2, s3 });
          }
        }
        this.t = items;
      }
      _updateBlock(s0, s1, s2, s3) {
        s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
        const { W, t, windowSize } = this;
        let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
        const mask = (1 << W) - 1;
        let w = 0;
        for (const num of [s0, s1, s2, s3]) {
          for (let bytePos = 0; bytePos < 4; bytePos++) {
            const byte = num >>> 8 * bytePos & 255;
            for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
              const bit = byte >>> W * bitPos & mask;
              const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
              o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
              w += 1;
            }
          }
        }
        this.s0 = o0;
        this.s1 = o1;
        this.s2 = o2;
        this.s3 = o3;
      }
      update(data) {
        aexists2(this);
        abytes2(data);
        data = copyBytes(data);
        const b32 = u322(data);
        const blocks = Math.floor(data.length / BLOCK_SIZE);
        const left = data.length % BLOCK_SIZE;
        for (let i = 0; i < blocks; i++) {
          this._updateBlock(swap8IfBE(b32[i * 4 + 0]), swap8IfBE(b32[i * 4 + 1]), swap8IfBE(b32[i * 4 + 2]), swap8IfBE(b32[i * 4 + 3]));
        }
        if (left) {
          ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
          this._updateBlock(swap8IfBE(ZEROS32[0]), swap8IfBE(ZEROS32[1]), swap8IfBE(ZEROS32[2]), swap8IfBE(ZEROS32[3]));
          clean2(ZEROS32);
        }
        return this;
      }
      destroy() {
        this.destroyed = true;
        const { t } = this;
        for (const elm of t) {
          elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
        }
      }
      digestInto(out2) {
        aexists2(this);
        aoutput32(out2, this);
        this.finished = true;
        const { s0, s1, s2, s3 } = this;
        const o32 = u322(out2);
        o32[0] = s0;
        o32[1] = s1;
        o32[2] = s2;
        o32[3] = s3;
        if (!isLE2)
          swap32IfBE2(o32.subarray(0, BLOCK_SIZE / 4));
      }
      digest() {
        const res = new Uint8Array(BLOCK_SIZE);
        this.digestInto(res);
        this.destroy();
        return res;
      }
    };
    ghash = /* @__PURE__ */ wrapMacConstructor(16, (key, expectedLength) => new GHASH(key, expectedLength), (msg) => [msg.length]);
  }
});

// scripts/node-lab/node_modules/@noble/ciphers/aes.js
function validateKeyLength(key) {
  if (![16, 24, 32].includes(key.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + key.length);
}
function mul22(n) {
  return n << 1 ^ POLY2 & -(n >> 7);
}
function mul(a, b) {
  let res = 0;
  for (; b > 0; b >>= 1) {
    res ^= a & -(b & 1);
    a = mul22(a);
  }
  return res;
}
function genTtable(sbox2, fn) {
  if (sbox2.length !== 256)
    throw new Error("wrong sbox length");
  const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
  const T1 = T0.map(rotl32_8);
  const T2 = T1.map(rotl32_8);
  const T3 = T2.map(rotl32_8);
  const T01 = new Uint32Array(256 * 256);
  const T23 = new Uint32Array(256 * 256);
  const sbox22 = new Uint16Array(256 * 256);
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
      const idx = i * 256 + j;
      T01[idx] = T0[i] ^ T1[j];
      T23[idx] = T2[i] ^ T3[j];
      sbox22[idx] = sbox2[i] << 8 | sbox2[j];
    }
  }
  return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
}
function expandKeyLE(key) {
  abytes2(key);
  const len = key.length;
  validateKeyLength(key);
  const { sbox2 } = tableEncoding;
  const toClean = [];
  if (!isLE2 || !isAligned32(key))
    toClean.push(key = copyBytes(key));
  const k32 = swap32IfBE2(u322(key));
  const Nk = k32.length;
  const subByte = /* @__PURE__ */ __name((n) => applySbox(sbox2, n, n, n, n), "subByte");
  const xk = new Uint32Array(len + 28);
  xk.set(k32);
  for (let i = Nk; i < xk.length; i++) {
    let t = xk[i - 1];
    if (i % Nk === 0)
      t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
    else if (Nk > 6 && i % Nk === 4)
      t = subByte(t);
    xk[i] = xk[i - Nk] ^ t;
  }
  clean2(...toClean);
  return xk;
}
function expandKeyDecLE(key) {
  const encKey = expandKeyLE(key);
  const xk = encKey.slice();
  const Nk = encKey.length;
  const { sbox2 } = tableEncoding;
  const { T0, T1, T2, T3 } = tableDecoding;
  for (let i = 0; i < Nk; i += 4) {
    for (let j = 0; j < 4; j++)
      xk[i + j] = encKey[Nk - i - 4 + j];
  }
  clean2(encKey);
  for (let i = 4; i < Nk - 4; i++) {
    const x = xk[i];
    const w = applySbox(sbox2, x, x, x, x);
    xk[i] = T0[w & 255] ^ T1[w >>> 8 & 255] ^ T2[w >>> 16 & 255] ^ T3[w >>> 24];
  }
  return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
  return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
}
function applySbox(sbox2, s0, s1, s2, s3) {
  return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
}
function encrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableEncoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function decrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableDecoding;
  let k = 0;
  s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t02 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
    const t12 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
    const t22 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
    const t32 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
    s0 = t02, s1 = t12, s2 = t22, s3 = t32;
  }
  const t0 = xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1);
  const t1 = xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2);
  const t2 = xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3);
  const t3 = xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0);
  return { s0: t0, s1: t1, s2: t2, s3: t3 };
}
function ctr32(xk, isLE3, nonce, src, dst) {
  abytes2(nonce, BLOCK_SIZE2, "nonce");
  abytes2(src);
  dst = getOutput(src.length, dst);
  const ctr = nonce;
  const c32 = u322(ctr);
  const view = createView2(ctr);
  const src32 = u322(src);
  const dst32 = u322(dst);
  const ctrPos = isLE3 ? 0 : 12;
  const srcLen = src.length;
  let ctrNum = view.getUint32(ctrPos, isLE3);
  for (let i = 0; i + 4 <= src32.length; i += 4) {
    const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
    dst32[i + 0] = src32[i + 0] ^ swap8IfBE(s0);
    dst32[i + 1] = src32[i + 1] ^ swap8IfBE(s1);
    dst32[i + 2] = src32[i + 2] ^ swap8IfBE(s2);
    dst32[i + 3] = src32[i + 3] ^ swap8IfBE(s3);
    ctrNum = ctrNum + 1 >>> 0;
    view.setUint32(ctrPos, ctrNum, isLE3);
  }
  const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
  if (start < srcLen) {
    const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
    const b32 = new Uint32Array([s0, s1, s2, s3]);
    swap32IfBE2(b32);
    const buf = u8(b32);
    for (let i = start, pos = 0; i < srcLen; i++, pos++)
      dst[i] = src[i] ^ buf[pos];
    clean2(b32);
  }
  return dst;
}
function validateBlockDecrypt(data, dst) {
  abytes2(data);
  if (data.length % BLOCK_SIZE2 !== 0) {
    throw new Error("ciphertext must be multiple of " + BLOCK_SIZE2);
  }
  if (dst !== void 0) {
    getOutput(data.length, dst);
    complexOverlapBytes(data, dst);
  }
}
function validateBlockEncrypt(plaintext, pkcs5, dst) {
  abytes2(plaintext);
  let outLen = plaintext.length;
  const remaining = outLen % BLOCK_SIZE2;
  if (!pkcs5 && remaining !== 0)
    throw new Error("plaintext must be multiple of " + BLOCK_SIZE2);
  if (pkcs5) {
    let left = BLOCK_SIZE2 - remaining;
    if (!left)
      left = BLOCK_SIZE2;
    outLen = outLen + left;
  }
  if (dst !== void 0) {
    getOutput(outLen, dst);
    complexOverlapBytes(plaintext, dst);
  }
  return outLen;
}
function prepareBlockEncrypt(plaintext, outLen, dst) {
  if (dst === void 0)
    dst = new Uint8Array(outLen);
  if (!isLE2 || !isAligned32(plaintext))
    plaintext = copyBytes(plaintext);
  const o = u322(dst);
  return { b: plaintext, o, out: dst };
}
function validatePKCS(data, pkcs5) {
  if (!pkcs5)
    return data;
  const len = data.length;
  if (len === 0)
    throw new Error("pkcs7: empty ciphertext not allowed");
  const lastByte = data[len - 1];
  let valid = 1;
  valid &= lastByte - 1 >>> 31 ^ 1;
  valid &= 16 - lastByte >>> 31 ^ 1;
  for (let i = 0; i < 16; i++) {
    const shouldCheck = i - lastByte >>> 31;
    const eq = (data[len - 1 - i] ^ lastByte) === 0 ? 1 : 0;
    valid &= eq | shouldCheck ^ 1;
  }
  if (!valid)
    throw new Error("aes: bad decrypt");
  return data.subarray(0, len - lastByte);
}
function padPCKS(left) {
  const tmp = new Uint8Array(16);
  const tmp32 = u322(tmp);
  tmp.set(left);
  const paddingByte = BLOCK_SIZE2 - left.length;
  for (let i = BLOCK_SIZE2 - paddingByte; i < BLOCK_SIZE2; i++)
    tmp[i] = paddingByte;
  return tmp32;
}
function computeTag(fn, isLE3, key, data, AAD) {
  const aadLength = AAD ? AAD.length : 0;
  const h = fn.create(key, data.length + aadLength);
  if (AAD)
    h.update(AAD);
  const num = u64Lengths(8 * data.length, 8 * aadLength, isLE3);
  h.update(data);
  h.update(num);
  const res = h.digest();
  clean2(num);
  return res;
}
var BLOCK_SIZE2, BLOCK_SIZE32, EMPTY_BLOCK, POLY2, sbox, invSbox, rotr32_8, rotl32_8, tableEncoding, tableDecoding, xPowers, cbc, gcm;
var init_aes = __esm({
  "scripts/node-lab/node_modules/@noble/ciphers/aes.js"() {
    init_globals();
    init_polyval();
    init_utils2();
    BLOCK_SIZE2 = 16;
    BLOCK_SIZE32 = 4;
    EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE2);
    POLY2 = 283;
    __name(validateKeyLength, "validateKeyLength");
    __name(mul22, "mul2");
    __name(mul, "mul");
    sbox = /* @__PURE__ */ (() => {
      const t = new Uint8Array(256);
      for (let i = 0, x = 1; i < 256; i++, x ^= mul22(x))
        t[i] = x;
      const box = new Uint8Array(256);
      box[0] = 99;
      for (let i = 0; i < 255; i++) {
        let x = t[255 - i];
        x |= x << 8;
        box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
      }
      clean2(t);
      return box;
    })();
    invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
    rotr32_8 = /* @__PURE__ */ __name((n) => n << 24 | n >>> 8, "rotr32_8");
    rotl32_8 = /* @__PURE__ */ __name((n) => n << 8 | n >>> 24, "rotl32_8");
    __name(genTtable, "genTtable");
    tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
    tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => mul(s, 11) << 24 | mul(s, 13) << 16 | mul(s, 9) << 8 | mul(s, 14));
    xPowers = /* @__PURE__ */ (() => {
      const p = new Uint8Array(16);
      for (let i = 0, x = 1; i < 16; i++, x = mul22(x))
        p[i] = x;
      return p;
    })();
    __name(expandKeyLE, "expandKeyLE");
    __name(expandKeyDecLE, "expandKeyDecLE");
    __name(apply0123, "apply0123");
    __name(applySbox, "applySbox");
    __name(encrypt, "encrypt");
    __name(decrypt, "decrypt");
    __name(ctr32, "ctr32");
    __name(validateBlockDecrypt, "validateBlockDecrypt");
    __name(validateBlockEncrypt, "validateBlockEncrypt");
    __name(prepareBlockEncrypt, "prepareBlockEncrypt");
    __name(validatePKCS, "validatePKCS");
    __name(padPCKS, "padPCKS");
    cbc = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 16 }, /* @__PURE__ */ __name(function aescbc(key, iv, opts = {}) {
      const pkcs5 = !opts.disablePadding;
      return {
        encrypt(plaintext, dst) {
          const outLen = validateBlockEncrypt(plaintext, pkcs5, dst);
          const xk = expandKeyLE(key);
          const { b: input, o, out: _out } = prepareBlockEncrypt(plaintext, outLen, dst);
          const b = u322(input);
          swap32IfBE2(b);
          let _iv = iv;
          const toClean = [xk];
          if (!isLE2 || !isAligned32(_iv))
            toClean.push(_iv = copyBytes(_iv));
          const n32 = u322(_iv);
          swap32IfBE2(n32);
          let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
          let i = 0;
          for (; i + 4 <= b.length; ) {
            s0 ^= b[i + 0], s1 ^= b[i + 1], s2 ^= b[i + 2], s3 ^= b[i + 3];
            ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
          }
          if (pkcs5) {
            const tmp32 = padPCKS(plaintext.subarray(i * 4));
            swap32IfBE2(tmp32);
            s0 ^= tmp32[0], s1 ^= tmp32[1], s2 ^= tmp32[2], s3 ^= tmp32[3];
            ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
            o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
            clean2(tmp32);
          }
          swap32IfBE2(o);
          clean2(...toClean);
          if (input !== plaintext)
            clean2(input);
          return _out;
        },
        decrypt(ciphertext, dst) {
          validateBlockDecrypt(ciphertext, dst);
          const xk = expandKeyDecLE(key);
          if (dst === void 0)
            dst = new Uint8Array(ciphertext.length);
          let _iv = iv;
          const toClean = [xk];
          if (!isLE2 || !isAligned32(_iv))
            toClean.push(_iv = copyBytes(_iv));
          const n32 = u322(_iv);
          swap32IfBE2(n32);
          if (!isLE2 || !isAligned32(ciphertext))
            toClean.push(ciphertext = copyBytes(ciphertext));
          const b = u322(ciphertext);
          const o = u322(dst);
          swap32IfBE2(b);
          let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
          for (let i = 0; i + 4 <= b.length; ) {
            const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
            s0 = b[i + 0], s1 = b[i + 1], s2 = b[i + 2], s3 = b[i + 3];
            const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
            o[i++] = o0 ^ ps0, o[i++] = o1 ^ ps1, o[i++] = o2 ^ ps2, o[i++] = o3 ^ ps3;
          }
          swap32IfBE2(o);
          clean2(...toClean);
          return validatePKCS(dst, pkcs5);
        }
      };
    }, "aescbc"));
    __name(computeTag, "computeTag");
    gcm = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 12, tagLength: 16, withAAD: true, varSizeNonce: true }, /* @__PURE__ */ __name(function aesgcm(key, nonce, AAD) {
      if (nonce.length < 8)
        throw new Error("aes/gcm: invalid nonce length");
      const tagLength = 16;
      function _computeTag(authKey, tagMask, data) {
        const tag = computeTag(ghash, false, authKey, data, AAD);
        for (let i = 0; i < tagMask.length; i++)
          tag[i] ^= tagMask[i];
        return tag;
      }
      __name(_computeTag, "_computeTag");
      function deriveKeys() {
        const xk = expandKeyLE(key);
        const authKey = EMPTY_BLOCK.slice();
        const counter = EMPTY_BLOCK.slice();
        ctr32(xk, false, counter, counter, authKey);
        if (nonce.length === 12) {
          counter.set(nonce);
        } else {
          const nonceLen = EMPTY_BLOCK.slice();
          const view = createView2(nonceLen);
          view.setBigUint64(8, BigInt(nonce.length * 8), false);
          const g = ghash.create(authKey).update(nonce).update(nonceLen);
          g.digestInto(counter);
          g.destroy();
        }
        const tagMask = ctr32(xk, false, counter, EMPTY_BLOCK);
        return { xk, authKey, counter, tagMask };
      }
      __name(deriveKeys, "deriveKeys");
      return {
        encrypt(plaintext) {
          const { xk, authKey, counter, tagMask } = deriveKeys();
          const out2 = new Uint8Array(plaintext.length + tagLength);
          const toClean = [xk, authKey, counter, tagMask];
          if (!isAligned32(plaintext))
            toClean.push(plaintext = copyBytes(plaintext));
          ctr32(xk, false, counter, plaintext, out2.subarray(0, plaintext.length));
          const tag = _computeTag(authKey, tagMask, out2.subarray(0, out2.length - tagLength));
          toClean.push(tag);
          out2.set(tag, plaintext.length);
          clean2(...toClean);
          return out2;
        },
        decrypt(ciphertext) {
          const { xk, authKey, counter, tagMask } = deriveKeys();
          const toClean = [xk, authKey, tagMask, counter];
          if (!isAligned32(ciphertext))
            toClean.push(ciphertext = copyBytes(ciphertext));
          const data = ciphertext.subarray(0, -tagLength);
          const passedTag = ciphertext.subarray(-tagLength);
          const tag = _computeTag(authKey, tagMask, data);
          toClean.push(tag);
          if (!equalBytes(tag, passedTag)) {
            clean2(...toClean);
            throw new Error("aes-gcm: invalid tag");
          }
          const out2 = ctr32(xk, false, counter, data);
          clean2(...toClean);
          return out2;
        }
      };
    }, "aesgcm"));
  }
});

// src/academy/node/runtime/crypto.js
var crypto_exports = {};
__export(crypto_exports, {
  KeyObject: () => KeyObject,
  constants: () => constants,
  createCipheriv: () => createCipheriv,
  createDecipheriv: () => createDecipheriv,
  createHash: () => createHash,
  createHmac: () => createHmac,
  createPrivateKey: () => createPrivateKey,
  createPublicKey: () => createPublicKey,
  createSecretKey: () => createSecretKey,
  default: () => crypto_default,
  getCiphers: () => getCiphers,
  getHashes: () => getHashes,
  getRandomValues: () => getRandomValues,
  hash: () => hash,
  pbkdf2: () => pbkdf22,
  pbkdf2Sync: () => pbkdf2Sync,
  pseudoRandomBytes: () => pseudoRandomBytes,
  randomBytes: () => randomBytes,
  randomFillSync: () => randomFillSync,
  randomInt: () => randomInt,
  randomUUID: () => randomUUID,
  scrypt: () => scrypt2,
  scryptSync: () => scryptSync,
  subtle: () => subtle,
  timingSafeEqual: () => timingSafeEqual,
  webcrypto: () => webcrypto
});
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
  throw nodeError("ERR_INVALID_ARG_TYPE", `The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received ${data === void 0 ? "undefined" : data === null ? "null" : typeof data}`, TypeError);
}
function out(bytes, encoding) {
  const buf = Buffer.from(bytes);
  return encoding ? buf.toString(encoding) : buf;
}
function createHash(algorithm) {
  return new Hash(algorithm);
}
function hash(algorithm, data, outputEncoding = "hex") {
  return createHash(algorithm).update(data).digest(outputEncoding === "buffer" ? void 0 : outputEncoding);
}
function createHmac(algorithm, key) {
  if (key === void 0 || key === null) {
    throw nodeError("ERR_INVALID_ARG_TYPE", `The "key" argument must be of type string or an instance of ArrayBuffer, Buffer, TypedArray, DataView, KeyObject, or CryptoKey. Received ${key}`, TypeError);
  }
  return new Hmac(algorithm, key);
}
function randomBytes(size, cb) {
  const buf = Buffer.alloc(size);
  for (let i = 0; i < size; i += 65536) globalThis.crypto.getRandomValues(buf.subarray(i, Math.min(size, i + 65536)));
  if (typeof cb === "function") {
    ctx.loop ? ctx.loop.setImmediate(cb, null, buf) : queueMicrotask(() => cb(null, buf));
    return void 0;
  }
  return buf;
}
function randomFillSync(buf) {
  globalThis.crypto.getRandomValues(buf);
  return buf;
}
function randomUUID() {
  return globalThis.crypto.randomUUID();
}
function randomInt(min, max, cb) {
  if (max === void 0 || typeof max === "function") {
    cb = max;
    max = min;
    min = 0;
  }
  const range = max - min;
  if (!(range > 0)) {
    throw nodeError("ERR_OUT_OF_RANGE", `The value of "max" is out of range. It must be greater than the value of "min" (${min}). Received ${max}`, RangeError);
  }
  const limit = 2 ** 48 - 2 ** 48 % range;
  let n;
  do {
    const b = randomBytes(6);
    n = b.readUIntBE(0, 6);
  } while (n >= limit);
  const value = min + n % range;
  if (typeof cb === "function") {
    ctx.loop.setImmediate(cb, null, value);
    return void 0;
  }
  return value;
}
function timingSafeEqual(a, b) {
  const x = toBytes(a);
  const y = toBytes(b);
  if (x.length !== y.length) throw nodeError("ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH", "Input buffers must have the same byte length", RangeError);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
function pbkdf2Sync(password, salt, iterations, keylen, digest) {
  return Buffer.from(pbkdf2(hashFn(digest), toBytes(password), toBytes(salt), { c: iterations, dkLen: keylen }));
}
function pbkdf22(password, salt, iterations, keylen, digest, cb) {
  let result;
  let error = null;
  try {
    result = pbkdf2Sync(password, salt, iterations, keylen, digest);
  } catch (e) {
    error = e;
  }
  ctx.loop.setImmediate(() => error ? cb(error) : cb(null, result));
}
function scryptSync(password, salt, keylen, options = {}) {
  const N = options.N ?? options.cost ?? 16384;
  const r = options.r ?? options.blockSize ?? 8;
  const p = options.p ?? options.parallelization ?? 1;
  if (N < 2 || (N & N - 1) !== 0) throw nodeError("ERR_CRYPTO_INVALID_SCRYPT_PARAMS", "Invalid scrypt params", RangeError);
  return Buffer.from(scrypt(toBytes(password), toBytes(salt), { N, r, p, dkLen: keylen }));
}
function scrypt2(password, salt, keylen, options, cb) {
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
  ctx.loop.setImmediate(() => error ? cb(error) : cb(null, result));
}
function createSecretKey(key, encoding) {
  return new KeyObject("secret", Buffer.from(toBytes(key, encoding)));
}
function createPrivateKey(key) {
  const text = typeof key === "string" ? key : Buffer.isBuffer(key) ? key.toString() : key?.key;
  if (typeof text === "string" && text.includes("-----BEGIN")) {
    throw nodeError("ERR_FEATURE_UNAVAILABLE_ON_PLATFORM", "This lab supports HMAC keys (HS256); RSA and EC keys need a real Node.js server");
  }
  throw nodeError("ERR_OSSL_UNSUPPORTED", "error:1E08010C:DECODER routines::unsupported");
}
function createCipheriv(algorithm, key, iv) {
  return new Cipher(false, algorithm, key, iv);
}
function createDecipheriv(algorithm, key, iv) {
  return new Cipher(true, algorithm, key, iv);
}
function getHashes() {
  return ["md5", "sha1", "sha224", "sha256", "sha384", "sha512"];
}
function getCiphers() {
  return Object.keys(CIPHERS);
}
function getRandomValues(arr) {
  return globalThis.crypto.getRandomValues(arr);
}
var HASHES, Hash, Hmac, pseudoRandomBytes, KeyObject, createPublicKey, CIPHERS, Cipher, webcrypto, subtle, constants, crypto_default;
var init_crypto = __esm({
  "src/academy/node/runtime/crypto.js"() {
    init_globals();
    init_sha2();
    init_legacy();
    init_hmac();
    init_pbkdf2();
    init_scrypt();
    init_aes();
    init_buffer();
    init_context();
    HASHES = { sha256, sha1, md5, sha512, sha384, sha224, "sha-256": sha256, "sha-1": sha1, "sha-512": sha512 };
    __name(nodeError, "nodeError");
    __name(hashFn, "hashFn");
    __name(toBytes, "toBytes");
    __name(out, "out");
    Hash = class _Hash {
      static {
        __name(this, "Hash");
      }
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
        return new _Hash(this._alg, this._h.clone());
      }
    };
    __name(createHash, "createHash");
    __name(hash, "hash");
    Hmac = class {
      static {
        __name(this, "Hmac");
      }
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
    };
    __name(createHmac, "createHmac");
    __name(randomBytes, "randomBytes");
    pseudoRandomBytes = randomBytes;
    __name(randomFillSync, "randomFillSync");
    __name(randomUUID, "randomUUID");
    __name(randomInt, "randomInt");
    __name(timingSafeEqual, "timingSafeEqual");
    __name(pbkdf2Sync, "pbkdf2Sync");
    __name(pbkdf22, "pbkdf2");
    __name(scryptSync, "scryptSync");
    __name(scrypt2, "scrypt");
    KeyObject = class _KeyObject {
      static {
        __name(this, "KeyObject");
      }
      constructor(type, key) {
        this.type = type;
        Object.defineProperty(this, "_key", { value: key });
      }
      get symmetricKeySize() {
        return this.type === "secret" ? this._key.length : void 0;
      }
      get asymmetricKeyType() {
        return void 0;
      }
      export(options) {
        if (options?.format === "jwk") return { kty: "oct", k: this._key.toString("base64url") };
        return Buffer.from(this._key);
      }
      equals(other) {
        return other instanceof _KeyObject && timingSafeEqual(this._key, other._key);
      }
    };
    __name(createSecretKey, "createSecretKey");
    __name(createPrivateKey, "createPrivateKey");
    createPublicKey = createPrivateKey;
    CIPHERS = {
      "aes-256-gcm": { key: 32, mode: "gcm" },
      "aes-192-gcm": { key: 24, mode: "gcm" },
      "aes-128-gcm": { key: 16, mode: "gcm" },
      "aes-256-cbc": { key: 32, mode: "cbc" },
      "aes-128-cbc": { key: 16, mode: "cbc" }
    };
    Cipher = class {
      static {
        __name(this, "Cipher");
      }
      constructor(decrypt2, algorithm, key, iv) {
        const spec = CIPHERS[String(algorithm).toLowerCase()];
        if (!spec) throw nodeError("ERR_CRYPTO_UNKNOWN_CIPHER", "Unknown cipher");
        const k = toBytes(key);
        if (k.length !== spec.key) throw nodeError("ERR_CRYPTO_INVALID_KEYLEN", "Invalid key length", RangeError);
        this._spec = spec;
        this._key = k;
        this._iv = toBytes(iv);
        this._decrypt = decrypt2;
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
          const c = gcm(this._key, this._iv, this._aad || void 0);
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
    };
    __name(createCipheriv, "createCipheriv");
    __name(createDecipheriv, "createDecipheriv");
    __name(getHashes, "getHashes");
    __name(getCiphers, "getCiphers");
    webcrypto = globalThis.crypto;
    subtle = globalThis.crypto?.subtle;
    __name(getRandomValues, "getRandomValues");
    constants = {};
    crypto_default = {
      createHash,
      hash,
      createHmac,
      randomBytes,
      pseudoRandomBytes,
      randomFillSync,
      randomUUID,
      randomInt,
      timingSafeEqual,
      pbkdf2: pbkdf22,
      pbkdf2Sync,
      scrypt: scrypt2,
      scryptSync,
      KeyObject,
      createSecretKey,
      createPrivateKey,
      createPublicKey,
      createCipheriv,
      createDecipheriv,
      getHashes,
      getCiphers,
      webcrypto,
      subtle,
      getRandomValues,
      constants
    };
  }
});

export {
  createHash,
  hash,
  createHmac,
  randomBytes,
  pseudoRandomBytes,
  randomFillSync,
  randomUUID,
  randomInt,
  timingSafeEqual,
  pbkdf2Sync,
  pbkdf22 as pbkdf2,
  scryptSync,
  scrypt2 as scrypt,
  KeyObject,
  createSecretKey,
  createPrivateKey,
  createPublicKey,
  createCipheriv,
  createDecipheriv,
  getHashes,
  getCiphers,
  webcrypto,
  subtle,
  getRandomValues,
  constants,
  crypto_default,
  crypto_exports,
  init_crypto
};
