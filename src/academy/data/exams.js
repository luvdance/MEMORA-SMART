/**
 * PROFESSIONAL CERTIFICATION EXAMS
 *
 * Real, externally-awarded certifications that a learner can sit once they
 * have the skills a module teaches. These are NOT Memora exams and we do not
 * administer, score or resell them. They exist here for one reason: a learner
 * who can see the industry exam their current module is building toward has a
 * concrete target beyond "finish the course".
 *
 * ── ACCURACY RULES ───────────────────────────────────────────────────────
 * Every code, name and provider below was verified against the provider's own
 * documentation in September 2026. Exam codes get retired — MO-200 was the
 * Office 2019 Excel exam and is retired, replaced by MO-210 for Microsoft 365
 * Apps — so never copy a code from memory. Check the official page first.
 *
 * Deliberately NOT stored here: prices and durations that vary by country or
 * change without notice. We link to the official page instead of quoting a
 * figure that could be wrong for a learner in Lagos.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `readyAfter` is the module id a learner should have completed before the
 * exam is realistically within reach. The player uses it to decide when to
 * surface the card, so it never taunts someone on lesson one.
 */

export const EXAMS = [
  {
    id: "mo-210",
    preparedBy: ["m1-excel-essentials", "m1-formulas-functions", "m1-clean-structure"],
    code: "MO-210",
    name: "Microsoft Office Specialist: Excel Associate",
    provider: "Microsoft",
    edition: "Microsoft 365 Apps",
    level: "Associate",
    icon: "fas fa-table-cells",
    accent: "#217346",
    courseId: "data-analysis",
    readyAfter: "m1-clean-structure",
    summary:
      "The standard entry-level Excel certification. Performance-based: you are scored on doing real tasks in Excel, not on multiple choice.",
    validates: [
      "Managing worksheets and workbooks",
      "Working with cells and ranges",
      "Managing tables and table data",
      "Formulas and functions",
      "Charts",
    ],
    url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/mo-210/",
    note: "Replaces the retired MO-200, which covered Office 2019.",
  },
  {
    id: "mo-211",
    preparedBy: ["m1-formulas-functions", "m1-clean-structure", "m2-pivots", "m2-kpis-dashboards"],
    code: "MO-211",
    name: "Microsoft Office Specialist: Excel Expert",
    provider: "Microsoft",
    edition: "Microsoft 365 Apps",
    level: "Expert",
    icon: "fas fa-table-cells-large",
    accent: "#217346",
    courseId: "data-analysis",
    readyAfter: "m2-kpis-dashboards",
    summary:
      "The expert tier. Advanced formulas, data validation, pivot analysis and workbook management, for people who work in Excel every day.",
    validates: [
      "Advanced formulas and macros",
      "Advanced charts and tables",
      "Data validation and auditing",
      "Workbook options and settings",
    ],
    url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/mo-211/",
  },
  {
    id: "pl-300",
    preparedBy: ["m3-pbi-foundations", "m3-power-query", "m3-modelling", "m3-dax", "m3-visualisation"],
    code: "PL-300",
    name: "Microsoft Certified: Power BI Data Analyst Associate",
    provider: "Microsoft",
    level: "Associate",
    icon: "fas fa-chart-column",
    accent: "#b58a00",
    courseId: "data-analysis",
    readyAfter: "m3-visualisation",
    summary:
      "The recognised Power BI credential, and the one that appears most often in analyst job descriptions.",
    validates: [
      "Preparing data with Power Query",
      "Modelling data and relationships",
      "Writing DAX measures",
      "Visualising and analysing data",
      "Managing and securing workspaces",
    ],
    url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-300/",
  },
  {
    id: "pcep",
    preparedBy: ["m4-python-foundations"],
    code: "PCEP-30-02",
    name: "Certified Entry-Level Python Programmer",
    provider: "Python Institute",
    level: "Entry",
    icon: "fab fa-python",
    accent: "#2f66b3",
    courseId: "data-analysis",
    readyAfter: "m4-python-foundations",
    summary:
      "Proves you understand Python fundamentals. A sensible first proof for someone who learned to code inside a data course.",
    validates: [
      "Computer programming fundamentals",
      "Data types, variables and operators",
      "Conditions and loops",
      "Functions, lists, tuples and dictionaries",
    ],
    url: "https://pythoninstitute.org/pcep",
  },
  {
    id: "pcap",
    preparedBy: ["m4-python-foundations", "m4-pandas", "m4-transform", "m4-visual-analysis"],
    code: "PCAP-31-03",
    name: "Certified Associate in Python Programming",
    provider: "Python Institute",
    level: "Associate",
    icon: "fab fa-python",
    accent: "#2f66b3",
    courseId: "data-analysis",
    readyAfter: "m4-visual-analysis",
    summary:
      "The step above PCEP. Modules, packages, exceptions, file handling and object-oriented Python.",
    validates: [
      "Modules and packages",
      "Exception handling",
      "Strings and file processing",
      "Object-oriented programming",
    ],
    url: "https://pythoninstitute.org/pcap",
  },
];

/* ── Readiness ──────────────────────────────────────────────────────── */

export const READINESS_BANDS = [
  { id: "not-started", label: "Not started", min: 0 },
  { id: "building", label: "Building up", min: 20 },
  { id: "nearly", label: "Nearly ready", min: 60 },
  { id: "ready", label: "Ready to book", min: 85 },
];

/**
 * How prepared this learner is for one exam, from their real record.
 *
 * Two inputs, deliberately weighted:
 *   coverage (70%)  how much of the preparing material they have completed
 *   accuracy (30%)  how well they scored on it
 *
 * Coverage dominates because finishing the material is the thing that
 * actually prepares you. Accuracy stops someone scraping 70% through every
 * assessment and being told they are ready to pay for an exam.
 *
 * `moduleScores` maps moduleId to an average best-score percentage. Modules
 * with no attempts simply do not contribute to accuracy.
 */
export function getExamReadiness(exam, { completedModuleIds = [], moduleScores = {} } = {}) {
  const prep = exam.preparedBy || [];
  if (prep.length === 0) return null;

  const done = prep.filter((m) => completedModuleIds.includes(m));
  const coverage = done.length / prep.length;

  const scored = done.map((m) => moduleScores[m]).filter((n) => typeof n === "number");
  const accuracy = scored.length
    ? scored.reduce((a, b) => a + b, 0) / scored.length / 100
    : 0;

  // With nothing scored yet, judge on coverage alone rather than punishing
  // a learner for assessments they have not reached.
  let percent = Math.round(
    (scored.length ? coverage * 0.7 + accuracy * 0.3 : coverage) * 100
  );

  // Accuracy is a GATE, not just a weight. Weighting alone still rated someone
  // who scraped 70% through every assessment as "Ready to book", because full
  // coverage carried them. Nobody should be told to go and pay for a
  // certification on the strength of bare passes.
  const READY_MIN_SCORE = 80;
  const cappedByAccuracy =
    scored.length > 0 &&
    accuracy * 100 < READY_MIN_SCORE &&
    percent >= 85;

  if (cappedByAccuracy) percent = 84;

  const band = [...READINESS_BANDS].reverse().find((b) => percent >= b.min);

  return {
    percent,
    band: band.id,
    label: band.label,
    modulesDone: done.length,
    modulesTotal: prep.length,
    remaining: prep.filter((m) => !completedModuleIds.includes(m)),
    averageScore: scored.length
      ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
      : null,
    // Tells the UI to say "raise your scores", not "finish more modules"
    heldBackByScores: cappedByAccuracy,
  };
}

/** Every exam attached to a course, in the order the learner will reach them. */
export function getCourseExams(courseId) {
  return EXAMS.filter((exam) => exam.courseId === courseId);
}

/**
 * Which exam to surface right now.
 *
 * Returns the first exam whose `readyAfter` module the learner has NOT yet
 * finished, so the card always points at the next realistic target rather than
 * one already behind them or one four months away.
 */
export function getNextExam(courseId, completedModuleIds = []) {
  const exams = getCourseExams(courseId);
  return exams.find((exam) => !completedModuleIds.includes(exam.readyAfter)) || null;
}

/** The exam a specific module is building toward, if any. */
export function getExamForModule(moduleId) {
  return EXAMS.find((exam) => exam.readyAfter === moduleId) || null;
}
