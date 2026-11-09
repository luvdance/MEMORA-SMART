/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 1
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l1-what-is-an-algorithm", [
    q("alq1-1", "a-al-what-is-algorithm", 1, "Which definition of an algorithm is the most accurate?",
      ["A finite sequence of precise instructions that turns input into output for every instance of a problem", "Finite, precise, input to output, and general: all four parts matter."],
      [["Any computer program", "Programs implement algorithms, and some programs (servers) never terminate."],
       ["A fast way to calculate one particular answer", "An algorithm solves every instance of a problem, and need not be fast."],
       ["A list of suggestions for solving a problem", "Suggestions are not precise; every step of an algorithm must be definite."]]),
    q("alq1-2", "a-al-what-is-algorithm", 2, "Euclid's algorithm replaces (a, b) by (b, a mod b) until b is 0. What is gcd(84, 36)?",
      ["12", "(84, 36) → (36, 12) → (12, 0), so the answer is 12."],
      [["6", "6 divides both, but 12 is larger and also divides both."],
       ["36", "36 does not divide 84."],
       ["4", "4 divides both, but it is not the greatest common divisor."]]),
    q("alq1-3", "a-al-algorithms-and-programming", 2, "A team rewrites a slow program from Python into C++ using the same algorithm. Which statement is true?",
      ["Each run gets faster by a roughly constant factor, but the way running time grows with input size is unchanged", "The algorithm decides the growth; the language only changes the constant factor."],
      [["The algorithm becomes a different, faster algorithm", "The method is unchanged, so it is the same algorithm."],
       ["The program can now handle any input size instantly", "If the algorithm grows badly, a faster language only delays the problem."],
       ["Nothing changes at all", "Compiled C++ is usually faster by a constant factor."]]),
    q("alq1-4", "a-al-python-in-course", 1, "In the function def average(a, b, c, d, e): ... return total / 5, what is the role of return?",
      ["It hands the output of the algorithm back to whoever called the function", "Parameters are the input; return delivers the output."],
      [["It prints the result on the screen", "print() displays; return gives the value back to the caller."],
       ["It repeats the function", "return ends the function; it does not loop."],
       ["It reads the five numbers from the keyboard", "The numbers arrive as parameters."]]),
  ]),

  ...check("al-l2-good-algorithm", [
    q("alq2-1", "a-al-five-characteristics", 1, "Which of these is NOT one of the five characteristics of an algorithm?",
      ["Written in Python", "Algorithms are language-independent; Python is one way to implement them."],
      [["Finiteness", "An algorithm must always terminate."],
       ["Definiteness", "Every step must be unambiguous."],
       ["Effectiveness", "Every step must be basic enough to carry out."]]),
    q("alq2-2", "a-al-five-characteristics", 2, "A procedure computes a student's total but never outputs or returns it. Which characteristic does it violate?",
      ["Input and output", "An algorithm must produce at least one output."],
      [["Finiteness", "It does stop; it just produces nothing."],
       ["Definiteness", "Its steps may be perfectly precise."],
       ["Effectiveness", "Adding numbers is an effective step."]]),
    q("alq2-3", "a-al-finiteness-and-correctness", 3, "The loop `while n != 0: n = n - 2` is started with n = 9. What happens?",
      ["It never stops, because n goes 9, 7, ..., 1, -1, ... and never equals 0", "Finiteness fails for odd n; the safe condition is n >= 2."],
      [["It stops with n = 1", "The condition is n != 0, so n = 1 keeps the loop going."],
       ["It stops with n = 0", "n is always odd, so it can never be 0."],
       ["It stops after 9 steps", "It never stops."]]),
    q("alq2-4", "a-al-algorithm-vs-program", 2, "Which is true of programs but NOT of algorithms?",
      ["A program may be designed to run forever, such as a web server", "By definition an algorithm terminates; some programs deliberately do not."],
      [["A program has inputs and outputs", "Algorithms have those too."],
       ["A program is language-independent", "It is the algorithm that is language-independent."],
       ["A program is analysed by mathematical proof only", "Programs are mainly checked by testing; algorithms by proof and analysis."]]),
  ]),

  ...check("al-l3-algorithms-at-work", [
    q("alq3-1", "a-al-real-world-applications", 1, "A ride-hailing app finds the fastest route to a passenger. Which family of algorithms does it rely on?",
      ["Shortest-path algorithms on a graph of roads", "Roads are edges, junctions are vertices and travel times are weights: Dijkstra's algorithm."],
      [["Sorting algorithms", "Sorting may help elsewhere, but routes are a graph problem."],
       ["Compression algorithms", "Compression stores data in fewer bits."],
       ["Encryption algorithms", "Encryption protects data; it does not find routes."]]),
    q("alq3-2", "a-al-how-computers-execute", 2, "What is the fetch–decode–execute cycle?",
      ["The processor repeatedly fetches the next instruction, works out what it means and carries it out", "Each simple instruction takes about constant time, which is why counting steps predicts running time."],
      [["The way a program is downloaded from the internet", "It is what the processor does with every instruction."],
       ["A sorting algorithm", "It is how hardware runs any algorithm."],
       ["The way Python checks for syntax errors", "Syntax is checked when the code is compiled to bytecode."]]),
    q("alq3-3", "a-al-how-computers-execute", 3, "x = 2\ny = x + 3\nx = y * x\nprint(x, y)\n\nWhat is printed?",
      ["10 5", "y = 5, then x = 5 × 2 = 10."],
      [["4 5", "x is replaced by y * x, not doubled."],
       ["10 10", "y is not changed after line 2."],
       ["2 5", "Line 3 reassigns x."]], "scenario"),
    q("alq3-4", "a-al-problem-solving", 2, "In Pólya's method, what does the LOOK BACK step involve?",
      ["Testing the solution on edge cases and asking whether it can be simpler", "Look back = verify and improve."],
      [["Rereading the problem statement before starting", "That is step 1, understanding the problem."],
       ["Choosing a programming language", "Not one of the steps."],
       ["Writing the code", "That is carrying out the plan."]]),
  ]),

  ...check("al-l4-computational-thinking", [
    q("alq4-1", "a-al-computational-thinking", 1, "A route planner keeps junctions, roads and distances, and ignores the colour of buildings. Which pillar of computational thinking is this?",
      ["Abstraction", "Abstraction keeps only the details relevant to the problem."],
      [["Decomposition", "Decomposition splits the problem into sub-problems."],
       ["Pattern recognition", "That is noticing similarity with known problems."],
       ["Iteration", "Iteration is a programming construct, not a pillar."]]),
    q("alq4-2", "a-al-decomposition-abstraction", 2, "In the ATM algorithm, why should the amount be validated before the balance is checked?",
      ["An invalid amount is invalid whatever the balance, so the basic check comes first and the result is always correct", "Order the checks so that each decision depends only on what has already been established."],
      [["Checking the balance is not necessary", "It is necessary for valid amounts."],
       ["It makes the machine print faster", "The order affects correctness of the message, not printing."],
       ["Validation must always be the last step", "It should come before anything that relies on a valid amount."]]),
    q("alq4-3", "a-al-design-vs-implementation", 2, "The design says \"a score of 50 or more is a pass\". The code says `if score > 50:`. What kind of error is this?",
      ["An implementation error at a boundary: 50 is wrongly a fail", "The design is correct; the code uses > instead of >=."],
      [["A design error", "The design states the rule correctly."],
       ["A syntax error", "The code runs; it just gives the wrong answer for 50."],
       ["Not an error", "A student with exactly 50 should pass."]]),
    q("alq4-4", "a-al-design-vs-implementation", 2, "Which test values best check the pass/fail implementation with valid range 0 to 100 and pass mark 50?",
      ["-1, 0, 49, 50, 100, 101", "Test each boundary and just outside it."],
      [["10, 20, 30", "These miss every boundary."],
       ["50 only", "One value cannot test both branches and the range checks."],
       ["75, 80, 95", "All passes; nothing tests failing or invalid scores."]]),
  ]),
};

export default ASSESSMENTS;
