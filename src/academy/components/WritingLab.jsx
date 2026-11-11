import { useEffect, useMemo, useRef, useState } from "react";
import { runWritingChecks, stats as measure } from "../writing/textkit";

/**
 * THE WRITING DESK — the practice of the Content Writing, Copywriting and
 * Professional Communication course.
 *
 * A writer's work is a draft and a brief. So that is the practice: the brief
 * (product facts, a client's notes, a badly written paragraph to repair) sits
 * above a plain prose editor, a live bar measures the draft as it is typed
 * (words, sentences, average sentence length, reading grade, reading ease,
 * reading time) and a style report lists what an editor would query: long
 * sentences, probable passive voice, "-ly" adverbs, wordy phrases with their
 * plainer replacements, and tired phrases.
 *
 * "Check my writing" runs the lab's checks against the draft itself (see
 * ../writing/textkit.js): the parts a brief asks for, word and character
 * limits, readability, the presence of a call to action, a rewrite that is
 * really a rewrite. Every check is listed BEFORE the learner starts, so the
 * feedback is about the writing, never "wrong answer". The checks cannot
 * judge taste; the model answer, shown after an attempt, shows what good
 * looks like.
 *
 * `npm run validate:content` runs every lab in Node with the same kit: the
 * model answer must pass every check and the starter must fail at least one.
 *
 * Drafts are kept in this browser (localStorage) per atom, as a convenience,
 * and can be copied or downloaded for the learner's portfolio.
 */

const draftKey = (id) => `academy:writing-draft:${id}`;

function readDraft(id) {
  try {
    const raw = id ? window.localStorage.getItem(draftKey(id)) : null;
    return typeof raw === "string" ? raw : null;
  } catch {
    return null;
  }
}

function writeDraft(id, text) {
  try {
    if (id) window.localStorage.setItem(draftKey(id), text);
  } catch {
    /* private mode or storage blocked: the draft simply is not kept */
  }
}

/* ── A small, safe Markdown renderer (React elements only, no HTML) ──── */

function renderInline(text, keyBase) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)\s]+\)|`[^`]+`|(?<![\w*])\*[^*\n]+\*(?!\w)|(?<![\w_])_[^_\n]+_(?![\w]))/g;
  let last = 0;
  let i = 0;
  for (const m of String(text).matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const key = `${keyBase}-${i++}`;
    if (t.startsWith("**") || t.startsWith("__")) out.push(<strong key={key}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("[")) {
      const lm = t.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      const safe = /^https?:\/\//i.test(lm[2]);
      out.push(
        safe ? (
          <a key={key} href={lm[2]} target="_blank" rel="noreferrer noopener">
            {lm[1]}
          </a>
        ) : (
          <span key={key} className="ac-wdesk__link">
            {lm[1]}
          </span>
        )
      );
    } else if (t.startsWith("`")) out.push(<code key={key}>{t.slice(1, -1)}</code>);
    else out.push(<em key={key}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MarkdownView({ text, className = "" }) {
  const blocks = useMemo(() => {
    const ls = String(text ?? "").replace(/\r/g, "").split("\n");
    const out = [];
    let i = 0;
    while (i < ls.length) {
      const l = ls[i];
      const t = l.trim();
      if (!t || /^\s*\[[^\]]*\]\s*$/.test(l)) {
        i++;
        continue;
      }
      const h = t.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        out.push({ kind: "h", level: h[1].length, text: h[2] });
        i++;
      } else if (/^([-*_])(\s*\1){2,}$/.test(t)) {
        out.push({ kind: "hr" });
        i++;
      } else if (t.startsWith("|")) {
        const rowsIn = [];
        while (i < ls.length && ls[i].trim().startsWith("|")) rowsIn.push(ls[i++].trim());
        const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        out.push({ kind: "table", head: cells(rowsIn[0]), rows: rowsIn.slice(2).map(cells) });
      } else if (/^[-*+]\s+/.test(t)) {
        const items = [];
        while (i < ls.length && /^\s*[-*+]\s+/.test(ls[i])) items.push(ls[i++].trim().replace(/^[-*+]\s+/, ""));
        out.push({ kind: "ul", items });
      } else if (/^\d+[.)]\s+/.test(t)) {
        const items = [];
        while (i < ls.length && /^\s*\d+[.)]\s+/.test(ls[i])) items.push(ls[i++].trim().replace(/^\d+[.)]\s+/, ""));
        out.push({ kind: "ol", items });
      } else if (t.startsWith(">")) {
        const q = [];
        while (i < ls.length && ls[i].trim().startsWith(">")) q.push(ls[i++].trim().replace(/^>\s?/, ""));
        out.push({ kind: "quote", text: q.join(" ") });
      } else {
        const p = [];
        while (
          i < ls.length &&
          ls[i].trim() &&
          !/^(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\|)/.test(ls[i].trim()) &&
          !/^\s*\[[^\]]*\]\s*$/.test(ls[i])
        )
          p.push(ls[i++].trim());
        if (p.length) out.push({ kind: "p", lines: p });
        else i++;
      }
    }
    return out;
  }, [text]);

  return (
    <div className={`ac-md ${className}`}>
      {blocks.map((b, n) => {
        const k = `b${n}`;
        if (b.kind === "h") {
          const Tag = `h${Math.min(6, b.level + 1)}`;
          return <Tag key={k}>{renderInline(b.text, k)}</Tag>;
        }
        if (b.kind === "hr") return <hr key={k} />;
        if (b.kind === "ul")
          return (
            <ul key={k}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it, `${k}-${j}`)}</li>
              ))}
            </ul>
          );
        if (b.kind === "ol")
          return (
            <ol key={k}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it, `${k}-${j}`)}</li>
              ))}
            </ol>
          );
        if (b.kind === "quote") return <blockquote key={k}>{renderInline(b.text, k)}</blockquote>;
        if (b.kind === "table")
          return (
            <div className="ac-md__table" key={k}>
              <table>
                <thead>
                  <tr>
                    {b.head.map((c, j) => (
                      <th key={j}>{renderInline(c, `${k}-h${j}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r, j) => (
                    <tr key={j}>
                      {r.map((c, x) => (
                        <td key={x}>{renderInline(c, `${k}-${j}-${x}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <p key={k}>
            {b.lines.map((line, j) => (
              <span key={j}>
                {j > 0 && " "}
                {renderInline(line, `${k}-${j}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/* ── The desk ──────────────────────────────────────────────────────────── */

const gradeLabel = (g) =>
  g <= 0 ? "–" : g < 6 ? "very easy" : g < 9 ? "plain English" : g < 12 ? "fairly hard" : g < 15 ? "hard" : "very hard";

function StatsBar({ s, target }) {
  const inRange = target ? s.words >= target[0] && (!target[1] || s.words <= target[1]) : null;
  return (
    <div className="ac-wdesk__stats" aria-live="off">
      <span className={inRange === null ? "" : inRange ? "is-ok" : "is-off"} title="Words in your draft (headings and tables not counted)">
        <strong>{s.words}</strong> words
        {target && (
          <em>
            {" "}
            / {target[1] ? `${target[0]}–${target[1]}` : `${target[0]}+`}
          </em>
        )}
      </span>
      <span title="Sentences">
        <strong>{s.sentences}</strong> sentences
      </span>
      <span title="Average words per sentence. 15 to 20 reads comfortably.">
        <strong>{s.avgSentence ? s.avgSentence.toFixed(1) : "0"}</strong> words/sentence
      </span>
      <span title="Flesch–Kincaid grade level: the years of schooling a reader needs. 7 to 9 suits most audiences.">
        Grade <strong>{s.grade > 0 ? s.grade.toFixed(1) : "–"}</strong> {s.grade > 0 && <em>{gradeLabel(s.grade)}</em>}
      </span>
      <span title="Flesch Reading Ease: 0 to 100, higher is easier. 60 to 70 is plain English.">
        Ease <strong>{s.words ? Math.round(s.ease) : "–"}</strong>
      </span>
      <span title="Reading time at 238 words a minute">
        <strong>{s.minutes < 1 ? `${Math.max(0, Math.round(s.minutes * 60))}s` : `${s.minutes.toFixed(1)} min`}</strong> read
      </span>
    </div>
  );
}

function StyleReport({ s }) {
  const groups = [
    { key: "long", icon: "fas fa-ruler-horizontal", label: "Long sentences (over 25 words)", items: s.long, tip: "Split them, or cut words. Readers lose the thread of long sentences." },
    { key: "passive", icon: "fas fa-person-walking-arrow-loop-left", label: "Probable passive voice", items: s.passive, tip: "Say who does what: \"The manager approved it\", not \"It was approved\". Keep the passive only when the doer does not matter." },
    { key: "wordy", icon: "fas fa-scissors", label: "Wordy phrases", items: s.wordy.map(([p, r]) => `${p} → ${r}`), tip: "Each has a shorter, plainer replacement." },
    { key: "adverbs", icon: "fas fa-feather", label: "\"-ly\" adverbs", items: [...new Set(s.adverbs.map((a) => a.toLowerCase()))], tip: "Often a stronger verb does the job alone: \"ran\" rather than \"moved quickly\"." },
    { key: "tells", icon: "fas fa-robot", label: "Tired or machine-sounding phrases", items: s.tells, tip: "Readers skim past them. Say the specific thing instead." },
  ];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <div className="ac-wdesk__report">
      {total === 0 ? (
        <p className="ac-wdesk__clean">
          <i className="fas fa-circle-check" aria-hidden="true" /> Nothing for an editor to query yet.
        </p>
      ) : (
        groups
          .filter((g) => g.items.length)
          .map((g) => (
            <div key={g.key} className={`ac-wdesk__flag ac-wdesk__flag--${g.key}`}>
              <p className="ac-wdesk__flag-head">
                <i className={g.icon} aria-hidden="true" /> {g.label} <span>{g.items.length}</span>
              </p>
              <ul>
                {g.items.slice(0, 8).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
                {g.items.length > 8 && <li>…and {g.items.length - 8} more</li>}
              </ul>
              <p className="ac-wdesk__tip">{g.tip}</p>
            </div>
          ))
      )}
    </div>
  );
}

export default function WritingLab({
  id,
  task,
  brief,
  briefTitle = "The brief",
  doc: starter = "",
  tests = [],
  solution,
  hint,
  successMessage,
  words: target = null,
  spellcheck = true,
  onSolved,
  alreadySolved = false,
}) {
  const [text, setText] = useState(() => readDraft(id) ?? starter);
  const [view, setView] = useState("write");
  const [showReport, setShowReport] = useState(false);
  const [verdict, setVerdict] = useState(alreadySolved ? { passed: true, message: "You have already passed this lab. Improve your draft as much as you like.", checks: [] } : null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeDraft(id, text), 400);
    return () => clearTimeout(saveTimer.current);
  }, [id, text]);

  const s = useMemo(() => measure(text), [text]);
  const changed = text !== starter;

  const edit = (value) => {
    setText(value);
    if (!verdict?.passed) setVerdict(null);
  };

  const check = () => {
    if (!changed) {
      setVerdict({ passed: false, message: "Write your draft in the editor first, then check it.", checks: [] });
      return;
    }
    const checks = runWritingChecks(tests, text, starter);
    setAttempts((n) => n + 1);
    if (checks.every((c) => c.passed)) {
      setVerdict({ passed: true, message: successMessage || "Every check passed.", checks });
      onSolved?.();
    } else {
      const first = checks.find((c) => !c.passed);
      setVerdict({ passed: false, message: first?.fail || `Not yet: ${first?.label}`, checks });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(id || "draft").replace(/^a-cw-/, "")}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const status = (i) => verdict?.checks?.find((c) => c.index === i);

  return (
    <div className="ac-trace ac-wdesk">
      <div className="ac-trace__task">
        <span className="ac-note__label">
          <i className="fas fa-pen-nib" aria-hidden="true" /> Your turn: write it
        </span>
        {task && <p>{task}</p>}
        {tests.length > 0 && (
          <ul className="ac-weblab__checklist">
            {tests.map((t, i) => {
              const st = status(i);
              return (
                <li key={i} className={st ? (st.passed ? "is-ok" : "is-bad") : ""}>
                  <i className={st ? (st.passed ? "fas fa-circle-check" : "fas fa-circle-xmark") : "far fa-circle"} aria-hidden="true" />
                  <span>{t.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {brief && (
        <details className="ac-wdesk__brief" open>
          <summary>
            <i className="fas fa-file-lines" aria-hidden="true" /> {briefTitle}
          </summary>
          <MarkdownView text={brief} />
        </details>
      )}

      <div className="ac-wdesk__desk">
        <div className="ac-wdesk__bar">
          <div className="ac-wdesk__views" role="tablist" aria-label="Editor view">
            <button role="tab" aria-selected={view === "write"} className={view === "write" ? "is-active" : ""} onClick={() => setView("write")}>
              <i className="fas fa-pen" aria-hidden="true" /> Write
            </button>
            <button role="tab" aria-selected={view === "preview"} className={view === "preview" ? "is-active" : ""} onClick={() => setView("preview")}>
              <i className="fas fa-eye" aria-hidden="true" /> Preview
            </button>
          </div>
          <div className="ac-wdesk__tools">
            <button onClick={() => setShowReport((v) => !v)} aria-pressed={showReport} title="What an editor would query in this draft">
              <i className="fas fa-highlighter" aria-hidden="true" /> Style report
              {s.long.length + s.passive.length + s.wordy.length + s.tells.length > 0 && (
                <span className="ac-wdesk__count">{s.long.length + s.passive.length + s.wordy.length + s.tells.length}</span>
              )}
            </button>
            <button onClick={copy} title="Copy your draft">
              <i className={copied ? "fas fa-check" : "far fa-copy"} aria-hidden="true" /> {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={download} title="Download your draft as a Markdown file for your portfolio">
              <i className="fas fa-download" aria-hidden="true" /> .md
            </button>
          </div>
        </div>

        {view === "write" ? (
          <textarea
            className="ac-wdesk__editor"
            value={text}
            onChange={(e) => edit(e.target.value)}
            rows={Math.min(28, Math.max(12, String(text).split("\n").length + 3))}
            spellCheck={spellcheck}
            aria-label="Your draft"
          />
        ) : (
          <div className="ac-wdesk__preview">
            <MarkdownView text={text} />
          </div>
        )}

        <StatsBar s={s} target={target} />
        {showReport && <StyleReport s={s} />}
      </div>

      <div className="ac-trace__live ac-weblab__actions">
        <div className="ac-trace__actions">
          <button className="ac-trace__btn" onClick={check}>
            Check my writing
          </button>
          <button
            className="ac-trace__reveal"
            onClick={() => {
              if (text !== starter && !window.confirm("Start again from the original? Your draft will be replaced.")) return;
              setText(starter);
              if (!verdict?.passed) setVerdict(null);
            }}
          >
            Start again
          </button>
        </div>
      </div>

      {verdict && (
        <div className="ac-trace__answer">
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

      {solution && (attempts >= 2 || verdict?.passed) && (
        <div className="ac-trace__answer ac-challenge__solution">
          <button className="ac-trace__reveal" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? "Hide the model answer" : verdict?.passed ? "Compare with a model answer" : "I am stuck: show a model answer"}
          </button>
          {showSolution && (
            <>
              <div className="ac-wdesk__model">
                <MarkdownView text={solution} />
              </div>
              {!verdict?.passed && (
                <p className="ac-challenge__hint">
                  Read it, notice what it does, then close it and write your own version. A model answer is one good
                  answer, not the only one; copying it would pass the checks and teach you nothing.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Before-and-after or reference writing samples shown inside an atom. */
export function WritingSamples({ samples }) {
  return (
    <div className="ac-wsamples">
      {samples.map((s, i) => (
        <figure key={i} className={`ac-wsample ${s.tone ? `ac-wsample--${s.tone}` : ""}`}>
          {s.label && (
            <figcaption>
              {s.tone === "bad" && <i className="fas fa-circle-xmark" aria-hidden="true" />}
              {s.tone === "good" && <i className="fas fa-circle-check" aria-hidden="true" />} {s.label}
            </figcaption>
          )}
          <MarkdownView text={s.text} />
          {s.note && <p className="ac-wsample__note">{s.note}</p>}
        </figure>
      ))}
    </div>
  );
}
