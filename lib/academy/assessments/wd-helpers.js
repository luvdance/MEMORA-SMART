/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT — SHARED HELPERS
 *
 * SERVER ONLY. Builds questions in exactly the shape the grader and the
 * content validator expect, from a compact definition:
 *
 *   q({ id, atom, d, prompt, options: [a, b, c, d], correct: "b",
 *       explanation, wrong: { a: "...", c: "...", d: "..." }, type })
 *
 * Options are lettered a, b, c, d in the order given; the grader shuffles them
 * per serve, so the order written here is never the order a learner sees.
 */

const LETTERS = ["a", "b", "c", "d", "e"];

export function q({ id, atom, d = 2, type = "mcq", prompt, options, correct, explanation, wrong }) {
  return {
    id,
    type,
    difficulty: d,
    atomId: atom,
    prompt,
    options: options.map((text, i) => ({ id: LETTERS[i], text })),
    correct,
    explanation,
    whyWrong: wrong,
  };
}

/** One lesson's check: a pass mark of 70 and its questions. */
export function check(lessonId, questions) {
  return { [lessonId]: { lessonId, passMark: 70, questions } };
}
