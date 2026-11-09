/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 9
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l36-linear-search", [
    q("alq36-1", "a-al-searching-intro", 1, "Which searching method works on UNSORTED data?",
      ["Linear search", "It makes no assumption about order."],
      [["Binary search", "It needs sorted data to discard halves."],
       ["Interpolation search", "It needs sorted, roughly uniform data."],
       ["Jump search", "It needs sorted data to skip blocks."]]),
    q("alq36-2", "a-al-linear-search", 2, "What are the time and space complexity of linear search?",
      ["O(n) time and O(1) space", "One pass, a single index variable."],
      [["O(log n) time and O(1) space", "That is binary search."],
       ["O(n) time and O(n) space", "No copy of the data is made."],
       ["O(1) time and O(n) space", "That describes a hash lookup after building the table."]]),
    q("alq36-3", "a-al-linear-search", 2, "Linear search on n items finds nothing. How many comparisons did it make?",
      ["n", "Absent targets are the worst case: every item is checked."],
      [["n/2", "That is roughly the average when the target is present."],
       ["1", "That is the best case."],
       ["log₂ n", "That is binary search."]]),
    q("alq36-4", "a-al-linear-search-variants", 2, "Why must finding ALL contacts containing \"ade\" examine every contact?",
      ["Any contact not examined might contain \"ade\", so skipping one could miss a match", "Finding all matches of a substring needs a full pass: Θ(n)."],
      [["Because contacts are always unsorted", "Even alphabetical order does not help with substrings."],
       ["Because Python strings are slow", "It is a property of the problem, not the language."],
       ["It does not; binary search can do it", "Binary search finds an exact key in sorted order, not substrings."]]),
  ]),

  ...check("al-l37-binary-search", [
    q("alq37-1", "a-al-binary-search", 2, "What is the maximum number of comparisons binary search needs on 1,000 sorted items?",
      ["10", "⌊log₂ 1000⌋ + 1 = 9 + 1 = 10."],
      [["500", "That is linear search's average."],
       ["1,000", "That is linear search's worst case."],
       ["32", "That is about √1000, jump search's block size."]]),
    q("alq37-2", "a-al-binary-search", 3, "Binary search for 37 in [3, 8, 15, 21, 30, 37, 42]. Which items are examined, in order?",
      ["21, then 37", "mid = (0 + 6) // 2 = 3 gives 21; 37 > 21 so lo = 4; mid = (4 + 6) // 2 = 5 gives 37."],
      [["30, then 37", "The first mid is index 3, which holds 21."],
       ["21, then 30, then 37", "After 21 the range is indexes 4 to 6, whose middle is index 5: 37."],
       ["3, 8, 15, 21, 30, 37", "That is linear search."]]),
    q("alq37-3", "a-al-recursive-binary-search", 2, "What is the auxiliary space of recursive binary search?",
      ["O(log n), for the stack frames", "Each halving adds one frame."],
      [["O(1)", "That is the iterative version."],
       ["O(n)", "The depth is only log₂ n."],
       ["O(n log n)", "Far more than it needs."]]),
    q("alq37-4", "a-al-binary-search-boundaries", 3, "In the sorted list [10, 20, 20, 20, 30], what are bisect_left(a, 20) and bisect_right(a, 20)?",
      ["1 and 4", "The 20s are at indexes 1 to 3; bisect_right is one past the last."],
      [["1 and 3", "bisect_right points just AFTER the last 20."],
       ["0 and 4", "bisect_left is the first 20's index, 1."],
       ["2 and 2", "That is the middle 20 only."]]),
  ]),

  ...check("al-l38-jump-interpolation-exponential", [
    q("alq38-1", "a-al-jump-search", 2, "What block size minimises the work of jump search on n items, and what is the resulting complexity?",
      ["√n, giving O(√n)", "n/m jumps plus m steps is smallest when m = √n."],
      [["n/2, giving O(log n)", "Two huge blocks leave a long linear scan."],
       ["log n, giving O(log n)", "That would need n / log n jumps."],
       ["1, giving O(1)", "Blocks of 1 make it linear search."]]),
    q("alq38-2", "a-al-interpolation-search", 2, "When does interpolation search perform badly?",
      ["When the keys are far from uniformly distributed, such as rapidly growing values", "Its position guesses are then poor and it can degrade to O(n)."],
      [["When the list is sorted", "It requires sorted data."],
       ["When the keys are evenly spaced", "That is its best situation."],
       ["When the list is large", "On uniform data it shines on large lists."]]),
    q("alq38-3", "a-al-interpolation-search", 3, "What is the average-case complexity of interpolation search on uniformly distributed keys?",
      ["O(log log n)", "Each probe shrinks the range dramatically on uniform data."],
      [["O(log n)", "That is binary search."],
       ["O(√n)", "That is jump search."],
       ["O(1)", "It needs more than a constant number of probes in general."]]),
    q("alq38-4", "a-al-exponential-search", 2, "Why is exponential search useful when the target is near the beginning of a huge list?",
      ["Its cost is O(log i), where i is the target's position, not O(log n)", "Doubling stops as soon as it passes the target."],
      [["Because it scans from the beginning", "It doubles the index; it does not scan."],
       ["Because it does not need sorted data", "It does need sorted data."],
       ["Because it uses a hash table", "It uses only the sorted list."]]),
  ]),

  ...check("al-l39-choosing-search", [
    q("alq39-1", "a-al-sorted-vs-unsorted", 3, "You will search an unsorted list of 1,000,000 items 1,000 times. Which plan does less work?",
      ["Sort once (about 2 × 10⁷ steps), then binary search 1,000 times (about 2 × 10⁴)", "1,000 linear searches cost up to 10⁹."],
      [["1,000 linear searches", "That is up to 10⁹ comparisons."],
       ["Sort before every search", "Repeating the sort wastes almost all the work."],
       ["They are the same", "They differ by a factor of about 50."]]),
    q("alq39-2", "a-al-comparing-searching", 2, "Which question can a sorted list with binary search answer efficiently that a hash table cannot?",
      ["How many items lie between two values", "Hash tables keep no order, so ranges need a full scan."],
      [["Is this exact key present?", "Both can; the hash table is faster."],
       ["What value is stored for this key?", "That is the hash table's strength."],
       ["How many items are there?", "Both store their size."]]),
    q("alq39-3", "a-al-comparing-searching", 2, "What is the worst-case time of interpolation search?",
      ["O(n)", "Poorly distributed keys can make every probe advance by one position."],
      [["O(log log n)", "That is the average on uniform data."],
       ["O(log n)", "Binary search guarantees this; interpolation does not."],
       ["O(√n)", "That is jump search."]]),
    q("alq39-4", "a-al-choosing-search", 2, "A program looks up user profiles by user ID millions of times a day. Which technique fits?",
      ["A hash table keyed by user ID", "Exact-key lookups at O(1) average."],
      [["Linear search through a list", "O(n) per lookup, millions of times."],
       ["Jump search", "Slower than binary search and hashing."],
       ["Sorting the users before each lookup", "Sorting every time wastes O(n log n)."]]),
  ]),
};

export default ASSESSMENTS;
