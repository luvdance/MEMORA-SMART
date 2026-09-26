/**
 * MATHEMATICS · MONTH 3 · MODULE 1 · FRACTIONS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This is the module the whole course was built to get right.
 *
 * Examiners report the same thing every year: candidates in SS3 who can
 * differentiate a function cannot add two fractions. That is not a gap in
 * fractions. It is a gap in what a fraction IS, carried forward for ten years
 * under a layer of procedures.
 *
 * So this module spends its first lesson refusing to calculate anything. A
 * fraction is one number. It has a position on the line, between the whole
 * numbers, and it answers a question about division. Every rule that follows
 * is then a consequence rather than an instruction, and the two rules this
 * course holds itself to still apply:
 *
 *   NOTHING BEFORE ITS TIME. Nothing here uses algebra, indices beyond the
 *   place value work of Month 1, or decimals, which arrive in the next module.
 *   Fractions are built out of Month 2 and nothing later.
 *
 *   EVERY IDEA HAS A CAUSE. Fractions came from dividing loaves among workers
 *   and land among heirs. The bar is a Moroccan invention of the 1100s. The
 *   words numerator and denominator are Latin and they say exactly what each
 *   number does. Sixty minutes in an hour is a fraction decision made in
 *   Babylon four thousand years ago and never reversed.
 */

export const SECTION_ID = "ma-s3-fractions";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l33-what-is-a-fraction",
    moduleId: "ma-m3-fractions",
    sectionId: SECTION_ID,
    order: 1,
    title: "What a Fraction Actually Is",
    subtitle: "One number, three meanings, and no arithmetic at all",
    estimatedMinutes: 15,
    intro:
      "Nothing is calculated in this lesson. Most of the trouble people have with fractions for the rest of their lives starts with treating 3/4 as two numbers that happen to be stacked up. It is one number. It sits between 0 and 1. Until that is solid, every rule feels arbitrary, and rules that feel arbitrary are the ones that get misremembered.",

    atoms: [
      {
        id: "a-ma-fr-picture",
        title: "A fraction starts as a picture",
        explain:
          "Take something whole. Cut it into equal parts. A fraction says how many of those parts you have. The bottom number says how many equal parts the whole was cut into, and the top number counts how many of them you are holding.",
        origin:
          "Fractions were not invented by mathematicians thinking about numbers. They were invented by people dividing things up, and we can watch it happen. The Rhind papyrus, copied in Egypt around 1650 before the common era from an older document, contains problems about sharing loaves of bread and jugs of beer among a fixed number of workers, because that was a daily administrative task and getting it wrong caused arguments. Egyptian scribes wrote nearly every fraction as a sum of parts with 1 on top: instead of 3/4 they would write a half plus a quarter. It is a clumsy system to calculate with and it tells you where the idea came from, which is a knife and a loaf.",
        why: "Every fraction rule in this module can be checked against the picture, and the picture never lies. A student who can draw the question can usually see whether an answer is possible before working it out.",
        example:
          "  One whole, cut into 4 equal parts:\n\n    +-----+-----+-----+-----+\n    |     |     |     |     |\n    +-----+-----+-----+-----+\n\n  Take 3 of them:\n\n    +-----+-----+-----+-----+\n    | XXX | XXX | XXX |     |\n    +-----+-----+-----+-----+\n\n    three parts out of four  =  3/4\n\n  The word EQUAL is doing real work there. This:\n\n    +--+--------+--+--------+\n    |  |        |  |        |\n    +--+--------+--+--------+\n\n  is four parts and it is not quarters, because the parts are\n  not the same size. Fractions require equal parts.",
        mistake:
          "Shading three parts of an unequally divided shape and calling it three quarters. If the parts are not equal, the fraction does not describe them, and questions in later modules will sometimes offer exactly that picture to see whether you notice.",
        drill: {
          skill: "L0-N4.1",
          count: 3,
          intro:
            "Three questions on reading a fraction off a picture. Count the total parts first, then the shaded ones, in that order.",
        },
      },
      {
        id: "a-ma-fr-names",
        title: "Numerator and denominator, and why those words",
        explain:
          "The bottom number is the denominator and the top number is the numerator. The two words are not decoration: denominator comes from the Latin for the one that names, and numerator from the one that counts. The bottom names what kind of piece you have, and the top counts how many you have got.",
        origin:
          "The words came into English through Latin translations of Arabic mathematics in the middle ages, and the choice of words was careful. Naming and counting really are two different jobs, and the split explains something students otherwise find strange. In 3/5, the 5 is not a quantity of anything. It is the name of the piece: fifths. The 3 is the only number in the fraction that counts.",
        why: "This single distinction settles the commonest confusion in the module. Fifths and sevenths are different KINDS of thing, like naira and kobo, so they cannot be added until one is rewritten as the other. It is not an arbitrary rule about finding common denominators, it is the same reason you cannot add 3 goats to 4 buckets and get 7 of anything.",
        table: {
          caption: "Reading a fraction out loud, in both directions.",
          headers: ["Fraction", "The bottom names", "The top counts", "Read as"],
          rows: [
            ["3/4", "quarters", "3 of them", "three quarters"],
            ["5/8", "eighths", "5 of them", "five eighths"],
            ["2/3", "thirds", "2 of them", "two thirds"],
            ["7/10", "tenths", "7 of them", "seven tenths"],
            ["9/4", "quarters", "9 of them", "nine quarters, which is more than one whole"],
          ],
          note: "Read the last row again. Nothing stops the top number being larger than the bottom. Nine quarters is a perfectly ordinary number, and it has a name of its own that arrives in Lesson 35.",
        },
        analogy:
          "The denominator is the unit and the numerator is the amount, exactly as in 3 kobo or 3 kilometres. Nobody is puzzled that you cannot add 3 kobo to 4 kilometres. Fifths and sevenths are in the same position.",
      },
      {
        id: "a-ma-fr-on-the-line",
        title: "A fraction is one number, with a position",
        explain:
          "Every fraction has a place on the number line, between the whole numbers. It is not a pair of numbers and it is not an unfinished sum. It is a single number, as much a number as 7 is, and it sits somewhere definite.",
        origin:
          "The Greeks are the reason this needed saying. They thought of fractions as ratios between whole numbers, relationships rather than quantities, and their number line contained only the whole numbers. Treating 3/4 as a number in its own right, with an address on the line, came later, and it was resisted for the same reason negatives were: it looked like a made up object. The idea that a fraction has a POSITION rather than being a comparison is what makes ordinary arithmetic with them possible.",
        why: "This is the single most important atom in the module. Once a fraction has a position, comparing two of them is asking which is further right, adding them is combining two lengths, and an answer that comes out bigger than 1 when it plainly should not is visibly wrong. Students who never get this picture spend years applying rules they cannot check.",
        example:
          "  0        1/4      1/2      3/4        1\n  +---------+---------+---------+---------+\n\n  3/4 is a place, not an instruction.\n\n\n  And the line does not stop at 1:\n\n  0    1/2    1    3/2    2    5/2    3\n  +-----+-----+-----+-----+-----+-----+\n\n  5/2 sits halfway between 2 and 3, because it is\n  five halves, and four halves already made 2.\n\n  Notice what the picture tells you for free:\n  every fraction with a bigger top than bottom is\n  past 1, and every fraction with a smaller top is\n  before it. That is a check you can run in a second.",
        mistake:
          "Reading 3/4 as an instruction that is waiting to be carried out, and therefore feeling that it is not a proper answer. In an exam, 3/4 is usually a better answer than 0.75, because it is exact and it is what the question asked for.",
      },
      {
        id: "a-ma-fr-as-division",
        title: "A fraction is also a division",
        explain:
          "3/4 means 3 divided by 4. The bar and the division sign are the same instruction. This is not a second, separate meaning of the fraction: cutting 3 whole things into 4 equal shares gives each share exactly 3/4 of one thing, so the picture and the division describe the same situation.",
        origin:
          "Writing a division with one number above another, separated by a horizontal bar, was introduced by the Moroccan mathematician al-Hassar in the twelfth century, and Fibonacci brought the notation into Europe in his book of 1202. Before that a division had to be written out in words, or with the two numbers side by side, which made it impossible to write a fraction inside a larger calculation. The bar is doing two jobs at once: it says divide, and it holds the two numbers together as one object so the whole thing can be moved around as a single quantity. That is most of why it won.",
        why: "You were told in Month 2 that the fraction bar and the division sign mean the same thing, and here is where the promise is kept. It matters because it is the bridge to the next module: 3 ÷ 4 on a calculator gives 0.75, and that is why 3/4 and 0.75 are the same number written two ways.",
        example:
          "  Share 3 loaves equally among 4 people.\n\n  Cut every loaf into quarters:  3 loaves = 12 quarters\n  Share the quarters out:        12 / 4 = 3 quarters each\n\n  So each person gets 3/4 of a loaf,\n  and 3 divided by 4 is 3/4.\n\n  The picture and the division are the same event,\n  described from two sides.\n\n\n  This also explains something that looks like a coincidence:\n\n    8/8 = 8 divided by 8 = 1\n    5/1 = 5 divided by 1 = 5\n    0/7 = 0 divided by 7 = 0\n    7/0 = 7 divided by 0 = undefined, no such number\n\n  You do not have to remember those four. They follow from\n  what the bar means.",
        mistake:
          "Writing 7/0 and treating it as a very large number. There is no number there at all, for the reason given in Month 2: nothing multiplied by 0 gives 7. A zero on the bottom of a fraction means the fraction does not exist.",
      },
      {
        id: "a-ma-fr-equivalent",
        title: "Different fractions, same number",
        explain:
          "1/2, 2/4, 3/6 and 50/100 are all the same number. They sit at exactly the same point on the line. Cutting the whole into more pieces and taking proportionally more of them does not change how much you have.",
        origin:
          "This is the fact that made fractions usable, and the reason is worth stating plainly: without it, adding two fractions would be impossible. Every method in the next lesson works by rewriting both fractions with the same name, and that is only allowed because rewriting does not change the value. The Babylonians got at this from the other end. Their number system worked in sixties rather than tens, and sixty was chosen because it can be divided exactly by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30, which means most everyday fractions have a tidy sixtieths form. That choice is still in your life: an hour has sixty minutes and a circle has three hundred and sixty degrees because a base with many factors makes fractions come out neatly.",
        why: "Every simplification, every common denominator and every conversion in this month is this one fact being used. It is also the reason a marker accepts 2/4 and 1/2 as the same answer, while usually asking for the simplest form.",
        example:
          "  Multiply top and bottom by the same number:\n\n    1     1 x 2     2\n    -  =  -----  =  -\n    2     2 x 2     4\n\n    1     1 x 3     3          1     1 x 50     50\n    -  =  -----  =  -          -  =  ------  =  ---\n    2     2 x 3     6          2     2 x 50     100\n\n  On the line, all four are the same point:\n\n    0              1/2               1\n    +---------------+---------------+\n    0              2/4               1\n    +-------+-------+-------+-------+\n\n  WHY it works: multiplying top and bottom by 2 is\n  multiplying the fraction by 2/2, and 2/2 is 1.\n  Multiplying by 1 changes nothing. That is the identity\n  element from Month 2, doing a job.",
        mistake:
          "Multiplying only the top, or only the bottom. 1/2 and 2/2 are not the same number: one is a half and the other is a whole. Whatever you do to one, you must do to the other, and the reason is that only then are you multiplying by 1.",
        drill: {
          skill: "L0-N4.2",
          count: 3,
          intro:
            "Three equivalent fraction questions. Ask yourself what the bottom was multiplied or divided by, then do the same to the top.",
        },
      },
      {
        id: "a-ma-fr-lowest-terms",
        title: "Lowest terms, using the HCF from Month 2",
        explain:
          "A fraction is in its lowest terms when the top and bottom share no factor except 1. To get there, divide both by their highest common factor. That is the same HCF you found in Month 2, doing the job it was really for.",
        origin:
          "Euclid's method for the highest common factor, which you met last month, is still the fastest way to reduce a fraction, and it is one of the oldest algorithms in use anywhere. Notice what has happened: a technique introduced in Month 2 as a fact about whole numbers turns out to be the tool this module needs. That is how the subject is built, and it is why the course keeps insisting nothing is a dead end.",
        why: "Simplest form is asked for constantly, and it is marked. It also makes everything afterwards easier, because small numbers are easier to compare, to add and to check. A candidate who leaves 24/36 when the answer is 2/3 has usually done all the mathematics and lost the last mark.",
        example:
          "  Simplify 24/36.\n\n  SLOW WAY, cancelling in steps:\n\n    24     12     6     2\n    --  =  --  =  -  =  -\n    36     18     9     3\n\n  Three rounds of dividing by 2, 2 and 3.\n\n\n  FAST WAY, using the HCF:\n\n    HCF of 24 and 36 is 12\n\n    24 / 12     2\n    -------  =  -\n    36 / 12     3\n\n  One step. Both routes are correct and the second is\n  the one that finishes inside the time you have.\n\n\n  How do you know 2/3 is finished? 2 and 3 share no\n  factor except 1, so there is nothing left to cancel.",
        mistake:
          "Cancelling across an addition. In something like (4 + 6)/2 you may not cancel the 4 with the 2, because the bar divides the WHOLE top by 2. Only a factor of the entire numerator can be cancelled, and Month 6 will punish this habit repeatedly if it survives.",
        practice: {
          prompt:
            "Simplify 45/60 in one step, and say how you knew you had finished.",
          answer:
            "The HCF of 45 and 60 is 15, so divide both by 15 to get 3/4. It is finished because 3 and 4 have no common factor but 1. If you had cancelled by 5 first you would have reached 9/12, which is correct and not finished, and a further division by 3 gets to the same place.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l34-compare-add",
    moduleId: "ma-m3-fractions",
    sectionId: SECTION_ID,
    order: 2,
    title: "Comparing, Adding and Subtracting",
    subtitle: "Why a common denominator is not a rule but a necessity",
    estimatedMinutes: 16,
    intro:
      "Two fractions with the same bottom number are easy to handle, because they are the same kind of thing and you only have to count. Everything in this lesson is a way of getting two awkward fractions into that easy situation first.",

    atoms: [
      {
        id: "a-ma-fr-same-bottom",
        title: "Same denominator, just count",
        explain:
          "When two fractions already have the same bottom number, add or subtract the top numbers and leave the bottom alone. Three eighths plus two eighths is five eighths, in the same way that three kobo plus two kobo is five kobo.",
        why: "Starting here makes the rest of the lesson obvious rather than mysterious. The bottom is a name, and adding does not change what kind of thing you have, only how many of them there are. Students who learn the hard case first often add the bottoms as well, which the easy case shows immediately to be nonsense.",
        example:
          "    3     2     5\n    -  +  -  =  -\n    8     8     8\n\n  In the picture:\n\n    +--+--+--+--+--+--+--+--+\n    |XX|XX|XX|  |  |  |  |  |   3 eighths\n    +--+--+--+--+--+--+--+--+\n\n    +--+--+--+--+--+--+--+--+\n    |XX|XX|XX|OO|OO|  |  |  |   and 2 more eighths\n    +--+--+--+--+--+--+--+--+\n\n    5 of the 8 parts are now taken:  5/8\n\n\n  The bottom did NOT become 16. The pieces did not\n  change size when you took more of them.",
        mistake:
          "Adding the denominators as well, giving 3/8 + 2/8 = 5/16. Check it against the picture: 5/16 is less than a third, and you just put together more than half a bar. The size of the piece is a name, and names do not add.",
      },
      {
        id: "a-ma-fr-comparing",
        title: "Comparing two fractions",
        explain:
          "If the bottoms match, the bigger top is the bigger fraction. If the tops match, the bigger BOTTOM is the smaller fraction, because cutting a whole into more pieces makes each piece smaller. If neither matches, rewrite them with a common bottom and then compare.",
        why: "Ordering fractions is asked directly, and it is also the fastest sanity check there is on any fraction answer. If you are asked to add two fractions and your total is smaller than one of them, something has gone wrong and you can see it without redoing the work.",
        table: {
          caption: "Three comparisons, three reasons.",
          headers: ["Compare", "Which is larger", "Because"],
          rows: [
            ["3/7 and 5/7", "5/7", "Same sized pieces, more of them"],
            ["1/4 and 1/9", "1/4", "Fewer cuts, so each piece is bigger"],
            ["2/3 and 3/5", "2/3", "As tenths of a whole: 10/15 against 9/15"],
            ["4/5 and 5/6", "5/6", "Both are one piece short of a whole, and a sixth is a smaller shortfall than a fifth"],
          ],
          note: "The last row is worth keeping. When two fractions are each one piece short of 1, the one with the smaller piece missing is the larger. It saves a common denominator in a common case.",
        },
        example:
          "  Which is larger, 2/3 or 3/5?\n\n  Rewrite both over 15, because 15 is in both\n  the 3 times table and the 5 times table:\n\n    2     2 x 5     10\n    -  =  -----  =  --\n    3     3 x 5     15\n\n    3     3 x 3      9\n    -  =  -----  =  --\n    5     5 x 3     15\n\n  10 fifteenths beats 9 fifteenths, so 2/3 is larger.\n\n  Sense check on the line: 2/3 is a little past the\n  middle and 3/5 is a little past the middle, and 2/3\n  is further past. The arithmetic agrees.",
        mistake:
          "Deciding that 1/9 is bigger than 1/4 because 9 is bigger than 4. The bottom number counts the CUTS, and more cuts mean smaller pieces. This is the fraction version of the −18 and −3 error from last month: reading digits instead of reading position.",
        drill: {
          skill: "L0-N4.3",
          count: 3,
          intro:
            "Three comparisons. Decide first whether the tops match, the bottoms match, or neither, because that decides which method you need.",
        },
      },
      {
        id: "a-ma-fr-common-denominator",
        title: "Finding a common denominator with the LCM",
        explain:
          "To add or subtract fractions with different bottoms, rewrite both with the same bottom. Any common multiple works, and the lowest common multiple keeps the numbers smallest. That is the LCM from Month 2.",
        origin:
          "This is the second Month 2 technique that turns out to have been built for this module. The HCF simplifies a fraction and the LCM combines two, and neither was introduced with fractions mentioned. It is worth noticing how often that happens in mathematics: a tool is developed because it is interesting, and its real use turns up two topics later. Euclid studied factors and multiples for their own sake, without decimal notation and without algebra, and both of his tools are load bearing here.",
        why: "This is the step where most marks in the module are lost, and almost never because the addition is hard. It is lost because the two fractions were never made the same kind of thing first.",
        example:
          "  Work out 2/3 + 1/4.\n\n  STEP 1  Find the LCM of 3 and 4.\n          Multiples of 3:  3, 6, 9, 12\n          Multiples of 4:  4, 8, 12\n          LCM = 12\n\n  STEP 2  Rewrite both over 12.\n          2/3 = 8/12   (top and bottom x 4)\n          1/4 = 3/12   (top and bottom x 3)\n\n  STEP 3  Now the bottoms match, so count.\n          8/12 + 3/12 = 11/12\n\n  STEP 4  Simplify if you can. 11 and 12 share no\n          factor, so 11/12 is finished.\n\n  Sense check: both fractions were under 1 and the\n  total is just under 1. That is plausible. An answer\n  of 3/7 would not have been.",
        mistake:
          "Multiplying the two bottoms together every time instead of finding the LCM. It always gives a correct answer, and for 1/6 + 1/8 it gives forty eighths where twenty fourths would do, which means larger numbers to handle and a heavier simplification at the end. It is not wrong. It is just more work, done under time pressure.",
        drill: {
          skill: "L1-N3.1",
          count: 3,
          intro:
            "Three additions and subtractions with unlike bottoms. Write the LCM down before you write anything else.",
        },
      },
      {
        id: "a-ma-fr-subtracting",
        title: "Subtracting, and borrowing across a whole",
        explain:
          "Subtracting works exactly as adding does: common bottom first, then take the tops. The one case that needs care is when the first top is too small, which is dealt with by taking one whole apart into pieces of the right kind. An improper fraction is one whose top number is bigger than its bottom, such as 11/4, so it is worth more than one whole. The next atom deals with them properly.",
        why: "This is where fractions meet the carrying and borrowing of Month 2, and where a student who is shaky on one of the two topics will look shaky on both. The move is the same one you make when subtracting 47 from 132: break a larger unit down into smaller ones so that there is enough to take from.",
        example:
          "  Work out 3 1/4 - 1 2/3.\n\n  STEP 1  Common bottom for the fraction parts.\n          LCM of 4 and 3 is 12.\n          3 1/4 = 3 and 3/12\n          1 2/3 = 1 and 8/12\n\n  STEP 2  3/12 is not enough to take 8/12 from,\n          so break one whole into twelfths:\n\n          3 and 3/12  =  2 and 15/12\n                          (one whole became 12/12)\n\n  STEP 3  Now subtract the parts separately.\n          Wholes:     2 - 1 = 1\n          Twelfths:   15/12 - 8/12 = 7/12\n\n          Answer: 1 and 7/12\n\n  Sense check: a bit over 3 take away a bit under 2\n  should be a bit over 1. It is.",
        mistake:
          "Subtracting the smaller top from the larger to avoid the borrow, so that 3/12 - 8/12 is written as 5/12. That reverses the question in the middle of the working. If the top is too small, either borrow a whole or work the whole thing out as improper fractions, and do not quietly swap the order.",
      },
      {
        id: "a-ma-fr-mixed-improper",
        title: "Mixed numbers and improper fractions",
        explain:
          "A mixed number such as 2 3/4 is a whole number and a fraction written side by side, and it means added together. An improper fraction such as 11/4 is the same quantity written entirely in quarters. They are two spellings of one number, and each is convenient for a different job.",
        why: "Which form to use is a genuine decision rather than a preference. Multiplying and dividing need improper fractions, because the method works on tops and bottoms. Reading a quantity out loud, and most final answers, want mixed numbers, because nobody asks for eleven quarters of sugar.",
        example:
          "  Mixed to improper: how many quarters in 2 3/4?\n\n    2 wholes = 8 quarters,  plus 3 quarters = 11 quarters\n\n    2 3/4  =  11/4\n\n  Shortcut: bottom x whole, then add the top.\n            4 x 2 = 8, plus 3 = 11, over 4.\n\n\n  Improper to mixed: how many wholes in 17/5?\n\n    17 / 5 = 3 remainder 2\n\n    So 3 wholes and 2 fifths:   17/5 = 3 2/5\n\n  The division from Month 2 is doing the work, and the\n  remainder becomes the top of the fraction part.\n\n\n  On the line:\n\n    2        2 1/4    2 1/2    2 3/4      3\n    +---------+---------+---------+---------+\n    8/4      9/4      10/4     11/4      12/4\n\n  Both labels name the same points.",
        mistake:
          "Reading 2 3/4 as 2 multiplied by 3/4. The space between them means added, which is the one place in all of mathematics where two things written next to each other are not multiplied. It is an inconsistency in the notation rather than a rule you failed to learn, and knowing that it is odd is the best defence against it.",
        drill: {
          skill: "L1-N3.3",
          count: 3,
          intro:
            "Three conversions between mixed numbers and improper fractions. Say which direction you are going before you start.",
        },
      },
      {
        id: "a-ma-fr-adding-mixed",
        title: "Adding mixed numbers, both routes",
        explain:
          "There are two correct methods. Either convert both to improper fractions, add, and convert back, or add the whole parts and the fraction parts separately and then tidy up. The first is more reliable and the second is quicker when the numbers are small.",
        why: "Knowing both matters because they fail in different places. Separate parts goes wrong when the fraction parts add to more than 1 and the extra whole is forgotten. Improper fractions goes wrong when the numbers get large enough to make an arithmetic slip likely. Choosing deliberately is better than always doing the same thing.",
        example:
          "  Work out 1 2/3 + 2 1/2.\n\n  ROUTE A, improper fractions:\n\n    1 2/3 = 5/3      2 1/2 = 5/2\n    LCM of 3 and 2 is 6\n    5/3 = 10/6       5/2 = 15/6\n    10/6 + 15/6 = 25/6\n    25 / 6 = 4 remainder 1,  so 4 1/6\n\n  ROUTE B, parts separately:\n\n    Wholes:     1 + 2 = 3\n    Fractions:  2/3 + 1/2 = 4/6 + 3/6 = 7/6\n    7/6 is more than one whole: 7/6 = 1 1/6\n    So 3 + 1 1/6 = 4 1/6\n\n  Same answer. Route B's danger is stopping at\n  '3 and 7/6', which is not a tidy answer and in\n  some mark schemes is not a complete one.",
        practice: {
          prompt:
            "Work out 2 3/4 + 1 5/6 by whichever route you prefer, then check the answer is plausible without redoing it.",
          answer:
            "As improper fractions: 11/4 + 11/6, over the LCM 12, is 33/12 + 22/12 = 55/12, which is 4 remainder 7, so 4 7/12. The plausibility check: a bit under 3 plus a bit under 2 should be a bit over 4, and 4 7/12 is a bit over 4. If you had got 3 something or 5 something, one of the steps went wrong.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l35-multiply-divide-fractions",
    moduleId: "ma-m3-fractions",
    sectionId: SECTION_ID,
    order: 3,
    title: "Multiplying and Dividing Fractions",
    subtitle: "The easy one, the surprising one, and why turning it upside down works",
    estimatedMinutes: 16,
    intro:
      "Here is an oddity worth naming at the start. Multiplying fractions is easier than adding them, which is the opposite of how whole numbers behave. And dividing them is the one rule in school mathematics most people can carry out and almost nobody can explain. By the end of this lesson you will be able to explain it.",

    atoms: [
      {
        id: "a-ma-fr-multiplying",
        title: "Multiplying: tops together, bottoms together",
        explain:
          "To multiply two fractions, multiply the tops to get the new top and the bottoms to get the new bottom. No common denominator is needed, because you are not combining two quantities of the same kind, you are taking a part of a part.",
        origin:
          "The reason no common bottom is needed is visible in the picture, and it is the same rectangle argument that proved the distributive law in Month 2. Two thirds OF three quarters means cutting a rectangle both ways: three quarters across, two thirds down. The number of little cells you end up holding is the tops multiplied, and the number of cells in the whole rectangle is the bottoms multiplied. The rule is a description of the picture rather than a convention.",
        why: "Multiplying is the fraction operation that appears most often in the rest of the course, because a fraction of a quantity, a percentage, a scale factor and a probability are all multiplications. Getting it automatic pays for itself many times over.",
        example:
          "  Work out 2/3 x 3/4.\n\n    2     3     2 x 3      6      1\n    -  x  -  =  -----  =  --  =  -\n    3     4     3 x 4     12      2\n\n  WHY, in a picture. Take a rectangle.\n  Cut it into 4 columns and shade 3 of them (3/4):\n\n    +---+---+---+---+\n    |XXX|XXX|XXX|   |\n    +---+---+---+---+\n\n  Now cut it into 3 rows and take 2 of them:\n\n    +---+---+---+---+\n    |###|###|###|   |   <- taken\n    +---+---+---+---+\n    |###|###|###|   |   <- taken\n    +---+---+---+---+\n    |XXX|XXX|XXX|   |\n    +---+---+---+---+\n\n  The whole rectangle holds 3 x 4 = 12 cells.\n  You are holding 2 x 3 = 6 of them.\n  6 out of 12, which is one half.\n\n  The rule IS the picture: bottoms count the cells in\n  the whole, tops count the cells you took.",
        mistake:
          "Looking for a common denominator before multiplying. It is not needed and it is not wrong, only wasteful: it gives the right answer after more work and a larger simplification. Common bottoms are for adding and subtracting only.",
      },
      {
        id: "a-ma-fr-cancel-first",
        title: "Cancel before you multiply",
        explain:
          "Any top may be cancelled against any bottom before multiplying, whichever fraction each belongs to. Doing it first keeps the numbers small and usually leaves nothing to simplify at the end.",
        why: "This is a time saver and an accuracy saver. Multiplying first and simplifying afterwards means finding the HCF of two larger numbers, and it is where arithmetic slips creep in under exam pressure.",
        example:
          "  Work out 4/9 x 3/8.\n\n  WITHOUT cancelling:\n\n    4 x 3     12      1\n    -----  =  --  =   -      (HCF of 12 and 72 is 12)\n    9 x 8     72      6\n\n  WITH cancelling first:\n\n    4     3\n    -  x  -      4 and 8 share 4:   4 -> 1,  8 -> 2\n    9     8      3 and 9 share 3:   3 -> 1,  9 -> 3\n\n    1     1     1 x 1     1\n    -  x  -  =  -----  =  -\n    3     2     3 x 2     6\n\n  Same answer, and every number stayed in single digits.\n\n  Note WHY this is legal: cancelling a 4 from a top and\n  a bottom is dividing the whole product by 4 and then\n  multiplying it by 4, which is multiplying by 1.",
        mistake:
          "Cancelling two tops against each other, or two bottoms against each other. Cancelling only works between a top and a bottom, because that is what divides the product and then restores it. Two tops cancelled together genuinely changes the value.",
        drill: {
          skill: "L1-N3.2",
          count: 3,
          intro:
            "Three multiplications and divisions of fractions. Look for a cancellation before you multiply anything out.",
        },
      },
      {
        id: "a-ma-fr-of-a-quantity",
        title: "Of means multiply",
        explain:
          "Two thirds of 45 means 2/3 multiplied by 45. The word of, sitting between a fraction and a quantity, is an instruction to multiply, and it is the form most real questions take.",
        why: "This is the atom that connects fractions to money, to measurement and to every percentage question in the next module. It is also where a useful order of work matters: dividing by the bottom first and then multiplying by the top keeps the numbers small and can usually be done in your head.",
        example:
          "  Find 2/3 of 45.\n\n  ROUTE A, divide then multiply:\n\n    45 / 3 = 15        one third\n    15 x 2 = 30        two thirds\n\n  ROUTE B, multiply then divide:\n\n    45 x 2 = 90\n    90 / 3 = 30\n\n  Both give 30, and Route A keeps the numbers smaller,\n  which matters when there is no calculator.\n\n\n  A real one:\n\n  A trader has 3/5 of a 60 kg sack left.\n  How much is that?\n\n    60 / 5 = 12        one fifth\n    12 x 3 = 36        three fifths\n\n    36 kg, and the unit is part of the answer.",
        mistake:
          "Dividing by the top and multiplying by the bottom, which turns two thirds of 45 into 67.5. The sense check catches it instantly: two thirds of something must be LESS than the thing. An answer larger than what you started with is wrong before you check any arithmetic.",
        drill: {
          skill: "L0-N4.4",
          count: 3,
          intro:
            "Three questions on a fraction of a quantity. Divide by the bottom first, then multiply by the top.",
        },
      },
      {
        id: "a-ma-fr-multiply-smaller",
        title: "Why multiplying can make a number smaller",
        explain:
          "Multiplying by a number below 1 gives an answer smaller than what you started with. That is not a special rule for fractions, it is what multiplying has always meant: multiplying by 3 gives three of them, and multiplying by 1/2 gives half of one of them.",
        why: "Most people carry an unspoken belief that multiplying makes things bigger and dividing makes them smaller, because for whole numbers above 1 it always did. That belief quietly breaks here, and if it is never named it goes on causing wrong answers in percentages, scale factors and probability for years.",
        table: {
          caption: "What the multiplier does.",
          headers: ["Multiply 20 by", "Answer", "Because the multiplier is"],
          rows: [
            ["3", "60", "More than 1, so the answer grows"],
            ["1", "20", "Exactly 1, the identity, so nothing changes"],
            ["1/2", "10", "Less than 1, so the answer shrinks"],
            ["1/4", "5", "Less again, so it shrinks further"],
            ["3/4", "15", "Just under 1, so it shrinks just a little"],
          ],
          note: "Dividing behaves in the mirror image way. Dividing 20 by 1/2 gives 40, because you are asking how many halves fit into 20, and the answer is more than 20. That is the next atom.",
        },
        mistake:
          "Rejecting a correct answer because it looks too small. If a question asks for 3/8 of a quantity, the answer SHOULD be well under half of it. Expecting multiplication to increase things is a habit from whole numbers, not a rule.",
      },
      {
        id: "a-ma-fr-reciprocal",
        title: "The reciprocal, properly this time",
        explain:
          "The reciprocal of a fraction is that fraction turned upside down. The reciprocal of 3/4 is 4/3, and of 5 is 1/5, since 5 is 5/1. A number multiplied by its reciprocal always gives exactly 1.",
        origin:
          "You met this in Month 2 as the multiplying twin of changing a sign, with the arithmetic left until fractions were in place. Here it is. The word reciprocal comes from the Latin for moving backwards and forwards, which is a fair description of turning something over, and the property that matters is the one that was promised then: every number except zero has a partner that multiplies with it to give 1. Zero still does not, and that is still why dividing by zero has no answer.",
        why: "Everything in the next atom depends on this. Dividing by a number is the same as multiplying by its reciprocal, and that single sentence covers dividing by whole numbers, by fractions and later by algebraic expressions.",
        example:
          "  Number      Reciprocal      Check\n\n    3/4          4/3           3/4 x 4/3 = 12/12 = 1\n    5  = 5/1     1/5           5 x 1/5 = 5/5 = 1\n    1/8          8/1 = 8       1/8 x 8 = 8/8 = 1\n    2 1/2 = 5/2  2/5           5/2 x 2/5 = 10/10 = 1\n    1            1             1 x 1 = 1\n    0            none          0 x anything = 0, never 1\n\n  Note the fourth row: a mixed number has to become\n  improper BEFORE it is turned over. Turning over\n  2 1/2 as written gives nothing meaningful.",
        mistake:
          "Turning over a mixed number without converting it first. The reciprocal of 2 1/2 is 2/5, not 2 2/1 or anything of that shape. Convert, then flip.",
      },
      {
        id: "a-ma-fr-dividing",
        title: "Dividing: why you turn the second one over",
        explain:
          "To divide by a fraction, multiply by its reciprocal. The reason is what division asks: a ÷ b means how many bs fit into a. Asking how many quarters fit into 3 is asking how many times 1/4 goes into 3, and since each whole holds 4 quarters, the answer is 3 × 4.",
        origin:
          "The rule is stated plainly in Indian mathematics: the ninth century mathematician Mahavira writes that to divide by a fraction you invert it and multiply. It is worth knowing that it was stated as a rule that early, and worth knowing that the reason is not hard, because invert and multiply is the single most widely memorised and least widely understood instruction in school mathematics. Somebody who can say WHY has an advantage that lasts, since the same move reappears in algebraic fractions in Month 6.",
        why: "Division by a fraction turns up in real questions constantly: how many quarter litre cups from a 3 litre jug, how many three quarter metre lengths from a roll. Getting the direction of the flip right is the whole difficulty, and understanding the question it asks makes the direction obvious.",
        example:
          "  How many quarters fit into 3?\n\n    +----+----+----+----+\n    |    |    |    |    |   whole 1: four quarters\n    +----+----+----+----+\n    |    |    |    |    |   whole 2: four quarters\n    +----+----+----+----+\n    |    |    |    |    |   whole 3: four quarters\n    +----+----+----+----+\n\n    Count them: 12.\n\n    3 / (1/4)  =  3 x 4  =  12\n\n  Dividing by a quarter MULTIPLIED by 4. That is what\n  dividing by something smaller than 1 does, and the\n  picture shows why it has to.\n\n\n  The general case, 2/3 divided by 4/5:\n\n    2     4     2     5     10\n    -  /  -  =  -  x  -  =  --\n    3     5     3     4     12\n\n                        =  5/6   after cancelling\n\n  FIRST fraction stays. SECOND one flips. The order\n  matters, because division is not commutative, as\n  Month 2 established.\n\n\n  A real one:\n\n  A tailor has 6 metres of cloth and each shirt needs\n  3/4 of a metre. How many shirts?\n\n    6 / (3/4) = 6 x 4/3 = 24/3 = 8 shirts\n\n  Sense check: each shirt needs less than a metre, so\n  6 metres must make MORE than 6 shirts. It does.",
        mistake:
          "Flipping the first fraction instead of the second, or flipping both. Only the one you are dividing BY gets turned over. If you are unsure which, fall back on the question: how many of the second fit into the first? Then the sense check tells you whether the answer should be larger or smaller than what you started with.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l36-fractions-in-use",
    moduleId: "ma-m3-fractions",
    sectionId: SECTION_ID,
    order: 4,
    title: "Fractions in Use",
    subtitle: "Bar models, word problems, and the five errors that survive into SS3",
    estimatedMinutes: 15,
    intro:
      "Examiners report the same thing every year: candidates who can differentiate cannot add two fractions. That is not a gap in fractions, it is a gap carried for ten years under a layer of later procedures. This lesson is about making sure it is not carried out of here.",

    atoms: [
      {
        id: "a-ma-fr-bar-models",
        title: "Draw the bar",
        explain:
          "A bar model is a rectangle standing for the whole quantity, divided into the parts the question describes. It turns a word problem into a picture, and once the picture is drawn the arithmetic is usually obvious.",
        why: "Most fraction word problems are not hard arithmetic. They are hard reading. A bar model separates the two difficulties, so you solve the reading first with a pencil and then do arithmetic you can already do. This is the method Singapore built its curriculum on, and it works at every level from here to simultaneous equations.",
        example:
          "  A man spends 1/3 of his salary on rent and 1/4 on\n  food. What fraction is left?\n\n  Draw the whole salary as a bar, cut into twelfths,\n  because 12 is the LCM of 3 and 4:\n\n    +--+--+--+--+--+--+--+--+--+--+--+--+\n    |R |R |R |R |F |F |F |  |  |  |  |  |\n    +--+--+--+--+--+--+--+--+--+--+--+--+\n     \\____rent___/ \\__food_/ \\___left___/\n         4/12         3/12       5/12\n\n    Rent: 1/3 = 4/12      Food: 1/4 = 3/12\n    Spent: 7/12           Left: 5/12\n\n  The picture also answers questions the text did not\n  ask. If the salary were 60,000 naira, each twelfth is\n  5,000, so 25,000 is left. Nothing extra to work out.",
        drill: {
          skill: "L1-N3.4",
          count: 3,
          intro:
            "Three word problems. Draw the bar before you calculate anything, even when you think you can see the answer.",
        },
      },
      {
        id: "a-ma-fr-of-what",
        title: "A fraction of WHAT?",
        explain:
          "A fraction on its own is not a quantity. It is always a fraction of something, and in a word problem with more than one stage, the something changes. Half of what is left is not the same as half of what there was.",
        why: "This is the single commonest reason a fraction word problem goes wrong, and it is a reading error rather than an arithmetic one. Two students can do identical correct arithmetic and get different answers because they took their fractions of different wholes.",
        example:
          "  A trader sells 1/2 of her stock in the morning and\n  1/3 of THE REMAINDER in the afternoon. What fraction\n  of the original stock is left?\n\n  WRONG:  1/2 + 1/3 = 5/6 sold, so 1/6 left.\n          This takes both fractions of the original.\n\n  RIGHT:  Morning:   1/2 sold, so 1/2 remains.\n          Afternoon: 1/3 of that half\n                     = 1/3 x 1/2 = 1/6 of the original.\n          Sold in total: 1/2 + 1/6 = 3/6 + 1/6 = 4/6 = 2/3\n          Left: 1/3.\n\n  The words 'of the remainder' changed the whole. Every\n  such phrase is a signal to stop and ask: a fraction\n  of what, exactly?",
        mistake:
          "Adding the two fractions as though both applied to the original amount. Underline the phrase that says what each fraction is of, before you calculate. In an exam that underlining takes three seconds and it is the difference between full marks and none.",
      },
      {
        id: "a-ma-fr-back-to-whole",
        title: "Working backwards to the whole",
        explain:
          "Some questions give you a part and ask for the whole. If 3/5 of a length is 24 metres, then one fifth is 24 divided by 3, which is 8, and the whole is 8 times 5, which is 40. Find one part first, then build up.",
        why: "This is the reverse of a fraction of a quantity, and it is asked often enough to be worth practising separately. It is also the shape of every reverse percentage question in the next module, where a price after a discount is given and the original is wanted.",
        example:
          "  3/5 of a length is 24 m. Find the whole length.\n\n    3 fifths  = 24 m\n    1 fifth   = 24 / 3 = 8 m\n    5 fifths  = 8 x 5  = 40 m\n\n  Check forwards: 3/5 of 40 is 40/5 x 3 = 8 x 3 = 24. Yes.\n\n\n  Another shape of the same question:\n\n  After spending 2/3 of her money, a woman has 1,500\n  naira left. How much did she start with?\n\n    Spent 2/3, so what is left is 1/3.\n    1/3 = 1,500\n    3/3 = 1,500 x 3 = 4,500 naira\n\n  The trap here is using the 2/3 that the question\n  mentions. The 1,500 is the OTHER third, and reading\n  which part the number belongs to is the whole task.",
        practice: {
          prompt:
            "A tank is 2/7 full and holds 40 litres at that level. What is the capacity of the tank when full?",
          answer:
            "Two sevenths is 40 litres, so one seventh is 20 litres, and seven sevenths is 140 litres. Check forwards: 2/7 of 140 is 140 divided by 7, which is 20, times 2, which is 40. The check is worth doing because this is the question type where an answer can look reasonable and be wrong.",
        },
      },
      {
        id: "a-ma-fr-sense-checks",
        title: "Four checks that cost a second each",
        explain:
          "Before writing a fraction answer down, four quick questions catch most errors: is it in lowest terms, is it the right side of 1, is it larger or smaller than what I started with as it should be, and does it answer what was asked.",
        why: "Fraction errors are usually invisible, because a wrong fraction looks exactly as respectable as a right one. Unlike a sign error there is nothing odd about the appearance of 5/16 when the answer was 5/8. These four checks are what replace the feeling that something is wrong.",
        table: {
          caption: "Four checks, and what each one catches.",
          headers: ["Check", "Catches"],
          rows: [
            ["Is it simplified?", "The lost final mark, which is the commonest single loss in the module"],
            ["Is it the right side of 1?", "A top and bottom written the wrong way round"],
            ["Bigger or smaller than I started with?", "Multiplying where you should divide, or flipping the wrong fraction"],
            ["Does it answer the question?", "A fraction of the remainder given when the question asked about the original"],
          ],
          note: "The third check is the strongest of the four. Multiplying by something under 1 must shrink a quantity and dividing by it must grow it, and an answer on the wrong side of that is wrong no matter how neat the working looks.",
        },
      },
      {
        id: "a-ma-fr-errors",
        title: "The five errors that reach SS3",
        explain:
          "Five specific mistakes account for nearly all lost fraction marks, and every one of them is a rule half remembered rather than a lapse in care.",
        why: "Naming your own error is more useful than resolving to be careful. Most people make one or two of these far more often than the rest, and once you know which, the check becomes specific, and specific checks actually get carried out.",
        table: {
          caption: "Five errors, what each looks like, and the fix.",
          headers: ["Error", "Looks like", "The fix"],
          rows: [
            ["Adding the bottoms", "3/8 + 2/8 = 5/16", "The bottom is a NAME. Names do not add"],
            ["No common bottom", "1/2 + 1/3 = 2/5", "Different pieces cannot be counted together"],
            ["Flipping the wrong one", "2/3 / 4/5 = 3/2 x 4/5", "Only the one you divide BY flips"],
            ["Cancelling across a plus", "(4 + 6)/2 with the 4 cancelled", "Only a factor of the WHOLE top cancels"],
            ["Not simplifying", "24/36 left as it stands", "Ask if the top and bottom share a factor"],
          ],
          note: "The second one is the one examiners report most often in senior scripts, which is why this module put the reason ahead of the method. A student who knows the bottom is a name does not need to remember a rule about common denominators.",
        },
        practice: {
          prompt:
            "Look back at any marked fraction work you have. Which of the five is yours, and what is the specific check that would have caught it?",
          answer:
            "Most people find one of the five accounts for the large majority of their fraction errors. The value of naming it is that a general intention to be careful is not a method, while one specific question asked at one specific moment is.",
        },
      },
      {
        id: "a-ma-fr-review",
        title: "Everything so far, mixed",
        explain:
          "A drill across all three months: place value, the four operations, BODMAS, factors, directed numbers and the fraction work of this module, with nothing to tell you which is which.",
        why: "The next module carries place value to the right of the decimal point and then converts between fractions and decimals, so it leans on this module and on Month 1 at the same time. Mixed work after a gap is the only honest test of whether either is actually there.",
        drill: {
          review: [
            "L1-N3.1",
            "L0-N4.3",
            "L1-N3.2",
            "L1-N2.3",
            "L1-N6.2",
            "L0-N2.4",
          ],
          count: 6,
          intro:
            "Six questions from across three months. Work out what each one is asking before you start, because that decision is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start decimals",
      intro:
        "The next module is decimals, which are fractions with the bottom hidden. Check the fraction work is solid first, with a pen and no calculator:",
      prompts: [
        "Work out 2/3 + 3/4 - 1/2, giving the answer in lowest terms.",
        "Work out 2 1/4 x 1 1/3, converting to improper fractions first.",
        "A roll holds 9 metres of cloth and each bag needs 2/3 of a metre. How many bags, and why must the answer be more than 9?",
        "A man gives 1/4 of his money to one child and 1/3 of the remainder to another. What fraction does he still have?",
        "Simplify 42/56 in one step, and say what you divided by and how you knew.",
      ],
      close:
        "If the third one gave an answer under 9, the flip went the wrong way. If the fourth gave 5/12 left, both fractions were taken of the original when the second was of the remainder. Both are worth going back for now rather than in Month 9.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
