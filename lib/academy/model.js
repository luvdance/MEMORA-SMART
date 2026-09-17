/**
 * DATA MODEL ENGINE
 *
 * Two concepts in this module cannot be seen: cardinality, and the direction a
 * filter travels. Both are invisible in the Model view — a line between two
 * boxes looks the same whichever way it filters — and both are where beginners
 * lose days.
 *
 * So this computes them for real. Given two tables and the columns joining
 * them it works out the cardinality from the DATA (is this key unique on each
 * side?) rather than from what the learner assumed, and it propagates a filter
 * along the relationship so the learner can watch a filter reach the fact table
 * and fail to reach back the other way.
 *
 * It also finds orphans — fact rows whose key is missing from the dimension —
 * because that is the cause of the BLANK row that appears in a Power BI visual
 * and makes a breakdown fail to add up to its own grand total.
 *
 * Lives in lib/ so the content validator can check that the figures a lesson
 * quotes are the figures the model actually produces.
 */

const col = (table, name) => table.headers.indexOf(name);
const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

/** Distinct non-blank values of a column. */
function distinct(table, name) {
  const i = col(table, name);
  if (i < 0) return [];
  const seen = new Set();
  for (const r of table.rows) if (!isBlank(r[i])) seen.add(String(r[i]));
  return [...seen];
}

/** Is every non-blank value in this column unique? That is what makes a "one" side. */
export function isUnique(table, name) {
  const i = col(table, name);
  if (i < 0) return false;
  const values = table.rows.map((r) => r[i]).filter((v) => !isBlank(v)).map(String);
  return new Set(values).size === values.length;
}

/**
 * Work out the cardinality from the data, not from the author's intention.
 * Power BI does exactly this on creating a relationship, which is why it
 * sometimes announces many-to-many when you expected one-to-many — the key you
 * believed was unique is not.
 */
export function detectCardinality(a, aCol, b, bCol) {
  const aUnique = isUnique(a, aCol);
  const bUnique = isUnique(b, bCol);
  if (aUnique && bUnique) return { kind: "one-to-one", label: "1 : 1", aUnique, bUnique };
  if (aUnique) return { kind: "one-to-many", label: "1 : *", aUnique, bUnique };
  if (bUnique) return { kind: "many-to-one", label: "* : 1", aUnique, bUnique };
  return { kind: "many-to-many", label: "* : *", aUnique, bUnique };
}

/**
 * Fact rows whose key does not exist in the dimension. These are why a visual
 * shows a row labelled (Blank) and why the breakdown does not add up to the
 * grand total.
 */
export function findOrphans(fact, factCol, dim, dimCol) {
  const known = new Set(distinct(dim, dimCol));
  const i = col(fact, factCol);
  if (i < 0) return { rows: [], values: [] };
  const rows = fact.rows.filter((r) => isBlank(r[i]) || !known.has(String(r[i])));
  const values = [...new Set(rows.map((r) => (isBlank(r[i]) ? "(blank)" : String(r[i]))))];
  return { rows, values };
}

/**
 * Propagate a filter across one relationship.
 *
 * The rule that matters: a filter travels from the ONE side to the MANY side
 * automatically. It does NOT travel back from many to one unless the
 * relationship is set to filter both ways. Getting this backwards is the
 * single most common modelling mistake.
 *
 * `filter` is { table: "States", column: "StateName", value: "Lagos" }.
 */
export function propagate({ dim, fact, dimCol, factCol, bothDirections = false }, filter) {
  const result = {
    dimRows: dim.rows,
    factRows: fact.rows,
    travelled: false,
    blocked: false,
  };
  if (!filter) return result;

  const fromDim = filter.table === "dim";
  const srcTable = fromDim ? dim : fact;
  const srcIdx = col(srcTable, filter.column);
  if (srcIdx < 0) return result;

  const matching = srcTable.rows.filter((r) => String(r[srcIdx]) === String(filter.value));

  if (fromDim) {
    // one → many: always travels
    const keyIdx = col(dim, dimCol);
    const keys = new Set(matching.map((r) => String(r[keyIdx])));
    const fIdx = col(fact, factCol);
    result.dimRows = matching;
    result.factRows = fact.rows.filter((r) => keys.has(String(r[fIdx])));
    result.travelled = true;
    return result;
  }

  // many → one: only travels when the relationship filters both ways
  result.factRows = matching;
  if (bothDirections) {
    const fIdx = col(fact, factCol);
    const keys = new Set(matching.map((r) => String(r[fIdx])));
    const keyIdx = col(dim, dimCol);
    result.dimRows = dim.rows.filter((r) => keys.has(String(r[keyIdx])));
    result.travelled = true;
  } else {
    result.blocked = true;
  }
  return result;
}

/** Sum a numeric column over a set of rows. */
export function sumOf(table, rows, name) {
  const i = col(table, name);
  if (i < 0) return 0;
  return rows.reduce((total, r) => {
    const n = Number(r[i]);
    return Number.isNaN(n) ? total : total + n;
  }, 0);
}

/** Totals grouped by a dimension column, following the relationship. */
export function breakdown({ dim, fact, dimCol, factCol }, labelCol, measureCol) {
  const labelIdx = col(dim, labelCol);
  const keyIdx = col(dim, dimCol);
  const out = dim.rows.map((r) => {
    const key = String(r[keyIdx]);
    const fIdx = col(fact, factCol);
    const rows = fact.rows.filter((f) => String(f[fIdx]) === key);
    return { label: String(r[labelIdx]), value: sumOf(fact, rows, measureCol), rows: rows.length };
  });

  const orphan = findOrphans(fact, factCol, dim, dimCol);
  if (orphan.rows.length) {
    out.push({
      label: "(Blank)",
      value: sumOf(fact, orphan.rows, measureCol),
      rows: orphan.rows.length,
      isOrphan: true,
    });
  }
  return out;
}
