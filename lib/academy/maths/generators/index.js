import L0_NUMBER from "./l0-number.js";
import L0_MEASURE from "./l0-measure-data.js";
import L0_EXTRA from "./l0-extra.js";
import L1_NUMBER from "./l1-number.js";
import L1_EXTRA from "./l1-extra.js";
import L1_SHAPES from "./l1-shapes.js";
import L1_ALGEBRA from "./l1-algebra.js";
import L1_GEOMETRY from "./l1-geometry.js";
import L1_SEQUENCES from "./l1-sequences.js";
import L1_SOLIDS_DATA from "./l1-solids-data.js";
import L2_INDICES from "./l2-indices.js";
import L2_COMMERCE_BINARY from "./l2-commerce-binary.js";
import L2_ALGEBRA from "./l2-algebra.js";
import L2_GRAPHS_GEOMETRY from "./l2-graphs-geometry.js";
import L2_MEASURE_DATA from "./l2-measure-data.js";
import L3_NUMBER from "./l3-number.js";
import L3_ALGEBRA from "./l3-algebra.js";
import L3_GEOMETRY_DATA from "./l3-geometry-data.js";
import L4_NUMBER from "./l4-number.js";
import L4_SETS_LOGIC from "./l4-sets-logic.js";
import L4_ALGEBRA from "./l4-algebra.js";
import L4_GEOMETRY_DATA from "./l4-geometry-data.js";
import L5_SEQUENCES_FINANCE from "./l5-sequences-finance.js";
import L5_ALGEBRA from "./l5-algebra.js";
import L5GEO from "./l5-geometry.js";
import L5DATA from "./l5-data-l6-matrices.js";
import L6GEO from "./l6-geometry.js";
import L6CALC from "./l6-calculus.js";
import L6BRIDGE from "./l6-bridge.js";
import L2_NUMBER from "./l2-number.js";

/**
 * THE GENERATOR REGISTRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Everything this file imports contains answers.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The atom map (src/academy/data/maths/atomMap.js) lists every atom the course
 * WILL contain. This registry lists the atoms whose questions are actually
 * WRITTEN. The two are deliberately separate, exactly as the lesson registry
 * and the curriculum are for the other courses, so that the platform can
 * always tell a learner the truth: "this atom is ready" rather than opening an
 * empty lesson and looking broken.
 *
 * `coverage()` is what the map screen and the tests both read, so there is no
 * second place where the answer to "is this ready?" can be got wrong.
 *
 * Adding an atom's questions = write the generator, add one import here.
 */
export const GENERATORS = {
  ...L0_NUMBER,
  ...L0_MEASURE,
  ...L0_EXTRA,
  ...L1_NUMBER,
  ...L1_EXTRA,
  ...L1_SHAPES,
  ...L1_ALGEBRA,
  ...L1_GEOMETRY,
  ...L1_SEQUENCES,
  ...L2_NUMBER,
  ...L1_SOLIDS_DATA,
  ...L2_INDICES,
  ...L2_COMMERCE_BINARY,
  ...L2_ALGEBRA,
  ...L2_GRAPHS_GEOMETRY,
  ...L2_MEASURE_DATA,
  ...L3_NUMBER,
  ...L3_ALGEBRA,
  ...L3_GEOMETRY_DATA,
  ...L4_NUMBER,
  ...L4_SETS_LOGIC,
  ...L4_ALGEBRA,
  ...L4_GEOMETRY_DATA,
  ...L5_SEQUENCES_FINANCE,
  ...L5_ALGEBRA,
  ...L5GEO,
  ...L5DATA,
  ...L6GEO,
  ...L6CALC,
  ...L6BRIDGE,
};

export function hasGenerator(atomCode) {
  return typeof GENERATORS[atomCode] === "function";
}

export function generatorFor(atomCode) {
  return GENERATORS[atomCode] || null;
}

/** Atom codes with written questions, in no particular order. */
export function authoredAtoms() {
  return Object.keys(GENERATORS);
}

/**
 * What is ready, counted rather than claimed.
 *
 * Takes the atom list as an argument instead of importing the map, so this
 * file stays a pure server module with no dependency on anything under src/.
 */
export function coverage(atomList) {
  const byLevel = {};
  for (const atom of atomList) {
    const level = (byLevel[atom.level] ||= { total: 0, authored: 0, atoms: [] });
    level.total += 1;
    if (hasGenerator(atom.code)) {
      level.authored += 1;
      level.atoms.push(atom.code);
    }
  }
  const total = atomList.length;
  const authored = atomList.filter((atom) => hasGenerator(atom.code)).length;
  return { total, authored, percent: Math.round((authored / total) * 100), byLevel };
}
