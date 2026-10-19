/**
 * C++ PROGRAMMING · MODULE 4 · CONDITIONS, LOOPS AND PROGRAM FLOW
 *
 * Curriculum 4.1 – 4.15. Teach programs to make decisions and repeat tasks,
 * ending with the Phase 1 mastery checkpoint: several scores in, an average
 * and a grade out, repeated for several students. Every program is compiled
 * and run by `npm run validate:content`, including the two that are meant to
 * produce a compiler warning, because reading warnings is part of the skill.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s4-control";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 4.1 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l15-if",
    moduleId: "cp-m4-control",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3"],
    title: "Making Decisions with if",
    subtitle: "Boolean conditions, if and if-else",
    estimatedMinutes: 18,
    intro:
      "Every program so far ran every line, top to bottom. Real programs choose: pass or fail, approve or decline, enough stock or not. This lesson gives your programs that choice, using the true-or-false questions you learned to ask last week.",

    atoms: [
      {
        id: "a-cp-bool-conditions",
        title: "Conditions are true-or-false questions",
        explain:
          "A condition is any expression that C++ can treat as true or false: a comparison such as score >= 50, a bool variable such as hasPaid, or a combination with && and ||. C++ also treats numbers as conditions: 0 counts as false and any other number counts as true. That rule is useful, but it is also behind one of the classic bugs, as you will see below.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int itemsInCart = 3;
    bool loggedIn = true;
    std::cout << std::boolalpha;
    std::cout << (itemsInCart > 0 && loggedIn) << "\n";
    std::cout << static_cast<bool>(itemsInCart) << "\n";
    std::cout << static_cast<bool>(0) << "\n";
    return 0;
}
`,
          expectedOutput: "true\ntrue\nfalse",
        },
        why: "itemsInCart > 0 and itemsInCart used directly as a condition mean the same thing here, but the comparison says what you mean. Prefer explicit comparisons: they are clearer and harder to get wrong.",
      },
      {
        id: "a-cp-if",
        title: "The if statement",
        explain:
          "if (condition) { statements } runs the statements in the braces only when the condition is true. When it is false, the whole block is skipped and the program carries on after the closing brace. The condition always goes in round brackets, and there is no semicolon after them.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int score = 0;
    std::cout << "Score: ";
    std::cin >> score;
    if (score >= 50) {
        std::cout << "Passed. Well done!\n";
    }
    std::cout << "Result recorded.\n";
    return 0;
}
`,
          inputs: ["64"],
          expectedOutput: "Score: 64\nPassed. Well done!\nResult recorded.",
        },
        mistake:
          "if (score >= 50); { ... } with a semicolon after the brackets. The semicolon is an empty statement, so the if controls nothing and the block below runs every time. g++ -Wextra warns: \"suggest braces around empty body in an 'if' statement\".",
        codeFill: {
          task: "An order of 10,000 naira or more gets free delivery. Fill the gap with the condition.",
          code: C`#include <iostream>

int main() {
    int orderTotal = 0;
    std::cout << "Order total: ";
    std::cin >> orderTotal;
    if ({{1}}) {
        std::cout << "Free delivery!\n";
    }
    std::cout << "Thank you for shopping.\n";
    return 0;
}
`,
          blanks: [{ answers: ["orderTotal >= 10000", "10000 <= orderTotal", "orderTotal > 9999"] }],
          inputs: ["12500"],
          expectedOutput: "Order total: 12500\nFree delivery!\nThank you for shopping.",
          hint: "\"10,000 or more\" means greater than or equal to, written >=.",
          successMessage: "orderTotal >= 10000. Try it in VS Code with 9999 as well: the free-delivery line disappears.",
        },
      },
      {
        id: "a-cp-if-else",
        title: "if-else: one of two paths",
        explain:
          "if-else chooses between two blocks: the if block when the condition is true, the else block when it is false. Exactly one of them runs, never both and never neither. Always use braces, even for a single statement: they make the structure obvious and prevent a whole family of bugs when lines are added later.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int balance = 5000;
    int withdrawal = 8000;
    if (withdrawal <= balance) {
        balance -= withdrawal;
        std::cout << "Please take your cash.\n";
    } else {
        std::cout << "Insufficient funds.\n";
    }
    std::cout << "Balance: " << balance << "\n";
    return 0;
}
`,
          expectedOutput: "Insufficient funds.\nBalance: 5000",
        },
        mistake:
          "if (pin = 1234) instead of if (pin == 1234). The single = STORES 1234 in pin, and the condition is then 1234, which is non-zero, so true: every PIN is accepted. g++ -Wall warns \"suggest parentheses around assignment used as truth value\". Treat that warning as an error.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int temperature = 31;
    if (temperature > 30) {
        std::cout << "Hot\n";
        temperature -= 5;
    } else {
        std::cout << "Mild\n";
    }
    if (temperature > 30) {
        std::cout << "Still hot\n";
    } else {
        std::cout << "Cooler now\n";
    }
    return 0;
}
`,
          question: "Two separate if-else statements, and the first one changes temperature. What does this print?",
          expectedOutput: "Hot\nCooler now",
          hint: "31 > 30, so the first if-block runs and lowers temperature to 26. The second if-else tests 26.",
          successMessage: "Hot, then Cooler now. Each if-else makes its choice using the values at the moment it runs.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 4.4 – 4.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l16-branches",
    moduleId: "cp-m4-control",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.4", "4.5", "4.6", "4.7"],
    title: "Many Paths",
    subtitle: "Nested conditions, else if, switch and the ?: operator",
    estimatedMinutes: 22,
    intro:
      "Real decisions have more than two outcomes. A grade is A, B, C, D or F; a menu has five options; a login fails for different reasons. This lesson gives you four tools for multi-way decisions, and teaches you when each one is the clearest choice.",

    atoms: [
      {
        id: "a-cp-nested",
        title: "Nested conditions",
        explain:
          "An if can sit inside another if. The inner condition is only checked when the outer one is true, which lets you ask questions in a sensible order: first is the username right, and only then is the PIN right. Indentation shows the nesting; without it, nested code is very hard to follow.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

int main() {
    std::string username = "ada";
    int pin = 4321;
    if (username == "ada") {
        if (pin == 1234) {
            std::cout << "Welcome back, Ada.\n";
        } else {
            std::cout << "Wrong PIN.\n";
        }
    } else {
        std::cout << "Unknown user.\n";
    }
    return 0;
}
`,
          expectedOutput: "Wrong PIN.",
        },
        why: "Nesting gives a precise message for each failure. Keep it shallow, though: three levels deep is already hard to read, and the else if ladder and early checks you are about to meet usually do the job more clearly.",
      },
      {
        id: "a-cp-else-if",
        title: "The else if ladder",
        explain:
          "When one value must be sorted into several bands, chain conditions with else if. C++ checks them from the top and runs the FIRST block whose condition is true, then skips the rest. That is why order matters: check the highest band first, and each later condition can assume the earlier ones failed. A final else catches everything left.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int score = 67;
    char grade;
    if (score >= 70) {
        grade = 'A';
    } else if (score >= 60) {
        grade = 'B';
    } else if (score >= 50) {
        grade = 'C';
    } else if (score >= 45) {
        grade = 'D';
    } else {
        grade = 'F';
    }
    std::cout << score << " -> " << grade << "\n";
    return 0;
}
`,
          expectedOutput: "67 -> B",
        },
        mistake:
          "Putting the lowest band first: if (score >= 45) grade = 'D'; else if (score >= 70) .... A score of 95 is at least 45, so it gets D and the ladder stops there.",
        codeFill: {
          task: "A shop gives 15% off orders of 50,000 naira or more, 10% off orders of 20,000 or more, and nothing otherwise. Fill the two conditions in the right order.",
          code: C`#include <iostream>

int main() {
    int order = 32000;
    int discountPercent = 0;
    if ({{1}}) {
        discountPercent = 15;
    } else if ({{2}}) {
        discountPercent = 10;
    }
    std::cout << "Discount: " << discountPercent << "%\n";
    return 0;
}
`,
          blanks: [
            { answers: ["order >= 50000", "50000 <= order"] },
            { answers: ["order >= 20000", "20000 <= order"] },
          ],
          expectedOutput: "Discount: 10%",
          hint: "Largest band first. The second condition only runs when the first was false, so it only needs the lower limit.",
          successMessage: "Highest band first, and each else if only needs its own lower limit. 32,000 fails the first test and passes the second.",
        },
      },
      {
        id: "a-cp-switch",
        title: "switch: choosing by an exact value",
        explain:
          "switch compares one whole-number or character value against a list of exact cases. Execution jumps to the matching case and runs until a break; default runs when nothing matches. switch is the clearest choice for menus. Without break, execution falls through into the next case, which is occasionally intended and usually a bug, so g++ -Wextra warns about it.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int choice = 2;
    switch (choice) {
        case 1:
            std::cout << "Check balance\n";
            break;
        case 2:
            std::cout << "Withdraw cash\n";
            break;
        case 3:
            std::cout << "Deposit\n";
            break;
        default:
            std::cout << "Invalid option\n";
    }
    return 0;
}
`,
          expectedOutput: "Withdraw cash",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    char grade = 'B';
    switch (grade) {
        case 'A':
            std::cout << "Excellent\n";
        case 'B':
            std::cout << "Good\n";
        case 'C':
            std::cout << "Fair\n";
            break;
        default:
            std::cout << "Keep going\n";
    }
    return 0;
}
`,
          compileWarning: "this statement may fall through",
          question: "Some cases have no break. Starting from the matching case, what does this print?",
          expectedOutput: "Good\nFair",
          hint: "It jumps to case 'B' and keeps going through the next case until it meets a break.",
          successMessage:
            "Good, then Fair: case 'B' has no break, so it fell through into case 'C'. g++ -Wextra warns \"this statement may fall through\" for exactly this reason.",
        },
      },
      {
        id: "a-cp-ternary",
        title: "The conditional operator ?:",
        explain:
          "condition ? valueIfTrue : valueIfFalse is an expression that picks one of two values. It is if-else in a single expression, perfect for choosing a word or a number inside a calculation or a cout line. For anything with more than two outcomes, or with statements to run, use if-else instead: nested ?: is very hard to read.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int items = 1;
    std::cout << "You have " << items << (items == 1 ? " item" : " items") << "\n";
    int age = 15;
    int fare = age < 18 ? 250 : 500;
    std::cout << "Fare: " << fare << "\n";
    return 0;
}
`,
          expectedOutput: "You have 1 item\nFare: 250",
        },
        codeFill: {
          task: "Fill the gap with a ?: expression that gives \"PASS\" when score is at least 50 and \"FAIL\" otherwise.",
          code: C`#include <iostream>
#include <string>

int main() {
    int score = 42;
    std::string result = {{1}};
    std::cout << score << ": " << result << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                'score >= 50 ? "PASS" : "FAIL"',
                '(score >= 50) ? "PASS" : "FAIL"',
                'score < 50 ? "FAIL" : "PASS"',
                '(score < 50) ? "FAIL" : "PASS"',
              ],
              width: 30,
            },
          ],
          expectedOutput: "42: FAIL",
          hint: "condition ? value-if-true : value-if-false, with the two words in double quotes.",
          successMessage: "One expression, two possible values. 42 is below 50, so result is FAIL.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 4.8 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l17-loops",
    moduleId: "cp-m4-control",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.8", "4.9", "4.10"],
    title: "Repeating with Loops",
    subtitle: "while, do-while and for",
    estimatedMinutes: 22,
    intro:
      "Printing a times table for 12 rows with 12 cout statements works. For 1,000 rows it does not. A loop repeats a block of code, as many times as needed, with the same few lines. This lesson covers C++'s three loops and when to use each.",

    atoms: [
      {
        id: "a-cp-while",
        title: "The while loop",
        explain:
          "while (condition) { body } checks the condition; if it is true, it runs the body, then goes back and checks again. It stops the first time the condition is false. Something inside the body must eventually make the condition false, or the loop never ends. Use while when you do not know in advance how many repetitions you need.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int savings = 0;
    int weeks = 0;
    while (savings < 20000) {
        savings += 3500;
        weeks++;
    }
    std::cout << "Target reached after " << weeks << " weeks: " << savings << "\n";
    return 0;
}
`,
          expectedOutput: "Target reached after 6 weeks: 21000",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int n = 20;
    while (n > 3) {
        std::cout << n << " ";
        n = n / 2;
    }
    std::cout << "\nEnd: " << n << "\n";
    return 0;
}
`,
          question: "Trace n through each check of the condition. What does this print?",
          expectedOutput: "20 10 5\nEnd: 2",
          hint: "20 → 10 → 5 → 2 (integer division). The loop prints n before halving it, and stops when n is no longer above 3.",
          successMessage: "20 10 5, then End: 2. The condition is checked before each repetition, so 2 is never printed inside the loop.",
        },
      },
      {
        id: "a-cp-do-while",
        title: "The do-while loop",
        explain:
          "do { body } while (condition); runs the body FIRST and checks the condition afterwards, so the body always runs at least once. That is exactly right for asking the user for input until it is valid: you must ask at least once before you have anything to check. Note the semicolon after the condition.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int score = 0;
    do {
        std::cout << "Enter a score from 0 to 100: ";
        std::cin >> score;
    } while (score < 0 || score > 100);
    std::cout << "Accepted: " << score << "\n";
    return 0;
}
`,
          inputs: ["120", "-5", "75"],
          expectedOutput: "Enter a score from 0 to 100: 120\nEnter a score from 0 to 100: -5\nEnter a score from 0 to 100: 75\nAccepted: 75",
        },
        why: "The loop's condition describes a BAD value: keep asking while the score is out of range. That pattern, ask then check then ask again, is how every reliable program handles user input.",
      },
      {
        id: "a-cp-for",
        title: "The for loop",
        explain:
          "for (start; condition; update) { body } puts all the loop's control in one line: the start runs once, the condition is checked before each repetition, and the update runs after each one. It is the natural loop for counting: for (int i = 1; i <= 12; i++) runs exactly 12 times. A variable declared in the start, like i, exists only inside the loop.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int table = 7;
    for (int i = 1; i <= 5; i++) {
        std::cout << table << " x " << i << " = " << table * i << "\n";
    }
    return 0;
}
`,
          expectedOutput: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35",
        },
        table: {
          caption: "Which loop to choose.",
          headers: ["Loop", "Checks the condition", "Use it when"],
          rows: [
            ["for", "Before each repetition", "You know how many times, or are counting"],
            ["while", "Before each repetition", "You repeat until something happens, and it may be zero times"],
            ["do-while", "After each repetition", "The body must run at least once, such as asking for input"],
          ],
        },
        codeFill: {
          task: "Fill the for loop's header so it counts down from 10 to 1, printing each number.",
          code: C`#include <iostream>

int main() {
    for ({{1}}) {
        std::cout << i << " ";
    }
    std::cout << "Lift off!\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "int i = 10; i >= 1; i--",
                "int i = 10; i > 0; i--",
                "int i = 10; i >= 1; --i",
                "int i = 10; i > 0; --i",
                "int i = 10; i >= 1; i -= 1",
              ],
              width: 26,
            },
          ],
          expectedOutput: "10 9 8 7 6 5 4 3 2 1 Lift off!",
          hint: "Three parts separated by semicolons: start i at 10, keep going while i is at least 1, and subtract one each time.",
          successMessage: "Start at 10, continue while i >= 1, decrease by one. All of the loop's control is on one line.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 4.11 – 4.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l18-loop-patterns",
    moduleId: "cp-m4-control",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.11", "4.12", "4.13"],
    title: "Loop Patterns",
    subtitle: "Counters, accumulators, tracing, nested loops, break and continue",
    estimatedMinutes: 22,
    intro:
      "Most loops you will ever write follow a handful of patterns: count something, add something up, repeat inside a repeat, stop early, skip some items. Learn the patterns and you can read most loops at a glance, and write them without guessing.",

    atoms: [
      {
        id: "a-cp-counters-accumulators",
        title: "Counters, accumulators and tracing a loop",
        explain:
          "A counter is a variable that goes up by one each time something happens: how many students passed. An accumulator is a variable that adds up values: the total of all scores. Both are created BEFORE the loop with a starting value of 0, updated INSIDE it, and used AFTER it. To understand any loop, trace it: write a table with one row per repetition and a column for each variable.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int total = 0;
    int evens = 0;
    for (int n = 1; n <= 5; n++) {
        total += n;
        if (n % 2 == 0) {
            evens++;
        }
    }
    std::cout << "Total: " << total << ", evens: " << evens << "\n";
    return 0;
}
`,
          expectedOutput: "Total: 15, evens: 2",
          trace: {
            headers: ["n", "n <= 5?", "total after", "n even?", "evens after"],
            rows: [
              ["1", "yes", "1", "no", "0"],
              ["2", "yes", "3", "yes", "1"],
              ["3", "yes", "6", "no", "1"],
              ["4", "yes", "10", "yes", "2"],
              ["5", "yes", "15", "no", "2"],
              ["6", "no: loop ends", "15", "", "2"],
            ],
            note: "The condition is checked one extra time, with n = 6, and that check is what ends the loop.",
          },
        },
        codeFill: {
          task: "Fill the two gaps so the loop adds up the five scores the user types (the accumulator) and then prints their total.",
          code: C`#include <iostream>

int main() {
    int total = {{1}};
    for (int i = 1; i <= 5; i++) {
        int score = 0;
        std::cin >> score;
        {{2}}
    }
    std::cout << "Total: " << total << "\n";
    return 0;
}
`,
          blanks: [
            { answers: ["0"] },
            { answers: ["total += score;", "total = total + score;", "total = score + total;"], width: 22 },
          ],
          inputs: ["70 65 80 55 90"],
          expectedOutput: "70 65 80 55 90\nTotal: 360",
          hint: "An accumulator starts at nothing, and each repetition adds the new value to it.",
          successMessage: "Start at 0, add each score. The same three-step pattern (before, inside, after) adds up anything.",
        },
      },
      {
        id: "a-cp-loop-trace-practice",
        title: "Your turn: trace a loop",
        explain:
          "Trace this loop with a table before you answer: one row per repetition, with columns for i, product and the output so far. Do not run it in your head all at once; write it down.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int product = 1;
    for (int i = 2; i <= 8; i += 3) {
        product *= i;
        std::cout << i << ":" << product << " ";
    }
    std::cout << "\n" << product << "\n";
    return 0;
}
`,
          question: "i goes up by 3 each time. Trace i and product. What does it print?",
          expectedOutput: "2:2 5:10 8:80\n80",
          hint: "i takes the values 2, 5 and 8; the next would be 11, which fails i <= 8. product starts at 1.",
          successMessage: "2:2 5:10 8:80 and then 80. Three repetitions, because i jumps by 3.",
        },
      },
      {
        id: "a-cp-nested-loops",
        title: "Nested loops",
        explain:
          "A loop inside a loop: for each repetition of the outer loop, the inner loop runs completely. With an outer loop of 3 and an inner loop of 4, the inner body runs 3 × 4 = 12 times. Nested loops print grids and patterns, compare every item with every other item, and work through rows and columns.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 4; col++) {
            std::cout << row * col << "\t";
        }
        std::cout << "\n";
    }
    return 0;
}
`,
          expectedOutput: "1\t2\t3\t4\n2\t4\t6\t8\n3\t6\t9\t12",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    for (int row = 1; row <= 4; row++) {
        for (int star = 1; star <= row; star++) {
            std::cout << "*";
        }
        std::cout << "\n";
    }
    return 0;
}
`,
          question: "The inner loop's limit depends on row. Draw what this prints.",
          expectedOutput: "*\n**\n***\n****",
          hint: "On row 1 the inner loop runs once, on row 2 twice, and so on. The new line comes after each inner loop finishes.",
          successMessage: "A triangle. The inner loop runs row times, so each line is one star longer.",
        },
      },
      {
        id: "a-cp-break-continue",
        title: "break and continue",
        explain:
          "break leaves the loop immediately, and the program carries on after it. continue skips the rest of the current repetition and goes straight to the next one (in a for loop, the update still runs). Use break when you have found what you were looking for, and continue to skip items that do not apply.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    for (int n = 1; n <= 10; n++) {
        if (n % 3 == 0) {
            continue;
        }
        if (n > 7) {
            break;
        }
        std::cout << n << " ";
    }
    std::cout << "\n";
    return 0;
}
`,
          expectedOutput: "1 2 4 5 7",
        },
        why: "3 and 6 are skipped by continue. At 8 the break ends the loop, so 9 and 10 are never reached. In a nested loop, break only leaves the innermost loop it is in.",
        codeFill: {
          task: "Search the numbers 1 to 100 for the first one divisible by both 7 and 9, and stop searching as soon as it is found. Fill the gap.",
          code: C`#include <iostream>

int main() {
    int found = 0;
    for (int n = 1; n <= 100; n++) {
        if (n % 7 == 0 && n % 9 == 0) {
            found = n;
            {{1}}
        }
    }
    std::cout << "First found: " << found << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["break;"] }],
          expectedOutput: "First found: 63",
          hint: "One keyword, followed by a semicolon, leaves the loop immediately.",
          successMessage: "break; stops at 63 instead of checking the remaining 37 numbers for nothing.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 4.14 – 4.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l19-loop-bugs",
    moduleId: "cp-m4-control",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.14", "4.15"],
    title: "Loop Bugs, and Putting It All Together",
    subtitle: "Infinite loops, off-by-one errors, and complete programs",
    estimatedMinutes: 25,
    intro:
      "Two bugs account for most broken loops: the loop that never stops, and the loop that runs one time too many or too few. Learn to spot both, then combine everything from Phase 1 into complete programs: a prime checker, a guessing game and the class grade calculator that is this phase's mastery checkpoint.",

    atoms: [
      {
        id: "a-cp-infinite-loops",
        title: "Infinite loops",
        explain:
          "An infinite loop is one whose condition never becomes false: the counter is never updated, it is updated in the wrong direction, or the condition can never fail. The program appears to freeze, or prints forever. Press Ctrl+C in the terminal to stop it, then trace the loop and ask what is supposed to make the condition false.",
        example:
          "Three infinite loops:\n\n  int i = 0;\n  while (i < 10) {\n      std::cout << i;        // i is never changed\n  }\n\n  for (int i = 10; i > 0; i++) {   // counts UP, away from 0\n      ...\n  }\n\n  int x = 1;\n  while (x != 10) {\n      x += 2;                // 1, 3, 5, 7, 9, 11 ... skips 10\n  }\n\nThe third is the sneakiest: the variable changes, but it jumps\nstraight past the only value that would stop the loop.",
        decision: {
          scenario: "Your loop is while (count != 20) { count += 3; } and count starts at 0. The program freezes.",
          question: "What is the best fix?",
          options: [
            {
              id: "a",
              text: "Change the condition to count < 20, so the loop ends as soon as count reaches or passes 20",
              why: "count goes 0, 3, 6, ..., 18, 21: it never equals 20. A < comparison ends the loop whichever value it lands on. Prefer < or <= over != for counting loops.",
            },
            {
              id: "b",
              text: "Change count += 3 to count += 2",
              whyWrong: "That happens to hit 20, but the loop is still fragile: change the start or the step later and it becomes infinite again.",
            },
            {
              id: "c",
              text: "Add break; at the start of the loop body",
              whyWrong: "Then the loop body never does any work at all.",
            },
            {
              id: "d",
              text: "Make count a double",
              whyWrong: "The values would be the same; it still never equals 20.",
            },
          ],
          correct: "a",
          aftermath: "When a loop counts towards a limit, test with < or <=, not != or ==.",
        },
      },
      {
        id: "a-cp-off-by-one",
        title: "Off-by-one errors",
        explain:
          "An off-by-one error is a loop that runs one time too many or one too few, usually from choosing < when you meant <=, or starting at 0 when you meant 1. Count before you trust: for (int i = 0; i < 5; i++) runs 5 times (0 to 4); for (int i = 1; i <= 5; i++) also runs 5 times (1 to 5); for (int i = 0; i <= 5; i++) runs 6 times.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int a = 0, b = 0, c = 0;
    for (int i = 0; i < 10; i++) { a++; }
    for (int i = 1; i <= 10; i++) { b++; }
    for (int i = 0; i <= 10; i++) { c++; }
    std::cout << a << " " << b << " " << c << "\n";
    return 0;
}
`,
          question: "Each loop counts how many times it runs. What does this print?",
          expectedOutput: "10 10 11",
          hint: "0 to 9 is ten values. 1 to 10 is ten values. 0 to 10, inclusive, is eleven.",
          successMessage: "10, 10 and 11. The third loop is the classic off-by-one: <= with a start of 0 runs once more than the limit.",
        },
      },
      {
        id: "a-cp-prime-checker",
        title: "Combining loops and conditions: a prime checker",
        explain:
          "A prime number is a whole number greater than 1 whose only divisors are 1 and itself. To test n, try every divisor from 2 upwards; if any divides n exactly, n is not prime, and you can stop. You only need to try divisors up to the square root of n, because any larger divisor would pair with a smaller one you have already tried: d * d <= n expresses that without needing <cmath>.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int n = 0;
    std::cout << "Number: ";
    std::cin >> n;
    bool isPrime = n > 1;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            isPrime = false;
            break;
        }
    }
    std::cout << n << (isPrime ? " is prime\n" : " is not prime\n");
    return 0;
}
`,
          inputs: ["91"],
          expectedOutput: "Number: 91\n91 is not prime",
        },
        why: "91 looks prime, but 7 × 13 = 91. The loop finds 7 and stops. isPrime starts as n > 1 so that 0 and 1, which are not prime, are handled without a special case.",
        codeFill: {
          task: "Fill the gap with the condition that means \"d divides n exactly\".",
          code: C`#include <iostream>

int main() {
    int n = 97;
    bool isPrime = n > 1;
    for (int d = 2; d * d <= n; d++) {
        if ({{1}}) {
            isPrime = false;
            break;
        }
    }
    std::cout << n << (isPrime ? " is prime\n" : " is not prime\n");
    return 0;
}
`,
          blanks: [{ answers: ["n % d == 0", "0 == n % d", "!(n % d)"] }],
          expectedOutput: "97 is prime",
          hint: "d divides n exactly when the remainder of n divided by d is zero.",
          successMessage: "n % d == 0. 97 survives every divisor up to 9, so it is prime.",
        },
      },
      {
        id: "a-cp-guessing-game",
        title: "A number guessing game",
        explain:
          "Games are loops around decisions. This one keeps asking for a guess until it is right, gives a higher-or-lower hint each time, and counts the attempts. The secret number is fixed here so that the output can be checked; Week 12 shows how to pick a random one.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    const int SECRET = 42;
    int guess = 0;
    int attempts = 0;
    do {
        std::cout << "Guess (1-100): ";
        std::cin >> guess;
        attempts++;
        if (guess < SECRET) {
            std::cout << "Higher!\n";
        } else if (guess > SECRET) {
            std::cout << "Lower!\n";
        }
    } while (guess != SECRET);
    std::cout << "Correct in " << attempts << " attempts.\n";
    return 0;
}
`,
          inputs: ["50", "25", "42"],
          expectedOutput: "Guess (1-100): 50\nLower!\nGuess (1-100): 25\nHigher!\nGuess (1-100): 42\nCorrect in 3 attempts.",
        },
        why: "Here != is the right test, unlike the counting loop earlier: the user types any number, so the loop must end exactly when the guess equals the secret.",
      },
      {
        id: "a-cp-mastery-grades",
        title: "Mastery checkpoint: grades for a whole class",
        explain:
          "This is the Phase 1 checkpoint program: for each student, read several scores, calculate the average, assign a grade, and repeat for every student. Read it slowly. Every line uses something from Weeks 1 to 4: input, types and casting, formatting, an accumulator, an else if ladder and nested loops.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <iomanip>

int main() {
    int students = 0, subjects = 0;
    std::cout << "Students and subjects: ";
    std::cin >> students >> subjects;
    std::cout << std::fixed << std::setprecision(1);

    for (int s = 1; s <= students; s++) {
        int total = 0;
        std::cout << "Scores for student " << s << ": ";
        for (int i = 1; i <= subjects; i++) {
            int score = 0;
            std::cin >> score;
            total += score;
        }
        double average = static_cast<double>(total) / subjects;
        char grade = average >= 70 ? 'A' : average >= 60 ? 'B' : average >= 50 ? 'C' : 'F';
        std::cout << "Student " << s << ": average " << average << ", grade " << grade << "\n";
    }
    return 0;
}
`,
          inputs: ["2 3", "78 85 69", "45 52 58"],
          expectedOutput: "Students and subjects: 2 3\nScores for student 1: 78 85 69\nStudent 1: average 77.3, grade A\nScores for student 2: 45 52 58\nStudent 2: average 51.7, grade C",
        },
        why: "The grade uses a chain of ?: operators to fit on one line. It works, but an else if ladder is clearer, and your version of this program should use one.",
        codeFill: {
          task: "Fill the gap so the class average is calculated as a decimal from classTotal (the sum of every student's average) and students.",
          code: C`#include <iostream>
#include <iomanip>

int main() {
    double averages[] = {77.3, 51.7, 64.0};
    int students = 3;
    double classTotal = 0;
    for (int s = 0; s < students; s++) {
        classTotal += averages[s];
    }
    double classAverage = {{1}};
    std::cout << std::fixed << std::setprecision(1) << "Class average: " << classAverage << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["classTotal / students", "classTotal / static_cast<double>(students)"] }],
          expectedOutput: "Class average: 64.3",
          hint: "classTotal is already a double, so dividing it by the number of students keeps the decimals.",
          successMessage:
            "classTotal / students. Because classTotal is a double, no cast is needed. (The [ ] holding three averages is an array, the subject of Week 6.)",
        },
      },
    ],

    task: {
      title: "Mini-projects and the Phase 1 mastery checkpoint",
      intro:
        "Five small programs, then the checkpoint. Build each in its own .cpp file, compile with -Wall -Wextra until g++ prints nothing, and test every branch: a decision you never tested is a decision you do not know works.",
      prompts: [
        "Grade classification: read a score, reject anything outside 0–100 with a do-while, and print the grade using an else if ladder (A 70+, B 60+, C 50+, D 45+, F below).",
        "Multiplication table generator: read a number and a limit, and print that number's table up to the limit with a for loop.",
        "Number guessing game: keep asking until the guess is right, say Higher or Lower each time, count the attempts, and end after 7 failed tries with the answer.",
        "Prime number checker: read a number and say whether it is prime; then extend it to print every prime from 2 to 100.",
        "Basic ATM menu simulator: start with a balance, and loop a switch-based menu (1 balance, 2 deposit, 3 withdraw, 4 exit) until the user chooses exit. Refuse withdrawals larger than the balance.",
        "Mastery checkpoint: read the number of students and subjects, then for each student read their scores, print the average to one decimal place and the grade, and at the end print the class average and how many students passed.",
      ],
      closing:
        "The checkpoint program is the foundation of the Student Performance Analyser in Week 6 and the records system in Week 11. Keep it.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
