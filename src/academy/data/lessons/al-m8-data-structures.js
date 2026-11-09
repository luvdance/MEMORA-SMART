/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 8 · DATA STRUCTURES
 *
 * Curriculum 8.1 – 8.12. ADTs, arrays and dynamic arrays, singly, doubly and
 * circular linked lists, stacks, queues (circular and priority), hash tables,
 * binary trees and binary search trees, heaps, graphs, and choosing a
 * structure by the cost of its operations. Every structure in the
 * curriculum's practical list is implemented by the learner and tested.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s8-data-structures";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 8.1 – 8.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l30-adts-arrays",
    moduleId: "al-m8-data-structures",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3"],
    title: "Data Structures, ADTs and Dynamic Arrays",
    subtitle: "How data is organised decides how fast you can use it",
    estimatedMinutes: 26,
    intro:
      "The same algorithm can be fast or slow depending on how its data is stored. This module builds the core structures one by one, starting with the most fundamental: the array, and the dynamic array that Python's list really is.",

    atoms: [
      {
        id: "a-al-data-structures-intro",
        title: "Introduction to data structures",
        explain:
          "A DATA STRUCTURE is a way of organising data in memory so that certain operations are efficient. No structure is best at everything: an array gives O(1) access by position but O(n) insertion at the front; a linked list gives O(1) insertion at the front but O(n) access by position; a hash table gives O(1) average lookup by key but keeps no order; a balanced search tree keeps order with O(log n) operations. Choosing a data structure means choosing which operations will be cheap.",
        table: {
          caption: "The structures in this module and what each is good at.",
          headers: ["Structure", "Best at", "Weak at"],
          rows: [
            ["Array / dynamic array", "Access by index, appending", "Inserting or deleting at the front"],
            ["Linked list", "Insert/delete at a known position", "Access by index, search"],
            ["Stack", "Last-in first-out access", "Anything but the top"],
            ["Queue", "First-in first-out access", "Anything but the two ends"],
            ["Hash table", "Lookup, insert, delete by key", "Ordered traversal, range queries"],
            ["Binary search tree", "Ordered data, range queries", "Degenerates without balancing"],
            ["Heap", "Repeatedly removing the minimum", "Searching for an arbitrary item"],
            ["Graph", "Representing relationships", "(it is a model, not a container)"],
          ],
        },
      },
      {
        id: "a-al-adts",
        title: "Abstract Data Types (ADTs)",
        explain:
          "An ABSTRACT DATA TYPE specifies WHAT operations are available and what they do, without saying HOW they are implemented. The Stack ADT is: push(x), pop() returns the most recently pushed item, peek(), is_empty(). A DATA STRUCTURE is a concrete implementation of an ADT: a stack can be built on a dynamic array or on a linked list, each giving O(1) push and pop. Separating the two lets you change the implementation without changing the code that uses it, and lets you reason about an algorithm in terms of ADT operations and their costs.",
        decision: {
          scenario: "A team agrees on an interface: add(item), remove_oldest(), size(). One developer implements it with a Python list and list.pop(0); another with collections.deque and popleft().",
          question: "How should this situation be described?",
          options: [
            {
              id: "a",
              text: "Both implement the same Queue ADT with different data structures; the deque version has O(1) removal while list.pop(0) is O(n)",
              why: "The ADT fixes the operations and their meaning; the structure fixes their cost.",
            },
            { id: "b", text: "They have written two different ADTs", whyWrong: "The operations and behaviour are identical, so it is one ADT." },
            { id: "c", text: "The implementations must have identical performance", whyWrong: "Different structures give different costs for the same operation." },
            { id: "d", text: "An ADT must always be implemented with an array", whyWrong: "An ADT says nothing about implementation." },
          ],
          correct: "a",
          aftermath: "Analyse an algorithm with the ADT operations, then pick the structure that makes those operations cheap.",
        },
      },
      {
        id: "a-al-dynamic-arrays",
        title: "Arrays and dynamic arrays",
        explain:
          "A static ARRAY has a fixed size: O(1) access to element i, but it cannot grow. A DYNAMIC ARRAY (Python's list, Java's ArrayList, C++'s vector) keeps a hidden array with spare CAPACITY. Appending writes into the spare space in O(1); when it is full, it allocates an array of DOUBLE the capacity and copies every item across, which is O(n). Because the capacity doubles, those expensive copies are rare: over n appends the total copying is less than 2n, so each append costs O(1) AMORTIZED (Module 16 proves this formally). Inserting or deleting at the front shifts every item: O(n).",
        codeChallenge: {
          task: "Implement a dynamic array. DynamicArray() starts with capacity 1 and size 0, storing items in self.data (a list of length capacity, filled with None). append(x): if size == capacity, make a new data list of double the capacity, copy the size existing items across (add each copied item to self.copies), then store x. get(i) returns item i. Keep self.size, self.capacity and self.copies up to date.",
          starter: "class DynamicArray:\n    def __init__(self):\n        self.capacity = 1\n        self.size = 0\n        self.data = [None] * self.capacity\n        self.copies = 0\n\n    def append(self, x):\n        pass\n\n    def get(self, i):\n        pass\n",
          sample: "After 5 appends: capacity 8, copies 1 + 2 + 4 = 7",
          tests: [
            {
              check: py`a = DynamicArray()
for v in range(5):
    a.append(v * 10)
assert a.size == 5 and a.capacity == 8, f"After 5 appends: size 5, capacity 8. Got size {a.size}, capacity {a.capacity}"
assert [a.get(i) for i in range(5)] == [0, 10, 20, 30, 40], "get(i) should return the items in order."
assert a.copies == 7, "Resizes at sizes 1, 2 and 4 copy 1 + 2 + 4 = 7 items. Counted " + repr(a.copies)
assert len(a.data) == a.capacity, "data must be a list of length capacity."
b = DynamicArray()
for v in range(1000):
    b.append(v)
assert b.capacity == 1024 and b.copies == 1023, "1000 appends: capacity 1024 and 1023 copies, fewer than 2n. Got " + repr((b.capacity, b.copies))
assert b.get(999) == 999, "The last item survives every resize."`,
            },
          ],
          solution: "class DynamicArray:\n    def __init__(self):\n        self.capacity = 1\n        self.size = 0\n        self.data = [None] * self.capacity\n        self.copies = 0\n\n    def append(self, x):\n        if self.size == self.capacity:\n            self.capacity *= 2\n            new_data = [None] * self.capacity\n            for i in range(self.size):\n                new_data[i] = self.data[i]\n                self.copies += 1\n            self.data = new_data\n        self.data[self.size] = x\n        self.size += 1\n\n    def get(self, i):\n        return self.data[i]\n",
          hint: "In append: if self.size == self.capacity, double self.capacity, build [None] * self.capacity, copy items 0..size-1 (counting each), and replace self.data. Then self.data[self.size] = x; self.size += 1.",
          successMessage: "1,023 copies for 1,000 appends: the total copying stays below 2n, so appending is O(1) amortized. That is exactly how Python's list grows.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 8.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l31-linked-lists",
    moduleId: "al-m8-data-structures",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.4"],
    title: "Linked Lists",
    subtitle: "Singly, doubly and circular",
    estimatedMinutes: 28,
    intro:
      "A linked list stores each item in its own node, with a reference to the next node. Nodes can live anywhere in memory, so inserting or removing one never shifts the others.",

    atoms: [
      {
        id: "a-al-singly-linked",
        title: "Singly linked lists",
        explain:
          "A SINGLY LINKED LIST is a chain of nodes, each holding a value and a reference (next) to the following node; the list keeps a reference to the first node, the head, and the last node's next is None. Inserting at the head is O(1): make a new node point to the old head and make it the head. Finding an item or reaching position i is O(n), because you must follow the links one by one from the head. There is no O(1) access by index, which is the price of O(1) insertion.",
        codeChallenge: {
          task: "Implement a singly linked list. push_front(value) inserts at the head in O(1). find(value) returns True if the value is in the list. to_list() returns the values from head to tail as a Python list. Keep self.size up to date. Use the Node class given; do not store the values in a Python list inside LinkedList.",
          starter: "class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n        self.size = 0\n\n    def push_front(self, value):\n        pass\n\n    def find(self, value):\n        pass\n\n    def to_list(self):\n        pass\n",
          sample: "push_front(3), push_front(2), push_front(1) → to_list() == [1, 2, 3]",
          tests: [
            {
              check: py`ll = LinkedList()
for v in [3, 2, 1]:
    ll.push_front(v)
assert ll.to_list() == [1, 2, 3], "Pushing 3, 2, 1 to the front gives [1, 2, 3]. Got " + repr(ll.to_list())
assert ll.size == 3, "size should be 3."
assert ll.find(2) is True and ll.find(9) is False, "find(2) is True, find(9) is False."
assert isinstance(ll.head, Node) and ll.head.value == 1 and ll.head.next.value == 2, "The head node holds 1 and links to the node holding 2."
assert LinkedList().to_list() == [] and LinkedList().find(1) is False, "An empty list."`,
            },
          ],
          solution: "class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n        self.size = 0\n\n    def push_front(self, value):\n        self.head = Node(value, self.head)\n        self.size += 1\n\n    def find(self, value):\n        node = self.head\n        while node is not None:\n            if node.value == value:\n                return True\n            node = node.next\n        return False\n\n    def to_list(self):\n        values = []\n        node = self.head\n        while node is not None:\n            values.append(node.value)\n            node = node.next\n        return values\n",
          hint: "push_front: self.head = Node(value, self.head). find and to_list: start at node = self.head and follow node = node.next until it is None.",
          successMessage: "O(1) insertion at the head, O(n) search: the linked list's trade-off, implemented by you.",
        },
      },
      {
        id: "a-al-doubly-linked",
        title: "Doubly linked lists",
        explain:
          "A DOUBLY LINKED LIST gives every node two references: next and prev. It can be walked in both directions, and, given a reference to a node, that node can be removed in O(1) by linking its neighbours to each other (node.prev.next = node.next; node.next.prev = node.prev), with no search for the previous node. This is why an LRU (least recently used) cache combines a hash map with a doubly linked list: the map finds a node in O(1), the list moves or removes it in O(1). Python's collections.deque is built from linked blocks for the same reason.",
        codeExercise: {
          language: PY,
          code: py`class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

a, b, c = Node("A"), Node("B"), Node("C")
a.next, b.prev = b, a
b.next, c.prev = c, b

b.prev.next = b.next
b.next.prev = b.prev

node = c
while node:
    print(node.value, end=" ")
    node = node.prev
print()
`,
          question: "The list A ⇄ B ⇄ C is built, then B is removed in O(1) by relinking its neighbours. The loop walks BACKWARDS from C. What is printed?",
          expectedOutput: "C A",
          hint: "After the two relinking lines, C.prev is A and A.next is C.",
          successMessage: "C A. B was removed without searching for its predecessor, because B already knew it.",
        },
      },
      {
        id: "a-al-circular-linked",
        title: "Circular linked lists",
        explain:
          "In a CIRCULAR LINKED LIST the last node points back to the first instead of to None, so traversal can go round and round. It models anything cyclic: round-robin CPU scheduling (each process gets a turn, then the next), multiplayer turn order, and buffers that wrap around. The classic exercise is the Josephus problem: n people stand in a circle and every k-th person is removed until one remains. Walking a circular list and unlinking every k-th node solves it directly.",
        codeChallenge: {
          task: "Solve the Josephus problem. josephus(n, k) has people numbered 1 to n in a circle; counting starts at person 1, and every k-th person is removed, the count continuing from the next person, until one remains. Return the survivor's number. Simulate the circle (a circular linked list, or a list with an index that wraps around with %).",
          starter: "def josephus(n, k):\n    pass\n",
          sample: "josephus(7, 3) → 4   (removed in order: 3, 6, 2, 7, 5, 1)",
          tests: [
            {
              check: py`assert josephus(7, 3) == 4, "josephus(7, 3) should be 4. Got " + repr(josephus(7, 3))
assert josephus(1, 5) == 1, "One person survives alone."
assert josephus(5, 2) == 3, "n = 5, k = 2: removed 2, 4, 1, 5; survivor 3."
assert josephus(6, 1) == 6, "k = 1 removes people in order 1, 2, ...; the last is 6."
assert josephus(41, 3) == 31, "The historical case: 41 people, every 3rd removed. Survivor 31."`,
            },
          ],
          solution: "def josephus(n, k):\n    people = list(range(1, n + 1))\n    index = 0\n    while len(people) > 1:\n        index = (index + k - 1) % len(people)\n        people.pop(index)\n    return people[0]\n",
          hint: "Keep the people in a list and an index. Each round, index = (index + k - 1) % len(people) is the one removed; the next count starts at that same index.",
          successMessage: "The modulo makes the list behave like a circle: after the last person comes the first.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 8.5 – 8.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l32-stacks-queues",
    moduleId: "al-m8-data-structures",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.5", "8.6"],
    title: "Stacks and Queues",
    subtitle: "LIFO, FIFO, circular queues and priority queues",
    estimatedMinutes: 30,
    intro:
      "Stacks and queues restrict access to their ends, and that restriction is what makes them useful: undo histories, function calls, print jobs, and every breadth-first search in Module 15.",

    atoms: [
      {
        id: "a-al-stacks",
        title: "Stacks: push, pop and LIFO",
        explain:
          "A STACK is Last-In, First-Out (LIFO): push(x) puts x on top, pop() removes and returns the top, peek() reads it. Both are O(1) whether the stack is an array (push = append, pop = pop from the end) or a linked list (push and pop at the head). Applications: the program call stack, undo and back buttons, matching brackets, depth-first search, and evaluating POSTFIX expressions. In postfix (Reverse Polish) notation the operator follows its operands: 3 4 + 2 * means (3 + 4) × 2. Evaluate it with a stack: push numbers; on an operator, pop two, apply it, push the result.",
        codeChallenge: {
          task: "Write eval_postfix(expression) for a postfix expression of non-negative whole numbers and the operators +, - and *, separated by spaces. Use a list as a stack: push numbers; for an operator, pop the right operand first, then the left, and push left op right. Return the final number.",
          starter: "def eval_postfix(expression):\n    pass\n",
          sample: "eval_postfix(\"3 4 + 2 *\") → 14",
          tests: [
            {
              check: py`assert eval_postfix("3 4 + 2 *") == 14, "(3 + 4) × 2 = 14. Got " + repr(eval_postfix("3 4 + 2 *"))
assert eval_postfix("2 3 4 * +") == 14, "2 + (3 × 4) = 14."
assert eval_postfix("10 4 -") == 6, "Order matters for -: 10 − 4 = 6, not 4 − 10."
assert eval_postfix("5 1 2 + 4 * + 3 -") == 14, "5 + (1 + 2) × 4 − 3 = 14."
assert eval_postfix("42") == 42, "A single number."`,
            },
          ],
          solution: "def eval_postfix(expression):\n    stack = []\n    for token in expression.split():\n        if token in \"+-*\":\n            right = stack.pop()\n            left = stack.pop()\n            if token == \"+\":\n                stack.append(left + right)\n            elif token == \"-\":\n                stack.append(left - right)\n            else:\n                stack.append(left * right)\n        else:\n            stack.append(int(token))\n    return stack.pop()\n",
          hint: "for token in expression.split(): numbers go on the stack with int(token). For an operator: right = stack.pop(), left = stack.pop(), push the result.",
          successMessage: "No brackets and no precedence rules needed: the stack handles the order. Calculators and compilers evaluate expressions this way.",
        },
      },
      {
        id: "a-al-queues",
        title: "Queues: FIFO and circular queues",
        explain:
          "A QUEUE is First-In, First-Out (FIFO): enqueue(x) adds at the back, dequeue() removes from the front. On a plain array, removing from the front shifts everything (O(n)), so queues use either a linked list or a CIRCULAR array: a fixed array with a head index and a count, where the back position is (head + count) mod capacity. Both indexes wrap around the end of the array, so every operation is O(1) and no item ever moves. Queues serve print jobs, network packets, task schedulers and breadth-first search. In Python, collections.deque gives O(1) append and popleft.",
        codeChallenge: {
          task: "Implement CircularQueue(capacity) on a fixed list of length capacity, with self.head and self.count. enqueue(x) stores x at index (head + count) % capacity and returns True, or returns False if the queue is full. dequeue() returns the front item and advances head with wrap-around, or returns None if empty. size() returns count. Do not use list.pop(0), insert() or deque.",
          starter: "class CircularQueue:\n    def __init__(self, capacity):\n        self.data = [None] * capacity\n        self.capacity = capacity\n        self.head = 0\n        self.count = 0\n\n    def enqueue(self, x):\n        pass\n\n    def dequeue(self):\n        pass\n\n    def size(self):\n        pass\n",
          sample: "q = CircularQueue(3); q.enqueue(\"a\"); q.enqueue(\"b\"); q.dequeue() → \"a\"",
          tests: [
            {
              check: py`q = CircularQueue(3)
assert q.enqueue("a") and q.enqueue("b") and q.enqueue("c"), "Three items fit in capacity 3."
assert q.enqueue("d") is False, "A full queue rejects a fourth item."
assert q.dequeue() == "a" and q.size() == 2, "First in, first out: 'a' comes out first."
assert q.enqueue("d") is True, "Now there is space again."
assert [q.dequeue(), q.dequeue(), q.dequeue()] == ["b", "c", "d"], "The order is b, c, d, wrapping around the end of the array."
assert q.dequeue() is None and q.size() == 0, "An empty queue returns None."
assert len(q.data) == 3, "The array never grows."
assert not calls("pop") and not calls("insert") and not calls("deque") and "collections" not in source, "Move the head index instead of shifting items."`,
            },
          ],
          solution: "class CircularQueue:\n    def __init__(self, capacity):\n        self.data = [None] * capacity\n        self.capacity = capacity\n        self.head = 0\n        self.count = 0\n\n    def enqueue(self, x):\n        if self.count == self.capacity:\n            return False\n        self.data[(self.head + self.count) % self.capacity] = x\n        self.count += 1\n        return True\n\n    def dequeue(self):\n        if self.count == 0:\n            return None\n        item = self.data[self.head]\n        self.data[self.head] = None\n        self.head = (self.head + 1) % self.capacity\n        self.count -= 1\n        return item\n\n    def size(self):\n        return self.count\n",
          hint: "enqueue: full when count == capacity; write at (head + count) % capacity. dequeue: read data[head], then head = (head + 1) % capacity and count -= 1.",
          successMessage: "Every operation O(1), and no item ever moves. Keyboard buffers and audio streams use exactly this ring buffer.",
        },
      },
      {
        id: "a-al-priority-queues",
        title: "Priority queues",
        explain:
          "A PRIORITY QUEUE removes items in order of PRIORITY rather than arrival: the most urgent patient, the cheapest next route, the earliest deadline. Its operations are insert(x, priority) and extract_min() (or extract_max). An unsorted list gives O(1) insert but O(n) extract; a sorted list the reverse. A binary HEAP (Lesson 34) gives O(log n) for both, which is why every serious priority queue is a heap. Python's heapq module implements a min-heap on a list. Dijkstra's algorithm, Prim's algorithm, Huffman coding and event simulations all rely on priority queues.",
        code: {
          language: PY,
          code: py`import heapq

triage = []
heapq.heappush(triage, (3, "sprained ankle"))
heapq.heappush(triage, (1, "cardiac arrest"))
heapq.heappush(triage, (2, "broken arm"))
heapq.heappush(triage, (1, "severe bleeding"))

while triage:
    priority, patient = heapq.heappop(triage)
    print(priority, patient)
`,
          expectedOutput: "1 cardiac arrest\n1 severe bleeding\n2 broken arm\n3 sprained ankle",
        },
        why: "Patients leave by priority, not arrival order. Tuples compare by their first element, then by the second, so the two priority-1 patients come out alphabetically.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 8.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l33-hash-tables",
    moduleId: "al-m8-data-structures",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.7"],
    title: "Hash Tables",
    subtitle: "Hash functions, collisions and collision resolution",
    estimatedMinutes: 30,
    intro:
      "A hash table finds an item by computing where it must be, instead of searching for it. That is how Python's dict and set give O(1) average lookups, and why they are the most-used data structures in practice.",

    atoms: [
      {
        id: "a-al-hash-functions",
        title: "Hash functions",
        explain:
          "A hash table stores items in an array of m BUCKETS. A HASH FUNCTION turns a key into a bucket index: index = h(key) mod m. To find a key, compute its index and look only in that bucket. A good hash function is deterministic (the same key always gives the same index), fast, and spreads keys UNIFORMLY across the buckets. A poor one, such as adding up a word's character codes, sends every anagram to the same bucket. Real hash functions mix the characters with multiplications so that the order matters.",
        codeExercise: {
          language: PY,
          code: py`def simple_hash(word, m=10):
    return sum(ord(ch) for ch in word) % m

for w in ["cat", "act", "tac", "dog", "god"]:
    print(w, simple_hash(w))
`,
          question: "This weak hash adds the character codes and takes the remainder mod 10 (ord(\"a\") = 97, \"c\" = 99, \"t\" = 116, \"d\" = 100, \"o\" = 111, \"g\" = 103). What does it print?",
          expectedOutput: "cat 2\nact 2\ntac 2\ndog 4\ngod 4",
          hint: "99 + 97 + 116 = 312, and 100 + 111 + 103 = 314. Anagrams have the same sum.",
          successMessage: "Every anagram lands in the same bucket: a hash that ignores order causes needless collisions.",
        },
      },
      {
        id: "a-al-collisions",
        title: "Collisions and collision resolution",
        explain:
          "A COLLISION is two keys hashing to the same bucket. With more possible keys than buckets they are unavoidable (the pigeonhole principle), and they come sooner than intuition says: with 365 buckets, 23 random keys already have a better-than-even chance of a collision (the birthday paradox). Two resolution strategies: SEPARATE CHAINING keeps a list in each bucket and appends colliding keys to it; OPEN ADDRESSING (for example linear probing) stores every key in the array itself and, on a collision, tries the next bucket, then the next. Performance depends on the LOAD FACTOR α = n/m: keep it bounded (resize to double the buckets when α passes about 0.75) and operations stay O(1) on average. In the worst case, when every key collides, they degrade to O(n).",
        decision: {
          scenario: "A hash table with separate chaining has 8 buckets and now holds 400 keys. Lookups have become slow.",
          question: "What is the cause and the standard fix?",
          options: [
            {
              id: "a",
              text: "The load factor is 50, so chains average 50 keys; resize to many more buckets (and rehash every key) to bring α back below about 1",
              why: "Lookup time is proportional to chain length, about α. Doubling the buckets whenever α passes a threshold keeps it O(1) on average.",
            },
            { id: "b", text: "Hash tables are always O(n), so nothing can be done", whyWrong: "With a bounded load factor and a good hash, the average is O(1)." },
            { id: "c", text: "Sort each bucket's chain", whyWrong: "That makes chains O(log α) to search, but keeps α = 50 and adds cost to every insert." },
            { id: "d", text: "Delete half the keys", whyWrong: "The data must be kept. Resizing solves the problem." },
          ],
          correct: "a",
          aftermath: "Python's dict resizes automatically to keep its table at most two-thirds full.",
        },
      },
      {
        id: "a-al-hash-table-impl",
        title: "Building a hash table with chaining",
        explain:
          "With separate chaining, each bucket is a list of (key, value) pairs. put(key, value) computes the bucket, replaces the value if the key is already in that bucket's list, and otherwise appends the pair. get(key) computes the bucket and scans only that short list. Python's built-in hash() works for strings and numbers. With n keys spread over m buckets, each operation looks at about n/m pairs instead of n.",
        codeChallenge: {
          task: "Implement HashTable with separate chaining. __init__(self, buckets=8) makes a list of empty lists. put(key, value) stores the pair in bucket hash(key) % len(self.buckets), replacing the value if the key is already there. get(key) returns the value, or None if the key is absent. Do not use a dict or set anywhere.",
          starter: "class HashTable:\n    def __init__(self, buckets=8):\n        self.buckets = [[] for _ in range(buckets)]\n\n    def put(self, key, value):\n        pass\n\n    def get(self, key):\n        pass\n",
          sample: "t.put(\"ada\", 91); t.get(\"ada\") → 91",
          tests: [
            {
              check: py`t = HashTable()
t.put("ada", 91)
t.put("bola", 78)
assert t.get("ada") == 91 and t.get("bola") == 78, "get returns the stored values."
assert t.get("chidi") is None, "An absent key returns None."
t.put("ada", 95)
assert t.get("ada") == 95, "put on an existing key replaces its value."
assert sum(len(b) for b in t.buckets) == 2, "Updating a key must not add a second pair for it."
big = HashTable(64)
for i in range(500):
    big.put("student" + str(i), i)
assert all(big.get("student" + str(i)) == i for i in range(500)), "500 keys, all retrievable."
assert max(len(b) for b in big.buckets) < 40, "Keys should be spread across the buckets with hash(key) % len(self.buckets)."
assert not calls("dict") and not calls("set") and "{" not in source, "Build it from lists of pairs, without a dict or set."`,
            },
          ],
          solution: "class HashTable:\n    def __init__(self, buckets=8):\n        self.buckets = [[] for _ in range(buckets)]\n\n    def put(self, key, value):\n        bucket = self.buckets[hash(key) % len(self.buckets)]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)\n                return\n        bucket.append((key, value))\n\n    def get(self, key):\n        bucket = self.buckets[hash(key) % len(self.buckets)]\n        for k, v in bucket:\n            if k == key:\n                return v\n        return None\n",
          hint: "bucket = self.buckets[hash(key) % len(self.buckets)]. In put, scan the bucket for the key and replace its pair, else append (key, value). In get, scan and return the matching value.",
          successMessage: "500 keys in 64 buckets: each lookup scans about 8 pairs instead of 500. That is the hash table's whole idea.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 8.8 – 8.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l34-trees-heaps",
    moduleId: "al-m8-data-structures",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.8", "8.9"],
    title: "Trees, Binary Search Trees and Heaps",
    subtitle: "Hierarchies, ordered search and priority",
    estimatedMinutes: 34,
    intro:
      "Trees organise data hierarchically. With one ordering rule a binary tree becomes a binary search tree, giving O(log n) search on balanced data; with a different rule it becomes a heap, the engine of every priority queue.",

    atoms: [
      {
        id: "a-al-binary-trees",
        title: "Binary trees and tree traversal",
        explain:
          "A TREE is a set of nodes with one ROOT, where every other node has exactly one parent; nodes with no children are LEAVES. In a BINARY TREE each node has at most two children, left and right. The HEIGHT is the number of edges on the longest root-to-leaf path; a tree of height h holds at most 2^(h+1) − 1 nodes, so a balanced tree of n nodes has height about log₂ n. Four standard TRAVERSALS visit every node once, in O(n): PREORDER (node, left, right), INORDER (left, node, right), POSTORDER (left, right, node), and LEVEL ORDER (breadth-first, level by level, using a queue).",
        example:
          "            8\n          /   \\\n         3     10\n        / \\      \\\n       1   6      14",
        codeExercise: {
          language: PY,
          code: py`# Each node is (value, left, right); None is an empty subtree.
tree = (8, (3, (1, None, None), (6, None, None)), (10, None, (14, None, None)))

def preorder(t):
    return [] if t is None else [t[0]] + preorder(t[1]) + preorder(t[2])

def inorder(t):
    return [] if t is None else inorder(t[1]) + [t[0]] + inorder(t[2])

def postorder(t):
    return [] if t is None else postorder(t[1]) + postorder(t[2]) + [t[0]]

print(*preorder(tree))
print(*inorder(tree))
print(*postorder(tree))
`,
          question: "For the tree drawn above, what do the three traversals print, one per line?",
          expectedOutput: "8 3 1 6 10 14\n1 3 6 8 10 14\n1 6 3 14 10 8",
          hint: "Preorder visits a node before its subtrees, inorder between them, postorder after them.",
          successMessage: "Inorder printed the values sorted. That is not a coincidence: this tree is a binary search tree, which is the next atom.",
        },
      },
      {
        id: "a-al-bst",
        title: "Binary search trees",
        explain:
          "A BINARY SEARCH TREE (BST) keeps one rule at every node: every key in the left subtree is smaller than the node's key, and every key in the right subtree is larger. To SEARCH, compare with the root and go left or right, discarding a whole subtree each step; INSERT follows the same path and adds a leaf where the search ends. Both cost O(h), the height. If the tree is balanced, h ≈ log₂ n, so operations are O(log n). But inserting keys in sorted order builds a chain with h = n − 1, and every operation degrades to O(n). Self-balancing trees (AVL, red-black) rotate nodes to keep h = O(log n); they are what ordered maps in C++ and Java use. An inorder traversal of a BST lists the keys in sorted order.",
        codeChallenge: {
          task: "Using the Node class given, write insert(root, key) that inserts key into the BST rooted at root and returns the root (a new Node if root is None; ignore duplicates); contains(root, key) that returns True or False by walking left or right; and inorder(root) that returns the keys as a sorted list.",
          starter: "class Node:\n    def __init__(self, key):\n        self.key = key\n        self.left = None\n        self.right = None\n\ndef insert(root, key):\n    pass\n\ndef contains(root, key):\n    pass\n\ndef inorder(root):\n    pass\n",
          sample: "insert 8, 3, 10, 1, 6, 14 → inorder(root) == [1, 3, 6, 8, 10, 14]",
          tests: [
            {
              check: py`root = None
for k in [8, 3, 10, 1, 6, 14]:
    root = insert(root, k)
assert isinstance(root, Node) and root.key == 8, "The first key inserted becomes the root."
assert root.left.key == 3 and root.right.key == 10 and root.left.right.key == 6, "3 goes left of 8, 10 right, and 6 right of 3."
assert inorder(root) == [1, 3, 6, 8, 10, 14], "Inorder lists the keys sorted. Got " + repr(inorder(root))
assert contains(root, 6) and contains(root, 14) and not contains(root, 7), "contains(6) and contains(14) are True; contains(7) is False."
root = insert(root, 6)
assert inorder(root) == [1, 3, 6, 8, 10, 14], "Inserting a duplicate changes nothing."
assert inorder(None) == [] and contains(None, 1) is False, "An empty tree."
chain = None
for k in range(1, 101):
    chain = insert(chain, k)
depth, node = 0, chain
while node.right:
    node, depth = node.right, depth + 1
assert depth == 99, "Sorted inserts build a chain 99 edges tall: the O(n) worst case."`,
            },
          ],
          solution: "class Node:\n    def __init__(self, key):\n        self.key = key\n        self.left = None\n        self.right = None\n\ndef insert(root, key):\n    if root is None:\n        return Node(key)\n    if key < root.key:\n        root.left = insert(root.left, key)\n    elif key > root.key:\n        root.right = insert(root.right, key)\n    return root\n\ndef contains(root, key):\n    node = root\n    while node is not None:\n        if key == node.key:\n            return True\n        node = node.left if key < node.key else node.right\n    return False\n\ndef inorder(root):\n    if root is None:\n        return []\n    return inorder(root.left) + [root.key] + inorder(root.right)\n",
          hint: "insert: if root is None return Node(key); recurse into root.left if key < root.key, root.right if key > root.key; return root. contains: loop down the tree. inorder: left + [key] + right.",
          successMessage: "Search and insert follow one root-to-leaf path: O(h). The chain test shows why balancing matters: sorted input gives h = n − 1.",
        },
      },
      {
        id: "a-al-heaps",
        title: "Heaps and priority queues",
        explain:
          "A binary MIN-HEAP is a complete binary tree (every level full except possibly the last, filled left to right) in which every parent is ≤ its children, so the minimum is always at the root. Because it is complete, it is stored in a plain array with no pointers: the children of index i are 2i + 1 and 2i + 2, and its parent is (i − 1) // 2. PUSH appends the item at the end and SIFTS IT UP, swapping with its parent while it is smaller. POP takes the root, moves the last item to the root and SIFTS IT DOWN, swapping with the smaller child while it is larger. Both follow one path of height log₂ n: O(log n). Reading the minimum is O(1).",
        codeChallenge: {
          task: "Implement MinHeap on a list self.items, without the heapq module. push(x) appends x and sifts it up. pop() removes and returns the smallest item (moving the last item to the root and sifting it down), or returns None if the heap is empty. __len__ returns the number of items.",
          starter: "class MinHeap:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        pass\n\n    def pop(self):\n        pass\n\n    def __len__(self):\n        return len(self.items)\n",
          sample: "push 5, 3, 8, 1 → pop() returns 1, then 3",
          tests: [
            {
              check: py`h = MinHeap()
for x in [5, 3, 8, 1, 9, 2]:
    h.push(x)
assert h.items[0] == 1, "After pushing, the smallest item (1) must be at index 0. items = " + repr(h.items)
for i in range(1, len(h.items)):
    assert h.items[(i - 1) // 2] <= h.items[i], "Heap property broken at index " + str(i) + ": " + repr(h.items)
out = [h.pop() for _ in range(6)]
assert out == [1, 2, 3, 5, 8, 9], "Popping everything gives the items in sorted order. Got " + repr(out)
assert h.pop() is None and len(h) == 0, "An empty heap returns None."
import random
random.seed(3)
data = [random.randint(0, 1000) for _ in range(300)]
for x in data:
    h.push(x)
assert [h.pop() for _ in range(300)] == sorted(data), "300 random numbers come out sorted."
assert "heapq" not in source, "Implement sift-up and sift-down yourself, without heapq."`,
            },
          ],
          solution: "class MinHeap:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        a = self.items\n        a.append(x)\n        i = len(a) - 1\n        while i > 0:\n            parent = (i - 1) // 2\n            if a[i] >= a[parent]:\n                break\n            a[i], a[parent] = a[parent], a[i]\n            i = parent\n\n    def pop(self):\n        a = self.items\n        if not a:\n            return None\n        smallest = a[0]\n        last = a.pop()\n        if a:\n            a[0] = last\n            i = 0\n            while True:\n                left, right = 2 * i + 1, 2 * i + 2\n                child = i\n                if left < len(a) and a[left] < a[child]:\n                    child = left\n                if right < len(a) and a[right] < a[child]:\n                    child = right\n                if child == i:\n                    break\n                a[i], a[child] = a[child], a[i]\n                i = child\n        return smallest\n\n    def __len__(self):\n        return len(self.items)\n",
          hint: "push: append, then while i > 0 and a[i] < a[parent]: swap and move up. pop: save a[0]; move the last item to index 0; then repeatedly swap with the smaller child while a child is smaller.",
          successMessage: "Both operations follow a single path: O(log n). Pushing n items and popping them all is heap sort, an O(n log n) sort (Module 10).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 8.10 – 8.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l35-graphs-choosing",
    moduleId: "al-m8-data-structures",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["8.10", "8.11", "8.12"],
    title: "Graphs, and Choosing a Data Structure",
    subtitle: "Representing relationships, and comparing every structure's costs",
    estimatedMinutes: 30,
    intro:
      "Graphs represent relationships: roads between towns, friendships, dependencies between tasks. This lesson shows how a graph is stored, then brings the whole module together into one decision: which structure should this program use?",

    atoms: [
      {
        id: "a-al-graph-structures",
        title: "Graphs: kinds and representations",
        explain:
          "A GRAPH G = (V, E) is a set of vertices V joined by edges E. In an UNDIRECTED graph an edge {u, v} goes both ways (friendship); in a DIRECTED graph an edge (u, v) goes one way (following someone, a one-way street). In a WEIGHTED graph each edge carries a number (distance, cost, time). Two representations: an ADJACENCY MATRIX is a V × V table where cell [u][v] holds 1 (or the weight) if there is an edge: O(1) edge test, but O(V²) space even for few edges. An ADJACENCY LIST stores, for each vertex, a list of its neighbours: O(V + E) space and fast iteration over neighbours, which most graph algorithms need. Real-world graphs are usually SPARSE (E much less than V²), so adjacency lists are the default.",
        table: {
          caption: "Adjacency matrix versus adjacency list.",
          headers: ["Operation", "Adjacency matrix", "Adjacency list"],
          rows: [
            ["Space", "O(V²)", "O(V + E)"],
            ["Is there an edge u–v?", "O(1)", "O(degree of u)"],
            ["List the neighbours of u", "O(V)", "O(degree of u)"],
            ["Add an edge", "O(1)", "O(1)"],
            ["Best for", "Dense graphs, frequent edge tests", "Sparse graphs, traversals (BFS, DFS, Dijkstra)"],
          ],
        },
        codeChallenge: {
          task: "Write build_graph(edges) for an UNDIRECTED graph given as a list of (u, v) pairs. Return an adjacency list: a dict mapping each vertex that appears in an edge to the SORTED list of its neighbours. Then write degree(graph, v) that returns how many neighbours v has (0 for a vertex not in the graph).",
          starter: "def build_graph(edges):\n    pass\n\ndef degree(graph, v):\n    pass\n",
          sample: "build_graph([(\"A\", \"B\"), (\"A\", \"C\")]) → {\"A\": [\"B\", \"C\"], \"B\": [\"A\"], \"C\": [\"A\"]}",
          tests: [
            {
              check: py`roads = [("Lagos", "Ibadan"), ("Ibadan", "Ilorin"), ("Lagos", "Abeokuta"), ("Abeokuta", "Ibadan")]
g = build_graph(roads)
assert g["Ibadan"] == ["Abeokuta", "Ilorin", "Lagos"], "Ibadan's neighbours, sorted. Got " + repr(g.get("Ibadan"))
assert g["Ilorin"] == ["Ibadan"], "Edges go both ways in an undirected graph: Ilorin links back to Ibadan."
assert set(g) == {"Lagos", "Ibadan", "Ilorin", "Abeokuta"}, "Every vertex that appears in an edge is a key."
assert degree(g, "Ibadan") == 3 and degree(g, "Ilorin") == 1 and degree(g, "Kano") == 0, "Degrees: Ibadan 3, Ilorin 1, Kano (absent) 0."
assert build_graph([]) == {}, "No edges, no vertices."
assert sum(degree(g, v) for v in g) == 2 * len(roads), "In an undirected graph the degrees add up to twice the number of edges."`,
            },
          ],
          solution: "def build_graph(edges):\n    graph = {}\n    for u, v in edges:\n        graph.setdefault(u, []).append(v)\n        graph.setdefault(v, []).append(u)\n    for vertex in graph:\n        graph[vertex].sort()\n    return graph\n\ndef degree(graph, v):\n    return len(graph.get(v, []))\n",
          hint: "For each (u, v): append v to u's list and u to v's list (dict.setdefault(key, []) creates a list the first time). Sort every list at the end.",
          successMessage: "An adjacency list in O(V + E) space. The degree sum check is the handshake lemma: each edge is counted once from each end.",
        },
      },
      {
        id: "a-al-choosing-structure",
        title: "Choosing the appropriate data structure",
        explain:
          "Choose a structure by listing the operations the program performs MOST often and picking the structure that makes them cheap. Lookup by key → hash table. Ordered data, ranges, \"next larger\" → balanced search tree (or a sorted array if it rarely changes). Repeatedly take the smallest or most urgent → heap. Undo or nested structure → stack. Process in arrival order → queue. Relationships → graph (adjacency list). Access by position → array. When two operations conflict, combine structures: an LRU cache uses a hash map plus a doubly linked list.",
        decision: {
          scenario: "A ride-hailing app must repeatedly assign the waiting driver who has been idle the LONGEST, while drivers keep arriving and leaving the waiting pool at any time.",
          question: "Which structure fits best?",
          options: [
            { id: "a", text: "A stack", whyWrong: "A stack gives the most recently arrived driver, the opposite of what is needed." },
            { id: "b", text: "A sorted Python list, re-sorted after every arrival", whyWrong: "Re-sorting costs O(n log n) per arrival when O(log n) is possible." },
            {
              id: "c",
              text: "A min-heap keyed by the time each driver became idle (with a hash map if drivers can leave the pool early)",
              why: "The heap gives the earliest idle time in O(log n) per operation; the map finds a departing driver's entry quickly.",
            },
            { id: "d", text: "A hash table alone", whyWrong: "A hash table keeps no order, so finding the longest-idle driver is O(n)." },
          ],
          correct: "c",
          aftermath: "If drivers never left early, a simple queue would do: the first to arrive is the longest idle.",
        },
      },
      {
        id: "a-al-comparing-operations",
        title: "Comparing operations and their complexity",
        explain:
          "The table summarises the module. The difference between an O(n) and an O(1) operation is invisible on ten items and decisive on a million. Searching an array for each of n queries is O(n) per query, O(n²) in total; building a hash set once is O(n) and then each query is O(1) on average, O(n) in total.",
        table: {
          caption: "Typical (average) costs. * = amortized. † = O(n) in the worst case.",
          headers: ["Structure", "Access by index", "Search", "Insert", "Delete", "Find min"],
          rows: [
            ["Dynamic array (unsorted)", "O(1)", "O(n)", "O(1)* at end, O(n) at front", "O(n)", "O(n)"],
            ["Sorted array", "O(1)", "O(log n)", "O(n)", "O(n)", "O(1)"],
            ["Linked list", "O(n)", "O(n)", "O(1) at head", "O(1) given the node (doubly)", "O(n)"],
            ["Hash table", "—", "O(1)†", "O(1)†", "O(1)†", "O(n)"],
            ["Balanced BST", "—", "O(log n)", "O(log n)", "O(log n)", "O(log n)"],
            ["Binary heap", "—", "O(n)", "O(log n)", "O(log n) for the min", "O(1)"],
          ],
        },
        codeChallenge: {
          task: "Compare searching in an array and a hash table. Write count_found(haystack, needles) that returns how many items of needles occur in haystack. Both lists have 20,000 items, so scanning the haystack list for every needle (about 400 million comparisons) is far too slow: put the haystack into a set first.",
          starter: "def count_found(haystack, needles):\n    pass\n",
          sample: "count_found([4, 8, 15, 16], [8, 9, 16]) → 2",
          tests: [
            {
              check: py`assert count_found([4, 8, 15, 16], [8, 9, 16]) == 2, "8 and 16 are found. Got " + repr(count_found([4, 8, 15, 16], [8, 9, 16]))
assert count_found([], [1, 2]) == 0 and count_found([1, 2], []) == 0, "Empty lists."
assert count_found([1, 2, 3], [2, 2, 2]) == 3, "Each needle is counted, even repeated ones."
hay = list(range(0, 40000, 2))
needles = list(range(20000))
assert count_found(hay, needles) == 10000, "Half of 0..19999 are even numbers in the haystack."
assert calls("set") or calls("frozenset") or calls("dict"), "Put the haystack into a set first, so each lookup is O(1)."`,
            },
          ],
          solution: "def count_found(haystack, needles):\n    lookup = set(haystack)\n    count = 0\n    for x in needles:\n        if x in lookup:\n            count += 1\n    return count\n",
          hint: "lookup = set(haystack), then count the needles with x in lookup.",
          successMessage: "O(n) to build the set and O(1) per lookup, against O(n) per lookup in a list. On 20,000 items that is 40,000 steps instead of 400 million.",
        },
      },
    ],

    task: {
      title: "Module 8 practice: build the structures",
      intro: "Implement each one from scratch in VS Code, with tests, before using Python's built-in equivalent.",
      prompts: [
        "Implement a stack using an array, with push, pop, peek and is_empty, and use it to check balanced brackets.",
        "Build a queue: first with a circular array, then with a linked list. Compare their operations' costs.",
        "Implement a linked list with push_front, push_back (keep a tail reference), find and delete.",
        "Create a simple hash table with chaining that resizes to double its buckets when the load factor exceeds 0.75.",
        "Build a binary search tree with insert, search, inorder traversal and height. Insert 1,000 random keys and then 1,000 sorted keys, and compare the heights.",
        "Compare searching in an array and a hash table: time 10,000 lookups in a list and in a set of 100,000 items.",
      ],
      closing: "Phase 4 puts these structures to work: Module 9 is searching, Module 10 sorting.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
