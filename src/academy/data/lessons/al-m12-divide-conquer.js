/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 12 · DIVIDE AND CONQUER
 *
 * Curriculum 12.1 – 12.10. Divide, conquer and combine; recurrences and
 * recursion trees; the Master Theorem with worked cases; merge sort, quick
 * sort and binary search analysed; Karatsuba multiplication; advantages and
 * limitations. The learner implements an O(n log n) inversion counter,
 * a Master Theorem solver, a binary-search square root and Karatsuba.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s12-divide-conquer";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 12.1 – 12.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l49-divide-conquer",
    moduleId: "al-m12-divide-conquer",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3", "12.4"],
    title: "Divide and Conquer",
    subtitle: "Divide, conquer, combine, and the recurrences it produces",
    estimatedMinutes: 32,
    intro:
      "Divide and conquer solves a problem by splitting it into smaller copies of itself, solving those recursively, and combining their answers. It produced merge sort, quick sort, binary search, fast multiplication and the Fast Fourier Transform.",

    atoms: [
      {
        id: "a-al-dc-intro",
        title: "Introduction to divide and conquer",
        explain:
          "DIVIDE AND CONQUER is an algorithm design technique with three steps. DIVIDE the problem into a subproblems, each a fraction 1/b of the size. CONQUER each subproblem by solving it recursively (or directly, if it is small enough: the base case). COMBINE the sub-solutions into a solution for the whole. It pays off when the combine step is cheap compared with solving the whole problem directly: merge sort's linear merge replaces an n² sort with n log n.",
        table: {
          caption: "Classic divide-and-conquer algorithms, step by step.",
          headers: ["Algorithm", "Divide", "Conquer", "Combine", "Recurrence"],
          rows: [
            ["Binary search", "Compare with the middle", "Search one half", "Nothing", "T(n) = T(n/2) + O(1)"],
            ["Merge sort", "Split in half: O(1)", "Sort both halves", "Merge: O(n)", "T(n) = 2T(n/2) + O(n)"],
            ["Quick sort", "Partition: O(n)", "Sort both sides", "Nothing", "T(n) = 2T(n/2) + O(n) (balanced)"],
            ["Karatsuba multiplication", "Split the digits", "3 half-size products", "Add and shift: O(n)", "T(n) = 3T(n/2) + O(n)"],
            ["Maximum by halves", "Split in half", "Max of each half", "One comparison", "T(n) = 2T(n/2) + O(1)"],
          ],
        },
      },
      {
        id: "a-al-divide-conquer-combine",
        title: "Divide, conquer and combine: counting inversions",
        explain:
          "An INVERSION is a pair i < j with items[i] > items[j]; the count measures how unsorted a list is (it is used to compare rankings, as in \"how similar are two people's film preferences?\"). Checking every pair is O(n²). Divide and conquer does better: the inversions of a list are the inversions inside the left half, plus those inside the right half, plus the SPLIT inversions with one item in each half. If both halves are sorted, split inversions are counted during the merge: whenever an item is taken from the right half, it is smaller than every item still waiting in the left half, so add the number of items left there. Merge sort plus one counter: O(n log n).",
        codeChallenge: {
          task: "Write count_inversions(items) that returns the number of pairs i < j with items[i] > items[j] in O(n log n), by divide and conquer: a helper sort_count(a) returns (sorted list, inversions), splitting a in half, recursing, and merging; when the merge takes an item from the right half, add the number of items remaining in the left half. The test uses 2,000 items, too many for checking every pair.",
          starter: "def count_inversions(items):\n    pass\n",
          sample: "count_inversions([2, 4, 1, 3, 5]) → 3   ((2,1), (4,1), (4,3))",
          tests: [
            {
              check: py`assert count_inversions([2, 4, 1, 3, 5]) == 3, "(2,1), (4,1) and (4,3). Got " + repr(count_inversions([2, 4, 1, 3, 5]))
assert count_inversions([]) == 0 and count_inversions([1, 2, 3]) == 0, "Sorted lists have no inversions."
assert count_inversions([5, 4, 3, 2, 1]) == 10, "A reversed list of 5 has 5 × 4 / 2 = 10."
assert count_inversions([1, 1, 1]) == 0, "Equal items are not inversions."
import random
random.seed(81)
small = [random.randint(0, 50) for _ in range(60)]
brute = sum(1 for i in range(60) for j in range(i + 1, 60) if small[i] > small[j])
assert count_inversions(small) == brute, "60 random items: must match checking every pair."
big = list(range(2000, 0, -1))
assert count_inversions(big) == 1999000, "A reversed list of 2,000: 2000 × 1999 / 2 = 1,999,000."`,
            },
          ],
          solution: "def count_inversions(items):\n    def sort_count(a):\n        if len(a) <= 1:\n            return list(a), 0\n        mid = len(a) // 2\n        left, x = sort_count(a[:mid])\n        right, y = sort_count(a[mid:])\n        merged, i, j, split = [], 0, 0, 0\n        while i < len(left) and j < len(right):\n            if right[j] < left[i]:\n                merged.append(right[j])\n                j += 1\n                split += len(left) - i\n            else:\n                merged.append(left[i])\n                i += 1\n        merged.extend(left[i:])\n        merged.extend(right[j:])\n        return merged, x + y + split\n    return sort_count(items)[1]\n",
          hint: "sort_count(a): base case len <= 1 returns (a, 0). Recurse on both halves, then merge; when right[j] < left[i], take right[j] and add len(left) - i. Return (merged, left_count + right_count + split).",
          successMessage: "1,999,000 inversions counted in about 22,000 steps. The combine step does all the clever work: that is divide and conquer.",
        },
      },
      {
        id: "a-al-dc-recursion-trees",
        title: "Recurrences and recursion trees for divide and conquer",
        explain:
          "Every divide-and-conquer algorithm gives a recurrence T(n) = aT(n/b) + f(n): a subproblems of size n/b, plus f(n) to divide and combine. Its recursion tree has log_b n levels; level k has aᵏ nodes; the bottom level has a^(log_b n) = n^(log_b a) leaves. Three shapes emerge. ROOT-HEAVY: the work shrinks down the tree, so the top level dominates and T(n) = Θ(f(n)). BALANCED: every level does the same work, so T(n) = Θ(f(n) log n). LEAF-HEAVY: the work grows down the tree, so the leaves dominate and T(n) = Θ(n^(log_b a)). The Master Theorem (next lesson) decides which shape you have.",
        codeExercise: {
          language: PY,
          code: py`import math

def leaves(n, a=3, b=2):
    if n <= 1:
        return 1
    return a * leaves(n // b, a, b)

print(leaves(64), round(64 ** math.log2(3)))
`,
          question: "For T(n) = 3T(n/2) + f(n), this counts the leaves of the recursion tree for n = 64 and compares them with n^(log₂ 3). What does it print?",
          expectedOutput: "729 729",
          hint: "64 halves 6 times to reach 1, and each level triples the number of calls: 3⁶.",
          successMessage: "729 = 3⁶ = 64^(log₂ 3). The number of leaves is always n^(log_b a), the quantity the Master Theorem compares f(n) with.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 12.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l50-master-theorem",
    moduleId: "al-m12-divide-conquer",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.5"],
    title: "The Master Theorem",
    subtitle: "One theorem for T(n) = aT(n/b) + f(n)",
    estimatedMinutes: 32,
    intro:
      "The Master Theorem solves most divide-and-conquer recurrences in one line. It is one of the most examined results in an algorithms course, so this lesson states it precisely, works through every standard case, and has you implement it.",

    atoms: [
      {
        id: "a-al-master-theorem-statement",
        title: "The Master Theorem",
        explain:
          "For T(n) = aT(n/b) + f(n) with a ≥ 1 and b > 1, compare f(n) with n^(log_b a), the number of leaves. CASE 1: if f(n) = O(n^(log_b a − ε)) for some ε > 0 (f grows polynomially slower), the leaves dominate: T(n) = Θ(n^(log_b a)). CASE 2: if f(n) = Θ(n^(log_b a)), every level contributes equally: T(n) = Θ(n^(log_b a) log n). CASE 3: if f(n) = Ω(n^(log_b a + ε)) for some ε > 0 (f grows polynomially faster) AND af(n/b) ≤ cf(n) for some c < 1 (the regularity condition), the root dominates: T(n) = Θ(f(n)). For the common form f(n) = Θ(n^d) this simplifies to comparing d with log_b a: d < log_b a gives Θ(n^(log_b a)); d = log_b a gives Θ(n^d log n); d > log_b a gives Θ(n^d).",
        table: {
          caption: "The simplified Master Theorem for T(n) = aT(n/b) + Θ(nᵈ).",
          headers: ["Condition", "Which part dominates", "Solution"],
          rows: [
            ["d < log_b a", "The leaves", "Θ(n^(log_b a))"],
            ["d = log_b a", "Every level equally", "Θ(nᵈ log n)"],
            ["d > log_b a", "The root", "Θ(nᵈ)"],
          ],
        },
      },
      {
        id: "a-al-master-examples",
        title: "Applying the Master Theorem",
        explain:
          "Method: read off a, b and d; compute log_b a; compare. Merge sort: a = 2, b = 2, d = 1; log₂ 2 = 1 = d, case 2: Θ(n log n). Binary search: a = 1, b = 2, d = 0; log₂ 1 = 0 = d, case 2: Θ(log n). Karatsuba: a = 3, b = 2, d = 1; log₂ 3 ≈ 1.585 > 1, case 1: Θ(n^1.585). The theorem does NOT apply to recurrences that are not of this form, such as T(n) = T(n − 1) + n (subtracting, not dividing) or T(n) = 2T(n/2) + n/log n (f falls in the gap between cases); use a recursion tree or substitution for those.",
        table: {
          caption: "Worked examples.",
          headers: ["Recurrence", "a, b, d", "log_b a", "Case", "Solution"],
          rows: [
            ["T(n) = 2T(n/2) + n (merge sort)", "2, 2, 1", "1", "2", "Θ(n log n)"],
            ["T(n) = T(n/2) + 1 (binary search)", "1, 2, 0", "0", "2", "Θ(log n)"],
            ["T(n) = 3T(n/2) + n (Karatsuba)", "3, 2, 1", "≈ 1.585", "1", "Θ(n^1.585)"],
            ["T(n) = 8T(n/2) + n² (naive matrix D&C)", "8, 2, 2", "3", "1", "Θ(n³)"],
            ["T(n) = 7T(n/2) + n² (Strassen)", "7, 2, 2", "≈ 2.807", "1", "Θ(n^2.807)"],
            ["T(n) = 4T(n/2) + n²", "4, 2, 2", "2", "2", "Θ(n² log n)"],
            ["T(n) = 2T(n/2) + n²", "2, 2, 2", "1", "3", "Θ(n²)"],
            ["T(n) = 9T(n/3) + n", "9, 3, 1", "2", "1", "Θ(n²)"],
          ],
        },
        decision: {
          scenario: "An algorithm splits its input into 4 quarter-size pieces, solves each recursively, and combines them in linear time: T(n) = 4T(n/4) + n.",
          question: "What does the Master Theorem give?",
          options: [
            { id: "a", text: "Θ(n)", whyWrong: "log₄ 4 = 1 = d is case 2, which adds a log factor." },
            { id: "b", text: "Θ(n log n)", why: "a = 4, b = 4, d = 1; log₄ 4 = 1 = d, so case 2: Θ(n¹ log n)." },
            { id: "c", text: "Θ(n²)", whyWrong: "That would need log_b a = 2, as in 4T(n/2)." },
            { id: "d", text: "The theorem does not apply", whyWrong: "It has exactly the form aT(n/b) + Θ(nᵈ)." },
          ],
          correct: "b",
          aftermath: "Splitting into more pieces of proportionally smaller size does not change the n log n of merge sort.",
        },
      },
      {
        id: "a-al-master-practice",
        title: "Implementing the Master Theorem",
        explain:
          "The simplified theorem is itself an algorithm: compute c = log_b a, compare it with d, and report the case. One implementation detail matters: floating-point logarithms are not exact (math.log(9, 3) may come out as 2.0000000000000004), so compare with a small tolerance rather than ==.",
        codeChallenge: {
          task: "Write master(a, b, d) for T(n) = aT(n/b) + Θ(n^d). Compute c = math.log(a, b). If d is within 1e-9 of c return (2, \"n^d log n\"); if d < c return (1, \"n^c\"); otherwise return (3, \"n^d\"). Then write exponent(a, b) that returns round(math.log(a, b), 3).",
          starter: "import math\n\ndef master(a, b, d):\n    pass\n\ndef exponent(a, b):\n    pass\n",
          sample: "master(2, 2, 1) → (2, \"n^d log n\")   (merge sort)\nmaster(3, 2, 1) → (1, \"n^c\") and exponent(3, 2) → 1.585",
          tests: [
            {
              check: py`assert master(2, 2, 1) == (2, "n^d log n"), "Merge sort is case 2. Got " + repr(master(2, 2, 1))
assert master(1, 2, 0) == (2, "n^d log n"), "Binary search: log_2 1 = 0 = d, case 2."
assert master(3, 2, 1) == (1, "n^c") and exponent(3, 2) == 1.585, "Karatsuba: case 1 with c ≈ 1.585."
assert master(8, 2, 2) == (1, "n^c") and exponent(8, 2) == 3.0, "8T(n/2) + n²: case 1, Θ(n³)."
assert master(2, 2, 2) == (3, "n^d"), "2T(n/2) + n²: case 3, Θ(n²)."
assert master(9, 3, 2) == (2, "n^d log n"), "9T(n/3) + n²: log_3 9 = 2 = d. Floating point may give 2.0000000000000004: use a tolerance."
assert master(4, 2, 2) == (2, "n^d log n") and master(7, 2, 2) == (1, "n^c"), "4T(n/2) + n² is case 2; Strassen's 7T(n/2) + n² is case 1."
assert exponent(7, 2) == 2.807, "Strassen's exponent, log_2 7 ≈ 2.807."`,
            },
          ],
          solution: "import math\n\ndef master(a, b, d):\n    c = math.log(a, b)\n    if abs(d - c) < 1e-9:\n        return (2, \"n^d log n\")\n    if d < c:\n        return (1, \"n^c\")\n    return (3, \"n^d\")\n\ndef exponent(a, b):\n    return round(math.log(a, b), 3)\n",
          hint: "c = math.log(a, b). Test abs(d - c) < 1e-9 first, then d < c, else case 3.",
          successMessage: "A whole examination topic in seven lines, including the floating-point trap that catches real implementations.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 12.6 – 12.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l51-dc-analysis",
    moduleId: "al-m12-divide-conquer",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.6", "12.7", "12.8"],
    title: "Analysing Merge Sort, Quick Sort and Binary Search",
    subtitle: "Three recurrences solved, and binary search as a problem-solving tool",
    estimatedMinutes: 32,
    intro:
      "Module 10 stated the complexities of merge sort, quick sort and binary search. Now you derive them, from their recurrences, and use binary search to solve a problem that does not look like searching at all.",

    atoms: [
      {
        id: "a-al-merge-sort-analysis",
        title: "Merge sort analysis",
        explain:
          "Merge sort: dividing is O(1), conquering is 2T(n/2), merging is Θ(n). So T(n) = 2T(n/2) + Θ(n), and the Master Theorem (a = 2, b = 2, d = 1, case 2) gives Θ(n log n). The recursion tree shows why exactly: log₂ n levels of halving, and at each level every item is copied into a merged list once, so for n a power of 2 the total number of items written is exactly n log₂ n. Because the split is always even, the best, average and worst cases are all Θ(n log n). Space: the merge buffers hold O(n) at a time, plus O(log n) stack.",
        codeExercise: {
          language: PY,
          code: py`import random

writes = 0

def merge_sort(a):
    global writes
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if right[j] < left[i]:
            out.append(right[j]); j += 1
        else:
            out.append(left[i]); i += 1
    out += left[i:] + right[j:]
    writes += len(out)
    return out

random.seed(2)
data = [random.random() for _ in range(1024)]
merge_sort(data)
print(writes)
`,
          question: "This counts every item written into a merged list while merge sorting 1,024 = 2¹⁰ items. What does it print?",
          expectedOutput: "10240",
          hint: "Each of the log₂ 1024 = 10 levels writes all 1,024 items once.",
          successMessage: "Exactly n log₂ n = 10,240, whatever the order of the data: the recursion tree, counted.",
        },
      },
      {
        id: "a-al-quick-sort-analysis",
        title: "Quick sort analysis",
        explain:
          "Quick sort's partition costs Θ(n) and the recursion depends on where the pivot lands. BEST case, pivot always the median: T(n) = 2T(n/2) + n = Θ(n log n). WORST case, pivot always the minimum or maximum: T(n) = T(n − 1) + n = Θ(n²). Even a consistently lopsided 9-to-1 split gives T(n) = T(9n/10) + T(n/10) + n, whose recursion tree has depth log₁₀/₉ n = O(log n) with at most n work per level: still Θ(n log n). With a random pivot the EXPECTED number of comparisons is about 2n ln n ≈ 1.39 n log₂ n, so quick sort is O(n log n) on average for every input.",
        table: {
          caption: "Quick sort's cases.",
          headers: ["Pivot behaviour", "Recurrence", "Solution"],
          rows: [
            ["Always the median (best)", "T(n) = 2T(n/2) + n", "Θ(n log n)"],
            ["Always a 9:1 split", "T(n) = T(9n/10) + T(n/10) + n", "Θ(n log n)"],
            ["Random pivot (expected)", "≈ 1.39 n log₂ n comparisons", "Θ(n log n)"],
            ["Always the min or max (worst)", "T(n) = T(n − 1) + n", "Θ(n²)"],
          ],
        },
        decision: {
          scenario: "A colleague says: \"Quick sort is only fast when the pivot splits the list exactly in half, which almost never happens.\"",
          question: "What is the correct response?",
          options: [
            {
              id: "a",
              text: "Any split by a constant fraction, even 99 to 1, keeps the depth O(log n) and the total O(n log n); only splits that peel off a constant number of items cause n²",
              why: "The recursion tree depth is log_{1/(1−ε)} n for any constant fraction ε, and each level costs at most n.",
            },
            { id: "b", text: "Correct: quick sort is usually O(n²)", whyWrong: "With random pivots, O(n²) is vanishingly unlikely." },
            { id: "c", text: "Quick sort is always O(n log n) whatever the pivot", whyWrong: "Always choosing the minimum gives Θ(n²)." },
            { id: "d", text: "Quick sort's speed does not depend on the pivot", whyWrong: "The pivot decides the shape of the recursion tree." },
          ],
          correct: "a",
          aftermath: "Balance only needs to be proportional, not perfect. That is why quick sort is so robust in practice.",
        },
      },
      {
        id: "a-al-binary-search-analysis",
        title: "Binary search analysis, and solving problems with it",
        explain:
          "Binary search: T(n) = T(n/2) + Θ(1), the Master Theorem with a = 1, b = 2, d = 0 gives Θ(log n). The same divide-and-conquer argument works on any MONOTONE yes/no question over a range of numbers, not only on arrays. The integer square root of N is the largest r with r × r ≤ N; the condition r × r ≤ N is true for small r and false for large r, so binary search over r from 0 to N finds the boundary in about log₂ N steps: 60 steps for N = 10¹⁸.",
        codeChallenge: {
          task: "Write isqrt(n) that returns the largest whole r with r * r <= n, for n ≥ 0, by binary search on r between 0 and n. Do not use math.isqrt, math.sqrt, ** 0.5 or pow(). It must be exact for n up to 10**18 (floating-point square roots are not).",
          starter: "def isqrt(n):\n    pass\n",
          sample: "isqrt(26) → 5",
          tests: [
            {
              check: py`for n, r in [(0, 0), (1, 1), (3, 1), (4, 2), (26, 5), (99, 9), (100, 10)]:
    assert isqrt(n) == r, f"isqrt({n}) should be {r}, got {isqrt(n)!r}"
big = 10**18 - 1
r = isqrt(big)
assert r * r <= big < (r + 1) * (r + 1), "isqrt(10**18 - 1) must be exact: 999999999."
n = 12345678987654321 ** 2
assert isqrt(n) == 12345678987654321 and isqrt(n - 1) == 12345678987654320, "Exact on a huge perfect square and just below it."
assert not calls("sqrt") and "math." not in source and "**" not in source and not calls("pow"), "Use binary search, not a square-root function or a power."`,
            },
          ],
          solution: "def isqrt(n):\n    lo, hi = 0, n\n    while lo < hi:\n        mid = (lo + hi + 1) // 2\n        if mid * mid <= n:\n            lo = mid\n        else:\n            hi = mid - 1\n    return lo\n",
          hint: "Keep lo as a value known to satisfy r * r <= n and hi as an upper bound. Use mid = (lo + hi + 1) // 2 so the range always shrinks; move lo = mid if mid * mid <= n, else hi = mid - 1.",
          successMessage: "About 107 halvings for a 33-digit number, exact where floating point fails. Binary search works on answers, not just on arrays.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 12.9 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l52-karatsuba",
    moduleId: "al-m12-divide-conquer",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.9", "12.10"],
    title: "Karatsuba Multiplication, Advantages and Limitations",
    subtitle: "Beating the schoolbook method, and when divide and conquer does not help",
    estimatedMinutes: 32,
    intro:
      "For centuries everyone assumed multiplying two n-digit numbers needs about n² digit operations. In 1960 Anatoly Karatsuba, a 23-year-old student, found a divide-and-conquer method that is faster. It is the perfect example of the technique, and of its limits.",

    atoms: [
      {
        id: "a-al-karatsuba",
        title: "Karatsuba multiplication",
        explain:
          "Split each n-digit number in half: x = a·10ᵐ + b and y = c·10ᵐ + d, with m = n/2. Then xy = ac·10²ᵐ + (ad + bc)·10ᵐ + bd, which looks like it needs FOUR half-size products: T(n) = 4T(n/2) + n = Θ(n²), no better. Karatsuba's insight: (a + b)(c + d) = ac + ad + bc + bd, so ad + bc = (a + b)(c + d) − ac − bd. Only THREE products are needed: ac, bd and (a + b)(c + d). T(n) = 3T(n/2) + Θ(n), Master case 1: Θ(n^(log₂ 3)) = Θ(n^1.585). For a million digits that is about 3 × 10⁹ operations instead of 10¹². Python's own big-integer multiplication uses Karatsuba for large numbers.",
        codeChallenge: {
          task: "Write karatsuba(x, y) for non-negative whole numbers: if x < 10 or y < 10 return x * y; otherwise let m = half the number of digits of the larger number (len(str(max(x, y))) // 2), split with a, b = divmod(x, 10**m) and c, d = divmod(y, 10**m), compute ac, bd and (a + b)(c + d) with THREE recursive calls, and combine them.",
          starter: "def karatsuba(x, y):\n    pass\n",
          sample: "karatsuba(1234, 5678) → 7006652",
          tests: [
            {
              check: py`assert karatsuba(1234, 5678) == 7006652, "1234 × 5678 = 7006652. Got " + repr(karatsuba(1234, 5678))
assert karatsuba(0, 98765) == 0 and karatsuba(7, 8) == 56 and karatsuba(12, 3) == 36, "Small and zero cases."
import random
random.seed(91)
for _ in range(20):
    x, y = random.randint(0, 10**40), random.randint(0, 10**40)
    assert karatsuba(x, y) == x * y, "Random 40-digit products must be exact."
import ast
fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "karatsuba"][0]
rec = [c for c in ast.walk(fn) if isinstance(c, ast.Call) and getattr(c.func, "id", "") == "karatsuba"]
assert len(rec) == 3, "Karatsuba makes exactly THREE recursive calls (ac, bd and (a + b)(c + d)); you have " + str(len(rec))`,
            },
          ],
          solution: "def karatsuba(x, y):\n    if x < 10 or y < 10:\n        return x * y\n    m = len(str(max(x, y))) // 2\n    a, b = divmod(x, 10 ** m)\n    c, d = divmod(y, 10 ** m)\n    ac = karatsuba(a, c)\n    bd = karatsuba(b, d)\n    middle = karatsuba(a + b, c + d) - ac - bd\n    return ac * 10 ** (2 * m) + middle * 10 ** m + bd\n",
          hint: "ac = karatsuba(a, c); bd = karatsuba(b, d); middle = karatsuba(a + b, c + d) - ac - bd; return ac * 10**(2*m) + middle * 10**m + bd.",
          successMessage: "Three recursive products instead of four: the exponent drops from 2 to 1.585. Saving one multiplication per level compounds over log n levels.",
        },
      },
      {
        id: "a-al-dc-advantages",
        title: "Advantages of divide and conquer",
        explain:
          "Divide and conquer often turns a polynomial-time algorithm into a faster one (n² sorting to n log n; n² multiplication to n^1.585). Its subproblems are INDEPENDENT, so they can be solved in PARALLEL on several cores or machines (this is the idea behind MapReduce). Small subproblems fit in the processor's CACHE, so the algorithms use memory efficiently. And the recursive structure makes correctness proofs by induction natural: if the combine step is correct for correct sub-solutions, the whole algorithm is correct.",
        table: {
          caption: "Advantages and limitations at a glance.",
          headers: ["Advantages", "Limitations"],
          rows: [
            ["Often asymptotically faster (n² → n log n)", "Recursion overhead makes it slower on small inputs"],
            ["Independent subproblems run in parallel", "Recursion depth uses stack memory"],
            ["Cache-friendly small subproblems", "Combining may need extra memory (merge sort's buffer)"],
            ["Correctness by induction", "Overlapping subproblems repeat work (naive Fibonacci)"],
            ["Analysed directly with the Master Theorem", "Unbalanced splits destroy the speed-up (quick sort's worst case)"],
          ],
        },
      },
      {
        id: "a-al-dc-limitations",
        title: "Limitations of divide and conquer",
        explain:
          "Divide and conquer fails, or needs help, in four situations. When subproblems OVERLAP (Fibonacci's fib(n − 1) and fib(n − 2) share almost all their work), plain recursion recomputes them exponentially often: use dynamic programming (Module 14). When splits are UNBALANCED, the recursion tree becomes a chain. For SMALL inputs the overhead of calls and splitting outweighs the gain, so practical implementations switch to a simple method below a cut-off (insertion sort below about 16 items; schoolbook multiplication below a few dozen digits). And when the COMBINE step is as expensive as solving the problem directly, nothing is gained.",
        decision: {
          scenario: "A student writes a divide-and-conquer Fibonacci: fib(n) = fib(n − 1) + fib(n − 2), and is disappointed that it is exponential.",
          question: "Which limitation of divide and conquer is this?",
          options: [
            {
              id: "a",
              text: "Overlapping subproblems: the two calls recompute the same values, so the fix is to store results (dynamic programming)",
              why: "Divide and conquer assumes independent subproblems; fib's are almost identical. Memoization reduces it to Θ(n).",
            },
            { id: "b", text: "Unbalanced splits", whyWrong: "The real problem is not the sizes but the repetition of identical subproblems." },
            { id: "c", text: "The combine step is too expensive", whyWrong: "Combining is a single addition." },
            { id: "d", text: "Recursion cannot compute Fibonacci numbers", whyWrong: "It can; it is only slow without storing results." },
          ],
          correct: "a",
          aftermath: "Independent subproblems: divide and conquer. Overlapping subproblems: dynamic programming. That distinction is Module 14's starting point.",
        },
      },
    ],

    task: {
      title: "Module 12 practice: design, implement, analyse",
      intro: "For every algorithm, write its recurrence and solve it with the Master Theorem or a recursion tree.",
      prompts: [
        "Implement merge sort and quick sort from memory, and count their comparisons on 10,000 random items. Compare with n log₂ n.",
        "Solve problems using binary search: the integer square root, the first bad version in a sequence of builds, and the smallest capacity that ships all parcels within D days.",
        "Draw the recursion trees for T(n) = 2T(n/2) + n, T(n) = 3T(n/2) + n and T(n) = 2T(n/2) + n², labelling the work per level, and say which part dominates each.",
        "Apply the Master Theorem to: 2T(n/2) + 1, 4T(n/2) + n, 4T(n/2) + n², 4T(n/2) + n³, 3T(n/3) + n, 2T(n/4) + √n. Show a, b, d and log_b a each time.",
        "Time your karatsuba against Python's built-in * for 1,000- and 10,000-digit numbers, then add a cut-off below which karatsuba uses * directly. What cut-off is fastest?",
      ],
      closing: "Divide and conquer explores every subproblem. Module 13's greedy algorithms make one choice and never look back.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
