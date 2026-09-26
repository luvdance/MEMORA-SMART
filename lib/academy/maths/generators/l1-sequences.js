import { item, trap, num, list, expr, byTier } from "./kit.js";

/**
 * GENERATORS · LEVEL 1 · PATTERNS AND SEQUENCES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-A3.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The nth term is where the marks are and there is exactly one misconception
 * behind nearly every wrong answer: using the FIRST TERM as the constant
 * instead of the term before the first.
 *
 * For 5, 8, 11, 14 the rule is 3n + 2. Students write 3n + 5, because 5 is the
 * number they can see. The trap says why 2 is the right constant: at n = 1 the
 * 3n part is already 3, so only 2 more is needed to reach 5. That is a check
 * the student can run themselves on any answer they produce, which is worth
 * more than the rule.
 *
 * The other trap is confusing the two kinds of rule. Term-to-term says what to
 * do to one term to get the next, and it cannot answer "what is the 100th
 * term" without working through all 99 before it. Position-to-term can, and
 * that is the whole reason it is taught.
 */

export const generators = {};

const ORDINALS = { 1: "1st", 2: "2nd", 3: "3rd" };
const ordinal = (n) => ORDINALS[n] || `${n}th`;

/* ═══════════════════════════════════════════════════════════════════════
   L1-A3.1 · CONTINUING A SEQUENCE
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-A3.1"] = (r, tier) => {
  const kind = r.pick(
    byTier(tier, {
      build: ["add", "add", "subtract"],
      stretch: ["add", "subtract", "multiply"],
      exam: ["multiply", "subtract", "add"],
    })
  );

  if (kind === "multiply") {
    const start = r.pick([1, 2, 3, 5]);
    const factor = r.pick([2, 3]);
    const terms = [start];
    for (let i = 1; i < 5; i += 1) terms.push(terms[i - 1] * factor);
    const next = terms[4] * factor;
    const shown = terms.slice(0, 4);
    const diff = shown[1] - shown[0];

    return item({
      skill: "Continuing a multiplying sequence",
      prompt: `Write down the next two terms of this sequence.\n\n${shown.join(", ")}, ...`,
      input: list({ placeholder: "e.g. 20, 25" }),
      answer: `${terms[4]}, ${next}`,
      ordered: true,
      hints: [
        "Check the gaps between the terms first. If the gaps are not equal, the rule is not an addition.",
        `Try dividing each term by the one before it. ${shown[1]} ÷ ${shown[0]} and ${shown[2]} ÷ ${shown[1]}.`,
        `Each term is ${factor} times the one before it. So the next is ${shown[3]} × ${factor}.`,
      ],
      solution: [
        `The gaps are not equal, so this is not an adding sequence.`,
        `${shown[1]} ÷ ${shown[0]} = ${factor}, and ${shown[2]} ÷ ${shown[1]} = ${factor}.`,
        `The rule is: multiply by ${factor}.`,
        `Next: ${shown[3]} × ${factor} = ${terms[4]}, then ${terms[4]} × ${factor} = ${next}`,
      ],
      traps: [
        trap(
          "assumed-adding",
          `${shown[3] + diff}, ${shown[3] + 2 * diff}`,
          `You added the first gap of ${diff} each time. Check the other gaps before assuming: here they are ${shown[1] - shown[0]}, ${shown[2] - shown[1]} and ${shown[3] - shown[2]}, which are not equal. When the gaps grow, look for a multiplying rule instead.`,
          "L1-A3.1"
        ),
        trap("one-term-only", String(terms[4]), `That is the next term, and the question asked for two. Apply the rule once more.`, "L1-A3.1"),
      ],
    });
  }

  const step = r.int(...byTier(tier, { build: [2, 7], stretch: [3, 12], exam: [4, 15] }));
  const signed = kind === "subtract" ? -step : step;
  const start = kind === "subtract" ? r.int(40, 90) : r.int(1, 12);
  const terms = [start];
  for (let i = 1; i < 6; i += 1) terms.push(terms[i - 1] + signed);
  const shown = terms.slice(0, 4);

  return item({
    skill: "Continuing a sequence with a constant difference",
    prompt: `Write down the next two terms of this sequence.\n\n${shown.join(", ")}, ...`,
    input: list({ placeholder: "e.g. 20, 25" }),
    answer: `${terms[4]}, ${terms[5]}`,
    ordered: true,
    hints: [
      "Find the gap between each pair of terms. If every gap is the same, that gap is the rule.",
      `${shown[1]} − ${shown[0]} = ${signed}. Check that the other gaps agree.`,
      `The rule is: ${kind === "subtract" ? `subtract ${step}` : `add ${step}`} each time.`,
    ],
    solution: [
      `Gaps: ${shown[1]} − ${shown[0]} = ${signed}, and the same each time.`,
      `Rule: ${kind === "subtract" ? `subtract ${step}` : `add ${step}`}.`,
      `Next: ${shown[3]} ${signed < 0 ? "−" : "+"} ${step} = ${terms[4]}`,
      `Then: ${terms[4]} ${signed < 0 ? "−" : "+"} ${step} = ${terms[5]}`,
    ],
    traps: [
      trap(
        "wrong-direction",
        `${shown[3] - signed}, ${shown[3] - 2 * signed}`,
        `You went the wrong way along the sequence. The terms are ${kind === "subtract" ? "getting smaller" : "getting larger"}, so the next ones must ${kind === "subtract" ? "continue downwards" : "continue upwards"}. Check your answer against the direction the run is already travelling.`,
        "L1-A3.1"
      ),
      trap("one-term-only", String(terms[4]), `That is the next term. The question asked for two, so apply the rule once more.`, "L1-A3.1"),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-A3.2 · TERM-TO-TERM RULES
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-A3.2"] = (r, tier) => {
  const step = r.int(...byTier(tier, { build: [2, 8], stretch: [3, 11], exam: [4, 14] }));
  const start = r.int(...byTier(tier, { build: [1, 9], stretch: [2, 15], exam: [3, 20] }));
  const wanted = r.int(...byTier(tier, { build: [6, 8], stretch: [8, 11], exam: [10, 14] }));

  const terms = [start];
  for (let i = 1; i < wanted; i += 1) terms.push(terms[i - 1] + step);
  const shown = terms.slice(0, 4);
  const answer = terms[wanted - 1];

  return item({
    skill: "Using a term-to-term rule",
    prompt: `A sequence starts ${shown.join(", ")} and continues with the same rule.\n\nWhat is the ${ordinal(wanted)} term?`,
    input: num(),
    answer: String(answer),
    hints: [
      `The rule is add ${step} each time. You want the ${ordinal(wanted)} term, and you have the ${ordinal(4)}.`,
      `From the 4th term to the ${ordinal(wanted)} is ${wanted - 4} more steps, not ${wanted} steps.`,
      `${shown[3]} + ${wanted - 4} × ${step}`,
    ],
    solution: [
      `Rule: add ${step} each time.`,
      `The 4th term is ${shown[3]}.`,
      `From the 4th to the ${ordinal(wanted)} is ${wanted - 4} steps of ${step}: ${wanted - 4} × ${step} = ${(wanted - 4) * step}`,
      `${shown[3]} + ${(wanted - 4) * step} = ${answer}`,
    ],
    traps: [
      trap(
        "off-by-one-step",
        String(answer + step),
        `One step too many. Count the GAPS rather than the terms: from the 1st term to the ${ordinal(wanted)} there are ${wanted - 1} gaps, not ${wanted}. This off-by-one is the commonest slip in the whole topic, and it is why the nth term rule is worth having.`,
        "L1-A3.2"
      ),
      trap(
        "counted-from-scratch",
        String(start + wanted * step),
        `You added ${step} a full ${wanted} times starting from ${start}. The first term is already there before any step is taken, so reaching the ${ordinal(wanted)} term takes ${wanted - 1} steps.`,
        "L1-A3.2"
      ),
    ],
    scaffold: [
      { ask: `What is added each time?`, answer: String(step), input: num() },
      { ask: `How many steps from the 1st term to the ${ordinal(wanted)}?`, answer: String(wanted - 1), input: num() },
      { ask: `So what is the ${ordinal(wanted)} term?`, answer: String(answer), input: num() },
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-A3.3 · THE NTH TERM OF A LINEAR SEQUENCE
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-A3.3"] = (r, tier) => {
  const d = r.int(...byTier(tier, { build: [2, 6], stretch: [2, 9], exam: [3, 12] }));
  const first = r.int(...byTier(tier, { build: [1, 12], stretch: [2, 20], exam: [1, 30] }));
  const c = first - d; // the zeroth term, which is the constant
  const terms = [first, first + d, first + 2 * d, first + 3 * d];

  const cText = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
  const answer = `${d}n${cText}`;

  return item({
    skill: "Finding the nth term of a linear sequence",
    prompt: `Find the nth term of this sequence.\n\n${terms.join(", ")}, ...`,
    input: expr({ placeholder: "e.g. 3n + 2" }),
    answer,
    accept: [answer.replace(/\s/g, ""), `${d}*n${cText}`.replace(/\s/g, "")],
    hints: [
      "Find the common difference first. That number is what multiplies n.",
      `The difference is ${d}, so the rule starts ${d}n. Now work out what has to be added or taken away.`,
      `At n = 1, ${d}n gives ${d}. The first term is ${first}, so the constant is ${first} − ${d} = ${c}.`,
    ],
    solution: [
      `Common difference: ${d}, so the rule contains ${d}n.`,
      `Test n = 1: ${d}n gives ${d}, but the first term is ${first}.`,
      `The gap is ${first} − ${d} = ${c}, so that is the constant.`,
      `nth term = ${answer}`,
      `Check with n = 4: ${d} × 4 ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${terms[3]}, which matches the 4th term.`,
    ],
    traps: [
      trap(
        "used-first-term-as-constant",
        `${d}n + ${first}`,
        `You used the first term, ${first}, as the constant. Test it: at n = 1 that gives ${d + first}, and the sequence starts at ${first}. The constant has to be the number BEFORE the first term, which is ${first} − ${d} = ${c}, because ${d}n has already contributed ${d} by the time n reaches 1. Always test your rule at n = 1.`,
        "L1-A3.3"
      ),
      trap(
        "difference-only",
        `${d}n`,
        `The ${d}n part is right and it is not finished unless the constant is zero. At n = 1 this gives ${d}, and the sequence starts at ${first}, so there is still ${c} to account for.`,
        "L1-A3.3"
      ),
      trap(
        "first-term-times-n",
        `${first}n${c === 0 ? "" : c > 0 ? ` + ${d}` : ` − ${Math.abs(d)}`}`,
        `The number multiplying n is the common DIFFERENCE, ${d}, not the first term. The difference is what the sequence goes up by for each step along it, and n counts the steps.`,
        "L1-A3.3"
      ),
    ],
    scaffold: [
      { ask: `What is the common difference of the sequence?`, answer: String(d), input: num() },
      { ask: `So what does n multiply by? Type the number.`, answer: String(d), input: num() },
      { ask: `At n = 1, ${d}n gives ${d}. The first term is ${first}. What must be added?`, answer: String(c), input: num() },
      { ask: `Write the nth term.`, answer, input: expr(), accept: [answer.replace(/\s/g, "")] },
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-A3.4 · SPECIAL SEQUENCES
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-A3.4"] = (r, tier) => {
  const kind = r.pick(
    byTier(tier, {
      build: ["square", "square", "triangular"],
      stretch: ["square", "cube", "triangular"],
      exam: ["triangular", "cube", "square"],
    })
  );

  const start = r.int(1, byTier(tier, { build: 3, stretch: 5, exam: 7 }));
  const build = (n) =>
    kind === "square" ? n * n : kind === "cube" ? n * n * n : (n * (n + 1)) / 2;

  const shown = [start, start + 1, start + 2, start + 3].map(build);
  const nextN = start + 4;
  const answer = build(nextN);

  const names = {
    square: "square numbers",
    cube: "cube numbers",
    triangular: "triangular numbers",
  };
  const how = {
    square: `each one is a whole number multiplied by itself: ${nextN} × ${nextN}`,
    cube: `each one is a whole number multiplied by itself three times: ${nextN} × ${nextN} × ${nextN}`,
    triangular: `each one adds the next whole number to the one before: the gaps grow by 1 each time`,
  };
  const diffs = [shown[1] - shown[0], shown[2] - shown[1], shown[3] - shown[2]];

  return item({
    skill: `Recognising ${names[kind]}`,
    prompt: `This sequence is made of ${names[kind]}.\n\n${shown.join(", ")}, ...\n\nWhat is the next term?`,
    input: num(),
    answer: String(answer),
    hints: [
      `The gaps between the terms are ${diffs.join(", ")}, which are not equal, so there is no single number being added.`,
      `These are ${names[kind]}, so ${how[kind]}.`,
      kind === "triangular"
        ? `The last gap was ${diffs[2]}, so the next gap is ${diffs[2] + 1}: ${shown[3]} + ${diffs[2] + 1}.`
        : `The next one is built from ${nextN}.`,
    ],
    solution:
      kind === "triangular"
        ? [
            `The gaps are ${diffs.join(", ")}, each one bigger than the last by 1.`,
            `So the next gap is ${diffs[2] + 1}.`,
            `${shown[3]} + ${diffs[2] + 1} = ${answer}`,
          ]
        : [
            `These are ${names[kind]} built from ${start}, ${start + 1}, ${start + 2}, ${start + 3}.`,
            `The next is built from ${nextN}.`,
            kind === "square"
              ? `${nextN} × ${nextN} = ${answer}`
              : `${nextN} × ${nextN} × ${nextN} = ${answer}`,
          ],
    traps: [
      trap(
        "assumed-constant-difference",
        String(shown[3] + diffs[2]),
        `You added the last gap of ${diffs[2]} again. In this sequence the gaps are ${diffs.join(", ")}, which are growing, so there is no constant difference to add. Check the gaps against each other before assuming a linear rule.`,
        "L1-A3.4"
      ),
      trap(
        "used-the-position",
        String(nextN),
        `That is the number the next term is BUILT from, not the term itself. ${how[kind]}.`,
        "L1-A3.4"
      ),
    ],
  });
};

export default generators;
