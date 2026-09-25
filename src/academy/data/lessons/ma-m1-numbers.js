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
        why: "Zero is a genuinely difficult idea and it was resisted for a very long time. Counting numbers describe things that are there; zero describes the absence of them, which is a different kind of claim. The Romans had no symbol for it, and that is a large part of why Roman numerals were hopeless for arithmetic.",
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
        why: "Once you have integers, subtraction always has an answer. That is the technical reason the set was worth inventing: it closes a gap. Inside counting numbers, 3 minus 5 has no answer. Inside integers it has exactly one.",
        example:
          "  The integers, drawn:\n\n   <--+----+----+----+----+----+----+----+-->\n     -3   -2   -1    0    1    2    3\n\n  Zero is not positive and not negative. It is the point the\n  two directions are measured from.",
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
          "   <--+-----+-----+-----+-----+-----+-->\n    -18   -10    -3     0     3    10\n\n  Reading left to right, smallest first:\n\n    -18  <  -10  <  -3  <  0  <  3  <  10\n\n  Every negative is smaller than every positive.\n  Among negatives, bigger digits mean a smaller number.",
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
          "  7 and -7 are opposites:\n\n   <--+-----+-----+-----+-----+-----+-->\n     -7          0           7\n      |<--- 7 --->|<--- 7 --->|\n\n  Both are 7 units from zero. They point opposite ways.\n\n  Adding a number to its opposite always gives zero:\n\n    7 + (-7) = 0        and        -7 + 7 = 0",
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
          prompt: "Name a fraction between 1/3 and 1/2, and say how you found it.",
          answer:
            "Average them: (1/3 + 1/2) divided by 2. Over a common denominator of 6 that is (2/6 + 3/6) divided by 2, which is 5/6 divided by 2, giving 5/12. Check: 5/12 is 0.4166..., which sits between 0.333... and 0.5.",
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
          "Take a square with sides of 1. Its diagonal has a length whose square is 2, so the length is the square root of 2. That number cannot be written as a fraction of two whole numbers, no matter how large you allow them to be.",
        why: "This was not a small discovery. The Pythagoreans had built a philosophy on the idea that everything could be expressed as a ratio of whole numbers, and here was a length, drawn with a ruler, that could not be. It is the moment mathematics discovered that its own system was incomplete.",
        example:
          "  A square with sides of 1:\n\n      +-----------+\n      |          /|\n      |        /  |\n    1 |      /    | \n      |    /      |\n      |  /        |\n      +-----------+\n            1\n\n  By Pythagoras, the diagonal d satisfies:\n\n    d squared = 1 squared + 1 squared = 2\n\n  So d is the square root of 2, about 1.41421356...\n\n  That decimal never ends and never repeats. There is no\n  fraction of whole numbers that equals it exactly.",
        analogy:
          "You draw a line you can see and measure, and then discover that the number system you were using has no name for its length. The line was not the problem.",
      },
      {
        id: "a-ma-n-irrational",
        title: "Irrational numbers",
        explain:
          "An irrational number is one that cannot be written as a fraction of two integers. Its decimal runs forever without ever falling into a repeating pattern. The square root of 2 is one, and so is pi.",
        why: "Irrational is another word that sounds like a judgement and is not. It means not a ratio, exactly as rational means expressible as a ratio. These numbers are perfectly well behaved; they simply cannot be written in that one particular form.",
        table: {
          caption: "The irrational numbers you will actually meet.",
          headers: ["Number", "Roughly", "Where it appears"],
          rows: [
            ["Square root of 2", "1.41421356...", "Diagonals, Pythagoras, surds"],
            ["Square root of 3", "1.73205080...", "Equilateral triangles, trigonometry"],
            ["Pi", "3.14159265...", "Every circle there has ever been"],
            ["e", "2.71828182...", "Growth, compound interest, calculus"],
          ],
          note: "The square roots of 4, 9, 16 and 25 are not irrational. Only the roots that do not come out whole are.",
        },
        mistake:
          "Writing pi as 22/7 and calling it exact. 22/7 is a rational approximation, and a good one, but pi is irrational so no fraction is exactly equal to it. That is why questions ask for answers in terms of pi.",
      },
      {
        id: "a-ma-n-real",
        title: "Real numbers: the whole line, with no gaps",
        explain:
          "Put the rationals and the irrationals together and you have the real numbers. Every point on the number line is a real number, and every real number is a point on the line. There are no gaps left.",
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
          "  REAL NUMBERS\n  +-----------------------------------------------+\n  |  RATIONAL                     | IRRATIONAL    |\n  |  +-------------------------+  |               |\n  |  |  INTEGERS               |  |  root 2       |\n  |  |  +-------------------+  |  |  root 3       |\n  |  |  |  WHOLE            |  |  |  pi           |\n  |  |  |  +-------------+  |  |  |  e            |\n  |  |  |  |  COUNTING   |  |  |  |               |\n  |  |  |  |  1, 2, 3... |  |  |  |               |\n  |  |  |  +-------------+  |  |  |               |\n  |  |  |  and 0          |  |  |               |\n  |  |  +-------------------+  |  |               |\n  |  |  and -1, -2, -3...      |  |               |\n  |  +-------------------------+  |               |\n  |  and 3/4, 0.25, 0.333...      |               |\n  +-----------------------------------------------+\n\n  Every number you meet before university is somewhere in here.",
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
        why: "This is not classification for its own sake. It is the reason a question says leave your answer in surd form, the reason a probability can never be greater than 1, and the reason an examiner expects 3 root 2 rather than 4.24. Each of those is a statement about what kind of number the answer is.",
        table: {
          caption: "The kind of number, and what it tells you.",
          headers: ["If the answer should be", "Then", "Seen in"],
          rows: [
            ["A count of objects", "It is a whole number, so no fractions", "Every word problem"],
            ["A probability", "It is between 0 and 1 inclusive", "Month 8"],
            ["A length", "It is positive, and may be irrational", "Months 5 and 8"],
            ["An exact root", "Leave it as a surd, do not decimalise", "Month 7"],
            ["In terms of pi", "Keep pi as a symbol", "Months 5 and 8"],
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
        "Explain to someone, out loud, why 22/7 is not exactly pi.",
      ],
      closing:
        "Keep the drawing. Month 7 introduces surds and Month 8 introduces probability, and both of them are much easier to hold when you already know which part of this picture you are standing in.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
