/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 18 · TESTING MOBILE APPLICATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l113-devices", [
    q({ id: "mdq113-1", atom: "a-md-manual-testing", d: 2, prompt: "Most of your users have budget Android phones. Which device must be in your test matrix?", options: ["A low-to-mid-range Android phone", "Only the newest iPhone", "Only a tablet", "Only the simulator"], correct: "a",
      explanation: "Test where your users are.",
      wrong: { b: "Hides Android and performance problems.", c: "Not your users.", d: "Not a real phone." } }),
    q({ id: "mdq113-2", atom: "a-md-manual-testing", d: 2, prompt: "Why test a release build before shipping?", options: ["It behaves differently from a development build: speed, errors, no dev menu", "Development builds can't run", "Stores require screenshots of it", "It's smaller"], correct: "a",
      explanation: "Test what users get.",
      wrong: { b: "They can.", c: "No.", d: "Not the reason." } }),
    q({ id: "mdq113-3", atom: "a-md-emulators-testing", d: 1, prompt: "What do you need to run Apple's iOS Simulator?", options: ["A Mac with Xcode", "Windows with Android Studio", "Expo Go", "An Apple Watch"], correct: "a",
      explanation: "macOS only.",
      wrong: { b: "That's the Android emulator.", c: "Runs on real phones.", d: "No." } }),
    q({ id: "mdq113-4", atom: "a-md-emulators-testing", d: 2, prompt: "What can an emulator NOT tell you reliably?", options: ["How fast the app is on users' phones", "How the layout looks at another size", "How dark mode looks", "Whether a deep link opens"], correct: "a",
      explanation: "It runs on your computer's CPU.",
      wrong: { b: "Good for that.", c: "Good for that.", d: "Good for that." } }),
  ]),

  ...check("md-l114-unit-component", [
    q({ id: "mdq114-1", atom: "a-md-unit-tests", d: 2, prompt: "Where do bugs in rules usually hide?", options: ["At the edges: limits, zero, rounding, odd input", "In the middle of the range", "In comments", "In test names"], correct: "a",
      explanation: "Test the boundaries.",
      wrong: { b: "Usually fine.", c: "No.", d: "No." } }),
    q({ id: "mdq114-2", atom: "a-md-unit-tests", d: 3, prompt: "How do you know your tests are good, not just passing?", options: ["Break the code on purpose: a good suite fails", "They all pass", "There are many of them", "They run fast"], correct: "a",
      explanation: "Mutation testing.",
      wrong: { b: "Passing proves little.", c: "Quantity isn't quality.", d: "Speed isn't coverage." } }),
    q({ id: "mdq114-3", atom: "a-md-component-tests", d: 2, prompt: "Which query best finds a button in a component test?", options: ["getByRole(\"button\", { name: \"More\" })", "A CSS class", "The component's internal state", "The third View"], correct: "a",
      explanation: "How users and screen readers find it.",
      wrong: { b: "No classes in RN.", c: "Implementation detail.", d: "Fragile." } }),
    q({ id: "mdq114-4", atom: "a-md-component-tests", d: 2, prompt: "How do you check a callback prop was used correctly?", options: ["Pass jest.fn() and expect toHaveBeenCalledWith", "Read the source", "console.log in the component", "Check the style"], correct: "a",
      explanation: "A mock function records calls.",
      wrong: { b: "Not a test.", c: "Not automated.", d: "Unrelated." } }),
  ]),

  ...check("md-l115-integration-e2e", [
    q({ id: "mdq115-1", atom: "a-md-integration-tests", d: 2, prompt: "Which tool mounts real Expo Router screens in a test?", options: ["renderRouter from expo-router/testing-library", "Maestro", "jest.mock(\"expo-router\")", "npx expo start"], correct: "a",
      explanation: "Then assert toHavePathname.",
      wrong: { b: "E2E on a phone.", c: "Replaces the router.", d: "Runs the app." } }),
    q({ id: "mdq115-2", atom: "a-md-integration-tests", d: 2, prompt: "What does an integration test catch that unit tests don't?", options: ["Pieces that work alone but not together, such as a guard in the wrong place", "Typos in a function", "Rounding errors", "Slow loops"], correct: "a",
      explanation: "Wiring bugs.",
      wrong: { b: "Unit tests.", c: "Unit tests.", d: "Profiling." } }),
    q({ id: "mdq115-3", atom: "a-md-e2e", d: 2, prompt: "What is a Maestro flow?", options: ["A YAML file of steps that drive the real app like a user", "A Jest test", "A GitHub Action", "A design file"], correct: "a",
      explanation: "launchApp, tapOn, assertVisible…",
      wrong: { b: "No.", c: "Can run one.", d: "No." } }),
    q({ id: "mdq115-4", atom: "a-md-e2e", d: 3, prompt: "Why write only a few E2E tests?", options: ["They're slow and fragile; most checks belong lower in the pyramid", "They can't find bugs", "Stores limit them", "Maestro allows only five"], correct: "a",
      explanation: "Many unit, fewer integration, few E2E.",
      wrong: { b: "They find important ones.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l116-forms-mocks", [
    q({ id: "mdq116-1", atom: "a-md-testing-flows", d: 2, prompt: "Why give SignUpForm an onSubmit prop instead of importing the API inside it?", options: ["Tests can pass a mock and check what would be sent", "It's faster", "Imports don't work in forms", "React requires it"], correct: "a",
      explanation: "Dependency injection makes code testable.",
      wrong: { b: "No.", c: "They do.", d: "No." } }),
    q({ id: "mdq116-2", atom: "a-md-testing-flows", d: 2, prompt: "What should a form test check after valid input?", options: ["What was sent (cleaned) and what the user sees", "Only that no error is thrown", "The colours", "The internal state"], correct: "a",
      explanation: "Both sides of the behaviour.",
      wrong: { b: "Too little.", c: "Not behaviour.", d: "Implementation." } }),
    q({ id: "mdq116-3", atom: "a-md-mocking-network", d: 2, prompt: "How do you simulate no network in a Jest test?", options: ["Mock fetch to reject with a TypeError", "Unplug the computer", "Return status 0", "Delete the server"], correct: "a",
      explanation: "fetch rejects when offline.",
      wrong: { b: "Not automated.", c: "Not how fetch behaves.", d: "No." } }),
    q({ id: "mdq116-4", atom: "a-md-mocking-network", d: 2, prompt: "Why restore mocks after each test?", options: ["So one test's fake network doesn't leak into the next", "Jest requires it", "To speed tests up", "To save memory"], correct: "a",
      explanation: "Independent tests.",
      wrong: { b: "Good practice, not required.", c: "Not mainly.", d: "Not mainly." } }),
  ]),

  ...check("md-l117-sizes-networks", [
    q({ id: "mdq117-1", atom: "a-md-screen-sizes", d: 2, prompt: "Which hook updates when the phone rotates?", options: ["useWindowDimensions", "useState", "useRef", "useMemo"], correct: "a",
      explanation: "Re-renders with the new size.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq117-2", atom: "a-md-screen-sizes", d: 2, prompt: "Why use minHeight instead of height on cards with text?", options: ["Users can scale text up; fixed heights clip it", "minHeight is faster", "height doesn't work", "For dark mode"], correct: "a",
      explanation: "Respect font scaling.",
      wrong: { b: "No.", c: "It does.", d: "No." } }),
    q({ id: "mdq117-3", atom: "a-md-slow-networks", d: 2, prompt: "How can a test of a 10-second timeout run instantly?", options: ["Jest fake timers: advanceTimersByTime(10000)", "Wait 10 seconds", "Set timeoutMs to 0 in the app", "Skip it"], correct: "a",
      explanation: "Time is simulated.",
      wrong: { b: "Slow.", c: "Changes the app.", d: "No." } }),
    q({ id: "mdq117-4", atom: "a-md-slow-networks", d: 1, prompt: "Which iPhone setting simulates a slow network?", options: ["Network Link Conditioner (Developer settings)", "Airplane mode only", "Low Power Mode", "Screen Time"], correct: "a",
      explanation: "Also on macOS for the Simulator.",
      wrong: { b: "That's no network.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l118-debugging", [
    q({ id: "mdq118-1", atom: "a-md-debugging-render", d: 3, prompt: "After deleting the first row, its checkbox state appears on the next item. Why?", options: ["Rows are keyed by index, so React reuses the wrong component", "State is global", "FlatList is broken", "The checkbox is uncontrolled"], correct: "a",
      explanation: "Use the item's id as key.",
      wrong: { b: "It's per row.", c: "No.", d: "Not the cause." } }),
    q({ id: "mdq118-2", atom: "a-md-debugging-render", d: 1, prompt: "Which key opens React Native DevTools from the npx expo start terminal?", options: ["j", "r", "a", "w"], correct: "a",
      explanation: "Components, Console, Sources, Profiler.",
      wrong: { b: "Reload.", c: "Android.", d: "Web." } }),
    q({ id: "mdq118-3", atom: "a-md-logs-stack-traces", d: 2, prompt: "Where do you start reading a stack trace?", options: ["The message, then the first frame in your own code", "The last line", "The node_modules frames", "The timestamp"], correct: "a",
      explanation: "Top-down.",
      wrong: { b: "Oldest call.", c: "The path, not the cause.", d: "No." } }),
    q({ id: "mdq118-4", atom: "a-md-logs-stack-traces", d: 2, prompt: "Why does a release crash show index.android.bundle:1:84213?", options: ["The code is minified; upload source maps to symbolicate it", "The crash is in Android", "The bundle is corrupt", "Hermes hides errors"], correct: "a",
      explanation: "Source maps restore file and line.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq118-5", atom: "a-md-memory-leaks", d: 2, prompt: "What's the rule that prevents most leaks in components?", options: ["Everything an effect starts, its clean-up stops", "Never use effects", "Use more state", "Restart the app often"], correct: "a",
      explanation: "clearInterval, remove(), close(), abort().",
      wrong: { b: "Unrealistic.", c: "Unrelated.", d: "No." } }),
  ]),

  ...check("md-l119-regression-crashes", [
    q({ id: "mdq119-1", atom: "a-md-regression", d: 2, prompt: "A bug is reported. What do you write first?", options: ["A test that reproduces it and fails", "The fix", "A release note", "An apology"], correct: "a",
      explanation: "Then fix until it passes; keep it forever.",
      wrong: { b: "No proof it's fixed.", c: "Later.", d: "Later." } }),
    q({ id: "mdq119-2", atom: "a-md-regression", d: 2, prompt: "What stops a change that breaks old behaviour from being merged?", options: ["The test suite running in CI on every pull request", "Code comments", "A longer README", "Manual memory"], correct: "a",
      explanation: "GitHub Actions or EAS Workflows.",
      wrong: { b: "No.", c: "No.", d: "Unreliable." } }),
    q({ id: "mdq119-3", atom: "a-md-crash-reports", d: 2, prompt: "What do breadcrumbs in a crash report give you?", options: ["The screens and actions before the crash", "The user's password", "The source code", "A fix"], correct: "a",
      explanation: "How to reproduce it.",
      wrong: { b: "Never.", c: "No.", d: "No." } }),
    q({ id: "mdq119-4", atom: "a-md-crash-reports", d: 3, prompt: "Which crash should be fixed first?", options: ["A new crash in checkout affecting 12% of users", "An old rare crash in settings", "A harmless warning logged often", "The oldest crash"], correct: "a",
      explanation: "Impact and recency.",
      wrong: { b: "Rare.", c: "Harmless.", d: "Age isn't impact." } }),
  ]),

  ...check("md-l120-m18-project", [
    q({ id: "mdq120-1", atom: "a-md-m18-project", d: 2, prompt: "Which level should test that adding the same product twice gives quantity 2?", options: ["A unit test of the reducer", "Only an E2E flow", "A manual test", "None"], correct: "a",
      explanation: "Fast and precise.",
      wrong: { b: "Slow for a rule.", c: "Not automated.", d: "It should be tested." } }),
    q({ id: "mdq120-2", atom: "a-md-m18-project", d: 2, prompt: "What does the integration test add over the unit tests?", options: ["The screens, context and reducer working together", "Faster runs", "Native code", "Store screenshots"], correct: "a",
      explanation: "Wiring.",
      wrong: { b: "Slower.", c: "No.", d: "No." } }),
    q({ id: "mdq120-3", atom: "a-md-m18-project", d: 2, prompt: "Why select the cart link by id in the Maestro flow?", options: ["Its text changes with the count", "Text selectors don't work", "Maestro needs ids", "It's shorter"], correct: "a",
      explanation: "Stable selectors.",
      wrong: { b: "They work.", c: "No.", d: "Not the reason." } }),
    q({ id: "mdq120-4", atom: "a-md-m18-project", d: 3, prompt: "A mutant survives (no test fails). What does that tell you?", options: ["A behaviour is untested: add a test that would catch it", "The mutant is wrong", "Tests are too strict", "Nothing"], correct: "a",
      explanation: "A gap in the suite.",
      wrong: { b: "It changed behaviour.", c: "Too loose.", d: "It does." } }),
  ]),
};
