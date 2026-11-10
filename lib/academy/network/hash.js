/**
 * The two password encodings a Cisco configuration shows, implemented exactly
 * so the NetLab running-config prints what a real router would.
 *
 *   type 7  `service password-encryption`: a published, reversible XOR with a
 *           fixed key. Obfuscation, not encryption, which is the lesson.
 *   type 5  `enable secret` / `username … secret`: MD5-crypt ($1$salt$hash),
 *           a salted one-way hash.
 *
 * Pure, no dependencies, the same output in the browser and in Node.
 */

const XLAT = "dsfd;kfoA,.iyewrkldJKDHSUBsgvca69834ncxv9873254k;fg87";

/** Encode as type 7 with a fixed seed, as `show running-config` prints it. */
export function type7(plain, seed = 8) {
  let out = String(seed).padStart(2, "0");
  for (let i = 0; i < plain.length; i += 1) {
    const code = plain.charCodeAt(i) ^ XLAT.charCodeAt((seed + i) % XLAT.length);
    out += code.toString(16).toUpperCase().padStart(2, "0");
  }
  return out;
}

/** Reverse a type-7 string. Anyone can, which is why it is not a secret. */
export function untype7(encoded) {
  const seed = Number(encoded.slice(0, 2));
  let out = "";
  for (let i = 2, j = 0; i < encoded.length; i += 2, j += 1) {
    out += String.fromCharCode(parseInt(encoded.slice(i, i + 2), 16) ^ XLAT.charCodeAt((seed + j) % XLAT.length));
  }
  return out;
}

/* ── MD5 (RFC 1321) over byte arrays ─────────────────────────────────── */

const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

function md5(bytes) {
  const len = bytes.length;
  const padded = new Uint8Array(((len + 8) >>> 6) * 64 + 64);
  padded.set(bytes);
  padded[len] = 0x80;
  const bits = len * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bits >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(bits / 2 ** 32), true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  for (let off = 0; off < padded.length; off += 64) {
    const M = Array.from({ length: 16 }, (_, i) => view.getUint32(off + i * 4, true));
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i += 1) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const out = new Uint8Array(16);
  const ov = new DataView(out.buffer);
  [a0, b0, c0, d0].forEach((w, i) => ov.setUint32(i * 4, w, true));
  return out;
}

const utf8 = (s) => new TextEncoder().encode(s);
const concat = (...arrs) => {
  const out = new Uint8Array(arrs.reduce((n, a) => n + a.length, 0));
  let o = 0;
  for (const a of arrs) { out.set(a, o); o += a.length; }
  return out;
};

export function md5Hex(text) {
  return [...md5(utf8(text))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ITOA64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** MD5-crypt, as used by Cisco type 5 secrets: "$1$salt$hash". */
export function md5crypt(password, salt) {
  const pw = utf8(password);
  const sl = utf8(salt.slice(0, 8));
  const magic = utf8("$1$");
  let alt = md5(concat(pw, sl, pw));
  let ctx = concat(pw, magic, sl);
  for (let i = pw.length; i > 0; i -= 16) ctx = concat(ctx, alt.slice(0, Math.min(16, i)));
  for (let i = pw.length; i; i >>= 1) ctx = concat(ctx, i & 1 ? new Uint8Array([0]) : pw.slice(0, 1));
  let fin = md5(ctx);
  for (let i = 0; i < 1000; i += 1) {
    let c = new Uint8Array(0);
    c = concat(c, i & 1 ? pw : fin);
    if (i % 3) c = concat(c, sl);
    if (i % 7) c = concat(c, pw);
    c = concat(c, i & 1 ? fin : pw);
    fin = md5(c);
  }
  let out = "";
  const to64 = (v, n) => {
    for (let k = 0; k < n; k += 1) { out += ITOA64[v & 0x3f]; v >>>= 6; }
  };
  to64((fin[0] << 16) | (fin[6] << 8) | fin[12], 4);
  to64((fin[1] << 16) | (fin[7] << 8) | fin[13], 4);
  to64((fin[2] << 16) | (fin[8] << 8) | fin[14], 4);
  to64((fin[3] << 16) | (fin[9] << 8) | fin[15], 4);
  to64((fin[4] << 16) | (fin[10] << 8) | fin[5], 4);
  to64(fin[11], 2);
  alt = null;
  return `$1$${salt.slice(0, 8)}$${out}`;
}

/** A salt derived from the input, so the same secret prints the same line every time. */
export function saltFor(seed) {
  const hex = md5Hex(seed);
  let s = "";
  for (let i = 0; i < 4; i += 1) s += ITOA64[parseInt(hex.slice(i * 2, i * 2 + 2), 16) % 64];
  return s;
}
