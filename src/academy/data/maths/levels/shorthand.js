/**
 * Shared shorthand for the level files.
 *
 * An atom is one line of meaning — a title and a single "I can…" statement —
 * and it should read like one line in the source too. Three hundred atoms
 * written as full object literals is a file nobody proof-reads.
 */

/** Every atom in the map is built through here. */
export const a = (title, iCan, extra = {}) => ({ title, iCan, ...extra });

/** Which papers actually examine an atom. See atomMap.js for why this exists. */
export const ALL = ["WAEC", "NECO", "JAMB"];
export const WN = ["WAEC", "NECO"];
export const JAMB_ONLY = ["JAMB"];

/**
 * Not examined by name on any senior paper. Almost always junior-secondary
 * groundwork that every later atom silently assumes — which is precisely why
 * it is taught and gated rather than skipped.
 */
export const NONE = [];
