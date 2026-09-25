/**
 * DETERMINISTIC RANDOMNESS FOR QUESTION GENERATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this, or anything beside it, from src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Every question in this course is GENERATED, not stored. That is the whole
 * reason the remediation loop can work: when a student gets one wrong, the
 * platform has to be able to hand them another of exactly the same kind with
 * different numbers, immediately and forever. A fixed bank of items cannot do
 * that — after two attempts the student is answering from memory of the item
 * rather than from the skill, and the mastery check stops measuring anything.
 *
 * Generation also has to be REPRODUCIBLE, because grading happens on a second
 * request. Rather than storing the served items, the server regenerates them
 * from (seed, index) and marks against what it regenerated. Nothing about the
 * answers ever travels to the browser, and the client cannot forge an item it
 * did not receive, because the seed alone produces nothing without the
 * generators — which live here.
 *
 * mulberry32 is the same generator lib/academy/grade.js uses for option
 * shuffling, for the same reason: Math.imul keeps every multiply inside 32
 * bits, where a plain JavaScript LCG silently loses its low bits to floating
 * point after the first round.
 */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a, so a string can seed a stream. */
export function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * A small helper object rather than a bare function, because generators read
 * far better as `r.int(2, 9)` than as arithmetic on a float, and because
 * `r.pick` and `r.shuffle` are wanted in almost every one of them.
 */
export function makeRng(seed) {
  const next = mulberry32(seed >>> 0);

  const r = {
    /** Uniform float in [0, 1). */
    next,
    /** Integer in [lo, hi], inclusive at both ends. */
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    /** One item from a list. */
    pick: (list) => list[Math.floor(next() * list.length)],
    /** True with the given probability. */
    chance: (p = 0.5) => next() < p,
    /** Fisher-Yates, unbiased, on a copy. */
    shuffle: (list) => {
      const out = [...list];
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
    /** n distinct items from a list. */
    sample: (list, n) => r.shuffle(list).slice(0, n),
    /** An integer in [lo, hi] that is not in `avoid`. */
    intExcept: (lo, hi, avoid = []) => {
      for (let tries = 0; tries < 50; tries += 1) {
        const v = r.int(lo, hi);
        if (!avoid.includes(v)) return v;
      }
      return lo;
    },
    /** A seed for a derived stream — used to make a twin of an item. */
    seed: () => (next() * 4294967296) >>> 0,
  };

  return r;
}

/* ── Number theory the generators keep needing ───────────────────────── */

export const gcd = (x, y) => (y === 0 ? Math.abs(x) : gcd(y, x % y));
export const lcm = (x, y) => Math.abs(x * y) / gcd(x, y);

export function factorsOf(n) {
  const out = [];
  for (let i = 1; i * i <= n; i += 1) {
    if (n % i === 0) {
      out.push(i);
      if (i !== n / i) out.push(n / i);
    }
  }
  return out.sort((x, y) => x - y);
}

export function primeFactors(n) {
  const out = [];
  let m = n;
  for (let p = 2; p * p <= m; p += 1) {
    while (m % p === 0) {
      out.push(p);
      m /= p;
    }
  }
  if (m > 1) out.push(m);
  return out;
}

/** Prime factorisation in index form, as [[base, power], …]. */
export function primePowers(n) {
  const out = [];
  for (const p of primeFactors(n)) {
    const last = out[out.length - 1];
    if (last && last[0] === p) last[1] += 1;
    else out.push([p, 1]);
  }
  return out;
}

export function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i += 1) if (n % i === 0) return false;
  return true;
}

export const PRIMES_TO_100 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73,
  79, 83, 89, 97,
];

/* ── Fractions ───────────────────────────────────────────────────────── */

export function simplify(numerator, denominator) {
  const sign = denominator < 0 ? -1 : 1;
  const n = numerator * sign;
  const d = denominator * sign;
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  return [n / g, d / g];
}

export const fracText = (n, d) => (d === 1 ? String(n) : `${n}/${d}`);

/** A mixed number as it is read aloud: 2 3/4. */
export function mixedText(n, d) {
  if (Math.abs(n) < d) return fracText(n, d);
  const whole = Math.trunc(n / d);
  const rest = Math.abs(n % d);
  return rest === 0 ? String(whole) : `${whole} ${rest}/${d}`;
}

/* ── Presentation ────────────────────────────────────────────────────── */

/** Thousand separators, the way a Nigerian exam paper prints a number. */
export function grouped(n) {
  return Number(n).toLocaleString("en-NG");
}

export function naira(amount) {
  const value = Number(amount);
  const decimals = Number.isInteger(value) ? 0 : 2;
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  })}`;
}

/** Trims floating-point noise without pretending to a precision we lack. */
export function tidy(value, dp = 6) {
  const rounded = Number(Number(value).toFixed(dp));
  return Object.is(rounded, -0) ? 0 : rounded;
}

/* ── Anchors ─────────────────────────────────────────────────────────── */

/**
 * The Anchor stage of every atom meets the idea in a real Nigerian situation.
 * Generators draw their names, places and goods from here so that a market
 * question reads like a market rather than like a textbook that has heard of
 * markets. Kept in one list so the mix can be checked, and so no single name
 * dominates the course.
 */
export const NAMES = [
  "Adaeze", "Chinedu", "Fatima", "Bola", "Ngozi", "Emeka", "Aisha", "Tunde",
  "Zainab", "Obi", "Yemi", "Hauwa", "Segun", "Amaka", "Musa", "Ifeoma",
  "Kunle", "Halima", "Chika", "Bashir",
];

export const MARKETS = [
  "Balogun market", "Ariaria market", "Wuse market", "Oshodi market",
  "Onitsha main market", "Kurmi market", "Oja Oba", "Mile 12 market",
];

export const GOODS = [
  { name: "sachets of pure water", unit: "sachet", low: 20, high: 60 },
  { name: "tubers of yam", unit: "tuber", low: 900, high: 2500 },
  { name: "loaves of bread", unit: "loaf", low: 700, high: 1800 },
  { name: "cartons of eggs", unit: "carton", low: 3000, high: 6500 },
  { name: "bags of rice", unit: "bag", low: 55000, high: 95000 },
  { name: "exercise books", unit: "book", low: 150, high: 500 },
  { name: "bottles of groundnut oil", unit: "bottle", low: 1200, high: 3500 },
];

export const PLACES = [
  "Lagos", "Kano", "Enugu", "Ibadan", "Port Harcourt", "Abuja", "Jos", "Calabar",
];
