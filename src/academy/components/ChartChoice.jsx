import { useState } from "react";
import AcademyChart from "./AcademyChart";

/**
 * CHOOSE THE RIGHT CHART — a graded practice.
 *
 * Chart selection is taught almost everywhere as a table of rules, and almost
 * nobody can apply it afterwards. The reason is that the rules are about how a
 * picture READS, and a table cannot show you that.
 *
 * So every option here is rendered as a real chart from the same real numbers.
 * The learner is asked a business question, sees three genuine answers to it,
 * and picks the one that answers it fastest. When they pick wrong they are told
 * what that specific picture makes hard — not that they broke a rule.
 *
 * The wrong options are deliberately not strawmen. They are the charts people
 * actually build: the pie with too many slices, the line chart over categories
 * that have no order, the stacked bar where the question was about one segment.
 */
export default function ChartChoice({
  question,
  options = [],
  correct,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(() =>
    alreadySolved
      ? { ok: true, message: "You already got this one. Compare the options again if you like." }
      : null
  );

  const submit = () => {
    if (!picked) {
      setResult({ ok: false, message: "Pick one of the charts first." });
      return;
    }
    if (picked === correct) {
      setResult({ ok: true, message: successMessage || "That is the right chart for this question." });
      onSolved?.();
      return;
    }
    const chosen = options.find((o) => o.id === picked);
    setResult({ ok: false, message: chosen?.whyWrong || "That chart makes this question harder to answer." });
  };

  return (
    <div className="ac-choice">
      <div className="ac-choice__task">
        <span className="ac-note__label">Choose the chart</span>
        <p>{question}</p>
      </div>

      <div className="ac-choice__grid">
        {options.map((o) => {
          const state =
            result?.ok && o.id === correct
              ? "is-correct"
              : result && !result.ok && o.id === picked
              ? "is-wrong"
              : picked === o.id
              ? "is-picked"
              : "";
          return (
            <button
              key={o.id}
              type="button"
              className={`ac-choice__option ${state}`}
              onClick={() => {
                setPicked(o.id);
                setResult(null);
              }}
              aria-pressed={picked === o.id}
            >
              <span className="ac-choice__label">{o.label}</span>
              <div className="ac-choice__preview">
                <AcademyChart {...o.chart} height={o.chart.height || 190} showTable={false} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="ac-choice__check">
        <button className="ac-choice__btn" onClick={submit}>
          Check my choice
        </button>
        {result && (
          <p className={`ac-choice__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
            {result.message}
          </p>
        )}
      </div>
    </div>
  );
}
