/**
 * ASSESSMENTS · MATHEMATICS · MONTH 3 · MODULE 2 · DECIMALS AND MONEY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The 0.8 against 0.75 comparison is tested directly, because it is the error
 * examiners report most often in this topic and because a student who has it
 * has it consistently rather than occasionally.
 *
 * The recurring decimal question asks WHY rather than WHICH, since a list of
 * fractions that recur is memorisable and useless, while the primes of the
 * denominator settle any case the student will ever meet.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l37-decimal-place-value": {
    lessonId: "ma-l37-decimal-place-value",
    passMark: 70,
    questions: [
      {
        id: "maq37-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dc-columns",
        prompt: "In 3.475, what is the 7 worth?",
        options: [
          { id: "a", text: "7 tenths" },
          { id: "b", text: "7 hundredths" },
          { id: "c", text: "7 thousandths" },
          { id: "d", text: "7 units" },
        ],
        correct: "b",
        explanation:
          "Counting right from the point: the 4 is in the tenths column, the 7 in the hundredths, the 5 in the thousandths. Each column is a tenth of the one to its left, which is the Month 1 chart continued rightwards.",
        whyWrong: {
          a: "That is the 4, which sits in the first column after the point.",
          c: "That is the 5, which is one column further right again.",
          d: "The units column is the 3, immediately before the point. The point exists to show where that column is.",
        },
      },
      {
        id: "maq37-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-comparing",
        prompt: "Which is larger, 0.8 or 0.75?",
        options: [
          { id: "a", text: "0.75, because 75 is bigger than 8" },
          { id: "b", text: "0.8, because 8 tenths beats 7 tenths" },
          { id: "c", text: "They are equal" },
          { id: "d", text: "It depends what the numbers are measuring" },
        ],
        correct: "b",
        explanation:
          "Compare from the left. The tenths column differs first, and 8 beats 7, so nothing further right can change the result. Writing 0.8 as 0.80 makes it visible at a glance.",
        whyWrong: {
          a: "This reads the tail as a whole number, which is the commonest decimal error there is. As money it is obvious: 80 kobo is more than 75 kobo.",
          c: "0.80 and 0.75 differ by 5 hundredths, so they are five kobo apart in naira terms.",
          d: "The units do not affect which number is larger. 0.8 of anything is more than 0.75 of the same thing.",
        },
      },
      {
        id: "maq37-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-trailing-zeros",
        prompt: "Which of these pairs are the SAME number?",
        options: [
          { id: "a", text: "0.8 and 0.08" },
          { id: "b", text: "0.8 and 0.80" },
          { id: "c", text: "0.05 and 0.5" },
          { id: "d", text: "0.705 and 0.75" },
        ],
        correct: "b",
        explanation:
          "A zero at the end adds no new column: 0.80 says eight tenths and no hundredths, which was already true. A zero anywhere else pushes a digit into a smaller column and changes the value.",
        whyWrong: {
          a: "These differ by a factor of ten. The zero has moved the 8 from the tenths column into the hundredths.",
          c: "Also a factor of ten apart: five hundredths against five tenths, or five kobo against fifty kobo.",
          d: "In 0.705 the zero holds the hundredths column open, so the 5 is in the thousandths. In 0.75 the 5 is in the hundredths.",
        },
      },
      {
        id: "maq37-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-reading",
        prompt:
          "Why does the mark scheme read 0.75 as 'nought point seven five' rather than 'nought point seventy five'?",
        options: [
          { id: "a", text: "Only to be formal; both readings are equally safe" },
          {
            id: "b",
            text: "Because reading the tail as a whole number is what makes students think 0.75 is larger than 0.8",
          },
          { id: "c", text: "Because 'seventy five' is longer to say" },
          { id: "d", text: "Because 0.75 has no hundredths" },
        ],
        correct: "b",
        explanation:
          "How a decimal is said shapes how it is compared. Digit by digit keeps the columns in view, and the column is the only thing that decides size. Saying seventy five invites exactly the wrong comparison.",
        whyWrong: {
          a: "One of them causes a specific and very common error, which makes them not equally safe.",
          c: "It is shorter, and that is not the reason. The reason is what the wording does to the reader's sense of size.",
          d: "It has 5 hundredths. Its columns are 7 tenths and 5 hundredths.",
        },
      },
      {
        id: "maq37-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-dc-on-the-line",
        prompt:
          "Put in order, smallest first: 0.6, 0.06, 0.65, 0.506.",
        options: [
          { id: "a", text: "0.06, 0.506, 0.6, 0.65" },
          { id: "b", text: "0.06, 0.6, 0.65, 0.506" },
          { id: "c", text: "0.506, 0.06, 0.6, 0.65" },
          { id: "d", text: "0.6, 0.06, 0.506, 0.65" },
        ],
        correct: "a",
        explanation:
          "Write them all to three places first: 0.600, 0.060, 0.650, 0.506. Now read from the left. Filling the tails to a common length is the decimal version of finding a common denominator.",
        whyWrong: {
          b: "0.506 has been put last, probably because 506 is the largest set of digits. In the tenths column it has a 5 against the 6s, so it is smaller than all of them.",
          c: "0.506 has been placed below 0.06, which compares the tails rather than the tenths. Five tenths beats no tenths.",
          d: "0.6 has been put first, which reads the shortest number as the smallest. Length says nothing about size.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l38-decimal-arithmetic": {
    lessonId: "ma-l38-decimal-arithmetic",
    passMark: 70,
    questions: [
      {
        id: "maq38-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dc-adding",
        prompt: "What is 12.4 + 3.75?",
        options: [
          { id: "a", text: "16.15" },
          { id: "b", text: "15.79" },
          { id: "c", text: "48.4" },
          { id: "d", text: "16.79" },
        ],
        correct: "a",
        explanation:
          "Write 12.4 as 12.40 and line the points up. Tenths: 4 + 7 = 11 tenths, which carries one unit. Total 16.15.",
        whyWrong: {
          b: "This right aligns the numbers as though they were whole, so the 5 hundredths got added to the tenths column.",
          c: "This adds the digits with no regard to the point at all, treating 124 and 375 or similar.",
          d: "The carry from the tenths column has been lost or applied twice. Eleven tenths is one unit and one tenth.",
        },
      },
      {
        id: "maq38-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-multiplying",
        prompt: "What is 0.4 × 0.3?",
        options: [
          { id: "a", text: "1.2" },
          { id: "b", text: "0.12" },
          { id: "c", text: "0.012" },
          { id: "d", text: "0.7" },
        ],
        correct: "b",
        explanation:
          "Ignore the points: 4 × 3 = 12. Count the decimal places in what you started with: one plus one is two. So the answer has two places, 0.12. It is smaller than both numbers because both multipliers are under 1.",
        whyWrong: {
          a: "The decimal places have not been put back. 4 × 3 = 12 is the digit part, and two places still have to go in.",
          c: "Three places instead of two. Count the places in the original numbers only: 0.4 has one and 0.3 has one.",
          d: "This adds instead of multiplying. Four tenths plus three tenths is seven tenths.",
        },
      },
      {
        id: "maq38-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-times-ten",
        prompt: "What is 3.47 ÷ 100?",
        options: [
          { id: "a", text: "347" },
          { id: "b", text: "0.347" },
          { id: "c", text: "0.0347" },
          { id: "d", text: "0.00347" },
        ],
        correct: "c",
        explanation:
          "Dividing by 100 moves every digit two columns to the right, so the 3 that was in the units lands in the hundredths. The sense check is instant: dividing makes a positive number smaller.",
        whyWrong: {
          a: "This multiplies by 100 instead of dividing. The answer to a division by 100 must be far smaller than what you started with.",
          b: "This moves one place instead of two. A hundred has two zeros, so two places.",
          d: "Three places, which would be division by a thousand.",
        },
      },
      {
        id: "maq38-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-dividing",
        prompt: "What is 4.8 ÷ 0.6, and why is the answer larger than 4.8?",
        options: [
          { id: "a", text: "0.8, because dividing always makes a number smaller" },
          {
            id: "b",
            text: "8, because multiplying both numbers by 10 gives 48 ÷ 6, and you are asking how many 0.6s fit into 4.8",
          },
          { id: "c", text: "2.88, by multiplying instead" },
          { id: "d", text: "48 ÷ 0.6 = 80, after multiplying only the first number by 10" },
        ],
        correct: "b",
        explanation:
          "Multiply both numbers by 10 to make the divisor whole, which leaves the value unchanged for the same reason equivalent fractions do. 48 ÷ 6 = 8. It is larger than 4.8 because 0.6 is less than 1, so many of them fit in.",
        whyWrong: {
          a: "Dividing by something less than 1 makes a number larger. That belief comes from only ever dividing by whole numbers above 1.",
          c: "That is 4.8 × 0.6. Multiplying answers a different question and gives an answer smaller than 4.8.",
          d: "Only one of the two numbers was multiplied, so the value has been changed by a factor of ten. Both must be multiplied or neither.",
        },
      },
      {
        id: "maq38-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-estimating",
        prompt:
          "A student calculates 19.6 × 4.8 and gets 940.8. Which check exposes the error fastest?",
        options: [
          { id: "a", text: "Redoing 196 × 48 digit by digit" },
          {
            id: "b",
            text: "Estimating 20 × 5 = 100, which shows the answer is ten times too big",
          },
          { id: "c", text: "Checking the answer has one decimal place" },
          { id: "d", text: "Nothing catches it without a calculator" },
        ],
        correct: "b",
        explanation:
          "Decimal errors are nearly always factor of ten errors, and an estimate catches a factor of ten instantly. The digit part here, 196 × 48 = 9408, is perfectly correct; only the count of decimal places went wrong, so checking the digits would find nothing.",
        whyWrong: {
          a: "The multiplication is right, so this check passes and the error survives. That is exactly why estimating beats recalculating here.",
          c: "The answer 940.8 does have one decimal place. The number of places should be two, and counting them is the fix rather than the detection.",
          d: "A five second estimate catches it, which is the point of the atom.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l39-fractions-and-decimals": {
    lessonId: "ma-l39-fractions-and-decimals",
    passMark: 70,
    questions: [
      {
        id: "maq39-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dc-fraction-to-decimal",
        prompt: "How do you turn 3/8 into a decimal?",
        options: [
          { id: "a", text: "Divide 8 by 3" },
          { id: "b", text: "Divide 3 by 8, giving 0.375" },
          { id: "c", text: "Write 0.38" },
          { id: "d", text: "Add 3 and 8 and put a point in" },
        ],
        correct: "b",
        explanation:
          "The fraction bar means divide, top by bottom, which was established in Lesson 33. 3 ÷ 8 = 0.375. That is not a method to remember, it is what the notation already said.",
        whyWrong: {
          a: "That reverses the division and gives 2.666…, which is larger than 1. Three eighths is less than half.",
          c: "This copies the digits either side of the bar. 0.38 and 0.375 are different numbers.",
          d: "Nothing in a fraction is added. The bar is a division sign.",
        },
      },
      {
        id: "maq39-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-decimal-to-fraction",
        prompt: "What is 0.35 as a fraction in lowest terms?",
        options: [
          { id: "a", text: "35/10" },
          { id: "b", text: "7/20" },
          { id: "c", text: "35/100, which is the finished answer" },
          { id: "d", text: "3/5" },
        ],
        correct: "b",
        explanation:
          "The last digit is in the hundredths column, so the fraction is 35/100. The HCF of 35 and 100 is 5, giving 7/20. Two decimal places means two zeros on the bottom.",
        whyWrong: {
          a: "One zero on the bottom is tenths, and 0.35 goes as far as hundredths. 35/10 is 3.5, ten times too big.",
          c: "Correct and unfinished. Both numbers are divisible by 5, and the last mark is for spotting it.",
          d: "That is 0.6. The digits of the decimal have been reused rather than read as columns.",
        },
      },
      {
        id: "maq39-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-why-recurring",
        prompt:
          "Without dividing, how can you tell that 1/40 gives a decimal that stops while 1/12 does not?",
        options: [
          { id: "a", text: "You cannot tell without dividing" },
          {
            id: "b",
            text: "Factorise the bottoms: 40 is 2 × 2 × 2 × 5, built only from 2s and 5s, while 12 contains a 3",
          },
          { id: "c", text: "Because 40 is larger than 12" },
          { id: "d", text: "Because 40 is even and 12 is not" },
        ],
        correct: "b",
        explanation:
          "Ten is 2 × 5, so tenths, hundredths and thousandths can only be cut into halves and fifths. A denominator built from nothing but 2s and 5s fits; a 3 or a 7 never will. This is Month 2 prime factorisation answering a Month 3 question.",
        whyWrong: {
          a: "You can tell in a few seconds, which is the whole value of this atom. Factorise the bottom and look at the primes.",
          c: "Size is irrelevant. 1/3 has a small bottom and runs on forever, while 1/64 has a larger one and stops.",
          d: "Both are even. 12 is 2 × 2 × 3, and it is the 3 that causes the recurrence, not the evenness.",
        },
      },
      {
        id: "maq39-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-three-forms",
        prompt: "Which row is correct?",
        options: [
          { id: "a", text: "1/8 = 0.18 = 18%" },
          { id: "b", text: "1/8 = 0.125 = 12.5%" },
          { id: "c", text: "1/8 = 0.8 = 80%" },
          { id: "d", text: "1/8 = 1.8 = 180%" },
        ],
        correct: "b",
        explanation:
          "1 ÷ 8 = 0.125, and a percentage is hundredths, so 0.125 is 12.5 per cent. Sense check: an eighth is a small part of a whole, so the percentage must be well under 20.",
        whyWrong: {
          a: "This copies the digits either side of the bar into the decimal. 0.18 is closer to a fifth than an eighth.",
          c: "0.8 is four fifths. This has read the bottom of the fraction as the tenths digit.",
          d: "A fraction with a smaller top than bottom is under 1, so it cannot be more than 100 per cent.",
        },
      },
      {
        id: "maq39-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-which-form",
        prompt:
          "To work out 1/3 of 4.8 metres exactly, which form should you work in?",
        options: [
          { id: "a", text: "Convert 1/3 to 0.333 and multiply, giving 1.5984 m" },
          { id: "b", text: "Keep the fraction: 4.8 ÷ 3 = 1.6 m exactly" },
          { id: "c", text: "Convert 4.8 to a fraction first, then to a percentage" },
          { id: "d", text: "Either, since both give the same answer" },
        ],
        correct: "b",
        explanation:
          "A third has no exact decimal, so converting it first throws accuracy away before the calculation begins. Dividing by 3 keeps the answer exact, and 1.6 is the correct answer to every degree of accuracy.",
        whyWrong: {
          a: "1.5984 is wrong in the second decimal place, because 0.333 is not a third. This is rounding early, which the accuracy atom in Month 1 warned about.",
          c: "Converting to a percentage adds a step and answers nothing the question asked. The quantity wanted is a length.",
          d: "They do not give the same answer, which is the point. One is exact and the other has already lost accuracy.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l40-money": {
    lessonId: "ma-l40-money",
    passMark: 70,
    questions: [
      {
        id: "maq40-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-dc-naira-kobo",
        prompt: "How should a money answer of forty five naira and fifty kobo be written?",
        options: [
          { id: "a", text: "45.5" },
          { id: "b", text: "45.50" },
          { id: "c", text: "45.500" },
          { id: "d", text: "4550" },
        ],
        correct: "b",
        explanation:
          "Kobo are hundredths of a naira, so money takes exactly two decimal places. 45.50 states fifty kobo unambiguously, and mark schemes expect that form.",
        whyWrong: {
          a: "The value is right and the form is not. In a money context the second decimal place is expected, because the kobo is the smallest unit that exists.",
          c: "Three places suggests a unit smaller than a kobo, and there is no such thing.",
          d: "That is the amount in kobo rather than in naira, and without a unit stated it reads as four thousand five hundred and fifty naira.",
        },
      },
      {
        id: "maq40-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-dc-cost-change",
        prompt:
          "A woman buys 3 kg of rice at ₦1,450.00 per kg and pays with ₦5,000.00. What is her change?",
        options: [
          { id: "a", text: "₦3,550.00" },
          { id: "b", text: "₦650.00" },
          { id: "c", text: "₦4,350.00" },
          { id: "d", text: "₦1,450.00" },
        ],
        correct: "b",
        explanation:
          "Cost is 3 × 1,450.00 = 4,350.00, so change is 5,000.00 − 4,350.00 = 650.00. Check by adding back: 4,350 + 650 = 5,000, which verifies the subtraction completely.",
        whyWrong: {
          a: "This costs one bag of rice rather than three, so 5,000 − 1,450 has been worked out. Underlining each quantity in the question prevents it.",
          c: "That is the total cost, not the change. The question asked what she gets back.",
          d: "That is the unit price, which has been copied across rather than used.",
        },
      },
      {
        id: "maq40-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-rounding-money",
        prompt:
          "Three people share ₦4,000 equally. Why is it wrong to round each share to ₦1,333 and then multiply back?",
        options: [
          { id: "a", text: "It is not wrong, since money cannot have fractions of a kobo" },
          {
            id: "b",
            text: "Because rounding before multiplying multiplies the error too, losing a whole naira from a total that must still be 4,000",
          },
          { id: "c", text: "Because 4,000 does not divide by 3 at all" },
          { id: "d", text: "Because each share should be rounded up rather than down" },
        ],
        correct: "b",
        explanation:
          "Each share is 1,333.33 to the nearest kobo, and three of those is 3,999.99, so one kobo is left over and an honest answer says so. Rounding to 1,333 first loses 33 kobo three times, which is a whole naira, and the total no longer returns 4,000.",
        whyWrong: {
          a: "Money is rounded to the nearest kobo, which is two decimal places, not to the nearest naira. Rounding to whole naira discards real money.",
          c: "It divides perfectly well; the result simply does not terminate, because 3 is not built from 2s and 5s. That is the recurring decimal atom.",
          d: "The direction of the rounding is not the issue. The issue is rounding before the multiplication rather than after it.",
        },
      },
      {
        id: "maq40-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-dc-money-sense",
        prompt:
          "Which check completely verifies a change calculation rather than only making it look plausible?",
        options: [
          { id: "a", text: "Checking the answer has two decimal places" },
          { id: "b", text: "Adding the change to the total and seeing whether it returns the amount paid" },
          { id: "c", text: "Checking the change is less than what was handed over" },
          { id: "d", text: "Comparing the answer with an estimate" },
        ],
        correct: "b",
        explanation:
          "That addition either returns the amount handed over or it does not, so it is a verification rather than a plausibility test. It costs one addition and catches any slip in the subtraction.",
        whyWrong: {
          a: "A presentation check. It catches a dropped kobo in the writing and nothing about the arithmetic.",
          c: "A useful plausibility test that catches subtracting the wrong way round, and a wrong answer can still pass it.",
          d: "Estimating catches a factor of ten, which matters, and a change that is out by fifty naira would slip past it.",
        },
      },
      {
        id: "maq40-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-dc-review",
        prompt:
          "Why does this course keep mixing old topics into new drills rather than testing each module on its own?",
        options: [
          { id: "a", text: "To make the drills longer" },
          {
            id: "b",
            text: "Because a skill left alone fades, and because working out which method a question needs is itself a skill that only unlabelled questions train",
          },
          { id: "c", text: "Because the new topics are too short to fill a drill" },
          { id: "d", text: "Because revisiting a topic makes it feel easier" },
        ],
        correct: "b",
        explanation:
          "Percentages ahead can contain a fraction, a decimal, a division and a rounding instruction inside one question, and nothing in the wording says so. Mixed drills train the identification as well as the method.",
        whyWrong: {
          a: "Length is not the aim. A mixed drill of six questions trains more than a blocked drill of twenty.",
          c: "This module alone holds twenty atoms. There is no shortage of material to drill.",
          d: "It often feels harder rather than easier, and feeling easier is not the goal. What matters is what is still available in nine months.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
