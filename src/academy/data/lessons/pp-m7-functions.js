/**
 * PYTHON PROGRAMMING · MODULE 7 · FUNCTIONS AND MODULAR PROGRAMMING
 *
 * Curriculum 7.1 – 7.11. Defining and calling, parameters, return versus
 * print, keyword and default arguments, scope, multiple returns, docstrings,
 * decomposition and recursion. From here on, many challenge checks CALL the
 * learner's function with test values, which is how functions are tested in
 * professional code (Module 17).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s7-functions";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 7.1 – 7.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l27-def-call",
    moduleId: "pp-m7-functions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3"],
    title: "Defining and Calling Functions",
    subtitle: "Why functions exist, def, and parameters",
    estimatedMinutes: 18,
    intro:
      "You have been using functions since your first line: print(), input(), int(), len(). Now you write your own. A function gives a name to a piece of logic so you can use it again and again without repeating the code.",

    atoms: [
      {
        id: "a-pp-why-functions",
        title: "Why functions are needed",
        explain:
          "Without functions, the same lines get copied wherever they are needed. Copies drift apart: a bug fixed in one copy survives in the others. A function is written once and called by name wherever needed. It also lets you think at a higher level: calculate_tax(price) says what happens without showing how.",
        example:
          "Without a function (the same three lines, three times):\n\n  print(\"=\" * 20)\n  print(\"Report for Ada\")\n  print(\"=\" * 20)\n  ... and again for Bayo, and again for Chi\n\nWith a function:\n\n  def heading(name):\n      print(\"=\" * 20)\n      print(\"Report for\", name)\n      print(\"=\" * 20)\n\n  heading(\"Ada\")\n  heading(\"Bayo\")\n  heading(\"Chi\")\n\nChange the line width once, and every heading changes.",
        decision: {
          scenario: "A program calculates VAT in six places with the line price * 0.075. The VAT rate changes to 10%.",
          question: "What would have made this change easiest?",
          options: [
            {
              id: "a",
              text: "A function vat(price) used in all six places, so the rate is changed in one line",
              why: "One definition, one change. That is the core reason functions exist: a single source of truth for a piece of logic.",
            },
            {
              id: "b",
              text: "Using find-and-replace on 0.075",
              whyWrong: "It might work, but it might also change a different 0.075 that means something else, and you would have to remember to do it every time.",
            },
            {
              id: "c",
              text: "Adding a comment next to each copy",
              whyWrong: "Comments do not change behaviour; you still have six places to edit.",
            },
            {
              id: "d",
              text: "Nothing; six edits is fine",
              whyWrong: "Six today, sixty in a bigger program, and it only takes one missed copy to produce wrong bills.",
            },
          ],
          correct: "a",
          aftermath: "Whenever you notice yourself copying a block of code, that block wants to be a function.",
        },
      },
      {
        id: "a-pp-def-call",
        title: "def: defining a function, and calling it",
        explain:
          "def name(): followed by an indented block DEFINES a function: it teaches Python the name but runs nothing. CALLING the function, name(), runs its block. You can call it as many times as you like. A function must be defined before the line that calls it runs.",
        code: {
          language: PY,
          code: 'def school_motto():\n    print("Knowledge is power")\n    print("-- Memora Academy")\n\nprint("Assembly begins")\nschool_motto()\nschool_motto()\n',
          expectedOutput: "Assembly begins\nKnowledge is power\n-- Memora Academy\nKnowledge is power\n-- Memora Academy",
        },
        why: "\"Assembly begins\" prints first even though the def is above it: defining the function printed nothing. Each call runs the whole block.",
        codeChallenge: {
          task: "Define a function called divider that prints a line of 30 dashes. Then print Name: Ada, call divider(), print Class: SS2, and call divider() again.",
          starter: "# Define divider() first, then use it\n",
          sample: "Name: Ada\n------------------------------\nClass: SS2\n------------------------------",
          tests: [
            {
              check:
                'assert callable(divider), "Define a function called divider."\n' +
                'assert lines == ["Name: Ada", "-" * 30, "Class: SS2", "-" * 30], "Expected the four lines shown in the example. Yours: " + repr(lines)\n' +
                'assert source.count("divider()") >= 2, "Call divider() twice."',
            },
          ],
          solution: 'def divider():\n    print("-" * 30)\n\nprint("Name: Ada")\ndivider()\nprint("Class: SS2")\ndivider()\n',
          hint: "def divider(): then print(\"-\" * 30) indented. Call it with divider().",
          successMessage: "Defined once, called twice. Change 30 to 40 in one place and both lines change.",
        },
      },
      {
        id: "a-pp-parameters",
        title: "Parameters and arguments",
        explain:
          "A parameter is a name in the def line that receives a value when the function is called. The value you pass in the call is the argument. def greet(name): has the parameter name; greet(\"Ada\") passes the argument \"Ada\". Several parameters are separated by commas, and arguments are matched to them in order.",
        code: {
          language: PY,
          code: 'def receipt_line(item, price):\n    print(f"{item:<10}{price:>8.2f}")\n\nreceipt_line("Bread", 1200)\nreceipt_line("Eggs", 2500)\n',
          expectedOutput: "Bread      1200.00\nEggs       2500.00",
        },
        codeChallenge: {
          task: "Define a function introduce(name, city) that prints one sentence: Hello, I am Ada from Enugu. Then call it three times with three different people.",
          starter: "# def introduce(name, city):\n",
          sample: "Hello, I am Ada from Enugu.\nHello, I am Musa from Kano.\nHello, I am Tola from Ibadan.",
          tests: [
            {
              check:
                'assert len(lines) >= 3, "Call introduce() three times."\n' +
                'import io, contextlib\n' +
                'buf = io.StringIO()\n' +
                'with contextlib.redirect_stdout(buf):\n' +
                '    introduce("Zara", "Jos")\n' +
                'assert buf.getvalue().strip() == "Hello, I am Zara from Jos.", "introduce(\\"Zara\\", \\"Jos\\") should print: Hello, I am Zara from Jos.  Yours: " + buf.getvalue().strip()',
            },
          ],
          solution: 'def introduce(name, city):\n    print(f"Hello, I am {name} from {city}.")\n\nintroduce("Ada", "Enugu")\nintroduce("Musa", "Kano")\nintroduce("Tola", "Ibadan")\n',
          hint: 'Inside the function: print(f"Hello, I am {name} from {city}.")',
          successMessage: "The check called your function with a person you never wrote: Zara from Jos. A function that works for any arguments is a function that is actually reusable.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 7.4 – 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l28-return-arguments",
    moduleId: "pp-m7-functions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.4", "7.5", "7.6"],
    title: "Return Values and Arguments",
    subtitle: "return versus print, keyword arguments and defaults",
    estimatedMinutes: 20,
    intro:
      "The most important idea in this module: a function can GIVE BACK a value with return, which the caller can store, calculate with or pass on. That is different from printing, and the difference is what makes functions building blocks.",

    atoms: [
      {
        id: "a-pp-return",
        title: "Return values versus printing",
        explain:
          "print() inside a function shows a value on the screen, and that is the end of it. return value sends the value back to wherever the function was called, so the caller can use it: total = add(2, 3). A function without return gives back None. return also ends the function immediately.",
        code: {
          language: PY,
          code: 'def area_print(w, h):\n    print(w * h)\n\ndef area(w, h):\n    return w * h\n\nresult = area_print(3, 4)\nprint("Stored:", result)\ntotal = area(3, 4) + area(2, 5)\nprint("Total area:", total)\n',
          expectedOutput: "12\nStored: None\nTotal area: 22",
        },
        why: "area_print showed 12 but gave back None, so it cannot be added to anything. area returned its answer, so two calls could be added together. Functions that calculate should return; leave printing to the code that calls them.",
        codeChallenge: {
          task: "Write a function circle_area(radius) that RETURNS the area of a circle (use 3.14159 × radius²). It must not print anything. Then print the total area of two circles of radius 2 and 3, rounded to 2 decimal places, by calling your function twice.",
          starter: "def circle_area(radius):\n    print(3.14159 * radius ** 2)\n",
          sample: "40.84",
          tests: [
            {
              check:
                'import io, contextlib\n' +
                'buf = io.StringIO()\n' +
                'with contextlib.redirect_stdout(buf):\n' +
                '    value = circle_area(1)\n' +
                'assert buf.getvalue() == "", "circle_area should return its answer, not print it."\n' +
                'assert value is not None and abs(value - 3.14159) < 1e-9, "circle_area(1) should return 3.14159. It returned " + repr(value)\n' +
                'assert abs(circle_area(10) - 314.159) < 1e-6, "circle_area(10) should return 314.159."\n' +
                'assert lines and lines[-1] == "40.84", "Print round(circle_area(2) + circle_area(3), 2). Yours: " + (lines[-1] if lines else "(nothing)")',
            },
          ],
          solution: "def circle_area(radius):\n    return 3.14159 * radius ** 2\n\nprint(round(circle_area(2) + circle_area(3), 2))\n",
          hint: "Replace print(...) inside the function with return .... Then outside: print(round(circle_area(2) + circle_area(3), 2)).",
          successMessage: "Because circle_area returns, its results can be added, rounded and passed on. Returning is what lets small functions combine into big programs.",
        },
      },
      {
        id: "a-pp-keyword-args",
        title: "Positional and keyword arguments",
        explain:
          "Positional arguments are matched to parameters by their order. Keyword arguments name the parameter: make_username(last=\"Obi\", first=\"Ada\"). Keywords make calls readable and order-proof, which matters when a function has several parameters of the same type. Positional arguments must come before keyword ones.",
        code: {
          language: PY,
          code: 'def transfer(sender, receiver, amount):\n    print(f"{sender} sends {amount} to {receiver}")\n\ntransfer("Ada", "Bayo", 5000)\ntransfer(amount=2000, receiver="Ada", sender="Chi")\n',
          expectedOutput: "Ada sends 5000 to Bayo\nChi sends 2000 to Ada",
        },
        codeChallenge: {
          task: "Write make_username(first, last, year) that RETURNS a username: the first name in lower case, a dot, the surname in lower case, and the last two digits of the year. make_username(\"Ada\", \"Obi\", 2009) returns ada.obi09. Then print one username created using keyword arguments in a different order from the parameters.",
          starter: "def make_username(first, last, year):\n    pass\n",
          sample: "ada.obi09",
          tests: [
            {
              check:
                'assert make_username("Ada", "Obi", 2009) == "ada.obi09", "make_username(\\"Ada\\", \\"Obi\\", 2009) should return ada.obi09. Yours: " + repr(make_username("Ada", "Obi", 2009))\n' +
                'assert make_username(year=1998, last="Bello", first="MUSA") == "musa.bello98", "Keyword arguments in any order should work. Got " + repr(make_username(year=1998, last="Bello", first="MUSA"))\n' +
                'import ast\n' +
                'kw_calls = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.Call) and getattr(n.func, "id", "") == "make_username" and n.keywords]\n' +
                'assert kw_calls, "Call make_username with keyword arguments, such as year=2009."',
            },
          ],
          solution: 'def make_username(first, last, year):\n    return first.lower() + "." + last.lower() + str(year)[-2:]\n\nprint(make_username(year=2009, last="Obi", first="Ada"))\n',
          hint: "str(year)[-2:] gives the last two characters of the year as text (Module 8 explains slicing). Use .lower() on both names.",
          successMessage: "A returning function called with keywords. The check called it with capitals and a different order, and it still worked.",
        },
      },
      {
        id: "a-pp-defaults",
        title: "Default parameters",
        explain:
          "A parameter can have a default value: def tax(amount, rate=7.5):. If the caller leaves that argument out, the default is used; if they pass one, theirs is used. Parameters with defaults must come after those without.",
        code: {
          language: PY,
          code: 'def tax(amount, rate=7.5):\n    return amount * rate / 100\n\nprint(tax(20000))\nprint(tax(20000, 10))\nprint(tax(20000, rate=5))\n',
          expectedOutput: "1500.0\n2000.0\n1000.0",
        },
        codeChallenge: {
          task: "Tax calculator. Write price_with_tax(price, rate=7.5) that returns the price plus tax at the given percentage, rounded to 2 decimal places. Then print the price with tax for 12000 at the default rate, and for 12000 at 10%.",
          starter: "# def price_with_tax(price, rate=7.5):\n",
          sample: "12900.0\n13200.0",
          tests: [
            {
              check:
                'assert price_with_tax(12000) == 12900.0, "12000 with the default 7.5% is 12900.0. Yours: " + repr(price_with_tax(12000))\n' +
                'assert price_with_tax(12000, 10) == 13200.0, "12000 at 10% is 13200.0. Yours: " + repr(price_with_tax(12000, 10))\n' +
                'assert price_with_tax(999.99, rate=5) == 1049.99, "999.99 at 5% rounds to 1049.99. Yours: " + repr(price_with_tax(999.99, rate=5))\n' +
                'assert len(lines) >= 2, "Print the two results."',
            },
          ],
          solution: "def price_with_tax(price, rate=7.5):\n    return round(price + price * rate / 100, 2)\n\nprint(price_with_tax(12000))\nprint(price_with_tax(12000, 10))\n",
          hint: "return round(price + price * rate / 100, 2). Call it once with one argument and once with two.",
          successMessage: "The common case needs one argument; the unusual case can still override the rate. Defaults make functions easy to call correctly.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 7.7 – 7.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l29-scope-docstrings",
    moduleId: "pp-m7-functions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.7", "7.8", "7.9"],
    title: "Scope, Multiple Returns and Docstrings",
    subtitle: "Where names live, returning several values, and documenting functions",
    estimatedMinutes: 18,
    intro:
      "Three ideas that make functions safe and pleasant to use: variables inside a function are private to it, a function can return several values at once, and a docstring tells other people (and VS Code) what a function does.",

    atoms: [
      {
        id: "a-pp-scope",
        title: "Scope: local and global variables",
        explain:
          "A variable created inside a function is LOCAL: it exists only while the function runs and cannot be seen outside. A variable created at the top level of the file is GLOBAL: functions can read it. Assigning to a name inside a function creates a new local name, even if a global of the same name exists. Pass values in as parameters and send results out with return, rather than relying on globals.",
        code: {
          language: PY,
          code: 'RATE = 0.075   # global, read by the function\n\ndef vat(price):\n    amount = price * RATE   # amount is local\n    return amount\n\nprint(vat(2000))\nprint(amount)\n',
          expectedOutput: "150.0",
          raises: "NameError: name 'amount' is not defined",
        },
        codeChallenge: {
          task: "This program tries to count visitors with a function, but the count always prints 0. Rewrite add_visitor so it takes the current count as a parameter and RETURNS the new count, and update the calls so the final line prints Visitors: 3.",
          starter: 'count = 0\n\ndef add_visitor():\n    count = 1\n\nadd_visitor()\nadd_visitor()\nadd_visitor()\nprint("Visitors:", count)\n',
          sample: "Visitors: 3",
          tests: [
            {
              check:
                'assert lines[-1] == "Visitors: 3", "The last line should be Visitors: 3. Yours: " + lines[-1]\n' +
                'assert add_visitor(10) == 11, "add_visitor(10) should return 11."\n' +
                'assert "global" not in source, "Solve it with a parameter and return, not the global keyword."',
            },
          ],
          solution: 'count = 0\n\ndef add_visitor(current):\n    return current + 1\n\ncount = add_visitor(count)\ncount = add_visitor(count)\ncount = add_visitor(count)\nprint("Visitors:", count)\n',
          hint: "def add_visitor(current): return current + 1. Then each call becomes count = add_visitor(count).",
          successMessage: "The starter's count = 1 created a local variable that vanished when the function ended. Values in through parameters, out through return: that keeps functions predictable.",
        },
      },
      {
        id: "a-pp-multiple-returns",
        title: "Returning several values",
        explain:
          "return a, b returns both values packed together (as a tuple, Module 9). The caller can unpack them into separate names in one line: low, high = min_max(...). The number of names must match the number of values.",
        code: {
          language: PY,
          code: 'def split_bill(total, people):\n    share = total // people\n    left_over = total % people\n    return share, left_over\n\neach, extra = split_bill(10000, 3)\nprint("Each pays", each, "and", extra, "is left over")\n',
          expectedOutput: "Each pays 3333 and 1 is left over",
        },
        codeChallenge: {
          task: "Write stats(a, b, c) that returns three values: the smallest, the largest and the average of the three numbers (use min(), max() and your own average calculation). Then unpack the result of stats(70, 45, 92) into three variables and print them on one line.",
          starter: "def stats(a, b, c):\n    pass\n",
          sample: "45 92 69.0",
          tests: [
            {
              check:
                'assert stats(70, 45, 92) == (45, 92, 69.0), "stats(70, 45, 92) should return (45, 92, 69.0). Yours: " + repr(stats(70, 45, 92))\n' +
                'assert stats(1, 2, 3) == (1, 3, 2.0), "stats(1, 2, 3) should return (1, 3, 2.0). Yours: " + repr(stats(1, 2, 3))\n' +
                'assert lines and lines[-1].split() == ["45", "92", "69.0"], "Print the three unpacked values on one line. Yours: " + (lines[-1] if lines else "(nothing)")',
            },
          ],
          solution: "def stats(a, b, c):\n    return min(a, b, c), max(a, b, c), (a + b + c) / 3\n\nlow, high, average = stats(70, 45, 92)\nprint(low, high, average)\n",
          hint: "return min(a, b, c), max(a, b, c), (a + b + c) / 3 then low, high, average = stats(70, 45, 92).",
          successMessage: "One call, three results, unpacked into well-named variables. You will meet this pattern constantly with built-in functions too.",
        },
      },
      {
        id: "a-pp-docstrings",
        title: "Docstrings and function naming",
        explain:
          "A docstring is a string on the first line inside a function, in triple quotes, describing what it does, its parameters and what it returns. VS Code shows it when you hover over a call, and help(function) prints it. Name functions with verbs in snake_case that say what they do: calculate_grade, not cg or grade_stuff.",
        code: {
          language: PY,
          code: 'def bmi(weight_kg, height_m):\n    """Return the body mass index for a weight in kg and a height in metres."""\n    return round(weight_kg / height_m ** 2, 1)\n\nprint(bmi(70, 1.75))\nprint(bmi.__doc__)\n',
          expectedOutput: "22.9\nReturn the body mass index for a weight in kg and a height in metres.",
        },
        codeChallenge: {
          task: "Write a well-named function, convert_to_kobo(naira), with a docstring that mentions kobo, that returns the amount in kobo as a whole number (1 naira = 100 kobo; round to the nearest kobo). Print convert_to_kobo(12.5).",
          starter: "def convert_to_kobo(naira):\n    return naira * 100\n",
          sample: "1250",
          tests: [
            {
              check:
                'assert convert_to_kobo.__doc__ and "kobo" in convert_to_kobo.__doc__.lower(), "Add a docstring in triple quotes on the first line of the function that mentions kobo."\n' +
                'assert convert_to_kobo(12.5) == 1250 and type(convert_to_kobo(12.5)) is int, "convert_to_kobo(12.5) should return the int 1250."\n' +
                'assert convert_to_kobo(0.29) == 29, "convert_to_kobo(0.29) should be 29 (round it: 0.29 * 100 is 28.999999999999996)."\n' +
                'assert lines and lines[-1] == "1250", "Print convert_to_kobo(12.5)."',
            },
          ],
          solution: 'def convert_to_kobo(naira):\n    """Return the amount in kobo, as a whole number, for an amount in naira."""\n    return round(naira * 100)\n\nprint(convert_to_kobo(12.5))\n',
          hint: "Add \"\"\"...\"\"\" as the first line of the body. round(naira * 100) gives a whole number and fixes the float precision problem from Module 4.",
          successMessage: "Documented, well named, and correct even for 0.29, where plain multiplication goes wrong. Storing money as whole kobo is how real payment systems avoid float errors.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 7.10 – 7.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l30-decompose-recursion",
    moduleId: "pp-m7-functions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.10", "7.11"],
    title: "Decomposition and Recursion",
    subtitle: "Building a program from small functions, and functions that call themselves",
    estimatedMinutes: 20,
    intro:
      "Decomposition from Module 1 now has a tool: each small piece becomes a function. And one special case is a function that solves a problem by calling itself on a smaller version of the same problem: recursion.",

    atoms: [
      {
        id: "a-pp-decompose-functions",
        title: "Decomposing a problem into small functions",
        explain:
          "Break the program into tasks, and make each task a function that does one thing, takes what it needs as parameters and returns its result. Then a short main section calls them in order. Each function can be tested on its own, and the main section reads like the algorithm.",
        code: {
          language: PY,
          code: 'def get_average(a, b, c):\n    return (a + b + c) / 3\n\ndef get_grade(average):\n    if average >= 70:\n        return "A"\n    elif average >= 50:\n        return "C"\n    return "F"\n\ndef report(name, a, b, c):\n    avg = get_average(a, b, c)\n    return f"{name}: {avg:.1f} ({get_grade(avg)})"\n\nprint(report("Ada", 80, 75, 90))\nprint(report("Bayo", 40, 55, 50))\n',
          expectedOutput: "Ada: 81.7 (A)\nBayo: 48.3 (F)",
        },
        codeChallenge: {
          task: "A reusable grading system. Write three functions: grade(score) returning A (70+), B (60–69), C (50–59), D (45–49), E (40–44) or F; remark(letter) returning Excellent for A, Good for B or C, Fair for D or E, and Fail for F; and result_line(name, score) returning a string like Ada: 72 A Excellent. result_line must use the other two functions. Print result_line for two students.",
          starter: "def grade(score):\n    pass\n\ndef remark(letter):\n    pass\n\ndef result_line(name, score):\n    pass\n",
          sample: "Ada: 72 A Excellent\nBayo: 47 D Fair",
          tests: [
            {
              check:
                'cases = {85: "A", 70: "A", 69: "B", 60: "B", 59: "C", 50: "C", 49: "D", 45: "D", 44: "E", 40: "E", 39: "F", 0: "F"}\n' +
                'for s, g in cases.items():\n' +
                '    assert grade(s) == g, f"grade({s}) should be {g}, got {grade(s)!r}"\n' +
                'for g, r in {"A": "Excellent", "B": "Good", "C": "Good", "D": "Fair", "E": "Fair", "F": "Fail"}.items():\n' +
                '    assert remark(g) == r, f"remark({g!r}) should be {r}, got {remark(g)!r}"\n' +
                'assert result_line("Ada", 72) == "Ada: 72 A Excellent", "result_line(\\"Ada\\", 72) should return Ada: 72 A Excellent. Got " + repr(result_line("Ada", 72))\n' +
                'import ast\n' +
                'fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "result_line"][0]\n' +
                'names = {c.func.id for c in ast.walk(fn) if isinstance(c, ast.Call) and isinstance(c.func, ast.Name)}\n' +
                'assert {"grade", "remark"} <= names, "result_line should call grade() and remark() rather than repeating their logic."\n' +
                'assert len(lines) >= 2, "Print result_line for two students."',
            },
          ],
          solution: 'def grade(score):\n    if score >= 70:\n        return "A"\n    elif score >= 60:\n        return "B"\n    elif score >= 50:\n        return "C"\n    elif score >= 45:\n        return "D"\n    elif score >= 40:\n        return "E"\n    return "F"\n\ndef remark(letter):\n    if letter == "A":\n        return "Excellent"\n    elif letter in "BC":\n        return "Good"\n    elif letter in "DE":\n        return "Fair"\n    return "Fail"\n\ndef result_line(name, score):\n    letter = grade(score)\n    return f"{name}: {score} {letter} {remark(letter)}"\n\nprint(result_line("Ada", 72))\nprint(result_line("Bayo", 47))\n',
          hint: "Write and test grade() first, then remark(), then result_line() which calls both.",
          successMessage: "Three small, separately tested functions combined into one. Every boundary of the grading rules was checked. This is the structure you will use for the Phase 2 project.",
        },
      },
      {
        id: "a-pp-recursion",
        title: "Basic recursion",
        explain:
          "A recursive function calls itself on a smaller version of the problem. It needs a BASE CASE, a version small enough to answer directly, which stops the calls. Every other call must move closer to the base case. Without a base case it recurses until Python raises RecursionError.",
        code: {
          language: PY,
          code: 'def countdown(n):\n    if n == 0:          # base case\n        print("Go!")\n        return\n    print(n)\n    countdown(n - 1)    # smaller problem\n\ncountdown(3)\n',
          expectedOutput: "3\n2\n1\nGo!",
        },
        why: "Factorial is naturally recursive: 5! = 5 × 4!, and 0! = 1 is the base case. Loops can do everything recursion can, but some problems, such as walking a tree of folders (Module 16), are far clearer recursively.",
        codeChallenge: {
          task: "Write a recursive function sum_to(n) that returns 1 + 2 + … + n, with sum_to(0) returning 0. It must call itself and must not use a loop.",
          starter: "def sum_to(n):\n    pass\n",
          sample: "sum_to(4) → 10",
          tests: [
            {
              check:
                'assert sum_to(0) == 0, "sum_to(0) should return 0 (the base case)."\n' +
                'assert sum_to(1) == 1 and sum_to(4) == 10 and sum_to(100) == 5050, "sum_to(4) should be 10 and sum_to(100) 5050. Got " + repr(sum_to(4)) + " and " + repr(sum_to(100))\n' +
                'import ast\n' +
                'fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "sum_to"][0]\n' +
                'assert any(isinstance(c, ast.Call) and getattr(c.func, "id", "") == "sum_to" for c in ast.walk(fn)), "sum_to must call itself."\n' +
                'assert not any(isinstance(c, (ast.For, ast.While)) for c in ast.walk(fn)), "Do not use a loop: use recursion."',
            },
          ],
          solution: "def sum_to(n):\n    if n == 0:\n        return 0\n    return n + sum_to(n - 1)\n",
          hint: "Base case: if n == 0: return 0. Otherwise: return n + sum_to(n - 1).",
          successMessage: "A base case and a smaller step: that is every recursive function. sum_to(100) made 101 calls, each one waiting for the next to answer.",
        },
      },
    ],

    task: {
      title: "Module 7 practice: four reusable function sets",
      intro:
        "Write each set in its own file, with a docstring on every function and a short main section that demonstrates it. The milestone is to organise a program into reusable, understandable components.",
      prompts: [
        "Calculator functions: add, subtract, multiply and divide, each returning a value; divide returns None if the divisor is 0.",
        "Reusable grading system: grade(score), remark(letter) and report_card(name, s1, s2, s3) built from them.",
        "Tax calculator: income_tax(income) using at least three bands, and net_pay(income) that calls it.",
        "Geometric areas: rectangle_area, triangle_area, circle_area and trapezium_area, plus total_area that adds any two of them.",
        "Write one recursive function of your choice (power(base, exp), or counting digits in a number) and trace it by hand for a small input.",
      ],
      closing: "Next: strings in depth, the type you will use most for real-world data.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
