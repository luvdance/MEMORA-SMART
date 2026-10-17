/**
 * MATHEMATICS LESSON REGISTRY
 *
 * One import per written module. The module list itself lives in the course
 * outline (mathematicsCourse.js); a module with no entry here shows as
 * "coming soon" in the curriculum tree rather than as an empty lesson.
 *
 * Every lesson in these files teaches one skill group from the skill map
 * (`skillGroup`), and `npm run test:maths` proves the lessons teach every
 * skill in their group, in an order where nothing comes before its
 * prerequisites.
 */

import { LESSONS as MA_01 } from "./ma-01-place-value.js";
import { LESSONS as MA_02 } from "./ma-02-operations.js";
import { LESSONS as MA_03 } from "./ma-03-factors-fractions.js";
import { LESSONS as MA_04 } from "./ma-04-decimals-roots.js";
import { LESSONS as MA_05 } from "./ma-05-measurement-time.js";
import { LESSONS as MA_06 } from "./ma-06-data-base-two.js";
import { LESSONS as MA_07 } from "./ma-07-hcf-lcm-negatives.js";
import { LESSONS as MA_08 } from "./ma-08-fractions.js";
import { LESSONS as MA_09 } from "./ma-09-percentages-approximation.js";
import { LESSONS as MA_10 } from "./ma-10-number-system-ratio.js";
import { LESSONS as MA_11 } from "./ma-11-algebra-begins.js";
import { LESSONS as MA_12 } from "./ma-12-sequences-angles-shapes.js";
import { LESSONS as MA_13 } from "./ma-13-solids-data.js";
import { LESSONS as MA_14 } from "./ma-14-indices.js";
import { LESSONS as MA_15 } from "./ma-15-commercial-binary.js";
import { LESSONS as MA_16 } from "./ma-16-expanding-equations.js";
import { LESSONS as MA_17 } from "./ma-17-graphs.js";
import { LESSONS as MA_18 } from "./ma-18-parallel-construction.js";
import { LESSONS as MA_19 } from "./ma-19-circles-bearings.js";
import { LESSONS as MA_20 } from "./ma-20-statistics-probability.js";
import { LESSONS as MA_21 } from "./ma-21-bases-commerce-variation.js";
import { LESSONS as MA_22 } from "./ma-22-factorisation-formulae.js";
import { LESSONS as MA_23 } from "./ma-23-simultaneous-inequalities-similarity.js";
import { LESSONS as MA_24 } from "./ma-24-pythagoras-trigonometry.js";
import { LESSONS as MA_25 } from "./ma-25-bases-modular.js";
import { LESSONS as MA_26 } from "./ma-26-logarithms-surds.js";
import { LESSONS as MA_27 } from "./ma-27-sets-logic.js";
import { LESSONS as MA_28 } from "./ma-28-quadratics-variation.js";
import { LESSONS as MA_29 } from "./ma-29-mensuration-triangles.js";
import { LESSONS as MA_30 } from "./ma-30-loci-trigonometry-data.js";
import { LESSONS as MA_31 } from "./ma-31-sequences-finance.js";
import { LESSONS as MA_32 } from "./ma-32-advanced-algebra.js";
import { LESSONS as MA33 } from "./ma-33-circle-theorems.js";
import { LESSONS as MA34 } from "./ma-34-coordinates-triangles.js";
import { LESSONS as MA35 } from "./ma-35-statistics-probability.js";
import { LESSONS as MA36 } from "./ma-36-matrices-binary.js";
import { LESSONS as MA37 } from "./ma-37-vectors-transformations.js";
import { LESSONS as MA38 } from "./ma-38-polynomials-counting.js";
import { LESSONS as MA39 } from "./ma-39-calculus.js";
import { LESSONS as MA40 } from "./ma-40-exam-mastery.js";
import { LESSONS as MA41 } from "./ma-41-university-bridge.js";

export const MATHS_LESSONS = {
  "ma-01-place-value": MA_01,
  "ma-02-operations": MA_02,
  "ma-03-factors-fractions": MA_03,
  "ma-04-decimals-roots": MA_04,
  "ma-05-measurement-time": MA_05,
  "ma-06-data-base-two": MA_06,
  "ma-07-hcf-lcm-negatives": MA_07,
  "ma-08-fractions": MA_08,
  "ma-09-percentages-approximation": MA_09,
  "ma-10-number-system-ratio": MA_10,
  "ma-11-algebra-begins": MA_11,
  "ma-12-sequences-angles-shapes": MA_12,
  "ma-13-solids-data": MA_13,
  "ma-14-indices": MA_14,
  "ma-15-commercial-binary": MA_15,
  "ma-16-expanding-equations": MA_16,
  "ma-17-graphs": MA_17,
  "ma-18-parallel-construction": MA_18,
  "ma-19-circles-bearings": MA_19,
  "ma-20-statistics-probability": MA_20,
  "ma-21-bases-commerce-variation": MA_21,
  "ma-22-factorisation-formulae": MA_22,
  "ma-23-simultaneous-inequalities-similarity": MA_23,
  "ma-24-pythagoras-trigonometry": MA_24,
  "ma-25-bases-modular": MA_25,
  "ma-26-logarithms-surds": MA_26,
  "ma-27-sets-logic": MA_27,
  "ma-28-quadratics-variation": MA_28,
  "ma-29-mensuration-triangles": MA_29,
  "ma-30-loci-trigonometry-data": MA_30,
  "ma-31-sequences-finance": MA_31,
  "ma-32-advanced-algebra": MA_32,
  "ma-33-circle-theorems": MA33,
  "ma-34-coordinates-triangles": MA34,
  "ma-35-statistics-probability": MA35,
  "ma-36-matrices-binary": MA36,
  "ma-37-vectors-transformations": MA37,
  "ma-38-polynomials-counting": MA38,
  "ma-39-calculus": MA39,
  "ma-40-exam-mastery": MA40,
  "ma-41-university-bridge": MA41,
};

export default MATHS_LESSONS;
