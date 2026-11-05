import { prefetchLesson } from "../data/lessonIndex";

/**
 * Warm the lesson a learner is about to resume.
 *
 * Called from the screens with a Resume button. Once the page is idle it
 * downloads the lesson player's code and that lesson's module, so the tap on
 * Resume opens the lesson straight away instead of starting two downloads.
 * Skipped when the browser reports Data Saver or a 2G connection: there the
 * learner's data matters more than the saved second.
 */
export function prefetchResume(courseSlug, lessonId) {
  if (!courseSlug || !lessonId) return;
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;

  const run = () => {
    import("../pages/LessonPlayer").catch(() => {});
    prefetchLesson(courseSlug, lessonId);
  };
  if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1200);
}
