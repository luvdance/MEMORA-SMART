/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 9
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l31-scope-hoisting": {
    lessonId: "js-l31-scope-hoisting",
    passMark: 70,
    questions: [
      {
        id: "jsq31-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-scope-levels",
        prompt: "if (true) { let x = 1; var y = 2; }\nconsole.log(typeof x, typeof y);\n\nWhat is printed?",
        options: [
          { id: "a", text: "number number" },
          { id: "b", text: "undefined number" },
          { id: "c", text: "number undefined" },
          { id: "d", text: "undefined undefined" },
        ],
        correct: "b",
        explanation: "let is block-scoped, so x does not exist outside the braces. var ignores blocks, so y is visible.",
        whyWrong: {
          a: "x was declared with let inside the block and cannot be seen outside it.",
          c: "That reverses the two behaviours.",
          d: "var y leaks out of the block.",
        },
      },
      {
        id: "jsq31-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-lexical-scope",
        prompt: "What does lexical scope mean?",
        options: [
          { id: "a", text: "A function can see variables from wherever it is called" },
          { id: "b", text: "A function can see variables from where it is written in the source code" },
          { id: "c", text: "All variables are global" },
          { id: "d", text: "Variables can only be used on the line they are declared" },
        ],
        correct: "b",
        explanation: "The scope chain is fixed by the nesting in the source text, not by the path of calls at runtime.",
        whyWrong: {
          a: "That would be dynamic scope, which JavaScript does not use.",
          c: "Function and block scope exist precisely so that most variables are not global.",
          d: "A variable is usable throughout its scope after declaration.",
        },
      },
      {
        id: "jsq31-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-hoisting",
        prompt: "console.log(sum(2, 3));\nfunction sum(a, b) { return a + b; }\n\nWhat happens?",
        options: [
          { id: "a", text: "It prints 5" },
          { id: "b", text: "ReferenceError" },
          { id: "c", text: "It prints undefined" },
          { id: "d", text: "TypeError: sum is not a function" },
        ],
        correct: "a",
        explanation: "Function declarations are hoisted with their body, so they can be called before their line.",
        whyWrong: {
          b: "That would happen with a function expression stored in const.",
          c: "The whole function is hoisted, not just its name.",
          d: "That would happen with var sum = function …, where sum is undefined until its line.",
        },
      },
      {
        id: "jsq31-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-tdz",
        prompt: "const v = \"outer\";\n{ console.log(v); const v = \"inner\"; }\n\nWhat happens?",
        options: [
          { id: "a", text: "It prints outer" },
          { id: "b", text: "It prints inner" },
          { id: "c", text: "ReferenceError: Cannot access 'v' before initialization" },
          { id: "d", text: "It prints undefined" },
        ],
        correct: "c",
        explanation: "The inner const v is hoisted to the top of its block and shadows the outer v, but it is in its temporal dead zone at the console.log.",
        whyWrong: {
          a: "The inner v already exists for the whole block, hiding the outer one.",
          b: "Its value has not been assigned yet when console.log runs.",
          d: "That is var's behaviour. const throws instead.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l32-stack-closures": {
    lessonId: "js-l32-stack-closures",
    passMark: 70,
    questions: [
      {
        id: "jsq32-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-call-stack",
        prompt: "Function a calls b, and b calls c. While c is running, what is on the call stack, from top to bottom?",
        options: [
          { id: "a", text: "a, b, c, global" },
          { id: "b", text: "c, b, a, global" },
          { id: "c", text: "Only c" },
          { id: "d", text: "global only" },
        ],
        correct: "b",
        explanation: "Each call pushes a context on top. c is the most recent, so it is on top, with b and a waiting beneath it.",
        whyWrong: {
          a: "That is the order they were called, but the stack's top is the most recent call.",
          c: "a and b have not returned; they are waiting underneath.",
          d: "Three functions are in progress.",
        },
      },
      {
        id: "jsq32-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-closures",
        prompt: "function make() { let n = 0; return () => (n += 2); }\nconst f = make();\nf(); f();\nconsole.log(f());\n\nWhat is printed?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "6" },
          { id: "c", text: "0" },
          { id: "d", text: "4" },
        ],
        correct: "b",
        explanation: "f closes over n, which survives between calls: 2, then 4, then 6 on the third call.",
        whyWrong: {
          a: "That would happen if n were reset each call. It lives in the closure.",
          c: "n is increased before each value is returned.",
          d: "That is the value after the second call. The third call is the one printed.",
        },
      },
      {
        id: "jsq32-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-closure-independent",
        prompt: "const a = makeCounter(); const b = makeCounter();\na(); a(); b();\n\nIf each counter starts at 0 and returns the new count, what does a() return next?",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "3" },
          { id: "c", text: "4" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation: "a and b have separate closures. a has been called twice, so its next call returns 3. b's call does not affect it.",
        whyWrong: {
          a: "a's count was not reset.",
          c: "That treats a and b as sharing one count.",
          d: "That forgets that this is a's third call.",
        },
      },
      {
        id: "jsq32-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-higher-order",
        prompt: "Which of these is a higher-order function?",
        options: [
          { id: "a", text: "function add(a, b) { return a + b; }" },
          { id: "b", text: "function times(n) { return (x) => x * n; }" },
          { id: "c", text: "const PI = 3.14;" },
          { id: "d", text: "function greet() { console.log(\"hi\"); }" },
        ],
        correct: "b",
        explanation: "times returns a function, which makes it higher-order. Taking a function as an argument would too.",
        whyWrong: {
          a: "add takes and returns numbers only.",
          c: "That is a constant, not a function.",
          d: "greet neither takes nor returns a function.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l33-references-equality": {
    lessonId: "js-l33-references-equality",
    passMark: 70,
    questions: [
      {
        id: "jsq33-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-object-references",
        prompt: "const a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);\n\nWhat is printed?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "3" },
          { id: "c", text: "1" },
          { id: "d", text: "TypeError" },
        ],
        correct: "b",
        explanation: "b = a copies the reference, so both names point at the same array. Pushing through b changes the one shared array.",
        whyWrong: {
          a: "That assumes b is a copy. It is the same array.",
          c: "Nothing is removed.",
          d: "push changes the array; it does not reassign the const.",
        },
      },
      {
        id: "jsq33-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-pass-by-value",
        prompt: "function bump(n) { n++; }\nlet x = 5;\nbump(x);\nconsole.log(x);\n\nWhat is printed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "6" },
          { id: "c", text: "undefined" },
          { id: "d", text: "NaN" },
        ],
        correct: "a",
        explanation: "Numbers are passed by value. n is a copy, so changing it inside the function does not affect x.",
        whyWrong: {
          b: "That would happen if numbers were shared by reference. They are copied.",
          c: "x still holds its number.",
          d: "No invalid arithmetic happens to x.",
        },
      },
      {
        id: "jsq33-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-shallow-copy",
        prompt: "const o = { tags: [\"a\"] };\nconst c = { ...o };\nc.tags.push(\"b\");\nconsole.log(o.tags);\n\nWhat is printed?",
        options: [
          { id: "a", text: "[ 'a' ]" },
          { id: "b", text: "[ 'a', 'b' ]" },
          { id: "c", text: "[ 'b' ]" },
          { id: "d", text: "undefined" },
        ],
        correct: "b",
        explanation: "Spread is shallow. c is a new object, but c.tags and o.tags are the same inner array.",
        whyWrong: {
          a: "That would need a deep copy, such as structuredClone.",
          c: "push adds to the existing array; nothing is removed.",
          d: "o.tags still exists.",
        },
      },
      {
        id: "jsq33-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-equality",
        prompt: "What is { x: 1 } === { x: 1 }?",
        options: [
          { id: "a", text: "true, because they have the same contents" },
          { id: "b", text: "false, because they are two different objects" },
          { id: "c", text: "An error" },
          { id: "d", text: "true, but only with ==" },
        ],
        correct: "b",
        explanation: "=== on objects compares references. Two separately created objects are never the same object.",
        whyWrong: {
          a: "Contents are not compared; identity is.",
          c: "Comparing objects is allowed.",
          d: "== also compares object references, so it is false too.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l34-errors-debugging": {
    lessonId: "js-l34-errors-debugging",
    passMark: 70,
    questions: [
      {
        id: "jsq34-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-error-messages",
        prompt: "You see: TypeError: Cannot read properties of undefined (reading 'email'). The line is user.profile.email. What is undefined?",
        options: [
          { id: "a", text: "email" },
          { id: "b", text: "user.profile" },
          { id: "c", text: "The whole line" },
          { id: "d", text: "TypeError itself" },
        ],
        correct: "b",
        explanation: "The message names the property being read, email. The thing it was being read FROM, user.profile, is the undefined value.",
        whyWrong: {
          a: "email is what was being read, not what was missing.",
          c: "Exactly one value in the chain was undefined: the one before .email.",
          d: "TypeError is the category of error.",
        },
      },
      {
        id: "jsq34-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-runtime-errors",
        prompt: "A program prints three lines and then throws an error. What do the three lines tell you?",
        options: [
          { id: "a", text: "Nothing useful" },
          { id: "b", text: "Everything before the error ran, so the problem is at or after the point the output stops" },
          { id: "c", text: "The error is on line 3" },
          { id: "d", text: "The program will continue after the error" },
        ],
        correct: "b",
        explanation: "A runtime error stops execution at the line where it occurs. The output so far shows how far the program got.",
        whyWrong: {
          a: "The output is one of your best clues.",
          c: "Lines of output do not correspond to lines of code.",
          d: "An uncaught error stops the program.",
        },
      },
      {
        id: "jsq34-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-debugger",
        prompt: "When a VS Code breakpoint pauses on a line, has that line run yet?",
        options: [
          { id: "a", text: "Yes" },
          { id: "b", text: "No, execution pauses just before it" },
          { id: "c", text: "Only half of it" },
          { id: "d", text: "It depends on the line" },
        ],
        correct: "b",
        explanation: "The debugger pauses before the line runs, so you can inspect values and then step to see what that line changes.",
        whyWrong: {
          a: "If it had run, you could not see the values just before it.",
          c: "Lines are not partially executed at a breakpoint.",
          d: "The rule is the same for every line.",
        },
      },
      {
        id: "jsq34-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-logic-errors-js",
        prompt: "A total should be 210 but prints 150. The loop is for (let i = 1; i < scores.length; i++) and scores is [60, 70, 80]. What is the bug?",
        options: [
          { id: "a", text: "The division is wrong" },
          { id: "b", text: "The loop starts at 1 and skips the first score" },
          { id: "c", text: "scores is the wrong length" },
          { id: "d", text: "+= should be =" },
        ],
        correct: "b",
        explanation: "Indexes start at 0. Starting at 1 skips 60, which is exactly the 60 missing from 210.",
        whyWrong: {
          a: "The total is already wrong before any division happens.",
          c: "The array has the right three scores.",
          d: "= would keep only the last score, giving 80.",
        },
      },
    ],
  },
};
