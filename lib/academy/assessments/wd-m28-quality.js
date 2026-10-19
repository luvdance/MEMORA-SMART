/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 28 · FRONTEND QUALITY AND TESTING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l127-readable-refactor", [
    q({ id: "wdq127-1", atom: "a-wd-readable-code", d: 2, prompt: "Which line is most readable?", options: ["const vat = price * VAT_RATE / 100;", "const d = p * 0.075;", "const x = a * b / c;", "const tmp2 = p*.075"], correct: "a",
      explanation: "Descriptive names and a named constant.",
      wrong: { b: "Magic number and cryptic names.", c: "Says nothing.", d: "Cryptic and unformatted." } }),
    q({ id: "wdq127-2", atom: "a-wd-refactoring", d: 2, prompt: "What is refactoring?", options: ["Changing code's structure without changing what it does", "Adding new features", "Fixing every bug", "Deleting tests"], correct: "a",
      explanation: "Behaviour stays the same; the code improves.",
      wrong: { b: "That is feature work.", c: "That is debugging.", d: "Tests make refactoring safe." } }),
    q({ id: "wdq127-3", atom: "a-wd-refactoring", d: 3, type: "scenario", prompt: "The same five lines appear in three files. A bug is found in them. What is the lasting fix?", options: ["Extract them into one shared function, fix it there, and use it in all three places", "Fix the bug in all three places", "Fix it in one place", "Leave it"], correct: "a",
      explanation: "One copy means one fix, now and in future.",
      wrong: { b: "Works today; the copies will drift again.", c: "Two places stay broken.", d: "The bug remains." } }),
    q({ id: "wdq127-4", atom: "a-wd-eslint", d: 2, prompt: "What does ESLint do?", options: ["Reads code without running it and reports likely bugs and bad patterns", "Runs your tests", "Deploys your site", "Formats CSS colours"], correct: "a",
      explanation: "Static analysis.",
      wrong: { b: "That is a test runner.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("wd-l128-unit-component-tests", [
    q({ id: "wdq128-1", atom: "a-wd-unit-tests", d: 2, prompt: "What are the three parts of a unit test?", options: ["Arrange the input, act by calling the code, assert the result", "Write, deploy, delete", "Plan, design, launch", "Open, save, close"], correct: "a",
      explanation: "Arrange, act, assert.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq128-2", atom: "a-wd-unit-tests", d: 3, prompt: "expect([1, 2]).toBe([1, 2]) fails. Why?", options: ["toBe compares identity, and these are two different arrays; use toEqual", "The arrays differ", "expect cannot take arrays", "Tests cannot use numbers"], correct: "a",
      explanation: "toEqual compares contents.",
      wrong: { b: "Their contents match.", c: "It can.", d: "They can." } }),
    q({ id: "wdq128-3", atom: "a-wd-component-tests", d: 2, prompt: "How do you test a function that renders a list into an element?", options: ["Create a detached element, call the function, and assert on the DOM it produced", "Look at the page by eye", "Only test the CSS", "It cannot be tested"], correct: "a",
      explanation: "Assert on what a user would see.",
      wrong: { b: "Not automated or repeatable.", c: "The behaviour is the DOM.", d: "It can." } }),
    q({ id: "wdq128-4", atom: "a-wd-unit-tests", d: 3, prompt: "How do you know a test is good?", options: ["It fails when the code it tests is broken", "It always passes", "It is long", "It has many comments"], correct: "a",
      explanation: "A test that cannot fail protects nothing.",
      wrong: { b: "A test that passes on broken code is useless.", c: "Length is irrelevant.", d: "Comments do not catch bugs." } }),
  ]),

  ...check("wd-l129-form-api-tests", [
    q({ id: "wdq129-1", atom: "a-wd-test-forms", d: 2, prompt: "Why keep validation rules in pure functions?", options: ["They can be tested quickly with many inputs, without a page", "They run faster in production", "Browsers require it", "It hides them"], correct: "a",
      explanation: "Pure logic is the easiest code to test.",
      wrong: { b: "Not the reason.", c: "Not required.", d: "Nothing is hidden." } }),
    q({ id: "wdq129-2", atom: "a-wd-test-api-errors", d: 3, prompt: "Why should tests use a fake fetch instead of the real API?", options: ["Real APIs can be slow or down, and cannot be made to fail on demand", "Real APIs are illegal in tests", "Fakes are more accurate", "fetch does not work in tests"], correct: "a",
      explanation: "Fakes make every path repeatable, especially errors.",
      wrong: { b: "Not illegal, just unreliable.", c: "Fakes are controllable, not more accurate.", d: "It works, but is unsuitable." } }),
    q({ id: "wdq129-3", atom: "a-wd-test-api-errors", d: 3, prompt: "What does passing fetchFn as a parameter to loadUser make possible?", options: ["Tests can give it a fake fetch: dependency injection", "Faster downloads", "Hiding the API key", "Nothing"], correct: "a",
      explanation: "The function no longer depends on the global fetch.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "It makes the code testable." } }),
    q({ id: "wdq129-4", atom: "a-wd-test-api-errors", d: 2, prompt: "Which fake simulates having no internet connection?", options: ["async () => { throw new TypeError(\"Failed to fetch\"); }", "async () => ({ ok: false, status: 404 })", "async () => ({ ok: true })", "() => 42"], correct: "a",
      explanation: "A rejected fetch is what a network failure looks like.",
      wrong: { b: "That is a 404 response.", c: "That is success.", d: "Not shaped like fetch at all." } }),
  ]),

  ...check("wd-l130-audits-production", [
    q({ id: "wdq130-1", atom: "a-wd-a11y-audits", d: 2, prompt: "Can an automated accessibility audit find every problem?", options: ["No: it catches many, and keyboard and screen-reader testing are still needed", "Yes, all of them", "It finds none", "Only on phones"], correct: "a",
      explanation: "Automated tools find perhaps a third of issues.",
      wrong: { b: "Many need human judgement.", c: "It finds a lot.", d: "Unrelated." } }),
    q({ id: "wdq130-2", atom: "a-wd-browser-compat", d: 2, prompt: "Every browser on an iPhone uses which engine?", options: ["Safari's (WebKit)", "Chrome's (Blink)", "Firefox's (Gecko)", "Each its own"], correct: "a",
      explanation: "Which is why testing on real Safari matters.",
      wrong: { b: "Not on iOS.", c: "Not on iOS.", d: "They share WebKit." } }),
    q({ id: "wdq130-3", atom: "a-wd-perf-profiling", d: 2, prompt: "What should you do before optimising a page's speed?", options: ["Measure it, for example with Lighthouse and the Performance panel", "Rewrite all the JavaScript", "Remove all images", "Buy a faster laptop"], correct: "a",
      explanation: "Measure, then fix the biggest problem.",
      wrong: { b: "Without measurement you may fix the wrong thing.", c: "Drastic and unmeasured.", d: "Your visitors' devices do not change." } }),
    q({ id: "wdq130-4", atom: "a-wd-production-debugging", d: 3, prompt: "After fixing a production bug, what stops it coming back?", options: ["A test that reproduces it", "A comment", "Restarting the server", "Nothing can"], correct: "a",
      explanation: "The test fails if the bug ever returns.",
      wrong: { b: "Comments do not run.", c: "Unrelated.", d: "A regression test can." } }),
  ]),
};
