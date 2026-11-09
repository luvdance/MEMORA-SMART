/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 7
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l26-space-complexity", [
    q("alq26-1", "a-al-space-def", 1, "What does space complexity measure?",
      ["The memory an algorithm needs, as a function of input size", "Memory cells in use, expressed in O-notation."],
      [["The number of lines of code", "That is program length."],
       ["The disk space of the source file", "That is unrelated to the algorithm's memory use."],
       ["The time taken to allocate memory", "That is part of time complexity."]]),
    q("alq26-2", "a-al-time-vs-space", 2, "Can an algorithm take O(n²) time but only O(1) auxiliary space?",
      ["Yes, for example comparing every pair with two index variables", "Memory is reused; time accumulates."],
      [["No, space always equals time", "Space can be much smaller than time."],
       ["No, space must be at least O(n²)", "Only the cells in use at once count."],
       ["Only for recursive algorithms", "Iterative pair comparison is the classic example."]]),
    q("alq26-3", "a-al-auxiliary-space", 2, "Why is space complexity usually reported as auxiliary space?",
      ["Every algorithm must hold its input, so total space cannot distinguish algorithms", "Auxiliary space shows the extra cost of the method."],
      [["Because input space is always zero", "The input occupies memory."],
       ["Because auxiliary space is always O(1)", "It can be O(n), O(n²) and more."],
       ["Because computers do not store inputs", "They must store them."]]),
    q("alq26-4", "a-al-auxiliary-space", 2, "What is the auxiliary space of building a reversed copy of an n-item list?",
      ["O(n)", "The new list holds n items."],
      [["O(1)", "That is the in-place version."],
       ["O(log n)", "The copy is as long as the input."],
       ["O(n²)", "One copy of n items is linear."]]),
  ]),

  ...check("al-l27-space-classes", [
    q("alq27-1", "a-al-constant-linear-space", 2, "Which uses O(1) auxiliary space?",
      ["Finding the maximum of a list with one variable for the best so far", "A fixed number of variables, whatever n is."],
      [["Storing every item in a set", "O(n)."],
       ["Returning a list of all even items", "O(n) in the worst case."],
       ["Recursively summing n items", "n stack frames: O(n)."]]),
    q("alq27-2", "a-al-quadratic-space", 2, "An adjacency matrix for a graph with V vertices uses how much space?",
      ["O(V²)", "A V × V table, whatever the number of edges."],
      [["O(V)", "That would be one cell per vertex."],
       ["O(E)", "An adjacency list is O(V + E); a matrix is V²."],
       ["O(log V)", "Far too small."]]),
    q("alq27-3", "a-al-memory-allocation", 2, "Why can element i of an array be read in O(1) time?",
      ["The elements are contiguous, so its address is start + i × item size", "Address arithmetic needs no search."],
      [["Because arrays are sorted", "Arrays need not be sorted."],
       ["Because the computer searches very fast", "No search happens."],
       ["Because arrays store only small numbers", "Any fixed-size items work."]]),
    q("alq27-4", "a-al-memory-allocation", 3, "A low-level array holds 1,000,000 8-byte floats. About how much memory is that?",
      ["8 MB", "10⁶ × 8 bytes = 8 × 10⁶ bytes."],
      [["8 KB", "That would be 1,000 items."],
       ["1 MB", "Each item is 8 bytes, not 1."],
       ["8 GB", "That would be 10⁹ items."]]),
  ]),

  ...check("al-l28-stack-in-place", [
    q("alq28-1", "a-al-recursive-stack-space", 3, "What is the space complexity of naive recursive Fibonacci fib(n)?",
      ["O(n), because the deepest chain of active calls is n long", "Space depends on depth, not on the total number of calls."],
      [["O(2ⁿ), because it makes exponentially many calls", "Calls return and free their frames; only the depth is held at once."],
       ["O(1)", "Each active call holds a frame."],
       ["O(log n)", "The depth decreases by 1 or 2 per call, not by halving."]]),
    q("alq28-2", "a-al-recursive-stack-space", 2, "What happens in Python if recursion goes about 1,000 calls deep by default?",
      ["RecursionError is raised", "Python's default recursion limit protects the stack."],
      [["The program becomes faster", "Depth costs memory and eventually raises an error."],
       ["Python switches to a loop automatically", "Python does not convert recursion to iteration."],
       ["Nothing; there is no limit", "There is a configurable limit."]]),
    q("alq28-3", "a-al-in-place", 2, "Reversing a list by swapping from both ends towards the middle uses how much auxiliary space?",
      ["O(1)", "Two indexes and a swap, whatever the length."],
      [["O(n)", "No new list is created."],
       ["O(n/2)", "The swaps take time, not memory."],
       ["O(log n)", "There is no recursion."]]),
    q("alq28-4", "a-al-sorting-memory", 2, "Which sorting algorithm needs O(n) auxiliary space?",
      ["Merge sort", "Merging needs a temporary array."],
      [["Heap sort", "In place: O(1)."],
       ["Insertion sort", "In place: O(1)."],
       ["Selection sort", "In place: O(1)."]]),
  ]),

  ...check("al-l29-tradeoffs", [
    q("alq29-1", "a-al-time-space-tradeoffs", 2, "Which is a time-space trade-off?",
      ["Storing items in a hash set so that each membership test is O(1) instead of O(n)", "Extra O(n) memory buys faster lookups."],
      [["Writing the code in a faster language", "That changes constants, not the resource balance."],
       ["Removing comments from the code", "Irrelevant to time or space."],
       ["Using a loop instead of recursion", "That saves space without costing time, so it is not a trade-off."]]),
    q("alq29-2", "a-al-lookup-table", 2, "In the Sieve of Eratosthenes, why can crossing out start at p² for each prime p?",
      ["Smaller multiples of p have a smaller prime factor and were already crossed out", "For example 2p, 3p, ... were crossed out by 2, 3, ..."],
      [["Because p² is always prime", "p² is never prime."],
       ["To save memory", "It saves time; the table is the same size."],
       ["Because multiples below p² are prime", "They are composite and already crossed out."]]),
    q("alq29-3", "a-al-lookup-table", 3, "After building a sieve up to n, what is the cost of asking \"is k prime?\" for k ≤ n?",
      ["O(1): one table lookup", "The table stores the answer."],
      [["O(√k): trial division", "That is the method the sieve replaces."],
       ["O(n): scan the table", "Index k is read directly."],
       ["O(log n)", "No search is needed."]]),
    q("alq29-4", "a-al-memory-efficient", 3, "Which statistic can a streaming algorithm NOT compute exactly in O(1) space?",
      ["The median", "Finding the exact median requires remembering O(n) items in the worst case."],
      [["The mean", "Keep a running count and total."],
       ["The maximum", "Keep the largest so far."],
       ["The count", "Keep a counter."]]),
  ]),
};

export default ASSESSMENTS;
