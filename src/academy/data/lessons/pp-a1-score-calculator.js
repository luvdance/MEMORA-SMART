/**
 * PYTHON PROGRAMMING · PHASE 1 ASSESSMENT · STUDENT SCORE CALCULATOR
 *
 * Curriculum P1.1 – P1.3. The first complete program, planned on paper and
 * then built in tested steps. The build challenges set `revealSolution:
 * false`: the curriculum requires this project to be written without copying
 * a solution, so no model answer is ever shown for them.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s-a1-score-calculator";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · P1.1 – P1.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l17-plan-score-calculator",
    moduleId: "pp-a1-score-calculator",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["P1.1", "P1.2"],
    title: "Planning the Student Score Calculator",
    subtitle: "Requirements, algorithm, flowchart, then the input stage",
    estimatedMinutes: 20,
    intro:
      "This is your Phase 1 assessment. The brief: a program that accepts a student's name and scores, calculates the total and average, and prints a formatted result. You will plan it the way Module 1 taught, then build it one stage at a time, checking each stage before the next. No model answers are shown in this project: it is your work.",

    atoms: [
      {
        id: "a-pp-a1-requirements",
        title: "Reading the brief: input, process, output",
        explain:
          "Every project starts by turning the brief into precise requirements. Underline the nouns (the data) and the verbs (the processing). Then decide exactly what goes in, what is calculated, and what comes out, including how it should look.",
        table: {
          caption: "The brief broken into requirements.",
          headers: ["Stage", "Requirement", "Python you will use"],
          rows: [
            ["Input", "The student's name", "input()"],
            ["Input", "Four subject scores, whole numbers", "int(input())"],
            ["Process", "Total of the four scores", "+"],
            ["Process", "Average of the four scores", "( ... ) / 4"],
            ["Process", "Passed if the average is 50 or more", ">= and a bool"],
            ["Output", "A formatted result: heading, each score, total, average to 2 dp, passed", "print() and f-strings"],
          ],
        },
        decision: {
          scenario: "Before writing any code, you want test data that will prove the calculator works.",
          question: "Which set of test cases is the most useful?",
          options: [
            {
              id: "a",
              text: "Scores 60, 70, 80, 90 only",
              whyWrong: "One normal case proves very little. It cannot catch a mistake at the pass boundary.",
            },
            {
              id: "b",
              text: "A normal case (60, 70, 80, 90), a case averaging exactly 50, and one just below (49.75)",
              why: "A normal case plus both sides of the boundary. An average of exactly 50 must pass and 49.75 must fail; those are the cases that catch a > written instead of >=.",
            },
            {
              id: "c",
              text: "No tests; if it runs, it is correct",
              whyWrong: "Running proves the syntax is valid, not that the arithmetic or the pass rule is right.",
            },
            {
              id: "d",
              text: "Scores of 1000 to see if Python can handle big numbers",
              whyWrong: "Python handles big numbers fine, and scores above 100 are not realistic data for this program.",
            },
          ],
          correct: "b",
          aftermath: "Write your test cases down now, with the answers worked out by hand. You will run them against your finished program in Lesson 18.",
        },
      },
      {
        id: "a-pp-a1-algorithm",
        title: "The algorithm and flowchart",
        explain:
          "Write the algorithm as pseudocode first, then draw it as a flowchart. Both should be short: this program is a straight sequence of steps with one comparison, so the flowchart is a single column of shapes.",
        example:
          "INPUT name\nINPUT maths, english, science, computing\nSET total TO maths + english + science + computing\nSET average TO total / 4\nSET passed TO average >= 50\nOUTPUT heading with name\nOUTPUT each subject and score\nOUTPUT total, average (2 decimal places), passed\n\nFlowchart: (START) → /INPUT name/ → /INPUT four scores/ →\n[total = sum] → [average = total / 4] → [passed = average >= 50] →\n/OUTPUT report/ → (STOP)",
        codeExercise: {
          language: "pseudocode",
          code: "SET maths TO 70\nSET english TO 65\nSET science TO 82\nSET computing TO 91\nSET total TO maths + english + science + computing\nSET average TO total / 4\nOUTPUT total\nOUTPUT average\n",
          equivalentPython: "maths = 70\nenglish = 65\nscience = 82\ncomputing = 91\ntotal = maths + english + science + computing\naverage = total / 4\nprint(total)\nprint(average)\n",
          question: "Dry-run your algorithm with these scores before you build it. What does it output? (Write the average the way Python prints a float.)",
          expectedOutput: "308\n77.0",
          hint: "70 + 65 + 82 + 91, then divide by 4. Division in Python always gives a float.",
          successMessage: "308 and 77.0. Now you have a worked test case with a known answer to check your program against.",
        },
      },
      {
        id: "a-pp-a1-collect",
        title: "Stage 1: collect the name and scores",
        explain:
          "Build in stages and run each one before moving on. Stage 1 only collects the data and echoes it back, so you can see that every value arrived and is the right type. If this stage is wrong, nothing after it can be right.",
        codeChallenge: {
          task: "Stage 1. Ask for the student's name, then scores for Maths, English, Science and Computing as whole numbers (int). Then print one line that echoes them back in this form: Ada: 70 65 82 91",
          starter: "# Stage 1: collect and echo\n",
          sample: "Student name: Ada\nMaths: 70\nEnglish: 65\nScience: 82\nComputing: 91\nAda: 70 65 82 91",
          tests: [
            {
              inputs: ["Ada", "70", "65", "82", "91"],
              check:
                'assert source.count("input(") >= 5, "Collect five things: the name and four scores."\n' +
                'assert lines[-1] == "Ada: 70 65 82 91", "Echo the data back as: Ada: 70 65 82 91. Yours: " + lines[-1]',
            },
            {
              inputs: ["Bayo", "48", "52", "50", "50"],
              check:
                'assert lines[-1] == "Bayo: 48 52 50 50", "Your program must use what is typed. Expected: Bayo: 48 52 50 50. Yours: " + lines[-1]\n' +
                'assert source.count("int(") >= 4, "Convert each score with int() now, so the next stage can do arithmetic."',
            },
          ],
          solution: 'name = input("Student name: ")\nmaths = int(input("Maths: "))\nenglish = int(input("English: "))\nscience = int(input("Science: "))\ncomputing = int(input("Computing: "))\nprint(name + ":", maths, english, science, computing)\n',
          revealSolution: false,
          hint: "Five input() lines, four of them wrapped in int(). print(name + \":\", ...) puts the colon straight after the name.",
          successMessage: "Stage 1 works: every value arrives, converted. Keep this code; Stage 2 builds on it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · P1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l18-build-score-calculator",
    moduleId: "pp-a1-score-calculator",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["P1.3"],
    title: "Building the Student Score Calculator",
    subtitle: "Calculate, format, and test against your hand-worked answers",
    estimatedMinutes: 25,
    intro:
      "Stage 2 adds the calculations, Stage 3 the formatted report. Each is checked with several students, including the boundary cases you planned. When the last check passes, you have built a complete program on your own.",

    atoms: [
      {
        id: "a-pp-a1-calculate",
        title: "Stage 2: total, average and pass",
        explain:
          "Add the processing: a total, an average, and a bool saying whether the student passed (average 50 or more). Store each in a well-named variable, then print them so you can compare with your hand-worked test case before you spend time on formatting.",
        codeChallenge: {
          task: "Stage 2. Starting from your Stage 1 code, calculate total, average and passed (True if the average is 50 or more). After the inputs, print three lines: Total: 308 then Average: 77.0 then Passed: True",
          starter: "# Paste your Stage 1 code, then add the calculations\n",
          sample: "Student name: Ada\nMaths: 70\nEnglish: 65\nScience: 82\nComputing: 91\nTotal: 308\nAverage: 77.0\nPassed: True",
          tests: [
            {
              label: "a normal student",
              inputs: ["Ada", "70", "65", "82", "91"],
              check:
                'assert lines[-3:] == ["Total: 308", "Average: 77.0", "Passed: True"], "For Ada expect Total: 308, Average: 77.0, Passed: True. Yours: " + repr(lines[-3:])',
            },
            {
              label: "an average of exactly 50",
              inputs: ["Bayo", "48", "52", "50", "50"],
              check:
                'assert lines[-3:] == ["Total: 200", "Average: 50.0", "Passed: True"], "An average of exactly 50 passes. Yours: " + repr(lines[-3:])',
            },
            {
              label: "just below the pass mark",
              inputs: ["Chi", "49", "50", "50", "50"],
              check:
                'assert lines[-3:] == ["Total: 199", "Average: 49.75", "Passed: False"], "An average of 49.75 does not pass. Yours: " + repr(lines[-3:])',
            },
          ],
          solution: 'name = input("Student name: ")\nmaths = int(input("Maths: "))\nenglish = int(input("English: "))\nscience = int(input("Science: "))\ncomputing = int(input("Computing: "))\ntotal = maths + english + science + computing\naverage = total / 4\npassed = average >= 50\nprint("Total:", total)\nprint("Average:", average)\nprint("Passed:", passed)\n',
          revealSolution: false,
          hint: "Remember the precedence trap from Module 4: the total must be calculated before dividing. passed = average >= 50.",
          successMessage: "Correct for a normal student and on both sides of the boundary. The logic is right; now make it look professional.",
        },
      },
      {
        id: "a-pp-a1-report",
        title: "Stage 3: the formatted result",
        explain:
          "The final stage is presentation. Use f-strings and the format specification you learned: {average:.2f} for two decimal places. Lining up text in columns makes a report easy to read: an f-string can pad a value to a fixed width with {name:<12}, which left-aligns it in 12 characters.",
        code: {
          language: "python",
          code: "print(f\"{'Maths':<12}{70:>5}\")\nprint(f\"{'English':<12}{65:>5}\")\n",
          expectedOutput: "Maths          70\nEnglish        65",
        },
        codeChallenge: {
          task: "Stage 3, the finished program. After the inputs, print this report: a line of 24 = signs; REPORT FOR followed by the name in capitals; another line of 24 = signs; one line per subject with the subject name left-aligned in 12 characters and the score right-aligned in 5; then Total, Average to 2 decimal places, and Result: PASS or FAIL. For PASS/FAIL you may use: result = \"PASS\" * passed + \"FAIL\" * (not passed) (multiplying text by True or False gives the text or an empty string).",
          starter: "# Your finished Student Score Calculator\n",
          sample: "========================\nREPORT FOR ADA\n========================\nMaths          70\nEnglish        65\nScience        82\nComputing      91\nTotal: 308\nAverage: 77.00\nResult: PASS",
          tests: [
            {
              label: "a normal student",
              inputs: ["Ada", "70", "65", "82", "91"],
              check:
                'r = lines[5:]\n' +
                'assert r[0] == "=" * 24 and r[2] == "=" * 24, "Start the report with a line of 24 = signs, the heading, then another line of 24."\n' +
                'assert r[1] == "REPORT FOR ADA", "The heading should be REPORT FOR followed by the name in capitals. Yours: " + r[1]\n' +
                'assert r[3:7] == ["Maths          70", "English        65", "Science        82", "Computing      91"], "Subject lines: name left-aligned in 12, score right-aligned in 5. Yours: " + repr(r[3:7])\n' +
                'assert r[7:] == ["Total: 308", "Average: 77.00", "Result: PASS"], "Then Total, Average to 2 dp and Result. Yours: " + repr(r[7:])',
            },
            {
              label: "a student who fails",
              inputs: ["Chi", "49", "50", "50", "50"],
              check:
                'r = lines[5:]\n' +
                'assert r[1] == "REPORT FOR CHI" and r[-2:] == ["Average: 49.75", "Result: FAIL"], "For Chi the report should end Average: 49.75 and Result: FAIL. Yours: " + repr(r[-2:])',
            },
          ],
          solution: 'name = input("Student name: ")\nmaths = int(input("Maths: "))\nenglish = int(input("English: "))\nscience = int(input("Science: "))\ncomputing = int(input("Computing: "))\ntotal = maths + english + science + computing\naverage = total / 4\npassed = average >= 50\nresult = "PASS" * passed + "FAIL" * (not passed)\nprint("=" * 24)\nprint("REPORT FOR " + name.upper())\nprint("=" * 24)\nprint(f"{\x27Maths\x27:<12}{maths:>5}")\nprint(f"{\x27English\x27:<12}{english:>5}")\nprint(f"{\x27Science\x27:<12}{science:>5}")\nprint(f"{\x27Computing\x27:<12}{computing:>5}")\nprint("Total:", total)\nprint(f"Average: {average:.2f}")\nprint("Result:", result)\n',
          revealSolution: false,
          hint: "Build it from your Stage 2 code. name.upper() gives capitals. For a subject line: f\"{\x27Maths\x27:<12}{maths:>5}\".",
          successMessage: "Your Student Score Calculator is complete, tested on a pass and a fail, and written by you. That is the Phase 1 milestone: a full program, independently.",
        },
      },
      {
        id: "a-pp-a1-review",
        title: "Review: what makes this a good program",
        explain:
          "A program that passes its tests is the minimum. Read it back as a reviewer would: are the names clear, is each value typed once, would another person understand it, and what would happen with bad input? Note anything you would improve: in Module 5 you will add an if statement for grades, and in Module 12 you will stop a typed word from crashing it.",
        decision: {
          scenario: "A classmate's calculator passes all the tests, but uses variables called a, b, c, d, t and av, and has the number 4 typed in three different places.",
          question: "What is the most useful review comment?",
          options: [
            {
              id: "a",
              text: "It passes the tests, so there is nothing to say",
              whyWrong: "Tests prove behaviour, not clarity. Code is read and changed far more often than it is written.",
            },
            {
              id: "b",
              text: "Rename the variables to say what they hold (maths, total, average) and store the number of subjects once, in a constant such as SUBJECTS = 4",
              why: "Clear names make the code self-explanatory, and a single constant means adding a fifth subject is a one-line change instead of a hunt for every 4.",
            },
            {
              id: "c",
              text: "Rewrite it in one line to make it shorter",
              whyWrong: "Shorter is not better if it is harder to read. Clarity is the goal.",
            },
            {
              id: "d",
              text: "Add more comments to explain what a and b mean",
              whyWrong: "Good names make those comments unnecessary. Fix the names, not the symptoms.",
            },
          ],
          correct: "b",
          aftermath: "Clear names and single sources of truth: the two cheapest improvements to any program. Module 15 returns to code review properly.",
        },
      },
    ],

    task: {
      title: "Phase 1 assessment: submit your Student Score Calculator",
      intro:
        "Complete the project in VS Code as score_calculator.py, without copying a solution. You will be assessed on correctness, readability and testing.",
      prompts: [
        "Include your pseudocode and a photo or drawing of your flowchart alongside the file.",
        "The program accepts a student's name and four scores, calculates the total and average, and prints a formatted result with a pass/fail line.",
        "Use clear variable names and a constant for the pass mark (PASS_MARK = 50).",
        "Write down at least three test cases with hand-worked answers (including an average of exactly 50) and show that your program matches them.",
        "Extension: add a fifth subject. Count how many lines you had to change, and explain how a constant for the number of subjects helps.",
      ],
      closing:
        "Phase 1 complete. Phase 2 begins with decisions: making your programs choose what to do.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
