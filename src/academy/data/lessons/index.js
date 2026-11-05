import DATA_ANALYSIS_COURSE from "../dataAnalysisCourse.js";
import CYBERSECURITY_COURSE from "../cybersecurityCourse.js";
import MATHEMATICS_COURSE from "../mathematicsCourse.js";
import JAVASCRIPT_COURSE from "../javascriptCourse.js";
import FOREX_COURSE from "../forexCourse.js";
import PYTHON_COURSE from "../pythonCourse.js";
import CPP_COURSE from "../cppCourse.js";
import WEB_DEVELOPMENT_COURSE from "../webDevelopmentCourse.js";
import CODEBASE_ENGINEERING_COURSE from "../codebaseEngineeringCourse.js";
import REACT_COURSE from "../reactCourse.js";
import MOBILE_DEVELOPMENT_COURSE from "../mobileDevelopmentCourse.js";
import RDBMS_COURSE from "../rdbmsCourse.js";
import BACKEND_ENGINEERING_COURSE from "../backendEngineeringCourse.js";
import { authoredStats, orderCourseLessons, outlineCourse, resumeLesson } from "./build.js";

// ── Data Analysis: one file per module, registered in da-registry.js ──────
import { DATA_ANALYSIS_LESSONS } from "./da-registry.js";

// ── Mathematics: one file per module, registered in ma-registry.js ──────────
import { MATHS_LESSONS } from "./ma-registry.js";

// ── Object Oriented Programming (JavaScript): one file per week ─────────────
import { JAVASCRIPT_LESSONS } from "./js-registry.js";

// ── Forex Trading: one file per week, registered in fx-registry.js ─────────
import { FOREX_LESSONS } from "./fx-registry.js";

// ── Python Programming: one file per module, registered in pp-registry.js ──
import { PYTHON_LESSONS } from "./pp-registry.js";

// ── C++ Programming: one file per module, registered in cp-registry.js ─────
import { CPP_LESSONS } from "./cp-registry.js";

// ── Responsive Web Development: one file per module, wd-registry.js ────────
import { WEB_DEVELOPMENT_LESSONS } from "./wd-registry.js";

// ── Codebase Engineering: one file per module, ce-registry.js ─────────────
import { CODEBASE_ENGINEERING_LESSONS } from "./ce-registry.js";

// ── React Development: one file per module, rx-registry.js ────────────────
import { REACT_LESSONS } from "./rx-registry.js";
import { MOBILE_DEVELOPMENT_LESSONS } from "./md-registry.js";

// ── Relational Databases (RDBMS) & SQL: one file per week, db-registry.js ──
import { RDBMS_LESSONS } from "./db-registry.js";

// ── Backend Engineering with Node.js: one file per week, be-registry.js ───
import { BACKEND_ENGINEERING_LESSONS } from "./be-registry.js";

// ── Cybersecurity: one file per week, registered in cs-registry.js ───────
import { CYBERSECURITY_LESSONS } from "./cs-registry.js";

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
  "data-analysis": DATA_ANALYSIS_LESSONS,

  mathematics: MATHS_LESSONS,

  javascript: JAVASCRIPT_LESSONS,

  "forex-trading": FOREX_LESSONS,

  python: PYTHON_LESSONS,

  cpp: CPP_LESSONS,

  "web-development": WEB_DEVELOPMENT_LESSONS,

  "codebase-engineering": CODEBASE_ENGINEERING_LESSONS,

  react: REACT_LESSONS,

  "mobile-development": MOBILE_DEVELOPMENT_LESSONS,

  rdbms: RDBMS_LESSONS,

  "backend-engineering": BACKEND_ENGINEERING_LESSONS,

  cybersecurity: CYBERSECURITY_LESSONS,
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
  [JAVASCRIPT_COURSE.slug]: JAVASCRIPT_COURSE,
  [FOREX_COURSE.slug]: FOREX_COURSE,
  [PYTHON_COURSE.slug]: PYTHON_COURSE,
  [CPP_COURSE.slug]: CPP_COURSE,
  [WEB_DEVELOPMENT_COURSE.slug]: WEB_DEVELOPMENT_COURSE,
  [CODEBASE_ENGINEERING_COURSE.slug]: CODEBASE_ENGINEERING_COURSE,
  [REACT_COURSE.slug]: REACT_COURSE,
  [MOBILE_DEVELOPMENT_COURSE.slug]: MOBILE_DEVELOPMENT_COURSE,
  [RDBMS_COURSE.slug]: RDBMS_COURSE,
  [BACKEND_ENGINEERING_COURSE.slug]: BACKEND_ENGINEERING_COURSE,
};

/** Every course with a curriculum, by slug. lessonIndex.js keeps a loader per entry. */
export const COURSE_SLUGS = Object.keys(CURRICULA);

/** One course's lessons grouped by module, exactly as authored. */
export function getModuleLessons(courseSlug) {
  return REGISTRY[courseSlug] || {};
}

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
  const built = orderCourseLessons(CURRICULA[courseSlug], REGISTRY[courseSlug]);
  lessonCache.set(courseSlug, built);
  return built;
}

/** Course outline with a `ready` flag per module — drives the curriculum tree. */
export function getCourseOutline(courseSlug) {
  if (outlineCache.has(courseSlug)) return outlineCache.get(courseSlug);
  const built = outlineCourse(CURRICULA[courseSlug], REGISTRY[courseSlug]);
  outlineCache.set(courseSlug, built);
  return built;
}

/** Where a learner should land when they resume a course. See build.js. */
export function getResumeLesson(courseSlug, enrollment) {
  return resumeLesson(getCourseLessons(courseSlug), enrollment);
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

/** Real, authored totals. See build.js. */
export function getAuthoredStats(courseSlug) {
  return authoredStats(getCourseLessons(courseSlug));
}
