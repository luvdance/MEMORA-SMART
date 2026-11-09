/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 17
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l72-search-banking-recommendations", [
    q("alq72-1", "a-al-search-engines", 2, "What is an inverted index?",
      ["A map from each word to the list of documents containing it", "Queries touch only the documents that contain their words."],
      [["A list of documents sorted backwards", "It maps words to documents, not documents in reverse."],
       ["A copy of every page in reverse order", "Unrelated."],
       ["A ranking of pages by popularity", "Ranking is applied after retrieval."]]),
    q("alq72-2", "a-al-search-engines", 3, "Two sorted posting lists have lengths m and n. How fast can they be intersected?",
      ["O(m + n), by merging", "Walk both lists once with two pointers."],
      [["O(mn)", "That compares every pair."],
       ["O(m log n) at best", "Merging is linear, which is usually better."],
       ["O(1)", "Every entry must be examined."]]),
    q("alq72-3", "a-al-banking", 2, "Which data structure lets a velocity check (\"more than 3 transactions in 60 seconds\") run in O(1) amortized per transaction?",
      ["A queue of recent transaction times per account, popping times older than the window", "Each time is added and removed once."],
      [["A sorted list of all transactions, re-sorted each time", "Re-sorting is O(n log n) per transaction."],
       ["A stack", "The oldest times must leave first: FIFO."],
       ["An adjacency matrix", "Unrelated to time windows."]]),
    q("alq72-4", "a-al-recommendations-social", 2, "How does \"customers who bought X also bought Y\" work in its simplest form?",
      ["Count how often each other item appears in orders that contain X, and show the most frequent", "Co-occurrence counting: item-based collaborative filtering."],
      [["Show the most expensive items", "Price is not the signal."],
       ["Show random items", "That ignores behaviour."],
       ["Show items alphabetically", "Order of names is irrelevant."]]),
  ]),

  ...check("al-l73-commerce-navigation-ai-security", [
    q("alq73-1", "a-al-ecommerce", 2, "With product names kept sorted, how does autocomplete find names starting with a prefix?",
      ["Binary search for the first name ≥ the prefix, then read forward while names match", "O(log n + k)."],
      [["Scan every name for each keystroke", "O(n) per keystroke."],
       ["Hash the prefix", "A hash table cannot find all keys with a common prefix."],
       ["Sort the names on every keystroke", "Sorting is O(n log n) each time."]]),
    q("alq73-2", "a-al-navigation-ai", 3, "Why does A* with an admissible heuristic still find the shortest path?",
      ["The heuristic never overestimates the remaining distance, so the goal is not popped before a shorter route is considered", "Admissibility preserves optimality."],
      [["Because it explores every vertex", "It explores fewer vertices than Dijkstra."],
       ["Because the heuristic is exact", "It only needs to be a lower bound."],
       ["It does not; A* is approximate", "With an admissible heuristic it is exact."]]),
    q("alq73-3", "a-al-navigation-ai", 2, "On a grid where each move costs 1 in four directions, which heuristic is admissible for A*?",
      ["Manhattan distance |Δr| + |Δc|", "It is exactly the moves needed with no walls, so never an overestimate."],
      [["Twice the Manhattan distance", "That can overestimate."],
       ["The number of walls on the map", "Unrelated to distance."],
       ["The square of the distance", "That overestimates for distances above 1."]]),
    q("alq73-4", "a-al-cybersecurity", 2, "Why should password storage use a deliberately slow hash such as bcrypt rather than SHA-256?",
      ["Fast hashes let attackers test billions of guesses per second against a stolen database", "Slowness and salts make guessing expensive."],
      [["SHA-256 can be reversed easily", "It cannot be reversed; attackers guess instead."],
       ["bcrypt makes the website faster", "It is deliberately slower."],
       ["SHA-256 output is too short", "Its length is not the problem."]]),
  ]),

  ...check("al-l74-data-distributed-ml", [
    q("alq74-1", "a-al-databases", 2, "What is the time complexity of a hash join of tables with n and m rows (ignoring the output size)?",
      ["O(n + m)", "Build a hash table on one table, probe with the other."],
      [["O(nm)", "That is a nested-loop join."],
       ["O(n log n + m log m)", "That is a sort-merge join."],
       ["O(1)", "Every row must be read."]]),
    q("alq74-2", "a-al-databases", 2, "Why do databases use B-trees for indexes?",
      ["They are balanced with many keys per node, so lookups and range queries need only a few disk reads, O(log n)", "Shallow trees suit slow storage."],
      [["Because they are unbalanced", "B-trees are always balanced."],
       ["Because they support only equality lookups", "Hash indexes are equality-only; B-trees also do ranges."],
       ["Because they use no memory", "They use memory and disk."]]),
    q("alq74-3", "a-al-analytics-distributed", 2, "Why can word counting be split across many machines with MapReduce?",
      ["Counts from separate chunks can be merged by addition in any order", "Associative, commutative merging."],
      [["Because words are sorted", "No sorting is needed for the counts."],
       ["Because each machine counts every word of every chunk", "Each machine counts only its own chunk."],
       ["It cannot be split", "It is the standard MapReduce example."]]),
    q("alq74-4", "a-al-machine-learning", 2, "How does k-nearest neighbours classify a new point?",
      ["By a majority vote among the labels of the k closest training points", "Prediction is a search for nearby examples."],
      [["By fitting a straight line through all the points", "That is linear regression."],
       ["By choosing the label of the first training point", "Distance decides, not order."],
       ["By sorting the labels alphabetically", "Labels are voted on, not sorted."]]),
  ]),
};

export default ASSESSMENTS;
