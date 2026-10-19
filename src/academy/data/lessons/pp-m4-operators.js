/**
 * PYTHON PROGRAMMING · MODULE 4 · OPERATORS AND EXPRESSIONS
 *
 * Curriculum 4.1 – 4.9. Every operator a beginner needs, precedence, string
 * operators, truthiness, and the two numeric traps. The milestone: translate
 * a mathematical formula into a correct Python expression.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s4-operators";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l13-arithmetic",
    moduleId: "pp-m4-operators",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1"],
    title: "Arithmetic Operators",
    subtitle: "+, -, *, /, //, % and **, and turning formulas into code",
    estimatedMinutes: 16,
    intro:
      "Python is a very good calculator, but it has three operators most calculators do not show you: floor division, remainder and power. Between them they solve a surprising number of everyday problems, from splitting minutes into hours to checking whether a number is even.",

    atoms: [
      {
        id: "a-pp-arith-ops",
        title: "The seven arithmetic operators",
        explain:
          "+ adds, - subtracts and * multiplies. / divides and ALWAYS gives a float, even 10 / 2 is 5.0. // is floor division: divide and drop the fraction (rounding down). % is the remainder (modulo): what is left over after floor division. ** is power: 2 ** 3 is 2 × 2 × 2.",
        table: {
          caption: "Arithmetic operators with 17 and 5.",
          headers: ["Operator", "Name", "Example", "Result"],
          rows: [
            ["+", "Addition", "17 + 5", "22"],
            ["-", "Subtraction", "17 - 5", "12"],
            ["*", "Multiplication", "17 * 5", "85"],
            ["/", "Division", "17 / 5", "3.4"],
            ["//", "Floor division", "17 // 5", "3"],
            ["%", "Remainder (modulo)", "17 % 5", "2"],
            ["**", "Power", "17 ** 2", "289"],
          ],
        },
        code: {
          language: PY,
          code: 'cost = 12500\nselling = 15000\nprofit = selling - cost\nprint("Profit:", profit)\nprint("Profit %:", profit / cost * 100)\n',
          expectedOutput: "Profit: 2500\nProfit %: 20.0",
        },
        codeChallenge: {
          task: "Profit and loss. Ask for the cost price and the selling price of an item (whole naira). Print the profit (negative means a loss) and the profit as a percentage of the cost price to 2 decimal places.",
          starter: "# Ask for the two prices, then calculate\n",
          sample: "Cost price: 8000\nSelling price: 9800\nProfit: 1800\nProfit %: 22.50",
          tests: [
            {
              inputs: ["8000", "9800"],
              check: 'body = "\\n".join(lines[2:])\nassert "1800" in body and "22.50" in body, "Cost 8000, selling 9800: profit 1800 and 22.50 percent. Yours: " + body',
            },
            {
              inputs: ["5000", "4000"],
              check: 'body = "\\n".join(lines[2:])\nassert "-1000" in body and "-20.00" in body, "Cost 5000, selling 4000 is a loss: -1000 and -20.00 percent. Yours: " + body',
            },
          ],
          solution: 'cost = int(input("Cost price: "))\nselling = int(input("Selling price: "))\nprofit = selling - cost\nprint("Profit:", profit)\nprint(f"Profit %: {profit / cost * 100:.2f}")\n',
          hint: "profit = selling - cost. The percentage is profit / cost * 100, formatted with :.2f.",
          successMessage: "One formula handles profit and loss: a negative profit is a loss. Testing both cases is how you know it works.",
        },
      },
      {
        id: "a-pp-floor-mod",
        title: "// and %: splitting into whole parts and remainders",
        explain:
          "// and % are a pair. total // size tells you how many whole groups fit; total % size tells you what is left over. Converting units is their classic use: 135 minutes is 135 // 60 = 2 hours and 135 % 60 = 15 minutes.",
        code: {
          language: PY,
          code: 'minutes = 135\nprint(minutes // 60, "hours and", minutes % 60, "minutes")\nprint(17 % 2, 18 % 2)\n',
          expectedOutput: "2 hours and 15 minutes\n1 0",
        },
        why: "n % 2 is 0 for every even number and 1 for every odd number. You will use that test constantly.",
        codeChallenge: {
          task: "Time conversion. Ask for a number of seconds and print it as hours, minutes and seconds, in the form: 3725 seconds is 1 h 2 min 5 s",
          starter: 'seconds = int(input("Seconds: "))\n',
          sample: "Seconds: 3725\n3725 seconds is 1 h 2 min 5 s",
          tests: [
            {
              inputs: ["3725"],
              check: 'assert lines[-1].endswith("1 h 2 min 5 s"), "3725 seconds is 1 h 2 min 5 s. Your last line: " + lines[-1]',
            },
            {
              inputs: ["7384"],
              check:
                'assert lines[-1].endswith("2 h 3 min 4 s"), "7384 seconds is 2 h 3 min 4 s. Your last line: " + lines[-1]\n' +
                'assert "//" in source and "%" in source, "Use // and % to split the seconds."',
            },
          ],
          solution: 'seconds = int(input("Seconds: "))\nhours = seconds // 3600\nminutes = seconds % 3600 // 60\nleft = seconds % 60\nprint(seconds, "seconds is", hours, "h", minutes, "min", left, "s")\n',
          hint: "hours = seconds // 3600. What remains after taking the hours is seconds % 3600; divide that by 60 for minutes. The final seconds are seconds % 60.",
          successMessage: "Whole parts with //, leftovers with %. Clocks, money in notes and coins, and pagination all work this way.",
        },
      },
      {
        id: "a-pp-formulas",
        title: "Translating a formula into Python",
        explain:
          "To turn a maths formula into code: give each quantity a variable, replace × with * and ÷ with /, write powers with **, and add brackets wherever the formula groups things. Then test with numbers you can check by hand.",
        example:
          "Simple interest:   SI = (P × R × T) / 100\nPython:            si = principal * rate * years / 100\n\nArea of a circle:  A = πr²\nPython:            area = 3.14159 * radius ** 2\n\nAverage of three:  (a + b + c) ÷ 3\nPython:            average = (a + b + c) / 3",
        codeChallenge: {
          task: "Simple interest calculator. Ask for the principal (naira), the yearly rate (percent) and the number of years, all as floats. Print the simple interest and the total amount (principal + interest), both to 2 decimal places.",
          starter: "# SI = P * R * T / 100\n",
          sample: "Principal: 50000\nRate (%): 10\nYears: 2\nInterest: 10000.00\nTotal: 60000.00",
          tests: [
            {
              inputs: ["50000", "10", "2"],
              check: 'body = "\\n".join(lines[3:])\nassert "10000.00" in body and "60000.00" in body, "50000 at 10% for 2 years: interest 10000.00, total 60000.00. Yours: " + body',
            },
            {
              inputs: ["120000", "7.5", "3"],
              check: 'body = "\\n".join(lines[3:])\nassert "27000.00" in body and "147000.00" in body, "120000 at 7.5% for 3 years: interest 27000.00, total 147000.00. Yours: " + body',
            },
          ],
          solution: 'principal = float(input("Principal: "))\nrate = float(input("Rate (%): "))\nyears = float(input("Years: "))\ninterest = principal * rate * years / 100\nprint(f"Interest: {interest:.2f}")\nprint(f"Total: {principal + interest:.2f}")\n',
          hint: "interest = principal * rate * years / 100, then format both numbers with :.2f.",
          successMessage: "A formula, translated and tested with two sets of numbers you could check by hand. That is the milestone for this module.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 4.2 – 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l14-compare-logic",
    moduleId: "pp-m4-operators",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.2", "4.3", "4.4"],
    title: "Assignment, Comparison and Logical Operators",
    subtitle: "+=, ==, !=, <, and, or, not",
    estimatedMinutes: 16,
    intro:
      "Arithmetic produces numbers. Comparison and logical operators produce True or False, and those answers are what every decision in a program is built from. Shortcut assignment operators make updating a variable quicker to write.",

    atoms: [
      {
        id: "a-pp-assignment-ops",
        title: "Assignment operators: +=, -=, *= and friends",
        explain:
          "stock = stock + 20 is so common that Python has a shortcut: stock += 20. The same works for every arithmetic operator: -=, *=, /=, //=, %= and **=. They mean exactly the same as the long form.",
        code: {
          language: PY,
          code: 'stock = 50\nstock += 20   # delivery\nstock -= 35   # sales\nprint(stock)\nprice = 400\nprice *= 2\nprint(price)\n',
          expectedOutput: "35\n800",
        },
        codeChallenge: {
          task: "A shop starts the day with 120 loaves of bread in a variable loaves. In the morning it sells 45, at noon a delivery brings 60, in the evening it sells 98. Use -= and += for each event, then print the loaves left.",
          starter: "loaves = 120\n",
          sample: "37",
          tests: [
            {
              check:
                'assert loaves == 37, "120 - 45 + 60 - 98 is 37. loaves is " + str(loaves)\n' +
                'assert source.count("-=") >= 2 and "+=" in source, "Use -= for the two sales and += for the delivery."\n' +
                'assert lines and lines[-1].strip().endswith("37"), "Print the number of loaves left."',
            },
          ],
          solution: "loaves = 120\nloaves -= 45\nloaves += 60\nloaves -= 98\nprint(loaves)\n",
          hint: "loaves -= 45 on the next line, then the delivery with +=, then the evening sales.",
          successMessage: "Shorter to write, same meaning. You will see += in nearly every loop you write in Module 6.",
        },
      },
      {
        id: "a-pp-comparison",
        title: "Comparison operators produce True or False",
        explain:
          "== asks \"are these equal?\" and != asks \"are these different?\". <, >, <= and >= compare sizes. Every comparison gives a bool. Do not confuse == (a question) with = (an assignment). Strings can be compared too: == is exact, so \"Lagos\" == \"lagos\" is False.",
        table: {
          caption: "Comparison operators with score = 50.",
          headers: ["Expression", "Meaning", "Value"],
          rows: [
            ["score == 50", "equal to", "True"],
            ["score != 50", "not equal to", "False"],
            ["score > 50", "greater than", "False"],
            ["score >= 50", "greater than or equal to", "True"],
            ["score < 40", "less than", "False"],
            ["\"Ada\" == \"ada\"", "exact text match", "False"],
          ],
        },
        codeExercise: {
          language: PY,
          code: 'age = 17\nprint(age >= 18)\nprint(age == 17)\nprint(age != 17)\nprint("SS3" == "ss3")\n',
          question: "Each line prints the answer to a yes/no question. What does it print?",
          expectedOutput: "False\nTrue\nFalse\nFalse",
          hint: "17 is not 18 or more. Text comparison is exact, capitals included.",
          successMessage: "Four questions, four bools. In Module 5 each of these becomes the condition of an if statement.",
        },
      },
      {
        id: "a-pp-logical",
        title: "Logical operators: and, or, not",
        explain:
          "and is True only if BOTH sides are True. or is True if AT LEAST ONE side is True. not flips True to False and back. They combine comparisons into one question, such as age >= 18 and has_id.",
        table: {
          caption: "The truth table for and and or.",
          headers: ["A", "B", "A and B", "A or B"],
          rows: [
            ["True", "True", "True", "True"],
            ["True", "False", "False", "True"],
            ["False", "True", "False", "True"],
            ["False", "False", "False", "False"],
          ],
        },
        codeChallenge: {
          task: "Voter eligibility. Ask for the user's age and whether they have a voter's card (they type yes or no). Store in a variable can_vote whether they are 18 or older AND answered yes, and print it: Can vote: True",
          starter: 'age = int(input("Age: "))\ncard = input("Voter card (yes/no): ")\n',
          sample: "Age: 20\nVoter card (yes/no): yes\nCan vote: True",
          tests: [
            { inputs: ["20", "yes"], check: 'assert can_vote is True, "20 with a card: can_vote should be True."' },
            { inputs: ["20", "no"], check: 'assert can_vote is False, "20 without a card: can_vote should be False."' },
            {
              inputs: ["16", "yes"],
              check:
                'assert can_vote is False, "16 with a card: can_vote should be False."\n' +
                'assert " and " in source, "Combine the two conditions with and."\n' +
                'assert lines[-1].endswith("False"), "Print can_vote on the last line."',
            },
            { inputs: ["18", "yes"], check: 'assert can_vote is True, "Exactly 18 counts: use >= 18, not > 18."' },
          ],
          solution: 'age = int(input("Age: "))\ncard = input("Voter card (yes/no): ")\ncan_vote = age >= 18 and card == "yes"\nprint("Can vote:", can_vote)\n',
          hint: 'can_vote = age >= 18 and card == "yes"',
          successMessage: "Four tests, including the boundary of exactly 18. Testing the edge of a condition is a habit worth having from day one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 4.5 – 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l15-precedence-strings",
    moduleId: "pp-m4-operators",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.5", "4.6"],
    title: "Precedence and String Operators",
    subtitle: "Which operator goes first, and + and * on text",
    estimatedMinutes: 15,
    intro:
      "When an expression has several operators, Python follows a fixed order. Getting it wrong does not raise an error: it silently gives the wrong answer, which is worse. Then a bonus: + and * also work on text.",

    atoms: [
      {
        id: "a-pp-precedence",
        title: "Operator precedence and parentheses",
        explain:
          "Python applies operators in this order: brackets first, then **, then *, /, // and %, then + and -, then comparisons, then not, and, or. Operators of the same level go left to right (except **, which goes right to left). When in doubt, add brackets: they cost nothing and make the meaning obvious.",
        table: {
          caption: "Precedence, from first to last.",
          headers: ["Level", "Operators"],
          rows: [
            ["1 (first)", "( ) brackets"],
            ["2", "** power"],
            ["3", "* / // %"],
            ["4", "+ -"],
            ["5", "== != < > <= >= in is"],
            ["6", "not"],
            ["7", "and"],
            ["8 (last)", "or"],
          ],
        },
        codeExercise: {
          language: PY,
          code: "print(2 + 3 * 4 ** 2)\nprint((2 + 3) * 4)\nprint(10 - 4 - 3)\nprint(2 ** 3 ** 2)\n",
          question: "Apply the precedence table carefully. What does this print?",
          expectedOutput: "50\n20\n3\n512",
          hint: "Line 1: 4 ** 2 first, then * 3, then + 2. Line 4: ** goes right to left, so 3 ** 2 first.",
          successMessage: "50, 20, 3, 512. The last one surprises most people: 2 ** 9, not 8 ** 2. When it matters, use brackets.",
        },
      },
      {
        id: "a-pp-average-bug",
        title: "The most common precedence bug: averages",
        explain:
          "To average three scores, you must add them THEN divide. Written as a + b + c / 3, Python divides only c by 3, because / comes before +. The code runs and prints a number, just the wrong one. Brackets fix it: (a + b + c) / 3.",
        codeChallenge: {
          task: "This program should print the average of three test scores to 1 decimal place, but it gives the wrong answer. Fix it.",
          starter: 'a = int(input("Test 1: "))\nb = int(input("Test 2: "))\nc = int(input("Test 3: "))\naverage = a + b + c / 3\nprint(f"Average: {average:.1f}")\n',
          sample: "Test 1: 60\nTest 2: 75\nTest 3: 90\nAverage: 75.0",
          tests: [
            { inputs: ["60", "75", "90"], check: 'assert lines[-1] == "Average: 75.0", "60, 75 and 90 average 75.0. Yours: " + lines[-1]' },
            { inputs: ["45", "50", "62"], check: 'assert lines[-1] == "Average: 52.3", "45, 50 and 62 average 52.3. Yours: " + lines[-1]' },
          ],
          solution: 'a = int(input("Test 1: "))\nb = int(input("Test 2: "))\nc = int(input("Test 3: "))\naverage = (a + b + c) / 3\nprint(f"Average: {average:.1f}")\n',
          hint: "Which operation happens first in a + b + c / 3? Make the addition happen first.",
          successMessage: "One pair of brackets. This exact bug has put wrong grades on real report cards; now you know to look for it.",
        },
      },
      {
        id: "a-pp-string-ops",
        title: "String concatenation and repetition",
        explain:
          "On strings, + joins (concatenates) them and * repeats them: \"ab\" * 3 is \"ababab\". Both sides of + must be strings. len(text) tells you how many characters a string has, which is handy for drawing lines the same width as a word.",
        code: {
          language: PY,
          code: 'first = "Ada"\nlast = "Obi"\nfull = first + " " + last\nprint(full)\nprint("-" * len(full))\nprint("Ha" * 3)\n',
          expectedOutput: "Ada Obi\n-------\nHaHaHa",
        },
        codeChallenge: {
          task: "Make a banner. Ask the user for a word, then print it between two lines of = signs that are exactly as long as the word, with the word in UPPER CASE in the middle using word.upper().",
          starter: 'word = input("Word: ")\n',
          sample: "Word: Python\n======\nPYTHON\n======",
          tests: [
            {
              inputs: ["Python"],
              check: 'assert lines[1:] == ["======", "PYTHON", "======"], "For Python expect ======, PYTHON, ======. Yours: " + repr(lines[1:])',
            },
            {
              inputs: ["Memora Academy"],
              check:
                'assert lines[1:] == ["=" * 14, "MEMORA ACADEMY", "=" * 14], "The lines must match the length of the word typed (14 here). Yours: " + repr(lines[1:])\n' +
                'assert "len(" in source, "Use len(word) so the line fits any word."',
            },
          ],
          solution: 'word = input("Word: ")\nprint("=" * len(word))\nprint(word.upper())\nprint("=" * len(word))\n',
          hint: '"=" * len(word) makes a line exactly as long as the word.',
          successMessage: "A banner that fits any word. Repetition with * and len() together save you from counting characters by hand.",
        },
      },
      {
        id: "a-pp-discounts",
        title: "Practice: a discount calculator",
        explain:
          "A discount combines several operators: discount = price * percent / 100, then final = price - discount. Store each intermediate result in a well-named variable; it makes the code readable and each step checkable.",
        codeChallenge: {
          task: "Ask for an item's price and the discount percentage (both floats). Print the discount amount and the price to pay, each to 2 decimal places.",
          starter: "# discount = price * percent / 100\n",
          sample: "Price: 25000\nDiscount %: 15\nDiscount: 3750.00\nTo pay: 21250.00",
          tests: [
            {
              inputs: ["25000", "15"],
              check: 'body = "\\n".join(lines[2:])\nassert "3750.00" in body and "21250.00" in body, "25000 with 15% off: discount 3750.00, pay 21250.00. Yours: " + body',
            },
            {
              inputs: ["1999", "12.5"],
              check: 'body = "\\n".join(lines[2:])\nassert "249.88" in body and "1749.12" in body, "1999 with 12.5% off: discount 249.88, pay 1749.12. Yours: " + body',
            },
          ],
          solution: 'price = float(input("Price: "))\npercent = float(input("Discount %: "))\ndiscount = price * percent / 100\nprint(f"Discount: {discount:.2f}")\nprint(f"To pay: {price - discount:.2f}")\n',
          hint: "Two variables from input(), then discount = price * percent / 100.",
          successMessage: "Readable steps, correct answers, tested twice. That is how every calculation in a real billing system should be written.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 4.7 – 4.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l16-membership-truthy-precision",
    moduleId: "pp-m4-operators",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.7", "4.8", "4.9"],
    title: "Membership, Truthiness and Numeric Traps",
    subtitle: "in, is, truthy and falsy values, division by zero and precision",
    estimatedMinutes: 17,
    intro:
      "Four ideas finish the operators: asking whether something is inside something else, asking whether two names refer to the very same object, how Python treats any value as true or false, and the two numeric traps every programmer must know.",

    atoms: [
      {
        id: "a-pp-membership-identity",
        title: "Membership (in) and identity (is)",
        explain:
          "in asks \"is this contained in that?\": \"a\" in \"Lagos\" is True. not in is the opposite. is asks \"are these the very same object?\", which is different from == (\"do they have equal values?\"). In everyday code you use is for one thing only: checking for None, as in value is None.",
        code: {
          language: PY,
          code: 'email = "ada@memora.ng"\nprint("@" in email)\nprint(" " not in email)\nmiddle = None\nprint(middle is None)\n',
          expectedOutput: "True\nTrue\nTrue",
        },
        codeChallenge: {
          task: "A very simple email check. Ask for an email address and store in a variable looks_valid whether it contains an @ AND contains a dot AND does not contain a space. Print: Looks valid: True",
          starter: 'email = input("Email: ")\n',
          sample: "Email: ada@memora.ng\nLooks valid: True",
          tests: [
            { inputs: ["ada@memora.ng"], check: 'assert looks_valid is True, "ada@memora.ng should look valid."' },
            { inputs: ["ada.memora.ng"], check: 'assert looks_valid is False, "No @ means not valid."' },
            { inputs: ["ada@memora"], check: 'assert looks_valid is False, "No dot means not valid."' },
            {
              inputs: ["ada obi@memora.ng"],
              check: 'assert looks_valid is False, "A space means not valid."\nassert " in " in source, "Use the in operator."',
            },
          ],
          solution: 'email = input("Email: ")\nlooks_valid = "@" in email and "." in email and " " not in email\nprint("Looks valid:", looks_valid)\n',
          hint: '"@" in email and "." in email and " " not in email',
          successMessage: "A real (if basic) validation rule, tested against four cases. In Module 8 you will write a much better one with regular expressions.",
        },
      },
      {
        id: "a-pp-truthy-falsy",
        title: "Truthy and falsy values",
        explain:
          "Python can treat any value as True or False. A small set of values are falsy: False, None, 0, 0.0, the empty string \"\", and empty collections. Everything else is truthy. bool(value) shows which. This lets you write if name: to mean \"if a name was typed\".",
        codeExercise: {
          language: PY,
          code: 'print(bool(0))\nprint(bool(-5))\nprint(bool(""))\nprint(bool(" "))\nprint(bool(None))\n',
          question: "Which of these values are falsy? What does the program print?",
          expectedOutput: "False\nTrue\nFalse\nTrue\nFalse",
          hint: "Only zero, empty and None are falsy. -5 is not zero. A string containing a space is not empty.",
          successMessage: "Right, including the trap: \" \" holds one space, so it is not empty and is truthy. That is why user input is usually stripped of spaces before checking (Module 8).",
        },
      },
      {
        id: "a-pp-zero-precision",
        title: "Division by zero and floating-point precision",
        explain:
          "Dividing by zero raises ZeroDivisionError, and so does // or % by zero; check the divisor before dividing. Separately, floats are stored in binary, and most decimals cannot be stored exactly, so 0.1 + 0.2 is 0.30000000000000004. Round results for display with round(x, 2) or :.2f, and never compare floats with == directly.",
        code: {
          language: PY,
          code: "print(0.1 + 0.2)\nprint(round(0.1 + 0.2, 2))\nprint(0.1 + 0.2 == 0.3)\nprint(10 / 0)\n",
          expectedOutput: "0.30000000000000004\n0.3\nFalse",
          raises: "ZeroDivisionError: division by zero",
        },
        why: "This is not a Python bug; every language that uses standard floats behaves the same way. For money, store whole kobo as ints, or round at every display.",
        codeChallenge: {
          task: "Even/odd and average. Ask for a whole number n and print two lines: first n is even: True (or False), using %; then the average of n and 0.1, rounded to 2 decimal places with round().",
          starter: 'n = int(input("Whole number: "))\n',
          sample: "Whole number: 14\n14 is even: True\nAverage: 7.05",
          tests: [
            {
              inputs: ["14"],
              check: 'assert lines[1] == "14 is even: True", "Line 1 for 14 should be: 14 is even: True. Yours: " + lines[1]\nassert lines[2].endswith("7.05"), "The average of 14 and 0.1 is 7.05. Yours: " + lines[2]',
            },
            {
              inputs: ["7"],
              check:
                'assert lines[1] == "7 is even: False", "For 7: 7 is even: False. Yours: " + lines[1]\n' +
                'assert lines[2].endswith("3.55"), "The average of 7 and 0.1 is 3.55. Yours: " + lines[2]\n' +
                'assert "%" in source and calls("round"), "Use % for the even test and round() for the average."',
            },
          ],
          solution: 'n = int(input("Whole number: "))\nprint(n, "is even:", n % 2 == 0)\nprint("Average:", round((n + 0.1) / 2, 2))\n',
          hint: "n % 2 == 0 is True for even numbers. round((n + 0.1) / 2, 2) for the average.",
          successMessage: "An even test and a rounded float. Both patterns come back in nearly every module of this course.",
        },
      },
    ],

    task: {
      title: "Module 4 practice: formulas into Python",
      intro:
        "Write each as its own file and test each with at least two sets of numbers you have checked by hand. The milestone is to translate mathematical formulas into correct Python expressions.",
      prompts: [
        "Profit and loss: cost and selling price in; profit or loss and the percentage out.",
        "Averages: five scores in; the total and the average to 1 decimal place out.",
        "Discounts: price and percentage in; discount, VAT at 7.5% on the discounted price, and the final price out.",
        "Simple interest: principal, rate and time in; interest and total out.",
        "Even/odd detection: a number in; whether it is even and whether it is divisible by 5 out, as True/False.",
        "Time conversion: seconds in; days, hours, minutes and seconds out.",
      ],
      closing:
        "Next: the Phase 1 assessment. You will plan and build a complete program without copying a solution.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
