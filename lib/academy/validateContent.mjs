import { existsSync } from "node:fs";
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

/**
 * Cybersecurity weeks. One lesson file and one assessment file per week, named
 * identically on both sides, so a new week is one string rather than two paths
 * that can drift apart.
 */
const CYBER_WEEKS = [
  "w1-fundamentals",
  "w2-accounts",
  "w3-data",
  "w4-networking",
  "w5-hardening",
  "w6-networks",
  "w7-software",
  "w8-web",
  "w9-ethical-hacking",
  "w10-vulnerabilities",
  "w11-soc",
  "w12-incident-response",
  "w13-privacy-grc",
  "w14-cloud",
  "w15-capstone",
  "w16-career",
];

/**
 * Mathematics modules, read from the course outline so the list is kept in one
 * place. One lesson file and one assessment file per module, named after the
 * module id on both sides. A module whose lesson file is not written yet is
 * skipped here and shown as "coming soon" in the curriculum.
 */
const { MATHS_MODULE_IDS } = await import("../../src/academy/data/mathematicsCourse.js");
const MATHS_MODULES = MATHS_MODULE_IDS.filter((id) =>
  existsSync(new URL(`../../src/academy/data/lessons/${id}.js`, import.meta.url))
);

/**
 * JavaScript weeks, read from the course outline for the same reason. One
 * lesson file and one assessment file per week, named after the module id.
 */
const { JAVASCRIPT_MODULE_IDS } = await import("../../src/academy/data/javascriptCourse.js");
const JS_MODULES = JAVASCRIPT_MODULE_IDS.filter((id) =>
  existsSync(new URL(`../../src/academy/data/lessons/${id}.js`, import.meta.url))
);

/**
 * Forex Trading weeks, read from the course outline. One lesson file and one
 * assessment file per week, named after the module id.
 */
const { FOREX_MODULE_IDS } = await import("../../src/academy/data/forexCourse.js");
const FX_MODULES = FOREX_MODULE_IDS.filter((id) =>
  existsSync(new URL(`../../src/academy/data/lessons/${id}.js`, import.meta.url))
);

/**
 * Python Programming modules, read from the course outline. One lesson file
 * and one assessment file per module, named after the module id.
 */
const { PYTHON_MODULE_IDS } = await import("../../src/academy/data/pythonCourse.js");
const PY_MODULES = PYTHON_MODULE_IDS.filter((id) =>
  existsSync(new URL(`../../src/academy/data/lessons/${id}.js`, import.meta.url))
);

/**
 * C++ Programming modules, read from the course outline. One lesson file and
 * one assessment file per module, named after the module id.
 */
const { CPP_MODULE_IDS } = await import("../../src/academy/data/cppCourse.js");
const CP_MODULES = CPP_MODULE_IDS.filter((id) =>
  existsSync(new URL(`../../src/academy/data/lessons/${id}.js`, import.meta.url))
);

/**
 * Responsive Web Development modules, read from the course outline. One lesson
 * file and one assessment file per module, named after the module id.
 */
const { WEB_DEVELOPMENT_MODULE_IDS } = await import("../../src/academy/data/webDevelopmentCourse.js");
const WD_MODULES = WEB_DEVELOPMENT_MODULE_IDS.filter((id) =>
  existsSync(new URL(`../../src/academy/data/lessons/${id}.js`, import.meta.url))
);

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
  {
    lessons: "../../src/academy/data/lessons/m2-project-sales.js",
    assessments: "./assessments/m2-project-sales.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m3-pbi-foundations.js",
    assessments: "./assessments/m3-pbi-foundations.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m3-power-query.js",
    assessments: "./assessments/m3-power-query.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m3-modelling.js",
    assessments: "./assessments/m3-modelling.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m3-dax.js",
    assessments: "./assessments/m3-dax.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m3-visualisation.js",
    assessments: "./assessments/m3-visualisation.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m4-python-foundations.js",
    assessments: "./assessments/m4-python-foundations.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m4-pandas.js",
    assessments: "./assessments/m4-pandas.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m4-transform.js",
    assessments: "./assessments/m4-transform.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m4-visual-analysis.js",
    assessments: "./assessments/m4-visual-analysis.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m4-capstone.js",
    assessments: "./assessments/m4-capstone.js",
  },
  // The two setup lessons share one assessment bank, so they are listed
  // against it twice — the loader merges assessments, so this is harmless
  // and keeps every lesson file accounted for.
  {
    lessons: "../../src/academy/data/lessons/m1-excel-setup.js",
    assessments: "./assessments/setup-lessons.js",
  },
  {
    lessons: "../../src/academy/data/lessons/m4-python-setup.js",
    assessments: "./assessments/setup-lessons.js",
  },

  // ── Cybersecurity, one pair per week ────────────────────────────────
  ...CYBER_WEEKS.map((week) => ({
    lessons: `../../src/academy/data/lessons/cs-${week}.js`,
    assessments: `./assessments/cs-${week}.js`,
  })),
  ...MATHS_MODULES.map((module) => ({
    lessons: `../../src/academy/data/lessons/${module}.js`,
    assessments: `./assessments/${module}.js`,
  })),
  ...JS_MODULES.map((module) => ({
    lessons: `../../src/academy/data/lessons/${module}.js`,
    assessments: `./assessments/${module}.js`,
  })),
  ...FX_MODULES.map((module) => ({
    lessons: `../../src/academy/data/lessons/${module}.js`,
    assessments: `./assessments/${module}.js`,
  })),
  ...PY_MODULES.map((module) => ({
    lessons: `../../src/academy/data/lessons/${module}.js`,
    assessments: `./assessments/${module}.js`,
  })),
  ...CP_MODULES.map((module) => ({
    lessons: `../../src/academy/data/lessons/${module}.js`,
    assessments: `./assessments/${module}.js`,
  })),
  ...WD_MODULES.map((module) => ({
    lessons: `../../src/academy/data/lessons/${module}.js`,
    assessments: `./assessments/${module}.js`,
  })),
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

  // Capstone project (m2)
  "a-project-completeness": "=COUNTBLANK(D2:D11)",
  "a-project-text-number": "=ISNUMBER(C8)",
  "a-project-space-cost": '=SUMIFS(C2:C11,B2:B11,"Abuja")',
  "a-project-outlier":
    "=QUARTILE.INC(C2:C11,3)+1.5*(QUARTILE.INC(C2:C11,3)-QUARTILE.INC(C2:C11,1))",
  "a-project-typical": "=MEDIAN(C2:C11)",
  "a-project-kpi": "=B2/B3",
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

  // Capstone (m4-capstone). The audit runs on the 20-row RAW export
  // (rows 2-21); the analysis atoms run on the 18-row cleaned sheet whose
  // margin column is already filled (rows 2-19).
  "a-cap-reconcile": '=SUMIFS(E2:E21,B2:B21,"Wholesale")',
  "a-cap-blanks": "=COUNTBLANK(F2:F21)",
  "a-cap-cost-of-dirt": "=ROUND((SUM(E2:E21)-SUM(F2:F21))/SUM(E2:E21)*100,2)",
  "a-cap-fill-margin": "=D19-E19",
  "a-cap-kpi-layer": "=ROUND(SUM(F2:F19)/SUM(D2:D19)*100,1)",
  "a-cap-channel-margin":
    '=ROUND(SUMIFS(F2:F19,B2:B19,"Wholesale")/SUMIFS(D2:D19,B2:B19,"Wholesale")*100,2)',
  "a-cap-share-gap": '=ROUND(SUMIFS(F2:F19,B2:B19,"Wholesale")/SUM(F2:F19)*100,1)',
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

/* ── 2c-ii. Every Power Query exercise must be solvable ────────────────── */

/**
 * Model recipes live HERE, not in the lesson file, for the same reason the
 * formula answers do: a learner should not be able to read the solution out of
 * the browser bundle. The validator runs each recipe and proves it satisfies
 * the `expect` the lesson declares — so a lesson can never ship a target no
 * sequence of available steps can reach.
 */
const QUERY_SOLUTIONS = {
  "a-pq-fix-type": [{ type: "changeType", column: "Amount" }],
  "a-pq-clean-it": [
    { type: "removeColumn", column: "RowId" },
    { type: "trim", column: "State" },
    { type: "changeType", column: "Amount" },
    { type: "removeDuplicates", column: "Order" },
    { type: "removeBlankRows", column: "Order" },
  ],

  // Capstone: 20 raw rows in, 18 out. The first three steps change values and
  // no rows; the last two change rows, which is what the lesson asks the
  // learner to watch in the Applied Steps list.
  "a-cap-pq-clean": [
    { type: "trim", column: "Channel" },
    { type: "upperFirst", column: "Channel" },
    { type: "changeType", column: "Amount" },
    { type: "removeDuplicates", column: "Order" },
    { type: "removeBlankRows", column: "Order" },
  ],
};

const { applySteps, STEP_LIBRARY, textNumberCount } = await import("./powerquery.js");

let queryCount = 0;
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    // A read-only demo still has to reference real steps and columns.
    for (const step of atom.query?.steps || []) {
      if (!STEP_LIBRARY[step.type]) {
        errors.push(`${atom.id}: demo uses unknown step type "${step.type}"`);
      }
      if (!(atom.query.source?.headers || []).includes(step.column)) {
        errors.push(`${atom.id}: demo step acts on missing column "${step.column}"`);
      }
    }

    const qx = atom.queryExercise;
    if (!qx) continue;
    queryCount += 1;

    if (!qx.source?.headers?.length || !qx.source?.rows?.length) {
      errors.push(`${atom.id}: query exercise has no source data`);
      continue;
    }
    if (!qx.task) errors.push(`${atom.id}: query exercise has no task text`);
    if (!qx.expect) {
      errors.push(`${atom.id}: query exercise has no expected result`);
      continue;
    }

    const recipe = QUERY_SOLUTIONS[atom.id];
    if (!recipe) {
      errors.push(`${atom.id}: no model recipe registered in validateContent.mjs`);
      continue;
    }

    const got = applySteps(qx.source, recipe);
    const want = qx.expect;

    if (want.headers && got.headers.join(",") !== want.headers.join(",")) {
      errors.push(
        `${atom.id}: model recipe gives columns [${got.headers.join(", ")}], ` +
          `but the exercise expects [${want.headers.join(", ")}]`
      );
    }
    if (want.rows !== undefined && got.rows.length !== want.rows) {
      errors.push(
        `${atom.id}: model recipe gives ${got.rows.length} rows, ` +
          `but the exercise expects ${want.rows}`
      );
    }
    if (want.numericColumn && textNumberCount(got, want.numericColumn) > 0) {
      errors.push(
        `${atom.id}: model recipe leaves ${textNumberCount(got, want.numericColumn)} ` +
          `text value(s) in "${want.numericColumn}"`
      );
    }
    if (want.trimmedColumn) {
      const i = got.headers.indexOf(want.trimmedColumn);
      if (i >= 0 && got.rows.some((r) => typeof r[i] === "string" && r[i] !== r[i].trim())) {
        errors.push(`${atom.id}: model recipe leaves untrimmed values in "${want.trimmedColumn}"`);
      }
    }
  }
}

/* ── 2c-iii. Every model exercise must be buildable ────────────────────── */

/**
 * A model exercise asks the learner to join two tables. If the expected join
 * columns do not exist, or the cardinality the lesson claims is not what the
 * DATA produces, the learner can never satisfy it — and worse, the lesson
 * would be teaching a cardinality the engine disagrees with.
 */
const { detectCardinality: detectCard } = await import("./model.js");

let modelCount = 0;
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    const spec = atom.modelExercise || atom.model;
    if (!spec) continue;
    if (atom.modelExercise) modelCount += 1;

    const { dim, fact, labelColumn, measureColumn } = spec;
    if (!dim?.headers?.length || !fact?.headers?.length) {
      errors.push(`${atom.id}: model is missing a dim or fact table`);
      continue;
    }
    if (!dim.headers.includes(labelColumn)) {
      errors.push(`${atom.id}: labelColumn "${labelColumn}" is not in ${dim.name}`);
    }
    if (!fact.headers.includes(measureColumn)) {
      errors.push(`${atom.id}: measureColumn "${measureColumn}" is not in ${fact.name}`);
    }

    const want = atom.modelExercise?.expect;
    if (!want) continue;
    if (want.dimCol && !dim.headers.includes(want.dimCol)) {
      errors.push(`${atom.id}: expected dim column "${want.dimCol}" does not exist in ${dim.name}`);
    }
    if (want.factCol && !fact.headers.includes(want.factCol)) {
      errors.push(`${atom.id}: expected fact column "${want.factCol}" does not exist in ${fact.name}`);
    }
    if (want.cardinality && want.dimCol && want.factCol) {
      const got = detectCard(dim, want.dimCol, fact, want.factCol);
      if (got.kind !== want.cardinality) {
        errors.push(
          `${atom.id}: the data gives a ${got.kind} relationship, ` +
            `but the exercise expects ${want.cardinality}`
        );
      }
    }
  }
}

/* ── 2c-iv. Every DAX demo must evaluate ───────────────────────────────── */

/**
 * A DAX atom shows real DAX text beside a value this repo computed. If the two
 * ever drift, the lesson is teaching a number the simulator does not produce —
 * so the measures are evaluated here and checked for the things that would
 * make the demo misleading: a missing column, a ratio pointing at a measure
 * that does not exist, or a measure with no DAX text to show.
 */
const { evaluateMeasures } = await import("./dax.js");

let daxCount = 0;
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    const spec = atom.dax;
    if (!spec) continue;
    daxCount += 1;

    const { model, measures } = spec;
    if (!model?.dim?.headers || !model?.fact?.headers) {
      errors.push(`${atom.id}: dax atom has no model`);
      continue;
    }
    if (!measures?.length) {
      errors.push(`${atom.id}: dax atom has no measures`);
      continue;
    }

    const names = new Set(measures.map((m) => m.name));
    for (const m of measures) {
      if (!m.dax) errors.push(`${atom.id}: measure "${m.name}" has no DAX text to show`);
      if (m.column && !model.fact.headers.includes(m.column)) {
        errors.push(`${atom.id}: measure "${m.name}" uses missing column "${m.column}"`);
      }
      if (m.filterColumn && !model.fact.headers.includes(m.filterColumn)) {
        errors.push(`${atom.id}: measure "${m.name}" filters on missing column "${m.filterColumn}"`);
      }
      if (m.kind === "ratio") {
        for (const ref of [m.of, m.over]) {
          if (!names.has(ref)) {
            errors.push(`${atom.id}: measure "${m.name}" references unknown measure "${ref}"`);
          }
        }
      }
    }

    // It must actually evaluate, and the row totals must reconcile to the
    // total row — the same check the lessons tell learners to run.
    const out = evaluateMeasures(model, measures);
    if (!out.rows.length) {
      errors.push(`${atom.id}: dax atom produced no rows`);
      continue;
    }
    const additive = measures.find((m) => m.kind === "sum");
    if (additive) {
      const parts = out.rows.reduce((a, r) => a + (r.values[additive.name] || 0), 0);
      const total = out.total.values[additive.name] || 0;
      if (Math.abs(parts - total) > 0.005) {
        errors.push(
          `${atom.id}: "${additive.name}" rows sum to ${parts} but the total row ` +
            `says ${total} — the demo contradicts itself`
        );
      }
    }
  }
}

/* ── 2c-v. Every Python snippet must really produce its stated output ──── */

/**
 * The strongest verification in this repo: the code samples are RUN, in
 * CPython, and their real output is compared with what the lesson claims.
 * A Python module whose outputs were written from memory teaches beginners
 * things that are not true, and beginners have no way to tell.
 *
 * Python is optional. Where it is not installed the check reports as skipped
 * rather than failing the build, so this does not become a hard dependency for
 * anyone editing the Excel modules.
 */
const { execFileSync } = await import("node:child_process");
const { writeFileSync, mkdtempSync } = await import("node:fs");
const { tmpdir } = await import("node:os");
// `join` is already imported at the top of this file.

const normaliseOut = (t) =>
  String(t ?? "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

let pythonCmd = null;
for (const candidate of ["python", "python3"]) {
  try {
    execFileSync(candidate, ["--version"], { stdio: "pipe" });
    pythonCmd = candidate;
    break;
  } catch {
    /* try the next one */
  }
}

let snippetCount = 0;
let snippetsChecked = 0;
const pySnippets = [];
// Snippets that call input() carry scripted `inputs` and are run through the
// practice harness (section 2c-v-b), which echoes each answer the way a
// terminal does. That is the transcript the lesson shows.
const pyInputSnippets = [];
const jsSnippets = [];
// C++ is compiled and run by g++ in section 2c-viii, below.
const cppSnippets = [];
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    for (const spec of [atom.code, atom.codeExercise]) {
      if (!spec?.code) continue;
      // The C++ course verifies its pseudocode against C++.
      if (spec.language === "pseudocode" && spec.equivalentCpp) {
        cppSnippets.push({ id: atom.id, ...spec, code: spec.equivalentCpp });
        continue;
      }
      if (spec.language === "cpp") {
        if (spec.expectedOutput === undefined && !spec.compileError) {
          errors.push(`${atom.id}: C++ snippet has neither expectedOutput nor compileError`);
          continue;
        }
        if (spec.question && spec.compileError) {
          errors.push(`${atom.id}: a predict-the-output exercise must compile`);
        }
        cppSnippets.push({ id: atom.id, ...spec });
        continue;
      }
      // Pseudocode cannot be run, so it must carry an `equivalent` written in
      // JavaScript. That is what gets executed, and the pseudocode's stated
      // output has to match it — a dry-run answer is verified, not trusted.
      // The Python course verifies its pseudocode against Python instead.
      if (spec.language === "pseudocode" && spec.equivalentPython) {
        snippetCount += 1;
        pySnippets.push({ id: atom.id, ...spec, code: spec.equivalentPython });
        continue;
      }
      if (spec.language === "pseudocode") {
        if (!spec.equivalent) {
          errors.push(`${atom.id}: pseudocode exercise has no JavaScript \`equivalent\` to verify it`);
          continue;
        }
        jsSnippets.push({ id: atom.id, ...spec, code: spec.equivalent });
        continue;
      }
      // JavaScript is checked separately below, by Node rather than Python.
      if (spec.language === "javascript") {
        if (!spec.expectedOutput && !spec.raises) {
          errors.push(`${atom.id}: javascript snippet has neither expectedOutput nor raises`);
          continue;
        }
        jsSnippets.push({ id: atom.id, ...spec });
        continue;
      }
      // input() snippets are counted and reported with the challenges below.
      if (!spec.inputs) snippetCount += 1;
      if (!spec.expectedOutput && !spec.raises) {
        errors.push(`${atom.id}: python snippet has neither expectedOutput nor raises`);
        continue;
      }
      if (spec.inputs) pyInputSnippets.push({ id: atom.id, ...spec });
      else pySnippets.push({ id: atom.id, ...spec });
    }
  }
}

if (pythonCmd && pySnippets.length) {
  const dir = mkdtempSync(join(tmpdir(), "academy-py-"));
  for (const snip of pySnippets) {
    const file = join(dir, `${snip.id.replace(/[^A-Za-z0-9_-]/g, "_")}.py`);
    writeFileSync(file, snip.code, "utf8");

    let stdout = "";
    let lastError = "";
    try {
      // cwd is the scratch directory, so a snippet that writes a file never
      // writes it into the repository.
      // UTF-8 for stdout too: Windows pipes default to a legacy code page
      // that cannot print ₦ or Yoruba diacritics, which Pyodide prints fine.
      stdout = execFileSync(pythonCmd, [file], {
        stdio: "pipe",
        encoding: "utf8",
        cwd: dir,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      });
    } catch (err) {
      stdout = err.stdout || "";
      const lines = normaliseOut(err.stderr || "").split("\n");
      lastError = lines[lines.length - 1] || "";
    }
    snippetsChecked += 1;

    if (snip.raises) {
      if (normaliseOut(lastError) !== normaliseOut(snip.raises)) {
        errors.push(
          `${snip.id}: the lesson says Python raises "${snip.raises}" ` +
            `but it actually raised "${lastError || "(nothing)"}"`
        );
      }
      continue;
    }

    if (lastError) {
      errors.push(`${snip.id}: snippet was expected to print, but raised ${lastError}`);
      continue;
    }
    if (normaliseOut(stdout) !== normaliseOut(snip.expectedOutput)) {
      errors.push(
        `${snip.id}: expected output does not match what Python printed.\n` +
          `      lesson claims: ${JSON.stringify(normaliseOut(snip.expectedOutput))}\n` +
          `      python printed: ${JSON.stringify(normaliseOut(stdout))}`
      );
    }
  }
}

/* ── 2c-v-b. Write-the-code challenges must be solvable, and not pre-solved ─
 *
 * A `codeChallenge` is graded by running the learner's code against tests in
 * the harness from src/academy/pyHarness.js — the same text Pyodide runs in
 * the browser. Here, in CPython, every challenge's model `solution` must pass
 * every test, and its `starter` must fail at least one: a challenge nobody can
 * pass, or one that passes before the learner types anything, is a bug.
 */
const { PY_HARNESS, PY_HARNESS_BATCH_MAIN } = await import("../../src/academy/pyHarness.js");
const challenges = [];
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    const ch = atom.codeChallenge;
    if (!ch) continue;
    if (atom.codeExercise || atom.decision) {
      errors.push(`${atom.id}: an atom carries one graded practice; this one has a challenge and another`);
    }
    if (!ch.task) errors.push(`${atom.id}: challenge has no task`);
    if (!ch.solution) errors.push(`${atom.id}: challenge has no model solution`);
    if (!Array.isArray(ch.tests) || !ch.tests.length) {
      errors.push(`${atom.id}: challenge has no tests`);
      continue;
    }
    if (ch.tests.some((t) => !t.check)) errors.push(`${atom.id}: every challenge test needs a check`);
    // The assert message is the learner's feedback, so none may be missing.
    const bare = ch.tests
      .flatMap((t) => t.check.split("\n"))
      .filter((line) => /^\s*assert\b/.test(line) && !/,\s*(f?["']|\()/.test(line));
    if (bare.length) {
      errors.push(`${atom.id}: every assert in a check needs a message for the learner: ${bare[0].trim()}`);
    }
    challenges.push({ id: atom.id, ...ch });
  }
}

let challengesChecked = 0;
let inputSnippetsChecked = 0;
if (pythonCmd && (challenges.length || pyInputSnippets.length)) {
  const dir = mkdtempSync(join(tmpdir(), "academy-ch-"));
  const harnessFile = join(dir, "harness.py");
  const jobsFile = join(dir, "jobs.json");
  writeFileSync(harnessFile, PY_HARNESS + PY_HARNESS_BATCH_MAIN, "utf8");
  const jobs = [
    ...challenges.map((c) => ({ id: `${c.id}#solution`, code: c.solution, tests: c.tests })),
    ...challenges.map((c) => ({ id: `${c.id}#starter`, code: c.starter || "", tests: c.tests })),
    ...pyInputSnippets.map((sn) => ({ id: `${sn.id}#snippet`, code: sn.code, tests: [{ inputs: sn.inputs }] })),
  ];
  writeFileSync(jobsFile, JSON.stringify(jobs), "utf8");
  let results = [];
  try {
    results = JSON.parse(
      execFileSync(pythonCmd, [harnessFile, jobsFile], {
        stdio: "pipe",
        encoding: "utf8",
        cwd: dir,
        maxBuffer: 64 * 1024 * 1024,
      })
    );
  } catch (err) {
    errors.push(`challenge harness failed to run: ${(err.stderr || err.message || "").slice(0, 400)}`);
  }
  const byId = new Map(results.map((r) => [r.id, r.result]));

  for (const c of challenges) {
    const sol = byId.get(`${c.id}#solution`);
    const start = byId.get(`${c.id}#starter`);
    if (!sol || !start) continue;
    challengesChecked += 1;
    if (!sol.passed) {
      const last = sol.results[sol.results.length - 1] || {};
      errors.push(
        `${c.id}: the model solution FAILS its own challenge ` +
          `(test ${sol.results.length}): ${last.error || last.message}`
      );
    }
    if (start.passed) errors.push(`${c.id}: the starter code already passes the challenge`);
  }

  for (const sn of pyInputSnippets) {
    const res = byId.get(`${sn.id}#snippet`);
    if (!res) continue;
    inputSnippetsChecked += 1;
    const r = res.results[0] || {};
    const lastError = normaliseOut(r.error).split("\n").pop() || "";
    if (sn.raises) {
      if (normaliseOut(lastError) !== normaliseOut(sn.raises)) {
        errors.push(`${sn.id}: the lesson says Python raises "${sn.raises}" but it raised "${lastError || "(nothing)"}"`);
      }
      if (sn.expectedOutput && normaliseOut(r.output) !== normaliseOut(sn.expectedOutput)) {
        errors.push(`${sn.id}: output before the error does not match. python printed: ${JSON.stringify(normaliseOut(r.output))}`);
      }
      continue;
    }
    if (r.error) {
      errors.push(`${sn.id}: snippet was expected to print, but raised ${lastError}`);
      continue;
    }
    if (normaliseOut(r.output) !== normaliseOut(sn.expectedOutput)) {
      errors.push(
        `${sn.id}: expected output does not match what Python printed.\n` +
          `      lesson claims: ${JSON.stringify(normaliseOut(sn.expectedOutput))}\n` +
          `      python printed: ${JSON.stringify(normaliseOut(r.output))}`
      );
    }
  }
}

/* The Python Programming certification exam is held to the lessons'
 * standard: every "what does this print?" item is run in CPython with the
 * lesson snippets (section 2c-v) and must print exactly what the key says. */
const { ITEMS: PY_EXAM_ITEMS } = await import("./finalExam/python/bank.js");
const pyExamPredict = PY_EXAM_ITEMS.filter((i) => i.type === "predict");
let pyExamChecked = 0;
if (pythonCmd && pyExamPredict.length) {
  const dir = mkdtempSync(join(tmpdir(), "academy-pyexam-"));
  for (const item of pyExamPredict) {
    const file = join(dir, `${item.id.replace(/[^A-Za-z0-9_-]/g, "_")}.py`);
    writeFileSync(file, item.code, "utf8");
    let stdout = "";
    let lastError = "";
    try {
      stdout = execFileSync(pythonCmd, [file], {
        stdio: "pipe",
        encoding: "utf8",
        cwd: dir,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      });
    } catch (err) {
      stdout = err.stdout || "";
      lastError = normaliseOut(err.stderr || "").split("\n").pop() || "";
    }
    pyExamChecked += 1;
    if (lastError) {
      errors.push(`${item.id}: python exam item raised ${lastError}`);
    } else if (normaliseOut(stdout) !== normaliseOut(item.expectedOutput)) {
      errors.push(
        `${item.id}: python exam item's expected output does not match what Python printed.\n` +
          `      key says: ${JSON.stringify(normaliseOut(item.expectedOutput))}\n` +
          `      python printed: ${JSON.stringify(normaliseOut(stdout))}`
      );
    }
  }
}

/* ── 2c-vi. The final exam's Python items must print what they claim ───── */

/**
 * Same discipline as the lessons, applied to the exam: every `predict` item is
 * RUN, preamble and all, and its stated output compared with reality. An exam
 * that marks a candidate wrong for giving the right answer is worse than no
 * exam at all.
 *
 * The preamble comes from pySetup.js — the same string shown to the candidate
 * on the paper — so the code being verified is exactly the code they read.
 */
const { ITEMS: EXAM_ITEMS } = await import("./finalExam/bank/index.js");
const { PY_SETUP } = await import("./finalExam/pySetup.js");

let examPyCount = 0;
let examPyChecked = 0;
const examPredict = EXAM_ITEMS.filter((i) => i.type === "predict");

for (const item of examPredict) {
  examPyCount += 1;
  if (!item.caseId) {
    errors.push(`${item.id}: predict item has no caseId, so no preamble resolves`);
    continue;
  }
  if (!PY_SETUP[item.caseId]) {
    errors.push(
      `${item.id}: no Python preamble registered for case "${item.caseId}" in pySetup.js`
    );
  }
}

if (pythonCmd && examPredict.length) {
  const examDir = mkdtempSync(join(tmpdir(), "exam-py-"));
  for (const item of examPredict) {
    const preamble = PY_SETUP[item.caseId];
    if (!preamble) continue;

    const file = join(examDir, `${item.id.replace(/[^A-Za-z0-9_-]/g, "_")}.py`);
    writeFileSync(file, `${preamble}\n${item.code}\n`, "utf8");

    let stdout = "";
    let lastError = "";
    try {
      stdout = execFileSync(pythonCmd, [file], { stdio: "pipe", encoding: "utf8" });
    } catch (err) {
      stdout = err.stdout || "";
      const lines = normaliseOut(err.stderr || "").split("\n");
      lastError = lines[lines.length - 1] || "";
    }
    examPyChecked += 1;

    if (lastError) {
      errors.push(`${item.id}: exam snippet raised ${lastError}`);
      continue;
    }
    if (normaliseOut(stdout) !== normaliseOut(item.expectedOutput)) {
      errors.push(
        `${item.id}: exam item's expected output does not match what Python printed.\n` +
          `      item claims:    ${JSON.stringify(normaliseOut(item.expectedOutput))}\n` +
          `      python printed: ${JSON.stringify(normaliseOut(stdout))}`
      );
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
      // A scatter carries points rather than categories+values, so the shape
      // check differs by chart type. Without this the check demanded
      // `categories` from a chart type that legitimately has none.
      const scatter = o.chart?.type === "scatter";
      if (!o.chart?.series?.length) {
        errors.push(`${atom.id}: option "${o.id}" has no chart series`);
      } else if (scatter) {
        for (const series of o.chart.series) {
          if (!series.points?.length) {
            errors.push(`${atom.id}: option "${o.id}" scatter series "${series.name}" has no points`);
          } else if (series.points.some((p) => typeof p.x !== "number" || typeof p.y !== "number")) {
            errors.push(`${atom.id}: option "${o.id}" scatter has a point missing a numeric x or y`);
          }
        }
      } else if (!o.chart?.categories?.length) {
        errors.push(`${atom.id}: option "${o.id}" has no categories`);
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

/* The JavaScript certification exam is held to the same standard: every item
 * that asks "what does this print?" is run in Node below, alongside the
 * lessons' snippets, and must print exactly what the key says. */
const { ITEMS: JS_EXAM_ITEMS } = await import("./finalExam/javascript/bank.js");
const { ITEMS: WD_EXAM_ITEMS } = await import("./finalExam/web/bank.js");
const jsExamPredict = [...JS_EXAM_ITEMS, ...WD_EXAM_ITEMS].filter((i) => i.type === "predict");
for (const item of jsExamPredict) {
  if (!item.expectedOutput) {
    errors.push(`${item.id}: javascript exam item has no expectedOutput`);
    continue;
  }
  jsSnippets.push({ id: item.id, code: item.code, expectedOutput: item.expectedOutput });
}

/* ── 2c-vii. Every JavaScript snippet must print what the lesson claims ── */

/**
 * The same discipline as the Python check, with one advantage: Node is always
 * present wherever this script runs, so the JavaScript check is never skipped.
 *
 * Each snippet is written to its own file and run by a fresh Node process.
 * `.cjs` by default, so it behaves like a classic browser script (sloppy mode,
 * top-level `var` and function hoisting exactly as the lesson describes);
 * `module: true` on a snippet runs it as `.mjs` for the lessons on modules
 * and strict mode. A snippet that does not finish in five seconds fails,
 * which is how an accidental infinite loop in a lesson is caught.
 */
let jsChecked = 0;
if (jsSnippets.length) {
  const dir = mkdtempSync(join(tmpdir(), "academy-js-"));
  for (const snip of jsSnippets) {
    const ext = snip.module ? "mjs" : "cjs";
    const file = join(dir, `${snip.id.replace(/[^A-Za-z0-9_-]/g, "_")}.${ext}`);
    writeFileSync(file, snip.code, "utf8");

    let stdout = "";
    let thrown = "";
    try {
      stdout = execFileSync(process.execPath, [file], {
        stdio: "pipe",
        encoding: "utf8",
        timeout: 5000,
        env: { ...process.env, NO_COLOR: "1", NODE_DISABLE_COLORS: "1" },
      });
    } catch (err) {
      stdout = err.stdout || "";
      if (err.signal === "SIGTERM" || err.code === "ETIMEDOUT") {
        thrown = "(timed out)";
      } else {
        // Node prints the source line, a caret, a blank line, then
        // "Name: message". The first line shaped like that is the error.
        const line = String(err.stderr || "")
          .split(/\r?\n/)
          .find((l) => /^(Uncaught )?[A-Za-z]*Error\b.*?:|^Uncaught /.test(l));
        thrown = (line || String(err.stderr || "").trim().split(/\r?\n/).pop() || "").trim();
      }
    }
    jsChecked += 1;

    if (snip.raises) {
      if (normaliseOut(thrown) !== normaliseOut(snip.raises)) {
        errors.push(
          `${snip.id}: the lesson says JavaScript throws "${snip.raises}" ` +
            `but it actually threw "${thrown || "(nothing)"}"`
        );
      }
      if (snip.expectedOutput && normaliseOut(stdout) !== normaliseOut(snip.expectedOutput)) {
        errors.push(
          `${snip.id}: output before the error does not match.\n` +
            `      lesson claims: ${JSON.stringify(normaliseOut(snip.expectedOutput))}\n` +
            `      node printed:  ${JSON.stringify(normaliseOut(stdout))}`
        );
      }
      continue;
    }
    if (thrown) {
      errors.push(`${snip.id}: snippet was expected to print, but threw ${thrown}`);
      continue;
    }
    if (normaliseOut(stdout) !== normaliseOut(snip.expectedOutput)) {
      errors.push(
        `${snip.id}: expected output does not match what Node printed.\n` +
          `      lesson claims: ${JSON.stringify(normaliseOut(snip.expectedOutput))}\n` +
          `      node printed:  ${JSON.stringify(normaliseOut(stdout))}`
      );
    }
  }
}

/* ── 2c-viii. Every C++ program must compile, run and print what it claims ─
 *
 * The C++ course cannot run code in the browser, which makes this check the
 * only thing standing between a learner and a lesson that is wrong. Every
 * `code` and `codeExercise` is compiled with g++ (-std=c++17 -Wall -Wextra)
 * and run; see lib/academy/cpp/run.mjs for exactly what is compared.
 *
 * `codeFill` practices are proved the same way: every accepted answer to
 * every gap is substituted into the program, compiled and run, and must print
 * the practice's expectedOutput. A gap that accepts broken code, or a model
 * answer that does not work, fails the build.
 *
 * And each C++ atom carries at most one graded practice, because the player
 * marks the atom solved when its practice is solved; a second would never be
 * checked.
 *
 * g++ is optional, like Python: without it these are reported as skipped.
 */
const { verifySnippets, findCompiler, fillVariants } = await import("./cpp/run.mjs");
const CPP_GRADED = ["codeExercise", "codeFill", "decision", "codeChallenge"];
let fillCount = 0;
for (const lesson of LESSONS) {
  if (!lesson.moduleId?.startsWith("cp-")) continue;
  for (const atom of lesson.atoms) {
    const graded = CPP_GRADED.filter((k) => atom[k]);
    if (graded.length > 1) {
      errors.push(`${atom.id}: has ${graded.length} graded practices (${graded.join(", ")}); one per atom`);
    }
    if (atom.decision) {
      const d = atom.decision;
      if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
      for (const o of d.options || []) {
        if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option "${o.id}" has no whyWrong`);
      }
    }
    const ex = atom.codeExercise;
    if (ex && ex.language !== "cpp" && !(ex.language === "pseudocode" && ex.equivalentCpp)) {
      errors.push(`${atom.id}: C++ course exercise must be language "cpp", or pseudocode with an equivalentCpp`);
    }
    const fill = atom.codeFill;
    if (!fill) continue;
    fillCount += 1;
    if (!fill.task) errors.push(`${atom.id}: codeFill has no task`);
    if (fill.expectedOutput === undefined) errors.push(`${atom.id}: codeFill has no expectedOutput`);
    const gaps = [...String(fill.code || "").matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
    const blanks = fill.blanks || [];
    if (!gaps.length) {
      errors.push(`${atom.id}: codeFill has no gaps; write them as {{1}}, {{2}}, ...`);
      continue;
    }
    if (new Set(gaps).size !== gaps.length || gaps.some((g, i) => g !== i + 1)) {
      errors.push(`${atom.id}: codeFill gaps must be numbered {{1}}, {{2}}, ... once each, in order`);
    }
    if (blanks.length !== gaps.length) {
      errors.push(`${atom.id}: codeFill has ${gaps.length} gap(s) but ${blanks.length} blank definition(s)`);
      continue;
    }
    if (blanks.some((b) => !b.answers?.length || b.answers.some((a) => !String(a).trim()))) {
      errors.push(`${atom.id}: every codeFill gap needs at least one non-empty accepted answer`);
      continue;
    }
    for (const v of fillVariants(fill)) {
      cppSnippets.push({
        id: `${atom.id} (codeFill ${v.label})`,
        code: v.code,
        expectedOutput: fill.expectedOutput,
        inputs: fill.inputs,
        files: fill.files,
        std: fill.std,
      });
    }
  }
}

/* The C++ certification exam is held to the same standard: every "what does
 * this print?" item is compiled and run with the lessons' programs. */
const { ITEMS: CPP_EXAM_ITEMS } = await import("./finalExam/cpp/bank.js");
const cppExamPredict = CPP_EXAM_ITEMS.filter((i) => i.type === "predict");
for (const item of cppExamPredict) {
  if (!item.expectedOutput) {
    errors.push(`${item.id}: C++ exam item has no expectedOutput`);
    continue;
  }
  cppSnippets.push({
    id: item.id,
    code: item.code,
    expectedOutput: item.expectedOutput,
    compileWarning: item.compileWarning,
  });
}

const cppCompiler = findCompiler();
const cppResult = await verifySnippets(cppSnippets, cppCompiler);
errors.push(...cppResult.errors);

/* ── 2c-ix. Every web lab must be solved by its model answer, in a browser ─
 *
 * The Responsive Web Development course grades rendered pages, so its labs are
 * proved by rendering them: lib/academy/web/run.mjs loads every `webLab` in
 * headless Chrome with the exact document the lesson builds. The model answer
 * must pass every check with no uncaught error; the starter must fail one.
 * Every `webDemo` must render without throwing.
 *
 * Each atom carries at most one graded practice, as in the C++ course: the
 * player marks the atom solved when its practice is solved, so a second would
 * never be checked. And every decision must have a real answer.
 *
 * A browser is optional, like Python and g++: without one the labs are
 * reported as NOT verified.
 */
const { verifyLabs, findBrowser } = await import("./web/run.mjs");
const WD_GRADED = ["webLab", "codeExercise", "decision", "terminalExercise"];
const webLabs = [];
const webDemos = [];
for (const lesson of LESSONS) {
  if (!lesson.moduleId?.startsWith("wd-")) continue;
  for (const atom of lesson.atoms) {
    const graded = WD_GRADED.filter((k) => atom[k]);
    if (graded.length > 1) {
      errors.push(`${atom.id}: has ${graded.length} graded practices (${graded.join(", ")}); one per atom`);
    }
    if (atom.decision) {
      const d = atom.decision;
      if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
      for (const o of d.options || []) {
        if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option "${o.id}" has no whyWrong`);
      }
    }
    if (atom.webLab) webLabs.push({ id: atom.id, lab: atom.webLab });
    if (atom.webDemo) webDemos.push({ id: atom.id, demo: atom.webDemo });
  }
}
const webBrowser = findBrowser();
const webResult = await verifyLabs(webLabs, webDemos, webBrowser);
errors.push(...webResult.errors);

/* ── 2e. The cybersecurity practices ───────────────────────────────────── */

/**
 * Same discipline as the spreadsheet and Power Query checks above, applied to
 * the security kit: every graded practice must be SOLVABLE and must not be
 * PRE-SOLVED, and every model answer lives in lib/ where a learner cannot read
 * it. See lib/academy/cyber/validate.mjs for what each check guards.
 */
const { validateCyberPractices } = await import("./cyber/validate.mjs");
const cyber = await validateCyberPractices(LESSONS);
errors.push(...cyber.errors);

/* ── 2f. The forex practices ───────────────────────────────────────────── */

/**
 * A trading course that teaches a wrong lot size teaches someone to lose
 * money. So nothing a forex lesson asserts with a number is trusted:
 *
 *   calcExercise    the stated `answer` is recomputed from `check.fn` and
 *                   `check.args`, using the engine the component uses.
 *   candleExercise  every candle is a possible candle (high above both open
 *                   and close, low below both), and the pattern the learner
 *                   is asked to find really occurs, exactly `expectCount`
 *                   times, so the author knows how many there are.
 *   candles         the same validity check; `expectStructure`, when given,
 *                   must be what classifyStructure() reads from the data.
 *   ticketExercise  the expected order is one a platform would accept, and
 *                   where a risk percentage is stated its lot size is the
 *                   correct position size, rounded down.
 *
 * And one graded practice per atom: the player marks an atom solved when
 * its practice is solved, so a second one on the same atom would be skipped.
 */
const fx = await import("./forex/engine.js");
const fxCounts = { calc: 0, candle: 0, chart: 0, ticket: 0, decision: 0 };
const GRADED_KEYS = [
  "exercise", "pivotExercise", "chartChoice", "queryExercise", "modelExercise", "codeExercise",
  "phishExercise", "captureExercise", "permsExercise", "firewallExercise", "huntExercise",
  "riskExercise", "terminalExercise", "cryptoExercise", "drill", "decision",
  "calcExercise", "candleExercise", "ticketExercise",
];

for (const lesson of LESSONS) {
  if (!lesson.moduleId?.startsWith("fx-")) continue;
  for (const atom of lesson.atoms) {
    const graded = GRADED_KEYS.filter((k) => atom[k]);
    if (graded.length > 1) {
      errors.push(`${atom.id}: has ${graded.length} graded practices (${graded.join(", ")}); one per atom`);
    }

    if (atom.decision) {
      fxCounts.decision += 1;
      const d = atom.decision;
      if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
      for (const o of d.options || []) {
        if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option "${o.id}" has no whyWrong`);
      }
    }

    const cx = atom.calcExercise;
    if (cx) {
      fxCounts.calc += 1;
      if (!cx.question) errors.push(`${atom.id}: calc exercise has no question`);
      if (!cx.hint || !cx.working) errors.push(`${atom.id}: calc exercise needs both a hint and the working`);
      const fn = fx.CALCULATORS[cx.check?.fn];
      if (!fn) {
        errors.push(`${atom.id}: calc exercise names unknown function "${cx.check?.fn}"`);
      } else {
        const got = fn(cx.check.args || {});
        const tol = cx.tolerance ?? 0.01;
        if (typeof got !== "number" || !Number.isFinite(got) || Math.abs(got - cx.answer) > tol + 1e-9) {
          errors.push(`${atom.id}: the lesson's answer is ${cx.answer}, but ${cx.check.fn}() gives ${got}`);
        }
      }
    }

    for (const spec of [atom.candles, atom.candleExercise].filter(Boolean)) {
      const bad = (spec.data || []).findIndex((c) => !fx.candleIsValid(c));
      if (!spec.data?.length) errors.push(`${atom.id}: chart has no candles`);
      else if (bad >= 0) errors.push(`${atom.id}: candle ${bad} is impossible (check its high and low)`);
    }
    if (atom.candles) {
      fxCounts.chart += 1;
      const want = atom.candles.expectStructure;
      if (want) {
        const got = fx.classifyStructure(atom.candles.data);
        if (got !== want) errors.push(`${atom.id}: chart is described as ${want}, but its swings read as ${got}`);
      }
    }
    const kx = atom.candleExercise;
    if (kx) {
      fxCounts.candle += 1;
      if (!fx.PATTERNS[kx.pattern]) {
        errors.push(`${atom.id}: unknown candle pattern "${kx.pattern}"`);
      } else {
        const found = fx.findPattern(kx.data, kx.pattern);
        if (!found.length) errors.push(`${atom.id}: no candle on the chart is a ${kx.pattern}`);
        if (kx.expectCount !== undefined && found.length !== kx.expectCount) {
          errors.push(
            `${atom.id}: the author expects ${kx.expectCount} ${kx.pattern} candle(s), ` +
              `the definition finds ${found.length} (at ${found.join(", ")})`
          );
        }
      }
    }

    const tx = atom.ticketExercise;
    if (tx) {
      fxCounts.ticket += 1;
      const e = tx.expect || {};
      const side = fx.sideOf(e.type, e.side);
      if (e.type !== "market" && e.side && e.side !== side) {
        errors.push(`${atom.id}: expected side "${e.side}" contradicts order type "${e.type}"`);
      }
      const problems = fx.checkOrder({ ...e, side, bid: tx.bid, ask: tx.ask });
      if (problems.length) errors.push(`${atom.id}: the expected order would be rejected: ${problems[0]}`);
      if (!(tx.ask > tx.bid)) errors.push(`${atom.id}: ask must be above bid`);
      if (tx.riskPercent) {
        const fill = fx.fillPrice({ ...e, side, bid: tx.bid, ask: tx.ask });
        const stopPips = Math.round((Math.abs(fill - e.sl) / fx.pipSize(tx.pair)) * 10) / 10;
        const pvLot = fx.pipValue({ pair: tx.pair, lots: 1, price: fill, quoteToUsd: tx.quoteToUsd });
        const lots = fx.positionSize({ balance: tx.balance, riskPercent: tx.riskPercent, stopPips, pipValuePerLot: pvLot });
        if (Math.abs(lots - e.lots) > 1e-9) {
          errors.push(
            `${atom.id}: ${tx.riskPercent}% of ${tx.balance} with a ${stopPips}-pip stop is ${lots} lots, ` +
              `but the exercise expects ${e.lots}`
          );
        }
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

// The final exam bank, assembler, grader and recorder are all fatal to import
// from the client: the bank holds the key, the assembler and grader import it
// transitively, and the recorder would drag firebase-admin into the bundle.
const IMPORTS_EXAM =
  /(?:^|\n)\s*import\s[^;]*?from\s*["'][^"']*finalExam\/(bank|grade|assemble|record|registry|javascript|forex|python|cpp|web)[^"']*["']|require\(\s*["'][^"']*finalExam\/(bank|grade|assemble|record|registry|javascript|forex|python|cpp|web)[^"']*["']\s*\)|import\(\s*["'][^"']*finalExam\/(bank|grade|assemble|record|registry|javascript|forex|python|cpp|web)[^"']*["']\s*\)/;

for (const file of walk(join(ROOT, "src"))) {
  const source = readFileSync(file, "utf8");
  if (IMPORTS_BANK.test(source)) {
    errors.push(
      `SECURITY: ${relative(ROOT, file)} imports the assessment bank. ` +
        `Correct answers would ship to the browser.`
    );
  }
  if (IMPORTS_EXAM.test(source)) {
    errors.push(
      `SECURITY: ${relative(ROOT, file)} imports the final exam bank, ` +
        `assembler or grader. The exam answer key would ship to the browser.`
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
notes.push(`${queryCount} Power Query exercises`);
notes.push(`${modelCount} data model exercises`);
notes.push(`${daxCount} DAX measure demos`);
notes.push(
  `cybersecurity practices: ${cyber.counts.decision} judgement calls · ` +
    `${cyber.counts.phish} message triage · ${cyber.counts.capture} packet captures · ` +
    `${cyber.counts.perms} permission sets · ${cyber.counts.firewall} firewall policies · ` +
    `${cyber.counts.hunt} detection rules · ${cyber.counts.risk} risk rankings · ` +
    `${cyber.counts.terminal} terminals · ${cyber.counts.crypto} crypto labs`
);
notes.push(
  `forex practices: ${fxCounts.calc} verified calculations · ${fxCounts.candle} chart-reading exercises · ` +
    `${fxCounts.chart} charts · ${fxCounts.ticket} order tickets · ${fxCounts.decision} judgement calls`
);
if (snippetCount) {
  notes.push(
    pythonCmd
      ? `${snippetsChecked} of ${snippetCount} python snippets executed and verified`
      : `${snippetCount} python snippets NOT verified (no python on PATH)`
  );
}
if (pyExamPredict.length) {
  notes.push(
    pythonCmd
      ? `${pyExamChecked} of ${pyExamPredict.length} Python Programming exam items executed and verified`
      : `${pyExamPredict.length} Python Programming exam items NOT verified (no python on PATH)`
  );
}
if (challenges.length) {
  notes.push(
    pythonCmd
      ? `${challengesChecked} of ${challenges.length} write-the-code challenges solved by their model answer, ` +
          `and not by their starter (${inputSnippetsChecked} input() snippets verified)`
      : `${challenges.length} write-the-code challenges NOT verified (no python on PATH)`
  );
}
if (jsSnippets.length) {
  notes.push(
    `${jsChecked} of ${jsSnippets.length} javascript snippets executed in Node and verified ` +
      `(${jsExamPredict.length} of them certification exam items)`
  );
}
if (cppSnippets.length) {
  notes.push(
    cppCompiler
      ? `${cppResult.checked} of ${cppSnippets.length} C++ programs compiled with ${cppCompiler.version} and verified ` +
          `(${fillCount} write-the-missing-code practices, every accepted answer proved; ` +
          `${cppExamPredict.length} certification exam items)`
      : `${cppSnippets.length} C++ programs NOT verified (no g++ on PATH; set CXX to use another compiler)`
  );
}
if (webLabs.length || webDemos.length) {
  notes.push(
    webBrowser
      ? `${webResult.checked} of ${webLabs.length} web labs solved in headless Chrome by their model answer and not by their starter; ` +
          `${webResult.demosChecked} of ${webDemos.length} web demos rendered without errors`
      : `${webLabs.length} web labs and ${webDemos.length} demos NOT verified (no Chrome, Edge or Chromium found; set CHROME_PATH)`
  );
}
notes.push(
  `${EXAM_ITEMS.length} final exam items in the bank ` +
    `(${examPredict.length} python, ` +
    `${EXAM_ITEMS.filter((i) => i.type === "formula").length} live formula)`
);
if (examPyCount) {
  notes.push(
    pythonCmd
      ? `${examPyChecked} of ${examPyCount} exam python items executed and verified`
      : `${examPyCount} exam python items NOT verified (no python on PATH)`
  );
}
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
