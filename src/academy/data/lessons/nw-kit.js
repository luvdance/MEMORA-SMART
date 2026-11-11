/**
 * COMPUTER NETWORKING — LESSON HELPERS
 *
 * CLIENT-SAFE. Builders that keep the lesson files readable. Each returns
 * plain data, so a built lesson is still JSON (the lesson chunks are
 * JSON.parse'd in the browser).
 *
 *   dec(scenario, question, [right, why], [[wrong, whyWrong], …], aftermath)
 *     A graded decision. The correct option's position is spread across
 *     a..d by a hash of the question, so position carries no signal.
 */

import { NW_CAPTURES, NW_TERMINALS } from "./nw-transcripts.js";

const IDS = ["a", "b", "c", "d", "e"];

function slot(text, n) {
  let h = 11;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % n;
}

export function dec(scenario, question, [right, why], wrongs, aftermath) {
  const pos = slot(question, wrongs.length + 1);
  const rows = wrongs.map(([text, whyWrong]) => ({ text, whyWrong }));
  rows.splice(pos, 0, { text: right, why });
  return {
    scenario,
    question,
    options: rows.map((r, i) => ({ id: IDS[i], ...r })),
    correct: IDS[pos],
    ...(aftermath ? { aftermath } : {}),
  };
}

export const PY = "python";
export const py = String.raw;


/**
 * term(id, extra) — a recorded terminal from nw-transcripts.js, with every
 * recorded command listed under it. `extra` adds goal, accept, near, hint…
 */
export function term(id, extra = {}) {
  // A missing recording yields an empty terminal, which the content check
  // (lib/academy/network/check.mjs) reports by atom; it never breaks a page.
  const t = NW_TERMINALS[id] || { prompt: "learner@ubuntu-lab:~$", commands: {} };
  return {
    prompt: t.prompt,
    intro: "This is a recording of a real Ubuntu Linux computer in our lab. Type a command and press Enter; each command shows the output it really produced.",
    commands: t.commands,
    available: Object.keys(t.commands),
    ...extra,
  };
}

/** cap(id) — a recorded packet capture from nw-transcripts.js. */
export function cap(id) {
  return NW_CAPTURES[id] || [];
}
