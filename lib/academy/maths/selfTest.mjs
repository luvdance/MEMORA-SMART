/**
 * MATHEMATICS DRILL ENGINE — SELF-TEST
 *
 * Run:  npm run test:maths
 *
 * A wrong answer key in a maths course is worse than a missing one. A missing
 * question is visibly missing; a question whose stored answer is wrong tells a
 * student who did it correctly that they are wrong, names a misconception they
 * did not have, and sends them to repair a skill that was never broken. So
 * this file does not check that the generators run. It checks that they are
 * RIGHT, by marking each one against its own answer key across many seeds.
 *
 * What it proves:
 *
 *   1. The skill map is a valid DAG with no dangling or forward edges.
 *   2. Every generator points at a skill that exists.
 *   3. Every generated item's own canonical answer MARKS AS CORRECT. This is
 *      the one that catches real bugs: an item whose answer is 6/8 while its
 *      `exact` is "lowest-terms" would fail every student who got it right.
 *   4. No trap is dead — every named misconception can still fire.
 *   5. Every scaffold step marks its own answer correct.
 *   6. Generation is deterministic — the same seed gives the same item, which
 *      is what makes stateless grading possible.
 *   7. Hint ladders and worked solutions are actually present.
 *   8. The repair loop offers a twin, then a scaffold, and never a way out.
 *   9. Every drill a written lesson embeds names a skill that can be served.
 *  10. Nothing under src/ imports the answers.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ATOM_LIST,
  getAtom,
  getAncestors,
  validateMap,
  getMapStats,
} from "../../../src/academy/data/maths/atomMap.js";
import { GENERATORS } from "./generators/index.js";
import { makeRng } from "./rng.js";
import { check } from "./answer.js";
import { RULES } from "./rules.js";
import {
  serveSet,
  serveReview,
  serveHint,
  serveScaffold,
  gradeCheck,
  gradeItem,
  gradeScaffoldStep,
  makeTwin,
  diagnose,
  getCoverage,
  hasGenerator,
} from "./engine.js";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const NEWLINE = String.fromCharCode(10);

let failures = 0;
let checks = 0;

function ok(condition, message) {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.error(`  x ${message}`);
  }
}

function section(title) {
  console.log(`${NEWLINE}${title}`);
}

/* ── 1. The skill map ────────────────────────────────────────────────── */

section("Skill map");
const validation = validateMap();
ok(
  validation.ok,
  `map has ${validation.problems.length} problem(s): ${validation.problems.slice(0, 6).join(" | ")}`
);

const stats = getMapStats();
ok(stats.atoms > 250, `expected roughly 300 skills, found ${stats.atoms}`);
console.log(`  ${stats.atoms} skills across ${stats.modules} groups`);

for (const atom of ATOM_LIST) {
  ok(!getAncestors(atom.code).includes(atom.code), `${atom.code} is its own ancestor`);
}

/* ── 2 to 7. The generators ──────────────────────────────────────────── */

section("Generators");
const coverage = getCoverage();
console.log(
  `  ${coverage.authored} of ${coverage.total} skills drillable (${coverage.percent}%) · ` +
    Object.entries(coverage.byLevel)
      .map(([level, c]) => `${level} ${c.authored}/${c.total}`)
      .join(" · ")
);

const TIERS = ["build", "stretch", "exam"];
const SEEDS = [1, 7, 42, 99, 1234, 20260925, 777777, 31415926];

for (const [code, generator] of Object.entries(GENERATORS)) {
  const atom = getAtom(code);
  ok(atom, `generator ${code} has no matching skill in the map`);
  if (!atom) continue;

  for (const tier of TIERS) {
    for (const seed of SEEDS) {
      let built;
      try {
        built = generator(makeRng(seed), tier);
      } catch (err) {
        failures += 1;
        console.error(`  x ${code} [${tier}/${seed}] threw: ${err.message}`);
        continue;
      }

      const where = `${code} [${tier}/${seed}]`;

      ok(typeof built.prompt === "string" && built.prompt.length > 4, `${where} has no usable prompt`);
      ok(built.answer !== undefined && built.answer !== null, `${where} has no answer`);
      ok(Array.isArray(built.solution) && built.solution.length > 0, `${where} has no worked solution`);
      ok(built.hints.length >= 2, `${where} has fewer than two hints (a ladder needs rungs)`);

      const spec = {
        kind: built.input.kind,
        answer: built.answer,
        accept: built.accept,
        exact: built.exact,
        tolerance: built.tolerance,
        ordered: built.ordered,
        variables: built.variables,
        unit: built.unit,
      };

      // THE important one: the item's own answer must mark correct.
      const selfMark = check(
        Array.isArray(built.answer) ? built.answer.join(", ") : String(built.answer),
        spec
      );
      ok(
        selfMark.correct,
        `${where} does not accept its own answer (${JSON.stringify(built.answer)}, reason: ${selfMark.reason})`
      );

      for (const alt of built.accept || []) {
        ok(check(String(alt), spec).correct, `${where} rejects its own accepted form "${alt}"`);
      }

      // No trap may be DEAD — that is, hold a value the checker would mark
      // correct. Such a trap can never fire, which means the misconception it
      // describes has quietly stopped being detected for these numbers.
      for (const t of built.traps || []) {
        const trapValue = Array.isArray(t.is) ? t.is.join(", ") : String(t.is);
        ok(
          !check(trapValue, spec).correct,
          `${where} trap "${t.id}" holds a value that marks CORRECT (${trapValue}) - it can never fire`
        );
        if (t.atom) ok(getAtom(t.atom), `${where} trap "${t.id}" blames ${t.atom}, which is not a skill`);
      }

      for (const [i, step] of (built.scaffold || []).entries()) {
        const stepMark = check(
          Array.isArray(step.answer) ? step.answer.join(", ") : String(step.answer),
          { kind: step.input?.kind || "number", answer: step.answer, ordered: step.ordered }
        );
        ok(stepMark.correct, `${where} scaffold step ${i + 1} does not accept its own answer`);
      }

      const again = generator(makeRng(seed), tier);
      ok(again.prompt === built.prompt, `${where} is not deterministic - same seed, different prompt`);
      ok(String(again.answer) === String(built.answer), `${where} is not deterministic - same seed, different answer`);
    }
  }
}

/* ── Serving and grading ─────────────────────────────────────────────── */

section("Serve and grade");
const sampleAtom = Object.keys(GENERATORS)[0];

const drill = serveSet(sampleAtom, "build", 2026, RULES.DRILL_ITEMS);
ok(drill && drill.items.length === RULES.DRILL_ITEMS, `a drill is not ${RULES.DRILL_ITEMS} items`);
ok(drill.items.every((i) => i.hints.length > 0), "drill items were served without hints");
ok(
  drill.items.every((i) => !("answer" in i) && !("solution" in i) && !("traps" in i)),
  "a served drill item carried its answer key"
);

const checkSet = serveSet(sampleAtom, "check", 2026);
ok(checkSet.items.length === RULES.CHECK_ITEMS, `a check is not ${RULES.CHECK_ITEMS} items`);
ok(checkSet.items.every((i) => i.hints.length === 0), "a revision check was served WITH hints");
ok(new Set(checkSet.items.map((i) => i.tier)).size > 1, "the check does not mix difficulty tiers");

const review = serveReview(Object.keys(GENERATORS).slice(0, 4), 99);
ok(review.items.length === 4, `a mixed review of four skills produced ${review.items.length} items`);
ok(new Set(review.items.map((i) => i.atom)).size === 4, "the mixed review repeated a skill");

for (const code of Object.keys(GENERATORS)) {
  const graded = gradeCheck({ atom: code, seed: 5150, answers: {} });
  ok(graded.total === RULES.CHECK_ITEMS, `${code}: check did not produce ${RULES.CHECK_ITEMS} items`);
  ok(!graded.passed, `${code}: an empty submission passed the check`);
  ok(graded.toRepair.length === graded.total, `${code}: empty submission did not flag every item`);
  ok(
    graded.results.every((res) => res.solution && res.solution.length),
    `${code}: a missed item came back without a worked solution`
  );
}

/* ── 8. The repair loop ──────────────────────────────────────────────── */

section("Repair loop");
{
  const code = Object.keys(GENERATORS).find((c) => GENERATORS[c](makeRng(11), "build").scaffold);
  ok(code, "no generator anywhere provides a scaffold");

  if (code) {
    const seed = 8080;
    const wrong = gradeItem({ atom: code, tier: "build", seed, index: 0, value: "-999999", attempt: 1 });
    ok(wrong && !wrong.correct, "a nonsense answer was marked correct");
    ok(wrong.solution?.length > 0, "a wrong answer came back without the worked solution");
    ok(wrong.next === "twin", "the first wrong answer did not offer a twin");

    const second = gradeItem({ atom: code, tier: "build", seed, index: 0, value: "-999999", attempt: 2 });
    ok(second.next === "scaffold", "the second wrong answer did not fall back to the scaffold");
    ok(second.reallyAbout !== undefined, "a repeated miss did not attempt a diagnosis");

    const twin = makeTwin({ atom: code, tier: "build", seed, index: 0 });
    ok(twin && twin.isTwin && twin.seed !== seed, "the twin reused the original seed");
    ok(twin.prompt, "the twin has no prompt");

    const scaffold = serveScaffold({ atom: code, tier: "build", seed, index: 0 });
    ok(scaffold?.steps?.length > 1, "the scaffold has fewer than two steps");
    ok(scaffold.steps.every((s) => !("answer" in s)), "a served scaffold step carried its answer");

    const stepResult = gradeScaffoldStep({
      atom: code,
      tier: "build",
      seed,
      index: 0,
      step: 0,
      value: "definitely not a number",
    });
    ok(stepResult && !stepResult.correct, "a nonsense scaffold answer was accepted");
    ok(stepResult.feedback, "a wrong scaffold step gave no feedback");

    for (let level = 0; level < RULES.HINTS_PER_ITEM; level += 1) {
      ok(serveHint(code, "build", seed, 0, level)?.hint, `hint rung ${level + 1} is missing`);
    }
  }
}

/* ── Diagnosis ───────────────────────────────────────────────────────── */

section("Diagnosis");
{
  const deep = "L1-N3.1"; // adding unlike fractions
  const byGraph = diagnose(deep, null);
  ok(byGraph?.cause, "the graph walk produced no diagnosis at all");
  ok(
    getAtom(deep).prereqs.includes(byGraph.cause),
    `the diagnosis named ${byGraph.cause}, which is not a prerequisite of ${deep}`
  );

  const byTrap = diagnose(deep, { id: "x", atom: "L0-N4.2" });
  ok(byTrap.cause === "L0-N4.2", "a misconception naming a skill did not override the graph walk");
  ok(byTrap.reason === "misconception", "the overriding diagnosis was not labelled as one");
  ok(Boolean(byTrap.title && byTrap.iCan), "the diagnosis came back without anything to show a student");
}

/* ── Misconceptions are there to be fired ────────────────────────────── */

section("Misconception detection");
{
  let tested = 0;
  for (const generator of Object.values(GENERATORS)) {
    tested += (generator(makeRng(31), "stretch").traps || []).length;
  }
  ok(tested > 40, `only ${tested} traps in the whole bank - the feedback will be generic`);
  console.log(`  ${tested} misconceptions named across the drillable skills`);
}

/* ── 9. Lessons may only drill skills that exist ─────────────────────── */

section("Lesson drills");
{
  const missing = [];
  const lessonDir = join(ROOT, "src", "academy", "data", "lessons");
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".js")) {
        const source = readFileSync(full, "utf8");
        for (const m of source.matchAll(/skill:\s*"([^"]+)"/g)) {
          if (!hasGenerator(m[1])) missing.push(`${entry} drills ${m[1]}, which has no generator`);
        }
      }
    }
  };
  walk(lessonDir);
  ok(
    missing.length === 0,
    `lessons point at skills that cannot be served:${NEWLINE}    ${missing.join(`${NEWLINE}    `)}`
  );
  console.log("  every drill in every written lesson resolves");
}

/* ── 10. The trust boundary ──────────────────────────────────────────── */

section("Trust boundary");
{
  const offenders = [];
  /** The modules that hold answers. Nothing under src/ may import one. */
  const SECRET_MODULES = ["engine", "answer", "rng", "generators", "rules"];
  const SECRET_PREFIX = "academy/maths/";
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(js|jsx|mjs|ts|tsx)$/.test(entry)) {
        // Checked line by line against IMPORT statements, not against the
        // whole file. Several client files name these modules in a comment
        // saying where the answers live, and a plain substring search would
        // report every one of them - a check that cries wolf is one people
        // learn to ignore, and then it stops catching the real thing.
        const leaks = readFileSync(full, "utf8")
          .split(NEWLINE)
          .map((line) => line.trim())
          .filter((line) => {
            const namesSecret = SECRET_MODULES.some((name) =>
              line.includes(SECRET_PREFIX + name)
            );
            if (!namesSecret) return false;
            return (
              line.startsWith("import") ||
              line.startsWith("export") ||
              line.includes("import(") ||
              line.includes("require(")
            );
          });
        if (leaks.length) offenders.push(`${full.replace(ROOT, "")} - ${leaks[0]}`);
      }
    }
  };
  walk(join(ROOT, "src"));
  ok(
    offenders.length === 0,
    `these files under src/ import the maths answer key:${NEWLINE}    ${offenders.join(`${NEWLINE}    `)}`
  );
}

/* ── Result ──────────────────────────────────────────────────────────── */

console.log(
  `${NEWLINE}${failures === 0 ? "PASS" : "FAIL"} - ${checks - failures} of ${checks} checks passed`
);
process.exit(failures === 0 ? 0 : 1);
