/**
 * PYTHON PROGRAMMING · MODULE 6 · LOOPS AND REPETITION
 *
 * Curriculum 6.1 – 6.9. while and for, range(), counters and accumulators,
 * break, continue and pass, nested loops, infinite loops and dry-running.
 * The practice harness stops a runaway loop after a fixed number of steps and
 * says why, so a learner's infinite loop is a lesson, not a frozen tab.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s6-loops";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 6.1 – 6.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l23-while",
    moduleId: "pp-m6-loops",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2"],
    title: "Why Loops Exist, and while",
    subtitle: "Repeating work while a condition stays True",
    estimatedMinutes: 18,
    intro:
      "Printing the numbers 1 to 5 takes five print() lines. Printing 1 to 5,000 would take five thousand. A loop says \"do this again\" instead, so the amount of code stays the same however many times the work repeats.",

    atoms: [
      {
        id: "a-pp-why-loops",
        title: "Why loops exist",
        explain:
          "A loop repeats a block of code. It replaces copy-and-paste, which is long, error-prone and impossible when you do not know in advance how many times to repeat (how many items a customer buys, how many guesses a player needs). Python has two loops: while repeats as long as a condition is True; for repeats once for each item in a sequence.",
        decision: {
          scenario: "A program must keep asking for a password until the user types the correct one. Nobody knows how many attempts they will need.",
          question: "Which approach works?",
          options: [
            {
              id: "a",
              text: "Write ten input() lines, one after another",
              whyWrong: "Someone might need eleven attempts, and someone who gets it right first time still has to answer nine more prompts.",
            },
            {
              id: "b",
              text: "A while loop that repeats as long as the typed password is wrong",
              why: "while repeats an unknown number of times, stopping exactly when the condition becomes False. That is what it is for.",
            },
            {
              id: "c",
              text: "An if statement",
              whyWrong: "An if decides once. It cannot ask again.",
            },
            {
              id: "d",
              text: "It cannot be done in Python",
              whyWrong: "It is one of the most common loops there is; you will write it in this lesson.",
            },
          ],
          correct: "b",
          aftermath: "Unknown number of repeats: while. Known number, or one per item: for (next lesson).",
        },
      },
      {
        id: "a-pp-while",
        title: "The while loop",
        explain:
          "while condition: followed by an indented block. Python checks the condition; if True it runs the block, then goes back and checks again. When the condition is False the loop ends and the program continues after it. Something inside the block must eventually make the condition False, or the loop never stops.",
        code: {
          language: PY,
          code: 'count = 1\nwhile count <= 5:\n    print("Lap", count)\n    count += 1\nprint("Race finished")\n',
          expectedOutput: "Lap 1\nLap 2\nLap 3\nLap 4\nLap 5\nRace finished",
        },
        trace: {
          headers: ["Check", "count", "count <= 5?", "Action"],
          rows: [
            ["1", "1", "True", "print Lap 1, count becomes 2"],
            ["2", "2", "True", "print Lap 2, count becomes 3"],
            ["…", "…", "…", "…"],
            ["5", "5", "True", "print Lap 5, count becomes 6"],
            ["6", "6", "False", "loop ends; print Race finished"],
          ],
        },
        codeChallenge: {
          task: "Countdown. Ask for a starting number, then use a while loop to print every number from it down to 1, one per line, and finally Lift off!",
          starter: 'n = int(input("Start from: "))\n',
          sample: "Start from: 3\n3\n2\n1\nLift off!",
          tests: [
            { inputs: ["3"], check: 'assert lines[1:] == ["3", "2", "1", "Lift off!"], "From 3 expect 3, 2, 1, Lift off!. Yours: " + repr(lines[1:])' },
            {
              inputs: ["10"],
              check: 'assert lines[1:] == [str(i) for i in range(10, 0, -1)] + ["Lift off!"], "From 10 expect 10 down to 1, then Lift off!. Yours: " + repr(lines[1:])\nassert uses("While"), "Use a while loop."',
            },
          ],
          solution: 'n = int(input("Start from: "))\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("Lift off!")\n',
          hint: "while n >= 1: print n, then n -= 1 inside the loop. Lift off! goes after the loop, not indented.",
          successMessage: "The same four lines of code count down from 3 or from 10,000. That is the point of a loop.",
        },
      },
      {
        id: "a-pp-while-input",
        title: "Looping until the user gets it right",
        explain:
          "A while loop with input() inside keeps asking until the answer is acceptable. The usual shape: ask once before the loop, loop while the answer is wrong, and ask again at the end of the loop body. A counter variable can record how many attempts were needed.",
        code: {
          language: PY,
          code: 'secret = 7\nguess = int(input("Guess: "))\ntries = 1\nwhile guess != secret:\n    print("Wrong, try again")\n    guess = int(input("Guess: "))\n    tries += 1\nprint("Correct in", tries, "tries")\n',
          inputs: ["4", "9", "7"],
          expectedOutput: "Guess: 4\nWrong, try again\nGuess: 9\nWrong, try again\nGuess: 7\nCorrect in 3 tries",
        },
        codeChallenge: {
          task: "Number guessing with hints. The secret number is 42. Keep asking Guess: until the user gets it. After a wrong guess print Too low or Too high. When they get it, print You got it in N guesses (N is the number of guesses, including the correct one).",
          starter: "secret = 42\n",
          sample: "Guess: 50\nToo high\nGuess: 30\nToo low\nGuess: 42\nYou got it in 3 guesses",
          tests: [
            {
              inputs: ["50", "30", "42"],
              check: 'assert lines == ["Guess: 50", "Too high", "Guess: 30", "Too low", "Guess: 42", "You got it in 3 guesses"], "Check the hints and the count. Yours: " + repr(lines)',
            },
            {
              inputs: ["42"],
              check: 'assert lines == ["Guess: 42", "You got it in 1 guesses"], "A correct first guess: no hint, and 1 guess. Yours: " + repr(lines)\nassert uses("While"), "Use a while loop."',
            },
          ],
          solution: 'secret = 42\nguess = int(input("Guess: "))\nguesses = 1\nwhile guess != secret:\n    if guess < secret:\n        print("Too low")\n    else:\n        print("Too high")\n    guess = int(input("Guess: "))\n    guesses += 1\nprint("You got it in", guesses, "guesses")\n',
          hint: "Ask once before the loop. Inside: give the hint with if/else, ask again, add 1 to the counter.",
          successMessage: "A complete little game: a loop, a decision inside it, and a counter. (Yes, \"1 guesses\" is clumsy. You will fix plurals properly in Module 8.)",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 6.3 – 6.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l24-for-range",
    moduleId: "pp-m6-loops",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.3", "6.4"],
    title: "for Loops and range()",
    subtitle: "Repeating once for each item or number",
    estimatedMinutes: 18,
    intro:
      "When you know what you are repeating over, the characters of a word, the numbers 1 to 12, the items in a basket, a for loop is shorter and safer than while: there is no counter to forget to update.",

    atoms: [
      {
        id: "a-pp-for",
        title: "for: once for each item",
        explain:
          "for item in sequence: runs its block once for each item, with the loop variable holding the current item each time. A string is a sequence of characters; a list in square brackets is a sequence of values (Module 9 covers lists fully). The loop ends by itself after the last item.",
        code: {
          language: PY,
          code: 'for letter in "Ada":\n    print(letter)\nfor day in ["Mon", "Tue", "Wed"]:\n    print("Class on", day)\n',
          expectedOutput: "A\nd\na\nClass on Mon\nClass on Tue\nClass on Wed",
        },
        codeChallenge: {
          task: "Ask the user for a word and use a for loop to print each character on its own line, followed by a dash: A-",
          starter: 'word = input("Word: ")\n',
          sample: "Word: Eko\nE-\nk-\no-",
          tests: [
            { inputs: ["Eko"], check: 'assert lines[1:] == ["E-", "k-", "o-"], "For Eko expect E-, k-, o-. Yours: " + repr(lines[1:])' },
            { inputs: ["Python"], check: 'assert lines[1:] == [c + "-" for c in "Python"], "Every character of the word, each with a dash. Yours: " + repr(lines[1:])\nassert uses("For"), "Use a for loop."' },
          ],
          solution: 'word = input("Word: ")\nfor ch in word:\n    print(ch + "-")\n',
          hint: "for ch in word: then print(ch + \"-\") indented.",
          successMessage: "No counter, no condition, no risk of an infinite loop: for handles all of that.",
        },
      },
      {
        id: "a-pp-range",
        title: "range(): a sequence of numbers",
        explain:
          "range(stop) gives 0, 1, … up to but NOT including stop. range(start, stop) begins at start. range(start, stop, step) counts in steps, and a negative step counts down. The \"up to but not including\" rule means range(1, 11) is 1 to 10.",
        table: {
          caption: "range() and the numbers it produces.",
          headers: ["Call", "Numbers"],
          rows: [
            ["range(5)", "0 1 2 3 4"],
            ["range(1, 6)", "1 2 3 4 5"],
            ["range(2, 11, 2)", "2 4 6 8 10"],
            ["range(10, 0, -3)", "10 7 4 1"],
          ],
        },
        code: {
          language: PY,
          code: 'n = 7\nfor i in range(1, 4):\n    print(n, "x", i, "=", n * i)\n',
          expectedOutput: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21",
        },
        codeChallenge: {
          task: "Multiplication table. Ask for a number and print its table from 1 to 12, in the form 7 x 1 = 7, using for and range().",
          starter: 'n = int(input("Table of: "))\n',
          sample: "Table of: 7\n7 x 1 = 7\n7 x 2 = 14\n...\n7 x 12 = 84",
          tests: [
            { inputs: ["7"], check: 'assert lines[1:] == [f"7 x {i} = {7 * i}" for i in range(1, 13)], "Expect 12 lines, 7 x 1 = 7 up to 7 x 12 = 84. Yours ended: " + repr(lines[-1])' },
            { inputs: ["12"], check: 'assert lines[-1] == "12 x 12 = 144" and len(lines) == 13, "For 12 the last line is 12 x 12 = 144, and there are 12 lines. Yours: " + repr(lines[-1])\nassert calls("range"), "Use range()."' },
          ],
          solution: 'n = int(input("Table of: "))\nfor i in range(1, 13):\n    print(n, "x", i, "=", n * i)\n',
          hint: "range(1, 13) gives 1 to 12, because the stop value is not included.",
          successMessage: "Twelve lines from two lines of code, for any number. Notice you needed 13 to get to 12: that is the off-by-one rule of range().",
        },
      },
      {
        id: "a-pp-range-step",
        title: "Counting in steps",
        explain:
          "The third argument of range() is the step. range(0, 21, 5) counts 0, 5, 10, 15, 20. Combine a step with a variable start and stop to generate any regular sequence: even numbers, every third day, a countdown.",
        codeExercise: {
          language: PY,
          code: "for i in range(10, 0, -4):\n    print(i)\nfor j in range(3, 10, 3):\n    print(j)\n",
          question: "Apply start, stop and step, remembering the stop value is never included. What does this print?",
          expectedOutput: "10\n6\n2\n3\n6\n9",
          hint: "First loop: 10, then 10 - 4, then again, stopping before 0. Second: 3, 6, 9, stopping before 10.",
          successMessage: "Right. The countdown stops at 2 because the next value, -2, is past the stop.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 6.5 – 6.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l25-accumulators-break",
    moduleId: "pp-m6-loops",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.5", "6.6"],
    title: "Counters, Accumulators, break and continue",
    subtitle: "Building results inside a loop, and changing its flow",
    estimatedMinutes: 20,
    intro:
      "Most useful loops build something up: a total, a count, a product. And sometimes a loop should stop early, or skip one item. This lesson covers the patterns behind sums, factorials and prime checks.",

    atoms: [
      {
        id: "a-pp-accumulators",
        title: "Counters and accumulators",
        explain:
          "A counter counts how many times something happened: start at 0, add 1 each time. An accumulator builds a total: start at 0 (or 1 for a product), add or multiply each value. Always create the variable BEFORE the loop; creating it inside would reset it on every pass.",
        code: {
          language: PY,
          code: 'total = 0\ncount = 0\nfor price in [1200, 450, 3000, 800]:\n    total += price\n    count += 1\nprint("Items:", count)\nprint("Total:", total)\nprint("Average:", total / count)\n',
          expectedOutput: "Items: 4\nTotal: 5450\nAverage: 1362.5",
        },
        codeChallenge: {
          task: "Sum of numbers. Ask How many numbers? then ask for that many numbers (Number: each time, as floats). Print the total and the average, each to 2 decimal places, as Total: 18.50 and Average: 6.17",
          starter: 'how_many = int(input("How many numbers? "))\n',
          sample: "How many numbers? 3\nNumber: 4\nNumber: 10.5\nNumber: 4\nTotal: 18.50\nAverage: 6.17",
          tests: [
            { inputs: ["3", "4", "10.5", "4"], check: 'assert lines[-2:] == ["Total: 18.50", "Average: 6.17"], "4 + 10.5 + 4 = 18.50, average 6.17. Yours: " + repr(lines[-2:])' },
            { inputs: ["5", "10", "20", "30", "40", "50"], check: 'assert lines[-2:] == ["Total: 150.00", "Average: 30.00"], "Five numbers 10 to 50: total 150.00, average 30.00. Yours: " + repr(lines[-2:])\nassert uses("For") or uses("While"), "Use a loop to ask for the numbers."' },
          ],
          solution: 'how_many = int(input("How many numbers? "))\ntotal = 0\nfor i in range(how_many):\n    total += float(input("Number: "))\nprint(f"Total: {total:.2f}")\nprint(f"Average: {total / how_many:.2f}")\n',
          hint: "total = 0 before the loop. for i in range(how_many): add each float(input(...)) to total.",
          successMessage: "The same program sums 3 numbers or 300. The accumulator, created before the loop and updated inside it, is one of the most used patterns in programming.",
        },
      },
      {
        id: "a-pp-factorial",
        title: "Practice: factorials",
        explain:
          "The factorial of n, written n!, is 1 × 2 × 3 × … × n, so 5! = 120. It is an accumulator that multiplies, so it must start at 1: starting at 0 would make every product 0. By definition 0! is 1.",
        codeChallenge: {
          task: "Ask for a whole number n (0 or more) and print n! using a loop, as 5! = 120",
          starter: 'n = int(input("n: "))\n',
          sample: "n: 5\n5! = 120",
          tests: [
            { inputs: ["5"], check: 'assert lines[-1] == "5! = 120", "5! is 120. Yours: " + lines[-1]' },
            { inputs: ["1"], check: 'assert lines[-1] == "1! = 1", "1! is 1. Yours: " + lines[-1]' },
            { inputs: ["0"], check: 'assert lines[-1] == "0! = 1", "0! is 1 by definition. Start your product at 1. Yours: " + lines[-1]' },
            { inputs: ["10"], check: 'assert lines[-1] == "10! = 3628800", "10! is 3628800. Yours: " + lines[-1]\nassert "math" not in source, "Write the loop yourself rather than using math.factorial."' },
          ],
          solution: 'n = int(input("n: "))\nresult = 1\nfor i in range(1, n + 1):\n    result *= i\nprint(f"{n}! = {result}")\n',
          hint: "result = 1, then for i in range(1, n + 1): result *= i. Print with f\"{n}! = {result}\".",
          successMessage: "A multiplying accumulator. Notice 0 works with no special case: range(1, 1) is empty, so result stays 1.",
        },
      },
      {
        id: "a-pp-break-continue",
        title: "break, continue and pass",
        explain:
          "break ends the loop immediately, skipping any remaining items. continue skips the rest of THIS pass and moves to the next item. pass does nothing at all: it is a placeholder where Python needs a statement but you have nothing to write yet.",
        code: {
          language: PY,
          code: 'for n in [4, -2, 7, 0, 9]:\n    if n == 0:\n        print("Zero found, stopping")\n        break\n    if n < 0:\n        continue\n    print("Processing", n)\n',
          expectedOutput: "Processing 4\nProcessing 7\nZero found, stopping",
        },
        why: "-2 is skipped by continue; 0 triggers break, so 9 is never reached.",
        codeChallenge: {
          task: "Prime checker. Ask for a whole number of at least 2. Check every possible divisor from 2 upwards; as soon as one divides it exactly, print Not prime, divisible by D and break. If no divisor is found, print Prime. (Hint: a for loop can have an else: block that runs only if the loop was not broken.)",
          starter: 'n = int(input("Number: "))\n',
          sample: "Number: 91\nNot prime, divisible by 7",
          tests: [
            { inputs: ["91"], check: 'assert lines[-1] == "Not prime, divisible by 7", "91 = 7 × 13; the first divisor found is 7. Yours: " + lines[-1]' },
            { inputs: ["97"], check: 'assert lines[-1] == "Prime", "97 is prime. Yours: " + lines[-1]' },
            { inputs: ["2"], check: 'assert lines[-1] == "Prime", "2 is prime. Yours: " + lines[-1]' },
            { inputs: ["100"], check: 'assert lines[-1] == "Not prime, divisible by 2", "100 is divisible by 2. Yours: " + lines[-1]\nassert "break" in source, "Use break to stop at the first divisor."' },
          ],
          solution: 'n = int(input("Number: "))\nfor d in range(2, n):\n    if n % d == 0:\n        print("Not prime, divisible by", d)\n        break\nelse:\n    print("Prime")\n',
          hint: "for d in range(2, n): if n % d == 0: print and break. Put else: at the same indentation as for, with print(\"Prime\").",
          successMessage: "break stops as soon as the answer is known, and for/else handles \"never found\" neatly. Searching loops use this shape all the time.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 6.7 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l26-nested-tracing",
    moduleId: "pp-m6-loops",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.7", "6.8", "6.9"],
    title: "Nested Loops, Infinite Loops and Tracing",
    subtitle: "Loops inside loops, loops that never end, and dry-running",
    estimatedMinutes: 20,
    intro:
      "A loop inside a loop draws grids and patterns. A loop whose condition never becomes False runs forever. And the way to understand any loop, or find what is wrong with it, is to trace it by hand. This lesson covers all three.",

    atoms: [
      {
        id: "a-pp-nested-loops",
        title: "Nested loops",
        explain:
          "A nested loop is a loop inside another loop's block. For every single pass of the outer loop, the inner loop runs completely. With an outer loop of 3 and an inner loop of 4, the inner block runs 12 times. Rows and columns, tables and text patterns are nested loops.",
        code: {
          language: PY,
          code: 'for row in range(1, 4):\n    line = ""\n    for col in range(1, 4):\n        line += str(row * col) + " "\n    print(line)\n',
          expectedOutput: "1 2 3\n2 4 6\n3 6 9",
        },
        codeChallenge: {
          task: "Text pattern. Ask for a height and print a right-angled triangle of * characters: row 1 has one *, row 2 has two, and so on up to the height. Use a nested loop (an inner loop that adds one * at a time), not \"*\" * n.",
          starter: 'height = int(input("Height: "))\n',
          sample: "Height: 4\n*\n**\n***\n****",
          tests: [
            { inputs: ["4"], check: 'assert lines[1:] == ["*", "**", "***", "****"], "Height 4 expects 4 rows growing from 1 to 4 stars. Yours: " + repr(lines[1:])' },
            {
              inputs: ["6"],
              check: 'assert lines[1:] == ["*" * i for i in range(1, 7)], "Height 6 expects 6 rows. Yours: " + repr(lines[1:])\nimport ast\nloops = [n for n in ast.walk(ast.parse(source)) if isinstance(n, (ast.For, ast.While))]\nassert any(isinstance(m, (ast.For, ast.While)) for l in loops for m in ast.walk(l) if m is not l), "Use a loop inside a loop."',
            },
          ],
          solution: 'height = int(input("Height: "))\nfor row in range(1, height + 1):\n    line = ""\n    for i in range(row):\n        line += "*"\n    print(line)\n',
          hint: "Outer loop over rows 1 to height. Inside it: line = \"\", an inner loop that adds \"*\" row times, then print(line).",
          successMessage: "The outer loop decides how many rows; the inner loop decides what goes in each. Every grid you ever draw in code works this way.",
        },
      },
      {
        id: "a-pp-infinite-loops",
        title: "Infinite loops and termination conditions",
        explain:
          "A while loop ends only when its condition becomes False, so something in the body must move it towards False. Forget to update the counter, or update it in the wrong direction, and the loop runs forever. In VS Code press Ctrl+C in the terminal to stop it. Sometimes an endless loop is deliberate, while True:, with a break inside as the only way out.",
        code: {
          language: PY,
          code: 'total = 0\nwhile True:\n    total += 7\n    if total > 30:\n        break\nprint(total)\n',
          expectedOutput: "35",
        },
        codeChallenge: {
          task: "This program should print 1, 3, 5, 7 and 9, then Done, but it never stops. Run it to see the harness stop it, then find and fix the bug.",
          starter: 'n = 1\nwhile n != 10:\n    print(n)\n    n += 2\nprint("Done")\n',
          sample: "1\n3\n5\n7\n9\nDone",
          tests: [
            { check: 'assert lines == ["1", "3", "5", "7", "9", "Done"], "Expected 1, 3, 5, 7, 9, Done. Yours: " + repr(lines[:8])' },
          ],
          solution: 'n = 1\nwhile n < 10:\n    print(n)\n    n += 2\nprint("Done")\n',
          hint: "n takes the values 1, 3, 5, 7, 9, 11, 13 ... Does it ever equal exactly 10? Use a condition that becomes False once n passes 10.",
          successMessage: "!= is a dangerous loop condition: one step over the target and the loop never ends. < is safe because it still becomes False when n jumps past 10.",
        },
      },
      {
        id: "a-pp-tracing",
        title: "Tracing and dry-running a loop",
        explain:
          "To trace a loop, make a table with a column for each variable and a row for each pass. Fill it in line by line, exactly as Python would, without guessing. It is slow, and it is the most reliable way to understand a loop you did not write or find out why yours is wrong.",
        trace: {
          headers: ["Pass", "i", "total before", "total after"],
          rows: [
            ["1", "1", "0", "1"],
            ["2", "2", "1", "5"],
            ["3", "3", "5", "14"],
          ],
          note: "Code: total = 0; for i in range(1, 4): total += i * i",
        },
        codeExercise: {
          language: PY,
          code: "x = 20\ncount = 0\nwhile x > 1:\n    x = x // 2\n    count += 1\nprint(x, count)\n",
          question: "Trace it with a table for x and count. What does it print?",
          expectedOutput: "1 4",
          hint: "x goes 20 → 10 → 5 → 2 → 1. Count each pass.",
          successMessage: "Four halvings take 20 to 1. Tracing turns \"I think it does this\" into \"I know it does this\".",
        },
      },
    ],

    task: {
      title: "Module 6 practice: six loop programs",
      intro:
        "Write each as a separate file and trace at least one of them on paper. The milestone is to solve repetitive problems without duplicating code.",
      prompts: [
        "Multiplication tables: print the full 1–12 table for every number from 1 to 12 using a nested loop.",
        "Factorials: print n! for every n from 0 to 10.",
        "Number guessing: use random.randint(1, 100) (import random at the top) and give Too high / Too low hints.",
        "Sum of numbers: keep asking for numbers until the user types 0, then print the total, count and average.",
        "Prime checking: print every prime number between 2 and 100.",
        "Simple text patterns: a triangle, an upside-down triangle and a square of a size the user chooses.",
      ],
      closing: "Next: functions, so you can name a piece of logic and reuse it anywhere.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
