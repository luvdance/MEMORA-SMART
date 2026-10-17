/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 2
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l5-three-structures": {
    lessonId: "js-l5-three-structures",
    passMark: 70,
    questions: [
      {
        id: "jsq5-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-selection",
        prompt: "Which structure lets a program choose between two different sets of steps?",
        options: [
          { id: "a", text: "Sequence" },
          { id: "b", text: "Selection" },
          { id: "c", text: "Iteration" },
          { id: "d", text: "Assignment" },
        ],
        correct: "b",
        explanation: "Selection checks a condition and runs one branch or the other. In pseudocode it is IF … THEN … ELSE.",
        whyWrong: {
          a: "Sequence runs every step in order. It never skips any.",
          c: "Iteration repeats steps. It does not choose between alternatives.",
          d: "Assignment stores a value. It is a single step, not a structure that controls which steps run.",
        },
      },
      {
        id: "jsq5-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-iteration",
        prompt: "A program asks the user for their PIN until they enter it correctly. Which loop fits best?",
        options: [
          { id: "a", text: "A FOR loop from 1 to 3" },
          { id: "b", text: "A WHILE loop that repeats while the PIN is wrong" },
          { id: "c", text: "No loop, just an IF" },
          { id: "d", text: "A FOR loop from 1 to 100" },
        ],
        correct: "b",
        explanation:
          "You cannot know in advance how many attempts it will take, so the loop must be controlled by a condition rather than a count.",
        whyWrong: {
          a: "That allows exactly three attempts whether or not the PIN is right, and keeps asking even after a correct entry unless you add more logic.",
          c: "An IF asks once. A wrong PIN would simply end the program.",
          d: "Guessing a large count is not the same as repeating until a condition changes.",
        },
      },
      {
        id: "jsq5-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-sequence",
        prompt: "SET p TO 2\nSET q TO p + 3\nSET p TO q * 2\nOUTPUT p\n\nWhat is output?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "5" },
          { id: "c", text: "10" },
          { id: "d", text: "7" },
        ],
        correct: "c",
        explanation: "q becomes 2 + 3 = 5. Then p becomes 5 × 2 = 10. Each line uses the values as they are at that moment.",
        whyWrong: {
          a: "That is the original p doubled. Line 3 uses q, not p.",
          b: "5 is the value of q, but the output is p.",
          d: "7 would be p + q after line 2. Line 3 multiplies q by 2.",
        },
      },
      {
        id: "jsq5-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-iteration-trace",
        prompt: "SET total TO 0\nFOR i FROM 1 TO 3\n    SET total TO total + 10\nEND FOR\nOUTPUT total\n\nWhat is output?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "30" },
          { id: "c", text: "6" },
          { id: "d", text: "10, 20 and 30 on three lines" },
        ],
        correct: "b",
        explanation: "The loop runs three times, adding 10 each time: 0 → 10 → 20 → 30. OUTPUT is after END FOR, so it runs once.",
        whyWrong: {
          a: "That would be one repetition. The loop runs for i = 1, 2 and 3.",
          c: "6 is 1 + 2 + 3, which would need total + i. This adds 10 each time.",
          d: "That would happen if OUTPUT were inside the loop. It comes after END FOR.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l6-storing-information": {
    lessonId: "js-l6-storing-information",
    passMark: 70,
    questions: [
      {
        id: "jsq6-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-variable-idea",
        prompt: "What does SET count TO count + 1 do?",
        options: [
          { id: "a", text: "Nothing, because count cannot equal count + 1" },
          { id: "b", text: "Works out count + 1 using the current value, then stores the result back in count" },
          { id: "c", text: "Creates a second variable called count" },
          { id: "d", text: "Checks whether count is equal to count + 1" },
        ],
        correct: "b",
        explanation: "Assignment is an instruction, not an equation. The right-hand side is evaluated first, then stored under the name on the left.",
        whyWrong: {
          a: "That reads it as an equation. It is an instruction to compute and store.",
          c: "There is still one count. Its value is replaced.",
          d: "Checking equality is a comparison, used in a condition. SET is assignment.",
        },
      },
      {
        id: "jsq6-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-constants",
        prompt: "Which value is the best candidate for a constant?",
        options: [
          { id: "a", text: "The number of items in a shopping cart" },
          { id: "b", text: "The user's current score" },
          { id: "c", text: "The VAT rate used for every calculation" },
          { id: "d", text: "The number of login attempts left" },
        ],
        correct: "c",
        explanation: "A constant is fixed for the whole run. The VAT rate is the same for every calculation, and naming it once means it can be changed in one place.",
        whyWrong: {
          a: "The cart changes as items are added and removed, so it is a variable.",
          b: "A score goes up as the user plays, so it is a variable.",
          d: "Attempts go down each time, so it is a variable.",
        },
      },
      {
        id: "jsq6-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-arithmetic",
        prompt: "What is 23 MOD 4?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "3" },
          { id: "c", text: "5.75" },
          { id: "d", text: "0" },
        ],
        correct: "b",
        explanation: "4 goes into 23 five times (20), leaving 3. MOD gives the remainder.",
        whyWrong: {
          a: "5 is 23 DIV 4, the whole number of times 4 fits, not the remainder.",
          c: "5.75 is ordinary division, 23 / 4.",
          d: "The remainder would only be 0 if 4 divided 23 exactly.",
        },
      },
      {
        id: "jsq6-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-logic-reasoning",
        prompt: "isMember is true and total is 3000. What is (total >= 5000) OR isMember?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "It cannot be worked out" },
          { id: "d", text: "3000" },
        ],
        correct: "a",
        explanation: "total >= 5000 is false, but OR only needs one side to be true, and isMember is true.",
        whyWrong: {
          b: "That would be the result of AND. OR is true when at least one side is true.",
          c: "Both values are given, so both sides can be evaluated.",
          d: "A logical expression produces true or false, not a number.",
        },
      },
      {
        id: "jsq6-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-assignment-trace",
        prompt: "SET x TO 6\nSET y TO 2\nSET x TO x * y\nSET y TO x + y\nOUTPUT y\n\nWhat is output?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "14" },
          { id: "c", text: "12" },
          { id: "d", text: "4" },
        ],
        correct: "b",
        explanation: "x becomes 6 × 2 = 12. Then y becomes 12 + 2 = 14, using the updated x.",
        whyWrong: {
          a: "That uses the original x of 6. Line 4 sees the new value, 12.",
          c: "12 is x after line 3. The output is y.",
          d: "There is no subtraction or division in this algorithm.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l7-dry-runs-logic-errors": {
    lessonId: "js-l7-dry-runs-logic-errors",
    passMark: 70,
    questions: [
      {
        id: "jsq7-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-dry-run-table",
        prompt: "What is a dry-run (trace) table for?",
        options: [
          { id: "a", text: "Making a program run faster" },
          { id: "b", text: "Recording every variable's value at each step so you can see exactly what an algorithm does" },
          { id: "c", text: "Storing data permanently" },
          { id: "d", text: "Drawing a flowchart" },
        ],
        correct: "b",
        explanation: "A trace table records the state of the algorithm step by step, which shows the exact row where the actual behaviour departs from the intended one.",
        whyWrong: {
          a: "A dry run is done by hand. It does not change how fast anything runs.",
          c: "The table is a thinking tool on paper, not storage.",
          d: "A flowchart draws the structure. A trace table records the values as it runs.",
        },
      },
      {
        id: "jsq7-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-error-kinds",
        prompt: "A program runs without crashing but calculates the wrong change for a customer. What kind of error is it?",
        options: [
          { id: "a", text: "Syntax error" },
          { id: "b", text: "Runtime error" },
          { id: "c", text: "Logic error" },
          { id: "d", text: "No error" },
        ],
        correct: "c",
        explanation: "The program runs and produces a result, but the result is wrong. That is a logic error, and nothing will warn you about it.",
        whyWrong: {
          a: "A syntax error stops the program from running at all.",
          b: "A runtime error crashes the program part way through. This one finished.",
          d: "Wrong change is a wrong result, which is a bug.",
        },
      },
      {
        id: "jsq7-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-off-by-one",
        prompt: "SET i TO 0\nSET n TO 0\nWHILE i <= 3\n    SET n TO n + 1\n    SET i TO i + 1\nEND WHILE\nOUTPUT n\n\nWhat is output?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "4" },
          { id: "c", text: "5" },
          { id: "d", text: "0" },
        ],
        correct: "b",
        explanation: "The loop runs for i = 0, 1, 2 and 3: four times. When i becomes 4, 4 <= 3 is false and the loop stops.",
        whyWrong: {
          a: "This forgets that i starts at 0, and that <= includes 3 itself.",
          c: "When i is 4 the condition is false, so there is no fifth repetition.",
          d: "0 <= 3 is true at the start, so the loop body runs.",
        },
      },
      {
        id: "jsq7-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-fixing-logic",
        prompt: "You fix \"IF age > 18\" to \"IF age >= 18\". Which set of test values best checks the fix?",
        options: [
          { id: "a", text: "18 only" },
          { id: "b", text: "17, 18 and 19" },
          { id: "c", text: "50 and 60" },
          { id: "d", text: "1, 2 and 3" },
        ],
        correct: "b",
        explanation: "Test on the boundary and on each side of it. 17 must be rejected, 18 and 19 accepted.",
        whyWrong: {
          a: "18 alone shows the fix works there, but not that 17 is still rejected.",
          c: "Both values are far above the boundary, where the old and new conditions behave identically.",
          d: "All far below the boundary, where both versions reject. They prove nothing about 18.",
        },
      },
      {
        id: "jsq7-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-dry-run-practice",
        prompt: "SET n TO 3\nSET result TO 1\nWHILE n > 0\n    SET result TO result * 2\n    SET n TO n - 1\nEND WHILE\nOUTPUT result\n\nWhat is output?",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "8" },
          { id: "c", text: "4" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation: "result doubles three times, for n = 3, 2 and 1: 1 → 2 → 4 → 8. When n reaches 0 the loop stops.",
        whyWrong: {
          a: "6 is 3 × 2. The loop doubles result, it does not multiply by n.",
          c: "That is two doublings. The loop also runs when n is 1, because 1 > 0.",
          d: "That is one doubling. The loop runs three times.",
        },
      },
    ],
  },
};
