/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 5
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l18-big-o", [
    q("alq18-1", "a-al-asymptotic-intro", 2, "100n is larger than n² for small n. Why do we still say n² grows faster?",
      ["For every n > 100, n² exceeds 100n, and the gap keeps widening", "Asymptotic analysis is about eventual behaviour as n → ∞."],
      [["Because 100n is never larger than n²", "It is larger for 1 < n < 100."],
       ["Because constants are always zero in practice", "Constants are real; they just do not change eventual growth."],
       ["Because n² has more terms", "Both have one term."]]),
    q("alq18-2", "a-al-big-o-definition", 2, "Which is the formal definition of f(n) = O(g(n))?",
      ["There exist c > 0 and n₀ such that 0 ≤ f(n) ≤ c · g(n) for all n ≥ n₀", "An upper bound by a constant multiple, from some point on."],
      [["f(n) ≤ g(n) for all n", "No constant and no threshold: too strict, and 3n + 2 would not be O(n)."],
       ["f(n) ≥ c · g(n) for all n ≥ n₀", "That is Ω."],
       ["f(n) / g(n) → 0", "That is little o."]]),
    q("alq18-3", "a-al-big-o-definition", 3, "Which witness (c, n₀) proves 3n + 2 = O(n)?",
      ["c = 4, n₀ = 2", "3n + 2 ≤ 4n exactly when n ≥ 2."],
      [["c = 3, n₀ = 1", "3n + 2 > 3n for every n."],
       ["c = 4, n₀ = 1", "At n = 1, 3n + 2 = 5 > 4."],
       ["c = 1, n₀ = 100", "3n + 2 > n for every n ≥ 1."]]),
    q("alq18-4", "a-al-why-big-o", 2, "Is the statement \"n = O(n²)\" true?",
      ["Yes, because Big O is an upper bound, but O(n) is the tighter and more useful bound", "A looser upper bound is still an upper bound."],
      [["No, Big O must be exact", "Exactness is Θ."],
       ["No, because n² is larger", "Being larger is exactly what an upper bound means."],
       ["Only for n < 1", "It holds for every n ≥ 1."]]),
  ]),

  ...check("al-l19-omega-theta", [
    q("alq19-1", "a-al-big-omega", 2, "f(n) = Ω(g(n)) means that, beyond some n₀...",
      ["f(n) is at least a constant multiple of g(n)", "Ω is a lower bound."],
      [["f(n) is at most a constant multiple of g(n)", "That is O."],
       ["f(n) equals g(n) exactly", "No notation means exact equality."],
       ["f(n) / g(n) → 0", "That is little o."]]),
    q("alq19-2", "a-al-big-theta", 3, "Which constants show 2n² + 7n = Θ(n²)?",
      ["c₁ = 2, c₂ = 3, n₀ = 7", "2n² ≤ 2n² + 7n always; 2n² + 7n ≤ 3n² when 7n ≤ n², that is n ≥ 7."],
      [["c₁ = 3, c₂ = 3, n₀ = 1", "2n² + 7n < 3n² for large n, so c₁ = 3 fails the lower side."],
       ["c₁ = 2, c₂ = 3, n₀ = 1", "At n = 1, 2 + 7 = 9 > 3."],
       ["c₁ = 1, c₂ = 2, n₀ = 1", "2n² + 7n > 2n² for every n."]]),
    q("alq19-3", "a-al-little-o-omega", 3, "Which statement is TRUE?",
      ["n = o(n log n)", "n / (n log n) = 1/log n → 0."],
      [["2n² = o(n²)", "The ratio tends to 2, not 0."],
       ["n² = ω(n²)", "The ratio is 1, not ∞."],
       ["log n = ω(n)", "log n grows slower than n."]]),
    q("alq19-4", "a-al-little-o-omega", 2, "In the analogy between notations and comparisons of numbers, which matches Θ?",
      ["=", "Θ: same growth rate, bounded above and below."],
      [["≤", "That is O."],
       ["<", "That is little o."],
       ["≥", "That is Ω."]]),
  ]),

  ...check("al-l20-simplifying", [
    q("alq20-1", "a-al-mathematical-interpretation", 3, "lim (n² + 4n) / n² = 1. What does the limit test conclude?",
      ["n² + 4n = Θ(n²)", "A positive finite limit means the same growth rate."],
      [["n² + 4n = o(n²)", "That needs a limit of 0."],
       ["n² + 4n = ω(n²)", "That needs a limit of ∞."],
       ["Nothing, because the limit is 1", "A limit of 1 is a positive finite constant."]]),
    q("alq20-2", "a-al-dominant-terms", 2, "Which is the dominant term of 3n log n + 1000n + n²/10?",
      ["n²/10", "n² outgrows n log n and n, whatever the coefficients."],
      [["1000n", "Large coefficient, but only linear growth."],
       ["3n log n", "n log n = o(n²)."],
       ["They are all equal", "They grow at different rates."]]),
    q("alq20-3", "a-al-removing-constants", 2, "What is the tight bound of T(n) = n³ + 20n² + 50?",
      ["Θ(n³)", "Highest power, coefficient dropped."],
      [["Θ(n³ + n²)", "Lower-order terms are dropped."],
       ["Θ(20n²)", "n³ dominates n², and coefficients are dropped anyway."],
       ["Θ(71)", "T(1) = 71, but growth is what is described."]]),
    q("alq20-4", "a-al-removing-constants", 3, "Algorithm A takes 2n² steps; algorithm B takes 100 n log₂ n steps. Which statement is true?",
      ["B is asymptotically faster, but A does fewer steps for small n", "Θ(n log n) beats Θ(n²) eventually; constants decide small n."],
      [["A is always faster", "For large n, 2n² far exceeds 100 n log n."],
       ["B is always faster", "At n = 10, A does 200 steps while B does about 3,322."],
       ["They are the same, because constants are dropped", "Dropping constants keeps them in different classes."]]),
  ]),

  ...check("al-l21-proving-bounds", [
    q("alq21-1", "a-al-comparing-functions", 3, "Which statement is FALSE?",
      ["4ⁿ = O(2ⁿ)", "4ⁿ = (2ⁿ)², and 4ⁿ/2ⁿ = 2ⁿ → ∞, so no constant bounds it."],
      [["2ⁿ⁺¹ = Θ(2ⁿ)", "True: 2ⁿ⁺¹ = 2 · 2ⁿ."],
       ["n¹⁰⁰ = o(2ⁿ)", "True: every polynomial is o of every exponential with base > 1."],
       ["(log n)² = o(n)", "True: powers of log grow slower than any power of n."]]),
    q("alq21-2", "a-al-proving-bounds", 3, "To prove 5n² + 3n + 10 ≤ c · n² for all n ≥ 1, which c works?",
      ["18", "For n ≥ 1, 3n ≤ 3n² and 10 ≤ 10n², so the sum is ≤ 18n²."],
      [["5", "5n² + 3n + 10 > 5n² for every n."],
       ["6", "At n = 1, 18 > 6."],
       ["8", "At n = 1, 18 > 8."]]),
    q("alq21-3", "a-al-proving-bounds", 3, "How is \"n² is not O(n)\" proved?",
      ["Assume n² ≤ cn for all n ≥ n₀; then n ≤ c for all n ≥ n₀, which fails for n > c", "A contradiction shows no witness can exist."],
      [["By checking n = 1 to 100 on a computer", "A finite check cannot prove a statement about all n."],
       ["By showing n² > n at n = 2", "One value does not rule out a constant c."],
       ["It cannot be proved", "The contradiction argument proves it."]]),
    q("alq21-4", "a-al-proof-practice", 3, "For c = 6, what is the smallest n₀ such that 5n² + 3n + 10 ≤ 6n² for all n ≥ n₀?",
      ["5", "n² − 3n − 10 = (n − 5)(n + 2) ≥ 0 for n ≥ 5."],
      [["1", "At n = 1: 18 > 6."],
       ["4", "At n = 4: 102 > 96."],
       ["10", "It already holds from n = 5."]]),
  ]),
};

export default ASSESSMENTS;
