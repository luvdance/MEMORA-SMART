/**
 * DISPLAY HELPERS FOR GENERATED ALGEBRA
 *
 * SERVER ONLY (it sits with the generators, which hold answers).
 *
 * Working shown to a student must look the way it would on a WAEC script:
 * "3x − 15", never "3x + -15" or "1x". Every generator that prints algebra
 * goes through these, so the house style is enforced in one place.
 */

/** A signed number for display: -6 → "−6". */
export const sn = (n) => String(n).replace("-", "−");

/** One signed term: (3, "x") → "3x", (-1, "x") → "−x", (5, "") → "5". */
export function term(c, v, first = false) {
  if (c === 0) return "";
  const sign = c < 0 ? (first ? "−" : " − ") : first ? "" : " + ";
  const size = Math.abs(c) === 1 && v ? "" : String(Math.abs(c));
  return `${sign}${size}${v}`;
}

/** A polynomial from [coefficient, letters] pairs, e.g. poly([1,"x²"],[-5,"x"],[6,""]). */
export const poly = (...pairs) =>
  pairs.map(([c, v], i) => term(c, v, pairs.slice(0, i).every(([cc]) => cc === 0))).join("") || "0";

/** The same, as plain text the answer checker reads: ^ for powers, - for minus. */
export const plainPoly = (...pairs) =>
  poly(...pairs).replace(/−/g, "-").replace(/²/g, "^2").replace(/³/g, "^3");

/** A bracket: (x − 6), with a coefficient on x only when it is not 1. */
export const br = (a, b, v = "x") => `(${poly([a, v], [b, ""])})`;

/** Plain-text bracket for answers. */
export const pbr = (a, b, v = "x") => `(${plainPoly([a, v], [b, ""])})`;
