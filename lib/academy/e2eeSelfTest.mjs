/**
 * E2EE SELF-TEST
 *
 * Run:  npm run test:e2ee
 *
 * Exercises the real module — not a copy of it — against Node's WebCrypto,
 * which is the same implementation the browser exposes. Only getIdentity() is
 * out of reach here, because it stores CryptoKeys in IndexedDB; every
 * cryptographic operation that decides whether a message is actually private
 * is covered.
 *
 * The four properties worth failing a build over:
 *
 *   1. ROUND TRIP — two people who exchange public keys derive the SAME key
 *      and can read each other. If this breaks, chat silently stops working.
 *   2. CONFIDENTIALITY — a third party with their own keypair derives a
 *      DIFFERENT key and gets nothing. This is the whole promise.
 *   3. INTEGRITY — a tampered ciphertext fails to decrypt rather than
 *      producing altered text. AES-GCM gives this; the test proves it is
 *      actually switched on.
 *   4. BINDING — a ciphertext cannot be moved to another conversation or
 *      re-attributed to another sender. Without the AAD this would let a
 *      message be replayed as if someone else had written it.
 */

import { readFileSync } from "node:fs";

const e2ee = await import(
  new URL("../../src/academy/services/e2ee.js", import.meta.url).href
);

let failures = 0;
let checks = 0;
const ok = (name, cond, detail = "") => {
  checks += 1;
  if (!cond) failures += 1;
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const section = (t) => console.log(`\n${t}`);

/** A keypair of the same shape getIdentity() produces. */
async function makePair() {
  return crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveBits"]
  );
}

const CONV = "uidAAA__uidBBB";

section("Key agreement");

const ada = await makePair();
const musa = await makePair();
const eve = await makePair();

const adaPub = await e2ee.exportPublicKey(ada);
const musaPub = await e2ee.exportPublicKey(musa);
const evePub = await e2ee.exportPublicKey(eve);

ok("a public key exports to base64", typeof adaPub === "string" && adaPub.length > 40);
ok("two learners have different public keys", adaPub !== musaPub);

const adaKey = await e2ee.deriveConversationKey(ada, musaPub, CONV);
const musaKey = await e2ee.deriveConversationKey(musa, adaPub, CONV);
ok("both sides derive a usable AES-GCM key", Boolean(adaKey && musaKey));

section("1. Round trip");

const secret = "Can you look at my SUMIFS? It returns 0 and I cannot see why.";
const sealed = await e2ee.encryptMessage(adaKey, secret, {
  conversationId: CONV,
  senderUid: "uidAAA",
});

ok("the payload carries only iv, ciphertext and a version",
  Object.keys(sealed).sort().join(",") === "ct,iv,v",
  Object.keys(sealed).join(","));
ok("the plaintext is nowhere in the payload",
  !JSON.stringify(sealed).includes("SUMIFS"));

const read = await e2ee.decryptMessage(musaKey, sealed, {
  conversationId: CONV,
  senderUid: "uidAAA",
});
ok("the recipient reads the message", read === secret, read ? "" : "got null");

const readBack = await e2ee.decryptMessage(adaKey, sealed, {
  conversationId: CONV,
  senderUid: "uidAAA",
});
ok("the sender can read their own message back", readBack === secret);

section("2. Confidentiality — a third party gets nothing");

const eveKey = await e2ee.deriveConversationKey(eve, adaPub, CONV);
const eavesdrop = await e2ee.decryptMessage(eveKey, sealed, {
  conversationId: CONV,
  senderUid: "uidAAA",
});
ok("an outsider with their own keypair cannot decrypt", eavesdrop === null);

// And the server, which holds only public keys, has no private half at all —
// so the closest it can come is the outsider case above.
ok("an outsider's derived key differs from the participants'",
  (await (async () => {
    const probe = await e2ee.encryptMessage(eveKey, "x", {
      conversationId: CONV,
      senderUid: "uidAAA",
    });
    return (
      (await e2ee.decryptMessage(adaKey, probe, {
        conversationId: CONV,
        senderUid: "uidAAA",
      })) === null
    );
  })())
);

section("3. Integrity — tampering is detected, not absorbed");

const flipped = { ...sealed };
const bytes = atob(flipped.ct).split("");
bytes[5] = String.fromCharCode(bytes[5].charCodeAt(0) ^ 0x40);
flipped.ct = btoa(bytes.join(""));
ok("a flipped ciphertext bit fails to decrypt",
  (await e2ee.decryptMessage(musaKey, flipped, {
    conversationId: CONV,
    senderUid: "uidAAA",
  })) === null);

const wrongIv = { ...sealed, iv: btoa("wrongiv12345") };
ok("a substituted IV fails to decrypt",
  (await e2ee.decryptMessage(musaKey, wrongIv, {
    conversationId: CONV,
    senderUid: "uidAAA",
  })) === null);

section("4. Binding — a message cannot be moved or re-attributed");

ok("the same ciphertext will not decrypt in another conversation",
  (await e2ee.decryptMessage(musaKey, sealed, {
    conversationId: "someone__else",
    senderUid: "uidAAA",
  })) === null);

ok("the same ciphertext will not decrypt as a different sender",
  (await e2ee.decryptMessage(musaKey, sealed, {
    conversationId: CONV,
    senderUid: "uidBBB",
  })) === null);

section("IV reuse — the one mistake that breaks GCM");

const ivs = new Set();
for (let i = 0; i < 300; i += 1) {
  const m = await e2ee.encryptMessage(adaKey, `message ${i}`, {
    conversationId: CONV,
    senderUid: "uidAAA",
  });
  ivs.add(m.iv);
}
ok("every message gets a fresh IV", ivs.size === 300, `${ivs.size} distinct of 300`);

section("Safety code, for detecting a swapped key");

const fpAda = await e2ee.conversationFingerprint(adaPub, musaPub);
const fpMusa = await e2ee.conversationFingerprint(musaPub, adaPub);
ok("both sides compute the same code regardless of order", fpAda === fpMusa, fpAda);
ok("the code is readable aloud", /^[\d ]{8,}$/.test(fpAda), fpAda);

const fpImposter = await e2ee.conversationFingerprint(adaPub, evePub);
ok("a substituted key changes the code", fpAda !== fpImposter,
  `${fpAda} vs ${fpImposter}`);

section("Conversation ids");

ok("both sides compute the same conversation id",
  e2ee.conversationIdFor("b", "a") === e2ee.conversationIdFor("a", "b"));
ok("different pairs get different ids",
  e2ee.conversationIdFor("a", "b") !== e2ee.conversationIdFor("a", "c"));

section("Identity keys belong to an account, not a browser");

/* The bug this guards: KEY_ID was the constant "identity", so two accounts
 * on one browser shared a private key. The later learner published the
 * earlier learner's public key as their own, both derived the same
 * conversation key, and the safety code compared a key against itself and
 * always matched — so the one check designed to catch a swapped key could
 * not report it. On a shared laptop the second learner could decrypt every
 * conversation the first had.
 *
 * getIdentity() needs IndexedDB, which Node does not have, so these assert
 * the contract at the source: a uid is required, and the storage key is
 * derived from it. */
const e2eeSource = readFileSync(
  new URL("../../src/academy/services/e2ee.js", import.meta.url),
  "utf8"
);

ok("getIdentity takes the account it is for",
  /export async function getIdentity\(uid\)/.test(e2eeSource));
ok("it refuses to hand out a key with no account",
  /if \(!uid\) throw new Error/.test(e2eeSource));
ok("the storage key is derived from the uid",
  /const keyIdFor = \(uid\) => `identity:\$\{uid\}`/.test(e2eeSource));
ok("the unscoped key is no longer read",
  !/idbGet\(KEY_ID\)/.test(e2eeSource));
ok("a legacy shared key is deleted rather than inherited",
  /idbDelete\(LEGACY_KEY_ID\)/.test(e2eeSource));
ok("hasIdentity is scoped too",
  /export async function hasIdentity\(uid\)/.test(e2eeSource));

// Every caller must pass a uid, or the throw above becomes a runtime failure
// in the lesson pane rather than a mistake caught here.
const socialSource = readFileSync(
  new URL("../../src/academy/services/social.js", import.meta.url),
  "utf8"
);
const calls = socialSource.match(/getIdentity\([^)]*\)/g) || [];
ok("every getIdentity call passes a uid",
  calls.length === 3 && calls.every((c) => c === "getIdentity(user.uid)"),
  calls.join(", "));

section("The lesson pane cannot lose messaging to an unrelated failure");

/* The bug this guards: load() ran every read inside one try block over a
 * Promise.all, and published the public key LAST. A failing leaderboard read
 * therefore skipped key publication entirely — so the other side found no
 * key and was told "they have not opened the chat yet", blaming the wrong
 * person for an unrelated fault. */
const paneSource = readFileSync(
  new URL("../../src/academy/components/SocialPane.jsx", import.meta.url),
  "utf8"
);

ok("one failing read no longer aborts the others",
  /Promise\.allSettled/.test(paneSource) &&
  !/await Promise\.all\(\[/.test(paneSource));
ok("the key is published before the optional reads",
  paneSource.indexOf("publishPublicKey(user)") <
    paneSource.indexOf("Promise.allSettled"));
ok("a key failure is reported as itself",
  /setKeyError\(/.test(paneSource));
ok("a failed load can be retried without reloading the lesson",
  !/if \(!open \|\| board !== null \|\| error\) return;/.test(paneSource));
/* Presence lives in its own effect now, so a presence failure cannot reach
   the code path that publishes a key or sends a message. */
ok("presence is not in the same code path as messaging",
  !/announcePresence/.test(
    paneSource.slice(
      paneSource.indexOf("const load = useCallback"),
      paneSource.indexOf("useEffect(() => {\n    if (!open || board !== null)")
    )
  ));

section("Security rules agree with the conversation id format");

/* The bug this guards: the messages rule resolved membership with
 *   get(/conversations/$(conversationId)).data.participants
 * but that document does not exist until the FIRST message is sent. get()
 * returned null, .data errored, and the rule denied — so opening a brand new
 * thread failed with "insufficient permissions" before anyone had said
 * anything. Exactly the moment a conversation begins.
 *
 * The rule now derives membership from the id, which both clients compute
 * identically. That makes the id format load-bearing for security: change the
 * separator in conversationIdFor and every thread silently stops being
 * readable. These assertions keep the two in step. */
const rules = readFileSync(
  new URL("../../firestore.rules", import.meta.url),
  "utf8"
);

ok("the rules derive membership from the id",
  /function inConversationId\(cid\)/.test(rules));
ok("the separator in the rules matches conversationIdFor",
  /cid\.split\('__'\)/.test(rules) &&
  e2ee.conversationIdFor("a", "b").includes("__"));
ok("reading messages no longer depends on the conversation existing",
  !/get\(\/databases\/\$\(database\)\/documents\/conversations\//.test(rules));
ok("sending still requires the sender to be themselves",
  /request\.resource\.data\.senderUid == request\.auth\.uid/.test(rules));
ok("messages stay immutable once sent",
  /allow update, delete: if false;/.test(rules));

// The id must contain both uids whole, or the split-based membership check
// would admit or exclude the wrong person.
const cid = e2ee.conversationIdFor("uidAAA", "uidBBB");
ok("both uids appear as whole segments of the id",
  cid.split("__").length === 2 &&
  cid.split("__").includes("uidAAA") &&
  cid.split("__").includes("uidBBB"),
  cid);
ok("a third party is not a segment of someone else's id",
  !cid.split("__").includes("uidCCC"));

section("Presence keeps looking, and does not erase itself");

/* Two bugs, both of which made a real pair of students invisible to each
 * other while sitting in the same lesson:
 *
 *   1. getActiveLearners ran ONCE, inside load(), and load()'s guard is
 *      `board !== null` — which closing the pane does not reset. The active
 *      list was therefore frozen at the moment the pane first opened, so
 *      whoever opened theirs first never saw the other arrive.
 *
 *   2. The heartbeat called announcePresence WITHOUT the student record, and
 *      the write is a merge. `level: student?.level || null` and
 *      `badges: (student?.badges || [])` overwrote the stored values with
 *      null and [] on the first tick, 90 seconds in. */
const socialSrc = readFileSync(
  new URL("../../src/academy/services/social.js", import.meta.url),
  "utf8"
);

ok("presence omits fields it does not have instead of nulling them",
  /if \(student\) \{\s*row\.name/.test(socialSrc));
ok("level and badges are no longer written unconditionally",
  !/level: student\?\.level \|\| null,/.test(socialSrc));

const pane = readFileSync(
  new URL("../../src/academy/components/SocialPane.jsx", import.meta.url),
  "utf8"
);

/* A live subscription, not a fetch: someone appears the moment they arrive
   rather than on the next poll, and the frozen-list bug cannot come back
   because nothing caches a one-off result. */
ok("the active list is a live subscription",
  /subscribeActiveStudents\(/.test(pane));
ok("nothing fetches the active list once and keeps it",
  !/getActiveLearners\(/.test(pane));
ok("the subscription is torn down with the pane",
  /return subscribeActiveStudents\(/.test(pane));
ok("the heartbeat reads the CURRENT student record and lesson",
  /startPresenceHeartbeat\(user, \(\) => \(\{/.test(pane) &&
  /student: meRef\.current/.test(pane));
ok("a missing index is reported as itself, not as an empty room",
  /failed-precondition/.test(pane) && /failed-precondition/.test(socialSrc));

/* ── The rewrite that removed the encryption ───────────────────────────
 * A previous version of social.js sent `content` in the clear, with
 * `encrypted = false` as the default, and stored `content.slice(0, 100)` as
 * a preview on the parent document — while the interface went on telling
 * learners "we store only the ciphertext and cannot read this". */
ok("messages are encrypted before they are written",
  /encryptMessage\(key, trimmed/.test(socialSrc));
/* Tested against the CODE only. These assertions are about what the module
   writes, and the header above it documents the removed plaintext fields by
   name — matching the explanation instead of the behaviour would make this
   pass or fail for the wrong reason. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const socialCode = stripComments(socialSrc);

ok("no plaintext field is ever written to a message",
  !/content/.test(socialCode) && !/lastMessage/.test(socialCode));
ok("there is no unencrypted send path",
  !/encrypted = false/.test(socialCode));

/* The parent must carry `participants` and must be written FIRST, or the
 * rules refuse the message. */
const sendBlock = socialSrc.slice(
  socialSrc.indexOf("export async function sendMessage"),
  socialSrc.indexOf("export function watchConversation")
);
ok("the conversation names its participants",
  /participants: \[user\.uid, theirUid\]\.sort\(\)/.test(sendBlock));
ok("the parent is written before the message",
  sendBlock.indexOf("participants:") < sendBlock.indexOf("addDoc(messagesRef"));

/* Public projections must publish the username, never the real name. */
ok("presence publishes the username",
  /publicNameFor\(student\)/.test(socialSrc));
ok("social.js never reaches for displayName",
  !/displayName/.test(socialCode));

console.log(
  `\n${failures ? "✗" : "✓"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
