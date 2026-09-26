/**
 * ASSESSMENTS · MATHEMATICS · MONTH 3 · MODULE 4 · APPROXIMATION AND ACCURACY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Two questions here are doing work the rest of the bank cannot.
 *
 * The 2.34999 question tests whether a candidate rounds in stages, which is the
 * error that makes rounding feel unpredictable. Only one digit votes, and a
 * candidate who lets three of them vote will be wrong on a small but steady
 * fraction of every paper for years.
 *
 * The shelf and gap question tests whether bounds have been understood as a
 * range rather than performed as a procedure. A candidate can find bounds
 * correctly and still answer 'yes it fits', which shows the arithmetic landed
 * and the idea did not.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l45-decimal-places": {
    lessonId: "ma-l45-decimal-places",
    passMark: 70,
    questions: [
      {
        id: "maq45-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ap-decimal-places",
        prompt: "What is 3.14159 to 3 decimal places?",
        options: [
          { id: "a", text: "3.141" },
          { id: "b", text: "3.142" },
          { id: "c", text: "3.14" },
          { id: "d", text: "3.150" },
        ],
        correct: "b",
        explanation:
          "Keep three digits after the point, 3.141, and look at the next one. It is 5, so the last kept digit goes up: 3.142.",
        whyWrong: {
          a: "The deciding digit, 5, has been ignored. Five or more rounds the last kept digit up.",
          c: "That is two decimal places. The instruction asked for three.",
          d: "This has rounded in stages, letting the 9 push the 5 up first. Only the one deciding digit gets a vote.",
        },
      },
      {
        id: "maq45-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ap-decimal-places",
        prompt: "What is 2.34999 to 1 decimal place?",
        options: [
          { id: "a", text: "2.4" },
          { id: "b", text: "2.3" },
          { id: "c", text: "2.35" },
          { id: "d", text: "2.5" },
        ],
        correct: "b",
        explanation:
          "Keep 2.3 and look at the next digit only. It is 4, so nothing changes. The three 9s after it are not allowed a vote, however large they look.",
        whyWrong: {
          a: "This rounds in stages: 2.34999 to 2.35, then 2.35 to 2.4. Each stage lets a digit vote twice, which is what makes rounding feel unpredictable.",
          c: "That is two decimal places, and it is also the halfway result of the staged rounding that produces the wrong answer.",
          d: "Two stages of the same error. Cover everything after the deciding digit with a finger before you decide.",
        },
      },
      {
        id: "maq45-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ap-nearest-what",
        prompt: "What is 4,847.62 to the nearest hundred?",
        options: [
          { id: "a", text: "4,900" },
          { id: "b", text: "4,800" },
          { id: "c", text: "4,850" },
          { id: "d", text: "5,000" },
        ],
        correct: "b",
        explanation:
          "Rounding to the nearest hundred means the tens digit decides, and it is 4, so the hundreds digit stays. The 47.62 that follows gets no vote however close to 50 it looks.",
        whyWrong: {
          a: "This lets the 47.62 round itself up to 50 first and then push the hundreds digit. Only the tens digit decides.",
          c: "That is to the nearest fifty, which is not a standard instruction, or the nearest ten misread.",
          d: "That is to the nearest thousand, where the hundreds digit 8 does decide and does round up.",
        },
      },
      {
        id: "maq45-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-round-once",
        prompt:
          "A fence needs 20 metres at ₦1,333.33 per metre. Why is rounding the rate to ₦1,333 first a problem?",
        options: [
          { id: "a", text: "It is not a problem, since money is whole naira" },
          {
            id: "b",
            text: "Because the 33 kobo error is then multiplied by 20, losing nearly ₦7 from the total",
          },
          { id: "c", text: "Because 1,333.33 should be rounded up to 1,334" },
          { id: "d", text: "Because the perimeter should be rounded instead" },
        ],
        correct: "b",
        explanation:
          "20 × 1,333.33 = 26,666.60, which is 26,667 to the nearest naira, while 20 × 1,333 = 26,660. Rounding before multiplying multiplies the error, which is why the rule is to round once, at the end.",
        whyWrong: {
          a: "Money runs to the kobo, which is two decimal places, and a third of a naira is real money once it is multiplied twenty times.",
          c: "The direction of the rounding is not the issue. Rounding at all, before the multiplication, is.",
          d: "The perimeter is exactly 20 metres, so there is nothing about it to round.",
        },
      },
      {
        id: "maq45-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-what-rounding-claims",
        prompt:
          "A length is stated as 12 cm to the nearest centimetre. What does that statement actually claim?",
        options: [
          { id: "a", text: "The length is exactly 12 cm" },
          { id: "b", text: "The length is somewhere from 11.5 cm up to 12.5 cm" },
          { id: "c", text: "The length is between 11 cm and 13 cm" },
          { id: "d", text: "The length is 12 cm give or take a millimetre" },
        ],
        correct: "b",
        explanation:
          "Everything from 11.5 up to 12.5 rounds to 12, so the statement is a claim about a range rather than a fact about a value. Writing more digits than that range supports would be claiming precision you do not have.",
        whyWrong: {
          a: "If it were exact there would be no need for the phrase 'to the nearest centimetre'. That phrase is stating how much is known.",
          c: "Too wide. A length of 12.9 would round to 13, not to 12, so it is outside what the statement allows.",
          d: "Too narrow. A millimetre either side would be 11.9 to 12.1, and rounding to the nearest centimetre permits half a centimetre either side.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l46-significant-figures": {
    lessonId: "ma-l46-significant-figures",
    passMark: 70,
    questions: [
      {
        id: "maq46-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ap-sig-figs",
        prompt: "What is 4,872 to 2 significant figures?",
        options: [
          { id: "a", text: "48" },
          { id: "b", text: "4,900" },
          { id: "c", text: "4,800" },
          { id: "d", text: "4,870" },
        ],
        correct: "b",
        explanation:
          "Counting from the first non zero digit, the first two figures are 4 and 8, and the next digit is 7, so the 8 rounds up to 9. The zeros then hold the tens and units columns open: 4,900.",
        whyWrong: {
          a: "The two zeros have been dropped, which changes the number by a factor of a hundred. They are placeholders, exactly as in Month 1.",
          c: "The deciding digit, 7, has been ignored. Seven is five or more, so the 8 goes up.",
          d: "That is three significant figures, and the instruction asked for two.",
        },
      },
      {
        id: "maq46-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ap-sig-figs",
        prompt: "What is 0.004872 to 2 significant figures?",
        options: [
          { id: "a", text: "0.00" },
          { id: "b", text: "0.0049" },
          { id: "c", text: "0.0048" },
          { id: "d", text: "0.0000" },
        ],
        correct: "b",
        explanation:
          "Counting starts at the first non zero digit, the 4. The first two figures are 4 and 8, and the next digit is 7, so the 8 rounds up: 0.0049. The leading zeros place the number and are not counted.",
        whyWrong: {
          a: "That is two decimal places, which destroys the number entirely. This is exactly why small numbers need significant figures rather than decimal places.",
          c: "The deciding digit 7 has been ignored, so the 8 has not been rounded up.",
          d: "Four decimal places, which again rounds the whole quantity away to nothing.",
        },
      },
      {
        id: "maq46-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-ap-sig-vs-dp",
        prompt:
          "Why is 'to 2 significant figures' a more useful instruction than 'to 2 decimal places' for the number 0.00456?",
        options: [
          { id: "a", text: "It is not; both give the same answer" },
          {
            id: "b",
            text: "Because 2 d.p. gives 0.00, losing the whole quantity, while 2 s.f. gives 0.0046 and keeps the information",
          },
          { id: "c", text: "Because significant figures are always more accurate" },
          { id: "d", text: "Because decimal places cannot be used on numbers under 1" },
        ],
        correct: "b",
        explanation:
          "Decimal places count from the point and significant figures count from the first digit that carries information. On a small number the leading zeros use up the decimal places, so the instruction rounds away the very thing being measured.",
        whyWrong: {
          a: "0.00 and 0.0046 are very different answers, and only one of them is any use.",
          c: "Not always. For 12.985, two decimal places gives 12.99 and two significant figures gives 13, which is less precise. Which is better depends on the number.",
          d: "They can be used and they work perfectly well on 0.75. The problem only arises when leading zeros consume the places.",
        },
      },
      {
        id: "maq46-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-estimating-1sf",
        prompt:
          "Estimate (38.7 × 6.2) ÷ 0.48 by rounding each number to one significant figure.",
        options: [
          { id: "a", text: "(40 × 6) ÷ 0.5 = 480" },
          { id: "b", text: "(40 × 6) ÷ 2 = 120" },
          { id: "c", text: "(39 × 6) ÷ 0.5 = 468" },
          { id: "d", text: "(40 × 6) × 0.5 = 120" },
        ],
        correct: "a",
        explanation:
          "One significant figure each gives 40, 6 and 0.5. Then 240 ÷ 0.5 = 480, because dividing by a half doubles. The exact answer is 499.9, so the estimate confirms the size and rules out 49.99 and 4,999.",
        whyWrong: {
          b: "This rounds 0.48 to 2 rather than to 0.5. One significant figure of 0.48 is 0.5, and the first significant digit is the 4.",
          c: "39 is two significant figures. The instruction was one, and keeping two makes the arithmetic harder for no gain.",
          d: "This multiplies by 0.5 instead of dividing. Dividing by something under 1 makes an answer larger, which is the fraction lesson again.",
        },
      },
      {
        id: "maq46-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-ap-when-to-round",
        prompt:
          "A question gives measurements to 3 significant figures and states no accuracy for the answer. What should you give?",
        options: [
          { id: "a", text: "As many digits as the calculator shows" },
          { id: "b", text: "About 3 significant figures, matching the data you were given" },
          { id: "c", text: "A whole number, since no accuracy was stated" },
          { id: "d", text: "One significant figure, since that is what estimating means" },
        ],
        correct: "b",
        explanation:
          "You cannot know more than you were told. Data to three significant figures does not support an answer to eight, and matching the given accuracy is what a marker expects when the question is silent.",
        whyWrong: {
          a: "That claims a precision the data never had, and mark schemes penalise it. The calculator does not know how accurate the measurements were.",
          c: "A whole number may throw away accuracy the data did support. Silence means match the data, not round hard.",
          d: "One significant figure is for an estimate, and this is not an estimate. It is a final answer from measured data.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l47-bounds": {
    lessonId: "ma-l47-bounds",
    passMark: 70,
    questions: [
      {
        id: "maq47-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ap-bounds",
        prompt:
          "A mass is 4.7 kg to 1 decimal place. What are its lower and upper bounds?",
        options: [
          { id: "a", text: "4.2 and 5.2" },
          { id: "b", text: "4.65 and 4.75" },
          { id: "c", text: "4.6 and 4.8" },
          { id: "d", text: "4.69 and 4.71" },
        ],
        correct: "b",
        explanation:
          "The rounding unit is 0.1 kg, and half of it is 0.05. Subtract and add: 4.65 and 4.75. Everything in that stretch rounds to 4.7.",
        whyWrong: {
          a: "This halves 1 rather than 0.1. Ask what the number was rounded TO, then halve that.",
          c: "This adds and subtracts the whole rounding unit instead of half of it. 4.6 would round to 4.6, not to 4.7.",
          d: "This uses 0.01 as the rounding unit, which would be the case for a measurement given to 2 decimal places.",
        },
      },
      {
        id: "maq47-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ap-bounds",
        prompt:
          "A figure of 4,900 is given to 2 significant figures. What are its bounds?",
        options: [
          { id: "a", text: "4,899.5 and 4,900.5" },
          { id: "b", text: "4,850 and 4,950" },
          { id: "c", text: "4,890 and 4,910" },
          { id: "d", text: "4,800 and 5,000" },
        ],
        correct: "b",
        explanation:
          "Two significant figures on a four digit number means it was rounded to the nearest hundred, so the half is 50. Subtract and add: 4,850 and 4,950.",
        whyWrong: {
          a: "This treats the number as rounded to the nearest whole number, which would be four significant figures rather than two.",
          c: "This treats it as rounded to the nearest ten, which would be three significant figures.",
          d: "This adds and subtracts the whole hundred instead of half of it. 4,800 would round to 4,800.",
        },
      },
      {
        id: "maq47-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-ap-bounds-edges",
        prompt:
          "For a length of 12 cm to the nearest cm, why is the upper bound written as 12.5 rather than 12.49?",
        options: [
          { id: "a", text: "Because 12.49 is not accurate enough" },
          {
            id: "b",
            text: "Because the convention is to write the halfway value and carry the strictness in the inequality sign, so the length is at least 11.5 and under 12.5",
          },
          { id: "c", text: "Because 12.5 rounds to 12" },
          { id: "d", text: "Because upper bounds are always rounded up" },
        ],
        correct: "b",
        explanation:
          "A true length of exactly 12.5 would round to 13, so the length never reaches the upper bound. The convention writes 12.5 and uses the strict inequality, rather than inventing 12.49 or 12.4999.",
        whyWrong: {
          a: "12.49 is a precise number, and the problem is that it is arbitrary. Why not 12.499, or 12.4999? The convention avoids that regress.",
          c: "It does not. 12.5 rounds up to 13, which is exactly why the true length must stay below it.",
          d: "Nothing is being rounded here. The bound is the halfway point itself, found by halving the rounding unit.",
        },
      },
      {
        id: "maq47-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-bounds-in-use",
        prompt:
          "A shelf is 12 cm wide and a gap is 12 cm wide, both to the nearest cm. Will the shelf fit?",
        options: [
          { id: "a", text: "Yes, since both are 12 cm" },
          {
            id: "b",
            text: "It might not. The shelf could be nearly 12.5 and the gap only 11.5",
          },
          { id: "c", text: "No, it definitely will not fit" },
          { id: "d", text: "Yes, with 1 cm to spare" },
        ],
        correct: "b",
        explanation:
          "Each measurement covers a range from 11.5 to 12.5, so the worst case has a shelf of nearly 12.5 in a gap of 11.5. The honest answer is that the measurements are not precise enough to say, and if it matters you measure to the millimetre.",
        whyWrong: {
          a: "Both are 12 to the nearest centimetre, which is a range rather than a value. Two things in the same range can differ by almost a whole centimetre.",
          c: "It might fit. The best case has a shelf of 11.5 in a gap of nearly 12.5, with room to spare.",
          d: "That is the best case quoted as if it were certain. The spare centimetre is possible, not guaranteed.",
        },
      },
      {
        id: "maq47-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-combining-bounds",
        prompt:
          "A = 15 cm and B = 8 cm, both to the nearest cm. What is the LARGEST that A − B could be?",
        options: [
          { id: "a", text: "7.0 cm" },
          { id: "b", text: "8.0 cm" },
          { id: "c", text: "24.0 cm" },
          { id: "d", text: "6.0 cm" },
        ],
        correct: "b",
        explanation:
          "To make a gap as wide as possible you want the first length as large as it can be and the length taken away as small as it can be: 15.5 − 7.5 = 8.0. Subtraction crosses over, and the reasoning derives it without needing a remembered rule.",
        whyWrong: {
          a: "That is the difference between the stated figures, which is the middle of the range rather than the largest it could be.",
          c: "That is the largest the TOTAL could be, 15.5 + 8.5. A sum uses both upper bounds and a difference does not.",
          d: "That is the smallest the difference could be, from 14.5 − 8.5. The two extremes have been used the wrong way round.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l48-month-3-review": {
    lessonId: "ma-l48-month-3-review",
    passMark: 70,
    questions: [
      {
        id: "maq48-1",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ap-one-quantity",
        prompt: "Which row is correct?",
        options: [
          { id: "a", text: "7/8 = 0.78 = 78%" },
          { id: "b", text: "7/8 = 0.875 = 87.5%" },
          { id: "c", text: "7/8 = 0.87 exactly = 87%" },
          { id: "d", text: "7/8 = 1.14 = 114%" },
        ],
        correct: "b",
        explanation:
          "7 ÷ 8 = 0.875 exactly, and multiplying by 100 gives 87.5 per cent. Eight is built from 2s alone, so the decimal terminates, which the recurring decimal atom predicted without any dividing.",
        whyWrong: {
          a: "This copies the digits either side of the bar. 0.78 is close to 7/9, not to 7/8.",
          c: "0.875 to two decimal places is 0.88, and it is not exact either way. The exact decimal has three places.",
          d: "That is 8/7, the fraction inverted. Seven eighths is less than one whole.",
        },
      },
      {
        id: "maq48-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-choosing-form",
        prompt: "Which is larger, 5/8 or 0.63?",
        options: [
          { id: "a", text: "5/8, because a fraction is exact" },
          { id: "b", text: "0.63, because 5/8 is 0.625" },
          { id: "c", text: "They are equal" },
          { id: "d", text: "It cannot be decided without a common denominator" },
        ],
        correct: "b",
        explanation:
          "Convert to the same notation and compare column by column. 5 ÷ 8 = 0.625, and 0.630 beats 0.625 in the hundredths column. Decimals are the right notation for comparing, which is the choice the atom asked you to make first.",
        whyWrong: {
          a: "Being exact says nothing about being larger. 5/8 is exactly 0.625, which is exactly smaller than 0.63.",
          c: "They differ by 0.005, which is a real difference even though it is small.",
          d: "A common denominator would work and is the slower route. Converting the fraction to a decimal takes one division.",
        },
      },
      {
        id: "maq48-3",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-ap-errors",
        prompt:
          "Which of these four errors is a WRONG BASE error rather than a wrong method?",
        options: [
          { id: "a", text: "3/8 + 2/8 = 5/16" },
          { id: "b", text: "Percentage profit found by dividing the profit by the selling price" },
          { id: "c", text: "2.34999 rounded to 2.4 at 1 decimal place" },
          { id: "d", text: "0.00456 given as 0.00 when 2 s.f. was asked for" },
        ],
        correct: "b",
        explanation:
          "The arithmetic is perfect and the wrong quantity was used as the whole. Profit is measured against the cost price, and every percentage in the module has one specific base that the wording fixes.",
        whyWrong: {
          a: "That is adding the denominators, which is a misunderstanding of what the bottom of a fraction means rather than a wrong base.",
          c: "That is rounding in stages, letting more than one digit vote. The method is wrong, not the base.",
          d: "That is answering the decimal places instruction when significant figures were asked for. It is a misread instruction.",
        },
      },
      {
        id: "maq48-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-ap-into-month-4",
        prompt:
          "Which part of Month 3 will be used most heavily in the algebra of Month 6?",
        options: [
          { id: "a", text: "Percentage error" },
          { id: "b", text: "Fraction arithmetic, including multiplying by a reciprocal" },
          { id: "c", text: "Rounding to the nearest hundred" },
          { id: "d", text: "Reading naira and kobo" },
        ],
        correct: "b",
        explanation:
          "Every rearrangement of an equation is fraction arithmetic with letters in it, and dividing one expression by another is multiplying by a reciprocal. A gap here surfaces in Month 6 looking like a problem with algebra rather than with fractions.",
        whyWrong: {
          a: "Percentage error belongs with measurement and with science. Algebra rarely touches it.",
          c: "Rounding matters for presenting an answer and it is not what makes the algebra work.",
          d: "Money is used heavily in Month 5 commercial arithmetic rather than in algebra.",
        },
      },
      {
        id: "maq48-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ap-review",
        prompt:
          "One sentence covers percentage increase, percentage profit and percentage error together. What is it?",
        options: [
          { id: "a", text: "Always multiply by 100 at the end" },
          { id: "b", text: "The quantity being compared TO goes on the bottom" },
          { id: "c", text: "Always use the larger number as the base" },
          { id: "d", text: "Round to three significant figures" },
        ],
        correct: "b",
        explanation:
          "An increase is compared to the original, a profit to the cost, an error to the true value. All three are the same instruction, and it is the one thing that decides whether the answer is right.",
        whyWrong: {
          a: "True of all three and it is the easy part. Multiplying by 100 cannot rescue a fraction built on the wrong base.",
          c: "The base is not always the larger number. In a percentage loss the cost price is larger, and in a percentage increase the original is smaller than the new amount.",
          d: "That is about presenting the answer. It says nothing about which calculation to do.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
