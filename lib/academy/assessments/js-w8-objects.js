/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 8
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l27-objects": {
    lessonId: "js-l27-objects",
    passMark: 70,
    questions: [
      {
        id: "jsq27-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-objects-kv",
        prompt: "What is the main advantage of storing a student as { name: \"Ada\", age: 19 } instead of [\"Ada\", 19]?",
        options: [
          { id: "a", text: "Objects use less memory" },
          { id: "b", text: "Each value is reached by a meaningful name instead of a position" },
          { id: "c", text: "Objects can only hold strings" },
          { id: "d", text: "Arrays cannot hold numbers" },
        ],
        correct: "b",
        explanation: "student.age says what it is. In an array you have to remember that index 1 means age.",
        whyWrong: {
          a: "Memory is not the reason to choose. Clarity is.",
          c: "Object values can be any type, including arrays, functions and other objects.",
          d: "Arrays can hold any type of value.",
        },
      },
      {
        id: "jsq27-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-methods",
        prompt: "const c = { count: 0, inc() { this.count++; } };\nc.inc(); c.inc();\nconsole.log(c.count);\n\nWhat is printed?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "1" },
          { id: "c", text: "2" },
          { id: "d", text: "undefined" },
        ],
        correct: "c",
        explanation: "Inside the method, this is c, so each call increases c.count. Two calls give 2.",
        whyWrong: {
          a: "The method changes the object's own property through this.",
          b: "inc is called twice.",
          d: "count starts at 0 and is a real property.",
        },
      },
      {
        id: "jsq27-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-dot-bracket",
        prompt: "const p = { colour: \"red\" };\nconst key = \"colour\";\nconsole.log(p.key, p[key]);\n\nWhat is printed?",
        options: [
          { id: "a", text: "red red" },
          { id: "b", text: "undefined red" },
          { id: "c", text: "red undefined" },
          { id: "d", text: "colour red" },
        ],
        correct: "b",
        explanation: "p.key looks for a property literally named key, which does not exist. p[key] uses the variable's value, \"colour\".",
        whyWrong: {
          a: "Dot notation never reads a variable; it uses the word after the dot as the key.",
          c: "It is the other way round: brackets use the variable.",
          d: "Neither expression prints the key name itself.",
        },
      },
      {
        id: "jsq27-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-properties-change",
        prompt: "const o = { a: 1 };\no.b = 2;\no.a = 5;\nconsole.log(o);\n\nWhat is printed?",
        options: [
          { id: "a", text: "{ a: 1 }" },
          { id: "b", text: "{ a: 5, b: 2 }" },
          { id: "c", text: "{ a: 1, b: 2 }" },
          { id: "d", text: "TypeError, because o is const" },
        ],
        correct: "b",
        explanation: "Assigning to a new key adds it; assigning to an existing key changes it. const does not freeze the object.",
        whyWrong: {
          a: "Both assignments take effect.",
          c: "o.a = 5 replaces the 1.",
          d: "const only stops o being reassigned to a different object.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l28-nesting-destructuring": {
    lessonId: "js-l28-nesting-destructuring",
    passMark: 70,
    questions: [
      {
        id: "jsq28-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-nested-objects",
        prompt: "const s = { name: \"Ada\", marks: { maths: 72, english: [60, 65] } };\nconsole.log(s.marks.english[1]);\n\nWhat is printed?",
        options: [
          { id: "a", text: "60" },
          { id: "b", text: "65" },
          { id: "c", text: "72" },
          { id: "d", text: "undefined" },
        ],
        correct: "b",
        explanation: "s.marks is the inner object, .english is its array, and [1] is the second element.",
        whyWrong: {
          a: "60 is at index 0.",
          c: "72 is s.marks.maths.",
          d: "Every step in the chain exists.",
        },
      },
      {
        id: "jsq28-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-destructuring",
        prompt: "const { city, zip = \"none\" } = { city: \"Jos\" };\nconsole.log(city, zip);\n\nWhat is printed?",
        options: [
          { id: "a", text: "Jos none" },
          { id: "b", text: "Jos undefined" },
          { id: "c", text: "undefined none" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "city is unpacked from the object. zip is missing, so its default is used.",
        whyWrong: {
          b: "The default replaces the missing value.",
          c: "city exists in the object.",
          d: "Destructuring a missing property is allowed; it gives undefined or the default.",
        },
      },
      {
        id: "jsq28-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-spread",
        prompt: "const a = { x: 1, y: 2 };\nconst b = { ...a, y: 9 };\nconsole.log(a.y, b.y);\n\nWhat is printed?",
        options: [
          { id: "a", text: "2 9" },
          { id: "b", text: "9 9" },
          { id: "c", text: "2 2" },
          { id: "d", text: "9 2" },
        ],
        correct: "a",
        explanation: "Spread copies a's properties into a new object, and the later y: 9 overrides the copy. a itself is unchanged.",
        whyWrong: {
          b: "Spread makes a copy; a is never modified.",
          c: "y: 9 comes after the spread, so it overrides in b.",
          d: "That reverses which object changed.",
        },
      },
      {
        id: "jsq28-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-rest",
        prompt: "function f(first, ...others) { return others.length; }\nconsole.log(f(\"a\", \"b\", \"c\", \"d\"));\n\nWhat is printed?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "3" },
          { id: "c", text: "1" },
          { id: "d", text: "0" },
        ],
        correct: "b",
        explanation: "first takes \"a\", and rest collects the remaining three arguments into an array.",
        whyWrong: {
          a: "The first argument goes into first, not into others.",
          c: "Rest collects everything left, not one item.",
          d: "Three arguments remain after the first.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l29-array-methods": {
    lessonId: "js-l29-array-methods",
    passMark: 70,
    questions: [
      {
        id: "jsq29-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-map",
        prompt: "An array has 8 elements. What length is the array returned by map?",
        options: [
          { id: "a", text: "8, always" },
          { id: "b", text: "It depends on how many pass the callback" },
          { id: "c", text: "1" },
          { id: "d", text: "map does not return an array" },
        ],
        correct: "a",
        explanation: "map transforms every element, one in, one out. Choosing which elements to keep is filter's job.",
        whyWrong: {
          b: "That describes filter.",
          c: "That describes reduce or find, which produce one value.",
          d: "map always returns a new array.",
        },
      },
      {
        id: "jsq29-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-filter",
        prompt: "console.log([5, 12, 8, 20].filter((n) => n > 10));\n\nWhat is printed?",
        options: [
          { id: "a", text: "[ 12, 20 ]" },
          { id: "b", text: "[ false, true, false, true ]" },
          { id: "c", text: "12" },
          { id: "d", text: "[ 5, 8 ]" },
        ],
        correct: "a",
        explanation: "filter keeps the elements for which the callback returns truthy, unchanged.",
        whyWrong: {
          b: "That is what map would return with the same callback.",
          c: "That is what find would return: only the first match.",
          d: "Those are the ones that fail the test.",
        },
      },
      {
        id: "jsq29-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-find",
        prompt: "const r = [{ id: 1 }, { id: 2 }].find((x) => x.id === 3);\nconsole.log(r.id);\n\nWhat happens?",
        options: [
          { id: "a", text: "It prints 3" },
          { id: "b", text: "It prints undefined" },
          { id: "c", text: "TypeError, because r is undefined and has no id" },
          { id: "d", text: "It prints []" },
        ],
        correct: "c",
        explanation: "find returns undefined when nothing matches, and reading a property of undefined throws. Check the result, or use r?.id.",
        whyWrong: {
          a: "Nothing has id 3, so nothing is found.",
          b: "r is undefined; r.id is an attempt to read a property of undefined, which throws.",
          d: "find returns an element or undefined, never an array.",
        },
      },
      {
        id: "jsq29-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-reduce",
        prompt: "console.log([2, 3, 4].reduce((acc, n) => acc * n, 1));\n\nWhat is printed?",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "24" },
          { id: "c", text: "10" },
          { id: "d", text: "0" },
        ],
        correct: "b",
        explanation: "Starting at 1, the accumulator is multiplied by each element: 1 → 2 → 6 → 24.",
        whyWrong: {
          a: "That is the sum. The callback multiplies.",
          c: "That would be the sum plus the starting value.",
          d: "Starting at 0 would give 0, but the starting value here is 1.",
        },
      },
      {
        id: "jsq29-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-foreach",
        prompt: "What does forEach return?",
        options: [
          { id: "a", text: "A new array" },
          { id: "b", text: "undefined" },
          { id: "c", text: "The first element" },
          { id: "d", text: "The number of elements" },
        ],
        correct: "b",
        explanation: "forEach is for side effects such as printing. It always returns undefined, so it cannot build a new array.",
        whyWrong: {
          a: "That is map.",
          c: "That is closer to find.",
          d: "That is length, a property rather than a method result.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l30-choosing-structures": {
    lessonId: "js-l30-choosing-structures",
    passMark: 70,
    questions: [
      {
        id: "jsq30-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-sort",
        prompt: "console.log([3, 20, 100].sort());\n\nWhat is printed?",
        options: [
          { id: "a", text: "[ 3, 20, 100 ]" },
          { id: "b", text: "[ 100, 20, 3 ]" },
          { id: "c", text: "[ 3, 100, 20 ]" },
          { id: "d", text: "TypeError: numbers cannot be sorted" },
        ],
        correct: "b",
        explanation: "With no compare function, sort compares the numbers as text: \"100\" < \"20\" < \"3\", character by character.",
        whyWrong: {
          a: "That would need .sort((a, b) => a - b).",
          c: "As text, \"1\" comes before \"2\" and \"3\", so 100 sorts first.",
          d: "sort works on any array; it just compares as text by default.",
        },
      },
      {
        id: "jsq30-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-some-every",
        prompt: "console.log([4, 6, 9].every((n) => n % 2 === 0));\n\nWhat is printed?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "[ true, true, false ]" },
          { id: "d", text: "9" },
        ],
        correct: "b",
        explanation: "every needs all elements to pass. 9 is odd, so the answer is false.",
        whyWrong: {
          a: "That would be the answer from some, since at least one is even.",
          c: "every returns a single boolean, not one per element.",
          d: "every returns true or false, not the failing element.",
        },
      },
      {
        id: "jsq30-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-set",
        prompt: "console.log(new Set([\"a\", \"b\", \"a\", \"a\"]).size);\n\nWhat is printed?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "2" },
          { id: "c", text: "3" },
          { id: "d", text: "1" },
        ],
        correct: "b",
        explanation: "A Set keeps each value once. There are two distinct values.",
        whyWrong: {
          a: "That counts the duplicates, which a Set discards.",
          c: "\"a\" appears three times but is stored once.",
          d: "\"b\" is also in the Set.",
        },
      },
      {
        id: "jsq30-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-choose-structure",
        prompt: "You need to look up a product's details instantly by its barcode, from a list loaded at start-up. Which structure fits best?",
        options: [
          { id: "a", text: "An array, searched with a loop every time" },
          { id: "b", text: "A Map from barcode to product object" },
          { id: "c", text: "A Set of barcodes" },
          { id: "d", text: "A single string of all the products" },
        ],
        correct: "b",
        explanation: "A Map gives a direct lookup by key. Each value is the product object with its details.",
        whyWrong: {
          a: "That works, but every lookup scans the whole list.",
          c: "A Set can say whether a barcode exists, but cannot hold the product details.",
          d: "You would have to parse the string on every lookup.",
        },
      },
    ],
  },
};
