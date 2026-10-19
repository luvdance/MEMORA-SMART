/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 17
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l71-unit-tests": {
    lessonId: "pp-l71-unit-tests",
    passMark: 70,
    questions: [
      {
        id: "ppq71-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-why-testing",
        prompt: "What is a regression?",
        options: [
          { id: "a", text: "Something that used to work and broke because of a later change" },
          { id: "b", text: "A type of loop" },
          { id: "c", text: "A test that always passes" },
          { id: "d", text: "A slow computer" },
        ],
        correct: "a",
        explanation: "Automated tests catch regressions the moment they happen, because they run after every change.",
        whyWrong: {
          b: "It is not a code structure.",
          c: "That would be a useless test.",
          d: "It is about behaviour breaking, not speed.",
        },
      },
      {
        id: "ppq71-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-unittest-pytest",
        prompt: "In unittest, how does the test runner recognise a test method?",
        options: [
          { id: "a", text: "It is a method of a TestCase subclass whose name starts with test" },
          { id: "b", text: "It contains the word assert" },
          { id: "c", text: "It is the last method in the file" },
          { id: "d", text: "It returns True" },
        ],
        correct: "a",
        explanation: "Methods named test_... inside a unittest.TestCase subclass are collected and run.",
        whyWrong: {
          b: "Helper methods may assert without being tests.",
          c: "Position does not matter.",
          d: "Tests pass by not failing an assertion, not by returning True.",
        },
      },
      {
        id: "ppq71-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-assertions-outcomes",
        prompt: "Which assertion is right for checking that divide(1, 0) raises ValueError?",
        options: [
          { id: "a", text: "with self.assertRaises(ValueError): divide(1, 0)" },
          { id: "b", text: "self.assertEqual(divide(1, 0), ValueError)" },
          { id: "c", text: "self.assertTrue(divide(1, 0))" },
          { id: "d", text: "self.assertIsNone(divide(1, 0))" },
        ],
        correct: "a",
        explanation: "assertRaises passes only if the block raises the given exception.",
        whyWrong: {
          b: "The call raises before anything can be compared, so the test errors.",
          c: "The call raises; it never returns a value.",
          d: "Same problem: it raises rather than returning.",
        },
      },
      {
        id: "ppq71-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-assertions-outcomes",
        prompt: "Why use assertAlmostEqual(0.1 + 0.2, 0.3) rather than assertEqual?",
        options: [
          { id: "a", text: "Floating-point results are rarely exact; assertAlmostEqual allows a tiny difference" },
          { id: "b", text: "assertEqual cannot compare numbers" },
          { id: "c", text: "assertAlmostEqual is faster" },
          { id: "d", text: "No reason" },
        ],
        correct: "a",
        explanation: "0.1 + 0.2 is 0.30000000000000004, so an exact comparison fails.",
        whyWrong: {
          b: "It compares numbers fine; floats are just inexact.",
          c: "Speed is not the reason.",
          d: "Exact float comparison is a classic source of flaky tests.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l72-test-design": {
    lessonId: "pp-l72-test-design",
    passMark: 70,
    questions: [
      {
        id: "ppq72-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-test-cases",
        prompt: "A discount applies to orders of 10,000 or more. Which values make the best boundary tests?",
        options: [
          { id: "a", text: "9,999, 10,000 and 10,001" },
          { id: "b", text: "5 and 1,000,000" },
          { id: "c", text: "10,000 only" },
          { id: "d", text: "Any random order total" },
        ],
        correct: "a",
        explanation: "On and either side of the boundary catches > versus >= mistakes in both directions.",
        whyWrong: {
          b: "Values far from the boundary rarely reveal off-by-one bugs.",
          c: "One value cannot show which side the boundary falls on.",
          d: "Random values seldom land on the boundary.",
        },
      },
      {
        id: "ppq72-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-fixtures",
        prompt: "When does unittest's setUp method run?",
        options: [
          { id: "a", text: "Before each test method, giving each test a fresh fixture" },
          { id: "b", text: "Once, before all tests" },
          { id: "c", text: "Only if a test fails" },
          { id: "d", text: "After every test" },
        ],
        correct: "a",
        explanation: "Running before each test keeps tests independent: one test's changes cannot leak into another.",
        whyWrong: {
          b: "That is setUpClass.",
          c: "It always runs.",
          d: "That is tearDown.",
        },
      },
      {
        id: "ppq72-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-mocking",
        prompt: "Why mock a function that fetches today's exchange rate from the internet?",
        options: [
          { id: "a", text: "So tests are fast, repeatable and work offline, with a rate the test controls" },
          { id: "b", text: "Because real functions cannot be tested" },
          { id: "c", text: "To make the program run faster in production" },
          { id: "d", text: "To hide bugs" },
        ],
        correct: "a",
        explanation: "A real network call is slow and its result changes; a mock makes the test deterministic.",
        whyWrong: {
          b: "They can, but network dependence makes tests unreliable.",
          c: "Mocks are only used in tests.",
          d: "Mocks isolate the code under test; they do not hide its bugs.",
        },
      },
      {
        id: "ppq72-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-integration",
        prompt: "What does an integration test check that a unit test does not?",
        options: [
          { id: "a", text: "That several pieces work correctly together, such as saving to a file and loading it back" },
          { id: "b", text: "That one function returns the right value" },
          { id: "c", text: "Spelling in comments" },
          { id: "d", text: "Code formatting" },
        ],
        correct: "a",
        explanation: "Integration tests catch mismatches between components, such as different assumptions about a data format.",
        whyWrong: {
          b: "That is a unit test.",
          c: "Tests check behaviour, not comments.",
          d: "That is a formatter's job.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l73-types-logging": {
    lessonId: "pp-l73-types-logging",
    passMark: 70,
    questions: [
      {
        id: "ppq73-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-type-hints",
        prompt: "What does def lookup(code: str) -> int | None: tell a reader?",
        options: [
          { id: "a", text: "code should be a str, and the function returns an int or None" },
          { id: "b", text: "Python will refuse to run if code is not a str" },
          { id: "c", text: "The function always returns None" },
          { id: "d", text: "code is optional" },
        ],
        correct: "a",
        explanation: "Hints document the contract; Python does not enforce them at run time, but tools check them.",
        whyWrong: {
          b: "Hints are not enforced when the code runs.",
          c: "It returns an int OR None.",
          d: "code has no default, so it is required.",
        },
      },
      {
        id: "ppq73-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-static-typing",
        prompt: "What does a static type checker such as mypy do?",
        options: [
          { id: "a", text: "Reads the code and type hints without running it, and reports type mismatches" },
          { id: "b", text: "Runs the program faster" },
          { id: "c", text: "Formats the code" },
          { id: "d", text: "Runs the unit tests" },
        ],
        correct: "a",
        explanation: "It finds bugs such as passing a str where a float is expected, before anything runs.",
        whyWrong: {
          b: "It does not run the program at all.",
          c: "That is a formatter.",
          d: "That is pytest or unittest.",
        },
      },
      {
        id: "ppq73-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-logging",
        prompt: "With logging.basicConfig(level=logging.WARNING), which call produces output?",
        options: [
          { id: "a", text: "logger.error(\"Payment failed\")" },
          { id: "b", text: "logger.info(\"Started\")" },
          { id: "c", text: "logger.debug(\"x = 5\")" },
          { id: "d", text: "None of them" },
        ],
        correct: "a",
        explanation: "Only WARNING and above (WARNING, ERROR, CRITICAL) pass a WARNING threshold.",
        whyWrong: {
          b: "INFO is below WARNING.",
          c: "DEBUG is the lowest level.",
          d: "ERROR is above the threshold.",
        },
      },
      {
        id: "ppq73-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-logging",
        prompt: "Why prefer logging over print() for diagnostic messages?",
        options: [
          { id: "a", text: "Messages have levels and timestamps, can go to files, and low levels can be switched off without deleting code" },
          { id: "b", text: "print() is deprecated" },
          { id: "c", text: "logging is required by Python" },
          { id: "d", text: "logging makes code shorter" },
        ],
        correct: "a",
        explanation: "Logging is configurable in one place, which suits both development and production.",
        whyWrong: {
          b: "print() is fine for user output.",
          c: "It is optional, just better for diagnostics.",
          d: "It is about control, not length.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
