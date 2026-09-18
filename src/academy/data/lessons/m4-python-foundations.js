/**
 * MODULE · PROGRAMMING FOUNDATIONS WITH PYTHON (m4-python-foundations)
 * Month 4 — Python & Capstone
 *
 * The module summary sets the bar: "Written for someone who has never
 * programmed. Nothing is assumed." That is taken literally here. No prior
 * coding, no command line, no jargon introduced without being defined.
 *
 * TEACHING APPROACH — PREDICT, DO NOT TYPE
 * The skill a beginner actually lacks is READING code. Someone who can look at
 * four lines and say what they print can debug their own work; someone who can
 * only copy from a tutorial cannot. So the graded practice is prediction: read
 * the code, say what it prints, and be marked against what it really prints.
 *
 * Deliberately no in-browser code editor. Running Python in a browser means a
 * multi-megabyte WASM download, which is a genuine cost for a learner on
 * metered mobile data — and prediction tests comprehension better anyway.
 *
 * EVERY OUTPUT IN THIS FILE WAS PRODUCED BY RUNNING THE CODE in CPython 3.14,
 * not written from memory. The content validator re-runs every snippet on each
 * build where Python is available, so a lesson cannot drift from reality.
 *
 * CONTINUITY: the examples use the same sales figures as Months 2 and 3 —
 * Lagos 276,000, Abuja 215,000, Kano 127,000 — so nothing new has to be
 * learned to read them, and the learner can see the same answers arrived at a
 * third way.
 *
 * CLIENT-SAFE. Knowledge-check answers live in lib/academy/assessments/.
 */

export const SECTION_ID = "s14-python-foundations";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l62-what-programming-is",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 2,
    title: "What Programming Actually Is",
    subtitle: "And why an analyst learns it after Excel, not before",
    estimatedMinutes: 14,
    intro:
      "You have spent three months telling software what to do by clicking. Programming is telling it what to do by writing, and the reason to learn it is not that it is better — it is that written instructions can be repeated, checked and shared in ways clicks cannot.",

    atoms: [
      {
        id: "a-py-what-it-is",
        title: "Code is instructions, executed in order",
        explain:
          "A program is a list of instructions the computer performs from top to bottom. That is the entire idea. Python is one language for writing them, chosen here because it reads close to English and dominates data work.",
        why: "You already think this way. A Power Query recipe is a list of ordered steps; so is a Python script. The difference is that you type the steps instead of clicking them, which means you can read them back, comment them, and hand them to someone else.",
        analogy:
          "Power Query's Applied Steps list IS a program. You have been writing them for a month — you just have not been typing them.",
        table: {
          caption: "The same job, three tools.",
          headers: ["", "Excel", "Power Query", "Python"],
          rows: [
            ["How you instruct it", "Formulas and clicks", "Recorded steps", "Written lines"],
            ["Repeatable", "Partly", "Yes, on refresh", "Yes, any time"],
            ["Readable by a colleague", "Hard", "The step list", "The code itself"],
            ["Row limit", "1,048,576", "Large", "Whatever fits in memory"],
            ["Good for", "Ad-hoc answers", "Repeatable cleaning", "Anything, including the other two"],
          ],
          note: "Python is not a replacement for what you already know. It is what you reach for when the job is too big, too repetitive or too unusual for the other two.",
        },
      },
      {
        id: "a-py-print",
        title: "print() — how a program talks to you",
        explain:
          "A program does its work silently. print() is the instruction that makes it show you something. It is the first thing you learn and the tool you will still be using to debug in ten years.",
        code: {
          code: 'print("Hello, Memora")\n',
          expectedOutput: "Hello, Memora",
        },
        why: "Everything in this module is verified by print(). You will use it to see what a variable holds, to check a loop is doing what you meant, and to find the one row that broke your script.",
        table: {
          caption: "Reading that one line.",
          headers: ["Part", "Meaning"],
          rows: [
            ["print", "The name of the instruction"],
            ["( )", "The brackets holding what it should act on"],
            ['"Hello, Memora"', "Text, which must be inside quotes"],
          ],
          note: "Quotes are how Python knows something is text rather than the name of something. Leave them off and it looks for a thing called Hello, finds none, and stops.",
        },
      },
      {
        id: "a-py-where-to-run",
        title: "Where to write it — notebooks, not files, to begin with",
        explain:
          "A Jupyter notebook runs one block of code at a time and shows the result underneath. A .py script runs top to bottom and shows nothing unless you print. Start with notebooks; they are built for exploring.",
        why: "A notebook gives you the feedback loop a spreadsheet gave you: change something, see the result immediately. A script is better once the work is finished and needs to run on a schedule — which is the same distinction as an ad-hoc Excel file against a refreshing Power BI report.",
        table: {
          caption: "Where to start, and what it costs.",
          headers: ["Option", "Install", "Good for"],
          rows: [
            ["Google Colab", "Nothing — runs in a browser, free", "Learning. Start here."],
            ["Jupyter via Anaconda", "A large download, one time", "Working offline"],
            ["VS Code + Python", "Two installs", "Writing scripts later"],
            ["A .py file", "Python itself", "Anything scheduled"],
          ],
          note: "Colab needs only a Google account and works on a phone in a pinch. For this module it is the shortest path from reading to running.",
        },
        mistake:
          "Spending an evening fighting a local Python install before writing a single line. Open Colab, get through this module, and set up a local environment when you have a reason to.",
      },
      {
        id: "a-py-comments",
        title: "Comments — notes for the human",
        explain:
          "Anything after a # on a line is ignored by Python and read by people. Use comments to record WHY something is done, not what — the code already says what.",
        why: "You are the person who will read your code in three weeks, having forgotten all of it. A comment explaining why a row was excluded is worth more than three explaining that a loop loops.",
        code: {
          code: '# Revenue for the quarter, from the cleaned export.\n# ORD-1003 excluded: duplicate confirmed with sales on 12 March.\nrevenue = 276000\nprint(revenue)\n',
          expectedOutput: "276000",
        },
        mistake:
          "Commenting what the code obviously does — '# add one to total' above total = total + 1. It adds noise and it goes stale the moment the code changes.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l63-variables-and-types",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 3,
    title: "Variables and Types",
    subtitle: "Naming things, and what Python thinks they are",
    estimatedMinutes: 15,
    intro:
      "A variable is a name for a value. Types are Python's opinion about what kind of value it is — and you have met this idea before, because a column stored as text instead of a number broke a pivot table in Month 2.",

    atoms: [
      {
        id: "a-py-variables",
        title: "A variable is a name you choose",
        explain:
          "Write a name, an equals sign, and a value. The name now refers to that value everywhere below. The equals sign means 'store this', not 'is equal to'.",
        code: {
          code: 'state = "Lagos"\norders = 6\nrevenue = 276000.0\n\nprint(state)\nprint(orders)\nprint(revenue)\n',
          expectedOutput: "Lagos\n6\n276000.0",
        },
        why: "Naming a value once and reusing the name is the same argument as writing a formula once and filling it down. Change the value in one place and everything below follows.",
        table: {
          caption: "Naming rules and conventions.",
          headers: ["Rule", "Good", "Bad"],
          rows: [
            ["Lower case, words joined by _", "avg_order_value", "AvgOrderValue"],
            ["Describes the value", "revenue", "x"],
            ["No spaces or dashes", "state_name", "state name"],
            ["Cannot start with a digit", "q1_revenue", "1q_revenue"],
            ["Avoid Python's own words", "total", "sum"],
          ],
          note: "The last row matters: naming a variable `sum` hides Python's built-in sum() function, and the error that follows several lines later will not mention it.",
        },
      },
      {
        id: "a-py-types",
        title: "Four types cover almost everything",
        explain:
          "Text is a str. Whole numbers are int. Decimals are float. True and False are bool. type() tells you which one Python thinks it has.",
        code: {
          code: 'print(type("Lagos"))\nprint(type(6))\nprint(type(276000.0))\nprint(type(True))\n',
          expectedOutput: "<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>",
        },
        why: "This is the Month 2 lesson again: a number stored as text does not add up. In Excel you found it with ISNUMBER and the cell alignment; in Python you find it with type(), and the failure is louder — Python raises an error rather than quietly returning the wrong total.",
        table: {
          caption: "The four types, and what you do with them.",
          headers: ["Type", "Example", "Used for"],
          rows: [
            ["str", '"Lagos"', "Names, states, categories, any text"],
            ["int", "6", "Counts, whole quantities"],
            ["float", "276000.0", "Money, averages, anything with decimals"],
            ["bool", "True", "Yes/no flags and the result of a comparison"],
          ],
          note: "Quotes decide it. 6 is a number; \"6\" is text that happens to look like one — and that distinction is exactly what broke the pivot table.",
        },
      },
      {
        id: "a-py-reassign",
        title: "Variables can change",
        explain:
          "Assigning to a name again replaces what it holds. The right-hand side is worked out first, so a variable can be defined in terms of its own current value.",
        codeExercise: {
          code: "revenue = 276000\nrevenue = revenue + 49000\nprint(revenue)\n",
          question:
            "Line 2 uses `revenue` on both sides of the equals sign. What does this print?",
          expectedOutput: "325000",
          hint: "Python works out the right-hand side FIRST, using the current value of revenue, then stores the result back under the same name.",
          successMessage:
            "325,000. The equals sign means 'store this', not 'is equal to' — which is why a line that would be nonsense in algebra is perfectly ordinary in code.",
        },
        why: "This pattern — take the current value, change it, store it back — is how every running total in every loop works. Getting comfortable with it now makes loops straightforward later.",
      },
      {
        id: "a-py-convert",
        title: "Converting between types",
        explain:
          "int() turns text into a whole number, float() into a decimal, str() turns a number into text. This is the Power Query 'change type' step, written as a function.",
        code: {
          code: 'text = "43000"\nprint(type(text))\namount = int(text)\nprint(type(amount))\nprint(amount + 1000)\n',
          expectedOutput: "<class 'str'>\n<class 'int'>\n44000",
        },
        why: "Data read from a file arrives as text far more often than beginners expect — the capstone dataset certainly will. Converting deliberately, and checking with type(), is the habit that prevents an afternoon of confusion.",
        mistake:
          "Calling int() on text that is not a number. int(\"N43,000\") fails, because the naira sign and the comma are not digits. Strip them first — which is the Python version of the cleaning you did in Power Query.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l64-strings-and-numbers",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 4,
    title: "Strings and Numbers",
    subtitle: "Arithmetic, text methods, and formatting output people can read",
    estimatedMinutes: 16,
    intro:
      "Two of the four types deserve a lesson of their own, because most of the work you will do is arithmetic on numbers and tidying of text — the same two jobs you did in Excel, with different syntax.",

    atoms: [
      {
        id: "a-py-arithmetic",
        title: "Arithmetic, including two operators Excel hides",
        explain:
          "Plus, minus, star and slash behave as expected. Two more are worth knowing: // divides and throws away the remainder, and % gives you only the remainder. ** raises to a power.",
        codeExercise: {
          code: "print(10 / 4)\nprint(10 // 4)\nprint(10 % 4)\nprint(10 ** 2)\n",
          question:
            "Four kinds of arithmetic on the same two numbers. What are the four lines of output?",
          expectedOutput: "2.5\n2\n2\n100",
          hint: "/ always gives a decimal. // discards the remainder. % gives ONLY the remainder. ** is 'to the power of'.",
          successMessage:
            "Note that 10 / 4 gives 2.5 — a float — while 10 // 4 gives 2. Division in Python ALWAYS produces a decimal, even when the numbers divide evenly, which surprises people the first time they see 49000.0 instead of 49000.",
        },
        table: {
          caption: "The operators.",
          headers: ["Operator", "Does", "10 and 4 give"],
          rows: [
            ["+  -  *", "Add, subtract, multiply", "14, 6, 40"],
            ["/", "Divide — always a float", "2.5"],
            ["//", "Divide, discard the remainder", "2"],
            ["%", "The remainder only", "2"],
            ["**", "To the power of", "10000"],
          ],
          note: "% is more useful than it looks: `n % 2 == 0` is how you test whether a number is even, and it is how you take every third row.",
        },
      },
      {
        id: "a-py-fstrings",
        title: "f-strings — putting values inside text",
        explain:
          "Put an f before the opening quote and anything inside curly braces is replaced by its value. Add :, inside the braces and Python inserts thousands separators.",
        code: {
          code: 'state = "Lagos"\nrevenue = 276000\nprint(f"{state} made {revenue:,} naira")\n',
          expectedOutput: "Lagos made 276,000 naira",
        },
        why: "This is how a script reports its findings in words a person can read. 276000 is a number; 'Lagos made 276,000 naira' is a sentence, and the difference matters when the output is going into an email.",
        syntax: {
          pattern: 'f"text {variable} more text {number:,}"',
          args: [
            ["f", "Before the opening quote. Without it the braces are printed literally."],
            ["{variable}", "Replaced by that variable's value."],
            ["{number:,}", "Thousands separators — 276000 becomes 276,000."],
            ["{number:.1f}", "One decimal place. {number:.0%} formats a ratio as a percentage.", "optional"],
          ],
          returns: "A string with the values substituted in.",
          note: "Forgetting the f is the commonest mistake, and it fails quietly: you get the literal text {state} instead of Lagos, with no error at all.",
        },
      },
      {
        id: "a-py-string-methods",
        title: "String methods — the Power Query transforms, as code",
        explain:
          "Text carries its own set of instructions, reached with a dot. .strip() removes surrounding spaces, .title() capitalises each word, .lower() flattens case. len() counts characters.",
        codeExercise: {
          code: 'messy = "  lagos  "\nprint(messy.strip())\nprint(messy.strip().title())\nprint(len(messy))\nprint(len(messy.strip()))\n',
          question:
            'The variable holds "  lagos  " — with two spaces at each end. What do the four lines print?',
          expectedOutput: "lagos\nLagos\n9\n5",
          hint: "strip() removes the outer spaces. title() capitalises. len() counts every character INCLUDING spaces — so count them before and after stripping.",
          successMessage:
            "9 characters before stripping and 5 after — the four spaces are real characters. This is exactly the leading-space problem that silently cost ₦62,000 in the Month 2 project, and here len() makes it visible.",
        },
        table: {
          caption: "From Excel and Power Query to Python.",
          headers: ["Excel", "Power Query", "Python"],
          rows: [
            ["TRIM()", "Transform → Trim", ".strip()"],
            ["PROPER()", "Capitalize Each Word", ".title()"],
            ["LOWER()", "lowercase", ".lower()"],
            ["LEN()", "—", "len()"],
            ["SUBSTITUTE()", "Replace Values", ".replace(old, new)"],
            ["LEFT() / RIGHT()", "Extract", "[:n] / [-n:]"],
          ],
          note: "Methods chain left to right: messy.strip().title() strips first, then capitalises the result.",
        },
      },
      {
        id: "a-py-booleans",
        title: "Comparisons produce booleans",
        explain:
          "A comparison is a question, and its answer is True or False. == asks whether two things are equal; a single = would store instead of compare. and requires both sides; or requires either.",
        code: {
          code: "revenue = 276000\ntarget = 250000\nprint(revenue > target)\nprint(revenue == target)\nprint(revenue != target)\nprint(revenue > target and revenue < 300000)\n",
          expectedOutput: "True\nFalse\nTrue\nTrue",
        },
        why: "Every decision a program makes comes down to one of these. The next lesson uses them to choose between two paths, and the lesson after that uses them to decide which rows to keep.",
        mistake:
          "Writing = where you meant ==. One equals sign stores a value; two compare. In an if statement Python catches it, but inside a larger expression it can produce something that runs and is wrong.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l65-collections",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 5,
    title: "Lists, Dictionaries, Tuples and Sets",
    subtitle: "Holding many values in one name",
    estimatedMinutes: 17,
    intro:
      "One variable holding one value gets you nowhere with data. These four hold many, and each is shaped for a different job — which one you choose is usually obvious once you know what they are for.",

    atoms: [
      {
        id: "a-py-lists",
        title: "A list is an ordered row of values",
        explain:
          "Square brackets, values separated by commas. Positions are numbered from ZERO, and -1 means the last one. sum(), len(), max() and min() work on the whole list.",
        codeExercise: {
          code: "amounts = [45000, 62000, 38000, 51000]\nprint(amounts[0])\nprint(amounts[-1])\nprint(len(amounts))\nprint(sum(amounts))\n",
          question:
            "Four amounts in a list. What do these four lines print?",
          expectedOutput: "45000\n51000\n4\n196000",
          hint: "Counting starts at ZERO, so [0] is the first item. -1 counts from the end. len() is how many, sum() is the total.",
          successMessage:
            "Zero-based counting is the single most common source of off-by-one mistakes in programming. [0] is the first, and there is no [4] in a four-item list — asking for it raises an IndexError, which you will meet in lesson 68.",
        },
        table: {
          caption: "Positions in a four-item list.",
          headers: ["Position", "Also", "Value"],
          rows: [
            ["[0]", "[-4]", "45000"],
            ["[1]", "[-3]", "62000"],
            ["[2]", "[-2]", "38000"],
            ["[3]", "[-1]", "51000"],
          ],
          note: "There is no [4]. The last valid position is always one less than the length.",
        },
      },
      {
        id: "a-py-slicing",
        title: "Slicing takes a piece of a list",
        explain:
          "Two positions separated by a colon give you everything from the first up to but NOT INCLUDING the second. Leave one side blank to mean 'from the start' or 'to the end'.",
        code: {
          code: "amounts = [45000, 62000, 38000, 51000, 47000]\nprint(amounts[1:3])\nprint(amounts[:2])\nprint(amounts[2:])\n",
          expectedOutput: "[62000, 38000]\n[45000, 62000]\n[38000, 51000, 47000]",
        },
        why: "'Up to but not including' is the rule that catches everyone. [1:3] gives you two items, not three — positions 1 and 2. Once you accept that, slicing is the fastest way to take the first ten rows or the last month.",
        mistake:
          "Expecting [1:3] to include position 3. The end is exclusive, so the number of items you get is always end minus start.",
      },
      {
        id: "a-py-dicts",
        title: "A dictionary maps names to values",
        explain:
          "Curly braces holding key: value pairs. You look things up by name rather than position, which is what you want the moment the data has labels.",
        codeExercise: {
          code: 'revenue = {"Lagos": 276000, "Abuja": 215000, "Kano": 127000}\nprint(revenue["Lagos"])\nprint(len(revenue))\nprint(list(revenue.keys()))\nprint(sum(revenue.values()))\n',
          question:
            "A dictionary of revenue by state. What do these four lines print?",
          expectedOutput: "276000\n3\n['Lagos', 'Abuja', 'Kano']\n618000",
          hint: "Look up by key with square brackets. len() counts the pairs. .keys() gives the names, .values() gives the numbers.",
          successMessage:
            "₦618,000 — the same grand total as the Month 2 pivot table and the Month 3 model, arrived at a third way. A dictionary is the natural Python shape for 'a value per category'.",
        },
        table: {
          caption: "List against dictionary.",
          headers: ["", "List", "Dictionary"],
          rows: [
            ["Looked up by", "Position — [0]", 'Name — ["Lagos"]'],
            ["Good for", "A column of values", "A value per label"],
            ["Order matters?", "Yes", "Insertion order is kept, but you rarely rely on it"],
            ["Duplicate keys", "Duplicates fine", "Later one replaces the earlier"],
          ],
        },
      },
      {
        id: "a-py-get-and-sets",
        title: ".get() for safety, and sets for distinct values",
        explain:
          "Looking up a key that does not exist raises an error and stops the program. .get() returns None instead, or a default you supply. A set holds only distinct values, which makes counting them trivial.",
        code: {
          code: 'revenue = {"Lagos": 276000, "Abuja": 215000}\nprint(revenue.get("Kano"))\nprint(revenue.get("Kano", 0))\n',
          expectedOutput: "None\n0",
        },
        why: "This is the Month 2 blank-versus-zero decision in a third language. .get(key) returning None means 'we have no figure for Kano'; .get(key, 0) claims Kano sold nothing. They are different statements and only one of them is usually true.",
        table: {
          caption: "Distinct values with a set.",
          headers: ["Code", "Result", "Answers"],
          rows: [
            ['states = ["Lagos","Abuja","Lagos","Kano","Abuja"]', "—", "The raw column"],
            ["len(states)", "5", "How many orders?"],
            ["len(set(states))", "3", "How many different states?"],
            ["sorted(set(states))", "['Abuja', 'Kano', 'Lagos']", "Which states, in order?"],
          ],
          note: "len() against len(set()) is DISTINCTCOUNT from the DAX module, in two words of Python.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l66-conditions-and-loops",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 6,
    title: "Conditions and Loops",
    subtitle: "Making choices, and doing something to every row",
    estimatedMinutes: 18,
    intro:
      "Two constructs turn a list of instructions into a program that can handle data it has not seen: choosing between paths, and repeating work for every item. Almost everything you will write in the capstone is one of these two.",

    atoms: [
      {
        id: "a-py-if",
        title: "if, elif, else — choosing a path",
        explain:
          "if runs its block when the condition is True. elif checks another condition if the first was False. else runs when none matched. The indentation is what marks the block, and it is not optional.",
        code: {
          code: "amount = 45000\n\nif amount > 100000:\n    print(\"Large\")\nelif amount > 40000:\n    print(\"Medium\")\nelse:\n    print(\"Small\")\n",
          expectedOutput: "Medium",
        },
        why: "This is IF() from Excel, with one important difference: the conditions are checked IN ORDER and the first match wins. 45,000 is not greater than 100,000, so Python tries the next one — and having matched, it never tests the else.",
        table: {
          caption: "Why order matters.",
          headers: ["Order of conditions", "45000 gives", "Correct?"],
          rows: [
            ["> 100000, then > 40000", "Medium", "Yes"],
            ["> 40000, then > 100000", "Medium", "Yes here, wrong for 200000"],
          ],
          note: "Put the narrowest condition first. Written the other way round, 200,000 matches '> 40000' and is labelled Medium — and nothing errors.",
        },
        mistake:
          "Forgetting the colon at the end of the if line, or indenting inconsistently. Python uses indentation to decide what is inside the block, so a stray space is a syntax error rather than a style problem.",
      },
      {
        id: "a-py-for",
        title: "for — doing something to every item",
        explain:
          "A for loop takes each item of a list in turn, names it, and runs the indented block once per item. The name is yours to choose and exists only inside the loop.",
        code: {
          code: "amounts = [45000, 62000, 38000]\nfor amount in amounts:\n    print(amount)\n",
          expectedOutput: "45000\n62000\n38000",
        },
        why: "This is fill-down. One instruction, applied to every row, without writing it out per row — the same argument as dragging a formula down a column, with no limit on how far it drags.",
        trace: {
          headers: ["Pass", "amount", "Prints"],
          rows: [
            ["1st", "45000", "45000"],
            ["2nd", "62000", "62000"],
            ["3rd", "38000", "38000"],
          ],
          note: "Three items, three passes, three lines of output. The loop stops when the list runs out — you never say when to stop.",
        },
      },
      {
        id: "a-py-accumulate",
        title: "Building a running total",
        explain:
          "Start a variable at zero before the loop, and add to it inside. After the loop it holds the total. This is the single most common loop pattern there is.",
        codeExercise: {
          code: "amounts = [45000, 62000, 38000, 51000]\ntotal = 0\nfor amount in amounts:\n    total = total + amount\nprint(total)\n",
          question:
            "The print is OUTSIDE the loop, at the end. What does this print?",
          expectedOutput: "196000",
          hint: "The loop runs four times, adding one amount each pass. total starts at 0 and print happens once, after the loop finishes.",
          successMessage:
            "196,000 — one line, because print sits outside the loop. Indent that print by four spaces and it would print four times, showing 45000, 107000, 145000 and 196000. Indentation decides what is inside the loop, and that is the whole difference.",
        },
        trace: {
          headers: ["Pass", "amount", "total after adding"],
          rows: [
            ["before", "—", "0"],
            ["1st", "45000", "45000"],
            ["2nd", "62000", "107000"],
            ["3rd", "38000", "145000"],
            ["4th", "51000", "196000"],
          ],
          note: "Writing the table out like this is how you debug a loop that gives the wrong answer. It is also what print() inside the loop shows you for free.",
        },
      },
      {
        id: "a-py-loop-filter",
        title: "Looping with a condition — filtering",
        explain:
          "Put an if inside a for and you keep only the items that match. Append them to a new list and you have filtered the data — which is COUNTIFS and SUMIFS, written out longhand.",
        codeExercise: {
          code: "amounts = [45000, 62000, 38000, 51000, 98000]\nlarge = []\nfor amount in amounts:\n    if amount > 50000:\n        large.append(amount)\nprint(large)\nprint(len(large))\n",
          question:
            "Which amounts end up in the new list, and how many are there?",
          expectedOutput: "[62000, 51000, 98000]\n3",
          hint: "Go through the five amounts in order and keep only those strictly greater than 50,000. Note that 51,000 qualifies and 45,000 does not.",
          successMessage:
            "Three of the five, in their original order. You have just written SUMIFS' filter step by hand — and seeing it longhand is what makes pandas' one-line version make sense in the next module.",
        },
        table: {
          caption: "The same job, four tools.",
          headers: ["Tool", "How"],
          rows: [
            ["Excel", '=COUNTIF(range,">50000")'],
            ["Power Query", "Filter rows → greater than 50000"],
            ["DAX", "CALCULATE(..., Orders[Amount] > 50000)"],
            ["Python", "for + if + append"],
          ],
          note: "Python is the most verbose of the four here. It is also the only one that can then do anything at all with the result.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l67-functions",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 7,
    title: "Functions",
    subtitle: "Naming a piece of work so you can do it again",
    estimatedMinutes: 17,
    intro:
      "A function is a named block of code you can run whenever you like, with different inputs. It is the difference between cleaning one file and having a cleaner you can point at any file.",

    atoms: [
      {
        id: "a-py-def",
        title: "def, parameters and return",
        explain:
          "def names the function and lists what it needs. The indented block is its body. return hands a value back to whoever called it.",
        code: {
          code: "def average(numbers):\n    return sum(numbers) / len(numbers)\n\nprint(average([45000, 62000, 38000, 51000]))\n",
          expectedOutput: "49000.0",
        },
        why: "Write it once and call it wherever you need it. This is the same argument as a DAX measure over a repeated formula: one definition, one place to fix, every caller updated.",
        syntax: {
          pattern: "def name(parameter):\n    body\n    return value",
          args: [
            ["def", "Starts a definition. The function does not run yet."],
            ["name", "What you will call it. Same naming rules as a variable."],
            ["(parameter)", "What it needs in order to work. Several are separated by commas."],
            ["return", "Hands a value back. Without it the function returns None."],
          ],
          returns: "Whatever follows return, to whoever called the function.",
          note: "Note the output is 49000.0, not 49000 — division always produces a float, even when it divides evenly. That has surprised every Python beginner who ever lived.",
        },
      },
      {
        id: "a-py-print-vs-return",
        title: "print shows. return gives back.",
        explain:
          "print puts text on the screen and hands back nothing. return produces a value the rest of the program can use. A function that prints instead of returning cannot be built on.",
        codeExercise: {
          code: 'def show(name):\n    print(name)\n\nresult = show("Lagos")\nprint(result)\n',
          question:
            "This function prints but does not return. What are the TWO lines of output?",
          expectedOutput: "Lagos\nNone",
          hint: "The function prints its argument. Then result holds whatever the function gave back — and a function with no return statement gives back None.",
          successMessage:
            "Lagos, then None. This is the single most common confusion for beginners: the function showed you something and returned nothing, so `result` is empty. If you need the value later, return it.",
        },
        why: "You will hit this the first time you try to use a function's answer in a calculation and get a TypeError about None. The fix is always the same: the function printed when it should have returned.",
        mistake:
          "Writing a function that prints its result and then trying to add that result to something. print() returns None, and None will not add to anything.",
      },
      {
        id: "a-py-defaults",
        title: "Default values make a function flexible",
        explain:
          "Give a parameter a value in the definition and callers may leave it out. Pass something else and yours wins.",
        code: {
          code: "def is_large(amount, threshold=50000):\n    return amount > threshold\n\nprint(is_large(62000))\nprint(is_large(45000))\nprint(is_large(45000, 40000))\n",
          expectedOutput: "True\nFalse\nTrue",
        },
        why: "The threshold is documented in one place, and a caller who needs a different one says so explicitly. Compare the third call with the second: the same amount, a different rule, and the reader can see exactly what changed.",
      },
      {
        id: "a-py-reusable",
        title: "A function you will actually use",
        explain:
          "Percent of total, with the divide-by-zero case handled. This is the DIVIDE() lesson from DAX and the IFERROR lesson from Excel, written as three lines of Python.",
        codeExercise: {
          code: "def pct_of_total(part, total):\n    if total == 0:\n        return None\n    return round(part / total * 100, 1)\n\nprint(pct_of_total(276000, 618000))\nprint(pct_of_total(215000, 618000))\nprint(pct_of_total(127000, 618000))\nprint(pct_of_total(100, 0))\n",
          question:
            "The three state revenues against the ₦618,000 total, and then a call with a total of zero. What are the four lines?",
          expectedOutput: "44.7\n34.8\n20.6\nNone",
          hint: "Each of the first three is part ÷ total × 100, rounded to one decimal place. The fourth hits the guard clause at the top of the function.",
          successMessage:
            "44.7, 34.8, 20.6 — and None rather than a crash. Now add those three up: 100.1. Rounding each to one decimal place makes them total more than 100%, which is worth knowing BEFORE a client points at it. Either say the figures are rounded, or round the largest down.",
        },
        why: "The guard clause at the top — return early when the input is impossible — is a habit worth building now. It keeps the interesting logic unindented and makes the edge case impossible to miss.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  {
    id: "l68-errors-and-debugging",
    moduleId: "m4-python-foundations",
    sectionId: SECTION_ID,
    order: 8,
    title: "Errors and Debugging",
    subtitle: "Reading the message instead of fearing it",
    estimatedMinutes: 17,
    intro:
      "Your code will break constantly, and that is normal rather than a sign you are bad at this. Python's error messages are unusually helpful once you know how to read them — and unlike Excel, Python stops and tells you rather than quietly returning something wrong.",

    atoms: [
      {
        id: "a-py-read-error",
        title: "An error is a message, not a judgement",
        explain:
          "Python prints the type of problem, a description, and the line it happened on. Read the LAST line first — it names the error — then look at the line number.",
        code: {
          code: 'amount = "43000"\nprint(amount + 1000)\n',
          raises: 'TypeError: can only concatenate str (not "int") to str',
        },
        why: "That message is doing you a favour. It says the value is text and you tried to add a number to it — which is exactly the numbers-stored-as-text problem from Month 2, except Python refuses to guess. Excel would have quietly excluded the value from a SUM and given you a smaller total.",
        table: {
          caption: "Reading it in three steps.",
          headers: ["Step", "Question", "Here"],
          rows: [
            ["1", "What kind of error?", "TypeError — a wrong type of value"],
            ["2", "What does the text say?", "You cannot add an int to a str"],
            ["3", "Which line?", "Line 2, the print"],
          ],
          note: "The fix follows from step 2: convert first, with int(amount) + 1000.",
        },
      },
      {
        id: "a-py-common-errors",
        title: "The four errors you will actually meet",
        explain:
          "TypeError means the wrong kind of value. KeyError means a dictionary key that does not exist. IndexError means a list position past the end. ZeroDivisionError means what it says.",
        code: {
          code: 'revenue = {"Lagos": 276000}\nprint(revenue["Kano"])\n',
          raises: "KeyError: 'Kano'",
        },
        table: {
          caption: "What each one means, and the usual fix.",
          headers: ["Error", "Cause", "Fix"],
          rows: [
            ["TypeError", "Text where a number was needed", "Convert with int() or float()"],
            ["KeyError: 'Kano'", "That key is not in the dictionary", "Use .get(key) or check spelling"],
            ["IndexError", "A list position past the end", "Remember zero-based counting"],
            ["ZeroDivisionError", "A denominator of zero", "Guard the division with an if"],
            ["NameError", "A name Python has never seen", "Check the spelling, or define it first"],
            ["IndentationError", "The blocks do not line up", "Use four spaces, consistently"],
          ],
          note: "Each of these names its own cause. The error type is the diagnosis; the text is the detail.",
        },
        why: "Every one of these has a direct equivalent in what you already know. KeyError is the (Blank) row from the modelling module — a key that does not exist in the dimension — except Python stops rather than quietly grouping it under blank.",
      },
      {
        id: "a-py-predict-error",
        title: "Predict the error",
        explain:
          "Reading a traceback before you run the code is the same skill as predicting output. Work out what Python will object to, and why.",
        codeExercise: {
          code: "amounts = [45000, 62000]\nprint(amounts[5])\n",
          question:
            "The list has two items. What does Python say when you ask for position 5? Type the error line exactly.",
          raises: "IndexError: list index out of range",
          hint: "The type of error names the problem. Positions run from 0 to one less than the length — so this two-item list has 0 and 1 only.",
          successMessage:
            "IndexError: list index out of range. Positions in a two-item list are 0 and 1; there is no 5, and there is not even a 2. Off-by-one mistakes are the most common bug in programming and this is what they look like.",
        },
      },
      {
        id: "a-py-debug-with-print",
        title: "Debugging with print()",
        explain:
          "When you cannot see what is wrong, print the thing. Print the value and its type just before the line that fails, and the cause is usually obvious immediately.",
        code: {
          code: 'amounts = [45000, "62000", 38000]\ntotal = 0\nfor amount in amounts:\n    print("about to add:", amount, type(amount))\n    total = total + int(amount)\nprint(total)\n',
          expectedOutput:
            "about to add: 45000 <class 'int'>\nabout to add: 62000 <class 'str'>\nabout to add: 38000 <class 'int'>\n145000",
        },
        why: "Look at the second line of output: 62000 is a str while its neighbours are ints. Printing the type is what makes an invisible problem visible, and it is the same diagnosis ISNUMBER gave you in the Month 2 project — one value in a numeric column is text.",
        table: {
          caption: "A debugging routine that works.",
          headers: ["Step", "Do"],
          rows: [
            ["1", "Read the last line of the error — it names the type"],
            ["2", "Go to the line number it gives you"],
            ["3", "print() the values on that line, with their type()"],
            ["4", "Change ONE thing, run again"],
            ["5", "Remove the prints once it works"],
          ],
          note: "Step 4 is the discipline. Changing three things at once and having it work teaches you nothing about which one mattered.",
        },
        mistake:
          "Rewriting the whole block when it breaks. The error named a line; start there. Rewriting loses the parts that were already correct.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];
