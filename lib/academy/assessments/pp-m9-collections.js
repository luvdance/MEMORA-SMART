/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 9
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l35-lists": {
    lessonId: "pp-l35-lists",
    passMark: 70,
    questions: [
      {
        id: "ppq35-1",
        type: "scenario",
        difficulty: 1,
        atomId: "a-pp-list-basics",
        prompt: "grid = [[1, 2], [3, 4], [5, 6]]\nprint(grid[2][0])\n\nWhat is printed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "2" },
          { id: "c", text: "3" },
          { id: "d", text: "[5, 6]" },
        ],
        correct: "a",
        explanation: "grid[2] is the third inner list, [5, 6], and [0] is its first item, 5.",
        whyWrong: {
          b: "That is grid[0][1].",
          c: "That is grid[1][0].",
          d: "That is grid[2] without the second index.",
        },
      },
      {
        id: "ppq35-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-list-changes",
        prompt: "items = [\"a\", \"b\", \"c\"]\nx = items.pop()\nitems.append(\"d\")\nprint(items, x)\n\nWhat is printed?",
        options: [
          { id: "a", text: "['a', 'b', 'd'] c" },
          { id: "b", text: "['a', 'b', 'c', 'd'] c" },
          { id: "c", text: "['b', 'c', 'd'] a" },
          { id: "d", text: "['a', 'b', 'd'] None" },
        ],
        correct: "a",
        explanation: "pop() removes and returns the last item, c. Then d is appended.",
        whyWrong: {
          b: "pop() removed c from the list.",
          c: "pop() with no argument takes the LAST item.",
          d: "pop() returns the removed item.",
        },
      },
      {
        id: "ppq35-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-list-sorting",
        prompt: "nums = [3, 1, 2]\nresult = nums.sort()\nprint(result)\n\nWhat is printed?",
        options: [
          { id: "a", text: "[1, 2, 3]" },
          { id: "b", text: "None" },
          { id: "c", text: "[3, 1, 2]" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: ".sort() sorts the list in place and returns None. Use sorted(nums) to get a new sorted list.",
        whyWrong: {
          a: "nums is now sorted, but result holds what sort() returned: None.",
          c: "sort() did change nums, but result is None anyway.",
          d: "The code runs; it is a common logic mistake.",
        },
      },
      {
        id: "ppq35-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-list-sorting",
        prompt: "Which keeps the original list unchanged and gives a sorted copy?",
        options: [
          { id: "a", text: "scores.sort()" },
          { id: "b", text: "sorted(scores)" },
          { id: "c", text: "scores.reverse()" },
          { id: "d", text: "scores = scores.sort()" },
        ],
        correct: "b",
        explanation: "sorted() returns a new list and leaves the original alone.",
        whyWrong: {
          a: ".sort() changes the original in place.",
          c: ".reverse() changes the original and does not sort.",
          d: "That replaces scores with None.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l36-iterate-tuples": {
    lessonId: "pp-l36-iterate-tuples",
    passMark: 70,
    questions: [
      {
        id: "ppq36-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-iterating",
        prompt: "total = 0\nfor n in [4, 7, 1]:\n    total += n\nprint(total / 3)\n\nWhat is printed?",
        options: [
          { id: "a", text: "4.0" },
          { id: "b", text: "12" },
          { id: "c", text: "4" },
          { id: "d", text: "3.0" },
        ],
        correct: "a",
        explanation: "The total is 12, and 12 / 3 is 4.0 (a float, because of /).",
        whyWrong: {
          b: "That is the total before dividing.",
          c: "/ always produces a float.",
          d: "12 divided by 3 is 4.",
        },
      },
      {
        id: "ppq36-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-tuples",
        prompt: "What is the main difference between a tuple and a list?",
        options: [
          { id: "a", text: "A tuple cannot be changed after it is created" },
          { id: "b", text: "A tuple can only hold numbers" },
          { id: "c", text: "A tuple cannot be looped over" },
          { id: "d", text: "A tuple has no indexes" },
        ],
        correct: "a",
        explanation: "Tuples are immutable, which suits fixed records whose parts belong together.",
        whyWrong: {
          b: "Tuples can hold any types.",
          c: "Tuples can be looped over like lists.",
          d: "Tuples are indexed exactly like lists.",
        },
      },
      {
        id: "ppq36-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-tuples",
        prompt: "point = (3, 8)\nx, y = point\nprint(y - x)\n\nWhat is printed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "-5" },
          { id: "c", text: "(3, 8)" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "Unpacking puts 3 in x and 8 in y; 8 - 3 is 5.",
        whyWrong: {
          b: "y is 8 and x is 3.",
          c: "The tuple was unpacked into two names.",
          d: "Two names, two values: unpacking works.",
        },
      },
      {
        id: "ppq36-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-tuples",
        prompt: "for name, score in [(\"Ada\", 70), (\"Bo\", 40)]:\n    if score > 50:\n        print(name)\n\nWhat is printed?",
        options: [
          { id: "a", text: "Ada" },
          { id: "b", text: "Ada\nBo" },
          { id: "c", text: "70" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "Each tuple is unpacked; only Ada's score is above 50.",
        whyWrong: {
          b: "Bo scored 40.",
          c: "The name is printed, not the score.",
          d: "Ada's score passes the condition.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l37-sets-dicts": {
    lessonId: "pp-l37-sets-dicts",
    passMark: 70,
    questions: [
      {
        id: "ppq37-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-sets",
        prompt: "a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a & b))\n\nWhat is printed?",
        options: [
          { id: "a", text: "[2, 3]" },
          { id: "b", text: "[1, 2, 3, 4]" },
          { id: "c", text: "[1]" },
          { id: "d", text: "[1, 4]" },
        ],
        correct: "a",
        explanation: "& is intersection: values in both sets.",
        whyWrong: {
          b: "That is the union, a | b.",
          c: "That is a - b.",
          d: "That is the symmetric difference, a ^ b.",
        },
      },
      {
        id: "ppq37-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sets",
        prompt: "How do you create an empty set?",
        options: [
          { id: "a", text: "{}" },
          { id: "b", text: "set()" },
          { id: "c", text: "[]" },
          { id: "d", text: "()" },
        ],
        correct: "b",
        explanation: "{} creates an empty dictionary, so an empty set needs set().",
        whyWrong: {
          a: "{} is an empty dictionary.",
          c: "[] is an empty list.",
          d: "() is an empty tuple.",
        },
      },
      {
        id: "ppq37-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-dicts",
        prompt: "ages = {\"Ada\": 17}\nages[\"Ada\"] = 18\nages[\"Bo\"] = 16\nprint(len(ages), ages[\"Ada\"])\n\nWhat is printed?",
        options: [
          { id: "a", text: "2 18" },
          { id: "b", text: "3 18" },
          { id: "c", text: "2 17" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "Assigning to an existing key updates it; a new key adds an entry. Two keys, Ada now 18.",
        whyWrong: {
          b: "Keys are unique: updating Ada does not add a second Ada.",
          c: "Ada's value was replaced with 18.",
          d: "Adding and updating keys is allowed.",
        },
      },
      {
        id: "ppq37-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-dict-methods",
        prompt: "prices = {\"rice\": 900}\nprint(prices.get(\"salt\", 0))\n\nWhat is printed?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "None" },
          { id: "c", text: "KeyError: 'salt'" },
          { id: "d", text: "900" },
        ],
        correct: "a",
        explanation: "get() returns the default given (0) when the key is missing, instead of raising KeyError.",
        whyWrong: {
          b: "None is returned only when no default is given.",
          c: "get() never raises KeyError; prices[\"salt\"] would.",
          d: "That is the value for rice.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l38-mutability-copying": {
    lessonId: "pp-l38-mutability-copying",
    passMark: 70,
    questions: [
      {
        id: "ppq38-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-membership",
        prompt: "d = {\"x\": 1, \"y\": 2}\nprint(\"x\" in d, 2 in d)\n\nWhat is printed?",
        options: [
          { id: "a", text: "True False" },
          { id: "b", text: "True True" },
          { id: "c", text: "False True" },
          { id: "d", text: "False False" },
        ],
        correct: "a",
        explanation: "in checks a dictionary's keys. \"x\" is a key; 2 is only a value.",
        whyWrong: {
          b: "2 is a value, not a key.",
          c: "\"x\" is a key.",
          d: "\"x\" is a key.",
        },
      },
      {
        id: "ppq38-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-aliasing",
        prompt: "def add_bonus(scores):\n    scores.append(100)\n\nmine = [50]\nadd_bonus(mine)\nprint(mine)\n\nWhat is printed?",
        options: [
          { id: "a", text: "[50]" },
          { id: "b", text: "[50, 100]" },
          { id: "c", text: "[100]" },
          { id: "d", text: "None" },
        ],
        correct: "b",
        explanation: "The function receives the same list object, so append changes the caller's list.",
        whyWrong: {
          a: "Lists are passed as the same object, not as a copy.",
          c: "append adds to the end; 50 is still there.",
          d: "mine is a list; it was changed, not replaced.",
        },
      },
      {
        id: "ppq38-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-copy-comprehension",
        prompt: "Which creates an independent copy of the list a?",
        options: [
          { id: "a", text: "b = a" },
          { id: "b", text: "b = a.copy()" },
          { id: "c", text: "b == a" },
          { id: "d", text: "b = a.sort()" },
        ],
        correct: "b",
        explanation: "a.copy() (or list(a), or a[:]) creates a new list with the same items.",
        whyWrong: {
          a: "That makes b an alias of the same list.",
          c: "That compares; it does not assign anything.",
          d: "sort() returns None.",
        },
      },
      {
        id: "ppq38-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-copy-comprehension",
        prompt: "print([n * n for n in range(5) if n % 2 == 0])\n\nWhat is printed?",
        options: [
          { id: "a", text: "[0, 4, 16]" },
          { id: "b", text: "[0, 1, 4, 9, 16]" },
          { id: "c", text: "[1, 9]" },
          { id: "d", text: "[0, 2, 4]" },
        ],
        correct: "a",
        explanation: "Even n from range(5) are 0, 2 and 4; their squares are 0, 4 and 16.",
        whyWrong: {
          b: "The if keeps only even n.",
          c: "Those are the squares of the odd numbers.",
          d: "Those are the even numbers, not their squares.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
