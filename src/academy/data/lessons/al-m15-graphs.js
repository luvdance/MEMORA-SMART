/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 15 · GRAPH ALGORITHMS
 *
 * Curriculum 15.1 – 15.16. Graph theory and representations; BFS and DFS;
 * shortest paths with Dijkstra, Bellman-Ford and Floyd-Warshall; minimum
 * spanning trees; topological sorting; cycle detection; applications. The
 * practical projects (route finder, social network analyser, traversal,
 * shortest path, dependency ordering) are built and tested here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s15-graphs";

const PY = "python";
const py = String.raw;

// An illustrative road map (distances in km, rounded) shared by the
// shortest-path checks.
const ROADS = py`ROADS = {
    "Lagos": [("Ibadan", 128), ("Abeokuta", 78), ("Benin", 315)],
    "Abeokuta": [("Lagos", 78), ("Ibadan", 77)],
    "Ibadan": [("Lagos", 128), ("Abeokuta", 77), ("Oyo", 53), ("Ilorin", 160)],
    "Oyo": [("Ibadan", 53), ("Ilorin", 105)],
    "Ilorin": [("Ibadan", 160), ("Oyo", 105), ("Abuja", 500)],
    "Benin": [("Lagos", 315), ("Lokoja", 300)],
    "Lokoja": [("Benin", 300), ("Abuja", 195)],
    "Abuja": [("Ilorin", 500), ("Lokoja", 195)],
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 15.1 – 15.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l62-graph-theory",
    moduleId: "al-m15-graphs",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"],
    title: "Graph Theory and Representations",
    subtitle: "Vertices, edges, kinds of graph, connectivity",
    estimatedMinutes: 32,
    intro:
      "Graphs model anything made of things and connections: cities and roads, people and friendships, web pages and links, tasks and dependencies. This lesson fixes the vocabulary every graph algorithm uses.",

    atoms: [
      {
        id: "a-al-graph-theory",
        title: "Graph theory: vertices, edges and kinds of graph",
        explain:
          "A GRAPH G = (V, E) is a set of VERTICES (nodes) V and EDGES E connecting pairs of them; |V| and |E| are written V and E in complexity formulas. In an UNDIRECTED graph an edge {u, v} can be travelled both ways; in a DIRECTED graph (digraph) an edge (u, v) goes from u to v only. In a WEIGHTED graph each edge has a number: a distance, a cost, a time; an UNWEIGHTED graph treats every edge as length 1. The DEGREE of a vertex is its number of edges (in-degree and out-degree in a digraph). A PATH is a sequence of vertices joined by edges; a CYCLE is a path that returns to its start. A graph with no cycles is ACYCLIC; a directed acyclic graph is a DAG.",
        table: {
          caption: "Graph vocabulary, with examples.",
          headers: ["Term", "Meaning", "Example"],
          rows: [
            ["Undirected", "Edges go both ways", "Facebook friendship, two-way roads"],
            ["Directed", "Edges have a direction", "Following on X, one-way streets, web links"],
            ["Weighted", "Edges carry a number", "Road distances, flight prices"],
            ["Degree", "Number of edges at a vertex", "A person's number of friends"],
            ["Path", "A sequence of connected vertices", "Lagos → Ibadan → Oyo"],
            ["Cycle", "A path back to its start", "A ring road"],
            ["DAG", "Directed graph with no cycles", "Course prerequisites, build dependencies"],
            ["Sparse / dense", "E much less than V² / E close to V²", "Road networks are sparse"],
          ],
        },
      },
      {
        id: "a-al-connected-graphs",
        title: "Connected and disconnected graphs",
        explain:
          "An undirected graph is CONNECTED if there is a path between every pair of vertices; otherwise it splits into CONNECTED COMPONENTS, maximal groups of mutually reachable vertices. A digraph is STRONGLY CONNECTED if every vertex can reach every other following edge directions. Counting components is a basic graph question (how many separate friend groups? is the power grid in one piece?) and is answered by starting a traversal from each vertex not yet visited: each start discovers one whole component. Time O(V + E).",
        codeChallenge: {
          task: "Write count_components(n, edges) for an undirected graph with vertices 0 to n − 1 and edges as (u, v) pairs. Build an adjacency list, then repeatedly start a traversal (an explicit stack is fine) from any unvisited vertex, marking everything it reaches. Return the number of traversals started.",
          starter: "def count_components(n, edges):\n    pass\n",
          sample: "count_components(5, [(0, 1), (1, 2), (3, 4)]) → 2",
          tests: [
            {
              check: py`assert count_components(5, [(0, 1), (1, 2), (3, 4)]) == 2, "{0, 1, 2} and {3, 4}. Got " + repr(count_components(5, [(0, 1), (1, 2), (3, 4)]))
assert count_components(4, []) == 4, "No edges: every vertex is its own component."
assert count_components(1, []) == 1 and count_components(0, []) == 0, "One vertex, and none."
assert count_components(6, [(0, 1), (1, 2), (2, 0), (3, 4), (4, 5), (5, 3)]) == 2, "Two triangles."
chain = [(i, i + 1) for i in range(1999)]
assert count_components(2000, chain) == 1, "A chain of 2,000 vertices is one component (a recursive traversal this deep would overflow: use a stack)."`,
            },
          ],
          solution: "def count_components(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    seen = [False] * n\n    count = 0\n    for start in range(n):\n        if seen[start]:\n            continue\n        count += 1\n        seen[start] = True\n        stack = [start]\n        while stack:\n            u = stack.pop()\n            for v in adj[u]:\n                if not seen[v]:\n                    seen[v] = True\n                    stack.append(v)\n    return count\n",
          hint: "adj = [[] for _ in range(n)], adding both directions. For each unvisited start: count it, then pop vertices from a stack and push their unvisited neighbours.",
          successMessage: "Every vertex and edge is handled a constant number of times: O(V + E). Each traversal sweeps up exactly one component.",
        },
      },
      {
        id: "a-al-graph-representations",
        title: "Graph representations",
        explain:
          "Three representations. An EDGE LIST is a list of (u, v) or (u, v, weight) tuples: compact, natural for input files and for Kruskal. An ADJACENCY LIST maps each vertex to its neighbours: O(V + E) space and fast neighbour iteration, the default for BFS, DFS and Dijkstra. An ADJACENCY MATRIX is a V × V table with matrix[u][v] = 1 (or the weight) when the edge exists: O(V²) space, but an O(1) edge test, and the natural input for Floyd-Warshall. For a directed graph the matrix is not symmetric; for an undirected graph it is.",
        codeChallenge: {
          task: "Write to_matrix(n, edges, directed) that converts an edge list of (u, v, weight) tuples on vertices 0 to n − 1 into an n × n adjacency matrix holding the weight at [u][v] and 0 where there is no edge. If directed is False, also set [v][u].",
          starter: "def to_matrix(n, edges, directed):\n    pass\n",
          sample: "to_matrix(3, [(0, 1, 5), (1, 2, 3)], False) → [[0, 5, 0], [5, 0, 3], [0, 3, 0]]",
          tests: [
            {
              check: py`assert to_matrix(3, [(0, 1, 5), (1, 2, 3)], False) == [[0, 5, 0], [5, 0, 3], [0, 3, 0]], "Undirected: symmetric. Got " + repr(to_matrix(3, [(0, 1, 5), (1, 2, 3)], False))
assert to_matrix(3, [(0, 1, 5), (1, 2, 3)], True) == [[0, 5, 0], [0, 0, 3], [0, 0, 0]], "Directed: only [u][v]."
m = to_matrix(2, [], True)
assert m == [[0, 0], [0, 0]], "No edges: all zeros."
m[0][0] = 9
assert m[1][0] == 0, "Each row must be a separate list: [[0] * n] * n shares one row between them all."`,
            },
          ],
          solution: "def to_matrix(n, edges, directed):\n    matrix = [[0] * n for _ in range(n)]\n    for u, v, w in edges:\n        matrix[u][v] = w\n        if not directed:\n            matrix[v][u] = w\n    return matrix\n",
          hint: "matrix = [[0] * n for _ in range(n)]. For each (u, v, w): set matrix[u][v] = w, and matrix[v][u] = w when undirected.",
          successMessage: "n² cells whatever the number of edges: that is why sparse graphs use adjacency lists. The shared-row trap catches many programmers.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 15.7 – 15.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l63-bfs-dfs",
    moduleId: "al-m15-graphs",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.7", "15.8"],
    title: "Breadth-First and Depth-First Search",
    subtitle: "The two ways to explore a graph",
    estimatedMinutes: 38,
    intro:
      "Almost every graph algorithm is built on one of two traversals. Breadth-first search explores in rings of increasing distance; depth-first search plunges as deep as it can before backing up.",

    atoms: [
      {
        id: "a-al-bfs",
        title: "Breadth-First Search (BFS): a social network analyser",
        explain:
          "BFS explores a graph in LEVELS: first the start vertex, then all its neighbours (distance 1), then all their unvisited neighbours (distance 2), and so on. It uses a QUEUE: dequeue a vertex, and enqueue each unvisited neighbour, marking it visited and recording its distance as one more than the current vertex's. Each vertex is enqueued once and each edge examined once (twice if undirected): O(V + E) time, O(V) space. In an UNWEIGHTED graph, the distances BFS records are SHORTEST-PATH distances, which is why it answers \"degrees of separation\" in a social network.",
        codeChallenge: {
          task: "Build a social network connection analyser. bfs_distances(graph, start) receives an adjacency-list dict (person → list of friends) and returns a dict mapping every person reachable from start to their degree of separation (start itself is 0), using BFS with collections.deque.",
          starter: "from collections import deque\n\ndef bfs_distances(graph, start):\n    pass\n",
          sample: "bfs_distances({\"Ada\": [\"Bo\"], \"Bo\": [\"Ada\", \"Chi\"], \"Chi\": [\"Bo\"]}, \"Ada\") → {\"Ada\": 0, \"Bo\": 1, \"Chi\": 2}",
          tests: [
            {
              check: py`net = {
    "Ada": ["Bo", "Chi"], "Bo": ["Ada", "Dayo"], "Chi": ["Ada", "Dayo", "Efe"],
    "Dayo": ["Bo", "Chi", "Femi"], "Efe": ["Chi"], "Femi": ["Dayo"], "Gina": ["Hassan"], "Hassan": ["Gina"],
}
d = bfs_distances(net, "Ada")
assert d == {"Ada": 0, "Bo": 1, "Chi": 1, "Dayo": 2, "Efe": 2, "Femi": 3}, "Degrees of separation from Ada. Got " + repr(d)
assert "Gina" not in d, "Gina is in a separate component: unreachable people are left out."
assert bfs_distances({"Solo": []}, "Solo") == {"Solo": 0}, "A person with no friends."
ring = {i: [(i - 1) % 1000, (i + 1) % 1000] for i in range(1000)}
assert bfs_distances(ring, 0)[500] == 500, "On a ring of 1,000 the opposite person is 500 steps away."`,
            },
          ],
          solution: "from collections import deque\n\ndef bfs_distances(graph, start):\n    dist = {start: 0}\n    queue = deque([start])\n    while queue:\n        u = queue.popleft()\n        for v in graph.get(u, []):\n            if v not in dist:\n                dist[v] = dist[u] + 1\n                queue.append(v)\n    return dist\n",
          hint: "dist = {start: 0}; queue = deque([start]). While the queue is not empty: u = queue.popleft(); for each neighbour v not yet in dist, set dist[v] = dist[u] + 1 and append v.",
          successMessage: "BFS's first visit to a vertex is along a shortest path, so its distances are exact in any unweighted graph, in O(V + E).",
        },
      },
      {
        id: "a-al-dfs",
        title: "Depth-First Search (DFS): a traversal",
        explain:
          "DFS goes as DEEP as possible along each branch before backtracking: from a vertex, move to an unvisited neighbour, and from there to one of its unvisited neighbours, until stuck; then back up to the most recent vertex with an unexplored neighbour. It is naturally RECURSIVE (or uses an explicit STACK). Time O(V + E), space O(V). DFS does not find shortest paths, but its structure (the order vertices are entered and finished) powers cycle detection, topological sorting, finding connected and strongly connected components, and maze solving.",
        codeChallenge: {
          task: "Write dfs_order(graph, start) that returns the list of vertices in the order a RECURSIVE depth-first search first visits them, exploring each vertex's neighbours in the order they appear in its adjacency list.",
          starter: "def dfs_order(graph, start):\n    pass\n",
          sample: "dfs_order({\"A\": [\"B\", \"C\"], \"B\": [\"D\"], \"C\": [], \"D\": []}, \"A\") → [\"A\", \"B\", \"D\", \"C\"]",
          tests: [
            {
              check: py`g = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}
assert dfs_order(g, "A") == ["A", "B", "D", "C"], "Deep first: A, B, D, then back to C. Got " + repr(dfs_order(g, "A"))
h = {1: [2, 5], 2: [3, 4], 3: [], 4: [1], 5: [6], 6: [2]}
assert dfs_order(h, 1) == [1, 2, 3, 4, 5, 6], "Edges back to visited vertices (4 → 1, 6 → 2) are ignored."
assert dfs_order({"X": []}, "X") == ["X"], "A single vertex."
u = {"a": ["b", "c"], "b": ["a", "c"], "c": ["a", "b", "d"], "d": ["c"]}
assert dfs_order(u, "d") == ["d", "c", "a", "b"], "An undirected graph from d."`,
            },
          ],
          solution: "def dfs_order(graph, start):\n    order = []\n    seen = set()\n\n    def visit(u):\n        seen.add(u)\n        order.append(u)\n        for v in graph.get(u, []):\n            if v not in seen:\n                visit(v)\n\n    visit(start)\n    return order\n",
          hint: "Keep seen and order. A nested visit(u) marks u, records it, then calls visit(v) for each neighbour v not yet seen.",
          successMessage: "Deep first, then back up. The same skeleton with entry and exit times becomes cycle detection and topological sort in Lesson 66.",
        },
      },
      {
        id: "a-al-bfs-path",
        title: "Recovering the path: a route finder",
        explain:
          "Distances tell you how far; to say HOW to get there, record a PARENT for each vertex when BFS first reaches it (the vertex it was reached from). The shortest path to a target is then read backwards: target, parent[target], parent[parent[target]], ... back to the start, then reversed. This is the core of every unweighted route finder, such as the fewest bus changes or the fewest hops between two network routers.",
        codeChallenge: {
          task: "Write shortest_path(graph, start, goal) that returns a shortest path (fewest edges) from start to goal as a list of vertices, using BFS with a parent dict, or None if goal is unreachable. Explore neighbours in adjacency-list order.",
          starter: "from collections import deque\n\ndef shortest_path(graph, start, goal):\n    pass\n",
          sample: "shortest_path(lines, \"Yaba\", \"Ikeja\") → [\"Yaba\", \"Oshodi\", \"Ikeja\"]",
          tests: [
            {
              check: py`lines = {
    "Yaba": ["Ebute", "Oshodi"], "Ebute": ["Yaba", "Mushin"], "Oshodi": ["Yaba", "Ikeja", "Mushin"],
    "Mushin": ["Ebute", "Oshodi", "Ikeja"], "Ikeja": ["Oshodi", "Mushin"], "Island": [],
}
assert shortest_path(lines, "Yaba", "Ikeja") == ["Yaba", "Oshodi", "Ikeja"], "Two stops via Oshodi. Got " + repr(shortest_path(lines, "Yaba", "Ikeja"))
assert shortest_path(lines, "Yaba", "Yaba") == ["Yaba"], "Start and goal are the same."
assert shortest_path(lines, "Yaba", "Island") is None, "Island cannot be reached."
grid = {(r, c): [(r + dr, c + dc) for dr, dc in ((1, 0), (0, 1), (-1, 0), (0, -1)) if 0 <= r + dr < 20 and 0 <= c + dc < 20] for r in range(20) for c in range(20)}
p = shortest_path(grid, (0, 0), (19, 19))
assert p[0] == (0, 0) and p[-1] == (19, 19) and len(p) == 39, "Across a 20 × 20 grid: 38 moves, 39 cells."`,
            },
          ],
          solution: "from collections import deque\n\ndef shortest_path(graph, start, goal):\n    parent = {start: None}\n    queue = deque([start])\n    while queue:\n        u = queue.popleft()\n        if u == goal:\n            path = []\n            while u is not None:\n                path.append(u)\n                u = parent[u]\n            return path[::-1]\n        for v in graph.get(u, []):\n            if v not in parent:\n                parent[v] = u\n                queue.append(v)\n    return None\n",
          hint: "parent = {start: None}. Run BFS, setting parent[v] = u when v is first seen. When you dequeue the goal, follow parents back to None and reverse the list.",
          successMessage: "Fewest hops, with the route itself. For roads of different lengths, BFS is not enough: Dijkstra's algorithm is next.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 15.9 – 15.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l64-dijkstra",
    moduleId: "al-m15-graphs",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.9", "15.10"],
    title: "Shortest Paths and Dijkstra's Algorithm",
    subtitle: "The algorithm inside every map app",
    estimatedMinutes: 38,
    intro:
      "When edges have lengths, the path with the fewest edges is not the shortest. Dijkstra's algorithm, a greedy algorithm with a priority queue, finds the true shortest routes, and versions of it run in every navigation system.",

    atoms: [
      {
        id: "a-al-shortest-paths",
        title: "Shortest path algorithms",
        explain:
          "The SINGLE-SOURCE shortest path problem asks for the shortest distance from one source to every vertex; ALL-PAIRS asks for every pair. Every algorithm is built on RELAXATION: if dist[u] + w(u, v) < dist[v], then going through u is shorter, so update dist[v] (and parent[v] = u). Which algorithm applies depends on the weights.",
        table: {
          caption: "Choosing a shortest-path algorithm.",
          headers: ["Situation", "Algorithm", "Time"],
          rows: [
            ["Unweighted graph", "BFS", "O(V + E)"],
            ["Non-negative weights, one source", "Dijkstra (binary heap)", "O((V + E) log V)"],
            ["Negative weights allowed, one source", "Bellman-Ford (also detects negative cycles)", "O(VE)"],
            ["All pairs, dense graph", "Floyd-Warshall", "O(V³)"],
            ["DAG, any weights", "Relax edges in topological order", "O(V + E)"],
          ],
        },
      },
      {
        id: "a-al-dijkstra",
        title: "Dijkstra's algorithm",
        explain:
          "DIJKSTRA'S ALGORITHM keeps tentative distances (0 for the source, ∞ for the rest) and a min-heap of (distance, vertex). Repeatedly pop the vertex with the smallest tentative distance; its distance is now FINAL (the greedy choice); relax each of its outgoing edges, pushing any improved distance onto the heap. Skip popped entries that are out of date. With a binary heap it runs in O((V + E) log V). It is correct only for NON-NEGATIVE weights: the greedy step assumes that no later path through other vertices can come back shorter, which a negative edge would break.",
        codeChallenge: {
          task: "Write dijkstra(graph, source) where graph maps each vertex to a list of (neighbour, weight) pairs with non-negative weights. Return a dict of the shortest distance from source to every reachable vertex, using heapq as the priority queue.",
          starter: "import heapq\n\ndef dijkstra(graph, source):\n    pass\n",
          sample: "dijkstra(ROADS, \"Lagos\")[\"Ilorin\"] → 286   (Lagos → Ibadan → Oyo → Ilorin)",
          tests: [
            {
              check: ROADS + py`d = dijkstra(ROADS, "Lagos")
assert d["Lagos"] == 0 and d["Ibadan"] == 128 and d["Abeokuta"] == 78, "Direct roads from Lagos. Got " + repr(d)
assert d["Ilorin"] == 286, "Lagos → Ibadan → Oyo → Ilorin = 128 + 53 + 105 = 286, shorter than via the direct Ibadan–Ilorin road (288)."
assert d["Abuja"] == 786, "Via Ilorin (286 + 500 = 786) beats via Benin and Lokoja (315 + 300 + 195 = 810)."
assert dijkstra({"A": []}, "A") == {"A": 0}, "A single vertex."
g = {"s": [("a", 1), ("b", 4)], "a": [("b", 2), ("c", 6)], "b": [("c", 3)], "c": []}
assert dijkstra(g, "s") == {"s": 0, "a": 1, "b": 3, "c": 6}, "A directed example: s → a → b → c."`,
            },
          ],
          solution: "import heapq\n\ndef dijkstra(graph, source):\n    dist = {source: 0}\n    heap = [(0, source)]\n    done = set()\n    while heap:\n        d, u = heapq.heappop(heap)\n        if u in done:\n            continue\n        done.add(u)\n        for v, w in graph.get(u, []):\n            nd = d + w\n            if v not in dist or nd < dist[v]:\n                dist[v] = nd\n                heapq.heappush(heap, (nd, v))\n    return dist\n",
          hint: "dist = {source: 0}; heap = [(0, source)]. Pop (d, u); skip u if already finalised. Relax each (v, w): if v is new or d + w < dist[v], update and push (d + w, v).",
          successMessage: "286 km to Ilorin by the less obvious route. The heap always finalises the closest unfinished town next, which is Dijkstra's greedy choice.",
        },
      },
      {
        id: "a-al-dijkstra-route",
        title: "Finding the shortest route between two locations",
        explain:
          "A navigation app needs the ROUTE as well as the distance. Record parent[v] = u whenever relaxation improves dist[v]; at the end, follow parents back from the destination. An important optimisation for point-to-point queries: STOP as soon as the destination is popped from the heap, since its distance is then final. Real systems add heuristics (A* search, which steers the search towards the destination) and pre-processing (contraction hierarchies) to answer continental queries in milliseconds, but Dijkstra's relaxation is still at the core.",
        codeChallenge: {
          task: "Build an intelligent route finder. route(graph, start, goal) runs Dijkstra from start, records parents, stops when goal is popped, and returns (distance, path) where path is the list of places from start to goal; return (None, None) if goal is unreachable.",
          starter: "import heapq\n\ndef route(graph, start, goal):\n    pass\n",
          sample: "route(ROADS, \"Lagos\", \"Abuja\") → (786, [\"Lagos\", \"Ibadan\", \"Oyo\", \"Ilorin\", \"Abuja\"])",
          tests: [
            {
              check: ROADS + py`assert route(ROADS, "Lagos", "Abuja") == (786, ["Lagos", "Ibadan", "Oyo", "Ilorin", "Abuja"]), "Got " + repr(route(ROADS, "Lagos", "Abuja"))
assert route(ROADS, "Abeokuta", "Oyo") == (130, ["Abeokuta", "Ibadan", "Oyo"]), "Abeokuta → Ibadan → Oyo is 130 km."
assert route(ROADS, "Benin", "Benin") == (0, ["Benin"]), "Already there."
assert route({"A": [("B", 1)], "B": [], "C": []}, "A", "C") == (None, None), "C cannot be reached."`,
            },
          ],
          solution: "import heapq\n\ndef route(graph, start, goal):\n    dist = {start: 0}\n    parent = {start: None}\n    heap = [(0, start)]\n    done = set()\n    while heap:\n        d, u = heapq.heappop(heap)\n        if u in done:\n            continue\n        if u == goal:\n            path = []\n            while u is not None:\n                path.append(u)\n                u = parent[u]\n            return d, path[::-1]\n        done.add(u)\n        for v, w in graph.get(u, []):\n            if v not in dist or d + w < dist[v]:\n                dist[v] = d + w\n                parent[v] = u\n                heapq.heappush(heap, (d + w, v))\n    return None, None\n",
          hint: "As in dijkstra, plus parent[v] = u on every improvement. When the popped vertex is goal, follow parents back to None, reverse, and return (d, path).",
          successMessage: "Distance and directions, stopping as soon as the answer is final. This is the skeleton of a satnav.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 15.11 – 15.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l65-bellman-floyd-mst",
    moduleId: "al-m15-graphs",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.11", "15.12", "15.13"],
    title: "Bellman-Ford, Floyd-Warshall and Minimum Spanning Trees",
    subtitle: "Negative weights, all pairs, and connecting everything cheaply",
    estimatedMinutes: 38,
    intro:
      "Dijkstra cannot handle negative weights and finds paths from one source. Bellman-Ford handles negatives and detects impossible \"infinitely cheap\" cycles; Floyd-Warshall finds every pair at once. Both are dynamic programming.",

    atoms: [
      {
        id: "a-al-bellman-ford",
        title: "The Bellman-Ford algorithm",
        explain:
          "BELLMAN-FORD relaxes EVERY edge, V − 1 times. Why V − 1? A shortest path without cycles has at most V − 1 edges, and after round k every shortest path of at most k edges is correct (a dynamic programming argument on the number of edges). If a V-th round can still improve some distance, the graph has a NEGATIVE CYCLE reachable from the source, and shortest paths are undefined (you could loop forever, getting cheaper). Time O(VE), slower than Dijkstra, but it works with negative weights, as in currency arbitrage (where a negative cycle means risk-free profit) and distance-vector network routing.",
        codeChallenge: {
          task: "Write bellman_ford(n, edges, source) for vertices 0 to n − 1 and directed edges (u, v, weight), weights possibly negative. Relax every edge n − 1 times; then, if any edge can still be relaxed, return None (negative cycle). Otherwise return the list of distances, with float(\"inf\") for unreachable vertices.",
          starter: "def bellman_ford(n, edges, source):\n    pass\n",
          sample: "bellman_ford(4, [(0, 1, 4), (0, 2, 5), (2, 1, -3), (1, 3, 2)], 0) → [0, 2, 5, 4]",
          tests: [
            {
              check: py`INF = float("inf")
assert bellman_ford(4, [(0, 1, 4), (0, 2, 5), (2, 1, -3), (1, 3, 2)], 0) == [0, 2, 5, 4], "0 → 2 → 1 is 5 − 3 = 2, cheaper than the direct 4. Got " + repr(bellman_ford(4, [(0, 1, 4), (0, 2, 5), (2, 1, -3), (1, 3, 2)], 0))
assert bellman_ford(3, [(0, 1, 1), (1, 2, -1), (2, 1, -1)], 0) is None, "1 → 2 → 1 costs −2 per loop: a negative cycle, so return None."
assert bellman_ford(3, [(0, 1, 7)], 0) == [0, 7, INF], "Vertex 2 is unreachable: infinity."
edges = [(0, 1, 6), (0, 2, 7), (1, 2, 8), (1, 3, 5), (1, 4, -4), (2, 3, -3), (2, 4, 9), (3, 1, -2), (4, 0, 2), (4, 3, 7)]
assert bellman_ford(5, edges, 0) == [0, 2, 7, 4, -2], "The textbook example with several negative edges."`,
            },
          ],
          solution: "def bellman_ford(n, edges, source):\n    INF = float(\"inf\")\n    dist = [INF] * n\n    dist[source] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    for u, v, w in edges:\n        if dist[u] + w < dist[v]:\n            return None\n    return dist\n",
          hint: "dist = [inf] * n; dist[source] = 0. Repeat n − 1 times: relax every edge. Then one more pass: if anything still improves, return None.",
          successMessage: "Negative edges handled, and a negative cycle detected rather than looping forever. The extra V-th round is the whole detection.",
        },
      },
      {
        id: "a-al-floyd-warshall",
        title: "The Floyd-Warshall algorithm",
        explain:
          "FLOYD-WARSHALL computes the shortest distance between EVERY pair of vertices by dynamic programming over which vertices may be used as INTERMEDIATE stops. Start with dist = the adjacency matrix (0 on the diagonal, ∞ where there is no edge). For each vertex k in turn, allow paths through k: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). After all k, every distance is final. Three nested loops: O(V³) time, O(V²) space. It handles negative edges (but not negative cycles: a negative dist[i][i] reveals one) and is the simplest choice for all pairs on small, dense graphs.",
        codeChallenge: {
          task: "Write floyd_warshall(matrix) where matrix is an n × n list of lists of edge weights (0 on the diagonal, float(\"inf\") for no edge). Return a NEW matrix of all-pairs shortest distances, using the k, i, j triple loop with k as the OUTERMOST loop. Do not modify the input.",
          starter: "def floyd_warshall(matrix):\n    pass\n",
          sample: "floyd_warshall([[0, 3, INF], [INF, 0, 1], [2, INF, 0]]) → [[0, 3, 4], [3, 0, 1], [2, 5, 0]]",
          tests: [
            {
              check: py`INF = float("inf")
m = [[0, 3, INF], [INF, 0, 1], [2, INF, 0]]
assert floyd_warshall(m) == [[0, 3, 4], [3, 0, 1], [2, 5, 0]], "Got " + repr(floyd_warshall(m))
assert m == [[0, 3, INF], [INF, 0, 1], [2, INF, 0]], "Do not modify the input matrix."
g = [[0, 5, INF, 10], [INF, 0, 3, INF], [INF, INF, 0, 1], [INF, INF, INF, 0]]
assert floyd_warshall(g) == [[0, 5, 8, 9], [INF, 0, 3, 4], [INF, INF, 0, 1], [INF, INF, INF, 0]], "The classic four-vertex example: 0 → 3 costs 9 via 1 and 2, not 10."
assert floyd_warshall([[0]]) == [[0]], "One vertex."`,
            },
          ],
          solution: "def floyd_warshall(matrix):\n    n = len(matrix)\n    dist = [row[:] for row in matrix]\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dist[i][k] + dist[k][j]\n    return dist\n",
          hint: "dist = [row[:] for row in matrix]. Then for k: for i: for j: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
          successMessage: "Three lines of loops for every pair at once. The order matters: k must be outermost, because each k extends the set of allowed intermediate stops.",
        },
      },
      {
        id: "a-al-graph-mst",
        title: "Minimum spanning trees in graph algorithms",
        explain:
          "A minimum spanning tree (Module 13) connects all vertices at the least total edge weight; it is a different question from shortest paths. An MST minimises the TOTAL wiring; a shortest-path tree minimises the distance FROM ONE SOURCE to each vertex. They usually differ. Prim's algorithm (vertex-growing, a heap, O(E log V)) looks almost exactly like Dijkstra's, but it orders the heap by the single edge weight instead of the total distance from the source. Kruskal's (sorted edges plus union-find, O(E log E)) suits sparse graphs given as edge lists.",
        decision: {
          scenario: "A state government will connect 40 towns with fibre-optic cable and wants to spend as little on cable as possible. Separately, an ambulance service wants the fastest route from its depot to each town.",
          question: "Which algorithms answer the two questions?",
          options: [
            {
              id: "a",
              text: "Cable: a minimum spanning tree (Prim or Kruskal). Ambulances: Dijkstra from the depot",
              why: "Total cable length is an MST objective; fastest routes from one source are a shortest-path tree. The two trees are usually different.",
            },
            { id: "b", text: "Dijkstra for both", whyWrong: "Dijkstra minimises distance from the source, not the total length of cable." },
            { id: "c", text: "An MST for both", whyWrong: "An MST can force long detours between the depot and a town." },
            { id: "d", text: "BFS for both", whyWrong: "BFS ignores edge weights entirely." },
          ],
          correct: "a",
          aftermath: "Same graph, two different objectives, two different trees.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 15.14 – 15.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l66-topological-cycles",
    moduleId: "al-m15-graphs",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["15.14", "15.15", "15.16"],
    title: "Topological Sorting, Cycle Detection and Applications",
    subtitle: "Ordering dependencies, finding loops, and where graphs are used",
    estimatedMinutes: 36,
    intro:
      "Build systems, course prerequisites and spreadsheet formulas all have the same structure: tasks that must wait for other tasks. Topological sorting puts them in a valid order, and cycle detection explains why sometimes there is none.",

    atoms: [
      {
        id: "a-al-topological-sort",
        title: "Topological sorting: a dependency ordering system",
        explain:
          "A TOPOLOGICAL ORDER of a directed graph lists every vertex so that for every edge u → v, u comes before v: prerequisites before the courses that need them. It exists exactly when the graph is a DAG (has no directed cycle). KAHN'S ALGORITHM: compute every vertex's in-degree; put all vertices with in-degree 0 (nothing to wait for) in a queue; repeatedly remove one, output it, and decrement the in-degree of each of its successors, enqueuing any that reach 0. If fewer than V vertices are output, the remainder are stuck in a cycle. Time O(V + E). Using a min-heap instead of a queue gives the alphabetically smallest valid order.",
        codeChallenge: {
          task: "Build a dependency ordering system. topo_order(prereqs) receives a dict mapping every task to the list of tasks it depends on. Return a list of all tasks in which every task comes after its dependencies, using Kahn's algorithm with a heap (heapq) so that, among the tasks ready at any moment, the alphabetically smallest is taken first. Return None if there is a cycle.",
          starter: "import heapq\n\ndef topo_order(prereqs):\n    pass\n",
          sample: "topo_order({\"cook\": [\"shop\"], \"shop\": [\"pay\"], \"pay\": []}) → [\"pay\", \"shop\", \"cook\"]",
          tests: [
            {
              check: py`courses = {
    "CSC101": [], "MTH101": [], "CSC201": ["CSC101"], "CSC202": ["CSC101", "MTH101"],
    "CSC301": ["CSC201", "CSC202"], "MTH201": ["MTH101"],
}
order = topo_order(courses)
assert order == ["CSC101", "CSC201", "MTH101", "CSC202", "CSC301", "MTH201"], "Alphabetically smallest valid order. Got " + repr(order)
assert topo_order({"cook": ["shop"], "shop": ["pay"], "pay": []}) == ["pay", "shop", "cook"], "A chain of dependencies."
assert topo_order({"a": ["b"], "b": ["c"], "c": ["a"]}) is None, "a → b → c → a is a cycle: no valid order."
assert topo_order({}) == [], "No tasks."
assert topo_order({"x": [], "y": [], "z": []}) == ["x", "y", "z"], "Independent tasks in alphabetical order."`,
            },
          ],
          solution: "import heapq\n\ndef topo_order(prereqs):\n    indegree = {task: len(deps) for task, deps in prereqs.items()}\n    dependents = {task: [] for task in prereqs}\n    for task, deps in prereqs.items():\n        for d in deps:\n            dependents[d].append(task)\n    ready = [task for task, k in indegree.items() if k == 0]\n    heapq.heapify(ready)\n    order = []\n    while ready:\n        task = heapq.heappop(ready)\n        order.append(task)\n        for nxt in dependents[task]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0:\n                heapq.heappush(ready, nxt)\n    return order if len(order) == len(prereqs) else None\n",
          hint: "in-degree of a task = number of its dependencies. Build the reverse lists (who depends on me). Heap of tasks with in-degree 0; pop, output, decrement each dependent, push those reaching 0. Fewer outputs than tasks means a cycle.",
          successMessage: "Prerequisites first, every time, and a cycle reported rather than an impossible order. pip, npm and make all solve this problem.",
        },
      },
      {
        id: "a-al-cycle-detection",
        title: "Cycle detection",
        explain:
          "In a DIRECTED graph, run DFS with three colours: WHITE (not visited), GREY (on the current DFS path, still being explored) and BLACK (finished). Reaching a GREY vertex means following an edge back to an ancestor on the current path: a cycle. Reaching a BLACK vertex is fine (it is a finished branch). In an UNDIRECTED graph, any edge to a visited vertex other than the one you came from is a cycle (or use union-find: an edge whose ends are already in the same set closes a cycle, as in Kruskal). Both run in O(V + E). Cycle detection finds deadlocks between processes, circular imports and spreadsheet formulas that refer to themselves.",
        codeChallenge: {
          task: "Write has_cycle(graph) for a DIRECTED graph given as a dict (vertex → list of successors; every vertex is a key). Use DFS with three states: unvisited, on the current path, finished. Return True if any edge leads to a vertex that is on the current path.",
          starter: "def has_cycle(graph):\n    pass\n",
          sample: "has_cycle({\"a\": [\"b\"], \"b\": [\"c\"], \"c\": [\"a\"]}) → True",
          tests: [
            {
              check: py`assert has_cycle({"a": ["b"], "b": ["c"], "c": ["a"]}) is True, "a → b → c → a."
assert has_cycle({"a": ["b", "c"], "b": ["d"], "c": ["d"], "d": []}) is False, "A diamond: d is reached twice, but that is not a cycle."
assert has_cycle({"x": ["x"]}) is True, "A self-loop is a cycle."
assert has_cycle({"p": [], "q": ["r"], "r": ["s"], "s": ["q"]}) is True, "The cycle is in a part not reachable from p: check every vertex."
assert has_cycle({}) is False and has_cycle({"solo": []}) is False, "Empty graph, and one vertex."`,
            },
          ],
          solution: "def has_cycle(graph):\n    WHITE, GREY, BLACK = 0, 1, 2\n    state = {v: WHITE for v in graph}\n\n    def visit(u):\n        state[u] = GREY\n        for v in graph[u]:\n            if state[v] == GREY:\n                return True\n            if state[v] == WHITE and visit(v):\n                return True\n        state[u] = BLACK\n        return False\n\n    return any(state[v] == WHITE and visit(v) for v in graph)\n",
          hint: "state[v] = WHITE for all. visit(u): mark GREY; for each successor, GREY means a cycle, WHITE means recurse; mark BLACK when done. Start a visit from every still-WHITE vertex.",
          successMessage: "Grey means \"on my current path\": an edge back into the path is a cycle, an edge into a finished branch is not. The diamond test is the one that catches two-state versions.",
        },
      },
      {
        id: "a-al-graph-applications",
        title: "Applications of graph algorithms",
        explain:
          "Graph algorithms run much of the digital world. Navigation uses Dijkstra and A* on road graphs. Internet routing uses Dijkstra (OSPF) and Bellman-Ford (distance-vector protocols). Social networks use BFS for friend suggestions and degrees of separation. Search engines crawl the web graph with BFS and rank pages by its link structure (PageRank). Package managers and build tools use topological sort. Operating systems detect deadlock as a cycle in a wait-for graph. Utility networks are designed with minimum spanning trees.",
        decision: {
          scenario: "A university timetabling system must check, before term starts, that no course is (directly or indirectly) its own prerequisite.",
          question: "Which algorithm answers this?",
          options: [
            { id: "a", text: "Cycle detection on the directed prerequisite graph (or Kahn's algorithm failing to output every course)", why: "A course that is its own indirect prerequisite is exactly a directed cycle." },
            { id: "b", text: "Dijkstra's algorithm", whyWrong: "There are no distances to minimise." },
            { id: "c", text: "A minimum spanning tree", whyWrong: "MSTs are for undirected, weighted connection problems." },
            { id: "d", text: "BFS distances", whyWrong: "Distances do not reveal a cycle by themselves." },
          ],
          correct: "a",
          aftermath: "Recognising which graph problem you have is most of the work; the algorithm then follows.",
        },
      },
    ],

    task: {
      title: "Module 15 practice: graph projects",
      intro: "Build each with an adjacency list, and state its time complexity in terms of V and E.",
      prompts: [
        "Build a simple route-finding application: load a map of at least 10 places, then answer distance-and-route queries with Dijkstra.",
        "Create a social network connection analyser: degrees of separation (BFS), friend-of-friend suggestions, and the number of separate friend groups (components).",
        "Develop a network traversal visualiser: print the BFS and DFS visiting orders of the same graph, level by level for BFS.",
        "Find the shortest path between two locations where some roads have tolls (negative \"discounts\" allowed) using Bellman-Ford, and report any negative cycle.",
        "Build a dependency ordering system for a list of software packages and their requirements, reporting a valid installation order or the cycle that prevents one.",
      ],
      closing: "Module 16 asks the final question: for which problems is there no efficient algorithm at all?",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
