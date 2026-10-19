/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 16
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l67-search": {
    lessonId: "pp-l67-search",
    passMark: 70,
    questions: [
      {
        id: "ppq67-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-algorithm-design",
        prompt: "Which should come BEFORE writing the code for a new algorithm?",
        options: [
          { id: "a", text: "Working small examples by hand, including edge cases such as an empty input" },
          { id: "b", text: "Choosing a colour scheme for the editor" },
          { id: "c", text: "Optimising for speed" },
          { id: "d", text: "Writing the README" },
        ],
        correct: "a",
        explanation: "Examples reveal the method and the edge cases the code must handle.",
        whyWrong: {
          b: "Irrelevant to the algorithm.",
          c: "Correctness first; optimise later, and only if needed.",
          d: "Documentation follows design.",
        },
      },
      {
        id: "ppq67-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-linear-search",
        prompt: "In the worst case, how many items does linear search check in a list of n items?",
        options: [
          { id: "a", text: "n" },
          { id: "b", text: "1" },
          { id: "c", text: "About log₂ n" },
          { id: "d", text: "n²" },
        ],
        correct: "a",
        explanation: "If the target is last or missing, every item is checked.",
        whyWrong: {
          b: "That is the best case (first item).",
          c: "That is binary search.",
          d: "Linear search checks each item once.",
        },
      },
      {
        id: "ppq67-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-binary-search",
        prompt: "What does binary search require of its list?",
        options: [
          { id: "a", text: "It must be sorted" },
          { id: "b", text: "It must contain only even numbers" },
          { id: "c", text: "It must have fewer than 1,000 items" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "Discarding half the list is only valid if order tells you which half the target is in.",
        whyWrong: {
          b: "Any comparable values work.",
          c: "It shines on huge lists.",
          d: "On an unsorted list it gives wrong answers.",
        },
      },
      {
        id: "ppq67-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-binary-search",
        prompt: "Roughly how many steps does binary search need for a sorted list of 1,000,000 items?",
        options: [
          { id: "a", text: "About 20" },
          { id: "b", text: "About 1,000" },
          { id: "c", text: "About 500,000" },
          { id: "d", text: "1,000,000" },
        ],
        correct: "a",
        explanation: "Each step halves the range: 2²⁰ is about a million.",
        whyWrong: {
          b: "That is the square root, not the logarithm.",
          c: "That is the average for linear search.",
          d: "That is linear search's worst case.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l68-sorting": {
    lessonId: "pp-l68-sorting",
    passMark: 70,
    questions: [
      {
        id: "ppq68-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-simple-sorts",
        prompt: "a, b = 1, 2\na, b = b, a\nprint(a, b)\n\nWhat is printed?",
        options: [
          { id: "a", text: "2 1" },
          { id: "b", text: "1 2" },
          { id: "c", text: "2 2" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "The right side is evaluated first into a tuple (2, 1), then unpacked: a swap.",
        whyWrong: {
          b: "The values were swapped.",
          c: "Both values are read before either is assigned.",
          d: "Tuple swapping is valid Python.",
        },
      },
      {
        id: "ppq68-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-insertion-sort",
        prompt: "On which kind of input is insertion sort especially fast?",
        options: [
          { id: "a", text: "A list that is already nearly sorted" },
          { id: "b", text: "A list in completely reverse order" },
          { id: "c", text: "A list of strings only" },
          { id: "d", text: "None; it is always slow" },
        ],
        correct: "a",
        explanation: "Each item moves only a short distance, so the inner loop does very little work.",
        whyWrong: {
          b: "Reverse order is its worst case: every item moves all the way.",
          c: "Type does not matter.",
          d: "It is close to O(n) on nearly sorted data.",
        },
      },
      {
        id: "ppq68-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-merge-sort",
        prompt: "What is the base case of merge sort?",
        options: [
          { id: "a", text: "A list of zero or one items, which is already sorted" },
          { id: "b", text: "A list of exactly two items" },
          { id: "c", text: "A list sorted with sorted()" },
          { id: "d", text: "There is no base case" },
        ],
        correct: "a",
        explanation: "Splitting stops when a piece cannot be split further; such a piece is trivially sorted.",
        whyWrong: {
          b: "Two items still need comparing.",
          c: "Merge sort does not rely on sorted().",
          d: "Without one, the recursion would never end.",
        },
      },
      {
        id: "ppq68-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-merge-sort",
        prompt: "Why does merge sort scale better than bubble sort on large lists?",
        options: [
          { id: "a", text: "It does about n log n comparisons rather than about n²" },
          { id: "b", text: "It uses fewer variables" },
          { id: "c", text: "It only works on numbers" },
          { id: "d", text: "It skips some items" },
        ],
        correct: "a",
        explanation: "For a million items: about 20 million steps versus about a trillion.",
        whyWrong: {
          b: "Variable count is not what matters.",
          c: "Both sort any comparable values.",
          d: "Every item is sorted.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l69-structures": {
    lessonId: "pp-l69-structures",
    passMark: 70,
    questions: [
      {
        id: "ppq69-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-stacks-queues",
        prompt: "An undo feature removes the most recent action first. Which structure fits?",
        options: [
          { id: "a", text: "A stack (last in, first out)" },
          { id: "b", text: "A queue (first in, first out)" },
          { id: "c", text: "A set" },
          { id: "d", text: "A tuple" },
        ],
        correct: "a",
        explanation: "The last action pushed is the first popped.",
        whyWrong: {
          b: "A queue would undo the oldest action first.",
          c: "Sets have no order.",
          d: "Tuples cannot change.",
        },
      },
      {
        id: "ppq69-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-stacks-queues",
        prompt: "Why use collections.deque for a queue instead of list.pop(0)?",
        options: [
          { id: "a", text: "popleft() is O(1), while list.pop(0) shifts every remaining item, O(n)" },
          { id: "b", text: "Lists cannot remove items" },
          { id: "c", text: "deque sorts automatically" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "a",
        explanation: "deque is designed for fast additions and removals at both ends.",
        whyWrong: {
          b: "They can, just slowly at the front.",
          c: "deque does not sort.",
          d: "The difference grows with the queue's length.",
        },
      },
      {
        id: "ppq69-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-linked-lists",
        prompt: "What does each node of a linked list hold?",
        options: [
          { id: "a", text: "A value and a reference to the next node" },
          { id: "b", text: "Every value in the list" },
          { id: "c", text: "Only an index number" },
          { id: "d", text: "A copy of the whole list" },
        ],
        correct: "a",
        explanation: "Nodes chain together through their next references, starting from the head.",
        whyWrong: {
          b: "Each node holds one value.",
          c: "Linked lists have no built-in indexes.",
          d: "That would waste enormous memory.",
        },
      },
      {
        id: "ppq69-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-hashing",
        prompt: "Checking x in a set of a million items takes roughly...",
        options: [
          { id: "a", text: "One step on average, because sets are hash tables" },
          { id: "b", text: "A million steps" },
          { id: "c", text: "About 20 steps" },
          { id: "d", text: "It is not possible" },
        ],
        correct: "a",
        explanation: "Hashing computes where the item would be, so membership is O(1) on average.",
        whyWrong: {
          b: "That is a list.",
          c: "That is binary search on a sorted list.",
          d: "Membership tests are what sets are best at.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l70-graphs-bigo": {
    lessonId: "pp-l70-graphs-bigo",
    passMark: 70,
    questions: [
      {
        id: "ppq70-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-trees-graphs",
        prompt: "Which search finds a route with the fewest steps in an unweighted graph?",
        options: [
          { id: "a", text: "Breadth-first search, using a queue" },
          { id: "b", text: "Binary search" },
          { id: "c", text: "Bubble sort" },
          { id: "d", text: "Linear search over the node names" },
        ],
        correct: "a",
        explanation: "BFS explores nodes in order of distance, so the first time it reaches the goal is by a shortest route.",
        whyWrong: {
          b: "Binary search is for sorted lists.",
          c: "That is a sorting algorithm.",
          d: "That finds a name, not a route.",
        },
      },
      {
        id: "ppq70-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-trees-graphs",
        prompt: "What is the key difference between a tree and a general graph?",
        options: [
          { id: "a", text: "A tree has a root and no cycles; a graph may contain cycles" },
          { id: "b", text: "Trees can only hold numbers" },
          { id: "c", text: "Graphs cannot be stored in Python" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "a",
        explanation: "Every tree is a graph, but graphs can loop back on themselves, which is why BFS needs a seen set.",
        whyWrong: {
          b: "Trees hold any data.",
          c: "A dictionary of neighbour lists stores a graph easily.",
          d: "Cycles are the key difference.",
        },
      },
      {
        id: "ppq70-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-big-o",
        prompt: "for x in items:\n    if x in other_list:\n        count += 1\n\nBoth lists have n items. What is the time complexity?",
        options: [
          { id: "a", text: "O(n²), because in on a list is itself O(n), inside an O(n) loop" },
          { id: "b", text: "O(n)" },
          { id: "c", text: "O(1)" },
          { id: "d", text: "O(log n)" },
        ],
        correct: "a",
        explanation: "The hidden loop inside in makes it quadratic. Converting other_list to a set makes it O(n).",
        whyWrong: {
          b: "That would be true if other_list were a set.",
          c: "The loop alone is already O(n).",
          d: "Nothing here halves the work.",
        },
      },
      {
        id: "ppq70-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-efficient-choices",
        prompt: "What is \"premature optimisation\"?",
        options: [
          { id: "a", text: "Making code complicated to speed up parts that were never actually slow" },
          { id: "b", text: "Choosing a set instead of a list for membership tests" },
          { id: "c", text: "Measuring before optimising" },
          { id: "d", text: "Writing tests" },
        ],
        correct: "a",
        explanation: "Measure first, then optimise only what matters. Choosing the right data structure up front is just good design.",
        whyWrong: {
          b: "That is a sensible default, not premature.",
          c: "Measuring first is the cure.",
          d: "Tests make optimisation safe.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
