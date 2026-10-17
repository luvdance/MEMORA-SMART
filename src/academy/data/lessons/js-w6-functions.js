/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 6 · FUNCTIONS & REUSABLE LOGIC
 *
 * Curriculum 6.1 – 6.10. Decomposition from Week 1, made into code: each
 * function is one named, reusable piece of a larger problem. Every snippet is
 * executed by the content validator in Node.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s6-functions";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 6.1 – 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l19-why-functions",
    moduleId: "js-w6-functions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3"],
    title: "Why Functions Exist",
    subtitle: "Declarations, parameters and arguments",
    estimatedMinutes: 15,
    intro:
      "In Week 1 you decomposed the grade calculator into small steps: get the scores, calculate the average, decide the grade, report. A function is how one of those steps becomes a named, reusable piece of code. This is the single biggest step up in the course so far.",

    atoms: [
      {
        id: "a-js-why-functions",
        title: "Why functions exist",
        explain:
          "A function is a named block of code that does one job and can be run whenever you need it, as many times as you need it. Functions exist for three reasons: to avoid repeating code, to give a name to an idea so code reads like the problem it solves, and to let you build and test one small piece at a time.",
        example:
          "Without functions, calculating three students' averages:\n\n  const avgA = (70 + 80 + 90) / 3;\n  const avgB = (55 + 65 + 60) / 3;\n  const avgC = (40 + 85 + 72) / 3;\n\nFind a bug in the formula and you fix it three times.\n\nWith a function, written once:\n\n  function average(a, b, c) {\n    return (a + b + c) / 3;\n  }\n\n  const avgA = average(70, 80, 90);\n  const avgB = average(55, 65, 60);\n  const avgC = average(40, 85, 72);\n\nFix the formula in one place and every caller is fixed.",
        why: "This is the DRY principle: Don't Repeat Yourself. Every copy of a piece of logic is another place a bug can hide and another place you must remember to change.",
      },
      {
        id: "a-js-function-declaration",
        title: "Function declarations",
        explain:
          "A function declaration starts with the keyword function, then a name, then brackets, then a body in braces. Declaring a function does not run it. You run it, or call it, by writing its name followed by brackets. Every call runs the whole body from the top.",
        code: {
          language: JS,
          code: 'function greet() {\n  console.log("Welcome to Memora Smart Academy");\n}\n\ngreet();\ngreet();\n',
          expectedOutput: "Welcome to Memora Smart Academy\nWelcome to Memora Smart Academy",
        },
        mistake:
          "Writing greet instead of greet(). Without the brackets you are referring to the function, not calling it, so nothing runs. console.log(greet) prints the function itself: [Function: greet].",
      },
      {
        id: "a-js-parameters-arguments",
        title: "Parameters and arguments",
        explain:
          "A parameter is a name listed in the function's brackets, a placeholder for a value the function will receive. An argument is the actual value you pass when you call it. The first argument goes into the first parameter, the second into the second, and so on, by position.",
        code: {
          language: JS,
          code: 'function introduce(name, city) {\n  console.log(`${name} is from ${city}.`);\n}\n\nintroduce("Bola", "Ibadan");\nintroduce("Ikenna", "Owerri");\n',
          expectedOutput: "Bola is from Ibadan.\nIkenna is from Owerri.",
        },
        table: {
          caption: "Two words, often confused.",
          headers: ["", "Where it appears", "In the example"],
          rows: [
            ["Parameter", "In the function definition", "name, city"],
            ["Argument", "In the function call", "\"Bola\", \"Ibadan\""],
          ],
        },
      },
      {
        id: "a-js-argument-order",
        title: "Order matters, and missing arguments",
        explain:
          "Arguments are matched to parameters by position only. JavaScript does not check whether you passed the right number: extra arguments are ignored and a missing argument makes that parameter undefined. Neither causes an error, which is why both cause bugs.",
        codeExercise: {
          language: JS,
          code: 'function describe(item, price) {\n  console.log(`${item} costs ${price}`);\n}\n\ndescribe(1500, "Notebook");\ndescribe("Pen");\n',
          question: "Both calls are slightly wrong. What is printed?",
          expectedOutput: "1500 costs Notebook\nPen costs undefined",
          hint: "The first argument always goes into item and the second into price, whatever they are. A parameter with no argument is undefined.",
          successMessage:
            "Neither line threw an error, and both are wrong. JavaScript trusts you to pass arguments in the right order and number, which is why naming parameters clearly matters so much.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 6.4 – 6.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l20-return-scope",
    moduleId: "js-w6-functions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.4", "6.5"],
    title: "return, and Where Variables Live",
    subtitle: "The difference between printing and producing a value",
    estimatedMinutes: 16,
    intro:
      "The most important distinction in this week, and one most beginners get wrong for months: a function that PRINTS a result is not the same as a function that RETURNS one. And variables made inside a function stay inside it.",

    atoms: [
      {
        id: "a-js-return",
        title: "The return statement",
        explain:
          "return sends a value back to wherever the function was called, and ends the function immediately. The call then becomes that value, so you can store it, print it, or use it in another calculation. A function with no return gives back undefined.",
        code: {
          language: JS,
          code: "function square(n) {\n  return n * n;\n}\n\nconst a = square(4);\nconst b = square(3) + square(2);\nconsole.log(a);\nconsole.log(b);\nconsole.log(square(square(2)));\n",
          expectedOutput: "16\n13\n16",
        },
        why: "Because square(3) becomes the value 9, it can be used anywhere a number can. The last line passes the result of one call into another. That is only possible because the function returns its answer rather than printing it.",
      },
      {
        id: "a-js-return-vs-log",
        title: "return versus console.log()",
        explain:
          "console.log() shows a value to a person, on screen, and that is all. return gives a value to the code that called the function. A function that only logs its result is a dead end: the value appears on screen, but the rest of the program cannot use it.",
        codeExercise: {
          language: JS,
          code: "function addLog(a, b) {\n  console.log(a + b);\n}\n\nfunction addReturn(a, b) {\n  return a + b;\n}\n\nconst x = addLog(2, 3);\nconst y = addReturn(2, 3);\nconsole.log(x);\nconsole.log(y);\n",
          question: "Both functions add 2 and 3. Trace every line that prints. What appears, in order?",
          expectedOutput: "5\nundefined\n5",
          hint: "Line 9 calls addLog, which prints 5 itself and returns nothing. So what is stored in x?",
          successMessage:
            "5, undefined, 5. addLog printed 5 while it ran, then returned nothing, so x is undefined. addReturn printed nothing, but y holds 5 and can be used. Return the value; let the caller decide whether to print it.",
        },
        mistake:
          "Writing functions that console.log() their answer \"to check it works\" and then wondering why total = calculate() gives undefined. Return the value, and print it at the call site if you want to see it.",
      },
      {
        id: "a-js-early-return",
        title: "return ends the function",
        explain:
          "Nothing after a return runs. This makes return useful for stopping early when the input is invalid, before the main work begins. The checks go at the top, each one returning straight away if it fails, and the main logic comes last, un-nested.",
        code: {
          language: JS,
          code: 'function divide(a, b) {\n  if (b === 0) {\n    return "Cannot divide by zero";\n  }\n  return a / b;\n}\n\nconsole.log(divide(10, 4));\nconsole.log(divide(10, 0));\n',
          expectedOutput: "2.5\nCannot divide by zero",
        },
        why: "These early checks are called guard clauses. They are the fix for the deep nesting you were warned about last week: each failure case is handled and finished at the top, so the normal case reads in a straight line.",
      },
      {
        id: "a-js-function-scope",
        title: "Function scope and local variables",
        explain:
          "A variable declared inside a function is local to it: it is created when the function runs and disappears when it returns. Code outside the function cannot see it. Parameters are local variables too. A variable declared outside every function is global, and functions can read it.",
        code: {
          language: JS,
          code: 'const SCHOOL = "Memora Academy";\n\nfunction welcome(name) {\n  const message = `Welcome to ${SCHOOL}, ${name}`;\n  return message;\n}\n\nconsole.log(welcome("Efe"));\nconsole.log(typeof message);\n',
          expectedOutput: "Welcome to Memora Academy, Efe\nundefined",
        },
        why: "Local variables are what make functions safe to reuse. Two functions can both have a variable called total without interfering, because each one's total lives only inside it. typeof is used on the last line because reading message directly would throw a ReferenceError.",
      },
      {
        id: "a-js-scope-shadowing",
        title: "Same name, different variable",
        explain:
          "If a function declares a local variable with the same name as an outer one, the local one hides, or shadows, the outer one inside that function. Changes to the local variable do not affect the outer one at all.",
        codeExercise: {
          language: JS,
          code: "let count = 10;\n\nfunction reset() {\n  let count = 0;\n  count++;\n  return count;\n}\n\nconsole.log(reset());\nconsole.log(count);\n",
          question: "There are two variables called count here. What is printed?",
          expectedOutput: "1\n10",
          hint: "Inside reset, let count creates a new local variable. Does count++ there touch the outer count?",
          successMessage:
            "1 and 10. The local count started at 0 and became 1; the outer count was never touched. Remove the let inside the function and it would change the outer one instead, which is a very different program.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 6.6 – 6.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l21-expressions-arrows",
    moduleId: "js-w6-functions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.6", "6.7", "6.8"],
    title: "Function Expressions, Arrows and Defaults",
    subtitle: "Functions are values",
    estimatedMinutes: 15,
    intro:
      "In JavaScript a function is a value, like a number or a string. You can store it in a variable, pass it to another function and return it from one. This lesson shows the other two ways to write a function, and makes missing arguments safe.",

    atoms: [
      {
        id: "a-js-function-expression",
        title: "Function expressions",
        explain:
          "A function expression creates a function and stores it in a variable, usually a const. It works exactly like a declaration once created. The difference is when it exists: a declaration can be called from anywhere in its scope, even above the line where it is written, but a function expression only exists after its line has run.",
        code: {
          language: JS,
          code: 'console.log(declared(2));\n\nfunction declared(n) {\n  return n * 10;\n}\n\nconst expressed = function (n) {\n  return n * 100;\n};\n\nconsole.log(expressed(2));\n',
          expectedOutput: "20\n200",
        },
        why: "Calling expressed above its line would throw a ReferenceError, for the same reason let does. Many teams prefer expressions for exactly that reason: the code reads top to bottom with no surprises. Week 9 explains the mechanism, hoisting.",
      },
      {
        id: "a-js-arrow-functions",
        title: "Arrow functions",
        explain:
          "An arrow function is a shorter way to write a function expression, using => instead of the word function. When the body is a single expression you can drop the braces and the return: the value of the expression is returned automatically. With one parameter, the brackets around it are optional.",
        code: {
          language: JS,
          code: "const double = (n) => n * 2;\nconst add = (a, b) => a + b;\nconst sayHi = () => \"Hi!\";\nconst describe = (n) => {\n  const kind = n % 2 === 0 ? \"even\" : \"odd\";\n  return `${n} is ${kind}`;\n};\n\nconsole.log(double(7));\nconsole.log(add(2, 3));\nconsole.log(sayHi());\nconsole.log(describe(9));\n",
          expectedOutput: "14\n5\nHi!\n9 is odd",
        },
        table: {
          caption: "The same function, three ways.",
          headers: ["Form", "Code"],
          rows: [
            ["Declaration", "function double(n) { return n * 2; }"],
            ["Expression", "const double = function (n) { return n * 2; };"],
            ["Arrow", "const double = (n) => n * 2;"],
          ],
        },
        mistake:
          "Using braces and forgetting return: const double = (n) => { n * 2; }. With braces, the body is a normal block and nothing is returned automatically, so double(7) is undefined.",
      },
      {
        id: "a-js-arrow-trap",
        title: "Braces change everything",
        explain:
          "This one line is the most common arrow-function bug. Read each function carefully: is the body an expression, or a block in braces?",
        codeExercise: {
          language: JS,
          code: "const a = (x) => x + 1;\nconst b = (x) => { x + 1; };\nconst c = (x) => { return x + 1; };\n\nconsole.log(a(5));\nconsole.log(b(5));\nconsole.log(c(5));\n",
          question: "Three arrow functions that look almost identical. What is printed?",
          expectedOutput: "6\nundefined\n6",
          hint: "Without braces, the expression is returned. With braces, only an explicit return returns anything.",
          successMessage: "6, undefined, 6. b calculates x + 1 and throws it away. If an arrow function with braces gives undefined, look for the missing return first.",
        },
      },
      {
        id: "a-js-default-parameters",
        title: "Default parameters",
        explain:
          "A default parameter gives a parameter a value to use when no argument is passed, or when undefined is passed. Write it with = in the parameter list. It removes the \"undefined\" bug from the last lesson for any parameter that has a sensible default.",
        code: {
          language: JS,
          code: 'function price(amount, vatRate = 0.075) {\n  return amount + amount * vatRate;\n}\n\nconsole.log(price(1000));\nconsole.log(price(1000, 0));\nconsole.log(price(1000, undefined));\n',
          expectedOutput: "1075\n1000\n1075",
        },
        why: "The second call matters: passing 0 explicitly uses 0, because the default only replaces undefined, not every falsy value. That is exactly the behaviour you want for a tax rate, and it is why defaults are safer than writing vatRate = vatRate || 0.075, which would wrongly replace 0.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 6.9 – 6.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l22-callbacks-decomposition",
    moduleId: "js-w6-functions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.9", "6.10"],
    title: "Callbacks and Reusable Design",
    subtitle: "Passing functions to functions, and building a program from small ones",
    estimatedMinutes: 16,
    intro:
      "Because functions are values, you can hand one to another function and let it decide when to call it. That is a callback, and it is how most of JavaScript works: array methods, events, timers and network requests all take callbacks. Then you build this week's calculator from small functions.",

    atoms: [
      {
        id: "a-js-callbacks",
        title: "Callback functions",
        explain:
          "A callback is a function passed as an argument to another function, which then calls it. The receiving function decides when, and how many times, to call it. Pass the function itself, without brackets: with brackets you would call it immediately and pass its result instead.",
        code: {
          language: JS,
          code: "function repeat(times, action) {\n  for (let i = 1; i <= times; i++) {\n    action(i);\n  }\n}\n\nfunction shout(n) {\n  console.log(`Round ${n}!`);\n}\n\nrepeat(3, shout);\n",
          expectedOutput: "Round 1!\nRound 2!\nRound 3!",
        },
        why: "repeat knows how to repeat; shout knows what to do each time. Neither knows about the other's job. That separation is why callbacks are everywhere: in Week 8 arr.map(callback) knows how to visit every item, and you supply what to do with each one.",
      },
      {
        id: "a-js-callback-inline",
        title: "Passing an arrow function as a callback",
        explain:
          "Callbacks are very often written inline, as an arrow function right inside the call, when the logic is short and only used in one place.",
        codeExercise: {
          language: JS,
          code: "function applyToEach(a, b, c, fn) {\n  return fn(a) + fn(b) + fn(c);\n}\n\nconsole.log(applyToEach(1, 2, 3, (n) => n * n));\nconsole.log(applyToEach(1, 2, 3, (n) => n + 10));\n",
          question: "The same function, given two different callbacks. What is printed?",
          expectedOutput: "14\n36",
          hint: "First call: square each of 1, 2 and 3, then add the results. Second call: add 10 to each, then add the results.",
          successMessage: "14 (1 + 4 + 9) and 36 (11 + 12 + 13). One function, two behaviours, chosen entirely by the callback passed in.",
        },
      },
      {
        id: "a-js-decompose-functions",
        title: "Breaking a problem into functions",
        explain:
          "Decomposition from Week 1 now has a direct translation: each sub-problem becomes a function with a clear name, clear inputs (parameters) and one clear output (its return value). The top-level code then reads like the plan.",
        code: {
          language: JS,
          code: 'function average(scores) {\n  let total = 0;\n  for (const s of scores) total += s;\n  return total / scores.length;\n}\n\nfunction gradeFor(avg) {\n  if (avg >= 70) return "A";\n  if (avg >= 60) return "B";\n  if (avg >= 50) return "C";\n  return "F";\n}\n\nfunction report(name, scores) {\n  const avg = average(scores);\n  return `${name}: ${avg.toFixed(1)} (${gradeFor(avg)})`;\n}\n\nconsole.log(report("Kemi", [72, 65, 80]));\nconsole.log(report("Sani", [48, 55, 41]));\n',
          expectedOutput: "Kemi: 72.3 (A)\nSani: 48.0 (F)",
        },
        why: "Each function can be read, tested and fixed on its own. If grades are wrong, you look at gradeFor and nothing else. The scores are passed as a list, written in square brackets, which you will study properly next week.",
      },
      {
        id: "a-js-function-design",
        title: "What makes a good function",
        explain:
          "A good function does one thing, is named for that thing with a verb, takes everything it needs as parameters, and returns its result rather than printing it. Functions designed this way can be reused anywhere and tested by calling them with chosen inputs.",
        decision: {
          scenario:
            "A function called processOrder reads a global cart, calculates the total, applies a discount, adds VAT, prints a receipt and clears the cart.",
          question: "What is the best way to improve it?",
          options: [
            {
              id: "a",
              text: "Split it into calculateSubtotal(cart), applyDiscount(amount), addVat(amount) and printReceipt(order), each taking parameters and returning values",
              why: "Each piece now does one job, depends only on its parameters, and returns a value you can check. You can test addVat(1000) in isolation and reuse applyDiscount in a different screen.",
            },
            {
              id: "b",
              text: "Leave it as one function but add comments to each section",
              whyWrong: "Comments help reading but not testing or reuse. You still cannot check the VAT calculation without running the whole order, printing included.",
            },
            {
              id: "c",
              text: "Rename it to processOrderAndPrintAndClear",
              whyWrong: "An honest name, and a sign that the function is doing too much. A function that needs \"and\" in its name usually wants to be several functions.",
            },
            {
              id: "d",
              text: "Make every variable global so the parts can share them",
              whyWrong: "Global state is what makes functions hard to reuse and test: their result depends on things outside them that anything could change. Pass values in, return values out.",
            },
          ],
          correct: "a",
          aftermath: "Small functions with parameters and return values are called pure when they also change nothing outside themselves. Pure functions are the easiest code there is to test, which you will do formally in Week 13.",
        },
      },
      {
        id: "a-js-calculator",
        title: "The calculator, built from functions",
        explain:
          "This week's mini-project: a calculator with a separate function for each operation, and one function that chooses between them. Notice that the operation functions are values stored in an object, which you will study in Week 8; for now, read operations[op] as \"the function for this symbol\".",
        code: {
          language: JS,
          code: 'const add = (a, b) => a + b;\nconst subtract = (a, b) => a - b;\nconst multiply = (a, b) => a * b;\nconst divide = (a, b) => (b === 0 ? "Error: division by zero" : a / b);\n\nfunction calculate(a, op, b) {\n  const operations = { "+": add, "-": subtract, "*": multiply, "/": divide };\n  const fn = operations[op];\n  if (!fn) return `Error: unknown operator ${op}`;\n  return fn(a, b);\n}\n\nconsole.log(calculate(12, "+", 30));\nconsole.log(calculate(12, "-", 30));\nconsole.log(calculate(12, "*", 3));\nconsole.log(calculate(12, "/", 0));\nconsole.log(calculate(12, "%", 5));\n',
          expectedOutput: "42\n-18\n36\nError: division by zero\nError: unknown operator %",
        },
        why: "Adding a new operation now means writing one small function and adding one entry. Nothing that already works has to change, which is the payoff of designing with functions.",
      },
    ],

    task: {
      title: "Mini-project: the function calculator",
      intro: "Build calculator.js from separate functions, then test every one.",
      prompts: [
        "Write add, subtract, multiply and divide as four separate functions that each RETURN their result. None of them may call console.log().",
        "Make divide return a clear error message when the second number is 0, using a guard clause at the top.",
        "Write a calculate(a, operator, b) function that chooses the right operation with a switch, with a default case for unknown operators.",
        "Add a power function and a remainder function, and add them to calculate without changing any of the four originals.",
        "Test each function with at least three calls, including a negative number, a decimal and zero, and print the results at the call site.",
      ],
      closing:
        "If any function prints instead of returning, you will find you cannot use its result inside calculate. That is the lesson of this week arriving the hard way, and it is worth noticing.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
