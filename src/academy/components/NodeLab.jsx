import { useEffect, useMemo, useRef, useState } from "react";
import { gradeProgram, onMachineEvent, sendRequest, startProgram, stopProgram } from "../node/runner.js";
import { labCommand, solvedFiles } from "../node/grade.js";

/**
 * BUILD THE BACKEND — the practice of the Backend Engineering course.
 *
 * A backend developer's work is a project and a terminal: you change the
 * code, run it, send it requests and read what it prints. So that is the
 * practice. The learner edits the project's real files; Run starts it with
 * its real command (npm start, node server.js, npm test) on a Node.js
 * machine in the page, whose output streams into the terminal; the request
 * panel sends HTTP requests to the running server and shows exactly what
 * came back, status line, headers and body.
 *
 * "Check my code" starts the project afresh and runs the lab's checks —
 * requests, database queries, files, output — each written as a requirement
 * the learner can read before starting. `npm run validate:content` proves
 * every lab: the model answer passes every check, the starter does not.
 *
 * `demo` turns it into a worked example: run it and poke it, nothing graded.
 * Drafts are kept in this browser (localStorage) per atom.
 */

const NO_FILES = {};
const NO_NAMES = [];
const draftKey = (id) => `academy:node-draft:${id}`;

function readDraft(id) {
  try {
    const raw = id ? window.localStorage.getItem(draftKey(id)) : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeDraft(id, files) {
  try {
    if (id) window.localStorage.setItem(draftKey(id), JSON.stringify(files));
  } catch {
    /* storage blocked: the draft is simply not kept */
  }
}

function handleKeys(e, value, setValue) {
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
  } else if (e.key === "Tab" && e.shiftKey) {
    e.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lead = value.slice(lineStart).match(/^ {1,2}/)?.[0].length || 0;
    if (lead) place(value.slice(0, lineStart) + value.slice(lineStart + lead), Math.max(lineStart, start - lead));
  } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const line = value.slice(lineStart, start);
    let indent = line.match(/^\s*/)[0];
    if (/[{([]\s*$/.test(line)) indent += "  ";
    const insert = "\n" + indent;
    place(value.slice(0, start) + insert + value.slice(end), start + insert.length);
  }
}

const fileIcon = (name) =>
  /\.(ts|mts|cts)$/.test(name)
    ? "fas fa-code"
    : name.endsWith(".json")
      ? "fas fa-gear"
      : /^\.env|\.ya?ml$|^\.gitignore$|Dockerfile/.test(name.split("/").pop())
        ? "fas fa-sliders"
        : name.endsWith(".md")
          ? "fab fa-markdown"
          : name.endsWith(".sql")
            ? "fas fa-database"
            : "fab fa-node-js";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

function statusClass(status) {
  if (!status) return "is-error";
  if (status >= 500) return "is-error";
  if (status >= 400) return "is-warn";
  return "is-ok";
}

function prettyBody(text, headers) {
  if (!text) return "(empty body)";
  if (/json/.test(headers?.["content-type"] || "")) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  return text;
}

export default function NodeLab(props) {
  const {
    id,
    task,
    caption,
    files: starter = NO_FILES,
    readOnly = NO_NAMES,
    tests = NO_NAMES,
    solution,
    revealSolution = true,
    hint,
    successMessage,
    requests = NO_NAMES,
    open,
    demo = false,
    onSolved,
    alreadySolved = false,
  } = props;
  // Everything the machine needs to know about the lab (database, services …).
  const lab = useMemo(() => {
    const { onSolved: _a, alreadySolved: _b, demo: _c, ...rest } = props;
    return rest;
    // The lab definition is static content; it never changes while mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const names = Object.keys(starter);
  const [files, setFiles] = useState(() => ({ ...starter, ...(demo ? {} : readDraft(id) || {}) }));
  const [active, setActive] = useState(() => open || names.find((n) => !readOnly.includes(n)) || names[0]);
  const [written, setWritten] = useState({}); // files the program created or changed on the machine
  const [term, setTerm] = useState([]);
  const [proc, setProc] = useState({ state: "idle", command: "", ports: [], exitCode: null });
  const [busy, setBusy] = useState("");
  const [method, setMethod] = useState(requests[0]?.method || "GET");
  const [path, setPath] = useState(requests[0]?.path || "/");
  const [body, setBody] = useState(requests[0]?.body ? JSON.stringify(requests[0].body, null, 2) : "");
  const [headersText, setHeadersText] = useState(requests[0]?.headers ? Object.entries(requests[0].headers).map(([k, v]) => `${k}: ${v}`).join("\n") : "");
  const [response, setResponse] = useState(null);
  const [verdict, setVerdict] = useState(() =>
    alreadySolved && !demo ? { passed: true, message: "You already solved this one. Change it and check it again whenever you like.", checks: [] } : null
  );
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const termRef = useRef(null);
  const runningHere = useRef(false);

  useEffect(() => {
    if (!demo) writeDraft(id, files);
  }, [id, files, demo]);

  useEffect(
    () =>
      onMachineEvent((ev) => {
        if (!runningHere.current) return;
        if (ev.type === "output") setTerm((t) => [...t.slice(-400), { stream: ev.stream, text: ev.text }]);
        else if (ev.type === "exit") setProc((p) => ({ ...p, state: "exited", exitCode: ev.code }));
        else if (ev.type === "killed") setProc((p) => ({ ...p, state: "exited", exitCode: null }));
      }),
    []
  );

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [term]);

  const command = labCommand(lab, files);
  const isServer = requests.length > 0 || proc.ports.length > 0;
  const model = useMemo(() => (solution ? solvedFiles({ files: starter, solution }) : null), [solution, starter]);
  const changed = names.some((n) => (files[n] ?? "") !== (starter[n] ?? ""));
  const isReadOnly = readOnly.includes(active) || !(active in files);
  const extraNames = Object.keys(written).filter((n) => !(n in files));
  const shown = active in files ? files[active] : written[active] ?? "";

  const edit = (value) => {
    setFiles((f) => ({ ...f, [active]: value }));
    if (!verdict?.passed) setVerdict(null);
  };

  const noteFiles = (snapshot) => {
    if (!snapshot) return;
    const out = {};
    for (const [name, text] of Object.entries(snapshot)) if (files[name] !== text) out[name] = text;
    setWritten(out);
  };

  const run = async () => {
    runningHere.current = true;
    setBusy("run");
    setResponse(null);
    setTerm([{ stream: "cmd", text: `$ ${command}\n` }]);
    setProc({ state: "starting", command, ports: [], exitCode: null });
    try {
      const r = await startProgram(lab, files);
      setProc({ state: r.state === "exit" ? "exited" : "running", command: r.command, ports: r.ports, exitCode: r.exitCode });
      noteFiles(r.files);
    } catch (err) {
      setTerm((t) => [...t, { stream: "stderr", text: `${err.message}\n` }]);
      setProc((p) => ({ ...p, state: "exited" }));
    } finally {
      setBusy("");
    }
  };

  const stop = async () => {
    try {
      await stopProgram("SIGINT");
      setTerm((t) => [...t, { stream: "cmd", text: "^C\n" }]);
    } catch {
      /* already stopped */
    }
  };

  const send = async () => {
    setBusy("send");
    const headers = {};
    for (const line of headersText.split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    const req = { method, path: path.startsWith("/") ? path : `/${path}`, headers };
    if (body.trim() && !["GET", "HEAD"].includes(method)) {
      req.body = body;
      if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) headers["Content-Type"] = "application/json";
    }
    const t0 = performance.now();
    try {
      const r = await sendRequest(req);
      setResponse({ ...r, ms: Math.round(performance.now() - t0), req });
      noteFiles(r.files);
    } catch (err) {
      setResponse({ status: 0, error: err.message, headers: {}, text: "", req });
    } finally {
      setBusy("");
    }
  };

  const applyPreset = (r) => {
    setMethod(r.method || "GET");
    setPath(r.path || "/");
    setBody(r.body === undefined ? "" : typeof r.body === "string" ? r.body : JSON.stringify(r.body, null, 2));
    setHeadersText(r.headers ? Object.entries(r.headers).map(([k, v]) => `${k}: ${v}`).join("\n") : "");
  };

  const check = async () => {
    if (!changed && !demo) {
      setVerdict({ passed: false, message: "Make your changes in the editor first, then check your code.", checks: [] });
      return;
    }
    runningHere.current = false;
    setBusy("check");
    try {
      const res = await gradeProgram(lab, files);
      setAttempts((n) => n + 1);
      setProc({ state: "idle", command: "", ports: [], exitCode: null });
      if (res.passed) {
        setVerdict({ passed: true, message: successMessage || "Every check passed.", checks: res.checks, output: res.output });
        onSolved?.();
      } else {
        const first = res.checks.find((c) => !c.passed);
        setVerdict({ passed: false, message: first?.message || `Not yet: ${first?.label}`, checks: res.checks, output: res.output });
      }
    } catch (err) {
      setAttempts((n) => n + 1);
      setVerdict({ passed: false, message: err.message, checks: [] });
    } finally {
      setBusy("");
    }
  };

  const status = (i) => verdict?.checks?.find((c) => c.index === i);
  const running = proc.state === "running";

  return (
    <div className={`ac-trace ac-weblab ac-nodelab ${demo ? "ac-weblab--demo" : ""}`}>
      <div className="ac-trace__task ac-weblab__task">
        <span className="ac-note__label">
          {demo ? (
            <>
              <i className="fas fa-flask" aria-hidden="true" /> Try it: run the project and send it requests
            </>
          ) : (
            <>
              <i className="fas fa-server" aria-hidden="true" /> Your turn: build it
            </>
          )}
        </span>
        {(task || caption) && <p>{task || caption}</p>}
        {!demo && tests.length > 0 && (
          <ul className="ac-weblab__checklist">
            {tests.map((t, i) => {
              const s = status(i);
              return (
                <li key={i} className={s ? (s.passed ? "is-ok" : "is-bad") : ""}>
                  <i className={s ? (s.passed ? "fas fa-circle-check" : "fas fa-circle-xmark") : "far fa-circle"} aria-hidden="true" />
                  <span>{t.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="ac-weblab__grid">
        <div className="ac-weblab__code">
          <div className="ac-weblab__tabs" role="tablist" aria-label="Project files">
            {names.map((name) => (
              <button key={name} role="tab" aria-selected={active === name} className={`ac-weblab__tab ${active === name ? "is-active" : ""}`} onClick={() => setActive(name)}>
                <i className={fileIcon(name)} aria-hidden="true" /> {name}
                {readOnly.includes(name) && <i className="fas fa-lock ac-weblab__lock" title="Read only" aria-label="read only" />}
              </button>
            ))}
            {extraNames.map((name) => (
              <button key={name} role="tab" aria-selected={active === name} className={`ac-weblab__tab ac-nodelab__written ${active === name ? "is-active" : ""}`} onClick={() => setActive(name)} title="Written by your program">
                <i className="fas fa-file-pen" aria-hidden="true" /> {name}
              </button>
            ))}
          </div>
          <textarea
            className="ac-trace__editor ac-weblab__editor"
            value={shown}
            readOnly={isReadOnly}
            onChange={(e) => edit(e.target.value)}
            onKeyDown={(e) => !isReadOnly && handleKeys(e, files[active] ?? "", edit)}
            rows={Math.min(26, Math.max(12, String(shown).split("\n").length + 2))}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label={`${active}${isReadOnly ? " (read only)" : ""}`}
          />
          {!(active in files) ? (
            <p className="ac-weblab__ro">Your program wrote this file on the lab machine while it ran.</p>
          ) : readOnly.includes(active) ? (
            <p className="ac-weblab__ro">This file is given. Read it, then make your changes in the other files.</p>
          ) : written[active] !== undefined ? (
            <p className="ac-weblab__ro">Your program changed this file while it ran. The editor shows your version; the next Run starts from it.</p>
          ) : null}
        </div>

        {command === false ? (
          <div className="ac-weblab__preview ac-nodelab__side">
            <p className="ac-weblab__ro">
              <i className="fas fa-file-lines" aria-hidden="true" /> This deliverable is a document, not a program: there is nothing to run. Write it in the editor, then press <em>Check my work</em>; each requirement on the checklist is checked against what you wrote.
            </p>
          </div>
        ) : (
        <div className="ac-weblab__preview ac-nodelab__side">
          <div className="ac-weblab__bar">
            <span className="ac-weblab__addr" title="The command that starts the project">
              <i className="fas fa-terminal" aria-hidden="true" /> {command}
            </span>
            <div className="ac-weblab__vps" role="group" aria-label="Program">
              <button onClick={run} disabled={Boolean(busy)} title={running ? "Restart the program with your latest code" : "Run the program"}>
                <i className={running ? "fas fa-rotate-right" : "fas fa-play"} aria-hidden="true" />
                <span>{busy === "run" ? "Starting…" : running ? "Restart" : "Run"}</span>
              </button>
              <button onClick={stop} disabled={!running} title="Stop the program (Ctrl+C)">
                <i className="fas fa-stop" aria-hidden="true" />
                <span>Stop</span>
              </button>
            </div>
          </div>
          <div className="ac-nodelab__term" ref={termRef} aria-live="polite" aria-label="Terminal">
            {term.length === 0 ? (
              <span className="ac-nodelab__hint">Press Run to start the project. What it prints appears here.</span>
            ) : (
              term.map((t, i) => (
                <span key={i} className={t.stream === "stderr" ? "is-error" : t.stream === "cmd" ? "is-cmd" : ""}>
                  {t.text}
                </span>
              ))
            )}
            {proc.state === "exited" && proc.exitCode !== null && (
              <span className={proc.exitCode === 0 ? "is-cmd" : "is-error"}>{`\n[process exited with code ${proc.exitCode}]\n`}</span>
            )}
            {running && proc.ports.length > 0 && <span className="is-cmd">{`\n[listening on port ${proc.ports.join(", ")} · send it a request below]\n`}</span>}
          </div>

          {isServer && (
            <div className="ac-nodelab__req">
              <span className="ac-trace__out-label">Send a request</span>
              {requests.length > 1 && (
                <div className="ac-weblab__pages">
                  {requests.map((r, i) => (
                    <button key={i} onClick={() => applyPreset(r)} title={r.label || `${r.method || "GET"} ${r.path}`}>
                      {r.label || `${r.method || "GET"} ${r.path}`}
                    </button>
                  ))}
                </div>
              )}
              <div className="ac-nodelab__line">
                <select value={method} onChange={(e) => setMethod(e.target.value)} aria-label="HTTP method">
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <span className="ac-nodelab__host">localhost:{proc.ports[0] || 3000}</span>
                <input value={path} onChange={(e) => setPath(e.target.value)} aria-label="Path" spellCheck={false} />
                <button className="ac-trace__btn" onClick={send} disabled={!running || Boolean(busy)}>
                  {busy === "send" ? "Sending…" : "Send"}
                </button>
              </div>
              <button className="ac-nodelab__toggle" onClick={() => setShowHeaders((v) => !v)}>
                {showHeaders ? "Hide" : "Add"} request headers
              </button>
              {showHeaders && (
                <textarea className="ac-trace__editor ac-nodelab__small" rows={3} value={headersText} onChange={(e) => setHeadersText(e.target.value)} placeholder="Authorization: Bearer …" spellCheck={false} aria-label="Request headers, one per line" />
              )}
              {!["GET", "HEAD"].includes(method) && (
                <textarea className="ac-trace__editor ac-nodelab__small" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder='{ "title": "…" }' spellCheck={false} aria-label="Request body (JSON)" />
              )}
              {!running && <p className="ac-weblab__ro">Run the server first: requests go to the program while it is running.</p>}
              {response && (
                <div className="ac-nodelab__res">
                  {response.error ? (
                    <pre className="ac-sql__error">{response.error}</pre>
                  ) : (
                    <>
                      <p className={`ac-nodelab__status ${statusClass(response.status)}`}>
                        HTTP/1.1 {response.status} {response.statusText} <em>{response.ms !== undefined ? `· ${response.ms} ms` : ""}</em>
                      </p>
                      <details>
                        <summary>Response headers</summary>
                        <pre className="ac-sql__tag">{Object.entries(response.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}</pre>
                      </details>
                      <pre className="ac-nodelab__body">{prettyBody(response.text, response.headers)}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        )}
      </div>

      <div className="ac-trace__live ac-weblab__actions">
        <div className="ac-trace__actions">
          {!demo && (
            <button className="ac-trace__btn" onClick={check} disabled={Boolean(busy)}>
              {busy === "check" ? "Checking…" : command === false ? "Check my work" : "Check my code"}
            </button>
          )}
          <button
            className="ac-trace__reveal"
            onClick={() => {
              setFiles({ ...starter });
              setWritten({});
              if (!verdict?.passed) setVerdict(null);
            }}
          >
            {demo ? "Reset the example" : "Start again"}
          </button>
        </div>
      </div>

      {verdict && (
        <div className="ac-trace__answer">
          <p className={`ac-trace__feedback ${verdict.passed ? "is-ok" : "is-bad"}`} role="status">
            {verdict.passed && <i className="fas fa-circle-check" aria-hidden="true" />} {verdict.message}
          </p>
          {!verdict.passed && verdict.output && (
            <details className="ac-nodelab__graded">
              <summary>What your program printed while it was checked</summary>
              <pre className="ac-weblab__errors">{verdict.output.slice(-4000)}</pre>
            </details>
          )}
          {!verdict.passed && hint && attempts >= 1 && (
            <p className="ac-challenge__hint">
              <strong>Hint:</strong> {hint}
            </p>
          )}
        </div>
      )}

      {model && revealSolution && !demo && (attempts >= 2 || verdict?.passed) && (
        <div className="ac-trace__answer ac-challenge__solution">
          <button className="ac-trace__reveal" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? "Hide the model answer" : verdict?.passed ? "Compare with a model answer" : "I am stuck: show a model answer"}
          </button>
          {showSolution && (
            <>
              {Object.keys(solution).map((name) => (
                <div key={name}>
                  <span className="ac-trace__out-label ac-weblab__model-name">{name}</span>
                  <pre className="ac-challenge__model">{model[name]}</pre>
                </div>
              ))}
              {!verdict?.passed && (
                <p className="ac-challenge__hint">
                  Read it line by line, then close it and write your own version from memory. Copying it will pass the check but will not teach you anything.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
