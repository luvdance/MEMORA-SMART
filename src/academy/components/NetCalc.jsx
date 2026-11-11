import { useState } from "react";
import { answerMatches } from "../../../lib/academy/network/calc.js";

/**
 * WORK IT OUT BY HAND — the networking course's calculation practice.
 *
 * Subnetting is a pen-and-paper skill before it is anything else, so these
 * exercises ask for the answer a learner would write on paper: a binary
 * octet, a mask, a network address. Each answer was recomputed by the content
 * check from the calculator named in `check`, so the key cannot be wrong.
 *
 * A miss is not a dead end: the first shows the question's hint, the third
 * shows its full working, and the learner still types the answer themselves.
 *
 *   task        what the set of questions is about
 *   questions   [{ q, answer, accept?, hint, working, placeholder? }]
 */
export default function NetCalc({ task, questions = [], successMessage, onSolved, alreadySolved = false }) {
  const [values, setValues] = useState(() => questions.map(() => ""));
  const [misses, setMisses] = useState(() => questions.map(() => 0));
  const [marks, setMarks] = useState(() => questions.map(() => (alreadySolved ? true : null)));
  const [done, setDone] = useState(Boolean(alreadySolved));

  const check = (e) => {
    e?.preventDefault();
    if (done) return;
    const next = questions.map((q, i) => answerMatches(q, values[i]));
    setMarks(next);
    setMisses((m) => m.map((n, i) => (next[i] ? n : n + 1)));
    if (next.every(Boolean)) {
      setDone(true);
      onSolved?.();
    }
  };

  return (
    <form className="ac-ncalc" onSubmit={check}>
      <div className="ac-ncalc__task">
        <span className="ac-note__label">
          <i className="fas fa-calculator" aria-hidden="true" /> Work it out by hand
        </span>
        {task && <p>{task}</p>}
      </div>
      <ol className="ac-ncalc__list">
        {questions.map((q, i) => (
          <li key={i} className={`ac-ncalc__item ${marks[i] === true ? "is-ok" : marks[i] === false ? "is-bad" : ""}`}>
            <label className="ac-ncalc__q" htmlFor={`ncalc-${i}-${q.q.length}`}>{q.q}</label>
            <div className="ac-ncalc__row">
              <input
                id={`ncalc-${i}-${q.q.length}`}
                className="ac-ncalc__input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={done ? values[i] || q.answer : values[i]}
                placeholder={q.placeholder || "Your answer"}
                disabled={done}
                onChange={(e) => {
                  const v = e.target.value;
                  setValues((prev) => prev.map((x, j) => (j === i ? v : x)));
                  setMarks((prev) => prev.map((x, j) => (j === i ? null : x)));
                }}
              />
              {marks[i] === true && <i className="fas fa-circle-check ac-ncalc__ok" aria-label="Correct" />}
              {marks[i] === false && <i className="fas fa-circle-xmark ac-ncalc__bad" aria-label="Not yet" />}
            </div>
            {marks[i] !== true && misses[i] >= 1 && q.hint && (
              <p className="ac-ncalc__hint">
                <i className="fas fa-lightbulb" aria-hidden="true" /> {q.hint}
              </p>
            )}
            {(marks[i] === true || misses[i] >= 3) && q.working && (
              <pre className="ac-ncalc__working">{q.working}</pre>
            )}
          </li>
        ))}
      </ol>
      <div className="ac-ncalc__check">
        <button className="ac-ncalc__btn" type="submit" disabled={done}>
          {done ? "All correct" : "Check my answers"}
        </button>
        {done && <p className="ac-ncalc__feedback is-ok" role="status">{successMessage || "All correct."}</p>}
        {!done && marks.some((m) => m === false) && (
          <p className="ac-ncalc__feedback is-bad" role="status">
            {marks.filter((m) => m === true).length} of {questions.length} right. Fix the ones marked with a cross; a hint appears under each.
          </p>
        )}
      </div>
    </form>
  );
}
