import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  XP,
  advanceStreak,
  evaluateBadges,
  getLevel,
  localDateKey,
} from "../data/gamification";
import { getCourseLessons } from "../data/lessons";
import { getCatalogEntry } from "../data/catalog";
import { chatDefaultFor, publicNameFor, usernameKey } from "../data/onboarding";

/**
 * ACADEMY DATA LAYER
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TRUST BOUNDARY — read this before extending anything here.
 *
 * Assessment ANSWERS are safe: they live in lib/ and are graded by
 * /api/academy/assessment, so they never reach the browser.
 *
 * LESSON assessment RESULTS are written here, by the client. Security rules
 * constrain the shape of these writes and make Memora IDs genuinely unique,
 * but they cannot verify that a score is honest: a determined user could write
 * themselves a lesson pass. That is an accepted trade-off for practice scores,
 * which are a study aid.
 *
 * The FINAL EXAM does not come through here, for exactly that reason. Its
 * attempts and its certificates are graded AND written server-side by
 * lib/academy/finalExam/record.js, using the Admin SDK and the candidate's
 * verified ID token, and firestore.rules denies client writes to both. A
 * certificate is a claim made to an employer, so it must not be self-issued.
 *
 * (An earlier version of this note said no service account was configured.
 * That was wrong — api/paystack-webhook.js and api/requery-payment.js have
 * used one in production since before the Academy shipped.)
 *
 * To raise practice progress to the same level, move recordAssessment() and
 * awardXp() into an API route behind the same ID-token check the exam uses,
 * and deny client writes to enrollments and progress in the rules.
 * ───────────────────────────────────────────────────────────────────────────
 */

const ID_PREFIX = "MS";

/* ── Paths ──────────────────────────────────────────────────────────────── */

const studentRef = (uid) => doc(db, "students", uid);
const enrollmentRef = (uid, courseId) =>
  doc(db, "students", uid, "enrollments", courseId);
const lessonProgressRef = (uid, courseId, lessonId) =>
  doc(db, "students", uid, "progress", `${courseId}__${lessonId}`);

/* ── Memora ID ──────────────────────────────────────────────────────────── */

/**
 * Issue a permanent Memora ID, or return the existing one.
 *
 * Uniqueness does not depend on the counter being honest — it depends on
 * `memoraIds/{id}` being CREATED. Firestore document creation is atomic on the
 * document key, so two concurrent signups cannot both claim MS-2026-000042;
 * the second transaction sees the document exists and retries with the next
 * number. The counter is an optimisation, not the guarantee.
 */
export async function ensureStudent(user) {
  if (!user?.uid) throw new Error("Not signed in");

  const existing = await getDoc(studentRef(user.uid));
  if (existing.exists() && existing.data().memoraId) {
    return existing.data();
  }

  const year = new Date().getFullYear();
  const counterRef = doc(db, "counters", "memoraId");

  const memoraId = await runTransaction(db, async (tx) => {
    // Re-check inside the transaction: two tabs opening at once must not
    // issue two IDs to the same person.
    const studentSnap = await tx.get(studentRef(user.uid));
    if (studentSnap.exists() && studentSnap.data().memoraId) {
      return studentSnap.data().memoraId;
    }

    const counterSnap = await tx.get(counterRef);
    const counter = counterSnap.exists() ? counterSnap.data() : { year, seq: 0 };
    const seq = counter.year === year ? (counter.seq || 0) + 1 : 1;

    const id = `${ID_PREFIX}-${year}-${String(seq).padStart(6, "0")}`;

    const claimRef = doc(db, "memoraIds", id);
    const claim = await tx.get(claimRef);
    if (claim.exists()) {
      // Someone took this number between our read and write. Fail the
      // transaction; Firestore retries it and we take the next number.
      throw new Error("memora-id-collision");
    }

    tx.set(counterRef, { year, seq });
    tx.set(claimRef, { uid: user.uid, issuedAt: serverTimestamp() });
    tx.set(
      studentRef(user.uid),
      {
        uid: user.uid,
        memoraId: id,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        joinedAt: serverTimestamp(),
        xp: 0,
        atomsCompleted: 0,
        lessonsCompleted: 0,
        assessmentsPassed: 0,
        assessmentsAttempted: 0,
        perfectScores: 0,
        comebacks: 0,
        modulesCompleted: 0,
        streak: { current: 0, longest: 0, lastActiveDate: null, freezes: 0 },
        badges: [],
      },
      { merge: true }
    );

    return id;
  });

  const fresh = await getDoc(studentRef(user.uid));
  return fresh.exists() ? fresh.data() : { memoraId };
}

export async function getStudent(uid) {
  if (!uid) return null;
  const snap = await getDoc(studentRef(uid));
  return snap.exists() ? snap.data() : null;
}

/* ── Onboarding profile ─────────────────────────────────────────────────── */

/**
 * Save the answers from the onboarding form.
 *
 * Stored under `profile` on the student document, which the owner may already
 * write. Nothing here goes in the leaderboard or presence projections, so a
 * phone number and an age band are never visible to another learner — that
 * separation is the whole reason those projections exist.
 *
 * `chatEnabled` is DERIVED here rather than taken from the form, so the
 * under-18 default cannot be bypassed by a crafted submission. See
 * chatDefaultFor in data/onboarding.js for why it defaults closed.
 */
/**
 * Claim a username, or fail if somebody else already holds it.
 *
 * Same trick as the Memora ID: the claim is a DOCUMENT CREATION keyed on the
 * lower-cased name, and Firestore makes creation atomic on the key. Two
 * learners submitting the same name at the same moment cannot both succeed.
 *
 * Re-claiming your own name is a no-op, so saving the profile again — which
 * the edit form on the profile page does — does not lock you out of the name
 * you already hold.
 */
async function claimUsername(uid, username) {
  const key = usernameKey(username);
  if (!key) throw new Error("A username is required");

  await runTransaction(db, async (tx) => {
    const ref = doc(db, "usernames", key);
    const snap = await tx.get(ref);

    if (snap.exists()) {
      if (snap.data().uid === uid) return; // already mine
      throw new Error("USERNAME_TAKEN");
    }

    tx.set(ref, { uid, username: String(username).trim(), claimedAt: serverTimestamp() });
  });

  return key;
}

export async function saveProfile(user, answers) {
  if (!user?.uid) throw new Error("Not signed in");

  const username = String(answers.username || "").trim();
  // Claimed BEFORE the profile is written, so a rejected name never ends up
  // stored and displayed while the claim says it belongs to someone else.
  await claimUsername(user.uid, username);

  const profile = {
    username,
    phone: String(answers.phone || "").trim(),
    ageBand: answers.ageBand || null,
    state: answers.state || null,
    device: answers.device || null,
    situation: answers.situation || null,
    education: answers.education || null,
    interests: Array.isArray(answers.interests) ? answers.interests : [],
    goal: String(answers.goal || "").trim().slice(0, 300),
    source: answers.source || null,
    analyticsConsent: Boolean(answers.analyticsConsent),
    completedAt: new Date().toISOString(),
  };

  await setDoc(
    studentRef(user.uid),
    {
      profile,
      // Stored top-level as well as inside `profile`, because every public
      // projection (leaderboard, presence) reads it and none of them should
      // have to load a whole profile — or be tempted to fall back to the
      // real name when they cannot find one.
      username,
      // A safeguard, not a preference: computed from the age band on the
      // server-visible record so the chat UI reads one authoritative value.
      chatEnabled: chatDefaultFor(profile),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return profile;
}

/* ── Enrollment ─────────────────────────────────────────────────────────── */

export async function enroll(user, courseSlug) {
  await ensureStudent(user);

  const ref = enrollmentRef(user.uid, courseSlug);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();

  const first = getCourseLessons(courseSlug)[0] || null;

  const enrollment = {
    uid: user.uid,
    courseId: courseSlug,
    // The course CODE, recorded silently. It is never shown to the learner —
    // an internal handle, not something they should have to read or quote —
    // but it is stamped on the enrolment so a certificate, a support query or
    // an export can say exactly which course this was without depending on a
    // title that may later be reworded.
    courseCode: getCatalogEntry(courseSlug)?.code || null,
    enrolledAt: serverTimestamp(),
    status: "active",
    position: first
      ? { moduleId: first.moduleId, lessonId: first.id, atomIndex: 0 }
      : null,
    completedLessons: [],
  };

  await setDoc(ref, enrollment);
  return enrollment;
}

export async function getEnrollment(uid, courseSlug) {
  if (!uid) return null;
  const snap = await getDoc(enrollmentRef(uid, courseSlug));
  return snap.exists() ? snap.data() : null;
}

export async function getEnrollments(uid) {
  if (!uid) return [];
  const snap = await getDocs(collection(db, "students", uid, "enrollments"));
  return snap.docs.map((d) => d.data());
}

/* ── Progress ───────────────────────────────────────────────────────────── */

export async function getLessonProgress(uid, courseSlug, lessonId) {
  if (!uid) return null;
  const snap = await getDoc(lessonProgressRef(uid, courseSlug, lessonId));
  return snap.exists() ? snap.data() : null;
}

export async function getAllProgress(uid, courseSlug) {
  if (!uid) return {};
  const snap = await getDocs(collection(db, "students", uid, "progress"));
  const out = {};
  for (const d of snap.docs) {
    const data = d.data();
    if (data.courseId === courseSlug) out[data.lessonId] = data;
  }
  return out;
}

/**
 * Record that an atom has been understood. Idempotent — completing the same
 * atom twice awards XP once.
 */
export async function completeAtom(user, courseSlug, lessonId, atomId) {
  const ref = lessonProgressRef(user.uid, courseSlug, lessonId);
  const snap = await getDoc(ref);
  const current = snap.exists()
    ? snap.data()
    : { uid: user.uid, courseId: courseSlug, lessonId, atomsCompleted: [] };

  if (current.atomsCompleted?.includes(atomId)) {
    return { alreadyDone: true, xpAwarded: 0, progress: current };
  }

  const atomsCompleted = [...(current.atomsCompleted || []), atomId];
  const next = { ...current, atomsCompleted, updatedAt: serverTimestamp() };

  await setDoc(ref, next, { merge: true });
  const award = await awardXp(user.uid, XP.ATOM_COMPLETED, { atomsCompleted: 1 });

  return { alreadyDone: false, xpAwarded: XP.ATOM_COMPLETED, progress: next, ...award };
}

/**
 * Record that a spreadsheet practice was solved correctly.
 *
 * Kept SEPARATE from atomsCompleted on purpose. `atomsCompleted` only means
 * "this atom was read and moved past", and atoms recorded before the practice
 * gate existed carry no evidence the exercise was ever attempted. Gating on
 * that record would treat a skipped exercise as a passed one. This field is
 * written only when the engine actually validated an answer.
 */
export async function completePractice(user, courseSlug, lessonId, atomId) {
  const ref = lessonProgressRef(user.uid, courseSlug, lessonId);
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() : {};
  const solved = current.practicesSolved || [];

  if (solved.includes(atomId)) return { alreadySolved: true };

  await setDoc(
    ref,
    {
      uid: user.uid,
      courseId: courseSlug,
      lessonId,
      practicesSolved: [...solved, atomId],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { alreadySolved: false };
}

/**
 * Record a graded attempt. `result` is exactly what /api/academy/assessment
 * returned — this function never decides a score itself.
 */
export async function recordAssessment(user, courseSlug, lessonId, result) {
  const ref = lessonProgressRef(user.uid, courseSlug, lessonId);
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() : { atomsCompleted: [] };

  const previousAttempts = current.assessment?.attempts || 0;
  const wasAlreadyPassed = current.assessment?.passed === true;
  const attempts = previousAttempts + 1;

  const assessment = {
    attempts,
    lastScore: result.score,
    bestScore: Math.max(result.score, current.assessment?.bestScore ?? 0),
    passed: wasAlreadyPassed || result.passed,
    passedAt: wasAlreadyPassed
      ? current.assessment.passedAt
      : result.passed
      ? new Date().toISOString()
      : null,
    conceptsToReview: result.conceptsToReview,
  };

  await setDoc(
    ref,
    {
      uid: user.uid,
      courseId: courseSlug,
      lessonId,
      assessment,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // XP is only awarded the first time a lesson is genuinely passed
  if (wasAlreadyPassed || !result.passed) {
    await awardXp(user.uid, 0, { assessmentsAttempted: 1 });
    return { xpAwarded: 0, firstPass: false, assessment };
  }

  let xp = XP.ASSESSMENT_PASSED + XP.LESSON_COMPLETED;
  const counters = {
    assessmentsAttempted: 1,
    assessmentsPassed: 1,
    lessonsCompleted: 1,
  };

  if (attempts === 1) xp += XP.FIRST_TRY_BONUS;
  if (result.score === 100) {
    xp += XP.PERFECT_SCORE_BONUS;
    counters.perfectScores = 1;
  }
  // Passing after two or more failures — the badge most platforms never give
  if (attempts >= 3) counters.comebacks = 1;

  const award = await awardXp(user.uid, xp, counters);

  await markLessonComplete(user.uid, courseSlug, lessonId);

  return { xpAwarded: xp, firstPass: true, assessment, ...award };
}

async function markLessonComplete(uid, courseSlug, lessonId) {
  const ref = enrollmentRef(uid, courseSlug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const completed = new Set(data.completedLessons || []);
  completed.add(lessonId);

  const lessons = getCourseLessons(courseSlug);
  const index = lessons.findIndex((l) => l.id === lessonId);
  const next = lessons[index + 1] || null;

  await setDoc(
    ref,
    {
      completedLessons: [...completed],
      position: next
        ? { moduleId: next.moduleId, lessonId: next.id, atomIndex: 0 }
        : data.position,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/* ── Leaderboard ────────────────────────────────────────────────────────── */

/**
 * THE LEADERBOARD IS A SEPARATE, MINIMAL PROJECTION — and it has to be.
 *
 * A student document holds an email address, a Memora ID and a full progress
 * record, and the rules let a learner read only their OWN. A leaderboard needs
 * to read everybody's, so the obvious shortcut — loosening the read rule on
 * `students` — would publish every learner's email to every other learner.
 *
 * So `leaderboard/{uid}` carries only what a board actually displays: a name,
 * an XP total, a level and a streak. Nothing else is written, and the rules
 * enforce that with `hasOnly`, so this collection cannot quietly become a
 * second copy of the student record.
 *
 * TRUST: the same preview level as XP itself. XP is written by the client, so
 * a determined user could inflate their own row. A leaderboard cannot be more
 * honest than the number it ranks — the fix is the one the rules already
 * describe: move awardXp() server-side behind the exam's ID-token check, and
 * write this row from there.
 *
 * PRIVACY: a learner can remove themselves with leaveLeaderboard(). Their row
 * is deleted and they stop appearing; they can still see the board.
 */

const leaderboardRef = (uid) => doc(db, "leaderboard", uid);

/** Fields the board is allowed to hold. Mirrored by the Firestore rules. */
const LEADERBOARD_FIELDS = ["uid", "name", "xp", "level", "levelName", "streak", "updatedAt"];

/**
 * Publish or refresh this learner's public row.
 *
 * Called from awardXp, so the board follows real progress and never needs a
 * backfill. Deliberately non-fatal: a learner who has opted out, or whose
 * write is refused, must still earn their XP.
 */
async function publishLeaderboardEntry(uid, student) {
  try {
    // A stored preference, not a one-off delete. Without this check, hiding
    // yourself lasted only until your next lesson: awardXp calls this on every
    // award and would have quietly put you back on the board. A privacy
    // control that silently undoes itself is worse than none.
    if (student?.leaderboardOptOut === true) return;

    const level = getLevel(student.xp || 0);
    const row = {
      uid,
      // The USERNAME, never displayName — which is the real name from the
      // Google account. This projection is readable by every signed-in
      // learner, so publishing displayName here put real full names in front
      // of strangers. publicNameFor falls back to something anonymous rather
      // than to the real name.
      name: publicNameFor(student),
      xp: student.xp || 0,
      level: level.level,
      levelName: level.name,
      streak: student.streak?.current || 0,
      updatedAt: serverTimestamp(),
    };
    await setDoc(leaderboardRef(uid), row, { merge: true });
  } catch {
    // Opted out, offline, or refused by rules. None of those should cost the
    // learner the XP they just earned.
  }
}

/**
 * The top of the board.
 *
 * Only ever called when a learner has actually opened the leaderboard — the
 * component does not fetch while collapsed, so a closed board costs no reads
 * and adds nothing to a lesson page's load.
 */
export async function getLeaderboard({ top = 20 } = {}) {
  const q = query(
    collection(db, "leaderboard"),
    orderBy("xp", "desc"),
    limit(top)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({ rank: i + 1, id: d.id, ...d.data() }));
}

/**
 * Where this learner sits, without downloading the whole board.
 *
 * Counts the rows above them server-side, so a learner ranked 4,000th costs
 * one aggregation query rather than 4,000 document reads.
 */
export async function getMyRank(uid, xp = 0) {
  if (!uid) return null;
  try {
    const above = query(collection(db, "leaderboard"), where("xp", ">", xp));
    const snap = await getCountFromServer(above);
    return snap.data().count + 1;
  } catch {
    return null;
  }
}

/**
 * Show or hide yourself on the leaderboard, and remember the choice.
 *
 * Both directions, because a one-way "hide me" is a trap: a learner who
 * changes their mind, or who pressed it to see what it did, has no way back.
 *
 * Two writes, in an order that matters. Going private, the FLAG is set first
 * and then the row deleted — if the second write fails, awardXp still honours
 * the flag and the row disappears on its next pass. Doing it the other way
 * round would leave someone visible again after their next lesson, which is
 * the failure that actually harms.
 */
export async function setLeaderboardVisibility(user, visible) {
  if (!user?.uid) return;

  if (!visible) {
    await setDoc(
      studentRef(user.uid),
      { leaderboardOptOut: true, updatedAt: serverTimestamp() },
      { merge: true }
    );
    await deleteDoc(leaderboardRef(user.uid));
    return;
  }

  await setDoc(
    studentRef(user.uid),
    { leaderboardOptOut: false, updatedAt: serverTimestamp() },
    { merge: true }
  );
  // Republish immediately rather than waiting for their next lesson, so
  // pressing "Show me" has a visible effect straight away.
  const record = await getStudent(user.uid);
  if (record) await publishLeaderboardEntry(user.uid, { ...record, leaderboardOptOut: false });
}

/** Are they currently visible? Read from the preference, not from the row. */
export function isOnLeaderboard(student) {
  return student?.leaderboardOptOut !== true;
}

/** Exposed for the test suite, so the field list and the rules cannot drift. */
export const __leaderboardFields = LEADERBOARD_FIELDS;

/* ── Final exam ─────────────────────────────────────────────────────────── */

/**
 * The student's exam attempts, newest first.
 *
 * Read-only from the client: these documents are written by the server and
 * the rules deny client writes, so there is no setter here to match.
 */
export async function getExamAttempts(uid, examId = "mst-da-final") {
  if (!uid) return [];
  const snap = await getDocs(collection(db, "students", uid, "examAttempts"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((a) => a.examId === examId)
    .sort((a, b) => {
      // serverTimestamp() is null for a moment after a write, so fall back to
      // the seed rather than throwing the row to the bottom.
      const at = a.submittedAt?.seconds ?? 0;
      const bt = b.submittedAt?.seconds ?? 0;
      return bt - at;
    });
}

/**
 * The certificate this student holds, or null.
 *
 * Queries by uid rather than reading a known id, because the certificate
 * number is allocated by the server and the client never learns it except
 * from here or from the exam result. `list` is denied by the rules, so this
 * relies on the query being constrained to the caller's own uid — which is
 * exactly the condition the rule checks.
 */
export async function getCertificate(uid, courseSlug = "data-analysis") {
  if (!uid) return null;
  const q = query(
    collection(db, "certificates"),
    where("uid", "==", uid),
    where("courseId", "==", courseSlug),
    limit(1)
  );
  try {
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const doc0 = snap.docs[0];
    return { id: doc0.id, ...doc0.data() };
  } catch {
    // A rules rejection here means no certificate is readable, which is the
    // same outcome for the UI as not having one.
    return null;
  }
}

/** Remember where the learner is, so returning always resumes correctly. */
export async function savePosition(uid, courseSlug, position) {
  await setDoc(
    enrollmentRef(uid, courseSlug),
    { position, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/* ── XP, level, streak, badges ──────────────────────────────────────────── */

async function awardXp(uid, amount, counters = {}) {
  const ref = studentRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};

  const student = snap.data();
  const beforeLevel = getLevel(student.xp || 0).level;

  const updated = { ...student, xp: (student.xp || 0) + amount };
  for (const [key, delta] of Object.entries(counters)) {
    updated[key] = (student[key] || 0) + delta;
  }

  const streak = advanceStreak(student.streak, localDateKey());
  updated.streak = {
    current: streak.current,
    longest: streak.longest,
    lastActiveDate: streak.lastActiveDate,
    freezes: streak.freezes,
  };

  const earned = evaluateBadges({
    ...updated,
    longestStreak: streak.longest,
  });
  const newBadges = earned.filter((id) => !(student.badges || []).includes(id));
  updated.badges = earned;

  await setDoc(
    ref,
    {
      xp: updated.xp,
      badges: updated.badges,
      streak: updated.streak,
      ...Object.fromEntries(
        Object.keys(counters).map((k) => [k, updated[k]])
      ),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Keep the public board in step with the record that just changed. Awaited
  // rather than fired and forgotten, so a learner who opens the leaderboard
  // straight after finishing a lesson sees their new total, not the old one.
  await publishLeaderboardEntry(uid, { ...student, ...updated });

  const afterLevel = getLevel(updated.xp).level;

  return {
    newBadges,
    leveledUp: afterLevel > beforeLevel,
    newLevel: afterLevel > beforeLevel ? getLevel(updated.xp) : null,
    streakExtended: streak.current > (student.streak?.current || 0),
    streak: updated.streak,
  };
}

/* ── Derived ────────────────────────────────────────────────────────────── */

/** Percentage through the AUTHORED lessons of a course, never the planned ones. */
export function calculateProgress(courseSlug, completedLessons = []) {
  const lessons = getCourseLessons(courseSlug);
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}
