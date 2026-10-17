/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 3
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l8-meet-javascript": {
    lessonId: "js-l8-meet-javascript",
    passMark: 70,
    questions: [
      {
        id: "jsq8-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-what-is-js",
        prompt: "Which of these is true of JavaScript?",
        options: [
          { id: "a", text: "It is a simplified version of Java" },
          { id: "b", text: "It runs in every web browser, and on servers through Node.js" },
          { id: "c", text: "It only works inside Google Chrome" },
          { id: "d", text: "It can only change the colour of web pages" },
        ],
        correct: "b",
        explanation: "JavaScript is the language browsers understand, and Node.js runs the same language outside the browser, on servers and in tools.",
        whyWrong: {
          a: "Despite the name, JavaScript is unrelated to Java. The name was a 1995 marketing decision.",
          c: "Every modern browser runs JavaScript: Chrome, Firefox, Safari, Edge and the rest.",
          d: "It can do far more: validate forms, fetch data, run servers and build entire applications.",
        },
      },
      {
        id: "jsq8-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-first-program",
        prompt: "You have saved a file called app.js. How do you run it with Node.js in the terminal?",
        options: [
          { id: "a", text: "run app.js" },
          { id: "b", text: "node app.js" },
          { id: "c", text: "open app.js" },
          { id: "d", text: "javascript app" },
        ],
        correct: "b",
        explanation: "node followed by the file name runs that file with Node.js.",
        whyWrong: {
          a: "There is no run command. The program that runs JavaScript is called node.",
          c: "open would open the file in an application, not execute it.",
          d: "There is no javascript command, and the file name needs its .js ending.",
        },
      },
      {
        id: "jsq8-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-node-basics",
        prompt: "A beginner runs console.log(document.title); with Node.js and gets an error. Why?",
        options: [
          { id: "a", text: "console.log() does not work in Node.js" },
          { id: "b", text: "document is the web page, which only exists in a browser" },
          { id: "c", text: "Node.js is not installed properly" },
          { id: "d", text: "title must be in capital letters" },
        ],
        correct: "b",
        explanation: "document represents the page in a browser. Node.js runs JavaScript with no page, so document does not exist there. The language is the same; the environment is different.",
        whyWrong: {
          a: "console.log() works in both. It is how every Node.js program prints output.",
          c: "If Node.js were missing, the command would not run at all. This error comes from the code.",
          d: "The property is title in lower case. Capitalising it would be a different, non-existent name.",
        },
      },
      {
        id: "jsq8-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-node-basics",
        prompt: "console.log(\"Sum\");\nconsole.log(3 + 4);\n\nWhat is printed?",
        options: [
          { id: "a", text: "Sum\n7" },
          { id: "b", text: "Sum 7" },
          { id: "c", text: "Sum\n3 + 4" },
          { id: "d", text: "\"Sum\"\n7" },
        ],
        correct: "a",
        explanation: "Each console.log() prints one line. The second prints the value of the expression 3 + 4, which is 7.",
        whyWrong: {
          b: "Two separate calls produce two separate lines.",
          c: "3 + 4 is not in quotes, so it is calculated rather than printed as text.",
          d: "console.log() prints text without the surrounding quotes.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l9-statements-readable": {
    lessonId: "js-l9-statements-readable",
    passMark: 70,
    questions: [
      {
        id: "jsq9-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-expressions",
        prompt: "In the statement let area = width * height; which part is the expression?",
        options: [
          { id: "a", text: "let" },
          { id: "b", text: "area" },
          { id: "c", text: "width * height" },
          { id: "d", text: "The semicolon" },
        ],
        correct: "c",
        explanation: "An expression is code that produces a value. width * height produces the area; the statement stores that value under the name area.",
        whyWrong: {
          a: "let is a keyword that begins the declaration. On its own it produces no value.",
          b: "area is the name being created, the destination of the value rather than the expression producing it.",
          d: "The semicolon ends the statement. It is punctuation, not a value.",
        },
      },
      {
        id: "jsq9-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-syntax-rules",
        prompt: "let count = 3;\nconsole.log(Count);\n\nWhat happens?",
        options: [
          { id: "a", text: "It prints 3" },
          { id: "b", text: "It prints Count" },
          { id: "c", text: "ReferenceError: Count is not defined" },
          { id: "d", text: "It prints undefined" },
        ],
        correct: "c",
        explanation: "JavaScript is case-sensitive. count and Count are different names, and only count exists, so looking up Count fails.",
        whyWrong: {
          a: "That would need the names to match exactly. They differ in the first letter.",
          b: "Count is not in quotes, so JavaScript treats it as a name to look up, not text to print.",
          d: "undefined is what var gives before its line. A name that was never declared at all is an error.",
        },
      },
      {
        id: "jsq9-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-comments",
        prompt: "Which comment is most useful?",
        options: [
          { id: "a", text: "// set x to 5" },
          { id: "b", text: "// add the numbers" },
          { id: "c", text: "// 0.075 is the 7.5% VAT rate from the Finance Act 2019" },
          { id: "d", text: "// code" },
        ],
        correct: "c",
        explanation: "Good comments explain why or where a value comes from, which the code itself cannot say. The others only repeat what the code already shows.",
        whyWrong: {
          a: "The code already says x = 5. Repeating it adds noise.",
          b: "Any reader can see numbers are being added. The comment says nothing new.",
          d: "This tells the reader nothing at all.",
        },
      },
      {
        id: "jsq9-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-indentation",
        prompt: "What effect does indentation have on how a JavaScript program runs?",
        options: [
          { id: "a", text: "None; it is for people reading the code" },
          { id: "b", text: "Code that is not indented will not run" },
          { id: "c", text: "Indented code runs first" },
          { id: "d", text: "Indentation makes the program faster" },
        ],
        correct: "a",
        explanation: "JavaScript ignores leading whitespace. Indentation shows people the structure of the code, which is why it matters.",
        whyWrong: {
          b: "That is true in Python, not JavaScript. JavaScript uses braces to mark blocks.",
          c: "Statements run in order regardless of indentation.",
          d: "Whitespace has no effect on speed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l10-variables": {
    lessonId: "js-l10-variables",
    passMark: 70,
    questions: [
      {
        id: "jsq10-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-const",
        prompt: "const LIMIT = 10;\nLIMIT = 20;\n\nWhat happens on line 2?",
        options: [
          { id: "a", text: "LIMIT becomes 20" },
          { id: "b", text: "TypeError: Assignment to constant variable." },
          { id: "c", text: "LIMIT stays 10 and nothing is reported" },
          { id: "d", text: "A second variable called LIMIT is created" },
        ],
        correct: "b",
        explanation: "A const binding cannot be reassigned. JavaScript stops with a TypeError, which turns a silent mistake into a visible one.",
        whyWrong: {
          a: "That is what let would allow. const exists precisely to prevent it.",
          c: "JavaScript does not silently ignore the assignment. It throws.",
          d: "Assignment never creates a new variable. Only a declaration with const, let or var does.",
        },
      },
      {
        id: "jsq10-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-var",
        prompt: "console.log(level);\nvar level = 3;\n\nWhat is printed?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "undefined" },
          { id: "c", text: "ReferenceError: level is not defined" },
          { id: "d", text: "null" },
        ],
        correct: "b",
        explanation: "A var can be used before its line, where it holds undefined. This is var's silent behaviour, and it hides the mistake rather than reporting it.",
        whyWrong: {
          a: "The value 3 is stored on line 2, which has not run yet when line 1 runs.",
          c: "That is what happens with a name that was never declared. A var declared later in the file exists, as undefined.",
          d: "null is a different value that a programmer sets deliberately. Uninitialised var gives undefined.",
        },
      },
      {
        id: "jsq10-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-const-default",
        prompt: "Which value should be declared with let rather than const?",
        options: [
          { id: "a", text: "The number of days in a week" },
          { id: "b", text: "A counter that goes up each time a button is clicked" },
          { id: "c", text: "The website's name" },
          { id: "d", text: "The VAT rate" },
        ],
        correct: "b",
        explanation: "let is for values that are reassigned. A click counter changes every click; the others are fixed.",
        whyWrong: {
          a: "Seven days never changes. const.",
          c: "Set once and never reassigned while the program runs. const.",
          d: "Fixed for the whole run. const.",
        },
      },
      {
        id: "jsq10-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-naming",
        prompt: "Which is a valid identifier that also follows JavaScript naming conventions?",
        options: [
          { id: "a", text: "first name" },
          { id: "b", text: "1stName" },
          { id: "c", text: "firstName" },
          { id: "d", text: "let" },
        ],
        correct: "c",
        explanation: "firstName is valid and uses camelCase, the JavaScript convention for variables.",
        whyWrong: {
          a: "Identifiers cannot contain spaces.",
          b: "Identifiers cannot start with a digit.",
          d: "let is a reserved word and cannot be used as a name.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l11-output-input": {
    lessonId: "js-l11-output-input",
    passMark: 70,
    questions: [
      {
        id: "jsq11-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-console-log",
        prompt: "const city = \"Kano\";\nconsole.log(\"city\");\n\nWhat is printed?",
        options: [
          { id: "a", text: "Kano" },
          { id: "b", text: "city" },
          { id: "c", text: "\"Kano\"" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "\"city\" in quotes is text, so the four letters c-i-t-y are printed. Without quotes it would be the variable and print Kano.",
        whyWrong: {
          a: "That would need console.log(city) without quotes.",
          c: "console.log() never prints the quotes around text.",
          d: "Printing a piece of text is perfectly valid.",
        },
      },
      {
        id: "jsq11-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-joining-text",
        prompt: "console.log(\"Score: \" + 4 + 6);\n\nWhat is printed?",
        options: [
          { id: "a", text: "Score: 10" },
          { id: "b", text: "Score: 46" },
          { id: "c", text: "Score: 4 6" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "+ works left to right. \"Score: \" + 4 is the text \"Score: 4\", and adding 6 to text joins again, giving \"Score: 46\".",
        whyWrong: {
          a: "That needs brackets: \"Score: \" + (4 + 6).",
          c: "Concatenation adds no spaces of its own.",
          d: "Joining text and numbers is allowed; it just may not do what you expect.",
        },
      },
      {
        id: "jsq11-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-prompt",
        prompt: "A user types 25 into a prompt() box. What does prompt() give back?",
        options: [
          { id: "a", text: "The number 25" },
          { id: "b", text: "The text \"25\"" },
          { id: "c", text: "true" },
          { id: "d", text: "undefined" },
        ],
        correct: "b",
        explanation: "prompt() always returns text (or null if the user cancels). To do arithmetic with it, convert it with Number() first.",
        whyWrong: {
          a: "It looks like a number, but prompt() returns it as text. \"25\" + 1 would give \"251\".",
          c: "prompt() returns what was typed, not whether something was typed.",
          d: "It returns the text, or null on Cancel. It never returns undefined.",
        },
      },
      {
        id: "jsq11-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-node-input",
        prompt: "You run node greet.js Musa. Inside greet.js, which expression gives you \"Musa\"?",
        options: [
          { id: "a", text: "process.argv[0]" },
          { id: "b", text: "process.argv[1]" },
          { id: "c", text: "process.argv[2]" },
          { id: "d", text: "prompt()" },
        ],
        correct: "c",
        explanation: "Items 0 and 1 are the paths to Node.js and to your file. The first value you pass is item 2.",
        whyWrong: {
          a: "Item 0 is the path to the Node.js program itself.",
          b: "Item 1 is the path to greet.js.",
          d: "prompt() does not exist in Node.js.",
        },
      },
    ],
  },
};
