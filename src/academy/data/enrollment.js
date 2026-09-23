/**
 * THE ACADEMY ENTITY MODEL
 *
 * Pure. No Firebase, no React. Everything here is a shape or a decision about
 * shapes, so it can be reasoned about and unit-tested on its own.
 *
 * ── THE MODEL ────────────────────────────────────────────────────────────
 *
 *   Student ──1:N──> Enrollment <──N:1── Course
 *                        │
 *                        ├──1:N──> LessonProgress
 *                        └──0:1──> Certificate
 *
 *   STUDENT      One per person, for life. Created ONCE at sign-up.
 *                Holds identity (memoraId), profile, and the gamification
 *                aggregates that span every course.
 *                  students/{uid}
 *
 *   COURSE       Static catalogue data, not a stored record. Identified by a
 *                slug (the URL) and a CODE (the silent id — see below).
 *
 *   ENROLLMENT   The join. One per (student, course). This is what makes a
 *                student "on a course", and a student may hold as many as
 *                they like, simultaneously and independently.
 *                  students/{uid}/enrollments/{courseId}
 *
 *   PROGRESS     Belongs to an enrolment, one row per lesson.
 *                  students/{uid}/progress/{courseId__lessonId}
 *
 *   CERTIFICATE  Belongs to an enrolment. Awarded FOR THAT COURSE, carrying
 *                that course's silent id, so a student with three enrolments
 *                can hold three separate certificates that can never be
 *                confused with one another.
 *                  certificates/{certId}   { uid, courseId, courseCode, ... }
 *
 * ── WHAT THIS SEPARATION FIXES ───────────────────────────────────────────
 * Signing up and enrolling were previously one action: enroll() created the
 * student record as a side effect. That had three consequences.
 *
 *   1. A person who signed up and browsed without enrolling had no student
 *      record and no Memora ID, so they were not a student until they
 *      committed to a course.
 *   2. The identity step ("issuing your Memora ID") ran again on every
 *      enrolment, and the welcome screen said so, which is untrue the second
 *      time and confusing.
 *   3. There was no single place that owned "what is a student", so profile,
 *      identity and course commitment all leaked into one screen.
 *
 * Sign-up now creates the Student exactly once. Enrolment creates an
 * Enrollment and asserts the Student already exists. They are separate
 * operations against separate entities, which is what they always were.
 *
 * ── THE SILENT COURSE ID ─────────────────────────────────────────────────
 * Every course carries a CODE: DA-101, CS-101. It is deliberately never shown
 * to a learner, because a course code is an internal handle and asking a
 * student to read one is asking them to do the system's filing.
 *
 * It is stamped on every enrolment and every certificate because it is
 * PERMANENT in a way nothing else is. A title can be reworded and a slug can
 * be changed for SEO; a code, once a learner has enrolled under it, never
 * moves. So support can identify an enrolment, a certificate can name the
 * course it certifies, and an export can join them, without depending on any
 * string a marketing decision might alter.
 *
 * `enrollmentRef()` composes the two permanent ids — the student's and the
 * course's — into the one reference that identifies a specific enrolment for
 * the life of the Academy.
 */

/** Milliseconds from a Firestore Timestamp, its plain form, a Date or null. */
export function toMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (typeof value.seconds === "number") return value.seconds * 1000;
  return 0;
}

/**
 * The permanent reference for one enrolment: "MS-2026-000123/CS-101".
 *
 * Both halves are ids that never change, so this string identifies a specific
 * person on a specific course forever. Used on certificates and in support,
 * never shown in the product.
 */
export function enrollmentRef(memoraId, courseCode) {
  if (!memoraId || !courseCode) return null;
  return `${memoraId}/${courseCode}`;
}

/**
 * When the learner last did anything on this enrolment.
 *
 * Falls back to the enrolment date so a course someone signed up for and has
 * not opened still orders sensibly against one they finished last year.
 */
export function lastActiveAt(enrollment) {
  return toMs(enrollment?.updatedAt) || toMs(enrollment?.enrolledAt);
}

/** Most recently touched first. The order a returning learner expects. */
export function sortByRecency(enrollments = []) {
  return [...enrollments].sort((a, b) => lastActiveAt(b) - lastActiveAt(a));
}

/** How far through a course, as a whole percent of its authored lessons. */
export function progressOf(lessons, completedLessons = []) {
  if (!lessons?.length) return 0;
  const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}

/**
 * Every enrolment a learner can actually resume, richest first.
 *
 * Drops enrolments whose course is no longer open, because a button into a
 * player that cannot serve the course is worse than no button. Everything the
 * UI needs to render a row is computed here, so no component has to know how
 * progress is derived.
 *
 * The curriculum helpers are injected rather than imported, so this module
 * stays free of content dependencies and runs under Node in the test suite.
 */
export function listEnrollments(
  enrollments,
  { getCatalogEntry, getCourseLessons, getResumeLesson }
) {
  return sortByRecency(enrollments || [])
    .map((enrollment) => {
      const entry = getCatalogEntry(enrollment.courseId);
      if (!entry || entry.status !== "open") return null;

      const lessons = getCourseLessons(enrollment.courseId);
      const completed = enrollment.completedLessons || [];
      const lesson = getResumeLesson(enrollment.courseId, enrollment);

      return {
        slug: enrollment.courseId,
        // The silent id, carried through so a certificate or a support query
        // can name the course without depending on its title.
        courseCode: enrollment.courseCode || entry.code || null,
        title: entry.title,
        subtitle: entry.subtitle || null,
        icon: entry.icon || null,
        percent: progressOf(lessons, completed),
        completedCount: completed.length,
        totalLessons: lessons.length,
        finished: lesson === null,
        lesson: lesson ? { id: lesson.id, title: lesson.title } : null,
        // A finished course has no resume target, so it points at the course
        // overview for review rather than at a lesson that does not exist.
        href: lesson
          ? `/academy/learn/${enrollment.courseId}/${lesson.id}`
          : "/academy/learn",
        lastActiveAt: lastActiveAt(enrollment),
        // A course enrolled on but never opened. Worth distinguishing: the
        // right word for it is "Start", not "Continue".
        started: completed.length > 0 || Boolean(enrollment.position?.lessonId),
      };
    })
    .filter(Boolean);
}

/**
 * The one course to put in front of a returning learner, or null.
 *
 * Most recent, not first. Ordering by enrolment date would send somebody back
 * to a course they abandoned months ago; ordering by document id — which is
 * what reading the raw collection gives you — sends them to whichever course
 * slug happens to sort first, which is not a decision anybody made.
 */
export function pickResumable(enrollments, helpers) {
  return listEnrollments(enrollments, helpers)[0] || null;
}
