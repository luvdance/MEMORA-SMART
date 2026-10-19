/**
 * PYTHON PROGRAMMING · MODULE 2 · PYTHON SYNTAX AND BASIC INPUT/OUTPUT
 *
 * Curriculum 2.1 – 2.8. The grammar of Python, print() in depth, input(), and
 * the first error messages. Snippets that call input() carry scripted
 * `inputs`; the validator runs them through the practice harness, which
 * echoes each answer after its prompt exactly as a terminal shows it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s2-syntax-io";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 – 2.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l5-syntax-statements",
    moduleId: "pp-m2-syntax-io",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2"],
    title: "Python's Grammar",
    subtitle: "Syntax, indentation, statements, expressions and comments",
    estimatedMinutes: 15,
    intro:
      "Every language has grammar. Python's is small and strict: a few rules about spelling, brackets and spacing, and Python refuses to run a file that breaks them. Learn them now and most beginner errors never happen.",

    atoms: [
      {
        id: "a-pp-syntax-rules",
        title: "Syntax: the rules Python insists on",
        explain:
          "Syntax is the set of rules for how code must be written. Python is case-sensitive (print works, Print does not), text must sit inside matching quotes, and every bracket that opens must close. Break a rule and Python refuses to run any of the file, and tells you where it got confused.",
        table: {
          caption: "Four rules, and what breaking them looks like.",
          headers: ["Rule", "Wrong", "Right"],
          rows: [
            ["Case-sensitive", "Print(\"Hi\")", "print(\"Hi\")"],
            ["Matching quotes", "print(\"Hi')", "print(\"Hi\") or print('Hi')"],
            ["Close every bracket", "print(\"Hi\"", "print(\"Hi\")"],
            ["One statement per line", "print(\"a\") print(\"b\")", "print(\"a\")\nprint(\"b\")"],
          ],
        },
        code: {
          language: PY,
          code: 'print("Good")\nPrint("morning")\n',
          expectedOutput: "Good",
          raises: "NameError: name 'Print' is not defined. Did you mean: 'print'?",
        },
        why: "Print with a capital P is a different name, and nothing called Print exists. Python even suggests the fix. Single or double quotes both work for text; they just have to match.",
      },
      {
        id: "a-pp-indentation",
        title: "Indentation is part of Python's grammar",
        explain:
          "Indentation is the space at the start of a line. In most languages it is only for readability; in Python it is grammar. Lines at the same level of a program must start at the same column. You will indent on purpose when you meet if and loops in Module 5. Until then, every line starts at the left edge, and an accidental space causes an IndentationError.",
        code: {
          language: PY,
          code: 'print("Line one")\n  print("Line two")\n',
          raises: "IndentationError: unexpected indent",
        },
        why: "Notice that nothing printed, not even line one. An IndentationError is a syntax problem, found when Python checks the whole file before running it. Python uses four spaces per level by convention, and VS Code inserts them when you press Tab.",
        codeChallenge: {
          task: "This program was typed carelessly and will not run. Fix it so that it runs and prints all three lines. Do not change the text, only the layout and spelling of the instructions.",
          starter: 'print("Welcome to Memora Academy")\n   print("Module 2: Syntax")\nPrint("Let us begin")\n',
          sample: "Welcome to Memora Academy\nModule 2: Syntax\nLet us begin",
          tests: [
            {
              check:
                'assert lines == ["Welcome to Memora Academy", "Module 2: Syntax", "Let us begin"], "Your program should print exactly the three lines, in order. It printed: " + repr(lines)',
            },
          ],
          solution: 'print("Welcome to Memora Academy")\nprint("Module 2: Syntax")\nprint("Let us begin")\n',
          hint: "Two problems: one line starts with spaces, and one instruction has a capital letter it should not have.",
          successMessage: "Fixed. You read the error, found the line and corrected it: that is debugging, and you just did it twice.",
        },
      },
      {
        id: "a-pp-statements-expressions",
        title: "Statements and expressions",
        explain:
          "A statement is one complete instruction: print(\"Hi\") is a statement. An expression is any piece of code that produces a value: 7, \"Ada\", 3 * 4 and 10 > 3 are expressions. Statements are built from expressions. In print(3 * 4), the expression 3 * 4 is worked out first, then the statement prints its value.",
        table: {
          caption: "Expressions and the values they produce.",
          headers: ["Expression", "Value"],
          rows: [
            ["7", "7"],
            ["3 * 4", "12"],
            ["\"Ada\"", "Ada"],
            ["10 > 3", "True"],
            ["(2 + 3) * 4", "20"],
          ],
        },
        codeExercise: {
          language: PY,
          code: "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(10 > 3)\n",
          question: "Multiplication happens before addition, as in maths, unless brackets say otherwise. What does this print?",
          expectedOutput: "14\n20\nTrue",
          hint: "Line 1: 3 * 4 first, then add 2. Line 2: brackets first. Line 3 is a comparison: is 10 greater than 3?",
          successMessage: "14, 20, True. Same numbers, different expressions, different values. The third one is a comparison, and its value is True; you will build decisions out of exactly that in Module 5.",
        },
      },
      {
        id: "a-pp-comments",
        title: "Comments: notes for people",
        explain:
          "A comment starts with # and runs to the end of the line. Python ignores it completely; it is there for the people reading the code, including you next month. A comment can sit on its own line or after code on the same line.",
        code: {
          language: PY,
          code: '# Receipt for one customer at the school canteen\nprint("Jollof rice: 800")  # price in naira\n# print("Meat pie: 500")    this line is switched off\nprint("Zobo: 300")\n',
          expectedOutput: "Jollof rice: 800\nZobo: 300",
        },
        why: "Good comments explain WHY, not what: the code already says what. A # in front of a line is also the quickest way to switch it off while you test something, which you will do often when debugging.",
        codeChallenge: {
          task: "Write a short program for a shop sign. Start with a comment line saying what the program is for. Then print the shop's name on one line and its opening hours on the next. Add a third print() for a phone number, but switch it off with # so it does not run.",
          starter: "",
          sample: "Mama Nkechi Provisions\nOpen 8am to 9pm",
          tests: [
            {
              check:
                'code_lines = [l.strip() for l in source.splitlines() if l.strip()]\n' +
                'assert code_lines and code_lines[0].startswith("#"), "Start your program with a comment line that begins with #."\n' +
                'assert len(lines) == 2, "Exactly two lines should print: the name and the hours. Yours printed " + str(len(lines)) + "."\n' +
                'assert any(l.startswith("#") and "print" in l for l in code_lines), "Add a third print() for a phone number and put # in front of it to switch it off."',
            },
          ],
          solution: '# Sign for the shop at the front gate\nprint("Mama Nkechi Provisions")\nprint("Open 8am to 9pm")\n# print("Call 0803 000 0000")\n',
          hint: "A line that starts with # is ignored. Put # in front of the whole print(...) line for the phone number.",
          successMessage: "Two lines printed and one ignored. Remove the # from the phone line and run it again: the third line comes back.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.3 – 2.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l6-print-output",
    moduleId: "pp-m2-syntax-io",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.3", "2.4"],
    title: "print() in Depth",
    subtitle: "Several values, separators, escape characters and formatted output",
    estimatedMinutes: 16,
    intro:
      "print() is the instruction you will use most, so it is worth knowing properly. It can show several things at once, choose what goes between them, control how the line ends, and lay out neat, formatted output like a receipt.",

    atoms: [
      {
        id: "a-pp-print-values",
        title: "Printing several values, sep and end",
        explain:
          "Give print() several values separated by commas and it prints them on one line with a space between each. Two optional settings change that: sep= chooses what goes between the values, and end= chooses what goes at the end of the line instead of a new line.",
        code: {
          language: PY,
          code: 'print("Score:", 72, "out of", 100)\nprint(17, 10, 2026, sep="/")\nprint("Loading", end="...")\nprint("done")\n',
          expectedOutput: "Score: 72 out of 100\n17/10/2026\nLoading...done",
        },
        why: "Line 3 ends with ... instead of a new line, so line 4 continues on the same line. Notice that numbers and text can be mixed freely when separated by commas.",
        codeChallenge: {
          task: "Print today's time as hours, minutes and seconds joined by colons, using ONE print() with three separate numbers and sep=. Use 9, 45 and 30, so the output is 9:45:30.",
          starter: "# One print(), three numbers, and sep=\n",
          sample: "9:45:30",
          tests: [
            {
              check:
                'assert lines == ["9:45:30"], "The output should be exactly 9:45:30. Yours: " + repr(lines)\n' +
                'assert "sep" in source, "Use sep= to put the colons between the numbers."\n' +
                'assert "9:45" not in source, "Pass 9, 45 and 30 as three separate values and let sep= add the colons."',
            },
          ],
          solution: 'print(9, 45, 30, sep=":")\n',
          hint: 'print(9, 45, 30, sep="?"): what should the question mark be?',
          successMessage: "One instruction, three values, joined your way. sep= and end= turn up constantly when you format output.",
        },
      },
      {
        id: "a-pp-escape-characters",
        title: "Escape characters: \\n, \\t, \\\" and \\\\",
        explain:
          "Some characters cannot be typed directly inside a string. A backslash starts an escape sequence: \\n means a new line, \\t a tab, \\\" a double quote inside double-quoted text, and \\\\ a real backslash. They let one print() produce several lines or neat columns.",
        table: {
          caption: "The escape sequences you will use.",
          headers: ["Write", "You get"],
          rows: [
            ["\\n", "A new line"],
            ["\\t", "A tab (jumps to the next column)"],
            ["\\\"", "A double quote inside \"...\" text"],
            ["\\'", "A single quote inside '...' text"],
            ["\\\\", "One backslash"],
          ],
        },
        code: {
          language: PY,
          code: 'print("Line one\\nLine two")\nprint("Item\\tPrice")\nprint("She said \\"Welcome\\"")\nprint("C:\\\\Users\\\\Ada")\n',
          expectedOutput: 'Line one\nLine two\nItem\tPrice\nShe said "Welcome"\nC:\\Users\\Ada',
        },
        codeChallenge: {
          task: "Using ONE print() only, print a three-line postal address: your name, a street, and a city, each on its own line. Use \\n inside the text.",
          starter: "# One print() and \\n\n",
          sample: "Ada Obi\n12 Allen Avenue\nIkeja, Lagos",
          tests: [
            {
              check:
                'assert source.count("print(") == 1, "Use exactly one print() for the whole address."\n' +
                'assert len(lines) == 3 and all(l.strip() for l in lines), "The address should come out as three non-empty lines. Yours: " + repr(lines)',
            },
          ],
          solution: 'print("Ada Obi\\n12 Allen Avenue\\nIkeja, Lagos")\n',
          hint: "Put \\n exactly where you want each new line to start, all inside one pair of quotes.",
          successMessage: "Three lines from one print(). \\n is the most used escape sequence in Python.",
        },
      },
      {
        id: "a-pp-formatted-output",
        title: "Formatted output: f-strings and neat numbers",
        explain:
          "Put the letter f in front of a string and you can place any expression inside { } braces; Python works it out and inserts the value. Add a format after a colon to control how it looks: {value:.2f} shows exactly two decimal places, which is what money needs. You will learn f-strings fully in Module 8; this is enough for neat output now.",
        code: {
          language: PY,
          code: 'print(f"3 notebooks cost {3 * 450} naira")\nprint(f"Average: {250 / 3:.2f}")\nprint(f"Total:\\t{1800:.2f}")\n',
          expectedOutput: "3 notebooks cost 1350 naira\nAverage: 83.33\nTotal:\t1800.00",
        },
        why: "Without :.2f, 250 / 3 prints as 83.33333333333333, which nobody wants on a receipt.",
        codeChallenge: {
          task: "Print a simple canteen receipt with three lines. Line 1: Rice x2 followed by a tab and the cost of 2 plates at 800 each. Line 2: Drink x3, a tab, and 3 drinks at 250 each. Line 3: TOTAL, a tab, and the sum of both. Use f-strings and let Python do every calculation, with every amount shown to 2 decimal places.",
          starter: "# Use f-strings with {calculation:.2f}\n",
          sample: "Rice x2\t1600.00\nDrink x3\t750.00\nTOTAL\t2350.00",
          tests: [
            {
              check:
                'assert len(lines) == 3, "Print three lines: rice, drink and total."\n' +
                'assert lines[0].endswith("1600.00") and "\\t" in lines[0], "Line 1 should end with a tab and 1600.00 (2 × 800). Yours: " + repr(lines[0])\n' +
                'assert lines[1].endswith("750.00") and "\\t" in lines[1], "Line 2 should end with a tab and 750.00 (3 × 250). Yours: " + repr(lines[1])\n' +
                'assert lines[2].endswith("2350.00"), "Line 3 should show the total, 2350.00. Yours: " + repr(lines[2])\n' +
                'assert "1600" not in source and "2350" not in source, "Let Python calculate: write 2 * 800 inside the braces, not 1600."',
            },
          ],
          solution: 'print(f"Rice x2\\t{2 * 800:.2f}")\nprint(f"Drink x3\\t{3 * 250:.2f}")\nprint(f"TOTAL\\t{2 * 800 + 3 * 250:.2f}")\n',
          hint: 'The first line is print(f"Rice x2\\t{2 * 800:.2f}"). Build the other two the same way.',
          successMessage: "A formatted receipt with every number calculated by Python. In Module 3 you will store the prices in variables so you only type each one once.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.5 – 2.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l7-input",
    moduleId: "pp-m2-syntax-io",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.5", "2.6", "2.7"],
    title: "Asking the User: input()",
    subtitle: "Collecting information, and how it differs from displaying it",
    estimatedMinutes: 18,
    intro:
      "So far your programs say the same thing every time. input() changes that: the program stops, waits for the user to type something and press Enter, and then uses what they typed. That is the moment a program becomes interactive.",

    atoms: [
      {
        id: "a-pp-input-function",
        title: "input(): the program waits for the user",
        explain:
          "input(\"prompt \") shows the prompt, waits for the user to type and press Enter, and gives back what they typed. To use the answer later you give it a name with =, as in name = input(\"What is your name? \"). That name is a variable; Module 3 is all about them. For now: the name on the left holds whatever the user typed.",
        code: {
          language: PY,
          code: 'name = input("What is your name? ")\nprint("Hello,", name)\nprint("Welcome to Python.")\n',
          inputs: ["Ada"],
          expectedOutput: "What is your name? Ada\nHello, Ada\nWelcome to Python.",
        },
        why: "The output shows the conversation as it appears in a terminal: the prompt, what the user typed (Ada), then the program's reply. End the prompt with a space so the answer is not squashed against it.",
        codeChallenge: {
          task: "Write a program that asks for the user's name and then their favourite food, and prints one sentence using both, such as: Ada loves jollof rice. It must work for ANY name and food the user types.",
          starter: "# Two input() calls, then one print()\n",
          sample: "What is your name? Ada\nWhat is your favourite food? jollof rice\nAda loves jollof rice.",
          tests: [
            {
              label: "a first user",
              inputs: ["Ada", "jollof rice"],
              check:
                'assert source.count("input(") >= 2, "Ask two questions: one input() for the name, one for the food."\n' +
                'assert lines and "Ada" in lines[-1] and "jollof rice" in lines[-1], "Your last line should use both answers. With Ada and jollof rice you printed: " + (lines[-1] if lines else "(nothing)")',
            },
            {
              label: "a different user",
              inputs: ["Musa", "suya"],
              check:
                'assert "Musa" in lines[-1] and "suya" in lines[-1], "Your program must use what the user types, not fixed text. With Musa and suya it printed: " + lines[-1]',
            },
          ],
          solution: 'name = input("What is your name? ")\nfood = input("What is your favourite food? ")\nprint(name, "loves", food + ".")\n',
          hint: "name = input(\"...\") then food = input(\"...\"), then print(name, \"loves\", food).",
          successMessage: "It works for anyone. The check ran your program twice with different people, which is exactly how programmers test that code is not hard-wired to one answer.",
        },
      },
      {
        id: "a-pp-input-is-text",
        title: "input() always gives back text",
        explain:
          "Whatever the user types, input() gives it back as text, even if it looks like a number. Joining text with + sticks it together, so \"5\" + \"3\" is \"53\", not 8. To do arithmetic, turn the text into a number first with int() for whole numbers or float() for decimals. The full story of types is Module 3; this one fact prevents the most common beginner bug.",
        code: {
          language: PY,
          code: 'a = input("First number: ")\nb = input("Second number: ")\nprint("Joined as text:", a + b)\nprint("Added as numbers:", int(a) + int(b))\n',
          inputs: ["5", "3"],
          expectedOutput: "First number: 5\nSecond number: 3\nJoined as text: 53\nAdded as numbers: 8",
        },
        codeChallenge: {
          task: "Ask the user how old they are, then print how old they will be in 10 years, as a sentence such as: In 10 years you will be 27.",
          starter: 'age = input("How old are you? ")\nprint("In 10 years you will be", age + 10)\n',
          sample: "How old are you? 17\nIn 10 years you will be 27",
          tests: [
            {
              inputs: ["17"],
              check: 'assert "27" in lines[-1], "With 17 your program should print 27. It printed: " + lines[-1]',
            },
            {
              inputs: ["40"],
              check: 'assert "50" in lines[-1], "With 40 your program should print 50. It printed: " + lines[-1]',
            },
          ],
          solution: 'age = input("How old are you? ")\nprint("In 10 years you will be", int(age) + 10)\n',
          hint: "Run the starter and read the error: Python cannot add a number to text. Turn age into a number with int() before adding.",
          successMessage: "You turned text into a number before doing arithmetic. The starter's TypeError is one of the commonest errors in all of Python, and now you know its cause.",
        },
      },
      {
        id: "a-pp-display-vs-collect",
        title: "Displaying versus collecting data",
        explain:
          "print() DISPLAYS: it sends information out to the screen and the program carries on. input() COLLECTS: it shows its prompt, then stops and waits until the user sends information in. Most programs alternate: display a question, collect the answer, display a result.",
        codeExercise: {
          language: PY,
          code: 'print("Student form")\nname = input("Name: ")\nclass_name = input("Class: ")\nprint(name, "is in", class_name)\n',
          inputs: ["Ngozi", "JSS2"],
          question: "The user types Ngozi, then JSS2. Write the whole screen as it appears, including the prompts and what was typed.",
          expectedOutput: "Student form\nName: Ngozi\nClass: JSS2\nNgozi is in JSS2",
          hint: "Line 1 is displayed. Each input() shows its prompt, and the typed answer appears right after it on the same line.",
          successMessage: "Exactly. Displayed, collected, collected, displayed. Being able to picture the screen before you run a program is what lets you design good prompts.",
        },
      },
      {
        id: "a-pp-student-form",
        title: "Putting it together: a student information form",
        explain:
          "A form program collects several answers, then displays them back in a tidy layout. The design is always the same: one input() per piece of information, with a clear prompt, then print() lines that present what was collected.",
        code: {
          language: PY,
          code: 'name = input("Full name: ")\nschool = input("School: ")\nprint("-------------------")\nprint("STUDENT CARD")\nprint("Name:  ", name)\nprint("School:", school)\n',
          inputs: ["Bola Ade", "Kings College"],
          expectedOutput: "Full name: Bola Ade\nSchool: Kings College\n-------------------\nSTUDENT CARD\nName:   Bola Ade\nSchool: Kings College",
        },
        codeChallenge: {
          task: "Build a student information form. Ask for the student's name, their class and their age. Then print a card: a heading line STUDENT INFORMATION, then one line each for Name, Class and Age, and finally a line saying what year the student will turn 18 if the current year is 2026 (use int() on the age).",
          starter: "# Collect three answers, then print the card\n",
          sample: "Name: Chidi\nClass: SS1\nAge: 15\nSTUDENT INFORMATION\nName: Chidi\nClass: SS1\nAge: 15\nTurns 18 in: 2029",
          tests: [
            {
              inputs: ["Chidi", "SS1", "15"],
              check:
                'body = "\\n".join(lines[3:])\n' +
                'assert "STUDENT INFORMATION" in body, "Print a heading line: STUDENT INFORMATION."\n' +
                'assert "Chidi" in body and "SS1" in body, "Display the name and class you collected on the card."\n' +
                'assert "2029" in body, "A 15-year-old in 2026 turns 18 in 2029. Calculate it: 2026 + (18 - age)."',
            },
            {
              inputs: ["Amaka", "JSS3", "13"],
              check: 'assert "2031" in "\\n".join(lines[3:]) and "Amaka" in output, "With age 13 the card should say 2031, and use the name typed. Make sure you calculate from the age the user gives."',
            },
          ],
          solution: 'name = input("Name: ")\nclass_name = input("Class: ")\nage = input("Age: ")\nprint("STUDENT INFORMATION")\nprint("Name:", name)\nprint("Class:", class_name)\nprint("Age:", age)\nprint("Turns 18 in:", 2026 + (18 - int(age)))\n',
          hint: "Three input() lines first. For the year: 2026 + (18 - int(age)).",
          successMessage: "A complete interactive program: collect, process, display. That is the milestone for this module, and you have written it yourself.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l8-errors-debugging",
    moduleId: "pp-m2-syntax-io",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.8"],
    title: "Syntax Errors and Debugging",
    subtitle: "Reading the message, finding the line, fixing the code",
    estimatedMinutes: 16,
    intro:
      "Every programmer writes code that does not work, every day. What separates beginners from professionals is not fewer errors; it is how quickly they read the message and fix the cause. This lesson trains exactly that.",

    atoms: [
      {
        id: "a-pp-syntax-errors",
        title: "SyntaxError: Python cannot understand the file",
        explain:
          "A SyntaxError means the code breaks Python's grammar, so nothing in the file runs. The message gives the file, the line number, a copy of the line with a ^ under the place Python got confused, and a short description. The real mistake is at the ^ or just before it.",
        code: {
          language: PY,
          code: 'print("Total:", 500\nprint("Thank you")\n',
          raises: "SyntaxError: '(' was never closed",
        },
        table: {
          caption: "The syntax errors beginners meet most, and their usual cause.",
          headers: ["Message", "Usual cause"],
          rows: [
            ["'(' was never closed", "A missing ) at the end of a line"],
            ["unterminated string literal", "A missing closing quote"],
            ["invalid syntax", "A missing comma, an extra symbol, or a typo in a keyword"],
            ["unexpected indent", "Spaces at the start of a line that should not be there"],
          ],
        },
        codeChallenge: {
          task: "This basic receipt has three syntax errors. Run it, read each error, fix it, and run again until all four lines print.",
          starter: 'print("RECEIPT")\nprint("Bread:", 1200\nprint("Milk:", 900)\nprint("Total:" 2100)\nprint("Thank you)\n',
          sample: "RECEIPT\nBread: 1200\nMilk: 900\nTotal: 2100\nThank you",
          tests: [
            {
              check:
                'assert lines == ["RECEIPT", "Bread: 1200", "Milk: 900", "Total: 2100", "Thank you"], "The receipt should print five lines exactly as in the example. Yours: " + repr(lines)',
            },
          ],
          solution: 'print("RECEIPT")\nprint("Bread:", 1200)\nprint("Milk:", 900)\nprint("Total:", 2100)\nprint("Thank you")\n',
          hint: "Python reports one syntax error at a time. Fix the one it names, run again, and the next one appears. Look for a missing bracket, a missing comma and a missing quote.",
          successMessage: "Three errors, found and fixed one at a time. Fix, run, read, repeat: that loop is debugging.",
        },
      },
      {
        id: "a-pp-runtime-errors",
        title: "Errors while running: NameError and TypeError",
        explain:
          "Some mistakes are only found when Python reaches the line. A NameError means a name was used that does not exist: usually a typo, or a word that needed quotes. A TypeError means an operation was used on the wrong kind of value, such as adding text to a number. Lines before the error have already run.",
        code: {
          language: PY,
          code: 'price = 500\nprint("Price:", price)\nprint("Price:", prise)\n',
          expectedOutput: "Price: 500",
          raises: "NameError: name 'prise' is not defined. Did you mean: 'price'?",
        },
        decision: {
          scenario: "You run:\n\n  name = input(\"Name: \")\n  print(\"Hello\", Name)\n\nand get  NameError: name 'Name' is not defined. Did you mean: 'name'?",
          question: "What is the fix?",
          options: [
            {
              id: "a",
              text: "Change Name to name on line 2, because names are case-sensitive",
              why: "The variable was created as name (lower case). Name is a different name that does not exist. Python's suggestion points straight at it.",
            },
            {
              id: "b",
              text: "Put quotes around Name",
              whyWrong: "Then it would print the word Name instead of the user's name. The intent is to use the variable.",
            },
            {
              id: "c",
              text: "Reinstall Python",
              whyWrong: "Python is working perfectly; it found a real mistake in the code.",
            },
            {
              id: "d",
              text: "Delete line 1",
              whyWrong: "Line 1 is the one line that is correct: it creates the variable that line 2 needs.",
            },
          ],
          correct: "a",
          aftermath: "Read the last line of the message first. It names the error and very often suggests the fix.",
        },
      },
      {
        id: "a-pp-debugging-calculator",
        title: "A debugging habit, and a basic calculator",
        explain:
          "When a program misbehaves: read the error's last line, go to the line number it gives, compare what you wrote with what you meant, fix one thing, run again. When there is no error but the answer is wrong, add print() lines to show values part way through, so you can see where the result goes wrong.",
        code: {
          language: PY,
          code: 'a = float(input("First number: "))\nb = float(input("Second number: "))\nprint("Sum:", a + b)\n',
          inputs: ["7.5", "2.5"],
          expectedOutput: "First number: 7.5\nSecond number: 2.5\nSum: 10.0",
        },
        why: "float() turns the typed text into a decimal number, so 7.5 + 2.5 is calculated rather than joined. That is why the sum shows as 10.0.",
        codeChallenge: {
          task: "Build a basic calculator. Ask for two numbers (use float()), then print their sum, difference, product and quotient, one per line, each with a label such as Sum: 10.0.",
          starter: 'a = input("First number: ")\nb = input("Second number: ")\nprint("Sum:", a + b)\n',
          sample: "First number: 8\nSecond number: 2\nSum: 10.0\nDifference: 6.0\nProduct: 16.0\nQuotient: 4.0",
          tests: [
            {
              inputs: ["8", "2"],
              check:
                'import re\n' +
                'nums = [float(x) for x in re.findall(r"-?\\d+(?:\\.\\d+)?", "\\n".join(lines[2:]))]\n' +
                'assert len(lines) >= 6, "After the two questions, print four lines: sum, difference, product and quotient."\n' +
                'assert nums[:4] == [10.0, 6.0, 16.0, 4.0], "With 8 and 2 the four results should be 10, 6, 16 and 4. Yours: " + str(nums[:4])',
            },
            {
              inputs: ["9", "3"],
              check:
                'import re\n' +
                'nums = [float(x) for x in re.findall(r"-?\\d+(?:\\.\\d+)?", "\\n".join(lines[2:]))]\n' +
                'assert nums[:4] == [12.0, 6.0, 27.0, 3.0], "With 9 and 3 the results should be 12, 6, 27 and 3. Yours: " + str(nums[:4])',
            },
          ],
          solution: 'a = float(input("First number: "))\nb = float(input("Second number: "))\nprint("Sum:", a + b)\nprint("Difference:", a - b)\nprint("Product:", a * b)\nprint("Quotient:", a / b)\n',
          hint: "Wrap each input() in float( ). The symbols are + - * and / for divide.",
          successMessage: "A working calculator, tested with two different pairs of numbers. Try dividing by 0 in VS Code and read the error: Module 4 explains it and Module 12 handles it properly.",
        },
      },
    ],

    task: {
      title: "Module 2 practice: four interactive programs",
      intro:
        "Write each of these as its own .py file in VS Code. The milestone is to build interactive programs that receive and display information.",
      prompts: [
        "Personal introduction program: ask for name, age, town and hobby, then print a four-line introduction.",
        "Simple receipt: ask for two item names and their prices, then print a receipt with a tab between each item and its price, and a total to 2 decimal places.",
        "Student information form: ask for name, class, age and favourite subject; print a card with a heading and a line of dashes.",
        "Basic calculator: ask for two numbers and print all four results, each labelled.",
        "Break each program on purpose in three different ways (a missing bracket, a misspelt name, adding text to a number). Write down the error message each one gives.",
      ],
      closing:
        "Next module explains what is really happening when you write name = ... : variables, types and memory.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
