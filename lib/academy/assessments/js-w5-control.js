/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 5
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l15-decisions": {
    lessonId: "js-l15-decisions",
    passMark: 70,
    questions: [
      {
        id: "jsq15-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-if-else",
        prompt: "const n = 50;\nif (n > 50) { console.log(\"A\"); }\nelse if (n >= 50) { console.log(\"B\"); }\nelse { console.log(\"C\"); }\n\nWhat is printed?",
        options: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
          { id: "c", text: "C" },
          { id: "d", text: "A and B" },
        ],
        correct: "b",
        explanation: "50 > 50 is false, so the first branch is skipped. 50 >= 50 is true, so B runs and the else is skipped.",
        whyWrong: {
          a: "50 is not greater than 50.",
          c: "else only runs if every condition above it was false. The second was true.",
          d: "Only the first true branch of an if / else if chain ever runs.",
        },
      },
      {
        id: "jsq15-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-condition-order",
        prompt: "A discount chain checks total > 1000 → 5%, then else if total > 5000 → 10%. A customer spends 8000. What do they get, and why?",
        options: [
          { id: "a", text: "10%, because 8000 > 5000" },
          { id: "b", text: "5%, because the first condition is already true and the rest are skipped" },
          { id: "c", text: "15%, both discounts" },
          { id: "d", text: "No discount" },
        ],
        correct: "b",
        explanation: "8000 > 1000 is true, so the first branch runs. The 10% branch can never be reached; the conditions must go from highest to lowest.",
        whyWrong: {
          a: "That needs the > 5000 check to come first. As written it is never reached.",
          c: "An else-if chain runs one branch at most.",
          d: "A condition was true, so a discount was applied, just the wrong one.",
        },
      },
      {
        id: "jsq15-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-nested-conditions",
        prompt: "When is a nested if a better choice than combining conditions with &&?",
        options: [
          { id: "a", text: "Always; nesting is faster" },
          { id: "b", text: "When different failure cases need different responses" },
          { id: "c", text: "Never; && is always clearer" },
          { id: "d", text: "Only inside loops" },
        ],
        correct: "b",
        explanation: "Combining gives one yes/no answer. Nesting lets each combination produce its own specific message or action.",
        whyWrong: {
          a: "Speed is not the reason; the difference is negligible. The reason is distinct outcomes.",
          c: "When all failures share one response, && is clearer. When they differ, it cannot express the difference.",
          d: "Nesting is about the shape of the decision, not where it appears.",
        },
      },
      {
        id: "jsq15-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-boolean-expressions",
        prompt: "const hasPaid = true; const isLate = true;\nconsole.log(hasPaid && !isLate);\n\nWhat is printed?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "undefined" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "!isLate is false, and && needs both sides true.",
        whyWrong: {
          a: "hasPaid is true but !isLate is false, so && is false.",
          c: "A logical expression on booleans produces a boolean.",
          d: "This is a valid expression.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l16-truthy-ternary-switch": {
    lessonId: "js-l16-truthy-ternary-switch",
    passMark: 70,
    questions: [
      {
        id: "jsq16-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-truthy-falsy",
        prompt: "Which of these values is truthy?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "\"\"" },
          { id: "c", text: "\"0\"" },
          { id: "d", text: "null" },
        ],
        correct: "c",
        explanation: "\"0\" is a non-empty string, and every non-empty string is truthy, whatever it contains.",
        whyWrong: {
          a: "The number 0 is one of the falsy values.",
          b: "The empty string is falsy.",
          d: "null is falsy.",
        },
      },
      {
        id: "jsq16-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-truthy-in-practice",
        prompt: "const discount = 0;\nif (discount) { console.log(\"Discount applied\"); } else { console.log(\"No discount entered\"); }\n\nWhat is printed, and is it right?",
        options: [
          { id: "a", text: "Discount applied; correct" },
          { id: "b", text: "No discount entered; misleading, because 0 is a real value that happens to be falsy" },
          { id: "c", text: "An error, because 0 is not a boolean" },
          { id: "d", text: "Nothing is printed" },
        ],
        correct: "b",
        explanation: "0 is falsy, so the else runs. If a discount of 0 was entered deliberately, the message is wrong. Compare explicitly, such as discount !== undefined, when 0 is meaningful.",
        whyWrong: {
          a: "0 is falsy, so the if branch does not run.",
          c: "if accepts any value and converts it to a boolean.",
          d: "One of the two branches always runs.",
        },
      },
      {
        id: "jsq16-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-ternary",
        prompt: "const score = 45;\nconsole.log(score >= 50 ? \"Pass\" : \"Fail\");\n\nWhat is printed?",
        options: [
          { id: "a", text: "Pass" },
          { id: "b", text: "Fail" },
          { id: "c", text: "true" },
          { id: "d", text: "45" },
        ],
        correct: "b",
        explanation: "45 >= 50 is false, so the ternary produces the value after the colon.",
        whyWrong: {
          a: "That is the value when the condition is true.",
          c: "The ternary produces one of its two values, not the condition's result.",
          d: "score is only used in the condition.",
        },
      },
      {
        id: "jsq16-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-switch-fallthrough",
        prompt: "const level = \"b\";\nswitch (level) {\n  case \"a\": console.log(\"Gold\");\n  case \"b\": console.log(\"Silver\");\n  case \"c\": console.log(\"Bronze\"); break;\n  default: console.log(\"None\");\n}\n\nWhat is printed?",
        options: [
          { id: "a", text: "Silver" },
          { id: "b", text: "Silver, then Bronze" },
          { id: "c", text: "Gold, Silver, then Bronze" },
          { id: "d", text: "Silver, Bronze, then None" },
        ],
        correct: "b",
        explanation: "Matching starts at case \"b\". It has no break, so it falls through into case \"c\", which has one.",
        whyWrong: {
          a: "That needs a break after Silver.",
          c: "Cases above the match never run. Fall-through only goes downwards from the match.",
          d: "The break in case \"c\" stops before default.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l17-loops": {
    lessonId: "js-l17-loops",
    passMark: 70,
    questions: [
      {
        id: "jsq17-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-for-loop",
        prompt: "How many times does this run?\nfor (let i = 0; i < 5; i++) { … }",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "5" },
          { id: "c", text: "6" },
          { id: "d", text: "Forever" },
        ],
        correct: "b",
        explanation: "i takes the values 0, 1, 2, 3 and 4. When it becomes 5, i < 5 is false.",
        whyWrong: {
          a: "Counting from 0 to 4 inclusive is five values, not four.",
          c: "5 < 5 is false, so there is no sixth repetition.",
          d: "i++ moves i towards 5 each time, so the loop ends.",
        },
      },
      {
        id: "jsq17-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-for-practice",
        prompt: "let s = 0;\nfor (let i = 2; i <= 8; i += 2) { s += i; }\nconsole.log(s);\n\nWhat is printed?",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "12" },
          { id: "c", text: "35" },
          { id: "d", text: "8" },
        ],
        correct: "a",
        explanation: "i is 2, 4, 6 and 8. Their sum is 20.",
        whyWrong: {
          b: "That stops at 6. i <= 8 includes 8.",
          c: "That adds every number from 2 to 8. The update is i += 2.",
          d: "8 is the last value of i, not the total.",
        },
      },
      {
        id: "jsq17-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-while-loop",
        prompt: "When is a while loop a better fit than a for loop?",
        options: [
          { id: "a", text: "When you know exactly how many repetitions you need" },
          { id: "b", text: "When you do not know in advance how many repetitions you need" },
          { id: "c", text: "When you need to count down" },
          { id: "d", text: "Never; they are identical" },
        ],
        correct: "b",
        explanation: "while is condition-controlled: it keeps going until something changes, however many repetitions that takes.",
        whyWrong: {
          a: "That is the strength of a for loop.",
          c: "A for loop counts down easily with i--.",
          d: "Either can be written as the other, but each makes a different kind of loop clearer.",
        },
      },
      {
        id: "jsq17-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-do-while",
        prompt: "let n = 10;\ndo { console.log(n); n++; } while (n < 5);\n\nWhat is printed?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "10" },
          { id: "c", text: "10 to 4" },
          { id: "d", text: "It runs forever" },
        ],
        correct: "b",
        explanation: "do…while runs its body once before checking. It prints 10, then 11 < 5 is false and the loop ends.",
        whyWrong: {
          a: "That is what a while loop would do. do…while always runs at least once.",
          c: "n goes up, not down, and the condition stops it after one repetition.",
          d: "11 < 5 is false at the first check, so it stops.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l18-loop-control": {
    lessonId: "js-l18-loop-control",
    passMark: 70,
    questions: [
      {
        id: "jsq18-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-break",
        prompt: "What does break do inside a loop?",
        options: [
          { id: "a", text: "Skips the rest of this repetition and continues with the next" },
          { id: "b", text: "Ends the loop immediately and continues after it" },
          { id: "c", text: "Stops the whole program" },
          { id: "d", text: "Restarts the loop from the beginning" },
        ],
        correct: "b",
        explanation: "break exits the loop completely, and the program carries on from the first line after it.",
        whyWrong: {
          a: "That is continue.",
          c: "Only the loop ends. The rest of the program runs.",
          d: "Nothing in JavaScript restarts a loop; break leaves it.",
        },
      },
      {
        id: "jsq18-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-continue",
        prompt: "let out = \"\";\nfor (let i = 1; i <= 5; i++) {\n  if (i === 3) continue;\n  out += i;\n}\nconsole.log(out);\n\nWhat is printed?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "1245" },
          { id: "c", text: "12345" },
          { id: "d", text: "1 2 4 5" },
        ],
        correct: "b",
        explanation: "continue skips only the repetition where i is 3. Every other value is joined onto out.",
        whyWrong: {
          a: "That is what break would produce, stopping at 3.",
          c: "The repetition for 3 is skipped before out += i.",
          d: "Joining with += adds no spaces between the numbers.",
        },
      },
      {
        id: "jsq18-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-nested-loops",
        prompt: "for (let a = 0; a < 4; a++) {\n  for (let b = 0; b < 3; b++) { console.log(\"*\"); }\n}\n\nHow many stars are printed?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "12" },
          { id: "c", text: "4" },
          { id: "d", text: "3" },
        ],
        correct: "b",
        explanation: "The inner loop runs fully for each of the 4 outer repetitions: 4 × 3 = 12.",
        whyWrong: {
          a: "That adds the counts. Nested loops multiply.",
          c: "That counts only the outer loop.",
          d: "That counts only one run of the inner loop.",
        },
      },
      {
        id: "jsq18-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-atm-menu",
        prompt: "Inside a while loop, a switch case ends with break. What does that break do?",
        options: [
          { id: "a", text: "Ends the while loop" },
          { id: "b", text: "Leaves the switch only; the while loop keeps running" },
          { id: "c", text: "Stops the program" },
          { id: "d", text: "Skips to the next case" },
        ],
        correct: "b",
        explanation: "break leaves the innermost switch or loop it is in. Inside a switch, that is the switch, which is why a menu loop needs its own flag or condition to end.",
        whyWrong: {
          a: "The nearest enclosing statement is the switch, so that is what break exits.",
          c: "break never stops a program.",
          d: "Moving into the next case is fall-through, which is what happens WITHOUT break.",
        },
      },
    ],
  },
};
