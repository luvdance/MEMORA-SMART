import { useState } from "react";

/**
 * MAKE THE CALL — a graded judgement, inside the lesson.
 *
 * Most of security is decisions rather than commands. Which of these three
 * things do you do first at 2am. Is this within scope. Do you pull the network
 * cable or leave the machine running. Those cannot be practised in a terminal,
 * and a multiple-choice question at the end of a lesson tests whether someone
 * remembers the paragraph, not whether they can make the call.
 *
 * So this sits in the flow of the lesson, attached to the atom that taught the
 * idea, and it GATES the atom: the learner cannot move on until they get it
 * right. What makes it teaching rather than testing is `whyWrong` — every
 * option carries the reasoning that makes it attractive and the consequence
 * that makes it wrong, so a mistake here costs one click and teaches the thing
 * the lesson was actually about.
 *
 * The options are never strawmen. Each wrong answer is one that a real person
 * on a real team has argued for.
 */
export default function DecisionCheck({
  scenario,
  question,
  options = [],
  correct,
  successMessage,
  aftermath,
  onSolved,
  alreadySolved = false,
}) {
  const [picked, setPicked] = useState(null);
  const [tried, setTried] = useState(() => new Set());
  const [result, setResult] = useState(() =>
    alreadySolved
      ? { ok: true, message: "You already made this call correctly." }
      : null
  );

  const submit = () => {
    if (!picked) {
      setResult({ ok: false, message: "Pick the option you would actually go with." });
      return;
    }

    if (picked === correct) {
      setResult({
        ok: true,
        message:
          successMessage ||
          options.find((o) => o.id === correct)?.why ||
          "That is the call.",
      });
      onSolved?.();
      return;
    }

    setTried((prev) => new Set(prev).add(picked));
    const chosen = options.find((o) => o.id === picked);
    setResult({
      ok: false,
      message: chosen?.whyWrong || "That is not the call here. Read the scenario again.",
    });
  };

  return (
    <div className="ac-decide">
      <div className="ac-decide__task">
        <span className="ac-note__label">Make the call</span>
        {scenario && <p className="ac-decide__scenario">{scenario}</p>}
        <p className="ac-decide__question">{question}</p>
      </div>

      <div className="ac-decide__options">
        {options.map((option) => {
          const state = result?.ok && option.id === correct
            ? "is-correct"
            : tried.has(option.id)
            ? "is-ruled-out"
            : picked === option.id
            ? "is-picked"
            : "";
          return (
            <button
              key={option.id}
              type="button"
              className={`ac-decide__option ${state}`}
              onClick={() => {
                if (result?.ok) return;
                setPicked(option.id);
                setResult(null);
              }}
              aria-pressed={picked === option.id}
            >
              <span className="ac-decide__marker" aria-hidden="true">
                {result?.ok && option.id === correct ? (
                  <i className="fas fa-check" />
                ) : tried.has(option.id) ? (
                  <i className="fas fa-xmark" />
                ) : (
                  option.id.toUpperCase()
                )}
              </span>
              <span className="ac-decide__text">{option.text}</span>
            </button>
          );
        })}
      </div>

      <div className="ac-decide__check">
        <button className="ac-decide__btn" onClick={submit} disabled={result?.ok}>
          {result?.ok ? "Settled" : "Check my call"}
        </button>
        {result && (
          <p className={`ac-decide__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
            {result.message}
          </p>
        )}
      </div>

      {result?.ok && aftermath && (
        <p className="ac-decide__aftermath">
          <i className="fas fa-arrow-turn-down" aria-hidden="true" />
          {aftermath}
        </p>
      )}
    </div>
  );
}
