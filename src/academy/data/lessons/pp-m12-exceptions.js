/**
 * PYTHON PROGRAMMING · MODULE 12 · EXCEPTIONS, DEBUGGING AND INPUT VALIDATION
 *
 * Curriculum 12.1 – 12.10. The kinds of error, reading tracebacks, try /
 * except / else / finally, the common exceptions, raising and defining
 * exceptions, defensive programming, the debugger, assertions, and input that
 * cannot crash a program. The practice project is hardening the Phase 2
 * Student Management System.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s12-exceptions";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 12.1 – 12.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l50-errors-tracebacks",
    moduleId: "pp-m12-exceptions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2"],
    title: "Kinds of Error, and Reading Tracebacks",
    subtitle: "Syntax, runtime and logical errors, and what Python is telling you",
    estimatedMinutes: 18,
    intro:
      "You have met errors since Module 2. Now they get a system: three kinds of error that need three different approaches, and a methodical way to read the traceback Python prints when something fails.",

    atoms: [
      {
        id: "a-pp-error-kinds",
        title: "Syntax, runtime and logical errors",
        explain:
          "A SYNTAX error breaks the grammar; Python refuses to run the file at all. A RUNTIME error (an exception) happens while running: the grammar is fine but an operation fails, such as int(\"abc\") or dividing by zero. A LOGICAL error produces no message at all: the program runs and gives the wrong answer. Logical errors are the hardest, because only testing finds them.",
        table: {
          caption: "The three kinds of error.",
          headers: ["Kind", "When it shows", "Example", "How you find it"],
          rows: [
            ["Syntax", "Before anything runs", "print(\"Hi\"", "Python points at the line"],
            ["Runtime (exception)", "When the line runs", "int(\"abc\") → ValueError", "The traceback names it"],
            ["Logical", "Never, as a message", "average = a + b / 2", "Tests with known answers"],
          ],
        },
        codeChallenge: {
          task: "This function has no syntax or runtime error, but gives wrong answers: it should return the percentage of students who passed (score 50 or more), rounded to 1 decimal place. Find and fix the logical errors.",
          starter: "def pass_rate(scores):\n    passed = 0\n    for s in scores:\n        if s > 50:\n            passed += 1\n    return round(passed / len(scores) * 10, 1)\n",
          sample: "pass_rate([50, 40, 70, 90]) → 75.0",
          tests: [
            {
              check:
                'assert pass_rate([50, 40, 70, 90]) == 75.0, "3 of 4 passed (50 counts): 75.0. Got " + repr(pass_rate([50, 40, 70, 90]))\n' +
                'assert pass_rate([10, 20, 30]) == 0.0, "No passes: 0.0."\n' +
                'assert pass_rate([55, 45, 65]) == 66.7, "2 of 3: 66.7. Got " + repr(pass_rate([55, 45, 65]))',
            },
          ],
          solution: "def pass_rate(scores):\n    passed = 0\n    for s in scores:\n        if s >= 50:\n            passed += 1\n    return round(passed / len(scores) * 100, 1)\n",
          hint: "Two bugs: a boundary (is 50 a pass?) and the percentage multiplier.",
          successMessage: "Neither bug produced an error message. Only a test with a known answer exposed them, which is why Module 17 is all about testing.",
        },
      },
      {
        id: "a-pp-tracebacks",
        title: "Reading Python tracebacks",
        explain:
          "A traceback lists the chain of calls that led to the error, OLDEST first and the failing line LAST. Read it from the bottom: the last line names the exception and its message; the line above it is where it happened; going upwards shows which call led there. Usually the bug is in your own file nearest the bottom, not inside Python's libraries.",
        example:
          "Traceback (most recent call last):\n  File \"report.py\", line 12, in <module>\n    print(average_of(scores))\n  File \"report.py\", line 5, in average_of\n    return total / count\n           ~~~~~~^~~~~~~\nZeroDivisionError: division by zero\n\nRead upwards:\n  1. What:  ZeroDivisionError, division by zero\n  2. Where: line 5, inside average_of, total / count\n  3. How we got there: line 12 called average_of(scores)\n  → so scores was empty, and count was 0.",
        decision: {
          scenario: "A traceback's last three lines are:\n\n  File \"shop.py\", line 18, in add_to_cart\n    price = prices[item]\nKeyError: 'yam'",
          question: "What is the most useful conclusion?",
          options: [
            {
              id: "a",
              text: "On line 18, the prices dictionary has no key 'yam'; either the item is missing from prices or the name is spelled or capitalised differently",
              why: "The last line names the exception and the missing key; the line above shows exactly where the lookup happened.",
            },
            {
              id: "b",
              text: "Python's dictionary feature is broken",
              whyWrong: "KeyError is Python correctly reporting a lookup of a key that does not exist.",
            },
            {
              id: "c",
              text: "The problem is on line 1 of the file",
              whyWrong: "The traceback points to line 18; start there.",
            },
            {
              id: "d",
              text: "The variable item is not defined",
              whyWrong: "That would be a NameError. item exists; its value 'yam' is not a key.",
            },
          ],
          correct: "a",
          aftermath: "What, where, how you got there: bottom line, line above, then upwards. That order solves most tracebacks in under a minute.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 12.3 – 12.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l51-try-except",
    moduleId: "pp-m12-exceptions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.3", "12.4"],
    title: "Handling Exceptions: try and except",
    subtitle: "try, except, else, finally, and the exceptions you will meet most",
    estimatedMinutes: 22,
    intro:
      "Some failures are not bugs but facts of life: a user types a word where a number belongs, a file is missing, a key is absent. try and except let your program expect them and respond sensibly instead of crashing.",

    atoms: [
      {
        id: "a-pp-try-except",
        title: "try, except, else and finally",
        explain:
          "Code that might fail goes in try:. If an exception happens there, Python jumps to the matching except block and the program carries on. else: runs only if NO exception happened. finally: runs in every case, for clean-up. Catch specific exceptions (except ValueError:), never a bare except:, which also hides real bugs. except ValueError as e: gives you the error object to report.",
        code: {
          language: PY,
          code: 'for text in ["42", "forty"]:\n    try:\n        n = int(text)\n    except ValueError as e:\n        print("Bad number:", e)\n    else:\n        print("Doubled:", n * 2)\n    finally:\n        print("Checked", repr(text))\n',
          expectedOutput: "Doubled: 84\nChecked '42'\nBad number: invalid literal for int() with base 10: 'forty'\nChecked 'forty'",
        },
        codeChallenge: {
          task: "Write read_int(prompt) that keeps asking with input(prompt) until the user types a whole number, printing Please enter a whole number after each bad answer, and then returns the number. Then use it to ask Age: and print Next year you will be N.",
          starter: "def read_int(prompt):\n    return int(input(prompt))\n",
          sample: "Age: seventeen\nPlease enter a whole number\nAge: 17.5\nPlease enter a whole number\nAge: 17\nNext year you will be 18",
          tests: [
            {
              inputs: ["seventeen", "17.5", "17"],
              check:
                'assert lines.count("Please enter a whole number") == 2, "Each bad answer should print Please enter a whole number."\n' +
                'assert lines[-1] == "Next year you will be 18", "Yours: " + lines[-1]',
            },
            {
              inputs: ["5"],
              check: 'assert lines == ["Age: 5", "Next year you will be 6"], "A good first answer needs no retry. Yours: " + repr(lines)\nassert "except ValueError" in source, "Catch ValueError specifically."',
            },
          ],
          solution: 'def read_int(prompt):\n    while True:\n        try:\n            return int(input(prompt))\n        except ValueError:\n            print("Please enter a whole number")\n\nage = read_int("Age: ")\nprint("Next year you will be", age + 1)\n',
          hint: "while True: try: return int(input(prompt)) except ValueError: print the message. The return ends the loop when the conversion works.",
          successMessage: "This little function removes the most common crash in every program you have written. You will reuse it constantly.",
        },
      },
      {
        id: "a-pp-common-exceptions",
        title: "ValueError, TypeError, KeyError and FileNotFoundError",
        explain:
          "ValueError: the right type with an unusable value (int(\"abc\")). TypeError: the wrong type for the operation (\"a\" + 1). KeyError: a dictionary key that does not exist. FileNotFoundError: opening a file for reading that is not there. Also common: IndexError (list index out of range) and ZeroDivisionError. One except can catch several: except (ValueError, ZeroDivisionError):.",
        code: {
          language: PY,
          code: 'prices = {"rice": 900}\ntests = [lambda: int("x"), lambda: "a" + 1, lambda: prices["yam"], lambda: open("nope.txt"), lambda: [1][5]]\nfor t in tests:\n    try:\n        t()\n    except Exception as e:\n        print(type(e).__name__)\n',
          expectedOutput: "ValueError\nTypeError\nKeyError\nFileNotFoundError\nIndexError",
        },
        codeChallenge: {
          task: "Write two safe functions. get_price(prices, item) returns prices[item], or prints No price for ITEM and returns None if the key is missing (catch KeyError). read_lines(path) returns the list of stripped lines of a text file, or an empty list if the file does not exist (catch FileNotFoundError).",
          starter: "def get_price(prices, item):\n    return prices[item]\n\ndef read_lines(path):\n    with open(path, encoding=\"utf-8\") as f:\n        return [l.strip() for l in f]\n",
          sample: "get_price({\"rice\": 900}, \"yam\") prints No price for yam and returns None",
          tests: [
            {
              files: { "menu.txt": "rice\nbeans\n" },
              check:
                'assert get_price({"rice": 900}, "rice") == 900, "A known item returns its price."\n' +
                'import io, contextlib\n' +
                'buf = io.StringIO()\n' +
                'with contextlib.redirect_stdout(buf):\n' +
                '    r = get_price({"rice": 900}, "yam")\n' +
                'assert r is None and buf.getvalue().strip() == "No price for yam", "A missing item prints No price for yam and returns None."\n' +
                'assert read_lines("menu.txt") == ["rice", "beans"], "read_lines should return the stripped lines."\n' +
                'assert read_lines("missing.txt") == [], "A missing file returns an empty list."\n' +
                'assert "except KeyError" in source and "except FileNotFoundError" in source, "Catch KeyError and FileNotFoundError specifically."',
            },
          ],
          solution: 'def get_price(prices, item):\n    try:\n        return prices[item]\n    except KeyError:\n        print("No price for", item)\n        return None\n\ndef read_lines(path):\n    try:\n        with open(path, encoding="utf-8") as f:\n            return [l.strip() for l in f]\n    except FileNotFoundError:\n        return []\n',
          hint: "Wrap the risky line in try: and handle exactly the exception it can raise.",
          successMessage: "Expected failures handled precisely, while any unexpected error would still be reported. That precision is the difference between robust and merely silent.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 12.5 – 12.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l52-raise-custom",
    moduleId: "pp-m12-exceptions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.5", "12.6", "12.7"],
    title: "Raising and Defining Exceptions",
    subtitle: "raise, custom exception classes and defensive programming",
    estimatedMinutes: 22,
    intro:
      "Your own functions can signal failure too. Instead of returning a strange value or printing a message from deep inside, a function can raise an exception that the caller decides how to handle. That keeps responsibilities clear: the function detects the problem; the caller chooses the response.",

    atoms: [
      {
        id: "a-pp-raise",
        title: "Raising exceptions with raise",
        explain:
          "raise ValueError(\"message\") stops the function immediately and sends the exception up to the caller, exactly like a built-in error. Raise when a function is given something it cannot sensibly handle. Choose the closest built-in type: ValueError for bad values, TypeError for wrong types. Write a message that says what was wrong.",
        code: {
          language: PY,
          code: 'def set_score(score):\n    if not 0 <= score <= 100:\n        raise ValueError(f"score must be 0-100, got {score}")\n    return score\n\nprint(set_score(75))\ntry:\n    set_score(120)\nexcept ValueError as e:\n    print("Rejected:", e)\n',
          expectedOutput: "75\nRejected: score must be 0-100, got 120",
        },
        codeChallenge: {
          task: "Write withdraw(balance, amount) that returns the new balance. It must raise ValueError(\"amount must be positive\") if amount is 0 or less, and ValueError(\"insufficient funds\") if amount is more than balance.",
          starter: "def withdraw(balance, amount):\n    return balance - amount\n",
          sample: "withdraw(5000, 2000) → 3000",
          tests: [
            {
              check:
                'assert withdraw(5000, 2000) == 3000 and withdraw(5000, 5000) == 0, "Valid withdrawals return the new balance (withdrawing everything is allowed)."\n' +
                'for amount, msg in [(0, "amount must be positive"), (-50, "amount must be positive"), (6000, "insufficient funds")]:\n' +
                '    try:\n' +
                '        withdraw(5000, amount)\n' +
                '    except ValueError as e:\n' +
                '        assert str(e) == msg, f"withdraw(5000, {amount}) should raise ValueError({msg!r}), got {str(e)!r}"\n' +
                '    else:\n' +
                '        assert False, f"withdraw(5000, {amount}) should raise ValueError"',
            },
          ],
          solution: 'def withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError("amount must be positive")\n    if amount > balance:\n        raise ValueError("insufficient funds")\n    return balance - amount\n',
          hint: "Check the bad cases first and raise; only the last line does the subtraction.",
          successMessage: "The function refuses impossible requests loudly instead of producing a negative balance quietly. Silent wrong answers are far more dangerous than errors.",
        },
      },
      {
        id: "a-pp-custom-exceptions",
        title: "Creating custom exception classes",
        explain:
          "A custom exception is a class that inherits from Exception: class InsufficientFundsError(Exception): pass. (Classes are Module 13; this is all you need for now.) A specific name lets callers catch exactly that failure, and makes tracebacks self-explanatory. Name them ending in Error.",
        code: {
          language: PY,
          code: 'class OutOfStockError(Exception):\n    pass\n\ndef sell(stock, item):\n    if stock.get(item, 0) == 0:\n        raise OutOfStockError(f"{item} is out of stock")\n    stock[item] -= 1\n\nstock = {"rice": 1}\nsell(stock, "rice")\ntry:\n    sell(stock, "rice")\nexcept OutOfStockError as e:\n    print("Sorry:", e)\n',
          expectedOutput: "Sorry: rice is out of stock",
        },
        codeChallenge: {
          task: "Define class InsufficientFundsError(Exception). Rewrite transfer(accounts, sender, receiver, amount) so it raises InsufficientFundsError(\"SENDER cannot send AMOUNT\") when the sender's balance is too small, and KeyError for an unknown account (accessing accounts[name] does that for you). On success, move the money and return the sender's new balance.",
          starter: "def transfer(accounts, sender, receiver, amount):\n    accounts[sender] -= amount\n    accounts[receiver] += amount\n    return accounts[sender]\n",
          sample: "transfer({\"Ada\": 5000, \"Bo\": 0}, \"Ada\", \"Bo\", 9000) raises InsufficientFundsError('Ada cannot send 9000')",
          tests: [
            {
              check:
                'assert issubclass(InsufficientFundsError, Exception), "Define InsufficientFundsError as a subclass of Exception."\n' +
                'acc = {"Ada": 5000, "Bo": 0}\n' +
                'assert transfer(acc, "Ada", "Bo", 2000) == 3000 and acc == {"Ada": 3000, "Bo": 2000}, "A valid transfer moves the money. Accounts: " + repr(acc)\n' +
                'try:\n' +
                '    transfer(acc, "Ada", "Bo", 9000)\n' +
                '    assert False, "Sending more than the balance should raise InsufficientFundsError."\n' +
                'except InsufficientFundsError as e:\n' +
                '    assert str(e) == "Ada cannot send 9000", "Message should be: Ada cannot send 9000. Got " + repr(str(e))\n' +
                'assert acc == {"Ada": 3000, "Bo": 2000}, "A failed transfer must not change any balance. Accounts: " + repr(acc)\n' +
                'try:\n' +
                '    transfer(acc, "Zed", "Bo", 1)\n' +
                '    assert False, "An unknown sender should raise KeyError."\n' +
                'except KeyError:\n' +
                '    pass',
            },
          ],
          solution: 'class InsufficientFundsError(Exception):\n    pass\n\ndef transfer(accounts, sender, receiver, amount):\n    if accounts[sender] < amount:\n        raise InsufficientFundsError(f"{sender} cannot send {amount}")\n    accounts[receiver]  # raises KeyError for an unknown receiver before anything changes\n    accounts[sender] -= amount\n    accounts[receiver] += amount\n    return accounts[sender]\n',
          hint: "Check the balance and raise BEFORE changing anything, so a failed transfer leaves both accounts untouched.",
          successMessage: "A named failure, raised before any change is made. \"Check everything, then act\" is how real payment systems avoid half-finished transfers.",
        },
      },
      {
        id: "a-pp-defensive",
        title: "Defensive programming",
        explain:
          "Defensive programming means assuming inputs can be wrong and checking them at the boundaries of your program: user input, files, data from other systems. Validate early, fail with a clear message, never let bad data travel deep into the program, and handle only the exceptions you can genuinely deal with; let the rest surface.",
        decision: {
          scenario: "A colleague wraps their entire program in try: ... except: pass so that \"users never see errors\".",
          question: "What is the problem?",
          options: [
            {
              id: "a",
              text: "Every failure, including real bugs, is silently swallowed, so the program can quietly produce wrong results and nobody can find out why",
              why: "A bare except with pass hides everything: bugs, typos, missing files. The program appears to work while doing the wrong thing.",
            },
            {
              id: "b",
              text: "Nothing; users should never see errors",
              whyWrong: "Users should see clear, helpful messages for expected problems. Hiding unexpected ones makes them impossible to fix.",
            },
            {
              id: "c",
              text: "try cannot contain a whole program",
              whyWrong: "It can; the issue is what the empty except does.",
            },
            {
              id: "d",
              text: "It makes the program slower",
              whyWrong: "Performance is not the concern; correctness and debuggability are.",
            },
          ],
          correct: "a",
          aftermath: "Catch specific exceptions you can handle, with a useful response. Let everything else fail loudly where you will notice it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 12.8 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l53-debug-validate",
    moduleId: "pp-m12-exceptions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.8", "12.9", "12.10"],
    title: "The Debugger, Assertions and Bad Input",
    subtitle: "Breakpoints in VS Code, assert, and input that cannot crash your program",
    estimatedMinutes: 22,
    intro:
      "print() debugging takes you far, but a debugger lets you pause a program and look at everything. Assertions catch your own mistakes early. And the module ends by making the Student Management System survive anything a user types.",

    atoms: [
      {
        id: "a-pp-vscode-debugger",
        title: "Debugging with breakpoints in VS Code",
        explain:
          "Click in the margin to the left of a line number to set a red breakpoint dot, then press F5 (Run → Start Debugging) and choose Python File. The program runs until it reaches the breakpoint and pauses. The VARIABLES panel shows every variable's current value. Step Over (F10) runs one line; Step Into (F11) goes inside a function call; Continue (F5) runs to the next breakpoint. Watch expressions show any expression as you step.",
        example:
          "Debugging a wrong total:\n\n  1. Set a breakpoint on the line inside the loop: total += price\n  2. F5 to start; it pauses on the first pass\n  3. In VARIABLES, check price and total\n  4. F10 to step, watching total change each pass\n  5. Spot the pass where total jumps wrongly; that item is the bug",
        decision: {
          scenario: "A loop over 500 records gives a wrong total. You suspect one record with a strange price.",
          question: "Which debugger feature finds it fastest?",
          options: [
            {
              id: "a",
              text: "A conditional breakpoint (right-click the dot → Edit Breakpoint) that pauses only when price < 0 or price > 1000000",
              why: "It pauses exactly at the suspicious record instead of making you step through 500 passes by hand.",
            },
            {
              id: "b",
              text: "Step Over 500 times and watch every value",
              whyWrong: "It works, but it is slow and easy to miss the moment it goes wrong.",
            },
            {
              id: "c",
              text: "Restart the computer",
              whyWrong: "Restarting changes nothing about the program's logic.",
            },
            {
              id: "d",
              text: "Delete the loop",
              whyWrong: "That removes the feature rather than fixing it.",
            },
          ],
          correct: "a",
          aftermath: "Breakpoints, stepping, and the variables panel: ten minutes of practice with them saves hours of guessing.",
        },
      },
      {
        id: "a-pp-assertions",
        title: "Assertions and validation rules",
        explain:
          "assert condition, \"message\" raises AssertionError if the condition is False. Assertions check things that must be true if YOUR code is correct (an average between 0 and 100, a list that should never be empty here). They are for catching programmer mistakes, not for validating user input: Python can be run with assertions switched off (python -O), so input checks must use if and raise.",
        code: {
          language: PY,
          code: 'def average(scores):\n    assert len(scores) > 0, "average() needs at least one score"\n    result = sum(scores) / len(scores)\n    assert 0 <= result <= 100, f"impossible average {result}"\n    return result\n\nprint(average([60, 80]))\nprint(average([]))\n',
          expectedOutput: "70.0",
          raises: "AssertionError: average() needs at least one score",
        },
      },
      {
        id: "a-pp-unexpected-input",
        title: "Handling unexpected user input",
        explain:
          "Users type blank lines, words, numbers out of range, extra spaces and things you never imagined. A robust input function strips the text, converts it inside try, checks the rules, and loops until the answer is acceptable, telling the user exactly what was wrong each time. Put this in one function and every part of the program benefits.",
        codeChallenge: {
          task: "Harden the Student Management System's score entry. Write read_scores(prompt) that asks for scores on one line separated by spaces and keeps asking until every one is a whole number from 0 to 100 and there is at least one. Print Enter at least one score for a blank line, Not a number: X for the first bad token X, and Out of range: N for the first score outside 0–100. Return the list of ints. Then print the result of read_scores(\"Scores: \").",
          starter: "def read_scores(prompt):\n    return [int(x) for x in input(prompt).split()]\n",
          sample: "Scores: \nEnter at least one score\nScores: 70 eighty 90\nNot a number: eighty\nScores: 70 180\nOut of range: 180\nScores:  70 80 90 \n[70, 80, 90]",
          tests: [
            {
              inputs: ["", "70 eighty 90", "70 180", "-5", " 70 80 90 "],
              check:
                'assert "Enter at least one score" in lines, "A blank answer should print Enter at least one score."\n' +
                'assert "Not a number: eighty" in lines, "Report the first bad token: Not a number: eighty."\n' +
                'assert "Out of range: 180" in lines and "Out of range: -5" in lines, "Report scores outside 0–100."\n' +
                'assert lines[-1] == "[70, 80, 90]", "Finally return [70, 80, 90]. Yours: " + lines[-1]',
            },
            {
              inputs: ["0 100"],
              check: 'assert lines[-1] == "[0, 100]", "0 and 100 are both valid. Yours: " + lines[-1]',
            },
          ],
          solution: 'def read_scores(prompt):\n    while True:\n        parts = input(prompt).split()\n        if not parts:\n            print("Enter at least one score")\n            continue\n        scores = []\n        problem = False\n        for p in parts:\n            try:\n                n = int(p)\n            except ValueError:\n                print("Not a number:", p)\n                problem = True\n                break\n            if not 0 <= n <= 100:\n                print("Out of range:", n)\n                problem = True\n                break\n            scores.append(n)\n        if not problem:\n            return scores\n\nprint(read_scores("Scores: "))\n',
          hint: "Loop forever. For each attempt: split; if empty, message and continue. Check each part with try/int and a range test; on the first problem, print and try again. Return only when every part is good.",
          successMessage: "Blank lines, words, negative and huge numbers: none of them can crash it now. Swap this into your Phase 2 system and it becomes genuinely robust, the milestone for this module.",
        },
      },
    ],

    task: {
      title: "Module 12 practice: harden the Student Management System",
      intro: "Take your Phase 2 project (now saving to JSON from Module 11) and make it impossible to crash. The milestone is to diagnose errors and make programs fail gracefully.",
      prompts: [
        "Replace every int(input(...)) with a validated input function that loops until the answer is acceptable.",
        "If students.json is missing, start empty; if it contains invalid JSON (json.JSONDecodeError), warn the user, back it up and start empty.",
        "Make add, update and delete raise or report clear errors for duplicates and unknown names, with a custom StudentNotFoundError.",
        "Use the VS Code debugger to step through one full add-then-display cycle, and take a screenshot of the Variables panel.",
        "Write a list of ten nasty inputs (blank, spaces, words, negative numbers, huge numbers, a name with an emoji) and confirm the program survives each one.",
      ],
      closing: "Next: object-oriented programming, a new way to organise programs around the things they model.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
