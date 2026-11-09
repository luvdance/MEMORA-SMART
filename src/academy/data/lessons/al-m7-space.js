/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 7 · SPACE COMPLEXITY
 *
 * Curriculum 7.1 – 7.14. Space complexity, auxiliary versus input space,
 * constant, linear and quadratic space, memory allocation, variables and
 * arrays, recursion stack space, in-place algorithms, time-space trade-offs
 * and memory-efficient (streaming) algorithms. The practical exercises
 * (two array reversals, stack usage of recursion, in-place reversal) are
 * written and checked here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s7-space";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 7.1 – 7.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l26-space-complexity",
    moduleId: "al-m7-space",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3", "7.4"],
    title: "Space Complexity",
    subtitle: "How much memory, as a function of n",
    estimatedMinutes: 22,
    intro:
      "Time is not the only cost. An algorithm that needs a second copy of a billion-row table may be fast and still impossible to run. Space complexity measures memory the way time complexity measures steps.",

    atoms: [
      {
        id: "a-al-space-def",
        title: "What is space complexity?",
        explain:
          "The SPACE COMPLEXITY S(n) of an algorithm is the amount of memory it needs as a function of the input size n, measured in memory cells (one number, one reference, one character) rather than bytes, so that the result does not depend on the machine. It is expressed with the same notation as time: O(1), O(log n), O(n), O(n²). Memory comes from variables, data structures the algorithm creates (copies, result lists, tables, sets), and the call stack of recursive functions.",
        table: {
          caption: "Where an algorithm's memory goes.",
          headers: ["Source", "Example", "Space"],
          rows: [
            ["Simple variables", "total, i, best", "O(1)"],
            ["A copy or a result of size n", "reversed copy, sorted copy, list of matches", "O(n)"],
            ["A set or dict of seen items", "duplicate detection with a set", "O(n)"],
            ["An n × n table", "adjacency matrix, pairwise distances", "O(n²)"],
            ["Recursion depth d", "recursive sum (d = n), recursive binary search (d = log n)", "O(d)"],
          ],
        },
      },
      {
        id: "a-al-time-vs-space",
        title: "Time complexity versus space complexity",
        explain:
          "Time counts operations; space counts memory cells in use AT ONCE (the peak), and memory can be reused, while time always accumulates. So an algorithm can take O(n²) time in O(1) space (checking every pair with two indexes), but it cannot use more space than time, because each cell must be written at least once. Two algorithms with the same time complexity can differ in space: reversing a list by building a new one and reversing it by swapping in place both take O(n) time, but need O(n) and O(1) extra space respectively.",
        decision: {
          scenario: "has_duplicate can be written three ways: (1) compare every pair; (2) sort a copy, then check neighbours; (3) keep a set of values seen so far.",
          question: "Which correctly lists their time and extra space?",
          options: [
            {
              id: "a",
              text: "(1) O(n²) time, O(1) space; (2) O(n log n) time, O(n) space; (3) O(n) average time, O(n) space",
              why: "Each faster method pays in memory: the sorted copy and the set each hold up to n items.",
            },
            { id: "b", text: "All three are O(n) time and O(1) space", whyWrong: "Only the set version is linear time, and it stores up to n items." },
            { id: "c", text: "(1) is fastest because it uses no memory", whyWrong: "Using less memory does not make it faster: it is quadratic." },
            { id: "d", text: "(3) uses O(n²) space", whyWrong: "The set holds at most n values." },
          ],
          correct: "a",
          aftermath: "Time and space must be reported separately. Lesson 29 studies these trade-offs directly.",
        },
      },
      {
        id: "a-al-auxiliary-space",
        title: "Auxiliary space versus input space",
        explain:
          "TOTAL space = INPUT space (the memory holding the input itself) + AUXILIARY space (the extra memory the algorithm uses). Because every algorithm must at least hold its input, total space is always at least O(n) for an input of size n and does not distinguish algorithms. So space complexity is usually reported as AUXILIARY space. Building a reversed copy of a list uses O(n) auxiliary space; reversing it in place uses O(1). When a question says \"space complexity\", check whether it means total or auxiliary; most textbooks and examiners mean auxiliary.",
        codeChallenge: {
          task: "Write reverse_copy(items) that returns a NEW list with the items in reverse order and leaves the original unchanged, using a loop. Do not use slicing with [::-1], reversed() or .reverse(). (This version uses O(n) auxiliary space.)",
          starter: "def reverse_copy(items):\n    pass\n",
          sample: "reverse_copy([1, 2, 3]) → [3, 2, 1]",
          tests: [
            {
              check: py`data = [1, 2, 3, 4]
out = reverse_copy(data)
assert out == [4, 3, 2, 1], "reverse_copy([1, 2, 3, 4]) should be [4, 3, 2, 1]. Got " + repr(out)
assert data == [1, 2, 3, 4], "The original list must not change."
assert out is not data, "Return a new list, not the original."
assert reverse_copy([]) == [] and reverse_copy(["a"]) == ["a"], "Empty and one-item lists."
assert "[::-1]" not in source.replace(" ", "") and not calls("reversed") and not calls("reverse"), "Build the reversed list with a loop."`,
            },
          ],
          solution: "def reverse_copy(items):\n    result = []\n    for i in range(len(items) - 1, -1, -1):\n        result.append(items[i])\n    return result\n",
          hint: "Loop i from len(items) - 1 down to 0 with range(len(items) - 1, -1, -1), appending items[i] to a new list.",
          successMessage: "O(n) time and O(n) auxiliary space: the new list holds n items. In Lesson 28 you will do the same job with O(1) extra space.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 7.5 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l27-space-classes",
    moduleId: "al-m7-space",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.5", "7.6", "7.7", "7.8", "7.9", "7.10"],
    title: "Constant, Linear and Quadratic Space, and Memory",
    subtitle: "How variables and arrays use memory",
    estimatedMinutes: 26,
    intro:
      "Most algorithms fall into three space classes: a fixed handful of variables, something proportional to the input, or a table proportional to its square. Knowing how memory is allocated tells you which is which.",

    atoms: [
      {
        id: "a-al-constant-linear-space",
        title: "Constant and linear space complexity",
        explain:
          "CONSTANT space, O(1), means a fixed number of variables whatever n is: summing a list, finding a maximum, linear search, and swapping in place all keep only a few numbers and indexes. LINEAR space, O(n), means the extra memory grows in proportion to n: copying a list, building a list of results, storing every item in a set or dict, merge sort's temporary array, and a recursion n calls deep. A program's loop counter and accumulator are O(1); anything that grows with each item is O(n).",
        decision: {
          scenario: "Four functions each take a list of n numbers.",
          question: "Which one uses O(1) auxiliary space?",
          options: [
            { id: "a", text: "evens(items): returns [x for x in items if x % 2 == 0]", whyWrong: "The result list can hold up to n items: O(n)." },
            { id: "b", text: "count_evens(items): adds 1 to a counter for each even number", why: "One counter and the loop variable, however long the list: O(1)." },
            { id: "c", text: "unique(items): returns set(items)", whyWrong: "The set can hold up to n values: O(n)." },
            { id: "d", text: "sorted_copy(items): returns sorted(items)", whyWrong: "sorted() builds a new list of n items: O(n)." },
          ],
          correct: "b",
          aftermath: "Counting is O(1) space; collecting is O(n). If you only need a number, do not build a list.",
        },
      },
      {
        id: "a-al-quadratic-space",
        title: "Quadratic space complexity",
        explain:
          "QUADRATIC space, O(n²), comes from tables indexed by two things of size n: an adjacency matrix for a graph of n vertices, a table of all pairwise distances, the dynamic programming table for comparing two strings of length n (Module 14). It grows fast: an n × n table of 8-byte numbers for n = 100,000 needs 8 × 10¹⁰ bytes, about 80 GB. When only one row of a table is needed at a time, keeping just that row reduces O(n²) space to O(n), a standard optimisation you will apply in Module 14.",
        codeExercise: {
          language: PY,
          code: py`points = list(range(50))
table = [[abs(a - b) for b in points] for a in points]
print(len(table) * len(table[0]), table[3][10])
`,
          question: "This stores the distance between every pair of 50 points on a line. How many cells does the table hold, and what is table[3][10]?",
          expectedOutput: "2500 7",
          hint: "50 rows of 50 cells. table[a][b] is |a − b|.",
          successMessage: "2,500 cells for 50 points: n². For 50,000 points it would be 2.5 billion cells.",
        },
      },
      {
        id: "a-al-memory-allocation",
        title: "Memory allocation, variables and arrays",
        explain:
          "When a function runs, its local variables live in a STACK FRAME that is freed when it returns; data that must outlive the call (lists, objects) is allocated on the HEAP. A variable holding a number is one cell; an ARRAY of n elements is a contiguous block of n cells, so element i is found by address arithmetic (start + i × item size) in O(1). A low-level array of 4-byte integers needs 4n bytes. A Python list is a DYNAMIC ARRAY of references (8 bytes each on a 64-bit machine) that over-allocates spare capacity so that append is O(1) on average; each item is a separate object on the heap. Space analysis counts cells and ignores these constant factors, but they matter when estimating real memory.",
        codeExercise: {
          language: PY,
          code: py`from array import array

ints = array("i", [0]) * 1000
floats = array("d", [0.0]) * 1000
print(ints.itemsize, ints.itemsize * len(ints))
print(floats.itemsize, floats.itemsize * len(floats))
`,
          question: "array stores raw numbers contiguously, like a C array. \"i\" is a 4-byte integer and \"d\" an 8-byte float. What does this print?",
          expectedOutput: "4 4000\n8 8000",
          hint: "itemsize is bytes per element; multiply by 1,000 elements.",
          successMessage: "Same O(n) space class, but a factor of 2 apart in bytes. Analysis gives the class; the item size gives the real memory.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 7.11 – 7.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l28-stack-in-place",
    moduleId: "al-m7-space",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.11", "7.12"],
    title: "Recursive Stack Space and In-Place Algorithms",
    subtitle: "The hidden memory of recursion, and algorithms that need none",
    estimatedMinutes: 26,
    intro:
      "Recursion looks memory-free but is not: every waiting call occupies a stack frame. In-place algorithms go the other way, transforming their input with only a few extra variables.",

    atoms: [
      {
        id: "a-al-recursive-stack-space",
        title: "Recursive stack space",
        explain:
          "Each recursive call that has not yet returned holds a stack frame with its parameters and local variables. The space used by recursion is therefore proportional to the maximum DEPTH of the recursion (the longest chain of calls active at once), not the total number of calls. A recursive sum over n items is n calls deep: O(n) space, though an equivalent loop needs O(1). Recursive binary search is log₂ n deep: O(log n). Naive recursive Fibonacci makes exponentially many calls, but its depth is only n, so it uses O(n) space. Python limits recursion depth to about 1,000 by default; going deeper raises RecursionError.",
        codeExercise: {
          language: PY,
          code: py`depth = 0
max_depth = 0

def total(items, i=0):
    global depth, max_depth
    depth += 1
    max_depth = max(max_depth, depth)
    if i == len(items):
        result = 0
    else:
        result = items[i] + total(items, i + 1)
    depth -= 1
    return result

print(total(list(range(100))), max_depth)
`,
          question: "This recursive sum tracks how many calls are active at once. What does it print for a list of 100 items?",
          expectedOutput: "4950 101",
          hint: "There is one call for each index 0 to 99, plus the base-case call at index 100, all active together.",
          successMessage: "101 frames on the stack at the deepest point: O(n) space for a sum that a loop does in O(1).",
        },
      },
      {
        id: "a-al-in-place",
        title: "In-place algorithms",
        explain:
          "An IN-PLACE algorithm transforms its input using only O(1) auxiliary space (some definitions allow O(log n), for a recursion stack). It overwrites the input instead of building a new structure. Reversing a list in place uses two indexes, one at each end, swapping the items and moving the indexes towards each other until they meet: n/2 swaps, O(n) time, and only two index variables. In-place algorithms matter when the data is large relative to memory, and the price is that the original order is lost.",
        codeChallenge: {
          task: "Write reverse_in_place(items) that reverses the list IT IS GIVEN by swapping items from both ends towards the middle. Return nothing. Do not build another list, and do not use .reverse(), reversed() or slicing.",
          starter: "def reverse_in_place(items):\n    pass\n",
          sample: "data = [1, 2, 3, 4, 5]\nreverse_in_place(data)\ndata → [5, 4, 3, 2, 1]",
          tests: [
            {
              check: py`data = [1, 2, 3, 4, 5]
original = data
result = reverse_in_place(data)
assert data == [5, 4, 3, 2, 1], "After reverse_in_place, data should be [5, 4, 3, 2, 1]. It is " + repr(data)
assert data is original and result is None, "Change the given list itself and return nothing."
even = [1, 2, 3, 4]
reverse_in_place(even)
assert even == [4, 3, 2, 1], "An even-length list: [4, 3, 2, 1]."
empty = []
reverse_in_place(empty)
one = [9]
reverse_in_place(one)
assert empty == [] and one == [9], "Empty and one-item lists stay the same."
compact = source.replace(" ", "")
assert not calls("reverse") and not calls("reversed") and "[::" not in compact and not calls("list") and "=[]" not in compact, "Swap in place: no new list, no .reverse(), reversed() or slicing."`,
            },
          ],
          solution: "def reverse_in_place(items):\n    left, right = 0, len(items) - 1\n    while left < right:\n        items[left], items[right] = items[right], items[left]\n        left += 1\n        right -= 1\n",
          hint: "left, right = 0, len(items) - 1. While left < right: swap items[left] and items[right], then move left up and right down.",
          successMessage: "n/2 swaps with two index variables: O(n) time, O(1) auxiliary space. Compare reverse_copy from Lesson 26: same time, n times the memory.",
        },
      },
      {
        id: "a-al-sorting-memory",
        title: "The additional memory of sorting methods",
        explain:
          "Sorting algorithms differ sharply in auxiliary space. Bubble, selection, insertion and heap sort are in place: O(1). Quick sort is in place apart from its recursion stack: O(log n) on average, O(n) in the worst case. Merge sort needs a temporary array: O(n). Counting sort needs a count array the size of the value range k: O(k). In Python, list.sort() sorts the list in place, while sorted() returns a new list (O(n) extra) and leaves the original untouched; both use Timsort, which may use up to n/2 temporary space internally.",
        table: {
          caption: "Auxiliary space of common sorting algorithms (Module 10 implements each).",
          headers: ["Algorithm", "Auxiliary space", "In place?"],
          rows: [
            ["Bubble, selection, insertion sort", "O(1)", "Yes"],
            ["Heap sort", "O(1)", "Yes"],
            ["Quick sort", "O(log n) average stack, O(n) worst", "Yes (apart from the stack)"],
            ["Merge sort", "O(n)", "No"],
            ["Counting sort (values 0 to k)", "O(n + k)", "No"],
          ],
        },
        decision: {
          scenario: "An embedded device must sort 50,000 sensor readings and has almost no memory to spare beyond the readings themselves.",
          question: "Which sorting algorithm fits best?",
          options: [
            { id: "a", text: "Merge sort", whyWrong: "It needs a second array of 50,000 items." },
            { id: "b", text: "Heap sort", why: "O(n log n) time with O(1) auxiliary space, even in the worst case." },
            { id: "c", text: "Counting sort over a huge value range", whyWrong: "Its count array is as large as the range of values." },
            { id: "d", text: "Building a sorted copy with sorted()", whyWrong: "That allocates a whole new list." },
          ],
          correct: "b",
          aftermath: "When memory is the constraint, choose an in-place algorithm with a good worst case.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 7.13 – 7.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l29-tradeoffs",
    moduleId: "al-m7-space",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.13", "7.14"],
    title: "Time-Space Trade-offs and Memory-Efficient Algorithms",
    subtitle: "Buying speed with memory, and processing data you cannot store",
    estimatedMinutes: 28,
    intro:
      "Memory and time can often be exchanged: store more to compute less, or compute more to store less. And when the data is larger than memory, streaming algorithms process it one item at a time.",

    atoms: [
      {
        id: "a-al-time-space-tradeoffs",
        title: "Time-space trade-offs",
        explain:
          "A TIME-SPACE TRADE-OFF uses extra memory to reduce running time, or the reverse. Storing previously computed results (caching, memoization, lookup tables) avoids recomputing them; storing items in a hash set turns repeated O(n) searches into O(1) lookups. In the other direction, recomputing values on demand saves memory at the cost of time. The right choice depends on which resource is scarce: on a server with plenty of memory, a cache that saves time is usually worth it; on a tiny device, it may not fit.",
        table: {
          caption: "One problem, several trade-offs: answering \"is x in the collection?\" q times.",
          headers: ["Approach", "Preparation", "Each query", "Extra space"],
          rows: [
            ["Scan the list each time", "None", "O(n)", "O(1)"],
            ["Sort once, then binary search", "O(n log n)", "O(log n)", "O(1) if sorted in place"],
            ["Build a hash set once", "O(n)", "O(1) average", "O(n)"],
          ],
        },
      },
      {
        id: "a-al-lookup-table",
        title: "Trading memory for time: the Sieve of Eratosthenes",
        explain:
          "To find every prime up to n, testing each number by trial division costs about n√n operations. The SIEVE OF ERATOSTHENES spends O(n) memory on a table of True/False flags instead: start with every number marked prime, and for each prime p (starting at 2) cross out its multiples p², p² + p, ... up to n. Whatever is never crossed out is prime. It runs in O(n log log n) time, which is almost linear, and afterwards \"is k prime?\" is a single table lookup for any k ≤ n.",
        codeChallenge: {
          task: "Write primes_up_to(n) that returns the sorted list of all primes ≤ n using the Sieve of Eratosthenes: a list of n + 1 flags, crossing out the multiples of each prime p starting from p * p. It must handle n = 20,000 quickly.",
          starter: "def primes_up_to(n):\n    pass\n",
          sample: "primes_up_to(20) → [2, 3, 5, 7, 11, 13, 17, 19]",
          tests: [
            {
              check: py`assert primes_up_to(20) == [2, 3, 5, 7, 11, 13, 17, 19], "Primes up to 20. Got " + repr(primes_up_to(20))
assert primes_up_to(1) == [] and primes_up_to(2) == [2], "No primes below 2; 2 is the first."
assert len(primes_up_to(100)) == 25, "There are 25 primes up to 100."
big = primes_up_to(20000)
assert len(big) == 2262 and big[-1] == 19997, "There are 2262 primes up to 20,000, the largest 19997."`,
            },
          ],
          solution: "def primes_up_to(n):\n    if n < 2:\n        return []\n    flags = [True] * (n + 1)\n    flags[0] = flags[1] = False\n    p = 2\n    while p * p <= n:\n        if flags[p]:\n            for multiple in range(p * p, n + 1, p):\n                flags[multiple] = False\n        p += 1\n    return [k for k in range(n + 1) if flags[k]]\n",
          hint: "flags = [True] * (n + 1); set 0 and 1 to False. For p while p * p <= n: if flags[p], set flags[m] = False for m in range(p * p, n + 1, p). Collect the k still True.",
          successMessage: "O(n) memory bought near-linear time. The table can now answer any primality question up to 20,000 in O(1).",
        },
      },
      {
        id: "a-al-memory-efficient",
        title: "Analysing memory-efficient algorithms: streaming",
        explain:
          "A STREAMING algorithm reads its input once, item by item, and keeps only O(1) (or a small amount of) state, so it can process data far larger than memory: a 100 GB log file, a live feed of transactions. The count, sum, mean, minimum and maximum can all be maintained in O(1) space. The median cannot: it requires remembering O(n) items in the worst case. In Python a GENERATOR produces items one at a time without storing them, which is how streaming code is written and tested.",
        codeChallenge: {
          task: "Write running_stats(stream) that reads the numbers from stream (an iterator: you can loop over it once, but it has no len() and cannot be indexed) and returns a tuple (count, mean, maximum) using O(1) memory. Do not store the numbers in a list. For an empty stream return (0, None, None).",
          starter: "def running_stats(stream):\n    pass\n",
          sample: "running_stats(iter([4, 8, 6])) → (3, 6.0, 8)",
          tests: [
            {
              check: py`assert running_stats(iter([4, 8, 6])) == (3, 6.0, 8), "Got " + repr(running_stats(iter([4, 8, 6])))
assert running_stats(iter([])) == (0, None, None), "An empty stream gives (0, None, None)."
assert running_stats(iter([-5, -2, -9])) == (3, -16 / 3, -2), "Negative numbers: the maximum is -2."
gen = (x % 97 for x in range(20000))
count, mean, top = running_stats(gen)
assert count == 20000 and top == 96, "A generator of 20,000 numbers: read it once, keep running totals."
assert abs(mean - sum(x % 97 for x in range(20000)) / 20000) < 1e-9, "The mean over the whole stream."
assert not calls("list") and not calls("sorted") and not calls("len"), "Keep running values; do not store or measure the stream."`,
            },
          ],
          solution: "def running_stats(stream):\n    count = 0\n    total = 0\n    maximum = None\n    for x in stream:\n        count += 1\n        total += x\n        if maximum is None or x > maximum:\n            maximum = x\n    if count == 0:\n        return 0, None, None\n    return count, total / count, maximum\n",
          hint: "Three running values: count, total and maximum (start it at None). Update all three for each x. Divide total by count at the end.",
          successMessage: "Three variables, whatever the stream's length: O(1) space. The same code would summarise a file of a billion lines.",
        },
      },
    ],

    task: {
      title: "Module 7 practice: measure the memory",
      intro: "For each exercise, state the auxiliary space in O-notation before you write any code.",
      prompts: [
        "Compare two algorithms that reverse an array: reverse_copy and reverse_in_place. State the time and auxiliary space of each.",
        "Determine the additional memory used by bubble sort, merge sort, quick sort and sorted() on a list of n items.",
        "Analyse recursive functions and their stack usage: the recursive sum, recursive binary search and naive Fibonacci. Give the maximum depth of each.",
        "Implement an in-place array reversal and an in-place rotation of a list by k positions (hint: three reversals).",
        "Compare an algorithm that uses additional storage (duplicate detection with a set) with one that modifies the existing data (sort in place, then scan). When would you choose each?",
      ],
      closing: "Module 8 introduces the data structures whose time and space costs every later algorithm depends on.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
