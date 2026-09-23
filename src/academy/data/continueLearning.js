/**
 * WHERE A RETURNING LEARNER SHOULD GO
 *
 * The landing page used to greet an enrolled learner exactly as it greets a
 * stranger: "Browse the courses" and "Enroll now" at the top, and the only
 * way back to their course was a button at the very bottom of a long page.
 * Someone forty lessons in had to scroll past the whole sales pitch, or dig
 * through the nav, to carry on. This decides what to offer them instead.
 *
 * ── NOW A THIN LAYER ─────────────────────────────────────────────────────
 * The selection logic moved to data/enrollment.js, which owns the entity
 * model. It lived here first because there was only ever one course to pick
 * from; with several open courses, "which enrolment" is a question about the
 * Student-to-Enrollment relationship rather than about this one banner, and
 * two copies of that answer would drift.
 *
 * This module stays because its callers are stable and its name says what the
 * landing page wants. It re-exports rather than reimplements.
 */

export {
  progressOf,
  listEnrollments,
  sortByRecency,
  toMs,
} from "./enrollment.js";

import { pickResumable, listEnrollments } from "./enrollment.js";

/**
 * The course to put in front of a returning learner, or null.
 *
 * MOST RECENT, NOT FIRST. With more than one course, the one they touched
 * last is the one they are most likely to want — ordering by enrolment would
 * send someone back to a course they abandoned months ago.
 *
 * Only courses that are OPEN. An enrolment in a course that has since been
 * paused must not produce a button into a player that cannot serve it.
 *
 * `otherCount` is kept for callers that only render one card. Components that
 * can show the learner every course they have started should call
 * `listEnrollments` instead and offer the choice.
 */
export function pickContinue(enrollments, helpers) {
  const all = listEnrollments(enrollments, helpers);
  const first = pickResumable(enrollments, helpers);
  if (!first) return null;

  return { ...first, otherCount: all.length - 1 };
}

export default { pickContinue, listEnrollments };
