/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 6
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l19-why-functions": {
    lessonId: "js-l19-why-functions",
    passMark: 70,
    questions: [
      {
        id: "jsq19-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-why-functions",
        prompt: "Which is the strongest reason to put repeated logic into a function?",
        options: [
          { id: "a", text: "Functions make programs run faster" },
          { id: "b", text: "A bug in the logic then only has to be fixed in one place" },
          { id: "c", text: "JavaScript requires all code to be in functions" },
          { id: "d", text: "Functions use less memory" },
        ],
        correct: "b",
        explanation: "One definition, many calls. Fix or improve the function once and every caller benefits. That is the Don't Repeat Yourself principle.",
        whyWrong: {
          a: "Speed is not the point. Functions are about clarity, reuse and correctness.",
          c: "Plenty of JavaScript runs at the top level, outside any function.",
          d: "Memory is not the reason. The benefit is having one source of truth for the logic.",
        },
      },
      {
        id: "jsq19-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-function-declaration",
        prompt: "function hello() { console.log(\"Hi\"); }\n\nThis is the whole program. What is printed?",
        options: [
          { id: "a", text: "Hi" },
          { id: "b", text: "Nothing" },
          { id: "c", text: "[Function: hello]" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "Declaring a function only defines it. Nothing runs until it is called with hello().",
        whyWrong: {
          a: "That needs a call, hello(), somewhere in the program.",
          c: "That is what console.log(hello) would print. Nothing here prints at all.",
          d: "Declaring a function without calling it is perfectly valid.",
        },
      },
      {
        id: "jsq19-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-parameters-arguments",
        prompt: "In function area(width, height) { … } called as area(4, 5), which are the arguments?",
        options: [
          { id: "a", text: "width and height" },
          { id: "b", text: "4 and 5" },
          { id: "c", text: "area" },
          { id: "d", text: "The function body" },
        ],
        correct: "b",
        explanation: "Arguments are the actual values passed in a call. Parameters are the names in the definition that receive them.",
        whyWrong: {
          a: "Those are the parameters, the placeholders in the definition.",
          c: "area is the function's name.",
          d: "The body is the code that runs; it is neither parameters nor arguments.",
        },
      },
      {
        id: "jsq19-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-argument-order",
        prompt: "function f(a, b) { return a - b; }\nconsole.log(f(3));\n\nWhat is printed?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "NaN" },
          { id: "c", text: "An error about a missing argument" },
          { id: "d", text: "-3" },
        ],
        correct: "b",
        explanation: "b receives no argument, so it is undefined. 3 - undefined is NaN. JavaScript does not complain about the missing argument.",
        whyWrong: {
          a: "That would need b to be 0. A missing argument is undefined, not 0.",
          c: "JavaScript never checks the number of arguments. Missing ones are undefined.",
          d: "a is 3, not b. There is no value to subtract 3 from.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l20-return-scope": {
    lessonId: "js-l20-return-scope",
    passMark: 70,
    questions: [
      {
        id: "jsq20-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-return-vs-log",
        prompt: "function total(a, b) { console.log(a + b); }\nconst t = total(4, 6);\nconsole.log(t);\n\nWhat is printed?",
        options: [
          { id: "a", text: "10 then 10" },
          { id: "b", text: "10 then undefined" },
          { id: "c", text: "undefined then 10" },
          { id: "d", text: "10" },
        ],
        correct: "b",
        explanation: "total prints 10 while it runs, but returns nothing, so t is undefined. Printing a value is not the same as returning it.",
        whyWrong: {
          a: "That would need return a + b. The function only logs.",
          c: "The log inside the function happens first, during the call on line 2.",
          d: "There are two console.log calls; the second prints t, which is undefined.",
        },
      },
      {
        id: "jsq20-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-early-return",
        prompt: "function check(n) {\n  if (n < 0) return \"negative\";\n  return \"ok\";\n  console.log(\"done\");\n}\nconsole.log(check(-2));\n\nWhat is printed?",
        options: [
          { id: "a", text: "negative" },
          { id: "b", text: "negative, then done" },
          { id: "c", text: "ok" },
          { id: "d", text: "done" },
        ],
        correct: "a",
        explanation: "return ends the function immediately. The first return runs for -2, and the line that logs done can never run in any call.",
        whyWrong: {
          b: "Nothing after a return runs.",
          c: "-2 < 0, so the first return runs before reaching the second.",
          d: "That line comes after both returns and is unreachable.",
        },
      },
      {
        id: "jsq20-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-function-scope",
        prompt: "function f() { const secret = 42; }\nf();\nconsole.log(secret);\n\nWhat happens?",
        options: [
          { id: "a", text: "It prints 42" },
          { id: "b", text: "It prints undefined" },
          { id: "c", text: "ReferenceError: secret is not defined" },
          { id: "d", text: "It prints null" },
        ],
        correct: "c",
        explanation: "secret is local to f. It does not exist outside the function, so looking it up there fails.",
        whyWrong: {
          a: "Local variables cannot be seen from outside their function.",
          b: "The name is not declared at all in the outer scope, which is an error, not undefined.",
          d: "Nothing sets it to null; it simply does not exist out there.",
        },
      },
      {
        id: "jsq20-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-scope-shadowing",
        prompt: "let total = 5;\nfunction add() { total = total + 1; }\nadd();\nadd();\nconsole.log(total);\n\nWhat is printed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "6" },
          { id: "c", text: "7" },
          { id: "d", text: "An error" },
        ],
        correct: "c",
        explanation: "There is no let inside add, so total there IS the outer variable. Two calls add 1 twice.",
        whyWrong: {
          a: "That would happen if add declared its own local total with let.",
          b: "add is called twice.",
          d: "Functions can read and change outer variables. That is legal, though often unwise.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l21-expressions-arrows": {
    lessonId: "js-l21-expressions-arrows",
    passMark: 70,
    questions: [
      {
        id: "jsq21-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-arrow-functions",
        prompt: "const triple = (n) => n * 3;\nconsole.log(triple(4));\n\nWhat is printed?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "undefined" },
          { id: "c", text: "n * 3" },
          { id: "d", text: "43" },
        ],
        correct: "a",
        explanation: "With no braces, the arrow function returns the value of its expression automatically: 4 × 3.",
        whyWrong: {
          b: "That happens with braces and no return. This arrow has no braces.",
          c: "The expression is evaluated, not printed as text.",
          d: "* multiplies numbers; it does not join them.",
        },
      },
      {
        id: "jsq21-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-arrow-trap",
        prompt: "const half = (n) => { n / 2; };\nconsole.log(half(10));\n\nWhat is printed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "undefined" },
          { id: "c", text: "10" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "With braces, the body is a block, and nothing is returned without an explicit return.",
        whyWrong: {
          a: "That needs either no braces or return n / 2; inside them.",
          c: "The function does not return its input either. It returns nothing.",
          d: "It is valid code; it just does not return a value.",
        },
      },
      {
        id: "jsq21-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-default-parameters",
        prompt: "function greet(name = \"friend\") { return `Hi ${name}`; }\nconsole.log(greet(\"\"));\n\nWhat is printed?",
        options: [
          { id: "a", text: "Hi friend" },
          { id: "b", text: "Hi " },
          { id: "c", text: "Hi undefined" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "Defaults only replace undefined. An empty string is a real argument, so name is \"\" and the output is \"Hi \" followed by nothing.",
        whyWrong: {
          a: "That would need greet() or greet(undefined).",
          c: "name has the value \"\", not undefined.",
          d: "Passing an empty string is valid.",
        },
      },
      {
        id: "jsq21-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-function-expression",
        prompt: "Which can be called on a line ABOVE where it is written?",
        options: [
          { id: "a", text: "function calc() { … } (a declaration)" },
          { id: "b", text: "const calc = function () { … };" },
          { id: "c", text: "const calc = () => { … };" },
          { id: "d", text: "None of them" },
        ],
        correct: "a",
        explanation: "Function declarations are available throughout their scope before their line runs. Expressions and arrows stored in const only exist after their line.",
        whyWrong: {
          b: "A const binding cannot be used before its line; it throws a ReferenceError.",
          c: "An arrow stored in const has the same restriction.",
          d: "Declarations can be called before their line. That is the one difference.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l22-callbacks-decomposition": {
    lessonId: "js-l22-callbacks-decomposition",
    passMark: 70,
    questions: [
      {
        id: "jsq22-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-callbacks",
        prompt: "What is a callback?",
        options: [
          { id: "a", text: "A function that calls itself" },
          { id: "b", text: "A function passed as an argument to another function, which calls it" },
          { id: "c", text: "The return value of a function" },
          { id: "d", text: "A function with no parameters" },
        ],
        correct: "b",
        explanation: "The receiving function decides when to call the callback. Array methods, events and timers all work this way.",
        whyWrong: {
          a: "That is recursion, a different idea.",
          c: "A return value is what a function gives back, not a function passed in.",
          d: "Callbacks can have any number of parameters.",
        },
      },
      {
        id: "jsq22-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-callbacks",
        prompt: "function run(fn) { return fn(5); }\nconst sq = (n) => n * n;\n\nWhich call correctly passes sq as a callback?",
        options: [
          { id: "a", text: "run(sq())" },
          { id: "b", text: "run(sq)" },
          { id: "c", text: "run(\"sq\")" },
          { id: "d", text: "sq(run)" },
        ],
        correct: "b",
        explanation: "Pass the function itself, without brackets. run then calls it with 5 and returns 25.",
        whyWrong: {
          a: "sq() calls sq immediately with no argument and passes its result, NaN, instead of the function.",
          c: "That passes a string, which cannot be called.",
          d: "That passes run into sq, the wrong way round.",
        },
      },
      {
        id: "jsq22-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-callback-inline",
        prompt: "function twice(x, fn) { return fn(fn(x)); }\nconsole.log(twice(3, (n) => n + 4));\n\nWhat is printed?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "11" },
          { id: "c", text: "14" },
          { id: "d", text: "10" },
        ],
        correct: "b",
        explanation: "The inner call gives 3 + 4 = 7, and the outer call gives 7 + 4 = 11.",
        whyWrong: {
          a: "That is only one application of fn.",
          c: "That doubles 7. The callback adds 4; it does not double.",
          d: "That adds 4 to 3 and then 3 again, which is not what fn does.",
        },
      },
      {
        id: "jsq22-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-function-design",
        prompt: "Which function is best designed for reuse and testing?",
        options: [
          { id: "a", text: "One that reads a global variable, changes it, and prints the result" },
          { id: "b", text: "One that takes its inputs as parameters and returns its result" },
          { id: "c", text: "One that does everything the program needs in one place" },
          { id: "d", text: "One with no name, so it cannot be misused" },
        ],
        correct: "b",
        explanation: "A function that depends only on its parameters and returns a value can be called anywhere and checked by comparing its output for chosen inputs.",
        whyWrong: {
          a: "Its result depends on global state and goes to the screen, so it cannot be reused or checked easily.",
          c: "A function that does everything cannot be reused for any part of it.",
          d: "Names are what make functions readable and reusable.",
        },
      },
    ],
  },
};
