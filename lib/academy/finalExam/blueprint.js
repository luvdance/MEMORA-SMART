/**
 * FINAL CERTIFICATION EXAM — TEST SPECIFICATION ("the blueprint")
 *
 * This file is the exam's constitution. It says how many items come from each
 * domain, at what difficulty, and what counts as a pass. Everything else —
 * which specific items a candidate sees, in what order, with options in what
 * arrangement — is randomised per candidate.
 *
 * WHY A BLUEPRINT RATHER THAN A SHUFFLE
 * If you simply shuffle a bank and deal 32 items, two candidates can sit
 * measurably different exams: one draws nine Python items and two on cleaning,
 * the other the reverse. Their scores are then not comparable, and a
 * certificate that means different things for different holders is worthless.
 *
 * A blueprint fixes the SHAPE of the exam and randomises only the CONTENT, so
 * every form covers the same ground at the same difficulty while no two
 * candidates answer the same set of questions. That is how professional
 * certification works, and it is the only way the certificate can mean one
 * thing.
 *
 * TWO PASS CONDITIONS, DELIBERATELY
 * A candidate must clear the overall mark AND a floor in every single domain.
 * Without the floor, someone could ace Excel and Power BI, answer nothing
 * correctly in Python, and still pass at 70% overall — then hold a
 * certificate that claims they can do all three.
 *
 * TUNING: changing `items` for a domain changes the exam length. The validator
 * proves the bank can still supply every domain-and-tier slot with a healthy
 * margin, so a bad edit fails the build rather than the candidate.
 */

/** Difficulty 3-4 is "core"; 5 is "advanced". Two tiers keeps the bank
 *  requirement per cell honest and the difficulty balance provable. */
export const TIERS = ["core", "advanced"];

export const DOMAINS = [
  {
    id: "d1-quality",
    name: "Data quality and preparation",
    short: "Data quality",
    /** Items on this form, by tier. Total is the sum. */
    items: { core: 4, advanced: 2 },
    covers: [
      "Profiling a dataset before analysing it",
      "Missing values, blanks and zero",
      "Duplicates and keyless rows",
      "Text that looks numeric, and numbers stored as text",
      "Reconciling a breakdown against its total",
    ],
    /** Modules a candidate should revisit after failing this domain. */
    review: ["m1-data-foundations", "m1-clean-structure", "m2-exploratory"],
  },
  {
    id: "d2-excel",
    name: "Excel analysis and reporting",
    short: "Excel",
    items: { core: 5, advanced: 2 },
    covers: [
      "Conditional aggregation with SUMIFS, COUNTIFS and AVERAGEIFS",
      "Absolute and relative references when filling",
      "Pivot tables and aggregation",
      "KPI definition and target comparison",
      "Choosing the statistic the question needs",
    ],
    review: ["m1-formulas-functions", "m2-pivots", "m2-kpis-dashboards"],
  },
  {
    id: "d3-powerbi",
    name: "Power BI: preparation, modelling and DAX",
    short: "Power BI",
    items: { core: 5, advanced: 2 },
    covers: [
      "Power Query steps and refreshable recipes",
      "Star schema, fact and dimension tables",
      "Cardinality, filter direction and orphan keys",
      "Measures against calculated columns",
      "Filter context, CALCULATE and ALL",
    ],
    review: ["m3-power-query", "m3-modelling", "m3-dax"],
  },
  {
    id: "d4-python",
    name: "Python analysis and statistics",
    short: "Python",
    items: { core: 5, advanced: 2 },
    covers: [
      "Reading pandas code and predicting its output",
      "GroupBy, aggregation and merging",
      "Mean against median, and distribution shape",
      "Outlier rules and when to apply them",
      "Correlation, and what it does not license",
    ],
    review: ["m4-python-foundations", "m4-pandas", "m4-transform", "m4-visual-analysis"],
  },
  {
    id: "d5-judgement",
    name: "Interpretation and communication",
    short: "Judgement",
    items: { core: 3, advanced: 2 },
    covers: [
      "Choosing a chart that answers the question asked",
      "Axis honesty and visual distortion",
      "Sample size, and what a small n cannot support",
      "Separating correlation from cause",
      "Writing a defensible recommendation",
    ],
    review: ["m2-kpis-dashboards", "m3-visualisation", "m4-visual-analysis", "m4-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-da-final",
  version: "2026.1",
  /**
   * WHICH COURSE THIS EXAM CERTIFIES.
   *
   * `courseId` must match the catalog entry's id (src/academy/data/catalog.js)
   * and the enrollment's courseId, because the certificate is looked up by it
   * and a mismatch would either hide a real certificate or attach it to the
   * wrong course. The test suite asserts the two agree.
   *
   * When a second course gets an exam, this file becomes one entry in a map
   * keyed by courseId rather than a single blueprint — the assembler and
   * grader already take everything they need from this object, so that change
   * stays contained.
   */
  courseId: "data-analysis",
  courseTitle: "Data Analysis",
  title: "Memora Smart Certification — Data Analysis",
  subtitle: "Excel · Power BI · Python",

  /** Every domain must be completed before the exam unlocks. */
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

  domains: DOMAINS,

  /** Overall mark needed to pass. */
  passMark: 70,
  /**
   * And a floor in every domain. Set deliberately below the overall mark: the
   * point is to stop a total gap in one skill, not to fail someone for a
   * weaker area they are otherwise carrying.
   */
  domainMinimum: 50,

  durationMinutes: 90,
  /** Unlimited, but each attempt re-randomises, so nothing can be memorised. */
  attemptLimit: null,
  /** How many distinct company cases a form should draw on. */
  caseRange: { min: 2, max: 4 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Data Analysis — Beginner to Professional",
    covers: "Microsoft Excel • Power BI • Python",
    idFormat: "MST-CERT-2026-000001",
  },
};

/** Total items on any form — derived, never hand-typed. */
export const FORM_SIZE = DOMAINS.reduce(
  (n, d) => n + d.items.core + d.items.advanced,
  0
);

/** Difficulty values that belong to each tier. */
export const TIER_DIFFICULTY = { core: [3, 4], advanced: [5] };

/**
 * How many items the bank should hold per domain-and-tier slot, as a multiple
 * of what one form consumes. Below this the validator complains: a pool only
 * slightly larger than the form produces near-identical exams for everyone.
 */
export const MIN_POOL_MULTIPLE = 2;

export default BLUEPRINT;
