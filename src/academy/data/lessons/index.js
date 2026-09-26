import DATA_ANALYSIS_COURSE from "../dataAnalysisCourse.js";
import CYBERSECURITY_COURSE from "../cybersecurityCourse.js";
import MATHEMATICS_COURSE from "../mathematicsCourse.js";
import { LESSONS as FOUNDATIONS } from "./m1-data-foundations.js";
import { LESSONS as EXCEL_SETUP } from "./m1-excel-setup.js";
import { LESSONS as EXCEL_ESSENTIALS } from "./m1-excel-essentials.js";
import { LESSONS as FORMULAS } from "./m1-formulas-functions.js";
import { LESSONS as FORMULAS_2 } from "./m1-formulas-part2.js";
import { LESSONS as CLEANING } from "./m1-clean-structure.js";
import { LESSONS as EXPLORATORY } from "./m2-exploratory.js";
import { LESSONS as PIVOTS } from "./m2-pivots.js";
import { LESSONS as DASHBOARDS } from "./m2-kpis-dashboards.js";
import { LESSONS as PROJECT } from "./m2-project-sales.js";
import { LESSONS as PBI_FOUNDATIONS } from "./m3-pbi-foundations.js";
import { LESSONS as POWER_QUERY } from "./m3-power-query.js";
import { LESSONS as MODELLING } from "./m3-modelling.js";
import { LESSONS as DAX } from "./m3-dax.js";
import { LESSONS as VISUALISATION } from "./m3-visualisation.js";
import { LESSONS as PYTHON_SETUP } from "./m4-python-setup.js";
import { LESSONS as PY_FOUNDATIONS } from "./m4-python-foundations.js";
import { LESSONS as PANDAS } from "./m4-pandas.js";
import { LESSONS as TRANSFORM } from "./m4-transform.js";
import { LESSONS as VISUAL_ANALYSIS } from "./m4-visual-analysis.js";
import { LESSONS as CAPSTONE } from "./m4-capstone.js";

// ── Mathematics, one file per module ──────────────────────────────────────
import { LESSONS as MA_M1_WELCOME } from "./ma-m1-welcome.js";
import { LESSONS as MA_M1_LANGUAGE } from "./ma-m1-language.js";
import { LESSONS as MA_M1_NUMBERS } from "./ma-m1-numbers.js";
import { LESSONS as MA_M1_PLACE_VALUE } from "./ma-m1-place-value.js";
import { LESSONS as MA_M2_OPERATIONS } from "./ma-m2-operations.js";
import { LESSONS as MA_M2_PROPERTIES } from "./ma-m2-properties.js";
import { LESSONS as MA_M2_NEGATIVES } from "./ma-m2-negatives.js";
import { LESSONS as MA_M2_FACTORS } from "./ma-m2-factors.js";
import { LESSONS as MA_M3_FRACTIONS } from "./ma-m3-fractions.js";
import { LESSONS as MA_M3_DECIMALS } from "./ma-m3-decimals.js";
import { LESSONS as MA_M3_PERCENTAGES } from "./ma-m3-percentages.js";
import { LESSONS as MA_M3_APPROXIMATION } from "./ma-m3-approximation.js";
import { LESSONS as MA_M4_RATIO } from "./ma-m4-ratio.js";
import { LESSONS as MA_M4_MEASUREMENT } from "./ma-m4-measurement.js";
import { LESSONS as MA_M4_PATTERNS } from "./ma-m4-patterns.js";
import { LESSONS as MA_M4_ALGEBRA1 } from "./ma-m4-algebra1.js";

// ── Cybersecurity, one file per week ──────────────────────────────────────
import { LESSONS as CS_W1 } from "./cs-w1-fundamentals.js";
import { LESSONS as CS_W2 } from "./cs-w2-accounts.js";
import { LESSONS as CS_W3 } from "./cs-w3-data.js";
import { LESSONS as CS_W4 } from "./cs-w4-networking.js";
import { LESSONS as CS_W5 } from "./cs-w5-hardening.js";
import { LESSONS as CS_W6 } from "./cs-w6-networks.js";
import { LESSONS as CS_W7 } from "./cs-w7-software.js";
import { LESSONS as CS_W8 } from "./cs-w8-web.js";
import { LESSONS as CS_W9 } from "./cs-w9-ethical-hacking.js";
import { LESSONS as CS_W10 } from "./cs-w10-vulnerabilities.js";
import { LESSONS as CS_W11 } from "./cs-w11-soc.js";
import { LESSONS as CS_W12 } from "./cs-w12-incident-response.js";
import { LESSONS as CS_W13 } from "./cs-w13-privacy-grc.js";
import { LESSONS as CS_W14 } from "./cs-w14-cloud.js";
import { LESSONS as CS_W15 } from "./cs-w15-capstone.js";
import { LESSONS as CS_W16 } from "./cs-w16-career.js";

/**
 * LESSON REGISTRY
 *
 * Each course's curriculum file lists every module that will exist. This
 * registry lists the modules whose lessons are actually WRITTEN. The two are
 * deliberately separate, so the UI can always tell a learner the truth:
 * "this module is ready" versus "this module is still being written".
 *
 * Adding content = import the file and add one entry. Nothing else changes.
 */

const REGISTRY = {
  "data-analysis": {
    "m1-data-foundations": FOUNDATIONS,
    "m1-clean-structure": CLEANING,
    // Three files, one module: the setup lesson, the essentials, and the
    // formats lesson that lives with the formula content. Merged and
    // re-sorted by `order` below, with setup at order 1.
    "m1-excel-essentials": [...EXCEL_SETUP, ...EXCEL_ESSENTIALS, ...FORMULAS_2.filter(
      (l) => l.moduleId === "m1-excel-essentials"
    )],
    // Two files, one module. Merged and re-sorted by `order` below.
    "m1-formulas-functions": [...FORMULAS, ...FORMULAS_2.filter(
      (l) => l.moduleId === "m1-formulas-functions"
    )],
    "m2-exploratory": EXPLORATORY,
    "m2-pivots": PIVOTS,
    "m2-kpis-dashboards": DASHBOARDS,
    "m2-project-sales": PROJECT,
    "m3-pbi-foundations": PBI_FOUNDATIONS,
    "m3-power-query": POWER_QUERY,
    "m3-modelling": MODELLING,
    "m3-dax": DAX,
    "m3-visualisation": VISUALISATION,
    // Setup first, then the language. See m4-python-setup.js for why.
    "m4-python-foundations": [...PYTHON_SETUP, ...PY_FOUNDATIONS],
    "m4-pandas": PANDAS,
    "m4-transform": TRANSFORM,
    "m4-visual-analysis": VISUAL_ANALYSIS,
    "m4-capstone": CAPSTONE,
  },

  mathematics: {
    "ma-m1-welcome": MA_M1_WELCOME,
    "ma-m1-language": MA_M1_LANGUAGE,
    "ma-m1-numbers": MA_M1_NUMBERS,
    "ma-m1-place-value": MA_M1_PLACE_VALUE,
    "ma-m2-operations": MA_M2_OPERATIONS,
    "ma-m2-properties": MA_M2_PROPERTIES,
    "ma-m2-negatives": MA_M2_NEGATIVES,
    "ma-m2-factors": MA_M2_FACTORS,
    "ma-m3-fractions": MA_M3_FRACTIONS,
    "ma-m3-decimals": MA_M3_DECIMALS,
    "ma-m3-percentages": MA_M3_PERCENTAGES,
    "ma-m3-approximation": MA_M3_APPROXIMATION,
    "ma-m4-ratio": MA_M4_RATIO,
    "ma-m4-measurement": MA_M4_MEASUREMENT,
    "ma-m4-patterns": MA_M4_PATTERNS,
    "ma-m4-algebra1": MA_M4_ALGEBRA1,
  },

  cybersecurity: {
    "cs-w1-fundamentals": CS_W1,
    "cs-w2-accounts": CS_W2,
    "cs-w3-data": CS_W3,
    "cs-w4-networking": CS_W4,
    "cs-w5-hardening": CS_W5,
    "cs-w6-networks": CS_W6,
    "cs-w7-software": CS_W7,
    "cs-w8-web": CS_W8,
    "cs-w9-ethical-hacking": CS_W9,
    "cs-w10-vulnerabilities": CS_W10,
    "cs-w11-soc": CS_W11,
    "cs-w12-incident-response": CS_W12,
    "cs-w13-privacy-grc": CS_W13,
    "cs-w14-cloud": CS_W14,
    "cs-w15-capstone": CS_W15,
    "cs-w16-career": CS_W16,
  },
};

/**
 * Curricula, by slug.
 *
 * This used to be a single hardcoded reference to the Data Analysis course, so
 * every helper below silently returned nothing for any other slug — a second
 * course could be added to the catalog and its lessons would not load, with no
 * error anywhere to say why. Adding a course now means adding one line here
 * and one block above.
 */
const CURRICULA = {
  [DATA_ANALYSIS_COURSE.slug]: DATA_ANALYSIS_COURSE,
  [CYBERSECURITY_COURSE.slug]: CYBERSECURITY_COURSE,
  [MATHEMATICS_COURSE.slug]: MATHEMATICS_COURSE,
};

/**
 * Course content is static for the life of the page, so both lookups are
 * memoised. This is not only an optimisation: without it every call returned
 * freshly-spread objects, so a lesson placed in a React dependency array had a
 * new identity on every render and re-triggered its effect forever.
 */
const lessonCache = new Map();
const outlineCache = new Map();

/** Every written lesson for a course, in teaching order. */
export function getCourseLessons(courseSlug) {
  if (lessonCache.has(courseSlug)) return lessonCache.get(courseSlug);
  const built = buildCourseLessons(courseSlug);
  lessonCache.set(courseSlug, built);
  return built;
}

function buildCourseLessons(courseSlug) {
  const course = CURRICULA[courseSlug] || null;
  if (!course) return [];

  const byModule = REGISTRY[courseSlug] || {};
  const ordered = [];

  // Walk the curriculum so lesson order always follows the course outline,
  // never the order files happened to be imported in.
  for (const month of course.months) {
    for (const module of month.modules) {
      const lessons = byModule[module.id];
      if (!lessons) continue;
      for (const lesson of [...lessons].sort((a, b) => a.order - b.order)) {
        ordered.push({
          ...lesson,
          moduleId: module.id,
          moduleTitle: module.title,
          month: month.month,
          monthTitle: month.title,
        });
      }
    }
  }

  return ordered;
}

/** Course outline with a `ready` flag per module — drives the curriculum tree. */
export function getCourseOutline(courseSlug) {
  if (outlineCache.has(courseSlug)) return outlineCache.get(courseSlug);
  const built = buildCourseOutline(courseSlug);
  outlineCache.set(courseSlug, built);
  return built;
}

function buildCourseOutline(courseSlug) {
  const course = CURRICULA[courseSlug] || null;
  if (!course) return [];

  const byModule = REGISTRY[courseSlug] || {};

  return course.months.map((month) => ({
    month: month.month,
    title: month.title,
    modules: month.modules.map((module) => {
      const lessons = (byModule[module.id] || [])
        .slice()
        .sort((a, b) => a.order - b.order);
      return {
        id: module.id,
        title: module.title,
        summary: module.summary,
        type: module.type,
        ready: lessons.length > 0,
        plannedAtoms: module.atoms,
        lessons: lessons.map((l) => ({
          id: l.id,
          title: l.title,
          subtitle: l.subtitle,
          atomCount: l.atoms.length,
          estimatedMinutes: l.estimatedMinutes,
        })),
      };
    }),
  }));
}

/**
 * Where a learner should land when they resume a course.
 *
 * Prefers the saved position, falls back to the first lesson they have not
 * completed, and finally to lesson one. Shared by the Continue card and the
 * Resume buttons so the two can never disagree about where "resume" goes.
 */
export function getResumeLesson(courseSlug, enrollment) {
  const lessons = getCourseLessons(courseSlug);
  if (!lessons.length) return null;

  const completed = enrollment?.completedLessons || [];
  const savedId = enrollment?.position?.lessonId;

  if (savedId && !completed.includes(savedId)) {
    const saved = lessons.find((l) => l.id === savedId);
    if (saved) return saved;
  }

  return lessons.find((l) => !completed.includes(l.id)) || null;
}

export function getLesson(courseSlug, lessonId) {
  return getCourseLessons(courseSlug).find((l) => l.id === lessonId) || null;
}

export function getFirstLesson(courseSlug) {
  return getCourseLessons(courseSlug)[0] || null;
}

/** The lesson after this one, or null at the end of written content. */
export function getNextLesson(courseSlug, lessonId) {
  const lessons = getCourseLessons(courseSlug);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index === -1 || index === lessons.length - 1) return null;
  return lessons[index + 1];
}

export function getPreviousLesson(courseSlug, lessonId) {
  const lessons = getCourseLessons(courseSlug);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index <= 0) return null;
  return lessons[index - 1];
}

/**
 * Real, authored totals — as opposed to the planning estimates in the
 * curriculum. Progress percentages are calculated against these, so a learner
 * is never told they are "12% through" a course that does not exist yet.
 */
export function getAuthoredStats(courseSlug) {
  const lessons = getCourseLessons(courseSlug);
  return {
    lessons: lessons.length,
    atoms: lessons.reduce((n, l) => n + l.atoms.length, 0),
    minutes: lessons.reduce((n, l) => n + (l.estimatedMinutes || 0), 0),
    modules: new Set(lessons.map((l) => l.moduleId)).size,
  };
}
