import { useMemo, useState } from "react";
import { AGGREGATIONS, computePivot, fieldValues } from "../../../lib/academy/pivot";

/**
 * A WORKING PIVOT TABLE
 *
 * Pivot tables are the one Excel skill that cannot be taught with a formula,
 * because the whole point is that you build them by MOVING FIELDS rather than
 * by writing anything. Reading "drag State into Rows" teaches nobody; doing it
 * and watching the table rebuild teaches everybody.
 *
 * So this mirrors the real Field List:
 *   · fields are dragged (or picked, for touch and keyboard) into four areas
 *   · Rows and Columns become the axes, Values becomes the aggregated body
 *   · the aggregation is switchable, because "Count of Amount" appearing when
 *     you wanted "Sum of Amount" is the single most common pivot confusion
 *   · Filters narrows the source before anything is aggregated, which is the
 *     part learners consistently get the wrong way round
 *
 * Grand totals are always shown. They are how a learner catches a pivot built
 * on a filtered subset when they believed it covered everything.
 *
 * When an `exercise` is supplied the learner must arrange the fields to match
 * a described outcome. The check compares the ARRANGEMENT, not the numbers,
 * because two people who both put State in Rows have both understood it.
 */

const EXCEL_ZONES = [
  { id: "filter", label: "Filters", hint: "Narrows the data BEFORE anything is added up" },
  { id: "column", label: "Columns", hint: "Becomes the across-the-top axis" },
  { id: "row", label: "Rows", hint: "Becomes the down-the-side axis" },
  { id: "value", label: "Values", hint: "The numbers in the body of the table" },
];

/**
 * Power BI calls the same four wells by different names. Teaching them as the
 * same idea is the point: a learner who understood pivot areas already
 * understands field wells, and saying so saves them re-learning it.
 */
const POWERBI_ZONES = [
  { id: "filter", label: "Filters", hint: "Filters this visual before anything is aggregated" },
  { id: "column", label: "Legend", hint: "Splits each bar or line into a series" },
  { id: "row", label: "X-axis", hint: "The category the visual is broken down by" },
  { id: "value", label: "Values", hint: "The measure that gets summarised" },
];

function fmt(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function PivotSim({
  source,
  exercise = null,
  onSolved,
  alreadySolved = false,
  initial = {},
  wells = "excel",
}) {
  const ZONES = wells === "powerbi" ? POWERBI_ZONES : EXCEL_ZONES;
  // Memoised because `|| []` would hand the pivot memo a brand new array on
  // every render, rebuilding the whole table on each keystroke elsewhere.
  const headers = useMemo(() => source?.headers || [], [source]);
  const dataRows = useMemo(() => source?.rows || [], [source]);

  const [layout, setLayout] = useState(() => ({
    filter: initial.filter ?? null,
    column: initial.column ?? null,
    row: initial.row ?? null,
    value: initial.value ?? null,
    agg: initial.agg ?? "sum",
    filterValue: initial.filterValue ?? "(All)",
  }));

  const [dragging, setDragging] = useState(null);
  const [checked, setChecked] = useState(() =>
    alreadySolved && exercise
      ? { ok: true, message: "You already built this one. Move the fields around freely to experiment." }
      : null
  );

  const assigned = [layout.filter, layout.column, layout.row, layout.value].filter(Boolean);
  const unassigned = headers.filter((h) => !assigned.includes(h));

  const place = (zone, field) => {
    setLayout((prev) => {
      const next = { ...prev };
      // A field lives in one zone at a time, exactly as in Excel.
      for (const z of ["filter", "column", "row", "value"]) {
        if (next[z] === field) next[z] = null;
      }
      next[zone] = field;
      if (zone === "filter") next.filterValue = "(All)";
      return next;
    });
    setChecked(null);
  };

  const clear = (zone) => {
    setLayout((prev) => ({ ...prev, [zone]: null, ...(zone === "filter" ? { filterValue: "(All)" } : {}) }));
    setChecked(null);
  };

  /* The maths lives in lib/academy/pivot.js so the figures quoted in the
     lesson text can be checked by the content validator, not just by eye. */
  const pivot = useMemo(() => computePivot(source, layout), [source, layout]);

  const filterOptions = useMemo(
    () => (layout.filter ? fieldValues(source, layout.filter) : []),
    [source, layout.filter]
  );

  /* ── Checking ─────────────────────────────────────────────────────── */
  function check() {
    const want = exercise.expect || {};
    const problems = [];

    const compare = (zone, label) => {
      if (want[zone] === undefined) return;
      const got = layout[zone];
      if (want[zone] === null && got) problems.push(`${label} should be empty.`);
      else if (want[zone] && got !== want[zone]) {
        problems.push(
          got ? `${label} holds ${got}, not ${want[zone]}.` : `${label} is still empty.`
        );
      }
    };

    compare("row", "Rows");
    compare("column", "Columns");
    compare("value", "Values");
    compare("filter", "Filters");

    if (want.agg && layout.agg !== want.agg) {
      problems.push(
        `The Values field is summarised by ${AGGREGATIONS[layout.agg].label}, not ${AGGREGATIONS[want.agg].label}.`
      );
    }
    if (want.filterValue && String(layout.filterValue) !== String(want.filterValue)) {
      problems.push(`The filter is set to ${layout.filterValue}, not ${want.filterValue}.`);
    }

    if (problems.length) {
      setChecked({ ok: false, message: problems[0] });
      return;
    }

    setChecked({ ok: true, message: exercise.successMessage || "That is the right arrangement." });
    onSolved?.();
  }

  const valueLabel = layout.value
    ? `${AGGREGATIONS[layout.agg].label} of ${layout.value}`
    : "";

  return (
    <div className="ac-pivot">
      {exercise && (
        <div className="ac-pivot__task">
          <span className="ac-note__label">Build this</span>
          <p>{exercise.task}</p>
        </div>
      )}

      {/* SOURCE */}
      <details className="ac-pivot__source">
        <summary>Source data — {dataRows.length} rows</summary>
        <div className="ac-pivot__source-scroll">
          <table className="ac-pivot__table">
            <thead>
              <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {dataRows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className={typeof c === "number" ? "is-number" : ""}>
                      {typeof c === "number" ? fmt(c) : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* FIELD LIST */}
      <div className="ac-pivot__fields">
        <span className="ac-pivot__fields-label">Field list</span>
        <div className="ac-pivot__chips">
          {unassigned.length === 0 && (
            <span className="ac-pivot__empty-note">Every field is placed.</span>
          )}
          {unassigned.map((f) => (
            <span
              key={f}
              className="ac-pivot__chip"
              draggable
              onDragStart={() => setDragging(f)}
              onDragEnd={() => setDragging(null)}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ZONES */}
      <div className="ac-pivot__zones">
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`ac-pivot__zone ${dragging ? "is-droppable" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging) place(zone.id, dragging);
              setDragging(null);
            }}
          >
            <span className="ac-pivot__zone-label">{zone.label}</span>

            {layout[zone.id] ? (
              <span className="ac-pivot__chip is-placed">
                {layout[zone.id]}
                <button
                  onClick={() => clear(zone.id)}
                  aria-label={`Remove ${layout[zone.id]} from ${zone.label}`}
                >
                  ✕
                </button>
              </span>
            ) : (
              <select
                className="ac-pivot__picker"
                value=""
                onChange={(e) => e.target.value && place(zone.id, e.target.value)}
                aria-label={`Add a field to ${zone.label}`}
              >
                <option value="">Drag a field, or pick one…</option>
                {headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            )}

            {zone.id === "value" && layout.value && (
              <select
                className="ac-pivot__agg"
                value={layout.agg}
                onChange={(e) => {
                  setLayout((p) => ({ ...p, agg: e.target.value }));
                  setChecked(null);
                }}
                aria-label="Summarise values by"
              >
                {Object.entries(AGGREGATIONS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            )}

            {zone.id === "filter" && layout.filter && (
              <select
                className="ac-pivot__agg"
                value={layout.filterValue}
                onChange={(e) => {
                  setLayout((p) => ({ ...p, filterValue: e.target.value }));
                  setChecked(null);
                }}
                aria-label={`Filter ${layout.filter} to`}
              >
                <option value="(All)">(All)</option>
                {filterOptions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}

            <span className="ac-pivot__zone-hint">{zone.hint}</span>
          </div>
        ))}
      </div>

      {/* OUTPUT */}
      <div className="ac-pivot__output">
        {!pivot ? (
          <p className="ac-pivot__placeholder">
            A pivot table needs at least one field in <strong>Rows</strong> or{" "}
            <strong>Columns</strong>, and one in <strong>Values</strong>.
          </p>
        ) : (
          <div className="ac-pivot__source-scroll">
            <table className="ac-pivot__table ac-pivot__table--result">
              <caption>
                {valueLabel}
                {layout.filter && layout.filterValue !== "(All)"
                  ? ` · filtered to ${layout.filter} = ${layout.filterValue} (${pivot.rowCount} of ${dataRows.length} rows)`
                  : ` · all ${pivot.rowCount} rows`}
              </caption>
              <thead>
                <tr>
                  <th>{layout.row || ""}</th>
                  {pivot.colKeys.map((ck, i) => (
                    <th key={i}>{layout.column ? String(ck) : valueLabel}</th>
                  ))}
                  {layout.column && <th className="is-total">Grand Total</th>}
                </tr>
              </thead>
              <tbody>
                {pivot.rowKeys.map((rk, i) => (
                  <tr key={i}>
                    <th scope="row">{layout.row ? String(rk) : "Total"}</th>
                    {pivot.body[i].map((v, j) => (
                      <td key={j} className="is-number">{fmt(v)}</td>
                    ))}
                    {layout.column && (
                      <td className="is-number is-total">{fmt(pivot.rowTotals[i])}</td>
                    )}
                  </tr>
                ))}
                <tr className="is-grand">
                  <th scope="row">Grand Total</th>
                  {pivot.colKeys.map((_, j) => (
                    <td key={j} className="is-number">{fmt(pivot.colTotals[j])}</td>
                  ))}
                  {layout.column && <td className="is-number is-total">{fmt(pivot.grand)}</td>}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {exercise && (
        <div className="ac-pivot__check">
          <button className="ac-pivot__check-btn" onClick={check}>
            Check my pivot
          </button>
          {checked && (
            <p className={`ac-pivot__feedback ${checked.ok ? "is-ok" : "is-bad"}`} role="status">
              {checked.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
