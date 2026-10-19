/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 6
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l23-while": {
    lessonId: "pp-l23-while",
    passMark: 70,
    questions: [
      {
        id: "ppq23-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-why-loops",
        prompt: "When is a while loop the natural choice?",
        options: [
          { id: "a", text: "When the number of repetitions is not known in advance" },
          { id: "b", text: "When code must run exactly once" },
          { id: "c", text: "When choosing between two options" },
          { id: "d", text: "Never; for is always better" },
        ],
        correct: "a",
        explanation: "while repeats as long as a condition holds, which suits \"until the user gets it right\" and similar open-ended repetition.",
        whyWrong: {
          b: "Code that runs once needs no loop.",
          c: "That is an if/else.",
          d: "for needs a known sequence; while handles open-ended repetition.",
        },
      },
      {
        id: "ppq23-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-while",
        prompt: "i = 0\nwhile i < 3:\n    print(i)\n    i += 1\n\nWhat is printed?",
        options: [
          { id: "a", text: "0\n1\n2" },
          { id: "b", text: "1\n2\n3" },
          { id: "c", text: "0\n1\n2\n3" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "i is printed while it is 0, 1 and 2. When i becomes 3, 3 < 3 is False and the loop ends.",
        whyWrong: {
          b: "i is printed before it is increased, starting from 0.",
          c: "When i is 3 the condition is False, so 3 is not printed.",
          d: "0 < 3 is True, so the loop runs.",
        },
      },
      {
        id: "ppq23-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-while",
        prompt: "n = 5\nwhile n > 0:\n    print(n)\n\nWhat happens?",
        options: [
          { id: "a", text: "It prints 5 4 3 2 1" },
          { id: "b", text: "It prints 5 forever, because n never changes" },
          { id: "c", text: "It prints nothing" },
          { id: "d", text: "SyntaxError" },
        ],
        correct: "b",
        explanation: "Nothing in the body changes n, so n > 0 stays True forever: an infinite loop.",
        whyWrong: {
          a: "That needs n -= 1 inside the loop.",
          c: "5 > 0 is True, so it prints immediately.",
          d: "The code is valid; it just never stops.",
        },
      },
      {
        id: "ppq23-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-while-input",
        prompt: "In a guessing loop, why is the first guess usually asked BEFORE the while line?",
        options: [
          { id: "a", text: "So the condition guess != secret has a value to test the first time" },
          { id: "b", text: "Because input() cannot be used inside a loop" },
          { id: "c", text: "To make the program faster" },
          { id: "d", text: "It is a style rule with no effect" },
        ],
        correct: "a",
        explanation: "The condition is checked before the first pass, so guess must already exist. The loop body then asks again for each retry.",
        whyWrong: {
          b: "input() inside the loop is how the retries are collected.",
          c: "Speed is not the reason.",
          d: "Without it, the condition would raise a NameError.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l24-for-range": {
    lessonId: "pp-l24-for-range",
    passMark: 70,
    questions: [
      {
        id: "ppq24-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-for",
        prompt: "for c in \"Hi!\":\n    print(c)\n\nHow many lines are printed?",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "2" },
          { id: "c", text: "3" },
          { id: "d", text: "0" },
        ],
        correct: "c",
        explanation: "\"Hi!\" has three characters, H, i and !, so the block runs three times.",
        whyWrong: {
          a: "The loop runs once per character, not once per string.",
          b: "The ! is a character too.",
          d: "A non-empty string always gives at least one pass.",
        },
      },
      {
        id: "ppq24-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-range",
        prompt: "Which numbers does range(2, 6) produce?",
        options: [
          { id: "a", text: "2 3 4 5 6" },
          { id: "b", text: "2 3 4 5" },
          { id: "c", text: "3 4 5 6" },
          { id: "d", text: "0 1 2 3 4 5" },
        ],
        correct: "b",
        explanation: "range starts at the start value and stops BEFORE the stop value.",
        whyWrong: {
          a: "The stop value, 6, is never included.",
          c: "The start value, 2, is included.",
          d: "With two arguments, counting begins at the first.",
        },
      },
      {
        id: "ppq24-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-range",
        prompt: "Which loop prints 1 to 10 inclusive?",
        options: [
          { id: "a", text: "for i in range(10): print(i)" },
          { id: "b", text: "for i in range(1, 10): print(i)" },
          { id: "c", text: "for i in range(1, 11): print(i)" },
          { id: "d", text: "for i in range(0, 10, 1): print(i)" },
        ],
        correct: "c",
        explanation: "To include 10, the stop value must be 11.",
        whyWrong: {
          a: "That prints 0 to 9.",
          b: "That prints 1 to 9.",
          d: "That prints 0 to 9.",
        },
      },
      {
        id: "ppq24-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-range-step",
        prompt: "print(list(range(20, 5, -5)))\n\nWhat is printed?",
        options: [
          { id: "a", text: "[20, 15, 10, 5]" },
          { id: "b", text: "[20, 15, 10]" },
          { id: "c", text: "[5, 10, 15, 20]" },
          { id: "d", text: "[]" },
        ],
        correct: "b",
        explanation: "Counting down by 5 from 20, stopping before 5: 20, 15, 10.",
        whyWrong: {
          a: "The stop value 5 is not included, even when counting down.",
          c: "A negative step counts down from the start.",
          d: "A negative step with start above stop produces values.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l25-accumulators-break": {
    lessonId: "pp-l25-accumulators-break",
    passMark: 70,
    questions: [
      {
        id: "ppq25-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-accumulators",
        prompt: "for n in [3, 4, 5]:\n    total = 0\n    total += n\nprint(total)\n\nWhat is printed, and why?",
        options: [
          { id: "a", text: "12, the sum" },
          { id: "b", text: "5, because total is reset to 0 on every pass" },
          { id: "c", text: "0" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "total = 0 is inside the loop, so it restarts each time and only the last value survives. Create the accumulator before the loop.",
        whyWrong: {
          a: "That needs total = 0 before the loop.",
          c: "The last pass adds 5 after the reset.",
          d: "The code is valid, just wrong.",
        },
      },
      {
        id: "ppq25-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-factorial",
        prompt: "Why must a product accumulator (such as a factorial) start at 1, not 0?",
        options: [
          { id: "a", text: "Anything multiplied by 0 is 0, so the result would always be 0" },
          { id: "b", text: "Python does not allow 0 in a loop" },
          { id: "c", text: "1 is faster" },
          { id: "d", text: "It makes no difference" },
        ],
        correct: "a",
        explanation: "1 is the identity for multiplication, as 0 is for addition.",
        whyWrong: {
          b: "0 is perfectly allowed.",
          c: "Speed is not the issue.",
          d: "Starting at 0 makes every product 0.",
        },
      },
      {
        id: "ppq25-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-break-continue",
        prompt: "for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)\n\nWhat is printed?",
        options: [
          { id: "a", text: "1 2" },
          { id: "b", text: "1 2 4 5" },
          { id: "c", text: "1 2 3 4 5" },
          { id: "d", text: "3" },
        ],
        correct: "b",
        explanation: "continue skips the rest of the pass when i is 3, then the loop carries on with 4 and 5.",
        whyWrong: {
          a: "That would be break, which ends the loop.",
          c: "3 is skipped by continue.",
          d: "continue skips 3; it does not print only 3.",
        },
      },
      {
        id: "ppq25-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-break-continue",
        prompt: "for d in range(2, 9):\n    if 9 % d == 0:\n        print(\"found\", d)\n        break\nelse:\n    print(\"none\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "found 3" },
          { id: "b", text: "none" },
          { id: "c", text: "found 3\nnone" },
          { id: "d", text: "found 9" },
        ],
        correct: "a",
        explanation: "3 is the first divisor of 9 in the range. break ends the loop, and a for's else block only runs if the loop was NOT broken.",
        whyWrong: {
          b: "A divisor is found, so the loop breaks and else is skipped.",
          c: "else is skipped after a break.",
          d: "range(2, 9) stops before 9, and 3 is found first anyway.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l26-nested-tracing": {
    lessonId: "pp-l26-nested-tracing",
    passMark: 70,
    questions: [
      {
        id: "ppq26-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-nested-loops",
        prompt: "for a in range(3):\n    for b in range(4):\n        print(\"x\")\n\nHow many times is x printed?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "12" },
          { id: "c", text: "4" },
          { id: "d", text: "3" },
        ],
        correct: "b",
        explanation: "The inner loop runs fully (4 times) for each of the 3 outer passes: 3 × 4 = 12.",
        whyWrong: {
          a: "Nested loops multiply, they do not add.",
          c: "That is one pass of the outer loop.",
          d: "That counts only the outer loop.",
        },
      },
      {
        id: "ppq26-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-infinite-loops",
        prompt: "x = 0\nwhile x != 5:\n    x += 2\n\nWhat happens?",
        options: [
          { id: "a", text: "The loop ends when x is 5" },
          { id: "b", text: "It never ends: x goes 2, 4, 6, ... and is never exactly 5" },
          { id: "c", text: "It ends when x is 4" },
          { id: "d", text: "It does not run at all" },
        ],
        correct: "b",
        explanation: "x jumps over 5, so x != 5 is always True. Use x < 5 for a condition that cannot be stepped over.",
        whyWrong: {
          a: "x only takes even values.",
          c: "4 != 5 is True, so the loop continues.",
          d: "0 != 5 is True at the start.",
        },
      },
      {
        id: "ppq26-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-infinite-loops",
        prompt: "Your program is stuck in an infinite loop in the VS Code terminal. How do you stop it?",
        options: [
          { id: "a", text: "Press Ctrl+C in the terminal" },
          { id: "b", text: "Wait; it will stop on its own" },
          { id: "c", text: "Type stop() in the editor" },
          { id: "d", text: "Delete the file" },
        ],
        correct: "a",
        explanation: "Ctrl+C sends an interrupt that stops the running program.",
        whyWrong: {
          b: "An infinite loop never stops on its own.",
          c: "Typing in the editor does not affect the running program.",
          d: "The running process continues even if the file is deleted.",
        },
      },
      {
        id: "ppq26-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-tracing",
        prompt: "total = 0\nfor i in range(1, 5):\n    if i % 2 == 0:\n        total += i\nprint(total)\n\nTrace it. What is printed?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "6" },
          { id: "c", text: "4" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation: "i takes 1, 2, 3, 4. Only the even values 2 and 4 are added: 6.",
        whyWrong: {
          a: "That adds every value; the if only adds even ones.",
          c: "2 is also even.",
          d: "4 is also even, and range(1, 5) includes 4.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
