/**
 * C++ PROGRAMMING · MODULE 5 · FUNCTIONS AND MODULAR PROGRAMMING
 *
 * Curriculum 5.1 – 5.13. Move from long programs to reusable, understandable
 * components. Every program is compiled and run by `npm run
 * validate:content`, including the two that fail to build on purpose: one
 * at compile time (no declaration) and one at link time (no definition),
 * because those two messages confuse every beginner the first time.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s5-functions";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l20-functions-intro",
    moduleId: "cp-m5-functions",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Why Functions Exist",
    subtitle: "Declaring, defining and calling a function",
    estimatedMinutes: 18,
    intro:
      "Your Phase 1 programs lived entirely inside main, and the bigger ones were getting long. Real programs are built from functions: named, reusable pieces that each do one job. main itself is a function, the one the operating system calls. This week you write your own.",

    atoms: [
      {
        id: "a-cp-why-functions",
        title: "Why functions exist",
        explain:
          "A function is a named block of code that does one job and can be run (called) whenever it is needed. Functions exist for four reasons. Reuse: write the code once, call it many times. Readability: printReport(); says what happens without showing how. Testing: a small function can be checked on its own. Change: fix or improve the code in one place and every call benefits.",
        analogy:
          "A recipe card. Instead of writing out \"how to make pepper sauce\" in full every time a meal needs it, the cookbook says \"see pepper sauce, page 12\". The card is written once and used by every recipe that needs it.",
        decision: {
          scenario:
            "Your program prints the same 40-character line of dashes in seven different places. A teammate asks you to make the line 60 characters long.",
          question: "Which design makes that change easiest and safest?",
          options: [
            {
              id: "a",
              text: "A function printLine() that prints the dashes, called in all seven places",
              why: "The change happens once, inside printLine, and every call is updated. With seven copies you would have to find and edit all seven, and missing one is a bug.",
            },
            {
              id: "b",
              text: "Seven copies of the cout statement, edited one by one",
              whyWrong: "It works until someone misses a copy. Repeated code is repeated work and repeated risk.",
            },
            {
              id: "c",
              text: "One very long cout at the end of the program",
              whyWrong: "The lines must appear in seven different places in the output; one statement cannot do that.",
            },
            {
              id: "d",
              text: "Remove the lines to avoid the problem",
              whyWrong: "The output needs them. The problem is how the code is organised, not the lines themselves.",
            },
          ],
          correct: "a",
          aftermath: "Don't Repeat Yourself (DRY): when you notice you are copying code, it probably wants to be a function.",
        },
      },
      {
        id: "a-cp-define-function",
        title: "Declaring and defining a function",
        explain:
          "A function definition has four parts: the return type (what kind of value it gives back, or void for nothing), the name, the parameter list in brackets (the values it needs, possibly none), and the body in braces. The first line on its own, ending in a semicolon, is called a declaration: it tells the compiler the function exists. The definition adds the body. A function must be declared before the code that calls it.",
        table: {
          caption: "The parts of int square(int n) { return n * n; }",
          headers: ["Part", "In the example", "Meaning"],
          rows: [
            ["Return type", "int", "The function gives back a whole number"],
            ["Name", "square", "What callers write to use it"],
            ["Parameters", "(int n)", "It needs one int, called n inside the function"],
            ["Body", "{ return n * n; }", "The work, and the value handed back"],
          ],
        },
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

void printLine() {
    cout << "----------------\n";
}

int main() {
    printLine();
    cout << "  RESULT SLIP\n";
    printLine();
    return 0;
}
`,
          expectedOutput: "----------------\n  RESULT SLIP\n----------------",
        },
        codeFill: {
          task: "Fill in the first line of the definition: a function called printStars that takes nothing and returns nothing.",
          code: C`#include <iostream>
using namespace std;

{{1}} {
    cout << "**********\n";
}

int main() {
    printStars();
    cout << "Welcome\n";
    printStars();
    return 0;
}
`,
          blanks: [{ answers: ["void printStars()", "void printStars(void)"], width: 18 }],
          expectedOutput: "**********\nWelcome\n**********",
          hint: "Return type first (the one meaning \"nothing\"), then the name, then empty brackets.",
          successMessage: "void printStars(). It gives nothing back, needs nothing, and can be called as often as you like.",
        },
      },
      {
        id: "a-cp-call-function",
        title: "Calling a function: where execution goes",
        explain:
          "Calling a function, printLine();, makes execution jump to the start of the function's body, run it, and then return to the point just after the call. The caller waits while the function runs. Functions can call other functions, and the same jump-and-return happens at every level.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

void second() {
    cout << "B\n";
}

void first() {
    cout << "A\n";
    second();
    cout << "C\n";
}

int main() {
    cout << "Start\n";
    first();
    second();
    cout << "End\n";
    return 0;
}
`,
          question: "Follow execution into each function and back out again. What does this print?",
          expectedOutput: "Start\nA\nB\nC\nB\nEnd",
          hint: "first() prints A, calls second() (B), then carries on with C. Back in main, second() is called again.",
          successMessage:
            "Start, A, B, C, B, End. The order of the definitions in the file does not matter; the order of the calls does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 5.4 – 5.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l21-params-return",
    moduleId: "cp-m5-functions",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6", "5.7"],
    title: "Parameters, Return Values and Scope",
    subtitle: "Giving functions data, getting answers back, and prototypes",
    estimatedMinutes: 24,
    intro:
      "A function that prints the same dashes every time is useful, but a function that takes values and hands back an answer is what programs are really built from. This lesson covers passing values in, returning results, where variables live, and how to call a function defined further down the file.",

    atoms: [
      {
        id: "a-cp-params-args",
        title: "Parameters and arguments",
        explain:
          "A parameter is a variable in the function's definition that receives a value: in void greet(string name, int age), name and age are parameters. An argument is the actual value you pass when you call it: greet(\"Ada\", 19). Arguments are matched to parameters by position, so they must come in the same order and have compatible types.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

void greet(string name, int age) {
    cout << "Hello " << name << ", you are " << age << ".\n";
}

int main() {
    greet("Ada", 19);
    greet("Tunde", 23);
    return 0;
}
`,
          expectedOutput: "Hello Ada, you are 19.\nHello Tunde, you are 23.",
        },
        mistake:
          "greet(19, \"Ada\"); with the arguments in the wrong order. The compiler rejects it here, because 19 cannot become a string; but if both parameters were ints, swapped arguments would compile and silently give wrong results.",
        codeFill: {
          task: "Call printReceipt so it prints a receipt for 3 items at 1500 naira each. Fill the arguments in the order the parameters are listed.",
          code: C`#include <iostream>
using namespace std;

void printReceipt(int quantity, int unitPrice) {
    cout << quantity << " x " << unitPrice << " = " << quantity * unitPrice << "\n";
}

int main() {
    printReceipt({{1}});
    return 0;
}
`,
          blanks: [{ answers: ["3, 1500"] }],
          expectedOutput: "3 x 1500 = 4500",
          hint: "Arguments match parameters by position: quantity first, then unitPrice, separated by a comma.",
          successMessage: "3, 1500. Swap them and the receipt would read 1500 x 3: same total, wrong receipt.",
        },
      },
      {
        id: "a-cp-return",
        title: "Return values and void",
        explain:
          "A function with a return type other than void must hand back a value with return. return ends the function immediately and gives the value to the caller, which can store it, print it or use it in a calculation. A void function returns nothing; it just does its job. The difference matters: a function that RETURNS an average can be used anywhere, while one that only PRINTS it can only print.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

double average(int a, int b, int c) {
    return (a + b + c) / 3.0;
}

int main() {
    double first = average(70, 85, 90);
    cout << "First: " << first << "\n";
    cout << "Both: " << (first + average(50, 60, 70)) / 2 << "\n";
    return 0;
}
`,
          expectedOutput: "First: 81.6667\nBoth: 70.8333",
        },
        why: "average is used twice, once stored and once inside a larger calculation. That is only possible because it returns its answer instead of printing it.",
        codeFill: {
          task: "Complete the function so it returns the area of a rectangle.",
          code: C`#include <iostream>
using namespace std;

double rectangleArea(double length, double width) {
    {{1}}
}

int main() {
    cout << "Room: " << rectangleArea(4.5, 3) << " square metres\n";
    cout << "Two rooms: " << 2 * rectangleArea(4.5, 3) << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["return length * width;", "return width * length;"], width: 22 }],
          expectedOutput: "Room: 13.5 square metres\nTwo rooms: 27",
          hint: "The keyword that hands a value back, then the calculation, then a semicolon.",
          successMessage: "return length * width; The caller decides what to do with the answer, which is why it can be doubled.",
        },
      },
      {
        id: "a-cp-scope",
        title: "Local and global scope",
        explain:
          "A variable's scope is the part of the program where its name can be used. A local variable, declared inside a function or block, exists only there and disappears when the block ends; two functions can each have their own variable called total without any conflict. A global variable, declared outside every function, can be used anywhere. Avoid global variables that change: any function could alter them, so bugs become hard to trace. A local variable with the same name hides (shadows) a global one.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int counter = 100;

void bump() {
    counter++;
}

int main() {
    int counter = 5;
    bump();
    bump();
    cout << counter << "\n";
    cout << ::counter << "\n";
    return 0;
}
`,
          question: "main has its own local counter, which hides the global one. bump() can only see the global. What does this print?",
          expectedOutput: "5\n102",
          hint: "bump() changes the global counter twice. main's local counter is never touched. ::counter means \"the global one\".",
          successMessage:
            "5 and 102. Two variables with one name, and each part of the program sees a different one. That confusion is exactly why changing globals is avoided.",
        },
      },
      {
        id: "a-cp-prototypes",
        title: "Function prototypes",
        explain:
          "C++ reads a file from top to bottom, so a function must be declared before it is called. If you want main at the top, where a reader sees the program's outline first, put a prototype (just the declaration, ending in a semicolon) above main, and the full definition below it. Forgetting the prototype is a compilation error; declaring a function but never defining it is a LINKER error, which looks different and confuses many beginners.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << square(7) << "\n";
    return 0;
}

int square(int n) {
    return n * n;
}
`,
          compileError: "error: 'square' was not declared in this scope",
        },
        example:
          "The fix: a prototype above main.\n\n  #include <iostream>\n using namespace std;\n  using namespace std;\n\n  int square(int n);          // prototype: declared here\n\n  int main() {\n      cout << square(7) << \"\\n\";   // prints 49\n      return 0;\n  }\n\n  int square(int n) {         // defined here\n      return n * n;\n  }\n\nAnd the linker error: if the definition at the bottom is missing,\nthe file compiles, then the linker reports:\n\n  undefined reference to `square(int)'\n\nThat means: you promised this function exists, but never wrote it.",
        codeFill: {
          task: "main calls cube before cube is defined. Fill the gap with the prototype that makes this compile.",
          code: C`#include <iostream>
using namespace std;

{{1}}

int main() {
    cout << "3 cubed is " << cube(3) << "\n";
    return 0;
}

int cube(int n) {
    return n * n * n;
}
`,
          blanks: [{ answers: ["int cube(int n);", "int cube(int);"], width: 16 }],
          expectedOutput: "3 cubed is 27",
          hint: "Copy the first line of the definition and end it with a semicolon instead of a body.",
          successMessage: "int cube(int n); The compiler now knows cube's name, parameters and return type before main uses it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 5.8 – 5.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l22-references-overload",
    moduleId: "cp-m5-functions",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.8", "5.9", "5.10", "5.11"],
    title: "Passing Arguments, Overloading and Defaults",
    subtitle: "By value, by reference, one name for several functions, default arguments",
    estimatedMinutes: 24,
    intro:
      "When you pass a variable to a function, does the function get the variable, or a copy of its value? In C++ you choose, and the choice decides whether the function can change the caller's data. This lesson also lets one function name serve several argument types, and lets callers leave out arguments that usually have the same value.",

    atoms: [
      {
        id: "a-cp-pass-by-value",
        title: "Pass-by-value: the function gets a copy",
        explain:
          "By default, C++ passes arguments by value: the parameter is a new variable initialised with a COPY of the argument. The function can change its copy freely, and the caller's variable is untouched. That is safe, and it is what you want most of the time for small values such as ints and doubles.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

void addBonus(int score) {
    score += 10;
    cout << "Inside: " << score << "\n";
}

int main() {
    int myScore = 62;
    addBonus(myScore);
    cout << "Outside: " << myScore << "\n";
    return 0;
}
`,
          question: "score is a copy of myScore. What does the program print?",
          expectedOutput: "Inside: 72\nOutside: 62",
          hint: "The function changes its own copy. When it returns, the copy is thrown away.",
          successMessage: "72 inside, 62 outside. The bonus was added to a copy, so the real score never changed.",
        },
      },
      {
        id: "a-cp-pass-by-reference",
        title: "Pass-by-reference: the function gets the variable",
        explain:
          "Adding & after the parameter's type, as in int& score, makes the parameter a reference: another name for the caller's actual variable, not a copy. Changes inside the function change the caller's variable. Use it when a function's job is to modify its argument, such as swapping two values. For large objects that should NOT be changed, such as a long string, use a const reference, const string& name: no copy is made, and the compiler forbids changes.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 3, y = 8;
    swapValues(x, y);
    cout << "x = " << x << ", y = " << y << "\n";
    return 0;
}
`,
          expectedOutput: "x = 8, y = 3",
        },
        why: "Without the two &s, swapValues would swap two copies and x and y would be unchanged. In Week 8 you will see how references are related to memory addresses; for now, read int& as \"the caller's int itself\".",
        codeFill: {
          task: "Make addBonus change the caller's variable, by giving its parameter the right type.",
          code: C`#include <iostream>
using namespace std;

void addBonus({{1}} score) {
    score += 10;
}

int main() {
    int myScore = 62;
    addBonus(myScore);
    cout << "Score: " << myScore << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["int&", "int &"] }],
          expectedOutput: "Score: 72",
          hint: "The type is int with one extra symbol after it that means \"reference to\".",
          successMessage: "int&. One character turns a copy into the real variable, so the bonus now sticks.",
        },
      },
      {
        id: "a-cp-overloading",
        title: "Function overloading",
        explain:
          "Two or more functions can share a name if their parameter lists differ, in the number of parameters or their types. This is called overloading. When you call the name, the compiler picks the version whose parameters best match the arguments. It lets related operations share a sensible name: area(radius) for a circle and area(length, width) for a rectangle. The return type alone cannot tell overloads apart.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

void show(int x)    { cout << "int " << x << "\n"; }
void show(double x) { cout << "double " << x << "\n"; }
void show(char x)   { cout << "char " << x << "\n"; }

int main() {
    show(7);
    show(7.0);
    show('7');
    show(7 / 2);
    return 0;
}
`,
          question: "The compiler chooses the version that matches each argument's type. What does this print?",
          expectedOutput: "int 7\ndouble 7\nchar 7\nint 3",
          hint: "7.0 is a double; '7' is a char; 7 / 2 is integer division, which gives an int.",
          successMessage:
            "int 7, double 7, char 7, int 3. The last one catches people: 7 / 2 is calculated first, as an int, so the int version is chosen.",
        },
      },
      {
        id: "a-cp-default-args",
        title: "Default arguments",
        explain:
          "A parameter can have a default value: void printPrice(double amount, string currency = \"NGN\"). Callers can then leave that argument out, and the default is used. Defaults must be the LAST parameters in the list, because arguments are matched from the left. If a function has a prototype, put the default in the prototype, not in the definition.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

void printPrice(double amount, string currency = "NGN") {
    cout << amount << " " << currency << "\n";
}

int main() {
    printPrice(2500);
    printPrice(15, "USD");
    return 0;
}
`,
          expectedOutput: "2500 NGN\n15 USD",
        },
        codeFill: {
          task: "Give the rate parameter a default of 7.5, so the first call works without a rate and the second call overrides it.",
          code: C`#include <iostream>
using namespace std;

double tax(double amount, {{1}}) {
    return amount * rate / 100;
}

int main() {
    cout << tax(2000) << "\n";
    cout << tax(2000, 10) << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["double rate = 7.5", "double rate=7.5"] }],
          expectedOutput: "150\n200",
          hint: "Write the parameter as usual (type and name), then = and the default value.",
          successMessage: "double rate = 7.5. Callers who want the usual rate say nothing; callers who need a different one pass it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 5.12 – 5.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l23-recursion-decomposition",
    moduleId: "cp-m5-functions",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.12", "5.13"],
    title: "Recursion and Building Programs from Functions",
    subtitle: "Functions that call themselves, and decomposing a problem",
    estimatedMinutes: 25,
    intro:
      "Two ideas to finish the week. Recursion: a function solving a problem by calling itself on a smaller version of it. And decomposition: the habit, more important than any syntax, of breaking a big problem into small functions that each do one clear job.",

    atoms: [
      {
        id: "a-cp-recursion",
        title: "Recursion: a function that calls itself",
        explain:
          "A recursive function solves a problem by calling itself with a smaller version of the same problem. Every recursive function needs two parts: a base case, small enough to answer directly, which stops the recursion; and a recursive case, which calls the function on a smaller input and builds the answer from it. Factorial is the classic example: 5! = 5 × 4!, and 1! is simply 1.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

long long factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    cout << factorial(5) << "\n";
    cout << factorial(20) << "\n";
    return 0;
}
`,
          expectedOutput: "120\n2432902008176640000",
          trace: {
            headers: ["Call", "n", "Returns"],
            rows: [
              ["factorial(5)", "5", "5 × factorial(4) = 5 × 24 = 120"],
              ["factorial(4)", "4", "4 × factorial(3) = 4 × 6 = 24"],
              ["factorial(3)", "3", "3 × factorial(2) = 3 × 2 = 6"],
              ["factorial(2)", "2", "2 × factorial(1) = 2 × 1 = 2"],
              ["factorial(1)", "1", "1 (base case: no further call)"],
            ],
            note: "The calls go down to the base case, then the answers come back up, each multiplied on the way.",
          },
        },
        mistake:
          "Forgetting the base case, or writing one the input never reaches. Each call waits for the next, memory for the waiting calls runs out, and the program crashes with a stack overflow. Week 13 returns to recursion with harder problems.",
      },
      {
        id: "a-cp-recursion-practice",
        title: "Your turn: trace a recursive function",
        explain:
          "This function prints before AND after its recursive call. The lines before the call run on the way down; the lines after it run on the way back up, as each call finishes, in reverse order. Trace it with a table of calls.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

void countdown(int n) {
    if (n == 0) {
        cout << "Go!\n";
        return;
    }
    cout << n << " ";
    countdown(n - 1);
    cout << n << " ";
}

int main() {
    countdown(3);
    cout << "\n";
    return 0;
}
`,
          question: "What does countdown(3) print? (Spaces at the end of a line are not marked.)",
          expectedOutput: "3 2 1 Go!\n1 2 3",
          hint: "Down: 3, 2, 1, then the base case prints Go! and a new line. Up: each call finishes its last line, starting with the most recent call, n = 1.",
          successMessage:
            "3 2 1 Go! and then 1 2 3. The second half comes out reversed because the most recent call finishes first.",
        },
      },
      {
        id: "a-cp-decomposition",
        title: "Breaking a problem into functions",
        explain:
          "Decomposition means splitting a problem into small steps, each a function with one clear job and a name that says what it does. main then reads like an outline of the program. A good function is short, does one thing, takes what it needs as parameters and returns its result rather than using globals. Each piece can be tested alone, and the pieces can be reused.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

double average(int a, int b, int c) {
    return (a + b + c) / 3.0;
}

char gradeFor(double avg) {
    if (avg >= 70) return 'A';
    if (avg >= 60) return 'B';
    if (avg >= 50) return 'C';
    return 'F';
}

void printReport(const string& name, double avg) {
    cout << fixed << setprecision(1);
    cout << name << ": " << avg << " (" << gradeFor(avg) << ")\n";
}

int main() {
    printReport("Ada", average(78, 85, 69));
    printReport("Bayo", average(45, 52, 58));
    return 0;
}
`,
          expectedOutput: "Ada: 77.3 (A)\nBayo: 51.7 (C)",
        },
        why: "Compare this with the mastery program from Week 4, which did the same job inside main. Here each function can be read, tested and changed on its own, and gradeFor uses return to leave as soon as the grade is known, which removes the need for else.",
        codeFill: {
          task: "Fill the gap with ONE expression that calculates the grade for the scores 64, 58 and 71 by passing the result of average directly into gradeFor.",
          code: C`#include <iostream>
using namespace std;

double average(int a, int b, int c) {
    return (a + b + c) / 3.0;
}

char gradeFor(double avg) {
    if (avg >= 70) return 'A';
    if (avg >= 60) return 'B';
    if (avg >= 50) return 'C';
    return 'F';
}

int main() {
    char grade = {{1}};
    cout << "Grade: " << grade << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["gradeFor(average(64, 58, 71))"], width: 30 }],
          expectedOutput: "Grade: B",
          hint: "Call average(...) INSIDE the brackets of gradeFor(...). The inner call runs first and its result becomes gradeFor's argument.",
          successMessage: "gradeFor(average(64, 58, 71)). The inner call returns 64.33, and gradeFor turns that into B.",
        },
      },
      {
        id: "a-cp-toolkit-menu",
        title: "A menu-driven program built from functions",
        explain:
          "Put decomposition and a loop together and you have the shape of most interactive programs: main shows a menu, reads a choice and calls the function that handles it, until the user chooses to quit. Each operation is a separate function, so adding a new option means writing one function and one case.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

double add(double a, double b)      { return a + b; }
double subtract(double a, double b) { return a - b; }
double multiply(double a, double b) { return a * b; }

void showMenu() {
    cout << "1) Add  2) Subtract  3) Multiply  0) Quit\n";
}

int main() {
    int choice = -1;
    while (choice != 0) {
        showMenu();
        cout << "Choice: ";
        cin >> choice;
        if (choice >= 1 && choice <= 3) {
            double a = 0, b = 0;
            cout << "Two numbers: ";
            cin >> a >> b;
            if (choice == 1) cout << "= " << add(a, b) << "\n";
            if (choice == 2) cout << "= " << subtract(a, b) << "\n";
            if (choice == 3) cout << "= " << multiply(a, b) << "\n";
        }
    }
    cout << "Goodbye\n";
    return 0;
}
`,
          inputs: ["3", "4 2.5", "0"],
          expectedOutput: "1) Add  2) Subtract  3) Multiply  0) Quit\nChoice: 3\nTwo numbers: 4 2.5\n= 10\n1) Add  2) Subtract  3) Multiply  0) Quit\nChoice: 0\nGoodbye",
        },
        why: "This is the skeleton of this week's mini-project. Notice how short main stays: the calculations live in their own functions, and main only decides which one to call.",
      },
    ],

    task: {
      title: "Mini-project: a menu-driven mathematics toolkit",
      intro:
        "Write toolkit.cpp, a calculator where every operation is its own function. Plan the functions on paper first: name, parameters, return type and one sentence saying what each does.",
      prompts: [
        "Write separate functions for addition, subtraction, multiplication and division. Division must refuse to divide by zero: return 0 and print a warning, or check before calling it.",
        "Add at least three more: power (using a loop, not pow), the factorial of a whole number (recursively), and the area of a circle given its radius.",
        "Write showMenu() and a function readNumber(const string& prompt) that prints the prompt and returns the number typed, and use it for every input.",
        "Put prototypes for every function above main, and the definitions below main, so main reads like an outline.",
        "Use a loop and a switch in main so the user can do as many calculations as they like until they choose Quit.",
        "Write a function swapValues(double& a, double& b) and add a menu option that reads two numbers, swaps them and prints them, to prove the reference works.",
        "Test every option, including division by zero and the factorial of 0 and 1.",
      ],
      closing:
        "Next week your functions start working on whole collections of data: arrays and vectors.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
