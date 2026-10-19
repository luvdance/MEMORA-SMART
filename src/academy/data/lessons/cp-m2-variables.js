/**
 * C++ PROGRAMMING · MODULE 2 · VARIABLES, DATA TYPES AND INPUT/OUTPUT
 *
 * Curriculum 2.1 – 2.15. Store, retrieve and display information correctly.
 * Every program here is compiled and run by `npm run validate:content`;
 * programs that read from std::cin carry their keyboard input (`inputs`) and
 * the output shown is the real terminal transcript, typed text included.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s2-variables";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l6-variables",
    moduleId: "cp-m2-variables",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "Data and Variables",
    subtitle: "What data is, where it lives, and how to name and store it",
    estimatedMinutes: 16,
    intro:
      "Last week your programs printed fixed text. Real programs work with information that changes: a score, a price, a name. This lesson introduces the variable, a named place in memory that holds a value, and the type that tells C++ what kind of value it is.",

    atoms: [
      {
        id: "a-cp-data",
        title: "What data is, and why its type matters",
        explain:
          "Data is any information a program works with: numbers, text, single characters, and yes-or-no facts. In C++ every piece of data has a type, and the type decides two things: how much memory it takes, and what you can do with it. You can multiply two whole numbers; you cannot multiply two names.",
        table: {
          caption: "One student's record, and the type each piece of data needs.",
          headers: ["Data", "Example", "Kind", "C++ type"],
          rows: [
            ["Age", "19", "Whole number", "int"],
            ["Average score", "72.5", "Decimal number", "double"],
            ["Grade", "B", "A single character", "char"],
            ["Passed", "true", "Yes or no", "bool"],
            ["Name", "Chiamaka Okafor", "Text", "std::string"],
          ],
        },
        decision: {
          scenario: "You are storing each student's phone number, such as 08031234567.",
          question: "Should it be stored as a number (int) or as text?",
          options: [
            {
              id: "a",
              text: "As text: it is an identifier, not a quantity, and a number would lose the leading 0",
              why: "You never add or average phone numbers, and as a number 08031234567 would become 8031234567. Choose a type by what you will DO with the data, not by whether it contains digits.",
            },
            {
              id: "b",
              text: "As an int, because it is made of digits",
              whyWrong: "Digits do not make something a quantity. An int would drop the leading zero, and 08031234567 is also too large for an int on most computers.",
            },
            {
              id: "c",
              text: "As a bool",
              whyWrong: "A bool holds only true or false.",
            },
            {
              id: "d",
              text: "As a char",
              whyWrong: "A char holds exactly one character, not eleven.",
            },
          ],
          correct: "a",
          aftermath: "Ask what operations the data needs. Arithmetic means a number type; identifiers such as phone numbers and account numbers are text.",
        },
      },
      {
        id: "a-cp-variables-memory",
        title: "A variable is a named place in memory",
        explain:
          "A variable is a named piece of memory that holds one value of one type. When you create a variable, C++ sets aside enough bytes for its type and remembers where they are, so you can use the name instead of the location. The size depends on the type: sizeof tells you how many bytes a type uses.",
        analogy:
          "A row of labelled boxes on a shelf. The label is the name, the box's size is fixed by the type, and the contents are the value. You can change the contents any time; the label and size stay the same.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "char:      " << sizeof(char) << " byte\n";
    std::cout << "bool:      " << sizeof(bool) << " byte\n";
    std::cout << "int:       " << sizeof(int) << " bytes\n";
    std::cout << "double:    " << sizeof(double) << " bytes\n";
    std::cout << "long long: " << sizeof(long long) << " bytes\n";
    return 0;
}
`,
          expectedOutput: "char:      1 byte\nbool:      1 byte\nint:       4 bytes\ndouble:    8 bytes\nlong long: 8 bytes",
        },
        why: "These are the sizes on almost every modern computer. In Week 8 you will see the actual memory address of a variable; this is the first step: every variable occupies real bytes somewhere in RAM.",
      },
      {
        id: "a-cp-declare-init",
        title: "Declaring and initialising variables",
        explain:
          "To declare a variable you write its type, then its name: int score;. To initialise it you give it a starting value at the same time: int score = 85;. C++ also accepts int score{85};, called brace initialisation, which is stricter and is used a lot in modern C++. Always initialise: a variable declared without a value contains whatever bytes happened to be in that memory, and reading it gives an unpredictable result.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int score = 85;
    double average{72.5};
    char grade = 'B';

    std::cout << "Score: " << score << "\n";
    std::cout << "Average: " << average << "\n";
    std::cout << "Grade: " << grade << "\n";
    return 0;
}
`,
          expectedOutput: "Score: 85\nAverage: 72.5\nGrade: B",
        },
        mistake:
          "int total; followed by total = total + 10;. total was never given a value, so the result is garbage, different on different runs. -Wall often warns about this; never ignore that warning.",
        codeFill: {
          task: "Fill the gap with a declaration that creates an int called age holding 19, so the program prints Age: 19.",
          code: C`#include <iostream>

int main() {
    {{1}}
    std::cout << "Age: " << age << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["int age = 19;", "int age{19};", "int age(19);", "int age = {19};"], width: 16 }],
          expectedOutput: "Age: 19",
          hint: "Type, then name, then = and the value, then a semicolon: the same shape as int score = 85;",
          successMessage: "A declaration and an initialisation in one line. That shape will start almost every program you write.",
        },
      },
      {
        id: "a-cp-assignment-trace",
        title: "Changing a variable's value",
        explain:
          "After a variable exists, = gives it a new value; you do not write the type again. The = in C++ means \"store\", not \"is equal to\": score = score + 5; means work out score + 5 using the current value, then store the result back in score. The old value is gone.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int balance = 5000;
    balance = balance - 1200;
    int deposit = 2500;
    balance = balance + deposit;
    deposit = 0;
    std::cout << balance << "\n";
    std::cout << deposit << "\n";
    return 0;
}
`,
          question: "Trace the values of balance and deposit line by line. What does the program print?",
          expectedOutput: "6300\n0",
          hint: "5000 - 1200 is 3800. Then add the deposit. Setting deposit to 0 afterwards does not undo the addition that already happened.",
          successMessage:
            "6300 and 0. Line 8 changes deposit, but balance was calculated on line 7 and keeps its value: variables hold values, not formulas.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.4 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l7-numbers",
    moduleId: "cp-m2-variables",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6"],
    title: "Names and Numbers",
    subtitle: "Naming rules, int and long long, float and double",
    estimatedMinutes: 16,
    intro:
      "Two decisions every time you create a variable: what to call it, and which number type to use. Good names make a program explain itself. The right number type stops it from silently giving wrong answers when the numbers get large or need decimals.",

    atoms: [
      {
        id: "a-cp-naming",
        title: "Naming rules and meaningful names",
        explain:
          "A name (identifier) may contain letters, digits and underscores, must not start with a digit, cannot contain spaces, and cannot be one of C++'s reserved keywords such as int, return or class. Names are case-sensitive: total and Total are different variables. Beyond the rules, choose names that say what the value means: averageScore or average_score, never x2 or temp9.",
        table: {
          caption: "Valid or not, and why.",
          headers: ["Name", "Valid?", "Reason"],
          rows: [
            ["student_count", "Yes", "Letters and an underscore; clear meaning"],
            ["totalScore", "Yes", "Letters only, in camelCase"],
            ["2ndPlace", "No", "Starts with a digit"],
            ["exam score", "No", "Contains a space"],
            ["int", "No", "A reserved keyword"],
            ["average-mark", "No", "The hyphen is read as a minus sign"],
            ["x", "Valid, but poor", "Says nothing about what it holds"],
          ],
        },
        decision: {
          scenario: "You need a variable for the number of students who passed the examination.",
          question: "Which name is best?",
          options: [
            {
              id: "a",
              text: "passedCount",
              why: "Valid and meaningful: someone reading passedCount + failedCount needs no comment to understand it.",
            },
            {
              id: "b",
              text: "n",
              whyWrong: "Valid, but it says nothing. In a program with several counts, n is a guessing game.",
            },
            {
              id: "c",
              text: "passed count",
              whyWrong: "Names cannot contain spaces. The compiler reads this as two separate names.",
            },
            {
              id: "d",
              text: "1passed",
              whyWrong: "Names cannot start with a digit.",
            },
          ],
          correct: "a",
          aftermath: "Pick one style, camelCase or snake_case, and use it consistently throughout a program.",
        },
      },
      {
        id: "a-cp-int-longlong",
        title: "Whole numbers: int and long long",
        explain:
          "int holds whole numbers, positive or negative, without decimals. On modern computers an int is 4 bytes and can hold values from about minus 2.1 billion to plus 2.1 billion. For larger values use long long, which is 8 bytes and reaches about 9.2 quintillion (9.2 × 10¹⁸). Going past a type's limit is called overflow, and for int it is a serious bug: the result is wrong, and C++ does not warn you at run time.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <limits>

int main() {
    std::cout << "Largest int:       " << std::numeric_limits<int>::max() << "\n";
    std::cout << "Largest long long: " << std::numeric_limits<long long>::max() << "\n";

    int nigeriaPopulation = 230000000;
    long long worldPopulation = 8100000000LL;
    std::cout << "Nigeria: " << nigeriaPopulation << "\n";
    std::cout << "World:   " << worldPopulation << "\n";
    return 0;
}
`,
          expectedOutput: "Largest int:       2147483647\nLargest long long: 9223372036854775807\nNigeria: 230000000\nWorld:   8100000000",
        },
        why: "8.1 billion does not fit in an int, so the world population needs long long. The LL after the number tells C++ that the number itself is a long long. Money stored in kobo or cents, file sizes in bytes and timestamps are all common reasons to reach for long long.",
        codeFill: {
          task: "A company's yearly revenue in kobo is 4500000000000, far too large for an int. Fill the gap with the right type so the program stores it and prints the value in naira.",
          code: C`#include <iostream>

int main() {
    {{1}} revenueKobo = 4500000000000LL;
    std::cout << "Revenue: " << revenueKobo / 100 << " naira\n";
    return 0;
}
`,
          blanks: [{ answers: ["long long", "long long int"] }],
          expectedOutput: "Revenue: 45000000000 naira",
          hint: "The 8-byte whole-number type that reaches about 9.2 × 10¹⁸ is written as two words.",
          successMessage: "long long. Choosing a type big enough for the data is one of the first decisions that separates working programs from ones that break on large inputs.",
        },
      },
      {
        id: "a-cp-float-double",
        title: "Decimal numbers: float and double",
        explain:
          "Numbers with a fractional part use a floating-point type. double is 8 bytes and keeps about 15 to 16 significant digits; float is 4 bytes and keeps only about 7. Use double unless you have a specific reason not to. By default, cout shows up to 6 significant digits and drops trailing zeros, so 2501.00 prints as 2501.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <iomanip>

int main() {
    float f = 1.0f / 3;
    double d = 1.0 / 3;
    std::cout << std::setprecision(12);
    std::cout << "float:  " << f << "\n";
    std::cout << "double: " << d << "\n";
    return 0;
}
`,
          expectedOutput: "float:  0.333333343267\ndouble: 0.333333333333",
        },
        why: "Asked to show 12 digits, the float goes wrong after the seventh, because that is all it stores. setprecision is covered properly at the end of this module; for now notice that float's accuracy runs out fast, which is why double is the default choice.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    double price = 1250.50;
    std::cout << price * 2 << "\n";
    std::cout << price / 4 << "\n";
    std::cout << 10.0 / 3 << "\n";
    return 0;
}
`,
          question: "cout shows up to 6 significant digits by default and drops trailing zeros. What does this print?",
          expectedOutput: "2501\n312.625\n3.33333",
          hint: "1250.50 × 2 is 2501.00, shown without the zeros. 10 ÷ 3 is 3.333…, cut to 6 significant digits.",
          successMessage:
            "2501, 312.625 and 3.33333. Default output is fine for checking, but for money you will want exactly two decimal places: that is std::fixed and setprecision, in Lesson 10.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.7 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l8-char-bool-const",
    moduleId: "cp-m2-variables",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.7", "2.8", "2.9"],
    title: "Characters, Booleans and Constants",
    subtitle: "char, bool, const and constexpr",
    estimatedMinutes: 16,
    intro:
      "Three more building blocks. A char holds one character, such as a grade. A bool holds a yes-or-no answer, such as whether a student passed. And a constant is a value that must never change, such as a tax rate, protected by the compiler itself.",

    atoms: [
      {
        id: "a-cp-char",
        title: "Characters: char",
        explain:
          "A char holds exactly one character, written in single quotes: 'A', '7', '?'. Inside the computer every character is stored as a small number using a code table called ASCII, where 'A' is 65, 'B' is 66 and so on. That is why you can do arithmetic with characters, and why 'A' + 1 is 66.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    char grade = 'A';
    std::cout << grade << "\n";
    std::cout << static_cast<int>(grade) << "\n";

    char next = grade + 1;
    std::cout << next << "\n";
    return 0;
}
`,
          expectedOutput: "A\n65\nB",
        },
        why: "static_cast<int>(grade) asks C++ to treat the char as a number so you can see its code. You will meet static_cast properly in Lesson 10. The same trick of moving through the alphabet with + 1 is used for things like seat letters and column labels.",
        mistake:
          "Writing \"A\" in double quotes for a char. Double quotes make text (a string), even when it is one letter; a char needs single quotes.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    char first = 'C';
    char second = first + 2;
    std::cout << first << second << "\n";
    std::cout << second - first << "\n";
    return 0;
}
`,
          question: "Characters are stored as numbers, and arithmetic on them gives numbers. What does this print?",
          expectedOutput: "CE\n2",
          hint: "Two places after C in the alphabet is E. second - first is a subtraction of two codes, which gives a number, not a character.",
          successMessage:
            "CE, then 2. Printing a char variable shows the character; subtracting two chars gives the distance between them as a number.",
        },
      },
      {
        id: "a-cp-bool",
        title: "True or false: bool",
        explain:
          "A bool holds one of two values: true or false. Booleans are how programs record decisions: whether a student passed, whether an account is locked. By default cout prints true as 1 and false as 0; sending std::boolalpha to cout first makes it print the words instead.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    bool passed = true;
    bool locked = false;
    std::cout << passed << " " << locked << "\n";
    std::cout << std::boolalpha << passed << " " << locked << "\n";
    return 0;
}
`,
          expectedOutput: "1 0\ntrue false",
        },
        why: "In Week 4, every if statement and every loop runs on a bool, the answer to a question such as score >= 50. Seeing them as stored values first makes those decisions much easier to follow.",
        codeFill: {
          task: "Fill the gap so hasPaid holds the value true, and the program prints Fees paid: true.",
          code: C`#include <iostream>

int main() {
    bool hasPaid = {{1}};
    std::cout << std::boolalpha << "Fees paid: " << hasPaid << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["true"] }],
          expectedOutput: "Fees paid: true",
          hint: "The two bool values are written in lower case, with no quotes.",
          successMessage: "true, without quotes. With quotes it would be text, not a bool.",
        },
      },
      {
        id: "a-cp-const",
        title: "Constants: values that must not change",
        explain:
          "Adding const in front of a declaration makes the variable read-only: it must be given its value immediately, and any later attempt to change it is a compilation error. Use const for values that are fixed by the rules of the problem, such as a tax rate or a pass mark. By convention many programmers write constants in capitals, such as VAT_RATE.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    const double VAT_RATE = 0.075;
    VAT_RATE = 0.08;
    std::cout << VAT_RATE << "\n";
    return 0;
}
`,
          compileError: "error: assignment of read-only variable 'VAT_RATE'",
        },
        why: "The compiler has stopped a bug before the program could run. Without const, one careless line could change the tax rate halfway through a calculation, and every result after it would be wrong.",
      },
      {
        id: "a-cp-constexpr",
        title: "constexpr: constants known at compile time",
        explain:
          "constexpr goes one step further than const: the value must be known when the program is compiled, not just fixed once it starts. const double rate = userInput; is allowed, because rate is fixed from then on. constexpr int WEEKS = 16; is a value the compiler itself knows, so it can be used anywhere a compile-time number is needed, such as the size of an array in Week 6.",
        table: {
          caption: "const versus constexpr.",
          headers: ["", "const", "constexpr"],
          rows: [
            ["Can it change after it is set?", "No", "No"],
            ["Can its value come from input at run time?", "Yes", "No"],
            ["Is the value known by the compiler?", "Not necessarily", "Always"],
            ["Typical use", "A value read once, then fixed", "Fixed facts: days in a week, a pass mark"],
          ],
        },
        codeFill: {
          task: "The course length is a fixed fact known before the program runs. Fill the gap with the keyword that makes WEEKS a compile-time constant.",
          code: C`#include <iostream>

int main() {
    {{1}} int WEEKS = 16;
    std::cout << "Course length: " << WEEKS << " weeks\n";
    std::cout << "Days of study: " << WEEKS * 5 << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["constexpr"] }],
          expectedOutput: "Course length: 16 weeks\nDays of study: 80",
          hint: "The keyword is const with four more letters: the value is known at compile time, as an EXPRession.",
          successMessage: "constexpr. If someone later tries WEEKS = 17;, the program will not compile.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.10 – 2.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l9-cout-cin",
    moduleId: "cp-m2-variables",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.10", "2.11", "2.12"],
    title: "Output and Input",
    subtitle: "cout and new lines, cin, and reading several values",
    estimatedMinutes: 18,
    intro:
      "Until now, every value was typed into the program by you, the programmer. This lesson lets the user type values while the program runs, with std::cin, which turns a fixed program into a tool anyone can use. It starts with the details of output that make results readable.",

    atoms: [
      {
        id: "a-cp-cout-newlines",
        title: "New lines and special characters",
        explain:
          "Inside quotes, a backslash starts an escape sequence: a way to write a character you cannot type directly. \\n starts a new line, \\t jumps to the next tab position, \\\" prints a double quote, and \\\\ prints one backslash. You can also end a line with std::endl, which starts a new line AND flushes the output (forces it to the screen immediately); \\n is usually preferred because it is faster and just as clear.",
        table: {
          caption: "Escape sequences you will use.",
          headers: ["Write", "Prints"],
          rows: [
            ["\\n", "A new line"],
            ["\\t", "A tab (jump to the next column)"],
            ["\\\"", "A double quote \""],
            ["\\\\", "A backslash \\"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << "She said \"Hi\"\n";
    std::cout << "Path: C:\\cpp\n";
    std::cout << "One\nTwo" << std::endl;
    return 0;
}
`,
          question: "Each escape sequence prints one character. What does this program print?",
          expectedOutput: "She said \"Hi\"\nPath: C:\\cpp\nOne\nTwo",
          hint: "\\\" prints a quote mark, \\\\ prints a single backslash, and the \\n in the middle of the last line splits it in two.",
          successMessage:
            "Four lines. The backslash is never printed by itself: it changes the meaning of the character after it.",
        },
      },
      {
        id: "a-cp-cin",
        title: "Reading input with cin",
        explain:
          "std::cin is the standard input stream: the keyboard. std::cin >> age; waits for the user to type something and press Enter, then converts what they typed to age's type and stores it. The arrows point from cin into the variable, the opposite direction to cout. Always print a prompt first, so the user knows what to type.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int age = 0;
    std::cout << "How old are you? ";
    std::cin >> age;
    std::cout << "Next year you will be " << age + 1 << ".\n";
    return 0;
}
`,
          inputs: ["19"],
          expectedOutput: "How old are you? 19\nNext year you will be 20.",
        },
        why: "The 19 after the question mark is what the user typed, shown the way your terminal shows it. The program paused at cin until the user pressed Enter, then carried on with the value.",
        codeFill: {
          task: "Fill the gap so the program reads the user's score into the variable score.",
          code: C`#include <iostream>

int main() {
    int score = 0;
    std::cout << "Enter your score: ";
    {{1}}
    std::cout << "You scored " << score << " out of 100.\n";
    return 0;
}
`,
          blanks: [{ answers: ["std::cin >> score;"], width: 18 }],
          inputs: ["78"],
          expectedOutput: "Enter your score: 78\nYou scored 78 out of 100.",
          hint: "Use std::cin with the arrows pointing towards the variable, and end the statement with a semicolon.",
          successMessage: "std::cin >> score; Input arrows point into the variable that receives the value.",
        },
      },
      {
        id: "a-cp-cin-text",
        title: "Reading text with std::string",
        explain:
          "To read a word you need a variable that can hold text: std::string, from #include <string>. cin >> name; reads one word: it skips any spaces before it, then stops at the next space or Enter. So typing Ada Lovelace stores only Ada. Week 7 shows how to read a whole line with spaces; until then, ask for one word at a time.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

int main() {
    std::string firstName;
    std::string city;
    std::cout << "First name: ";
    std::cin >> firstName;
    std::cout << "City: ";
    std::cin >> city;
    std::cout << "Welcome, " << firstName << " from " << city << "!\n";
    return 0;
}
`,
          inputs: ["Tunde", "Ibadan"],
          expectedOutput: "First name: Tunde\nCity: Ibadan\nWelcome, Tunde from Ibadan!",
        },
        mistake:
          "Typing a two-word answer, such as Port Harcourt, into cin >> city. city gets Port, and Harcourt is left waiting for the NEXT cin, which then reads it as if the user had typed it. Week 7 fixes this with std::getline.",
      },
      {
        id: "a-cp-cin-multiple",
        title: "Reading several values at once",
        explain:
          "You can chain >> to read several values in one statement: std::cin >> a >> b >> c;. The user can separate the values with spaces or press Enter between them; cin skips the spaces and line breaks and fills the variables in order. The types can differ: a word, then a number, then another number.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int test1 = 0, test2 = 0, exam = 0;
    std::cout << "Enter test 1, test 2 and exam scores: ";
    std::cin >> test1 >> test2 >> exam;
    int total = test1 + test2 + exam;
    std::cout << "Total: " << total << "\n";
    return 0;
}
`,
          inputs: ["15 18 52"],
          expectedOutput: "Enter test 1, test 2 and exam scores: 15 18 52\nTotal: 85",
        },
        why: "int test1 = 0, test2 = 0, exam = 0; declares three variables of the same type in one statement. Each still needs its own initial value.",
        codeFill: {
          task: "Fill the gap so one statement reads the length and then the width of a room, and the program prints its area.",
          code: C`#include <iostream>

int main() {
    double length = 0, width = 0;
    std::cout << "Length and width in metres: ";
    {{1}}
    std::cout << "Area: " << length * width << " square metres\n";
    return 0;
}
`,
          blanks: [{ answers: ["std::cin >> length >> width;"], width: 28 }],
          inputs: ["4.5 3"],
          expectedOutput: "Length and width in metres: 4.5 3\nArea: 13.5 square metres",
          hint: "One std::cin, then >> before each variable, in the order the prompt asks for them.",
          successMessage: "One statement, two values, read in order. The user could also have pressed Enter between them.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 2.13 – 2.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l10-conversion",
    moduleId: "cp-m2-variables",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.13", "2.14", "2.15"],
    title: "Conversion, Division and Formatting",
    subtitle: "Casting, integer division, precision, fixed and setprecision",
    estimatedMinutes: 20,
    intro:
      "This lesson is about the most common source of wrong answers in a beginner's C++: types meeting each other. An average that comes out as a whole number, a decimal that gets chopped off, a price printed with five decimal places. You will learn why each happens and how to control it.",

    atoms: [
      {
        id: "a-cp-conversion",
        title: "Converting between types",
        explain:
          "When a value of one type is stored in a variable of another, C++ converts it. Converting int to double is safe: 7 becomes 7.0. Converting double to int is not: the fractional part is simply cut off, so 3.99 becomes 3, with no rounding. Brace initialisation refuses such a narrowing conversion outright, which is one reason modern C++ likes it.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    double price = 3.99;
    int whole = price;
    double back = whole;
    std::cout << whole << "\n";
    std::cout << back + 0.5 << "\n";
    return 0;
}
`,
          expectedOutput: "3\n3.5",
        },
        why: "3.99 became 3, not 4: converting to int truncates, it does not round. If you want rounding, use std::round from <cmath>, which you will meet in Week 3.",
      },
      {
        id: "a-cp-narrowing",
        title: "Brace initialisation catches narrowing",
        explain:
          "int whole = 3.99; compiles and silently throws away .99. int whole{3.99}; does not compile at all: braces forbid any conversion that could lose information. That turns a silent bug into an error you must deal with on purpose.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int whole{3.99};
    std::cout << whole << "\n";
    return 0;
}
`,
          compileError: "narrowing conversion of '3.9900000000000002e+0' from 'double' to 'int'",
        },
        why: "The odd-looking 3.9900000000000002 is how the compiler sees the double closest to 3.99, a preview of the precision issue later in this lesson. The error itself is the useful part: you are told exactly which conversion would lose data.",
      },
      {
        id: "a-cp-static-cast",
        title: "Explicit conversion with static_cast",
        explain:
          "When you WANT a conversion, say so with static_cast<type>(value). It converts the value for that one calculation without changing the variable. The classic case is an average: with two ints, total / count throws away the fraction before you ever see it, so convert one of them to double first. Older code writes (double)total; it works, but static_cast is clearer and safer, and is what this course uses.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int total = 245;
    int count = 3;
    std::cout << "Wrong:  " << total / count << "\n";
    std::cout << "Right:  " << static_cast<double>(total) / count << "\n";
    return 0;
}
`,
          expectedOutput: "Wrong:  81\nRight:  81.6667",
        },
        codeFill: {
          task: "Four test scores add up to 287. Fill the gap so the average is calculated as a decimal, not a whole number.",
          code: C`#include <iostream>

int main() {
    int total = 287;
    int count = 4;
    double average = {{1}} / count;
    std::cout << "Average: " << average << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["static_cast<double>(total)", "(double)total", "double(total)"], width: 26 }],
          expectedOutput: "Average: 71.75",
          hint: "Convert total to double before dividing, using static_cast<double>( ... ).",
          successMessage:
            "71.75. Without the cast it would be 71: the division would happen in whole numbers and only the result would be converted.",
        },
      },
      {
        id: "a-cp-integer-division",
        title: "Integer division, remainders and precision",
        explain:
          "When both sides of / are whole numbers, C++ does integer division: the answer is a whole number and the remainder is discarded, so 17 / 5 is 3. The % operator gives that remainder: 17 % 5 is 2. If either side is a double, the division is a normal decimal division. Decimals have their own limit: a double stores most fractions as a very close approximation, not exactly, so 0.1 + 0.2 is not exactly 0.3.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << (0.1 + 0.2 == 0.3) << "\n";
    std::cout << (0.5 + 0.25 == 0.75) << "\n";
    return 0;
}
`,
          expectedOutput: "0\n1",
        },
        why: "0.5 and 0.25 are exact in binary, so their sum is exact. 0.1 and 0.2 are not, and their tiny errors add up. Never compare decimals with == when exactness matters; for money, many systems store whole kobo or cents in a long long instead.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    std::cout << 17 / 5 << "\n";
    std::cout << 17 % 5 << "\n";
    std::cout << 17 / 5.0 << "\n";
    std::cout << 2 / 3 * 9 << "\n";
    return 0;
}
`,
          question: "Watch which divisions are between two whole numbers. What does this print?",
          expectedOutput: "3\n2\n3.4\n0",
          hint: "The last line runs left to right: 2 / 3 first, as whole numbers. What is 2 / 3 without its fraction?",
          successMessage:
            "3, 2, 3.4 and 0. The last one is the classic trap: 2 / 3 is 0 in integer division, and 0 × 9 is still 0.",
        },
      },
      {
        id: "a-cp-fixed-setprecision",
        title: "Formatting numbers: fixed and setprecision",
        explain:
          "For results people will read, especially money, control the format. Include <iomanip>, then send std::fixed and std::setprecision(2) to cout: every decimal printed afterwards shows exactly 2 digits after the point, rounded. Without std::fixed, setprecision counts significant digits instead of decimal places. Both settings stay in effect until you change them.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <iomanip>

int main() {
    double price = 1250.5;
    double vat = price * 0.075;
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Price: " << price << "\n";
    std::cout << "VAT:   " << vat << "\n";
    std::cout << "Total: " << price + vat << "\n";
    return 0;
}
`,
          expectedOutput: "Price: 1250.50\nVAT:   93.79\nTotal: 1344.29",
        },
        codeFill: {
          task: "Fill the gap so the average prints with exactly one decimal place: Average: 71.8",
          code: C`#include <iostream>
#include <iomanip>

int main() {
    double average = 71.75;
    std::cout << {{1}};
    std::cout << "Average: " << average << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: ["std::fixed << std::setprecision(1)", "std::setprecision(1) << std::fixed"],
              width: 34,
            },
          ],
          expectedOutput: "Average: 71.8",
          hint: "Send two things to cout: std::fixed, then std::setprecision with the number of decimal places you want.",
          successMessage: "71.75 rounded to one decimal place is 71.8. fixed plus setprecision is how every report in this course formats its numbers.",
        },
      },
    ],

    task: {
      title: "Mini-project: student information and result calculator",
      intro:
        "Write result.cpp: a program that collects a student's details and scores, then prints a neat result report. Build and test it step by step with g++ -std=c++17 -Wall -Wextra.",
      prompts: [
        "Read the student's first name, surname and age with std::cin (one word each), after a clear prompt for each.",
        "Read three scores out of 100 with a single cin statement.",
        "Store the number of subjects (3) and the pass mark (50) as constants, using constexpr.",
        "Calculate the total and the average; make sure the average keeps its decimal part by using static_cast.",
        "Print a report with a title line, the student's full name and age, the total, and the average to exactly two decimal places using std::fixed and std::setprecision.",
        "Store whether the average is at least the pass mark in a bool called passed, and print it as true or false with std::boolalpha.",
        "Test it three times with different scores, including scores that make the average a whole number and one that does not. Check each average with a calculator.",
      ],
      closing:
        "Keep result.cpp. In Week 4 it will learn to assign a letter grade and repeat for a whole class.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
