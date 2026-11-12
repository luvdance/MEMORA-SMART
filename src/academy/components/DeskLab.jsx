import { useEffect, useRef, useState } from "react";
import { DESK_APPS, emptyValues, mins, runDesk } from "../desk/deskkit";
import { MarkdownView } from "./WritingLab";

/**
 * THE VA WORKDESK — the practice of the Virtual Assistant course.
 *
 * A virtual assistant's day is a queue of things to sort, schedule, route
 * and record: forty emails, ten support tickets, a week of meetings across
 * time zones, a launch board, a shared drive. Reading about triage does not
 * make anyone good at it; triaging a realistic queue against a client's
 * rules does. So this is a simulated workspace: a list of items (emails,
 * tickets, meetings, tasks, files, leads, comments), each with the fields a
 * VA sets (label, priority, action, day and time, owner, status,
 * permission), a live preview for calendars and boards, and "Check my work",
 * which marks each item right or wrong and checks the rules that apply to
 * the desk as a whole (no clashes, dependencies in order). Grading lives in
 * ../desk/deskkit.js and is proved in Node for every lab.
 *
 * After a pass, every item's reasoning (`why`) can be read; after two
 * attempts the model desk can be shown. Work in progress is kept in this
 * browser per atom.
 */

const saveKey = (id) => `academy:desk:${id}`;

function readSaved(id) {
  try {
    const raw = id ? window.localStorage.getItem(saveKey(id)) : null;
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeSaved(id, values) {
  try {
    if (id) window.localStorage.setItem(saveKey(id), JSON.stringify(values));
  } catch {
    /* storage blocked: work is simply not kept */
  }
}

const fieldsFor = (lab, item) => (item.only ? lab.fields.filter((f) => item.only.includes(f.key)) : lab.fields);
const optionsFor = (field, item) => item.options?.[field.key] || field.options || [];

/* ── Calendar preview: a small week grid ───────────────────────────────── */

function CalendarPreview({ lab, values }) {
  const cal = lab.calendar || {};
  const days = cal.days || ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const from = mins(cal.from || "08:00");
  const to = mins(cal.to || "18:00");
  const span = Math.max(60, to - from);
  const hours = [];
  for (let h = Math.ceil(from / 60) * 60; h <= to; h += 60) hours.push(h);
  const blocks = [];
  for (const b of cal.fixed || []) {
    blocks.push({ key: `f-${b.day}-${b.start}`, day: b.day, start: mins(b.start), end: mins(b.end), title: b.title, fixed: true });
  }
  for (const item of lab.items) {
    if (!item.duration) continue;
    const val = values[item.id] || {};
    const start = mins(val.start);
    const day = val.day || item.day;
    if (!Number.isFinite(start) || !day) continue;
    blocks.push({ key: item.id, day, start, end: start + Number(item.duration), title: item.short || item.title });
  }
  const grid = { gridTemplateColumns: `44px repeat(${days.length}, minmax(72px, 1fr))` };
  const clash = (a) => blocks.some((b) => b !== a && b.day === a.day && a.start < b.end && b.start < a.end);
  return (
    <div className="ac-desk__cal" aria-label="Week preview">
      <div className="ac-desk__calhead" style={grid}>
        <span />
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="ac-desk__calbody" style={{ ...grid, height: `${Math.round((span / 60) * 34)}px` }}>
        <div className="ac-desk__calhours">
          {hours.map((h) => (
            <span key={h} style={{ top: `${((h - from) / span) * 100}%` }}>
              {String(Math.floor(h / 60)).padStart(2, "0")}:00
            </span>
          ))}
        </div>
        {days.map((d) => (
          <div className="ac-desk__calday" key={d}>
            {hours.map((h) => (
              <i key={h} style={{ top: `${((h - from) / span) * 100}%` }} />
            ))}
            {blocks
              .filter((b) => b.day === d)
              .map((b) => (
                <div
                  key={b.key}
                  className={`ac-desk__calblock ${b.fixed ? "is-fixed" : ""} ${clash(b) ? "is-clash" : ""} ${b.start < from || b.end > to ? "is-out" : ""}`}
                  style={{
                    top: `${(Math.max(0, b.start - from) / span) * 100}%`,
                    height: `${(Math.max(15, Math.min(b.end, to) - Math.max(b.start, from)) / span) * 100}%`,
                  }}
                  title={b.title}
                >
                  {b.title}
                </div>
              ))}
          </div>
        ))}
      </div>
      <p className="ac-desk__legend">
        <span className="is-fixed" /> already booked <span /> placed by you <span className="is-clash" /> clash
      </p>
    </div>
  );
}

/* ── Board preview: columns from the status field ─────────────────────── */

function BoardPreview({ lab, values }) {
  const field = lab.fields.find((f) => f.key === (lab.boardBy || "status"));
  if (!field) return null;
  const cols = field.options || [];
  return (
    <div className="ac-desk__board" aria-label="Board preview">
      {cols.map((c) => {
        const cards = lab.items.filter((i) => String(values[i.id]?.[field.key] || "") === c);
        return (
          <div className="ac-desk__col" key={c}>
            <h5>
              {c} <span>{cards.length}</span>
            </h5>
            {cards.map((i) => (
              <div className="ac-desk__card" key={i.id}>
                <strong>{i.short || i.title}</strong>
                {lab.fields
                  .filter((f) => f.key !== field.key && values[i.id]?.[f.key])
                  .slice(0, 2)
                  .map((f) => (
                    <small key={f.key}>
                      {f.label}: {values[i.id][f.key]}
                    </small>
                  ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ── One field control ─────────────────────────────────────────────────── */

function Control({ field, item, value, onChange, disabled }) {
  const id = `desk-${item.id}-${field.key}`;
  if (field.type === "select") {
    return (
      <label className="ac-desk__field" htmlFor={id}>
        <span>{field.label}</span>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
          <option value="">Choose…</option>
          {optionsFor(field, item).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className={`ac-desk__field ${field.type === "time" ? "is-time" : ""} ${field.wide ? "is-wide" : ""}`} htmlFor={id}>
      <span>{field.label}</span>
      <input
        id={id}
        type="text"
        inputMode={field.type === "time" ? "numeric" : undefined}
        value={value}
        placeholder={field.placeholder || (field.type === "time" ? "09:30" : "")}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        spellCheck={field.type === "text"}
      />
    </label>
  );
}

export default function DeskLab({ id, onSolved, alreadySolved = false, ...lab }) {
  const {
    app = "generic",
    title,
    task,
    brief,
    briefTitle = "Your instructions",
    fields = [],
    items = [],
    rules = [],
    solution,
    hint,
    successMessage,
  } = lab;
  // The lab's items and fields never change while it is mounted (the player
  // remounts it per atom), so the empty desk is computed once.
  const [blank] = useState(() => emptyValues({ items, fields }));
  const [values, setValues] = useState(() => {
    const saved = readSaved(id);
    if (!saved) return blank;
    const merged = {};
    for (const item of items) merged[item.id] = { ...blank[item.id], ...(saved[item.id] || {}) };
    return merged;
  });
  const [verdict, setVerdict] = useState(alreadySolved ? { passed: true, message: "You have already passed this desk. Work through it again as often as you like.", result: null } : null);
  const [attempts, setAttempts] = useState(0);
  const [open, setOpen] = useState(() => new Set(items.length ? [items[0].id] : []));
  const [showModel, setShowModel] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => writeSaved(id, values), 300);
    return () => clearTimeout(timer.current);
  }, [id, values]);

  const set = (itemId, key, value) => {
    setValues((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [key]: value } }));
    if (!verdict?.passed) setVerdict((v) => (v ? { ...v, stale: true } : v));
  };

  const filled = items.filter((i) => fieldsFor(lab, i).every((f) => String(values[i.id]?.[f.key] ?? "").trim())).length;
  const meta = DESK_APPS[app] || DESK_APPS.generic;

  const check = () => {
    const result = runDesk(lab, values);
    setAttempts((n) => n + 1);
    if (result.passed) {
      setVerdict({ passed: true, message: successMessage || "Every item and every rule is right.", result });
      onSolved?.();
      return;
    }
    const badRule = result.rules.find((r) => !r.passed);
    const wrongItems = result.total - result.right;
    const message =
      wrongItems > 0
        ? `${result.right} of ${result.total} right. The items marked red need another look${badRule ? `, and one desk rule is not met: ${badRule.fail}` : "."}`
        : badRule?.fail || "Not yet.";
    setVerdict({ passed: false, message, result });
    setOpen(new Set(result.items.filter((i) => !i.ok).map((i) => i.id)));
  };

  const reset = () => {
    if (!window.confirm("Clear the desk and start again?")) return;
    setValues(blank);
    setVerdict(null);
  };

  const itemStatus = (itemId) => (verdict?.result && !verdict.stale ? verdict.result.items.find((i) => i.id === itemId) : null);
  const ruleStatus = (i) => (verdict?.result && !verdict.stale ? verdict.result.rules[i] : null);
  const toggle = (itemId) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

  return (
    <div className="ac-trace ac-desk">
      <div className="ac-trace__task">
        <span className="ac-note__label">
          <i className="fas fa-briefcase" aria-hidden="true" /> Your turn: work the desk
        </span>
        {task && <p>{task}</p>}
        {rules.length > 0 && (
          <ul className="ac-weblab__checklist">
            {rules.map((r, i) => {
              const st = ruleStatus(i);
              return (
                <li key={i} className={st ? (st.passed ? "is-ok" : "is-bad") : ""}>
                  <i className={st ? (st.passed ? "fas fa-circle-check" : "fas fa-circle-xmark") : "far fa-circle"} aria-hidden="true" />
                  <span>{r.label}</span>
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

      <div className="ac-desk__app">
        <div className="ac-desk__appbar">
          <span className="ac-desk__appname">
            <i className={meta.icon} aria-hidden="true" /> {meta.name}
          </span>
          {title && <span className="ac-desk__title">{title}</span>}
          <span className="ac-desk__progress">
            {filled}/{items.length} done
          </span>
        </div>

        {app === "calendar" && <CalendarPreview lab={lab} values={values} />}
        {app === "board" && <BoardPreview lab={lab} values={values} />}

        <ol className="ac-desk__items">
          {items.map((item) => {
            const st = itemStatus(item.id);
            const isOpen = open.has(item.id);
            return (
              <li key={item.id} className={`ac-desk__item ${st ? (st.ok ? "is-ok" : "is-bad") : ""}`}>
                <button className="ac-desk__itemhead" onClick={() => toggle(item.id)} aria-expanded={isOpen}>
                  <i className={st ? (st.ok ? "fas fa-circle-check" : "fas fa-circle-xmark") : isOpen ? "fas fa-chevron-down" : "fas fa-chevron-right"} aria-hidden="true" />
                  <span className="ac-desk__itemtitle">{item.title}</span>
                  {item.meta && <span className="ac-desk__itemmeta">{item.meta}</span>}
                </button>
                {isOpen && item.body && (
                  <div className="ac-desk__itembody">
                    <MarkdownView text={item.body} />
                  </div>
                )}
                <div className="ac-desk__fields">
                  {fieldsFor(lab, item).map((f) => (
                    <Control
                      key={f.key}
                      field={f}
                      item={item}
                      value={values[item.id]?.[f.key] ?? ""}
                      onChange={(v) => set(item.id, f.key, v)}
                    />
                  ))}
                </div>
                {st && !st.ok && item.hint && attempts >= 1 && <p className="ac-desk__hint">{item.hint}</p>}
                {verdict?.passed && item.why && (
                  <details className="ac-desk__why">
                    <summary>Why</summary>
                    <p>{item.why}</p>
                  </details>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="ac-trace__live ac-weblab__actions">
        <div className="ac-trace__actions">
          <button className="ac-trace__btn" onClick={check}>
            Check my work
          </button>
          <button className="ac-trace__reveal" onClick={reset}>
            Start again
          </button>
        </div>
      </div>

      {verdict && (
        <div className="ac-trace__answer">
          <p className={`ac-trace__feedback ${verdict.passed ? "is-ok" : "is-bad"}`} role="status">
            {verdict.passed && <i className="fas fa-circle-check" aria-hidden="true" />} {verdict.stale ? "You have changed the desk since the last check. Check again." : verdict.message}
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
          <button className="ac-trace__reveal" onClick={() => setShowModel((v) => !v)}>
            {showModel ? "Hide the model desk" : verdict?.passed ? "Compare with the model desk" : "I am stuck: show the model desk"}
          </button>
          {showModel && (
            <div className="ac-md__table ac-desk__model">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    {fields.map((f) => (
                      <th key={f.key}>{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.short || item.title}</td>
                      {fields.map((f) => (
                        <td key={f.key}>{solution[item.id]?.[f.key] ?? ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!verdict?.passed && (
                <p className="ac-challenge__hint">
                  Read the model and the reasoning in your instructions, then work the desk yourself. Several answers are
                  sometimes acceptable; the checks accept every one the brief allows.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
