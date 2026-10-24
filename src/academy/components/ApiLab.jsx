import { useEffect, useState } from "react";
import { gradeApiLab, isDatabaseReady, onDatabaseReady, startDatabase, tryApiLab } from "../sql/runner.js";

/**
 * THE BACKEND LAB — Node.js-style route handlers on real PostgreSQL.
 *
 * The learner writes Express-style routes that use a node-postgres-style
 * pool; they run in the page against PostgreSQL 18 (see sql/apiLab.js).
 * "Send the requests" runs the lab's requests and shows each response;
 * "Check my code" compares every response, and the database afterwards,
 * with what the model answer produced. Proved at build time like SQL labs.
 */

const draftKey = (id) => `academy:api-draft:${id}`;
const readDraft = (id) => {
  try {
    return id ? window.localStorage.getItem(draftKey(id)) : null;
  } catch {
    return null;
  }
};
const writeDraft = (id, code) => {
  try {
    if (id) window.localStorage.setItem(draftKey(id), code);
  } catch {
    /* storage blocked */
  }
};

function useReady() {
  const [ready, setReady] = useState(isDatabaseReady);
  useEffect(() => onDatabaseReady(setReady), []);
  return ready;
}

function editorKeys(e, value, setValue) {
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
    place(value.slice(0, start) + "  " + value.slice(end), start + 2);
  } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const line = value.slice(lineStart, start);
    let indent = line.match(/^\s*/)[0];
    if (/[{([]\s*$/.test(line)) indent += "  ";
    place(value.slice(0, start) + "\n" + indent + value.slice(end), start + 1 + indent.length);
  }
}

const pretty = (body) => (typeof body === "string" ? body || "(empty body)" : JSON.stringify(body, null, 2));

function Exchanges({ outcome }) {
  if (!outcome) return null;
  if (outcome.failure) {
    return (
      <div className="ac-trace__out">
        <pre className="is-error">{outcome.failure}</pre>
      </div>
    );
  }
  return (
    <div className="ac-trace__out ac-sql__out">
      {outcome.loadError ? (
        <>
          <span className="ac-trace__out-label">Your code did not load</span>
          <pre className="ac-sql__error">{outcome.loadError}</pre>
        </>
      ) : (
        <span className="ac-trace__out-label">Requests sent to your routes</span>
      )}
      {(outcome.exchanges || []).map((x, i) => (
        <div key={i} className={`ac-sql__step ${x.response.status >= 500 ? "is-error" : ""}`}>
          <p className="ac-sql__stmt">
            <code>
              {(x.request.method || "GET").toUpperCase()} {x.request.path}
            </code>
            {x.request.body !== undefined && <code> {JSON.stringify(x.request.body)}</code>}
            <span className="ac-sql__line"> {x.response.status}</span>
          </p>
          <pre className={x.response.status >= 500 ? "ac-sql__error" : "ac-sql__tag"}>{pretty(x.response.body)}</pre>
        </div>
      ))}
      {outcome.logs?.length > 0 && (
        <>
          <span className="ac-trace__out-label">console output</span>
          <pre className="ac-sql__notice">{outcome.logs.join("\n")}</pre>
        </>
      )}
    </div>
  );
}

export default function ApiLab({
  id,
  task,
  setup = "",
  starter = "",
  solution = "",
  checks = [],
  hint,
  successMessage,
  revealSolution = true,
  onSolved,
  alreadySolved = false,
}) {
  const ready = useReady();
  const [code, setCode] = useState(() => readDraft(id) ?? starter);
  const [busy, setBusy] = useState("");
  const [outcome, setOutcome] = useState(null);
  const [verdict, setVerdict] = useState(() =>
    alreadySolved ? { passed: true, results: [], message: "You already solved this one. Change it and run it again whenever you like." } : null
  );
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => writeDraft(id, code), [id, code]);

  const lab = { checks, solution };

  const send = async () => {
    setBusy("Sending the requests to your routes…");
    try {
      setOutcome(await tryApiLab({ setup, lab, code }));
      if (!verdict?.passed) setVerdict(null);
    } catch (err) {
      setOutcome({ failure: err.message });
    } finally {
      setBusy("");
    }
  };

  const check = async () => {
    if (!code.trim() || code.trim() === starter.trim()) {
      setVerdict({ passed: false, results: [], message: "Write your routes in the editor first, then check them." });
      return;
    }
    setBusy("Checking: the model answer's responses first, then yours…");
    try {
      const res = await gradeApiLab({ setup, lab, code });
      setOutcome(res);
      setAttempts((n) => n + 1);
      setVerdict({
        passed: res.passed,
        results: res.results,
        message: res.passed ? successMessage || "Every check passed." : "Not yet. The checklist shows what is still wrong.",
      });
      if (res.passed) onSolved?.();
    } catch (err) {
      setOutcome({ failure: err.message });
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="ac-trace ac-challenge ac-sql">
      <div className="ac-trace__task ac-challenge__task">
        <span className="ac-note__label">
          <i className="fab fa-node-js" aria-hidden="true" /> Your turn: write the backend code
        </span>
        <p>{task}</p>
      </div>
      <div className="ac-trace__live">
        <label className="ac-trace__out-label" htmlFor={`ac-api-${id}`}>
          Your routes (app and pool are ready, as in server.js)
        </label>
        <textarea
          id={`ac-api-${id}`}
          className="ac-trace__editor"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (!verdict?.passed) setVerdict(null);
          }}
          onKeyDown={(e) => editorKeys(e, code, setCode)}
          rows={Math.min(26, Math.max(8, code.split("\n").length + 2))}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Your JavaScript route code"
        />
        {!ready ? (
          <div className="ac-trace__live-intro">
            <button
              className="ac-trace__run-open"
              onClick={() => startDatabase().catch((err) => setOutcome({ failure: err.message }))}
            >
              <i className="fas fa-database" aria-hidden="true" /> Start PostgreSQL
            </button>
            <p>
              Your routes run in this page against a real PostgreSQL 18 server (downloaded once, about 5 MB).
              Each run starts from a fresh copy of the lab database.
            </p>
          </div>
        ) : (
          <div className="ac-trace__actions">
            <button className="ac-trace__reveal" onClick={send} disabled={Boolean(busy)}>
              <i className="fas fa-paper-plane" aria-hidden="true" /> Send the requests
            </button>
            <button className="ac-trace__btn" onClick={check} disabled={Boolean(busy)}>
              {busy ? "Working…" : "Check my code"}
            </button>
            <button
              className="ac-trace__reveal"
              disabled={Boolean(busy)}
              onClick={() => {
                setCode(starter);
                setOutcome(null);
                if (!verdict?.passed) setVerdict(null);
              }}
            >
              Start again
            </button>
          </div>
        )}
        {busy && <p className="ac-trace__busy">{busy}</p>}
      </div>

      <Exchanges outcome={outcome} />

      {verdict && (
        <div className="ac-trace__answer">
          {verdict.results.length > 0 && (
            <ul className="ac-weblab__checklist">
              {verdict.results.map((r, i) => (
                <li key={i} className={r.passed ? "is-ok" : "is-bad"}>
                  <i className={`fas ${r.passed ? "fa-circle-check" : "fa-circle-xmark"}`} aria-hidden="true" />
                  <span>
                    {r.label}
                    {!r.passed && r.message ? <em className="ac-sql__why"> {r.message}</em> : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className={`ac-trace__feedback ${verdict.passed ? "is-ok" : "is-bad"}`} role="status">
            {verdict.passed && <i className="fas fa-circle-check" aria-hidden="true" />} {verdict.message}
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
            {showSolution ? "Hide the model answer" : verdict?.passed ? "Compare with a model answer" : "I am stuck: show a model answer"}
          </button>
          {showSolution && <pre className="ac-challenge__model">{solution}</pre>}
        </div>
      )}
    </div>
  );
}
