/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 13 · TESTING AND DEBUGGING REACT APPLICATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l75-debugging-unit", [
    q({ id: "rxq75-1", atom: "a-rx-debug-tools", d: 2, prompt: "What is the first step in debugging?", options: ["Reproduce the bug reliably", "Rewrite the component", "Add a library", "Clear the cache"], correct: "a",
      explanation: "Then locate, find the cause, fix and verify.",
      wrong: { b: "Guessing.", c: "Unrelated.", d: "Rarely the cause." } }),
    q({ id: "rxq75-2", atom: "a-rx-stack-traces", d: 2, prompt: "\"Cannot read properties of undefined (reading 'map')\" usually means…", options: ["The value before .map is undefined, often data that has not loaded yet", "map is misspelled", "The array is empty", "React is broken"], correct: "a",
      explanation: "Start state as [] or handle loading.",
      wrong: { b: "That would be a different error.", c: "An empty array maps fine.", d: "Your code." } }),
    q({ id: "rxq75-3", atom: "a-rx-stack-traces", d: 2, prompt: "In a stack trace, which line should you look at first?", options: ["The first line that points into your own code", "The last line", "Any line in react-dom", "The line with the longest path"], correct: "a",
      explanation: "Library internals are rarely the cause.",
      wrong: { b: "Usually the oldest call.", c: "Library internals.", d: "Meaningless." } }),
    q({ id: "rxq75-4", atom: "a-rx-unit-tests", d: 2, prompt: "Which matcher compares the contents of two objects?", options: ["toEqual", "toBe", "toContain", "toThrow"], correct: "a",
      explanation: "toBe compares identity.",
      wrong: { b: "Two equal objects are not the same object.", c: "For arrays and strings.", d: "For errors." } }),
    q({ id: "rxq75-5", atom: "a-rx-unit-tests", d: 3, prompt: "Why is expect(applyDiscount(1, 150)).toThrow() wrong?", options: ["applyDiscount runs before expect, so it throws in the test itself; pass a function instead", "toThrow does not exist", "150 is valid", "It is correct"], correct: "a",
      explanation: "expect(() => applyDiscount(1, 150)).toThrow()",
      wrong: { b: "It exists.", c: "It is invalid input.", d: "The call must be wrapped." } }),
  ]),

  ...check("rx-l76-component-tests", [
    q({ id: "rxq76-1", atom: "a-rx-rtl-basics", d: 2, prompt: "Which query does React Testing Library recommend first?", options: ["getByRole", "getByTestId", "querySelector by class name", "getByText for everything"], correct: "a",
      explanation: "It queries the way assistive technology does.",
      wrong: { b: "A last resort.", c: "An implementation detail.", d: "Useful, but roles come first." } }),
    q({ id: "rxq76-2", atom: "a-rx-rtl-basics", d: 2, prompt: "Which query asserts that something is NOT on the page?", options: ["queryBy… returning null", "getBy…", "findBy…", "getAllBy…"], correct: "a",
      explanation: "getBy throws when nothing matches.",
      wrong: { b: "Throws.", c: "Waits and then throws.", d: "Throws on none." } }),
    q({ id: "rxq76-3", atom: "a-rx-interaction-tests", d: 2, prompt: "How should a test fill in a form field?", options: ["await user.type(screen.getByLabelText(\"Email\"), \"ada@example.com\")", "Set the component's state directly", "input.value = … without events", "Call the onChange prop by hand"], correct: "a",
      explanation: "user-event types like a person.",
      wrong: { b: "Implementation detail.", c: "React never sees it.", d: "Skips the real input." } }),
    q({ id: "rxq76-4", atom: "a-rx-async-tests", d: 3, prompt: "Why use await screen.findByText(…) rather than waiting 500ms?", options: ["It waits exactly as long as needed and fails clearly; fixed waits are slow and flaky", "Timers do not work in tests", "findBy is synchronous", "500ms is too short for React"], correct: "a",
      explanation: "Never use fixed sleeps.",
      wrong: { b: "They work, badly.", c: "It returns a promise.", d: "The issue is fixed waiting at all." } }),
  ]),

  ...check("rx-l77-mocks-routing", [
    q({ id: "rxq77-1", atom: "a-rx-mock-api", d: 2, prompt: "Why mock the API in component tests?", options: ["Tests stay fast and repeatable, and can force errors on demand", "Real APIs are illegal to call", "fetch does not exist in tests", "Mocks find more bugs than E2E tests"], correct: "a",
      explanation: "Control, speed and reliability.",
      wrong: { b: "Not the reason.", c: "It can.", d: "Different jobs." } }),
    q({ id: "rxq77-2", atom: "a-rx-mock-api", d: 3, prompt: "What does Mock Service Worker (MSW) do differently from replacing fetch?", options: ["It intercepts requests at the network level, so your real request code runs unchanged", "It calls the real server", "It only works in production", "It replaces React"], correct: "a",
      explanation: "The most realistic way to mock.",
      wrong: { b: "It intercepts.", c: "For tests and development.", d: "Unrelated." } }),
    q({ id: "rxq77-3", atom: "a-rx-routing-tests", d: 2, prompt: "How do you start a routing test at /courses/react?", options: ["Render inside <MemoryRouter initialEntries={[\"/courses/react\"]}>", "Set window.location", "Use BrowserRouter and reload", "It cannot be done"], correct: "a",
      explanation: "MemoryRouter keeps history in memory.",
      wrong: { b: "Reloads the test document.", c: "Not in tests.", d: "It can." } }),
    q({ id: "rxq77-4", atom: "a-rx-integration-tests", d: 2, prompt: "What does an integration test catch that a unit test misses?", options: ["Wrong wiring between components: props, callbacks and shared state", "Spelling mistakes", "Slow CSS", "Server crashes"], correct: "a",
      explanation: "It renders the real components together.",
      wrong: { b: "Linters help there.", c: "Unrelated.", d: "That needs server tests." } }),
  ]),

  ...check("rx-l78-e2e-flaky", [
    q({ id: "rxq78-1", atom: "a-rx-playwright", d: 2, prompt: "What does an end-to-end test with Playwright exercise?", options: ["The whole app, frontend and backend, in a real browser", "One function", "Only the CSS", "Only the database"], correct: "a",
      explanation: "Every real layer together.",
      wrong: { b: "That is a unit test.", c: "Too narrow.", d: "Too narrow." } }),
    q({ id: "rxq78-2", atom: "a-rx-playwright", d: 2, prompt: "How many E2E tests should a project have compared with component tests?", options: ["Fewer: a handful for critical journeys", "More than any other kind", "Exactly the same number", "None"], correct: "a",
      explanation: "They are slow and fragile, so keep them for what matters most.",
      wrong: { b: "Slow suites go unrun.", c: "No reason to match.", d: "They catch what nothing else can." } }),
    q({ id: "rxq78-3", atom: "a-rx-coverage", d: 3, prompt: "A file has 100% line coverage. What does that guarantee?", options: ["Every line ran during the tests, not that results were checked", "The code has no bugs", "Every edge case is tested", "The UI is accessible"], correct: "a",
      explanation: "Coverage measures execution, not verification.",
      wrong: { b: "Not at all.", c: "Missing branches of logic can still hide bugs.", d: "Unrelated." } }),
    q({ id: "rxq78-4", atom: "a-rx-flaky-tests", d: 2, prompt: "Which is a common cause of flaky tests?", options: ["Asserting before asynchronous work has finished", "Using getByRole", "Writing describe blocks", "Testing pure functions"], correct: "a",
      explanation: "Use findBy or waitFor.",
      wrong: { b: "Reliable.", c: "Harmless.", d: "The most reliable tests." } }),
  ]),

  ...check("rx-l79-lint-ci", [
    q({ id: "rxq79-1", atom: "a-rx-eslint-prettier", d: 2, prompt: "What is the difference between ESLint and Prettier?", options: ["ESLint finds bugs and risky patterns; Prettier only formats code", "They do the same thing", "Prettier finds bugs", "ESLint only formats"], correct: "a",
      explanation: "Keep their jobs separate.",
      wrong: { b: "Different jobs.", c: "Reversed.", d: "Reversed." } }),
    q({ id: "rxq79-2", atom: "a-rx-eslint-prettier", d: 2, prompt: "What does the react-hooks/exhaustive-deps rule catch?", options: ["Effects and callbacks that read values missing from their dependency arrays", "Unused CSS", "Slow renders", "Missing alt text"], correct: "a",
      explanation: "Those cause stale values.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "A different plugin." } }),
    q({ id: "rxq79-3", atom: "a-rx-ci", d: 2, prompt: "Why does CI use npm ci instead of npm install?", options: ["It installs exactly what package-lock.json records, cleanly", "It is the only command CI allows", "It skips devDependencies", "It updates every package"], correct: "a",
      explanation: "Reproducible installs.",
      wrong: { b: "Both run.", c: "It installs them.", d: "The opposite." } }),
    q({ id: "rxq79-4", atom: "a-rx-ci", d: 2, prompt: "What should happen when a CI check fails on a pull request?", options: ["The merge is blocked until it is fixed", "Merge anyway", "Delete the check", "Re-run until it passes by chance"], correct: "a",
      explanation: "Never let CI stay red.",
      wrong: { b: "Defeats CI.", c: "Removes protection.", d: "Hides flaky or real failures." } }),
  ]),

  ...check("rx-l80-m13-project", [
    q({ id: "rxq80-1", atom: "a-rx-m13-project", d: 3, prompt: "How do you know a test is meaningful?", options: ["It fails when the behaviour it covers is broken", "It passes", "It has a long name", "It increases coverage"], correct: "a",
      explanation: "Break the code and watch the test fail.",
      wrong: { b: "Empty tests pass.", c: "Unrelated.", d: "Coverage is not verification." } }),
    q({ id: "rxq80-2", atom: "a-rx-m13-project", d: 2, prompt: "Which is testing behaviour rather than implementation?", options: ["Choose Shoes, expect only Sandals in the list", "Expect the category state to be \"Shoes\"", "Expect setCategory to be called", "Expect the component to use useState"], correct: "a",
      explanation: "What the user sees.",
      wrong: { b: "Internal state.", c: "Internal detail.", d: "Internal detail." } }),
    q({ id: "rxq80-3", atom: "a-rx-m13-project", d: 2, prompt: "How do you test that Retry calls the loader again?", options: ["Use a vi.fn() loader and expect toHaveBeenCalledTimes(2) after clicking Retry", "Check the button's colour", "Wait two seconds", "Read the component's source"], correct: "a",
      explanation: "Mock functions record their calls.",
      wrong: { b: "Unrelated.", c: "A fixed wait.", d: "Not a test." } }),
    q({ id: "rxq80-4", atom: "a-rx-m13-project", d: 2, prompt: "How should the cart test add items?", options: ["Click the Add buttons with user-event, as a user would", "Call setLines directly", "Edit the component's source", "Assert on the internal lines array"], correct: "a",
      explanation: "Test through the UI.",
      wrong: { b: "Implementation detail.", c: "Not a test.", d: "Implementation detail." } }),
  ]),
};
