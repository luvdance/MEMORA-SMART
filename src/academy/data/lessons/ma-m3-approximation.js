/**
 * MATHEMATICS · MONTH 3 · MODULE 4 · APPROXIMATION AND DEGREE OF ACCURACY
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This module closes Month 3 and it is the one that quietly decides how many
 * marks the other three earn, because every answer in them had to be rounded
 * somewhere.
 *
 * It rests on one honest idea that school mathematics often hides: a measured
 * number is never exact. A length given as 12 cm to the nearest centimetre is
 * any length from 11.5 to 12.5, and writing it as 12 is a claim about how much
 * you know rather than a statement of fact. Once that lands, significant
 * figures stop being a spelling rule and bounds stop being a strange extra
 * topic. They are both the same admission, written down carefully.
 *
 * The rule that matters most: round ONCE, at the end. Every intermediate
 * rounding is a small systematic error, and systematic errors accumulate
 * rather than cancelling.
 */

export const SECTION_ID = "ma-s3-approximation";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l45-decimal-places",
    moduleId: "ma-m3-approximation",
    sectionId: SECTION_ID,
    order: 1,
    title: "Rounding to Decimal Places",
    subtitle: "One digit decides, and the rest are irrelevant",
    estimatedMinutes: 13,
    intro:
      "You rounded whole numbers in Month 1 and the method has not changed. Only the columns being rounded to are new, and they are the ones you met in the decimals module. One digit decides every rounding, and knowing which digit that is, is the whole skill.",

    atoms: [
      {
        id: "a-ma-ap-decimal-places",
        title: "Rounding to a given number of decimal places",
        explain:
          "To round to two decimal places, keep two digits after the point and look at the next one. If that next digit is 5 or more, the last kept digit goes up by one. If it is 4 or less, the kept digits stay as they are. Everything beyond is discarded.",
        why: "Nearly every calculation in the rest of the course ends with an instruction of this kind, and it is marked separately from the mathematics. A correct answer given to the wrong number of places loses a mark that the working had already earned.",
        example:
          "  Round 3.14159 to various places.\n\n  To 1 d.p.:  keep 3.1,  next digit is 4  ->  3.1\n  To 2 d.p.:  keep 3.14, next digit is 1  ->  3.14\n  To 3 d.p.:  keep 3.141, next is 5       ->  3.142\n  To 4 d.p.:  keep 3.1415, next is 9      ->  3.1416\n\n\n  ONLY THE NEXT DIGIT MATTERS:\n\n  Round 2.34999 to 1 decimal place.\n\n    Keep 2.3. The next digit is 4, so it stays 2.3.\n\n  The three 9s after it change nothing. They are not\n  allowed a vote. This is the same rule as Month 1:\n  one digit decides, and the rest are irrelevant.\n\n\n  WHEN ROUNDING CARRIES:\n\n  Round 4.97 to 1 decimal place.\n\n    Keep 4.9, next digit is 7, so the 9 goes up.\n    9 + 1 = 10, so it carries: the answer is 5.0\n\n  Write the 5.0, not just 5. The instruction asked\n  for one decimal place, and the zero is stating\n  the accuracy you are claiming.",
        mistake:
          "Rounding in stages, so 2.34999 becomes 2.35 and then 2.4. Each stage lets a digit vote twice. Look at the one deciding digit and nothing else.",
        drill: {
          skill: "L0-N1.4",
          count: 3,
          intro:
            "Three rounding questions. Find the deciding digit first, and cover everything after it with a finger.",
        },
      },
      {
        id: "a-ma-ap-what-rounding-claims",
        title: "What a rounded number is actually claiming",
        explain:
          "A number given to a stated accuracy is not a fact, it is a range. A length of 12.4 cm to one decimal place means the true length is somewhere from 12.35 to 12.45. Writing more digits than you know is a claim you cannot support.",
        origin:
          "This became a formal part of arithmetic when measurement became precise enough to need it. An astronomer or a surveyor works with figures that are already approximate, since no instrument is perfect, and carrying twelve digits of a measurement accurate to three is a way of overstating what you know. The rule that you round once, at the end, comes from exactly that concern, and so does the whole idea of significant figures: the digits you may honestly write are the ones your instrument earned.",
        why: "This is the idea that makes the rest of the module make sense. Significant figures, bounds and percentage error are all ways of being honest about a range, and a student who thinks of a rounded number as a slightly wrong exact number finds all three arbitrary.",
        example:
          "  A length is stated as 12 cm, to the nearest cm.\n\n  What could the true length be?\n\n    11.5 ........... 12 ........... 12.5\n      |                              |\n    anything from here to here rounds to 12\n\n  So 12 cm means: between 11.5 and 12.5 cm.\n\n\n  The SAME measurement stated more precisely:\n\n  12.4 cm, to 1 decimal place, means between\n  12.35 and 12.45. A narrower range, because more\n  is being claimed.\n\n  12.40 cm, to 2 decimal places, means between\n  12.395 and 12.405. Narrower again, and note that\n  12.4 and 12.40 are the same NUMBER while being\n  different CLAIMS about accuracy.\n\n\n  Why it matters practically:\n\n  If a shelf is 12 cm to the nearest cm and a gap is\n  also 12 cm to the nearest cm, the shelf might not\n  fit. It could be 12.4 and the gap 11.6.",
        mistake:
          "Treating a rounded figure as exact in a later calculation and then reporting a long answer. If a measurement was given to two significant figures, an answer quoted to six is dishonest about the accuracy, and mark schemes penalise it.",
      },
      {
        id: "a-ma-ap-round-once",
        title: "Round once, at the end",
        explain:
          "Carry the full figure through every step of a calculation and round only the final answer. Rounding partway through introduces an error that the remaining steps then multiply. The perimeter used below is the distance all the way round the outside of a shape, and Month 4 teaches it properly.",
        why: "This is the most expensive habit in the module and the easiest to fix. It matters most when a rounded value is multiplied, because the error gets multiplied too, and in money questions it turns into real missing naira.",
        example:
          "  A rectangle 7 m by 3 m. Find the length of the\n  path all the way round and then the cost of fencing\n  it at 1,333.33 naira per metre, to the nearest naira.\n\n  Perimeter = 2 x (7 + 3) = 20 m\n\n  ROUNDED EARLY, badly:\n\n    Round the rate to 1,333\n    20 x 1,333 = 26,660 naira\n\n  ROUNDED AT THE END, correctly:\n\n    20 x 1,333.33 = 26,666.60\n    To the nearest naira: 26,667\n\n  Seven naira apart, from one premature rounding,\n  and the gap grows with the quantity.\n\n\n  THE SAME POINT WITH A RECURRING DECIMAL:\n\n  Find 1/3 of 4,800, then double it.\n\n    Correct:  4,800 / 3 = 1,600, doubled = 3,200\n    Early:    1/3 as 0.33, so 1,584, doubled = 3,168\n\n  32 naira lost to a rounding that was never needed,\n  because 4,800 divides by 3 exactly.",
        mistake:
          "Writing down a rounded intermediate value and then using the written figure rather than the full one. Keep the full value in the calculator or on the page, and round only what you present as the answer.",
      },
      {
        id: "a-ma-ap-nearest-what",
        title: "To the nearest ten, hundred, naira or kobo",
        explain:
          "An instruction can name a place value rather than a number of decimal places. To the nearest ten, hundred or thousand works to the left of the point, and to the nearest naira or kobo names a money column. The method is identical: find the deciding digit and look at it.",
        why: "Both forms of the instruction appear in the same paper, and candidates who have only practised decimal places sometimes freeze at 'to the nearest hundred'. It is the same rule reading a different column.",
        table: {
          caption: "The same number, several instructions.",
          headers: ["Instruction", "4,847.62 becomes", "Deciding digit"],
          rows: [
            ["To the nearest thousand", "5,000", "The 8 in the hundreds"],
            ["To the nearest hundred", "4,800", "The 4 in the tens"],
            ["To the nearest ten", "4,850", "The 7 in the units"],
            ["To the nearest whole number", "4,848", "The 6 in the tenths"],
            ["To the nearest naira", "4,848", "The 6 in the tenths"],
            ["To the nearest kobo", "4,847.62", "Already there"],
          ],
          note: "Read the second row carefully. To the nearest hundred, 4,847.62 is 4,800, because the tens digit is 4. The 47.62 that follows does not get a vote, however close to 50 it looks.",
        },
        mistake:
          "Rounding to the nearest ten when the question said the nearest hundred, or dropping the zeros so that 4,800 is written as 48. The zeros are holding columns open, exactly as in Month 1.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l46-significant-figures",
    moduleId: "ma-m3-approximation",
    sectionId: SECTION_ID,
    order: 2,
    title: "Significant Figures",
    subtitle: "Which digits count, and the trouble with zeros",
    estimatedMinutes: 15,
    intro:
      "Significant figures count the digits that carry information rather than the digits after the point. The whole difficulty is zeros, because a zero sometimes carries information and sometimes only holds a column open, and the rule depends on where it sits.",

    atoms: [
      {
        id: "a-ma-ap-sig-figs",
        title: "What makes a figure significant",
        explain:
          "Counting starts at the first non zero digit and continues rightwards. So 4,872 to two significant figures is 4,900, and 0.004872 to two significant figures is 0.0049. The leading zeros in the second one are not counted, because they are only saying where the number sits.",
        origin:
          "Significant figures are a habit that came out of practical measurement rather than out of pure mathematics, and they were formalised as scientific instruments improved through the 1700s and 1800s. The underlying question is the one from the previous lesson: how many digits has my instrument actually earned? A ruler marked in millimetres earns three or four digits on an everyday length and no more, so writing eight is a false claim. Decimal places cannot express that on their own, because a measurement of 0.00487 and one of 4,870 can be equally precise while having wildly different numbers of decimal places. Significant figures count precision instead of position, which is why science uses them and school mathematics inherited them.",
        why: "Two significant figures is the standard instruction for estimation, and three is the commonest accuracy demanded in senior papers. It is also the only sensible way to state the accuracy of a very large or a very small number, which is why it pairs with standard form in Month 5.",
        example:
          "  Counting starts at the first non zero digit:\n\n    4,872      4 s.f.   all four digits count\n    4,872      2 s.f.    4,900   (the 7 rounds the 8 up)\n    4,872      1 s.f.    5,000   (the 8 rounds the 4 up)\n\n    0.004872   2 s.f.    0.0049\n               The three zeros before the 4 are not\n               significant. They place the number.\n\n    0.004872   1 s.f.    0.005\n\n\n  ZEROS IN THE MIDDLE ALWAYS COUNT:\n\n    4.087      4 s.f.   the zero is trapped between\n                        significant digits, so it\n                        carries information\n\n    4.087      3 s.f.   4.09\n\n\n  THE ZEROS THAT REPLACE DISCARDED DIGITS:\n\n  4,872 to 2 s.f. is 4,900, not 49. The two zeros\n  are holding the hundreds and tens columns open,\n  and dropping them changes the number by a factor\n  of a hundred.",
        mistake:
          "Counting leading zeros, so that 0.0049 is called four significant figures. Counting starts at the first digit that is not zero, and everything before it is placing the number rather than measuring it.",
      },
      {
        id: "a-ma-ap-sig-vs-dp",
        title: "Significant figures against decimal places",
        explain:
          "Decimal places count from the point. Significant figures count from the first non zero digit. They often disagree, and the instruction tells you which one is wanted, so the first job is reading which word was used.",
        why: "Candidates lose marks by answering one instruction when the other was given, and the two can differ enormously on small numbers. For 0.00456, two decimal places gives 0.00 and two significant figures gives 0.0046. One of those is useless, and which is wanted is not a matter of taste.",
        table: {
          caption: "Where the two instructions part company.",
          headers: ["Number", "To 2 d.p.", "To 2 s.f."],
          rows: [
            ["3.14159", "3.14", "3.1"],
            ["0.00456", "0.00", "0.0046"],
            ["12.985", "12.99", "13"],
            ["4,872", "4,872.00", "4,900"],
            ["0.0999", "0.10", "0.10"],
          ],
          note: "The second row is the one that matters. To two decimal places, 0.00456 rounds away to nothing at all, while to two significant figures it keeps exactly the information it had. Small numbers need significant figures.",
        },
        mistake:
          "Reading 's.f.' as 'decimal places' when skimming a paper under time pressure. Underline the instruction, which is the habit the Month 1 language module asked for.",
      },
      {
        id: "a-ma-ap-estimating-1sf",
        title: "Estimating by rounding to one significant figure",
        explain:
          "To estimate a calculation, round every number to one significant figure and work it out. The result will not be exact and it will be the right size, which is what an estimate is for.",
        origin:
          "Estimating to one significant figure has a name in physics: a Fermi estimate, after Enrico Fermi, who was known for getting usefully close to an answer from almost no information. The most repeated story has him estimating the energy released by the first atomic test in 1945 by dropping scraps of paper and watching how far the blast wave pushed them sideways. The point of the method is not that it is accurate. It is that being right about the SIZE of an answer is usually what matters, and it can be had in seconds, so anybody who works with numbers professionally does it constantly before trusting a calculation.",
        why: "This is the most useful single technique in the whole of arithmetic, because almost every serious error is a factor of ten rather than a small slip. An estimate catches those, and it is also examined directly: papers ask for an estimate and mark the estimate, not the exact answer.",
        example:
          "  Estimate  (38.7 x 6.2) / 0.48\n\n  One significant figure each:\n\n    38.7  ->  40\n     6.2  ->   6\n    0.48  ->   0.5\n\n    (40 x 6) / 0.5  =  240 / 0.5  =  480\n\n  The exact answer is 499.9, so the estimate was\n  close enough to confirm the size and to rule out\n  49.99 and 4,999.\n\n\n  Note the division by 0.5. Dividing by a half\n  DOUBLES, which is the fraction lesson again, and\n  it is the step candidates get backwards. If your\n  estimate had come out at 120 you would have\n  divided by 2 instead of by 0.5.\n\n\n  A shopping estimate, which is the same skill:\n\n    1,890 + 4,120 + 970 + 2,340\n\n    2,000 + 4,000 + 1,000 + 2,000 = 9,000\n\n  Exact: 9,320. Close enough to know whether a\n  10,000 naira note will cover it.",
        mistake:
          "Rounding to one significant figure and then doing the arithmetic to several decimal places. The whole point is speed and size, so keep the numbers friendly all the way through.",
      },
      {
        id: "a-ma-ap-when-to-round",
        title: "Reading the accuracy a question demands",
        explain:
          "If a question states an accuracy, use it. If it does not, match the accuracy of the figures you were given: data to two significant figures does not support an answer to five. For money, use two decimal places. For an exact answer, leave it as a fraction.",
        why: "Unstated accuracy is where candidates guess, and guessing wrongly costs a mark on a question they had otherwise finished. Matching the given data is the default a marker expects, and it is also the honest choice.",
        table: {
          caption: "What to do when the question does not say.",
          headers: ["Situation", "Give the answer", "Because"],
          rows: [
            ["Money", "2 decimal places", "The kobo is the smallest real unit"],
            ["Data given to 3 s.f.", "3 s.f.", "You cannot know more than you were told"],
            ["A fraction that divides exactly", "Exactly", "Nothing needs rounding"],
            ["A fraction that recurs", "As a fraction, or as stated", "The fraction is the exact form"],
            ["An estimate is asked for", "1 s.f.", "That is what estimating means"],
            ["A length from a measurement", "As given, or 3 s.f.", "Match the instrument"],
          ],
          note: "When genuinely unsure, three significant figures is the safest default in senior papers, and stating the accuracy you used costs nothing and shows the marker you thought about it.",
        },
        practice: {
          prompt:
            "A question gives a radius of 2.5 cm and asks for a length, with no accuracy stated. To how many figures should the answer be given, and why?",
          answer:
            "The data has two significant figures, so the answer should not claim more than about two or three. Three significant figures is the safe convention in senior papers and no marker penalises it. Giving eight digits would claim a precision the 2.5 never had, and that is the error the instruction is guarding against.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l47-bounds",
    moduleId: "ma-m3-approximation",
    sectionId: SECTION_ID,
    order: 3,
    title: "Upper and Lower Bounds",
    subtitle: "The range a rounded measurement is really claiming",
    estimatedMinutes: 15,
    intro:
      "If a length is 12 cm to the nearest centimetre, it is not 12 cm. It is somewhere from 11.5 to 12.5, and this lesson is about working with that honestly. It is the same idea as the previous lesson stated as two numbers instead of one.",

    atoms: [
      {
        id: "a-ma-ap-bounds",
        title: "Finding the bounds of a rounded measurement",
        explain:
          "Take half of the unit the measurement was rounded to, then add it and subtract it. A length of 12 cm to the nearest cm has bounds of 11.5 and 12.5. A mass of 4.7 kg to one decimal place has bounds of 4.65 and 4.75.",
        origin:
          "Bounds are the idea that made mass production possible, and before it existed nothing was interchangeable. A gunsmith in the 1700s made each weapon as a matched set, so a part from one would not fit another, and a repair meant a craftsman filing metal until it seated. Manufacturing to a stated tolerance, meaning a part is acceptable anywhere within a declared range, is what allowed parts to be made in different places and assembled somewhere else. Every screw, bearing and pipe fitting in the world is specified that way now. When an engineer writes 12 mm with a tolerance, they are writing a lower bound and an upper bound, and this atom is that habit in its school form.",
        why: "Bounds are examined directly in senior papers, and they are the honest form of every measurement in engineering, construction and manufacture. A part made to 12 mm has a tolerance, and the tolerance is this idea with a professional name.",
        example:
          "  Half of the rounding unit, added and subtracted.\n\n  12 cm, to the nearest cm\n    Unit: 1 cm.  Half: 0.5\n    Lower bound 11.5,  upper bound 12.5\n\n  4.7 kg, to 1 decimal place\n    Unit: 0.1 kg.  Half: 0.05\n    Lower bound 4.65,  upper bound 4.75\n\n  350 people, to the nearest 10\n    Unit: 10.  Half: 5\n    Lower bound 345,  upper bound 355\n\n  4,900, to 2 significant figures\n    The rounding was to the nearest 100.\n    Half: 50\n    Lower bound 4,850,  upper bound 4,950\n\n\n  ON THE LINE:\n\n     11.5          12          12.5\n      |-------------|-------------|\n      lower                     upper\n\n  Everything in that stretch rounds to 12.",
        mistake:
          "Using the last digit rather than the rounding unit. For 4.7 to one decimal place the unit is 0.1, so the half is 0.05, not 0.5. Ask what the number was rounded TO, then halve that.",
      },
      {
        id: "a-ma-ap-bounds-edges",
        title: "Why the upper bound is written as it is",
        explain:
          "A length of exactly 12.5 would normally round up to 13, so strictly the true length is less than 12.5 rather than equal to it. The convention is to quote 12.5 as the upper bound and understand that the true value does not reach it.",
        why: "This is worth one clear sentence because students often find the edge confusing and invent rules to deal with it, such as writing 12.49 or 12.4999. The convention is to write the half and know what it means, and that is what mark schemes expect.",
        example:
          "  A length of 12 cm to the nearest cm.\n\n    Lower bound:  11.5     can be exactly this\n    Upper bound:  12.5     cannot quite reach this\n\n  Written formally, with L for the true length:\n\n    11.5  <=  L  <  12.5\n\n  Read it as: at least 11.5, and under 12.5.\n\n  Do NOT write the upper bound as 12.49 or 12.4999,\n  which invents a precision the convention does not\n  have. Write 12.5 and use the correct inequality.\n\n  The two symbols differ deliberately. The lower one\n  is reachable and the upper one is not, and that is\n  all the asymmetry means.",
        mistake:
          "Writing 12.4 or 12.49 as the upper bound. The bound is the half way point itself, and the strictness is carried by the inequality sign rather than by shaving digits off the number.",
      },
      {
        id: "a-ma-ap-bounds-in-use",
        title: "Bounds in a real decision",
        explain:
          "Bounds answer questions that a single rounded figure cannot. Will this shelf fit that gap, is this load within the limit, could these two measurements actually be equal. The method is to test the worst case rather than the stated one.",
        why: "This is where the topic stops being an exercise. Two things both measured as 12 cm may differ by nearly a centimetre, and anybody building, cutting or loading anything has to reason with the extremes rather than the middle.",
        example:
          "  A shelf is 12 cm wide and a gap is 12 cm wide,\n  both to the nearest cm. Will the shelf fit?\n\n    Shelf:  11.5  to  12.5\n    Gap:    11.5  to  12.5\n\n  WORST CASE: the shelf is nearly 12.5 and the gap\n  is 11.5. Then it does not fit.\n\n  BEST CASE: the shelf is 11.5 and the gap is\n  nearly 12.5. Then it fits with a centimetre spare.\n\n  Honest answer: it MIGHT fit, and the measurements\n  are not precise enough to say. Measure to a\n  millimetre if the answer matters.\n\n\n  A LOAD LIMIT, where the worst case is the point:\n\n  A lift takes 500 kg. Eight people are each\n  weighed as 62 kg to the nearest kg.\n\n    Each could be up to 62.5\n    Worst case total: 8 x 62.5 = 500 kg\n\n  At the stated figures the total is 496 kg, which\n  looks safe. At the worst case it is exactly at the\n  limit. An engineer works from the second number,\n  and that is the entire reason bounds are taught.",
        practice: {
          prompt:
            "A plank is 240 cm to the nearest 10 cm. Four pieces of 60 cm, each to the nearest cm, are cut from it. Could the plank be too short?",
          answer:
            "The plank could be as little as 235 cm. Each piece could be as much as 60.5 cm, so four could need up to 242 cm. So yes, it could be too short, and at the stated figures 240 against 240 looks exactly sufficient. That gap between the stated figures and the worst case is what bounds exist to expose.",
        },
      },
      {
        id: "a-ma-ap-combining-bounds",
        title: "Adding and subtracting bounds",
        explain:
          "To find the largest a total could be, add the two upper bounds. To find the largest a DIFFERENCE could be, take the upper bound of the first and the lower bound of the second. Subtraction crosses over, and that is the part people get wrong.",
        why: "This is what senior papers actually ask for, and the crossing over in subtraction is not worth memorising as a rule because it is easy to derive. Ask which extreme makes the answer biggest, and for a difference that means the first as large as possible and the second as small as possible.",
        example:
          "  Two lengths, each to the nearest cm:\n\n    A = 15 cm    bounds 14.5 to 15.5\n    B =  8 cm    bounds  7.5 to  8.5\n\n\n  THE TOTAL, A + B:\n\n    Largest:   15.5 + 8.5 = 24.0\n    Smallest:  14.5 + 7.5 = 22.0\n\n    Both uppers for the largest. Both lowers for the\n    smallest. Nothing crosses over.\n\n\n  THE DIFFERENCE, A - B:\n\n    Largest:   15.5 - 7.5 = 8.0\n               A as big as possible, and B as SMALL\n               as possible\n\n    Smallest:  14.5 - 8.5 = 6.0\n               A as small as possible, and B as BIG\n               as possible\n\n  Do not memorise the crossing over. Ask the question\n  instead: to make a gap as wide as I can, I want the\n  first thing large and the thing taken away small.\n  That reasoning never fails, and a rule half\n  remembered often does.\n\n\n  WHY IT MATTERS:\n\n  The stated figures say A - B is 7 cm. The honest\n  answer is that it is somewhere between 6 and 8,\n  which is a range two whole centimetres wide, out of\n  two measurements each accurate to half a centimetre.\n  Errors accumulate rather than cancelling, which is\n  the whole reason this module exists.",
        mistake:
          "Using both upper bounds for a difference, giving 15.5 - 8.5 = 7, which is the stated answer rather than the largest possible one. Ask which extreme makes the result biggest instead of reaching for a remembered rule.",
      },
      {
        id: "a-ma-ap-percentage-error",
        title: "Percentage error, and how rounding creates it",
        explain:
          "Percentage error measures how far an approximation is from the true value, as a percentage of the true value. Rounding always creates some, and the coarser the rounding the larger it is.",
        why: "This joins the percentage module to this one, and it answers a practical question: how much did the rounding actually cost? A number rounded to one significant figure can be out by a large percentage, which is exactly why an estimate is an estimate and not an answer.",
        example:
          "  1,278 is rounded to 1,300. Percentage error?\n\n    Error = 1,300 - 1,278 = 22\n\n      22\n      -----  x  100  =  1.72%  to 3 s.f.\n      1,278\n\n  The TRUE value goes on the bottom, because that\n  is what the approximation is being compared to.\n\n\n  HOW THE ROUNDING CHANGES IT:\n\n    1,278 to the nearest 10:    1,280\n         error 2,      0.157%\n\n    1,278 to the nearest 100:   1,300\n         error 22,     1.72%\n\n    1,278 to the nearest 1000:  1,000\n         error 278,    21.8%\n\n  Coarser rounding, larger error. This is the\n  measurable version of what the previous lesson\n  said in words: every digit you drop is accuracy\n  you gave away.",
        mistake:
          "Dividing by the rounded value rather than the true one. The true value is the standard being compared to, so it goes on the bottom, exactly as the original amount did in a percentage increase.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l48-month-3-review",
    moduleId: "ma-m3-approximation",
    sectionId: SECTION_ID,
    order: 4,
    title: "Parts of a Whole, Reviewed",
    subtitle: "One quantity, four notations, and what carries into Month 4",
    estimatedMinutes: 16,
    intro:
      "Month 3 has been one idea in four notations: a fraction, a decimal, a percentage and a rounded approximation of the same quantity. This lesson checks that all four are available and that you can move between them without stopping to think.",

    atoms: [
      {
        id: "a-ma-ap-one-quantity",
        title: "One quantity, four notations",
        explain:
          "Three quarters, 0.75, 75 per cent and 0.8 to one significant figure are four ways of writing one quantity, three of them exact and one of them an approximation with its accuracy stated.",
        why: "A question can hand you any of the four and want any other. The conversions are the connective tissue of the whole month, and being slow at them makes every commercial question slow regardless of how well the method is understood.",
        table: {
          caption: "The same quantity, four ways, and the exact ones marked.",
          headers: ["Fraction", "Decimal", "Percentage", "To 1 s.f."],
          rows: [
            ["1/2", "0.5", "50%", "0.5"],
            ["3/4", "0.75", "75%", "0.8"],
            ["1/8", "0.125", "12.5%", "0.1"],
            ["1/3", "0.333…", "33.3% (1 d.p.)", "0.3"],
            ["2/5", "0.4", "40%", "0.4"],
            ["7/8", "0.875", "87.5%", "0.9"],
          ],
          note: "Read the 1/3 row. The fraction is exact and both the decimal and the percentage are approximations, which is why a question about thirds either asks for a fraction or states an accuracy. The fraction is not the rough version of the decimal; it is the other way round.",
        },
      },
      {
        id: "a-ma-ap-choosing-form",
        title: "Which notation to work in",
        explain:
          "Fractions for multiplying, dividing and staying exact. Decimals for comparing, for adding lists and for money. Percentages for comparing proportions and for anything commercial. Choose before starting, not halfway through. A proportion here means what share of a whole something is, such as what share of a class passed. Month 4 gives the word its full treatment.",
        why: "Most avoidable work in this month comes from starting in the wrong notation. Multiplying thirds as decimals cannot be exact, and comparing eighths as fractions is slower than comparing them as decimals.",
        example:
          "  Four questions, four sensible choices.\n\n  'Which is larger, 5/8 or 0.63?'\n     Decimals. 5/8 = 0.625, so 0.63 is larger.\n\n  'Find 2/3 of 4,800.'\n     Fraction. 4,800 / 3 x 2 = 3,200, exactly.\n\n  'A price rises 12%, then 5%. Overall change?'\n     Multipliers. 1.12 x 1.05 = 1.176, a 17.6% rise.\n\n  'Add 1,890 + 4,120 + 970.'\n     Decimals, and estimate first: about 7,000.\n\n  In every case the choice was made before any\n  arithmetic started, which is where it should be\n  made.",
      },
      {
        id: "a-ma-ap-errors",
        title: "The errors Month 3 exists to prevent",
        explain:
          "Six errors account for nearly all lost marks across the four modules of this month, and each one has a specific two second check that catches it.",
        why: "Naming the error makes the check specific, and specific checks get carried out. A general instruction to be careful is not a method. Most people will recognise one or two of these six as theirs.",
        table: {
          caption: "Six errors across the month, and the check for each.",
          headers: ["Error", "Looks like", "The check"],
          rows: [
            ["Adding denominators", "3/8 + 2/8 = 5/16", "The bottom is a name, not an amount"],
            ["Reading the decimal tail", "0.75 called larger than 0.8", "Compare column by column from the left"],
            ["Wrong percentage base", "Profit divided by the selling price", "A percentage of WHAT?"],
            ["Reverse done forwards", "Adding the discount back on", "Check forwards and see if you land"],
            ["Rounding early", "A rate rounded then multiplied", "Round once, at the end"],
            ["Wrong instruction", "3 d.p. given when 3 s.f. was asked", "Underline the instruction"],
          ],
        },
        practice: {
          prompt:
            "Look back over your marked work from this month. Which of the six is yours, and what is the exact moment the check belongs at?",
          answer:
            "Most people find one or two of the six account for the great majority of their errors across the month. The useful part is placing the check at a specific moment: before writing the answer, or before starting the calculation, rather than as a general resolution to take care.",
        },
      },
      {
        id: "a-ma-ap-into-month-4",
        title: "What carries into Month 4",
        explain:
          "Month 4 is ratio, measurement, patterns and the first algebra. Ratio is fractions in a different costume, measurement needs the rounding and bounds of this module, and algebra needs the fraction arithmetic more than anything else.",
        why: "Knowing what is about to be used, and used constantly, is what makes revising now worth more than revising later. A gap in fraction arithmetic surfaces in Month 6 as an inability to solve equations, and by then it looks like a problem with algebra.",
        table: {
          caption: "Where each part of Month 3 is used next.",
          headers: ["From Month 3", "Used in", "As"],
          rows: [
            ["Equivalent fractions", "Month 4, ratio", "Simplifying and scaling a ratio"],
            ["Fraction arithmetic", "Month 6, equations", "Every algebraic fraction and rearrangement"],
            ["Multiplying by a reciprocal", "Month 6, algebraic fractions", "Dividing one expression by another"],
            ["Decimals and money", "Month 5, commercial arithmetic", "Interest, instalments, taxes"],
            ["Percentage multipliers", "Month 5, compound interest", "Repeated multiplication by the multiplier"],
            ["Bounds and accuracy", "Month 4, measurement", "Perimeter, area and tolerance"],
            ["Estimating to 1 s.f.", "Every month", "Checking every answer you produce"],
          ],
        },
      },
      {
        id: "a-ma-ap-review",
        title: "The whole of Month 3, mixed",
        explain:
          "A drill across fractions, decimals, percentages, rounding, and the number work of Months 1 and 2, with nothing to say which is which.",
        why: "This is the last review before Month 4, and it is the only honest measurement of whether the month is available rather than merely familiar. Identifying what a question is asking is the half of the skill a single topic drill never trains.",
        drill: {
          review: [
            "L1-N3.1",
            "L0-N5.4",
            "L0-N4.4",
            "L1-N3.2",
            "L0-N1.4",
            "L0-N5.2",
            "L1-N2.3",
          ],
          count: 7,
          intro:
            "Seven questions from across three months. Decide what each one is asking before you calculate anything, because that decision is half of what an exam tests.",
        },
      },
    ],

    task: {
      title: "Before you start Month 4",
      intro:
        "Month 4 is ratio, measurement, patterns and the first algebra, and it uses this month constantly. Check with a pen, no calculator:",
      prompts: [
        "Round 2.34999 to one decimal place, and say which single digit decided it.",
        "Write 0.00456 to two significant figures, then to two decimal places, and say why one of those is useless.",
        "Estimate (38.7 × 6.2) ÷ 0.48 by rounding each number to one significant figure, then say why dividing by 0.5 doubles.",
        "A shelf and a gap are both 12 cm to the nearest cm. Can you be sure the shelf fits? Give the worst case.",
        "Work out 2/3 + 3/4, then give the answer as a decimal to 2 d.p. and as a percentage to 1 d.p.",
        "1,278 is rounded to 1,300. Find the percentage error, and say which number goes on the bottom and why.",
      ],
      close:
        "If the last one used 1,300 as the base, that is the same wrong base error as dividing a profit by the selling price. The thing being compared TO always goes underneath, and that one sentence covers percentage increase, percentage profit and percentage error together.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
