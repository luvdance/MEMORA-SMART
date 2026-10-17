/**
 * FINAL EXAM SELF-TEST
 *
 * Run:  npm run test:exam
 *
 * The exam makes four promises that cannot be verified by reading the code:
 *
 *   1. Every candidate sits a paper of the same SHAPE  (blueprint compliance)
 *   2. No two candidates sit the same paper             (distinctness)
 *   3. The same candidate always gets their paper back  (determinism)
 *   4. The paper sent to the browser contains no answers (no leakage)
 *
 * So this file sits thousands of seeds and measures all four. A randomiser
 * that is "obviously fine" is exactly the kind of thing that turns out to
 * serve item 1 in position 1 to ninety percent of candidates.
 */

import { BLUEPRINT, DOMAINS, FORM_SIZE, MIN_POOL_MULTIPLE, TIERS, TIER_DIFFICULTY } from "./blueprint.js";
import { assembleForm, serveForm, poolReport } from "./assemble.js";
import { gradeExam } from "./grade.js";
import { ITEMS } from "./bank/index.js";
import { CASES, CASE_SHEETS } from "./cases.js";

let failures = 0;
let checks = 0;

function ok(name, condition, detail = "") {
  checks += 1;
  if (!condition) failures += 1;
  console.log(`${condition ? "  PASS" : "  FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}
function section(t) {
  console.log(`\n${t}`);
}

/* ═══════════════ 1. The bank itself ═══════════════ */
section("Item bank integrity");

const ids = ITEMS.map((i) => i.id);
ok("every item id is unique", new Set(ids).size === ids.length,
  `${ids.length} items`);
ok("every item declares a known domain",
  ITEMS.every((i) => DOMAINS.some((d) => d.id === i.domain)));
ok("every item has a difficulty in a known tier",
  ITEMS.every((i) => [...TIER_DIFFICULTY.core, ...TIER_DIFFICULTY.advanced].includes(i.difficulty)));
ok("every item has a prompt and a skill",
  ITEMS.every((i) => i.prompt?.length > 10 && i.skill?.length > 2));
ok("every item has a topic for exclusivity",
  ITEMS.every((i) => typeof i.topic === "string" && i.topic.length > 2));

const mcq = ITEMS.filter((i) => i.type === "mcq");
ok("every mcq has 4 options with unique ids",
  mcq.every((i) => i.options?.length === 4 && new Set(i.options.map((o) => o.id)).size === 4),
  `${mcq.length} mcq`);
ok("every mcq's correct answer is one of its options",
  mcq.every((i) => i.options.some((o) => o.id === i.correct)));
ok("every mcq has an explanation",
  mcq.every((i) => i.explanation?.length > 20));

const predict = ITEMS.filter((i) => i.type === "predict");
ok("every predict item has code and expected output",
  predict.every((i) => i.code?.length > 5 && typeof i.expectedOutput === "string" && i.expectedOutput.length > 0),
  `${predict.length} predict`);

const formula = ITEMS.filter((i) => i.type === "formula");
ok("every formula item names a real case, target and expected value",
  formula.every((i) => CASE_SHEETS[i.caseId] && /^[A-J]\d+$/.test(i.target) && Number.isFinite(i.expected)),
  `${formula.length} formula`);
ok("every case referenced by an item exists",
  ITEMS.every((i) => !i.caseId || CASES[i.caseId]));

/* Formula items must be solvable: the model answer has to hit `expected`
 * using the engine, or a candidate is being marked against the impossible. */
section("Formula items are solvable by the engine");
const { evaluateFormula } = await import("../spreadsheet/engine.js");
const MODEL_ANSWERS = {
  "x-d2-001": '=SUMIFS(E2:E19,B2:B19,"Wholesale")',
  "x-d2-002": '=COUNTIFS(C2:C21,"Phone",D2:D21,"No-show")',
  "x-d2-003": '=ROUND(AVERAGEIFS(E2:E19,B2:B19,"Online"),2)',
  "x-d2-004": '=SUMIFS(E2:E21,B2:B21,"Ikeja",D2:D21,"Attended")',
  "x-d2-005": "=ROUND((SUM(E2:E13)-SUM(F2:F13)-SUM(G2:G13))/SUM(E2:E13)*100,2)",
  "x-d2-006": '=SUMIFS(G2:G13,D2:D13,"SME")',
  "x-d2-007": '=ROUND(AVERAGEIFS(D2:D17,B2:B17,"Lagos-Kano"),2)',
  "x-d2-008": "=MEDIAN(D2:D17)",
  "x-d2-009": '=ROUND(COUNTIFS(B2:B21,"Ikeja",D2:D21,"No-show")/COUNTIFS(B2:B21,"Ikeja")*100,1)',
  "x-d2-051": '=ROUND((SUMIFS(E2:E13,D2:D13,"SME")-SUMIFS(F2:F13,D2:D13,"SME")-SUMIFS(G2:G13,D2:D13,"SME"))/SUMIFS(E2:E13,D2:D13,"SME")*100,2)',
};
for (const item of formula) {
  const model = MODEL_ANSWERS[item.id];
  if (!model) {
    ok(`${item.id} has a model answer registered`, false, "add one to selfTest");
    continue;
  }
  const r = evaluateFormula(model, CASE_SHEETS[item.caseId].cells);
  const got = r.ok ? Number(r.value) : NaN;
  ok(
    `${item.id} model answer reaches ${item.expected}`,
    r.ok && Math.abs(got - item.expected) < 0.005,
    r.ok ? `got ${got}` : r.error
  );
  // And the target cell must be outside the data, or the candidate would be
  // typing over the stimulus.
  const row = Number(item.target.slice(1));
  ok(
    `${item.id} target ${item.target} is below the data`,
    row > CASE_SHEETS[item.caseId].lastDataRow,
    `data ends at row ${CASE_SHEETS[item.caseId].lastDataRow}`
  );
}

/* The exam must name a course that exists, with the code the catalog uses —
 * a mismatch would either hide a real certificate or attach it to the wrong
 * course, and neither shows up until someone passes. */
section("The exam names a real course");

const { CATALOG } = await import(
  new URL("../../../src/academy/data/catalog.js", import.meta.url).href
);
const examCourse = CATALOG.find((c) => c.id === BLUEPRINT.courseId);

ok("courseId matches a catalog entry", Boolean(examCourse), BLUEPRINT.courseId);
ok(
  "courseCode matches the catalog's code",
  examCourse?.code === BLUEPRINT.courseCode,
  `blueprint ${BLUEPRINT.courseCode} vs catalog ${examCourse?.code}`
);
ok(
  "courseTitle matches the catalog's title",
  examCourse?.title === BLUEPRINT.courseTitle,
  `blueprint "${BLUEPRINT.courseTitle}" vs catalog "${examCourse?.title}"`
);
ok("the course is actually open", examCourse?.status === "open", examCourse?.status);

/* ═══════════════ 2. Pool depth ═══════════════ */
section("Pool is deep enough for genuine variation");
for (const row of poolReport()) {
  for (const tier of TIERS) {
    const need = row.needs[tier] || 0;
    if (!need) continue;
    ok(
      `${row.domain}/${tier} pool covers ${MIN_POOL_MULTIPLE}x the form`,
      row.has[tier] >= need * MIN_POOL_MULTIPLE,
      `needs ${need}, has ${row.has[tier]}`
    );
  }
}

/* ═══════════════ 3. Blueprint compliance across many seeds ═══════════════ */
section("Every form matches the blueprint (3000 seeds)");

const SEEDS = 3000;
let shapeBad = 0;
let dupItemBad = 0;
let topicBad = 0;
let quotaBad = 0;
let caseBad = 0;
const usage = new Map();
const firstDomainSeen = new Set();

for (let s = 1; s <= SEEDS; s += 1) {
  const seed = (s * 2654435761) >>> 0; // spread the seeds, as real ones would be
  let form;
  try {
    form = assembleForm(seed);
  } catch (err) {
    shapeBad += 1;
    continue;
  }

  if (form.items.length !== FORM_SIZE) shapeBad += 1;

  const itemIds = form.items.map((i) => i.id);
  if (new Set(itemIds).size !== itemIds.length) dupItemBad += 1;

  const topics = form.items.map((i) => i.topic);
  if (new Set(topics).size !== topics.length) topicBad += 1;

  for (const d of DOMAINS) {
    for (const tier of TIERS) {
      const want = d.items[tier] || 0;
      const got = form.items.filter(
        (i) => i.domain === d.id && TIER_DIFFICULTY[tier].includes(i.difficulty)
      ).length;
      if (got !== want) quotaBad += 1;
    }
  }

  const nCases = form.caseIds.length;
  if (nCases < BLUEPRINT.caseRange.min || nCases > BLUEPRINT.caseRange.max) caseBad += 1;

  for (const id of itemIds) usage.set(id, (usage.get(id) || 0) + 1);
  firstDomainSeen.add(form.items[0].domain);
}

ok("no assembly failures and every form is full", shapeBad === 0, `${shapeBad} bad`);
ok("no form repeats an item", dupItemBad === 0, `${dupItemBad} bad`);
ok("no form repeats a topic", topicBad === 0, `${topicBad} bad`);
ok("every domain and tier quota met exactly", quotaBad === 0, `${quotaBad} violations`);
ok("case count always within the blueprint range", caseBad === 0, `${caseBad} bad`);

/* ═══════════════ 4. Fairness of the draw ═══════════════ */
section("The draw is even — no dead items, no favourites");

const unused = ITEMS.filter((i) => !usage.has(i.id));
ok("every item in the bank is reachable", unused.length === 0,
  unused.length ? unused.map((i) => i.id).join(", ") : `${usage.size} items used`);

// Within a domain-and-tier pool every item should appear about equally often.
let skewed = [];
for (const d of DOMAINS) {
  for (const tier of TIERS) {
    const want = d.items[tier] || 0;
    if (!want) continue;
    const pool = ITEMS.filter(
      (i) => i.domain === d.id && TIER_DIFFICULTY[tier].includes(i.difficulty)
    );
    const rates = pool.map((i) => (usage.get(i.id) || 0) / SEEDS);
    const expected = want / pool.length;
    for (let k = 0; k < pool.length; k += 1) {
      // Topic exclusivity legitimately depresses some items, so the band is
      // generous; this is a check against a broken shuffle, not a chi-square.
      if (rates[k] < expected * 0.5 || rates[k] > expected * 1.6) {
        skewed.push(`${pool[k].id} ${(rates[k] * 100).toFixed(1)}% vs ${(expected * 100).toFixed(1)}%`);
      }
    }
  }
}
ok("item selection rates are within band of uniform", skewed.length === 0,
  skewed.slice(0, 4).join(" | "));

ok("papers do not always open on the same domain", firstDomainSeen.size > 1,
  `${firstDomainSeen.size} different opening domains`);

/* Option position must move, or a candidate learns to pick slot B. */
section("Correct answers move position");
const posCount = [0, 0, 0, 0];
for (let s = 1; s <= 400; s += 1) {
  const seed = (s * 40503) >>> 0;
  const served = serveForm(seed);
  const form = assembleForm(seed);
  const key = new Map(form.items.map((i) => [i.id, i.correct]));
  for (const item of served.items) {
    if (item.type !== "mcq") continue;
    const at = item.options.findIndex((o) => o.id === key.get(item.id));
    if (at >= 0 && at < 4) posCount[at] += 1;
  }
}
const totalPos = posCount.reduce((a, b) => a + b, 0);
const share = posCount.map((c) => c / totalPos);
ok("the correct option lands in all four positions",
  share.every((p) => p > 0.15 && p < 0.35),
  share.map((p) => `${(p * 100).toFixed(1)}%`).join(" / "));

/* ═══════════════ 5. Determinism and distinctness ═══════════════ */
section("Same seed reproduces, different seeds diverge");

const a1 = assembleForm(123456789).items.map((i) => i.id).join(",");
const a2 = assembleForm(123456789).items.map((i) => i.id).join(",");
ok("the same seed returns an identical paper", a1 === a2);

const s1 = JSON.stringify(serveForm(987654321));
const s2 = JSON.stringify(serveForm(987654321));
ok("serving the same seed twice is byte-identical", s1 === s2);

let identical = 0;
let overlapSum = 0;
let maxOverlap = 0;
const PAIRS = 1200;
for (let k = 0; k < PAIRS; k += 1) {
  const f1 = new Set(assembleForm(((k + 1) * 2246822519) >>> 0).items.map((i) => i.id));
  const f2 = new Set(assembleForm(((k + 7001) * 3266489917) >>> 0).items.map((i) => i.id));
  let shared = 0;
  for (const id of f1) if (f2.has(id)) shared += 1;
  if (shared === FORM_SIZE) identical += 1;
  overlapSum += shared;
  maxOverlap = Math.max(maxOverlap, shared);
}
const meanOverlap = overlapSum / PAIRS;
ok("no two sampled papers are identical", identical === 0, `${PAIRS} pairs compared`);
ok("mean shared items between two papers is under half the paper",
  meanOverlap < FORM_SIZE / 2,
  `mean ${meanOverlap.toFixed(1)} of ${FORM_SIZE}, worst ${maxOverlap}`);

/* ═══════════════ 6. The security property ═══════════════ */
section("The served paper carries no answers");

const servedJson = JSON.stringify(serveForm(555000111));
const leaks = ["correct", "expected", "expectedOutput", "explanation", "whyWrong", "mustUse"];
for (const key of leaks) {
  ok(`served paper contains no "${key}" field`, !servedJson.includes(`"${key}"`));
}
// And spot-check that a correct answer string is not sitting in the payload.
const probe = assembleForm(555000111).items.find((i) => i.type === "predict");
ok("a predict item's expected output is absent from the payload",
  !probe || !servedJson.includes(probe.expectedOutput),
  probe ? probe.id : "no predict item on this form");

/* ═══════════════ 7. Grading ═══════════════ */
section("Grading");

const seed = 246813579;
const form = assembleForm(seed);

const allRight = {};
for (const item of form.items) {
  if (item.type === "mcq") allRight[item.id] = item.correct;
  else if (item.type === "predict") allRight[item.id] = item.expectedOutput;
  else if (item.type === "formula") allRight[item.id] = MODEL_ANSWERS[item.id];
}
const perfect = gradeExam(seed, allRight);
ok("a fully correct attempt scores 100 and passes", perfect.score === 100 && perfect.passed,
  `score ${perfect.score}`);
ok("a pass reports certificate eligibility", perfect.certificate.eligible === true);
ok("every domain is reported", perfect.domains.length === DOMAINS.length);

const blank = gradeExam(seed, {});
ok("an empty attempt scores 0 and fails", blank.score === 0 && !blank.passed);
ok("an empty attempt reports every domain below its floor",
  blank.domains.every((d) => !d.met));
ok("an empty attempt returns modules to review", blank.review.length > 0,
  `${blank.review.length} modules`);
ok("a fail reports no certificate", blank.certificate.eligible === false);

/* A formula item must accept ANY working construction, not one model string. */
const fItem = form.items.find((i) => i.type === "formula");
if (fItem) {
  const alt = {
    ...allRight,
    // Same value, redundant but valid arithmetic — must still be marked right.
    [fItem.id]: `=(${MODEL_ANSWERS[fItem.id].slice(1)})*1`,
  };
  const altResult = gradeExam(seed, alt);
  ok("a formula item accepts any construction that returns the right value",
    altResult.score === 100, `${fItem.id}, score ${altResult.score}`);

  const constant = { ...allRight, [fItem.id]: String(fItem.expected) };
  ok("a typed constant is rejected on a formula item",
    gradeExam(seed, constant).score < 100, `${fItem.id}`);
}

/* The domain floor must actually bite. */
const pyDomain = DOMAINS.find((d) => d.id === "d4-python");
const gutPython = { ...allRight };
for (const item of form.items) {
  if (item.domain === pyDomain.id) delete gutPython[item.id];
}
const floored = gradeExam(seed, gutPython);
ok("failing one domain outright blocks a pass even with a high overall score",
  !floored.passed && floored.score >= BLUEPRINT.passMark,
  `score ${floored.score}, verdict ${floored.verdict}`);
ok("the blocked result names the domain to revisit",
  floored.review.some((m) => pyDomain.review.includes(m)));

/* Grading must not trust the client about which paper was sat. */
const foreign = assembleForm(111222333);
const wrongPaperAnswers = {};
for (const item of foreign.items) {
  if (item.type === "mcq") wrongPaperAnswers[item.id] = item.correct;
}
const cheat = gradeExam(seed, wrongPaperAnswers);
ok("answers keyed to a different paper do not score",
  cheat.score < 40, `score ${cheat.score}`);

/* ═══════════════ The other certification exams ═══════════════
 * Every exam in the registry is held to the same promises as the first:
 * a sound bank, a deep enough pool, every form the right shape, no answers
 * served, and a key that really is correct. Forex numeric items carry
 * `verify` and are recomputed here with the course's own engine.
 */
const { EXAMS, DEFAULT_EXAM_ID, formSizeOf, getExam, examForCourse } = await import("./registry.js");
const { CALCULATORS } = await import("../forex/engine.js");
const { CATALOG: CAT } = await import(new URL("../../../src/academy/data/catalog.js", import.meta.url).href);

section("Registry");
ok("the default exam is Data Analysis, so existing callers are unchanged",
  DEFAULT_EXAM_ID === BLUEPRINT.id && getExam() === EXAMS[BLUEPRINT.id]);
ok("an unknown exam id resolves to nothing, never to another paper", getExam("no-such-exam") === null);
ok("assembling without an exam id still gives the Data Analysis paper",
  assembleForm(42).items.map((i) => i.id).join() === assembleForm(42, BLUEPRINT.id).items.map((i) => i.id).join());
ok("exam ids are unique and each course has at most one exam",
  new Set(Object.values(EXAMS).map((e) => e.blueprint.courseId)).size === Object.keys(EXAMS).length);

/* Relative by default: 0.5% of the true value. An absolute 0.01 would call
   0.0025 "equal" to 0.0050 and 0.06 lots "equal" to 0.05. */
const tolFor = (item, truth) => item.verify.tolerance ?? Math.max(Math.abs(truth) * 0.005, 1e-9);
const firstNumber = (text) => {
  const m = String(text).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
};

for (const [examId, exam] of Object.entries(EXAMS)) {
  if (examId === BLUEPRINT.id) continue; // covered in full above
  const bp = exam.blueprint;
  const items = exam.items;
  const size = formSizeOf(bp);
  section(`${bp.title} (${items.length} items, ${size} per form)`);

  const course = CAT.find((c) => c.id === bp.courseId);
  ok("names an open catalog course with the same code and title",
    course?.status === "open" && course.code === bp.courseCode && course.title === bp.courseTitle,
    `${bp.courseId} ${bp.courseCode}`);
  ok("examForCourse finds it", examForCourse(bp.courseId) === exam);

  ok("every item id is unique", new Set(items.map((i) => i.id)).size === items.length);
  ok("every item id is unique across ALL exams",
    items.every((i) => Object.values(EXAMS).filter((e) => e !== exam).every((e) => !e.items.some((x) => x.id === i.id))));
  ok("every item belongs to a domain of this blueprint",
    items.every((i) => bp.domains.some((d) => d.id === i.domain)));
  ok("every item has a known difficulty, a prompt, a skill and an explanation",
    items.every((i) => [3, 4, 5].includes(i.difficulty) && i.prompt?.length > 10 && i.skill && i.explanation));
  ok("every topic is unique within the exam", new Set(items.map((i) => i.topic)).size === items.length);
  ok("every mcq's key is one of its options, with four options",
    items.filter((i) => i.type === "mcq").every((i) => i.options.length === 4 && i.options.some((o) => o.id === i.correct)));
  ok("every predict item has code and an expected output",
    items.filter((i) => i.type === "predict").every((i) => i.code && i.expectedOutput));

  const verifiable = items.filter((i) => i.verify);
  const wrongKeys = verifiable.filter((i) => {
    const fn = CALCULATORS[i.verify.fn];
    if (!fn) return true;
    const keyed = firstNumber(i.options.find((o) => o.id === i.correct)?.text);
    return Math.abs(fn(i.verify.args) - keyed) > tolFor(i, fn(i.verify.args));
  });
  if (verifiable.length) {
    ok(`${verifiable.length} numeric keys recomputed by the engine and correct`, wrongKeys.length === 0,
      wrongKeys.map((i) => i.id).join(", "));
    const ambiguous = verifiable.filter((i) => {
      const truth = CALCULATORS[i.verify.fn](i.verify.args);
      // An item that tests DIRECTION ("1.3 pips worse" against "1.3 pips
      // better") shares its number with a distractor on purpose.
      if (i.verify.directionOnly) return false;
      return i.options.filter((o) => o.id !== i.correct)
        .some((o) => Math.abs(firstNumber(o.text) - truth) <= tolFor(i, truth));
    });
    ok("no distractor is also numerically correct", ambiguous.length === 0, ambiguous.map((i) => i.id).join(", "));
  }

  for (const row of poolReport(examId)) {
    for (const tier of TIERS) {
      const need = row.needs[tier] || 0;
      if (need) ok(`${row.domain}/${tier} pool covers ${MIN_POOL_MULTIPLE}x the form`,
        row.has[tier] >= need * MIN_POOL_MULTIPLE, `needs ${need}, has ${row.has[tier]}`);
    }
  }

  let bad = 0;
  const seen = new Set();
  for (let k = 1; k <= 1000; k += 1) {
    const seedK = (k * 2654435761) >>> 0;
    let f;
    try { f = assembleForm(seedK, examId); } catch { bad += 1; continue; }
    const quotaOk = bp.domains.every((d) => TIERS.every((t) =>
      f.items.filter((i) => i.domain === d.id && TIER_DIFFICULTY[t].includes(i.difficulty)).length === (d.items[t] || 0)));
    if (f.items.length !== size || !quotaOk || new Set(f.items.map((i) => i.topic)).size !== size ||
        f.caseIds.length < bp.caseRange.min || f.caseIds.length > bp.caseRange.max) bad += 1;
    f.items.forEach((i) => seen.add(i.id));
  }
  ok("1000 forms: every one full, on quota, topic-unique and within the case range", bad === 0, `${bad} bad`);
  ok("every item in the bank is reachable", seen.size === items.length, `${seen.size}/${items.length}`);

  const servedX = JSON.stringify(serveForm(777, examId));
  ok("the served paper carries no answers",
    !["\"correct\"", "\"expectedOutput\"", "\"explanation\"", "\"verify\""].some((k) => servedX.includes(k)));
  ok("the served paper names its exam and course",
    JSON.parse(servedX).examId === examId && JSON.parse(servedX).courseId === bp.courseId);

  const fX = assembleForm(31337, examId);
  const key = {};
  for (const i of fX.items) key[i.id] = i.type === "mcq" ? i.correct : i.expectedOutput;
  const full = gradeExam(31337, key, examId);
  ok("answering with the key scores 100 and passes", full.score === 100 && full.passed && full.examId === examId);
  ok("a blank paper scores 0 and fails", gradeExam(31337, {}, examId).score === 0);
  const firstDomain = bp.domains[0].id;
  const gutted = { ...key };
  for (const i of fX.items) if (i.domain === firstDomain) delete gutted[i.id];
  const floor = gradeExam(31337, gutted, examId);
  ok("zero in one section fails on the domain floor even above 70% overall",
    floor.score >= 70 && !floor.passed && floor.verdict === "domain-floor", `${floor.score}% ${floor.verdict}`);
  ok("the Data Analysis key does not open this paper",
    gradeExam(31337, Object.fromEntries(assembleForm(31337).items.map((i) => [i.id, i.correct])), examId).score === 0);
}

/* ═══════════════ Summary ═══════════════ */
console.log(
  `\n${failures ? "✗" : "✓"} ${checks - failures}/${checks} checks passed` +
    `  ·  ${ITEMS.length} items, ${FORM_SIZE} per form, ${Object.keys(CASES).length} cases`
);
process.exit(failures ? 1 : 0);
