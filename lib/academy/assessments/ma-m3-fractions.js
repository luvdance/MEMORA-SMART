/**
 * ASSESSMENTS · MATHEMATICS · MONTH 3 · MODULE 1 · FRACTIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Every wrong option in this bank is a real error with a name. 5/16 for
 * 3/8 + 2/8 is adding the denominators. 2/5 for 1/2 + 1/3 is the same error
 * without matching bottoms. 67.5 for two thirds of 45 is dividing by the top.
 * A distractor that nobody would ever choose teaches nothing, so the whyWrong
 * for each one names the misconception rather than restating the arithmetic.
 *
 * Division is tested twice on purpose: once on the mechanics of the flip, and
 * once on whether the answer should come out larger or smaller. Students can
 * pass the first while failing the second, and the second is the one that
 * shows whether they understand what dividing asks.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l33-what-is-a-fraction": {
    lessonId: "ma-l33-what-is-a-fraction",
    passMark: 70,
    questions: [
      {
        id: "maq33-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-fr-names",
        prompt: "In the fraction 3/5, what job is the 5 doing?",
        options: [
          { id: "a", text: "Counting how many pieces you have" },
          { id: "b", text: "Naming what kind of piece it is, namely fifths" },
          { id: "c", text: "Telling you the fraction is close to 5" },
          { id: "d", text: "Showing that 5 must be multiplied by 3" },
        ],
        correct: "b",
        explanation:
          "The denominator names the piece and the numerator counts them. The 5 says the whole was cut into fifths, and the 3 says you have three of them. That split is why fifths and sevenths cannot be added until one is rewritten.",
        whyWrong: {
          a: "That is the numerator's job. The 3 is the only number in this fraction that counts anything.",
          c: "The fraction is close to 1 rather than to 5. The bottom number is not a size, it is the name of the piece.",
          d: "Nothing is multiplied here. If it were, 3/5 would be 15, and 3/5 is less than 1.",
        },
      },
      {
        id: "maq33-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-on-the-line",
        prompt: "Where does 7/4 sit on the number line?",
        options: [
          { id: "a", text: "Between 0 and 1, because it is a fraction" },
          { id: "b", text: "Between 1 and 2, because four quarters already made 1 and there are three more" },
          { id: "c", text: "At 7, because the top number gives the position" },
          { id: "d", text: "Nowhere, because a fraction with a bigger top than bottom is not a real number" },
        ],
        correct: "b",
        explanation:
          "Four quarters make one whole, so seven quarters is one whole and three quarters more. It sits three quarters of the way from 1 to 2. Reading the top against the bottom tells you which side of 1 a fraction lies without any calculating.",
        whyWrong: {
          a: "Only fractions with a top smaller than the bottom are below 1. Here the top is larger, so it is past 1.",
          c: "The top number is a count of pieces, not a position. Seven quarters is nowhere near 7.",
          d: "It is an entirely ordinary number. It has a second spelling, 1 3/4, and both name the same point.",
        },
      },
      {
        id: "maq33-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-fr-as-division",
        prompt: "Why is 3 ÷ 4 the same thing as 3/4?",
        options: [
          { id: "a", text: "They are not the same. One is a calculation and the other is a fraction" },
          {
            id: "b",
            text: "Because sharing 3 whole things equally among 4 people gives each of them three quarters of one thing",
          },
          { id: "c", text: "Because 3 and 4 are next to each other" },
          { id: "d", text: "Because dividing always gives a fraction" },
        ],
        correct: "b",
        explanation:
          "The bar and the division sign are one instruction. Cut each of the 3 loaves into quarters, giving 12 quarters, and share them among 4 people: 3 quarters each. The division and the fraction describe the same event.",
        whyWrong: {
          a: "A fraction IS a division, written so it can be handled as a single quantity. That is what the bar was invented for.",
          c: "Nothing depends on the two numbers being consecutive. 5 ÷ 8 is 5/8 by the same argument.",
          d: "Dividing 12 by 4 gives 3, a whole number. The point is not that division makes fractions, it is that a fraction records a division.",
        },
      },
      {
        id: "maq33-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-equivalent",
        prompt:
          "Why does multiplying the top and bottom of a fraction by the same number leave its value unchanged?",
        options: [
          { id: "a", text: "Because the top and the bottom cancel each other out" },
          {
            id: "b",
            text: "Because it is the same as multiplying the whole fraction by something over itself, which is 1",
          },
          { id: "c", text: "Because the value does change, but only slightly" },
          { id: "d", text: "Because fractions have no fixed value" },
        ],
        correct: "b",
        explanation:
          "Going from 1/2 to 2/4 is multiplying by 2/2, and 2/2 is 1. Multiplying by 1 leaves a number alone, which is exactly what made 1 the identity element in Month 2. That is why the two fractions sit at the same point on the line.",
        whyWrong: {
          a: "Nothing cancels. Both numbers get larger, and the fraction stays put because the two changes are in proportion.",
          c: "It does not change at all. 1/2 and 50/100 are the same number, not two close numbers.",
          d: "Every fraction has one fixed position on the line. What varies is how many ways it can be spelled.",
        },
      },
      {
        id: "maq33-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-fr-lowest-terms",
        prompt: "What is 24/36 in its lowest terms, and how do you know it is finished?",
        options: [
          { id: "a", text: "12/18, because both were divided by 2" },
          { id: "b", text: "2/3, because both were divided by their HCF of 12 and 2 and 3 share no factor" },
          { id: "c", text: "6/9, because both were divided by 4" },
          { id: "d", text: "24/36 is already in its lowest terms" },
        ],
        correct: "b",
        explanation:
          "The HCF of 24 and 36 is 12, so one division by 12 finishes the job. It is finished because 2 and 3 have no common factor except 1, so there is nothing left to cancel.",
        whyWrong: {
          a: "Correct arithmetic and an unfinished answer. 12 and 18 still share 6, so more cancelling is available and a mark is still on the table.",
          c: "Also correct and also unfinished: 6 and 9 still share 3. Cancelling in small steps works and it takes several rounds.",
          d: "Both numbers are even, so 2 divides them both, and there is a great deal left to cancel.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l34-compare-add": {
    lessonId: "ma-l34-compare-add",
    passMark: 70,
    questions: [
      {
        id: "maq34-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-fr-same-bottom",
        prompt: "What is 3/8 + 2/8?",
        options: [
          { id: "a", text: "5/16" },
          { id: "b", text: "5/8" },
          { id: "c", text: "6/8" },
          { id: "d", text: "5/64" },
        ],
        correct: "b",
        explanation:
          "The pieces are already the same size, so you only count them: three eighths and two more eighths make five eighths. The bottom number names the piece and taking more pieces does not change their size.",
        whyWrong: {
          a: "This adds the bottoms as well. Check it against the picture: 5/16 is under a third, and putting together 3/8 and 2/8 fills more than half the bar.",
          c: "This has added 3 and 2 to get 6 somewhere along the way. Three plus two is five.",
          d: "This multiplies the bottoms. Nothing here is being multiplied, and 5/64 is a tiny sliver of a bar.",
        },
      },
      {
        id: "maq34-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-comparing",
        prompt: "Which is larger, 1/4 or 1/9?",
        options: [
          { id: "a", text: "1/9, because 9 is bigger than 4" },
          { id: "b", text: "1/4, because fewer cuts leaves each piece larger" },
          { id: "c", text: "They are equal, since both have 1 on top" },
          { id: "d", text: "It cannot be decided without a common denominator" },
        ],
        correct: "b",
        explanation:
          "The bottom counts the cuts. Sharing one thing among 4 people gives each a bigger portion than sharing it among 9. When the tops match, the bigger bottom is the smaller fraction.",
        whyWrong: {
          a: "This reads the digits instead of the quantity, which is the same error as calling −18 larger than −3 last month. A bigger bottom means smaller pieces.",
          c: "The tops matching means the pieces are counted the same way, and the pieces themselves are different sizes.",
          d: "A common denominator would work and is not needed. Matching tops is one of the two cases you can settle at a glance.",
        },
      },
      {
        id: "maq34-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-common-denominator",
        prompt: "What is 2/3 + 1/4?",
        options: [
          { id: "a", text: "3/7" },
          { id: "b", text: "11/12" },
          { id: "c", text: "3/12" },
          { id: "d", text: "8/12" },
        ],
        correct: "b",
        explanation:
          "The LCM of 3 and 4 is 12, so 2/3 becomes 8/12 and 1/4 becomes 3/12. Adding gives 11/12, and 11 and 12 share no factor, so it is finished.",
        whyWrong: {
          a: "This adds the tops together and the bottoms together. It also fails the sense check: 2/3 alone is bigger than 3/7, and adding something cannot make a number smaller.",
          c: "The two fractions were rewritten over 12 correctly and then the wrong pair of numbers was added. 3/12 is only the second fraction.",
          d: "8/12 is 2/3 rewritten. The 1/4 has been converted and then never added on.",
        },
      },
      {
        id: "maq34-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-mixed-improper",
        prompt: "Written as an improper fraction, 2 3/4 is:",
        options: [
          { id: "a", text: "5/4" },
          { id: "b", text: "11/4" },
          { id: "c", text: "6/4" },
          { id: "d", text: "9/4" },
        ],
        correct: "b",
        explanation:
          "Two wholes are 8 quarters, and 3 more quarters makes 11. As a shortcut, multiply the bottom by the whole number and add the top: 4 × 2 = 8, plus 3, over 4.",
        whyWrong: {
          a: "This adds the whole number to the top and forgets that each whole is four quarters, not one.",
          c: "This multiplies the whole by the bottom and then loses the 3, or multiplies 2 by 3 and keeps the bottom.",
          d: "This is one whole short. It counts only one of the two wholes as 4 quarters.",
        },
      },
      {
        id: "maq34-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fr-subtracting",
        prompt:
          "Working out 3 1/4 − 1 2/3, a student writes the fraction part as 3/12 − 8/12 = 5/12. What has gone wrong?",
        options: [
          { id: "a", text: "Nothing, and 5/12 is correct" },
          {
            id: "b",
            text: "The order was reversed to avoid a borrow, which changes the question. One whole should be broken into twelfths first",
          },
          { id: "c", text: "The common denominator should have been 7" },
          { id: "d", text: "Mixed numbers cannot be subtracted at all" },
        ],
        correct: "b",
        explanation:
          "3/12 is not enough to take 8/12 from, so a whole has to be broken down: 3 and 3/12 becomes 2 and 15/12. Then 15/12 − 8/12 = 7/12 and 2 − 1 = 1, giving 1 and 7/12. Swapping the two numbers instead is a different subtraction.",
        whyWrong: {
          a: "It is not correct. Subtracting in the wrong order at one step and the right order at another produces an answer that belongs to neither question.",
          c: "The LCM of 4 and 3 is 12, not 7. Adding the two bottoms is not how a common denominator is found.",
          d: "They can be, by this route or by turning both into improper fractions, 13/4 − 5/3, which also gives 1 7/12.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l35-multiply-divide-fractions": {
    lessonId: "ma-l35-multiply-divide-fractions",
    passMark: 70,
    questions: [
      {
        id: "maq35-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-fr-multiplying",
        prompt: "What is 2/3 × 3/4, in lowest terms?",
        options: [
          { id: "a", text: "1/2" },
          { id: "b", text: "6/12, which is the finished answer" },
          { id: "c", text: "5/7" },
          { id: "d", text: "8/9" },
        ],
        correct: "a",
        explanation:
          "Tops together gives 6, bottoms together gives 12, and 6/12 simplifies to 1/2. No common denominator is needed, because multiplying takes a part of a part rather than combining two quantities.",
        whyWrong: {
          b: "The arithmetic is right and the answer is not finished. 6 and 12 share a factor of 6, and the last mark is for spotting it.",
          c: "This adds tops and bottoms separately, which is neither multiplying nor adding correctly.",
          d: "This looks like a common denominator was found and the fractions then multiplied, or the numbers crossed. Multiplying needs no common bottom at all.",
        },
      },
      {
        id: "maq35-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-of-a-quantity",
        prompt: "What is 2/3 of 45?",
        options: [
          { id: "a", text: "30" },
          { id: "b", text: "67.5" },
          { id: "c", text: "90" },
          { id: "d", text: "15" },
        ],
        correct: "a",
        explanation:
          "Divide by the bottom and multiply by the top: 45 ÷ 3 = 15, then 15 × 2 = 30. Keeping to that order means the numbers stay small enough to do in your head.",
        whyWrong: {
          b: "This divides by the top and multiplies by the bottom. The sense check kills it on sight: two thirds of something must be less than the thing.",
          c: "This multiplies by 2 and never divides by 3. It is twice the whole amount rather than two thirds of it.",
          d: "This is one third of 45. The 2 on top says you want two of those thirds.",
        },
      },
      {
        id: "maq35-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-reciprocal",
        prompt: "What is the reciprocal of 2 1/2?",
        options: [
          { id: "a", text: "2/5" },
          { id: "b", text: "1/2 and 2" },
          { id: "c", text: "2 2/1" },
          { id: "d", text: "−2 1/2" },
        ],
        correct: "a",
        explanation:
          "Convert to an improper fraction first: 2 1/2 is 5/2. Turn it over to get 2/5. Checking, 5/2 × 2/5 = 10/10 = 1, which is what a reciprocal has to do.",
        whyWrong: {
          b: "This turns over the fraction part and leaves the whole number alone, which gives two separate numbers rather than one reciprocal.",
          c: "This flips the mixed number as written, which is not a number. A mixed number must be made improper before it is turned over.",
          d: "That is the additive inverse, which adds to give zero. A reciprocal multiplies to give 1, and changing the sign does not do that.",
        },
      },
      {
        id: "maq35-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fr-dividing",
        prompt:
          "A tailor has 6 metres of cloth and each shirt takes 3/4 of a metre. How many shirts, and which calculation gives it?",
        options: [
          { id: "a", text: "6 × 3/4 = 4.5, so 4 shirts" },
          { id: "b", text: "6 ÷ 3/4 = 6 × 4/3 = 8 shirts" },
          { id: "c", text: "6 ÷ 4/3 = 4.5 shirts" },
          { id: "d", text: "3/4 ÷ 6 = 1/8 of a shirt" },
        ],
        correct: "b",
        explanation:
          "The question asks how many three quarter metre lengths fit into 6 metres, which is a division. Dividing by 3/4 means multiplying by 4/3, giving 8. The sense check confirms it: each shirt needs less than a metre, so 6 metres must make more than 6 shirts.",
        whyWrong: {
          a: "Multiplying answers a different question, namely how much cloth three quarters of the roll would be. It also fails the sense check by giving fewer shirts than metres.",
          c: "The flip has been applied to the wrong fraction, or applied twice. Only the fraction you are dividing BY gets turned over.",
          d: "This divides the wrong way round. Division is not commutative, so the order of the two numbers is part of the question.",
        },
      },
      {
        id: "maq35-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fr-multiply-smaller",
        prompt:
          "A student says an answer must be wrong because multiplying made the number smaller. Are they right?",
        options: [
          { id: "a", text: "Yes. Multiplying always increases a number" },
          {
            id: "b",
            text: "No. Multiplying by anything less than 1 gives a smaller answer, which is what taking a part of something means",
          },
          { id: "c", text: "Yes, unless the numbers are negative" },
          { id: "d", text: "No, because multiplication has no effect on size at all" },
        ],
        correct: "b",
        explanation:
          "Multiplying by 3 gives three of them and multiplying by 1/2 gives half of one of them. The belief that multiplying grows a number comes from only ever multiplying by whole numbers above 1, and it quietly breaks here and stays broken through percentages and probability.",
        whyWrong: {
          a: "Multiplying by 1 changes nothing and multiplying by 1/2 halves. Both are multiplications and neither increases anything.",
          c: "Signs are a separate matter, and negatives are not needed to break the rule. 20 × 1/4 = 5 with no negative in sight.",
          d: "It has a large effect on size. The point is only that the effect depends on whether the multiplier is above or below 1.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l36-fractions-in-use": {
    lessonId: "ma-l36-fractions-in-use",
    passMark: 70,
    questions: [
      {
        id: "maq36-1",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fr-of-what",
        prompt:
          "A trader sells 1/2 of her stock in the morning and 1/3 of the remainder in the afternoon. What fraction of the original stock is left?",
        options: [
          { id: "a", text: "1/6, because 1/2 + 1/3 = 5/6 was sold" },
          { id: "b", text: "1/3" },
          { id: "c", text: "1/2" },
          { id: "d", text: "2/3" },
        ],
        correct: "b",
        explanation:
          "The afternoon fraction is of the remainder, not of the original. Half remained after the morning, and a third of that half is 1/6 of the original, so 1/2 + 1/6 = 2/3 was sold and 1/3 is left.",
        whyWrong: {
          a: "This takes both fractions of the original stock, which is exactly what the phrase 'of the remainder' rules out. It is the commonest wrong answer to this question type.",
          c: "This handles the morning and then ignores the afternoon sale entirely.",
          d: "2/3 is the fraction SOLD. The question asked what is left, which is the other third.",
        },
      },
      {
        id: "maq36-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fr-back-to-whole",
        prompt:
          "After spending 2/3 of her money, a woman has ₦1,500 left. How much did she start with?",
        options: [
          { id: "a", text: "₦2,250, since 1,500 is two thirds of it" },
          { id: "b", text: "₦4,500" },
          { id: "c", text: "₦1,000" },
          { id: "d", text: "₦3,000" },
        ],
        correct: "b",
        explanation:
          "She spent 2/3, so the ₦1,500 is the remaining 1/3. One third is 1,500, so three thirds is 4,500. Checking forwards, 2/3 of 4,500 is 3,000 spent and 1,500 left.",
        whyWrong: {
          a: "This treats the 1,500 as the two thirds that the question mentions. It is the other third, and reading which part the number belongs to is the whole task.",
          c: "This takes two thirds of 1,500, which answers no question that was asked and gives less than she still has.",
          d: "3,000 is the amount she SPENT. It is two thirds of the right answer rather than the whole.",
        },
      },
      {
        id: "maq36-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-bar-models",
        prompt:
          "A man spends 1/3 of his salary on rent and 1/4 on food. What fraction is left?",
        options: [
          { id: "a", text: "2/7" },
          { id: "b", text: "5/12" },
          { id: "c", text: "7/12" },
          { id: "d", text: "1/12" },
        ],
        correct: "b",
        explanation:
          "Over twelfths, rent is 4/12 and food is 3/12, so 7/12 is spent and 5/12 remains. Both fractions here are of the same whole, the salary, which is what makes them addable directly.",
        whyWrong: {
          a: "This adds tops and bottoms separately and then does not subtract from 1 either. Neither step is a fraction operation.",
          c: "7/12 is the fraction SPENT. The question asked what is left, so it has to be taken from 1.",
          d: "This looks like the two fractions were subtracted from each other rather than both taken away from the whole.",
        },
      },
      {
        id: "maq36-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-fr-errors",
        prompt:
          "Which of these four wrong answers comes from treating the denominator as a quantity rather than a name?",
        options: [
          { id: "a", text: "24/36 left unsimplified" },
          { id: "b", text: "1/2 + 1/3 = 2/5" },
          { id: "c", text: "2/3 ÷ 4/5 written as 3/2 × 4/5" },
          { id: "d", text: "2/3 of 45 given as 67.5" },
        ],
        correct: "b",
        explanation:
          "Adding the bottoms treats them as amounts that can be combined. They are names: halves and thirds are different kinds of piece, so they must be rewritten as the same kind before anything is counted.",
        whyWrong: {
          a: "That is a failure to simplify at the end. The fraction is correct and unfinished, and nothing has been misunderstood about the denominator.",
          c: "That is flipping the wrong fraction. Only the divisor is turned over, and the error is about division rather than about what the bottom means.",
          d: "That is dividing by the top and multiplying by the bottom, an error about the order of two operations rather than about the meaning of the denominator.",
        },
      },
      {
        id: "maq36-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-fr-sense-checks",
        prompt:
          "Which single check catches the largest share of fraction errors before an answer is written down?",
        options: [
          { id: "a", text: "Recopying the working neatly" },
          {
            id: "b",
            text: "Asking whether the answer should be bigger or smaller than what you started with, and whether it is",
          },
          { id: "c", text: "Checking the answer is written as a fraction rather than a decimal" },
          { id: "d", text: "Counting the number of steps in the working" },
        ],
        correct: "b",
        explanation:
          "That one question catches multiplying where you should divide, flipping the wrong fraction, and taking a fraction of the wrong whole. It costs a second and needs no arithmetic, which is exactly what makes it a check people actually carry out.",
        whyWrong: {
          a: "Neat working is easier to mark and easier to check, and copying it out again reproduces any error it already contained.",
          c: "The form of the answer matters for marks and it catches nothing, since a wrong fraction and a right fraction look equally respectable.",
          d: "The number of steps says nothing about whether any of them was correct. A short wrong method stays wrong.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
