/**
 * ASSESSMENTS · PROGRAMMING FOUNDATIONS WITH PYTHON (m4-python-foundations)
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 *
 * Programming is easy to assess as syntax trivia — "which bracket makes a
 * list?" — which tests nothing a beginner needs. Every question here asks the
 * learner to READ code and say what happens, or to diagnose an error message,
 * because those are the two skills that make someone able to continue alone.
 *
 * Every value quoted was produced by running the code in CPython 3.14, and the
 * content validator re-runs every snippet on each build.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l62-what-programming-is": {
    lessonId: "l62-what-programming-is",
    passMark: 70,
    questions: [
      {
        id: "q62-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-what-it-is",
        prompt:
          "You have a one-off question about a 500-row export, due in twenty minutes. Excel or Python?",
        options: [
          { id: "a", text: "Python — it is the more powerful tool" },
          { id: "b", text: "Excel — for one question on a small file, answering it is faster than writing a script" },
          { id: "c", text: "Python, so it can be rerun later" },
          { id: "d", text: "Neither; use Power BI" },
        ],
        correct: "b",
        explanation:
          "Python is not a replacement for what you already know. It is what you reach for when the job is too big, too repetitive or too unusual for the other tools — and this job is none of those.",
        whyWrong: {
          a: "Power is not the criterion. Time to a correct answer is.",
          c: "Nobody asked for a rerun. Building for a requirement that does not exist is how twenty minutes becomes an evening.",
          d: "Power BI needs loading and modelling before it answers anything, which is slower still for one question.",
        },
      },
      {
        id: "q62-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-print",
        prompt:
          'Why does print("Hello") need the quotation marks?',
        options: [
          { id: "a", text: "For readability" },
          { id: "b", text: "They tell Python this is text, not the name of something — without them it looks for a thing called Hello and stops" },
          { id: "c", text: "print requires them" },
          { id: "d", text: "They are optional" },
        ],
        correct: "b",
        explanation:
          "Quotes are how Python distinguishes text from a name. Without them it treats Hello as a variable, finds none defined, and raises a NameError.",
        whyWrong: {
          a: "They change the meaning, not just the appearance.",
          c: "print does not require quotes — print(5) is fine. The quotes are about the value being text.",
          d: "Leaving them off a word produces an error rather than the same result.",
        },
      },
      {
        id: "q62-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-where-to-run",
        prompt:
          "You have never programmed and want to start today. What is the shortest path to running code?",
        options: [
          { id: "a", text: "Install Anaconda, then configure VS Code" },
          { id: "b", text: "Open Google Colab in a browser — no install, free, works on a phone" },
          { id: "c", text: "Install Python and learn the command line" },
          { id: "d", text: "Buy a new laptop" },
        ],
        correct: "b",
        explanation:
          "Colab needs only a Google account. Get through the module first and set up a local environment when you have a reason to — an evening lost to an install is an evening not spent learning to code.",
        whyWrong: {
          a: "A large download and a configuration step before your first line of code.",
          c: "Two new things to learn at once, when one of them is not needed yet.",
          d: "Nothing here requires new hardware.",
        },
      },
      {
        id: "q62-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-comments",
        prompt:
          "Which is the more useful comment?",
        options: [
          { id: "a", text: "# add one to total" },
          { id: "b", text: "# ORD-1003 excluded: duplicate confirmed with sales on 12 March" },
          { id: "c", text: "# loop" },
          { id: "d", text: "# code" },
        ],
        correct: "b",
        explanation:
          "The code already says what it does. A comment earns its place by recording WHY — a decision, a source, an exclusion someone will question later.",
        whyWrong: {
          a: "This restates the line beneath it and goes stale the moment that line changes.",
          c: "The word `for` already says it is a loop.",
          d: "This says nothing at all.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l63-variables-and-types": {
    lessonId: "l63-variables-and-types",
    passMark: 70,
    questions: [
      {
        id: "q63-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-reassign",
        prompt:
          "revenue = 276000, then revenue = revenue + 49000. What does revenue hold?",
        options: [
          { id: "a", text: "276000" },
          { id: "b", text: "325000" },
          { id: "c", text: "Nothing — the line is invalid" },
          { id: "d", text: "49000" },
        ],
        correct: "b",
        explanation:
          "Python works out the right-hand side first, using the current value, then stores the result under the same name. 276,000 + 49,000 = 325,000. The equals sign means 'store this', not 'is equal to'.",
        whyWrong: {
          a: "The second line replaced it.",
          c: "It is perfectly ordinary in code, even though it would be nonsense in algebra.",
          d: "That is the amount added, not the result.",
        },
      },
      {
        id: "q63-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-types",
        prompt:
          'What is the difference between 6 and "6"?',
        options: [
          { id: "a", text: "None" },
          { id: "b", text: "6 is an int you can do arithmetic with; \"6\" is a str, and adding a number to it raises a TypeError" },
          { id: "c", text: '"6" is faster' },
          { id: "d", text: "The quotes are a style choice" },
        ],
        correct: "b",
        explanation:
          "This is the numbers-stored-as-text problem from Month 2, in a language that refuses to guess. Excel quietly left the text out of a SUM; Python stops and tells you.",
        whyWrong: {
          a: "type() reports str for one and int for the other, and they behave differently.",
          c: "Speed is irrelevant; the types are genuinely different kinds of value.",
          d: "The quotes decide the type, which decides what you can do with it.",
        },
      },
      {
        id: "q63-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-variables",
        prompt:
          "Why is naming a variable `sum` a bad idea?",
        options: [
          { id: "a", text: "It is too short" },
          { id: "b", text: "It hides Python's built-in sum() function, and the error appears later somewhere else" },
          { id: "c", text: "Python forbids it" },
          { id: "d", text: "It must be capitalised" },
        ],
        correct: "b",
        explanation:
          "Python allows it, which is the problem. Your variable shadows the built-in, so a later call to sum(amounts) fails with a message about the type of your variable rather than about the name clash.",
        whyWrong: {
          a: "Short names like `n` are fine in a small scope. The clash is the issue.",
          c: "It is permitted. That is exactly why it catches people.",
          d: "Capitalising it would avoid the clash but breaks the naming convention.",
        },
      },
      {
        id: "q63-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-convert",
        prompt:
          'Why does int("N43,000") fail?',
        options: [
          { id: "a", text: "The string is too long" },
          { id: "b", text: "The naira sign and the comma are not digits — strip them before converting" },
          { id: "c", text: "int() only works on floats" },
          { id: "d", text: "You must use float() for money" },
        ],
        correct: "b",
        explanation:
          "int() converts text that contains only a number. Currency symbols and thousands separators have to be removed first, which is the Python version of the cleaning you did in Power Query.",
        whyWrong: {
          a: "Length is irrelevant; the non-digit characters are the problem.",
          c: 'int() converts strings routinely — int("43000") works.',
          d: "float() would fail on the same characters for the same reason.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l64-strings-and-numbers": {
    lessonId: "l64-strings-and-numbers",
    passMark: 70,
    questions: [
      {
        id: "q64-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-arithmetic",
        prompt:
          "What does 10 / 4 print in Python?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "2.5" },
          { id: "c", text: "2.0" },
          { id: "d", text: "3" },
        ],
        correct: "b",
        explanation:
          "A single slash always produces a float, so the answer is 2.5. Use // when you want the whole-number part, which gives 2. This is why an average of evenly divisible numbers still prints as 49000.0.",
        whyWrong: {
          a: "That is 10 // 4, which discards the remainder.",
          c: "2.0 would be the result of a division that came out even, such as 8 / 4.",
          d: "Python does not round the result of a division.",
        },
      },
      {
        id: "q64-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-string-methods",
        prompt:
          'The variable holds "  lagos  " with two spaces each side. What does len() return before and after .strip()?',
        options: [
          { id: "a", text: "5 and 5" },
          { id: "b", text: "9 and 5" },
          { id: "c", text: "5 and 9" },
          { id: "d", text: "7 and 5" },
        ],
        correct: "b",
        explanation:
          "Spaces are real characters: 2 + 5 + 2 = 9 before stripping, 5 after. This is the leading-space problem that silently cost ₦62,000 in the Month 2 project — and here len() makes it visible.",
        whyWrong: {
          a: "That would mean the spaces did not exist.",
          c: "Stripping removes characters; it cannot add them.",
          d: "Two spaces each side is four in total, not two.",
        },
      },
      {
        id: "q64-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-fstrings",
        prompt:
          'You write print("{state} made money") and it prints the braces literally. What is missing?',
        options: [
          { id: "a", text: "The f before the opening quote" },
          { id: "b", text: "More quotes" },
          { id: "c", text: "A comma" },
          { id: "d", text: "Nothing — that is correct" },
        ],
        correct: "a",
        explanation:
          "Without the f it is ordinary text and the braces mean nothing. This fails quietly — no error, just the wrong output — which makes it one of the commonest beginner slips.",
        whyWrong: {
          b: "The quoting is already correct.",
          c: "A comma would print the brace text and the variable separately, not substitute it.",
          d: "It printed {state} instead of Lagos, so it is not doing what was intended.",
        },
      },
      {
        id: "q64-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-booleans",
        prompt:
          "What is the difference between = and == ?",
        options: [
          { id: "a", text: "None" },
          { id: "b", text: "= stores a value; == asks whether two values are equal and produces True or False" },
          { id: "c", text: "== is for numbers only" },
          { id: "d", text: "= is older syntax" },
        ],
        correct: "b",
        explanation:
          "One equals sign assigns, two compare. Using = where you meant == is caught inside an if statement, but in a larger expression it can produce something that runs and is wrong.",
        whyWrong: {
          a: "They do entirely different things.",
          c: "== compares text, booleans and lists as happily as numbers.",
          d: "Both are current and both are needed; they are not versions of each other.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l65-collections": {
    lessonId: "l65-collections",
    passMark: 70,
    questions: [
      {
        id: "q65-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-lists",
        prompt:
          "amounts = [45000, 62000, 38000, 51000]. What is amounts[1]?",
        options: [
          { id: "a", text: "45000" },
          { id: "b", text: "62000" },
          { id: "c", text: "38000" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation:
          "Counting starts at zero, so [0] is 45000 and [1] is 62000. Zero-based counting is the single most common source of off-by-one mistakes in programming.",
        whyWrong: {
          a: "That is amounts[0], the first item.",
          c: "That is amounts[2].",
          d: "Position 1 exists in a four-item list. Position 4 would be the error.",
        },
      },
      {
        id: "q65-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-slicing",
        prompt:
          "For the same list, what does amounts[1:3] give?",
        options: [
          { id: "a", text: "[62000, 38000, 51000]" },
          { id: "b", text: "[62000, 38000]" },
          { id: "c", text: "[45000, 62000, 38000]" },
          { id: "d", text: "[38000]" },
        ],
        correct: "b",
        explanation:
          "A slice runs from the first position up to but NOT INCLUDING the second, so [1:3] gives positions 1 and 2 — two items. The count you get is always end minus start.",
        whyWrong: {
          a: "That would need [1:4]. Position 3 is excluded.",
          c: "That is [0:3], starting from the beginning.",
          d: "That is [2:3], a single item.",
        },
      },
      {
        id: "q65-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-get-and-sets",
        prompt:
          'revenue holds Lagos and Abuja only. What is the difference between revenue.get("Kano") and revenue.get("Kano", 0)?',
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "The first returns None — 'we have no figure' — while the second claims Kano sold nothing" },
          { id: "c", text: "The first raises an error" },
          { id: "d", text: "The second is faster" },
        ],
        correct: "b",
        explanation:
          "This is the blank-versus-zero decision from Month 2 in a third language. None means unknown; 0 is a measurement that will be averaged as one. They are different statements and usually only one is true.",
        whyWrong: {
          a: "One returns None and the other returns 0, which behave differently in every calculation downstream.",
          c: 'Square-bracket lookup raises KeyError. .get() is the safe form that does not.',
          d: "Speed is not the difference; what they claim about the data is.",
        },
      },
      {
        id: "q65-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-dicts",
        prompt:
          "You need one revenue figure per state, looked up by state name. Which collection?",
        options: [
          { id: "a", text: "A list" },
          { id: "b", text: "A dictionary" },
          { id: "c", text: "A set" },
          { id: "d", text: "A tuple" },
        ],
        correct: "b",
        explanation:
          "A dictionary maps a name to a value, which is exactly 'a figure per category'. A list would force you to remember that position 0 means Lagos.",
        whyWrong: {
          a: "Lists are looked up by position, so you would have to track which index is which state.",
          c: "A set holds distinct values with no associated figures.",
          d: "A tuple is an ordered, unchangeable sequence — still positional, not named.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l66-conditions-and-loops": {
    lessonId: "l66-conditions-and-loops",
    passMark: 70,
    questions: [
      {
        id: "q66-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-accumulate",
        prompt:
          "A loop adds four amounts to a running total, and print(total) sits OUTSIDE the loop. How many lines are printed?",
        options: [
          { id: "a", text: "Four" },
          { id: "b", text: "One" },
          { id: "c", text: "Five" },
          { id: "d", text: "None" },
        ],
        correct: "b",
        explanation:
          "Indentation decides what is inside the loop. Outside it, print runs once after the loop finishes, showing the final total. Indent it by four spaces and it would print four times, showing the total growing.",
        whyWrong: {
          a: "That is what happens if the print is indented INTO the loop.",
          c: "Nothing prints five times here.",
          d: "The print runs; it just runs once.",
        },
      },
      {
        id: "q66-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-if",
        prompt:
          'An elif chain checks "> 40000" BEFORE "> 100000". What happens to an amount of 200,000?',
        options: [
          { id: "a", text: "It is labelled Large, correctly" },
          { id: "b", text: "It is labelled Medium, because the first matching condition wins and nothing errors" },
          { id: "c", text: "It raises an error" },
          { id: "d", text: "It matches both labels" },
        ],
        correct: "b",
        explanation:
          "Conditions are checked in order and the first match wins — 200,000 is greater than 40,000, so it never reaches the 100,000 test. Put the narrowest condition first. Nothing errors, which is what makes this dangerous.",
        whyWrong: {
          a: "It never reaches the Large branch.",
          c: "Both conditions are valid Python. The logic is wrong, not the syntax.",
          d: "Only one branch of an if/elif chain ever runs.",
        },
      },
      {
        id: "q66-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-loop-filter",
        prompt:
          "A loop keeps amounts strictly greater than 50,000 from [45000, 62000, 38000, 51000, 98000]. How many are kept?",
        options: [
          { id: "a", text: "Two" },
          { id: "b", text: "Three" },
          { id: "c", text: "Four" },
          { id: "d", text: "Five" },
        ],
        correct: "b",
        explanation:
          "62,000, 51,000 and 98,000 — three. Note that 51,000 qualifies: 'strictly greater than 50,000' includes it. This is SUMIFS' filter step written out longhand.",
        whyWrong: {
          a: "That would miss 51,000, which is above the threshold.",
          c: "45,000 and 38,000 are both below it.",
          d: "Two of the five are below the threshold.",
        },
      },
      {
        id: "q66-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-for",
        prompt:
          "What determines when a for loop over a list stops?",
        options: [
          { id: "a", text: "You must write a stop condition" },
          { id: "b", text: "It stops when the list runs out — you never say when" },
          { id: "c", text: "After ten passes" },
          { id: "d", text: "When the value becomes zero" },
        ],
        correct: "b",
        explanation:
          "A for loop takes each item in turn and finishes when there are none left. Three items means three passes. That is the difference from a while loop, where you do have to manage the stopping condition.",
        whyWrong: {
          a: "That is a while loop. A for loop over a list manages this itself.",
          c: "There is no built-in limit.",
          d: "Values do not control a for loop's length; the number of items does.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l67-functions": {
    lessonId: "l67-functions",
    passMark: 70,
    questions: [
      {
        id: "q67-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-print-vs-return",
        prompt:
          'def show(name): print(name) — then result = show("Lagos"). What does result hold?',
        options: [
          { id: "a", text: '"Lagos"' },
          { id: "b", text: "None, because the function printed but returned nothing" },
          { id: "c", text: "An error" },
          { id: "d", text: "An empty string" },
        ],
        correct: "b",
        explanation:
          "The function showed you something and gave nothing back. A function with no return statement returns None. This is the single most common confusion for beginners, and it surfaces later as a TypeError about None.",
        whyWrong: {
          a: "Printing displays a value; it does not hand it back to the caller.",
          c: "The call succeeds. It is the value stored that surprises people.",
          d: 'None and "" are different — None means no value at all.',
        },
      },
      {
        id: "q67-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-def",
        prompt:
          "average([45000, 62000, 38000, 51000]) prints 49000.0 rather than 49000. Why the decimal point?",
        options: [
          { id: "a", text: "A rounding error" },
          { id: "b", text: "Division with / always produces a float, even when it divides evenly" },
          { id: "c", text: "sum() returns a float" },
          { id: "d", text: "The list contains a float" },
        ],
        correct: "b",
        explanation:
          "196,000 ÷ 4 is exactly 49,000, but a single slash always produces a float. It has surprised every Python beginner who ever lived, and it is why report figures get wrapped in round() or an f-string format.",
        whyWrong: {
          a: "The value is exact; only its type shows a decimal point.",
          c: "sum() of four ints returns an int. The division is what makes it a float.",
          d: "All four are ints.",
        },
      },
      {
        id: "q67-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-reusable",
        prompt:
          "Three percentages each rounded to one decimal place come to 44.7, 34.8 and 20.6 — a total of 100.1%. What should you do?",
        options: [
          { id: "a", text: "Nothing — rounding is expected" },
          { id: "b", text: "Say the figures are rounded, or adjust the largest so they total 100" },
          { id: "c", text: "Remove the decimal places" },
          { id: "d", text: "Recalculate — one of them must be wrong" },
        ],
        correct: "b",
        explanation:
          "Each figure is correct and their total is not, which is a real property of rounding. Decide before a client points at it: either footnote it, or adjust the largest component down so the column sums to 100.",
        whyWrong: {
          a: "Expected does not mean it needs no explanation. Somebody will add them up.",
          c: "Whole numbers would give 45 + 35 + 21 = 101, which is the same problem larger.",
          d: "All three are correctly calculated. The rounding is where the extra 0.1 comes from.",
        },
      },
      {
        id: "q67-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-defaults",
        prompt:
          "def is_large(amount, threshold=50000). What does the default give you?",
        options: [
          { id: "a", text: "Nothing useful" },
          { id: "b", text: "Callers may omit the threshold and get the usual rule, while a caller who needs a different one says so explicitly" },
          { id: "c", text: "It makes the function run faster" },
          { id: "d", text: "It forces every caller to pass two arguments" },
        ],
        correct: "b",
        explanation:
          "The usual rule is documented in one place, and any departure from it is visible in the call. Compare is_large(45000) with is_large(45000, 40000) — the reader can see exactly what changed.",
        whyWrong: {
          a: "It removes repetition and records the standard threshold once.",
          c: "Defaults have no bearing on speed.",
          d: "The opposite: it makes the second argument optional.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l68-errors-and-debugging": {
    lessonId: "l68-errors-and-debugging",
    passMark: 70,
    questions: [
      {
        id: "q68-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-read-error",
        prompt:
          'TypeError: can only concatenate str (not "int") to str. What is wrong and how do you fix it?',
        options: [
          { id: "a", text: "Python is broken; restart it" },
          { id: "b", text: "A value is text where a number was needed — convert it with int() before the arithmetic" },
          { id: "c", text: "The variable name is wrong" },
          { id: "d", text: "You need more brackets" },
        ],
        correct: "b",
        explanation:
          "The message says you tried to add an int to a str. It is the numbers-stored-as-text problem from Month 2 — and note that Python refuses to guess, where Excel quietly left the value out of a SUM and gave you a smaller total.",
        whyWrong: {
          a: "The error is specific and correct. Restarting changes nothing.",
          c: "A wrong name raises NameError, which says so.",
          d: "Brackets are not the issue; the type of the value is.",
        },
      },
      {
        id: "q68-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-predict-error",
        prompt:
          "amounts = [45000, 62000], then amounts[5]. What does Python raise?",
        options: [
          { id: "a", text: "KeyError: 5" },
          { id: "b", text: "IndexError: list index out of range" },
          { id: "c", text: "It returns None" },
          { id: "d", text: "TypeError" },
        ],
        correct: "b",
        explanation:
          "Valid positions in a two-item list are 0 and 1. There is no 5, and there is not even a 2. Off-by-one mistakes are the commonest bug in programming and this is their signature.",
        whyWrong: {
          a: "KeyError is for dictionaries, not lists.",
          c: "Lists raise rather than returning None. .get() on a dictionary is the thing that returns None.",
          d: "The type is fine — an integer position is correct, it is just out of range.",
        },
      },
      {
        id: "q68-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-py-common-errors",
        prompt:
          "KeyError: 'Kano'. Which earlier lesson is this the same problem as?",
        options: [
          { id: "a", text: "The dual-axis chart" },
          { id: "b", text: "The (Blank) row — a key that does not exist in the dimension — except Python stops rather than grouping it silently" },
          { id: "c", text: "The fill handle" },
          { id: "d", text: "Query folding" },
        ],
        correct: "b",
        explanation:
          "In the modelling module an unmatched key produced a (Blank) row and a breakdown that would not reconcile. Here the same missing key stops the program and names itself — which is louder, and easier to fix.",
        whyWrong: {
          a: "That is about misleading scales, not missing keys.",
          c: "The fill handle is about copying formulas.",
          d: "Folding is about where a query is executed.",
        },
      },
      {
        id: "q68-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-py-debug-with-print",
        prompt:
          "Your loop fails partway through and you cannot see why. What is the fastest diagnostic?",
        options: [
          { id: "a", text: "Rewrite the whole block" },
          { id: "b", text: "print() the value and its type() just before the failing line, then change one thing at a time" },
          { id: "c", text: "Add more comments" },
          { id: "d", text: "Run it again unchanged" },
        ],
        correct: "b",
        explanation:
          "Printing the value with its type makes an invisible problem visible — it is how you find the one entry that is a str among ints. Then change ONE thing, because fixing three at once teaches you nothing about which mattered.",
        whyWrong: {
          a: "The error named a line; start there. Rewriting discards the parts that were correct.",
          c: "Comments are for humans and change nothing about the behaviour.",
          d: "The same code on the same data fails the same way.",
        },
      },
    ],
  },
};
