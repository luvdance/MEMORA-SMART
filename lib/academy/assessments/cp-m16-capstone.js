/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 16 · CAPSTONE PROJECT AND FINAL ASSESSMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l66-capstone-plan": {
    lessonId: "cp-l66-capstone-plan",
    passMark: 70,
    questions: [
      {
        id: "cpq66-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-requirements",
        prompt: "Which is the best-written requirement?",
        options: [
          { id: "a", text: "A deposit of zero or less is refused with a message, and the balance is unchanged" },
          { id: "b", text: "Deposits should work well" },
          { id: "c", text: "The system is user-friendly" },
          { id: "d", text: "Handle money properly" },
        ],
        correct: "a",
        explanation: "It is precise and checkable: it turns directly into a test.",
        whyWrong: {
          b: "\"Well\" cannot be tested.",
          c: "Friendliness is not checkable as written.",
          d: "\"Properly\" means different things to different people.",
        },
      },
      {
        id: "cpq66-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-capstone-choice",
        prompt: "With limited time, which approach to the capstone is most likely to succeed?",
        options: [
          { id: "a", text: "A focused scope, completed with tests, documentation and a clear presentation" },
          { id: "b", text: "The largest possible scope, hoping to finish" },
          { id: "c", text: "Skipping planning to start coding sooner" },
          { id: "d", text: "Copying a complete project from the internet" },
        ],
        correct: "a",
        explanation: "A finished, tested and explained project demonstrates competence; an unfinished one does not.",
        whyWrong: {
          b: "Over-scoping is the most common reason capstones fail.",
          c: "Planning saves far more time than it costs.",
          d: "You must understand and defend every line.",
        },
      },
      {
        id: "cpq66-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-capstone-design",
        prompt: "In the Project A design, why is Storage the only class that reads and writes files?",
        options: [
          { id: "a", text: "Single responsibility: the file format lives in one place, so changing it does not touch the banking rules" },
          { id: "b", text: "Only one class is allowed to use fstream" },
          { id: "c", text: "It makes the program faster" },
          { id: "d", text: "Account cannot include <fstream>" },
        ],
        correct: "a",
        explanation: "Separating persistence from business rules keeps each class small and changes contained.",
        whyWrong: {
          b: "Any class may use fstream; it is a design choice.",
          c: "The benefit is maintainability, not speed.",
          d: "It could; the design keeps it out deliberately.",
        },
      },
      {
        id: "cpq66-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-capstone-design",
        prompt: "What should be decided BEFORE writing the capstone's code?",
        options: [
          { id: "a", text: "The requirements, the classes and their relationships, the file layout and the data format" },
          { id: "b", text: "Only the program's name" },
          { id: "c", text: "Nothing; design emerges from the code" },
          { id: "d", text: "The colour scheme of the console" },
        ],
        correct: "a",
        explanation: "A short plan prevents rewriting large parts of the program later.",
        whyWrong: {
          b: "A name says nothing about how the program works.",
          c: "Unplanned code in a project this size usually needs heavy rework.",
          d: "That is cosmetic, not design.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l67-capstone-build": {
    lessonId: "cp-l67-capstone-build",
    passMark: 70,
    questions: [
      {
        id: "cpq67-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-incremental",
        prompt: "What does building incrementally mean?",
        options: [
          { id: "a", text: "Adding one small working slice at a time, compiling, testing and committing after each" },
          { id: "b", text: "Writing the whole program, then testing it once at the end" },
          { id: "c", text: "Building only the user interface first" },
          { id: "d", text: "Increasing the version number every day" },
        ],
        correct: "a",
        explanation: "When a small step breaks something, the cause is easy to find.",
        whyWrong: {
          b: "Then any failure could be anywhere in the program.",
          c: "A menu with no working logic behind it proves nothing.",
          d: "Version numbers are unrelated to how code is built.",
        },
      },
      {
        id: "cpq67-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-incremental",
        prompt: "Why name tests after the requirements they prove, such as \"R3 overdraft refused, balance unchanged\"?",
        options: [
          { id: "a", text: "The test output then shows which requirements are met, and a failure points straight at the broken requirement" },
          { id: "b", text: "Long names make tests run faster" },
          { id: "c", text: "The compiler requires it" },
          { id: "d", text: "It has no benefit" },
        ],
        correct: "a",
        explanation: "Traceable tests are evidence for reviewers and a diagnosis tool for you.",
        whyWrong: {
          b: "Names do not affect speed.",
          c: "The compiler does not care about test names.",
          d: "It links tests to purpose, which is a real benefit.",
        },
      },
      {
        id: "cpq67-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-capstone-persistence",
        prompt: "What is a round-trip test for persistence?",
        options: [
          { id: "a", text: "Save known data, load it back into a fresh object, and check every field matches" },
          { id: "b", text: "Opening and closing the program twice" },
          { id: "c", text: "Sending the file by email and back" },
          { id: "d", text: "Saving the file twice" },
        ],
        correct: "a",
        explanation: "It proves the save format and the load code agree.",
        whyWrong: {
          b: "That exercises the program but checks nothing specific.",
          c: "That tests email, not your code.",
          d: "Saving twice never checks that loading works.",
        },
      },
      {
        id: "cpq67-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-documentation",
        prompt: "What must a capstone README let a stranger do?",
        options: [
          { id: "a", text: "Understand what the project does, build it, run it and its tests, and see its design and limitations, without asking you" },
          { id: "b", text: "Read the full source code" },
          { id: "c", text: "Only see the project's name" },
          { id: "d", text: "Contact you for instructions" },
        ],
        correct: "a",
        explanation: "A README is the project's front door.",
        whyWrong: {
          b: "The code is in the repository; the README explains it.",
          c: "A name alone explains nothing.",
          d: "The point is that they should not need to.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l68-final-prep": {
    lessonId: "cp-l68-final-prep",
    passMark: 70,
    questions: [
      {
        id: "cpq68-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-exam-format",
        prompt: "What does it take to pass the C++ certification exam?",
        options: [
          { id: "a", text: "70% overall and at least 50% in every one of the five sections" },
          { id: "b", text: "50% overall" },
          { id: "c", text: "70% in any one section" },
          { id: "d", text: "Answering every question" },
        ],
        correct: "a",
        explanation: "The overall mark and the per-section minimum must both be met.",
        whyWrong: {
          b: "The overall pass mark is 70%.",
          c: "Every section counts towards the overall mark, and each has a 50% minimum.",
          d: "Correctness, not completion, is marked.",
        },
      },
      {
        id: "cpq68-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-review-predict",
        prompt: "int total = 214;\nstd::cout << total / 3 << \" \" << total / 3.0;\n\nWith default formatting, what is printed?",
        options: [
          { id: "a", text: "71 71.3333" },
          { id: "b", text: "71.3333 71.3333" },
          { id: "c", text: "71 71" },
          { id: "d", text: "72 71.3333" },
        ],
        correct: "a",
        explanation: "214 / 3 is integer division (71); 214 / 3.0 is decimal, shown to 6 significant digits.",
        whyWrong: {
          b: "The first division is between two ints.",
          c: "3.0 makes the second division keep its decimals.",
          d: "Integer division truncates; it never rounds up.",
        },
      },
      {
        id: "cpq68-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-review-fill",
        prompt: "In std::vector<std::unique_ptr<Shape>>, why must Shape have a virtual destructor?",
        options: [
          { id: "a", text: "Each unique_ptr<Shape> deletes a derived object through a base pointer, which needs a virtual destructor to be correct" },
          { id: "b", text: "vector requires every element to have one" },
          { id: "c", text: "unique_ptr cannot hold classes without one" },
          { id: "d", text: "It is optional decoration" },
        ],
        correct: "a",
        explanation: "Without it, deleting a Circle through a Shape* runs only ~Shape: undefined behaviour.",
        whyWrong: {
          b: "vector has no such rule.",
          c: "It compiles without one; that is the danger.",
          d: "It is essential for polymorphic deletion.",
        },
      },
      {
        id: "cpq68-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-revision-plan",
        prompt: "Which revision method builds the most exam-ready skill?",
        options: [
          { id: "a", text: "Redoing practices and rebuilding mini-projects from blank files, starting with the weakest phase" },
          { id: "b", text: "Rereading all the lessons quickly" },
          { id: "c", text: "Memorising answers to practice questions" },
          { id: "d", text: "Revising only the strongest phase" },
        ],
        correct: "a",
        explanation: "Active practice on the weakest area raises the score that matters most under the per-section rule.",
        whyWrong: {
          b: "Passive rereading builds little skill.",
          c: "The exam uses different questions.",
          d: "The weakest section decides whether you pass.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
