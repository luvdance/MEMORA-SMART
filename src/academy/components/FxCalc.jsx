import { useState } from "react";

/**
 * WORK IT OUT — a graded trading calculation, inside the lesson.
 *
 * Almost every expensive mistake a new trader makes is arithmetic done
 * badly or not done at all: a lot size picked by feel, a stop-loss whose cost
 * was never worked out, leverage nobody converted into money. So the forex
 * course makes the learner DO the sum, with numbers, before the atom moves on.
 *
 * The answer the learner is graded against is not trusted to the author.
 * Each exercise names a function in lib/academy/forex/engine.js and its
 * inputs (`check`), and validateContent.mjs recomputes the answer from them
 * and fails the build if `answer` disagrees.
 *
 * A wrong answer is not a dead end and not a reveal: the first miss shows a
 * hint, the third shows the method. The learner still has to type the right
 * number themselves, because the point is that they can do it on Monday
 * morning with a real account open.
 *
 *   scenario   the situation, with every number the learner needs
 *   question   what to calculate
 *   unit       shown beside the input: "pips", "lots", "USD", "%"
 *   answer     the correct number
 *   tolerance  how close counts as right (default: 0.01)
 *   hint       one nudge, shown after the first miss
 *   working    the full method, shown after the third miss
 */
export default function FxCalc({
  scenario,
  question,
  unit,
  answer,
  tolerance = 0.01,
  hint,
  working,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const [value, setValue] = useState("");
  const [misses, setMisses] = useState(0);
  const [result, setResult] = useState(() =>
    alreadySolved ? { ok: true, message: "You already worked this one out correctly." } : null
  );

  const submit = (e) => {
    e?.preventDefault();
    if (result?.ok) return;
    // Accept what people actually type: "$1,250", "0.04 lots", "2.5%".
    const cleaned = String(value).replace(/[,$\s%]|lots?|pips?|usd/gi, "");
    const n = Number(cleaned);
    if (cleaned === "" || !Number.isFinite(n)) {
      setResult({ ok: false, message: "Type a number. Commas and units are fine; words are not." });
      return;
    }
    if (Math.abs(n - answer) <= tolerance + 1e-9) {
      setResult({ ok: true, message: successMessage || "Correct. That is the number to know before you click buy or sell." });
      onSolved?.();
      return;
    }
    const next = misses + 1;
    setMisses(next);
    setResult({
      ok: false,
      message:
        Math.abs(n - answer) <= Math.abs(answer) * 0.02
          ? "Very close — check your rounding."
          : Math.abs(Math.abs(n) - Math.abs(answer)) <= tolerance && Math.sign(n) !== Math.sign(answer)
          ? "Right size, wrong sign. Is this a gain or a loss?"
          : "Not yet. Rework it one step at a time.",
    });
  };

  return (
    <div className="ac-fxcalc">
      <div className="ac-fxcalc__task">
        <span className="ac-note__label">Work it out</span>
        {scenario && <p className="ac-fxcalc__scenario">{scenario}</p>}
        <p className="ac-fxcalc__question">{question}</p>
      </div>

      <form className="ac-fxcalc__check" onSubmit={submit}>
        <label className="ac-fxcalc__field">
          <span className="ac-visually-hidden">Your answer</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (!result?.ok) setResult(null);
            }}
            disabled={result?.ok}
            placeholder="Your answer"
            aria-label="Your answer"
          />
          {unit && <span className="ac-fxcalc__unit">{unit}</span>}
        </label>
        <button className="ac-fxcalc__btn" type="submit" disabled={result?.ok}>
          {result?.ok ? "Correct" : "Check my answer"}
        </button>
      </form>

      {result && (
        <p className={`ac-fxcalc__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
          {result.message}
        </p>
      )}

      {!result?.ok && misses >= 1 && hint && (
        <p className="ac-fxcalc__hint">
          <i className="fas fa-lightbulb" aria-hidden="true" /> {hint}
        </p>
      )}

      {(result?.ok || misses >= 3) && working && (
        <div className="ac-fxcalc__working">
          <span className="ac-note__label">{result?.ok ? "The method" : "Here is the method — now type the answer yourself"}</span>
          <pre>{working}</pre>
        </div>
      )}
    </div>
  );
}
