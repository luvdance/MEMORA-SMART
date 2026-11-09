/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 11
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l45-recursion-basics", [
    q("alq45-1", "a-al-what-is-recursion", 1, "What is a recursive function?",
      ["A function that solves a problem by calling itself on a smaller instance of the same problem", "It reduces the problem until a base case is reached."],
      [["A function that runs in a loop forever", "Correct recursion terminates at a base case."],
       ["A function that calls a different function", "That is an ordinary call (or indirect recursion if it comes back)."],
       ["A function with no parameters", "Recursion needs a changing input to make progress."]]),
    q("alq45-2", "a-al-base-recursive-cases", 2, "def f(n):\n    return n * f(n - 1)\n\nWhat goes wrong when f(3) is called?",
      ["There is no base case, so it recurses until RecursionError", "Nothing stops the calls at 1 or 0."],
      [["It returns 6", "It never returns."],
       ["It returns 0", "It never reaches a return value."],
       ["It returns 3", "The multiplication never completes."]], "scenario"),
    q("alq45-3", "a-al-call-stack", 2, "During factorial(5), how many frames are on the stack at the deepest point (counting the base case call factorial(1))?",
      ["5", "factorial(5), (4), (3), (2) and (1) are all active at once."],
      [["1", "The callers wait on the stack until the base case returns."],
       ["120", "That is the result, not the depth."],
       ["25", "Depth grows by one per call."]]),
    q("alq45-4", "a-al-call-stack", 3, "In factorial(3) = 3 × factorial(2), when does the multiplication by 3 happen?",
      ["After factorial(2) has returned its value", "The frame for 3 waits on the stack until its call returns."],
      [["Before factorial(2) is called", "The value of factorial(2) is needed first."],
       ["At the same time as the base case", "The base case returns first; the waiting frames then finish in reverse order."],
       ["Never; recursion only adds", "Each frame does its own multiplication when its call returns."]]),
  ]),

  ...check("al-l46-kinds-of-recursion", [
    q("alq46-1", "a-al-direct-indirect", 2, "Function A calls B, and B calls A. What is this called?",
      ["Indirect (mutual) recursion", "The recursion goes through another function."],
      [["Direct recursion", "Direct means a function calls itself."],
       ["Tail recursion", "Tail refers to the position of the call."],
       ["Iteration", "No loop is involved."]]),
    q("alq46-2", "a-al-tail-recursion", 3, "Which is a TAIL-recursive definition?",
      ["def f(n, acc=1): return acc if n <= 1 else f(n - 1, acc * n)", "The recursive call is the last operation; its result is returned unchanged."],
      [["def f(n): return 1 if n <= 1 else n * f(n - 1)", "The multiplication happens after the call returns."],
       ["def f(n): return 1 if n <= 1 else f(n - 1) + 1", "The addition happens after the call."],
       ["def f(n): return 1 if n <= 1 else f(n - 1) * f(n - 2)", "Two calls, combined afterwards."]]),
    q("alq46-3", "a-al-tail-recursion", 2, "Does Python optimise tail calls to use constant stack space?",
      ["No: a tail-recursive Python function still uses one frame per call", "Python deliberately omits tail-call optimisation."],
      [["Yes, always", "Python keeps every frame."],
       ["Only for factorial", "There is no such special case."],
       ["Only in Python 3.12 and later", "No version of CPython does it."]]),
    q("alq46-4", "a-al-recursion-vs-iteration", 2, "Which is a real advantage of iteration over recursion in Python?",
      ["It uses O(1) stack and cannot raise RecursionError", "Loops do not grow the call stack."],
      [["It is always easier to read", "Recursive problems such as trees often read better recursively."],
       ["It can solve problems recursion cannot", "Each can express the other."],
       ["It is always asymptotically faster", "Usually only by a constant factor, unless recursion repeats work."]]),
  ]),

  ...check("al-l47-recurrences", [
    q("alq47-1", "a-al-recursion-trees", 3, "In the recursion tree of T(n) = 2T(n/2) + n, how much work is done on each level, and how many levels are there?",
      ["n per level, about log₂ n levels, so Θ(n log n)", "2ᵏ calls of size n/2ᵏ each do n/2ᵏ work."],
      [["n per level and n levels", "The size halves, so there are only log₂ n levels."],
       ["1 per level and log n levels", "Each level does linear work in total."],
       ["2ⁿ per level", "The number of calls doubles but their size halves."]]),
    q("alq47-2", "a-al-recurrence-relations", 2, "What is the recurrence for recursive binary search?",
      ["T(n) = T(n/2) + c", "One recursive call on half the range plus constant work."],
      [["T(n) = 2T(n/2) + c", "Binary search recurses into only one half."],
       ["T(n) = T(n − 1) + c", "The range halves; it does not shrink by one."],
       ["T(n) = 2T(n/2) + n", "That is merge sort."]]),
    q("alq47-3", "a-al-solving-recurrences", 3, "Solve T(n) = T(n − 1) + n with T(1) = 1.",
      ["T(n) = n(n + 1)/2, which is Θ(n²)", "n + (n − 1) + ... + 1."],
      [["T(n) = n", "That would be T(n) = T(n − 1) + 1."],
       ["T(n) = n log n", "The input shrinks by 1, not by half."],
       ["T(n) = 2ⁿ", "There is only one recursive call."]]),
    q("alq47-4", "a-al-solving-recurrences", 2, "How many moves does the Tower of Hanoi need for 5 discs?",
      ["31", "2⁵ − 1 = 31."],
      [["32", "It is 2ⁿ − 1, not 2ⁿ."],
       ["25", "That is n²."],
       ["10", "That is 2n."]]),
  ]),

  ...check("al-l48-recursion-depth-complexity", [
    q("alq48-1", "a-al-recursion-depth", 2, "A recursive function processes a list by calling itself on the rest of the list. On which input does it fail in Python?",
      ["A list of 100,000 items, because the depth exceeds the recursion limit", "Linear recursion is n deep; Python's default limit is about 1,000."],
      [["An empty list", "That is the base case."],
       ["A list of 10 items", "10 levels is well within the limit."],
       ["A sorted list", "Order does not affect depth."]]),
    q("alq48-2", "a-al-analysing-recursive", 3, "What is the time complexity of sum_list(items) = items[0] + sum_list(items[1:]) on n items?",
      ["O(n²), because each slice copies up to n items", "T(n) = T(n − 1) + cn."],
      [["O(n)", "That is the index version, without copies."],
       ["O(log n)", "The input shrinks by one, not by half."],
       ["O(2ⁿ)", "There is only one recursive call per level."]]),
    q("alq48-3", "a-al-analysing-recursive", 3, "What is the space complexity (stack depth) of the Tower of Hanoi recursion for n discs?",
      ["O(n)", "The deepest chain of active calls has n levels, even though there are 2ⁿ − 1 moves."],
      [["O(2ⁿ)", "Completed calls are popped; only one path is active."],
       ["O(1)", "Each level of recursion holds a frame."],
       ["O(log n)", "n decreases by 1 per level."]]),
    q("alq48-4", "a-al-halving-recursion", 2, "Why does splitting a list in halves (rather than peeling off one item) let recursion handle much longer lists?",
      ["The depth becomes log₂ n instead of n", "Total work is still Θ(n), but the stack stays shallow."],
      [["Because it makes fewer calls in total", "It makes about 2n calls, more than n."],
       ["Because halving is always O(log n) time", "The total time is still Θ(n) here."],
       ["Because Python optimises halving", "Python does not; the depth is simply smaller."]]),
  ]),
};

export default ASSESSMENTS;
