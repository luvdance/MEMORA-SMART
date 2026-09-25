/**
 * ASSESSMENTS · MATHEMATICS · MONTH 1 · MODULE 3 · KINDS OF NUMBERS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Most of these questions can be answered without any arithmetic, which is
 * the point. The module is about knowing what kind of thing you are holding,
 * and the payoff is that a student can look at an answer and say it is the
 * wrong kind of number before checking a single step of the working.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l9-counting": {
    lessonId: "ma-l9-counting",
    passMark: 70,
    questions: [
      {
        id: "maq9-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-n-zero",
        prompt: "Which statement about zero is correct?",
        options: [
          { id: "a", text: "Zero is not a number, since it represents nothing" },
          {
            id: "b",
            text: "Zero is a number and also a place holder, and both jobs matter",
          },
          { id: "c", text: "Zero is only a place holder and never a quantity" },
          { id: "d", text: "Zero is the smallest number there is" },
        ],
        correct: "b",
        explanation:
          "As a number it answers how many when the answer is none. As a place holder it keeps the 4 in 4,006 standing in the thousands column. Remove it and the number becomes 46.",
        whyWrong: {
          a: "It has a definite position on the number line and definite behaviour under every operation, which is what being a number means.",
          c: "There are 0 students absent today is a genuine quantity, and it is zero.",
          d: "Every negative number is smaller than zero, and there is no smallest number at all.",
        },
      },
      {
        id: "maq9-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-even-odd",
        prompt: "Is zero even or odd?",
        options: [
          { id: "a", text: "Odd" },
          { id: "b", text: "Even" },
          { id: "c", text: "Neither, because it is zero" },
          { id: "d", text: "Both" },
        ],
        correct: "b",
        explanation:
          "Even means it can be shared into two equal whole parts with nothing left over, and 0 divided by 2 is 0 exactly. It also fits the alternating pattern, sitting between the odd numbers 1 and minus 1.",
        whyWrong: {
          a: "Odd would mean it leaves a remainder when halved, and it does not.",
          c: "Zero is neither positive nor negative, which is a different question. Every whole number is even or odd.",
          d: "No number is both. The two categories do not overlap.",
        },
      },
      {
        id: "maq9-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-n-what-is-number",
        prompt:
          "A footballer wears shirt number 10 and another wears 7. Why is it meaningless to add them?",
        options: [
          { id: "a", text: "It is not meaningless, and the answer is 17" },
          {
            id: "b",
            text: "Those numbers are labels rather than quantities, so arithmetic on them describes nothing",
          },
          { id: "c", text: "Because shirt numbers only go up to 11" },
          { id: "d", text: "Because you should multiply them instead" },
        ],
        correct: "b",
        explanation:
          "A number can be a quantity, a position or a label. Adding quantities is meaningful; adding labels is not. A mark of 10 plus a mark of 7 is a mark of 17, and shirt 10 plus shirt 7 is nothing at all.",
        whyWrong: {
          a: "There is no shirt 17 formed by the two players standing together. The arithmetic produces a numeral that means nothing.",
          c: "Squad numbers run far higher than 11, and the limit is not the issue.",
          d: "Multiplying labels is exactly as meaningless as adding them.",
        },
      },
      {
        id: "maq9-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-n-counting",
        prompt: "Which of these questions cannot be answered with counting numbers alone?",
        options: [
          { id: "a", text: "How many students passed?" },
          { id: "b", text: "How many goats are in the pen?" },
          { id: "c", text: "What is the balance if I owe more than I have?" },
          { id: "d", text: "How many chairs are in the hall?" },
        ],
        correct: "c",
        explanation:
          "Counting numbers answer how many. A debt larger than a balance needs a number below zero, and that is why negatives had to be invented.",
        whyWrong: {
          a: "A count of students is a whole number, and counting numbers handle it.",
          b: "Livestock come in whole animals, which is the original use of these numbers.",
          d: "Another ordinary count, answerable with 1, 2, 3 and onwards.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l10-integers": {
    lessonId: "ma-l10-integers",
    passMark: 70,
    questions: [
      {
        id: "maq10-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-n-ordering",
        prompt: "Which is the smaller number, -18 or -3?",
        options: [
          { id: "a", text: "-3, because 3 is smaller than 18" },
          { id: "b", text: "-18, because it sits further left on the number line" },
          { id: "c", text: "They are equal in size" },
          { id: "d", text: "Negative numbers cannot be compared" },
        ],
        correct: "b",
        explanation:
          "Further left always means smaller. Debt makes it concrete: owing 18,000 is a worse position than owing 3,000, so it is the smaller balance.",
        whyWrong: {
          a: "This reads the digits and ignores the signs, which gives the right answer for positives and exactly the wrong answer for negatives.",
          c: "They are different distances from zero and they are different numbers.",
          d: "They compare perfectly well. Position on the line settles it every time.",
        },
      },
      {
        id: "maq10-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-opposite",
        prompt: "Which is further from zero, -9 or 4, and which is the larger number?",
        options: [
          { id: "a", text: "-9 is further from zero, and -9 is larger" },
          { id: "b", text: "-9 is further from zero, and 4 is larger" },
          { id: "c", text: "4 is further from zero, and 4 is larger" },
          { id: "d", text: "They are the same distance from zero" },
        ],
        correct: "b",
        explanation:
          "Distance from zero and size are two different questions, and negatives are where they come apart. Minus 9 is 9 units from zero, and 4 is only 4 units away, yet 4 sits further right and is therefore larger.",
        whyWrong: {
          a: "Being further from zero does not make a number larger when it lies on the negative side.",
          c: "Minus 9 is 9 units from zero, which is further than 4.",
          d: "One is 9 units away and the other is 4.",
        },
      },
      {
        id: "maq10-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-why-negatives",
        prompt: "What question could counting numbers not answer, which negatives were invented for?",
        options: [
          { id: "a", text: "How do you share three loaves among four people?" },
          { id: "b", text: "What is 3 take away 5?" },
          { id: "c", text: "How long is the diagonal of a square?" },
          { id: "d", text: "How many goats are in the pen?" },
        ],
        correct: "b",
        explanation:
          "Inside counting numbers, 3 minus 5 has no answer. Extending to integers closes that gap, and it is what lets a trader record owing more than they hold.",
        whyWrong: {
          a: "That is the question fractions were invented for, and it is the next lesson.",
          c: "That one needs irrational numbers, and it is the lesson after that.",
          d: "Counting numbers answer this perfectly well. That is what they are for.",
        },
      },
      {
        id: "maq10-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-n-integers",
        prompt: "Which of these is NOT an integer?",
        options: [
          { id: "a", text: "-7" },
          { id: "b", text: "0" },
          { id: "c", text: "3/4" },
          { id: "d", text: "25" },
        ],
        correct: "c",
        explanation:
          "Integers are the whole numbers together with their negatives, with nothing in between them. Three quarters sits between 0 and 1, so it is not one.",
        whyWrong: {
          a: "Negative whole numbers are integers. That is what extending the set achieved.",
          b: "Zero is an integer, sitting in the middle and belonging to neither side.",
          d: "Every counting number is an integer.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l11-rationals": {
    lessonId: "ma-l11-rationals",
    passMark: 70,
    questions: [
      {
        id: "maq11-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-rational",
        prompt: "Which of these is NOT a rational number?",
        options: [
          { id: "a", text: "7" },
          { id: "b", text: "0.25" },
          { id: "c", text: "0.333 recurring" },
          { id: "d", text: "The square root of 2" },
        ],
        correct: "d",
        explanation:
          "A rational number can be written as one integer over another. 7 is 7/1, 0.25 is 1/4, and 0.333 recurring is 1/3. The square root of 2 cannot be written that way at all.",
        whyWrong: {
          a: "Every integer is rational, because it can be written over 1.",
          b: "A decimal that stops can always be written as a fraction.",
          c: "A decimal that repeats can always be written as a fraction, and this one is exactly 1/3.",
        },
      },
      {
        id: "maq11-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-n-decimals",
        prompt: "Which is larger, 0.8 or 0.75, and why do people get this wrong?",
        options: [
          { id: "a", text: "0.75, because 75 is bigger than 8" },
          {
            id: "b",
            text: "0.8, and people get it wrong by comparing digits that are in different columns",
          },
          { id: "c", text: "They are equal" },
          { id: "d", text: "It cannot be decided without turning both into fractions" },
        ],
        correct: "b",
        explanation:
          "Writing 0.8 as 0.80 makes it obvious: 80 hundredths against 75 hundredths. The 8 is in the tenths column and the 7 is also in the tenths column, so the comparison is settled there.",
        whyWrong: {
          a: "This compares the digits as though they were whole numbers and ignores which column each one sits in.",
          c: "0.8 is 0.05 larger, which is a real difference.",
          d: "Fractions would work and are not needed. Padding with a zero settles it immediately.",
        },
      },
      {
        id: "maq11-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-terminating",
        prompt:
          "Turn any fraction into a decimal and one of exactly two things happens. What are they?",
        options: [
          { id: "a", text: "It stops, or it runs forever with no pattern" },
          { id: "b", text: "It stops, or it falls into a repeating pattern" },
          { id: "c", text: "It always stops" },
          { id: "d", text: "It always repeats" },
        ],
        correct: "b",
        explanation:
          "3/8 gives 0.375 and stops. 1/7 gives 0.142857 repeating. A rational number always does one or the other, and that is exactly the test that separates it from an irrational.",
        whyWrong: {
          a: "Running forever with no pattern is what irrational numbers do, and no fraction produces one.",
          c: "1/3 does not stop, and neither does 1/7.",
          d: "1/4 stops at 0.25 and never repeats anything.",
        },
      },
      {
        id: "maq11-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-n-density",
        prompt: "How many numbers lie between 0.4 and 0.5?",
        options: [
          { id: "a", text: "Nine, being 0.41 up to 0.49" },
          { id: "b", text: "Ninety nine, counting to two decimal places" },
          { id: "c", text: "Infinitely many, because you can always halve the gap again" },
          { id: "d", text: "None, since they are next to each other" },
        ],
        correct: "c",
        explanation:
          "0.45 is between them, 0.425 is between 0.4 and 0.45, and 0.4125 is between 0.4 and 0.425. This never runs out. Unlike the counting numbers, the rationals have no next one.",
        whyWrong: {
          a: "That counts only to two decimal places, and there is no rule limiting how many places a number may have.",
          b: "Same problem at three decimal places. The count keeps growing because the decimals keep going.",
          d: "Nothing is next to anything on this part of the number line, which is the whole point of the lesson.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l12-reals": {
    lessonId: "ma-l12-reals",
    passMark: 70,
    questions: [
      {
        id: "maq12-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-irrational",
        prompt: "Why is writing pi as 22/7 and calling it exact a mistake?",
        options: [
          { id: "a", text: "22/7 is not close to pi" },
          {
            id: "b",
            text: "Pi is irrational, so no fraction of two whole numbers can equal it exactly",
          },
          { id: "c", text: "22/7 is larger than any circle can produce" },
          { id: "d", text: "It is not a mistake, since 22/7 is the definition of pi" },
        ],
        correct: "b",
        explanation:
          "22/7 is a rational approximation and a good one. Pi cannot be written as a ratio of two integers at all, which is why questions ask for answers in terms of pi.",
        whyWrong: {
          a: "It is very close, which is why it is used. Close is not equal.",
          c: "22/7 is about 3.1428 and pi is about 3.14159, so it is slightly larger and both describe real circles.",
          d: "Pi is defined as the ratio of a circle's circumference to its diameter, and that ratio turns out to be irrational.",
        },
      },
      {
        id: "maq12-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-root-two",
        prompt: "What did the discovery about the diagonal of a unit square show?",
        options: [
          { id: "a", text: "That the diagonal cannot be drawn" },
          {
            id: "b",
            text: "That a length you can draw and measure may have no expression as a ratio of whole numbers",
          },
          { id: "c", text: "That Pythagoras' theorem is wrong for squares" },
          { id: "d", text: "That squares have no diagonals" },
        ],
        correct: "b",
        explanation:
          "The diagonal is there, you can draw it with a ruler, and its length is the square root of 2, which cannot be written as a fraction. The line was not the problem; the number system was incomplete.",
        whyWrong: {
          a: "It can be drawn easily. That is precisely what made the discovery uncomfortable.",
          c: "The theorem is what produces the result. It is not contradicted by it.",
          d: "Every square has two diagonals.",
        },
      },
      {
        id: "maq12-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-n-family-tree",
        prompt: "Which statement about the family of number sets is correct?",
        options: [
          { id: "a", text: "Integers and rationals are separate sets with nothing in common" },
          { id: "b", text: "Every integer is rational, and every rational is real" },
          { id: "c", text: "Every rational number is an integer" },
          { id: "d", text: "Irrational numbers are a kind of rational number" },
        ],
        correct: "b",
        explanation:
          "Each set sits inside the next. Counting numbers are inside whole numbers, inside integers, inside rationals, and the rationals together with the irrationals make the reals.",
        whyWrong: {
          a: "Every integer is a rational number, because it can be written over 1.",
          c: "3/4 is rational and is not an integer. The containment runs the other way.",
          d: "Irrational means not expressible as a ratio, which is the opposite of rational. They share no members.",
        },
      },
      {
        id: "maq12-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-n-why-classify",
        prompt:
          "A question asks how many buses are needed and a student answers 5.6. What does knowing the kind of number tell you, before checking any working?",
        options: [
          { id: "a", text: "Nothing, the arithmetic has to be checked first" },
          {
            id: "b",
            text: "That the answer is the wrong kind of number, since a count of buses must be whole",
          },
          { id: "c", text: "That the answer should be rounded down to 5" },
          { id: "d", text: "That the question is badly worded" },
        ],
        correct: "b",
        explanation:
          "A count of objects is a whole number, so 5.6 cannot be a final answer regardless of the arithmetic. The division probably gave 5.6 and the step of deciding what to do with the remainder was skipped. Since the leftover passengers still have to travel, the answer is 6.",
        whyWrong: {
          a: "The kind of answer can be judged before the arithmetic, and that is what makes this check so cheap.",
          c: "Rounding down leaves passengers behind. The context decides the direction, and here it rounds up.",
          d: "The question is fine. The reading step was skipped.",
        },
      },
      {
        id: "maq12-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-n-real",
        prompt: "What are the real numbers?",
        options: [
          { id: "a", text: "Only the numbers that can be written as fractions" },
          { id: "b", text: "Every point on the number line, rational and irrational together" },
          { id: "c", text: "Only the positive numbers" },
          { id: "d", text: "Only the whole numbers" },
        ],
        correct: "b",
        explanation:
          "Put the rationals and the irrationals together and there are no gaps left. Every point on the line is a real number and every real number is a point on the line.",
        whyWrong: {
          a: "That describes the rationals alone, which leave gaps where the irrationals sit.",
          c: "Negatives are real numbers too. They occupy the left half of the line.",
          d: "Fractions and irrationals are real as well, and they are what fill the space between the whole numbers.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
