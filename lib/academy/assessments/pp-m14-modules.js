/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 14
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l58-import-stdlib": {
    lessonId: "pp-l58-import-stdlib",
    passMark: 70,
    questions: [
      {
        id: "ppq58-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-importing",
        prompt: "After from math import sqrt, how do you call the function?",
        options: [
          { id: "a", text: "sqrt(25)" },
          { id: "b", text: "math.sqrt(25)" },
          { id: "c", text: "math->sqrt(25)" },
          { id: "d", text: "import sqrt(25)" },
        ],
        correct: "a",
        explanation: "from ... import brings the name itself into your file, so it is used without the module prefix.",
        whyWrong: {
          b: "That needs import math; with from-import, the name math is not defined.",
          c: "Python uses dots, not arrows.",
          d: "import is a statement, not a way to call a function.",
        },
      },
      {
        id: "ppq58-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-importing",
        prompt: "Why is from module import * discouraged?",
        options: [
          { id: "a", text: "It brings in many names invisibly, so readers cannot tell where a name came from and names can clash" },
          { id: "b", text: "It is a syntax error" },
          { id: "c", text: "It imports nothing" },
          { id: "d", text: "It only works with the math module" },
        ],
        correct: "a",
        explanation: "Explicit imports document where each name comes from and avoid accidental overwriting.",
        whyWrong: {
          b: "It is valid, just a bad habit.",
          c: "It imports everything public.",
          d: "It works with any module.",
        },
      },
      {
        id: "ppq58-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-stdlib-tour",
        prompt: "from collections import Counter\nprint(Counter([\"a\", \"b\", \"a\"])[\"a\"])\n\nWhat is printed?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "1" },
          { id: "c", text: "['a', 'a']" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "A Counter maps each item to how many times it appears.",
        whyWrong: {
          b: "\"a\" appears twice.",
          c: "Counter stores counts, not the items.",
          d: "Indexing a Counter by an item is how you read its count.",
        },
      },
      {
        id: "ppq58-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-stdlib-tour",
        prompt: "from datetime import date\nprint((date(2026, 3, 1) - date(2026, 2, 1)).days)\n\nWhat is printed?",
        options: [
          { id: "a", text: "28" },
          { id: "b", text: "30" },
          { id: "c", text: "29" },
          { id: "d", text: "1" },
        ],
        correct: "a",
        explanation: "February 2026 has 28 days (2026 is not a leap year), and datetime knows the calendar.",
        whyWrong: {
          b: "February never has 30 days.",
          c: "2026 is not a leap year.",
          d: "The difference is counted in days, not months.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l59-own-modules": {
    lessonId: "pp-l59-own-modules",
    passMark: 70,
    questions: [
      {
        id: "ppq59-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-own-modules",
        prompt: "What makes a Python file a module you can import?",
        options: [
          { id: "a", text: "Any .py file is a module; import it by its name without .py" },
          { id: "b", text: "It must start with the word module" },
          { id: "c", text: "It must be installed with pip" },
          { id: "d", text: "It must contain a class" },
        ],
        correct: "a",
        explanation: "calculator.py in the same folder is imported with import calculator.",
        whyWrong: {
          b: "No special first line is needed.",
          c: "pip installs third-party packages; your own files need no installing.",
          d: "Modules can contain any code.",
        },
      },
      {
        id: "ppq59-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-packages",
        prompt: "What is a package in Python?",
        options: [
          { id: "a", text: "A folder of modules, usually with an __init__.py, imported with dotted names" },
          { id: "b", text: "A single function" },
          { id: "c", text: "A zip file of photos" },
          { id: "d", text: "Another name for a variable" },
        ],
        correct: "a",
        explanation: "from shop.pricing import apply_discount reads the pricing module inside the shop package.",
        whyWrong: {
          b: "A function lives inside a module.",
          c: "A package is a folder of Python code.",
          d: "It is a way of organising modules.",
        },
      },
      {
        id: "ppq59-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-import-paths",
        prompt: "Your project folder contains statistics.py. Another file runs import statistics; statistics.mean([1, 2]). What is likely to happen?",
        options: [
          { id: "a", text: "Your statistics.py is imported instead of the standard library, so mean may not exist" },
          { id: "b", text: "Python merges both files" },
          { id: "c", text: "It always uses the standard library" },
          { id: "d", text: "Python asks which one you mean" },
        ],
        correct: "a",
        explanation: "The script's own folder is searched first, so a same-named file shadows the standard module.",
        whyWrong: {
          b: "Only one module with a given name is imported.",
          c: "The local folder comes first in sys.path.",
          d: "Python never asks; it takes the first match.",
        },
      },
      {
        id: "ppq59-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-main-guard",
        prompt: "What does if __name__ == \"__main__\": achieve?",
        options: [
          { id: "a", text: "Code under it runs when the file is run directly, but not when the file is imported" },
          { id: "b", text: "It makes the file run faster" },
          { id: "c", text: "It is required in every file" },
          { id: "d", text: "It hides the file from other programs" },
        ],
        correct: "a",
        explanation: "Run directly, __name__ is \"__main__\"; imported, it is the module name, so the guarded code is skipped.",
        whyWrong: {
          b: "It has no effect on speed.",
          c: "It is a convention, not a requirement.",
          d: "Other files can still import it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l60-pip-venv": {
    lessonId: "pp-l60-pip-venv",
    passMark: 70,
    questions: [
      {
        id: "ppq60-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-pip",
        prompt: "Which command installs the requests package for the Python you are running?",
        options: [
          { id: "a", text: "python -m pip install requests" },
          { id: "b", text: "import requests" },
          { id: "c", text: "pip download python" },
          { id: "d", text: "install requests.py" },
        ],
        correct: "a",
        explanation: "python -m pip ties pip to the exact interpreter you are using.",
        whyWrong: {
          b: "import uses a package that is already installed.",
          c: "That is not how packages are installed.",
          d: "There is no install command like that.",
        },
      },
      {
        id: "ppq60-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-venv",
        prompt: "Why create a virtual environment for each project?",
        options: [
          { id: "a", text: "Each project gets its own isolated set of packages and versions" },
          { id: "b", text: "Python will not run without one" },
          { id: "c", text: "It makes code run faster" },
          { id: "d", text: "It backs up your code" },
        ],
        correct: "a",
        explanation: "Isolation prevents version conflicts between projects and keeps your main Python clean.",
        whyWrong: {
          b: "Python runs without one; you just risk conflicts.",
          c: "Speed is unaffected.",
          d: "Use Git for backups.",
        },
      },
      {
        id: "ppq60-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-requirements",
        prompt: "What does python -m pip install -r requirements.txt do?",
        options: [
          { id: "a", text: "Installs every package listed in the file, at the versions given" },
          { id: "b", text: "Deletes the listed packages" },
          { id: "c", text: "Creates requirements.txt" },
          { id: "d", text: "Runs the project" },
        ],
        correct: "a",
        explanation: "-r reads the requirements file, which is how a project's environment is recreated.",
        whyWrong: {
          b: "That would be uninstall.",
          c: "pip freeze > requirements.txt creates it.",
          d: "It only installs dependencies.",
        },
      },
      {
        id: "ppq60-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-docs-selection",
        prompt: "Which is the strongest sign a third-party package is a safe choice?",
        options: [
          { id: "a", text: "Recent releases, wide use, good documentation and a clear licence" },
          { id: "b", text: "An exciting name" },
          { id: "c", text: "It has not changed in many years" },
          { id: "d", text: "It has the most dependencies" },
        ],
        correct: "a",
        explanation: "Maintenance, adoption and documentation are the best predictors that a package will keep working.",
        whyWrong: {
          b: "A name says nothing about quality.",
          c: "No releases for years often means abandoned.",
          d: "More dependencies means more risk.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
