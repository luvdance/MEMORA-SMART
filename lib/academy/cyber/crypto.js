/**
 * CRYPTO LAB ENGINE — real hashing, not a picture of hashing.
 *
 * Pure apart from the platform's own Web Crypto. Shared by
 * src/academy/components/CryptoLab.jsx and the content validator, and both run
 * the SAME SHA-256: `globalThis.crypto.subtle` exists in every browser this
 * platform supports and in Node 18 and above, so the digest a learner sees in
 * the lesson is the digest the build checked, and either can be verified
 * against `sha256sum` on any machine.
 *
 * That matters more here than anywhere else in the course. A cryptography
 * lesson with invented hex strings in it is indistinguishable, to a beginner,
 * from one with real ones. The whole subject rests on trusting that the maths
 * does what it claims, and the fastest way to build that trust is to let
 * someone type their own password and watch a real digest appear.
 *
 * WHAT THIS IS NOT: a password storage implementation. Real systems use
 * bcrypt, scrypt or Argon2, which are deliberately SLOW so that guessing is
 * expensive. SHA-256 is fast, which is exactly what you do not want. The
 * lessons say so; this module is for demonstrating the concepts.
 */

const encoder = new TextEncoder();

/** SHA-256 of a string, lowercase hex. */
export async function sha256(text) {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    encoder.encode(String(text))
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * How a salted password is stored.
 *
 * The salt goes in front and is stored in the clear beside the hash. Beginners
 * assume a salt is a second secret. It is not. It is a per-user value whose
 * only job is to make two identical passwords produce two different hashes, so
 * one precomputed table cannot crack the whole database at once.
 */
export async function storedHash(password, salt = "") {
  return sha256(`${salt}${password}`);
}

/** Short form for display. A full digest is unreadable in a table. */
export function shortHash(hex, size = 12) {
  const text = String(hex || "");
  return text.length <= size ? text : `${text.slice(0, size)}…`;
}

/** How many bits of two digests differ. Demonstrates the avalanche effect. */
export function bitsDiffering(a, b) {
  const len = Math.min(a.length, b.length);
  let bits = 0;
  for (let i = 0; i < len; i += 2) {
    const x = parseInt(a.slice(i, i + 2), 16) ^ parseInt(b.slice(i, i + 2), 16);
    for (let n = x; n; n >>= 1) bits += n & 1;
  }
  return bits;
}

/**
 * The rainbow-table demonstration, done honestly: precompute the hash of every
 * word in a small list and look the target up. That is all a rainbow table is,
 * and seeing it work on a six-word list teaches more than a diagram of one
 * with six billion entries.
 */
export async function buildTable(words = [], salt = "") {
  const table = new Map();
  for (const word of words) {
    table.set(await storedHash(word, salt), word);
  }
  return table;
}

export async function crack(hash, words = [], salt = "") {
  const table = await buildTable(words, salt);
  return table.get(String(hash).toLowerCase().trim()) || null;
}

/* ── Grading ─────────────────────────────────────────────────────────────
 * Each mode marks a different misconception, and each is written so that the
 * obvious wrong answer is the one a beginner actually gives.
 */

/**
 * SALT mode: two users with the same password must end up with different
 * stored hashes. The wrong answer people give is one shared salt for the whole
 * database, so that is checked for by name.
 */
export async function scoreSalt(users = [], salts = {}) {
  const missing = users.filter((u) => !String(salts[u.id] || "").trim());
  if (missing.length) {
    return { ok: false, message: "Every account needs a salt. Give each one a value before you check." };
  }

  const values = users.map((u) => String(salts[u.id]).trim());
  if (new Set(values).size === 1 && users.length > 1) {
    return {
      ok: false,
      message:
        "You gave every account the same salt. That does stop a plain rainbow table, but two people with the same password still end up with the same stored hash, so a single crack still tells an attacker who else to try it on. The salt has to be per account.",
    };
  }
  if (new Set(values).size !== values.length) {
    return { ok: false, message: "Two accounts are sharing a salt. Any pair that shares one still gives itself away." };
  }

  const hashes = [];
  for (const user of users) hashes.push(await storedHash(user.password, String(salts[user.id]).trim()));

  if (new Set(hashes).size !== hashes.length) {
    return { ok: false, message: "Two stored hashes are still identical. Check that each salt is genuinely different." };
  }

  return {
    ok: true,
    hashes,
    message:
      "Every stored hash is now different, even though two of these people chose the same password. Nothing about the passwords changed. The salt did all of it.",
  };
}

/**
 * CRACK mode: find which candidate password produced a stored hash. Proves,
 * by doing it, that an unsalted hash of a common password is not a secret.
 */
export async function scoreCrack(target, words = [], answer = "", salt = "") {
  const guess = String(answer || "").trim();
  if (!guess) return { ok: false, message: "Pick the password you think produced that hash." };

  // A guess from outside the wordlist is the one case worth naming, because
  // it is the point of the exercise: cracking works by exhausting a list, and
  // a password that is not on any list is not cracked this way at all.
  if (words.length && !words.includes(guess)) {
    return {
      ok: false,
      message: `"${guess}" is not in the attacker's wordlist. That is exactly why an unguessable password survives this attack: cracking works by exhausting a list, and a password that is not on one is never reached.`,
    };
  }

  const produced = await storedHash(guess, salt);
  if (produced === String(target).toLowerCase().trim()) {
    return { ok: true, message: `Hashing "${guess}" gives exactly that digest. The hash was never a secret, because the password was guessable.` };
  }
  return {
    ok: false,
    message: `Hashing "${guess}" gives ${shortHash(produced)}, which is not the stored value. Try the next candidate. This is exactly what cracking software does, only faster.`,
  };
}

/**
 * MATCH mode: decide whether two artifacts came from the same input. Tests
 * the property people most often get backwards, that a hash is deterministic
 * but not reversible.
 */
export async function scoreIntegrity(original, received, answer) {
  const a = await sha256(original);
  const b = await sha256(received);
  const same = a === b;
  const said = answer === "same";

  if (said === same) {
    return {
      ok: true,
      a,
      b,
      message: same
        ? "Identical digests, so the file arrived byte for byte as it left. That is the entire integrity check."
        : "The digests differ, so something changed in transit. Notice how little had to change to make them look nothing alike.",
    };
  }

  return {
    ok: false,
    a,
    b,
    message: same
      ? "Look again. Every character of the two digests matches, which can only happen if the input was identical."
      : "Look again. The digests are different, and a hash is deterministic: the same input always gives the same output. So the inputs were not the same.",
  };
}
