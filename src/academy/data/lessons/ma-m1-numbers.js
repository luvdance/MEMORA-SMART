/**
 * MATHEMATICS · MONTH 1 · MODULE 3 · WHAT KINDS OF NUMBERS THERE ARE
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Almost nobody is taught this, and almost every later confusion in the
 * subject traces back to it.
 *
 * Students meet counting numbers in primary school, then negatives, then
 * fractions, then decimals, then square roots, and each one arrives as an
 * unrelated new topic with its own rules. They are not unrelated. They are
 * one system, built outwards in stages, each stage added because the previous
 * one could not answer a question people needed answered.
 *
 * Told as a single story, the rules stop being arbitrary. Why you cannot
 * divide by zero, why a negative times a negative is positive, why pi never
 * ends, why 0.999... equals 1: these are all questions about what kind of
 * number you are dealing with, and they are much easier to hold once the map
 * exists.
 */

export const SECTION_ID = "ma-s1-numbers";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l9-counting",
    moduleId: "ma-m1-numbers",
    sectionId: SECTION_ID,
    order: 1,
    title: "Counting, and the First Numbers",
    subtitle: "Where number begins, and the long argument about zero",
    estimatedMinutes: 14,
    intro:
      "Numbers began as a way of answering one question: how many. Everything else in this module is something that had to be added later, because that first kind of number could not answer a question somebody needed answering.",

    atoms: [
      {
        id: "a-ma-n-counting",
        title: "Counting numbers, the ones we started with",
        explain:
          "1, 2, 3, 4, 5 and onwards forever. These are the counting numbers, also called the natural numbers. They answer the question how many, and they are the oldest mathematical idea there is.",
        origin:
          "Counting is older than writing, older than farming, older than cities. The oldest mathematical objects we have are notched bones from Africa: the Lebombo bone from the mountains between Eswatini and South Africa, about thirty five thousand years old, and the Ishango bone from near Lake Edward in the Democratic Republic of the Congo, about twenty thousand years old. Somebody cut marks into bone to keep a record of a quantity. Numbers had no names written down yet, and counting was already happening.",
        why: "Everything else in this lesson exists because these ran out. You cannot count a debt, you cannot count half a loaf, and you cannot count the length of the diagonal of a square. Each of those needed a new kind of number, and each one was resisted when it arrived.",
        table: {
          caption: "What counting numbers can and cannot do.",
          headers: ["Question", "Answerable with counting numbers?"],
          rows: [
            ["How many goats are in the pen?", "Yes"],
            ["How many students passed?", "Yes"],
            ["How much cloth is left?", "Not if it is part of a metre"],
            ["What is the balance if I owe more than I have?", "No"],
            ["How long is the diagonal of a square?", "No, as Lesson 12 shows"],
          ],
        },
        analogy:
          "Counting numbers are the first tool anyone made. A hammer is enormously useful and there is still a reason people later invented the saw.",
      },
      {
        id: "a-ma-n-zero",
        title: "Zero, the number that took centuries",
        explain:
          "Zero is a number, and it is also a place holder. As a number it answers how many when the answer is none. As a place holder it is what keeps the 4 in 4,006 standing in the thousands column.",
        origin:
          "Zero was the hardest number to accept, and it arrived twice. As a place holder, a mark meaning this column is empty, it was used in Babylon and independently by the Maya. As a NUMBER in its own right, with rules for calculating with it, it was set out by the Indian mathematician Brahmagupta in the year 628. His book gave rules for adding and subtracting zero, and he also tried to divide by it, which is the one place he went wrong. The idea travelled west through the work of Al-Khwarizmi around 820 and reached Europe with Fibonacci in 1202, where merchants adopted it long before universities did. Some Italian cities banned the new numerals for a time, on the grounds that a zero was too easy to alter into a six or a nine.",
        why: "Zero is a genuinely difficult idea and it was resisted for a very long time. Counting numbers describe things that are there; zero describes the absence of them, which is a different kind of claim. The Romans had no symbol for it, and that is a large part of why Roman numerals were hopeless for arithmetic. A numeral is simply a written symbol for a number, so I, V and X are Roman numerals in the same way that 1, 5 and 10 are ours.",
        example:
          "  Zero doing two different jobs:\n\n  As a number:      There are 0 students absent today.\n                    It answers how many.\n\n  As a place holder:  4,006\n                    It says there are no hundreds and no tens,\n                    which is what keeps the 4 in the thousands\n                    column. Remove it and you get 46.\n\n  The same symbol. Two jobs. Both essential.",
        mistake:
          "Treating zero as nothing, and therefore as not really a number. 0 is a number with a definite position on the number line and definite behaviour: adding it changes nothing, multiplying by it destroys everything, and dividing by it is not allowed at all.",
      },
      {
        id: "a-ma-n-whole",
        title: "Whole numbers, and the words people argue about",
        explain:
          "Whole numbers are the counting numbers together with zero: 0, 1, 2, 3 and onwards. Different textbooks use natural numbers to mean with zero or without it, so a question that depends on the difference will say which it means.",
        origin:
          "The symbols themselves have a route you can trace. The digits 0 to 9 were developed in India, carried into the Arab world where Al-Khwarizmi wrote the book that spread them, and brought to Europe from there, which is why they are called Hindu and Arabic numerals. Al-Khwarizmi's own name, passing through Latin, became the word algorithm. The letter Z used for the integers comes from Zahlen, the German word for numbers, and the letter N used for the natural numbers comes straight from natural.",
        why: "Two things are worth knowing here. First, the terms are not perfectly standard, so read the question rather than assuming. Second, and more useful, none of these sets contains a fraction or a negative, which is precisely why the next two lessons exist.",
        table: {
          caption: "The names, and what each one includes.",
          headers: ["Name", "Contains", "Symbol"],
          rows: [
            ["Counting or natural numbers", "1, 2, 3, ...", "N"],
            ["Whole numbers", "0, 1, 2, 3, ...", "W"],
            ["Integers", "..., -2, -1, 0, 1, 2, ...", "Z"],
          ],
          note: "Z comes from Zahlen, the German word for numbers. Examiners use these symbols from SS1 onwards.",
        },
      },
      {
        id: "a-ma-n-even-odd",
        title: "Even and odd",
        explain:
          "An even number can be shared into two equal whole parts with nothing left over. An odd number cannot. Every whole number is one or the other, and zero is even.",
        origin:
          "Sorting numbers into even and odd is one of the oldest classifications in mathematics. The followers of Pythagoras, in Greece around two and a half thousand years ago, divided numbers into kinds and attached meanings to them, treating even and odd as opposites in the same way as light and dark. Most of what they believed about numbers has not survived. The habit of classifying them, so that you can say something true about a whole kind at once, is the part that did.",
        why: "Even and odd is the first classification most people meet, and it is the simplest example of a very powerful habit: sorting numbers into kinds so that you can say something true about a whole kind at once. Odd and even also behave predictably under the operations, which is useful for checking answers.",
        table: {
          caption: "How they behave, which is worth knowing as a check.",
          headers: ["Calculation", "Result", "Example"],
          rows: [
            ["even + even", "even", "4 + 6 = 10"],
            ["odd + odd", "even", "5 + 7 = 12"],
            ["even + odd", "odd", "4 + 7 = 11"],
            ["even x anything", "even", "4 x 7 = 28"],
            ["odd x odd", "odd", "5 x 7 = 35"],
          ],
          note: "If you multiply two odd numbers and get an even answer, you have made an arithmetic slip. It is a free check.",
        },
        practice: {
          prompt: "Is zero even or odd, and how would you argue it?",
          answer:
            "Even. It can be shared into two equal whole parts with nothing left over, since 0 divided by 2 is 0 exactly. It also fits the pattern: the numbers alternate odd, even, odd, even in both directions, and zero sits between the odd numbers 1 and minus 1.",
        },
      },
      {
        id: "a-ma-n-what-is-number",
        title: "What a number actually is, and three jobs it does",
        explain:
          "A number can be a quantity, telling you how much. It can be a position, telling you where something sits in an order. It can also be a label, carrying no quantity at all.",
        why: "Confusing the three causes real errors. Shirt number 10 plus shirt number 7 is not shirt number 17, because those are labels. A phone number is a label. But a mark of 10 plus a mark of 7 is a mark of 17, because those are quantities. Knowing which kind you are holding tells you which operations are meaningful.",
        table: {
          caption: "Three jobs, and what you may do with each.",
          headers: ["Job", "Example", "Can you add them?"],
          rows: [
            ["Quantity", "12 litres of fuel", "Yes"],
            ["Position", "Finished 3rd in the race", "No, but you can order them"],
            ["Label", "Bus number 27", "No"],
          ],
          note: "This distinction comes back in Month 8, where adding averages of averages goes wrong for exactly this reason.",
        },
        mistake:
          "Doing arithmetic on labels because they are written as numerals. A number written down does not always mean an amount.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l10-integers",
    moduleId: "ma-m1-numbers",
    sectionId: SECTION_ID,
    order: 2,
    title: "Below Zero",
    subtitle: "Why negative numbers had to be invented",
    estimatedMinutes: 13,
    intro:
      "For most of history, negative numbers were considered absurd. You cannot have minus three goats. They were accepted in the end for one reason: people needed to record debt, and a system that cannot record a debt is not much use to anyone who trades.",

    atoms: [
      {
        id: "a-ma-n-why-negatives",
        title: "The question counting numbers could not answer",
        explain:
          "Take 5 from 3. With counting numbers there is no answer, so for centuries the question was simply declared meaningless. But a trader who has 3,000 naira and owes 5,000 has a real position, and it needs a number.",
        origin:
          "Negative numbers were in use in China two thousand years ago. The Nine Chapters on the Mathematical Art describes counting rods of two colours, one colour for what is owed and another for what is held, and gives rules for combining them. In India, Brahmagupta wrote the rules for positives and negatives in 628 explicitly in terms of fortunes and debts. Europe held out far longer. As late as the seventeenth century, respected mathematicians called them absurd numbers and refused to accept an answer below zero as an answer at all. What eventually settled the argument was not philosophy but accounting: a system of numbers that cannot record a debt is no use to anybody who trades.",
        why: "This is how mathematics grows: a question that matters turns out to have no answer inside the current system, so the system is extended until it does. Negatives, fractions and irrational numbers all arrived that way, and each was resisted before it was accepted.",
        table: {
          caption: "Places a negative is the only sensible answer.",
          headers: ["Situation", "What the negative means"],
          rows: [
            ["A bank balance of -12,500", "Overdrawn by 12,500"],
            ["A temperature of -4 degrees", "Four below freezing"],
            ["An altitude of -30 m", "Thirty metres below sea level"],
            ["A profit of -8,000", "A loss of 8,000"],
            ["A change of -15%", "A fall of 15%"],
          ],
          note: "In every case the minus sign is carrying a direction, not a mistake.",
        },
      },
      {
        id: "a-ma-n-integers",
        title: "Integers: the whole numbers in both directions",
        explain:
          "The integers are the whole numbers together with their negatives: ..., -3, -2, -1, 0, 1, 2, 3, ... They extend forever in both directions, and zero sits in the middle belonging to neither side.",
        origin:
          "Drawing numbers as points on a line, running in both directions through zero, was proposed by the English mathematician John Wallis in 1685, precisely to make sense of negative numbers for people who were still refusing them. His argument was geometric: if walking forward is positive then walking backward past the starting point is negative, and there is nothing mysterious about it. The number line is one of the most useful pictures in mathematics and it is younger than most people assume.",
        why: "Once you have integers, subtraction always has an answer. That is the technical reason the set was worth inventing: it closes a gap. Inside counting numbers, 3 minus 5 has no answer. Inside integers it has exactly one.",
        example:
          "  Think of the floors of a tall building.\n\n        3rd floor        3\n        2nd floor        2\n        1st floor        1\n        GROUND           0\n        car park 1      -1\n        car park 2      -2\n\n  Laid on a line instead of stacked:\n\n   <--+----+----+----+----+----+----+-->\n     -3   -2   -1    0    1    2    3\n\n  Ground is not upstairs and not downstairs.\n  It is the floor the others are counted from.\n\n  In the same way, zero is not positive and\n  not negative. It is the point both\n  directions are measured from.\n\n  Nobody is confused by car park 2, and that\n  is a negative number being used easily.",
        analogy:
          "A lift in a tall building. The ground floor is zero, the floors above are positive, the car parks below are negative. Nobody finds floor minus two confusing, and it is exactly the same idea.",
      },
      {
        id: "a-ma-n-ordering",
        title: "Ordering negatives, where intuition goes wrong",
        explain:
          "Minus eighteen is smaller than minus three, even though 18 is bigger than 3. On the number line, further left always means smaller, and minus eighteen is further left.",
        why: "This is the first place where reading the digits instead of the position gives the wrong answer, and it is the source of a great many sign errors later. Debt makes it obvious: owing 18,000 is a worse position than owing 3,000, so it is the smaller balance.",
        example:
          "  Three traders and what is in their accounts:\n\n    Ada      ₦3 in credit         3\n    Bola     owes ₦10           -10\n    Chidi    owes ₦18           -18\n\n  Who is worst off? Chidi, who owes the most.\n  So -18 is the SMALLEST of the three.\n\n  On the line:\n\n   <--+-----+-----+-----+-----+-----+-->\n    -18   -10    -3     0     3    10\n\n  Reading left to right, smallest first:\n\n    -18  <  -10  <  -3  <  0  <  3  <  10\n\n  Every negative is below every positive.\n\n  And among the negatives, the bigger the\n  digits the WORSE off you are, so the smaller\n  the number. Owing ₦18 is worse than owing\n  ₦10, even though 18 looks like more.",
        mistake:
          "Ordering by the size of the digits and ignoring the signs. It gives the right answer for positives and exactly the wrong answer for negatives.",
      },
      {
        id: "a-ma-n-opposite",
        title: "Opposites, and distance from zero",
        explain:
          "Every number has an opposite: the number the same distance from zero on the other side. The opposite of 7 is -7, and the opposite of -7 is 7. The distance itself, ignoring direction, is called the absolute value.",
        why: "Opposites are what make subtraction work as movement, and they are the reason subtracting a negative adds. They also matter in Month 2, where the additive inverse is one of the properties that lets algebra work at all.",
        example:
          "  You owe a trader ₦7. Then you pay ₦7.\n\n    owing ₦7     is   -7\n    paying ₦7    is   +7\n    you now owe       0\n\n  The two cancel exactly. That is what makes\n  them opposites.\n\n  On the line:\n\n   <--+-----+-----+-----+-----+-----+-->\n     -7          0           7\n      |<--- 7 --->|<--- 7 --->|\n\n  Both are 7 steps from zero, in opposite\n  directions.\n\n  So adding a number to its opposite always\n  gives zero:\n\n    7 + (-7) = 0      and      -7 + 7 = 0",
        practice: {
          prompt: "Which is further from zero, -9 or 4, and which is the larger number?",
          answer:
            "Minus 9 is further from zero, because it is 9 units away and 4 is only 4 units away. But 4 is the larger number, because it sits further right on the line. Distance from zero and size are two different questions, and negatives are where they come apart.",
        },
      },
      {
        id: "a-ma-n-integers-use",
        title: "Where integers show up in the rest of the course",
        explain:
          "Integers are not a topic that ends. They run through solving equations, coordinates, gradients, temperature and finance problems, and every place a quantity can go down as well as up.",
        why: "Month 2 spends a whole module on calculating with them, because sign errors are the single most common source of lost marks in algebra. Securing the idea here, as positions on a line, is what makes those rules feel reasonable rather than arbitrary.",
        table: {
          caption: "Where a negative will turn up later.",
          headers: ["Topic", "How negatives appear", "Month"],
          rows: [
            ["Directed number arithmetic", "The sign rules themselves", "2"],
            ["Solving equations", "Solutions below zero", "4 and 6"],
            ["Coordinates", "The other three quadrants", "5"],
            ["Gradients", "A line sloping downwards", "5 and 8"],
            ["Quadratics", "Roots that are negative", "7"],
            ["Calculus", "A rate of change that is falling", "9"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l11-rationals",
    moduleId: "ma-m1-numbers",
    sectionId: SECTION_ID,
    order: 3,
    title: "Between the Whole Numbers",
    subtitle: "Fractions, decimals, and why they are the same thing",
    estimatedMinutes: 14,
    intro:
      "Integers are spaced out. Between 3 and 4 there is nothing at all, which is fine for counting goats and useless for measuring cloth. This lesson is about the numbers that fill the gaps, and about the single most useful fact in the whole of Month 3.",

    atoms: [
      {
        id: "a-ma-n-why-fractions",
        title: "The question integers could not answer",
        explain:
          "Share three loaves among four people. With integers there is no answer, because the sharing does not come out whole. Fractions were invented to answer exactly this, and they are far older than negatives.",
        origin:
          "Fractions are far older than negative numbers, because sharing is older than trade. The Rhind papyrus, copied out by an Egyptian scribe named Ahmes around 1650 before the common era from a document older still, is full of them. It works out how to divide loaves of bread and jugs of beer among a given number of workers. The Egyptians wrote almost everything as unit fractions, meaning fractions with a one on top, so two thirds was written as a half plus a sixth. It was awkward and it worked, and it shows that the problem being solved was a practical one: paying a workforce fairly.",
        why: "Fractions come from two everyday needs: sharing something into equal parts, and measuring something that does not come out to a whole number of units. Every fraction question in the course is one of those two situations, which is worth remembering when a worded problem looks unfamiliar.",
        example:
          "  Three loaves shared among four people.\n\n    Cut each loaf into four:   12 quarters\n    Share them out:            3 quarters each\n\n  Each person gets 3/4 of a loaf.\n\n  And notice what that sharing actually was:\n\n    3 loaves divided by 4 people  =  3 / 4\n\n  The fraction IS the division. This is the fact the whole of\n  Month 3 rests on.",
        analogy:
          "A tailor never works in whole metres, a cook never works in whole bags, and a carpenter never works in whole planks. The gaps between the integers are where most real measurement lives.",
      },
      {
        id: "a-ma-n-rational",
        title: "Rational numbers: anything you can write as a fraction",
        explain:
          "A rational number is any number that can be written as one integer over another, with the bottom not zero. That includes every fraction, every integer, and every decimal that stops or repeats.",
        why: "The word rational has nothing to do with being sensible. It comes from ratio: a rational number is one that can be expressed as a ratio of two integers. Knowing that makes the term stop being mysterious.",
        example:
          "  All of these are rational:\n\n     3/4        a fraction, obviously\n     7          = 7/1, so every integer is rational too\n    -2/5        negatives count\n     0.25       = 1/4\n     0.333...   = 1/3, a repeating decimal\n     2.5        = 5/2\n\n  The test is always the same: can it be written as one whole\n  number over another?",
        mistake:
          "Thinking fractions and integers are separate kinds of number. Every integer is a fraction with 1 underneath, which is why the rules for fractions never contradict the rules for whole numbers.",
      },
      {
        id: "a-ma-n-decimals",
        title: "Decimals are a second notation for the same numbers",
        explain:
          "A decimal is not a different kind of number from a fraction. It is the same number written with place value carried on past the units column: tenths, hundredths, thousandths.",
        origin:
          "Writing fractions as decimals, using a point and place value carried past the units, was described by the Arab mathematician al-Uqlidisi in Damascus around the year 952. It reached a wide audience in Europe through a short book by the Flemish engineer Simon Stevin in 1585, who argued that decimals should replace fractions entirely because they made commercial arithmetic so much faster. He was half right. Decimals took over for money and measurement, and fractions kept the work where exactness matters.",
        why: "Students often treat fractions and decimals as two unrelated topics with two sets of rules. They are one topic with two notations, and each notation is convenient for different things. Fractions are exact and easy to simplify; decimals are easy to compare and to add.",
        table: {
          caption: "The same values, written twice.",
          headers: ["Fraction", "Decimal", "Which is easier for what"],
          rows: [
            ["1/2", "0.5", "Either"],
            ["1/4", "0.25", "Either"],
            ["1/3", "0.333...", "The fraction, because the decimal never ends"],
            ["3/8", "0.375", "Decimal to compare, fraction to simplify"],
            ["22/7", "3.142857...", "The fraction, for exactness"],
          ],
        },
        practice: {
          prompt: "Which is larger, 0.8 or 0.75, and why do people get this wrong?",
          answer:
            "0.8 is larger. People get it wrong because 75 looks bigger than 8, but the digits are in different columns. Writing 0.8 as 0.80 makes the comparison obvious: 80 hundredths against 75 hundredths.",
        },
      },
      {
        id: "a-ma-n-terminating",
        title: "Decimals that stop, and decimals that repeat",
        explain:
          "Turn a fraction into a decimal and one of two things happens. Either it stops, like 3/8 = 0.375, or it falls into a repeating pattern, like 1/3 = 0.333... A rational number always does one or the other.",
        why: "This is the test that separates rational from irrational in the next lesson. If a decimal stops or repeats, the number can be written as a fraction. If it runs forever with no repeating pattern, it cannot, and that turns out to be a much stranger kind of number.",
        example:
          "  Dividing the top by the bottom:\n\n    1/8  = 0.125          stops\n    3/4  = 0.75           stops\n    1/3  = 0.3333...      repeats, one digit\n    1/7  = 0.142857142857...  repeats, six digits\n    2/11 = 0.181818...    repeats, two digits\n\n  Every one of them either stops or repeats. That is not a\n  coincidence and it is not luck; it is what being rational means.",
        mistake:
          "Writing 1/3 as 0.33 and treating it as exact. 0.33 is close and it is not equal, and rounding it early is the premature rounding that costs accuracy marks later.",
      },
      {
        id: "a-ma-n-density",
        title: "There is always another number in between",
        explain:
          "Between any two different numbers, however close, there is always another one. Between 0.1 and 0.2 sits 0.15. Between 0.1 and 0.11 sits 0.105. This never runs out.",
        why: "This is the deep difference between the counting numbers and the rationals. Counting numbers have gaps and a clear next one; after 7 comes 8. Rationals have no gaps and no next one, which is why measurement can be as precise as your instrument allows.",
        example:
          "  Find a number between 0.4 and 0.5:\n\n    0.45\n\n  Now between 0.4 and 0.45:\n\n    0.425\n\n  Now between 0.4 and 0.425:\n\n    0.4125\n\n  You can keep going forever. There is no next number after 0.4.\n\n  An easy method: average the two. Halfway between any two\n  numbers is always between them.",
        practice: {
          prompt:
            "Name a number between 7 and 8. Then name one between 7 and the number you just gave.",
          answer:
            "7.5 works for the first, and 7.2 or 7.25 for the second. Whatever you choose, the same move is always available: pick a point part of the way along. Between the counting numbers 7 and 8 there is no whole number at all, and between them as points on the line there are endlessly many numbers. That difference is what this atom is about.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l12-reals",
    moduleId: "ma-m1-numbers",
    sectionId: SECTION_ID,
    order: 4,
    title: "The Numbers That Are Not Fractions",
    subtitle: "Root two, pi, and the whole family tree",
    estimatedMinutes: 14,
    intro:
      "The Greeks believed every number could be written as a ratio of two whole numbers. Then somebody proved that the diagonal of a square cannot be. The story of what happened next is worth knowing, and the fact itself is one you will use from Month 7 onwards.",

    atoms: [
      {
        id: "a-ma-n-root-two",
        title: "The number that broke the Pythagoreans",
        explain:
          "Take a square whose sides are each 1 unit long, and draw the line from one corner to the opposite corner. That line has a definite length. It turns out to be the number which, multiplied by itself, gives exactly 2. And that number cannot be written as one whole number over another, no matter how large you allow the two numbers to be.",
        origin:
          "The discovery is credited to Hippasus, a follower of Pythagoras, some time around the fifth century before the common era. The Pythagoreans had built an entire philosophy on the belief that everything could be expressed as a ratio of whole numbers, and Hippasus showed that the diagonal of a square cannot be. There is a legend that he was drowned at sea for it. The legend is almost certainly not true and it has survived for two and a half thousand years because it captures something real: this was not a minor technical result, it broke the picture of the world those men were working from.",
        why: "This was not a small discovery. The Pythagoreans had built a whole philosophy on the idea that every quantity could be written as one whole number over another, and here was a length anyone could draw with a ruler that could not be. It is the moment mathematics found out that its own number system was incomplete.",
        example:
          "  A square, each side 1 unit:\n\n      +-----------+\n      |          /|\n      |        /  |\n    1 |      /    |\n      |    /      |\n      |  /        |\n      +-----------+\n            1\n\n  The corner to corner line is longer than 1 and shorter\n  than 2. You can measure it and get about 1.4.\n\n  Measure more carefully and you get 1.41.\n  More carefully still, 1.414. Then 1.4142.\n\n  It never settles. The digits run on forever with no\n  repeating pattern, and no fraction of two whole numbers\n  is ever exactly equal to it.\n\n  Month 8 shows how the Greeks worked out its length without\n  measuring anything. For now, the point is only that the\n  line exists and the number system had no name for it.",
        analogy:
          "You draw a line you can see and measure, and then discover that the number system you were using has no name for its length. The line was not the problem.",
      },
      {
        id: "a-ma-n-irrational",
        title: "Irrational numbers",
        explain:
          "An irrational number is one that cannot be written as a fraction of two whole numbers. Its decimal runs on forever and never falls into a repeating pattern. Pi is one, and so is the length across the corner of that square.",
        why: "Irrational is another word that sounds like a judgement and is not. It means not a ratio, exactly as rational means expressible as a ratio. These numbers are perfectly well behaved and they simply cannot be written in that one particular form. The easiest one to meet is pi, because finding it needs nothing but a division: measure all the way round any circle, measure straight across it, and divide the first by the second. You always get the same number, and that number never ends.",
        table: {
          caption: "The irrational numbers you will actually meet.",
          headers: ["Number", "Roughly", "Where it comes from"],
          rows: [
            ["Pi", "3.14159265...", "All the way round a circle, divided by straight across it"],
            ["The one from the square", "1.41421356...", "Corner to corner across a square of side 1"],
            ["Another from a triangle", "1.73205080...", "A height inside an equal sided triangle"],
            ["e", "2.71828182...", "Growth and compound interest, met in Month 9"],
          ],
          note: "Not every awkward looking number is irrational. Most of the numbers you meet in this course are perfectly ordinary fractions.",
        },
        mistake:
          "Writing pi as 22/7 and calling it exact. 22/7 is a very close fraction and it is not equal to pi, because pi cannot be written as any fraction at all. That is why exam questions sometimes tell you to leave pi in your answer rather than working it out.",
      },
      {
        id: "a-ma-n-real",
        title: "Real numbers: the whole line, with no gaps",
        explain:
          "Put the rationals and the irrationals together and you have the real numbers. Every point on the number line is a real number, and every real number is a point on the line. There are no gaps left.",
        origin:
          "Putting the rationals and the irrationals together into one complete line, with no gaps anywhere, sounds obvious and took until the 1870s to state properly. Richard Dedekind and Georg Cantor, working separately in Germany, gave the first careful definitions of what a real number actually is. Until then mathematicians had used the number line confidently for two hundred years without being able to say precisely what filled it. This is a recurring pattern in the subject: the useful idea comes first and the rigorous definition arrives long afterwards.",
        why: "This is the number system the rest of school mathematics works in. When a question says solve for x and gives no other instruction, it means find the real numbers that work. Knowing that is the default saves confusion later, when Month 7 shows you a quadratic that has no real solutions at all.",
        example:
          "  Zoom in anywhere on the line and you find both kinds:\n\n   <--+---------+---------+---------+---------+-->\n      1        1.4       1.5       2         3\n                  ^\n            root 2 sits here, at 1.41421356...\n\n  Between any two rationals there is an irrational, and between\n  any two irrationals there is a rational. They are threaded\n  together completely, and together they fill the line.",
      },
      {
        id: "a-ma-n-family-tree",
        title: "The family tree, in one picture",
        explain:
          "Each set sits inside the next. Counting numbers are inside whole numbers, which are inside integers, which are inside rationals. The rationals and the irrationals together make the reals.",
        why: "This picture is worth memorising, because it answers a whole class of exam question in one glance, and because it makes the story make sense: each ring was added when the one inside it could not answer a question that mattered.",
        example:
          "  REAL NUMBERS\n  +-----------------------------------------------+\n  |  RATIONAL                     | IRRATIONAL    |\n  |  +-------------------------+  |               |\n  |  |  INTEGERS               |  |  root 2       |\n  |  |  +-------------------+  |  |  root 3       |\n  |  |  |  WHOLE            |  |  |  pi           |\n  |  |  |  +-------------+  |  |  |  e            |\n  |  |  |  |  COUNTING   |  |  |  |               |\n  |  |  |  |  1, 2, 3... |  |  |  |               |\n  |  |  |  +-------------+  |  |  |               |\n  |  |  |  and 0          |  |  |               |\n  |  |  +-------------------+  |  |               |\n  |  |  and -1, -2, -3...      |  |               |\n  |  +-------------------------+  |               |\n  |  and 3/4, 0.25, 0.333...      |               |\n  +-----------------------------------------------+\n\n  Each ring was added when the ring inside it could not\n  answer a question people needed answered.\n\n  Every number you meet before university is somewhere here.",
        table: {
          caption: "The symbols, which examiners use from SS1.",
          headers: ["Symbol", "Set", "Example member"],
          rows: [
            ["N", "Natural or counting numbers", "7"],
            ["W", "Whole numbers", "0"],
            ["Z", "Integers", "-4"],
            ["Q", "Rational numbers", "3/5"],
            ["R", "Real numbers", "pi"],
          ],
          note: "Q is for quotient, which is another word for the result of a division.",
        },
      },
      {
        id: "a-ma-n-why-classify",
        title: "Why the classification is worth knowing",
        explain:
          "Knowing what kind of number you are working with tells you what to expect of the answer, which operations are safe, and what form the answer should be left in.",
        why: "This is not classification for its own sake. It is the reason a count of buses cannot end in a decimal, the reason a chance can never be greater than 1, and the reason some questions tell you to leave an answer exact rather than rounding it. Each of those is a statement about what KIND of number the answer has to be.",
        table: {
          caption: "The kind of number, and what it tells you.",
          headers: ["If the answer should be", "Then", "Seen in"],
          rows: [
            ["A count of objects", "It is a whole number, so no fractions", "Every word problem"],
            ["A probability", "It is between 0 and 1 inclusive", "Month 8"],
            ["A length", "It is positive, and may be irrational", "Months 5 and 8"],
            ["An exact length", "Leave it exact rather than rounding it", "Month 7"],
            ["In terms of pi", "Keep pi as a symbol rather than working it out", "Months 5 and 8"],
          ],
        },
        practice: {
          prompt:
            "A question asks how many buses are needed and a student answers 5.6. What does the classification tell you immediately?",
          answer:
            "That the answer is wrong in kind, before you check any arithmetic. A count of buses must be a whole number, so 5.6 cannot be a final answer. The calculation probably gave 5.6 and the reading step, deciding what to do with the remainder, was skipped. The answer is 6.",
        },
      },
    ],

    task: {
      title: "Before you move on",
      intro:
        "Draw the family tree from memory, on one side of a page, without looking at it. Then check it and fill in what you missed. After that:",
      prompts: [
        "Write one example of your own in each ring: a counting number, zero, a negative integer, a fraction, and an irrational number.",
        "Write down why negatives had to be invented, and why fractions had to be invented, in one sentence each.",
        "Find a number between 2.7 and 2.71, then one between 2.7 and your new number.",
        "Explain to someone, out loud, why no fraction is exactly equal to pi.",
      ],
      closing:
        "Keep the drawing. Several later topics are really questions about which ring of this picture an answer belongs in, and they are much easier to hold when the picture is already familiar.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
