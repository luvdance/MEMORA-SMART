/**
 * THE VA WORKDESK — GRADING KIT
 *
 * The Virtual Assistant course's own practice: a simulated client workspace
 * (an inbox, a ticket queue, a calendar, a project board, a shared drive, a
 * lead list, a social inbox) holding a set of ITEMS the learner works
 * through. Every item has one or more FIELDS to set — a label, a priority, a
 * day and start time, an owner, a status, a permission, a corrected value —
 * and "Check my work" grades two things:
 *
 *   1. each item: `expect` (the accepted value or values per field, compared
 *      without case or surrounding spaces) and/or `check` (the body of a
 *      function that receives the item's values as `val`);
 *   2. the whole desk: `rules`, bodies of functions that see every item at
 *      once — no two meetings clash, every task starts after the task it
 *      depends on, no more than three items are marked urgent.
 *
 * Lessons are pure JSON data, so checks are strings, compiled here exactly as
 * the Writing Desk compiles its checks. The same module runs in the browser
 * (DeskLab.jsx) and in Node (lib/academy/desk/check.mjs proves every lab:
 * the model `solution` passes everything, an untouched desk fails).
 *
 *   deskLab: {
 *     app: "inbox",                    // skin: see DESK_APPS
 *     title: "Mrs Bello's inbox, Monday 08:00",
 *     task: "…", brief: "Markdown, optional",
 *     fields: [{ key: "label", label: "Label", type: "select", options: [...] },
 *              { key: "start", label: "Start", type: "time" },
 *              { key: "note",  label: "Note",  type: "text", placeholder: "…" }],
 *     items: [{ id: "e1", title: "…", meta: "…", body: "Markdown",
 *               expect: { label: "Finance" }, check: "return …", hint, why,
 *               duration: 60 /* calendar items *\/ }],
 *     rules: [{ label, check: "return !clashes();", fail }],
 *     calendar: { days: ["Mon", …], from: "08:00", to: "18:00",
 *                 fixed: [{ day: "Mon", start: "09:00", end: "10:00", title: "…" }] },
 *     solution: { e1: { label: "Finance" }, … },
 *   }
 *
 * CLIENT-SAFE. Model values in `solution` are shown to the learner only after
 * two attempts, like the Writing Desk's model answer.
 */

export const DESK_APPS = {
  inbox: { name: "Inbox", icon: "fas fa-inbox" },
  calendar: { name: "Calendar", icon: "far fa-calendar-days" },
  tickets: { name: "Help desk", icon: "fas fa-headset" },
  board: { name: "Project board", icon: "fas fa-table-columns" },
  files: { name: "Shared drive", icon: "fas fa-folder-tree" },
  leads: { name: "Lead list", icon: "fas fa-address-book" },
  social: { name: "Social inbox", icon: "fas fa-comments" },
  tasks: { name: "Task list", icon: "fas fa-list-check" },
  research: { name: "Research notes", icon: "fas fa-magnifying-glass" },
  generic: { name: "Workdesk", icon: "fas fa-briefcase" },
};

/* ── Values ────────────────────────────────────────────────────────────── */

const norm = (s) => String(s ?? "").trim().replace(/\s+/g, " ").toLowerCase();

/** "09:30", "9:30", "9.30", "0930" → minutes after midnight; NaN if not a time. */
export function mins(t) {
  const s = String(t ?? "").trim();
  const m = /^(\d{1,2})[:.]?(\d{2})$/.exec(s);
  if (!m) return NaN;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h > 23 || mm > 59) return NaN;
  return h * 60 + mm;
}

/** Minutes after midnight → "09:30". */
export function hhmm(m) {
  const n = ((Math.round(m) % 1440) + 1440) % 1440;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}

/** Empty values for every item and field: what an untouched desk holds. */
export function emptyValues(lab) {
  const out = {};
  for (const item of lab?.items || []) {
    out[item.id] = {};
    for (const f of lab.fields || []) out[item.id][f.key] = item.preset?.[f.key] ?? "";
  }
  return out;
}

/** True if `value` is accepted by `accepted` (a value or a list of values). */
export function accepts(accepted, value) {
  const list = Array.isArray(accepted) ? accepted : [accepted];
  return list.some((a) => norm(a) === norm(value));
}

/* ── The scope every check can use by name ─────────────────────────────── */

export function deskScope(lab, values) {
  const v = values || {};
  const defs = lab?.items || [];
  const rows = defs.map((item) => ({ ...(v[item.id] || {}), id: item.id, $: item }));
  const cal = lab?.calendar || {};
  const fixed = (cal.fixed || []).map((b) => ({ ...b, start: mins(b.start), end: mins(b.end), fixed: true }));

  /** A calendar item as { id, day, start, end } (NaN start if not set). */
  const slot = (id) => {
    const item = defs.find((i) => i.id === id);
    const val = v[id] || {};
    const start = mins(val.start);
    const day = val.day ?? item?.day ?? "";
    return { id, day, start, end: start + (Number(item?.duration) || 0), title: item?.title };
  };
  const overlap = (a, b) => norm(a.day) === norm(b.day) && a.start < b.end && b.start < a.end;
  const placed = () => defs.filter((i) => i.duration).map((i) => slot(i.id)).filter((s) => Number.isFinite(s.start) && s.day);
  /** Pairs that overlap: two placed items, or a placed item and a fixed block. */
  const clashList = () => {
    const out = [];
    const p = placed();
    for (let i = 0; i < p.length; i += 1) {
      for (let j = i + 1; j < p.length; j += 1) if (overlap(p[i], p[j])) out.push([p[i].id, p[j].id]);
      for (const b of fixed) if (overlap(p[i], b)) out.push([p[i].id, b.title || "a fixed block"]);
    }
    return out;
  };

  return {
    v,
    rows,
    items: rows,
    fixed,
    mins,
    hhmm,
    norm,
    accepts,
    val: (id, key) => v[id]?.[key] ?? "",
    count: (pred) => rows.filter(pred).length,
    all: (pred) => rows.every(pred),
    any: (pred) => rows.some(pred),
    where: (key, value) => rows.filter((r) => accepts(value, r[key])),
    slot,
    overlap,
    placed,
    clashList,
    clashes: () => clashList().length > 0,
    /** Every placed item starts at or after `from` and ends by `to` ("08:00", "17:00"). */
    within: (from, to) => placed().every((s) => s.start >= mins(from) && s.end <= mins(to)),
    /** Day index in calendar.days (or in the list given). */
    dayIndex: (day, days = cal.days || []) => days.findIndex((d) => norm(d) === norm(day)),
    /** A date like "2026-03-14" or "14/03/2026" → a sortable number, NaN if neither. */
    date: (s) => {
      const t = String(s ?? "").trim();
      let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
      if (m) return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]);
      m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
      if (m) return Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]);
      return NaN;
    },
    num: (s) => {
      const n = Number(String(s ?? "").replace(/[₦$£€,\s]/g, ""));
      return String(s ?? "").trim() === "" ? NaN : n;
    },
    re: (pattern, s, flags = "i") => new RegExp(pattern, flags).test(String(s ?? "")),
  };
}

const compiled = new Map();
function compile(names, body) {
  const key = names.join(",") + "\u0000" + body;
  if (!compiled.has(key)) compiled.set(key, new Function(...names, `"use strict";\n${body}`));
  return compiled.get(key);
}

function run(scope, extra, body) {
  const all = { ...scope, ...extra };
  const names = Object.keys(all);
  return Boolean(compile(names, body)(...names.map((n) => all[n])));
}

/**
 * Grades a desk. Returns
 *   { passed, items: [{ id, ok, wrong: [fieldKey…], error }],
 *     rules: [{ index, label, passed, fail, error }], right, total }
 * An item is ok when every `expect` field is accepted and its `check` (if
 * any) returns true. A check that throws fails; the error is kept for the
 * validator.
 */
export function runDesk(lab, values) {
  const scope = deskScope(lab, values);
  const items = (lab?.items || []).map((item) => {
    const val = values?.[item.id] || {};
    const wrong = [];
    for (const [key, accepted] of Object.entries(item.expect || {})) {
      if (!accepts(accepted, val[key])) wrong.push(key);
    }
    let error;
    if (item.check) {
      try {
        if (!run(scope, { val, item }, item.check)) wrong.push("*");
      } catch (err) {
        wrong.push("*");
        error = String(err?.message || err);
      }
    }
    return { id: item.id, ok: wrong.length === 0, wrong, error };
  });
  const rules = (lab?.rules || []).map((r, index) => {
    try {
      return { index, label: r.label, passed: run(scope, {}, r.check), fail: r.fail };
    } catch (err) {
      return { index, label: r.label, passed: false, fail: r.fail, error: String(err?.message || err) };
    }
  });
  const right = items.filter((i) => i.ok).length;
  return {
    passed: items.every((i) => i.ok) && rules.every((r) => r.passed),
    items,
    rules,
    right,
    total: items.length,
  };
}
