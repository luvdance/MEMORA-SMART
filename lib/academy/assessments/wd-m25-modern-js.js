/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 25 · MODERN JAVASCRIPT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l110-modules", [
    q({ id: "wdq110-1", atom: "a-wd-es-modules", d: 2, prompt: "A const declared at the top of a module file. Who can use it?", options: ["Only that module, unless it is exported", "Every script on the page", "Only the HTML", "Nobody"], correct: "a",
      explanation: "Module scope is private.",
      wrong: { b: "That is a classic script's global scope.", c: "HTML cannot use variables.", d: "The module itself can." } }),
    q({ id: "wdq110-2", atom: "a-wd-es-modules", d: 3, type: "scenario", prompt: "A page using modules works with Live Server but not when index.html is double-clicked. Why?", options: ["Modules must be loaded over http, not from file://", "Modules need internet", "Double-clicking disables JavaScript", "The browser is too old"], correct: "a",
      explanation: "Module loading is blocked for file:// pages.",
      wrong: { b: "A local server is enough.", c: "Scripts still run otherwise.", d: "Not the cause." } }),
    q({ id: "wdq110-3", atom: "a-wd-import-export", d: 2, prompt: "How is a default export imported?", options: ["import naira from \"./format.js\"", "import { default } from \"./format.js\"", "import * from format", "require(\"format\")"], correct: "a",
      explanation: "No braces, and any name you choose.",
      wrong: { b: "Not valid syntax for this.", c: "Not valid.", d: "That is CommonJS, not ES modules." } }),
    q({ id: "wdq110-4", atom: "a-wd-import-export", d: 2, prompt: "Which import path is correct for prices.js in the same folder?", options: ["\"./prices.js\"", "\"prices\"", "\"/prices\"", "\"prices.js\" without ./"], correct: "a",
      explanation: "Relative paths start with ./ and include .js in the browser.",
      wrong: { b: "Bare names need a bundler or import map.", c: "Root-relative and missing .js.", d: "Without ./ it is treated as a package name." } }),
  ]),

  ...check("wd-l111-optional-nullish", [
    q({ id: "wdq111-1", atom: "a-wd-optional-chaining", d: 2, prompt: "What is user.profile?.photo when user.profile is undefined?", options: ["undefined", "An error", "null", "\"\""], correct: "a",
      explanation: "?. short-circuits to undefined.",
      wrong: { b: "That is what ?. prevents.", c: "It gives undefined.", d: "Not an empty string." } }),
    q({ id: "wdq111-2", atom: "a-wd-nullish", d: 3, prompt: "What is 0 ?? 10?", options: ["0", "10", "null", "false"], correct: "a",
      explanation: "?? only replaces null and undefined.",
      wrong: { b: "That is 0 || 10.", c: "Not null.", d: "Not false." } }),
    q({ id: "wdq111-3", atom: "a-wd-nullish", d: 2, type: "scenario", prompt: "A volume setting of 0 keeps turning into 50. The code is settings.volume || 50. What fixes it?", options: ["settings.volume ?? 50", "settings.volume && 50", "Number(settings.volume) || 50", "settings.volume || 0"], correct: "a",
      explanation: "Keeps 0, replaces only missing values.",
      wrong: { b: "Gives 0 or 50 the wrong way round.", c: "Still replaces 0.", d: "Never defaults to 50." } }),
    q({ id: "wdq111-4", atom: "a-wd-modern-patterns", d: 2, prompt: "What does Object.entries({ a: 1, b: 2 }) return?", options: ["[[\"a\", 1], [\"b\", 2]]", "[\"a\", \"b\"]", "[1, 2]", "{ a: 1, b: 2 }"], correct: "a",
      explanation: "An array of [key, value] pairs.",
      wrong: { b: "That is Object.keys.", c: "That is Object.values.", d: "That is the object itself." } }),
  ]),

  ...check("wd-l112-sets-maps-regex", [
    q({ id: "wdq112-1", atom: "a-wd-sets-maps", d: 2, prompt: "What is new Set([1, 1, 2, 3, 3]).size?", options: ["3", "5", "2", "1"], correct: "a",
      explanation: "A Set keeps unique values: 1, 2, 3.",
      wrong: { b: "Duplicates are removed.", c: "Three distinct values.", d: "Three distinct values." } }),
    q({ id: "wdq112-2", atom: "a-wd-sets-maps", d: 3, prompt: "When is a Map better than a plain object?", options: ["When keys are not strings, or entries are added and removed often", "Never", "Only for numbers as values", "When you need JSON"], correct: "a",
      explanation: "Maps take any key type and track size and order.",
      wrong: { b: "Maps have clear uses.", c: "Values can be anything in both.", d: "Objects serialise to JSON more easily." } }),
    q({ id: "wdq112-3", atom: "a-wd-regex", d: 3, prompt: "What does /^\\d{11}$/ match?", options: ["A string of exactly 11 digits and nothing else", "Any string containing 11", "11 letters", "Up to 11 digits"], correct: "a",
      explanation: "^ and $ anchor; \\d{11} is exactly eleven digits.",
      wrong: { b: "It matches digits, not the number 11.", c: "\\d is digits.", d: "{11} is exactly eleven." } }),
    q({ id: "wdq112-4", atom: "a-wd-regex", d: 2, prompt: "What does \"a  b   c\".replace(/\\s+/g, \" \") return?", options: ["\"a b c\"", "\"abc\"", "\"a  b   c\"", "\"a_b_c\""], correct: "a",
      explanation: "Each run of whitespace becomes one space.",
      wrong: { b: "Spaces are replaced, not removed.", c: "It changes the string.", d: "The replacement is a space." } }),
  ]),

  ...check("wd-l113-generators-loop-organisation", [
    q({ id: "wdq113-1", atom: "a-wd-generators", d: 3, prompt: "Why does a generator with while (true) not freeze the page?", options: ["It pauses at each yield until the next value is asked for", "Generators run in another thread", "while (true) is ignored in generators", "It does freeze"], correct: "a",
      explanation: "Values are produced lazily, one per next().",
      wrong: { b: "Same thread.", c: "The loop is real; it just pauses.", d: "It does not." } }),
    q({ id: "wdq113-2", atom: "a-wd-event-loop", d: 3, prompt: "After the current code finishes, what runs first: a resolved promise's then callback, or a setTimeout(fn, 0) callback?", options: ["The promise callback (a microtask)", "The timer callback", "Whichever was written first", "They run at the same time"], correct: "a",
      explanation: "All microtasks run before the next task.",
      wrong: { b: "Timers are tasks, after microtasks.", c: "Order of writing does not decide it.", d: "One thing at a time." } }),
    q({ id: "wdq113-3", atom: "a-wd-event-loop", d: 2, prompt: "Why does a long-running loop make buttons stop responding?", options: ["Click handlers cannot run until the current code finishes", "Loops delete event listeners", "Buttons are disabled by loops", "The browser crashes"], correct: "a",
      explanation: "One thread: the event loop waits for the stack to clear.",
      wrong: { b: "Listeners remain.", c: "Nothing disables them.", d: "It is unresponsive, not necessarily crashed." } }),
    q({ id: "wdq113-4", atom: "a-wd-separation-of-concerns", d: 2, prompt: "In a well-separated frontend, what should a logic module never do?", options: ["Touch the DOM", "Return values", "Use arrays", "Be imported"], correct: "a",
      explanation: "Pure logic stays testable anywhere.",
      wrong: { b: "Returning values is its job.", c: "Arrays are data.", d: "It exists to be imported." } }),
  ]),
};
