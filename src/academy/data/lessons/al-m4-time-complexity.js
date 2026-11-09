/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 4 · TIME COMPLEXITY
 *
 * Curriculum 4.1 – 4.14. Counting basic operations as a function of n:
 * constant-time operations, loops, sequences, conditionals, nested and
 * consecutive loops, different increments, logarithmic loops, recursion, and
 * deriving complexity from pseudocode and from real Python. Learners derive
 * the standard results (the table in the curriculum) rather than memorise
 * them: every count is checked by running the code.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s4-time-complexity";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.1 – 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l13-counting-operations",
    moduleId: "al-m4-time-complexity",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3", "4.4"],
    title: "Time Complexity and Counting Operations",
    subtitle: "T(n): the number of basic steps for an input of size n",
    estimatedMinutes: 24,
    intro:
      "Time complexity turns \"how fast is it?\" into mathematics. Choose what n measures, decide what counts as one basic operation, and count how many the algorithm performs. The result, T(n), is the foundation of everything in Phase 2.",

    atoms: [
      {
        id: "a-al-time-complexity-def",
        title: "What is time complexity?",
        explain:
          "The TIME COMPLEXITY of an algorithm is the function T(n) giving the number of basic operations it performs on an input of size n (usually in the worst case). The input size n is whatever drives the work: list length, number of digits, number of vertices. We then care about how T(n) GROWS: T(n) = 3n + 2 and T(n) = 100n both grow linearly, while T(n) = n² grows quadratically and, for large enough n, always overtakes them. Module 5 makes \"grows like\" precise with Big O notation; this module is about getting T(n) right.",
        table: {
          caption: "Choosing n for different problems.",
          headers: ["Problem", "Natural input size n"],
          rows: [
            ["Search or sort a list", "Number of items"],
            ["Add or multiply two integers", "Number of digits (or bits)"],
            ["Process a graph", "Number of vertices V and edges E (two parameters)"],
            ["Process a matrix", "Number of rows and columns"],
            ["Process text", "Number of characters"],
          ],
        },
      },
      {
        id: "a-al-counting-operations",
        title: "Counting basic operations",
        explain:
          "A BASIC OPERATION is one that takes constant time: an assignment, an arithmetic operation, a comparison, reading or writing one array element, a function call's overhead. The counting method: for each line, write its cost and how many TIMES it executes; T(n) is the sum of cost × times. A loop header for i in range(n) is tested n + 1 times in the textbook model (the last test fails), and its body runs n times. In practice we usually count one chosen dominant operation, such as comparisons in a search, because it gives the same growth with less bookkeeping.",
        table: {
          caption: "Counting sum_list(items): total ← 0; FOR each x IN items: total ← total + x; RETURN total.",
          headers: ["Line", "Cost", "Times", "Total"],
          rows: [
            ["total ← 0", "c₁", "1", "c₁"],
            ["FOR each x IN items", "c₂", "n + 1", "c₂(n + 1)"],
            ["total ← total + x", "c₃", "n", "c₃n"],
            ["RETURN total", "c₄", "1", "c₄"],
            ["T(n)", "", "", "(c₂ + c₃)n + (c₁ + c₂ + c₄) = an + b"],
          ],
        },
        codeExercise: {
          language: PY,
          code: py`def count_comparisons(items):
    count = 0
    for i in range(len(items)):
        for j in range(len(items)):
            count += 1          # one comparison of items[i] with items[j]
    return count

print(count_comparisons(list(range(7))))
`,
          question: "This counts the comparisons made by an algorithm that compares every item with every item (including itself). What does it print for 7 items?",
          expectedOutput: "49",
          hint: "The inner line runs 7 times for each of the 7 outer iterations.",
          successMessage: "49 = 7². T(n) = n²: every pair, both orders, including each item with itself.",
        },
      },
      {
        id: "a-al-constant-time",
        title: "Understanding constant-time operations",
        explain:
          "An operation is CONSTANT TIME, O(1), if its cost does not depend on n. In Python these are constant time: arithmetic on ordinary numbers, assignment, items[i], len(items), appending to the end of a list (on average), and looking up a key in a dict or set (on average). These are NOT constant time, despite being one line: x in a_list (scans the list), a_list.index(x), sum(a_list), max(a_list), a_list[a:b] (copies the slice), a_list.insert(0, x) and a_list.pop(0) (shift every item), and sorted(a_list). One line of code can hide a whole loop.",
        decision: {
          scenario: "Inside a loop over n customers, a programmer writes `if customer_id in seen_list:` where seen_list grows to n items.",
          question: "What is the cost of that one line, and what does it do to the whole loop?",
          options: [
            { id: "a", text: "O(1), so the loop is O(n)", whyWrong: "`in` on a list scans it item by item: up to n comparisons." },
            {
              id: "b",
              text: "Up to n comparisons, so the loop does up to n × n: O(n²)",
              why: "A hidden linear scan inside a loop of n makes the algorithm quadratic. Using a set (seen_set) makes the check O(1) on average and the loop O(n).",
            },
            { id: "c", text: "O(log n), because Python sorts the list first", whyWrong: "Python does not sort; `in` on a list is a linear scan." },
            { id: "d", text: "It depends on the processor", whyWrong: "The growth depends on the data structure, not the processor." },
          ],
          correct: "b",
          aftermath: "Know the cost of every built-in you call. list.__contains__ is O(n); set.__contains__ is O(1) on average.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 4.5 – 4.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l14-loops-sequences-conditions",
    moduleId: "al-m4-time-complexity",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.5", "4.6", "4.7"],
    title: "Loops, Sequences and Conditions",
    subtitle: "Counting iterations, adding sequential costs, bounding branches",
    estimatedMinutes: 24,
    intro:
      "Three rules cover most code: a loop costs its number of iterations times the cost of its body; statements in sequence add their costs; an if/else costs the test plus its more expensive branch.",

    atoms: [
      {
        id: "a-al-counting-iterations",
        title: "Counting iterations in loops",
        explain:
          "A loop's cost is (number of iterations) × (cost of one iteration). For range(start, stop, step) with a positive step, the number of iterations is ⌈(stop − start) / step⌉ when stop > start, and 0 otherwise. So range(n) runs n times, range(1, n + 1) runs n times, and range(0, n, 2) runs ⌈n/2⌉ times. For a while loop, find the value of the loop variable on each iteration and count how many make the condition true.",
        codeExercise: {
          language: PY,
          code: py`count = 0
for i in range(3, 50, 4):
    count += 1
print(count)
`,
          question: "How many times does this loop body run? (i takes the values 3, 7, 11, ...)",
          expectedOutput: "12",
          hint: "⌈(50 − 3) / 4⌉ = ⌈47 / 4⌉. Or: the last value is 47, and (47 − 3)/4 + 1.",
          successMessage: "12 iterations: 3, 7, ..., 47. With the formula you can count any loop without running it.",
        },
      },
      {
        id: "a-al-sequential-statements",
        title: "Time complexity of sequential statements",
        explain:
          "Statements executed one after another ADD their costs: T(n) = T₁(n) + T₂(n). The sum grows like the larger term, so the most expensive part dominates. A function that does a constant setup (O(1)), then a loop over the list (O(n)), then a nested pair loop (O(n²)) has T(n) = c + an + bn², which grows like n². Adding a linear step to a quadratic algorithm does not change its growth; adding a quadratic step to a linear algorithm does.",
        table: {
          caption: "Sequential parts add; the largest dominates.",
          headers: ["Part 1", "Part 2", "Total", "Grows like"],
          rows: [
            ["O(1) setup", "O(n) loop", "c + an", "n"],
            ["O(n) loop", "O(n) loop", "an + bn = (a + b)n", "n"],
            ["O(n) loop", "O(n²) nested loop", "an + bn²", "n²"],
            ["O(n log n) sort", "O(n) scan", "an log n + bn", "n log n"],
          ],
        },
      },
      {
        id: "a-al-conditional-statements",
        title: "Time complexity of conditional statements",
        explain:
          "For an if/else, only one branch runs, so the cost is the cost of evaluating the condition plus the cost of the branch taken. In the WORST CASE that is the condition plus the MORE EXPENSIVE branch: T(n) ≤ T_test + max(T_then, T_else). If one branch has a loop over n and the other is constant, the worst case is O(n) and the best case is O(1). Always state which case you are analysing.",
        codeExercise: {
          language: PY,
          code: py`def work(n, flag):
    ops = 1                 # evaluating the condition
    if flag:
        for i in range(n):
            ops += 1
    else:
        ops += 1
    return ops

print(work(100, True), work(100, False))
`,
          question: "work counts the operations in each branch. What does it print for n = 100 with each flag?",
          expectedOutput: "101 2",
          hint: "With flag True: the test plus 100 loop steps. With flag False: the test plus one step.",
          successMessage: "Worst case 101 = n + 1, so O(n); best case 2, so O(1). The worst case takes the expensive branch.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 4.8 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l15-nested-loops",
    moduleId: "al-m4-time-complexity",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.8", "4.9", "4.10"],
    title: "Nested, Consecutive and Stepped Loops",
    subtitle: "Where n² and n³ come from, and why i += 2 is still linear",
    estimatedMinutes: 26,
    intro:
      "Nested loops multiply, consecutive loops add, and changing a loop's step by a constant changes only a constant factor. These three facts explain most of the complexities you will ever derive.",

    atoms: [
      {
        id: "a-al-nested-loops",
        title: "Time complexity of nested loops",
        explain:
          "For nested loops, multiply: an outer loop of n iterations whose body is an inner loop of n iterations runs the inner body n × n = n² times, so it is O(n²); three nested n-loops give n³. When the inner loop depends on the outer variable (for j in range(i)), add up the inner counts: 0 + 1 + ... + (n − 1) = n(n − 1)/2, still O(n²), because n(n − 1)/2 = n²/2 − n/2 and the n² term dominates. The same reasoning with three dependent loops (i < j < k) gives n(n − 1)(n − 2)/6, which is O(n³).",
        codeExercise: {
          language: PY,
          code: py`n = 10
count = 0
for i in range(n):
    for j in range(i + 1, n):
        for k in range(j + 1, n):
            count += 1
print(count)
`,
          question: "Three dependent nested loops pick i < j < k from 10 values. What does it print?",
          expectedOutput: "120",
          hint: "It counts the ways to choose 3 items from 10: 10 × 9 × 8 / 6.",
          successMessage: "120 = n(n − 1)(n − 2)/6 at n = 10. The leading term is n³/6, so this is O(n³): every triple of items, as in checking whether any three numbers sum to zero.",
        },
      },
      {
        id: "a-al-consecutive-loops",
        title: "Time complexity of consecutive loops",
        explain:
          "Loops one AFTER another add, they do not multiply: a loop of n followed by another loop of n is n + n = 2n, which is O(n). This is the most common confusion in exams: two loops in the code does not mean O(n²). Look at the indentation. Inside the other means multiply; after the other means add. A loop of n followed by a nested n × n pair is n + n², O(n²).",
        decision: {
          scenario: "def stats(items):\n    total = 0\n    for x in items:\n        total += x\n    mean = total / len(items)\n    spread = 0\n    for x in items:\n        spread += (x - mean) ** 2\n    return mean, spread",
          question: "What is the time complexity of stats for n items?",
          options: [
            { id: "a", text: "O(n²), because there are two loops", whyWrong: "The loops are consecutive, not nested: their costs add." },
            { id: "b", text: "O(n): two passes of n, 2n + c operations", why: "Each loop is O(n); one after the other is O(n) + O(n) = O(n)." },
            { id: "c", text: "O(1), because each line is simple", whyWrong: "The loop bodies run n times each." },
            { id: "d", text: "O(log n)", whyWrong: "Nothing halves the input." },
          ],
          correct: "b",
          aftermath: "Indentation tells you which rule to use: nested multiplies, consecutive adds.",
        },
      },
      {
        id: "a-al-different-increments",
        title: "Loops with different increments",
        explain:
          "A loop that steps by a constant k (i += 2, i += 5) runs about n/k times: still O(n), because 1/k is a constant factor. A loop that counts DOWN by a constant is also O(n). What changes the growth is a MULTIPLICATIVE step (i *= 2 or n //= 2), which reaches n in about log₂ n steps: that is the next lesson. Being able to count any stepped loop exactly is a useful skill: the number of iterations of range(start, stop, step) is ⌈(stop − start)/step⌉, which in integer arithmetic is (stop − start + step − 1) // step.",
        codeChallenge: {
          task: "Write iterations(start, stop, step) that returns how many times `for i in range(start, stop, step)` runs, for a positive step, WITHOUT running a loop or calling range(). Remember it is 0 when stop <= start.",
          starter: "def iterations(start, stop, step):\n    pass\n",
          sample: "iterations(3, 50, 4) → 12\niterations(0, 10, 2) → 5",
          tests: [
            {
              check: py`cases = [(3, 50, 4), (0, 10, 2), (0, 11, 2), (0, 100, 1), (5, 5, 1), (10, 3, 2), (1, 1000001, 7), (0, 1, 5)]
for c in cases:
    want = len(range(*c))
    got = iterations(*c)
    assert got == want, f"iterations{c} should be {want}, got {got}"
assert not uses("For") and not uses("While") and not calls("range"), "Use arithmetic: no loop and no range()."`,
            },
          ],
          solution: "def iterations(start, stop, step):\n    if stop <= start:\n        return 0\n    return (stop - start + step - 1) // step\n",
          hint: "⌈a / b⌉ for positive integers is (a + b − 1) // b, with a = stop − start and b = step. Handle stop <= start first.",
          successMessage: "Exact iteration counts from arithmetic alone. That is precisely what deriving T(n) from code means.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 4.11 – 4.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l16-logarithmic-recursive",
    moduleId: "al-m4-time-complexity",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.11", "4.12"],
    title: "Logarithmic Loops and Recursive Algorithms",
    subtitle: "Halving gives log n; recursion gives recurrences",
    estimatedMinutes: 28,
    intro:
      "Logarithms are the reason some algorithms handle a billion items in thirty steps. This lesson derives O(log n) and O(n log n) from code, then counts the work of a recursive algorithm by counting its calls.",

    atoms: [
      {
        id: "a-al-logarithmic-loops",
        title: "Time complexity of logarithmic loops",
        explain:
          "A loop that DIVIDES its variable by 2 each iteration (while n > 1: n //= 2) runs ⌊log₂ n⌋ times, because after k halvings n has become n/2ᵏ, and that drops to 1 when k = log₂ n. A loop that DOUBLES (i = 1; while i < n: i *= 2) runs ⌈log₂ n⌉ times for the same reason. Logarithms grow extraordinarily slowly: log₂ 1,024 = 10, log₂ 1,000,000 ≈ 20, log₂ 10⁹ ≈ 30. Revise the identity: log₂ n = k means 2ᵏ = n. The base only changes a constant factor (log₁₀ n = log₂ n / log₂ 10), so we simply write O(log n).",
        codeChallenge: {
          task: "Write halvings(n) that counts how many times the loop `while n > 1: n = n // 2` runs, by running that loop and counting. Then confirm the pattern: for n = 1,024 it should be 10, and for a million about 20.",
          starter: "def halvings(n):\n    pass\n",
          sample: "halvings(1024) → 10\nhalvings(1000) → 9",
          tests: [
            {
              check: py`assert halvings(1024) == 10, "1024 → 512 → ... → 1 is 10 halvings. Got " + repr(halvings(1024))
assert halvings(1000) == 9, "1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1 is 9 halvings."
assert halvings(1) == 0 and halvings(2) == 1 and halvings(3) == 1, "Small cases: 1 needs 0, 2 and 3 need 1."
assert halvings(10**6) == 19 and halvings(2**40) == 40, "A million needs 19; 2**40 needs 40."
assert uses("While") or uses("For"), "Run the halving loop and count its iterations."`,
            },
          ],
          solution: "def halvings(n):\n    count = 0\n    while n > 1:\n        n = n // 2\n        count += 1\n    return count\n",
          hint: "count = 0; while n > 1: n = n // 2; count += 1; return count.",
          successMessage: "⌊log₂ n⌋ iterations: 40 steps for over a trillion. Every algorithm that halves its problem, such as binary search, inherits this.",
        },
      },
      {
        id: "a-al-n-log-n-loops",
        title: "A loop inside a logarithmic loop: n log n",
        explain:
          "Put a logarithmic loop inside a loop of n (or a loop of n inside a logarithmic loop) and the counts multiply: n × log₂ n, written O(n log n). This is the complexity of the best general-purpose sorting algorithms (merge sort, heap sort) and of many divide-and-conquer methods. n log n is only slightly worse than n: for a million items it is about 20 million, against a trillion for n².",
        codeExercise: {
          language: PY,
          code: py`def count_n_log_n(n):
    count = 0
    for i in range(n):
        j = n
        while j > 1:
            j //= 2
            count += 1
    return count

print(count_n_log_n(16), count_n_log_n(32))
`,
          question: "The inner while loop halves j from n down to 1. What does it print for n = 16 and n = 32?",
          expectedOutput: "64 160",
          hint: "The inner loop runs log₂ 16 = 4 times, for each of 16 outer iterations. For 32: 5 times, 32 times over.",
          successMessage: "16 × 4 = 64 and 32 × 5 = 160: exactly n log₂ n. Doubling n slightly more than doubles the work, the signature of n log n.",
        },
      },
      {
        id: "a-al-recursive-analysis",
        title: "Analysing recursive algorithms",
        explain:
          "A recursive function's running time is described by a RECURRENCE: an equation for T(n) in terms of T on smaller inputs. Counting the cost of one call plus the cost of its recursive calls gives it. T(n) = T(n − 1) + c (one recursive call on n − 1, such as a recursive sum) solves to O(n). T(n) = T(n/2) + c (one call on half, such as recursive binary search) solves to O(log n). T(n) = 2T(n − 1) + c (two calls on n − 1) DOUBLES the calls at each level, giving O(2ⁿ). Counting the calls is the most direct check of a recurrence; Modules 11 and 12 teach how to solve them.",
        codeExercise: {
          language: PY,
          code: py`calls = 0

def fib(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

for n in [10, 20]:
    calls = 0
    fib(n)
    print(n, calls)
`,
          question: "Naive recursive Fibonacci makes two recursive calls per call. How many calls in total for n = 10 and n = 20?",
          expectedOutput: "10 177\n20 21891",
          hint: "The number of calls C(n) satisfies C(n) = C(n − 1) + C(n − 2) + 1 with C(0) = C(1) = 1. Count upwards, or trust the code.",
          successMessage: "177 calls for n = 10 but 21,891 for n = 20: adding 10 to n multiplied the work by over 120. That is exponential growth, and Module 14 removes it with dynamic programming.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 4.13 – 4.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l17-deriving-complexity",
    moduleId: "al-m4-time-complexity",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.13", "4.14"],
    title: "Deriving Time Complexity",
    subtitle: "From pseudocode and from real source code",
    estimatedMinutes: 28,
    intro:
      "Now put the rules together. Given any pseudocode or Python function, you will derive its time complexity step by step, the way an examiner expects to see it, and check the result by counting.",

    atoms: [
      {
        id: "a-al-from-pseudocode",
        title: "Deriving time complexity from pseudocode",
        explain:
          "The method: 1. Decide what n is. 2. Choose the basic operation (or count every line). 3. Work from the innermost loop outwards: count how many times each body executes. 4. Nested loops multiply; dependent loops sum; consecutive parts add; branches take the worst. 5. Write T(n) and keep the dominant term. Applying it to the standard structures gives the results in the table below. Do not memorise the table: each row is one application of the rules.",
        table: {
          caption: "Standard structures, each derived with the rules.",
          headers: ["Code structure", "Derivation", "Time complexity"],
          rows: [
            ["Simple assignment", "Runs once, independent of n", "O(1)"],
            ["One loop through n items", "n iterations × O(1) body", "O(n)"],
            ["Two nested n-sized loops", "n × n iterations", "O(n²)"],
            ["Three nested n-sized loops", "n × n × n iterations", "O(n³)"],
            ["Repeatedly divide n by 2", "n/2ᵏ = 1 ⇒ k = log₂ n iterations", "O(log n)"],
            ["Loop inside a logarithmic loop", "log₂ n iterations × n each (or n × log₂ n)", "O(n log n)"],
            ["Loop of n, then nested n × n", "n + n² (consecutive add)", "O(n²)"],
            ["for i in 1..n: for j in 1..i", "1 + 2 + ... + n = n(n + 1)/2", "O(n²)"],
          ],
        },
        codeExercise: {
          language: "pseudocode",
          code: "SET count TO 0\nFOR i FROM 1 TO n DO\n    SET j TO 1\n    WHILE j < n DO\n        SET j TO j * 3\n        SET count TO count + 1\n    END WHILE\nEND FOR\nOUTPUT count\n",
          equivalentPython: "n = 81\ncount = 0\nfor i in range(1, n + 1):\n    j = 1\n    while j < n:\n        j = j * 3\n        count = count + 1\nprint(count)\n",
          question: "Derive it first: the inner loop triples j until it reaches n. Then predict the output for n = 81.",
          expectedOutput: "324",
          hint: "j goes 1 → 3 → 9 → 27 → 81: 4 iterations, since 3⁴ = 81. The outer loop runs 81 times.",
          successMessage: "81 × log₃ 81 = 81 × 4 = 324. Tripling instead of doubling changes only the log's base, a constant factor: still O(n log n).",
        },
      },
      {
        id: "a-al-from-source-code",
        title: "Deriving time complexity from actual source code",
        explain:
          "Real code hides loops inside library calls, so the first step is to replace each call with its true cost. In Python: x in list, list.index, list.count, sum, min, max and slicing are O(n); list.insert(0, x) and list.pop(0) are O(n); sorted and list.sort are O(n log n); dict and set lookups, inserts and deletes are O(1) on average; appending to a list is O(1) on average. Repeated string concatenation s = s + c in a loop copies the string each time: O(n²) in general. A one-loop function that calls an O(n) method in its body is O(n²).",
        decision: {
          scenario: "def has_duplicate(items):\n    for i in range(len(items)):\n        if items[i] in items[i + 1:]:\n            return True\n    return False",
          question: "What is the worst-case time complexity for n items?",
          options: [
            { id: "a", text: "O(n): there is only one loop", whyWrong: "items[i + 1:] copies up to n items and `in` scans them: O(n) work inside a loop of n." },
            {
              id: "b",
              text: "O(n²): the slice and the `in` scan cost up to n each, inside a loop of n",
              why: "The hidden work sums to about n²/2 when there are no duplicates. A set-based version is O(n).",
            },
            { id: "c", text: "O(n log n)", whyWrong: "Nothing is sorted or halved." },
            { id: "d", text: "O(1), because it can return early", whyWrong: "That is the best case; with no duplicates the loop runs to the end." },
          ],
          correct: "b",
          aftermath: "Read every library call as the loop it really is. Then the usual rules apply.",
        },
      },
      {
        id: "a-al-derive-practice",
        title: "Derive, then verify by counting",
        explain:
          "The strongest check of a derivation is to turn it into an exact formula and compare it with a count. The function mystery(n) below has three consecutive parts: a loop of n, a nested n × n loop, and a halving loop. By the rules, its exact count is n + n² + ⌊log₂ n⌋, which is O(n²). In Python, ⌊log₂ n⌋ for n ≥ 1 is n.bit_length() − 1, the number of binary digits minus one.",
        code: {
          language: PY,
          code: py`def mystery(n):
    count = 0
    for i in range(n):
        count += 1
    for i in range(n):
        for j in range(n):
            count += 1
    k = n
    while k > 1:
        k //= 2
        count += 1
    return count

print(mystery(8), mystery(100))
`,
          expectedOutput: "75 10106",
        },
        codeChallenge: {
          task: "Write mystery_formula(n) that returns the exact count mystery(n) produces, n + n² + ⌊log₂ n⌋, using arithmetic only (no loops). Use n.bit_length() - 1 for ⌊log₂ n⌋. Assume n ≥ 1.",
          starter: "def mystery_formula(n):\n    pass\n",
          sample: "mystery_formula(8) → 75",
          tests: [
            {
              check: py`def mystery(n):
    count = 0
    for i in range(n):
        count += 1
    for i in range(n):
        for j in range(n):
            count += 1
    k = n
    while k > 1:
        k //= 2
        count += 1
    return count

for n in [1, 2, 3, 8, 15, 16, 17, 100]:
    assert mystery_formula(n) == mystery(n), f"For n = {n} the count is {mystery(n)}, your formula gives {mystery_formula(n)}"
assert mystery_formula(10**6) == 10**6 + 10**12 + 19, "Your formula must work for n = 10**6 instantly."
assert not uses("For") and not uses("While"), "Use arithmetic, not loops."`,
            },
          ],
          solution: "def mystery_formula(n):\n    return n + n * n + (n.bit_length() - 1)\n",
          hint: "n + n * n + (n.bit_length() - 1).",
          successMessage: "Your derivation matched the real count at every n. The n² term dwarfs the others: at a million, n² is a trillion while log₂ n is 19.",
        },
      },
    ],

    task: {
      title: "Module 4 practice: derive every row of the table yourself",
      intro: "For each structure, write the code, derive T(n) on paper, then confirm it by counting in Python at n = 8, 16 and 32.",
      prompts: [
        "A simple assignment: show its count does not change with n.",
        "One loop through n items, and the same loop stepping by 3: show both are O(n) and find their exact counts.",
        "Two and three nested n-sized loops, then the dependent versions (j from i, k from j). Find the exact counts and their dominant terms.",
        "A loop that repeatedly divides n by 2, and one that multiplies i by 2 until it reaches n. Explain why both are O(log n).",
        "A loop inside a logarithmic loop. Show the count is n log₂ n when n is a power of 2.",
        "Take any function you wrote in Modules 1–3 and derive its time complexity, including the cost of every built-in it calls.",
      ],
      closing: "Module 5 gives you the notation to state these results precisely, and to prove them.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
