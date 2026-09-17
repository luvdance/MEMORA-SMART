import { useMemo, useState } from "react";
import { evaluateMeasures, withoutAll } from "../../../lib/academy/dax";

/**
 * A MEASURE, EVALUATED ONCE PER ROW
 *
 * The idea that defeats people in DAX is that a measure has no single value.
 * It is re-evaluated in every cell, under whatever filter that cell sits in.
 * Told that, a learner nods. Shown the same measure returning 186,000 on one
 * row and 495,000 on the next, they understand it.
 *
 * So this puts the DAX text and the per-row result in one table, and lets the
 * learner toggle ALL() off. With ALL() the denominator stays at the grand
 * total and the percentages behave; without it the denominator shrinks to
 * match its own row and every percentage reads 100% — the single most common
 * beginner bug in DAX, reproduced on demand rather than described.
 *
 * The maths lives in lib/academy/dax.js so the content validator can check
 * that the figures a lesson quotes are the figures this component shows.
 */

const pct = (n) => `${(Math.round(n * 10000) / 100).toFixed(2)}%`;
const num = (n) =>
  Number.isInteger(n)
    ? n.toLocaleString()
    : (Math.round(n * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function DaxSim({ model, measures = [], allowToggle = true, caption }) {
  const [breakIt, setBreakIt] = useState(false);

  const result = useMemo(
    () => (breakIt ? withoutAll(model, measures) : evaluateMeasures(model, measures)),
    [model, measures, breakIt]
  );

  const hasAll = measures.some((m) => m.kind === "sumAll");

  const cell = (measure, value) => {
    if (value === null || value === undefined) return <span className="ac-dax__blank">(blank)</span>;
    return measure.format === "percent" ? pct(value) : num(value);
  };

  return (
    <div className="ac-dax">
      {/* The measures being evaluated, as real DAX */}
      <div className="ac-dax__defs">
        <span className="ac-dax__legend">Measures</span>
        {measures.map((m) => (
          <div className="ac-dax__def" key={m.name}>
            <strong>{m.name}</strong>
            <code>
              {breakIt && m.kind === "sumAll" && m.daxBroken ? m.daxBroken : m.dax}
            </code>
          </div>
        ))}
      </div>

      {allowToggle && hasAll && (
        <label className="ac-dax__toggle">
          <input
            type="checkbox"
            checked={breakIt}
            onChange={(e) => setBreakIt(e.target.checked)}
          />
          Remove <code>ALL()</code> from the denominator — reproduce the classic bug
        </label>
      )}

      <div className="ac-dax__scroll">
        <table className="ac-dax__table">
          <thead>
            <tr>
              <th>Row in the visual</th>
              {measures.map((m) => (
                <th key={m.name}>{m.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">
                  {r.label}
                  <em>{r.rowCount} fact rows in context</em>
                </th>
                {measures.map((m) => (
                  <td
                    key={m.name}
                    className={
                      breakIt && m.format === "percent" ? "is-suspect" : undefined
                    }
                  >
                    {cell(m, r.values[m.name])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="is-total">
              <th scope="row">
                Total
                <em>{result.total.rowCount} fact rows — no row filter</em>
              </th>
              {measures.map((m) => (
                <td key={m.name}>{cell(m, result.total.values[m.name])}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {breakIt ? (
        <p className="ac-dax__warn">
          Every percentage now reads 100%. Without <code>ALL()</code> the
          denominator is filtered by the same row as the numerator, so each row
          is divided by itself. Nothing errors — which is why this bug reaches
          production.
        </p>
      ) : (
        caption && <p className="ac-dax__caption">{caption}</p>
      )}
    </div>
  );
}
