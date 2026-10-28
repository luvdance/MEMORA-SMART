/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 5 · FUNCTIONS AND MODULAR PROGRAMMING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l20-functions-intro": {
    lessonId: "cp-l20-functions-intro",
    passMark: 70,
    questions: [
      {
        id: "cpq20-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-why-functions",
        prompt: "Which is NOT a reason to put code into a function?",
        options: [
          { id: "a", text: "Functions make every program run faster" },
          { id: "b", text: "The code can be reused by calling it many times" },
          { id: "c", text: "A named function makes the program easier to read" },
          { id: "d", text: "A small function can be tested on its own" },
        ],
        correct: "a",
        explanation: "Functions are about organisation: reuse, readability, testing and easier change. They do not make code faster in themselves.",
        whyWrong: {
          b: "Reuse is one of the main reasons functions exist.",
          c: "A good name tells the reader what happens without the detail.",
          d: "Small functions are much easier to test than one long main.",
        },
      },
      {
        id: "cpq20-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-define-function",
        prompt: "In double total(int a, int b), what is double?",
        options: [
          { id: "a", text: "The return type: the kind of value the function gives back" },
          { id: "b", text: "The type of both parameters" },
          { id: "c", text: "The function's name" },
          { id: "d", text: "An instruction to run the function twice" },
        ],
        correct: "a",
        explanation: "The type before the name is the return type. The parameters' types are inside the brackets: both are int here.",
        whyWrong: {
          b: "The parameters are declared int inside the brackets.",
          c: "The name is total.",
          d: "double is a type, not a repeat instruction.",
        },
      },
      {
        id: "cpq20-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-call-function",
        prompt: "void x() { cout << \"1\"; }\nvoid y() { x(); cout << \"2\"; x(); }\nint main() { y(); cout << \"3\"; }\n\nWhat is printed?",
        options: [
          { id: "a", text: "1213" },
          { id: "b", text: "123" },
          { id: "c", text: "2113" },
          { id: "d", text: "3121" },
        ],
        correct: "a",
        explanation: "main calls y. y calls x (1), prints 2, calls x again (1), and returns. Then main prints 3.",
        whyWrong: {
          b: "x is called twice inside y, so 1 is printed twice.",
          c: "Inside y, the first statement is x(), so 1 comes before 2.",
          d: "main prints 3 only after y has finished.",
        },
      },
      {
        id: "cpq20-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-define-function",
        prompt: "What does the return type void mean?",
        options: [
          { id: "a", text: "The function does its job but gives no value back to the caller" },
          { id: "b", text: "The function takes no parameters" },
          { id: "c", text: "The function is empty" },
          { id: "d", text: "The function returns 0" },
        ],
        correct: "a",
        explanation: "void functions are called for what they do, such as printing, not for a result.",
        whyWrong: {
          b: "Parameters are a separate matter; a void function can take any number of them.",
          c: "A void function can contain any amount of code.",
          d: "void means no value at all, not zero.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l21-params-return": {
    lessonId: "cp-l21-params-return",
    passMark: 70,
    questions: [
      {
        id: "cpq21-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-params-args",
        prompt: "In the call bmi(68, 1.75), what are 68 and 1.75?",
        options: [
          { id: "a", text: "Arguments: the actual values passed to the function's parameters" },
          { id: "b", text: "Parameters" },
          { id: "c", text: "Return values" },
          { id: "d", text: "Global variables" },
        ],
        correct: "a",
        explanation: "Parameters are the variables in the definition; arguments are the values supplied at the call.",
        whyWrong: {
          b: "Parameters are named in the function's definition, such as double weight.",
          c: "The return value is what bmi hands back afterwards.",
          d: "They are literal values written at the call, not variables at all.",
        },
      },
      {
        id: "cpq21-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-return",
        prompt: "int half(int n) {\n    return n / 2;\n    cout << \"done\";\n}\n\nWhat happens when half(9) is called?",
        options: [
          { id: "a", text: "It returns 4; the cout line never runs, because return ends the function" },
          { id: "b", text: "It returns 4.5 and prints done" },
          { id: "c", text: "It prints done and returns 4" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "return leaves the function immediately with the value. 9 / 2 in integer division is 4.",
        whyWrong: {
          b: "The return type is int and both values are ints, so the result is 4.",
          c: "Nothing after a return in the same block runs.",
          d: "Unreachable code compiles; it simply never executes.",
        },
      },
      {
        id: "cpq21-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-scope",
        prompt: "void setUp() {\n    int total = 50;\n}\nint main() {\n    setUp();\n    cout << total;\n}\n\nWhat happens?",
        options: [
          { id: "a", text: "A compilation error: total is local to setUp and does not exist in main" },
          { id: "b", text: "It prints 50" },
          { id: "c", text: "It prints 0" },
          { id: "d", text: "It prints a random number" },
        ],
        correct: "a",
        explanation: "A local variable exists only inside the block where it is declared. main cannot see setUp's total.",
        whyWrong: {
          b: "total disappears when setUp ends, and main never could see it.",
          c: "There is no total in main at all, so nothing can be printed.",
          d: "The program does not compile, so it never runs.",
        },
      },
      {
        id: "cpq21-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-prototypes",
        prompt: "A program declares int tax(int amount); above main and calls it, but the definition of tax was never written. What happens?",
        options: [
          { id: "a", text: "It compiles, then the linker reports an undefined reference to tax" },
          { id: "b", text: "It runs and tax returns 0" },
          { id: "c", text: "The compiler writes the function automatically" },
          { id: "d", text: "It runs until tax is called, then crashes" },
        ],
        correct: "a",
        explanation: "The prototype satisfies the compiler, but the linker cannot find any code for tax to connect the call to.",
        whyWrong: {
          b: "There is no code for tax at all, so no executable is produced.",
          c: "C++ never writes functions for you.",
          d: "The program is never built, so it cannot run.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l22-references-overload": {
    lessonId: "cp-l22-references-overload",
    passMark: 70,
    questions: [
      {
        id: "cpq22-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-pass-by-value",
        prompt: "void reset(int n) { n = 0; }\nint main() { int count = 9; reset(count); cout << count; }\n\nWhat is printed?",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "0" },
          { id: "c", text: "Nothing" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "n is a copy of count. Setting the copy to 0 does not change count.",
        whyWrong: {
          b: "That needs int& n, a reference to the caller's variable.",
          c: "cout prints count, which is 9.",
          d: "It is valid; it just does not do what its name suggests.",
        },
      },
      {
        id: "cpq22-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-pass-by-reference",
        prompt: "Why might a function take const string& name instead of string name?",
        options: [
          { id: "a", text: "It avoids copying the string, and const stops the function changing it" },
          { id: "b", text: "It lets the function change the caller's string" },
          { id: "c", text: "Strings cannot be passed by value" },
          { id: "d", text: "It makes name a global variable" },
        ],
        correct: "a",
        explanation: "A reference refers to the caller's string, so no copy is made; const makes it read-only.",
        whyWrong: {
          b: "const forbids changes. A plain string& would allow them.",
          c: "Strings can be passed by value; it just costs a copy.",
          d: "A parameter is always local to its function.",
        },
      },
      {
        id: "cpq22-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-overloading",
        prompt: "int area(int s) { return s * s; }\nint area(int l, int w) { return l * w; }\n\ncout << area(3) + area(2, 5);\n\nWhat is printed?",
        options: [
          { id: "a", text: "19" },
          { id: "b", text: "16" },
          { id: "c", text: "25" },
          { id: "d", text: "It does not compile: two functions cannot share a name" },
        ],
        correct: "a",
        explanation: "area(3) calls the one-parameter version: 9. area(2, 5) calls the two-parameter version: 10. 9 + 10 = 19.",
        whyWrong: {
          b: "area(3) squares 3 to give 9, not 6.",
          c: "The two calls use different versions; neither gives 25.",
          d: "Functions can share a name when their parameter lists differ.",
        },
      },
      {
        id: "cpq22-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-default-args",
        prompt: "Which declaration is valid?",
        options: [
          { id: "a", text: "void book(string name, int nights = 1);" },
          { id: "b", text: "void book(int nights = 1, string name);" },
          { id: "c", text: "void book(string name = , int nights);" },
          { id: "d", text: "void book(default string name);" },
        ],
        correct: "a",
        explanation: "Default arguments must be the last parameters, because arguments are matched from the left.",
        whyWrong: {
          b: "A parameter with a default cannot come before one without.",
          c: "A default needs a value after the =.",
          d: "default is not how defaults are written in a parameter list.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l23-recursion-decomposition": {
    lessonId: "cp-l23-recursion-decomposition",
    passMark: 70,
    questions: [
      {
        id: "cpq23-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-recursion",
        prompt: "What must every recursive function have to stop calling itself?",
        options: [
          { id: "a", text: "A base case that returns without a further recursive call" },
          { id: "b", text: "A global variable" },
          { id: "c", text: "A for loop" },
          { id: "d", text: "A void return type" },
        ],
        correct: "a",
        explanation: "The base case is the smallest version of the problem, answered directly. Without it the calls never end.",
        whyWrong: {
          b: "Recursion needs no globals.",
          c: "Recursion replaces loops; it does not need one.",
          d: "Recursive functions can return any type, as factorial does.",
        },
      },
      {
        id: "cpq23-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-recursion-practice",
        prompt: "int sum(int n) {\n    if (n == 0) return 0;\n    return n + sum(n - 1);\n}\n\nWhat does sum(4) return?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "4" },
          { id: "c", text: "24" },
          { id: "d", text: "It never stops" },
        ],
        correct: "a",
        explanation: "4 + sum(3) = 4 + 3 + sum(2) = 4 + 3 + 2 + 1 + sum(0) = 10.",
        whyWrong: {
          b: "Each call adds its n to the result of the next call, not only the first.",
          c: "That is 4 × 3 × 2, the factorial. This function adds.",
          d: "n decreases by 1 each call and reaches the base case 0.",
        },
      },
      {
        id: "cpq23-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-decomposition",
        prompt: "Which is the best description of a well-designed function?",
        options: [
          { id: "a", text: "Short, does one job, named for that job, takes what it needs as parameters and returns its result" },
          { id: "b", text: "As long as possible, so the program needs fewer functions" },
          { id: "c", text: "Reads and changes global variables so it needs no parameters" },
          { id: "d", text: "Prints its results instead of returning them, always" },
        ],
        correct: "a",
        explanation: "One job, a clear name, inputs as parameters and outputs as return values: easy to read, test and reuse.",
        whyWrong: {
          b: "Long functions doing many things are hard to read, test and change.",
          c: "Hidden dependence on globals makes behaviour hard to follow and test.",
          d: "A function that returns its result can be used anywhere; one that only prints cannot.",
        },
      },
      {
        id: "cpq23-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-decomposition",
        prompt: "In gradeFor(average(64, 58, 71)), which function runs first?",
        options: [
          { id: "a", text: "average, because its result is the argument gradeFor needs" },
          { id: "b", text: "gradeFor, because it is written first" },
          { id: "c", text: "They run at the same time" },
          { id: "d", text: "Neither: nested calls are not allowed" },
        ],
        correct: "a",
        explanation: "Arguments are evaluated before a function is called, so the inner call completes first.",
        whyWrong: {
          b: "gradeFor cannot start until it has its argument, which average produces.",
          c: "C++ runs one call at a time here: inner first, then outer.",
          d: "Passing one call's result directly into another is normal C++.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
