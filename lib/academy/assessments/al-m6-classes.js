/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 6
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l22-fast-classes", [
    q("alq22-1", "a-al-constant-class", 2, "Which statement about O(1) algorithms is correct?",
      ["Their work does not depend on the input size, though it may still be large", "Constant means independent of n, not necessarily fast."],
      [["They always finish in one step", "A fixed 1,000 steps is also O(1)."],
       ["They can only be used on small inputs", "They work on any size of input."],
       ["They must use a formula", "Indexing an array or a hash lookup is also O(1)."]]),
    q("alq22-2", "a-al-logarithmic-class", 2, "Why is exponentiation by squaring O(log n)?",
      ["Each step halves the exponent n", "Halving n reaches 0 after about log₂ n steps."],
      [["It multiplies x by itself n times", "That is the O(n) method it replaces."],
       ["It uses the ** operator", "It avoids **; the speed comes from halving."],
       ["Because x is small", "The step count depends on n, not on x."]]),
    q("alq22-3", "a-al-logarithmic-class", 2, "Roughly how many steps does an O(log n) algorithm need for n = 1,000,000,000?",
      ["About 30", "2³⁰ ≈ 1.07 × 10⁹."],
      [["About 9", "That is log₁₀; the base only changes a constant factor, but halving takes 30 steps."],
       ["About 31,623", "That is √n."],
       ["About 1,000,000", "That is far more than log n."]]),
    q("alq22-4", "a-al-linear-linearithmic", 3, "Detecting duplicates by sorting and then checking neighbours has which complexity?",
      ["O(n log n)", "Sort O(n log n) plus a linear pass O(n)."],
      [["O(n)", "Sorting alone costs n log n."],
       ["O(n²)", "That is the compare-every-pair method."],
       ["O(log n)", "Every item must be read at least once."]]),
  ]),

  ...check("al-l23-polynomial-classes", [
    q("alq23-1", "a-al-quadratic", 2, "A quadratic algorithm takes 2 seconds on 10,000 items. Roughly how long on 20,000?",
      ["8 seconds", "Doubling n multiplies n² by 4."],
      [["4 seconds", "That is linear scaling."],
       ["2.3 seconds", "That would be closer to n log n."],
       ["16 seconds", "That would be cubic scaling."]]),
    q("alq23-2", "a-al-cubic", 2, "How many multiplications does schoolbook multiplication of two 100 × 100 matrices perform?",
      ["1,000,000", "n³ = 100³."],
      [["10,000", "That is the number of entries in the result, n²."],
       ["200", "That is 2n."],
       ["30,000", "That is 3n², not n³."]]),
    q("alq23-3", "a-al-polynomial-class", 2, "Which running time is NOT polynomial?",
      ["O(1.5ⁿ)", "A base above 1 raised to n is exponential."],
      [["O(n⁵)", "A constant power of n is polynomial."],
       ["O(n log n)", "It is bounded by n²."],
       ["O(n² log n)", "It is bounded by n³."]]),
    q("alq23-4", "a-al-polynomial-class", 3, "Why does complexity theory use polynomial time as the line for \"tractable\"?",
      ["Polynomials stay polynomial when combined, and natural polynomial algorithms usually have small exponents", "Closure under composition makes it a robust class."],
      [["Because every polynomial algorithm is fast in practice", "n¹⁰⁰ is polynomial and useless."],
       ["Because exponential algorithms are always incorrect", "They are often correct, just slow."],
       ["Because computers cannot run exponential algorithms", "They can, for small n."]]),
  ]),

  ...check("al-l24-exponential-factorial", [
    q("alq24-1", "a-al-exponential", 2, "How many subsets does a set of 20 items have?",
      ["1,048,576", "2²⁰: each item is in or out."],
      [["400", "That is 20²."],
       ["20!", "That counts orderings, not subsets."],
       ["40", "That is 2 × 20."]]),
    q("alq24-2", "a-al-exponential", 2, "An O(2ⁿ) algorithm takes 1 second for n = 30. About how long for n = 31?",
      ["2 seconds", "Each extra item doubles the work."],
      [["1.03 seconds", "That would be linear growth."],
       ["31 seconds", "Exponential growth doubles per item, it does not multiply by n."],
       ["1 second", "The work grows with n."]]),
    q("alq24-3", "a-al-factorial", 2, "Which problem is naturally solved by brute force in O(n!)?",
      ["Trying every order of visiting n cities (Travelling Salesperson)", "There are n! orderings of n cities."],
      [["Trying every subset of n items", "That is 2ⁿ."],
       ["Finding the maximum of n numbers", "That is O(n)."],
       ["Sorting n numbers with merge sort", "That is O(n log n)."]]),
    q("alq24-4", "a-al-intractable", 3, "At 10⁸ operations per second, roughly the largest n an O(n²) algorithm can handle in one second is...",
      ["10,000", "10,000² = 10⁸."],
      [["100,000,000", "That is for O(n)."],
       ["460", "That is for O(n³)."],
       ["26", "That is for O(2ⁿ)."]]),
  ]),

  ...check("al-l25-comparing-classes", [
    q("alq25-1", "a-al-comparing-classes", 1, "Which list is ranked from most to least efficient?",
      ["O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!)", "The standard order of growth."],
      [["O(log n), O(1), O(n), O(n²), O(n log n), O(n!), O(2ⁿ)", "O(1) beats O(log n), n log n beats n², and 2ⁿ beats n!."],
       ["O(1), O(n), O(log n), O(n log n), O(2ⁿ), O(n²), O(n!)", "log n beats n, and n² beats 2ⁿ."],
       ["O(n!), O(2ⁿ), O(n²), O(n log n), O(n), O(log n), O(1)", "That is least to most efficient."]]),
    q("alq25-2", "a-al-scalability", 2, "At 10⁸ operations per second and n = 1,000,000, about how long does an O(n²) algorithm take?",
      ["About 3 hours", "10¹² / 10⁸ = 10⁴ seconds ≈ 2.8 hours."],
      [["About 0.01 seconds", "That is O(n)."],
       ["About 0.2 seconds", "That is O(n log n)."],
       ["About 300 years", "That is O(n³)."]]),
    q("alq25-3", "a-al-scalability", 2, "Why do tests on 100 records say little about scalability?",
      ["At small n every polynomial class runs almost instantly, so differences in growth are invisible", "Growth only shows at large n."],
      [["Because small tests always fail", "They pass; they just do not reveal growth."],
       ["Because 100 records cannot be sorted", "They can."],
       ["Because time cannot be measured below one second", "Small times can be measured; they are simply all tiny."]]),
    q("alq25-4", "a-al-practical-implications", 3, "To find the largest n with cost(n) within a budget, why double n first and then binary search?",
      ["It needs only O(log n) evaluations of cost, even when the answer is huge", "Doubling finds an upper bound in log n steps; binary search narrows it in log n more."],
      [["Because cost can only be evaluated at powers of 2", "Binary search evaluates other values too."],
       ["Because scanning n = 1, 2, 3, ... gives a wrong answer", "It gives the right answer, but far too slowly."],
       ["Because it works when cost is decreasing", "It assumes cost is increasing."]]),
  ]),
};

export default ASSESSMENTS;
