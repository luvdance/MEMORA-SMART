/**
 * ASSESSMENTS · MATHEMATICS · MONTH 2 · MODULE 1 · THE FOUR OPERATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The arithmetic itself is drilled by the generated questions in the lessons.
 * These check the UNDERSTANDING the drills cannot: why the placeholder zero
 * is there, what the remainder means in a given context, and why BODMAS is
 * four ranks rather than six steps.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l17-add-subtract": {
    lessonId: "ma-l17-add-subtract",
    passMark: 70,
    questions: [
      {
        id: "maq17-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-op-columns",
        prompt: "When adding 473 and 86 in columns, what must line up?",
        options: [
          { id: "a", text: "The left-hand edges of the two numbers" },
          { id: "b", text: "The place-value columns: units under units, tens under tens" },
          { id: "c", text: "Nothing — the order does not matter" },
          { id: "d", text: "The largest digits" },
        ],
        correct: "b",
        explanation:
          "Each column is a different value, so only digits of the same value may be added together. For whole numbers that happens to mean aligning the right-hand edges, because that is where the units column is.",
        whyWrong: {
          a: "That puts the 8 tens under the 4 hundreds, so eighty gets added as eight hundred.",
          c: "The order of the two numbers does not matter, but their alignment absolutely does.",
          d: "Size of digit has nothing to do with it. Position is what carries the value.",
        },
      },
      {
        id: "maq17-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-op-carrying",
        prompt: "In the addition 47 + 38, the units give 15. What is the carried 1 actually worth?",
        options: [
          { id: "a", text: "One unit" },
          { id: "b", text: "One ten" },
          { id: "c", text: "One hundred" },
          { id: "d", text: "Nothing — it is just a reminder" },
        ],
        correct: "b",
        explanation:
          "15 units is 1 ten and 5 units. The 5 stays in the units column and the ten is carried into the tens column, which is exactly where it is written.",
        whyWrong: {
          a: "If it were one unit it would stay where it was. It is carried precisely because it is too big for the units column.",
          c: "Ten units make one ten, not one hundred. A hundred would be ten tens.",
          d: "It is a real quantity. Leaving it out makes the answer ten too small.",
        },
      },
      {
        id: "maq17-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-op-borrowing",
        prompt: "A student works out 62 − 27 and gets 45. What did they do?",
        options: [
          { id: "a", text: "They borrowed twice by mistake" },
          {
            id: "b",
            text: "In the units they did 7 − 2 instead of borrowing to do 12 − 7",
          },
          { id: "c", text: "They added instead of subtracting" },
          { id: "d", text: "Nothing — 45 is correct" },
        ],
        correct: "b",
        explanation:
          "2 − 7 cannot be done without borrowing, so they subtracted the smaller digit from the larger one instead and got 5. The correct answer is 35: borrow a ten to make 12 − 7 = 5, leaving 5 − 2 = 3 in the tens.",
        whyWrong: {
          a: "Borrowing twice would change the tens column too. Here the tens are 6 − 2 = 4, which is the untouched subtraction.",
          c: "62 + 27 is 89, not 45.",
          d: "62 − 27 = 35. The inverse check gives it away: 45 + 27 = 72, not 62.",
        },
      },
      {
        id: "maq17-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-op-checking",
        prompt: "Why is checking a subtraction by adding better than doing the subtraction again?",
        options: [
          { id: "a", text: "Addition is easier than subtraction" },
          {
            id: "b",
            text: "Repeating the same calculation tends to repeat the same mistake; the inverse is a genuinely different route",
          },
          { id: "c", text: "Because examiners require it" },
          { id: "d", text: "It is not better; they are equally good" },
        ],
        correct: "b",
        explanation:
          "An error usually happens for a reason — a borrowing rule misapplied, a digit misread — and that reason is still there the second time. Adding the answer back to what was subtracted is a different operation, so the error has to survive two different methods.",
        whyWrong: {
          a: "Ease is not the point, and for some people it is not even true.",
          c: "No examiner requires a particular checking method. The reason is reliability.",
          d: "They are not. Re-running the same procedure is the weakest possible check.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l18-multiplication": {
    lessonId: "ma-l18-multiplication",
    passMark: 70,
    questions: [
      {
        id: "maq18-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-op-long-multiplication",
        prompt:
          "In the long multiplication 348 × 24, the second row is 6960 rather than 696. Why the extra zero?",
        options: [
          { id: "a", text: "To make the columns line up neatly" },
          {
            id: "b",
            text: "Because that row is 348 × 20, not 348 × 2 — without the zero it is ten times too small",
          },
          { id: "c", text: "It is optional and can be left out" },
          { id: "d", text: "Because 348 ends in an 8" },
        ],
        correct: "b",
        explanation:
          "24 is split into 20 + 4. The second row multiplies by the TENS digit, so it is a multiple of ten and must end in a zero. That is the whole reason the method works.",
        whyWrong: {
          a: "Neatness is a side effect. The zero is there because the row represents a different quantity.",
          c: "Leaving it out gives 1392 + 696 = 2088 instead of 8352 — wrong by thousands.",
          d: "The last digit of the first number has nothing to do with it. The zero comes from the tens digit of the second.",
        },
      },
      {
        id: "maq18-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-op-by-ten",
        prompt: "Why is 'multiplying by 10 adds a zero' a bad rule to learn?",
        options: [
          { id: "a", text: "It is wrong even for whole numbers" },
          {
            id: "b",
            text: "It breaks for decimals — 3.5 × 10 is 35, not 3.50 — whereas 'every digit moves one column left' always works",
          },
          { id: "c", text: "Because zeros are not really numbers" },
          { id: "d", text: "It is fine; there is nothing wrong with it" },
        ],
        correct: "b",
        explanation:
          "For whole numbers it describes what happens, but it is a description rather than a reason. The moment a decimal appears it gives the wrong answer, while the column-movement version handles every case.",
        whyWrong: {
          a: "For whole numbers it gives the right answer every time, which is exactly why it survives long enough to cause trouble later.",
          c: "Zero is a number and, in place value, one of the most important ones.",
          d: "It fails on decimals, on standard form and on number bases — three topics in this course.",
        },
      },
      {
        id: "maq18-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-op-tables",
        prompt:
          "A student works out 7 × 8 by counting up in sevens. The answer is right. What is the concern?",
        options: [
          { id: "a", text: "There is none — the answer is correct" },
          {
            id: "b",
            text: "The counting uses attention that the bigger problem needs, so they will look weak at topics that merely contain a table fact",
          },
          { id: "c", text: "Counting up gives wrong answers" },
          { id: "d", text: "They should count up in eights instead" },
        ],
        correct: "b",
        explanation:
          "Working memory is small and fixed. Spending it on a fact that should be recalled leaves none for the fractions, algebra or word problem the fact was one step inside — and the student then appears to be bad at THOSE.",
        whyWrong: {
          a: "The answer being right is why the problem is invisible until it starts costing marks elsewhere.",
          c: "Counting up is reliable. It is slow, not wrong.",
          d: "Counting in eights is exactly as slow. The fix is recall, not a better counting strategy.",
        },
      },
      {
        id: "maq18-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-op-multiply-words",
        prompt:
          "A generator uses 3 litres an hour and runs 7 hours a day. Diesel costs ₦1,150 a litre. What is the daily cost?",
        options: [
          { id: "a", text: "₦3,450" },
          { id: "b", text: "₦8,050" },
          { id: "c", text: "₦24,150" },
          { id: "d", text: "₦1,160" },
        ],
        correct: "c",
        explanation:
          "3 × 7 = 21 litres a day, and 21 × ₦1,150 = ₦24,150. Two repeated-amount shapes in sequence: litres per hour over hours, then naira per litre over litres.",
        whyWrong: {
          a: "That is 3 × ₦1,150 — the cost of one hour, not one day. The 7 hours has been left out.",
          b: "That is 7 × ₦1,150, which prices the hours as though each used one litre.",
          d: "That adds the numbers instead of multiplying. Adding a rate to a price produces nothing meaningful.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l19-division": {
    lessonId: "ma-l19-division",
    passMark: 70,
    questions: [
      {
        id: "maq19-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-op-remainder",
        prompt:
          "100 eggs are packed into crates of 12. The question asks how many crates are NEEDED. What is the answer?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "9" },
          { id: "c", text: "4" },
          { id: "d", text: "8 remainder 4" },
        ],
        correct: "b",
        explanation:
          "100 ÷ 12 = 8 remainder 4. Eight crates are full and four eggs are left, and those four still need a crate — so nine crates are needed.",
        whyWrong: {
          a: "8 is the number of FULL crates. It is the right answer to a different question, and the wording here is 'needed'.",
          c: "4 is the remainder — the eggs left over, not a number of crates.",
          d: "That is the division written out. The question asked for a number of crates, so a decision about the remainder still has to be made.",
        },
      },
      {
        id: "maq19-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-op-remainder",
        prompt:
          "250 students need buses holding 45 each. A student calculates 250 ÷ 45 = 5 remainder 25 and answers 5 buses. What is wrong?",
        options: [
          { id: "a", text: "The division is wrong" },
          {
            id: "b",
            text: "Five buses leave 25 students behind, and they still have to travel — so 6 buses are needed",
          },
          { id: "c", text: "They should have answered 25" },
          { id: "d", text: "Nothing is wrong" },
        ],
        correct: "b",
        explanation:
          "The division is right and the reading is not. The remainder of 25 is real students, and 25 is less than a full bus but still needs one. The answer is 6.",
        whyWrong: {
          a: "5 × 45 = 225, and 225 + 25 = 250. The arithmetic is exactly right.",
          c: "25 is the remainder — the students not yet seated — not a number of buses.",
          d: "Twenty-five students would be left at the school, which is not an acceptable answer to the question as asked.",
        },
      },
      {
        id: "maq19-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-op-divide-zero",
        prompt: "Why does 12 ÷ 0 have no answer?",
        options: [
          { id: "a", text: "Because the answer is zero" },
          { id: "b", text: "Because the answer is infinity" },
          {
            id: "c",
            text: "Because no number multiplied by 0 gives 12 — anything times zero is zero",
          },
          { id: "d", text: "Because calculators cannot display it" },
        ],
        correct: "c",
        explanation:
          "Division asks what multiplies the divisor to give the dividend. 12 ÷ 4 = 3 because 4 × 3 = 12. For 12 ÷ 0 we would need 0 × something = 12, and nothing satisfies that.",
        whyWrong: {
          a: "Zero is the answer to 0 ÷ 12, which is a different and perfectly ordinary question.",
          b: "Infinity is not a number you can multiply by zero to get 12. The question has no answer rather than a very large one.",
          d: "The calculator refuses because there is no answer, not the other way round.",
        },
      },
      {
        id: "maq19-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-op-what-divide",
        prompt: "Which reading of division makes sense of 3 ÷ 1/2 = 6?",
        options: [
          { id: "a", text: "Sharing 3 among half a person" },
          { id: "b", text: "How many halves fit into 3?" },
          { id: "c", text: "Half of 3" },
          { id: "d", text: "It does not make sense; the answer should be 1.5" },
        ],
        correct: "b",
        explanation:
          "Division has two readings: sharing and grouping. Sharing among half a person is meaningless, but 'how many halves fit into 3' is perfectly clear, and the answer is six.",
        whyWrong: {
          a: "That reading collapses. Keeping both readings available is exactly why this matters.",
          c: "Half of 3 is 1.5, which is 3 × 1/2 — multiplication, not division.",
          d: "1.5 is the answer to 3 × 1/2. Dividing by a number smaller than one makes the result larger, which the grouping picture explains.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l20-bodmas": {
    lessonId: "ma-l20-bodmas",
    passMark: 70,
    questions: [
      {
        id: "maq20-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-op-bodmas",
        prompt: "Evaluate 2 + 3 × 4.",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "14" },
          { id: "c", text: "24" },
          { id: "d", text: "9" },
        ],
        correct: "b",
        explanation:
          "Multiplication comes before addition, so 3 × 4 = 12 first, then 2 + 12 = 14.",
        whyWrong: {
          a: "That is left to right: (2 + 3) × 4. Working left to right ignores the order of operations, and 20 is the answer to a different expression.",
          c: "24 is 2 × 3 × 4, which treats the plus as a times.",
          d: "9 is 2 + 3 + 4. The multiplication has been read as an addition.",
        },
      },
      {
        id: "maq20-2",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-op-bodmas",
        prompt: "Evaluate 24 ÷ 4 × 3.",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "18" },
          { id: "c", text: "288" },
          { id: "d", text: "8" },
        ],
        correct: "b",
        explanation:
          "Division and multiplication are ONE rank, worked left to right. 24 ÷ 4 = 6, then 6 × 3 = 18.",
        whyWrong: {
          a: "This does all the multiplication before any division: 4 × 3 = 12, then 24 ÷ 12 = 2. That is the exact misreading of BODMAS this question tests.",
          c: "That multiplies everything: 24 × 4 × 3. The division has been ignored.",
          d: "24 ÷ 3 = 8 leaves the 4 out altogether.",
        },
      },
      {
        id: "maq20-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-op-fraction-bar",
        prompt:
          "A candidate copies the fraction (8 + 4)/(6 − 3) into a calculator as 8 + 4 ÷ 6 − 3. What have they lost?",
        options: [
          { id: "a", text: "Nothing — it is the same expression" },
          {
            id: "b",
            text: "The grouping. A fraction bar brackets everything above and below it, so both need brackets when written on one line",
          },
          { id: "c", text: "Only the minus sign" },
          { id: "d", text: "The calculator will work it out correctly anyway" },
        ],
        correct: "b",
        explanation:
          "The fraction is 12/3 = 4. Typed without brackets the calculator does 4 ÷ 6 first and returns about 5.667. It needs (8 + 4) ÷ (6 − 3).",
        whyWrong: {
          a: "The two give different answers — 4 against 5.667 — so they are not the same expression.",
          c: "The minus is still there. What has gone is the grouping the bar was providing.",
          d: "The calculator applies BODMAS to exactly what it was given, which is a different expression from the one on the page.",
        },
      },
      {
        id: "maq20-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-op-why-order",
        prompt: "Why is 14, rather than 20, the agreed value of 2 + 3 × 4?",
        options: [
          { id: "a", text: "Because it is the smaller answer" },
          {
            id: "b",
            text: "Because 3 × 4 is a single quantity — three lots of four — and the expression means 'two, plus that quantity'",
          },
          { id: "c", text: "Because calculators are built that way" },
          { id: "d", text: "It is arbitrary; either would do if everyone agreed" },
        ],
        correct: "b",
        explanation:
          "The convention describes how the expression is built rather than being imposed on top of it. In '₦2 for a bottle, plus 3 crates of 4 bottles', the 3 × 4 belongs together because it is one quantity.",
        whyWrong: {
          a: "Size has nothing to do with it. In 2 × 3 + 4 the convention gives 10, which is larger than 2 × 7 = 14.",
          c: "Calculators are built that way because the convention already existed. The cause runs the other way.",
          d: "Partly true — conventions need agreement — but this one is not arbitrary, because it matches the way quantities combine in real situations.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
