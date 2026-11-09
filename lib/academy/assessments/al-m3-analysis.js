/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 3
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l9-why-analysis", [
    q("alq9-1", "a-al-what-is-analysis", 1, "What does algorithm analysis primarily predict?",
      ["How the resources an algorithm needs, such as time and memory, grow with the size of its input", "Analysis is about growth as a function of n, independent of any machine."],
      [["The exact number of seconds a program takes on a given laptop", "That is a measurement, and it depends on the machine."],
       ["Whether the code has syntax errors", "That is the compiler's or interpreter's job."],
       ["How many lines of code the program has", "Code length says little about running time."]]),
    q("alq9-2", "a-al-efficiency-matters", 2, "How many operations does Gauss's formula n(n + 1)/2 need to sum 1 to n, compared with a loop?",
      ["A constant number, whatever n is, while the loop needs n additions", "The formula's cost does not grow with n."],
      [["Both need n operations", "The formula has no loop."],
       ["The formula needs n² operations", "It needs three arithmetic operations."],
       ["The loop is faster for large n", "The loop's cost grows; the formula's does not."]]),
    q("alq9-3", "a-al-efficiency-matters", 2, "Hardware becomes 10 times faster. What happens to an algorithm whose work grows like n²?",
      ["Each run is about 10 times faster, but doubling n still quadruples the work", "Hardware changes the constant, not the growth rate."],
      [["It becomes a linear algorithm", "The algorithm is unchanged."],
       ["It can now handle any input size", "Growth catches up with any constant speed-up."],
       ["Nothing changes", "Every run is faster by the same factor."]]),
    q("alq9-4", "a-al-correct-vs-efficient", 2, "Which statement about correctness and efficiency is right?",
      ["Correctness comes first, and the algorithm must also be fast enough for the real input sizes", "A wrong answer is useless however fast; a right answer is useless if it never arrives."],
      [["Efficiency always matters more than correctness", "A fast wrong answer has no value."],
       ["Any correct algorithm is good enough", "Not if it takes hours on the real data."],
       ["Always choose the most complex, fastest algorithm", "Complexity adds bugs; choose what the input size requires."]]),
  ]),

  ...check("al-l10-resources", [
    q("alq10-1", "a-al-computational-resources", 1, "Which two resources does algorithm analysis mainly measure?",
      ["Time and memory", "Running time and space are the classical measures."],
      [["Electricity and price", "These follow from time and hardware, but are not what is analysed."],
       ["Lines of code and comments", "These describe the program text, not its resource use."],
       ["Screen size and colours", "Unrelated to algorithms."]]),
    q("alq10-2", "a-al-execution-time-memory", 2, "Why does analysis count basic operations rather than measure seconds?",
      ["Operation counts depend only on the algorithm and the input, not on the machine or its load", "A count is the same on every computer."],
      [["Seconds cannot be measured in Python", "time.perf_counter() measures them."],
       ["Basic operations always take exactly one second", "Their cost varies by machine; counting avoids that."],
       ["Counting is always more accurate than timing for a given machine", "Timing captures real constants; counting is about growth."]]),
    q("alq10-3", "a-al-input-size", 2, "For an algorithm that multiplies two very large integers, what is the natural input size n?",
      ["The number of digits (or bits) in the numbers", "The work depends on how long the numbers are, not on how many numbers there are."],
      [["Always 2, because there are two inputs", "Two numbers of a million digits take far longer than two single digits."],
       ["The value of the larger number", "Work grows with the length of the number, roughly its logarithm, not its value."],
       ["The number of lines of code", "That describes the program, not the input."]]),
    q("alq10-4", "a-al-input-size", 3, "An algorithm compares every pair of n items, doing n(n − 1)/2 comparisons. How many for n = 100?",
      ["4,950", "100 × 99 / 2 = 4,950."],
      [["10,000", "That counts ordered pairs and self-pairs: n²."],
       ["100", "That would be one comparison per item."],
       ["9,900", "That is n(n − 1), counting each pair twice."]]),
  ]),

  ...check("al-l11-cases", [
    q("alq11-1", "a-al-best-case", 2, "What is the best case of linear search on a list of n items?",
      ["1 comparison, when the target is the first item", "Best case is the minimum over inputs of the same size n."],
      [["0 comparisons", "At least one comparison is needed to find anything."],
       ["When the list is empty", "Cases compare inputs of the same size, not different sizes."],
       ["n/2 comparisons", "That is about the average case."]]),
    q("alq11-2", "a-al-average-case", 3, "Linear search on 99 items, target present and equally likely at every position. What is the average number of comparisons?",
      ["50", "(n + 1)/2 = 100/2 = 50."],
      [["49.5", "That is n/2; the average of 1..n is (n + 1)/2."],
       ["99", "That is the worst case."],
       ["1", "That is the best case."]]),
    q("alq11-3", "a-al-average-case", 3, "Why can the average-case result be misleading?",
      ["It rests on an assumption about how inputs are distributed, which real data may not follow", "If searches are often for missing items, the real average is closer to n."],
      [["The average case is always equal to the worst case", "For linear search it is about half."],
       ["The average case ignores the input entirely", "It is an expectation over inputs."],
       ["It is only defined for sorting algorithms", "Any algorithm has an average case under a distribution."]]),
    q("alq11-4", "a-al-worst-case", 2, "Why is worst-case analysis the most commonly reported?",
      ["It is a guarantee that holds for every input and needs no assumptions about the data", "An upper bound you can promise."],
      [["It is always the most frequent case", "It is often common, but the main reason is the guarantee."],
       ["It is the easiest case to make fast", "It is the hardest case by definition."],
       ["It gives the smallest numbers", "It gives the largest."]]),
  ]),

  ...check("al-l12-measuring", [
    q("alq12-1", "a-al-empirical-vs-theoretical", 2, "Which is an advantage of theoretical analysis over empirical analysis?",
      ["It is machine-independent and covers every input size, even before code exists", "It describes growth for all n, which no finite experiment can."],
      [["It includes the effect of the processor cache", "That is what empirical measurement captures."],
       ["It gives the exact seconds a program will take", "It gives counts and growth, not seconds."],
       ["It requires running the program many times", "It needs no program at all."]]),
    q("alq12-2", "a-al-measuring-experimentally", 3, "Timing a function, doubling n from 2,000 to 4,000 makes the time go from 0.8 s to 3.2 s. What growth does this suggest?",
      ["Quadratic: doubling n multiplied the time by 4", "(2n)² = 4n²."],
      [["Linear", "Linear growth would only double the time."],
       ["Constant", "The time changed."],
       ["Logarithmic", "Logarithmic growth would barely change the time."]]),
    q("alq12-3", "a-al-measuring-experimentally", 2, "When timing an algorithm several times, why take the minimum of the runs?",
      ["Other activity on the machine can only slow a run down, so the fastest run is the least disturbed", "Noise only adds time."],
      [["Because the minimum is always the worst case", "Timing repeats the same input; the minimum filters noise."],
       ["To make the algorithm look better than it is", "It removes interference, not real cost."],
       ["Because averages cannot be computed", "They can; the minimum is simply less noisy."]]),
    q("alq12-4", "a-al-ten-versus-million", 3, "At 10⁸ operations per second, roughly how long does an n² algorithm take for n = 1,000,000?",
      ["About 10,000 seconds, nearly 3 hours", "n² = 10¹² operations ÷ 10⁸ per second = 10⁴ seconds."],
      [["About 0.01 seconds", "That is the linear algorithm."],
       ["About 1 second", "10¹² operations need far longer."],
       ["About 10 years", "10⁴ seconds is a few hours."]]),
  ]),
};

export default ASSESSMENTS;
