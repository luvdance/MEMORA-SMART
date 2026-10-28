/**
 * C++ PROGRAMMING · MODULE 15 · DEBUGGING, TESTING AND SOFTWARE DESIGN
 *
 * Curriculum 15.1 – 15.14. Finding errors systematically and producing
 * reliable programs. Every program is compiled and run by `npm run
 * validate:content`, including the compiler diagnostic the lesson teaches
 * learners to read. Tools that live outside one source file (the VS Code
 * debugger, CMake, Git) are shown as `example` sessions, with the commands
 * exactly as typed.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s15-debugging";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 15.1 – 15.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l62-debugging",
    moduleId: "cp-m15-debugging",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4"],
    title: "Finding Bugs Systematically",
    subtitle: "Kinds of error, compiler diagnostics, breakpoints and stepping",
    estimatedMinutes: 26,
    intro:
      "Every programmer writes bugs; professionals find them quickly because they work methodically instead of guessing. This lesson gives you the method: name the kind of error, read what the tools tell you, and use a debugger to watch the program run line by line.",

    atoms: [
      {
        id: "a-cp-error-kinds",
        title: "Syntax, runtime and logic errors",
        explain:
          "Syntax (compile-time) errors break the language's rules; the compiler finds them and points at them. Runtime errors happen while the program runs: a crash, an exception, a failed file open. Logic errors are the hardest: the program runs to the end and gives a wrong answer. Each kind has its own first move: for syntax errors read the first compiler message; for runtime errors find the last thing that worked; for logic errors find the first value that is wrong.",
        decision: {
          scenario: "A payroll program compiles and runs without any message, but pays everyone exactly 10% too little.",
          question: "What kind of error is this, and what is the best first move?",
          options: [
            {
              id: "a",
              text: "A logic error: work out one employee's pay by hand, then trace or step through the program to find the first value that differs",
              why: "Nothing failed, the answer is just wrong. Comparing with a hand-worked case and finding the first wrong value narrows the search fast.",
            },
            {
              id: "b",
              text: "A syntax error: recompile the program",
              whyWrong: "It compiled cleanly; recompiling will produce the same program.",
            },
            {
              id: "c",
              text: "A runtime error: wrap everything in try/catch",
              whyWrong: "Nothing is thrown; there is nothing to catch.",
            },
            {
              id: "d",
              text: "Rewrite the whole program from scratch",
              whyWrong: "That throws away the working parts and probably reintroduces the bug.",
            },
          ],
          correct: "a",
          aftermath: "Name the kind of error first. It tells you which tool to pick up.",
        },
      },
      {
        id: "a-cp-diagnostics",
        title: "Reading compiler diagnostics",
        explain:
          "A g++ message has a fixed shape: file:line:column: error: description, often followed by a note: with extra context, and a copy of the line with a ^ under the problem. Always fix the FIRST error first: later errors are often consequences of it. Read the description literally; g++ frequently suggests the fix, as in \"did you mean\". Warnings use the same shape with warning: and deserve the same attention.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int i = 1; i <= 3; i++) {
        totl += i;
    }
    cout << total << "\n";
    return 0;
}
`,
          compileError: "error: 'totl' was not declared in this scope; did you mean 'total'?",
        },
        example:
          "The full message:\n\n  sum.cpp: In function 'int main()':\n  sum.cpp:6:9: error: 'totl' was not declared in this scope;\n                      did you mean 'total'?\n      6 |         totl += i;\n        |         ^~~~\n        |         total\n\nsum.cpp            the file\n6:9                line 6, column 9\nerror:             it cannot be built (warning: would still build)\nthe description    what is wrong, and here, the likely fix",
        codeFill: {
          task: "Fix line 6, the line g++ complained about, so the program compiles and prints the total.",
          code: C`#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int i = 1; i <= 3; i++) {
        {{1}}
    }
    cout << total << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["total += i;", "total = total + i;"] }],
          expectedOutput: "6",
          hint: "g++ even told you the name it expected.",
          successMessage: "total += i; One read of the diagnostic, one fix.",
        },
      },
      {
        id: "a-cp-breakpoints",
        title: "Debugging with breakpoints",
        explain:
          "A debugger runs your program under your control. A breakpoint is a line where execution pauses before that line runs. While paused you can see every variable's current value, so instead of guessing what the program is doing, you watch it. In VS Code, click in the margin to the left of a line number to set a red-dot breakpoint, and start debugging with F5. Compile with -g so the executable contains the information the debugger needs (line numbers and variable names).",
        example:
          "1. Build with debugging information:\n\n     g++ -std=c++17 -Wall -Wextra -g payroll.cpp -o payroll\n\n2. In VS Code: open payroll.cpp, click left of line 14 to set\n   a breakpoint (a red dot appears).\n\n3. Press F5 and choose \"C++ (GDB/LLDB)\". The program runs and\n   stops BEFORE line 14 executes.\n\n4. The VARIABLES panel shows every local variable now:\n\n     hours   = 40\n     rate    = 2500\n     pay     = 90000      <- expected 100000: the bug is above\n\n5. Hover over any variable in the editor to see its value too.\n   The WATCH panel lets you type an expression, such as\n   hours * rate, and see it evaluated live.",
        why: "A breakpoint turns \"I think pay is right at this point\" into \"pay is 90000 at this point\". One fact like that is worth twenty guesses.",
      },
      {
        id: "a-cp-stepping",
        title: "Stepping through execution and inspecting variables",
        explain:
          "Once paused, you control execution one step at a time. Step Over (F10) runs the current line and pauses at the next one, treating function calls as single steps. Step Into (F11) goes inside the function being called. Step Out (Shift+F11) finishes the current function and pauses in the caller. Continue (F5) runs to the next breakpoint. Watch the variables change after every step, and stop at the first step where a value is not what you expected: the bug is in that line.",
        table: {
          caption: "Debugger controls in VS Code.",
          headers: ["Action", "Key", "Use it to"],
          rows: [
            ["Continue", "F5", "Run to the next breakpoint"],
            ["Step Over", "F10", "Run one line, without entering functions it calls"],
            ["Step Into", "F11", "Go inside the function called on this line"],
            ["Step Out", "Shift+F11", "Finish this function and return to the caller"],
            ["Stop", "Shift+F5", "End the debugging session"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int discounted(int price) {
    int discount = price / 10;
    return price - discount;
}

int main() {
    int total = 0;
    int prices[] = {2000, 3500, 999};
    for (int p : prices) {
        total += discounted(p);
    }
    cout << total << "\n";
    return 0;
}
`,
          question: "Imagine stepping into discounted() for each price and watching discount. What does the program print?",
          expectedOutput: "5850",
          hint: "discount is price / 10 in whole numbers: 200, 350 and 99. Subtract each and add up the results.",
          successMessage:
            "1800 + 3150 + 900 = 5850. Stepping into discounted would show discount = 99 for 999: integer division silently dropped 0.9 of a naira.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 15.5 – 15.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l63-testing",
    moduleId: "cp-m15-debugging",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.5", "15.6", "15.7"],
    title: "Testing",
    subtitle: "Designing test cases, boundaries and invalid input, assertions and unit tests",
    estimatedMinutes: 26,
    intro:
      "Debugging finds bugs you already know about. Testing finds the ones you do not, ideally before anyone else does. This lesson shows how to choose test cases that actually catch bugs, and how to make the computer run them for you every time the code changes.",

    atoms: [
      {
        id: "a-cp-test-design",
        title: "Designing test cases",
        explain:
          "A test case is an input together with the output you EXPECT, worked out independently of the code: by hand, from the specification, or from a trusted source. Then you run the code and compare. Good test sets cover the typical case, the edges, and the invalid inputs, with each test checking one behaviour so that a failure tells you exactly what broke.",
        table: {
          caption: "Test cases for gradeFor(score), where 70+ is A, 60+ B, 50+ C, otherwise F.",
          headers: ["Kind", "Input", "Expected", "Why this case"],
          rows: [
            ["Typical", "85", "A", "Ordinary A"],
            ["Typical", "55", "C", "Ordinary C"],
            ["Boundary", "70", "A", "Exactly on the A line"],
            ["Boundary", "69", "B", "Just below the A line"],
            ["Boundary", "0", "F", "Lowest valid score"],
            ["Boundary", "100", "A", "Highest valid score"],
            ["Invalid", "-5", "Rejected", "Below the valid range"],
            ["Invalid", "101", "Rejected", "Above the valid range"],
          ],
        },
        why: "The expected column must come from the rules, never from running the code: a test that copies the program's own output can only confirm the bug.",
      },
      {
        id: "a-cp-boundaries",
        title: "Boundary cases and invalid inputs",
        explain:
          "Bugs gather at boundaries: >= written as >, a loop that runs one time too many, an empty list, the largest value an int can hold. For every limit in a rule, test just below, exactly on, and just above it. Then test what should be refused: negative amounts, empty strings, text where a number belongs, a missing file. A program that only works for \"nice\" input is not finished.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

char gradeFor(int score) {
    if (score > 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
}

int main() {
    int tests[] = {85, 70, 69, 50, 49};
    for (int s : tests) cout << s << ":" << gradeFor(s) << " ";
    cout << "\n";
    return 0;
}
`,
          question: "The rule says 70 and above is an A. This code has a bug. What does it actually print?",
          expectedOutput: "85:A 70:B 69:B 50:C 49:F",
          hint: "Look at the first comparison: > 70, not >= 70. What does 70 get?",
          successMessage:
            "70:B is the bug, and only the boundary test caught it: 85 and 69 both come out right. Typical cases alone would have missed it.",
        },
      },
      {
        id: "a-cp-assertions-unit-tests",
        title: "Assertions and basic unit testing",
        explain:
          "assert(condition), from <cassert>, stops the program with a message if the condition is false: use it to state assumptions that must ALWAYS hold inside your own code, such as an index being in range. It is for catching programmer mistakes, not for validating user input, and it is switched off when compiled with -DNDEBUG. A unit test checks one small unit, usually one function, with known inputs and expected outputs; a test runner runs them all and reports the failures. Professional projects use frameworks such as GoogleTest or Catch2; the idea is exactly what the small runner below does.",
        code: {
          language: CPP,
          code: C`#include <cassert>
#include <iostream>
#include <string>
using namespace std;

char gradeFor(int score) {
    assert(score >= 0 && score <= 100);
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
}

int failures = 0;

void check(bool ok, const string& name) {
    cout << (ok ? "PASS " : "FAIL ") << name << "\n";
    if (!ok) failures++;
}

int main() {
    check(gradeFor(85) == 'A', "typical A");
    check(gradeFor(70) == 'A', "boundary: 70 is an A");
    check(gradeFor(69) == 'B', "boundary: 69 is a B");
    check(gradeFor(0) == 'F', "lowest score");
    cout << failures << " failure(s)\n";
    return failures == 0 ? 0 : 1;
}
`,
          expectedOutput: "PASS typical A\nPASS boundary: 70 is an A\nPASS boundary: 69 is a B\nPASS lowest score\n0 failure(s)",
        },
        why: "Run the tests after every change. Returning 1 from main when a test fails lets build tools and CI systems notice automatically. The assert documents and enforces that gradeFor is never given an impossible score by the rest of the program.",
        codeFill: {
          task: "Add a test that checks the boundary at 50: gradeFor(50) must be 'C'.",
          code: C`#include <iostream>
#include <string>
using namespace std;

char gradeFor(int score) {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
}

void check(bool ok, const string& name) {
    cout << (ok ? "PASS " : "FAIL ") << name << "\n";
}

int main() {
    check(gradeFor(49) == 'F', "49 is an F");
    {{1}}
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "check(gradeFor(50) == 'C', \"50 is a C\");"
              ],
              width: 40,
            },
          ],
          expectedOutput: "PASS 49 is an F\nPASS 50 is a C",
          hint: "Copy the shape of the first test: check(condition, \"name\"); with 50, 'C' and the name \"50 is a C\".",
          successMessage: "Both sides of the boundary are now tested: 49 and 50.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 15.8 – 15.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l64-project-structure",
    moduleId: "cp-m15-debugging",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.8", "15.9", "15.10", "15.11"],
    title: "Structuring a Real Project",
    subtitle: "Header and source files, include guards, namespaces and CMake",
    estimatedMinutes: 26,
    intro:
      "Your capstone will be several files, not one. This lesson covers how professional C++ projects are laid out, how headers avoid being included twice, how namespaces prevent name clashes, and how CMake builds the whole thing with one command on any operating system.",

    atoms: [
      {
        id: "a-cp-headers-sources",
        title: "Organising header and source files",
        explain:
          "Each component gets a header (.h or .hpp) that DECLARES what it offers, and a source file (.cpp) that DEFINES how it works. Other files include only the header. Each .cpp file is compiled separately into an object file, and the linker joins them; changing one .cpp rebuilds only that file. Keep headers small: declarations, class definitions and short inline functions, and include in each file only the headers it actually uses.",
        example:
          "A typical capstone layout:\n\n  bank/\n  ├── CMakeLists.txt\n  ├── include/\n  │   ├── Account.h        class Account { ... };  (declarations)\n  │   ├── Bank.h\n  │   └── Storage.h\n  ├── src/\n  │   ├── Account.cpp      Account::deposit(...) { ... }  (definitions)\n  │   ├── Bank.cpp\n  │   ├── Storage.cpp\n  │   └── main.cpp         #include \"Bank.h\"\n  ├── tests/\n  │   └── test_account.cpp\n  └── README.md\n\nBuilding by hand (CMake will do this for you):\n\n  g++ -std=c++17 -Wall -Wextra -Iinclude src/*.cpp -o bank",
        decision: {
          scenario: "A file report.cpp uses only the Account class, but includes Account.h, Bank.h, Storage.h and Menu.h \"just in case\".",
          question: "Why is that a problem?",
          options: [
            {
              id: "a",
              text: "Every unnecessary include slows compilation and makes report.cpp rebuild whenever any of those headers changes, and hides what it really depends on",
              why: "Include what you use: faster builds, fewer needless rebuilds, and dependencies anyone can read at the top of the file.",
            },
            {
              id: "b",
              text: "Including more headers makes the program run slower",
              whyWrong: "Unused declarations do not affect run-time speed; the cost is at build time and in clarity.",
            },
            {
              id: "c",
              text: "There is no problem",
              whyWrong: "In large projects, over-including is a major cause of slow builds.",
            },
            {
              id: "d",
              text: "A file can only include one header",
              whyWrong: "Files can include as many headers as they need.",
            },
          ],
          correct: "a",
          aftermath: "Include what you use, and nothing more.",
        },
      },
      {
        id: "a-cp-header-guards",
        title: "Header guards and #pragma once",
        explain:
          "If a header is included twice in one source file (directly, or through another header), its class would be defined twice, which is a compile error. A header guard prevents that: #ifndef ACCOUNT_H / #define ACCOUNT_H at the top and #endif at the bottom, so the second inclusion sees ACCOUNT_H already defined and skips the contents. #pragma once does the same in one line; it is not in the C++ standard but every major compiler supports it. Every header you write needs one or the other.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

#ifndef POINT_H
#define POINT_H
struct Point {
    int x = 0, y = 0;
};
#endif

#ifndef POINT_H
#define POINT_H
struct Point {
    int x = 0, y = 0;
};
#endif

int main() {
    Point p;
    p.x = 3;
    cout << "Defined once: " << p.x << "\n";
    return 0;
}
`,
          expectedOutput: "Defined once: 3",
        },
        why: "This file simulates including the same header twice: the second copy is skipped because POINT_H is already defined. Remove the guard lines and g++ reports \"redefinition of 'struct Point'\".",
        codeFill: {
          task: "Fill the first line of the guard: only process the header if CONFIG_H has NOT been defined yet.",
          code: C`#include <iostream>
using namespace std;

{{1}}
#define CONFIG_H
constexpr int MAX_STUDENTS = 40;
#endif

int main() {
    cout << MAX_STUDENTS << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["#ifndef CONFIG_H", "#if !defined(CONFIG_H)"] }],
          expectedOutput: "40",
          hint: "The preprocessor directive meaning \"if not defined\", followed by the guard's name.",
          successMessage: "#ifndef CONFIG_H. The trio #ifndef / #define / #endif is the classic include guard.",
        },
      },
      {
        id: "a-cp-namespaces",
        title: "Namespaces, and bringing std:: back",
        explain:
          "Since Week 1 every program in this course has started with using namespace std; so that you could write cout instead of std::cout. Now that your programs are growing into real projects, it is time to look at what that line costs. A namespace groups names so that they cannot clash: the standard library keeps its names in std, and you can put your own project's code in its own namespace, such as namespace bank { ... }, reached as bank::Account. using namespace std; pours ALL of std's names (hundreds of them, including common words such as count, size, distance and move) into your program. In a small learning program that is harmless and convenient. In a large project it invites clashes, and in a header file it is a serious mistake, because it pours those names into every file that includes the header. That is why professional C++ usually writes std:: in full, exactly as you did in your very first programs.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

namespace bank {
    double interest(double balance) { return balance * 0.05; }
}

namespace school {
    double interest(double fees) { return fees * 0.02; }
}

int main() {
    std::cout << bank::interest(10000) << "\n";
    std::cout << school::interest(10000) << "\n";
    using school::interest;
    std::cout << interest(50000) << "\n";
    return 0;
}
`,
          expectedOutput: "500\n200\n1000",
        },
        why: "Two functions called interest coexist because they live in different namespaces. using school::interest; brings in just that one name, a much safer habit than using a whole namespace. Notice the program writes std::cout in full: it has no using namespace std;.",
        decision: {
          scenario: "You are writing Account.h, a header that four other files in your capstone will include.",
          question: "Should Account.h contain using namespace std;?",
          options: [
            {
              id: "a",
              text: "No: write std::string and std::vector in full in headers, so the header does not force every std name onto the files that include it",
              why: "A header's using-directive spreads to every includer, whether they want it or not. In headers, always write std:: in full.",
            },
            {
              id: "b",
              text: "Yes, it saves typing",
              whyWrong: "The typing saved in one file is paid for in name clashes in every file that includes it.",
            },
            {
              id: "c",
              text: "Yes, otherwise the header cannot use strings",
              whyWrong: "It can: std::string works in any header that includes <string>.",
            },
            {
              id: "d",
              text: "It makes no difference either way",
              whyWrong: "It changes which names are visible in every file that includes the header.",
            },
          ],
          correct: "a",
          aftermath: "In small learning programs, using namespace std; is fine. In headers and large projects, write std:: in full.",
        },
      },
      {
        id: "a-cp-namespace-clash",
        title: "A real clash, and the fix",
        explain:
          "Here is the problem using namespace std; can cause. This program has its own global variable called count. But <algorithm> also contains a function called std::count, and the using-directive has brought it in too. When main says count, the compiler cannot tell which one is meant, and refuses. Removing the using-directive and writing std:: in front of the standard names fixes it: count then means only your variable.",
        code: {
          language: CPP,
          code: C`#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int count = 0;

int main() {
    vector<int> v = {1, 2, 3};
    for (int x : v) count += x;
    cout << count << "\n";
    return 0;
}
`,
          compileError: "reference to 'count' is ambiguous",
        },
        codeFill: {
          task: "Here is the fixed program: it has no using namespace std;, so standard names need std:: in front. Fill the gap so it prints the value of count.",
          code: C`#include <algorithm>
#include <iostream>
#include <vector>

int count = 0;

int main() {
    std::vector<int> v = {1, 2, 3};
    for (int x : v) count += x;
    {{1}}
    return 0;
}
`,
          blanks: [
            {
              answers: [
                C`std::cout << count << "\n";`,
                C`std::cout << count << std::endl;`,
                C`std::cout << count << '\n';`,
              ],
              width: 30,
            },
          ],
          expectedOutput: "6",
          hint: "Exactly how you wrote it in your first lesson: std::cout << ... << \"\\n\";",
          successMessage:
            "std::cout, just like your very first program. Without the using-directive, count means only your variable, and the clash is gone.",
        },
      },
      {
        id: "a-cp-cmake",
        title: "Introduction to CMake and build configuration",
        explain:
          "Typing a long g++ command for ten files on every build does not scale, and it differs between Windows, macOS and Linux. CMake is the standard build configuration tool for C++: you describe the project once in CMakeLists.txt (its name, the C++ standard, the source files, the warnings), and CMake generates the right build files for whatever compiler and system it finds. VS Code's CMake Tools extension then builds with one key.",
        example:
          "CMakeLists.txt\n──────────────\ncmake_minimum_required(VERSION 3.16)\nproject(BankSystem LANGUAGES CXX)\n\nset(CMAKE_CXX_STANDARD 17)\nset(CMAKE_CXX_STANDARD_REQUIRED ON)\n\nadd_executable(bank\n    src/main.cpp\n    src/Account.cpp\n    src/Bank.cpp\n    src/Storage.cpp\n)\ntarget_include_directories(bank PRIVATE include)\ntarget_compile_options(bank PRIVATE -Wall -Wextra)\n\nadd_executable(tests tests/test_account.cpp src/Account.cpp)\ntarget_include_directories(tests PRIVATE include)\n\nBuilding, from the project folder:\n\n  > cmake -S . -B build          (configure once)\n  > cmake --build build          (build; repeat after every change)\n  > ./build/bank                 (run; build\\bank.exe on Windows)\n\nOnly changed files are recompiled on each build.",
        decision: {
          scenario: "Your capstone has eight .cpp files and must build on your Windows laptop and on a reviewer's Mac.",
          question: "What is the best way to describe the build?",
          options: [
            {
              id: "a",
              text: "A CMakeLists.txt listing the sources, include folder, C++ standard and warnings; each person runs cmake to generate a build for their own system",
              why: "One description, any platform. The reviewer needs no instructions beyond the two cmake commands.",
            },
            {
              id: "b",
              text: "A long g++ command written in the README",
              whyWrong: "It must be retyped for every build, rebuilds everything every time, and may not work on another system's compiler.",
            },
            {
              id: "c",
              text: "Put all the code in one .cpp file",
              whyWrong: "That throws away the project's structure to avoid learning the tool that supports it.",
            },
            {
              id: "d",
              text: "Send the reviewer your compiled .exe",
              whyWrong: "A Windows executable will not run on a Mac, and a reviewer must be able to build from source.",
            },
          ],
          correct: "a",
          aftermath: "Your capstone will be built with CMake, as real C++ projects are.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 15.12 – 15.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l65-git-quality-security",
    moduleId: "cp-m15-debugging",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.12", "15.13", "15.14"],
    title: "Version Control, Clean Code and Secure Code",
    subtitle: "Git basics, readability and refactoring, secure coding practices",
    estimatedMinutes: 28,
    intro:
      "Three professional habits finish the course's engineering toolkit: keeping every version of your work with Git, rewriting code to be clearer without changing what it does, and writing code that cannot be turned against its users.",

    atoms: [
      {
        id: "a-cp-git",
        title: "Git basics and version control",
        explain:
          "Git records snapshots of your project, called commits, each with a message saying what changed and why. You can see the history, compare versions, and go back if a change breaks something. The daily cycle is: change files, git add them to the next snapshot, git commit with a clear message. Branches let you try a feature without disturbing working code. A .gitignore file keeps build output, such as the build/ folder and .exe files, out of the history. GitHub and similar sites host a copy online, which is also how reviewers will see your capstone.",
        example:
          "> git init                        start tracking this folder\n> git status                      what has changed?\n> git add src/Account.cpp include/Account.h\n> git commit -m \"Add Account with deposit and withdraw\"\n> git log --oneline               the history, one line per commit\n  3f2a1c9 Add Account with deposit and withdraw\n  9b7e0d2 Initial project layout with CMake\n\n> git switch -c feature/transfer  a branch for a new feature\n  ... edit, add, commit ...\n> git switch main\n> git merge feature/transfer      bring the finished feature in\n\n.gitignore\n──────────\nbuild/\n*.exe\n*.o",
        decision: {
          scenario: "You have worked on your capstone all day without committing. A change in the afternoon broke saving, and you cannot remember what you changed.",
          question: "What habit would have made this easy to fix?",
          options: [
            {
              id: "a",
              text: "Small commits after each working step, so git diff shows exactly what changed since saving last worked",
              why: "With frequent commits, the breaking change is in one small, described snapshot, and you can compare or revert it in seconds.",
            },
            {
              id: "b",
              text: "One big commit at the end of each week",
              whyWrong: "A week of changes in one snapshot hides which change broke things.",
            },
            {
              id: "c",
              text: "Saving copies as final.cpp, final2.cpp and final_REAL.cpp",
              whyWrong: "That is version control by hand, without messages, comparisons or reliable history.",
            },
            {
              id: "d",
              text: "Never changing working code",
              whyWrong: "Software must change; version control makes change safe.",
            },
          ],
          correct: "a",
          aftermath: "Commit whenever the program works and does something new. Each commit is a safe point you can return to.",
        },
      },
      {
        id: "a-cp-refactoring",
        title: "Code readability, naming and refactoring",
        explain:
          "Refactoring means improving code's structure without changing its behaviour. Common refactorings: rename unclear names (x, temp2, doIt) to describe their meaning; extract a block into a well-named function; replace a magic number such as 0.075 with a named constant; replace deep nesting with early returns. Refactor in small steps with tests run after each, so you know behaviour has not changed.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

constexpr double VAT_RATE = 0.075;
constexpr double DELIVERY_FREE_FROM = 10000;
constexpr double DELIVERY_FEE = 1500;

double deliveryFee(double subtotal) {
    return subtotal >= DELIVERY_FREE_FROM ? 0 : DELIVERY_FEE;
}

double orderTotal(double subtotal) {
    return subtotal + subtotal * VAT_RATE + deliveryFee(subtotal);
}

int main() {
    cout << orderTotal(8000) << " " << orderTotal(12000) << "\n";
    return 0;
}
`,
          expectedOutput: "10100 12900",
        },
        example:
          "Before refactoring, the same behaviour read like this:\n\n  double f(double x) {\n      double t = x + x * 0.075;\n      if (x < 10000) { t = t + 1500; }\n      return t;\n  }\n\nSame results for every input. But what is 0.075? Why 10000?\nThe refactored version answers both questions with names.",
        codeFill: {
          task: "Refactor: replace the magic number 0.075 inside vat() with the named constant already defined above it.",
          code: C`#include <iostream>
using namespace std;

constexpr double VAT_RATE = 0.075;

double vat(double amount) {
    return amount * {{1}};
}

int main() {
    cout << vat(4000) << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["VAT_RATE"] }],
          expectedOutput: "300",
          hint: "Use the constant's name instead of the raw number.",
          successMessage: "VAT_RATE. Same behaviour, and when the rate changes there is exactly one place to change it.",
        },
      },
      {
        id: "a-cp-secure-coding",
        title: "Introduction to secure coding practices",
        explain:
          "In C++, many security holes are memory bugs: writing past the end of a buffer can let an attacker overwrite other data, and C++ will not stop you. The defences are habits you already have: use string and vector, not raw char arrays; check indexes or use .at(); validate every input for type, range and length; check for integer overflow before arithmetic on untrusted values; never use the size of user input to allocate memory without a limit; and never write secrets such as passwords into code, logs or error messages. Compile with warnings on, and treat them as errors.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <limits>
#include <optional>
#include <string>
using namespace std;

optional<int> safeMultiply(int a, int b) {
    if (a != 0 && (b > numeric_limits<int>::max() / a ||
                   b < numeric_limits<int>::min() / a)) {
        return nullopt;
    }
    return a * b;
}

bool validUsername(const string& name) {
    if (name.size() < 3 || name.size() > 20) return false;
    for (char c : name) {
        bool ok = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_';
        if (!ok) return false;
    }
    return true;
}

int main() {
    cout << safeMultiply(1000, 2000).value_or(-1) << "\n";
    cout << safeMultiply(100000, 100000).value_or(-1) << "\n";
    cout << boolalpha << validUsername("ada_99") << " "
              << validUsername("x'; DROP TABLE users;--") << "\n";
    return 0;
}
`,
          expectedOutput: "2000000\n-1\ntrue false",
        },
        why: "100000 × 100000 does not fit in an int; multiplying anyway is undefined behaviour, and in a payment system it is a vulnerability. The username check uses an allow-list (only these characters are permitted) rather than trying to block every dangerous one, which is the safer design.",
        decision: {
          scenario: "A login program prints \"Wrong password for ada: you typed hunter2\" when a login fails, and logs the same line to a file.",
          question: "What is the security problem?",
          options: [
            {
              id: "a",
              text: "It exposes the typed password on screen and in a log file, where others may read it",
              why: "Secrets must never be printed or logged. A failed login should reveal nothing beyond \"invalid username or password\".",
            },
            {
              id: "b",
              text: "The message is too long",
              whyWrong: "Length is not the issue; its content leaks a secret.",
            },
            {
              id: "c",
              text: "Login programs should not print anything",
              whyWrong: "A short, generic message is fine.",
            },
            {
              id: "d",
              text: "There is no problem, since the password was wrong anyway",
              whyWrong: "Wrong passwords are often near-misses of the real one, or a real password for another site.",
            },
          ],
          correct: "a",
          aftermath: "Treat every secret as radioactive: never print it, log it, or put it in your code.",
        },
      },
    ],

    task: {
      title: "Practical assessment: find, fix and prove",
      intro:
        "Take a faulty program (your instructor will provide one, or swap a deliberately broken version of a mini-project with a classmate) and work through the professional debugging cycle, writing up each step.",
      prompts: [
        "Reproduce the problem: write down the exact input and the exact wrong output, and the output you expected and why.",
        "Classify the error (syntax, runtime or logic) and read every compiler warning with -Wall -Wextra.",
        "Locate the cause: set a breakpoint, step through, and record the first variable whose value differs from what you expected.",
        "Write a test case that fails because of the bug, before fixing anything.",
        "Fix the bug with the smallest correct change, then refactor anything unclear you met on the way.",
        "Prove the fix: run the new test and all earlier tests, including boundary and invalid inputs, and show they pass.",
        "Organise the fixed program into header and source files with include guards, build it with a CMakeLists.txt, and commit each step to Git with a clear message.",
      ],
      closing:
        "Next week is yours: the capstone project, built with every tool from the last fifteen.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
