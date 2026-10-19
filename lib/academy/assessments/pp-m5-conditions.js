/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 5
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l19-if-elif-else": {
    lessonId: "pp-l19-if-elif-else",
    passMark: 70,
    questions: [
      {
        id: "ppq19-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-if",
        prompt: "x = 3\nif x > 5:\n    print(\"big\")\nprint(\"done\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "big\ndone" },
          { id: "b", text: "done" },
          { id: "c", text: "big" },
          { id: "d", text: "Nothing" },
        ],
        correct: "b",
        explanation: "3 > 5 is False, so the indented block is skipped. The last line is not indented, so it always runs.",
        whyWrong: {
          a: "The condition is False, so big is not printed.",
          c: "done is outside the if and always runs.",
          d: "done runs regardless of the condition.",
        },
      },
      {
        id: "ppq19-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-if",
        prompt: "How does Python know which lines belong inside an if?",
        options: [
          { id: "a", text: "They are inside curly braces { }" },
          { id: "b", text: "They are indented under the line ending in a colon" },
          { id: "c", text: "They end with a semicolon" },
          { id: "d", text: "They are written in capitals" },
        ],
        correct: "b",
        explanation: "In Python, indentation defines blocks. Every line indented under the if: belongs to it.",
        whyWrong: {
          a: "Braces are used by JavaScript and C; Python uses indentation.",
          c: "Semicolons are not used for this in Python.",
          d: "Capitals have nothing to do with blocks.",
        },
      },
      {
        id: "ppq19-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-elif",
        prompt: "score = 75\nif score >= 50:\n    print(\"C\")\nelif score >= 70:\n    print(\"A\")\n\nWhat is printed, and what is wrong?",
        options: [
          { id: "a", text: "A; nothing is wrong" },
          { id: "b", text: "C; the conditions are in the wrong order, so the elif can never be reached by a score of 70+" },
          { id: "c", text: "C and A" },
          { id: "d", text: "Nothing; elif needs an else" },
        ],
        correct: "b",
        explanation: "Python runs only the first True branch. Every score of 70 or more is also >= 50, so it stops at C. Put the strictest condition first.",
        whyWrong: {
          a: "The first True condition wins, which is score >= 50.",
          c: "Only one branch of an if/elif chain runs.",
          d: "else is optional.",
        },
      },
      {
        id: "ppq19-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-if-else",
        prompt: "In an if/else, how many of the two blocks run?",
        options: [
          { id: "a", text: "Always exactly one" },
          { id: "b", text: "Both, one after the other" },
          { id: "c", text: "Sometimes neither" },
          { id: "d", text: "It depends on the indentation" },
        ],
        correct: "a",
        explanation: "If the condition is True the if block runs; otherwise the else block runs. Exactly one.",
        whyWrong: {
          b: "They are alternatives, never both.",
          c: "else catches every case the if did not, so one always runs.",
          d: "The indentation defines the blocks, but the rule of exactly one is fixed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l20-nested-combined": {
    lessonId: "pp-l20-nested-combined",
    passMark: 70,
    questions: [
      {
        id: "ppq20-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-nested",
        prompt: "a = 10\nif a > 5:\n    if a > 20:\n        print(\"X\")\n    else:\n        print(\"Y\")\nelse:\n    print(\"Z\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "X" },
          { id: "b", text: "Y" },
          { id: "c", text: "Z" },
          { id: "d", text: "Y and Z" },
        ],
        correct: "b",
        explanation: "10 > 5 is True, so the inner check runs. 10 > 20 is False, so the inner else prints Y.",
        whyWrong: {
          a: "10 is not greater than 20.",
          c: "Z is the outer else, which only runs if a <= 5.",
          d: "Only one path through the nested decisions is taken.",
        },
      },
      {
        id: "ppq20-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-combined",
        prompt: "Using the rule (y % 4 == 0 and y % 100 != 0) or y % 400 == 0, is 2100 a leap year?",
        options: [
          { id: "a", text: "Yes, because it is divisible by 4" },
          { id: "b", text: "No, because it is divisible by 100 but not by 400" },
          { id: "c", text: "Yes, because it is divisible by 100" },
          { id: "d", text: "It cannot be decided" },
        ],
        correct: "b",
        explanation: "2100 % 100 == 0 makes the first group False, and 2100 % 400 is 100, so the second part is False too.",
        whyWrong: {
          a: "Divisible by 4 is not enough when it is also divisible by 100.",
          c: "Divisibility by 100 is what EXCLUDES it, unless it is also divisible by 400.",
          d: "The rule decides every year.",
        },
      },
      {
        id: "ppq20-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-string-conditions",
        prompt: "name = \"Lagos \"\nprint(name == \"Lagos\", name.strip() == \"Lagos\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "True True" },
          { id: "b", text: "False True" },
          { id: "c", text: "False False" },
          { id: "d", text: "True False" },
        ],
        correct: "b",
        explanation: "The trailing space makes the first comparison False. strip() removes it, so the second is True.",
        whyWrong: {
          a: "String comparison is exact, spaces included.",
          c: "After strip() the strings match.",
          d: "It is the other way round.",
        },
      },
      {
        id: "ppq20-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-string-conditions",
        prompt: "print(\"25\" > \"100\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "False, because 25 is smaller than 100" },
          { id: "b", text: "True, because text is compared character by character and \"2\" comes after \"1\"" },
          { id: "c", text: "An error" },
          { id: "d", text: "25" },
        ],
        correct: "b",
        explanation: "Strings are compared alphabetically, one character at a time. Convert to int to compare as numbers.",
        whyWrong: {
          a: "That is true for the numbers 25 and 100, not for the strings.",
          c: "Comparing two strings is allowed.",
          d: "A comparison produces a bool.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l21-validation-boundaries": {
    lessonId: "pp-l21-validation-boundaries",
    passMark: 70,
    questions: [
      {
        id: "ppq21-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-validation",
        prompt: "Which condition is True exactly when age is NOT a valid age between 0 and 120 inclusive?",
        options: [
          { id: "a", text: "age < 0 and age > 120" },
          { id: "b", text: "age < 0 or age > 120" },
          { id: "c", text: "0 <= age <= 120" },
          { id: "d", text: "age != 120" },
        ],
        correct: "b",
        explanation: "An age is invalid if it is below 0 OR above 120. It cannot be both at once.",
        whyWrong: {
          a: "No number is both below 0 and above 120, so this is never True.",
          c: "That is True for VALID ages.",
          d: "That says nothing about the range.",
        },
      },
      {
        id: "ppq21-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-boundaries",
        prompt: "The rule is \"free delivery on orders of 10000 or more\". The code says if total > 10000:. Which order is treated wrongly?",
        options: [
          { id: "a", text: "9999" },
          { id: "b", text: "10000" },
          { id: "c", text: "10001" },
          { id: "d", text: "None of them" },
        ],
        correct: "b",
        explanation: "\"Or more\" means >=. With >, an order of exactly 10000 misses free delivery: an off-by-one mistake.",
        whyWrong: {
          a: "9999 correctly pays for delivery under both versions.",
          c: "10001 correctly gets free delivery under both versions.",
          d: "The boundary value itself is handled wrongly.",
        },
      },
      {
        id: "ppq21-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-boundaries",
        prompt: "To test a rule with a boundary at 18, which ages should you test at minimum?",
        options: [
          { id: "a", text: "18 only" },
          { id: "b", text: "17, 18 and 19" },
          { id: "c", text: "1 and 100" },
          { id: "d", text: "Any one age" },
        ],
        correct: "b",
        explanation: "Test the boundary and the values either side of it; that catches > versus >= mistakes in both directions.",
        whyWrong: {
          a: "One value cannot show which side the boundary falls on.",
          c: "Values far from the boundary rarely reveal mistakes.",
          d: "One test proves almost nothing about a decision.",
        },
      },
      {
        id: "ppq21-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-electricity-billing",
        prompt: "Tariff: first 100 units at 50, units above 100 at 75. What is the bill for 140 units?",
        options: [
          { id: "a", text: "10500" },
          { id: "b", text: "8000" },
          { id: "c", text: "7000" },
          { id: "d", text: "7500" },
        ],
        correct: "b",
        explanation: "100 × 50 = 5000, plus 40 × 75 = 3000, gives 8000.",
        whyWrong: {
          a: "That charges all 140 units at 75.",
          c: "That charges all 140 units at 50.",
          d: "That charges only the first 100 units at 75 and ignores the rest.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l22-match-flowcharts": {
    lessonId: "pp-l22-match-flowcharts",
    passMark: 70,
    questions: [
      {
        id: "ppq22-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-match-case",
        prompt: "In a match statement, what does case _: do?",
        options: [
          { id: "a", text: "Matches only an underscore" },
          { id: "b", text: "Matches anything not matched by an earlier case, like else" },
          { id: "c", text: "Ends the program" },
          { id: "d", text: "Matches an empty string only" },
        ],
        correct: "b",
        explanation: "_ is the wildcard pattern. Placed last, it catches every value the other cases did not.",
        whyWrong: {
          a: "_ is a wildcard, not a literal underscore.",
          c: "It is just another case.",
          d: "It matches any value at all.",
        },
      },
      {
        id: "ppq22-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-match-case",
        prompt: "choice = input(\"Pick: \")  # the user types 2\nmatch choice:\n    case 2:\n        print(\"two\")\n    case _:\n        print(\"other\")\n\nWhat is printed after the prompt?",
        options: [
          { id: "a", text: "two" },
          { id: "b", text: "other, because input() returns the text \"2\", not the number 2" },
          { id: "c", text: "An error" },
          { id: "d", text: "Nothing" },
        ],
        correct: "b",
        explanation: "The text \"2\" is not equal to the int 2. Use case \"2\": or convert with int().",
        whyWrong: {
          a: "The types differ, so case 2 does not match.",
          c: "Comparing different types in match is allowed; it simply does not match.",
          d: "case _ always matches what is left.",
        },
      },
      {
        id: "ppq22-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-match-case",
        prompt: "For grading scores into A, B, C by ranges (70+, 60+, 50+), which is the better tool?",
        options: [
          { id: "a", text: "match-case with one case per possible score" },
          { id: "b", text: "if / elif / else with >= comparisons" },
          { id: "c", text: "A single if" },
          { id: "d", text: "Either is equally good" },
        ],
        correct: "b",
        explanation: "Ranges are comparisons, which if/elif expresses directly. match suits exact values such as menu options.",
        whyWrong: {
          a: "You would need dozens of cases, one per score.",
          c: "One if can only choose between two outcomes.",
          d: "For ranges, if/elif is clearly simpler.",
        },
      },
      {
        id: "ppq22-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-flowchart-to-code",
        prompt: "When translating a flowchart, a diamond with YES and NO arrows becomes...",
        options: [
          { id: "a", text: "print()" },
          { id: "b", text: "An assignment such as rate = 5" },
          { id: "c", text: "An if statement, with the NO path as else or the next elif" },
          { id: "d", text: "input()" },
        ],
        correct: "c",
        explanation: "A decision is an if. Its YES branch is the indented block; its NO branch continues as elif, else or the next line.",
        whyWrong: {
          a: "Output parallelograms become print().",
          b: "Process rectangles become assignments.",
          d: "Input parallelograms become input().",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
