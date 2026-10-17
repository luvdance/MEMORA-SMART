/**
 * MATHEMATICS ASSESSMENT REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Every file imported here holds lesson-check answers.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * One import per written maths module, in step with the lesson registry
 * (src/academy/data/lessons/ma-registry.js). grade.js merges this into the
 * answer bank, so a new module is graded the moment it is registered here.
 * Static imports, not a directory scan, because the serverless bundler only
 * ships files it can see imported.
 */

import { ASSESSMENTS as MA_01_PLACE_VALUE } from "./ma-01-place-value.js";
import { ASSESSMENTS as MA_02_OPERATIONS } from "./ma-02-operations.js";
import { ASSESSMENTS as MA_03_FACTORS_FRACTIONS } from "./ma-03-factors-fractions.js";
import { ASSESSMENTS as MA_04_DECIMALS_ROOTS } from "./ma-04-decimals-roots.js";
import { ASSESSMENTS as MA_05_MEASUREMENT_TIME } from "./ma-05-measurement-time.js";
import { ASSESSMENTS as MA_06_DATA_BASE_TWO } from "./ma-06-data-base-two.js";
import { ASSESSMENTS as MA_07_HCF_LCM_NEGATIVES } from "./ma-07-hcf-lcm-negatives.js";
import { ASSESSMENTS as MA_08_FRACTIONS } from "./ma-08-fractions.js";
import { ASSESSMENTS as MA_09_PERCENTAGES_APPROXIMATION } from "./ma-09-percentages-approximation.js";
import { ASSESSMENTS as MA_10_NUMBER_SYSTEM_RATIO } from "./ma-10-number-system-ratio.js";
import { ASSESSMENTS as MA_11_ALGEBRA_BEGINS } from "./ma-11-algebra-begins.js";
import { ASSESSMENTS as MA_12_SEQUENCES_ANGLES_SHAPES } from "./ma-12-sequences-angles-shapes.js";
import { ASSESSMENTS as MA_13_SOLIDS_DATA } from "./ma-13-solids-data.js";
import { ASSESSMENTS as MA_14_INDICES } from "./ma-14-indices.js";
import { ASSESSMENTS as MA_15_COMMERCIAL_BINARY } from "./ma-15-commercial-binary.js";
import { ASSESSMENTS as MA_16_EXPANDING_EQUATIONS } from "./ma-16-expanding-equations.js";
import { ASSESSMENTS as MA_17_GRAPHS } from "./ma-17-graphs.js";
import { ASSESSMENTS as MA_18_PARALLEL_CONSTRUCTION } from "./ma-18-parallel-construction.js";
import { ASSESSMENTS as MA_19_CIRCLES_BEARINGS } from "./ma-19-circles-bearings.js";
import { ASSESSMENTS as MA_20_STATISTICS_PROBABILITY } from "./ma-20-statistics-probability.js";
import { ASSESSMENTS as MA_21_BASES_COMMERCE_VARIATION } from "./ma-21-bases-commerce-variation.js";
import { ASSESSMENTS as MA_22_FACTORISATION_FORMULAE } from "./ma-22-factorisation-formulae.js";
import { ASSESSMENTS as MA_23_SIMULTANEOUS_INEQUALITIES_SIMILARITY } from "./ma-23-simultaneous-inequalities-similarity.js";
import { ASSESSMENTS as MA_24_PYTHAGORAS_TRIGONOMETRY } from "./ma-24-pythagoras-trigonometry.js";
import { ASSESSMENTS as MA_25_BASES_MODULAR } from "./ma-25-bases-modular.js";
import { ASSESSMENTS as MA_26_LOGARITHMS_SURDS } from "./ma-26-logarithms-surds.js";
import { ASSESSMENTS as MA_27_SETS_LOGIC } from "./ma-27-sets-logic.js";
import { ASSESSMENTS as MA_28_QUADRATICS_VARIATION } from "./ma-28-quadratics-variation.js";
import { ASSESSMENTS as MA_29_MENSURATION_TRIANGLES } from "./ma-29-mensuration-triangles.js";
import { ASSESSMENTS as MA_30_LOCI_TRIGONOMETRY_DATA } from "./ma-30-loci-trigonometry-data.js";
import { ASSESSMENTS as MA_31_SEQUENCES_FINANCE } from "./ma-31-sequences-finance.js";
import { ASSESSMENTS as MA_32_ADVANCED_ALGEBRA } from "./ma-32-advanced-algebra.js";
import { ASSESSMENTS as MA_33_CIRCLE_THEOREMS } from "./ma-33-circle-theorems.js";
import { ASSESSMENTS as MA_34_COORDINATES_TRIANGLES } from "./ma-34-coordinates-triangles.js";
import { ASSESSMENTS as MA_35_STATISTICS_PROBABILITY } from "./ma-35-statistics-probability.js";
import { ASSESSMENTS as MA_36_MATRICES_BINARY } from "./ma-36-matrices-binary.js";
import { ASSESSMENTS as MA_37_VECTORS_TRANSFORMATIONS } from "./ma-37-vectors-transformations.js";
import { ASSESSMENTS as MA_38_POLYNOMIALS_COUNTING } from "./ma-38-polynomials-counting.js";
import { ASSESSMENTS as MA_39_CALCULUS } from "./ma-39-calculus.js";
import { ASSESSMENTS as MA_40_EXAM_MASTERY } from "./ma-40-exam-mastery.js";
import { ASSESSMENTS as MA_41_UNIVERSITY_BRIDGE } from "./ma-41-university-bridge.js";

export const MATHS_ASSESSMENTS = {
  ...MA_01_PLACE_VALUE,
  ...MA_02_OPERATIONS,
  ...MA_03_FACTORS_FRACTIONS,
  ...MA_04_DECIMALS_ROOTS,
  ...MA_05_MEASUREMENT_TIME,
  ...MA_06_DATA_BASE_TWO,
  ...MA_07_HCF_LCM_NEGATIVES,
  ...MA_08_FRACTIONS,
  ...MA_09_PERCENTAGES_APPROXIMATION,
  ...MA_10_NUMBER_SYSTEM_RATIO,
  ...MA_11_ALGEBRA_BEGINS,
  ...MA_12_SEQUENCES_ANGLES_SHAPES,
  ...MA_13_SOLIDS_DATA,
  ...MA_14_INDICES,
  ...MA_15_COMMERCIAL_BINARY,
  ...MA_16_EXPANDING_EQUATIONS,
  ...MA_17_GRAPHS,
  ...MA_18_PARALLEL_CONSTRUCTION,
  ...MA_19_CIRCLES_BEARINGS,
  ...MA_20_STATISTICS_PROBABILITY,
  ...MA_21_BASES_COMMERCE_VARIATION,
  ...MA_22_FACTORISATION_FORMULAE,
  ...MA_23_SIMULTANEOUS_INEQUALITIES_SIMILARITY,
  ...MA_24_PYTHAGORAS_TRIGONOMETRY,
  ...MA_25_BASES_MODULAR,
  ...MA_26_LOGARITHMS_SURDS,
  ...MA_27_SETS_LOGIC,
  ...MA_28_QUADRATICS_VARIATION,
  ...MA_29_MENSURATION_TRIANGLES,
  ...MA_30_LOCI_TRIGONOMETRY_DATA,
  ...MA_31_SEQUENCES_FINANCE,
  ...MA_32_ADVANCED_ALGEBRA,
  ...MA_33_CIRCLE_THEOREMS,
  ...MA_34_COORDINATES_TRIANGLES,
  ...MA_35_STATISTICS_PROBABILITY,
  ...MA_36_MATRICES_BINARY,
  ...MA_37_VECTORS_TRANSFORMATIONS,
  ...MA_38_POLYNOMIALS_COUNTING,
  ...MA_39_CALCULUS,
  ...MA_40_EXAM_MASTERY,
  ...MA_41_UNIVERSITY_BRIDGE,
};

export default MATHS_ASSESSMENTS;
