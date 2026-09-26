/**
 * MATHEMATICS · MONTH 3 · MODULE 3 · PERCENTAGES
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Per cent means per hundred. Everything in this module is that one sentence
 * applied carefully, and a student who holds on to it never has to memorise a
 * formula for any of it.
 *
 * Three things here are worth more than the rest put together.
 *
 * The first is that a percentage is always a percentage OF something, and in a
 * multi stage question that something changes. A 20 per cent rise followed by a
 * 20 per cent fall does not return you to where you started, and understanding
 * why is worth more than any amount of practice at single step questions.
 *
 * The second is reverse percentages, where a price after a discount is given
 * and the original is wanted. Candidates lose these by taking the percentage of
 * the wrong number, and the cure is the bar model from the fraction module.
 *
 * The third is that profit and loss are always calculated on the COST price
 * unless a question says otherwise, which is a convention of commerce rather
 * than a fact of arithmetic, and has to be told rather than derived.
 */

export const SECTION_ID = "ma-s3-percentages";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l41-what-is-a-percentage",
    moduleId: "ma-m3-percentages",
    sectionId: SECTION_ID,
    order: 1,
    title: "Per Cent Means Per Hundred",
    subtitle: "One sentence, and the three notations it connects",
    estimatedMinutes: 14,
    intro:
      "There is only one idea in this module and this lesson contains all of it. A percentage is a number of hundredths. Fifty per cent is fifty hundredths, which is a half, which is 0.5. Everything else in the next four lessons is that sentence used carefully.",

    atoms: [
      {
        id: "a-ma-pc-meaning",
        title: "A percentage is a fraction with 100 on the bottom",
        explain:
          "Per cent means per hundred, so 35 per cent means 35/100. That is the entire definition. It is a fraction whose denominator has been fixed at 100 so that any two percentages can be compared at a glance.",
        origin:
          "The word is Latin, per centum, by the hundred, and the Romans were already reckoning in hundredths for tax: they levied a duty called the centesima rerum venalium, a hundredth part of the value of goods sold at auction, which is a one per cent sales tax under another name. The notation arrived much later. Italian merchants in the 1400s wrote out per cento, clerks abbreviated it in ledgers, and after a few centuries of hurried handwriting the abbreviation collapsed into the % sign. So the reason percentages are hundredths rather than some other number is not mathematical: a hundred was a comfortable base for merchants and tax collectors to reckon in, and the notation followed the habit.",
        why: "Fixing the denominator is what makes percentages useful. Comparing 17/25 with 33/50 needs work, and comparing 68 per cent with 66 per cent does not. That is the only advantage a percentage has over a fraction, and it is a large one.",
        example:
          "    35%  =  35/100  =  0.35\n     7%  =   7/100  =  0.07\n    50%  =  50/100  =  1/2  =  0.5\n   100%  = 100/100  =  1, the whole thing\n   150%  = 150/100  =  1.5, one and a half times it\n\n  The pattern for converting:\n\n    PERCENTAGE to DECIMAL:  divide by 100\n                            35% -> 0.35\n\n    DECIMAL to PERCENTAGE:  multiply by 100\n                            0.35 -> 35%\n\n  Both are the Month 1 rule about moving two columns,\n  because 100 has two zeros.",
        mistake:
          "Writing 35 per cent as 3.5 or as 35 in a calculation. As a number it is 0.35, and putting 35 into a multiplication gives an answer a hundred times too large.",
      },
      {
        id: "a-ma-pc-over-100",
        title: "Percentages above 100, and below 1",
        explain:
          "Nothing stops a percentage being more than 100. It means more than the whole of whatever it refers to. And nothing stops one being less than 1, such as 0.5 per cent, which is half of one hundredth.",
        why: "Students often believe 100 per cent is a ceiling, which makes growth questions and interest questions confusing. A population that has grown to 250 per cent of what it was has two and a half times as many people, and there is nothing odd about that.",
        table: {
          caption: "Reading percentages across the whole range.",
          headers: ["Percentage", "As a decimal", "Means"],
          rows: [
            ["0.5%", "0.005", "Half of one hundredth, a very small part"],
            ["5%", "0.05", "One twentieth"],
            ["100%", "1", "All of it, unchanged"],
            ["150%", "1.5", "One and a half times as much"],
            ["250%", "2.5", "Two and a half times as much"],
          ],
          note: "A percentage OF something can pass 100. A percentage that describes a part of a single whole, such as the share of a class that passed, cannot, and an answer above 100 in that kind of question is a signal that something has gone wrong.",
        },
        mistake:
          "Capping an answer at 100 per cent because it feels wrong to go higher. If a price rose from 200 naira to 500 naira, the new price is 250 per cent of the old one and the rise is 150 per cent. Both figures are correct and both are above 100.",
      },
      {
        id: "a-ma-pc-three-forms",
        title: "Converting between all three forms",
        explain:
          "A fraction, a decimal and a percentage are one number in three notations. To reach a percentage from a fraction, either make the bottom 100 or divide and then multiply by 100. To go back, write the percentage over 100 and simplify.",
        why: "Commercial arithmetic switches between the three forms constantly, and the switching is where the time goes in an exam. Knowing the common conversions by sight, and being able to derive any other, is worth more than speed at any one of them.",
        example:
          "  FRACTION to PERCENTAGE, two routes:\n\n    3/4:  make the bottom 100\n          3/4 = 75/100 = 75%\n\n    5/8:  the bottom will not reach 100 tidily,\n          so divide and multiply\n          5 / 8 = 0.625,  x 100 = 62.5%\n\n  PERCENTAGE to FRACTION:\n\n    24% = 24/100 = 6/25   (divide both by 4)\n\n  PERCENTAGE to DECIMAL:   divide by 100\n    24% = 0.24\n\n  DECIMAL to PERCENTAGE:   multiply by 100\n    0.024 = 2.4%\n\n  Note the last one. 0.024 is 2.4 per cent, not 24.\n  Count the columns rather than the digits.",
        drill: {
          skill: "L0-N5.4",
          count: 3,
          intro:
            "Three conversions between fractions and decimals, which is the step every percentage conversion runs through.",
        },
      },
      {
        id: "a-ma-pc-benchmarks",
        title: "The percentages worth knowing on sight",
        explain:
          "A small number of percentages are worth holding in memory as fractions, because they turn a calculation into a division you can do in your head. Ten per cent is a tenth, twenty five per cent is a quarter, and most others can be built from those two.",
        why: "This is the difference between answering a percentage question in ten seconds and in two minutes. Finding fifteen per cent as ten per cent plus half of it is faster and more reliable than multiplying by 0.15 by hand, and it is what people who are good at this actually do.",
        table: {
          caption: "Build anything from these.",
          headers: ["Percentage", "Fraction", "Quick method"],
          rows: [
            ["50%", "1/2", "Halve it"],
            ["25%", "1/4", "Halve it twice"],
            ["10%", "1/10", "Move one column right"],
            ["5%", "1/20", "Ten per cent, then halve"],
            ["20%", "1/5", "Ten per cent, then double"],
            ["15%", "3/20", "Ten per cent, plus half of that"],
            ["12.5%", "1/8", "Halve three times"],
            ["1%", "1/100", "Move two columns right"],
          ],
        },
        example:
          "  Find 15% of 4,800 naira.\n\n    10% of 4,800 = 480        (one column right)\n     5% is half of that = 240\n    15% = 480 + 240 = 720 naira\n\n  No written multiplication at all.\n\n\n  Find 35% of 260.\n\n    10% = 26\n    30% = 78         (three tens)\n     5% = 13         (half of ten per cent)\n    35% = 78 + 13 = 91\n\n  Building from ten per cent is the single most\n  useful habit in commercial arithmetic.",
      },
      {
        id: "a-ma-pc-of-a-quantity",
        title: "Finding a percentage of a quantity",
        explain:
          "A percentage of a quantity is a multiplication, exactly as a fraction of a quantity was. Turn the percentage into a fraction or a decimal, then multiply. The word of is still the instruction to multiply.",
        why: "This is the workhorse calculation of the module and everything commercial rests on it. It also carries the same sense check as fractions did: a percentage under 100 must give an answer smaller than what you started with.",
        example:
          "  Find 18% of 250.\n\n  ROUTE A, as a decimal:\n    0.18 x 250 = 45\n\n  ROUTE B, as a fraction:\n    18/100 x 250 = 18 x 250 / 100\n                 = 4500 / 100\n                 = 45\n\n  ROUTE C, building from ten per cent:\n    10% of 250 = 25\n     1% of 250 = 2.5\n     8% of 250 = 20\n    18% = 25 + 20 = 45\n\n  Three routes, one answer. Route C needs no\n  written working, which matters when there are\n  forty questions and no calculator.\n\n  Sense check: 18% is under a fifth, so the answer\n  should be under 50. It is.",
        mistake:
          "Multiplying by 18 instead of 0.18, giving 4,500. The sense check catches it immediately, because a percentage under 100 cannot produce an answer larger than the original quantity.",
        drill: {
          skill: "L0-N4.4",
          count: 3,
          intro:
            "Three questions on a part of a quantity. A percentage is a fraction with 100 on the bottom, so the method is the same one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l42-one-as-a-percentage",
    moduleId: "ma-m3-percentages",
    sectionId: SECTION_ID,
    order: 2,
    title: "Increase, Decrease and Percentage Of",
    subtitle: "Which number goes on the bottom, and why that is the whole question",
    estimatedMinutes: 16,
    intro:
      "Almost every percentage question that goes wrong goes wrong in the same place: the wrong number was used as the whole. This lesson is about identifying the whole before calculating anything, because once it is identified the arithmetic is Lesson 41.",

    atoms: [
      {
        id: "a-ma-pc-as-a-percentage",
        title: "Expressing one quantity as a percentage of another",
        explain:
          "Write the first quantity over the second as a fraction, then multiply by 100. The quantity you are comparing TO goes on the bottom, and identifying which one that is, is the whole difficulty.",
        why: "The wording tells you which is which, and it repays careful reading. As a percentage OF something means that something is the whole, so it goes underneath. Getting the two the wrong way round gives an answer that is often wildly wrong and occasionally plausible, which is worse.",
        example:
          "  18 students out of 40 passed. What percentage passed?\n\n    The whole class is the thing being compared to,\n    so 40 goes on the bottom.\n\n      18                1800\n      --  x  100   =    ----   =  45%\n      40                  40\n\n  Sense check: 18 is a bit under half of 40, and 45%\n  is a bit under half. Good.\n\n\n  THE SAME NUMBERS, THE OTHER WAY ROUND:\n\n  40 is what percentage of 18?\n\n      40\n      --  x  100  =  222.2%\n      18\n\n  Both calculations are correct and they answer\n  different questions. Read which quantity the\n  word OF attaches to.\n\n\n  A units warning:\n\n  Express 40 kobo as a percentage of 2 naira.\n\n    Convert first! 2 naira = 200 kobo\n\n      40\n      ---  x  100  =  20%\n      200\n\n  Comparing 40 with 2 gives 2000%, which is nonsense.\n  Both quantities must be in the same unit before\n  either goes into the fraction.",
        mistake:
          "Putting the two numbers in the order they appear in the sentence rather than the order the question means. Underline what the percentage is OF, and that number goes on the bottom, wherever it appeared in the text.",
      },
      {
        id: "a-ma-pc-increase-decrease",
        title: "Percentage increase and decrease",
        explain:
          "A percentage change is always measured against the ORIGINAL amount. Work out the actual change, write it over the original, and multiply by 100. The original goes on the bottom because the change is being compared to where it started.",
        why: "This is where the bottom of the fraction is most often wrong. A rise from 200 to 250 is a 25 per cent increase, because the change of 50 is compared to the 200 it started from. Comparing it to the 250 it ended at gives 20 per cent, which answers a different and usually unasked question.",
        example:
          "  A price rises from 200 naira to 250 naira.\n\n    Change:    250 - 200 = 50\n    Original:  200\n\n      50\n      ---  x  100  =  25%  increase\n      200\n\n  NOT 50/250, which gives 20% and compares the\n  change to where it finished.\n\n\n  A decrease, 80 kg down to 68 kg:\n\n    Change:    80 - 68 = 12\n    Original:  80\n\n      12\n      --  x  100  =  15%  decrease\n      80\n\n\n  THE SHORTCUT, worth knowing:\n\n  To increase by 15%, multiply by 1.15\n  To decrease by 15%, multiply by 0.85\n\n    200 x 1.15 = 230\n    200 x 0.85 = 170\n\n  WHY: increasing by 15% leaves you with 100% + 15%\n  = 115% of the original, and 115% is 1.15. Decreasing\n  leaves 85%, which is 0.85. One multiplication\n  instead of two steps.",
        mistake:
          "Dividing by the new amount instead of the original. The word increase means growth from a starting point, and the starting point is the thing being compared to, so it belongs on the bottom.",
      },
      {
        id: "a-ma-pc-not-reversible",
        title: "Why a 20% rise then a 20% fall does not return you",
        explain:
          "A percentage is always of something, and after the first change that something has changed. A 20 per cent rise on 100 gives 120, and a 20 per cent fall on 120 takes off 24 rather than 20, landing at 96.",
        why: "This is the most important idea in the module and the one most often missed. It explains why a shop can raise a price by 50 per cent and then advertise a 50 per cent discount without returning to the original price, and it is the reason multi stage percentage questions cannot be done by adding the percentages.",
        example:
          "  Start with 100.\n\n  Rise 20%:   20% of 100 = 20,  so 120\n  Fall 20%:   20% of 120 = 24,  so 96\n\n  Not 100. The second 20% was of a bigger number.\n\n  As multipliers, which is faster and clearer:\n\n    100 x 1.20 x 0.80 = 96\n\n  And 1.20 x 0.80 = 0.96, which is a 4% fall overall.\n\n\n  IT WORKS THE SAME WAY ROUND:\n\n    Fall 20% then rise 20%:\n    100 x 0.80 x 1.20 = 96\n\n  The same 96, because multiplication is commutative,\n  which is Month 2 showing up again.\n\n\n  THE SHOP VERSION:\n\n  A trader marks a 4,000 naira item up by 50%,\n  then offers 50% off.\n\n    4,000 x 1.5 = 6,000\n    6,000 x 0.5 = 3,000\n\n  The customer pays 3,000, which is genuinely less\n  than 4,000, so this is not a trick. But if the\n  trader had marked up 100% first:\n\n    4,000 x 2 = 8,000, then 50% off = 4,000\n\n  The customer pays exactly the original price and\n  believes they saved half.",
        mistake:
          "Adding and subtracting the percentages, so that up 20 then down 20 is thought to cancel. Percentages of different quantities cannot be added. Multipliers can be multiplied, and that is why the multiplier method is the reliable one.",
      },
      {
        id: "a-ma-pc-multipliers",
        title: "Multipliers, and why they are worth the effort",
        explain:
          "Any percentage change can be done in one multiplication. Add the percentage to 100, or take it from 100, and write the result as a decimal. An 8 per cent rise is a multiplier of 1.08, and a 3 per cent fall is 0.97.",
        why: "Multipliers make multi stage questions possible, make reverse percentages possible, and halve the working on single stage ones. They are also how the same problems are done in the world: a spreadsheet applying a discount multiplies by a multiplier.",
        table: {
          caption: "Change to multiplier, in both directions.",
          headers: ["Change", "Multiplier", "Because"],
          rows: [
            ["Increase by 8%", "1.08", "You end with 108% of what you had"],
            ["Increase by 50%", "1.5", "You end with 150%"],
            ["Increase by 100%", "2", "You end with 200%, which is double"],
            ["Decrease by 8%", "0.92", "You keep 92% of it"],
            ["Decrease by 25%", "0.75", "You keep three quarters"],
            ["Decrease by 100%", "0", "Nothing is left"],
          ],
          note: "Two changes in a row means multiplying the two multipliers. Three means multiplying three. That is the whole method, and it does not get harder as the number of stages grows.",
        },
        example:
          "  A salary of 180,000 rises 12%, then 5% the year after.\n\n    180,000 x 1.12 x 1.05 = 211,680\n\n  Overall multiplier: 1.12 x 1.05 = 1.176,\n  which is a 17.6% rise, NOT 17%.\n\n  The extra 0.6% is the second year's rise applied\n  to the first year's rise.",
      },
      {
        id: "a-ma-pc-reverse",
        title: "Reverse percentages: finding the original",
        explain:
          "When you are given the amount AFTER a change and asked for the amount before, divide by the multiplier. Do not take the percentage off the figure you were given, because that percentage was of the original, and the original is the number you do not yet have.",
        origin:
          "Reverse percentages are not an exam invention. They are what anybody does to pull a tax out of a price that already includes it. When a receipt shows a total with value added tax inside it, the tax is a percentage of the price before tax, so recovering either figure from the total means dividing by the multiplier rather than taking the percentage off the total. Nigeria's VAT was raised from 5 per cent to 7.5 per cent in 2020, and every business that had to restate its prices did this calculation. Doing it the wrong way, by taking the percentage off the gross figure, understates the pre tax price every time, which is why accountants are taught the division and not the subtraction.",
        why: "This is the question type that separates candidates, and it is lost by taking the percentage of the wrong number. The bar model from the fraction module is the cure: label what you have as the percentage it actually is, find 1 per cent, then build up to 100.",
        example:
          "  A price after a 20% discount is 4,800 naira.\n  What was the original price?\n\n  WRONG:  add 20% to 4,800\n          4,800 x 1.2 = 5,760\n          The 20% was of the ORIGINAL, not of 4,800.\n\n  RIGHT, with the bar:\n\n    Original = 100%\n    Discount =  20%\n    Paid     =  80%   <- the 4,800 is 80%\n\n     80% = 4,800\n      1% = 4,800 / 80 = 60\n    100% = 60 x 100 = 6,000 naira\n\n  Or in one step, dividing by the multiplier:\n\n    4,800 / 0.8 = 6,000\n\n  CHECK FORWARDS, always:\n    20% of 6,000 = 1,200\n    6,000 - 1,200 = 4,800.  Correct.\n\n\n  The same shape with an increase:\n\n  After a 15% rise a rent is 322,000 naira.\n  What was it before?\n\n    322,000 / 1.15 = 280,000\n\n  Check: 280,000 x 1.15 = 322,000. Correct.",
        mistake:
          "Applying the percentage to the figure you were given. The single most reliable defence is to check forwards: take your answer, apply the change described in the question, and see whether you land on the number the question gave you.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l43-profit-loss-interest",
    moduleId: "ma-m3-percentages",
    sectionId: SECTION_ID,
    order: 3,
    title: "Profit, Loss, Discount and Interest",
    subtitle: "The commercial arithmetic examiners keep flagging",
    estimatedMinutes: 16,
    intro:
      "This is the most practical lesson in the course so far, and it is also the one WAEC reports on most often. The mathematics is Lesson 42. What is new is the vocabulary of trade, and one convention you have to be told rather than work out: profit and loss are measured against the cost price.",

    atoms: [
      {
        id: "a-ma-pc-cost-selling",
        title: "Cost price, selling price, profit and loss",
        explain:
          "The cost price is what the trader paid. The selling price is what the customer paid. If selling is above cost there is a profit, and if it is below there is a loss. Percentage profit and percentage loss are always calculated on the COST price unless a question says otherwise.",
        origin:
          "That convention is a rule of commerce rather than a fact of arithmetic, and it has a practical reason behind it. A trader wants to know what a purchase earned relative to the money they had to put at risk, which is the cost, because that is the money that could have been spent on something else. Double entry bookkeeping, set out in print by Luca Pacioli in Venice in 1494, formalised the habit of measuring a return against the amount laid out, and accountants have measured it that way ever since. The reason this has to be stated rather than derived is that measuring profit against the selling price would also be a sensible thing to do, and it would give a different number. The convention settles which of two reasonable questions is being asked.",
        why: "Every question in this lesson depends on knowing which number goes on the bottom, and here the answer is fixed by convention: the cost price. A candidate who divides by the selling price does perfect arithmetic and gets no marks.",
        example:
          "  A trader buys a bag for 2,500 and sells it for 3,000.\n\n    Profit = 3,000 - 2,500 = 500\n\n    Percentage profit, on the COST:\n\n      500\n      -----  x  100  =  20%\n      2,500\n\n    NOT 500/3,000, which gives 16.7% and measures\n    the profit against the selling price.\n\n\n  A loss:\n\n  Bought for 8,000, sold for 6,800.\n\n    Loss = 8,000 - 6,800 = 1,200\n\n      1,200\n      -----  x  100  =  15%  loss\n      8,000\n\n\n  THE MULTIPLIER FORM:\n\n    Selling price = cost x (1 + profit as a decimal)\n    3,000 = 2,500 x 1.20\n\n  Which means a reverse question is a division:\n  if an item was sold at a 20% profit for 3,000,\n  the cost was 3,000 / 1.2 = 2,500.",
        mistake:
          "Dividing by the selling price. It is the commonest error in the topic and it always gives an answer that is too small for a profit, because the selling price is the larger number.",
      },
      {
        id: "a-ma-pc-discount",
        title: "Discount and marked price",
        explain:
          "The marked price is the price on the label. A discount is a percentage taken off the marked price, so the discount is calculated on the marked price and not on the cost. What the customer pays is the marked price multiplied by one minus the discount.",
        why: "Three prices can appear in one question: cost, marked and selling. Each percentage in the question is of a specific one of them, and matching each percentage to its own base is the whole task. A discount is of the marked price, and a profit is of the cost.",
        example:
          "  An item is marked at 12,000 naira with a 15% discount.\n\n    Discount = 15% of 12,000 = 1,800\n    Customer pays 12,000 - 1,800 = 10,200\n\n    Or in one step: 12,000 x 0.85 = 10,200\n\n\n  A THREE PRICE QUESTION, which is the exam form:\n\n  A trader buys for 8,000, marks it at 12,000, and\n  sells at a 15% discount. What is the percentage\n  profit?\n\n    Selling price = 12,000 x 0.85 = 10,200\n    Profit = 10,200 - 8,000 = 2,200\n\n    Percentage profit, on the COST:\n\n      2,200\n      -----  x  100  =  27.5%\n      8,000\n\n  Notice the two different bases in one question.\n  The discount was of 12,000. The profit was of\n  8,000. Using one base for both is the error the\n  question is built to catch.",
        mistake:
          "Taking the discount off the cost price, or calculating the profit on the marked price. Write the three prices down as three separate labelled lines before calculating anything, and each percentage will attach to the right one.",
      },
      {
        id: "a-ma-pc-simple-interest",
        title: "Simple interest",
        explain:
          "Simple interest is calculated on the original amount for every period, so it is the same amount each year. The interest is the principal multiplied by the rate multiplied by the time, with the rate as a decimal or over 100.",
        origin:
          "Interest is the oldest regulated calculation in this course. The Code of Hammurabi, carved in Babylon around 1750 before the common era, sets maximum rates that a lender may charge on loans of grain and of silver, and it does so because lending at whatever rate the lender liked was already causing enough ruin to need a law. That is nearly four thousand years of the same argument. For much of European history charging interest at all was forbidden as usury, and compound interest in particular was treated as the abusive form, because a debt that grows on its own growth can outrun any ability to repay it. That is exactly the difference between the simple interest in this atom and the compound interest of Month 5, and the moral argument was a recognition of the mathematics before anybody had the notation to write it down.",
        why: "Simple interest is on every syllabus at this level and it is the entry point to the compound interest of Month 5. It also makes the distinction between the two vivid, and that distinction is the difference between a loan you can afford and one you cannot.",
        example:
          "  Principal 50,000 naira, rate 8% per year, 3 years.\n\n    Interest for one year:  8% of 50,000 = 4,000\n    For three years:        4,000 x 3 = 12,000\n\n    Total amount owed: 50,000 + 12,000 = 62,000\n\n  As a formula:\n\n    Interest = Principal x Rate x Time\n             = 50,000 x 0.08 x 3\n             = 12,000\n\n  Or with the rate over 100, which is the form most\n  textbooks print:\n\n    I = P R T / 100\n      = 50,000 x 8 x 3 / 100\n      = 12,000\n\n  Both are the same calculation. The 100 in the\n  second version is what turns 8 into 0.08.\n\n\n  WHAT MAKES IT SIMPLE:\n\n  Year 1 interest: 8% of 50,000 = 4,000\n  Year 2 interest: 8% of 50,000 = 4,000\n  Year 3 interest: 8% of 50,000 = 4,000\n\n  Always of the ORIGINAL. Month 5 covers compound\n  interest, where each year's interest is of the\n  new total, and the two part company quickly.",
        mistake:
          "Confusing the interest with the total amount. If a question asks how much is owed, it wants principal plus interest. If it asks for the interest, it wants only the interest. Both are one line apart and they are different answers.",
      },
      {
        id: "a-ma-pc-percentage-error",
        title: "Percentage error",
        explain:
          "Percentage error compares how wrong a measurement or an estimate was against the true value. Take the size of the error, ignoring its direction, divide by the true value, and multiply by 100.",
        why: "It appears in measurement questions and in science, and it is the same structure as every other percentage in the module: a part over a whole. The true value is the whole, because the question is how large the error was relative to what it should have been.",
        example:
          "  A length is measured as 48 cm. The true length is 50 cm.\n\n    Error = 50 - 48 = 2 cm\n\n      2\n      --  x  100  =  4%  error\n      50\n\n  The TRUE value goes on the bottom, because the\n  question is how large the error is compared to\n  what the answer should have been.\n\n\n  Direction is usually ignored:\n\n  Measured 52 when the true value is 50.\n\n    Error = 2, so still 4%.\n\n  A question that wants the direction will ask for\n  a percentage overestimate or underestimate.\n\n\n  A rounding example, which is the common exam form:\n\n  1,278 is rounded to 1,300. Percentage error?\n\n    Error = 1,300 - 1,278 = 22\n\n      22\n      -----  x  100  =  1.72%  to 3 s.f.\n      1,278\n\n  Here the true value is 1,278, the figure before\n  rounding, because that is what the rounded value\n  is being compared to.",
        mistake:
          "Dividing by the measured value instead of the true value. The true value is the standard being compared to, so it goes on the bottom, exactly as the original amount did in a percentage increase.",
      },
      {
        id: "a-ma-pc-which-base",
        title: "One question, several bases",
        explain:
          "The whole of this lesson reduces to one habit: for each percentage in a question, identify what it is a percentage OF before calculating anything. Write the bases down as separate labelled lines.",
        why: "Every error in this lesson is a wrong base rather than wrong arithmetic. A candidate who writes down cost, marked and selling as three labelled lines before touching a percentage will get these questions right, and one who calculates as they read usually will not.",
        table: {
          caption: "Each percentage and the base it belongs to.",
          headers: ["Percentage", "Is of", "Never of"],
          rows: [
            ["Percentage profit", "The cost price", "The selling price"],
            ["Percentage loss", "The cost price", "The selling price"],
            ["Discount", "The marked price", "The cost price"],
            ["Percentage increase", "The original amount", "The new amount"],
            ["Percentage error", "The true value", "The measured value"],
            ["Simple interest", "The principal, every year", "The running total"],
          ],
          note: "Learn this table as six sentences rather than as a grid. Each row is a convention that decides which of two reasonable calculations a question is asking for, and no amount of arithmetic skill substitutes for knowing them.",
        },
        practice: {
          prompt:
            "A trader buys goods for 15,000 naira, marks them up to 20,000, and sells at a 10 per cent discount. Find the percentage profit, naming the base at each step.",
          answer:
            "Three labelled lines first. Cost 15,000. Marked 20,000. The discount is of the marked price, so the selling price is 20,000 x 0.9 = 18,000. Profit is 18,000 - 15,000 = 3,000, and percentage profit is of the cost, so 3,000/15,000 x 100 = 20 per cent. Using 20,000 as the base for the profit would give 15 per cent, which is the error the question is built to catch.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l44-percentages-in-use",
    moduleId: "ma-m3-percentages",
    sectionId: SECTION_ID,
    order: 4,
    title: "Percentages in Real Use",
    subtitle: "Where they are used to inform, and where to mislead",
    estimatedMinutes: 15,
    intro:
      "Percentages are the most quoted numbers in public life and the most easily misused, because a percentage on its own says nothing until you know what it is a percentage of. This lesson is partly exam practice and partly something more useful than that.",

    atoms: [
      {
        id: "a-ma-pc-percentage-points",
        title: "Per cent and percentage points are different",
        explain:
          "If a rate rises from 4 per cent to 6 per cent, that is a rise of 2 percentage points, and it is also a rise of 50 per cent. Both descriptions are correct and they are not the same number, so which one is quoted changes the impression completely.",
        why: "This distinction appears constantly in reporting about interest rates, inflation, unemployment and election results, and it is the single easiest way to make a small change sound large or a large one sound small. Knowing it is worth as much outside an exam as in one.",
        example:
          "  An interest rate goes from 4% to 6%.\n\n    In percentage POINTS:  6 - 4 = 2 points\n\n    As a percentage CHANGE:\n\n      2\n      -  x  100  =  50% increase\n      4\n\n  The same event. A lender announcing a two point\n  rise sounds modest. A borrower saying their\n  interest went up by half is describing the same\n  change and sounds alarmed. Both are honest.\n\n\n  The reverse trick:\n\n  A pass rate falls from 80% to 76%.\n\n    4 percentage points, which sounds small.\n    A 5% fall in the rate, which also sounds small.\n    But the FAILURE rate went from 20% to 24%,\n    which is a 20% increase in failures.\n\n  Three true statements, three impressions. The\n  question to ask is always: a percentage of what?",
        mistake:
          "Treating a rise of 2 percentage points as a rise of 2 per cent. They coincide only when the starting rate is 100, which it almost never is.",
      },
      {
        id: "a-ma-pc-of-what",
        title: "A percentage of what?",
        explain:
          "A percentage with no stated base carries no information. Fifty per cent off, fifty per cent more, a fifty per cent chance and a fifty per cent increase are four different claims, and each needs its base named before it can be checked.",
        why: "This is the reading skill the whole module has been building towards, and it is the same skill the fraction module asked for with 'a fraction of the remainder'. Most misleading uses of percentages are not false statements. They are true statements with the base left out.",
        example:
          "  Four claims, and what each needs before it means\n  anything:\n\n  '40% more protein'\n     More than what? Than the old recipe, or than a\n     competitor, or than some standard portion?\n\n  'Prices cut by up to 60%'\n     Up to. One item at 60% off and the rest at 5%\n     makes this sentence true.\n\n  'Crime up 100%'\n     From 1 case to 2 cases is up 100%. So is 500 to\n     1,000. The percentage hides the size.\n\n  '9 out of 10 dentists recommend it'\n     Out of how many asked, and which nine?\n\n  None of these is arithmetic. All of them are the\n  same question: a percentage OF what?",
        practice: {
          prompt:
            "A shop advertises 'everything half price' after raising all prices by 80 per cent the previous week. What does a customer actually pay compared with the original price?",
          answer:
            "Multipliers: 1.8 then 0.5, and 1.8 x 0.5 = 0.9. The customer pays 90 per cent of the original price, which is a genuine 10 per cent saving rather than the 50 per cent the sign suggests. This is the atom on why a rise and a fall do not cancel, doing something useful.",
        },
      },
      {
        id: "a-ma-pc-common-errors",
        title: "The five errors that cost the marks",
        explain:
          "Five specific mistakes account for almost all lost marks in this module, and every one of them is a wrong base rather than wrong arithmetic.",
        why: "Naming your own error makes the check specific, and specific checks get carried out while a general resolution to be careful does not. Every row here is a question you can ask yourself in two seconds before you start calculating.",
        table: {
          caption: "Five errors, and the question that prevents each.",
          headers: ["Error", "Looks like", "Ask yourself"],
          rows: [
            ["Profit on the selling price", "500/3,000 instead of 500/2,500", "Is this of the cost?"],
            ["Reverse done forwards", "4,800 x 1.2 instead of 4,800 / 0.8", "Was the figure I was given the before or the after?"],
            ["Percentages added", "Up 20 then down 20 gives 0", "Have I multiplied the multipliers?"],
            ["Points confused with per cent", "4% to 6% called a 2% rise", "Points, or a change in the rate?"],
            ["Units not matched", "40 kobo compared with 2 naira", "Are both quantities in the same unit?"],
          ],
        },
      },
      {
        id: "a-ma-pc-estimating",
        title: "Estimating a percentage in your head",
        explain:
          "Almost any percentage can be estimated well enough to check an answer by rounding to a friendly figure. Ten per cent is a column shift, and most percentages are a few tens plus or minus a half of one.",
        why: "The estimate is the check, and for percentage questions it catches the two errors arithmetic checking cannot: a factor of ten and a wrong base. If a 20 per cent profit comes out larger than the cost price, no amount of recalculating will find the mistake, and the estimate finds it instantly.",
        example:
          "  Is 17.5% of 3,840 about right at 672?\n\n    10% of 3,840 = 384\n     5%          = 192\n   2.5%          =  96\n  17.5%          = 384 + 192 + 96 = 672\n\n  Exact, and done in the head.\n\n\n  A rough one, 31% of 5,900:\n\n    30% of 6,000 = 1,800\n\n  So the answer should be a little over 1,800.\n  Anything near 180 or 18,000 is a column error,\n  and anything near 4,000 is a wrong base.\n\n\n  A check on a reverse question:\n\n  After 20% off, a price is 4,800. Original?\n\n    The original must be BIGGER than 4,800.\n    Roughly, 4,800 is about four fifths of it,\n    so a fifth is about 1,200 and the whole is\n    about 6,000.\n\n  If an answer comes out at 3,840 or at 5,760,\n  the estimate has already told you it is wrong.",
      },
      {
        id: "a-ma-pc-review",
        title: "Three months, mixed",
        explain:
          "A drill across fractions, decimals, money, the order of operations and the earlier number work, with nothing to say which is which.",
        why: "The next module is approximation and degree of accuracy, which applies to every answer in this one. Meeting the earlier material mixed, after a gap, is the only honest test of whether it is available rather than merely familiar.",
        drill: {
          review: [
            "L0-N4.4",
            "L0-N5.4",
            "L1-N3.2",
            "L0-N5.2",
            "L1-N3.1",
            "L0-N1.4",
          ],
          count: 6,
          intro:
            "Six questions from across three months. Work out what each one is asking before you calculate, because identifying the method is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start approximation",
      intro:
        "Every answer in this module had to be rounded somewhere, and the next module is about doing that properly. Check these first, with a pen:",
      prompts: [
        "A trader buys for 12,000, marks up to 16,000, and sells at 12.5 per cent discount. Find the percentage profit, naming the base at each step.",
        "After a 15 per cent rise, a rent is 322,000 naira. Find the rent before, then check forwards.",
        "A price rises 25 per cent and then falls 25 per cent. What single multiplier describes the whole change, and what percentage change is that?",
        "Express 250 grams as a percentage of 2 kilograms.",
        "An interest rate moves from 5 per cent to 7 per cent. Describe the change in two correct ways, and say which one a borrower would quote.",
      ],
      close:
        "If the second one came out as 370,300, the rise was applied forwards instead of divided out. If the third gave no change at all, the two percentages were added rather than the multipliers multiplied. Both are worth repairing here rather than in a final exam.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
