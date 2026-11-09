/**
 * DESIGN AND ANALYSIS OF ALGORITHMS
 *
 * Authored from the Memora Smart Technologies algorithms curriculum: eight
 * phases and eighteen modules, from "what is an algorithm?" through
 * asymptotic analysis, data structures, searching and sorting, recursion,
 * divide and conquer, greedy algorithms, dynamic programming, graph
 * algorithms and complexity theory, to a documented capstone project.
 *
 * Course content is DATA, never markup. The shape is the same as
 * pythonCourse.js, so the catalog, curriculum tree, lesson player, progress
 * engine and stats band render it without changes.
 *
 * ── ALGORITHMS ARE LEARNED BY DESIGNING, TRACING AND MEASURING THEM ──────
 * Every algorithm in the course is written by the learner in Python, run in
 * the page and checked by tests (`codeChallenge`). Analysis is practised the
 * same way: the learner predicts what a loop counts or what a trace prints
 * (`codeExercise`), and every stated output is executed at build time, so a
 * hand-computed operation count can never be wrong in a lesson.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the topic list from the source document,
 * numbered module.topic. Every lesson declares which numbers it `covers`, and
 * `npm run test:academy` fails if any topic is not taught.
 */

export const ALGORITHMS_COURSE = {
  id: "algorithms",
  slug: "algorithms",
  title: "Design and Analysis of Algorithms",
  subtitle: "Design, analyse and implement efficient algorithms",
  tagline:
    "Learn to design an algorithm, prove it correct, measure how it grows, and choose the right one: from flowcharts and Big O to sorting, greedy methods, dynamic programming, graphs and P versus NP.",
  description:
    "An eighteen-week programme in eight phases that follows a university algorithms course and prepares you for its examinations. You begin with what an algorithm is, how to express one in pseudocode and flowcharts, and how to trace it by hand. Then the mathematics: time complexity derived from code, Big O, Big Omega and Big Theta with proofs, and the common complexity classes. Then space complexity and the data structures every algorithm is built on. Then searching and sorting, every classic algorithm implemented and compared. Then the design techniques: recursion and recurrence relations, divide and conquer with the Master Theorem, greedy algorithms, dynamic programming and graph algorithms. Finally optimisation, amortized analysis, P, NP and NP-completeness, real-world applications and a documented capstone project. Every algorithm is written by you in Python, run in the page and checked by tests, and every worked example and operation count has been executed, so what you see is what really happens.",

  status: "live",
  level: "Beginner → University level",
  durationMonths: 5,
  hoursPerWeek: "8–12",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "design",
      name: "Pseudocode, flowcharts & dry runs",
      short: "Design",
      blurb: "Express an algorithm before you code it, and trace it before you trust it.",
      icon: "fas fa-diagram-project",
      accent: "#7c3aed",
    },
    {
      id: "analysis",
      name: "Asymptotic analysis",
      short: "Analysis",
      blurb: "Big O, Omega and Theta, recurrences and the Master Theorem, derived not memorised.",
      icon: "fas fa-square-root-variable",
      accent: "#2563eb",
    },
    {
      id: "python",
      name: "Python, in the page",
      short: "Python",
      blurb: "Every algorithm implemented by you, run and checked by tests as you learn it.",
      icon: "fab fa-python",
      accent: "#0e7490",
    },
    {
      id: "techniques",
      name: "Design techniques",
      short: "Techniques",
      blurb: "Divide and conquer, greedy, dynamic programming and graph algorithms.",
      icon: "fas fa-sitemap",
      accent: "#b45309",
    },
  ],

  outcomes: [
    "Explain what an algorithm is and express one in natural language, pseudocode and a flowchart",
    "Trace algorithms by hand, find logical errors and argue that an algorithm is correct",
    "Derive the time complexity of loops, nested loops and recursive code, and state it in Big O, Ω and Θ",
    "Prove simple asymptotic bounds from the definitions and solve recurrences with the Master Theorem",
    "Analyse space complexity, including recursion stacks, and reason about time-space trade-offs",
    "Implement and choose between arrays, linked lists, stacks, queues, hash tables, trees, heaps and graphs",
    "Implement, compare and choose searching and sorting algorithms by their best, average and worst cases",
    "Solve problems with recursion, divide and conquer, greedy methods, dynamic programming and graph algorithms",
    "Explain amortized analysis, P, NP, NP-completeness, and when approximation or randomisation is needed",
  ],

  audience: [
    "Computer science and engineering students taking an algorithms or data structures course",
    "Students preparing for algorithms examinations who want to understand, not memorise",
    "Programmers who can write code but cannot yet say how fast it is or why",
    "Candidates preparing for technical interviews",
  ],

  requirements: [
    "A laptop or desktop computer. The in-lesson editor also works on a phone",
    "A stable internet connection",
    "Basic programming in any language helps. The Python you need is introduced in Module 2",
    "Secondary-school algebra: powers, logarithms are revised in the course",
  ],

  phases: [
    { phase: 1, title: "Foundations of algorithms and computational thinking", weeks: [1, 2, 3] },
    { phase: 2, title: "Asymptotic analysis and complexity theory", weeks: [4, 5, 6] },
    { phase: 3, title: "Space complexity and data structures", weeks: [7, 8] },
    { phase: 4, title: "Fundamental searching and sorting algorithms", weeks: [9, 10] },
    { phase: 5, title: "Advanced algorithm design techniques", weeks: [11, 12, 13] },
    { phase: 6, title: "Advanced problem-solving algorithms", weeks: [14, 15] },
    { phase: 7, title: "Algorithm optimisation and computational complexity", weeks: [16] },
    { phase: 8, title: "Real-world applications and capstone project", weeks: [17, 18] },
  ],

  months: [
    {
      month: 1,
      title: "Foundations and Time Complexity",
      focus: "Foundations",
      summary:
        "Phase 1 and the start of Phase 2. What algorithms are, how to express and trace them, why efficiency matters, and deriving time complexity from code.",
      modules: [
        {
          id: "al-m1-intro",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 1 · Introduction to Algorithms",
          summary:
            "What an algorithm is, the five characteristics of a good one, algorithms versus programs, how computers execute instructions, and computational thinking.",
          atoms: 12,
          topics: [
            "What an algorithm is and how it relates to programming",
            "Correctness, finiteness, definiteness, input/output and effectiveness",
            "Algorithms versus programs, and where algorithms are used",
            "How computers execute instructions",
            "Problem solving and computational thinking",
            "Decomposition, pattern recognition and abstraction",
          ],
          curriculum: [
            ["1.1", "What is an algorithm?"],
            ["1.2", "The relationship between algorithms and programming"],
            ["1.3", "Characteristics of a good algorithm: correctness, finiteness, definiteness, input and output, effectiveness"],
            ["1.4", "Algorithms versus programs"],
            ["1.5", "Real-world applications of algorithms"],
            ["1.6", "How computers execute instructions"],
            ["1.7", "Problem-solving methodologies"],
            ["1.8", "Understanding computational thinking"],
            ["1.9", "Decomposition, pattern recognition and abstraction"],
            ["1.10", "Algorithm design versus algorithm implementation"],
          ],
          project:
            "Algorithms for the average of five numbers, even or odd, the largest of three numbers, an ATM withdrawal and a student pass/fail decision.",
        },
        {
          id: "al-m2-representation",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Module 2 · Algorithm Representation and Development",
          summary:
            "Natural language, pseudocode and flowcharts; translating between them and into Python; dry runs, execution paths, logical errors and correctness.",
          atoms: 12,
          topics: [
            "Natural language descriptions and pseudocode",
            "Flowchart symbols and flow",
            "From flowchart to pseudocode to Python",
            "Dry runs and execution paths",
            "Logical errors, correctness and validation",
          ],
          curriculum: [
            ["2.1", "Natural language algorithm descriptions"],
            ["2.2", "Pseudocode: syntax, variables and assignments, input and output, selection, iteration and loops, nested conditions"],
            ["2.3", "Flowcharts: symbols, input/output, decision and processing symbols, flow lines and connectors"],
            ["2.4", "Translating flowcharts into pseudocode"],
            ["2.5", "Translating pseudocode into programming languages"],
            ["2.6", "Tracing algorithms manually (dry runs)"],
            ["2.7", "Understanding execution paths"],
            ["2.8", "Identifying logical errors"],
            ["2.9", "Algorithm correctness and validation"],
          ],
          project:
            "A calculator flowchart, login pseudocode, compound interest, a multi-condition grading algorithm and a manual trace of a nested loop.",
        },
        {
          id: "al-m3-analysis",
          order: 3,
          phase: 1,
          week: "Week 3",
          title: "Module 3 · Introduction to Algorithm Analysis",
          summary:
            "Why two correct algorithms can perform very differently: resources, time, memory, input size, best, average and worst cases, and measuring performance.",
          atoms: 12,
          topics: [
            "What analysis is and why efficiency matters",
            "Computational resources: time and memory",
            "Input size and growth",
            "Best, average and worst cases",
            "Empirical versus theoretical analysis",
          ],
          curriculum: [
            ["3.1", "What is algorithm analysis?"],
            ["3.2", "Why algorithm efficiency matters"],
            ["3.3", "Correctness versus efficiency"],
            ["3.4", "Introduction to computational resources"],
            ["3.5", "Execution time"],
            ["3.6", "Memory consumption"],
            ["3.7", "Input size and its effect on performance"],
            ["3.8", "Best-case performance"],
            ["3.9", "Average-case performance"],
            ["3.10", "Worst-case performance"],
            ["3.11", "Empirical analysis versus theoretical analysis"],
            ["3.12", "Measuring algorithm performance experimentally"],
          ],
          project:
            "Compare two maximum-finding algorithms, measure time against input size, find the cases of linear search, and explain why 10 records is not 1,000,000.",
        },
        {
          id: "al-m4-time-complexity",
          order: 4,
          phase: 2,
          week: "Week 4",
          title: "Module 4 · Time Complexity",
          summary:
            "Counting basic operations as a function of n: sequences, conditionals, single, nested and consecutive loops, different increments, logarithmic loops and recursion.",
          atoms: 15,
          topics: [
            "Time complexity, n and basic operations",
            "Constant time, loops and sequential statements",
            "Conditionals, nested and consecutive loops",
            "Different increments and logarithmic loops",
            "Recursive algorithms",
            "Deriving complexity from pseudocode and code",
          ],
          curriculum: [
            ["4.1", "What is time complexity?"],
            ["4.2", "Input size represented by n"],
            ["4.3", "Counting basic operations"],
            ["4.4", "Understanding constant-time operations"],
            ["4.5", "Counting iterations in loops"],
            ["4.6", "Time complexity of sequential statements"],
            ["4.7", "Time complexity of conditional statements"],
            ["4.8", "Time complexity of nested loops"],
            ["4.9", "Time complexity of consecutive loops"],
            ["4.10", "Time complexity of loops with different increments"],
            ["4.11", "Time complexity of logarithmic loops"],
            ["4.12", "Analysing recursive algorithms"],
            ["4.13", "Deriving time complexity from pseudocode"],
            ["4.14", "Deriving time complexity from actual source code"],
          ],
          project:
            "Derive, and confirm by counting, O(1), O(n), O(n²), O(n³), O(log n) and O(n log n) for real code.",
        },
      ],
    },
    {
      month: 2,
      title: "Asymptotic Notation, Space and Data Structures",
      focus: "Analysis",
      summary:
        "The rest of Phase 2 and Phase 3. Big O, Ω and Θ with proofs, complexity classes, space complexity, and the data structures algorithms are built on.",
      modules: [
        {
          id: "al-m5-notation",
          order: 5,
          phase: 2,
          week: "Week 5",
          title: "Module 5 · Big O, Big Omega and Big Theta Notations",
          summary:
            "The mathematical language of growth: upper, lower and tight bounds, little o and little omega, dominant terms, and proving bounds from the definitions.",
          atoms: 12,
          topics: [
            "Asymptotic notation and Big O",
            "Big Omega, Big Theta, little o and little omega",
            "Dominant terms, constants and simplification",
            "Comparing functions and proving bounds",
          ],
          curriculum: [
            ["5.1", "Introduction to asymptotic notation"],
            ["5.2", "Big O notation: upper bounds, growth rates and why Big O is commonly used"],
            ["5.3", "Big Omega notation: lower bounds and minimum growth"],
            ["5.4", "Big Theta notation: tight asymptotic bounds"],
            ["5.5", "Little o notation"],
            ["5.6", "Little omega notation"],
            ["5.7", "Mathematical interpretation of complexity"],
            ["5.8", "Identifying dominant terms"],
            ["5.9", "Removing constants"],
            ["5.10", "Simplifying polynomial expressions"],
            ["5.11", "Comparing asymptotic functions"],
            ["5.12", "Proving complexity bounds using mathematical definitions"],
          ],
          project:
            "Find and prove the bounds of 5n² + 3n + 10, 8n + 100 and n³ + 20n² + 50, and explain why lower-order terms and constants do not decide growth.",
        },
        {
          id: "al-m6-classes",
          order: 6,
          phase: 2,
          week: "Week 6",
          title: "Module 6 · Understanding Common Complexity Classes",
          summary:
            "Constant, logarithmic, linear, linearithmic, quadratic, cubic, polynomial, exponential and factorial growth, and what each means for real data sizes.",
          atoms: 12,
          topics: [
            "O(1), O(log n), O(n) and O(n log n)",
            "O(n²), O(n³) and polynomial time",
            "Exponential and factorial time",
            "Comparing classes and scalability",
          ],
          curriculum: [
            ["6.1", "Constant complexity – O(1)"],
            ["6.2", "Logarithmic complexity – O(log n)"],
            ["6.3", "Linear complexity – O(n)"],
            ["6.4", "Linearithmic complexity – O(n log n)"],
            ["6.5", "Quadratic complexity – O(n²)"],
            ["6.6", "Cubic complexity – O(n³)"],
            ["6.7", "Polynomial complexity – O(nᵏ)"],
            ["6.8", "Exponential complexity – O(2ⁿ)"],
            ["6.9", "Factorial complexity – O(n!)"],
            ["6.10", "Comparing complexity classes"],
            ["6.11", "Understanding scalability"],
            ["6.12", "Practical implications of different growth rates"],
          ],
          project:
            "Rank the classes, compute their cost at 100, 1,000 and 1,000,000 records, decide which suit large datasets, and tabulate growth curves in Python.",
        },
        {
          id: "al-m7-space",
          order: 7,
          phase: 3,
          week: "Week 7",
          title: "Module 7 · Space Complexity",
          summary:
            "How much memory an algorithm needs: auxiliary versus input space, constant, linear and quadratic space, recursion stacks, in-place algorithms and trade-offs.",
          atoms: 12,
          topics: [
            "Space complexity and auxiliary space",
            "Constant, linear and quadratic space",
            "Memory for variables and arrays",
            "Recursive stack space and in-place algorithms",
            "Time-space trade-offs",
          ],
          curriculum: [
            ["7.1", "What is space complexity?"],
            ["7.2", "Time complexity versus space complexity"],
            ["7.3", "Auxiliary space"],
            ["7.4", "Input space versus auxiliary space"],
            ["7.5", "Constant space complexity"],
            ["7.6", "Linear space complexity"],
            ["7.7", "Quadratic space complexity"],
            ["7.8", "Memory allocation"],
            ["7.9", "Variables and memory consumption"],
            ["7.10", "Arrays and memory usage"],
            ["7.11", "Recursive stack space"],
            ["7.12", "In-place algorithms"],
            ["7.13", "Time-space trade-offs"],
            ["7.14", "Analysing memory-efficient algorithms"],
          ],
          project:
            "Compare two array reversals, find the extra memory of sorting methods and recursive functions, and implement an in-place reversal.",
        },
        {
          id: "al-m8-data-structures",
          order: 8,
          phase: 3,
          week: "Week 8",
          title: "Module 8 · Data Structures for Algorithm Design",
          summary:
            "ADTs, arrays, linked lists, stacks, queues, hash tables, trees, heaps and graphs, each implemented and compared by the cost of its operations.",
          atoms: 18,
          topics: [
            "ADTs, arrays and dynamic arrays",
            "Singly, doubly and circular linked lists",
            "Stacks and queues",
            "Hash tables",
            "Trees, binary search trees and heaps",
            "Graphs and choosing a structure",
          ],
          curriculum: [
            ["8.1", "Introduction to data structures"],
            ["8.2", "Abstract Data Types (ADTs)"],
            ["8.3", "Arrays and dynamic arrays"],
            ["8.4", "Linked lists: singly, doubly and circular"],
            ["8.5", "Stacks: push and pop, the LIFO principle and applications"],
            ["8.6", "Queues: enqueue and dequeue, FIFO, circular queues and priority queues"],
            ["8.7", "Hash tables: hash functions, collisions and collision resolution"],
            ["8.8", "Trees: binary trees, binary search trees and tree traversal"],
            ["8.9", "Heaps and priority queues"],
            ["8.10", "Graphs: directed and undirected, weighted and unweighted, adjacency matrices and lists"],
            ["8.11", "Choosing the appropriate data structure"],
            ["8.12", "Comparing operations and their complexity"],
          ],
          project:
            "Implement a stack, a queue, a linked list, a hash table and a binary search tree, and compare searching an array with a hash table.",
        },
      ],
    },
    {
      month: 3,
      title: "Searching, Sorting and Recursion",
      focus: "Core algorithms",
      summary:
        "Phase 4 and the start of Phase 5. Every classic searching and sorting algorithm, then recursion, recurrence relations and divide and conquer.",
      modules: [
        {
          id: "al-m9-searching",
          order: 9,
          phase: 4,
          week: "Week 9",
          title: "Module 9 · Searching Algorithms",
          summary:
            "Linear, binary (iterative and recursive), jump, interpolation and exponential search; sorted versus unsorted data and choosing a technique.",
          atoms: 12,
          topics: [
            "Linear and binary search",
            "Iterative versus recursive binary search",
            "Jump, interpolation and exponential search",
            "Comparing and choosing searching algorithms",
          ],
          curriculum: [
            ["9.1", "Introduction to searching"],
            ["9.2", "Linear search"],
            ["9.3", "Binary search"],
            ["9.4", "Iterative versus recursive binary search"],
            ["9.5", "Jump search"],
            ["9.6", "Interpolation search"],
            ["9.7", "Exponential search"],
            ["9.8", "Searching in sorted versus unsorted data"],
            ["9.9", "Comparing searching algorithms"],
            ["9.10", "Time and space complexity of searching algorithms"],
            ["9.11", "Choosing the appropriate searching technique"],
          ],
          project:
            "A student record search, a contact search, a product lookup, and a linear-versus-binary comparison on large data.",
        },
        {
          id: "al-m10-sorting",
          order: 10,
          phase: 4,
          week: "Week 10",
          title: "Module 10 · Sorting Algorithms",
          summary:
            "Stability and in-place sorting; bubble, selection, insertion, merge, quick, heap, counting, radix and bucket sort, compared case by case.",
          atoms: 15,
          topics: [
            "Sorting, stability and in-place sorting",
            "Bubble, selection and insertion sort",
            "Merge sort and quick sort",
            "Heap, counting, radix and bucket sort",
            "Comparing and selecting sorting algorithms",
          ],
          curriculum: [
            ["10.1", "Introduction to sorting"],
            ["10.2", "Stability in sorting algorithms"],
            ["10.3", "In-place versus out-of-place sorting"],
            ["10.4", "Bubble sort"],
            ["10.5", "Selection sort"],
            ["10.6", "Insertion sort"],
            ["10.7", "Merge sort"],
            ["10.8", "Quick sort"],
            ["10.9", "Heap sort"],
            ["10.10", "Counting sort"],
            ["10.11", "Radix sort"],
            ["10.12", "Bucket sort"],
            ["10.13", "Comparing sorting algorithms"],
            ["10.14", "Best, average and worst-case analysis"],
            ["10.15", "Selecting appropriate sorting algorithms"],
          ],
          project:
            "A student ranking system, products sorted by price, sorted examination results, and a comparison of sorts at increasing sizes.",
        },
        {
          id: "al-m11-recursion",
          order: 11,
          phase: 5,
          week: "Week 11",
          title: "Module 11 · Recursion and Recursive Algorithms",
          summary:
            "Base and recursive cases, the call stack, direct, indirect and tail recursion, recursion versus iteration, recursion trees and recurrence relations.",
          atoms: 12,
          topics: [
            "Recursive functions, base and recursive cases",
            "The call stack and kinds of recursion",
            "Recursion trees and recurrence relations",
            "Recursion depth and complexity",
          ],
          curriculum: [
            ["11.1", "What is recursion?"],
            ["11.2", "Recursive functions"],
            ["11.3", "Base cases"],
            ["11.4", "Recursive cases"],
            ["11.5", "Call stack and memory"],
            ["11.6", "Direct recursion"],
            ["11.7", "Indirect recursion"],
            ["11.8", "Tail recursion"],
            ["11.9", "Recursion versus iteration"],
            ["11.10", "Recursive tree analysis"],
            ["11.11", "Recurrence relations"],
            ["11.12", "Solving recurrence relations"],
            ["11.13", "Recursion depth and stack overflow"],
            ["11.14", "Analysing recursive algorithm complexity"],
          ],
          project:
            "Factorial, Fibonacci, array sum, string reversal, recursive binary search and the Tower of Hanoi.",
        },
        {
          id: "al-m12-divide-conquer",
          order: 12,
          phase: 5,
          week: "Week 12",
          title: "Module 12 · Divide and Conquer",
          summary:
            "Divide, conquer and combine; recurrences and recursion trees; the Master Theorem; merge sort, quick sort and binary search analysed; Karatsuba multiplication.",
          atoms: 12,
          topics: [
            "Divide, conquer and combine",
            "Recurrences and recursion trees",
            "The Master Theorem",
            "Merge sort, quick sort and binary search analysed",
            "Karatsuba, advantages and limitations",
          ],
          curriculum: [
            ["12.1", "Introduction to divide and conquer"],
            ["12.2", "Divide, conquer and combine"],
            ["12.3", "Recurrence relations"],
            ["12.4", "Recursion trees"],
            ["12.5", "Master Theorem"],
            ["12.6", "Merge sort analysis"],
            ["12.7", "Quick sort analysis"],
            ["12.8", "Binary search analysis"],
            ["12.9", "Karatsuba multiplication (introduction)"],
            ["12.10", "Advantages and limitations of divide and conquer"],
          ],
          project:
            "Implement merge sort and quick sort, solve problems with binary search, draw recursion trees and apply the Master Theorem.",
        },
      ],
    },
    {
      month: 4,
      title: "Greedy, Dynamic Programming, Graphs and Complexity",
      focus: "Advanced",
      summary:
        "The rest of Phase 5, Phases 6 and 7. Greedy algorithms, dynamic programming, graph algorithms, optimisation, amortized analysis and P versus NP.",
      modules: [
        {
          id: "al-m13-greedy",
          order: 13,
          phase: 5,
          week: "Week 13",
          title: "Module 13 · Greedy Algorithms",
          summary:
            "The greedy-choice property and optimal substructure; activity selection, fractional knapsack, coin change, job sequencing, Huffman coding and minimum spanning trees.",
          atoms: 12,
          topics: [
            "The greedy method, greedy choice and optimal substructure",
            "Activity selection, fractional knapsack, coin change and job sequencing",
            "Huffman coding and minimum spanning trees",
            "When greedy fails, and proving it correct",
          ],
          curriculum: [
            ["13.1", "Introduction to greedy algorithms"],
            ["13.2", "Greedy-choice property"],
            ["13.3", "Optimal substructure"],
            ["13.4", "Greedy strategy development"],
            ["13.5", "Activity selection problem"],
            ["13.6", "Fractional knapsack problem"],
            ["13.7", "Coin change problem"],
            ["13.8", "Job sequencing with deadlines"],
            ["13.9", "Huffman coding"],
            ["13.10", "Minimum spanning trees"],
            ["13.11", "Prim's algorithm"],
            ["13.12", "Kruskal's algorithm"],
            ["13.13", "When greedy algorithms fail"],
            ["13.14", "Proving greedy algorithm correctness"],
          ],
          project:
            "A meeting scheduler, a currency allocation algorithm, a Huffman compression demonstration and a resource allocation problem.",
        },
        {
          id: "al-m14-dynamic-programming",
          order: 14,
          phase: 6,
          week: "Week 14",
          title: "Module 14 · Dynamic Programming",
          summary:
            "Overlapping subproblems and optimal substructure; memoization and tabulation; Fibonacci, 0/1 knapsack, coin change, LCS, LIS and matrix chain multiplication.",
          atoms: 15,
          topics: [
            "Overlapping subproblems, memoization and tabulation",
            "Fibonacci optimisation and the 0/1 knapsack",
            "Coin change and the longest common subsequence",
            "Longest increasing subsequence and matrix chain multiplication",
            "State transitions, optimisation and analysis",
          ],
          curriculum: [
            ["14.1", "Introduction to dynamic programming"],
            ["14.2", "Overlapping subproblems"],
            ["14.3", "Optimal substructure"],
            ["14.4", "Memoization"],
            ["14.5", "Tabulation"],
            ["14.6", "Top-down versus bottom-up approaches"],
            ["14.7", "Fibonacci optimisation"],
            ["14.8", "0/1 Knapsack problem"],
            ["14.9", "Coin change problem"],
            ["14.10", "Longest Common Subsequence (LCS)"],
            ["14.11", "Longest Increasing Subsequence (LIS)"],
            ["14.12", "Matrix chain multiplication"],
            ["14.13", "State transitions"],
            ["14.14", "Optimising dynamic programming solutions"],
            ["14.15", "Time and space complexity analysis"],
          ],
          project:
            "A minimum-cost travel calculator, a knapsack solver, an LCS text similarity demonstration, and recursive, memoized and tabulated Fibonacci compared.",
        },
        {
          id: "al-m15-graphs",
          order: 15,
          phase: 6,
          week: "Week 15",
          title: "Module 15 · Graph Algorithms",
          summary:
            "Graph theory and representations; BFS and DFS; Dijkstra, Bellman-Ford and Floyd-Warshall; minimum spanning trees, topological sorting and cycle detection.",
          atoms: 15,
          topics: [
            "Graph theory, kinds of graph and representations",
            "Breadth-first and depth-first search",
            "Shortest paths and Dijkstra's algorithm",
            "Bellman-Ford, Floyd-Warshall and minimum spanning trees",
            "Topological sorting, cycle detection and applications",
          ],
          curriculum: [
            ["15.1", "Introduction to graph theory"],
            ["15.2", "Vertices and edges"],
            ["15.3", "Directed and undirected graphs"],
            ["15.4", "Weighted and unweighted graphs"],
            ["15.5", "Connected and disconnected graphs"],
            ["15.6", "Graph representations"],
            ["15.7", "Breadth-First Search (BFS)"],
            ["15.8", "Depth-First Search (DFS)"],
            ["15.9", "Shortest path algorithms"],
            ["15.10", "Dijkstra's algorithm"],
            ["15.11", "Bellman-Ford algorithm"],
            ["15.12", "Floyd-Warshall algorithm"],
            ["15.13", "Minimum spanning trees"],
            ["15.14", "Topological sorting"],
            ["15.15", "Cycle detection"],
            ["15.16", "Applications of graph algorithms"],
          ],
          project:
            "A route finder, a social network connection analyser, a traversal visualiser, shortest paths between locations and a dependency ordering system.",
        },
        {
          id: "al-m16-complexity",
          order: 16,
          phase: 7,
          week: "Week 16",
          title: "Module 16 · Algorithm Optimisation and Complexity Theory",
          summary:
            "Optimisation principles and bottlenecks; amortized analysis by aggregate, accounting and potential methods; P, NP, NP-hard and NP-complete; approximation and randomisation.",
          atoms: 15,
          topics: [
            "Optimisation principles and bottlenecks",
            "Amortized analysis: aggregate, accounting and potential methods",
            "Polynomial and exponential time",
            "P, NP, NP-hard and NP-complete; decision problems",
            "Approximation, randomisation and the limits of computation",
          ],
          curriculum: [
            ["16.1", "Algorithm optimisation principles"],
            ["16.2", "Identifying performance bottlenecks"],
            ["16.3", "Reducing unnecessary iterations"],
            ["16.4", "Avoiding redundant calculations"],
            ["16.5", "Choosing efficient data structures"],
            ["16.6", "Caching and memoization"],
            ["16.7", "Loop optimisation"],
            ["16.8", "Time-space trade-offs"],
            ["16.9", "Amortized analysis"],
            ["16.10", "Aggregate analysis"],
            ["16.11", "Accounting method"],
            ["16.12", "Potential method"],
            ["16.13", "Introduction to computational complexity theory"],
            ["16.14", "Polynomial-time algorithms"],
            ["16.15", "Exponential-time algorithms"],
            ["16.16", "P versus NP"],
            ["16.17", "NP problems"],
            ["16.18", "NP-hard and NP-complete problems"],
            ["16.19", "Decision problems"],
            ["16.20", "Introduction to approximation algorithms"],
            ["16.21", "Introduction to randomized algorithms"],
            ["16.22", "Limits of algorithmic computation"],
          ],
          project:
            "Optimise an inefficient algorithm, compare solutions, find bottlenecks with a profiler, analyse an amortized structure, and investigate the Travelling Salesperson Problem.",
        },
      ],
    },
    {
      month: 5,
      title: "Real-World Applications and Capstone",
      focus: "Applied",
      summary:
        "Phase 8. How algorithms run search engines, banks, maps and feeds, then a capstone project designed, implemented, analysed and documented in full.",
      modules: [
        {
          id: "al-m17-applications",
          order: 17,
          phase: 8,
          week: "Week 17",
          title: "Module 17 · Applying Algorithms to Real-World Systems",
          summary:
            "Search engines, banking, recommendations, social feeds, e-commerce, navigation, AI, cybersecurity, databases, analytics, distributed systems and machine learning.",
          atoms: 9,
          topics: [
            "Search engines, banking and recommendation systems",
            "Social media, e-commerce, navigation and AI",
            "Cybersecurity, databases, analytics, distributed systems and machine learning",
          ],
          curriculum: [
            ["17.1", "Algorithms in search engines"],
            ["17.2", "Algorithms in banking and financial systems"],
            ["17.3", "Algorithms in recommendation systems"],
            ["17.4", "Algorithms in social media platforms"],
            ["17.5", "Algorithms in e-commerce"],
            ["17.6", "Algorithms in GPS and navigation"],
            ["17.7", "Algorithms in artificial intelligence"],
            ["17.8", "Algorithms in cybersecurity"],
            ["17.9", "Algorithms in database management"],
            ["17.10", "Algorithms in data processing and analytics"],
            ["17.11", "Algorithms in distributed systems"],
            ["17.12", "Introduction to machine learning algorithms"],
          ],
          project:
            "Case studies: search retrieval, product recommendation, suspicious-transaction detection, route calculation and content ranking.",
        },
        {
          id: "al-m18-capstone",
          order: 18,
          phase: 8,
          week: "Week 18",
          type: "capstone",
          title: "Module 18 · Final Capstone Project",
          summary:
            "Choose a project, then design, implement, analyse, test and document it: problem statement to final report.",
          atoms: 9,
          topics: [
            "Choosing a project and stating the problem",
            "Designing the algorithm: pseudocode and flowchart",
            "Implementing, analysing, testing and reporting",
          ],
          curriculum: [
            ["18.1", "Choosing a capstone project"],
            ["18.2", "Problem statement and problem analysis"],
            ["18.3", "Proposed algorithm, pseudocode and flowchart"],
            ["18.4", "Source code"],
            ["18.5", "Time and space complexity analysis"],
            ["18.6", "Test cases and results"],
            ["18.7", "Performance comparison, optimisation and the final report"],
          ],
          project:
            "One of: an intelligent route finder, a product search and recommendation system, a student result processor, a resource allocation optimiser or a social network analyser, fully documented.",
        },
      ],
    },
  ],

  capstone: {
    title: "A Designed, Implemented and Analysed Algorithmic System",
    summary:
      "Choose one: an intelligent route finder (graphs and Dijkstra), a product search and recommendation system, a student result processing system, a resource allocation optimiser (greedy and dynamic programming) or a social network connection analyser. Whichever you choose, you design it, implement it, analyse it and document it like an engineer.",
    deliverables: [
      "Problem statement and problem analysis",
      "Proposed algorithm, pseudocode and flowchart",
      "Source code that runs",
      "Time and space complexity analysis",
      "Test cases and results, including edge cases",
      "Performance comparison and optimisation",
      "A final project report",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Design and Analysis of Algorithms",
    covers: "Algorithm design • Asymptotic analysis • Data structures • Searching & sorting • Recursion, greedy & DP • Graphs • Complexity theory",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson, including every write-the-algorithm practice",
      "Pass every lesson check at 70% or above",
      "Complete and document the capstone project (all eleven deliverables)",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Foundations check",
      format: "Design, trace and analyse simple algorithms; derive time complexity from code.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Analysis and structures check",
      format: "Prove asymptotic bounds, compare complexity classes, and implement core data structures.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Core algorithms check",
      format: "Implement and compare searching and sorting algorithms; solve recurrences.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Design techniques check",
      format: "Greedy, dynamic programming and graph algorithms implemented and analysed.",
      passMark: 70,
    },
    {
      afterMonth: 5,
      title: "Final",
      format: "The documented capstone project and the certification exam.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const ALGORITHMS_MODULE_IDS = ALGORITHMS_COURSE.months.flatMap((m) =>
  m.modules.map((mod) => mod.id)
);

export default ALGORITHMS_COURSE;
