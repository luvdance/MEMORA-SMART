/**
 * MATHEMATICS · MONTH 4 · MODULE 1 · RATIO, RATE AND PROPORTION
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Ratio is fractions in a different costume, and the costume is what causes
 * the trouble. In the fraction 3/5 the bottom number is the WHOLE. In the ratio
 * 3:5 the second number is the OTHER PART, and the whole is 8. Every ratio
 * error a student makes for years afterwards comes out of that one difference,
 * so this module states it in the first lesson and then keeps returning to it.
 *
 * Three errors carry nearly all the lost marks, and the drills here are trapped
 * for all three by name:
 *
 *   PART FOR WHOLE. Sharing 480 in the ratio 3:5 means dividing by 8. A student
 *   who divides by 3 gets an answer bigger than the amount being shared, which
 *   is visible without any checking.
 *
 *   RATIO READ AS FRACTION. The first share of 3:5 is three eighths, not three
 *   fifths.
 *
 *   PROPORTION DIRECTION. More workers means fewer days. This module asks for
 *   the direction BEFORE the arithmetic, every time, because the direction is
 *   the actual skill and the arithmetic is Month 3.
 */

export const SECTION_ID = "ma-s4-ratio";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l49-what-is-a-ratio",
    moduleId: "ma-m4-ratio",
    sectionId: SECTION_ID,
    order: 1,
    title: "What a Ratio Is",
    subtitle: "A comparison, not a fraction, and the difference that costs marks",
    estimatedMinutes: 14,
    intro:
      "A ratio compares two quantities of the same kind. That sounds close enough to a fraction to be treated as one, and it is not, because the second number in a ratio is the other part rather than the whole. Getting that straight now prevents the commonest error in the topic.",

    atoms: [
      {
        id: "a-ma-rt-meaning",
        title: "A ratio compares two quantities",
        explain:
          "A ratio says how two amounts compare in size. If a class has 12 boys and 18 girls, the ratio of boys to girls is 12 to 18, written 12 : 18. The order matters, because the ratio of girls to boys is 18 : 12, which is a different statement.",
        origin:
          "The first serious theory of ratio was built to repair the damage done by root two. You met that in Month 1: the Pythagoreans believed every quantity could be written as a comparison of whole numbers, and the diagonal of a square proved otherwise. That left Greek mathematics needing a way to compare two magnitudes even when no whole number ratio existed between them, and the mathematician Eudoxus supplied one in the fourth century before the common era. His theory is preserved as Book Five of Euclid's Elements, and it is one of the most careful pieces of reasoning in the ancient world. Ratio is not a simplified version of fractions. It is the older and more general idea, and fractions are the special case where the comparison happens to come out in whole numbers.",
        why: "Ratios appear wherever two quantities have to stay in step: mixing concrete, sharing profit, scaling a recipe, reading a map, enlarging a drawing. A ratio is also the only honest way to describe a comparison when the total is not yet known, which is exactly what makes it different from a fraction.",
        example:
          "  A class of 12 boys and 18 girls.\n\n    boys : girls  =  12 : 18\n    girls : boys  =  18 : 12\n\n  Both are correct and they say different things.\n  Read the order the words give you.\n\n\n  The quantities must be the SAME KIND:\n\n    OK:   3 kg to 5 kg,  written 3 : 5\n    OK:   40 cm to 1 m, ONCE converted: 40 : 100\n    NOT:  3 kg to 5 litres, which compares nothing\n\n  And a ratio has no unit. Once both sides are in\n  the same unit, the unit cancels out and what is\n  left is a pure comparison of size.",
        mistake:
          "Writing a ratio with the two quantities in different units. 40 cm to 1 m is not 40 : 1. Convert first, to 40 : 100, which simplifies to 2 : 5. Comparing the numbers without converting is the ratio version of the percentage error from last month.",
      },
      {
        id: "a-ma-rt-not-a-fraction",
        title: "Why 3 : 5 is not three fifths",
        explain:
          "In the fraction 3/5 the bottom number is the whole. In the ratio 3 : 5 the second number is the OTHER part, so the whole is 3 + 5 = 8. As a fraction, the first share of 3 : 5 is three eighths.",
        why: "This is the most important sentence in the module. Almost every wrong answer in a ratio question comes from reading the second number as a whole rather than as a part, and once the distinction is solid the arithmetic is Month 3 material.",
        example:
          "  THE RATIO 3 : 5, drawn:\n\n    +---+---+---+---+---+---+---+---+\n    | A | A | A | B | B | B | B | B |\n    +---+---+---+---+---+---+---+---+\n      \\_ 3 parts _/ \\___ 5 parts ___/\n\n            8 parts altogether\n\n  A's share as a fraction:  3/8\n  B's share as a fraction:  5/8\n\n  NOT 3/5 and 5/5. There is no 5 of anything to\n  be the whole; the 5 is B's parts.\n\n\n  THE FRACTION 3/5, drawn:\n\n    +---+---+---+---+---+\n    | X | X | X |   |   |\n    +---+---+---+---+---+\n\n            5 parts altogether\n\n  Here the 5 IS the whole. Same two digits, two\n  different pictures, two different numbers.\n\n\n  Going between them:\n\n    ratio 3 : 5    ->  fractions 3/8 and 5/8\n    fraction 3/8   ->  ratio 3 : 5   (part to the rest)",
        mistake:
          "Answering a sharing question by finding three fifths of the total. It is three eighths. Count the parts before touching the numbers, and write the count down.",
      },
      {
        id: "a-ma-rt-simplifying",
        title: "Simplifying a ratio",
        explain:
          "A ratio simplifies exactly as a fraction does: divide both sides by their highest common factor. 12 : 18 becomes 2 : 3. Only multiplying and dividing are allowed, because a ratio is about how many times bigger one side is than the other.",
        why: "Simplest form is asked for and marked, and it makes every later step easier. It also connects straight back to the HCF work in Month 2, which was introduced as a fact about whole numbers and keeps turning out to be a tool.",
        example:
          "  Simplify 12 : 18\n\n    HCF of 12 and 18 is 6\n\n    12 ÷ 6 = 2\n    18 ÷ 6 = 3\n\n    So 12 : 18 = 2 : 3\n\n  Finished, because 2 and 3 share no factor but 1.\n\n\n  WHAT YOU MAY NOT DO:\n\n    12 : 18   subtract 6 from each side?\n    6 : 12    NO. That is a different comparison.\n\n  Check it: in 12 : 18 the second side is one and a\n  half times the first. In 6 : 12 it is twice. The\n  subtraction changed the relationship, which is\n  why only multiplying and dividing are permitted.\n\n\n  RATIOS WITH DECIMALS OR FRACTIONS:\n\n    0.4 : 0.6   multiply both by 10  ->  4 : 6  ->  2 : 3\n    1/2 : 1/3   multiply both by 6   ->  3 : 2\n\n  Multiply both sides by whatever clears the\n  awkwardness, then simplify. The value does not\n  change, for the same reason equivalent fractions\n  do not change.",
        mistake:
          "Subtracting the same amount from both sides. That is legal for an equation and illegal for a ratio, because a ratio records a multiplicative comparison rather than a difference.",
        drill: {
          skill: "L2-N3.1",
          count: 3,
          intro:
            "Three ratio questions, some simplifying and some sharing. For any sharing question, count the total parts before you calculate anything.",
        },
      },
      {
        id: "a-ma-rt-three-part",
        title: "Ratios with three or more parts",
        explain:
          "A ratio can compare any number of quantities: 2 : 3 : 5 shares something into ten parts. Everything works the same way, and the highest common factor now has to divide all the sides.",
        why: "Three part ratios appear constantly in real sharing: profit between three partners, a mixture of three ingredients, an inheritance among three heirs. They also catch students who learned a two part method as a recipe rather than as an idea.",
        example:
          "  Concrete is mixed cement : sand : gravel = 1 : 2 : 4\n\n    Total parts: 1 + 2 + 4 = 7\n\n  For 21 bags of concrete:\n\n    One part: 21 ÷ 7 = 3 bags\n\n    Cement: 1 × 3 =  3 bags\n    Sand:   2 × 3 =  6 bags\n    Gravel: 4 × 3 = 12 bags\n\n    Check: 3 + 6 + 12 = 21. Correct.\n\n\n  SIMPLIFYING A THREE PART RATIO:\n\n    12 : 18 : 30\n\n    The HCF must divide all three. HCF is 6.\n\n    2 : 3 : 5\n\n  If you only checked 12 and 18 you might divide by\n  6 and be right by luck, or divide by a factor that\n  does not go into 30 and be wrong. Check all sides.",
        mistake:
          "Simplifying using a factor of only two of the sides. In 12 : 18 : 30 dividing by 6 works because 6 divides all three. Dividing by 4 would work for 12 and not for the others, and a ratio that has been divided unevenly is no longer the same ratio.",
      },
      {
        id: "a-ma-rt-in-music",
        title: "Where ratio turns up unexpectedly",
        explain:
          "Ratio is not only a commercial tool. It describes musical harmony, the proportions of shapes, the gearing of a bicycle and the strength of a lens, and in each case the same comparison of two quantities is doing the work.",
        origin:
          "The most famous ratio discovery in history is about sound. The Pythagoreans found that if you halve the length of a vibrating string, the note it plays goes up by exactly an octave, and that the other pleasing intervals also come from simple whole number ratios: 3 to 2 gives a fifth, 4 to 3 gives a fourth. This was an astonishing thing to find. Something as apparently subjective as whether two notes sound good together turned out to be governed by small whole numbers, and it is the reason the Pythagoreans believed that number was the underlying structure of reality. Every tuned instrument in the world still depends on it.",
        why: "Knowing that ratio reaches this far makes it worth learning properly rather than as an exam topic. It also explains why the same word, proportion, shows up in art, architecture and engineering: they are all making two quantities keep a fixed comparison.",
        table: {
          caption: "The same idea, several trades.",
          headers: ["Where", "The ratio", "What it controls"],
          rows: [
            ["Music", "2 : 1 string lengths", "An octave"],
            ["Music", "3 : 2 string lengths", "A perfect fifth"],
            ["Concrete", "1 : 2 : 4", "Cement, sand and gravel"],
            ["A map", "1 : 50,000", "Paper distance to real distance"],
            ["A bicycle", "Teeth on the two gears", "How hard the pedals are to turn"],
            ["A photograph", "16 : 9", "The shape of the frame"],
          ],
          note: "Notice that a map scale is written as a ratio with 1 on the left. That is a convention which makes two maps instantly comparable, and Lesson 52 uses it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l50-sharing-unitary",
    moduleId: "ma-m4-ratio",
    sectionId: SECTION_ID,
    order: 2,
    title: "Sharing, and the Unitary Method",
    subtitle: "Find one part first, and everything else follows",
    estimatedMinutes: 15,
    intro:
      "Every question in this lesson is answered by the same move: find what ONE of something is worth, then multiply up. It is called the unitary method, it is nearly a thousand years old as a taught technique, and it solves more real problems than anything else in the course.",

    atoms: [
      {
        id: "a-ma-rt-sharing",
        title: "Sharing a quantity in a given ratio",
        explain:
          "Count the total parts, divide the quantity by that number to find one part, then multiply by each person's share. Three steps, always in that order, and the first one is the one people skip.",
        why: "This is the most examined skill in the module. It goes wrong almost entirely at step one, where a student divides by the first number of the ratio instead of by the total, and the resulting answer is larger than the amount being shared, which makes it catchable in a second.",
        example:
          "  ₦480,000 is shared between Amaka and Bola in\n  the ratio 3 : 5. How much does each get?\n\n  STEP 1  Count the parts.\n            3 + 5 = 8 parts\n\n  STEP 2  Find one part.\n            480,000 ÷ 8 = 60,000\n\n  STEP 3  Multiply out each share.\n            Amaka: 3 × 60,000 = 180,000\n            Bola:  5 × 60,000 = 300,000\n\n  STEP 4  Check the shares add back.\n            180,000 + 300,000 = 480,000. Correct.\n\n\n  THE ERROR THIS QUESTION IS BUILT TO CATCH:\n\n    480,000 ÷ 3 = 160,000 ... and then what?\n\n  Dividing by 3 answers the question 'what is a\n  third of the money', which nobody asked. The\n  ratio 3 : 5 has EIGHT parts in it. If your answer\n  for one person is more than half of a sum being\n  shared between two people whose shares are not\n  equal, look again.",
        mistake:
          "Dividing by the first number of the ratio instead of by the total number of parts. Write the parts count down as its own line, before any arithmetic, and the error becomes very hard to make.",
        drill: {
          skill: "L2-N3.1",
          count: 3,
          intro:
            "Three more ratio questions. Write the total parts down as a separate line before calculating.",
        },
      },
      {
        id: "a-ma-rt-find-total",
        title: "Working backwards from one share",
        explain:
          "If you are given one person's share and the ratio, find one part by dividing that share by their number of parts, then multiply by the total parts to get the whole.",
        why: "This is the reverse question, and it is asked as often as the forward one. It is the same shape as a reverse percentage from Month 3: find the value of one unit, then build up to what was asked.",
        example:
          "  Money is shared in the ratio 3 : 5. The larger\n  share is ₦300,000. Find the total.\n\n    The larger share is 5 parts.\n\n    One part:  300,000 ÷ 5 = 60,000\n    Total:     8 × 60,000 = 480,000\n\n  Check forwards: 480,000 in 3 : 5 gives 180,000\n  and 300,000. Correct.\n\n\n  A DIFFERENCE INSTEAD OF A SHARE:\n\n  Shared in the ratio 3 : 5, Bola gets ₦120,000\n  more than Amaka. Find the total.\n\n    The difference is 5 − 3 = 2 parts.\n\n    One part:  120,000 ÷ 2 = 60,000\n    Total:     8 × 60,000 = 480,000\n\n  The method never changes. What changes is how\n  many parts the number you were given represents,\n  and reading that is the whole task.",
        mistake:
          "Dividing the given share by the total parts rather than by that person's parts. Ask how many parts the number in front of you represents, and write it down before dividing.",
      },
      {
        id: "a-ma-rt-unitary",
        title: "The unitary method",
        explain:
          "To answer any question about quantities that scale together, find the value of one unit and then multiply by however many you want. It works whether the question scales up or down and it needs nothing to be memorised.",
        origin:
          "This was taught for centuries under a grander name: the Rule of Three, or in some European texts the Golden Rule, and it was the single most important piece of commercial mathematics anybody learned. It appears in Indian mathematics as trairashika, meaning the three quantities, and it reached Europe through Arabic texts. Merchants' arithmetic books from the 1400s onwards devote pages to it, because a trader who could work out the price of seventeen bolts of cloth from the price of five had a real advantage over one who could not. It is worth knowing that it was regarded as advanced knowledge, and that what is now a Month 4 lesson was once a professional qualification.",
        why: "Almost every proportion, rate, currency, recipe and best buy question in the rest of the course is this one method. It is also the safest method, because it makes no assumption about whether the answer should be bigger or smaller, and it can be checked at the halfway point.",
        example:
          "  7 exercise books cost ₦2,450.\n  What do 12 cost?\n\n    ONE book:   2,450 ÷ 7 = 350\n    TWELVE:     12 × 350 = 4,200\n\n  Sense check: 12 is more than 7, so the cost should\n  be more than 2,450. It is.\n\n\n  SCALING DOWN WORKS THE SAME WAY:\n\n  A recipe for 6 people needs 480 g of rice.\n  How much for 4 people?\n\n    ONE person:  480 ÷ 6 = 80 g\n    FOUR:        4 × 80 = 320 g\n\n  Fewer people, less rice. The method did not change\n  and it did not need to be told which direction to go.\n\n\n  A BEST BUY, which is the same method twice:\n\n    Pack A:  6 sachets for ₦360\n    Pack B:  10 sachets for ₦550\n\n    A: 360 ÷ 6  = ₦60 each\n    B: 550 ÷ 10 = ₦55 each\n\n  B is better value. Comparing the cost of one unit\n  is the only fair comparison, which is why shop\n  shelves in many countries are required to show it.",
        drill: {
          skill: "L2-N3.2",
          count: 3,
          intro:
            "Three unitary method questions. Find the cost of one before you do anything else, and write it down.",
        },
      },
      {
        id: "a-ma-rt-equivalent-ratios",
        title: "Scaling a ratio up and down",
        explain:
          "Multiplying or dividing both sides of a ratio by the same number gives an equivalent ratio. That is how a recipe is scaled, how a map is read and how a missing quantity is found when the other is given.",
        why: "This is equivalent fractions from Month 3 wearing ratio notation, and saying so out loud saves it being learned twice. It is also how the most common form of exam question is answered: given a ratio and one quantity, find the other.",
        example:
          "  Cement : sand = 2 : 5.\n  If 8 bags of cement are used, how much sand?\n\n    2 : 5\n    ×4  ×4\n    8 : 20\n\n    20 bags of sand.\n\n  The 4 came from asking what turns 2 into 8. Then\n  the same 4 must be applied to the other side, for\n  exactly the reason multiplying top and bottom of a\n  fraction by the same number leaves it alone.\n\n\n  THE SCALE FACTOR NEED NOT BE WHOLE:\n\n    3 : 7   and 12 litres of the first\n\n    3 × 4 = 12, so 7 × 4 = 28 litres.\n\n    3 : 7   and 5 litres of the first\n\n    3 × (5/3) = 5, so 7 × (5/3) = 35/3 = 11 2/3 litres.\n\n  The fraction arithmetic of Month 3 is doing the\n  work, which is why that month came first.",
        mistake:
          "Adding to one side what you added to the other. Going from 2 : 5 to 8 : 11 by adding 6 to each side changes the mixture: the first was two fifths as much cement as sand, and the second is much more. Multiply, never add.",
      },
      {
        id: "a-ma-rt-word-problems",
        title: "Reading a ratio word problem",
        explain:
          "The difficulty in these questions is almost never the arithmetic. It is working out which quantity the number you were given belongs to, and how many parts that quantity represents. Write that down before calculating.",
        why: "Three questions can share identical numbers and identical arithmetic and have three different answers, depending on whether the figure given is a total, one share or a difference. Identifying which is the skill being examined.",
        table: {
          caption: "One ratio, 3 : 5, and three different questions.",
          headers: ["You are told", "That is", "One part is"],
          rows: [
            ["The total is ₦480,000", "8 parts", "480,000 ÷ 8"],
            ["The smaller share is ₦180,000", "3 parts", "180,000 ÷ 3"],
            ["The larger share is ₦300,000", "5 parts", "300,000 ÷ 5"],
            ["One gets ₦120,000 more", "2 parts, the difference", "120,000 ÷ 2"],
          ],
          note: "All four rows give one part as ₦60,000, because they are the same situation described four ways. The arithmetic is identical and the reading is not, and the reading is what the marks are for.",
        },
        practice: {
          prompt:
            "Three partners share a profit in the ratio 2 : 3 : 7. The largest share is ₦280,000. Find the total profit and the smallest share.",
          answer:
            "The largest share is 7 parts, so one part is 280,000 divided by 7, which is 40,000. Total parts are 2 + 3 + 7 = 12, so the total profit is 12 x 40,000 = 480,000. The smallest share is 2 parts, which is 80,000. Check: 80,000 + 120,000 + 280,000 = 480,000. Note that dividing 280,000 by 12 would have been the error, because the number given was a share rather than the total.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l51-proportion",
    moduleId: "ma-m4-ratio",
    sectionId: SECTION_ID,
    order: 3,
    title: "Direct and Inverse Proportion",
    subtitle: "Decide the direction before you calculate anything",
    estimatedMinutes: 15,
    intro:
      "Two quantities are in direct proportion if doubling one doubles the other, and in inverse proportion if doubling one halves the other. There is one habit that makes this whole lesson reliable: decide which way the answer should go before you touch a number.",

    atoms: [
      {
        id: "a-ma-rt-direct",
        title: "Direct proportion",
        explain:
          "Two quantities are in direct proportion when one is always the same multiple of the other. Double the number of items and the cost doubles. Halve the time and the distance halves, if the speed is unchanged.",
        why: "Most everyday scaling is direct, which is exactly why inverse proportion catches people: the direct case feels like common sense and so the direction question never gets asked. Naming the direct case is what makes the other one visible.",
        example:
          "  A recipe for 6 people needs 480 g of rice.\n  How much for 15 people?\n\n  DIRECTION FIRST: more people, more rice.\n  So the answer must be above 480 g.\n\n  UNITARY METHOD:\n    One person: 480 ÷ 6 = 80 g\n    Fifteen:    15 × 80 = 1,200 g\n\n  1,200 is more than 480. Direction confirmed.\n\n\n  THE TEST FOR DIRECT PROPORTION:\n\n  Divide one quantity by the other and see whether\n  the answer is always the same.\n\n    people    rice     rice ÷ people\n      6       480          80\n     15      1200          80\n      4       320          80\n\n  Always 80. That constant is what direct proportion\n  means, and it is the amount for one person.",
        drill: {
          skill: "L2-N3.3",
          count: 3,
          intro:
            "Three proportion questions, some direct and some inverse. Decide which direction the answer should go before you calculate.",
        },
      },
      {
        id: "a-ma-rt-inverse",
        title: "Inverse proportion",
        explain:
          "Two quantities are in inverse proportion when one going up sends the other down, in such a way that their product stays the same. More workers on a job means fewer days. A faster speed means less time.",
        why: "This is where the marks are lost, and they are lost by scaling in the wrong direction. The cure is a single question asked before any arithmetic: should this answer be bigger or smaller than the number I started with? If the calculation then goes the other way, something is wrong.",
        example:
          "  4 workers finish a job in 18 days.\n  How long would 6 workers take?\n\n  DIRECTION FIRST: more workers, FEWER days.\n  So the answer must be below 18.\n\n  THE PRODUCT STAYS THE SAME:\n\n    The job is 4 × 18 = 72 worker days of work.\n    That total does not change, however many people\n    turn up.\n\n    With 6 workers: 72 ÷ 6 = 12 days.\n\n  12 is below 18. Direction confirmed.\n\n\n  THE ERROR THIS IS BUILT TO CATCH:\n\n    18 × 6/4 = 27 days\n\n  That scales up because there are more workers,\n  which would mean hiring people makes a job slower.\n  Asking the direction question first makes the\n  mistake impossible rather than merely unlikely.\n\n\n  THE TEST FOR INVERSE PROPORTION:\n\n  Multiply the two quantities and see whether the\n  answer is always the same.\n\n    workers   days    workers × days\n      4        18          72\n      6        12          72\n      9         8          72\n\n  Always 72. For direct proportion you DIVIDE to\n  find the constant; for inverse you MULTIPLY.",
        mistake:
          "Using the direct method on an inverse situation. The tell is always the same: the answer moves the wrong way. Ask the direction question, out loud if necessary, before writing anything down.",
      },
      {
        id: "a-ma-rt-which-one",
        title: "Telling which kind you have",
        explain:
          "Ask what happens to the second quantity if the first doubles. If it doubles too, the proportion is direct. If it halves, the proportion is inverse. That one question decides it, and it does not require any calculation.",
        why: "Exam questions rarely say which kind they are, so identifying it is part of the work. The test is fast and it is reliable, and it reduces the whole lesson to a single decision followed by arithmetic you already have.",
        table: {
          caption: "The same question asked of several pairs.",
          headers: ["If this doubles", "This becomes", "So it is"],
          rows: [
            ["Number of items bought", "Twice the cost", "Direct"],
            ["Number of people eating", "Twice the food", "Direct"],
            ["Time spent driving", "Twice the distance", "Direct"],
            ["Number of workers", "Half the time", "Inverse"],
            ["Speed of a journey", "Half the time", "Inverse"],
            ["Number of people sharing a fixed cake", "Half the slice each", "Inverse"],
          ],
          note: "The last three all have something fixed in the background: a fixed job, a fixed distance, a fixed cake. Wherever a total is fixed and is being divided up, the proportion is inverse.",
        },
        example:
          "  Two questions that look alike and are not:\n\n  (a) 5 taps fill a tank in 8 hours.\n      How long would 4 taps take?\n\n      Fewer taps, MORE time. Inverse.\n      5 × 8 = 40, so 40 ÷ 4 = 10 hours.\n\n  (b) 5 taps deliver 800 litres in an hour.\n      How much would 4 taps deliver?\n\n      Fewer taps, LESS water. Direct.\n      800 ÷ 5 = 160 each, so 4 × 160 = 640 litres.\n\n  Same numbers, opposite methods. The difference is\n  whether something is fixed and being shared out,\n  or whether both quantities grow together.",
        mistake:
          "Deciding by looking for keywords rather than by asking the doubling question. Words like workers and taps appear in both kinds of question, as the example above shows.",
      },
      {
        id: "a-ma-rt-proportion-in-use",
        title: "Proportion in real decisions",
        explain:
          "Currency conversion, fuel consumption, best buys, scaling a business and mixing anything are all proportion questions, and they all reduce to finding the value of one unit.",
        why: "This is the most immediately useful lesson in the course so far, and recognising the shape in an unfamiliar situation is what makes the technique worth having. Every one of these is the unitary method.",
        example:
          "  CURRENCY, direct:\n\n  If ₦1,650 buys one dollar, what does ₦20,000 buy?\n\n    20,000 ÷ 1,650 = 12.12 dollars, to 2 d.p.\n\n  Sense check: 20,000 is about twelve times 1,650,\n  so about twelve dollars. Agrees.\n\n\n  FUEL, direct:\n\n  A car uses 9 litres for 108 km.\n  How far on 15 litres?\n\n    One litre: 108 ÷ 9 = 12 km\n    Fifteen:   15 × 12 = 180 km\n\n\n  A FIXED SUPPLY, inverse:\n\n  Food for 12 people lasts 20 days.\n  How long would it last 15 people?\n\n    DIRECTION: more people, fewer days.\n    12 × 20 = 240 person days of food.\n    240 ÷ 15 = 16 days.\n\n  16 is below 20. Confirmed.\n\n\n  BEST BUY, two unitary calculations:\n\n    900 g for ₦1,350  ->  1.5 naira per gram\n    1.2 kg for ₦1,680 ->  1,680 ÷ 1,200 = 1.4 per gram\n\n  The second is better value, and note that the\n  units had to be matched before comparing, exactly\n  as with any ratio.",
      },
      {
        id: "a-ma-rt-proportion-errors",
        title: "The four errors in this lesson",
        explain:
          "Four mistakes account for almost every lost mark in ratio and proportion, and each has a specific check that takes a second.",
        why: "Each of these is a reading or a direction error rather than an arithmetic one, so recalculating will not find any of them. The check has to be a different kind of question from the one that produced the answer.",
        table: {
          caption: "Four errors, and the check for each.",
          headers: ["Error", "Looks like", "The check"],
          rows: [
            ["Part for whole", "Dividing 480 by 3 for the ratio 3 : 5", "How many parts altogether?"],
            ["Ratio read as fraction", "Finding three fifths instead of three eighths", "Is the second number a part or the whole?"],
            ["Wrong direction", "More workers giving more days", "Should this go up or down?"],
            ["Units not matched", "40 cm to 1 m written as 40 : 1", "Are both sides in the same unit?"],
          ],
          note: "The direction check is the strongest of the four, because it can be made before any calculation begins and it rules out half the possible wrong answers immediately.",
        },
        practice: {
          prompt:
            "6 taps fill a tank in 14 hours. How long would 4 taps take? State the direction before you calculate, then answer.",
          answer:
            "Fewer taps means more time, so the answer must be above 14 hours. The work is fixed at 6 x 14 = 84 tap hours, so 4 taps need 84 divided by 4, which is 21 hours. 21 is above 14, so the direction is confirmed. Scaling the other way would have given 14 x 4/6 = 9.33 hours, which would mean removing taps fills the tank faster.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l52-rates-scale",
    moduleId: "ma-m4-ratio",
    sectionId: SECTION_ID,
    order: 4,
    title: "Rates, Speed and Scale",
    subtitle: "A ratio between two different kinds of quantity",
    estimatedMinutes: 16,
    intro:
      "A rate compares two quantities of DIFFERENT kinds: kilometres per hour, naira per kilogram, litres per minute. The word per is the giveaway and it always means divided by. Speed is the rate every syllabus examines, and scale is the rate a map is built on.",

    atoms: [
      {
        id: "a-ma-rt-rates",
        title: "A rate is a ratio between unlike quantities",
        explain:
          "A ratio compares things of the same kind and has no unit. A rate compares things of different kinds and keeps both units: 60 kilometres per hour, 450 naira per kilogram, 20 litres per minute. The word per means divided by.",
        why: "Recognising the word per as a division instruction settles most rate questions before they start. It also tells you which quantity goes on top: the one named first.",
        example:
          "  Read the unit and you have the formula.\n\n    kilometres per hour  =  kilometres ÷ hours\n    naira per kilogram   =  naira ÷ kilograms\n    litres per minute    =  litres ÷ minutes\n    people per room      =  people ÷ rooms\n\n  The quantity named FIRST goes on top. Every time.\n\n\n  A worked one:\n\n  A tank holds 900 litres and empties in 12 minutes.\n\n    Rate = 900 ÷ 12 = 75 litres per minute\n\n  And going backwards, if a tank empties at 75\n  litres per minute for 20 minutes:\n\n    900 was litres per minute × minutes\n    75 × 20 = 1,500 litres\n\n  The unit tells you which operation to use, which\n  is why writing the unit is not decoration.",
      },
      {
        id: "a-ma-rt-speed",
        title: "Speed, distance and time",
        explain:
          "Speed is distance divided by time. Rearranged, distance is speed multiplied by time, and time is distance divided by speed. All three are the same statement, and the unit tells you which one you need.",
        origin:
          "Measuring speed needed a reliable clock, and at sea there was none for most of history, so sailors measured it with a rope. A wooden log was thrown overboard on a line knotted at regular intervals, and the crew counted how many knots ran out in a fixed time measured by a sandglass. That is where the nautical unit called a knot comes from, and it is also where a ship's log book gets its name, because the readings were written down. It is worth noticing what the method really is: an average speed over a short interval, which is exactly the definition in this atom. The more difficult idea of speed at a single instant had to wait for the calculus of Month 9.",
        why: "Speed questions are on every paper at this level, and they are also where unit errors are most expensive. A speed in km/h used with a time in minutes gives an answer that is wrong by a factor of sixty, and the examiners' reports name it every year.",
        example:
          "  THE THREE FORMS:\n\n    speed    = distance ÷ time\n    distance = speed × time\n    time     = distance ÷ speed\n\n  You do not need to memorise three. Read the unit:\n  km/h is km ÷ h, and the other two are that same\n  statement rearranged.\n\n\n  A worked one:\n\n  A bus covers 240 km in 4 hours.\n\n    Speed = 240 ÷ 4 = 60 km/h\n\n  The same journey at 80 km/h:\n\n    Time = 240 ÷ 80 = 3 hours\n\n  Faster speed, less time. That is the inverse\n  proportion of the last lesson, and it is why the\n  direction check works on speed questions too.\n\n\n  THE UNIT TRAP, which costs more marks than\n  anything else in this lesson:\n\n  A car travels at 60 km/h for 40 minutes.\n  How far?\n\n    WRONG:  60 × 40 = 2,400 km\n            Nothing on a road travels 2,400 km in\n            forty minutes.\n\n    RIGHT:  40 minutes = 40/60 hours = 2/3 hour\n            60 × 2/3 = 40 km\n\n  The speed was per HOUR, so the time must be in\n  hours before it can be used. Convert first, every\n  single time.",
        mistake:
          "Using minutes with a speed given per hour. Convert the time to hours first, by dividing by 60, and the fraction arithmetic of Month 3 does the rest.",
        drill: {
          skill: "L2-N3.4",
          count: 3,
          intro:
            "Three speed, distance and time questions. Read the unit to decide whether you are multiplying or dividing.",
        },
      },
      {
        id: "a-ma-rt-average-speed",
        title: "Average speed is not the average of the speeds",
        explain:
          "Average speed is the total distance divided by the total time. It is not the mean of the speeds on each leg of a journey, unless the legs happened to take equal times.",
        why: "This is a genuine trap in senior papers and it is worth meeting early. The intuitive answer is wrong for a reason worth understanding: the slower leg takes longer, so it gets more weight in the total time.",
        example:
          "  A driver covers 60 km at 60 km/h, then 60 km at\n  30 km/h. What is the average speed?\n\n  THE TEMPTING ANSWER:  (60 + 30) ÷ 2 = 45 km/h\n\n  WHY IT IS WRONG: the second leg takes twice as\n  long, so it counts for more of the journey time.\n\n  DO IT PROPERLY:\n\n    Leg 1 time: 60 ÷ 60 = 1 hour\n    Leg 2 time: 60 ÷ 30 = 2 hours\n\n    Total distance: 120 km\n    Total time:     3 hours\n\n    Average speed = 120 ÷ 3 = 40 km/h\n\n  40, not 45. The answer is always pulled towards\n  the slower speed, because you spend longer at it.\n\n\n  THE ONE CASE WHERE THE MEAN IS RIGHT:\n\n  If the two legs take the same TIME rather than\n  covering the same distance, the mean of the\n  speeds is correct. Equal times, not equal\n  distances, is the condition.",
        mistake:
          "Averaging the two speeds. Go back to the definition every time: total distance over total time, which means working out each leg's time separately first.",
      },
      {
        id: "a-ma-rt-scale",
        title: "Scale drawings and maps",
        explain:
          "A scale is a ratio between a distance on paper and the real distance it stands for. A scale of 1 : 50,000 means one centimetre on the map is fifty thousand centimetres on the ground, which is five hundred metres.",
        origin:
          "Drawing something to scale is an old surveying technique and it is what made large construction possible before anybody could calculate stresses. Egyptian and Roman builders worked from scaled plans, and the Romans surveyed roads and aqueducts with instruments for setting out right angles and levels over long distances, which is how an aqueduct could be given a steady gentle fall across many kilometres. The key insight is the one in this atom: if every length is reduced by the same ratio, then every angle and every proportion is preserved, so a drawing can be measured and trusted. That idea grows into the similar figures of Month 8.",
        why: "Map and scale questions appear in both the number and geometry parts of the syllabus, and they also connect to bearings in Month 8. The whole difficulty is unit conversion, which is why this atom sits beside speed.",
        example:
          "  A map has a scale of 1 : 50,000.\n  Two towns are 7 cm apart on the map.\n  How far apart are they really?\n\n    7 cm on paper × 50,000 = 350,000 cm real\n\n    Now convert to something sensible:\n    350,000 cm = 3,500 m = 3.5 km\n\n  The arithmetic was one multiplication. The work\n  was the conversion afterwards.\n\n\n  THE OTHER DIRECTION:\n\n  The same map. Two places are 12 km apart.\n  How far apart on the map?\n\n    12 km = 1,200,000 cm\n    1,200,000 ÷ 50,000 = 24 cm\n\n\n  A ROOM PLAN, a scale you can hold:\n\n  A plan is drawn at 1 : 100, so 1 cm is 1 m.\n  A room measuring 4.5 cm by 3 cm on the plan is\n  4.5 m by 3 m in the building.\n\n  Note that a scale of 1 : 100 is a convenient one\n  precisely because the conversion is easy, which is\n  why architects use it.",
        mistake:
          "Forgetting that the scale is in the same unit on both sides. A scale of 1 : 50,000 is centimetres to centimetres, so a map measurement in centimetres gives a real answer in centimetres, and the conversion to metres or kilometres is a separate step that still has to be done.",
      },
      {
        id: "a-ma-rt-review",
        title: "Four months, mixed",
        explain:
          "A drill across ratio, proportion, speed, fractions, decimals, percentages and the number work of Months 1 and 2, with nothing to say which is which.",
        why: "The next module is measurement, which uses the unit conversion of this lesson constantly and the rounding of Month 3 on every answer. Mixed work after a gap is the only honest measurement of whether the earlier material is available rather than merely familiar.",
        drill: {
          review: [
            "L2-N3.1",
            "L2-N3.4",
            "L2-N3.3",
            "L1-N3.1",
            "L2-N3.2",
            "L0-N5.4",
            "L0-N1.4",
          ],
          count: 7,
          intro:
            "Seven questions from across four months. Work out what each one is asking before you calculate, because identifying the method is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start measurement",
      intro:
        "The next module is units, perimeter and area, and it leans on the conversions in this lesson. Check with a pen, no calculator:",
      prompts: [
        "₦480,000 is shared in the ratio 3 : 5 : 4. Find each share, and check they add back.",
        "Money is shared in the ratio 2 : 7. The larger share is ₦140,000 more than the smaller. Find the total.",
        "6 taps fill a tank in 14 hours. How long for 4 taps? State the direction before calculating.",
        "A car travels at 60 km/h for 40 minutes. How far? Say what has to be converted and why.",
        "A driver covers 90 km at 45 km/h, then 90 km at 90 km/h. Find the average speed, and say why it is not 67.5 km/h.",
        "A map is 1 : 25,000. Two towns are 8.4 cm apart on it. How far apart in kilometres?",
      ],
      close:
        "If the second one gave 20,000 as one part, the ₦140,000 was read as a share rather than as the difference of 5 parts. If the fifth gave 67.5, the two speeds were averaged instead of using total distance over total time. Both are worth repairing here.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
