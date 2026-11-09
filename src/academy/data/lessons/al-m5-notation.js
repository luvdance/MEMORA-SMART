/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 5 · BIG O, BIG OMEGA, BIG THETA
 *
 * Curriculum 5.1 – 5.12. Asymptotic notation from the definitions: O, Ω, Θ,
 * o and ω; the limit interpretation; dominant terms and constants; comparing
 * functions; and proofs with explicit witnesses c and n₀. The curriculum's
 * three exercises (5n² + 3n + 10, 8n + 100, n³ + 20n² + 50) are proved here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s5-notation";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 5.1 – 5.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l18-big-o",
    moduleId: "al-m5-notation",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2"],
    title: "Asymptotic Notation and Big O",
    subtitle: "Upper bounds, made precise",
    estimatedMinutes: 26,
    intro:
      "\"Grows like n²\" is an intuition. Big O is its mathematical definition, the one examiners ask you to apply: find constants c and n₀ that make an inequality true for every large n.",

    atoms: [
      {
        id: "a-al-asymptotic-intro",
        title: "Introduction to asymptotic notation",
        explain:
          "ASYMPTOTIC analysis describes how a function behaves as n grows without limit (n → ∞). For small n, constants dominate: 100n is larger than n² until n = 100. Beyond that point n² is larger forever, and the gap widens. Asymptotic notation captures exactly this: it classifies functions by their eventual growth rate and ignores both constant factors and small inputs. Five notations do this: O (upper bound), Ω (lower bound), Θ (tight bound), and the strict versions o and ω.",
        charts: [
          {
            type: "line",
            title: "100n against n²: n² overtakes at n = 100 and never looks back",
            categories: ["0", "25", "50", "75", "100", "125", "150", "175", "200"],
            series: [
              { name: "100n", values: [0, 2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000] },
              { name: "n²", values: [0, 625, 2500, 5625, 10000, 15625, 22500, 30625, 40000] },
            ],
            caption: "At n = 1,000 the quadratic is already 10 times larger; at n = 10,000 it is 100 times larger. Constant factors delay the crossover; they never prevent it.",
          },
        ],
      },
      {
        id: "a-al-big-o-definition",
        title: "Big O: the formal definition of an upper bound",
        explain:
          "f(n) = O(g(n)) means there exist constants c > 0 and n₀ ≥ 1 such that 0 ≤ f(n) ≤ c · g(n) for ALL n ≥ n₀. In words: beyond some point, f never exceeds a constant multiple of g. The pair (c, n₀) is called a WITNESS. Example: 3n + 2 = O(n), witness c = 4, n₀ = 2, because 3n + 2 ≤ 4n exactly when n ≥ 2. Many witnesses work (c = 5, n₀ = 1 also does); you need only one. A numerical check on a range of n can find or refute a candidate witness, but only an algebraic argument covers every n.",
        codeChallenge: {
          task: "Write holds(f, g, c, n0, up_to) that returns True if f(n) <= c * g(n) for every whole n from n0 to up_to inclusive, and False otherwise. f and g are functions of n. (This checks a proposed Big O witness on a finite range.)",
          starter: "def holds(f, g, c, n0, up_to):\n    pass\n",
          sample: "holds(lambda n: 3*n + 2, lambda n: n, 4, 2, 1000) → True\nholds(lambda n: 3*n + 2, lambda n: n, 4, 1, 1000) → False",
          tests: [
            {
              check: py`f = lambda n: 3 * n + 2
g = lambda n: n
assert holds(f, g, 4, 2, 1000) is True, "3n + 2 <= 4n for all n >= 2: should be True."
assert holds(f, g, 4, 1, 1000) is False, "At n = 1, 3n + 2 = 5 > 4: should be False."
assert holds(f, g, 5, 1, 1000) is True, "c = 5, n0 = 1 is another valid witness."
sq = lambda n: n * n
assert holds(sq, g, 1000, 1, 999) is True and holds(sq, g, 1000, 1, 2000) is False, "n² <= 1000n only up to n = 1000: no constant works forever."
assert holds(f, g, 4, 5, 5) is True, "A range with a single n."`,
            },
          ],
          solution: "def holds(f, g, c, n0, up_to):\n    for n in range(n0, up_to + 1):\n        if f(n) > c * g(n):\n            return False\n    return True\n",
          hint: "Loop n from n0 to up_to inclusive; return False on the first n where f(n) > c * g(n); otherwise True.",
          successMessage: "The n² test shows why n² is not O(n): every c fails once n passes c. A finite check suggests; the algebra in Lesson 21 proves.",
        },
      },
      {
        id: "a-al-why-big-o",
        title: "Growth rates, and why Big O is commonly used",
        explain:
          "Big O is an UPPER bound, so it is true but possibly loose: n = O(n), and also n = O(n²) and n = O(2ⁿ). By convention we state the TIGHTEST simple bound we can prove. Big O dominates in practice because it describes the worst case as a guarantee (\"this will never take more than about n² steps\"), it is easy to derive from code (nested loops, halving loops), and it hides machine-dependent constants. When people say \"quicksort is O(n log n)\" they usually mean its average case; its worst case is O(n²). Always say which case you mean.",
        decision: {
          scenario: "Linear search does at most n comparisons. A student writes: \"Linear search is O(n²).\"",
          question: "Is the student right?",
          options: [
            {
              id: "a",
              text: "Technically true, because n ≤ n² for n ≥ 1, but useless: the tight and expected answer is O(n)",
              why: "Big O is only an upper bound, so a looser bound is not false. But it hides the real growth, and an examiner expects the tightest bound, O(n), or better Θ(n).",
            },
            { id: "b", text: "Wrong, because Big O must be exact", whyWrong: "Big O is an upper bound, not an exact rate. Θ is the notation for an exact (tight) rate." },
            { id: "c", text: "Right, and it is the best answer", whyWrong: "O(n) is tighter and therefore more informative." },
            { id: "d", text: "Wrong, because linear search is O(log n)", whyWrong: "Linear search can need n comparisons, so it is not O(log n)." },
          ],
          correct: "a",
          aftermath: "This is why Θ exists. Lesson 19 introduces it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 5.3 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l19-omega-theta",
    moduleId: "al-m5-notation",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.3", "5.4", "5.5", "5.6"],
    title: "Big Omega, Big Theta, Little o and Little Omega",
    subtitle: "Lower bounds, tight bounds and strict bounds",
    estimatedMinutes: 28,
    intro:
      "Big O says \"no faster than\". Big Omega says \"no slower than\". Big Theta says both, and is what \"grows like\" really means. The little versions are strict: \"much slower than\" and \"much faster than\".",

    atoms: [
      {
        id: "a-al-big-omega",
        title: "Big Omega: lower bounds and minimum growth",
        explain:
          "f(n) = Ω(g(n)) means there exist c > 0 and n₀ such that f(n) ≥ c · g(n) ≥ 0 for all n ≥ n₀: beyond some point, f is at least a constant multiple of g. It is a LOWER bound. Example: 3n + 2 = Ω(n) with c = 3, n₀ = 1, since 3n + 2 ≥ 3n always. Lower bounds are also used for PROBLEMS, not just algorithms: any algorithm that finds the maximum of n unsorted numbers must look at every number, so the problem is Ω(n); every comparison-based sorting algorithm needs Ω(n log n) comparisons in the worst case (proved in Module 10).",
        decision: {
          scenario: "Someone claims to have an algorithm that finds the largest of n unsorted numbers in O(log n) time, using only comparisons.",
          question: "What does a lower-bound argument say about this claim?",
          options: [
            {
              id: "a",
              text: "It is impossible: any correct algorithm must examine all n numbers, because an unexamined one could be the largest, so the problem is Ω(n)",
              why: "A lower bound on the problem rules out every algorithm that does less work, however clever.",
            },
            { id: "b", text: "It is possible with binary search", whyWrong: "Binary search needs sorted input. On unsorted data the maximum could be anywhere." },
            { id: "c", text: "It is possible on a fast enough computer", whyWrong: "Lower bounds count operations; hardware cannot remove required operations." },
            { id: "d", text: "Lower bounds only apply to sorting", whyWrong: "They apply to any problem whose solution requires a minimum amount of work." },
          ],
          correct: "a",
          aftermath: "Single-pass maximum does n − 1 comparisons: it matches the lower bound, so it is optimal.",
        },
      },
      {
        id: "a-al-big-theta",
        title: "Big Theta: tight asymptotic bounds",
        explain:
          "f(n) = Θ(g(n)) means f is both O(g) and Ω(g): there exist c₁, c₂ > 0 and n₀ with c₁ · g(n) ≤ f(n) ≤ c₂ · g(n) for all n ≥ n₀. f is sandwiched between two multiples of g, so it grows at exactly the rate of g. Example: 3n² + 5n = Θ(n²): the lower side 3n² ≤ 3n² + 5n holds for all n ≥ 1; the upper side 3n² + 5n ≤ 4n² holds when 5n ≤ n², that is n ≥ 5. So c₁ = 3, c₂ = 4, n₀ = 5. Θ is the most informative statement, and the one to give when you can prove both sides.",
        codeExercise: {
          language: PY,
          code: py`def f(n):
    return 3 * n * n + 5 * n

n = 1
while f(n) > 4 * n * n:
    n += 1
print(n)
`,
          question: "This finds the first n where the upper side of the sandwich, 3n² + 5n ≤ 4n², becomes true. What does it print?",
          expectedOutput: "5",
          hint: "3n² + 5n ≤ 4n² is the same as 5n ≤ n², that is 5 ≤ n.",
          successMessage: "n₀ = 5, as the algebra predicted. From n = 5 on, 3n² ≤ f(n) ≤ 4n², so f(n) = Θ(n²).",
        },
      },
      {
        id: "a-al-little-o-omega",
        title: "Little o and little omega",
        explain:
          "The little notations are STRICT. f(n) = o(g(n)) means that for EVERY c > 0 there is an n₀ with f(n) < c · g(n) for all n ≥ n₀; equivalently f(n)/g(n) → 0. f grows strictly slower than g: n = o(n²), log n = o(n), but 2n² is NOT o(n²), because the ratio tends to 2, not 0. f(n) = ω(g(n)) means f(n)/g(n) → ∞: f grows strictly faster, so n² = ω(n) but n² is not ω(n²). The analogy with numbers helps: O is like ≤, Ω like ≥, Θ like =, o like <, ω like >.",
        table: {
          caption: "The five notations, with the analogy and the limit test (when the limit of f(n)/g(n) exists).",
          headers: ["Notation", "Meaning", "Like", "lim f(n)/g(n)", "Example"],
          rows: [
            ["f = O(g)", "Upper bound", "f ≤ g", "finite (0 allowed)", "3n + 2 = O(n); n = O(n²)"],
            ["f = Ω(g)", "Lower bound", "f ≥ g", "> 0 (∞ allowed)", "n² = Ω(n)"],
            ["f = Θ(g)", "Tight bound", "f = g", "finite and > 0", "3n² + 5n = Θ(n²)"],
            ["f = o(g)", "Strictly slower", "f < g", "0", "n log n = o(n²)"],
            ["f = ω(g)", "Strictly faster", "f > g", "∞", "2ⁿ = ω(n¹⁰⁰)"],
          ],
        },
        codeExercise: {
          language: PY,
          code: py`import math

for n in [10, 1000, 100000]:
    ratio = (n * math.log2(n)) / (n * n)
    print(n, round(ratio, 4))
`,
          question: "To test whether n log₂ n = o(n²), this prints the ratio f(n)/g(n). What does it print?",
          expectedOutput: "10 0.3322\n1000 0.01\n100000 0.0002",
          hint: "The ratio simplifies to log₂ n / n. log₂ 10 ≈ 3.32, log₂ 1000 ≈ 9.97, log₂ 100000 ≈ 16.6.",
          successMessage: "The ratio log₂ n / n heads to 0, so n log n = o(n²): strictly slower growth, which is why n log n sorts beat n² sorts.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 5.7 – 5.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l20-simplifying",
    moduleId: "al-m5-notation",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.7", "5.8", "5.9", "5.10"],
    title: "Dominant Terms, Constants and Simplification",
    subtitle: "Why 5n² + 3n + 10 is simply Θ(n²)",
    estimatedMinutes: 26,
    intro:
      "Every exact operation count simplifies to a single dominant term. This lesson shows why that simplification is mathematically justified, not just a convention, and how to do it for any polynomial.",

    atoms: [
      {
        id: "a-al-mathematical-interpretation",
        title: "The mathematical interpretation of complexity",
        explain:
          "Strictly, O(g(n)) is a SET: all functions that are eventually bounded above by a constant multiple of g. Writing f(n) = O(g(n)) means f ∈ O(g), so the \"=\" is one-way: n = O(n²) is true, but O(n²) = n is meaningless. The LIMIT TEST is often the quickest way to classify: if f(n)/g(n) tends to a finite constant L > 0, then f = Θ(g); if it tends to 0, then f = o(g) (so O(g) but not Ω(g)); if it tends to ∞, then f = ω(g). For example (5n² + 3n + 10)/n² = 5 + 3/n + 10/n² → 5, so 5n² + 3n + 10 = Θ(n²).",
        decision: {
          scenario: "f(n) = 8n + 100 and g(n) = n². The ratio f(n)/g(n) = 8/n + 100/n² tends to 0 as n grows.",
          question: "What can you conclude?",
          options: [
            { id: "a", text: "f = Θ(n²)", whyWrong: "Θ needs a positive finite limit. A limit of 0 means f grows strictly slower." },
            { id: "b", text: "f = o(n²), so f = O(n²) but f is not Ω(n²)", why: "A zero limit means strictly slower growth. f is in fact Θ(n), since (8n + 100)/n → 8." },
            { id: "c", text: "f = ω(n²)", whyWrong: "ω needs the ratio to tend to infinity." },
            { id: "d", text: "Nothing: limits cannot classify functions", whyWrong: "The limit test classifies any pair whose ratio has a limit." },
          ],
          correct: "b",
          aftermath: "Compare with the right g: (8n + 100)/n → 8, a positive constant, so 8n + 100 = Θ(n).",
        },
      },
      {
        id: "a-al-dominant-terms",
        title: "Identifying dominant terms",
        explain:
          "In a sum of terms, the DOMINANT term is the one that grows fastest; as n grows it accounts for almost all of the total. The standard order, from slowest to fastest: constant < log n < √n < n < n log n < n² < n³ < 2ⁿ < n!. In 5n² + 3n + 10, the 5n² term is 93% of the total at n = 10 and over 99.9% at n = 1,000: the 3n and 10 become irrelevant. That is the mathematical justification for keeping only the dominant term.",
        code: {
          language: PY,
          code: py`for n in [10, 100, 1000, 10000]:
    total = 5 * n * n + 3 * n + 10
    share = 100 * (5 * n * n) / total
    print(n, round(share, 2), "%")
`,
          expectedOutput: "10 92.59 %\n100 99.38 %\n1000 99.94 %\n10000 99.99 %",
        },
        why: "The share of the n² term heads to 100%, so the other terms cannot affect the growth rate: T(n) = Θ(n²).",
      },
      {
        id: "a-al-removing-constants",
        title: "Removing constants and simplifying polynomials",
        explain:
          "Constant COEFFICIENTS are dropped because they depend on the machine, the language and how operations are counted, and because they never change a growth class: 5n² and n² are both Θ(n²). The rule for any polynomial aₖnᵏ + ... + a₁n + a₀ with aₖ > 0 is that it is Θ(nᵏ): keep the highest power, drop its coefficient, drop everything else. So 5n² + 3n + 10 = Θ(n²), 8n + 100 = Θ(n), and n³ + 20n² + 50 = Θ(n³). Constants still matter in PRACTICE for small n: an algorithm doing 2n² steps can beat one doing 100 n log n steps until n is in the hundreds, which is why real sorting libraries switch to insertion sort for short runs.",
        codeChallenge: {
          task: "Write simplify(coeffs) where coeffs lists a polynomial's coefficients by power: coeffs[0] is the constant, coeffs[1] the coefficient of n, and so on. Return \"O(1)\" if only the constant is nonzero, \"O(n)\" for highest power 1, and \"O(n^k)\" for highest power k ≥ 2. Ignore trailing zero coefficients.",
          starter: "def simplify(coeffs):\n    pass\n",
          sample: "simplify([10, 3, 5]) → \"O(n^2)\"   (5n² + 3n + 10)\nsimplify([100, 8]) → \"O(n)\"      (8n + 100)",
          tests: [
            {
              check: py`assert simplify([10, 3, 5]) == "O(n^2)", "5n² + 3n + 10 is O(n^2). Got " + repr(simplify([10, 3, 5]))
assert simplify([100, 8]) == "O(n)", "8n + 100 is O(n)."
assert simplify([50, 0, 20, 1]) == "O(n^3)", "n³ + 20n² + 50 is O(n^3)."
assert simplify([7]) == "O(1)", "A constant is O(1)."
assert simplify([10, 3, 0, 0]) == "O(n)", "Trailing zero coefficients do not count: 3n + 10 is O(n)."
assert simplify([0, 0, 0, 0, 0, 2]) == "O(n^5)", "2n⁵ is O(n^5)."`,
            },
          ],
          solution: "def simplify(coeffs):\n    k = len(coeffs) - 1\n    while k > 0 and coeffs[k] == 0:\n        k -= 1\n    if k == 0:\n        return \"O(1)\"\n    if k == 1:\n        return \"O(n)\"\n    return \"O(n^\" + str(k) + \")\"\n",
          hint: "Find the highest index with a nonzero coefficient (scan down from the end). That index is the power.",
          successMessage: "Keep the highest power, drop the rest. You have just solved the module's three curriculum exercises by rule; Lesson 21 proves them.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 5.11 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l21-proving-bounds",
    moduleId: "al-m5-notation",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.11", "5.12"],
    title: "Comparing Functions and Proving Bounds",
    subtitle: "Witnesses, inequalities and proofs by contradiction",
    estimatedMinutes: 30,
    intro:
      "This is the lesson examination questions are made of: \"Prove that 5n² + 3n + 10 = Θ(n²)\" and \"Show that n² is not O(n)\". Each has a standard method, and you will use it until it is automatic.",

    atoms: [
      {
        id: "a-al-comparing-functions",
        title: "Comparing asymptotic functions",
        explain:
          "To compare two functions, use the limit test, or compare their logarithms, or rewrite them in a common form. Useful facts: every polynomial is o of every exponential (n¹⁰⁰ = o(2ⁿ)), every power of log is o of every power of n ((log n)³ = o(√n)), constant bases matter in exponents (2ⁿ = o(3ⁿ), and 4ⁿ = 2²ⁿ is not O(2ⁿ)) but constant additions do not (2ⁿ⁺¹ = 2 · 2ⁿ = Θ(2ⁿ)), and log(n!) = Θ(n log n). The crossover point can be late: n¹⁰ is larger than 2ⁿ for a surprisingly long time.",
        codeExercise: {
          language: PY,
          code: py`n = 2
while 2 ** n <= n ** 10:
    n += 1
print(n)
`,
          question: "n¹⁰ starts far larger than 2ⁿ. This finds the first n ≥ 2 where 2ⁿ finally exceeds n¹⁰. What does it print?",
          expectedOutput: "59",
          hint: "Compare logarithms: 2ⁿ > n¹⁰ exactly when n > 10 · log₂ n. At n = 58, 10 · log₂ 58 ≈ 58.6; at n = 59 it is ≈ 58.8.",
          successMessage: "59. From there 2ⁿ wins forever: n¹⁰ = o(2ⁿ). Asymptotic statements are about eventual behaviour, and \"eventually\" can be far away.",
        },
      },
      {
        id: "a-al-proving-bounds",
        title: "Proving complexity bounds from the definitions",
        explain:
          "To PROVE f(n) = O(g(n)), exhibit a witness: bound each lower-order term by a multiple of g for n ≥ n₀ and add. For 5n² + 3n + 10 with n ≥ 1: 3n ≤ 3n² and 10 ≤ 10n², so 5n² + 3n + 10 ≤ 18n², giving c = 18, n₀ = 1. For Ω: 5n² + 3n + 10 ≥ 5n² for all n ≥ 1, so c = 5. Both together prove Θ(n²). To DISPROVE f = O(g), argue by contradiction: suppose n² ≤ c · n for all n ≥ n₀; dividing by n gives n ≤ c for all n ≥ n₀, which fails at n = max(n₀, c + 1). So no witness exists and n² is not O(n).",
        table: {
          caption: "Witnesses for the curriculum's three functions (one valid choice each; others exist).",
          headers: ["T(n)", "Upper bound O", "Lower bound Ω", "Conclusion"],
          rows: [
            ["5n² + 3n + 10", "≤ 18n² for n ≥ 1 (c = 18)", "≥ 5n² for n ≥ 1 (c = 5)", "Θ(n²)"],
            ["8n + 100", "≤ 108n for n ≥ 1, or ≤ 9n for n ≥ 100", "≥ 8n for n ≥ 1", "Θ(n)"],
            ["n³ + 20n² + 50", "≤ 71n³ for n ≥ 1, or ≤ 2n³ for n ≥ 21", "≥ n³ for n ≥ 1", "Θ(n³)"],
          ],
        },
        decision: {
          scenario: "Proving 8n + 100 = O(n), a student writes: \"Take c = 9. Then 8n + 100 ≤ 9n, so it is O(n).\"",
          question: "What is missing from the proof?",
          options: [
            {
              id: "a",
              text: "The n₀: 8n + 100 ≤ 9n only holds for n ≥ 100, so the proof must state n₀ = 100 (or choose c = 108 with n₀ = 1)",
              why: "A witness is a PAIR (c, n₀), and the inequality must be shown for every n ≥ n₀. At n = 1, 108 ≤ 9 is false.",
            },
            { id: "b", text: "Nothing: any c works", whyWrong: "c = 8 never works, since 8n + 100 > 8n for all n." },
            { id: "c", text: "The proof must use limits instead", whyWrong: "The definition-based proof is valid once n₀ is stated." },
            { id: "d", text: "8n + 100 is not O(n)", whyWrong: "It is; the proof is just incomplete." },
          ],
          correct: "a",
          aftermath: "Always state both constants and check the inequality from n₀ upwards.",
        },
      },
      {
        id: "a-al-proof-practice",
        title: "Finding the smallest n₀ for a given c",
        explain:
          "For a fixed c, the smallest valid n₀ is where f(n) ≤ c · g(n) starts holding and never fails again. For polynomial inequalities you find it by algebra: 5n² + 3n + 10 ≤ 6n² rearranges to n² − 3n − 10 ≥ 0, that is (n − 5)(n + 2) ≥ 0, so n ≥ 5. A program can locate the candidate on a finite range, which is a useful check on your algebra, provided you remember that the algebra is the proof.",
        codeChallenge: {
          task: "Write find_n0(f, g, c, limit) that returns the smallest whole n0 between 1 and limit such that f(n) <= c * g(n) for EVERY n from n0 to limit, or None if the inequality fails at limit itself.",
          starter: "def find_n0(f, g, c, limit):\n    pass\n",
          sample: "find_n0(lambda n: 8*n + 100, lambda n: n, 9, 10000) → 100",
          tests: [
            {
              check: py`lin = lambda n: n
assert find_n0(lambda n: 8 * n + 100, lin, 9, 2000) == 100, "8n + 100 <= 9n from n = 100. Got " + repr(find_n0(lambda n: 8 * n + 100, lin, 9, 2000))
assert find_n0(lambda n: 8 * n + 100, lin, 108, 2000) == 1, "With c = 108 it holds from n = 1."
quad = lambda n: n * n
assert find_n0(lambda n: 5 * n * n + 3 * n + 10, quad, 6, 2000) == 5, "5n² + 3n + 10 <= 6n² from n = 5."
assert find_n0(lambda n: n ** 3 + 20 * n * n + 50, lambda n: n ** 3, 2, 2000) == 21, "n³ + 20n² + 50 <= 2n³ from n = 21."
assert find_n0(lambda n: n * n, lin, 50, 1000) is None, "n² <= 50n fails at n = 1000: return None."
wobble = lambda n: 10 if n in (3, 4) else 1
assert find_n0(wobble, lambda n: 1, 2, 100) == 5, "It must hold for EVERY n from n0 on: here it fails at 3 and 4, so n0 is 5."`,
            },
          ],
          solution: "def find_n0(f, g, c, limit):\n    n0 = None\n    n = limit\n    while n >= 1 and f(n) <= c * g(n):\n        n0 = n\n        n -= 1\n    return n0\n",
          hint: "Scan DOWNWARDS from limit while the inequality holds. The last n where it held is n0. If it fails at limit, return None.",
          successMessage: "n₀ = 100, 1, 5 and 21: exactly the witnesses in the table. Scanning down guarantees the inequality holds for every n above n₀, which is what the definition demands.",
        },
      },
    ],

    task: {
      title: "Module 5 practice: the curriculum's three proofs",
      intro: "Write each proof in full: state the claim, give the witness (c, n₀), and show the inequality for every n ≥ n₀.",
      prompts: [
        "Determine the Big O complexity of T(n) = 5n² + 3n + 10, then prove it is Θ(n²) with explicit witnesses for both sides.",
        "Determine the Big O complexity of T(n) = 8n + 100, and give two different valid witnesses.",
        "Determine the Big O complexity of T(n) = n³ + 20n² + 50, and prove it is not O(n²).",
        "Explain, using the share-of-total calculation and the limit test, why lower-order terms and constant coefficients do not determine asymptotic growth.",
        "Order these from slowest- to fastest-growing and justify each step: n log n, 2ⁿ, √n, n², log n, n!, 100, n³.",
      ],
      closing: "Module 6 tours these growth classes one by one and asks what each means for real data sizes.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
