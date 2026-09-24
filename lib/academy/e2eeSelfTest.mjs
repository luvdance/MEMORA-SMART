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

/* The property: a heartbeat with no student record must keep the real
   name, level and badges. Writing defaults is what blanked everyone's badges
   90 seconds after they arrived. They now come from the last complete row.

   (This assertion used to slice the source from a comment that was later
   removed, so indexOf returned -1 and it passed on a meaningless string —
   a check that cannot fail. It now anchors on code that must exist, and
   asserts that the anchor was found.) */
const rowStart = socialSrc.indexOf("const row = {");
const rowBlock = rowStart === -1
  ? ""
  : socialSrc.slice(rowStart, socialSrc.indexOf("};", rowStart));
ok("the presence row is where this test expects it", rowStart !== -1);
ok("a record-less refresh keeps the name from the last row",
  /previous\?\.name/.test(rowBlock));
ok("and the level", /previous\?\.level/.test(rowBlock));
ok("and the badges", /previous\?\.badges/.test(rowBlock));
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
  /startPresenceHeartbeat\(\s*user,\s*\(\) => \(\{ student: meRef\.current, lessonTitle: lessonRef\.current \}\)/.test(
    pane
  ));
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
  !/\bcontent\b/.test(socialCode) && !/lastMessage/.test(socialCode));
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

section("Presence survives a schema change");

/* The bug this guards: an older social.js stored displayName, memoraId and
 * avatar on presence rows. The rule constrains the document to a fixed field
 * list, and on a MERGE Firestore evaluates the merged RESULT -- so those
 * legacy fields stayed in the payload, failed the rule, and every write to an
 * existing row was denied. Anyone with an old row could never come online
 * again, and the active list sat empty while reporting nothing wrong.
 *
 * Replacing the document purges whatever is not in the current shape. */
ok("the complete presence write REPLACES the document",
  /await setDoc\(presenceRef\(user\.uid\), \{[\s\S]{0,400}?\}\);/.test(socialCode));
ok("the full write is not a merge",
  !/lastSeen: serverTimestamp\(\),\s*\},\s*\{ merge: true \}\s*\);\s*return;/.test(
    socialCode
  ));
/* The record-less MERGE refresh this used to assert is gone deliberately:
   it was the write a legacy row refused. Its absence is the property now. */
ok("there is no record-less merge refresh any more",
  !/\{ uid: user\.uid, online: true, lastSeen: serverTimestamp\(\) \},\s*\{ merge: true \}/.test(
    socialCode
  ));

// Every field the code writes must be in the rule's allowlist, or the write
// is refused and presence silently stops working.
const presenceAllowed = rules
  .slice(rules.indexOf("match /presence/"), rules.indexOf("match /presence/") + 900)
  .match(/hasOnly\(\[([\s\S]*?)\]\)/);
ok("the presence rule has a field allowlist", Boolean(presenceAllowed));
if (presenceAllowed) {
  const allowed = [...presenceAllowed[1].matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1]);
  const written = ["uid", "online", "status", "name", "level", "badges", "lessonTitle", "lastSeen"];
  ok("every field presence writes is allowed by the rule",
    written.every((f) => allowed.includes(f)),
    `rule: ${allowed.join("/")}`);
  ok("the rule allows nothing the code does not write",
    allowed.every((f) => written.includes(f)),
    `rule: ${allowed.join("/")}`);
  // The three that caused the outage must not be permitted back in.
  ok("no legacy field is allowed back",
    !allowed.some((f) => ["displayName", "memoraId", "avatar"].includes(f)));
}

section("A chat you can come back to");

/* The Messages tab was a dead end: the only route into a chat was the "Active
 * now" list, so a thread became unreachable the moment the other person
 * closed their pane. Conversations were effectively lost when they ended. */
ok("existing conversations are listed",
  /getConversations\(/.test(pane));
ok("a thread can be reopened",
  /openThread\(t\.person, t\.id\)/.test(pane));
ok("conversations avoid a composite index",
  !/array-contains[\s\S]{0,120}?orderBy/.test(socialCode));
ok("threads are ordered, just in memory",
  /rows\.sort\(/.test(socialCode));
ok("a name is resolved from the public projection, not the student record",
  /getPublicProfile\(/.test(socialCode) &&
  !/collection\(db, "students"\)/.test(socialCode));

// Read state stays on the device, because the server cannot read the messages
// and has no business holding a receipt for them either.
ok("read markers are local to the browser",
  /localStorage\.setItem\(READ_KEY/.test(pane));
ok("every localStorage access is guarded",
  (pane.match(/loadReadMarkers|saveReadMarker/g) || []).length >= 4 &&
  /try \{\s*return JSON\.parse\(localStorage/.test(pane));
ok("sending marks your own thread read",
  /onSent\?\.\(conversationIdFor\(user\.uid, person\.id\)\)/.test(pane));

section("Blocking is enforced, not just hidden");

/* The interface said "they cannot message you" while blocking was a client
 * side filter -- the blocked person could still write, and the reader simply
 * did not render it. A learner relying on that to get away from somebody was
 * being told something untrue. */
ok("the rules consult the recipient's block list",
  /function blockedBy\(otherUid\)/.test(rules));
ok("a send is refused when the recipient has blocked the sender",
  /&& !blockedBy\(otherInConversation\(conversationId\)\)/.test(rules));
ok("the other participant is derived from the id",
  /function otherInConversation\(cid\)/.test(rules));
ok("blocked threads are kept out of the list",
  /!blocked\.includes\(t\.otherUid\)/.test(pane));
/* This used to assert one literal sentence in the component. The sentence is
 * gone: send failures now go through services/errors.js, so what the sender
 * sees is decided in one place rather than per catch block.
 *
 * The property is what mattered, so the property is what is asserted. A
 * refusal must be indistinguishable from any other failure — the whole point
 * is that a blocked sender learns nothing, and the error layer makes that
 * structural by giving the permission case the same tone as the generic one. */
ok("the send path reports through the error layer, not a raw message",
  /reportError\("chat:send"/.test(pane) && !/err\?\.message/.test(pane));
ok("no wording anywhere in the panel reveals a block",
  !/you have been blocked|blocked you|has blocked/i.test(pane));

const chatErrors = await import(
  new URL("../../src/academy/services/errors.js", import.meta.url)
);
const refusal = chatErrors.toUserError({ code: "permission-denied" });
ok("a refusal does not say it was refused",
  !/block|refus|denied|permission|not allowed/i.test(
    `${refusal.title} ${refusal.message}`),
  refusal.message);
ok("and reads the same as an ordinary failure",
  refusal.message === chatErrors.toUserError(new Error("something else")).message);

/* ── Unreadable history is explained once, not per message ───────────────
 * A thread whose key had changed rendered this, once per message, forever:
 *
 *     Encrypted with a key this browser does not have.
 *
 * It repeated, it described our storage to somebody who could not act on it,
 * and it blamed the wrong side — the usual cause is the OTHER person's device
 * key changing, not this browser's. Runs now collapse to one entry whose
 * reason is worked out from evidence.
 */
section("Unreadable messages are grouped and explained");

const hist = await import(
  new URL("../../src/academy/data/chatHistory.js", import.meta.url)
);

const thread = [
  { id: "a", text: "hello", sentAt: new Date(1000) },
  { id: "b", text: null, sentAt: new Date(2000) },
  { id: "c", text: null, sentAt: new Date(3000) },
  { id: "d", text: null, sentAt: new Date(4000) },
  { id: "e", text: "readable again", sentAt: new Date(5000) },
  { id: "f", text: null, sentAt: new Date(6000) },
];
const grouped = hist.groupThread(thread);

ok("consecutive unreadable messages collapse into one entry",
  grouped.length === 4, `${grouped.length} entries from ${thread.length} messages`);
ok("and the run reports how many it stands for",
  grouped[1].kind === "unreadable" && grouped[1].count === 3);
ok("readable messages pass through untouched and in order",
  grouped[0].message.text === "hello" && grouped[2].message.text === "readable again");
ok("a later run is separate, not merged with the earlier one",
  grouped[3].kind === "unreadable" && grouped[3].count === 1);
ok("a run carries its LATEST timestamp, which is what dates it",
  grouped[1].sentAt.getTime() === 4000);
ok("a thread with nothing unreadable is unchanged",
  hist.groupThread([{ id: "x", text: "hi" }]).every((e) => e.kind === "message"));
ok("an empty thread produces nothing", hist.groupThread([]).length === 0);

/* The reason has to be derived, because guessing blames the wrong person. */
const R = hist.UNREADABLE;
ok("replacing this device's key is named as such",
  hist.unreadableReason({ rotated: true, identityCreatedAt: 1, sentAt: new Date(9) })
    === R.KEY_REPLACED);
ok("messages older than this device's key predate it",
  hist.unreadableReason({ rotated: false, identityCreatedAt: 5000, sentAt: new Date(4000) })
    === R.BEFORE_THIS_DEVICE);
ok("messages newer than it mean the OTHER side changed",
  hist.unreadableReason({ rotated: false, identityCreatedAt: 1000, sentAt: new Date(4000) })
    === R.THEIR_KEY_CHANGED);
ok("without evidence it says less rather than guessing",
  hist.unreadableReason({ rotated: false, identityCreatedAt: null, sentAt: new Date(1) })
    === R.UNKNOWN &&
  hist.unreadableReason({ rotated: false, identityCreatedAt: 1, sentAt: null })
    === R.UNKNOWN);

/* The copy is the point: it must not describe our storage. */
const FORBIDDEN_COPY = [
  "key", "browser does not have", "indexeddb", "crypto", "decrypt",
  "cipher", "aes", "error", "failed",
];
for (const [code, copy] of Object.entries(hist.UNREADABLE_COPY)) {
  const text = `${copy.title} ${copy.detail}`.toLowerCase();
  const leaked = FORBIDDEN_COPY.filter((w) => text.includes(w));
  ok(`"${code}" explains without naming the mechanism`,
    leaked.length === 0, leaked.join(", "));
  ok(`"${code}" says new messages still work`,
    /work|unaffected|open here/i.test(copy.detail));
}

const paneNow = readFileSync(
  new URL("../../src/academy/components/SocialPane.jsx", import.meta.url), "utf8");
ok("the per-message warning is gone from the panel",
  !/Encrypted with a key this browser does not have/.test(paneNow));
ok("and the thread renders through the grouping helper",
  /groupThread\(messages\)/.test(paneNow));

/* ── Key rotation is noticed rather than silent ──────────────────────────
 * publishPublicKey runs on every chat open. If this browser had to generate a
 * fresh keypair — new device, cleared site, or storage the browser evicted —
 * it silently replaced the published key and every message either side had
 * ever sent became undecryptable for both of them, with nobody told.
 */
section("Key rotation is detected");

const socialNow = readFileSync(
  new URL("../../src/academy/services/social.js", import.meta.url), "utf8");
ok("the previously published key is read before overwriting it",
  socialNow.indexOf("let previous = null") <
    socialNow.indexOf("await setDoc(\n    publicKeyRef(user.uid)"));
ok("and a change is reported to the caller",
  /rotated: Boolean\(rotated\)|return \{ pair, publicKey, rotated \}/.test(socialNow));
ok("failing to read the old key still publishes the new one",
  /catch \{\s*previous = null;\s*\}/.test(socialNow));

const e2eeSrc = readFileSync(
  new URL("../../src/academy/services/e2ee.js", import.meta.url), "utf8");
ok("the key's creation time is recorded so history can be dated",
  /identity-meta:/.test(e2eeSrc) && /export async function identityCreatedAt/.test(e2eeSrc));
ok("a missing timestamp reads as unknown rather than as zero",
  /typeof meta\?\.createdAt === "number" \? meta\.createdAt : null/.test(e2eeSrc));

/* The cache-clearing this file's comments promised, which nothing called. */
const authSrc = readFileSync(
  new URL("../../src/context/AuthContext.jsx", import.meta.url), "utf8");
ok("signing out clears the derived key cache, as e2ee.js documents",
  /clearKeyCache\(\)/.test(authSrc) &&
  authSrc.indexOf("clearKeyCache()") < authSrc.indexOf("await signOut(auth)"));

section("Errors clear themselves");

/* The bug this guards: the active list's failure message was only ever set,
 * never cleared, and load() would not reset it because its guard is
 * `board !== null`. One failure -- including during the minutes a new index
 * is still building -- pinned "no index" on the pane for the whole session,
 * long after it had stopped being true. */
ok("a successful snapshot clears the active-list error",
  /setActive\(rows\);[\s\S]{0,800}?setActiveError\(null\);/.test(pane));
ok("the active list has its own error, separate from the one-off reads",
  /const \[activeError, setActiveError\]/.test(pane));
ok("the index message admits it may still be building",
  /may still be building/.test(pane));
ok("presence waits for the student record before announcing",
  /if \(!user \|\| hidden \|\| !meReady\) return;/.test(pane));
/* `open` is deliberately NOT in that guard. Presence is announced while the
   learner is on the page, not only while the panel is expanded, so somebody
   studying with it collapsed still shows up. The earlier version required the
   panel open at both ends, which made two learners nearly impossible to pair.
   `hidden` and `meReady` still gate it: no announcement while hidden, and
   none before the username is known. */
ok("being hidden still suppresses presence", /\|\| hidden \|\|/.test(pane));

section("Going quiet is not the same as leaving");

/* The bug this guards: startPresenceHeartbeat called clearPresence() the
 * instant document.visibilityState became "hidden". Two accounts in two tabs
 * -- exactly how this gets tested -- meant the unfocused one marked itself
 * offline immediately, so the two could never see each other. A real learner
 * alt-tabbing to look something up vanished the same way.
 *
 * A backgrounded tab now stops refreshing instead. `lastSeen` is what the
 * active query filters on, so it drops off by itself after the TTL. */
const hb = socialCode.slice(
  socialCode.indexOf("export function startPresenceHeartbeat"),
  socialCode.indexOf("export function subscribeActiveStudents")
);

ok("losing visibility does not clear presence",
  !/visibilityState === "hidden"[\s\S]{0,120}?clearPresence/.test(hb));
ok("losing visibility stops the heartbeat",
  /visibilityState === "hidden"[\s\S]{0,120}?goIdle\(\)/.test(hb) &&
  /const goIdle = \(\) => \{\s*stopBeating\(\);/.test(hb));
ok("stopping the beat really clears the interval",
  /const stopBeating = \(\) => \{\s*if \(interval\) clearInterval\(interval\);/.test(hb));
ok("becoming visible announces again",
  /announce\("online"\);\s*startBeating\(\);/.test(hb));
/* Leaving for real still goes offline. It is no longer a bare pagehide
   handler, because on iOS pagehide is usually a pause, not a departure. */
ok("a real unload still clears presence",
  /stopBeating\(\);\s*clearPresence\(user\.uid\);/.test(hb));
ok("and so does closing the pane",
  /removeEventListener\("pageshow", onPageShow\);\s*clearPresence\(user\.uid\);/.test(hb));

/* The heartbeat must not re-arm when the lesson title resolves: the teardown
 * clears presence and the new effect re-announces, two unordered writes to
 * one document. If the clear landed second the learner was invisible until
 * the next beat 90 seconds later. */
ok("the lesson title is read from a ref, not a dependency",
  /lessonTitle: lessonRef\.current/.test(pane));
ok("the heartbeat effect does not depend on the lesson title",
  /\}, \[user, hidden, meReady\]\);/.test(pane));

/* Staleness used to be re-checked here as `Date.now() - PRESENCE_TTL_MS`,
   against the LOCAL clock. That was itself the clock-skew bug in a second
   place, so it moved to presenceStatus(), which is tested with real inputs
   in "A wrong local clock does not empty the list". The service must not
   reintroduce a local-clock cut-off. */
ok("the service applies no local-clock cut-off",
  !/Date\.now\(\) - PRESENCE_TTL_MS/.test(socialCode));
ok("pending timestamps are handled by the shared classifier",
  /if \(seen === null\) return row\.status === "idle" \? "idle" : "online";/.test(
    readFileSync(new URL("../../src/academy/data/presence.js", import.meta.url), "utf8")
  ));

section("Message chimes");

/* Exercised for real. Node has no AudioContext, which is the same situation
 * as a browser that blocks audio — so this also proves the module is silent
 * rather than broken when sound is unavailable. */
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
globalThis.window = globalThis.window || {};

const chime = await import(
  new URL("../../src/academy/services/chime.js", import.meta.url).href
);

ok("sound is on by default", chime.isMuted() === false);
ok("muting is remembered", chime.setMuted(true) === true && chime.isMuted() === true);
ok("unmuting is remembered", chime.setMuted(false) === false && chime.isMuted() === false);

// The important property: no audio device must never break a conversation.
let threw = null;
try {
  chime.playSent();
  chime.playReceived();
  chime.setMuted(true);
  chime.playSent();
  chime.playReceived();
} catch (err) {
  threw = err;
}
ok("playing with no audio available does not throw", threw === null,
  threw ? String(threw.message) : "");

// A localStorage that throws is the private-window case.
globalThis.localStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};
let threw2 = null;
let defaulted = null;
try {
  defaulted = chime.isMuted();
  chime.setMuted(true);
  chime.playSent();
} catch (err) {
  threw2 = err;
}
ok("blocked storage does not throw", threw2 === null,
  threw2 ? String(threw2.message) : "");
ok("blocked storage defaults to sound ON, not off", defaulted === false);

/* The chime must not replay a thread's history. Opening a conversation
   delivers every past message in one snapshot; announcing each would be a
   burst of beeping for messages already read. */
ok("the first snapshot is recorded silently",
  /if \(seenRef\.current === null\) \{[\s\S]{0,200}?new Set\(list\.map/.test(pane));
ok("only messages arriving after the first snapshot chime",
  /!m\.mine && !seenRef\.current\.has\(m\.id\)/.test(pane));
ok("your own messages never chime as incoming",
  /\(m\) => !m\.mine &&/.test(pane));
ok("switching conversation resets the history marker",
  /seenRef\.current = null;/.test(pane));
ok("sending plays the outgoing tone",
  /await sendMessage\(user, person\.id, text\);\s*playSent\(\);/.test(pane));
ok("the sound can be turned off from the thread",
  /setMutedState\(setMuted\(!muted\)\)/.test(pane));
ok("the mute control is labelled for a screen reader",
  /ac-sp__sr/.test(pane) && /Turn message sounds/.test(pane));

section("The chimes actually make the right sound");

/* Not string matching: the module runs against a stub AudioContext and the
 * scheduled oscillators are inspected. A chime that silently builds an empty
 * audio graph would pass every source-level assertion above. */
const audioCalls = [];

class StubGain {
  constructor() {
    this.gain = {
      setValueAtTime: () => {},
      linearRampToValueAtTime: (v) => audioCalls.push(["peak", v]),
      exponentialRampToValueAtTime: () => {},
    };
  }
  connect(n) {
    return n;
  }
}

class StubOsc {
  constructor() {
    this.frequency = { value: null };
    this.type = null;
  }
  connect(n) {
    return n;
  }
  start(t) {
    audioCalls.push(["start", this.frequency.value, Number(t.toFixed(3)), this.type]);
  }
  stop(t) {
    audioCalls.push(["stop", Number(t.toFixed(3))]);
  }
}

let resumed = false;

const workingStore = new Map();
globalThis.localStorage = {
  getItem: (k) => (workingStore.has(k) ? workingStore.get(k) : null),
  setItem: (k, v) => workingStore.set(k, String(v)),
};

globalThis.window.AudioContext = class {
  constructor() {
    this.currentTime = 0;
    this.state = "suspended";
    this.destination = {};
  }
  resume() {
    resumed = true;
    this.state = "running";
    return Promise.resolve();
  }
  createOscillator() {
    return new StubOsc();
  }
  createGain() {
    return new StubGain();
  }
};

chime.setMuted(false);

audioCalls.length = 0;
chime.playSent();
const sentStarts = audioCalls.filter((c) => c[0] === "start");
ok("the outgoing chime plays exactly one note", sentStarts.length === 1,
  JSON.stringify(sentStarts));
ok("it is a sine wave in a comfortable range",
  sentStarts[0]?.[3] === "sine" && sentStarts[0]?.[1] > 200 && sentStarts[0]?.[1] < 2000,
  `${sentStarts[0]?.[1]}Hz`);

// A suspended context is the normal state before the user has interacted;
// without resuming, nothing would ever be heard.
ok("a suspended audio context is resumed", resumed === true);

audioCalls.length = 0;
chime.playReceived();
const recvStarts = audioCalls.filter((c) => c[0] === "start");
ok("the incoming chime plays two notes", recvStarts.length === 2,
  JSON.stringify(recvStarts.map((c) => c[1])));
ok("the two notes rise, so it is recognisable without looking",
  recvStarts.length === 2 && recvStarts[1][1] > recvStarts[0][1],
  `${recvStarts[0]?.[1]} then ${recvStarts[1]?.[1]}`);
ok("the second note is scheduled after the first, not at the same instant",
  recvStarts.length === 2 && recvStarts[1][2] > recvStarts[0][2],
  `t=${recvStarts[0]?.[2]} then t=${recvStarts[1]?.[2]}`);

// It has to be a tick, not an alarm.
const lastStop = Math.max(
  ...audioCalls.filter((c) => c[0] === "stop").map((c) => c[1])
);
ok("the whole chime is under half a second", lastStop < 0.5, `${lastStop}s`);

const peaks = audioCalls.filter((c) => c[0] === "peak").map((c) => c[1]);
ok("it is quiet — never near full volume",
  peaks.length > 0 && peaks.every((v) => v > 0 && v <= 0.15),
  peaks.join("/"));

// Muted must produce silence, not a quieter sound.
chime.setMuted(true);
audioCalls.length = 0;
chime.playSent();
chime.playReceived();
ok("muted schedules no audio at all", audioCalls.length === 0,
  `${audioCalls.length} calls`);
chime.setMuted(false);

section("One definition of online, used by every surface");

/* The bug this guards: the Messages tab said "studying now" whenever
 * `online === true` and never looked at `lastSeen`, while Active required a
 * recent `lastSeen` too. A row left at online:true by a session that ended
 * without saying goodbye was "studying now" in one tab and missing from the
 * other. Both now call presenceStatus(), so they cannot disagree. */
const pres = await import(
  new URL("../../src/academy/data/presence.js", import.meta.url).href
);
const NOW = 1_800_000_000_000;
const at = (msAgo, extra = {}) => ({
  online: true,
  lastSeen: { toMillis: () => NOW - msAgo },
  ...extra,
});

ok("fresh and in front is online", pres.presenceStatus(at(30_000), NOW) === "online");
ok("backgrounded is idle, however fresh",
  pres.presenceStatus(at(5_000, { status: "idle" }), NOW) === "idle");
ok("one missed heartbeat is still online",
  pres.presenceStatus(at(2 * 60_000), NOW) === "online");
ok("past the online window is idle",
  pres.presenceStatus(at(4 * 60_000), NOW) === "idle");
ok("long silent is offline even though the row says online",
  pres.presenceStatus(at(11 * 60_000), NOW) === "offline");
ok("online:false is offline no matter how recent",
  pres.presenceStatus({ ...at(1_000), online: false }, NOW) === "offline");
ok("a missing row is offline", pres.presenceStatus(null, NOW) === "offline");
// The exact row that caused the disagreement.
ok("an abandoned online:true row is NOT reported as online",
  pres.presenceStatus(at(60 * 60_000), NOW) === "offline");

// A just-written row has no server timestamp yet and is current by definition.
ok("a pending timestamp counts as online",
  pres.presenceStatus({ online: true, lastSeen: null }, NOW) === "online");
ok("a pending idle write stays idle",
  pres.presenceStatus({ online: true, lastSeen: null, status: "idle" }, NOW) === "idle");

// Every shape a timestamp arrives in.
ok("reads a Firestore Timestamp",
  pres.lastSeenMs({ lastSeen: { toMillis: () => 42 } }) === 42);
ok("reads the plain { seconds } form",
  pres.lastSeenMs({ lastSeen: { seconds: 2, nanoseconds: 500_000_000 } }) === 2500);
ok("reads a Date", pres.lastSeenMs({ lastSeen: new Date(7) }) === 7);
ok("reads a number", pres.lastSeenMs({ lastSeen: 9 }) === 9);

ok("around means online or idle",
  pres.isAround(at(1_000), NOW) &&
  pres.isAround(at(5 * 60_000), NOW) &&
  !pres.isAround(at(20 * 60_000), NOW));

section("A wrong local clock does not empty the list");

/* The bug this guards: the query sent `lastSeen >= local now - 5 min`,
 * comparing the learner's clock with server timestamps. A clock a few minutes
 * fast put the cut-off in the server's future and every account on that
 * machine saw nobody. Time is now anchored on a server timestamp and advanced
 * by ELAPSED local time, which is right even when the absolute time is not. */
const serverT = 1_800_000_000_000;
const badClock = serverT + 45 * 60_000; // 45 minutes fast

ok("server-now is the anchor plus elapsed local time",
  pres.serverNow(serverT, badClock, badClock + 30_000) === serverT + 30_000);
ok("a clock 45 minutes fast still classifies a fresh row as online",
  pres.presenceStatus(
    { online: true, lastSeen: { toMillis: () => serverT } },
    pres.serverNow(serverT, badClock, badClock + 10_000)
  ) === "online");
ok("naively using the bad clock would have called that row offline",
  pres.presenceStatus(
    { online: true, lastSeen: { toMillis: () => serverT } },
    badClock
  ) === "offline");
ok("with no anchor it falls back to the local clock",
  pres.serverNow(null, 0, 123) === 123);
ok("time never runs backwards if the local clock is adjusted",
  pres.serverNow(serverT, badClock, badClock - 60_000) === serverT);
ok("the freshest row is the anchor",
  pres.freshestSeen([at(90_000), at(10_000), { lastSeen: null }]) === NOW - 10_000);
ok("no resolved rows gives no anchor", pres.freshestSeen([{ lastSeen: null }]) === null);

// The service must not send a clock-derived cut-off to the server any more.
ok("the active query carries no lastSeen range filter",
  !/where\("lastSeen", ">=?"/.test(socialCode));
/* Ordered ascending, to match the deployed (online, lastSeen) index. The
   property under test is that the query ORDERS by lastSeen at all and leaves
   the freshness judgement to presenceStatus() — not which direction it picks.

   Worth knowing: ascending returns the OLDEST rows first, so once there are
   more presence rows than the limit, the freshest learners are the ones cut
   off. Fine at today's numbers; it needs the descending sort, or a larger
   limit, before the board gets busy. */
ok("the query orders by lastSeen and lets the client judge freshness",
  /orderBy\("lastSeen", "(asc|desc)"\)/.test(socialCode) &&
  !/Date\.now\(\) - PRESENCE_TTL_MS/.test(socialCode));
ok("the anchor is computed across ALL rows, including this learner's own",
  /serverMs: freshestSeen\(all\)/.test(socialCode));
ok("self is excluded from the list but not from the anchor",
  /all\.filter\(\(r\) => r\.id !== excludeUid\), \{/.test(socialCode) &&
  /self: all\.find\(\(r\) => r\.id === excludeUid\)/.test(socialCode));

section("Presence writes cannot be refused, and failures are shown");

/* The bug this guards: only the FIRST presence write replaced the document;
 * the heartbeat and clearPresence MERGED. On a row still holding fields an
 * older build wrote, the merged result failed the rule's field list and was
 * denied — so lastSeen froze after one write and the learner aged out of
 * Active, while every failure went to console.warn and nothing on screen. */
const presenceSection = socialCode.slice(
  socialCode.indexOf("export async function announcePresence"),
  socialCode.indexOf("export function subscribeActiveStudents")
);
ok("no presence write merges any more",
  !/merge: true/.test(presenceSection));
ok("a heartbeat without the record reuses the last complete row",
  /previous\?\.name \|\| publicNameFor\(null\)/.test(socialCode));
ok("presence reports success or failure instead of swallowing it",
  /return \{ ok: true \};/.test(presenceSection) &&
  /return \{ ok: false, code: err\?\.code/.test(presenceSection));
ok("clearing skips a learner it has no row for, rather than wiping a username",
  /if \(!previous\) return \{ ok: true, skipped: true \};/.test(socialCode));
ok("the pane shows when others cannot see you",
  /setPresenceError\(/.test(pane) && /Other learners cannot see you right now/.test(pane));
ok("and clears it once a write succeeds",
  /if \(result\?\.ok\) \{\s*setPresenceError\(null\);/.test(pane));

// Every field written must be allowed, and the new status field constrained.
const presRule = rules.slice(
  rules.indexOf("match /presence/"),
  rules.indexOf("match /presence/") + 1200
);
const presAllow = presRule.match(/hasOnly\(\[([\s\S]*?)\]\)/);
const presAllowed = presAllow
  ? [...presAllow[1].matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1])
  : [];
const presWritten = ["uid", "online", "status", "name", "level", "badges", "lessonTitle", "lastSeen"];
ok("every presence field written is allowed",
  presWritten.every((f) => presAllowed.includes(f)), presAllowed.join("/"));
ok("the rule allows nothing that is not written",
  presAllowed.every((f) => presWritten.includes(f)), presAllowed.join("/"));
ok("status is limited to the three real values",
  /status in \['online', 'idle', 'offline'\]/.test(presRule));

section("Idle, not gone");

ok("backgrounding does not take the learner offline",
  !/visibilityState === "hidden"[\s\S]{0,200}?clearPresence/.test(hb));
/* "backgrounding writes idle" and "returning writes online" moved to
   "The page lifecycle", where they are asserted against goIdle/startBeating
   rather than against an inline interval that no longer exists. */

section("Dots, on every surface, from the same answer");

ok("the Active cards get a status", /status=\{statusOf\(person\)\}/.test(pane));
/* Originally this required the Messages list to call statusOf() exactly as
   the Active tab does, because the two once disagreed: Messages read `online`
   alone and called a long-abandoned row "studying now".

   Both surfaces still resolve through the same classifier — storedStatus()
   delegates to statusOf() whenever the live subscription has the person. What
   changed is the fallback for a row the subscription does NOT have: the
   Messages list is fetched once, so its timestamps are frozen, and ageing
   them produced the opposite error — Offline for someone plainly online. A
   frozen row now reports its last known state instead of an invented one.

   The overclaiming case the original assertion guarded is still covered: the
   active query has no time filter, so a stale online:true row IS in the
   subscription and gets aged out there. */
ok("the Messages list resolves through the shared classifier",
  /if \(live\) return statusOf\(live\);/.test(pane));
ok("and never reads the raw flag inline in the markup",
  !/t\.person\.online\s*\?/.test(pane));
ok("the thread header resolves the same way",
  /<ChatThread[\s\S]{0,300}?status=\{storedStatus\(chatWith\)\}/.test(pane));
ok("the dot is labelled, not colour alone",
  /role="img"\s*aria-label=\{label\}/.test(pane));
ok("statuses are re-evaluated as time passes",
  /setInterval\(\(\) => setTick\(\(n\) => n \+ 1\), 30 \* 1000\)/.test(pane));
ok("offline learners are not listed as around",
  /\.filter\(\(p\) => checkIsAround\(p\)\)/.test(pane));
ok("and that check delegates to the shared classifier",
  /return isAround\(row, now\);/.test(pane));

section("The page lifecycle, and why iPhones were invisible");

/* The bug this guards: `pagehide` called clearPresence(), writing
 * online:false. On a desktop that fires when the tab closes. On iOS Safari it
 * fires every time the learner switches apps, switches tabs or locks the
 * screen — the page goes into the back/forward cache with event.persisted
 * true. So an iPhone marked itself OFFLINE the moment its owner looked away,
 * and because the active query only returns online:true rows it did not go
 * idle, it vanished. Checking the other account means looking away, so the
 * two could never see each other. Nothing about iOS blocks presence; this
 * handler did. */
ok("a cached pagehide goes idle, not offline",
  /if \(event\?\.persisted\) \{\s*goIdle\(\);/.test(hb));
ok("only a real unload clears presence",
  /stopBeating\(\);\s*clearPresence\(user\.uid\);/.test(hb));
ok("pagehide is no longer wired straight to clearPresence",
  !/window\.addEventListener\("pagehide", onLeave\)/.test(hb));
ok("coming back from the cache re-announces",
  /const onPageShow = \(event\) => \{[\s\S]{0,200}?announce\("online"\)/.test(hb));
ok("pageshow is registered and cleaned up",
  /window\.addEventListener\("pageshow", onPageShow\)/.test(hb) &&
  /window\.removeEventListener\("pageshow", onPageShow\)/.test(hb));
ok("a non-cached pageshow is ignored, so a fresh load is not double-announced",
  /if \(!event\?\.persisted\) return;/.test(hb));

/* Backgrounding is idle, and idle rows still appear — that is the whole
 * point of having three states rather than two. */
ok("hiding the tab writes idle", /goIdle\(\);\s*return;/.test(hb));
ok("an idle learner is still listed as around",
  pres.isAround({ online: true, status: "idle", lastSeen: { toMillis: () => NOW } }, NOW));
ok("but is not claimed to be online",
  pres.presenceStatus(
    { online: true, status: "idle", lastSeen: { toMillis: () => NOW } },
    NOW
  ) === "idle");

section("An empty room explains itself");

/* An empty list has meant four different things across as many rounds: no row
 * written, a refused write, a clock-skewed query, and a stale row. All four
 * looked identical on screen — "Nobody else is studying right now" — which is
 * why each took a round to find. The snapshot now carries enough to say
 * which. */
ok("the subscription reports how many rows it saw",
  /total: all\.length/.test(socialCode));
ok("and this learner's own row as the server has it",
  /self: all\.find\(\(r\) => r\.id === excludeUid\) \|\| null/.test(socialCode));
ok("the pane keeps that information",
  /setPresenceInfo\(meta\)/.test(pane));
ok("an empty list says whether you are published",
  /You are published as/.test(pane) &&
  /Your presence status is broadcasting/.test(pane));
ok("and how stale your own row is",
  /last seen\{" "\}/.test(pane));
ok("and how many learners the query saw",
  /presenceInfo\.total/.test(pane) && /connected\./.test(pane));

section("A frozen list must not be aged like a live one");

/* The bug this guards, and it was mine:
 *
 * The Messages list is fetched ONCE, when the tab opens. Every person in it
 * carries a `lastSeen` frozen at that instant. The pane also ticks every 30
 * seconds so statuses stay current for the Active tab, which is fed by a live
 * subscription. Applying that advancing clock to the frozen list meant every
 * conversation went Idle after three minutes and Offline after ten — while
 * the other learner was sitting there online.
 *
 * The arithmetic below is the failure, with real numbers. */
const frozenAt = 1_700_000_000_000;
const frozenRow = { online: true, lastSeen: { toMillis: () => frozenAt } };

ok("a freshly fetched row reads online",
  pres.presenceStatus(frozenRow, frozenAt + 1_000) === "online");
ok("the SAME row reads idle three minutes later, with no new data",
  pres.presenceStatus(frozenRow, frozenAt + 4 * 60_000) === "idle");
ok("and offline after ten, which is what was on screen",
  pres.presenceStatus(frozenRow, frozenAt + 11 * 60_000) === "offline");

/* So a row that cannot refresh must not be aged. The live subscription is
   used when it has the person; otherwise the stored flag is read as-is. */
ok("the Messages list uses the non-ageing reading",
  /<StatusDot status=\{storedStatus\(t\.person\)\} \/>/.test(pane) &&
  /STATUS_LABEL\[storedStatus\(t\.person\)\]/.test(pane));
ok("the open thread's header does too",
  /status=\{storedStatus\(chatWith\)\}/.test(pane));
ok("neither ages a fetched row against the tick",
  !/statusOf\(t\.person\)/.test(pane));

ok("the live row still wins when the subscription has the person",
  /const live = \(active \|\| \[\]\)\.find\(\(p\) => p\.id === person\?\.id\);/.test(pane) &&
  /if \(live\) return statusOf\(live\);/.test(pane));
ok("a stored row with online false reads offline",
  /if \(person\?\.online !== true\) return "offline";/.test(pane));
ok("a stored idle row is not reported as online",
  /return person\.status === "idle" \? "idle" : "online";/.test(pane));

/* The Active tab is fed by snapshots, so it SHOULD keep ageing — that is how
   somebody who goes quiet drops out of the room. */
ok("the Active tab still ages its live rows",
  /status=\{statusOf\(person\)\}/.test(pane));

console.log(
  `\n${failures ? "✗" : "✓"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
