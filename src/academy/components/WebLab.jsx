import { useEffect, useMemo, useRef, useState } from "react";
import { VIEWPORTS, LAB_HEIGHT, buildLabDocument, labPages, solvedFiles } from "../webHarness";
import { SANDBOX, gradeLab, makeNonce } from "../webLabRunner";

/**
 * BUILD IT — the practice of the Responsive Web Development course.
 *
 * A web developer's work is files and a browser: you change the HTML or the
 * CSS and look at what the page does, on a phone and on a laptop. So that is
 * the practice. The learner edits real files (index.html, style.css, app.js),
 * the preview renders them live at a phone, tablet or laptop width, and
 * "Check my page" runs the lab's checks against the rendered page: the real
 * DOM, the real computed styles, at the real width each check names.
 *
 * Every check is written as a requirement the learner can read BEFORE they
 * start (the checklist), and turns green or red after checking, so feedback
 * is about the page, never "wrong answer".
 *
 * `npm run validate:content` loads every lab in headless Chrome with the same
 * harness: the model answer must pass every check and the starter must fail
 * at least one, so a lab can never ship unsolvable or already solved.
 *
 * `demo` turns the same component into a worked example: the code and its
 * rendered result, editable for experimenting, with nothing to grade.
 *
 * Drafts are kept in this browser (localStorage) per atom, as a convenience.
 */

const NO_MOCKS = [];
const NO_FILES = {};
const NO_NAMES = [];

const draftKey = (id) => `academy:web-draft:${id}`;

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
    /* private mode or storage blocked: the draft simply is not kept */
  }
}

/** Two-space indentation, and Enter keeps the current line's indentation. */
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
    if (/[{([>]\s*$/.test(line) && !/<\/[^>]+>\s*$/.test(line) && !/\/>\s*$/.test(line)) indent += "  ";
    const insert = "\n" + indent;
    place(value.slice(0, start) + insert + value.slice(end), start + insert.length);
  }
}

const fileIcon = (name) =>
  name.endsWith(".html")
    ? "fab fa-html5"
    : name.endsWith(".css")
      ? "fab fa-css3-alt"
      : /\.(jsx|tsx)$/.test(name)
        ? "fab fa-react"
        : name.endsWith(".ts")
          ? "fas fa-code"
          : name.endsWith(".md")
            ? "fab fa-markdown"
            : /\.json$|^\.env/.test(name)
              ? "fas fa-gear"
              : "fab fa-js";

export default function WebLab({
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
  mocks = NO_MOCKS,
  seed = null,
  preview = "desktop",
  open,
  demo = false,
  onSolved,
  alreadySolved = false,
}) {
  const names = Object.keys(starter);
  const [files, setFiles] = useState(() => ({ ...starter, ...(demo ? {} : readDraft(id) || {}) }));
  const [active, setActive] = useState(() => open || names.find((n) => !readOnly.includes(n)) || names[0]);
  const [viewport, setViewport] = useState(preview);
  const [page, setPage] = useState(() => labPages(starter)[0] || null);
  const [rendered, setRendered] = useState({ doc: "", nonce: "" });
  // A React lab's router path, shown in the address bar as a real URL would be.
  const [route, setRoute] = useState("");
  const [consoleLines, setConsoleLines] = useState([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState(() =>
    alreadySolved && !demo
      ? { passed: true, message: "You already built this one. Change it and check it again whenever you like.", checks: [] }
      : null
  );
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const [stageWidth, setStageWidth] = useState(640);

  useEffect(() => {
    if (!demo) writeDraft(id, files);
  }, [id, files, demo]);

  // The preview follows the code, a moment after typing stops.
  useEffect(() => {
    const t = setTimeout(() => {
      const nonce = makeNonce();
      setConsoleLines([]);
      setNotice("");
      setRoute("");
      setRendered({ nonce, doc: buildLabDocument(files, { page, mocks, seed, nonce }) });
    }, 350);
    return () => clearTimeout(t);
  }, [files, page, mocks, seed]);

  useEffect(() => {
    const onMessage = (event) => {
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const data = event.data || {};
      if (data.__lab !== rendered.nonce) return;
      if (data.type === "console") setConsoleLines((lines) => [...lines.slice(-49), { level: data.level, line: data.line }]);
      else if (data.type === "navigate") setPage(data.page);
      else if (data.type === "location") setRoute(String(data.path || ""));
      else if (data.type === "external")
        setNotice(`That link goes to ${data.href}. Links that leave the practice page are not followed here.`);
      else if (data.type === "submitted")
        setNotice(`The form was submitted to ${data.action}. A real browser would now load that page.`);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [rendered.nonce]);

  useEffect(() => {
    if (!stageRef.current || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  const vp = VIEWPORTS[viewport] || VIEWPORTS.desktop;
  const scale = Math.min(1, stageWidth / vp.width);
  const shownHeight = 420;
  const pages = labPages(files);
  const isReadOnly = readOnly.includes(active);
  const model = useMemo(() => (solution ? solvedFiles({ files: starter, solution }) : null), [solution, starter]);
  const changed = names.some((n) => (files[n] ?? "") !== (starter[n] ?? ""));

  const edit = (value) => {
    setFiles((f) => ({ ...f, [active]: value }));
    if (!verdict?.passed) setVerdict(null);
  };

  const check = async () => {
    if (!changed) {
      setVerdict({ passed: false, message: "Make your changes in the editor first, then check your page.", checks: [] });
      return;
    }
    setBusy(true);
    try {
      const res = await gradeLab({ tests, mocks, seed, files: starter }, files);
      setAttempts((n) => n + 1);
      if (res.passed) {
        setVerdict({ passed: true, message: successMessage || "Every check passed.", checks: res.checks });
        onSolved?.();
      } else {
        const first = res.checks.find((c) => !c.passed);
        setVerdict({
          passed: false,
          message: first?.fail || `Not yet: ${first?.label}`,
          checks: res.checks,
          errors: res.errors,
        });
      }
    } finally {
      setBusy(false);
    }
  };

  const status = (i) => verdict?.checks?.find((c) => c.index === i);

  return (
    <div className={`ac-trace ac-weblab ${demo ? "ac-weblab--demo" : ""}`}>
      <div className="ac-trace__task ac-weblab__task">
        <span className="ac-note__label">
          {demo ? (
            <>
              <i className="fas fa-flask" aria-hidden="true" /> Try it: edit the code and watch the page
            </>
          ) : (
            <>
              <i className="fas fa-screwdriver-wrench" aria-hidden="true" /> Your turn: build it
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
                  <i
                    className={s ? (s.passed ? "fas fa-circle-check" : "fas fa-circle-xmark") : "far fa-circle"}
                    aria-hidden="true"
                  />
                  <span>
                    {t.label}
                    {t.viewport && (
                      <em className="ac-weblab__at"> · at {VIEWPORTS[t.viewport]?.label.toLowerCase() || `${t.viewport}px`} width</em>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="ac-weblab__grid">
        <div className="ac-weblab__code">
          <div className="ac-weblab__tabs" role="tablist" aria-label="Files">
            {names.map((name) => (
              <button
                key={name}
                role="tab"
                aria-selected={active === name}
                className={`ac-weblab__tab ${active === name ? "is-active" : ""}`}
                onClick={() => setActive(name)}
              >
                <i className={fileIcon(name)} aria-hidden="true" /> {name}
                {readOnly.includes(name) && <i className="fas fa-lock ac-weblab__lock" title="Read only" aria-label="read only" />}
              </button>
            ))}
          </div>
          <textarea
            className="ac-trace__editor ac-weblab__editor"
            value={files[active] ?? ""}
            readOnly={isReadOnly}
            onChange={(e) => edit(e.target.value)}
            onKeyDown={(e) => !isReadOnly && handleKeys(e, files[active] ?? "", edit)}
            rows={Math.min(24, Math.max(10, String(files[active] ?? "").split("\n").length + 2))}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label={`${active}${isReadOnly ? " (read only)" : ""}`}
          />
          {isReadOnly && (
            <p className="ac-weblab__ro">This file is given. Read it, then make your changes in the other file.</p>
          )}
        </div>

        <div className="ac-weblab__preview">
          <div className="ac-weblab__bar">
            <span className="ac-weblab__addr" title={route || page || "page"}>
              <i className="fas fa-lock" aria-hidden="true" /> {route ? `localhost:5173${route}` : page || "index.html"}
            </span>
            <div className="ac-weblab__vps" role="group" aria-label="Preview width">
              {Object.entries(VIEWPORTS).map(([key, v]) => (
                <button
                  key={key}
                  className={viewport === key ? "is-active" : ""}
                  onClick={() => setViewport(key)}
                  aria-pressed={viewport === key}
                  title={`${v.label}, ${v.width}px wide`}
                >
                  <i className={v.icon} aria-hidden="true" />
                  <span>{v.width}px</span>
                </button>
              ))}
            </div>
          </div>
          {pages.length > 1 && (
            <div className="ac-weblab__pages">
              {pages.map((p) => (
                <button key={p} className={page === p ? "is-active" : ""} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}
          <div className="ac-weblab__stage" ref={stageRef} style={{ height: shownHeight }}>
            <iframe
              ref={frameRef}
              title="Preview of your page"
              sandbox={`${SANDBOX} allow-modals`}
              srcDoc={rendered.doc}
              style={{
                width: vp.width,
                height: Math.max(LAB_HEIGHT, shownHeight / scale),
                transform: `scale(${scale})`,
              }}
            />
          </div>
          {notice && <p className="ac-weblab__notice">{notice}</p>}
          {consoleLines.length > 0 && (
            <div className="ac-weblab__console" aria-live="polite">
              <span className="ac-trace__out-label">Console</span>
              <pre>
                {consoleLines.map((c, i) => (
                  <span key={i} className={c.level === "error" ? "is-error" : c.level === "warn" ? "is-warn" : ""}>
                    {c.line}
                    {"\n"}
                  </span>
                ))}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="ac-trace__live ac-weblab__actions">
        <div className="ac-trace__actions">
          {!demo && (
            <button className="ac-trace__btn" onClick={check} disabled={busy}>
              {busy ? "Checking…" : "Check my page"}
            </button>
          )}
          <button
            className="ac-trace__reveal"
            onClick={() => {
              setFiles({ ...starter });
              setPage(labPages(starter)[0] || null);
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
          {!verdict.passed && verdict.errors?.length > 0 && (
            <pre className="ac-weblab__errors">{verdict.errors.join("\n")}</pre>
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
            {showSolution
              ? "Hide the model answer"
              : verdict?.passed
                ? "Compare with a model answer"
                : "I am stuck: show a model answer"}
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
                  Read it line by line, then close it and write your own version from memory. Copying it will
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
