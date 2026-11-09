/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 2 · REPRESENTATION AND DEVELOPMENT
 *
 * Curriculum 2.1 – 2.9. Natural language, pseudocode and flowcharts;
 * translating flowcharts to pseudocode and pseudocode to Python; dry runs and
 * trace tables; execution paths, logical errors and correctness. Every
 * pseudocode exercise carries an equivalentPython that the validator runs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s2-representation";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 – 2.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l5-pseudocode",
    moduleId: "al-m2-representation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2"],
    title: "Natural Language and Pseudocode",
    subtitle: "Writing an algorithm down before you code it",
    estimatedMinutes: 22,
    intro:
      "Before an algorithm becomes code it has to be written down so that people can read it, check it and argue about it. Plain English is the first attempt; pseudocode is the precise version every examiner expects.",

    atoms: [
      {
        id: "a-al-natural-language",
        title: "Natural language descriptions",
        explain:
          "A natural-language algorithm is a numbered list of steps in plain English: \"1. Read the three scores. 2. Add them. 3. Divide the total by three. 4. Report the average.\" Anyone can read it, which makes it ideal for explaining an idea. But English is ambiguous (\"if the score is above 50 or equal to the pass mark and attendance...\" can be read several ways), verbose for loops and nested decisions, and impossible to execute. So natural language is the first draft; pseudocode is the precise one.",
        decision: {
          scenario: "A step in a natural-language algorithm reads: \"Give a discount to customers who spent over ₦50,000 or are members and have ordered before.\"",
          question: "What is the real problem with this step?",
          options: [
            {
              id: "a",
              text: "It is ambiguous: it can mean (over ₦50,000) OR (member AND ordered before), or (over ₦50,000 OR member) AND ordered before",
              why: "English has no brackets. Pseudocode would write the grouping explicitly: IF spent > 50000 OR (member AND ordered_before).",
            },
            { id: "b", text: "It is too short", whyWrong: "Length is not the issue; the meaning is unclear." },
            { id: "c", text: "Discounts cannot be expressed as algorithms", whyWrong: "They can, once the condition is precise." },
            { id: "d", text: "It uses a currency symbol", whyWrong: "Symbols are fine. The grouping of AND and OR is what is ambiguous." },
          ],
          correct: "a",
          aftermath: "Whenever AND and OR appear together, write the brackets. That one habit removes a whole class of logical errors.",
        },
      },
      {
        id: "a-al-pseudocode-syntax",
        title: "Pseudocode: variables, input, output, selection and nesting",
        explain:
          "Pseudocode is structured English with the shape of code but no strict syntax. There is no single standard, but examination boards and textbooks use very similar keywords. Write one action per line, indent the body of every IF and loop, and close each block (END IF, END WHILE). It must be precise enough that two programmers would write the same program from it.",
        table: {
          caption: "Pseudocode conventions used in this course.",
          headers: ["Construct", "Pseudocode", "Python"],
          rows: [
            ["Assignment", "SET total TO 0   (or total ← 0)", "total = 0"],
            ["Input", "INPUT score", "score = int(input())"],
            ["Output", "OUTPUT \"Average:\", avg", "print(\"Average:\", avg)"],
            ["Selection", "IF x > 0 THEN ... ELSE ... END IF", "if x > 0: ... else: ..."],
            ["Multi-way selection", "IF ... ELSE IF ... ELSE ... END IF", "if ... elif ... else ..."],
            ["Count-controlled loop", "FOR i FROM 1 TO n DO ... END FOR", "for i in range(1, n + 1):"],
            ["Condition-controlled loop", "WHILE x > 0 DO ... END WHILE", "while x > 0:"],
            ["Post-test loop", "REPEAT ... UNTIL x = 0", "while True: ... if x == 0: break"],
          ],
        },
        codeExercise: {
          language: "pseudocode",
          code: "SET age TO 17\nSET has_id TO TRUE\nIF age >= 18 THEN\n    IF has_id THEN\n        OUTPUT \"Enter\"\n    ELSE\n        OUTPUT \"Show ID\"\n    END IF\nELSE\n    OUTPUT \"Too young\"\nEND IF\n",
          equivalentPython: "age = 17\nhas_id = True\nif age >= 18:\n    if has_id:\n        print(\"Enter\")\n    else:\n        print(\"Show ID\")\nelse:\n    print(\"Too young\")\n",
          question: "This pseudocode uses a nested condition. What does it output?",
          expectedOutput: "Too young",
          hint: "The outer condition is checked first. Is 17 >= 18?",
          successMessage: "The inner IF is only reached when the outer one is true. Indentation shows the nesting, in pseudocode and in Python.",
        },
      },
      {
        id: "a-al-pseudocode-loops",
        title: "Iteration in pseudocode: a login system",
        explain:
          "Loops are where pseudocode earns its keep. A FOR loop repeats a known number of times; a WHILE loop repeats as long as a condition holds and may run zero times; REPEAT ... UNTIL always runs at least once. A login system that allows three attempts is a loop with two ways out: the correct password, or running out of attempts.",
        code: {
          language: "pseudocode",
          code: "SET stored TO \"lagos2026\"\nSET attempts TO 0\nSET granted TO FALSE\nWHILE attempts < 3 AND NOT granted DO\n    INPUT guess\n    SET attempts TO attempts + 1\n    IF guess = stored THEN\n        SET granted TO TRUE\n    END IF\nEND WHILE\nIF granted THEN OUTPUT \"Access granted\" ELSE OUTPUT \"Account locked\"\n",
          equivalentPython: "stored = \"lagos2026\"\nguesses = [\"lagos\", \"lagos2026\"]\nattempts = 0\ngranted = False\nwhile attempts < 3 and not granted:\n    guess = guesses[attempts]\n    attempts = attempts + 1\n    if guess == stored:\n        granted = True\nprint(\"Access granted\" if granted else \"Account locked\")\n",
          expectedOutput: "Access granted",
        },
        codeChallenge: {
          task: "Turn the login pseudocode into Python. Write login(stored, guesses), where guesses is the list of passwords the user types, in order. Allow at most 3 attempts. Return \"Access granted\" if one of the first three guesses matches, \"Account locked\" after three wrong guesses, and \"Access denied\" if the user stopped (the list ran out) before three wrong guesses.",
          starter: "def login(stored, guesses):\n    pass\n",
          sample: "login(\"abc\", [\"x\", \"abc\"]) → \"Access granted\"\nlogin(\"abc\", [\"x\", \"y\", \"z\", \"abc\"]) → \"Account locked\"",
          tests: [
            {
              check: py`assert login("abc", ["abc"]) == "Access granted", "The first guess is right."
assert login("abc", ["x", "abc"]) == "Access granted", "The second guess is right."
assert login("abc", ["x", "y", "abc"]) == "Access granted", "The third guess is still allowed."
assert login("abc", ["x", "y", "z", "abc"]) == "Account locked", "A fourth attempt is not allowed, even if it is right."
assert login("abc", ["x", "y", "z"]) == "Account locked", "Three wrong guesses lock the account."
assert login("abc", ["x"]) == "Access denied", "One wrong guess, then the user stopped."
assert login("abc", []) == "Access denied", "No guesses at all."`,
            },
          ],
          solution: "def login(stored, guesses):\n    attempts = 0\n    while attempts < 3 and attempts < len(guesses):\n        if guesses[attempts] == stored:\n            return \"Access granted\"\n        attempts += 1\n    if attempts == 3:\n        return \"Account locked\"\n    return \"Access denied\"\n",
          hint: "Loop while attempts < 3 and there are guesses left. Return as soon as one matches. After the loop, attempts == 3 means locked.",
          successMessage: "Two exit conditions in one loop, exactly as in the pseudocode. The fourth-guess test is the one most implementations fail.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.3 – 2.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l6-flowcharts",
    moduleId: "al-m2-representation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.3", "2.4"],
    title: "Flowcharts",
    subtitle: "Symbols, flow, and translating a chart into pseudocode",
    estimatedMinutes: 22,
    intro:
      "A flowchart draws an algorithm. Decisions and loops become visible as branches and arrows that turn back, which makes flowcharts the clearest way to show control flow and a favourite in examinations.",

    atoms: [
      {
        id: "a-al-flowchart-symbols",
        title: "Flowchart symbols",
        explain:
          "Flowchart shapes are standardised (ISO 5807), so any reader understands any chart. Every chart has exactly one START terminator and at least one STOP. Arrows (flow lines) show the order of steps and normally run top to bottom. A decision diamond has exactly two exits, labelled YES and NO (or TRUE and FALSE). Connectors join parts of a chart that do not fit on one page or would otherwise need crossing lines.",
        table: {
          caption: "The standard flowchart symbols.",
          headers: ["Shape", "Symbol", "Used for", "Example"],
          rows: [
            ["Oval", "Terminator", "Start and end", "START, STOP"],
            ["Parallelogram", "Input / output", "Reading or displaying data", "INPUT a, b; OUTPUT result"],
            ["Rectangle", "Process", "A calculation or assignment", "result ← a + b"],
            ["Diamond", "Decision", "A yes/no question with two exits", "b = 0 ?"],
            ["Rectangle with double sides", "Predefined process", "A sub-algorithm defined elsewhere", "SORT(list)"],
            ["Arrow", "Flow line", "The order of execution", "→"],
            ["Small circle", "Connector", "Joining separated parts of a chart", "(A)"],
          ],
        },
        decision: {
          scenario: "In a calculator flowchart you must check whether the divisor is zero before dividing.",
          question: "Which symbol represents that check, and how many arrows leave it?",
          options: [
            { id: "a", text: "A rectangle with one arrow", whyWrong: "Rectangles are processes. A check is a decision." },
            { id: "b", text: "A diamond with two arrows, YES and NO", why: "Every decision is a diamond with exactly two labelled exits." },
            { id: "c", text: "A parallelogram with two arrows", whyWrong: "Parallelograms are input and output only." },
            { id: "d", text: "A diamond with three arrows for <, = and >", whyWrong: "A flowchart decision is binary. A three-way test is drawn as two diamonds." },
          ],
          correct: "b",
          aftermath: "Two exits per diamond keeps every path explicit, which is what makes flowcharts easy to trace.",
        },
      },
      {
        id: "a-al-flowchart-calculator",
        title: "A flowchart for a simple calculator",
        explain:
          "The calculator reads two numbers and an operator, then makes a chain of decisions: is the operator +? If not, is it −? And so on. Division has one extra decision: a zero divisor must be rejected. Each decision has a YES branch that does one calculation and a NO branch that leads to the next question; all successful branches meet before OUTPUT.",
        example:
          "        ( START )\n            |\n     / INPUT a, op, b /\n            |\n       < op = '+' ? >--YES--> [ r ← a + b ]--+\n            | NO                              |\n       < op = '-' ? >--YES--> [ r ← a - b ]--+\n            | NO                              |\n       < op = '*' ? >--YES--> [ r ← a * b ]--+\n            | NO                              |\n       < op = '/' ? >--NO--> / OUTPUT \"Invalid operator\" /\n            | YES                             |\n       <  b = 0 ?  >--YES--> / OUTPUT \"Cannot divide by zero\" /\n            | NO                              |\n       [ r ← a / b ]------------------------->+\n                                              |\n                                      / OUTPUT r /\n                                              |\n                                          ( STOP )",
        codeChallenge: {
          task: "Implement the calculator flowchart. Write calculate(a, op, b) for the operators \"+\", \"-\", \"*\" and \"/\". Return the result, \"Cannot divide by zero\" when op is \"/\" and b is 0, and \"Invalid operator\" for any other operator.",
          starter: "def calculate(a, op, b):\n    pass\n",
          sample: "calculate(8, \"*\", 5) → 40\ncalculate(8, \"/\", 0) → \"Cannot divide by zero\"",
          tests: [
            {
              check: py`assert calculate(8, "+", 5) == 13 and calculate(8, "-", 5) == 3, "Addition and subtraction."
assert calculate(8, "*", 5) == 40, "Multiplication."
assert calculate(9, "/", 2) == 4.5, "Division: 9 / 2 is 4.5."
assert calculate(8, "/", 0) == "Cannot divide by zero", "Check the divisor before dividing."
assert calculate(0, "/", 5) == 0, "Zero divided by 5 is fine."
assert calculate(8, "%", 5) == "Invalid operator" and calculate(8, "x", 5) == "Invalid operator", "Any other operator is invalid."`,
            },
          ],
          solution: "def calculate(a, op, b):\n    if op == \"+\":\n        return a + b\n    if op == \"-\":\n        return a - b\n    if op == \"*\":\n        return a * b\n    if op == \"/\":\n        if b == 0:\n            return \"Cannot divide by zero\"\n        return a / b\n    return \"Invalid operator\"\n",
          hint: "One if per diamond, in the same order as the chart. Inside the \"/\" branch, check b == 0 first.",
          successMessage: "Each diamond became an if, each rectangle a calculation, each parallelogram a return value. That is the whole translation.",
        },
      },
      {
        id: "a-al-flowchart-to-pseudocode",
        title: "Translating flowcharts into pseudocode",
        explain:
          "Translate shape by shape. Parallelogram → INPUT/OUTPUT. Rectangle → SET. Diamond whose branches rejoin further DOWN the chart → IF ... ELSE ... END IF. Diamond where one branch arrow loops BACK UP to an earlier step → a loop: the diamond is the WHILE condition, and the steps on the looping path are the loop body. Spotting the back-arrow is the key skill: a back-arrow always means repetition.",
        example:
          "      ( START )\n          |\n   [ total ← 0, i ← 1 ]\n          |\n  +-> < i <= 5 ? >--NO--> / OUTPUT total / --> ( STOP )\n  |       | YES\n  |  [ total ← total + i * i ]\n  |       |\n  |  [ i ← i + 1 ]\n  |       |\n  +-------+",
        codeExercise: {
          language: "pseudocode",
          code: "SET total TO 0\nSET i TO 1\nWHILE i <= 5 DO\n    SET total TO total + i * i\n    SET i TO i + 1\nEND WHILE\nOUTPUT total\n",
          equivalentPython: "total = 0\ni = 1\nwhile i <= 5:\n    total = total + i * i\n    i = i + 1\nprint(total)\n",
          question: "This is the flowchart above, translated. The back-arrow became the WHILE loop. What does it output?",
          expectedOutput: "55",
          hint: "1 + 4 + 9 + 16 + 25.",
          successMessage: "55, the sum of the first five squares. The diamond with a back-arrow is the loop condition; the boxes on the loop path are its body.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.5 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l7-code-and-dry-runs",
    moduleId: "al-m2-representation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.5", "2.6"],
    title: "From Pseudocode to Code, and Dry Runs",
    subtitle: "Implementing a design, then tracing it by hand",
    estimatedMinutes: 24,
    intro:
      "Pseudocode becomes Python almost line for line. Then comes the skill examiners test most: the dry run, executing an algorithm by hand in a trace table, one step at a time, exactly as the computer would.",

    atoms: [
      {
        id: "a-al-pseudocode-to-python",
        title: "Translating pseudocode into Python: compound interest",
        explain:
          "Each pseudocode line maps to one Python line: SET becomes =, IF ... THEN becomes if ...:, END IF disappears because indentation closes the block, FOR i FROM 1 TO n becomes for i in range(1, n + 1). Watch two traps: pseudocode ranges are usually inclusive (1 TO n) while range() excludes its end, and pseudocode = in a condition is Python ==. Compound interest is a good first translation: each year the amount grows by the rate.",
        code: {
          language: "pseudocode",
          code: "INPUT principal, rate, years\nSET amount TO principal\nFOR year FROM 1 TO years DO\n    SET amount TO amount * (1 + rate / 100)\nEND FOR\nOUTPUT ROUND(amount, 2)\n",
          equivalentPython: "principal, rate, years = 50000, 12, 2\namount = principal\nfor year in range(1, years + 1):\n    amount = amount * (1 + rate / 100)\nprint(round(amount, 2))\n",
          expectedOutput: "62720.0",
        },
        codeChallenge: {
          task: "Translate the compound interest pseudocode into Python. Write compound(principal, rate, years) that applies the interest year by year in a loop and returns the final amount rounded to 2 decimal places. rate is a percentage, such as 10 for 10%.",
          starter: "def compound(principal, rate, years):\n    pass\n",
          sample: "compound(100000, 10, 3) → 133100.0",
          tests: [
            {
              check: py`assert abs(compound(100000, 10, 3) - 133100.0) < 0.01, "compound(100000, 10, 3) should be 133100.0. Got " + repr(compound(100000, 10, 3))
assert abs(compound(50000, 12, 2) - 62720.0) < 0.01, "compound(50000, 12, 2) should be 62720.0."
assert compound(20000, 5, 0) == 20000, "After 0 years the amount is the principal."
assert abs(compound(1000, 7.5, 4) - round(1000 * 1.075 ** 4, 2)) < 0.01, "A fractional rate, 7.5%, over 4 years."
assert uses("For") or uses("While"), "Translate the FOR loop: apply the rate once per year in a loop."`,
            },
          ],
          solution: "def compound(principal, rate, years):\n    amount = principal\n    for year in range(1, years + 1):\n        amount = amount * (1 + rate / 100)\n    return round(amount, 2)\n",
          hint: "amount = principal; then for year in range(1, years + 1): amount = amount * (1 + rate / 100). Return round(amount, 2).",
          successMessage: "A faithful translation. The loop computes P(1 + r)ⁿ one year at a time; Module 4 will count how many steps that takes.",
        },
      },
      {
        id: "a-al-dry-run",
        title: "Dry runs and trace tables",
        explain:
          "A dry run executes an algorithm by hand. Draw a TRACE TABLE: one column per variable (and one for output), one row per step that changes something. Fill it in strictly in order, never skipping ahead. Dry runs find logical errors before the code exists, and they are the standard way examiners test whether you understand an algorithm. For nested loops, the inner loop runs completely for each single step of the outer loop.",
        table: {
          caption: "Trace table for: count ← 0; FOR i FROM 1 TO 3: FOR j FROM 0 TO i − 1: count ← count + 1; OUTPUT i, j.",
          headers: ["i", "j", "count", "Output"],
          rows: [
            ["1", "0", "1", "1 0"],
            ["2", "0", "2", "2 0"],
            ["2", "1", "3", "2 1"],
            ["3", "0", "4", "3 0"],
            ["3", "1", "5", "3 1"],
            ["3", "2", "6", "3 2"],
          ],
        },
        codeExercise: {
          language: PY,
          code: py`count = 0
for i in range(1, 5):
    for j in range(i, 4):
        count += 1
print(count)
`,
          question: "Trace this nested loop. Note that the inner loop starts at i. What is printed?",
          expectedOutput: "6",
          hint: "i = 1: j is 1, 2, 3. i = 2: j is 2, 3. i = 3: j is 3. i = 4: range(4, 4) is empty.",
          successMessage: "3 + 2 + 1 + 0 = 6. An inner loop whose range depends on the outer variable is the pattern behind n(n − 1)/2, which you will meet constantly.",
        },
      },
      {
        id: "a-al-trace-practice",
        title: "Trace table practice: a loop with a decision",
        explain:
          "When a loop contains a decision, the trace table also records which branch was taken. The rule: evaluate the loop condition, then the IF condition, using the current values; update; repeat. Do not reason about what the algorithm \"is meant to do\": record what it actually does. The algorithm below (the Collatz process) halves even numbers and maps odd n to 3n + 1, counting steps until n reaches 1.",
        table: {
          caption: "Trace of the Collatz process from n = 6.",
          headers: ["Step", "n before", "Even?", "n after"],
          rows: [
            ["1", "6", "yes", "3"],
            ["2", "3", "no", "10"],
            ["3", "10", "yes", "5"],
            ["4", "5", "no", "16"],
            ["5", "16", "yes", "8"],
            ["6", "8", "yes", "4"],
            ["7", "4", "yes", "2"],
            ["8", "2", "yes", "1"],
          ],
        },
        codeExercise: {
          language: PY,
          code: py`n = 7
steps = 0
while n != 1:
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
    steps += 1
print(steps)
`,
          question: "Trace it for n = 7 (write the table on paper). How many steps does it take to reach 1?",
          expectedOutput: "16",
          hint: "7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1. Count the arrows.",
          successMessage: "16 steps. Nobody has proved this loop terminates for every n (the Collatz conjecture), a reminder that finiteness must be argued, not assumed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.7 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l8-correctness",
    moduleId: "al-m2-representation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.7", "2.8", "2.9"],
    title: "Execution Paths, Logical Errors and Correctness",
    subtitle: "Every path tested, every bug found, every claim argued",
    estimatedMinutes: 26,
    intro:
      "An algorithm that runs is not necessarily right. This lesson covers how to enumerate the paths through an algorithm, how to recognise the logical errors that hide on them, and how to argue correctness with a loop invariant instead of hoping.",

    atoms: [
      {
        id: "a-al-execution-paths",
        title: "Execution paths: a grading algorithm",
        explain:
          "An execution path is one route through the algorithm from START to STOP. An IF/ELSE IF chain with k branches has k paths; two independent IFs in sequence have 2 × 2 = 4; a loop multiplies paths by every possible number of iterations. Good testing chooses at least one input per path, plus each boundary between paths. A grading algorithm with six grade bands and an invalid band has seven paths and twelve boundaries.",
        table: {
          caption: "A common university grading scale: one path per row.",
          headers: ["Score", "Grade", "Boundary tests"],
          rows: [
            ["70 – 100", "A", "70, 100"],
            ["60 – 69", "B", "60, 69"],
            ["50 – 59", "C", "50, 59"],
            ["45 – 49", "D", "45, 49"],
            ["40 – 44", "E", "40, 44"],
            ["0 – 39", "F", "0, 39"],
            ["Below 0 or above 100", "Invalid", "-1, 101"],
          ],
        },
        codeChallenge: {
          task: "Write grade(score) for the scale in the table, returning \"A\", \"B\", \"C\", \"D\", \"E\", \"F\" or \"Invalid\". Scores are whole numbers.",
          starter: "def grade(score):\n    pass\n",
          sample: "grade(70) → \"A\"\ngrade(44) → \"E\"\ngrade(101) → \"Invalid\"",
          tests: [
            {
              check: py`table = {100: "A", 70: "A", 69: "B", 60: "B", 59: "C", 50: "C", 49: "D", 45: "D",
         44: "E", 40: "E", 39: "F", 0: "F", -1: "Invalid", 101: "Invalid"}
for score, want in table.items():
    assert grade(score) == want, f"grade({score}) should be {want!r}, got {grade(score)!r}"`,
            },
          ],
          solution: "def grade(score):\n    if score < 0 or score > 100:\n        return \"Invalid\"\n    if score >= 70:\n        return \"A\"\n    if score >= 60:\n        return \"B\"\n    if score >= 50:\n        return \"C\"\n    if score >= 45:\n        return \"D\"\n    if score >= 40:\n        return \"E\"\n    return \"F\"\n",
          hint: "Reject invalid scores first, then test from the top band down with >=, so each test only needs a lower bound.",
          successMessage: "All seven paths and both sides of every boundary pass. Testing from the top down means each condition needs only one comparison.",
        },
      },
      {
        id: "a-al-logical-errors",
        title: "Identifying logical errors",
        explain:
          "A logical error makes a program run but give a wrong answer, so neither the compiler nor the interpreter can find it. The common ones: OFF-BY-ONE (< where <= was meant, range(n) when 1..n was meant); WRONG INITIALISATION (starting a maximum at 0, which fails when every value is negative); WRONG OPERATOR (and for or); UPDATING THE WRONG VARIABLE; and an unreachable branch hidden behind an earlier, broader condition. Dry runs on boundary and unusual inputs expose them.",
        codeChallenge: {
          task: "The find_max function below has a logical error: it returns the wrong answer for some lists. Find it with a dry run on a list of negative numbers, then fix it. Keep the loop; do not use max().",
          starter: "def find_max(items):\n    largest = 0\n    for x in items:\n        if x > largest:\n            largest = x\n    return largest\n",
          sample: "find_max([-3, -7, -1]) → -1",
          tests: [
            {
              check: py`assert find_max([4, 9, 2]) == 9, "find_max([4, 9, 2]) should be 9."
assert find_max([-3, -7, -1]) == -1, "find_max([-3, -7, -1]) should be -1, got " + repr(find_max([-3, -7, -1])) + ". Dry-run it: what is largest before the loop starts?"
assert find_max([5]) == 5 and find_max([0, -2]) == 0, "One item, and a zero."
assert not calls("max") and not calls("sorted"), "Fix the loop rather than replacing it with max()."`,
            },
          ],
          solution: "def find_max(items):\n    largest = items[0]\n    for x in items:\n        if x > largest:\n            largest = x\n    return largest\n",
          hint: "largest = 0 assumes some item is at least 0. Start with a value that is definitely in the list.",
          successMessage: "Initialising to items[0] makes the starting value one of the candidates, so the answer can only ever be an item of the list.",
        },
      },
      {
        id: "a-al-correctness-validation",
        title: "Correctness and validation: loop invariants",
        explain:
          "TESTING (validation) shows an algorithm works on the inputs you tried; it cannot show the absence of bugs. PROOF (verification) shows it works on every input. The main tool for loops is a LOOP INVARIANT: a statement that is true before the loop starts (INITIALISATION), stays true after each iteration (MAINTENANCE), and, when the loop ends, gives the result you wanted (TERMINATION). For find_max the invariant is \"largest is the maximum of the items examined so far\". Combine it with a finiteness argument (the loop visits each item once) and the algorithm is proved correct.",
        decision: {
          scenario: "You must prove that this loop computes the sum of a list: total ← 0; FOR each x IN items: total ← total + x.",
          question: "Which is the correct loop invariant?",
          options: [
            {
              id: "a",
              text: "At the start of each iteration, total equals the sum of the items processed so far",
              why: "True initially (0 = sum of nothing), maintained by adding x, and at termination \"so far\" means every item, so total is the full sum.",
            },
            { id: "b", text: "total is always positive", whyWrong: "False for negative items, and it would not prove the sum anyway." },
            { id: "c", text: "total equals the sum of the whole list", whyWrong: "Not true before the loop has finished, so it cannot be an invariant." },
            { id: "d", text: "The loop runs n times", whyWrong: "That is a finiteness argument, not an invariant about total." },
          ],
          correct: "a",
          aftermath: "Initialisation, maintenance, termination: the same three-part argument proves insertion sort, binary search and Dijkstra's algorithm later in the course.",
        },
      },
    ],

    task: {
      title: "Module 2 practice: represent, translate and trace",
      intro: "Do these on paper first, then confirm with Python where it helps.",
      prompts: [
        "Draw a flowchart for a simple calculator (+, −, ×, ÷) that rejects division by zero and unknown operators.",
        "Write pseudocode for a login authentication system that allows three attempts and locks the account after the third failure.",
        "Develop an algorithm for calculating compound interest, in pseudocode and as a flowchart, and dry-run it for ₦100,000 at 10% for 3 years.",
        "Create a grading algorithm using multiple conditions for the A–F scale, and list one test per execution path plus every boundary.",
        "Trace this nested loop manually in a trace table: FOR i FROM 1 TO 4: FOR j FROM 1 TO i: OUTPUT i × j. How many lines are output?",
      ],
      closing: "Next module asks a new question about every algorithm you write: not only \"is it right?\" but \"how fast is it?\"",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
