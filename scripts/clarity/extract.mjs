/**
 * CLARITY LAYER — EVERY PIECE OF TEXT A LEARNER READS
 *
 * Walks a course in teaching order and returns one "segment" per string a
 * learner sees: lesson intros, atom explanations, decisions, lab tasks and
 * messages, question prompts and feedback.
 *
 * Each segment has a ROLE, because not all text should be judged the same way:
 *
 *   teach    prose that explains. Every rule applies.
 *   label    short UI text: titles, table cells, check labels, correct options.
 *            Grammar and length only.
 *   brief    practice source material in a lab brief. Grammar and length only.
 *   example  text shown as GOOD writing (good samples, `example`). Grammar only,
 *            because a model of good writing must itself be correct.
 *   wrong    deliberately wrong text: wrong answer options. Only length is
 *            checked; grammar is skipped because a grammar course writes wrong
 *            sentences on purpose.
 *
 * Text shown as BAD writing (samples with tone "bad", lab starter documents,
 * model solutions) is not extracted at all.
 *
 * sid = "<lessonId>|<anchor>|<path>": anchor is the atom id, question id or
 * "-" for lesson-level text. The sid is printed in the lint report so a
 * finding can be traced to its file, and used in allow/<course>.json.
 */

function push(out, base, path, text, role) {
  if (typeof text !== "string") return;
  const t = text.trim();
  if (!t || !/[A-Za-z]/.test(t)) return;
  out.push({ ...base, sid: `${base.lessonId}|${base.anchor}|${path}`, path, text, role });
}

function lessonSegments(mod, lesson, index) {
  const out = [];
  const lb = {
    moduleId: mod.id, lessonId: lesson.id, lessonTitle: lesson.title, lessonIndex: index,
    anchor: "-", atomId: null, file: mod.lessonFile, kind: "lesson",
  };
  push(out, lb, "title", lesson.title, "label");
  push(out, lb, "subtitle", lesson.subtitle, "label");
  push(out, lb, "intro", lesson.intro, "teach");
  if (lesson.task) {
    push(out, lb, "task.title", lesson.task.title, "label");
    push(out, lb, "task.intro", lesson.task.intro, "teach");
    (lesson.task.prompts || []).forEach((p, i) => push(out, lb, `task.prompts.${i}`, p, "teach"));
  }

  lesson.atoms.forEach((atom, atomIndex) => {
    const ab = { ...lb, anchor: atom.id, atomId: atom.id, atomIndex, kind: "atom" };
    push(out, ab, "title", atom.title, "label");
    for (const f of ["explain", "why", "analogy", "mistake"]) push(out, ab, f, atom[f], "teach");
    push(out, ab, "example", atom.example, "example");
    if (atom.table) {
      push(out, ab, "table.caption", atom.table.caption, "teach");
      (atom.table.headers || []).forEach((h, i) => push(out, ab, `table.headers.${i}`, h, "label"));
      (atom.table.rows || []).forEach((row, r) =>
        row.forEach((cell, c) => push(out, ab, `table.rows.${r}.${c}`, cell, "label")));
    }
    (atom.samples || []).forEach((s, i) => {
      if (s.tone === "bad") return;
      push(out, ab, `samples.${i}.text`, s.text, "example");
    });
    if (atom.decision) {
      const d = atom.decision;
      push(out, ab, "decision.scenario", d.scenario, "teach");
      push(out, ab, "decision.question", d.question, "teach");
      (d.options || []).forEach((o) => {
        push(out, ab, `decision.options.${o.id}.text`, o.text, o.id === d.correct ? "label" : "wrong");
        push(out, ab, `decision.options.${o.id}.why`, o.why, "teach");
        push(out, ab, `decision.options.${o.id}.whyWrong`, o.whyWrong, "teach");
      });
      push(out, ab, "decision.aftermath", d.aftermath, "teach");
    }
    if (atom.writingLab) {
      const w = atom.writingLab;
      push(out, ab, "writingLab.task", w.task, "teach");
      push(out, ab, "writingLab.hint", w.hint, "teach");
      push(out, ab, "writingLab.successMessage", w.successMessage, "teach");
      push(out, ab, "writingLab.brief", w.brief, "brief");
      (w.tests || []).forEach((t, i) => {
        push(out, ab, `writingLab.tests.${i}.label`, t.label, "label");
        push(out, ab, `writingLab.tests.${i}.fail`, t.fail, "teach");
      });
    }
  });

  const bank = mod.assessments?.[lesson.id];
  for (const q of bank?.questions || []) {
    const qb = { ...lb, anchor: q.id, atomId: q.atomId, file: mod.assessFile, kind: "question" };
    push(out, qb, "prompt", q.prompt, "teach");
    (q.options || []).forEach((o) => push(out, qb, `options.${o.id}`, o.text, o.id === q.correct ? "label" : "wrong"));
    push(out, qb, "explanation", q.explanation, "teach");
    for (const [k, v] of Object.entries(q.whyWrong || {})) push(out, qb, `whyWrong.${k}`, v, "teach");
  }
  return out;
}

/**
 * All segments of a course in teaching order, plus the ordered atom list.
 * `only` limits the result to some module ids (the order index stays global).
 */
export async function extract(course, only = null) {
  const modules = await course.modules();
  const segments = [];
  const atoms = [];
  let lessonIndex = 0;
  for (const mod of modules) {
    for (const lesson of [...mod.lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
      lessonIndex += 1;
      for (const a of lesson.atoms) atoms.push({ id: a.id, moduleId: mod.id, lessonId: lesson.id, order: atoms.length });
      if (only && !only.includes(mod.id)) continue;
      segments.push(...lessonSegments(mod, lesson, lessonIndex));
    }
  }
  return { modules, segments, atoms };
}

/** Segments grouped by lesson id, preserving order. */
export function byLesson(segments) {
  const map = new Map();
  for (const s of segments) {
    if (!map.has(s.lessonId)) map.set(s.lessonId, []);
    map.get(s.lessonId).push(s);
  }
  return map;
}
