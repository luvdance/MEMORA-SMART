/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 18 · STRINGS, NUMBERS AND ERRORS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l76-strings", [
    q({ id: "wdq76-1", atom: "a-wd-string-methods", d: 2, prompt: "What is \"  Lagos  \".trim().length?", options: ["5", "9", "7", "0"], correct: "a",
      explanation: "trim removes the four spaces, leaving \"Lagos\".",
      wrong: { b: "That is the length before trimming.", c: "All spaces at both ends are removed.", d: "The word remains." } }),
    q({ id: "wdq76-2", atom: "a-wd-string-methods", d: 3, type: "scenario", prompt: "name.toUpperCase(); console.log(name); still prints lower case. Why?", options: ["Strings never change in place; the method returned a new string that was not stored", "toUpperCase is broken", "console.log ignores case", "name must be const"], correct: "a",
      explanation: "Store the result: name = name.toUpperCase().",
      wrong: { b: "It works; the result was discarded.", c: "console.log prints exactly.", d: "Unrelated." } }),
    q({ id: "wdq76-3", atom: "a-wd-string-methods", d: 2, prompt: "What is \"a-b-c\".split(\"-\")?", options: ["[\"a\", \"b\", \"c\"]", "\"abc\"", "3", "[\"a-b-c\"]"], correct: "a",
      explanation: "split breaks a string into an array at each separator.",
      wrong: { b: "That would be split then join(\"\").", c: "split returns an array, not a count.", d: "The separator is found." } }),
    q({ id: "wdq76-4", atom: "a-wd-template-literals", d: 2, prompt: "With qty = 3, what is `Items: ${qty * 2}`?", options: ["\"Items: 6\"", "\"Items: ${qty * 2}\"", "\"Items: qty * 2\"", "\"Items: 32\""], correct: "a",
      explanation: "The expression inside ${ } is evaluated and inserted.",
      wrong: { b: "In backticks the placeholder is evaluated.", c: "It is evaluated, not printed.", d: "Multiplication, not joining." } }),
  ]),

  ...check("wd-l77-numbers", [
    q({ id: "wdq77-1", atom: "a-wd-number-conversion", d: 2, prompt: "What is Number(\"12px\")?", options: ["NaN", "12", "\"12\"", "0"], correct: "a",
      explanation: "Number needs the whole string to be numeric.",
      wrong: { b: "parseInt would give 12.", c: "It returns a number type.", d: "That is Number(\"\")." } }),
    q({ id: "wdq77-2", atom: "a-wd-coercion", d: 3, prompt: "Two inputs hold \"500\" and \"300\". What does a.value + b.value give?", options: ["\"500300\"", "800", "NaN", "\"800\""], correct: "a",
      explanation: "Input values are strings, and + joins strings. Convert with Number() first.",
      wrong: { b: "Only after converting.", c: "Joining strings is not NaN.", d: "Nothing is added." } }),
    q({ id: "wdq77-3", atom: "a-wd-nan", d: 3, prompt: "Why does x === NaN never work as a check?", options: ["NaN is not equal to anything, even itself", "NaN is a string", "=== cannot compare numbers", "NaN is undefined"], correct: "a",
      explanation: "Use Number.isNaN(x) or Number.isFinite(x).",
      wrong: { b: "typeof NaN is \"number\".", c: "It can.", d: "NaN is a number value." } }),
    q({ id: "wdq77-4", atom: "a-wd-nan", d: 2, prompt: "Which check best confirms that a value is a real, usable number?", options: ["Number.isFinite(value)", "typeof value === \"number\"", "value == true", "value !== \"\""], correct: "a",
      explanation: "It rejects NaN and Infinity, which are still of type number.",
      wrong: { b: "NaN and Infinity pass it.", c: "Not a numeric check.", d: "Says nothing about being a number." } }),
  ]),

  ...check("wd-l78-maths-dates", [
    q({ id: "wdq78-1", atom: "a-wd-rounding", d: 3, prompt: "Why is 0.1 + 0.2 !== 0.3 in JavaScript?", options: ["Binary floating point cannot store most decimals exactly", "JavaScript has a bug in addition", "0.3 is too small", "+ joins numbers as strings"], correct: "a",
      explanation: "It is true in almost every language. Work in whole units for money.",
      wrong: { b: "It follows the IEEE 754 standard exactly.", c: "Size is not the issue.", d: "Both are numbers." } }),
    q({ id: "wdq78-2", atom: "a-wd-rounding", d: 2, prompt: "What is the safest way to add money amounts such as ₦10.10 and ₦20.20?", options: ["Store them as whole kobo (1010 and 2020), add, then divide by 100 to display", "Add the decimals directly", "Use strings", "Round each to the nearest naira"], correct: "a",
      explanation: "Whole numbers are exact.",
      wrong: { b: "Floating-point error can creep in.", c: "Strings join instead of adding.", d: "Loses the kobo." } }),
    q({ id: "wdq78-3", atom: "a-wd-maths", d: 2, prompt: "45 students travel in buses of 14. Which gives the number of buses?", options: ["Math.ceil(45 / 14)", "Math.floor(45 / 14)", "Math.round(45 / 14)", "45 % 14"], correct: "a",
      explanation: "3.2 buses means 4: round up.",
      wrong: { b: "Gives 3, leaving students behind.", c: "Also gives 3.", d: "That is the remainder, 3." } }),
    q({ id: "wdq78-4", atom: "a-wd-dates", d: 3, prompt: "new Date(\"2026-03-14\").getMonth() returns what?", options: ["2", "3", "14", "2026"], correct: "a",
      explanation: "Months are counted from 0, so March is 2.",
      wrong: { b: "January is 0, not 1.", c: "That is getDate().", d: "That is getFullYear()." } }),
  ]),

  ...check("wd-l79-errors-debugging", [
    q({ id: "wdq79-1", atom: "a-wd-common-errors", d: 2, prompt: "What does \"TypeError: total.toFixd is not a function\" point to?", options: ["A misspelled method name: toFixed", "A missing variable", "A syntax error", "A network problem"], correct: "a",
      explanation: "toFixd does not exist, so it is undefined, and calling undefined fails.",
      wrong: { b: "That would be a ReferenceError.", c: "The code parsed fine.", d: "Unrelated." } }),
    q({ id: "wdq79-2", atom: "a-wd-stack-traces", d: 3, prompt: "In a stack trace, what is the top \"at\" line?", options: ["Where the error was thrown", "Where the program started", "The fix", "The last line of the file"], correct: "a",
      explanation: "Lines below it are the calls that led there.",
      wrong: { b: "The starting point is at the bottom.", c: "It shows where, not how to fix.", d: "Unrelated to file order." } }),
    q({ id: "wdq79-3", atom: "a-wd-console-debugging", d: 2, prompt: "Why label debug logs, as in console.log(\"subtotal\", subtotal)?", options: ["So you can tell which value each line of output is", "Labels make code faster", "console.log requires two arguments", "To hide the value"], correct: "a",
      explanation: "Unlabelled numbers in a console are easy to confuse.",
      wrong: { b: "No speed effect.", c: "One argument is fine.", d: "It shows the value." } }),
    q({ id: "wdq79-4", atom: "a-wd-breakpoints", d: 2, prompt: "What does the debugger; statement do when the DevTools are open?", options: ["Pauses the program on that line so you can inspect variables and step through", "Fixes the bug", "Deletes the line", "Prints every variable"], correct: "a",
      explanation: "It acts as a breakpoint written in code.",
      wrong: { b: "It helps you find it.", c: "Nothing is deleted.", d: "You inspect them; it does not print." } }),
  ]),
};
