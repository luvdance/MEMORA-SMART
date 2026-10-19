/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 15 · LOOPS AND REPETITION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l64-loops", [
    q({ id: "wdq64-1", atom: "a-wd-why-loops", d: 1, prompt: "When should you reach for a loop?", options: ["When you would otherwise copy a line many times changing only a number", "Only for printing", "Never in web pages", "When you need a decision"], correct: "a",
      explanation: "Loops write an instruction once and repeat it.",
      wrong: { b: "Loops do any repeated work.", c: "Pages loop all the time, for example to render lists.", d: "Decisions are if statements." } }),
    q({ id: "wdq64-2", atom: "a-wd-for", d: 2, prompt: "How many times does for (let i = 0; i < 3; i++) run its body?", options: ["3", "2", "4", "Forever"], correct: "a",
      explanation: "i is 0, 1 and 2.",
      wrong: { b: "0 counts too.", c: "i = 3 fails the condition.", d: "i increases to 3 and stops." } }),
    q({ id: "wdq64-3", atom: "a-wd-while", d: 2, prompt: "When is a while loop a better fit than a for loop?", options: ["When you do not know in advance how many repetitions are needed", "When counting 1 to 10", "Never", "Only with arrays"], correct: "a",
      explanation: "The condition decides when to stop.",
      wrong: { b: "A known range suits for.", c: "while has clear uses.", d: "It works with anything." } }),
    q({ id: "wdq64-4", atom: "a-wd-do-while", d: 3, prompt: "What is special about do...while?", options: ["The body always runs at least once, because the condition is checked after it", "It never runs", "It runs exactly twice", "It cannot use break"], correct: "a",
      explanation: "Check after, so at least one run.",
      wrong: { b: "It always runs once.", c: "It repeats while the condition is true.", d: "break works in it." } }),
  ]),

  ...check("wd-l65-accumulate", [
    q({ id: "wdq65-1", atom: "a-wd-count-accumulate", d: 2, prompt: "What should an accumulator for a product (multiplying values) start at?", options: ["1", "0", "\"\"", "null"], correct: "a",
      explanation: "Multiplying by 0 would always give 0; 1 is neutral for multiplication.",
      wrong: { b: "0 is neutral for addition, not multiplication.", c: "That is for building text.", d: "null is not a number to multiply." } }),
    q({ id: "wdq65-2", atom: "a-wd-loop-conditions", d: 3, type: "scenario", prompt: "An array has 5 items, at indexes 0 to 4. Which condition visits each exactly once from i = 0?", options: ["i < 5", "i <= 5", "i < 4", "i > 0"], correct: "a",
      explanation: "The last index is length - 1.",
      wrong: { b: "Visits index 5, which does not exist.", c: "Misses the last item.", d: "False from the start, so nothing runs." } }),
    q({ id: "wdq65-3", atom: "a-wd-break-continue", d: 2, prompt: "What does break do inside a loop?", options: ["Ends the whole loop immediately", "Skips to the next repetition", "Pauses the loop", "Restarts it"], correct: "a",
      explanation: "break exits the loop.",
      wrong: { b: "That is continue.", c: "There is no pause.", d: "Nothing restarts." } }),
    q({ id: "wdq65-4", atom: "a-wd-break-continue", d: 2, prompt: "What does continue do?", options: ["Skips the rest of this repetition and moves to the next", "Ends the loop", "Repeats the same item", "Throws an error"], correct: "a",
      explanation: "Use it to ignore items you do not want.",
      wrong: { b: "That is break.", c: "It moves on.", d: "It is valid." } }),
  ]),

  ...check("wd-l66-nested-infinite", [
    q({ id: "wdq66-1", atom: "a-wd-nested-loops", d: 2, prompt: "An outer loop runs 4 times and its inner loop 5 times. How many times does the inner body run?", options: ["20", "9", "5", "4"], correct: "a",
      explanation: "The inner loop runs fully for every outer repetition: 4 × 5.",
      wrong: { b: "Adding is wrong; it multiplies.", c: "That is one outer repetition.", d: "That is the outer count." } }),
    q({ id: "wdq66-2", atom: "a-wd-infinite-loops", d: 3, type: "scenario", prompt: "let n = 1; while (n !== 10) { n += 2; } never ends. Why?", options: ["n goes 1, 3, 5, 7, 9, 11… and is never exactly 10", "while loops cannot use !==", "n += 2 is invalid", "The loop needs braces"], correct: "a",
      explanation: "Use n < 10 so stepping past the target still stops.",
      wrong: { b: "!== is fine; the target is never hit.", c: "It is valid.", d: "It has braces." } }),
    q({ id: "wdq66-3", atom: "a-wd-infinite-loops", d: 2, prompt: "What is the best way to prevent infinite loops?", options: ["Make sure each repetition changes what the condition depends on, towards the exit", "Use only for loops", "Avoid loops entirely", "Add console.log"], correct: "a",
      explanation: "And guard against inputs that can never finish.",
      wrong: { b: "for loops can be infinite too.", c: "Unrealistic.", d: "Logging does not end a loop." } }),
    q({ id: "wdq66-4", atom: "a-wd-iteration-problems", d: 3, prompt: "Which inputs should always be tested for a loop-based savings planner?", options: ["A goal already met, and a monthly amount of 0 or less", "Only typical values", "Only very large values", "No inputs"], correct: "a",
      explanation: "Edge cases: nothing to do, and impossible to finish.",
      wrong: { b: "Typical values miss the edge cases.", c: "Large values matter less than impossible ones.", d: "Testing is how you know." } }),
  ]),
};
