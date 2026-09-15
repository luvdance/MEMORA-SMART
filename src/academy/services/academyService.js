import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
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

/**
 * ACADEMY DATA LAYER
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TRUST BOUNDARY — read this before extending anything here.
 *
 * Assessment ANSWERS are safe: they live in lib/ and are graded by
 * /api/academy/assessment, so they never reach the browser.
 *
 * Assessment RESULTS are written here, by the client, because the project has
 * no Firebase service-account credentials configured (no FIREBASE_CLIENT_EMAIL
 * or FIREBASE_PRIVATE_KEY in Vercel). Security rules constrain the shape of
 * these writes and make Memora IDs genuinely unique, but they cannot verify
 * that a score is honest. A determined user could write themselves a pass.
 *
 * That is acceptable while the platform is in preview. It is NOT acceptable
 * once certificates are issued. The fix is contained: add the service account,
 * move recordAssessment() and awardXp() into the API route that already grades
 * the attempt, and flip the rules for students/{uid} back to `write: if false`.
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
