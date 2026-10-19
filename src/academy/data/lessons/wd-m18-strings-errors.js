/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 18 · STRINGS, NUMBERS AND ERRORS
 *
 * Curriculum 18.1 – 18.12. String methods and template literals; converting,
 * coercing and validating numbers; rounding, precision and maths; dates;
 * the common errors, reading stack traces, and debugging with console.log
 * and breakpoints. Every output quoted here, including the floating-point
 * surprises, is what Node really prints.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s18-strings-errors";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 18.1 – 18.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l76-strings",
    moduleId: "wd-m18-strings-errors",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2"],
    title: "String Methods and Template Literals",
    subtitle: "Cleaning, searching and building text",
    estimatedMinutes: 24,
    intro: "Everything typed into a form arrives as a string, and it arrives messy: extra spaces, odd capitals, mixed formats. This lesson gives you the tools to clean it and to build new text neatly.",

    atoms: [
      {
        id: "a-wd-string-methods",
        title: "String methods",
        explain:
          "Strings have methods that return a NEW string (strings never change in place). trim() removes spaces from both ends; toLowerCase() and toUpperCase() change case; includes(), startsWith() and endsWith() search; slice(start, end) cuts out a part; replaceAll(a, b) replaces; split(separator) breaks a string into an array and join(separator) glues an array back into a string. length is the number of characters.",
        table: {
          caption: "The string methods you will use most.",
          headers: ["Method", "Example", "Result"],
          rows: [
            ["trim()", "\"  Ada  \".trim()", "\"Ada\""],
            ["toUpperCase()", "\"lagos\".toUpperCase()", "\"LAGOS\""],
            ["includes(x)", "\"ada@mail.com\".includes(\"@\")", "true"],
            ["slice(s, e)", "\"Nigeria\".slice(0, 3)", "\"Nig\""],
            ["split(x)", "\"a,b,c\".split(\",\")", "[\"a\", \"b\", \"c\"]"],
            ["replaceAll(a, b)", "\"1,500\".replaceAll(\",\", \"\")", "\"1500\""],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'const raw = "  CHIOMA okafor  ";\nconst clean = raw.trim().toLowerCase();\nconst words = clean.split(" ");\nconsole.log(clean);\nconsole.log(words.length);\nconsole.log(words[1].toUpperCase());\nconsole.log(raw.length);\n',
          question: "What is printed?",
          expectedOutput: "chioma okafor\n2\nOKAFOR\n17",
          hint: "trim removes the two spaces at each end, but raw itself is unchanged.",
          successMessage: "Methods return new strings and can be chained; the original raw string, with its spaces, is untouched.",
        },
      },
      {
        id: "a-wd-template-literals",
        title: "Template literals",
        explain:
          "A template literal is a string in backticks (`) that can include ${expression} placeholders, evaluated and inserted, and can span several lines. They replace long chains of +: `Total: ₦${price * qty}` instead of \"Total: ₦\" + price * qty. Anything inside ${ } is ordinary JavaScript, including function calls and ternaries.",
        webLab: {
          task:
            "Write two text-cleaning functions. tidyName(name) takes a name typed carelessly, such as \"  aDA   obi \", and returns it with extra spaces removed and each word capitalised: \"Ada Obi\". orderLine(item, qty, price) returns a line built with a template literal, such as orderLine(\"Garri\", 2, 3250) → \"2 × Garri = ₦6500\".",
          files: { "app.js": "function tidyName(name) {\n}\n\nfunction orderLine(item, qty, price) {\n}\n\nconsole.log(tidyName(\"  aDA   obi \"));\nconsole.log(orderLine(\"Garri\", 2, 3250));\n" },
          tests: [
            { label: "tidyName(\"  aDA   obi \") is \"Ada Obi\"", check: "return tidyName('  aDA   obi ') === 'Ada Obi';", fail: "trim, lower-case, split on spaces (dropping empty pieces), capitalise each word, join with one space." },
            { label: "tidyName works for one word and three words", check: "return tidyName('musa') === 'Musa' && tidyName('NGOZI ADA  EZE') === 'Ngozi Ada Eze';", fail: "Capitalise the first letter of every word, lower-case the rest." },
            { label: "orderLine(\"Garri\", 2, 3250) is \"2 × Garri = ₦6500\"", check: "return orderLine('Garri', 2, 3250) === '2 × Garri = ₦6500' && orderLine('Rice', 1, 9500) === '1 × Rice = ₦9500';", fail: "Return `${qty} × ${item} = ₦${qty * price}`." },
            { label: "orderLine uses a template literal", check: "return /`[^`]*\\$\\{/.test(raw('app.js'));", fail: "Build the line with backticks and ${ } placeholders." },
          ],
          solution: { "app.js": "function tidyName(name) {\n  return name\n    .trim()\n    .toLowerCase()\n    .split(\" \")\n    .filter((word) => word !== \"\")\n    .map((word) => word[0].toUpperCase() + word.slice(1))\n    .join(\" \");\n}\n\nfunction orderLine(item, qty, price) {\n  return `${qty} × ${item} = ₦${qty * price}`;\n}\n\nconsole.log(tidyName(\"  aDA   obi \"));\nconsole.log(orderLine(\"Garri\", 2, 3250));\n" },
          hint: "Splitting \"ada   obi\" on a single space gives empty strings between the words: filter them out.",
          successMessage: "A chain of six string and array methods turned careless typing into a proper name. Every sign-up form needs something like it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 18.3 – 18.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l77-numbers",
    moduleId: "wd-m18-strings-errors",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.3", "18.4", "18.5"],
    title: "Number Conversion, Coercion and NaN",
    subtitle: "Turning text into numbers, and knowing when it failed",
    estimatedMinutes: 24,
    intro: "A price typed into a form is the string \"2500\", not the number 2500, and adding to it joins text instead of adding. Converting properly, and checking whether the conversion worked, prevents some of the most common bugs on the web.",

    atoms: [
      {
        id: "a-wd-number-conversion",
        title: "Number conversion",
        explain:
          "Number(value) converts a whole string to a number, and gives NaN if any of it is not numeric: Number(\"12.5\") is 12.5, Number(\"12px\") is NaN, and Number(\"\") is 0, a trap. parseInt(\"12px\", 10) and parseFloat(\"12.5kg\") read as much of the start as they can and ignore the rest. String(n) and n.toString() go the other way.",
        codeExercise: {
          language: JS,
          code: 'console.log(Number("2500"));\nconsole.log(Number("2,500"));\nconsole.log(parseInt("40px", 10));\nconsole.log(parseFloat("3.5kg"));\nconsole.log(Number(""));\n',
          question: "What does each conversion give?",
          expectedOutput: "2500\nNaN\n40\n3.5\n0",
          hint: "Number needs the whole string to be numeric; the comma is not. parseInt and parseFloat stop at the first character that does not fit.",
          successMessage: "And Number(\"\") is 0, not NaN: an empty form field silently becomes zero unless you check for it.",
        },
      },
      {
        id: "a-wd-coercion",
        title: "Type coercion",
        explain:
          "Coercion is JavaScript converting a type automatically. + with a string converts the other side to a string and joins; - * and / convert strings to numbers. So \"5\" + 2 is \"52\" but \"5\" - 2 is 3. == coerces before comparing, which is why you use ===. Do not rely on coercion: convert explicitly with Number() as soon as input arrives.",
        codeExercise: {
          language: JS,
          code: 'console.log("5" + 2);\nconsole.log("5" - 2);\nconsole.log("5" * "2");\nconsole.log(true + 1);\nconsole.log("10" == 10, "10" === 10);\n',
          question: "What does each line print?",
          expectedOutput: "52\n3\n10\n2\ntrue false",
          hint: "+ joins when a string is involved; the other operators convert to numbers. true becomes 1.",
          successMessage: "This is why form totals sometimes show 5002 instead of 502. Convert first, then calculate.",
        },
      },
      {
        id: "a-wd-nan",
        title: "NaN and numeric validation",
        explain:
          "NaN (Not a Number) is the number type's way of saying a calculation or conversion failed. It spreads: anything + NaN is NaN. And NaN === NaN is false, so you cannot test for it with ===; use Number.isNaN(x), or Number.isFinite(x), which is false for NaN and Infinity alike and is the best single check that a value is a real, usable number.",
        webLab: {
          task:
            "Prices arrive from a form as text in many formats. Write parsePrice(text) that strips spaces, a ₦ sign and thousands commas, converts what is left to a number, and returns it; if the result is not a finite number, or the text was empty, return null. So \"₦2,500\" → 2500, \" 1500.50 \" → 1500.5, \"abc\" → null, \"\" → null.",
          files: { "app.js": "function parsePrice(text) {\n}\n\nconsole.log(parsePrice(\"₦2,500\"));\n" },
          tests: [
            { label: "\"₦2,500\" gives 2500, as a number", check: "return parsePrice('₦2,500') === 2500;", fail: "Remove ₦ and commas with replaceAll, then Number()." },
            { label: "\" 1500.50 \" gives 1500.5 and \"0\" gives 0", check: "return parsePrice(' 1500.50 ') === 1500.5 && parsePrice('0') === 0;", fail: "trim the text before converting; a real 0 is a valid price." },
            { label: "Text that is not a number gives null", check: "return parsePrice('abc') === null && parsePrice('12kg') === null;", fail: "If Number.isFinite(result) is false, return null." },
            { label: "An empty or blank field gives null, not 0", check: "return parsePrice('') === null && parsePrice('   ') === null;", fail: "Number(\"\") is 0. Check for an empty string after trimming and return null." },
          ],
          solution: { "app.js": "function parsePrice(text) {\n  const cleaned = text.trim().replaceAll(\"₦\", \"\").replaceAll(\",\", \"\").trim();\n  if (cleaned === \"\") return null;\n  const value = Number(cleaned);\n  return Number.isFinite(value) ? value : null;\n}\n\nconsole.log(parsePrice(\"₦2,500\"));\n" },
          hint: "Clean, check for empty, convert, then check with Number.isFinite.",
          successMessage: "A converter that never lets text, NaN or a blank field pretend to be a price. Module 22 uses exactly this in form validation.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 18.6 – 18.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l78-maths-dates",
    moduleId: "wd-m18-strings-errors",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.6", "18.7", "18.8"],
    title: "Rounding, Maths and Dates",
    subtitle: "Why 0.1 + 0.2 is not 0.3, the Math object, and working with dates",
    estimatedMinutes: 26,
    intro: "Money and time are in almost every application, and both have traps. This lesson shows the traps and the standard ways around them.",

    atoms: [
      {
        id: "a-wd-rounding",
        title: "Rounding and precision",
        explain:
          "JavaScript numbers are binary floating point, which cannot store most decimals exactly: 0.1 + 0.2 is 0.30000000000000004. Round only when displaying: Math.round(x) to the nearest whole number, toFixed(2) to a string with two decimals. For money, the safest habit is to work in the smallest unit (kobo, cents) as whole numbers and divide only to display.",
        codeExercise: {
          language: JS,
          code: "console.log(0.1 + 0.2);\nconsole.log(0.1 + 0.2 === 0.3);\nconsole.log((0.1 + 0.2).toFixed(2));\nconsole.log(Math.round(2.5), Math.round(2.4));\nconsole.log((10 + 20) / 100);\n",
          question: "What does each line print?",
          expectedOutput: "0.30000000000000004\nfalse\n0.30\n3 2\n0.3",
          hint: "Floating point cannot store 0.1 exactly. The last line adds whole numbers (kobo) first.",
          successMessage: "Adding 10 and 20 kobo as whole numbers, then dividing, gives a clean 0.3. Whole numbers are exact; decimals are approximations.",
        },
      },
      {
        id: "a-wd-maths",
        title: "Basic mathematical operations",
        explain:
          "The Math object holds the maths functions: Math.round, Math.floor (down) and Math.ceil (up); Math.min and Math.max (with spread for arrays: Math.max(...scores)); Math.abs for the size of a difference; Math.sqrt and Math.pow (or **); and Math.random(), a number from 0 up to but not including 1, which Math.floor(Math.random() * 6) + 1 turns into a dice roll.",
        table: {
          caption: "Math methods.",
          headers: ["Call", "Result", "Use"],
          rows: [
            ["Math.floor(4.9)", "4", "Whole pages, full boxes"],
            ["Math.ceil(4.1)", "5", "Boxes needed for 41 items, 10 per box (Math.ceil(41 / 10))"],
            ["Math.max(...[3, 9, 2])", "9", "The highest score"],
            ["Math.abs(-15)", "15", "How far apart two values are"],
            ["Math.floor(Math.random() * 6) + 1", "1 to 6", "A dice roll"],
          ],
        },
      },
      {
        id: "a-wd-dates",
        title: "Date and time fundamentals",
        explain:
          "new Date() is now; new Date(\"2026-03-14\") is a specific date (an ISO date string like this is read as midnight UTC). getFullYear(), getMonth() (0 for January, a classic trap), getDate() and getDay() (0 for Sunday) read its parts. Internally a date is a number of milliseconds, so subtracting two dates gives milliseconds between them: divide by 1000 × 60 × 60 × 24 for days. To display dates for people, use toLocaleDateString with a locale and options.",
        webLab: {
          task:
            "Write three functions. splitBill(total, people) returns each person's share rounded UP to the nearest naira, so nobody is short (splitBill(10000, 3) is 3334). boxesNeeded(items, perBox) returns how many boxes are needed (boxesNeeded(41, 10) is 5). daysBetween(start, end) takes two ISO date strings and returns the whole number of days between them (daysBetween(\"2026-03-01\", \"2026-03-15\") is 14).",
          files: { "app.js": "function splitBill(total, people) {\n}\n\nfunction boxesNeeded(items, perBox) {\n}\n\nfunction daysBetween(start, end) {\n}\n" },
          tests: [
            { label: "splitBill(10000, 3) is 3334 and splitBill(9000, 3) is 3000", check: "return splitBill(10000, 3) === 3334 && splitBill(9000, 3) === 3000;", fail: "Use Math.ceil(total / people)." },
            { label: "boxesNeeded(41, 10) is 5 and boxesNeeded(40, 10) is 4", check: "return boxesNeeded(41, 10) === 5 && boxesNeeded(40, 10) === 4;", fail: "Use Math.ceil: a part-full box is still a box." },
            { label: "daysBetween(\"2026-03-01\", \"2026-03-15\") is 14", check: "return daysBetween('2026-03-01', '2026-03-15') === 14;", fail: "Subtract the two Dates and divide by 86,400,000 (milliseconds in a day)." },
            { label: "daysBetween crosses months: \"2026-01-30\" to \"2026-02-02\" is 3", check: "return daysBetween('2026-01-30', '2026-02-02') === 3;", fail: "Date arithmetic handles month lengths for you; just subtract and divide." },
          ],
          solution: { "app.js": "function splitBill(total, people) {\n  return Math.ceil(total / people);\n}\n\nfunction boxesNeeded(items, perBox) {\n  return Math.ceil(items / perBox);\n}\n\nfunction daysBetween(start, end) {\n  const ms = new Date(end) - new Date(start);\n  return Math.round(ms / (1000 * 60 * 60 * 24));\n}\n" },
          hint: "Math.ceil rounds up. Two Date objects subtracted give milliseconds.",
          successMessage: "Rounding chosen on purpose (up, for bills and boxes) and dates handled as numbers of milliseconds: two of the most common real-world calculations.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 18.9 – 18.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l79-errors-debugging",
    moduleId: "wd-m18-strings-errors",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["18.9", "18.10", "18.11", "18.12"],
    title: "Errors, Stack Traces and Debugging",
    subtitle: "Reading what went wrong, and finding where",
    estimatedMinutes: 26,
    intro: "Every programmer spends a large part of every day debugging. The difference between a beginner and a professional is not how few bugs they write, but how quickly they find them. That speed is a learnable method.",

    atoms: [
      {
        id: "a-wd-common-errors",
        title: "Common JavaScript errors",
        explain:
          "Each error has a type that tells you what kind of mistake it is. Read the type first, then the message, then the line number. You can also handle errors you expect with try...catch, so one bad input does not stop the whole program.",
        table: {
          caption: "The errors you will see most.",
          headers: ["Error", "Means", "Typical cause"],
          rows: [
            ["SyntaxError", "The code is not valid JavaScript", "A missing bracket, quote or comma"],
            ["ReferenceError: x is not defined", "No variable called x exists here", "A typo, or a variable out of scope"],
            ["TypeError: Cannot read properties of undefined", "You used . on something that is undefined", "A missing property or element earlier in a path"],
            ["TypeError: x is not a function", "You called something that is not a function", "A typo in a method name, or the wrong variable"],
            ["RangeError", "A value is outside what is allowed", "A negative array length, endless recursion"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'const user = { name: "Ada" };\nconsole.log(user.name.toUpperCase());\nconsole.log(user.email);\nconsole.log(user.email.toUpperCase());\n',
          question: "What is printed before the program stops, and what is the error?",
          expectedOutput: "ADA\nundefined",
          raises: "TypeError: Cannot read properties of undefined (reading 'toUpperCase')",
          hint: "Reading a missing property gives undefined. Calling a method on undefined is the error.",
          successMessage: "The message names the property it tried to read on undefined, which tells you exactly which step of the path failed.",
        },
      },
      {
        id: "a-wd-stack-traces",
        title: "Reading stack traces",
        explain:
          "When an error happens inside a function called by another function, the console shows a stack trace: the error message, then a list of \"at\" lines from where it happened back to where it all started. The top line is where the error was thrown; lines below are the chain of calls that led there. Click a file name and line number to jump to it. Start at the top, but the bug is often in a line further down that passed in a bad value.",
        example:
          "Uncaught TypeError: Cannot read properties of undefined (reading 'price')\n    at lineTotal (app.js:2:22)      ← where it broke\n    at subtotal (app.js:6:20)       ← who called lineTotal\n    at checkout (app.js:10:15)      ← who called subtotal\n    at HTMLButtonElement.<anonymous> (app.js:14:3)   ← the click that started it",
      },
      {
        id: "a-wd-console-debugging",
        title: "Debugging with console.log()",
        explain:
          "When a result is wrong but nothing throws, make the program show its working: print the inputs at the start of a function, the intermediate values, and the result. Label every log (console.log(\"subtotal\", subtotal)) so you know which is which. console.table(arrayOfObjects) shows data as a table. Remove the logs once the bug is fixed.",
      },
      {
        id: "a-wd-breakpoints",
        title: "Using breakpoints and stepping through code",
        explain:
          "A breakpoint pauses the program on a line so you can inspect every variable at that moment. In Chrome or Edge, open DevTools → Sources, open your file, and click a line number; or write the statement debugger; in your code. When it pauses, hover over variables to see their values, then Step over (F10) to run one line at a time, Step into (F11) to go inside a function call, and Resume (F8) to continue. It shows everything console.log would, without editing the code.",
        webLab: {
          task:
            "averageScore(students) should return the class average, ignoring students with no score (score is null), rounded to one decimal place. For the class below it should be 71.7, but it returns a wrong number. Add console.log lines to see what the loop is adding and counting, find the two bugs, and fix them.",
          files: { "app.js": "const students = [\n  { name: \"Ada\", score: 72 },\n  { name: \"Bayo\", score: null },\n  { name: \"Chika\", score: 88 },\n  { name: \"Dapo\", score: 55 },\n];\n\nfunction averageScore(students) {\n  let total = 0;\n  let count = 0;\n  for (const s of students) {\n    total += s.score;\n    count++;\n  }\n  return Math.round((total / count) * 10) / 10;\n}\n\nconsole.log(averageScore(students));\n" },
          tests: [
            { label: "averageScore of the class is 71.7", check: "return averageScore(students) === 71.7;", fail: "(72 + 88 + 55) / 3 = 71.666…, rounded to 71.7. Bayo has no score and must not be counted." },
            { label: "Students with no score are not counted", check: "return averageScore([{ score: 50 }, { score: null }]) === 50;", fail: "Skip a student whose score is null: do not add it, and do not count it." },
            { label: "An empty class gives 0, not NaN", check: "return averageScore([]) === 0 && averageScore([{ score: null }]) === 0;", fail: "If count is 0, return 0 instead of dividing by zero." },
          ],
          solution: { "app.js": "const students = [\n  { name: \"Ada\", score: 72 },\n  { name: \"Bayo\", score: null },\n  { name: \"Chika\", score: 88 },\n  { name: \"Dapo\", score: 55 },\n];\n\nfunction averageScore(students) {\n  let total = 0;\n  let count = 0;\n  for (const s of students) {\n    if (s.score === null) continue;\n    total += s.score;\n    count++;\n  }\n  if (count === 0) return 0;\n  return Math.round((total / count) * 10) / 10;\n}\n\nconsole.log(averageScore(students));\n" },
          hint: "Log total and count after the loop. null adds as 0 but is still counted, and an empty class divides 0 by 0.",
          successMessage: "Two bugs found by making the loop show its working. On your own computer, try the same thing with a breakpoint on the total += line and step through each student.",
        },
      },
    ],

    task: {
      title: "Module project: a text-and-number cleaner",
      intro: "Write cleaner.js for messy data typed into a shop's order form.",
      prompts: [
        "tidyName for customer names, and a phone formatter that keeps only digits and checks for 11.",
        "parsePrice for prices in formats such as \"₦2,500\", \"2500.00\" and \" 2 500 \", returning null when it cannot.",
        "A report function that works in kobo internally and prints totals with toFixed(2).",
        "A days-until-delivery function using Date.",
        "Run all of it over an array of ten messy orders; use console.table to show the results and list every value that could not be read. Debug one problem with a breakpoint.",
      ],
      closing: "Next module: putting it all together to solve problems you have not seen before.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
