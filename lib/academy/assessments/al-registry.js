/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS — REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One bank per module, merged into a single lessonId → assessment map for the
 * grader in lib/academy/grade.js.
 */

import { ASSESSMENTS as AL_M1 } from "./al-m1-intro.js";
import { ASSESSMENTS as AL_M2 } from "./al-m2-representation.js";
import { ASSESSMENTS as AL_M3 } from "./al-m3-analysis.js";
import { ASSESSMENTS as AL_M4 } from "./al-m4-time-complexity.js";
import { ASSESSMENTS as AL_M5 } from "./al-m5-notation.js";
import { ASSESSMENTS as AL_M6 } from "./al-m6-classes.js";
import { ASSESSMENTS as AL_M7 } from "./al-m7-space.js";
import { ASSESSMENTS as AL_M8 } from "./al-m8-data-structures.js";
import { ASSESSMENTS as AL_M9 } from "./al-m9-searching.js";
import { ASSESSMENTS as AL_M10 } from "./al-m10-sorting.js";
import { ASSESSMENTS as AL_M11 } from "./al-m11-recursion.js";
import { ASSESSMENTS as AL_M12 } from "./al-m12-divide-conquer.js";
import { ASSESSMENTS as AL_M13 } from "./al-m13-greedy.js";
import { ASSESSMENTS as AL_M14 } from "./al-m14-dynamic-programming.js";
import { ASSESSMENTS as AL_M15 } from "./al-m15-graphs.js";
import { ASSESSMENTS as AL_M16 } from "./al-m16-complexity.js";
import { ASSESSMENTS as AL_M17 } from "./al-m17-applications.js";
import { ASSESSMENTS as AL_M18 } from "./al-m18-capstone.js";

export const ALGORITHMS_ASSESSMENTS = {
  ...AL_M1,
  ...AL_M2,
  ...AL_M3,
  ...AL_M4,
  ...AL_M5,
  ...AL_M6,
  ...AL_M7,
  ...AL_M8,
  ...AL_M9,
  ...AL_M10,
  ...AL_M11,
  ...AL_M12,
  ...AL_M13,
  ...AL_M14,
  ...AL_M15,
  ...AL_M16,
  ...AL_M17,
  ...AL_M18,
};

export default ALGORITHMS_ASSESSMENTS;
