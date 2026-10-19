/**
 * ASSESSMENTS · C++ PROGRAMMING — REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One bank per module, merged into a single lessonId → assessment map for the
 * grader in lib/academy/grade.js.
 */

import { ASSESSMENTS as CP_M1 } from "./cp-m1-intro.js";
import { ASSESSMENTS as CP_M2 } from "./cp-m2-variables.js";
import { ASSESSMENTS as CP_M3 } from "./cp-m3-operators.js";
import { ASSESSMENTS as CP_M4 } from "./cp-m4-control.js";
import { ASSESSMENTS as CP_M5 } from "./cp-m5-functions.js";
import { ASSESSMENTS as CP_M6 } from "./cp-m6-arrays.js";
import { ASSESSMENTS as CP_M7 } from "./cp-m7-strings.js";
import { ASSESSMENTS as CP_M8 } from "./cp-m8-pointers.js";
import { ASSESSMENTS as CP_M9 } from "./cp-m9-classes.js";
import { ASSESSMENTS as CP_M10 } from "./cp-m10-inheritance.js";
import { ASSESSMENTS as CP_M11 } from "./cp-m11-exceptions-files.js";
import { ASSESSMENTS as CP_M12 } from "./cp-m12-templates-stl.js";
import { ASSESSMENTS as CP_M13 } from "./cp-m13-dsa.js";
import { ASSESSMENTS as CP_M14 } from "./cp-m14-modern.js";
import { ASSESSMENTS as CP_M15 } from "./cp-m15-debugging.js";
import { ASSESSMENTS as CP_M16 } from "./cp-m16-capstone.js";

export const CPP_ASSESSMENTS = {
  ...CP_M1,
  ...CP_M2,
  ...CP_M3,
  ...CP_M4,
  ...CP_M5,
  ...CP_M6,
  ...CP_M7,
  ...CP_M8,
  ...CP_M9,
  ...CP_M10,
  ...CP_M11,
  ...CP_M12,
  ...CP_M13,
  ...CP_M14,
  ...CP_M15,
  ...CP_M16,
};

export default CPP_ASSESSMENTS;
