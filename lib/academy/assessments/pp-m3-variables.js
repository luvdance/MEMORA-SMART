/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 3
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l9-variables": {
    lessonId: "pp-l9-variables",
    passMark: 70,
    questions: [
      {
        id: "ppq9-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-what-variables",
        prompt: "What does count = 10 do in Python?",
        options: [
          { id: "a", text: "Checks whether count equals 10" },
          { id: "b", text: "Stores the value 10 and attaches the name count to it" },
          { id: "c", text: "Prints 10" },
          { id: "d", text: "Creates ten variables" },
        ],
        correct: "b",
        explanation: "= is assignment: work out the value on the right, then make the name on the left refer to it.",
        whyWrong: {
          a: "Checking equality uses == (Module 4). A single = assigns.",
          c: "Assignment prints nothing. Only print() shows output.",
          d: "One name, one value.",
        },
      },
      {
        id: "ppq9-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-naming",
        prompt: "Which is a valid Python variable name?",
        options: [
          { id: "a", text: "student-name" },
          { id: "b", text: "for" },
          { id: "c", text: "3rd_place" },
          { id: "d", text: "student_name" },
        ],
        correct: "d",
        explanation: "Letters and underscores, not starting with a digit, and not a keyword. snake_case is the convention.",
        whyWrong: {
          a: "A hyphen is read as a minus sign: student minus name.",
          b: "for is a reserved keyword.",
          c: "Names cannot start with a digit.",
        },
      },
      {
        id: "ppq9-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-reassignment",
        prompt: "x = 4\nx = x * 3\nx = x - 2\nprint(x)\n\nWhat is printed?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "12" },
          { id: "c", text: "10" },
          { id: "d", text: "2" },
        ],
        correct: "c",
        explanation: "x becomes 4, then 4 * 3 = 12, then 12 - 2 = 10.",
        whyWrong: {
          a: "x was reassigned twice after line 1.",
          b: "That is x after line 2, but line 3 changes it again.",
          d: "Each line uses x's current value, not the original.",
        },
      },
      {
        id: "ppq9-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-reassignment",
        prompt: "a = 5\nb = a\na = 9\nprint(b)\n\nWhat is printed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "9" },
          { id: "c", text: "a" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "b = a attaches b to the value 5. Moving a to 9 afterwards does not move b.",
        whyWrong: {
          b: "Reassigning a changes what a refers to, not b.",
          c: "a has no quotes, so b = a uses a's value, not the letter.",
          d: "All of these lines are valid.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l10-data-types": {
    lessonId: "pp-l10-data-types",
    passMark: 70,
    questions: [
      {
        id: "ppq10-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-four-types",
        prompt: "What is the type of the value 3.0?",
        options: [
          { id: "a", text: "int" },
          { id: "b", text: "float" },
          { id: "c", text: "str" },
          { id: "d", text: "bool" },
        ],
        correct: "b",
        explanation: "A decimal point makes it a float, even when the fraction is zero.",
        whyWrong: {
          a: "3 would be an int; 3.0 has a decimal point.",
          c: "It has no quotes.",
          d: "bool values are only True and False.",
        },
      },
      {
        id: "ppq10-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-type-function",
        prompt: "print(type(\"False\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "<class 'bool'>" },
          { id: "b", text: "<class 'str'>" },
          { id: "c", text: "False" },
          { id: "d", text: "<class 'NoneType'>" },
        ],
        correct: "b",
        explanation: "The quotes make it text. Only False with no quotes is a Boolean.",
        whyWrong: {
          a: "That would be type(False), without quotes.",
          c: "type() describes the type; it does not print the value.",
          d: "Only None has NoneType.",
        },
      },
      {
        id: "ppq10-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-choosing-types",
        prompt: "Which type is best for storing a phone number such as 08031234567?",
        options: [
          { id: "a", text: "int, because it is made of digits" },
          { id: "b", text: "float" },
          { id: "c", text: "str, because it is never calculated with and its leading 0 matters" },
          { id: "d", text: "bool" },
        ],
        correct: "c",
        explanation: "Phone numbers are identifiers, not quantities. An int would drop the leading 0 and allows nonsense like adding two numbers.",
        whyWrong: {
          a: "Digits alone do not make something a number. You never add phone numbers.",
          b: "A phone number has no fractional part and is not a measurement.",
          d: "A bool can only be True or False.",
        },
      },
      {
        id: "ppq10-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-four-types",
        prompt: "Which of these is a bool value?",
        options: [
          { id: "a", text: "\"True\"" },
          { id: "b", text: "true" },
          { id: "c", text: "True" },
          { id: "d", text: "1.0" },
        ],
        correct: "c",
        explanation: "True with a capital T and no quotes is one of the two Boolean values.",
        whyWrong: {
          a: "With quotes it is text.",
          b: "Python is case-sensitive: true is just an undefined name.",
          d: "1.0 is a float.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l11-conversion": {
    lessonId: "pp-l11-conversion",
    passMark: 70,
    questions: [
      {
        id: "ppq11-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-conversion",
        prompt: "print(int(7.8))\n\nWhat is printed?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "7" },
          { id: "c", text: "7.8" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "int() of a float cuts off the decimal part. It does not round.",
        whyWrong: {
          a: "That would be rounding, which is round(), not int().",
          c: "int() always gives a whole number.",
          d: "Converting a float to an int is allowed.",
        },
      },
      {
        id: "ppq11-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-conversion",
        prompt: "What does int(\"3.5\") do?",
        options: [
          { id: "a", text: "Gives 3" },
          { id: "b", text: "Gives 4" },
          { id: "c", text: "Raises ValueError, because \"3.5\" is not a whole-number string" },
          { id: "d", text: "Gives 3.5" },
        ],
        correct: "c",
        explanation: "int() of text needs text that looks like a whole number. Use float(\"3.5\") instead.",
        whyWrong: {
          a: "int(3.5) (a float) gives 3, but int(\"3.5\") (text) fails.",
          b: "int() never rounds.",
          d: "int() never returns a decimal.",
        },
      },
      {
        id: "ppq11-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-dynamic-typing",
        prompt: "What does dynamic typing mean in Python?",
        options: [
          { id: "a", text: "Variables change their own values randomly" },
          { id: "b", text: "Values have types, and a name can refer to values of different types over time" },
          { id: "c", text: "Every variable must be declared with a type" },
          { id: "d", text: "Python converts types automatically everywhere" },
        ],
        correct: "b",
        explanation: "The type belongs to the value. The same name can hold a str, then an int, then a float.",
        whyWrong: {
          a: "Values only change when your code reassigns them.",
          c: "That is static typing, used by languages like Java. Python does not require it.",
          d: "Python mostly refuses to mix types: \"5\" + 5 is an error, not an automatic conversion.",
        },
      },
      {
        id: "ppq11-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-currency-conversion",
        prompt: "With rate = 1500.0 naira per dollar, which line converts naira (a float) to dollars?",
        options: [
          { id: "a", text: "dollars = naira * rate" },
          { id: "b", text: "dollars = naira / rate" },
          { id: "c", text: "dollars = rate / naira" },
          { id: "d", text: "dollars = naira + rate" },
        ],
        correct: "b",
        explanation: "Each dollar costs 1500 naira, so the number of dollars is naira divided by 1500.",
        whyWrong: {
          a: "That converts dollars to naira.",
          c: "That gives dollars per naira of the amount, which is meaningless here.",
          d: "Currency conversion multiplies or divides; it never adds the rate.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l12-none-constants-errors": {
    lessonId: "pp-l12-none-constants-errors",
    passMark: 70,
    questions: [
      {
        id: "ppq12-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-none",
        prompt: "A student's examination score has not been entered yet. Which value represents that best?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "None" },
          { id: "c", text: "False" },
          { id: "d", text: "\"0\"" },
        ],
        correct: "b",
        explanation: "None means the value is missing or unknown. 0 would claim the student scored zero.",
        whyWrong: {
          a: "0 is a real score: it says the student scored nothing.",
          c: "False answers a yes/no question; a score is not one.",
          d: "That is the text \"0\", which is still a claimed score.",
        },
      },
      {
        id: "ppq12-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-constants",
        prompt: "How does Python show that a variable is meant to be a constant?",
        options: [
          { id: "a", text: "With the const keyword" },
          { id: "b", text: "By naming it in UPPER_CASE, by convention" },
          { id: "c", text: "Python locks it automatically" },
          { id: "d", text: "By putting it in quotes" },
        ],
        correct: "b",
        explanation: "Python has no constant keyword. UPPER_CASE names tell other programmers the value should not change.",
        whyWrong: {
          a: "Python has no const keyword.",
          c: "Nothing stops reassignment; it is a convention.",
          d: "Quotes make text, not constants.",
        },
      },
      {
        id: "ppq12-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-type-errors",
        prompt: "print(\"Score: \" + 80)\n\nWhich error is raised?",
        options: [
          { id: "a", text: "ValueError" },
          { id: "b", text: "NameError" },
          { id: "c", text: "TypeError: can only concatenate str (not \"int\") to str" },
          { id: "d", text: "SyntaxError" },
        ],
        correct: "c",
        explanation: "+ cannot join text and a number. Use str(80), or print(\"Score:\", 80).",
        whyWrong: {
          a: "ValueError is for the right type with an unusable value, like int(\"abc\").",
          b: "Every name here exists.",
          d: "The grammar is valid; the problem appears only when it runs.",
        },
      },
      {
        id: "ppq12-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-type-errors",
        prompt: "n = int(input(\"Number: \"))\n\nThe user types ten. What happens?",
        options: [
          { id: "a", text: "n becomes 10" },
          { id: "b", text: "ValueError: invalid literal for int() with base 10: 'ten'" },
          { id: "c", text: "TypeError" },
          { id: "d", text: "n becomes None" },
        ],
        correct: "b",
        explanation: "int() needs digits. The text 'ten' is a str, the right type, with a value int() cannot use.",
        whyWrong: {
          a: "Python does not understand number words.",
          c: "The type (str) is acceptable to int(); it is the value that fails.",
          d: "A failed conversion raises an error; it does not give None.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
