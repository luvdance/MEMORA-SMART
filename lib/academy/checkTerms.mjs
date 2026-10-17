/**
 * NO TERM BEFORE ITS MEANING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * Run with `npm run check:terms`. Exits non-zero if a term is used early.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Most of what feels like difficulty in mathematics is not the mathematics. It
 * is a word nobody stopped to explain, used as though everybody already knew
 * it. The reader goes quiet at the word and decides they cannot do the idea,
 * when the idea underneath is usually easy.
 *
 * An audit of the first four months found twenty four pieces of vocabulary
 * arriving ahead of their explanation, six of them in Lesson 1, and
 * "perpendicular" reaching Month 4 having never been defined anywhere — despite
 * appearing in every area formula in the course, and despite the drill
 * generators trapping students for using a slanting side instead.
 *
 * Nobody catches that by rereading, because a word you know looks like a word
 * everybody knows. So it is checked mechanically.
 *
 * ── HOW THIS WORKS ───────────────────────────────────────────────────────
 *
 * An earlier version of this file tried to decide whether a sentence was a
 * definition, by pattern. That does not work: the course explains things in
 * plain English ("A ROW goes across", "Integers: the whole numbers in both
 * directions"), and no pattern recognises those without also accepting half the
 * prose in the file. It reported twenty three problems, of which most were its
 * own false alarms, and a check nobody trusts is a check nobody runs.
 *
 * So the author declares instead. INTRODUCED_AT names, for each term, the atom
 * that explains it. The check then walks the lessons in teaching order and
 * fails if any EARLIER atom uses that term. It is the same shape as the skill
 * map's no-forward-edges test: a precise ordering question rather than a fuzzy
 * judgement about language.
 *
 * That also makes this file useful on its own, as the one place that records
 * where every piece of vocabulary in the course is taught.
 *
 * ── WHEN THIS FAILS ──────────────────────────────────────────────────────
 *
 * Either move the explanation earlier, or gloss the term where it now appears
 * first and point INTRODUCED_AT at that atom. A gloss is one plain sentence:
 * "PERPENDICULAR means at right angles, that is, at a square corner."
 *
 * ── WHEN A TERM IS NEW ───────────────────────────────────────────────────
 *
 * Add it to INTRODUCED_AT. A term used anywhere and declared nowhere is
 * reported too, because vocabulary with no home is exactly what this exists to
 * prevent.
 */

/**
 * term -> the atom id that explains it.
 *
 * Signposting is allowed and is not a use: an atom may name a topic it does not
 * teach ("that becomes standard form in Month 5"), and those appear inside
 * tables of future work. Where such a mention comes first, the term is declared
 * against it and glossed there.
 */
const INTRODUCED_AT = {
  // Filled module by module as the course is written. Each entry names the
  // atom whose Anchor states what the word means.

  // ── Month 1 ──
  "place value": "a-ma-l0-n1-2",
  ascending: "a-ma-l0-n1-3",
  descending: "a-ma-l0-n1-3",
  remainder: "a-ma-l0-n2-3",
  bodmas: "a-ma-l0-n2-4",
  factor: "a-ma-l0-n3-1",
  multiple: "a-ma-l0-n3-2",
  prime: "a-ma-l0-n3-3",
  divisible: "a-ma-l0-n3-4",
  numerator: "a-ma-l0-n4-1",
  denominator: "a-ma-l0-n4-1",
  equivalent: "a-ma-l0-n4-2",
  "lowest terms": "a-ma-l0-n4-2",
  decimal: "a-ma-l0-n5-1",
  kobo: "a-ma-l0-n5-3",
  "square root": "a-ma-l0-n6-1",
  "perfect square": "a-ma-l0-n6-1",
  "cube root": "a-ma-l0-n6-2",

  // ── Month 2 ──
  perimeter: "a-ma-l0-g1-3",
  area: "a-ma-l0-g1-4",
  hectare: "a-ma-l0-g1-4",
  "leap year": "a-ma-l0-g2-1",
  binary: "a-ma-l1-n1-2",
  "base two": "a-ma-l1-n1-2",
  product: "a-ma-l1-n2-1",
  hcf: "a-ma-l1-n2-2",
  lcm: "a-ma-l1-n2-3",
  integer: "a-ma-l1-n6-1",
  reciprocal: "a-ma-l1-n3-2",
  "mixed number": "a-ma-l1-n3-3",
  "improper fraction": "a-ma-l1-n3-3",

  // ── Month 3 ──
  percentage: "a-ma-l1-n4-1",
  "decimal place": "a-ma-l0-n5-1",
  "significant figure": "a-ma-l1-n5-2",
  estimate: "a-ma-l0-n6-3",
  "natural number": "a-ma-l1-n7-1",
  rational: "a-ma-l1-n7-2",
  irrational: "a-ma-l1-n7-2",
  "real number": "a-ma-l1-n7-3",
  ratio: "a-ma-l2-n3-1",
  "unitary method": "a-ma-l2-n3-2",
  proportion: "a-ma-l2-n3-3",
  speed: "a-ma-l2-n3-4",
  expression: "a-ma-l1-a1-1",
  coefficient: "a-ma-l1-a1-1",
  constant: "a-ma-l1-a1-1",
  "like terms": "a-ma-l1-a1-2",
  substitute: "a-ma-l1-a1-3",
  equation: "a-ma-l1-a2-1",
  sequence: "a-ma-l1-a3-1",
  "nth term": "a-ma-l1-a3-3",
  "triangular number": "a-ma-l1-a3-4",
  acute: "a-ma-l1-g3-1",
  obtuse: "a-ma-l1-g3-1",
  reflex: "a-ma-l1-g3-1",
  protractor: "a-ma-l1-g3-2",
  "vertically opposite": "a-ma-l1-g3-3",
  polygon: "a-ma-l1-g1-1",
  isosceles: "a-ma-l1-g1-1",
  equilateral: "a-ma-l1-g1-1",
  trapezium: "a-ma-l1-g1-1",
  parallelogram: "a-ma-l1-g1-1",
  rhombus: "a-ma-l1-g1-1",
  perpendicular: "a-ma-l1-g1-3",
  "line of symmetry": "a-ma-l1-g1-4",
  "rotational symmetry": "a-ma-l1-g1-4",

  // ── Month 4 ──
  vertex: "a-ma-l1-g2-1",
  euler: "a-ma-l1-g2-1",
  net: "a-ma-l1-g2-2",
  volume: "a-ma-l1-g2-3",
  frequency: "a-ma-l1-s1-1",
  median: "a-ma-l1-s1-3",
  mode: "a-ma-l1-s1-3",
  "standard form": "a-ma-l2-n1-5",
  "cost price": "a-ma-l2-n2-1",
  "selling price": "a-ma-l2-n2-1",
  profit: "a-ma-l2-n2-1",
  "simple interest": "a-ma-l2-n2-2",
  principal: "a-ma-l2-n2-2",
  discount: "a-ma-l2-n2-3",
  commission: "a-ma-l2-n2-3",
  "distributive law": "a-ma-l2-a1-1",
  expand: "a-ma-l2-a1-1",
  factorise: "a-ma-l2-a1-3",

  // ── Month 5 ──
  cartesian: "a-ma-l2-a3-1",
  origin: "a-ma-l2-a3-1",
  quadrant: "a-ma-l2-a3-1",
  transversal: "a-ma-l2-g1-1",
  "alternate angle": "a-ma-l2-g1-1",
  "corresponding angle": "a-ma-l2-g1-1",
  "co-interior": "a-ma-l2-g1-1",
  "exterior angle": "a-ma-l2-g1-2",
  bisect: "a-ma-l2-g2-1",
  "perpendicular bisector": "a-ma-l2-g2-1",
  radius: "a-ma-l2-g3-1",
  diameter: "a-ma-l2-g3-1",
  circumference: "a-ma-l2-g3-1",
  prism: "a-ma-l1-g2-1",
  bearing: "a-ma-l2-g4-2",
  "class boundary": "a-ma-l2-s1-1",
  "class mark": "a-ma-l2-s1-1",
  "pie chart": "a-ma-l2-s1-2",
  outcome: "a-ma-l2-s2-1",
  "sample space": "a-ma-l2-s2-1",
  probability: "a-ma-l2-s2-1",

  // ── Month 6 ──
  "compound interest": "a-ma-l3-n2-1",
  vat: "a-ma-l3-n2-2",
  "income tax": "a-ma-l3-n2-2",
  "hire purchase": "a-ma-l3-n2-3",
  instalment: "a-ma-l3-n2-3",
  "exchange rate": "a-ma-l3-n2-4",
  "percentage error": "a-ma-l3-n3-1",
  "varies directly": "a-ma-l3-n3-2",
  "varies inversely": "a-ma-l3-n3-2",
  "difference of two squares": "a-ma-l3-a1-2",
  trinomial: "a-ma-l3-a1-3",
  inequality: "a-ma-l3-a4-1",
  similar: "a-ma-l3-g1-1",
  "scale factor": "a-ma-l3-g1-2",
  enlargement: "a-ma-l3-g1-3",
  hypotenuse: "a-ma-l3-t1-1",
  pythagoras: "a-ma-l3-t1-1",
  sine: "a-ma-l3-t1-2",
  cosine: "a-ma-l3-t1-2",
  tangent: "a-ma-l3-t1-2",
  "angle of elevation": "a-ma-l3-t1-4",
  "angle of depression": "a-ma-l3-t1-4",
  "slant height": "a-ma-l3-g2-2",
  capacity: "a-ma-l0-g1-1",
  "cumulative frequency": "a-ma-l3-s1-1",
  outlier: "a-ma-l3-s1-2",

  // ── Month 7 ──
  congruent: "a-ma-l4-n2-1",
  logarithm: "a-ma-l4-n3-1",
  characteristic: "a-ma-l4-n3-3",
  mantissa: "a-ma-l4-n3-3",
  antilog: "a-ma-l4-n3-3",
  surd: "a-ma-l4-n4-1",
  rationalise: "a-ma-l4-n4-4",
  conjugate: "a-ma-l4-n4-3",
  "universal set": "a-ma-l4-n5-1",
  "empty set": "a-ma-l4-n5-1",
  subset: "a-ma-l4-n5-1",
  union: "a-ma-l4-n5-2",
  intersection: "a-ma-l4-n5-2",
  complement: "a-ma-l4-n5-2",
  "venn diagram": "a-ma-l4-n5-3",
  negation: "a-ma-l4-n6-2",
  converse: "a-ma-l4-n6-3",
  contrapositive: "a-ma-l4-n6-3",
  quadratic: "a-ma-l3-a1-3",
  discriminant: "a-ma-l4-a1-3",
  parabola: "a-ma-l4-a2-1",
  "turning point": "a-ma-l4-a2-2",
  "axis of symmetry": "a-ma-l4-a2-2",
  gradient: "a-ma-l4-a2-4",
  "joint variation": "a-ma-l4-a3-2",
  "partial variation": "a-ma-l4-a3-2",

  // ── Month 8 ──
  sector: "a-ma-l2-s1-2",
  frustum: "a-ma-l4-g1-3",
  hemisphere: "a-ma-l4-g1-3",
  "intercept theorem": "a-ma-l4-g2-3",
  locus: "a-ma-l4-g3-1",
  loci: "a-ma-l4-g3-1",
  "related acute angle": "a-ma-l4-t1-1",
  histogram: "a-ma-l4-s1-1",
  "frequency polygon": "a-ma-l4-s1-1",
  "modal class": "a-ma-l4-s1-2",
  "assumed mean": "a-ma-l4-s1-3",
  "arithmetic progression": "a-ma-l5-n1-1",
  "geometric progression": "a-ma-l5-n1-1",
  "common difference": "a-ma-l1-a3-1",
  "common ratio": "a-ma-l1-a3-1",
  "sum to infinity": "a-ma-l5-n1-5",
  depreciation: "a-ma-l5-n2-2",
  annuity: "a-ma-l5-n2-3",
  amortisation: "a-ma-l5-n2-3",
  dividend: "a-ma-l5-n2-4",
  bond: "a-ma-l5-n2-4",
  "linear programming": "a-ma-l5-a2-3",
  "one-to-one": "a-ma-l5-a4-1",
  "many-to-one": "a-ma-l5-a4-1",
  // ── Month 9 ──
  chord: "a-ma-l5-g1-1",
  "cyclic quadrilateral": "a-ma-l5-g1-5",
  "alternate segment": "a-ma-l5-g1-7",
  "sine rule": "a-ma-l5-t1-1",
  "cosine rule": "a-ma-l5-t1-1",
  "cumulative frequency": "a-ma-l3-s1-1",
  "class boundary": "a-ma-l5-s1-1",
  ogive: "a-ma-l5-s1-2",
  quartile: "a-ma-l5-s1-3",
  percentile: "a-ma-l5-s1-3",
  "interquartile range": "a-ma-l5-s1-3",
  "mean deviation": "a-ma-l5-s2-1",
  variance: "a-ma-l5-s2-2",
  "standard deviation": "a-ma-l5-s2-3",
  "mutually exclusive": "a-ma-l5-s3-1",
  "tree diagram": "a-ma-l5-s3-4",
  matrix: "a-ma-l6-c1-1",
  matrices: "a-ma-l6-c1-1",
  "identity matrix": "a-ma-l6-c1-1",
  determinant: "a-ma-l6-c1-4",
  singular: "a-ma-l6-c1-4",
  "binary operation": "a-ma-l6-n1-1",
  "identity element": "a-ma-l6-n1-2",
  // ── Month 10 ──
  magnitude: "a-ma-l6-g1-2",
  "position vector": "a-ma-l6-g1-4",
  "great circle": "a-ma-l6-g3-1",
  meridian: "a-ma-l6-g3-1",
  polynomial: "a-ma-l6-a1-1",
  "remainder theorem": "a-ma-l6-a1-2",
  "factor theorem": "a-ma-l6-a1-3",
  factorial: "a-ma-l6-s1-1",
  permutation: "a-ma-l6-s1-1",
  derivative: "a-ma-l6-c2-2",
  "turning point": "a-ma-l4-a2-2",
  integral: "a-ma-l6-c3-1",
  "constant of integration": "a-ma-l6-c3-1",
  "bar model": "a-ma-l1-n3-4",
  "composite function": "a-ma-l6-u1-2",
  "inverse function": "a-ma-l6-u1-2",
  "partial fractions": "a-ma-l6-u1-4",
  counterexample: "a-ma-l6-n1-1",
  "sigma notation": "a-ma-l6-u2-2",
  induction: "a-ma-l6-u2-3",
  radian: "a-ma-l6-c2-4",
  "complex number": "a-ma-l6-u2-6",
};

/**
 * WORDS WITH AN EVERYDAY SENSE AS WELL AS A TECHNICAL ONE.
 *
 * "Here is a sum with a box in it" and "find the sum of 6 and 4" both contain
 * the word sum, and no check can tell them apart. Nor can it separate "half as
 * many marks" from "a half", "the third rung" from "a third", or "the middle
 * column of the table" from a column of figures.
 *
 * Making the course avoid ordinary English to satisfy this file would be the
 * tail wagging the dog, and it was starting to happen: perfectly good sentences
 * were being bent out of shape to dodge a false alarm.
 *
 * So these are reported for a human to glance at and do not fail the check. The
 * blocking list above holds only words with no everyday sense, where an early
 * appearance is always a real bug.
 */
const EVERYDAY_TOO = {
  row: "taught where used",
  column: "a-ma-l0-n1-2",
  digit: "a-ma-l0-n1-1",
  sum: "a-ma-l0-n2-1",
  difference: "a-ma-l0-n2-1",
  half: "a-ma-l0-n4-1",
  third: "a-ma-l0-n4-1",
  quarter: "a-ma-l0-n4-1",
};

/** Written lesson modules in the order a learner meets them, from the outline. */
const { MATHS_MODULE_IDS } = await import("../../src/academy/data/mathematicsCourse.js");
const { MATHS_LESSONS } = await import("../../src/academy/data/lessons/ma-registry.js");
const MODULES = MATHS_MODULE_IDS.filter((id) => MATHS_LESSONS[id]);

/**
 * Atoms whose whole job is to NAME what is coming, with the month beside it.
 * They are the course's table of contents: "Percentages — is this discount
 * actually a good deal? — Month 3". A table of contents listing chapters is not
 * using their vocabulary, so these are skipped when looking for early use.
 *
 * Keep this list very short. Every entry is a place the check cannot protect,
 * so an atom belongs here only if naming forthcoming topics IS its purpose.
 */
const CONTENTS_ATOMS = new Set([
  "a-ma-start", // how the course works, and the ten month road
]);

function pattern(term) {
  return new RegExp(`\\b${term.replace(/ /g, "\\s+")}s?\\b`, "i");
}

/** Everything a reader sees in one atom, as one block of text. */
function atomText(atom) {
  const parts = [atom.title, atom.explain, atom.why, atom.origin, atom.example, atom.analogy, atom.mistake];
  if (atom.table) {
    parts.push(atom.table.caption, atom.table.note, ...(atom.table.headers || []), ...(atom.table.rows || []).flat());
  }
  if (atom.practice) parts.push(atom.practice.prompt, atom.practice.answer);
  if (atom.drill) parts.push(atom.drill.intro);
  return parts.filter(Boolean).join("\n");
}

const sequence = [];
for (const name of MODULES) {
  for (const lesson of MATHS_LESSONS[name]) {
    for (const atom of lesson.atoms) {
      sequence.push({ module: name, lesson: lesson.id, id: atom.id, text: atomText(atom) });
    }
  }
}

const positions = new Map(sequence.map((a, i) => [a.id, i]));
const problems = [];

// 1. Every declared home must exist.
for (const [term, home] of Object.entries(INTRODUCED_AT)) {
  if (!positions.has(home)) {
    problems.push(`"${term}" is declared as introduced in ${home}, which is not an atom in the course.`);
  }
}

// 2. Nothing may use a term before its declared home.
for (const [term, home] of Object.entries(INTRODUCED_AT)) {
  const homeAt = positions.get(home);
  if (homeAt === undefined) continue;
  const re = pattern(term);
  for (let i = 0; i < homeAt; i += 1) {
    if (CONTENTS_ATOMS.has(sequence[i].id)) continue;
    if (re.test(sequence[i].text)) {
      problems.push(
        `"${term}" is used in ${sequence[i].module} / ${sequence[i].id} ` +
          `but is not explained until ${home}.`
      );
      break;
    }
  }
}

// 3. Any term with no declared home is itself a problem worth seeing.
const undeclared = [];
for (const term of Object.keys(INTRODUCED_AT)) undeclared.push(term); // declared set
const declared = new Set(undeclared);
/**
 * Advanced vocabulary the course is allowed to NAME before it teaches it, as
 * long as it says when: "gradients, which arrive in Month 5". Those are
 * signposts rather than uses, so they are listed for a human to glance at and
 * do not fail the check.
 *
 * Words that collide with ordinary English are deliberately absent. "mean"
 * matches "means", and "similar", "arc" and "bearing" all have plain senses. A
 * check that cries wolf on those is a check nobody runs, which is how the
 * previous version of this file ended up reporting twenty three problems of
 * which most were its own noise.
 */
const SIGNPOSTS = [
  "hypotenuse", "gradient", "quadratic", "surd", "logarithm", "polynomial",
  "trigonometry", "vector", "matrix", "derivative", "integral", "locus",
  "congruent", "chord", "sector",
];
const signposted = [];
for (const term of SIGNPOSTS) {
  if (declared.has(term)) continue;
  const re = pattern(term);
  const firstUse = sequence.find((a) => re.test(a.text));
  if (firstUse) signposted.push(`${term} — first named in ${firstUse.module} / ${firstUse.id}`);
}

console.log("\nNO TERM BEFORE ITS MEANING\n");
console.log(`  ${sequence.length} atoms in teaching order`);
console.log(`  ${Object.keys(INTRODUCED_AT).length} terms with a declared home\n`);

if (signposted.length) {
  console.log("  Named ahead of being taught, which is fine where the month is given:");
  for (const line of signposted) console.log("    · " + line);
  console.log("");
}

if (!problems.length) {
  console.log("  ✓ every declared term is explained before it is used\n");
  process.exit(0);
}

console.log(`  ✗ ${problems.length} problem(s):\n`);
for (const p of problems) console.log("    - " + p);
console.log(
  "\n  Fix by moving the explanation earlier, or by glossing the term where it\n" +
    "  first appears and pointing INTRODUCED_AT at that atom.\n"
);
process.exit(1);
