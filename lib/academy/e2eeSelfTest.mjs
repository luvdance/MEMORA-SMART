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
ok("a refusal does not tell the sender they were blocked",
  /That message could not be delivered\./.test(pane) &&
  !/you have been blocked/i.test(pane));

section("Errors clear themselves");

/* The bug this guards: the active list's failure message was only ever set,
 * never cleared, and load() would not reset it because its guard is
 * `board !== null`. One failure -- including during the minutes a new index
 * is still building -- pinned "no index" on the pane for the whole session,
 * long after it had stopped being true. */
ok("a successful snapshot clears the active-list error",
  /setActive\(rows\);[\s\S]{0,400}?setActiveError\(null\);/.test(pane));
ok("the active list has its own error, separate from the one-off reads",
  /const \[activeError, setActiveError\]/.test(pane));
ok("the index message admits it may still be building",
  /may still be building/.test(pane));
ok("presence waits for the student record before announcing",
  /if \(!open \|\| !user \|\| hidden \|\| !meReady\) return;/.test(pane));

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
  /visibilityState === "hidden"[\s\S]{0,120}?clearInterval/.test(hb));
ok("becoming visible announces again",
  /announce\("online"\);\s*if \(!interval\)/.test(hb));
ok("actually leaving the page still clears presence",
  /const onLeave = \(\) => clearPresence\(user\.uid\);/.test(hb));

/* The heartbeat must not re-arm when the lesson title resolves: the teardown
 * clears presence and the new effect re-announces, two unordered writes to
 * one document. If the clear landed second the learner was invisible until
 * the next beat 90 seconds later. */
ok("the lesson title is read from a ref, not a dependency",
  /lessonTitle: lessonRef\.current/.test(pane));
ok("the heartbeat effect does not depend on the lesson title",
  /\}, \[open, user, hidden, meReady\]\);/.test(pane));

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
ok("it still orders by recency, so stale rows sink",
  /orderBy\("lastSeen", "desc"\)/.test(socialCode));
ok("the anchor includes this learner's own row",
  /const anchor = \{\s*serverMs: freshestSeen\(all\)/.test(socialCode) &&
  socialCode.indexOf("freshestSeen(all)") <
    socialCode.indexOf("all.filter((r) => r.id !== excludeUid)"));

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

ok("backgrounding writes idle",
  /visibilityState === "hidden"[\s\S]{0,200}?announce\("idle"\)/.test(hb));
ok("backgrounding does not take the learner offline",
  !/visibilityState === "hidden"[\s\S]{0,200}?clearPresence/.test(hb));
ok("returning writes online again",
  /announce\("online"\);\s*if \(!interval\)/.test(hb));

section("Dots, on every surface, from the same answer");

ok("the Active cards get a status", /status=\{statusOf\(person\)\}/.test(pane));
ok("the Messages list uses the same classifier",
  /<StatusDot status=\{statusOf\(t\.person\)\} \/>/.test(pane) &&
  !/t\.person\.online\s*\?/.test(pane));
ok("the thread header shows the live status",
  /status=\{statusOf\(\s*\/\/[\s\S]{0,200}?\(active \|\| \[\]\)\.find/.test(pane));
ok("the dot is labelled, not colour alone",
  /role="img"\s*aria-label=\{label\}/.test(pane));
ok("statuses are re-evaluated as time passes",
  /setInterval\(\(\) => setTick\(\(n\) => n \+ 1\), 30 \* 1000\)/.test(pane));
ok("offline learners are not listed as around",
  /\.filter\(\(p\) => isAround\(p, now\)\)/.test(pane));

console.log(
  `\n${failures ? "✗" : "✓"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
