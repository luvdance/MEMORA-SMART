/**
 * CONTENT INTEGRITY CHECK
 *
 * Run:  node lib/academy/validateContent.mjs
 *
 * Guards three things that are easy to break silently and expensive to
 * discover in production:
 *
 *   1. Every assessment question points at an atom that actually exists.
 *      Otherwise "review this concept" feedback sends learners nowhere.
 *   2. Every lesson has an assessment, and vice versa.
 *   3. No file under src/ imports lib/academy/assessments — which would
 *      ship every correct answer to the browser.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

// Every authored module, in one place. Add a pair here when content lands.
const MODULES = [
  {
    lessons: "../../src/academy/data/lessons/m1-data-foundations.js",
    assessments: "./assessments/m1-data-foundations.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m1-excel-essentials.js",
    assessments: "./assessments/m1-excel-essentials.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m1-formulas-functions.js",
    assessments: "./assessments/m1-formulas-functions.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m1-formulas-part2.js",
    assessments: "./assessments/m1-counting-and-formats.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m1-clean-structure.js",
    assessments: "./assessments/m1-clean-structure.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m2-exploratory.js",
    assessments: "./assessments/m2-exploratory.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m2-pivots.js",
    assessments: "./assessments/m2-pivots.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m2-kpis-dashboards.js",
    assessments: "./assessments/m2-kpis-dashboards.js",
  },
];

const LESSONS = [];
let ASSESSMENTS = {};
for (const module of MODULES) {
  LESSONS.push(...(await import(module.lessons)).LESSONS);
  ASSESSMENTS = { ...ASSESSMENTS, ...(await import(module.assessments)).ASSESSMENTS };
}

const errors = [];
const notes = [];

/* ── 1 & 2. Lessons ↔ assessments ─────────────────────────────────────── */

const atomIds = new Set();
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    if (atomIds.has(atom.id)) errors.push(`duplicate atom id: ${atom.id}`);
    atomIds.add(atom.id);
    if (!atom.explain) errors.push(`atom ${atom.id} has no explanation`);
  }

  const assessment = ASSESSMENTS[lesson.id];
  if (!assessment) {
    errors.push(`lesson ${lesson.id} has no assessment`);
    continue;
  }

  const count = assessment.questions.length;
  if (count < 4 || count > 5) {
    errors.push(`lesson ${lesson.id} has ${count} questions (expected 4–5)`);
  }

  for (const q of assessment.questions) {
    const ids = q.options.map((o) => o.id);
    if (!ids.includes(q.correct)) {
      errors.push(`${q.id}: correct answer "${q.correct}" is not an option`);
    }
    if (!q.explanation) errors.push(`${q.id}: no explanation for the correct answer`);

    // Every wrong option needs its own "why that was wrong"
    for (const id of ids) {
      if (id === q.correct) continue;
      if (!q.whyWrong?.[id]) {
        errors.push(`${q.id}: option "${id}" has no whyWrong explanation`);
      }
    }
  }
}

for (const [lessonId, assessment] of Object.entries(ASSESSMENTS)) {
  if (!LESSONS.some((l) => l.id === lessonId)) {
    errors.push(`assessment "${lessonId}" has no matching lesson`);
  }
  for (const q of assessment.questions) {
    if (!atomIds.has(q.atomId)) {
      errors.push(`${q.id}: atomId "${q.atomId}" does not exist in any lesson`);
    }
  }
}

/* ── 2b. Every spreadsheet exercise must actually be solvable ──────────── */

/**
 * Model answers live HERE, in lib/, not in the lesson files, so a learner
 * cannot read the solution out of the browser bundle.
 *
 * Each is evaluated with the same engine that powers the grid. If a model
 * answer does not produce the `expected` value the content declares, the
 * exercise is unsolvable and the build fails. Arithmetic done in your head
 * while writing a lesson is exactly the kind of thing that goes wrong.
 */
const EXERCISE_SOLUTIONS = {
  "a-equals-sign": "=1200+200",
  "a-cell-refs-in-formulas": "=B2*C2",
  "a-order-of-operations": "=(2+3)*4",
  "a-sum": "=SUM(D2:D5)",
  "a-average": "=AVERAGE(B2:B5)",
  "a-min-max": "=MIN(B2:B5)",
  "a-count-counta": "=COUNTA(A2:A5)",
  "a-if": '=IF(C5<100,"Reorder","OK")',
  "a-error-codes": "=A2/B2",

  // Counting, averaging, ranking, formats
  "a-count-vs-counta-vs-blank": "=COUNTBLANK(D2:D7)",
  "a-countif": '=COUNTIF(B2:B7,"Lagos")',
  "a-countifs": '=COUNTIFS(B2:B7,"Lagos",C2:C7,">500000")',
  "a-averageif": '=AVERAGEIF(B2:B7,"Lagos",C2:C7)',
  "a-averageifs": '=AVERAGEIFS(C2:C7,B2:B7,"Lagos",D2:D7,">3")',
  "a-rank": "=RANK.EQ(C3,C2:C7)",
  "a-percent-format": "=C2/E2",
  // This one only works AFTER filling D2 down, so the check fills first.
  "a-fill-down": { fill: ["D2", "D5"], formula: "=SUM(D2:D5)" },
  "a-absolute-when-filling": "=B2/$B$7",

  // Exploratory data analysis (m2)
  "a-profiling-completeness": "=COUNTBLANK(E2:E11)",
  "a-profiling-range": "=MAX(C2:C11)",
  "a-mean-vs-median": "=MEDIAN(C2:C11)",
  "a-mode": "=MODE.SNGL(D2:D11)",
  "a-large-small": "=LARGE(C2:C11,2)",
  "a-quartiles": "=QUARTILE.INC(C2:C11,3)",
  "a-iqr-rule":
    "=QUARTILE.INC(C2:C11,3)+1.5*(QUARTILE.INC(C2:C11,3)-QUARTILE.INC(C2:C11,1))",
  "a-counting-missing": "=COUNT(E2:E11)",
  "a-sumifs": '=SUMIFS(C2:C11,B2:B11,"Lagos")',
  "a-countifs-segments": '=COUNTIFS(B2:B11,"Lagos",C2:C11,">40000")',

  // KPIs and dashboards (m2)
  "a-kpi-arithmetic": "=B2/B3",
  "a-kpi-growth": "=ROUND((B3-B2)/B2,3)",
  "a-segment-with-fill": "=SUMIFS($C$2:$C$11,$B$2:$B$11,A15)",
  "a-build-total": "=SUM(C2:C7)",
  "a-build-quality": "=COUNTA(A2:A7)",
  "a-build-segment": '=COUNTIFS(B2:B7,"Lagos",C2:C7,">500000")',
  "a-build-rank": "=RANK.EQ(C6,C2:C7)",

  // Sorting, filtering and cleaning
  "a-trim": "=LEN(A3)",
  "a-case-functions": "=PROPER(B4)",
  "a-find-search": '=LEFT(B2,FIND(",",B2)-1)',
  "a-remove-duplicates": '=COUNTIF(C2:C7,"ORD-1001")',
  "a-iferror": '=IFERROR(C3/B3,"No orders")',
  "a-is-functions": "=ISNUMBER(D6)",
};

const { evaluateFormula, fillDown } = await import("./spreadsheet/engine.js");

let exerciseCount = 0;
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    if (!atom.exercise) continue;
    exerciseCount += 1;

    const ex = atom.exercise;
    if (!ex.target) errors.push(`${atom.id}: exercise has no target cell`);
    if (ex.expected === undefined) errors.push(`${atom.id}: exercise has no expected value`);

    const solution = EXERCISE_SOLUTIONS[atom.id];
    if (!solution) {
      errors.push(`${atom.id}: no model answer registered in validateContent.mjs`);
      continue;
    }

    // A solution may need the sheet prepared first, e.g. a fill-down exercise
    // where the formula only works once the column has been filled.
    let sheet = { ...(ex.data || {}) };
    let formula = solution;
    if (typeof solution === "object") {
      formula = solution.formula;
      if (solution.fill) {
        sheet = { ...sheet, ...fillDown(sheet, solution.fill[0], solution.fill[1]) };
      }
    }

    const result = evaluateFormula(formula, sheet);
    const actual = result.ok ? result.value : result.error;

    const matches =
      typeof ex.expected === "number"
        ? result.ok && Math.abs(Number(actual) - ex.expected) < 0.005
        : String(actual) === String(ex.expected);

    if (!matches) {
      errors.push(
        `${atom.id}: model answer ${formula} gives ${actual}, ` +
          `but the exercise expects ${ex.expected}`
      );
    }

    // A locked target cell would be unsolvable
    if (ex.lockedCells?.includes(ex.target)) {
      errors.push(`${atom.id}: the target cell ${ex.target} is also locked`);
    }
  }
}

/* ── 2c. Every pivot exercise must be buildable ────────────────────────── */

/**
 * A pivot exercise describes an arrangement the learner has to reproduce. If
 * that arrangement cannot actually produce a table — no Values field, or
 * nothing on either axis — the learner can never satisfy it, and the practice
 * gate would trap them on the atom forever.
 */
const { computePivot } = await import("./pivot.js");

let pivotCount = 0;
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    const px = atom.pivotExercise;
    if (!px) continue;
    pivotCount += 1;

    if (!px.source?.headers?.length || !px.source?.rows?.length) {
      errors.push(`${atom.id}: pivot exercise has no source data`);
      continue;
    }
    if (!px.expect) {
      errors.push(`${atom.id}: pivot exercise has no expected arrangement`);
      continue;
    }
    if (!px.task) errors.push(`${atom.id}: pivot exercise has no task text`);

    // Every field named in the expectation must exist in the source.
    for (const key of ["row", "column", "value", "filter"]) {
      const field = px.expect[key];
      if (field && !px.source.headers.includes(field)) {
        errors.push(`${atom.id}: expected ${key} field "${field}" is not a column in the source`);
      }
    }

    const built = computePivot(px.source, {
      ...px.expect,
      agg: px.expect.agg || "sum",
      filterValue: px.expect.filterValue ?? "(All)",
    });
    if (!built) {
      errors.push(
        `${atom.id}: the expected arrangement produces no pivot ` +
          `(needs a Values field and something in Rows or Columns)`
      );
    } else if (built.rowCount === 0) {
      errors.push(`${atom.id}: the expected filter leaves no rows at all`);
    }
  }
}

/* ── 2d. Every chart-choice practice must be answerable ────────────────── */

/**
 * The chart-choice practice grades a judgement, so the wrong options carry the
 * teaching: each one has to explain what that specific picture makes hard. An
 * option without a `whyWrong` marks the learner wrong and tells them nothing,
 * which is the one thing a practice must never do.
 */
let chartChoiceCount = 0;
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    const cc = atom.chartChoice;
    if (!cc) continue;
    chartChoiceCount += 1;

    if (!cc.question) errors.push(`${atom.id}: chart choice has no question`);
    if (!cc.options?.length) {
      errors.push(`${atom.id}: chart choice has no options`);
      continue;
    }
    const ids = cc.options.map((o) => o.id);
    if (!ids.includes(cc.correct)) {
      errors.push(`${atom.id}: correct option "${cc.correct}" is not one of the options`);
    }
    if (new Set(ids).size !== ids.length) {
      errors.push(`${atom.id}: chart choice has duplicate option ids`);
    }
    for (const o of cc.options) {
      if (!o.label) errors.push(`${atom.id}: option "${o.id}" has no label`);
      if (!o.chart?.series?.length || !o.chart?.categories?.length) {
        errors.push(`${atom.id}: option "${o.id}" has no chart data`);
      } else {
        for (const series of o.chart.series) {
          if (series.values.length !== o.chart.categories.length) {
            errors.push(
              `${atom.id}: option "${o.id}" series "${series.name}" has ` +
                `${series.values.length} values for ${o.chart.categories.length} categories`
            );
          }
        }
      }
      if (o.id !== cc.correct && !o.whyWrong) {
        errors.push(`${atom.id}: option "${o.id}" has no whyWrong explanation`);
      }
    }
  }
}

/* ── 3. Answers must never be reachable from the browser bundle ────────── */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

// Match real module resolution only — an `import`/`require`/dynamic import
// whose specifier points at the bank. A comment mentioning the path is fine.
const IMPORTS_BANK =
  /(?:^|\n)\s*import\s[^;]*?from\s*["'][^"']*academy\/assessments[^"']*["']|require\(\s*["'][^"']*academy\/assessments[^"']*["']\s*\)|import\(\s*["'][^"']*academy\/assessments[^"']*["']\s*\)/;

for (const file of walk(join(ROOT, "src"))) {
  const source = readFileSync(file, "utf8");
  if (IMPORTS_BANK.test(source)) {
    errors.push(
      `SECURITY: ${relative(ROOT, file)} imports the assessment bank. ` +
        `Correct answers would ship to the browser.`
    );
  }
}

/* ── Report ───────────────────────────────────────────────────────────── */

const totalAtoms = atomIds.size;
const totalQuestions = Object.values(ASSESSMENTS).reduce(
  (n, a) => n + a.questions.length,
  0
);

notes.push(`${LESSONS.length} lessons · ${totalAtoms} atoms · ${totalQuestions} questions`);
notes.push(`${exerciseCount} interactive spreadsheet exercises`);
notes.push(`${pivotCount} pivot table exercises`);
notes.push(`${chartChoiceCount} chart-selection practices`);
notes.push(
  `estimated ${LESSONS.reduce((n, l) => n + (l.estimatedMinutes || 0), 0)} minutes of content`
);

for (const note of notes) console.log("  " + note);

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("\n✓ content valid");
