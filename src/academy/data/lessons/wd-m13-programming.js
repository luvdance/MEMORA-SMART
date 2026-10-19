/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 13 · INTRODUCTION TO PROGRAMMING
 *
 * Curriculum 13.1 – 13.10. Phase 3 teaches programming itself, so that the
 * interactive pages of Phase 4 are built on understanding rather than copied.
 * Every "what does this print?" exercise is run in Node by
 * `npm run validate:content`; every pseudocode exercise carries a JavaScript
 * `equivalent` that is run instead. The labs run the learner's own JavaScript
 * in the page and call their functions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s13-programming";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 13.1 – 13.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l57-programming",
    moduleId: "wd-m13-programming",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3", "13.4"],
    title: "What Programming Is, and Your First JavaScript",
    subtitle: "Instructions a computer follows exactly, and the two kinds of error",
    estimatedMinutes: 22,
    intro:
      "HTML says what is on a page and CSS says how it looks. Neither can decide anything. Programming is how a page makes decisions: is this email valid, what is the total, which questions has the student got right? This phase teaches it properly, one idea at a time, before any of it touches a web page.",

    atoms: [
      {
        id: "a-wd-what-programming",
        title: "What programming is",
        explain:
          "A program is a precise list of instructions that a computer follows, one after another, exactly as written. The computer does not understand what you meant; it does what you said. Programming is the skill of breaking a task into steps small and exact enough for a machine, and writing them in a language it can run. That is why this phase starts with thinking, not syntax.",
        why: "Most beginners' bugs are not typing mistakes but unclear steps. A programmer who can describe a task precisely in plain English can write it in any language.",
      },
      {
        id: "a-wd-js-in-page",
        title: "What JavaScript does in a webpage",
        explain:
          "JavaScript is the programming language of the web, built into every browser. In a page it responds to the visitor (clicks, typing, scrolling), changes the page without reloading it, checks forms, saves data in the browser and fetches new data from servers. The same language also runs on servers with Node.js, and the Academy runs every example in this phase in Node to prove its output.",
        webDemo: {
          caption: "A whole page with a few lines of JavaScript. Click the button, then change the price or the quantity in app.js.",
          files: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order</title>
</head>
<body>
  <p>Jollof rice, ₦2,500 a plate.</p>
  <button id="calc">Work out the total for 3 plates</button>
  <p id="out"></p>
  <script src="app.js"></script>
</body>
</html>
`,
            "app.js": `const price = 2500;
const quantity = 3;

document.querySelector("#calc").addEventListener("click", () => {
  const total = price * quantity;
  document.querySelector("#out").textContent = "Total: ₦" + total;
  console.log("Calculated a total of", total);
});
`,
          },
        },
      },
      {
        id: "a-wd-statements",
        title: "Instructions and statements",
        explain:
          "Each instruction in JavaScript is a statement, and statements run top to bottom, one at a time, unless something tells them otherwise. End each statement with a semicolon. console.log() prints a value to the console, which is how you see what a program is doing. Text in quotes is a string; numbers are written without quotes.",
        codeExercise: {
          language: JS,
          code: 'console.log("Start");\nconsole.log(2 + 3);\nconsole.log("2 + 3");\nconsole.log("End");\n',
          question: "Four statements run in order. What does the console show?",
          expectedOutput: "Start\n5\n2 + 3\nEnd",
          hint: "Without quotes, 2 + 3 is calculated. With quotes, it is just text.",
          successMessage: "Top to bottom, one at a time. And the quotes decide whether JavaScript calculates or simply prints.",
        },
      },
      {
        id: "a-wd-errors",
        title: "Syntax and runtime errors",
        explain:
          "A syntax error means the code is not valid JavaScript at all, like a sentence with no verb: a missing bracket or quote. Nothing in the file runs. A runtime error happens while the program is running, when a valid statement cannot be carried out, such as using a variable that does not exist. Everything before it ran; nothing after it does. The console shows both, with the line number.",
        table: {
          caption: "The two kinds of error.",
          headers: ["", "Syntax error", "Runtime error"],
          rows: [
            ["When", "Before anything runs", "While running"],
            ["Example", "console.log(\"Hi\"   (missing bracket)", "console.log(totl)   (no such variable)"],
            ["Message", "SyntaxError: missing ) after argument list", "ReferenceError: totl is not defined"],
            ["How much runs", "Nothing in the file", "Everything before the error"],
          ],
        },
        webLab: {
          task:
            "This script should print three lines: Welcome, then Plates: 3, then Total: 7500. It has one syntax error (so nothing runs at all) and one runtime error. Read the console, fix both, and check.",
          files: {
            "app.js": 'const price = 2500;\nconst plates = 3;\n\nconsole.log("Welcome";\nconsole.log("Plates: " + plates);\nconsole.log("Total: " + price * platess);\n',
          },
          tests: [
            { label: "There are no errors in the console", check: "return errors().length === 0;", fail: "There is still an error. Read its message: it names the problem and the line." },
            { label: "The console shows exactly the three expected lines", check: "return output() === 'Welcome\\nPlates: 3\\nTotal: 7500';", fail: "The output should be Welcome, Plates: 3 and Total: 7500, on three lines." },
          ],
          solution: {
            "app.js": 'const price = 2500;\nconst plates = 3;\n\nconsole.log("Welcome");\nconsole.log("Plates: " + plates);\nconsole.log("Total: " + price * plates);\n',
          },
          hint: "The first error is a missing closing bracket. After fixing it, the next error is a misspelled variable name.",
          successMessage: "You fixed a syntax error (nothing ran) and then a runtime error (it ran until the bad line). Reading the console's message is how every bug starts being fixed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 13.5 – 13.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l58-algorithms",
    moduleId: "wd-m13-programming",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.5", "13.6", "13.7"],
    title: "Algorithms, Pseudocode and Flowcharts",
    subtitle: "Planning a program before writing it",
    estimatedMinutes: 22,
    intro:
      "Experienced programmers plan before they type. A five-minute plan in plain English or a quick flowchart catches the mistakes that would otherwise take an hour to debug.",

    atoms: [
      {
        id: "a-wd-algorithms",
        title: "Algorithms and step-by-step reasoning",
        explain:
          "An algorithm is a finite list of precise steps that solves a problem. Every step must be unambiguous, the steps must be in a definite order, and it must finish. A recipe is close to an algorithm; \"cook until done\" is not precise enough, \"cook for 20 minutes on low heat\" is. Programming is turning algorithms into code.",
        example:
          "Algorithm: decide the delivery fee for an order\n  1. Read the order total.\n  2. If the total is ₦10,000 or more, the fee is 0.\n  3. Otherwise, if the total is ₦5,000 or more, the fee is ₦500.\n  4. Otherwise, the fee is ₦1,000.\n  5. Show the fee.",
      },
      {
        id: "a-wd-pseudocode-flowcharts",
        title: "Pseudocode and flowcharts",
        explain:
          "Pseudocode is an algorithm written in structured plain English, with words like IF, ELSE, WHILE and SET, but no exact syntax. A flowchart draws the same thing: ovals for start and end, rectangles for actions, parallelograms for input and output, diamonds for decisions with Yes and No arrows. Both let you check the logic before worrying about brackets and semicolons.",
        codeExercise: {
          language: "pseudocode",
          code: "SET total TO 7000\nIF total >= 10000 THEN\n    SET fee TO 0\nELSE IF total >= 5000 THEN\n    SET fee TO 500\nELSE\n    SET fee TO 1000\nEND IF\nOUTPUT fee",
          equivalent: "let total = 7000;\nlet fee;\nif (total >= 10000) {\n  fee = 0;\n} else if (total >= 5000) {\n  fee = 500;\n} else {\n  fee = 1000;\n}\nconsole.log(fee);\n",
          question: "Dry-run the pseudocode: what does it output for an order of 7000?",
          expectedOutput: "500",
          hint: "Check the conditions in order. Is 7000 at least 10000? Is it at least 5000?",
          successMessage: "500. The first condition is false, the second true, so the third is never checked. That order matters, as you will see in Module 14.",
        },
      },
      {
        id: "a-wd-ipo",
        title: "Input, processing and output",
        explain:
          "Almost every program has three parts: input (data comes in: a typed number, a click, a file), processing (the program works on it: calculates, compares, sorts) and output (a result goes out: printed, shown on the page, saved). Identifying the three before coding tells you what your function needs as parameters, what it calculates, and what it returns.",
        table: {
          caption: "Input, processing and output in everyday programs.",
          headers: ["Program", "Input", "Processing", "Output"],
          rows: [
            ["Delivery fee", "The order total", "Compare with the thresholds", "The fee"],
            ["Exam grade", "A score out of 100", "Find its band", "A letter grade"],
            ["Currency converter", "Naira and a rate", "Multiply", "Dollars"],
          ],
        },
        webLab: {
          task:
            "Turn the delivery-fee algorithm into JavaScript. Write a function deliveryFee(total) that takes the order total (the input) and returns the fee (the output): 0 for ₦10,000 or more, 500 for ₦5,000 or more, and 1000 otherwise. The checks call your function with several totals, including the exact boundaries.",
          files: {
            "app.js": "function deliveryFee(total) {\n  // Your algorithm here: return the fee\n}\n\nconsole.log(deliveryFee(7000));\n",
          },
          tests: [
            { label: "deliveryFee is a function", check: "return typeof deliveryFee === 'function';", fail: "Keep the function named deliveryFee." },
            { label: "₦12,000 has free delivery (0)", check: "return deliveryFee(12000) === 0;", fail: "Orders of 10000 or more should return 0." },
            { label: "Exactly ₦10,000 is free too", check: "return deliveryFee(10000) === 0;", fail: "The boundary: 10000 itself should be free. Use >=, not >." },
            { label: "₦7,000 costs 500, and exactly ₦5,000 costs 500", check: "return deliveryFee(7000) === 500 && deliveryFee(5000) === 500;", fail: "Orders from 5000 up to 9999 should return 500." },
            { label: "₦4,999 and ₦0 cost 1000", check: "return deliveryFee(4999) === 1000 && deliveryFee(0) === 1000;", fail: "Anything under 5000 should return 1000." },
          ],
          solution: {
            "app.js": "function deliveryFee(total) {\n  if (total >= 10000) {\n    return 0;\n  } else if (total >= 5000) {\n    return 500;\n  } else {\n    return 1000;\n  }\n}\n\nconsole.log(deliveryFee(7000));\n",
          },
          hint: "Translate the pseudocode line by line: IF becomes if (…) { }, ELSE IF becomes else if, and each SET fee becomes return.",
          successMessage: "Plan, then code: the JavaScript is almost a line-by-line copy of the pseudocode. And the boundary checks (exactly 10000, exactly 5000) are where most bugs in rules like this hide.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 13.8 – 13.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l59-variables-types",
    moduleId: "wd-m13-programming",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.8", "13.9", "13.10"],
    title: "Variables, Data Types and Expressions",
    subtitle: "Storing values, the kinds of value JavaScript knows, and combining them",
    estimatedMinutes: 24,
    intro:
      "Programs need to remember things: a price, a name, whether a box is ticked. This lesson covers how JavaScript stores values, the different kinds of value, and how they are combined into new ones.",

    atoms: [
      {
        id: "a-wd-variables",
        title: "Variables and constants",
        explain:
          "A variable is a named place to store a value. Declare it with const when the value will not be reassigned, and let when it will. Use const by default: it tells the reader \"this does not change\" and stops accidental changes. Names should say what the value is (orderTotal, not x), start with a letter, and use camelCase. Avoid the old var keyword.",
        codeExercise: {
          language: JS,
          code: 'const price = 1500;\nlet quantity = 2;\nquantity = quantity + 1;\nconsole.log(price * quantity);\nprice = 2000;\nconsole.log("never printed");\n',
          question: "What does this print, and what happens on line 5?",
          expectedOutput: "4500",
          raises: "TypeError: Assignment to constant variable.",
          hint: "quantity can change because it was declared with let. price was declared with const.",
          successMessage: "4500, then a TypeError: a const cannot be reassigned. That error is the point of const: it catches changes you did not intend.",
        },
      },
      {
        id: "a-wd-data-types",
        title: "Data types",
        explain:
          "Every value has a type. The primitive types you will use all the time are string (text, in quotes), number (integers and decimals alike), boolean (true or false), undefined (a variable with no value yet) and null (deliberately empty). Objects and arrays, which group values, come in Module 17. typeof tells you a value's type, which is often the first step in finding a bug.",
        table: {
          caption: "The primitive types.",
          headers: ["Type", "Examples", "typeof gives"],
          rows: [
            ["string", "\"Ada\", 'Lagos', `₦${500}`", "\"string\""],
            ["number", "42, 3.14, -7", "\"number\""],
            ["boolean", "true, false", "\"boolean\""],
            ["undefined", "let x;  (no value)", "\"undefined\""],
            ["null", "let winner = null;", "\"object\" (a famous old quirk)"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'console.log(typeof "500");\nconsole.log(typeof 500);\nconsole.log(typeof true);\nlet answer;\nconsole.log(typeof answer);\n',
          question: "What type does each line report?",
          expectedOutput: "string\nnumber\nboolean\nundefined",
          hint: "\"500\" is in quotes. answer was declared but never given a value.",
          successMessage: "A number in quotes is a string, which is exactly the bug behind many wrong totals, as you will see next.",
        },
      },
      {
        id: "a-wd-operators-expressions",
        title: "Operators and expressions",
        explain:
          "An expression is any piece of code that produces a value: 2 + 3, price * quantity, firstName + \" \" + lastName. Operators combine values: + - * / for arithmetic (with * and / before + and -, and brackets to change the order), and + also joins strings. When + meets a string and a number, the number is turned into a string and joined, so \"5\" + 3 is \"53\", not 8.",
        webLab: {
          task:
            "Write a receipt calculator in app.js. Declare constants for a plate price of 2500, a drink price of 400, 3 plates and 2 drinks. Calculate the subtotal, a delivery fee of 1000 and the total, then print exactly these three lines: Subtotal: 8300, then Delivery: 1000, then Total: 9300. Also keep the total in a variable called total so the checks can read it.",
          files: { "app.js": "// Declare your constants here\n\n// Calculate the subtotal and the total\n\n// Print the three lines\n" },
          tests: [
            { label: "A variable called total holds 9300, as a number", check: "return typeof total === 'number' && total === 9300;", fail: "Store the final amount in const total = …; as a number, not a string." },
            { label: "The prices and quantities are constants, not typed into the answer", check: "const c = code('app.js'); return /\\b(const|let)\\b[^;]*2500/.test(c) && /\\b(const|let)\\b[^;]*400/.test(c) && !/\\b9300\\b/.test(c) && !/\\b8300\\b/.test(c);", fail: "Declare the prices and quantities as constants and calculate the totals; do not type 8300 or 9300 yourself." },
            { label: "The console shows exactly the three receipt lines", check: "return output() === 'Subtotal: 8300\\nDelivery: 1000\\nTotal: 9300';", fail: "Print Subtotal: 8300, Delivery: 1000 and Total: 9300, each with console.log." },
          ],
          solution: {
            "app.js": 'const platePrice = 2500;\nconst drinkPrice = 400;\nconst plates = 3;\nconst drinks = 2;\nconst delivery = 1000;\n\nconst subtotal = platePrice * plates + drinkPrice * drinks;\nconst total = subtotal + delivery;\n\nconsole.log("Subtotal: " + subtotal);\nconsole.log("Delivery: " + delivery);\nconsole.log("Total: " + total);\n',
          },
          hint: "* happens before +, so platePrice * plates + drinkPrice * drinks needs no brackets. Joining a string and a number with + gives text such as \"Total: 9300\".",
          successMessage: "Change the number of plates to 4 and look at the console: every line updates, because nothing was typed by hand. That is the reason variables exist.",
        },
      },
    ],

    task: {
      title: "Module project: plan, then code, a delivery-fee calculator",
      intro: "On your own computer, in a new folder, plan and build a small program.",
      prompts: [
        "Write the algorithm for a shop's delivery fee with at least three bands, as numbered steps in plain English.",
        "Draw it as a flowchart, on paper or in a free tool such as draw.io.",
        "Write it as pseudocode with IF, ELSE IF and ELSE.",
        "Write it in app.js as a function deliveryFee(total), and print the fee for five totals, including both boundaries.",
        "Deliberately introduce one syntax error and one runtime error, and write down the message each produces.",
      ],
      closing: "Keep the flowchart: Module 14 gives you every operator and condition you need to make rules like this richer.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
