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

/* ── Constants ─────────────────────────────────────────────────────────── */

const PRESENCE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const HEARTBEAT_MS    = 90 * 1000;      // heartbeat every 90s
const MAX_ACTIVE      = 20;             // cap active users list

/* ── Refs ───────────────────────────────────────────────────────────────── */

const presenceRef = (uid)         => doc(db, "presence", uid);
const leaderRef   = (uid)         => doc(db, "leaderboard", uid);
const blockRef    = (uid, target) => doc(db, "blocks", uid, "list", target);
const reportCol   = ()            => collection(db, "reports");

/* ═══════════════════════════════════════════════════════════════════════════
   PRESENCE
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Write / refresh the caller's presence document.
 * Accepts either a uid string or a full Firebase user object.
 */
export async function setOnline(uidOrUser, student) {
  const uid = typeof uidOrUser === "string"
    ? uidOrUser
    : uidOrUser?.uid;
  if (!uid) return;

  try {
    await setDoc(presenceRef(uid), {
      online:      true,
      lastSeen:    serverTimestamp(),
      uid,
      displayName: student?.displayName ?? "Student",
      memoraId:    student?.memoraId    ?? "",
      level:       student?.level       ?? 1,
      avatar:      student?.avatar      ?? null,
    }, { merge: true });
  } catch (err) {
    console.warn("presence setOnline failed:", err.code ?? err.message);
  }
}

/**
 * Mark the caller offline immediately.
 */
export async function setOffline(uid) {
  const resolvedUid = typeof uid === "string" ? uid : uid?.uid;
  if (!resolvedUid) return;
  try {
    await setDoc(presenceRef(resolvedUid), {
      online:   false,
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("presence setOffline failed:", err.code ?? err.message);
  }
}

/**
 * Start a presence heartbeat.
 *
 * Signature matches what SocialPane calls:
 *   startPresenceHeartbeat(user, () => ({ student, lessonTitle }), { onResult })
 *
 * Also handles the simpler legacy call:
 *   startPresenceHeartbeat(uid, studentObject)
 *
 * Returns a cleanup function — call it in useEffect's return.
 */
export function startPresenceHeartbeat(userOrUid, getContext, options = {}) {
  const uid = typeof userOrUid === "string"
    ? userOrUid
    : userOrUid?.uid;
  if (!uid) return () => {};

  const { onResult } = options;

  const writePresence = async () => {
    // Support both:
    // 1. getContext as a function returning { student, lessonTitle }
    // 2. getContext as a plain student object (legacy)
    const ctx         = typeof getContext === "function" ? getContext() : {};
    const student     = ctx?.student     ?? (typeof getContext === "object" ? getContext : {});
    const lessonTitle = ctx?.lessonTitle ?? null;

    try {
      await setDoc(presenceRef(uid), {
        online:      true,
        lastSeen:    serverTimestamp(),
        uid,
        displayName: student?.displayName ?? "Student",
        memoraId:    student?.memoraId    ?? "",
        level:       student?.level       ?? 1,
        avatar:      student?.avatar      ?? null,
        lessonTitle,
      }, { merge: true });

      onResult?.({ ok: true });
    } catch (err) {
      console.warn("presence write failed:", err.code ?? err.message);
      onResult?.({ ok: false, code: err.code, message: err.message });
    }
  };

  // Write immediately on mount
  writePresence();

  // Periodic heartbeat
  const interval = setInterval(writePresence, HEARTBEAT_MS);

  // Page visibility — covers mobile lock + tab switch + iOS Safari
  const handleVisibility = () => {
    if (document.visibilityState === "hidden") {
      setOffline(uid);
    } else {
      writePresence();
    }
  };

  const handleUnload = () => setOffline(uid);

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("beforeunload", handleUnload);
  window.addEventListener("pagehide", handleUnload); // iOS Safari

  return () => {
    clearInterval(interval);
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("beforeunload", handleUnload);
    window.removeEventListener("pagehide", handleUnload);
    setOffline(uid);
  };
}

/**
 * Subscribe to currently active students.
 *
 * Requires composite index in Firestore:
 *   Collection: presence | online ASC | lastSeen ASC
 */
export function subscribeActiveStudents(callback, excludeUid = null) {
  const cutoff = Timestamp.fromMillis(Date.now() - PRESENCE_TTL_MS);

  const q = query(
    collection(db, "presence"),
    where("online",   "==", true),
    where("lastSeen", ">=", cutoff),
    orderBy("lastSeen", "desc"),
    limit(MAX_ACTIVE + 1),
  );

  return onSnapshot(q,
    (snap) => {
      const active = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(s => s.uid !== excludeUid)
        .slice(0, MAX_ACTIVE);
      callback(active);
    },
    (err) => {
      if (err.code === "failed-precondition") {
        console.warn(
          "presence: composite index not ready.\n" +
          "Create in Firebase Console → Firestore → Indexes → Composite:\n" +
          "  Collection: presence | online ASC | lastSeen ASC"
        );
      } else {
        console.warn("presence subscription error:", err.code ?? err.message);
      }
      callback([]);
    }
  );
}

/* ── Aliases used by SocialPane ─────────────────────────────────────────── */
export const announcePresence = setOnline;
export const clearPresence    = setOffline;

export function getActiveLearners(excludeUid, callback) {
  return subscribeActiveStudents(callback, excludeUid);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEADERBOARD
═══════════════════════════════════════════════════════════════════════════ */

export async function updateLeaderboard(uid, student) {
  if (!uid || !student) return;
  try {
    await setDoc(leaderRef(uid), {
      uid,
      displayName: student.displayName ?? "Student",
      memoraId:    student.memoraId    ?? "",
      level:       student.level       ?? 1,
      xp:          student.xp          ?? 0,
      badges:      student.badges      ?? [],
      avatar:      student.avatar      ?? null,
      updatedAt:   serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("leaderboard update failed:", err.code ?? err.message);
  }
}

export function subscribeLeaderboard(callback, n = 50) {
  const q = query(
    collection(db, "leaderboard"),
    orderBy("xp", "desc"),
    limit(n),
  );

  return onSnapshot(q,
    (snap) => {
      const rows = snap.docs.map((d, i) => ({
        rank: i + 1,
        uid:  d.id,
        ...d.data(),
      }));
      callback(rows);
    },
    (err) => {
      console.warn("leaderboard subscription error:", err.code ?? err.message);
      callback([]);
    }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC KEYS — E2EE
═══════════════════════════════════════════════════════════════════════════ */

export async function getPublicKey(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, "publicKeys", uid));
    return snap.exists() ? snap.data().key ?? null : null;
  } catch (err) {
    console.warn("getPublicKey failed:", err.code ?? err.message);
    return null;
  }
}

export async function publishPublicKey(uid, key) {
  if (!uid || !key) return;
  try {
    await setDoc(doc(db, "publicKeys", uid), {
      key,
      uid,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("publishPublicKey failed:", err.code ?? err.message);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGING
═══════════════════════════════════════════════════════════════════════════ */

export async function sendMessage(
  conversationId,
  senderId,
  content,
  encrypted = false,
) {
  if (!conversationId || !senderId || !content) return;

  await addDoc(
    collection(db, "conversations", conversationId, "messages"),
    {
      senderId,
      content,
      encrypted,
      createdAt: serverTimestamp(),
      readBy:    [senderId],
    },
  );

  await setDoc(doc(db, "conversations", conversationId), {
    lastMessage:   encrypted ? "🔒 Encrypted message" : content.slice(0, 100),
    lastMessageAt: serverTimestamp(),
    lastSenderId:  senderId,
  }, { merge: true });
}

export function watchConversation(conversationId, callback) {
  if (!conversationId) return () => {};

  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
    limit(100),
  );

  return onSnapshot(q,
    (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    },
    (err) => {
      console.warn("watchConversation error:", err.code ?? err.message);
      callback([]);
    }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCKS
═══════════════════════════════════════════════════════════════════════════ */

export async function blockUser(myUid, targetUid) {
  if (!myUid || !targetUid || myUid === targetUid) return;
  await setDoc(blockRef(myUid, targetUid), {
    blockedAt: serverTimestamp(),
    targetUid,
  });
}

export async function unblockUser(myUid, targetUid) {
  if (!myUid || !targetUid) return;
  await deleteDoc(blockRef(myUid, targetUid));
}

export async function fetchBlockList(myUid) {
  if (!myUid) return [];
  try {
    const snap = await getDocs(collection(db, "blocks", myUid, "list"));
    return snap.docs.map(d => d.id);
  } catch (err) {
    console.warn("fetchBlockList failed:", err.code ?? err.message);
    return [];
  }
}

// Alias used by SocialPane
export const getBlockedUids = fetchBlockList;

/* ═══════════════════════════════════════════════════════════════════════════
   REPORTS
═══════════════════════════════════════════════════════════════════════════ */

export async function reportUser(myUid, targetUid, reason = "") {
  if (!myUid || !targetUid) return;
  try {
    await setDoc(doc(reportCol(), `${myUid}_${targetUid}`), {
      reporterUid: myUid,
      targetUid,
      reason:      reason.trim().slice(0, 500),
      createdAt:   serverTimestamp(),
    });
  } catch (err) {
    console.warn("reportUser failed:", err.code ?? err.message);
  }
}