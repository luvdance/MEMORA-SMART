/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 5 · CONDITIONAL STATEMENTS & LOOPS
 *
 * Curriculum 5.1 – 5.10. Selection and iteration from Week 2, now in
 * JavaScript. Every snippet is executed by the content validator in Node.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s5-control";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l15-decisions",
    moduleId: "js-w5-control",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Making Decisions",
    subtitle: "Boolean expressions, if, else if, else, and nesting",
    estimatedMinutes: 15,
    intro:
      "In Week 2 you wrote IF … THEN … ELSE … END IF. JavaScript writes the same thing with braces. The logic is identical, which is the whole point of having learned it first: this lesson is mostly translation.",

    atoms: [
      {
        id: "a-js-boolean-expressions",
        title: "Boolean expressions",
        explain:
          "A boolean expression is any expression that produces true or false. Comparisons (===, >, <=) produce booleans, and so do the logical operators that combine them. Every if statement is controlled by a boolean expression, so the quality of your conditions decides the quality of your decisions.",
        codeExercise: {
          language: JS,
          code: 'const score = 72;\nconst attendance = 0.68;\n\nconsole.log(score >= 50);\nconsole.log(attendance >= 0.75);\nconsole.log(score >= 50 && attendance >= 0.75);\nconsole.log(score >= 70 || attendance >= 0.75);\n',
          question: "A student needs 50 to pass and 75% attendance to be eligible. Evaluate each condition. What is printed?",
          expectedOutput: "true\nfalse\nfalse\ntrue",
          hint: "0.68 is 68%, which is below 0.75. && needs both sides true; || needs one.",
          successMessage: "true, false, false, true. Breaking a long rule into named boolean expressions like these is how you debug a condition that is not doing what you expect.",
        },
        why: "When a condition misbehaves, print each part of it separately, exactly as above. It is the trace table applied to one line.",
      },
      {
        id: "a-js-if-else",
        title: "if, else if and else",
        explain:
          "if runs a block when its condition is true. else runs a block when it is false. else if adds another condition to check when the previous ones were false. JavaScript checks from the top and runs only the FIRST block whose condition is true, then skips the rest, exactly like the grade algorithm in Week 1.",
        code: {
          language: JS,
          code: 'const average = 64;\nlet grade;\n\nif (average >= 70) {\n  grade = "A";\n} else if (average >= 60) {\n  grade = "B";\n} else if (average >= 50) {\n  grade = "C";\n} else {\n  grade = "F";\n}\n\nconsole.log(`Average ${average}: grade ${grade}`);\n',
          expectedOutput: "Average 64: grade B",
        },
        table: {
          caption: "Pseudocode to JavaScript.",
          headers: ["Pseudocode", "JavaScript"],
          rows: [
            ["IF average >= 70 THEN", "if (average >= 70) {"],
            ["ELSE IF average >= 60 THEN", "} else if (average >= 60) {"],
            ["ELSE", "} else {"],
            ["END IF", "}"],
          ],
        },
        mistake:
          "Putting a semicolon after the condition: if (average >= 70); { … }. The semicolon ends the if with an empty statement, and the block in braces then runs every time, whatever the condition.",
      },
      {
        id: "a-js-condition-order",
        title: "The order of the conditions",
        explain:
          "Because only the first true branch runs, conditions that overlap must go from most specific to least specific. If a broad condition comes first, it catches cases meant for the branches below it, and they never run.",
        codeExercise: {
          language: JS,
          code: 'const temperature = 38;\n\nif (temperature > 25) {\n  console.log("Warm");\n} else if (temperature > 35) {\n  console.log("Very hot");\n} else {\n  console.log("Cool");\n}\n',
          question: "The author wanted 38 to print \"Very hot\". What does it actually print?",
          expectedOutput: "Warm",
          hint: "Check the conditions from the top. Is 38 > 25?",
          successMessage:
            "Warm. 38 > 25 is true, so the first branch runs and \"Very hot\" can never be reached by any temperature, because anything over 35 is also over 25. Swap the two conditions and it works.",
        },
      },
      {
        id: "a-js-nested-conditions",
        title: "Nested conditions",
        explain:
          "A nested condition is an if inside another if. Use it when a second question only makes sense after the first has been answered. Each level of nesting is indented one step further, so the structure stays visible.",
        code: {
          language: JS,
          code: 'const age = 20;\nconst hasId = false;\n\nif (age >= 18) {\n  if (hasId) {\n    console.log("Entry allowed");\n  } else {\n    console.log("Old enough, but bring ID");\n  }\n} else {\n  console.log("Too young");\n}\n',
          expectedOutput: "Old enough, but bring ID",
        },
        why: "Nesting lets each message be specific. A flat if (age >= 18 && hasId) can only say yes or no; nesting tells the 20-year-old without ID exactly what to fix.",
        mistake:
          "Nesting four or five levels deep. Past two or three it becomes hard to see which else belongs to which if. Usually the fix is to check the failure cases first and stop early, which you will learn with functions in Week 6.",
      },
      {
        id: "a-js-nested-decision",
        title: "Nested or combined?",
        explain:
          "Many rules can be written either with nesting or with && in a single condition. Choose by asking whether the outcomes differ. If every failing combination gets the same response, combine. If different failures need different responses, nest.",
        decision: {
          scenario:
            "A bank transfer must fail with \"Insufficient funds\" if the balance is too low, and with \"Daily limit reached\" if the amount is over the daily limit. Otherwise it succeeds.",
          question: "Which structure fits best?",
          options: [
            {
              id: "a",
              text: "One if with balance >= amount && amount <= limit, and an else that prints \"Transfer failed\"",
              whyWrong: "It gets the decision right but throws away the reason. A customer told only \"failed\" cannot tell whether to top up or wait until tomorrow.",
            },
            {
              id: "b",
              text: "if balance < amount → \"Insufficient funds\"; else if amount > limit → \"Daily limit reached\"; else → success",
              why: "Each failure has its own message, so each gets its own branch, checked in turn. This is a flat else-if chain rather than deep nesting, which keeps it readable while still being specific.",
            },
            {
              id: "c",
              text: "Two separate if statements with no else",
              whyWrong: "Both checks could fire, and nothing stops the transfer going ahead after a failure message, because there is no branch that only runs when both checks passed.",
            },
            {
              id: "d",
              text: "A loop that keeps checking until the transfer succeeds",
              whyWrong: "Nothing changes between checks, so the loop would either run once or forever. This is a decision, not a repetition.",
            },
          ],
          correct: "b",
          aftermath: "A chain of else-if checks, each one ruling out a failure, is called a guard sequence. It is one of the most common shapes in real code.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 5.4 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l16-truthy-ternary-switch",
    moduleId: "js-w5-control",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6"],
    title: "Truthiness, the Ternary and switch",
    subtitle: "Three tools that make decisions shorter, and their traps",
    estimatedMinutes: 15,
    intro:
      "JavaScript lets an if test values that are not true or false at all. It has a one-line if for choosing between two values, and a switch statement for matching one value against many. Each saves code, and each has a trap worth knowing before you use it.",

    atoms: [
      {
        id: "a-js-truthy-falsy",
        title: "Truthy and falsy values",
        explain:
          "When JavaScript needs a boolean and gets some other value, it converts it. Exactly eight values convert to false; these are called falsy. Every other value, without exception, is truthy, including the string \"0\", the string \"false\", an empty array and an empty object.",
        table: {
          caption: "The complete list of falsy values. Everything else is truthy.",
          headers: ["Falsy value", "Type"],
          rows: [
            ["false", "boolean"],
            ["0 and -0", "number"],
            ["0n", "bigint"],
            ["\"\" (the empty string)", "string"],
            ["null", "null"],
            ["undefined", "undefined"],
            ["NaN", "number"],
          ],
        },
        codeExercise: {
          language: JS,
          code: 'console.log(Boolean(0));\nconsole.log(Boolean("0"));\nconsole.log(Boolean(""));\nconsole.log(Boolean("false"));\nconsole.log(Boolean(null));\nconsole.log(Boolean(NaN));\nconsole.log(Boolean(-1));\n',
          question: "Boolean() shows whether a value is truthy or falsy. What seven lines are printed?",
          expectedOutput: "false\ntrue\nfalse\ntrue\nfalse\nfalse\ntrue",
          hint: "Only the values in the falsy table give false. \"0\" and \"false\" are non-empty strings; -1 is not zero.",
          successMessage:
            "All seven. \"0\" and \"false\" are the two that catch people: a non-empty string is truthy whatever it says. Empty arrays and objects, which you meet later, are truthy too.",
        },
      },
      {
        id: "a-js-truthy-in-practice",
        title: "Using truthiness, carefully",
        explain:
          "Truthiness lets you write if (name) instead of if (name !== \"\" && name !== null && name !== undefined). That is genuinely useful for checking that something was entered. The trap is that 0 is falsy, so if (quantity) treats an order of zero items as \"nothing entered\", which may be wrong.",
        code: {
          language: JS,
          code: 'const username = "";\nif (username) {\n  console.log(`Welcome, ${username}`);\n} else {\n  console.log("Please enter a username");\n}\n\nconst stock = 0;\nif (stock) {\n  console.log("In stock");\n} else {\n  console.log("Out of stock");\n}\n',
          expectedOutput: "Please enter a username\nOut of stock",
        },
        why: "Both outputs are correct here, but for different reasons. The empty username is genuinely missing; the stock of 0 is a real number that happens to be falsy. When 0 is a meaningful value, compare explicitly: if (stock > 0).",
      },
      {
        id: "a-js-ternary",
        title: "The ternary operator",
        explain:
          "The ternary operator chooses between two values in one expression: condition ? valueIfTrue : valueIfFalse. It is the only JavaScript operator with three parts, which is where the name comes from. Use it to choose a value; use if when you need to choose between actions.",
        code: {
          language: JS,
          code: 'const age = 16;\nconst status = age >= 18 ? "adult" : "minor";\nconsole.log(status);\n\nconst items = 1;\nconsole.log(`You have ${items} ${items === 1 ? "item" : "items"}`);\n',
          expectedOutput: "minor\nYou have 1 item",
        },
        mistake:
          "Nesting ternaries: a ? b : c ? d : e ? f : g. It is valid and nobody can read it. For more than two outcomes, use if / else if.",
      },
      {
        id: "a-js-switch",
        title: "switch statements",
        explain:
          "switch compares one value against a list of cases, using ===, and runs the code from the first case that matches. Each case normally ends with break, which jumps out of the switch. default runs when nothing matched, like the final else.",
        code: {
          language: JS,
          code: 'const day = 3;\nlet name;\n\nswitch (day) {\n  case 1:\n    name = "Monday";\n    break;\n  case 2:\n    name = "Tuesday";\n    break;\n  case 3:\n    name = "Wednesday";\n    break;\n  default:\n    name = "Another day";\n}\n\nconsole.log(name);\n',
          expectedOutput: "Wednesday",
        },
        why: "switch is clearest when one value is compared against many fixed options: a menu choice, a day number, a status code. For ranges like average >= 70, use if / else if, because a case can only match one exact value.",
      },
      {
        id: "a-js-switch-fallthrough",
        title: "The missing break",
        explain:
          "Without break, a switch does not stop at the end of the matching case. It falls through and runs the next case's code too, and the next, until it reaches a break or the end. Occasionally this is deliberate, to share code between cases. Usually it is a bug.",
        codeExercise: {
          language: JS,
          code: 'const choice = 2;\n\nswitch (choice) {\n  case 1:\n    console.log("Check balance");\n  case 2:\n    console.log("Withdraw");\n  case 3:\n    console.log("Deposit");\n    break;\n  case 4:\n    console.log("Exit");\n}\n',
          question: "Two of the cases are missing break. With choice = 2, what is printed?",
          expectedOutput: "Withdraw\nDeposit",
          hint: "Matching starts at case 2. Without a break there, keep running downwards until a break is reached.",
          successMessage:
            "Withdraw, then Deposit. Case 2 matched, had no break, and fell through into case 3, which had one. An ATM that deposits every time you withdraw is exactly the kind of bug this produces.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 5.7 – 5.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l17-loops",
    moduleId: "js-w5-control",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.7", "5.8"],
    title: "Loops",
    subtitle: "for, while and do…while",
    estimatedMinutes: 15,
    intro:
      "Iteration, from Week 2, in JavaScript. FOR i FROM 1 TO 5 becomes a for loop; WHILE becomes while. There is also a third kind, do…while, for the one situation the other two handle awkwardly.",

    atoms: [
      {
        id: "a-js-for-loop",
        title: "The for loop",
        explain:
          "A for loop has three parts in its brackets, separated by semicolons: the start (create a counter), the condition (keep going while this is true), and the update (change the counter after each repetition). The body, in braces, runs once per repetition.",
        code: {
          language: JS,
          code: "for (let i = 1; i <= 5; i++) {\n  console.log(`Repetition ${i}`);\n}\n",
          expectedOutput: "Repetition 1\nRepetition 2\nRepetition 3\nRepetition 4\nRepetition 5",
        },
        table: {
          caption: "The three parts of for (let i = 1; i <= 5; i++).",
          headers: ["Part", "Code", "When it runs"],
          rows: [
            ["Start", "let i = 1", "Once, before anything else"],
            ["Condition", "i <= 5", "Before every repetition; false ends the loop"],
            ["Update", "i++", "After every repetition"],
          ],
        },
        why: "This is FOR i FROM 1 TO 5 with every step made explicit. That explicitness is why the for loop can count down, count in twos, or start at 0, which is how you will loop through lists next week.",
      },
      {
        id: "a-js-for-practice",
        title: "Counting differently",
        explain:
          "Change the start, condition or update and the same loop counts in a different pattern. Counting from 0 is especially common, because positions in a list start at 0.",
        codeExercise: {
          language: JS,
          code: 'let line = "";\nfor (let i = 10; i > 0; i -= 3) {\n  line += i + " ";\n}\nconsole.log(line.trim());\n',
          question: "This loop counts down in threes, joining each number onto line. What is printed?",
          expectedOutput: "10 7 4 1",
          hint: "Start at 10, subtract 3 each time, and stop as soon as i > 0 is false.",
          successMessage:
            "10 7 4 1. After 1, i becomes -2, the condition fails and the loop ends. trim() removes the trailing space left by the last join.",
        },
      },
      {
        id: "a-js-while-loop",
        title: "The while loop",
        explain:
          "A while loop repeats as long as its condition is true, checking it before every repetition. Use it when you do not know in advance how many repetitions you need. Something inside the loop must eventually make the condition false, or it runs forever.",
        code: {
          language: JS,
          code: 'let savings = 0;\nlet months = 0;\nconst target = 50000;\nconst monthly = 7500;\n\nwhile (savings < target) {\n  savings += monthly;\n  months++;\n}\n\nconsole.log(`${months} months, saved ${savings}`);\n',
          expectedOutput: "7 months, saved 52500",
        },
        why: "This is the savings problem from your Week 2 assessment. Nobody told the loop to run seven times; it worked that out by checking the condition. That is the difference between count-controlled and condition-controlled repetition.",
        mistake:
          "Forgetting to update the variable in the condition. while (savings < target) with no savings += inside runs forever and freezes your program. In the browser the tab stops responding; in Node.js press Ctrl+C to stop it.",
      },
      {
        id: "a-js-do-while",
        title: "do…while: always at least once",
        explain:
          "A do…while loop runs its body first and checks the condition afterwards, so the body always runs at least once. It fits situations where you must do something before you can decide whether to repeat it, such as showing a menu and then checking whether the user chose to exit.",
        codeExercise: {
          language: JS,
          code: 'let attempts = 5;\n\nwhile (attempts < 3) {\n  console.log("while ran");\n  attempts++;\n}\n\ndo {\n  console.log("do...while ran");\n  attempts++;\n} while (attempts < 3);\n\nconsole.log(attempts);\n',
          question: "attempts starts at 5, so both conditions are false from the beginning. What is printed?",
          expectedOutput: "do...while ran\n6",
          hint: "while checks before running. do…while runs first, then checks.",
          successMessage:
            "The while body never runs; the do…while body runs exactly once, then 6 < 3 is false. That one guaranteed run is the only difference between them.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 5.9 – 5.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l18-loop-control",
    moduleId: "js-w5-control",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.9", "5.10"],
    title: "Controlling and Tracing Loops",
    subtitle: "break, continue, nested loops and the trace table again",
    estimatedMinutes: 16,
    intro:
      "Real loops rarely run cleanly from start to finish. Sometimes you find what you were looking for halfway and want to stop; sometimes one item should be skipped. And sometimes a loop runs inside another loop, which is where tracing by hand becomes essential.",

    atoms: [
      {
        id: "a-js-break",
        title: "break: stop the loop now",
        explain:
          "break ends the loop immediately, skipping any remaining repetitions and jumping to the first line after the loop. Use it when you have found what you were looking for and there is no point continuing.",
        code: {
          language: JS,
          code: 'for (let n = 1; n <= 100; n++) {\n  if (n * n > 50) {\n    console.log(`First square over 50: ${n} x ${n} = ${n * n}`);\n    break;\n  }\n}\nconsole.log("Done");\n',
          expectedOutput: "First square over 50: 8 x 8 = 64\nDone",
        },
        why: "Without break, the loop would carry on to 100 and print every square over 50. break turns \"check everything\" into \"stop at the first match\", which is both faster and usually what you meant.",
      },
      {
        id: "a-js-continue",
        title: "continue: skip to the next repetition",
        explain:
          "continue skips the rest of the current repetition and goes straight to the next one. In a for loop, the update still runs. Use it to skip items that do not need processing, rather than wrapping the whole body in an if.",
        codeExercise: {
          language: JS,
          code: 'let total = 0;\nfor (let i = 1; i <= 6; i++) {\n  if (i % 2 === 0) {\n    continue;\n  }\n  total += i;\n}\nconsole.log(total);\n',
          question: "continue skips the even numbers. What total is printed?",
          expectedOutput: "9",
          hint: "Which values of i from 1 to 6 are not skipped? Add those.",
          successMessage: "9: only 1, 3 and 5 reach total += i. The even numbers hit continue first and skip the addition.",
        },
      },
      {
        id: "a-js-nested-loops",
        title: "Nested loops",
        explain:
          "A loop inside another loop is a nested loop. For every single repetition of the outer loop, the inner loop runs completely, from start to finish. An outer loop of 3 and an inner loop of 4 runs the inner body 3 × 4 = 12 times.",
        code: {
          language: JS,
          code: 'for (let row = 1; row <= 3; row++) {\n  let line = "";\n  for (let col = 1; col <= 4; col++) {\n    line += String(row * col).padStart(3);\n  }\n  console.log(line);\n}\n',
          expectedOutput: "  1  2  3  4\n  2  4  6  8\n  3  6  9 12",
        },
        why: "This is the beginning of the multiplication table generator. The outer loop chooses the row; the inner loop fills in that row's columns. padStart(3) pads each number to three characters so the columns line up.",
      },
      {
        id: "a-js-loop-tracing",
        title: "Tracing a nested loop",
        explain:
          "To trace a nested loop, write a row in your trace table for every repetition of the INNER loop, noting both counters. Watch for the inner counter resetting each time the outer loop moves on.",
        codeExercise: {
          language: JS,
          code: 'let count = 0;\nfor (let i = 1; i <= 3; i++) {\n  for (let j = i; j <= 3; j++) {\n    count++;\n  }\n}\nconsole.log(count);\n',
          question: "The inner loop starts at i, not at 1. How many times does count++ run?",
          expectedOutput: "6",
          hint: "When i is 1, j goes 1, 2, 3. When i is 2, j goes 2, 3. When i is 3, j is just 3.",
          successMessage: "6, that is 3 + 2 + 1. The inner loop shrinks each time because it starts where the outer counter is. Tracing it is the only reliable way to be sure.",
        },
      },
      {
        id: "a-js-atm-menu",
        title: "Putting it together: the ATM menu",
        explain:
          "The ATM simulator combines everything from this week: a loop that keeps the menu running, a switch for the choices, conditions for the checks and break to exit. The menu choices are listed in advance here so it runs anywhere; in your project, read them with prompt() in the browser. They are stored in a list, the data structure you study in Week 7: for now, read choices[step] as \"the next choice\" and amounts.shift() as \"take the next amount\".",
        code: {
          language: JS,
          code: 'let balance = 20000;\nconst choices = [1, 2, 2, 3];\nconst amounts = [5000, 30000];\nlet step = 0;\nlet running = true;\n\nwhile (running) {\n  const choice = choices[step];\n  step++;\n  switch (choice) {\n    case 1:\n      console.log(`Balance: ${balance}`);\n      break;\n    case 2: {\n      const amount = amounts.shift();\n      if (amount > balance) {\n        console.log(`Cannot withdraw ${amount}: insufficient funds`);\n      } else {\n        balance -= amount;\n        console.log(`Withdrew ${amount}. New balance: ${balance}`);\n      }\n      break;\n    }\n    case 3:\n      console.log("Goodbye");\n      running = false;\n      break;\n    default:\n      console.log("Invalid choice");\n  }\n}\n',
          expectedOutput: "Balance: 20000\nWithdrew 5000. New balance: 15000\nCannot withdraw 30000: insufficient funds\nGoodbye",
        },
        why: "Notice that break inside a switch only leaves the switch, not the while loop. That is why the loop needs its own running flag to end. It is a detail that trips people up in their first menu program.",
      },
    ],

    task: {
      title: "This week's projects",
      intro:
        "Build each of these as its own .js file. Write the pseudocode or flowchart first for at least two of them; the logic should be settled before you type.",
      prompts: [
        "Grade classification system: given a score, print the grade using if / else if / else, and print \"Invalid score\" for anything below 0 or above 100.",
        "Even and odd checker: loop from 1 to 20 and print whether each number is even or odd, using % and the ternary operator.",
        "Multiplication table generator: use nested loops to print a 12 × 12 table with aligned columns.",
        "Number guessing game: pick a secret number from 1 to 100 with Math.floor(Math.random() * 100) + 1, and in the browser use a loop and prompt() to let the player guess, saying \"higher\" or \"lower\" each time and counting the attempts.",
        "Simple ATM menu simulator: extend the example with a deposit option, a limit of three wrong PIN attempts using break, and a default case for invalid choices.",
      ],
      closing:
        "For the guessing game and the ATM, trace one complete run by hand with a table before you run it. If the table and the program disagree, the program is not doing what you think.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
