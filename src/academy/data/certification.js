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

  javascript: {
    examId: "mst-js-final",
    courseCode: "JS-101",
    path: "/academy/exam/javascript",
    title: "Memora Smart Certification — Object Oriented Programming (JavaScript)",
    subtitle: "Logic · JavaScript · OOP · Browser & React",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/javascript/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "js-w1-foundations",
      "js-w2-logic",
      "js-w3-intro",
      "js-w4-types",
      "js-w5-control",
      "js-w6-functions",
      "js-w7-arrays-strings",
      "js-w8-objects",
      "js-w9-scope-debugging",
      "js-w10-dom",
      "js-w11-events-storage",
      "js-w12-apis",
      "js-w13-advanced",
      "js-w14-tooling",
      "js-w15-react",
      "js-w16-capstone",
    ],
  },

  cpp: {
    examId: "mst-cp-final",
    courseCode: "CP-101",
    path: "/academy/exam/cpp",
    title: "Memora Smart Certification — C++ Programming",
    subtitle: "Foundations · Core skills · Memory & OOP · Advanced tools · Professional practice",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/cpp/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "cp-m1-intro",
      "cp-m2-variables",
      "cp-m3-operators",
      "cp-m4-control",
      "cp-m5-functions",
      "cp-m6-arrays",
      "cp-m7-strings",
      "cp-m8-pointers",
      "cp-m9-classes",
      "cp-m10-inheritance",
      "cp-m11-exceptions-files",
      "cp-m12-templates-stl",
      "cp-m13-dsa",
      "cp-m14-modern",
      "cp-m15-debugging",
      "cp-m16-capstone",
    ],
  },

  python: {
    examId: "mst-py-final",
    courseCode: "PY-101",
    path: "/academy/exam/python",
    title: "Memora Smart Certification — Python Programming",
    subtitle: "Foundations · Control · Data · Software · Engineering",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/python/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "pp-m1-foundations",
      "pp-m2-syntax-io",
      "pp-m3-variables",
      "pp-m4-operators",
      "pp-a1-score-calculator",
      "pp-m5-conditions",
      "pp-m6-loops",
      "pp-m7-functions",
      "pp-m8-strings",
      "pp-m9-collections",
      "pp-m10-iteration",
      "pp-a2-student-system",
      "pp-m11-files",
      "pp-m12-exceptions",
      "pp-m13-oop",
      "pp-m14-modules",
      "pp-m15-practices",
      "pp-a3-finance-tracker",
      "pp-m16-dsa",
      "pp-m17-testing",
      "pp-m18-databases",
      "pp-m19-apis",
      "pp-m20-automation",
    ],
  },

  "forex-trading": {
    examId: "mst-fx-final",
    courseCode: "FX-101",
    path: "/academy/exam/forex-trading",
    title: "Memora Smart Certification — Forex Trading",
    subtitle: "Mechanics · Risk mathematics · Analysis · Strategy · Governance",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/forex/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "fx-w1-intro",
      "fx-w2-mechanics",
      "fx-w3-risk-maths",
      "fx-c1-consolidation",
      "fx-w4-price-action",
      "fx-w5-technical",
      "fx-w6-fundamental",
      "fx-c2-consolidation",
      "fx-w7-timeframes",
      "fx-w8-strategy",
      "fx-w9-backtesting",
      "fx-c3-consolidation",
      "fx-w10-execution",
      "fx-w11-psychology",
      "fx-w12-governance",
      "fx-c4-consolidation",
      "fx-w13-lab-backtest",
      "fx-w14-lab-demo",
      "fx-w15-lab-review",
      "fx-w16-lab-final",
    ],
  },

  "web-development": {
    examId: "mst-wd-final",
    courseCode: "WD-101",
    path: "/academy/exam/web-development",
    title: "Memora Smart Certification — Responsive Web Development",
    subtitle: "HTML · CSS & Responsive Design · JavaScript · DOM & APIs · Professional Workflow",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/web/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "wd-m1-web",
      "wd-m2-environment",
      "wd-m3-html",
      "wd-m4-semantic",
      "wd-m5-forms-a11y",
      "wd-p1-projects",
      "wd-m6-css",
      "wd-m7-styling",
      "wd-m8-box-model",
      "wd-m9-layout",
      "wd-m10-responsive",
      "wd-m11-modern-css",
      "wd-m12-design",
      "wd-p2-projects",
      "wd-m13-programming",
      "wd-m14-conditions",
      "wd-m15-loops",
      "wd-m16-functions",
      "wd-m17-arrays-objects",
      "wd-m18-strings-errors",
      "wd-m19-problem-solving",
      "wd-p3-projects",
      "wd-m20-dom",
      "wd-m21-events",
      "wd-m22-validation",
      "wd-m23-storage",
      "wd-m24-async-apis",
      "wd-m25-modern-js",
      "wd-p4-projects",
      "wd-m26-git",
      "wd-m27-tooling",
      "wd-m28-quality",
      "wd-p5-projects",
      "wd-m29-deployment",
      "wd-m30-performance",
      "wd-m31-security",
      "wd-m32-portfolio",
      "wd-c-capstone",
    ],
  },

  "codebase-engineering": {
    examId: "mst-ce-final",
    courseCode: "CE-101",
    path: "/academy/exam/codebase-engineering",
    title: "Memora Smart Certification — Codebase Engineering",
    subtitle: "Understanding · Tracing & Git · AI Agents · Debugging · Maintaining",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/codebase/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "ce-m1-foundations",
      "ce-m2-terminal",
      "ce-m3-archaeology",
      "ce-m4-tracing",
      "ce-m5-git",
      "ce-m6-ai-agents",
      "ce-m7-debugging",
      "ce-m8-architecture",
      "ce-m9-production",
      "ce-m10-operations",
      "ce-c-capstone",
    ],
  },

  react: {
    examId: "mst-rx-final",
    courseCode: "WD-201",
    path: "/academy/exam/react",
    title: "Memora Smart Certification — React Development",
    subtitle: "Components · State & Hooks · Routing & Data · UI & TypeScript · Production",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/react/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "rx-m0-foundations",
      "rx-m1-intro",
      "rx-m2-components",
      "rx-m3-rendering",
      "rx-m4-state",
      "rx-m5-forms",
      "rx-m6-hooks",
      "rx-m7-architecture",
      "rx-m8-routing",
      "rx-m9-apis",
      "rx-m10-styling",
      "rx-m11-typescript",
      "rx-m12-auth",
      "rx-m13-testing",
      "rx-m14-performance",
      "rx-m15-deployment",
    ],
  },

  "mobile-development": {
    examId: "mst-md-final",
    courseCode: "MD-101",
    path: "/academy/exam/mobile-development",
    title: "Memora Smart Certification — Mobile App Development",
    subtitle: "Foundations · Interfaces · Architecture & data · Connected apps · Production & publishing",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/mobile/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "md-m1-intro",
      "md-m2-setup",
      "md-m3-javascript",
      "md-m4-modern-js",
      "md-m5-uiux",
      "md-m6-screens",
      "md-m7-react-native",
      "md-m8-polished-ui",
      "md-m9-navigation",
      "md-m10-architecture",
      "md-m11-state",
      "md-m12-forms-storage",
      "md-m13-networking",
      "md-m14-backend",
      "md-m15-auth",
      "md-m16-device",
      "md-m17-advanced",
      "md-m18-testing",
      "md-m19-security",
      "md-m20-release",
      "md-m21-capstone",
    ],
  },

  rdbms: {
    examId: "mst-db-final",
    courseCode: "DB-101",
    path: "/academy/exam/rdbms",
    title: "Memora Smart Certification — Relational Databases (RDBMS) & SQL",
    subtitle: "Foundations · Design · SQL · Advanced SQL · Engineering",
    questionCount: 30,
    durationMinutes: 75,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/rdbms/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "db-m1-foundations",
      "db-m2-setup",
      "db-m3-design",
      "db-m4-normalization",
      "db-m5-ddl",
      "db-m6-dml",
      "db-m7-querying",
      "db-m8-aggregation",
      "db-m9-joins",
      "db-m10-analytics",
      "db-m11-transactions",
      "db-m12-performance",
      "db-m13-programmability",
      "db-m14-operations",
      "db-m15-integration",
      "db-m16-capstone",
    ],
  },

  "backend-engineering": {
    examId: "mst-be-final",
    courseCode: "BE-101",
    path: "/academy/exam/backend-engineering",
    title: "Memora Smart Certification — Backend Engineering with Node.js",
    subtitle: "Foundations · APIs · Data · Security & quality · Production · Capstone",
    questionCount: 36,
    durationMinutes: 90,
    passMark: 70,
    domainMinimum: 50,
    /** Mirrors lib/academy/finalExam/backend/blueprint.js. Asserted by the tests. */
    requiresModules: [
      "be-w1-web",
      "be-w2-javascript",
      "be-w3-async-ts",
      "be-w4-tools",
      "be-w5-node",
      "be-w6-http-rest",
      "be-w7-express",
      "be-w8-api-design",
      "be-w9-relational",
      "be-w10-sql",
      "be-w11-node-postgres",
      "be-w12-db-performance",
      "be-w13-authentication",
      "be-w14-security",
      "be-w15-testing",
      "be-w16-reliability",
      "be-w17-architecture",
      "be-w18-advanced",
      "be-w19-devops",
      "be-w20-operations",
      "be-w21-system-design",
      "be-w22-implementation",
      "be-w23-hardening",
      "be-w24-defense",
    ],
  },

  /**
   * Cybersecurity has no exam yet. Deliberately absent rather than present
   * and empty: `examFor()` returning null is what produces the "unavailable"
   * state, and that state says so honestly instead of showing a learner a
   * locked exam that does not exist.
   *
   * Mathematics is absent for the same reason, and for one more that is
   * specific to it. `outstandingModules()` below deliberately EXCLUDES
   * modules whose lessons are not written yet, so that a learner is never
   * blocked by content that does not exist. That is right while a course is
   * being built and wrong for a certificate: with four of the thirty-two
   * maths modules written, an exam added today would unlock after Month 1 and
   * issue a certificate covering an eighth of the course.
   *
   * So the maths exam is added when the maths content is complete, not
   * before. Until then the profile says "no certification exam yet", which is
   * true, rather than offering one that would certify the wrong thing.
   *
   * Forex Trading's exam certifies KNOWLEDGE of markets and risk. Its
   * graduation standard remains the Week 16 practical assessment, judged on
   * risk calculations, records and rule adherence and never on profit; the
   * exam does not replace it and does not certify readiness to trade live.
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
