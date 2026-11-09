/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 6 · COMMON COMPLEXITY CLASSES
 *
 * Curriculum 6.1 – 6.12. Constant, logarithmic, linear, linearithmic,
 * quadratic, cubic, polynomial, exponential and factorial growth; comparing
 * them; scalability; and what each means for 100, 1,000 and 1,000,000
 * records. Each class is met through an algorithm the learner writes, and
 * the challenges are sized so that only the right class passes in time.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s6-classes";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 6.1 – 6.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l22-fast-classes",
    moduleId: "al-m6-classes",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3", "6.4"],
    title: "O(1), O(log n), O(n) and O(n log n)",
    subtitle: "The classes that scale to any data size",
    estimatedMinutes: 28,
    intro:
      "Four classes cover almost every algorithm that runs on big data: constant, logarithmic, linear and linearithmic. You will write one algorithm in each, and the tests are large enough that a slower class would not finish.",

    atoms: [
      {
        id: "a-al-constant-class",
        title: "Constant complexity: O(1)",
        explain:
          "An O(1) algorithm does the same amount of work whatever the input size: reading items[i], looking up a key in a hash table, pushing onto a stack, or evaluating a formula. Constant does not mean fast (a fixed 10⁶ steps is O(1)); it means independent of n. Turning a loop into a formula is the classic way to reach O(1): what day of the week is it 10¹² days from now? Looping day by day is O(n); the remainder (start + days) mod 7 is O(1).",
        codeChallenge: {
          task: "Days are numbered 0 (Monday) to 6 (Sunday). Write day_after(start, days) that returns the day number `days` days after day `start`, in O(1) time: no loop. It must be instant for days = 10**12.",
          starter: "def day_after(start, days):\n    pass\n",
          sample: "day_after(0, 10) → 3   (Monday + 10 days is Thursday)",
          tests: [
            {
              check: py`assert day_after(0, 10) == 3, "Monday + 10 days is Thursday (3). Got " + repr(day_after(0, 10))
assert day_after(6, 1) == 0, "Sunday + 1 day is Monday (0)."
assert day_after(2, 0) == 2 and day_after(4, 7) == 4, "0 days, and exactly one week."
assert day_after(3, 10**12) == (3 + 10**12) % 7, "It must be instant for 10**12 days."
assert not uses("For") and not uses("While"), "Use a formula, not a loop."`,
            },
          ],
          solution: "def day_after(start, days):\n    return (start + days) % 7\n",
          hint: "The week repeats every 7 days, so only the remainder matters: (start + days) % 7.",
          successMessage: "One addition and one remainder, for any number of days. That is O(1).",
        },
      },
      {
        id: "a-al-logarithmic-class",
        title: "Logarithmic complexity: O(log n)",
        explain:
          "An O(log n) algorithm discards a constant FRACTION of the problem at each step, so it needs only about log₂ n steps: 20 for a million, 30 for a billion. Examples: binary search, operations on a balanced search tree, counting the digits of a number, and exponentiation by squaring. To compute xⁿ, multiplying x by itself n times is O(n); squaring instead uses xⁿ = (x^(n/2))² for even n and x · xⁿ⁻¹ for odd n, so n is halved every step or two: O(log n) multiplications.",
        code: {
          language: PY,
          code: py`def power_steps(n):
    steps = 0
    while n > 0:
        if n % 2 == 1:
            steps += 1      # multiply result by the current square
        steps += 1          # square the base
        n //= 2
    return steps

print(power_steps(13), power_steps(1000), power_steps(10**9))
`,
          expectedOutput: "7 16 43",
        },
        codeChallenge: {
          task: "Write power(x, n) for a whole number n ≥ 0 using exponentiation by squaring: keep a result (starting at 1) and a base (starting at x); while n > 0, if n is odd multiply the result by the base; then square the base and halve n. Do not use ** or pow(). It must be fast for n = 10**9.",
          starter: "def power(x, n):\n    pass\n",
          sample: "power(3, 13) → 1594323",
          tests: [
            {
              check: py`assert power(3, 13) == 1594323, "3 to the 13th is 1594323. Got " + repr(power(3, 13))
assert power(2, 10) == 1024 and power(5, 0) == 1 and power(7, 1) == 7, "Small cases, including n = 0."
assert power(2, 200) == 2 ** 200, "2 to the 200th must be exact."
assert power(1, 10**9) == 1 and power(-1, 10**9 + 1) == -1, "n = 10**9 must finish quickly: halve n each step."
assert "**" not in source and not calls("pow"), "Implement the squaring yourself, without ** or pow()."`,
            },
          ],
          solution: "def power(x, n):\n    result = 1\n    base = x\n    while n > 0:\n        if n % 2 == 1:\n            result = result * base\n        base = base * base\n        n = n // 2\n    return result\n",
          hint: "result, base = 1, x. Loop while n > 0: if n % 2 == 1: result *= base. Then base *= base and n //= 2.",
          successMessage: "About 60 multiplications instead of a billion. The same idea powers modular exponentiation in RSA encryption.",
        },
      },
      {
        id: "a-al-linear-linearithmic",
        title: "Linear O(n) and linearithmic O(n log n)",
        explain:
          "An O(n) algorithm does a constant amount of work per item: one pass to sum, count, find a maximum or search an unsorted list. For many problems it is optimal, because every item must be looked at. An O(n log n) algorithm typically SORTS first (merge sort and heap sort are O(n log n)) or divides the input in half repeatedly with linear work per level. Sorting often turns a quadratic problem into an n log n one: to detect duplicates, comparing every pair is O(n²), but after sorting, equal values are adjacent, so one more linear pass finishes the job.",
        codeChallenge: {
          task: "Write has_duplicate(items) in O(n log n): sort a copy with sorted(), then check neighbouring items in one pass. Do not use set() or dict(); the test list has 20,000 items, too many for comparing every pair.",
          starter: "def has_duplicate(items):\n    pass\n",
          sample: "has_duplicate([4, 1, 7, 1]) → True",
          tests: [
            {
              check: py`assert has_duplicate([4, 1, 7, 1]) is True, "1 appears twice."
assert has_duplicate([4, 1, 7, 2]) is False, "No value repeats."
assert has_duplicate([]) is False and has_duplicate([5]) is False, "Empty and one-item lists have no duplicates."
big = list(range(0, 40000, 2))
assert has_duplicate(big) is False, "20,000 distinct items."
assert has_duplicate(big + [39998]) is True, "A duplicate at the very end."
assert not calls("set") and not calls("dict"), "Use sorting, not a set or dict (that is the O(n) method of Module 8)."`,
            },
          ],
          solution: "def has_duplicate(items):\n    ordered = sorted(items)\n    for i in range(1, len(ordered)):\n        if ordered[i] == ordered[i - 1]:\n            return True\n    return False\n",
          hint: "ordered = sorted(items), then for i in range(1, len(ordered)): compare ordered[i] with ordered[i - 1].",
          successMessage: "Sorting O(n log n) plus one pass O(n) is O(n log n). Comparing all pairs of 20,000 items would have taken about 200 million steps.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 6.5 – 6.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l23-polynomial-classes",
    moduleId: "al-m6-classes",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.5", "6.6", "6.7"],
    title: "Quadratic, Cubic and Polynomial Time",
    subtitle: "O(n²), O(n³) and O(nᵏ)",
    estimatedMinutes: 26,
    intro:
      "Polynomial algorithms are the ones whose work is n raised to a fixed power. They are considered tractable, but n² is already a problem at a million items, and n³ at ten thousand.",

    atoms: [
      {
        id: "a-al-quadratic",
        title: "Quadratic complexity: O(n²)",
        explain:
          "O(n²) algorithms usually consider every PAIR of items: comparing all pairs for duplicates or closest points, and the simple sorting algorithms (bubble, selection, insertion), which can move each item past every other. Processing every cell of an n × n grid is also n². Doubling n quadruples the work. Quadratic algorithms are fine up to a few thousand items and painful beyond about 100,000.",
        codeExercise: {
          language: PY,
          code: py`def handshakes(people):
    count = 0
    for i in range(people):
        for j in range(i + 1, people):
            count += 1
    return count

print(handshakes(30), handshakes(60))
`,
          question: "Everyone at a meeting shakes hands with everyone else once. How many handshakes for 30 people, and for 60?",
          expectedOutput: "435 1770",
          hint: "n(n − 1)/2: 30 × 29 / 2 and 60 × 59 / 2.",
          successMessage: "Doubling the people roughly quadrupled the handshakes (435 → 1,770): quadratic growth.",
        },
      },
      {
        id: "a-al-cubic",
        title: "Cubic complexity: O(n³)",
        explain:
          "O(n³) algorithms consider every TRIPLE, or run three nested loops over n. The best-known example is the schoolbook multiplication of two n × n matrices: each of the n² entries of the result is a sum of n products, so n³ multiplications in total. Floyd-Warshall's all-pairs shortest paths (Module 15) is also n³. Doubling n multiplies the work by 8; n = 1,000 already means a billion operations.",
        codeChallenge: {
          task: "Write matmul(A, B) that multiplies two n × n matrices (lists of lists) with three nested loops: C[i][j] = sum of A[i][k] * B[k][j] over k. Return a tuple (C, multiplications), where multiplications counts every A[i][k] * B[k][j] you compute.",
          starter: "def matmul(A, B):\n    pass\n",
          sample: "matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]]) → ([[19, 22], [43, 50]], 8)",
          tests: [
            {
              check: py`C, m = matmul([[1, 2], [3, 4]], [[5, 6], [7, 8]])
assert C == [[19, 22], [43, 50]], "The product is [[19, 22], [43, 50]]. Got " + repr(C)
assert m == 8, "A 2 × 2 product needs 2³ = 8 multiplications. You counted " + repr(m)
I = [[1 if i == j else 0 for j in range(3)] for i in range(3)]
M = [[2, 0, 1], [1, 3, 2], [0, 1, 4]]
assert matmul(M, I) == (M, 27), "Multiplying by the identity gives M back, with 3³ = 27 multiplications."
n = 10
ones = [[1] * n for _ in range(n)]
C, m = matmul(ones, ones)
assert C[0][0] == 10 and m == 1000, "10 × 10: every entry is 10, and 10³ = 1000 multiplications."`,
            },
          ],
          solution: "def matmul(A, B):\n    n = len(A)\n    C = [[0] * n for _ in range(n)]\n    count = 0\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] += A[i][k] * B[k][j]\n                count += 1\n    return C, count\n",
          hint: "Make C as n lists of n zeros. Three loops i, j, k; add A[i][k] * B[k][j] to C[i][j] and count each multiplication.",
          successMessage: "Exactly n³ multiplications. Strassen's divide-and-conquer method (Module 12's idea) does about n^2.81.",
        },
      },
      {
        id: "a-al-polynomial-class",
        title: "Polynomial complexity: O(nᵏ)",
        explain:
          "An algorithm is POLYNOMIAL-TIME if its running time is O(nᵏ) for some constant k: this includes everything from O(n) to O(n³) and beyond. Complexity theory treats polynomial time as the boundary of \"efficiently solvable\" (tractable), because polynomials are closed under composition (a polynomial algorithm calling a polynomial subroutine stays polynomial) and because, in practice, the exponents of natural problems are small. The boundary is a theory, not a guarantee: an O(n¹⁰⁰) algorithm is polynomial but useless, while an exponential algorithm with tiny inputs can be fine. Module 16 builds the classes P and NP on this idea.",
        decision: {
          scenario: "Three algorithms solve a problem: A is O(n² log n), B is O(n⁴), C is O(1.1ⁿ).",
          question: "Which are polynomial-time?",
          options: [
            { id: "a", text: "Only B, because only it is written as a power of n", whyWrong: "n² log n ≤ n³ for large n, so A is O(n³): polynomial." },
            { id: "b", text: "A and B; C is exponential, however small its base", why: "A is O(n³) and B is O(n⁴). Any base above 1 raised to n eventually outgrows every polynomial." },
            { id: "c", text: "All three, because 1.1 is close to 1", whyWrong: "1.1ⁿ is exponential: it eventually exceeds n¹⁰⁰, n¹⁰⁰⁰ and every other power." },
            { id: "d", text: "None of them", whyWrong: "A and B are bounded by powers of n." },
          ],
          correct: "b",
          aftermath: "Polynomial: bounded by nᵏ for a constant k. Exponential: a constant base above 1 raised to a power of n.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 6.8 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l24-exponential-factorial",
    moduleId: "al-m6-classes",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.8", "6.9"],
    title: "Exponential and Factorial Time",
    subtitle: "O(2ⁿ), O(n!) and the wall of brute force",
    estimatedMinutes: 26,
    intro:
      "Some algorithms try every possibility. With n items there are 2ⁿ subsets and n! orderings, and those numbers explode so fast that brute force stops working before n reaches 50.",

    atoms: [
      {
        id: "a-al-exponential",
        title: "Exponential complexity: O(2ⁿ)",
        explain:
          "An O(2ⁿ) algorithm typically examines every SUBSET of n items: each item is either in or out, giving 2ⁿ combinations. Brute-force subset sum (\"is there a subset adding to the target?\") and naive recursive Fibonacci (about 1.6ⁿ calls) are exponential. Each extra item DOUBLES the work: 2²⁰ ≈ a million, 2⁴⁰ ≈ a trillion, 2⁶⁰ ≈ 10¹⁸. Exponential algorithms are usable only for small n, roughly up to 30 or 40.",
        codeChallenge: {
          task: "Write count_subsets(items, target) that counts how many subsets of items (including the empty subset) add up to exactly target, by trying all 2ⁿ subsets. One way: for each mask from 0 to 2ⁿ − 1, item i is in the subset when bit i of the mask is 1, that is (mask >> i) & 1.",
          starter: "def count_subsets(items, target):\n    pass\n",
          sample: "count_subsets([3, 1, 2], 3) → 2   ({3} and {1, 2})",
          tests: [
            {
              check: py`assert count_subsets([3, 1, 2], 3) == 2, "{3} and {1, 2} both sum to 3. Got " + repr(count_subsets([3, 1, 2], 3))
assert count_subsets([3, 1, 2], 0) == 1, "Only the empty subset sums to 0."
assert count_subsets([3, 1, 2], 7) == 0, "Nothing sums to 7: the whole set sums to 6."
assert count_subsets([1, 1, 1, 1], 2) == 6, "Choose 2 of 4 equal items: 6 subsets."
assert count_subsets(list(range(1, 11)), 15) == 20, "Subsets of 1..10 summing to 15."`,
            },
          ],
          solution: "def count_subsets(items, target):\n    n = len(items)\n    count = 0\n    for mask in range(2 ** n):\n        total = 0\n        for i in range(n):\n            if (mask >> i) & 1:\n                total += items[i]\n        if total == target:\n            count += 1\n    return count\n",
          hint: "for mask in range(2 ** n): add up items[i] for every i where (mask >> i) & 1 is 1, then compare with target.",
          successMessage: "1,024 subsets for 10 items. With 50 items it would be 10¹⁵. Module 14 solves subset-sum style problems with dynamic programming instead.",
        },
      },
      {
        id: "a-al-factorial",
        title: "Factorial complexity: O(n!)",
        explain:
          "An O(n!) algorithm examines every ORDERING (permutation) of n items: there are n × (n − 1) × ... × 1 = n! of them. Brute-force Travelling Salesperson (try every order of visiting n cities) is the classic example. n! grows even faster than 2ⁿ: 10! is 3.6 million, 15! is 1.3 trillion, and 20! is about 2.4 × 10¹⁸, which at 10⁸ orderings per second would take over 700 years.",
        codeExercise: {
          language: PY,
          code: py`import math

for n in [5, 10, 15]:
    print(n, math.factorial(n))
`,
          question: "How many orderings are there of 5, 10 and 15 items?",
          expectedOutput: "5 120\n10 3628800\n15 1307674368000",
          hint: "5! = 120. 10! = 10 × 9 × ... × 1.",
          successMessage: "From 120 to 1.3 trillion by adding 10 items. Factorial growth is why exact route planning for many stops needs better algorithms or approximations (Module 16).",
        },
      },
      {
        id: "a-al-intractable",
        title: "How large an input can each class handle?",
        explain:
          "A good way to feel the classes is to ask: at 10⁸ basic operations per second, what is the largest n solvable in one second? For O(n), a hundred million. For O(n log n), about four and a half million. For O(n²), ten thousand. For O(n³), about 460. For O(2ⁿ), 26. For O(n!), 11. A computer 1,000 times faster raises the O(n) limit by a factor of 1,000, the O(n²) limit by about 32, and the O(2ⁿ) limit by only 10.",
        table: {
          caption: "Largest n solvable in one second at 10⁸ operations per second.",
          headers: ["Class", "Largest n in 1 second", "With a 1,000× faster computer"],
          rows: [
            ["O(n)", "100,000,000", "× 1,000"],
            ["O(n log n)", "≈ 4,500,000", "≈ × 700"],
            ["O(n²)", "10,000", "× 32"],
            ["O(n³)", "≈ 460", "× 10"],
            ["O(2ⁿ)", "26", "+ 10"],
            ["O(n!)", "11", "+ 2 or 3"],
          ],
        },
        decision: {
          scenario: "A brute-force scheduling algorithm is O(2ⁿ) and handles 30 tasks in one minute. The company buys a computer 1,000 times faster.",
          question: "About how many tasks can it now handle in one minute?",
          options: [
            { id: "a", text: "30,000", whyWrong: "That would be true for a linear algorithm." },
            { id: "b", text: "About 40", why: "2¹⁰ ≈ 1,000, so 1,000 times the speed buys only 10 more tasks." },
            { id: "c", text: "About 950", whyWrong: "That would be roughly the gain for a quadratic algorithm (√1000 × 30)." },
            { id: "d", text: "Unlimited", whyWrong: "Exponential growth eats any constant speed-up almost immediately." },
          ],
          correct: "b",
          aftermath: "Hardware adds to the exponent's input by a constant; only a better algorithm escapes exponential growth.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 6.10 – 6.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l25-comparing-classes",
    moduleId: "al-m6-classes",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.10", "6.11", "6.12"],
    title: "Comparing Classes and Scalability",
    subtitle: "Choosing algorithms for 100, 1,000 and 1,000,000 records",
    estimatedMinutes: 28,
    intro:
      "The final step is judgement: given a dataset size and a time budget, which classes are acceptable? This lesson ranks the classes, measures them at real sizes, and turns the answer into an algorithm of its own.",

    atoms: [
      {
        id: "a-al-comparing-classes",
        title: "Comparing complexity classes",
        explain:
          "From most to least efficient: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!). Each class is little o of the next, so for large enough n every algorithm in a better class beats every algorithm in a worse one, whatever the constants. The table shows the counts at three sizes: the differences that look small at n = 10 become astronomical at n = 1,000.",
        table: {
          caption: "Number of basic operations for each class.",
          headers: ["Class", "n = 10", "n = 100", "n = 1,000"],
          rows: [
            ["O(1)", "1", "1", "1"],
            ["O(log n)", "3.3", "6.6", "10"],
            ["O(n)", "10", "100", "1,000"],
            ["O(n log n)", "33", "664", "9,966"],
            ["O(n²)", "100", "10,000", "1,000,000"],
            ["O(n³)", "1,000", "1,000,000", "10⁹"],
            ["O(2ⁿ)", "1,024", "1.27 × 10³⁰", "1.07 × 10³⁰¹"],
            ["O(n!)", "3,628,800", "9.3 × 10¹⁵⁷", "≈ 4 × 10²⁵⁶⁷"],
          ],
        },
        charts: [
          {
            type: "line",
            title: "Growth curves for n = 1 to 10",
            categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            series: [
              { name: "n", values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
              { name: "n log₂ n", values: [0, 2, 4.75, 8, 11.61, 15.51, 19.65, 24, 28.53, 33.22] },
              { name: "n²", values: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100] },
              { name: "2ⁿ", values: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024] },
            ],
            caption: "Even at n = 10, 2ⁿ is ten times n². By n = 20 it is over a million, while n² is 400.",
          },
        ],
        codeChallenge: {
          task: "Write rank(classes) that takes a list of complexity class names drawn from \"O(1)\", \"O(log n)\", \"O(n)\", \"O(n log n)\", \"O(n^2)\", \"O(n^3)\", \"O(2^n)\", \"O(n!)\" in any order, and returns them ranked from most efficient to least efficient.",
          starter: "ORDER = [\"O(1)\", \"O(log n)\", \"O(n)\", \"O(n log n)\", \"O(n^2)\", \"O(n^3)\", \"O(2^n)\", \"O(n!)\"]\n\ndef rank(classes):\n    pass\n",
          sample: "rank([\"O(n^2)\", \"O(1)\", \"O(n log n)\"]) → [\"O(1)\", \"O(n log n)\", \"O(n^2)\"]",
          tests: [
            {
              check: py`assert rank(["O(n^2)", "O(1)", "O(n log n)"]) == ["O(1)", "O(n log n)", "O(n^2)"], "Got " + repr(rank(["O(n^2)", "O(1)", "O(n log n)"]))
everything = ["O(n!)", "O(n)", "O(2^n)", "O(log n)", "O(n^3)", "O(1)", "O(n^2)", "O(n log n)"]
assert rank(everything) == ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(n^3)", "O(2^n)", "O(n!)"], "All eight, ranked. Got " + repr(rank(everything))
assert rank(["O(2^n)", "O(n^3)"]) == ["O(n^3)", "O(2^n)"], "Polynomial before exponential."
assert rank([]) == [], "An empty list."`,
            },
          ],
          solution: "ORDER = [\"O(1)\", \"O(log n)\", \"O(n)\", \"O(n log n)\", \"O(n^2)\", \"O(n^3)\", \"O(2^n)\", \"O(n!)\"]\n\ndef rank(classes):\n    return sorted(classes, key=ORDER.index)\n",
          hint: "sorted(classes, key=ORDER.index) sorts by each name's position in ORDER.",
          successMessage: "Constant, log, linear, n log n, quadratic, cubic, exponential, factorial: the ranking every algorithms exam expects.",
        },
      },
      {
        id: "a-al-scalability",
        title: "Understanding scalability",
        explain:
          "An algorithm SCALES if its cost stays acceptable as the data grows by orders of magnitude. The program below estimates the running time of each class at 100, 1,000 and 1,000,000 records, assuming 10⁸ operations per second. Read it as a decision table: at a million records, O(n log n) answers in a fifth of a second, O(n²) in nearly three hours, O(n³) in over 300 years, and O(2ⁿ) never.",
        code: {
          language: PY,
          code: py`import math

classes = [
    ("O(log n)", lambda n: math.log2(n)),
    ("O(n)", lambda n: n),
    ("O(n log n)", lambda n: n * math.log2(n)),
    ("O(n^2)", lambda n: n ** 2),
    ("O(n^3)", lambda n: n ** 3),
    ("O(2^n)", lambda n: 2 ** n),
]
SPEED = 10 ** 8
for name, cost in classes:
    cells = []
    for n in (100, 1000, 10 ** 6):
        if name == "O(2^n)" and n > 1000:
            cells.append("forever")
            continue
        cells.append(f"{cost(n) / SPEED:.2g}s")
    print(name.ljust(11), *cells)
`,
          expectedOutput: "O(log n)    6.6e-08s 1e-07s 2e-07s\nO(n)        1e-06s 1e-05s 0.01s\nO(n log n)  6.6e-06s 0.0001s 0.2s\nO(n^2)      0.0001s 0.01s 1e+04s\nO(n^3)      0.01s 10s 1e+10s\nO(2^n)      1.3e+22s 1.1e+293s forever",
        },
        why: "1e+04 seconds is 2.8 hours; 1e+10 seconds is over 300 years; 1.3e+22 seconds is far longer than the age of the universe. At 100 records every polynomial class is instant, which is why small tests prove nothing about scalability.",
      },
      {
        id: "a-al-practical-implications",
        title: "Practical implications: the largest feasible input",
        explain:
          "Turning a time budget into a maximum input size is itself a searching problem: find the largest n with cost(n) ≤ budget. Because cost grows with n, you can DOUBLE n until the cost exceeds the budget (exponential search), then binary search between the last two values. That takes O(log n) evaluations of cost, even when the answer is a hundred million. You will meet exponential search properly in Module 9.",
        codeChallenge: {
          task: "Write max_feasible(cost, budget) that returns the largest whole n ≥ 1 with cost(n) <= budget, where cost is an increasing function and cost(1) <= budget. Double hi from 1 until cost(hi) > budget, then binary search between hi // 2 and hi. Answers can be as large as 10**8, so a step-by-step scan will not finish.",
          starter: "def max_feasible(cost, budget):\n    pass\n",
          sample: "max_feasible(lambda n: n * n, 10**8) → 10000",
          tests: [
            {
              check: py`import math
B = 10 ** 8
cases = [lambda n: n, lambda n: n * math.log2(n) if n > 1 else 1, lambda n: n * n, lambda n: n ** 3, lambda n: 2 ** n, math.factorial]
for cost in cases:
    n = max_feasible(cost, B)
    assert isinstance(n, int) and n >= 1, "Return a whole number n >= 1. Got " + repr(n)
    assert cost(n) <= B < cost(n + 1), f"n = {n} is not the largest feasible n: cost(n) must fit the budget and cost(n + 1) must not."
assert max_feasible(lambda n: n * n, B) == 10000, "For n², the answer is 10,000."
assert max_feasible(lambda n: 2 ** n, B) == 26, "For 2ⁿ, the answer is 26."
assert max_feasible(math.factorial, B) == 11, "For n!, the answer is 11."`,
            },
          ],
          solution: "def max_feasible(cost, budget):\n    hi = 1\n    while cost(hi) <= budget:\n        hi *= 2\n    lo = hi // 2\n    while hi - lo > 1:\n        mid = (lo + hi) // 2\n        if cost(mid) <= budget:\n            lo = mid\n        else:\n            hi = mid\n    return lo\n",
          hint: "After doubling, cost(hi // 2) fits and cost(hi) does not. Keep lo feasible and hi infeasible, and halve the gap until hi = lo + 1; return lo.",
          successMessage: "Your function reproduced the table: 10⁸ for O(n), 10,000 for O(n²), 26 for O(2ⁿ), 11 for O(n!). It used O(log n) evaluations to do it.",
        },
      },
    ],

    task: {
      title: "Module 6 practice: growth classes at real sizes",
      intro: "Use VS Code with Python (install matplotlib with pip install matplotlib for the plotting exercise).",
      prompts: [
        "Rank the classes O(n!), O(n), O(2ⁿ), O(log n), O(n³), O(1), O(n²) and O(n log n) from most efficient to least efficient, with a one-line reason for each step.",
        "Compare algorithms processing 100, 1,000 and 1,000,000 records: tabulate the operations and the estimated time at 10⁸ operations per second for each class.",
        "Identify which classes are suitable for a dataset of 10 million records that must be processed in under a minute, and justify the cut-off.",
        "Plot algorithm growth curves using Python and matplotlib: n, n log₂ n, n² and 2ⁿ for n = 1 to 20, once on a normal axis and once with plt.yscale(\"log\"). What does the log scale reveal?",
        "Analyse how input size affects execution time by timing has_duplicate (sorting) and a pairwise version at n = 1,000, 2,000, 4,000 and 8,000. Do the ratios match n log n and n²?",
      ],
      closing: "Phase 3 adds the second resource: Module 7 analyses memory the way Phase 2 analysed time.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
