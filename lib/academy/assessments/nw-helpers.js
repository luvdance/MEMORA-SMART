/**
 * ASSESSMENT BUILDERS · COMPUTER NETWORKING
 *
 * SERVER ONLY. The builders produce the same plain question objects every
 * other bank holds; they exist so each question is written as
 * "the right answer and why, then each wrong answer and why".
 */

const IDS = ["a", "b", "c", "d"];

/** The correct option's position, spread across a..d by the question id. */
function slot(id) {
  let h = 7;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 4;
}

/**
 * q("nwq1-1", "a-nw-what-is-networking", 2, "Prompt?",
 *   ["Right answer", "Why it is right"],
 *   [["Wrong 1", "Why wrong"], ["Wrong 2", "Why wrong"], ["Wrong 3", "Why wrong"]])
 */
export function q(id, atomId, difficulty, prompt, [right, explanation], wrongs, type = "mcq") {
  const pos = slot(id);
  const rows = [...wrongs];
  rows.splice(pos, 0, [right]);
  const whyWrong = {};
  rows.forEach((row, i) => {
    if (i !== pos) whyWrong[IDS[i]] = row[1];
  });
  return {
    id,
    type,
    difficulty,
    atomId,
    prompt,
    options: rows.map((row, i) => ({ id: IDS[i], text: row[0] })),
    correct: IDS[pos],
    explanation,
    whyWrong,
  };
}

/** One lesson's check. */
export const check = (lessonId, questions) => ({ [lessonId]: { lessonId, passMark: 70, questions } });
