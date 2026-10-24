import { useEffect, useState } from "react";
import { NUMERIC_TYPES, formatError } from "../sql/engine.js";
import { gradeSql, isDatabaseReady, onDatabaseReady, runSql, startDatabase } from "../sql/runner.js";
import ErdDiagram from "./ErdDiagram";

/**
 * SQL ON A REAL POSTGRESQL SERVER.
 *
 * The Relational Databases course is practice-first: every idea is used, in
 * SQL the learner writes, on PostgreSQL 18 running in the page (PGlite, the
 * PostgreSQL server compiled to WebAssembly). Results, command tags, NOTICEs
 * and error messages are PostgreSQL's own.
 *
 *   SqlLab    graded. The learner's script runs on a fresh copy of the lab
 *             database; "Check my SQL" runs the model answer on another fresh
 *             copy and then the atom's checks (engine.js gradeLab). Every
 *             lab is proved at build time by `npm run validate:content`: its
 *             model answer passes and its starter does not.
 *   SqlDemo   a worked example, editable and runnable, never graded.
 *
 * Both show the database's tables (read from the real catalog) and can draw
 * an ERD of it. The draft is kept in this browser per atom, a convenience
 * only.
 */

const draftKey = (id) => `academy:sql-draft:${id}`;

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
    /* storage blocked: the draft simply is not kept */
  }
}

/** Tab indents, Enter keeps indentation, Ctrl/Cmd+Enter runs. */
function editorKeys(e, value, setValue, onRun) {
  const el = e.target;
  const { selectionStart: start, selectionEnd: end } = el;
  const place = (text, caret) => {
    setValue(text);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = caret;
    });
  };
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    onRun?.();
    return;
  }
  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    place(value.slice(0, start) + "  " + value.slice(end), start + 2);
    return;
  }
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const indent = value.slice(lineStart, start).match(/^\s*/)[0];
    const insert = "\n" + indent;
    place(value.slice(0, start) + insert + value.slice(end), start + insert.length);
  }
}

/** Follow the shared server's state, so every lab on the page agrees. */
function useDatabaseReady() {
  const [ready, setReady] = useState(isDatabaseReady);
  useEffect(() => onDatabaseReady(setReady), []);
  return ready;
}

function firstLine(sql) {
  const line = sql.split("\n").find((l) => l.trim() && !l.trim().startsWith("--")) || sql;
  return line.length > 72 ? `${line.slice(0, 70)}…` : line;
}

/** One statement's result: a table, a command tag, NOTICEs, or an error. */
function StepResult({ step, showSql }) {
  return (
    <div className={`ac-sql__step ${step.error ? "is-error" : ""}`}>
      {showSql && (
        <p className="ac-sql__stmt">
          <span className="ac-sql__line">line {step.line}</span> <code>{firstLine(step.sql)}</code>
        </p>
      )}
      {step.notices.map((n, i) => (
        <pre key={i} className="ac-sql__notice">{`${n.severity}:  ${n.message}`}</pre>
      ))}
      {step.hasRows ? (
        <div className="ac-sql__grid-wrap">
          <table className="ac-sql__grid">
            <thead>
              <tr>
                {step.fields.map((f, i) => (
                  <th key={i}>{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.rows.slice(0, 200).map((row, r) => (
                <tr key={r}>
                  {row.map((v, c) => (
                    <td key={c} className={`${NUMERIC_TYPES.has(step.types[c]) ? "is-num" : ""} ${v === null ? "is-null" : ""}`}>
                      {v === null ? "NULL" : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ac-sql__count">
            ({step.rows.length} {step.rows.length === 1 ? "row" : "rows"})
            {step.rows.length > 200 ? " — the first 200 are shown" : ""}
          </p>
        </div>
      ) : (
        !step.error && step.tag && <pre className="ac-sql__tag">{step.tag}</pre>
      )}
      {step.error && <pre className="ac-sql__error">{formatError(step.error)}</pre>}
    </div>
  );
}

function RunOutput({ outcome }) {
  if (!outcome) return null;
  if (outcome.failure) {
    return (
      <div className="ac-trace__out">
        <pre className="is-error">{outcome.failure}</pre>
      </div>
    );
  }
  const { run } = outcome;
  return (
    <div className="ac-trace__out ac-sql__out">
      <span className="ac-trace__out-label">
        {run.error ? "PostgreSQL ran your SQL and stopped at an error" : "What PostgreSQL returned"}
      </span>
      {run.steps.length === 0 && <pre>(no statements to run)</pre>}
      {run.steps.map((s, i) => (
        <StepResult key={i} step={s} showSql={run.steps.length > 1} />
      ))}
      {run.openTransaction && (
        <p className="ac-sql__warn">
          <i className="fas fa-triangle-exclamation" aria-hidden="true" /> Your script ended inside a transaction
          (BEGIN with no COMMIT). When a session ends with a transaction open, PostgreSQL rolls it back, so
          those changes were not kept.
        </p>
      )}
    </div>
  );
}

function TablesPanel({ schema }) {
  if (!schema?.tables?.length) return null;
  return (
    <details className="ac-sql__tables">
      <summary>
        <i className="fas fa-table" aria-hidden="true" /> Tables in this database ({schema.tables.length})
      </summary>
      <ul>
        {schema.tables.map((t) => (
          <li key={t.name}>
            <strong>{t.name}</strong>
            {t.view ? " (view)" : ""}:{" "}
            {t.columns.map((c, i) => (
              <span key={c.name}>
                {i ? ", " : ""}
                {c.name} <em>{c.type}</em>
                {c.pk ? " PK" : ""}
                {c.fk ? " FK" : ""}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </details>
  );
}

function StartButton({ onStarted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="ac-trace__live-intro">
      <button
        className="ac-trace__run-open"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            await startDatabase();
            onStarted?.();
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <i className="fas fa-database" aria-hidden="true" /> {busy ? "Starting PostgreSQL…" : "Start PostgreSQL"}
      </button>
      <p>
        Your SQL runs on a real PostgreSQL 18 server inside this page. Starting it downloads the server
        once (about 5 MB), then every lab in the course reuses it. Each run starts from a fresh copy of
        the lab database, so you cannot break anything.
      </p>
      {error && <p className="ac-sql__warn">{error}</p>}
    </div>
  );
}

/* ── The graded lab ─────────────────────────────────────────────────────── */

export default function SqlLab({
  id,
  task,
  setup = "",
  starter = "",
  solution = "",
  checks = [],
  hint,
  successMessage,
  revealSolution = true,
  erd = false,
  allowError = false,
  continueOnError = false,
  sample,
  onSolved,
  alreadySolved = false,
}) {
  const ready = useDatabaseReady();
  const [code, setCode] = useState(() => readDraft(id) ?? starter);
  const [busy, setBusy] = useState("");
  const [outcome, setOutcome] = useState(null);
  const [schema, setSchema] = useState(null);
  const [verdict, setVerdict] = useState(() =>
    alreadySolved ? { passed: true, results: [], message: "You already solved this one. Change it and run it again whenever you like." } : null
  );
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => writeDraft(id, code), [id, code]);

  // Show the lab's tables as soon as the server is up.
  useEffect(() => {
    if (!ready || schema) return;
    let live = true;
    runSql({ setup, sql: "", schema: true })
      .then((res) => live && setSchema(res.schema))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [ready, setup, schema]);

  const runOnly = async () => {
    if (busy) return;
    setBusy("Running on PostgreSQL…");
    try {
      const res = await runSql({ setup, sql: code, schema: true, stopOnError: !continueOnError });
      setOutcome(res);
      setSchema(res.schema);
      if (!verdict?.passed) setVerdict(null);
    } catch (err) {
      setOutcome({ failure: err.message });
    } finally {
      setBusy("");
    }
  };

  const check = async () => {
    if (busy) return;
    if (!code.trim() || code.trim() === starter.trim()) {
      setVerdict({ passed: false, results: [], message: "Write your SQL in the editor first, then check it." });
      return;
    }
    setBusy("Checking: running the model answer, then yours…");
    try {
      const res = await gradeSql({ setup, lab: { checks, solution, allowError, continueOnError }, sql: code, schema: true });
      setOutcome({ run: res.run });
      setSchema(res.schema);
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
          <i className="fas fa-database" aria-hidden="true" /> Your turn: write the SQL
        </span>
        <p>{task}</p>
        {sample && (
          <>
            <span className="ac-trace__out-label ac-challenge__sample-label">What a correct answer returns</span>
            <pre className="ac-challenge__sample">{sample}</pre>
          </>
        )}
      </div>

      <div className="ac-trace__live">
        <TablesPanel schema={schema} />
        <label className="ac-trace__out-label" htmlFor={`ac-sql-${id}`}>
          Your SQL
        </label>
        <textarea
          id={`ac-sql-${id}`}
          className="ac-trace__editor"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (!verdict?.passed) setVerdict(null);
          }}
          onKeyDown={(e) => editorKeys(e, code, setCode, ready ? runOnly : null)}
          rows={Math.min(22, Math.max(6, code.split("\n").length + 2))}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Your SQL"
        />
        {!ready ? (
          <StartButton />
        ) : (
          <div className="ac-trace__actions">
            <button className="ac-trace__reveal" onClick={runOnly} disabled={Boolean(busy)} title="Ctrl+Enter">
              <i className="fas fa-play" aria-hidden="true" /> Run
            </button>
            <button className="ac-trace__btn" onClick={check} disabled={Boolean(busy)}>
              {busy ? "Working…" : "Check my SQL"}
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

      <RunOutput outcome={outcome} />
      {erd && outcome?.run && <ErdDiagram schema={schema} title="Your database, as an ERD" />}

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
          {showSolution && (
            <>
              <pre className="ac-challenge__model">{solution}</pre>
              {!verdict?.passed && (
                <p className="ac-challenge__hint">
                  Read it statement by statement, then close it and write your own version. Copying it will
                  pass the check but will not teach you anything.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── The worked example ─────────────────────────────────────────────────── */

export function SqlDemo({ code: initial, setup = "", erd = false, caption, continueOnError = false }) {
  const ready = useDatabaseReady();
  const [code, setCode] = useState(initial);
  const [outcome, setOutcome] = useState(null);
  const [schema, setSchema] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (sql = code) => {
    setBusy(true);
    try {
      const res = await runSql({ setup, sql, schema: true, stopOnError: !continueOnError });
      setOutcome(res);
      setSchema(res.schema);
    } catch (err) {
      setOutcome({ failure: err.message });
    } finally {
      setBusy(false);
    }
  };

  // Once the server is up, an example shows its own result without a click.
  useEffect(() => {
    if (!ready || outcome) return;
    let live = true;
    runSql({ setup, sql: initial, schema: true, stopOnError: !continueOnError })
      .then((res) => {
        if (!live) return;
        setOutcome(res);
        setSchema(res.schema);
      })
      .catch((err) => live && setOutcome({ failure: err.message }));
    return () => {
      live = false;
    };
  }, [ready, outcome, setup, initial, continueOnError]);

  return (
    <div className="ac-trace ac-sql ac-sql--demo">
      <div className="ac-trace__task">
        <span className="ac-note__label">
          <i className="fas fa-database" aria-hidden="true" /> Example: run it on PostgreSQL
        </span>
        {caption && <p>{caption}</p>}
      </div>
      <div className="ac-trace__live">
        <TablesPanel schema={schema} />
        <textarea
          className="ac-trace__editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => editorKeys(e, code, setCode, ready ? () => run() : null)}
          rows={Math.min(20, Math.max(4, code.split("\n").length + 1))}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Example SQL, editable"
        />
        {!ready ? (
          <StartButton />
        ) : (
          <div className="ac-trace__actions">
            <button className="ac-trace__btn" onClick={() => run()} disabled={busy} title="Ctrl+Enter">
              <i className="fas fa-play" aria-hidden="true" /> {busy ? "Running…" : "Run"}
            </button>
            {code !== initial && (
              <button
                className="ac-trace__reveal"
                onClick={() => {
                  setCode(initial);
                  run(initial);
                }}
              >
                Back to the example
              </button>
            )}
          </div>
        )}
      </div>
      <RunOutput outcome={outcome} />
      {erd && <ErdDiagram schema={schema} />}
    </div>
  );
}
