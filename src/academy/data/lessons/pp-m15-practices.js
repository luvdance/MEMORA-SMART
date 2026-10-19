/**
 * PYTHON PROGRAMMING · MODULE 15 · SOFTWARE DEVELOPMENT PRACTICES
 *
 * Curriculum 15.1 – 15.10. PEP 8 and naming, docstrings, refactoring,
 * separation of concerns, Git, .gitignore and environment files, secrets and
 * configuration, READMEs, code review, and static analysis. The Git work
 * happens on the learner's own machine; the in-lesson challenges practise the
 * code-side skills: refactoring, configuration and a small linter.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s15-practices";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 15.1 – 15.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l61-readable-code",
    moduleId: "pp-m15-practices",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4"],
    title: "Readable Code and Refactoring",
    subtitle: "PEP 8, naming, docstrings, removing repetition and separating concerns",
    estimatedMinutes: 24,
    intro:
      "Code that works is the start. Code that another developer (or you in six months) can read, trust and change is the goal. This lesson is about the habits that get you there, and you will practise each one by improving real code.",

    atoms: [
      {
        id: "a-pp-pep8",
        title: "Readable code and PEP 8 conventions",
        explain:
          "PEP 8 is Python's official style guide. The essentials: 4 spaces per indentation level; lines under about 79–99 characters; snake_case for variables and functions, CapWords for classes, UPPER_CASE for constants; spaces around = and operators, none just inside brackets; two blank lines between top-level functions and classes; imports at the top, one per line. Consistency matters more than any single rule.",
        table: {
          caption: "PEP 8 at a glance.",
          headers: ["Thing", "Not like this", "Like this"],
          rows: [
            ["Function", "def CalcTotal(X):", "def calc_total(items):"],
            ["Class", "class bank_account:", "class BankAccount:"],
            ["Constant", "vatRate = 0.075", "VAT_RATE = 0.075"],
            ["Spacing", "x=a+b*2", "x = a + b * 2"],
            ["Comparison with None", "if x == None:", "if x is None:"],
            ["Empty check", "if len(items) == 0:", "if not items:"],
          ],
        },
      },
      {
        id: "a-pp-naming-docstrings",
        title: "Naming, comments and docstrings",
        explain:
          "Names should say what something IS (variables) or DOES (functions, usually starting with a verb): total_price, is_valid, load_students. Avoid single letters except for tiny loops and maths, and avoid vague names like data, temp or stuff. Comments explain WHY; docstrings explain WHAT a function does, its parameters and its return value. Good names make most comments unnecessary.",
        codeChallenge: {
          task: "Refactor this working but unreadable function. Rename it to calculate_final_price, its parameters to price and discount_percent, and its local variable to discount. Add a docstring. Its behaviour must not change.",
          starter: "def f(a, b):\n    x = a * b / 100\n    return round(a - x, 2)\n",
          sample: "calculate_final_price(20000, 15) → 17000.0",
          tests: [
            {
              check:
                'assert calculate_final_price(20000, 15) == 17000.0 and calculate_final_price(999.99, 10) == 899.99, "Behaviour must stay the same."\n' +
                'assert calculate_final_price(price=100, discount_percent=50) == 50.0, "Parameters must be named price and discount_percent."\n' +
                'assert calculate_final_price.__doc__, "Add a docstring."\n' +
                'import ast\n' +
                'fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "calculate_final_price"][0]\n' +
                'names = {n.id for n in ast.walk(fn) if isinstance(n, ast.Name)}\n' +
                'assert "discount" in names and "x" not in names, "Rename the local variable x to discount."\n' +
                'assert "f" not in {n.name for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef)}, "Remove the old function f."',
            },
          ],
          solution: 'def calculate_final_price(price, discount_percent):\n    """Return the price after applying a percentage discount, rounded to 2 dp."""\n    discount = price * discount_percent / 100\n    return round(price - discount, 2)\n',
          hint: "Change the names, keep every operation the same, and put a one-line \"\"\"docstring\"\"\" under the def.",
          successMessage: "Same behaviour, but now the code explains itself. Renaming is the simplest and most valuable refactoring there is.",
        },
      },
      {
        id: "a-pp-refactor-dry",
        title: "Refactoring and avoiding unnecessary repetition",
        explain:
          "Refactoring means improving code's structure without changing what it does. The most common target is repetition (\"Don't Repeat Yourself\", DRY): copy-pasted blocks that differ only in a value become one function with a parameter, or one loop over data. Refactor in small steps and re-run your tests after each one.",
        codeChallenge: {
          task: "This code repeats the same calculation for three students. Refactor it: write report(name, scores) that returns the line for one student, and print the three lines with a loop over a list of (name, scores) tuples. The output must be identical.",
          starter: 'ada = [70, 80, 90]\nprint("Ada: total", sum(ada), "average", round(sum(ada) / len(ada), 1))\nbo = [55, 65]\nprint("Bo: total", sum(bo), "average", round(sum(bo) / len(bo), 1))\nchi = [88, 92, 79, 95]\nprint("Chi: total", sum(chi), "average", round(sum(chi) / len(chi), 1))\n',
          sample: "Ada: total 240 average 80.0\nBo: total 120 average 60.0\nChi: total 354 average 88.5",
          tests: [
            {
              check:
                'assert lines == ["Ada: total 240 average 80.0", "Bo: total 120 average 60.0", "Chi: total 354 average 88.5"], "Output must be identical. Yours: " + repr(lines)\n' +
                'assert report("Dan", [10, 20]) == "Dan: total 30 average 15.0", "report(\\"Dan\\", [10, 20]) should return Dan: total 30 average 15.0. Got " + repr(report("Dan", [10, 20]))\n' +
                'assert source.count("sum(") <= 2 and uses("For"), "The calculation should appear once, inside report(), with a loop doing the repeating."',
            },
          ],
          solution: 'def report(name, scores):\n    return f"{name}: total {sum(scores)} average {round(sum(scores) / len(scores), 1)}"\n\nstudents = [("Ada", [70, 80, 90]), ("Bo", [55, 65]), ("Chi", [88, 92, 79, 95])]\nfor name, scores in students:\n    print(report(name, scores))\n',
          hint: "Build the line with an f-string inside report(). The data becomes a list of tuples, and a for loop prints each report.",
          successMessage: "One calculation instead of three copies. Adding a fourth student is now one item in a list, not another copied line.",
        },
      },
      {
        id: "a-pp-separation-concerns",
        title: "Separation of concerns",
        explain:
          "Each part of a program should have ONE concern: getting input, doing the calculation, storing data, or showing output. A function that calculates AND prints AND reads files cannot be reused or tested on its own. Keep the logic in pure functions (data in, result out) and keep input(), print() and file access at the edges.",
        codeChallenge: {
          task: "grade_report() mixes everything: it asks for input, calculates and prints. Split it: calculate(scores) returns (average, grade) with no input() or print(); format_report(name, average, grade) returns the text line; and a short main section asks for the name and three scores, then prints format_report(...).",
          starter: 'def grade_report():\n    name = input("Name: ")\n    scores = [int(input("Score: ")) for _ in range(3)]\n    avg = sum(scores) / 3\n    grade = "PASS" if avg >= 50 else "FAIL"\n    print(f"{name}: {avg:.1f} {grade}")\n\ngrade_report()\n',
          sample: "Name: Ada\nScore: 70\nScore: 40\nScore: 55\nAda: 55.0 PASS",
          tests: [
            {
              inputs: ["Ada", "70", "40", "55"],
              check:
                'assert lines[-1] == "Ada: 55.0 PASS", "The program should still print Ada: 55.0 PASS. Yours: " + lines[-1]\n' +
                'assert calculate([70, 40, 55]) == (55.0, "PASS") and calculate([10, 20, 30]) == (20.0, "FAIL"), "calculate should return (average, grade)."\n' +
                'assert format_report("Bo", 20.0, "FAIL") == "Bo: 20.0 FAIL", "format_report should return the line."\n' +
                'import ast\n' +
                'for fname in ("calculate", "format_report"):\n' +
                '    fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == fname][0]\n' +
                '    called = {c.func.id for c in ast.walk(fn) if isinstance(c, ast.Call) and isinstance(c.func, ast.Name)}\n' +
                '    assert not ({"input", "print"} & called), f"{fname} must not use input() or print()."',
            },
          ],
          solution: 'def calculate(scores):\n    avg = sum(scores) / len(scores)\n    return avg, "PASS" if avg >= 50 else "FAIL"\n\ndef format_report(name, average, grade):\n    return f"{name}: {average:.1f} {grade}"\n\nname = input("Name: ")\nscores = [int(input("Score: ")) for _ in range(3)]\naverage, grade = calculate(scores)\nprint(format_report(name, average, grade))\n',
          hint: "Move the calculation into calculate() and return both values; move the f-string into format_report() and return it. Keep input() and print() at the bottom.",
          successMessage: "calculate() can now be tested with no keyboard, reused in a web app, or called from a file loader. That is why concerns are kept separate.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 15.5 – 15.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l62-git-config",
    moduleId: "pp-m15-practices",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.5", "15.6", "15.7"],
    title: "Git, .gitignore and Secrets",
    subtitle: "Version control, what never to commit, and configuration",
    estimatedMinutes: 24,
    intro:
      "Git records every version of your project so you can experiment safely, undo mistakes and work with others. With it comes a responsibility: some files, above all passwords and API keys, must never go into a repository.",

    atoms: [
      {
        id: "a-pp-git",
        title: "Git fundamentals: repository, commit, branch and merge",
        explain:
          "A REPOSITORY is a project folder whose history Git tracks. A COMMIT is a saved snapshot with a message saying what changed and why. A BRANCH is a separate line of work, so a new feature can be developed without disturbing the working main branch; MERGE brings the finished branch back. GitHub hosts repositories online so you can share them and collaborate.",
        example:
          "git init                         start tracking this folder\ngit status                       what has changed?\ngit add main.py                  stage a file for the next commit\ngit commit -m \"Add grade report\"  save a snapshot\ngit log --oneline                see the history\n\ngit switch -c add-search         create and move to a new branch\n  ... edit, add, commit ...\ngit switch main                  back to main\ngit merge add-search             bring the feature in\n\ngit remote add origin https://github.com/you/project.git\ngit push -u origin main          publish to GitHub",
        decision: {
          scenario: "You want to try a big change to your working project, and you are not sure it will work.",
          question: "What is the Git way to do this safely?",
          options: [
            {
              id: "a",
              text: "Create a branch, make the change there with commits, and merge it into main only if it works",
              why: "main stays working the whole time. If the experiment fails, you switch back and delete the branch.",
            },
            {
              id: "b",
              text: "Copy the project folder to project_backup_final_v2",
              whyWrong: "Manual copies are what version control replaces: they drift, waste space and lose history.",
            },
            {
              id: "c",
              text: "Make the change directly on main without committing",
              whyWrong: "If it breaks, there is no snapshot to return to.",
            },
            {
              id: "d",
              text: "Do not try the change",
              whyWrong: "Branches exist precisely so that experiments are cheap and safe.",
            },
          ],
          correct: "a",
          aftermath: "Commit small, commit often, with messages that say why. Branch for anything you might want to undo.",
        },
      },
      {
        id: "a-pp-gitignore-env",
        title: ".gitignore and environment files",
        explain:
          "A .gitignore file lists patterns Git must never track: the virtual environment (.venv/), caches (__pycache__/), editor settings, generated files, and .env files that hold secrets. A .env file stores configuration as KEY=value lines (API_KEY=abc123), kept out of Git. Commit a .env.example with the keys but fake values, so others know what to set.",
        example:
          "# .gitignore for a Python project\n.venv/\n__pycache__/\n*.pyc\n.env\n.vscode/\n\n# .env (never committed)\nAPI_KEY=sk-live-8f3...\nDEBUG=false\n\n# .env.example (committed)\nAPI_KEY=your-key-here\nDEBUG=false",
        codeChallenge: {
          task: "Write load_env(text) that parses the contents of a .env file into a dictionary. Skip blank lines and lines starting with #. Split each line at the FIRST = only (values may contain =). Strip spaces around keys and values, and remove one pair of matching surrounding quotes (\" or ') from a value.",
          starter: "def load_env(text):\n    pass\n",
          sample: "load_env('API_KEY=\"abc=123\"\\n# note\\nDEBUG = false') → {'API_KEY': 'abc=123', 'DEBUG': 'false'}",
          tests: [
            {
              check:
                'text = "# settings\\nAPI_KEY=\\"abc=123\\"\\n\\nDEBUG = false\\nNAME=\'Memora App\'\\nURL=https://x.ng/?a=1\\n"\n' +
                'got = load_env(text)\n' +
                'assert got == {"API_KEY": "abc=123", "DEBUG": "false", "NAME": "Memora App", "URL": "https://x.ng/?a=1"}, "Got " + repr(got)\n' +
                'assert load_env("") == {}, "Empty text gives an empty dictionary."',
            },
          ],
          solution: 'def load_env(text):\n    result = {}\n    for line in text.splitlines():\n        line = line.strip()\n        if not line or line.startswith("#"):\n            continue\n        key, value = line.split("=", 1)\n        value = value.strip()\n        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\\"\'":\n            value = value[1:-1]\n        result[key.strip()] = value\n    return result\n',
          hint: "line.split(\"=\", 1) splits only at the first =. Check value[0] == value[-1] and that it is a quote before slicing [1:-1].",
          successMessage: "This is what the python-dotenv package does at its core. Note how the URL kept its own = sign because you split only once.",
        },
      },
      {
        id: "a-pp-secrets-config",
        title: "Managing secrets and configuration",
        explain:
          "Never write passwords, API keys or tokens in your code: anything committed to Git, even briefly, should be treated as leaked, because history keeps it. Read secrets from environment variables (os.environ) or a .env file at start-up, give non-secret settings sensible defaults, and fail early with a clear message if a required secret is missing. If a key does leak, revoke it and issue a new one.",
        code: {
          language: PY,
          code: 'import os\nos.environ["APP_MODE"] = "test"     # normally set outside the program\nmode = os.environ.get("APP_MODE", "production")\ntimeout = int(os.environ.get("TIMEOUT_SECONDS", "10"))\nprint(mode, timeout)\nprint("API_KEY" in os.environ)\n',
          expectedOutput: "test 10\nFalse",
        },
        codeChallenge: {
          task: "Write get_config() that reads configuration from os.environ and returns a dictionary: api_key from API_KEY (required: if missing or empty, raise RuntimeError(\"API_KEY is not set\")), debug from DEBUG (True only if the value is \"true\", \"1\" or \"yes\" in any case; default False), and port from PORT as an int (default 8000).",
          starter: "import os\n\ndef get_config():\n    return {\"api_key\": \"sk-live-12345\", \"debug\": True, \"port\": 8000}\n",
          sample: "With API_KEY=abc and DEBUG=Yes set: {'api_key': 'abc', 'debug': True, 'port': 8000}",
          tests: [
            {
              check:
                'import os\n' +
                'for k in ("API_KEY", "DEBUG", "PORT"):\n' +
                '    os.environ.pop(k, None)\n' +
                'try:\n' +
                '    get_config()\n' +
                '    assert False, "With no API_KEY, get_config() must raise RuntimeError."\n' +
                'except RuntimeError as e:\n' +
                '    assert str(e) == "API_KEY is not set", "Message should be: API_KEY is not set"\n' +
                'os.environ["API_KEY"] = "abc"\n' +
                'assert get_config() == {"api_key": "abc", "debug": False, "port": 8000}, "Defaults: debug False, port 8000. Got " + repr(get_config())\n' +
                'os.environ["DEBUG"] = "Yes"\n' +
                'os.environ["PORT"] = "5050"\n' +
                'assert get_config() == {"api_key": "abc", "debug": True, "port": 5050}, "Got " + repr(get_config())\n' +
                'os.environ["DEBUG"] = "off"\n' +
                'assert get_config()["debug"] is False, "Only true, 1 or yes switch debug on."\n' +
                'assert "sk-live" not in source, "Never hard-code a key in the source."\n' +
                'for k in ("API_KEY", "DEBUG", "PORT"):\n' +
                '    os.environ.pop(k, None)',
            },
          ],
          solution: 'import os\n\ndef get_config():\n    api_key = os.environ.get("API_KEY", "")\n    if not api_key:\n        raise RuntimeError("API_KEY is not set")\n    debug = os.environ.get("DEBUG", "").strip().lower() in ("true", "1", "yes")\n    port = int(os.environ.get("PORT", "8000"))\n    return {"api_key": api_key, "debug": debug, "port": port}\n',
          hint: "os.environ.get(name, default) reads a variable safely. Raise if the key is empty; compare DEBUG lower-cased against the three accepted words.",
          successMessage: "Secrets come from the environment, settings have defaults, and a missing key fails immediately with a clear message instead of a confusing error later.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 15.8 – 15.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l63-docs-review-tools",
    moduleId: "pp-m15-practices",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.8", "15.9", "15.10"],
    title: "READMEs, Code Review and Static Analysis",
    subtitle: "Documentation, reviewing code, and letting tools catch problems",
    estimatedMinutes: 22,
    intro:
      "A project another developer can understand and run needs three more things: a README that explains it, the habit of reviewing code before it is merged, and tools that check style and catch bugs automatically. Then you are ready to publish.",

    atoms: [
      {
        id: "a-pp-readme",
        title: "Writing useful README documentation",
        explain:
          "README.md is the first file anyone opens. It should answer, in order: what the project does (one or two sentences and maybe a screenshot), how to install it, how to run it, how to configure it, how to run the tests, and the project's structure. Write it in Markdown, and test the instructions on a clean machine or folder.",
        example:
          "# Student Manager\n\nA console app to record students' scores, grades and rankings.\n\n## Install\n    python -m venv .venv\n    .venv\\Scripts\\activate\n    python -m pip install -r requirements.txt\n\n## Run\n    python main.py\n\n## Configure\nCopy .env.example to .env and set DATA_FILE.\n\n## Test\n    python -m pytest\n\n## Structure\n    main.py        menu\n    students.py    data and rules\n    storage.py     load and save JSON",
        decision: {
          scenario: "A classmate's README says only: \"My project. Run it.\"",
          question: "What is the most important thing to add first?",
          options: [
            {
              id: "a",
              text: "Exact install and run commands, and what the project does",
              why: "Without them a stranger cannot even start. Everything else in a README builds on those two answers.",
            },
            {
              id: "b",
              text: "A long history of how the project was written",
              whyWrong: "Interesting, perhaps, but it does not help anyone use the project.",
            },
            {
              id: "c",
              text: "Emojis and badges",
              whyWrong: "Decoration comes last, if at all.",
            },
            {
              id: "d",
              text: "Nothing; good code needs no documentation",
              whyWrong: "Even perfect code does not tell someone how to install its dependencies or which file to run.",
            },
          ],
          correct: "a",
          aftermath: "What it is, how to install, how to run. If a stranger can do those three from your README, it is doing its job.",
        },
      },
      {
        id: "a-pp-code-review",
        title: "Basic code reviews and project organization",
        explain:
          "In a code review a teammate reads your changes before they are merged. Reviewers check correctness first (does it do what it should, including edge cases?), then clarity (names, structure), tests, and security (secrets, unvalidated input). Good review comments are specific and kind, and explain why. A tidy project layout (code in modules, tests in tests/, docs in the README, no stray files) makes review easier.",
        codeExercise: {
          language: PY,
          code: 'def average(scores):\n    total = 0\n    for s in scores:\n        total += s\n    return total / len(scores)\n\nprint(average([80, 90]))\nprint(average([]))\n',
          question: "You are reviewing this function. Run it in your head for both calls. What does it print before it fails, and what does it raise?",
          expectedOutput: "85.0",
          raises: "ZeroDivisionError: division by zero",
          hint: "The first call is fine. What is len([])?",
          successMessage: "Exactly the edge case a reviewer should spot. A good review comment: \"average([]) raises ZeroDivisionError: should it return 0.0, or raise a clearer ValueError? Please add a test for the empty case.\"",
        },
      },
      {
        id: "a-pp-static-analysis",
        title: "Static analysis and formatting tools",
        explain:
          "Static analysis tools read your code without running it. A FORMATTER (black, or ruff format) rewrites layout to a consistent style automatically, ending style arguments. A LINTER (ruff, flake8, pylint) reports problems: unused imports and variables, undefined names, names that break PEP 8, likely bugs. Run them before every commit; VS Code can run them on save. Under the hood they parse your code into a syntax tree with Python's ast module, the same module the checks in this course use.",
        example:
          "> python -m pip install ruff\n> ruff check .\nmain.py:1:8: F401 `os` imported but unused\nmain.py:9:5: F841 Local variable `temp` is assigned to but never used\nmain.py:14:5: N802 Function name `CalcTotal` should be lowercase\n> ruff format .\n3 files reformatted",
        codeChallenge: {
          task: "Build a tiny linter. Write bad_function_names(source) that parses Python source with the ast module and returns a sorted list of the names of all functions (def) whose names are not snake_case. A snake_case name contains only lower-case letters, digits and underscores and does not start with a digit (you can check with re.fullmatch(r\"[a-z_][a-z0-9_]*\", name)).",
          starter: "import ast\nimport re\n\ndef bad_function_names(source):\n    pass\n",
          sample: "bad_function_names(\"def CalcTotal(): pass\\ndef load_data(): pass\") → ['CalcTotal']",
          tests: [
            {
              check:
                'code = "def CalcTotal():\\n    pass\\n\\ndef load_data():\\n    pass\\n\\nclass Shop:\\n    def addItem(self):\\n        pass\\n    def _helper(self):\\n        pass\\n\\ndef getX2():\\n    pass\\n"\n' +
                'got = bad_function_names(code)\n' +
                'assert got == ["CalcTotal", "addItem", "getX2"], "Expected [\'CalcTotal\', \'addItem\', \'getX2\'] (methods count too). Got " + repr(got)\n' +
                'assert bad_function_names("x = 1\\n") == [], "No functions, no problems."\n' +
                'assert calls("parse") and calls("walk"), "Use ast.parse and ast.walk."',
            },
          ],
          solution: 'import ast\nimport re\n\ndef bad_function_names(source):\n    bad = []\n    for node in ast.walk(ast.parse(source)):\n        if isinstance(node, ast.FunctionDef) and not re.fullmatch(r"[a-z_][a-z0-9_]*", node.name):\n            bad.append(node.name)\n    return sorted(bad)\n',
          hint: "ast.walk(ast.parse(source)) visits every node. Keep the ast.FunctionDef nodes whose node.name fails the regex.",
          successMessage: "You wrote a real (if tiny) static analysis rule, the same idea as ruff's N802 check. sorted() puts capitals first, which is why CalcTotal comes before addItem.",
        },
      },
    ],

    task: {
      title: "Module 15 practice: publish a project",
      intro: "Refactor and publish a Python project to GitHub with clear instructions. The milestone is to maintain a project that another developer can understand and run.",
      prompts: [
        "Choose a project from this course (the Student Management System is ideal). Refactor it: PEP 8 names, docstrings, no repeated blocks, and logic separated from input/output.",
        "Run ruff check and ruff format and fix every warning.",
        "Create a Git repository with a .gitignore (.venv, __pycache__, .env). Make at least five commits with meaningful messages, and do one feature on a branch that you merge.",
        "Move any configuration (data file name, debug flag) into environment variables or a .env file, with a committed .env.example.",
        "Write a README with what it does, install, run, configure, test and structure sections. Push to GitHub and ask a classmate to follow the README on their machine.",
      ],
      closing: "Next: the Phase 3 assessment, a Personal Finance and Expense Tracker that uses everything from this phase.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
