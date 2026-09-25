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
 * Mathematics modules. One lesson file and one assessment file per module,
 * named identically on both sides, so a new module is one string rather than
 * two paths that can drift apart.
 */
const MATHS_MODULES = [
  "m1-welcome",
  "m1-language",
  "m1-numbers",
  "m1-place-value",
  "m2-operations",
  "m2-factors",
];

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
    lessons: `../../src/academy/data/lessons/ma-${module}.js`,
    assessments: `./assessments/ma-${module}.js`,
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
for (const lesson of LESSONS) {
  for (const atom of lesson.atoms) {
    for (const spec of [atom.code, atom.codeExercise]) {
      if (!spec?.code) continue;
      snippetCount += 1;
      if (!spec.expectedOutput && !spec.raises) {
        errors.push(`${atom.id}: python snippet has neither expectedOutput nor raises`);
        continue;
      }
      pySnippets.push({ id: atom.id, ...spec });
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
      stdout = execFileSync(pythonCmd, [file], { stdio: "pipe", encoding: "utf8" });
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
  /(?:^|\n)\s*import\s[^;]*?from\s*["'][^"']*finalExam\/(bank|grade|assemble|record)[^"']*["']|require\(\s*["'][^"']*finalExam\/(bank|grade|assemble|record)[^"']*["']\s*\)|import\(\s*["'][^"']*finalExam\/(bank|grade|assemble|record)[^"']*["']\s*\)/;

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
if (snippetCount) {
  notes.push(
    pythonCmd
      ? `${snippetsChecked} of ${snippetCount} python snippets executed and verified`
      : `${snippetCount} python snippets NOT verified (no python on PATH)`
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
