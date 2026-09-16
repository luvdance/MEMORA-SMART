/**
 * PIVOT ENGINE
 *
 * Pulled out of the React component on purpose: the numbers a learner reads
 * off a pivot are taught as fact in the lesson text, so they have to be
 * verifiable outside a browser. `npm run validate:content` checks the figures
 * quoted in the pivot lessons against this module, exactly as it already
 * checks every spreadsheet exercise against the formula engine.
 *
 * A layout is:
 *   { row, column, value, filter, agg, filterValue }
 * where row/column/value/filter are field NAMES (or null) and agg is one of
 * the AGGREGATIONS keys below.
 */

export const AGGREGATIONS = {
  sum: { label: "Sum", apply: (nums) => nums.reduce((a, b) => a + b, 0) },
  count: { label: "Count", apply: (nums) => nums.length },
  average: {
    label: "Average",
    apply: (nums) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0),
  },
  max: { label: "Max", apply: (nums) => (nums.length ? Math.max(...nums) : 0) },
  min: { label: "Min", apply: (nums) => (nums.length ? Math.min(...nums) : 0) },
};

const isFilled = (v) => v !== "" && v !== null && v !== undefined;

/**
 * Build a pivot. Returns null when the layout cannot produce one — a real
 * pivot needs something on an axis and something to aggregate.
 */
export function computePivot(source, layout) {
  const headers = source?.headers || [];
  const dataRows = source?.rows || [];

  if (!layout?.value) return null;
  if (!layout.row && !layout.column) return null;

  const rIdx = headers.indexOf(layout.row);
  const cIdx = headers.indexOf(layout.column);
  const vIdx = headers.indexOf(layout.value);
  const fIdx = headers.indexOf(layout.filter);

  const filterValue = layout.filterValue ?? "(All)";
  const visible = dataRows.filter((r) => {
    if (!layout.filter || filterValue === "(All)") return true;
    return String(r[fIdx]) === String(filterValue);
  });

  const uniq = (idx) => {
    const seen = [];
    for (const r of visible) {
      const v = r[idx];
      if (!seen.some((s) => String(s) === String(v))) seen.push(v);
    }
    return seen.sort((a, b) =>
      typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b))
    );
  };

  const rowKeys = layout.row ? uniq(rIdx) : [null];
  const colKeys = layout.column ? uniq(cIdx) : [null];
  const agg = AGGREGATIONS[layout.agg] || AGGREGATIONS.sum;

  // Count counts entries; every other aggregation needs real numbers.
  const pick = (rows) =>
    layout.agg === "count"
      ? rows.map((r) => r[vIdx]).filter(isFilled)
      : rows.map((r) => Number(r[vIdx])).filter((n) => !Number.isNaN(n));

  const inRow = (r, rk) => !layout.row || String(r[rIdx]) === String(rk);
  const inCol = (r, ck) => !layout.column || String(r[cIdx]) === String(ck);

  const body = rowKeys.map((rk) =>
    colKeys.map((ck) => agg.apply(pick(visible.filter((r) => inRow(r, rk) && inCol(r, ck)))))
  );

  const rowTotals = rowKeys.map((rk) => agg.apply(pick(visible.filter((r) => inRow(r, rk)))));
  const colTotals = colKeys.map((ck) => agg.apply(pick(visible.filter((r) => inCol(r, ck)))));
  const grand = agg.apply(pick(visible));

  return { rowKeys, colKeys, body, rowTotals, colTotals, grand, rowCount: visible.length };
}

/** The distinct values of a field, for a Filters dropdown. */
export function fieldValues(source, field) {
  const headers = source?.headers || [];
  const idx = headers.indexOf(field);
  if (idx < 0) return [];
  const seen = [];
  for (const r of source.rows || []) {
    const v = String(r[idx]);
    if (!seen.includes(v)) seen.push(v);
  }
  return seen.sort();
}
