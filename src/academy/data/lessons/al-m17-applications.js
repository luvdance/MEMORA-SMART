/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 17 · REAL-WORLD APPLICATIONS
 *
 * Curriculum 17.1 – 17.12. Algorithms in search engines, banking,
 * recommendation systems, social media, e-commerce, navigation, AI,
 * cybersecurity, databases, analytics, distributed systems and machine
 * learning. Each case study is a small, real version of the system's core
 * algorithm that the learner writes and tests.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s17-applications";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 17.1 – 17.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l72-search-banking-recommendations",
    moduleId: "al-m17-applications",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2", "17.3", "17.4"],
    title: "Search Engines, Banking, Recommendations and Social Feeds",
    subtitle: "Four case studies",
    estimatedMinutes: 36,
    intro:
      "Behind the products used by billions are algorithms from this course, combined with care. This lesson takes four systems apart and builds the core of each.",

    atoms: [
      {
        id: "a-al-search-engines",
        title: "Algorithms in search engines: how retrieval works",
        explain:
          "A search engine cannot scan billions of pages per query. It precomputes an INVERTED INDEX: for every word, the sorted list of documents containing it (a hash table from word to posting list). A multi-word query INTERSECTS the posting lists of its words; because they are sorted, two lists of lengths m and n intersect in O(m + n), merge-style, starting with the rarest word. Matching documents are then RANKED, by relevance (how often and where the words occur, as in TF-IDF) and by authority (PageRank, computed from the link graph), and the top results are taken with a heap. Crawling the web is a BFS over the link graph.",
        codeChallenge: {
          task: "Build the core of a search engine. build_index(docs) takes a list of document strings and returns a dict mapping each lower-case word to the sorted list of indexes of the documents containing it (each index once). search(index, query) returns the sorted list of document indexes containing EVERY word of the query (lower-cased), or [] if any word is unknown.",
          starter: "def build_index(docs):\n    pass\n\ndef search(index, query):\n    pass\n",
          sample: "search(build_index([\"Fast sorting\", \"sorting algorithms\", \"fast algorithms\"]), \"fast algorithms\") → [2]",
          tests: [
            {
              check: py`docs = ["Merge sort is a fast sort", "Binary search needs sorted data", "Quick sort is fast on average", "Search engines use an inverted index"]
idx = build_index(docs)
assert idx["sort"] == [0, 2], "'sort' appears in documents 0 and 2 (once each in the list). Got " + repr(idx.get("sort"))
assert idx["search"] == [1, 3], "Words are lower-cased: 'Search' and 'search' are the same word."
assert search(idx, "fast sort") == [0, 2], "Both words appear in documents 0 and 2."
assert search(idx, "SEARCH index") == [3], "The query is lower-cased too."
assert search(idx, "fast banana") == [], "An unknown word means no results."
assert search(idx, "") == [] or search(idx, "") == list(range(len(docs))), "An empty query returns nothing (or everything): either is accepted."`,
            },
          ],
          solution: "def build_index(docs):\n    index = {}\n    for i, doc in enumerate(docs):\n        for word in set(doc.lower().split()):\n            index.setdefault(word, []).append(i)\n    return index\n\ndef search(index, query):\n    words = query.lower().split()\n    if not words:\n        return []\n    result = None\n    for word in words:\n        if word not in index:\n            return []\n        postings = set(index[word])\n        result = postings if result is None else result & postings\n    return sorted(result)\n",
          hint: "build_index: for each document i, for each distinct lower-cased word, append i to index[word] (documents are visited in order, so the lists stay sorted). search: intersect the posting lists of all query words.",
          successMessage: "An inverted index answers a query by touching only the documents that contain its words, not the whole collection. Every search engine starts here.",
        },
      },
      {
        id: "a-al-banking",
        title: "Algorithms in banking: detecting suspicious transactions",
        explain:
          "Banks process millions of transactions an hour and must flag fraud in milliseconds. Core techniques: RULES evaluated in O(1) per transaction (amount above a limit, a new country); VELOCITY CHECKS with a SLIDING WINDOW (too many transactions on one card within 60 seconds), maintained with a queue per account so each transaction is added and removed once, O(1) amortized; STATISTICAL ANOMALIES (an amount far from the account's usual mean, kept as a running mean and variance, O(1) space); and GRAPH ANALYSIS of money flows to find rings of accounts passing funds between themselves (cycle detection). Hash tables keyed by account make every check O(1) on average.",
        codeChallenge: {
          task: "Write suspicious_accounts(transactions, window, limit) where transactions is a list of (time_in_seconds, account) sorted by time. Flag an account if MORE than limit of its transactions fall within any period of window seconds (a transaction at time t counts with earlier ones at times > t − window). Keep a deque of recent times per account. Return the flagged accounts as a sorted list.",
          starter: "from collections import deque\n\ndef suspicious_accounts(transactions, window, limit):\n    pass\n",
          sample: "suspicious_accounts([(0, \"A\"), (10, \"A\"), (20, \"A\"), (25, \"A\")], 60, 3) → [\"A\"]",
          tests: [
            {
              check: py`tx = [(0, "A"), (10, "A"), (20, "A"), (25, "A")]
assert suspicious_accounts(tx, 60, 3) == ["A"], "Four transactions within 25 seconds: more than 3 in a 60-second window."
spread = [(0, "B"), (40, "B"), (80, "B"), (120, "B")]
assert suspicious_accounts(spread, 60, 1) == ["B"], "0 and 40 are within 60 seconds: 2 > 1."
assert suspicious_accounts(spread, 30, 1) == [], "With a 30-second window, no two fall together."
mix = [(0, "X"), (1, "Y"), (2, "X"), (3, "Z"), (4, "X"), (70, "Y"), (71, "Y")]
assert suspicious_accounts(mix, 60, 2) == ["X"], "Only X has 3 transactions within 60 seconds (Y's are 69 seconds apart)."
big = [(t, "acct" + str(t % 500)) for t in range(20000)]
assert suspicious_accounts(big, 1000, 3) == [], "20,000 transactions, each account every 500 s: at most 2 per 1,000-second window."
assert suspicious_accounts(big, 1001, 2) != [], "With 1,001 seconds, accounts reach 3 in a window."`,
            },
          ],
          solution: "from collections import deque\n\ndef suspicious_accounts(transactions, window, limit):\n    recent = {}\n    flagged = set()\n    for t, account in transactions:\n        q = recent.setdefault(account, deque())\n        q.append(t)\n        while q[0] <= t - window:\n            q.popleft()\n        if len(q) > limit:\n            flagged.add(account)\n    return sorted(flagged)\n",
          hint: "recent = {account: deque of times}. For each (t, account): append t, pop times <= t - window from the left, and flag the account if more than limit remain.",
          successMessage: "Each transaction enters and leaves its account's window once: O(n) for any number of transactions. This is how velocity rules run in real time.",
        },
      },
      {
        id: "a-al-recommendations-social",
        title: "Recommendation systems and social media ranking",
        explain:
          "RECOMMENDATION engines suggest products from patterns in behaviour. The simplest effective method is CO-OCCURRENCE (item-based collaborative filtering): \"customers who bought X also bought Y\" counts, over all orders containing X, how often each other item appears, then shows the top k. Large systems precompute these counts offline and use similarity measures (cosine similarity) and matrix factorisation. SOCIAL MEDIA FEEDS rank posts by a score combining predicted engagement (likes, comments, shares), the viewer's relationship to the author, and freshness, often with a time-decay such as score ÷ (age + 2)^1.5, then take the top k with a heap: O(n log k) for n candidate posts.",
        codeChallenge: {
          task: "Build a product recommender. also_bought(orders, item, k) receives a list of orders (each a list of product names) and returns up to k other products that appear most often in orders containing item, ordered by count (highest first) and then by name. Count each product at most once per order.",
          starter: "def also_bought(orders, item, k):\n    pass\n",
          sample: "also_bought([[\"rice\", \"beans\"], [\"rice\", \"oil\", \"beans\"], [\"oil\"]], \"rice\", 2) → [\"beans\", \"oil\"]",
          tests: [
            {
              check: py`orders = [["rice", "beans", "oil"], ["rice", "beans"], ["rice", "garri"], ["beans", "oil"], ["rice", "oil", "oil"], ["yam"]]
assert also_bought(orders, "rice", 3) == ["beans", "oil", "garri"], "With rice: beans 2, oil 2 (once per order), garri 1. Ties by name. Got " + repr(also_bought(orders, "rice", 3))
assert also_bought(orders, "rice", 1) == ["beans"], "Only the top 1."
assert also_bought(orders, "yam", 5) == [], "Nothing else was bought with yam."
assert also_bought(orders, "salt", 5) == [], "An item nobody bought."
assert "rice" not in also_bought(orders, "rice", 10), "Never recommend the item itself."`,
            },
          ],
          solution: "def also_bought(orders, item, k):\n    counts = {}\n    for order in orders:\n        products = set(order)\n        if item in products:\n            for p in products:\n                if p != item:\n                    counts[p] = counts.get(p, 0) + 1\n    ranked = sorted(counts, key=lambda p: (-counts[p], p))\n    return ranked[:k]\n",
          hint: "For each order containing item, count every OTHER distinct product (use set(order)). Sort the products by (-count, name) and take the first k.",
          successMessage: "Co-occurrence counting is O(total order size), and it is the baseline every recommendation system is measured against.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 17.5 – 17.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l73-commerce-navigation-ai-security",
    moduleId: "al-m17-applications",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.5", "17.6", "17.7", "17.8"],
    title: "E-commerce, Navigation, AI and Cybersecurity",
    subtitle: "Autocomplete, A* search and hashing",
    estimatedMinutes: 38,
    intro:
      "Four more domains, each built on an algorithm you already know: binary search powers autocomplete, an improved Dijkstra powers navigation and game AI, and hash functions protect passwords.",

    atoms: [
      {
        id: "a-al-ecommerce",
        title: "Algorithms in e-commerce: product search autocomplete",
        explain:
          "An online shop's algorithms include: sorting and filtering product lists; TOP-K selection (the 10 best sellers out of a million) with a heap in O(n log k); hash tables for carts and stock lookups; recommendation (Lesson 72); and AUTOCOMPLETE. With the product names kept SORTED, every name starting with a prefix forms one contiguous block, found by binary search: bisect_left for the first name ≥ prefix, then read forward while names still start with the prefix. Each keystroke costs O(log n + k) instead of a scan of every product. (Large systems use a trie, a tree keyed by characters, for the same job.)",
        codeChallenge: {
          task: "Write autocomplete(names, prefix, k) where names is a SORTED list of lower-case product names. Use bisect.bisect_left to find the first name >= prefix, then return up to k consecutive names that start with prefix. The test has 20,000 names, so do not scan the whole list.",
          starter: "import bisect\n\ndef autocomplete(names, prefix, k):\n    pass\n",
          sample: "autocomplete([\"bag\", \"bread\", \"brush\", \"butter\"], \"br\", 5) → [\"bread\", \"brush\"]",
          tests: [
            {
              check: py`names = ["bag", "beans", "bread", "brown rice", "brush", "butter", "palm oil", "pepper"]
assert autocomplete(names, "br", 5) == ["bread", "brown rice", "brush"], "Got " + repr(autocomplete(names, "br", 5))
assert autocomplete(names, "br", 2) == ["bread", "brown rice"], "At most k results."
assert autocomplete(names, "z", 5) == [] and autocomplete(names, "pz", 5) == [], "No matches."
assert autocomplete(names, "", 3) == ["bag", "beans", "bread"], "An empty prefix matches everything, from the start."
big = sorted("item" + str(i).zfill(5) for i in range(20000))
assert autocomplete(big, "item1999", 20) == ["item1999" + str(d) for d in range(10)], "20,000 names: the 10 that start with item1999."
assert calls("bisect_left") or calls("bisect"), "Find the start of the block with binary search."`,
            },
          ],
          solution: "import bisect\n\ndef autocomplete(names, prefix, k):\n    i = bisect.bisect_left(names, prefix)\n    result = []\n    while i < len(names) and len(result) < k and names[i].startswith(prefix):\n        result.append(names[i])\n        i += 1\n    return result\n",
          hint: "i = bisect.bisect_left(names, prefix). Then append names[i] while i is in range, fewer than k are collected, and names[i].startswith(prefix).",
          successMessage: "O(log n + k) per keystroke. Sorted data plus binary search: the Module 9 technique inside every shop's search box.",
        },
      },
      {
        id: "a-al-navigation-ai",
        title: "Algorithms in navigation and AI: A* search",
        explain:
          "GPS NAVIGATION models roads as a weighted graph and finds shortest routes with Dijkstra's algorithm, sped up by A* SEARCH. A* orders its priority queue by f(v) = g(v) + h(v): the distance travelled so far plus a HEURISTIC estimate of the distance remaining (straight-line distance on a map). If h never overestimates (it is ADMISSIBLE), A* still finds the shortest path, but it explores towards the goal instead of in every direction, expanding far fewer vertices. A* is also a classic of ARTIFICIAL INTELLIGENCE, used for path-finding in games and robotics; other AI algorithms include minimax search for games, and optimisation by gradient descent for training models.",
        codeChallenge: {
          task: "Write astar(grid, start, goal) for a grid given as a list of strings, where \"#\" is a wall and \".\" is open; moves go up, down, left or right, each costing 1. Use heapq ordered by f = g + h with the Manhattan distance h = |r − goal_r| + |c − goal_c|. Return the length of the shortest path (number of moves), or -1 if the goal cannot be reached.",
          starter: "import heapq\n\ndef astar(grid, start, goal):\n    pass\n",
          sample: "astar([\"...\", \".#.\", \"...\"], (0, 0), (2, 2)) → 4",
          tests: [
            {
              check: py`from collections import deque
def bfs_len(grid, s, t):
    R, C = len(grid), len(grid[0])
    dist = {s: 0}
    q = deque([s])
    while q:
        r, c = q.popleft()
        if (r, c) == t:
            return dist[(r, c)]
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != "#" and (nr, nc) not in dist:
                dist[(nr, nc)] = dist[(r, c)] + 1
                q.append((nr, nc))
    return -1

assert astar(["...", ".#.", "..."], (0, 0), (2, 2)) == 4, "Around the wall: 4 moves. Got " + repr(astar(["...", ".#.", "..."], (0, 0), (2, 2)))
maze = ["..........", ".########.", ".#......#.", ".#.####.#.", ".#.#..#.#.", ".#.#..#.#.", ".#.####.#.", ".#........", ".########.", ".........."]
assert astar(maze, (0, 0), (4, 4)) == bfs_len(maze, (0, 0), (4, 4)), "A* must find the true shortest path through the maze."
assert astar(maze, (0, 0), (9, 9)) == 18, "Corner to corner: 18 moves."
assert astar([".#.", "##.", "..."], (0, 0), (2, 2)) == -1, "The start is walled in."
assert astar(["."], (0, 0), (0, 0)) == 0, "Already at the goal."`,
            },
          ],
          solution: "import heapq\n\ndef astar(grid, start, goal):\n    R, C = len(grid), len(grid[0])\n    def h(cell):\n        return abs(cell[0] - goal[0]) + abs(cell[1] - goal[1])\n    best = {start: 0}\n    heap = [(h(start), 0, start)]\n    while heap:\n        f, g, cell = heapq.heappop(heap)\n        if cell == goal:\n            return g\n        if g > best.get(cell, float(\"inf\")):\n            continue\n        r, c = cell\n        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):\n            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != \"#\":\n                ng = g + 1\n                if ng < best.get((nr, nc), float(\"inf\")):\n                    best[(nr, nc)] = ng\n                    heapq.heappush(heap, (ng + h((nr, nc)), ng, (nr, nc)))\n    return -1\n",
          hint: "Heap entries (g + h, g, cell). Pop the smallest f; return g at the goal; skip out-of-date entries; push each open neighbour whose new g improves on the best known.",
          successMessage: "The same answer as BFS or Dijkstra, while exploring mainly towards the goal. Admissible heuristics keep A* exact; that is the trick inside every route planner.",
        },
      },
      {
        id: "a-al-cybersecurity",
        title: "Algorithms in cybersecurity",
        explain:
          "Security rests on algorithms whose INVERSE is hard. A CRYPTOGRAPHIC HASH FUNCTION (SHA-256) maps any input to a fixed 256-bit digest in O(input length); changing one character changes the digest completely, and finding an input for a given digest is infeasible. Passwords are stored as SALTED, deliberately SLOW hashes (bcrypt, scrypt, Argon2), so that a stolen database cannot be reversed by trying billions of guesses per second. RSA encryption uses fast modular exponentiation (Module 6) and large primes found by Miller-Rabin (Module 16), and is safe because no polynomial algorithm for FACTORING is known. Intrusion detection uses string matching and anomaly detection; rate limiting uses sliding windows.",
        code: {
          language: PY,
          code: py`import hashlib

print(hashlib.sha256(b"password123").hexdigest()[:16])
print(hashlib.sha256(b"password124").hexdigest()[:16])
print(len(hashlib.sha256(b"x").hexdigest()))
`,
          expectedOutput: "ef92b778bafe771e\n33631376724e5d54\n64",
        },
        decision: {
          scenario: "A web app stores user passwords. A developer proposes storing SHA-256(password) because \"it cannot be reversed\".",
          question: "What is the right advice?",
          options: [
            {
              id: "a",
              text: "Use a salted, deliberately slow password hash such as bcrypt or Argon2: SHA-256 is so fast that attackers can test billions of guesses per second, and unsalted hashes reveal identical passwords",
              why: "Password hashing must be slow and salted; speed is a weakness here, not a strength.",
            },
            { id: "b", text: "SHA-256 is perfect because it cannot be reversed", whyWrong: "Attackers do not reverse it; they hash guesses quickly and compare." },
            { id: "c", text: "Store passwords encrypted with a key in the code", whyWrong: "Anyone with the code can decrypt every password." },
            { id: "d", text: "Store passwords in plain text but restrict database access", whyWrong: "A breach would expose every password directly." },
          ],
          correct: "a",
          aftermath: "In security, sometimes the algorithm should be slow on purpose.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 17.9 – 17.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l74-data-distributed-ml",
    moduleId: "al-m17-applications",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.9", "17.10", "17.11", "17.12"],
    title: "Databases, Data Processing, Distributed Systems and Machine Learning",
    subtitle: "Joins, word counts and nearest neighbours",
    estimatedMinutes: 38,
    intro:
      "The final case studies: how a database joins tables, how analytics pipelines count across machines, how distributed systems spread data, and the simplest machine learning algorithm, which is a searching problem in disguise.",

    atoms: [
      {
        id: "a-al-databases",
        title: "Algorithms in database management",
        explain:
          "A database is a collection of algorithms over stored data. INDEXES are B-trees (balanced search trees with many keys per node, so a lookup among a billion rows reads about 4 disk pages: O(log n)) or hash indexes (O(1) equality lookups, no ranges). JOINS combine tables on a key: a NESTED-LOOP join compares every pair, O(nm); a HASH JOIN builds a hash table on the smaller table and probes it with each row of the larger, O(n + m); a SORT-MERGE join sorts both and merges, O(n log n + m log m). The QUERY OPTIMISER chooses among them using size estimates, a dynamic programming search over join orders not unlike matrix chain multiplication.",
        codeChallenge: {
          task: "Write hash_join(left, right) where left and right are lists of (key, value) rows. Build a dict from each key to the list of left values, then probe it with every right row, producing (key, left_value, right_value) for every matching pair. Return the result sorted. The tables have 5,000 rows each, too many for a nested-loop join.",
          starter: "def hash_join(left, right):\n    pass\n",
          sample: "hash_join([(1, \"Ada\"), (2, \"Bo\")], [(1, \"CSC101\"), (1, \"MTH101\")]) → [(1, \"Ada\", \"CSC101\"), (1, \"Ada\", \"MTH101\")]",
          tests: [
            {
              check: py`students = [(1, "Ada"), (2, "Bo"), (3, "Chi")]
enrol = [(1, "CSC101"), (3, "MTH101"), (1, "MTH101"), (4, "PHY101")]
assert hash_join(students, enrol) == [(1, "Ada", "CSC101"), (1, "Ada", "MTH101"), (3, "Chi", "MTH101")], "Got " + repr(hash_join(students, enrol))
assert hash_join([], enrol) == [] and hash_join(students, []) == [], "Joining with an empty table."
assert hash_join([(1, "a"), (1, "b")], [(1, "x")]) == [(1, "a", "x"), (1, "b", "x")], "Duplicate keys on the left both match."
L = [(i, "s" + str(i)) for i in range(5000)]
R = [(i * 2, "c" + str(i)) for i in range(5000)]
assert len(hash_join(L, R)) == 2500, "Even keys below 5,000 match: 2,500 rows, in about 10,000 steps."`,
            },
          ],
          solution: "def hash_join(left, right):\n    table = {}\n    for key, value in left:\n        table.setdefault(key, []).append(value)\n    out = []\n    for key, rvalue in right:\n        for lvalue in table.get(key, []):\n            out.append((key, lvalue, rvalue))\n    return sorted(out)\n",
          hint: "Build table = {key: [left values]}. For each right row, append (key, lvalue, rvalue) for every lvalue in table.get(key, []). Sort at the end.",
          successMessage: "O(n + m) instead of O(nm): 10,000 steps instead of 25 million. Databases choose a hash join for exactly this reason.",
        },
      },
      {
        id: "a-al-analytics-distributed",
        title: "Data processing, analytics and distributed systems",
        explain:
          "ANALYTICS over huge datasets relies on algorithms that read data once and combine partial results. MAPREDUCE splits the data across machines; each MAPS its chunk to partial counts, and a REDUCE step merges the counts; word counting, the classic example, is O(total words) and runs in parallel because counting is associative. Other staples: EXTERNAL SORTING (sort chunks that fit in memory, then k-way merge them with a heap), streaming summaries, and top-k with heaps. DISTRIBUTED SYSTEMS add their own algorithms: CONSISTENT HASHING spreads keys across servers so that adding a server moves only about 1/n of the keys; CONSENSUS algorithms (Paxos, Raft) let replicas agree despite failures; and gossip protocols spread information in O(log n) rounds.",
        codeChallenge: {
          task: "Write top_words(chunks, k) in MapReduce style: MAP each chunk (a string of text, as if on its own machine) to a dict of lower-case word counts, then REDUCE by merging the dicts. Return the k most frequent words as (word, count) pairs, ordered by count (highest first) and then alphabetically.",
          starter: "def top_words(chunks, k):\n    pass\n",
          sample: "top_words([\"a b a\", \"b a c\"], 2) → [(\"a\", 3), (\"b\", 2)]",
          tests: [
            {
              check: py`chunks = ["the cat sat on the mat", "The dog sat on the log", "a cat and a dog"]
assert top_words(chunks, 3) == [("the", 4), ("a", 2), ("cat", 2)], "the 4; then a, cat, dog, on, sat with 2 each, alphabetically. Got " + repr(top_words(chunks, 3))
assert top_words([], 3) == [], "No data."
assert top_words(["x"], 5) == [("x", 1)], "Fewer than k words."
big = ["w" + str(i % 50) for i in range(10000)]
pieces = [" ".join(big[i:i + 1000]) for i in range(0, 10000, 1000)]
assert top_words(pieces, 1) == [("w0", 200)], "10 chunks of 1,000 words: every word appears 200 times; w0 wins the tie alphabetically."`,
            },
          ],
          solution: "def top_words(chunks, k):\n    partials = []\n    for chunk in chunks:\n        counts = {}\n        for word in chunk.lower().split():\n            counts[word] = counts.get(word, 0) + 1\n        partials.append(counts)\n    total = {}\n    for counts in partials:\n        for word, c in counts.items():\n            total[word] = total.get(word, 0) + c\n    ranked = sorted(total.items(), key=lambda wc: (-wc[1], wc[0]))\n    return ranked[:k]\n",
          hint: "Map: one dict of counts per chunk. Reduce: add every partial dict into one total dict. Then sort the items by (-count, word) and take k.",
          successMessage: "Each chunk could have been counted on a different machine; merging counts is associative, which is what makes MapReduce scale.",
        },
      },
      {
        id: "a-al-machine-learning",
        title: "Introduction to machine learning algorithms",
        explain:
          "MACHINE LEARNING algorithms improve their predictions from data instead of being programmed with rules. The simplest is k-NEAREST NEIGHBOURS (k-NN): to classify a new point, find the k training points closest to it (Euclidean distance) and take a majority vote of their labels. Training is free; prediction is a SEARCH, O(n) per query by scanning, or faster with spatial indexes (k-d trees). Other core algorithms: LINEAR REGRESSION fitted by GRADIENT DESCENT (repeatedly step against the slope of the error); k-MEANS clustering (alternately assign points to the nearest centre and move each centre to its points' mean); DECISION TREES built greedily, one best split at a time. Their analysis uses exactly this course's tools: running time, memory, and greedy versus exhaustive search.",
        codeChallenge: {
          task: "Write knn_predict(training, point, k) where training is a list of ((x, y), label) pairs. Find the k training points nearest to point by Euclidean distance (math.dist), and return the most common label among them; on a tie between labels, return the alphabetically smallest.",
          starter: "import math\n\ndef knn_predict(training, point, k):\n    pass\n",
          sample: "knn_predict([((1, 1), \"pass\"), ((1, 2), \"pass\"), ((8, 9), \"fail\")], (2, 2), 1) → \"pass\"",
          tests: [
            {
              check: py`data = [((2, 9), "pass"), ((3, 8), "pass"), ((1, 7), "pass"), ((8, 2), "fail"), ((9, 3), "fail"), ((7, 1), "fail"), ((5, 5), "fail")]
assert knn_predict(data, (2, 8), 3) == "pass", "The 3 nearest to (2, 8) all passed. Got " + repr(knn_predict(data, (2, 8), 3))
assert knn_predict(data, (8, 3), 3) == "fail", "The 3 nearest to (8, 3) all failed."
assert knn_predict(data, (4, 6), 1) == "fail", "With k = 1, the single nearest point (5, 5) decides."
assert knn_predict(data, (4, 6), 3) == "pass", "With k = 3: (5, 5) fail, (3, 8) pass, (1, 7) pass: pass wins 2 to 1."
assert knn_predict([((0, 0), "b"), ((0, 2), "a")], (0, 1), 2) == "a", "A 1–1 tie goes to the alphabetically smallest label."`,
            },
          ],
          solution: "import math\n\ndef knn_predict(training, point, k):\n    nearest = sorted(training, key=lambda item: math.dist(item[0], point))[:k]\n    votes = {}\n    for _, label in nearest:\n        votes[label] = votes.get(label, 0) + 1\n    return min(votes, key=lambda label: (-votes[label], label))\n",
          hint: "Sort the training items by math.dist(item[0], point) and take the first k. Count their labels, then pick the label with the most votes, breaking ties alphabetically.",
          successMessage: "A complete classifier in four lines: sort by distance, take k, vote. Its O(n log n) prediction is why large systems index the training data.",
        },
      },
    ],

    task: {
      title: "Module 17 practice: five case studies",
      intro: "For each, write half a page: the problem, the algorithms and data structures used, their complexity, and one limitation.",
      prompts: [
        "How Google-like search systems retrieve information: extend your inverted index with term counts, and rank results by how often the query words appear.",
        "How recommendation engines suggest products: run also_bought on a purchase dataset of your own, and discuss why popular items dominate.",
        "How banking systems detect suspicious transactions: combine the velocity rule with a rule on unusually large amounts (more than 3 times the account's running average).",
        "How navigation systems calculate routes: compare the number of vertices Dijkstra and A* expand on a 50 × 50 grid with walls.",
        "How social media platforms rank content: implement a feed that scores posts by likes ÷ (age_in_hours + 2)^1.5 and returns the top 10 with heapq.nlargest.",
      ],
      closing: "The capstone puts everything together in one system you design, build, analyse and document yourself.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
