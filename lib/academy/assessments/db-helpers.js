/**
 * ASSESSMENTS · RELATIONAL DATABASES — HELPERS
 *
 * SERVER ONLY. Never import this from anything under src/.
 *
 * q() builds one question in the shape lib/academy/grade.js expects:
 *
 *   q("dbq3-1", "a-db-dbms", "Prompt?", ["right answer", "why it is right"],
 *     [["wrong", "why it is wrong"], …], { at: 2, difficulty: 2, type: "scenario" })
 *
 * `at` places the right answer among the options, so keys are spread over
 * a–d rather than always being the same letter.
 */

export function q(id, atomId, prompt, right, wrong, { at = 0, difficulty = 2, type = "mcq" } = {}) {
  const options = wrong.map(([text, why]) => ({ text, why, right: false }));
  options.splice(Math.min(at, options.length), 0, { text: right[0], why: right[1], right: true });
  const ids = "abcde";
  const whyWrong = {};
  let correct = "a";
  const built = options.map((o, i) => {
    if (o.right) correct = ids[i];
    else whyWrong[ids[i]] = o.why;
    return { id: ids[i], text: o.text };
  });
  return { id, type, difficulty, atomId, prompt, options: built, correct, explanation: right[1], whyWrong };
}

/** One lesson's bank. */
export function bank(lessonId, questions, passMark = 70) {
  return { [lessonId]: { lessonId, passMark, questions } };
}
