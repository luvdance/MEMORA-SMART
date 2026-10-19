/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 13 · INTRODUCTION TO PROGRAMMING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l57-programming", [
    q({
      id: "wdq57-1", atom: "a-wd-what-programming", d: 1,
      prompt: "What does a computer do with a program?",
      options: ["Follows its instructions exactly as written", "Works out what you meant", "Fixes your mistakes automatically", "Runs only the parts it understands"],
      correct: "a",
      explanation: "It does what you said, not what you meant, which is why precise steps matter.",
      wrong: { b: "Computers do not guess intentions.", c: "Mistakes run, or stop the program.", d: "Invalid code stops it." },
    }),
    q({
      id: "wdq57-2", atom: "a-wd-js-in-page", d: 1,
      prompt: "Which job belongs to JavaScript rather than HTML or CSS?",
      options: ["Checking whether a typed email looks valid and showing a message", "Making a heading", "Colouring a button", "Adding a link"],
      correct: "a",
      explanation: "Deciding and responding is programming.",
      wrong: { b: "Headings are HTML.", c: "Colour is CSS.", d: "Links are HTML." },
    }),
    q({
      id: "wdq57-3", atom: "a-wd-statements", d: 2,
      prompt: "What does console.log(\"4 * 2\") print?",
      options: ["4 * 2", "8", "\"8\"", "An error"],
      correct: "a",
      explanation: "In quotes it is a string, printed exactly as it is.",
      wrong: { b: "Only without quotes is it calculated.", c: "Nothing is calculated.", d: "It is valid code." },
    }),
    q({
      id: "wdq57-4", atom: "a-wd-errors", d: 3, type: "scenario",
      prompt: "A script's third line uses a variable that does not exist. What happens?",
      options: ["Lines 1 and 2 run, then a ReferenceError stops the script", "Nothing runs at all", "The line is skipped and the script continues", "The variable is created automatically"],
      correct: "a",
      explanation: "A runtime error: everything before it runs, nothing after.",
      wrong: { b: "That is what a syntax error does.", c: "JavaScript does not skip errors.", d: "Reading an undeclared variable is an error." },
    }),
  ]),

  ...check("wd-l58-algorithms", [
    q({
      id: "wdq58-1", atom: "a-wd-algorithms", d: 2,
      prompt: "Which instruction is precise enough for an algorithm?",
      options: ["Add 2 cups of water and boil for 10 minutes", "Add some water", "Cook until it looks right", "Boil for a while"],
      correct: "a",
      explanation: "Every step must be unambiguous.",
      wrong: { b: "How much?", c: "Depends on judgement.", d: "How long?" },
    }),
    q({
      id: "wdq58-2", atom: "a-wd-pseudocode-flowcharts", d: 2,
      prompt: "In a flowchart, which shape is a decision?",
      options: ["A diamond", "A rectangle", "An oval", "A parallelogram"],
      correct: "a",
      explanation: "Diamonds have Yes and No exits.",
      wrong: { b: "Rectangles are actions.", c: "Ovals are start and end.", d: "Parallelograms are input and output." },
    }),
    q({
      id: "wdq58-3", atom: "a-wd-pseudocode-flowcharts", d: 3, type: "scenario",
      prompt: "Pseudocode: IF total >= 10000 THEN fee 0, ELSE IF total >= 5000 THEN fee 500, ELSE fee 1000. What is the fee for 10000?",
      options: ["0", "500", "1000", "Nothing"],
      correct: "a",
      explanation: "10000 >= 10000 is true, so the first branch runs.",
      wrong: { b: "The first condition is already true.", c: "The ELSE is never reached.", d: "One branch always runs." },
    }),
    q({
      id: "wdq58-4", atom: "a-wd-ipo", d: 2,
      prompt: "In a currency converter, what is the processing?",
      options: ["Multiplying the naira amount by the rate", "Typing the amount", "Showing the dollars", "The keyboard"],
      correct: "a",
      explanation: "Processing turns input into output.",
      wrong: { b: "That is input.", c: "That is output.", d: "That is hardware for input." },
    }),
  ]),

  ...check("wd-l59-variables-types", [
    q({
      id: "wdq59-1", atom: "a-wd-variables", d: 2,
      prompt: "When should you declare a variable with let instead of const?",
      options: ["When its value will be reassigned later", "Always", "Never", "Only for strings"],
      correct: "a",
      explanation: "const by default; let when you must reassign.",
      wrong: { b: "const prevents accidental changes, so prefer it.", c: "Counters and totals that change need let.", d: "Any type can be let or const." },
    }),
    q({
      id: "wdq59-2", atom: "a-wd-data-types", d: 2,
      prompt: "What is typeof \"42\"?",
      options: ["\"string\"", "\"number\"", "\"boolean\"", "\"undefined\""],
      correct: "a",
      explanation: "Quotes make it text.",
      wrong: { b: "42 without quotes is a number.", c: "Not true or false.", d: "It has a value." },
    }),
    q({
      id: "wdq59-3", atom: "a-wd-operators-expressions", d: 3,
      prompt: "What is \"5\" + 3?",
      options: ["\"53\"", "8", "\"8\"", "An error"],
      correct: "a",
      explanation: "+ with a string joins text: the 3 becomes \"3\".",
      wrong: { b: "Only if both were numbers.", c: "Nothing is added.", d: "It is valid." },
    }),
    q({
      id: "wdq59-4", atom: "a-wd-operators-expressions", d: 2,
      prompt: "What does 2 + 3 * 4 evaluate to?",
      options: ["14", "20", "24", "9"],
      correct: "a",
      explanation: "* before +: 3 * 4 = 12, then 2 + 12.",
      wrong: { b: "That would need (2 + 3) * 4.", c: "Not a possible reading.", d: "Not a possible reading." },
    }),
  ]),
};
