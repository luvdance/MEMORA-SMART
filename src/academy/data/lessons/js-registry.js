/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) — LESSON REGISTRY
 *
 * One import per written week. The week list itself lives in the course
 * outline (javascriptCourse.js); a week with no entry here shows as "coming
 * soon" in the curriculum tree rather than as an empty lesson.
 *
 * Every lesson declares the curriculum numbers it `covers`, and
 * `npm run test:academy` proves that every number in each week's curriculum
 * table is taught by some lesson in that week.
 */

import { LESSONS as JS_W1 } from "./js-w1-foundations.js";
import { LESSONS as JS_W2 } from "./js-w2-logic.js";
import { LESSONS as JS_W3 } from "./js-w3-intro.js";
import { LESSONS as JS_W4 } from "./js-w4-types.js";
import { LESSONS as JS_W5 } from "./js-w5-control.js";
import { LESSONS as JS_W6 } from "./js-w6-functions.js";
import { LESSONS as JS_W7 } from "./js-w7-arrays-strings.js";
import { LESSONS as JS_W8 } from "./js-w8-objects.js";
import { LESSONS as JS_W9 } from "./js-w9-scope-debugging.js";
import { LESSONS as JS_W10 } from "./js-w10-dom.js";
import { LESSONS as JS_W11 } from "./js-w11-events-storage.js";
import { LESSONS as JS_W12 } from "./js-w12-apis.js";
import { LESSONS as JS_W13 } from "./js-w13-advanced.js";
import { LESSONS as JS_W14 } from "./js-w14-tooling.js";
import { LESSONS as JS_W15 } from "./js-w15-react.js";
import { LESSONS as JS_W16 } from "./js-w16-capstone.js";

export const JAVASCRIPT_LESSONS = {
  "js-w1-foundations": JS_W1,
  "js-w2-logic": JS_W2,
  "js-w3-intro": JS_W3,
  "js-w4-types": JS_W4,
  "js-w5-control": JS_W5,
  "js-w6-functions": JS_W6,
  "js-w7-arrays-strings": JS_W7,
  "js-w8-objects": JS_W8,
  "js-w9-scope-debugging": JS_W9,
  "js-w10-dom": JS_W10,
  "js-w11-events-storage": JS_W11,
  "js-w12-apis": JS_W12,
  "js-w13-advanced": JS_W13,
  "js-w14-tooling": JS_W14,
  "js-w15-react": JS_W15,
  "js-w16-capstone": JS_W16,
};

export default JAVASCRIPT_LESSONS;
