/**
 * MATHEMATICS · MONTH 3 · MODULE 2 · DECIMALS AND MONEY
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * A decimal is not a new kind of number. It is the place value chart from
 * Month 1 continued to the right of the units column, and every column to the
 * right is one tenth of the one before it exactly as every column to the left
 * was ten times it. The chart does not change. Only the starting point of the
 * reading does.
 *
 * Two things in this module are worth the whole of it.
 *
 * The first is that 0.8 is larger than 0.75, which nearly everybody gets wrong
 * at least once, because it is read as eight against seventy five. The cure is
 * not a rule. It is reading the columns.
 *
 * The second is why 1/3 never finishes as a decimal while 1/8 does. The answer
 * is sitting in Month 2: it depends entirely on which primes divide the bottom
 * of the fraction. Students are almost never told that, and it turns recurring
 * decimals from a strange fact into a consequence.
 */

export const SECTION_ID = "ma-s3-decimals";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l37-decimal-place-value",
    moduleId: "ma-m3-decimals",
    sectionId: SECTION_ID,
    order: 1,
    title: "The Chart Carried Rightwards",
    subtitle: "Tenths, hundredths, thousandths, and why 0.8 beats 0.75",
    estimatedMinutes: 14,
    intro:
      "You already know this chart. In Month 1 you learned that each column is ten times the one to its right, which means each column is a tenth of the one to its left. Nothing in that rule said to stop at the units. This lesson simply keeps going.",

    atoms: [
      {
        id: "a-ma-dc-columns",
        title: "The columns do not stop at the units",
        explain:
          "To the left of the point, each column is ten times the one before it. To the right, each column is a tenth of the one before it: tenths, then hundredths, then thousandths. The point is not a barrier. It is a marker showing where the units column is.",
        origin:
          "Carrying place value to the right of the units was worked out in the Islamic world, and the Persian mathematician Jamshid al-Kashi used decimal fractions with confidence in the early 1400s while calculating astronomical tables. Europe learned it from a short book called De Thiende, meaning The Tenth, published by the Flemish engineer Simon Stevin in 1585. Stevin was not writing for mathematicians. He was writing for surveyors, merchants and money changers, and he argued in the same book that coinage, weights and measures should all be decimal because it would spare ordinary people an enormous amount of arithmetic. He was right, and most of the world took nearly four hundred years to do it: Britain decimalised its money in 1971 and Nigeria in 1973.",
        why: "Every rule about decimals follows from the columns, and none of them has to be memorised separately. Lining up the point to add, moving the point when multiplying by ten, deciding which of two decimals is larger, are all the same chart being read.",
        example:
          "  Th   H    T    U  .   t     h     th\n 1000 100  10    1  .  1/10  1/100 1/1000\n  ---  ---  ---  --- .  ----  ----- ------\n                   3  .   4     7      5\n\n  3.475  =  3 units\n          + 4 tenths\n          + 7 hundredths\n          + 5 thousandths\n\n  Each step right divides by ten:\n\n    1  ->  1/10  ->  1/100  ->  1/1000\n     one tenth of one tenth of one tenth\n\n  The point sits immediately after the units column,\n  and its whole job is to show you where that column is.",
        analogy:
          "Naira and kobo. One naira, then tenths of a naira, then hundredths, which are the kobo. Nobody thinks of a kobo as a different kind of money, only as a smaller piece of the same money.",
        drill: {
          skill: "L0-N5.1",
          count: 3,
          intro:
            "Three questions on decimal place value. Name the column before you name the digit.",
        },
      },
      {
        id: "a-ma-dc-reading",
        title: "Reading a decimal correctly",
        explain:
          "Read the part after the point column by column, not as a whole number. 0.75 is seven tenths and five hundredths. It is not seventy five of anything, and reading it that way is what causes the commonest decimal error there is.",
        why: "This single habit prevents the mistake in the next atom. It also makes conversions to fractions immediate, since seven tenths and five hundredths is seventy five hundredths, which is 75/100.",
        table: {
          caption: "The same digits, different columns, different numbers.",
          headers: ["Decimal", "Read as", "As a fraction"],
          rows: [
            ["0.7", "7 tenths", "7/10"],
            ["0.07", "7 hundredths", "7/100"],
            ["0.007", "7 thousandths", "7/1000"],
            ["0.75", "7 tenths and 5 hundredths", "75/100"],
            ["0.705", "7 tenths, no hundredths, 5 thousandths", "705/1000"],
          ],
          note: "The zero in 0.705 is doing the same job it did in Month 1: holding a column open. Drop it and you have 0.75, which is a different number entirely.",
        },
        mistake:
          "Saying 'nought point seventy five'. It invites the comparison error, because it makes the tail sound like a whole number. Say 'nought point seven five', which is what an examiner's own mark scheme says.",
      },
      {
        id: "a-ma-dc-comparing",
        title: "Why 0.8 is larger than 0.75",
        explain:
          "Compare decimals column by column from the left, exactly as you compared whole numbers in Month 1. The first column where they differ decides it, and nothing further right can overturn that decision.",
        why: "This is the most common decimal error in every examiner report, and it is a reading error rather than an arithmetic one. It matters far beyond this module: ordering measurements, reading test scores, comparing prices, and every question that asks which of two rates is better.",
        example:
          "  Which is larger, 0.8 or 0.75?\n\n  Line up the columns:\n\n         tenths   hundredths\n  0.8       8          0        (0.8 = 0.80)\n  0.75      7          5\n\n  The tenths column differs, and 8 beats 7,\n  so 0.8 is larger. The 5 hundredths cannot\n  rescue 0.75, because a hundredth is small.\n\n\n  As money, in naira, it is obvious:\n\n    0.8  naira = 80 kobo\n    0.75 naira = 75 kobo\n\n  Nobody would say 75 kobo is more than 80 kobo.\n\n\n  Writing the extra zero is the trick that makes it\n  visible: 0.8 becomes 0.80, and now both have two\n  digits and can be read straight off.",
        mistake:
          "Deciding 0.75 is larger because 75 is bigger than 8. This is the same mistake as calling −18 larger than −3: reading the digits instead of the value. Adding a zero to the shorter decimal removes it permanently.",
      },
      {
        id: "a-ma-dc-trailing-zeros",
        title: "Which zeros matter and which do not",
        explain:
          "A zero at the END of a decimal changes nothing: 0.8 and 0.80 and 0.800 are the same number. A zero anywhere else changes everything, because it holds a column open. 0.08 is a tenth of 0.8.",
        why: "Students often learn zeros do not matter and apply it everywhere, or that they always matter and never dare add one. The difference is simple: a zero at the end adds no new column, while a zero between the point and a digit pushes that digit into a smaller column.",
        example:
          "  SAFE, and often useful:\n\n    0.8  =  0.80  =  0.800\n\n    All are 8 tenths. The extra zeros say\n    'no hundredths, no thousandths', which\n    was already true.\n\n\n  NOT SAFE:\n\n    0.8   =  8 tenths       = 8/10\n    0.08  =  8 hundredths   = 8/100\n\n    Ten times different. The zero moved the 8\n    into the next column right.\n\n\n  Why you would ever add one: to compare.\n\n    0.4  and  0.39\n    0.40 and  0.39     <- now readable at a glance",
        mistake:
          "Writing 0.8 as 0.08 while copying, or dropping a zero from 0.05 to get 0.5. Both are a factor of ten out, and in a money question that is the difference between fifty kobo and five naira.",
      },
      {
        id: "a-ma-dc-on-the-line",
        title: "Decimals have positions too",
        explain:
          "Every decimal has a place on the number line, in the gaps between the whole numbers, exactly as fractions do. Between any two decimals there is always another one, found by going one column further right.",
        why: "This is the same point the fraction module made, and it is worth making twice. A decimal is one number with a position, not a whole number with a tail. It is also the honest answer to a question students ask: there is no next decimal after 0.3, because 0.31, 0.301 and 0.3001 all sit between it and 0.4.",
        example:
          "  Between 0 and 1, in tenths:\n\n  0    0.1  0.2  0.3  0.4  0.5  0.6  0.7  0.8  0.9   1\n  +-----+----+----+----+----+----+----+----+----+----+\n\n  Zoom into the gap between 0.3 and 0.4:\n\n  0.30  0.31  0.32  0.33 ... 0.38  0.39  0.40\n   +-----+-----+-----+---------+-----+-----+\n\n  Ten hundredths fit in every tenth, ten thousandths\n  fit in every hundredth, and it never runs out.\n\n  Name a number between 0.3 and 0.4:  0.35\n  Between 0.3 and 0.35:               0.32\n  Between 0.3 and 0.32:               0.31\n  Between 0.3 and 0.31:               0.305\n\n  You can always go one column further right.",
        practice: {
          prompt:
            "Put these in order, smallest first: 0.6, 0.06, 0.65, 0.506, 0.56.",
          answer:
            "Write them all to three decimal places first: 0.600, 0.060, 0.650, 0.506, 0.560. Now read from the left. The order is 0.06, 0.506, 0.56, 0.6, 0.65. Writing them to a common length is the whole method, and it is the decimal version of finding a common denominator.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l38-decimal-arithmetic",
    moduleId: "ma-m3-decimals",
    sectionId: SECTION_ID,
    order: 2,
    title: "Calculating with Decimals",
    subtitle: "Line up the point to add, count the places to multiply",
    estimatedMinutes: 16,
    intro:
      "Adding decimals and multiplying them follow different rules, and confusing the two is the main source of trouble here. Adding needs the columns lined up. Multiplying does not care about the columns at all until the very end. Both reasons are in this lesson.",

    atoms: [
      {
        id: "a-ma-dc-adding",
        title: "Adding and subtracting: line up the point",
        explain:
          "Write the numbers with their decimal points in a vertical line, fill any short tails with zeros, then add or subtract exactly as in Month 2. The point in the answer goes directly below the points above it.",
        why: "Lining up the point is lining up the columns, and columns are the only reason column arithmetic works. Tenths must be added to tenths for the same reason that fifths could only be added to fifths last month, and it is the same principle wearing different notation.",
        example:
          "  Work out 12.4 + 3.75 + 0.6\n\n  WRONG, right aligned like whole numbers:\n\n      12.4\n      3.75\n       0.6\n      -----     the columns do not match, so the\n                digits being added are not the\n                same kind of thing\n\n  RIGHT, points aligned and tails filled:\n\n      12.40\n       3.75\n       0.60\n      ------\n      16.75\n\n  Check the tenths column: 4 + 7 + 6 = 17 tenths,\n  which is 1 unit and 7 tenths, so a 1 carries\n  left. That is the same carrying as Month 2.\n\n\n  Subtracting, 20 - 4.35:\n\n      20.00        write 20 as 20.00 so there is\n       4.35        something in every column to\n      ------       borrow from\n      15.65",
        mistake:
          "Right aligning as though the numbers were whole, so that 12.4 + 3.75 comes out as 16.15 or 48.4. The decimal point, not the right hand edge, is what has to line up.",
        drill: {
          skill: "L0-N5.2",
          count: 3,
          intro:
            "Three additions and subtractions. Write the numbers out with the points lined up before calculating anything.",
        },
      },
      {
        id: "a-ma-dc-times-ten",
        title: "Multiplying and dividing by ten, a hundred, a thousand",
        explain:
          "Multiplying by ten moves every digit one column to the left, which looks like the point moving one place right. Dividing by ten moves them one column right. It is the Month 1 rule, still true, now visible in both directions.",
        origin:
          "The separator itself has no agreed symbol, which is worth knowing before you read a figure from an unfamiliar source. The Scottish mathematician John Napier used a point in 1617, and Britain and the countries that learned mathematics from Britain, Nigeria among them, still do. Much of continental Europe, Latin America and francophone Africa use a comma instead, so a price written 3,47 in Paris is three naira forty seven kobo rather than three thousand four hundred and seventy. The international standard for units accepts both and refuses to choose. If a figure ever looks a thousand times out, check which convention wrote it.",
        why: "This is the most used piece of decimal arithmetic there is, and it is needed for converting units, for standard form in Month 5 and for dividing decimals in two atoms' time. It is also where the digits move and the point stays, which is worth saying out loud even though describing it the other way is easier.",
        example:
          "    3.47   x   10  =   34.7\n    3.47   x  100  =  347\n    3.47   x 1000  = 3470      a zero is needed to\n                               fill the units column\n\n    3.47   /   10  =   0.347\n    3.47   /  100  =   0.0347\n    3.47   / 1000  =   0.00347\n\n  Count the zeros, move that many places.\n\n  WHY: multiplying by 10 makes every part ten times\n  bigger, so each digit moves into the next column\n  left. The digits are what move. Saying the point\n  moves is a shortcut for the same event, and it is\n  fine as long as you know which is really happening.",
        mistake:
          "Moving the point the wrong way when dividing. The sense check is immediate: dividing makes a positive number smaller, so 3.47 divided by 10 must be under 3.47. If your answer is 34.7 you have gone the wrong way.",
      },
      {
        id: "a-ma-dc-multiplying",
        title: "Multiplying decimals: ignore the point, then count",
        explain:
          "Multiply as though both numbers were whole. Then count the total number of decimal places in the two numbers you started with, and put that many decimal places in the answer. Nothing has to line up.",
        why: "The method looks like a trick and it is not. It works because moving a point is multiplying or dividing by tens, and whatever you took out at the start you put back at the end. Knowing that is what lets you check it rather than trust it.",
        example:
          "  Work out 0.4 x 0.3\n\n  Ignore the points:   4 x 3 = 12\n  Count the places:    0.4 has 1, 0.3 has 1, total 2\n  Put 2 places in:     0.12\n\n  WHY it works:\n\n    0.4 x 0.3\n  = (4 / 10) x (3 / 10)\n  = (4 x 3) / (10 x 10)\n  = 12 / 100\n  = 0.12\n\n  The two divisions by ten are what the place\n  counting is putting back.\n\n\n  A bigger one, 2.5 x 1.2:\n\n    25 x 12 = 300\n    Places: 1 + 1 = 2\n    Answer: 3.00 = 3\n\n  Sense check: 2.5 x 1.2 should be a bit over 2.5,\n  since 1.2 is a bit over 1. It is.",
        mistake:
          "Lining up the points before multiplying, which is the addition rule used in the wrong place. Also, expecting the answer to be larger: 0.4 x 0.3 is 0.12, much smaller than either, because both multipliers are under 1. That is the Month 3 fraction lesson again.",
      },
      {
        id: "a-ma-dc-dividing",
        title: "Dividing decimals: make the divisor whole",
        explain:
          "To divide by a decimal, multiply both numbers by ten as many times as it takes to make the divisor a whole number. The answer does not change, because multiplying both parts of a division by the same thing leaves the result alone.",
        why: "Dividing by a decimal directly is unpleasant and unnecessary. Turning it into a division by a whole number is the same move as writing a fraction with a tidier denominator, and it rests on the same fact: multiplying top and bottom by the same number does not change the value.",
        example:
          "  Work out 4.8 / 0.6\n\n  The divisor 0.6 has one decimal place, so\n  multiply both by 10:\n\n    4.8 / 0.6  =  48 / 6  =  8\n\n  WHY the answer is unchanged: a division is a\n  fraction, and 4.8/0.6 with top and bottom both\n  multiplied by 10 is 48/6. Same number, easier\n  arithmetic. That is Lesson 33's equivalent\n  fractions doing the work.\n\n\n  Another, 0.35 / 0.7:\n\n    Multiply both by 10:   3.5 / 7  =  0.5\n\n  Sense check: 0.7 is nearly 1, so the answer\n  should be nearly 0.35. It is.\n\n\n  And note what dividing by something under 1 does:\n\n    6 / 0.5  =  60 / 5  =  12\n\n  The answer is LARGER than 6, because you asked\n  how many halves fit into 6.",
        mistake:
          "Multiplying only the number being divided, so that 4.8 / 0.6 becomes 48 / 0.6. Both numbers must be multiplied, or the value changes by a factor of ten.",
      },
      {
        id: "a-ma-dc-estimating",
        title: "Estimate first, then trust the answer",
        explain:
          "Before any decimal calculation, round both numbers to something easy and work out roughly what the answer should be. Then the real answer either agrees with the estimate or it does not, and if it does not the error is almost always a misplaced point.",
        why: "Decimal errors are nearly always factor of ten errors, and a factor of ten is enormous. An estimate catches it instantly, while checking the arithmetic digit by digit usually does not, because the digits are often perfectly correct and only the point is wrong.",
        example:
          "  Work out 19.6 x 4.8\n\n  Estimate first:  20 x 5 = 100\n\n  Now calculate:   196 x 48 = 9408\n                   Places: 1 + 1 = 2\n                   Answer: 94.08\n\n  94.08 is close to 100. Accept it.\n\n  Had the answer come out as 940.8 or 9.408, the\n  estimate would have caught it at once, and both\n  of those come from miscounting the places rather\n  than from any error in 196 x 48.\n\n\n  A money one:\n\n  17 items at 249.50 naira each.\n\n    Estimate: 17 x 250 = 4,250 naira\n    Exact:    17 x 249.5 = 4,241.50 naira\n\n  If a till says 42,415 naira, the estimate tells\n  you to look again before paying.",
        practice: {
          prompt:
            "Estimate 0.48 × 61, then say what the exact answer should be close to and why.",
          answer:
            "0.48 is very nearly a half and 61 is about 60, so the estimate is about 30. The exact answer is 29.28, which agrees. The useful part is that the estimate rules out 2.928 and 292.8 before you do any multiplying, and those two are the answers a misplaced point produces.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l39-fractions-and-decimals",
    moduleId: "ma-m3-decimals",
    sectionId: SECTION_ID,
    order: 3,
    title: "Fractions and Decimals Are the Same Thing",
    subtitle: "Converting both ways, and why one third never finishes",
    estimatedMinutes: 15,
    intro:
      "A fraction and a decimal are two spellings of one number, and you already know why: the fraction bar means divide. What is worth knowing, and almost never taught, is why some fractions give a decimal that stops and others give one that runs on forever. The answer is in Month 2.",

    atoms: [
      {
        id: "a-ma-dc-fraction-to-decimal",
        title: "Fraction to decimal: just divide",
        explain:
          "To turn a fraction into a decimal, divide the top by the bottom. That is not a method to remember, it is what the fraction bar already meant, established in Lesson 33.",
        why: "Conversions are asked constantly, and in commercial arithmetic you often need the decimal form to calculate and the fraction form to state the answer. Doing it by division rather than by memory means you are never stuck on a fraction that is not on the list you learned.",
        example:
          "  3/4 means 3 divided by 4.\n\n      0.75\n    +------\n  4 | 3.00\n      2 8\n      ---\n        20\n        20\n        --\n         0\n\n    3/4 = 0.75\n\n\n  The ones worth knowing by sight:\n\n    1/2  = 0.5        1/4  = 0.25      3/4  = 0.75\n    1/5  = 0.2        2/5  = 0.4       1/10 = 0.1\n    1/8  = 0.125      3/8  = 0.375     1/20 = 0.05\n    1/3  = 0.333...   2/3  = 0.666...\n\n  Knowing these saves time. Knowing that you can\n  always get them by dividing saves marks.",
        drill: {
          skill: "L0-N5.4",
          count: 3,
          intro:
            "Three conversions between fractions and decimals. Divide the top by the bottom, and set the division out rather than guessing.",
        },
      },
      {
        id: "a-ma-dc-decimal-to-fraction",
        title: "Decimal to fraction: read the last column",
        explain:
          "Read the decimal properly and the fraction writes itself. The last column tells you the denominator: one decimal place is tenths, two is hundredths, three is thousandths. Then simplify.",
        why: "This direction is needed whenever a question wants an exact answer, and it is the whole of it: read the columns, write the fraction, cancel. It also explains why 0.5 and 0.50 give the same fraction after simplifying, which confirms that the trailing zero really did not matter.",
        example:
          "  0.35  ends in the hundredths column\n\n          35        7\n    0.35 = ---   =  --     (divide both by 5)\n          100       20\n\n\n  0.6   ends in the tenths column\n\n          6        3\n    0.6 = --   =   -       (divide both by 2)\n         10        5\n\n\n  0.125 ends in the thousandths column\n\n           125       1\n    0.125 = ----  =  -     (divide both by 125)\n           1000      8\n\n\n  A whole part just comes along:\n\n    2.75 = 2 and 75/100 = 2 and 3/4\n\n  Count the decimal places, that is the number of\n  zeros in the bottom. Two places, two zeros: 100.",
        mistake:
          "Writing 0.35 as 35/10 or 3.5/10. The number of zeros on the bottom equals the number of decimal places, and a fraction with a decimal still in it has not finished the job.",
      },
      {
        id: "a-ma-dc-why-recurring",
        title: "Why one third never finishes",
        explain:
          "A fraction gives a decimal that stops only when its bottom, in lowest terms, is built from the primes 2 and 5 and nothing else. Ten is 2 × 5, so tenths, hundredths and thousandths can only ever be cut into halves and fifths. A denominator of 3 or 7 has no way to fit. A decimal that runs on forever with a repeating pattern is called recurring, and one that comes to a stop is called terminating.",
        origin:
          "This is the clearest example in the course of a Month 2 idea answering a Month 3 question. Prime factorisation was introduced as a fact about whole numbers, and here it settles something that otherwise looks like an accident of arithmetic. The Greeks would have found the question strange, since they had no decimal notation at all. It only becomes askable once you have committed to writing every fraction in tenths, and then the primes of ten decide what is possible. It is also why the Babylonians, working in sixties, had an easier time: sixty is 2 x 2 x 3 x 5, so thirds come out neatly, which is why a third of an hour is exactly twenty minutes while a third of a naira is not exactly any number of kobo.",
        why: "Without this, recurring decimals are a list of exceptions to memorise. With it, they are predictable: factorise the bottom, look at the primes, and you know before dividing whether the decimal will stop. It also explains the 0.333... on your calculator, which is a real number and not a rounding failure.",
        example:
          "  Factorise the denominator and look at the primes:\n\n    1/8    8 = 2 x 2 x 2        only 2s     STOPS  0.125\n    1/5    5 = 5                only 5s     STOPS  0.2\n    1/20   20 = 2 x 2 x 5       2s and 5s   STOPS  0.05\n    1/40   40 = 2 x 2 x 2 x 5   2s and 5s   STOPS  0.025\n\n    1/3    3 = 3                a 3!        RUNS ON  0.333...\n    1/6    6 = 2 x 3            a 3!        RUNS ON  0.1666...\n    1/7    7 = 7                a 7!        RUNS ON  0.142857...\n    1/12   12 = 2 x 2 x 3       a 3!        RUNS ON  0.0833...\n\n  LOWEST TERMS matters. 3/6 looks like it has a 3\n  on the bottom, and 3/6 is 1/2, which stops at 0.5.\n  Simplify first, then look.\n\n\n  Notation for a recurring decimal: a dot is placed\n  over the repeating digit, or over the first and\n  last of a repeating block. One third is 0.3 with a\n  dot over the 3. One seventh repeats a block of six\n  digits, 142857, over and over forever.",
        mistake:
          "Writing 1/3 as 0.33 and calling it exact. It is a rounded value, and in a question that asks for an exact answer the fraction 1/3 is the only correct form. Rounding early here is the same error as rounding early anywhere: it throws accuracy away before the calculation is finished.",
      },
      {
        id: "a-ma-dc-three-forms",
        title: "One number, three notations",
        explain:
          "A fraction, a decimal and a percentage are three ways of writing the same quantity. Half, 0.5 and 50 per cent are one number. Which form to use depends on the question, not on which one you prefer. Per cent means out of a hundred, so 50 per cent is 50 out of every 100, which is a half. The next module is built entirely on that one sentence.",
        origin:
          "Per cent is Latin, per centum, meaning by the hundred, and the Romans were already calculating in hundredths for tax. They levied a duty called the centesima rerum venalium, a hundredth part of the value of goods sold at auction, which is a one per cent sales tax under another name. The notation came much later: Italian merchants in the 1400s wrote the phrase per cento, clerks shortened it, and the shorthand eventually collapsed into the % sign. So the reason percentages are hundredths rather than some other convenient number is that tax collectors and merchants found a hundred a comfortable base to reckon in, and the notation followed the habit.",
        why: "This table is the bridge into the next module and it is worth being able to fill in from memory, because commercial arithmetic switches between the three forms constantly and the switching is where the time goes.",
        table: {
          caption: "The conversions worth knowing without working them out.",
          headers: ["Fraction", "Decimal", "Percentage"],
          rows: [
            ["1/2", "0.5", "50%"],
            ["1/4", "0.25", "25%"],
            ["3/4", "0.75", "75%"],
            ["1/5", "0.2", "20%"],
            ["1/10", "0.1", "10%"],
            ["1/8", "0.125", "12.5%"],
            ["1/3", "0.333…", "33.3% to 1 d.p."],
            ["2/3", "0.666…", "66.7% to 1 d.p."],
          ],
          note: "The last two rows are the reason percentages sometimes look untidy. One third is exact as a fraction and cannot be exact as either a decimal or a percentage, so an exam question about thirds will usually ask for a fraction or state a degree of accuracy.",
        },
        mistake:
          "Treating the decimal as the real number and the fraction as a rough version of it. It is the other way round for thirds and sevenths: the fraction is exact and the decimal is the approximation.",
      },
      {
        id: "a-ma-dc-which-form",
        title: "Choosing which form to work in",
        explain:
          "Decimals are easier for comparing, for adding long lists and for anything involving money. Fractions are easier for multiplying, for dividing and for keeping an answer exact. Choose before you start rather than converting halfway through.",
        why: "A great deal of avoidable work comes from starting a calculation in the wrong form. Multiplying 1/3 by 3/4 takes one line as fractions and is impossible to do exactly as decimals, while comparing 0.48 and 0.5 takes a second as decimals and needs a common denominator as fractions.",
        table: {
          caption: "Which form suits which job.",
          headers: ["Task", "Better form", "Why"],
          rows: [
            ["Comparing two quantities", "Decimal", "Read the columns from the left"],
            ["Adding a list of prices", "Decimal", "Money is already decimal"],
            ["Multiplying or dividing", "Fraction", "Cancel first, small numbers, exact"],
            ["Keeping an answer exact", "Fraction", "Thirds and sevenths have no exact decimal"],
            ["A fraction of a quantity", "Fraction", "Divide by the bottom, multiply by the top"],
            ["Reading a measurement off a scale", "Decimal", "Instruments are marked in tenths"],
          ],
        },
        practice: {
          prompt:
            "Work out 1/3 of 4.8 metres. Which form did you use, and what would have gone wrong in the other?",
          answer:
            "Fraction form: 4.8 divided by 3 is 1.6 metres, exactly. Working from 0.333 instead gives 1.5984, which is wrong in the second decimal place and would fail an accuracy instruction. This is the general point: convert a third to a decimal only at the very end, if at all.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l40-money",
    moduleId: "ma-m3-decimals",
    sectionId: SECTION_ID,
    order: 4,
    title: "Naira and Kobo",
    subtitle: "The decimals you handle every day and still lose marks on",
    estimatedMinutes: 14,
    intro:
      "Money is the decimal everybody has already been using for years, and it is still where marks go missing, because a money answer has to be written in a particular way and because the arithmetic has to be exact rather than roughly right.",

    atoms: [
      {
        id: "a-ma-dc-naira-kobo",
        title: "One hundred kobo to the naira",
        explain:
          "A naira is divided into a hundred kobo, so kobo are hundredths of a naira and sit in the second decimal place. A money amount is written with exactly two decimal places when kobo are involved.",
        origin:
          "This is the place value reform from Month 1, seen from the inside. Before 1973, Nigeria used pounds, shillings and pence: twelve pence to a shilling, twenty shillings to a pound. Adding a column of those prices meant carrying at twelve in one column and at twenty in the next, which is why shopkeepers kept ready reckoner books. The naira and kobo replaced it on the first of January 1973 with a hundred kobo to the naira, and the whole point of the change was that money would then carry in tens like every other number. Every method in this lesson is ordinary decimal arithmetic for exactly that reason.",
        why: "Two decimal places is a convention with a reason: it is the smallest unit of money that exists. An answer of 45.5 naira is ambiguous in a way that 45.50 naira is not, and mark schemes expect the second form.",
        example:
          "    1 naira        = 100 kobo\n    0.50 naira     =  50 kobo\n    0.05 naira     =   5 kobo\n    2.75 naira     = 2 naira 75 kobo\n\n  Writing money answers:\n\n    WRITE            NOT\n    45.50 naira      45.5 naira\n    8.00 naira       8 naira, in a money column\n    0.75 naira       .75 naira\n    1,250.00 naira   1250 naira\n\n  Two decimal places, and the comma in thousands,\n  exactly as in Month 1.",
        drill: {
          skill: "L0-N5.3",
          count: 3,
          intro:
            "Three money questions. Write every answer to two decimal places, even when the second one is a zero.",
        },
      },
      {
        id: "a-ma-dc-cost-change",
        title: "Cost and change",
        explain:
          "Total cost is quantity multiplied by unit price, added up across the items. Change is what was handed over minus the total. Both are decimal arithmetic with the point lined up, and both want an estimate first.",
        why: "This is the most common real calculation in anybody's life and it is examined in every paper at this level. The estimate is what catches a factor of ten, which in a money question is the difference between paying four thousand naira and forty thousand.",
        example:
          "  A woman buys:\n\n    3 kg of rice at   1,450.00 each\n    2 tins of milk at   890.50 each\n    1 loaf at           750.00\n\n  Estimate first:  3 x 1,500 = 4,500\n                   2 x 900   = 1,800\n                   1 x 750   =   750\n                   about 7,050 naira\n\n  Exact:\n\n    Rice:  3 x 1,450.00 = 4,350.00\n    Milk:  2 x   890.50 = 1,781.00\n    Loaf:                   750.00\n                         ---------\n    Total:               6,881.00\n\n  Close to the estimate, so accept it.\n\n  She pays with 10,000.00:\n\n    10,000.00\n     6,881.00\n    ---------\n     3,119.00   change\n\n  Check by adding back: 6,881 + 3,119 = 10,000. Yes.",
        mistake:
          "Forgetting to multiply by the quantity, so that three bags of rice are costed as one. Reading the question twice and underlining each quantity is the fix, and it is the same habit the language module asked for in Month 1.",
      },
      {
        id: "a-ma-dc-rounding-money",
        title: "Rounding money, and when not to",
        explain:
          "Money is rounded to the nearest kobo, which is two decimal places. Round only at the end. If a calculation produces 1,333.333 naira, the answer is 1,333.33, and the rounding happens once, after all the arithmetic.",
        origin:
          "Where the leftover kobo goes is a real question with real answers, and commerce settled it long before school mathematics did. Banks and accountants work to fixed rounding rules written into their procedures, because an institution making millions of small roundings in the same direction would quietly gain or lose a great deal of money. The general rule that a calculation is rounded once, at the end, comes from exactly that concern. Every intermediate rounding is a small systematic error, and systematic errors add up rather than cancelling out.",
        why: "Rounding in the middle of a money calculation is where real disagreements come from, and it is marked as an error. It matters most when a quantity is multiplied after being rounded, because the error is multiplied too.",
        example:
          "  Three people share 4,000 naira equally.\n\n  Each share: 4,000 / 3 = 1,333.333...\n\n  ROUNDED AT THE END, correctly:\n\n    Each gets 1,333.33\n    Three shares: 3,999.99\n    One kobo is left over, and a real answer says so.\n\n  ROUNDED EARLY, badly:\n\n    Round each share to 1,333 then multiply by 3\n    = 3,999, and now a whole naira has vanished.\n\n  The exam version of this: if a question involves\n  several steps, carry the full figure through every\n  step and round the final answer only.",
        mistake:
          "Rounding a unit price and then multiplying by a large quantity. Rounding 249.50 to 250 and multiplying by 200 overstates the total by a hundred naira. The instruction is always the same: round once, at the end.",
      },
      {
        id: "a-ma-dc-money-sense",
        title: "Sense checks that cost nothing",
        explain:
          "Three questions catch nearly every money error: is the answer roughly what I estimated, is the change less than what was handed over, and does the answer have two decimal places.",
        why: "Money errors are almost always factor of ten errors or missing kobo, and both are visible to a glance if you know what to glance at. Adding the change back to the total to see whether it returns the amount handed over is a complete check that takes one addition.",
        table: {
          caption: "Three checks, and what each catches.",
          headers: ["Check", "Catches"],
          rows: [
            ["Does it match the estimate?", "A misplaced decimal point, which is a factor of ten"],
            ["Is the change less than what was paid?", "Subtracting the wrong way round"],
            ["Two decimal places?", "A presentation mark, and a dropped kobo"],
            ["Does change plus total return the amount paid?", "Any arithmetic slip in the subtraction"],
          ],
          note: "The last one is the strongest: it is a complete verification rather than a plausibility test, and it needs one addition.",
        },
      },
      {
        id: "a-ma-dc-review",
        title: "Three months, mixed",
        explain:
          "A drill across fractions, decimals, money, factors, directed numbers and the order of operations, with nothing indicating which is which.",
        why: "Percentages come next, and a percentage question can require any of these inside it. Meeting them mixed, after a gap, is the only honest measurement of whether they are available rather than merely familiar.",
        drill: {
          review: [
            "L0-N5.2",
            "L0-N5.4",
            "L1-N3.1",
            "L0-N5.3",
            "L1-N3.2",
            "L0-N2.4",
          ],
          count: 6,
          intro:
            "Six questions from across three months. Decide what each one is asking before you calculate, because that decision is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start percentages",
      intro:
        "Percentages are hundredths, so they lean on this module completely. Check it holds, with a pen and no calculator:",
      prompts: [
        "Put in order, smallest first: 0.7, 0.07, 0.75, 0.705.",
        "Work out 20 - 4.35, and say why 20 should be written as 20.00 first.",
        "Work out 0.6 x 0.05, estimating before you start.",
        "Turn 7/8 into a decimal by division, then say, from the primes of 8, why it was always going to stop.",
        "A trader buys 14 items at 349.50 naira each and pays with 5,000.00. Estimate the change, then work it out exactly.",
      ],
      close:
        "If the fourth one is unfamiliar, go back to it: 8 is 2 x 2 x 2, and a denominator built only from 2s and 5s always gives a decimal that stops. That one fact makes recurring decimals predictable instead of surprising.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
