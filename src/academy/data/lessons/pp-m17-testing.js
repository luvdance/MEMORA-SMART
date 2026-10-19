/**
 * PYTHON PROGRAMMING · MODULE 17 · TESTING, QUALITY ASSURANCE AND TYPE HINTS
 *
 * Curriculum 17.1 – 17.10. Why testing matters, unittest and pytest,
 * assertions, choosing test cases, fixtures, mocking, integration tests, type
 * hints, static type checking and logging.
 *
 * HOW THE TESTING CHALLENGES ARE CHECKED
 * Here the learner writes the TESTS. A check finds their unittest.TestCase
 * classes, runs them against the correct code (they must pass), then swaps in
 * deliberately broken versions of the code under test (they must FAIL). A
 * test suite that cannot catch an obvious bug is not doing its job, and this
 * is the only honest way to grade one. The swapping is done through the test
 * methods' own __globals__, which is the namespace the learner's code ran in.
 *
 * pytest is taught by example; the in-page runner uses unittest, which ships
 * with Python, so no package has to be downloaded.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s17-testing";

const PY = "python";

/**
 * Shared check prelude: defines run_suite(swap) which runs every TestCase the
 * learner wrote, optionally with some names replaced by broken versions, and
 * returns the unittest result.
 */
const RUN_SUITE = [
  "import unittest",
  "_cases = [v for v in list(globals().values()) if isinstance(v, type) and issubclass(v, unittest.TestCase) and v is not unittest.TestCase]",
  "assert _cases, \"Write at least one class that inherits from unittest.TestCase.\"",
  "def _namespace():",
  "    for c in _cases:",
  "        for val in vars(c).values():",
  "            if hasattr(val, \"__globals__\"):",
  "                return val.__globals__",
  "    return globals()",
  "def run_suite(swap=None):",
  "    g = _namespace()",
  "    saved = {k: g.get(k) for k in (swap or {})}",
  "    g.update(swap or {})",
  "    try:",
  "        suite = unittest.TestSuite(unittest.defaultTestLoader.loadTestsFromTestCase(c) for c in _cases)",
  "        result = unittest.TestResult()",
  "        suite.run(result)",
  "        return result",
  "    finally:",
  "        g.update(saved)",
  "def first_problem(result):",
  "    problems = result.failures + result.errors",
  "    return problems[0][1].strip().splitlines()[-1] if problems else \"\"",
  "",
].join("\n");

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 17.1 – 17.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l71-unit-tests",
    moduleId: "pp-m17-testing",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2", "17.3"],
    title: "Why Test, and Your First Unit Tests",
    subtitle: "unittest, pytest, assertions and expected outcomes",
    estimatedMinutes: 24,
    intro:
      "Every checked challenge in this course has been a test: code that runs your code and compares the result with what it should be. Now you write them yourself. A test suite turns \"I think it works\" into \"I know it works, and I will know the moment it stops\".",

    atoms: [
      {
        id: "a-pp-why-testing",
        title: "Why testing matters",
        explain:
          "Manual testing (run it, type some input, look at the output) is slow, easy to skip, and forgotten the moment you change the code. Automated tests run in seconds, every time, and catch REGRESSIONS: things that used to work and broke when something else changed. They also document how code is meant to behave, and give you the confidence to refactor.",
        decision: {
          scenario: "You fix a bug in the grade calculation of your Student Management System. A week later a classmate changes the average function and grades silently go wrong again.",
          question: "What would have caught this immediately?",
          options: [
            {
              id: "a",
              text: "An automated test for the grade calculation, run before every change is accepted",
              why: "The test would have failed the moment the average function changed, pointing straight at the regression.",
            },
            {
              id: "b",
              text: "Asking the classmate to be more careful",
              whyWrong: "Everyone makes mistakes; tests catch them whoever makes them.",
            },
            {
              id: "c",
              text: "Testing manually once a month",
              whyWrong: "The wrong grades would be live for weeks before anyone noticed.",
            },
            {
              id: "d",
              text: "Adding comments to the average function",
              whyWrong: "Comments do not check anything.",
            },
          ],
          correct: "a",
          aftermath: "A bug you fix without adding a test is a bug you will fix again.",
        },
      },
      {
        id: "a-pp-unittest-pytest",
        title: "Unit testing with unittest or pytest",
        explain:
          "A UNIT test checks one small piece, usually one function, in isolation. With unittest (built in) you write a class inheriting from unittest.TestCase whose methods start with test_, and use assertion methods such as self.assertEqual(actual, expected). pytest (installed with pip) uses plain functions named test_... and the plain assert statement; run it with python -m pytest and it finds every test_*.py file. Both are widely used; the ideas are identical.",
        example:
          "test_calc.py with pytest:\n\n  from calc import add\n\n  def test_add_positive():\n      assert add(2, 3) == 5\n\n  def test_add_negative():\n      assert add(-2, -3) == -5\n\n> python -m pytest\n..                                         [100%]\n2 passed in 0.01s",
        code: {
          language: PY,
          code: 'import unittest\n\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_positive(self):\n        self.assertEqual(add(2, 3), 5)\n\n    def test_negative(self):\n        self.assertEqual(add(-2, -3), -5)\n\nsuite = unittest.defaultTestLoader.loadTestsFromTestCase(TestAdd)\nresult = unittest.TestResult()\nsuite.run(result)\nprint("Ran", result.testsRun, "tests; all passed:", result.wasSuccessful())\n',
          expectedOutput: "Ran 2 tests; all passed: True",
        },
        why: "In VS Code you would end the test file with unittest.main() or run python -m unittest. In the lesson editor, leave that line out: the checker runs your tests for you.",
      },
      {
        id: "a-pp-assertions-outcomes",
        title: "Assertions and expected outcomes",
        explain:
          "Each test arranges inputs, acts by calling the code, and asserts the expected outcome. unittest offers assertEqual, assertTrue, assertFalse, assertIn, assertIsNone, assertAlmostEqual (for floats) and assertRaises (for errors): with self.assertRaises(ValueError): divide(1, 0). Give tests descriptive names, test_divide_by_zero_raises, so a failure explains itself.",
        codeChallenge: {
          task: "The functions add and divide are given. Write a class TestCalculator(unittest.TestCase) with at least four test methods: add with positive numbers, add with negative numbers, divide giving a decimal result (use assertAlmostEqual), and divide by zero raising ValueError (use assertRaises). Do not call unittest.main(); the checker runs your tests and also tries them against broken versions of the functions.",
          starter: 'import unittest\n\ndef add(a, b):\n    return a + b\n\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("cannot divide by zero")\n    return a / b\n\nclass TestCalculator(unittest.TestCase):\n    pass\n',
          sample: "4 tests, all passing against the real functions, and each broken version is caught.",
          tests: [
            {
              check:
                RUN_SUITE +
                'r = run_suite()\n' +
                'assert r.testsRun >= 4, "Write at least four test methods (each name starting with test_). Found " + str(r.testsRun)\n' +
                'assert r.wasSuccessful(), "Your tests should pass against the correct functions. First problem: " + first_problem(r)\n' +
                'assert not run_suite({"add": lambda a, b: a + b + 1}).wasSuccessful(), "Your tests did not catch an add() that is off by one."\n' +
                'assert not run_suite({"add": lambda a, b: abs(a) + abs(b)}).wasSuccessful(), "Your tests did not catch an add() that ignores negative signs: test negative numbers."\n' +
                'assert not run_suite({"divide": lambda a, b: a // b if b else 0}).wasSuccessful(), "Your tests did not catch a divide() that uses // and returns 0 for zero: test a decimal result and the error."\n' +
                'def _no_raise(a, b):\n' +
                '    return a / b if b else float("inf")\n' +
                'assert not run_suite({"divide": _no_raise}).wasSuccessful(), "Your tests did not catch a divide() that never raises ValueError: use assertRaises."',
            },
          ],
          solution: 'import unittest\n\ndef add(a, b):\n    return a + b\n\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("cannot divide by zero")\n    return a / b\n\nclass TestCalculator(unittest.TestCase):\n    def test_add_positive(self):\n        self.assertEqual(add(2, 3), 5)\n\n    def test_add_negative(self):\n        self.assertEqual(add(-2, -3), -5)\n\n    def test_divide_decimal(self):\n        self.assertAlmostEqual(divide(7, 2), 3.5)\n\n    def test_divide_by_zero_raises(self):\n        with self.assertRaises(ValueError):\n            divide(1, 0)\n',
          hint: "Each method: def test_something(self): then one self.assert... line. For the error: with self.assertRaises(ValueError): divide(1, 0).",
          successMessage: "Your tests pass on correct code and caught four different broken versions. That is what makes a test suite trustworthy.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 17.4 – 17.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l72-test-design",
    moduleId: "pp-m17-testing",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.4", "17.5", "17.6", "17.7"],
    title: "Designing Tests: Cases, Fixtures, Mocks and Integration",
    subtitle: "Which tests to write, and how to organise them",
    estimatedMinutes: 28,
    intro:
      "A few well-chosen tests catch more bugs than dozens of random ones. This lesson is about choosing cases deliberately, setting up test data cleanly, replacing slow or unpredictable dependencies, and testing pieces working together.",

    atoms: [
      {
        id: "a-pp-test-cases",
        title: "Positive, negative, boundary and edge-case tests",
        explain:
          "POSITIVE tests check normal, valid inputs. NEGATIVE tests check that invalid inputs are rejected properly (errors raised, False returned). BOUNDARY tests sit exactly on and either side of each limit: for a pass mark of 50, test 49, 50 and 51. EDGE cases are unusual but legal: empty lists, zero, one item, very large values, unusual characters. Boundaries and edges are where most bugs live.",
        codeChallenge: {
          task: "grade(score) is given: 70+ A, 60–69 B, 50–59 C, below 50 F, and it raises ValueError for scores outside 0–100. Write TestGrade(unittest.TestCase) covering positive, boundary and negative cases. The checker will try versions with off-by-one mistakes at each boundary and a version that accepts invalid scores; your tests must catch every one.",
          starter: 'import unittest\n\ndef grade(score):\n    if not 0 <= score <= 100:\n        raise ValueError("score must be 0-100")\n    if score >= 70:\n        return "A"\n    if score >= 60:\n        return "B"\n    if score >= 50:\n        return "C"\n    return "F"\n\nclass TestGrade(unittest.TestCase):\n    def test_a_grade(self):\n        self.assertEqual(grade(85), "A")\n',
          sample: "Tests for 85, 70, 69, 60, 59, 50, 49, 0, 100, -1 and 101 would catch every mutant.",
          tests: [
            {
              check:
                RUN_SUITE +
                'r = run_suite()\n' +
                'assert r.wasSuccessful(), "Your tests should pass against the correct grade(). First problem: " + first_problem(r)\n' +
                'def make(a, b, c, low=0, high=100):\n' +
                '    def g(score):\n' +
                '        if not low <= score <= high:\n' +
                '            raise ValueError("bad")\n' +
                '        return "A" if score >= a else "B" if score >= b else "C" if score >= c else "F"\n' +
                '    return g\n' +
                'mutants = [("A starts at 71 instead of 70", make(71, 60, 50)), ("B starts at 61", make(70, 61, 50)), ("C starts at 51", make(70, 60, 51)), ("A starts at 69", make(69, 60, 50)), ("C starts at 49", make(70, 60, 49)), ("scores above 100 accepted", make(70, 60, 50, 0, 1000)), ("negative scores accepted", make(70, 60, 50, -100, 100))]\n' +
                'for label, m in mutants:\n' +
                '    assert not run_suite({"grade": m}).wasSuccessful(), "Your tests missed a bug: " + label + ". Add a test at that boundary."',
            },
          ],
          solution: 'import unittest\n\ndef grade(score):\n    if not 0 <= score <= 100:\n        raise ValueError("score must be 0-100")\n    if score >= 70:\n        return "A"\n    if score >= 60:\n        return "B"\n    if score >= 50:\n        return "C"\n    return "F"\n\nclass TestGrade(unittest.TestCase):\n    def test_a_grade(self):\n        self.assertEqual(grade(85), "A")\n\n    def test_boundaries(self):\n        cases = {100: "A", 70: "A", 69: "B", 60: "B", 59: "C", 50: "C", 49: "F", 0: "F"}\n        for score, expected in cases.items():\n            with self.subTest(score=score):\n                self.assertEqual(grade(score), expected)\n\n    def test_invalid_scores_raise(self):\n        for score in (-1, 101):\n            with self.subTest(score=score):\n                with self.assertRaises(ValueError):\n                    grade(score)\n',
          hint: "Test both sides of 70, 60 and 50, plus 0 and 100, plus -1 and 101 with assertRaises. self.subTest lets one method check many values and report each separately.",
          successMessage: "Seven different off-by-one and validation bugs, all caught. Boundary testing is the single most effective testing habit you can build.",
        },
      },
      {
        id: "a-pp-fixtures",
        title: "Test fixtures and test organization",
        explain:
          "A FIXTURE is the setup a test needs: an object, some data, a temporary file. In unittest, setUp(self) runs before EACH test, so every test gets a fresh fixture and tests cannot affect each other; tearDown cleans up afterwards. In pytest, a function decorated with @pytest.fixture is passed to any test that names it as a parameter. Organise tests in a tests/ folder, one test file per module: tests/test_models.py tests models.py.",
        example:
          "project/\n├── finance/\n│   ├── models.py\n│   └── reports.py\n└── tests/\n    ├── test_models.py\n    └── test_reports.py\n\n# pytest fixture\nimport pytest\n\n@pytest.fixture\ndef account():\n    return BankAccount(\"Ada\", 1000)\n\ndef test_deposit(account):\n    assert account.deposit(500) == 1500",
        codeChallenge: {
          task: "BankAccount is given. Write TestBankAccount with a setUp method that creates self.account = BankAccount(\"Ada\", 1000) before each test, and at least three tests: a deposit, a withdrawal, and a withdrawal of more than the balance raising ValueError and leaving the balance unchanged.",
          starter: 'import unittest\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("amount must be positive")\n        self.balance += amount\n        return self.balance\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError("insufficient funds")\n        self.balance -= amount\n        return self.balance\n\nclass TestBankAccount(unittest.TestCase):\n    pass\n',
          sample: "setUp creates a fresh account for each of your tests.",
          tests: [
            {
              check:
                RUN_SUITE +
                'r = run_suite()\n' +
                'assert r.testsRun >= 3, "Write at least three tests. Found " + str(r.testsRun)\n' +
                'assert r.wasSuccessful(), "Your tests should pass against the correct BankAccount. First problem: " + first_problem(r)\n' +
                'assert any("setUp" in vars(c) for c in _cases), "Use a setUp method to create the account."\n' +
                'class NoCheck(BankAccount):\n' +
                '    def withdraw(self, amount):\n' +
                '        self.balance -= amount\n' +
                '        return self.balance\n' +
                'class ChangesThenRaises(BankAccount):\n' +
                '    def withdraw(self, amount):\n' +
                '        self.balance -= amount\n' +
                '        if self.balance < 0:\n' +
                '            raise ValueError("insufficient funds")\n' +
                '        return self.balance\n' +
                'class BadDeposit(BankAccount):\n' +
                '    def deposit(self, amount):\n' +
                '        self.balance += amount * 2\n' +
                '        return self.balance\n' +
                'assert not run_suite({"BankAccount": NoCheck}).wasSuccessful(), "Your tests missed a withdraw() that allows overdrawing."\n' +
                'assert not run_suite({"BankAccount": ChangesThenRaises}).wasSuccessful(), "Your tests missed a withdraw() that changes the balance before raising: check the balance after the error."\n' +
                'assert not run_suite({"BankAccount": BadDeposit}).wasSuccessful(), "Your tests missed a broken deposit()."',
            },
          ],
          solution: 'import unittest\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("amount must be positive")\n        self.balance += amount\n        return self.balance\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError("insufficient funds")\n        self.balance -= amount\n        return self.balance\n\nclass TestBankAccount(unittest.TestCase):\n    def setUp(self):\n        self.account = BankAccount("Ada", 1000)\n\n    def test_deposit(self):\n        self.assertEqual(self.account.deposit(500), 1500)\n\n    def test_withdraw(self):\n        self.assertEqual(self.account.withdraw(300), 700)\n\n    def test_overdraw_raises_and_keeps_balance(self):\n        with self.assertRaises(ValueError):\n            self.account.withdraw(5000)\n        self.assertEqual(self.account.balance, 1000)\n',
          hint: "def setUp(self): self.account = BankAccount(\"Ada\", 1000). After the assertRaises block, assert the balance is still 1000.",
          successMessage: "Fresh fixtures for every test, and you caught a subtle bug: changing the balance before raising. Checking state AFTER an error is a mark of a careful tester.",
        },
      },
      {
        id: "a-pp-mocking",
        title: "Mocking external dependencies",
        explain:
          "Some code depends on things that are slow, unpredictable or unavailable in tests: the network, the clock, random numbers, a payment provider. A MOCK replaces that dependency with a stand-in you control. unittest.mock.patch(\"module.name\", return_value=...) swaps a function for the duration of a with block. In the lesson editor your code runs as the module __main__, so patch \"__main__.get_rate\".",
        code: {
          language: PY,
          code: 'from unittest.mock import patch\nimport random\n\ndef roll_bonus():\n    return 100 if random.randint(1, 6) == 6 else 0\n\nwith patch("random.randint", return_value=6):\n    print(roll_bonus())\nwith patch("random.randint", return_value=2):\n    print(roll_bonus())\n',
          expectedOutput: "100\n0",
        },
        codeChallenge: {
          task: "naira_to_usd(amount) calls get_rate(), which in real life would fetch today's rate from the internet. Write TestConversion with two tests that use unittest.mock.patch(\"__main__.get_rate\", return_value=...) to fix the rate: one with a rate of 1500 (3000 naira is 2.0 dollars) and one with a rate of 1600 (8000 naira is 5.0 dollars). Your tests must not depend on what get_rate() really returns.",
          starter: 'import unittest\nfrom unittest.mock import patch\n\ndef get_rate():\n    raise ConnectionError("no internet in tests")\n\ndef naira_to_usd(amount):\n    return round(amount / get_rate(), 2)\n\nclass TestConversion(unittest.TestCase):\n    pass\n',
          sample: "with patch(\"__main__.get_rate\", return_value=1500): naira_to_usd(3000) → 2.0",
          tests: [
            {
              check:
                RUN_SUITE +
                'r = run_suite()\n' +
                'assert r.testsRun >= 2, "Write at least two tests."\n' +
                'assert r.wasSuccessful(), "Your tests should pass with the network unavailable. First problem: " + first_problem(r)\n' +
                'assert not run_suite({"naira_to_usd": lambda amount: round(amount * get_rate(), 2)}).wasSuccessful(), "Your tests did not catch a conversion that multiplies instead of dividing."\n' +
                'assert "patch" in source and "get_rate" in source, "Use patch to replace get_rate."',
            },
          ],
          solution: 'import unittest\nfrom unittest.mock import patch\n\ndef get_rate():\n    raise ConnectionError("no internet in tests")\n\ndef naira_to_usd(amount):\n    return round(amount / get_rate(), 2)\n\nclass TestConversion(unittest.TestCase):\n    def test_rate_1500(self):\n        with patch("__main__.get_rate", return_value=1500):\n            self.assertEqual(naira_to_usd(3000), 2.0)\n\n    def test_rate_1600(self):\n        with patch("__main__.get_rate", return_value=1600):\n            self.assertEqual(naira_to_usd(8000), 5.0)\n',
          hint: "Inside each test: with patch(\"__main__.get_rate\", return_value=1500): then assert on naira_to_usd(...).",
          successMessage: "Your tests run without the internet and give the same answer every time. Mocking is what makes code that talks to the outside world testable.",
        },
      },
      {
        id: "a-pp-integration",
        title: "Integration testing basics",
        explain:
          "Unit tests check pieces alone; INTEGRATION tests check pieces working together: the Ledger saving to a real (temporary) file and loading it back, or the menu calling the reports. They are slower and fewer, but catch problems unit tests cannot, such as two modules disagreeing about a data format. A healthy suite is a pyramid: many unit tests, some integration tests, a few end-to-end tests of the whole program.",
        example:
          "import json, tempfile, unittest\nfrom pathlib import Path\nfrom finance.storage import Ledger\nfrom finance.models import Transaction\n\nclass TestSaveLoad(unittest.TestCase):\n    def test_round_trip(self):\n        with tempfile.TemporaryDirectory() as folder:\n            path = Path(folder) / \"ledger.json\"\n            ledger = Ledger()\n            ledger.add(Transaction(\"Salary\", 300000, \"income\"))\n            ledger.save(path)\n            self.assertEqual(Ledger.load(path).transactions,\n                             ledger.transactions)\n\nThe test uses a temporary folder, so it never touches real data.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 17.8 – 17.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l73-types-logging",
    moduleId: "pp-m17-testing",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.8", "17.9", "17.10"],
    title: "Type Hints, Static Checking and Logging",
    subtitle: "Saying what types you expect, checking without running, and recording what happened",
    estimatedMinutes: 24,
    intro:
      "Three more quality tools. Type hints document what a function expects and returns. A type checker reads those hints and finds mistakes before the code runs. And logging records what a running program did, which is how you find out what went wrong on someone else's machine.",

    atoms: [
      {
        id: "a-pp-type-hints",
        title: "Type hints and annotations",
        explain:
          "A type hint annotates a parameter or return value: def average(scores: list[float]) -> float:. Variables can be annotated too: count: int = 0. Common forms: int, str, float, bool, list[str], dict[str, int], tuple[int, int], and str | None for \"a string or None\". Python itself does not enforce hints at run time; they are for readers, editors and type checkers.",
        code: {
          language: PY,
          code: 'def find_student(students: dict[str, list[int]], name: str) -> list[int] | None:\n    return students.get(name)\n\nprint(find_student({"Ada": [70, 80]}, "Ada"))\nprint(find_student.__annotations__["return"])\n',
          expectedOutput: "[70, 80]\nlist[int] | None",
        },
        codeChallenge: {
          task: "Add complete type hints (every parameter and the return value) to these three functions without changing their behaviour: total(prices) takes a list of floats and returns a float; initials(name) takes a str and returns a str; find_price(prices, item) takes a dict mapping str to float and a str, and returns a float or None.",
          starter: "def total(prices):\n    return sum(prices)\n\ndef initials(name):\n    return \"\".join(part[0].upper() for part in name.split())\n\ndef find_price(prices, item):\n    return prices.get(item)\n",
          sample: "def total(prices: list[float]) -> float:",
          tests: [
            {
              check:
                'import typing\n' +
                'h = typing.get_type_hints(total)\n' +
                'assert h.get("prices") == list[float] and h.get("return") is float, "total: prices: list[float] -> float. Got " + repr(h)\n' +
                'h = typing.get_type_hints(initials)\n' +
                'assert h.get("name") is str and h.get("return") is str, "initials: name: str -> str. Got " + repr(h)\n' +
                'h = typing.get_type_hints(find_price)\n' +
                'assert h.get("prices") == dict[str, float] and h.get("item") is str, "find_price: prices: dict[str, float], item: str. Got " + repr(h)\n' +
                'assert h.get("return") in (float | None, typing.Optional[float]), "find_price returns float | None. Got " + repr(h.get("return"))\n' +
                'assert total([1.5, 2.5]) == 4.0 and initials("ada obi") == "AO" and find_price({"pen": 300.0}, "ink") is None, "Behaviour must not change."',
            },
          ],
          solution: 'def total(prices: list[float]) -> float:\n    return sum(prices)\n\ndef initials(name: str) -> str:\n    return "".join(part[0].upper() for part in name.split())\n\ndef find_price(prices: dict[str, float], item: str) -> float | None:\n    return prices.get(item)\n',
          hint: "Parameters: name: type. Return: -> type before the colon. \"A float or None\" is float | None.",
          successMessage: "Each function now states its contract. VS Code will use these hints for autocomplete and warnings as you type.",
        },
      },
      {
        id: "a-pp-static-typing",
        title: "Static type checking concepts",
        explain:
          "A static type checker such as mypy or pyright reads your code and hints WITHOUT running it, and reports mismatches: passing a str where an int is expected, forgetting that a function can return None, calling a method that does not exist. VS Code's Python extension runs pyright as you type. Static checking catches a whole category of bugs before any test runs, and grows more valuable as a project grows.",
        example:
          "def apply_discount(price: float, percent: float) -> float:\n    return price * (100 - percent) / 100\n\napply_discount(\"5000\", 10)\n\n> mypy shop.py\nshop.py:4: error: Argument 1 to \"apply_discount\" has incompatible\n           type \"str\"; expected \"float\"\nFound 1 error in 1 file\n\nThe bug is found without running anything.",
        decision: {
          scenario: "find_student(...) -> list[int] | None. A teammate writes: average = sum(find_student(db, name)) / 3",
          question: "What will a type checker report, and why does it matter?",
          options: [
            {
              id: "a",
              text: "That find_student may return None, and sum(None) would crash: the code must handle the not-found case",
              why: "The | None in the return type is a promise that None can come back. The checker forces the caller to deal with it, preventing a crash for unknown names.",
            },
            {
              id: "b",
              text: "Nothing; type checkers only check spelling",
              whyWrong: "Type checkers check types, including the possibility of None.",
            },
            {
              id: "c",
              text: "That 3 should be 3.0",
              whyWrong: "Dividing by an int is fine; the real issue is the possible None.",
            },
            {
              id: "d",
              text: "That sum is not allowed in Python",
              whyWrong: "sum is a built-in; it just cannot accept None.",
            },
          ],
          correct: "a",
          aftermath: "Type hints plus a checker turn \"it crashed when the name was not found\" into a warning before the code ever runs.",
        },
      },
      {
        id: "a-pp-logging",
        title: "Logging with the logging module",
        explain:
          "print() is for the user; logging is for the developer and operator. logging records messages with a LEVEL (DEBUG, INFO, WARNING, ERROR, CRITICAL), a time and the source, and can send them to the console or a file. Configure once at start-up with logging.basicConfig(level=logging.INFO), then in each module use logger = logging.getLogger(__name__) and logger.info(...), logger.warning(...). Lower levels can be switched off in production without deleting code.",
        code: {
          language: PY,
          code: 'import logging, sys\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s", force=True)\nlogger = logging.getLogger("bank")\nlogger.debug("not shown at INFO level")\nlogger.info("Account opened for Ada")\nlogger.warning("Balance low: 150")\n',
          expectedOutput: "INFO:bank:Account opened for Ada\nWARNING:bank:Balance low: 150",
        },
        codeChallenge: {
          task: "Add logging to process_payment(amount, balance), using logger = logging.getLogger(\"payments\"). Log logger.info(\"Payment of AMOUNT accepted\") on success and logger.warning(\"Payment of AMOUNT declined: insufficient funds\") when the amount exceeds the balance (then return the unchanged balance). Use logging, not print().",
          starter: 'import logging\n\nlogger = logging.getLogger("payments")\n\ndef process_payment(amount, balance):\n    if amount > balance:\n        print("declined")\n        return balance\n    print("ok")\n    return balance - amount\n',
          sample: "process_payment(500, 200) logs WARNING: Payment of 500 declined: insufficient funds",
          tests: [
            {
              check:
                'import logging\n' +
                'records = []\n' +
                'class _Catch(logging.Handler):\n' +
                '    def emit(self, record):\n' +
                '        records.append((record.levelname, record.name, record.getMessage()))\n' +
                'h = _Catch()\n' +
                'logging.getLogger("payments").addHandler(h)\n' +
                'logging.getLogger("payments").setLevel(logging.DEBUG)\n' +
                'try:\n' +
                '    assert process_payment(100, 1000) == 900, "A valid payment returns the new balance."\n' +
                '    assert process_payment(500, 200) == 200, "A declined payment returns the unchanged balance."\n' +
                'finally:\n' +
                '    logging.getLogger("payments").removeHandler(h)\n' +
                'assert ("INFO", "payments", "Payment of 100 accepted") in records, "Log INFO: Payment of 100 accepted. Logged: " + repr(records)\n' +
                'assert ("WARNING", "payments", "Payment of 500 declined: insufficient funds") in records, "Log WARNING for the declined payment. Logged: " + repr(records)\n' +
                'assert not calls("print"), "Use logging instead of print()."',
            },
          ],
          solution: 'import logging\n\nlogger = logging.getLogger("payments")\n\ndef process_payment(amount, balance):\n    if amount > balance:\n        logger.warning(f"Payment of {amount} declined: insufficient funds")\n        return balance\n    logger.info(f"Payment of {amount} accepted")\n    return balance - amount\n',
          hint: "Replace each print() with logger.info(...) or logger.warning(...), using an f-string with the amount.",
          successMessage: "Your function now leaves a trail an operator can read, at the right level, without cluttering the user's screen.",
        },
      },
    ],

    task: {
      title: "Module 17 practice: test three real programs",
      intro: "Use pytest on your own machine (python -m pip install pytest) in a tests/ folder. The milestone is to verify behaviour systematically instead of relying on manual testing alone.",
      prompts: [
        "Calculator: unit tests for every operation, including negative numbers, decimals and division by zero.",
        "Student grading engine: boundary tests for every grade edge, invalid scores, and an empty list of scores.",
        "Expense tracker: unit tests for Transaction validation and the reports, plus one integration test that saves and reloads a ledger in a temporary folder.",
        "Add type hints to the expense tracker and run mypy (python -m pip install mypy, then mypy .) until it reports no errors.",
        "Replace any debugging print() calls with logging, and run the program once at DEBUG level and once at WARNING level.",
      ],
      closing: "Next: databases. Your data moves from JSON files into SQL tables.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
