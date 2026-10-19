/**
 * PYTHON PROGRAMMING · MODULE 9 · LISTS, TUPLES, SETS AND DICTIONARIES
 *
 * Curriculum 9.1 – 9.11. Python's four core collections: building them,
 * changing them, looping over them, choosing between them, and the aliasing
 * trap that comes with mutable objects.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s9-collections";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 9.1 – 9.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l35-lists",
    moduleId: "pp-m9-collections",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3"],
    title: "Lists",
    subtitle: "Indexing, slicing, nesting, changing and sorting",
    estimatedMinutes: 20,
    intro:
      "A class has forty students; storing forty scores in forty variables would be absurd. A list holds any number of values, in order, under one name. It is the collection you will use most.",

    atoms: [
      {
        id: "a-pp-list-basics",
        title: "Lists: indexing, slicing and nested lists",
        explain:
          "A list is written in square brackets with commas between the items: scores = [72, 58, 91]. It is indexed and sliced exactly like a string, from 0, with negative indexes from the end. len() gives its length. A list can hold any types, including other lists: a nested list is a grid, reached with two indexes, grid[row][col].",
        code: {
          language: PY,
          code: 'scores = [72, 58, 91, 64]\nprint(scores[0], scores[-1], len(scores))\nprint(scores[1:3])\ngrid = [[1, 2, 3], [4, 5, 6]]\nprint(grid[1])\nprint(grid[1][2])\n',
          expectedOutput: "72 64 4\n[58, 91]\n[4, 5, 6]\n6",
        },
      },
      {
        id: "a-pp-list-changes",
        title: "Adding, updating and removing elements",
        explain:
          "Unlike strings, lists are mutable: they can be changed in place. append(x) adds to the end, insert(i, x) adds at a position, list[i] = x replaces an item, remove(x) deletes the first matching value, pop() removes and returns the last item (or pop(i) a given one), and del list[i] deletes by position.",
        code: {
          language: PY,
          code: 'cart = ["rice", "beans"]\ncart.append("oil")\ncart.insert(0, "salt")\ncart[2] = "garri"\nprint(cart)\ncart.remove("salt")\nlast = cart.pop()\nprint(cart, last)\n',
          expectedOutput: "['salt', 'rice', 'garri', 'oil']\n['rice', 'garri'] oil",
        },
        codeChallenge: {
          task: "Shopping cart. Start with cart = [] and read commands from the user until they type done: add ITEM adds an item, remove ITEM removes it (print Not in cart if it is not there), show prints the cart. After done, print Items: N.",
          starter: "cart = []\n",
          sample: "Command: add bread\nCommand: add milk\nCommand: remove eggs\nNot in cart\nCommand: show\n['bread', 'milk']\nCommand: done\nItems: 2",
          tests: [
            {
              inputs: ["add bread", "add milk", "remove eggs", "show", "remove bread", "show", "done"],
              check:
                'assert "Not in cart" in lines, "Removing something not in the cart should print Not in cart."\n' +
                'assert "[\'bread\', \'milk\']" in lines and "[\'milk\']" in lines, "show should print the cart list each time. Yours: " + repr(lines)\n' +
                'assert lines[-1] == "Items: 1", "After done, print Items: 1. Yours: " + lines[-1]',
            },
          ],
          solution: 'cart = []\nwhile True:\n    command = input("Command: ")\n    if command == "done":\n        break\n    if command.startswith("add "):\n        cart.append(command[4:])\n    elif command.startswith("remove "):\n        item = command[7:]\n        if item in cart:\n            cart.remove(item)\n        else:\n            print("Not in cart")\n    elif command == "show":\n        print(cart)\nprint("Items:", len(cart))\n',
          hint: "while True: read a command; break on done. Use command[4:] to get the item after \"add \", and check item in cart before removing.",
          successMessage: "A loop, string slicing, decisions and a mutable list: four modules working together in one program.",
        },
      },
      {
        id: "a-pp-list-sorting",
        title: "List methods and sorting",
        explain:
          "list.sort() sorts the list in place (and returns None); sorted(list) returns a NEW sorted list and leaves the original alone. Both take reverse=True for largest first. Other useful tools: sum(), min(), max(), list.count(x), list.index(x) and list.reverse().",
        code: {
          language: PY,
          code: 'scores = [64, 91, 58, 72]\nprint(sorted(scores))\nprint(scores)\nscores.sort(reverse=True)\nprint(scores)\nprint(sum(scores), max(scores), scores.index(58))\n',
          expectedOutput: "[58, 64, 72, 91]\n[64, 91, 58, 72]\n[91, 72, 64, 58]\n285 91 3",
        },
        codeChallenge: {
          task: "Write top_three(scores) that returns a NEW list of the three highest scores, highest first, without changing the list passed in. If there are fewer than three scores, return them all, sorted highest first.",
          starter: "def top_three(scores):\n    scores.sort()\n    return scores[:3]\n",
          sample: "top_three([55, 90, 72, 88, 61]) → [90, 88, 72]",
          tests: [
            {
              check:
                'data = [55, 90, 72, 88, 61]\n' +
                'assert top_three(data) == [90, 88, 72], "top_three([55, 90, 72, 88, 61]) should be [90, 88, 72]. Got " + repr(top_three([55, 90, 72, 88, 61]))\n' +
                'assert data == [55, 90, 72, 88, 61], "The original list must not be changed. Use sorted(), which returns a new list."\n' +
                'assert top_three([40, 70]) == [70, 40], "With two scores, return both, highest first."',
            },
          ],
          solution: "def top_three(scores):\n    return sorted(scores, reverse=True)[:3]\n",
          hint: "sorted(scores, reverse=True) gives a new list, highest first. Slice the first three.",
          successMessage: "sorted() versus .sort() matters: one leaves the caller's data alone, the other changes it. Functions should not surprise their callers by changing their data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 9.4 – 9.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l36-iterate-tuples",
    moduleId: "pp-m9-collections",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.4", "9.5"],
    title: "Iterating Collections, and Tuples",
    subtitle: "Looping over data, and fixed records",
    estimatedMinutes: 18,
    intro:
      "Collections become useful when you loop over them: total them, search them, filter them. And when a group of values belongs together and should not change, such as one student's name and score, a tuple holds it.",

    atoms: [
      {
        id: "a-pp-iterating",
        title: "Iterating over collections",
        explain:
          "for item in collection: visits every item in order. Build results with the patterns from Module 6: an accumulator for a total, a counter, a running best value, or a new list built with append(). Do not change a list while looping over it; build a new one instead.",
        code: {
          language: PY,
          code: 'prices = [1200, 450, 3000, 800]\nexpensive = []\nfor p in prices:\n    if p >= 1000:\n        expensive.append(p)\nprint(expensive)\nprint("Average:", sum(prices) / len(prices))\n',
          expectedOutput: "[1200, 3000]\nAverage: 1362.5",
        },
        codeChallenge: {
          task: "Write summary(scores) that, using a loop (not sum, min or max), returns three values: the number of scores that passed (50 or more), the highest score, and the lowest score.",
          starter: "def summary(scores):\n    pass\n",
          sample: "summary([45, 72, 50, 88, 31]) → (3, 88, 31)",
          tests: [
            {
              check:
                'assert tuple(summary([45, 72, 50, 88, 31])) == (3, 88, 31), "summary([45, 72, 50, 88, 31]) should be (3, 88, 31). Got " + repr(summary([45, 72, 50, 88, 31]))\n' +
                'assert tuple(summary([60])) == (1, 60, 60), "One score is both highest and lowest."\n' +
                'assert tuple(summary([10, 20])) == (0, 20, 10), "No passes gives 0."\n' +
                'assert not (calls("max") or calls("min") or calls("sum")), "Use a loop instead of max, min or sum, to practise the pattern."',
            },
          ],
          solution: "def summary(scores):\n    passed = 0\n    highest = scores[0]\n    lowest = scores[0]\n    for s in scores:\n        if s >= 50:\n            passed += 1\n        if s > highest:\n            highest = s\n        if s < lowest:\n            lowest = s\n    return passed, highest, lowest\n",
          hint: "Start highest and lowest at scores[0]. In the loop, replace them whenever a score beats them.",
          successMessage: "Counter, running maximum, running minimum: in one loop. Built-ins like max() do exactly this inside.",
        },
      },
      {
        id: "a-pp-tuples",
        title: "Tuples and immutable sequences",
        explain:
          "A tuple is like a list in round brackets that cannot be changed: student = (\"Ada\", 72). Use a tuple for a fixed record whose parts belong together, and unpack it into names: name, score = student. A list of tuples is a simple table, and looping with for name, score in records: unpacks each row.",
        code: {
          language: PY,
          code: 'records = [("Ada", 72), ("Bayo", 45), ("Chi", 88)]\nfor name, score in records:\n    print(f"{name:<6}{score}")\nfirst = records[0]\nprint(first[0])\nfirst[1] = 99\n',
          expectedOutput: "Ada   72\nBayo  45\nChi   88\nAda",
          raises: "TypeError: 'tuple' object does not support item assignment",
        },
        codeChallenge: {
          task: "Student records. Write passed_names(records) that takes a list of (name, score) tuples and returns a list of the names of students who scored 50 or more, in the same order.",
          starter: "def passed_names(records):\n    pass\n",
          sample: "passed_names([(\"Ada\", 72), (\"Bayo\", 45), (\"Chi\", 88)]) → ['Ada', 'Chi']",
          tests: [
            {
              check:
                'assert passed_names([("Ada", 72), ("Bayo", 45), ("Chi", 88)]) == ["Ada", "Chi"], "Got " + repr(passed_names([("Ada", 72), ("Bayo", 45), ("Chi", 88)]))\n' +
                'assert passed_names([("Dan", 50)]) == ["Dan"], "50 is a pass."\n' +
                'assert passed_names([]) == [], "No records gives an empty list."',
            },
          ],
          solution: "def passed_names(records):\n    names = []\n    for name, score in records:\n        if score >= 50:\n            names.append(name)\n    return names\n",
          hint: "for name, score in records: unpacks each tuple. Append the name when score >= 50.",
          successMessage: "A list of tuples is a table, and unpacking in the for line reads it row by row.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 9.6 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l37-sets-dicts",
    moduleId: "pp-m9-collections",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.6", "9.7", "9.8"],
    title: "Sets and Dictionaries",
    subtitle: "Uniqueness, and looking things up by key",
    estimatedMinutes: 22,
    intro:
      "Lists are found by position. Often you want something else: \"have I seen this before?\" (a set) or \"what is Ada's phone number?\" (a dictionary). These two collections answer those questions instantly, however much data they hold.",

    atoms: [
      {
        id: "a-pp-sets",
        title: "Sets, uniqueness and set operations",
        explain:
          "A set holds unique values in no particular order: {\"a\", \"b\"}, or set(list) to remove duplicates (an empty set is set(), because {} is an empty dictionary). add() and remove() change it; in is very fast. Set operations compare groups: a | b union (in either), a & b intersection (in both), a - b difference (in a but not b).",
        code: {
          language: PY,
          code: 'maths = {"Ada", "Bayo", "Chi"}\nphysics = {"Chi", "Dan", "Ada"}\nprint(sorted(maths & physics))\nprint(sorted(maths | physics))\nprint(sorted(maths - physics))\nprint(len(set([3, 1, 3, 2, 1])))\n',
          expectedOutput: "['Ada', 'Chi']\n['Ada', 'Bayo', 'Chi', 'Dan']\n['Bayo']\n3",
        },
        why: "Printing a set directly shows its items in an unpredictable order, so sorted() is used here to make the output reliable.",
        codeChallenge: {
          task: "Duplicate-value remover. Write remove_duplicates(items) that returns a new list with duplicates removed but the ORIGINAL order kept (set() alone loses the order). Use a set to remember what you have already seen.",
          starter: "def remove_duplicates(items):\n    return list(set(items))\n",
          sample: "remove_duplicates([3, 1, 3, 2, 1]) → [3, 1, 2]",
          tests: [
            {
              check:
                'assert remove_duplicates([3, 1, 3, 2, 1]) == [3, 1, 2], "Got " + repr(remove_duplicates([3, 1, 3, 2, 1]))\n' +
                'assert remove_duplicates(["b", "a", "b", "c", "a"]) == ["b", "a", "c"], "Got " + repr(remove_duplicates(["b", "a", "b", "c", "a"]))\n' +
                'assert remove_duplicates([]) == [], "An empty list stays empty."',
            },
          ],
          solution: "def remove_duplicates(items):\n    seen = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result\n",
          hint: "seen = set() and result = []. For each item: if it is not in seen, add it to both.",
          successMessage: "A set for fast \"seen before?\" checks and a list for order. Combining collections for their strengths is a core skill.",
        },
      },
      {
        id: "a-pp-dicts",
        title: "Dictionaries and key-value relationships",
        explain:
          "A dictionary maps keys to values: phone = {\"Ada\": \"0803...\", \"Bayo\": \"0805...\"}. Look up with phone[\"Ada\"]; add or update with phone[\"Chi\"] = \"0810...\"; delete with del phone[\"Bayo\"]. Keys must be unique and immutable (strings, numbers, tuples). Looking up a missing key raises KeyError; check with in first, or use get().",
        code: {
          language: PY,
          code: 'stock = {"rice": 20, "beans": 15}\nstock["oil"] = 8\nstock["rice"] -= 5\nprint(stock)\nprint(stock["beans"], "beans" in stock, "salt" in stock)\nprint(stock["salt"])\n',
          expectedOutput: "{'rice': 15, 'beans': 15, 'oil': 8}\n15 True False",
          raises: "KeyError: 'salt'",
        },
        codeChallenge: {
          task: "Contact book. Start with contacts = {}. Read commands until done: add NAME NUMBER stores a contact, find NAME prints the number or No contact named NAME, list prints every name and number as NAME: NUMBER in alphabetical order of name.",
          starter: "contacts = {}\n",
          sample: "Command: add Ada 0803\nCommand: add Bayo 0805\nCommand: find Ada\n0803\nCommand: find Chi\nNo contact named Chi\nCommand: list\nAda: 0803\nBayo: 0805\nCommand: done",
          tests: [
            {
              inputs: ["add Bayo 0805", "add Ada 0803", "find Ada", "find Chi", "list", "done"],
              check:
                'assert "0803" in lines and "No contact named Chi" in lines, "find should print the number or No contact named NAME. Yours: " + repr(lines)\n' +
                'i = lines.index("Command: list")\n' +
                'assert lines[i + 1:i + 3] == ["Ada: 0803", "Bayo: 0805"], "list should print contacts alphabetically. Yours: " + repr(lines[i + 1:i + 3])\n' +
                'assert contacts == {"Bayo": "0805", "Ada": "0803"}, "Store contacts in the contacts dictionary."',
            },
          ],
          solution: 'contacts = {}\nwhile True:\n    parts = input("Command: ").split()\n    if not parts or parts[0] == "done":\n        break\n    if parts[0] == "add":\n        contacts[parts[1]] = parts[2]\n    elif parts[0] == "find":\n        name = parts[1]\n        if name in contacts:\n            print(contacts[name])\n        else:\n            print("No contact named", name)\n    elif parts[0] == "list":\n        for name in sorted(contacts):\n            print(f"{name}: {contacts[name]}")\n',
          hint: "split() the command into parts. contacts[parts[1]] = parts[2] adds. sorted(contacts) gives the keys in order.",
          successMessage: "A working contact book. A dictionary finds Ada instantly whether it holds ten contacts or ten million.",
        },
      },
      {
        id: "a-pp-dict-methods",
        title: "Dictionary methods and nested dictionaries",
        explain:
          "get(key, default) returns a default instead of raising KeyError. keys(), values() and items() give views to loop over; for k, v in d.items(): is the common one. A value can itself be a dictionary or list, so a record is a dict, and a collection of records is a dict of dicts: inventory[\"rice\"][\"price\"].",
        code: {
          language: PY,
          code: 'inventory = {\n    "rice": {"qty": 20, "price": 45000},\n    "oil": {"qty": 8, "price": 12000},\n}\nfor item, info in inventory.items():\n    print(item, info["qty"] * info["price"])\nprint(inventory.get("salt", "not stocked"))\n',
          expectedOutput: "rice 900000\noil 96000\nnot stocked",
        },
        codeChallenge: {
          task: "Inventory tracker. Write sell(inventory, item, qty) that reduces the item's qty and returns True, or returns False without changing anything if the item is unknown or there is not enough stock. Write stock_value(inventory) that returns the total value (qty × price) of everything.",
          starter: "def sell(inventory, item, qty):\n    pass\n\ndef stock_value(inventory):\n    pass\n",
          sample: "sell(inv, \"rice\", 5) → True\nstock_value(inv) → 771000",
          tests: [
            {
              check:
                'inv = {"rice": {"qty": 20, "price": 45000}, "oil": {"qty": 8, "price": 12000}}\n' +
                'assert stock_value(inv) == 996000, "Starting value is 900000 + 96000 = 996000. Got " + repr(stock_value(inv))\n' +
                'assert sell(inv, "rice", 5) is True and inv["rice"]["qty"] == 15, "Selling 5 rice should return True and leave 15."\n' +
                'assert sell(inv, "oil", 9) is False and inv["oil"]["qty"] == 8, "Selling 9 oil when only 8 exist should return False and change nothing."\n' +
                'assert sell(inv, "salt", 1) is False, "Unknown items return False."\n' +
                'assert stock_value(inv) == 771000, "After selling 5 rice the value is 771000. Got " + repr(stock_value(inv))',
            },
          ],
          solution: 'def sell(inventory, item, qty):\n    if item not in inventory or inventory[item]["qty"] < qty:\n        return False\n    inventory[item]["qty"] -= qty\n    return True\n\ndef stock_value(inventory):\n    total = 0\n    for info in inventory.values():\n        total += info["qty"] * info["price"]\n    return total\n',
          hint: "In sell, check item not in inventory OR not enough qty first and return False. In stock_value, loop over inventory.values().",
          successMessage: "A nested dictionary used as a small database, with validation before every change. This is the shape of the data in the Phase 2 project.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 9.9 – 9.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l38-mutability-copying",
    moduleId: "pp-m9-collections",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.9", "9.10", "9.11"],
    title: "Membership, Mutability, Copying and Comprehensions",
    subtitle: "in, the aliasing trap, copies, and building lists in one line",
    estimatedMinutes: 20,
    intro:
      "Mutable collections bring one trap that catches every Python programmer once: two names for the same list. This lesson shows the trap, the fix, and then a compact way to build new lists from old ones.",

    atoms: [
      {
        id: "a-pp-membership",
        title: "Membership testing",
        explain:
          "x in collection works on every collection. For a list or tuple it checks items one by one, so it slows down as the list grows. For a set or a dictionary (where it checks keys) it is effectively instant at any size. If you test membership often, keep the data in a set or dict.",
        code: {
          language: PY,
          code: 'banned = {"spam", "scam"}\nwords = "this is not a scam".split()\nprint("scam" in banned)\nprint([w for w in words if w in banned])\nages = {"Ada": 17}\nprint("Ada" in ages, 17 in ages)\n',
          expectedOutput: "True\n['scam']\nTrue False",
        },
        why: "17 in ages is False because in checks a dictionary's KEYS, not its values. Use 17 in ages.values() to search values.",
      },
      {
        id: "a-pp-aliasing",
        title: "Mutable versus immutable, and aliasing",
        explain:
          "Immutable objects (int, float, str, tuple) cannot change, so sharing them is harmless. Mutable objects (list, dict, set) can. b = a does NOT copy a list: it makes b a second name for the SAME list, an alias. Change it through either name and both see the change. Passing a list to a function also passes the same list.",
        codeExercise: {
          language: PY,
          code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\nx = 10\ny = x\ny += 1\nprint(x)\n",
          question: "Watch which values are mutable. What does this print?",
          expectedOutput: "[1, 2, 3, 4]\n10",
          hint: "b is the same list as a. But y += 1 makes y refer to a NEW int; x is untouched.",
          successMessage: "The list changed through its alias; the int did not, because ints are immutable and += created a new one. Keep this picture in mind whenever data changes unexpectedly.",
        },
      },
      {
        id: "a-pp-copy-comprehension",
        title: "Copying, and basic list comprehensions",
        explain:
          "To get an independent list, copy it: a.copy(), list(a) or a[:]. (For nested lists, copy.deepcopy copies the inner lists too.) A list comprehension builds a new list in one expression: [expression for item in collection if condition]. It is a compact form of the loop-and-append pattern.",
        code: {
          language: PY,
          code: 'scores = [45, 72, 50, 88]\nboosted = [s + 5 for s in scores]\npassed = [s for s in scores if s >= 50]\nprint(boosted)\nprint(passed)\noriginal = [1, 2]\ncopy = original.copy()\ncopy.append(3)\nprint(original, copy)\n',
          expectedOutput: "[50, 77, 55, 93]\n[72, 50, 88]\n[1, 2] [1, 2, 3]",
        },
        codeChallenge: {
          task: "This function should return a curved copy of the scores (every score plus 5, capped at 100) WITHOUT changing the caller's list, but it damages the original. Rewrite it as a single list comprehension using min(score + 5, 100).",
          starter: "def curve(scores):\n    result = scores\n    for i in range(len(result)):\n        result[i] = min(result[i] + 5, 100)\n    return result\n",
          sample: "curve([45, 98, 70]) → [50, 100, 75], and the original is unchanged",
          tests: [
            {
              check:
                'data = [45, 98, 70]\n' +
                'assert curve(data) == [50, 100, 75], "curve([45, 98, 70]) should be [50, 100, 75]. Got " + repr(curve([45, 98, 70]))\n' +
                'assert data == [45, 98, 70], "The original list was changed. result = scores is an alias, not a copy."\n' +
                'assert uses("ListComp"), "Write it as a list comprehension."',
            },
          ],
          solution: "def curve(scores):\n    return [min(s + 5, 100) for s in scores]\n",
          hint: "return [min(s + 5, 100) for s in scores] builds a brand-new list, so the original cannot be touched.",
          successMessage: "One line, a new list, and the caller's data is safe. The starter's bug, result = scores, is the aliasing trap in its most common form.",
        },
      },
    ],

    task: {
      title: "Module 9 practice: five collection programs",
      intro: "Choose the collection deliberately in each one and write a comment explaining why. The milestone is to select and use the appropriate collection for a problem.",
      prompts: [
        "Shopping cart: a dictionary of item → quantity with add, remove, change quantity and a total using a price dictionary.",
        "Student records: a list of dictionaries, each with name, class and a list of scores; print each student's average.",
        "Inventory tracker: a nested dictionary with restock, sell and a low-stock report (qty below 5).",
        "Contact book: add, find, update, delete and list, refusing duplicate names.",
        "Duplicate-value remover: remove duplicates from a list of emails, ignoring capitals, keeping the first spelling seen.",
      ],
      closing: "Next: working with collections fluently: enumerate, zip, sorting by key, comprehensions and generators.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
