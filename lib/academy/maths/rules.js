/**
 * DRILL RULES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The numbers that decide how a maths drill behaves, in one place so they can
 * be argued with rather than hunted for.
 *
 * A drill is the maths course's equivalent of ExcelGrid's `exercise` or
 * PivotSim's `pivotExercise`: an atom-level practice that must be got right
 * before the lesson moves on. What makes the maths one different is that its
 * questions are GENERATED, so a wrong answer can be answered with another
 * question of the same kind rather than with the same question again.
 */
export const RULES = {
  /** Items in one drill, unless the lesson asks for a different number. */
  DRILL_ITEMS: 3,

  /** Items in a full practice set, by tier. Used by the module-level sets. */
  PRACTICE: { build: 10, stretch: 6, exam: 4 },

  /**
   * Rungs on the hint ladder. Three, and they must be a ladder: a nudge, then
   * the method, then the first worked step. One hint is a cliff — a student
   * who needs help gets either nothing useful or the answer.
   */
  HINTS_PER_ITEM: 3,

  /** A revision check: ten fresh items, eight right, no hints. */
  CHECK_ITEMS: 10,
  CHECK_NEEDED: 8,
  CHECK_SECONDS_PER_ITEM: 90,

  /**
   * Wrong answers on one item before the drill stops handing over another
   * whole problem and breaks this one into single steps instead. Two is not
   * arbitrary: one miss is a slip, two on freshly generated numbers is a
   * method that is not there.
   */
  MISSES_BEFORE_SCAFFOLD: 2,
};

export default RULES;
