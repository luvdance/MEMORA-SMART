/**
 * CERTIFICATION — WHAT A LEARNER IS ACTUALLY ENTITLED TO, AND WHEN
 *
 * Pure. No Firebase, no React, no imports from lib/. Everything here is a
 * decision about state, so it can be unit-tested against the real curriculum.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────
 * The profile used to show one line for every learner on every course:
 *
 *     Not yet issued
 *     A certificate is issued when you pass the final certification exam.
 *
 * "Not yet issued" is ambiguous in the worst way. It reads equally as "you
 * have not earned this yet", "the exam exists and you have not sat it", and
 * "we have not built this yet" — and for a Cybersecurity learner the last one
 * was actually true, because no exam exists for that course. One sentence was
 * doing the work of four different situations and telling the truth in none
 * of them.
 *
 * So certification is now an explicit state machine with four outcomes, and
 * each one says exactly what it means and what to do next:
 *
 *   certified     A server-issued certificate exists. Show it.
 *   ready         The course is finished. The exam is unlocked, sit it now.
 *   locked        The exam exists and the course is not finished. Says what
 *                 is outstanding, by name, and how much is left.
 *   unavailable   This course has no certification exam yet. Said plainly,
 *                 with no implication that the learner is missing something.
 *
 * ── THE LOCK ─────────────────────────────────────────────────────────────
 * The exam was previously advisory: a candidate who had finished nothing
 * could open it and was merely warned. That was a deliberate choice, on the
 * grounds that somebody already working in data might reasonably want to sit
 * it. It is now a real lock, because a certificate that can be attempted
 * before the course means the certificate does not certify the course.
 *
 * ── MIRRORING THE BLUEPRINT ──────────────────────────────────────────────
 * `requiresModules` below duplicates lib/academy/finalExam/blueprint.js. That
 * duplication is on purpose: the blueprint sits beside the question bank and
 * the grader, none of which may ever reach the browser, so the client gets
 * its own copy of the one field it needs rather than an import that would
 * drag the exam's internals into the bundle.
 *
 * `npm run test:academy` asserts the two lists are identical, so they cannot
 * drift. Change the blueprint and the test fails until this is updated.
 */

export const CERTIFICATION = {
  "data-analysis": {
    examId: "mst-da-final",
    courseCode: "DA-101",
    path: "/academy/exam",
    title: "Memora Smart Certification — Data Analysis",
    subtitle: "Excel · Power BI · Python",
    questionCount: 32,
    durationMinutes: 90,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors BLUEPRINT.requiresModules. Asserted identical by the tests. */
    requiresModules: [
      "m1-data-foundations",
      "m1-excel-essentials",
      "m1-formulas-functions",
      "m1-clean-structure",
      "m2-exploratory",
      "m2-pivots",
      "m2-kpis-dashboards",
      "m2-project-sales",
      "m3-pbi-foundations",
      "m3-power-query",
      "m3-modelling",
      "m3-dax",
      "m3-visualisation",
      "m4-python-foundations",
      "m4-pandas",
      "m4-transform",
      "m4-visual-analysis",
      "m4-capstone",
    ],
  },

  /**
   * Cybersecurity has no exam yet. Deliberately absent rather than present
   * and empty: `examFor()` returning null is what produces the "unavailable"
   * state, and that state says so honestly instead of showing a learner a
   * locked exam that does not exist.
   */
};

/** The certification exam for a course, or null if it has none yet. */
export function examFor(courseId) {
  return CERTIFICATION[courseId] || null;
}

/**
 * Has this lesson been passed?
 *
 * ONE definition, used everywhere. The exam page had its own, which read
 * `p.assessmentPassed || p.completed` — neither of which is a field any
 * progress document has ever carried. recordAssessment writes the result
 * nested under `assessment`, so that check was always false, the outstanding
 * list was always every module, and every candidate was told they had
 * finished nothing regardless of what they had done.
 */
export function lessonPassed(progressDoc) {
  return progressDoc?.assessment?.passed === true;
}

/**
 * Which required modules are not finished, by title.
 *
 * A module counts as finished when every WRITTEN lesson in it has been
 * passed. Modules with no lessons written yet cannot be finished and are
 * excluded, so a learner is never blocked by content that does not exist.
 */
export function outstandingModules(outline, progressByLesson, required = []) {
  const wanted = new Set(required);
  return (outline || [])
    .flatMap((month) => month.modules)
    .filter(
      (module) =>
        wanted.has(module.id) &&
        module.lessons.length > 0 &&
        !module.lessons.every((lesson) => lessonPassed(progressByLesson?.[lesson.id]))
    )
    .map((module) => module.title);
}

/**
 * The full certification picture for one enrolment.
 *
 * @param {object}   arg
 * @param {string}   arg.courseId
 * @param {object?}  arg.certificate       the server-issued document, or null
 * @param {Array}    arg.outline           getCourseOutline(courseId)
 * @param {object}   arg.progressByLesson  lessonId -> progress document
 * @returns {{ state, exam, certificate, outstanding, requiredCount, doneCount, percent }}
 */
export function certificationState({
  courseId,
  certificate = null,
  outline = [],
  progressByLesson = {},
}) {
  const exam = examFor(courseId);

  // A certificate outranks everything. It exists or it does not, and once it
  // does, nothing about progress can take it away.
  if (certificate) {
    return {
      state: "certified",
      exam,
      certificate,
      outstanding: [],
      requiredCount: 0,
      doneCount: 0,
      percent: 100,
    };
  }

  if (!exam) {
    return {
      state: "unavailable",
      exam: null,
      certificate: null,
      outstanding: [],
      requiredCount: 0,
      doneCount: 0,
      percent: 0,
    };
  }

  const outstanding = outstandingModules(outline, progressByLesson, exam.requiresModules);

  // Count only required modules that actually have lessons written, so the
  // denominator matches what a learner can currently finish.
  const requiredCount = (outline || [])
    .flatMap((month) => month.modules)
    .filter((m) => exam.requiresModules.includes(m.id) && m.lessons.length > 0).length;

  const doneCount = requiredCount - outstanding.length;

  return {
    state: outstanding.length === 0 && requiredCount > 0 ? "ready" : "locked",
    exam,
    certificate: null,
    outstanding,
    requiredCount,
    doneCount,
    percent: requiredCount ? Math.round((doneCount / requiredCount) * 100) : 0,
  };
}

/** Headline copy per state. Kept here so every surface says the same thing. */
export const CERTIFICATION_COPY = {
  certified: {
    label: "Certified",
    heading: "You are certified",
  },
  ready: {
    label: "Exam unlocked",
    heading: "You are ready to sit the certification exam",
  },
  locked: {
    label: "Locked",
    heading: "The certification exam unlocks when you finish the course",
  },
  unavailable: {
    label: "Not open yet",
    heading: "Certification for this course is not open yet",
  },
};
