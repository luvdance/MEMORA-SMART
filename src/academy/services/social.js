import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  conversationIdFor,
  decryptMessage,
  deriveConversationKey,
  encryptMessage,
  exportPublicKey,
  getIdentity,
} from "./e2ee";

/**
 * SOCIAL LAYER — presence, student cards, and encrypted chat
 *
 * ── WHAT IS PUBLIC, AND WHY EACH FIELD IS ────────────────────────────────
 * Three small projections, for the same reason the leaderboard has one: the
 * student document holds an email and a Memora ID, and no feature that shows
 * one learner to another may read it.
 *
 *   leaderboard/{uid}   name, xp, level, streak      (see academyService)
 *   publicKeys/{uid}    an ECDH public key           — useless on its own
 *   presence/{uid}      name, lastSeen, lesson       — "who is around"
 *
 * `badges` are read from the leaderboard projection plus the student's own
 * record where it is their own card; another learner's badges come from a
 * badges field on the presence row, which is a list of ids — no scores, no
 * progress, nothing about how they performed.
 *
 * ── MESSAGES ─────────────────────────────────────────────────────────────
 * Only ciphertext reaches Firestore. Encryption and decryption happen in the
 * browser (see e2ee.js, and read its threat model before describing this
 * feature to anyone). The server stores who sent what to whom and when — that
 * metadata is NOT encrypted — and cannot read a single word of content.
 *
 * ── THE MODERATION CONSEQUENCE ───────────────────────────────────────────
 * Because nobody at Memora can read these messages, nobody can moderate them.
 * That is the direct cost of end-to-end encryption and it must be a deliberate
 * choice, not a surprise: on a platform with young learners, a harassment
 * report cannot be investigated from the server side. What exists instead:
 *
 *   blockUser()    stops delivery both ways, enforced by rules
 *   reportUser()   files metadata plus whatever the reporter chooses to paste
 *                  from their own decrypted copy
 *
 * If moderation matters more than secrecy for this audience, the honest change
 * is to drop E2EE for student chat and say so plainly — not to keep the label
 * and quietly add a server-side copy.
 */

/* ── Paths ──────────────────────────────────────────────────────────────── */

const presenceRef = (uid) => doc(db, "presence", uid);
const publicKeyRef = (uid) => doc(db, "publicKeys", uid);
const blockRef = (uid, blockedUid) => doc(db, "students", uid, "blocks", blockedUid);
const messagesRef = (conversationId) =>
  collection(db, "conversations", conversationId, "messages");

/** How long after a heartbeat a learner still counts as "active". */
export const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

/* ── Presence ───────────────────────────────────────────────────────────── */

/**
 * Say "I am here", optionally with what is being studied.
 *
 * A heartbeat rather than a connected/disconnected flag: a phone that loses
 * signal mid-lesson never gets to send a disconnect, so a flag would leave
 * that learner showing as online for ever. A timestamp that simply goes stale
 * is self-correcting.
 *
 * Non-fatal by design — presence is a nicety, and a learner whose write fails
 * must still be able to take the lesson.
 */
export async function announcePresence(user, { student, lessonTitle } = {}) {
  if (!user?.uid) return;
  try {
    /* The heartbeat calls this every 90s WITHOUT a student record, and this
       is a merge. Writing `level: student?.level || null` unconditionally
       therefore overwrote the real level with null and the badges with []
       on the first tick — so everyone's badges quietly disappeared from the
       active list a minute and a half after they arrived. Fields we do not
       have are left out, and merge preserves what is already stored. */
    const row = {
      uid: user.uid,
      name: student?.displayName || user.displayName || "Memora learner",
      lessonTitle: lessonTitle || null,
      lastSeen: serverTimestamp(),
    };
    if (student) {
      row.level = student.level || null;
      row.badges = (student.badges || []).slice(0, 12);
    }

    await setDoc(presenceRef(user.uid), row, { merge: true });
  } catch {
    /* presence is optional; never let it break a lesson */
  }
}

/** Stop appearing in the active list — used on sign-out and on opt-out. */
export async function clearPresence(uid) {
  if (!uid) return;
  try {
    await deleteDoc(presenceRef(uid));
  } catch {
    /* nothing to do */
  }
}

/**
 * Who is around right now.
 *
 * Filtered server-side on `lastSeen`, so a long-dormant presence row costs
 * nothing to ignore and is never downloaded.
 */
export async function getActiveLearners({ top = 20, excludeUid = null } = {}) {
  const since = Timestamp.fromMillis(Date.now() - ACTIVE_WINDOW_MS);
  const q = query(
    collection(db, "presence"),
    where("lastSeen", ">", since),
    orderBy("lastSeen", "desc"),
    limit(top + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.id !== excludeUid)
    .slice(0, top);
}

/* ── Public keys ────────────────────────────────────────────────────────── */

/**
 * Publish this browser's public key so others can start a conversation.
 *
 * Called once on entering the social pane. Overwrites any previous key, which
 * is the correct behaviour: a learner on a new device has a new key, and
 * messages from before it cannot be read — e2ee.js documents why that is a
 * property rather than a bug.
 */
export async function publishPublicKey(user) {
  const pair = await getIdentity(user.uid);
  const publicKey = await exportPublicKey(pair);
  await setDoc(
    publicKeyRef(user.uid),
    { uid: user.uid, publicKey, algorithm: "ECDH-P256", updatedAt: serverTimestamp() },
    { merge: true }
  );
  return { pair, publicKey };
}

export async function getPublicKey(uid) {
  const snap = await getDoc(publicKeyRef(uid));
  return snap.exists() ? snap.data().publicKey : null;
}

/* ── Blocking and reporting ─────────────────────────────────────────────── */

export async function blockUser(uid, blockedUid) {
  await setDoc(blockRef(uid, blockedUid), {
    uid,
    blockedUid,
    blockedAt: serverTimestamp(),
  });
}

export async function unblockUser(uid, blockedUid) {
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
 * `excerpt` is optional and comes from the reporter's own screen — the server
 * cannot produce it, because the server cannot read the conversation. Asking
 * the reporter to paste it is the only honest way to attach evidence to a
 * report about an encrypted thread.
 */
export async function reportUser(user, { aboutUid, reason, excerpt = "" }) {
  await addDoc(collection(db, "reports"), {
    byUid: user.uid,
    aboutUid,
    reason,
    // Clearly labelled as supplied by a person, not extracted by us.
    excerptPastedByReporter: excerpt.slice(0, 2000),
    createdAt: serverTimestamp(),
    status: "open",
  });
}

/* ── Chat ───────────────────────────────────────────────────────────────── */

/**
 * Send one encrypted message.
 *
 * The plaintext never leaves this function — it is encrypted before the write
 * and the write only ever carries `{iv, ct, v}`.
 */
export async function sendMessage(user, theirUid, text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return;

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

  // The participants list lets the rules check membership without reading
  // anything about the message.
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
 * Returns an unsubscribe function. `onMessages` receives plaintext that only
 * ever existed in this browser; a message that cannot be decrypted is passed
 * through with `text: null` so the thread can show a placeholder instead of
 * silently dropping it — a gap the learner cannot see is worse than one they
 * can.
 */
export function watchConversation(user, theirUid, onMessages, onError) {
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
        const key = await deriveConversationKey(pair, theirPublicKey, conversationId);

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

/** The learner's existing conversations, newest first. */
export async function getConversations(uid) {
  if (!uid) return [];
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid),
    orderBy("updatedAt", "desc"),
    limit(30)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      otherUid: (data.participants || []).find((p) => p !== uid) || null,
    };
  });
}

export default {
  announcePresence,
  clearPresence,
  getActiveLearners,
  publishPublicKey,
  getPublicKey,
  blockUser,
  unblockUser,
  getBlockedUids,
  reportUser,
  sendMessage,
  watchConversation,
  getConversations,
};
