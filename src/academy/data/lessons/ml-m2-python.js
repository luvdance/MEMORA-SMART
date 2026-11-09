/**
 * MACHINE LEARNING AND AI · MODULE 2 · PYTHON PROGRAMMING FOR MACHINE LEARNING
 *
 * Curriculum 2.1 – 2.15. The Python a machine learning engineer uses every
 * day, taught on data-shaped problems (scores, prices, records, CSV files)
 * so that every construct is met in the form Months 2 to 5 will use it.
 * Learners who already program can move quickly; complete beginners get
 * everything they need here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "ml-s2-python";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l5-python-basics",
    moduleId: "ml-m2-python",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "Python, Variables, Types and Operators",
    subtitle: "Why ML is written in Python, and the values every program is made of",
    estimatedMinutes: 30,
    intro:
      "Python is the language of machine learning: NumPy, pandas, scikit-learn, PyTorch and TensorFlow are all Python libraries. This lesson starts from zero, and every program runs right here in the page.",

    atoms: [
      {
        id: "a-ml-intro-python",
        title: "Introduction to Python",
        explain:
          "Python is a high-level, interpreted language created by Guido van Rossum in 1991. INTERPRETED means you run the source directly, line by line, with no separate compile step, which makes it ideal for the experiment-and-look style of data work. Python became the language of ML because its syntax is readable, and because the heavy numerical work happens in fast C and CUDA code underneath libraries like NumPy and PyTorch, so you get readability AND speed. A Python program is a sequence of statements; print() displays a value; # starts a comment that Python ignores.",
        codeExercise: {
          language: PY,
          code: py`# A first program: Python reads top to bottom.
print("Machine learning")
print(2026 - 1991, "years of Python")
print("Data" + " " + "science")
`,
          question: "What does this program print?",
          expectedOutput: "Machine learning\n35 years of Python\nData science",
          hint: "print() with several arguments separates them with a space. + joins strings.",
          successMessage: "print with commas inserts spaces; + on strings joins them exactly.",
        },
      },
      {
        id: "a-ml-variables-types",
        title: "Variables and data types",
        explain:
          "A VARIABLE is a name that refers to a value: price = 45000. Python works out the TYPE from the value. The core types are int (whole numbers: 3), float (decimals: 3.5), str (text: \"Lagos\"), bool (True or False) and None (no value). type(x) tells you a value's type, and int(), float(), str() and bool() convert between types. Conversion matters constantly in data work: numbers read from a file arrive as strings, and \"45\" + \"5\" is \"455\", not 50. Names are case-sensitive and by convention written in snake_case: house_price, not HousePrice.",
        codeExercise: {
          language: PY,
          code: py`rooms = "3"
size = 120.0
print(type(rooms).__name__, type(size).__name__)
print(rooms + "1")
print(int(rooms) + 1)
print(int(size) // 7, size / 8)
print(bool(0), bool("0"))
`,
          question: "Work through each line. What does it print?",
          expectedOutput: "str float\n31\n4\n17 15.0\nFalse True",
          hint: "\"3\" + \"1\" joins text. // is whole-number division. bool of any non-empty string is True, even \"0\".",
          successMessage: "Strings from files must be converted before arithmetic, and bool(\"0\") is True: a classic data-cleaning trap.",
        },
      },
      {
        id: "a-ml-operators",
        title: "Operators and expressions",
        explain:
          "ARITHMETIC operators: + − * /, // (floor division), % (remainder), ** (power). / always returns a float. COMPARISON operators (== != < > <= >=) return bools. LOGICAL operators and, or, not combine bools. An EXPRESSION combines values and operators into one value, following precedence: ** first, then * / // %, then + −, then comparisons, then not, and, or. Use parentheses whenever the order is not obvious. The loan formula below, which every bank uses, is a single expression: payment = P × r(1 + r)ⁿ / ((1 + r)ⁿ − 1), with r the MONTHLY rate.",
        codeChallenge: {
          task:
            "Write monthly_payment(principal, annual_rate, months) that returns the fixed monthly repayment of a loan, rounded to 2 decimal places: payment = P × r × (1 + r)**n / ((1 + r)**n − 1), where r = annual_rate / 12 / 100 (annual_rate is a percentage like 24) and n = months. If annual_rate is 0, return principal / months rounded to 2 places.",
          starter: "def monthly_payment(principal, annual_rate, months):\n    pass\n",
          sample: "monthly_payment(1200000, 24, 12) → 113471.52",
          tests: [
            {
              check: py`p = monthly_payment(1200000, 24, 12)
assert p == 113471.52, "₦1,200,000 at 24% a year over 12 months is ₦113,471.52 a month. Got " + repr(p)
assert monthly_payment(500000, 18, 24) == 24962.05, "Check r = 18 / 12 / 100 = 0.015. Got " + repr(monthly_payment(500000, 18, 24))
assert monthly_payment(600000, 0, 12) == 50000.0, "At 0% the payment is principal / months. Got " + repr(monthly_payment(600000, 0, 12))`,
            },
          ],
          solution: py`def monthly_payment(principal, annual_rate, months):
    if annual_rate == 0:
        return round(principal / months, 2)
    r = annual_rate / 12 / 100
    growth = (1 + r) ** months
    return round(principal * r * growth / (growth - 1), 2)
`,
          hint: "Compute r = annual_rate / 12 / 100 and growth = (1 + r) ** months first, then return round(principal * r * growth / (growth - 1), 2).",
          successMessage: "Naming intermediate values (r, growth) makes a long expression readable and checkable: a habit that pays off in every ML formula.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.4 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l6-control-flow",
    moduleId: "ml-m2-python",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6"],
    title: "Conditions, Loops and Functions",
    subtitle: "Decisions, repetition and reusable code",
    estimatedMinutes: 34,
    intro:
      "Programs become useful when they decide, repeat and reuse. Every machine learning training loop is a for loop around a function that computes a decision, so these three constructs are the core of everything that follows.",

    atoms: [
      {
        id: "a-ml-conditionals",
        title: "Conditional statements",
        explain:
          "if runs a block only when its condition is True; elif adds further conditions, checked in order; else runs when none matched. Python marks a block by INDENTATION (four spaces), not braces, so indentation is part of the syntax. Only the FIRST matching branch runs, so order conditions from most to least specific: check score >= 70 before score >= 60. Conditions can combine comparisons with and, or and not, and Python allows chained comparisons such as 50 <= score < 60.",
        codeChallenge: {
          task:
            "Write grade(score) that returns the Nigerian university grade for a score from 0 to 100: \"A\" for 70 and above, \"B\" for 60–69, \"C\" for 50–59, \"D\" for 45–49, \"E\" for 40–44 and \"F\" below 40. If the score is below 0 or above 100, return \"invalid\".",
          starter: "def grade(score):\n    pass\n",
          sample: "grade(72) → \"A\", grade(45) → \"D\", grade(101) → \"invalid\"",
          tests: [
            {
              check: py`cases = {100: "A", 70: "A", 69: "B", 60: "B", 59: "C", 50: "C", 49: "D", 45: "D", 44: "E", 40: "E", 39: "F", 0: "F", -1: "invalid", 101: "invalid"}
for s, want in cases.items():
    assert grade(s) == want, "grade(" + str(s) + ") should be " + want + ". Got " + repr(grade(s))`,
            },
          ],
          solution: py`def grade(score):
    if score < 0 or score > 100:
        return "invalid"
    if score >= 70:
        return "A"
    elif score >= 60:
        return "B"
    elif score >= 50:
        return "C"
    elif score >= 45:
        return "D"
    elif score >= 40:
        return "E"
    return "F"
`,
          hint: "Check the invalid range first. Then test from the top grade down: if score >= 70 ... elif score >= 60 ..., so each elif only sees scores the earlier branches rejected.",
          successMessage: "Ordering branches from the top down means each elif only needs a lower bound. Boundary values (69, 70) are exactly where bugs hide, which is why the test checks them.",
        },
      },
      {
        id: "a-ml-loops",
        title: "Loops",
        explain:
          "A for loop runs its block once for each item of a sequence: for score in scores. range(n) produces 0 to n − 1, and range(a, b, step) counts from a up to (not including) b. enumerate(items) gives (index, item) pairs, and zip(a, b) walks two lists side by side. A while loop repeats while a condition stays True; use it when the number of repetitions is not known in advance, such as \"train until the error stops improving\". break leaves a loop early; continue skips to the next item. An ACCUMULATOR (a total, a count, a running best) is set before the loop and updated inside it.",
        codeExercise: {
          language: PY,
          code: py`scores = [55, 72, 38, 91, 64]
total = 0
passed = 0
for i, s in enumerate(scores):
    if s < 40:
        continue
    total += s
    passed += 1
    if s > 90:
        print("distinction at index", i)
print(passed, total)

epochs = 0
error = 1.0
while error > 0.1:
    error = error / 2
    epochs += 1
print(epochs, error)
`,
          question: "The first loop skips failures; the while loop halves an error until it is at most 0.1. What does it print?",
          expectedOutput: "distinction at index 3\n4 282\n4 0.0625",
          hint: "38 is skipped. 55 + 72 + 91 + 64 = 282. The error goes 0.5, 0.25, 0.125, 0.0625.",
          successMessage: "A while loop that runs until an error is small enough is the skeleton of every training loop you will write.",
        },
      },
      {
        id: "a-ml-functions",
        title: "Functions and parameters",
        explain:
          "def name(parameters): defines a FUNCTION, a named, reusable block; return sends a value back to the caller (a function with no return gives None). PARAMETERS can have DEFAULT values (def scale(x, factor=2)), which callers may omit, and callers may pass arguments by name (scale(5, factor=10)), which makes calls self-documenting. Variables created inside a function are LOCAL: they vanish when it returns. A good function does one job, has a clear name, and returns its result rather than printing it, so other code can use the value. ML libraries are designed this way: fit(X, y), predict(X), score(X, y).",
        codeChallenge: {
          task:
            "Write min_max_scale(values, low=0.0, high=1.0) that returns a new list where the smallest value maps to low, the largest to high, and the rest in proportion: low + (v − min) × (high − low) / (max − min). If all values are equal (max == min), return a list of low values. Round each result to 4 decimal places.",
          starter: "def min_max_scale(values, low=0.0, high=1.0):\n    pass\n",
          sample: "min_max_scale([10, 20, 30]) → [0.0, 0.5, 1.0]; min_max_scale([10, 20, 30], low=-1, high=1) → [-1.0, 0.0, 1.0]",
          tests: [
            {
              check: py`assert min_max_scale([10, 20, 30]) == [0.0, 0.5, 1.0], "Got " + repr(min_max_scale([10, 20, 30]))
assert min_max_scale([10, 20, 30], low=-1, high=1) == [-1.0, 0.0, 1.0], "With low=-1 and high=1. Got " + repr(min_max_scale([10, 20, 30], low=-1, high=1))
assert min_max_scale([3, 1, 2]) == [1.0, 0.0, 0.5], "Order is kept: only the values change."
assert min_max_scale([5, 5, 5]) == [0.0, 0.0, 0.0], "All equal: avoid dividing by zero, return low for every value."
assert min_max_scale([1, 2, 4]) == [0.0, 0.3333, 1.0], "Round to 4 decimal places."
data = [4, 8]
min_max_scale(data)
assert data == [4, 8], "Return a new list; do not change the input."`,
            },
          ],
          solution: py`def min_max_scale(values, low=0.0, high=1.0):
    smallest, largest = min(values), max(values)
    if largest == smallest:
        return [low for _ in values]
    span = largest - smallest
    return [round(low + (v - smallest) * (high - low) / span, 4) for v in values]
`,
          hint: "Find min and max once. Guard the equal case before dividing. Then build the new list with the formula, rounding each value.",
          successMessage: "This is min-max normalisation, a preprocessing step you will meet again in Module 8, where scikit-learn's MinMaxScaler does the same arithmetic.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.7 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l7-collections",
    moduleId: "ml-m2-python",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.7", "2.8", "2.9"],
    title: "Collections, Strings and Comprehensions",
    subtitle: "Holding many values, cleaning text, and transforming data in one line",
    estimatedMinutes: 36,
    intro:
      "Data is many values, not one. Python's four built-in collections, its string methods and its comprehensions are how raw records are held, cleaned and reshaped before a library like pandas takes over.",

    atoms: [
      {
        id: "a-ml-collections",
        title: "Lists, tuples, sets and dictionaries",
        explain:
          "A LIST [1, 2, 3] is ordered and changeable: append, insert, remove, index with items[0], slice with items[1:3], and items[-1] is the last. A TUPLE (1, 2) is ordered but cannot be changed, which makes it ideal for fixed records like a (latitude, longitude) pair. A SET {1, 2} holds unique values with no order, so set(items) removes duplicates and \"x in s\" is fast. A DICTIONARY {\"name\": \"Ada\", \"score\": 80} maps keys to values: d[key] reads, d[key] = v writes, d.get(key, default) reads safely, and .items() walks key-value pairs. One record per dictionary, many records in a list, is exactly how JSON data arrives.",
        codeExercise: {
          language: PY,
          code: py`cities = ["Lagos", "Abuja", "Lagos", "Kano", "Abuja"]
unique = sorted(set(cities))
print(unique, len(cities))

counts = {}
for c in cities:
    counts[c] = counts.get(c, 0) + 1
print(counts)

point = (6.52, 3.38)
lat, lon = point
print(lat, cities[-1], cities[1:3])
`,
          question: "What does it print?",
          expectedOutput: "['Abuja', 'Kano', 'Lagos'] 5\n{'Lagos': 2, 'Abuja': 2, 'Kano': 1}\n6.52 Abuja ['Abuja', 'Lagos']",
          hint: "sorted(set(...)) gives unique values in alphabetical order. Dictionaries keep insertion order. [1:3] takes indexes 1 and 2.",
          successMessage: "counts.get(c, 0) + 1 is the counting idiom; collections.Counter and pandas value_counts() do the same thing for you later.",
        },
      },
      {
        id: "a-ml-strings",
        title: "String manipulation",
        explain:
          "Real data arrives as messy text: \"  lagos \", \"LAGOS\", \"Lagos.\". String methods return NEW strings (strings never change in place): .strip() removes surrounding spaces, .lower() / .upper() / .title() change case, .replace(a, b) substitutes, .split(sep) breaks into a list, sep.join(list) glues a list together, .startswith() and .endswith() test, and \"in\" checks for a substring. f-strings format values: f\"{name}: {score:.1f}\" puts values into text with one decimal place. Cleaning text consistently is the first step of every NLP pipeline in Module 18.",
        codeChallenge: {
          task:
            "Write clean_name(raw) that tidies a customer name typed in a form: remove leading and trailing spaces, collapse any run of internal spaces to a single space, and capitalise each word (title case). Then write initials(name) that returns the upper-case first letters of each word of the CLEANED name, joined with full stops and ending with one, e.g. \"A.N.\".",
          starter: "def clean_name(raw):\n    pass\n\ndef initials(name):\n    pass\n",
          sample: "clean_name(\"  aDA   nWAnkwo \") → \"Ada Nwankwo\"; initials(\"  aDA   nWAnkwo \") → \"A.N.\"",
          tests: [
            {
              check: py`assert clean_name("  aDA   nWAnkwo ") == "Ada Nwankwo", "Got " + repr(clean_name("  aDA   nWAnkwo "))
assert clean_name("chiamaka") == "Chiamaka", "A single word."
assert clean_name(" musa  ibrahim   bello") == "Musa Ibrahim Bello", "Got " + repr(clean_name(" musa  ibrahim   bello"))
assert initials("  aDA   nWAnkwo ") == "A.N.", "Got " + repr(initials("  aDA   nWAnkwo "))
assert initials("musa ibrahim bello") == "M.I.B.", "Got " + repr(initials("musa ibrahim bello"))`,
            },
          ],
          solution: py`def clean_name(raw):
    return " ".join(raw.split()).title()

def initials(name):
    words = clean_name(name).split()
    return "".join(w[0] + "." for w in words)
`,
          hint: "raw.split() with no argument splits on any run of whitespace and drops empty pieces, so \" \".join(raw.split()) collapses spaces. Then .title().",
          successMessage: "split() with no argument is the most useful string trick in data cleaning: it handles leading, trailing and repeated whitespace in one call.",
        },
      },
      {
        id: "a-ml-comprehensions",
        title: "List comprehensions",
        explain:
          "A LIST COMPREHENSION builds a new list from an existing one in a single expression: [expression for item in items if condition]. [s * 2 for s in scores] doubles every score; [s for s in scores if s >= 50] keeps the passes; [round(p * 1.075, 2) for p in prices] adds 7.5% VAT. The same syntax builds dictionaries ({k: v for ...}) and sets ({x for ...}). A comprehension is shorter and usually faster than an append loop, and it reads like the mathematics it implements: {x² | x ∈ S, x > 0}. Keep them simple; if one needs two conditions and nested loops, a normal loop is clearer.",
        codeChallenge: {
          task:
            "Write three one-line functions, each returning a comprehension: passes(scores) returns the scores that are 50 or more; with_vat(prices) returns each price × 1.075 rounded to 2 places; and grade_book(names, scores) returns a dictionary mapping each name to its score, built with zip. Use a comprehension in each, not a loop with append.",
          starter: "def passes(scores):\n    pass\n\ndef with_vat(prices):\n    pass\n\ndef grade_book(names, scores):\n    pass\n",
          sample: "passes([45, 50, 80]) → [50, 80]; grade_book([\"Ada\", \"Musa\"], [70, 65]) → {\"Ada\": 70, \"Musa\": 65}",
          tests: [
            {
              check: py`assert passes([45, 50, 80, 12, 99]) == [50, 80, 99], "Got " + repr(passes([45, 50, 80, 12, 99]))
assert with_vat([1000, 250.5]) == [1075.0, 269.29], "Got " + repr(with_vat([1000, 250.5]))
assert grade_book(["Ada", "Musa"], [70, 65]) == {"Ada": 70, "Musa": 65}, "Got " + repr(grade_book(["Ada", "Musa"], [70, 65]))
assert uses("ListComp") and uses("DictComp"), "Use list comprehensions and a dictionary comprehension."
assert not calls("append"), "Build the lists with comprehensions instead of append."`,
            },
          ],
          solution: py`def passes(scores):
    return [s for s in scores if s >= 50]

def with_vat(prices):
    return [round(p * 1.075, 2) for p in prices]

def grade_book(names, scores):
    return {n: s for n, s in zip(names, scores)}
`,
          hint: "[s for s in scores if s >= 50]; [round(p * 1.075, 2) for p in prices]; {n: s for n, s in zip(names, scores)}.",
          successMessage: "Comprehensions are the Python of data work. NumPy (Module 4) takes the idea further: operate on a whole array with no loop at all.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.10 – 2.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l8-files-errors-modules",
    moduleId: "ml-m2-python",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.10", "2.11", "2.12"],
    title: "Files, Exceptions, Modules and Packages",
    subtitle: "Reading data from disk, surviving bad records, and using other people's code",
    estimatedMinutes: 36,
    intro:
      "Datasets live in files, and real files contain mistakes: a blank cell, \"N/A\" where a number should be. This lesson reads CSV files, handles the errors that bad rows cause, and imports code from Python's standard library.",

    atoms: [
      {
        id: "a-ml-files",
        title: "Working with files",
        explain:
          "open(path, mode) opens a file: \"r\" to read (the default), \"w\" to write (replacing it), \"a\" to append. Always open files in a WITH block, which closes the file automatically even if an error occurs: with open(\"scores.csv\", encoding=\"utf-8\") as f. A file object can be read whole (f.read()), as a list of lines (f.readlines()), or looped over line by line. For CSV (comma-separated values) files, use the csv module: csv.DictReader(f) turns each row into a dictionary keyed by the header row. Every value it gives you is a STRING, so convert numbers yourself.",
        codeChallenge: {
          task:
            "The file scores.csv has a header row name,subject,score. Write average_by_subject(path) that reads it with csv.DictReader and returns a dictionary mapping each subject to its average score, rounded to 1 decimal place.",
          starter: "import csv\n\ndef average_by_subject(path):\n    pass\n",
          sample: "average_by_subject(\"scores.csv\") → {\"Maths\": 70.0, \"English\": 61.5}",
          tests: [
            {
              files: { "scores.csv": "name,subject,score\nAda,Maths,80\nMusa,Maths,60\nAda,English,55\nMusa,English,68\n" },
              check: py`r = average_by_subject("scores.csv")
assert r == {"Maths": 70.0, "English": 61.5}, "Maths: (80 + 60) / 2 = 70.0; English: (55 + 68) / 2 = 61.5. Got " + repr(r)`,
              label: "two subjects",
            },
            {
              files: { "scores.csv": "name,subject,score\nA,Physics,91\nB,Physics,72\nC,Physics,88\n" },
              check: py`r = average_by_subject("scores.csv")
assert r == {"Physics": 83.7}, "(91 + 72 + 88) / 3 = 83.67, rounded to 83.7. Got " + repr(r)
assert calls("DictReader"), "Use csv.DictReader to read the rows."`,
              label: "rounding",
            },
          ],
          solution: py`import csv

def average_by_subject(path):
    totals, counts = {}, {}
    with open(path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            subject = row["subject"]
            totals[subject] = totals.get(subject, 0) + float(row["score"])
            counts[subject] = counts.get(subject, 0) + 1
    return {s: round(totals[s] / counts[s], 1) for s in totals}
`,
          hint: "Keep two dictionaries, totals and counts. For each row, add float(row[\"score\"]) to totals[subject] and 1 to counts[subject]. Then a dict comprehension divides them.",
          successMessage: "Group, total, count, divide: you have written a GROUP BY by hand. pandas does it in one line in Module 5, and now you know what that line does.",
        },
      },
      {
        id: "a-ml-exceptions",
        title: "Exception handling",
        explain:
          "When something goes wrong at run time, Python raises an EXCEPTION: ValueError (float(\"N/A\")), KeyError (a missing dictionary key), ZeroDivisionError, FileNotFoundError, TypeError. Uncaught, it stops the program. try: ... except ValueError: ... catches it and lets you recover: skip the bad row, use a default, log a warning. Catch SPECIFIC exceptions, never a bare except:, which also hides your own bugs. else runs when no exception occurred; finally always runs. raise ValueError(\"message\") signals an error from your own code, which is how a prediction API rejects invalid input in Module 19.",
        codeChallenge: {
          task:
            "Write parse_amounts(values) that takes a list of strings from a sales file and returns a tuple (amounts, bad): amounts is the list of values that convert to float (in order), and bad is the number that could not be converted. Use try/except ValueError around float(). Strings may have surrounding spaces, which float() accepts.",
          starter: "def parse_amounts(values):\n    pass\n",
          sample: "parse_amounts([\"1500\", \"N/A\", \" 230.5 \", \"\"]) → ([1500.0, 230.5], 2)",
          tests: [
            {
              check: py`assert parse_amounts(["1500", "N/A", " 230.5 ", ""]) == ([1500.0, 230.5], 2), "Got " + repr(parse_amounts(["1500", "N/A", " 230.5 ", ""]))
assert parse_amounts([]) == ([], 0), "An empty list."
assert parse_amounts(["1,200", "7"]) == ([7.0], 1), "\"1,200\" has a comma, which float() rejects."
assert uses("Try"), "Use try/except to handle the values that do not convert."
assert "except:" not in source.replace(" ", ""), "Catch ValueError specifically, not everything."`,
            },
          ],
          solution: py`def parse_amounts(values):
    amounts = []
    bad = 0
    for v in values:
        try:
            amounts.append(float(v))
        except ValueError:
            bad += 1
    return amounts, bad
`,
          hint: "Loop over values. Inside try, append float(v). In except ValueError, add 1 to bad.",
          successMessage: "Counting what you skipped matters: a cleaning step that silently drops 40% of the rows is a bug. Always report how many records were rejected.",
        },
      },
      {
        id: "a-ml-modules",
        title: "Modules and packages",
        explain:
          "A MODULE is a Python file of reusable code; a PACKAGE is a folder of modules. import math gives you math.sqrt; from statistics import mean imports one name; import numpy as np imports with a short ALIAS, the convention for np, pd (pandas) and plt (matplotlib.pyplot). Python's STANDARD LIBRARY, installed with Python, includes math, statistics, random, csv, json, datetime, collections and pathlib. Your own file is a module too: functions in helpers.py can be imported elsewhere with import helpers. The code under if __name__ == \"__main__\": runs only when the file is executed directly, not when it is imported.",
        codeExercise: {
          language: PY,
          code: py`import math
import statistics as st
from collections import Counter

scores = [70, 85, 85, 60, 90]
print(st.mean(scores), st.median(scores), st.mode(scores))
print(round(math.sqrt(st.pvariance(scores)), 2))
print(Counter(["A", "B", "A", "C", "A"]).most_common(1))
`,
          question: "Using the standard library only, what does this print?",
          expectedOutput: "78 85 85\n11.22\n[('A', 3)]",
          hint: "The sorted scores are 60, 70, 85, 85, 90. The mean is 390 / 5. The population variance is the average squared distance from 78.",
          successMessage: "The standard library already computes statistics; Module 3 shows the formulas behind them, and NumPy makes them fast on millions of values.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.13 – 2.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ml-l9-oop-and-environments",
    moduleId: "ml-m2-python",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.13", "2.14", "2.15"],
    title: "Classes, Libraries and Virtual Environments",
    subtitle: "How ML libraries are designed, and how to install them safely",
    estimatedMinutes: 34,
    intro:
      "Every scikit-learn model is an object with fit and predict methods. Understanding classes explains the design of the whole ML ecosystem, and virtual environments keep each project's libraries from breaking the others.",

    atoms: [
      {
        id: "a-ml-oop",
        title: "Introduction to object-oriented programming",
        explain:
          "A CLASS is a blueprint that bundles DATA (attributes) with the FUNCTIONS that act on it (methods). An OBJECT is one instance made from the blueprint. __init__ runs when an object is created and sets its attributes on self, which means \"this particular object\". Methods take self as their first parameter. scikit-learn is built entirely on this pattern: model = LinearRegression() creates an object; model.fit(X, y) learns and STORES what it learned as attributes (by convention ending in an underscore, like model.coef_); model.predict(X) uses them. Below you build a class with exactly that interface.",
        codeChallenge: {
          task:
            "Write a class MeanPredictor with the scikit-learn interface. fit(self, y) stores the average of the list y in the attribute self.mean_ and returns self. predict(self, n) returns a list of n copies of self.mean_. score(self, y) returns the mean absolute error: the average of abs(value − self.mean_) over y, rounded to 2 places.",
          starter: "class MeanPredictor:\n    pass\n",
          sample: "m = MeanPredictor().fit([10, 20, 30]); m.mean_ → 20.0; m.predict(2) → [20.0, 20.0]",
          tests: [
            {
              check: py`m = MeanPredictor()
result = m.fit([10, 20, 30])
assert result is m, "fit should return self, so calls can be chained: MeanPredictor().fit(y)."
assert m.mean_ == 20, "The mean of 10, 20, 30 is 20. Got " + repr(getattr(m, "mean_", None))
assert m.predict(2) == [20, 20], "predict(2) returns two copies of the mean. Got " + repr(m.predict(2))
assert m.score([10, 20, 30]) == 6.67, "Errors are 10, 0, 10: mean 6.67. Got " + repr(m.score([10, 20, 30]))
m2 = MeanPredictor().fit([4, 8])
assert m2.mean_ == 6 and m.mean_ == 20, "Each object keeps its own mean_."`,
            },
          ],
          solution: py`class MeanPredictor:
    def fit(self, y):
        self.mean_ = sum(y) / len(y)
        return self

    def predict(self, n):
        return [self.mean_] * n

    def score(self, y):
        return round(sum(abs(v - self.mean_) for v in y) / len(y), 2)
`,
          hint: "def fit(self, y): self.mean_ = sum(y) / len(y); return self. The other methods read self.mean_.",
          successMessage: "This mean predictor is a real baseline model: scikit-learn ships it as DummyRegressor. Any regression model you build later must beat it.",
        },
      },
      {
        id: "a-ml-installing-libraries",
        title: "Installing and managing Python libraries",
        explain:
          "Libraries outside the standard library are installed from PyPI, the Python Package Index, with pip: pip install numpy pandas scikit-learn. pip install package==1.8.0 installs an exact version; pip install --upgrade package updates; pip list shows what is installed; pip uninstall removes. A project records its libraries in requirements.txt, one per line with versions pinned, so anyone can recreate its environment with pip install -r requirements.txt. Data scientists also use conda (from Anaconda), which manages non-Python dependencies too. In this course's lessons the libraries are already available: the page loads them for you.",
        example:
          "$ pip install numpy pandas scikit-learn matplotlib\n$ pip install fastapi==0.136.1\n$ pip freeze > requirements.txt\n\n# requirements.txt\nnumpy==2.4.6\npandas==3.0.2\nscikit-learn==1.8.0\nmatplotlib==3.10.8\n\n$ pip install -r requirements.txt   # on another machine",
        codeExercise: {
          language: PY,
          code: py`requirements = """numpy==2.4.6
pandas==3.0.2
scikit-learn==1.8.0
"""
pins = {}
for line in requirements.splitlines():
    name, version = line.split("==")
    pins[name] = tuple(int(p) for p in version.split("."))
print(pins["scikit-learn"], pins["numpy"] >= (2, 0, 0))
print(sorted(pins))
`,
          question: "This parses a requirements.txt. What does it print?",
          expectedOutput: "(1, 8, 0) True\n['numpy', 'pandas', 'scikit-learn']",
          hint: "\"1.8.0\" split on \".\" gives [\"1\", \"8\", \"0\"]. Tuples compare element by element: 2 > 2 is false, then 4 > 0.",
          successMessage: "Pinned versions are tuples you can compare. Pinning exact versions is what makes an ML project reproducible, a theme of Module 21.",
        },
      },
      {
        id: "a-ml-virtual-environments",
        title: "Virtual environments and package management",
        explain:
          "Installing every library globally causes conflicts: project A needs scikit-learn 1.3, project B needs 1.8, and only one can be installed. A VIRTUAL ENVIRONMENT is an isolated folder with its own Python and its own packages, one per project. Create it with python -m venv .venv, ACTIVATE it (source .venv/bin/activate on macOS and Linux, .venv\\Scripts\\activate on Windows), then pip installs go into it only. Add .venv to .gitignore: you commit requirements.txt, not the environment itself. Tools such as conda environments, Poetry and uv do the same job with extra conveniences.",
        example:
          "$ python -m venv .venv\n$ source .venv/bin/activate        # Windows: .venv\\Scripts\\activate\n(.venv) $ pip install -r requirements.txt\n(.venv) $ python train.py\n(.venv) $ deactivate",
        decision: {
          scenario:
            "You clone a colleague's churn-prediction project. Its README says \"pip install -r requirements.txt\". You already have other ML projects on your laptop.",
          question: "What should you do first?",
          options: [
            { id: "a", text: "Run pip install -r requirements.txt globally", whyWrong: "That can upgrade or downgrade libraries your other projects depend on, breaking them." },
            { id: "b", text: "Create and activate a virtual environment for this project, then install", why: "The project's pinned versions go into its own environment, isolated from every other project." },
            { id: "c", text: "Copy your own site-packages folder into the project", whyWrong: "Unreliable and not reproducible; the versions may not match requirements.txt." },
            { id: "d", text: "Delete requirements.txt and install the latest of everything", whyWrong: "The pinned versions are what the code was tested with. The latest may behave differently." },
          ],
          correct: "b",
          aftermath: "One project, one virtual environment, one requirements.txt.",
        },
      },
    ],

    task: {
      title: "Module 2 project: a student performance analysis application",
      intro:
        "Build a command-line Python application, in its own virtual environment, that analyses a class's results stored in a CSV file (name, subject, score). Use only what this module taught.",
      prompts: [
        "Read the CSV with csv.DictReader, converting scores with try/except and reporting how many rows were rejected.",
        "Compute each student's average, the class average per subject, and the highest and lowest scorer in each subject.",
        "Assign each student a grade with your grade() function and count how many students received each grade.",
        "Write a Student class holding a name and a dictionary of scores, with average() and best_subject() methods.",
        "Use list and dictionary comprehensions for the filtering (students below 50 in any subject) and lookups.",
        "Write the report to report.txt with f-strings, and record your libraries in requirements.txt.",
      ],
      closing: "Your analyser already computed means and spreads by hand. Module 3 gives those calculations, and the rest of the mathematics behind ML, their proper foundation.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
