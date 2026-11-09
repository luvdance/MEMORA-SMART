/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 16 · OPTIMISATION AND COMPLEXITY
 *
 * Curriculum 16.1 – 16.22. Optimisation principles and bottlenecks;
 * amortized analysis by the aggregate, accounting and potential methods;
 * complexity theory, polynomial and exponential time; decision problems, P,
 * NP, NP-hard and NP-complete; approximation and randomized algorithms; and
 * the limits of computation. The practical work (optimising an inefficient
 * algorithm, an amortized structure, the Travelling Salesperson Problem) is
 * written and checked here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s16-complexity";

const PY = "python";
const py = String.raw;

// A symmetric 5-city distance matrix used by the TSP checks.
const CITIES = py`D5 = [
    [0, 2, 9, 10, 7],
    [2, 0, 6, 4, 3],
    [9, 6, 0, 8, 5],
    [10, 4, 8, 0, 6],
    [7, 3, 5, 6, 0],
]
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 16.1 – 16.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l67-optimisation",
    moduleId: "al-m16-complexity",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2", "16.3", "16.4", "16.5", "16.6", "16.7", "16.8"],
    title: "Algorithm Optimisation",
    subtitle: "Find the bottleneck, then fix the algorithm",
    estimatedMinutes: 36,
    intro:
      "Making a program faster is an engineering discipline, not guesswork: measure, find the part that dominates the running time, and improve the algorithm there before touching anything else.",

    atoms: [
      {
        id: "a-al-optimisation-principles",
        title: "Optimisation principles",
        explain:
          "Five principles, in order. 1. MAKE IT CORRECT first, with tests, so that optimisation cannot silently break it. 2. MEASURE: decide what \"fast enough\" means and time the real workload. 3. FIND THE BOTTLENECK: a profiler shows where the time goes; usually one function or loop dominates, and speeding up anything else barely helps (if a part takes 10% of the time, making it infinitely fast saves only 10%). 4. IMPROVE THE ALGORITHM before the code: a better complexity class beats every micro-optimisation once n is large. 5. MEASURE AGAIN. The standard techniques follow.",
        table: {
          caption: "Optimisation techniques, from most to least powerful (usually).",
          headers: ["Technique", "Example", "Typical gain"],
          rows: [
            ["Better algorithm", "Pair check O(n²) → set lookup O(n)", "A complexity class"],
            ["Better data structure", "list membership O(n) → set O(1)", "A complexity class"],
            ["Avoid redundant calculations", "Prefix sums; computing len() or a constant once, outside the loop", "Often a class"],
            ["Caching and memoization", "functools.lru_cache on a pure function", "Up to a class (exponential → polynomial)"],
            ["Reduce unnecessary iterations", "Stop at the first match; skip impossible cases", "Constant to large"],
            ["Loop optimisation", "Move invariant work out; use built-ins (sum, sorted) that run in C", "A constant factor"],
            ["Time-space trade-off", "Precompute a lookup table", "Depends on the reuse"],
          ],
        },
      },
      {
        id: "a-al-bottlenecks",
        title: "Identifying bottlenecks and optimising an inefficient algorithm",
        explain:
          "Python's built-in profiler shows where a program spends its time: run python -m cProfile -s cumulative program.py, or profile one call with cProfile.run(\"main()\"). Read the cumulative-time column and look for the function at the top that is YOURS. The commonest bottleneck in real code is a hidden quadratic: a membership test or search inside a loop over the same data. The fix is usually a better data structure: here, the two-sum problem (does any pair add up to the target?) checks every pair in O(n²), while remembering the numbers already seen in a set answers in one pass, O(n).",
        example:
          "import cProfile\n\ndef slow_pairs(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return True\n    return False\n\ncProfile.run(\"slow_pairs(list(range(3000)), -1)\")\n# The report shows almost all the time inside slow_pairs: 4.5 million\n# additions and comparisons for 3,000 numbers.",
        codeChallenge: {
          task: "Optimise an inefficient algorithm. The starter's has_pair_with_sum checks every pair: O(n²). Rewrite it to run in O(n): loop once, and for each number x check whether target − x has already been seen (keep a set), then add x. The tests use 20,000 numbers.",
          starter: "def has_pair_with_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return True\n    return False\n",
          sample: "has_pair_with_sum([8, 3, 11, 5], 16) → True   (11 + 5)",
          tests: [
            {
              check: py`assert has_pair_with_sum([8, 3, 11, 5], 16) is True, "11 + 5 = 16."
assert has_pair_with_sum([8, 3, 11, 5], 7) is False, "No pair adds to 7."
assert has_pair_with_sum([4, 2], 8) is False, "One 4 cannot be used twice."
assert has_pair_with_sum([4, 4], 8) is True, "Two separate 4s can."
assert has_pair_with_sum([], 0) is False, "An empty list."
big = list(range(0, 40000, 2))
assert has_pair_with_sum(big, -1) is False, "20,000 even numbers never add to -1: the O(n²) version needs 200 million checks for this."
assert has_pair_with_sum(big, 79994) is True, "39996 + 39998 = 79994."`,
            },
          ],
          solution: "def has_pair_with_sum(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen:\n            return True\n        seen.add(x)\n    return False\n",
          hint: "seen = set(). For each x: if target - x in seen, return True; then seen.add(x). After the loop, return False.",
          successMessage: "From O(n²) to O(n) by changing the data structure, and the [4, 2] test shows why the check comes before the add.",
        },
      },
      {
        id: "a-al-redundant-work",
        title: "Avoiding redundant calculations and caching",
        explain:
          "Redundant work is computation whose result was already known. Typical cases: recomputing a value inside a loop that does not change (hoist it out); recomputing overlapping sums or subproblems (precompute or memoize); calling a slow pure function repeatedly with the same arguments (cache it with functools.lru_cache). PREFIX SUMS are the classic precomputation: store prefix[i] = nums[0] + ... + nums[i − 1] once, in O(n); then the sum of nums[a:b] is prefix[b] − prefix[a], O(1) per query, instead of O(b − a).",
        codeChallenge: {
          task: "Write range_sums(nums, queries) that returns a list with the sum of nums[a:b] for each (a, b) in queries. Build a prefix-sum list once (prefix[0] = 0 and prefix[i + 1] = prefix[i] + nums[i]), then answer each query in O(1). Do not use sum(). The test has 5,000 numbers and 5,000 queries.",
          starter: "def range_sums(nums, queries):\n    pass\n",
          sample: "range_sums([3, 1, 4, 1, 5], [(0, 3), (2, 5)]) → [8, 10]",
          tests: [
            {
              check: py`assert range_sums([3, 1, 4, 1, 5], [(0, 3), (2, 5)]) == [8, 10], "3 + 1 + 4 = 8 and 4 + 1 + 5 = 10. Got " + repr(range_sums([3, 1, 4, 1, 5], [(0, 3), (2, 5)]))
assert range_sums([7, 7], [(1, 1), (0, 2)]) == [0, 14], "An empty range sums to 0."
import random
random.seed(5)
nums = [random.randint(-100, 100) for _ in range(5000)]
qs = [(a, a + random.randint(0, 5000 - a)) for a in (random.randrange(5000) for _ in range(5000))]
got = range_sums(nums, qs)
for (a, b), s in list(zip(qs, got))[:50]:
    want = 0
    for x in nums[a:b]:
        want += x
    assert s == want, f"Sum of nums[{a}:{b}] should be {want}, got {s}"
assert len(got) == 5000, "One answer per query."
assert not calls("sum"), "Use prefix sums rather than sum()."`,
            },
          ],
          solution: "def range_sums(nums, queries):\n    prefix = [0]\n    for x in nums:\n        prefix.append(prefix[-1] + x)\n    return [prefix[b] - prefix[a] for a, b in queries]\n",
          hint: "prefix = [0]; for x in nums: prefix.append(prefix[-1] + x). Then each answer is prefix[b] - prefix[a].",
          successMessage: "O(n + q) instead of O(nq): 10,000 steps instead of about 12 million. Precomputing once and reusing is the essence of avoiding redundant work.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 16.9 – 16.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l68-amortized",
    moduleId: "al-m16-complexity",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.9", "16.10", "16.11", "16.12"],
    title: "Amortized Analysis",
    subtitle: "Aggregate, accounting and potential methods",
    estimatedMinutes: 36,
    intro:
      "Some operations are usually cheap and occasionally very expensive: a dynamic array that must resize, a counter that carries through every bit. Amortized analysis proves that the expensive moments are rare enough that the average cost per operation stays small, guaranteed.",

    atoms: [
      {
        id: "a-al-aggregate",
        title: "Amortized analysis and the aggregate method",
        explain:
          "AMORTIZED ANALYSIS bounds the AVERAGE cost per operation over a worst-case SEQUENCE of n operations. Unlike average-case analysis, it uses no probability: it is a guarantee for every sequence. The AGGREGATE METHOD computes the total cost T(n) of n operations and divides: amortized cost = T(n)/n. A binary counter: incrementing flips the trailing 1s to 0 and one 0 to 1, so a single increment can flip k bits. But bit 0 flips every time, bit 1 every second time, bit 2 every fourth time, ..., so n increments flip fewer than n + n/2 + n/4 + ... < 2n bits: O(1) amortized per increment.",
        codeExercise: {
          language: PY,
          code: py`def total_flips(n, bits=16):
    counter = [0] * bits
    flips = 0
    for _ in range(n):
        i = 0
        while counter[i] == 1:
            counter[i] = 0
            flips += 1
            i += 1
        counter[i] = 1
        flips += 1
    return flips

print(total_flips(16), total_flips(1024))
`,
          question: "This counts every bit flip while incrementing a binary counter from 0, n times. What does it print for n = 16 and n = 1,024?",
          expectedOutput: "31 2047",
          hint: "The total is 2n minus the number of 1 bits in n. 16 and 1,024 each have one 1 bit.",
          successMessage: "Fewer than 2n flips in total, so under 2 per increment, even though a single increment can flip all 16 bits.",
        },
      },
      {
        id: "a-al-accounting",
        title: "The accounting method",
        explain:
          "The ACCOUNTING METHOD charges each operation an AMORTIZED cost that may be more than its actual cost; the surplus is stored as CREDIT on the data structure and later pays for expensive operations. The analysis is valid if the credit never goes negative. For a doubling dynamic array, charge every append 3: 1 pays for writing the item itself, and 2 are saved as credit on it. When the array of capacity c is full and doubles, the c/2 items appended since the last resize hold c units of credit, exactly enough to pay for copying all c items. So every append costs O(1) amortized.",
        table: {
          caption: "Accounting for a doubling dynamic array (charge 3 per append).",
          headers: ["Event", "Actual cost", "Charged", "Credit change"],
          rows: [
            ["Append with spare capacity", "1 (write)", "3", "+2 stored on the new item"],
            ["Append that triggers a resize from c to 2c", "1 + c (write + copy c items)", "3", "−c + 2: the c/2 newest items' credit pays the copy"],
            ["Over n appends", "< 3n in total", "3n", "never negative"],
          ],
        },
      },
      {
        id: "a-al-potential",
        title: "The potential method: a queue from two stacks",
        explain:
          "The POTENTIAL METHOD defines a function Φ of the data structure's state (its \"stored energy\"), with Φ ≥ 0 and Φ = 0 at the start. The amortized cost of an operation is its actual cost plus the CHANGE in potential: ĉ = c + ΔΦ. Summed over a sequence, the potential terms telescope, so the total actual cost is at most the total amortized cost. For a queue built from two stacks (push onto IN; to dequeue, pop from OUT, first moving everything from IN to OUT if OUT is empty), take Φ = 2 × (number of items in IN). Each item is pushed once, moved once and popped once, so n operations cost O(n): O(1) amortized, although a single dequeue can move n items.",
        codeChallenge: {
          task: "Implement QueueFromStacks with two Python lists used only as stacks (append and pop from the end). enqueue(x) pushes onto self.inbox. dequeue() pops from self.outbox, first moving every item from inbox to outbox if outbox is empty; it returns None if both are empty. Count every item moved from inbox to outbox in self.moves.",
          starter: "class QueueFromStacks:\n    def __init__(self):\n        self.inbox = []\n        self.outbox = []\n        self.moves = 0\n\n    def enqueue(self, x):\n        pass\n\n    def dequeue(self):\n        pass\n",
          sample: "q.enqueue(1); q.enqueue(2); q.dequeue() → 1",
          tests: [
            {
              check: py`q = QueueFromStacks()
for x in [1, 2, 3]:
    q.enqueue(x)
assert q.dequeue() == 1, "First in, first out: 1 comes out first."
q.enqueue(4)
assert [q.dequeue(), q.dequeue(), q.dequeue()] == [2, 3, 4], "Then 2, 3, 4."
assert q.dequeue() is None, "An empty queue returns None."
big = QueueFromStacks()
out = []
for i in range(5000):
    big.enqueue(i)
    if i % 3 == 0:
        out.append(big.dequeue())
while True:
    v = big.dequeue()
    if v is None:
        break
    out.append(v)
assert out == list(range(5000)), "5,000 items come out in arrival order."
assert big.moves == 5000, "Each item is moved from inbox to outbox exactly once: 5,000 moves for 5,000 items. Counted " + repr(big.moves)
assert not calls("insert") and "pop(0)" not in source.replace(" ", "") and "deque" not in source.replace("dequeue", ""), "Use the two lists only as stacks."`,
            },
          ],
          solution: "class QueueFromStacks:\n    def __init__(self):\n        self.inbox = []\n        self.outbox = []\n        self.moves = 0\n\n    def enqueue(self, x):\n        self.inbox.append(x)\n\n    def dequeue(self):\n        if not self.outbox:\n            while self.inbox:\n                self.outbox.append(self.inbox.pop())\n                self.moves += 1\n        if not self.outbox:\n            return None\n        return self.outbox.pop()\n",
          hint: "enqueue: inbox.append(x). dequeue: if outbox is empty, pop everything from inbox onto outbox (counting moves); then pop from outbox, or return None.",
          successMessage: "Exactly one move per item over the whole sequence: O(1) amortized, which is what the potential function Φ = 2 × |inbox| proves.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 16.13 – 16.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l69-complexity-theory",
    moduleId: "al-m16-complexity",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.13", "16.14", "16.15"],
    title: "Computational Complexity Theory",
    subtitle: "Polynomial-time and exponential-time problems",
    estimatedMinutes: 32,
    intro:
      "Until now the question was how fast an ALGORITHM is. Complexity theory asks how hard a PROBLEM is: the least time any algorithm could need. Some problems have fast algorithms; for others, after decades of effort, nobody knows anything much better than trying every possibility.",

    atoms: [
      {
        id: "a-al-complexity-theory-intro",
        title: "Introduction to computational complexity theory",
        explain:
          "COMPUTATIONAL COMPLEXITY THEORY classifies PROBLEMS by the resources needed to solve them, over all possible algorithms. A problem's complexity is that of its BEST algorithm: sorting by comparisons is Θ(n log n) because merge sort achieves it and the lower bound shows nothing can do better. Problems are grouped into COMPLEXITY CLASSES. The central divide is between problems solvable in POLYNOMIAL time (considered tractable) and those for which only EXPONENTIAL-time algorithms are known (considered intractable for large inputs). The theory is usually stated for decision problems (yes/no questions), introduced in Lesson 70.",
        table: {
          caption: "Problems you have met, by the best known running time.",
          headers: ["Problem", "Best known algorithm", "Class"],
          rows: [
            ["Searching a sorted list", "Binary search, O(log n)", "Polynomial"],
            ["Sorting", "Merge sort, O(n log n)", "Polynomial"],
            ["Shortest paths (non-negative weights)", "Dijkstra, O((V + E) log V)", "Polynomial"],
            ["Minimum spanning tree", "Kruskal, O(E log E)", "Polynomial"],
            ["Longest common subsequence", "DP, O(mn)", "Polynomial"],
            ["Travelling Salesperson (exact)", "Held-Karp DP, O(n² 2ⁿ)", "Exponential (NP-hard)"],
            ["Subset sum, 0/1 knapsack (exact)", "DP O(nW): pseudo-polynomial", "NP-hard"],
            ["Graph colouring with k ≥ 3 colours", "Exponential", "NP-complete"],
          ],
        },
      },
      {
        id: "a-al-polynomial-time",
        title: "Polynomial-time algorithms",
        explain:
          "A POLYNOMIAL-TIME algorithm runs in O(nᵏ) for a constant k, where n is the size of the input written down (its length in bits or symbols). The class of decision problems with such algorithms is called P. Everything in Modules 8 to 15 except brute force is polynomial. Care is needed with NUMBERS in the input: the knapsack DP's O(nW) looks polynomial, but W can be written with only log₂ W bits, so O(nW) is exponential in the input's length. That is called PSEUDO-POLYNOMIAL, and it is why the knapsack problem is not known to be in P.",
        decision: {
          scenario: "Testing whether a number N is prime by trying every divisor from 2 to √N takes about √N divisions.",
          question: "Is this a polynomial-time algorithm in the size of the input?",
          options: [
            {
              id: "a",
              text: "No: the input has about log₂ N digits (bits) b, and √N = 2^(b/2), which is exponential in b",
              why: "Complexity is measured against the input's length. Polynomial-time primality testing exists (the AKS algorithm, 2002), but trial division is not it.",
            },
            { id: "b", text: "Yes, because √N is less than N", whyWrong: "The comparison must be with the input length b = log₂ N, not with N." },
            { id: "c", text: "Yes, because it uses only a loop", whyWrong: "A loop that runs exponentially many times is exponential." },
            { id: "d", text: "Primality cannot be decided by any algorithm", whyWrong: "It can, and in polynomial time." },
          ],
          correct: "a",
          aftermath: "This is why RSA is secure in practice: multiplying is polynomial in the digits, but no known algorithm factors in polynomial time.",
        },
      },
      {
        id: "a-al-exponential-time",
        title: "Exponential-time algorithms: the Travelling Salesperson Problem",
        explain:
          "The TRAVELLING SALESPERSON PROBLEM (TSP): given distances between n cities, find the shortest tour that visits every city once and returns to the start. Brute force fixes the start city and tries all (n − 1)! orders of the others: O(n!). Dynamic programming over subsets (Held-Karp) improves this to O(n² 2ⁿ), still exponential. For 10 cities brute force checks 362,880 tours; for 20 cities about 1.2 × 10¹⁷. No polynomial algorithm is known, and finding one would prove P = NP. Delivery companies therefore use approximation and heuristics (Lesson 71).",
        codeChallenge: {
          task: "Investigate the TSP. Write tsp_brute(dist) for an n × n distance matrix (n ≥ 2): fix city 0 as the start, try every ordering of the other cities with itertools.permutations, and return the length of the shortest tour that visits every city once and returns to 0.",
          starter: "import itertools\n\ndef tsp_brute(dist):\n    pass\n",
          sample: "tsp_brute(D5) → 26",
          tests: [
            {
              check: CITIES + py`assert tsp_brute(D5) == 26, "The shortest tour of the 5 cities is 26. Got " + repr(tsp_brute(D5))
assert tsp_brute([[0, 5], [5, 0]]) == 10, "Two cities: there and back."
square = [[0, 1, 2, 1], [1, 0, 1, 2], [2, 1, 0, 1], [1, 2, 1, 0]]
assert tsp_brute(square) == 4, "Four corners of a square, side 1: the tour round the edge is 4."
import random
random.seed(9)
pts = [(random.random(), random.random()) for _ in range(8)]
D8 = [[((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5 for b in pts] for a in pts]
best = tsp_brute(D8)
for perm in itertools.permutations(range(1, 8)):
    tour = (0,) + perm + (0,)
    length = sum(D8[tour[i]][tour[i + 1]] for i in range(8))
    assert best <= length + 1e-9, "Your answer is longer than another tour: check every ordering."
    break`,
            },
          ],
          solution: "import itertools\n\ndef tsp_brute(dist):\n    n = len(dist)\n    best = float(\"inf\")\n    for perm in itertools.permutations(range(1, n)):\n        tour = (0,) + perm + (0,)\n        length = 0\n        for i in range(n):\n            length += dist[tour[i]][tour[i + 1]]\n        best = min(best, length)\n    return best\n",
          hint: "For each perm of range(1, n), the tour is (0,) + perm + (0,). Add up dist[tour[i]][tour[i + 1]] for i in range(n), and keep the minimum.",
          successMessage: "8 cities took 5,040 tours. 15 cities would take 87 billion. That explosion is what \"no known polynomial algorithm\" means in practice.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 16.16 – 16.19
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l70-p-np",
    moduleId: "al-m16-complexity",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.16", "16.17", "16.18", "16.19"],
    title: "P, NP, NP-Hard and NP-Complete",
    subtitle: "Decision problems, certificates, reductions and the biggest open question",
    estimatedMinutes: 38,
    intro:
      "P versus NP asks whether every problem whose solutions are easy to CHECK is also easy to SOLVE. It is the most famous open problem in computer science, with a one-million-dollar prize, and it explains why so many practical problems are hard.",

    atoms: [
      {
        id: "a-al-decision-problems",
        title: "Decision problems",
        explain:
          "A DECISION PROBLEM has a yes/no answer: \"Is there a tour of length at most k?\", \"Can this graph be coloured with 3 colours?\", \"Is there a subset summing to exactly t?\". Complexity classes are defined for decision problems because yes/no answers are simple to compare. Every optimisation problem has a decision version, and the two are closely linked: if you can solve the decision version quickly, binary searching on k usually finds the optimum quickly too (for example, the shortest TSP tour length in O(log(total distance)) decision calls). So hardness results for decision problems apply to the optimisation problems people actually care about.",
        decision: {
          scenario: "The OPTIMISATION problem is: find the minimum number of colours needed to colour a map so that neighbouring regions differ.",
          question: "Which is its DECISION version?",
          options: [
            { id: "a", text: "Given the map and a number k, can it be coloured with at most k colours?", why: "A yes/no question with a threshold k. Answering it for k = 1, 2, 3, ... finds the minimum." },
            { id: "b", text: "Colour the map with as few colours as possible", whyWrong: "That is the optimisation problem itself." },
            { id: "c", text: "Count the regions of the map", whyWrong: "That is a different, easy problem." },
            { id: "d", text: "List every possible colouring", whyWrong: "That is enumeration, not a yes/no question." },
          ],
          correct: "a",
          aftermath: "Optimisation becomes \"is there a solution at least this good?\".",
        },
      },
      {
        id: "a-al-np",
        title: "NP problems: easy to check",
        explain:
          "NP (Nondeterministic Polynomial time) is the class of decision problems whose YES answers can be VERIFIED in polynomial time, given a suitable CERTIFICATE (a proposed solution). For TSP-decision the certificate is a tour: checking that it visits every city once and has length ≤ k takes O(n). For subset sum it is the subset: add it up and compare. Finding the certificate may be hard; checking it is easy. Every problem in P is also in NP (a polynomial algorithm can ignore the certificate and just solve the problem), so P ⊆ NP.",
        codeChallenge: {
          task: "Write a polynomial-time VERIFIER for TSP-decision. verify_tour(dist, tour, k) returns True only if tour is a list that starts and ends at city 0, visits every city of the n × n matrix exactly once in between, and has total length at most k; otherwise False.",
          starter: "def verify_tour(dist, tour, k):\n    pass\n",
          sample: "verify_tour(D5, [0, 1, 3, 2, 4, 0], 26) → True",
          tests: [
            {
              check: CITIES + py`assert verify_tour(D5, [0, 1, 3, 2, 4, 0], 26) is True, "2 + 4 + 8 + 5 + 7 = 26 ≤ 26: a valid certificate."
assert verify_tour(D5, [0, 1, 3, 2, 4, 0], 25) is False, "Length 26 is more than 25."
assert verify_tour(D5, [0, 1, 3, 4, 0], 100) is False, "City 2 is missing."
assert verify_tour(D5, [0, 1, 1, 3, 2, 4, 0], 100) is False, "City 1 is visited twice."
assert verify_tour(D5, [1, 0, 3, 2, 4, 1], 100) is False, "The tour must start and end at city 0."
assert verify_tour(D5, [0, 1, 3, 2, 4], 100) is False, "The tour must return to city 0."`,
            },
          ],
          solution: "def verify_tour(dist, tour, k):\n    n = len(dist)\n    if len(tour) != n + 1 or tour[0] != 0 or tour[-1] != 0:\n        return False\n    if sorted(tour[:-1]) != list(range(n)):\n        return False\n    length = 0\n    for i in range(n):\n        length += dist[tour[i]][tour[i + 1]]\n    return length <= k\n",
          hint: "Check the length is n + 1 and both ends are 0; check sorted(tour[:-1]) == list(range(n)); then add up the legs and compare with k.",
          successMessage: "Checking a tour is O(n log n). Finding the best one is believed to need exponential time. That gap is the P versus NP question.",
        },
      },
      {
        id: "a-al-p-vs-np-complete",
        title: "P versus NP, NP-hard and NP-complete",
        explain:
          "P VERSUS NP: is P = NP, that is, can every problem whose solutions are quick to check also be solved quickly? Most researchers believe P ≠ NP, but nobody has proved it either way; it is one of the Clay Millennium Prize Problems. A problem X is NP-HARD if every problem in NP can be REDUCED to X in polynomial time (transformed so that a fast algorithm for X would solve it fast): X is at least as hard as anything in NP. X is NP-COMPLETE if it is NP-hard AND in NP: the hardest problems inside NP. Cook and Levin (1971) proved SAT (Boolean satisfiability) NP-complete; Karp (1972) then reduced it to 21 others. If ANY NP-complete problem has a polynomial algorithm, then P = NP.",
        table: {
          caption: "The classes at a glance (assuming P ≠ NP).",
          headers: ["Class", "Definition", "Examples"],
          rows: [
            ["P", "Solvable in polynomial time", "Sorting, shortest paths, MST, LCS"],
            ["NP", "Yes-answers verifiable in polynomial time", "Everything in P, plus all NP-complete problems"],
            ["NP-complete", "In NP and NP-hard", "SAT, 3-SAT, TSP-decision, subset sum, 3-colouring, vertex cover, Hamiltonian cycle"],
            ["NP-hard", "At least as hard as every NP problem (need not be in NP)", "All NP-complete problems, TSP optimisation, the halting problem"],
          ],
        },
        decision: {
          scenario: "A startup announces a proven polynomial-time algorithm for 3-SAT, an NP-complete problem.",
          question: "If the claim were true, what would follow?",
          options: [
            {
              id: "a",
              text: "P = NP: every problem in NP, including TSP-decision and subset sum, would have a polynomial-time algorithm by reduction to 3-SAT",
              why: "NP-completeness means everything in NP reduces to 3-SAT in polynomial time, so a fast 3-SAT gives a fast everything.",
            },
            { id: "b", text: "Only 3-SAT would become easy", whyWrong: "Every NP problem reduces to an NP-complete one." },
            { id: "c", text: "Nothing, because 3-SAT is in P already", whyWrong: "3-SAT is NP-complete; it is not known to be in P." },
            { id: "d", text: "The halting problem would become solvable", whyWrong: "The halting problem is undecidable: no algorithm exists, fast or slow." },
          ],
          correct: "a",
          aftermath: "That is why such claims are met with heavy scepticism: thousands of researchers have looked for exactly this.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 16.20 – 16.22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l71-approximation-randomized",
    moduleId: "al-m16-complexity",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["16.20", "16.21", "16.22"],
    title: "Approximation, Randomized Algorithms and the Limits of Computation",
    subtitle: "What to do when exact and fast cannot both be had",
    estimatedMinutes: 36,
    intro:
      "When a problem is NP-hard, giving up is not an option: delivery vans still need routes. Approximation algorithms trade a little quality for speed, randomized algorithms trade a little certainty, and some problems, it turns out, have no algorithm at all.",

    atoms: [
      {
        id: "a-al-approximation",
        title: "Introduction to approximation algorithms",
        explain:
          "An APPROXIMATION ALGORITHM runs in polynomial time and returns a solution GUARANTEED to be within a factor of the optimum (the approximation ratio). Examples: vertex cover has a simple 2-approximation (repeatedly take both ends of any uncovered edge); for METRIC TSP (distances obey the triangle inequality), walking around a minimum spanning tree gives a tour at most 2 × optimal, and Christofides' algorithm 1.5 ×. A HEURISTIC such as nearest neighbour (always go to the closest unvisited city) is fast and often good, but has no fixed guarantee. In practice, a heuristic tour improved by local search (2-opt) is how large delivery problems are solved.",
        codeChallenge: {
          task: "Write nearest_neighbour(dist) for an n × n distance matrix: start at city 0, repeatedly move to the nearest unvisited city (the lowest index on ties), and finally return to 0. Return (tour, length) where tour is the list of cities starting and ending with 0.",
          starter: "def nearest_neighbour(dist):\n    pass\n",
          sample: "nearest_neighbour(D5) → ([0, 1, 4, 2, 3, 0], 28)",
          tests: [
            {
              check: CITIES + py`assert nearest_neighbour(D5) == ([0, 1, 4, 2, 3, 0], 28), "0 → 1 (2) → 4 (3) → 2 (5) → 3 (8) → 0 (10) = 28. Got " + repr(nearest_neighbour(D5))
assert nearest_neighbour([[0, 5], [5, 0]]) == ([0, 1, 0], 10), "Two cities."
import random
random.seed(4)
pts = [(random.random(), random.random()) for _ in range(150)]
D = [[((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5 for b in pts] for a in pts]
tour, length = nearest_neighbour(D)
assert tour[0] == 0 and tour[-1] == 0 and sorted(tour[:-1]) == list(range(150)), "150 cities: a valid tour visiting each once."
assert abs(length - sum(D[tour[i]][tour[i + 1]] for i in range(150))) < 1e-6, "The length must be the tour's real length."`,
            },
          ],
          solution: "def nearest_neighbour(dist):\n    n = len(dist)\n    tour = [0]\n    visited = {0}\n    length = 0\n    current = 0\n    while len(tour) < n:\n        best = None\n        for city in range(n):\n            if city not in visited and (best is None or dist[current][city] < dist[current][best]):\n                best = city\n        length += dist[current][best]\n        tour.append(best)\n        visited.add(best)\n        current = best\n    length += dist[current][0]\n    tour.append(0)\n    return tour, length\n",
          hint: "Keep current, visited and length. While cities remain, scan for the unvisited city with the smallest dist[current][city] (strict < keeps the lowest index on ties). Finish by returning to 0.",
          successMessage: "28 against the optimum 26: 8% worse, found in O(n²) instead of O(n!). For 150 cities, brute force would never finish.",
        },
      },
      {
        id: "a-al-randomized",
        title: "Introduction to randomized algorithms",
        explain:
          "A RANDOMIZED ALGORITHM makes random choices. LAS VEGAS algorithms are always correct, and only their running time is random: randomized quick sort (Module 10) always sorts, in expected O(n log n). MONTE CARLO algorithms run in fixed time but may be wrong with a small, controllable probability. The MILLER-RABIN primality test is the classic: a composite n passes one random round with probability at most 1/4, so 20 independent rounds are fooled with probability at most 4⁻²⁰ ≈ 10⁻¹², while each round costs only O(log n) multiplications using fast modular exponentiation (pow(a, d, n)). It is how cryptographic software finds large primes.",
        codeChallenge: {
          task: "Write is_probable_prime(n, rounds=20) using Miller-Rabin. Handle n < 4 and even n directly. Write n − 1 = d × 2ˢ with d odd. In each round pick a random base a in [2, n − 2] (use rng = random.Random(42) for repeatability), compute x = pow(a, d, n); if x is 1 or n − 1 the round passes; otherwise square x up to s − 1 times, passing if it becomes n − 1; if it never does, n is composite.",
          starter: "import random\n\ndef is_probable_prime(n, rounds=20):\n    pass\n",
          sample: "is_probable_prime(97) → True\nis_probable_prime(561) → False",
          tests: [
            {
              check: py`small_primes = [p for p in range(2, 200) if all(p % q for q in range(2, p))]
for n in range(0, 200):
    assert is_probable_prime(n) == (n in small_primes), f"is_probable_prime({n}) should be {n in small_primes}"
assert is_probable_prime(561) is False and is_probable_prime(1105) is False, "Carmichael numbers fool the simple Fermat test, but not Miller-Rabin."
assert is_probable_prime(2 ** 61 - 1) is True, "2^61 − 1 is a Mersenne prime (19 digits), tested in microseconds."
assert is_probable_prime((2 ** 61 - 1) * (2 ** 31 - 1)) is False, "A product of two large primes is composite."`,
            },
          ],
          solution: "import random\n\ndef is_probable_prime(n, rounds=20):\n    if n < 2:\n        return False\n    if n < 4:\n        return True\n    if n % 2 == 0:\n        return False\n    d, s = n - 1, 0\n    while d % 2 == 0:\n        d //= 2\n        s += 1\n    rng = random.Random(42)\n    for _ in range(rounds):\n        a = rng.randrange(2, n - 1)\n        x = pow(a, d, n)\n        if x == 1 or x == n - 1:\n            continue\n        for _ in range(s - 1):\n            x = x * x % n\n            if x == n - 1:\n                break\n        else:\n            return False\n    return True\n",
          hint: "Strip factors of 2 from n − 1 to get d and s. For each round: x = pow(a, d, n); pass if x is 1 or n − 1; else square up to s − 1 times looking for n − 1; if not found, return False. After all rounds, return True.",
          successMessage: "A 19-digit prime confirmed with error probability below 10⁻¹², in a few hundred multiplications. Trial division would need a billion divisions.",
        },
      },
      {
        id: "a-al-limits",
        title: "The limits of algorithmic computation",
        explain:
          "Some problems have NO algorithm at all. Alan Turing proved in 1936 that the HALTING PROBLEM (given any program and input, decide whether it eventually stops) is UNDECIDABLE. The proof is by contradiction: suppose halts(P, x) always answered correctly; build a program D that runs halts(D, D) and then does the OPPOSITE (loops forever if the answer is \"halts\", stops if it is \"loops\"); now D halts exactly when it does not, which is impossible. Rice's theorem extends this: every non-trivial question about what a program computes is undecidable. So the landscape has three regions: problems solvable efficiently (P), problems solvable only slowly as far as anyone knows (NP-complete and beyond), and problems not solvable by any algorithm (undecidable).",
        decision: {
          scenario: "A company wants a tool that examines ANY program and guarantees to report whether it can ever get stuck in an infinite loop.",
          question: "What should an algorithms engineer tell them?",
          options: [
            {
              id: "a",
              text: "No tool can do this for every program: it would solve the halting problem, which is undecidable. Practical tools handle common cases and say \"unknown\" otherwise",
              why: "Undecidability is absolute, not a matter of speed. Real static analysers are sound for some patterns and give up on others.",
            },
            { id: "b", text: "It is possible but NP-complete, so it will be slow", whyWrong: "It is not slow; it is impossible in general." },
            { id: "c", text: "Run the program and wait to see if it stops", whyWrong: "If it has not stopped yet, you cannot know whether it ever will." },
            { id: "d", text: "A faster computer would make it possible", whyWrong: "Undecidability has nothing to do with speed." },
          ],
          correct: "a",
          aftermath: "Knowing what cannot be computed is as important as knowing how to compute fast.",
        },
      },
    ],

    task: {
      title: "Module 16 practice: optimisation and complexity",
      intro: "Use cProfile and timeit for the measurement exercises.",
      prompts: [
        "Optimise an inefficient algorithm: take a function that finds the common items of two lists with nested loops, profile it, rewrite it with a set, and report the speed-up at 10,000 items.",
        "Compare multiple solutions to the same problem: Fibonacci by naive recursion, memoization, tabulation and two variables; tabulate time and memory.",
        "Identify bottlenecks using profiling tools: run cProfile on one of your capstone candidates and explain the top three lines of its report.",
        "Analyse an algorithm with amortized complexity: prove that a stack with push, pop and multipop(k) costs O(1) amortized per operation, by both the aggregate and the potential method.",
        "Investigate a simplified NP-complete problem: solve TSP exactly for 5 to 10 cities, time it, and compare the nearest-neighbour heuristic's tour lengths with the optimum.",
      ],
      closing: "Phase 8 turns from theory to practice: Module 17 shows these algorithms inside real systems.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
