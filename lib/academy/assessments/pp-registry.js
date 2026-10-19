/**
 * ASSESSMENTS · PYTHON PROGRAMMING — REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One bank per module, merged into a single lessonId → assessment map for the
 * grader in lib/academy/grade.js.
 */

import { ASSESSMENTS as PP_M1 } from "./pp-m1-foundations.js";
import { ASSESSMENTS as PP_M2 } from "./pp-m2-syntax-io.js";
import { ASSESSMENTS as PP_M3 } from "./pp-m3-variables.js";
import { ASSESSMENTS as PP_M4 } from "./pp-m4-operators.js";
import { ASSESSMENTS as PP_A1 } from "./pp-a1-score-calculator.js";
import { ASSESSMENTS as PP_M5 } from "./pp-m5-conditions.js";
import { ASSESSMENTS as PP_M6 } from "./pp-m6-loops.js";
import { ASSESSMENTS as PP_M7 } from "./pp-m7-functions.js";
import { ASSESSMENTS as PP_M8 } from "./pp-m8-strings.js";
import { ASSESSMENTS as PP_M9 } from "./pp-m9-collections.js";
import { ASSESSMENTS as PP_M10 } from "./pp-m10-iteration.js";
import { ASSESSMENTS as PP_A2 } from "./pp-a2-student-system.js";
import { ASSESSMENTS as PP_M11 } from "./pp-m11-files.js";
import { ASSESSMENTS as PP_M12 } from "./pp-m12-exceptions.js";
import { ASSESSMENTS as PP_M13 } from "./pp-m13-oop.js";
import { ASSESSMENTS as PP_M14 } from "./pp-m14-modules.js";
import { ASSESSMENTS as PP_M15 } from "./pp-m15-practices.js";
import { ASSESSMENTS as PP_A3 } from "./pp-a3-finance-tracker.js";
import { ASSESSMENTS as PP_M16 } from "./pp-m16-dsa.js";
import { ASSESSMENTS as PP_M17 } from "./pp-m17-testing.js";
import { ASSESSMENTS as PP_M18 } from "./pp-m18-databases.js";
import { ASSESSMENTS as PP_M19 } from "./pp-m19-apis.js";
import { ASSESSMENTS as PP_M20 } from "./pp-m20-automation.js";

export const PYTHON_ASSESSMENTS = {
  ...PP_M1,
  ...PP_M2,
  ...PP_M3,
  ...PP_M4,
  ...PP_A1,
  ...PP_M5,
  ...PP_M6,
  ...PP_M7,
  ...PP_M8,
  ...PP_M9,
  ...PP_M10,
  ...PP_A2,
  ...PP_M11,
  ...PP_M12,
  ...PP_M13,
  ...PP_M14,
  ...PP_M15,
  ...PP_A3,
  ...PP_M16,
  ...PP_M17,
  ...PP_M18,
  ...PP_M19,
  ...PP_M20,
};

export default PYTHON_ASSESSMENTS;
