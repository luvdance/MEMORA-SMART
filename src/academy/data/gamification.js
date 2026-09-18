/**
 * GAMIFICATION MODEL
 *
 * Three rules this follows, each a deliberate correction of something the big
 * platforms get wrong:
 *
 *   1. XP is awarded for VERIFIED MASTERY, never for time spent. You cannot
 *      earn a single point by leaving a tab open.
 *   2. Level names are the course's own levels — Novice through Professional.
 *      The gamification IS the pedagogy, not a layer bolted on top, so
 *      reaching "Professional" means what the course promised it means.
 *   3. Failure is never punished. Retrying costs nothing; only the first-try
 *      bonus is missed. One badge exists specifically to reward coming back
 *      after failing, because persistence is what actually produces graduates.
 */

export const XP = {
  ATOM_COMPLETED: 10,
  LESSON_COMPLETED: 50,
  ASSESSMENT_PASSED: 40,
  FIRST_TRY_BONUS: 25,
  PERFECT_SCORE_BONUS: 15,
  MODULE_COMPLETED: 200,
};

/**
 * THE XP BUDGET — what a full course is actually worth.
 *
 * Level thresholds have to be calibrated against this, and the first version
 * of this file was not: the ladder topped out at 2,600 XP when the authored
 * Data Analysis course yields about 13,980. "Professional" therefore arrived
 * about a fifth of the way in and stayed for the remaining 80%, so a learner
 * 17% through the course was told they were a professional. That is worse
 * than no level at all — it devalues every level below it and makes the
 * platform's central claim untrue.
 *
 * The figure below is the TYPICAL full-course total: every atom, every lesson
 * passed first time, without assuming a perfect score on every assessment.
 *
 *   363 atoms  × 10                        =  3,630
 *    90 lessons × (50 complete + 40 pass)  =  8,100
 *    90 first-try bonuses × 25             =  2,250
 *                                             ───────
 *                                             13,980
 *
 * `npm run test:academy` recomputes this from the real curriculum and fails
 * if the top level drifts outside a sane band of it — so adding a month of
 * content can never silently re-break the ladder.
 */
export const COURSE_XP_BUDGET = 13980;

/**
 * Level thresholds, as a share of a full course.
 *
 * Hardcoded rather than computed at runtime, deliberately: if thresholds moved
 * with the curriculum, publishing a new module would DEMOTE every existing
 * learner. A level, once earned, has to stay earned. The percentages are
 * recorded beside each one so a recalibration is arithmetic, not guesswork.
 *
 * The curve is front-loaded — the first three levels arrive inside the first
 * few lessons, which is when a new learner decides whether to come back — and
 * back-loaded at the top, so "Professional" means the course is nearly done.
 */
export const LEVELS = [
  { level: 1, name: "Novice", minXp: 0, share: 0 },
  { level: 2, name: "Foundation", minXp: 210, share: 0.015 },
  { level: 3, name: "Beginner", minXp: 700, share: 0.05 },
  { level: 4, name: "Intermediate", minXp: 2516, share: 0.18 },
  { level: 5, name: "Advanced", minXp: 6291, share: 0.45 },
  { level: 6, name: "Professional", minXp: 11184, share: 0.8 },
];

export function getLevel(xp = 0) {
  let current = LEVELS[0];
  for (const level of LEVELS) if (xp >= level.minXp) current = level;

  const next = LEVELS.find((l) => l.minXp > xp) || null;
  const span = next ? next.minXp - current.minXp : 0;
  const into = xp - current.minXp;

  return {
    ...current,
    next,
    xpIntoLevel: into,
    xpForNextLevel: next ? next.minXp - xp : 0,
    percentToNext: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
  };
}

/**
 * The XP a course's authored content can actually yield, computed from the
 * curriculum rather than assumed.
 *
 * Used by the test suite to check the level ladder is still calibrated, and
 * available to the UI if it ever wants to show "level 4 of 6, about a fifth
 * of the way through". Takes the lessons rather than importing them, so this
 * module stays free of content dependencies.
 *
 * @param {Array<{atoms: Array}>} lessons
 */
export function courseXpBudget(lessons = []) {
  const atoms = lessons.reduce((n, l) => n + (l.atoms?.length || 0), 0);
  return {
    atoms,
    lessons: lessons.length,
    atomXp: atoms * XP.ATOM_COMPLETED,
    lessonXp: lessons.length * (XP.LESSON_COMPLETED + XP.ASSESSMENT_PASSED),
    firstTryXp: lessons.length * XP.FIRST_TRY_BONUS,
    perfectXp: lessons.length * XP.PERFECT_SCORE_BONUS,
    /** What a diligent learner who passes everything first time ends on. */
    get typical() {
      return this.atomXp + this.lessonXp + this.firstTryXp;
    },
    /** The ceiling, with a perfect score on every assessment too. */
    get maximum() {
      return this.typical + this.perfectXp;
    },
  };
}

/**
 * Badges. Each is a real milestone — nothing is awarded for logging in.
 * `check` receives the student's aggregate record and returns true once earned.
 */
export const BADGES = [
  {
    id: "first-atom",
    name: "First Step",
    description: "Completed your first learning atom.",
    icon: "fas fa-shoe-prints",
    check: (s) => s.atomsCompleted >= 1,
  },
  {
    id: "first-lesson",
    name: "Lesson One",
    description: "Finished a full lesson and passed its assessment.",
    icon: "fas fa-flag-checkered",
    check: (s) => s.lessonsCompleted >= 1,
  },
  {
    id: "perfect-pass",
    name: "Perfect Pass",
    description: "Scored 100% on an assessment.",
    icon: "fas fa-bullseye",
    check: (s) => s.perfectScores >= 1,
  },
  {
    id: "comeback",
    name: "Comeback",
    description: "Passed an assessment after failing it twice. The one that counts.",
    icon: "fas fa-rotate-left",
    check: (s) => s.comebacks >= 1,
  },
  {
    id: "five-lessons",
    name: "Getting Serious",
    description: "Completed five lessons.",
    icon: "fas fa-layer-group",
    check: (s) => s.lessonsCompleted >= 5,
  },
  {
    id: "module-done",
    name: "Module Master",
    description: "Completed every lesson in a module.",
    icon: "fas fa-cubes",
    check: (s) => s.modulesCompleted >= 1,
  },
  {
    id: "streak-7",
    name: "Seven Days",
    description: "Learned something on seven consecutive days.",
    icon: "fas fa-fire",
    check: (s) => (s.longestStreak || 0) >= 7,
  },
  {
    id: "streak-30",
    name: "Thirty Days",
    description: "A full month without breaking the chain.",
    icon: "fas fa-fire-flame-curved",
    check: (s) => (s.longestStreak || 0) >= 30,
  },
];

export function evaluateBadges(stats) {
  return BADGES.filter((badge) => {
    try {
      return badge.check(stats);
    } catch {
      return false;
    }
  }).map((b) => b.id);
}

/** Local calendar date (not UTC) — a streak must follow the learner's own day. */
export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(aKey, bKey) {
  const a = new Date(`${aKey}T00:00:00`);
  const b = new Date(`${bKey}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

/**
 * Advance a streak for activity today.
 *
 * A missed day does not reset to zero if a freeze is available — one freeze is
 * earned every 7 consecutive days, up to 2 held. Missing a day after a long
 * run is the single most common moment people quit a learning platform, and
 * an unforgiving counter is what converts one bad day into giving up entirely.
 */
export function advanceStreak(streak = {}, today = localDateKey()) {
  const { current = 0, longest = 0, lastActiveDate = null, freezes = 0 } = streak;

  if (lastActiveDate === today) return { current, longest, lastActiveDate, freezes };

  const gap = lastActiveDate ? daysBetween(lastActiveDate, today) : null;

  let next = 1;
  let nextFreezes = freezes;
  let usedFreeze = false;

  if (gap === 1) {
    next = current + 1;
  } else if (gap !== null && gap > 1) {
    const missed = gap - 1;
    if (freezes >= missed) {
      next = current + 1;
      nextFreezes = freezes - missed;
      usedFreeze = true;
    } else {
      next = 1;
      nextFreezes = 0;
    }
  }

  // Earn a freeze every seventh day, capped at two
  if (next > 0 && next % 7 === 0 && nextFreezes < 2) nextFreezes += 1;

  return {
    current: next,
    longest: Math.max(longest, next),
    lastActiveDate: today,
    freezes: nextFreezes,
    usedFreeze,
  };
}
