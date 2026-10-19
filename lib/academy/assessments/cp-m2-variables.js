/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 2 · VARIABLES, DATA TYPES AND INPUT/OUTPUT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l6-variables": {
    lessonId: "cp-l6-variables",
    passMark: 70,
    questions: [
      {
        id: "cpq6-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-data",
        prompt: "Which C++ type best fits a student's average score, such as 72.5?",
        options: [
          { id: "a", text: "double" },
          { id: "b", text: "int" },
          { id: "c", text: "char" },
          { id: "d", text: "bool" },
        ],
        correct: "a",
        explanation: "An average has a fractional part, so it needs a floating-point type, and double is the default choice.",
        whyWrong: {
          b: "An int holds whole numbers only; 72.5 would lose its .5.",
          c: "A char holds a single character.",
          d: "A bool holds only true or false.",
        },
      },
      {
        id: "cpq6-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-variables-memory",
        prompt: "What is a variable?",
        options: [
          { id: "a", text: "A named piece of memory that holds one value of a particular type" },
          { id: "b", text: "A value that can never change" },
          { id: "c", text: "A line of output" },
          { id: "d", text: "A file saved on the hard drive" },
        ],
        correct: "a",
        explanation: "A variable reserves bytes in memory for its type, and its name lets you read and change the value stored there.",
        whyWrong: {
          b: "Variables can change; a const is the one that cannot.",
          c: "Output is what cout prints. A variable is where a value is stored.",
          d: "Variables live in RAM while the program runs, not in files.",
        },
      },
      {
        id: "cpq6-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-declare-init",
        prompt: "Why should every variable be initialised when it is declared?",
        options: [
          { id: "a", text: "An uninitialised variable holds whatever was already in that memory, so reading it gives unpredictable results" },
          { id: "b", text: "Uninitialised variables cannot be printed at all" },
          { id: "c", text: "Initialising makes the program run faster" },
          { id: "d", text: "C++ refuses to compile a declaration without a value" },
        ],
        correct: "a",
        explanation: "int total; reserves memory but does not clear it. Reading total before giving it a value reads leftover bytes.",
        whyWrong: {
          b: "They can be printed; the problem is that the value is garbage.",
          c: "Speed is not the reason. Correctness is.",
          d: "int total; compiles. That is exactly why it is dangerous.",
        },
      },
      {
        id: "cpq6-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-assignment-trace",
        prompt: "int a = 4;\nint b = a * 3;\na = 10;\nstd::cout << b << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "30" },
          { id: "c", text: "10" },
          { id: "d", text: "4" },
        ],
        correct: "a",
        explanation: "b was calculated as 4 × 3 = 12 when line 2 ran. Changing a afterwards does not recalculate b: variables store values, not formulas.",
        whyWrong: {
          b: "That would be true only if b recalculated itself when a changed. It does not.",
          c: "10 is the new value of a; b is unaffected.",
          d: "4 is a's original value, not b.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l7-numbers": {
    lessonId: "cp-l7-numbers",
    passMark: 70,
    questions: [
      {
        id: "cpq7-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-naming",
        prompt: "Which is a valid C++ variable name?",
        options: [
          { id: "a", text: "exam_total" },
          { id: "b", text: "exam total" },
          { id: "c", text: "3rdTerm" },
          { id: "d", text: "return" },
        ],
        correct: "a",
        explanation: "Letters and underscores, not starting with a digit, and not a keyword.",
        whyWrong: {
          b: "Names cannot contain spaces.",
          c: "Names cannot start with a digit.",
          d: "return is a reserved keyword.",
        },
      },
      {
        id: "cpq7-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-int-longlong",
        prompt: "You need to store the number of bytes in a 6 GB video file: about 6,000,000,000. Which type?",
        options: [
          { id: "a", text: "long long" },
          { id: "b", text: "int" },
          { id: "c", text: "char" },
          { id: "d", text: "bool" },
        ],
        correct: "a",
        explanation: "An int tops out at about 2.1 billion. Six billion needs the 8-byte long long.",
        whyWrong: {
          b: "6,000,000,000 is larger than the largest int, 2,147,483,647, so it would overflow.",
          c: "A char holds one character, a tiny number.",
          d: "A bool holds only true or false.",
        },
      },
      {
        id: "cpq7-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-float-double",
        prompt: "Why is double usually chosen over float for decimal numbers?",
        options: [
          { id: "a", text: "double keeps about 15–16 significant digits; float keeps only about 7" },
          { id: "b", text: "float cannot store decimals" },
          { id: "c", text: "double uses less memory" },
          { id: "d", text: "float is not part of C++" },
        ],
        correct: "a",
        explanation: "double is twice the size and far more precise, which avoids accuracy problems in ordinary calculations.",
        whyWrong: {
          b: "float does store decimals, just with less precision.",
          c: "double uses more memory: 8 bytes against float's 4.",
          d: "float is a standard C++ type.",
        },
      },
      {
        id: "cpq7-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-float-double",
        prompt: "double cost = 499.50;\nstd::cout << cost * 2 << \"\\n\";\n\nWith cout's default formatting, what is printed?",
        options: [
          { id: "a", text: "999" },
          { id: "b", text: "999.00" },
          { id: "c", text: "999.0" },
          { id: "d", text: "999.5" },
        ],
        correct: "a",
        explanation: "499.50 × 2 is 999.00. By default cout drops trailing zeros, so it prints 999.",
        whyWrong: {
          b: "Two decimal places need std::fixed and std::setprecision(2).",
          c: "Default formatting does not keep a trailing .0.",
          d: "499.50 × 2 is 999, not 999.5.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l8-char-bool-const": {
    lessonId: "cp-l8-char-bool-const",
    passMark: 70,
    questions: [
      {
        id: "cpq8-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-char",
        prompt: "Which line correctly stores the grade B in a char?",
        options: [
          { id: "a", text: "char grade = 'B';" },
          { id: "b", text: "char grade = \"B\";" },
          { id: "c", text: "char grade = B;" },
          { id: "d", text: "char 'B' = grade;" },
        ],
        correct: "a",
        explanation: "A single character goes in single quotes.",
        whyWrong: {
          b: "Double quotes make text (a string), even for one letter.",
          c: "Without quotes, B is read as the name of a variable.",
          d: "The type comes first, then the variable name, then the value.",
        },
      },
      {
        id: "cpq8-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-bool",
        prompt: "bool ready = true;\nstd::cout << ready << \"\\n\";\n\nWithout std::boolalpha, what is printed?",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "true" },
          { id: "c", text: "ready" },
          { id: "d", text: "0" },
        ],
        correct: "a",
        explanation: "By default cout prints true as 1 and false as 0. std::boolalpha switches to the words.",
        whyWrong: {
          b: "That needs std::boolalpha first.",
          c: "cout prints the variable's value, not its name.",
          d: "0 is how false is printed.",
        },
      },
      {
        id: "cpq8-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-const",
        prompt: "const int PASS_MARK = 50;\nPASS_MARK = 45;\n\nWhat happens?",
        options: [
          { id: "a", text: "A compilation error: you cannot assign to a read-only variable" },
          { id: "b", text: "PASS_MARK becomes 45" },
          { id: "c", text: "The program crashes when it runs" },
          { id: "d", text: "The second line is silently ignored" },
        ],
        correct: "a",
        explanation: "const makes the variable read-only, and the compiler rejects any attempt to change it.",
        whyWrong: {
          b: "Preventing exactly this change is the purpose of const.",
          c: "The program is never built, so it cannot run or crash.",
          d: "C++ does not ignore it; it reports an error.",
        },
      },
      {
        id: "cpq8-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-constexpr",
        prompt: "What is the difference between const and constexpr?",
        options: [
          { id: "a", text: "A constexpr value must be known when the program is compiled; a const value can be set from input at run time and then fixed" },
          { id: "b", text: "constexpr values can be changed later; const values cannot" },
          { id: "c", text: "const only works with int" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "a",
        explanation: "Both are read-only. constexpr additionally guarantees the compiler knows the value, so it can be used where compile-time numbers are needed.",
        whyWrong: {
          b: "Neither can be changed after it is set.",
          c: "const works with any type.",
          d: "The compile-time guarantee is the difference.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l9-cout-cin": {
    lessonId: "cp-l9-cout-cin",
    passMark: 70,
    questions: [
      {
        id: "cpq9-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-cin",
        prompt: "Which statement reads a number from the keyboard into the variable price?",
        options: [
          { id: "a", text: "std::cin >> price;" },
          { id: "b", text: "std::cin << price;" },
          { id: "c", text: "std::cout >> price;" },
          { id: "d", text: "price = std::cin;" },
        ],
        correct: "a",
        explanation: "std::cin is the keyboard, and >> points from it into the variable.",
        whyWrong: {
          b: "<< is the output direction, used with cout.",
          c: "cout is the screen; you cannot read from it.",
          d: "cin is not a value to assign; it is read with >>.",
        },
      },
      {
        id: "cpq9-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-cin-text",
        prompt: "std::string city;\nstd::cin >> city;\n\nThe user types Port Harcourt and presses Enter. What does city hold?",
        options: [
          { id: "a", text: "Port" },
          { id: "b", text: "Port Harcourt" },
          { id: "c", text: "Harcourt" },
          { id: "d", text: "Nothing: the program crashes" },
        ],
        correct: "a",
        explanation: "cin >> reads one word: it stops at the first space. Harcourt is left waiting for the next read.",
        whyWrong: {
          b: "Reading a whole line with spaces needs std::getline, taught in Week 7.",
          c: "cin reads from the start; it stops after the first word.",
          d: "Nothing crashes; the second word simply stays unread.",
        },
      },
      {
        id: "cpq9-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-cout-newlines",
        prompt: "std::cout << \"A\\tB\\nC\\\\D\\n\";\n\nHow many lines does this print, and what is on the second?",
        options: [
          { id: "a", text: "Two lines; the second is C\\D" },
          { id: "b", text: "One line: A\\tB\\nC\\\\D" },
          { id: "c", text: "Three lines; the second is B" },
          { id: "d", text: "Two lines; the second is C\\\\D" },
        ],
        correct: "a",
        explanation: "\\t is a tab, \\n starts the second line, and \\\\ prints a single backslash.",
        whyWrong: {
          b: "Escape sequences are turned into characters, not printed literally.",
          c: "\\t is a tab, not a new line, so A and B share the first line.",
          d: "\\\\ prints ONE backslash.",
        },
      },
      {
        id: "cpq9-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-cin-multiple",
        prompt: "int a = 0, b = 0;\nstd::cin >> a >> b;\nstd::cout << b - a << \"\\n\";\n\nThe user types 3, presses Enter, then types 10 and presses Enter. What is printed?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "-7" },
          { id: "c", text: "Nothing, because the values were on different lines" },
          { id: "d", text: "13" },
        ],
        correct: "a",
        explanation: "cin skips spaces and line breaks between values, so a is 3 and b is 10, and b - a is 7.",
        whyWrong: {
          b: "That is a - b. The program prints b - a.",
          c: "Enter between values is fine: cin treats line breaks like spaces.",
          d: "That is the sum; the program subtracts.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l10-conversion": {
    lessonId: "cp-l10-conversion",
    passMark: 70,
    questions: [
      {
        id: "cpq10-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-integer-division",
        prompt: "std::cout << 23 / 4 << \" \" << 23 % 4 << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "5 3" },
          { id: "b", text: "5.75 3" },
          { id: "c", text: "5 0.75" },
          { id: "d", text: "6 3" },
        ],
        correct: "a",
        explanation: "Both are whole numbers, so 23 / 4 is integer division: 5. The remainder, 23 % 4, is 3.",
        whyWrong: {
          b: "5.75 would need one side to be a double.",
          c: "% gives the whole-number remainder, 3, not a fraction.",
          d: "Integer division truncates; it never rounds 5.75 up to 6.",
        },
      },
      {
        id: "cpq10-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-static-cast",
        prompt: "int total = 10, count = 4;\nWhich expression gives the average 2.5?",
        options: [
          { id: "a", text: "static_cast<double>(total) / count" },
          { id: "b", text: "total / count" },
          { id: "c", text: "static_cast<double>(total / count)" },
          { id: "d", text: "total % count" },
        ],
        correct: "a",
        explanation: "Converting total to double before dividing makes it a decimal division: 10.0 / 4 = 2.5.",
        whyWrong: {
          b: "Two ints: integer division gives 2.",
          c: "The division happens first, in whole numbers (2), and only then is 2 converted to 2.0.",
          d: "% gives the remainder, 2.",
        },
      },
      {
        id: "cpq10-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-conversion",
        prompt: "double reading = 9.8;\nint whole = reading;\nstd::cout << whole << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "10" },
          { id: "c", text: "9.8" },
          { id: "d", text: "A compilation error" },
        ],
        correct: "a",
        explanation: "Converting double to int truncates: the fractional part is dropped, never rounded.",
        whyWrong: {
          b: "That would be rounding. Conversion to int cuts off the fraction.",
          c: "An int cannot hold a fractional part.",
          d: "With = it compiles. Brace initialisation, int whole{reading};, would refuse it.",
        },
      },
      {
        id: "cpq10-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-fixed-setprecision",
        prompt: "Which line makes every decimal printed afterwards show exactly two decimal places?",
        options: [
          { id: "a", text: "std::cout << std::fixed << std::setprecision(2);" },
          { id: "b", text: "std::cout << std::setprecision(2);" },
          { id: "c", text: "std::cout << 2;" },
          { id: "d", text: "double precision = 2;" },
        ],
        correct: "a",
        explanation: "std::fixed switches to a fixed number of decimal places, and setprecision(2) sets that number to two. It needs #include <iomanip>.",
        whyWrong: {
          b: "Without std::fixed, setprecision counts significant digits: 1250.5 would print as 1.3e+03.",
          c: "That prints the number 2.",
          d: "That just creates a variable; it does not change how cout formats anything.",
        },
      },
      {
        id: "cpq10-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-integer-division",
        prompt: "Why does (0.1 + 0.2 == 0.3) evaluate to false in C++?",
        options: [
          { id: "a", text: "0.1 and 0.2 are stored as close approximations, so their sum is very slightly different from the stored 0.3" },
          { id: "b", text: "C++ cannot add decimals" },
          { id: "c", text: "== only works with whole numbers" },
          { id: "d", text: "It is a bug in the compiler" },
        ],
        correct: "a",
        explanation: "Most decimal fractions have no exact binary form. The tiny errors make the sum not exactly equal to 0.3.",
        whyWrong: {
          b: "C++ adds decimals; the issue is how they are represented.",
          c: "== compares doubles, but exact equality is unreliable for values that are approximations.",
          d: "Every language using standard floating-point behaves this way.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
