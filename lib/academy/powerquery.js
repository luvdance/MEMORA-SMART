/**
 * POWER QUERY STEP ENGINE
 *
 * Power Query's central idea is that cleaning is a RECIPE, not an edit: every
 * transformation is recorded as a step, the steps replay in order on refresh,
 * and any step can be removed or reordered afterwards. That cannot be taught
 * with a before-and-after table, because the whole point is what happens
 * between them and in what order.
 *
 * So this applies real steps to a real table, in sequence, and the component
 * shows the Applied Steps list building up beside the result.
 *
 * Pulled into lib/ rather than the component so the content validator can
 * check that a lesson's expected recipe actually produces the table the lesson
 * claims — the same rule the pivot and formula engines already follow.
 *
 * A step is { type, column?, value? }. Unknown steps are ignored rather than
 * thrown, so a malformed lesson degrades to "no effect" instead of a blank
 * screen; the validator is what catches it.
 */

const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

/** The steps a learner can apply, with the M each one generates. */
export const STEP_LIBRARY = {
  removeColumn: {
    label: "Remove column",
    m: 'Table.RemoveColumns(Source, {"COLUMN"})',
    describe: (c) => `Removed column "${c}"`,
    why: "Fewer columns means a smaller model and a faster refresh.",
  },
  trim: {
    label: "Trim whitespace",
    m: 'Table.TransformColumns(Source, {{"COLUMN", Text.Trim}})',
    describe: (c) => `Trimmed "${c}"`,
    why: "Leading and trailing spaces break every match and every join.",
  },
  changeType: {
    label: "Change type to number",
    m: 'Table.TransformColumnTypes(Source, {{"COLUMN", type number}})',
    describe: (c) => `Changed "${c}" to a number`,
    why: "A numeric column stored as text aggregates as Count, not Sum.",
  },
  removeDuplicates: {
    label: "Remove duplicates",
    m: 'Table.Distinct(Source, {"COLUMN"})',
    describe: (c) => `Removed duplicates on "${c}"`,
    why: "A duplicated row double-counts into every total built on it.",
  },
  removeBlankRows: {
    label: "Remove blank rows",
    m: 'Table.SelectRows(Source, each [COLUMN] <> null and [COLUMN] <> "")',
    describe: (c) => `Removed rows where "${c}" is blank`,
    why: "A row with no key cannot be joined, counted or attributed.",
  },
  upperFirst: {
    label: "Capitalise each word",
    m: 'Table.TransformColumns(Source, {{"COLUMN", Text.Proper}})',
    describe: (c) => `Capitalised each word in "${c}"`,
    why: "Cosmetic for matching, which ignores case — but it makes labels presentable.",
  },
};

/**
 * Run a recipe. Returns the resulting table plus a log of what each step did,
 * so the UI can show the Applied Steps list without recomputing anything.
 */
export function applySteps(source, steps = []) {
  let headers = [...(source?.headers || [])];
  let rows = (source?.rows || []).map((r) => [...r]);
  const log = [];

  for (const step of steps) {
    const idx = headers.indexOf(step.column);
    const before = rows.length;

    switch (step.type) {
      case "removeColumn":
        if (idx >= 0) {
          headers = headers.filter((_, i) => i !== idx);
          rows = rows.map((r) => r.filter((_, i) => i !== idx));
        }
        break;

      case "trim":
        if (idx >= 0) {
          rows = rows.map((r) =>
            r.map((c, i) => (i === idx && typeof c === "string" ? c.trim() : c))
          );
        }
        break;

      case "upperFirst":
        if (idx >= 0) {
          rows = rows.map((r) =>
            r.map((c, i) =>
              i === idx && typeof c === "string"
                ? c.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
                : c
            )
          );
        }
        break;

      case "changeType":
        if (idx >= 0) {
          rows = rows.map((r) =>
            r.map((c, i) => {
              if (i !== idx) return c;
              if (isBlank(c)) return c;
              const n = Number(String(c).replace(/,/g, "").trim());
              return Number.isNaN(n) ? c : n;
            })
          );
        }
        break;

      case "removeDuplicates":
        if (idx >= 0) {
          const seen = new Set();
          rows = rows.filter((r) => {
            const key = String(r[idx]);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
        break;

      case "removeBlankRows":
        if (idx >= 0) rows = rows.filter((r) => !isBlank(r[idx]));
        break;

      default:
        break; // unknown step: no effect, the validator reports it
    }

    const def = STEP_LIBRARY[step.type];
    log.push({
      type: step.type,
      column: step.column,
      label: def ? def.describe(step.column) : `Unknown step "${step.type}"`,
      m: def ? def.m.replace("COLUMN", step.column) : "",
      rowsBefore: before,
      rowsAfter: rows.length,
    });
  }

  return { headers, rows, log };
}

/** How many cells in a column are not numbers — the "stored as text" count. */
export function textNumberCount(table, column) {
  const idx = table.headers.indexOf(column);
  if (idx < 0) return 0;
  return table.rows.filter((r) => {
    const v = r[idx];
    if (isBlank(v)) return false;
    return typeof v !== "number";
  }).length;
}
