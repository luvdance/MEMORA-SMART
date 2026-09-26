/**
 * MATHEMATICS · MONTH 1 · MODULE 1 · STARTING MATHEMATICS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * There is not a single sum in this module, and that is deliberate.
 *
 * A course that opens with a calculation is speaking only to the students who
 * were already doing fine. Everyone else arrives carrying something: a gap
 * from four years ago, a memory of being timed and found slow, a teacher who
 * moved on before they understood, or a sentence somebody once said to them
 * about not being a mathematics person. None of that is addressed by starting
 * with fractions, and all of it will still be there in Month 6.
 *
 * ── THREE RULES THIS MODULE HOLDS ITSELF TO ──────────────────────────────
 *
 * NOTHING BEFORE ITS TIME. Every example here uses counting and simple whole
 * numbers. No squares, no pi, no fractions, no decimals, no letters standing
 * for numbers. A module that opens the course by using ideas the course has
 * not taught is doing the exact thing it is warning against.
 *
 * EVERY IDEA HAS A CAUSE. Mathematics was not handed down finished. Every
 * piece of it was invented by somebody, to solve a problem they actually had,
 * and usually resisted by everyone else for a century afterwards. Told that
 * way, a rule stops being arbitrary. That is what the `origin` note on each
 * atom is for, and it runs through the whole course.
 *
 * NO TERM BEFORE ITS MEANING. Row, column, digit, sum, difference, product,
 * half, quarter: every one of these is explained before it is used for
 * anything. Most of what feels like difficulty in this subject is not the
 * mathematics. It is a word nobody stopped to explain, used as though everybody
 * already knew it, and the reader who goes quiet at the word was never lost at
 * the idea underneath.
 */

export const SECTION_ID = "ma-s1-welcome";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l1-what-is-maths",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 1,
    title: "Start Here: You Already Know Some of This",
    subtitle: "What you can already do, where it stops, and what that actually means",
    estimatedMinutes: 15,
    intro:
      "Most people who say they are afraid of mathematics can do more of it than they think. This lesson shows you what you can already do, shows you the exact place where it usually stops, and then tells you what that stopping point really means. It is not the thing you have been told it is.",

    atoms: [
      {
        id: "a-ma-w-you-already-know",
        title: "You already know some of this",
        explain:
          "Most people asked about mathematics will say they are not good at it, or that they are afraid of it. Look closely and something else is usually true. They are perfectly fine with basic arithmetic, and they were stopped at one particular point. Before anything else, let us prove the first part of that to you.",
        why: "Starting anywhere else is dishonest. If you are told the subject is hard and then shown something hard, you learn nothing except that you were right to worry. If you are shown that you can already do a real part of it, the question changes from whether you can do mathematics to which specific thing you were never taught.",
        example:
          "  Answer these in your head. Do not write\n  anything down and do not rush.\n\n      1  +  1   =  ?\n\n      2  ×  2   =  ?\n\n     10  ÷  2   =  ?\n\n     20  −  5   =  ?\n\n    100  +  50  =  ?\n\n\n  Answers: 2, 4, 5, 15, 150.\n\n  You did not struggle with those. You may\n  not even have felt yourself thinking.\n\n\n  THAT IS ARITHMETIC, AND YOU HAVE IT.\n\n  Adding, subtracting, multiplying,\n  dividing. Four things, and you can do\n  all four. That is not a small thing and\n  it is not nothing: it is the floor the\n  whole subject stands on.\n\n  Nobody who can answer those five is\n  somebody who cannot do mathematics.",
        practice: {
          prompt:
            "Get a pen and a piece of paper. You will need them throughout this course. Work these out on paper rather than in your head: 24 + 38, 7 × 6, 96 ÷ 8, 105 − 47.",
          answer:
            "62, 42, 12 and 58. If you got all four, your arithmetic is sound and this course is going to be easier than you expect. If one came out wrong, look at which one, because that tells you something useful: it is a specific thing to tighten, not a verdict on you. Month 2 drills all four operations until they are automatic.",
        },
      },
      {
        id: "a-ma-w-where-it-stops",
        title: "And here is where it usually stops",
        explain:
          "Now four more. These are the four places where almost everybody who says they are bad at mathematics actually got stopped. Read them and notice what happens in your chest, because that reaction is the honest starting point of this course.",
        why: "Naming the exact place it stops is worth more than any amount of encouragement. Almost nobody is bad at all of mathematics. Almost everybody who thinks they are has hit one of these four and taken it as proof about themselves rather than as a gap in what they were taught.",
        example:
          "  Look at each of these. You do not have to\n  answer them.\n\n\n    1        1\n    -   +    -    =  ?\n    2        4\n\n\n    −5  +  3     =  ?\n\n\n    0.7  ×  0.5  =  ?\n\n\n    2x  +  6  =  12,   so x = ?\n\n\n  Most people feel something tighten at one\n  of those four, and for a great many it is\n  the last one.\n\n\n  THOSE FOUR ARE NOT HARDER ARITHMETIC.\n\n  They are four different topics, and each\n  one has its own small set of rules that\n  somebody has to be told:\n\n    1/2 + 1/4      is FRACTIONS\n    −5 + 3         is DIRECTED NUMBERS\n    0.7 × 0.5      is DECIMALS\n    2x + 6 = 12    is ALGEBRA\n\n  Nobody is born knowing those rules. Not\n  one person. They have to be taught, and\n  if they were taught to you quickly, or\n  badly, or on a day you were not there,\n  then you do not know them yet.\n\n  Not knowing them yet is a completely\n  different thing from not being able to\n  learn them.",
        practice: {
          prompt:
            "Be honest with yourself and write down which of the four made you most uncomfortable: fractions, negative numbers, decimals, or letters like x.",
          answer:
            "Whichever you wrote, this course reaches it in the first four months, from the beginning, with the rules explained rather than assumed. Fractions and decimals are Month 3. Directed numbers are Month 2. Letters are Month 4. Keep that note; it is worth looking at again when you get there.",
        },
      },
      {
        id: "a-ma-w-not-arithmetic",
        title: "It is not that you do not know mathematics",
        explain:
          "You know arithmetic. What you may not know is fractions, or directed numbers, or algebra. Those are separate topics with their own rules, and being stopped by one of them says nothing whatever about whether you can do mathematics. It says you have not been taught that topic yet.",
        origin:
          "Even the professionals had to be taught these, and several of them took centuries to be accepted. Negative numbers were called absurd numbers in Europe and were still being argued about in the 1800s. Fractions were written in a clumsy way by Egyptian scribes for two thousand years. The letter x for an unknown is only four hundred years old, from Descartes in 1637. So when a topic feels unnatural to you, that is not a fact about you. Several of these ideas felt unnatural to the best mathematicians alive at the time, and they said so in print.",
        why: "This is the single most important sentence in the whole course, so it is worth reading twice. Mathematics is not one large thing you either have or lack. It is a set of separate topics, each built to handle a particular kind of everyday problem, each with a short list of rules. Nobody knows a topic they have not been taught. That is not a shortcoming; it is a schedule.",
        example:
          "  Put the two lists side by side.\n\n\n  WHAT YOU COULD DO A MINUTE AGO:\n\n    1 + 1,  2 × 2,  10 ÷ 2,  20 − 5\n\n    These are arithmetic. You have them.\n\n\n  WHAT STOPPED YOU:\n\n    2x + 6 = 12\n\n    This is algebra. It is a topic.\n\n\n  AND HERE IS THE THING:\n\n  Look at what solving it actually needs.\n\n    2x + 6 = 12\n\n    Take 6 off both sides:   2x = 6\n    Halve both sides:         x = 3\n\n  Two steps. The arithmetic inside them is\n  12 − 6 and 6 ÷ 2, which you did in your\n  head a minute ago without noticing.\n\n  The only thing you were missing was\n  knowing that you are ALLOWED to take 6\n  off both sides, and why that is allowed.\n\n  That is one rule. Somebody should have\n  told you. This course tells you, in Month\n  4, after the three things it rests on.",
        mistake:
          "Reading a topic you were never taught as evidence about your ability. It is evidence about your timetable. The two feel identical from the inside and they are not remotely the same thing.",
      },
      {
        id: "a-ma-w-many-topics",
        title: "Mathematics is many topics, not one",
        explain:
          "Mathematics is a broad subject made of separate topics, and each topic exists because somebody had a particular kind of everyday problem to solve. That is why they have different rules: they are answering different questions.",
        why: "This changes what it means to find something hard. You are not failing at a single enormous subject. You are meeting one topic out of many, and that topic has a specific job. Knowing the job makes the rules make sense, because the rules were built to do that job.",
        table: {
          caption: "Each topic, and the everyday question it was built to answer.",
          headers: ["Topic", "The question it answers", "Month"],
          rows: [
            ["Arithmetic", "How many altogether, and how many each?", "2"],
            ["Fractions", "What if it does not divide evenly?", "3"],
            ["Decimals", "How do I handle money and measurements?", "3"],
            ["Percentages", "Is this discount actually a good deal?", "3"],
            ["Directed numbers", "What about below zero, or owing?", "2"],
            ["Ratio", "How do I share this out fairly?", "4"],
            ["Measurement", "How much cloth, cement or tiles?", "4"],
            ["Algebra", "I know the total; what was the missing part?", "4"],
            ["Geometry", "What shape is it, and how big?", "5 and 8"],
            ["Statistics", "What is this information really telling me?", "8"],
          ],
          note: "You are not expected to recognise all of these. The point of the table is the middle of it: every one of these topics was invented because somebody needed that question answered. None of them is there to make life difficult.",
        },
      },
      {
        id: "a-ma-w-what-this-course-does",
        title: "What this course does about it",
        explain:
          "It starts at the bottom and goes up in order, one topic at a time, with the rules explained rather than assumed. Nine months, from arithmetic to the point where a university lecture makes sense.",
        why: "Order is the whole design. Fractions need factors, so factors come first. Algebra needs fractions and negative numbers, so those come first. Every time you meet something new it will rest only on things already built, which is what makes it possible to keep up.",
        table: {
          caption: "The road, in order.",
          headers: ["Month", "What you work on"],
          rows: [
            ["1", "Getting started, and the words and numbers"],
            ["2", "The four operations, properly, and below zero"],
            ["3", "Fractions, decimals, percentages"],
            ["4", "Sharing, measuring, patterns, and your first x"],
            ["5", "Powers, money, graphs, angles"],
            ["6", "Algebra in earnest"],
            ["7", "The senior number system"],
            ["8", "Shape, angle, data"],
            ["9", "Calculus, the exam, and university"],
          ],
          note: "Notice that your first x is in Month 4, not Month 1. Three months of foundation come first, on purpose, because every one of them is used inside algebra.",
        },
        example:
          "  THREE PROMISES THIS COURSE MAKES.\n\n\n  1.  NOTHING BEFORE ITS TIME.\n\n      No lesson will use an idea the course\n      has not taught yet. If you meet\n      something you have not seen, that is\n      a mistake on our side, not yours.\n\n\n  2.  NO WORD WITHOUT ITS MEANING.\n\n      Every term gets explained before it\n      is used for anything, however\n      ordinary the word may look. If you\n      ever meet one that was not, that is\n      a mistake on our side.\n\n\n  3.  EVERY RULE HAS A REASON.\n\n      You will never be told to do\n      something without being told why it\n      works. A rule with a reason can be\n      rebuilt when you forget it. A rule\n      without one is gone for good.\n\n\n  AND ONE THING WE ASK OF YOU:\n\n  Keep a pen and paper beside you. Reading\n  mathematics is not learning mathematics.\n  When a lesson says stop and try it, stop\n  and try it. That single habit is worth\n  more than everything else in Lesson 4.",
      },
      {
        id: "a-ma-w-plain-words",
        title: "A few plain words, before we start using them",
        explain:
          "This course will keep using a handful of ordinary words in an exact way. Row, column, digit, sum, difference, product, half, third, quarter. Not one of them is difficult, and every one is worth two minutes now instead of a puzzled hour later.",
        origin:
          "Almost all of these words reached English through Latin, brought in by translators and printers who needed a short way to say something that had been a whole phrase. Digit comes from digitus, meaning finger, because fingers are what people first counted on, and it is the reason there are ten of them. Sum comes from summa, the top, because Roman and medieval clerks wrote a column of figures and put the total at the TOP rather than the bottom. Product comes from producere, to bring forth. None of these words was invented to sound clever. Each one is a working word that stuck.",
        why: "A great deal of what feels like difficulty in this subject is not the mathematics at all. It is a word nobody stopped to explain, used as though everybody already knew it. The reader goes quiet at the word and concludes they cannot do the idea, when the idea underneath is usually easy. So this course has a rule: where a new word turns up later on, it gets explained on the spot, every time, before it is used for anything.",
        example:
          "  A ROW goes across.\n\n      o  o  o  o  o  o        one row\n\n\n  A COLUMN goes down.\n\n      o\n      o\n      o                       one column\n      o\n\n  If you ever mix the two up: the columns\n  holding up a building stand upright.\n\n\n  A DIGIT is one of the ten symbols we write\n  numbers with:\n\n      0  1  2  3  4  5  6  7  8  9\n\n  So 47 is one number, written with two\n  digits. A digit is a symbol on the page.\n  The number is the amount it stands for.\n\n\n  Three words for the results of sums. You\n  will meet them in exam questions:\n\n    the SUM of 6 and 4         6 + 4 = 10\n    the DIFFERENCE of 6 and 4  6 − 4 = 2\n    the PRODUCT of 6 and 4     6 × 4 = 24\n\n  Sum means add. Difference means subtract.\n  Product means multiply. That is all they\n  are: shorter words for things you can\n  already do.\n\n\n  And the words for equal parts:\n\n    a HALF     is 1 of 2 equal parts\n    a THIRD    is 1 of 3 equal parts\n    a QUARTER  is 1 of 4 equal parts\n\n    whole     ############\n    half      ######\n    third     ####\n    quarter   ###\n\n  You already use these for money and time.\n  Half of ₦1,000 is ₦500. A quarter of an\n  hour is 15 minutes. Month 3 does the\n  arithmetic; the words are all you need now.",
        mistake:
          "Reading past a word you are not sure of, and hoping it will become clear from what follows. It almost never does, because the next sentence was written by somebody who already knew the word. Stop and look it up, or come back here.",
      },
      {
        id: "a-ma-w-understanding",
        title: "Knowing a procedure and understanding an idea",
        explain:
          "You can be told that five sixes are thirty and simply remember it. You understand it when you know that a crate of eggs holds the same number of eggs whichever way round you stand it, and that this is the reason five sixes and six fives must come to the same thing.",
        why: "A procedure is a thing you can forget, and under exam pressure you will. An understanding is a thing you can rebuild. The student who knows that turning the arrangement sideways cannot change how many objects there are has a reason to fall back on; the student who only memorised has nothing.",
        example:
          "  Picture a crate of eggs.\n\n  The eggs sit in ROWS going across. Count\n  them: 5 rows. And count how many eggs are\n  in each row: 6.\n\n      o  o  o  o  o  o      row 1\n      o  o  o  o  o  o      row 2\n      o  o  o  o  o  o      row 3\n      o  o  o  o  o  o      row 4\n      o  o  o  o  o  o      row 5\n\n      5 rows, 6 in each  =  30 eggs\n\n\n  NOW PICK THE CRATE UP AND STAND IT ON ITS\n  SIDE, so the long edge is going down\n  instead of across.\n\n  No egg fell out. You did not put one in.\n  It is the same crate, facing another way.\n\n      o  o  o  o  o         row 1\n      o  o  o  o  o         row 2\n      o  o  o  o  o         row 3\n      o  o  o  o  o         row 4\n      o  o  o  o  o         row 5\n      o  o  o  o  o         row 6\n\n  Count again. Now there are 6 rows with 5\n  in each.\n\n      6 rows, 5 in each  =  30 eggs\n\n\n  SAME CRATE. SAME EGGS. SAME 30.\n\n  So 5 sixes and 6 fives cannot be different\n  numbers. They are both 30, and now you know\n  why rather than just that.\n\n\n  AND HERE IS WHAT THAT BUYS YOU:\n\n  Learn that 5 sixes are 30 and you have got\n  6 fives are 30 free, in the same breath.\n\n  Better still, if the number ever slips out\n  of your head in an exam, you have a way\n  back to it, because you know what it means.\n  Somebody who only memorised has nothing to\n  fall back on.",
        practice: {
          prompt:
            "Somebody tells you that to multiply a whole number by ten you just add a zero on the end. Is that a procedure or an understanding?",
          answer:
            "A procedure. It gives the right answer for whole numbers and it says nothing about why. Month 1 Module 4 gives the reason, and the reason turns out to matter, because the procedure quietly stops working later on and the reason never does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l2-why-it-matters",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 2,
    title: "Where It Turns Up in an Ordinary Day",
    subtitle: "Money, time, measuring, and where the numbers came from",
    estimatedMinutes: 14,
    intro:
      "The honest answer to when will I ever use this is: you already are, several times a day, usually without noticing. This lesson is where it is hiding, and what it costs when it is missing. Nothing here needs to be calculated by you yet.",

    atoms: [
      {
        id: "a-ma-w-money",
        title: "Money is mathematics with consequences",
        explain:
          "Every price, every piece of change, every discount, every instalment plan and every loan is a calculation. The person who can do it is deciding. The person who cannot is being told. Per cent, which appears below, simply means out of a hundred, so 20 per cent means 20 out of every 100. Month 3 does the arithmetic.",
        origin:
          "Written mathematics and written money appear together. The earliest writing we have, from Mesopotamia about five thousand years ago, is not poetry or law but accounts: how much grain, owed by whom, to whom. Clay tokens were sealed in clay envelopes so that a delivery could be checked against what was promised, and marks were pressed on the outside to say what was inside. Those marks became numerals. People learned to write because they needed to count what they were owed.",
        why: "This is the most practical argument for the subject there is. A trader who can work out what a sale actually earns prices correctly. A borrower who can work out what a loan actually costs knows what they are agreeing to. Neither of those is advanced mathematics, and both of them are money most people simply lose.",
        example:
          "  A question you can already answer:\n\n    Three exercise books cost ₦450 each.\n    You hand over ₦2,000.\n\n    Three lots of ₦450 is ₦1,350.\n    ₦2,000 take away ₦1,350 leaves ₦650 change.\n\n  A question you will be able to answer by Month 3:\n\n    Shop A takes 20% off and then adds VAT at the till.\n    Shop B takes 15% off with VAT already included.\n    Which is cheaper?\n\n  It turns out to be Shop B, and the shop advertising the\n  bigger discount is the more expensive one. Working out why\n  is percentages, and it is eight weeks away.",
        mistake:
          "Assuming the larger advertised percentage is the better deal. Percentages taken off different amounts, in a different order, are not comparable until somebody works them out.",
      },
      {
        id: "a-ma-w-time",
        title: "Time, and why it refuses to behave",
        explain:
          "Working out when to leave, how long a journey takes, or how long until something is due is counting, with one complication: time counts in sixties rather than tens.",
        origin:
          "Blame the Babylonians. Around four thousand years ago they used a counting system based on sixty, probably because sixty divides neatly by two, three, four, five and six, which makes sharing easy. Their astronomers divided the day and the circle that way, the Greeks kept it, and nobody has managed to change it since. Every other measurement we use went metric. Time did not.",
        why: "Journey and time questions appear on every paper, and they are also one of the most common calculations in a working day for a driver, a trader moving goods, a nurse on shift or anyone catching a flight. The errors almost always come from treating minutes as though they counted in hundreds.",
        example:
          "  A bus leaves at 6:40 in the morning. The journey takes\n  3 hours and 50 minutes. When does it arrive?\n\n    6:40, add 3 hours          →  9:40\n    9:40, add 20 minutes       → 10:00\n    10:00, add the other 30    → 10:30\n\n  It arrives at 10:30.\n\n  Counting up to the next whole hour first is the trick, and\n  it works because 60 minutes make an hour.",
        analogy:
          "Money counts in hundreds: one hundred kobo make a naira. Time counts in sixties. Using the habits of one on the other is where almost every time mistake comes from.",
      },
      {
        id: "a-ma-w-measure",
        title: "Measurement, and the trades that run on it",
        explain:
          "A tailor cutting cloth, a builder ordering cement, a farmer spacing seedlings, a cook scaling a recipe and a carpenter cutting a corner are all measuring, comparing and calculating, whether or not they call it mathematics.",
        origin:
          "The oldest units were parts of the body, because everybody carries them. A cubit was the length from the elbow to the fingertip, and the Great Pyramid was set out in cubits. The trouble is obvious: whose elbow? Egyptian builders solved it with a royal cubit rod kept as the standard, and every site rod was checked against it. That is the beginning of standard measurement, and it exists because a building whose parts were measured against different arms does not fit together.",
        why: "These are not invented textbook examples. Ordering too little cement stops a job; cutting cloth short ruins it. In every one of these trades the person who is confident with measurement wastes less and quotes more accurately, and both of those are money.",
        example:
          "  A room is 5 metres by 4 metres.\n  Floor tiles come in boxes, and one box covers 2 square metres.\n\n    The floor is 5 × 4 = 20 square metres.\n    20 ÷ 2 = 10 boxes.\n\n  Then the part a textbook forgets and a builder does not:\n  tiles get cut and tiles get broken, so you order 11.\n\n  Every step of that is Month 4, and the last step is judgement\n  rather than arithmetic.",
        table: {
          caption: "The trade, and the topic it is quietly using.",
          headers: ["Trade", "The mathematics", "Taught in"],
          rows: [
            ["Tailoring", "Measurement, scaling, ratio", "Month 4"],
            ["Building", "Area, volume, allowing for waste", "Months 4 and 8"],
            ["Carpentry", "Angles and right angles", "Months 5 and 8"],
            ["Catering", "Ratio, scaling a recipe, unit cost", "Month 4"],
            ["Farming", "Area, spacing, yield", "Months 4 and 8"],
          ],
        },
      },
      {
        id: "a-ma-w-judgement",
        title: "When a number is used to persuade you",
        explain:
          "Figures in a news report, an average quoted with nothing else beside it, a chart drawn to flatter. Reading these properly is a mathematical skill, and it is mostly Month 8.",
        origin:
          "Statistics began as state arithmetic, which is where the word comes from: numbers collected by a government about its own population. It became a way of arguing in the 1850s, when Florence Nightingale used diagrams of hospital deaths to convince the British government that most soldiers in the Crimea were dying of infection rather than wounds. She was right, the diagrams worked, and she is one of the first people to use a chart as an instrument of persuasion rather than as a record.",
        why: "This is the part of the subject that protects you. A great deal of what people are asked to believe is presented as a number precisely because numbers feel unarguable. Knowing how an average can be chosen to flatter is the difference between reading a claim and being led by it.",
        example:
          "  A company has nine workers and one owner.\n\n    Each worker earns ₦80,000 a month.\n    The owner takes ₦2,000,000 a month.\n\n  There are two honest ways to describe the typical pay.\n\n    Share the total equally between all ten people:\n      the figure comes out at ₦272,000.\n\n    Line all ten up in order and take the middle:\n      the figure is ₦80,000.\n\n  Both are correct. If you want the company to sound generous\n  you quote the first. If you want to describe what a worker\n  there actually earns, you quote the second.",
        mistake:
          "Treating a number as automatically objective. A number is a claim, and like any claim it can be chosen to mislead without being false.",
      },
      {
        id: "a-ma-w-careers",
        title: "What it opens up for you",
        explain:
          "In Nigeria a credit in mathematics is required for admission to almost every university course, not only the sciences. Beyond admission, it is the entry qualification for engineering, medicine, accounting, data work, finance, architecture, computing, and every trade that has to quote a price before doing the work.",
        why: "It is worth being plain about this rather than pretending the subject is only its own reward. Mathematics is the single subject that most often decides which doors a Nigerian student can walk through, and a failure in it closes more of them than a failure in anything else.",
        table: {
          caption: "What the subject is actually gatekeeping.",
          headers: ["Field", "What it needs"],
          rows: [
            ["Engineering, physics", "Algebra, trigonometry, calculus"],
            ["Medicine, pharmacy", "Statistics, ratio, dosage calculation"],
            ["Accounting, banking", "Percentage, interest, financial arithmetic"],
            ["Data and software", "Algebra, logic, statistics"],
            ["Architecture, surveying", "Geometry, measurement, angles"],
            ["Business of any kind", "Margin, break even, cash flow"],
          ],
          note: "Every one of those topics appears in this course. You are not expected to recognise the words yet.",
        },
        practice: {
          prompt:
            "Name one thing you did in the last week that involved a calculation you did not think of as mathematics at the time.",
          answer:
            "There is no single right answer and the point is the noticing. Common ones: checking change, comparing two prices, working out how long until you had to leave, splitting a bill, deciding whether a data plan was worth it, judging how much fuel a trip would take.",
        },
      },
      {
        id: "a-ma-w-beginning",
        title: "Where it all began: counting",
        explain:
          "Mathematics started with one question: how many. Before writing, before money, before cities, people were keeping count, and the oldest evidence of it we have comes from Africa.",
        origin:
          "The Lebombo bone, found in the mountains between Eswatini and South Africa, is a piece of baboon bone with twenty nine notches cut into it. It is about thirty five thousand years old and it is the oldest known mathematical object in the world. The Ishango bone, found near Lake Edward in what is now the Democratic Republic of the Congo, is about twenty thousand years old and its notches are cut in deliberate groups. Somebody sat down, a very long time ago, and kept a record of a quantity. That is where this subject starts.",
        why: "It is worth knowing that counting had to be invented, because it makes everything that follows easier to accept. Zero had to be invented. Negative numbers had to be invented. Fractions had to be invented. None of it was obvious, all of it was argued over, and the arguing is usually the most interesting part of the story.",
        example:
          "  A tally, which is still how people count today when the\n  count has to be kept while something else is going on:\n\n     |||| |||| |||| ||\n\n  Four strokes and a fifth across them, because the eye can\n  take in five at a glance and cannot take in seventeen.\n\n  That grouping instinct is the beginning of place\n  value, which means letting a digit's POSITION\n  decide what it is worth. It is Module 4 of this\n  month.",
        analogy:
          "A herder with a pouch of pebbles, one pebble per goat. Goats go out in the morning and the pebbles move to the other side of the pouch as they come back in the evening. No counting words are needed, and nothing is lost. That is a working number system.",
      },
      {
        id: "a-ma-w-counting-systems",
        title: "Not everybody counted in tens",
        explain:
          "Counting in tens is a habit, not a law. It happened because people have ten fingers. Other systems were built on other groupings, and several of them are still spoken every day in Nigeria.",
        origin:
          "The Yoruba number system counts in twenties rather than tens, and it uses subtraction. Sixteen is erindinlogun, which means twenty less four. Fifteen is eedogun, twenty less five. Igbo also groups in twenties. The Babylonians, four thousand years ago, counted in sixties, and that is the reason an hour still has sixty minutes and a circle still has three hundred and sixty degrees. Nobody has ever gone back and tidied it up.",
        why: "Two things follow from this. The first is that the number system you grew up with is a choice somebody made, which is exactly why Month 6 can teach you to count in other bases without it being strange. The second is that mathematics is not a foreign import: sophisticated counting systems were being used here long before anyone brought a textbook.",
        table: {
          caption: "The same quantity, four systems.",
          headers: ["System", "Groups in", "Still visible in"],
          rows: [
            ["Most modern counting", "Tens", "Everything you write"],
            ["Yoruba, Igbo", "Twenties", "Everyday speech"],
            ["Babylonian", "Sixties", "Minutes, seconds, degrees"],
            ["Roman", "No grouping by position", "Clock faces, book chapters"],
          ],
        },
        practice: {
          prompt:
            "Why would counting in twenties be a natural thing for a person to invent, if counting in tens came from fingers?",
          answer:
            "Fingers and toes. Ten is what you can see when you look down at your hands; twenty is what you have altogether. Several counting systems around the world settled on twenty for that reason, and the Yoruba system is one of them.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l3-why-it-feels-hard",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 3,
    title: "Why It Went Wrong Before",
    subtitle: "Six real reasons, and not one of them is you",
    estimatedMinutes: 15,
    intro:
      "If you have found this subject difficult, there is a reason, and it is almost certainly one of the six in this lesson. Every one of them is fixable, which is the point of naming them.",

    atoms: [
      {
        id: "a-ma-w-cumulative",
        title: "It is the one subject where everything sits on what came before",
        explain:
          "In history you can miss one war and still do well on the next. In mathematics, if you miss how to share things into equal parts, you will later struggle with several topics that all quietly use it, and the difficulty will look as though it belongs to those topics.",
        origin:
          "Mathematics is taught as a strict sequence largely because of one book. Euclid's Elements numbers its propositions and allows each one to use only the results already proved, and for more than two thousand years it was not merely a textbook but THE textbook: it was still in use in British and colonial schools in the 1800s, which is within a few generations of now. That habit of ordering, where nothing may be used before it has been established, is where the shape of every mathematics syllabus comes from, and it is why a gap early on causes trouble late.",
        why: "This single property explains almost everything about why the subject feels different from the others, why it goes wrong quietly, and why going back is not a punishment but the fastest route forward. It is also why this course is ordered the way it is and will not let you past an idea until it is working.",
        table: {
          caption: "One gap, and where it turns up later.",
          headers: ["The gap", "Where it shows up", "What it looks like"],
          rows: [
            ["Times tables", "Almost everything longer than one step", "Slow, and tiring"],
            ["Sharing into equal parts", "Fractions, ratio, probability", "Looks like failing at those topics"],
            ["Place value", "Decimals, rounding, large numbers", "Answers a thousand times too big"],
            ["Numbers below zero", "Solving equations, graphs", "Sign mistakes that seem random"],
            ["Reading a question", "Every word problem, in every topic", "Right method, wrong question answered"],
          ],
          note: "In each row, the second column is where the low mark appears, and the first column is where the problem actually is.",
        },
        analogy:
          "Building a house. Nobody blames the roof when the foundation was rushed, and the roof is where the leak appears.",
      },
      {
        id: "a-ma-w-gaps",
        title: "Reason one: a small gap grows quietly",
        explain:
          "Because every topic rests on earlier ones, a gap does not stay where it started. It travels. Someone who never securely learned to share a quantity into equal parts meets that idea again and again under different names, and each time it looks like a new failure.",
        why: "This is why people describe mathematics as suddenly getting hard in a particular year. It rarely does. What usually happened is that a gap opened two or three years earlier and the point was finally reached where the topics depending on it became unavoidable.",
        example:
          "  How one missed idea shows up four years later:\n\n    JSS1   Sharing into equal parts never quite secured\n     ↓\n    JSS2   Comparing two quantities feels arbitrary\n     ↓\n    JSS3   Working with letters looks impossible\n     ↓\n    SS2    Chance questions never come out neatly\n     ↓\n    SS3    Longer questions break at the last line\n\n  Five low marks, in five different topics, from one gap.",
        mistake:
          "Trying to fix the topic where the low mark appeared. If the marks are being lost on the sharing step of a chance question, the thing to repair is sharing, and repairing it fixes four topics at once.",
      },
      {
        id: "a-ma-w-procedures",
        title: "Reason two: procedures taught without meaning",
        explain:
          "Turn it upside down and multiply. Move it to the other side and change the sign. Add a zero. These are instructions with no explanation attached, and they work right up until you misremember one detail.",
        origin:
          "This is not new and it is not local. In the twelfth century, European students learning the new Hindu and Arabic numerals were taught fixed recipes for calculation and called them algorisms, after Al-Khwarizmi, the Persian scholar whose book had carried the methods west. The word algorithm comes from his name. Even then there was an argument between those who taught the recipe and those who taught the reason, and the argument has never really stopped.",
        why: "A rule with no meaning behind it cannot be checked or rebuilt. Someone who has forgotten a detail of a recipe has no way of deciding which version is right. Someone who knows what the recipe is doing can work it out in seconds.",
        table: {
          caption: "The rule, and the meaning it was hiding.",
          headers: ["What you were told", "What it actually is"],
          rows: [
            ["Add a zero when multiplying by ten", "Every digit moves one column left"],
            ["Move it over and change the sign", "Do the same thing to both sides of a balance"],
            ["Two minuses make a plus", "Taking away a debt leaves you better off"],
            ["Turn it upside down and multiply", "How many of these fit into that"],
            ["Borrow one from the next column", "Exchange one ten for ten units"],
          ],
          note: "The right hand column survives being forgotten. The left hand column does not. You are not expected to follow all of these yet; each one is taught in its place.",
        },
        mistake:
          "Collecting more rules when a rule fails. The fix for a rule you cannot remember is not a second rule. It is the reason behind the first one.",
      },
      {
        id: "a-ma-w-speed",
        title: "Reason three: speed mistaken for ability",
        explain:
          "Somewhere in primary school, being fast became the measure of being good. Children who needed a few more seconds concluded they were not mathematics people, and many of them were simply being careful.",
        why: "Speed with table facts genuinely matters, and this course drills it, for one specific and limited reason: it frees up attention for the actual problem. It is not a measure of mathematical ability. Some of the most capable mathematicians alive are unremarkable at mental arithmetic.",
        analogy:
          "A tailor who runs the machine quickly is not therefore a good tailor. What decides whether the clothes fit is the measuring and the cutting. Sewing speed helps because it gets the machine work out of the way so the attention can go on the fit, and that is exactly the role of table facts.",
        mistake:
          "Concluding from a timed test in Primary 4 that you cannot do this subject. That test measured recall speed on one narrow skill, and it was never evidence about anything else.",
      },
      {
        id: "a-ma-w-questions",
        title: "Reason four: it stopped feeling safe to ask",
        explain:
          "In a class of sixty, asking a question costs something. So students learn to nod, write the steps down, and hope it makes sense later. It does not make sense later, and the next topic assumes it did.",
        why: "This turns one small confusion into a permanent one. The question you did not ask in Week 2 is the reason Week 6 makes no sense, and by then the question feels too basic to raise. That spiral is the most common way a student quietly falls behind while appearing to keep up.",
        example:
          "  What it sounds like inside a lesson:\n\n    Week 2  I do not quite see why that step works.\n            Everyone else is writing. I will work it out later.\n\n    Week 4  This is building on Week 2. I still do not see it.\n            Too late to ask now.\n\n    Week 6  I am lost, and I cannot say where it started.\n\n  The honest sentence at Week 6 is: go back to Week 2.",
        mistake:
          "Waiting until you are lost to go back. Go back the moment a step stops making sense, when the repair is ten minutes rather than a month.",
      },
      {
        id: "a-ma-w-anxiety",
        title: "Reason five: going blank is real, and it is not about ability",
        explain:
          "Anxiety about this subject takes up room in the part of your memory you use for holding the steps of a problem. That is why people go blank in tests on questions they can do calmly at home.",
        why: "Knowing the mechanism helps, because it stops you reading the blankness as evidence about your ability. It is not. It is a space problem: the attention that should be holding the problem is busy holding the fear.",
        table: {
          caption: "What actually reduces it, according to how it works.",
          headers: ["What helps", "Why it helps"],
          rows: [
            ["Writing the steps down", "Moves the load out of your head onto paper"],
            ["Practising until a step is automatic", "Frees the room that step was using"],
            ["Working under mild time pressure", "Rehearses the conditions, not just the content"],
            ["Starting with a question you can do", "Breaks the blank at the start of a paper"],
            ["Knowing errors are expected", "Removes the thing being feared"],
          ],
        },
        analogy:
          "Trying to count out money in a loud market while somebody stands over you hurrying you up. You know perfectly well how to count. The noise and the hurry are using the attention the counting needed, and you lose your place. Nothing about that is evidence that you cannot count.",
      },
      {
        id: "a-ma-w-myth",
        title: "Reason six: the myth of the mathematics person",
        explain:
          "The idea that some people simply have a mathematical brain and others do not is the most damaging belief in the subject. It is also not supported by the evidence, and countries that do not hold it get better results across the board.",
        why: "The belief is self fulfilling. If ability is fixed, effort is pointless, so a student who believes it stops trying at the first difficulty and reads the resulting failure as confirmation. If ability is built, difficulty is information about what to practise next, which is a completely different response to the same experience.",
        example:
          "  The same moment, two beliefs:\n\n    A question is hard and you are stuck.\n\n    Fixed:  This is the proof. I am not a maths person.\n            → stop\n\n    Built:  I am missing something specific. What is it?\n            → find it, drill it, continue\n\n  The question was identical. The next twenty minutes were not.",
        mistake:
          "Repeating the sentence about yourself. Saying I am just not good at maths out loud, often enough, does most of the work of making it true.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l4-rules-for-learning",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 4,
    title: "How to Study It So It Sticks",
    subtitle: "Eight habits that make the difference, and why each one works",
    estimatedMinutes: 15,
    intro:
      "Studying this subject well is not a matter of effort alone. There are ways of working that produce results and ways that feel productive and do very little. These eight rules are the difference, and the course is built around them.",

    atoms: [
      {
        id: "a-ma-w-rule-pen",
        title: "Rule one: do it with a pen",
        explain:
          "Reading a worked solution and following it is not learning mathematics. It feels like learning, because everything makes sense as you read. Close the page, attempt it yourself, and you find out what you actually have.",
        why: "This is the biggest single gap between how people study and what works. Recognising a method when you see it and producing it from a blank page are different abilities, and only the second one is tested. Everything else in this list follows from it.",
        example:
          "  Two students, one hour each, same worked examples.\n\n    Student A  reads all twelve, nodding, understanding each.\n    Student B  reads one, closes it, attempts it, gets stuck,\n               looks, finishes it, then does the next.\n\n  Student B covers four. Student B will get more of them right\n  next week than Student A gets right the same afternoon.",
        mistake:
          "Measuring study by how much you covered. A page you worked through with a pen is worth more than ten pages you read.",
      },
      {
        id: "a-ma-w-rule-struggle",
        title: "Rule two: struggle first, then look",
        explain:
          "When you are stuck, the productive thing is to stay stuck for a few minutes before looking at the answer. The looking teaches far more after you have tried than before.",
        why: "Trying to remember something, and failing, prepares the mind to take it in. Looking too early feels efficient and mostly produces recognition rather than knowledge. Five minutes of honest struggle before the hint is worth more than the hint on its own.",
        table: {
          caption: "How this course paces help.",
          headers: ["What you get", "When"],
          rows: [
            ["No hint at all", "Your first attempt at any practice question"],
            ["A nudge", "First rung of the hint ladder, on request"],
            ["The method", "Second rung"],
            ["The first worked step", "Third rung"],
            ["The full solution", "Only after you have submitted an answer"],
          ],
          note: "There is no button anywhere in this course that reveals an answer you have not attempted.",
        },
      },
      {
        id: "a-ma-w-rule-explain",
        title: "Rule three: never accept a step you cannot explain",
        explain:
          "If a line of working appears and you do not know why it is allowed, stop. Write the question down. A step you cannot explain is a rule you are borrowing, and it will not be there when you need it.",
        why: "This is the rule that prevents Reason two from the previous lesson. Every procedure in this subject has a reason, the reasons are usually short, and collecting them is what makes the whole thing hold together rather than being four hundred separate instructions.",
        example:
          "  Working you are given:\n\n      47\n    + 38\n    ————\n      85\n\n  with a small 1 written above the tens column.\n\n  The question to ask: what is that 1, and why is it there?\n\n  The answer: seven and eight make fifteen, which is one ten\n  and five units. The five stays in the units column and the\n  ten cannot fit there, so it moves to the tens column.\n\n  That single reason covers every carry you will ever do.",
        practice: {
          prompt:
            "Find one thing in mathematics you can do but could not explain to someone else. Write down the question you would need answered.",
          answer:
            "Common ones: why you add a zero when multiplying by ten, why you borrow in subtraction, why a minus and a minus make a plus, why you cannot divide by zero. Every one of those is answered in the first two months of this course, and the fact that you can name the question means you will notice when the answer arrives.",
        },
      },
      {
        id: "a-ma-w-rule-errors",
        title: "Rule four: an error is information, not a verdict",
        explain:
          "When an answer is wrong, the useful question is not was I wrong but what did I do. Almost every wrong answer in mathematics comes from a specific, repeatable, nameable action.",
        why: "This is why this course marks the way it does. Being told incorrect teaches nothing. Being told what you actually did, and why it produces that particular wrong answer, teaches the thing you got wrong. An error you can name is an error you can stop making.",
        example:
          "  A student works out 62 take away 27 and writes 45.\n\n    Unhelpful:  Wrong. The answer is 35.\n\n    Useful:     In the units column you did 7 take away 2\n                instead of borrowing to do 12 take away 7.\n                Look at which number is on top.\n\n  The second one names a habit. The first one names a mark.",
        mistake:
          "Rubbing out wrong working. It is the most useful thing on the page. Cross it out if you must, and keep it where you can see what you did.",
      },
      {
        id: "a-ma-w-rule-spacing",
        title: "Rule five: little and often beats long and rare",
        explain:
          "Forty minutes a day for five days will leave you with far more than a single four hour session at the weekend, even though the total time is similar. Memory is strengthened by coming back to something after a gap.",
        why: "Each time you bring something back to mind after forgetting a little of it, it returns stronger. A single long session never gives you the gap, so it never gets that benefit. This is also why this course returns to earlier skills in mixed reviews rather than finishing a topic and abandoning it.",
        analogy:
          "Watering a plant. The same amount of water given a little each day does far more than the whole month's worth poured on at once.",
      },
      {
        id: "a-ma-w-rule-mixing",
        title: "Rule six: mix your practice",
        explain:
          "Doing twenty questions on one topic in a row is easier and less useful than doing twenty questions where you do not know in advance which topic each one is. Choosing the method is half the skill, and practising one topic at a time removes that half entirely.",
        why: "In an exam, nothing tells you which topic a question belongs to. Practice that skips the identifying step trains you for a test that does not exist. Mixed practice feels harder and produces better results, which is why the difficulty is worth accepting.",
        analogy:
          "A goalkeeper who only practises penalties after being told which corner is coming is not practising penalties. The uncertainty is the thing being trained.",
      },
      {
        id: "a-ma-w-rule-aloud",
        title: "Rule seven: say it out loud, or teach it",
        explain:
          "Explaining a method aloud, to another person or to an empty room, exposes the parts you do not actually have. Writing works too. The act of putting it into words is the test.",
        why: "Understanding feels complete until you try to express it. The moment you have to say why a step is allowed, any gap becomes obvious immediately, and it becomes obvious to you rather than to a marker three weeks later.",
        practice: {
          prompt:
            "Pick something you learned recently and explain it aloud, in full sentences, as though to someone who has never met it.",
          answer:
            "Almost everyone finds a hesitation somewhere in the first attempt. That hesitation is exactly where the gap is, and finding it is the whole exercise. The second attempt is usually noticeably better, which is the benefit.",
        },
      },
      {
        id: "a-ma-w-rule-back",
        title: "Rule eight: go back without shame",
        explain:
          "If the thing in front of you does not make sense, the problem is almost always one or two steps below it. Going back to that step is not a setback. It is the shortest path forward.",
        why: "Because of how this subject compounds, ten minutes spent repairing a foundation frequently unlocks four topics at once. Students avoid it because going back feels like an admission. It is the most efficient move available, and this course is built to make it easy: when a practice question keeps going wrong, it tells you which earlier idea it keeps coming back to.",
        table: {
          caption: "The eight rules, and where this course applies each one.",
          headers: ["Rule", "How the course applies it"],
          rows: [
            ["Do it with a pen", "Every practice question needs a typed answer, not a click"],
            ["Struggle first", "No answer is shown before an attempt"],
            ["Explain every step", "Every rule is taught with its reason and its history"],
            ["Errors are information", "Wrong answers are named, not just marked"],
            ["Little and often", "Lessons are sized for one sitting"],
            ["Mix your practice", "Mixed reviews pull from earlier modules"],
            ["Say it out loud", "Practice prompts ask you to explain"],
            ["Go back without shame", "A failing question names the earlier skill"],
          ],
        },
      },
    ],

    task: {
      title: "Before you start Lesson 5",
      intro:
        "Five minutes, honestly, with a pen. This is the only module in the course with no mathematics in it, so this is the only chance to do this properly:",
      prompts: [
        "Write down the year you think mathematics started going wrong for you, and what was happening in it.",
        "Write down one topic you have avoided for years. Name it plainly.",
        "Write down one thing from Lesson 3 that you recognised. Six reasons were given; note which one is yours.",
        "Write down when you will study, on which days, for how long. Little and often, and put it somewhere you will see it.",
      ],
      closing:
        "Keep that page. In Month 3, when fractions come round, look at it again. A surprising number of people find that the topic they had avoided for years took about two weeks once the thing underneath it was fixed.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
