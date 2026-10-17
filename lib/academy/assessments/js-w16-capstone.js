/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 16
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l60-capstone-scope": {
    lessonId: "js-l60-capstone-scope",
    passMark: 70,
    questions: [
      {
        id: "jsq60-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-scoping",
        prompt: "What is a minimum viable product?",
        options: [
          { id: "a", text: "The simplest possible app, however unhelpful" },
          { id: "b", text: "The smallest set of features a real user would find genuinely useful, built completely" },
          { id: "c", text: "Every feature you can think of" },
          { id: "d", text: "A design mock-up with no code" },
        ],
        correct: "b",
        explanation: "An MVP is small but complete and useful. Extras wait until it is finished.",
        whyWrong: {
          a: "It still has to be useful; that is the \"viable\" part.",
          c: "That is the opposite of minimum, and rarely gets finished.",
          d: "An MVP is working software.",
        },
      },
      {
        id: "jsq60-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-capstone-options",
        prompt: "Which requirement applies to every capstone option?",
        options: [
          { id: "a", text: "User accounts with login" },
          { id: "b", text: "Form validation, error states, a GitHub history and a deployed version" },
          { id: "c", text: "A pie chart" },
          { id: "d", text: "A paid API" },
        ],
        correct: "b",
        explanation: "The data differs by option, but the standard is the same: working interface, data handling, validation, error states, version control and deployment.",
        whyWrong: {
          a: "Accounts need a back end and are not required.",
          c: "Only the expense tracker suggests charts.",
          d: "A paid API would also need a secret key on a server; free APIs are fine.",
        },
      },
      {
        id: "jsq60-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-data-model",
        prompt: "Why design and test the model classes before building the interface?",
        options: [
          { id: "a", text: "Interfaces cannot be built without classes" },
          { id: "b", text: "So the rules and data are proven correct, and every screen built on them starts from correct data" },
          { id: "c", text: "Because classes are required by React" },
          { id: "d", text: "To make the app load faster" },
        ],
        correct: "b",
        explanation: "A tested model means interface bugs are only about display, not about wrong totals or invalid data.",
        whyWrong: {
          a: "Interfaces can be built on plain objects; the order is about correctness.",
          c: "React does not require classes for your data.",
          d: "Load time is unaffected by the order you build in.",
        },
      },
      {
        id: "jsq60-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-model-practice",
        prompt: "A constructor checks if (!(amount > 0)). Someone passes the string \"500\". What happens, and what is the fix?",
        options: [
          { id: "a", text: "It is rejected; no fix needed" },
          { id: "b", text: "It is accepted, because \"500\" > 0 is true after conversion. Add typeof amount === \"number\"" },
          { id: "c", text: "It throws a TypeError" },
          { id: "d", text: "It is converted to a number automatically and stored as 500" },
        ],
        correct: "b",
        explanation: "Comparison converts the string, so the check passes and the string is stored, to be joined rather than added later.",
        whyWrong: {
          a: "The comparison converts \"500\" to 500, which is greater than 0.",
          c: "Comparisons do not throw for strings.",
          d: "The comparison converts a copy; the stored value is still the string.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l61-capstone-build": {
    lessonId: "js-l61-capstone-build",
    passMark: 70,
    questions: [
      {
        id: "jsq61-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-build-order",
        prompt: "What does building in vertical slices mean?",
        options: [
          { id: "a", text: "Building all the screens first, then all the logic" },
          { id: "b", text: "Building one complete feature at a time, from model to screen to storage, and committing it working" },
          { id: "c", text: "Building the app for narrow screens only" },
          { id: "d", text: "Writing all the tests last" },
        ],
        correct: "b",
        explanation: "Each slice is a finished, working feature, so at any point the app works and does a little more than before.",
        whyWrong: {
          a: "That is horizontal layering, which leaves nothing working until the end.",
          c: "It is about order of work, not screen width.",
          d: "Tests belong with each slice, not at the end.",
        },
      },
      {
        id: "jsq61-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-data-handling",
        prompt: "Why calculate a monthly total from the expenses each time instead of storing it?",
        options: [
          { id: "a", text: "Storing numbers is not allowed" },
          { id: "b", text: "A stored total can fall out of date when an expense changes; a calculated one never can" },
          { id: "c", text: "Calculation is always faster than reading" },
          { id: "d", text: "localStorage cannot hold numbers" },
        ],
        correct: "b",
        explanation: "Derived data should be derived. One source of truth means no figure can disagree with the data it summarises.",
        whyWrong: {
          a: "You can store anything; the risk is inconsistency.",
          c: "Speed is not the reason; correctness is.",
          d: "It stores strings, which can hold numbers as JSON, but that is not the point.",
        },
      },
      {
        id: "jsq61-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-validation-states",
        prompt: "What should a capstone show on a user's very first visit, before any data exists?",
        options: [
          { id: "a", text: "A blank area" },
          { id: "b", text: "An empty state with a friendly message and the obvious first action" },
          { id: "c", text: "An error" },
          { id: "d", text: "A loading spinner" },
        ],
        correct: "b",
        explanation: "Empty is a real state. It should say there is nothing yet and offer the first step.",
        whyWrong: {
          a: "A blank area looks broken.",
          c: "Nothing has failed.",
          d: "Nothing is loading.",
        },
      },
      {
        id: "jsq61-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-state-machine",
        prompt: "A screen uses isLoading and hasError booleans, and a bug leaves both true. What design prevents this?",
        options: [
          { id: "a", text: "Adding a third boolean" },
          { id: "b", text: "A single status field with fixed values and allowed transitions" },
          { id: "c", text: "Checking the booleans more often" },
          { id: "d", text: "Removing the error state" },
        ],
        correct: "b",
        explanation: "One status value can only be one thing at a time, so contradictory combinations cannot exist.",
        whyWrong: {
          a: "More booleans allow more contradictions.",
          c: "Checking does not stop the contradiction being stored.",
          d: "Errors still happen; they just would not be shown.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l62-capstone-ship": {
    lessonId: "js-l62-capstone-ship",
    passMark: 70,
    questions: [
      {
        id: "jsq62-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-repo-quality",
        prompt: "What should be at the top of a capstone README?",
        options: [
          { id: "a", text: "The full source code" },
          { id: "b", text: "The project name, a one-line description and the live link" },
          { id: "c", text: "Your exam results" },
          { id: "d", text: "Nothing; READMEs are optional" },
        ],
        correct: "b",
        explanation: "A visitor's first questions are what it is and where to see it. Answer them in the first lines.",
        whyWrong: {
          a: "The code is in the repository; the README explains it.",
          c: "Irrelevant to the project.",
          d: "The README is a required deliverable.",
        },
      },
      {
        id: "jsq62-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-repo-quality",
        prompt: "Which of these must NOT be in the capstone repository?",
        options: [
          { id: "a", text: "package.json" },
          { id: "b", text: "node_modules and any .env file with real secrets" },
          { id: "c", text: "README.md" },
          { id: "d", text: "Your tests" },
        ],
        correct: "b",
        explanation: "node_modules is recreated by npm install, and secrets in Git are leaked permanently.",
        whyWrong: {
          a: "package.json is how others install the project.",
          c: "The README is required.",
          d: "Tests belong in the repository.",
        },
      },
      {
        id: "jsq62-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-final-checks",
        prompt: "Which version of the app should you test before submitting?",
        options: [
          { id: "a", text: "Only the one on your laptop" },
          { id: "b", text: "The deployed version at its public URL, on a phone and a computer" },
          { id: "c", text: "Neither; the tests are enough" },
          { id: "d", text: "A screenshot" },
        ],
        correct: "b",
        explanation: "The deployed version is what is assessed, and it differs from your laptop: no .env, no cached data, real routing.",
        whyWrong: {
          a: "Your laptop hides deployment-only bugs.",
          c: "Unit tests do not cover routing, layout or configuration on the host.",
          d: "A screenshot cannot be used.",
        },
      },
      {
        id: "jsq62-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-defending",
        prompt: "In your walkthrough, what best demonstrates that you understand your code?",
        options: [
          { id: "a", text: "Scrolling through every file" },
          { id: "b", text: "Explaining one design decision and the alternative you rejected, and one bug you found and fixed" },
          { id: "c", text: "Listing the libraries you used" },
          { id: "d", text: "Saying how long it took" },
        ],
        correct: "b",
        explanation: "Trade-offs and debugging stories show reasoning, which is what assessors and interviewers are looking for.",
        whyWrong: {
          a: "Showing code is not the same as explaining it.",
          c: "A list says what you used, not why.",
          d: "Time spent does not show understanding.",
        },
      },
    ],
  },
};
