/**
 * ASSESSMENTS · MACHINE LEARNING AND ARTIFICIAL INTELLIGENCE — REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One bank per module, merged into a single lessonId → assessment map for the
 * grader in lib/academy/grade.js.
 */

import { ASSESSMENTS as ML_M1 } from "./ml-m1-intro.js";
import { ASSESSMENTS as ML_M2 } from "./ml-m2-python.js";
import { ASSESSMENTS as ML_M3 } from "./ml-m3-maths.js";
import { ASSESSMENTS as ML_M4 } from "./ml-m4-numpy.js";
import { ASSESSMENTS as ML_M5 } from "./ml-m5-pandas.js";
import { ASSESSMENTS as ML_M6 } from "./ml-m6-eda.js";
import { ASSESSMENTS as ML_M7 } from "./ml-m7-visualization.js";
import { ASSESSMENTS as ML_M8 } from "./ml-m8-preprocessing.js";
import { ASSESSMENTS as ML_M9 } from "./ml-m9-models.js";
import { ASSESSMENTS as ML_M10 } from "./ml-m10-regression.js";
import { ASSESSMENTS as ML_M11 } from "./ml-m11-classification.js";
import { ASSESSMENTS as ML_M12 } from "./ml-m12-unsupervised.js";
import { ASSESSMENTS as ML_M13 } from "./ml-m13-model-selection.js";
import { ASSESSMENTS as ML_M14 } from "./ml-m14-neural-networks.js";
import { ASSESSMENTS as ML_M15 } from "./ml-m15-deep-learning.js";
import { ASSESSMENTS as ML_M16 } from "./ml-m16-cnn.js";
import { ASSESSMENTS as ML_M17 } from "./ml-m17-rnn.js";
import { ASSESSMENTS as ML_M18 } from "./ml-m18-nlp.js";
import { ASSESSMENTS as ML_M19 } from "./ml-m19-deployment.js";
import { ASSESSMENTS as ML_M20 } from "./ml-m20-app-development.js";
import { ASSESSMENTS as ML_M21 } from "./ml-m21-mlops.js";
import { ASSESSMENTS as ML_M22 } from "./ml-m22-responsible.js";
import { ASSESSMENTS as ML_M23 } from "./ml-m23-applications.js";
import { ASSESSMENTS as ML_M24 } from "./ml-m24-capstone.js";

export const MACHINE_LEARNING_ASSESSMENTS = {
  ...ML_M1,
  ...ML_M2,
  ...ML_M3,
  ...ML_M4,
  ...ML_M5,
  ...ML_M6,
  ...ML_M7,
  ...ML_M8,
  ...ML_M9,
  ...ML_M10,
  ...ML_M11,
  ...ML_M12,
  ...ML_M13,
  ...ML_M14,
  ...ML_M15,
  ...ML_M16,
  ...ML_M17,
  ...ML_M18,
  ...ML_M19,
  ...ML_M20,
  ...ML_M21,
  ...ML_M22,
  ...ML_M23,
  ...ML_M24,
};

export default MACHINE_LEARNING_ASSESSMENTS;
