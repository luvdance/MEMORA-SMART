/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 9 · SCOPE, EXECUTION & DEBUGGING
 *
 * Curriculum 9.1 – 9.10. Phase 4: how JavaScript actually behaves. Every
 * snippet, including every error message, is executed by the content
 * validator in Node. Error wording is V8's (Node, Chrome, Edge); Firefox and
 * Safari word some messages differently, and the lessons say so.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s9-scope-debugging";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 9.1 – 9.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l31-scope-hoisting",
    moduleId: "js-w9-scope-debugging",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3"],
    title: "Scope and Hoisting",
    subtitle: "Where a name can be seen, and when it exists",
    estimatedMinutes: 17,
    intro:
      "In Week 3 you were told var behaves strangely and the reason would come in Week 9. This is Week 9. Scope decides where a variable can be seen; hoisting decides when it comes into existence. Together they explain every \"why is this undefined?\" you have met so far.",

    atoms: [
      {
        id: "a-js-scope-levels",
        title: "Global, function and block scope",
        explain:
          "Scope is the region of code where a name can be used. A variable declared outside everything has global scope and can be seen everywhere. A variable declared inside a function has function scope. A variable declared with let or const inside any pair of braces, an if, a loop or a plain block, has block scope and exists only inside those braces. var ignores blocks: it is scoped to the whole function.",
        code: {
          language: JS,
          code: 'const app = "Memora";\n\nfunction run() {\n  const inFunction = "visible in run";\n  if (true) {\n    let inBlock = "visible in the if";\n    var leaky = "var ignores the block";\n    console.log(app, "|", inFunction, "|", inBlock);\n  }\n  console.log(leaky);\n  console.log(typeof inBlock);\n}\n\nrun();\n',
          expectedOutput: "Memora | visible in run | visible in the if\nvar ignores the block\nundefined",
        },
        table: {
          caption: "Where each declaration can be seen.",
          headers: ["Declared with", "Inside a function", "Inside a block { }"],
          rows: [
            ["const / let", "Only in that function", "Only in that block"],
            ["var", "Only in that function", "The whole surrounding function"],
            ["function name() {}", "Only in that function", "That block (in modern code)"],
          ],
        },
        why: "Block scope is why let and const replaced var. A loop counter declared with let cannot leak out and collide with another variable of the same name further down; a var counter can, and did, for twenty years of JavaScript bugs.",
      },
      {
        id: "a-js-lexical-scope",
        title: "Lexical scope",
        explain:
          "Lexical scope means a function's access to variables is decided by WHERE IT IS WRITTEN in the source code, not by where it is called from. When JavaScript looks up a name, it searches the current scope, then the scope it is written inside, then the one outside that, all the way to global. This chain of nested scopes is called the scope chain.",
        codeExercise: {
          language: JS,
          code: 'const level = "global";\n\nfunction outer() {\n  const level = "outer";\n  function inner() {\n    return level;\n  }\n  return inner();\n}\n\nfunction other() {\n  const level = "other";\n  return outer();\n}\n\nconsole.log(other());\n',
          question: "inner is called from inside outer, which is called from inside other. Each defines its own level. What is printed?",
          expectedOutput: "outer",
          hint: "Look at where inner is WRITTEN, not where the call chain starts. Which scope surrounds it in the source?",
          successMessage:
            "outer. inner is written inside outer, so it searches outer's scope first and finds level there. other's level is irrelevant: it is not where inner was written.",
        },
      },
      {
        id: "a-js-hoisting",
        title: "Hoisting",
        explain:
          "Before running any code in a scope, JavaScript first registers every declaration in it. This is called hoisting, because it behaves as if declarations were lifted to the top. Function declarations are hoisted completely, body included, which is why you can call them above their line. var is hoisted but its value is not: it exists from the start of the function, holding undefined, until its line runs.",
        code: {
          language: JS,
          code: 'console.log(greet());\nconsole.log(count);\n\nfunction greet() {\n  return "Hello from a hoisted function";\n}\n\nvar count = 10;\nconsole.log(count);\n',
          expectedOutput: "Hello from a hoisted function\nundefined\n10",
        },
        why: "This is the explanation promised in Week 3. var count is registered at the start, holding undefined, so line 2 finds it and prints undefined instead of failing. The assignment = 10 is not hoisted; it happens on its own line.",
      },
      {
        id: "a-js-tdz",
        title: "The temporal dead zone",
        explain:
          "let and const are hoisted too: JavaScript knows about them from the start of their block. But they are not initialised until their line runs, and touching them before that throws a ReferenceError. The stretch of code between the start of the block and the declaration is called the temporal dead zone.",
        codeExercise: {
          language: JS,
          code: 'let message = "outer";\n\nfunction show() {\n  console.log("Starting");\n  console.log(message);\n  let message = "inner";\n}\n\nshow();\n',
          question:
            "There is an outer message, but show declares its own message further down. Type the line that is printed, then the error on the next line.",
          expectedOutput: "Starting",
          raises: "ReferenceError: Cannot access 'message' before initialization",
          hint: "Inside show, the inner let message is hoisted to the top of the function, which hides the outer one. But it is in its dead zone on line 5.",
          successMessage:
            "Starting, then the ReferenceError. Many people expect \"outer\". But the inner message exists from the top of show, shadowing the outer one, and it cannot be read until its own line. The error tells you exactly that.",
        },
        why: "The temporal dead zone turns a silent bug, var's undefined, into a loud one at the exact line where it happens. That is the main reason modern code uses let and const.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 9.4 – 9.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l32-stack-closures",
    moduleId: "js-w9-scope-debugging",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.4", "9.5", "9.6"],
    title: "The Call Stack, Closures and Higher-Order Functions",
    subtitle: "What happens when functions call functions",
    estimatedMinutes: 18,
    intro:
      "Three ideas that sound advanced and turn out to be the explanation for things you have already been doing. The call stack is how JavaScript keeps track of which function it is in. Closures are why a callback can still see variables after its outer function has returned. And you have been writing higher-order functions since Week 6.",

    atoms: [
      {
        id: "a-js-call-stack",
        title: "The call stack and execution contexts",
        explain:
          "Every time a function is called, JavaScript creates an execution context for it: a record of its local variables, its parameters and where to return to. These contexts are kept on a stack. Calling a function pushes a new context on top; returning pops it off and resumes the one underneath. Only the context on top is running.",
        code: {
          language: JS,
          code: 'function a() {\n  console.log("a starts");\n  b();\n  console.log("a ends");\n}\nfunction b() {\n  console.log("  b starts");\n  c();\n  console.log("  b ends");\n}\nfunction c() {\n  console.log("    c runs");\n}\n\na();\n',
          expectedOutput: "a starts\n  b starts\n    c runs\n  b ends\na ends",
        },
        example:
          "The stack at the moment c runs (top is running):\n\n  ┌──────────┐\n  │ c        │  ← running\n  ├──────────┤\n  │ b        │  waiting for c to return\n  ├──────────┤\n  │ a        │  waiting for b to return\n  ├──────────┤\n  │ (global) │\n  └──────────┘\n\nc returns → popped, b resumes. b returns → popped, a resumes.",
        why: "Every error you see comes with a stack trace: the list of contexts that were on the stack when it happened, newest first. Reading it tells you not just where the error is, but how the program got there.",
      },
      {
        id: "a-js-stack-overflow",
        title: "When the stack overflows",
        explain:
          "The stack has a limited size. A function that calls itself with no way to stop, called infinite recursion, keeps pushing contexts until there is no room, and JavaScript throws a RangeError. The message names the problem precisely.",
        code: {
          language: JS,
          code: "function countdown(n) {\n  return countdown(n - 1);\n}\n\ncountdown(3);\n",
          raises: "RangeError: Maximum call stack size exceeded",
        },
        why: "Recursion is a legitimate technique, a function solving a problem by calling itself on a smaller version of it, but it always needs a base case: a condition where it stops calling itself. Here, if (n === 0) return; would be the base case. The missing base case is the bug.",
      },
      {
        id: "a-js-closures",
        title: "Closures",
        explain:
          "A closure is a function together with the variables from the scope it was written in. Because of lexical scope, an inner function can see its outer function's variables, and it KEEPS that access even after the outer function has returned. The variables live on for as long as the inner function does.",
        code: {
          language: JS,
          code: "function makeCounter() {\n  let count = 0;\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst next = makeCounter();\nconsole.log(next());\nconsole.log(next());\nconsole.log(next());\n",
          expectedOutput: "1\n2\n3",
        },
        why: "makeCounter returned long ago, so by the call-stack rules its count should be gone. It is not, because the returned function closed over it. And count is now private: nothing outside can read or change it except by calling next(). That privacy is how encapsulation worked in JavaScript before classes had private fields.",
      },
      {
        id: "a-js-closure-independent",
        title: "Each call makes a new closure",
        explain:
          "Every call to the outer function creates a fresh set of local variables, so every function it returns has its own private copy. Two counters made by two calls do not share a count.",
        codeExercise: {
          language: JS,
          code: "function makeCounter(start) {\n  let count = start;\n  return () => ++count;\n}\n\nconst a = makeCounter(0);\nconst b = makeCounter(100);\n\nconsole.log(a());\nconsole.log(a());\nconsole.log(b());\nconsole.log(a());\n",
          question: "a and b were made by separate calls. What is printed?",
          expectedOutput: "1\n2\n101\n3",
          hint: "++count adds one and then returns the new value. a's count and b's count are completely separate variables.",
          successMessage: "1, 2, 101, 3. Calling b did not disturb a at all. Each closure carries its own environment, which is exactly what makes closures useful for building independent objects.",
        },
      },
      {
        id: "a-js-higher-order",
        title: "Higher-order functions",
        explain:
          "A higher-order function is one that takes a function as an argument, returns a function, or both. map, filter and reduce are higher-order because they take callbacks; makeCounter is higher-order because it returns a function. Functions that build functions let you write a general idea once and produce specific versions of it.",
        code: {
          language: JS,
          code: "function multiplier(factor) {\n  return (n) => n * factor;\n}\n\nconst double = multiplier(2);\nconst addVat = multiplier(1.075);\n\nconsole.log(double(21));\nconsole.log(addVat(2000));\nconsole.log([1, 2, 3].map(multiplier(10)));\n",
          expectedOutput: "42\n2150\n[ 10, 20, 30 ]",
        },
        why: "The last line combines both kinds: multiplier returns a function, and map takes one. Once functions are values you can pass around, small general tools combine into exactly the specific behaviour you need.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 9.7 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l33-references-equality",
    moduleId: "js-w9-scope-debugging",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.7", "9.8"],
    title: "Values, References and Equality",
    subtitle: "Why changing a copy can change the original",
    estimatedMinutes: 16,
    intro:
      "You have seen a const array change, and a function change an object it was given. This lesson explains both. Primitives and objects are stored differently, and once you see the difference, a whole category of confusing bugs becomes obvious.",

    atoms: [
      {
        id: "a-js-pass-by-value",
        title: "Primitives are copied",
        explain:
          "When you assign a primitive (a number, string or boolean) to another variable, or pass it to a function, the VALUE is copied. The two variables are completely independent: changing one never affects the other.",
        code: {
          language: JS,
          code: "let a = 10;\nlet b = a;\nb = 99;\nconsole.log(a, b);\n\nfunction addTen(n) {\n  n = n + 10;\n  return n;\n}\nconst score = 50;\nconsole.log(addTen(score), score);\n",
          expectedOutput: "10 99\n60 50",
        },
      },
      {
        id: "a-js-object-references",
        title: "Objects are shared by reference",
        explain:
          "An object or array is not stored in the variable itself. The variable holds a REFERENCE: the address of the object somewhere in memory. Assigning it to another variable copies the reference, not the object, so both names point at the same object. Change it through either name and both see the change.",
        codeExercise: {
          language: JS,
          code: 'const original = { name: "Ada", score: 72 };\nconst alias = original;\nalias.score = 95;\nconsole.log(original.score);\n\nfunction curve(student) {\n  student.score += 5;\n}\ncurve(original);\nconsole.log(alias.score);\n\nconst copy = { ...original };\ncopy.score = 0;\nconsole.log(original.score);\n',
          question: "alias and the function's student both refer to the same object. copy does not. What is printed?",
          expectedOutput: "95\n100\n100",
          hint: "alias.score = 95 changes the one shared object. curve changes it again. Spread makes a NEW object, so changing copy leaves the original alone.",
          successMessage:
            "95, 100, 100. This is why const arrays can change: const fixes the reference, not the object it points to. And it is why React in Week 15 insists on copying objects with spread instead of changing them.",
        },
        example:
          "  original ──┐\n             ├──▶  { name: 'Ada', score: 100 }\n  alias ─────┘\n\n  copy ──────────▶  { name: 'Ada', score: 0 }     (a different object)",
      },
      {
        id: "a-js-shallow-copy",
        title: "Spread copies only one level",
        explain:
          "Spread makes a shallow copy: a new outer object, but any objects or arrays inside it are still shared references. For a deep copy, where nothing is shared, use structuredClone(obj).",
        code: {
          language: JS,
          code: 'const student = { name: "Ada", scores: [72, 81] };\nconst shallow = { ...student };\nconst deep = structuredClone(student);\n\nshallow.scores.push(90);\nconsole.log(student.scores);\nconsole.log(deep.scores);\n',
          expectedOutput: "[ 72, 81, 90 ]\n[ 72, 81 ]",
        },
        mistake:
          "Assuming spread protects nested data. Pushing into shallow.scores changed the original student's scores, because both objects share the same inner array.",
      },
      {
        id: "a-js-equality",
        title: "== versus ===",
        explain:
          "=== is strict equality: true only if both sides have the same type and value, or, for objects, are the very same object. == is loose equality: if the types differ, it converts them first using a set of rules that produce some notorious results. Two different objects are never equal, however similar their contents, because === on objects compares references.",
        table: {
          caption: "Loose equality surprises. Every row is real output.",
          headers: ["Expression", "Result", "Why"],
          rows: [
            ["0 == \"\"", "true", "\"\" converts to the number 0"],
            ["\"1\" == 1", "true", "\"1\" converts to 1"],
            ["[] == false", "true", "Both convert to 0"],
            ["null == undefined", "true", "A special rule"],
            ["null === undefined", "false", "Different types"],
            ["NaN == NaN", "false", "NaN is never equal to anything"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'const a = { id: 1 };\nconst b = { id: 1 };\nconst c = a;\n\nconsole.log(a === b);\nconsole.log(a === c);\nconsole.log(a.id === b.id);\nconsole.log("5" === 5, "5" == 5);\n',
          question: "=== on objects compares references, not contents. What is printed?",
          expectedOutput: "false\ntrue\ntrue\nfalse true",
          hint: "a and b are two separate objects that happen to look alike. c is another name for a.",
          successMessage:
            "false, true, true, then false true. To compare objects by content, compare the properties you care about, as on line 7. And keep using === everywhere; the one common exception is value == null, which checks for both null and undefined at once.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 9.9 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l34-errors-debugging",
    moduleId: "js-w9-scope-debugging",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.9", "9.10"],
    title: "Errors and the Debugger",
    subtitle: "Reading what went wrong, and watching your code run",
    estimatedMinutes: 18,
    intro:
      "Week 2 named three kinds of error: syntax, runtime and logic. Now you can recognise each one in JavaScript by its message, and use the tool every professional uses to find the hard ones: a debugger, which is the dry-run table from Week 2 filled in by the computer.",

    atoms: [
      {
        id: "a-js-error-messages",
        title: "Reading error messages",
        explain:
          "A JavaScript error message has two parts: the type of error and a description. The type tells you what kind of problem it is; the description usually names the exact variable or property. Read both before changing anything. The wording below is from Node.js and Chrome; Firefox and Safari word some messages differently, but the types are the same everywhere.",
        table: {
          caption: "The errors you will see most, and what each one means.",
          headers: ["Message", "Type of error", "Usual cause"],
          rows: [
            ["x is not defined", "ReferenceError", "A typo in a name, or a variable used outside its scope"],
            ["Cannot access 'x' before initialization", "ReferenceError", "A let or const used in its temporal dead zone"],
            ["Cannot read properties of undefined (reading 'name')", "TypeError", "Reading .name from something that does not exist"],
            ["x is not a function", "TypeError", "Calling something that is not a function, often a typo in a method name"],
            ["Assignment to constant variable.", "TypeError", "Reassigning a const"],
            ["Unexpected token", "SyntaxError", "A missing bracket, brace, comma or quote"],
            ["Maximum call stack size exceeded", "RangeError", "Recursion with no base case"],
          ],
        },
        why: "\"Cannot read properties of undefined\" is the most common error in all of JavaScript. It never means the property is the problem; it means the thing BEFORE the dot is undefined. Look one step to the left.",
      },
      {
        id: "a-js-runtime-errors",
        title: "Runtime errors in practice",
        explain:
          "A runtime error stops the program at the line where it happens; every line before it has already run. That makes the output before the crash a clue: it tells you how far the program got.",
        codeExercise: {
          language: JS,
          code: 'const users = [{ name: "Ada" }, { name: "Bisi" }];\nfor (let i = 0; i <= users.length; i++) {\n  console.log(users[i].name);\n}\n',
          question: "The loop has an off-by-one error. Type every line printed, then the error. The error reads: TypeError: Cannot read properties of undefined (reading 'name')",
          expectedOutput: "Ada\nBisi",
          raises: "TypeError: Cannot read properties of undefined (reading 'name')",
          hint: "When i reaches 2, users[2] is undefined. The error happens when the code tries to read .name from it.",
          successMessage:
            "Ada, Bisi, then the TypeError. The thing before the dot, users[2], was undefined, because i <= users.length ran one time too many. The error message and the output together pinpoint it.",
        },
      },
      {
        id: "a-js-logic-errors-js",
        title: "Logic errors: the program runs and lies",
        explain:
          "A logic error produces no message at all. The only way to find one is to know what the answer should be, compare it with what the program gives, and trace to the first value that differs. Printing intermediate values with console.log is the quickest way; the debugger is the most thorough.",
        code: {
          language: JS,
          code: 'function average(scores) {\n  let total = 0;\n  for (let i = 1; i < scores.length; i++) {\n    total += scores[i];\n  }\n  console.log("debug total:", total);\n  return total / scores.length;\n}\n\nconsole.log(average([60, 70, 80]));\n',
          expectedOutput: "debug total: 150\n50",
        },
        why: "The average of 60, 70 and 80 should be 70. The debug line shows the total is 150 instead of 210, so the bug is in the loop, not the division: the loop starts at i = 1 and skips the first score. Without that one console.log, you might have spent ten minutes staring at the division line.",
      },
      {
        id: "a-js-debugger",
        title: "Debugging with breakpoints",
        explain:
          "A debugger pauses your program at a line you choose, called a breakpoint, and lets you look at every variable at that moment. You can then step forward one line at a time and watch the values change. It is a trace table that fills itself in, for code too long to trace by hand.",
        example:
          "In VS Code:\n\n  1. Open the file and click in the margin to the left of a line\n     number. A red dot appears: that is a breakpoint.\n  2. Open the Run and Debug panel (Ctrl+Shift+D) and choose\n     \"Run and Debug\" → \"Node.js\".\n  3. The program runs and pauses at the red dot, BEFORE that line runs.\n  4. The VARIABLES panel shows every variable in scope right now.\n     The CALL STACK panel shows how you got here.\n  5. Step Over (F10)   run this line, pause on the next one\n     Step Into (F11)   go inside the function this line calls\n     Continue  (F5)    run until the next breakpoint\n\nIn the browser: open DevTools (F12) → Sources, click a line\nnumber, and reload the page. Or write  debugger;  in your code.",
        why: "console.log shows you the values you thought to print. A debugger shows you all of them, including the one you did not suspect. When you have added five console.logs and still cannot see the bug, switch to the debugger.",
      },
      {
        id: "a-js-debug-method",
        title: "A method for any bug",
        explain:
          "Every debugging session follows the same steps: reproduce the bug reliably, state what you expected, find the first point where reality differs from expectation, explain why, fix that one thing, and re-test everything. Skipping a step is how a fix creates two new bugs.",
        decision: {
          scenario:
            "The student records manager reports an average of NaN for one student. Everyone else's average is correct.",
          question: "What is the most effective next step?",
          options: [
            {
              id: "a",
              text: "Set a breakpoint inside averageOf, run it for that one student, and inspect the scores array and the running total as you step through",
              why: "It is reproducible (one specific student) and the debugger will show the exact iteration where total becomes NaN. Almost certainly one score is a string or undefined, which you will see directly in the Variables panel.",
            },
            {
              id: "b",
              text: "Rewrite averageOf using a different method, such as reduce instead of a for loop",
              whyWrong: "If the data contains a bad value, the new version will produce NaN too. You would have changed working code without finding the cause.",
            },
            {
              id: "c",
              text: "Wrap the calculation in a check that replaces NaN with 0",
              whyWrong: "That hides the bug and reports a wrong average of 0. The student's real average is still unknown, and the bad data is still there.",
            },
            {
              id: "d",
              text: "Delete that student's record",
              whyWrong: "The symptom disappears and so does a real student. The bug that let bad data in will strike the next record too.",
            },
          ],
          correct: "a",
          aftermath: "NaN spreads: one NaN anywhere in a calculation makes the whole result NaN. That is why you look for the FIRST place it appears, which is exactly what stepping through shows you.",
        },
      },
    ],

    task: {
      title: "Project: refactor, then debug",
      intro:
        "Return to the student records manager from Week 8. This week has two parts: make it cleaner, then find bugs in it on purpose.",
      prompts: [
        "Refactor: split anything longer than about 15 lines into smaller functions, each with parameters and a return value. No function should read or change a global variable.",
        "Replace every var with const or let, and check that no variable is used outside the block where it belongs.",
        "Make one function return a closure: makeGradeChecker(passMark) that returns a function testing a single score against that mark.",
        "Break it deliberately in five ways: an off-by-one loop, a score stored as a string, a misspelt property name, a missing return, and an object mutated through a shared reference. Swap with a classmate, or wait a day, then find each bug using breakpoints in the VS Code debugger.",
        "For each bug, write one line: the error message or wrong output, the line where it actually was, and how the debugger showed you.",
      ],
      closing:
        "The skill being built here is not avoiding bugs, which nobody does. It is finding them calmly and quickly, which everybody can learn.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
