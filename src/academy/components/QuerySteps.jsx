import { useMemo, useState } from "react";
import { applySteps, STEP_LIBRARY, textNumberCount } from "../../../lib/academy/powerquery";

/**
 * THE POWER QUERY EDITOR, IN MINIATURE
 *
 * Power Query's one big idea is that cleaning is a RECIPE rather than an edit.
 * You cannot teach that with a before-and-after table, because the whole point
 * is the list of steps in between — that it is ordered, that it replays on
 * refresh, and that any step can be pulled out afterwards.
 *
 * So this shows all three at once: a palette to add a step, the Applied Steps
 * list building up beside it with each step's effect on the row count, and the
 * table transforming underneath. Deleting a step from the middle re-runs
 * everything after it, which is the behaviour that makes Power Query worth
 * learning and the one learners find most surprising.
 *
 * Each step also shows the M it generates, so the Advanced Editor is not a
 * cliff later on.
 *
 * The exercise checks the RESULTING TABLE, not the recipe. Two learners who
 * reach a clean table by different routes have both understood it, and
 * grading the sequence would be marking memorisation instead.
 */
export default function QuerySteps({
  source,
  exercise = null,
  initialSteps = [],
  onSolved,
  alreadySolved = false,
  showM = true,
}) {
  const [steps, setSteps] = useState(initialSteps);
  const [type, setType] = useState("removeColumn");
  const [column, setColumn] = useState(source?.headers?.[0] || "");
  const [checked, setChecked] = useState(() =>
    alreadySolved && exercise
      ? { ok: true, message: "You already cleaned this one. Add and remove steps freely to experiment." }
      : null
  );

  const result = useMemo(() => applySteps(source, steps), [source, steps]);

  const addStep = () => {
    if (!column) return;
    setSteps((s) => [...s, { type, column }]);
    setChecked(null);
  };

  const removeStep = (i) => {
    setSteps((s) => s.filter((_, n) => n !== i));
    setChecked(null);
  };

  const reset = () => {
    setSteps(initialSteps);
    setChecked(null);
  };

  function check() {
    const want = exercise.expect || {};
    const problems = [];

    if (want.headers) {
      const got = result.headers.join(",");
      if (got !== want.headers.join(",")) {
        problems.push(`The columns are ${got || "(none)"}, not ${want.headers.join(", ")}.`);
      }
    }
    if (want.rows !== undefined && result.rows.length !== want.rows) {
      problems.push(
        `The table has ${result.rows.length} rows, not ${want.rows}. ` +
          (result.rows.length > want.rows
            ? "Something that should have been removed is still there."
            : "You have removed more than the task asked for.")
      );
    }
    if (want.numericColumn && textNumberCount(result, want.numericColumn) > 0) {
      problems.push(
        `${textNumberCount(result, want.numericColumn)} value(s) in "${want.numericColumn}" are still text rather than numbers.`
      );
    }
    if (want.trimmedColumn) {
      const idx = result.headers.indexOf(want.trimmedColumn);
      const untrimmed =
        idx >= 0 &&
        result.rows.some((r) => typeof r[idx] === "string" && r[idx] !== r[idx].trim());
      if (untrimmed) problems.push(`"${want.trimmedColumn}" still has values with stray spaces.`);
    }

    if (problems.length) {
      setChecked({ ok: false, message: problems[0] });
      return;
    }
    setChecked({ ok: true, message: exercise.successMessage || "That is a clean table." });
    onSolved?.();
  }

  const startRows = source?.rows?.length ?? 0;

  return (
    <div className="ac-pq">
      {exercise && (
        <div className="ac-pq__task">
          <span className="ac-note__label">Clean it</span>
          <p>{exercise.task}</p>
        </div>
      )}

      <div className="ac-pq__body">
        {/* ── ADD A STEP ── */}
        <div className="ac-pq__builder">
          <span className="ac-pq__legend">Transform</span>
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Step type">
            {Object.entries(STEP_LIBRARY).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            aria-label="Column to transform"
          >
            {result.headers.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <button className="ac-pq__add" onClick={addStep}>Add step</button>
          {steps.length > 0 && (
            <button className="ac-pq__reset" onClick={reset}>Reset</button>
          )}
        </div>

        {/* ── APPLIED STEPS ── */}
        <div className="ac-pq__steps">
          <span className="ac-pq__legend">Applied Steps</span>
          <ol>
            <li className="ac-pq__step ac-pq__step--source">
              <span className="ac-pq__step-label">Source</span>
              <span className="ac-pq__step-rows">{startRows} rows</span>
            </li>
            {result.log.map((l, i) => (
              <li className="ac-pq__step" key={i}>
                <span className="ac-pq__step-label">
                  {l.label}
                  {showM && l.m && <code>{l.m}</code>}
                </span>
                <span className="ac-pq__step-rows">
                  {l.rowsBefore === l.rowsAfter
                    ? `${l.rowsAfter} rows`
                    : `${l.rowsBefore} → ${l.rowsAfter} rows`}
                </span>
                <button
                  className="ac-pq__step-remove"
                  onClick={() => removeStep(i)}
                  aria-label={`Delete step ${i + 1}: ${l.label}`}
                  title="Delete this step — everything after it re-runs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
          {steps.length === 0 && (
            <p className="ac-pq__empty">
              No steps yet. The table below is the raw source, exactly as it loaded.
            </p>
          )}
        </div>
      </div>

      {/* ── RESULT ── */}
      <div className="ac-pq__result">
        <div className="ac-pq__result-head">
          Preview — {result.rows.length} rows × {result.headers.length} columns
          {result.rows.length !== startRows && (
            <span className="ac-pq__delta"> ({startRows - result.rows.length} removed)</span>
          )}
        </div>
        <div className="ac-pq__scroll">
          <table className="ac-pq__table">
            <thead>
              <tr>{result.headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => {
                    const blank = c === "" || c === null || c === undefined;
                    return (
                      <td
                        key={j}
                        className={[
                          typeof c === "number" ? "is-number" : "",
                          blank ? "is-blank" : "",
                          typeof c === "string" && c !== c.trim() ? "is-untrimmed" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        {blank ? "null" : String(c)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ac-pq__hint">
          Numbers sit right, text sits left — the same tell as in Excel. Stray
          spaces are highlighted, and empty cells read <code>null</code>.
        </p>
      </div>

      {exercise && (
        <div className="ac-pq__check">
          <button className="ac-pq__check-btn" onClick={check}>Check my table</button>
          {checked && (
            <p className={`ac-pq__feedback ${checked.ok ? "is-ok" : "is-bad"}`} role="status">
              {checked.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
