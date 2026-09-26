import L0_NUMBER from "./l0-number.js";
import L0_MEASURE from "./l0-measure-data.js";
import L1_NUMBER from "./l1-number.js";
import L1_ALGEBRA from "./l1-algebra.js";
import L1_GEOMETRY from "./l1-geometry.js";
import L1_SEQUENCES from "./l1-sequences.js";
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
  ...L1_NUMBER,
  ...L1_ALGEBRA,
  ...L1_GEOMETRY,
  ...L1_SEQUENCES,
  ...L2_NUMBER,
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
