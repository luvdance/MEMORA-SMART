import { useEffect, useRef, useState } from "react";
import { isPythonReady, runChallenge } from "../pyodideRunner";

/**
 * WRITE THE CODE — the practice half of a programming lesson.
 *
 * CodeTrace teaches reading: predict what a snippet prints. This teaches
 * writing. Every time a lesson shows a new idea working, the learner is then
 * asked to use it themselves on something slightly different: the lesson
 * prints "Hello, World!", the challenge asks them to print their own name.
 * Typing it, getting it wrong, reading the error and fixing it is where the
 * idea is actually learned.
 *
 * HOW IT IS GRADED
 * The learner's code is RUN, in real Python (Pyodide), against the atom's
 * `tests`. Each test may script the answers typed into input(), and carries a
 * `check`: Python asserts whose messages are the feedback the learner reads.
 * See pyHarness.js for the helpers a check can use. `npm run validate:content`
 * runs every challenge's model `solution` (it must pass) and its `starter`
 * (it must fail) in CPython with the same harness, so a challenge can never
 * ship unsolvable or already solved.
 *
 * THE DOWNLOAD
 * Python in the browser is a multi-megabyte download. Nothing is fetched
 * until the learner presses a button that says so, and the cost is stated
 * first. Once loaded it is reused for the whole session.
 *
 * The draft is kept in this browser (localStorage) per atom, so leaving the
 * lesson does not throw away someone's work. That is a convenience only;
 * nothing depends on it.
 */

const draftKey = (id) => `academy:py-draft:${id}`;

function readDraft(id) {
  try {
    return id ? window.localStorage.getItem(draftKey(id)) : null;
  } catch {
    return null;
  }
}

function writeDraft(id, code) {
  try {
    if (id) window.localStorage.setItem(draftKey(id), code);
  } catch {
    /* private mode or storage blocked: the draft simply is not kept */
  }
}

/**
 * Tab inserts four spaces, Enter keeps the current indentation and adds a
 * level after a line ending in a colon. Python's blocks are its indentation,
 * so a plain textarea that inserts nothing on Tab fights the learner on the
 * one thing the language cares most about.
 */
function handleEditorKeys(e, value, setValue) {
  const el = e.target;
  const { selectionStart: start, selectionEnd: end } = el;
  const place = (text, caret) => {
    setValue(text);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = caret;
    });
  };

  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    place(value.slice(0, start) + "    " + value.slice(end), start + 4);
    return;
  }
  if (e.key === "Tab" && e.shiftKey) {
    e.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lead = value.slice(lineStart).match(/^ {1,4}/)?.[0].length || 0;
    if (lead) place(value.slice(0, lineStart) + value.slice(lineStart + lead), Math.max(lineStart, start - lead));
    return;
  }
  if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const line = value.slice(lineStart, start);
    let indent = line.match(/^\s*/)[0];
    if (/:\s*(#.*)?$/.test(line)) indent += "    ";
    const insert = "\n" + indent;
    place(value.slice(0, start) + insert + value.slice(end), start + insert.length);
  }
}

export default function CodeChallenge({
  id,
  task,
  sample,
  starter = "",
  tests = [],
  solution,
  // false on assessment projects, which must be written without a model to copy.
  revealSolution = true,
  hint,
  successMessage,
  onSolved,
  alreadySolved = false,
}) {
  const [code, setCode] = useState(() => readDraft(id) ?? starter);
  const [open, setOpen] = useState(() => isPythonReady());
  const [busy, setBusy] = useState("");
  const [run, setRun] = useState(null); // last plain Run
  const [verdict, setVerdict] = useState(() =>
    alreadySolved
      ? { passed: true, message: "You already solved this one. Change it and run it again whenever you like." }
      : null
  );
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const firstInputs = tests.find((t) => t.inputs?.length)?.inputs || [];
  const editorRef = useRef(null);

  useEffect(() => {
    writeDraft(id, code);
  }, [id, code]);

  const guard = async (fn) => {
    setBusy("Starting Python…");
    try {
      await fn();
    } catch (err) {
      setRun({ output: "", error: err.message || String(err) });
    } finally {
      setBusy("");
    }
  };

  const runOnly = () =>
    guard(async () => {
      setVerdict((v) => (v?.passed ? v : null));
      const res = await runChallenge(code, [{ inputs: firstInputs }], { onProgress: setBusy });
      setRun(res.results[0] || null);
    });

  const check = () =>
    guard(async () => {
      if (!code.trim() || code.trim() === starter.trim()) {
        setVerdict({ passed: false, message: "Write your code in the editor first, then check it." });
        return;
      }
      const res = await runChallenge(code, tests, { onProgress: setBusy });
      const last = res.results[res.results.length - 1] || {};
      setRun(last);
      setAttempts((n) => n + 1);
      if (res.passed) {
        setVerdict({
          passed: true,
          message: successMessage || "That works. Every check passed.",
          count: res.results.length,
        });
        onSolved?.();
      } else {
        const which =
          tests.length > 1
            ? ` (check ${res.results.length} of ${tests.length}${last.label ? `: ${last.label}` : ""})`
            : "";
        setVerdict({ passed: false, message: last.message + which });
      }
    });

  return (
    <div className="ac-trace ac-challenge">
      <div className="ac-trace__task ac-challenge__task">
        <span className="ac-note__label">
          <i className="fas fa-keyboard" aria-hidden="true" /> Your turn: write the code
        </span>
        <p>{task}</p>
        {sample && (
          <>
            <span className="ac-trace__out-label ac-challenge__sample-label">
              A run of a finished version could look like this
            </span>
            <pre className="ac-challenge__sample">{sample}</pre>
          </>
        )}
      </div>

      <div className="ac-trace__live">
        <label className="ac-trace__out-label" htmlFor={`ac-ch-${id}`}>
          Your code
        </label>
        <textarea
          id={`ac-ch-${id}`}
          ref={editorRef}
          className="ac-trace__editor"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (!verdict?.passed) setVerdict(null);
          }}
          onKeyDown={(e) => handleEditorKeys(e, code, setCode)}
          rows={Math.min(20, Math.max(6, code.split("\n").length + 2))}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Your Python code"
        />

        {firstInputs.length > 0 && (
          <p className="ac-trace__inputs">
            <span className="ac-trace__out-label">When your program asks, Run types</span>{" "}
            {firstInputs.map((v, i) => (
              <kbd key={i}>{v === "" ? "(Enter)" : v}</kbd>
            ))}
          </p>
        )}

        {!open ? (
          <div className="ac-trace__live-intro">
            <button className="ac-trace__run-open" onClick={() => setOpen(true)}>
              <i className="fas fa-play" aria-hidden="true" /> Load Python and start
            </button>
            <p>
              Your code is run by real Python inside this page. The first run
              downloads the Python runtime (several megabytes, cached
              afterwards). You can also write and test it in VS Code first,
              then paste it here to check it.
            </p>
          </div>
        ) : (
          <div className="ac-trace__actions">
            <button className="ac-trace__reveal" onClick={runOnly} disabled={Boolean(busy)}>
              <i className="fas fa-play" aria-hidden="true" /> Run
            </button>
            <button className="ac-trace__btn" onClick={check} disabled={Boolean(busy)}>
              {busy ? "Working…" : "Check my code"}
            </button>
            <button
              className="ac-trace__reveal"
              onClick={() => {
                setCode(starter);
                setRun(null);
                if (!verdict?.passed) setVerdict(null);
              }}
            >
              Start again
            </button>
          </div>
        )}

        {busy && <p className="ac-trace__busy">{busy}</p>}
      </div>

      {run && (
        <div className="ac-trace__out">
          <span className="ac-trace__out-label">
            {run.error ? "Your program printed, then stopped with an error" : "Your program printed"}
          </span>
          <pre>{run.output || "(nothing)"}</pre>
          {run.error && <pre className="is-error">{run.error}</pre>}
        </div>
      )}

      {verdict && (
        <div className="ac-trace__answer">
          <p className={`ac-trace__feedback ${verdict.passed ? "is-ok" : "is-bad"}`} role="status">
            {verdict.passed && <i className="fas fa-circle-check" aria-hidden="true" />}{" "}
            {verdict.message}
          </p>
          {!verdict.passed && hint && attempts >= 1 && (
            <p className="ac-challenge__hint">
              <strong>Hint:</strong> {hint}
            </p>
          )}
        </div>
      )}

      {solution && revealSolution && (attempts >= 2 || verdict?.passed) && (
        <div className="ac-trace__answer ac-challenge__solution">
          <button className="ac-trace__reveal" onClick={() => setShowSolution((v) => !v)}>
            {showSolution
              ? "Hide the model answer"
              : verdict?.passed
                ? "Compare with a model answer"
                : "I am stuck: show a model answer"}
          </button>
          {showSolution && (
            <>
              <pre className="ac-challenge__model">{solution}</pre>
              {!verdict?.passed && (
                <p className="ac-challenge__hint">
                  Read it line by line, then close it and write your own version
                  from memory. Copying it will pass the check but will not teach
                  you anything.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
