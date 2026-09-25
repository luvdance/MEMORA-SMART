import { makeRng, hashString } from "./rng.js";
import { check, REASON_NOTES } from "./answer.js";
import { GENERATORS, hasGenerator, coverage, authoredAtoms } from "./generators/index.js";
import { ATOM_LIST, getAtom, getAncestors } from "../../../src/academy/data/maths/atomMap.js";
import { RULES } from "./rules.js";

/**
 * THE MATHEMATICS DRILL ENGINE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. This module and everything it imports from ./generators hold
 * every answer the maths drills use. `npm run test:maths` fails the build if
 * anything under src/ imports it.
 *
 * It does import the SKILL MAP from src/, which is the right direction: that
 * file is a pure index of skills and their prerequisites with no answers in
 * it, and having the server read the same map the client renders is what stops
 * the two drifting apart.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * ── WHAT A DRILL IS ──────────────────────────────────────────────────────
 * The maths course is taught by the same lesson player as every other course:
 * months, modules, lessons, atoms, and a knowledge check at the end of each
 * lesson. A DRILL is one more atom-level exercise in that player, exactly like
 * ExcelGrid's `exercise` in Data Analysis or PhishInspect's `phishExercise` in
 * Cybersecurity — the lesson does not advance until it is right.
 *
 * What makes the maths one different is that its questions are GENERATED
 * rather than written. That is not a flourish; it is what makes the repair
 * loop possible. When a student gets one wrong, the platform has to be able to
 * hand them ANOTHER question of exactly the same kind with different numbers,
 * immediately and forever. A fixed item cannot do that: after the answer is
 * revealed, re-showing it measures reading, not mathematics.
 *
 * ── HOW A QUESTION GETS TO A STUDENT AND BACK ────────────────────────────
 *
 *   serve()   picks a seed, generates the items, strips every answer, hint
 *             and worked solution the moment does not permit, and returns the
 *             rest with the seed attached.
 *
 *   grade()   takes the seed back, REGENERATES the identical items, and marks
 *             against those. Nothing is stored between the two requests and
 *             nothing forgeable is sent to the browser: the seed produces the
 *             items only in the presence of the generators, which are here.
 *
 * ── THE REPAIR LOOP ──────────────────────────────────────────────────────
 * A wrong answer never ends with "incorrect".
 *
 *   1. The answer is checked against the item's TRAPS and, if one matches,
 *      the student is told what they actually did — not "wrong", but "you
 *      added the denominators".
 *   2. The full worked solution follows.
 *   3. Then a TWIN: same generator, same tier, different numbers, which must
 *      be answered correctly. Nothing advances until it is.
 *   4. If the twin is missed too, the SCAFFOLD: the same problem cut into
 *      single steps, each answered on its own, and then another twin.
 *   5. If the trap names a different skill, the diagnosis is handed back so
 *      the lesson can say which earlier idea is actually broken.
 */

export { coverage, hasGenerator, authoredAtoms };

/** Every skill the engine can actually drill today. */
export function readyAtoms() {
  return ATOM_LIST.filter((atom) => hasGenerator(atom.code));
}

export function getCoverage() {
  return coverage(ATOM_LIST);
}

/* ── Seeds ───────────────────────────────────────────────────────────── */

const freshSeed = () => (Math.random() * 4294967296) >>> 0;

/**
 * One item's own seed, derived from the set seed, the skill, the tier and the
 * position. Two items in one set therefore never share a stream, and the same
 * set seed asked for a different tier gives genuinely different questions
 * rather than the same numbers wearing a different label.
 */
function itemSeed(seed, atomCode, tier, index) {
  return (seed ^ hashString(`${atomCode}|${tier}|${index}`)) >>> 0;
}

export function parseSeed(raw) {
  if (raw === undefined || raw === null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n >>> 0 : undefined;
}

/* ── Building items ──────────────────────────────────────────────────── */

function build(atomCode, tier, seed, index) {
  const generator = GENERATORS[atomCode];
  if (!generator) return null;
  return generator(makeRng(itemSeed(seed, atomCode, tier, index)), tier);
}

/**
 * The learner-facing view of an item.
 *
 * `withHints` is false for anything that is measuring rather than teaching.
 * The third rung of every ladder is a worked step, which on a check would
 * simply be the answer.
 */
function publicItem(built, { atomCode, tier, index, withHints }) {
  const atom = getAtom(atomCode);
  return {
    index,
    atom: atomCode,
    atomTitle: atom?.title || atomCode,
    tier,
    prompt: built.prompt,
    input: built.input,
    visual: built.visual,
    skill: built.skill,
    hintCount: withHints ? Math.min(built.hints.length, RULES.HINTS_PER_ITEM) : 0,
    hints: withHints ? built.hints.slice(0, RULES.HINTS_PER_ITEM) : [],
  };
}

/* ── Serving ─────────────────────────────────────────────────────────── */

/**
 * A set of items for one skill.
 *
 * kind:
 *   "build" | "stretch" | "exam"   graded practice, hints available
 *   "check"                        a revision check: ten mixed items, no hints
 */
export function serveSet(atomCode, kind = "build", seed = freshSeed(), count) {
  if (!hasGenerator(atomCode)) return null;
  const atom = getAtom(atomCode);
  if (!atom) return null;

  const isCheck = kind === "check";
  const size = count ?? (isCheck ? RULES.CHECK_ITEMS : RULES.PRACTICE[kind] ?? RULES.DRILL_ITEMS);

  const items = [];
  for (let i = 0; i < size; i += 1) {
    // A check deliberately MIXES the tiers, in the proportion the exam does: a
    // student who can only do the easy version has not learned the skill.
    const tier = isCheck ? (i < 4 ? "build" : i < 8 ? "stretch" : "exam") : kind;
    const built = build(atomCode, tier, seed, i);
    if (!built) continue;
    items.push(publicItem(built, { atomCode, tier, index: i, withHints: !isCheck }));
  }

  return {
    atom: atomCode,
    atomTitle: atom.title,
    iCan: atom.iCan,
    kind,
    seed,
    items,
    passMark: isCheck ? RULES.CHECK_NEEDED : null,
    total: items.length,
    timeLimitSeconds: isCheck ? items.length * RULES.CHECK_SECONDS_PER_ITEM : null,
  };
}

/**
 * A MIXED REVIEW: one question from each of several earlier skills.
 *
 * This is the course's interleaving. The house courses do it with module tests
 * that draw a fifth of their questions from earlier modules; here a lesson can
 * ask for a review drill directly, naming the skills it wants brought back.
 *
 * Stretch tier on purpose. A build-tier question is recognisable rather than
 * retrievable, and a review that can be passed by recognition has measured
 * nothing about whether the skill is still there.
 */
export function serveReview(atomCodes = [], seed = freshSeed(), count) {
  const usable = atomCodes.filter(hasGenerator).slice(0, count || atomCodes.length);
  const items = usable.map((code, i) => {
    const built = build(code, "stretch", seed, i);
    return publicItem(built, { atomCode: code, tier: "stretch", index: i, withHints: true });
  });
  return { kind: "review", seed, atoms: usable, items, total: items.length };
}

/** One rung of the hint ladder, fetched on demand so rungs can be counted. */
export function serveHint(atomCode, tier, seed, index, level = 0) {
  const built = build(atomCode, tier, seed, index);
  if (!built) return null;
  const capped = Math.max(0, Math.min(level, RULES.HINTS_PER_ITEM - 1));
  return {
    level: capped,
    hint: built.hints[capped] ?? null,
    remaining: Math.max(0, Math.min(built.hints.length, RULES.HINTS_PER_ITEM) - capped - 1),
  };
}

/* ── Marking ─────────────────────────────────────────────────────────── */

/** Which trap, if any, the student has walked into. */
function matchTrap(value, built) {
  for (const t of built.traps || []) {
    const result = check(value, {
      kind: built.input.kind,
      answer: t.is,
      tolerance: built.tolerance,
      ordered: built.ordered,
      variables: built.variables,
    });
    if (result.correct) return t;
  }
  return null;
}

/**
 * What is actually broken, when a student keeps missing one skill.
 *
 * A trap that names another skill beats everything else: a diagnosis from the
 * student's actual error is better evidence than one from the curriculum's
 * structure. Failing that, the nearest prerequisite is the honest guess, and
 * the copy says so rather than asserting it.
 */
export function diagnose(atomCode, misconception) {
  if (misconception?.atom && misconception.atom !== atomCode) {
    const cause = getAtom(misconception.atom);
    if (cause) {
      return {
        cause: cause.code,
        title: cause.title,
        iCan: cause.iCan,
        reason: "misconception",
      };
    }
  }
  const [nearest] = getAncestors(atomCode);
  const cause = nearest ? getAtom(nearest) : null;
  return cause
    ? { cause: cause.code, title: cause.title, iCan: cause.iCan, reason: "prerequisite" }
    : null;
}

/**
 * Mark one answer, and say what happens next.
 *
 *   correct        did they get it right
 *   feedback       what they actually did, named
 *   misconception  { id, atom } when a trap fired
 *   solution       the full working, on a wrong answer always
 *   next           "clear" | "twin" | "scaffold" — what the drill does now
 *   reallyAbout    the earlier skill this keeps coming back to, if any
 */
export function gradeItem({ atom, tier, seed, index, value, attempt = 1 }) {
  const built = build(atom, tier, seed, index);
  if (!built) return null;

  const result = check(value, {
    kind: built.input.kind,
    answer: built.answer,
    accept: built.accept,
    exact: built.exact,
    tolerance: built.tolerance,
    ordered: built.ordered,
    variables: built.variables,
    unit: built.unit,
  });

  if (result.correct) {
    return {
      correct: true,
      atom,
      feedback: "Correct.",
      solution: built.solution,
      next: "clear",
      misconception: null,
    };
  }

  const hit = matchTrap(value, built);
  const formNote = REASON_NOTES[result.reason] || null;

  // A trap beats a form note, because a trap says what the student did and a
  // form note only says what the marker wanted.
  const feedback =
    hit?.says ||
    formNote ||
    "Not right. Read the worked solution below, then try the new one underneath it.";

  const next =
    attempt >= RULES.MISSES_BEFORE_SCAFFOLD && built.scaffold ? "scaffold" : "twin";

  return {
    correct: false,
    atom,
    feedback,
    reason: result.reason,
    misconception: hit ? { id: hit.id, atom: hit.atom || atom } : null,
    // A form error is worth recording too — "keeps forgetting to simplify" is
    // a real and fixable pattern.
    formIssue: hit ? null : result.reason,
    solution: built.solution,
    correctAnswer: String(built.answer),
    next,
    hasScaffold: Boolean(built.scaffold),
    reallyAbout: attempt >= RULES.MISSES_BEFORE_SCAFFOLD ? diagnose(atom, hit) : null,
  };
}

/**
 * A fresh item of exactly the same kind, with different numbers.
 *
 * The twin is what turns a wrong answer into learning rather than into a
 * correction the student nods at and forgets. New seed, so nothing about it
 * can be answered from memory of the one before.
 */
export function makeTwin({ atom, tier, seed, index }) {
  const twinSeed = (hashString(`twin|${seed}|${atom}|${tier}|${index}`) ^ freshSeed()) >>> 0;
  const built = build(atom, tier, twinSeed, 0);
  if (!built) return null;
  return {
    ...publicItem(built, { atomCode: atom, tier, index: 0, withHints: true }),
    seed: twinSeed,
    isTwin: true,
  };
}

/** The item cut into single steps, for a student who has missed it twice. */
export function serveScaffold({ atom, tier, seed, index }) {
  const built = build(atom, tier, seed, index);
  if (!built?.scaffold) return null;
  return {
    atom,
    tier,
    seed,
    index,
    prompt: built.prompt,
    visual: built.visual,
    steps: built.scaffold.map((step, i) => ({
      index: i,
      prompt: step.prompt,
      input: step.input || { kind: "number" },
      hint: step.hint || null,
    })),
  };
}

export function gradeScaffoldStep({ atom, tier, seed, index, step, value }) {
  const built = build(atom, tier, seed, index);
  const definition = built?.scaffold?.[step];
  if (!definition) return null;

  const result = check(value, {
    kind: definition.input?.kind || "number",
    answer: definition.answer,
    ordered: definition.ordered,
    variables: definition.variables,
  });

  return {
    correct: result.correct,
    feedback: result.correct
      ? "Yes. Next step."
      : REASON_NOTES[result.reason] ||
        `Not that. ${definition.hint || "Look at the step again — this one is a single move, not the whole problem."}`,
    hint: definition.hint || null,
    correctAnswer: result.correct ? null : String(definition.answer),
    last: step >= built.scaffold.length - 1,
  };
}

/* ── Whole-set marking ───────────────────────────────────────────────── */

/**
 * Mark a revision check: ten mixed items on one skill.
 *
 * Returns the score and, for every miss, the misconception behind it. That
 * list is what lets the feedback say "three of your four misses were the same
 * denominators error", which is a plan; "you got 6 out of 10" is not.
 */
export function gradeCheck({ atom, seed, answers = {}, kind = "check" }) {
  if (!hasGenerator(atom)) return null;
  const set = serveSet(atom, kind, seed);
  if (!set) return null;

  const results = [];
  const misconceptions = [];
  let correctCount = 0;

  for (const served of set.items) {
    const built = build(atom, served.tier, seed, served.index);
    const value = answers[served.index] ?? answers[String(served.index)] ?? "";

    const marked = check(value, {
      kind: built.input.kind,
      answer: built.answer,
      accept: built.accept,
      exact: built.exact,
      tolerance: built.tolerance,
      ordered: built.ordered,
      variables: built.variables,
      unit: built.unit,
    });

    const hit = marked.correct ? null : matchTrap(value, built);
    if (marked.correct) correctCount += 1;
    else if (hit) misconceptions.push({ id: hit.id, atom: hit.atom || atom, says: hit.says });

    results.push({
      index: served.index,
      tier: served.tier,
      prompt: built.prompt,
      yourAnswer: String(value || "").trim() || null,
      correctAnswer: String(built.answer),
      isCorrect: marked.correct,
      // Why the right answer is right, shown either way: a lucky guess should
      // still be taught, and a student who was right for the wrong reason is
      // the one who fails the same question in a week.
      solution: built.solution,
      whyYoursWasWrong: marked.correct
        ? null
        : hit?.says || REASON_NOTES[marked.reason] || null,
      misconception: hit?.id || null,
    });
  }

  const total = set.items.length;
  const needed = RULES.CHECK_NEEDED;
  const passed = correctCount >= needed;

  // Tallied so the feedback can say "you made this same mistake three times",
  // which is a far more useful sentence than three separate corrections.
  const tally = {};
  for (const m of misconceptions) tally[m.id] = (tally[m.id] || 0) + 1;
  const dominant = Object.entries(tally).sort((x, y) => y[1] - x[1])[0] || null;

  return {
    atom,
    seed,
    score: Math.round((correctCount / total) * 100),
    correctCount,
    total,
    needed,
    passed,
    results,
    misconceptions,
    dominantMisconception: dominant
      ? {
          id: dominant[0],
          count: dominant[1],
          atom: misconceptions.find((m) => m.id === dominant[0])?.atom || atom,
          says: misconceptions.find((m) => m.id === dominant[0])?.says || null,
        }
      : null,
    /** Items to repair, in order. The drill walks this list before re-checking. */
    toRepair: results.filter((res) => !res.isCorrect).map((res) => res.index),
  };
}
