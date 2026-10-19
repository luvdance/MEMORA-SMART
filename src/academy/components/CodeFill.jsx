import { useState } from "react";
import { fillIsCorrect } from "../cppFill";

/**
 * WRITE THE MISSING CODE
 *
 * The C++ course's write-the-code practice. C++ cannot be compiled inside the
 * learner's browser here (a compiler is tens of megabytes), so instead of a
 * blank editor the learner is given a complete, real program with one or more
 * gaps, and types the C++ that belongs in each gap. That is still writing C++:
 * the gap is a declaration, a condition, a loop header, a function call, and
 * the learner has to produce it, not recognise it among options.
 *
 * Every gap carries a list of accepted answers. They are not trusted: at
 * build time `npm run validate:content` substitutes EVERY accepted answer into
 * the program, compiles it with g++ and runs it, and fails the build unless it
 * prints exactly `expectedOutput`. So the practice can never accept code that
 * does not work. See lib/academy/cpp/run.mjs.
 *
 * Marking (src/academy/cppFill.js) is forgiving on spacing between tokens
 * and exact on everything else, including text inside quotes.
 *
 *   code            the program, gaps written as {{1}}, {{2}}, …
 *   blanks          [{ answers: ["…", …], width? }]  one per gap, in order
 *   task            what the learner must make the program do
 *   expectedOutput  what the finished program prints, shown once solved
 *   inputs          keyboard lines the program reads, shown beside it
 *   hint, successMessage
 */

const GAP = /\{\{(\d+)\}\}/g;

function Line({ text, lineNo, values, onChange, blanks, results, disabled }) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(GAP)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const n = Number(match[1]) - 1;
    const blank = blanks[n] || { answers: [""] };
    const size = Math.max(6, blank.width || Math.max(...blank.answers.map((a) => a.length)) + 2);
    parts.push(
      <input
        key={`gap-${n}`}
        className={`ac-fill__gap ${results?.[n] === true ? "is-ok" : results?.[n] === false ? "is-bad" : ""}`}
        value={values[n] || ""}
        onChange={(e) => onChange(n, e.target.value)}
        size={size}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        disabled={disabled}
        aria-label={`Gap ${n + 1}`}
      />
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <span className="ac-code__line">
      <span className="ac-code__num">{lineNo}</span>
      <span className="ac-code__text">{parts.length ? parts : " "}</span>
    </span>
  );
}

export default function CodeFill({
  code,
  blanks = [],
  task,
  expectedOutput,
  inputs,
  hint,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const [values, setValues] = useState(() =>
    alreadySolved ? blanks.map((b) => b.answers[0]) : blanks.map(() => "")
  );
  const [results, setResults] = useState(null);
  const [verdict, setVerdict] = useState(() =>
    alreadySolved ? { ok: true, message: "You already solved this one. The finished program is shown." } : null
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const solved = verdict?.ok === true;

  const lines = String(code).replace(/\n$/, "").split("\n");

  const change = (n, v) => {
    setValues((prev) => {
      const next = [...prev];
      next[n] = v;
      return next;
    });
    setResults(null);
    if (!solved) setVerdict(null);
  };

  const check = () => {
    if (values.some((v) => !String(v || "").trim())) {
      setVerdict({
        ok: false,
        message: blanks.length > 1 ? "Fill in every gap first." : "Type the missing code in the gap first.",
      });
      return;
    }
    const marks = blanks.map((b, i) => fillIsCorrect(values[i], b));
    setResults(marks);
    if (marks.every(Boolean)) {
      setVerdict({ ok: true, message: successMessage || "Correct. That program compiles and runs." });
      onSolved?.();
      return;
    }
    const wrong = marks.map((m, i) => (m ? null : i + 1)).filter(Boolean);
    setVerdict({
      ok: false,
      message:
        (blanks.length > 1 ? `Gap ${wrong.join(" and ")} ${wrong.length > 1 ? "are" : "is"} not right yet. ` : "Not quite. ") +
        (hint || "Read the lines around the gap: what does the program need at that exact point?"),
    });
  };

  return (
    <div className="ac-trace ac-challenge ac-fill">
      <div className="ac-trace__task ac-challenge__task">
        <span className="ac-note__label">
          <i className="fas fa-keyboard" aria-hidden="true" /> Your turn: write the missing C++
        </span>
        <p>{task}</p>
      </div>

      <pre className="ac-code">
        <code>
          {lines.map((text, i) => (
            <Line
              key={i}
              text={text}
              lineNo={i + 1}
              values={values}
              onChange={change}
              blanks={blanks}
              results={results}
              disabled={solved}
            />
          ))}
        </code>
      </pre>

      {inputs?.length > 0 && (
        <p className="ac-trace__inputs">
          <span className="ac-trace__out-label">Typed at the keyboard</span>{" "}
          {inputs.map((v, i) => (
            <kbd key={i}>{v === "" ? "(Enter)" : v}</kbd>
          ))}
        </p>
      )}

      <div className="ac-trace__answer">
        {!solved && (
          <div className="ac-trace__actions">
            <button className="ac-trace__btn" onClick={check}>
              Check my code
            </button>
            <button className="ac-trace__reveal" onClick={() => setShowAnswer((v) => !v)}>
              {showAnswer ? "Hide the answer" : "I am stuck — show me"}
            </button>
          </div>
        )}
        {verdict && (
          <p className={`ac-trace__feedback ${verdict.ok ? "is-ok" : "is-bad"}`} role="status">
            {verdict.ok && <i className="fas fa-circle-check" aria-hidden="true" />} {verdict.message}
          </p>
        )}
        {showAnswer && !solved && (
          <div className="ac-fill__answers">
            {blanks.map((b, i) => (
              <p key={i} className="ac-challenge__hint">
                {blanks.length > 1 ? `Gap ${i + 1}: ` : "The missing code: "}
                <code>{b.answers[0]}</code>
              </p>
            ))}
            <p className="ac-challenge__hint">
              Type it in yourself and press Check: copying it by hand is part of learning it.
            </p>
          </div>
        )}
      </div>

      {solved && expectedOutput !== undefined && (
        <div className="ac-trace__out">
          <span className="ac-trace__out-label">The finished program prints</span>
          <pre>{expectedOutput}</pre>
        </div>
      )}
    </div>
  );
}
