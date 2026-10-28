/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 3 · OPERATORS AND EXPRESSIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l11-arithmetic": {
    lessonId: "cp-l11-arithmetic",
    passMark: 70,
    questions: [
      {
        id: "cpq11-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-arith-ops",
        prompt: "int days = 23;\ncout << days / 7 << \" weeks \" << days % 7 << \" days\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "3 weeks 2 days" },
          { id: "b", text: "3.28571 weeks 2 days" },
          { id: "c", text: "3 weeks 0 days" },
          { id: "d", text: "2 weeks 3 days" },
        ],
        correct: "a",
        explanation: "23 / 7 in whole numbers is 3, and the remainder 23 % 7 is 2.",
        whyWrong: {
          b: "Both values are ints, so the division discards the fraction.",
          c: "3 × 7 is 21, leaving 2 days, not 0.",
          d: "The quotient and remainder are swapped.",
        },
      },
      {
        id: "cpq11-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-compound-assign",
        prompt: "What does total *= 3; do?",
        options: [
          { id: "a", text: "Sets total to total * 3" },
          { id: "b", text: "Sets total to 3" },
          { id: "c", text: "Compares total with 3" },
          { id: "d", text: "Prints total three times" },
        ],
        correct: "a",
        explanation: "Compound assignment applies the operator using the variable's current value, then stores the result back.",
        whyWrong: {
          b: "That would be total = 3;.",
          c: "Comparison uses ==; *= changes the variable.",
          d: "Nothing is printed; only cout prints.",
        },
      },
      {
        id: "cpq11-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-increment",
        prompt: "int x = 3;\nint y = x++;\nint z = ++x;\ncout << x << y << z << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "535" },
          { id: "b", text: "545" },
          { id: "c", text: "334" },
          { id: "d", text: "445" },
        ],
        correct: "a",
        explanation: "y gets the old value 3, then x becomes 4. ++x makes x 5 and z gets 5. So x = 5, y = 3, z = 5.",
        whyWrong: {
          b: "Postfix x++ hands over the OLD value, 3, so y is 3, not 4.",
          c: "x is incremented twice, so it ends at 5, not 3.",
          d: "x ends at 5, and y got the value before any increment.",
        },
      },
      {
        id: "cpq11-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-arith-ops",
        prompt: "Which expression gives the last digit of the whole number n (for example 7 from 4827)?",
        options: [
          { id: "a", text: "n % 10" },
          { id: "b", text: "n / 10" },
          { id: "c", text: "n - 10" },
          { id: "d", text: "n * 10" },
        ],
        correct: "a",
        explanation: "The remainder after dividing by 10 is the last digit: 4827 % 10 is 7.",
        whyWrong: {
          b: "n / 10 removes the last digit: 4827 / 10 is 482.",
          c: "Subtracting 10 gives 4817.",
          d: "Multiplying by 10 adds a zero: 48270.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l12-comparison-logic": {
    lessonId: "cp-l12-comparison-logic",
    passMark: 70,
    questions: [
      {
        id: "cpq12-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-comparison",
        prompt: "Which operator asks whether two values are equal?",
        options: [
          { id: "a", text: "==" },
          { id: "b", text: "=" },
          { id: "c", text: "!=" },
          { id: "d", text: "=>" },
        ],
        correct: "a",
        explanation: "== compares and gives true or false. A single = stores a value.",
        whyWrong: {
          b: "= is assignment: it changes the variable instead of comparing.",
          c: "!= asks whether they are different.",
          d: "=> is not a C++ operator; greater-or-equal is >=.",
        },
      },
      {
        id: "cpq12-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-logical",
        prompt: "bool member = false;\nint age = 65;\nWhat is the value of (member || age >= 60) && !member?",
        options: [
          { id: "a", text: "true" },
          { id: "b", text: "false" },
          { id: "c", text: "65" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "member || age >= 60 is false || true = true. !member is true. true && true is true.",
        whyWrong: {
          b: "Each part is true: the OR because age is at least 60, and the NOT because member is false.",
          c: "Logical operators produce bool values, not numbers from the expression.",
          d: "It is valid C++: bools combined with ||, && and !.",
        },
      },
      {
        id: "cpq12-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-range-check",
        prompt: "int count = 0, total = 120;\nWhy is (count != 0 && total / count > 50) safe even though count is 0?",
        options: [
          { id: "a", text: "&& stops after the left side is false, so total / count is never calculated" },
          { id: "b", text: "Dividing by zero is allowed in C++" },
          { id: "c", text: "C++ evaluates the right side first" },
          { id: "d", text: "It is not safe; it divides by zero" },
        ],
        correct: "a",
        explanation: "Short-circuit evaluation: with && a false left side decides the answer, so the right side is skipped.",
        whyWrong: {
          b: "Integer division by zero is a serious runtime error. The short-circuit is what avoids it.",
          c: "&& always evaluates its left side first.",
          d: "The division never runs, because count != 0 is false.",
        },
      },
      {
        id: "cpq12-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-chained-comparison",
        prompt: "int temp = 120;\ncout << (0 <= temp <= 100) << \"\\n\";\n\nWhat is printed, and why?",
        options: [
          { id: "a", text: "1, because (0 <= temp) gives true (1), and 1 <= 100 is true" },
          { id: "b", text: "0, because 120 is above 100" },
          { id: "c", text: "It does not compile" },
          { id: "d", text: "120" },
        ],
        correct: "a",
        explanation: "C++ compares one pair at a time, left to right. The second comparison is between the bool result and 100, which is always true.",
        whyWrong: {
          b: "That is what the maths means, but not what C++ does. The correct check is temp >= 0 && temp <= 100.",
          c: "It compiles; g++ -Wall gives a warning, not an error.",
          d: "A comparison produces a bool, printed as 1 or 0.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l13-precedence": {
    lessonId: "cp-l13-precedence",
    passMark: 70,
    questions: [
      {
        id: "cpq13-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-precedence",
        prompt: "cout << 20 - 8 / 4 * 2 << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "16" },
          { id: "b", text: "18" },
          { id: "c", text: "12" },
          { id: "d", text: "3" },
        ],
        correct: "a",
        explanation: "/ and * share a level and go left to right: 8 / 4 = 2, then 2 * 2 = 4. Then 20 - 4 = 16.",
        whyWrong: {
          b: "That does 4 * 2 first. Equal-precedence operators go left to right.",
          c: "That subtracts first. * and / come before -.",
          d: "That is (20 - 8) / 4, which needs brackets.",
        },
      },
      {
        id: "cpq13-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-precedence",
        prompt: "In a = b = 7;, which happens first?",
        options: [
          { id: "a", text: "b = 7, because assignment is right-associative; then a gets that value" },
          { id: "b", text: "a = b, using b's old value" },
          { id: "c", text: "It is a compilation error" },
          { id: "d", text: "a == b is compared" },
        ],
        correct: "a",
        explanation: "Assignment groups right to left: a = (b = 7). Both end up as 7.",
        whyWrong: {
          b: "Assignment is right-associative, so the right-most assignment happens first.",
          c: "Chained assignment is valid C++.",
          d: "= assigns; no comparison happens.",
        },
      },
      {
        id: "cpq13-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-implicit-explicit",
        prompt: "cout << 7 / 2 * 2.0 << \" \" << 7 * 2.0 / 2 << \"\\n\";\n\nWhat is printed?",
        options: [
          { id: "a", text: "6 7" },
          { id: "b", text: "7 7" },
          { id: "c", text: "6 6" },
          { id: "d", text: "7 6" },
        ],
        correct: "a",
        explanation: "7 / 2 is integer division (3), then 3 * 2.0 = 6. In the second, 7 * 2.0 is 14.0, and 14.0 / 2 = 7.",
        whyWrong: {
          b: "The first expression divides two ints before any double is involved, losing the .5.",
          c: "The second expression becomes a double before the division, so nothing is lost.",
          d: "The results are the other way round.",
        },
      },
      {
        id: "cpq13-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-eval-order",
        prompt: "Why should you avoid writing n = i++ + i++;?",
        options: [
          { id: "a", text: "Changing the same variable twice in one expression is undefined behaviour: C++ promises no particular result" },
          { id: "b", text: "It is a compilation error" },
          { id: "c", text: "It always gives 0" },
          { id: "d", text: "++ cannot be used with +" },
        ],
        correct: "a",
        explanation: "Without a defined order between the two modifications, the result is not guaranteed. Split it into separate statements.",
        whyWrong: {
          b: "It usually compiles, which is what makes it dangerous.",
          c: "No particular result is guaranteed, including 0.",
          d: "++ and + can be combined; the problem is modifying i twice.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l14-formulas": {
    lessonId: "cp-l14-formulas",
    passMark: 70,
    questions: [
      {
        id: "cpq14-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-arith-mistakes",
        prompt: "A beginner writes double area = side ^ 2; to square a side of 5. Why is it wrong?",
        options: [
          { id: "a", text: "^ is a bitwise operator in C++, not a power; use side * side or pow(side, 2)" },
          { id: "b", text: "Nothing is wrong; it gives 25" },
          { id: "c", text: "Powers are not possible in C++" },
          { id: "d", text: "It should be side ^^ 2" },
        ],
        correct: "a",
        explanation: "C++ has no power operator. 5 ^ 2 is 7, a bitwise result. Multiply, or use pow from <cmath>.",
        whyWrong: {
          b: "5 ^ 2 is 7 in C++, not 25.",
          c: "pow computes powers.",
          d: "^^ is not a C++ operator.",
        },
      },
      {
        id: "cpq14-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-arith-mistakes",
        prompt: "int correct = 18, questions = 20;\nWhich expression gives the percentage 90?",
        options: [
          { id: "a", text: "correct * 100.0 / questions" },
          { id: "b", text: "correct / questions * 100" },
          { id: "c", text: "correct / (questions * 100)" },
          { id: "d", text: "correct % questions * 100" },
        ],
        correct: "a",
        explanation: "Multiplying by 100.0 first makes the expression a double and keeps the value: 1800.0 / 20 = 90.",
        whyWrong: {
          b: "18 / 20 in whole numbers is 0, so the result is 0.",
          c: "That divides by 2000.",
          d: "% gives the remainder, 18, so the result is 1800.",
        },
      },
      {
        id: "cpq14-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-cmath",
        prompt: "130 students travel in buses that hold 50 each. Which expression gives the number of buses needed?",
        options: [
          { id: "a", text: "ceil(130 / 50.0)" },
          { id: "b", text: "130 / 50" },
          { id: "c", text: "floor(130 / 50.0)" },
          { id: "d", text: "round(130 / 50.0)" },
        ],
        correct: "a",
        explanation: "130 / 50.0 is 2.6, and ceil rounds UP to 3: two buses would leave 30 students behind.",
        whyWrong: {
          b: "Integer division gives 2, leaving 30 students without a seat.",
          c: "floor rounds down to 2.",
          d: "round gives 3 here only by luck; for 110 students (2.2) it would give 2.",
        },
      },
      {
        id: "cpq14-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-formula-translate",
        prompt: "Which C++ expression correctly translates A = P(1 + r/n)^(nt)?",
        options: [
          { id: "a", text: "p * pow(1 + r / n, n * t)" },
          { id: "b", text: "p * (1 + r / n) ^ (n * t)" },
          { id: "c", text: "p(1 + r / n)(n * t)" },
          { id: "d", text: "p * pow(1 + r, n * t) / n" },
        ],
        correct: "a",
        explanation: "Multiplication must be explicit, and the power is pow(base, exponent).",
        whyWrong: {
          b: "^ is not a power in C++.",
          c: "C++ needs * for multiplication; p( ) would be read as calling a function named p.",
          d: "The division by n belongs inside the base, with r.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
