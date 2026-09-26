/**
 * ASSESSMENTS · MATHEMATICS · MONTH 3 · MODULE 3 · PERCENTAGES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Almost every wrong option in this bank is a correct calculation on the wrong
 * base, which is what makes these questions worth asking. A distractor that
 * comes from bad arithmetic teaches nothing. A distractor that comes from
 * dividing by the selling price instead of the cost price is the error the
 * candidate is actually going to make, so each whyWrong names the base that
 * was used and the one that should have been.
 *
 * The reverse percentage question and the rise-then-fall question are both here
 * because they are where marks are won and lost at this level, and because a
 * candidate can pass every single stage question while failing both.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l41-what-is-a-percentage": {
    lessonId: "ma-l41-what-is-a-percentage",
    passMark: 70,
    questions: [
      {
        id: "maq41-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pc-meaning",
        prompt: "What does 35% mean?",
        options: [
          { id: "a", text: "35 out of 10" },
          { id: "b", text: "35 out of 100, which is 0.35" },
          { id: "c", text: "35 out of 1,000" },
          { id: "d", text: "The number 35 with a symbol after it" },
        ],
        correct: "b",
        explanation:
          "Per cent means per hundred, so 35 per cent is 35/100, which is 0.35. That is the whole definition, and every method in this module is that sentence applied carefully.",
        whyWrong: {
          a: "That would be 350 per cent. Ten is the base for tenths, and a percentage is always hundredths.",
          c: "That is 3.5 per cent. A thousand is the base for thousandths.",
          d: "The symbol carries meaning: it says the number is a count of hundredths. Putting 35 into a calculation instead of 0.35 gives an answer a hundred times too big.",
        },
      },
      {
        id: "maq41-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-of-a-quantity",
        prompt: "What is 18% of 250?",
        options: [
          { id: "a", text: "45" },
          { id: "b", text: "4,500" },
          { id: "c", text: "13.9" },
          { id: "d", text: "268" },
        ],
        correct: "a",
        explanation:
          "0.18 × 250 = 45. Building it in your head: 10 per cent is 25, 8 per cent is 20, and 25 + 20 = 45. The sense check is that 18 per cent is under a fifth, so the answer must be under 50.",
        whyWrong: {
          b: "This multiplies by 18 rather than 0.18. A percentage under 100 cannot give an answer larger than the quantity you started with.",
          c: "This divides 250 by 18. The word of is an instruction to multiply.",
          d: "This adds 18 to 250, which would answer a question about increasing by 18 units rather than taking 18 per cent.",
        },
      },
      {
        id: "maq41-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-three-forms",
        prompt: "What is 5/8 as a percentage?",
        options: [
          { id: "a", text: "58%" },
          { id: "b", text: "62.5%" },
          { id: "c", text: "1.6%" },
          { id: "d", text: "0.625%" },
        ],
        correct: "b",
        explanation:
          "5 ÷ 8 = 0.625, and multiplying by 100 gives 62.5 per cent. Sense check: five eighths is a bit over a half, so the percentage must be a bit over 50.",
        whyWrong: {
          a: "This copies the digits either side of the bar. Five eighths and 58 per cent are close by accident, which makes this a dangerous habit rather than a harmless one.",
          c: "This divides 8 by 5 and stops. 1.6 is larger than 1, and five eighths is less than a whole.",
          d: "This is the decimal with a per cent sign added rather than instead of. 0.625 IS the decimal; the percentage is a hundred times it.",
        },
      },
      {
        id: "maq41-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pc-benchmarks",
        prompt:
          "What is the fastest mental route to 15% of 4,800?",
        options: [
          { id: "a", text: "Multiply 4,800 by 15 and divide by 100 on paper" },
          {
            id: "b",
            text: "Ten per cent is 480, half of that is 240, so 15 per cent is 720",
          },
          { id: "c", text: "Divide 4,800 by 15, giving 320" },
          { id: "d", text: "Take 15 away from 4,800" },
        ],
        correct: "b",
        explanation:
          "Ten per cent is one column to the right, and five per cent is half of ten per cent. Building percentages from ten per cent is the single most useful habit in commercial arithmetic, and it needs no written working.",
        whyWrong: {
          a: "It gives the right answer and it is written work where none is needed, which costs time across forty questions.",
          c: "Dividing by 15 answers nothing that was asked. Fifteen per cent means fifteen hundredths, not one fifteenth.",
          d: "Subtracting treats the 15 as a quantity rather than as a count of hundredths.",
        },
      },
      {
        id: "maq41-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-pc-over-100",
        prompt:
          "A price rises from ₦200 to ₦500. Which statement is correct?",
        options: [
          { id: "a", text: "The new price is 250% of the old, and the rise is 150%" },
          { id: "b", text: "The rise is 300%, since the price went up by 300 naira" },
          { id: "c", text: "The rise is 60%, since 200 is 40% of 500" },
          { id: "d", text: "A rise cannot exceed 100%" },
        ],
        correct: "a",
        explanation:
          "500 is 250 per cent of 200, and the rise of 300 over the original 200 is 150 per cent. Both figures are above 100 and both are correct, because a percentage OF something can exceed the whole.",
        whyWrong: {
          b: "The rise in naira is 300 and the rise as a percentage is 300/200, which is 150 per cent. Reading the money figure as the percentage is the error.",
          c: "This uses 500 as the base. A percentage increase is always measured against the original amount, which is 200.",
          d: "It can and often does. Anything that more than doubles has risen by more than 100 per cent.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l42-one-as-a-percentage": {
    lessonId: "ma-l42-one-as-a-percentage",
    passMark: 70,
    questions: [
      {
        id: "maq42-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pc-as-a-percentage",
        prompt: "18 students out of 40 passed. What percentage passed?",
        options: [
          { id: "a", text: "45%" },
          { id: "b", text: "22%" },
          { id: "c", text: "222%" },
          { id: "d", text: "18%" },
        ],
        correct: "a",
        explanation:
          "The whole class is what the part is being compared to, so 40 goes on the bottom: 18/40 × 100 = 45 per cent. Sense check: 18 is a bit under half of 40, and 45 is a bit under half of 100.",
        whyWrong: {
          b: "This is the number who failed, 22, quoted as though it were a percentage. It is 22 students out of 40, which is 55 per cent.",
          c: "This puts the numbers the other way round, 40/18, which answers what percentage 40 is of 18.",
          d: "This copies the 18 straight across. A percentage needs the comparison to the whole, which here is 40.",
        },
      },
      {
        id: "maq42-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-increase-decrease",
        prompt: "A price rises from ₦200 to ₦250. What is the percentage increase?",
        options: [
          { id: "a", text: "20%, because 50 out of 250 is a fifth" },
          { id: "b", text: "25%, because the change of 50 is compared to the original 200" },
          { id: "c", text: "50%, because the price rose by 50" },
          { id: "d", text: "125%" },
        ],
        correct: "b",
        explanation:
          "A percentage change is always measured against the original amount, so 50/200 × 100 = 25 per cent. The original is the thing being compared to, so it goes on the bottom.",
        whyWrong: {
          a: "This divides by the new price. It is a correct calculation of a different quantity, and it is the commonest error in the topic.",
          c: "The change in naira is 50 and the change as a percentage is 50/200. Reading the money figure as the percentage skips the comparison entirely.",
          d: "125 per cent is what the NEW price is as a percentage of the old. The increase is that minus the original 100 per cent.",
        },
      },
      {
        id: "maq42-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-not-reversible",
        prompt:
          "A price of ₦100 rises by 20% and then falls by 20%. What is it now?",
        options: [
          { id: "a", text: "₦100, since the two changes cancel" },
          { id: "b", text: "₦96" },
          { id: "c", text: "₦104" },
          { id: "d", text: "₦80" },
        ],
        correct: "b",
        explanation:
          "The rise gives 120. The fall of 20 per cent is then of 120, which is 24, not 20, so the price lands at 96. As multipliers, 100 × 1.2 × 0.8 = 96, an overall fall of 4 per cent.",
        whyWrong: {
          a: "This adds and subtracts the percentages. They are percentages of different amounts, so they cannot be combined that way. Multipliers can be multiplied; percentages cannot be added.",
          c: "This is the right instinct that something does not cancel, applied in the wrong direction. The second change is a fall of a larger amount, so the result is below 100.",
          d: "This applies only the fall, or takes 20 per cent off the original once. The rise happened too.",
        },
      },
      {
        id: "maq42-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-reverse",
        prompt:
          "After a 20% discount, a price is ₦4,800. What was the original price?",
        options: [
          { id: "a", text: "₦5,760, by adding 20% to 4,800" },
          { id: "b", text: "₦6,000" },
          { id: "c", text: "₦3,840" },
          { id: "d", text: "₦4,800, since the discount is already included" },
        ],
        correct: "b",
        explanation:
          "The 4,800 is 80 per cent of the original. One per cent is 4,800 ÷ 80 = 60, so 100 per cent is 6,000. Or divide by the multiplier: 4,800 ÷ 0.8 = 6,000. Checking forwards, 20 per cent of 6,000 is 1,200 and 6,000 − 1,200 = 4,800.",
        whyWrong: {
          a: "The 20 per cent was of the original, not of the discounted price, so adding it back to 4,800 uses the wrong base. Checking forwards exposes it: 20 per cent off 5,760 is 4,608, not 4,800.",
          c: "This takes another 20 per cent off, applying the discount a second time instead of undoing it.",
          d: "The question asks for the price before the discount, which must be larger than the price after it.",
        },
      },
      {
        id: "maq42-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-multipliers",
        prompt:
          "A salary of ₦180,000 rises 12% one year and 5% the next. What is the overall percentage rise?",
        options: [
          { id: "a", text: "17%" },
          { id: "b", text: "17.6%" },
          { id: "c", text: "60%" },
          { id: "d", text: "8.5%" },
        ],
        correct: "b",
        explanation:
          "Multiply the multipliers: 1.12 × 1.05 = 1.176, which is a 17.6 per cent rise. The extra 0.6 per cent is the second year's rise applied to the first year's rise.",
        whyWrong: {
          a: "This adds the two percentages. It is close, which is what makes it dangerous, and it is wrong for the same reason a rise and a fall do not cancel.",
          c: "This multiplies 12 by 5. Multipliers are multiplied; the percentages themselves are not.",
          d: "This averages the two rises. An average would be relevant to a question about the mean annual rise, not to the total change.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l43-profit-loss-interest": {
    lessonId: "ma-l43-profit-loss-interest",
    passMark: 70,
    questions: [
      {
        id: "maq43-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pc-cost-selling",
        prompt:
          "A trader buys a bag for ₦2,500 and sells it for ₦3,000. What is the percentage profit?",
        options: [
          { id: "a", text: "16.7%" },
          { id: "b", text: "20%" },
          { id: "c", text: "500%" },
          { id: "d", text: "120%" },
        ],
        correct: "b",
        explanation:
          "Profit is 500, and percentage profit is always on the cost price: 500/2,500 × 100 = 20 per cent. That base is a convention of commerce, because it measures the return against the money put at risk.",
        whyWrong: {
          a: "This divides by the selling price, 500/3,000. It is the commonest error in the topic and it always understates a profit, because the selling price is the larger number.",
          c: "This is the profit in naira with a per cent sign attached. A percentage needs the comparison to the cost.",
          d: "120 per cent is the selling price as a percentage of the cost. The profit is that minus the original 100 per cent.",
        },
      },
      {
        id: "maq43-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-discount",
        prompt:
          "A trader buys for ₦8,000, marks the item at ₦12,000, and sells at a 15% discount. What is the percentage profit?",
        options: [
          { id: "a", text: "15%" },
          { id: "b", text: "27.5%" },
          { id: "c", text: "50%" },
          { id: "d", text: "21.6%" },
        ],
        correct: "b",
        explanation:
          "Two different bases in one question. The discount is of the marked price, so the selling price is 12,000 × 0.85 = 10,200. The profit is 10,200 − 8,000 = 2,200, and percentage profit is of the cost: 2,200/8,000 × 100 = 27.5 per cent.",
        whyWrong: {
          a: "This quotes the discount as though it were the profit. They are percentages of different prices and describe different things.",
          c: "50 per cent is the mark up from 8,000 to 12,000, before the discount was applied. The item did not sell at the marked price.",
          d: "This divides the profit by the marked price or the selling price instead of the cost. Writing cost, marked and selling as three labelled lines prevents it.",
        },
      },
      {
        id: "maq43-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-simple-interest",
        prompt:
          "₦50,000 is invested at 8% simple interest per year for 3 years. How much interest is earned?",
        options: [
          { id: "a", text: "₦4,000" },
          { id: "b", text: "₦12,000" },
          { id: "c", text: "₦62,000" },
          { id: "d", text: "₦12,972" },
        ],
        correct: "b",
        explanation:
          "Simple interest is on the original amount every year: 8 per cent of 50,000 is 4,000, and three years gives 12,000. As a formula, P × R × T = 50,000 × 0.08 × 3.",
        whyWrong: {
          a: "That is one year's interest. The question asks for three years.",
          c: "That is the total amount owed, principal plus interest. The question asked for the interest alone, and the two are one line apart.",
          d: "That is compound interest, where each year's interest is of the new total. Simple interest stays on the original, and compound interest arrives in Month 5.",
        },
      },
      {
        id: "maq43-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-percentage-error",
        prompt:
          "A length is measured as 48 cm when the true length is 50 cm. What is the percentage error?",
        options: [
          { id: "a", text: "4%" },
          { id: "b", text: "4.17%" },
          { id: "c", text: "2%" },
          { id: "d", text: "96%" },
        ],
        correct: "a",
        explanation:
          "The error is 2 cm, and it is compared to the true value: 2/50 × 100 = 4 per cent. The true value is the standard being compared to, so it goes on the bottom.",
        whyWrong: {
          b: "This divides by the measured value, 2/48. The true value is what the measurement should have been, so it is the base.",
          c: "That is the error in centimetres quoted as a percentage. The comparison to the true length has been skipped.",
          d: "That is the measurement as a percentage of the true value, which answers a different question. The error is the remaining 4 per cent.",
        },
      },
      {
        id: "maq43-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-which-base",
        prompt:
          "Which pairing is wrong?",
        options: [
          { id: "a", text: "Percentage profit is of the cost price" },
          { id: "b", text: "A discount is of the cost price" },
          { id: "c", text: "Percentage increase is of the original amount" },
          { id: "d", text: "Simple interest is of the principal every year" },
        ],
        correct: "b",
        explanation:
          "A discount is taken off the price on the label, which is the marked price, and the customer never sees the cost price. Matching each percentage to its own base is the whole task in this lesson.",
        whyWrong: {
          a: "Correct. Profit is measured against the money the trader laid out, which is the cost.",
          c: "Correct. An increase is growth from a starting point, and the starting point is the base.",
          d: "Correct, and it is what makes the interest simple. Compound interest is of the running total instead.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l44-percentages-in-use": {
    lessonId: "ma-l44-percentages-in-use",
    passMark: 70,
    questions: [
      {
        id: "maq44-1",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-percentage-points",
        prompt:
          "An interest rate moves from 4% to 6%. Which description is correct?",
        options: [
          { id: "a", text: "A rise of 2%" },
          { id: "b", text: "A rise of 2 percentage points, which is also a 50% rise in the rate" },
          { id: "c", text: "A rise of 6%" },
          { id: "d", text: "A rise of 200%" },
        ],
        correct: "b",
        explanation:
          "Both descriptions are true and they are different numbers. The gap is 2 percentage points, and as a change in the rate it is 2/4 × 100 = 50 per cent. Which one is quoted changes the impression entirely, which is why the distinction matters outside an exam as much as in one.",
        whyWrong: {
          a: "A rise of 2 per cent OF the rate would take 4 per cent to 4.08 per cent. The 2 here is a gap in points, not a percentage change.",
          c: "6 per cent is where the rate ended, not how much it moved.",
          d: "200 per cent would be a tripling. The rate went up by half, not by two whole multiples.",
        },
      },
      {
        id: "maq44-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-of-what",
        prompt:
          "A shop raises all prices by 80% one week, then advertises 'everything half price'. What does a customer pay relative to the original?",
        options: [
          { id: "a", text: "Half the original price" },
          { id: "b", text: "90% of the original price, so a genuine saving of 10%" },
          { id: "c", text: "130% of the original price" },
          { id: "d", text: "40% of the original price" },
        ],
        correct: "b",
        explanation:
          "Multiply the multipliers: 1.8 × 0.5 = 0.9. The customer pays 90 per cent of the original, a real saving of 10 per cent rather than the 50 per cent the sign suggests. The half price is of the raised price, not of the original.",
        whyWrong: {
          a: "The halving is of the marked up price. The sign is true and the base is not the one the customer has in mind.",
          c: "This subtracts 50 from 180 rather than halving 180. Half of 180 per cent is 90 per cent.",
          d: "This looks like 80 per cent halved. The 80 per cent was an increase, so the price after it was 180 per cent of the original, not 80.",
        },
      },
      {
        id: "maq44-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pc-common-errors",
        prompt:
          "Express 250 grams as a percentage of 2 kilograms.",
        options: [
          { id: "a", text: "12,500%" },
          { id: "b", text: "12.5%" },
          { id: "c", text: "125%" },
          { id: "d", text: "8%" },
        ],
        correct: "b",
        explanation:
          "Convert to the same unit first: 2 kg is 2,000 g. Then 250/2,000 × 100 = 12.5 per cent. Comparing 250 with 2 without converting is the error this question exists to catch.",
        whyWrong: {
          a: "This compares 250 with 2 directly, ignoring the units. A quarter of a kilogram cannot be over a hundred times two kilograms.",
          c: "This has converted one quantity and not the other, or slipped a factor of ten.",
          d: "This divides 2,000 by 250 and then misreads the result. The part goes on top and the whole goes underneath.",
        },
      },
      {
        id: "maq44-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-pc-estimating",
        prompt:
          "A candidate calculates a 20% profit on a cost of ₦8,000 and gets ₦9,600 as the profit. Which check exposes the error fastest?",
        options: [
          { id: "a", text: "Recalculating 8,000 × 0.2 digit by digit" },
          {
            id: "b",
            text: "Noticing that a 20% profit must be well under the cost price, so a profit of 9,600 is impossible",
          },
          { id: "c", text: "Checking the answer has two decimal places" },
          { id: "d", text: "Nothing catches it without knowing the selling price" },
        ],
        correct: "b",
        explanation:
          "The estimate catches a wrong base instantly. 9,600 is the SELLING price after a 20 per cent profit, and the profit itself is 1,600. A percentage under 100 cannot produce a part larger than the whole it came from.",
        whyWrong: {
          a: "8,000 × 0.2 = 1,600, so a digit check finds nothing wrong with the arithmetic that was actually done. The error was in which quantity was being calculated.",
          c: "A presentation check. It says nothing about whether the right quantity was found.",
          d: "The cost price alone is enough. Twenty per cent of it must be a fifth of it, which is far less than all of it.",
        },
      },
      {
        id: "maq44-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pc-review",
        prompt:
          "Why is a percentage on its own not enough information to act on?",
        options: [
          { id: "a", text: "Because percentages are less accurate than fractions" },
          {
            id: "b",
            text: "Because a percentage is always of something, and without knowing what, the same figure can describe very different quantities",
          },
          { id: "c", text: "Because percentages cannot exceed 100" },
          { id: "d", text: "Because a percentage must always be converted to a decimal first" },
        ],
        correct: "b",
        explanation:
          "Crime up 100 per cent describes a rise from one case to two and a rise from five hundred to a thousand equally well. The percentage tells you the proportion and hides the size, so the base has to be named before the figure means anything.",
        whyWrong: {
          a: "A percentage is exactly as accurate as the fraction it came from. 50 per cent and a half are the same number.",
          c: "They can exceed 100 freely, and that is not what makes a bare percentage uninformative.",
          d: "Converting is a step in calculating with one. It does nothing about the missing base.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
