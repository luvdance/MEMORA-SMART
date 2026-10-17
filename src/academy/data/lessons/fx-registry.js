/**
 * FOREX TRADING — LESSON REGISTRY
 *
 * One import per written week. The week list itself lives in the course
 * outline (forexCourse.js); a week with no entry here shows as "coming soon"
 * in the curriculum tree rather than as an empty lesson.
 *
 * Every lesson declares the curriculum numbers it `covers`, and
 * `npm run test:academy` proves every number in each week's curriculum table
 * is taught by some lesson in that week.
 */

import { LESSONS as FX_W1 } from "./fx-w1-intro.js";
import { LESSONS as FX_W2 } from "./fx-w2-mechanics.js";
import { LESSONS as FX_W3 } from "./fx-w3-risk-maths.js";
import { LESSONS as FX_W4 } from "./fx-w4-price-action.js";
import { LESSONS as FX_W5 } from "./fx-w5-technical.js";
import { LESSONS as FX_W6 } from "./fx-w6-fundamental.js";
import { LESSONS as FX_W7 } from "./fx-w7-timeframes.js";
import { LESSONS as FX_W8 } from "./fx-w8-strategy.js";
import { LESSONS as FX_W9 } from "./fx-w9-backtesting.js";
import { LESSONS as FX_W10 } from "./fx-w10-execution.js";
import { LESSONS as FX_W11 } from "./fx-w11-psychology.js";
import { LESSONS as FX_W12 } from "./fx-w12-governance.js";
import { LESSONS as FX_W13 } from "./fx-w13-lab-backtest.js";
import { LESSONS as FX_W14 } from "./fx-w14-lab-demo.js";
import { LESSONS as FX_W15 } from "./fx-w15-lab-review.js";
import { LESSONS as FX_C1 } from "./fx-c1-consolidation.js";
import { LESSONS as FX_C2 } from "./fx-c2-consolidation.js";
import { LESSONS as FX_C3 } from "./fx-c3-consolidation.js";
import { LESSONS as FX_C4 } from "./fx-c4-consolidation.js";
import { LESSONS as FX_W16 } from "./fx-w16-lab-final.js";

export const FOREX_LESSONS = {
  "fx-w1-intro": FX_W1,
  "fx-w2-mechanics": FX_W2,
  "fx-w3-risk-maths": FX_W3,
  "fx-c1-consolidation": FX_C1,
  "fx-w4-price-action": FX_W4,
  "fx-w5-technical": FX_W5,
  "fx-w6-fundamental": FX_W6,
  "fx-c2-consolidation": FX_C2,
  "fx-w7-timeframes": FX_W7,
  "fx-w8-strategy": FX_W8,
  "fx-w9-backtesting": FX_W9,
  "fx-c3-consolidation": FX_C3,
  "fx-w10-execution": FX_W10,
  "fx-w11-psychology": FX_W11,
  "fx-w12-governance": FX_W12,
  "fx-c4-consolidation": FX_C4,
  "fx-w13-lab-backtest": FX_W13,
  "fx-w14-lab-demo": FX_W14,
  "fx-w15-lab-review": FX_W15,
  "fx-w16-lab-final": FX_W16,
};

export default FOREX_LESSONS;
