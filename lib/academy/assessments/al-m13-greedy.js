/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 13
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l53-greedy-method", [
    q("alq53-1", "a-al-greedy-intro", 1, "What characterises a greedy algorithm?",
      ["At each step it makes the locally best choice and never reconsiders it", "Commit and move on, with no backtracking."],
      [["It tries every possible solution", "That is brute force."],
       ["It stores and reuses subproblem results", "That is dynamic programming."],
       ["It splits the problem into halves", "That is divide and conquer."]]),
    q("alq53-2", "a-al-greedy-choice-substructure", 2, "Which two properties guarantee that a greedy algorithm is optimal?",
      ["The greedy-choice property and optimal substructure", "A safe first choice, and an optimal remainder."],
      [["Overlapping subproblems and memoization", "Those are dynamic programming's ingredients."],
       ["Stability and in-place operation", "Those are properties of sorting algorithms."],
       ["Finiteness and definiteness", "Every algorithm needs those; they do not guarantee optimality."]]),
    q("alq53-3", "a-al-greedy-choice-substructure", 3, "What does the greedy-choice property state?",
      ["Some optimal solution includes the choice the greedy rule makes first", "So making that choice never rules out the optimum."],
      [["Every solution containing the greedy choice is optimal", "Only that SOME optimal solution contains it."],
       ["The greedy choice is always the largest item", "The choice depends on the rule: earliest finish, best ratio, etc."],
       ["Greedy algorithms run in O(n log n)", "That is about speed, not correctness."]]),
    q("alq53-4", "a-al-greedy-strategy", 2, "When designing a greedy algorithm, what should you do with a candidate rule before trusting it?",
      ["Try to break it with small counterexamples, then prove the one that survives", "One counterexample disproves a rule; only a proof establishes it."],
      [["Implement it immediately", "Implementation does not show optimality."],
       ["Check that it is fast", "Speed is not correctness."],
       ["Test it on one large input", "A single test cannot prove optimality."]]),
  ]),

  ...check("al-l54-classic-greedy", [
    q("alq54-1", "a-al-activity-selection", 2, "Which greedy rule solves activity selection optimally?",
      ["Pick the activity that finishes earliest, then repeat with the compatible ones", "Finishing early leaves the most time for the rest."],
      [["Pick the shortest activity first", "A short activity can overlap two compatible long ones."],
       ["Pick the activity that starts earliest", "An early start can be a very long activity that blocks many."],
       ["Pick the activity with the most overlaps last", "Not a correct rule."]]),
    q("alq54-2", "a-al-fractional-knapsack", 3, "Capacity 10 kg. Items: A (value 30, 5 kg), B (value 20, 4 kg), C (value 18, 6 kg). What is the fractional-knapsack maximum?",
      ["53", "Ratios: A 6, B 5, C 3. Take A (30) and B (20), then 1 kg of C (3): 53."],
      [["50", "There is 1 kg of room left after A and B: take a fraction of C."],
       ["48", "That takes A and C, a worse ratio than B."],
       ["68", "That is all three items, which weigh 15 kg."]]),
    q("alq54-3", "a-al-coin-job-sequencing", 2, "In job sequencing with deadlines, why is each job placed in the LATEST free slot before its deadline?",
      ["It keeps earlier slots free for jobs with tighter deadlines", "Late placement leaves the most options open."],
      [["To finish jobs as late as possible for its own sake", "The aim is to fit more jobs."],
       ["Because earlier slots are worth less", "All slots are worth the same."],
       ["It is not; jobs go in the earliest slot", "Earliest placement can block a later job with an early deadline."]]),
    q("alq54-4", "a-al-coin-job-sequencing", 2, "Jobs (id, deadline, profit): (p, 1, 50), (q, 1, 70), (r, 2, 20). What does the greedy schedule earn?",
      ["90", "q (70) takes slot 1; p cannot fit; r (20) takes slot 2."],
      [["120", "p and q both need slot 1; only one can have it."],
       ["140", "That is all three jobs, which do not fit."],
       ["70", "r still fits in slot 2."]]),
  ]),

  ...check("al-l55-huffman-mst", [
    q("alq55-1", "a-al-huffman", 2, "What does the Huffman algorithm merge at each step?",
      ["The two nodes with the lowest frequencies", "Rare symbols end up deepest, with the longest codes."],
      [["The two nodes with the highest frequencies", "That would give frequent symbols long codes."],
       ["The first two characters of the text", "Frequencies decide, not position."],
       ["Any two nodes", "The greedy choice is specifically the two smallest."]]),
    q("alq55-2", "a-al-huffman", 2, "Why must a Huffman code be a prefix code?",
      ["So that a stream of bits can be decoded without ambiguity", "No code is the start of another, so each code ends where it is recognised."],
      [["So that all codes have the same length", "Huffman codes have different lengths."],
       ["To encrypt the file", "Compression is not encryption."],
       ["Because computers read bits backwards", "They do not."]]),
    q("alq55-3", "a-al-mst-prim", 2, "How many edges does a spanning tree of a connected graph with V vertices have?",
      ["V − 1", "A tree on V vertices always has V − 1 edges."],
      [["V", "That would contain a cycle."],
       ["E", "A spanning tree uses only some of the edges."],
       ["V²", "Far too many."]]),
    q("alq55-4", "a-al-kruskal", 3, "What does union-find do in Kruskal's algorithm?",
      ["It checks whether an edge's two ends are already connected, so the edge would form a cycle", "find compares components; union merges them."],
      [["It sorts the edges", "Sorting is done separately, before the loop."],
       ["It finds the shortest path", "That is Dijkstra's algorithm."],
       ["It chooses the start vertex", "Kruskal has no start vertex."]]),
  ]),

  ...check("al-l56-greedy-limits", [
    q("alq56-1", "a-al-greedy-fails", 2, "With coins {1, 3, 4}, how many coins does greedy (largest first) use for 6, and what is the optimum?",
      ["Greedy uses 3 (4 + 1 + 1); the optimum is 2 (3 + 3)", "This coin system is not canonical."],
      [["Both use 2", "Greedy takes the 4 first and is left with 2."],
       ["Greedy uses 2; the optimum is 3", "It is the other way round."],
       ["Both use 3", "3 + 3 uses only two coins."]]),
    q("alq56-2", "a-al-greedy-fails", 3, "Why does greedy by value-to-weight ratio fail for the 0/1 knapsack?",
      ["Items cannot be split, so a high-ratio item can leave capacity that no remaining item fills well", "The greedy-choice property does not hold without fractions."],
      [["Because ratios cannot be computed", "They can; they just do not lead to the optimum."],
       ["Because the 0/1 knapsack has no optimal solution", "It does; finding it needs dynamic programming."],
       ["It does not fail", "Capacity 50 with items (60, 10), (100, 20), (120, 30) is a counterexample."]]),
    q("alq56-3", "a-al-greedy-proofs", 3, "What is an exchange argument?",
      ["Showing that any optimal solution can be changed step by step into the greedy solution without getting worse", "So the greedy solution is optimal too."],
      [["Swapping two items in a list to sort it", "That is a sorting step."],
       ["Exchanging the input for a smaller one", "That describes reduction or recursion."],
       ["Trading time for memory", "That is a time-space trade-off."]]),
    q("alq56-4", "a-al-greedy-resource", 2, "Why is the interval-partitioning greedy optimal for lecture rooms?",
      ["It opens a new room only when every room is busy, so its count equals the peak number of simultaneous lectures, which every schedule needs", "A lower bound met by the algorithm proves optimality."],
      [["Because it sorts by end time", "It sorts by start time."],
       ["Because it uses a heap", "The heap makes it fast, not optimal."],
       ["It is not optimal", "It matches the lower bound, so it is."]]),
  ]),
};

export default ASSESSMENTS;
