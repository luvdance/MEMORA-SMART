/**
 * ASSESSMENTS · FOREX TRADING — REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One bank per week, merged into a single lessonId → assessment map for the
 * grader in lib/academy/grade.js.
 */

import { ASSESSMENTS as FX_W1 } from "./fx-w1-intro.js";
import { ASSESSMENTS as FX_W2 } from "./fx-w2-mechanics.js";
import { ASSESSMENTS as FX_W3 } from "./fx-w3-risk-maths.js";
import { ASSESSMENTS as FX_W4 } from "./fx-w4-price-action.js";
import { ASSESSMENTS as FX_W5 } from "./fx-w5-technical.js";
import { ASSESSMENTS as FX_W6 } from "./fx-w6-fundamental.js";
import { ASSESSMENTS as FX_W7 } from "./fx-w7-timeframes.js";
import { ASSESSMENTS as FX_W8 } from "./fx-w8-strategy.js";
import { ASSESSMENTS as FX_W9 } from "./fx-w9-backtesting.js";
import { ASSESSMENTS as FX_W10 } from "./fx-w10-execution.js";
import { ASSESSMENTS as FX_W11 } from "./fx-w11-psychology.js";
import { ASSESSMENTS as FX_W12 } from "./fx-w12-governance.js";
import { ASSESSMENTS as FX_W13 } from "./fx-w13-lab-backtest.js";
import { ASSESSMENTS as FX_W14 } from "./fx-w14-lab-demo.js";
import { ASSESSMENTS as FX_W15 } from "./fx-w15-lab-review.js";
import { ASSESSMENTS as FX_C1 } from "./fx-c1-consolidation.js";
import { ASSESSMENTS as FX_C2 } from "./fx-c2-consolidation.js";
import { ASSESSMENTS as FX_C3 } from "./fx-c3-consolidation.js";
import { ASSESSMENTS as FX_C4 } from "./fx-c4-consolidation.js";
import { ASSESSMENTS as FX_W16 } from "./fx-w16-lab-final.js";

export const FOREX_ASSESSMENTS = {
  ...FX_W1,
  ...FX_W2,
  ...FX_W3,
  ...FX_C1,
  ...FX_W4,
  ...FX_W5,
  ...FX_W6,
  ...FX_C2,
  ...FX_W7,
  ...FX_W8,
  ...FX_W9,
  ...FX_C3,
  ...FX_W10,
  ...FX_W11,
  ...FX_W12,
  ...FX_C4,
  ...FX_W13,
  ...FX_W14,
  ...FX_W15,
  ...FX_W16,
};

export default FOREX_ASSESSMENTS;
