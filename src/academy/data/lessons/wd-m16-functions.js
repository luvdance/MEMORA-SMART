/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 16 · FUNCTIONS
 *
 * Curriculum 16.1 – 16.12. Declarations, parameters and arguments, return
 * values, scope, function expressions and arrow functions, callbacks,
 * default parameters, pure functions and side effects, decomposing problems
 * into functions, and debugging them.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s16-functions";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 16.1 – 16.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l67-functions",
    moduleId: "wd-m16-functions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3", "16.4"],
    title: "Functions, Parameters and Return Values",
    subtitle: "Naming a piece of logic, giving it inputs and getting a result back",
    estimatedMinutes: 24,
    intro: "You have been writing functions since Module 13 because the labs asked for them. This module explains them properly: they are the single most important tool for organising code.",

    atoms: [
      {
        id: "a-wd-what-functions",
        title: "What functions are",
        explain:
          "A function is a named, reusable block of code that does one job. You define it once and call it as many times as you need. Functions let you name an idea (calculateTax), hide its details from the code that uses it, test it on its own and change it in one place. The functions you have already used, console.log and Math.round, are written exactly like the ones you write.",
        why: "A 500-line script with no functions is unreadable. The same logic as twenty well-named functions reads like a list of what the program does.",
      },
      {
        id: "a-wd-declarations",
        title: "Function declarations",
        explain:
          "A function declaration starts with the keyword function, then a name, brackets for parameters and a body in braces: function greet() { … }. Defining a function does not run it; calling it does: greet(). Name functions with a verb that says what they do: calculateTotal, formatDate, isValidEmail.",
        codeExercise: {
          language: JS,
          code: 'function sayHello() {\n  console.log("Hello");\n}\n\nconsole.log("Before");\nsayHello();\nsayHello();\nconsole.log("After");\n',
          question: "What is printed, and in what order?",
          expectedOutput: "Before\nHello\nHello\nAfter",
          hint: "Defining sayHello prints nothing. Each call runs its body.",
          successMessage: "Defined once, called twice. The definition itself does nothing until it is called.",
        },
      },
      {
        id: "a-wd-params-args",
        title: "Parameters and arguments",
        explain:
          "Parameters are the names in the definition's brackets: function area(width, height). Arguments are the actual values passed in a call: area(4, 5). Inside the function, the parameters hold the arguments, matched by position. A parameter with no argument is undefined; extra arguments are ignored.",
        codeExercise: {
          language: JS,
          code: "function describe(name, city) {\n  console.log(name + \" lives in \" + city);\n}\n\ndescribe(\"Ada\", \"Enugu\");\ndescribe(\"Musa\");\ndescribe(\"Kemi\", \"Ibadan\", \"Nigeria\");\n",
          question: "What does each call print?",
          expectedOutput: "Ada lives in Enugu\nMusa lives in undefined\nKemi lives in Ibadan",
          hint: "Arguments are matched to parameters by position. A missing one is undefined.",
          successMessage: "Missing arguments become undefined and extra ones are ignored, which is why default parameters (Lesson 69) exist.",
        },
      },
      {
        id: "a-wd-return",
        title: "Return values",
        explain:
          "return sends a value back to the code that called the function, and ends the function immediately. A function without return gives back undefined. Printing inside a function is not the same as returning: a printed value cannot be used in a calculation; a returned one can. Prefer functions that return values and leave printing to the caller.",
        webLab: {
          task:
            "Write three functions that RETURN their results (the checks use the results, not the console). rectangleArea(width, height) returns the area. fullName(first, last) returns the two names with one space between. formatNaira(amount) returns the amount with a ₦ sign in front, such as \"₦2500\".",
          files: { "app.js": "function rectangleArea(width, height) {\n  console.log(width * height);\n}\n\nfunction fullName(first, last) {\n}\n\nfunction formatNaira(amount) {\n}\n" },
          tests: [
            { label: "rectangleArea(4, 5) returns 20", check: "return rectangleArea(4, 5) === 20;", fail: "It prints the area but returns undefined. Change console.log to return." },
            { label: "Its result can be used in a calculation: rectangleArea(2, 3) * 2 is 12", check: "return rectangleArea(2, 3) * 2 === 12;", fail: "Only a returned value can be used like this." },
            { label: "fullName(\"Chidi\", \"Okeke\") returns \"Chidi Okeke\"", check: "return fullName('Chidi', 'Okeke') === 'Chidi Okeke';", fail: "Return first + \" \" + last." },
            { label: "formatNaira(2500) returns \"₦2500\"", check: "return formatNaira(2500) === '₦2500' && formatNaira(0) === '₦0';", fail: "Return \"₦\" + amount." },
          ],
          solution: { "app.js": "function rectangleArea(width, height) {\n  return width * height;\n}\n\nfunction fullName(first, last) {\n  return first + \" \" + last;\n}\n\nfunction formatNaira(amount) {\n  return \"₦\" + amount;\n}\n" },
          hint: "return, not console.log. The caller decides whether to print.",
          successMessage: "Functions that return values can be combined: formatNaira(rectangleArea(4, 5)) is \"₦20\". Printing would have ended the chain.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 16.5 – 16.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l68-scope-arrows",
    moduleId: "wd-m16-functions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.5", "16.6", "16.7"],
    title: "Scope, Function Expressions and Arrow Functions",
    subtitle: "Where variables can be seen, and other ways to write a function",
    estimatedMinutes: 22,
    intro: "Variables do not exist everywhere. Knowing where each one can be seen prevents a whole family of bugs. Then two more ways of writing functions, which you will see constantly in real code.",

    atoms: [
      {
        id: "a-wd-scope",
        title: "Local and global scope",
        explain:
          "A variable's scope is the part of the code that can see it. Variables declared inside a function (or any { } block, with let and const) are local: they exist only inside it, and are created fresh on each call. Variables declared outside every function are global: visible everywhere, and changeable from anywhere, which is why programs keep as few as possible. A function can read variables from the scope around it.",
        codeExercise: {
          language: JS,
          code: "const shop = \"Ada's Shoes\";\n\nfunction receipt() {\n  const total = 9500;\n  console.log(shop + \": \" + total);\n}\n\nreceipt();\nconsole.log(total);\n",
          question: "What happens?",
          expectedOutput: "Ada's Shoes: 9500",
          raises: "ReferenceError: total is not defined",
          hint: "receipt can see shop, which is global. Can the last line see total, which was declared inside receipt?",
          successMessage: "The function sees the global shop, but total exists only inside the function. Outside, it is not defined.",
        },
      },
      {
        id: "a-wd-function-expressions",
        title: "Function expressions",
        explain:
          "A function is a value, like a number or a string, so it can be stored in a variable: const double = function (n) { return n * 2; };. This is a function expression. Unlike a declaration, it cannot be called before the line that defines it. Treating functions as values is what makes callbacks possible.",
        example: "const double = function (n) {\n  return n * 2;\n};\n\nconsole.log(double(21));   // 42\nconst twice = double;      // the same function, under another name\nconsole.log(twice(5));     // 10",
      },
      {
        id: "a-wd-arrow-functions",
        title: "Arrow functions",
        explain:
          "Arrow functions are a shorter function expression: const double = (n) => n * 2;. With one expression after the arrow, its value is returned automatically, with no braces or return. With braces, you need return as usual. They are the standard way to write short callbacks, as in the next lesson.",
        table: {
          caption: "One function, three ways.",
          headers: ["Form", "Code"],
          rows: [
            ["Declaration", "function square(n) { return n * n; }"],
            ["Expression", "const square = function (n) { return n * n; };"],
            ["Arrow", "const square = (n) => n * n;"],
          ],
        },
        webLab: {
          task:
            "Rewrite the three function declarations as arrow functions stored in constants, keeping their names and behaviour: square, isAdult and initials. Each should be a single expression with no return keyword.",
          files: { "app.js": "function square(n) {\n  return n * n;\n}\n\nfunction isAdult(age) {\n  return age >= 18;\n}\n\nfunction initials(first, last) {\n  return first[0] + last[0];\n}\n" },
          tests: [
            { label: "square, isAdult and initials still work", check: "return square(7) === 49 && isAdult(18) === true && isAdult(17) === false && initials('Ngozi', 'Eze') === 'NE';", fail: "Keep the same names and the same results." },
            { label: "All three are arrow functions in constants", check: "const c = code('app.js'); return !/\\bfunction\\b/.test(c) && ['square', 'isAdult', 'initials'].every((n) => new RegExp('const\\\\s+' + n + '\\\\s*=\\\\s*\\\\(?[^)=]*\\\\)?\\\\s*=>').test(c));", fail: "Write each as const name = (params) => expression;" },
            { label: "Each uses the short form with no return", check: "return !/\\breturn\\b/.test(code('app.js'));", fail: "With one expression after =>, leave out the braces and the return." },
          ],
          solution: { "app.js": "const square = (n) => n * n;\n\nconst isAdult = (age) => age >= 18;\n\nconst initials = (first, last) => first[0] + last[0];\n" },
          hint: "function square(n) { return n * n; } becomes const square = (n) => n * n;",
          successMessage: "Three functions, one line each. You will read arrow functions constantly from here on.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 16.8 – 16.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l69-callbacks-pure",
    moduleId: "wd-m16-functions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.8", "16.9", "16.10"],
    title: "Callbacks, Default Parameters and Pure Functions",
    subtitle: "Passing functions to functions, sensible defaults, and code you can trust",
    estimatedMinutes: 24,
    intro: "Three ideas that separate code that works from code that is easy to work with: passing behaviour as an argument, giving parameters defaults, and writing functions that never surprise you.",

    atoms: [
      {
        id: "a-wd-callbacks",
        title: "Callback functions",
        explain:
          "Because functions are values, you can pass one as an argument to another. The function you pass is a callback: the receiving function calls it back when it needs to. This is everywhere in JavaScript: addEventListener(\"click\", handler) calls handler on each click, setTimeout(fn, 1000) calls fn after a second, and array methods such as map and filter (Module 17) call your function on each item.",
        codeExercise: {
          language: JS,
          code: "function applyTwice(fn, value) {\n  return fn(fn(value));\n}\n\nconst addTen = (n) => n + 10;\nconst double = (n) => n * 2;\n\nconsole.log(applyTwice(addTen, 5));\nconsole.log(applyTwice(double, 5));\n",
          question: "What does each call print?",
          expectedOutput: "25\n20",
          hint: "applyTwice calls the function, then calls it again on the result.",
          successMessage: "The same applyTwice did two different jobs, because the job was passed in as a callback.",
        },
      },
      {
        id: "a-wd-default-params",
        title: "Default parameters",
        explain:
          "A default parameter is used when no argument (or undefined) is passed: function priceWithVat(price, rate = 7.5) { … }. Callers can then leave out the common case and still override it. Defaults replace the old pattern of checking for undefined inside the function, and make the function's expectations visible in its first line.",
        example: "function priceWithVat(price, rate = 7.5) {\n  return price + (price * rate) / 100;\n}\n\npriceWithVat(1000);       // 1075, using the default 7.5%\npriceWithVat(1000, 10);   // 1100",
      },
      {
        id: "a-wd-pure-functions",
        title: "Pure functions and side effects",
        explain:
          "A pure function's result depends only on its arguments, and it changes nothing outside itself: same input, same output, every time. A side effect is anything else a function does: changing a global variable or an argument, printing, saving, updating the page. Programs need side effects, but keep them at the edges: do the calculating in pure functions, which are trivial to test, and keep the printing and page updates in a few thin functions that call them.",
        webLab: {
          task:
            "Write three functions. applyToAll(values, fn) returns a NEW array with the callback fn applied to each value, without changing the original. priceWithVat(price, rate) returns the price with VAT added, with rate defaulting to 7.5. withDiscount(prices, percent) is pure: it returns a new array with each price reduced by percent, and must not modify the array it was given.",
          files: { "app.js": "function applyToAll(values, fn) {\n}\n\nfunction priceWithVat(price, rate) {\n}\n\nfunction withDiscount(prices, percent) {\n  for (let i = 0; i < prices.length; i++) {\n    prices[i] = prices[i] - (prices[i] * percent) / 100;\n  }\n  return prices;\n}\n" },
          tests: [
            { label: "applyToAll([1, 2, 3], n => n * 10) returns [10, 20, 30]", check: "return JSON.stringify(applyToAll([1, 2, 3], (n) => n * 10)) === '[10,20,30]';", fail: "Build a new array, pushing fn(value) for each value, and return it." },
            { label: "applyToAll does not change the original array", check: "const a = [1, 2, 3]; applyToAll(a, (n) => n + 1); return JSON.stringify(a) === '[1,2,3]';", fail: "Push results into a new array; never assign into values." },
            { label: "priceWithVat(1000) uses the 7.5% default: 1075", check: "return priceWithVat(1000) === 1075;", fail: "Give rate a default: function priceWithVat(price, rate = 7.5)." },
            { label: "priceWithVat(1000, 10) overrides it: 1100", check: "return priceWithVat(1000, 10) === 1100;", fail: "Return price + price * rate / 100." },
            { label: "withDiscount returns the discounted prices", check: "return JSON.stringify(withDiscount([1000, 2000], 10)) === '[900,1800]';", fail: "Each price should be reduced by the percentage." },
            { label: "withDiscount is pure: the original prices are unchanged", check: "const p = [1000, 2000]; withDiscount(p, 10); return JSON.stringify(p) === '[1000,2000]';", fail: "It is changing the array it was given. Build and return a new array instead." },
          ],
          solution: { "app.js": "function applyToAll(values, fn) {\n  const result = [];\n  for (const value of values) {\n    result.push(fn(value));\n  }\n  return result;\n}\n\nfunction priceWithVat(price, rate = 7.5) {\n  return price + (price * rate) / 100;\n}\n\nfunction withDiscount(prices, percent) {\n  return applyToAll(prices, (p) => p - (p * percent) / 100);\n}\n" },
          hint: "Start an empty array with const result = []; and add to it with result.push(…). Then withDiscount can reuse applyToAll.",
          successMessage: "You just wrote your own version of the built-in map method, and used it to make a pure function out of one that silently changed its input.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 16.11 – 16.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l70-decompose-debug",
    moduleId: "wd-m16-functions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.11", "16.12"],
    title: "Decomposing Problems and Debugging Functions",
    subtitle: "Big problems as small functions, and finding the one that is wrong",
    estimatedMinutes: 24,
    intro: "Professional programs are built from many small functions, each doing one thing. That is not a style preference: it is what makes them possible to test, change and debug.",

    atoms: [
      {
        id: "a-wd-decomposition",
        title: "Decomposing large problems into functions",
        explain:
          "Decomposition is splitting a problem into smaller ones until each is easy. For a receipt: work out the subtotal, apply a discount, add VAT, format the result. Each becomes a function with a clear input and output, and the top-level function reads like the plan: receipt(items) calls subtotal, then discount, then vat, then format. Small functions can be tested one at a time, which is exactly how you find bugs.",
        example:
          "const subtotal = (items) => …;              // [{price, qty}] → number\nconst discount = (amount) => …;             // 10% off above ₦20,000\nconst addVat   = (amount) => …;             // + 7.5%\nconst format   = (amount) => \"₦\" + …;\n\nconst receipt = (items) => format(addVat(discount(subtotal(items))));",
      },
      {
        id: "a-wd-debug-functions",
        title: "Debugging function behavior",
        explain:
          "When a result is wrong, test each small function separately with an input whose answer you can work out by hand. The first one that disagrees with you holds the bug. Inside it, print the inputs and the intermediate values with console.log, or use the debugger (Module 18). Common function bugs: forgetting to return, using the wrong parameter, changing an argument, and getting a boundary such as > versus >= wrong.",
        webLab: {
          task:
            "The receipt is wrong: receipt([{ price: 10000, qty: 3 }]) should be \"₦29025\" (subtotal 30000, 10% off because it is over ₦20,000, giving 27000, plus 7.5% VAT, giving 29025). Two of the four small functions have bugs. Test each one, find them and fix them; receipt itself is correct.",
          files: { "app.js": "// Each item is { price, qty }\nconst subtotal = (items) => {\n  let total = 0;\n  for (const item of items) {\n    total += item.price;\n  }\n  return total;\n};\n\n// 10% off orders over 20000\nconst discount = (amount) => (amount > 20000 ? amount * 0.9 : amount);\n\n// Add 7.5% VAT\nconst addVat = (amount) => amount + amount * 7.5;\n\nconst format = (amount) => \"₦\" + Math.round(amount);\n\nconst receipt = (items) => format(addVat(discount(subtotal(items))));\n\nconsole.log(subtotal([{ price: 10000, qty: 3 }]));\nconsole.log(receipt([{ price: 10000, qty: 3 }]));\n" },
          tests: [
            { label: "subtotal multiplies each price by its quantity", check: "return subtotal([{ price: 10000, qty: 3 }]) === 30000 && subtotal([{ price: 500, qty: 2 }, { price: 100, qty: 1 }]) === 1100;", fail: "subtotal ignores qty: add price * qty for each item." },
            { label: "discount takes 10% off only above ₦20,000", check: "return discount(30000) === 27000 && discount(20000) === 20000;", fail: "discount looks right. Test it on its own: discount(30000) should be 27000." },
            { label: "addVat adds 7.5%: addVat(1000) is 1075", check: "return addVat(1000) === 1075;", fail: "7.5 percent is 0.075 of the amount, not 7.5 times it." },
            { label: "receipt of 3 × ₦10,000 is \"₦29025\"", check: "return receipt([{ price: 10000, qty: 3 }]) === '₦29025';", fail: "Once subtotal and addVat are right, receipt works without changes." },
            { label: "receipt itself was not changed", check: "return /const receipt = \\(items\\) => format\\(addVat\\(discount\\(subtotal\\(items\\)\\)\\)\\)/.test(code('app.js'));", fail: "Fix the small functions, not receipt." },
          ],
          solution: { "app.js": "// Each item is { price, qty }\nconst subtotal = (items) => {\n  let total = 0;\n  for (const item of items) {\n    total += item.price * item.qty;\n  }\n  return total;\n};\n\n// 10% off orders over 20000\nconst discount = (amount) => (amount > 20000 ? amount * 0.9 : amount);\n\n// Add 7.5% VAT\nconst addVat = (amount) => amount + (amount * 7.5) / 100;\n\nconst format = (amount) => \"₦\" + Math.round(amount);\n\nconst receipt = (items) => format(addVat(discount(subtotal(items))));\n\nconsole.log(subtotal([{ price: 10000, qty: 3 }]));\nconsole.log(receipt([{ price: 10000, qty: 3 }]));\n" },
          hint: "The console already shows subtotal's result for the example. Is it 30000? Then test addVat(1000) the same way.",
          successMessage: "You found two bugs by testing four small functions separately, without reading the whole program at once. That is what decomposition buys you.",
        },
      },
    ],

    task: {
      title: "Module project: a receipt generator from pure functions",
      intro: "Build receipt.js on your own computer.",
      prompts: [
        "Write subtotal, discount, addVat and formatNaira as pure functions, each with a default parameter where it makes sense.",
        "Write a receipt(items) function that combines them, and a separate printReceipt(items) that is the only function that uses console.log.",
        "Write applyToAll(values, fn) and use it to produce the price of each line.",
        "Test each function on its own with three inputs you have worked out by hand, including a boundary.",
        "Introduce a bug on purpose in one function and practise finding it by testing the functions one by one.",
      ],
      closing: "Next module: arrays and objects, the data your functions will work on.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
