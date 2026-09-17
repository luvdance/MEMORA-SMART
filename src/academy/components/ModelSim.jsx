import { useMemo, useState } from "react";
import {
  breakdown,
  detectCardinality,
  findOrphans,
  propagate,
  sumOf,
} from "../../../lib/academy/model";

/**
 * THE MODEL VIEW, WITH THE INVISIBLE PARTS MADE VISIBLE
 *
 * A relationship in Power BI is a line between two boxes. The line does not
 * show you the two things that actually matter: which side is the "one", and
 * which way a filter travels along it. Both are decided by the DATA, and both
 * are where beginners lose days.
 *
 * So this shows them. Pick the two columns to join and the cardinality is
 * computed from whether each key is genuinely unique — not from what the
 * learner intended. Then run a filter from either end and watch it reach the
 * fact table, or fail to reach back the other way.
 *
 * It also reports orphans, because a fact row whose key is missing from the
 * dimension is what produces the (Blank) row in a real visual — and the
 * breakdown that mysteriously does not add up to its own grand total.
 */

const fmt = (n) =>
  typeof n === "number" ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : String(n);

export default function ModelSim({
  dim,
  fact,
  labelColumn,
  measureColumn,
  exercise = null,
  onSolved,
  alreadySolved = false,
  initial = {},
}) {
  const [dimCol, setDimCol] = useState(initial.dimCol || "");
  const [factCol, setFactCol] = useState(initial.factCol || "");
  const [bothDirections, setBoth] = useState(Boolean(initial.bothDirections));
  const [filterSide, setFilterSide] = useState("dim");
  const [filterValue, setFilterValue] = useState("");
  const [checked, setChecked] = useState(() =>
    alreadySolved && exercise
      ? { ok: true, message: "You already joined these correctly. Experiment freely." }
      : null
  );

  const joined = Boolean(dimCol && factCol);

  const card = useMemo(
    () => (joined ? detectCardinality(dim, dimCol, fact, factCol) : null),
    [joined, dim, dimCol, fact, factCol]
  );

  const orphans = useMemo(
    () => (joined ? findOrphans(fact, factCol, dim, dimCol) : { rows: [], values: [] }),
    [joined, fact, factCol, dim, dimCol]
  );

  const rel = { dim, fact, dimCol, factCol, bothDirections };

  const filterOptions = useMemo(() => {
    const t = filterSide === "dim" ? dim : fact;
    const c = filterSide === "dim" ? labelColumn : t.headers[0];
    const i = t.headers.indexOf(c);
    if (i < 0) return { column: c, values: [] };
    return { column: c, values: [...new Set(t.rows.map((r) => String(r[i])))] };
  }, [filterSide, dim, fact, labelColumn]);

  const flow = useMemo(() => {
    if (!joined || !filterValue) return null;
    return propagate(rel, {
      table: filterSide,
      column: filterOptions.column,
      value: filterValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, filterValue, filterSide, dimCol, factCol, bothDirections, filterOptions.column]);

  const rows = useMemo(
    () => (joined ? breakdown(rel, labelColumn, measureColumn) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [joined, dimCol, factCol, labelColumn, measureColumn]
  );

  const grand = sumOf(fact, fact.rows, measureColumn);
  const named = rows.filter((r) => !r.isOrphan).reduce((a, r) => a + r.value, 0);

  function check() {
    const want = exercise.expect || {};
    if (want.dimCol && dimCol !== want.dimCol) {
      return setChecked({
        ok: false,
        message: dimCol
          ? `The ${dim.name} side is joined on ${dimCol}, not ${want.dimCol}.`
          : `Nothing is selected on the ${dim.name} side yet.`,
      });
    }
    if (want.factCol && factCol !== want.factCol) {
      return setChecked({
        ok: false,
        message: factCol
          ? `The ${fact.name} side is joined on ${factCol}, not ${want.factCol}.`
          : `Nothing is selected on the ${fact.name} side yet.`,
      });
    }
    if (want.cardinality && card?.kind !== want.cardinality) {
      return setChecked({
        ok: false,
        message: `That join is ${card?.label}. A ${want.cardinality} relationship needs a key that is unique on one side.`,
      });
    }
    setChecked({ ok: true, message: exercise.successMessage || "That is the right relationship." });
    onSolved?.();
  }

  const TableBox = ({ table, selected, onSelect, side }) => (
    <div className={`ac-model__table ${side === "dim" ? "is-dim" : "is-fact"}`}>
      <div className="ac-model__table-head">
        {table.name}
        <span>{table.rows.length} rows</span>
      </div>
      <ul className="ac-model__cols">
        {table.headers.map((h) => (
          <li key={h}>
            <button
              type="button"
              className={`ac-model__col ${selected === h ? "is-key" : ""}`}
              onClick={() => {
                onSelect(selected === h ? "" : h);
                setChecked(null);
                setFilterValue("");
              }}
            >
              <span>{h}</span>
              {selected === h && <em>key</em>}
            </button>
          </li>
        ))}
      </ul>
      <p className="ac-model__table-hint">
        {side === "dim" ? "Dimension — describes things" : "Fact — records events"}
      </p>
    </div>
  );

  return (
    <div className="ac-model">
      {exercise && (
        <div className="ac-model__task">
          <span className="ac-note__label">Build the relationship</span>
          <p>{exercise.task}</p>
        </div>
      )}

      <div className="ac-model__canvas">
        <TableBox table={dim} selected={dimCol} onSelect={setDimCol} side="dim" />

        <div className="ac-model__link">
          {joined ? (
            <>
              <span className={`ac-model__card ac-model__card--${card.kind}`}>{card.label}</span>
              <span className="ac-model__arrow" aria-hidden="true">
                {bothDirections ? "◀───▶" : "───▶"}
              </span>
              <span className="ac-model__dirlabel">
                {bothDirections ? "both directions" : "single direction"}
              </span>
              <label className="ac-model__toggle">
                <input
                  type="checkbox"
                  checked={bothDirections}
                  onChange={(e) => { setBoth(e.target.checked); setChecked(null); }}
                />
                Filter both ways
              </label>
            </>
          ) : (
            <span className="ac-model__nolink">
              Click a column in each table to join them
            </span>
          )}
        </div>

        <TableBox table={fact} selected={factCol} onSelect={setFactCol} side="fact" />
      </div>

      {joined && card.kind === "many-to-many" && (
        <p className="ac-model__warn">
          <strong>Many-to-many.</strong> Neither key is unique, so this join cannot
          reliably decide which rows belong together. One side needs a column with
          no repeats.
        </p>
      )}

      {joined && orphans.rows.length > 0 && (
        <p className="ac-model__warn">
          <strong>{orphans.rows.length} orphan row(s).</strong> {fact.name} contains{" "}
          {orphans.values.join(", ")}, which {dim.name} has never heard of. These land
          in a <em>(Blank)</em> row in every visual.
        </p>
      )}

      {/* FILTER FLOW */}
      {joined && (
        <div className="ac-model__flow">
          <span className="ac-model__legend">Test a filter</span>
          <div className="ac-model__flow-controls">
            <select
              value={filterSide}
              onChange={(e) => { setFilterSide(e.target.value); setFilterValue(""); }}
              aria-label="Filter from which table"
            >
              <option value="dim">Filter {dim.name}</option>
              <option value="fact">Filter {fact.name}</option>
            </select>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              aria-label="Filter value"
            >
              <option value="">Choose a value…</option>
              {filterOptions.values.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {flow && (
            <div className={`ac-model__result ${flow.blocked ? "is-blocked" : "is-ok"}`}>
              <div>
                <strong>{dim.name}</strong>: {flow.dimRows.length} of {dim.rows.length} rows
                {" · "}
                <strong>{fact.name}</strong>: {flow.factRows.length} of {fact.rows.length} rows
                {" · "}
                total {fmt(sumOf(fact, flow.factRows, measureColumn))}
              </div>
              <p>
                {flow.blocked ? (
                  <>
                    The filter stopped. A filter travels from the <em>one</em> side to
                    the <em>many</em> side automatically, but not back — unless you
                    tick “Filter both ways”.
                  </>
                ) : filterSide === "dim" ? (
                  <>The filter travelled from {dim.name} down to {fact.name}, which is the default behaviour.</>
                ) : (
                  <>The filter travelled upward because this relationship filters both ways.</>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* BREAKDOWN */}
      {joined && card.kind !== "many-to-many" && (
        <div className="ac-model__breakdown">
          <span className="ac-model__legend">
            What a visual would show — {measureColumn} by {labelColumn}
          </span>
          <table>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className={r.isOrphan ? "is-orphan" : ""}>
                  <th scope="row">{r.label}</th>
                  <td>{fmt(r.value)}</td>
                  <td>{r.rows} rows</td>
                </tr>
              ))}
              <tr className="is-grand">
                <th scope="row">Grand Total</th>
                <td>{fmt(grand)}</td>
                <td>{fact.rows.length} rows</td>
              </tr>
            </tbody>
          </table>
          {orphans.rows.length > 0 && (
            <p className="ac-model__note">
              The named rows come to {fmt(named)}, but the Grand Total is {fmt(grand)}.
              The {fmt(grand - named)} difference is the orphan, sitting in (Blank).
            </p>
          )}
        </div>
      )}

      {exercise && (
        <div className="ac-model__check">
          <button className="ac-model__check-btn" onClick={check}>Check my model</button>
          {checked && (
            <p className={`ac-model__feedback ${checked.ok ? "is-ok" : "is-bad"}`} role="status">
              {checked.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
