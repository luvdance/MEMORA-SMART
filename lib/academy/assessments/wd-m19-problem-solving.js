/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 19 · PROBLEM-SOLVING AND ALGORITHMS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l80-requirements", [
    q({ id: "wdq80-1", atom: "a-wd-break-down", d: 2, prompt: "What is the first step with a large, unfamiliar problem?", options: ["Break it into smaller tasks that can each be solved and tested", "Start typing the whole solution", "Search for a finished program", "Pick the fastest algorithm"], correct: "a",
      explanation: "Decomposition makes each piece manageable.",
      wrong: { b: "Leads to tangled code.", c: "You learn nothing and may not meet the requirements.", d: "First understand the problem." } }),
    q({ id: "wdq80-2", atom: "a-wd-requirements", d: 3, type: "scenario", prompt: "The requirement is \"the discount applies to large orders\". What is the problem?", options: ["\"Large\" is not testable; it needs a precise threshold, such as ₦20,000 or more", "Discounts cannot be programmed", "Nothing", "It should say \"small orders\""], correct: "a",
      explanation: "Requirements must be precise enough to test.",
      wrong: { b: "They can.", c: "The threshold is undefined.", d: "The direction is not the issue." } }),
    q({ id: "wdq80-3", atom: "a-wd-inputs-outputs", d: 2, prompt: "What should a function specification include?", options: ["The inputs, the outputs, and example inputs with their expected outputs", "Only the function's name", "The colour of the page", "The programmer's name"], correct: "a",
      explanation: "Examples turn the specification into tests.",
      wrong: { b: "A name says too little.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq80-4", atom: "a-wd-requirements", d: 2, prompt: "You cannot ask the client about an edge case. What do you do?", options: ["Make a reasonable decision and write it down as an assumption", "Ignore the edge case", "Stop the project", "Choose randomly each time"], correct: "a",
      explanation: "A documented assumption can be checked later.",
      wrong: { b: "It will come back as a bug.", c: "Out of proportion.", d: "Unpredictable behaviour is a bug." } }),
  ]),

  ...check("wd-l81-trace-tests", [
    q({ id: "wdq81-1", atom: "a-wd-tracing", d: 2, prompt: "What is a trace table?", options: ["A record of every variable's value after each step of a dry run", "A table in HTML", "A list of errors", "A database"], correct: "a",
      explanation: "It makes the program's behaviour visible step by step.",
      wrong: { b: "Unrelated.", c: "It records values, not errors.", d: "Unrelated." } }),
    q({ id: "wdq81-2", atom: "a-wd-test-cases", d: 3, prompt: "A grading function has a band at 70. Which test values matter most?", options: ["69, 70 and 71", "50 and 90", "70 only", "Any random value"], correct: "a",
      explanation: "Just below, at and just above the boundary.",
      wrong: { b: "Far from the boundary, they miss off-by-one errors.", c: "Needs both sides.", d: "Random values rarely hit boundaries." } }),
    q({ id: "wdq81-3", atom: "a-wd-test-cases", d: 2, prompt: "When should you write a test case's expected output?", options: ["Before running the code", "After running it, by copying what it printed", "Never", "Only if it fails"], correct: "a",
      explanation: "Copying the output just confirms whatever the code does, bugs included.",
      wrong: { b: "That tests nothing.", c: "Then there is nothing to compare.", d: "You need it to know whether it failed." } }),
    q({ id: "wdq81-4", atom: "a-wd-test-cases", d: 3, type: "scenario", prompt: "A leap-year function passes tests for 2023 and 2024. Why might it still be wrong?", options: ["Neither test makes the century rules matter, such as 1900 or 2000", "Two tests are always enough", "Leap years cannot be tested", "2024 is not a leap year"], correct: "a",
      explanation: "Choose tests that make each rule matter.",
      wrong: { b: "Not if they miss whole rules.", c: "They can.", d: "It is." } }),
  ]),

  ...check("wd-l82-max-count-search", [
    q({ id: "wdq82-1", atom: "a-wd-max-min", d: 3, prompt: "Why should a maximum-finder start with the first element rather than 0?", options: ["If every value is negative, starting at 0 returns 0, which is not in the list", "0 is not a number", "It is faster", "It makes no difference"], correct: "a",
      explanation: "The starting value must be a real candidate.",
      wrong: { b: "0 is a number.", c: "Speed is the same.", d: "It does, for negative lists." } }),
    q({ id: "wdq82-2", atom: "a-wd-counting", d: 2, prompt: "In counts[v] = (counts[v] || 0) + 1, what does || 0 handle?", options: ["The first time v is seen, when counts[v] is undefined", "Negative counts", "Strings", "Duplicates"], correct: "a",
      explanation: "undefined || 0 gives 0, so the first count is 1.",
      wrong: { b: "Counts are never negative.", c: "Keys are strings anyway.", d: "Duplicates are what is being counted." } }),
    q({ id: "wdq82-3", atom: "a-wd-searching", d: 2, prompt: "What should a linear search return when the target is not found?", options: ["-1", "0", "The last index", "true"], correct: "a",
      explanation: "0 is a real index, so -1 is the conventional \"not found\".",
      wrong: { b: "0 means found at the start.", c: "Misleading.", d: "Search returns a position." } }),
    q({ id: "wdq82-4", atom: "a-wd-searching", d: 3, prompt: "What does binary search require?", options: ["A sorted list", "An unsorted list", "Exactly 100 items", "Only strings"], correct: "a",
      explanation: "It discards half the list each step, which only works if the order is known.",
      wrong: { b: "It fails on unsorted data.", c: "Any size.", d: "Any comparable values." } }),
  ]),

  ...check("wd-l83-classic-algorithms", [
    q({ id: "wdq83-1", atom: "a-wd-sorting", d: 3, prompt: "What does [5, 25, 100].sort() return?", options: ["[100, 25, 5]", "[5, 25, 100]", "[100, 5, 25]", "An error"], correct: "a",
      explanation: "Without a compare function, sort compares text: \"100\" < \"25\" < \"5\".",
      wrong: { b: "That needs (a, b) => a - b.", c: "\"25\" comes before \"5\".", d: "It is valid." } }),
    q({ id: "wdq83-2", atom: "a-wd-palindrome", d: 2, prompt: "How do you reverse the string text?", options: ["text.split(\"\").reverse().join(\"\")", "text.reverse()", "reverse(text)", "text.sort()"], correct: "a",
      explanation: "Strings have no reverse; arrays do.",
      wrong: { b: "Not a string method.", c: "Not a built-in function.", d: "Sorting is not reversing." } }),
    q({ id: "wdq83-3", atom: "a-wd-number-classification", d: 3, prompt: "Why test divisors of n only up to its square root when checking for a prime?", options: ["Any factor larger than the square root pairs with a smaller one already tested", "Larger numbers cannot divide", "It is a guess", "Square roots are always prime"], correct: "a",
      explanation: "For 91 = 7 × 13, finding 7 is enough.",
      wrong: { b: "They can, but their partner is smaller.", c: "It is a proof.", d: "Not true." } }),
    q({ id: "wdq83-4", atom: "a-wd-efficiency", d: 3, prompt: "Checking for duplicates with a loop inside a loop over n items takes about how many steps?", options: ["n × n", "n", "2", "log n"], correct: "a",
      explanation: "Quadratic. A Set does it in one pass, about n steps.",
      wrong: { b: "That is the Set approach.", c: "Not for any size of list.", d: "That is binary search." } }),
  ]),
};
