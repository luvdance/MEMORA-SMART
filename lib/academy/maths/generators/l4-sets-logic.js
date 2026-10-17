import { item, trap, num, byTier } from "./kit.js";

/**
 * GENERATORS · LEVEL 4 · SETS AND LOGICAL REASONING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L4-N5 and L4-N6.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const list = (extra = {}) => ({ kind: "list", placeholder: "e.g. 2, 4, 6 (or 'none')", ...extra });
const choice = (options) => ({ kind: "choice", options });
const fmt = (s) => (s.length ? `{${s.join(", ")}}` : "∅");

/* ── L4-N5.1 · Set notation and types of sets ───────────────────────── */

generators["L4-N5.1"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["cardinal", "subsets"], stretch: ["cardinal", "subsets", "type"], exam: ["subsets", "type", "proper"] }));
  if (kind === "cardinal") {
    const lo = r.int(1, 10);
    const hi = lo + r.int(5, 15);
    const rule = r.pick(["even", "odd", "multiple of 3"]);
    const members = [];
    for (let k = lo; k <= hi; k += 1) if (rule === "even" ? k % 2 === 0 : rule === "odd" ? k % 2 === 1 : k % 3 === 0) members.push(k);
    return item({
      skill: "The number of elements in a set",
      prompt: `A = {x : x is ${rule === "multiple of 3" ? "a multiple of 3" : `an ${rule} number`}, ${lo} ≤ x ≤ ${hi}}. Find n(A).`,
      input: num(),
      answer: members.length,
      hints: ["n(A) is the number of elements in A.", "List the members: test each whole number from the lower to the upper limit.", `A = ${fmt(members.slice(0, 3))}...`],
      solution: [`A = ${fmt(members)}`, `n(A) = ${members.length}`],
      traps: [trap("counted-range", hi - lo + 1, "That counts every number in the range. Count only the members of A.")],
    });
  }
  if (kind === "subsets" || kind === "proper") {
    const n = r.int(2, 6);
    const proper = kind === "proper";
    return item({
      skill: proper ? "The number of proper subsets" : "The number of subsets",
      prompt: `A set has ${n} elements. How many ${proper ? "PROPER subsets" : "subsets"} does it have?`,
      input: num(),
      answer: proper ? 2 ** n - 1 : 2 ** n,
      hints: ["Each element is either in a subset or not: 2 choices per element.", `Number of subsets = 2ⁿ = 2^${n} = ${2 ** n}.`, proper ? "A proper subset is any subset except the set itself: subtract 1." : "This includes ∅ and the set itself."],
      solution: [`2^${n} = ${2 ** n} subsets`, proper ? `Proper subsets: ${2 ** n} − 1 = ${2 ** n - 1}` : null].filter(Boolean),
      traps: [trap("doubled-n", 2 * n, `It is 2 to the POWER ${n}, not 2 × ${n}.`), proper ? trap("all-subsets", 2 ** n, "That counts every subset. A proper subset excludes the set itself.") : null].filter(Boolean),
    });
  }
  const [desc, answer] = r.pick([
    ["{x : x is a whole number less than 0}", "empty"],
    ["{x : x is a prime number}", "infinite"],
    ["{days of the week}", "finite"],
    ["{x : x is an even number between 7 and 8}", "empty"],
    ["{multiples of 5}", "infinite"],
    ["{letters of the alphabet}", "finite"],
  ]);
  return item({
    skill: "Finite, infinite and empty sets",
    prompt: `Is the set ${desc} finite, infinite or empty?`,
    input: choice(["finite", "infinite", "empty"]),
    answer,
    hints: ["An EMPTY set (∅ or { }) has no members.", "A FINITE set can be counted to an end.", "An INFINITE set goes on for ever."],
    solution: [`${desc} is ${answer === "empty" ? "empty: it has no members" : answer === "finite" ? "finite: its members can be counted" : "infinite: its members never end"}.`],
    traps: [trap("misread", answer === "empty" ? "finite" : answer === "finite" ? "infinite" : "finite", "Read the rule for membership carefully.")],
  });
};

/* ── L4-N5.2 · Union, intersection and complement ───────────────────── */

generators["L4-N5.2"] = (r, tier) => {
  const U = Array.from({ length: 10 }, (_, i) => i + 1);
  const A = r.sample(U, r.int(3, 6)).sort((a, b) => a - b);
  const B = r.sample(U, r.int(3, 6)).sort((a, b) => a - b);
  const op = r.pick(byTier(tier, { build: ["∪", "∩"], stretch: ["∪", "∩", "A′"], exam: ["A′ ∩ B", "(A ∪ B)′", "A ∩ B′"] }));
  const comp = (S) => U.filter((x) => !S.includes(x));
  const result = {
    "∪": [...new Set([...A, ...B])],
    "∩": A.filter((x) => B.includes(x)),
    "A′": comp(A),
    "A′ ∩ B": comp(A).filter((x) => B.includes(x)),
    "(A ∪ B)′": comp([...new Set([...A, ...B])]),
    "A ∩ B′": A.filter((x) => !B.includes(x)),
  }[op].sort((a, b) => a - b);
  const label = op === "∪" ? "A ∪ B" : op === "∩" ? "A ∩ B" : op;
  const wrong = op === "∪" ? A.filter((x) => B.includes(x)) : op === "∩" ? [...new Set([...A, ...B])].sort((a, b) => a - b) : null;
  return item({
    skill: "Union, intersection and complement",
    prompt: `U = {1, 2, ..., 10}, A = ${fmt(A)}, B = ${fmt(B)}.\n\nList the elements of ${label}. Type 'none' if it is empty.`,
    input: list(),
    answer: result.length ? result.map(String) : ["none"],
    hints: ["∪ (union): in A OR B (or both). ∩ (intersection): in BOTH A and B.", "′ (complement): everything in U that is NOT in the set.", "Work from the inside out for a combined expression."],
    solution: [`${label} = ${fmt(result)}`],
    traps: wrong && wrong.length ? [trap("union-intersection-swapped", wrong.map(String), "∪ means OR (everything in either); ∩ means AND (only what is in both).")] : [],
  });
};

/* ── L4-N5.3 · Two-set Venn problems ────────────────────────────────── */

generators["L4-N5.3"] = (r, tier) => {
  const both = r.int(3, 15);
  const onlyA = r.int(3, 20);
  const onlyB = r.int(3, 20);
  const neither = r.int(0, 10);
  const total = both + onlyA + onlyB + neither;
  const nA = onlyA + both;
  const nB = onlyB + both;
  const ask = r.pick(byTier(tier, { build: ["both", "union"], stretch: ["both", "onlyA", "neither"], exam: ["both", "neither", "onlyA"] }));
  const spec = {
    both: { q: `${nA} play football and ${nB} play basketball. ${neither} play neither. How many play BOTH?`, a: both, s: [`Play at least one: ${total} − ${neither} = ${total - neither}`, `n(F ∩ B) = n(F) + n(B) − n(F ∪ B) = ${nA} + ${nB} − ${total - neither} = ${both}`], t: trap("ignored-neither", nA + nB - total, `Take the ${neither} who play neither away from the total first.`) },
    union: { q: `${nA} play football, ${nB} play basketball and ${both} play both. How many play at least one of the two?`, a: nA + nB - both, s: [`n(F ∪ B) = ${nA} + ${nB} − ${both} = ${nA + nB - both}`], t: trap("added", nA + nB, `The ${both} who play both have been counted twice: subtract them once.`) },
    onlyA: { q: `${nA} play football, ${nB} play basketball and ${both} play both. How many play football ONLY?`, a: onlyA, s: [`Football only = ${nA} − ${both} = ${onlyA}`], t: trap("all-football", nA, `That includes the ${both} who also play basketball.`) },
    neither: { q: `${nA} play football, ${nB} play basketball and ${both} play both. How many play neither?`, a: neither, s: [`At least one: ${nA} + ${nB} − ${both} = ${total - neither}`, `Neither: ${total} − ${total - neither} = ${neither}`], t: trap("double-counted", total - nA - nB, `Do not count the ${both} who play both twice.`) },
  }[ask];
  return item({
    skill: "Solving a two-set Venn diagram problem",
    prompt: `In a class of ${total} students, ${spec.q}`,
    input: num(),
    answer: spec.a,
    hints: ["Draw two overlapping circles inside a rectangle for the whole class.", "Fill in the overlap FIRST, then 'only' regions, then those outside both.", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)."],
    solution: spec.s,
    traps: [spec.t],
  });
};

/* ── L4-N5.4 · Three-set Venn problems ──────────────────────────────── */

generators["L4-N5.4"] = (r, tier) => {
  const abc = r.int(1, 5);
  const ab = r.int(1, 6);
  const ac = r.int(1, 6);
  const bc = r.int(1, 6);
  const a = r.int(2, 12);
  const b = r.int(2, 12);
  const c = r.int(2, 12);
  const none = r.int(0, 6);
  const nA = a + ab + ac + abc;
  const nB = b + ab + bc + abc;
  const nC = c + ac + bc + abc;
  const total = a + b + c + ab + ac + bc + abc + none;
  const ask = r.pick(["onlyA", "union", "exactly-one"]);
  const spec = {
    onlyA: { q: "How many study Maths ONLY?", a, s: [`Maths only = n(M) − (M∩P only) − (M∩C only) − (all three) = ${nA} − ${ab} − ${ac} − ${abc} = ${a}`], t: trap("subtracted-pairs-wrong", nA - (ab + abc) - (ac + abc), "The pair numbers given INCLUDE the students taking all three. Subtract the 'all three' only once.") },
    union: { q: "How many study at least one of the three subjects?", a: total - none, s: [`n(M ∪ P ∪ C) = n(M) + n(P) + n(C) − n(M∩P) − n(M∩C) − n(P∩C) + n(M∩P∩C)`, `= ${nA} + ${nB} + ${nC} − ${ab + abc} − ${ac + abc} − ${bc + abc} + ${abc} = ${total - none}`], t: trap("forgot-triple", total - none - abc, "Add the all-three region back at the end: it was subtracted three times and added three times.") },
    "exactly-one": { q: "How many study exactly ONE of the three subjects?", a: a + b + c, s: [`Only M = ${a}, only P = ${b}, only C = ${c}`, `Exactly one = ${a + b + c}`], t: trap("at-least-one", total - none, "That is AT LEAST one. Exactly one means only one of the three.") },
  }[ask];
  return item({
    skill: "Solving a three-set Venn diagram problem",
    prompt: `In a group of ${total} students: ${nA} study Maths, ${nB} Physics and ${nC} Chemistry. ${ab + abc} study Maths and Physics, ${ac + abc} Maths and Chemistry, ${bc + abc} Physics and Chemistry, and ${abc} study all three. ${none} study none of them.\n\n${spec.q}`,
    input: num(),
    answer: spec.a,
    hints: ["Draw three overlapping circles. Fill in the centre (all three) first.", `Then each 'two subjects only' region: e.g. Maths and Physics only = ${ab + abc} − ${abc} = ${ab}.`, "Then each 'one subject only' region, by subtracting from the circle totals."],
    solution: spec.s,
    traps: [spec.t],
  });
};

/* ── L4-N6 · Logical reasoning ──────────────────────────────────────── */

generators["L4-N6.1"] = (r, tier) => {
  const items = [
    ["Lagos is in Nigeria.", "statement (true)"],
    ["7 is an even number.", "statement (false)"],
    ["Close the door.", "not a statement"],
    ["Is it raining?", "not a statement"],
    ["The sum of the angles of a triangle is 180°.", "statement (true)"],
    ["Every prime number is odd.", "statement (false)"],
    ["What a beautiful day!", "not a statement"],
    ["2 + 3 = 6", "statement (false)"],
  ];
  const [text, answer] = r.pick(items);
  return item({
    skill: "Statements and their truth values",
    prompt: `Is this a statement? If it is, is it true or false?\n\n"${text}"`,
    input: choice(["statement (true)", "statement (false)", "not a statement"]),
    answer,
    hints: ["A STATEMENT is a sentence that is either true or false, but not both.", "Questions, commands and exclamations are not statements.", "If it is a statement, decide whether it is actually true."],
    solution: [answer === "not a statement" ? "It cannot be true or false (a question, command or exclamation), so it is not a statement." : `It is a statement, and it is ${answer.includes("true") ? "true" : "false"}.`],
    traps: [trap("misjudged", answer === "not a statement" ? "statement (true)" : "not a statement", "A statement must be either true or false.")],
  });
};

generators["L4-N6.2"] = (r, tier) => {
  const [p, neg, wrong] = r.pick([
    ["All students passed the test.", "Some students did not pass the test.", "No student passed the test."],
    ["Some lions are friendly.", "No lions are friendly.", "Some lions are not friendly."],
    ["Ada is tall.", "Ada is not tall.", "Ada is short and fat."],
    ["Every prime number is odd.", "Some prime numbers are not odd.", "Every prime number is even."],
    ["No bird can swim.", "Some birds can swim.", "All birds can swim."],
  ]);
  return item({
    skill: "Negating a statement",
    prompt: `Which is the negation (~p) of the statement p: "${p}"?`,
    input: choice([neg, wrong].sort()),
    answer: neg,
    hints: ["The negation is true exactly when the original is false.", "The negation of 'all ... are' is 'some ... are not'. The negation of 'some ... are' is 'no ... are'.", "Do not go to the opposite extreme: that is a stronger claim than the negation."],
    solution: [`~p: "${neg}"`],
    traps: [trap("opposite-extreme", wrong, "That is not the negation. It only needs ONE counter-example to make p false, not all of them.")],
  });
};

generators["L4-N6.3"] = (r, tier) => {
  const [p, q] = r.pick([
    ["it rains", "the ground is wet"],
    ["a number is divisible by 4", "it is even"],
    ["Tunde studies", "he passes"],
    ["a shape is a square", "it has four sides"],
  ]);
  const ask = r.pick(byTier(tier, { build: ["converse", "contrapositive"], stretch: ["converse", "contrapositive", "inverse"], exam: ["equivalent", "contrapositive", "converse"] }));
  const forms = {
    converse: `If ${q}, then ${p}.`,
    inverse: `If not (${p}), then not (${q}).`,
    contrapositive: `If not (${q}), then not (${p}).`,
  };
  const answer = ask === "equivalent" ? forms.contrapositive : forms[ask];
  const options = [forms.converse, forms.inverse, forms.contrapositive];
  return item({
    skill: "Converse, inverse and contrapositive",
    prompt: ask === "equivalent" ? `Which statement is logically EQUIVALENT to: "If ${p}, then ${q}"?` : `What is the ${ask.toUpperCase()} of: "If ${p}, then ${q}"?`,
    input: choice(options),
    answer,
    hints: ["For p ⇒ q: the converse is q ⇒ p, the inverse is ~p ⇒ ~q, the contrapositive is ~q ⇒ ~p.", "Only the CONTRAPOSITIVE always has the same truth value as the original.", ask === "equivalent" ? "Which one swaps AND negates?" : `The ${ask} is ${ask === "converse" ? "q ⇒ p" : ask === "inverse" ? "~p ⇒ ~q" : "~q ⇒ ~p"}.`],
    solution: [`p ⇒ q: "If ${p}, then ${q}."`, `${ask === "equivalent" ? "Contrapositive (equivalent)" : ask[0].toUpperCase() + ask.slice(1)}: "${answer}"`],
    traps: [trap("converse-confusion", ask === "converse" ? forms.contrapositive : forms.converse, "The converse just swaps p and q; it is NOT equivalent to the original. The contrapositive swaps and negates both.")],
  });
};

generators["L4-N6.4"] = (r, tier) => {
  const [premises, conclusion, valid, why] = r.pick([
    ["All doctors are graduates. Ngozi is a doctor.", "Ngozi is a graduate.", true, "Ngozi is inside the doctors circle, which is inside the graduates circle."],
    ["All doctors are graduates. Ngozi is a graduate.", "Ngozi is a doctor.", false, "Ngozi could be in the graduates circle but outside the doctors circle."],
    ["No fish can fly. A shark is a fish.", "A shark cannot fly.", true, "The fish circle and the flying circle do not overlap, and sharks are inside fish."],
    ["Some boys are tall. Emeka is a boy.", "Emeka is tall.", false, "Only SOME boys are tall: Emeka may be in the part of the boys circle that is not tall."],
    ["If it rains, the match is cancelled. The match is not cancelled.", "It did not rain.", true, "This is the contrapositive: ~q ⇒ ~p is valid."],
    ["If it rains, the match is cancelled. The match is cancelled.", "It rained.", false, "Affirming the consequent: the match could be cancelled for another reason."],
  ]);
  return item({
    skill: "Testing an argument with a Venn diagram",
    prompt: `${premises}\nConclusion: ${conclusion}\n\nIs the argument valid?`,
    input: choice(["valid", "not valid"]),
    answer: valid ? "valid" : "not valid",
    hints: ["Draw the premises as circles, one inside another or not overlapping.", "An argument is VALID only if the conclusion MUST be true whenever the premises are.", "Try to draw a picture where the premises are true but the conclusion is false. If you can, it is not valid."],
    solution: [why, valid ? "The conclusion must follow: valid." : "The conclusion does not have to follow: not valid."],
    traps: [trap("plausible", valid ? "not valid" : "valid", "A conclusion that might be true is not enough: it must be FORCED by the premises.")],
  });
};

export default generators;
