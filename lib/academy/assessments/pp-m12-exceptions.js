/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 12
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l50-errors-tracebacks": {
    lessonId: "pp-l50-errors-tracebacks",
    passMark: 70,
    questions: [
      {
        id: "ppq50-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-error-kinds",
        prompt: "A program runs without any error message but prints the wrong total. What kind of error is this?",
        options: [
          { id: "a", text: "A logical error" },
          { id: "b", text: "A syntax error" },
          { id: "c", text: "A runtime error" },
          { id: "d", text: "Not an error" },
        ],
        correct: "a",
        explanation: "Logical errors produce wrong results without any message; only testing reveals them.",
        whyWrong: {
          b: "A syntax error stops the file from running at all.",
          c: "A runtime error raises an exception with a traceback.",
          d: "A wrong answer is definitely an error.",
        },
      },
      {
        id: "ppq50-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-tracebacks",
        prompt: "Where in a traceback should you start reading?",
        options: [
          { id: "a", text: "The last line: it names the exception and its message" },
          { id: "b", text: "The first line" },
          { id: "c", text: "The middle" },
          { id: "d", text: "Tracebacks should be ignored" },
        ],
        correct: "a",
        explanation: "The last line says what went wrong; the lines above it say where and how you got there.",
        whyWrong: {
          b: "The first line just says \"Traceback (most recent call last)\".",
          c: "Start with what failed, then work upwards.",
          d: "The traceback is the most useful information you have.",
        },
      },
      {
        id: "ppq50-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-tracebacks",
        prompt: "A traceback ends with:\n  File \"app.py\", line 9, in total\n    return a + b\nTypeError: unsupported operand type(s) for +: 'int' and 'str'\n\nWhat is the likely cause?",
        options: [
          { id: "a", text: "On line 9, one of a or b is a string, probably input that was never converted with int()" },
          { id: "b", text: "Line 9 has a typo in the word return" },
          { id: "c", text: "Python cannot add numbers" },
          { id: "d", text: "The file app.py is missing" },
        ],
        correct: "a",
        explanation: "int + str is not allowed. The usual culprit is an input() value that was not converted.",
        whyWrong: {
          b: "A typo there would be a syntax or name error.",
          c: "Python adds numbers fine; one operand is text.",
          d: "The traceback shows app.py running.",
        },
      },
      {
        id: "ppq50-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-error-kinds",
        prompt: "What is the most reliable way to find logical errors?",
        options: [
          { id: "a", text: "Test with inputs whose correct answers you worked out by hand, including boundaries" },
          { id: "b", text: "Read the error message" },
          { id: "c", text: "Run the program faster" },
          { id: "d", text: "Add more comments" },
        ],
        correct: "a",
        explanation: "Logical errors produce no message, so the only signal is a result that differs from a known correct answer.",
        whyWrong: {
          b: "Logical errors produce no error message.",
          c: "Speed does not reveal wrong logic.",
          d: "Comments do not change behaviour.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l51-try-except": {
    lessonId: "pp-l51-try-except",
    passMark: 70,
    questions: [
      {
        id: "ppq51-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-try-except",
        prompt: "try:\n    x = int(\"5\")\nexcept ValueError:\n    print(\"A\")\nelse:\n    print(\"B\")\nfinally:\n    print(\"C\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "B\nC" },
          { id: "b", text: "A\nC" },
          { id: "c", text: "A\nB\nC" },
          { id: "d", text: "C" },
        ],
        correct: "a",
        explanation: "No exception, so else runs (B), and finally always runs (C).",
        whyWrong: {
          b: "int(\"5\") succeeds, so except is skipped.",
          c: "except and else never both run.",
          d: "else runs when there was no exception.",
        },
      },
      {
        id: "ppq51-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-try-except",
        prompt: "Why is a bare except: (catching everything) usually a bad idea?",
        options: [
          { id: "a", text: "It also catches real bugs and typos, hiding them" },
          { id: "b", text: "It is a syntax error" },
          { id: "c", text: "It only catches ValueError" },
          { id: "d", text: "It makes the program slower" },
        ],
        correct: "a",
        explanation: "Catch the specific exceptions you expect and can handle; let unexpected ones surface.",
        whyWrong: {
          b: "It is valid syntax, which is why it is tempting.",
          c: "It catches everything, which is the problem.",
          d: "Speed is not the issue.",
        },
      },
      {
        id: "ppq51-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-common-exceptions",
        prompt: "Which exception does prices[\"yam\"] raise when the key \"yam\" is absent?",
        options: [
          { id: "a", text: "KeyError" },
          { id: "b", text: "IndexError" },
          { id: "c", text: "ValueError" },
          { id: "d", text: "NameError" },
        ],
        correct: "a",
        explanation: "A missing dictionary key raises KeyError.",
        whyWrong: {
          b: "IndexError is for list positions out of range.",
          c: "ValueError is for unusable values such as int(\"abc\").",
          d: "prices exists; only the key is missing.",
        },
      },
      {
        id: "ppq51-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-common-exceptions",
        prompt: "Opening a file that does not exist in read mode raises...",
        options: [
          { id: "a", text: "FileNotFoundError" },
          { id: "b", text: "KeyError" },
          { id: "c", text: "Nothing; it creates the file" },
          { id: "d", text: "TypeError" },
        ],
        correct: "a",
        explanation: "Reading needs an existing file. Only \"w\" and \"a\" create missing files.",
        whyWrong: {
          b: "KeyError is for dictionaries.",
          c: "Read mode never creates files.",
          d: "The type of the path is fine; the file is absent.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l52-raise-custom": {
    lessonId: "pp-l52-raise-custom",
    passMark: 70,
    questions: [
      {
        id: "ppq52-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-raise",
        prompt: "A function receives an age of -5. What is the best response?",
        options: [
          { id: "a", text: "raise ValueError(\"age cannot be negative\")" },
          { id: "b", text: "Silently use 0 instead" },
          { id: "c", text: "Return -5 unchanged" },
          { id: "d", text: "Print \"error\" and continue as if nothing happened" },
        ],
        correct: "a",
        explanation: "Raising stops bad data at once with a clear message, and lets the caller decide how to respond.",
        whyWrong: {
          b: "Silent substitution hides the problem and produces wrong results.",
          c: "That lets impossible data travel through the program.",
          d: "Printing and continuing still passes bad data on.",
        },
      },
      {
        id: "ppq52-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-raise",
        prompt: "def f(n):\n    if n < 0:\n        raise ValueError(\"negative\")\n    print(\"ok\")\n\nf(-1)\n\nWhat happens?",
        options: [
          { id: "a", text: "ValueError: negative is raised and \"ok\" is not printed" },
          { id: "b", text: "\"ok\" is printed, then the error" },
          { id: "c", text: "Nothing happens" },
          { id: "d", text: "\"negative\" is printed as normal output" },
        ],
        correct: "a",
        explanation: "raise stops the function immediately; with nothing catching it, the program stops with a traceback.",
        whyWrong: {
          b: "raise ends the function before the print.",
          c: "An uncaught exception stops the program visibly.",
          d: "The message is part of the exception, not normal output.",
        },
      },
      {
        id: "ppq52-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-custom-exceptions",
        prompt: "How do you define a custom exception?",
        options: [
          { id: "a", text: "class PaymentError(Exception): pass" },
          { id: "b", text: "def PaymentError(): raise" },
          { id: "c", text: "PaymentError = \"error\"" },
          { id: "d", text: "import PaymentError" },
        ],
        correct: "a",
        explanation: "A custom exception is a class that inherits from Exception.",
        whyWrong: {
          b: "A function is not an exception type.",
          c: "A string cannot be raised.",
          d: "There is no such built-in module.",
        },
      },
      {
        id: "ppq52-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-defensive",
        prompt: "Which is a principle of defensive programming?",
        options: [
          { id: "a", text: "Validate data where it enters the program and fail with a clear message" },
          { id: "b", text: "Wrap everything in try: ... except: pass" },
          { id: "c", text: "Trust that users type correct data" },
          { id: "d", text: "Avoid error messages so users are not worried" },
        ],
        correct: "a",
        explanation: "Check inputs at the boundaries and stop bad data early, clearly.",
        whyWrong: {
          b: "That hides every error, including bugs.",
          c: "Users mistype all the time.",
          d: "Clear messages help users fix their input.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l53-debug-validate": {
    lessonId: "pp-l53-debug-validate",
    passMark: 70,
    questions: [
      {
        id: "ppq53-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-vscode-debugger",
        prompt: "In VS Code, what does a breakpoint do?",
        options: [
          { id: "a", text: "Pauses the program at that line when debugging, so you can inspect variables" },
          { id: "b", text: "Deletes the line" },
          { id: "c", text: "Makes the line run twice" },
          { id: "d", text: "Fixes the bug automatically" },
        ],
        correct: "a",
        explanation: "Execution stops at the breakpoint and the Variables panel shows the current state.",
        whyWrong: {
          b: "Breakpoints never change your code.",
          c: "The line runs once, after you continue.",
          d: "The debugger shows you the state; you fix the bug.",
        },
      },
      {
        id: "ppq53-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-vscode-debugger",
        prompt: "Paused at a line that calls calculate_tax(price), which control goes INTO the function?",
        options: [
          { id: "a", text: "Step Into (F11)" },
          { id: "b", text: "Step Over (F10)" },
          { id: "c", text: "Continue (F5)" },
          { id: "d", text: "Stop (Shift+F5)" },
        ],
        correct: "a",
        explanation: "Step Into enters the called function; Step Over runs it in one go.",
        whyWrong: {
          b: "Step Over runs the whole call without entering it.",
          c: "Continue runs to the next breakpoint.",
          d: "Stop ends the debugging session.",
        },
      },
      {
        id: "ppq53-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-assertions",
        prompt: "Why should you NOT use assert to validate user input?",
        options: [
          { id: "a", text: "Assertions can be switched off with python -O, so the check would disappear" },
          { id: "b", text: "assert cannot compare numbers" },
          { id: "c", text: "assert is slower than if" },
          { id: "d", text: "assert only works inside functions" },
        ],
        correct: "a",
        explanation: "Assertions check programmer assumptions. Input validation must always run, so use if and raise.",
        whyWrong: {
          b: "assert accepts any condition.",
          c: "Speed is not the reason.",
          d: "assert works anywhere.",
        },
      },
      {
        id: "ppq53-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-unexpected-input",
        prompt: "A score-entry function accepts \" 85 \". Which line handles the spaces?",
        options: [
          { id: "a", text: "int(\" 85 \".strip()), although int() already ignores surrounding spaces" },
          { id: "b", text: "Spaces always cause ValueError" },
          { id: "c", text: "float(\" 85 \") is required" },
          { id: "d", text: "It cannot be handled" },
        ],
        correct: "a",
        explanation: "int() tolerates surrounding whitespace, and stripping first makes the intent explicit and also helps empty-input checks.",
        whyWrong: {
          b: "int(\" 85 \") is actually 85.",
          c: "float is not needed for a whole number.",
          d: "It is easily handled.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
