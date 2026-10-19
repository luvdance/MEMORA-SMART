/**
 * PYTHON PROGRAMMING · MODULE 10 · WORKING WITH COLLECTIONS AND ITERATION
 *
 * Curriculum 10.1 – 10.9. Iterables and iterators, enumerate and zip, sorting
 * with keys, any and all, comprehensions, nested data, searching and
 * filtering, generator expressions, and when NOT to be clever.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s10-iteration";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 10.1 – 10.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l39-enumerate-zip",
    moduleId: "pp-m10-iteration",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2"],
    title: "Iterables, enumerate() and zip()",
    subtitle: "What for really loops over, with positions and in pairs",
    estimatedMinutes: 16,
    intro:
      "A for loop works on strings, lists, tuples, sets, dictionaries, range() and files. This lesson explains what they have in common, and two built-ins that remove most of the index arithmetic from loops.",

    atoms: [
      {
        id: "a-pp-iterables",
        title: "Iterables and iterators",
        explain:
          "An ITERABLE is anything a for loop can walk over. Behind the scenes, for asks the iterable for an ITERATOR with iter(), then calls next() on it repeatedly until it raises StopIteration, which ends the loop quietly. You rarely call these yourself, but knowing the protocol explains why some objects can be looped over only once.",
        code: {
          language: PY,
          code: 'it = iter(["a", "b"])\nprint(next(it))\nprint(next(it))\nprint(next(it))\n',
          expectedOutput: "a\nb",
          raises: "StopIteration",
        },
      },
      {
        id: "a-pp-enumerate-zip",
        title: "enumerate() and zip()",
        explain:
          "enumerate(items, start=1) gives (position, item) pairs, so you never need range(len(items)). zip(a, b) walks two (or more) collections side by side, giving one item from each per pass; it stops at the shortest. Both are unpacked in the for line.",
        code: {
          language: PY,
          code: 'names = ["Ada", "Bayo", "Chi"]\nscores = [72, 45, 88]\nfor i, name in enumerate(names, start=1):\n    print(i, name)\nfor name, score in zip(names, scores):\n    print(f"{name}: {score}")\n',
          expectedOutput: "1 Ada\n2 Bayo\n3 Chi\nAda: 72\nBayo: 45\nChi: 88",
        },
        codeChallenge: {
          task: "Write report_lines(names, scores) that returns a list of numbered lines like 1. Ada - 72, pairing each name with its score. Use enumerate and zip together, not indexes.",
          starter: "def report_lines(names, scores):\n    lines_out = []\n    for i in range(len(names)):\n        lines_out.append(str(i) + \". \" + names[i])\n    return lines_out\n",
          sample: "report_lines([\"Ada\", \"Bayo\"], [72, 45]) → ['1. Ada - 72', '2. Bayo - 45']",
          tests: [
            {
              check:
                'assert report_lines(["Ada", "Bayo"], [72, 45]) == ["1. Ada - 72", "2. Bayo - 45"], "Got " + repr(report_lines(["Ada", "Bayo"], [72, 45]))\n' +
                'assert report_lines([], []) == [], "Empty lists give an empty result."\n' +
                'assert calls("enumerate") and calls("zip"), "Use enumerate() and zip()."',
            },
          ],
          solution: 'def report_lines(names, scores):\n    return [f"{i}. {name} - {score}" for i, (name, score) in enumerate(zip(names, scores), start=1)]\n',
          hint: "for i, (name, score) in enumerate(zip(names, scores), start=1): the brackets unpack the pair that zip produces.",
          successMessage: "No indexes, no off-by-one: enumerate numbers the rows and zip pairs the columns.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 10.3 – 10.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l40-sort-key-any-all",
    moduleId: "pp-m10-iteration",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.3", "10.4"],
    title: "Sorting with Keys, any() and all()",
    subtitle: "Ordering records by what matters, and asking questions of a whole collection",
    estimatedMinutes: 18,
    intro:
      "Sorting numbers is easy. Sorting students by score, then by name, needs a key. And questions like \"did anyone fail?\" or \"are all scores valid?\" have one-word answers in Python: any and all.",

    atoms: [
      {
        id: "a-pp-sort-key",
        title: "Sorting with key functions",
        explain:
          "sorted(items, key=f) sorts by f(item) instead of the item itself. key=len sorts strings by length. For records, use a small function or a lambda (a one-line, unnamed function): key=lambda r: r[1] sorts tuples by their second value. To sort by several things, return a tuple: key=lambda r: (-r[1], r[0]) is highest score first, then name A to Z.",
        code: {
          language: PY,
          code: 'records = [("Chi", 88), ("Ada", 72), ("Bayo", 88)]\nprint(sorted(records, key=lambda r: r[1]))\nprint(sorted(records, key=lambda r: (-r[1], r[0])))\nprint(sorted(["kiwi", "fig", "banana"], key=len))\n',
          expectedOutput: "[('Ada', 72), ('Chi', 88), ('Bayo', 88)]\n[('Bayo', 88), ('Chi', 88), ('Ada', 72)]\n['fig', 'kiwi', 'banana']",
        },
        codeChallenge: {
          task: "Rank examination scores. Write rank(records) that takes (name, score) tuples and returns ranking lines like 1. Bayo 88, sorted by score highest first, and alphabetically by name when scores are equal.",
          starter: "def rank(records):\n    pass\n",
          sample: "rank([(\"Chi\", 88), (\"Ada\", 72), (\"Bayo\", 88)]) → ['1. Bayo 88', '2. Chi 88', '3. Ada 72']",
          tests: [
            {
              check:
                'assert rank([("Chi", 88), ("Ada", 72), ("Bayo", 88)]) == ["1. Bayo 88", "2. Chi 88", "3. Ada 72"], "Got " + repr(rank([("Chi", 88), ("Ada", 72), ("Bayo", 88)]))\n' +
                'assert rank([("Zed", 50)]) == ["1. Zed 50"], "One record ranks first."\n' +
                'assert "key=" in source, "Use sorted() with a key."',
            },
          ],
          solution: 'def rank(records):\n    ordered = sorted(records, key=lambda r: (-r[1], r[0]))\n    return [f"{i}. {name} {score}" for i, (name, score) in enumerate(ordered, start=1)]\n',
          hint: "sorted(records, key=lambda r: (-r[1], r[0])), then enumerate from 1 to number the lines.",
          successMessage: "A tie-breaking sort and numbered output. Leaderboards, league tables and class rankings are built exactly this way.",
        },
      },
      {
        id: "a-pp-any-all",
        title: "any() and all()",
        explain:
          "any(iterable) is True if at least one item is truthy; all(iterable) is True only if every item is. They pair naturally with a generator expression: all(0 <= s <= 100 for s in scores) asks \"is every score valid?\". Both stop as soon as the answer is known. all of an empty collection is True; any of an empty collection is False.",
        code: {
          language: PY,
          code: 'scores = [72, 45, 88, 30]\nprint(any(s < 40 for s in scores))\nprint(all(s >= 40 for s in scores))\nprint(all(0 <= s <= 100 for s in scores))\n',
          expectedOutput: "True\nFalse\nTrue",
        },
        codeChallenge: {
          task: "Write check_scores(scores) that returns Invalid data if any score is outside 0 to 100, All passed if every score is 50 or more, and otherwise Some failed. Use any() or all() for each test.",
          starter: "def check_scores(scores):\n    pass\n",
          sample: "check_scores([72, 105]) → Invalid data",
          tests: [
            {
              check:
                'assert check_scores([72, 105]) == "Invalid data", "105 is outside 0–100."\n' +
                'assert check_scores([-1, 60]) == "Invalid data", "-1 is outside 0–100."\n' +
                'assert check_scores([50, 99, 70]) == "All passed", "Every score is 50 or more."\n' +
                'assert check_scores([50, 49]) == "Some failed", "49 failed."\n' +
                'assert calls("any") or calls("all"), "Use any() or all()."',
            },
          ],
          solution: 'def check_scores(scores):\n    if not all(0 <= s <= 100 for s in scores):\n        return "Invalid data"\n    if all(s >= 50 for s in scores):\n        return "All passed"\n    return "Some failed"\n',
          hint: "Check validity first: if not all(0 <= s <= 100 for s in scores). Then all(s >= 50 ...).",
          successMessage: "Whole-collection questions answered in one readable line each.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 10.5 – 10.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l41-comprehensions-nested",
    moduleId: "pp-m10-iteration",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.5", "10.6"],
    title: "Comprehensions and Nested Data",
    subtitle: "List, dictionary and set comprehensions; processing records inside records",
    estimatedMinutes: 20,
    intro:
      "You met list comprehensions in Module 9. Dictionaries and sets have them too. Then the real-world case: data that is a list of records, each with lists inside, such as sales by region by month.",

    atoms: [
      {
        id: "a-pp-comprehensions",
        title: "List, dictionary and set comprehensions",
        explain:
          "[expr for x in items if cond] builds a list. {key: value for x in items} builds a dictionary. {expr for x in items} builds a set. Each is a loop-and-collect in one expression. Use them for simple transformations and filters; switch back to a normal loop when the logic needs more than one line to read clearly.",
        code: {
          language: PY,
          code: 'words = ["python", "is", "fun", "and", "fast"]\nlengths = {w: len(w) for w in words}\nprint(lengths)\nprint(sorted({w[0] for w in words}))\nprint([w.upper() for w in words if len(w) > 3])\n',
          expectedOutput: "{'python': 6, 'is': 2, 'fun': 3, 'and': 3, 'fast': 4}\n['a', 'f', 'i', 'p']\n['PYTHON', 'FAST']",
        },
        codeChallenge: {
          task: "Using comprehensions only (no for loops with append), write three functions: passed(scores) returns a dict of name → score for students with 50 or more, from a dict of name → score; grades(scores) returns a dict of name → \"PASS\" or \"FAIL\"; and initials(names) returns a set of the first letters of a list of names, in capitals.",
          starter: "def passed(scores):\n    pass\n\ndef grades(scores):\n    pass\n\ndef initials(names):\n    pass\n",
          sample: "passed({\"Ada\": 72, \"Bo\": 40}) → {'Ada': 72}",
          tests: [
            {
              check:
                'scores = {"Ada": 72, "Bo": 40, "Chi": 50}\n' +
                'assert passed(scores) == {"Ada": 72, "Chi": 50}, "Got " + repr(passed(scores))\n' +
                'assert grades(scores) == {"Ada": "PASS", "Bo": "FAIL", "Chi": "PASS"}, "Got " + repr(grades(scores))\n' +
                'assert initials(["ada", "Bo", "amy"]) == {"A", "B"}, "Got " + repr(initials(["ada", "Bo", "amy"]))\n' +
                'assert uses("DictComp") and uses("SetComp"), "Use dictionary and set comprehensions."',
            },
          ],
          solution: 'def passed(scores):\n    return {name: s for name, s in scores.items() if s >= 50}\n\ndef grades(scores):\n    return {name: ("PASS" if s >= 50 else "FAIL") for name, s in scores.items()}\n\ndef initials(names):\n    return {n[0].upper() for n in names}\n',
          hint: "Loop over scores.items() inside the braces. \"PASS\" if s >= 50 else \"FAIL\" is a conditional expression: one value or the other.",
          successMessage: "Three transformations, three readable one-liners. The conditional expression a if cond else b is new here; it is the expression form of if/else.",
        },
      },
      {
        id: "a-pp-nested-processing",
        title: "Nested collection processing",
        explain:
          "Real data nests: a list of dictionaries, each holding a list. Process it with a loop per level, accumulating into a result dictionary. For totals by group, the pattern is result[key] = result.get(key, 0) + amount, which starts a new group at 0 the first time a key appears.",
        code: {
          language: PY,
          code: 'sales = [\n    {"region": "Lagos", "amounts": [100, 250]},\n    {"region": "Kano", "amounts": [80]},\n    {"region": "Lagos", "amounts": [50]},\n]\ntotals = {}\nfor record in sales:\n    region = record["region"]\n    totals[region] = totals.get(region, 0) + sum(record["amounts"])\nprint(totals)\n',
          expectedOutput: "{'Lagos': 400, 'Kano': 80}",
        },
        codeChallenge: {
          task: "Summarise sales records. Write summarise(sales) where each record is a dict with keys rep (a name) and items (a list of (product, amount) tuples). Return a dict of rep → total amount sold, and make sure a rep appearing in several records is added up.",
          starter: "def summarise(sales):\n    pass\n",
          sample: "summarise([{\"rep\": \"Ada\", \"items\": [(\"pen\", 500), (\"ink\", 300)]}]) → {'Ada': 800}",
          tests: [
            {
              check:
                'data = [\n' +
                '    {"rep": "Ada", "items": [("pen", 500), ("ink", 300)]},\n' +
                '    {"rep": "Bo", "items": [("book", 2000)]},\n' +
                '    {"rep": "Ada", "items": [("bag", 1500)]},\n' +
                '    {"rep": "Cy", "items": []},\n' +
                ']\n' +
                'assert summarise(data) == {"Ada": 2300, "Bo": 2000, "Cy": 0}, "Got " + repr(summarise(data))',
            },
          ],
          solution: 'def summarise(sales):\n    totals = {}\n    for record in sales:\n        amount = sum(a for _, a in record["items"])\n        totals[record["rep"]] = totals.get(record["rep"], 0) + amount\n    return totals\n',
          hint: "For each record, add up the amounts in its items (unpack each tuple as product, amount), then totals[rep] = totals.get(rep, 0) + that sum.",
          successMessage: "Two levels of nesting, grouped totals, and a rep with no sales still listed at 0. This is the core of every sales report.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 10.7 – 10.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l42-filter-generators",
    moduleId: "pp-m10-iteration",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.7", "10.8", "10.9"],
    title: "Searching, Filtering and Generators",
    subtitle: "Finding what you need, lazily, and readably",
    estimatedMinutes: 20,
    intro:
      "Most data work is search and filter: find the most common word, keep the records that match, stop at the first hit. Generator expressions do this without building lists you do not need. And every shortcut comes with a responsibility: code must still be readable.",

    atoms: [
      {
        id: "a-pp-search-filter",
        title: "Searching and filtering data",
        explain:
          "Filter with a comprehension: [r for r in records if r[\"city\"] == \"Lagos\"]. Find the FIRST match with next(generator, default), which stops at the first hit. Count frequencies with a dictionary and pick the largest with max(counts, key=counts.get), which returns the key whose value is largest.",
        code: {
          language: PY,
          code: 'people = [{"name": "Ada", "city": "Lagos"}, {"name": "Bo", "city": "Abuja"}]\nprint(next((p["name"] for p in people if p["city"] == "Abuja"), None))\ncounts = {"rice": 4, "beans": 9, "yam": 2}\nprint(max(counts, key=counts.get))\n',
          expectedOutput: "Bo\nbeans",
        },
        codeChallenge: {
          task: "Find the most frequent word. Write most_frequent(text) that ignores capitals, counts every word (split on spaces) and returns the most common one. If two words tie, return the one that appeared first in the text.",
          starter: "def most_frequent(text):\n    pass\n",
          sample: "most_frequent(\"The cat and the hat and THE bat\") → the",
          tests: [
            {
              check:
                'assert most_frequent("The cat and the hat and THE bat") == "the", "Got " + repr(most_frequent("The cat and the hat and THE bat"))\n' +
                'assert most_frequent("b a a b") == "b", "a and b tie at 2; b appeared first. Got " + repr(most_frequent("b a a b"))\n' +
                'assert most_frequent("solo") == "solo", "A single word is the most frequent."',
            },
          ],
          solution: "def most_frequent(text):\n    counts = {}\n    for word in text.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return max(counts, key=counts.get)\n",
          hint: "Count with counts[word] = counts.get(word, 0) + 1. Dictionaries keep insertion order, and max() returns the FIRST largest, so ties go to the earliest word automatically.",
          successMessage: "Count, then choose the maximum by value. This is how search engines and spam filters start analysing text.",
        },
      },
      {
        id: "a-pp-generators",
        title: "Basic generator expressions",
        explain:
          "A generator expression looks like a list comprehension in round brackets: (x * x for x in nums). It does not build a list; it produces values one at a time, on demand. Pass it straight to sum(), max(), any(), all() or next() and memory use stays tiny however large the data is. A generator can only be consumed once.",
        code: {
          language: PY,
          code: 'nums = [3, 8, 1, 6]\nprint(sum(n * n for n in nums))\ngen = (n for n in nums if n > 4)\nprint(list(gen))\nprint(list(gen))\n',
          expectedOutput: "110\n[8, 6]\n[]",
        },
        why: "The second list(gen) is empty: the generator was used up by the first. If you need the values twice, make a list.",
        codeChallenge: {
          task: "Filter a dataset. Write two functions over a list of product dicts with keys name, price and in_stock. total_in_stock(products) returns the total price of in-stock products using sum() with a generator expression. cheapest_in_stock(products) returns the NAME of the cheapest in-stock product, or None if nothing is in stock.",
          starter: "def total_in_stock(products):\n    pass\n\ndef cheapest_in_stock(products):\n    pass\n",
          sample: "total_in_stock(products) → 6500\ncheapest_in_stock(products) → pen",
          tests: [
            {
              check:
                'products = [\n' +
                '    {"name": "bag", "price": 5000, "in_stock": True},\n' +
                '    {"name": "pen", "price": 1500, "in_stock": True},\n' +
                '    {"name": "ink", "price": 900, "in_stock": False},\n' +
                ']\n' +
                'assert total_in_stock(products) == 6500, "5000 + 1500 = 6500. Got " + repr(total_in_stock(products))\n' +
                'assert cheapest_in_stock(products) == "pen", "ink is cheaper but out of stock. Got " + repr(cheapest_in_stock(products))\n' +
                'assert cheapest_in_stock([{"name": "x", "price": 1, "in_stock": False}]) is None, "Nothing in stock returns None."\n' +
                'assert uses("GeneratorExp"), "Use a generator expression."',
            },
          ],
          solution: 'def total_in_stock(products):\n    return sum(p["price"] for p in products if p["in_stock"])\n\ndef cheapest_in_stock(products):\n    available = [p for p in products if p["in_stock"]]\n    if not available:\n        return None\n    return min(available, key=lambda p: p["price"])["name"]\n',
          hint: "sum(p[\"price\"] for p in products if p[\"in_stock\"]). For the cheapest, filter first, handle the empty case, then min(..., key=lambda p: p[\"price\"]).",
          successMessage: "Filtering, aggregating and handling the empty case: the three things every data query has to get right.",
        },
      },
      {
        id: "a-pp-readability",
        title: "Choosing readable code over unnecessary shortcuts",
        explain:
          "A clever one-liner that nobody can read is worse than four clear lines. Use comprehensions and generators when they read naturally (\"the squares of the even numbers\"). Use a normal loop when there are several steps, side effects such as printing, or nested conditions. The test: could a classmate explain your line after one reading?",
        decision: {
          scenario: "Two versions do the same job:\n\nA) result = [x if x > 0 else (0 if x > -10 else -x) for x in data if x is not None and x != 99]\n\nB) A loop of about seven lines with named steps and comments.",
          question: "Which should go into a shared project?",
          options: [
            {
              id: "a",
              text: "A, because it is one line",
              whyWrong: "Line count is not the goal. Nested conditional expressions with two filters are very hard to check or change safely.",
            },
            {
              id: "b",
              text: "B, because the logic has several rules and a reader must be able to check each one",
              why: "Readable code is easier to review, test and fix. Comprehensions are for simple transformations; complex rules deserve named steps.",
            },
            {
              id: "c",
              text: "A, because comprehensions are always faster",
              whyWrong: "Any speed difference here is tiny, and correctness and clarity matter far more.",
            },
            {
              id: "d",
              text: "Neither; write it in a different language",
              whyWrong: "The issue is clarity, which you control in any language.",
            },
          ],
          correct: "b",
          aftermath: "Code is read many more times than it is written. Optimise for the reader.",
        },
      },
    ],

    task: {
      title: "Module 10 practice: four data tasks",
      intro: "Use a small dataset of your own (at least 10 records) for each. The milestone is to process collections of information efficiently and clearly.",
      prompts: [
        "Rank examination scores: ranking with ties broken by name, and the class average.",
        "Summarise sales records: totals by product and by month from a list of sale dictionaries.",
        "Find the most frequent word in a paragraph, ignoring capitals and punctuation, and list the top five.",
        "Filter a dataset: from a list of student records, list those in a given class with an average above a threshold, sorted by average.",
      ],
      closing: "Next: the Phase 2 project, a complete Student Management System.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
