/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · PHASE 3 PROJECTS AND GATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l84-calculator", [
    q({ id: "wdq84-1", atom: "a-wd-p3-calc-plan", d: 2, prompt: "In what order should the calculator check for problems?", options: ["Inputs are numbers, then the operator is known, then the operation is possible", "Division by zero first", "The operator last, after calculating", "It does not matter"], correct: "a",
      explanation: "Each check depends on the earlier ones passing.",
      wrong: { b: "You cannot divide something that is not a number.", c: "You cannot calculate with an unknown operator.", d: "It decides which message the user sees." } }),
    q({ id: "wdq84-2", atom: "a-wd-p3-calc-brief", d: 2, prompt: "Why must the calculator convert a and b with Number()?", options: ["Form input arrives as text, and + would join the strings", "Number() makes it faster", "To round the result", "It does not need to"], correct: "a",
      explanation: "\"8\" + \"2\" is \"82\".",
      wrong: { b: "Speed is not the reason.", c: "Number() does not round.", d: "Without it, + is wrong." } }),
    q({ id: "wdq84-3", atom: "a-wd-p3-calc-build", d: 3, type: "scenario", prompt: "calculate(\"\", \"+\", \"1\") returns 1 instead of \"Invalid number\". Why?", options: ["Number(\"\") is 0, so empty input must be checked separately", "+ ignores empty strings", "1 is correct", "The switch is wrong"], correct: "a",
      explanation: "Trim and reject empty text before converting.",
      wrong: { b: "Number converts \"\" to 0.", c: "The specification says invalid.", d: "The bug is in validation." } }),
    q({ id: "wdq84-4", atom: "a-wd-p3-calc-build", d: 2, prompt: "Which structure suits choosing an action by operator symbol?", options: ["switch with a default case", "A for loop", "A while loop", "A template literal"], correct: "a",
      explanation: "Exact matches on one value, with default for anything else.",
      wrong: { b: "Nothing repeats.", c: "Nothing repeats.", d: "That builds strings." } }),
  ]),

  ...check("wd-l85-grades", [
    q({ id: "wdq85-1", atom: "a-wd-p3-grade-plan", d: 2, prompt: "Why should summary call evaluate instead of repeating its logic?", options: ["The grading rules then live in one place", "It is shorter to type the logic twice", "JavaScript forbids repeating code", "evaluate is faster"], correct: "a",
      explanation: "One source of truth for the rules.",
      wrong: { b: "Duplicated logic drifts apart.", c: "It is allowed, just unwise.", d: "Speed is not the point." } }),
    q({ id: "wdq85-2", atom: "a-wd-p3-grade-brief", d: 2, prompt: "What must happen for a student with no scores?", options: ["Average 0, grade F, not passed: never divide by zero", "NaN", "An error", "The student is deleted"], correct: "a",
      explanation: "The specification defines the edge case.",
      wrong: { b: "0 / 0 is NaN, which is why it is guarded.", c: "One student must not crash the report.", d: "Data is never silently removed." } }),
    q({ id: "wdq85-3", atom: "a-wd-p3-grade-build", d: 3, prompt: "How do you round 70.666… to one decimal place?", options: ["Math.round(x * 10) / 10", "Math.round(x)", "x.toFixed(1) and compare it with a number", "Math.floor(x * 10)"], correct: "a",
      explanation: "Gives the number 70.7.",
      wrong: { b: "Gives 71.", c: "toFixed returns a string.", d: "Gives 706." } }),
    q({ id: "wdq85-4", atom: "a-wd-p3-grade-build", d: 2, prompt: "Why should evaluate return new objects rather than adding grade to the students?", options: ["Pure functions do not change their input, so the original data stays trustworthy", "Objects cannot have new properties", "It uses less memory", "Grades must be strings"], correct: "a",
      explanation: "Callers can rely on their data being unchanged.",
      wrong: { b: "They can; it is a side effect.", c: "It uses slightly more.", d: "Unrelated." } }),
  ]),

  ...check("wd-l86-guessing-game", [
    q({ id: "wdq86-1", atom: "a-wd-p3-guess-plan", d: 3, prompt: "Why keep the guess count inside createGame rather than in a global variable?", options: ["Each game then has its own count, protected from other code", "Global variables cannot be numbers", "It runs faster", "It is required by the browser"], correct: "a",
      explanation: "Two games side by side stay independent.",
      wrong: { b: "They can be.", c: "Not the reason.", d: "Not required." } }),
    q({ id: "wdq86-2", atom: "a-wd-p3-guess-brief", d: 2, prompt: "Why does createGame take the secret as a parameter?", options: ["So the game can be tested with a known secret", "Random numbers are illegal", "To make it harder", "It must"], correct: "a",
      explanation: "A real game passes a random number; tests pass a fixed one.",
      wrong: { b: "Math.random is fine in the real game.", c: "Unrelated.", d: "It is a design choice for testability." } }),
    q({ id: "wdq86-3", atom: "a-wd-p3-guess-build", d: 2, prompt: "Which check rejects 4.5 as a guess?", options: ["Number.isInteger(n)", "n > 0", "typeof n === \"number\"", "n < 100"], correct: "a",
      explanation: "4.5 is a number but not a whole number.",
      wrong: { b: "4.5 is above 0.", c: "4.5 is a number.", d: "4.5 is below 100." } }),
    q({ id: "wdq86-4", atom: "a-wd-p3-guess-build", d: 3, type: "scenario", prompt: "A player wins, then guesses again and is told \"Too low\". What is missing?", options: ["A flag recording that the game is over, checked first", "A larger secret", "A loop", "A second game"], correct: "a",
      explanation: "State must include whether the game has ended.",
      wrong: { b: "Unrelated.", c: "Each guess is a call, not a loop.", d: "Unrelated." } }),
  ]),

  ...check("wd-l87-expenses", [
    q({ id: "wdq87-1", atom: "a-wd-p3-exp-plan", d: 2, prompt: "addExpense receives an amount of -500. What should it do?", options: ["Return the list unchanged", "Add it", "Change it to 500", "Delete the list"], correct: "a",
      explanation: "Reject invalid data where it enters.",
      wrong: { b: "Corrupts every total.", c: "Hides the mistake.", d: "Destroys good data." } }),
    q({ id: "wdq87-2", atom: "a-wd-p3-exp-brief", d: 2, prompt: "Which expression gives the total for March 2026 from expenses with \"YYYY-MM-DD\" dates?", options: ["list.filter((e) => e.date.startsWith(\"2026-03\")).reduce((t, e) => t + e.amount, 0)", "list.find((e) => e.date === \"2026-03\")", "list.length", "list.map((e) => e.amount)"], correct: "a",
      explanation: "Filter the month, then sum.",
      wrong: { b: "No date equals \"2026-03\" exactly, and find returns one item.", c: "Counts items.", d: "Returns an array of amounts, not a total." } }),
    q({ id: "wdq87-3", atom: "a-wd-p3-exp-build", d: 3, prompt: "Why is typeof amount === \"number\" checked as well as amount > 0?", options: ["\"500\" > 0 is true, so text would slip through", "typeof is faster", "Numbers can be negative", "It is not needed"], correct: "a",
      explanation: "Comparison coerces strings to numbers.",
      wrong: { b: "Not about speed.", c: "Negative numbers are caught by > 0.", d: "Text would be accepted." } }),
    q({ id: "wdq87-4", atom: "a-wd-p3-exp-build", d: 2, prompt: "What should biggest return for an empty list?", options: ["null", "0", "undefined from reduce", "An error"], correct: "a",
      explanation: "The specification says null; reduce on an empty array with no start value throws.",
      wrong: { b: "0 is not an expense.", c: "reduce without a start value throws on an empty array.", d: "An empty list is normal." } }),
  ]),

  ...check("wd-l88-score-analyzer", [
    q({ id: "wdq88-1", atom: "a-wd-p3-score-plan", d: 3, prompt: "For scores 52, 55, 58, 60 and 100, why is the median a better \"typical\" score than the mean?", options: ["The single high score pulls the mean up above most students", "The mean cannot be calculated", "The median is always higher", "They are always equal"], correct: "a",
      explanation: "The median resists outliers.",
      wrong: { b: "It can: 65.", c: "Here it is lower.", d: "Not with an outlier." } }),
    q({ id: "wdq88-2", atom: "a-wd-p3-score-brief", d: 2, prompt: "What is the median of [10, 40, 20, 30]?", options: ["25", "20", "30", "100"], correct: "a",
      explanation: "Sorted: 10, 20, 30, 40; the middle two average to 25.",
      wrong: { b: "Only one of the middle two.", c: "Only one of the middle two.", d: "That is the sum." } }),
    q({ id: "wdq88-3", atom: "a-wd-p3-score-build", d: 2, prompt: "Why sort a copy of the valid scores?", options: ["So the caller's array is not reordered", "Copies sort faster", "sort only works on copies", "To remove duplicates"], correct: "a",
      explanation: "sort changes the array it is called on.",
      wrong: { b: "Same speed.", c: "sort works on any array.", d: "Copying keeps duplicates." } }),
    q({ id: "wdq88-4", atom: "a-wd-p3-score-build", d: 3, prompt: "Why is the text \"70\" counted as invalid?", options: ["The specification counts only numbers; text from a sheet must be converted deliberately, not guessed at", "70 is out of range", "Strings cannot be compared", "It is a typo"], correct: "a",
      explanation: "Being explicit about types avoids silent coercion.",
      wrong: { b: "70 is in range.", c: "They can be, which is the risk.", d: "The rule is about type." } }),
  ]),

  ...check("wd-l89-quiz-engine", [
    q({ id: "wdq89-1", atom: "a-wd-p3-quiz-plan", d: 2, prompt: "What does storing questions as data give a quiz engine?", options: ["Questions can be added or changed without touching the marking code", "Faster marking", "Prettier questions", "Nothing"], correct: "a",
      explanation: "Data and logic are separate.",
      wrong: { b: "Not the point.", c: "Unrelated.", d: "It makes the engine reusable." } }),
    q({ id: "wdq89-2", atom: "a-wd-p3-quiz-build", d: 3, type: "scenario", prompt: "A student who chose option 0 is marked \"unanswered\". Which check caused it?", options: ["if (!answers[q.id]) — 0 is falsy", "if (answers[q.id] === undefined)", "chosen === q.answer", "Math.round"], correct: "a",
      explanation: "Test for undefined, not falsiness.",
      wrong: { b: "That correctly treats 0 as an answer.", c: "That compares the answer.", d: "Unrelated." } }),
    q({ id: "wdq89-3", atom: "a-wd-p3-quiz-brief", d: 2, prompt: "Two correct out of three is what percent, rounded?", options: ["67", "66", "70", "2"], correct: "a",
      explanation: "66.67 rounds to 67.",
      wrong: { b: "Rounding goes up from .67.", c: "Not 70.", d: "That is the count." } }),
    q({ id: "wdq89-4", atom: "a-wd-p3-quiz-build", d: 2, prompt: "What should mark return for a quiz with no questions?", options: ["percent 0 and not passed, without dividing by zero", "NaN", "100%", "An error"], correct: "a",
      explanation: "Guard the division.",
      wrong: { b: "0 / 0 is NaN; guard it.", c: "Nothing was answered.", d: "An empty quiz is not an error." } }),
  ]),

  ...check("wd-l90-p3-gate", [
    q({ id: "wdq90-1", atom: "a-wd-p3-gate-brief", d: 2, prompt: "What is compress(\"aabbbc\")?", options: ["\"a2b3c1\"", "\"abc\"", "\"a2b3c\"", "\"2a3b1c\""], correct: "a",
      explanation: "Each run becomes its character and its length.",
      wrong: { b: "Counts are needed.", c: "Single characters still get a count of 1.", d: "The character comes first." } }),
    q({ id: "wdq90-2", atom: "a-wd-p3-gate-brief", d: 3, prompt: "What is secondLargest([8, 8, 3])?", options: ["3", "8", "null", "11"], correct: "a",
      explanation: "Distinct values are 8 and 3.",
      wrong: { b: "8 is the largest; duplicates do not count twice.", c: "There are two distinct values.", d: "Not a sum." } }),
    q({ id: "wdq90-3", atom: "a-wd-p3-gate-build", d: 2, prompt: "What should you do before writing the gate's code?", options: ["Write test cases from the specification, including edge cases", "Search for answers", "Write the code as fast as possible", "Skip the edge cases"], correct: "a",
      explanation: "The method from Module 19.",
      wrong: { b: "The gate is about solving it yourself.", c: "Speed without understanding fails the edge cases.", d: "The checks test them." } }),
    q({ id: "wdq90-4", atom: "a-wd-p3-gate-review", d: 2, prompt: "After your solution passes, why refactor it?", options: ["Clear names and small functions make it maintainable, and the checks prove nothing broke", "Passing code is always clear", "To make it longer", "Refactoring is never useful"], correct: "a",
      explanation: "Make it work, then make it clear.",
      wrong: { b: "Not necessarily.", c: "Length is not the goal.", d: "It is a core professional habit." } }),
  ]),
};
