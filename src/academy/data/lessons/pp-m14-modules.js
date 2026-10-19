/**
 * PYTHON PROGRAMMING · MODULE 14 · MODULES, PACKAGES AND THE PYTHON ECOSYSTEM
 *
 * Curriculum 14.1 – 14.10. Importing, the standard library, your own modules
 * and packages, import paths, the __main__ guard, pip, venv, requirements.txt
 * and choosing packages. Challenges that import a module supply it as a
 * fixture file; the harness puts the working folder on sys.path and forgets
 * stale copies between runs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s14-modules";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 14.1 – 14.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l58-import-stdlib",
    moduleId: "pp-m14-modules",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2"],
    title: "Importing and the Standard Library",
    subtitle: "import, from ... import, and the batteries Python ships with",
    estimatedMinutes: 22,
    intro:
      "Python is famous for coming with \"batteries included\": a standard library of modules for maths, dates, randomness, statistics and much more, already installed. Using it well saves you from writing (and debugging) what already exists.",

    atoms: [
      {
        id: "a-pp-importing",
        title: "Importing modules",
        explain:
          "A module is a .py file of reusable code. import math makes the module available as math, so you write math.sqrt(16). from math import sqrt brings one name in directly. import statistics as st gives a module a shorter alias. Put imports at the top of the file. Avoid from module import *, which dumps every name in and hides where things come from.",
        code: {
          language: PY,
          code: 'import math\nfrom random import choice, seed\nimport statistics as st\n\nprint(math.sqrt(16), math.pi > 3.14, math.ceil(4.1))\nseed(1)\nprint(choice(["red", "green", "blue"]) in ["red", "green", "blue"])\nprint(st.mean([2, 4, 9]))\n',
          expectedOutput: "4.0 True 5\nTrue\n5",
        },
      },
      {
        id: "a-pp-stdlib-tour",
        title: "The standard library: math, random, datetime, statistics, collections, itertools",
        explain:
          "math: sqrt, ceil, floor, pi. random: randint, choice, shuffle, and seed() to make results repeatable for testing. datetime: date and datetime objects, timedelta for differences, strftime for formatting. statistics: mean, median, mode, stdev. collections: Counter (counting), defaultdict (dictionaries with automatic defaults), namedtuple. itertools: combinations, permutations, chain, groupby.",
        code: {
          language: PY,
          code: 'from datetime import date, timedelta\nfrom collections import Counter\nfrom itertools import combinations\n\nexam = date(2026, 11, 20)\ntoday = date(2026, 10, 18)\nprint((exam - today).days, "days to go")\nprint((today + timedelta(weeks=2)).strftime("%d %b %Y"))\nprint(Counter("banana").most_common(2))\nprint(list(combinations(["Ada", "Bo", "Chi"], 2)))\n',
          expectedOutput: "33 days to go\n01 Nov 2026\n[('a', 3), ('n', 2)]\n[('Ada', 'Bo'), ('Ada', 'Chi'), ('Bo', 'Chi')]",
        },
        codeChallenge: {
          task: "Using the standard library (statistics and collections.Counter), write class_report(scores) that returns a dictionary with keys mean (rounded to 1 dp), median, highest, and most_common (the score that appears most often; if several tie, Counter's most_common(1) decides). Then write days_until(target, today) that takes two dates as \"YYYY-MM-DD\" strings and returns the whole number of days between them, using datetime.date.fromisoformat.",
          starter: "import statistics\nfrom collections import Counter\nfrom datetime import date\n\ndef class_report(scores):\n    pass\n\ndef days_until(target, today):\n    pass\n",
          sample: "class_report([70, 85, 70, 92, 60]) → {'mean': 75.4, 'median': 70, 'highest': 92, 'most_common': 70}",
          tests: [
            {
              check:
                'r = class_report([70, 85, 70, 92, 60])\n' +
                'assert r == {"mean": 75.4, "median": 70, "highest": 92, "most_common": 70}, "Got " + repr(r)\n' +
                'assert days_until("2026-12-25", "2026-10-18") == 68, "18 Oct to 25 Dec 2026 is 68 days. Got " + repr(days_until("2026-12-25", "2026-10-18"))\n' +
                'assert days_until("2027-01-01", "2026-12-31") == 1, "Across a year boundary: 1 day."\n' +
                'assert calls("median") and calls("fromisoformat"), "Use statistics.median and date.fromisoformat."',
            },
          ],
          solution: 'import statistics\nfrom collections import Counter\nfrom datetime import date\n\ndef class_report(scores):\n    return {\n        "mean": round(statistics.mean(scores), 1),\n        "median": statistics.median(scores),\n        "highest": max(scores),\n        "most_common": Counter(scores).most_common(1)[0][0],\n    }\n\ndef days_until(target, today):\n    return (date.fromisoformat(target) - date.fromisoformat(today)).days\n',
          hint: "Counter(scores).most_common(1) returns a list like [(70, 2)]; take [0][0]. Subtracting two dates gives a timedelta with a .days attribute.",
          successMessage: "Each of those would be a page of your own code, and a source of bugs. Knowing the standard library is one of the biggest productivity gains in Python.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 14.3 – 14.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l59-own-modules",
    moduleId: "pp-m14-modules",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.3", "14.4", "14.5", "14.6"],
    title: "Your Own Modules and Packages",
    subtitle: "Splitting a program into files, packages, import paths and __main__",
    estimatedMinutes: 26,
    intro:
      "Once a program passes a few hundred lines, one file becomes hard to navigate. Splitting it into modules, grouped into packages, keeps each file focused and lets you reuse code across projects. In these challenges the module files already exist in your working folder; your code imports them, just as main.py would in VS Code.",

    atoms: [
      {
        id: "a-pp-own-modules",
        title: "Creating your own modules",
        explain:
          "Any .py file is a module. If calculator.py sits in the same folder as main.py, then main.py can write import calculator or from calculator import add. The module's top-level code runs once, the first time it is imported, and its functions and constants become available. Keep modules focused: calculations in one, file handling in another, the user interface in a third.",
        example:
          "python-course/\n├── calculator.py      def add(a, b): ...\n│                     def divide(a, b): ...\n└── main.py            from calculator import add, divide\n                       print(add(2, 3))",
        codeChallenge: {
          task: "The module geometry.py is already in your folder (you can see its contents in the sample). Import it and print three lines: the area of a circle of radius 3 (rounded to 2 dp), the area of a 4 × 5 rectangle, and the value of geometry.PI. Use from geometry import ... for the two functions.",
          starter: "# geometry.py is in your folder: import from it\n",
          sample: "geometry.py contains:\n  PI = 3.14159\n  def circle_area(r): return PI * r * r\n  def rectangle_area(w, h): return w * h\n\nOutput:\n28.27\n20\n3.14159",
          tests: [
            {
              files: { "geometry.py": "PI = 3.14159\n\ndef circle_area(r):\n    return PI * r * r\n\ndef rectangle_area(w, h):\n    return w * h\n" },
              check:
                'assert lines == ["28.27", "20", "3.14159"], "Expected 28.27, 20, 3.14159. Yours: " + repr(lines)\n' +
                'import ast\n' +
                'froms = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.ImportFrom) and n.module == "geometry"]\n' +
                'assert froms, "Use from geometry import ... for the functions."\n' +
                'assert "def circle_area" not in source, "Import the function rather than writing your own copy."',
            },
          ],
          solution: "import geometry\nfrom geometry import circle_area, rectangle_area\n\nprint(round(circle_area(3), 2))\nprint(rectangle_area(4, 5))\nprint(geometry.PI)\n",
          hint: "from geometry import circle_area, rectangle_area, and import geometry for geometry.PI (or import PI too).",
          successMessage: "Your code used functions defined in another file. That is how every real project is structured.",
        },
      },
      {
        id: "a-pp-packages",
        title: "Packages and __init__.py",
        explain:
          "A package is a folder of modules. It traditionally contains an __init__.py file, which runs when the package is imported and can expose the package's main names. Import from a package with dots: from shop.pricing import apply_discount. Packages are how large projects and every library on PyPI are organised.",
        example:
          "shop/\n├── __init__.py        from .pricing import apply_discount\n├── pricing.py         def apply_discount(price, percent): ...\n└── tax.py             VAT = 0.075\n                       def add_vat(price): ...\n\nmain.py:   from shop.tax import add_vat\n           from shop import apply_discount   (exposed by __init__.py)",
        codeChallenge: {
          task: "The package shop (with pricing.py, tax.py and an __init__.py that exposes apply_discount) is in your folder. Write checkout(price, percent) that applies the discount with shop.apply_discount and then adds VAT with shop.tax.add_vat, returning the result rounded to 2 dp. Print checkout(20000, 10).",
          starter: "# Import from the shop package\n\ndef checkout(price, percent):\n    pass\n",
          sample: "checkout(20000, 10) → 19350.0",
          tests: [
            {
              files: {
                "shop/__init__.py": "from .pricing import apply_discount\n",
                "shop/pricing.py": "def apply_discount(price, percent):\n    return price * (100 - percent) / 100\n",
                "shop/tax.py": "VAT = 0.075\n\ndef add_vat(price):\n    return price * (1 + VAT)\n",
              },
              check:
                'assert checkout(20000, 10) == 19350.0, "20000 less 10% is 18000; plus 7.5% VAT is 19350.0. Got " + repr(checkout(20000, 10))\n' +
                'assert checkout(1000, 0) == 1075.0, "No discount: 1000 plus VAT is 1075.0."\n' +
                'assert lines and lines[-1] == "19350.0", "Print checkout(20000, 10)."\n' +
                'assert "shop" in source and "1.075" not in source and "0.075" not in source, "Use the package\'s functions; do not hard-code the VAT rate."',
            },
          ],
          solution: "from shop import apply_discount\nfrom shop.tax import add_vat\n\ndef checkout(price, percent):\n    return round(add_vat(apply_discount(price, percent)), 2)\n\nprint(checkout(20000, 10))\n",
          hint: "from shop import apply_discount works because __init__.py exposes it. add_vat lives in shop.tax.",
          successMessage: "You used a package exactly as you will use any installed library: by its dotted names, without caring how it is laid out inside.",
        },
      },
      {
        id: "a-pp-import-paths",
        title: "Import paths and naming conflicts",
        explain:
          "When you import a name, Python searches the folders listed in sys.path in order, starting with the folder of the script you ran, then the standard library and installed packages. So a file of yours called random.py or statistics.py SHADOWS the standard module: import random finds your file first, and its functions are missing. Never name your files after modules you use.",
        decision: {
          scenario: "A learner saves their practice file as random.py. Running it gives: AttributeError: module 'random' has no attribute 'randint'.",
          question: "What is happening?",
          options: [
            {
              id: "a",
              text: "import random finds their own random.py first, which has no randint, instead of the standard library module",
              why: "The script's own folder comes first in sys.path, so the learner's file shadows the real module. Renaming it (and deleting any __pycache__) fixes it.",
            },
            {
              id: "b",
              text: "The random module has been removed from Python",
              whyWrong: "It is still there; it is just hidden behind the file with the same name.",
            },
            {
              id: "c",
              text: "randint must be spelled RandInt",
              whyWrong: "randint is correct; the wrong module is being imported.",
            },
            {
              id: "d",
              text: "Python needs reinstalling",
              whyWrong: "Nothing is broken in Python; it is finding the wrong file first.",
            },
          ],
          correct: "a",
          aftermath: "If a standard module suddenly \"loses\" its functions, check for a file of yours with the same name.",
        },
      },
      {
        id: "a-pp-main-guard",
        title: "The if __name__ == \"__main__\": pattern",
        explain:
          "Every module has a __name__. When a file is run directly, its __name__ is \"__main__\"; when it is imported, __name__ is the module's own name. Putting the program's start-up code under if __name__ == \"__main__\": means it runs when you run the file, but NOT when another file imports it for its functions. Convention: put that code in a main() function and call it from the guard.",
        code: {
          language: PY,
          code: 'def greet(name):\n    return f"Hello, {name}"\n\ndef main():\n    print(greet("Ada"))\n\nprint("__name__ is", __name__)\nif __name__ == "__main__":\n    main()\n',
          expectedOutput: "__name__ is __main__\nHello, Ada",
        },
        codeChallenge: {
          task: "Turn this script into a reusable module: keep to_celsius(f) as a function, move the printing into a main() function, and call main() only under an if __name__ == \"__main__\": guard. When run directly it should still print the three conversions.",
          starter: 'def to_celsius(f):\n    return round((f - 32) * 5 / 9, 1)\n\nfor temp in [32, 98.6, 212]:\n    print(temp, "F =", to_celsius(temp), "C")\n',
          sample: "32 F = 0.0 C\n98.6 F = 37.0 C\n212 F = 100.0 C",
          tests: [
            {
              check:
                'assert lines == ["32 F = 0.0 C", "98.6 F = 37.0 C", "212 F = 100.0 C"], "Run directly, it should print the three conversions. Yours: " + repr(lines)\n' +
                'assert to_celsius(50) == 10.0, "to_celsius must still work."\n' +
                'import ast\n' +
                'tree = ast.parse(source)\n' +
                'assert any(isinstance(n, ast.FunctionDef) and n.name == "main" for n in tree.body), "Define a main() function."\n' +
                'guards = [n for n in tree.body if isinstance(n, ast.If) and "__name__" in ast.unparse(n.test) and "__main__" in ast.unparse(n.test)]\n' +
                'assert guards, "Add if __name__ == \\"__main__\\": at the bottom."\n' +
                'assert not any(isinstance(n, ast.For) for n in tree.body), "No loose loop at the top level: it belongs inside main()."',
            },
          ],
          solution: 'def to_celsius(f):\n    return round((f - 32) * 5 / 9, 1)\n\ndef main():\n    for temp in [32, 98.6, 212]:\n        print(temp, "F =", to_celsius(temp), "C")\n\nif __name__ == "__main__":\n    main()\n',
          hint: "Indent the for loop inside def main():, then add the two-line guard at the bottom.",
          successMessage: "Now another file can import to_celsius without the conversions printing. Every script you write from now on should end this way.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 14.7 – 14.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l60-pip-venv",
    moduleId: "pp-m14-modules",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.7", "14.8", "14.9", "14.10"],
    title: "pip, Virtual Environments and Dependencies",
    subtitle: "Installing packages, isolating projects, and recording what they need",
    estimatedMinutes: 22,
    intro:
      "Beyond the standard library are over half a million packages on PyPI, the Python Package Index. pip installs them, a virtual environment keeps each project's packages separate, and requirements.txt records exactly what a project needs so anyone can recreate it.",

    atoms: [
      {
        id: "a-pp-pip",
        title: "Installing packages using pip",
        explain:
          "pip is Python's package installer. python -m pip install requests installs the latest version; requests==2.32.3 pins an exact version; pip list shows what is installed; pip show requests describes one package; pip uninstall removes it. Writing python -m pip (rather than plain pip) guarantees you install into the Python you are actually running.",
        example:
          "> python -m pip install requests\nSuccessfully installed certifi charset-normalizer idna requests urllib3\n\n> python -m pip show requests\nName: requests\nVersion: 2.32.3\nRequires: certifi, charset-normalizer, idna, urllib3\n\nNote: requests pulled in four other packages. Those are its\ndependencies, installed automatically.",
      },
      {
        id: "a-pp-venv",
        title: "Virtual environments with venv",
        explain:
          "A virtual environment is a private copy of Python for one project, with its own installed packages. Project A can use one version of a library and project B another, without conflict, and nothing pollutes your main Python. Create one per project, activate it before working, and VS Code will pick it up as the interpreter.",
        example:
          "In the project folder:\n\n  python -m venv .venv                 create it (once)\n\n  .venv\\Scripts\\activate               activate on Windows\n  source .venv/bin/activate            activate on macOS / Linux\n\n  (.venv) > python -m pip install requests\n  (.venv) > deactivate                 leave it\n\nThe (.venv) prefix shows it is active. Add .venv/ to .gitignore:\nan environment is rebuilt from requirements.txt, never committed.",
        decision: {
          scenario: "Two of your projects need different versions of the same library: one needs version 1.x, the other 2.x.",
          question: "What is the clean solution?",
          options: [
            {
              id: "a",
              text: "Give each project its own virtual environment with the version it needs",
              why: "Each environment has its own packages, so both versions can be installed side by side without conflict.",
            },
            {
              id: "b",
              text: "Reinstall the library every time you switch projects",
              whyWrong: "Slow, error-prone, and easy to forget.",
            },
            {
              id: "c",
              text: "Install both versions globally",
              whyWrong: "A single Python installation can only have one version of a package at a time.",
            },
            {
              id: "d",
              text: "Rewrite one project to avoid the library",
              whyWrong: "Unnecessary; this is exactly the problem virtual environments solve.",
            },
          ],
          correct: "a",
          aftermath: "One project, one virtual environment. It is the first thing to set up in any new Python project.",
        },
      },
      {
        id: "a-pp-requirements",
        title: "Dependency management and requirements.txt",
        explain:
          "requirements.txt lists a project's dependencies, one per line, usually with versions: requests==2.32.3 (exact) or flask>=3.0 (minimum). python -m pip freeze > requirements.txt records everything installed in the environment; python -m pip install -r requirements.txt recreates it on another machine. Lines starting with # are comments.",
        codeChallenge: {
          task: "Write parse_requirements(text) that takes the contents of a requirements.txt file and returns a dictionary of package name (lower case) → version specifier, such as {\"requests\": \"==2.32.3\", \"flask\": \">=3.0\", \"rich\": \"\"}. Skip blank lines and comments (lines starting with #, or anything after a # on a line). Handle ==, >=, <= and no specifier.",
          starter: "def parse_requirements(text):\n    pass\n",
          sample: "parse_requirements(\"requests==2.32.3\\nFlask>=3.0\\n# tools\\nrich\") → {'requests': '==2.32.3', 'flask': '>=3.0', 'rich': ''}",
          tests: [
            {
              check:
                'text = "# web\\nrequests==2.32.3\\n\\nFlask>=3.0   # API\\nrich\\npytest<=8.3.0\\n"\n' +
                'got = parse_requirements(text)\n' +
                'assert got == {"requests": "==2.32.3", "flask": ">=3.0", "rich": "", "pytest": "<=8.3.0"}, "Got " + repr(got)\n' +
                'assert parse_requirements("") == {}, "An empty file gives an empty dictionary."',
            },
          ],
          solution: 'def parse_requirements(text):\n    result = {}\n    for line in text.splitlines():\n        line = line.split("#", 1)[0].strip()\n        if not line:\n            continue\n        for op in ("==", ">=", "<="):\n            if op in line:\n                name, version = line.split(op, 1)\n                result[name.strip().lower()] = op + version.strip()\n                break\n        else:\n            result[line.lower()] = ""\n    return result\n',
          hint: "For each line: drop everything after #, strip, skip if empty. Try each operator; if found, split on it. The for/else handles \"no operator\".",
          successMessage: "A small parser for a real file format. Tools like pip and Dependabot read requirements.txt in essentially this way.",
        },
      },
      {
        id: "a-pp-docs-selection",
        title: "Documentation and choosing packages",
        explain:
          "Before installing a package, check it: is it actively maintained (recent releases)? Widely used? Well documented, with a clear licence? Does it pull in many dependencies? Read the official documentation first (docs.python.org for the standard library, the package's own docs on PyPI), and prefer the standard library when it does the job. Each dependency is code you trust with your project.",
        decision: {
          scenario: "You need to read a CSV file. You find a package on PyPI called super-csv-reader, last released six years ago, with 40 downloads a week.",
          question: "What should you do?",
          options: [
            {
              id: "a",
              text: "Use the standard library's csv module, which already does this, is maintained, and adds no dependency",
              why: "The standard library is maintained with Python itself. An unmaintained package adds risk and gives you nothing extra here.",
            },
            {
              id: "b",
              text: "Install super-csv-reader because it has \"super\" in the name",
              whyWrong: "Names are marketing. Maintenance, usage and documentation are what matter, and it fails on all three.",
            },
            {
              id: "c",
              text: "Write your own CSV parser from scratch",
              whyWrong: "CSV has edge cases (quoted commas, new lines in fields) that the csv module already handles.",
            },
            {
              id: "d",
              text: "Install it and pin it, so it never changes",
              whyWrong: "Pinning does not fix an abandoned package; unfixed bugs stay unfixed.",
            },
          ],
          correct: "a",
          aftermath: "Prefer the standard library, then well-maintained, widely used packages. Every dependency is a long-term commitment.",
        },
      },
    ],

    task: {
      title: "Module 14 practice: a clean, modular project",
      intro: "Do this in VS Code on your own machine. The milestone is to structure and run projects with external libraries.",
      prompts: [
        "Split a calculator into modules: operations.py (the maths), validation.py (input checks), and main.py (the menu), with the __main__ guard.",
        "Create a reusable utility package, utils/, with text.py (normalise, make_handle) and numbers.py (safe_int, money), and an __init__.py that exposes the most useful functions.",
        "Set up a clean project environment: create a virtual environment, install the rich package, use it to print a coloured table, and save requirements.txt with pip freeze.",
        "Delete the environment, recreate it from requirements.txt, and confirm the program still runs.",
      ],
      closing: "Next: professional practice. Readable code, Git and documentation, so other people can work with your projects.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
