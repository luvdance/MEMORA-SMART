/**
 * CLARITY LAYER — COURSES IT KNOWS ABOUT
 *
 * One entry per course the clarity layer can read. `enforced: true` means
 * `npm run clarity:lint -- <course>` exits non-zero on any error, so the
 * course cannot be called finished while it has one. A course that has not
 * been cleaned up yet stays `enforced: false`: it is reported, not blocked.
 *
 * Every NEW course is added here with `enforced: true` from its first module.
 *
 * To add a course, give:
 *   name      shown in reports
 *   language  LanguageTool code; the academy writes British English (en-GB)
 *   modules   async () => [{ id, lessons, lessonFile, assessFile, assessments }]
 *             in teaching order, written modules only
 *   check     the course's own fast check, run after fixes are applied
 */
import { existsSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url);
const has = (rel) => existsSync(new URL(rel, ROOT));

/** Modules of a course whose lesson files follow src/academy/data/lessons/<id>.js. */
async function standardModules(moduleIds) {
  const out = [];
  for (const id of moduleIds) {
    const lessonFile = `src/academy/data/lessons/${id}.js`;
    if (!has(lessonFile)) continue;
    const assessFile = `lib/academy/assessments/${id}.js`;
    const { LESSONS } = await import(new URL(lessonFile, ROOT));
    const assessments = has(assessFile) ? (await import(new URL(assessFile, ROOT))).ASSESSMENTS || {} : {};
    out.push({ id, lessons: LESSONS, lessonFile, assessFile: has(assessFile) ? assessFile : null, assessments });
  }
  return out;
}

export const COURSES = {
  cw: {
    name: "Content Writing (CW-101)",
    language: "en-GB",
    enforced: true,
    check: "scripts/cwCheck.mjs",
    async modules() {
      const { CONTENT_WRITING_MODULE_IDS } = await import(new URL("src/academy/data/contentWritingCourse.js", ROOT));
      return standardModules(CONTENT_WRITING_MODULE_IDS);
    },
  },
};

export function courseOf(key) {
  const course = COURSES[key];
  if (!course) {
    console.error(`Unknown course "${key}". Known: ${Object.keys(COURSES).join(", ")}`);
    process.exit(2);
  }
  return { key, ...course };
}

export { ROOT };
