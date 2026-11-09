/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 13 · GREEDY ALGORITHMS
 *
 * Curriculum 13.1 – 13.14. The greedy method, the greedy-choice property and
 * optimal substructure; activity selection, fractional knapsack, coin change,
 * job sequencing, Huffman coding, minimum spanning trees with Prim and
 * Kruskal; when greedy fails, and proving it correct. The practical projects
 * (meeting scheduler, currency allocation, Huffman compression, resource
 * allocation) are written and tested here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s13-greedy";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 13.1 – 13.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l53-greedy-method",
    moduleId: "al-m13-greedy",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3", "13.4"],
    title: "The Greedy Method",
    subtitle: "Make the best choice now, and never look back",
    estimatedMinutes: 30,
    intro:
      "A greedy algorithm builds a solution one step at a time, always taking the choice that looks best at that moment and never undoing it. When it works it is fast and simple; the hard part is knowing when it works.",

    atoms: [
      {
        id: "a-al-greedy-intro",
        title: "Introduction to greedy algorithms",
        explain:
          "A GREEDY ALGORITHM makes a sequence of choices; at each step it takes the LOCALLY OPTIMAL option (the largest coin, the earliest-finishing meeting, the cheapest edge) and commits to it permanently. There is no backtracking and no exploring of alternatives, so greedy algorithms are usually fast: often just a sort followed by one pass, O(n log n). The catch: a sequence of locally best choices is not always globally best. A greedy algorithm is correct only for problems with the right structure, and that must be PROVED, not assumed.",
        table: {
          caption: "Greedy algorithms in this module.",
          headers: ["Problem", "Greedy choice", "Optimal?"],
          rows: [
            ["Activity selection", "Next activity that finishes earliest", "Yes (proved in Lesson 56)"],
            ["Fractional knapsack", "Highest value per kilogram first", "Yes"],
            ["Coin change (Naira, US coins)", "Largest note or coin that fits", "Yes for these systems, not for every system"],
            ["Job sequencing with deadlines", "Most profitable job, in its latest free slot", "Yes"],
            ["Huffman coding", "Merge the two least frequent symbols", "Yes"],
            ["Minimum spanning tree", "Cheapest safe edge", "Yes (Prim and Kruskal)"],
            ["0/1 knapsack", "Highest value per kilogram first", "No: needs dynamic programming"],
          ],
        },
      },
      {
        id: "a-al-greedy-choice-substructure",
        title: "The greedy-choice property and optimal substructure",
        explain:
          "A greedy algorithm is guaranteed optimal when the problem has two properties. The GREEDY-CHOICE PROPERTY: there is always an optimal solution that includes the greedy choice, so making it never rules out the best answer. OPTIMAL SUBSTRUCTURE: after making the choice, an optimal solution to the remaining subproblem, combined with the choice, is optimal for the whole problem. Together they justify committing step by step. Dynamic programming (Module 14) also needs optimal substructure, but not the greedy-choice property: it compares all choices instead of trusting one.",
        decision: {
          scenario: "Activity selection: the activity a₁ finishes earliest. An optimal schedule S does not contain a₁; its first activity is b. Replace b with a₁.",
          question: "What does this exchange show?",
          options: [
            {
              id: "a",
              text: "The new schedule is still valid (a₁ finishes no later than b, so it clashes with nothing after b) and has the same size, so some optimal schedule contains the greedy choice",
              why: "That is the greedy-choice property, proved by an exchange argument.",
            },
            { id: "b", text: "That greedy is wrong, because S did not contain a₁", whyWrong: "S was one optimal schedule; the exchange produces another that does contain a₁." },
            { id: "c", text: "Optimal substructure fails", whyWrong: "The exchange is about the first choice; substructure concerns the remaining subproblem." },
            { id: "d", text: "Nothing, since examples cannot prove anything", whyWrong: "This is not an example: the argument works for every S." },
          ],
          correct: "a",
          aftermath: "Exchange arguments are the standard way to prove a greedy choice safe. Lesson 56 completes the proof.",
        },
      },
      {
        id: "a-al-greedy-strategy",
        title: "Developing a greedy strategy: currency allocation",
        explain:
          "To design a greedy algorithm: 1. Cast the problem as a sequence of choices. 2. Propose candidate greedy rules (largest first, smallest first, earliest deadline, best ratio). 3. Try to BREAK each rule with a small counterexample; discard the ones that fail. 4. Prove the survivor with an exchange argument. 5. Implement it, usually as a sort plus a pass. For paying an amount with the fewest Naira notes (5, 10, 20, 50, 100, 200, 500, 1000), the rule \"take the largest note that fits, repeatedly\" survives every counterexample: note systems like this are called CANONICAL, and for them the greedy rule is optimal. It is not true of every coin system, as Lesson 56 shows.",
        codeChallenge: {
          task: "Write make_change(amount, notes) that pays amount with notes, greedily: repeatedly take the largest note that does not exceed what is left. Return the list of notes used, largest first. notes may be given in any order; amount is always payable.",
          starter: "def make_change(amount, notes):\n    pass\n",
          sample: "make_change(1850, [5, 10, 20, 50, 100, 200, 500, 1000]) → [1000, 500, 200, 100, 50]",
          tests: [
            {
              check: py`NAIRA = [5, 10, 20, 50, 100, 200, 500, 1000]
assert make_change(1850, NAIRA) == [1000, 500, 200, 100, 50], "Got " + repr(make_change(1850, NAIRA))
assert make_change(2735, NAIRA) == [1000, 1000, 500, 200, 20, 10, 5], "2735 = 1000 + 1000 + 500 + 200 + 20 + 10 + 5."
assert make_change(0, NAIRA) == [], "Nothing to pay."
assert make_change(40, NAIRA) == [20, 20], "40 = 20 + 20."
assert make_change(60, [50, 10, 20]) == [50, 10], "The notes may arrive in any order."`,
            },
          ],
          solution: "def make_change(amount, notes):\n    used = []\n    for note in sorted(notes, reverse=True):\n        while amount >= note:\n            amount -= note\n            used.append(note)\n    return used\n",
          hint: "Sort the notes from largest to smallest. For each note, while it fits, subtract it and record it.",
          successMessage: "One sort, one pass: O(k log k + number of notes). Lesson 56 shows a coin system where exactly this rule gives the wrong answer.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 13.5 – 13.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l54-classic-greedy",
    moduleId: "al-m13-greedy",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.5", "13.6", "13.7", "13.8"],
    title: "Activity Selection, Knapsack, Coins and Deadlines",
    subtitle: "Four classic greedy problems",
    estimatedMinutes: 36,
    intro:
      "These four problems are the standard repertoire of greedy algorithms, in textbooks and in examinations. Each has a simple rule, and each rule has a reason.",

    atoms: [
      {
        id: "a-al-activity-selection",
        title: "The activity selection problem: a meeting scheduler",
        explain:
          "Given activities with start and finish times and ONE room, choose the largest number of non-overlapping activities. Greedy rule: sort by FINISH time, then repeatedly take the next activity that starts no earlier than the last chosen one finishes. Finishing early leaves the most room for everything after. Other plausible rules fail: shortest first, earliest start, and fewest conflicts all have counterexamples. Sorting costs O(n log n) and the pass O(n).",
        codeChallenge: {
          task: "Build a meeting scheduler. select_meetings(meetings) receives a list of (start, finish) pairs and returns the largest set of non-overlapping meetings, chosen greedily by earliest finish time, as a list in the order chosen. A meeting may start exactly when the previous one finishes.",
          starter: "def select_meetings(meetings):\n    pass\n",
          sample: "select_meetings([(1, 4), (3, 5), (0, 6), (5, 7), (8, 9)]) → [(1, 4), (5, 7), (8, 9)]",
          tests: [
            {
              check: py`m = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16)]
got = select_meetings(m)
assert got == [(1, 4), (5, 7), (8, 11), (12, 16)], "The classic example chooses 4 meetings. Got " + repr(got)
assert select_meetings([]) == [], "No meetings."
assert select_meetings([(9, 10), (10, 11)]) == [(9, 10), (10, 11)], "Back-to-back meetings do not overlap."
assert len(select_meetings([(0, 10), (1, 2), (3, 4), (5, 6)])) == 3, "One long meeting should not block three short ones."
assert len(select_meetings([(1, 3), (2, 5), (4, 7), (6, 9), (8, 10)])) == 3, "Choosing by finish time gives 3 here."`,
            },
          ],
          solution: "def select_meetings(meetings):\n    chosen = []\n    last_finish = float(\"-inf\")\n    for start, finish in sorted(meetings, key=lambda m: m[1]):\n        if start >= last_finish:\n            chosen.append((start, finish))\n            last_finish = finish\n    return chosen\n",
          hint: "Sort by finish: sorted(meetings, key=lambda m: m[1]). Keep last_finish; take a meeting if its start >= last_finish.",
          successMessage: "Four meetings out of eleven, the maximum possible. Earliest-finish-first is optimal, and Lesson 56 proves it.",
        },
      },
      {
        id: "a-al-fractional-knapsack",
        title: "The fractional knapsack problem",
        explain:
          "A knapsack holds W kilograms; item i has value vᵢ and weight wᵢ, and you may take any FRACTION of an item (gold dust, rice, fuel). Greedy rule: take items in decreasing order of value per kilogram, vᵢ/wᵢ, filling the knapsack, and take a fraction of the first item that does not fit. Because any kilogram of a high-ratio item is worth more than any kilogram of a lower one, this is optimal. Time O(n log n) for the sort. If items cannot be split (the 0/1 knapsack), the same rule can fail badly.",
        codeChallenge: {
          task: "Write fractional_knapsack(items, capacity) where items is a list of (value, weight) pairs. Return the maximum total value, taking items in decreasing order of value/weight and a fraction of the last one if needed.",
          starter: "def fractional_knapsack(items, capacity):\n    pass\n",
          sample: "fractional_knapsack([(60, 10), (100, 20), (120, 30)], 50) → 240.0",
          tests: [
            {
              check: py`assert abs(fractional_knapsack([(60, 10), (100, 20), (120, 30)], 50) - 240) < 1e-9, "Take all of the first two and 2/3 of the third: 240. Got " + repr(fractional_knapsack([(60, 10), (100, 20), (120, 30)], 50))
assert abs(fractional_knapsack([(60, 10), (100, 20), (120, 30)], 60) - 280) < 1e-9, "Everything fits: 280."
assert fractional_knapsack([(60, 10)], 0) == 0, "No capacity, no value."
assert abs(fractional_knapsack([(10, 5), (40, 4), (30, 6), (50, 3)], 10) - 105) < 1e-9, "Ratios 2, 10, 5, 16.7: take 50, 40, then half of the 30 item: 105."`,
            },
          ],
          solution: "def fractional_knapsack(items, capacity):\n    total = 0.0\n    for value, weight in sorted(items, key=lambda it: it[0] / it[1], reverse=True):\n        if capacity <= 0:\n            break\n        take = min(weight, capacity)\n        total += value * take / weight\n        capacity -= take\n    return total\n",
          hint: "Sort by value / weight, highest first. For each item take min(weight, capacity) kilograms, adding value × taken / weight.",
          successMessage: "Greedy by ratio is optimal when items can be split. Lesson 56 shows the same rule failing when they cannot.",
        },
      },
      {
        id: "a-al-coin-job-sequencing",
        title: "Coin change and job sequencing with deadlines",
        explain:
          "COIN CHANGE (fewest coins): the largest-first rule of Lesson 53 is optimal for CANONICAL coin systems such as the Naira or the US cent; for arbitrary systems it is not (Lesson 56). JOB SEQUENCING WITH DEADLINES: each job takes one unit of time, has a deadline and a profit, and earns its profit only if finished by its deadline. Greedy rule: consider jobs in DECREASING order of profit, and place each in the LATEST free time slot at or before its deadline; if none is free, skip it. Placing a job as late as possible keeps earlier slots open for jobs with tighter deadlines. With a simple slot array it is O(n²); with a union-find structure, O(n log n).",
        codeChallenge: {
          task: "Write job_sequencing(jobs) where jobs is a list of (job_id, deadline, profit). Consider jobs by decreasing profit and put each in the latest free slot from its deadline down to 1. Return (total_profit, schedule) where schedule lists the job ids in slot order 1, 2, 3, ..., leaving out empty slots.",
          starter: "def job_sequencing(jobs):\n    pass\n",
          sample: "job_sequencing([(\"a\", 2, 100), (\"b\", 1, 19), (\"c\", 2, 27), (\"d\", 1, 25), (\"e\", 3, 15)]) → (142, [\"c\", \"a\", \"e\"])",
          tests: [
            {
              check: py`jobs = [("a", 2, 100), ("b", 1, 19), ("c", 2, 27), ("d", 1, 25), ("e", 3, 15)]
assert job_sequencing(jobs) == (142, ["c", "a", "e"]), "a in slot 2, c in slot 1, e in slot 3: profit 142. Got " + repr(job_sequencing(jobs))
assert job_sequencing([]) == (0, []), "No jobs."
assert job_sequencing([("x", 1, 5), ("y", 1, 9)]) == (9, ["y"]), "Two jobs due at time 1: keep the more profitable one."
jobs2 = [("j1", 4, 20), ("j2", 1, 10), ("j3", 1, 40), ("j4", 1, 30)]
assert job_sequencing(jobs2) == (60, ["j3", "j1"]), "Only one of the three jobs due at time 1 can be done: the most profitable."`,
            },
          ],
          solution: "def job_sequencing(jobs):\n    if not jobs:\n        return 0, []\n    max_deadline = max(d for _, d, _ in jobs)\n    slots = [None] * (max_deadline + 1)\n    total = 0\n    for job_id, deadline, profit in sorted(jobs, key=lambda j: j[2], reverse=True):\n        for t in range(deadline, 0, -1):\n            if slots[t] is None:\n                slots[t] = job_id\n                total += profit\n                break\n    return total, [j for j in slots[1:] if j is not None]\n",
          hint: "Make slots = [None] * (max_deadline + 1). For each job by decreasing profit, try t = deadline, deadline − 1, ..., 1 and use the first empty slot.",
          successMessage: "Profit first, latest slot first: 142 is the maximum for this set. Scheduling as late as possible is a recurring greedy idea.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 13.9 – 13.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l55-huffman-mst",
    moduleId: "al-m13-greedy",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.9", "13.10", "13.11", "13.12"],
    title: "Huffman Coding and Minimum Spanning Trees",
    subtitle: "Greedy compression, Prim's algorithm and Kruskal's algorithm",
    estimatedMinutes: 40,
    intro:
      "Two of the most useful greedy algorithms ever devised: Huffman coding, inside ZIP files and JPEG images, and the minimum spanning tree algorithms of Prim and Kruskal, used to design cable, pipe and road networks at the lowest cost.",

    atoms: [
      {
        id: "a-al-huffman",
        title: "Huffman coding: a file compression demonstration",
        explain:
          "Fixed-length codes spend the same number of bits on every character. HUFFMAN CODING gives frequent characters SHORT codes and rare ones long codes, and is a PREFIX code: no code is the beginning of another, so a bit stream decodes unambiguously. Greedy rule: put every character in a priority queue by frequency; repeatedly remove the TWO least frequent nodes and merge them into one node whose frequency is their sum; the final tree gives each character's code (left = 0, right = 1). With a heap this is O(n log n), and it produces the optimal prefix code. The total encoded size equals the sum of the weights of all the merged (internal) nodes.",
        code: {
          language: PY,
          code: py`import heapq

freqs = {"a": 45, "b": 13, "c": 12, "d": 16, "e": 9, "f": 5}
heap = [(w, i, ch) for i, (ch, w) in enumerate(sorted(freqs.items()))]
heapq.heapify(heap)
counter = len(heap)
while len(heap) > 1:
    w1, _, t1 = heapq.heappop(heap)
    w2, _, t2 = heapq.heappop(heap)
    heapq.heappush(heap, (w1 + w2, counter, (t1, t2)))
    counter += 1

codes = {}
def walk(tree, prefix):
    if isinstance(tree, str):
        codes[tree] = prefix or "0"
        return
    walk(tree[0], prefix + "0")
    walk(tree[1], prefix + "1")
walk(heap[0][2], "")
for ch in sorted(codes):
    print(ch, codes[ch])
print("bits:", sum(freqs[c] * len(codes[c]) for c in codes))
`,
          expectedOutput: "a 0\nb 101\nc 100\nd 111\ne 1101\nf 1100\nbits: 224",
        },
        codeChallenge: {
          task: "Write huffman_bits(freqs) that returns the total number of bits Huffman coding needs for a text with these character frequencies (a dict char → count), WITHOUT building codes: push every frequency onto a heap (heapq), and repeatedly pop the two smallest, add their sum to a running total, and push the sum back, until one node remains. A text with a single distinct character needs 1 bit per character.",
          starter: "import heapq\n\ndef huffman_bits(freqs):\n    pass\n",
          sample: "huffman_bits({\"a\": 45, \"b\": 13, \"c\": 12, \"d\": 16, \"e\": 9, \"f\": 5}) → 224",
          tests: [
            {
              check: py`assert huffman_bits({"a": 45, "b": 13, "c": 12, "d": 16, "e": 9, "f": 5}) == 224, "The textbook example needs 224 bits (a fixed 3-bit code needs 300). Got " + repr(huffman_bits({"a": 45, "b": 13, "c": 12, "d": 16, "e": 9, "f": 5}))
assert huffman_bits({"x": 1, "y": 1}) == 2, "Two characters, one bit each."
assert huffman_bits({"z": 7}) == 7, "One distinct character: 1 bit each."
text = "abracadabra"
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1
assert huffman_bits(counts) == 23, "'abracadabra' compresses to 23 bits (it is 88 bits as 8-bit ASCII)."`,
            },
          ],
          solution: "import heapq\n\ndef huffman_bits(freqs):\n    heap = list(freqs.values())\n    if len(heap) == 1:\n        return heap[0]\n    heapq.heapify(heap)\n    total = 0\n    while len(heap) > 1:\n        merged = heapq.heappop(heap) + heapq.heappop(heap)\n        total += merged\n        heapq.heappush(heap, merged)\n    return total\n",
          hint: "heap = list(freqs.values()); heapq.heapify(heap). While more than one: pop two, add their sum to total and push it back. Handle the single-character case first.",
          successMessage: "224 bits against 300 for a fixed-length code: 25% smaller. Every merge's weight is the number of bits that merge adds.",
        },
      },
      {
        id: "a-al-mst-prim",
        title: "Minimum spanning trees and Prim's algorithm",
        explain:
          "A SPANNING TREE of a connected, undirected, weighted graph connects all V vertices using exactly V − 1 edges and no cycles. A MINIMUM SPANNING TREE (MST) is one with the smallest total weight: the cheapest way to connect every town with cable. The CUT PROPERTY justifies greedy choices: for any division of the vertices into two groups, the cheapest edge crossing between them belongs to some MST. PRIM'S ALGORITHM grows one tree from a start vertex: repeatedly add the cheapest edge that connects the tree to a vertex not yet in it, using a priority queue of candidate edges. With a binary heap it runs in O(E log V).",
        code: {
          language: PY,
          code: py`import heapq

graph = {
    "A": [("B", 4), ("C", 1)],
    "B": [("A", 4), ("C", 2), ("D", 5)],
    "C": [("A", 1), ("B", 2), ("D", 8), ("E", 10)],
    "D": [("B", 5), ("C", 8), ("E", 2)],
    "E": [("C", 10), ("D", 2)],
}

def prim(graph, start):
    visited = {start}
    edges = [(w, start, v) for v, w in graph[start]]
    heapq.heapify(edges)
    tree, total = [], 0
    while edges and len(visited) < len(graph):
        w, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        visited.add(v)
        tree.append((u, v, w))
        total += w
        for nxt, wt in graph[v]:
            if nxt not in visited:
                heapq.heappush(edges, (wt, v, nxt))
    return tree, total

tree, total = prim(graph, "A")
for edge in tree:
    print(*edge)
print("total", total)
`,
          expectedOutput: "A C 1\nC B 2\nB D 5\nD E 2\ntotal 10",
        },
        why: "From A the cheapest edge is A–C (1); then the cheapest edge leaving {A, C} is C–B (2); then B–D (5), beating C–D (8); then D–E (2). Four edges for five vertices, total 10. Edges that would join two vertices already in the tree are skipped.",
      },
      {
        id: "a-al-kruskal",
        title: "Kruskal's algorithm",
        explain:
          "KRUSKAL'S ALGORITHM builds the MST from edges rather than from a vertex: SORT all edges by weight, then take each edge in order if it joins two DIFFERENT components (so it creates no cycle), until V − 1 edges are chosen. Detecting cycles efficiently needs a UNION-FIND (disjoint set) structure: find(x) returns the representative of x's component, union(a, b) merges two components. With path compression it is almost O(1) per operation, so Kruskal costs O(E log E) for the sort. Prim suits dense graphs; Kruskal suits sparse ones and edge lists.",
        codeChallenge: {
          task: "Write kruskal(n, edges) for vertices 0 to n − 1 and edges given as (weight, u, v). Sort the edges, and use a union-find with a parent list (find follows parents to the root) to add each edge that joins two different components. Return (total_weight, number_of_edges_used).",
          starter: "def kruskal(n, edges):\n    parent = list(range(n))\n\n    def find(x):\n        pass\n\n    pass\n",
          sample: "kruskal(4, [(1, 0, 1), (3, 1, 2), (2, 0, 2), (4, 2, 3)]) → (7, 3)",
          tests: [
            {
              check: py`assert kruskal(4, [(1, 0, 1), (3, 1, 2), (2, 0, 2), (4, 2, 3)]) == (7, 3), "Edges 1, 2 and 4: total 7 with 3 edges. Got " + repr(kruskal(4, [(1, 0, 1), (3, 1, 2), (2, 0, 2), (4, 2, 3)]))
g = [(4, 0, 1), (1, 0, 2), (2, 1, 2), (5, 1, 3), (8, 2, 3), (10, 2, 4), (2, 3, 4)]
assert kruskal(5, g) == (10, 4), "The Prim example graph (A..E as 0..4): the MST weighs 10 either way."
assert kruskal(1, []) == (0, 0), "One vertex needs no edges."
cycle = [(1, 0, 1), (1, 1, 2), (1, 2, 0), (5, 2, 3)]
assert kruskal(4, cycle) == (7, 3), "The third weight-1 edge would close a cycle and must be skipped."
import random
random.seed(101)
edges = [(random.randint(1, 100), random.randrange(300), random.randrange(300)) for _ in range(2000)]
edges += [(1000, i, i + 1) for i in range(299)]
total, used = kruskal(300, edges)
assert used == 299, "A connected graph on 300 vertices has an MST with 299 edges."`,
            },
          ],
          solution: "def kruskal(n, edges):\n    parent = list(range(n))\n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n\n    total = used = 0\n    for w, u, v in sorted(edges):\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            parent[ru] = rv\n            total += w\n            used += 1\n    return total, used\n",
          hint: "find(x): while parent[x] != x: x = parent[x] (optionally compress: parent[x] = parent[parent[x]]). For each edge in sorted order, if find(u) != find(v), link the roots and count the edge.",
          successMessage: "Sorted edges plus union-find: the same MST weight Prim found, from the opposite direction. Both are greedy, both are proved by the cut property.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 13.13 – 13.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l56-greedy-limits",
    moduleId: "al-m13-greedy",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.13", "13.14"],
    title: "When Greedy Fails, and Proving Greedy Correct",
    subtitle: "Counterexamples, exchange arguments and resource allocation",
    estimatedMinutes: 32,
    intro:
      "A greedy algorithm that looks right can be wrong. This lesson shows the classic failures, then the two proof techniques that establish when greedy really is optimal, and applies them to allocating lecture rooms.",

    atoms: [
      {
        id: "a-al-greedy-fails",
        title: "When greedy algorithms fail",
        explain:
          "Greedy fails when the greedy-choice property does not hold: an early choice that looks best blocks a better overall solution. COIN CHANGE with coins {1, 3, 4} and amount 6: greedy takes 4 + 1 + 1 (three coins), but 3 + 3 uses two. 0/1 KNAPSACK with capacity 50 and items (value 60, weight 10), (100, 20), (120, 30): greedy by ratio takes the first two (value 160) and cannot fit the third; the optimum is the second and third (value 220). SHORTEST PATHS with negative edges defeat Dijkstra's greedy choice (Module 15). In each case one small counterexample is enough to show that a greedy rule is not correct.",
        codeExercise: {
          language: PY,
          code: py`def greedy_coins(amount, coins):
    used = []
    for c in sorted(coins, reverse=True):
        while amount >= c:
            amount -= c
            used.append(c)
    return used

def fewest_coins(amount, coins):
    best = [[]] + [None] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and best[a - c] is not None:
                candidate = best[a - c] + [c]
                if best[a] is None or len(candidate) < len(best[a]):
                    best[a] = candidate
    return sorted(best[amount], reverse=True)

print("greedy ", greedy_coins(6, [1, 3, 4]))
print("optimal", fewest_coins(6, [1, 3, 4]))
`,
          question: "greedy_coins takes the largest coin first; fewest_coins checks every possibility (it is dynamic programming, Module 14). For 6 with coins {1, 3, 4}, what do they print?",
          expectedOutput: "greedy  [4, 1, 1]\noptimal [3, 3]",
          hint: "Greedy takes 4 first, leaving 2, which only 1s can pay. Two 3s also make 6.",
          successMessage: "Three coins against two. One counterexample proves the greedy rule wrong for this coin system; only a proof can show it right for another.",
        },
      },
      {
        id: "a-al-greedy-proofs",
        title: "Proving greedy algorithm correctness",
        explain:
          "Two standard techniques. The EXCHANGE ARGUMENT: take any optimal solution that differs from the greedy one, and show that swapping one of its choices for the greedy choice keeps it valid and no worse; repeating the swap turns it into the greedy solution, which is therefore optimal too. GREEDY STAYS AHEAD: show by induction that after each step the greedy solution is at least as good as any other solution after the same number of steps. For activity selection: the k-th activity greedy picks finishes no later than the k-th activity of ANY valid schedule (induction on k), so greedy can always fit at least as many activities.",
        decision: {
          scenario: "You must prove that sorting by finish time solves activity selection. You have shown that the greedy choice (earliest finish) is in some optimal solution.",
          question: "What completes the proof?",
          options: [
            {
              id: "a",
              text: "Optimal substructure: after choosing a₁, the remaining problem is the activities starting after a₁ finishes; by induction greedy solves it optimally, so a₁ plus that solution is optimal",
              why: "Greedy choice + optimal substructure + induction on the number of activities is a complete proof.",
            },
            { id: "b", text: "Testing it on many examples", whyWrong: "Testing cannot prove optimality for every input." },
            { id: "c", text: "Showing it runs in O(n log n)", whyWrong: "Speed says nothing about optimality." },
            { id: "d", text: "Nothing: the greedy-choice property alone is enough", whyWrong: "It only justifies the FIRST choice; the rest needs substructure and induction." },
          ],
          correct: "a",
          aftermath: "This two-part structure (safe first choice, then induction) proves every greedy algorithm in this module.",
        },
      },
      {
        id: "a-al-greedy-resource",
        title: "A resource allocation problem: lecture rooms",
        explain:
          "INTERVAL PARTITIONING: given lectures with start and end times, use the FEWEST rooms so that no two overlapping lectures share a room. Greedy rule: process lectures in order of START time; put each one in a room that has become free (its last lecture ended at or before this start), or open a new room if none is free. A min-heap of the rooms' end times finds the earliest-free room in O(log n). The number of rooms it opens equals the maximum number of lectures in progress at any one moment, and no schedule can use fewer, so it is optimal: O(n log n).",
        codeChallenge: {
          task: "Write min_rooms(lectures) where lectures is a list of (start, end) pairs. Sort by start time; keep a heap (heapq) of the end times of rooms in use; for each lecture, if the earliest-ending room is free by its start (end <= start), reuse it (pop it), then push this lecture's end. Return the number of rooms needed.",
          starter: "import heapq\n\ndef min_rooms(lectures):\n    pass\n",
          sample: "min_rooms([(9, 10), (9, 12), (11, 13)]) → 2",
          tests: [
            {
              check: py`assert min_rooms([(9, 10), (9, 12), (11, 13)]) == 2, "Two lectures start at 9; the 11 o'clock one reuses the first room. Got " + repr(min_rooms([(9, 10), (9, 12), (11, 13)]))
assert min_rooms([]) == 0, "No lectures, no rooms."
assert min_rooms([(1, 2), (2, 3), (3, 4)]) == 1, "Back-to-back lectures share one room."
assert min_rooms([(1, 5), (2, 6), (3, 7), (4, 8)]) == 4, "Four lectures all in progress at time 4."
lec = [(9, 11), (9, 13), (9, 10), (11, 14), (13, 14), (10, 13), (14, 16), (11, 12), (13, 15), (14, 16)]
assert min_rooms(lec) == 4, "This timetable needs 4 rooms: at 11:00 four lectures are running (9–13, 10–13, 11–12, 11–14)."`,
            },
          ],
          solution: "import heapq\n\ndef min_rooms(lectures):\n    ends = []\n    for start, end in sorted(lectures):\n        if ends and ends[0] <= start:\n            heapq.heappop(ends)\n        heapq.heappush(ends, end)\n    return len(ends)\n",
          hint: "for start, end in sorted(lectures): if ends and ends[0] <= start: heappop(ends). Then heappush(ends, end). The heap's final size is the answer.",
          successMessage: "The rooms opened equal the peak number of simultaneous lectures, which is a lower bound for any schedule: greedy is optimal.",
        },
      },
    ],

    task: {
      title: "Module 13 practice: greedy projects",
      intro: "For each project, state the greedy rule, try to break it with a counterexample, and then argue why it is optimal (or show that it is not).",
      prompts: [
        "Build a meeting scheduling system: one room maximising meetings, then many rooms minimising rooms used.",
        "Develop a simple currency allocation algorithm for an ATM holding limited numbers of each note. Does greedy still work when notes can run out?",
        "Implement a file compression demonstration using Huffman coding: build the codes for a paragraph of text, encode it as a bit string, decode it back, and report the compression ratio.",
        "Solve a resource allocation problem: allocate a budget across projects that can be partly funded (fractional knapsack), then when they cannot (0/1). Show where greedy breaks.",
        "Run Prim's and Kruskal's algorithms by hand on a 6-town road map, showing the order in which edges are added.",
      ],
      closing: "When greedy fails because an early choice blocks a better one, dynamic programming tries every choice, and remembers. That is Module 14.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
