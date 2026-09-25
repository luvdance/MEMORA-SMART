import { item, trap, num, expr, byTier } from "./kit.js";
import { naira, NAMES, GOODS, grouped } from "../rng.js";

/**
 * GENERATORS · LEVEL 1 · FIRST ALGEBRA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-A1 and L1-A2.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Algebraic answers are marked by EVALUATION, not by string comparison: the
 * checker substitutes several awkward values into what the student typed and
 * into the expected answer and compares the results. So 2(x+3), 2x+6 and
 * 6+2x are all accepted, which is correct — they are the same expression —
 * while 2x+5 is rejected at the first substitution.
 *
 * The exception is when the FORM is the skill. "Factorise" items set
 * `exact: "factorised"`, because an answer that is merely equal to the right
 * one has not done the thing that was asked.
 */

export const generators = {};

/* ═══════════════════════════════════════════════════════════════════════
   L1-A1 · ALGEBRAIC EXPRESSIONS
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-A1.1"] = (r, tier) => {
  const coefficient = r.int(2, byTier(tier, { build: 9, stretch: 15, exam: 24 }));
  const constant = r.int(2, byTier(tier, { build: 12, stretch: 30, exam: 60 }));
  const sign = r.chance(0.7) ? "+" : "−";
  const expression = `${coefficient}x ${sign} ${constant}`;

  const ask = r.pick(["coefficient", "terms", "constant"]);

  const spec = {
    coefficient: {
      prompt: `In the expression ${expression}, what is the COEFFICIENT of x?`,
      input: num(),
      answer: coefficient,
      hints: [
        "The coefficient is the number multiplying the letter.",
        "It does not include the letter itself, and it is not the number on its own at the end.",
        `Look at what is attached to the x.`,
      ],
      solution: [`${coefficient}x means ${coefficient} × x, so the coefficient of x is ${coefficient}.`],
      traps: [
        trap("gave-constant", sign === "+" ? constant : -constant, `That is the CONSTANT — the number standing on its own. The coefficient is the number attached to the letter.`),
      ],
    },
    constant: {
      prompt: `In the expression ${expression}, what is the CONSTANT term?`,
      input: num(),
      answer: sign === "+" ? constant : -constant,
      hints: [
        "The constant is the term with no letter in it.",
        "Its sign belongs to it.",
        `The sign in front of ${constant} is ${sign}.`,
      ],
      solution: [
        `The term with no letter is ${sign === "+" ? "" : "−"}${constant}.`,
        "It is called constant because it does not change when x changes.",
      ],
      traps: [
        trap("gave-coefficient", coefficient, "That is the coefficient of x. The constant is the term standing on its own, with no letter."),
        trap("dropped-sign", sign === "+" ? -constant : constant, "Right number, wrong sign. The sign in front of a term is part of the term."),
      ],
    },
    terms: {
      prompt: `How many TERMS are there in the expression ${coefficient}x ${sign} ${constant}y + ${r.int(2, 9)}?`,
      input: num(),
      answer: 3,
      hints: [
        "Terms are separated by + and − signs.",
        "Count the pieces, not the letters and not the numbers.",
        "Each piece between the signs is one term.",
      ],
      solution: [
        "Terms are the pieces separated by + and − signs.",
        `Here: ${coefficient}x, then the y term, then the number. That is 3 terms.`,
      ],
      traps: [trap("counted-symbols", 2, "Count the pieces BETWEEN the signs, not the signs themselves.")],
    },
  }[ask];

  return item({ skill: "Reading the parts of an algebraic expression", ...spec });
};

generators["L1-A1.2"] = (r, tier) => {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  const d = r.int(2, 9);

  if (tier === "build") {
    const answer = `${a + b}x`;
    return item({
      skill: "Collecting like terms",
      prompt: `Simplify:   ${a}x + ${b}x`,
      input: expr(),
      answer,
      hints: [
        "These are LIKE terms — both are lots of x — so they can be combined.",
        `${a} lots of x plus ${b} lots of x.`,
        `${a} + ${b} = ${a + b}, and they are still x's.`,
      ],
      solution: [`${a}x + ${b}x = (${a} + ${b})x = ${a + b}x`, "Think of x as a thing: 3 mangoes plus 4 mangoes is 7 mangoes, not 7 mangoes squared."],
      traps: [
        trap("multiplied", `${a * b}x`, `You multiplied the coefficients. Adding ${a}x and ${b}x means counting them: ${a} of something plus ${b} of it is ${a + b} of it.`),
        trap("squared-the-letter", `${a + b}x^2`, "The coefficients add but the letter does not change. 3x + 4x is 7x, not 7x². You only get x² by MULTIPLYING x by x."),
      ],
    });
  }

  const displayed = `${a}x + ${b} − ${c}x + ${d}`;
  const xPart = a - c;

  return item({
    skill: "Collecting like terms with negatives and two different kinds of term",
    prompt: `Simplify:   ${displayed}`,
    input: expr(),
    answer: `${xPart}x + ${b + d}`,
    hints: [
      "Sort the terms into two groups: the x terms, and the plain numbers.",
      "The sign in FRONT of a term travels with it.",
      `x terms: ${a}x − ${c}x. Numbers: ${b} + ${d}.`,
    ],
    solution: [
      `x terms:  ${a}x − ${c}x = ${xPart}x`,
      `Numbers:  ${b} + ${d} = ${b + d}`,
      `So the expression is ${xPart}x + ${b + d}.`,
      "The two groups cannot be combined any further: an x term and a plain number are not like terms.",
    ],
    traps: [
      trap(
        "combined-unlike",
        `${xPart + b + d}x`,
        `You combined the x terms with the plain numbers. ${xPart}x and ${b + d} are NOT like terms — one of them depends on x and the other does not, so they cannot be added into a single term any more than 3 metres and 4 kilograms can.`
      ),
      trap(
        "sign-slipped",
        `${a + c}x + ${b + d}`,
        `You added ${c}x instead of subtracting it. The minus sign in front of ${c}x belongs to that term and has to travel with it when you gather the x's together.`,
        "L1-N6.2"
      ),
    ],
  });
};

generators["L1-A1.3"] = (r, tier) => {
  const a = r.int(2, 9);
  const b = r.intExcept(-12, 12, [0]);
  const x = byTier(tier, { build: r.int(2, 9), stretch: r.intExcept(-9, 9, [0, 1]), exam: r.intExcept(-12, 12, [0, 1]) });
  const squared = tier === "exam";

  const answer = squared ? a * x * x + b : a * x + b;
  const shown = squared ? `${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;

  return item({
    skill: "Substituting a value, including a negative one",
    prompt: `Find the value of ${shown} when x = ${x}.`,
    input: num(),
    answer,
    hints: [
      `Replace every x with ${x}. Put it in BRACKETS when it is negative.`,
      squared ? `${a}(${x})² ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : `${a}(${x}) ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
      squared ? `(${x})² = ${x * x} first, then multiply by ${a}.` : `${a} × ${x} first, then ${b < 0 ? "subtract" : "add"} ${Math.abs(b)}.`,
    ],
    solution: squared
      ? [
          `${a}x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}, with x = ${x}`,
          `= ${a}(${x})² ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
          `= ${a} × ${x * x} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
          `= ${a * x * x} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${answer}`,
        ]
      : [
          `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}, with x = ${x}`,
          `= ${a} × ${x} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
          `= ${a * x} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${answer}`,
        ],
    traps: [
      squared
        ? trap(
            "squared-the-coefficient",
            Math.pow(a * x, 2) + b,
            `You squared ${a}x as a whole. In ${a}x² only the x is squared — the ² sits on the x, not on the ${a}. If the whole thing were squared it would be written (${a}x)².`
          )
        : trap("wrote-digits-together", Number(`${a}${Math.abs(x)}`) + b, `${a}x means ${a} MULTIPLIED by x, not the digits written side by side.`),
      x < 0
        ? trap(
            "dropped-negative",
            squared ? a * x * x + b : a * Math.abs(x) + b,
            `You substituted ${Math.abs(x)} instead of ${x}. When the value is negative, put it in brackets as you write it in — that is what stops the sign getting lost.`,
            "L1-N6.3"
          )
        : trap("order-of-operations", (a + b) * x, `You added before multiplying. ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} means ${a} times x FIRST, then ${b < 0 ? "subtract" : "add"} ${Math.abs(b)}.`, "L0-N2.4"),
    ],
  });
};

generators["L1-A1.4"] = (r, tier) => {
  const who = r.pick(NAMES);
  const good = r.pick(GOODS);
  const price = r.int(2, 9) * 50;
  const extra = r.int(2, 9) * 100;

  const shapes = [
    {
      prompt: `${who} buys n ${good.name} at ${naira(price)} each, and also pays ${naira(extra)} for transport.\n\nWrite an expression for the TOTAL cost in naira.`,
      answer: `${price}n + ${extra}`,
      hints: [
        "Cost of the goods first: how much for n of them?",
        `One costs ${naira(price)}, so n of them cost ${price} × n.`,
        `Then the transport is a fixed ${extra}, added once however many are bought.`,
      ],
      solution: [
        `n ${good.name} at ${naira(price)} each: ${price}n`,
        `Transport, once: + ${extra}`,
        `Total: ${price}n + ${extra}`,
      ],
      traps: [
        trap("multiplied-the-fixed-cost", `${price}n + ${extra}n`, `The transport is paid ONCE, not once per item, so it does not get an n attached to it. Only the quantity that changes with n is multiplied by n.`),
        trap("added-the-price", `${price + extra}n`, `That charges ${naira(price + extra)} for every single item. The transport is a one-off, so it stays on its own.`),
      ],
    },
    {
      prompt: `${who} is x years old. ${r.pick(NAMES)} is ${r.int(3, 12)} years older.\n\nWrite an expression for their COMBINED age.`,
      answer: null, // filled below
      hints: [],
      solution: [],
      traps: [],
    },
  ];

  // The age version needs its numbers inside the closure, so it is built here.
  const gap = r.int(3, 12);
  shapes[1].answer = `2x + ${gap}`;
  shapes[1].hints = [
    `If ${who} is x, how old is the other person?`,
    `${gap} years older means x + ${gap}.`,
    `Now add the two ages together: x + (x + ${gap}).`,
  ];
  shapes[1].solution = [
    `${who}: x`,
    `The other person: x + ${gap}`,
    `Combined: x + x + ${gap} = 2x + ${gap}`,
  ];
  shapes[1].traps = [
    trap("used-two-letters", `x + ${gap}`, `That is the other person's age on its own. The question asks for the two ages COMBINED, so add ${who}'s x as well.`),
    trap("multiplied-the-gap", `2x + ${2 * gap}`, `The ${gap}-year gap is counted once, not twice. Only one of the two people has the extra ${gap} years.`),
  ];

  const shape = tier === "build" ? shapes[0] : r.pick(shapes);

  return item({
    skill: "Turning a worded statement into an expression",
    prompt: shape.prompt,
    input: expr({ placeholder: "e.g. 5n + 200" }),
    answer: shape.answer,
    hints: shape.hints,
    solution: shape.solution,
    traps: shape.traps,
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-A2 · SIMPLE EQUATIONS
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-A2.1"] = (r, tier) => {
  const op = r.pick(["add", "subtract", "multiply", "divide"]);
  // Exam tier allows a negative solution, which is where students who have
  // learned "solve" as a sequence of moves rather than as balancing come
  // unstuck for the first time.
  const x = byTier(tier, { build: r.int(2, 12), stretch: r.int(2, 30), exam: r.intExcept(-15, 30, [0]) });
  const k = r.int(2, byTier(tier, { build: 9, stretch: 12, exam: 15 }));

  const forms = {
    add: { shown: `x + ${k} = ${x + k}`, undo: `subtract ${k} from both sides`, step: `x = ${x + k} − ${k}` },
    subtract: { shown: `x − ${k} = ${x - k}`, undo: `add ${k} to both sides`, step: `x = ${x - k} + ${k}` },
    multiply: { shown: `${k}x = ${k * x}`, undo: `divide both sides by ${k}`, step: `x = ${k * x} ÷ ${k}` },
    divide: { shown: `x/${k} = ${x}`, undo: `multiply both sides by ${k}`, step: `x = ${x} × ${k}` },
  }[op];

  return item({
    skill: "Solving a one-step equation by balancing",
    prompt: `Solve for x:   ${forms.shown}`,
    input: num(),
    answer: x,
    hints: [
      "An equation is a balance. Whatever you do to one side, do to the other.",
      `To get x on its own you need to undo the ${op === "add" ? "+" : op === "subtract" ? "−" : op === "multiply" ? "×" : "÷"}.`,
      `So ${forms.undo}.`,
    ],
    solution: [forms.shown, forms.undo, forms.step, `x = ${x}`, `Check: put ${x} back in. ${forms.shown.replace(/x/g, `(${x})`)} — both sides agree.`],
    traps: [
      trap(
        "same-operation",
        op === "add" ? x + 2 * k : op === "subtract" ? x - 2 * k : op === "multiply" ? k * k * x : x / k,
        `You did the SAME operation as the one in the equation instead of the opposite one. To undo a ${op === "add" ? "+" : op === "subtract" ? "−" : op === "multiply" ? "×" : "÷"} you use its inverse.`
      ),
      trap("one-side-only", op === "add" ? x + k : op === "subtract" ? x - k : op === "multiply" ? k * x : x, "You changed one side and left the other as it was. That breaks the balance — both sides must get the same treatment."),
    ],
  });
};

generators["L1-A2.2"] = (r, tier) => {
  const a = r.int(2, 9);
  const x = byTier(tier, { build: r.int(2, 12), stretch: r.int(2, 20), exam: r.int(-9, 15) });
  const b = r.intExcept(-20, 20, [0]);
  const rhs = a * x + b;

  return item({
    skill: "Solving a two-step equation in the right order",
    prompt: `Solve for x:   ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${rhs}`,
    input: num(),
    answer: x,
    hints: [
      "Two operations have been done to x. Undo them in the REVERSE order.",
      `x was multiplied by ${a} and then ${b < 0 ? "had " + Math.abs(b) + " subtracted" : Math.abs(b) + " was added"}. So undo the ${b < 0 ? "subtraction" : "addition"} first.`,
      `${b < 0 ? "Add" : "Subtract"} ${Math.abs(b)} on both sides, then divide by ${a}.`,
    ],
    solution: [
      `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${rhs}`,
      `${b < 0 ? "Add" : "Subtract"} ${Math.abs(b)} from both sides:   ${a}x = ${a * x}`,
      `Divide both sides by ${a}:   x = ${x}`,
      `Check: ${a}(${x}) ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${rhs}. Correct.`,
    ],
    traps: [
      trap(
        "divided-first",
        Number(((rhs / a - b)).toFixed(4)),
        `You divided by ${a} before dealing with the ${b < 0 ? "−" : "+"} ${Math.abs(b)}. Dividing the whole equation by ${a} divides the ${Math.abs(b)} as well, and it is easy to forget that. Undo the adding or subtracting first — it is the last thing that was done to x, so it is the first thing to come off.`
      ),
      trap("wrong-inverse", Number(((rhs + b) / a).toFixed(4)), `You ${b < 0 ? "subtracted" : "added"} ${Math.abs(b)} when you needed to do the opposite. To undo ${b < 0 ? "a subtraction, add" : "an addition, subtract"}.`),
    ],
    scaffold: [
      { prompt: `Step 1. ${b < 0 ? "Add" : "Subtract"} ${Math.abs(b)} on both sides. What does the right-hand side become?`, input: num(), answer: a * x, hint: `${rhs} ${b < 0 ? "+" : "−"} ${Math.abs(b)}` },
      { prompt: `Step 2. The equation is now ${a}x = ${a * x}. Divide both sides by ${a}. What is x?`, input: num(), answer: x, hint: `${a * x} ÷ ${a}` },
    ],
  });
};

generators["L1-A2.3"] = (r, tier) => {
  const who = r.pick(NAMES);
  const other = r.pick(NAMES.filter((n) => n !== who));
  // Money first: it is the most concrete of the three. Consecutive integers
  // are the hardest, because nothing in the wording names the unknown for you.
  const kind = byTier(tier, {
    build: r.pick(["money", "ages"]),
    stretch: r.pick(["ages", "money", "consecutive"]),
    exam: r.pick(["consecutive", "ages"]),
  });

  if (kind === "consecutive") {
    const count = r.pick([3, 4]);
    const first = r.int(8, 60);
    const total = Array.from({ length: count }, (_, i) => first + i).reduce((s, v) => s + v, 0);
    return item({
      skill: "Forming an equation from a worded problem",
      prompt: `${count} consecutive whole numbers add up to ${total}.\n\nWhat is the SMALLEST of them?`,
      input: num(),
      answer: first,
      hints: [
        "Call the smallest one x. What are the others, in terms of x?",
        `They are x, x + 1, x + 2${count === 4 ? ", x + 3" : ""}.`,
        `Add them: ${count}x + ${(count * (count - 1)) / 2} = ${total}. Now solve.`,
      ],
      solution: [
        `Let the smallest be x. The numbers are x, x + 1, x + 2${count === 4 ? ", x + 3" : ""}.`,
        `Sum: ${count}x + ${(count * (count - 1)) / 2} = ${total}`,
        `${count}x = ${total - (count * (count - 1)) / 2}`,
        `x = ${first}`,
        `Check: ${Array.from({ length: count }, (_, i) => first + i).join(" + ")} = ${total}`,
      ],
      traps: [
        trap("divided-evenly", Math.round(total / count), `You divided the total by ${count}. That gives the AVERAGE, which is in the middle of the run rather than at the start of it. The smallest is below the average.`),
        trap("gave-largest", first + count - 1, "That is the LARGEST of the numbers. The question asked for the smallest."),
      ],
    });
  }

  if (kind === "ages") {
    const gap = r.int(4, 18);
    const younger = r.int(7, 40);
    const total = 2 * younger + gap;
    return item({
      skill: "Forming an equation from a worded problem",
      prompt: `${who} is ${gap} years older than ${other}. Together their ages add up to ${total}.\n\nHow old is ${other}?`,
      input: num({ placeholder: "years" }),
      answer: younger,
      hints: [
        `Call ${other}'s age x. Then what is ${who}'s age in terms of x?`,
        `${who} is x + ${gap}.`,
        `So x + (x + ${gap}) = ${total}. Solve for x.`,
      ],
      solution: [
        `Let ${other} be x years old.`,
        `${who} is x + ${gap}.`,
        `x + x + ${gap} = ${total}`,
        `2x = ${total - gap}`,
        `x = ${younger}`,
        `So ${other} is ${younger} and ${who} is ${younger + gap}. Check: ${younger} + ${younger + gap} = ${total}.`,
      ],
      traps: [
        trap("gave-older", younger + gap, `That is ${who}'s age. The question asked for ${other}'s.`),
        trap("halved-the-total", Math.round(total / 2), "You split the total in half. That would be right if they were the same age, but one is older, so the halves are not equal."),
        trap("subtracted-once", total - gap, `You took the gap off the total but did not then share what was left between the two of them. After removing the ${gap}-year gap, the remainder belongs to BOTH of them equally.`),
      ],
    });
  }

  const each = r.int(3, 12) * 50;
  const count = r.int(3, 14);
  const left = r.int(2, 30) * 50;
  const started = each * count + left;
  const good = r.pick(GOODS);

  return item({
    skill: "Forming an equation from a worded money problem",
    prompt: `${who} started with ${naira(started)}, bought some ${good.name} at ${naira(each)} each, and had ${naira(left)} left.\n\nHow many did ${who} buy?`,
    input: num(),
    answer: count,
    hints: [
      "Call the number bought n. What did they cost, in terms of n?",
      `${each}n was spent, and ${grouped(left)} was left, out of ${grouped(started)}.`,
      `So ${each}n + ${left} = ${started}. Solve for n.`,
    ],
    solution: [
      `Let n be the number bought.`,
      `Spent: ${each}n.  Equation: ${each}n + ${grouped(left)} = ${grouped(started)}`,
      `${each}n = ${grouped(started - left)}`,
      `n = ${count}`,
      `Check: ${count} × ${naira(each)} = ${naira(each * count)}, and ${naira(each * count)} + ${naira(left)} = ${naira(started)}.`,
    ],
    traps: [
      trap("forgot-the-remainder", Math.round(started / each), `You divided the whole ${naira(started)} by the price. But ${naira(left)} was never spent, so it has to come off the total before you divide.`),
      trap("gave-amount-spent", started - left, "That is how much MONEY was spent. The question asks how many items were bought — divide that amount by the price of one."),
    ],
    scaffold: [
      { prompt: `Step 1. How much money was actually SPENT?`, input: num(), answer: started - left, hint: `${grouped(started)} − ${grouped(left)}` },
      { prompt: `Step 2. Each one cost ${naira(each)}. How many were bought?`, input: num(), answer: count, hint: `${grouped(started - left)} ÷ ${each}` },
    ],
  });
};

export default generators;
