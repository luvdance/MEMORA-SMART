/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 1 · INTRODUCTION TO ALGORITHMS
 *
 * Curriculum 1.1 – 1.10. What an algorithm is, its five characteristics,
 * algorithms versus programs, applications, how a computer executes
 * instructions, problem solving and computational thinking. The practical
 * exercises from the curriculum (average of five numbers, even or odd,
 * largest of three, ATM withdrawal, pass or fail) are written and run here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s1-intro";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l1-what-is-an-algorithm",
    moduleId: "al-m1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2"],
    title: "What Is an Algorithm?",
    subtitle: "The method behind every program",
    estimatedMinutes: 18,
    intro:
      "Every program you have ever used, from a calculator to a search engine, is an algorithm written in a programming language. This course is about the algorithm itself: how to design one, how to prove it works, and how to tell a fast one from a slow one before you ever run it.",

    atoms: [
      {
        id: "a-al-what-is-algorithm",
        title: "An algorithm is a precise, finite method",
        explain:
          "An algorithm is a finite sequence of precise, unambiguous instructions that takes some input and produces an output, solving every instance of a problem, not just one. \"Add 7 and 5\" is a calculation; \"to add two whole numbers, add the units, carry, then add the tens...\" is an algorithm, because it works for any two numbers. The word comes from al-Khwarizmi, the ninth-century mathematician whose book taught step-by-step methods for arithmetic. One of the oldest algorithms still in use is Euclid's, for the greatest common divisor (GCD): replace the pair (a, b) by (b, a mod b) until b is 0; then a is the answer.",
        table: {
          caption: "A problem is defined by its input and output. An algorithm is a method that gets from one to the other.",
          headers: ["Problem", "Input", "Output", "One algorithm"],
          rows: [
            ["Greatest common divisor", "Two positive integers a, b", "The largest integer dividing both", "Euclid's algorithm"],
            ["Searching", "A list and a target value", "The target's position, or 'not found'", "Linear search, binary search"],
            ["Sorting", "A list of n values", "The same values in order", "Insertion sort, merge sort"],
            ["Shortest route", "A road map, a start and a destination", "The shortest path", "Dijkstra's algorithm"],
          ],
        },
        decision: {
          scenario: "A friend writes down four sets of instructions and asks which of them is an algorithm.",
          question: "Which one is an algorithm in the technical sense?",
          options: [
            {
              id: "a",
              text: "\"Cook the rice until it looks done.\"",
              whyWrong: "\"Looks done\" is not precise: two people would stop at different times. Every step of an algorithm must be unambiguous.",
            },
            {
              id: "b",
              text: "\"Keep adding 1 to x forever.\"",
              whyWrong: "It never stops and never produces an output. An algorithm must finish after a finite number of steps.",
            },
            {
              id: "c",
              text: "\"Given two positive whole numbers, repeatedly replace the larger by the difference of the two until they are equal; output that value.\"",
              why: "It has defined input, precise steps, it always stops (the numbers shrink and stay positive), and it outputs the GCD. This is Euclid's original subtraction form.",
            },
            {
              id: "d",
              text: "\"The answer to 18 ÷ 3 is 6.\"",
              whyWrong: "That is one fact, not a method. An algorithm solves every instance of a problem, not a single one.",
            },
          ],
          correct: "c",
          aftermath: "Input, precise steps, guaranteed to stop, output, and it works for every valid input. Lesson 2 names these properties formally.",
        },
      },
      {
        id: "a-al-algorithms-and-programming",
        title: "Algorithms and programming",
        explain:
          "Programming is expressing an algorithm in a language a computer can run. The algorithm is the idea; the program is one implementation of it. The same algorithm can be written in Python, C++ or Java, or in plain English, and it is still the same algorithm with the same speed and the same correctness. That is why this course studies algorithms independently of a language: an improvement in the algorithm helps every implementation, while no amount of clever coding rescues a bad algorithm. In this course you will write every algorithm in Python, because it reads almost like pseudocode.",
        code: {
          language: PY,
          code: py`def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(gcd(48, 18))
print(gcd(270, 192))
print(gcd(17, 5))
`,
          expectedOutput: "6\n6\n1",
        },
        why: "Euclid's algorithm in four lines of Python. a % b is the remainder of a divided by b, and a, b = b, a % b replaces both values at once. Trace gcd(48, 18): (48, 18) → (18, 12) → (12, 6) → (6, 0), so the answer is 6.",
      },
      {
        id: "a-al-python-in-course",
        title: "Your first algorithm: the average of five numbers",
        explain:
          "In this course an algorithm is usually written as a Python function: def gives it a name and its inputs (parameters), the indented body is the method, and return hands back the output. The practice editors run real Python in the page and check your function with tests. The algorithm for an average is: add the values, then divide the sum by how many there are. Write it step by step: input, processing, output.",
        code: {
          language: PY,
          code: py`def average_of_three(a, b, c):
    total = a + b + c
    return total / 3

print(average_of_three(60, 70, 80))
`,
          expectedOutput: "70.0",
        },
        codeChallenge: {
          task: "Write average(a, b, c, d, e) that returns the average of its five numbers. Calculate the sum first, then divide it by 5.",
          starter: "def average(a, b, c, d, e):\n    # 1. add the five numbers\n    # 2. divide the total by 5 and return it\n    pass\n",
          sample: "average(10, 20, 30, 40, 50) → 30.0",
          tests: [
            {
              check: py`assert average(10, 20, 30, 40, 50) == 30, "average(10, 20, 30, 40, 50) should be 30. Got " + repr(average(10, 20, 30, 40, 50))
assert average(1, 2, 3, 4, 5) == 3, "average(1, 2, 3, 4, 5) should be 3."
assert average(0, 0, 0, 0, 1) == 0.2, "Divide by 5, not 4: average(0, 0, 0, 0, 1) is 0.2."
assert average(-5, 5, -5, 5, 0) == 0, "Negative numbers work the same way."`,
            },
          ],
          solution: "def average(a, b, c, d, e):\n    total = a + b + c + d + e\n    return total / 5\n",
          hint: "total = a + b + c + d + e, then return total / 5.",
          successMessage: "Input (five numbers), processing (sum, then divide), output (the average). Every algorithm in this course has that shape.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.3 – 1.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l2-good-algorithm",
    moduleId: "al-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.3", "1.4"],
    title: "What Makes a Good Algorithm",
    subtitle: "Five characteristics, and algorithms versus programs",
    estimatedMinutes: 20,
    intro:
      "Not every list of instructions is an algorithm. Five properties, first set out by Donald Knuth, separate a real algorithm from a vague recipe. Examiners ask for them by name, and every design you make in this course will be checked against them.",

    atoms: [
      {
        id: "a-al-five-characteristics",
        title: "Correctness, finiteness, definiteness, input/output, effectiveness",
        explain:
          "A good algorithm has five characteristics. CORRECTNESS: for every valid input it produces the right output. FINITENESS: it always stops after a finite number of steps. DEFINITENESS: every step is precisely and unambiguously defined. INPUT AND OUTPUT: it takes zero or more well-defined inputs and produces at least one output. EFFECTIVENESS: every step is basic enough to be carried out exactly, in finite time, with pencil and paper in principle.",
        table: {
          caption: "The five characteristics, and what violating each looks like.",
          headers: ["Characteristic", "Meaning", "Violated by"],
          rows: [
            ["Correctness", "Right output for every valid input", "A grading rule that gives 'Fail' for a score of exactly 50 when 50 is a pass"],
            ["Finiteness", "Always terminates", "while n != 0: n = n - 2, started with an odd n"],
            ["Definiteness", "Each step has one meaning", "\"Add a little salt\", \"choose a good pivot\""],
            ["Input / output", "Defined inputs, at least one output", "A procedure that computes a total but never reports it"],
            ["Effectiveness", "Each step can actually be done", "\"Write down every digit of π\", \"pick the winning lottery number\""],
          ],
        },
        decision: {
          scenario: "A recipe app says: \"Step 4: season to taste. Step 5: bake until golden.\" A programmer is asked to automate it.",
          question: "Which characteristic of an algorithm do these steps fail first?",
          options: [
            {
              id: "a",
              text: "Definiteness",
              why: "\"To taste\" and \"until golden\" mean different things to different people. A machine needs an exact rule: 5 g of salt; bake 25 minutes at 180 °C.",
            },
            {
              id: "b",
              text: "Finiteness",
              whyWrong: "Baking does end. The problem is that nobody can say exactly when, which is a definiteness problem.",
            },
            {
              id: "c",
              text: "Input",
              whyWrong: "The ingredients are well-defined inputs. The steps that use them are what is vague.",
            },
            {
              id: "d",
              text: "Effectiveness",
              whyWrong: "Seasoning and baking can be done; they are just not specified exactly.",
            },
          ],
          correct: "a",
          aftermath: "Vagueness is the most common reason a human procedure cannot be turned directly into code.",
        },
      },
      {
        id: "a-al-finiteness-and-correctness",
        title: "Proving finiteness and correctness: even or odd",
        explain:
          "Here is an algorithm for deciding whether a whole number n ≥ 0 is even: subtract 2 repeatedly while the number is at least 2; if 0 is left it was even, if 1 is left it was odd. It is FINITE because n falls by 2 each step and the loop stops once it is below 2. It is CORRECT because subtracting 2 never changes whether a number is even, so the leftover 0 or 1 has the same parity as n. Notice the precondition n ≥ 0: for a negative n the loop would not run at all and a negative value would be left, so the algorithm is only defined for its stated inputs. Arguments like these are how correctness and finiteness are proved, not just tested.",
        codeExercise: {
          language: "pseudocode",
          code: "SET n TO 7\nSET steps TO 0\nWHILE n >= 2 DO\n    SET n TO n - 2\n    SET steps TO steps + 1\nEND WHILE\nOUTPUT n, steps\n",
          equivalentPython: "n = 7\nsteps = 0\nwhile n >= 2:\n    n = n - 2\n    steps = steps + 1\nprint(n, steps)\n",
          question: "Trace the even/odd algorithm for n = 7. What does it output (the leftover value, then the number of subtractions)?",
          expectedOutput: "1 3",
          hint: "7 → 5 → 3 → 1. Count the arrows.",
          successMessage: "1 is left after 3 subtractions, so 7 is odd. For any n the loop runs ⌊n/2⌋ times: that bound is the finiteness proof.",
        },
      },
      {
        id: "a-al-algorithm-vs-program",
        title: "Algorithms versus programs",
        explain:
          "An ALGORITHM is a language-independent method; it must terminate, and it is written in whatever notation is clearest (English, pseudocode, a flowchart). A PROGRAM is an algorithm expressed in a specific programming language, with all its details: types, syntax, memory, error handling. A program need not terminate (an operating system or a web server is designed to run forever), and it can contain bugs that the algorithm does not, such as an off-by-one index. You analyse the algorithm; you test the program.",
        table: {
          caption: "The same idea at two levels.",
          headers: ["", "Algorithm", "Program"],
          rows: [
            ["Written in", "Natural language, pseudocode or a flowchart", "A programming language (Python, C++, Java)"],
            ["Must terminate?", "Yes, by definition", "No: servers and operating systems loop forever"],
            ["Depends on hardware or language?", "No", "Yes"],
            ["Checked by", "Proof and analysis", "Testing and debugging"],
            ["Example", "\"Halve the search range each step\"", "A 12-line binary_search function in Python"],
          ],
        },
        codeChallenge: {
          task: "Implement the even/odd algorithm as a program: write parity(n) that returns the text \"even\" or \"odd\" for ANY whole number n, including 0 and negative numbers. You may use the remainder operator %.",
          starter: "def parity(n):\n    pass\n",
          sample: "parity(7) → \"odd\"\nparity(-4) → \"even\"",
          tests: [
            {
              check: py`for n, want in [(0, "even"), (1, "odd"), (2, "even"), (7, "odd"), (10, "even")]:
    assert parity(n) == want, f"parity({n}) should be {want!r}, got {parity(n)!r}"
assert parity(-4) == "even" and parity(-3) == "odd", "Negative numbers have a parity too: -4 is even, -3 is odd."
assert parity(10**12 + 1) == "odd", "Your program must also be fast for a huge number such as 10**12 + 1."`,
            },
          ],
          solution: "def parity(n):\n    if n % 2 == 0:\n        return \"even\"\n    return \"odd\"\n",
          hint: "n % 2 is the remainder after dividing by 2. In Python it is 0 or 1 even for negative n.",
          successMessage: "One remainder instead of n/2 subtractions: the same problem, a far better algorithm. Comparing methods like these is what the rest of the course is about.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.5 – 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l3-algorithms-at-work",
    moduleId: "al-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.5", "1.6", "1.7"],
    title: "Algorithms at Work",
    subtitle: "Real applications, how computers execute instructions, and solving problems",
    estimatedMinutes: 20,
    intro:
      "Algorithms are not academic. They decide which route your map suggests, which transactions your bank blocks and which posts you see. This lesson shows where they live, what a computer actually does when it runs one, and a method for solving problems you have never seen.",

    atoms: [
      {
        id: "a-al-real-world-applications",
        title: "Real-world applications",
        explain:
          "Behind every large system is a small number of well-understood algorithms. Search engines use indexing and ranking; maps use shortest-path algorithms; banks use pattern detection to flag fraud; messaging apps use cryptographic algorithms; file formats such as ZIP and JPEG use compression algorithms; shops use recommendation algorithms. You will meet most of these algorithms by name in this course, and Module 17 returns to them in detail.",
        table: {
          caption: "Everyday systems and the algorithms inside them.",
          headers: ["System", "Problem", "Algorithm family", "Module"],
          rows: [
            ["Maps and ride-hailing", "Fastest route between two places", "Shortest paths (Dijkstra)", "15"],
            ["Search engine", "Find matching pages in milliseconds", "Hashing, indexing, sorting by score", "8, 10, 17"],
            ["Banking", "Spot unusual transactions", "Searching, statistics, graph analysis", "9, 15, 17"],
            ["File compression", "Store data in fewer bits", "Huffman coding (greedy)", "13"],
            ["Delivery planning", "Visit many stops cheaply", "Travelling Salesperson, approximation", "16"],
            ["Spell checking, DNA comparison", "How similar are two strings?", "Dynamic programming (LCS, edit distance)", "14"],
          ],
        },
      },
      {
        id: "a-al-how-computers-execute",
        title: "How computers execute instructions",
        explain:
          "A processor runs the FETCH–DECODE–EXECUTE cycle billions of times a second: fetch the next instruction from memory (its address is in the program counter), decode what it means, execute it, and move the program counter on. Instructions run one after another unless a jump changes the program counter: that is how decisions (if) and loops (while) work. Each simple instruction (an addition, a comparison, a memory read) takes roughly constant time. That is the basis of algorithm analysis: count the simple steps an algorithm performs, and you know how its running time grows. Python is first compiled to bytecode, simple instructions that the Python virtual machine executes in the same fetch–decode–execute way.",
        codeExercise: {
          language: PY,
          code: py`x = 3
y = x * 2
x = y + 1
y = x - y
print(x, y)
`,
          question: "Instructions run strictly in order, each using the values left by the ones before it. What does this print?",
          expectedOutput: "7 1",
          hint: "After line 2, y is 6. Line 3 makes x 7. Line 4 uses the NEW x.",
          successMessage: "7 1. Each instruction sees the state left by the previous one. Dry-running (Module 2) is doing exactly this by hand.",
        },
      },
      {
        id: "a-al-problem-solving",
        title: "A problem-solving method: the largest of three",
        explain:
          "George Pólya's four steps work for any algorithm problem. 1. UNDERSTAND the problem: what are the inputs, the output, the constraints? 2. PLAN: work small examples by hand, look for a pattern or a known technique. 3. CARRY OUT the plan: write it as pseudocode, then code. 4. LOOK BACK: test it on edge cases (equal values, negatives, extremes) and ask if it can be simpler. For the largest of three numbers: assume the first is the largest, compare it with each of the others, and keep whichever is bigger. Two comparisons are always enough.",
        code: {
          language: "pseudocode",
          code: "INPUT a, b, c\nSET largest TO a\nIF b > largest THEN SET largest TO b\nIF c > largest THEN SET largest TO c\nOUTPUT largest\n",
          equivalentPython: "a, b, c = 4, 9, 2\nlargest = a\nif b > largest:\n    largest = b\nif c > largest:\n    largest = c\nprint(largest)\n",
          expectedOutput: "9",
        },
        codeChallenge: {
          task: "Write largest(a, b, c) that returns the largest of three numbers using comparisons. Do not use the built-in max() or sorted().",
          starter: "def largest(a, b, c):\n    pass\n",
          sample: "largest(4, 9, 2) → 9",
          tests: [
            {
              check: py`import itertools
for trio in itertools.permutations([3, 8, 5]):
    assert largest(*trio) == 8, f"largest{trio} should be 8, got {largest(*trio)}"
assert largest(7, 7, 2) == 7 and largest(2, 7, 7) == 7, "Equal values: the answer is still 7."
assert largest(-1, -9, -4) == -1, "With negatives, -1 is the largest."
assert largest(5, 5, 5) == 5, "Three equal values."
assert not calls("max") and not calls("sorted") and not calls("sort"), "Use comparisons, not max() or sorting."`,
            },
          ],
          solution: "def largest(a, b, c):\n    result = a\n    if b > result:\n        result = b\n    if c > result:\n        result = c\n    return result\n",
          hint: "Start with result = a. If b is bigger, keep b. Then do the same with c.",
          successMessage: "You tested all six orderings, ties and negatives: that is Pólya's step 4. The same \"keep the best so far\" idea finds the maximum of a million numbers.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.8 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l4-computational-thinking",
    moduleId: "al-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.8", "1.9", "1.10"],
    title: "Computational Thinking",
    subtitle: "Decomposition, patterns, abstraction, and design versus implementation",
    estimatedMinutes: 22,
    intro:
      "Computational thinking is the habit of framing a problem so that a computer can solve it. Its tools (decomposition, pattern recognition and abstraction) are how you will attack every problem in this course, from an ATM to a route planner.",

    atoms: [
      {
        id: "a-al-computational-thinking",
        title: "The four pillars of computational thinking",
        explain:
          "Computational thinking has four parts. DECOMPOSITION: break a big problem into smaller ones you can solve separately. PATTERN RECOGNITION: notice that a new problem, or a part of it, is like one you have solved before. ABSTRACTION: keep only the details that matter and ignore the rest (a map for route planning keeps roads and distances and drops building colours). ALGORITHM DESIGN: write the steps that solve it. These are not only for programmers; they are how engineers, doctors and planners solve problems too.",
        decision: {
          scenario: "You are designing a school timetable system. You notice that \"no teacher in two rooms at once\" is the same kind of problem as \"no two exams for one student at the same time\".",
          question: "Which pillar of computational thinking is this?",
          options: [
            { id: "a", text: "Decomposition", whyWrong: "Decomposition breaks a problem into parts; here you are noticing two problems are alike." },
            {
              id: "b",
              text: "Pattern recognition",
              why: "Seeing that two problems share a structure means one solution can serve both. (Both are graph colouring problems, which you will meet in Module 16.)",
            },
            { id: "c", text: "Abstraction", whyWrong: "Abstraction removes irrelevant detail; recognising a shared structure is pattern recognition." },
            { id: "d", text: "Effectiveness", whyWrong: "Effectiveness is a property of an algorithm's steps, not a thinking technique." },
          ],
          correct: "b",
          aftermath: "Recognising a known problem inside a new one is the single most valuable skill in algorithm design.",
        },
      },
      {
        id: "a-al-decomposition-abstraction",
        title: "Decomposition and abstraction: an ATM withdrawal",
        explain:
          "Decompose \"withdraw cash\" into sub-problems: authenticate the card and PIN; read the amount; VALIDATE it (positive, a multiple of the smallest note the machine holds); CHECK the balance; dispense and update the balance; report the result. Abstraction means the withdrawal algorithm needs only two numbers, the balance and the amount, not the colour of the card or the bank's address. Each sub-problem becomes a small, testable step. Order matters: an invalid amount should be rejected before the balance is even checked.",
        code: {
          language: "pseudocode",
          code: "INPUT balance, amount\nIF amount <= 0 OR amount MOD 1000 != 0 THEN\n    OUTPUT \"Invalid amount\"\nELSE IF amount > balance THEN\n    OUTPUT \"Insufficient funds\"\nELSE\n    SET balance TO balance - amount\n    OUTPUT \"Approved\", balance\nEND IF\n",
          equivalentPython: "balance, amount = 25000, 7000\nif amount <= 0 or amount % 1000 != 0:\n    print(\"Invalid amount\")\nelif amount > balance:\n    print(\"Insufficient funds\")\nelse:\n    balance = balance - amount\n    print(\"Approved\", balance)\n",
          expectedOutput: "Approved 18000",
        },
        codeChallenge: {
          task: "Write withdraw(balance, amount) for an ATM that only holds 1000-naira notes. Return a tuple (new_balance, message): if the amount is not positive or not a multiple of 1000, return (balance, \"Invalid amount\"); if it is more than the balance, return (balance, \"Insufficient funds\"); otherwise return (balance - amount, \"Approved\").",
          starter: "def withdraw(balance, amount):\n    pass\n",
          sample: "withdraw(25000, 7000) → (18000, \"Approved\")\nwithdraw(25000, 7500) → (25000, \"Invalid amount\")",
          tests: [
            {
              check: py`assert withdraw(25000, 7000) == (18000, "Approved"), "withdraw(25000, 7000) should be (18000, 'Approved'). Got " + repr(withdraw(25000, 7000))
assert withdraw(25000, 25000) == (0, "Approved"), "Withdrawing the whole balance is allowed."
assert withdraw(25000, 26000) == (25000, "Insufficient funds"), "26000 is more than the balance."
assert withdraw(25000, 7500) == (25000, "Invalid amount"), "7500 is not a multiple of 1000."
assert withdraw(25000, 0) == (25000, "Invalid amount") and withdraw(25000, -1000) == (25000, "Invalid amount"), "Zero and negative amounts are invalid."
assert withdraw(500, 1500) == (500, "Invalid amount"), "Validate the amount BEFORE checking the balance: 1500 is invalid whatever the balance."`,
            },
          ],
          solution: "def withdraw(balance, amount):\n    if amount <= 0 or amount % 1000 != 0:\n        return balance, \"Invalid amount\"\n    if amount > balance:\n        return balance, \"Insufficient funds\"\n    return balance - amount, \"Approved\"\n",
          hint: "Three checks in order: invalid amount, then insufficient funds, then approve. Return a pair each time.",
          successMessage: "Decomposed, abstracted to two numbers, and ordered so the cheapest, most basic check comes first.",
        },
      },
      {
        id: "a-al-design-vs-implementation",
        title: "Algorithm design versus implementation",
        explain:
          "DESIGN is deciding the method and arguing it is correct and efficient, independent of any language: \"compare the score with the pass mark; reject scores outside 0 to 100\". IMPLEMENTATION is turning that design into working code, with every detail a language demands: the exact comparison (>= or >), data types, invalid input, naming. Most bugs are implementation bugs at the BOUNDARIES of a correct design: a score of exactly 50, an empty list, the last item. Designers think about the cases; implementers must test them.",
        codeChallenge: {
          task: "Implement the pass/fail design. Write result(score) that returns \"Invalid\" if score is below 0 or above 100, \"Pass\" if it is 50 or more, and \"Fail\" otherwise.",
          starter: "def result(score):\n    pass\n",
          sample: "result(50) → \"Pass\"\nresult(49) → \"Fail\"\nresult(101) → \"Invalid\"",
          tests: [
            {
              check: py`cases = {0: "Fail", 49: "Fail", 50: "Pass", 51: "Pass", 100: "Pass", -1: "Invalid", 101: "Invalid", 49.5: "Fail"}
for score, want in cases.items():
    assert result(score) == want, f"result({score}) should be {want!r}, got {result(score)!r}"`,
            },
          ],
          solution: "def result(score):\n    if score < 0 or score > 100:\n        return \"Invalid\"\n    if score >= 50:\n        return \"Pass\"\n    return \"Fail\"\n",
          hint: "Check for invalid scores first. Then score >= 50 (not > 50) is a pass.",
          successMessage: "The tests hit every boundary: -1, 0, 49, 50, 100 and 101. Testing at the edges is how an implementation is shown to match its design.",
        },
      },
    ],

    task: {
      title: "Module 1 practice: five algorithms, designed then implemented",
      intro:
        "For each problem, write the algorithm in numbered steps first (inputs, steps, output), check it against the five characteristics, then implement it in Python and test it on normal and boundary inputs.",
      prompts: [
        "Write an algorithm for calculating the average of five numbers. What happens if the numbers are typed as text?",
        "Design an algorithm for determining whether a number is even or odd, then argue in two sentences that it is finite and correct.",
        "Create an algorithm for finding the largest of three numbers. How many comparisons does it need? Can any correct algorithm use fewer?",
        "Design a simple ATM withdrawal process, decomposed into sub-problems: card and PIN check, amount validation, balance check, dispensing, receipt.",
        "Develop an algorithm for determining whether a student passed or failed, and list every boundary value you would test.",
      ],
      closing:
        "Keep these. In Module 2 you will express the same algorithms as pseudocode and flowcharts, and trace them by hand.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
