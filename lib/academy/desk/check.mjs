/**
 * VIRTUAL ASSISTANT — PROOF OF EVERY WORKDESK LAB
 *
 * Runs each `deskLab` with the same kit the Workdesk uses in the browser
 * (src/academy/desk/deskkit.js):
 *
 *   - well formed: an app the Workdesk knows, a task, fields with a key, a
 *     label and a type (select fields with options), items with unique ids
 *     and a title, and a model `solution` with a value for every field of
 *     every item;
 *   - every `expect` value is one of the field's options (a select that can
 *     never be right is unsolvable);
 *   - every item is graded (an `expect` or a `check`), and every rule has a
 *     label, a check and a fail message;
 *   - the model solution passes every item and every rule, and nothing
 *     throws on it;
 *   - the untouched desk fails, so a lab never ships solved;
 *   - calendar items have a duration, and calendar labs have days.
 *
 * Used by lib/academy/validateContent.mjs and scripts/vaCheck.mjs.
 */
import { DESK_APPS, emptyValues, runDesk } from "../../../src/academy/desk/deskkit.js";

export function verifyDeskLabs(lessons) {
  const errors = [];
  let labs = 0;
  let items = 0;
  let rules = 0;
  for (const lesson of lessons) {
    for (const atom of lesson.atoms) {
      const lab = atom.deskLab;
      if (!lab) continue;
      labs += 1;
      const at = `${atom.id}`;
      if (!DESK_APPS[lab.app]) errors.push(`${at}: desk app "${lab.app}" is not one of ${Object.keys(DESK_APPS).join(", ")}`);
      if (!lab.task) errors.push(`${at}: a desk needs a task`);
      if (!lab.fields?.length || !lab.items?.length || !lab.solution) {
        errors.push(`${at}: a desk needs fields, items and a solution`);
        continue;
      }
      const keys = new Set();
      for (const f of lab.fields) {
        if (!f.key || !f.label || !["select", "text", "time"].includes(f.type)) errors.push(`${at}: field ${f.key || "?"} needs a key, a label and a type (select, text or time)`);
        if (keys.has(f.key)) errors.push(`${at}: duplicate field ${f.key}`);
        keys.add(f.key);
        if (f.type === "select" && !f.options?.length && !lab.items.every((i) => i.options?.[f.key]?.length)) errors.push(`${at}: select field ${f.key} has no options`);
      }
      const ids = new Set();
      for (const item of lab.items) {
        items += 1;
        if (!item.id || !item.title) errors.push(`${at}: every item needs an id and a title`);
        if (ids.has(item.id)) errors.push(`${at}: duplicate item ${item.id}`);
        ids.add(item.id);
        if (!item.expect && !item.check) errors.push(`${at}: item ${item.id} is not graded (no expect, no check)`);
        const shown = item.only ? lab.fields.filter((f) => item.only.includes(f.key)) : lab.fields;
        for (const [key, accepted] of Object.entries(item.expect || {})) {
          const field = lab.fields.find((f) => f.key === key);
          if (!field) { errors.push(`${at}: item ${item.id} expects unknown field ${key}`); continue; }
          if (!shown.includes(field)) errors.push(`${at}: item ${item.id} expects ${key}, which it does not show`);
          if (field.type === "select") {
            const opts = item.options?.[key] || field.options || [];
            for (const a of [].concat(accepted)) if (!opts.includes(a)) errors.push(`${at}: item ${item.id} expects "${a}" for ${key}, which is not an option`);
          }
        }
        const sol = lab.solution[item.id];
        if (!sol) { errors.push(`${at}: the solution has no values for item ${item.id}`); continue; }
        for (const f of shown) {
          if (String(sol[f.key] ?? "").trim() === "") errors.push(`${at}: the solution leaves ${item.id}.${f.key} empty`);
          if (f.type === "select" && sol[f.key] && !(item.options?.[f.key] || f.options || []).includes(sol[f.key])) {
            errors.push(`${at}: the solution's ${item.id}.${f.key} "${sol[f.key]}" is not an option`);
          }
        }
        if (lab.app === "calendar" && item.check?.includes("slot") && !item.duration) errors.push(`${at}: calendar item ${item.id} has no duration`);
      }
      for (const r of lab.rules || []) {
        rules += 1;
        if (!r.label || !r.check || !r.fail) errors.push(`${at}: every rule needs a label, a check and a fail message`);
      }
      if (lab.app === "calendar" && !lab.calendar?.days?.length) errors.push(`${at}: a calendar desk needs calendar.days`);

      const model = runDesk(lab, lab.solution);
      for (const i of model.items) {
        if (i.error) errors.push(`${at}: item ${i.id}'s check throws on the solution: ${i.error}`);
        else if (!i.ok) errors.push(`${at}: the solution gets item ${i.id} wrong (${i.wrong.join(", ")})`);
      }
      for (const r of model.rules) {
        if (r.error) errors.push(`${at}: rule "${r.label}" throws on the solution: ${r.error}`);
        else if (!r.passed) errors.push(`${at}: the solution fails rule "${r.label}"`);
      }
      const start = runDesk(lab, emptyValues(lab));
      if (start.passed) errors.push(`${at}: the untouched desk already passes`);
      for (const r of start.rules) if (r.error) errors.push(`${at}: rule "${r.label}" throws on an empty desk: ${r.error}`);
      for (const i of start.items) if (i.error) errors.push(`${at}: item ${i.id}'s check throws on an empty desk: ${i.error}`);
    }
  }
  return { errors, stats: { labs, items, rules } };
}
