/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 7 · ARRAYS & STRINGS
 *
 * Curriculum 7.1 – 7.10. The first data structure. Every snippet is executed
 * by the content validator in Node; printed arrays are kept short enough that
 * Node prints them on one line, so the in-browser runner shows the same thing.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s7-arrays-strings";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 7.1 – 7.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l23-arrays",
    moduleId: "js-w7-arrays-strings",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3"],
    title: "Data Structures and Arrays",
    subtitle: "Storing many values under one name",
    estimatedMinutes: 15,
    intro:
      "Every variable so far has held one value. A class has thirty scores; a shop has hundreds of products. Thirty variables called score1 to score30 would be unworkable. A data structure holds many values together, and the array is the first one every programmer learns.",

    atoms: [
      {
        id: "a-js-data-structures",
        title: "What data structures are",
        explain:
          "A data structure is a way of organising several values so they can be stored, found and changed efficiently. Different structures suit different jobs. JavaScript's two main ones are arrays (an ordered list, found by position) and objects (a collection of named values, found by name). Weeks 7 and 8 are about choosing between them.",
        table: {
          caption: "The structures you will use in this course.",
          headers: ["Structure", "Organised by", "Good for", "Week"],
          rows: [
            ["Array", "Position: 0, 1, 2…", "Ordered lists: scores, products, messages", "7"],
            ["Object", "Name: \"name\", \"age\"…", "One thing's details: a student, an order", "8"],
            ["Set", "Uniqueness", "Values with no duplicates", "8"],
            ["Map", "Any key", "Looking things up quickly by key", "8"],
          ],
        },
        why: "Choosing the right structure often decides whether a program is simple or painful. A list of thirty scores in an array can be averaged with one loop; in thirty separate variables it needs thirty additions written by hand.",
      },
      {
        id: "a-js-creating-arrays",
        title: "Creating arrays and reading elements",
        explain:
          "An array is written as values separated by commas inside square brackets. Each value is an element. Elements are numbered from 0, not 1: the first is at index 0, the second at index 1. Read an element by writing the array's name, then its index in square brackets.",
        code: {
          language: JS,
          code: 'const students = ["Ada", "Bisi", "Chidi"];\nconsole.log(students);\nconsole.log(students[0]);\nconsole.log(students[2]);\nconsole.log(students[3]);\n',
          expectedOutput: "[ 'Ada', 'Bisi', 'Chidi' ]\nAda\nChidi\nundefined",
        },
        why: "Asking for an index that does not exist gives undefined, not an error. That is convenient and dangerous in equal measure: a typo in an index silently produces undefined, which then spreads through the rest of the program.",
        mistake:
          "Expecting students[1] to be the first student. Counting from zero feels wrong for about a week and then becomes automatic. Until then, say \"index 0 is the first\" out loud.",
      },
      {
        id: "a-js-length-update",
        title: "length, the last element, and updating",
        explain:
          "Every array has a length property: the number of elements. Because indexes start at 0, the last element is at index length - 1. You can also use at(-1), which counts backwards from the end. To change an element, assign to its index.",
        code: {
          language: JS,
          code: 'const scores = [72, 65, 80];\nconsole.log(scores.length);\nconsole.log(scores[scores.length - 1]);\nconsole.log(scores.at(-1));\n\nscores[1] = 68;\nconsole.log(scores);\n',
          expectedOutput: "3\n80\n80\n[ 72, 68, 80 ]",
        },
        why: "The array was declared with const, and yet an element changed. const stops the NAME being pointed at a different array; it does not freeze the array itself. Week 9 explains this properly, under references.",
      },
      {
        id: "a-js-index-practice",
        title: "Index arithmetic",
        explain:
          "Indexes are just numbers, so they can be calculated. That is how you reach the middle of a list, or move one place along from a position you know.",
        codeExercise: {
          language: JS,
          code: 'const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];\nconst today = 2;\nconsole.log(days[today]);\nconsole.log(days[today + 1]);\nconsole.log(days[days.length - 2]);\nconsole.log(days.length);\n',
          question: "Work out each index before you look it up. What is printed?",
          expectedOutput: "Wed\nThu\nThu\n5",
          hint: "Index 0 is Mon. days.length is 5, so days.length - 2 is index 3.",
          successMessage: "Wed, Thu, Thu, 5. Two different expressions reached Thu, which is normal: an index is a number, and different arithmetic can land on the same one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 7.4 – 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l24-changing-arrays",
    moduleId: "js-w7-arrays-strings",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.4", "7.5", "7.6"],
    title: "Changing and Looping Through Arrays",
    subtitle: "push, pop, shift, unshift, slice, splice and every way to visit each item",
    estimatedMinutes: 17,
    intro:
      "Arrays grow and shrink as a program runs: items are added to a cart, messages arrive, tasks are completed. This lesson covers the methods that change an array, the one that copies part of it, and the loops that visit every element.",

    atoms: [
      {
        id: "a-js-push-pop",
        title: "push, pop, shift and unshift",
        explain:
          "Four methods add and remove elements at the ends of an array. push adds to the end and pop removes from the end. unshift adds to the start and shift removes from the start. All four change the original array. pop and shift return the element they removed; push and unshift return the new length.",
        table: {
          caption: "The four end methods.",
          headers: ["Method", "Where", "Does", "Returns"],
          rows: [
            ["push(x)", "End", "Adds x", "The new length"],
            ["pop()", "End", "Removes the last element", "The removed element"],
            ["unshift(x)", "Start", "Adds x", "The new length"],
            ["shift()", "Start", "Removes the first element", "The removed element"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'const queue = ["Ada", "Bisi"];\nqueue.push("Chidi");\nqueue.unshift("Zara");\nconst served = queue.shift();\nconst last = queue.pop();\nconsole.log(served);\nconsole.log(last);\nconsole.log(queue);\n',
          question: "Track the array after every line. What is printed?",
          expectedOutput: "Zara\nChidi\n[ 'Ada', 'Bisi' ]",
          hint: "After push and unshift the queue is Zara, Ada, Bisi, Chidi. Then shift removes the first and pop removes the last.",
          successMessage: "Zara, Chidi, and the queue is back to Ada and Bisi. A queue at a bank works exactly like this: join at the end with push, get served from the front with shift.",
        },
      },
      {
        id: "a-js-slice-splice",
        title: "slice() versus splice()",
        explain:
          "Two methods with almost the same name and opposite behaviour. slice(start, end) COPIES part of an array into a new array and leaves the original untouched; the end index is not included. splice(start, count) REMOVES count elements from the original array, changing it, and returns the removed ones. splice can also insert new elements at the same position.",
        code: {
          language: JS,
          code: 'const letters = ["a", "b", "c", "d", "e"];\n\nconst copy = letters.slice(1, 3);\nconsole.log(copy);\nconsole.log(letters);\n\nconst removed = letters.splice(1, 2);\nconsole.log(removed);\nconsole.log(letters);\n\nletters.splice(1, 0, "x", "y");\nconsole.log(letters);\n',
          expectedOutput: "[ 'b', 'c' ]\n[ 'a', 'b', 'c', 'd', 'e' ]\n[ 'b', 'c' ]\n[ 'a', 'd', 'e' ]\n[ 'a', 'x', 'y', 'd', 'e' ]",
        },
        table: {
          caption: "The difference that matters.",
          headers: ["", "slice(start, end)", "splice(start, count, …items)"],
          rows: [
            ["Changes the original?", "No", "Yes"],
            ["Second argument means", "Index to stop BEFORE", "How many to remove"],
            ["Returns", "A copy of the selected part", "The removed elements"],
            ["Can insert?", "No", "Yes, any extra arguments"],
          ],
        },
        mistake:
          "Using splice when you meant slice, and finding your original list has lost elements. If you only want to look at part of an array, slice. If you mean to cut it, splice.",
      },
      {
        id: "a-js-loop-for-index",
        title: "Looping with an index",
        explain:
          "The classic way to visit every element is a for loop whose counter runs from 0 up to, but not including, the length. Inside the loop, arr[i] is the current element and i is its position.",
        code: {
          language: JS,
          code: 'const items = ["Rice", "Beans", "Oil"];\nfor (let i = 0; i < items.length; i++) {\n  console.log(`${i + 1}. ${items[i]}`);\n}\n',
          expectedOutput: "1. Rice\n2. Beans\n3. Oil",
        },
        mistake:
          "Writing i <= items.length. On the last repetition i equals the length, items[i] is undefined, and you print \"4. undefined\". The off-by-one error from Week 2, in its most common form.",
      },
      {
        id: "a-js-for-of",
        title: "for…of: when you only need the values",
        explain:
          "for (const item of items) visits each element in order and gives you the element directly, with no counter and no index to get wrong. Use it whenever you need the values but not their positions. It is the safest and most readable loop for arrays.",
        codeExercise: {
          language: JS,
          code: "const prices = [1200, 450, 3000, 800];\nlet total = 0;\nlet expensive = 0;\nfor (const p of prices) {\n  total += p;\n  if (p >= 1000) expensive++;\n}\nconsole.log(total);\nconsole.log(expensive);\n",
          question: "The loop totals the prices and counts those of 1000 or more. What is printed?",
          expectedOutput: "5450\n2",
          hint: "Add all four prices. Then count how many are at least 1000.",
          successMessage: "5450 and 2. Running totals and counts inside one for…of loop are the shape of almost every list-processing task you will ever write.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 7.7 – 7.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l25-strings",
    moduleId: "js-w7-arrays-strings",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.7", "7.8"],
    title: "Working with Strings",
    subtitle: "Methods, searching, splitting and joining",
    estimatedMinutes: 15,
    intro:
      "A string behaves a lot like an array of characters: it has a length and its characters have indexes. Unlike an array, a string can never be changed in place. Every string method gives you a NEW string and leaves the original exactly as it was.",

    atoms: [
      {
        id: "a-js-string-methods",
        title: "Common string methods",
        explain:
          "Strings come with dozens of built-in methods. A handful cover most real work: changing case, trimming spaces, extracting part of a string, and replacing text. None of them change the original string; strings are immutable.",
        code: {
          language: JS,
          code: 'const raw = "  Lagos State  ";\nconst clean = raw.trim();\nconsole.log(clean);\nconsole.log(clean.toUpperCase());\nconsole.log(clean.length);\nconsole.log(clean[0], clean.at(-1));\nconsole.log(clean.slice(0, 5));\nconsole.log(clean.replace("State", "Island"));\nconsole.log(raw.length);\n',
          expectedOutput: "Lagos State\nLAGOS STATE\n11\nL e\nLagos\nLagos Island\n15",
        },
        why: "The last line proves immutability: raw still has its 15 characters, spaces and all. If you want the cleaned version, you must store what the method returns, as clean does. Forgetting to store the result is the commonest string bug there is.",
      },
      {
        id: "a-js-string-search",
        title: "Searching strings",
        explain:
          "includes() tells you whether a string contains some text. startsWith() and endsWith() check the ends. indexOf() tells you WHERE the text first appears, or -1 if it does not appear at all. All of these are case-sensitive, so convert both sides to lower case when case should not matter.",
        codeExercise: {
          language: JS,
          code: 'const email = "Ada.Obi@Memora.ng";\nconsole.log(email.includes("@"));\nconsole.log(email.indexOf("@"));\nconsole.log(email.endsWith(".ng"));\nconsole.log(email.includes("memora"));\nconsole.log(email.toLowerCase().includes("memora"));\n',
          question: "Watch the case on the fourth line. What is printed?",
          expectedOutput: "true\n7\ntrue\nfalse\ntrue",
          hint: "Count the characters before the @, starting from 0. And \"memora\" is not the same as \"Memora\".",
          successMessage: "true, 7, true, false, true. Searching user input without lowering the case first is why a search box fails to find \"lagos\" when the data says \"Lagos\".",
        },
      },
      {
        id: "a-js-split-join",
        title: "split() and join()",
        explain:
          "split(separator) breaks a string into an array of pieces wherever the separator appears. join(separator) does the reverse: it glues an array's elements into one string with the separator between them. Together they let you use every array tool on text.",
        code: {
          language: JS,
          code: 'const csv = "Ada,72,Lagos";\nconst parts = csv.split(",");\nconsole.log(parts);\nconsole.log(parts[1]);\n\nconst words = "the quick brown fox".split(" ");\nconsole.log(words.length);\nconsole.log(words.join("-"));\nconsole.log("hello".split("").join(" "));\n',
          expectedOutput: "[ 'Ada', '72', 'Lagos' ]\n72\n4\nthe-quick-brown-fox\nh e l l o",
        },
        mistake:
          "Forgetting that split always produces strings. parts[1] above is \"72\", text, not the number 72. Convert with Number() before doing arithmetic, exactly as in Week 4.",
      },
      {
        id: "a-js-string-reverse",
        title: "Combining split, array methods and join",
        explain:
          "Strings have no reverse() method, but arrays do. Split a string into characters, reverse the array, and join it back: three steps, each one a tool you already know. This pattern of converting to an array, working on it, and converting back is used constantly.",
        codeExercise: {
          language: JS,
          code: 'function reverse(text) {\n  return text.split("").reverse().join("");\n}\n\nfunction isPalindrome(word) {\n  const w = word.toLowerCase();\n  return w === reverse(w);\n}\n\nconsole.log(reverse("Memora"));\nconsole.log(isPalindrome("Level"));\nconsole.log(isPalindrome("Lagos"));\n',
          question: "A palindrome reads the same forwards and backwards. What is printed?",
          expectedOutput: "aromeM\ntrue\nfalse",
          hint: "Reverse \"Memora\" letter by letter, keeping each letter's case. \"Level\" becomes \"level\" before it is compared.",
          successMessage: "aromeM, true, false. Three chained methods in one line: each returns a value that the next one works on.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 7.9 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l26-grids-problems",
    moduleId: "js-w7-arrays-strings",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.9", "7.10"],
    title: "Grids and Classic Problems",
    subtitle: "Arrays of arrays, and the problems every developer solves",
    estimatedMinutes: 18,
    intro:
      "An array can hold anything, including other arrays. That gives you grids: seating plans, game boards, timetables, spreadsheets. Then the problems that come up in every job and every interview: finding the largest, counting, searching and removing duplicates.",

    atoms: [
      {
        id: "a-js-2d-arrays",
        title: "Multidimensional arrays",
        explain:
          "A two-dimensional array is an array whose elements are arrays. Think of each inner array as a row. grid[row] gives you a whole row, and grid[row][col] gives you one cell: first pick the row, then the position within it.",
        code: {
          language: JS,
          code: "const grid = [\n  [1, 2, 3],\n  [4, 5, 6],\n  [7, 8, 9],\n];\n\nconsole.log(grid[1]);\nconsole.log(grid[1][2]);\nconsole.log(grid[2][0]);\nconsole.log(grid.length, grid[0].length);\n",
          expectedOutput: "[ 4, 5, 6 ]\n6\n7\n3 3",
        },
        why: "Rows then columns, always in that order. grid.length is the number of rows; grid[0].length is the number of columns in the first row. A spreadsheet, a chessboard and a cinema seating plan are all this shape.",
      },
      {
        id: "a-js-2d-loops",
        title: "Looping through a grid",
        explain:
          "To visit every cell, use nested loops from Week 5: the outer loop goes through the rows, the inner loop goes through the cells in the current row.",
        codeExercise: {
          language: JS,
          code: "const seats = [\n  [1, 0, 1],\n  [0, 0, 1],\n  [1, 1, 1],\n];\n\nlet booked = 0;\nfor (const row of seats) {\n  for (const seat of row) {\n    if (seat === 1) booked++;\n  }\n}\nconsole.log(booked);\nconsole.log(seats[1].indexOf(0));\n",
          question: "1 means booked and 0 means free. What is printed?",
          expectedOutput: "6\n0",
          hint: "Count the 1s row by row: 2, then 1, then 3. Then find the first free seat in row 1, the middle row.",
          successMessage: "6 booked, and the first free seat in the middle row is at index 0. Nested for…of loops visit every cell without a single index to get wrong.",
        },
      },
      {
        id: "a-js-find-max",
        title: "Finding the largest and smallest",
        explain:
          "To find the largest value, start by assuming the first element is the largest, then walk through the rest, replacing your answer whenever you find something bigger. The same shape finds the smallest, the longest name or the most recent date. Math.max(...arr) does it in one line, using the spread syntax from next week.",
        code: {
          language: JS,
          code: "const scores = [72, 65, 91, 58, 84];\nlet highest = scores[0];\nlet lowest = scores[0];\nfor (const s of scores) {\n  if (s > highest) highest = s;\n  if (s < lowest) lowest = s;\n}\nconsole.log(highest, lowest);\nconsole.log(Math.max(...scores));\n",
          expectedOutput: "91 58\n91",
        },
        mistake:
          "Starting with let highest = 0. It works for scores, but for a list of temperatures that are all below zero it reports 0, a value that is not in the list at all. Starting from the first element works for any list.",
      },
      {
        id: "a-js-word-counter",
        title: "Counting: the word counter",
        explain:
          "Counting words combines this week's tools: clean the text, split it into words, then loop and count. Here it counts the total words and how many times one chosen word appears.",
        codeExercise: {
          language: JS,
          code: 'const text = "  The cat sat on the mat. The end.  ";\nconst words = text\n  .trim()\n  .toLowerCase()\n  .replaceAll(".", "")\n  .split(" ");\n\nlet theCount = 0;\nfor (const w of words) {\n  if (w === "the") theCount++;\n}\n\nconsole.log(words.length);\nconsole.log(theCount);\n',
          question: "The text is cleaned, lower-cased, stripped of full stops and split on spaces. What is printed?",
          expectedOutput: "8\n3",
          hint: "After cleaning: \"the cat sat on the mat the end\". Count the words, then count the times \"the\" appears.",
          successMessage: "8 words, 3 of them \"the\". Without toLowerCase, \"The\" and \"the\" would be counted as different words, and the count would be wrong.",
        },
      },
      {
        id: "a-js-duplicates",
        title: "Searching and removing duplicates",
        explain:
          "includes() checks whether a value is already in an array. That gives a simple way to remove duplicates: build a new array, and only push each value if it is not already there. Next week you will meet Set, which does this in one line, but writing it by hand first shows what it does.",
        code: {
          language: JS,
          code: 'const cart = ["rice", "oil", "rice", "salt", "oil"];\nconst unique = [];\nfor (const item of cart) {\n  if (!unique.includes(item)) {\n    unique.push(item);\n  }\n}\nconsole.log(unique);\nconsole.log(`${cart.length - unique.length} duplicates removed`);\n',
          expectedOutput: "[ 'rice', 'oil', 'salt' ]\n2 duplicates removed",
        },
        why: "Notice the original cart is untouched: the result is a new array. Building new results instead of changing the input is a habit that prevents a whole class of bugs, and it is how the array methods next week all work.",
      },
    ],

    task: {
      title: "This week's projects",
      intro: "Build all three, each in its own file, each made of small functions that take parameters and return results.",
      prompts: [
        "Student score analyser: given an array of scores, write functions that return the average, highest, lowest, how many passed (50 or more) and the scores sorted from highest to lowest. Print a short report.",
        "Word counter: given a paragraph, return the total word count, the number of unique words, the longest word and how many times a chosen word appears, ignoring case and punctuation.",
        "Shopping list manager: keep a list in an array and write addItem, removeItem (using splice and indexOf), hasItem, and printList functions. Refuse to add duplicates and print a clear message when removing an item that is not there.",
        "Extension: store a weekly timetable as a two-dimensional array (days × periods) and print it as an aligned table with nested loops.",
      ],
      closing:
        "For each function, test the empty case: an empty list of scores, an empty paragraph, removing from an empty list. Most real bugs live there.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
