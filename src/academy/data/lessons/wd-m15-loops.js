/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 15 · LOOPS AND REPETITION
 *
 * Curriculum 15.1 – 15.10. Why loops exist; for, while and do...while;
 * counting and accumulating; loop conditions, break and continue; nested
 * loops; infinite loops and how to prevent them; and solving problems by
 * iteration. The labs run in the page with loop protection, so a learner's
 * infinite loop is stopped and reported rather than freezing the lesson.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s15-loops";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 15.1 – 15.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l64-loops",
    moduleId: "wd-m15-loops",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4"],
    title: "for, while and do...while",
    subtitle: "Repeating instructions without repeating code",
    estimatedMinutes: 24,
    intro: "Computers are good at doing the same thing many times without getting bored or making mistakes. Loops are how you tell them to, whether the number of repetitions is known in advance or not.",

    atoms: [
      {
        id: "a-wd-why-loops",
        title: "Why loops are needed",
        explain:
          "Printing a times table by writing twelve console.log lines works, once. Then the client wants the 7 times table, then up to 20, then every table. A loop writes the instruction once and repeats it, with a counter that changes each time. Any time you find yourself copying a line and changing one number, you want a loop.",
        example:
          "// Without a loop: twelve nearly identical lines\nconsole.log(\"7 x 1 = 7\");\nconsole.log(\"7 x 2 = 14\");\n…\n\n// With a loop: one line, repeated twelve times\nfor (let i = 1; i <= 12; i++) {\n  console.log(\"7 x \" + i + \" = \" + 7 * i);\n}",
      },
      {
        id: "a-wd-for",
        title: "for loops",
        explain:
          "A for loop has three parts in its brackets: a start (let i = 1), a condition checked before every repetition (i <= 5), and an update run after every repetition (i++). The body runs while the condition is true. Use for when you know how many times to repeat, or are counting through a range.",
        codeExercise: {
          language: JS,
          code: "for (let i = 1; i <= 4; i++) {\n  console.log(\"Round \" + i);\n}\nconsole.log(\"Done\");\n",
          question: "What does the loop print?",
          expectedOutput: "Round 1\nRound 2\nRound 3\nRound 4\nDone",
          hint: "i starts at 1 and the loop stops when i <= 4 becomes false.",
          successMessage: "Four rounds: when i becomes 5, the condition is false and the loop ends.",
        },
      },
      {
        id: "a-wd-while",
        title: "while loops",
        explain:
          "while (condition) { … } repeats as long as the condition is true, checking before each repetition. Use it when you do not know in advance how many times: keep doubling until a target is passed, keep asking until the answer is valid. Something inside the loop must eventually make the condition false.",
        codeExercise: {
          language: JS,
          code: "let savings = 1000;\nlet years = 0;\nwhile (savings < 2000) {\n  savings = savings * 1.5;\n  years++;\n}\nconsole.log(years, savings);\n",
          question: "Savings grow by 50% a year. How many years until they reach ₦2,000, and how much is there then?",
          expectedOutput: "2 2250",
          hint: "1000, then 1500 (still under 2000), then 2250.",
          successMessage: "Two years. You did not know the number of repetitions in advance; the condition decided. That is when while fits.",
        },
      },
      {
        id: "a-wd-do-while",
        title: "do...while",
        explain:
          "do { … } while (condition); runs the body FIRST and checks the condition afterwards, so the body always runs at least once. That suits \"do this, then repeat if needed\": show a menu and ask again if the choice was invalid. It is the least common of the three.",
        webLab: {
          task:
            "Write two functions. sumTo(n) uses a for loop to add up every whole number from 1 to n (sumTo(4) is 1 + 2 + 3 + 4 = 10). yearsToDouble(amount, rate) uses a while loop to count how many years an amount growing by rate percent a year takes to reach at least double (yearsToDouble(1000, 50) is 2).",
          files: { "app.js": "function sumTo(n) {\n}\n\nfunction yearsToDouble(amount, rate) {\n}\n" },
          tests: [
            { label: "sumTo(4) is 10 and sumTo(100) is 5050", check: "return sumTo(4) === 10 && sumTo(100) === 5050;", fail: "Start a total at 0 and add i to it for every i from 1 to n." },
            { label: "sumTo(0) is 0 and sumTo(1) is 1", check: "return sumTo(0) === 0 && sumTo(1) === 1;", fail: "With n = 0 the loop should not run at all, leaving the total at 0." },
            { label: "sumTo uses a for loop", check: "return /for\\s*\\(/.test(code('app.js'));", fail: "Write sumTo with a for loop." },
            { label: "yearsToDouble(1000, 50) is 2 and yearsToDouble(1000, 10) is 8", check: "return yearsToDouble(1000, 50) === 2 && yearsToDouble(1000, 10) === 8;", fail: "Keep multiplying by (1 + rate / 100) and counting years while the value is under double the start." },
            { label: "yearsToDouble uses a while loop", check: "return /while\\s*\\(/.test(code('app.js'));", fail: "Write yearsToDouble with a while loop." },
          ],
          solution: { "app.js": "function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n\nfunction yearsToDouble(amount, rate) {\n  let value = amount;\n  let years = 0;\n  while (value < amount * 2) {\n    value = value * (1 + rate / 100);\n    years++;\n  }\n  return years;\n}\n" },
          hint: "Both functions keep a variable outside the loop (total, years) that the loop updates, and return it after the loop.",
          successMessage: "for when you know the range; while when the condition decides. Both keep a running value outside the loop.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 15.5 – 15.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l65-accumulate",
    moduleId: "wd-m15-loops",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.5", "15.6", "15.7"],
    title: "Counting, Accumulating, break and continue",
    subtitle: "The patterns inside almost every loop",
    estimatedMinutes: 22,
    intro: "Most loops do one of a few jobs: count things, add things up, find something, or skip some things. These patterns are so common that once you know them, most loops write themselves.",

    atoms: [
      {
        id: "a-wd-count-accumulate",
        title: "Counting and accumulating values",
        explain:
          "Two patterns cover most loops. A counter starts at 0 and goes up by one when something is true: how many students passed. An accumulator starts at a neutral value (0 for a sum, 1 for a product, \"\" for text) and combines each item into it: the total of all sales. Both are declared before the loop with let and read after it.",
        codeExercise: {
          language: JS,
          code: "const scores = [72, 45, 88, 50, 39];\nlet passed = 0;\nlet total = 0;\nfor (const score of scores) {\n  total += score;\n  if (score >= 50) {\n    passed++;\n  }\n}\nconsole.log(passed, total);\n",
          question: "for...of goes through each score in turn. How many passed, and what is the total?",
          expectedOutput: "3 294",
          hint: "72, 88 and 50 are 50 or more. Add all five for the total.",
          successMessage: "A counter and an accumulator in the same loop. (Arrays are Module 17; for...of simply visits each item.)",
        },
      },
      {
        id: "a-wd-loop-conditions",
        title: "Loop conditions",
        explain:
          "The condition decides how many times the body runs, and off-by-one errors live here: i < 5 runs for 0 to 4 (five times from 0), i <= 5 runs one more time. When counting through an array of length n, start at 0 and use i < n, because the last index is n - 1. Check any loop by asking: what is the first value, the last value, and how many repetitions?",
        codeExercise: {
          language: JS,
          code: "let a = 0;\nfor (let i = 0; i < 5; i++) {\n  a++;\n}\nlet b = 0;\nfor (let i = 0; i <= 5; i++) {\n  b++;\n}\nconsole.log(a, b);\n",
          question: "How many times does each loop run?",
          expectedOutput: "5 6",
          hint: "List the values of i in each loop: 0, 1, 2…",
          successMessage: "5 and 6. One character, < or <=, is the difference: the most common loop bug there is.",
        },
      },
      {
        id: "a-wd-break-continue",
        title: "break and continue",
        explain:
          "break ends the whole loop immediately: use it when you have found what you were looking for. continue skips the rest of the current repetition and moves on to the next: use it to ignore items you do not want. Both make the intent clear when used sparingly.",
        webLab: {
          task:
            "Write three functions over an array of numbers. countPassed(scores) counts scores of 50 or more. firstOver(values, limit) returns the first value greater than limit, using break, or null if there is none. sumPositive(values) adds up only the positive numbers, using continue to skip the others.",
          files: { "app.js": "function countPassed(scores) {\n}\n\nfunction firstOver(values, limit) {\n}\n\nfunction sumPositive(values) {\n}\n" },
          tests: [
            { label: "countPassed([72, 45, 88, 50, 39]) is 3, and [] gives 0", check: "return countPassed([72, 45, 88, 50, 39]) === 3 && countPassed([]) === 0;", fail: "Start a counter at 0 and add one for each score >= 50." },
            { label: "firstOver([3, 9, 12, 20], 10) is 12", check: "return firstOver([3, 9, 12, 20], 10) === 12;", fail: "Return the first value greater than the limit, not the largest." },
            { label: "firstOver returns null when nothing is over the limit", check: "return firstOver([1, 2, 3], 10) === null;", fail: "If the loop ends without finding one, return null." },
            { label: "firstOver uses break", check: "return /\\bbreak\\b/.test(code('app.js'));", fail: "Store the value and break out of the loop when you find it." },
            { label: "sumPositive([5, -2, 10, 0, -7]) is 15, using continue", check: "return sumPositive([5, -2, 10, 0, -7]) === 15 && /\\bcontinue\\b/.test(code('app.js'));", fail: "Skip values that are not positive with continue, and add the rest." },
          ],
          solution: { "app.js": "function countPassed(scores) {\n  let count = 0;\n  for (const score of scores) {\n    if (score >= 50) count++;\n  }\n  return count;\n}\n\nfunction firstOver(values, limit) {\n  let found = null;\n  for (const v of values) {\n    if (v > limit) {\n      found = v;\n      break;\n    }\n  }\n  return found;\n}\n\nfunction sumPositive(values) {\n  let total = 0;\n  for (const v of values) {\n    if (v <= 0) continue;\n    total += v;\n  }\n  return total;\n}\n" },
          hint: "Use for (const v of values) to visit each number. break leaves the loop; continue goes straight to the next v.",
          successMessage: "Counting, finding and filtering: three of the most common jobs a loop does, each with its natural tool.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 15.8 – 15.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l66-nested-infinite",
    moduleId: "wd-m15-loops",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.8", "15.9", "15.10"],
    title: "Nested Loops, Infinite Loops and Iteration",
    subtitle: "Loops inside loops, loops that never stop, and thinking in repetitions",
    estimatedMinutes: 24,
    intro: "Grids need a loop inside a loop. Every programmer writes an infinite loop sooner or later. And many problems that look hard are just a loop asked the right question.",

    atoms: [
      {
        id: "a-wd-nested-loops",
        title: "Nested loops",
        explain:
          "A loop inside another loop runs completely for every single repetition of the outer one: an outer loop of 3 and an inner loop of 4 run the inner body 12 times. Use nested loops for anything with rows and columns: a times-table grid, seats in a cinema, cells on a board. Give the counters meaningful names (row and col) instead of i and j.",
        codeExercise: {
          language: JS,
          code: "for (let row = 1; row <= 3; row++) {\n  let line = \"\";\n  for (let col = 1; col <= 3; col++) {\n    line += row * col + \" \";\n  }\n  console.log(line.trim());\n}\n",
          question: "What grid does this print?",
          expectedOutput: "1 2 3\n2 4 6\n3 6 9",
          hint: "For each row, the inner loop builds one line of three products.",
          successMessage: "A 3 by 3 times table: the inner loop builds a row, the outer loop repeats it for each row.",
        },
      },
      {
        id: "a-wd-infinite-loops",
        title: "Infinite loops and how to prevent them",
        explain:
          "An infinite loop is one whose condition never becomes false, usually because the counter is never updated, is updated the wrong way, or the condition can never be reached (counting up while waiting for a number below zero). In a browser it freezes the tab. Prevent them: make sure every while loop changes something its condition depends on, check that the change moves towards the end, and for loops that depend on input, guard against inputs (such as 0 or a negative step) that could never finish. The practice page here stops any loop that runs longer than 1.5 seconds.",
        decision: {
          scenario: "let i = 10; while (i > 0) { console.log(i); i++; } freezes the page.",
          question: "Why?",
          options: [
            { id: "a", text: "i goes up, away from 0, so i > 0 stays true forever; it should be i--", why: "The update moves away from the exit. Every loop's update must move towards making the condition false." },
            { id: "b", text: "console.log is too slow", whyWrong: "It is slow-ish, but the loop would never end even without it." },
            { id: "c", text: "while loops always freeze", whyWrong: "They end when their condition becomes false." },
            { id: "d", text: "i must start at 0", whyWrong: "Starting at 10 is fine for a countdown; the direction of the update is the bug." },
          ],
          correct: "a",
          aftermath: "Before running a while loop, ask: what changes each time, and does it bring me closer to the exit?",
        },
      },
      {
        id: "a-wd-iteration-problems",
        title: "Solving problems with iteration",
        explain:
          "Many problems are solved by trying each possibility, or each step, in turn: how many months until a savings goal is reached, what is the largest number in a list, how many times does a letter appear. The recipe: decide what changes each repetition, what you keep track of, and what tells you to stop. Then check the edge cases: nothing to do at all, and inputs that would never finish.",
        webLab: {
          task:
            "This savings planner should return how many months it takes to save a goal by adding the same amount each month: monthsToGoal(10000, 3000) is 4 (3000, 6000, 9000, 12000). It currently loops forever, so the practice page stops it. Fix the loop, and add a guard so that a monthly amount of 0 or less returns -1 instead of looping forever. A goal of 0 or less needs 0 months.",
          files: { "app.js": "function monthsToGoal(goal, monthly) {\n  let saved = 0;\n  let months = 0;\n  while (saved < goal) {\n    months++;\n  }\n  return months;\n}\n" },
          tests: [
            { label: "monthsToGoal(10000, 3000) is 4", check: "return monthsToGoal(10000, 3000) === 4;", fail: "Inside the loop, add the monthly amount to saved each time as well as counting the month." },
            { label: "Exact amounts: monthsToGoal(9000, 3000) is 3", check: "return monthsToGoal(9000, 3000) === 3;", fail: "Stop as soon as saved reaches the goal: the condition is saved < goal." },
            { label: "A goal of 0 needs 0 months", check: "return monthsToGoal(0, 500) === 0;", fail: "When the goal is already met, the loop should not run at all." },
            { label: "A monthly amount of 0 or less returns -1 instead of looping forever", check: "return monthsToGoal(5000, 0) === -1 && monthsToGoal(5000, -100) === -1;", fail: "Add a guard at the top: if (monthly <= 0) return -1; (unless the goal is already met)." },
            { label: "Nothing in the page hit the infinite-loop limit", check: "return errors().length === 0;", fail: "A loop was stopped for running too long. Check that saved changes inside the loop." },
          ],
          solution: { "app.js": "function monthsToGoal(goal, monthly) {\n  if (goal <= 0) return 0;\n  if (monthly <= 0) return -1;\n  let saved = 0;\n  let months = 0;\n  while (saved < goal) {\n    saved += monthly;\n    months++;\n  }\n  return months;\n}\n" },
          hint: "Two fixes: something inside the loop must change saved, and the guards must run before the loop.",
          successMessage: "A loop that always finishes: it moves towards its exit every time, and refuses inputs that could never get there.",
        },
      },
    ],

    task: {
      title: "Module project: a savings planner",
      intro: "Write planSavings(goal, monthly, interestPercent) on your own computer.",
      prompts: [
        "Guard against inputs that could never finish, returning a clear message.",
        "Each month, add interest on the current balance, then add the monthly amount.",
        "Print one line per month, such as \"Month 3: ₦9,270\", until the goal is reached.",
        "Return the number of months and the final balance.",
        "Print a 12 by 12 times table with nested loops as a warm-up, then test the planner with five different inputs including 0 and negative amounts.",
      ],
      closing: "Next module: packaging logic into reusable functions.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
