import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  conversationIdFor,
  deriveConversationKey,
  decryptMessage,
  encryptMessage,
  exportPublicKey,
  getIdentity,
} from "./e2ee";
import { publicNameFor } from "../data/onboarding";

/**
 * PRESENCE, PUBLIC KEYS AND ENCRYPTED MESSAGING
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * TWO THINGS IN HERE ARE LOAD-BEARING. EITHER ONE BREAKS MESSAGING SILENTLY,
 * AND BOTH HAVE ALREADY DONE SO.
 *
 * 1. THE CONVERSATION DOCUMENT MUST EXIST, AND MUST CARRY `participants`,
 *    BEFORE ANY MESSAGE IS WRITTEN UNDER IT.
 *
 *    A previous version wrote the message first, then merged
 *    { lastMessage, lastMessageAt, lastSenderId } onto the parent — with no
 *    `participants` field at all. The rules resolve membership from the
 *    conversation id and that field, so every send by an ordinary learner was
 *    denied: the parent did not exist on the first send and lacked the field
 *    on every send after. The only account that worked was the admin, whose
 *    global isAdmin() rule bypasses all rules — which made a total failure
 *    look like a one-way one.
 *
 * 2. THERE IS NO PLAINTEXT PREVIEW ON THE PARENT DOCUMENT.
 *
 *    That same version stored `lastMessage: content.slice(0, 100)`. A preview
 *    of a message is the message. Storing it defeats the encryption and makes
 *    the interface's promise — "we store only the ciphertext and cannot read
 *    this" — false. Ordering by `updatedAt` gives the same thread list with
 *    nothing leaked.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PUBLIC NAMES ARE USERNAMES. Every projection here is readable by other
 * learners, so all of them publish `publicNameFor(student)` and never
 * `displayName`, which is the real name from the account provider.
 *
 * PRESENCE IS A LIVE SUBSCRIPTION, not a poll. An earlier version fetched the
 * active list once when the pane opened and never again, so two learners
 * studying at the same time never saw each other arrive.
 */

/* ── Constants ─────────────────────────────────────────────────────────── */

/** How long a presence row counts as current. */
const PRESENCE_TTL_MS = 5 * 60 * 1000;
/** Well inside the TTL, so a live row never lapses by accident. */
const HEARTBEAT_MS = 90 * 1000;
const MAX_ACTIVE = 20;

export const ACTIVE_WINDOW_MS = PRESENCE_TTL_MS;

/* ── Refs ───────────────────────────────────────────────────────────────── */

const presenceRef = (uid) => doc(db, "presence", uid);
const publicKeyRef = (uid) => doc(db, "publicKeys", uid);
const blockRef = (uid, target) => doc(db, "students", uid, "blocks", target);
const messagesRef = (conversationId) =>
  collection(db, "conversations", conversationId, "messages");

/* ═══════════════════════════════════════════════════════════════════════════
   PRESENCE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Say "I am here", or refresh it.
 *
 * Fields absent from `student` are LEFT OUT rather than written as null. This
 * is a merge, and the 90-second heartbeat does not always hold the student
 * record — writing `level: student?.level ?? 1` unconditionally overwrote the
 * real level and blanked the badges a minute and a half after a learner
 * arrived.
 */
export async function announcePresence(user, { student, lessonTitle } = {}) {
  if (!user?.uid) return;
  try {
    const row = {
      uid: user.uid,
      online: true,
      lessonTitle: lessonTitle || null,
      lastSeen: serverTimestamp(),
    };

    // Never fall back to displayName. A row with no username shows as an
    // anonymous learner, which is the correct failure.
    if (student) {
      row.name = publicNameFor(student);
      row.level = student.level ?? null;
      row.badges = (student.badges || []).slice(0, 12);
    }

    await setDoc(presenceRef(user.uid), row, { merge: true });
  } catch (err) {
    // Presence is optional; it must never break a lesson.
    console.warn("presence failed:", err?.code || err?.message);
  }
}

/** Stop appearing in the active list. */
export async function clearPresence(uid) {
  if (!uid) return;
  try {
    await setDoc(
      presenceRef(uid),
      { online: false, lastSeen: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.warn("clearPresence failed:", err?.code || err?.message);
  }
}

/**
 * Keep presence current while the pane is open, and drop it when the learner
 * leaves.
 *
 * `visibilitychange` matters on phones: a backgrounded tab is throttled and
 * `beforeunload` is unreliable on iOS, so without it someone who switched
 * apps stayed listed as studying for the full five minutes.
 *
 * `getMeta` is a function rather than a value so the heartbeat always reads
 * the CURRENT lesson and student record without the interval being torn down
 * and rebuilt every time either changes.
 *
 * Returns a stop function.
 */
export function startPresenceHeartbeat(user, getMeta) {
  if (!user?.uid) return () => {};

  const announce = () => announcePresence(user, getMeta?.() || {});
  announce();

  const interval = setInterval(announce, HEARTBEAT_MS);

  const onVisibility = () => {
    if (document.visibilityState === "hidden") clearPresence(user.uid);
    else announce();
  };
  const onLeave = () => clearPresence(user.uid);

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onLeave);

  return () => {
    clearInterval(interval);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onLeave);
    clearPresence(user.uid);
  };
}

/**
 * Who is studying right now, live.
 *
 * Needs a composite index on presence (online, lastSeen). A missing index
 * fails with `failed-precondition`, reported distinctly because the fix is a
 * one-off console action that no code change can substitute for.
 *
 * Returns an unsubscribe function.
 */
export function subscribeActiveStudents(
  callback,
  { excludeUid = null, onError } = {}
) {
  const cutoff = Timestamp.fromMillis(Date.now() - PRESENCE_TTL_MS);

  const q = query(
    collection(db, "presence"),
    where("online", "==", true),
    where("lastSeen", ">=", cutoff),
    orderBy("lastSeen", "desc"),
    limit(MAX_ACTIVE + 1)
  );

  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs
        // `id` and `name` are the shape the pane renders.
        .map((d) => {
          const data = d.data();
          return { ...data, id: d.id, name: data.name || publicNameFor(null) };
        })
        .filter((s) => s.id !== excludeUid)
        .slice(0, MAX_ACTIVE);
      callback(rows);
    },
    (err) => {
      if (err?.code === "failed-precondition") {
        console.warn(
          "presence: composite index missing.\n" +
            "Firebase Console → Firestore → Indexes → Composite:\n" +
            "  Collection: presence | online ASC | lastSeen ASC"
        );
      } else {
        console.warn("presence subscription error:", err?.code || err?.message);
      }
      onError?.(err);
      callback([]);
    }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC KEYS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Publish this browser's public key so others can encrypt to this learner.
 *
 * Throws rather than swallowing a failure. A missing key is the most
 * confusing way for chat to break — the other side is told "they have not
 * opened the chat yet", which blames the wrong person — so the caller has to
 * be able to say what actually happened.
 */
export async function publishPublicKey(user) {
  if (!user?.uid) throw new Error("Not signed in");
  const pair = await getIdentity(user.uid);
  const publicKey = await exportPublicKey(pair);

  await setDoc(
    publicKeyRef(user.uid),
    {
      uid: user.uid,
      publicKey,
      algorithm: "ECDH-P256",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { pair, publicKey };
}

export async function getPublicKey(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(publicKeyRef(uid));
    return snap.exists() ? snap.data().publicKey || null : null;
  } catch (err) {
    console.warn("getPublicKey failed:", err?.code || err?.message);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGING
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Send one encrypted message.
 *
 * The order is not incidental: the conversation document, carrying
 * `participants`, is written FIRST, because the rules refuse a message whose
 * parent does not yet name its members. See the header for the version that
 * got this wrong and why it looked like a one-way failure.
 */
export async function sendMessage(user, theirUid, text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return;
  if (!user?.uid || !theirUid) throw new Error("Not signed in");

  const conversationId = conversationIdFor(user.uid, theirUid);
  const pair = await getIdentity(user.uid);

  const theirPublicKey = await getPublicKey(theirUid);
  if (!theirPublicKey) {
    throw new Error(
      "They have not opened the chat yet, so there is no key to encrypt to."
    );
  }

  const key = await deriveConversationKey(pair, theirPublicKey, conversationId);
  const sealed = await encryptMessage(key, trimmed, {
    conversationId,
    senderUid: user.uid,
  });

  // FIRST: the parent, with participants. Nothing below is permitted without
  // it. No message preview — see the header.
  await setDoc(
    doc(db, "conversations", conversationId),
    {
      id: conversationId,
      participants: [user.uid, theirUid].sort(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await addDoc(messagesRef(conversationId), {
    conversationId,
    senderUid: user.uid,
    payload: sealed,
    sentAt: serverTimestamp(),
  });
}

/**
 * Watch a conversation, decrypting as messages arrive.
 *
 * A message that cannot be decrypted is passed through with `text: null` so
 * the thread shows a placeholder rather than dropping it — a gap the learner
 * cannot see is worse than one they can.
 *
 * Returns an unsubscribe function.
 */
export function watchConversation(user, theirUid, onMessages, onError) {
  if (!user?.uid || !theirUid) return () => {};

  const conversationId = conversationIdFor(user.uid, theirUid);
  let cancelled = false;

  const unsubscribe = onSnapshot(
    query(messagesRef(conversationId), orderBy("sentAt", "asc"), limit(200)),
    async (snap) => {
      if (cancelled) return;
      try {
        const pair = await getIdentity(user.uid);
        const theirPublicKey = await getPublicKey(theirUid);
        if (!theirPublicKey) {
          onMessages([]);
          return;
        }
        const key = await deriveConversationKey(
          pair,
          theirPublicKey,
          conversationId
        );

        const out = [];
        for (const d of snap.docs) {
          const data = d.data();
          const text = await decryptMessage(key, data.payload || {}, {
            conversationId,
            senderUid: data.senderUid,
          });
          out.push({
            id: d.id,
            senderUid: data.senderUid,
            mine: data.senderUid === user.uid,
            text,
            sentAt: data.sentAt?.toDate?.() || null,
          });
        }
        if (!cancelled) onMessages(out);
      } catch (err) {
        if (!cancelled) onError?.(err);
      }
    },
    (err) => {
      if (!cancelled) onError?.(err);
    }
  );

  return () => {
    cancelled = true;
    unsubscribe();
  };
}

/** The learner's existing conversations, most recent first. */
export async function getConversations(uid) {
  if (!uid) return [];
  try {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", uid),
      orderBy("updatedAt", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("getConversations failed:", err?.code || err?.message);
    return [];
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCKING AND REPORTING
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Blocks live under the learner's own document, which is private to them: a
 * blocked person must not be able to discover that they were blocked.
 */
export async function blockUser(uid, blockedUid) {
  if (!uid || !blockedUid || uid === blockedUid) return;
  await setDoc(blockRef(uid, blockedUid), {
    uid,
    blockedUid,
    blockedAt: serverTimestamp(),
  });
}

export async function unblockUser(uid, blockedUid) {
  if (!uid || !blockedUid) return;
  await deleteDoc(blockRef(uid, blockedUid));
}

export async function getBlockedUids(uid) {
  if (!uid) return [];
  try {
    const snap = await getDocs(collection(db, "students", uid, "blocks"));
    return snap.docs.map((d) => d.id);
  } catch {
    return [];
  }
}

/**
 * File a report.
 *
 * `excerpt` comes from the reporter's own screen. The server cannot produce
 * one, because the server cannot read the conversation — asking the reporter
 * to attach it is the only honest way to evidence a report about an encrypted
 * thread.
 */
export async function reportUser(user, { aboutUid, reason, excerpt = "" }) {
  if (!user?.uid || !aboutUid) return;
  await addDoc(collection(db, "reports"), {
    byUid: user.uid,
    aboutUid,
    reason: String(reason || "").slice(0, 200),
    excerpt: String(excerpt || "").slice(0, 500),
    createdAt: serverTimestamp(),
  });
}

export default {
  announcePresence,
  clearPresence,
  startPresenceHeartbeat,
  subscribeActiveStudents,
  publishPublicKey,
  getPublicKey,
  sendMessage,
  watchConversation,
  getConversations,
  blockUser,
  unblockUser,
  getBlockedUids,
  reportUser,
};
