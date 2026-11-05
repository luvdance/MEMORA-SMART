import LESSON_INDEX from "virtual:academy-lesson-index";
import { loadModule } from "virtual:academy-modules";
import { getCatalogEntry } from "./catalog.js";
import { authoredStats, orderCourseLessons, outlineCourse, resumeLesson } from "./lessons/build.js";

/**
 * THE BROWSER'S VIEW OF THE LESSONS
 *
 * lessons/index.js holds every lesson of every course: about 12 MB. Importing
 * it from a page put all of it in front of the first paint, so a learner on a
 * phone downloaded thirteen courses to open one lesson of one.
 *
 * This module splits that in two:
 *
 *   - An INDEX of every lesson (id, title, module, minutes, atom count).
 *     Course lists, dashboards, progress bars and the curriculum tree read
 *     only this, through the same synchronous API index.js has always had.
 *   - The full lessons of ONE MODULE, fetched on demand with loadLesson().
 *
 * Both come from the `academy-lessons` plugin in vite.config.js, which builds
 * them from index.js, so they cannot drift from what the graders read.
 *
 * Lessons returned by the synchronous functions are index entries: they have
 * `atomCount` and no `atoms`. Only loadLesson() returns content.
 */

const courseOf = (slug) => getCatalogEntry(slug)?.course || null;

/* ── The index: synchronous, same API as lessons/index.js ─────────────── */

const EMPTY = [];
const lessonCache = new Map();
const outlineCache = new Map();

function indexByModule(courseSlug) {
  const byModule = {};
  for (const lesson of LESSON_INDEX[courseSlug] || EMPTY) {
    (byModule[lesson.moduleId] ||= []).push(lesson);
  }
  return byModule;
}

// Memoised for the same reason as in index.js: a lesson in a dependency
// array must keep its identity between renders.
export function getCourseLessons(courseSlug) {
  if (lessonCache.has(courseSlug)) return lessonCache.get(courseSlug);
  const built = orderCourseLessons(courseOf(courseSlug), indexByModule(courseSlug));
  lessonCache.set(courseSlug, built);
  return built;
}

export function getCourseOutline(courseSlug) {
  if (outlineCache.has(courseSlug)) return outlineCache.get(courseSlug);
  const built = outlineCourse(courseOf(courseSlug), indexByModule(courseSlug));
  outlineCache.set(courseSlug, built);
  return built;
}

export function getResumeLesson(courseSlug, enrollment) {
  return resumeLesson(getCourseLessons(courseSlug), enrollment);
}

export function getLesson(courseSlug, lessonId) {
  return getCourseLessons(courseSlug).find((l) => l.id === lessonId) || null;
}

export function getFirstLesson(courseSlug) {
  return getCourseLessons(courseSlug)[0] || null;
}

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

export function getAuthoredStats(courseSlug) {
  return authoredStats(getCourseLessons(courseSlug));
}

/* ── Content: one module at a time, on demand ─────────────────────────── */

const pending = new Map(); // "slug/moduleId" -> Promise<void>
const full = new Map(); // "slug/lessonId" -> full lesson, once its module has loaded

function loadModuleOf(courseSlug, moduleId) {
  const key = `${courseSlug}/${moduleId}`;
  if (pending.has(key)) return pending.get(key);

  const promise = loadModule(courseSlug, moduleId)
    .then((raw) => {
      // The index entry already carries the curriculum's module and month
      // titles; laying the content over it gives exactly what index.js builds.
      const entries = new Map(getCourseLessons(courseSlug).map((l) => [l.id, l]));
      for (const lesson of raw) {
        const entry = entries.get(lesson.id);
        if (!entry) continue;
        const placed = { ...lesson, ...entry };
        delete placed.atomCount;
        full.set(`${courseSlug}/${lesson.id}`, placed);
      }
    })
    .catch((err) => {
      // Forget the failure so the next attempt (a retry button, the next
      // navigation) fetches again instead of replaying the rejection.
      pending.delete(key);
      throw err;
    });

  pending.set(key, promise);
  return promise;
}

/** One full lesson, or null if the course has no lesson with that id. */
export async function loadLesson(courseSlug, lessonId) {
  const entry = getLesson(courseSlug, lessonId);
  if (!entry) return null;
  await loadModuleOf(courseSlug, entry.moduleId);
  return full.get(`${courseSlug}/${lessonId}`) || null;
}

/**
 * A full lesson if its module is already in memory, else undefined. Lets the
 * player move to the next lesson in the same render, with no loading state.
 */
export function peekLesson(courseSlug, lessonId) {
  if (!getLesson(courseSlug, lessonId)) return null;
  return full.get(`${courseSlug}/${lessonId}`);
}

/**
 * Start downloading a lesson's module in the background, so it is already
 * there by the time the learner taps Resume or Next. Safe to call often.
 */
export function prefetchLesson(courseSlug, lessonId) {
  const entry = courseSlug && lessonId ? getLesson(courseSlug, lessonId) : null;
  if (!entry) return;
  loadModuleOf(courseSlug, entry.moduleId).catch(() => {});
}
