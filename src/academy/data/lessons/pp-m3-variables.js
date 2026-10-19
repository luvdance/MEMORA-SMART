/**
 * PYTHON PROGRAMMING · MODULE 3 · VARIABLES, DATA TYPES AND MEMORY CONCEPTS
 *
 * Curriculum 3.1 – 3.10. Names and values, the four basic types, converting
 * between them, dynamic typing, None, constants and the errors types cause.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s3-variables";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.1 – 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l9-variables",
    moduleId: "pp-m3-variables",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3"],
    title: "Variables: Names for Values",
    subtitle: "What a variable is, how to name it, and how it changes",
    estimatedMinutes: 16,
    intro:
      "You have already written name = input(...). This lesson explains what that = really does. A variable is how a program remembers things while it runs, and almost every line you write from now on will use one.",

    atoms: [
      {
        id: "a-pp-what-variables",
        title: "A variable is a name attached to a value",
        explain:
          "When Python runs price = 1500, it stores the value 1500 in memory and attaches the name price to it. Afterwards, wherever you write price, Python uses 1500. The = sign means \"make this name refer to this value\". It is not the equals of maths: it is an instruction, and it runs right to left: work out the value on the right, then attach the name on the left.",
        analogy:
          "Think of a value as a box in memory and the variable as a name tag tied to it. print(price) reads the tag, finds the box, and shows what is inside.",
        code: {
          language: PY,
          code: 'school = "Federal Government College"\nstudents = 1200\nprint(school)\nprint("Students:", students)\nprint("Classrooms needed:", students // 40)\n',
          expectedOutput: "Federal Government College\nStudents: 1200\nClassrooms needed: 30",
        },
        why: "Each value is typed once and used by name. If the number of students changes, you change one line and every calculation that uses it updates.",
        codeChallenge: {
          task: "Create a variable called name holding your name (in quotes) and a variable called age holding your age as a number (no quotes). Then print one sentence that uses both variables, such as: My name is Ada and I am 17 years old.",
          starter: "# Create name and age, then print a sentence that uses them\n",
          sample: "My name is Ada and I am 17 years old.",
          tests: [
            {
              check:
                'assert isinstance(name, str) and name.strip(), "Create a variable called name that holds your name in quotes."\n' +
                'assert isinstance(age, int), "Create a variable called age that holds a whole number, with no quotes."\n' +
                'assert lines and name in lines[-1] and str(age) in lines[-1], "Print a sentence that uses BOTH variables. Your last line was: " + (lines[-1] if lines else "(nothing)")\n' +
                'assert name not in source.split("print", 1)[-1], "Use the variable name inside print(), not the text of your name again."',
            },
          ],
          solution: 'name = "Ada"\nage = 17\nprint("My name is", name, "and I am", age, "years old.")\n',
          hint: 'name = "Ada" on one line, age = 17 on the next, then print("My name is", name, ...).',
          successMessage: "Your values are stored once and used by name. Change age to a different number and run again: the sentence updates without you touching the print().",
        },
      },
      {
        id: "a-pp-naming",
        title: "Naming rules, conventions and reserved keywords",
        explain:
          "A variable name may contain letters, digits and underscores, must not start with a digit, and must not contain spaces. Names are case-sensitive. Python's convention, from the style guide PEP 8, is snake_case: lower-case words joined by underscores, such as total_score. A small set of words are reserved keywords with special meaning, and cannot be used as names.",
        table: {
          caption: "Valid and invalid names, and why.",
          headers: ["Name", "Allowed?", "Why"],
          rows: [
            ["total_score", "Yes, and conventional", "snake_case, describes the value"],
            ["score2", "Yes", "Digits are fine after the first character"],
            ["2score", "No", "Cannot start with a digit"],
            ["total score", "No", "No spaces allowed"],
            ["class", "No", "class is a reserved keyword"],
            ["TotalScore", "Allowed, but not for variables", "CapWords is the convention for classes (Module 13)"],
            ["x", "Allowed, but unclear", "Fine for maths; a poor name for a fee or a student"],
          ],
        },
        example:
          "Python's reserved keywords (you cannot name a variable any of these):\n\nFalse  None  True  and  as  assert  async  await  break\nclass  continue  def  del  elif  else  except  finally\nfor  from  global  if  import  in  is  lambda  nonlocal\nnot  or  pass  raise  return  try  while  with  yield",
        decision: {
          scenario: "You need a variable for the number of students in a class who passed.",
          question: "Which name is best?",
          options: [
            {
              id: "a",
              text: "passed_count",
              why: "Valid, snake_case, and it says exactly what the value is. Anyone reading the code knows what it holds.",
            },
            {
              id: "b",
              text: "pc",
              whyWrong: "Valid, but nobody can tell what pc means a week from now. Names are for readers.",
            },
            {
              id: "c",
              text: "passed count",
              whyWrong: "Names cannot contain spaces; Python sees two separate names and raises a SyntaxError.",
            },
            {
              id: "d",
              text: "1st_passed",
              whyWrong: "A name cannot start with a digit.",
            },
          ],
          correct: "a",
          aftermath: "Good names are the cheapest documentation there is. You will read your own code far more often than you write it.",
        },
      },
      {
        id: "a-pp-reassignment",
        title: "Assignment and reassignment",
        explain:
          "A variable can be given a new value at any time: that is reassignment. The old value is replaced. A very common pattern uses the variable's own current value to calculate its new one: balance = balance - 500 means \"work out balance - 500, then make balance refer to the result\".",
        code: {
          language: PY,
          code: 'balance = 5000\nprint(balance)\nbalance = balance - 1200\nprint(balance)\nbalance = balance + 3000\nprint(balance)\n',
          expectedOutput: "5000\n3800\n6800",
        },
        trace: {
          headers: ["Line", "Code", "balance after the line"],
          rows: [
            ["1", "balance = 5000", "5000"],
            ["3", "balance = balance - 1200", "3800"],
            ["5", "balance = balance + 3000", "6800"],
          ],
          note: "Read each line right to left: calculate with the current value, then replace it.",
        },
        codeChallenge: {
          task: "Track a phone's data allowance. Start a variable data_mb at 2048. The user streams a video using 750 MB, then buys a bundle adding 1024 MB, then browses using 300 MB. Update data_mb with a reassignment after each event and print it after each one, so four numbers are printed in total.",
          starter: "data_mb = 2048\nprint(data_mb)\n",
          sample: "2048\n1298\n2322\n2022",
          tests: [
            {
              check:
                'assert lines == ["2048", "1298", "2322", "2022"], "Print data_mb four times: at the start and after each event. Expected 2048, 1298, 2322, 2022. Yours: " + repr(lines)\n' +
                'assert data_mb == 2022, "data_mb should end at 2022."\n' +
                'assert source.count("data_mb = data_mb") + source.count("data_mb -=") + source.count("data_mb +=") >= 3, "Update data_mb from its own value each time, for example data_mb = data_mb - 750."',
            },
          ],
          solution: "data_mb = 2048\nprint(data_mb)\ndata_mb = data_mb - 750\nprint(data_mb)\ndata_mb = data_mb + 1024\nprint(data_mb)\ndata_mb = data_mb - 300\nprint(data_mb)\n",
          hint: "After the starter's two lines, add: data_mb = data_mb - 750, then print(data_mb). Repeat for the other two events.",
          successMessage: "Three reassignments, each building on the last. That pattern, updating a value from itself, is the heart of every running total and counter you will write.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.4 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l10-data-types",
    moduleId: "pp-m3-variables",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.4", "3.5"],
    title: "Data Types",
    subtitle: "int, float, str and bool, and how to check with type()",
    estimatedMinutes: 14,
    intro:
      "Every value in Python has a type, and the type decides what you can do with it. You can divide two numbers but not two names; you can make text upper case but not a number. Four types cover almost everything a beginner needs.",

    atoms: [
      {
        id: "a-pp-four-types",
        title: "The four basic types",
        explain:
          "An int is a whole number. A float is a number with a decimal point. A str (string) is text, always written in quotes. A bool (Boolean) is one of exactly two values, True or False, and is the answer to a yes/no question. Note that \"25\" in quotes is a str, not a number.",
        table: {
          caption: "The four types, with examples and uses.",
          headers: ["Type", "Examples", "Use it for"],
          rows: [
            ["int", "17, -3, 0, 1200", "Counts, ages, whole amounts"],
            ["float", "3.5, 0.075, -2.0", "Measurements, averages, rates"],
            ["str", "\"Ada\", 'SS2', \"25\", \"\"", "Names, messages, anything typed"],
            ["bool", "True, False", "Yes/no facts: passed, is_member"],
          ],
        },
        code: {
          language: PY,
          code: 'students = 42\naverage = 67.5\nclass_name = "SS2"\nall_present = False\nprint(students, average, class_name, all_present)\n',
          expectedOutput: "42 67.5 SS2 False",
        },
        why: "True and False are written with capital letters and no quotes. \"False\" in quotes would be a piece of text, not a Boolean.",
      },
      {
        id: "a-pp-type-function",
        title: "type(): asking Python what something is",
        explain:
          "type(value) tells you the type of any value or variable. It prints as <class 'int'>, <class 'str'> and so on. When a program behaves strangely, checking the type of a variable is one of the first things to try.",
        codeExercise: {
          language: PY,
          code: 'print(type(25))\nprint(type("25"))\nprint(type(2.5))\nprint(type(25 > 3))\n',
          question: "Read each value carefully, quotes included. What does this print?",
          expectedOutput: "<class 'int'>\n<class 'str'>\n<class 'float'>\n<class 'bool'>",
          hint: "\"25\" has quotes. 25 > 3 is a comparison, whose answer is True or False.",
          successMessage: "The quotes made the second one a string, and the comparison produced a bool. Being able to tell types apart at a glance prevents most of the errors in Lesson 12.",
        },
      },
      {
        id: "a-pp-choosing-types",
        title: "Choosing the right type: a student profile",
        explain:
          "Pick the type from what the value means. A count of things is an int. A measurement that can have a fraction is a float. Anything you only display or compare as text, including phone numbers, is a str. A yes/no fact is a bool.",
        mistake:
          "Storing a phone number as an int. Phone numbers start with 0 (which an int drops), are never added up, and sometimes include +234. They are text: store them as str.",
        codeChallenge: {
          task: "Build a student profile. Create four variables with the right types: full_name (text), age (whole number), height_m (decimal, in metres) and is_prefect (True or False). Then print each variable on its own line followed by its type, like: Ada <class 'str'>",
          starter: "# Four variables, then print each one with type()\n",
          sample: "Ada Obi <class 'str'>\n16 <class 'int'>\n1.68 <class 'float'>\nTrue <class 'bool'>",
          tests: [
            {
              check:
                'assert isinstance(full_name, str), "full_name should be text, in quotes."\n' +
                'assert type(age) is int, "age should be a whole number with no quotes and no decimal point."\n' +
                'assert type(height_m) is float, "height_m should be a decimal number such as 1.68."\n' +
                'assert type(is_prefect) is bool, "is_prefect should be True or False, with a capital letter and no quotes."\n' +
                'assert len(lines) >= 4 and all("<class" in l for l in lines[:4]), "Print four lines, each showing a value and its type(). Yours: " + repr(lines)',
            },
          ],
          solution: 'full_name = "Ada Obi"\nage = 16\nheight_m = 1.68\nis_prefect = True\nprint(full_name, type(full_name))\nprint(age, type(age))\nprint(height_m, type(height_m))\nprint(is_prefect, type(is_prefect))\n',
          hint: "print(full_name, type(full_name)) shows the value then its type. Write one of those for each variable.",
          successMessage: "Four values, four correct types, and you proved each one with type(). Choosing types deliberately is the main skill of this module.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.6 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l11-conversion",
    moduleId: "pp-m3-variables",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.6", "3.7"],
    title: "Type Conversion and Dynamic Typing",
    subtitle: "int(), float() and str(), and names that can change type",
    estimatedMinutes: 16,
    intro:
      "Input arrives as text, calculations need numbers, and output is text again. Converting between types is something every program does, and Python lets one variable hold different types over its life. Both are simple; both cause bugs when ignored.",

    atoms: [
      {
        id: "a-pp-conversion",
        title: "Converting with int(), float() and str()",
        explain:
          "int(x) makes a whole number, float(x) makes a decimal, and str(x) makes text. int() of a float simply cuts off the decimal part (it does not round). int() of text only works if the text looks like a whole number: int(\"42\") is fine, int(\"4.5\") and int(\"forty\") raise a ValueError.",
        code: {
          language: PY,
          code: 'print(int("42") + 8)\nprint(float("2.5") * 2)\nprint(int(9.99))\nprint("Total: " + str(120))\nprint(int("4.5"))\n',
          expectedOutput: "50\n5.0\n9\nTotal: 120",
          raises: "ValueError: invalid literal for int() with base 10: '4.5'",
        },
        why: "Notice int(9.99) is 9, not 10: it truncates. And \"Total: \" + 120 would fail, because + cannot join text and a number; str(120) turns the number into text first.",
        codeChallenge: {
          task: "Write a school fee calculator. Ask for the tuition, the cost of books and the cost of uniform (whole naira amounts). Print the total for the year, then the amount per term if the total is split over 3 terms, to 2 decimal places.",
          starter: 'tuition = input("Tuition: ")\nbooks = input("Books: ")\nuniform = input("Uniform: ")\nprint("Total:", tuition + books + uniform)\n',
          sample: "Tuition: 150000\nBooks: 25000\nUniform: 12000\nTotal: 187000\nPer term: 62333.33",
          tests: [
            {
              inputs: ["150000", "25000", "12000"],
              check:
                'body = "\\n".join(lines[3:])\n' +
                'assert "187000" in body, "The total of 150000 + 25000 + 12000 is 187000. Convert each answer with int() before adding."\n' +
                'assert "62333.33" in body, "Per term should be 187000 / 3, shown to 2 decimal places: 62333.33."',
            },
            {
              inputs: ["90000", "15000", "6000"],
              check: 'body = "\\n".join(lines[3:])\nassert "111000" in body and "37000.00" in body, "With 90000, 15000 and 6000, expect 111000 and 37000.00. Yours: " + body',
            },
          ],
          solution: 'tuition = int(input("Tuition: "))\nbooks = int(input("Books: "))\nuniform = int(input("Uniform: "))\ntotal = tuition + books + uniform\nprint("Total:", total)\nprint(f"Per term: {total / 3:.2f}")\n',
          hint: "Run the starter: it joins the text into one long number. Wrap each input() in int(), store the total in a variable, then print total / 3 with :.2f.",
          successMessage: "Text in, numbers for the arithmetic, formatted text out. That conversion pipeline is in almost every program that talks to a user.",
        },
      },
      {
        id: "a-pp-dynamic-typing",
        title: "Dynamic typing: the value has the type, not the name",
        explain:
          "In Python a variable has no fixed type. The VALUE has a type, and a name can be moved to a value of a different type at any time. This is called dynamic typing. It makes code short to write, and it means you must keep track of what a name currently holds.",
        code: {
          language: PY,
          code: 'score = "75"\nprint(type(score))\nscore = int(score)\nprint(type(score))\nscore = score / 2\nprint(score, type(score))\n',
          expectedOutput: "<class 'str'>\n<class 'int'>\n37.5 <class 'float'>",
        },
        decision: {
          scenario: "A program sets quantity = input(\"How many? \") and later does quantity * 500. The user types 3 and the program prints 333333...",
          question: "What happened?",
          options: [
            {
              id: "a",
              text: "quantity holds the text \"3\", and text * 500 repeats the text 500 times",
              why: "Dynamic typing: quantity holds whatever input() gave it, which is a str. * on a string repeats it. int(input(...)) fixes it.",
            },
            {
              id: "b",
              text: "Python made a calculation mistake",
              whyWrong: "Python did exactly what it was told, to the type it was given.",
            },
            {
              id: "c",
              text: "The variable's type was fixed as int when it was created",
              whyWrong: "Python names have no fixed type, and this one was given text from the start.",
            },
            {
              id: "d",
              text: "500 must be written as \"500\"",
              whyWrong: "That would make things worse: you cannot multiply two strings at all.",
            },
          ],
          correct: "a",
          aftermath: "When a result looks bizarre, print(type(...)) the variables involved. Very often one of them is not the type you thought.",
        },
      },
      {
        id: "a-pp-currency-conversion",
        title: "Practice: currency conversion with a supplied rate",
        explain:
          "Converting money is a multiplication or division by an exchange rate. The rate is a float, the amount typed is converted with float(), and the result is shown to 2 decimal places. Rates change daily, so a real program reads them from somewhere; here the rate is supplied.",
        code: {
          language: PY,
          code: 'rate = 1550.0  # naira per US dollar, supplied for this exercise\ndollars = 20\nprint(f"{dollars} USD = {dollars * rate:.2f} NGN")\n',
          expectedOutput: "20 USD = 31000.00 NGN",
        },
        codeChallenge: {
          task: "Write the reverse converter. The supplied rate is 1550.0 naira per US dollar. Ask the user for an amount in naira and print how many US dollars it is, to 2 decimal places, in a sentence such as: 46500.0 NGN = 30.00 USD",
          starter: "rate = 1550.0\n",
          sample: "Amount in naira: 46500\n46500.0 NGN = 30.00 USD",
          tests: [
            {
              inputs: ["46500"],
              check: 'assert lines and "30.00" in lines[-1], "46500 naira at 1550 per dollar is 30.00 USD. Your last line: " + (lines[-1] if lines else "(nothing)")',
            },
            {
              inputs: ["10000"],
              check: 'assert "6.45" in lines[-1], "10000 / 1550 is 6.45 to 2 decimal places. Your last line: " + lines[-1]',
            },
          ],
          solution: 'rate = 1550.0\nnaira = float(input("Amount in naira: "))\nprint(f"{naira} NGN = {naira / rate:.2f} USD")\n',
          hint: "naira = float(input(...)). Dollars = naira / rate. Format with :.2f.",
          successMessage: "A working converter. Because the rate is in one variable, updating it tomorrow is a one-line change.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.8 – 3.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l12-none-constants-errors",
    moduleId: "pp-m3-variables",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.8", "3.9", "3.10"],
    title: "None, Constants and Type Errors",
    subtitle: "Missing values, fixed values, and what goes wrong",
    estimatedMinutes: 16,
    intro:
      "Three last ideas complete the picture of values: how to represent \"no value yet\", how to mark a value that should never change, and how to read the errors you get when types are mixed up.",

    atoms: [
      {
        id: "a-pp-none",
        title: "None: the value that means \"nothing here\"",
        explain:
          "None is Python's way of saying a value is missing or not known yet. It has its own type, NoneType. It is not 0, not False and not an empty string: a score of 0 means the student scored zero; a score of None means we do not have the score. Functions that do not give anything back, such as print(), return None.",
        codeExercise: {
          language: PY,
          code: 'middle_name = None\nprint(middle_name)\nprint(type(middle_name))\nresult = print("Hi")\nprint(result)\n',
          question: "Careful with line 4: it both prints something AND stores what print() gives back. What is the full output?",
          expectedOutput: "None\n<class 'NoneType'>\nHi\nNone",
          hint: "Line 4 runs print(\"Hi\"), which shows Hi. print() gives back None, which is stored in result and printed by line 5.",
          successMessage: "Right. print() shows text but returns None. That difference between showing a value and giving one back matters a lot in Module 7.",
        },
      },
      {
        id: "a-pp-constants",
        title: "Constants by naming convention",
        explain:
          "A constant is a value that should not change while the program runs: a VAT rate, a pass mark, the current year. Python cannot lock a variable, so programmers use a convention: constants are named in UPPER_CASE and placed at the top of the file. Anyone who sees PASS_MARK knows not to reassign it.",
        code: {
          language: PY,
          code: 'VAT_RATE = 0.075\nPASS_MARK = 50\nprice = 20000\nprint("VAT:", price * VAT_RATE)\nprint("Pass mark is", PASS_MARK)\n',
          expectedOutput: "VAT: 1500.0\nPass mark is 50",
        },
        codeChallenge: {
          task: "Write an age calculator. Define a constant CURRENT_YEAR set to 2026 at the top. Ask for the user's birth year, then print their age this year, and on a second line the year they will turn 60.",
          starter: "# Define CURRENT_YEAR first\n",
          sample: "Birth year: 2008\nAge this year: 18\nTurns 60 in: 2068",
          tests: [
            {
              inputs: ["2008"],
              check:
                'assert CURRENT_YEAR == 2026, "Define the constant CURRENT_YEAR = 2026, in capitals."\n' +
                'body = "\\n".join(lines[1:])\n' +
                'assert "18" in body and "2068" in body, "Born in 2008: age 18 this year, turns 60 in 2068. Yours: " + body',
            },
            {
              inputs: ["1990"],
              check:
                'body = "\\n".join(lines[1:])\n' +
                'assert "36" in body and "2050" in body, "Born in 1990: age 36, turns 60 in 2050. Yours: " + body\n' +
                'assert source.count("2026") == 1, "Type 2026 only once, in the constant, and use CURRENT_YEAR everywhere else."',
            },
          ],
          solution: 'CURRENT_YEAR = 2026\nbirth_year = int(input("Birth year: "))\nprint("Age this year:", CURRENT_YEAR - birth_year)\nprint("Turns 60 in:", birth_year + 60)\n',
          hint: "CURRENT_YEAR = 2026 on line 1. Age is CURRENT_YEAR - birth_year; the year they turn 60 is birth_year + 60.",
          successMessage: "Next year, one line changes and the program is correct again. That is why constants exist.",
        },
      },
      {
        id: "a-pp-type-errors",
        title: "Common type errors and how to fix them",
        explain:
          "Two errors come from types. TypeError: an operation was used on a type that does not support it, such as joining a str and an int with +. ValueError: the type is right but the value is not usable, such as int(\"twelve\"). The fix is almost always a conversion in the right place.",
        table: {
          caption: "Type errors you will meet, and the usual fix.",
          headers: ["Code", "Error", "Fix"],
          rows: [
            ["\"Age: \" + 17", "TypeError: can only concatenate str (not \"int\") to str", "\"Age: \" + str(17), or print(\"Age:\", 17)"],
            ["input(\"n: \") + 1", "TypeError: can only concatenate str (not \"int\") to str", "int(input(\"n: \")) + 1"],
            ["int(\"twelve\")", "ValueError: invalid literal for int() with base 10: 'twelve'", "Ask the user to type digits; Module 12 handles it"],
            ["int(\"4.5\")", "ValueError: invalid literal for int() with base 10: '4.5'", "float(\"4.5\"), or int(float(\"4.5\"))"],
          ],
        },
        code: {
          language: PY,
          code: 'items = 7\nprint("Total items: " + items)\n',
          raises: 'TypeError: can only concatenate str (not "int") to str',
        },
        codeChallenge: {
          task: "This stock report crashes. Fix it so it prints exactly: Total items: 7 then Average per shelf: 3.5",
          starter: 'shelf_a = "3"\nshelf_b = 4\ntotal = shelf_a + shelf_b\nprint("Total items: " + total)\nprint("Average per shelf: " + total / 2)\n',
          sample: "Total items: 7\nAverage per shelf: 3.5",
          tests: [
            {
              check:
                'assert lines == ["Total items: 7", "Average per shelf: 3.5"], "Expected the two lines exactly as in the example. Yours: " + repr(lines)',
            },
          ],
          solution: 'shelf_a = "3"\nshelf_b = 4\ntotal = int(shelf_a) + shelf_b\nprint("Total items: " + str(total))\nprint("Average per shelf: " + str(total / 2))\n',
          hint: "There are three type problems: shelf_a is text, and both print lines join text with a number. Convert in each place.",
          successMessage: "Three type errors fixed. Reading TypeError and ValueError messages and knowing where the conversion goes is now a skill you have, not a mystery.",
        },
      },
    ],

    task: {
      title: "Module 3 practice: four programs that use the right types",
      intro:
        "Write each as its own file. The milestone is to choose appropriate data types and understand why type errors occur.",
      prompts: [
        "Age calculator: ask for a birth year, use a CURRENT_YEAR constant, print the age and the age in months.",
        "School fee calculator: ask for at least four fee items, print the total, the per-term amount and the monthly amount over 9 months, all to 2 decimal places.",
        "Student profile: store name, class, age, average score, and whether they are a prefect, each with the correct type; print the profile and the type of each value.",
        "Currency conversion: with supplied rates of 1550.0 NGN per USD and 1950.0 NGN per GBP, ask for an amount in naira and print it in both currencies.",
        "In a comment at the top of each file, write one sentence explaining why you chose each type.",
      ],
      closing:
        "Next module: every operator Python offers, and how to turn any formula into a correct expression.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
