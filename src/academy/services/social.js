import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  serverTimestamp,
  Timestamp,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase";

/* ── Constants ─────────────────────────────────────────────────────────── */

const PRESENCE_TTL_MS = 5 * 60 * 1000; // 5 minutes — mark stale after this
const HEARTBEAT_MS = 90 * 1000;         // write presence every 90 s
const MAX_ACTIVE = 20;                  // cap the active-users list

/* ── Presence paths ─────────────────────────────────────────────────────── */

const presenceRef  = (uid) => doc(db, "presence", uid);
const leaderRef    = (uid) => doc(db, "leaderboard", uid);
const blockRef     = (uid, target) => doc(db, "blocks", uid, "list", target);
const reportRef    = ()  => collection(db, "reports");

/* ═══════════════════════════════════════════════════════════════════════════
   PRESENCE
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Write / refresh the caller's presence document.
 * Called on mount and every HEARTBEAT_MS thereafter.
 */
export async function setOnline(uid, student) {
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
    // Presence is best-effort — never let it break the UI
    console.warn("presence setOnline failed:", err.code ?? err.message);
  }
}

/**
 * Mark the caller offline immediately.
 * Called on unmount and on page-hide / beforeunload.
 */
export async function setOffline(uid) {
  if (!uid) return;
  try {
    await setDoc(presenceRef(uid), {
      online:   false,
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("presence setOffline failed:", err.code ?? err.message);
  }
}

/**
 * Start a presence heartbeat.
 * Returns a cleanup function — call it in useEffect's return.
 *
 * Handles:
 *  - periodic refresh (HEARTBEAT_MS)
 *  - visibilitychange  (tab hidden / phone locked)
 *  - beforeunload      (desktop tab/window close)
 *  - pagehide          (iOS Safari — beforeunload is unreliable there)
 */
export function startPresenceHeartbeat(uid, student) {
  if (!uid) return () => {};

  // Write immediately on mount
  setOnline(uid, student);

  // Periodic heartbeat
  const interval = setInterval(() => setOnline(uid, student), HEARTBEAT_MS);

  // Page-visibility handler — covers mobile lock + tab switch
  const handleVisibility = () => {
    if (document.visibilityState === "hidden") {
      setOffline(uid);
    } else {
      setOnline(uid, student);
    }
  };

  // beforeunload — desktop browsers
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
 * Subscribe to the list of currently-active students.
 *
 * Uses a Firestore Timestamp for the cutoff so the comparison is
 * type-safe (serverTimestamp() → Timestamp; new Date() → Date, which
 * Firestore treats differently in where() clauses).
 *
 * NOTE: this query requires a composite index:
 *   Collection : presence
 *   Fields     : online ASC, lastSeen DESC
 * Create it in the Firebase console → Firestore → Indexes → Composite.
 */
export function subscribeActiveStudents(callback, excludeUid = null) {
  // Use Firestore Timestamp — NOT new Date() — for type-safe comparison
  const cutoff = Timestamp.fromMillis(Date.now() - PRESENCE_TTL_MS);

  const q = query(
    collection(db, "presence"),
    where("online", "==", true),
    where("lastSeen", ">=", cutoff),  // ">=" is safer than ">" for boundary docs
    orderBy("lastSeen", "desc"),
    limit(MAX_ACTIVE + 1),            // +1 so we can exclude self without going under MAX
  );

  const unsub = onSnapshot(q,
    (snap) => {
      const active = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(s => s.uid !== excludeUid)
        .slice(0, MAX_ACTIVE);
      callback(active);
    },
    (err) => {
      // Index not yet built → silently return empty rather than crashing
      if (err.code === "failed-precondition") {
        console.warn(
          "presence: composite index not ready yet.\n" +
          "Create it in Firebase Console → Firestore → Indexes → Composite:\n" +
          "  Collection: presence | online ASC | lastSeen DESC"
        );
        callback([]);
      } else {
        console.warn("presence subscription error:", err.code ?? err.message);
        callback([]);
      }
    }
  );

  return unsub;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEADERBOARD
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Upsert a student's leaderboard entry.
 * Only the fields listed here are written — never raw scores or emails.
 */
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

/**
 * Subscribe to the top-N leaderboard entries.
 */
export function subscribeLeaderboard(callback, n = 50) {
  const q = query(
    collection(db, "leaderboard"),
    orderBy("xp", "desc"),
    limit(n),
  );

  const unsub = onSnapshot(q,
    (snap) => {
      const rows = snap.docs.map((d, i) => ({
        rank: i + 1,
        uid: d.id,
        ...d.data(),
      }));
      callback(rows);
    },
    (err) => {
      console.warn("leaderboard subscription error:", err.code ?? err.message);
      callback([]);
    }
  );

  return unsub;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCKS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Block a user. Adds their UID to the caller's block list.
 */
export async function blockUser(myUid, targetUid) {
  if (!myUid || !targetUid || myUid === targetUid) return;
  await setDoc(blockRef(myUid, targetUid), {
    blockedAt: serverTimestamp(),
    targetUid,
  });
}

/**
 * Unblock a user.
 */
export async function unblockUser(myUid, targetUid) {
  if (!myUid || !targetUid) return;
  await deleteDoc(blockRef(myUid, targetUid));
}

/**
 * Fetch the caller's full block list (array of UIDs).
 */
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

/* ═══════════════════════════════════════════════════════════════════════════
   REPORTS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * Submit a report against another user.
 */
export async function reportUser(myUid, targetUid, reason = "") {
  if (!myUid || !targetUid) return;
  try {
    await setDoc(doc(reportRef(), `${myUid}_${targetUid}`), {
      reporterUid: myUid,
      targetUid,
      reason:      reason.trim().slice(0, 500),
      createdAt:   serverTimestamp(),
    });
  } catch (err) {
    console.warn("reportUser failed:", err.code ?? err.message);
  }
}