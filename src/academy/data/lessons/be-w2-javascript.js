/**
 * BACKEND ENGINEERING · WEEK 2 · JAVASCRIPT FUNDAMENTALS
 *
 * Curriculum 2.1 – 2.P. Values, types and operators; conditions and loops;
 * functions and scope; arrays, objects and their methods; destructuring,
 * spread and template literals; modules; debugging; four exercises on
 * student and job-candidate records; and a command-line application.
 *
 * Two kinds of practice. Predict-the-output exercises (codeExercise) whose
 * answers real Node.js prints at build time. And labs (nodeLab) where the
 * learner writes functions in a real project; the checks import the
 * learner's module and call the functions directly, as tests would.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { JS, decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s2-javascript";
const MODULE = "be-w2-javascript";

const PKG = pkg({ name: "academy-records", scripts: { start: "node index.js" } });

/* ── Data the week's labs share ─────────────────────────────────────── */

const STUDENTS = `export const students = [
  { id: 1, name: "Ada Obi", course: "Backend Engineering", scores: [78, 85, 92], lessonsDone: 21, lessonsTotal: 140 },
  { id: 2, name: "Bayo Adeyemi", course: "Backend Engineering", scores: [55, 61, 48], lessonsDone: 140, lessonsTotal: 140 },
  { id: 3, name: "Chiamaka Eze", course: "Relational Databases", scores: [91, 88, 95], lessonsDone: 63, lessonsTotal: 97 },
  { id: 4, name: "Dayo Bello", course: "Relational Databases", scores: [], lessonsDone: 0, lessonsTotal: 97 },
];
`;

const JOBS = `export const jobs = [
  { id: 101, title: "Junior Backend Developer", company: "PayWave", location: "Lagos", type: "full-time", skills: ["node", "sql", "git"], open: true },
  { id: 102, title: "API Engineer", company: "Shoplink", location: "Remote", type: "contract", skills: ["node", "express", "postgresql"], open: true },
  { id: 103, title: "Data Analyst", company: "Agrotrack", location: "Abuja", type: "full-time", skills: ["sql", "python"], open: true },
  { id: 104, title: "Backend Intern", company: "PayWave", location: "Lagos", type: "internship", skills: ["javascript", "git"], open: false },
  { id: 105, title: "Platform Engineer", company: "Cloudnaija", location: "Remote", type: "full-time", skills: ["docker", "node", "linux"], open: true },
];
`;

const CANDIDATES = `export const candidates = [
  { name: "Ada Obi", projects: [{ title: "Course API", stars: 12, tests: true, deployed: true }, { title: "Notes CLI", stars: 3, tests: false, deployed: false }], certifications: ["BE-101"] },
  { name: "Bayo Adeyemi", projects: [{ title: "Shop API", stars: 30, tests: true, deployed: false }], certifications: [] },
  { name: "Chiamaka Eze", projects: [], certifications: ["DB-101", "BE-101"] },
];
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.1 – 2.2 · VALUES, TYPES AND OPERATORS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l8-values",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2"],
    title: "Values, Types and Operators",
    subtitle: "Variables, constants, strings, numbers, booleans, null and undefined",
    estimatedMinutes: 55,
    intro:
      "Your backend will be written in JavaScript, the language Node.js runs. Everything a program does, it does to VALUES. This lesson is about what values there are, how to name them, and how operators combine them, including the surprises that catch backend developers out.",
    atoms: [
      {
        id: "a-be-variables",
        title: "Variables and constants",
        explain:
          "A VARIABLE is a name for a value. const declares a name that will always refer to the same value; let declares one you intend to reassign. Use const by default and let only when the value must change (a running total, a loop counter); avoid the old var. Names should say what the value is: totalScore, not t. A const holding an object can still have the object's contents changed: const fixes the name, not the object. Assigning to a const is an error, caught immediately.",
        code: {
          language: JS,
          code: 'const courseTitle = "Backend Engineering";\nlet lessonsDone = 20;\nlessonsDone = lessonsDone + 1;\nconsole.log(courseTitle, lessonsDone);\n\nconst student = { name: "Ada" };\nstudent.name = "Ada Obi";\nconsole.log(student.name);\n',
          expectedOutput: "Backend Engineering 21\nAda Obi",
        },
        codeExercise: {
          language: JS,
          code: 'let seats = 30;\nconst enrolled = 28;\nseats = seats - enrolled;\nconsole.log("Seats left:", seats);\nseats = seats - 2;\nconsole.log("Seats left:", seats);\n',
          question: "What does this print?",
          expectedOutput: "Seats left: 2\nSeats left: 0",
          hint: "seats starts at 30. After the first subtraction it holds 30 − 28. The second line subtracts 2 more.",
          successMessage: "let lets seats change as the program runs; enrolled never changes, so it is a const.",
        },
      },
      {
        id: "a-be-types",
        title: "Strings, numbers and booleans",
        explain:
          "JavaScript has a handful of primitive types. STRINGS are text, in quotes: \"Ada\", 'Lagos', or backticks (Lesson 12). NUMBERS are one type for integers and decimals alike, stored as binary floating point, so 0.1 + 0.2 is 0.30000000000000004: never store money as a float; use whole units such as kobo or cents (5000000 kobo, not 50000.00 naira). BOOLEANS are true and false. typeof tells you a value's type. Values from the outside world (a form, a URL, a file) arrive as strings: \"5\" + 1 is \"51\", because + joins strings; Number(\"5\") converts first.",
        codeExercise: {
          language: JS,
          code: 'const fromForm = "5";\nconsole.log(fromForm + 1);\nconsole.log(Number(fromForm) + 1);\nconsole.log(typeof fromForm, typeof Number(fromForm));\nconsole.log(0.1 + 0.2 === 0.3);\n',
          question: "Values from a form arrive as strings. What does this print?",
          expectedOutput: "51\n6\nstring number\nfalse",
          hint: "With a string on either side, + joins text. Number() converts first. And 0.1 + 0.2 is not exactly 0.3 in floating point.",
          successMessage: "\"51\" is a classic bug in totals built from form input. Convert with Number() as soon as input arrives (Week 7 validates it properly).",
        },
      },
      {
        id: "a-be-operators",
        title: "Operators and comparisons",
        explain:
          "Arithmetic operators: + - * / and % (remainder) and ** (power). Comparison: < > <= >=, and for equality always use === and !== (strict: same type and value). The loose == converts types first, so 0 == \"\" is true, which is how bugs hide. Logical operators combine conditions: && (and), || (or), ! (not). They also pick values: a || b gives b when a is falsy (false, 0, \"\", null, undefined, NaN), while a ?? b gives b only when a is null or undefined, so a real 0 survives. That difference matters for settings like a discount of 0.",
        codeExercise: {
          language: JS,
          code: 'const discountFromSettings = 0;\nconsole.log(discountFromSettings || 10);\nconsole.log(discountFromSettings ?? 10);\nconsole.log(7 % 3, 2 ** 3);\nconsole.log("1" == 1, "1" === 1);\n',
          question: "A course has a deliberate discount of 0. What does this print?",
          expectedOutput: "10\n0\n1 8\ntrue false",
          hint: "|| treats 0 as falsy and falls back to 10; ?? only falls back for null or undefined. === also compares types.",
          successMessage: "With ||, the free discount of 0 silently became 10. Use ?? for defaults when 0, \"\" or false are valid values.",
        },
      },
      {
        id: "a-be-null-undefined",
        title: "null, undefined and missing data",
        explain:
          "Two values mean 'nothing'. undefined is what JavaScript gives you when something was never set: a missing property, a missing argument, a function with no return. null is a value you set on purpose to say 'no value', and it is what databases return for an empty column (Week 9). Reading a property of either throws TypeError: Cannot read properties of undefined. Optional chaining (?.) stops and gives undefined instead: student.address?.city. Backends deal with missing data constantly, so handle it deliberately.",
        nodeLab: {
          task:
            "In students.js, finish describeStudent(student): it returns \"<name> (<city>)\", for example \"Ada Obi (Lagos)\". When the student has no address, or the address has no city, return \"<name> (city unknown)\". It must never throw. index.js calls it for three students; run it to see.",
          files: {
            "package.json": PKG,
            "students.js": 'export function describeStudent(student) {\n  // Return "<name> (<city>)", or "<name> (city unknown)" when there is no city.\n  return student.name + " (" + student.address.city + ")";\n}\n',
            "index.js": 'import { describeStudent } from "./students.js";\n\nconsole.log(describeStudent({ name: "Ada Obi", address: { city: "Lagos" } }));\nconsole.log(describeStudent({ name: "Bayo Adeyemi", address: {} }));\nconsole.log(describeStudent({ name: "Chiamaka Eze", address: null }));\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "students.js",
          solution: {
            "students.js": 'export function describeStudent(student) {\n  const city = student.address?.city ?? "city unknown";\n  return student.name + " (" + city + ")";\n}\n',
          },
          tests: [
            { label: "Ada Obi with a city prints Ada Obi (Lagos)", check: `const { describeStudent } = await load("students.js"); eq(describeStudent({ name: "Ada Obi", address: { city: "Lagos" } }), "Ada Obi (Lagos)", "describeStudent with a city");` },
            { label: "A missing city gives (city unknown)", check: `const { describeStudent } = await load("students.js"); let r; try { r = describeStudent({ name: "Bayo", address: {} }); } catch (e) { fail("describeStudent threw " + e.message + " for a student whose address has no city"); } eq(r, "Bayo (city unknown)", "an address without a city");` },
            { label: "A null address does not throw", check: `const { describeStudent } = await load("students.js"); let r; try { r = describeStudent({ name: "Chiamaka", address: null }); } catch (e) { fail("describeStudent threw " + e.message + " when the address is null"); } eq(r, "Chiamaka (city unknown)", "a null address");` },
            { label: "index.js runs to the end", check: `assert(exitCode() === 0, "node index.js crashed:\\n" + output());` },
          ],
          hint: 'student.address?.city reads the city or gives undefined; ?? "city unknown" replaces undefined (and null).',
          successMessage: "Optional chaining and ?? together: the most common way backend code survives incomplete records. The original version crashed on the second student.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.3 · CONDITIONS AND LOOPS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l9-control",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.3"],
    title: "Conditions and Loops",
    subtitle: "Making decisions and repeating work",
    estimatedMinutes: 50,
    intro: "Programs decide (is this score a pass?) and repeat (for every student…). These two ideas, with the right exits, cover most of the logic you will write.",
    atoms: [
      {
        id: "a-be-conditions",
        title: "if, else and switch",
        explain:
          "if runs a block when a condition is true; else if tests the next condition only when the earlier ones failed; else catches the rest. Order matters: test the most specific case first, because the first true branch wins and the rest are skipped. The conditional operator condition ? a : b picks between two values in one expression. switch compares one value against several cases with ===; each case needs a break (or return) or it falls through into the next. Many backends prefer an early return: handle the special case and leave, so the main logic is not nested.",
        codeExercise: {
          language: JS,
          code: 'function status(score) {\n  if (score >= 50) return "pass";\n  else if (score >= 70) return "distinction";\n  else return "fail";\n}\n\nconsole.log(status(85));\nconsole.log(status(60));\nconsole.log(status(30));\n',
          question: "This function has a bug in the order of its conditions. What does it print?",
          expectedOutput: "pass\npass\nfail",
          hint: "85 >= 50 is true, so the first branch returns before 85 >= 70 is ever tested.",
          successMessage: "Nobody ever gets a distinction: the broader condition comes first and wins. Test the most specific case first: >= 70 before >= 50.",
        },
      },
      {
        id: "a-be-loops",
        title: "for, for…of and while",
        explain:
          "for (let i = 0; i < n; i++) counts. for (const item of list) walks through every item of an array (or string, or Map) and is the clearest way to visit a list. while (condition) repeats until the condition is false: useful when you do not know how many times (retrying until success, reading until the end). break leaves a loop early; continue skips to the next round. A loop whose condition never becomes false never ends, and freezes a Node.js server (Week 20 shows why).",
        codeExercise: {
          language: JS,
          code: "const scores = [78, 55, 92, 40, 61];\nlet passed = 0;\nfor (const s of scores) {\n  if (s < 50) continue;\n  passed++;\n  if (s > 90) break;\n}\nconsole.log(passed);\n",
          question: "Trace the loop. What is printed?",
          expectedOutput: "3",
          hint: "78: passed 1. 55: passed 2. 92: passed 3, and 92 > 90 breaks out before 40 and 61 are seen.",
          successMessage: "break stopped the loop at 92, so 61 was never counted. break and continue are powerful and easy to misread: trace them line by line.",
        },
      },
      {
        id: "a-be-grade-letter",
        title: "Write the decision",
        explain:
          "Now write a decision of your own. Academy grades follow a scale: 70 and above is A, 60–69 B, 50–59 C, 45–49 D, below 45 F. Scores outside 0–100 are invalid: a backend must refuse them, not guess. Throwing an Error is how a JavaScript function refuses: throw new Error(\"message\") stops the function and hands the problem to the caller.",
        nodeLab: {
          task:
            "In grades.js, write letterGrade(score): 70–100 → \"A\", 60–69 → \"B\", 50–59 → \"C\", 45–49 → \"D\", 0–44 → \"F\". If the score is below 0 or above 100, throw new Error(\"Score must be between 0 and 100\"). Run index.js to try it.",
          files: {
            "package.json": PKG,
            "grades.js": "export function letterGrade(score) {\n  // 70+ A, 60+ B, 50+ C, 45+ D, otherwise F.\n  // Scores below 0 or above 100: throw new Error(\"Score must be between 0 and 100\")\n}\n",
            "index.js": 'import { letterGrade } from "./grades.js";\n\nfor (const score of [92, 70, 69, 55, 47, 12]) {\n  console.log(score, letterGrade(score));\n}\n\ntry {\n  letterGrade(105);\n} catch (err) {\n  console.log("Refused:", err.message);\n}\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "grades.js",
          solution: {
            "grades.js": 'export function letterGrade(score) {\n  if (score < 0 || score > 100) throw new Error("Score must be between 0 and 100");\n  if (score >= 70) return "A";\n  if (score >= 60) return "B";\n  if (score >= 50) return "C";\n  if (score >= 45) return "D";\n  return "F";\n}\n',
          },
          tests: [
            { label: "92 → A, 70 → A, 69 → B", check: `const { letterGrade } = await load("grades.js"); eq(letterGrade(92), "A", "letterGrade(92)"); eq(letterGrade(70), "A", "letterGrade(70): 70 is an A"); eq(letterGrade(69), "B", "letterGrade(69)");` },
            { label: "60 → B, 59 → C, 50 → C", check: `const { letterGrade } = await load("grades.js"); eq(letterGrade(60), "B", "letterGrade(60)"); eq(letterGrade(59), "C", "letterGrade(59)"); eq(letterGrade(50), "C", "letterGrade(50)");` },
            { label: "49 → D, 45 → D, 44 → F, 0 → F", check: `const { letterGrade } = await load("grades.js"); eq(letterGrade(49), "D", "letterGrade(49)"); eq(letterGrade(45), "D", "letterGrade(45)"); eq(letterGrade(44), "F", "letterGrade(44)"); eq(letterGrade(0), "F", "letterGrade(0)");` },
            { label: "-1 and 101 are refused with the error message", check: `const { letterGrade } = await load("grades.js"); for (const bad of [-1, 101]) { let threw = null; try { letterGrade(bad); } catch (e) { threw = e; } assert(threw, "letterGrade(" + bad + ") should throw"); eq(threw.message, "Score must be between 0 and 100", "the error message"); }` },
          ],
          hint: "Check the invalid range first and throw. Then test from the top: if (score >= 70) return \"A\"; if (score >= 60) return \"B\"; … return \"F\".",
          successMessage: "Boundaries are where bugs live: 69, 70, 49 and 45 are exactly the cases the checks tested. You will write tests like these yourself in Week 15.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 2.4 · FUNCTIONS AND SCOPE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l10-functions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.4"],
    title: "Functions, Parameters, Return Values and Scope",
    subtitle: "Naming a piece of work so it can be reused and trusted",
    estimatedMinutes: 50,
    intro: "A function is a named, reusable piece of work with inputs (parameters) and an output (its return value). Backends are made of them: one per validation rule, calculation and query.",
    atoms: [
      {
        id: "a-be-functions",
        title: "Parameters and return values",
        explain:
          "function average(scores) { … } declares a function with one PARAMETER. Calling average([70, 80]) passes an ARGUMENT, and the function's return value is the result of the call. A function that does not return gives undefined. Parameters can have defaults: function percent(done, total = 140). Arrow functions are a shorter form: const double = (n) => n * 2; with a single expression, the value is returned without the word return. Return values, do not print them: let the caller decide what to do with the result.",
        codeExercise: {
          language: JS,
          code: "function percent(done, total = 140) {\n  return Math.round((done / total) * 100);\n}\nconst logPercent = (done, total) => {\n  console.log(percent(done, total));\n};\n\nconsole.log(percent(21));\nconsole.log(percent(63, 97));\nconst result = logPercent(70);\nconsole.log(result);\n",
          question: "What does this print, line by line?",
          expectedOutput: "15\n65\n50\nundefined",
          hint: "percent(21) uses the default total 140: 21/140 = 0.15. logPercent prints 50 itself (70 of the default 140) but returns nothing.",
          successMessage: "logPercent printed and returned undefined, so result is useless to the caller. Return values; print at the edge of the program.",
        },
      },
      {
        id: "a-be-scope",
        title: "Scope",
        explain:
          "SCOPE is where a name exists. A const or let declared inside a block { … } exists only inside that block; a parameter exists only inside its function. Inner code can read names from outer scopes, not the other way round. Two functions can each have their own total without colliding. A name declared at the top of a module is shared by every function in that file: handy for configuration, dangerous for data that changes, because every request to a server would share it (Week 7). Referring to a name that does not exist in any enclosing scope throws ReferenceError: x is not defined.",
        codeExercise: {
          language: JS,
          code: 'const label = "outer";\nfunction show() {\n  const label = "inner";\n  if (true) {\n    const label = "block";\n    console.log(label);\n  }\n  console.log(label);\n}\nshow();\nconsole.log(label);\n',
          question: "Three variables are all called label. What does this print?",
          expectedOutput: "block\ninner\nouter",
          hint: "Each console.log sees the nearest label: the block's, then the function's, then the module's.",
          successMessage: "Each scope has its own label; the innermost one wins where it is visible. Reusing a name this way is legal but confusing: prefer distinct names.",
        },
      },
      {
        id: "a-be-functions-lab",
        title: "Write small, pure functions",
        explain:
          "A PURE function's result depends only on its arguments, and it changes nothing outside itself. Pure functions are the easiest code to understand, reuse and test: you can check them with a handful of inputs, as the checks below do. Backends keep business rules (prices, grades, eligibility) in pure functions and keep the messy parts (requests, databases, files) at the edges.",
        nodeLab: {
          task:
            "In fees.js write two pure functions. courseFee(weeks, perWeek = 5000) returns weeks × perWeek in naira. discounted(amount, percent) returns the amount after a percentage discount, rounded to the nearest naira with Math.round; a percent below 0 or above 100 throws new Error(\"Invalid discount\"). Do not print anything inside them.",
          files: {
            "package.json": PKG,
            "fees.js": "export function courseFee(weeks, perWeek = 5000) {\n}\n\nexport function discounted(amount, percent) {\n}\n",
            "index.js": 'import { courseFee, discounted } from "./fees.js";\n\nconst fee = courseFee(24);\nconsole.log("Backend Engineering:", fee);\nconsole.log("With 15% off:", discounted(fee, 15));\nconsole.log("Relational Databases at 4500/week:", courseFee(16, 4500));\n',
          },
          readOnly: ["package.json", "index.js"],
          open: "fees.js",
          solution: {
            "fees.js": 'export function courseFee(weeks, perWeek = 5000) {\n  return weeks * perWeek;\n}\n\nexport function discounted(amount, percent) {\n  if (percent < 0 || percent > 100) throw new Error("Invalid discount");\n  return Math.round(amount * (1 - percent / 100));\n}\n',
          },
          tests: [
            { label: "courseFee(24) is 120000; courseFee(16, 4500) is 72000", check: `const { courseFee } = await load("fees.js"); eq(courseFee(24), 120000, "courseFee(24) with the default 5000 per week"); eq(courseFee(16, 4500), 72000, "courseFee(16, 4500)");` },
            { label: "discounted(120000, 15) is 102000; discounted(9999, 33) is 6699", check: `const { discounted } = await load("fees.js"); eq(discounted(120000, 15), 102000, "discounted(120000, 15)"); eq(discounted(9999, 33), 6699, "discounted(9999, 33) rounds to the nearest naira");` },
            { label: "A discount below 0 or above 100 throws Invalid discount", check: `const { discounted } = await load("fees.js"); for (const p of [-5, 120]) { let e = null; try { discounted(1000, p); } catch (x) { e = x; } assert(e, "discounted(1000, " + p + ") should throw"); eq(e.message, "Invalid discount", "the error message"); }` },
            { label: "The functions return values; they print nothing themselves", check: `const before = output().length; const { courseFee, discounted } = await load("fees.js"); courseFee(3); discounted(100, 10); eq(output().length, before, "fees.js printed something: return the value instead");` },
          ],
          hint: "return weeks * perWeek; and, after checking the range, return Math.round(amount * (1 - percent / 100));",
          successMessage: "Two pure functions: give them inputs, get an answer, nothing else happens. Every price and grade rule in your backends should look like this.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 2.5 – 2.6 · ARRAYS, OBJECTS AND ARRAY METHODS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l11-collections",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.5", "2.6"],
    title: "Arrays, Objects and Array Methods",
    subtitle: "Records, lists of records, and map, filter, find, some and reduce",
    estimatedMinutes: 60,
    intro:
      "A backend spends its life on lists of records: rows from a database, items in a request, results to send. Objects hold one record; arrays hold many; and five array methods do most of the processing.",
    atoms: [
      {
        id: "a-be-arrays-objects",
        title: "Arrays and objects",
        explain:
          "An OBJECT groups named values: { name: \"Ada\", scores: [78, 85] }. Read a property with dot notation (student.name) or brackets when the name is in a variable (student[field]); Object.keys and Object.entries list them. An ARRAY is an ordered list: students[0] is the first, students.length the count, push adds to the end. A database row arrives as an object; a query result as an array of objects. Arrays and objects are passed by reference: assigning one to another name does not copy it, so changing it through one name changes it for both.",
        codeExercise: {
          language: JS,
          code: 'const ada = { name: "Ada", scores: [78, 85] };\nconst copy = ada;\ncopy.scores.push(92);\nconsole.log(ada.scores.length);\nconsole.log(Object.keys(ada));\nconst field = "name";\nconsole.log(ada[field]);\n',
          question: "copy is not a copy. What does this print?",
          expectedOutput: "3\n[ 'name', 'scores' ]\nAda",
          hint: "copy and ada name the same object, so pushing through copy changes ada.scores too.",
          successMessage: "One object, two names. Lesson 12 shows how to make a real copy with spread when you need one.",
        },
      },
      {
        id: "a-be-map-filter-find",
        title: "map, filter, find and some",
        explain:
          "Four methods replace most loops. list.map(fn) returns a NEW array with fn applied to every item (turn records into names). list.filter(fn) returns a new array of the items for which fn returns true (only open jobs). list.find(fn) returns the FIRST matching item, or undefined (the course with id 3). list.some(fn) returns true if ANY item matches (is anyone failing?), and every(fn) if all do. None of them changes the original array. They chain: jobs.filter(…).map(…).",
        codeExercise: {
          language: JS,
          code: 'const jobs = [\n  { id: 1, title: "API Engineer", open: true, skills: ["node", "sql"] },\n  { id: 2, title: "Data Analyst", open: false, skills: ["sql"] },\n  { id: 3, title: "Platform Engineer", open: true, skills: ["docker"] },\n];\nconsole.log(jobs.filter((j) => j.open).map((j) => j.title));\nconsole.log(jobs.find((j) => j.skills.includes("sql")).id);\nconsole.log(jobs.some((j) => j.skills.includes("python")));\n',
          question: "What does this print?",
          expectedOutput: "[ 'API Engineer', 'Platform Engineer' ]\n1\nfalse",
          hint: "filter keeps jobs 1 and 3, map turns them into titles. find stops at the first job with sql. Nobody needs python.",
          successMessage: "Filter, then map: the shape of countless API endpoints. find gives the first match only, even though job 2 has sql too.",
        },
      },
      {
        id: "a-be-reduce",
        title: "reduce",
        explain:
          "list.reduce((total, item) => …, start) combines a whole list into one value: a sum, a count per group, the best item. It calls your function once per item with the running result so far (the accumulator) and the item, and whatever your function returns becomes the new running result. Always pass the starting value (0 for a sum, {} for groups): without it, reduce uses the first item, and an empty list throws. Use reduce for totals and groupings; for anything else, map and filter read better.",
        nodeLab: {
          task:
            "In stats.js, use reduce to write two functions. totalLessonsDone(students) returns the sum of every student's lessonsDone (0 for an empty list). studentsPerCourse(students) returns an object counting students per course, such as { \"Backend Engineering\": 2, \"Relational Databases\": 2 }.",
          files: {
            "package.json": PKG,
            "data.js": STUDENTS,
            "stats.js": "export function totalLessonsDone(students) {\n}\n\nexport function studentsPerCourse(students) {\n}\n",
            "index.js": 'import { students } from "./data.js";\nimport { totalLessonsDone, studentsPerCourse } from "./stats.js";\n\nconsole.log("Lessons completed:", totalLessonsDone(students));\nconsole.log(studentsPerCourse(students));\n',
          },
          readOnly: ["package.json", "data.js", "index.js"],
          open: "stats.js",
          solution: {
            "stats.js": "export function totalLessonsDone(students) {\n  return students.reduce((total, s) => total + s.lessonsDone, 0);\n}\n\nexport function studentsPerCourse(students) {\n  return students.reduce((counts, s) => {\n    counts[s.course] = (counts[s.course] ?? 0) + 1;\n    return counts;\n  }, {});\n}\n",
          },
          tests: [
            { label: "totalLessonsDone of the four students is 224", check: `const { totalLessonsDone } = await load("stats.js"); const { students } = await load("data.js"); eq(totalLessonsDone(students), 224, "21 + 140 + 63 + 0");` },
            { label: "totalLessonsDone([]) is 0", check: `const { totalLessonsDone } = await load("stats.js"); let r; try { r = totalLessonsDone([]); } catch (e) { fail("totalLessonsDone([]) threw " + e.message + ": give reduce a starting value"); } eq(r, 0, "an empty list totals 0");` },
            { label: "studentsPerCourse counts 2 and 2", check: `const { studentsPerCourse } = await load("stats.js"); const { students } = await load("data.js"); eq(studentsPerCourse(students), { "Backend Engineering": 2, "Relational Databases": 2 }, "the counts per course");` },
            { label: "Both use reduce", check: `const src = source("stats.js"); assert((src.match(/\\.reduce\\(/g) || []).length >= 2, "use reduce in both functions");` },
          ],
          hint: "students.reduce((total, s) => total + s.lessonsDone, 0). For counts: reduce((counts, s) => { counts[s.course] = (counts[s.course] ?? 0) + 1; return counts; }, {}).",
          successMessage: "A running total and a grouping: the two jobs reduce does best. SQL's SUM and GROUP BY (Week 10) do the same in the database.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 2.7 – 2.8 · MODERN SYNTAX AND MODULES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l12-modern",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.7", "2.8"],
    title: "Destructuring, Spread, Template Literals and Modules",
    subtitle: "The syntax every modern codebase uses, and how files share code",
    estimatedMinutes: 55,
    intro: "Open any Node.js project and you will see { name, email } = req.body, { ...course, title }, `Hello ${name}` and import … from. This lesson makes them yours.",
    atoms: [
      {
        id: "a-be-destructuring",
        title: "Destructuring, spread and template literals",
        explain:
          "DESTRUCTURING unpacks values into names: const { name, email } = user takes two properties; const [first, second] = scores takes two items; defaults fill gaps: const { role = \"student\" } = user. SPREAD (...) copies: { ...course, title: \"New\" } is a new object with every property of course and one changed (later properties win); [...scores, 100] is a new array with one more item. It is a SHALLOW copy: nested objects are still shared. TEMPLATE LITERALS use backticks and ${…} to build strings: `${name} scored ${score}%`.",
        codeExercise: {
          language: JS,
          code: 'const course = { id: 7, title: "Node.js", tags: ["backend"] };\nconst updated = { ...course, title: "Node.js 24" };\nupdated.tags.push("runtime");\nconst { title, level = "beginner" } = updated;\nconsole.log(`${title} (${level})`);\nconsole.log(course.title, course.tags.length);\n',
          question: "Spread copies course, then the copy's tags get a push. What does this print?",
          expectedOutput: "Node.js 24 (beginner)\nNode.js 2",
          hint: "The copy got a new title, so course keeps its old one. But tags is the same array in both: the copy is shallow.",
          successMessage: "Spread copied the top level only. To change a nested list without touching the original, spread it too: { ...course, tags: [...course.tags, \"runtime\"] }.",
        },
      },
      {
        id: "a-be-modules",
        title: "Modules and imports",
        explain:
          "A MODULE is a file that shares some of its code with others. With ES modules (\"type\": \"module\" in package.json, the modern standard), a file EXPORTS names (export function grade…, export const PASS_MARK = 50) and other files IMPORT them by relative path, including the .js extension: import { grade, PASS_MARK } from \"./grades.js\". A file can have one export default, imported without braces under any name. Modules keep each file focused (data in one file, rules in another, the program in a third), and their names private unless exported. Week 5 covers CommonJS (require), the older system you will meet in existing code.",
        nodeLab: {
          task:
            "Split this program into modules. Move the courses array into courses.js and export it; move totalWeeks into stats.js and export it (it should take the list as a parameter); make index.js import both and print the same line as before.",
          files: {
            "package.json": PKG,
            "index.js": 'const courses = [\n  { title: "Backend Engineering", weeks: 24 },\n  { title: "Relational Databases", weeks: 16 },\n  { title: "React Development", weeks: 16 },\n];\n\nfunction totalWeeks(list) {\n  return list.reduce((sum, c) => sum + c.weeks, 0);\n}\n\nconsole.log(`${courses.length} courses, ${totalWeeks(courses)} weeks in total`);\n',
            "courses.js": "",
            "stats.js": "",
          },
          open: "index.js",
          solution: {
            "courses.js": 'export const courses = [\n  { title: "Backend Engineering", weeks: 24 },\n  { title: "Relational Databases", weeks: 16 },\n  { title: "React Development", weeks: 16 },\n];\n',
            "stats.js": "export function totalWeeks(list) {\n  return list.reduce((sum, c) => sum + c.weeks, 0);\n}\n",
            "index.js": 'import { courses } from "./courses.js";\nimport { totalWeeks } from "./stats.js";\n\nconsole.log(`${courses.length} courses, ${totalWeeks(courses)} weeks in total`);\n',
          },
          tests: [
            { label: "courses.js exports the three courses", check: `const m = await load("courses.js"); assert(Array.isArray(m.courses), "courses.js should export courses"); eq(m.courses.length, 3, "the three courses");` },
            { label: "stats.js exports totalWeeks(list)", check: `const { totalWeeks } = await load("stats.js"); assert(typeof totalWeeks === "function", "stats.js should export totalWeeks"); eq(totalWeeks([{ weeks: 2 }, { weeks: 5 }]), 7, "totalWeeks should add up the list it is given");` },
            { label: "index.js imports both and prints 3 courses, 56 weeks in total", check: `const src = source("index.js"); assert(/import\\s*\\{\\s*courses\\s*\\}\\s*from\\s*["']\\.\\/courses\\.js["']/.test(src), "index.js should import { courses } from \\"./courses.js\\""); assert(/import\\s*\\{\\s*totalWeeks\\s*\\}\\s*from\\s*["']\\.\\/stats\\.js["']/.test(src), "index.js should import { totalWeeks } from \\"./stats.js\\""); has(stdout(), "3 courses, 56 weeks in total", "index.js should still print the same line");` },
            { label: "index.js no longer defines the data or the function itself", check: `const src = source("index.js"); lacks(src, "Backend Engineering", "the courses array should live only in courses.js"); lacks(src, "function totalWeeks", "totalWeeks should live only in stats.js");` },
          ],
          hint: 'courses.js: export const courses = [ … ]; stats.js: export function totalWeeks(list) { … }; index.js: import { courses } from "./courses.js"; import { totalWeeks } from "./stats.js";',
          successMessage: "Three files, each with one job. Forget the .js in an import and Node refuses with ERR_MODULE_NOT_FOUND and a 'Did you mean' hint: try it and read the error.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 2.9 · DEBUGGING AND READING ERROR MESSAGES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l13-debugging",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["2.9"],
    title: "Debugging and Reading Error Messages",
    subtitle: "What Node.js is telling you when your program stops",
    estimatedMinutes: 50,
    intro:
      "Every developer's code crashes. The difference between a beginner and a professional is what happens next: the professional reads the error, finds the line, forms a guess, checks it, and fixes the cause. Node's error messages are precise once you know how to read them.",
    atoms: [
      {
        id: "a-be-reading-errors",
        title: "Reading an error",
        explain:
          "When a Node.js program crashes it prints, top to bottom: the FILE and LINE where it stopped; that line of code with a caret ^ under the spot; the ERROR TYPE and MESSAGE; and the STACK TRACE, the chain of function calls that led there, innermost first, each with file:line:column. The common types: SyntaxError (the code is not valid JavaScript: a missing bracket or quote; nothing runs at all), ReferenceError (a name that does not exist: a typo, or a variable used outside its scope), TypeError (an operation on the wrong kind of value: calling something that is not a function, or reading a property of undefined). Read the message first, then the first stack line that is in YOUR code.",
        codeExercise: {
          language: JS,
          code: 'const student = { name: "Ada", scores: [78, 85] };\nconsole.log(student.name.toUpperCase());\nconsole.log(student.scores.length);\nconsole.log(student.grades.length);\n',
          question: "This program prints two lines, then crashes. Which error stops it? Type the two lines and the error's first line, e.g. TypeError: …",
          expectedOutput: "ADA\n2",
          raises: "TypeError: Cannot read properties of undefined (reading 'length')",
          hint: "There is no grades property, so student.grades is undefined, and reading .length of undefined is a TypeError.",
          successMessage: "'reading length' names the property it tried to read; 'of undefined' says the thing before it was undefined. So the bug is student.grades: a misspelled or missing field.",
        },
      },
      {
        id: "a-be-debugging-lab",
        title: "Find and fix",
        explain:
          "Debugging is a loop: run it, read the error or the wrong output, form a guess about the cause, check the guess (console.log the values involved, or run a smaller piece), fix the cause, run again. Fix causes, not symptoms: wrapping a crash in try/catch to hide it is not a fix. The program below is supposed to print each student's average score, but it crashes. Run it, read the error, and fix it. There is more than one bug.",
        nodeLab: {
          task:
            "Run report.js and read the error. Fix the bugs (there are three) so it prints one line per student, e.g. Ada Obi: 85, and Dayo Bello: no scores yet for a student with no scores. Keep the program's structure: fix, do not rewrite.",
          files: {
            "package.json": pkg({ name: "academy-records", scripts: { start: "node report.js" } }),
            "data.js": STUDENTS,
            "report.js": 'import { students } from "./data.js";\n\nfunction average(scores) {\n  const total = scores.reduce((sum, s) => sum + s);\n  return Math.round(total / scores.lenght);\n}\n\nfor (const student of students) {\n  if (student.scores.length === 0) {\n    console.log(`${student.name}: no scores yet`);\n  }\n  console.log(`${student.name}: ${averge(student.scores)}`);\n}\n',
          },
          readOnly: ["package.json", "data.js"],
          open: "report.js",
          solution: {
            "report.js": 'import { students } from "./data.js";\n\nfunction average(scores) {\n  const total = scores.reduce((sum, s) => sum + s, 0);\n  return Math.round(total / scores.length);\n}\n\nfor (const student of students) {\n  if (student.scores.length === 0) {\n    console.log(`${student.name}: no scores yet`);\n    continue;\n  }\n  console.log(`${student.name}: ${average(student.scores)}`);\n}\n',
          },
          tests: [
            { label: "report.js runs without crashing", check: `assert(exitCode() === 0, "report.js still crashes. Read the error:\\n" + stderr());` },
            { label: "It prints each average: Ada Obi: 85, Bayo Adeyemi: 55, Chiamaka Eze: 91", check: `const out = stdout(); for (const line of ["Ada Obi: 85", "Bayo Adeyemi: 55", "Chiamaka Eze: 91"]) has(out, line, "expected the line " + line);` },
            { label: "Dayo Bello: no scores yet, and no NaN anywhere", check: `const out = stdout(); has(out, "Dayo Bello: no scores yet", "a student with no scores should say so"); lacks(out, "NaN", "an average printed NaN: is the division right, and is the student with no scores skipped?"); eq((out.match(/Dayo Bello/g) || []).length, 1, "Dayo Bello should be printed once");` },
          ],
          hint: "The first run fails on a misspelled function name (ReferenceError). After that, look for a misspelled property (NaN), and a student printed twice.",
          successMessage: "A ReferenceError, a silent NaN from a misspelled property, and a missing continue: three different kinds of bug, each found by reading what the program actually did.",
        },
      },
      {
        id: "a-be-debugging-habits",
        title: "Debugging habits",
        explain:
          "Habits that save hours: reproduce the problem reliably before changing anything; change one thing at a time; print the values going INTO the failing line, not just the result; check your assumptions (is that a number or a string? is the array empty?); read the whole error, including the stack, and find the first frame in your own code; search for the exact error message; explain the problem out loud (rubber-duck debugging). Node also has a real debugger: node --inspect lets you pause on a line in VS Code or Chrome and inspect every variable. And once it is fixed, add a test so it stays fixed (Week 15).",
        decision: decide({
          scenario: "An endpoint sometimes returns the wrong total. A teammate adds try/catch around the calculation and returns 0 when anything goes wrong. The wrong totals stop appearing in the error logs.",
          question: "Is the bug fixed?",
          right: ["No: the symptom is hidden and the cause is still there; customers now get 0 instead of an error", "Reproduce it, find the cause, fix that, and add a test."],
          wrong: [
            ["Yes: there are no more errors", "Silence is not correctness."],
            ["Yes, if the totals are usually right", "'Usually' is the bug."],
            ["It does not matter as long as the server stays up", "Wrong totals are worse than a visible error."],
          ],
          at: 2,
          aftermath: "Week 16 is about failing loudly and predictably, and never hiding errors.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 2.10 – 2.11 · EXERCISES: GRADING AND COMPLETION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l14-grading",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["2.10", "2.11"],
    title: "Exercises: A Grading System and Completion Percentages",
    subtitle: "Everything this week, applied to student records",
    estimatedMinutes: 60,
    intro: "Two exercises on the academy's student records: a grading system, and the completion percentages a progress page shows. Each is a module of pure functions, checked as a test suite would check it.",
    atoms: [
      {
        id: "a-be-grading-system",
        title: "Exercise: a student grading system",
        explain:
          "A grading system turns raw scores into results: each student's average, a letter grade (the scale from Lesson 9), and whether they passed. Rules: the average is rounded to a whole number; a student with no scores has no average yet (null) and the grade \"Pending\"; a pass is an average of 50 or more. Build it from small functions that each do one thing, then combine them.",
        nodeLab: {
          task:
            "In grading.js, write: average(scores) → the rounded average, or null for an empty list; letterGrade(avg) → the Lesson 9 scale (70 A, 60 B, 50 C, 45 D, else F); gradeStudent(student) → { name, average, grade, passed }, where a student with no scores gets average null, grade \"Pending\" and passed false. index.js prints a result line for every student.",
          files: {
            "package.json": PKG,
            "data.js": STUDENTS,
            "grading.js": "export function average(scores) {\n}\n\nexport function letterGrade(avg) {\n}\n\nexport function gradeStudent(student) {\n}\n",
            "index.js": 'import { students } from "./data.js";\nimport { gradeStudent } from "./grading.js";\n\nfor (const s of students) {\n  const r = gradeStudent(s);\n  console.log(`${r.name}: ${r.average ?? "-"} ${r.grade} ${r.passed ? "PASS" : "FAIL"}`);\n}\n',
          },
          readOnly: ["package.json", "data.js", "index.js"],
          open: "grading.js",
          solution: {
            "grading.js":
              'export function average(scores) {\n  if (scores.length === 0) return null;\n  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);\n}\n\nexport function letterGrade(avg) {\n  if (avg >= 70) return "A";\n  if (avg >= 60) return "B";\n  if (avg >= 50) return "C";\n  if (avg >= 45) return "D";\n  return "F";\n}\n\nexport function gradeStudent(student) {\n  const avg = average(student.scores);\n  if (avg === null) return { name: student.name, average: null, grade: "Pending", passed: false };\n  return { name: student.name, average: avg, grade: letterGrade(avg), passed: avg >= 50 };\n}\n',
          },
          tests: [
            { label: "average: [78, 85, 92] → 85, [55, 61, 48] → 55, [] → null", check: `const { average } = await load("grading.js"); eq(average([78, 85, 92]), 85, "average([78, 85, 92])"); eq(average([55, 61, 48]), 55, "average([55, 61, 48]) rounds 54.67 to 55"); eq(average([]), null, "average([]) should be null, not NaN");` },
            { label: "letterGrade follows the scale at its boundaries", check: `const { letterGrade } = await load("grading.js"); for (const [s, g] of [[70, "A"], [69, "B"], [60, "B"], [59, "C"], [50, "C"], [49, "D"], [45, "D"], [44, "F"]]) eq(letterGrade(s), g, "letterGrade(" + s + ")");` },
            { label: "gradeStudent gives each student's average, grade and pass", check: `const { gradeStudent } = await load("grading.js"); const { students } = await load("data.js"); eq(gradeStudent(students[0]), { name: "Ada Obi", average: 85, grade: "A", passed: true }, "Ada Obi"); eq(gradeStudent(students[1]), { name: "Bayo Adeyemi", average: 55, grade: "C", passed: true }, "Bayo Adeyemi");` },
            { label: "A student with no scores is Pending, not passed", check: `const { gradeStudent } = await load("grading.js"); const { students } = await load("data.js"); eq(gradeStudent(students[3]), { name: "Dayo Bello", average: null, grade: "Pending", passed: false }, "Dayo Bello has no scores yet");` },
          ],
          hint: "gradeStudent calls average first; if it is null, return the Pending result; otherwise build { name, average, grade: letterGrade(avg), passed: avg >= 50 }.",
          successMessage: "Three small functions, each testable on its own, combined into one result. This shape (validate, compute, assemble) recurs in every endpoint you will build.",
        },
      },
      {
        id: "a-be-completion",
        title: "Exercise: course completion percentages",
        explain:
          "A progress page shows each learner's completion, and a course page shows the average. Completion is lessonsDone ÷ lessonsTotal × 100, rounded DOWN (a learner at 99.6% has not finished: Math.floor). It is never more than 100, and a course with no lessons has 0% completion rather than a division by zero. The course average is the mean of its learners' completions, rounded down too.",
        nodeLab: {
          task:
            "In progress.js, write completion(student) → the whole-number percentage, rounded down with Math.floor, capped at 100, 0 when lessonsTotal is 0; and courseCompletion(students, course) → the rounded-down average completion of the students on that course, or 0 if it has none.",
          files: {
            "package.json": PKG,
            "data.js": STUDENTS,
            "progress.js": "export function completion(student) {\n}\n\nexport function courseCompletion(students, course) {\n}\n",
            "index.js": 'import { students } from "./data.js";\nimport { completion, courseCompletion } from "./progress.js";\n\nfor (const s of students) console.log(`${s.name}: ${completion(s)}%`);\nfor (const c of ["Backend Engineering", "Relational Databases", "Cybersecurity"]) {\n  console.log(`${c}: ${courseCompletion(students, c)}% on average`);\n}\n',
          },
          readOnly: ["package.json", "data.js", "index.js"],
          open: "progress.js",
          solution: {
            "progress.js":
              "export function completion(student) {\n  if (student.lessonsTotal === 0) return 0;\n  return Math.min(100, Math.floor((student.lessonsDone / student.lessonsTotal) * 100));\n}\n\nexport function courseCompletion(students, course) {\n  const onCourse = students.filter((s) => s.course === course);\n  if (onCourse.length === 0) return 0;\n  const total = onCourse.reduce((sum, s) => sum + completion(s), 0);\n  return Math.floor(total / onCourse.length);\n}\n",
          },
          tests: [
            { label: "completion: 21 of 140 → 15, 63 of 97 → 64, 140 of 140 → 100", check: `const { completion } = await load("progress.js"); eq(completion({ lessonsDone: 21, lessonsTotal: 140 }), 15, "21 of 140"); eq(completion({ lessonsDone: 63, lessonsTotal: 97 }), 64, "63 of 97 is 64.9%, rounded down"); eq(completion({ lessonsDone: 140, lessonsTotal: 140 }), 100, "140 of 140");` },
            { label: "Rounded down, never above 100, and 0 when there are no lessons", check: `const { completion } = await load("progress.js"); eq(completion({ lessonsDone: 139, lessonsTotal: 140 }), 99, "139 of 140 is 99.3%: not finished"); eq(completion({ lessonsDone: 150, lessonsTotal: 140 }), 100, "capped at 100"); eq(completion({ lessonsDone: 0, lessonsTotal: 0 }), 0, "no lessons: 0, not NaN");` },
            { label: "courseCompletion averages the course's students", check: `const { courseCompletion } = await load("progress.js"); const { students } = await load("data.js"); eq(courseCompletion(students, "Backend Engineering"), 57, "Backend Engineering: (15 + 100) / 2"); eq(courseCompletion(students, "Relational Databases"), 32, "Relational Databases: (64 + 0) / 2");` },
            { label: "A course with no students averages 0", check: `const { courseCompletion } = await load("progress.js"); const { students } = await load("data.js"); eq(courseCompletion(students, "Cybersecurity"), 0, "no students on the course");` },
          ],
          hint: "completion: guard lessonsTotal === 0, then Math.min(100, Math.floor(done / total * 100)). courseCompletion: filter by course, guard empty, reduce the completions and Math.floor the mean.",
          successMessage: "Rounding down, capping and the empty case: three decisions a product owner cares about, each now explicit and checked.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 2.12 – 2.13 · EXERCISES: JOB FILTERS AND PORTFOLIO SCORES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l15-jobs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["2.12", "2.13"],
    title: "Exercises: Job Filters and Portfolio Scores",
    subtitle: "Searching listings and ranking candidates",
    estimatedMinutes: 60,
    intro: "Two exercises on a job platform's data: filtering listings the way a search page does, and scoring candidates' portfolios to rank them.",
    atoms: [
      {
        id: "a-be-job-filtering",
        title: "Exercise: filter job listings",
        explain:
          "A search page sends filters, any of which may be missing: skill, location, type. A filter that is not given must not filter anything out. Closed listings never appear. Matching should ignore letter case, because users type \"Node\" and \"lagos\". The cleanest design is one function taking the list and an object of filters, building the result with filter() and the conditions combined with &&.",
        nodeLab: {
          task:
            "In search.js, write searchJobs(jobs, filters): return the OPEN jobs matching every filter given in filters = { skill, location, type }. Missing filters match everything. Compare ignoring case. searchJobs(jobs, {}) returns every open job.",
          files: {
            "package.json": PKG,
            "jobs.js": JOBS,
            "search.js": "export function searchJobs(jobs, filters = {}) {\n}\n",
            "index.js": 'import { jobs } from "./jobs.js";\nimport { searchJobs } from "./search.js";\n\nconst show = (list) => list.map((j) => j.id).join(", ") || "(none)";\nconsole.log("node:", show(searchJobs(jobs, { skill: "node" })));\nconsole.log("Lagos, full-time:", show(searchJobs(jobs, { location: "lagos", type: "full-time" })));\nconsole.log("everything open:", show(searchJobs(jobs, {})));\n',
          },
          readOnly: ["package.json", "jobs.js", "index.js"],
          open: "search.js",
          solution: {
            "search.js":
              'export function searchJobs(jobs, filters = {}) {\n  const same = (a, b) => a.toLowerCase() === b.toLowerCase();\n  const { skill, location, type } = filters;\n  return jobs.filter(\n    (job) =>\n      job.open &&\n      (!skill || job.skills.some((s) => same(s, skill))) &&\n      (!location || same(job.location, location)) &&\n      (!type || same(job.type, type))\n  );\n}\n',
          },
          tests: [
            { label: "skill node → jobs 101, 102 and 105", check: `const { searchJobs } = await load("search.js"); const { jobs } = await load("jobs.js"); eq(searchJobs(jobs, { skill: "node" }).map((j) => j.id), [101, 102, 105], "jobs needing node");` },
            { label: "Case does not matter: NODE, Lagos, FULL-TIME", check: `const { searchJobs } = await load("search.js"); const { jobs } = await load("jobs.js"); eq(searchJobs(jobs, { skill: "NODE", location: "Lagos", type: "FULL-TIME" }).map((j) => j.id), [101], "matching should ignore case");` },
            { label: "Closed listings never appear", check: `const { searchJobs } = await load("search.js"); const { jobs } = await load("jobs.js"); const r = searchJobs(jobs, { skill: "git" }).map((j) => j.id); eq(r, [101], "job 104 needs git but is closed");` },
            { label: "No filters → every open job; no match → []", check: `const { searchJobs } = await load("search.js"); const { jobs } = await load("jobs.js"); eq(searchJobs(jobs, {}).map((j) => j.id), [101, 102, 103, 105], "no filters"); eq(searchJobs(jobs, { location: "Kano" }), [], "no jobs in Kano");` },
          ],
          hint: "jobs.filter((job) => job.open && (!skill || job.skills.some(…)) && (!location || …) && (!type || …)), comparing with toLowerCase() on both sides.",
          successMessage: "(!filter || matches) is the pattern for optional filters. Week 6 moves this into an API's query string (?skill=node&location=lagos), and Week 10 into SQL.",
        },
      },
      {
        id: "a-be-portfolio-scores",
        title: "Exercise: candidate portfolio scores",
        explain:
          "Recruiters rank candidates by evidence. The platform scores a portfolio: for each project, 10 points, plus 5 if it has tests, plus 5 if it is deployed, plus 1 per star up to a maximum of 10 star points; plus 15 points per certification. Then candidates are ranked highest score first, and ties are broken by name alphabetically. Write it as a pure function per rule, then combine them, so each rule can be checked and changed alone.",
        nodeLab: {
          task:
            "In scores.js, write projectScore(project) (10, +5 tests, +5 deployed, +1 per star up to 10), portfolioScore(candidate) (the sum of its project scores + 15 per certification), and rankCandidates(candidates) → [{ name, score }] sorted by score descending, ties by name A–Z. Do not change the input array.",
          files: {
            "package.json": PKG,
            "candidates.js": CANDIDATES,
            "scores.js": "export function projectScore(project) {\n}\n\nexport function portfolioScore(candidate) {\n}\n\nexport function rankCandidates(candidates) {\n}\n",
            "index.js": 'import { candidates } from "./candidates.js";\nimport { rankCandidates } from "./scores.js";\n\nrankCandidates(candidates).forEach((c, i) => console.log(`${i + 1}. ${c.name}: ${c.score}`));\n',
          },
          readOnly: ["package.json", "candidates.js", "index.js"],
          open: "scores.js",
          solution: {
            "scores.js":
              "export function projectScore(project) {\n  let score = 10;\n  if (project.tests) score += 5;\n  if (project.deployed) score += 5;\n  score += Math.min(project.stars, 10);\n  return score;\n}\n\nexport function portfolioScore(candidate) {\n  const projects = candidate.projects.reduce((sum, p) => sum + projectScore(p), 0);\n  return projects + candidate.certifications.length * 15;\n}\n\nexport function rankCandidates(candidates) {\n  return candidates\n    .map((c) => ({ name: c.name, score: portfolioScore(c) }))\n    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));\n}\n",
          },
          tests: [
            { label: "projectScore: stars capped at 10, +5 tests, +5 deployed", check: `const { projectScore } = await load("scores.js"); eq(projectScore({ stars: 12, tests: true, deployed: true }), 30, "10 + 5 + 5 + 10 (12 stars capped at 10)"); eq(projectScore({ stars: 3, tests: false, deployed: false }), 13, "10 + 3 stars"); eq(projectScore({ stars: 0, tests: false, deployed: true }), 15, "10 + 5 deployed");` },
            { label: "portfolioScore adds projects and 15 per certification", check: `const { portfolioScore } = await load("scores.js"); const { candidates } = await load("candidates.js"); eq(portfolioScore(candidates[0]), 58, "Ada: 30 + 13 + 15"); eq(portfolioScore(candidates[1]), 25, "Bayo: 10 + 5 + 10 stars"); eq(portfolioScore(candidates[2]), 30, "Chiamaka: two certifications");` },
            { label: "rankCandidates sorts by score, then name", check: `const { rankCandidates } = await load("scores.js"); const { candidates } = await load("candidates.js"); eq(rankCandidates(candidates), [{ name: "Ada Obi", score: 58 }, { name: "Chiamaka Eze", score: 30 }, { name: "Bayo Adeyemi", score: 25 }], "the ranking"); eq(rankCandidates([{ name: "Zainab", projects: [], certifications: [] }, { name: "Musa", projects: [], certifications: [] }]).map((c) => c.name), ["Musa", "Zainab"], "equal scores: by name A–Z");` },
            { label: "The input array is not changed", check: `const { rankCandidates } = await load("scores.js"); const list = [{ name: "B", projects: [], certifications: [] }, { name: "A", projects: [], certifications: ["X"] }]; rankCandidates(list); eq(list.map((c) => c.name), ["B", "A"], "rankCandidates reordered the array it was given: build a new one (map first, then sort)");` },
          ],
          hint: "Map to { name, score } first (that makes a new array), then .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).",
          successMessage: "sort() changes the array it is called on, which is why you mapped first: the caller's list stayed as it was. Unexpected mutation is one of the most common sources of bugs in backend code.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 2.P · DELIVERABLE: A COMMAND-LINE RECORDS APPLICATION
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l16-cli",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 9,
    covers: ["2.P"],
    title: "Deliverable: A Command-Line Records Application",
    subtitle: "Arguments in, a report out",
    estimatedMinutes: 75,
    intro:
      "Command-line tools are how backend developers automate their work: imports, reports, fixes. This week's deliverable is one: it reads student records from a JSON file, applies your grading and progress rules, and prints a report, with options given on the command line.",
    atoms: [
      {
        id: "a-be-argv",
        title: "Command-line arguments",
        explain:
          "When you run node report.js data/students.json --course \"Backend Engineering\", Node puts the words into process.argv: the path of node, the path of your script, then each argument as a string. process.argv.slice(2) gives just yours. Node's built-in util.parseArgs turns them into named options: parseArgs({ args, options: { course: { type: \"string\" }, failing: { type: \"boolean\" } }, allowPositionals: true }) gives { values: { course: \"…\", failing: true }, positionals: [\"data/students.json\"] } and refuses unknown options with a clear error. A tool that is given bad arguments should print how to use it and exit with a non-zero code, so scripts calling it know it failed.",
        nodeLab: {
          task:
            "Complete args.js so that, run as node args.js data/students.json --course \"Backend Engineering\" --failing, it prints three lines: File: data/students.json, then Course: Backend Engineering, then Failing only: true. Use parseArgs with a string option course and a boolean option failing, and allowPositionals. Without --course it must print Course: all; without --failing, Failing only: false.",
          command: 'node args.js data/students.json --course "Backend Engineering" --failing',
          files: {
            "package.json": PKG,
            "args.js": 'import { parseArgs } from "node:util";\n\nconsole.log(process.argv.slice(2));\n// Parse the arguments, then print:\n// File: <file>\n// Course: <course, or all>\n// Failing only: <true or false>\n',
          },
          readOnly: ["package.json"],
          open: "args.js",
          solution: {
            "args.js":
              'import { parseArgs } from "node:util";\n\nconsole.log(process.argv.slice(2));\nconst { values, positionals } = parseArgs({\n  options: { course: { type: "string" }, failing: { type: "boolean" } },\n  allowPositionals: true,\n});\nconsole.log(`File: ${positionals[0]}`);\nconsole.log(`Course: ${values.course ?? "all"}`);\nconsole.log(`Failing only: ${values.failing ?? false}`);\n',
          },
          tests: [
            { label: "With every argument: the file, the course and Failing only: true", check: `const out = stdout(); has(out, "File: data/students.json", "print File: and the first positional argument"); has(out, "Course: Backend Engineering", "print the --course value"); has(out, "Failing only: true", "--failing is a flag: true when given");` },
            { label: "Without options: Course: all and Failing only: false", check: `await run("node args.js data/students.json"); const out = stdout(); has(out, "File: data/students.json", "the file"); has(out, "Course: all", "no --course: all"); has(out, "Failing only: false", "no --failing: false");` },
            { label: "An unknown option is refused (parseArgs does that)", check: `await run("node args.js data/students.json --curse x"); assert(exitCode() !== 0, "an unknown option such as --curse should stop the program"); has(stderr(), "Unknown option '--curse'", "parseArgs should refuse --curse");` },
          ],
          hint: 'const { values, positionals } = parseArgs({ options: { course: { type: "string" }, failing: { type: "boolean" } }, allowPositionals: true }); then print positionals[0], values.course ?? "all" and values.failing ?? false.',
          successMessage: "Look at the first line it printed: process.argv.slice(2) is just strings. parseArgs turned them into named options, and refused --curse with a clear error, for free.",
        },
      },
      {
        id: "a-be-w2-deliverable",
        title: "The records application",
        explain:
          "The application reads a JSON file of student records (fs.readFileSync(path, \"utf8\") then JSON.parse, both from Node's standard library), grades and summarises them with the functions you wrote this week, and prints a report. It must handle bad input like a professional tool: a missing file argument, a file that does not exist, or invalid JSON each get a one-line error message on stderr (console.error) and exit code 1, never a stack trace. Run it with the command in the terminal; the checks run it with other arguments too.",
        nodeLab: {
          task:
            "Finish report.js. node report.js <file> prints one line per student as \"<name> | <average or -> | <grade> | <completion>%\", then a final line \"<n> students, <p> passed\". --course <name> keeps only that course's students. --failing keeps only students who have not passed. With no file argument, a missing file or invalid JSON: print one line to stderr starting with \"Error:\" and exit with code 1. grading.js and progress.js are this week's functions, done for you.",
          command: "node report.js data/students.json",
          files: {
            "package.json": pkg({ name: "academy-report", scripts: { start: "node report.js data/students.json" } }),
            "data/students.json": `${JSON.stringify(
              [
                { id: 1, name: "Ada Obi", course: "Backend Engineering", scores: [78, 85, 92], lessonsDone: 21, lessonsTotal: 140 },
                { id: 2, name: "Bayo Adeyemi", course: "Backend Engineering", scores: [55, 61, 48], lessonsDone: 140, lessonsTotal: 140 },
                { id: 3, name: "Chiamaka Eze", course: "Relational Databases", scores: [91, 88, 95], lessonsDone: 63, lessonsTotal: 97 },
                { id: 4, name: "Dayo Bello", course: "Relational Databases", scores: [], lessonsDone: 0, lessonsTotal: 97 },
                { id: 5, name: "Emeka Nwosu", course: "Backend Engineering", scores: [40, 38, 51], lessonsDone: 30, lessonsTotal: 140 },
              ],
              null,
              2
            )}\n`,
            "data/broken.json": '[{ "name": "Ada", ]\n',
            "grading.js":
              'export function average(scores) {\n  if (scores.length === 0) return null;\n  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);\n}\n\nexport function letterGrade(avg) {\n  if (avg >= 70) return "A";\n  if (avg >= 60) return "B";\n  if (avg >= 50) return "C";\n  if (avg >= 45) return "D";\n  return "F";\n}\n\nexport function gradeStudent(student) {\n  const avg = average(student.scores);\n  if (avg === null) return { name: student.name, average: null, grade: "Pending", passed: false };\n  return { name: student.name, average: avg, grade: letterGrade(avg), passed: avg >= 50 };\n}\n',
            "progress.js":
              "export function completion(student) {\n  if (student.lessonsTotal === 0) return 0;\n  return Math.min(100, Math.floor((student.lessonsDone / student.lessonsTotal) * 100));\n}\n",
            "report.js":
              'import { readFileSync } from "node:fs";\nimport { parseArgs } from "node:util";\nimport { gradeStudent } from "./grading.js";\nimport { completion } from "./progress.js";\n\n// 1. Read the arguments: a file, and the options --course <name> and --failing.\n// 2. Read and parse the file. Errors: one line on stderr starting "Error:", exit code 1.\n// 3. Filter, grade and print one line per student, then the summary line.\n',
          },
          readOnly: ["package.json", "grading.js", "progress.js", "data/students.json", "data/broken.json"],
          open: "report.js",
          solution: {
            "report.js":
              'import { readFileSync } from "node:fs";\nimport { parseArgs } from "node:util";\nimport { gradeStudent } from "./grading.js";\nimport { completion } from "./progress.js";\n\nfunction fail(message) {\n  console.error(`Error: ${message}`);\n  process.exit(1);\n}\n\nlet values;\nlet positionals;\ntry {\n  ({ values, positionals } = parseArgs({\n    options: { course: { type: "string" }, failing: { type: "boolean" } },\n    allowPositionals: true,\n  }));\n} catch (err) {\n  fail(err.message);\n}\n\nconst file = positionals[0];\nif (!file) fail("usage: node report.js <file> [--course <name>] [--failing]");\n\nlet students;\ntry {\n  students = JSON.parse(readFileSync(file, "utf8"));\n} catch (err) {\n  fail(err.code === "ENOENT" ? `${file} does not exist` : `${file} is not valid JSON`);\n}\n\nlet results = students\n  .filter((s) => !values.course || s.course === values.course)\n  .map((s) => ({ ...gradeStudent(s), completion: completion(s) }));\nif (values.failing) results = results.filter((r) => !r.passed);\n\nfor (const r of results) {\n  console.log(`${r.name} | ${r.average ?? "-"} | ${r.grade} | ${r.completion}%`);\n}\nconst passed = results.filter((r) => r.passed).length;\nconsole.log(`${results.length} students, ${passed} passed`);\n',
          },
          tests: [
            { label: "node report.js data/students.json prints every student and the summary", check: `const out = stdout(); for (const line of ["Ada Obi | 85 | A | 15%", "Bayo Adeyemi | 55 | C | 100%", "Chiamaka Eze | 91 | A | 64%", "Dayo Bello | - | Pending | 0%", "Emeka Nwosu | 43 | F | 21%", "5 students, 3 passed"]) has(out, line, "expected the line: " + line); eq(exitCode(), 0, "the report should exit with code 0");` },
            { label: "--course keeps only that course's students", check: `await run('node report.js data/students.json --course "Relational Databases"'); const out = stdout(); has(out, "Chiamaka Eze | 91 | A | 64%", "Chiamaka is on Relational Databases"); lacks(out, "Ada Obi", "Ada is not on Relational Databases"); has(out, "2 students, 1 passed", "the summary counts only the filtered students");` },
            { label: "--failing keeps only students who have not passed", check: `await run("node report.js data/students.json --failing"); const out = stdout(); has(out, "Dayo Bello | - | Pending | 0%", "Dayo has not passed yet"); has(out, "Emeka Nwosu | 43 | F | 21%", "Emeka failed"); lacks(out, "Ada Obi", "Ada passed"); has(out, "2 students, 0 passed", "the summary line");` },
            { label: "No file, a missing file or invalid JSON: Error: … on stderr, exit code 1", check: `for (const cmd of ["node report.js", "node report.js data/nope.json", "node report.js data/broken.json"]) { await run(cmd); eq(exitCode(), 1, cmd + " should exit with code 1"); assert(/^Error: /m.test(stderr()), cmd + " should print a line starting with Error: to stderr"); lacks(stderr(), "    at ", cmd + " printed a stack trace: catch the error and print one line instead"); }` },
          ],
          hint: "Wrap parseArgs and readFileSync/JSON.parse in try/catch and call one fail(message) helper that does console.error and process.exit(1). Then filter, map to gradeStudent + completion, and print.",
          successMessage: "A real tool: options, validation, readable errors and exit codes a script can rely on. That is the deliverable; the task below takes it further on your own machine.",
        },
      },
    ],
    task: {
      title: "Week 2 deliverable: a command-line records application",
      intro: "Build it here until every check passes, then make it yours.",
      prompts: [
        "Install Node.js 24 LTS from nodejs.org on your computer, create a folder with the files from the lab, and run node report.js data/students.json there.",
        "Add a second kind of record: a jobs.json of candidates with portfolios, and a --candidates option that prints the ranking from Lesson 15 instead of the student report.",
        "Add --json, which prints the results as JSON (JSON.stringify(results, null, 2)) instead of text, so another program can use them.",
        "Write a short README.md explaining how to run it, every option, and the exit codes.",
        "Checkpoint: your multi-module command-line program reads records, processes them with array methods and prints a correct report, and fails with a clear message and exit code 1 on bad input.",
      ],
      closing: "Next: Week 3, asynchronous JavaScript, fetching data and TypeScript.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
