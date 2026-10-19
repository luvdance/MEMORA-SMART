/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 15
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l61-readable-code": {
    lessonId: "pp-l61-readable-code",
    passMark: 70,
    questions: [
      {
        id: "ppq61-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-pep8",
        prompt: "According to PEP 8, how should a class be named?",
        options: [
          { id: "a", text: "CapWords, such as StudentRecord" },
          { id: "b", text: "snake_case, such as student_record" },
          { id: "c", text: "UPPER_CASE, such as STUDENT_RECORD" },
          { id: "d", text: "Any style, as long as it is short" },
        ],
        correct: "a",
        explanation: "Classes use CapWords; functions and variables snake_case; constants UPPER_CASE.",
        whyWrong: {
          b: "snake_case is for functions and variables.",
          c: "UPPER_CASE signals a constant.",
          d: "Consistency with the convention is the point.",
        },
      },
      {
        id: "ppq61-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-naming-docstrings",
        prompt: "Which is the best name for a function that checks whether an email address is valid?",
        options: [
          { id: "a", text: "is_valid_email" },
          { id: "b", text: "check" },
          { id: "c", text: "e" },
          { id: "d", text: "EmailValidCheckerFunction" },
        ],
        correct: "a",
        explanation: "snake_case, starts with a verb-like is_, and says exactly what it answers.",
        whyWrong: {
          b: "Check what? Too vague.",
          c: "A single letter tells the reader nothing.",
          d: "CapWords is for classes, and the name is padded with noise.",
        },
      },
      {
        id: "ppq61-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-refactor-dry",
        prompt: "What is refactoring?",
        options: [
          { id: "a", text: "Improving the structure of code without changing what it does" },
          { id: "b", text: "Adding new features" },
          { id: "c", text: "Deleting the tests" },
          { id: "d", text: "Rewriting the program in another language" },
        ],
        correct: "a",
        explanation: "Behaviour stays the same; readability and structure improve. Tests prove the behaviour did not change.",
        whyWrong: {
          b: "New features change behaviour; that is not refactoring.",
          c: "Tests are what make refactoring safe.",
          d: "That is a rewrite.",
        },
      },
      {
        id: "ppq61-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-separation-concerns",
        prompt: "Why keep calculations in functions that do not call input() or print()?",
        options: [
          { id: "a", text: "They can be tested and reused anywhere, such as in a web app or with data from a file" },
          { id: "b", text: "input() and print() are slow" },
          { id: "c", text: "Python forbids mixing them" },
          { id: "d", text: "It makes no difference" },
        ],
        correct: "a",
        explanation: "Pure functions take data and return results, so any part of a program, or a test, can use them.",
        whyWrong: {
          b: "Speed is not the reason.",
          c: "Python allows it; good design avoids it.",
          d: "It makes code much easier to test and reuse.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l62-git-config": {
    lessonId: "pp-l62-git-config",
    passMark: 70,
    questions: [
      {
        id: "ppq62-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-git",
        prompt: "What is a Git commit?",
        options: [
          { id: "a", text: "A saved snapshot of the project with a message describing the change" },
          { id: "b", text: "A copy of the project emailed to a teammate" },
          { id: "c", text: "A Python keyword" },
          { id: "d", text: "A deleted file" },
        ],
        correct: "a",
        explanation: "Commits build the project's history, which you can inspect or return to.",
        whyWrong: {
          b: "Commits live in the repository, not in email.",
          c: "commit is a Git command, not Python.",
          d: "A commit records changes, including additions.",
        },
      },
      {
        id: "ppq62-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-git",
        prompt: "Why develop a new feature on a branch?",
        options: [
          { id: "a", text: "main stays working while the feature is unfinished, and the branch is merged only when ready" },
          { id: "b", text: "Branches make code run faster" },
          { id: "c", text: "Git requires a branch per file" },
          { id: "d", text: "Branches hide code from GitHub" },
        ],
        correct: "a",
        explanation: "Branches isolate work in progress; merging brings it in when it is ready.",
        whyWrong: {
          b: "Branches do not affect speed.",
          c: "One branch can contain any number of files.",
          d: "Branches can be pushed like anything else.",
        },
      },
      {
        id: "ppq62-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-gitignore-env",
        prompt: "Which should be listed in .gitignore?",
        options: [
          { id: "a", text: ".env and .venv/" },
          { id: "b", text: "main.py" },
          { id: "c", text: "README.md" },
          { id: "d", text: "requirements.txt" },
        ],
        correct: "a",
        explanation: ".env holds secrets and .venv/ is rebuilt from requirements.txt; neither belongs in the repository.",
        whyWrong: {
          b: "Your source code is exactly what Git should track.",
          c: "The README must be committed so others can read it.",
          d: "requirements.txt is how others recreate the environment.",
        },
      },
      {
        id: "ppq62-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-secrets-config",
        prompt: "You accidentally committed and pushed an API key, then deleted it in the next commit. What should you do?",
        options: [
          { id: "a", text: "Revoke the key and issue a new one, because it is still in the Git history and must be treated as leaked" },
          { id: "b", text: "Nothing; the newest commit no longer contains it" },
          { id: "c", text: "Rename the file" },
          { id: "d", text: "Make the repository name harder to guess" },
        ],
        correct: "a",
        explanation: "History keeps every version. Once pushed, assume someone has copied it: revoke it.",
        whyWrong: {
          b: "Anyone can read the earlier commit.",
          c: "The key's value is still in history.",
          d: "Obscurity does not protect a leaked secret.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l63-docs-review-tools": {
    lessonId: "pp-l63-docs-review-tools",
    passMark: 70,
    questions: [
      {
        id: "ppq63-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-readme",
        prompt: "What must a README tell a new developer first?",
        options: [
          { id: "a", text: "What the project does, and how to install and run it" },
          { id: "b", text: "The author's favourite colour" },
          { id: "c", text: "Every line of code explained" },
          { id: "d", text: "Nothing; the code is enough" },
        ],
        correct: "a",
        explanation: "A stranger needs to know what it is and how to get it running before anything else.",
        whyWrong: {
          b: "Irrelevant to using the project.",
          c: "That is what the code and docstrings are for.",
          d: "Code does not explain installation or configuration.",
        },
      },
      {
        id: "ppq63-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-code-review",
        prompt: "What should a code reviewer check FIRST?",
        options: [
          { id: "a", text: "Correctness, including edge cases" },
          { id: "b", text: "Whether they would have used different variable names" },
          { id: "c", text: "The number of lines" },
          { id: "d", text: "Whether the author is senior" },
        ],
        correct: "a",
        explanation: "Code that is wrong is not ready, however tidy. Clarity, tests and style come next.",
        whyWrong: {
          b: "Naming matters, but after correctness.",
          c: "Line count says little about quality.",
          d: "Reviews are about the code, not the person.",
        },
      },
      {
        id: "ppq63-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-static-analysis",
        prompt: "What is the difference between a formatter and a linter?",
        options: [
          { id: "a", text: "A formatter rewrites layout automatically; a linter reports problems such as unused imports and likely bugs" },
          { id: "b", text: "They are identical" },
          { id: "c", text: "A linter runs your program; a formatter compiles it" },
          { id: "d", text: "A formatter deletes comments" },
        ],
        correct: "a",
        explanation: "black or ruff format fix style; ruff check or flake8 find problems. Neither runs the program.",
        whyWrong: {
          b: "They do different jobs.",
          c: "Static analysis never runs the code.",
          d: "Formatters keep comments.",
        },
      },
      {
        id: "ppq63-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-static-analysis",
        prompt: "A linter reports: F401 'os' imported but unused. What should you do?",
        options: [
          { id: "a", text: "Remove the unused import os line" },
          { id: "b", text: "Add a call to os somewhere to silence it" },
          { id: "c", text: "Uninstall Python's os module" },
          { id: "d", text: "Ignore all linter warnings" },
        ],
        correct: "a",
        explanation: "Unused imports are clutter that misleads readers about what the code depends on.",
        whyWrong: {
          b: "Adding pointless code to hide a warning makes things worse.",
          c: "os is part of the standard library; you cannot and should not remove it.",
          d: "Linter warnings point at real problems.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
