/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 15 · DEBUGGING, TESTING AND SOFTWARE DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l62-debugging": {
    lessonId: "cp-l62-debugging",
    passMark: 70,
    questions: [
      {
        id: "cpq62-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-diagnostics",
        prompt: "g++ prints twelve errors for a file. Which should you fix first?",
        options: [
          { id: "a", text: "The first one; later errors are often consequences of it" },
          { id: "b", text: "The last one" },
          { id: "c", text: "The shortest message" },
          { id: "d", text: "All at once, by rewriting the file" },
        ],
        correct: "a",
        explanation: "One missing brace or semicolon can confuse the compiler for the rest of the file.",
        whyWrong: {
          b: "The last error is most likely to be a side effect.",
          c: "Length tells you nothing about importance.",
          d: "Rewriting loses working code; fix the first error and recompile.",
        },
      },
      {
        id: "cpq62-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-breakpoints",
        prompt: "When the debugger stops at a breakpoint on line 14, what has happened to line 14?",
        options: [
          { id: "a", text: "It has not run yet; execution paused just before it" },
          { id: "b", text: "It has just finished running" },
          { id: "c", text: "It was skipped" },
          { id: "d", text: "It was deleted" },
        ],
        correct: "a",
        explanation: "A breakpoint pauses before the line executes, so you can inspect the state it starts from.",
        whyWrong: {
          b: "Step Over (F10) would run it.",
          c: "Breakpoints pause; they do not skip.",
          d: "Breakpoints never change the code.",
        },
      },
      {
        id: "cpq62-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-stepping",
        prompt: "You are paused on a line that calls calculateTax(). You want to see what happens INSIDE that function. Which command?",
        options: [
          { id: "a", text: "Step Into (F11)" },
          { id: "b", text: "Step Over (F10)" },
          { id: "c", text: "Step Out (Shift+F11)" },
          { id: "d", text: "Stop (Shift+F5)" },
        ],
        correct: "a",
        explanation: "Step Into enters the called function and pauses at its first line.",
        whyWrong: {
          b: "Step Over runs the whole call as one step.",
          c: "Step Out finishes the current function.",
          d: "Stop ends debugging altogether.",
        },
      },
      {
        id: "cpq62-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-breakpoints",
        prompt: "Which g++ option includes the information a debugger needs, such as line numbers and variable names?",
        options: [
          { id: "a", text: "-g" },
          { id: "b", text: "-o" },
          { id: "c", text: "-Wall" },
          { id: "d", text: "-std=c++17" },
        ],
        correct: "a",
        explanation: "-g adds debugging information to the executable.",
        whyWrong: {
          b: "-o names the output file.",
          c: "-Wall enables warnings.",
          d: "-std chooses the language standard.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l63-testing": {
    lessonId: "cp-l63-testing",
    passMark: 70,
    questions: [
      {
        id: "cpq63-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-test-design",
        prompt: "Where should a test's expected output come from?",
        options: [
          { id: "a", text: "From the rules or a hand calculation, independently of the code" },
          { id: "b", text: "From running the code and copying what it prints" },
          { id: "c", text: "From whatever looks reasonable" },
          { id: "d", text: "Tests do not need expected outputs" },
        ],
        correct: "a",
        explanation: "A test that copies the program's output can only confirm what the program already does, bugs included.",
        whyWrong: {
          b: "That would make the bug part of the expected result.",
          c: "\"Reasonable\" values hide exactly the subtle bugs tests exist to catch.",
          d: "Without an expected output, nothing is being checked.",
        },
      },
      {
        id: "cpq63-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-boundaries",
        prompt: "A rule says orders of 10,000 naira or more get free delivery. Which set of test amounts is best?",
        options: [
          { id: "a", text: "9,999, 10,000 and 10,001, plus 0 and a negative amount" },
          { id: "b", text: "5,000 and 50,000" },
          { id: "c", text: "10,000 only" },
          { id: "d", text: "Random amounts" },
        ],
        correct: "a",
        explanation: "Just below, on, and just above the boundary catch > versus >= mistakes; 0 and negatives test invalid input.",
        whyWrong: {
          b: "Both are far from the boundary, so >= written as > would pass.",
          c: "One side of the boundary is not enough.",
          d: "Random values rarely hit the exact boundary.",
        },
      },
      {
        id: "cpq63-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-assertions-unit-tests",
        prompt: "Should assert be used to check that a user typed a valid age?",
        options: [
          { id: "a", text: "No: assert catches programmer mistakes, can be compiled out, and crashes; user input needs proper validation" },
          { id: "b", text: "Yes, it is the standard way to validate input" },
          { id: "c", text: "Yes, but only for numbers" },
          { id: "d", text: "No, because assert does not work with ints" },
        ],
        correct: "a",
        explanation: "Invalid user input is expected; the program must respond gracefully, not abort.",
        whyWrong: {
          b: "assert is for conditions that should be impossible if the code is correct.",
          c: "The kind of data does not change that.",
          d: "assert works with any condition.",
        },
      },
      {
        id: "cpq63-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-assertions-unit-tests",
        prompt: "What is a unit test?",
        options: [
          { id: "a", text: "An automated check of one small unit, such as one function, with known inputs and expected outputs" },
          { id: "b", text: "Running the whole program once by hand" },
          { id: "c", text: "A test of the computer's hardware" },
          { id: "d", text: "A compiler warning" },
        ],
        correct: "a",
        explanation: "Small, automated and repeatable: run them after every change.",
        whyWrong: {
          b: "Manual whole-program runs are slow and not repeatable.",
          c: "It tests code, not hardware.",
          d: "Warnings come from the compiler, not tests.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l64-project-structure": {
    lessonId: "cp-l64-project-structure",
    passMark: 70,
    questions: [
      {
        id: "cpq64-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-header-guards",
        prompt: "What problem do header guards (or #pragma once) prevent?",
        options: [
          { id: "a", text: "A header's contents being defined twice when it is included more than once" },
          { id: "b", text: "Programs running too slowly" },
          { id: "c", text: "Viruses in header files" },
          { id: "d", text: "Missing semicolons" },
        ],
        correct: "a",
        explanation: "The second inclusion is skipped, so classes are not redefined.",
        whyWrong: {
          b: "They affect compilation correctness, not speed at run time.",
          c: "They are unrelated to security.",
          d: "They do not fix syntax errors.",
        },
      },
      {
        id: "cpq64-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-namespaces",
        prompt: "Why is using namespace std; in a header file a bad idea?",
        options: [
          { id: "a", text: "It pours every std name into every file that includes the header, inviting name clashes" },
          { id: "b", text: "It makes cout stop working" },
          { id: "c", text: "Headers cannot contain using" },
          { id: "d", text: "It slows the program down" },
        ],
        correct: "a",
        explanation: "Every includer is affected, whether they wanted it or not.",
        whyWrong: {
          b: "cout keeps working; the problem is clashes.",
          c: "It is allowed, just harmful.",
          d: "It has no run-time cost.",
        },
      },
      {
        id: "cpq64-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-headers-sources",
        prompt: "In a well-organised project, what do other files include to use the Account class?",
        options: [
          { id: "a", text: "Account.h, the header" },
          { id: "b", text: "Account.cpp, the source file" },
          { id: "c", text: "Both, always" },
          { id: "d", text: "Nothing; classes are global" },
        ],
        correct: "a",
        explanation: "The header declares the class; the linker connects the definitions compiled from Account.cpp.",
        whyWrong: {
          b: "Including a .cpp would define its functions in several files: linker errors.",
          c: "Only the header is included.",
          d: "A class must be declared before it is used in each file.",
        },
      },
      {
        id: "cpq64-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-cmake",
        prompt: "What does CMake do?",
        options: [
          { id: "a", text: "Reads a project description (CMakeLists.txt) and generates build files for the compiler and system it finds" },
          { id: "b", text: "Compiles C++ itself, replacing g++" },
          { id: "c", text: "Stores the project's history" },
          { id: "d", text: "Tests the program automatically" },
        ],
        correct: "a",
        explanation: "CMake is a build configuration tool; the actual compiling is still done by g++ or another compiler.",
        whyWrong: {
          b: "CMake drives the compiler; it is not one.",
          c: "That is Git.",
          d: "It can register tests, but its job is configuring builds.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l65-git-quality-security": {
    lessonId: "cp-l65-git-quality-security",
    passMark: 70,
    questions: [
      {
        id: "cpq65-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-git",
        prompt: "What is a Git commit?",
        options: [
          { id: "a", text: "A recorded snapshot of the project, with a message describing the change" },
          { id: "b", text: "A compiled executable" },
          { id: "c", text: "A backup to a USB drive" },
          { id: "d", text: "A comment in the code" },
        ],
        correct: "a",
        explanation: "Commits form the project's history, which you can inspect, compare and return to.",
        whyWrong: {
          b: "Build output is usually excluded from Git with .gitignore.",
          c: "Git keeps history in the repository, locally and on a remote.",
          d: "Comments live in the code; commit messages describe changes.",
        },
      },
      {
        id: "cpq65-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-refactoring",
        prompt: "What is refactoring?",
        options: [
          { id: "a", text: "Improving code's structure and clarity without changing its behaviour" },
          { id: "b", text: "Adding new features" },
          { id: "c", text: "Fixing compile errors" },
          { id: "d", text: "Rewriting the program in another language" },
        ],
        correct: "a",
        explanation: "Same behaviour, better structure, with tests run after each small step to prove it.",
        whyWrong: {
          b: "New features change behaviour; refactoring does not.",
          c: "Fixing errors is debugging.",
          d: "That is a rewrite, not a refactoring.",
        },
      },
      {
        id: "cpq65-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-secure-coding",
        prompt: "char name[16]; is filled by copying whatever the user typed, with no length check. What is the risk?",
        options: [
          { id: "a", text: "A buffer overflow: longer input writes past the array, corrupting memory and possibly letting an attacker control the program" },
          { id: "b", text: "Long names are shortened automatically" },
          { id: "c", text: "There is no risk with char arrays" },
          { id: "d", text: "The program becomes slower" },
        ],
        correct: "a",
        explanation: "C++ does not check array bounds. Use std::string and validate lengths.",
        whyWrong: {
          b: "Nothing truncates the copy; it overflows.",
          c: "Unchecked char buffers are a classic source of security holes.",
          d: "The danger is corruption and exploitation, not speed.",
        },
      },
      {
        id: "cpq65-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-secure-coding",
        prompt: "Why is an allow-list (only these characters are permitted) safer than a block-list for validating a username?",
        options: [
          { id: "a", text: "Anything not explicitly allowed is rejected, so an attacker cannot use a character you forgot to block" },
          { id: "b", text: "Allow-lists are faster to type" },
          { id: "c", text: "Block-lists do not compile" },
          { id: "d", text: "They are equally safe" },
        ],
        correct: "a",
        explanation: "With a block-list, every forgotten dangerous input is a hole; with an allow-list, unknown input fails safe.",
        whyWrong: {
          b: "Typing speed is irrelevant.",
          c: "Both compile; one is safer.",
          d: "An allow-list fails safe; a block-list fails open.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
