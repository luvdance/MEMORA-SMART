/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 11 · RECURSION
 *
 * Curriculum 11.1 – 11.14. Recursive functions, base and recursive cases,
 * the call stack, direct, indirect and tail recursion, recursion versus
 * iteration, recursion trees, recurrence relations and how to solve them,
 * recursion depth, and analysing recursive algorithms. The curriculum's
 * exercises (factorial, Fibonacci, array sum, string reversal, recursive
 * binary search, Tower of Hanoi) are all written by the learner.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s11-recursion";

const PY = "python";
const py = String.raw;

/** Check that the named function calls itself and that no loop is used. */
const recursive = (name) => py`
import ast as _ast
_fn = [n for n in _ast.walk(_ast.parse(source)) if isinstance(n, _ast.FunctionDef) and n.name == "${name}"]
assert _fn and any(isinstance(c, _ast.Call) and getattr(c.func, "id", "") == "${name}" for c in _ast.walk(_fn[0])), "${name} must call itself: this exercise is about recursion."
assert not uses("For") and not uses("While"), "Use recursion, not a loop."`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 11.1 – 11.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l45-recursion-basics",
    moduleId: "al-m11-recursion",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3", "11.4", "11.5"],
    title: "Recursive Functions and the Call Stack",
    subtitle: "Base cases, recursive cases and what the computer really does",
    estimatedMinutes: 28,
    intro:
      "A recursive function solves a problem by solving a smaller version of the same problem. It feels like magic until you see the call stack doing the bookkeeping, and then it becomes one of the most powerful tools in algorithm design.",

    atoms: [
      {
        id: "a-al-what-is-recursion",
        title: "What is recursion? Recursive functions",
        explain:
          "RECURSION is defining something in terms of a smaller instance of itself. A RECURSIVE FUNCTION calls itself on a smaller input until it reaches an input small enough to answer directly. The factorial is the standard example: n! = n × (n − 1)! for n ≥ 1, and 0! = 1. That definition is already an algorithm: factorial(n) returns 1 if n is 0, and otherwise n × factorial(n − 1). Recursion is natural for problems that are recursive in structure: trees, nested data, divide and conquer.",
        codeChallenge: {
          task: "Write factorial(n) RECURSIVELY for n ≥ 0: return 1 when n is 0 (or 1), and otherwise n * factorial(n - 1). Use no loop.",
          starter: "def factorial(n):\n    pass\n",
          sample: "factorial(5) → 120",
          tests: [
            {
              check: py`assert factorial(5) == 120, "5! = 120. Got " + repr(factorial(5))
assert factorial(0) == 1 and factorial(1) == 1, "0! and 1! are both 1."
assert factorial(20) == 2432902008176640000, "20! must be exact."` + recursive("factorial"),
            },
          ],
          solution: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n",
          hint: "if n <= 1: return 1. Otherwise return n * factorial(n - 1).",
          successMessage: "A direct translation of the mathematical definition. n calls, each doing O(1) work: O(n) time, and O(n) stack space.",
        },
      },
      {
        id: "a-al-base-recursive-cases",
        title: "Base cases and recursive cases",
        explain:
          "Every recursive function needs two parts. The BASE CASE answers the smallest inputs directly, without recursion: it is what stops the recursion. The RECURSIVE CASE reduces the problem to one or more SMALLER instances and combines their answers. Two rules guarantee termination: every recursive call must make PROGRESS towards a base case, and every possible input must eventually reach one. A missing base case, or a call that does not shrink the input (factorial(n) calling factorial(n)), recurses until the stack overflows.",
        codeChallenge: {
          task: "Write sum_list(items, i=0) that returns the sum of items[i:] RECURSIVELY: the base case is i == len(items) (sum 0); the recursive case is items[i] + sum_list(items, i + 1). Use no loop and no sum().",
          starter: "def sum_list(items, i=0):\n    pass\n",
          sample: "sum_list([4, 8, 15, 16, 23, 42]) → 108",
          tests: [
            {
              check: py`assert sum_list([4, 8, 15, 16, 23, 42]) == 108, "The sum is 108. Got " + repr(sum_list([4, 8, 15, 16, 23, 42]))
assert sum_list([]) == 0, "The base case: an empty list sums to 0."
assert sum_list([-3, 3, 7]) == 7, "Negative numbers."
assert sum_list(list(range(300))) == 44850, "300 items: 300 nested calls."
assert not calls("sum"), "Add the items yourself, without sum()."` + recursive("sum_list"),
            },
          ],
          solution: "def sum_list(items, i=0):\n    if i == len(items):\n        return 0\n    return items[i] + sum_list(items, i + 1)\n",
          hint: "if i == len(items): return 0. Otherwise return items[i] + sum_list(items, i + 1).",
          successMessage: "Passing an index instead of slicing (items[1:]) avoids copying the list at every call, which would make this O(n²).",
        },
      },
      {
        id: "a-al-call-stack",
        title: "The call stack and memory",
        explain:
          "Each function call gets a STACK FRAME holding its parameters, local variables and the place to return to. A recursive call pushes a new frame on top; the caller's frame waits underneath, suspended in the middle of its own line. When the base case returns, frames are popped one by one and each waiting call finishes its computation with the returned value. factorial(3) pushes frames for 3, 2 and 1; then 1 returns 1, the frame for 2 computes 2 × 1, and the frame for 3 computes 3 × 2. The maximum number of frames at once is the recursion DEPTH, and it is the recursion's memory cost.",
        table: {
          caption: "The call stack during factorial(3).",
          headers: ["Step", "Event", "Stack (top on the right)"],
          rows: [
            ["1", "call factorial(3)", "f(3)"],
            ["2", "f(3) calls factorial(2)", "f(3) f(2)"],
            ["3", "f(2) calls factorial(1)", "f(3) f(2) f(1)"],
            ["4", "f(1) returns 1 (base case)", "f(3) f(2)"],
            ["5", "f(2) returns 2 × 1 = 2", "f(3)"],
            ["6", "f(3) returns 3 × 2 = 6", "(empty)"],
          ],
        },
        codeExercise: {
          language: PY,
          code: py`def fact(n, depth=0):
    print("  " * depth + "fact(" + str(n) + ")")
    if n <= 1:
        return 1
    result = n * fact(n - 1, depth + 1)
    print("  " * depth + "= " + str(result))
    return result

fact(3)
`,
          question: "This prints each call, indented by its depth, and each result as the calls return. What does it print?",
          expectedOutput: "fact(3)\n  fact(2)\n    fact(1)\n  = 2\n= 6",
          hint: "Calls go deeper first. fact(1) is the base case and prints no result line. Then the waiting calls finish, innermost first.",
          successMessage: "Down the stack, then back up: the waiting calls finish in reverse order of their calls. That is the LIFO stack from Module 8.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 11.6 – 11.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l46-kinds-of-recursion",
    moduleId: "al-m11-recursion",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.6", "11.7", "11.8", "11.9"],
    title: "Direct, Indirect and Tail Recursion",
    subtitle: "And when to choose iteration instead",
    estimatedMinutes: 28,
    intro:
      "Recursion comes in several shapes. Recognising them tells you how much memory a recursive algorithm uses and whether it can be rewritten as a simple loop.",

    atoms: [
      {
        id: "a-al-direct-indirect",
        title: "Direct and indirect recursion",
        explain:
          "In DIRECT recursion a function calls itself (factorial calls factorial). In INDIRECT (or MUTUAL) recursion a function calls another function that eventually calls the first: A calls B, and B calls A. Mutual recursion appears in parsers (an expression contains a term, a term contains a bracketed expression) and in state machines. The classic small example defines evenness in terms of oddness: n is even if n − 1 is odd; n is odd if n − 1 is even; 0 is even. The base case and progress rules apply across the whole cycle.",
        codeExercise: {
          language: PY,
          code: py`def is_even(n):
    if n == 0:
        return True
    return is_odd(n - 1)

def is_odd(n):
    if n == 0:
        return False
    return is_even(n - 1)

print(is_even(7), is_odd(7), is_even(10))
`,
          question: "is_even and is_odd call each other. What does this print?",
          expectedOutput: "False True True",
          hint: "is_even(7) → is_odd(6) → is_even(5) → ... alternates until one of them reaches 0.",
          successMessage: "Seven calls alternate between the two functions until n = 0. Correct, but O(n) time and stack depth for something n % 2 does in O(1).",
        },
      },
      {
        id: "a-al-tail-recursion",
        title: "Tail recursion: reversing a string",
        explain:
          "A recursive call is a TAIL CALL if it is the very last thing the function does, so its result is returned unchanged. n * factorial(n − 1) is NOT a tail call (the multiplication happens after it returns); passing an ACCUMULATOR fixes that: fact(n, acc) returns fact(n − 1, acc × n). A tail-recursive function needs no waiting frames, so it can be converted mechanically into a loop, and languages such as Scheme do this automatically (tail-call optimisation), using O(1) stack. Python deliberately does NOT optimise tail calls, so in Python a tail-recursive function still uses O(n) stack.",
        codeChallenge: {
          task: "Write reverse_string(s) RECURSIVELY: the reverse of an empty string is \"\"; otherwise it is reverse_string(s[1:]) + s[0]. Use no loop, no slicing with [::-1] and no reversed().",
          starter: "def reverse_string(s):\n    pass\n",
          sample: "reverse_string(\"lagos\") → \"sogal\"",
          tests: [
            {
              check: py`assert reverse_string("lagos") == "sogal", "Got " + repr(reverse_string("lagos"))
assert reverse_string("") == "" and reverse_string("a") == "a", "Empty and one-character strings."
assert reverse_string("racecar") == "racecar", "A palindrome reads the same reversed."
assert reverse_string("ab cd") == "dc ba", "Spaces are characters too."
assert "[::-1]" not in source.replace(" ", "") and not calls("reversed"), "Reverse it with recursion."` + recursive("reverse_string"),
            },
          ],
          solution: "def reverse_string(s):\n    if s == \"\":\n        return \"\"\n    return reverse_string(s[1:]) + s[0]\n",
          hint: "Base case: s == \"\" returns \"\". Recursive case: reverse the rest, s[1:], then add the first character at the end.",
          successMessage: "Correct, but each s[1:] copies the string: n calls × O(n) copying = O(n²) time. Lesson 48 analyses traps like this.",
        },
      },
      {
        id: "a-al-recursion-vs-iteration",
        title: "Recursion versus iteration",
        explain:
          "Any recursive algorithm can be written iteratively (with an explicit stack if necessary), and vice versa. RECURSION is clearer for naturally recursive problems (tree traversal, divide and conquer, backtracking) and often easier to prove correct by induction. ITERATION avoids the overhead of function calls and the memory of the call stack, and cannot overflow it. Naive recursion can also repeat work catastrophically: recursive Fibonacci recomputes the same values exponentially many times, while a loop computes each value once.",
        table: {
          caption: "Recursion and iteration compared.",
          headers: ["", "Recursion", "Iteration"],
          rows: [
            ["Clarity", "Matches recursive definitions and structures", "Matches step-by-step processes"],
            ["Memory", "O(depth) stack frames", "O(1) for a simple loop"],
            ["Risk", "Stack overflow (RecursionError in Python)", "Infinite loop if the condition is wrong"],
            ["Speed", "Function-call overhead per step", "Usually faster by a constant factor"],
            ["Best for", "Trees, divide and conquer, backtracking", "Linear processes, accumulations"],
          ],
        },
        codeChallenge: {
          task: "Write fib_iter(n) that returns the n-th Fibonacci number (fib(0) = 0, fib(1) = 1, fib(n) = fib(n − 1) + fib(n − 2)) ITERATIVELY, keeping only the last two values. It must handle n = 90 instantly, which naive recursion never could.",
          starter: "def fib_iter(n):\n    pass\n",
          sample: "fib_iter(10) → 55",
          tests: [
            {
              check: py`assert [fib_iter(i) for i in range(10)] == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "The first ten Fibonacci numbers. Got " + repr([fib_iter(i) for i in range(10)])
assert fib_iter(90) == 2880067194370816120, "fib(90) must be exact and instant."
assert uses("For") or uses("While"), "Use a loop: this exercise is the iterative version."`,
            },
          ],
          solution: "def fib_iter(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n",
          hint: "a, b = 0, 1. Repeat n times: a, b = b, a + b. Return a.",
          successMessage: "90 additions, O(n) time and O(1) space. Naive recursion would make about 4.6 × 10¹⁸ calls for fib(90).",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 11.10 – 11.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l47-recurrences",
    moduleId: "al-m11-recursion",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.10", "11.11", "11.12"],
    title: "Recursion Trees and Recurrence Relations",
    subtitle: "Writing T(n) for recursive code, and solving it",
    estimatedMinutes: 34,
    intro:
      "Loops are analysed by counting iterations. Recursive functions are analysed by writing a recurrence, an equation for T(n) in terms of T of smaller inputs, and solving it. A recursion tree makes the solution visible.",

    atoms: [
      {
        id: "a-al-recursion-trees",
        title: "Recursive tree analysis",
        explain:
          "A RECURSION TREE draws every call as a node, with its children being the calls it makes, and labels each node with the NON-RECURSIVE work it does. The total running time is the sum over all nodes, usually computed level by level. For merge sort, T(n) = 2T(n/2) + n: level 0 does n work, level 1 has two calls of n/2 (n in total), level 2 has four calls of n/4 (n again), and there are log₂ n levels, so T(n) = n log₂ n. For T(n) = T(n − 1) + n, the tree is a single chain doing n + (n − 1) + ... + 1 = n(n + 1)/2 work: Θ(n²).",
        table: {
          caption: "Recursion tree for T(n) = 2T(n/2) + n (merge sort).",
          headers: ["Level", "Number of calls", "Size of each", "Work per call", "Work at this level"],
          rows: [
            ["0", "1", "n", "n", "n"],
            ["1", "2", "n/2", "n/2", "n"],
            ["2", "4", "n/4", "n/4", "n"],
            ["k", "2ᵏ", "n/2ᵏ", "n/2ᵏ", "n"],
            ["log₂ n", "n", "1", "1", "n"],
            ["Total", "", "", "", "n(log₂ n + 1) = Θ(n log n)"],
          ],
        },
      },
      {
        id: "a-al-recurrence-relations",
        title: "Recurrence relations",
        explain:
          "To write the recurrence for a recursive function, count: how many recursive calls it makes, on inputs of what size, and how much work it does besides the calls. Then add a base case. factorial: one call on n − 1 plus constant work: T(n) = T(n − 1) + c. Recursive binary search: one call on n/2: T(n) = T(n/2) + c. Merge sort: two calls on n/2 plus linear merging: T(n) = 2T(n/2) + cn. Naive Fibonacci: T(n) = T(n − 1) + T(n − 2) + c. Tower of Hanoi: two calls on n − 1 plus one move: T(n) = 2T(n − 1) + 1, with T(1) = 1.",
        decision: {
          scenario: "def count(items):\n    if len(items) <= 1:\n        return len(items)\n    mid = len(items) // 2\n    return count(items[:mid]) + count(items[mid:])",
          question: "Including the cost of the slices, which recurrence describes count on n items?",
          options: [
            { id: "a", text: "T(n) = T(n/2) + c", whyWrong: "There are two recursive calls, not one." },
            {
              id: "b",
              text: "T(n) = 2T(n/2) + cn",
              why: "Two calls on halves, plus O(n) to copy the two slices. Like merge sort, it solves to Θ(n log n).",
            },
            { id: "c", text: "T(n) = 2T(n − 1) + c", whyWrong: "The input halves; it does not shrink by one." },
            { id: "d", text: "T(n) = T(n − 1) + n", whyWrong: "That is one call on n − 1." },
          ],
          correct: "b",
          aftermath: "Without the slicing (passing indexes) it would be T(n) = 2T(n/2) + c, which is Θ(n). Hidden copying changes the recurrence.",
        },
      },
      {
        id: "a-al-solving-recurrences",
        title: "Solving recurrence relations: the Tower of Hanoi",
        explain:
          "The ITERATION (or substitution) method expands the recurrence until a pattern appears. T(n) = T(n − 1) + c = T(n − 2) + 2c = ... = T(1) + (n − 1)c, so Θ(n). For the Tower of Hanoi, T(n) = 2T(n − 1) + 1 = 4T(n − 2) + 2 + 1 = 8T(n − 3) + 4 + 2 + 1 = ... = 2ⁿ⁻¹T(1) + 2ⁿ⁻² + ... + 1 = 2ⁿ − 1. Then PROVE the guess by induction: T(1) = 1 = 2¹ − 1, and if T(n − 1) = 2ⁿ⁻¹ − 1 then T(n) = 2(2ⁿ⁻¹ − 1) + 1 = 2ⁿ − 1. Hanoi's recursive solution: move n − 1 discs to the spare peg, move the largest disc to the target, move the n − 1 discs onto it.",
        codeChallenge: {
          task: "Solve the Tower of Hanoi. hanoi(n, source, target, spare) returns the list of moves, each a tuple (from_peg, to_peg), that moves n discs from source to target: move n − 1 discs from source to spare, move one disc from source to target, then move the n − 1 discs from spare to target. hanoi(0, ...) returns [].",
          starter: "def hanoi(n, source, target, spare):\n    pass\n",
          sample: "hanoi(2, \"A\", \"C\", \"B\") → [(\"A\", \"B\"), (\"A\", \"C\"), (\"B\", \"C\")]",
          tests: [
            {
              check: py`assert hanoi(2, "A", "C", "B") == [("A", "B"), ("A", "C"), ("B", "C")], "Got " + repr(hanoi(2, "A", "C", "B"))
assert hanoi(0, "A", "C", "B") == [] and hanoi(1, "A", "C", "B") == [("A", "C")], "Base cases."
for n in range(1, 11):
    assert len(hanoi(n, "A", "C", "B")) == 2 ** n - 1, f"{n} discs need 2^{n} - 1 = {2 ** n - 1} moves."
pegs = {"A": list(range(8, 0, -1)), "B": [], "C": []}
for a, b in hanoi(8, "A", "C", "B"):
    disc = pegs[a].pop()
    assert not pegs[b] or pegs[b][-1] > disc, "Illegal move: a larger disc was placed on a smaller one."
    pegs[b].append(disc)
assert pegs["C"] == list(range(8, 0, -1)), "All 8 discs must end on peg C, largest at the bottom."`,
            },
          ],
          solution: "def hanoi(n, source, target, spare):\n    if n == 0:\n        return []\n    return (hanoi(n - 1, source, spare, target)\n            + [(source, target)]\n            + hanoi(n - 1, spare, target, source))\n",
          hint: "Base case n == 0 returns []. Otherwise: hanoi(n - 1, source, spare, target) + [(source, target)] + hanoi(n - 1, spare, target, source).",
          successMessage: "Exactly 2ⁿ − 1 moves, every one legal: the recurrence and its solution, confirmed. 64 discs would need about 1.8 × 10¹⁹ moves.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 11.13 – 11.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l48-recursion-depth-complexity",
    moduleId: "al-m11-recursion",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.13", "11.14"],
    title: "Recursion Depth and Analysing Recursive Algorithms",
    subtitle: "Stack overflow, and the time and space of every exercise",
    estimatedMinutes: 30,
    intro:
      "A recursive algorithm has two costs to analyse: its total work (from the recurrence) and its depth (its memory, and its risk of overflowing the stack). This lesson analyses every recursive exercise in the module on both.",

    atoms: [
      {
        id: "a-al-recursion-depth",
        title: "Recursion depth and stack overflow",
        explain:
          "Every active call occupies stack memory, and the stack is limited. Too deep a recursion causes a STACK OVERFLOW: in C it crashes the program; Python protects itself with a recursion limit (about 1,000 by default, see sys.getrecursionlimit()) and raises RecursionError. Linear recursion (one call on n − 1) reaches depth n, so it fails for long lists; halving recursion (one or two calls on n/2) reaches only depth log₂ n, about 20 for a million items. Fixes: rewrite linear recursion as a loop, or restructure it to halve the problem. Raising the limit with sys.setrecursionlimit only moves the crash.",
        codeExercise: {
          language: PY,
          code: py`def depth(n):
    if n == 0:
        return 0
    return 1 + depth(n - 1)

print(depth(500))
try:
    depth(100000)
except RecursionError:
    print("RecursionError")
`,
          question: "depth(n) recurses n levels deep. What does this print?",
          expectedOutput: "500\nRecursionError",
          hint: "500 levels is within Python's limit; 100,000 is far beyond it.",
          successMessage: "The algorithm is correct for every n, but the implementation fails beyond about 1,000. Depth is a real constraint, not a theoretical one.",
        },
      },
      {
        id: "a-al-analysing-recursive",
        title: "Analysing recursive algorithm complexity",
        explain:
          "TIME: solve the recurrence, or count (number of calls) × (work per call). SPACE: the maximum depth × the space per frame, plus any data each call creates. Watch for hidden costs: slicing (items[1:]) copies O(n) per call, turning an O(n) recursion into O(n²); string concatenation does the same. The table analyses every recursive exercise in the curriculum.",
        table: {
          caption: "The module's recursive algorithms, analysed.",
          headers: ["Algorithm", "Recurrence", "Time", "Stack depth (space)"],
          rows: [
            ["Factorial", "T(n) = T(n − 1) + c", "O(n)", "O(n)"],
            ["Naive Fibonacci", "T(n) = T(n − 1) + T(n − 2) + c", "O(φⁿ) ≈ O(1.618ⁿ)", "O(n)"],
            ["Sum of array (index version)", "T(n) = T(n − 1) + c", "O(n)", "O(n)"],
            ["Sum of array (slicing items[1:])", "T(n) = T(n − 1) + cn", "O(n²)", "O(n), plus the slices"],
            ["Reverse a string (s[1:] + s[0])", "T(n) = T(n − 1) + cn", "O(n²)", "O(n)"],
            ["Recursive binary search", "T(n) = T(n/2) + c", "O(log n)", "O(log n)"],
            ["Tower of Hanoi", "T(n) = 2T(n − 1) + 1", "O(2ⁿ)", "O(n)"],
          ],
        },
        decision: {
          scenario: "Naive recursive Fibonacci fib(40) makes about 330 million calls, yet never has more than 40 frames on the stack at once.",
          question: "What are its time and space complexity?",
          options: [
            { id: "a", text: "Time O(2ⁿ) (more precisely about φⁿ), space O(n)", why: "Time counts all calls; space counts only the deepest chain of active calls, which is n." },
            { id: "b", text: "Time O(n), space O(n)", whyWrong: "That would be the memoized version (Module 14)." },
            { id: "c", text: "Time O(2ⁿ), space O(2ⁿ)", whyWrong: "Finished calls free their frames; only one path of the tree is on the stack at a time." },
            { id: "d", text: "Time O(n²), space O(1)", whyWrong: "The call tree branches twice per call, and every active call holds a frame." },
          ],
          correct: "a",
          aftermath: "Exponential time with linear space is the signature of a recursion that repeats work. Dynamic programming removes the repetition.",
        },
      },
      {
        id: "a-al-halving-recursion",
        title: "Reducing depth by halving",
        explain:
          "A linear recursion such as \"the maximum of a list is the larger of its first item and the maximum of the rest\" is n calls deep and fails on long lists. Splitting into two HALVES instead, max(left half) versus max(right half), still makes about 2n calls in total (T(n) = 2T(n/2) + c = Θ(n)), but its depth is only log₂ n. Pass indexes rather than slices, so that no call copies the list. This restructuring is the heart of divide and conquer, the subject of Module 12.",
        codeChallenge: {
          task: "Write max_rec(items, lo=0, hi=None) that returns the largest item of items[lo..hi] RECURSIVELY by halves: if hi is None set it to len(items) - 1; if lo == hi return items[lo]; otherwise split at mid = (lo + hi) // 2 and return the larger of the two halves' maxima. Use no loop, no max() and no slicing. The test uses 10,000 items, far beyond a linear recursion's limit.",
          starter: "def max_rec(items, lo=0, hi=None):\n    pass\n",
          sample: "max_rec([3, 9, 2, 7]) → 9",
          tests: [
            {
              check: py`assert max_rec([3, 9, 2, 7]) == 9, "Got " + repr(max_rec([3, 9, 2, 7]))
assert max_rec([5]) == 5 and max_rec([-4, -1, -8]) == -1, "One item, and negatives."
import random
random.seed(71)
big = [random.randint(-10**6, 10**6) for _ in range(10000)]
best = big[0]
for x in big:
    if x > best:
        best = x
assert max_rec(big) == best, "10,000 items: halving keeps the depth near 14."
assert not calls("max") and "[:" not in source and ":]" not in source, "No max() and no slicing: split with indexes."` + recursive("max_rec"),
            },
          ],
          solution: "def max_rec(items, lo=0, hi=None):\n    if hi is None:\n        hi = len(items) - 1\n    if lo == hi:\n        return items[lo]\n    mid = (lo + hi) // 2\n    left = max_rec(items, lo, mid)\n    right = max_rec(items, mid + 1, hi)\n    return left if left >= right else right\n",
          hint: "Base case lo == hi. Otherwise left = max_rec(items, lo, mid), right = max_rec(items, mid + 1, hi), and return the larger one.",
          successMessage: "About 20,000 calls but only 14 deep. Same Θ(n) time as a loop; depth log n instead of n.",
        },
      },
    ],

    task: {
      title: "Module 11 practice: the six classic recursions",
      intro: "Write each recursively, state its recurrence, solve it, and give its stack depth.",
      prompts: [
        "Factorial calculation, recursively and with a tail-recursive accumulator. Why does Python not benefit from the second form?",
        "The Fibonacci sequence: count the calls naive recursion makes for n = 10, 20 and 30, and explain the growth.",
        "Sum of array elements: write the slicing version and the index version and time both on 900 items.",
        "Reverse a string recursively, then rewrite it so that it runs in O(n) time.",
        "Binary search using recursion, and its recurrence T(n) = T(n/2) + c solved by iteration.",
        "Tower of Hanoi: prove by induction that n discs need exactly 2ⁿ − 1 moves, and print the moves for 3 discs.",
      ],
      closing: "Module 12 makes \"split it in half\" a design technique, and gives a single theorem that solves most of its recurrences.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
