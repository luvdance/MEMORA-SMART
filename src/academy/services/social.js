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
 * WHY THE FULL WRITE IS A REPLACE, NOT A MERGE
 *
 * An older version of this module stored `displayName`, `memoraId` and
 * `avatar` on presence rows. The security rule now constrains the document to
 * a fixed field list, and on a MERGE Firestore evaluates the merged RESULT --
 * so those three legacy fields were still in the payload, failed the rule,
 * and every write to an existing row was denied. Learners with an old row
 * could never come online again, and the active list stayed empty while
 * reporting nothing wrong.
 *
 * Replacing the document purges anything not in the current shape. The
 * heartbeat still merges, but only after a replace has established the shape,
 * so it can only ever touch allowed fields.
 *
 * Fields absent from `student` are LEFT OUT rather than written as null,
 * because the heartbeat does not always hold the student record -- writing
 * `level: student?.level ?? 1` unconditionally overwrote the real level and
 * blanked the badges a minute and a half after a learner arrived.
 */
export async function announcePresence(user, { student, lessonTitle } = {}) {
  if (!user?.uid) return;
  try {
    if (student) {
      // The complete row. Never falls back to displayName: a row with no
      // username shows as an anonymous learner, which is the right failure.
      await setDoc(presenceRef(user.uid), {
        uid: user.uid,
        online: true,
        name: publicNameFor(student),
        level: student.level ?? null,
        badges: (student.badges || []).slice(0, 12),
        lessonTitle: lessonTitle || null,
        lastSeen: serverTimestamp(),
      });
      return;
    }

    // A refresh with no record to hand. Safe as a merge because the fields
    // it touches are all in the allowed set, and it cannot resurrect a
    // legacy field that a replace has already removed.
    await setDoc(
      presenceRef(user.uid),
      { uid: user.uid, online: true, lastSeen: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    // Presence is optional; it must never break a lesson.
    console.warn("presence failed:", err?.code || err?.message);
  }
}

/**
 * A learner's public details, by uid.
 *
 * Read from `presence`, which every learner who has opened the pane has a row
 * in, rather than from the leaderboard -- somebody who hid themselves has no
 * leaderboard row, and a conversation you already have with them should still
 * show their name.
 *
 * Only ever returns the public projection: a username, level and badges. The
 * student document, which holds the phone number and age band, is readable by
 * its owner alone.
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
    };
  } catch {
    return null;
  }
}

/** Stop appearing in the active list. */
export async function clearPresence(uid) {
  if (!uid) return;
  try {
    /* `uid` is included because the rule requires request.resource.data.uid
       to match the document id, and on a merge into a document that does not
       exist yet the merged result would not carry it — producing a
       permission error for a write that is only trying to tidy up. Spurious
       permission errors are exactly what made the earlier presence failures
       so hard to place. */
    await setDoc(
      presenceRef(uid),
      { uid, online: false, lastSeen: serverTimestamp() },
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

  let interval = setInterval(announce, HEARTBEAT_MS);

  /**
   * A BACKGROUNDED TAB STOPS REFRESHING. IT DOES NOT DECLARE ITSELF GONE.
   *
   * This used to call clearPresence() the instant visibility was lost, which
   * made the active list unusable in practice. Anyone with two windows open
   * -- which is exactly how you test this with two accounts -- had the
   * unfocused account mark itself offline immediately, so the two could never
   * see each other. The same thing happened to a real learner who alt-tabbed
   * to look something up.
   *
   * Going quiet is enough. `lastSeen` is what the active query filters on, so
   * a tab that stops refreshing drops out on its own once PRESENCE_TTL_MS has
   * passed. That is the honest signal: "not seen for five minutes", rather
   * than "looked away for a second".
   *
   * pagehide still clears at once, because that is a real departure.
   */
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      clearInterval(interval);
      interval = null;
      return;
    }
    announce();
    if (!interval) interval = setInterval(announce, HEARTBEAT_MS);
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
      /* The query's cutoff was fixed when this subscription was created, so
         after the pane has been open a while it stops excluding anyone. The
         same window is applied again here, against the current clock, so
         somebody who closed their laptop without a pagehide firing drops off
         instead of appearing to study for ever. */
      const freshAfter = Date.now() - PRESENCE_TTL_MS;

      const rows = snap.docs
        // `id` and `name` are the shape the pane renders.
        .map((d) => {
          const data = d.data();
          return { ...data, id: d.id, name: data.name || publicNameFor(null) };
        })
        .filter((s) => s.id !== excludeUid)
        .filter((s) => {
          // A just-written row has a null timestamp until the server fills
          // it in, and that row is by definition current -- dropping it
          // would make someone flicker out the moment they arrive.
          const seen = s.lastSeen?.toMillis?.();
          return seen === undefined || seen === null || seen >= freshAfter;
        })
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

// Alias used by SocialPane
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
