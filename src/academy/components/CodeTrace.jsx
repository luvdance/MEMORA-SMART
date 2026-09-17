import { useState } from "react";
import { isPythonReady, runPython } from "../pyodideRunner";

/**
 * PREDICT THE OUTPUT
 *
 * The skill a beginner lacks is not writing code, it is READING it. Someone
 * who can look at four lines and say what they print can then debug their own
 * work; someone who can only type from a tutorial cannot.
 *
 * So the graded practice here is prediction. The learner reads the code, types
 * what they think it prints, and is marked against the REAL output — captured
 * by actually running the snippet in CPython, not by an author's guess. The
 * content validator re-runs every snippet on each build where Python is
 * available, so a lesson can never drift from what the code really does.
 *
 * Deliberately NOT a code editor. Running Python in the browser means a
 * multi-megabyte WASM download, which is a real cost for a learner on metered
 * mobile data — and prediction tests comprehension better than autocomplete
 * does anyway.
 *
 * Three modes:
 *   codeDemo   read-only: the code and its output, side by side
 *   predict    graded: the learner types the expected output
 *   trace      read-only: a variable-state table, line by line
 */

/** Compare forgivingly on whitespace, exactly on content. */
function normalise(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n+$/, "")
    .trim();
}

function CodeBlock({ code, highlight = [] }) {
  const lines = String(code).replace(/\n$/, "").split("\n");
  return (
    <pre className="ac-code">
      <code>
        {lines.map((line, i) => (
          <span
            key={i}
            className={`ac-code__line ${highlight.includes(i + 1) ? "is-hl" : ""}`}
          >
            <span className="ac-code__num">{i + 1}</span>
            <span className="ac-code__text">{line || " "}</span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export default function CodeTrace({
  code,
  runnable = false,
  packages = [],
  highlight,
  question,
  expectedOutput,
  raises,
  trace,
  hint,
  successMessage,
  showOutput = false,
  onSolved,
  alreadySolved = false,
}) {
  const graded = Boolean(question);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(() =>
    alreadySolved && graded
      ? { ok: true, message: "You already got this one. The output is shown below." }
      : null
  );
  const [revealed, setRevealed] = useState(false);

  /* ── Live execution ──────────────────────────────────────────────────
   * Nothing is downloaded until the learner presses Run, and the size is
   * stated before they do. Once loaded it is reused for the session.
   */
  const [editable, setEditable] = useState(code);
  const [liveOpen, setLiveOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [live, setLive] = useState(null);

  const runIt = async () => {
    setBusy("Starting…");
    setLive(null);
    try {
      const out = await runPython(editable, { packages, onProgress: setBusy });
      setLive(out);
    } catch (err) {
      setLive({ stdout: "", error: err.message || String(err) });
    } finally {
      setBusy("");
    }
  };

  const target = raises || expectedOutput || "";

  const check = () => {
    if (!answer.trim()) {
      setResult({ ok: false, message: "Type what you think the code prints." });
      return;
    }
    if (normalise(answer) === normalise(target)) {
      setResult({ ok: true, message: successMessage || "Exactly right." });
      onSolved?.();
      return;
    }
    // Near-miss help: right values, wrong shape is worth saying out loud.
    const squash = (t) => normalise(t).replace(/\s+/g, "");
    const close = squash(answer) === squash(target);
    setResult({
      ok: false,
      message: close
        ? "The values are right but the layout is not — check how many lines the code prints, and in what order."
        : hint || "Not quite. Read the code one line at a time and write down what each print produces.",
    });
  };

  return (
    <div className="ac-trace">
      {graded && (
        <div className="ac-trace__task">
          <span className="ac-note__label">Predict the output</span>
          <p>{question}</p>
        </div>
      )}

      <CodeBlock code={code} highlight={highlight} />

      {/* Read-only teaching: show the output directly */}
      {!graded && showOutput && (
        <div className="ac-trace__out">
          <span className="ac-trace__out-label">Output</span>
          <pre className={raises ? "is-error" : undefined}>{target}</pre>
        </div>
      )}

      {/* A variable-state table — how you actually teach a loop */}
      {trace && (
        <div className="ac-trace__table-wrap">
          <span className="ac-trace__out-label">Line by line</span>
          <table className="ac-trace__table">
            <thead>
              <tr>
                {trace.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trace.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {trace.note && <p className="ac-trace__note">{trace.note}</p>}
        </div>
      )}

      {runnable && (
        <div className="ac-trace__live">
          {!liveOpen ? (
            <div className="ac-trace__live-intro">
              <button className="ac-trace__run-open" onClick={() => setLiveOpen(true)}>
                Run this for real
              </button>
              <p>
                {isPythonReady()
                  ? "Python is already loaded in this tab — running is instant."
                  : "This runs real Python in your browser. The first run downloads the runtime" +
                    (packages.length ? ` and ${packages.join(", ")}` : "") +
                    " — several megabytes, cached afterwards. On mobile data, use Colab instead."}
              </p>
              <a
                className="ac-trace__colab"
                href="https://colab.new"
                target="_blank"
                rel="noreferrer noopener"
              >
                Open a free Colab notebook and paste the code instead
              </a>
            </div>
          ) : (
            <>
              <span className="ac-trace__out-label">Edit and run</span>
              <textarea
                className="ac-trace__editor"
                value={editable}
                onChange={(e) => setEditable(e.target.value)}
                rows={Math.min(18, String(editable).split(/\n/).length + 1)}
                spellCheck={false}
                aria-label="Editable Python code"
              />
              <div className="ac-trace__actions">
                <button className="ac-trace__btn" onClick={runIt} disabled={Boolean(busy)}>
                  {busy ? "Working…" : "Run"}
                </button>
                <button
                  className="ac-trace__reveal"
                  onClick={() => {
                    setEditable(code);
                    setLive(null);
                  }}
                >
                  Reset the code
                </button>
              </div>
              {busy && <p className="ac-trace__busy">{busy}</p>}
              {live && (
                <div className="ac-trace__out">
                  <span className="ac-trace__out-label">
                    {live.error ? "Your code raised" : "Your output"}
                  </span>
                  {(live.error || live.stdout) && (
                    <pre className={live.error ? "is-error" : undefined}>
                      {live.error || live.stdout}
                    </pre>
                  )}
                  {live.images?.map((src, i) => (
                    <img
                      key={i}
                      className="ac-trace__figure"
                      src={src}
                      alt={`Figure ${i + 1} drawn by your code`}
                    />
                  ))}
                  {!live.error && !live.stdout && !live.images?.length && (
                    <pre>(it printed nothing and drew nothing)</pre>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {graded && (
        <div className="ac-trace__answer">
          <label htmlFor="ac-trace-input" className="ac-trace__out-label">
            What does it print?
          </label>
          <textarea
            id="ac-trace-input"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult(null);
            }}
            rows={Math.min(8, Math.max(2, String(target).split("\n").length + 1))}
            spellCheck={false}
            placeholder="One line per line of output…"
          />
          <div className="ac-trace__actions">
            <button className="ac-trace__btn" onClick={check}>
              Check my answer
            </button>
            <button
              className="ac-trace__reveal"
              onClick={() => setRevealed((v) => !v)}
            >
              {revealed ? "Hide the answer" : "I am stuck — show me"}
            </button>
          </div>
          {result && (
            <p className={`ac-trace__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
          {(revealed || result?.ok) && (
            <div className="ac-trace__out">
              <span className="ac-trace__out-label">
                {raises ? "Python raises" : "Actual output"}
              </span>
              <pre className={raises ? "is-error" : undefined}>{target}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
