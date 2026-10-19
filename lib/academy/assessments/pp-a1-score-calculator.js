/**
 * ASSESSMENTS · PYTHON PROGRAMMING · PHASE 1 ASSESSMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l17-plan-score-calculator": {
    lessonId: "pp-l17-plan-score-calculator",
    passMark: 70,
    questions: [
      {
        id: "ppq17-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-a1-requirements",
        prompt: "In the Student Score Calculator, which item is a PROCESS step?",
        options: [
          { id: "a", text: "Typing the student's name" },
          { id: "b", text: "Calculating the average of the scores" },
          { id: "c", text: "Printing the report" },
          { id: "d", text: "Typing the Maths score" },
        ],
        correct: "b",
        explanation: "Processing turns the inputs into results: the total, the average and the pass decision.",
        whyWrong: {
          a: "That is input.",
          c: "That is output.",
          d: "That is input.",
        },
      },
      {
        id: "ppq17-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a1-requirements",
        prompt: "The pass rule is \"an average of 50 or more\". Which test case is most likely to catch a bug in that rule?",
        options: [
          { id: "a", text: "Scores averaging 90" },
          { id: "b", text: "Scores averaging exactly 50" },
          { id: "c", text: "Scores averaging 10" },
          { id: "d", text: "Any random scores" },
        ],
        correct: "b",
        explanation: "Bugs cluster at boundaries. If someone wrote > 50 instead of >= 50, only an average of exactly 50 reveals it.",
        whyWrong: {
          a: "Both a correct and a buggy rule say 90 passes.",
          c: "Both say 10 fails.",
          d: "Random data rarely lands exactly on the boundary.",
        },
      },
      {
        id: "ppq17-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a1-algorithm",
        prompt: "Scores 40, 60, 70, 50. Using total / 4, what average does Python print?",
        options: [
          { id: "a", text: "55" },
          { id: "b", text: "55.0" },
          { id: "c", text: "220" },
          { id: "d", text: "55.00" },
        ],
        correct: "b",
        explanation: "The total is 220, and 220 / 4 is 55.0: / always produces a float.",
        whyWrong: {
          a: "/ gives a float, so Python shows 55.0.",
          c: "That is the total, before dividing.",
          d: "Two decimal places only appear with formatting such as :.2f.",
        },
      },
      {
        id: "ppq17-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a1-collect",
        prompt: "Why does Stage 1 convert the scores with int() straight away?",
        options: [
          { id: "a", text: "input() gives text, and the next stage needs numbers to add" },
          { id: "b", text: "int() makes the program run faster" },
          { id: "c", text: "Names must be integers" },
          { id: "d", text: "print() cannot show text" },
        ],
        correct: "a",
        explanation: "Adding text joins it (\"70\" + \"65\" is \"7065\"). Converting at the point of input means every later line works with numbers.",
        whyWrong: {
          b: "Speed is not the reason; correctness is.",
          c: "The name stays as text. Only the scores are converted.",
          d: "print() shows text perfectly well.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l18-build-score-calculator": {
    lessonId: "pp-l18-build-score-calculator",
    passMark: 70,
    questions: [
      {
        id: "ppq18-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a1-calculate",
        prompt: "average = 47.5\npassed = average >= 50\nprint(passed)\n\nWhat is printed?",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
          { id: "c", text: "47.5" },
          { id: "d", text: "passed" },
        ],
        correct: "b",
        explanation: "47.5 is not 50 or more, so the comparison is False, and that bool is stored in passed.",
        whyWrong: {
          a: "47.5 is below 50.",
          c: "passed holds the result of the comparison, not the average.",
          d: "passed has no quotes, so its value is printed.",
        },
      },
      {
        id: "ppq18-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-a1-report",
        prompt: "print(f\"Average: {77:.2f}\")\n\nWhat is printed?",
        options: [
          { id: "a", text: "Average: 77" },
          { id: "b", text: "Average: 77.00" },
          { id: "c", text: "Average: 77.0" },
          { id: "d", text: "Average: {77:.2f}" },
        ],
        correct: "b",
        explanation: ":.2f shows exactly two decimal places, even for a whole number.",
        whyWrong: {
          a: "The format adds decimal places.",
          c: ".2f means two decimal places, not one.",
          d: "The f prefix makes Python evaluate the braces.",
        },
      },
      {
        id: "ppq18-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-a1-report",
        prompt: "What does f\"{'Ada':<6}|\" produce?",
        options: [
          { id: "a", text: "Ada   |" },
          { id: "b", text: "   Ada|" },
          { id: "c", text: "Ada|" },
          { id: "d", text: "Ada<6|" },
        ],
        correct: "a",
        explanation: "<6 left-aligns the text in a space 6 characters wide: Ada plus three spaces.",
        whyWrong: {
          b: "That would be >6, right-aligned.",
          c: "The width of 6 pads the text with spaces.",
          d: "<6 is a format instruction, not text to print.",
        },
      },
      {
        id: "ppq18-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-a1-review",
        prompt: "The number of subjects (4) is typed in three places in a program. What is the best improvement?",
        options: [
          { id: "a", text: "Leave it; it works" },
          { id: "b", text: "Store it once in a constant such as SUBJECTS = 4 and use the name everywhere" },
          { id: "c", text: "Write it as four instead of 4" },
          { id: "d", text: "Add a comment next to each 4" },
        ],
        correct: "b",
        explanation: "A single named constant means a change is made in one place and the meaning is clear.",
        whyWrong: {
          a: "It works today, but the next change will miss one of the three.",
          c: "That would be a NameError, and it does not solve the repetition.",
          d: "Comments do not stop the copies from drifting apart.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
