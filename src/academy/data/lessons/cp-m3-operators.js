/**
 * C++ PROGRAMMING · MODULE 3 · OPERATORS AND EXPRESSIONS
 *
 * Curriculum 3.1 – 3.10. Perform calculations and understand exactly how
 * C++ evaluates an expression. Every program is compiled and run by
 * `npm run validate:content`, including the one that is meant to WARN: the
 * course teaches learners to read warnings, so it shows a real one.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s3-operators";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 3.1 – 3.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l11-arithmetic",
    moduleId: "cp-m3-operators",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2", "3.3"],
    title: "Arithmetic and Assignment",
    subtitle: "+, -, *, /, %, compound assignment, ++ and --",
    estimatedMinutes: 18,
    intro:
      "Operators are the verbs of C++: they do things to values. This lesson covers the arithmetic operators, the shortcuts programmers use to update a variable, and the increment and decrement operators that gave C++ its name.",

    atoms: [
      {
        id: "a-cp-arith-ops",
        title: "The five arithmetic operators",
        explain:
          "+ adds, - subtracts, * multiplies, / divides and % gives the remainder after whole-number division. With two ints, / throws the remainder away, which is exactly why % exists: together they split a number into whole groups and what is left over. % works only on whole numbers.",
        table: {
          caption: "With a = 17 and b = 5, both int.",
          headers: ["Expression", "Value", "Note"],
          rows: [
            ["a + b", "22", ""],
            ["a - b", "12", ""],
            ["a * b", "85", ""],
            ["a / b", "3", "Integer division: the .4 is discarded"],
            ["a % b", "2", "The remainder: 17 = 3 × 5 + 2"],
            ["17.0 / 5", "3.4", "One side is a double, so it is a decimal division"],
          ],
        },
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int totalSeconds = 3725;
    int hours = totalSeconds / 3600;
    int minutes = totalSeconds % 3600 / 60;
    int seconds = totalSeconds % 60;
    cout << hours << "h " << minutes << "m " << seconds << "s\n";
    return 0;
}
`,
          expectedOutput: "1h 2m 5s",
        },
        why: "/ and % together turn one large count into units: seconds into hours and minutes, kobo into naira and kobo, days into weeks and days. You will use this pattern constantly.",
        codeFill: {
          task: "A price of 1575 kobo should be shown in naira and kobo. Fill the two gaps: the whole naira, then the kobo left over (100 kobo = 1 naira).",
          code: C`#include <iostream>
using namespace std;

int main() {
    int priceKobo = 1575;
    int naira = {{1}};
    int kobo = {{2}};
    cout << naira << " naira " << kobo << " kobo\n";
    return 0;
}
`,
          blanks: [{ answers: ["priceKobo / 100"] }, { answers: ["priceKobo % 100"] }],
          expectedOutput: "15 naira 75 kobo",
          hint: "Whole groups of 100 come from /, and what is left over comes from %.",
          successMessage: "15 naira 75 kobo. Division for the whole groups, remainder for the rest.",
        },
      },
      {
        id: "a-cp-compound-assign",
        title: "Assignment and compound assignment",
        explain:
          "= stores the value on its right in the variable on its left. Updating a variable using its own value is so common that C++ has shortcuts: balance += 500; means balance = balance + 500;. The same works for -=, *=, /= and %=. They are shorter, and they make it obvious that a variable is being updated rather than replaced.",
        table: {
          caption: "Each shortcut and what it means.",
          headers: ["Shortcut", "Means"],
          rows: [
            ["x += 5;", "x = x + 5;"],
            ["x -= 5;", "x = x - 5;"],
            ["x *= 2;", "x = x * 2;"],
            ["x /= 2;", "x = x / 2;"],
            ["x %= 3;", "x = x % 3;"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int balance = 10000;
    balance -= 2500;
    balance += 1200;
    balance *= 2;
    balance /= 3;
    cout << balance << "\n";
    return 0;
}
`,
          question: "Apply each update in order. What does the program print?",
          expectedOutput: "5800",
          hint: "10000 → 7500 → 8700 → 17400 → divide by 3 in whole numbers.",
          successMessage: "5800. Each line changes balance, and the next line starts from the new value.",
        },
      },
      {
        id: "a-cp-increment",
        title: "Increment and decrement: ++ and --",
        explain:
          "++ adds one to a variable and -- subtracts one. They come in two forms. ++count (prefix) adds one and gives you the NEW value. count++ (postfix) adds one but gives you the OLD value. On a line of its own, count++; and ++count; do exactly the same thing; the difference only shows when the value is used in the same expression.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int count = 5;
    count++;
    cout << count << "\n";

    int a = 5;
    int b = a++;
    cout << "a = " << a << ", b = " << b << "\n";

    int c = 5;
    int d = ++c;
    cout << "c = " << c << ", d = " << d << "\n";
    return 0;
}
`,
          expectedOutput: "6\na = 6, b = 5\nc = 6, d = 6",
        },
        why: "b got 5 because a++ hands over the old value before incrementing. d got 6 because ++c increments first. Professional style keeps ++ on its own line, or in a loop's update, so nobody has to work this out.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int stock = 10;
    int sold = stock--;
    int left = --stock;
    cout << stock << " " << sold << " " << left << "\n";
    return 0;
}
`,
          question: "Postfix gives the old value, prefix gives the new one. What does this print?",
          expectedOutput: "8 10 8",
          hint: "stock-- hands over 10, then stock becomes 9. --stock makes it 8 first, then hands over 8.",
          successMessage: "8 10 8. Two decrements in total, and each form handed over a different value.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 3.4 – 3.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l12-comparison-logic",
    moduleId: "cp-m3-operators",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.4", "3.5"],
    title: "Comparison and Logic",
    subtitle: "==, !=, <, >, <=, >=, and &&, ||, !",
    estimatedMinutes: 18,
    intro:
      "Next week your programs start making decisions. Every decision is a question with a true or false answer, and this lesson teaches you to ask those questions in C++: comparing values, and combining several comparisons into one condition.",

    atoms: [
      {
        id: "a-cp-comparison",
        title: "Comparison operators",
        explain:
          "A comparison asks a question about two values and produces a bool: true or false. == asks \"are they equal?\" and != asks \"are they different?\". <, >, <= and >= compare sizes. The most famous C++ bug is writing = (store) when you meant == (compare).",
        table: {
          caption: "With score = 65.",
          headers: ["Expression", "Question", "Result"],
          rows: [
            ["score == 65", "Is score equal to 65?", "true"],
            ["score != 50", "Is score different from 50?", "true"],
            ["score < 50", "Is score less than 50?", "false"],
            ["score >= 65", "Is score at least 65?", "true"],
            ["score > 65", "Is score more than 65?", "false"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int score = 49;
    int passMark = 50;
    cout << boolalpha;
    cout << (score >= passMark) << "\n";
    cout << (score + 1 == passMark) << "\n";
    cout << (score != passMark) << "\n";
    return 0;
}
`,
          question: "Each comparison produces true or false, and boolalpha prints the words. What does this print?",
          expectedOutput: "false\ntrue\ntrue",
          hint: "49 is not at least 50. 49 + 1 is exactly 50. 49 is different from 50.",
          successMessage: "false, true, true. The brackets matter: they make the comparison happen before << sends the result to cout.",
        },
      },
      {
        id: "a-cp-logical",
        title: "Logical operators: &&, || and !",
        explain:
          "Logical operators combine bools. && (AND) is true only when both sides are true. || (OR) is true when at least one side is true. ! (NOT) flips true to false and false to true. Real rules are usually combinations: a student can register if they are at least 16 AND have paid; a ticket is discounted if the buyer is a student OR over 60.",
        table: {
          caption: "The truth table for A && B and A || B.",
          headers: ["A", "B", "A && B", "A || B", "!A"],
          rows: [
            ["true", "true", "true", "true", "false"],
            ["true", "false", "false", "true", "false"],
            ["false", "true", "false", "true", "true"],
            ["false", "false", "false", "false", "true"],
          ],
        },
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int age = 17;
    bool hasPaid = true;
    bool isStudent = false;
    cout << boolalpha;
    cout << "Can register: " << (age >= 16 && hasPaid) << "\n";
    cout << "Gets discount: " << (isStudent || age >= 60) << "\n";
    cout << "Owes fees: " << !hasPaid << "\n";
    return 0;
}
`,
          expectedOutput: "Can register: true\nGets discount: false\nOwes fees: false",
        },
      },
      {
        id: "a-cp-range-check",
        title: "Checking that a value is in range",
        explain:
          "A very common condition asks whether a value lies between two limits, such as a score from 0 to 100. That is two comparisons joined by &&: score >= 0 && score <= 100. C++ also stops early: if the left side of && is false the right side is never evaluated, and if the left side of || is true the right side is skipped. This is called short-circuit evaluation, and it lets you put a safety check first, as in count != 0 && total / count > 50.",
        codeFill: {
          task: "A valid score is from 0 to 100, inclusive. Fill the gap with the condition that checks score is valid.",
          code: C`#include <iostream>
using namespace std;

int main() {
    int score = 87;
    bool valid = {{1}};
    cout << boolalpha << score << " is valid: " << valid << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "score >= 0 && score <= 100",
                "0 <= score && score <= 100",
                "score <= 100 && score >= 0",
                "(score >= 0) && (score <= 100)"
              ],
              width: 28,
            },
          ],
          expectedOutput: "87 is valid: true",
          hint: "Two comparisons: at least 0, and at most 100. Join them with the operator that needs BOTH to be true.",
          successMessage: "Both limits, joined with &&. Either comparison alone would let invalid scores through.",
        },
      },
      {
        id: "a-cp-chained-comparison",
        title: "Why 0 <= x <= 100 does not mean what it says",
        explain:
          "In maths, 0 ≤ x ≤ 100 is one statement. In C++, 0 <= x <= 100 is two comparisons run left to right: first 0 <= x, which gives true or false, and then that bool (as 1 or 0) is compared with 100. Both 1 and 0 are always <= 100, so the whole thing is true for ANY x. g++ with -Wall warns you about it, which is one more reason to compile with warnings on.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    int x = 150;
    cout << (0 <= x <= 100) << "\n";
    return 0;
}
`,
          compileWarning: "do not have their mathematical meaning",
          expectedOutput: "1",
        },
        example:
          "g++ -std=c++17 -Wall -Wextra range.cpp -o range prints:\n\n  range.cpp:5:24: warning: comparisons like 'X<=Y<=Z' do not have\n  their mathematical meaning [-Wparentheses]\n\nThe program still compiles and prints 1 (true) for x = 150.\nA warning is the compiler telling you that your code is legal\nbut almost certainly not what you meant.",
        decision: {
          scenario: "A classmate writes if (18 <= age <= 65) to check that age is between 18 and 65. Their program says a 90-year-old qualifies.",
          question: "What is the fix?",
          options: [
            {
              id: "a",
              text: "Write it as two comparisons joined with &&: age >= 18 && age <= 65",
              why: "C++ evaluates one comparison at a time. Each limit needs its own comparison, and && requires both to hold.",
            },
            {
              id: "b",
              text: "Add brackets: (18 <= age) <= 65",
              whyWrong: "That is exactly what C++ was already doing: compare the true/false result with 65, which is always true.",
            },
            {
              id: "c",
              text: "Use || instead: age >= 18 || age <= 65",
              whyWrong: "With OR, every age passes: any number is either at least 18 or at most 65.",
            },
            {
              id: "d",
              text: "Change the type of age to double",
              whyWrong: "The type is not the problem; the comparison is.",
            },
          ],
          correct: "a",
          aftermath: "Never chain comparisons in C++. One comparison per limit, joined by &&.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 3.6 – 3.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l13-precedence",
    moduleId: "cp-m3-operators",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.6", "3.7", "3.8"],
    title: "How C++ Evaluates an Expression",
    subtitle: "Precedence, associativity, evaluation order and conversion",
    estimatedMinutes: 18,
    intro:
      "2 + 3 * 4 is 14, not 20, in C++ as in maths. But C++ has many more operators than maths, and it mixes types as it goes. This lesson gives you the rules that decide which part of an expression happens first, and what type the answer comes out as.",

    atoms: [
      {
        id: "a-cp-precedence",
        title: "Precedence and associativity",
        explain:
          "Precedence decides which operator goes first: multiplication, division and remainder before addition and subtraction; arithmetic before comparisons; comparisons before && and ||; assignment last. Associativity decides the order when operators have equal precedence: most go left to right, so 10 - 4 - 3 is (10 - 4) - 3. Assignment goes right to left, so a = b = 5 sets b first. Brackets override everything, and when in doubt, use them.",
        table: {
          caption: "The operators so far, from highest precedence (done first) to lowest.",
          headers: ["Level", "Operators", "Associativity"],
          rows: [
            ["1", "( ) brackets", "Innermost first"],
            ["2", "! ++ -- and unary minus", "Right to left"],
            ["3", "* / %", "Left to right"],
            ["4", "+ -", "Left to right"],
            ["5", "< <= > >=", "Left to right"],
            ["6", "== !=", "Left to right"],
            ["7", "&&", "Left to right"],
            ["8", "||", "Left to right"],
            ["9", "= += -= *= /= %=", "Right to left"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << 2 + 3 * 4 - 6 / 2 << "\n";
    cout << (2 + 3) * (4 - 6) / 2 << "\n";
    cout << 10 - 4 - 3 << "\n";
    cout << 100 / 10 / 5 << "\n";
    return 0;
}
`,
          question: "Apply precedence first, then left-to-right order. What are the four results?",
          expectedOutput: "11\n-5\n3\n2",
          hint: "Line 1: 3 * 4 and 6 / 2 first. Line 2: brackets give 5 * -2. Lines 3 and 4 work left to right.",
          successMessage: "11, -5, 3 and 2. If 100 / 10 / 5 went right to left it would be 50; left to right gives 2.",
        },
      },
      {
        id: "a-cp-eval-order",
        title: "Evaluation order: what C++ does NOT promise",
        explain:
          "Precedence says how an expression is grouped, not always which part is calculated first. In price() + tax(), C++ may call either function first. Usually that does not matter. It matters a great deal if one part changes a variable that another part uses: writing i++ + i++, or using x and changing x in the same expression, gives undefined behaviour, meaning the C++ standard makes no promise at all about the result.",
        example:
          "Do not write:\n\n  int i = 1;\n  int n = i++ + i++;      // undefined behaviour\n  cout << i << ++i;  // fine in C++17, confusing in any version\n\nWrite instead:\n\n  int i = 1;\n  int first = i;\n  i++;\n  int second = i;\n  i++;\n  int n = first + second;  // clearly 1 + 2\n\nOne change per statement. The compiler produces equally fast code,\nand every reader knows exactly what happens.",
        decision: {
          scenario: "You see the line total = count++ + count * 2; in a program you are reviewing.",
          question: "What is the best response?",
          options: [
            {
              id: "a",
              text: "Rewrite it so count is changed in a separate statement: the expression both uses and modifies count, so its result is not reliable",
              why: "Using and modifying the same variable in one expression risks undefined behaviour and always costs readers time. Split it into clear steps.",
            },
            {
              id: "b",
              text: "Leave it: precedence rules make the result certain",
              whyWrong: "Precedence decides grouping, not when count++ takes effect relative to the other use of count.",
            },
            {
              id: "c",
              text: "Add more brackets until it looks clear",
              whyWrong: "Brackets change grouping, but the problem is modifying and using count in one expression. Brackets cannot fix that.",
            },
            {
              id: "d",
              text: "Change count to a double",
              whyWrong: "The type has nothing to do with it.",
            },
          ],
          correct: "a",
          aftermath: "If an expression needs explaining, split it. Clever one-liners are where bugs hide.",
        },
      },
      {
        id: "a-cp-implicit-explicit",
        title: "Implicit and explicit conversion in expressions",
        explain:
          "When an operator meets two different types, C++ converts one so they match, following fixed rules: char and bool become int, and if either side is a double, the other becomes a double too. This happens one operator at a time, from the order of evaluation. So in 5 / 2 * 2.0, the 5 / 2 is done first in whole numbers (2), and only then does 2.0 make it a double. Use static_cast to choose the conversion yourself.",
        code: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << 5 / 2 * 2.0 << "\n";
    cout << 5 * 2.0 / 2 << "\n";
    cout << 'A' + 1 << "\n";
    cout << true + true << "\n";
    return 0;
}
`,
          expectedOutput: "4\n5\n66\n2",
        },
        why: "The first two lines use the same numbers in a different order and get different answers. Conversion happens operator by operator, so the position of the first double decides when decimals start being kept.",
        codeFill: {
          task: "c holds a temperature of 37 °C as an int. c * 9 / 5 + 32 would do integer division and give 98. Fill the gap with a formula that gives the exact Fahrenheit value, 98.6.",
          code: C`#include <iostream>
using namespace std;

int main() {
    int c = 37;
    double f = {{1}};
    cout << c << " C = " << f << " F\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "c * 9.0 / 5 + 32",
                "c * 9.0 / 5.0 + 32",
                "9.0 * c / 5 + 32",
                "c * 1.8 + 32",
                "1.8 * c + 32",
                "static_cast<double>(c) * 9 / 5 + 32",
                "c * 9 / 5.0 + 32"
              ],
              width: 24,
            },
          ],
          expectedOutput: "37 C = 98.6 F",
          hint: "Make one of the numbers in the multiplication or division a double, such as 9.0, so the division keeps its decimals.",
          successMessage: "98.6. One double in the right place, and every step after it keeps the fraction.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 3.9 – 3.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l14-formulas",
    moduleId: "cp-m3-operators",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.9", "3.10"],
    title: "Formulas Without Mistakes",
    subtitle: "Common arithmetic traps, <cmath>, and turning formulas into C++",
    estimatedMinutes: 20,
    intro:
      "Most real programs contain formulas: interest, areas, conversions, percentages. This lesson collects the arithmetic mistakes that catch almost every beginner, gives you the maths library, and shows a reliable way to turn a formula from a textbook into correct C++.",

    atoms: [
      {
        id: "a-cp-arith-mistakes",
        title: "Common arithmetic mistakes",
        explain:
          "Five traps account for most wrong answers. Integer division in averages. Forgetting brackets, as in a + b / 2. Using ^ for powers: in C++ ^ is a bitwise operator, not \"to the power of\", so 2 ^ 3 is 1. Integer overflow when values grow past an int's limit. And negative division: C++ always truncates towards zero, so -7 / 2 is -3 and -7 % 2 is -1.",
        table: {
          caption: "Each trap and its fix.",
          headers: ["Wrong", "Gives", "Right"],
          rows: [
            ["sum / count (both int)", "A whole number", "static_cast<double>(sum) / count"],
            ["a + b / 2", "a plus half of b", "(a + b) / 2"],
            ["2 ^ 3", "1", "pow(2, 3), which gives 8"],
            ["int bytes = 3000000000;", "Overflow", "long long bytes = 3000000000LL;"],
            ["percent = part / whole * 100;", "0 when part < whole", "percent = part * 100.0 / whole;"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
using namespace std;

int main() {
    cout << (2 ^ 3) << "\n";
    cout << -7 / 2 << "\n";
    cout << -7 % 2 << "\n";
    int part = 45, whole = 60;
    cout << part / whole * 100 << "\n";
    return 0;
}
`,
          question: "Every line here is a trap from the table. What does the program really print?",
          compileWarning: "did you mean '1 << 3' (8)?",
          expectedOutput: "1\n-3\n-1\n0",
          hint: "^ is not a power. Division truncates towards zero. And 45 / 60 in whole numbers is 0, before the * 100 ever happens.",
          successMessage:
            "1, -3, -1 and 0. Recent versions of g++ even warn about the first line: \"result of '2^3' is 1; did you mean '1 << 3' (8)?\". The other three traps compile silently, which is why you must recognise them yourself.",
        },
      },
      {
        id: "a-cp-cmath",
        title: "The maths library: <cmath>",
        explain:
          "#include <cmath> gives you the mathematical functions: pow(x, y) for powers, sqrt for square roots, abs for the size of a number without its sign, and round, floor and ceil for rounding to the nearest, down, and up. They take and return doubles, so their results can be printed or used in further calculations.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <cmath>
using namespace std;

int main() {
    cout << pow(2, 10) << "\n";
    cout << sqrt(144) << "\n";
    cout << abs(-15) << "\n";
    cout << round(2.5) << " " << floor(4.9) << " " << ceil(4.1) << "\n";
    return 0;
}
`,
          expectedOutput: "1024\n12\n15\n3 4 5",
        },
        why: "ceil is how you answer \"how many buses do 130 students need if each holds 50?\": 130 / 50.0 is 2.6, and you cannot hire 0.6 of a bus, so ceil gives 3.",
      },
      {
        id: "a-cp-formula-translate",
        title: "Translating a formula into C++",
        explain:
          "To turn a formula into C++: give every quantity a well-named variable of the right type; write multiplication explicitly, because PRT means P * R * T; add brackets wherever the formula has a fraction bar or grouping; use pow for powers; and test the result against one example you have worked by hand.",
        table: {
          caption: "Formulas and their C++.",
          headers: ["Formula", "C++"],
          rows: [
            ["Simple interest I = PRT / 100", "principal * rate * years / 100"],
            ["Area of a circle A = πr²", "PI * radius * radius"],
            ["Fahrenheit F = 9C/5 + 32", "celsius * 9.0 / 5 + 32"],
            ["Compound A = P(1 + r/n)^(nt)", "p * pow(1 + r / n, n * t)"],
            ["Percentage = part / whole × 100", "part * 100.0 / whole"],
          ],
        },
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

int main() {
    double p = 100000;  // amount invested, naira
    double r = 0.10;    // 10% a year
    double n = 12;      // compounded monthly
    double t = 2;       // years
    double amount = p * pow(1 + r / n, n * t);
    cout << fixed << setprecision(2);
    cout << "After " << t << " years: " << amount << "\n";
    return 0;
}
`,
          expectedOutput: "After 2.00 years: 122039.10",
        },
        why: "fixed affects every double printed afterwards, including t, which is why it shows as 2.00. If you want t without decimals, make it an int.",
        codeFill: {
          task: "Fill the gap with the simple interest formula, I = PRT / 100, using the variables provided.",
          code: C`#include <iostream>
using namespace std;

int main() {
    double principal = 50000;
    double rate = 12.5;
    double years = 3;
    double interest = {{1}};
    cout << "Interest: " << interest << " naira\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "principal * rate * years / 100",
                "principal * rate * years / 100.0",
                "(principal * rate * years) / 100",
                "principal * years * rate / 100",
                "rate * principal * years / 100"
              ],
              width: 32,
            },
          ],
          expectedOutput: "Interest: 18750 naira",
          hint: "PRT means P times R times T: write each * explicitly, then divide by 100.",
          successMessage: "18750. Check it by hand: 50,000 × 12.5% = 6,250 a year, times 3 years.",
        },
      },
      {
        id: "a-cp-formula-brackets",
        title: "Brackets decide the formula",
        explain:
          "A fraction bar in a textbook groups everything above it and everything below it. In C++ there is no fraction bar, only /, so you must add the grouping yourself with brackets. Body Mass Index is weight divided by height squared: weight / (height * height). Without the brackets, C++ divides by height and then multiplies by height again, cancelling out.",
        decision: {
          scenario: "BMI = weight ÷ height². A student weighs 68 kg and is 1.75 m tall.",
          question: "Which C++ expression is correct?",
          options: [
            {
              id: "a",
              text: "weight / (height * height)",
              why: "The brackets make height × height happen first, so weight is divided by the square. 68 / 3.0625 ≈ 22.2.",
            },
            {
              id: "b",
              text: "weight / height * height",
              whyWrong: "Left to right: weight / height, then times height. The heights cancel and you get back 68.",
            },
            {
              id: "c",
              text: "weight / height ^ 2",
              whyWrong: "^ is not a power in C++. Use height * height or pow(height, 2).",
            },
            {
              id: "d",
              text: "(weight / height) * 2",
              whyWrong: "Squaring is multiplying by itself, not by 2.",
            },
          ],
          correct: "a",
          aftermath: "Whenever a formula has a fraction bar, bracket the whole numerator and the whole denominator.",
        },
      },
    ],

    task: {
      title: "Mini-project: a multi-purpose calculator",
      intro:
        "Write calc.cpp: a program that reads values from the user and prints several calculations, all formatted to two decimal places. No if statements are needed yet; each section simply runs in turn.",
      prompts: [
        "Read two numbers and print their sum, difference, product, quotient and, using their whole-number parts, the remainder.",
        "Read a mark and a maximum mark and print the percentage, making sure the division keeps its decimals.",
        "Read a temperature in Celsius and print it in Fahrenheit and in Kelvin (K = C + 273.15).",
        "Read a principal, a yearly rate and a number of years, and print the simple interest and the total amount repaid.",
        "Use fixed and setprecision(2) for every result, and store any fixed values (such as 273.15) as constexpr constants.",
        "Test each section with a value you have worked out by hand first, including at least one case that would go wrong with integer division.",
      ],
      closing:
        "Keep calc.cpp. Next week it becomes a menu-driven calculator that asks which operation to perform.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
