/**
 * CERTIFICATION EXAMS — THE REGISTRY
 *
 * SERVER ONLY. Imports every bank, so it carries every answer key.
 *
 * One entry per certification exam, keyed by exam id. Each entry bundles what
 * the assembler and grader need: the blueprint (shape and pass rules), the
 * item bank, and any case studies and code preambles the items refer to.
 * Data Analysis was the first exam and the code was written around it, so it
 * remains the DEFAULT: every caller that does not name an exam gets it, and
 * nothing that existed before this registry changes behaviour.
 *
 * Adding an exam: write a blueprint and a bank under a folder of its own, add
 * an entry here, add the matching entry to src/academy/data/certification.js
 * (which the tests assert mirrors the blueprint), and nothing else.
 */

import DA_BLUEPRINT from "./blueprint.js";
import { ITEMS as DA_ITEMS } from "./bank/index.js";
import { CASES, CASE_SHEETS } from "./cases.js";
import { PY_SETUP } from "./pySetup.js";
import JS_BLUEPRINT from "./javascript/blueprint.js";
import { ITEMS as JS_ITEMS } from "./javascript/bank.js";
import FX_BLUEPRINT from "./forex/blueprint.js";
import { ITEMS as FX_ITEMS } from "./forex/bank.js";
import PY_BLUEPRINT from "./python/blueprint.js";
import { ITEMS as PY_ITEMS } from "./python/bank.js";
import CP_BLUEPRINT from "./cpp/blueprint.js";
import { ITEMS as CP_ITEMS } from "./cpp/bank.js";

export const DEFAULT_EXAM_ID = DA_BLUEPRINT.id;

export const EXAMS = {
  [DA_BLUEPRINT.id]: {
    blueprint: DA_BLUEPRINT,
    items: DA_ITEMS,
    cases: CASES,
    caseSheets: CASE_SHEETS,
    preambles: PY_SETUP,
  },
  [JS_BLUEPRINT.id]: {
    blueprint: JS_BLUEPRINT,
    items: JS_ITEMS,
    cases: {},
    caseSheets: {},
    preambles: {},
  },
  [FX_BLUEPRINT.id]: {
    blueprint: FX_BLUEPRINT,
    items: FX_ITEMS,
    cases: {},
    caseSheets: {},
    preambles: {},
  },
  [PY_BLUEPRINT.id]: {
    blueprint: PY_BLUEPRINT,
    items: PY_ITEMS,
    cases: {},
    caseSheets: {},
    preambles: {},
  },
  [CP_BLUEPRINT.id]: {
    blueprint: CP_BLUEPRINT,
    items: CP_ITEMS,
    cases: {},
    caseSheets: {},
    preambles: {},
  },
};

/** The exam with this id, or the default exam when no id is given. */
export function getExam(examId) {
  if (examId === undefined || examId === null || examId === "") return EXAMS[DEFAULT_EXAM_ID];
  return EXAMS[examId] || null;
}

/** The exam that certifies a course, or null. */
export function examForCourse(courseId) {
  return Object.values(EXAMS).find((e) => e.blueprint.courseId === courseId) || null;
}

/** Items on one paper, derived from the blueprint, never typed by hand. */
export function formSizeOf(blueprint) {
  return blueprint.domains.reduce((n, d) => n + d.items.core + d.items.advanced, 0);
}

export default EXAMS;
