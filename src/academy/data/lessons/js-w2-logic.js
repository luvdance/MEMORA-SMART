/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 2 · PROGRAMMING LOGIC & PROBLEM-SOLVING
 *
 * Curriculum 2.1 – 2.8. Still no JavaScript. The three control structures,
 * variables and constants, arithmetic and logic, and the dry-run table — the
 * tool a learner will use for the rest of the course to find bugs by reading.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s2-logic";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l5-three-structures",
    moduleId: "js-w2-logic",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "The Three Structures",
    subtitle: "Every program ever written is made of these",
    estimatedMinutes: 13,
    intro:
      "In 1966 two computer scientists, Böhm and Jacopini, showed that any algorithm can be written using only three structures: doing steps in order, choosing between steps, and repeating steps. Every language you will ever learn is a different way of writing these three things.",

    atoms: [
      {
        id: "a-js-sequence",
        title: "Sequence: one step after another",
        explain:
          "Sequence means the instructions run in the order they are written, top to bottom, each one exactly once. It is the default: unless something says otherwise, the computer does line 1, then line 2, then line 3.",
        why: "Most bugs in beginners' programs are sequence bugs: using a value before it has been calculated, or showing a result before it has been updated. Reading top to bottom, one line at a time, catches them.",
        codeExercise: {
          language: "pseudocode",
          code: "SET x TO 4\nSET y TO x * 2\nSET x TO 10\nOUTPUT x + y\n",
          question: "Follow the sequence exactly. What is OUTPUT?",
          expectedOutput: "18",
          hint: "y is calculated on line 2, when x is still 4. Line 3 changes x but does not go back and change y.",
          successMessage:
            "18. y became 8 on line 2 and stayed 8. By line 4, x is 10, so 10 + 8 is 18. Each line uses the values as they are at that moment.",
          equivalent: "let x = 4;\nlet y = x * 2;\nx = 10;\nconsole.log(x + y);\n",
        },
      },
      {
        id: "a-js-selection",
        title: "Selection: choosing a path",
        explain:
          "Selection means the program checks a condition and runs different steps depending on whether it is true or false. In pseudocode it is IF … THEN … ELSE … END IF. Only one of the branches runs; the other is skipped entirely.",
        example:
          "INPUT temperature\nIF temperature >= 30 THEN\n    OUTPUT \"It is hot. Drink water.\"\nELSE\n    OUTPUT \"Normal weather.\"\nEND IF\n\ntemperature = 34   →   It is hot. Drink water.\ntemperature = 22   →   Normal weather.",
        why: "Selection is how a program responds to its input. Without it, a program does the same thing whatever you give it, which is a calculation rather than a program.",
        table: {
          caption: "The comparisons a condition can use.",
          headers: ["Symbol", "Means", "True example"],
          rows: [
            ["=", "is equal to (in pseudocode)", "5 = 5"],
            ["≠ or <>", "is not equal to", "5 ≠ 3"],
            [">", "is greater than", "7 > 2"],
            ["<", "is less than", "2 < 7"],
            [">=", "is greater than or equal to", "7 >= 7"],
            ["<=", "is less than or equal to", "6 <= 7"],
          ],
          note: "In JavaScript, \"is equal to\" is written === because a single = means something else. You will meet this in Week 4.",
        },
      },
      {
        id: "a-js-iteration",
        title: "Iteration: repeating steps",
        explain:
          "Iteration means repeating a block of steps. There are two kinds. A count-controlled loop repeats a known number of times: FOR i FROM 1 TO 5. A condition-controlled loop repeats for as long as a condition stays true: WHILE balance > 0. Use FOR when you know how many times before you start; use WHILE when you do not.",
        table: {
          caption: "Choosing the right kind of loop.",
          headers: ["Situation", "Loop", "Why"],
          rows: [
            ["Print the 7 times table up to 12", "FOR", "Exactly 12 repetitions, known in advance"],
            ["Ask for a password until it is right", "WHILE", "Could be 1 attempt or 10; you cannot know"],
            ["Add up 30 students' scores", "FOR", "30 is known before you start"],
            ["Keep a game running until the player quits", "WHILE", "Ends when a condition changes"],
          ],
        },
        why: "Iteration is what makes computers worth having. Adding three numbers by hand is easy; adding three million is only possible because one loop can repeat the same step as many times as needed.",
      },
      {
        id: "a-js-iteration-trace",
        title: "Following a loop by hand",
        explain:
          "To work out what a loop does, follow it one repetition at a time, writing down the value of each variable every time round. The loop below adds the numbers 1 to 4.",
        codeExercise: {
          language: "pseudocode",
          code: "SET total TO 0\nFOR i FROM 1 TO 4\n    SET total TO total + i\nEND FOR\nOUTPUT total\n",
          question: "What is OUTPUT after the loop has finished?",
          expectedOutput: "10",
          hint: "Write down total after each repetition: start at 0, then add 1, then 2, then 3, then 4.",
          successMessage:
            "10. total went 0 → 1 → 3 → 6 → 10. The FOR loop ran four times, once for each value of i, and OUTPUT ran once, after the loop.",
          equivalent: "let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total = total + i;\n}\nconsole.log(total);\n",
        },
        mistake:
          "Putting OUTPUT inside the loop when you meant it after. Inside, it would print 1, 3, 6, 10 on four lines. After, it prints only 10. Indentation in pseudocode, and braces in JavaScript, are how you say which.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.4 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l6-storing-information",
    moduleId: "js-w2-logic",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6"],
    title: "Storing Information",
    subtitle: "Variables, constants and the operations on them",
    estimatedMinutes: 13,
    intro:
      "A program has to remember things while it runs: the score so far, the user's name, how many attempts are left. It remembers them in variables. This lesson is about what a variable really is, when a value should never change, and the arithmetic and logic you will use on them.",

    atoms: [
      {
        id: "a-js-variable-idea",
        title: "A variable is a named place to store a value",
        explain:
          "A variable is a name that refers to a stored value. SET score TO 70 creates a place called score and puts 70 in it. Later, SET score TO 85 replaces the 70 with 85. The name stays the same; the value can vary, which is where the word comes from.",
        analogy:
          "A labelled jar. The label (the name) stays on the jar. You can tip out what is inside and put something new in, but the jar only ever holds one thing at a time.",
        why: "Names are how a program refers to things it cannot know in advance. The author does not know what score a student will get; they write score, and the program fills it in when it runs.",
        mistake:
          "Reading SET total TO total + 5 as an impossible equation. It is an instruction, not a statement of fact: work out total + 5 using the current value, then store the result back in total. The right-hand side is always worked out first.",
      },
      {
        id: "a-js-assignment-trace",
        title: "Assignment, one step at a time",
        explain:
          "Assignment always works the same way: first evaluate the right-hand side using the values as they are right now, then store the result under the name on the left. The old value is gone.",
        codeExercise: {
          language: "pseudocode",
          code: "SET a TO 5\nSET b TO 3\nSET a TO a + b\nSET b TO a - b\nOUTPUT a, b\n",
          question: "Trace each line. What does OUTPUT show? Write the two values separated by a space.",
          expectedOutput: "8 5",
          hint: "After line 3, a is 8. Line 4 uses that NEW a: 8 - 3.",
          successMessage:
            "8 5. Line 3 makes a = 8. Line 4 uses the updated a, so b = 8 - 3 = 5. Each assignment sees every change made before it.",
          equivalent: "let a = 5;\nlet b = 3;\na = a + b;\nb = a - b;\nconsole.log(a, b);\n",
        },
      },
      {
        id: "a-js-constants",
        title: "Constants: values that must not change",
        explain:
          "A constant is a named value that is set once and never changed while the program runs. The VAT rate, the number of days in a week, the pass mark. In pseudocode write CONSTANT PASS_MARK = 50. Constants are often written in capitals so they stand out.",
        why: "Two reasons. If the pass mark changes from 50 to 45, you change one line instead of hunting for every 50 in the program, some of which might mean something else. And if the program accidentally tries to change a constant, that is a bug the language can catch. JavaScript's const, which you meet next week, does exactly this.",
        table: {
          caption: "Variable or constant?",
          headers: ["Value", "Choice", "Reason"],
          rows: [
            ["A student's running total", "Variable", "Changes as each score is added"],
            ["The VAT rate of 7.5%", "Constant", "Fixed for the whole run"],
            ["The number of attempts left", "Variable", "Goes down each time"],
            ["The minimum voting age", "Constant", "The same for everyone the program checks"],
          ],
        },
      },
      {
        id: "a-js-arithmetic",
        title: "Arithmetic, including the two you may not know",
        explain:
          "Programs use the four familiar operations, plus two that are less familiar. DIV is whole-number division (how many whole times one number goes into another), and MOD is the remainder. 17 DIV 5 is 3 and 17 MOD 5 is 2, because 17 = 3 × 5 + 2. Multiplication and division happen before addition and subtraction, exactly as in maths, and brackets override that.",
        table: {
          caption: "The six arithmetic operations.",
          headers: ["Operation", "Pseudocode", "Example", "Result"],
          rows: [
            ["Add", "+", "7 + 2", "9"],
            ["Subtract", "-", "7 - 2", "5"],
            ["Multiply", "*", "7 * 2", "14"],
            ["Divide", "/", "7 / 2", "3.5"],
            ["Whole-number divide", "DIV", "7 DIV 2", "3"],
            ["Remainder", "MOD", "7 MOD 2", "1"],
          ],
        },
        why: "MOD is used constantly. A number is even when n MOD 2 = 0. Every 3rd item is the one where position MOD 3 = 0. Converting 135 minutes into hours and minutes is 135 DIV 60 hours and 135 MOD 60 minutes.",
        codeExercise: {
          language: "pseudocode",
          code: "SET minutes TO 135\nSET hours TO minutes DIV 60\nSET left TO minutes MOD 60\nOUTPUT hours, left\n",
          question: "What does OUTPUT show? Write the two values separated by a space.",
          expectedOutput: "2 15",
          hint: "60 goes into 135 twice (120), with something left over.",
          successMessage: "2 15. 135 minutes is 2 hours and 15 minutes. DIV gives the whole hours, MOD gives what is left over.",
          equivalent:
            "let minutes = 135;\nlet hours = Math.floor(minutes / 60);\nlet left = minutes % 60;\nconsole.log(hours, left);\n",
        },
      },
      {
        id: "a-js-logic-reasoning",
        title: "Logical reasoning: AND, OR, NOT",
        explain:
          "Conditions can be combined. A AND B is true only when both are true. A OR B is true when at least one is true. NOT A flips true to false and false to true. These are called logical operators, and they let one condition express a real rule.",
        table: {
          caption: "The truth table: every combination, and the result.",
          headers: ["A", "B", "A AND B", "A OR B", "NOT A"],
          rows: [
            ["true", "true", "true", "true", "false"],
            ["true", "false", "false", "true", "false"],
            ["false", "true", "false", "true", "true"],
            ["false", "false", "false", "false", "true"],
          ],
        },
        decision: {
          scenario:
            "A loan is approved if the applicant is at least 18 and earns at least 100,000 a month, or if they have a guarantor.",
          question: "Which condition expresses that rule?",
          options: [
            {
              id: "a",
              text: "(age >= 18 AND income >= 100000) OR hasGuarantor",
              why: "The brackets group the two requirements that must both hold, and OR offers the guarantor as the alternative route. Read it aloud and it says exactly what the rule says.",
            },
            {
              id: "b",
              text: "age >= 18 OR income >= 100000 OR hasGuarantor",
              whyWrong: "This approves any 18-year-old with no income, and anyone with a high income regardless of age. The two requirements must BOTH hold, so they need AND.",
            },
            {
              id: "c",
              text: "age >= 18 AND income >= 100000 AND hasGuarantor",
              whyWrong: "This requires a guarantor as well as the age and income. The rule offers the guarantor as an alternative, not an extra requirement.",
            },
            {
              id: "d",
              text: "NOT (age < 18) OR income >= 100000",
              whyWrong: "NOT (age < 18) is the same as age >= 18, so this is option b without the guarantor. It still joins age and income with OR.",
            },
          ],
          correct: "a",
          aftermath:
            "When a rule has \"and\" and \"or\" in the same sentence, use brackets to show which parts belong together. Without them, the rule can be read two ways, and the computer will only read it one of them.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.7 – 2.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l7-dry-runs-logic-errors",
    moduleId: "js-w2-logic",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.7", "2.8"],
    title: "Dry Runs and Logic Errors",
    subtitle: "Finding the bug by reading, before the computer does",
    estimatedMinutes: 15,
    intro:
      "A dry run is running an algorithm by hand, on paper, writing down every variable's value at every step. It is slow, and it is the most reliable debugging technique there is, because it shows you the exact line where what happens stops matching what you meant.",

    atoms: [
      {
        id: "a-js-dry-run-table",
        title: "The dry-run table",
        explain:
          "A dry-run table, also called a trace table, has one column per variable and one column for output. Each row is one step. Fill in a cell only when that variable changes. When you are done, the last value in each column is that variable's final value.",
        example:
          "SET total TO 0\nSET count TO 1\nWHILE count <= 3\n    SET total TO total + count * 2\n    SET count TO count + 1\nEND WHILE\nOUTPUT total\n\n  Step              count   total   output\n  start               1       0\n  loop, count=1       2       2\n  loop, count=2       3       6\n  loop, count=3       4      12\n  count <= 3? No\n  OUTPUT                              12",
        why: "When a program gives a wrong answer, a trace table tells you which row went wrong. In Week 9 you will use the VS Code debugger, which is a trace table the computer fills in for you, and it only makes sense if you have filled one in by hand.",
      },
      {
        id: "a-js-dry-run-practice",
        title: "Dry-run it yourself",
        explain:
          "Use a trace table for this one. Write columns for n, result and output, and fill in a row every time something changes.",
        codeExercise: {
          language: "pseudocode",
          code: "SET n TO 5\nSET result TO 1\nWHILE n > 1\n    SET result TO result * n\n    SET n TO n - 1\nEND WHILE\nOUTPUT result\n",
          question: "What is OUTPUT?",
          expectedOutput: "120",
          hint: "result goes 1 → 5 → 20 → … Keep going until n is no longer greater than 1.",
          successMessage:
            "120. result went 1 → 5 → 20 → 60 → 120 as n went 5, 4, 3, 2, and the loop stopped when n reached 1. This algorithm calculates 5 × 4 × 3 × 2 × 1, which mathematicians call 5 factorial.",
          equivalent:
            "let n = 5;\nlet result = 1;\nwhile (n > 1) {\n  result = result * n;\n  n = n - 1;\n}\nconsole.log(result);\n",
        },
      },
      {
        id: "a-js-error-kinds",
        title: "Three kinds of error",
        explain:
          "A syntax error breaks the rules of the language, like a misspelt keyword, so the program cannot run at all. A runtime error happens while the program runs, like dividing by something that does not exist, and stops it. A logic error is the worst kind: the program runs perfectly and gives the wrong answer, and nothing tells you.",
        table: {
          caption: "The three errors, and how you find them.",
          headers: ["Kind", "What happens", "Example", "How it is found"],
          rows: [
            ["Syntax", "Will not run", "IF age >= 18 THN", "The language reports it"],
            ["Runtime", "Starts, then crashes", "Using a value that was never set", "The crash message"],
            ["Logic", "Runs, wrong answer", "age > 18 instead of age >= 18", "Only by testing and tracing"],
          ],
        },
        why: "Syntax and runtime errors announce themselves. Logic errors hide. That is why you test with chosen values, especially boundaries, and why the dry run exists.",
      },
      {
        id: "a-js-off-by-one",
        title: "The off-by-one error",
        explain:
          "The most common logic error in programming is being out by exactly one: a loop that runs one time too many or too few, or a boundary checked with < when it needed <=. It is common enough to have its own name.",
        codeExercise: {
          language: "pseudocode",
          code: "SET count TO 0\nSET i TO 1\nWHILE i < 5\n    SET count TO count + 1\n    SET i TO i + 1\nEND WHILE\nOUTPUT count\n",
          question: "This is meant to count from 1 to 5, so it should output 5. What does it actually OUTPUT?",
          expectedOutput: "4",
          hint: "Trace i: 1, 2, 3, 4, 5. Does the loop body run when i is 5? Check the condition: 5 < 5.",
          successMessage:
            "4. When i reaches 5, the condition 5 < 5 is false, so the fifth repetition never happens. The fix is WHILE i <= 5. An off-by-one error found by tracing the last repetition.",
          equivalent:
            "let count = 0;\nlet i = 1;\nwhile (i < 5) {\n  count = count + 1;\n  i = i + 1;\n}\nconsole.log(count);\n",
        },
      },
      {
        id: "a-js-fixing-logic",
        title: "Correcting a logic error",
        explain:
          "Fixing a logic error has three steps. Find the first wrong row in your trace table. Work out why that line produced that value. Change the line, then re-run the whole trace, not just the row you fixed, because a fix can break something later.",
        decision: {
          scenario:
            "An algorithm should output \"Pass\" for scores of 50 and over. It reads:\nIF score > 50 THEN OUTPUT \"Pass\" ELSE OUTPUT \"Fail\" END IF\nA student with exactly 50 is told they failed.",
          question: "What is the correct fix, and the right way to check it?",
          options: [
            {
              id: "a",
              text: "Change > to >=, then test with 49, 50 and 51",
              why: "The bug is at the boundary, so the fix is at the boundary and so is the test. 49 must fail, 50 and 51 must pass. Testing either side of the boundary as well as on it proves the fix and that nothing else broke.",
            },
            {
              id: "b",
              text: "Change 50 to 49, then test with 50",
              whyWrong: "score > 49 does pass a 50, but it also passes 49.5 if scores can have decimals, and it hides the real rule. Say what you mean: >= 50. And testing only 50 cannot show that 49 still fails.",
            },
            {
              id: "c",
              text: "Add a separate IF score = 50 THEN OUTPUT \"Pass\"",
              whyWrong: "This patches one value instead of fixing the rule, and a student with 50 now gets two outputs, Fail and Pass, because the first IF still runs.",
            },
            {
              id: "d",
              text: "Change > to >=, then test with 50 only",
              whyWrong: "Right fix, incomplete check. A test at 50 alone cannot tell you whether 49 still fails. Always test on the boundary and on each side of it.",
            },
          ],
          correct: "a",
          aftermath:
            "Boundary testing in one line: for any condition with a number in it, test that number, one below it and one above it.",
        },
      },
    ],

    task: {
      title: "This week's assessment",
      intro:
        "Before Week 3 opens, solve five everyday problems the way a programmer would. For each one, write the algorithm in numbered steps, then the pseudocode, then dry-run it with a trace table, then explain in two or three sentences why your logic is correct.",
      prompts: [
        "Bus fare: children under 5 travel free, students pay half, everyone else pays 500. Input the age and whether they are a student; output the fare.",
        "Phone battery: input the current battery percentage. If it is 20 or below, output a warning; if it is 100, output \"Fully charged\"; otherwise output the percentage.",
        "Savings: input a monthly saving amount and a target. Using a loop, output how many months it takes to reach the target.",
        "Even or odd: input a whole number and use MOD to output whether it is even or odd. Dry-run it with 0, 7 and 10.",
        "Exam average: input five scores, calculate the average and output whether it is a pass (50 or more). Trace it with a set of scores that averages exactly 50.",
      ],
      closing:
        "Notice how many of these turn on a boundary: under 5, 20 or below, exactly 50. If your trace table tests the boundary for every condition, you are thinking like a programmer. Week 3 turns these designs into running JavaScript.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
