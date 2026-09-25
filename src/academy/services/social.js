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
import { freshestSeen } from "../data/presence";

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
 * 2. THERE IS NO PLAINTEXT PREVIEW ON THE PARENT DOCUMENT.
 * ═══════════════════════════════════════════════════════════════════════════
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

const lastRow = new Map();

/**
 * Say "I am here", refresh it, or mark this learner idle.
 *
 * Strict key adherence for Firestore rules:
 * ['uid', 'online', 'status', 'name', 'level', 'badges', 'lessonTitle', 'lastSeen']
 */
export async function announcePresence(
  user,
  { student, lessonTitle, status = "online" } = {}
) {
  if (!user?.uid) return { ok: false, code: "no-user" };

  const previous = lastRow.get(user.uid);

  const row = {
    uid: user.uid,
    online: true,
    status: status === "idle" ? "idle" : "online",
    name: student ? publicNameFor(student) : previous?.name || publicNameFor(null),
    level: student ? student.level ?? null : previous?.level ?? null,
    badges: student ? (student.badges || []).slice(0, 12) : previous?.badges || [],
    lessonTitle:
      lessonTitle !== undefined ? lessonTitle || null : previous?.lessonTitle ?? null,
  };

  try {
    await setDoc(presenceRef(user.uid), { ...row, lastSeen: serverTimestamp() });
    lastRow.set(user.uid, row);
    return { ok: true };
  } catch (err) {
    console.warn("presence failed:", err?.code || err?.message);
    return { ok: false, code: err?.code || "unknown", message: err?.message };
  }
}

/**
 * A learner's public details, by uid.
 */
export async function getPublicProfile(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(presenceRef(uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      id: uid,
      name: d.name || publicNameFor(null),
      level: d.level ?? null,
      badges: d.badges || [],
      online: d.online === true,
      status: d.status || null,
      lastSeen: d.lastSeen || null,
      lessonTitle: d.lessonTitle || null,
    };
  } catch {
    return null;
  }
}

/**
 * Leave the active list.
 */
export async function clearPresence(uid) {
  if (!uid) return { ok: false, code: "no-user" };
  const previous = lastRow.get(uid);
  if (!previous) return { ok: true, skipped: true };

  try {
    await setDoc(presenceRef(uid), {
      ...previous,
      uid,
      online: false,
      status: "offline",
      lastSeen: serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    console.warn("clearPresence failed:", err?.code || err?.message);
    return { ok: false, code: err?.code || "unknown" };
  }
}

/**
 * Keep presence current while the pane is open.
 */
export function startPresenceHeartbeat(user, getMeta, { onResult } = {}) {
  if (!user?.uid) return () => {};

  const announce = async (status = "online") => {
    const result = await announcePresence(user, { ...(getMeta?.() || {}), status });
    onResult?.(result);
    return result;
  };

  announce("online");
  let interval = setInterval(() => announce("online"), HEARTBEAT_MS);

  const stopBeating = () => {
    if (interval) clearInterval(interval);
    interval = null;
  };

  const startBeating = () => {
    if (!interval) interval = setInterval(() => announce("online"), HEARTBEAT_MS);
  };

  const goIdle = () => {
    stopBeating();
    announce("idle");
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      goIdle();
      return;
    }
    announce("online");
    startBeating();
  };

  const onPageHide = (event) => {
    if (event?.persisted) {
      goIdle();
      return;
    }
    stopBeating();
    clearPresence(user.uid);
  };

  const onPageShow = (event) => {
    if (!event?.persisted) return;
    announce("online");
    startBeating();
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);

  return () => {
    stopBeating();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("pageshow", onPageShow);
    clearPresence(user.uid);
  };
}

/**
 * Who is around, live.
 *
 * Modified to use `orderBy("lastSeen", "asc")` to match your existing
 * Firestore composite index (online ASC, lastSeen ASC), then reverses
 * the results in memory so the freshest seen users appear first.
 */
export function subscribeActiveStudents(
  callback,
  { excludeUid = null, onError } = {}
) {
  // Query aligns with existing index: online ASC, lastSeen ASC
  const q = query(
    collection(db, "presence"),
    where("online", "==", true),
    orderBy("lastSeen", "asc"),
    limit(MAX_ACTIVE * 2)
  );

  return onSnapshot(
    q,
    (snap) => {
      const all = snap.docs.map((d) => {
        const data = d.data();
        return { ...data, id: d.id, name: data.name || publicNameFor(null) };
      });

      // Reverse in memory so most recent `lastSeen` comes first
      all.reverse();

      callback(all.filter((r) => r.id !== excludeUid), {
        serverMs: freshestSeen(all),
        localMs: Date.now(),
        total: all.length,
        self: all.find((r) => r.id === excludeUid) || null,
      });
    },
    (err) => {
      if (err?.code === "failed-precondition") {
        console.warn(
          "presence: composite index missing or building.\n" +
            "Firebase Console → Firestore → Indexes → Composite:\n" +
            "  Collection: presence | online ASC | lastSeen ASC"
        );
      } else {
        console.warn("presence subscription error:", err?.code || err?.message);
      }
      onError?.(err);
      callback([], { serverMs: null, localMs: Date.now(), total: 0, self: null });
    }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC KEYS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Publish this browser's public key so others can write to you.
 *
 * ── ROTATION IS DETECTED, NOT SILENT ─────────────────────────────────────
 * This runs on every chat open. Normally it republishes the identical key and
 * nothing changes. But if this browser had to generate a fresh keypair — a new
 * device, a cleared site, or storage the browser evicted, which some do after
 * a period of disuse — it silently replaced the published key and every
 * message either side had ever sent became undecryptable, for both of them,
 * permanently. Nobody was told, and the chat simply filled with a line about a
 * key the browser did not have.
 *
 * So the previously published key is read first and compared. `rotated` says
 * this account's key changed on this device, which is the one fact that
 * explains the whole thread going unreadable, and the interface can say so
 * once instead of repeating a cryptographic detail per message.
 *
 * It is NOT an error and nothing is retried: the new key is correct and
 * current, and going forward everything works. What is lost is the past, and
 * that is a property of end-to-end encryption rather than a fault.
 */
export async function publishPublicKey(user) {
  if (!user?.uid) throw new Error("Not signed in");
  const pair = await getIdentity(user.uid);
  const publicKey = await exportPublicKey(pair);

  // Read before write. A failure here must not stop the key being published —
  // messaging working matters more than knowing whether it rotated.
  let previous = null;
  try {
    const snap = await getDoc(publicKeyRef(user.uid));
    previous = snap.exists() ? snap.data().publicKey || null : null;
  } catch {
    previous = null;
  }

  const rotated = Boolean(previous && previous !== publicKey);

  // The written shape is fixed by firestore.rules, which allowlists exactly
  // these four keys via hasOnly(). merge:true does not exempt it: the rule sees
  // the POST-merge document, so one extra field fails the whole write and the
  // key never publishes — which reads to the learner as "nobody can message
  // me". Rotation is returned to the caller instead of being stored; if it ever
  // needs persisting, the rule has to allow the field in the same change.
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

  return { pair, publicKey, rotated };
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

export async function getConversations(uid) {
  if (!uid) return [];
  try {
    const snap = await getDocs(
      query(
        collection(db, "conversations"),
        where("participants", "array-contains", uid),
        limit(30)
      )
    );

    const rows = snap.docs.map((d) => {
      const data = d.data();
      const participants = data.participants || d.id.split("__");
      return {
        id: d.id,
        otherUid: participants.find((x) => x !== uid) || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      };
    });

    rows.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));

    const withNames = await Promise.all(
      rows
        .filter((r) => r.otherUid)
        .map(async (r) => ({
          ...r,
          person: (await getPublicProfile(r.otherUid)) || {
            id: r.otherUid,
            name: publicNameFor(null),
            badges: [],
          },
        }))
    );

    return withNames;
  } catch (err) {
    console.warn("getConversations failed:", err?.code || err?.message);
    return [];
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCKING AND REPORTING
   ═══════════════════════════════════════════════════════════════════════════ */

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

export const getActiveLearners = (excludeUid, callback) =>
  subscribeActiveStudents(callback, { excludeUid });

export default {
  announcePresence,
  clearPresence,
  startPresenceHeartbeat,
  subscribeActiveStudents,
  publishPublicKey,
  getPublicKey,
  getPublicProfile,
  sendMessage,
  watchConversation,
  getConversations,
  blockUser,
  unblockUser,
  getBlockedUids,
  reportUser,
};