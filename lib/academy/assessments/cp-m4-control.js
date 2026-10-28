/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 4 · CONDITIONS, LOOPS AND PROGRAM FLOW
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l15-if": {
    lessonId: "cp-l15-if",
    passMark: 70,
    questions: [
      {
        id: "cpq15-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-if",
        prompt: "int stock = 0;\nif (stock > 0) {\n    cout << \"In stock\\n\";\n}\ncout << \"Done\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "Done" },
          { id: "b", text: "In stock\nDone" },
          { id: "c", text: "In stock" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "stock > 0 is false, so the if block is skipped. The line after the closing brace always runs.",
        whyWrong: {
          b: "The if block runs only when its condition is true; 0 > 0 is false.",
          c: "The if block is skipped, and Done is outside it, so Done is printed.",
          d: "Done is not inside the if, so it runs regardless.",
        },
      },
      {
        id: "cpq15-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-if-else",
        prompt: "int pin = 0;\nif (pin = 1234) {\n    cout << \"Access granted\\n\";\n}\n\nWhat happens, and why?",
        options: [
          { id: "a", text: "Access granted is printed: = stores 1234 in pin, and 1234 counts as true" },
          { id: "b", text: "Nothing is printed, because pin is 0" },
          { id: "c", text: "It does not compile" },
          { id: "d", text: "It compares pin with 1234 correctly" },
        ],
        correct: "a",
        explanation: "A single = is assignment. The condition's value is the assigned 1234, which is non-zero and so true. Comparison needs ==.",
        whyWrong: {
          b: "The condition does not test pin's old value; it assigns 1234 to it first.",
          c: "It compiles; g++ -Wall warns, which is why warnings matter.",
          d: "Comparison is ==. This line assigns.",
        },
      },
      {
        id: "cpq15-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-if-else",
        prompt: "In an if-else statement, how many of the two blocks run?",
        options: [
          { id: "a", text: "Exactly one" },
          { id: "b", text: "Both, one after the other" },
          { id: "c", text: "Possibly neither" },
          { id: "d", text: "It depends on whether braces are used" },
        ],
        correct: "a",
        explanation: "if-else always chooses exactly one path: the if block when the condition is true, the else block otherwise.",
        whyWrong: {
          b: "The two blocks are alternatives; only one runs.",
          c: "The else block catches every case the if does not, so one always runs.",
          d: "Braces group statements; they do not change how many blocks run.",
        },
      },
      {
        id: "cpq15-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-bool-conditions",
        prompt: "How does C++ treat an int used directly as a condition, as in if (count) ...?",
        options: [
          { id: "a", text: "0 is false; any other value is true" },
          { id: "b", text: "Positive is true; negative and 0 are false" },
          { id: "c", text: "Only 1 is true" },
          { id: "d", text: "It is a compilation error" },
        ],
        correct: "a",
        explanation: "Zero converts to false, and every non-zero value, including negative ones, converts to true.",
        whyWrong: {
          b: "Negative numbers are non-zero, so they count as true.",
          c: "Any non-zero value counts as true, not only 1.",
          d: "Using an int as a condition is valid C++.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l16-branches": {
    lessonId: "cp-l16-branches",
    passMark: 70,
    questions: [
      {
        id: "cpq16-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-else-if",
        prompt: "int s = 85;\nif (s >= 50) cout << \"C\";\nelse if (s >= 70) cout << \"A\";\nelse cout << \"F\";\n\nWhat is printed, and why?",
        options: [
          { id: "a", text: "C, because the first true condition wins and s >= 50 is checked first" },
          { id: "b", text: "A, because 85 is at least 70" },
          { id: "c", text: "CA" },
          { id: "d", text: "F" },
        ],
        correct: "a",
        explanation: "An else if ladder runs only the first block whose condition is true. The lowest band was checked first, which is the bug.",
        whyWrong: {
          b: "s >= 70 is never checked, because s >= 50 was already true.",
          c: "Only one block of a ladder runs.",
          d: "else runs only when every condition is false.",
        },
      },
      {
        id: "cpq16-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-switch",
        prompt: "What does break do inside a switch case?",
        options: [
          { id: "a", text: "Leaves the switch, so execution does not fall through into the next case" },
          { id: "b", text: "Stops the whole program" },
          { id: "c", text: "Goes back to the start of the switch" },
          { id: "d", text: "Nothing; it is optional decoration" },
        ],
        correct: "a",
        explanation: "Without break, execution continues into the next case's statements.",
        whyWrong: {
          b: "break leaves only the switch (or loop) it is in.",
          c: "Nothing jumps back; execution continues after the switch.",
          d: "Leaving it out changes behaviour: the next case runs too.",
        },
      },
      {
        id: "cpq16-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-ternary",
        prompt: "int n = 7;\ncout << (n % 2 == 0 ? \"even\" : \"odd\") << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "odd" },
          { id: "b", text: "even" },
          { id: "c", text: "1" },
          { id: "d", text: "evenodd" },
        ],
        correct: "a",
        explanation: "7 % 2 is 1, so the condition is false and ?: picks the second value.",
        whyWrong: {
          b: "That is chosen only when the condition is true; 7 is not divisible by 2.",
          c: "?: gives one of its two values, the strings, not the condition.",
          d: "?: picks one value, never both.",
        },
      },
      {
        id: "cpq16-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-switch",
        prompt: "Which decision is the best fit for a switch statement?",
        options: [
          { id: "a", text: "Running a different action for menu options 1, 2, 3 and 4" },
          { id: "b", text: "Deciding whether a temperature is above 37.5" },
          { id: "c", text: "Checking that a score is between 0 and 100" },
          { id: "d", text: "Comparing two names alphabetically" },
        ],
        correct: "a",
        explanation: "switch matches one whole-number or character value against exact cases, which is exactly what a numbered menu is.",
        whyWrong: {
          b: "switch cannot test ranges or decimals; use if.",
          c: "A range check needs comparisons joined with &&.",
          d: "switch cannot work on strings in C++.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l17-loops": {
    lessonId: "cp-l17-loops",
    passMark: 70,
    questions: [
      {
        id: "cpq17-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-do-while",
        prompt: "What is special about a do-while loop?",
        options: [
          { id: "a", text: "Its body always runs at least once, because the condition is checked afterwards" },
          { id: "b", text: "It can never become an infinite loop" },
          { id: "c", text: "It runs exactly ten times" },
          { id: "d", text: "It checks the condition before the first repetition" },
        ],
        correct: "a",
        explanation: "do-while runs the body, then tests the condition. That makes it right for asking for input until it is valid.",
        whyWrong: {
          b: "Any loop whose condition never becomes false is infinite.",
          c: "It repeats for as long as its condition is true.",
          d: "That describes while and for.",
        },
      },
      {
        id: "cpq17-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-for",
        prompt: "How many times does this loop body run?\n\nfor (int i = 3; i <= 15; i += 4) { ... }",
        options: [
          { id: "a", text: "4 (i = 3, 7, 11, 15)" },
          { id: "b", text: "3" },
          { id: "c", text: "12" },
          { id: "d", text: "5" },
        ],
        correct: "a",
        explanation: "i takes 3, 7, 11 and 15, all of which satisfy i <= 15. The next value, 19, fails.",
        whyWrong: {
          b: "15 itself is included, because the condition is <=.",
          c: "i increases by 4, not by 1.",
          d: "19 is above 15, so a fifth repetition does not happen.",
        },
      },
      {
        id: "cpq17-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-while",
        prompt: "int n = 1;\nwhile (n < 50) {\n    n = n * 3;\n}\ncout << n << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "81" },
          { id: "b", text: "27" },
          { id: "c", text: "50" },
          { id: "d", text: "243" },
        ],
        correct: "a",
        explanation: "n goes 1, 3, 9, 27, 81. At 81 the condition n < 50 is false, so the loop stops and 81 is printed.",
        whyWrong: {
          b: "27 is less than 50, so the loop runs once more.",
          c: "n only takes powers of 3; it never equals 50.",
          d: "The loop stops as soon as n reaches 81.",
        },
      },
      {
        id: "cpq17-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-for",
        prompt: "A program must keep reading numbers until the user types 0, and you cannot know in advance how many there will be. Which loop fits best?",
        options: [
          { id: "a", text: "A while or do-while loop" },
          { id: "b", text: "A for loop counting to 100" },
          { id: "c", text: "A switch statement" },
          { id: "d", text: "Ten separate if statements" },
        ],
        correct: "a",
        explanation: "When the number of repetitions depends on what happens, a condition-controlled loop is the natural choice.",
        whyWrong: {
          b: "A fixed count would read too many or too few numbers.",
          c: "switch chooses between cases; it does not repeat.",
          d: "That only handles up to ten numbers and repeats code.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l18-loop-patterns": {
    lessonId: "cp-l18-loop-patterns",
    passMark: 70,
    questions: [
      {
        id: "cpq18-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-counters-accumulators",
        prompt: "Where should the total variable of an accumulator loop be created and set to 0?",
        options: [
          { id: "a", text: "Before the loop" },
          { id: "b", text: "Inside the loop body" },
          { id: "c", text: "After the loop" },
          { id: "d", text: "It does not matter" },
        ],
        correct: "a",
        explanation: "Created inside the loop, total would be reset to 0 on every repetition and only the last value would count.",
        whyWrong: {
          b: "It would be reset to 0 every time round, losing the running total.",
          c: "The loop needs it while it runs, so it must already exist.",
          d: "It matters completely: placement decides whether the total accumulates.",
        },
      },
      {
        id: "cpq18-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-nested-loops",
        prompt: "for (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        count++;\n\nIf count starts at 0, what is it afterwards?",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "7" },
          { id: "c", text: "4" },
          { id: "d", text: "3" },
        ],
        correct: "a",
        explanation: "For each of the 3 outer repetitions, the inner loop runs 4 times: 3 × 4 = 12.",
        whyWrong: {
          b: "The counts multiply, they do not add.",
          c: "The inner loop runs 4 times for EACH outer repetition.",
          d: "count is in the inner loop, so it is incremented every inner repetition.",
        },
      },
      {
        id: "cpq18-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-break-continue",
        prompt: "for (int i = 1; i <= 6; i++) {\n    if (i == 4) continue;\n    cout << i;\n}\n\nWhat is printed?",
        options: [
          { id: "a", text: "12356" },
          { id: "b", text: "123" },
          { id: "c", text: "123456" },
          { id: "d", text: "1234" },
        ],
        correct: "a",
        explanation: "continue skips the rest of the repetition for i = 4 only; the loop carries on with 5 and 6.",
        whyWrong: {
          b: "That is what break would do. continue skips one repetition and keeps going.",
          c: "The cout is skipped when i is 4.",
          d: "4 is the value that is skipped.",
        },
      },
      {
        id: "cpq18-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-break-continue",
        prompt: "In a nested loop, a break inside the inner loop leaves...",
        options: [
          { id: "a", text: "Only the inner loop; the outer loop continues" },
          { id: "b", text: "Both loops" },
          { id: "c", text: "The whole program" },
          { id: "d", text: "Only the current if statement" },
        ],
        correct: "a",
        explanation: "break leaves the innermost loop (or switch) that contains it.",
        whyWrong: {
          b: "break affects only one level.",
          c: "Ending the program is return in main, not break.",
          d: "break does not apply to if statements; it leaves the loop.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l19-loop-bugs": {
    lessonId: "cp-l19-loop-bugs",
    passMark: 70,
    questions: [
      {
        id: "cpq19-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-infinite-loops",
        prompt: "int i = 0;\nwhile (i < 5) {\n    cout << i << \"\\n\";\n}\n\nWhat is wrong?",
        options: [
          { id: "a", text: "i is never changed, so i < 5 stays true forever" },
          { id: "b", text: "while cannot print numbers" },
          { id: "c", text: "It prints 0 to 4 and stops: nothing is wrong" },
          { id: "d", text: "The condition should use ==" },
        ],
        correct: "a",
        explanation: "Nothing inside the loop moves i towards 5. Add i++; inside the body.",
        whyWrong: {
          b: "Any statement can go inside a loop.",
          c: "It prints 0 forever, because i stays 0.",
          d: "i == 5 would be false immediately and the loop would never run.",
        },
      },
      {
        id: "cpq19-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-off-by-one",
        prompt: "You want to print the numbers 1 to 10. Which loop header is correct?",
        options: [
          { id: "a", text: "for (int i = 1; i <= 10; i++)" },
          { id: "b", text: "for (int i = 1; i < 10; i++)" },
          { id: "c", text: "for (int i = 0; i <= 10; i++)" },
          { id: "d", text: "for (int i = 0; i < 10; i++)" },
        ],
        correct: "a",
        explanation: "Start at 1 and include 10 with <=.",
        whyWrong: {
          b: "< 10 stops at 9: one short.",
          c: "Starting at 0 prints 0 to 10: one too many.",
          d: "This prints 0 to 9.",
        },
      },
      {
        id: "cpq19-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-prime-checker",
        prompt: "Why does a prime checker only need to try divisors d while d * d <= n?",
        options: [
          { id: "a", text: "Any divisor larger than the square root pairs with a smaller one that would already have been found" },
          { id: "b", text: "Large numbers cannot be divisors" },
          { id: "c", text: "To avoid integer overflow" },
          { id: "d", text: "It is a guess that usually works" },
        ],
        correct: "a",
        explanation: "If n = a × b and a is larger than √n, then b is smaller than √n, and b is tried first.",
        whyWrong: {
          b: "Large divisors exist; they always come with a small partner.",
          c: "The reason is mathematical: it removes unnecessary checks.",
          d: "It is a proof, not a guess: it always works.",
        },
      },
      {
        id: "cpq19-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-mastery-grades",
        prompt: "In the class grade program, total is declared inside the outer loop (for each student) but before the inner loop (for each score). Why there?",
        options: [
          { id: "a", text: "So it resets to 0 for each student and accumulates only that student's scores" },
          { id: "b", text: "So it holds the whole class's total" },
          { id: "c", text: "Because variables cannot be declared before loops" },
          { id: "d", text: "It makes no difference where it goes" },
        ],
        correct: "a",
        explanation: "Each student needs their own total. Declaring it at the start of the outer loop body gives a fresh 0 per student.",
        whyWrong: {
          b: "A class total would be declared before the outer loop.",
          c: "Variables can be declared before loops, and accumulators usually are.",
          d: "Inside the inner loop it would reset per score; outside both, it would mix students together.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
