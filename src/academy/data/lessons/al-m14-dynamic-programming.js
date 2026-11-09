/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 14 · DYNAMIC PROGRAMMING
 *
 * Curriculum 14.1 – 14.15. Overlapping subproblems and optimal substructure;
 * memoization and tabulation, top-down and bottom-up; Fibonacci, 0/1
 * knapsack, coin change, LCS, LIS and matrix chain multiplication; state
 * transitions, space optimisation and complexity. The large tests are sized
 * so that the exponential recursion cannot pass and the DP solution can.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s14-dynamic-programming";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 14.1 – 14.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l57-dp-intro",
    moduleId: "al-m14-dynamic-programming",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3", "14.4", "14.5", "14.6"],
    title: "Introduction to Dynamic Programming",
    subtitle: "Overlapping subproblems, memoization and tabulation",
    estimatedMinutes: 34,
    intro:
      "Dynamic programming is recursion that remembers. When the same subproblems come up again and again, solve each one once, store the answer, and reuse it. That single idea turns many exponential algorithms into polynomial ones.",

    atoms: [
      {
        id: "a-al-dp-intro",
        title: "Overlapping subproblems and optimal substructure",
        explain:
          "DYNAMIC PROGRAMMING (DP, named by Richard Bellman in the 1950s) applies to optimisation and counting problems with two properties. OPTIMAL SUBSTRUCTURE: an optimal solution is built from optimal solutions to subproblems (as in greedy algorithms and divide and conquer). OVERLAPPING SUBPROBLEMS: a naive recursion solves the SAME subproblems many times (unlike divide and conquer, whose subproblems are independent). Naive recursive Fibonacci computes fib(2) tens of thousands of times for n = 25. DP solves each distinct subproblem once and stores it, so the cost becomes (number of distinct subproblems) × (work per subproblem).",
        table: {
          caption: "Three design techniques compared.",
          headers: ["", "Divide and conquer", "Greedy", "Dynamic programming"],
          rows: [
            ["Subproblems", "Independent", "One, after the choice", "Overlapping"],
            ["Choices", "None to make", "Commits to the locally best", "Tries every choice, keeps the best"],
            ["Reuses results?", "No", "No", "Yes: memo or table"],
            ["Typical cost", "Recurrence, e.g. n log n", "A sort plus a pass", "States × transition cost"],
            ["Examples", "Merge sort, Karatsuba", "Huffman, Prim, activity selection", "Knapsack, LCS, shortest paths"],
          ],
        },
      },
      {
        id: "a-al-memoization",
        title: "Memoization: top-down dynamic programming",
        explain:
          "MEMOIZATION keeps the natural recursive solution and adds a cache (usually a dict keyed by the arguments): before computing, check the cache; after computing, store the result. Each distinct subproblem is then computed once; every later call is an O(1) lookup. This is TOP-DOWN DP: it starts from the original problem and only solves the subproblems it actually needs. Python offers it in one line, @functools.lru_cache(maxsize=None) (or @cache), but writing the dict yourself shows exactly what happens. The cost: O(number of states) memory and recursion depth.",
        codeChallenge: {
          task: "Count the paths through an r × c grid from the top-left cell to the bottom-right cell, moving only right or down. Write grid_paths(r, c) recursively: a grid with 1 row or 1 column has exactly 1 path; otherwise paths(r, c) = paths(r − 1, c) + paths(r, c − 1). MEMOIZE it with a dict, so that grid_paths(18, 18) is instant (unmemoized it would need over 2 billion calls).",
          starter: "memo = {}\n\ndef grid_paths(r, c):\n    pass\n",
          sample: "grid_paths(3, 3) → 6",
          tests: [
            {
              check: py`assert grid_paths(3, 3) == 6, "A 3 × 3 grid has 6 paths. Got " + repr(grid_paths(3, 3))
assert grid_paths(1, 7) == 1 and grid_paths(5, 1) == 1, "A single row or column has one path."
assert grid_paths(2, 2) == 2 and grid_paths(3, 4) == 10, "2 × 2 has 2 paths; 3 × 4 has 10."
assert grid_paths(18, 18) == 2333606220, "18 × 18 must be instant with memoization: 2,333,606,220 paths."`,
            },
          ],
          solution: "memo = {}\n\ndef grid_paths(r, c):\n    if r == 1 or c == 1:\n        return 1\n    if (r, c) in memo:\n        return memo[(r, c)]\n    result = grid_paths(r - 1, c) + grid_paths(r, c - 1)\n    memo[(r, c)] = result\n    return result\n",
          hint: "Base case r == 1 or c == 1 returns 1. Look up (r, c) in memo first; otherwise compute the two recursive calls, store the sum in memo[(r, c)], and return it.",
          successMessage: "18 × 18 = 324 distinct subproblems instead of billions of calls. Same recursion, plus a dict: that is memoization.",
        },
      },
      {
        id: "a-al-tabulation",
        title: "Tabulation: bottom-up dynamic programming",
        explain:
          "TABULATION fills a table of subproblem answers ITERATIVELY, from the smallest subproblems up, in an order that guarantees every value a cell needs is already computed. This is BOTTOM-UP DP. Compared with memoization it uses no recursion (no stack overflow, less overhead) and often allows the table to be shrunk to the last few rows. Its cost is that it may compute subproblems the top-down version would never need, and the evaluation order must be worked out. Both give the same asymptotic time.",
        table: {
          caption: "Top-down versus bottom-up.",
          headers: ["", "Memoization (top-down)", "Tabulation (bottom-up)"],
          rows: [
            ["Structure", "Recursive function plus a cache", "Loops filling a table"],
            ["Order of solving", "On demand, as recursion reaches it", "Fixed, smallest subproblems first"],
            ["Solves unneeded subproblems?", "No", "Possibly"],
            ["Stack depth", "Up to the number of states", "None"],
            ["Space optimisation", "Hard", "Often easy (keep only recent rows)"],
          ],
        },
        codeChallenge: {
          task: "A student can climb a staircase 1, 2 or 3 steps at a time. Write climb(n) that returns how many different ways there are to climb n steps, by TABULATION: a list ways where ways[0] = 1 and ways[i] = ways[i − 1] + ways[i − 2] + ways[i − 3] (treating negative indexes as 0), filled with a loop from 1 to n. Use no recursion.",
          starter: "def climb(n):\n    pass\n",
          sample: "climb(4) → 7",
          tests: [
            {
              check: py`assert [climb(i) for i in range(1, 7)] == [1, 2, 4, 7, 13, 24], "The first six counts. Got " + repr([climb(i) for i in range(1, 7)])
assert climb(0) == 1, "There is one way to climb 0 steps: do nothing."
assert climb(60) == 4680045560037375, "climb(60) must be exact and instant."
assert uses("For") or uses("While"), "Fill the table with a loop."
import ast
fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "climb"][0]
assert not any(isinstance(c, ast.Call) and getattr(c.func, "id", "") == "climb" for c in ast.walk(fn)), "Tabulation is bottom-up: climb should not call itself."`,
            },
          ],
          solution: "def climb(n):\n    ways = [0] * (n + 1)\n    ways[0] = 1\n    for i in range(1, n + 1):\n        ways[i] = ways[i - 1]\n        if i >= 2:\n            ways[i] += ways[i - 2]\n        if i >= 3:\n            ways[i] += ways[i - 3]\n    return ways[n]\n",
          hint: "ways = [0] * (n + 1); ways[0] = 1. For i from 1 to n, add ways[i - 1], plus ways[i - 2] if i >= 2, plus ways[i - 3] if i >= 3.",
          successMessage: "A table of n + 1 numbers filled left to right: O(n) time. The last move is 1, 2 or 3 steps, which is the state transition.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 14.7 – 14.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l58-fibonacci-knapsack",
    moduleId: "al-m14-dynamic-programming",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.7", "14.8"],
    title: "Fibonacci Optimisation and the 0/1 Knapsack",
    subtitle: "From exponential to linear, and the most famous DP problem",
    estimatedMinutes: 38,
    intro:
      "Fibonacci shows the whole progression of dynamic programming in miniature: exponential recursion, linear memoization, linear tabulation, constant space. Then the 0/1 knapsack, where greedy failed, is solved exactly.",

    atoms: [
      {
        id: "a-al-fibonacci-optimisation",
        title: "Fibonacci optimisation: recursive, memoized and tabulated",
        explain:
          "Four versions of fib(n). NAIVE recursion: about φⁿ calls (φ ≈ 1.618), O(φⁿ) time, O(n) stack. MEMOIZED: each of the n + 1 values is computed once, about 2n calls, O(n) time and O(n) space. TABULATED: a loop fills table[0..n], O(n) time and O(n) space, no recursion. SPACE-OPTIMISED: each value needs only the previous two, so keep two variables: O(n) time, O(1) space. The jump from the first to the second is the jump from impossible to instant.",
        codeExercise: {
          language: PY,
          code: py`naive_calls = 0
def fib_naive(n):
    global naive_calls
    naive_calls += 1
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

memo_calls = 0
memo = {}
def fib_memo(n):
    global memo_calls
    memo_calls += 1
    if n in memo:
        return memo[n]
    result = n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)
    memo[n] = result
    return result

print(fib_naive(25), naive_calls)
print(fib_memo(25), memo_calls)
`,
          question: "Both compute fib(25) = 75025 and count their calls. The naive version makes 242,785 calls. How many does the memoized version make? (Each value from 0 to 25 is computed once; the second call for each value hits the cache.)",
          expectedOutput: "75025 242785\n75025 49",
          hint: "fib_memo(n) for n ≥ 2 calls fib_memo(n − 1), which fills the cache, then fib_memo(n − 2), which is a cache hit. That is 2 calls per level for 24 levels, plus the first call.",
          successMessage: "49 calls against 242,785: a factor of nearly 5,000 at n = 25, and the gap doubles roughly every 1.44 extra levels.",
        },
      },
      {
        id: "a-al-knapsack-01",
        title: "The 0/1 knapsack problem: a solver",
        explain:
          "Items with values vᵢ and weights wᵢ; a capacity W; each item is taken WHOLE or not at all. Maximise total value. STATE: best[i][w] = the best value using only the first i items with capacity w. TRANSITION: either skip item i (best[i − 1][w]) or, if it fits, take it (vᵢ + best[i − 1][w − wᵢ]); keep the larger. BASE: best[0][w] = 0. ANSWER: best[n][W]. The table has (n + 1)(W + 1) cells, each O(1): O(nW) time and space. That is PSEUDO-POLYNOMIAL: polynomial in the numeric value W, but exponential in the number of digits used to write W, which is why the knapsack problem is still NP-hard (Module 16).",
        codeChallenge: {
          task: "Write knapsack(values, weights, capacity) that returns the maximum total value of items (each taken whole or not at all) within the capacity, by filling a table best with len(values) + 1 rows and capacity + 1 columns using the skip-or-take transition.",
          starter: "def knapsack(values, weights, capacity):\n    pass\n",
          sample: "knapsack([60, 100, 120], [10, 20, 30], 50) → 220",
          tests: [
            {
              check: py`assert knapsack([60, 100, 120], [10, 20, 30], 50) == 220, "Take the second and third items: 220 (greedy by ratio gets only 160). Got " + repr(knapsack([60, 100, 120], [10, 20, 30], 50))
assert knapsack([], [], 10) == 0 and knapsack([5], [10], 9) == 0, "No items, or an item that does not fit."
assert knapsack([1, 4, 5, 7], [1, 3, 4, 5], 7) == 9, "Items 2 and 3 (values 4 + 5, weights 3 + 4)."
import random
random.seed(7)
vals = [random.randint(1, 100) for _ in range(40)]
wts = [random.randint(1, 50) for _ in range(40)]
from itertools import combinations
best_small = 0
for r in range(0, 9):
    for combo in combinations(range(12), r):
        w = sum(wts[i] for i in combo)
        if w <= 60:
            best_small = max(best_small, sum(vals[i] for i in combo))
assert knapsack(vals[:12], wts[:12], 60) == best_small, "Must match checking every subset of 12 items."
assert knapsack(vals, wts, 500) > 0, "40 items, capacity 500: the table has about 20,000 cells."`,
            },
          ],
          solution: "def knapsack(values, weights, capacity):\n    n = len(values)\n    best = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        v, wt = values[i - 1], weights[i - 1]\n        for w in range(capacity + 1):\n            best[i][w] = best[i - 1][w]\n            if wt <= w and v + best[i - 1][w - wt] > best[i][w]:\n                best[i][w] = v + best[i - 1][w - wt]\n    return best[n][capacity]\n",
          hint: "best = [[0] * (capacity + 1) for _ in range(n + 1)]. For i from 1 to n and w from 0 to capacity: best[i][w] = best[i - 1][w], then try taking item i - 1 if its weight fits.",
          successMessage: "220, where greedy managed 160. The table compares taking and skipping every item at every capacity, which greedy never does.",
        },
      },
      {
        id: "a-al-knapsack-reconstruct",
        title: "Reconstructing the solution from the table",
        explain:
          "The table holds the best VALUE; to know WHICH items achieve it, walk back from best[n][W]. At row i, if best[i][w] equals best[i − 1][w], item i was skipped; otherwise it was taken, so record it and reduce w by its weight. Continue to row 0. This backtracking costs only O(n) and works for most DP problems: the table's choices are recorded implicitly in which neighbour each value came from.",
        codeChallenge: {
          task: "Write knapsack_items(values, weights, capacity) that fills the same table as knapsack, then walks back from best[n][capacity] to find which items were taken. Return (best_value, chosen) where chosen is the sorted list of the taken items' indexes (0-based).",
          starter: "def knapsack_items(values, weights, capacity):\n    pass\n",
          sample: "knapsack_items([60, 100, 120], [10, 20, 30], 50) → (220, [1, 2])",
          tests: [
            {
              check: py`assert knapsack_items([60, 100, 120], [10, 20, 30], 50) == (220, [1, 2]), "Items 1 and 2. Got " + repr(knapsack_items([60, 100, 120], [10, 20, 30], 50))
assert knapsack_items([1, 4, 5, 7], [1, 3, 4, 5], 7) == (9, [1, 2]), "Items 1 and 2: values 4 + 5."
assert knapsack_items([5], [10], 9) == (0, []), "Nothing fits."
vals, wts = [20, 5, 10, 40, 15, 25], [1, 2, 3, 8, 7, 4]
value, chosen = knapsack_items(vals, wts, 10)
assert sum(wts[i] for i in chosen) <= 10 and sum(vals[i] for i in chosen) == value == 60, "The chosen items must fit and add up to the best value, 60."`,
            },
          ],
          solution: "def knapsack_items(values, weights, capacity):\n    n = len(values)\n    best = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        v, wt = values[i - 1], weights[i - 1]\n        for w in range(capacity + 1):\n            best[i][w] = best[i - 1][w]\n            if wt <= w and v + best[i - 1][w - wt] > best[i][w]:\n                best[i][w] = v + best[i - 1][w - wt]\n    chosen = []\n    w = capacity\n    for i in range(n, 0, -1):\n        if best[i][w] != best[i - 1][w]:\n            chosen.append(i - 1)\n            w -= weights[i - 1]\n    return best[n][capacity], sorted(chosen)\n",
          hint: "After filling the table: w = capacity; for i from n down to 1, if best[i][w] != best[i - 1][w], item i - 1 was taken: record it and subtract its weight from w.",
          successMessage: "The table told you not only the best value but how to reach it, in one backwards pass.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 14.9 – 14.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l59-coins-lcs",
    moduleId: "al-m14-dynamic-programming",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.9", "14.10"],
    title: "Coin Change and the Longest Common Subsequence",
    subtitle: "Exact coin change for any system, and measuring text similarity",
    estimatedMinutes: 38,
    intro:
      "Greedy coin change failed on {1, 3, 4}. Dynamic programming gets it right for every coin system. Then the longest common subsequence: the algorithm behind diff, version control, plagiarism checkers and DNA comparison.",

    atoms: [
      {
        id: "a-al-coin-change-dp",
        title: "The coin change problem: fewest coins",
        explain:
          "STATE: fewest[a] = the fewest coins that make amount a. TRANSITION: the last coin used is some coin c ≤ a, so fewest[a] = 1 + min over coins c of fewest[a − c]. BASE: fewest[0] = 0; an amount that cannot be made is ∞. Fill a from 1 to the target. Time O(amount × number of coins), space O(amount). Unlike greedy, it considers every possible last coin, so it is optimal for EVERY coin system.",
        codeChallenge: {
          task: "Write min_coins(amount, coins) that returns the fewest coins that make exactly amount, or -1 if it cannot be made, by filling a table fewest[0..amount] bottom-up.",
          starter: "def min_coins(amount, coins):\n    pass\n",
          sample: "min_coins(6, [1, 3, 4]) → 2",
          tests: [
            {
              check: py`assert min_coins(6, [1, 3, 4]) == 2, "3 + 3: 2 coins (greedy would use 3). Got " + repr(min_coins(6, [1, 3, 4]))
assert min_coins(0, [1, 2]) == 0, "Amount 0 needs no coins."
assert min_coins(3, [2]) == -1, "3 cannot be made from 2s."
assert min_coins(11, [1, 2, 5]) == 3, "5 + 5 + 1."
assert min_coins(10000, [1, 5, 10, 25]) == 400, "10,000 cents in quarters: 400 coins."
assert min_coins(7, [2, 4]) == -1, "No odd amount can be made from even coins."`,
            },
          ],
          solution: "def min_coins(amount, coins):\n    INF = float(\"inf\")\n    fewest = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and fewest[a - c] + 1 < fewest[a]:\n                fewest[a] = fewest[a - c] + 1\n    return fewest[amount] if fewest[amount] != INF else -1\n",
          hint: "fewest = [0] + [inf] * amount. For a from 1 to amount, for each coin c <= a: fewest[a] = min(fewest[a], fewest[a - c] + 1). Return -1 if it is still inf.",
          successMessage: "Correct for {1, 3, 4}, where greedy fails, and for every other coin system. Trying every last coin is what greedy never does.",
        },
      },
      {
        id: "a-al-coin-ways",
        title: "Counting the ways to make change",
        explain:
          "A different question on the same structure: HOW MANY ways can an amount be made, where the order of coins does not matter? ways[a] counts combinations. Loop over the COINS on the outside and amounts on the inside: ways[a] += ways[a − c]. Putting coins outside means each combination is built in one fixed coin order, so 1 + 2 and 2 + 1 are counted once. (With amounts outside, you count ordered sequences instead.) Same O(amount × coins) table, a different question.",
        codeExercise: {
          language: PY,
          code: py`def ways(amount, coins):
    table = [1] + [0] * amount
    for c in coins:
        for a in range(c, amount + 1):
            table[a] += table[a - c]
    return table[amount]

print(ways(10, [1, 2, 5]), ways(100, [1, 5, 10, 25, 50]))
`,
          question: "How many ways are there to make 10 from coins {1, 2, 5}, and 100 cents from US coins {1, 5, 10, 25, 50}?",
          expectedOutput: "10 292",
          hint: "For 10 with {1, 2, 5}: two 5s; one 5 with 0–2 twos and the rest ones (3 ways); no 5 with 0–5 twos (6 ways).",
          successMessage: "10 and 292. The famous 292 ways to change a dollar, computed in 500 table updates.",
        },
      },
      {
        id: "a-al-lcs",
        title: "Longest common subsequence: text similarity",
        explain:
          "A SUBSEQUENCE keeps characters in order but may skip some (\"ACE\" is a subsequence of \"ABCDE\"). The LONGEST COMMON SUBSEQUENCE of two strings measures how similar they are. STATE: L[i][j] = LCS length of the first i characters of a and the first j of b. TRANSITION: if a[i − 1] == b[j − 1], L[i][j] = L[i − 1][j − 1] + 1; otherwise L[i][j] = max(L[i − 1][j], L[i][j − 1]). BASE: row 0 and column 0 are 0. Time and space O(mn). Walking back from L[m][n] (diagonal on a match, otherwise towards the larger neighbour) recovers the subsequence itself. A similarity score is 2 × LCS / (len(a) + len(b)).",
        codeChallenge: {
          task: "Write lcs(a, b) that returns one longest common subsequence of the strings a and b (any one, if several have the maximum length), by filling the L table and walking back from L[len(a)][len(b)].",
          starter: "def lcs(a, b):\n    pass\n",
          sample: "lcs(\"ABCBDAB\", \"BDCABA\") → a string of length 4, such as \"BCBA\"",
          tests: [
            {
              check: py`def is_subseq(s, t):
    it = iter(t)
    return all(ch in it for ch in s)

for a, b, n in [("ABCBDAB", "BDCABA", 4), ("ALGORITHM", "ALTRUISTIC", 5), ("", "ABC", 0), ("ABC", "ABC", 3), ("AAA", "BBB", 0)]:
    s = lcs(a, b)
    assert isinstance(s, str) and len(s) == n, f"lcs({a!r}, {b!r}) should have length {n}; got {s!r}"
    assert is_subseq(s, a) and is_subseq(s, b), f"{s!r} must be a subsequence of both {a!r} and {b!r}"
x = "the quick brown fox jumps over the lazy dog" * 3
y = "a quick brown dog jumps over the lazy fox" * 3
s = lcs(x, y)
assert is_subseq(s, x) and is_subseq(s, y) and len(s) >= 100, "Two 120-character sentences share a long subsequence."`,
            },
          ],
          solution: "def lcs(a, b):\n    m, n = len(a), len(b)\n    L = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                L[i][j] = L[i - 1][j - 1] + 1\n            else:\n                L[i][j] = max(L[i - 1][j], L[i][j - 1])\n    out = []\n    i, j = m, n\n    while i > 0 and j > 0:\n        if a[i - 1] == b[j - 1]:\n            out.append(a[i - 1])\n            i -= 1\n            j -= 1\n        elif L[i - 1][j] >= L[i][j - 1]:\n            i -= 1\n        else:\n            j -= 1\n    return \"\".join(reversed(out))\n",
          hint: "Fill L with the match / max rule. Then from (m, n): on a match, record the character and move diagonally; otherwise move to whichever of L[i − 1][j], L[i][j − 1] is larger. Reverse what you recorded.",
          successMessage: "This table is the heart of diff and git: the lines two files have in common are their LCS, and everything else is an insertion or a deletion.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 14.11 – 14.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l60-lis-matrix-chain",
    moduleId: "al-m14-dynamic-programming",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.11", "14.12"],
    title: "Longest Increasing Subsequence and Matrix Chain Multiplication",
    subtitle: "A DP that improves to n log n, and a DP over intervals",
    estimatedMinutes: 38,
    intro:
      "Two more classics. The longest increasing subsequence has a quadratic DP and a clever n log n refinement. Matrix chain multiplication is the standard example of DP over intervals, where the state is a range i..j.",

    atoms: [
      {
        id: "a-al-lis",
        title: "Longest increasing subsequence (LIS)",
        explain:
          "Find the length of the longest strictly increasing subsequence of a list (for [10, 9, 2, 5, 3, 7, 101, 18] it is 4: for example 2, 3, 7, 18). The O(n²) DP: L[i] = 1 + max L[j] over j < i with nums[j] < nums[i]. The O(n log n) method keeps a list tails where tails[k] is the SMALLEST possible last value of an increasing subsequence of length k + 1. For each number x, binary search (bisect_left) for the first tail ≥ x and replace it with x, or append x if it is larger than every tail. tails stays sorted, its length is the answer, and each step is O(log n).",
        codeChallenge: {
          task: "Write lis_length(nums) that returns the length of the longest strictly increasing subsequence in O(n log n), using a tails list and bisect.bisect_left. The test has 5,000 numbers, too many for the O(n²) method.",
          starter: "import bisect\n\ndef lis_length(nums):\n    pass\n",
          sample: "lis_length([10, 9, 2, 5, 3, 7, 101, 18]) → 4",
          tests: [
            {
              check: py`assert lis_length([10, 9, 2, 5, 3, 7, 101, 18]) == 4, "2, 3, 7, 18 (or 2, 5, 7, 101). Got " + repr(lis_length([10, 9, 2, 5, 3, 7, 101, 18]))
assert lis_length([]) == 0 and lis_length([5]) == 1, "Empty and one-item lists."
assert lis_length([3, 3, 3]) == 1, "Strictly increasing: equal values do not count."
assert lis_length(list(range(100, 0, -1))) == 1 and lis_length(list(range(100))) == 100, "Decreasing and increasing lists."
import random
random.seed(3)
small = [random.randint(0, 30) for _ in range(40)]
L = [1] * len(small)
for i in range(len(small)):
    for j in range(i):
        if small[j] < small[i]:
            L[i] = max(L[i], L[j] + 1)
assert lis_length(small) == max(L), "Must agree with the O(n²) DP on 40 random numbers."
big = [random.randint(0, 10**6) for _ in range(5000)]
assert 100 <= lis_length(big) <= 200, "5,000 random numbers have an LIS of about 2√n ≈ 141."`,
            },
          ],
          solution: "import bisect\n\ndef lis_length(nums):\n    tails = []\n    for x in nums:\n        k = bisect.bisect_left(tails, x)\n        if k == len(tails):\n            tails.append(x)\n        else:\n            tails[k] = x\n    return len(tails)\n",
          hint: "For each x: k = bisect.bisect_left(tails, x). If k == len(tails), append x; otherwise tails[k] = x. Return len(tails).",
          successMessage: "5,000 numbers in about 60,000 steps instead of 12.5 million. A DP observation (tails stays sorted) unlocked binary search.",
        },
      },
      {
        id: "a-al-matrix-chain",
        title: "Matrix chain multiplication",
        explain:
          "Multiplying a p × q matrix by a q × r matrix costs pqr scalar multiplications, and matrix multiplication is associative, so the ORDER of a chain A₁A₂...Aₙ matters enormously. With dims [10, 100, 5, 50], (A₁A₂)A₃ costs 10·100·5 + 10·5·50 = 7,500, but A₁(A₂A₃) costs 100·5·50 + 10·100·50 = 75,000. STATE: m[i][j] = the cheapest cost of multiplying Aᵢ..Aⱼ. TRANSITION: try every split point k: m[i][j] = min over i ≤ k < j of m[i][k] + m[k + 1][j] + dims[i − 1]·dims[k]·dims[j]. Fill by increasing chain LENGTH, so shorter chains are ready. O(n²) states × O(n) splits = O(n³) time, O(n²) space.",
        codeChallenge: {
          task: "Write matrix_chain(dims) where matrix i has dimensions dims[i] × dims[i + 1] (so there are len(dims) − 1 matrices). Return the minimum number of scalar multiplications to multiply the whole chain, filling a cost table by increasing chain length and trying every split point.",
          starter: "def matrix_chain(dims):\n    pass\n",
          sample: "matrix_chain([10, 100, 5, 50]) → 7500",
          tests: [
            {
              check: py`assert matrix_chain([10, 100, 5, 50]) == 7500, "(A1 A2) A3 costs 7,500. Got " + repr(matrix_chain([10, 100, 5, 50]))
assert matrix_chain([30, 35, 15, 5, 10, 20, 25]) == 15125, "The textbook six-matrix chain costs 15,125."
assert matrix_chain([40, 20, 30, 10, 30]) == 26000, "Four matrices: 26,000."
assert matrix_chain([10, 20]) == 0, "One matrix needs no multiplication."
assert matrix_chain([10, 20, 30]) == 6000, "Two matrices: 10 × 20 × 30."`,
            },
          ],
          solution: "def matrix_chain(dims):\n    n = len(dims) - 1\n    cost = [[0] * n for _ in range(n)]\n    for length in range(2, n + 1):\n        for i in range(n - length + 1):\n            j = i + length - 1\n            cost[i][j] = float(\"inf\")\n            for k in range(i, j):\n                c = cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]\n                if c < cost[i][j]:\n                    cost[i][j] = c\n    return cost[0][n - 1]\n",
          hint: "With 0-based matrices, A_i is dims[i] × dims[i + 1]. For length from 2 to n, for each i with j = i + length - 1, try k from i to j - 1: cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1].",
          successMessage: "15,125 for the textbook chain, where a bad order costs over 40,000. Interval DP: the answer for a range comes from its sub-ranges.",
        },
      },
      {
        id: "a-al-matrix-chain-order",
        title: "Reconstructing the optimal parenthesisation",
        explain:
          "As with the knapsack, the cost table gives the best value; to recover HOW, store the best split point split[i][j] alongside each cost. The optimal parenthesisation of Aᵢ..Aⱼ is then (optimal of Aᵢ..A_k)(optimal of A_{k+1}..Aⱼ) with k = split[i][j], built recursively down to single matrices.",
        codeExercise: {
          language: PY,
          code: py`def matrix_chain_order(dims):
    n = len(dims) - 1
    cost = [[0] * n for _ in range(n)]
    split = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            cost[i][j] = float("inf")
            for k in range(i, j):
                c = cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                if c < cost[i][j]:
                    cost[i][j], split[i][j] = c, k

    def paren(i, j):
        if i == j:
            return "A" + str(i + 1)
        k = split[i][j]
        return "(" + paren(i, k) + paren(k + 1, j) + ")"

    return cost[0][n - 1], paren(0, n - 1)

print(*matrix_chain_order([30, 35, 15, 5, 10, 20, 25]))
print(*matrix_chain_order([10, 100, 5, 50]))
`,
          question: "For the textbook chain the optimal order is ((A1(A2A3))((A4A5)A6)) at cost 15125. What is printed for the second chain, dims [10, 100, 5, 50]?",
          expectedOutput: "15125 ((A1(A2A3))((A4A5)A6))\n7500 ((A1A2)A3)",
          hint: "From the explanation: multiplying A1 and A2 first costs 7,500 in total.",
          successMessage: "The split table turns a number into a plan. Compilers and database query optimisers use this same interval DP to order joins.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 14.13 – 14.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l61-dp-design",
    moduleId: "al-m14-dynamic-programming",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["14.13", "14.14", "14.15"],
    title: "Designing, Optimising and Analysing DP Solutions",
    subtitle: "State transitions, rolling arrays and complexity",
    estimatedMinutes: 36,
    intro:
      "Every DP solution in this module had the same skeleton: a state, a transition, base cases, an order and an answer. This lesson makes that skeleton a design method, applies it to a travel-cost problem, shrinks the memory, and analyses the cost.",

    atoms: [
      {
        id: "a-al-state-transitions",
        title: "State transitions: a minimum-cost travel calculator",
        explain:
          "Designing a DP: 1. STATE: what does one subproblem's answer mean? (\"cost[d] = cheapest way to cover all travel up to day d\"). 2. TRANSITION: how is a state computed from smaller ones? Consider the LAST decision. 3. BASE CASES. 4. ORDER: an evaluation order where dependencies come first. 5. ANSWER: which state is the final result. For travel passes (1-day, 7-day and 30-day tickets), the last decision on a travel day d is which pass covers it: cost[d] = min(cost[d − 1] + day, cost[d − 7] + week, cost[d − 30] + month), treating negative days as 0; on a non-travel day, cost[d] = cost[d − 1].",
        codeChallenge: {
          task: "Build a minimum-cost travel calculator. min_travel_cost(days, prices) receives a sorted list of travel days (1 to 365) and prices = [one_day, seven_day, thirty_day]. A pass bought on day d covers d to d + 6 (7-day) or d + 29 (30-day). Return the minimum total cost using the cost[d] transition above.",
          starter: "def min_travel_cost(days, prices):\n    pass\n",
          sample: "min_travel_cost([1, 4, 6, 7, 8, 20], [2, 7, 15]) → 11",
          tests: [
            {
              check: py`assert min_travel_cost([1, 4, 6, 7, 8, 20], [2, 7, 15]) == 11, "A 1-day pass on day 1, a 7-day pass for days 4–10, a 1-day pass on day 20: 2 + 7 + 2 = 11. Got " + repr(min_travel_cost([1, 4, 6, 7, 8, 20], [2, 7, 15]))
assert min_travel_cost([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 30, 31], [2, 7, 15]) == 17, "A 30-day pass plus a 1-day pass on day 31: 17."
assert min_travel_cost([], [2, 7, 15]) == 0, "No travel, no cost."
assert min_travel_cost([5], [3, 7, 15]) == 3, "One day: a 1-day pass."
assert min_travel_cost(list(range(1, 366)), [2, 7, 15]) == 15 * 12 + 7, "Travelling every day: twelve 30-day passes and one 7-day pass cover 365 days for 187."`,
            },
          ],
          solution: "def min_travel_cost(days, prices):\n    if not days:\n        return 0\n    travel = set(days)\n    last = days[-1]\n    cost = [0] * (last + 1)\n    for d in range(1, last + 1):\n        if d not in travel:\n            cost[d] = cost[d - 1]\n            continue\n        cost[d] = min(\n            cost[d - 1] + prices[0],\n            cost[max(0, d - 7)] + prices[1],\n            cost[max(0, d - 30)] + prices[2],\n        )\n    return cost[last]\n",
          hint: "cost = [0] * (last_day + 1). For d from 1 to the last day: if not a travel day, cost[d] = cost[d − 1]; otherwise the min of the three options, using max(0, d − 7) and max(0, d − 30).",
          successMessage: "State, transition, base, order, answer: the same five steps design every DP algorithm.",
        },
      },
      {
        id: "a-al-dp-optimisation",
        title: "Optimising dynamic programming solutions",
        explain:
          "Three standard optimisations. ROLLING ARRAYS: if row i depends only on row i − 1, keep two rows (or one) instead of the whole table: LCS length in O(min(m, n)) space, knapsack in O(W). For the 0/1 knapsack in ONE row, iterate capacity DOWNWARDS, so that best[w − wt] still holds the previous row's value when it is read (going upwards would let an item be taken twice, which is the unbounded knapsack). FASTER TRANSITIONS: replace an O(n) inner minimum with a data structure, as the LIS tails list did with binary search. PRUNING STATES: only store the states that can actually occur (top-down memoization does this automatically).",
        codeChallenge: {
          task: "Write knapsack_1d(values, weights, capacity) for the 0/1 knapsack using a SINGLE list best of length capacity + 1. For each item, update best[w] = max(best[w], value + best[w − weight]) for w from capacity DOWN to weight. Do not build a 2-D table.",
          starter: "def knapsack_1d(values, weights, capacity):\n    pass\n",
          sample: "knapsack_1d([60, 100, 120], [10, 20, 30], 50) → 220",
          tests: [
            {
              check: py`assert knapsack_1d([60, 100, 120], [10, 20, 30], 50) == 220, "Got " + repr(knapsack_1d([60, 100, 120], [10, 20, 30], 50))
assert knapsack_1d([1, 4, 5, 7], [1, 3, 4, 5], 7) == 9, "Items worth 4 and 5."
assert knapsack_1d([10], [3], 9) == 10, "Each item can be taken at most ONCE: iterating capacity upwards would take it three times (30)."
assert knapsack_1d([], [], 5) == 0, "No items."
assert "[[" not in source.replace(" ", "") and "for _ in range" not in source, "Use one list, not a 2-D table."`,
            },
          ],
          solution: "def knapsack_1d(values, weights, capacity):\n    best = [0] * (capacity + 1)\n    for v, wt in zip(values, weights):\n        for w in range(capacity, wt - 1, -1):\n            if v + best[w - wt] > best[w]:\n                best[w] = v + best[w - wt]\n    return best[capacity]\n",
          hint: "best = [0] * (capacity + 1). For each (v, wt): for w in range(capacity, wt - 1, -1): best[w] = max(best[w], v + best[w - wt]).",
          successMessage: "Same O(nW) time, O(W) space instead of O(nW). The downward loop is what keeps each item to a single use.",
        },
      },
      {
        id: "a-al-dp-analysis",
        title: "Time and space complexity of DP solutions",
        explain:
          "DP TIME = (number of distinct states) × (work per transition). DP SPACE = number of states stored (often reducible). Count the dimensions of the state and the size of each, then the choices tried per state. Remember that complexities in terms of a numeric VALUE (the knapsack's W, the coin amount) are pseudo-polynomial.",
        table: {
          caption: "The module's DP algorithms analysed.",
          headers: ["Problem", "States", "Transition", "Time", "Space (optimised)"],
          rows: [
            ["Fibonacci", "n", "O(1)", "O(n)", "O(1)"],
            ["Grid paths r × c", "rc", "O(1)", "O(rc)", "O(c)"],
            ["0/1 knapsack", "nW", "O(1)", "O(nW)", "O(W)"],
            ["Coin change (amount A, k coins)", "A", "O(k)", "O(Ak)", "O(A)"],
            ["LCS (lengths m, n)", "mn", "O(1)", "O(mn)", "O(min(m, n)) for the length"],
            ["LIS", "n", "O(n), or O(log n) with tails", "O(n²) or O(n log n)", "O(n)"],
            ["Matrix chain (n matrices)", "n²", "O(n)", "O(n³)", "O(n²)"],
            ["Travel passes (D days)", "D", "O(1)", "O(D)", "O(D)"],
          ],
        },
        decision: {
          scenario: "A DP for \"edit distance\" between two strings of lengths m and n has a state for every pair (i, j), and each state takes the minimum of three neighbours.",
          question: "What are its time and space complexity?",
          options: [
            { id: "a", text: "O(mn) time and O(mn) space, reducible to O(min(m, n)) space for the distance alone", why: "mn states × O(1) transition; each row depends only on the previous one." },
            { id: "b", text: "O(m + n) time", whyWrong: "There are m × n states, each computed once." },
            { id: "c", text: "O(3^(m+n)) time", whyWrong: "That is the naive recursion; DP computes each state once." },
            { id: "d", text: "O(mn log mn) time", whyWrong: "No sorting or searching is involved." },
          ],
          correct: "a",
          aftermath: "States × transition cost: every DP's analysis follows from its state definition.",
        },
      },
    ],

    task: {
      title: "Module 14 practice: dynamic programming projects",
      intro: "For each, write the state, transition, base cases, order and answer before writing code.",
      prompts: [
        "Build a minimum-cost travel calculator: cheapest route through a grid of toll costs moving right or down, returning both the cost and the path.",
        "Implement a knapsack problem solver that reports the best value and the chosen items, and compare it with the greedy ratio rule on 20 random instances.",
        "Develop a text similarity demonstration using LCS: show the common subsequence of two sentences, the similarity score 2 × LCS / (len a + len b), and a line-by-line diff of two short files.",
        "Compare recursive, memoized and tabulated Fibonacci algorithms: count calls and time them for n = 10, 20, 30 and 35.",
        "Write the edit distance (Levenshtein) DP and use it to suggest the closest correctly spelt word from a word list.",
      ],
      closing: "Many of the most important DP and greedy algorithms run on graphs. Module 15 is graph algorithms.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
