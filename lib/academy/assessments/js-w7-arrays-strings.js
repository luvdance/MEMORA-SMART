/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 7
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l23-arrays": {
    lessonId: "js-l23-arrays",
    passMark: 70,
    questions: [
      {
        id: "jsq23-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-data-structures",
        prompt: "Which data structure fits an ordered list of thirty exam scores?",
        options: [
          { id: "a", text: "Thirty separate variables" },
          { id: "b", text: "An array" },
          { id: "c", text: "A single string" },
          { id: "d", text: "A boolean" },
        ],
        correct: "b",
        explanation: "An array keeps many values in order under one name, so they can be looped over, averaged and sorted.",
        whyWrong: {
          a: "Thirty variables cannot be looped over, and every calculation has to name each one by hand.",
          c: "A string holds text. You would have to split it apart every time you wanted a score.",
          d: "A boolean holds only true or false.",
        },
      },
      {
        id: "jsq23-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-creating-arrays",
        prompt: "const colours = [\"red\", \"green\", \"blue\"];\nconsole.log(colours[1]);\n\nWhat is printed?",
        options: [
          { id: "a", text: "red" },
          { id: "b", text: "green" },
          { id: "c", text: "blue" },
          { id: "d", text: "undefined" },
        ],
        correct: "b",
        explanation: "Indexes start at 0, so index 1 is the second element.",
        whyWrong: {
          a: "red is at index 0.",
          c: "blue is at index 2.",
          d: "Index 1 exists; undefined only comes from an index past the end.",
        },
      },
      {
        id: "jsq23-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-length-update",
        prompt: "Which expression always gives the last element of an array called list?",
        options: [
          { id: "a", text: "list[list.length]" },
          { id: "b", text: "list[list.length - 1]" },
          { id: "c", text: "list[-1]" },
          { id: "d", text: "list.last" },
        ],
        correct: "b",
        explanation: "Indexes run from 0 to length - 1, so the last one is at length - 1. list.at(-1) also works.",
        whyWrong: {
          a: "list.length is one past the last index, so it gives undefined.",
          c: "Square brackets do not count backwards in JavaScript; list[-1] is undefined. Use list.at(-1).",
          d: "Arrays have no last property.",
        },
      },
      {
        id: "jsq23-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-length-update",
        prompt: "const a = [10, 20, 30];\na[0] = 99;\nconsole.log(a);\n\nWhat happens?",
        options: [
          { id: "a", text: "TypeError, because a is const" },
          { id: "b", text: "It prints [ 99, 20, 30 ]" },
          { id: "c", text: "It prints [ 10, 20, 30 ]" },
          { id: "d", text: "It prints [ 99, 10, 20, 30 ]" },
        ],
        correct: "b",
        explanation: "const stops a from being pointed at a different array, but the array itself can still be changed. Assigning to an index replaces that element.",
        whyWrong: {
          a: "Only reassigning a itself, as in a = [], is forbidden by const.",
          c: "The assignment does change element 0.",
          d: "Assigning to an index replaces; it does not insert.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l24-changing-arrays": {
    lessonId: "js-l24-changing-arrays",
    passMark: 70,
    questions: [
      {
        id: "jsq24-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-push-pop",
        prompt: "const s = [1, 2, 3];\nconst x = s.pop();\nconsole.log(x, s);\n\nWhat is printed?",
        options: [
          { id: "a", text: "3 [ 1, 2 ]" },
          { id: "b", text: "1 [ 2, 3 ]" },
          { id: "c", text: "2 [ 1, 2 ]" },
          { id: "d", text: "3 [ 1, 2, 3 ]" },
        ],
        correct: "a",
        explanation: "pop removes the last element from the original array and returns it.",
        whyWrong: {
          b: "That is what shift does: remove from the start.",
          c: "pop returns the removed element, which is 3, and the array becomes [1, 2].",
          d: "pop changes the original array.",
        },
      },
      {
        id: "jsq24-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-slice-splice",
        prompt: "const n = [1, 2, 3, 4, 5];\nconst part = n.slice(1, 4);\nconsole.log(part, n.length);\n\nWhat is printed?",
        options: [
          { id: "a", text: "[ 2, 3, 4 ] 5" },
          { id: "b", text: "[ 2, 3, 4, 5 ] 5" },
          { id: "c", text: "[ 2, 3, 4 ] 2" },
          { id: "d", text: "[ 1, 2, 3, 4 ] 5" },
        ],
        correct: "a",
        explanation: "slice copies from index 1 up to but not including index 4, and leaves the original with all 5 elements.",
        whyWrong: {
          b: "The end index is not included, so index 4 (the 5) is left out.",
          c: "slice never changes the original. That length would follow splice.",
          d: "slice starts at index 1, which is the 2.",
        },
      },
      {
        id: "jsq24-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-slice-splice",
        prompt: "You want to delete the third item from a to-do list array. Which call does it?",
        options: [
          { id: "a", text: "list.slice(2, 1)" },
          { id: "b", text: "list.splice(2, 1)" },
          { id: "c", text: "list.splice(3, 1)" },
          { id: "d", text: "list.pop(3)" },
        ],
        correct: "b",
        explanation: "The third item is at index 2. splice(2, 1) removes one element starting there, changing the list.",
        whyWrong: {
          a: "slice copies and never removes anything.",
          c: "Index 3 is the fourth item.",
          d: "pop ignores its argument and always removes the last element.",
        },
      },
      {
        id: "jsq24-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-loop-for-index",
        prompt: "const a = [\"x\", \"y\"];\nfor (let i = 0; i <= a.length; i++) { console.log(a[i]); }\n\nWhat is printed?",
        options: [
          { id: "a", text: "x then y" },
          { id: "b", text: "x, y, then undefined" },
          { id: "c", text: "An error" },
          { id: "d", text: "y then x" },
        ],
        correct: "b",
        explanation: "<= lets i reach 2, which is past the last index, so the third repetition prints undefined. Use i < a.length.",
        whyWrong: {
          a: "That needs i < a.length.",
          c: "Reading past the end gives undefined rather than throwing.",
          d: "The loop counts upwards from 0.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l25-strings": {
    lessonId: "js-l25-strings",
    passMark: 70,
    questions: [
      {
        id: "jsq25-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-string-methods",
        prompt: "let name = \"ada\";\nname.toUpperCase();\nconsole.log(name);\n\nWhat is printed?",
        options: [
          { id: "a", text: "ADA" },
          { id: "b", text: "ada" },
          { id: "c", text: "Ada" },
          { id: "d", text: "undefined" },
        ],
        correct: "b",
        explanation: "Strings are immutable. toUpperCase returns a new string, which was thrown away because it was not stored. name is unchanged.",
        whyWrong: {
          a: "That needs name = name.toUpperCase(); to store the result.",
          c: "toUpperCase converts every letter, and in any case its result was not stored.",
          d: "name still holds its original string.",
        },
      },
      {
        id: "jsq25-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-string-search",
        prompt: "console.log(\"banana\".indexOf(\"z\"));\n\nWhat is printed?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "-1" },
          { id: "c", text: "undefined" },
          { id: "d", text: "false" },
        ],
        correct: "b",
        explanation: "indexOf returns -1 when the text is not found. That is why checks are written as indexOf(x) !== -1, or more clearly with includes.",
        whyWrong: {
          a: "0 would mean it was found at the very start.",
          c: "indexOf always returns a number.",
          d: "includes returns booleans. indexOf returns a position.",
        },
      },
      {
        id: "jsq25-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-split-join",
        prompt: "console.log(\"2026-10-17\".split(\"-\"));\n\nWhat is printed?",
        options: [
          { id: "a", text: "[ '2026', '10', '17' ]" },
          { id: "b", text: "[ 2026, 10, 17 ]" },
          { id: "c", text: "2026 10 17" },
          { id: "d", text: "[ '2026-10-17' ]" },
        ],
        correct: "a",
        explanation: "split breaks the string at every - and always produces an array of strings.",
        whyWrong: {
          b: "split produces strings, not numbers. Convert them with Number() if you need to calculate.",
          c: "split returns an array, which console.log shows in brackets.",
          d: "That is what you would get if the separator never appeared.",
        },
      },
      {
        id: "jsq25-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-string-reverse",
        prompt: "console.log([\"a\", \"b\", \"c\"].reverse().join(\"\"));\n\nWhat is printed?",
        options: [
          { id: "a", text: "abc" },
          { id: "b", text: "cba" },
          { id: "c", text: "c,b,a" },
          { id: "d", text: "[ 'c', 'b', 'a' ]" },
        ],
        correct: "b",
        explanation: "reverse flips the array, and join(\"\") glues the elements together with nothing between them.",
        whyWrong: {
          a: "reverse runs before join.",
          c: "join(\"\") uses an empty separator. join() with no argument would use commas.",
          d: "join returns a string, not an array.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l26-grids-problems": {
    lessonId: "js-l26-grids-problems",
    passMark: 70,
    questions: [
      {
        id: "jsq26-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-2d-arrays",
        prompt: "const g = [[\"a\", \"b\"], [\"c\", \"d\"], [\"e\", \"f\"]];\nconsole.log(g[2][1]);\n\nWhat is printed?",
        options: [
          { id: "a", text: "d" },
          { id: "b", text: "f" },
          { id: "c", text: "e" },
          { id: "d", text: "c" },
        ],
        correct: "b",
        explanation: "g[2] is the third row, [\"e\", \"f\"], and [1] is its second element.",
        whyWrong: {
          a: "That is g[1][1], the second row.",
          c: "That is g[2][0].",
          d: "That is g[1][0].",
        },
      },
      {
        id: "jsq26-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-2d-loops",
        prompt: "A grid has 4 rows of 5 cells. Visiting every cell with nested loops runs the inner body how many times?",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "20" },
          { id: "c", text: "5" },
          { id: "d", text: "4" },
        ],
        correct: "b",
        explanation: "The inner loop runs 5 times for each of the 4 rows: 4 × 5 = 20.",
        whyWrong: {
          a: "Nested loops multiply, not add.",
          c: "That is one row.",
          d: "That is the number of rows.",
        },
      },
      {
        id: "jsq26-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-find-max",
        prompt: "Temperatures are [-5, -2, -9]. A function starts with let max = 0 and replaces it with any larger value. What does it return?",
        options: [
          { id: "a", text: "-2" },
          { id: "b", text: "0" },
          { id: "c", text: "-9" },
          { id: "d", text: "-5" },
        ],
        correct: "b",
        explanation: "No temperature is greater than 0, so max is never replaced, and it returns 0, which is not even in the list. Start from the first element instead.",
        whyWrong: {
          a: "-2 is the true maximum, but -2 > 0 is false, so it never replaces the starting 0.",
          c: "-9 is the smallest value.",
          d: "-5 is never compared favourably against 0 either.",
        },
      },
      {
        id: "jsq26-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-duplicates",
        prompt: "const out = [];\nfor (const x of [3, 1, 3, 2, 1]) { if (!out.includes(x)) out.push(x); }\nconsole.log(out);\n\nWhat is printed?",
        options: [
          { id: "a", text: "[ 3, 1, 2 ]" },
          { id: "b", text: "[ 1, 2, 3 ]" },
          { id: "c", text: "[ 3, 1, 3, 2, 1 ]" },
          { id: "d", text: "[ 3 ]" },
        ],
        correct: "a",
        explanation: "Each value is pushed the first time it is seen, so the result keeps the original order without duplicates.",
        whyWrong: {
          b: "Nothing sorts the values; they stay in the order first seen.",
          c: "The includes check skips the repeats.",
          d: "Values are only skipped if already present, and 1 and 2 are new.",
        },
      },
    ],
  },
};
