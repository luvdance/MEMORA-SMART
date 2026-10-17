/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 4
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l12-values-types": {
    lessonId: "js-l12-values-types",
    passMark: 70,
    questions: [
      {
        id: "jsq12-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-typeof",
        prompt: "What does typeof null give?",
        options: [
          { id: "a", text: "\"null\"" },
          { id: "b", text: "\"undefined\"" },
          { id: "c", text: "\"object\"" },
          { id: "d", text: "\"boolean\"" },
        ],
        correct: "c",
        explanation: "typeof null is \"object\", a bug from the first version of JavaScript kept for compatibility. Check for null with value === null.",
        whyWrong: {
          a: "That would be logical, but JavaScript has never returned it. The 1995 quirk was never fixed.",
          b: "undefined and null are different values with different typeof results.",
          d: "null is not a boolean. typeof true and typeof false give \"boolean\".",
        },
      },
      {
        id: "jsq12-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-booleans-undefined-null",
        prompt: "let total; console.log(total); What is printed, and what does it usually mean?",
        options: [
          { id: "a", text: "0, the default number" },
          { id: "b", text: "null, a deliberate empty value" },
          { id: "c", text: "undefined, meaning no value has been given yet" },
          { id: "d", text: "An error" },
        ],
        correct: "c",
        explanation: "A variable declared with no value holds undefined. It usually means something was never set, which is often a bug.",
        whyWrong: {
          a: "JavaScript does not default variables to 0.",
          b: "null is only there if a programmer writes it. JavaScript gives undefined.",
          d: "Declaring a variable without a value is allowed. Using an undeclared name would be an error.",
        },
      },
      {
        id: "jsq12-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-strings-numbers",
        prompt: "Why is 0.1 + 0.2 === 0.3 false in JavaScript?",
        options: [
          { id: "a", text: "JavaScript cannot add decimals" },
          { id: "b", text: "Decimals are stored in binary, and 0.1 cannot be stored exactly, so the sum is 0.30000000000000004" },
          { id: "c", text: "=== does not work on numbers" },
          { id: "d", text: "0.3 is a string" },
        ],
        correct: "b",
        explanation: "Like 1/3 in decimal, 0.1 has no exact binary representation. The tiny error shows up in the sum. Round for display or work in whole units such as kobo.",
        whyWrong: {
          a: "It adds them; the result is just very slightly off due to binary storage.",
          c: "=== compares numbers perfectly. The numbers themselves are slightly different.",
          d: "0.3 here is a number literal, not a string.",
        },
      },
      {
        id: "jsq12-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-type-inspection",
        prompt: "const qty = \"4\"; const price = 200; console.log(qty + price); What is printed?",
        options: [
          { id: "a", text: "800" },
          { id: "b", text: "204" },
          { id: "c", text: "4200" },
          { id: "d", text: "NaN" },
        ],
        correct: "c",
        explanation: "qty is the string \"4\", so + joins \"4\" and 200 into \"4200\". Checking typeof qty would reveal the problem immediately.",
        whyWrong: {
          a: "800 is 4 × 200, but the operator is +, and qty is text.",
          b: "That would be 4 + 200 with both as numbers.",
          d: "+ never gives NaN when one side is text; it joins.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l13-operators": {
    lessonId: "js-l13-operators",
    passMark: 70,
    questions: [
      {
        id: "jsq13-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-arithmetic-ops",
        prompt: "What is 20 % 6?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "2" },
          { id: "c", text: "3.33" },
          { id: "d", text: "120" },
        ],
        correct: "b",
        explanation: "% is the remainder. 6 goes into 20 three times (18), leaving 2.",
        whyWrong: {
          a: "3 is how many times 6 fits, which is Math.floor(20 / 6).",
          c: "That is ordinary division.",
          d: "That is multiplication.",
        },
      },
      {
        id: "jsq13-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-comparison-ops",
        prompt: "What is 7 === \"7\"?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "An error" },
          { id: "d", text: "undefined" },
        ],
        correct: "b",
        explanation: "=== is strict: the values and the types must both match. One is a number and one is a string.",
        whyWrong: {
          a: "That is the result of loose ==, which converts the string first. === does not convert.",
          c: "Comparing values of different types is allowed; it is just false.",
          d: "Every comparison returns a boolean.",
        },
      },
      {
        id: "jsq13-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-assignment-ops",
        prompt: "let points = 10;\npoints += 5;\npoints *= 3;\npoints--;\n\nWhat is points now?",
        options: [
          { id: "a", text: "44" },
          { id: "b", text: "45" },
          { id: "c", text: "29" },
          { id: "d", text: "14" },
        ],
        correct: "a",
        explanation: "10 + 5 = 15, × 3 = 45, then -- subtracts one: 44.",
        whyWrong: {
          b: "That forgets the final points--, which subtracts one.",
          c: "That applies the operations in the wrong order.",
          d: "That ignores the multiplication.",
        },
      },
      {
        id: "jsq13-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-precedence",
        prompt: "What is 4 + 6 / 2 * 3?",
        options: [
          { id: "a", text: "15" },
          { id: "b", text: "13" },
          { id: "c", text: "5" },
          { id: "d", text: "1.67" },
        ],
        correct: "b",
        explanation: "/ and * share a level and go left to right: 6 / 2 = 3, then 3 × 3 = 9. Then 4 + 9 = 13.",
        whyWrong: {
          a: "That adds first: (4 + 6) / 2 × 3. Addition comes after division and multiplication.",
          c: "That does the multiplication before the division. Equal-level operators go left to right.",
          d: "That divides by 2 × 3 = 6, again the wrong order.",
        },
      },
      {
        id: "jsq13-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-logical-ops",
        prompt: "const age = 16; const withParent = true;\nconsole.log(age >= 18 || withParent);\n\nWhat is printed?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "16" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "age >= 18 is false, but || only needs one side true, and withParent is true.",
        whyWrong: {
          b: "That would be the result with &&.",
          c: "A comparison returns a boolean, not the value being compared.",
          d: "This is a valid expression.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l14-conversion-templates": {
    lessonId: "js-l14-conversion-templates",
    passMark: 70,
    questions: [
      {
        id: "jsq14-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-explicit-conversion",
        prompt: "What is Number(\"12kg\")?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "NaN" },
          { id: "c", text: "\"12\"" },
          { id: "d", text: "0" },
        ],
        correct: "b",
        explanation: "Number() needs the whole string to be a number. \"kg\" makes it fail, giving NaN. parseInt(\"12kg\") would give 12.",
        whyWrong: {
          a: "That is what parseInt or parseFloat give, because they stop at the first non-digit.",
          c: "Number() never returns a string.",
          d: "Only an empty or whitespace-only string converts to 0.",
        },
      },
      {
        id: "jsq14-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-coercion",
        prompt: "What is \"10\" - 4?",
        options: [
          { id: "a", text: "\"104\"" },
          { id: "b", text: "6" },
          { id: "c", text: "NaN" },
          { id: "d", text: "\"6\"" },
        ],
        correct: "b",
        explanation: "Only + prefers text. - works only on numbers, so \"10\" is converted to 10 and the result is the number 6.",
        whyWrong: {
          a: "That is what + would do. - never joins strings.",
          c: "\"10\" converts cleanly to a number, so there is no NaN.",
          d: "The result of - is always a number, not a string.",
        },
      },
      {
        id: "jsq14-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-template-literals",
        prompt: "const n = 4;\nconsole.log(`${n} x 2 = ${n * 2}`);\n\nWhat is printed?",
        options: [
          { id: "a", text: "4 x 2 = 8" },
          { id: "b", text: "${n} x 2 = ${n * 2}" },
          { id: "c", text: "n x 2 = n * 2" },
          { id: "d", text: "4 x 2 = 4 * 2" },
        ],
        correct: "a",
        explanation: "Inside backticks, ${ } inserts the value of the expression. n is 4 and n * 2 is calculated first, giving 8.",
        whyWrong: {
          b: "That is what you would get with ordinary quotes. Backticks are what make ${ } work.",
          c: "The names are replaced by their values.",
          d: "The expression inside ${ } is evaluated, not printed as text.",
        },
      },
      {
        id: "jsq14-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-shopping-calculator",
        prompt: "A subtotal of 8,000 gets no discount, then 7.5% VAT. Using toFixed(2), what final price is printed?",
        options: [
          { id: "a", text: "8600.00" },
          { id: "b", text: "8075.00" },
          { id: "c", text: "8600" },
          { id: "d", text: "600.00" },
        ],
        correct: "a",
        explanation: "7.5% of 8000 is 600, so the total is 8600, and toFixed(2) shows two decimal places: 8600.00.",
        whyWrong: {
          b: "That adds 75 rather than 7.5% of 8000.",
          c: "toFixed(2) always shows exactly two decimal places.",
          d: "600.00 is only the VAT, not the final price.",
        },
      },
    ],
  },
};
