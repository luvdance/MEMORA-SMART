/**
 * MARKING FOR "WRITE THE MISSING C++" (codeFill)
 *
 * Kept out of the component so the self-test can run it in Node.
 *
 * Spacing between tokens is ignored: `x+1` and `x + 1` are the same code.
 * Runs of whitespace become one space, and a space next to punctuation
 * disappears, so words stay apart (`int x` is not `intx`). Everything else is
 * exact, because in C++ everything else matters: a missing semicolon does not
 * compile. Text inside string and character literals is compared exactly,
 * because a space inside quotes is printed.
 */

const LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;

export function normaliseFill(text) {
  const src = String(text ?? "").trim();
  const squash = (code) => code.replace(/\s+/g, " ").replace(/ ?([^\w\s]) ?/g, "$1");
  let out = "";
  let last = 0;
  for (const m of src.matchAll(LITERAL)) {
    out += squash(src.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  return (out + squash(src.slice(last))).trim();
}

/** True when `value` is one of the gap's accepted answers, spacing aside. */
export function fillIsCorrect(value, blank) {
  const got = normaliseFill(value);
  return got !== "" && blank.answers.some((a) => normaliseFill(a) === got);
}
