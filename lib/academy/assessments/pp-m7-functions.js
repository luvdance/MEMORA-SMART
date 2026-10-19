/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 7
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l27-def-call": {
    lessonId: "pp-l27-def-call",
    passMark: 70,
    questions: [
      {
        id: "ppq27-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-why-functions",
        prompt: "What is the main benefit of putting repeated code into a function?",
        options: [
          { id: "a", text: "The logic is written once, so a change or fix is made in one place" },
          { id: "b", text: "Functions make Python run on more computers" },
          { id: "c", text: "Functions remove the need for variables" },
          { id: "d", text: "There is no benefit; copying is equivalent" },
        ],
        correct: "a",
        explanation: "One definition is a single source of truth, and calling it by name also makes code easier to read.",
        whyWrong: {
          b: "Functions do not affect where Python runs.",
          c: "Functions use variables all the time.",
          d: "Copies drift apart and multiply the work of every change.",
        },
      },
      {
        id: "ppq27-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-def-call",
        prompt: "def hello():\n    print(\"Hello\")\n\nprint(\"Start\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "Hello\nStart" },
          { id: "b", text: "Start" },
          { id: "c", text: "Start\nHello" },
          { id: "d", text: "Nothing" },
        ],
        correct: "b",
        explanation: "def only defines the function. It is never called, so Hello is never printed.",
        whyWrong: {
          a: "Defining a function does not run it.",
          c: "hello() is never called.",
          d: "print(\"Start\") runs.",
        },
      },
      {
        id: "ppq27-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-parameters",
        prompt: "In def pay(amount): ... and the call pay(5000), what are amount and 5000?",
        options: [
          { id: "a", text: "amount is the parameter; 5000 is the argument" },
          { id: "b", text: "amount is the argument; 5000 is the parameter" },
          { id: "c", text: "Both are parameters" },
          { id: "d", text: "Both are return values" },
        ],
        correct: "a",
        explanation: "Parameters are the names in the definition; arguments are the values passed in a call.",
        whyWrong: {
          b: "It is the other way round.",
          c: "5000 is a value passed in the call: an argument.",
          d: "Nothing here is returned.",
        },
      },
      {
        id: "ppq27-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-parameters",
        prompt: "def show(a, b):\n    print(a, b)\n\nshow(\"x\")\n\nWhat happens?",
        options: [
          { id: "a", text: "Prints x None" },
          { id: "b", text: "TypeError: show() missing 1 required positional argument: 'b'" },
          { id: "c", text: "Prints x" },
          { id: "d", text: "Prints x x" },
        ],
        correct: "b",
        explanation: "Every parameter without a default needs an argument. Only one was given.",
        whyWrong: {
          a: "Python does not fill missing arguments with None.",
          c: "The call fails before anything prints.",
          d: "Arguments are not reused for other parameters.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l28-return-arguments": {
    lessonId: "pp-l28-return-arguments",
    passMark: 70,
    questions: [
      {
        id: "ppq28-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-return",
        prompt: "def double(n):\n    print(n * 2)\n\nx = double(4)\nprint(x)\n\nWhat is printed?",
        options: [
          { id: "a", text: "8\n8" },
          { id: "b", text: "8\nNone" },
          { id: "c", text: "None" },
          { id: "d", text: "8" },
        ],
        correct: "b",
        explanation: "double prints 8 but returns nothing, so x is None.",
        whyWrong: {
          a: "print() shows a value; it does not return it.",
          c: "The print inside double runs first.",
          d: "print(x) also runs, showing None.",
        },
      },
      {
        id: "ppq28-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-return",
        prompt: "def check(n):\n    if n > 0:\n        return \"positive\"\n    return \"not positive\"\n    print(\"done\")\n\nprint(check(5))\n\nWhat is printed?",
        options: [
          { id: "a", text: "positive" },
          { id: "b", text: "positive\ndone" },
          { id: "c", text: "positive\nnot positive" },
          { id: "d", text: "done" },
        ],
        correct: "a",
        explanation: "return ends the function immediately. Nothing after the return that ran is executed.",
        whyWrong: {
          b: "print(\"done\") comes after a return and can never run.",
          c: "Only the first return reached is used.",
          d: "The returned value is printed by the caller.",
        },
      },
      {
        id: "ppq28-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-keyword-args",
        prompt: "def order(item, qty):\n    print(qty, item)\n\norder(qty=3, item=\"pens\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "3 pens" },
          { id: "b", text: "pens 3" },
          { id: "c", text: "An error, because the order is wrong" },
          { id: "d", text: "qty item" },
        ],
        correct: "a",
        explanation: "Keyword arguments are matched by name, so their order in the call does not matter.",
        whyWrong: {
          b: "The function prints qty first.",
          c: "Keyword arguments can be in any order.",
          d: "The values are printed, not the names.",
        },
      },
      {
        id: "ppq28-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-defaults",
        prompt: "def greet(name, greeting=\"Hello\"):\n    return greeting + \", \" + name\n\nprint(greet(\"Ada\"), \"|\", greet(\"Ada\", \"Hi\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "Hello, Ada | Hi, Ada" },
          { id: "b", text: "Hello, Ada | Hello, Ada" },
          { id: "c", text: "Ada | Hi" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "The first call uses the default greeting; the second overrides it.",
        whyWrong: {
          b: "A passed argument replaces the default.",
          c: "The function joins greeting and name.",
          d: "Both calls are valid.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l29-scope-docstrings": {
    lessonId: "pp-l29-scope-docstrings",
    passMark: 70,
    questions: [
      {
        id: "ppq29-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-scope",
        prompt: "def make():\n    secret = 42\n\nmake()\nprint(secret)\n\nWhat happens?",
        options: [
          { id: "a", text: "42 is printed" },
          { id: "b", text: "NameError: name 'secret' is not defined" },
          { id: "c", text: "None is printed" },
          { id: "d", text: "0 is printed" },
        ],
        correct: "b",
        explanation: "secret is local to make(). It disappears when the function ends and is never visible outside.",
        whyWrong: {
          a: "Local variables cannot be seen outside the function.",
          c: "The name does not exist at the top level at all.",
          d: "Python never invents a value for a missing name.",
        },
      },
      {
        id: "ppq29-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-scope",
        prompt: "total = 10\n\ndef change():\n    total = 99\n\nchange()\nprint(total)\n\nWhat is printed?",
        options: [
          { id: "a", text: "99" },
          { id: "b", text: "10" },
          { id: "c", text: "An error" },
          { id: "d", text: "109" },
        ],
        correct: "b",
        explanation: "Assigning inside the function creates a new local total. The global total is untouched.",
        whyWrong: {
          a: "The 99 belongs to a local variable that vanished when change() ended.",
          c: "The code is valid.",
          d: "Nothing is added.",
        },
      },
      {
        id: "ppq29-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-multiple-returns",
        prompt: "def pair():\n    return 3, 7\n\na, b = pair()\nprint(b - a)\n\nWhat is printed?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "-4" },
          { id: "c", text: "(3, 7)" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "The two returned values are unpacked: a is 3, b is 7, and 7 - 3 is 4.",
        whyWrong: {
          b: "b is 7 and a is 3.",
          c: "The tuple was unpacked into a and b.",
          d: "Two names, two values: unpacking works.",
        },
      },
      {
        id: "ppq29-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-docstrings",
        prompt: "Where does a function's docstring go?",
        options: [
          { id: "a", text: "As a triple-quoted string on the first line inside the function" },
          { id: "b", text: "As a # comment above the def line" },
          { id: "c", text: "In a separate file" },
          { id: "d", text: "After the return statement" },
        ],
        correct: "a",
        explanation: "The first statement in the body, if it is a string, becomes the docstring, available to help() and editors.",
        whyWrong: {
          b: "A comment is ignored; it does not become the docstring.",
          c: "It lives inside the function.",
          d: "Code after return never runs, and that is not where Python looks.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l30-decompose-recursion": {
    lessonId: "pp-l30-decompose-recursion",
    passMark: 70,
    questions: [
      {
        id: "ppq30-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-decompose-functions",
        prompt: "Which design is best for a report-card program?",
        options: [
          { id: "a", text: "One long function that does everything" },
          { id: "b", text: "Small functions such as get_average, get_grade and format_report, each doing one job and returning a result" },
          { id: "c", text: "No functions at all" },
          { id: "d", text: "One function per line of code" },
        ],
        correct: "b",
        explanation: "Small single-purpose functions can each be tested and reused, and the main code reads like the algorithm.",
        whyWrong: {
          a: "A long function is hard to test, reuse and understand.",
          c: "Then nothing can be tested or reused separately.",
          d: "Functions should group a meaningful task, not wrap single lines.",
        },
      },
      {
        id: "ppq30-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-recursion",
        prompt: "What is the base case of a recursive function?",
        options: [
          { id: "a", text: "The case small enough to answer directly, which stops the recursion" },
          { id: "b", text: "The first line of the file" },
          { id: "c", text: "The largest input it accepts" },
          { id: "d", text: "A loop inside the function" },
        ],
        correct: "a",
        explanation: "Without a base case the function calls itself forever, until RecursionError.",
        whyWrong: {
          b: "It is a condition inside the function, not a location in the file.",
          c: "It is the smallest case, not the largest.",
          d: "Recursion replaces a loop; the base case is a condition.",
        },
      },
      {
        id: "ppq30-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-recursion",
        prompt: "def f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\n\nprint(f(4))\n\nWhat is printed?",
        options: [
          { id: "a", text: "24" },
          { id: "b", text: "10" },
          { id: "c", text: "4" },
          { id: "d", text: "1" },
        ],
        correct: "a",
        explanation: "f(4) = 4 × f(3) = 4 × 3 × f(2) = 4 × 3 × 2 × f(1) = 24. It is the factorial.",
        whyWrong: {
          b: "That would be a sum, 4 + 3 + 2 + 1.",
          c: "The recursion multiplies 4 by f(3), not by 1.",
          d: "1 is only the base case's answer.",
        },
      },
      {
        id: "ppq30-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-recursion",
        prompt: "def loop(n):\n    return loop(n - 1)\n\nloop(5)\n\nWhat happens?",
        options: [
          { id: "a", text: "Returns 0" },
          { id: "b", text: "RecursionError, because there is no base case" },
          { id: "c", text: "Returns 5" },
          { id: "d", text: "Nothing happens" },
        ],
        correct: "b",
        explanation: "With no base case, the calls never stop until Python's recursion limit is hit.",
        whyWrong: {
          a: "Nothing stops at 0; it keeps going into negative numbers.",
          c: "The function never returns a value directly.",
          d: "It is called, and keeps calling itself.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
