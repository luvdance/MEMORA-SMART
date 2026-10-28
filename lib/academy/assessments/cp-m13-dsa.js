/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 13 · DATA STRUCTURES, SEARCHING AND SORTING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l54-big-o-search": {
    lessonId: "cp-l54-big-o-search",
    passMark: 70,
    questions: [
      {
        id: "cpq54-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-binary-search",
        prompt: "What must be true of data before binary search can be used on it?",
        options: [
          { id: "a", text: "It must be sorted" },
          { id: "b", text: "It must contain no more than 1,000 items" },
          { id: "c", text: "It must be stored in a linked list" },
          { id: "d", text: "It must contain only even numbers" },
        ],
        correct: "a",
        explanation: "Halving only works if the middle element tells you which side the target must be on.",
        whyWrong: {
          b: "Binary search shines on large data.",
          c: "It needs fast access to the middle, which a vector gives and a linked list does not.",
          d: "Any comparable values work.",
        },
      },
      {
        id: "cpq54-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-binary-search",
        prompt: "About how many checks does binary search need, at most, for 1,000,000 sorted items?",
        options: [
          { id: "a", text: "About 20" },
          { id: "b", text: "About 1,000" },
          { id: "c", text: "About 500,000" },
          { id: "d", text: "1,000,000" },
        ],
        correct: "a",
        explanation: "Each check halves the range; 2²⁰ is about a million, so about 20 halvings are enough.",
        whyWrong: {
          b: "That is roughly the square root, not log₂.",
          c: "That is the average for linear search.",
          d: "That is linear search's worst case.",
        },
      },
      {
        id: "cpq54-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-big-o",
        prompt: "Two nested loops, each running over all n elements of the same array, are usually...",
        options: [
          { id: "a", text: "O(n²)" },
          { id: "b", text: "O(n)" },
          { id: "c", text: "O(log n)" },
          { id: "d", text: "O(1)" },
        ],
        correct: "a",
        explanation: "n iterations of an inner loop of n iterations: n × n.",
        whyWrong: {
          b: "A single loop over n would be O(n).",
          c: "O(log n) comes from repeated halving.",
          d: "O(1) is constant work regardless of n.",
        },
      },
      {
        id: "cpq54-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-linear-search",
        prompt: "When is linear search the better choice over binary search?",
        options: [
          { id: "a", text: "When the data is small or unsorted, and sorting it just to search once would cost more than searching" },
          { id: "b", text: "Never" },
          { id: "c", text: "When the data has millions of sorted items" },
          { id: "d", text: "When the target is in the middle" },
        ],
        correct: "a",
        explanation: "Sorting costs O(n log n); for one search on unsorted data, a single O(n) scan is cheaper.",
        whyWrong: {
          b: "For small or unsorted data, linear search is simplest and often fastest.",
          c: "That is exactly where binary search wins.",
          d: "You cannot know where the target is before searching.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l55-sorting": {
    lessonId: "cp-l55-sorting",
    passMark: 70,
    questions: [
      {
        id: "cpq55-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-three-sorts",
        prompt: "Which sort repeatedly finds the smallest remaining element and swaps it into the next position?",
        options: [
          { id: "a", text: "Selection sort" },
          { id: "b", text: "Bubble sort" },
          { id: "c", text: "Insertion sort" },
          { id: "d", text: "Binary search" },
        ],
        correct: "a",
        explanation: "It selects the minimum of the unsorted part each pass.",
        whyWrong: {
          b: "Bubble sort swaps neighbouring pairs.",
          c: "Insertion sort slides each element left into place.",
          d: "Binary search finds; it does not sort.",
        },
      },
      {
        id: "cpq55-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-compare-sorts",
        prompt: "On data that is already sorted, how many comparisons does insertion sort make for n items?",
        options: [
          { id: "a", text: "About n (each element is compared once with its left neighbour)" },
          { id: "b", text: "About n²" },
          { id: "c", text: "0" },
          { id: "d", text: "About n log n" },
        ],
        correct: "a",
        explanation: "Every element is already in place, so each inner loop stops after one comparison: n - 1 in total.",
        whyWrong: {
          b: "That is its worst case, on reversed data.",
          c: "It must compare to know the data is sorted.",
          d: "That is sort's typical cost.",
        },
      },
      {
        id: "cpq55-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-compare-sorts",
        prompt: "What is the typical time complexity of sort?",
        options: [
          { id: "a", text: "O(n log n)" },
          { id: "b", text: "O(n²)" },
          { id: "c", text: "O(1)" },
          { id: "d", text: "O(log n)" },
        ],
        correct: "a",
        explanation: "The standard requires sort to be O(n log n).",
        whyWrong: {
          b: "That is the simple sorts' average.",
          c: "No sort can avoid looking at every element.",
          d: "Sorting must at least read all n elements.",
        },
      },
      {
        id: "cpq55-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-three-sorts",
        prompt: "In insertion sort, why must the condition be written j > 0 && a[j - 1] > key, in that order?",
        options: [
          { id: "a", text: "&& stops at j > 0 being false, so a[j - 1] is never read when j is 0" },
          { id: "b", text: "The order does not matter" },
          { id: "c", text: "It makes the sort descending" },
          { id: "d", text: "C++ requires numbers before array accesses" },
        ],
        correct: "a",
        explanation: "Short-circuit evaluation protects the array access; reversed, a[-1] would be read.",
        whyWrong: {
          b: "Reversed, the access happens before the check: out of bounds.",
          c: "Direction is decided by the > key comparison, not the order of the conditions.",
          d: "No such rule exists; it is about short-circuit safety.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l56-linked-structures": {
    lessonId: "cp-l56-linked-structures",
    passMark: 70,
    questions: [
      {
        id: "cpq56-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-linked-list",
        prompt: "What is the cost of reaching the 1,000th element of a linked list?",
        options: [
          { id: "a", text: "O(n): you must follow the links from the head one by one" },
          { id: "b", text: "O(1), like a vector" },
          { id: "c", text: "O(log n)" },
          { id: "d", text: "It is impossible" },
        ],
        correct: "a",
        explanation: "Nodes are scattered in memory; only the links say where the next one is.",
        whyWrong: {
          b: "A vector computes an element's address; a list must walk.",
          c: "There is no halving in a plain list.",
          d: "It is possible, just slow.",
        },
      },
      {
        id: "cpq56-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-trees-bst",
        prompt: "In a binary search tree, where are the values smaller than a node stored?",
        options: [
          { id: "a", text: "In its left subtree" },
          { id: "b", text: "In its right subtree" },
          { id: "c", text: "Anywhere" },
          { id: "d", text: "In the root only" },
        ],
        correct: "a",
        explanation: "Left is smaller, right is larger, at every node; that rule is what makes searching fast.",
        whyWrong: {
          b: "The right subtree holds larger values.",
          c: "The ordering rule is what defines a BST.",
          d: "The root is one node; smaller values go to its left.",
        },
      },
      {
        id: "cpq56-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-trees-bst",
        prompt: "What does an in-order traversal (left, node, right) of a binary search tree produce?",
        options: [
          { id: "a", text: "The values in ascending order" },
          { id: "b", text: "The values in insertion order" },
          { id: "c", text: "Only the root" },
          { id: "d", text: "The values in random order" },
        ],
        correct: "a",
        explanation: "Everything smaller is printed before each node, and everything larger after it.",
        whyWrong: {
          b: "Traversal order depends on the tree's ordering, not insertion order.",
          c: "Every node is visited.",
          d: "The order follows directly from the BST rule.",
        },
      },
      {
        id: "cpq56-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-graphs",
        prompt: "Breadth-first search uses which container to decide which node to explore next?",
        options: [
          { id: "a", text: "A queue" },
          { id: "b", text: "A stack" },
          { id: "c", text: "A set only" },
          { id: "d", text: "Nothing; it picks randomly" },
        ],
        correct: "a",
        explanation: "First in, first out explores nodes in order of distance, level by level.",
        whyWrong: {
          b: "A stack gives depth-first search.",
          c: "A set may record visited nodes but does not order the exploration.",
          d: "BFS is fully deterministic.",
        },
      },
      {
        id: "cpq56-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-stack-queue-practice",
        prompt: "A bracket checker reads \"([)]\". When it meets ')', the top of its stack is '['. What should it conclude?",
        options: [
          { id: "a", text: "The brackets are not balanced" },
          { id: "b", text: "They are balanced so far" },
          { id: "c", text: "Push ')' onto the stack" },
          { id: "d", text: "Ignore it and continue" },
        ],
        correct: "a",
        explanation: "The most recently opened bracket must be the first closed; ')' does not match '['.",
        whyWrong: {
          b: "A mismatch can never be repaired later.",
          c: "Closing brackets are matched against the stack, not pushed.",
          d: "Ignoring it would accept invalid text.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l57-recursion-hashing": {
    lessonId: "cp-l57-recursion-hashing",
    passMark: 70,
    questions: [
      {
        id: "cpq57-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-recursive-solving",
        prompt: "int f(int n) { if (n <= 1) return n; return f(n - 1) + f(n - 2); }\n\nWhat is f(6)?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "6" },
          { id: "c", text: "13" },
          { id: "d", text: "5" },
        ],
        correct: "a",
        explanation: "This is the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8. f(6) is 8.",
        whyWrong: {
          b: "f does not return its argument except for 0 and 1.",
          c: "13 is f(7).",
          d: "5 is f(5).",
        },
      },
      {
        id: "cpq57-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-hashing",
        prompt: "Why is looking up a key in a hash table O(1) on average?",
        options: [
          { id: "a", text: "The hash function computes which bucket to look in, so only that bucket is checked" },
          { id: "b", text: "The table is always sorted" },
          { id: "c", text: "It checks every bucket very quickly" },
          { id: "d", text: "Hash tables hold only one item" },
        ],
        correct: "a",
        explanation: "Hashing the key jumps straight to a small bucket instead of scanning everything.",
        whyWrong: {
          b: "Hash tables keep no order.",
          c: "Checking every bucket would be O(n).",
          d: "They hold any number of items.",
        },
      },
      {
        id: "cpq57-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-hashing",
        prompt: "What is a collision in a hash table?",
        options: [
          { id: "a", text: "Two different keys hashing to the same bucket" },
          { id: "b", text: "Two threads using the table at once" },
          { id: "c", text: "Inserting the same key twice" },
          { id: "d", text: "A crash caused by a full table" },
        ],
        correct: "a",
        explanation: "Collisions are normal; each bucket keeps a small list of the keys that land there.",
        whyWrong: {
          b: "That is a concurrency issue, not a collision.",
          c: "Duplicate keys are a different matter; maps simply keep one entry per key.",
          d: "Tables grow when they fill; collisions do not crash anything.",
        },
      },
      {
        id: "cpq57-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-choosing-structure",
        prompt: "A program mostly accesses items by position and appends new ones at the end. Which structure is the natural choice?",
        options: [
          { id: "a", text: "vector" },
          { id: "b", text: "list" },
          { id: "c", text: "unordered_map" },
          { id: "d", text: "A binary search tree" },
        ],
        correct: "a",
        explanation: "Index access and push_back are both O(1) for a vector.",
        whyWrong: {
          b: "A list has no index access.",
          c: "Keys are not needed; positions are.",
          d: "A tree orders by value, not by position.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
