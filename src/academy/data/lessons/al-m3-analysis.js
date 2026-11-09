/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 3 · INTRODUCTION TO ANALYSIS
 *
 * Curriculum 3.1 – 3.12. What analysis is and why efficiency matters;
 * correctness versus efficiency; time and memory as resources; input size;
 * best, average and worst cases; empirical versus theoretical analysis.
 * Operation counts are computed by code the validator runs, never by hand.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s3-analysis";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 3.1 – 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l9-why-analysis",
    moduleId: "al-m3-analysis",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3"],
    title: "Why Analyse Algorithms?",
    subtitle: "Two correct algorithms can differ by a factor of a million",
    estimatedMinutes: 20,
    intro:
      "Two programmers solve the same problem correctly. One program answers in a millisecond; the other takes a day. Algorithm analysis is how you predict which is which, before writing a line of code and without a stopwatch.",

    atoms: [
      {
        id: "a-al-what-is-analysis",
        title: "What is algorithm analysis?",
        explain:
          "Algorithm analysis predicts the RESOURCES an algorithm needs (chiefly running time and memory) as a function of the size of its input. It does not ask \"how many seconds on my laptop?\", which depends on the machine; it asks \"how does the number of basic steps grow as the input grows?\", which depends only on the algorithm. That answer lets you compare algorithms on paper, predict behaviour on inputs too large to test, and choose before you build.",
        table: {
          caption: "The questions analysis answers.",
          headers: ["Question", "Example"],
          rows: [
            ["How many steps for an input of size n?", "Linear search: up to n comparisons"],
            ["How does that grow if n doubles?", "Doubles for linear search; quadruples for a nested-loop algorithm"],
            ["How much extra memory is needed?", "Merge sort needs a second array of size n"],
            ["Which algorithm is better for large n?", "Binary search beats linear search on sorted data"],
          ],
        },
      },
      {
        id: "a-al-efficiency-matters",
        title: "Why efficiency matters: summing 1 to n",
        explain:
          "Summing the integers 1 to n can be done with a loop (n additions) or with Gauss's formula n(n + 1)/2 (one addition, one multiplication, one division). For n = 1,000 the loop does 1,000 additions; for n = 10¹² the loop would take hours while the formula still takes three operations. Faster hardware gives a constant speed-up; a better algorithm can change the growth itself. That is why efficiency is studied at the level of algorithms.",
        code: {
          language: PY,
          code: py`def sum_loop(n):
    total, ops = 0, 0
    for i in range(1, n + 1):
        total += i
        ops += 1
    return total, ops

def sum_formula(n):
    return n * (n + 1) // 2, 3

print(sum_loop(1000))
print(sum_formula(1000))
`,
          expectedOutput: "(500500, 1000)\n(500500, 3)",
        },
        codeChallenge: {
          task: "Write sum_to(n) that returns 1 + 2 + ... + n using Gauss's formula, so that it is instant even for n = 10**12. Use no loop. Return an integer (use // for the division).",
          starter: "def sum_to(n):\n    pass\n",
          sample: "sum_to(100) → 5050",
          tests: [
            {
              check: py`assert sum_to(100) == 5050, "sum_to(100) should be 5050. Got " + repr(sum_to(100))
assert sum_to(1) == 1 and sum_to(0) == 0, "sum_to(1) is 1 and sum_to(0) is 0."
assert sum_to(10**12) == 500000000000500000000000, "sum_to(10**12) must be exact: use integer division //."
assert not uses("For") and not uses("While"), "Use the formula n(n + 1)/2, not a loop."`,
            },
          ],
          solution: "def sum_to(n):\n    return n * (n + 1) // 2\n",
          hint: "n * (n + 1) // 2. The // keeps the answer an exact integer.",
          successMessage: "Three operations for any n. A loop would need a trillion iterations for the last test.",
        },
      },
      {
        id: "a-al-correct-vs-efficient",
        title: "Correctness versus efficiency",
        explain:
          "Correctness comes first: a fast algorithm that gives wrong answers is worthless. But a correct algorithm that is too slow for the real input is also worthless, because nobody can wait for the answer. The engineering goal is the simplest algorithm that is correct AND fast enough for the input sizes you actually expect. Optimising code that is already fast enough wastes time and adds bugs; ignoring growth on large data causes outages.",
        decision: {
          scenario: "A school's results system sorts 300 students with a simple algorithm that takes 0.02 seconds. A colleague proposes replacing it with a complex, faster sorting algorithm.",
          question: "What is the best decision?",
          options: [
            {
              id: "a",
              text: "Keep the simple, correct algorithm: 0.02 seconds is already fast enough for 300 students",
              why: "Efficiency matters relative to the real input size. Complexity without need adds risk. If the system later serves 300,000 students, analysis will tell you when to change.",
            },
            { id: "b", text: "Always use the fastest known algorithm", whyWrong: "Faster algorithms are often more complex and more error-prone; the gain here is invisible." },
            { id: "c", text: "Remove sorting altogether to save time", whyWrong: "The output must still be correct; ranking needs sorting." },
            { id: "d", text: "Buy a faster server", whyWrong: "There is no performance problem to solve." },
          ],
          correct: "a",
          aftermath: "Correct first, fast enough second, and let analysis tell you when the input size changes the answer.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 3.4 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l10-resources",
    moduleId: "al-m3-analysis",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.4", "3.5", "3.6", "3.7"],
    title: "Time, Memory and Input Size",
    subtitle: "The resources an algorithm consumes, and what drives them",
    estimatedMinutes: 22,
    intro:
      "An algorithm consumes resources: processor time, memory, and sometimes disk, network or energy. The amount it needs depends overwhelmingly on one thing, the size of its input.",

    atoms: [
      {
        id: "a-al-computational-resources",
        title: "Computational resources",
        explain:
          "The two resources algorithm analysis measures are TIME (how many basic operations are executed) and SPACE (how much memory is needed beyond the input). Real systems also care about disk reads, network round-trips and energy, and the same analysis applies to them: count the expensive operations. Often the resources trade against each other: storing results (more memory) can avoid recomputing them (less time).",
        table: {
          caption: "Resources and how they are measured.",
          headers: ["Resource", "Measured as", "Example of a heavy user"],
          rows: [
            ["Time", "Number of basic operations as a function of n", "Checking every pair of n items: about n²/2 comparisons"],
            ["Memory (space)", "Extra memory cells needed beyond the input", "Copying an n-item list: n extra cells"],
            ["Disk / I/O", "Number of block reads and writes", "A database scanning a whole table"],
            ["Network", "Number of round-trips or bytes sent", "An app making one request per item instead of one per page"],
          ],
        },
      },
      {
        id: "a-al-execution-time-memory",
        title: "Execution time and memory consumption",
        explain:
          "Measured execution time depends on the processor, the language, the compiler, other programs running, caching and the input. So analysis counts BASIC OPERATIONS instead: comparisons, assignments, arithmetic, array accesses, each assumed to take constant time. Multiply the count by the cost of one operation on a given machine and you get an estimate of the time. Memory is counted the same way: each simple variable is one cell; an array of n items is n cells; and data structures that grow with the input are what make memory consumption grow.",
        codeExercise: {
          language: PY,
          code: py`def count_ops(items):
    ops = 0
    total = 0          # 1 assignment
    ops += 1
    for x in items:
        total += x     # 1 addition per item
        ops += 1
    average = total / len(items)   # 1 division
    ops += 1
    return ops

print(count_ops([4, 8, 15, 16, 23, 42]))
`,
          question: "The function counts one operation for the initial assignment, one per item for the additions, and one for the division. What does it print for a list of 6 items?",
          expectedOutput: "8",
          hint: "1 + 6 + 1.",
          successMessage: "8 = n + 2 for n = 6. Whatever machine runs it, the work is n + 2 operations: the count, not the seconds, describes the algorithm.",
        },
      },
      {
        id: "a-al-input-size",
        title: "Input size and its effect on performance",
        explain:
          "The input size n is the measure of the input that drives the work: the number of items in a list, the number of digits in a number being multiplied, the number of vertices and edges in a graph, the number of rows in a table. Performance is then a function T(n). An algorithm that compares every pair of n items does n(n − 1)/2 comparisons: 45 for 10 items, but nearly 5 × 10¹¹ for a million. The growth of T(n), not its value at small n, decides whether an algorithm is usable on real data.",
        codeExercise: {
          language: PY,
          code: py`def pair_checks(n):
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            count += 1
    return count

print(pair_checks(10), pair_checks(20), pair_checks(40))
`,
          question: "pair_checks counts how many pairs an \"is there a duplicate?\" algorithm compares. What does it print for n = 10, 20 and 40?",
          expectedOutput: "45 190 780",
          hint: "n(n − 1)/2: 10 × 9 / 2, then 20 × 19 / 2, then 40 × 39 / 2.",
          successMessage: "Doubling n roughly quadruples the work (45 → 190 → 780). That ×4 per doubling is the signature of quadratic growth.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.8 – 3.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l11-cases",
    moduleId: "al-m3-analysis",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.8", "3.9", "3.10"],
    title: "Best, Average and Worst Cases",
    subtitle: "The same algorithm, three different stories",
    estimatedMinutes: 22,
    intro:
      "For a fixed input size, the work an algorithm does can still depend on the input itself. Linear search for a name that happens to be first takes one comparison; for a missing name it takes them all. Analysis separates these into the best, average and worst cases.",

    atoms: [
      {
        id: "a-al-best-case",
        title: "Best-case performance",
        explain:
          "The BEST CASE is the minimum work over all inputs of size n. For linear search it is 1 comparison: the target is the first item. The best case is rarely useful on its own, because you cannot choose your input, but it shows the floor: no input of size n is faster. Be careful: \"the best case is when n is small\" is wrong. Cases are compared at the SAME n; the best case is about the arrangement of the input, not its size.",
        table: {
          caption: "Linear search on a list of n items.",
          headers: ["Case", "When it happens", "Comparisons"],
          rows: [
            ["Best", "Target is at index 0", "1"],
            ["Worst", "Target is last, or absent", "n"],
            ["Average (target present, every position equally likely)", "Target is somewhere in the middle on average", "(n + 1) / 2"],
          ],
        },
      },
      {
        id: "a-al-average-case",
        title: "Average-case performance",
        explain:
          "The AVERAGE CASE is the expected work over a probability distribution of inputs of size n. For linear search, if the target is present and equally likely to be at any of the n positions, finding it at position k (counting from 1) costs k comparisons, so the average is (1 + 2 + ... + n)/n = (n + 1)/2. The average case is the most realistic measure, but it depends on an ASSUMPTION about the inputs; if real data is skewed (popular items searched more often, or the target often missing), the real average differs.",
        codeChallenge: {
          task: "Write comparisons(items, target) that returns how many == comparisons a linear search makes (stopping as soon as it finds the target; n if it is absent). Then write average_case(items) that returns the average of comparisons(items, t) over every item t in the list.",
          starter: "def comparisons(items, target):\n    pass\n\ndef average_case(items):\n    pass\n",
          sample: "comparisons([5, 3, 8], 3) → 2\naverage_case([5, 3, 8]) → 2.0",
          tests: [
            {
              check: py`data = [5, 3, 8, 1, 9]
assert comparisons(data, 5) == 1, "Best case: the target is first, 1 comparison."
assert comparisons(data, 9) == 5, "The target is last: 5 comparisons."
assert comparisons(data, 7) == 5, "Worst case: an absent target is compared with every item."
assert comparisons([], 7) == 0, "An empty list needs no comparisons."
assert average_case(list(range(9))) == 5, "For 9 items the average is (9 + 1) / 2 = 5. Got " + repr(average_case(list(range(9))))
assert average_case([5, 3, 8]) == 2, "For 3 items the average is 2."`,
            },
          ],
          solution: "def comparisons(items, target):\n    count = 0\n    for x in items:\n        count += 1\n        if x == target:\n            return count\n    return count\n\ndef average_case(items):\n    total = 0\n    for t in items:\n        total += comparisons(items, t)\n    return total / len(items)\n",
          hint: "comparisons: add 1 before each test, return the count when it matches. average_case: total comparisons(items, t) for every t, divided by len(items).",
          successMessage: "Your measurement matches the formula (n + 1)/2. Measuring a case and deriving it should always agree.",
        },
      },
      {
        id: "a-al-worst-case",
        title: "Worst-case performance",
        explain:
          "The WORST CASE is the maximum work over all inputs of size n. For linear search it is n comparisons. It is the case analysts report most often, for three reasons: it is a GUARANTEE (no input can do worse); it needs no assumptions about input probabilities; and for many algorithms the worst case happens often (searching for something that is not there is common). Real-time systems such as braking control and air-traffic software are designed to the worst case.",
        decision: {
          scenario: "An ambulance dispatch system must find the nearest available ambulance within 2 seconds, every time.",
          question: "Which analysis should decide whether the chosen algorithm is acceptable?",
          options: [
            { id: "a", text: "Best case", whyWrong: "The best case is a floor, not a promise. Most calls will not be the best case." },
            { id: "b", text: "Average case", whyWrong: "A good average still allows some calls to take far longer than 2 seconds." },
            { id: "c", text: "Worst case", why: "\"Every time\" is a guarantee, and only the worst-case bound provides one." },
            { id: "d", text: "None: just test it a few times", whyWrong: "A few tests cannot show the bound holds for every input." },
          ],
          correct: "c",
          aftermath: "When a requirement says \"always\" or \"guaranteed\", analyse the worst case.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.11 – 3.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l12-measuring",
    moduleId: "al-m3-analysis",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.11", "3.12"],
    title: "Empirical and Theoretical Analysis",
    subtitle: "Measuring performance, and predicting it",
    estimatedMinutes: 24,
    intro:
      "There are two ways to know how fast an algorithm is: run it and measure (empirical), or count its steps mathematically (theoretical). Professionals use both: theory to choose, experiment to confirm.",

    atoms: [
      {
        id: "a-al-empirical-vs-theoretical",
        title: "Empirical analysis versus theoretical analysis",
        explain:
          "EMPIRICAL analysis implements the algorithm, runs it on inputs of increasing size, and measures time or counts operations. It captures real effects (caches, the language, constant factors), but it needs an implementation, depends on the machine, and only covers the inputs you tried. THEORETICAL analysis counts basic operations as a function of n and describes their growth. It is machine-independent, covers every input size, and works before any code exists, but it ignores constant factors and assumes every basic operation costs the same.",
        table: {
          caption: "Two complementary methods.",
          headers: ["", "Empirical", "Theoretical"],
          rows: [
            ["Needs an implementation?", "Yes", "No"],
            ["Depends on the machine?", "Yes", "No"],
            ["Covers every input size?", "No, only those tested", "Yes"],
            ["Sees constant factors and caching?", "Yes", "No"],
            ["Typical output", "A table or graph of time against n", "A formula such as n(n − 1)/2, then O(n²)"],
          ],
        },
      },
      {
        id: "a-al-measuring-experimentally",
        title: "Measuring performance experimentally",
        explain:
          "To time code properly in Python, use time.perf_counter() (a high-resolution clock) or the timeit module, which runs the code many times. Rules for a fair experiment: use the same machine and inputs for every algorithm; repeat each measurement and take the minimum (the least disturbed run); test several input sizes, such as n, 2n, 4n; and look at RATIOS. If doubling n doubles the time, growth is linear; if it multiplies time by 4, quadratic. Counting operations, as below, gives the same ratios without the noise of a clock, which is why the practice in this course counts operations.",
        example:
          "import time\n\ndef timed(fn, data, repeats=5):\n    best = float(\"inf\")\n    for _ in range(repeats):\n        start = time.perf_counter()\n        fn(data)\n        best = min(best, time.perf_counter() - start)\n    return best\n\nfor n in [1000, 2000, 4000]:\n    data = list(range(n))\n    print(n, timed(sorted, data))",
        codeChallenge: {
          task: "Compare two algorithms that find the largest number in a list, by counting comparisons. Write max_single_pass(items), which keeps the best so far (one comparison per item after the first), and max_by_checking_all(items), which for each candidate compares it with EVERY item (including itself), counting every comparison and not stopping early, and returns the first candidate that is >= all items. Each returns a tuple (maximum, comparisons).",
          starter: "def max_single_pass(items):\n    pass\n\ndef max_by_checking_all(items):\n    pass\n",
          sample: "max_single_pass([3, 1, 4, 1, 5]) → (5, 4)\nmax_by_checking_all([3, 1, 4, 1, 5]) → (5, 25)",
          tests: [
            {
              check: py`assert max_single_pass([3, 1, 4, 1, 5]) == (5, 4), "Single pass on 5 items: 4 comparisons. Got " + repr(max_single_pass([3, 1, 4, 1, 5]))
assert max_by_checking_all([3, 1, 4, 1, 5]) == (5, 25), "The maximum is the 5th candidate, and each candidate costs 5 comparisons: 25. Got " + repr(max_by_checking_all([3, 1, 4, 1, 5]))
assert max_by_checking_all([9, 1, 4]) == (9, 3), "If the first candidate is the maximum, only 3 comparisons."
data = list(range(100))
assert max_single_pass(data) == (99, 99), "100 items: 99 comparisons."
assert max_by_checking_all(data) == (99, 10000), "Worst case for 100 items: 100 × 100 = 10,000 comparisons."
assert not calls("max") and not calls("sorted"), "Count the comparisons yourself, without max() or sorted()."`,
            },
          ],
          solution: "def max_single_pass(items):\n    best = items[0]\n    count = 0\n    for x in items[1:]:\n        count += 1\n        if x > best:\n            best = x\n    return best, count\n\ndef max_by_checking_all(items):\n    count = 0\n    for candidate in items:\n        is_max = True\n        for other in items:\n            count += 1\n            if other > candidate:\n                is_max = False\n        if is_max:\n            return candidate, count\n",
          hint: "Single pass: start with items[0] and count one comparison for each remaining item. Checking all: two nested loops; count inside the inner loop; return when a candidate beat no one.",
          successMessage: "99 against 10,000 for only 100 items. Both are correct; one grows like n, the other like n². On a million items that is a million against a trillion.",
        },
      },
      {
        id: "a-al-ten-versus-million",
        title: "Why 10 records is not 1,000,000",
        explain:
          "An algorithm that is instant on 10 records can be unusable on 1,000,000 because work grows with n, often faster than n. Assume a computer performs 10⁸ basic operations per second. A linear algorithm on a million records does 10⁶ operations: 0.01 seconds. A quadratic one does 10¹² operations: 10,000 seconds, nearly three hours. On 10 records both take well under a microsecond, so testing on small data hides the problem completely. That is the single most important reason to analyse algorithms rather than just try them.",
        table: {
          caption: "Estimated time at 10⁸ basic operations per second.",
          headers: ["n", "n operations", "n² operations"],
          rows: [
            ["10", "0.1 µs", "1 µs"],
            ["1,000", "10 µs", "0.01 s"],
            ["100,000", "1 ms", "100 s"],
            ["1,000,000", "0.01 s", "10,000 s ≈ 2.8 hours"],
          ],
        },
        decision: {
          scenario: "A duplicate-detection script compares every pair of customer records. It ran in a blink on the 10-record test file. Production has 1,000,000 records.",
          question: "What should you expect in production, and why?",
          options: [
            {
              id: "a",
              text: "About 5 × 10¹¹ comparisons, which takes over an hour: pairwise comparison grows like n²",
              why: "n(n − 1)/2 at n = 10⁶ is about 5 × 10¹¹; at 10⁸ operations a second that is roughly 5,000 seconds.",
            },
            { id: "b", text: "About 100,000 times longer than the test, so a few seconds", whyWrong: "That assumes linear growth. Pairwise comparison grows with n², so it is 10¹⁰ times the work, not 10⁵." },
            { id: "c", text: "The same speed, because it worked on the test file", whyWrong: "Small tests hide growth; the test file says nothing about scaling." },
            { id: "d", text: "It will crash immediately", whyWrong: "It will run, just for a very long time." },
          ],
          correct: "a",
          aftermath: "A hash set (Module 8) detects duplicates in one pass: about 10⁶ operations instead of 5 × 10¹¹.",
        },
      },
    ],

    task: {
      title: "Module 3 practice: measure, then explain",
      intro: "Use Python in VS Code or the editors above. Record your numbers in a table.",
      prompts: [
        "Compare two algorithms that find the largest number in a list (single pass and checking every candidate) by counting comparisons for n = 10, 100 and 1,000.",
        "Measure execution time with time.perf_counter() for sorted() and for your max functions at n = 1,000, 2,000, 4,000 and 8,000. Take the minimum of 5 runs. What happens to the time each time n doubles?",
        "Identify the best, average and worst cases of linear search, and of linear search on a SORTED list that stops as soon as it passes where the target would be.",
        "Explain in a paragraph why an algorithm that works for 10 records might become inefficient with one million records. Use operation counts, not adjectives.",
      ],
      closing: "Module 4 turns these counts into a method: deriving the time complexity of any code directly from its structure.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
