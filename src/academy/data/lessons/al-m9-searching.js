/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 9 · SEARCHING ALGORITHMS
 *
 * Curriculum 9.1 – 9.11. Linear search, binary search (iterative and
 * recursive), jump, interpolation and exponential search; sorted versus
 * unsorted data; comparing and choosing. Several challenges hand the
 * learner's function a list that COUNTS its element reads, so the test
 * checks the algorithm's real access pattern, not only its answer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s9-searching";

const PY = "python";
const py = String.raw;

// A list that counts how many elements a search reads. Prepended to checks.
const COUNTING = py`class Counting(list):
    def __init__(self, *args):
        super().__init__(*args)
        self.reads = 0
    def __getitem__(self, i):
        self.reads += 1
        return super().__getitem__(i)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 9.1 – 9.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l36-linear-search",
    moduleId: "al-m9-searching",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "Searching and Linear Search",
    subtitle: "The universal method, for any data",
    estimatedMinutes: 24,
    intro:
      "Searching is the most common thing programs do: find the student, the contact, the product. The simplest method, linear search, works on anything and is the baseline every other method is measured against.",

    atoms: [
      {
        id: "a-al-searching-intro",
        title: "Introduction to searching",
        explain:
          "The SEARCH problem: given a collection and a target KEY, return where the key is (an index, or the whole record) or report that it is absent (by convention −1 or None). The records may be numbers, or larger objects searched by one field, such as a student record searched by matriculation number. Which methods are possible depends on what you know about the data: unsorted data allows only linear search; sorted data allows binary, jump, interpolation and exponential search; data in a hash table allows O(1) average lookup.",
        decision: {
          scenario: "A university stores 40,000 student records in the order the students registered. You must find one student by matriculation number, once.",
          question: "What is the best method for this single search?",
          options: [
            { id: "a", text: "Sort the records, then binary search", whyWrong: "Sorting costs O(n log n), more than the O(n) scan it is meant to avoid, for a single search." },
            { id: "b", text: "Linear search", why: "For one search on unsorted data, a single O(n) pass is the cheapest correct method." },
            { id: "c", text: "Binary search on the records as they are", whyWrong: "Registration order is not sorted by matriculation number, so binary search gives wrong answers." },
            { id: "d", text: "Interpolation search", whyWrong: "It also requires sorted data." },
          ],
          correct: "b",
          aftermath: "If the same records are searched thousands of times, sorting once (or building a hash table) pays off. Lesson 39 works out when.",
        },
      },
      {
        id: "a-al-linear-search",
        title: "Linear search: a student record search",
        explain:
          "LINEAR (sequential) search checks each item from the first until it finds the key or reaches the end. Best case 1 comparison, worst case n, average (n + 1)/2 if the key is present: O(n) time and O(1) space. Its strengths are that it needs no preparation, works on unsorted data and on linked lists, and is the fastest method for very small collections. It is also how you search records by any field you did not organise the data around.",
        codeChallenge: {
          task: "Write find_student(records, matric) where records is a list of dicts with keys \"matric\", \"name\" and \"score\". Return the first record whose \"matric\" equals matric, using a linear search, or None if there is none.",
          starter: "def find_student(records, matric):\n    pass\n",
          sample: "find_student(records, \"CSC/21/014\") → {\"matric\": \"CSC/21/014\", \"name\": \"Ngozi\", \"score\": 74}",
          tests: [
            {
              check: py`records = [
    {"matric": "CSC/21/001", "name": "Tunde", "score": 68},
    {"matric": "CSC/21/014", "name": "Ngozi", "score": 74},
    {"matric": "CSC/21/009", "name": "Musa", "score": 59},
]
assert find_student(records, "CSC/21/014") == records[1], "Ngozi's record should be found. Got " + repr(find_student(records, "CSC/21/014"))
assert find_student(records, "CSC/21/001")["name"] == "Tunde", "The first record."
assert find_student(records, "CSC/21/999") is None, "An unknown matric number returns None."
assert find_student([], "CSC/21/001") is None, "An empty list."`,
            },
          ],
          solution: "def find_student(records, matric):\n    for record in records:\n        if record[\"matric\"] == matric:\n            return record\n    return None\n",
          hint: "for record in records: if record[\"matric\"] == matric: return record. After the loop, return None.",
          successMessage: "A complete record search in four lines: O(n) time, O(1) space, and no requirements on the data's order.",
        },
      },
      {
        id: "a-al-linear-search-variants",
        title: "Linear search variations: a contact search",
        explain:
          "Linear search adapts to any matching rule: find ALL matches instead of the first, match a prefix or a substring, ignore case. When the rule is not equality on a key the data is organised by, a linear scan is often the only option, which is why the search box of a contacts app scans the list for partial matches. Finding all matches always costs n comparisons, because every item must be checked.",
        codeChallenge: {
          task: "Write search_contacts(contacts, query) that returns the names in contacts (a list of strings) that contain query, ignoring upper and lower case, in their original order. An empty query matches every contact.",
          starter: "def search_contacts(contacts, query):\n    pass\n",
          sample: "search_contacts([\"Ada Obi\", \"Emeka Ade\", \"Bola\"], \"ade\") → [\"Emeka Ade\"]",
          tests: [
            {
              check: py`book = ["Ada Obi", "Emeka Ade", "Bola Adebayo", "Chinedu", "adaeze Nwosu"]
assert search_contacts(book, "ade") == ["Emeka Ade", "Bola Adebayo"], "Matches anywhere in the name. Got " + repr(search_contacts(book, "ade"))
assert search_contacts(book, "ADA") == ["Ada Obi", "adaeze Nwosu"], "Case is ignored on both sides."
assert search_contacts(book, "zz") == [], "No match returns an empty list."
assert search_contacts(book, "") == book, "An empty query matches every contact."`,
            },
          ],
          solution: "def search_contacts(contacts, query):\n    q = query.lower()\n    return [name for name in contacts if q in name.lower()]\n",
          hint: "Lower-case the query once, then keep each name where query in name.lower().",
          successMessage: "Finding every partial match must look at every contact: Θ(n), and no clever ordering can avoid it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 9.3 – 9.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l37-binary-search",
    moduleId: "al-m9-searching",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3", "9.4"],
    title: "Binary Search",
    subtitle: "Iterative and recursive, and finding boundaries",
    estimatedMinutes: 30,
    intro:
      "Binary search is the most important searching algorithm: on sorted data it finds any key among a million in twenty comparisons. It is also famously easy to get wrong, so this lesson builds it carefully, with an invariant.",

    atoms: [
      {
        id: "a-al-binary-search",
        title: "Binary search, with its invariant",
        explain:
          "On a SORTED list, compare the target with the middle item: if equal, done; if the target is smaller, it can only be in the left half; if larger, only in the right half. Keep two indexes lo and hi with the INVARIANT \"if the target is present, it is in items[lo..hi]\". Start with lo = 0, hi = n − 1; take mid = (lo + hi) // 2; move lo to mid + 1 or hi to mid − 1; stop when found or when lo > hi (the range is empty, so the target is absent). Each step halves the range, so at most ⌊log₂ n⌋ + 1 comparisons: O(log n) time, O(1) space.",
        table: {
          caption: "Searching for 37 in [3, 8, 15, 21, 30, 37, 42, 50, 61].",
          headers: ["Step", "lo", "hi", "mid", "items[mid]", "Decision"],
          rows: [
            ["1", "0", "8", "4", "30", "37 > 30: lo = 5"],
            ["2", "5", "8", "6", "42", "37 < 42: hi = 5"],
            ["3", "5", "5", "5", "37", "Found at index 5"],
          ],
        },
        codeChallenge: {
          task: "Write binary_search(items, target) for a sorted list. Return the index of target, or -1 if it is absent, using the lo/hi loop. Do not use in, .index() or a scan of every item: the tests count how many elements you read.",
          starter: "def binary_search(items, target):\n    pass\n",
          sample: "binary_search([3, 8, 15, 21, 30, 37, 42, 50, 61], 37) → 5",
          tests: [
            {
              check: COUNTING + py`data = Counting([3, 8, 15, 21, 30, 37, 42, 50, 61])
assert binary_search(data, 37) == 5, "37 is at index 5. Got " + repr(binary_search(data, 37))
assert binary_search(data, 3) == 0 and binary_search(data, 61) == 8, "First and last items."
assert binary_search(data, 40) == -1 and binary_search(data, 1) == -1 and binary_search(data, 99) == -1, "Absent targets, inside and outside the range."
assert binary_search(Counting([]), 5) == -1, "An empty list."
big = Counting(range(0, 2000000, 2))
big.reads = 0
assert binary_search(big, 1999998) == 999999, "The last of a million items."
assert big.reads <= 25, "A million items should need about 20 reads; you made " + str(big.reads)
big.reads = 0
assert binary_search(big, 777777) == -1 and big.reads <= 25, "An absent odd number, in about 20 reads."`,
            },
          ],
          solution: "def binary_search(items, target):\n    lo, hi = 0, len(items) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        value = items[mid]\n        if value == target:\n            return mid\n        if value < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n",
          hint: "lo, hi = 0, len(items) - 1. While lo <= hi: read items[mid] once into a variable, compare, and move lo or hi past mid.",
          successMessage: "About 20 reads for a million items, as log₂ 10⁶ ≈ 20 predicts. Reading items[mid] once per step also halves your reads.",
        },
      },
      {
        id: "a-al-recursive-binary-search",
        title: "Iterative versus recursive binary search",
        explain:
          "Binary search is naturally recursive: search(lo, hi) compares the middle and calls search on one half. The BASE CASES are lo > hi (absent) and items[mid] == target (found). Both versions do the same O(log n) comparisons. The difference is SPACE: the recursive version holds up to log₂ n stack frames, O(log n), while the iterative one uses O(1). The recursive call is the last thing each call does (TAIL recursion), so the two are equivalent; Python does not optimise tail calls, so iterative is preferred in practice, but the recursive form is often clearer to prove correct.",
        codeChallenge: {
          task: "Write binary_search_rec(items, target, lo=0, hi=None) RECURSIVELY: if hi is None, set it to len(items) - 1; if lo > hi return -1; otherwise compare with the middle item and return the result of a recursive call on the correct half. Use no loop.",
          starter: "def binary_search_rec(items, target, lo=0, hi=None):\n    pass\n",
          sample: "binary_search_rec([2, 4, 6, 8, 10], 8) → 3",
          tests: [
            {
              check: py`data = [2, 4, 6, 8, 10, 12, 14]
for i, v in enumerate(data):
    assert binary_search_rec(data, v) == i, f"{v} is at index {i}. Got {binary_search_rec(data, v)!r}"
assert binary_search_rec(data, 5) == -1 and binary_search_rec([], 5) == -1, "Absent target, and an empty list."
big = list(range(100000))
assert binary_search_rec(big, 99999) == 99999, "A large list: the recursion is only about 17 calls deep."
import ast
fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "binary_search_rec"][0]
assert any(isinstance(c, ast.Call) and getattr(c.func, "id", "") == "binary_search_rec" for c in ast.walk(fn)), "binary_search_rec must call itself."
assert not uses("For") and not uses("While"), "Use recursion, not a loop."`,
            },
          ],
          solution: "def binary_search_rec(items, target, lo=0, hi=None):\n    if hi is None:\n        hi = len(items) - 1\n    if lo > hi:\n        return -1\n    mid = (lo + hi) // 2\n    if items[mid] == target:\n        return mid\n    if items[mid] < target:\n        return binary_search_rec(items, target, mid + 1, hi)\n    return binary_search_rec(items, target, lo, mid - 1)\n",
          hint: "Two base cases: lo > hi returns -1, items[mid] == target returns mid. Otherwise return binary_search_rec(items, target, mid + 1, hi) or (..., lo, mid - 1).",
          successMessage: "Same comparisons, O(log n) stack frames instead of O(1) variables. Module 12 derives its recurrence, T(n) = T(n/2) + c.",
        },
      },
      {
        id: "a-al-binary-search-boundaries",
        title: "Binary search for boundaries",
        explain:
          "With duplicates, \"find any 55\" is often the wrong question. LOWER BOUND (bisect_left) finds the first index where target could be inserted keeping the list sorted, which is the first occurrence if present; UPPER BOUND (bisect_right) finds the index just after the last occurrence. Their difference counts the occurrences in O(log n). The same idea answers \"how many scores are below 50?\" and \"what is the first day the balance went negative?\": binary search works on any yes/no question that is false and then true along a sorted range. Python's bisect module implements both.",
        codeExercise: {
          language: PY,
          code: py`import bisect

scores = [40, 55, 55, 55, 70, 85]
print(bisect.bisect_left(scores, 55), bisect.bisect_right(scores, 55))
print(bisect.bisect_right(scores, 55) - bisect.bisect_left(scores, 55))
print(bisect.bisect_left(scores, 50))
`,
          question: "bisect_left gives the first position where 55 could go, bisect_right the position after the last 55. What does this print?",
          expectedOutput: "1 4\n3\n1",
          hint: "The 55s occupy indexes 1, 2 and 3. 50 would be inserted before the first 55.",
          successMessage: "Positions 1 and 4, so 3 copies of 55; and bisect_left(scores, 50) = 1 means exactly one score is below 50. Each answer took O(log n).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 9.5 – 9.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l38-jump-interpolation-exponential",
    moduleId: "al-m9-searching",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.5", "9.6", "9.7"],
    title: "Jump, Interpolation and Exponential Search",
    subtitle: "Three more ways to search sorted data",
    estimatedMinutes: 32,
    intro:
      "Binary search is not the only option for sorted data. Jump search suits data that is costly to jump around in; interpolation search guesses where the key should be; exponential search handles lists whose length is unknown.",

    atoms: [
      {
        id: "a-al-jump-search",
        title: "Jump search",
        explain:
          "JUMP SEARCH checks every m-th item (items[m − 1], items[2m − 1], ...) until it reaches a block whose last item is ≥ the target, then searches that block linearly. It makes at most n/m jumps plus m − 1 linear steps; choosing m = √n minimises the total, giving O(√n) time and O(1) space. It is slower than binary search (√10⁶ = 1,000 versus 20), but it only ever moves FORWARD and backtracks at most one block, which matters when stepping backwards is expensive, as on magnetic tape or a forward-only linked structure.",
        codeChallenge: {
          task: "Write jump_search(items, target) for a sorted list using block size step = math.isqrt(len(items)) (at least 1): jump forward block by block while the last item of the current block is less than target, then search that one block linearly. Return the index or -1. The tests count your reads: on 10,000 items you may read at most about 2√n = 200 items.",
          starter: "import math\n\ndef jump_search(items, target):\n    pass\n",
          sample: "jump_search(list(range(0, 100, 5)), 35) → 7",
          tests: [
            {
              check: COUNTING + py`small = Counting(range(0, 100, 5))
assert jump_search(small, 35) == 7, "35 is at index 7. Got " + repr(jump_search(small, 35))
assert jump_search(small, 0) == 0 and jump_search(small, 95) == 19, "First and last items."
assert jump_search(small, 36) == -1 and jump_search(small, 500) == -1, "Absent targets."
assert jump_search(Counting([]), 1) == -1 and jump_search(Counting([4]), 4) == 0, "Empty and one-item lists."
big = Counting(range(10000))
for t in [0, 4321, 9999, 10500]:
    big.reads = 0
    want = t if t < 10000 else -1
    assert jump_search(big, t) == want, f"jump_search for {t} should give {want}"
    assert big.reads <= 205, f"Searching for {t} read {big.reads} items; jump search needs at most about 2 × 100."`,
            },
          ],
          solution: "import math\n\ndef jump_search(items, target):\n    n = len(items)\n    if n == 0:\n        return -1\n    step = max(1, math.isqrt(n))\n    start = 0\n    while start < n and items[min(start + step, n) - 1] < target:\n        start += step\n    for i in range(start, min(start + step, n)):\n        if items[i] == target:\n            return i\n    return -1\n",
          hint: "Keep start = 0. While start < n and items[min(start + step, n) - 1] < target: start += step. Then scan i from start to min(start + step, n) - 1.",
          successMessage: "At most √n jumps plus √n steps: about 200 reads where linear search could need 10,000, and binary search about 14.",
        },
      },
      {
        id: "a-al-interpolation-search",
        title: "Interpolation search",
        explain:
          "Binary search always probes the middle. INTERPOLATION SEARCH probes where the target SHOULD be if values are spread evenly, the way you open a dictionary near the back for \"W\": pos = lo + (target − items[lo]) × (hi − lo) / (items[hi] − items[lo]). On uniformly distributed keys it needs only O(log log n) probes on average, about 4 or 5 for a billion items. But on skewed data its guesses are poor and it can degrade to O(n), worse than binary search. Use it only when you know the keys are roughly uniform.",
        codeExercise: {
          language: PY,
          code: py`def interpolation_probes(items, target):
    lo, hi = 0, len(items) - 1
    probes = 0
    while lo <= hi and items[lo] <= target <= items[hi]:
        probes += 1
        if items[hi] == items[lo]:
            pos = lo
        else:
            pos = lo + (target - items[lo]) * (hi - lo) // (items[hi] - items[lo])
        if items[pos] == target:
            return pos, probes
        if items[pos] < target:
            lo = pos + 1
        else:
            hi = pos - 1
    return -1, probes

uniform = list(range(0, 300000, 3))
skewed = [i ** 4 for i in range(100000)]
print("uniform:", interpolation_probes(uniform, 123456))
print("skewed:", interpolation_probes(skewed, 50 ** 4))
`,
          question: "Both lists have 100,000 sorted items. uniform is evenly spaced; skewed grows like i⁴. Binary search would need about 17 probes on either. What does interpolation search print (index, probes)?",
          expectedOutput: "uniform: (41152, 1)\nskewed: (50, 51)",
          hint: "On perfectly even spacing the first guess is exact. On i⁴ values, most of the range is huge numbers, so every guess lands too far left and moves only a little.",
          successMessage: "One probe on uniform data, 51 on skewed data: three times worse than binary search. Interpolation search's average case depends entirely on the data's distribution.",
        },
      },
      {
        id: "a-al-exponential-search",
        title: "Exponential search",
        explain:
          "EXPONENTIAL SEARCH first finds a range that must contain the target by checking indexes 1, 2, 4, 8, ... until items[bound] ≥ target (or the list ends), then binary searches between bound/2 and bound. If the target is at index i, finding the range takes about log₂ i steps and the binary search another log₂ i, so the cost is O(log i): fast when the target is near the start, and never worse than O(log n). It also works when the length is unknown or unbounded, such as a sorted stream or an \"infinite\" sorted function, which is exactly how you found max_feasible in Module 6.",
        codeChallenge: {
          task: "Write exponential_search(items, target) for a sorted list: if items[0] is the target return 0; otherwise double bound from 1 while bound < len(items) and items[bound] < target; then binary search between bound // 2 and min(bound, len(items) - 1). Return the index or -1. The tests count reads: a target near the start must take only a few.",
          starter: "def exponential_search(items, target):\n    pass\n",
          sample: "exponential_search(list(range(100)), 70) → 70",
          tests: [
            {
              check: COUNTING + py`data = Counting(range(0, 200, 2))
for t, want in [(0, 0), (2, 1), (70, 35), (198, 99), (71, -1), (500, -1), (-4, -1)]:
    assert exponential_search(data, t) == want, f"exponential_search for {t} should give {want}, got {exponential_search(data, t)!r}"
assert exponential_search(Counting([]), 3) == -1, "An empty list."
big = Counting(range(1000000))
big.reads = 0
assert exponential_search(big, 5) == 5 and big.reads <= 12, "Index 5 in a million items should take only a handful of reads; you made " + str(big.reads)
big.reads = 0
assert exponential_search(big, 999999) == 999999 and big.reads <= 50, "Even the last item stays O(log n). Reads: " + str(big.reads)`,
            },
          ],
          solution: "def exponential_search(items, target):\n    n = len(items)\n    if n == 0:\n        return -1\n    if items[0] == target:\n        return 0\n    bound = 1\n    while bound < n and items[bound] < target:\n        bound *= 2\n    lo, hi = bound // 2, min(bound, n - 1)\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        value = items[mid]\n        if value == target:\n            return mid\n        if value < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n",
          hint: "Doubling stops at the first bound where items[bound] >= target or bound runs past the end. The target can then only be between bound // 2 and min(bound, n - 1).",
          successMessage: "A handful of reads for index 5 in a million items, and about 40 for the very last one. The cost follows the target's position, not the list's length.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 9.8 – 9.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l39-choosing-search",
    moduleId: "al-m9-searching",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.8", "9.9", "9.10", "9.11"],
    title: "Comparing and Choosing Searching Algorithms",
    subtitle: "Sorted or unsorted, once or many times",
    estimatedMinutes: 28,
    intro:
      "Each searching algorithm wins somewhere. This lesson compares them all, on paper and by measurement, and turns the comparison into rules for choosing.",

    atoms: [
      {
        id: "a-al-sorted-vs-unsorted",
        title: "Searching in sorted versus unsorted data",
        explain:
          "On UNSORTED data, every correct search must, in the worst case, examine every item: an item you did not look at could be the target. So linear search's O(n) is optimal there. SORTED data lets you discard part of the list with each comparison, which is what makes O(log n) possible. Sorting costs O(n log n), so it pays only when you search many times: k linear searches cost about k · n, while sorting once and binary searching k times costs about n log n + k log n. Sorting wins once k exceeds roughly log n searches, about 20 for a million items.",
        codeExercise: {
          language: PY,
          code: py`def linear_steps(items, target):
    steps = 0
    for x in items:
        steps += 1
        if x == target:
            break
    return steps

def binary_steps(items, target):
    lo, hi, steps = 0, len(items) - 1, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        steps += 1
        if items[mid] == target:
            break
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return steps

data = list(range(1, 1000001))
for t in [1, 500000, 1000000]:
    print(t, linear_steps(data, t), binary_steps(data, t))
`,
          question: "This compares linear and binary search on a sorted list of a million numbers, for targets at the start, the middle and the end. What does it print (target, linear steps, binary steps)?",
          expectedOutput: "1 1 19\n500000 500000 1\n1000000 1000000 20",
          hint: "Linear search's steps equal the target's position. Binary search's first probe is the middle, 500000; the ends take about log₂ 10⁶ ≈ 20.",
          successMessage: "Linear search wins only for the very first item; binary search never needs more than 20. On large sorted datasets the comparison is not close.",
        },
      },
      {
        id: "a-al-comparing-searching",
        title: "Comparing searching algorithms: a product lookup system",
        explain:
          "The table compares every method in this module. Space is O(1) for all the iterative versions; recursive binary search uses O(log n) stack. A HASH TABLE beats them all for exact-key lookup, O(1) on average, but it cannot answer ordered questions (\"all prices between ₦5,000 and ₦10,000\"), which sorted data with binary search can.",
        table: {
          caption: "Searching algorithms compared.",
          headers: ["Algorithm", "Requires", "Average time", "Worst time", "Extra space"],
          rows: [
            ["Linear search", "Nothing", "O(n)", "O(n)", "O(1)"],
            ["Binary search", "Sorted, random access", "O(log n)", "O(log n)", "O(1) iterative, O(log n) recursive"],
            ["Jump search", "Sorted", "O(√n)", "O(√n)", "O(1)"],
            ["Interpolation search", "Sorted, roughly uniform", "O(log log n)", "O(n)", "O(1)"],
            ["Exponential search", "Sorted (length may be unknown)", "O(log i)", "O(log n)", "O(1)"],
            ["Hash table lookup", "A hash table built in O(n)", "O(1)", "O(n)", "O(n) for the table"],
          ],
        },
        codeChallenge: {
          task: "Build a product lookup system. ProductCatalog(products) receives a list of (code, name, price) tuples and prepares them ONCE; find(code) returns (name, price) or None. The test makes 20,000 lookups in 20,000 products, so scanning the list on every call is too slow: prepare a dict (or a sorted list for binary search) in __init__.",
          starter: "class ProductCatalog:\n    def __init__(self, products):\n        self.products = products\n\n    def find(self, code):\n        pass\n",
          sample: "ProductCatalog([(\"P1\", \"Rice 5kg\", 9500)]).find(\"P1\") → (\"Rice 5kg\", 9500)",
          tests: [
            {
              check: py`cat = ProductCatalog([("P1", "Rice 5kg", 9500), ("P7", "Palm oil 1L", 2800), ("P3", "Garri 2kg", 3100)])
assert cat.find("P7") == ("Palm oil 1L", 2800), "P7 is palm oil at 2800. Got " + repr(cat.find("P7"))
assert cat.find("P9") is None, "An unknown code returns None."
items = [("SKU" + str(i), "Item " + str(i), i * 10) for i in range(20000)]
big = ProductCatalog(items)
found = 0
for i in range(0, 40000, 2):
    if big.find("SKU" + str(i)) is not None:
        found += 1
assert found == 10000, "Half of the 20,000 codes looked up exist."
assert big.find("SKU19999") == ("Item 19999", 199990), "The last product."`,
            },
          ],
          solution: "class ProductCatalog:\n    def __init__(self, products):\n        self.by_code = {}\n        for code, name, price in products:\n            self.by_code[code] = (name, price)\n\n    def find(self, code):\n        return self.by_code.get(code)\n",
          hint: "In __init__, build self.by_code = {code: (name, price)} once. Then find is self.by_code.get(code).",
          successMessage: "O(n) preparation once, then O(1) per lookup. Preparing data for the queries you expect is the heart of choosing a search technique.",
        },
      },
      {
        id: "a-al-choosing-search",
        title: "Choosing the appropriate searching technique",
        explain:
          "A short decision procedure. Is the data unsorted and searched once? Linear search. Searched many times by an exact key? Build a hash table. Need ordered queries (ranges, nearest value, first ≥ x)? Keep it sorted and use binary search (or a balanced search tree if it changes often). Sorted and known to be uniformly distributed? Interpolation search can be faster. Sorted but of unknown length, or the target is likely near the start? Exponential search. Forward-only access? Jump search. And on very small collections (a few dozen items), linear search is usually fastest in practice because of its tiny constant factor.",
        decision: {
          scenario: "An exam office keeps 50,000 results sorted by score and is asked many times a day: \"How many students scored between 60 and 69?\"",
          question: "Which technique answers each question best?",
          options: [
            {
              id: "a",
              text: "Two binary searches for the boundaries (lower bound of 60, lower bound of 70) and subtract the indexes: O(log n)",
              why: "Sorted data plus boundary search answers any range-count question in O(log n), with no scan.",
            },
            { id: "b", text: "A hash table keyed by score", whyWrong: "Hash tables answer exact keys, not ranges; you would have to look up every score from 60 to 69, and scores could be fractional." },
            { id: "c", text: "Linear search counting matches", whyWrong: "Correct but O(n) for every question, when the data is already sorted." },
            { id: "d", text: "Interpolation search", whyWrong: "Scores are not uniform, and finding one value does not count a range." },
          ],
          correct: "a",
          aftermath: "Range questions are where sorted data beats hash tables.",
        },
      },
    ],

    task: {
      title: "Module 9 practice: four search projects",
      intro: "Build each one in VS Code with test data of your own, and state its time and space complexity.",
      prompts: [
        "Build a student record search system: search by matric number (exact, using a dict), and by surname prefix (linear).",
        "Implement a contact search application with case-insensitive partial matching and results in alphabetical order.",
        "Compare linear and binary search using large datasets: time 1,000 searches on sorted lists of 10,000, 100,000 and 1,000,000 items, and tabulate the results.",
        "Create a product lookup system that supports lookup by code (hash table) and \"all products between two prices\" (sorted list plus binary search).",
      ],
      closing: "Binary search needed sorted data. Module 10 is how data gets sorted.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
