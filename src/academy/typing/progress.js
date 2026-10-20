import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { publicNameFor } from "../data/onboarding";
import { typingLevel, speedTier } from "./engine.js";
import { emptyProfile, normalise, recordSession } from "./session.js";

export { emptyProfile, recordSession };

/**
 * TYPING PROGRESS
 *
 * One document per learner at students/{uid}/typing/profile, mirrored to
 * localStorage. The local copy is what makes the tutor feel instant and
 * keeps a session's result if the network drops mid-run; Firestore is what
 * makes it follow the learner to another device. On load the copy with more
 * practice in it wins, so neither can quietly roll the other back.
 *
 * Typing XP is its OWN ladder, separate from course XP on the student record.
 * Course levels are calibrated against a course's content (see
 * data/gamification.js); letting typing drills feed them would let someone
 * reach "Professional" without finishing a course.
 *
 * TRUST: client-written, like lesson practice scores. The leaderboard row is
 * constrained in shape and range by the rules, which is the same preview level
 * as the XP board.
 */

const localKey = (uid) => `ac-typing-${uid || "guest"}`;
const profileRef = (uid) => doc(db, "students", uid, "typing", "profile");
const boardRef = (uid) => doc(db, "typingBoard", uid);

function readLocal(uid) {
  try {
    const raw = localStorage.getItem(localKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocal(uid, profile) {
  try {
    localStorage.setItem(localKey(uid), JSON.stringify(profile));
  } catch {
    /* private window or full storage — Firestore still has it */
  }
}

export async function loadTypingProfile(uid) {
  const local = readLocal(uid);
  let remote = null;
  if (uid) {
    try {
      const snap = await getDoc(profileRef(uid));
      if (snap.exists()) remote = snap.data();
    } catch {
      // Offline or rules not deployed yet: run on the local copy.
    }
  }
  const pickBest = () => {
    if (!local) return remote;
    if (!remote) return local;
    if ((remote.totalKeys || 0) !== (local.totalKeys || 0))
      return (remote.totalKeys || 0) > (local.totalKeys || 0) ? remote : local;
    return (remote.updatedAt || 0) >= (local.updatedAt || 0) ? remote : local;
  };
  return normalise(pickBest());
}

/** Read-only summary for other Academy pages (dashboard, profile). */
export async function getTypingSummary(uid) {
  const p = await loadTypingProfile(uid);
  const level = typingLevel(p.xp);
  return {
    xp: p.xp,
    level,
    tier: speedTier(p.bestVerifiedWpm),
    bestVerifiedWpm: p.bestVerifiedWpm,
    lessonsPassed: Object.values(p.lessons).filter((l) => l.stars >= 1).length,
    achievements: p.achievements.length,
    sessions: p.sessions,
    streak: p.streak,
    lessons: p.lessons,
  };
}

let saveTimer = null;
export function saveTypingProfile(uid, profile) {
  writeLocal(uid, profile);
  if (!uid) return;
  clearTimeout(saveTimer);
  // Debounced: a learner doing quick-fire tests should not cost a write per run.
  saveTimer = setTimeout(() => {
    setDoc(profileRef(uid), profile).catch(() => {});
  }, 1200);
}

/* ── Typing leaderboard ──────────────────────────────────────────────────── */

/** Fields the board may hold — mirrored in firestore.rules. */
export const BOARD_FIELDS = ["uid", "name", "wpm", "accuracy", "level", "tier", "updatedAt"];

/**
 * Publish the learner's verified best. Honours the same opt-out as the XP
 * board, and uses the public username, never the real name.
 */
export async function publishTypingBoard(uid, student, profile) {
  if (!uid || !student) return;
  try {
    if (student.leaderboardOptOut === true) {
      await deleteDoc(boardRef(uid)).catch(() => {});
      return;
    }
    if (!profile.bestVerifiedWpm) return;
    await setDoc(boardRef(uid), {
      uid,
      name: publicNameFor(student),
      wpm: Math.round(profile.bestVerifiedWpm),
      accuracy: Math.round(profile.bestVerifiedAcc || 0),
      level: typingLevel(profile.xp).level,
      tier: speedTier(profile.bestVerifiedWpm).name,
      updatedAt: serverTimestamp(),
    });
  } catch {
    /* refused or offline — never costs the learner their result */
  }
}

export async function getTypingBoard(top = 20) {
  const snap = await getDocs(query(collection(db, "typingBoard"), orderBy("wpm", "desc"), limit(top)));
  return snap.docs.map((d, i) => ({ rank: i + 1, id: d.id, ...d.data() }));
}
