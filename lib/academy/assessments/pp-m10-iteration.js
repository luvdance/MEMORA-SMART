/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 10
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l39-enumerate-zip": {
    lessonId: "pp-l39-enumerate-zip",
    passMark: 70,
    questions: [
      {
        id: "ppq39-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-iterables",
        prompt: "What ends a for loop over an iterator?",
        options: [
          { id: "a", text: "The iterator raises StopIteration, which for handles quietly" },
          { id: "b", text: "A break statement is always required" },
          { id: "c", text: "Python counts the items first" },
          { id: "d", text: "The loop variable becomes None" },
        ],
        correct: "a",
        explanation: "for calls next() until the iterator raises StopIteration, then ends the loop without an error.",
        whyWrong: {
          b: "break is optional; loops end on their own.",
          c: "Iterators do not need to know their length in advance.",
          d: "The loop variable keeps its last value.",
        },
      },
      {
        id: "ppq39-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-enumerate-zip",
        prompt: "for i, c in enumerate(\"ab\"):\n    print(i, c)\n\nWhat is printed?",
        options: [
          { id: "a", text: "0 a\n1 b" },
          { id: "b", text: "1 a\n2 b" },
          { id: "c", text: "a 0\nb 1" },
          { id: "d", text: "0 1" },
        ],
        correct: "a",
        explanation: "enumerate counts from 0 by default and gives (index, item) pairs.",
        whyWrong: {
          b: "That needs start=1.",
          c: "The index comes first in each pair.",
          d: "Each pass prints the index and the character.",
        },
      },
      {
        id: "ppq39-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-enumerate-zip",
        prompt: "print(list(zip([1, 2, 3], [\"a\", \"b\"])))\n\nWhat is printed?",
        options: [
          { id: "a", text: "[(1, 'a'), (2, 'b')]" },
          { id: "b", text: "[(1, 'a'), (2, 'b'), (3, None)]" },
          { id: "c", text: "[1, 'a', 2, 'b', 3]" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "zip pairs items and stops at the shorter collection.",
        whyWrong: {
          b: "zip does not pad with None.",
          c: "zip produces pairs (tuples), not a flat list.",
          d: "Different lengths are allowed.",
        },
      },
      {
        id: "ppq39-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-enumerate-zip",
        prompt: "Which is the clearest way to loop over a list with item numbers starting at 1?",
        options: [
          { id: "a", text: "for i in range(len(items)): print(i + 1, items[i])" },
          { id: "b", text: "for i, item in enumerate(items, start=1): print(i, item)" },
          { id: "c", text: "for item in items: print(items.index(item) + 1, item)" },
          { id: "d", text: "while True: print(items)" },
        ],
        correct: "b",
        explanation: "enumerate gives both the number and the item directly.",
        whyWrong: {
          a: "It works but is index arithmetic that enumerate exists to remove.",
          c: "index() is slow and wrong when items repeat.",
          d: "That loops forever.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l40-sort-key-any-all": {
    lessonId: "pp-l40-sort-key-any-all",
    passMark: 70,
    questions: [
      {
        id: "ppq40-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-sort-key",
        prompt: "print(sorted([\"pear\", \"fig\", \"apple\"], key=len))\n\nWhat is printed?",
        options: [
          { id: "a", text: "['fig', 'pear', 'apple']" },
          { id: "b", text: "['apple', 'fig', 'pear']" },
          { id: "c", text: "['apple', 'pear', 'fig']" },
          { id: "d", text: "[3, 4, 5]" },
        ],
        correct: "a",
        explanation: "key=len sorts by length: 3, 4, 5 characters.",
        whyWrong: {
          b: "That is alphabetical order, without a key.",
          c: "That is longest first, which needs reverse=True.",
          d: "The key decides the order but the items themselves are returned.",
        },
      },
      {
        id: "ppq40-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-sort-key",
        prompt: "To sort (name, score) tuples by score highest first, then name A to Z, which key works?",
        options: [
          { id: "a", text: "key=lambda r: (r[1], r[0])" },
          { id: "b", text: "key=lambda r: (-r[1], r[0])" },
          { id: "c", text: "key=lambda r: r[0]" },
          { id: "d", text: "key=lambda r: -r[0]" },
        ],
        correct: "b",
        explanation: "Negating the score sorts it highest first; the name breaks ties in normal order.",
        whyWrong: {
          a: "That sorts lowest score first.",
          c: "That sorts by name only.",
          d: "You cannot negate a string.",
        },
      },
      {
        id: "ppq40-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-any-all",
        prompt: "print(all(n > 0 for n in [3, 5, 0]), any(n > 4 for n in [3, 5, 0]))\n\nWhat is printed?",
        options: [
          { id: "a", text: "False True" },
          { id: "b", text: "True True" },
          { id: "c", text: "False False" },
          { id: "d", text: "True False" },
        ],
        correct: "a",
        explanation: "0 is not > 0, so all is False. 5 > 4, so any is True.",
        whyWrong: {
          b: "0 fails n > 0.",
          c: "5 satisfies n > 4.",
          d: "It is the other way round.",
        },
      },
      {
        id: "ppq40-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-any-all",
        prompt: "print(all([]), any([]))\n\nWhat is printed?",
        options: [
          { id: "a", text: "True False" },
          { id: "b", text: "False False" },
          { id: "c", text: "True True" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "all of nothing is True (no item fails); any of nothing is False (no item succeeds).",
        whyWrong: {
          b: "all([]) is True: there is no counter-example.",
          c: "any([]) is False: there is no truthy item.",
          d: "Empty collections are allowed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l41-comprehensions-nested": {
    lessonId: "pp-l41-comprehensions-nested",
    passMark: 70,
    questions: [
      {
        id: "ppq41-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-comprehensions",
        prompt: "print({n: n * 2 for n in range(3)})\n\nWhat is printed?",
        options: [
          { id: "a", text: "{0: 0, 1: 2, 2: 4}" },
          { id: "b", text: "[0, 2, 4]" },
          { id: "c", text: "{0, 2, 4}" },
          { id: "d", text: "{1: 2, 2: 4, 3: 6}" },
        ],
        correct: "a",
        explanation: "A dictionary comprehension with keys 0, 1, 2 and values doubled.",
        whyWrong: {
          b: "Curly braces with key: value make a dictionary, not a list.",
          c: "That would be a set comprehension, without a colon.",
          d: "range(3) starts at 0.",
        },
      },
      {
        id: "ppq41-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-comprehensions",
        prompt: "x = 7\nprint(\"odd\" if x % 2 else \"even\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "odd" },
          { id: "b", text: "even" },
          { id: "c", text: "1" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "7 % 2 is 1, which is truthy, so the conditional expression gives \"odd\".",
        whyWrong: {
          b: "1 is truthy, so the first value is chosen.",
          c: "The expression chooses between the two strings.",
          d: "This conditional expression is valid Python.",
        },
      },
      {
        id: "ppq41-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-nested-processing",
        prompt: "totals[key] = totals.get(key, 0) + amount does what the first time key appears?",
        options: [
          { id: "a", text: "Starts that key's total at 0 + amount" },
          { id: "b", text: "Raises KeyError" },
          { id: "c", text: "Does nothing" },
          { id: "d", text: "Sets the total to None" },
        ],
        correct: "a",
        explanation: "get returns the default 0 for a missing key, so the group starts with the amount.",
        whyWrong: {
          b: "get never raises KeyError.",
          c: "It assigns the new total.",
          d: "The default is 0, not None.",
        },
      },
      {
        id: "ppq41-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-nested-processing",
        prompt: "data = [{\"k\": \"a\", \"v\": [1, 2]}, {\"k\": \"a\", \"v\": [3]}]\nt = {}\nfor d in data:\n    t[d[\"k\"]] = t.get(d[\"k\"], 0) + sum(d[\"v\"])\nprint(t)\n\nWhat is printed?",
        options: [
          { id: "a", text: "{'a': 6}" },
          { id: "b", text: "{'a': 3}" },
          { id: "c", text: "{'a': [1, 2, 3]}" },
          { id: "d", text: "{'a': 3, 'a': 3}" },
        ],
        correct: "a",
        explanation: "Both records share key a: 3 from the first, plus 3 from the second.",
        whyWrong: {
          b: "The second record adds to the first instead of replacing it.",
          c: "sum() adds the numbers.",
          d: "A dictionary cannot hold the same key twice.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l42-filter-generators": {
    lessonId: "pp-l42-filter-generators",
    passMark: 70,
    questions: [
      {
        id: "ppq42-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-search-filter",
        prompt: "counts = {\"a\": 2, \"b\": 5, \"c\": 3}\nprint(max(counts, key=counts.get))\n\nWhat is printed?",
        options: [
          { id: "a", text: "b" },
          { id: "b", text: "5" },
          { id: "c", text: "c" },
          { id: "d", text: "('b', 5)" },
        ],
        correct: "a",
        explanation: "max loops over the keys and compares them by their values; b has the largest value.",
        whyWrong: {
          b: "max returns the key, not the value.",
          c: "c is alphabetically largest, but the key compares by value.",
          d: "Looping over a dictionary gives keys only.",
        },
      },
      {
        id: "ppq42-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-search-filter",
        prompt: "print(next((n for n in [1, 3, 5] if n % 2 == 0), \"none\"))\n\nWhat is printed?",
        options: [
          { id: "a", text: "none" },
          { id: "b", text: "StopIteration" },
          { id: "c", text: "1" },
          { id: "d", text: "[]" },
        ],
        correct: "a",
        explanation: "No even number exists, so next() returns its default instead of raising.",
        whyWrong: {
          b: "The default prevents StopIteration.",
          c: "1 is odd.",
          d: "next returns a single value or the default.",
        },
      },
      {
        id: "ppq42-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-generators",
        prompt: "Why is sum(x * x for x in data) better than sum([x * x for x in data]) for a very large dataset?",
        options: [
          { id: "a", text: "The generator produces values one at a time instead of building a whole list in memory" },
          { id: "b", text: "It gives a different, more accurate answer" },
          { id: "c", text: "Lists cannot be summed" },
          { id: "d", text: "There is no difference at all" },
        ],
        correct: "a",
        explanation: "Same answer, but the generator version never stores all the squares at once.",
        whyWrong: {
          b: "Both give the same result.",
          c: "sum() works on lists.",
          d: "Memory use differs a lot for large data.",
        },
      },
      {
        id: "ppq42-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-readability",
        prompt: "When should you prefer a normal for loop over a comprehension?",
        options: [
          { id: "a", text: "When the logic has several steps, side effects such as printing, or nested conditions" },
          { id: "b", text: "Never; comprehensions are always better" },
          { id: "c", text: "Only when the list has more than 100 items" },
          { id: "d", text: "When you want the code to run slower" },
        ],
        correct: "a",
        explanation: "Comprehensions suit simple transformations and filters; complex logic reads better as named steps in a loop.",
        whyWrong: {
          b: "A dense comprehension can be much harder to read and check.",
          c: "Size is not the deciding factor; clarity is.",
          d: "Readability, not speed, is the reason.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
