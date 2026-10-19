/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 2
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l5-syntax-statements": {
    lessonId: "pp-l5-syntax-statements",
    passMark: 70,
    questions: [
      {
        id: "ppq5-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-syntax-rules",
        prompt: "Which line is valid Python?",
        options: [
          { id: "a", text: "Print(\"Hello\")" },
          { id: "b", text: "print(\"Hello')" },
          { id: "c", text: "print('Hello')" },
          { id: "d", text: "print(\"Hello\"" },
        ],
        correct: "c",
        explanation: "Lower-case print, matching quotes (single quotes are fine), and the bracket is closed.",
        whyWrong: {
          a: "Python is case-sensitive: Print is not the same name as print.",
          b: "The quotes do not match: it opens with \" and closes with '.",
          d: "The closing bracket is missing.",
        },
      },
      {
        id: "ppq5-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-indentation",
        prompt: "print(\"A\")\n    print(\"B\")\n\nWhat happens when this runs?",
        options: [
          { id: "a", text: "A then B are printed" },
          { id: "b", text: "Only A is printed, then an error" },
          { id: "c", text: "Nothing prints: IndentationError: unexpected indent" },
          { id: "d", text: "B is printed with four spaces in front" },
        ],
        correct: "c",
        explanation: "Indentation is grammar in Python. The unexpected indent is found when Python checks the file, before anything runs, so not even A prints.",
        whyWrong: {
          a: "Python refuses to run a file with an indentation error.",
          b: "Indentation errors are found before running, so line 1 does not run either.",
          d: "Indentation is not printed; it is part of the code's structure.",
        },
      },
      {
        id: "ppq5-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-statements-expressions",
        prompt: "print(10 - 2 * 3)\n\nWhat is printed?",
        options: [
          { id: "a", text: "24" },
          { id: "b", text: "4" },
          { id: "c", text: "10 - 2 * 3" },
          { id: "d", text: "18" },
        ],
        correct: "b",
        explanation: "Multiplication first: 2 * 3 is 6, then 10 - 6 is 4.",
        whyWrong: {
          a: "That would be (10 - 2) * 3. Without brackets, * happens before -.",
          c: "The expression has no quotes, so Python calculates it.",
          d: "18 does not come from any order of these operations.",
        },
      },
      {
        id: "ppq5-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-comments",
        prompt: "What does Python do with a line that starts with # ?",
        options: [
          { id: "a", text: "Prints it" },
          { id: "b", text: "Ignores it: it is a comment for people" },
          { id: "c", text: "Raises an error" },
          { id: "d", text: "Runs it twice" },
        ],
        correct: "b",
        explanation: "Everything from # to the end of the line is a comment, which Python ignores.",
        whyWrong: {
          a: "Only print() prints. Comments are never shown.",
          c: "Comments are always allowed.",
          d: "Comments do not run at all.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l6-print-output": {
    lessonId: "pp-l6-print-output",
    passMark: 70,
    questions: [
      {
        id: "ppq6-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-print-values",
        prompt: "print(\"a\", \"b\", \"c\", sep=\"-\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "a b c" },
          { id: "b", text: "a-b-c" },
          { id: "c", text: "abc-" },
          { id: "d", text: "-a-b-c-" },
        ],
        correct: "b",
        explanation: "sep= replaces the space that normally goes BETWEEN the values.",
        whyWrong: {
          a: "That is the default, with sep=\" \". Here sep is \"-\".",
          c: "sep goes between values, not at the end.",
          d: "sep is not added before the first value or after the last.",
        },
      },
      {
        id: "ppq6-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-print-values",
        prompt: "print(\"Hi\", end=\"!\")\nprint(\"Bye\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "Hi\nBye" },
          { id: "b", text: "Hi!\nBye" },
          { id: "c", text: "Hi!Bye" },
          { id: "d", text: "Hi Bye!" },
        ],
        correct: "c",
        explanation: "end=\"!\" replaces the new line at the end of the first print, so the second print continues on the same line.",
        whyWrong: {
          a: "end= replaced the new line, so there is no line break after Hi.",
          b: "The ! replaces the new line; it does not come before one.",
          d: "end is added after the first print's values, not after Bye.",
        },
      },
      {
        id: "ppq6-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-escape-characters",
        prompt: "Which string prints as two lines?",
        options: [
          { id: "a", text: "\"Top/nBottom\"" },
          { id: "b", text: "\"Top\\nBottom\"" },
          { id: "c", text: "\"Top\\tBottom\"" },
          { id: "d", text: "\"Top n Bottom\"" },
        ],
        correct: "b",
        explanation: "\\n (backslash n) is the new-line escape sequence.",
        whyWrong: {
          a: "It must be a backslash, not a forward slash.",
          c: "\\t is a tab, which keeps it on one line.",
          d: "A plain n is just a letter.",
        },
      },
      {
        id: "ppq6-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-formatted-output",
        prompt: "print(f\"{10 / 4:.2f}\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "2.5" },
          { id: "b", text: "2.50" },
          { id: "c", text: "{10 / 4:.2f}" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation: "10 / 4 is 2.5, and :.2f shows exactly two decimal places: 2.50.",
        whyWrong: {
          a: "Without the format it would be 2.5, but :.2f forces two decimal places.",
          c: "The f before the quotes makes Python work out what is inside the braces.",
          d: "/ gives a decimal result, and .2f keeps two decimal places.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l7-input": {
    lessonId: "pp-l7-input",
    passMark: 70,
    questions: [
      {
        id: "ppq7-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-input-function",
        prompt: "What does input(\"Town: \") do?",
        options: [
          { id: "a", text: "Prints Town: and carries on immediately" },
          { id: "b", text: "Shows Town:, waits for the user to type and press Enter, and gives back what they typed" },
          { id: "c", text: "Looks up the user's town automatically" },
          { id: "d", text: "Saves the word Town to a file" },
        ],
        correct: "b",
        explanation: "input() displays its prompt, then waits until the user types something and presses Enter, and returns that text.",
        whyWrong: {
          a: "That describes print(). input() stops and waits.",
          c: "Programs only know what the user types.",
          d: "input() does not touch files.",
        },
      },
      {
        id: "ppq7-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-input-is-text",
        prompt: "x = input(\"Number: \")\nprint(x + x)\n\nThe user types 4. What is printed after the prompt line?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "44" },
          { id: "c", text: "x + x" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "input() returns text. + on two pieces of text joins them: \"4\" + \"4\" is \"44\".",
        whyWrong: {
          a: "That needs int(x) + int(x). x is text.",
          c: "x has no quotes, so its value is used.",
          d: "Joining two strings is allowed; it just is not addition.",
        },
      },
      {
        id: "ppq7-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-display-vs-collect",
        prompt: "Which statement is true?",
        options: [
          { id: "a", text: "print() collects data and input() displays it" },
          { id: "b", text: "print() displays data; input() shows a prompt and then collects data" },
          { id: "c", text: "Both only display data" },
          { id: "d", text: "input() can only be used once per program" },
        ],
        correct: "b",
        explanation: "print() sends information out to the screen. input() sends its prompt out, then waits and brings the user's answer in.",
        whyWrong: {
          a: "It is the other way round.",
          c: "input() collects what the user types.",
          d: "You can call input() as many times as you need.",
        },
      },
      {
        id: "ppq7-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-student-form",
        prompt: "age = input(\"Age: \")\nprint(2026 - age)\n\nThe user types 15. What happens?",
        options: [
          { id: "a", text: "2011 is printed" },
          { id: "b", text: "A TypeError, because age is text and cannot be subtracted from a number" },
          { id: "c", text: "202615 is printed" },
          { id: "d", text: "Python asks the question again" },
        ],
        correct: "b",
        explanation: "input() gives text. You cannot subtract text from a number. int(age) fixes it.",
        whyWrong: {
          a: "That needs 2026 - int(age).",
          c: "Joining only happens with + between two strings. This is a subtraction with a number and text.",
          d: "Python never repeats an input() by itself.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l8-errors-debugging": {
    lessonId: "pp-l8-errors-debugging",
    passMark: 70,
    questions: [
      {
        id: "ppq8-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-syntax-errors",
        prompt: "A file has a SyntaxError on line 9. How many of lines 1 to 8 run?",
        options: [
          { id: "a", text: "All eight" },
          { id: "b", text: "None: Python checks the grammar of the whole file before running any of it" },
          { id: "c", text: "Only line 8" },
          { id: "d", text: "It depends on the computer" },
        ],
        correct: "b",
        explanation: "Syntax is checked before execution. A file with a syntax error does not run at all.",
        whyWrong: {
          a: "That is true of errors found while running, such as NameError, but not of syntax errors.",
          c: "No line runs when the file's grammar is broken.",
          d: "This behaviour is the same everywhere.",
        },
      },
      {
        id: "ppq8-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-syntax-errors",
        prompt: "Python reports: SyntaxError: unterminated string literal. What is the usual cause?",
        options: [
          { id: "a", text: "A missing closing quote" },
          { id: "b", text: "A missing comment" },
          { id: "c", text: "Dividing by zero" },
          { id: "d", text: "A number that is too big" },
        ],
        correct: "a",
        explanation: "A string literal is text in quotes. \"Unterminated\" means it was never closed.",
        whyWrong: {
          b: "Comments are optional and never cause errors.",
          c: "Division by zero is a ZeroDivisionError at run time.",
          d: "Python handles very large whole numbers without trouble.",
        },
      },
      {
        id: "ppq8-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-runtime-errors",
        prompt: "total = 900\nprint(\"Start\")\nprint(totl)\n\nWhat is the output?",
        options: [
          { id: "a", text: "Start, then NameError: name 'totl' is not defined" },
          { id: "b", text: "Start\n900" },
          { id: "c", text: "Nothing at all" },
          { id: "d", text: "totl" },
        ],
        correct: "a",
        explanation: "Lines run in order. Line 2 prints Start. Line 3 uses a name that does not exist, so a NameError stops the program there.",
        whyWrong: {
          b: "totl is not total: a one-letter typo is a different name.",
          c: "A NameError happens while running, so earlier lines have already printed.",
          d: "Without quotes, totl is a name to look up, not text.",
        },
      },
      {
        id: "ppq8-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-debugging-calculator",
        prompt: "A calculator prints Sum: 52 when the user types 5 and 2. What is the most likely bug?",
        options: [
          { id: "a", text: "The inputs were not converted to numbers, so + joined the text" },
          { id: "b", text: "Python cannot add 5 and 2" },
          { id: "c", text: "The print() is spelled wrong" },
          { id: "d", text: "The user typed the numbers in the wrong order" },
        ],
        correct: "a",
        explanation: "\"5\" + \"2\" is \"52\". Wrapping each input() in int() or float() makes + add.",
        whyWrong: {
          b: "Python adds numbers perfectly; these were text.",
          c: "A misspelt print would raise a NameError, not print a wrong answer.",
          d: "5 + 2 and 2 + 5 are both 7; order is not the problem.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
