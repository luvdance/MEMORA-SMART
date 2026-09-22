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
 * The last complete row written for each account, in this browser.
 *
 * EVERY presence write is a full replace, and this is what makes that safe.
 *
 * The earlier design replaced the document once and then MERGED every later
 * heartbeat. On any row still carrying the fields an older build wrote —
 * displayName, memoraId, avatar — the merged result failed the rule's field
 * list and was denied. Only the first write landed; every refresh after it
 * failed silently, so `lastSeen` froze, the row aged out of the Active list,
 * and nobody could see anyone. Meanwhile the Messages tab, which only checked
 * `online`, went on saying "studying now".
 *
 * A replace cannot be refused for fields it does not send. Reusing the last
 * complete row means a heartbeat without the student record to hand still
 * writes the real username rather than "Memora learner".
 */
const lastRow = new Map();

/**
 * Say "I am here", refresh it, or mark this learner idle.
 *
 * Returns { ok, code } instead of swallowing the failure. Presence failing
 * silently is how the Active list spent several rounds empty with nothing on
 * screen to explain it; the pane now shows the reason.
 */
export async function announcePresence(
  user,
  { student, lessonTitle, status = "online" } = {}
) {
  if (!user?.uid) return { ok: false, code: "no-user" };

  const previous = lastRow.get(user.uid);

  // Never fall back to displayName, which is the real name from the account
  // provider. With no record and no earlier row, the learner shows as
  // anonymous — the right failure.
  const row = {
    uid: user.uid,
    online: true,
    status: status === "idle" ? "idle" : "online",
    name: student ? publicNameFor(student) : previous?.name || publicNameFor(null),
    level: student ? student.level ?? null : previous?.level ?? null,
    badges: student
      ? (student.badges || []).slice(0, 12)
      : previous?.badges || [],
    lessonTitle:
      lessonTitle !== undefined ? lessonTitle || null : previous?.lessonTitle ?? null,
  };

  try {
    // No `merge`: see lastRow above for why this matters.
    await setDoc(presenceRef(user.uid), { ...row, lastSeen: serverTimestamp() });
    lastRow.set(user.uid, row);
    return { ok: true };
  } catch (err) {
    console.warn("presence failed:", err?.code || err?.message);
    return { ok: false, code: err?.code || "unknown" };
  }
}

/**
 * A learner's public details, by uid.
 *
 * Read from `presence`, which everyone who has opened the pane has a row in,
 * rather than from the leaderboard — somebody who hid themselves has no
 * leaderboard row, and a conversation you already have should still show
 * their name.
 *
 * Returns the raw `online`, `status` and `lastSeen` so the caller can run the
 * SAME presenceStatus() the Active list uses. Returning a precomputed boolean
 * is what let the two tabs disagree.
 *
 * Only the public projection: username, level, badges, presence. The student
 * document, which holds the phone number and age band, is its owner's alone.
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
 * Stop appearing in the active list.
 *
 * Also a full replace, for the same reason as announcePresence: a merge onto
 * a legacy row is refused. It needs the last row to do that without wiping
 * the username, so a learner who never announced in this browser is skipped —
 * there is nothing of theirs to take down, and the ten-minute cut-off in
 * presenceStatus() retires any row an earlier session left behind.
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
 *
 * `getMeta` is a function so the heartbeat always reads the CURRENT lesson
 * and student record without the interval being torn down and rebuilt.
 *
 * `onResult` receives every write's { ok, code }, so the pane can say when
 * other learners cannot see you, and clear it the moment they can.
 *
 * BACKGROUNDING IS "IDLE", NOT "GONE"
 * Losing visibility used to call clearPresence() at once, so with two
 * accounts in two tabs — how this gets tested — the one not in front marked
 * itself offline and the two could never see each other. It now writes
 * status "idle" once and stops refreshing. Coming back writes "online".
 * pagehide is a real departure and still goes offline immediately.
 *
 * Returns a stop function.
 */
export function startPresenceHeartbeat(user, getMeta, { onResult } = {}) {
  if (!user?.uid) return () => {};

  const announce = async (status = "online") => {
    const result = await announcePresence(user, { ...(getMeta?.() || {}), status });
    onResult?.(result);
  };

  announce("online");
  let interval = setInterval(() => announce("online"), HEARTBEAT_MS);

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      if (interval) clearInterval(interval);
      interval = null;
      announce("idle");
      return;
    }
    announce("online");
    if (!interval) interval = setInterval(() => announce("online"), HEARTBEAT_MS);
  };

  const onLeave = () => clearPresence(user.uid);

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onLeave);

  return () => {
    if (interval) clearInterval(interval);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onLeave);
    clearPresence(user.uid);
  };
}

/**
 * Who is around, live — online and idle, most recent first.
 *
 * NO TIME CUT-OFF IS SENT TO THE SERVER. It used to send
 * `lastSeen >= (local now − 5 min)`, computed from the LEARNER'S clock and
 * compared with SERVER timestamps. A clock a few minutes fast put the cut-off
 * in the server's future and the list came back empty — for every account on
 * that machine, with nothing to say why. Ordering by `lastSeen` and limiting
 * already keeps the result small; which rows count as current is decided on
 * the client by presenceStatus(), against a server-anchored clock.
 *
 * The callback's second argument is that anchor: the freshest server
 * timestamp in the snapshot — INCLUDING this learner's own row, which the
 * heartbeat keeps fresh — and the local time it was observed.
 *
 * Uses the (online, lastSeen) composite index.
 *
 * Returns an unsubscribe function.
 */
export function subscribeActiveStudents(
  callback,
  { excludeUid = null, onError } = {}
) {
  const q = query(
    collection(db, "presence"),
    where("online", "==", true),
    orderBy("lastSeen", "desc"),
    limit(MAX_ACTIVE * 2)
  );

  return onSnapshot(
    q,
    (snap) => {
      const all = snap.docs.map((d) => {
        const data = d.data();
        return { ...data, id: d.id, name: data.name || publicNameFor(null) };
      });

      const anchor = {
        serverMs: freshestSeen(all),
        localMs: Date.now(),
      };

      callback(
        all.filter((r) => r.id !== excludeUid),
        anchor
      );
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
      callback([], { serverMs: null, localMs: Date.now() });
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

/**
 * The learner's existing conversations, most recent first.
 *
 * DELIBERATELY NOT ordered server-side. `array-contains` plus an `orderBy`
 * needs a composite index, and an index that has not been created yet fails
 * the whole query -- which is how the active list ended up reporting an empty
 * room. `array-contains` alone uses the automatic single-field index, and
 * thirty threads sort instantly in memory.
 *
 * Resolving the other person's name is a separate read per thread, because
 * the conversation document holds no names. That is the point: it carries the
 * two uids and a timestamp, and nothing about what was said.
 */
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
  getPublicProfile,
  sendMessage,
  watchConversation,
  getConversations,
  blockUser,
  unblockUser,
  getBlockedUids,
  reportUser,
};
