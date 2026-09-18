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

console.log(
  `\n${failures ? "✗" : "✓"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
