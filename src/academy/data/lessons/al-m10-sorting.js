/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 10 · SORTING ALGORITHMS
 *
 * Curriculum 10.1 – 10.15. Stability, in-place sorting, and every classic
 * sort: bubble, selection, insertion, merge, quick, heap, counting, radix and
 * bucket; compared by best, average and worst case. Every sort is written by
 * the learner, checked against Python's sorted() on random data, and the
 * large tests are sized so that a quadratic implementation runs out of time
 * where the curriculum promises n log n (or linear) behaviour.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s10-sorting";

const PY = "python";
const py = String.raw;

// Shared by the challenges that forbid the built-in sort.
const NO_BUILTIN = py`assert not calls("sorted") and not calls("sort"), "Implement the algorithm yourself, without sorted() or .sort()."`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 10.1 – 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l40-sorting-intro",
    moduleId: "al-m10-sorting",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "Introduction to Sorting",
    subtitle: "Why sort, stability, and in-place versus out-of-place",
    estimatedMinutes: 26,
    intro:
      "Sorting is the most studied problem in computer science, because so much depends on it: binary search, removing duplicates, ranking, grouping, and finding medians all start with sorted data.",

    atoms: [
      {
        id: "a-al-sorting-intro",
        title: "Introduction to sorting and the n log n lower bound",
        explain:
          "SORTING arranges n items in order by a KEY. Most sorting algorithms are COMPARISON sorts: they learn about the order only by comparing pairs. Any comparison sort can be drawn as a DECISION TREE whose leaves are the n! possible orderings; a binary tree with n! leaves has height at least log₂(n!), and log₂(n!) = Θ(n log n). So EVERY comparison sort needs Ω(n log n) comparisons in the worst case, and merge sort and heap sort, at O(n log n), are optimal. Counting, radix and bucket sort escape the bound because they do not compare keys: they use the keys' values directly.",
        codeExercise: {
          language: PY,
          code: py`import math

for n in [3, 10, 100]:
    print(n, math.ceil(math.log2(math.factorial(n))))
`,
          question: "This prints ⌈log₂(n!)⌉: the minimum number of comparisons ANY comparison sort needs in the worst case. What does it print for n = 3, 10 and 100?",
          expectedOutput: "3 3\n10 22\n100 525",
          hint: "3! = 6 and log₂ 6 ≈ 2.58. 10! = 3,628,800 and log₂ of that ≈ 21.8.",
          successMessage: "3 comparisons for 3 items, 525 for 100. n log₂ n at n = 100 is 664: the bound and the best algorithms are the same order of growth.",
        },
      },
      {
        id: "a-al-stability",
        title: "Stability in sorting: a student ranking system",
        explain:
          "A sort is STABLE if items with EQUAL keys keep their original relative order. Stability matters when sorting by several keys: to rank students by score with ties in alphabetical order, sort by name first, then STABLY by score; the second sort keeps the alphabetical order inside each score. Insertion, merge, counting and radix sort are stable; selection, quick and heap sort, in their usual forms, are not. Python's sorted() and list.sort() are guaranteed stable, and key= lets you choose what to sort by.",
        codeChallenge: {
          task: "Write rank_students(students) where students is a list of (name, score) tuples. Return a new list ranked by score from highest to lowest, with students on the same score in alphabetical order. Do it with TWO sorts: first by name, then a stable sort by score (descending). Use sorted() with key= and reverse=.",
          starter: "def rank_students(students):\n    pass\n",
          sample: "rank_students([(\"Musa\", 70), (\"Ada\", 85), (\"Chi\", 70)]) → [(\"Ada\", 85), (\"Chi\", 70), (\"Musa\", 70)]",
          tests: [
            {
              check: py`cls = [("Musa", 70), ("Ada", 85), ("Chi", 70), ("Bola", 85), ("Efe", 62)]
want = [("Ada", 85), ("Bola", 85), ("Chi", 70), ("Musa", 70), ("Efe", 62)]
assert rank_students(cls) == want, "Highest score first, ties alphabetical. Got " + repr(rank_students(cls))
assert cls[0] == ("Musa", 70), "Do not change the original list."
assert rank_students([]) == [], "An empty class."
assert source.count("sorted(") + source.count(".sort(") >= 2, "Use two sorts: by name, then a stable sort by score."`,
            },
          ],
          solution: "def rank_students(students):\n    by_name = sorted(students, key=lambda s: s[0])\n    return sorted(by_name, key=lambda s: s[1], reverse=True)\n",
          hint: "by_name = sorted(students, key=lambda s: s[0]); then return sorted(by_name, key=lambda s: s[1], reverse=True). reverse=True keeps the sort stable.",
          successMessage: "The second sort did not disturb the alphabetical order within each score: that is stability, and it is why multi-key sorts can be built in passes.",
        },
      },
      {
        id: "a-al-in-place-sorting",
        title: "In-place versus out-of-place sorting",
        explain:
          "An IN-PLACE sort rearranges the input array itself using O(1) extra memory (or O(log n) for a recursion stack): bubble, selection, insertion, heap and quick sort. An OUT-OF-PLACE sort builds its result in additional memory: merge sort needs an O(n) buffer, and counting sort needs a count array and an output array. In Python, items.sort() is in place and returns None; sorted(items) is out of place and returns a new list, leaving items untouched. Choose in-place when memory is tight; out-of-place when the original order must be kept.",
        decision: {
          scenario: "scores = [70, 55, 90]\nresult = scores.sort()\nprint(result)",
          question: "What is printed, and why?",
          options: [
            { id: "a", text: "[55, 70, 90]", whyWrong: "list.sort() sorts in place and returns None; the sorted list is scores itself." },
            { id: "b", text: "None, because sort() changes scores in place and returns nothing", why: "In-place methods return None by convention. Use sorted(scores) for a new list." },
            { id: "c", text: "[70, 55, 90]", whyWrong: "result is not the list at all." },
            { id: "d", text: "An error", whyWrong: "The code runs; it just prints None." },
          ],
          correct: "b",
          aftermath: "items.sort(): in place, returns None. sorted(items): new list, original untouched.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 10.4 – 10.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l41-simple-sorts",
    moduleId: "al-m10-sorting",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5", "10.6"],
    title: "Bubble, Selection and Insertion Sort",
    subtitle: "The three quadratic sorts, and what each is good for",
    estimatedMinutes: 34,
    intro:
      "The simple sorts are O(n²) in the worst case, but they are not interchangeable: they differ in their best cases, their swaps and their stability, and insertion sort is still used inside the fastest real-world sorts.",

    atoms: [
      {
        id: "a-al-bubble-sort",
        title: "Bubble sort",
        explain:
          "BUBBLE SORT makes repeated passes over the list, swapping each adjacent pair that is out of order; after pass k, the k largest items are in their final places at the end. If a whole pass makes NO swaps, the list is sorted and the algorithm can stop. With that early exit, the best case (already sorted) is one pass: O(n). The worst case (reversed) is n − 1 passes and n(n − 1)/2 swaps: O(n²). It is stable and in place, and mainly of teaching value.",
        codeChallenge: {
          task: "Write bubble_sort(items) that sorts the list IN PLACE by adjacent swaps, stops early after any pass with no swaps, and returns the number of swaps made. The test sorts an already-sorted list of 3,000 items: without the early exit that would take millions of comparisons.",
          starter: "def bubble_sort(items):\n    pass\n",
          sample: "data = [3, 1, 2]; bubble_sort(data) → 2, and data becomes [1, 2, 3]",
          tests: [
            {
              check: py`data = [5, 1, 4, 2, 8]
swaps = bubble_sort(data)
assert data == [1, 2, 4, 5, 8], "The list must be sorted in place. It is " + repr(data)
assert swaps == 4, "[5, 1, 4, 2, 8] needs 4 adjacent swaps. Counted " + repr(swaps)
rev = list(range(10, 0, -1))
assert bubble_sort(rev) == 45 and rev == list(range(1, 11)), "A reversed list of 10 needs 10 × 9 / 2 = 45 swaps."
already = list(range(3000))
assert bubble_sort(already) == 0, "An already-sorted list needs no swaps, and one pass with the early exit."
import random
random.seed(5)
r = [random.randint(0, 99) for _ in range(150)]
expect = sorted(r)
bubble_sort(r)
assert r == expect, "150 random numbers must end up sorted."
` + NO_BUILTIN,
            },
          ],
          solution: "def bubble_sort(items):\n    swaps = 0\n    for end in range(len(items) - 1, 0, -1):\n        swapped = False\n        for i in range(end):\n            if items[i] > items[i + 1]:\n                items[i], items[i + 1] = items[i + 1], items[i]\n                swaps += 1\n                swapped = True\n        if not swapped:\n            break\n    return swaps\n",
          hint: "Outer loop: end from len(items) - 1 down to 1. Inner: compare items[i] and items[i + 1] for i < end. Track whether the pass swapped; break if not.",
          successMessage: "The swap count equals the number of INVERSIONS (out-of-order pairs): 45 for a reversed list of 10. Each adjacent swap fixes exactly one.",
        },
      },
      {
        id: "a-al-selection-sort",
        title: "Selection sort",
        explain:
          "SELECTION SORT repeatedly SELECTS the minimum of the unsorted part and swaps it into the next position. It always makes n(n − 1)/2 comparisons, whatever the input, so its best, average and worst cases are all Θ(n²). But it makes at most n − 1 swaps, the fewest of any simple sort, which matters when writing to memory is expensive (flash storage, large records). It is in place but NOT stable: the long-distance swap can jump an item over an equal one.",
        codeChallenge: {
          task: "Write selection_sort(items) that sorts the list in place: for each position i, find the index of the smallest item from i to the end, and swap it into position i only if it is not already there. Return the number of swaps made.",
          starter: "def selection_sort(items):\n    pass\n",
          sample: "data = [3, 1, 2]; selection_sort(data) → 2",
          tests: [
            {
              check: py`data = [3, 1, 2]
assert selection_sort(data) == 2 and data == [1, 2, 3], "[3, 1, 2] is sorted with 2 swaps. Got data " + repr(data)
rev = [6, 5, 4, 3, 2, 1]
assert selection_sort(rev) == 3 and rev == [1, 2, 3, 4, 5, 6], "A reversed list of 6 needs only 3 swaps."
done = [1, 2, 3, 4]
assert selection_sort(done) == 0, "A sorted list needs no swaps."
import random
random.seed(8)
r = [random.randint(0, 50) for _ in range(120)]
expect = sorted(r)
swaps = selection_sort(r)
assert r == expect and swaps <= 119, "120 random numbers sorted, with at most n − 1 = 119 swaps."
` + NO_BUILTIN + py`
assert not calls("min") and not calls("index"), "Find the smallest item's index with your own loop."`,
            },
          ],
          solution: "def selection_sort(items):\n    swaps = 0\n    n = len(items)\n    for i in range(n - 1):\n        smallest = i\n        for j in range(i + 1, n):\n            if items[j] < items[smallest]:\n                smallest = j\n        if smallest != i:\n            items[i], items[smallest] = items[smallest], items[i]\n            swaps += 1\n    return swaps\n",
          hint: "For i in range(n - 1): smallest = i; scan j from i + 1, updating smallest when items[j] < items[smallest]. Swap and count only if smallest != i.",
          successMessage: "At most n − 1 swaps, however disordered the input, but always n(n − 1)/2 comparisons, even on sorted data.",
        },
      },
      {
        id: "a-al-insertion-sort",
        title: "Insertion sort",
        explain:
          "INSERTION SORT grows a sorted prefix: take the next item, SHIFT every larger item in the prefix one place right, and insert it in the gap, the way you sort a hand of cards. The number of shifts equals the number of inversions, so: best case (sorted) 0 shifts and n − 1 comparisons, O(n); worst case (reversed) n(n − 1)/2, O(n²); average O(n²). It is stable, in place and ONLINE (it can sort items as they arrive), and it is the fastest method for small or nearly sorted arrays. Python's Timsort and C++'s introsort switch to insertion sort for short runs.",
        codeChallenge: {
          task: "Write insertion_sort(items) that sorts the list in place by shifting larger items right and inserting each item into the gap. Return the total number of shifts (one per item moved one place right). The test also sorts an already-sorted list of 3,000 items, which must take O(n).",
          starter: "def insertion_sort(items):\n    pass\n",
          sample: "data = [3, 1, 2]; insertion_sort(data) → 2",
          tests: [
            {
              check: py`def inversions(a):
    return sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] > a[j])

data = [5, 2, 4, 6, 1, 3]
want_shifts = inversions(data)
assert insertion_sort(data) == want_shifts and data == [1, 2, 3, 4, 5, 6], "The shifts must equal the inversions (" + str(want_shifts) + ") and the list must be sorted. data = " + repr(data)
import random
random.seed(11)
r = [random.randint(0, 99) for _ in range(80)]
inv = inversions(r)
expect = sorted(r)
assert insertion_sort(r) == inv and r == expect, "80 random numbers: shifts equal inversions."
stable = [(2, "a"), (1, "b"), (2, "c"), (1, "d")]
insertion_sort(stable)
assert stable == [(1, "b"), (1, "d"), (2, "a"), (2, "c")], "Insertion sort is stable: equal keys keep their order."
already = list(range(3000))
assert insertion_sort(already) == 0, "A sorted list needs no shifts."
` + NO_BUILTIN,
            },
          ],
          solution: "def insertion_sort(items):\n    shifts = 0\n    for i in range(1, len(items)):\n        current = items[i]\n        j = i - 1\n        while j >= 0 and items[j] > current:\n            items[j + 1] = items[j]\n            shifts += 1\n            j -= 1\n        items[j + 1] = current\n    return shifts\n",
          hint: "For i from 1: current = items[i]; j = i - 1; while j >= 0 and items[j] > current: shift items[j] to j + 1, count, j -= 1. Then items[j + 1] = current. Use > (not >=) to stay stable.",
          successMessage: "Shifts = inversions: zero on sorted data, n(n − 1)/2 on reversed. The algorithm's cost is a direct measure of how unsorted the input is.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 10.7 – 10.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l42-merge-quick",
    moduleId: "al-m10-sorting",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.7", "10.8"],
    title: "Merge Sort and Quick Sort",
    subtitle: "Two divide-and-conquer sorts, two different trade-offs",
    estimatedMinutes: 36,
    intro:
      "Merge sort and quick sort both split the problem and recurse. Merge sort does the work when COMBINING (merging); quick sort does it when DIVIDING (partitioning). The difference gives one a guaranteed O(n log n) and the other the fastest average in practice.",

    atoms: [
      {
        id: "a-al-merge-sort",
        title: "Merge sort",
        explain:
          "MERGE SORT splits the list into halves, sorts each half recursively, and MERGES the two sorted halves by repeatedly taking the smaller front item. A list of 0 or 1 items is already sorted (the base case). There are log₂ n levels of halving and each level does O(n) merging work, so T(n) = 2T(n/2) + O(n) = Θ(n log n) in the best, average AND worst case. It needs O(n) extra space for merging, it is stable if ties take from the left half, and it works well on linked lists and on data too big for memory (external sorting).",
        codeChallenge: {
          task: "Write merge(left, right) that merges two sorted lists (taking from left on ties, to stay stable), and merge_sort(items) that returns a NEW sorted list recursively using merge. Do not use sorted() or .sort(). The test sorts 2,000 random numbers.",
          starter: "def merge(left, right):\n    pass\n\ndef merge_sort(items):\n    pass\n",
          sample: "merge([1, 4, 9], [2, 3, 10]) → [1, 2, 3, 4, 9, 10]",
          tests: [
            {
              check: py`assert merge([1, 4, 9], [2, 3, 10]) == [1, 2, 3, 4, 9, 10], "Got " + repr(merge([1, 4, 9], [2, 3, 10]))
assert merge([], [5]) == [5] and merge([5], []) == [5], "Merging with an empty list."
assert merge_sort([38, 27, 43, 3, 9, 82, 10]) == [3, 9, 10, 27, 38, 43, 82], "Got " + repr(merge_sort([38, 27, 43, 3, 9, 82, 10]))
assert merge_sort([]) == [] and merge_sort([1]) == [1], "Base cases."
import random
random.seed(21)
data = [random.randint(0, 10000) for _ in range(2000)]
copy = list(data)
assert merge_sort(data) == sorted(copy) and data == copy, "2,000 random numbers sorted, and the input left unchanged."
pairs = [(2, "a"), (1, "b"), (2, "c"), (1, "d")]
class Key:
    def __init__(self, p): self.p = p
    def __lt__(self, o): return self.p[0] < o.p[0]
    def __le__(self, o): return self.p[0] <= o.p[0]
    def __gt__(self, o): return self.p[0] > o.p[0]
    def __ge__(self, o): return self.p[0] >= o.p[0]
out = [k.p for k in merge_sort([Key(p) for p in pairs])]
assert out == [(1, "b"), (1, "d"), (2, "a"), (2, "c")], "Merge sort must be stable: on ties, take from the left half."
` + NO_BUILTIN,
            },
          ],
          solution: "def merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if right[j] < left[i]:\n            result.append(right[j])\n            j += 1\n        else:\n            result.append(left[i])\n            i += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return list(items)\n    mid = len(items) // 2\n    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))\n",
          hint: "merge: two indexes; take right[j] only if it is strictly smaller than left[i], otherwise take left[i]; then extend with the leftovers. merge_sort: base case len <= 1, else merge the sorted halves.",
          successMessage: "Θ(n log n) on every input, stable, O(n) extra space. Module 12 derives the n log n from its recurrence.",
        },
      },
      {
        id: "a-al-quick-sort",
        title: "Quick sort",
        explain:
          "QUICK SORT picks a PIVOT, PARTITIONS the list so that everything smaller is to its left and everything larger to its right (the pivot is then in its final place), and recursively sorts the two sides. The LOMUTO partition keeps an index i: scan j from lo to hi − 1, and whenever items[j] < pivot, swap it to position i and advance i; finally swap the pivot (stored at hi) into position i. With a good pivot the sides are balanced: T(n) = 2T(n/2) + O(n) = O(n log n) on average. It is in place (O(log n) stack on average) and very fast in practice, but not stable.",
        codeChallenge: {
          task: "Write quick_sort(items, lo=0, hi=None) that sorts the list IN PLACE with the Lomuto partition. Choose a RANDOM pivot index between lo and hi (random.randint) and swap it to hi before partitioning. The tests include a sorted list of 1,500 items, where always picking the last item as the pivot would go 1,500 calls deep and fail.",
          starter: "import random\n\ndef quick_sort(items, lo=0, hi=None):\n    pass\n",
          sample: "data = [5, 2, 9, 1]; quick_sort(data); data → [1, 2, 5, 9]",
          tests: [
            {
              check: py`data = [5, 2, 9, 1, 5, 6]
quick_sort(data)
assert data == [1, 2, 5, 5, 6, 9], "Sorted in place. data = " + repr(data)
for small in ([], [1], [2, 1], [1, 1, 1]):
    s = list(small)
    quick_sort(s)
    assert s == sorted(small), "Small cases: " + repr(small)
import random as _r
_r.seed(31)
r = [_r.randint(0, 1000) for _ in range(2000)]
expect = sorted(r)
quick_sort(r)
assert r == expect, "2,000 random numbers sorted."
ordered = list(range(1500))
quick_sort(ordered)
assert ordered == list(range(1500)), "An already-sorted list: a random pivot keeps the recursion shallow."
` + NO_BUILTIN,
            },
          ],
          solution: "import random\n\ndef quick_sort(items, lo=0, hi=None):\n    if hi is None:\n        hi = len(items) - 1\n    if lo >= hi:\n        return\n    p = random.randint(lo, hi)\n    items[p], items[hi] = items[hi], items[p]\n    pivot = items[hi]\n    i = lo\n    for j in range(lo, hi):\n        if items[j] < pivot:\n            items[i], items[j] = items[j], items[i]\n            i += 1\n    items[i], items[hi] = items[hi], items[i]\n    quick_sort(items, lo, i - 1)\n    quick_sort(items, i + 1, hi)\n",
          hint: "If hi is None set it to len(items) - 1; return if lo >= hi. Swap a random index into hi, partition with i and j, put the pivot at i, then recurse on lo..i-1 and i+1..hi.",
          successMessage: "A random pivot makes the worst case astronomically unlikely on any input, so quick sort runs in expected O(n log n).",
        },
      },
      {
        id: "a-al-quick-sort-worst",
        title: "Quick sort's worst case",
        explain:
          "If the pivot is always the smallest or largest item, one side of every partition is EMPTY and the other has n − 1 items: T(n) = T(n − 1) + O(n) = Θ(n²), with recursion n deep. Choosing the LAST item as pivot triggers exactly this on input that is already sorted, a very common input. Defences: a random pivot, or median-of-three (the median of the first, middle and last items). Real libraries (introsort) also switch to heap sort if the recursion gets too deep, guaranteeing O(n log n).",
        codeExercise: {
          language: PY,
          code: py`import random

comparisons = 0

def partition(a, lo, hi):
    global comparisons
    pivot = a[hi]
    i = lo
    for j in range(lo, hi):
        comparisons += 1
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return i

def quick_sort(a, lo, hi):
    if lo < hi:
        p = partition(a, lo, hi)
        quick_sort(a, lo, p - 1)
        quick_sort(a, p + 1, hi)

random.seed(1)
shuffled = list(range(100))
random.shuffle(shuffled)
for name, data in [("sorted", list(range(100))), ("shuffled", shuffled)]:
    comparisons = 0
    quick_sort(data, 0, len(data) - 1)
    print(name, comparisons)
`,
          question: "Quick sort with the LAST item as pivot sorts 100 items twice: already sorted, then shuffled. The sorted case is the worst case, n(n − 1)/2 comparisons. What does it print? (The shuffled count is 548.)",
          expectedOutput: "sorted 4950\nshuffled 548",
          hint: "On sorted input every partition splits off one item: 99 + 98 + ... + 1.",
          successMessage: "4,950 against 548: nine times the work on the input that looks easiest. n log₂ n at n = 100 is about 664, so the shuffled run is typical of O(n log n).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 10.9 – 10.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l43-heap-linear-sorts",
    moduleId: "al-m10-sorting",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.9", "10.10", "10.11", "10.12"],
    title: "Heap Sort, Counting Sort, Radix Sort and Bucket Sort",
    subtitle: "A guaranteed in-place n log n, and three sorts that beat it",
    estimatedMinutes: 38,
    intro:
      "Heap sort gives O(n log n) in the worst case with no extra memory. Then three non-comparison sorts break the Ω(n log n) barrier by using the keys' values directly, when the keys allow it.",

    atoms: [
      {
        id: "a-al-heap-sort",
        title: "Heap sort",
        explain:
          "HEAP SORT first turns the array into a MAX-HEAP in place (sift down every non-leaf node from the last one, index n // 2 − 1, back to 0: this BUILD-HEAP step is O(n)). Then it repeats: swap the root (the maximum) with the last item of the heap, shrink the heap by one, and sift the new root down. Each of the n extractions costs O(log n), so heap sort is Θ(n log n) in the best, average and worst case, with O(1) extra space. It is not stable and, in practice, slower than quick sort because it jumps around memory.",
        codeChallenge: {
          task: "Write heap_sort(items) that sorts the list IN PLACE: write a helper sift_down(a, start, end) that sifts a[start] down within a[0:end] in a MAX-heap; build the heap by sifting down from len(a) // 2 - 1 to 0; then repeatedly swap a[0] with a[end - 1] and sift down within the shrunken heap. Do not use heapq.",
          starter: "def sift_down(a, start, end):\n    pass\n\ndef heap_sort(items):\n    pass\n",
          sample: "data = [4, 10, 3, 5, 1]; heap_sort(data); data → [1, 3, 4, 5, 10]",
          tests: [
            {
              check: py`data = [4, 10, 3, 5, 1]
heap_sort(data)
assert data == [1, 3, 4, 5, 10], "Sorted in place. data = " + repr(data)
for small in ([], [7], [2, 1], [3, 3, 1]):
    s = list(small)
    heap_sort(s)
    assert s == sorted(small), "Small case " + repr(small)
import random
random.seed(41)
r = [random.randint(0, 5000) for _ in range(1000)]
expect = sorted(r)
heap_sort(r)
assert r == expect, "1,000 random numbers sorted."
worst = list(range(1000, 0, -1))
heap_sort(worst)
assert worst == list(range(1, 1001)), "A reversed list: still O(n log n)."
assert "heapq" not in source, "Write sift_down yourself."
` + NO_BUILTIN,
            },
          ],
          solution: "def sift_down(a, start, end):\n    i = start\n    while True:\n        largest = i\n        left, right = 2 * i + 1, 2 * i + 2\n        if left < end and a[left] > a[largest]:\n            largest = left\n        if right < end and a[right] > a[largest]:\n            largest = right\n        if largest == i:\n            return\n        a[i], a[largest] = a[largest], a[i]\n        i = largest\n\ndef heap_sort(items):\n    n = len(items)\n    for start in range(n // 2 - 1, -1, -1):\n        sift_down(items, start, n)\n    for end in range(n - 1, 0, -1):\n        items[0], items[end] = items[end], items[0]\n        sift_down(items, 0, end)\n",
          hint: "sift_down: repeatedly find the largest of i, 2i + 1, 2i + 2 (only those < end) and swap down until i is largest. heap_sort: build from n // 2 - 1 down to 0, then for end from n - 1 down to 1 swap a[0] and a[end] and sift_down(a, 0, end).",
          successMessage: "O(n log n) guaranteed, O(1) extra space. This is the fallback introsort uses when quick sort's recursion gets too deep.",
        },
      },
      {
        id: "a-al-counting-sort",
        title: "Counting sort: sorting examination results",
        explain:
          "When the keys are whole numbers in a small range 0..k, COUNTING SORT does not compare at all: count how many times each value occurs (O(n)), then output each value as many times as it was counted (O(k)). Total O(n + k) time and O(k) extra space: linear when k = O(n). Examination scores (0 to 100) are the ideal case: sorting 100,000 scripts takes about 100,000 + 101 steps. The general, STABLE version turns the counts into starting positions (prefix sums) and places each record at its position, which is what radix sort needs.",
        codeChallenge: {
          task: "Write counting_sort(scores, max_value) that returns a new sorted list of the whole numbers in scores (each between 0 and max_value) by counting: make a list of max_value + 1 zeros, count each score, then build the output from the counts. Do not compare scores with each other or use sorted(). The test sorts 20,000 scores.",
          starter: "def counting_sort(scores, max_value):\n    pass\n",
          sample: "counting_sort([3, 1, 3, 0, 2], 3) → [0, 1, 2, 3, 3]",
          tests: [
            {
              check: py`assert counting_sort([3, 1, 3, 0, 2], 3) == [0, 1, 2, 3, 3], "Got " + repr(counting_sort([3, 1, 3, 0, 2], 3))
assert counting_sort([], 100) == [], "No scores."
assert counting_sort([100, 0, 100], 100) == [0, 100, 100], "The extremes 0 and max_value."
import random
random.seed(51)
results = [random.randint(0, 100) for _ in range(20000)]
assert counting_sort(results, 100) == sorted(results), "20,000 examination scores."
` + NO_BUILTIN,
            },
          ],
          solution: "def counting_sort(scores, max_value):\n    counts = [0] * (max_value + 1)\n    for s in scores:\n        counts[s] += 1\n    result = []\n    for value in range(max_value + 1):\n        result.extend([value] * counts[value])\n    return result\n",
          hint: "counts = [0] * (max_value + 1); for s in scores: counts[s] += 1. Then for each value 0..max_value, add counts[value] copies of it to the result.",
          successMessage: "O(n + k) with no comparisons at all: 20,000 scores in about 20,100 steps. The Ω(n log n) bound only binds comparison sorts.",
        },
      },
      {
        id: "a-al-radix-bucket",
        title: "Radix sort and bucket sort",
        explain:
          "RADIX SORT sorts whole numbers digit by digit, starting from the LEAST significant digit, using a STABLE sort (usually distributing into 10 buckets) for each digit. Stability is essential: after sorting by the tens digit, numbers with equal tens digits stay in their units order. With d digits in base b it takes O(d(n + b)): linear for fixed-width keys such as phone numbers or IDs. BUCKET SORT is for keys spread uniformly over a range such as [0, 1): distribute them into n buckets by value, sort each small bucket (insertion sort), and concatenate; O(n) on average, O(n²) if everything lands in one bucket.",
        codeChallenge: {
          task: "Write radix_sort(nums) for non-negative whole numbers, least-significant digit first, base 10: for each digit position (1s, 10s, 100s, ... up to the largest number's length), distribute the numbers into 10 bucket lists by that digit, keeping their current order, then join the buckets 0 to 9. Return the sorted list. Do not use sorted() or .sort().",
          starter: "def radix_sort(nums):\n    pass\n",
          sample: "radix_sort([170, 45, 75, 90, 802, 24, 2, 66]) → [2, 24, 45, 66, 75, 90, 170, 802]",
          tests: [
            {
              check: py`sample = [170, 45, 75, 90, 802, 24, 2, 66]
assert radix_sort(sample) == [2, 24, 45, 66, 75, 90, 170, 802], "Got " + repr(radix_sort(sample))
assert radix_sort([]) == [] and radix_sort([0]) == [0] and radix_sort([5, 0, 5]) == [0, 5, 5], "Small cases, including zeros."
import random
random.seed(61)
r = [random.randint(0, 10**6) for _ in range(3000)]
assert radix_sort(r) == sorted(r), "3,000 numbers up to a million."
` + NO_BUILTIN,
            },
          ],
          solution: "def radix_sort(nums):\n    if not nums:\n        return []\n    result = list(nums)\n    place = 1\n    largest = max(result)\n    while largest // place > 0:\n        buckets = [[] for _ in range(10)]\n        for x in result:\n            buckets[(x // place) % 10].append(x)\n        result = [x for bucket in buckets for x in bucket]\n        place *= 10\n    return result\n",
          hint: "place = 1; while max(nums) // place > 0: make 10 empty buckets, append each x to buckets[(x // place) % 10], flatten the buckets in order, and multiply place by 10.",
          successMessage: "Seven passes of 3,000 items for numbers up to a million: O(d · n). Each pass is stable, which is what makes the earlier digits' order survive.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 10.13 – 10.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l44-comparing-sorts",
    moduleId: "al-m10-sorting",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.13", "10.14", "10.15"],
    title: "Comparing and Selecting Sorting Algorithms",
    subtitle: "Best, average and worst cases side by side",
    estimatedMinutes: 30,
    intro:
      "You now know nine sorting algorithms. This lesson compares them case by case, watches one work step by step, and gives you the rules for choosing, which is what examiners and interviewers actually ask.",

    atoms: [
      {
        id: "a-al-comparing-sorts",
        title: "Comparing sorting algorithms: products by price",
        explain:
          "The table is the summary to know. Two facts stand out: no comparison sort beats O(n log n) in the worst case, and the ones that reach it trade something else (merge sort uses O(n) memory; heap sort is not stable; quick sort risks O(n²)). In real code, use the library sort (Python's Timsort: stable, O(n log n) worst case, O(n) on already-sorted runs), and give it a key.",
        table: {
          caption: "Sorting algorithms compared (k = range of key values, d = number of digits).",
          headers: ["Algorithm", "Best", "Average", "Worst", "Extra space", "Stable", "In place"],
          rows: [
            ["Bubble sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes", "Yes"],
            ["Selection sort", "O(n²)", "O(n²)", "O(n²)", "O(1)", "No", "Yes"],
            ["Insertion sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes", "Yes"],
            ["Merge sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes", "No"],
            ["Quick sort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No", "Yes"],
            ["Heap sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "No", "Yes"],
            ["Counting sort", "O(n + k)", "O(n + k)", "O(n + k)", "O(n + k)", "Yes", "No"],
            ["Radix sort", "O(d(n + b))", "O(d(n + b))", "O(d(n + b))", "O(n + b)", "Yes", "No"],
            ["Bucket sort", "O(n)", "O(n)", "O(n²)", "O(n)", "Yes*", "No"],
          ],
        },
        codeChallenge: {
          task: "Sort products according to price. Write sort_products(products) where products is a list of (name, price) tuples: return a new list from cheapest to most expensive, with products of equal price in alphabetical order of name. Use one sorted() call with a key that returns a tuple.",
          starter: "def sort_products(products):\n    pass\n",
          sample: "sort_products([(\"Yam\", 3000), (\"Beans\", 1800), (\"Garri\", 1800)]) → [(\"Beans\", 1800), (\"Garri\", 1800), (\"Yam\", 3000)]",
          tests: [
            {
              check: py`shop = [("Yam", 3000), ("Rice", 9500), ("Beans", 1800), ("Garri", 1800), ("Oil", 2800)]
want = [("Beans", 1800), ("Garri", 1800), ("Oil", 2800), ("Yam", 3000), ("Rice", 9500)]
assert sort_products(shop) == want, "Cheapest first, ties by name. Got " + repr(sort_products(shop))
assert shop[0] == ("Yam", 3000), "Return a new list; do not change the original."
assert sort_products([]) == [], "No products."`,
            },
          ],
          solution: "def sort_products(products):\n    return sorted(products, key=lambda p: (p[1], p[0]))\n",
          hint: "sorted(products, key=lambda p: (p[1], p[0])): tuples compare by price first, then by name.",
          successMessage: "One stable O(n log n) library sort with a compound key. In practice, this is how sorting is done.",
        },
      },
      {
        id: "a-al-case-analysis",
        title: "Best, average and worst cases, step by step",
        explain:
          "Each algorithm's cases are triggered by specific inputs. Insertion sort: best on sorted input (no shifts), worst on reversed input (every item shifts past all before it). Bubble sort with early exit: the same. Quick sort with a fixed pivot: worst on sorted or reversed input. Merge sort and heap sort: the same order of work on every input. Selection sort: always n(n − 1)/2 comparisons. Watching an algorithm step by step makes these visible: below, insertion sort prints the list after each item is inserted.",
        codeExercise: {
          language: PY,
          code: py`a = [5, 2, 4, 6, 1, 3]
print(a)
for i in range(1, len(a)):
    current = a[i]
    j = i - 1
    while j >= 0 and a[j] > current:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = current
    print(a)
`,
          question: "This visualises insertion sort: it prints the list before sorting and after each insertion. What are the six lines?",
          expectedOutput: "[5, 2, 4, 6, 1, 3]\n[2, 5, 4, 6, 1, 3]\n[2, 4, 5, 6, 1, 3]\n[2, 4, 5, 6, 1, 3]\n[1, 2, 4, 5, 6, 3]\n[1, 2, 3, 4, 5, 6]",
          hint: "After step i, the first i + 1 items are sorted. 6 needs no shifts; 1 shifts past four items.",
          successMessage: "The sorted prefix grows by one each step. Inserting 6 cost nothing (best-case behaviour); inserting 1 cost four shifts (worst-case behaviour).",
        },
      },
      {
        id: "a-al-selecting-sort",
        title: "Selecting the appropriate sorting algorithm",
        explain:
          "Rules of thumb: for everyday code, use the library sort. Small arrays (under about 20 items) or nearly sorted data: insertion sort. A worst-case guarantee with no extra memory: heap sort. Stability with a guarantee, linked lists, or data too large for memory: merge sort. Fastest general in-memory sort on average: quick sort with a random or median-of-three pivot. Whole-number keys in a small range: counting sort. Fixed-width integer or string keys: radix sort. Uniformly distributed real numbers: bucket sort. Expensive writes: selection sort (fewest swaps).",
        decision: {
          scenario: "A hospital system must sort 2 million patient records by date of birth, keeping records with the same date in their current order (by registration time). Memory is plentiful.",
          question: "Which algorithm fits best?",
          options: [
            { id: "a", text: "Quick sort", whyWrong: "It is not stable, so records with the same date could be reordered." },
            { id: "b", text: "Heap sort", whyWrong: "Also not stable." },
            {
              id: "c",
              text: "Merge sort (or the library's stable sort, Timsort)",
              why: "Stable, O(n log n) guaranteed; its O(n) memory is affordable here. Dates also fit radix sort, which would be stable too.",
            },
            { id: "d", text: "Insertion sort", whyWrong: "Stable, but O(n²) on 2 million records is about 2 × 10¹² operations." },
          ],
          correct: "c",
          aftermath: "Requirements decide: stability rules out quick and heap sort; size rules out the quadratic sorts.",
        },
      },
    ],

    task: {
      title: "Module 10 practice: sorting projects",
      intro: "Use your own implementations from this module where the exercise asks for an algorithm by name.",
      prompts: [
        "Build a student ranking system: rank by total score, ties by surname, using stable sorting.",
        "Sort products according to price (cheapest first), then by rating (highest first) within each price.",
        "Sort examination results (0 to 100) for 100,000 students with counting sort, and compare its time with sorted().",
        "Compare sorting performance with 1,000, 10,000 and 100,000 records for insertion sort, merge sort, quick sort, heap sort and sorted(). Stop any run that takes over a minute and say why it was slow.",
        "Visualise how sorting algorithms operate step by step: print the list after each pass of bubble sort and after each partition of quick sort for [5, 2, 4, 6, 1, 3].",
      ],
      closing: "Merge sort and quick sort were recursive. Phase 5 studies recursion itself, and how to analyse it.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
