/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 4
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l13-arithmetic": {
    lessonId: "pp-l13-arithmetic",
    passMark: 70,
    questions: [
      {
        id: "ppq13-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-arith-ops",
        prompt: "print(12 / 4)\n\nWhat is printed?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "3.0" },
          { id: "c", text: "0" },
          { id: "d", text: "48" },
        ],
        correct: "b",
        explanation: "/ always gives a float in Python, even when the division is exact.",
        whyWrong: {
          a: "12 // 4 would give 3. A single / always returns a float.",
          c: "That would be 12 % 4, the remainder.",
          d: "That is 12 * 4.",
        },
      },
      {
        id: "ppq13-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-floor-mod",
        prompt: "print(29 // 6, 29 % 6)\n\nWhat is printed?",
        options: [
          { id: "a", text: "4 5" },
          { id: "b", text: "5 4" },
          { id: "c", text: "4.83 5" },
          { id: "d", text: "4 1" },
        ],
        correct: "a",
        explanation: "6 fits into 29 four whole times (24), leaving 5.",
        whyWrong: {
          b: "The order is floor division first, then remainder.",
          c: "// drops the fraction; it never gives 4.83.",
          d: "29 - 24 is 5, not 1.",
        },
      },
      {
        id: "ppq13-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-floor-mod",
        prompt: "Which expression is True exactly when n is odd?",
        options: [
          { id: "a", text: "n // 2 == 1" },
          { id: "b", text: "n % 2 == 1" },
          { id: "c", text: "n / 2 == 1" },
          { id: "d", text: "n ** 2 == 1" },
        ],
        correct: "b",
        explanation: "An odd number leaves a remainder of 1 when divided by 2.",
        whyWrong: {
          a: "n // 2 == 1 is only true for 2 and 3.",
          c: "n / 2 == 1 is only true for 2.",
          d: "n ** 2 == 1 is only true for 1 and -1.",
        },
      },
      {
        id: "ppq13-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-formulas",
        prompt: "Which Python expression matches the formula A = πr² with radius r?",
        options: [
          { id: "a", text: "3.14159 * r * 2" },
          { id: "b", text: "3.14159 * r ** 2" },
          { id: "c", text: "(3.14159 * r) ** 2" },
          { id: "d", text: "3.14159 ^ r ^ 2" },
        ],
        correct: "b",
        explanation: "** is power, and it happens before *, so only r is squared.",
        whyWrong: {
          a: "r * 2 doubles r instead of squaring it.",
          c: "The brackets square π as well as r.",
          d: "^ is not power in Python.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l14-compare-logic": {
    lessonId: "pp-l14-compare-logic",
    passMark: 70,
    questions: [
      {
        id: "ppq14-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-assignment-ops",
        prompt: "total = 10\ntotal *= 3\ntotal -= 5\nprint(total)\n\nWhat is printed?",
        options: [
          { id: "a", text: "25" },
          { id: "b", text: "8" },
          { id: "c", text: "15" },
          { id: "d", text: "30" },
        ],
        correct: "a",
        explanation: "10 * 3 = 30, then 30 - 5 = 25.",
        whyWrong: {
          b: "*= multiplies; it does not add.",
          c: "That would subtract before multiplying.",
          d: "total -= 5 runs after the multiplication.",
        },
      },
      {
        id: "ppq14-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-comparison",
        prompt: "What is the difference between = and == ?",
        options: [
          { id: "a", text: "None; they are interchangeable" },
          { id: "b", text: "= assigns a value; == asks whether two values are equal" },
          { id: "c", text: "== assigns; = compares" },
          { id: "d", text: "== is only for text" },
        ],
        correct: "b",
        explanation: "= is an instruction that attaches a name to a value. == is a question whose answer is True or False.",
        whyWrong: {
          a: "Using one for the other is a common bug, and often a SyntaxError.",
          c: "It is the other way round.",
          d: "== compares values of any type.",
        },
      },
      {
        id: "ppq14-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-logical",
        prompt: "score = 45\nprint(score >= 40 and score < 50)\n\nWhat is printed?",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
          { id: "c", text: "45" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "45 >= 40 is True and 45 < 50 is True, and True and True is True.",
        whyWrong: {
          b: "Both conditions are met.",
          c: "Comparisons produce bools, not the number.",
          d: "This is valid Python.",
        },
      },
      {
        id: "ppq14-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-logical",
        prompt: "is_weekend = False\nis_holiday = True\nprint(is_weekend or is_holiday, not is_holiday)\n\nWhat is printed?",
        options: [
          { id: "a", text: "True False" },
          { id: "b", text: "False True" },
          { id: "c", text: "True True" },
          { id: "d", text: "False False" },
        ],
        correct: "a",
        explanation: "or needs only one True, so the first is True. not True is False.",
        whyWrong: {
          b: "or is True when either side is True.",
          c: "not flips is_holiday from True to False.",
          d: "is_holiday is True, which makes the or True.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l15-precedence-strings": {
    lessonId: "pp-l15-precedence-strings",
    passMark: 70,
    questions: [
      {
        id: "ppq15-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-precedence",
        prompt: "print(8 - 2 * 3 + 1)\n\nWhat is printed?",
        options: [
          { id: "a", text: "19" },
          { id: "b", text: "3" },
          { id: "c", text: "1" },
          { id: "d", text: "12" },
        ],
        correct: "b",
        explanation: "2 * 3 first is 6, then left to right: 8 - 6 = 2, 2 + 1 = 3.",
        whyWrong: {
          a: "That is (8 - 2) * 3 + 1, which needs brackets.",
          c: "+ and - go left to right: 8 - 6 first, then + 1.",
          d: "Multiplication comes before subtraction.",
        },
      },
      {
        id: "ppq15-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-average-bug",
        prompt: "Which line correctly averages x, y and z?",
        options: [
          { id: "a", text: "avg = x + y + z / 3" },
          { id: "b", text: "avg = (x + y + z) / 3" },
          { id: "c", text: "avg = x + y + (z / 3)" },
          { id: "d", text: "avg = (x + y + z) // 3.0 * 3" },
        ],
        correct: "b",
        explanation: "The brackets force the addition to happen before the division.",
        whyWrong: {
          a: "/ happens before +, so only z is divided.",
          c: "This is the same bug, just made explicit.",
          d: "This rounds down and multiplies back; it is not an average.",
        },
      },
      {
        id: "ppq15-3",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-string-ops",
        prompt: "print(\"ab\" * 3 + \"!\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "ababab!" },
          { id: "b", text: "ab3!" },
          { id: "c", text: "ab!ab!ab!" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "* comes before +: \"ab\" * 3 is \"ababab\", then \"!\" is joined on.",
        whyWrong: {
          b: "* repeats the string; it does not join the number.",
          c: "The ! is added once, after the repetition.",
          d: "Repeating a string by a whole number is allowed.",
        },
      },
      {
        id: "ppq15-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-discounts",
        prompt: "price = 2000\ndiscount = price * 10 / 100\nprint(price - discount)\n\nWhat is printed?",
        options: [
          { id: "a", text: "1800" },
          { id: "b", text: "1800.0" },
          { id: "c", text: "200.0" },
          { id: "d", text: "1990" },
        ],
        correct: "b",
        explanation: "discount is 200.0 (a float, because of /), and 2000 - 200.0 is 1800.0.",
        whyWrong: {
          a: "The / makes discount a float, so the result is a float too.",
          c: "That is the discount, not the price to pay.",
          d: "10% of 2000 is 200, not 10.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l16-membership-truthy-precision": {
    lessonId: "pp-l16-membership-truthy-precision",
    passMark: 70,
    questions: [
      {
        id: "ppq16-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-membership-identity",
        prompt: "print(\"cat\" in \"education\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
          { id: "c", text: "cat" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "\"education\" contains the letters c, a, t in a row: edu-cat-ion.",
        whyWrong: {
          b: "Look closely: edu·cat·ion.",
          c: "in gives a bool.",
          d: "in works on strings.",
        },
      },
      {
        id: "ppq16-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-membership-identity",
        prompt: "What is the recommended way to check whether result holds None?",
        options: [
          { id: "a", text: "result == \"None\"" },
          { id: "b", text: "result is None" },
          { id: "c", text: "result = None" },
          { id: "d", text: "None in result" },
        ],
        correct: "b",
        explanation: "There is only one None object, so the identity check is None is the idiom.",
        whyWrong: {
          a: "That compares with the text \"None\", which is not the value None.",
          c: "That assigns None; it does not check anything.",
          d: "in checks containment, and fails on most values.",
        },
      },
      {
        id: "ppq16-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-truthy-falsy",
        prompt: "Which of these values is truthy?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "\"\"" },
          { id: "c", text: "\"0\"" },
          { id: "d", text: "None" },
        ],
        correct: "c",
        explanation: "\"0\" is a non-empty string, and every non-empty string is truthy.",
        whyWrong: {
          a: "Zero is falsy.",
          b: "The empty string is falsy.",
          d: "None is falsy.",
        },
      },
      {
        id: "ppq16-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-zero-precision",
        prompt: "print(0.1 + 0.2 == 0.3)\n\nWhat is printed, and why?",
        options: [
          { id: "a", text: "True, because 0.1 + 0.2 is 0.3" },
          { id: "b", text: "False, because floats are stored in binary and 0.1 + 0.2 is 0.30000000000000004" },
          { id: "c", text: "An error, because floats cannot be compared" },
          { id: "d", text: "0.3" },
        ],
        correct: "b",
        explanation: "Most decimals cannot be stored exactly in binary. Round before comparing, or compare with a small tolerance.",
        whyWrong: {
          a: "In maths yes; in floating-point arithmetic, not exactly.",
          c: "Floats can be compared; equality is just unreliable.",
          d: "== produces a bool.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
