/**
 * MATHEMATICS · MONTH 1 · MODULE 1 · STARTING MATHEMATICS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This module opens with five sums, and that is the whole idea.
 *
 * Most people arriving here have been told, or have decided, that they cannot do
 * mathematics. Arguing with that does not work. Showing them otherwise does, and
 * it takes about twenty seconds: 1 + 1, 2 × 2, 10 ÷ 2, 20 − 5, 100 + 50. Nobody
 * who can answer those five is somebody who cannot do mathematics.
 *
 * ── THE ORDER OF THE FOUR LESSONS ────────────────────────────────────────
 *
 * Each lesson answers the question the previous one leaves the reader asking.
 *
 *   1. WHERE AM I?           You already have arithmetic. Here are the four
 *                            places it usually stops, and why being stopped
 *                            there is a topic nobody taught you, not a verdict.
 *   2. WHY BOTHER?           Every topic exists to answer a real question.
 *                            Here is where those questions come from (counting,
 *                            then money, time and measuring) and where they lead.
 *   3. WHAT WENT WRONG?      If the subject is learnable, why did it go wrong?
 *                            One fact about how it is built, five reasons that
 *                            follow from it, and the way out: understanding.
 *   4. HOW DO I DO IT NOW?   Five study habits that build understanding, then
 *                            the nine month road, how every lesson works, and
 *                            exactly what Module 2 starts with.
 *
 * ── WHAT THIS MODULE IS ALLOWED TO USE ───────────────────────────────────
 *
 * Adding, subtracting, multiplying and dividing whole numbers. Nothing else.
 *
 * That rule is stricter than it sounds and it has been enforced by deleting
 * things: an atom explaining two kinds of average, one on counting in base
 * twenty, a glossary of rows and columns, a floor area in square metres, a VAT
 * comparison. Each was interesting. Each asked a frightened beginner to accept
 * an idea in order to be told that the subject is approachable, which undoes
 * the only job an introduction has.
 *
 * ── THE OTHER TWO RULES THE COURSE HOLDS ITSELF TO ───────────────────────
 *
 * EVERY IDEA HAS A CAUSE. Mathematics was not handed down finished. Every piece
 * of it was invented by somebody to solve a problem they actually had, and
 * usually resisted by everyone else for a century afterwards. Told that way, a
 * rule stops being arbitrary. That is what the `origin` note on each atom is for.
 *
 * NO TERM BEFORE ITS MEANING. Every word is explained before it is used for
 * anything, and `npm run check:terms` fails the build if one is not. Most of
 * what feels like difficulty in this subject is not the mathematics. It is a
 * word nobody stopped to explain, used as though everybody already knew it, and
 * the reader who goes quiet at the word was never lost at the idea underneath.
 */

export const SECTION_ID = "ma-s1-welcome";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · WHERE YOU ARE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l1-what-is-maths",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 1,
    title: "Start Here: You Already Know Some Mathematics",
    subtitle: "What you can already do, where mathematics stops for most people, and what that really means",
    estimatedMinutes: 15,
    intro:
      "Before this course teaches you anything, it needs to find out where you are. This lesson does that in three steps: it shows you what you can already do, it shows you the exact place where mathematics usually stops for people, and then it tells you what that stopping point really means. It is not the thing you have been told it is.",

    atoms: [
      {
        id: "a-ma-w-you-already-know",
        title: "You already know some mathematics",
        explain:
          "Ask people about mathematics and most will say they are not good at it, or that they are afraid of it. Look closely and something else is usually true. They are perfectly fine with basic arithmetic, and they were stopped at one particular point. Before anything else, let us prove the first part of that to you.",
        why: "Starting anywhere else would be dishonest. If you are told the subject is hard and then shown something hard, you learn nothing except that you were right to worry. If you are shown that you can already do a real part of it, the question changes from whether you can do mathematics to which particular thing you were never taught.",
        example:
          "  Answer these in your head. Do not write\n  anything down and do not rush.\n\n      1  +  1   =  ?\n\n      2  ×  2   =  ?\n\n     10  ÷  2   =  ?\n\n     20  −  5   =  ?\n\n    100  +  50  =  ?\n\n\n  Answers: 2, 4, 5, 15, 150.\n\n  You did not struggle with those. You may\n  not even have felt yourself thinking.\n\n\n  THAT IS ARITHMETIC, AND YOU HAVE IT.\n\n  Adding, subtracting, multiplying,\n  dividing. Four things, and you can do\n  all four. That is not a small thing: it\n  is the floor the whole subject stands on,\n  and every topic in this course is built\n  out of those four.\n\n  Nobody who can answer those five is\n  somebody who cannot do mathematics.",
        practice: {
          prompt:
            "Get a pen and a piece of paper. You will need them for the whole course, so this is a good moment to find them. Work these out on paper rather than in your head: 24 + 38, 7 × 6, 96 ÷ 8, 105 − 47.",
          answer:
            "62, 42, 12 and 58. If you got all four, your arithmetic is sound and this course is going to be easier than you expect. If one came out wrong, look at which one, because that tells you something useful: it is one particular step to tighten, not a verdict on you. A common slip is 105 − 47 = 68, which comes from taking 7 from 5 the wrong way round. Month 2 goes through all four operations until they are automatic.",
        },
      },
      {
        id: "a-ma-w-where-it-stops",
        title: "And here is where mathematics usually stops",
        explain:
          "Now four more. These are the four places where almost everybody who says they are bad at mathematics actually got stopped. Read them and notice what happens in your chest, because that reaction is the honest starting point of this course.",
        why: "Naming the exact place it stops is worth more than any amount of encouragement. Almost nobody is bad at all of mathematics. Almost everybody who thinks they are has hit one of these four and taken it as proof about themselves, rather than as a gap in what they were taught.",
        example:
          "  Look at each of these. You do not have to\n  answer them.\n\n\n    1        1\n    -   +    -    =  ?\n    2        4\n\n\n    −5  +  3     =  ?\n\n\n    0.7  ×  0.5  =  ?\n\n\n    2x  +  6  =  12,   so x = ?\n\n\n  Most people feel something tighten at one\n  of those four, and for a great many it is\n  the last one.\n\n\n  THOSE FOUR ARE NOT HARDER ARITHMETIC.\n\n  They are four different topics, and each\n  one has its own small set of rules that\n  somebody has to be told:\n\n    1/2 + 1/4      is FRACTIONS\n    −5 + 3         is DIRECTED NUMBERS\n                   (numbers below zero)\n    0.7 × 0.5      is DECIMALS\n    2x + 6 = 12    is ALGEBRA\n\n  Nobody is born knowing those rules. Not\n  one person. They have to be taught, and\n  if they were taught to you quickly, or\n  badly, or on a day you were not there,\n  then you do not know them yet.\n\n  Not knowing them yet is a completely\n  different thing from not being able to\n  learn them.",
        practice: {
          prompt:
            "Be honest with yourself and write down which of the four made you most uncomfortable: fractions, negative numbers, decimals, or letters like x.",
          answer:
            "Whichever you wrote, this course reaches it within the first four months, from the beginning, with the rules explained rather than assumed. Directed numbers are Month 2. Fractions and decimals are Month 3. Letters arrive sooner than you might think: Module 2 of this month shows you what a letter is actually doing, and Month 4 teaches you to find it properly. Keep that note, because you will want to look at it again when you get there.",
        },
      },
      {
        id: "a-ma-w-not-arithmetic",
        title: "Not knowing a topic is not the same as not knowing mathematics",
        explain:
          "You know arithmetic. What you may not know yet is fractions, or directed numbers, or algebra. Those are separate topics with their own rules, and being stopped by one of them says nothing whatever about whether you can do mathematics. It says you have not been taught that topic yet.",
        origin:
          "Even the professionals had to be taught these, and several of them took centuries to be accepted. Negative numbers were called absurd in Europe and were still being argued about in the 1800s. Fractions were written in a clumsy way by Egyptian scribes for two thousand years. The letter x for an unknown is less than four hundred years old: it comes from Descartes, in a book of 1637. So when a topic feels unnatural to you, that is not a fact about you. Several of these ideas felt unnatural to the best mathematicians alive at the time, and they said so in print.",
        why: "This is the most important idea in the module, so it is worth reading twice. Mathematics is not one large thing you either have or lack. It is a set of separate topics, each with a short list of rules. Nobody knows a topic they have not been taught. That is not a shortcoming; it is a timetable.",
        example:
          "  Put the two lists side by side.\n\n\n  WHAT YOU COULD DO A MINUTE AGO:\n\n    1 + 1,  2 × 2,  10 ÷ 2,  20 − 5\n\n    These are arithmetic. You have them.\n\n\n  WHAT MAY HAVE STOPPED YOU:\n\n    2x + 6 = 12\n\n    This is algebra. It is a topic.\n\n\n  NOW LOOK AT WHAT IT ACTUALLY ASKS.\n\n  x is a number you have not been told.\n  2x means 2 lots of that number. So the\n  line reads:\n\n    2 lots of a number, and then 6 more,\n    makes 12. What is the number?\n\n  Solving it takes two steps:\n\n    Take 6 off both sides:   2x = 6\n    Halve both sides:         x = 3\n\n  Check it: 2 lots of 3 is 6, and 6 more\n  is 12. It works.\n\n  The arithmetic inside those steps is\n  12 − 6 and 6 ÷ 2, which you did in your\n  head a minute ago without noticing.\n\n  The only thing missing was knowing that\n  you are ALLOWED to take 6 off both sides,\n  and why. That is one rule. Somebody should\n  have told you. This course does.",
        mistake:
          "Reading a topic you were never taught as evidence about your ability. It is evidence about your timetable. The two feel identical from the inside and they are not remotely the same thing.",
      },
      {
        id: "a-ma-w-many-topics",
        title: "Mathematics is many topics, and each one answers a question",
        explain:
          "Mathematics is a broad subject made of separate topics, and each topic exists because somebody had a particular kind of everyday problem to solve. That is why the topics have different rules: they are answering different questions.",
        why: "This changes what it means to find something hard. You are not failing at a single enormous subject. You are meeting one topic out of many, and that topic has a job. Knowing the job makes the rules make sense, because the rules were built to do that job. The next lesson goes looking for those everyday questions in an ordinary day.",
        table: {
          caption: "Each topic, the everyday question it was built to answer, and when this course teaches it.",
          headers: ["Topic", "The question it answers", "Month"],
          rows: [
            ["Arithmetic", "How many altogether, and how many each?", "2"],
            ["Directed numbers", "What about below zero, or owing?", "2"],
            ["Fractions", "What if it does not divide evenly?", "3"],
            ["Decimals", "How do I handle money and measurements?", "3"],
            ["Percentages", "Is this discount actually a good deal?", "3"],
            ["Ratio", "How do I share this out fairly?", "4"],
            ["Measurement", "How much cloth, cement or tiles?", "4"],
            ["Algebra", "I know the total; what was the missing part?", "4"],
            ["Geometry", "What shape is it, and how big?", "5 and 8"],
            ["Statistics", "What is this information really telling me?", "8"],
          ],
          note: "You are not expected to recognise all of these names yet. Read the middle column: every topic was invented because somebody needed that question answered. None of them is there to make life difficult.",
        },
        practice: {
          prompt:
            "Which topic from the table was built for each of these? (a) The temperature in Jos fell below zero overnight. (b) Three loaves have to be shared equally between four children. (c) The bill was ₦5,000, the rice was ₦3,200, and you want to know what the rest cost.",
          answer:
            "(a) Directed numbers, because the amount has gone below zero. (b) Fractions, because 3 does not divide evenly by 4. (c) Algebra, because you know the total and need the missing part. Notice that you could answer (c) with one subtraction: ₦5,000 − ₦3,200 = ₦1,800. That is the point. Algebra is mostly arithmetic with a missing piece, written down in a way that still works when the numbers get awkward.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · WHY IT IS WORTH IT
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l2-why-it-matters",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 2,
    title: "Where Mathematics Turns Up in an Ordinary Day",
    subtitle: "Where it began, where you already use it, and where it can take you",
    estimatedMinutes: 14,
    intro:
      "Lesson 1 said every topic exists to answer a real question. This lesson goes looking for those questions: first where mathematics began, then where it hides in an ordinary day (money, time and measuring), and finally the doors it opens. Every calculation here uses only the arithmetic you showed you have in Lesson 1.",

    atoms: [
      {
        id: "a-ma-w-beginning",
        title: "Where mathematics began: counting",
        explain:
          "Mathematics started with one question: how many? Before writing, before money, before cities, people were keeping count, and the oldest evidence of it we have comes from Africa.",
        origin:
          "The Lebombo bone, found in the mountains between Eswatini and South Africa, is a piece of baboon bone with twenty nine notches cut into it. It is more than forty thousand years old and is the oldest known counting object in the world. The Ishango bone, found near Lake Edward in what is now the Democratic Republic of the Congo, is about twenty thousand years old, and its notches are cut in deliberate groups. Somebody sat down, a very long time ago, and kept a record of how many. That is where this subject starts.",
        why: "It is worth knowing that counting had to be invented, because it makes everything that follows easier to accept. Zero had to be invented. Negative numbers had to be invented. Fractions had to be invented. None of it was obvious, all of it was argued over, and every piece was made because somebody needed it. The rest of this lesson follows that need into an ordinary day.",
        example:
          "  A tally, which is still how people count today when the\n  count has to be kept while something else is going on:\n\n     |||| |||| |||| ||\n\n  Four strokes and a fifth across them, because the eye can\n  take in five at a glance and cannot take in seventeen.\n\n  That grouping instinct is the beginning of PLACE VALUE,\n  which means letting the position of a figure decide what\n  it is worth: the 3 in 30 is worth more than the 3 in 3.\n  It is Module 4 of this month.",
        analogy:
          "A herder with a pouch of pebbles, one pebble per goat. As the goats go out in the morning the pebbles move to one side of the pouch, and as they come back in the evening the pebbles move back. No counting words are needed, and no goat is lost without somebody noticing. That is a working number system.",
      },
      {
        id: "a-ma-w-money",
        title: "The mathematics in every price and every piece of change",
        explain:
          "The first thing people counted carefully was what they were owed, and that has not changed. Every price you are quoted, every piece of change you are handed, every offer to pay in instalments is a calculation somebody has already done. If you can do it too, you are deciding. If you cannot, you are being told.",
        origin:
          "Written mathematics and written money appear together. The earliest writing we have, from Mesopotamia about five thousand years ago, is not poetry or law but accounts: how much grain, owed by whom, to whom. Clay tokens were sealed inside clay envelopes so that a delivery could be checked against what was promised, and marks were pressed on the outside to say what was inside. Those marks became the first written numbers. People learned to write because they needed to keep track of what they were owed.",
        why: "This is the most practical argument for the subject there is. A trader who can work out what a sale actually earns prices correctly. A borrower who can work out what a loan will cost in total knows what they are agreeing to. Neither of those is advanced mathematics, and both are money most people simply lose.",
        example:
          "  SOMETHING YOU CAN ALREADY DO:\n\n    Three exercise books at ₦450 each.\n    You hand over ₦2,000.\n\n    3 lots of ₦450   =  ₦1,350\n    ₦2,000 − ₦1,350  =  ₦650 change\n\n  Count your change. People make mistakes,\n  and some of them are not mistakes.\n\n\n  AND SOMETHING JUST AS USEFUL:\n\n  Two shops sell the same soap.\n\n    Shop A:  6 bars for ₦1,500\n    Shop B:  4 bars for ₦1,080\n\n  Which is cheaper? The totals do not tell\n  you, because you are not buying the same\n  number of bars. So find the price of ONE.\n\n    Shop A:  1,500 ÷ 6  =  ₦250 a bar\n    Shop B:  1,080 ÷ 4  =  ₦270 a bar\n\n    Shop A is cheaper, by ₦20 a bar.\n\n  Two divisions. Nothing else. And it is a\n  decision you could make at a counter\n  today, with arithmetic you already had\n  before this lesson started.",
        mistake:
          "Comparing the totals. ₦1,080 looks cheaper than ₦1,500, and it is, for fewer bars. Two prices can only be compared once they are prices for the same amount, which is why you find the price of one.",
      },
      {
        id: "a-ma-w-time",
        title: "Telling the time, and why time does not count in tens",
        explain:
          "Working out when to leave, how long a journey takes, or how long until something is due is counting, with one complication: minutes count in sixties, not hundreds.",
        origin:
          "Blame the Babylonians. Around four thousand years ago they counted in groups of sixty, probably because sixty can be shared equally by two, three, four, five and six people, which makes dividing things up easy. Their astronomers divided the day and the circle that way, the Greeks kept it, and nobody has managed to change it since. Almost every other measurement in the world was eventually changed to count in tens. Time was not.",
        why: "Journey and time questions appear on every exam paper, and they are also some of the most common calculations in a working day for a driver, a trader moving goods, a nurse on shift or anyone catching a flight. The errors almost always come from treating minutes as though they counted in hundreds.",
        example:
          "  A bus leaves at 6:40 in the morning. The journey takes\n  3 hours and 50 minutes. When does it arrive?\n\n    6:40, add 3 hours            →   9:40\n    9:40, add 20 minutes         →  10:00\n    10:00, add the other 30      →  10:30\n\n  It arrives at 10:30.\n\n  Counting up to the next whole hour first is the trick, and\n  it works because 60 minutes make an hour.\n\n  The tempting wrong answer is 9:90. There is no such time.",
        analogy:
          "Money counts in hundreds: one hundred kobo make a naira. Time counts in sixties: sixty minutes make an hour. Using the habits of one on the other is where almost every time mistake comes from.",
      },
      {
        id: "a-ma-w-measure",
        title: "Measurement, and the trades that run on it",
        explain:
          "A tailor cutting cloth, a builder ordering blocks, a farmer spacing seedlings, a cook feeding a crowd. Every one of them is measuring and counting and working something out, whether or not they would call it mathematics. Some of it is length. Some of it is how much flat surface a floor or a farm covers, which is called its AREA, and some is how much a tank or a room holds, which is called its VOLUME.",
        origin:
          "The oldest units were parts of the body, because everybody carries them. A cubit was the length from the elbow to the fingertip, and the Great Pyramid was set out in cubits. The trouble is obvious: whose elbow? Egyptian builders solved it with a royal cubit rod kept as the standard, and every rod used on site was checked against it. That is the beginning of standard measurement, and it exists because a building whose parts were measured against different arms does not fit together.",
        why: "These are not invented textbook examples. Ordering too little cement stops a job; cutting cloth short ruins it. In every one of these trades the person who is confident with measurement wastes less and quotes more accurately, and both of those are money.",
        example:
          "  A tailor has 12 metres of cloth.\n  Each shirt needs 2 metres.\n  How many shirts?\n\n    12 ÷ 2  =  6 shirts\n\n  That is one division, and you can do it.\n\n\n  NOW THE PART A TEXTBOOK LEAVES OUT:\n\n  Cloth gets cut wrong. Sleeves need a bit\n  more than you thought. So a tailor who has\n  been doing this for years does not buy\n  exactly 12 metres for 6 shirts. They buy\n  a little more, and they are not bad at\n  arithmetic.\n\n  That last step is judgement, not a\n  calculation, and it is the part that\n  separates somebody who can calculate from\n  somebody who can run a business.\n\n\n  The same shape of question, everywhere:\n\n    How many blocks for that wall?\n    How much rice for 30 guests?\n    How far apart do the seedlings go?\n\n  Month 4 goes through all of it carefully.\n  Today the point is only that these are\n  mathematics, and that people do them\n  every day without calling them that.",
        table: {
          caption: "The trade, and the topic it is quietly using.",
          headers: ["Trade", "The mathematics", "Taught in"],
          rows: [
            ["Tailoring", "Measurement, scaling, ratio", "Month 4"],
            ["Building", "Area, volume, allowing for waste", "Months 4 and 8"],
            ["Carpentry", "Angles and square corners", "Months 5 and 8"],
            ["Catering", "Ratio, scaling a recipe, cost of one portion", "Month 4"],
            ["Farming", "Area, spacing, how much a field produces", "Months 4 and 8"],
          ],
        },
      },
      {
        id: "a-ma-w-careers",
        title: "Where mathematics can take you",
        explain:
          "In Nigeria a credit in mathematics is required for admission to almost every university course, not only the sciences. Beyond admission, it is the entry qualification for engineering, medicine, accounting, data work, finance, architecture, computing, and every trade that has to quote a price before doing the work.",
        why: "It is worth being plain about this rather than pretending the subject is only its own reward. Mathematics is the subject that most often decides which doors a Nigerian student can walk through, and failing it closes more of them than failing anything else. That is the last reason this lesson gives, and the one that should keep you going on a difficult day.",
        table: {
          caption: "What the subject is actually gatekeeping.",
          headers: ["Field", "What it needs"],
          rows: [
            ["Engineering, physics", "Algebra, trigonometry, calculus"],
            ["Medicine, pharmacy", "Statistics, ratio, dosage calculation"],
            ["Accounting, banking", "Percentage, interest, financial arithmetic"],
            ["Data and software", "Algebra, logic, statistics"],
            ["Architecture, surveying", "Geometry, measurement, angles"],
            ["Business of any kind", "Profit, break even, cash flow"],
          ],
          note: "INTEREST is the extra a lender charges you for borrowing money, or a bank pays you for keeping yours. Every topic in this table appears in this course, in the month the earlier ones have prepared you for. You are not expected to recognise all the names yet.",
        },
        practice: {
          prompt:
            "Name one thing you did in the last week that involved a calculation you did not think of as mathematics at the time.",
          answer:
            "There is no single right answer and the point is the noticing. Common ones: checking change, comparing two prices, working out how long until you had to leave, splitting a bill, deciding whether a data plan was worth it, judging how much fuel a trip would take. You are already using the subject. The course is about doing it with confidence, and then going much further.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · WHAT GOT IN THE WAY
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l3-why-it-feels-hard",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 3,
    title: "Why Mathematics Went Wrong for You Before",
    subtitle: "Five real reasons, and not one of them is you",
    estimatedMinutes: 15,
    intro:
      "If you can already do arithmetic, and the topics are learnable, and the subject is this useful, then why did it go wrong? This lesson answers that. It starts with one fact about how mathematics is built, then names five reasons it goes wrong for people, and ends with the way out. Every one of the five is fixable, which is the point of naming them.",

    atoms: [
      {
        id: "a-ma-w-cumulative",
        title: "Mathematics is the one subject where everything sits on what came before",
        explain:
          "In history you can miss one war and still do well on the next. In mathematics, if you miss how to share things into equal parts, you will later struggle with several topics that all quietly use it, and the difficulty will look as though it belongs to those topics. Mathematics is a ladder, and each rung is held up by the ones below it.",
        origin:
          "Mathematics is taught in a strict order largely because of one book. Euclid's Elements numbers its results and allows each one to use only the results already proved before it, and for more than two thousand years it was not merely a textbook but THE textbook: it was still in use in British and colonial schools in the 1800s. That habit, where nothing may be used before it has been established, is where the shape of every mathematics syllabus comes from, and it is why a gap early on causes trouble late.",
        why: "This one fact explains almost everything about why the subject feels different from the others, why it goes wrong quietly, and why going back is not a punishment but the fastest route forward. All five reasons in this lesson either come from it or make it worse. It is also why this course is ordered the way it is, and will not move you past an idea until it is working.",
        table: {
          caption: "One gap, and where it turns up later.",
          headers: ["The gap", "Where it shows up", "What it looks like"],
          rows: [
            ["Times tables", "Almost everything longer than one step", "Slow, and tiring"],
            ["Sharing into equal parts", "Fractions, ratio, chance", "Looks like failing at those topics"],
            ["The value of each figure in a number", "Decimals, rounding, large numbers", "Answers ten times too big"],
            ["Numbers below zero", "Solving equations, graphs", "Sign mistakes that seem random"],
            ["Reading a question", "Every word problem, in every topic", "Right method, wrong question answered"],
          ],
          note: "An EQUATION is a statement that two amounts are equal, like 2x + 6 = 12 from Lesson 1; solving it means finding the missing number. In each line of the table, the topic in the middle is where the low mark appears, and the one on the left is where the problem actually is.",
        },
        analogy:
          "Building a house. Nobody blames the roof when the foundation was rushed, and yet the roof is where the leak appears.",
      },
      {
        id: "a-ma-w-gaps",
        title: "Reason one: a small gap grows quietly",
        explain:
          "Because every topic rests on earlier ones, a gap does not stay where it started. It travels. Someone who never securely learned to share a quantity into equal parts meets that idea again and again under different names, and each time it looks like a new failure.",
        why: "This is why people describe mathematics as suddenly getting hard in a particular year. It rarely does. What usually happened is that a gap opened two or three years earlier, and that was the year the topics depending on it could no longer be avoided.",
        example:
          "  How one missed idea shows up four years later:\n\n    JSS1   Sharing into equal parts never quite secured\n     ↓\n    JSS2   Comparing two quantities feels random\n     ↓\n    JSS3   Working with letters looks impossible\n     ↓\n    SS2    Chance questions never come out neatly\n     ↓\n    SS3    Longer questions break at the last line\n\n  Five low marks, in five different topics, from one gap.",
        mistake:
          "Trying to fix the topic where the low mark appeared. If the marks are being lost on the sharing step of a chance question, the thing to repair is sharing, and repairing it fixes four topics at once.",
      },
      {
        id: "a-ma-w-procedures",
        title: "Reason two: rules taught without reasons",
        explain:
          "Turn it upside down and multiply. Move it to the other side and change the sign. Add a zero. These are instructions with no explanation attached, and they work right up until you misremember one detail.",
        origin:
          "This is not new and it is not local. In the twelfth century, European students learning the new Hindu and Arabic way of writing numbers were taught fixed recipes for calculating and called them algorisms, after Al-Khwarizmi, the Persian scholar whose book had carried the methods west. The word algorithm comes from his name. Even then there was an argument between those who taught the recipe and those who taught the reason, and the argument has never really stopped.",
        why: "A rule with no reason behind it cannot be checked or rebuilt. Someone who has forgotten a detail of a recipe has no way of deciding which version is right. Someone who knows what the recipe is doing can work it out again in seconds.",
        table: {
          caption: "The rule, and the reason it was hiding.",
          headers: ["What you were told", "What it actually is"],
          rows: [
            ["Add a zero when multiplying by ten", "Every figure moves one place to the left"],
            ["Move it over and change the sign", "Do the same thing to both sides, to keep them equal"],
            ["Two minuses make a plus", "Taking away a debt leaves you better off"],
            ["Turn it upside down and multiply", "How many of these fit into that"],
            ["Borrow one from the next place", "Exchange one ten for ten ones"],
          ],
          note: "The right hand column survives being forgotten. The left hand column does not. You are not expected to follow all of these yet; each one is taught properly in its place.",
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
          "A tailor who runs the machine quickly is not therefore a good tailor. What decides whether the clothes fit is the measuring and the cutting. Sewing speed helps because it gets the machine work out of the way so the attention can go on the fit, and that is exactly the job table facts do.",
        mistake:
          "Concluding from a timed test in Primary 4 that you cannot do this subject. That test measured how fast you could recall one narrow set of facts, and it was never evidence about anything else.",
      },
      {
        id: "a-ma-w-anxiety",
        title: "Reason four: going blank in a test is real, and it is not about ability",
        explain:
          "Anxiety about this subject takes up room in the part of your memory you use for holding the steps of a problem. That is why people go blank in tests on questions they can do calmly at home.",
        why: "Knowing how it works helps, because it stops you reading the blankness as evidence about your ability. It is not. It is a space problem: the attention that should be holding the problem is busy holding the fear.",
        table: {
          caption: "What actually reduces it, and why each one works.",
          headers: ["What helps", "Why it helps"],
          rows: [
            ["Writing the steps down", "Moves the load out of your head onto paper"],
            ["Practising until a step is automatic", "Frees the room that step was using"],
            ["Practising against a clock sometimes", "Rehearses the conditions, not just the content"],
            ["Starting with a question you can do", "Breaks the blank at the start of a paper"],
            ["Knowing mistakes are expected", "Removes the thing being feared"],
          ],
        },
        analogy:
          "Trying to count out money in a loud market while somebody stands over you hurrying you up. You know perfectly well how to count. The noise and the hurry are using the attention the counting needed, and you lose your place. Nothing about that is evidence that you cannot count.",
      },
      {
        id: "a-ma-w-myth",
        title: "Reason five: the myth of the mathematics person",
        explain:
          "The idea that some people simply have a mathematical brain and others do not is the most damaging belief in the subject. It is also not supported by the evidence, and countries where it is not widely held get better results across their whole population.",
        why: "The belief makes itself come true. If ability is fixed, effort is pointless, so a student who believes it stops trying at the first difficulty and reads the resulting failure as confirmation. If ability is built, difficulty is information about what to practise next, which is a completely different response to the same moment.",
        example:
          "  The same moment, two beliefs:\n\n    A question is hard and you are stuck.\n\n    Fixed:  This is the proof. I am not a maths person.\n            → stop\n\n    Built:  I am missing something particular. What is it?\n            → find it, practise it, continue\n\n  The question was identical. The next twenty minutes were not.",
        mistake:
          "Repeating the sentence about yourself. Saying I am just not good at maths out loud, often enough, does most of the work of making it true.",
      },
      {
        id: "a-ma-w-understanding",
        title: "The way out: understanding, not just remembering",
        explain:
          "All five reasons have the same cure. You can be told that five sixes are thirty and simply remember it. You understand it when you can see why it has to be thirty, and once you can see that, you have something to fall back on when the number slips out of your head.",
        why: "A remembered fact is a thing you can forget, and under exam pressure you will. An understanding is a thing you can rebuild. It fills gaps instead of hiding them, it gives every rule its reason, it does not depend on speed, it survives a blank moment in a test, and it is the clearest proof there is that ability is built. The next lesson is about how to study so that understanding is what you end up with.",
        example:
          "  You have 30 oranges to pack.\n\n\n  PACK THEM IN 5 BAGS, 6 in each bag:\n\n    bag 1   o o o o o o\n    bag 2   o o o o o o\n    bag 3   o o o o o o\n    bag 4   o o o o o o\n    bag 5   o o o o o o\n\n    5 bags of 6  =  30 oranges\n\n\n  NOW EMPTY THEM OUT AND PACK AGAIN,\n  this time 6 bags with 5 in each:\n\n    bag 1   o o o o o\n    bag 2   o o o o o\n    bag 3   o o o o o\n    bag 4   o o o o o\n    bag 5   o o o o o\n    bag 6   o o o o o\n\n    6 bags of 5  =  30 oranges\n\n\n  IT IS THE SAME 30 ORANGES.\n\n  You did not buy another one and you did\n  not eat one. You only packed them\n  differently. So the count cannot have\n  changed.\n\n  Which means 5 sixes and 6 fives have to\n  come to the same thing, and they do: 30.\n\n\n  WHY THAT IS WORTH MORE THAN THE FACT:\n\n  Learn that 5 sixes are 30 and you get\n  6 fives are 30 free, in the same breath.\n\n  And if the number ever leaves your head\n  in an exam, you can get back to it,\n  because you know what it means. Somebody\n  who only memorised has nothing to fall\n  back on.",
        practice: {
          prompt:
            "Somebody tells you that to multiply a whole number by ten you just add a zero on the end. Is that something to remember, or something you understand?",
          answer:
            "Something to remember. It gives the right answer for whole numbers and it says nothing about why. Module 4 of this month gives the reason, and the reason turns out to matter, because the add-a-zero rule quietly stops working later in the course and the reason never does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · HOW TO DO IT THIS TIME
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l4-rules-for-learning",
    moduleId: "ma-m1-welcome",
    sectionId: SECTION_ID,
    order: 4,
    title: "How to Study Mathematics So It Sticks",
    subtitle: "Five habits, the road ahead, and what comes next",
    estimatedMinutes: 16,
    intro:
      "Lesson 3 ended with the cure: understanding rather than remembering. This lesson is how you get it. Five study habits come first, each with the reason it works. Then the whole nine month road, how every lesson in this course is put together, and exactly where you go after this module.",

    atoms: [
      {
        id: "a-ma-w-rule-pen",
        title: "Habit one: do the mathematics with a pen",
        explain:
          "Reading a worked solution and following it is not learning mathematics. It feels like learning, because everything makes sense as you read. Close the page, try it yourself, and you find out what you actually have.",
        why: "This is the biggest single gap between how people study and what works. Recognising a method when you see it and producing it from a blank page are different abilities, and only the second one is tested. Every other habit in this lesson builds on this one.",
        example:
          "  Two students, one hour each, the same worked examples.\n\n    Student A  reads all twelve, nodding, following each.\n    Student B  reads one, closes it, tries it, gets stuck,\n               looks, finishes it, then does the next.\n\n  Student B gets through four. Next week, Student B will get\n  more of them right than Student A could on the same day.",
        mistake:
          "Measuring study by how much you covered. A page you worked through with a pen is worth more than ten pages you read.",
      },
      {
        id: "a-ma-w-rule-struggle",
        title: "Habit two: struggle first, then look",
        explain:
          "When you are stuck, the useful thing is to stay stuck for a few minutes before looking at the answer. Looking teaches far more after you have tried than before.",
        why: "Trying to work something out, even when you fail, prepares the mind to take in the answer. Looking too early feels efficient and mostly produces the feeling of understanding rather than the thing itself. A few minutes of honest struggle before a hint is worth more than the hint on its own.",
        table: {
          caption: "How this course paces help, so you can struggle first.",
          headers: ["Where you are", "What happens"],
          rows: [
            ["A quick practice inside a lesson", "The answer stays hidden until you press Think first, then reveal. Think first."],
            ["A practice drill, before you answer", "Three hints, one at a time if you ask: a nudge, then the method, then the first step worked"],
            ["A drill, after a wrong answer", "Your mistake is named, the full working is shown, then you get a fresh question on the same skill"],
            ["The check at the end of a lesson", "Each wrong answer explains what went wrong and which idea to look at again"],
          ],
          note: "There is no button in a drill that skips a question. Taking a hint is never a penalty. Taking it before you have tried is just a waste of it.",
        },
      },
      {
        id: "a-ma-w-rule-explain",
        title: "Habit three: never accept a step you cannot explain",
        explain:
          "If a line of working appears and you do not know why it is allowed, stop. Write the question down. A step you cannot explain is a rule you are borrowing, and it will not be there when you need it.",
        why: "This is the habit that cures Reason two from Lesson 3. Every step in this subject has a reason, the reasons are usually short, and collecting them is what makes the whole thing hold together instead of being four hundred separate instructions.",
        example:
          "  Working you are given:\n\n      47\n    + 38\n    ————\n      85\n\n  with a small 1 written above the 4.\n\n  The question to ask: what is that 1, and why is it there?\n\n  The answer: 7 and 8 make 15, which is one ten and five\n  ones. The 5 stays in the ones place, and the ten will not\n  fit there, so it moves across to join the tens.\n\n  That single reason covers every carry you will ever do.",
        practice: {
          prompt:
            "Find one thing in mathematics you can do but could not explain to someone else. Write down the question you would need answered.",
          answer:
            "Common ones: why you add a zero when multiplying by ten, why you borrow in subtraction, why a minus and a minus make a plus, why you cannot divide by zero. Every one of those is answered in the first two months of this course, and because you have written the question down, you will notice when the answer arrives.",
        },
      },
      {
        id: "a-ma-w-rule-spacing",
        title: "Habit four: little and often beats long and rare",
        explain:
          "Forty minutes a day for five days will leave you with far more than a single four hour session at the weekend, even though the total time is about the same. Memory is strengthened by coming back to something after a gap.",
        why: "Each time you bring something back to mind after forgetting a little of it, it returns stronger. A single long session never gives you the gap, so it never gets that benefit. This is also why the course keeps bringing back earlier skills in mixed review drills, instead of finishing a topic and leaving it behind.",
        analogy:
          "Watering a plant. The same amount of water given a little each day does far more than the whole month's worth poured on at once.",
      },
      {
        id: "a-ma-w-rule-back",
        title: "Habit five: go back without shame",
        explain:
          "If the thing in front of you does not make sense, the problem is almost always one or two steps below it. Going back to that step is not a setback. It is the shortest way forward.",
        why: "Because the subject is a ladder, ten minutes spent repairing a lower rung often unlocks four topics at once. People avoid it because going back feels like admitting something. It is the most efficient move available, and this course is built to make it easy: when you get a question wrong, it tells you which idea to go back to.",
        table: {
          caption: "The five habits, and where the course builds each one in.",
          headers: ["Habit", "How the course supports it"],
          rows: [
            ["Do it with a pen", "Drill answers are typed in, not picked from a list"],
            ["Struggle first, then look", "Answers and hints wait until you ask for them"],
            ["Explain every step", "Every rule is taught with its reason, and often its history"],
            ["Little and often", "Lessons are sized for one sitting, and review drills bring old skills back"],
            ["Go back without shame", "A wrong answer names the idea to return to"],
          ],
        },
      },
      {
        id: "a-ma-w-what-this-course-does",
        title: "The road ahead, and where you start",
        explain:
          "This course starts at the bottom and goes up in order, one topic at a time, with the rules explained rather than assumed. Nine months, from the arithmetic you showed you have in Lesson 1 to the point where a university lecture makes sense.",
        why: "Order is the whole design, because of the ladder in Lesson 3. Fractions need sharing and times tables, so those come first. Algebra uses fractions and negative numbers, so those come first. Every time you meet something new it will rest only on things already built, which is what makes it possible to keep up.",
        table: {
          caption: "The road, in order.",
          headers: ["Month", "What you work on"],
          rows: [
            ["1", "Starting mathematics: the words in a question, the kinds of numbers, place value"],
            ["2", "How numbers work: the four operations properly, below zero, factors"],
            ["3", "Parts of a whole: fractions, decimals, percentages, rounding"],
            ["4", "Ratio, measuring, patterns, and solving for your first x"],
            ["5", "Powers, money, graphs and shape"],
            ["6", "Algebra in earnest, and BECE readiness"],
            ["7", "The senior number system"],
            ["8", "Shape, angle and data"],
            ["9", "Calculus, WAEC, NECO and JAMB technique, and the bridge to university"],
          ],
          note: "Notice that solving for x properly is Month 4, not Month 1. Three months of foundation come first, on purpose, because every one of them is used inside algebra.",
        },
        example:
          "  HOW EVERY LESSON WORKS.\n\n  Each idea is explained in plain words,\n  with the reason it is true, a worked\n  example, and often the story of who\n  needed it and why. Quick practice and\n  drills come with it. At the end of each\n  lesson there is a short check, and you\n  need 70% to pass it and move on. If you\n  fall short, it tells you which ideas to\n  look at again.\n\n\n  THREE PROMISES THIS COURSE MAKES.\n\n  1.  NOTHING BEFORE ITS TIME.\n      No lesson will use an idea the course\n      has not taught yet.\n\n  2.  NO WORD WITHOUT ITS MEANING.\n      Every term is explained before it is\n      used, however ordinary it looks.\n\n  3.  EVERY RULE HAS A REASON.\n      You will never be told to do something\n      without being told why it works.\n\n  If you ever find one of those broken,\n  that is a mistake on our side, not yours.\n\n\n  WHERE YOU GO NEXT.\n\n  Module 2, The Language of Mathematics.\n\n  Before any new sums, you learn to read a\n  question: what evaluate, simplify and\n  solve each ask for, and what a letter\n  like x is really doing. Many marks are\n  lost by answering the wrong question,\n  not by getting the mathematics wrong.\n\n  Then Module 3 sorts out the different\n  kinds of number, Module 4 shows how the\n  position of a figure gives it its value,\n  and Month 2 starts on the operations.\n\n  Keep your pen and paper beside you.",
      },
    ],

    task: {
      title: "Before you start Module 2",
      intro:
        "Five minutes, with a pen and paper. This module has been about you rather than about sums, so this is the right moment to write these down honestly:",
      prompts: [
        "Write down the year you think mathematics started going wrong for you, and what was happening at the time.",
        "Write down the one of the four from Lesson 1 that stopped you: fractions, negative numbers, decimals or letters. Or another topic you have avoided for years. Name it plainly.",
        "Write down which of the five reasons from Lesson 3 you recognised in yourself.",
        "Write down when you will study: which days, at what time, and for how long. Little and often. Put it somewhere you will see it.",
      ],
      closing:
        "Keep that page. When the topic you named comes round, look at it again. A surprising number of people find that the topic they had avoided for years took about two weeks, once the thing underneath it was fixed.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
