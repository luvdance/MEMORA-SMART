/**
 * PYTHON PROGRAMMING · MODULE 16 · DATA STRUCTURES, ALGORITHMS AND COMPLEXITY
 *
 * Curriculum 16.1 – 16.10. Algorithm design, searching, the classic sorts,
 * stacks and queues, linked lists, recursion versus iteration, hashing, trees
 * and graphs, Big-O, and choosing efficient solutions without premature
 * optimisation. Learners implement each algorithm themselves; the checks
 * forbid the built-in shortcut where using it would skip the point.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s16-dsa";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 16.1 – 16.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l67-search",
    moduleId: "pp-m16-dsa",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2"],
    title: "Algorithm Design and Searching",
    subtitle: "Designing a method, then linear and binary search",
    estimatedMinutes: 22,
    intro:
      "An algorithm is a method; some methods are dramatically better than others. Searching is the clearest example: finding one name among a million can take a million checks, or about twenty. The difference is a better algorithm, not a faster computer.",

    atoms: [
      {
        id: "a-pp-algorithm-design",
        title: "Problem decomposition and algorithm design",
        explain:
          "Designing an algorithm: state the input and output precisely, work small examples by hand, look for a pattern or a known technique (repeat until done, halve the problem, remember what you have seen), write it as pseudocode, then trace it on the examples, including edge cases such as empty input, one item and duplicates. Only then write Python.",
        decision: {
          scenario: "You must find whether any two numbers in a list add up to a target. Your first idea checks every pair.",
          question: "What is the best next step in designing the algorithm?",
          options: [
            {
              id: "a",
              text: "Work small examples by hand and ask what information would let you avoid checking every pair, such as remembering the numbers already seen",
              why: "Examples reveal structure. Here, remembering seen numbers in a set lets one pass replace the pair check: you will build exactly this in Lesson 69.",
            },
            {
              id: "b",
              text: "Start typing code immediately and fix it as you go",
              whyWrong: "Coding before the method is clear usually produces code that works for one example and fails for others.",
            },
            {
              id: "c",
              text: "Buy a faster computer",
              whyWrong: "A better algorithm often beats faster hardware by orders of magnitude.",
            },
            {
              id: "d",
              text: "Assume the list is always short",
              whyWrong: "Edge cases and growth are part of the design, not afterthoughts.",
            },
          ],
          correct: "a",
          aftermath: "Input/output, examples, technique, pseudocode, trace. The same process works for every algorithm in this module.",
        },
      },
      {
        id: "a-pp-linear-search",
        title: "Linear search",
        explain:
          "Linear search checks items one by one from the start until it finds the target or runs out. It works on any list, sorted or not. In the worst case (the target is last or missing) it checks every item, so the time grows in direct proportion to the list length: n items, up to n checks.",
        code: {
          language: PY,
          code: 'def linear_search(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\n\nnames = ["Chi", "Ada", "Musa", "Bo"]\nprint(linear_search(names, "Musa"), linear_search(names, "Zed"))\n',
          expectedOutput: "2 -1",
        },
      },
      {
        id: "a-pp-binary-search",
        title: "Binary search",
        explain:
          "Binary search works only on a SORTED list. Look at the middle item: if it is the target, done; if the target is smaller, discard the right half; if larger, discard the left half. Each step halves what is left, so a million items need at most about 20 steps. Track the range with two indexes, low and high, and stop when low passes high.",
        trace: {
          headers: ["Step", "low", "high", "mid", "items[mid]", "Action (target 37)"],
          rows: [
            ["1", "0", "7", "3", "21", "37 > 21: low = 4"],
            ["2", "4", "7", "5", "37", "found at index 5"],
          ],
          note: "items = [3, 8, 15, 21, 30, 37, 42, 50]",
        },
        codeChallenge: {
          task: "Write binary_search(items, target) for a sorted list that returns a tuple (index, steps): the index of the target or -1 if absent, and how many middle items were examined. Do not use in, index() or a loop over every item.",
          starter: "def binary_search(items, target):\n    pass\n",
          sample: "binary_search([3, 8, 15, 21, 30, 37, 42, 50], 37) → (5, 2)",
          tests: [
            {
              check:
                'data = [3, 8, 15, 21, 30, 37, 42, 50]\n' +
                'assert binary_search(data, 37) == (5, 2), "Got " + repr(binary_search(data, 37))\n' +
                'assert binary_search(data, 3)[0] == 0 and binary_search(data, 50)[0] == 7, "Find the first and last items."\n' +
                'assert binary_search(data, 9)[0] == -1, "A missing target returns -1."\n' +
                'assert binary_search([], 5) == (-1, 0), "An empty list: (-1, 0)."\n' +
                'big = list(range(0, 2000000, 2))\n' +
                'idx, steps = binary_search(big, 1999998)\n' +
                'assert idx == 999999 and steps <= 21, "A million items should take at most about 20 steps. Took " + str(steps)\n' +
                'assert ".index(" not in source and " in items" not in source, "Implement the halving yourself."',
            },
          ],
          solution: "def binary_search(items, target):\n    low, high = 0, len(items) - 1\n    steps = 0\n    while low <= high:\n        mid = (low + high) // 2\n        steps += 1\n        if items[mid] == target:\n            return mid, steps\n        if items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1, steps\n",
          hint: "low, high = 0, len(items) - 1. While low <= high: mid = (low + high) // 2, compare, and move low or high past mid.",
          successMessage: "A million items found in at most 20 looks. That is the power of halving, and why sorted data is so valuable.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 16.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l68-sorting",
    moduleId: "pp-m16-dsa",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.3"],
    title: "Sorting Algorithms",
    subtitle: "Bubble, selection, insertion and merge sort",
    estimatedMinutes: 26,
    intro:
      "Python's sorted() is excellent and is what you should use in real code. But implementing the classic sorts teaches the core ideas of algorithm design (comparing, swapping, dividing and merging) and why some algorithms scale far better than others.",

    atoms: [
      {
        id: "a-pp-simple-sorts",
        title: "Bubble and selection sort",
        explain:
          "BUBBLE sort walks the list repeatedly, swapping neighbours that are out of order; each pass bubbles the largest remaining item to the end. SELECTION sort finds the smallest remaining item and swaps it into the next position. Both use nested loops over the list, so for n items they do roughly n² comparisons: fine for 20 items, painfully slow for a million.",
        code: {
          language: PY,
          code: 'def bubble_sort(items):\n    items = items.copy()\n    for end in range(len(items) - 1, 0, -1):\n        for i in range(end):\n            if items[i] > items[i + 1]:\n                items[i], items[i + 1] = items[i + 1], items[i]\n    return items\n\ndef selection_sort(items):\n    items = items.copy()\n    for i in range(len(items)):\n        smallest = min(range(i, len(items)), key=items.__getitem__)\n        items[i], items[smallest] = items[smallest], items[i]\n    return items\n\nprint(bubble_sort([5, 2, 9, 1]))\nprint(selection_sort([5, 2, 9, 1]))\n',
          expectedOutput: "[1, 2, 5, 9]\n[1, 2, 5, 9]",
        },
        why: "a, b = b, a swaps two values in one line, using tuple packing and unpacking. It appears in almost every sorting algorithm.",
      },
      {
        id: "a-pp-insertion-sort",
        title: "Insertion sort",
        explain:
          "Insertion sort builds a sorted section at the front. Take the next item, shift every larger item in the sorted section one place right, and drop the item into the gap. It is how most people sort a hand of cards. Still about n² in the worst case, but very fast on lists that are already nearly sorted.",
        codeChallenge: {
          task: "Write insertion_sort(items) that returns a NEW sorted list (do not change the input) using the insertion method: for each item from index 1, shift larger items in the sorted part one place to the right and insert it. Do not use sorted() or .sort().",
          starter: "def insertion_sort(items):\n    pass\n",
          sample: "insertion_sort([31, 4, 15, 9, 26]) → [4, 9, 15, 26, 31]",
          tests: [
            {
              check:
                'data = [31, 4, 15, 9, 26]\n' +
                'assert insertion_sort(data) == [4, 9, 15, 26, 31], "Got " + repr(insertion_sort(data))\n' +
                'assert data == [31, 4, 15, 9, 26], "Do not change the list passed in."\n' +
                'assert insertion_sort([]) == [] and insertion_sort([7]) == [7], "Empty and one-item lists."\n' +
                'assert insertion_sort([3, 1, 3, 2]) == [1, 2, 3, 3], "Duplicates are kept."\n' +
                'assert insertion_sort(["pear", "apple", "fig"]) == ["apple", "fig", "pear"], "It works on strings too."\n' +
                'assert not calls("sorted") and not calls("sort"), "Implement it without sorted() or .sort()."',
            },
          ],
          solution: "def insertion_sort(items):\n    result = items.copy()\n    for i in range(1, len(result)):\n        current = result[i]\n        j = i - 1\n        while j >= 0 and result[j] > current:\n            result[j + 1] = result[j]\n            j -= 1\n        result[j + 1] = current\n    return result\n",
          hint: "Copy the list. For i from 1: remember current = result[i]; while the item to the left is bigger, shift it right; then place current in the gap.",
          successMessage: "You implemented a real sorting algorithm. Python's own sort uses insertion sort inside, for short runs of data.",
        },
      },
      {
        id: "a-pp-merge-sort",
        title: "Merge sort",
        explain:
          "Merge sort uses divide and conquer. Split the list in half, sort each half (recursively, with merge sort itself), then MERGE the two sorted halves by repeatedly taking the smaller front item. A list of one item is already sorted: the base case. Because the list is halved about log₂ n times and each level does n work, merge sort takes about n log n steps: for a million items, roughly 20 million instead of a trillion.",
        codeChallenge: {
          task: "Write merge(left, right) that merges two sorted lists into one sorted list, and merge_sort(items) that returns a new sorted list using recursion and merge(). Do not use sorted() or .sort().",
          starter: "def merge(left, right):\n    pass\n\ndef merge_sort(items):\n    pass\n",
          sample: "merge([1, 4, 9], [2, 3, 10]) → [1, 2, 3, 4, 9, 10]",
          tests: [
            {
              check:
                'assert merge([1, 4, 9], [2, 3, 10]) == [1, 2, 3, 4, 9, 10], "Got " + repr(merge([1, 4, 9], [2, 3, 10]))\n' +
                'assert merge([], [5]) == [5] and merge([5], []) == [5], "Merging with an empty list."\n' +
                'assert merge_sort([38, 27, 43, 3, 9, 82, 10]) == [3, 9, 10, 27, 38, 43, 82], "Got " + repr(merge_sort([38, 27, 43, 3, 9, 82, 10]))\n' +
                'assert merge_sort([]) == [] and merge_sort([1]) == [1], "Base cases."\n' +
                'import random\n' +
                'random.seed(7)\n' +
                'data = [random.randint(0, 1000) for _ in range(500)]\n' +
                'assert merge_sort(data) == sorted(data), "merge_sort must agree with sorted() on 500 random numbers."\n' +
                'import ast\n' +
                'fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "merge_sort"][0]\n' +
                'assert any(isinstance(c, ast.Call) and getattr(c.func, "id", "") == "merge_sort" for c in ast.walk(fn)), "merge_sort should call itself on each half."\n' +
                'assert "sorted(" not in ast.unparse(fn) and ".sort(" not in source, "No sorted() or .sort() in your solution."',
            },
          ],
          solution: "def merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\ndef merge_sort(items):\n    if len(items) <= 1:\n        return items.copy()\n    mid = len(items) // 2\n    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))\n",
          hint: "merge: two indexes, take the smaller front item each time, then extend with whatever is left. merge_sort: base case for length 0 or 1, otherwise split at the middle, sort both halves, merge.",
          successMessage: "Divide, conquer, merge. You have written an n log n algorithm, tested against Python's own sort on 500 random numbers.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 16.4 – 16.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l69-structures",
    moduleId: "pp-m16-dsa",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.4", "16.5", "16.6", "16.7"],
    title: "Stacks, Queues, Linked Lists and Hashing",
    subtitle: "Classic structures, recursion versus iteration, and instant lookups",
    estimatedMinutes: 30,
    intro:
      "A data structure is a way of organising data for the operations you need. The right one turns a slow program into an instant one. These four ideas appear everywhere: undo buttons, print queues, browser history and every dictionary you have used.",

    atoms: [
      {
        id: "a-pp-stacks-queues",
        title: "Stacks and queues",
        explain:
          "A STACK is last in, first out (LIFO), like a pile of plates: push adds to the top, pop removes from the top. A Python list does this well with append() and pop(). A QUEUE is first in, first out (FIFO), like a bank queue: enqueue at the back, dequeue from the front. Use collections.deque with append() and popleft(), because list.pop(0) has to shift every remaining item.",
        code: {
          language: PY,
          code: 'from collections import deque\nhistory = []\nfor page in ["home", "courses", "python"]:\n    history.append(page)\nprint("Back to:", history.pop(), "->", history[-1])\nqueue = deque(["Ada", "Bo"])\nqueue.append("Chi")\nprint("Serving:", queue.popleft(), "| waiting:", list(queue))\n',
          expectedOutput: "Back to: python -> courses\nServing: Ada | waiting: ['Bo', 'Chi']",
        },
        codeChallenge: {
          task: "Use a stack to write is_balanced(text) that returns True if every bracket ( [ { in the text is closed by the matching ) ] } in the right order, ignoring all other characters.",
          starter: "def is_balanced(text):\n    pass\n",
          sample: "is_balanced(\"print(scores[0] + {1: 2}[1])\") → True\nis_balanced(\"(]\") → False",
          tests: [
            {
              check:
                'good = ["", "()", "print(scores[0] + {1: 2}[1])", "{[()()]}"]\n' +
                'bad = ["(", ")", "(]", "([)]", "{[}", "())("]\n' +
                'for t in good:\n' +
                '    assert is_balanced(t) is True, f"is_balanced({t!r}) should be True"\n' +
                'for t in bad:\n' +
                '    assert is_balanced(t) is False, f"is_balanced({t!r}) should be False"',
            },
          ],
          solution: 'def is_balanced(text):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in text:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack\n',
          hint: "Push opening brackets. On a closing bracket, the stack must be non-empty and its top must be the matching opener. At the end the stack must be empty.",
          successMessage: "Exactly how editors highlight your brackets and how Python itself detects \"'(' was never closed\".",
        },
      },
      {
        id: "a-pp-linked-lists",
        title: "Linked-list concepts",
        explain:
          "A linked list stores each value in a NODE that also holds a reference to the next node; the list itself only remembers the first node (the head). Adding at the front is instant (no shifting), but reaching the 500th item means following 500 links. Python's list is an array, not a linked list, but the idea of objects pointing to objects underlies trees, graphs and much more.",
        codeChallenge: {
          task: "Write class Node(value) with attributes value and next (None at first), and class LinkedList with a head attribute, push_front(value), append(value) (walk to the last node), to_list() returning the values as a Python list, and remove(value) that unlinks the first node with that value and returns True, or returns False if not found.",
          starter: "class Node:\n    pass\n\nclass LinkedList:\n    pass\n",
          sample: "ll.append(2); ll.append(3); ll.push_front(1); ll.to_list() → [1, 2, 3]",
          tests: [
            {
              check:
                'll = LinkedList()\n' +
                'assert ll.head is None and ll.to_list() == [], "A new list is empty."\n' +
                'll.append(2)\n' +
                'll.append(3)\n' +
                'll.push_front(1)\n' +
                'assert ll.to_list() == [1, 2, 3], "Got " + repr(ll.to_list())\n' +
                'assert isinstance(ll.head, Node) and ll.head.value == 1 and ll.head.next.value == 2, "Nodes must link through .next."\n' +
                'assert ll.remove(2) is True and ll.to_list() == [1, 3], "Removing from the middle."\n' +
                'assert ll.remove(1) is True and ll.to_list() == [3], "Removing the head."\n' +
                'assert ll.remove(9) is False, "A missing value returns False."',
            },
          ],
          solution: "class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def push_front(self, value):\n        node = Node(value)\n        node.next = self.head\n        self.head = node\n\n    def append(self, value):\n        node = Node(value)\n        if self.head is None:\n            self.head = node\n            return\n        current = self.head\n        while current.next is not None:\n            current = current.next\n        current.next = node\n\n    def to_list(self):\n        values = []\n        current = self.head\n        while current is not None:\n            values.append(current.value)\n            current = current.next\n        return values\n\n    def remove(self, value):\n        if self.head is None:\n            return False\n        if self.head.value == value:\n            self.head = self.head.next\n            return True\n        current = self.head\n        while current.next is not None:\n            if current.next.value == value:\n                current.next = current.next.next\n                return True\n            current = current.next\n        return False\n",
          hint: "Walking a linked list: current = self.head, then while current is not None: ... current = current.next. To remove, link the node BEFORE the target to the node after it.",
          successMessage: "Objects pointing to objects. Once that picture is clear, trees and graphs in the next lesson are the same idea with more links.",
        },
      },
      {
        id: "a-pp-recursion-iteration",
        title: "Recursion and iterative solutions",
        explain:
          "Any recursive solution can be rewritten with a loop, and vice versa. Recursion is natural for data that is itself nested (folders inside folders, menus inside menus), but each call uses memory and Python stops at about 1,000 nested calls. Iteration suits flat repetition. Some naive recursions recompute the same answer many times: recursive Fibonacci recalculates small values exponentially often, while a loop does it in n steps.",
        codeChallenge: {
          task: "A folder tree is stored as nested dictionaries: a key whose value is a dict is a folder, and a key whose value is a number is a file of that size. Write total_size(tree) RECURSIVELY, returning the total size of all files. Then write fib(n) ITERATIVELY with a loop (fib(0) = 0, fib(1) = 1), fast enough for fib(200).",
          starter: "def total_size(tree):\n    pass\n\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n",
          sample: "total_size({\"a.txt\": 10, \"docs\": {\"b.pdf\": 200, \"old\": {\"c.txt\": 5}}}) → 215",
          tests: [
            {
              check:
                'tree = {"a.txt": 10, "docs": {"b.pdf": 200, "old": {"c.txt": 5}}, "empty": {}}\n' +
                'assert total_size(tree) == 215, "Got " + repr(total_size(tree))\n' +
                'assert total_size({}) == 0, "An empty folder is 0."\n' +
                'assert [fib(i) for i in range(8)] == [0, 1, 1, 2, 3, 5, 8, 13], "Got " + repr([fib(i) for i in range(8)])\n' +
                'assert fib(200) == 280571172992510140037611932413038677189525, "fib(200) must be exact and fast (use a loop)."\n' +
                'import ast\n' +
                'fns = {n.name: n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef)}\n' +
                'assert any(isinstance(c, ast.Call) and getattr(c.func, "id", "") == "total_size" for c in ast.walk(fns["total_size"])), "total_size should be recursive."\n' +
                'assert not any(isinstance(c, ast.Call) and getattr(c.func, "id", "") == "fib" for c in ast.walk(fns["fib"])), "fib should use a loop, not recursion."',
            },
          ],
          solution: "def total_size(tree):\n    total = 0\n    for value in tree.values():\n        if isinstance(value, dict):\n            total += total_size(value)\n        else:\n            total += value\n    return total\n\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n",
          hint: "total_size: for each value, recurse into dicts, add numbers. fib: keep two variables a, b and update them n times with a, b = b, a + b.",
          successMessage: "Recursion where the data is nested, a loop where the work is repetitive. The starter's recursive fib(200) would not finish before the universe ends; your loop takes 200 steps.",
        },
      },
      {
        id: "a-pp-hashing",
        title: "Hash-based lookups",
        explain:
          "Dictionaries and sets are hash tables. A hash function turns a key into a number that says where to store it, so finding a key is effectively one step, whatever the size: O(1) on average. Checking x in a list is O(n). That is why turning a list into a set or dictionary is the most common optimisation in Python. Keys must be hashable (immutable): strings, numbers, tuples.",
        codeChallenge: {
          task: "Write two_sum(numbers, target) that returns the INDEXES (i, j) with i < j of two different items that add up to target, or None. Make it a single pass using a dictionary of value → index for the numbers seen so far (no nested loops).",
          starter: "def two_sum(numbers, target):\n    for i in range(len(numbers)):\n        for j in range(i + 1, len(numbers)):\n            if numbers[i] + numbers[j] == target:\n                return i, j\n    return None\n",
          sample: "two_sum([8, 3, 11, 5, 7], 12) → (3, 4), because 5 + 7 = 12",
          tests: [
            {
              check:
                'assert two_sum([2, 7, 11, 15], 9) == (0, 1), "Got " + repr(two_sum([2, 7, 11, 15], 9))\n' +
                'assert two_sum([8, 3, 11, 5, 7], 12) == (3, 4), "5 + 7 = 12 at indexes 3 and 4. Got " + repr(two_sum([8, 3, 11, 5, 7], 12))\n' +
                'assert two_sum([3, 3], 6) == (0, 1), "Two equal values at different indexes count."\n' +
                'assert two_sum([1, 2], 7) is None and two_sum([5], 10) is None, "No pair gives None (one item cannot pair with itself)."\n' +
                'import ast\n' +
                'loops = [n for n in ast.walk(ast.parse(source)) if isinstance(n, (ast.For, ast.While))]\n' +
                'assert len(loops) == 1, "Use exactly one loop and a dictionary."',
            },
          ],
          solution: "def two_sum(numbers, target):\n    seen = {}\n    for i, n in enumerate(numbers):\n        need = target - n\n        if need in seen:\n            return seen[need], i\n        seen[n] = i\n    return None\n",
          hint: "For each number, the partner you need is target - n. If it is already in seen, you are done; otherwise record seen[n] = i.",
          successMessage: "From n² pair checks to one pass. For 100,000 numbers that is the difference between five billion checks and a hundred thousand.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 16.8 – 16.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l70-graphs-bigo",
    moduleId: "pp-m16-dsa",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["16.8", "16.9", "16.10"],
    title: "Trees, Graphs and Big-O",
    subtitle: "Connected data, measuring growth, and choosing wisely",
    estimatedMinutes: 28,
    intro:
      "The last ideas of the module: data shaped as trees and networks, a vocabulary for how an algorithm's cost grows with its input, and the judgement to know when that growth matters and when it does not.",

    atoms: [
      {
        id: "a-pp-trees-graphs",
        title: "Trees and graph fundamentals",
        explain:
          "A TREE has a root and children, each child with its own children, and no loops: folders, an organisation chart, the HTML of a web page. A GRAPH is a set of nodes joined by edges, which may form loops: road maps, social networks, prerequisites between courses. In Python a graph is commonly a dictionary of node → list of neighbours. Breadth-first search (BFS) explores neighbours level by level using a queue, and finds the fewest-steps route.",
        code: {
          language: PY,
          code: 'from collections import deque\nroads = {\n    "Lagos": ["Ibadan", "Abeokuta"],\n    "Ibadan": ["Lagos", "Ilorin", "Abeokuta"],\n    "Abeokuta": ["Lagos", "Ibadan"],\n    "Ilorin": ["Ibadan", "Abuja"],\n    "Abuja": ["Ilorin"],\n}\nseen = {"Lagos"}\nqueue = deque(["Lagos"])\norder = []\nwhile queue:\n    city = queue.popleft()\n    order.append(city)\n    for nxt in roads[city]:\n        if nxt not in seen:\n            seen.add(nxt)\n            queue.append(nxt)\nprint(order)\n',
          expectedOutput: "['Lagos', 'Ibadan', 'Abeokuta', 'Ilorin', 'Abuja']",
        },
        codeChallenge: {
          task: "Write shortest_path(graph, start, goal) using breadth-first search that returns the list of nodes on a route with the fewest steps from start to goal (inclusive), or None if there is no route. Keep a dictionary of each node's parent so you can rebuild the path at the end.",
          starter: "from collections import deque\n\ndef shortest_path(graph, start, goal):\n    pass\n",
          sample: "shortest_path(roads, \"Lagos\", \"Abuja\") → ['Lagos', 'Ibadan', 'Ilorin', 'Abuja']",
          tests: [
            {
              check:
                'roads = {"Lagos": ["Ibadan", "Abeokuta"], "Ibadan": ["Lagos", "Ilorin", "Abeokuta"], "Abeokuta": ["Lagos", "Ibadan"], "Ilorin": ["Ibadan", "Abuja"], "Abuja": ["Ilorin"], "Calabar": []}\n' +
                'assert shortest_path(roads, "Lagos", "Abuja") == ["Lagos", "Ibadan", "Ilorin", "Abuja"], "Got " + repr(shortest_path(roads, "Lagos", "Abuja"))\n' +
                'assert shortest_path(roads, "Lagos", "Lagos") == ["Lagos"], "Start equals goal: a one-node path."\n' +
                'assert shortest_path(roads, "Lagos", "Calabar") is None, "No route gives None."\n' +
                'grid = {1: [2, 3], 2: [4], 3: [4], 4: [5], 5: []}\n' +
                'p = shortest_path(grid, 1, 5)\n' +
                'assert p is not None and len(p) == 4 and p[0] == 1 and p[-1] == 5, "Fewest steps from 1 to 5 is 4 nodes. Got " + repr(p)',
            },
          ],
          solution: "from collections import deque\n\ndef shortest_path(graph, start, goal):\n    parent = {start: None}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        if node == goal:\n            path = []\n            while node is not None:\n                path.append(node)\n                node = parent[node]\n            return path[::-1]\n        for nxt in graph.get(node, []):\n            if nxt not in parent:\n                parent[nxt] = node\n                queue.append(nxt)\n    return None\n",
          hint: "parent = {start: None} doubles as the \"seen\" set. When you reach the goal, follow parent links back to start, then reverse.",
          successMessage: "BFS with parent tracking: the core of route planners, network tools and \"people you may know\" features.",
        },
      },
      {
        id: "a-pp-big-o",
        title: "Big-O notation and time/space complexity",
        explain:
          "Big-O describes how an algorithm's cost GROWS as the input size n grows, ignoring constant factors. O(1): constant (dictionary lookup). O(log n): halving (binary search). O(n): one pass (linear search, sum). O(n log n): good sorting (merge sort, sorted()). O(n²): nested loops over the data (bubble sort, checking every pair). Space complexity is the same idea for memory.",
        table: {
          caption: "Approximate steps as n grows.",
          headers: ["Big-O", "Example", "n = 10", "n = 1,000", "n = 1,000,000"],
          rows: [
            ["O(1)", "dict lookup", "1", "1", "1"],
            ["O(log n)", "binary search", "4", "10", "20"],
            ["O(n)", "linear search", "10", "1,000", "1,000,000"],
            ["O(n log n)", "merge sort", "33", "10,000", "20,000,000"],
            ["O(n²)", "bubble sort", "100", "1,000,000", "1,000,000,000,000"],
          ],
        },
        codeExercise: {
          language: PY,
          code: "def count_steps(n):\n    steps = 0\n    for i in range(n):\n        for j in range(n):\n            steps += 1\n    return steps\n\nprint(count_steps(10), count_steps(20))\n",
          question: "This function counts the steps of a nested loop. What does it print, and notice what happens when n doubles?",
          expectedOutput: "100 400",
          hint: "The inner loop runs n times for each of the n outer passes.",
          successMessage: "Doubling n quadrupled the work: the signature of O(n²). At n = 1,000,000 it would be a trillion steps.",
        },
      },
      {
        id: "a-pp-efficient-choices",
        title: "Choosing efficient solutions without premature optimisation",
        explain:
          "Choose the right data structure and a sensible algorithm from the start; that costs nothing and avoids O(n²) traps. Beyond that, write clear code first, MEASURE (time it, or profile it) when something is actually slow, and optimise only the part that matters. \"Premature optimisation\" (making code complicated to save time that was never a problem) wastes effort and adds bugs.",
        codeChallenge: {
          task: "has_duplicates checks every pair, which is O(n²) and too slow for big lists. Rewrite it to run in O(n) using a set, keeping the same behaviour. Then write first_duplicate(items) returning the first item that appears for the second time, or None.",
          starter: "def has_duplicates(items):\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\ndef first_duplicate(items):\n    pass\n",
          sample: "first_duplicate([\"a\", \"b\", \"c\", \"b\", \"a\"]) → 'b'",
          tests: [
            {
              check:
                'assert has_duplicates([1, 2, 3, 2]) is True and has_duplicates([1, 2, 3]) is False and has_duplicates([]) is False, "Same behaviour as before."\n' +
                'assert first_duplicate(["a", "b", "c", "b", "a"]) == "b", "b is the first item seen a second time."\n' +
                'assert first_duplicate([1, 2, 3]) is None, "No duplicate gives None."\n' +
                'import time\n' +
                'big = list(range(30000))\n' +
                'start = time.perf_counter()\n' +
                'assert has_duplicates(big) is False and first_duplicate(big) is None, "Large list: no duplicates."\n' +
                'assert time.perf_counter() - start < 5, "30,000 items should take a fraction of a second with a set."\n' +
                'import ast\n' +
                'fn = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.FunctionDef) and n.name == "has_duplicates"][0]\n' +
                'assert len([n for n in ast.walk(fn) if isinstance(n, (ast.For, ast.While))]) <= 1, "No nested loops in has_duplicates."',
            },
          ],
          solution: "def has_duplicates(items):\n    return len(set(items)) != len(items)\n\ndef first_duplicate(items):\n    seen = set()\n    for item in items:\n        if item in seen:\n            return item\n        seen.add(item)\n    return None\n",
          hint: "A set removes duplicates, so compare lengths. For first_duplicate, walk the list with a seen set.",
          successMessage: "Same results, but large lists now take milliseconds instead of minutes. The right data structure is the optimisation that is never premature.",
        },
      },
    ],

    task: {
      title: "Module 16 practice: algorithms you implement and explain",
      intro: "For each, state the Big-O of your solution in a comment. The milestone is to explain why one solution may scale better than another.",
      prompts: [
        "Implement linear search, binary search, and all four sorts. Time each sort on 1,000, 5,000 and 20,000 random numbers with time.perf_counter() and tabulate the results.",
        "Balanced task queue: a scheduler that takes tasks from several workers' deques in round-robin order so no worker is starved.",
        "Simple graph traversal: model your school or neighbourhood as a graph and print BFS and DFS (depth-first, using a stack) orders from one place.",
        "Write a short paragraph comparing two of your solutions for the same task, explaining with Big-O which scales better and why.",
      ],
      closing: "Next: testing. You will prove your code works automatically, instead of trusting a manual run.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
