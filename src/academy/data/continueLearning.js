/**
 * WHERE A RETURNING LEARNER SHOULD GO
 *
 * The landing page used to greet an enrolled learner exactly as it greets a
 * stranger: "Browse the courses" and "Enroll now" at the top, and the only
 * way back to their course was a button at the very bottom of a long page.
 * Someone forty lessons in had to scroll past the whole sales pitch, or dig
 * through the nav, to carry on. This decides what to offer them instead.
 *
 * Pure — the curriculum helpers are passed in rather than imported alongside
 * Firebase — so it runs under Node against the real course in the self-test.
 */

/** Milliseconds from a Firestore Timestamp, its plain form, a Date or null. */
function toMs(v) {
  if (!v) return 0;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v;
  if (typeof v.seconds === "number") return v.seconds * 1000;
  return 0;
}

/**
 * The same arithmetic as calculateProgress() in academyService, which cannot
 * be imported here because that module loads the Firebase client.
 */
export function progressOf(lessons, completedLessons = []) {
  if (!lessons?.length) return 0;
  const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}

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
 * Returns { slug, title, percent, finished, lesson, href, otherCount }.
 */
export function pickContinue(
  enrollments,
  { getCatalogEntry, getCourseLessons, getResumeLesson }
) {
  const candidates = (enrollments || [])
    .map((e) => ({ e, entry: getCatalogEntry(e.courseId) }))
    .filter(({ entry }) => entry && entry.status === "open")
    .sort(
      (a, b) =>
        toMs(b.e.updatedAt || b.e.enrolledAt) - toMs(a.e.updatedAt || a.e.enrolledAt)
    );

  if (candidates.length === 0) return null;

  const { e, entry } = candidates[0];
  const lessons = getCourseLessons(e.courseId);
  const percent = progressOf(lessons, e.completedLessons || []);
  const lesson = getResumeLesson(e.courseId, e);
  const finished = lesson === null;

  return {
    slug: e.courseId,
    title: entry.title,
    percent,
    finished,
    lesson: lesson ? { id: lesson.id, title: lesson.title } : null,
    // A finished course has no resume target, so it goes to the course
    // overview for review rather than to a lesson that does not exist.
    href: lesson ? `/academy/learn/${e.courseId}/${lesson.id}` : "/academy/learn",
    otherCount: candidates.length - 1,
  };
}

export default { pickContinue, progressOf };
