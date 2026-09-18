/**
 * END-TO-END ENCRYPTION FOR STUDENT CHAT
 *
 * Real cryptography, using the browser's own WebCrypto — ECDH on P-256 to
 * agree a secret, HKDF to turn it into a key, AES-GCM to encrypt. Firestore
 * only ever receives ciphertext and an IV. The server cannot read a message,
 * and neither can anyone who later dumps the database.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THIS PROTECTS AGAINST, AND WHAT IT CANNOT
 *
 * Read this before describing the feature to students, because promising more
 * than this delivers would be worse than promising nothing.
 *
 * IT DOES protect against:
 *   · a database leak or a stolen backup — stored messages are ciphertext
 *   · anyone at Memora reading student conversations, including an admin
 *     with full Firestore access
 *   · a subpoena or demand for stored message content
 *   · a mis-written security rule exposing the messages collection
 *
 * IT CANNOT protect against:
 *   · WHOEVER SERVES THE JAVASCRIPT. This app delivers the code that does the
 *     encryption, so anyone who can change a deployment can ship a version
 *     that copies the key. Signal and WhatsApp avoid this with a reviewable,
 *     pinned native binary; a web app cannot make that promise, and claiming
 *     otherwise would be dishonest. This is the single most important caveat
 *     and it is why the UI says "encrypted in your browser" rather than
 *     implying the guarantee a messaging app makes.
 *   · METADATA. Who talks to whom, and when, is stored in the clear. Only the
 *     message bodies are encrypted.
 *   · A KEY SUBSTITUTION by the server. If a public key were swapped, the
 *     swapper could read the conversation. That is what the safety code in
 *     conversationFingerprint() is for: two students who compare codes out of
 *     band would see them differ.
 *   · LOSING THE KEY. The private key lives only in this browser, and never
 *     leaves it. Clear site data, or open the chat on another device, and old
 *     messages cannot be decrypted. There is no recovery, by design — a
 *     recoverable key is a key someone else can recover.
 *
 * AND A CONSEQUENCE WORTH NAMING: because nobody at Memora can read these
 * messages, nobody can moderate them either. A student who is harassed has no
 * server-side record to appeal to. blockUser() and the report flow in
 * social.js exist for that reason, and they work on metadata plus whatever
 * the reporter chooses to attach from their own decrypted copy.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * NO NEW DEPENDENCY. WebCrypto and IndexedDB are both platform features; a
 * crypto library here would be one more thing between a student's message and
 * the browser doing the work.
 */

const DB_NAME = "mst-academy-e2ee";
const DB_VERSION = 1;
const STORE = "keys";
const KEY_ID = "identity";

/* ── Availability ───────────────────────────────────────────────────────── */

/**
 * WebCrypto's subtle API requires a secure context — HTTPS or localhost. On
 * plain HTTP `crypto.subtle` is undefined, so the chat must disable itself
 * rather than fall back to something weaker and still call it encrypted.
 */
export function isE2eeAvailable() {
  return Boolean(
    typeof window !== "undefined" &&
      window.isSecureContext &&
      window.crypto?.subtle &&
      window.indexedDB
  );
}

/* ── Base64 helpers ─────────────────────────────────────────────────────── */

const toB64 = (buf) => {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) out += String.fromCharCode(bytes[i]);
  return btoa(out);
};

const fromB64 = (text) => {
  const raw = atob(text);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
};

/* ── Key storage ────────────────────────────────────────────────────────── */

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(key) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function idbPut(key, value) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const req = tx.objectStore(STORE).put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

/* ── Identity ───────────────────────────────────────────────────────────── */

/**
 * Get this browser's identity keypair, generating one on first use.
 *
 * The private key is created with `extractable: false`, so even the page's own
 * JavaScript cannot read its bytes — it can only ask WebCrypto to use it. That
 * is the strongest storage a browser offers, and it means a script injected
 * into the page cannot simply copy the key out and post it somewhere.
 *
 * Stored as a CryptoKey object, which IndexedDB can hold directly.
 */
export async function getIdentity() {
  if (!isE2eeAvailable()) throw new Error("Encryption is not available here");

  const existing = await idbGet(KEY_ID);
  if (existing?.privateKey && existing?.publicKey) return existing;

  const pair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    false, // NOT extractable — the private key can never be read back out
    ["deriveBits"]
  );

  await idbPut(KEY_ID, pair);
  return pair;
}

/** The public half, base64, for publishing so others can write to you. */
export async function exportPublicKey(pair) {
  const raw = await crypto.subtle.exportKey("raw", pair.publicKey);
  return toB64(raw);
}

async function importPublicKey(b64) {
  return crypto.subtle.importKey(
    "raw",
    fromB64(b64),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}

/** Does this browser already hold a key? Used to explain why history is blank. */
export async function hasIdentity() {
  if (!isE2eeAvailable()) return false;
  try {
    const existing = await idbGet(KEY_ID);
    return Boolean(existing?.privateKey);
  } catch {
    return false;
  }
}

/* ── Conversation keys ──────────────────────────────────────────────────── */

/**
 * Derived conversation keys, cached so a thread does not redo ECDH per
 * message.
 *
 * THE CACHE KEY MUST INCLUDE WHOSE PRIVATE KEY WAS USED. An earlier version
 * keyed only on the conversation and the OTHER party's public key, which the
 * self-test caught: two different people deriving against the same public key
 * collided, and the second got handed the first's key. On a shared laptop —
 * this audience's common case — a learner signing in after another could have
 * decrypted their predecessor's messages. Both halves go in the key now, and
 * clearKeyCache() is called on sign-out as a second line of defence.
 */
const keyCache = new Map();

/** Exported public keys, memoised per keypair so the cache key is cheap. */
const pubCache = new WeakMap();

async function ownPublicKey(pair) {
  if (pubCache.has(pair)) return pubCache.get(pair);
  const b64 = toB64(await crypto.subtle.exportKey("raw", pair.publicKey));
  pubCache.set(pair, b64);
  return b64;
}

/** Drop every derived key. Call on sign-out, before another account loads. */
export function clearKeyCache() {
  keyCache.clear();
}

/**
 * Derive the AES key for a conversation with one other person.
 *
 * ECDH gives both sides the same 256 bits from their own private key and the
 * other's public key. HKDF then stretches that into an AES-GCM key — raw ECDH
 * output should never be used as a key directly, because its bits are not
 * uniformly distributed.
 *
 * The salt binds the key to this conversation and this application, so the
 * same two people's shared secret cannot be replayed into another context.
 */
export async function deriveConversationKey(myPair, theirPublicKeyB64, conversationId) {
  const minePub = await ownPublicKey(myPair);
  const cacheKey = `${conversationId}|${minePub}|${theirPublicKeyB64}`;
  if (keyCache.has(cacheKey)) return keyCache.get(cacheKey);

  const theirKey = await importPublicKey(theirPublicKeyB64);

  const shared = await crypto.subtle.deriveBits(
    { name: "ECDH", public: theirKey },
    myPair.privateKey,
    256
  );

  const hkdfInput = await crypto.subtle.importKey("raw", shared, "HKDF", false, [
    "deriveKey",
  ]);

  const key = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new TextEncoder().encode(`mst-academy-chat:${conversationId}`),
      info: new TextEncoder().encode("message-encryption-v1"),
    },
    hkdfInput,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  keyCache.set(cacheKey, key);
  return key;
}

/* ── Messages ───────────────────────────────────────────────────────────── */

/**
 * Encrypt one message.
 *
 * A fresh random 12-byte IV per message, which AES-GCM requires: reusing an IV
 * with the same key is the one mistake that breaks GCM completely.
 *
 * `conversationId` and `senderUid` are passed as additional authenticated
 * data. They are not secret, but binding them means a ciphertext cannot be
 * lifted from one conversation and replayed into another, or re-attributed to
 * a different sender — decryption fails rather than producing a message that
 * appears to come from someone who never sent it.
 */
export async function encryptMessage(key, text, { conversationId, senderUid }) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aad = new TextEncoder().encode(`${conversationId}|${senderUid}`);

  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    key,
    new TextEncoder().encode(text)
  );

  return { iv: toB64(iv), ct: toB64(ct), v: 1 };
}

/**
 * Decrypt one message, returning null rather than throwing.
 *
 * A message that fails to decrypt is expected, not exceptional: it may predate
 * this browser's key, or have been tampered with. A thread must still render
 * the rest, so the caller shows a placeholder for the ones it cannot read.
 */
export async function decryptMessage(key, payload, { conversationId, senderUid }) {
  try {
    const aad = new TextEncoder().encode(`${conversationId}|${senderUid}`);
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64(payload.iv), additionalData: aad },
      key,
      fromB64(payload.ct)
    );
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}

/* ── Verification ───────────────────────────────────────────────────────── */

/**
 * A short code both sides can compare to prove nobody swapped a key.
 *
 * Derived from both public keys, sorted so each side computes the same value.
 * If two students read their codes to each other and they match, no key
 * substitution has happened. If they differ, something is intercepting — and
 * without this there would be no way for them to find out.
 */
export async function conversationFingerprint(myPublicKeyB64, theirPublicKeyB64) {
  const [a, b] = [myPublicKeyB64, theirPublicKeyB64].sort();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${a}|${b}`)
  );
  const bytes = new Uint8Array(digest).slice(0, 8);
  // Grouped digits, like a phone number: easier to read aloud than hex.
  const digits = [...bytes].map((n) => String(n % 100).padStart(2, "0")).join("");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Stable id for a pair, so both sides address the same conversation. */
export function conversationIdFor(uidA, uidB) {
  return [uidA, uidB].sort().join("__");
}

export default {
  isE2eeAvailable,
  clearKeyCache,
  getIdentity,
  hasIdentity,
  exportPublicKey,
  deriveConversationKey,
  encryptMessage,
  decryptMessage,
  conversationFingerprint,
  conversationIdFor,
};
