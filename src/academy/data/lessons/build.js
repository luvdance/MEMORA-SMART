/**
 * HOW A COURSE'S LESSONS ARE ASSEMBLED
 *
 * Pure functions over (curriculum, lessons-by-module). Two callers share them
 * so they can never disagree about order or totals:
 *
 *   index.js        the full registry, every course in memory. Node tools, the
 *                   graders and the self-tests read this.
 *   lessonIndex.js  the browser. It holds a light index of every course and
 *                   loads one course's full lessons only when a lesson opens.
 *
 * A lesson here may be a full lesson (with `atoms`) or an index entry (with
 * `atomCount` and no atoms). Everything below works on either.
 */

const atomCountOf = (lesson) => lesson.atomCount ?? lesson.atoms.length;

/** Every written lesson for a course, in teaching order. */
export function orderCourseLessons(course, byModule) {
  if (!course) return [];
  const ordered = [];

  // Walk the curriculum so lesson order always follows the course outline,
  // never the order files happened to be imported in.
  for (const month of course.months) {
    for (const module of month.modules) {
      const lessons = byModule?.[module.id];
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
export function outlineCourse(course, byModule) {
  if (!course) return [];

  return course.months.map((month) => ({
    month: month.month,
    title: month.title,
    modules: month.modules.map((module) => {
      const lessons = (byModule?.[module.id] || [])
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
          atomCount: atomCountOf(l),
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
export function resumeLesson(lessons, enrollment) {
  if (!lessons.length) return null;

  const completed = enrollment?.completedLessons || [];
  const savedId = enrollment?.position?.lessonId;

  if (savedId && !completed.includes(savedId)) {
    const saved = lessons.find((l) => l.id === savedId);
    if (saved) return saved;
  }

  return lessons.find((l) => !completed.includes(l.id)) || null;
}

/**
 * Real, authored totals — as opposed to the planning estimates in the
 * curriculum. Progress percentages are calculated against these, so a learner
 * is never told they are "12% through" a course that does not exist yet.
 */
export function authoredStats(lessons) {
  return {
    lessons: lessons.length,
    atoms: lessons.reduce((n, l) => n + atomCountOf(l), 0),
    minutes: lessons.reduce((n, l) => n + (l.estimatedMinutes || 0), 0),
    modules: new Set(lessons.map((l) => l.moduleId)).size,
  };
}

/**
 * The light index entry for a lesson: everything the course lists, dashboards
 * and progress bars read, none of the content. Twelve megabytes of lessons
 * become a few hundred kilobytes of this.
 *
 * Module and month titles are left out: orderCourseLessons() puts them back
 * from the curriculum, so the index does not repeat them on every lesson.
 */
export function indexEntry(lesson) {
  return {
    id: lesson.id,
    moduleId: lesson.moduleId,
    order: lesson.order,
    title: lesson.title,
    subtitle: lesson.subtitle,
    estimatedMinutes: lesson.estimatedMinutes,
    atomCount: atomCountOf(lesson),
  };
}
