import { useMemo, useState } from "react";
import {
  OPERATORS,
  runDetection,
  ruleText,
  scoreDetection,
} from "../../../lib/academy/cyber/detect";

/**
 * WRITE THE DETECTION — the SOC skill, practised on a real log.
 *
 * A SOC analyst's job is not "watching alerts". It is the trade-off inside
 * every detection rule: loosen it and you drown in false positives, tighten it
 * and the attack walks past. Nobody learns that trade-off from a slide. You
 * learn it by writing a rule, running it against a log that contains both an
 * intrusion and a great deal of ordinary Monday morning, and seeing what your
 * rule did to both at once.
 *
 * So the learner builds a rule from real parts — field, operator, value, then
 * optionally "count by X, alert at N" — and the log below marks every row it
 * would fire on. Grading is by detection quality, not by matching an author's
 * string: catch every attack event, with no more false positives than the
 * brief allows. Several different correct rules pass, which is also true in a
 * real SOC.
 */
export default function LogHunt({
  task,
  fields = [],
  events = [],
  expect,
  showAttackColumn = false,
  hint,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const graded = Boolean(expect);
  const [conditions, setConditions] = useState([
    { field: fields[0]?.id || "", op: "equals", value: "" },
  ]);
  const [groupBy, setGroupBy] = useState("");
  const [threshold, setThreshold] = useState("");
  const [result, setResult] = useState(() =>
    alreadySolved && graded
      ? { ok: true, message: "You already wrote a rule that works. Change it and watch what breaks." }
      : null
  );

  const rule = useMemo(
    () => ({
      conditions: conditions.filter((c) => c.field && String(c.value).trim() !== ""),
      groupBy: groupBy || undefined,
      threshold: threshold ? Number(threshold) : undefined,
    }),
    [conditions, groupBy, threshold]
  );

  const run = useMemo(() => runDetection(events, rule), [events, rule]);
  const alertingIds = useMemo(() => new Set(run.alerting.map((e) => e.id)), [run]);

  const setCondition = (index, patch) => {
    setConditions((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
    setResult(null);
  };

  const check = () => {
    const scored = scoreDetection(events, rule, expect);
    setResult({
      ok: scored.ok,
      message: scored.ok ? successMessage || scored.message : scored.message,
    });
    if (scored.ok) onSolved?.();
  };

  const valuesFor = (fieldId) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field?.values) return field.values;
    return [...new Set(events.map((e) => e[fieldId]).filter((v) => v !== undefined))].map(String);
  };

  return (
    <div className="ac-hunt">
      <div className="ac-hunt__task">
        <span className="ac-note__label">{graded ? "Write the detection" : "Detection rule"}</span>
        <p>{task}</p>
      </div>

      <div className="ac-hunt__builder">
        {conditions.map((condition, i) => (
          <div className="ac-hunt__row" key={i}>
            <span className="ac-hunt__join">{i === 0 ? "WHERE" : "AND"}</span>

            <select
              value={condition.field}
              onChange={(e) => setCondition(i, { field: e.target.value, value: "" })}
              aria-label="Field"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label || f.id}
                </option>
              ))}
            </select>

            <select
              value={condition.op}
              onChange={(e) => setCondition(i, { op: e.target.value })}
              aria-label="Operator"
            >
              {OPERATORS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>

            <input
              list={`ac-hunt-values-${i}`}
              value={condition.value}
              onChange={(e) => setCondition(i, { value: e.target.value })}
              placeholder="value"
              spellCheck={false}
              aria-label="Value"
            />
            <datalist id={`ac-hunt-values-${i}`}>
              {valuesFor(condition.field).map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>

            {conditions.length > 1 && (
              <button
                className="ac-hunt__drop"
                onClick={() => {
                  setConditions((prev) => prev.filter((_, n) => n !== i));
                  setResult(null);
                }}
                aria-label="Remove this condition"
              >
                <i className="fas fa-xmark" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}

        <button
          className="ac-hunt__add"
          onClick={() => {
            setConditions((prev) => [...prev, { field: fields[0]?.id || "", op: "equals", value: "" }]);
            setResult(null);
          }}
        >
          <i className="fas fa-plus" aria-hidden="true" /> Add a condition
        </button>

        <div className="ac-hunt__row ac-hunt__row--threshold">
          <span className="ac-hunt__join">COUNT BY</span>
          <select
            value={groupBy}
            onChange={(e) => {
              setGroupBy(e.target.value);
              setResult(null);
            }}
            aria-label="Group by"
          >
            <option value="">(no grouping, alert on every match)</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label || f.id}
              </option>
            ))}
          </select>
          <span className="ac-hunt__join">ALERT AT</span>
          <input
            type="number"
            min="1"
            className="ac-hunt__threshold"
            value={threshold}
            onChange={(e) => {
              setThreshold(e.target.value);
              setResult(null);
            }}
            placeholder="—"
            aria-label="Threshold"
            disabled={!groupBy}
          />
        </div>
      </div>

      <pre className="ac-hunt__query">{ruleText(rule)}</pre>

      <div className="ac-hunt__logwrap">
        <span className="ac-hunt__loglabel">
          The log · {run.alerting.length} of {events.length} events would alert
          {run.grouped ? ` across ${run.alerts.length} grouped alert${run.alerts.length === 1 ? "" : "s"}` : ""}
        </span>
        <table className="ac-hunt__log">
          <thead>
            <tr>
              <th>Time</th>
              {fields.map((f) => (
                <th key={f.id}>{f.label || f.id}</th>
              ))}
              {showAttackColumn && <th>Truth</th>}
              <th>Alert?</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const fires = alertingIds.has(event.id);
              return (
                <tr
                  key={event.id}
                  className={`${fires ? "is-alerting" : ""} ${event.attack ? "is-attack" : ""}`}
                >
                  <td>{event.time}</td>
                  {fields.map((f) => (
                    <td key={f.id}>{String(event[f.id] ?? "")}</td>
                  ))}
                  {showAttackColumn && (
                    <td className="ac-hunt__truth">{event.attack ? "attack" : "normal"}</td>
                  )}
                  <td>
                    {fires ? (
                      <span className="ac-hunt__fire">
                        <i className="fas fa-bell" aria-hidden="true" /> fires
                      </span>
                    ) : (
                      <span className="ac-hunt__quiet">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {graded && (
        <div className="ac-hunt__check">
          <button className="ac-hunt__btn" onClick={check}>
            Check my detection
          </button>
          {result && (
            <p className={`ac-hunt__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
          {result && !result.ok && hint && <p className="ac-hunt__hint">{hint}</p>}
        </div>
      )}
    </div>
  );
}
