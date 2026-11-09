/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 12
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l49-divide-conquer", [
    q("alq49-1", "a-al-dc-intro", 1, "What are the three steps of divide and conquer?",
      ["Divide, conquer (solve recursively), combine", "Split into subproblems, solve them, merge the answers."],
      [["Sort, search, return", "Those are tasks, not the paradigm's steps."],
       ["Choose, commit, never revise", "That describes greedy algorithms."],
       ["Store, reuse, look up", "That describes dynamic programming."]]),
    q("alq49-2", "a-al-divide-conquer-combine", 3, "While merging sorted halves [2, 5, 9] and [1, 6] to count inversions, 1 is taken from the right half first. How many split inversions does that add?",
      ["3", "1 is smaller than all 3 items still waiting in the left half."],
      [["1", "Every waiting left item forms an inversion with 1."],
       ["2", "There are 3 left items waiting, not 2."],
       ["0", "Taking from the right means left items were larger."]]),
    q("alq49-3", "a-al-dc-recursion-trees", 2, "How many leaves does the recursion tree of T(n) = aT(n/b) + f(n) have?",
      ["n^(log_b a)", "a^(log_b n) leaves, which equals n^(log_b a)."],
      [["n", "Only when a = b."],
       ["log_b n", "That is the number of levels."],
       ["aⁿ", "The depth is log_b n, not n."]]),
    q("alq49-4", "a-al-dc-recursion-trees", 3, "In a LEAF-HEAVY recursion tree, which term dominates T(n)?",
      ["The work at the leaves, Θ(n^(log_b a))", "Work grows down the tree, so the bottom level dominates."],
      [["The work at the root, Θ(f(n))", "That is a root-heavy tree."],
       ["f(n) log n", "That is a balanced tree."],
       ["Nothing; all trees cost the same", "The shape decides the answer."]]),
  ]),

  ...check("al-l50-master-theorem", [
    q("alq50-1", "a-al-master-theorem-statement", 2, "For T(n) = aT(n/b) + Θ(nᵈ), what is the solution when d = log_b a?",
      ["Θ(nᵈ log n)", "Case 2: every level does the same work, over log n levels."],
      [["Θ(nᵈ)", "That is case 3, when d > log_b a."],
       ["Θ(n^(log_b a))", "That is case 1, when d < log_b a."],
       ["Θ(log n)", "Only when d = 0."]]),
    q("alq50-2", "a-al-master-examples", 3, "Solve T(n) = 8T(n/2) + n².",
      ["Θ(n³)", "a = 8, b = 2, d = 2; log₂ 8 = 3 > 2, case 1."],
      [["Θ(n² log n)", "That needs log_b a = d = 2."],
       ["Θ(n²)", "That needs d > log_b a."],
       ["Θ(n log n)", "That is merge sort's recurrence."]]),
    q("alq50-3", "a-al-master-examples", 3, "Solve T(n) = 2T(n/2) + n².",
      ["Θ(n²)", "log₂ 2 = 1 < 2 = d, case 3, and the regularity condition holds: 2(n/2)² = n²/2."],
      [["Θ(n² log n)", "That is case 2."],
       ["Θ(n log n)", "f(n) = n² dominates."],
       ["Θ(n)", "The root alone already does n² work."]]),
    q("alq50-4", "a-al-master-practice", 2, "To which recurrence can the Master Theorem NOT be applied directly?",
      ["T(n) = T(n − 1) + n", "The input shrinks by subtraction, not division by b."],
      [["T(n) = 2T(n/2) + n", "Merge sort: a = 2, b = 2, d = 1."],
       ["T(n) = T(n/2) + 1", "Binary search: a = 1, b = 2, d = 0."],
       ["T(n) = 9T(n/3) + n", "a = 9, b = 3, d = 1."]]),
  ]),

  ...check("al-l51-dc-analysis", [
    q("alq51-1", "a-al-merge-sort-analysis", 2, "Why are merge sort's best and worst cases the same order of growth?",
      ["It always splits evenly and always merges every item, whatever the input order", "The recursion tree has the same shape for every input."],
      [["Because it checks whether the list is sorted first", "Standard merge sort does not."],
       ["Because its worst case is O(n)", "Every case is Θ(n log n)."],
       ["They are not the same", "Best, average and worst are all Θ(n log n)."]]),
    q("alq51-2", "a-al-quick-sort-analysis", 3, "Quick sort's pivot always splits the list 9 to 1. What is its running time?",
      ["Θ(n log n)", "The depth is log_{10/9} n = O(log n), with at most n work per level."],
      [["Θ(n²)", "Only splits that remove a constant number of items cause n²."],
       ["Θ(n)", "Each level still does up to n work."],
       ["Θ(n log² n)", "There is no extra log factor."]]),
    q("alq51-3", "a-al-quick-sort-analysis", 2, "Which recurrence describes quick sort's worst case?",
      ["T(n) = T(n − 1) + n", "One side is empty, the other has n − 1 items."],
      [["T(n) = 2T(n/2) + n", "That is the best case."],
       ["T(n) = T(n/2) + 1", "That is binary search."],
       ["T(n) = 2T(n − 1) + 1", "That is the Tower of Hanoi."]]),
    q("alq51-4", "a-al-binary-search-analysis", 3, "Binary search over r from 0 to N finds the integer square root of N. About how many steps for N = 10¹⁸?",
      ["About 60", "log₂ 10¹⁸ ≈ 59.8."],
      [["About 10⁹", "That would be a linear scan up to √N."],
       ["About 18", "That is log₁₀; halving needs log₂."],
       ["About 3", "Far too few halvings."]]),
  ]),

  ...check("al-l52-karatsuba", [
    q("alq52-1", "a-al-karatsuba", 2, "How many half-size multiplications does Karatsuba's method need at each level?",
      ["3", "ac, bd and (a + b)(c + d)."],
      [["4", "That is the naive split, which gives no speed-up."],
       ["2", "Two products cannot recover ad + bc as well."],
       ["1", "One product is not enough information."]]),
    q("alq52-2", "a-al-karatsuba", 3, "What is the time complexity of Karatsuba multiplication on n-digit numbers?",
      ["Θ(n^(log₂ 3)) ≈ Θ(n^1.585)", "T(n) = 3T(n/2) + Θ(n), Master case 1."],
      [["Θ(n²)", "That is the schoolbook method."],
       ["Θ(n log n)", "That would need 2T(n/2) + n."],
       ["Θ(n^1.5)", "log₂ 3 ≈ 1.585, not 1.5."]]),
    q("alq52-3", "a-al-dc-advantages", 2, "Why does divide and conquer suit parallel computers?",
      ["Its subproblems are independent, so they can be solved at the same time on different processors", "MapReduce is built on this idea."],
      [["Because it uses no memory", "It uses memory; independence is what matters."],
       ["Because it is always O(1)", "It is not."],
       ["Because recursion is faster on multiple cores automatically", "Only independent subproblems can be split across cores."]]),
    q("alq52-4", "a-al-dc-limitations", 2, "Why do practical merge sort implementations switch to insertion sort for small subarrays?",
      ["For small n, the overhead of recursion and merging outweighs the asymptotic advantage", "A cut-off of around 16 items is typical."],
      [["Because merge sort is incorrect on small arrays", "It is correct; it is just slower there."],
       ["Because insertion sort is O(n log n)", "It is O(n²), but with small constants."],
       ["To make the sort unstable", "Insertion sort is stable."]]),
  ]),
};

export default ASSESSMENTS;
