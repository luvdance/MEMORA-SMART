/**
 * PYTHON PROGRAMMING · MODULE 5 · CONDITIONAL STATEMENTS AND DECISION-MAKING
 *
 * Curriculum 5.1 – 5.9. if, elif and else; nested and combined conditions;
 * validation; boundaries; match-case; flowcharts into code. Almost every
 * challenge here is tested on BOTH sides of its boundaries, because that is
 * where decision bugs live.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s5-conditions";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 5.1 – 5.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l19-if-elif-else",
    moduleId: "pp-m5-conditions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2"],
    title: "Making Decisions: if, elif and else",
    subtitle: "Boolean conditions and choosing what runs",
    estimatedMinutes: 18,
    intro:
      "Until now every line of your programs ran every time. A decision lets a program choose: run these lines if something is true, those lines otherwise. It is the diamond in your flowcharts, and it is where indentation becomes part of what your code means.",

    atoms: [
      {
        id: "a-pp-if",
        title: "if: run a block only when a condition is True",
        explain:
          "An if statement has a condition (any expression that is True or False), a colon, and an indented block. If the condition is True, the block runs; if it is False, the block is skipped. Lines after the block, back at the left margin, run either way. The four-space indentation is how Python knows which lines belong to the if.",
        code: {
          language: PY,
          code: 'score = 72\nif score >= 50:\n    print("Pass")\n    print("Well done!")\nprint("Result recorded")\n',
          expectedOutput: "Pass\nWell done!\nResult recorded",
        },
        why: "Change score to 30 and only \"Result recorded\" prints: both indented lines are skipped together. The last line is not indented, so it is outside the if.",
        codeChallenge: {
          task: "Ask for the temperature in °C as a number. If it is 30 or above, print It is hot today. Drink water. Whatever the temperature, finish by printing Have a good day.",
          starter: 'temp = float(input("Temperature: "))\n',
          sample: "Temperature: 33\nIt is hot today. Drink water.\nHave a good day.",
          tests: [
            { inputs: ["33"], check: 'assert lines[1:] == ["It is hot today. Drink water.", "Have a good day."], "At 33 both lines should print. Yours: " + repr(lines[1:])' },
            { inputs: ["30"], check: 'assert "It is hot today. Drink water." in lines, "30 counts as hot: use >= 30."' },
            {
              inputs: ["24"],
              check: 'assert lines[1:] == ["Have a good day."], "At 24 only Have a good day. should print. Yours: " + repr(lines[1:])\nassert uses("If"), "Use an if statement."',
            },
          ],
          solution: 'temp = float(input("Temperature: "))\nif temp >= 30:\n    print("It is hot today. Drink water.")\nprint("Have a good day.")\n',
          hint: "if temp >= 30: then the warning indented by four spaces. The final print goes back to the left edge.",
          successMessage: "Your program now behaves differently depending on its input, tested above, on and below the boundary.",
        },
      },
      {
        id: "a-pp-if-else",
        title: "else: the other path",
        explain:
          "else gives a block that runs when the if condition is False. Exactly one of the two blocks runs, never both, never neither. This is the full diamond: a YES arrow and a NO arrow.",
        code: {
          language: PY,
          code: 'n = 7\nif n % 2 == 0:\n    print(n, "is even")\nelse:\n    print(n, "is odd")\n',
          expectedOutput: "7 is odd",
        },
        codeChallenge: {
          task: "Ask for a whole number. Print EVEN if it is even, otherwise print ODD.",
          starter: 'n = int(input("Number: "))\n',
          sample: "Number: 12\nEVEN",
          tests: [
            { inputs: ["12"], check: 'assert lines[-1] == "EVEN", "12 is even. Yours: " + lines[-1]' },
            { inputs: ["7"], check: 'assert lines[-1] == "ODD", "7 is odd. Yours: " + lines[-1]' },
            { inputs: ["0"], check: 'assert lines[-1] == "EVEN", "0 is even (0 % 2 is 0). Yours: " + lines[-1]\nassert "else" in source, "Use else for the odd case."' },
          ],
          solution: 'n = int(input("Number: "))\nif n % 2 == 0:\n    print("EVEN")\nelse:\n    print("ODD")\n',
          hint: "if n % 2 == 0: print EVEN, else: print ODD. Both prints indented.",
          successMessage: "Two paths, exactly one runs. You used % from Module 4 inside a decision, which is how the pieces start combining.",
        },
      },
      {
        id: "a-pp-elif",
        title: "elif: choosing between many options",
        explain:
          "elif (else if) adds more conditions. Python checks them top to bottom and runs the block of the FIRST condition that is True, then skips the rest. A final else catches everything that matched nothing. Order matters: put the strictest condition first.",
        code: {
          language: PY,
          code: 'score = 64\nif score >= 70:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelif score >= 50:\n    grade = "C"\nelse:\n    grade = "F"\nprint("Grade:", grade)\n',
          expectedOutput: "Grade: B",
        },
        why: "64 fails the first test, passes the second, and Python stops there, even though 64 >= 50 is also true. If you put score >= 50 first, every passing student would get a C.",
        codeChallenge: {
          task: "Examination grading. Ask for a score (whole number) and print its grade: 70 and above A, 60–69 B, 50–59 C, 45–49 D, 40–44 E, below 40 F. Print it as: Grade: B",
          starter: 'score = int(input("Score: "))\n',
          sample: "Score: 64\nGrade: B",
          tests: [
            { inputs: ["85"], check: 'assert lines[-1] == "Grade: A", "85 is an A. Yours: " + lines[-1]' },
            { inputs: ["70"], check: 'assert lines[-1] == "Grade: A", "70 is an A (70 and above). Yours: " + lines[-1]' },
            { inputs: ["69"], check: 'assert lines[-1] == "Grade: B", "69 is a B. Yours: " + lines[-1]' },
            { inputs: ["50"], check: 'assert lines[-1] == "Grade: C", "50 is a C. Yours: " + lines[-1]' },
            { inputs: ["47"], check: 'assert lines[-1] == "Grade: D", "47 is a D. Yours: " + lines[-1]' },
            { inputs: ["40"], check: 'assert lines[-1] == "Grade: E", "40 is an E. Yours: " + lines[-1]' },
            { inputs: ["39"], check: 'assert lines[-1] == "Grade: F", "39 is an F. Yours: " + lines[-1]\nassert "elif" in source, "Use elif for the middle grades."' },
          ],
          solution: 'score = int(input("Score: "))\nif score >= 70:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelif score >= 50:\n    grade = "C"\nelif score >= 45:\n    grade = "D"\nelif score >= 40:\n    grade = "E"\nelse:\n    grade = "F"\nprint("Grade:", grade)\n',
          hint: "Start with the highest grade: if score >= 70, then elif score >= 60, and so on down to else for F.",
          successMessage: "Seven tests, every boundary covered. A grading program that is right at 69, 70, 49 and 50 is one you can trust with real results.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 5.3 – 5.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l20-nested-combined",
    moduleId: "pp-m5-conditions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.3", "5.4", "5.5"],
    title: "Nested and Combined Conditions",
    subtitle: "Decisions inside decisions, and, or, and conditions on text",
    estimatedMinutes: 20,
    intro:
      "Real rules are rarely one comparison. A ticket price depends on age AND whether you are a student; a year is a leap year under a rule with three parts. This lesson gives you two ways to express that: put one decision inside another, or combine conditions with and, or and not.",

    atoms: [
      {
        id: "a-pp-nested",
        title: "Nested conditions",
        explain:
          "A nested condition is an if inside another if's block. The inner question is only asked when the outer one was True. Each level adds four more spaces of indentation. Nesting suits rules where the second question only makes sense after the first.",
        code: {
          language: PY,
          code: 'age = 20\nstudent = "yes"\nif age >= 18:\n    if student == "yes":\n        print("Adult student ticket: 1500")\n    else:\n        print("Adult ticket: 2500")\nelse:\n    print("Child ticket: 1000")\n',
          expectedOutput: "Adult student ticket: 1500",
        },
        codeChallenge: {
          task: "Age eligibility for a driving school. Ask for the age. If under 18, print Too young to enrol. Otherwise ask Do you have a learner's permit? (yes/no): if yes print Book your first lesson, if no print Apply for a permit first. The permit question must only be asked to people who are 18 or older.",
          starter: 'age = int(input("Age: "))\n',
          sample: "Age: 19\nDo you have a learner's permit? (yes/no): yes\nBook your first lesson",
          tests: [
            { inputs: ["19", "yes"], check: 'assert lines[-1] == "Book your first lesson", "19 with a permit. Yours: " + lines[-1]' },
            { inputs: ["18", "no"], check: 'assert lines[-1] == "Apply for a permit first", "18 without a permit. Yours: " + lines[-1]' },
            {
              inputs: ["15"],
              check: 'assert lines[-1] == "Too young to enrol", "15 is too young. Yours: " + lines[-1]\nassert len(lines) == 2, "Someone under 18 must not be asked about a permit."',
            },
          ],
          solution: 'age = int(input("Age: "))\nif age < 18:\n    print("Too young to enrol")\nelse:\n    permit = input("Do you have a learner\'s permit? (yes/no): ")\n    if permit == "yes":\n        print("Book your first lesson")\n    else:\n        print("Apply for a permit first")\n',
          hint: "The second input() belongs INSIDE the else block of the age check, indented, with its own if/else indented again.",
          successMessage: "The third test proves the permit question is only asked when it makes sense, which only nesting can do.",
        },
      },
      {
        id: "a-pp-combined",
        title: "Combining conditions with and, or, not",
        explain:
          "When several facts decide one outcome, combine them in one condition. The leap-year rule is the classic: a year is a leap year if it is divisible by 4 and not by 100, or if it is divisible by 400. Use brackets to make the grouping obvious.",
        example:
          "2024: divisible by 4, not by 100      → leap year\n1900: divisible by 4 and by 100, not 400 → NOT a leap year\n2000: divisible by 400                 → leap year\n2026: not divisible by 4               → NOT a leap year",
        codeChallenge: {
          task: "Leap-year checker. Ask for a year and print 2024 is a leap year or 2026 is not a leap year, using ONE if with a combined condition.",
          starter: 'year = int(input("Year: "))\n',
          sample: "Year: 2024\n2024 is a leap year",
          tests: [
            { inputs: ["2024"], check: 'assert lines[-1] == "2024 is a leap year", "2024 is a leap year. Yours: " + lines[-1]' },
            { inputs: ["2026"], check: 'assert lines[-1] == "2026 is not a leap year", "2026 is not. Yours: " + lines[-1]' },
            { inputs: ["1900"], check: 'assert lines[-1] == "1900 is not a leap year", "1900 is divisible by 100 but not 400, so not a leap year. Yours: " + lines[-1]' },
            { inputs: ["2000"], check: 'assert lines[-1] == "2000 is a leap year", "2000 is divisible by 400, so it is a leap year. Yours: " + lines[-1]\nassert " or " in source and " and " in source, "Combine the rule with and and or."' },
          ],
          solution: 'year = int(input("Year: "))\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print(year, "is a leap year")\nelse:\n    print(year, "is not a leap year")\n',
          hint: "(year % 4 == 0 and year % 100 != 0) or year % 400 == 0",
          successMessage: "1900 and 2000 are the tests most leap-year programs fail. Yours passes both.",
        },
      },
      {
        id: "a-pp-string-conditions",
        title: "Conditions on numbers and strings",
        explain:
          "Strings compare exactly, so \"Admin\" == \"admin\" is False. To ignore capitals, compare lower-case versions: name.lower() == \"admin\". To ignore stray spaces, use .strip(). Numbers compare by size; strings compare alphabetically, which is rarely what you want for numbers stored as text, so convert first.",
        code: {
          language: PY,
          code: 'typed = "  ADMIN "\nprint(typed == "admin")\nprint(typed.strip().lower() == "admin")\nprint("10" < "9")\nprint(10 < 9)\n',
          expectedOutput: "False\nTrue\nTrue\nFalse",
        },
        why: "\"10\" < \"9\" is True because text is compared character by character, and \"1\" comes before \"9\". Convert numbers before comparing them.",
        codeChallenge: {
          task: "Login validation. The correct username is admin (capitals and surrounding spaces should not matter) and the password is Py#2026 (exact). Ask for both. Print Welcome, admin if both are right, Wrong password if only the username is right, and Unknown user otherwise.",
          starter: 'username = input("Username: ")\npassword = input("Password: ")\n',
          sample: "Username:  Admin\nPassword: Py#2026\nWelcome, admin",
          tests: [
            { inputs: [" Admin", "Py#2026"], check: 'assert lines[-1] == "Welcome, admin", "Admin with spaces and a capital should still log in. Yours: " + lines[-1]' },
            { inputs: ["admin", "py#2026"], check: 'assert lines[-1] == "Wrong password", "The password is case-sensitive: py#2026 is wrong. Yours: " + lines[-1]' },
            { inputs: ["ada", "Py#2026"], check: 'assert lines[-1] == "Unknown user", "ada is not a known user. Yours: " + lines[-1]' },
          ],
          solution: 'username = input("Username: ")\npassword = input("Password: ")\nif username.strip().lower() == "admin":\n    if password == "Py#2026":\n        print("Welcome, admin")\n    else:\n        print("Wrong password")\nelse:\n    print("Unknown user")\n',
          hint: 'Clean the username with .strip().lower() before comparing. Compare the password exactly.',
          successMessage: "Forgiving where it should be (usernames), strict where it must be (passwords). Real systems never store passwords in code; Module 15 explains how they keep secrets.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 5.6 – 5.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l21-validation-boundaries",
    moduleId: "pp-m5-conditions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.6", "5.7"],
    title: "Validation and Boundaries",
    subtitle: "Rejecting bad input, and getting the edges right",
    estimatedMinutes: 18,
    intro:
      "Users type unexpected things, and rules have edges. A good program checks input before trusting it, and is correct exactly at the boundary between one rule and the next. Both are about conditions, and both are where most real bugs are found.",

    atoms: [
      {
        id: "a-pp-validation",
        title: "Validating user input",
        explain:
          "Validation means checking that input is acceptable before using it: a score between 0 and 100, a quantity above zero, an option from a list. Check first, and only do the work in the branch where the input is valid. A chained comparison such as 0 <= score <= 100 reads exactly like the maths.",
        code: {
          language: PY,
          code: 'quantity = -3\nif quantity <= 0:\n    print("Quantity must be at least 1")\nelse:\n    print("Total:", quantity * 500)\n',
          expectedOutput: "Quantity must be at least 1",
        },
        codeChallenge: {
          task: "Ask for an examination score. If it is outside 0 to 100, print Invalid score. Otherwise print Pass for 50 and above or Fail below 50.",
          starter: 'score = int(input("Score: "))\n',
          sample: "Score: 105\nInvalid score",
          tests: [
            { inputs: ["105"], check: 'assert lines[-1] == "Invalid score", "105 is above 100. Yours: " + lines[-1]' },
            { inputs: ["-1"], check: 'assert lines[-1] == "Invalid score", "-1 is below 0. Yours: " + lines[-1]' },
            { inputs: ["100"], check: 'assert lines[-1] == "Pass", "100 is valid and a pass. Yours: " + lines[-1]' },
            { inputs: ["0"], check: 'assert lines[-1] == "Fail", "0 is valid and a fail. Yours: " + lines[-1]' },
            { inputs: ["50"], check: 'assert lines[-1] == "Pass", "50 is a pass. Yours: " + lines[-1]' },
          ],
          solution: 'score = int(input("Score: "))\nif not 0 <= score <= 100:\n    print("Invalid score")\nelif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")\n',
          hint: "Check validity first: if score < 0 or score > 100. Then elif for pass, else for fail.",
          successMessage: "Bad input rejected, both ends of the valid range accepted. In Module 12 you will also handle someone typing a word instead of a number.",
        },
      },
      {
        id: "a-pp-boundaries",
        title: "Boundary conditions and off-by-one mistakes",
        explain:
          "An off-by-one mistake is using > where >= was meant (or the reverse), so a value exactly on the boundary goes the wrong way. The defence is to test the boundary value itself and the values either side of it: for a pass mark of 50, test 49, 50 and 51. Write the rule down in words first: \"50 or more\" means >= 50.",
        codeExercise: {
          language: PY,
          code: 'for units in [100, 101]:\n    if units > 100:\n        print(units, "higher rate")\n    else:\n        print(units, "basic rate")\n',
          question: "The tariff says \"the first 100 units are at the basic rate\". This code checks two values (the for line just runs the block once for each; Module 6 explains it). What does it print?",
          expectedOutput: "100 basic rate\n101 higher rate",
          hint: "Is 100 > 100? Is 101 > 100?",
          successMessage: "Correct, and it matches the tariff: unit 100 is still basic, unit 101 is the first at the higher rate.",
        },
      },
      {
        id: "a-pp-electricity-billing",
        title: "Practice: electricity billing with tiers",
        explain:
          "A tiered tariff charges different rates for different bands of usage. Each band is a boundary, so this is the perfect test of boundary thinking: work out the bill by hand for a usage in each band and exactly on each edge before you trust the code.",
        example:
          "Tariff:  first 100 units at 50 per unit\n         units 101 to 300 at 75 per unit\n         every unit above 300 at 100 per unit\n\n  80 units →  80 × 50                          =  4000\n 250 units → 100 × 50 + 150 × 75               = 16250\n 400 units → 100 × 50 + 200 × 75 + 100 × 100   = 30000",
        codeChallenge: {
          task: "Using the tariff above, ask for the units used and print the bill as Bill: 16250",
          starter: 'units = int(input("Units used: "))\n',
          sample: "Units used: 250\nBill: 16250",
          tests: [
            { inputs: ["80"], check: 'assert lines[-1] == "Bill: 4000", "80 units cost 4000. Yours: " + lines[-1]' },
            { inputs: ["100"], check: 'assert lines[-1] == "Bill: 5000", "Exactly 100 units cost 5000. Yours: " + lines[-1]' },
            { inputs: ["101"], check: 'assert lines[-1] == "Bill: 5075", "101 units: 5000 + 75 = 5075. Yours: " + lines[-1]' },
            { inputs: ["300"], check: 'assert lines[-1] == "Bill: 20000", "300 units: 5000 + 200 × 75 = 20000. Yours: " + lines[-1]' },
            { inputs: ["400"], check: 'assert lines[-1] == "Bill: 30000", "400 units cost 30000. Yours: " + lines[-1]' },
          ],
          solution: 'units = int(input("Units used: "))\nif units <= 100:\n    bill = units * 50\nelif units <= 300:\n    bill = 100 * 50 + (units - 100) * 75\nelse:\n    bill = 100 * 50 + 200 * 75 + (units - 300) * 100\nprint("Bill:", bill)\n',
          hint: "Three branches. In the middle band, the first 100 units cost 5000 and only (units - 100) are charged at 75.",
          successMessage: "Correct in every band and exactly on both edges. This is what \"tested\" means for a decision.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 5.8 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l22-match-flowcharts",
    moduleId: "pp-m5-conditions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.8", "5.9"],
    title: "match-case, and Flowcharts into Code",
    subtitle: "Choosing by value, and translating a design shape by shape",
    estimatedMinutes: 18,
    intro:
      "Two finishing skills. match-case is a tidy way to choose between many exact values, such as menu options. And because you can now write decisions, every flowchart from Module 1 can be translated directly into Python.",

    atoms: [
      {
        id: "a-pp-match-case",
        title: "match-case: choosing by exact value",
        explain:
          "match (added in Python 3.10) compares one value against several patterns. Each case lists a value; the first that matches runs. case _ is the wildcard that matches anything, like else. Use | to let one case match several values. match suits menus and commands; if/elif remains better for ranges such as score >= 50.",
        code: {
          language: PY,
          code: 'choice = "2"\nmatch choice:\n    case "1":\n        print("Check balance")\n    case "2":\n        print("Withdraw cash")\n    case "3" | "4":\n        print("Transfer")\n    case _:\n        print("Invalid option")\n',
          expectedOutput: "Withdraw cash",
        },
        codeChallenge: {
          task: "A school portal menu. Ask the user to choose an option. Use match: 1 prints View results, 2 prints Pay fees, 3 prints Timetable, q or Q prints Goodbye, and anything else prints Unknown option.",
          starter: 'option = input("Option: ")\n',
          sample: "Option: 2\nPay fees",
          tests: [
            { inputs: ["1"], check: 'assert lines[-1] == "View results", "1 is View results. Yours: " + lines[-1]' },
            { inputs: ["3"], check: 'assert lines[-1] == "Timetable", "3 is Timetable. Yours: " + lines[-1]' },
            { inputs: ["Q"], check: 'assert lines[-1] == "Goodbye", "Q (and q) quits. Yours: " + lines[-1]' },
            { inputs: ["q"], check: 'assert lines[-1] == "Goodbye", "q quits too. Yours: " + lines[-1]' },
            { inputs: ["9"], check: 'assert lines[-1] == "Unknown option", "9 is not an option. Yours: " + lines[-1]\nassert uses("Match"), "Use a match statement."' },
          ],
          solution: 'option = input("Option: ")\nmatch option:\n    case "1":\n        print("View results")\n    case "2":\n        print("Pay fees")\n    case "3":\n        print("Timetable")\n    case "q" | "Q":\n        print("Goodbye")\n    case _:\n        print("Unknown option")\n',
          hint: 'case "q" | "Q": matches either. Finish with case _: for everything else. The option is text, so compare with "1", not 1.',
          successMessage: "A menu in match-case. In Module 6 you will wrap it in a loop so the menu keeps coming back until the user chooses q.",
        },
      },
      {
        id: "a-pp-flowchart-to-code",
        title: "Converting a flowchart into conditional code",
        explain:
          "Each flowchart shape has a Python equivalent: a parallelogram is input() or print(), a rectangle is an assignment, a diamond is an if (its YES arrow is the indented block, its NO arrow is else or the next elif). Follow the arrows from START and write one line per shape.",
        example:
          "      ( START )\n          |\n     /INPUT total/\n          |\n   < total >= 50000 ? >--YES--> [rate = 10]\n          | NO                       |\n   < total >= 20000 ? >--YES--> [rate = 5]\n          | NO                       |\n     [rate = 0]                      |\n          |<-------------------------+\n   < member == yes ? >--YES--> [rate = rate + 2]\n          | NO                       |\n          |<-------------------------+\n   [discount = total × rate / 100]\n          |\n   /OUTPUT discount, total - discount/\n          |\n       ( STOP )",
        codeChallenge: {
          task: "Translate the flowchart above into Python. Ask for the total (float) then whether they are a member (yes/no). Print Discount: followed by the discount, then To pay: followed by the amount to pay, both to 2 decimal places.",
          starter: "# Follow the flowchart from START\n",
          sample: "Total: 60000\nMember (yes/no): yes\nDiscount: 7200.00\nTo pay: 52800.00",
          tests: [
            { inputs: ["60000", "yes"], check: 'assert lines[-2:] == ["Discount: 7200.00", "To pay: 52800.00"], "60000 member: 12% off. Yours: " + repr(lines[-2:])' },
            { inputs: ["50000", "no"], check: 'assert lines[-2:] == ["Discount: 5000.00", "To pay: 45000.00"], "Exactly 50000 gets 10%. Yours: " + repr(lines[-2:])' },
            { inputs: ["20000", "yes"], check: 'assert lines[-2:] == ["Discount: 1400.00", "To pay: 18600.00"], "20000 member: 5% + 2% = 7%. Yours: " + repr(lines[-2:])' },
            { inputs: ["19999", "no"], check: 'assert lines[-2:] == ["Discount: 0.00", "To pay: 19999.00"], "Below 20000 and not a member: no discount. Yours: " + repr(lines[-2:])' },
          ],
          solution: 'total = float(input("Total: "))\nmember = input("Member (yes/no): ")\nif total >= 50000:\n    rate = 10\nelif total >= 20000:\n    rate = 5\nelse:\n    rate = 0\nif member == "yes":\n    rate = rate + 2\ndiscount = total * rate / 100\nprint(f"Discount: {discount:.2f}")\nprint(f"To pay: {total - discount:.2f}")\n',
          hint: "Two separate decisions: first an if/elif/else to set rate, then a second if for members that adds 2.",
          successMessage: "Shape by shape, the design became working code, and it is right on every boundary. Designing on paper first, then translating, is how larger programs stay manageable.",
        },
      },
    ],

    task: {
      title: "Module 5 practice: six decision programs",
      intro:
        "Write each as a separate file and test every boundary by hand first. The milestone is to build programs that make correct decisions across different scenarios.",
      prompts: [
        "Examination grading: score in, grade out (A to F), rejecting scores outside 0–100.",
        "Age eligibility: age in; whether the person can vote (18+), drive (18+ with a permit) and get a senior discount (65+).",
        "Leap-year checker: test it with 1900, 2000, 2024 and 2026.",
        "Login validation: three users with different passwords, using if/elif; usernames case-insensitive.",
        "Electricity billing: your own three-band tariff; work out five test cases by hand, including both band edges.",
        "Discount calculation: draw the flowchart first, then translate it shape by shape.",
      ],
      closing: "Next: loops, so a program can repeat work without repeating code.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
