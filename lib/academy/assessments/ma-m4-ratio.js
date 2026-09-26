/**
 * ASSESSMENTS · MATHEMATICS · MONTH 4 · MODULE 1 · RATIO, RATE AND PROPORTION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Every wrong option here is one of the four named errors from the module, so
 * the whyWrong can say which misconception produced it rather than restating
 * the arithmetic.
 *
 * Two questions carry more than their weight. The inverse proportion question
 * offers the direct answer as a distractor, because a candidate who has not
 * learned to ask the direction question will pick it every time. And the
 * average speed question offers the mean of the two speeds, which is the
 * intuitive answer and is wrong for a reason worth understanding: the slower
 * leg takes longer, so it weighs more in the total time.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l49-what-is-a-ratio": {
    lessonId: "ma-l49-what-is-a-ratio",
    passMark: 70,
    questions: [
      {
        id: "maq49-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-rt-simplifying",
        prompt: "Simplify the ratio 12 : 18.",
        options: [
          { id: "a", text: "6 : 12" },
          { id: "b", text: "2 : 3" },
          { id: "c", text: "6 : 9" },
          { id: "d", text: "1 : 1.5" },
        ],
        correct: "b",
        explanation:
          "The HCF of 12 and 18 is 6, so divide both sides by 6 to get 2 : 3. It is finished because 2 and 3 share no factor except 1.",
        whyWrong: {
          a: "This subtracts 6 from each side instead of dividing. Subtracting changes the comparison: in 12 : 18 the second side is one and a half times the first, and in 6 : 12 it is twice.",
          c: "Correct and unfinished. Both sides still share 3, and the last mark is for spotting it.",
          d: "The value is right and the form is not. A ratio in lowest terms uses whole numbers, so multiply both sides by 2.",
        },
      },
      {
        id: "maq49-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-rt-not-a-fraction",
        prompt:
          "In the ratio 3 : 5, what fraction of the whole is the first share?",
        options: [
          { id: "a", text: "3/5" },
          { id: "b", text: "3/8" },
          { id: "c", text: "5/8" },
          { id: "d", text: "3/2" },
        ],
        correct: "b",
        explanation:
          "The ratio has 3 + 5 = 8 parts, so the first share is three of the eight: 3/8. In a ratio the second number is the OTHER part, not the whole, which is the difference between a ratio and a fraction.",
        whyWrong: {
          a: "This reads 3 : 5 as the fraction three fifths, treating the 5 as the whole. In a ratio the 5 is the second person's parts, and the whole is 8.",
          c: "That is the second share as a fraction. The question asked for the first.",
          d: "This divides the two numbers into each other. A fraction of the whole must be under 1 when the part is smaller than the total.",
        },
      },
      {
        id: "maq49-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-rt-meaning",
        prompt: "Express 40 cm to 1 m as a ratio in its lowest terms.",
        options: [
          { id: "a", text: "40 : 1" },
          { id: "b", text: "2 : 5" },
          { id: "c", text: "1 : 40" },
          { id: "d", text: "4 : 1" },
        ],
        correct: "b",
        explanation:
          "Both sides must be in the same unit first: 1 m is 100 cm, so the ratio is 40 : 100, which simplifies to 2 : 5 by dividing both by 20.",
        whyWrong: {
          a: "This compares 40 with 1 without converting. A ratio compares quantities of the same kind in the same unit, and 40 cm is less than 1 m rather than forty times it.",
          c: "The conversion is missing and the order has also been reversed. 40 cm to 1 m puts the 40 cm first.",
          d: "This looks like 100 divided by 40 rounded, or a conversion applied to only one side.",
        },
      },
      {
        id: "maq49-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-rt-three-part",
        prompt:
          "Concrete is mixed cement : sand : gravel in the ratio 1 : 2 : 4. How many bags of gravel are in 21 bags of concrete?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "12" },
          { id: "c", text: "84" },
          { id: "d", text: "5.25" },
        ],
        correct: "b",
        explanation:
          "There are 1 + 2 + 4 = 7 parts, so one part is 21 ÷ 7 = 3 bags. Gravel is 4 parts: 4 × 3 = 12 bags. Check: 3 + 6 + 12 = 21.",
        whyWrong: {
          a: "That is the number of PARTS of gravel, not the number of bags. Each part is worth 3 bags.",
          c: "This multiplies the total by 4 rather than finding one part first. The answer cannot exceed the 21 bags being mixed.",
          d: "This divides 21 by 4, using gravel's parts as though they were the total. The total parts are 7.",
        },
      },
      {
        id: "maq49-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-in-music",
        prompt:
          "The Pythagoreans found that halving a vibrating string raises its note by an octave. Why did this discovery matter so much to them?",
        options: [
          { id: "a", text: "Because it let them build better instruments" },
          {
            id: "b",
            text: "Because something apparently subjective, whether two notes sound good together, turned out to be governed by simple whole number ratios",
          },
          { id: "c", text: "Because it proved that all numbers are rational" },
          { id: "d", text: "Because it showed that music cannot be measured" },
        ],
        correct: "b",
        explanation:
          "A ratio of 2 to 1 gives an octave and 3 to 2 gives a fifth. Finding that harmony obeys small whole numbers is why the Pythagoreans came to believe number was the underlying structure of reality, and every tuned instrument still depends on it.",
        whyWrong: {
          a: "Better instruments were a consequence and not the reason it mattered to them. Their interest was in what it said about the world.",
          c: "It encouraged that belief and it did not prove it, and the diagonal of a square later disproved it. That collision is why the theory of ratio had to be rebuilt.",
          d: "The discovery showed the opposite: that something thought unmeasurable could be measured exactly.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l50-sharing-unitary": {
    lessonId: "ma-l50-sharing-unitary",
    passMark: 70,
    questions: [
      {
        id: "maq50-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-rt-sharing",
        prompt:
          "₦480,000 is shared between Amaka and Bola in the ratio 3 : 5. How much does Amaka receive?",
        options: [
          { id: "a", text: "₦160,000" },
          { id: "b", text: "₦180,000" },
          { id: "c", text: "₦300,000" },
          { id: "d", text: "₦288,000" },
        ],
        correct: "b",
        explanation:
          "There are 3 + 5 = 8 parts. One part is 480,000 ÷ 8 = 60,000, so Amaka's 3 parts are 180,000. Check: 180,000 + 300,000 = 480,000.",
        whyWrong: {
          a: "This divides by 3 rather than by the 8 total parts. The ratio describes eight parts, not three, and this is the commonest error in the module.",
          c: "That is Bola's share of 5 parts. The arithmetic was right and the wrong person's share was given.",
          d: "This finds three fifths of the total, reading the ratio as a fraction. The 5 is Bola's parts, not the whole.",
        },
      },
      {
        id: "maq50-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-find-total",
        prompt:
          "Money is shared in the ratio 3 : 5 and the larger share is ₦300,000. What is the total?",
        options: [
          { id: "a", text: "₦480,000" },
          { id: "b", text: "₦800,000" },
          { id: "c", text: "₦375,000" },
          { id: "d", text: "₦500,000" },
        ],
        correct: "a",
        explanation:
          "The larger share is 5 parts, so one part is 300,000 ÷ 5 = 60,000. The total is 8 parts: 8 × 60,000 = 480,000. Checking forwards, 480,000 in 3 : 5 gives 180,000 and 300,000.",
        whyWrong: {
          b: "This divides by 3 to find one part, using the smaller share's parts for the larger share's amount. Ask how many parts the number you were given represents.",
          c: "This treats the 300,000 as though it were the total and scales from there.",
          d: "This looks like the 300,000 scaled by 5/3 rather than divided by 5 and multiplied by 8.",
        },
      },
      {
        id: "maq50-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-rt-unitary",
        prompt: "7 exercise books cost ₦2,450. What do 12 cost?",
        options: [
          { id: "a", text: "₦350" },
          { id: "b", text: "₦4,200" },
          { id: "c", text: "₦2,455" },
          { id: "d", text: "₦1,429" },
        ],
        correct: "b",
        explanation:
          "One book costs 2,450 ÷ 7 = 350. Twelve cost 12 × 350 = 4,200. Sense check: 12 is more than 7, so the cost must be more than 2,450.",
        whyWrong: {
          a: "That is the cost of ONE book, which is the right first step. The question asked for twelve.",
          c: "This adds the difference in quantity, 5, to the price. Each extra book costs 350 naira, not one naira.",
          d: "This divides the total by 12 rather than by 7. The 2,450 is the cost of seven books.",
        },
      },
      {
        id: "maq50-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-rt-equivalent-ratios",
        prompt:
          "Cement and sand are mixed in the ratio 2 : 5. If 8 bags of cement are used, how much sand is needed?",
        options: [
          { id: "a", text: "11 bags" },
          { id: "b", text: "20 bags" },
          { id: "c", text: "3.2 bags" },
          { id: "d", text: "40 bags" },
        ],
        correct: "b",
        explanation:
          "2 becomes 8 by multiplying by 4, so the same 4 applies to the other side: 5 × 4 = 20 bags. Multiplying both sides by the same number leaves a ratio unchanged, exactly as with equivalent fractions.",
        whyWrong: {
          a: "This adds 6 to each side. Adding changes the mixture, because a ratio records how many times bigger one side is rather than a difference.",
          c: "This scales the wrong way, dividing 8 by 2 and then applying it backwards. More cement needs more sand.",
          d: "This multiplies 5 by 8 rather than by the scale factor of 4. The 8 is a quantity of cement, not a multiplier.",
        },
      },
      {
        id: "maq50-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-word-problems",
        prompt:
          "Money is shared in the ratio 3 : 5 and one person gets ₦120,000 more than the other. What is one part worth?",
        options: [
          { id: "a", text: "₦15,000" },
          { id: "b", text: "₦60,000" },
          { id: "c", text: "₦40,000" },
          { id: "d", text: "₦24,000" },
        ],
        correct: "b",
        explanation:
          "The difference between the shares is 5 − 3 = 2 parts, so 120,000 is 2 parts and one part is 60,000. Check: the shares are 180,000 and 300,000, which differ by 120,000.",
        whyWrong: {
          a: "This divides by 8, treating the 120,000 as the total. It is the difference between the two shares, not the amount being shared.",
          c: "This divides by 3, using one person's parts rather than the difference in parts.",
          d: "This divides by 5, which is the larger share's parts rather than the gap between the two.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l51-proportion": {
    lessonId: "ma-l51-proportion",
    passMark: 70,
    questions: [
      {
        id: "maq51-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-rt-direct",
        prompt:
          "A recipe for 6 people needs 480 g of rice. How much is needed for 15 people?",
        options: [
          { id: "a", text: "192 g" },
          { id: "b", text: "1,200 g" },
          { id: "c", text: "489 g" },
          { id: "d", text: "80 g" },
        ],
        correct: "b",
        explanation:
          "One person needs 480 ÷ 6 = 80 g, so 15 people need 15 × 80 = 1,200 g. Direction check: more people, more rice, and 1,200 is above 480.",
        whyWrong: {
          a: "This scales the wrong way, as though more people needed less rice. Rice and people are in direct proportion.",
          c: "This adds the extra 9 people to the grams of rice. Each extra person needs 80 g, not one gram.",
          d: "That is the amount for one person, which is the right first step.",
        },
      },
      {
        id: "maq51-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-inverse",
        prompt: "4 workers finish a job in 18 days. How long would 6 workers take?",
        options: [
          { id: "a", text: "27 days" },
          { id: "b", text: "12 days" },
          { id: "c", text: "72 days" },
          { id: "d", text: "20 days" },
        ],
        correct: "b",
        explanation:
          "Direction first: more workers, fewer days, so the answer must be below 18. The job is 4 × 18 = 72 worker days, and 72 ÷ 6 = 12 days.",
        whyWrong: {
          a: "This scales in the same direction, as though hiring people made the job slower. Asking the direction question before calculating makes this impossible rather than merely unlikely.",
          c: "That is the total work in worker days, which is the right middle step. Now divide it among the 6 workers.",
          d: "This adds rather than scaling, or averages the two figures. Neither is what inverse proportion does.",
        },
      },
      {
        id: "maq51-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-which-one",
        prompt:
          "Which of these pairs is in INVERSE proportion?",
        options: [
          { id: "a", text: "Number of items bought and the total cost" },
          { id: "b", text: "Time spent driving and the distance covered" },
          { id: "c", text: "Number of people sharing one fixed cake and the size of each slice" },
          { id: "d", text: "Number of people eating and the food needed" },
        ],
        correct: "c",
        explanation:
          "Double the people and each slice halves, because the cake is fixed and is being divided up. Wherever a total is fixed and shared out, the proportion is inverse.",
        whyWrong: {
          a: "Direct. Twice as many items costs twice as much.",
          b: "Direct, at a steady speed. Twice as long on the road covers twice the distance.",
          d: "Direct. Twice as many people need twice the food, because nothing is fixed here.",
        },
      },
      {
        id: "maq51-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-rt-proportion-in-use",
        prompt:
          "Food for 12 people lasts 20 days. How long would the same food last 15 people?",
        options: [
          { id: "a", text: "25 days" },
          { id: "b", text: "16 days" },
          { id: "c", text: "240 days" },
          { id: "d", text: "17 days" },
        ],
        correct: "b",
        explanation:
          "The food is fixed, so this is inverse: more people, fewer days. There are 12 × 20 = 240 person days of food, and 240 ÷ 15 = 16 days.",
        whyWrong: {
          a: "This scales up, as though more people made the food last longer. The direction question rules it out before any arithmetic.",
          c: "That is the total person days of food, the right middle step, not the number of days.",
          d: "This subtracts the extra people from the days. The relationship is multiplicative, not a difference.",
        },
      },
      {
        id: "maq51-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-rt-proportion-errors",
        prompt:
          "Which check can be made BEFORE any calculation and rules out half the possible wrong answers?",
        options: [
          { id: "a", text: "Checking the units match" },
          { id: "b", text: "Deciding whether the answer should be larger or smaller than the number you started with" },
          { id: "c", text: "Counting the total parts" },
          { id: "d", text: "Simplifying the ratio first" },
        ],
        correct: "b",
        explanation:
          "The direction question needs no arithmetic and it eliminates every answer on the wrong side. It is the check that catches the inverse-for-direct error, which recalculating never will, because the arithmetic that was done was internally correct.",
        whyWrong: {
          a: "A real check and it catches only unit errors, which are a smaller share of the losses in this module.",
          c: "Essential for a sharing question and it is part of the calculation rather than a check on it.",
          d: "Helpful and optional. A ratio left unsimplified still gives the right answer if the parts are counted correctly.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l52-rates-scale": {
    lessonId: "ma-l52-rates-scale",
    passMark: 70,
    questions: [
      {
        id: "maq52-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-rt-speed",
        prompt: "A bus covers 240 km in 4 hours. What is its average speed?",
        options: [
          { id: "a", text: "60 km/h" },
          { id: "b", text: "960 km/h" },
          { id: "c", text: "0.017 km/h" },
          { id: "d", text: "244 km/h" },
        ],
        correct: "a",
        explanation:
          "Read the unit: km/h means km ÷ h, so 240 ÷ 4 = 60 km/h. Check forwards: 60 × 4 = 240 km.",
        whyWrong: {
          b: "This multiplies instead of dividing. Speed is a distance PER hour, and per is a division. Nothing on a road travels 960 km/h.",
          c: "This divides the time by the distance, giving hours per kilometre. That is a real quantity and not the one asked for.",
          d: "This adds the two numbers, which combines a distance with a time and produces nothing meaningful.",
        },
      },
      {
        id: "maq52-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-speed",
        prompt: "A car travels at 60 km/h for 40 minutes. How far does it go?",
        options: [
          { id: "a", text: "2,400 km" },
          { id: "b", text: "40 km" },
          { id: "c", text: "24 km" },
          { id: "d", text: "1.5 km" },
        ],
        correct: "b",
        explanation:
          "The speed is per hour, so the time must be in hours first: 40 minutes is 40/60 = 2/3 hour. Then 60 × 2/3 = 40 km. Converting the time is the whole question.",
        whyWrong: {
          a: "This uses 40 minutes as though it were 40 hours. Nothing on a road covers 2,400 km in forty minutes, which is the check that catches it instantly.",
          c: "This looks like 60 × 0.4, treating 40 minutes as 0.4 of an hour. Forty minutes is two thirds of an hour, not four tenths.",
          d: "This divides instead of multiplying. At a fixed speed, more time means more distance.",
        },
      },
      {
        id: "maq52-3",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-average-speed",
        prompt:
          "A driver covers 60 km at 60 km/h, then 60 km at 30 km/h. What is the average speed for the whole journey?",
        options: [
          { id: "a", text: "45 km/h" },
          { id: "b", text: "40 km/h" },
          { id: "c", text: "90 km/h" },
          { id: "d", text: "30 km/h" },
        ],
        correct: "b",
        explanation:
          "Average speed is total distance over total time. The legs take 1 hour and 2 hours, so 120 km in 3 hours is 40 km/h. The answer is pulled towards the slower speed because more time is spent at it.",
        whyWrong: {
          a: "This averages the two speeds. It would only be correct if the two legs took equal TIMES, and here the slower leg takes twice as long, so it weighs more.",
          c: "This adds the two speeds. Speeds on different legs of a journey do not add.",
          d: "That is the speed on the slower leg alone. The faster leg happened too.",
        },
      },
      {
        id: "maq52-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-rt-scale",
        prompt:
          "A map has a scale of 1 : 50,000. Two towns are 7 cm apart on the map. How far apart are they really?",
        options: [
          { id: "a", text: "350 km" },
          { id: "b", text: "3.5 km" },
          { id: "c", text: "35 km" },
          { id: "d", text: "7,143 km" },
        ],
        correct: "b",
        explanation:
          "7 × 50,000 = 350,000 cm. Converting: 350,000 cm is 3,500 m, which is 3.5 km. The multiplication is one step and the conversion afterwards is the part that gets dropped.",
        whyWrong: {
          a: "The multiplication is right and the conversion has been skipped. 350,000 cm is not 350 km, because there are 100,000 cm in a kilometre.",
          c: "This is out by a factor of ten, which is a slip in converting centimetres to kilometres rather than in the scale.",
          d: "This divides by the scale instead of multiplying. The map is smaller than the ground, so the real distance is larger.",
        },
      },
      {
        id: "maq52-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-rt-rates",
        prompt:
          "Why does writing the unit tell you whether to multiply or divide?",
        options: [
          { id: "a", text: "It does not; the unit is only for presentation marks" },
          {
            id: "b",
            text: "Because the word per means divided by, so km/h is kilometres ÷ hours and the quantity named first goes on top",
          },
          { id: "c", text: "Because units are always multiplied" },
          { id: "d", text: "Because the unit tells you the size of the answer" },
        ],
        correct: "b",
        explanation:
          "Naira per kilogram is naira ÷ kilograms, litres per minute is litres ÷ minutes. Reading the unit gives you the formula, which is why there is no need to memorise three separate versions of the speed relationship.",
        whyWrong: {
          a: "The unit carries a presentation mark and it also carries the method, which is the more useful half.",
          c: "The word per is a division. Multiplying comes in when a rate is used to find a total, which is the rearrangement rather than the definition.",
          d: "The unit says what kind of quantity the answer is, not how big. Size comes from an estimate.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
