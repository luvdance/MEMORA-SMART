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
 * Level thresholds. The curve widens so early levels arrive quickly — the
 * first three are reachable inside one sitting, which is when a new learner
 * decides whether to come back.
 */
export const LEVELS = [
  { level: 1, name: "Novice", minXp: 0 },
  { level: 2, name: "Foundation", minXp: 120 },
  { level: 3, name: "Beginner", minXp: 320 },
  { level: 4, name: "Intermediate", minXp: 700 },
  { level: 5, name: "Advanced", minXp: 1400 },
  { level: 6, name: "Professional", minXp: 2600 },
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
