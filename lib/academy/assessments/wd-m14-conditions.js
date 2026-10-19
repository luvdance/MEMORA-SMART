/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 14 · CONDITIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l60-operators", [
    q({ id: "wdq60-1", atom: "a-wd-arithmetic", d: 2, prompt: "What is 23 % 4?", options: ["3", "5", "5.75", "0"], correct: "a",
      explanation: "4 goes into 23 five times (20), remainder 3.",
      wrong: { b: "That is how many times 4 goes in, not the remainder.", c: "That is 23 / 4.", d: "23 is not a multiple of 4." } }),
    q({ id: "wdq60-2", atom: "a-wd-assignment", d: 2, prompt: "After let n = 10; n -= 3; n *= 2; what is n?", options: ["14", "17", "4", "26"], correct: "a",
      explanation: "10 - 3 = 7, then 7 * 2 = 14.",
      wrong: { b: "The multiplication comes after the subtraction.", c: "Not a possible result.", d: "Not a possible result." } }),
    q({ id: "wdq60-3", atom: "a-wd-comparison", d: 3, prompt: "Why prefer === to ==?", options: ["=== does not convert types, so \"5\" and 5 are correctly treated as different", "=== is faster to type", "== does not work in browsers", "=== compares only numbers"], correct: "a",
      explanation: "== converts before comparing and hides type bugs.",
      wrong: { b: "It is one more character, not fewer.", c: "== works, which is the danger.", d: "=== compares any values." } }),
    q({ id: "wdq60-4", atom: "a-wd-comparison", d: 2, type: "scenario", prompt: "if (total = 0) is written by mistake. What is wrong?", options: ["= assigns 0 instead of comparing; it should be ===", "Nothing", "0 cannot be compared", "if needs two conditions"], correct: "a",
      explanation: "A single = is assignment.",
      wrong: { b: "It changes total and the condition is always falsy.", c: "0 can be compared.", d: "One condition is enough." } }),
  ]),

  ...check("wd-l61-logic-if", [
    q({ id: "wdq61-1", atom: "a-wd-booleans", d: 1, prompt: "Which name suits a variable holding whether an order is paid?", options: ["isPaid", "x", "paid123", "data"], correct: "a",
      explanation: "Boolean names read like a yes/no question.",
      wrong: { b: "Says nothing.", c: "Unclear and numbered.", d: "Too vague." } }),
    q({ id: "wdq61-2", atom: "a-wd-logical-operators", d: 2, prompt: "What is true && false || true?", options: ["true", "false", "An error", "undefined"], correct: "a",
      explanation: "&& first: true && false is false; then false || true is true.",
      wrong: { b: "Precedence: && before ||.", c: "Valid expression.", d: "It produces a boolean." } }),
    q({ id: "wdq61-3", atom: "a-wd-logical-operators", d: 3, prompt: "In isLoggedIn && loadProfile(), when is loadProfile called?", options: ["Only when isLoggedIn is truthy", "Always", "Never", "Only when isLoggedIn is false"], correct: "a",
      explanation: "Short-circuit: if the left side is falsy, the right is not evaluated.",
      wrong: { b: "&& stops early on a falsy left side.", c: "It runs when the left is truthy.", d: "That is the opposite." } }),
    q({ id: "wdq61-4", atom: "a-wd-if", d: 2, prompt: "Why always use braces with if, even for one line?", options: ["A second line added later would otherwise run unconditionally", "Braces make code faster", "if does not work without them", "Braces change the condition"], correct: "a",
      explanation: "Without braces only the next statement belongs to the if.",
      wrong: { b: "Speed is unaffected.", c: "It works, which is the trap.", d: "The condition is unchanged." } }),
  ]),

  ...check("wd-l62-else", [
    q({ id: "wdq62-1", atom: "a-wd-if-else", d: 1, prompt: "How many blocks of an if...else run?", options: ["Exactly one", "Both", "None", "It depends on the braces"], correct: "a",
      explanation: "One or the other, never both.",
      wrong: { b: "Never both.", c: "One always runs.", d: "Braces do not change this." } }),
    q({ id: "wdq62-2", atom: "a-wd-else-if", d: 3, type: "scenario", prompt: "An else if chain checks score >= 50 before score >= 70. What goes wrong for a score of 90?", options: ["It gets the 50 band's result, because the first true condition wins", "It gets the 70 band's result", "It is an error", "Nothing"], correct: "a",
      explanation: "Check the highest band first.",
      wrong: { b: "That branch is never reached.", c: "It is valid code with a logic bug.", d: "90 is graded wrongly." } }),
    q({ id: "wdq62-3", atom: "a-wd-nested", d: 2, prompt: "What is a guard clause?", options: ["An early return that handles a special or invalid case first", "A security password", "A loop", "A CSS rule"], correct: "a",
      explanation: "It keeps the main logic flat and readable.",
      wrong: { b: "Unrelated.", c: "Not a loop.", d: "Not CSS." } }),
    q({ id: "wdq62-4", atom: "a-wd-nested", d: 3, prompt: "Which test values best check a grading function with bands at 70, 60 and 50?", options: ["70, 69, 60, 59, 50, 49, plus invalid -1 and 101", "Only 85", "1, 2 and 3", "Random numbers"], correct: "a",
      explanation: "Boundaries and invalid input are where the bugs are.",
      wrong: { b: "One value tests one branch.", c: "All in the same band.", d: "Random values miss boundaries." } }),
  ]),

  ...check("wd-l63-switch-truthy-ternary", [
    q({ id: "wdq63-1", atom: "a-wd-switch", d: 3, prompt: "A switch case has no break or return. What happens when it matches?", options: ["Execution falls through into the next case's code", "Only that case runs", "An error is thrown", "default runs instead"], correct: "a",
      explanation: "Without break, the following cases run too.",
      wrong: { b: "Only with break.", c: "It is valid.", d: "default runs only if reached by fall-through or no match." } }),
    q({ id: "wdq63-2", atom: "a-wd-truthy-falsy", d: 2, prompt: "Which value is truthy?", options: ["\"0\"", "0", "\"\"", "null"], correct: "a",
      explanation: "Any non-empty string is truthy.",
      wrong: { b: "0 is falsy.", c: "An empty string is falsy.", d: "null is falsy." } }),
    q({ id: "wdq63-3", atom: "a-wd-truthy-falsy", d: 3, type: "scenario", prompt: "quantity || 1 is used as a default. A customer orders 0 extras. What is the result?", options: ["1, because 0 is falsy", "0", "An error", "undefined"], correct: "a",
      explanation: "|| replaces every falsy value, including a legitimate 0. ?? (Module 28) fixes this.",
      wrong: { b: "0 is replaced by ||.", c: "No error.", d: "It returns the right-hand side, 1." } }),
    q({ id: "wdq63-4", atom: "a-wd-ternary", d: 2, prompt: "What does stock > 0 ? \"In stock\" : \"Sold out\" give when stock is 0?", options: ["\"Sold out\"", "\"In stock\"", "0", "true"], correct: "a",
      explanation: "0 > 0 is false, so the second value.",
      wrong: { b: "The condition is false.", c: "It returns one of the two strings.", d: "It returns a string." } }),
  ]),
};
