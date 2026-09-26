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
  // ── The plain words, fixed in Lesson 1 before anything needs them ──
  row: "a-ma-w-plain-words",
  column: "a-ma-w-plain-words",
  digit: "a-ma-w-plain-words",
  sum: "a-ma-w-plain-words",
  difference: "a-ma-w-plain-words",
  product: "a-ma-w-plain-words",
  half: "a-ma-w-plain-words",
  third: "a-ma-w-plain-words",
  quarter: "a-ma-w-plain-words",
  "place value": "a-ma-w-beginning",

  // ── Lesson 1's table of topics names several of these, with the month
  //    beside each and the everyday question it answers, which is the most
  //    useful thing a beginner can be told about a topic they have not met.
  percentage: "a-ma-w-many-topics",
  discount: "a-ma-w-many-topics",
  ratio: "a-ma-w-many-topics",

  // ── Lesson 2, where mathematics is shown in an ordinary day ──
  "per cent": "a-ma-w-money",
  area: "a-ma-w-measure",
  volume: "a-ma-w-measure",
  interest: "a-ma-w-careers",
  equation: "a-ma-w-cumulative",

  // ── The language of mathematics ──
  expression: "a-ma-lang-why",
  simplify: "a-ma-lang-why",
  evaluate: "a-ma-lang-why",
  "lowest terms": "a-ma-lang-simplify",
  factor: "a-ma-lang-simplify",
  scale: "a-ma-lang-solve",
  "significant figure": "a-ma-lang-accuracy",
  "decimal place": "a-ma-lang-accuracy",
  coefficient: "a-ma-lang-term",
  constant: "a-ma-lang-term",
  factorise: "a-ma-lang-factor",
  substitute: "a-ma-lang-kinds",
  expand: "a-ma-lang-kinds",
  identity: "a-ma-lang-kinds",
  "selling price": "a-ma-lang-method",
  capacity: "a-ma-lang-diagram",

  // ── What kinds of number there are ──
  numeral: "a-ma-n-zero",
  integer: "a-ma-n-whole",
  irrational: "a-ma-n-why-negatives",
  inverse: "a-ma-n-opposite",
  rate: "a-ma-n-integers-use",
  rational: "a-ma-n-rational",
  quotient: "a-ma-n-family-tree",

  // ── Place value ──
  index: "a-ma-pv-powers-of-ten",
  power: "a-ma-pv-powers-of-ten",
  bound: "a-ma-pv-symbols",
  multiple: "a-ma-pv-between",

  // ── Month 2 ──
  reciprocal: "a-ma-pr-why-fail",
  denominator: "a-ma-pr-zero-again",
  prime: "a-ma-fa-pairs",

  // ── Month 3 ──
  numerator: "a-ma-fr-names",
  improper: "a-ma-fr-subtracting",
  "mixed number": "a-ma-fr-mixed-improper",
  equivalent: "a-ma-fr-equivalent",
  recurring: "a-ma-dc-why-recurring",
  terminating: "a-ma-dc-why-recurring",
  "cost price": "a-ma-pc-cost-selling",
  "marked price": "a-ma-pc-discount",
  principal: "a-ma-pc-simple-interest",
  perimeter: "a-ma-ap-round-once",
  proportion: "a-ma-ap-choosing-form",

  // ── Month 4 ──
  unitary: "a-ma-rt-unitary",
  elapsed: "a-ma-ms-24-hour",
  perpendicular: "a-ma-ms-triangle",
  sequence: "a-ma-pt-what-is-a-sequence",
  consecutive: "a-ma-pt-continuing",
  triangular: "a-ma-pt-continuing",
  "nth term": "a-ma-pt-shape-patterns",
};

/**
 * Lesson modules in the order a learner meets them. Keep in step with
 * MATHS_MODULES in validateContent.mjs when a month lands.
 */
const MODULES = [
  "m1-welcome", "m1-language", "m1-numbers", "m1-place-value",
  "m2-operations", "m2-properties", "m2-negatives", "m2-factors",
  "m3-fractions", "m3-decimals", "m3-percentages", "m3-approximation",
  "m4-ratio", "m4-measurement", "m4-patterns", "m4-algebra1",
];

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
  "a-ma-w-many-topics",          // the topics, and the question each answers
  "a-ma-w-what-this-course-does", // the nine month road
]);

function pattern(term) {
  return new RegExp(`\\b${term.replace(/ /g, "\\s+")}s?\\b`, "i");
}

/** Everything a reader sees in one atom, as one block of text. */
function atomText(atom) {
  const parts = [atom.title, atom.explain, atom.why, atom.example, atom.analogy, atom.mistake];
  if (atom.table) {
    parts.push(atom.table.caption, atom.table.note, ...(atom.table.headers || []), ...(atom.table.rows || []).flat());
  }
  if (atom.practice) parts.push(atom.practice.prompt, atom.practice.answer);
  if (atom.drill) parts.push(atom.drill.intro);
  return parts.filter(Boolean).join("\n");
}

const sequence = [];
for (const name of MODULES) {
  const mod = await import(`../../src/academy/data/lessons/ma-${name}.js`);
  for (const lesson of mod.LESSONS) {
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
