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
ok("presence failing does not stop a message being sent",
  /announcePresence\(user, \{ student: me, lessonTitle \}\);\s*\} catch/.test(
    paneSource
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

console.log(
  `\n${failures ? "✗" : "✓"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
