/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 18
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l75-capstone-plan", [
    q("alq75-1", "a-al-capstone-options", 1, "Which capstone project relies mainly on Dijkstra's algorithm?",
      ["The Intelligent Route Finder", "Shortest routes on a weighted graph."],
      [["The Student Result Processing System", "That relies on sorting, ranking and statistics."],
       ["The Product Search and Recommendation System", "That relies on searching, sorting and co-occurrence."],
       ["The Resource Allocation Optimiser", "That relies on greedy and dynamic programming."]]),
    q("alq75-2", "a-al-problem-statement", 2, "What belongs in a problem statement?",
      ["Inputs, outputs, rules, constraints and what happens with invalid data, without saying how it will be solved", "What, not how."],
      [["The source code", "Code is a later deliverable."],
       ["The choice of sorting algorithm", "That is design, after analysis."],
       ["The test results", "Results come after implementation."]]),
    q("alq75-3", "a-al-problem-statement", 2, "Why validate and count invalid input lines rather than letting the program crash on them?",
      ["Real data contains errors; the system must keep working and report how much it rejected", "Robustness is part of correctness."],
      [["Because invalid lines are faster to process", "Speed is not the reason."],
       ["Because validation makes sorting stable", "Unrelated."],
       ["It is better to crash so that errors are noticed", "Rejecting and counting makes errors visible without losing the valid data."]]),
    q("alq75-4", "a-al-problem-analysis", 3, "The Result Processor must handle 100,000 students in under one second. Why is any O(n²) stage unacceptable?",
      ["n² = 10¹⁰ operations, far beyond what one second allows", "At about 10⁸ operations per second that would take around 100 seconds."],
      [["Because O(n²) algorithms are always incorrect", "They can be correct, just too slow."],
       ["Because Python cannot run nested loops", "It can."],
       ["It is acceptable", "It would break the time requirement."]]),
  ]),

  ...check("al-l76-capstone-design", [
    q("alq76-1", "a-al-proposed-algorithm", 2, "With standard competition ranking, what ranks do the sorted scores 90, 80, 80, 70 receive?",
      ["1, 2, 2, 4", "Tied scores share a rank, and the next rank skips."],
      [["1, 2, 3, 4", "That ignores the tie."],
       ["1, 2, 2, 3", "That is dense ranking, not competition ranking."],
       ["1, 1, 2, 3", "Only equal scores share a rank."]]),
    q("alq76-2", "a-al-proposed-algorithm", 2, "Why does sorting by score first make tie detection easy?",
      ["Equal scores become adjacent, so each record only needs comparing with the previous one", "One linear pass after the sort."],
      [["Because sorting removes duplicates", "Sorting keeps every record."],
       ["Because ties disappear after sorting", "Ties remain, next to each other."],
       ["It does not help", "Without sorting, ties could be anywhere."]]),
    q("alq76-3", "a-al-capstone-ranking", 2, "Which key sorts records (matric, name, score) by score descending, then matric ascending, in one call?",
      ["key=lambda r: (-r[2], r[0])", "Negating the score reverses its order while the matric stays ascending."],
      [["key=lambda r: (r[2], r[0]), reverse=True", "That would also reverse the matric order."],
       ["key=lambda r: r[0]", "That sorts by matric only."],
       ["key=lambda r: -r[0]", "Strings cannot be negated."]]),
    q("alq76-4", "a-al-capstone-statistics", 2, "What is the median of the scores 40, 90, 60, 70?",
      ["65", "Sorted: 40, 60, 70, 90; the average of the two middle values is (60 + 70) / 2."],
      [["60", "With an even count, average the two middle values."],
       ["70", "The two middle values are 60 and 70."],
       ["65.0 is not allowed; it must be a score in the list", "For an even count the median can lie between two scores."]]),
  ]),

  ...check("al-l77-capstone-report", [
    q("alq77-1", "a-al-capstone-complexity", 2, "The system's stages are O(n), O(n), O(n log n) and O(n log k), run one after another. What is the overall complexity (k ≤ n)?",
      ["O(n log n)", "Sequential stages add; the largest term dominates."],
      [["O(n⁴ log n)", "Sequential stages add, they do not multiply."],
       ["O(n)", "The sort costs more than linear."],
       ["O(n log k)", "The full sort is the larger term."]]),
    q("alq77-2", "a-al-capstone-testing", 2, "Which test is most likely to catch an error in the rule \"50 or more is a C\"?",
      ["A score of exactly 50", "Bugs live at boundaries: > versus >=."],
      [["A score of 55", "Both > 50 and >= 50 give C for 55."],
       ["A score of 95", "Far from the boundary."],
       ["A score of 10", "Far from the boundary."]]),
    q("alq77-3", "a-al-capstone-optimisation-report", 3, "Why is heapq.nsmallest(k, ...) faster than a full sort for the top k of n records when k is small?",
      ["It keeps a heap of only k items, so it costs O(n log k) instead of O(n log n)", "For k = 10 and n = 100,000, log k is about 3 against about 17."],
      [["Because it sorts in place", "The benefit is the small heap, not in-place sorting."],
       ["Because it skips half the records", "It must look at every record."],
       ["It is not faster", "It is asymptotically faster when k is much smaller than n."]]),
    q("alq77-4", "a-al-capstone-optimisation-report", 2, "Which item is part of the mandatory capstone documentation?",
      ["Test cases and their results", "Item 9 of the eleven deliverables."],
      [["A marketing plan", "Not a deliverable."],
       ["The history of the programming language", "Not required."],
       ["A list of every Python built-in", "Not required."]]),
  ]),
};

export default ASSESSMENTS;
