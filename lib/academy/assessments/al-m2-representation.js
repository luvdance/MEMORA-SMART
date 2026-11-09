/**
 * ASSESSMENTS · DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 2
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./al-helpers.js";

export const ASSESSMENTS = {
  ...check("al-l5-pseudocode", [
    q("alq5-1", "a-al-natural-language", 2, "What is the main weakness of describing an algorithm in natural language?",
      ["It is ambiguous, especially for combined conditions and nested steps", "English has no brackets and many words have several readings."],
      [["Nobody can read it", "Natural language is the easiest form to read."],
       ["It cannot describe loops at all", "It can, just verbosely and imprecisely."],
       ["It only works for mathematical problems", "It can describe any algorithm."]]),
    q("alq5-2", "a-al-pseudocode-syntax", 2, "Which pseudocode loop always executes its body at least once?",
      ["REPEAT ... UNTIL", "The condition is tested at the end, after the body has run."],
      [["WHILE ... DO", "WHILE tests first and may run zero times."],
       ["FOR i FROM 1 TO 0", "A FOR loop from 1 to 0 runs zero times."],
       ["IF ... THEN", "IF is selection, not a loop."]]),
    q("alq5-3", "a-al-pseudocode-syntax", 3, "SET x TO 12\nIF x > 10 THEN\n    IF x MOD 2 = 1 THEN OUTPUT \"A\" ELSE OUTPUT \"B\" END IF\nELSE\n    OUTPUT \"C\"\nEND IF\n\nWhat is output?",
      ["B", "12 > 10, so the inner IF runs; 12 MOD 2 is 0, so the ELSE branch outputs B."],
      [["A", "12 is even, so x MOD 2 = 1 is false."],
       ["C", "C is only output when x <= 10."],
       ["A and B", "Only one branch of an IF/ELSE runs."]], "scenario"),
    q("alq5-4", "a-al-pseudocode-loops", 3, "A login loop is written WHILE attempts < 3 AND NOT granted. Starting from attempts = 0 with every guess wrong, how many guesses are read?",
      ["3", "attempts goes 0 → 1 → 2 → 3; at 3 the condition is false and the loop ends."],
      [["2", "When attempts is 2 the condition 2 < 3 is still true, so a third guess is read."],
       ["4", "When attempts reaches 3 the loop stops."],
       ["It never stops", "attempts increases every iteration, so it stops."]]),
  ]),

  ...check("al-l6-flowcharts", [
    q("alq6-1", "a-al-flowchart-symbols", 1, "Which flowchart symbol represents a process such as result ← a + b?",
      ["Rectangle", "Calculations and assignments are processes."],
      [["Diamond", "Diamonds are decisions."],
       ["Parallelogram", "Parallelograms are input and output."],
       ["Oval", "Ovals mark start and stop."]]),
    q("alq6-2", "a-al-flowchart-symbols", 2, "What is a connector used for in a flowchart?",
      ["Joining parts of a chart that are separated, for example across pages", "It avoids long or crossing flow lines."],
      [["Starting the algorithm", "That is the START terminator."],
       ["Making a decision", "That is a diamond."],
       ["Calling a sub-algorithm", "That is the predefined-process symbol."]]),
    q("alq6-3", "a-al-flowchart-to-pseudocode", 2, "In a flowchart, an arrow from below a decision leads BACK UP to an earlier step. What does it translate to?",
      ["A loop, with the decision as its condition", "Back-arrows always mean repetition."],
      [["An IF ... ELSE", "IF branches rejoin further down; they do not go back."],
       ["An error in the flowchart", "Back-arrows are how loops are drawn."],
       ["The end of the algorithm", "The end is a STOP terminator."]]),
    q("alq6-4", "a-al-flowchart-calculator", 2, "In the calculator flowchart, why is the 'b = 0 ?' decision placed inside the division branch only?",
      ["Only division is undefined for a zero divisor; adding or multiplying by 0 is fine", "Checks belong exactly where they are needed."],
      [["Because b is never 0 for other operators", "b can be 0 for any operator."],
       ["Decisions must always be last", "Decisions go wherever the logic needs them."],
       ["It does not matter where it goes", "Placed earlier, it would wrongly reject 5 + 0."]]),
  ]),

  ...check("al-l7-code-and-dry-runs", [
    q("alq7-1", "a-al-pseudocode-to-python", 2, "Which Python loop matches the pseudocode FOR i FROM 1 TO n?",
      ["for i in range(1, n + 1):", "range() excludes its end, so n + 1 is needed to include n."],
      [["for i in range(1, n):", "That stops at n − 1: an off-by-one error."],
       ["for i in range(n):", "That runs 0 to n − 1."],
       ["while i < n:", "Without initialisation and update this is not equivalent, and it also excludes n."]]),
    q("alq7-2", "a-al-pseudocode-to-python", 3, "₦10,000 is invested at 10% compound interest per year. What is the amount after 2 years?",
      ["₦12,100", "10,000 × 1.1 = 11,000, then × 1.1 = 12,100."],
      [["₦12,000", "That is simple interest: interest is not earned on interest."],
       ["₦11,000", "That is after one year."],
       ["₦12,210", "That would need more than two years' growth."]]),
    q("alq7-3", "a-al-dry-run", 3, "count = 0\nfor i in range(3):\n    for j in range(3):\n        count += 1\nprint(count)\n\nWhat is printed?",
      ["9", "The inner loop runs 3 times for each of the 3 outer iterations."],
      [["6", "That is 3 + 3; nested loops multiply."],
       ["3", "That counts only the outer loop."],
       ["4", "range(3) gives 0, 1, 2: three values."]], "scenario"),
    q("alq7-4", "a-al-trace-practice", 2, "What is the purpose of a trace table?",
      ["To record each variable's value step by step while executing an algorithm by hand", "It makes a dry run systematic, so nothing is skipped."],
      [["To list the symbols used in a flowchart", "That is a key, not a trace."],
       ["To measure how long a program takes", "That is empirical timing."],
       ["To store data in a database", "Unrelated."]]),
  ]),

  ...check("al-l8-correctness", [
    q("alq8-1", "a-al-execution-paths", 3, "An algorithm has two independent IF/ELSE statements one after the other. How many execution paths does it have?",
      ["4", "Each IF has 2 outcomes, and they combine: 2 × 2."],
      [["2", "That would be a single IF."],
       ["3", "Paths multiply, they do not add."],
       ["1", "Every IF/ELSE splits the flow in two."]]),
    q("alq8-2", "a-al-logical-errors", 2, "A maximum-finding loop starts with largest = 0. For which input does it give a wrong answer?",
      ["[-5, -2, -9]", "No item exceeds 0, so it returns 0, which is not even in the list."],
      [["[3, 8, 1]", "8 > 0, so it works here."],
       ["[0, 4]", "4 is found correctly."],
       ["[7]", "7 > 0, so it works."]]),
    q("alq8-3", "a-al-logical-errors", 2, "Why can't the Python interpreter detect a logical error?",
      ["The program is valid Python; it simply computes something other than what was intended", "Only a human, or a test, knows the intended answer."],
      [["Because Python has no error messages", "Python reports syntax and runtime errors."],
       ["Because logical errors only happen in pseudocode", "They happen in programs constantly."],
       ["Because logical errors always crash the program", "They usually do not crash; they give wrong results."]]),
    q("alq8-4", "a-al-correctness-validation", 3, "Which three properties must be shown for a loop invariant proof?",
      ["Initialisation, maintenance and termination", "True before the loop, preserved by each iteration, and useful when it ends."],
      [["Input, process and output", "That is the shape of an algorithm, not an invariant proof."],
       ["Best, average and worst case", "Those are cases for running-time analysis."],
       ["Correctness, finiteness and definiteness", "Those are characteristics of algorithms."]]),
  ]),
};

export default ASSESSMENTS;
