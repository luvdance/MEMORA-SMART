import { check } from "../answer.js";

/**
 * THE ITEM CONTRACT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Every generator beside this file contains answers.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * A generator is `(r, tier) => item`, where `r` is a seeded RNG and `tier` is
 * "build", "stretch" or "exam". Given the same seed it must return the same
 * item, because grading regenerates rather than remembering.
 *
 * ── WHAT AN ITEM CARRIES, AND WHY EACH PART EARNS ITS PLACE ─────────────
 *
 *   prompt     The question. Written the way an examiner writes it.
 *
 *   input      How the answer is typed. Never multiple choice unless the
 *              skill genuinely is a choice, because recognising 3/4 among
 *              four options is not the skill of producing 3/4.
 *
 *   answer     The canonical answer. Never leaves the server.
 *
 *   hints      THREE, and they must be a ladder: a nudge, then the method,
 *              then the first worked step. One hint is a cliff — a student
 *              who needs help gets either nothing useful or the answer. Three
 *              means the student can take the smallest amount of help that
 *              unsticks them, which is the amount that still teaches.
 *
 *   solution   The full working, one step per line. Shown after a wrong
 *              answer ALWAYS, and after a right answer when the student asks.
 *              A student who guessed right and is never shown the method has
 *              learned nothing and will meet the same item in a week.
 *
 *   traps      The part most platforms skip. Each trap is a SPECIFIC wrong
 *              answer, with the misconception that produces it and the atom
 *              that misconception really belongs to. When a student types
 *              47,400 for "round 47,382 to the nearest thousand", they have
 *              not made a random error: they rounded to the nearest hundred.
 *              Saying "incorrect" teaches nothing. Saying "you rounded to the
 *              nearest HUNDRED — the question asked for the nearest THOUSAND,
 *              so the deciding digit is the 3, not the 8" teaches the thing
 *              they got wrong. That is what a trap is for.
 *
 *   scaffold   Optional. The same question split into single steps, each
 *              answered separately. Used by the repair loop when a student
 *              has already failed the item and its twin: at that point
 *              another whole problem is not what they need, one step at a
 *              time is.
 *
 *   visual     Optional drawing spec, rendered client-side. The Trace stage
 *              of the ATOM model is a picture, and a bar model the student
 *              can see beats a paragraph describing one.
 */

export function item(spec) {
  const input = spec.input || { kind: "number" };

  // ── Dead traps, removed here rather than in every generator ──────────
  //
  // Generators build their traps out of the same random numbers as the
  // answer, so now and then a trap value COINCIDES with the correct answer:
  // the LCM of two coprime numbers really is their product, and the change
  // from a purchase really can equal its cost. Such a trap can never fire —
  // a correct answer is marked correct before the traps are consulted — so
  // it is dead weight, and leaving it in the item hides the fact that this
  // particular set of numbers no longer distinguishes the misconception.
  //
  // Dropped by MARKING, not by comparing strings, because a form trap is a
  // different thing: on an item whose answer must be in lowest terms, the
  // trap value 6/8 has the same VALUE as the answer 3/4 and is still a live
  // trap, since 6/8 is marked wrong. Running the trap value through the real
  // checker is what tells the two cases apart.
  const fullSpec = {
    kind: input.kind,
    answer: spec.answer,
    accept: spec.accept,
    exact: spec.exact,
    tolerance: spec.tolerance,
    ordered: spec.ordered,
    variables: spec.variables,
    unit: spec.unit,
  };

  const seenTrapValues = new Set();
  const traps = (spec.traps || []).filter((t) => {
    if (t.is === undefined || t.is === null) return false;
    const value = Array.isArray(t.is) ? t.is.join(", ") : String(t.is);
    if (!value || value === "NaN" || value.includes("NaN") || value === "Infinity") return false;
    if (seenTrapValues.has(value)) return false; // two traps, one wrong answer
    seenTrapValues.add(value);
    return !check(value, fullSpec).correct;
  });

  return {
    prompt: spec.prompt,
    input,
    answer: spec.answer,
    accept: spec.accept || [],
    exact: spec.exact || null,
    tolerance: spec.tolerance,
    variables: spec.variables,
    ordered: spec.ordered,
    unit: spec.unit,
    hints: spec.hints || [],
    solution: spec.solution || [],
    traps,
    visual: spec.visual || null,
    scaffold: spec.scaffold || null,
    /** A one-line statement of the skill, shown on the result card. */
    skill: spec.skill || null,
  };
}

/**
 * One specific wrong answer worth naming.
 *
 * `is`       the wrong value itself, marked with the same checker as the
 *            real answer, so 0.75 and 3/4 both trigger a trap set on 3/4.
 * `id`       a stable misconception id. Counted per student, so the platform
 *            can notice that someone has made the same error eleven times.
 * `atom`     the atom this misconception REALLY belongs to, when it is not
 *            this one. This is what lets the engine route a struggling
 *            student back two years to the thing that is actually broken.
 * `says`     what the student is told. Addressed to them, naming what they
 *            did rather than what they failed to do.
 */
export function trap(id, is, says, atom = null) {
  return { id, is, says, atom };
}

/** Number input, the default. */
export const num = (extra = {}) => ({ kind: "number", ...extra });
export const frac = (extra = {}) => ({ kind: "fraction", placeholder: "e.g. 3/4", ...extra });
export const list = (extra = {}) => ({ kind: "list", placeholder: "separate with commas", ...extra });
export const text = (extra = {}) => ({ kind: "text", ...extra });
export const ratio = (extra = {}) => ({ kind: "ratio", placeholder: "e.g. 3:4", ...extra });
export const expr = (extra = {}) => ({ kind: "expression", placeholder: "e.g. 2x + 6", ...extra });
export const choice = (options, extra = {}) => ({ kind: "choice", options, ...extra });

/** Tier helper: most generators want "easy, harder, exam-shaped" sizes. */
export function byTier(tier, { build, stretch, exam }) {
  if (tier === "exam") return exam ?? stretch ?? build;
  if (tier === "stretch") return stretch ?? build;
  return build;
}
