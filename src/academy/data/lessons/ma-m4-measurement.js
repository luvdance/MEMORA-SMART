/**
 * MATHEMATICS · MONTH 4 · MODULE 2 · MEASUREMENT, PERIMETER AND AREA
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Unit slips are named in the examiners' reports every single year, and they
 * are not carelessness. They come from converting by reflex instead of by
 * asking one question: is the new unit bigger or smaller than the old one? A
 * student who asks that question cannot get the direction wrong, and a student
 * who does not will get it wrong perhaps a third of the time forever.
 *
 * Two other things in this module carry more marks than their size suggests.
 *
 * THE HALF, in the triangle formula. Forgetting it gives exactly twice the
 * right answer, and the reason the formula has a half in it is a picture: a
 * triangle is half of the rectangle that boxes it in. Taught as a picture it
 * cannot be forgotten. Taught as a formula it frequently is.
 *
 * THE PERPENDICULAR HEIGHT. Every area formula here wants the height measured
 * at right angles to the base, and exam diagrams supply the slant as well,
 * deliberately. Using the slant gives an answer slightly too large, which is
 * the most plausible wrong answer there is.
 *
 * And the squared unit is not decoration. Two lengths multiplied give cm², and
 * a marker who sees cm on an area knows the candidate does not know what the
 * calculation produced.
 */

export const SECTION_ID = "ma-s4-measurement";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l53-units",
    moduleId: "ma-m4-measurement",
    sectionId: SECTION_ID,
    order: 1,
    title: "Units and Converting Between Them",
    subtitle: "Which way the number moves, and the question that settles it",
    estimatedMinutes: 15,
    intro:
      "There is one question that makes every conversion in this course reliable: is the unit I am changing to bigger or smaller than the one I have? Bigger unit means fewer of them, so the number goes down. Smaller unit means more of them, so it goes up. Everything else is multiplying by tens.",

    atoms: [
      {
        id: "a-ma-ms-metric",
        title: "The metric system is built on tens",
        explain:
          "Every metric unit is a power of ten times another, so converting is always a matter of moving the digits some number of columns. Kilo means a thousand, centi means a hundredth, milli means a thousandth, and the prefix tells you the factor.",
        origin:
          "The prefixes are Greek and Latin, which is why they look foreign: kilo from the Greek for thousand, centi from the Latin for hundred, milli from the Latin for thousand. The system was designed in revolutionary France in the 1790s specifically to replace units defined by local custom and royal bodies, and the metre was first fixed as one ten millionth of the distance from the North Pole to the equator. That definition is a problem, because it means every metre in the world depends on measuring the Earth correctly, and the original survey was slightly out. So the definition has been replaced twice, and since 1983 a metre has been defined as the distance light travels in a particular tiny fraction of a second, which is a length anybody with the right equipment can reproduce anywhere in the universe without measuring the Earth at all.",
        why: "This is why metric conversions are all column shifts and why imperial conversions are not. Twelve inches in a foot and three feet in a yard have to be memorised individually, while every metric conversion is the same rule with a different number of zeros.",
        table: {
          caption: "The prefixes worth knowing, and what they multiply by.",
          headers: ["Prefix", "Means", "Example"],
          rows: [
            ["kilo", "× 1,000", "1 km = 1,000 m"],
            ["hecto", "× 100", "1 hectare relates to 100 ares"],
            ["deca", "× 10", "rarely used"],
            ["deci", "÷ 10", "1 decimetre = 0.1 m"],
            ["centi", "÷ 100", "1 cm = 0.01 m"],
            ["milli", "÷ 1,000", "1 mm = 0.001 m"],
          ],
          note: "The same prefixes work on every quantity. A kilogram is a thousand grams, a kilometre a thousand metres, a kilolitre a thousand litres. Learn the prefix once and it works everywhere.",
        },
        example:
          "  LENGTH\n    1 km  = 1,000 m\n    1 m   =   100 cm\n    1 cm  =    10 mm\n    so 1 m = 1,000 mm\n\n  MASS\n    1 tonne = 1,000 kg\n    1 kg    = 1,000 g\n    1 g     = 1,000 mg\n\n  CAPACITY\n    1 litre = 1,000 ml\n    1 litre = 1,000 cm³   (worth remembering)\n\n  TIME is the exception, and Lesson 54 explains why.",
      },
      {
        id: "a-ma-ms-direction",
        title: "Which way does the number move?",
        explain:
          "Ask whether the new unit is bigger or smaller than the old one. Changing to a SMALLER unit means you need MORE of them, so the number gets bigger. Changing to a BIGGER unit means you need fewer, so the number gets smaller.",
        why: "This is the most useful single sentence in the module. Almost every conversion error is a direction error, and the direction cannot be got wrong if the question is asked, because the answer is obvious once stated: a centimetre is smaller than a metre, so any length is more centimetres than metres.",
        example:
          "  3.5 m into cm\n\n    A cm is SMALLER than a m, so there are MORE of\n    them. The number must go UP.\n\n    3.5 × 100 = 350 cm\n\n  Check the direction: 350 is bigger than 3.5. Good.\n\n\n  450 g into kg\n\n    A kg is BIGGER than a g, so there are FEWER of\n    them. The number must go DOWN.\n\n    450 ÷ 1,000 = 0.45 kg\n\n  Check: 0.45 is smaller than 450. Good.\n\n\n  WHY THIS BEATS MEMORISING:\n\n  Nobody can reliably remember whether to multiply\n  or divide for every pair of units. Everybody can\n  answer 'is a millimetre smaller than a metre?'\n  The second question gives you the first.\n\n\n  A SENSE CHECK THAT NEVER FAILS:\n\n  A person is about 1.7 m tall. That is 170 cm,\n  which is believable, and 0.017 cm, which is not.\n  If a converted answer describes something absurd,\n  the direction went the wrong way.",
        mistake:
          "Multiplying when you should divide. The answer is out by a factor of a thousand, which is enormous, and it is caught by asking whether the answer describes something that could exist.",
        drill: {
          skill: "L0-G1.1",
          count: 3,
          intro:
            "Three conversions. Before each one, say out loud whether the new unit is bigger or smaller, and therefore which way the number moves.",
        },
      },
      {
        id: "a-ma-ms-squared-units",
        title: "Converting squared and cubed units",
        explain:
          "One metre is 100 cm, so one square metre is 100 × 100 = 10,000 square centimetres, not 100. The conversion factor has to be applied once for each dimension, so squared units use the factor twice and cubed units use it three times.",
        why: "This catches almost everybody the first time, and it is asked directly in senior papers. Understanding why it happens means you never have to remember the numbers: a square metre is a square one metre on each side, and both sides have to be converted.",
        example:
          "  WHY 1 m² is 10,000 cm², drawn:\n\n    A square 1 m by 1 m.\n    That is 100 cm by 100 cm.\n\n      +--------------------+\n      |                    |\n      |     100 cm across  |  100 cm\n      |                    |  down\n      |                    |\n      +--------------------+\n\n      Area = 100 × 100 = 10,000 cm²\n\n  So the factor 100 is used TWICE, once for each\n  direction the square extends in.\n\n\n  THE FACTORS:\n\n    Length:  1 m  = 100 cm         factor 100\n    Area:    1 m² = 10,000 cm²     factor 100²\n    Volume:  1 m³ = 1,000,000 cm³  factor 100³\n\n    Length:  1 km  = 1,000 m\n    Area:    1 km² = 1,000,000 m²\n\n\n  THE USEFUL ONE TO REMEMBER:\n\n    1 litre = 1,000 cm³\n\n  Which means a cube 10 cm on each side holds\n  exactly one litre, since 10 × 10 × 10 = 1,000.",
        mistake:
          "Converting a squared unit with the plain length factor, so that 3 m² is called 300 cm². It is 30,000 cm². The index on the unit tells you how many times the factor is needed.",
      },
      {
        id: "a-ma-ms-instruments",
        title: "Reading a ruler, a scale and a measuring cylinder",
        explain:
          "Work out what one small division is worth before reading anything. Count the divisions between two labelled marks and divide the gap between the labels by that number.",
        why: "Every practical measurement question turns on this and it is where marks go in science as well. Assuming the divisions are ones, or tenths, without checking is the error, and it is easy to avoid by counting first.",
        example:
          "  A scale labelled 0, 50, 100 with 5 divisions\n  between each pair of labels:\n\n    |----|----|----|----|----|----|----|----|----|----|\n    0                   50                        100\n\n    Gap between labels: 50\n    Divisions in that gap: 5\n    One division: 50 ÷ 5 = 10\n\n  So the marks are 0, 10, 20, 30, 40, 50 and so on.\n\n\n  A RULER:\n\n  Between 3 cm and 4 cm there are 10 small marks,\n  so each is 1 mm, which is 0.1 cm. A reading three\n  marks past 3 is 3.3 cm, or 33 mm.\n\n\n  A MEASURING CYLINDER:\n\n  Read at eye level, at the bottom of the curve the\n  liquid makes. Reading from above or below the\n  level gives a consistently wrong figure, which is\n  worse than a random error because it never\n  cancels out.\n\n\n  AND REMEMBER MONTH 3:\n\n  Any reading from an instrument is rounded to the\n  nearest division, so a length read as 3.3 cm is\n  somewhere between 3.25 and 3.35. The bounds work\n  applies to every measurement you take.",
        drill: {
          skill: "L0-G1.2",
          count: 3,
          intro:
            "Three instrument readings. Work out what one division is worth before reading the value off.",
        },
      },
      {
        id: "a-ma-ms-estimating",
        title: "Estimating a measurement without measuring",
        explain:
          "Knowing the rough size of common things lets you catch an absurd answer instantly. A door is about 2 m tall, a bag of rice is 50 kg, a bottle of water holds half a litre, a classroom is about 8 m across.",
        why: "This is the measurement version of the estimating work in Month 3, and it is the check that catches a conversion error. An answer saying a person is 0.017 cm tall or a room is 900 m across is wrong without any arithmetic being checked.",
        table: {
          caption: "Rough sizes worth carrying in your head.",
          headers: ["Thing", "About", "Useful because"],
          rows: [
            ["A door", "2 m tall", "Checks lengths in a room"],
            ["An adult", "1.7 m tall, 70 kg", "Checks heights and masses"],
            ["A bag of rice", "50 kg", "Checks mass in trade questions"],
            ["A bottle of water", "0.5 to 1.5 litres", "Checks capacity"],
            ["A classroom", "8 m by 6 m", "Checks areas of rooms"],
            ["A football pitch", "about 100 m long", "Checks large distances"],
            ["A sachet of water", "50 cl, so half a litre", "Checks capacity in local units"],
          ],
          note: "These are not facts to be examined. They are the reference points that make an absurd answer look absurd, which is what a sense check needs.",
        },
        practice: {
          prompt:
            "A student converts the length of a classroom and gets 0.008 km. Is that plausible, and what probably went wrong?",
          answer:
            "0.008 km is 8 m, which is exactly right for a classroom, so it is plausible. The figure looks alarming only because kilometres are a clumsy unit for a room. This is the other half of the skill: an answer in an awkward unit is not the same as a wrong answer, so convert to a sensible unit before judging it.",
        },
      },
      {
        id: "a-ma-ms-compound-units",
        title: "Units that carry two quantities",
        explain:
          "Some units contain a division, such as km/h, naira per kg and g/cm³. The slash or the word per means divided by, and the unit tells you the formula, exactly as it did for speed in the last module.",
        why: "Compound units appear throughout the rest of the course, in density, pressure, rates of pay and population density. Reading them as an instruction rather than a label means the formula never has to be recalled separately.",
        example:
          "  READ THE UNIT AS THE FORMULA:\n\n    g/cm³     = grams ÷ cubic centimetres  (density)\n    km/h      = kilometres ÷ hours         (speed)\n    naira/kg  = naira ÷ kilograms          (price rate)\n    people/km² = people ÷ square km        (population density)\n\n  The quantity named first goes on top, every time.\n\n\n  A worked one:\n\n  A block of metal has a mass of 240 g and a volume\n  of 30 cm³. Find its density.\n\n    Density = mass ÷ volume\n            = 240 ÷ 30\n            = 8 g/cm³\n\n  And backwards, if a 8 g/cm³ metal has a volume of\n  50 cm³:\n\n    mass = density × volume = 8 × 50 = 400 g\n\n  The unit told you both formulas.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l54-time",
    moduleId: "ma-m4-measurement",
    sectionId: SECTION_ID,
    order: 2,
    title: "Time, Clocks and Timetables",
    subtitle: "The one measurement that is not decimal, and why",
    estimatedMinutes: 14,
    intro:
      "Time is the exception to everything in the last lesson. It does not carry in tens, and 1.5 hours is an hour and a half while 1.50 on a clock is ten minutes past one. Every error in this lesson comes from treating time as though it were decimal.",

    atoms: [
      {
        id: "a-ma-ms-time-not-decimal",
        title: "Why time is not decimal",
        explain:
          "There are 60 seconds in a minute, 60 minutes in an hour and 24 hours in a day. None of those is a power of ten, so time cannot be converted by moving columns and 0.5 hours is 30 minutes rather than 5.",
        origin:
          "Both numbers are inherited. The 60 comes from Babylon, whose number system worked in sixties because sixty divides exactly by 2, 3, 4, 5, 6, 10, 12, 15, 20 and 30, so most fractions of it come out whole. The 24 comes from Egypt, where the night was divided into twelve parts by the rising of twelve chosen groups of stars, and the day was then given twelve to match. So an hour is Egyptian and a minute is Babylonian, and neither was designed to fit the other. Revolutionary France, having successfully decimalised length and mass, tried to decimalise time too: a decree of 1793 gave the day ten hours, each of a hundred minutes, each of a hundred seconds. Clocks were actually made. It was abandoned within about two years, because nobody could be persuaded to give up the clocks and habits they had. Metric time is the one part of the metric project that failed, and it failed for social reasons rather than mathematical ones.",
        why: "Knowing this prevents the central error. Time resisted the decimal system that everything else adopted, so the arithmetic has to carry at 60 and at 24 instead of at 10, and a calculator that shows 2.75 hours is not telling you 2 hours 75 minutes.",
        example:
          "  THE CONVERSION THAT CATCHES PEOPLE:\n\n    2.5 hours   = 2 hours 30 minutes\n    2.75 hours  = 2 hours 45 minutes\n    2.25 hours  = 2 hours 15 minutes\n    2.1 hours   = 2 hours 6 minutes\n\n  The decimal part is a fraction OF AN HOUR, so\n  multiply it by 60 to get minutes:\n\n    0.75 × 60 = 45 minutes\n    0.1  × 60 = 6 minutes\n\n\n  AND THE OTHER DIRECTION:\n\n    1 hour 20 minutes = 1 + 20/60 hours\n                      = 1 + 1/3\n                      = 1.333... hours\n\n  Which is why speed questions with times in\n  minutes are where marks go missing: the fraction\n  arithmetic of Month 3 is doing real work here.\n\n\n  NEVER WRITE:\n\n    2 hours 90 minutes.  That is 3 hours 30 minutes.\n    Minutes carry at 60, not at 100.",
        mistake:
          "Reading 2.5 hours as 2 hours 5 minutes, or writing 1.45 for an hour and forty five minutes. As a decimal, an hour and forty five minutes is 1.75 hours, because 45 minutes is three quarters of an hour.",
      },
      {
        id: "a-ma-ms-24-hour",
        title: "The 24 hour clock",
        explain:
          "In the 24 hour clock, times run from 00:00 to 23:59, so afternoon and evening times are 12 higher than the am and pm version. 14:30 is half past two in the afternoon, and 09:15 is quarter past nine in the morning. Elapsed time means how long something took, from its start to its finish, and the next atom is about working it out.",
        why: "Timetables, tickets and schedules are written in 24 hour times precisely because it removes the am and pm ambiguity, and reading them is examined directly. It also makes elapsed time easier, since there is no wrapping around at twelve.",
        table: {
          caption: "The two clocks side by side.",
          headers: ["24 hour", "12 hour", "Note"],
          rows: [
            ["00:00", "12 midnight", "The day starts at zero"],
            ["06:45", "6:45 am", "Morning times are unchanged"],
            ["12:00", "12 noon", "Midday, not 00:00"],
            ["13:05", "1:05 pm", "Add 12 to the afternoon hour"],
            ["18:30", "6:30 pm", "18 − 12 = 6"],
            ["23:59", "11:59 pm", "The last minute of the day"],
          ],
          note: "Midnight is the trap. It is 00:00 at the start of a day and 24:00 at the end of one, and the two are the same instant described from either side.",
        },
        mistake:
          "Writing 13:00 as 3 pm, subtracting 10 instead of 12. And treating 12:00 as 00:00, which puts an appointment twelve hours out.",
      },
      {
        id: "a-ma-ms-elapsed",
        title: "Working out how long something took",
        explain:
          "To find elapsed time, count up to the next whole hour, then in whole hours, then the remaining minutes. Subtracting the two times as though they were ordinary numbers gives the wrong answer because minutes carry at 60.",
        why: "This is the most examined skill in the lesson and the counting up method is far more reliable than column subtraction, because it never needs a borrow at 60. It is also how people actually do it in their heads.",
        example:
          "  From 09:45 to 14:20. How long?\n\n  WRONG, subtracting as numbers:\n\n    14:20 − 09:45 gives 5:−25, which is nonsense,\n    or 4:75, which is not a time either.\n\n  RIGHT, counting up in stages:\n\n    09:45  →  10:00     15 minutes\n    10:00  →  14:00      4 hours\n    14:00  →  14:20     20 minutes\n\n    Total: 4 hours 35 minutes\n\n  Three easy steps, no borrowing at 60.\n\n\n  ACROSS MIDNIGHT:\n\n  From 22:30 to 06:15 the next morning.\n\n    22:30  →  24:00     1 hour 30 minutes\n    00:00  →  06:00     6 hours\n    06:00  →  06:15     15 minutes\n\n    Total: 7 hours 45 minutes\n\n  Counting up handles the day boundary without any\n  special rule, which is the other reason to prefer\n  it to subtraction.",
        mistake:
          "Subtracting the two times in columns and borrowing 100 instead of 60. Counting up avoids the borrow entirely, which is why it is worth making the habit.",
      },
      {
        id: "a-ma-ms-timetables",
        title: "Reading a timetable",
        explain:
          "A timetable column is one journey and a row is one stop. Read down a column to follow a single bus or train, and across a row to compare the times that different services reach the same place.",
        why: "Timetable questions are on every paper at this level and they are reading questions rather than arithmetic ones. The two commonest errors are reading across when you meant down, and missing that a dash means that service does not stop there at all.",
        example:
          "  A bus timetable:\n\n                  Bus A   Bus B   Bus C\n    Ojota         07:15   08:40   10:05\n    Ketu          07:32   08:57   10:22\n    Maryland        --     09:14   10:39\n    Yaba          08:05   09:35   11:00\n\n  READ DOWN a column to follow one bus.\n  Bus A leaves Ojota at 07:15 and reaches Yaba at\n  08:05, so it takes 50 minutes.\n\n  READ ACROSS a row to compare services.\n  Three buses reach Ketu, at 07:32, 08:57 and 10:22.\n\n  THE DASH MATTERS. Bus A does not stop at\n  Maryland, so a passenger for Maryland must wait\n  for Bus B. A question about the first bus to\n  Maryland is answered 09:14, not 07:32.\n\n\n  THE STANDARD EXAM QUESTION:\n\n  'A passenger must be at Yaba by 10:00. What is\n  the latest bus they can take from Ojota?'\n\n  Bus B arrives 09:35, which is in time.\n  Bus C arrives 11:00, which is not.\n  So the answer is Bus B, leaving at 08:40.\n\n  Note that the question asked for a DEPARTURE time\n  and the constraint was on ARRIVAL, which is the\n  part that has to be read carefully.",
        drill: {
          skill: "L0-S1.1",
          count: 3,
          intro:
            "Three questions from tables and timetables. Decide whether you need to read down a column or across a row before you look for a number.",
        },
      },
      {
        id: "a-ma-ms-time-in-calculations",
        title: "Time inside another calculation",
        explain:
          "When a time appears in a rate or a cost, convert it to the unit the rate uses before calculating. A speed in km/h needs a time in hours, and a wage per hour needs the time in hours too.",
        why: "This is where the lesson pays off, and it is where the marks are. Almost every wrong answer on a speed question with a time in minutes comes from using the minutes directly, and the answer is then sixty times too large.",
        example:
          "  A WAGE:\n\n  A worker earns ₦1,800 per hour and works from\n  08:30 to 16:15, with a 45 minute unpaid break.\n\n    Total time:  08:30 → 16:15\n                 08:30 → 09:00   30 min\n                 09:00 → 16:00    7 hours\n                 16:00 → 16:15   15 min\n                 = 7 hours 45 minutes\n\n    Paid time:   7 h 45 − 45 min = 7 hours\n\n    Pay: 7 × 1,800 = ₦12,600\n\n  Note how much of that was reading and how little\n  was arithmetic.\n\n\n  A SPEED, with the trap:\n\n  A cyclist covers 18 km in 45 minutes.\n  What is the speed in km/h?\n\n    WRONG:  18 ÷ 45 = 0.4 km/h\n            Nobody cycles at 0.4 km/h.\n\n    RIGHT:  45 minutes = 45/60 = 0.75 hours\n            18 ÷ 0.75 = 24 km/h\n\n  The unit km/h told you the time had to be in\n  hours. Converting first is the whole job.",
        mistake:
          "Using minutes with a rate given per hour. Convert the time first, and use the sense check afterwards: is this a speed a bicycle could go, or a wage a person could earn?",
        practice: {
          prompt:
            "A train leaves at 21:50 and arrives at 02:35 the next day, covering 380 km. Find the journey time and the average speed to 3 significant figures.",
          answer:
            "Counting up: 21:50 to 24:00 is 2 hours 10 minutes, then 00:00 to 02:35 is 2 hours 35 minutes, giving 4 hours 45 minutes. As a decimal that is 4.75 hours, because 45 minutes is three quarters. Speed is 380 divided by 4.75, which is 80 km/h exactly, so 80.0 km/h to 3 significant figures. Using 4.45 hours instead of 4.75 would give 85.4, which is the error the question is built to catch.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l55-perimeter",
    moduleId: "ma-m4-measurement",
    sectionId: SECTION_ID,
    order: 3,
    title: "Perimeter",
    subtitle: "The distance round the outside, and the sides nobody gave you",
    estimatedMinutes: 14,
    intro:
      "Perimeter is the distance all the way round the outside of a shape. There is very little to it, and the two things that go wrong are confusing it with area and giving up on a compound shape because two of the sides were not labelled.",

    atoms: [
      {
        id: "a-ma-ms-perimeter",
        title: "Perimeter is a distance",
        explain:
          "Add every side. That is the whole of it, for any shape with straight edges. Because it is a distance, the answer is in the same unit as the sides: cm, m or km, never squared.",
        why: "Starting from the definition rather than from formulas means no formula has to be recalled for an unfamiliar shape. A formula like 2(l + w) is a shortcut for a rectangle and it is not what perimeter means.",
        example:
          "  A rectangle 7 cm by 4 cm:\n\n    +---------------+\n    |               |  4\n    +---------------+\n           7\n\n    P = 7 + 4 + 7 + 4 = 22 cm\n    or 2 × (7 + 4) = 22 cm\n\n  The shortcut works because a rectangle has two of\n  each side. It is not a new idea.\n\n\n  SHAPES WITHOUT A FORMULA:\n\n  A triangle with sides 6, 8 and 11 cm:\n\n    P = 6 + 8 + 11 = 25 cm\n\n  A regular hexagon with 5 cm sides:\n\n    P = 6 × 5 = 30 cm\n\n  In both cases the definition did all the work.\n\n\n  THE UNIT:\n\n  A perimeter is always in a plain length unit,\n  because you only ever added lengths. If you find\n  yourself writing cm² for a perimeter, you have\n  multiplied somewhere you should have added.",
        drill: {
          skill: "L1-G1.2",
          count: 3,
          intro:
            "Three perimeters, on shapes with different numbers of sides. Add the sides rather than reaching for a formula.",
        },
      },
      {
        id: "a-ma-ms-missing-sides",
        title: "Compound shapes and the sides you were not given",
        explain:
          "In an L-shape or a stepped shape, some sides are not labelled and have to be worked out from the others. The two horizontal sides on one level must add up to the full width, and the same is true vertically.",
        why: "This is the standard exam form of a perimeter question and candidates lose it by adding only the labelled numbers. Working out the missing sides is the question, and it is a subtraction from the overall width or height.",
        example:
          "  An L-shaped plot:\n\n        10\n    +---------+\n    |         |  3\n    |    +----+\n    |    |        6\n    | 4  |\n    +----+\n      4\n\n  The unlabelled sides:\n\n    The top is 10 and the bottom step is 4,\n    so the missing horizontal is 10 − 4 = 6\n\n    The left is 6 and the top right is 3,\n    so the missing vertical is 6 − 3 = 3\n\n  Now add all six:\n\n    10 + 3 + 6 + 3 + 4 + 6 = 32 units\n\n\n  A SHORTCUT WORTH KNOWING:\n\n  For a shape made by cutting a rectangular corner\n  out of a rectangle, the perimeter is UNCHANGED.\n  The two new edges are exactly as long as the two\n  pieces they replaced, so:\n\n    P = 2 × (10 + 6) = 32\n\n  Same answer, no missing sides needed. This only\n  works for a rectangular notch, and knowing why it\n  works is what tells you when it applies.",
        mistake:
          "Adding only the labelled sides. In the example that gives 10 + 3 + 4 + 6 = 23, which misses two whole sides. Count the sides of the shape first and make sure you have a number for each.",
      },
      {
        id: "a-ma-ms-perimeter-vs-area",
        title: "Perimeter and area are different questions",
        explain:
          "Perimeter is the distance round the edge and area is the space inside. Two shapes can have the same perimeter and very different areas, and the units are the clearest signal of which is which.",
        why: "Confusing the two is the commonest single error in mensuration, and it happens because both are asked about the same shapes. The unit is the check: a perimeter is in cm and an area is in cm².",
        example:
          "  THREE RECTANGLES, ALL WITH PERIMETER 20 cm:\n\n    9 by 1:   area  9 cm²\n    7 by 3:   area 21 cm²\n    5 by 5:   area 25 cm²\n\n  Same distance round, areas from 9 to 25. Knowing\n  the perimeter does not tell you the area.\n\n  Note also which one is largest. For a fixed\n  perimeter, the squarest rectangle holds the most\n  area, which is why a farmer fencing a field with a\n  fixed length of wire makes it as square as\n  possible.\n\n\n  A PRACTICAL PAIR:\n\n  A room 5 m by 4 m.\n\n    Skirting board round the walls: a PERIMETER\n      2 × (5 + 4) = 18 m of board\n\n    Tiles for the floor: an AREA\n      5 × 4 = 20 m² of tiles\n\n  The question tells you which by what it is\n  measuring: something that goes round the edge, or\n  something that covers the middle.",
        mistake:
          "Multiplying the sides when the question asked for the distance round. Read what is being measured: fencing, edging and skirting go round, while paint, tiles and grass cover.",
      },
      {
        id: "a-ma-ms-perimeter-backwards",
        title: "Working backwards from a perimeter",
        explain:
          "Given the perimeter and one dimension, you can find the other. For a rectangle, halve the perimeter to get one length plus one width, then subtract the dimension you know.",
        why: "The reverse question is asked as often as the forward one, and halving first is the step people skip. It is the same working-backwards habit as the reverse percentage and the reverse ratio.",
        example:
          "  A rectangle has a perimeter of 30 cm and a\n  length of 9 cm. Find its width.\n\n    P = 2 × (l + w), so half the perimeter is l + w\n\n    30 ÷ 2 = 15 = l + w\n    15 − 9 = 6 cm\n\n  Check: 2 × (9 + 6) = 30. Correct.\n\n\n  THE ERROR THIS CATCHES:\n\n    30 − 9 = 21, then 21 ÷ 2 = 10.5\n\n  That subtracts one length from the whole\n  perimeter, but there are TWO lengths of 9 in the\n  perimeter. Halving first avoids having to think\n  about that at all.\n\n\n  A SQUARE:\n\n  A square has a perimeter of 36 cm. Its side is\n  36 ÷ 4 = 9 cm, and its area is then 81 cm².\n  Two questions, one after the other, and the exam\n  often asks them that way round.",
        practice: {
          prompt:
            "A rectangular field has a perimeter of 260 m and a width of 50 m. Find its length, then its area, giving the units for each.",
          answer:
            "Half the perimeter is 130 m, which is one length plus one width, so the length is 130 minus 50, which is 80 m. The area is 80 x 50 = 4,000 m squared. Note the two different units: the length is in metres and the area in square metres, because the area came from multiplying two lengths together.",
        },
      },
      {
        id: "a-ma-ms-circles-preview",
        title: "The shape with no straight sides",
        explain:
          "A circle has no sides to add, so its perimeter, called the circumference, needs a different approach. The distance round any circle is always a little over three times the distance across it, and that multiplier is the number called pi.",
        why: "This is a preview rather than a method, and it is here so that the word circumference is not new in Month 5. What matters now is the fact: the ratio of the way round to the way across is the same for every circle that has ever existed, which is a genuinely surprising thing to be true.",
        example:
          "  Take any circular object. Measure round it with\n  a string, and measure straight across it. Divide\n  the first by the second.\n\n    A cup:      round 25.1 cm, across  8 cm  → 3.14\n    A plate:    round 75.4 cm, across 24 cm  → 3.14\n    A bucket:   round 94.2 cm, across 30 cm  → 3.14\n\n  Always the same number, about 3.142, whatever the\n  size. That number is pi, and you met it in Month 1\n  as a number whose decimal never ends.\n\n  So the circumference is pi times the diameter, and\n  Month 5 does the arithmetic. For now, an estimate\n  is enough: the way round a circle is a bit over\n  three times the way across.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l56-area",
    moduleId: "ma-m4-measurement",
    sectionId: SECTION_ID,
    order: 4,
    title: "Area",
    subtitle: "Four formulas, one picture each, and the half that gets forgotten",
    estimatedMinutes: 17,
    intro:
      "Area is the amount of surface a shape covers, counted in squares. Every formula in this lesson is a way of counting those squares without drawing them, and every one of them can be recovered from a picture if the formula is forgotten. That is the point of learning them this way.",

    atoms: [
      {
        id: "a-ma-ms-area-meaning",
        title: "Area counts squares",
        explain:
          "Area is how many unit squares fit inside a shape. A rectangle 5 cm by 3 cm holds 15 squares of one centimetre each, which is why the area is 15 cm² and why the unit has a squared index.",
        origin:
          "Area calculation is one of the oldest uses of mathematics, and in Egypt it was a matter of tax. The Nile flooded every year and wiped out boundary markers, so land had to be measured out again, and the people who did it were known as rope stretchers, working with knotted cords to lay out right angles and lengths. The word geometry itself records this: it is Greek for earth measurement. The formulas in this lesson were in practical use for thousands of years before anybody proved them, and that is the usual order of events. Somebody needs an answer, a method that works is found, and the proof arrives much later.",
        why: "Starting from counting squares makes the squared unit obvious rather than a rule, and it makes every formula in this lesson a shortcut for counting rather than a thing to memorise. It is also why a rectangle's area is a multiplication: the squares come in rows.",
        example:
          "  A rectangle 5 cm by 3 cm:\n\n    +---+---+---+---+---+\n    | 1 | 2 | 3 | 4 | 5 |\n    +---+---+---+---+---+\n    | 6 | 7 | 8 | 9 |10 |\n    +---+---+---+---+---+\n    |11 |12 |13 |14 |15 |\n    +---+---+---+---+---+\n\n    3 rows of 5 squares = 15 squares\n\n    A = 5 × 3 = 15 cm²\n\n  The multiplication is counting the rows, which is\n  exactly what multiplication was for in Month 2.\n\n\n  WHY THE UNIT IS SQUARED:\n\n  Two lengths in centimetres were multiplied\n  together, so the unit is cm × cm, written cm².\n  Reading it as 'square centimetres' says what it\n  is: a count of squares one centimetre across.",
        drill: {
          skill: "L0-G1.4",
          count: 3,
          intro:
            "Three rectangle areas. Give the unit with every answer, because the unit is part of the answer.",
        },
      },
      {
        id: "a-ma-ms-triangle",
        title: "A triangle is half a rectangle",
        explain:
          "Box any triangle inside the smallest rectangle that will hold it, and the triangle is exactly half of that rectangle. So the area is half the base times the perpendicular height. PERPENDICULAR means at right angles, that is, at a square corner. So the perpendicular height is the height measured straight up from the base at a square corner to it, and NOT the length of a slanting side. Every area formula in this course wants that measurement, and using a slanting side instead is the commonest error in the whole topic.",
        why: "The half is the single most forgotten thing in mensuration, and forgetting it gives exactly twice the right answer. Learned as a picture, the half is not a piece of the formula to remember; it is the obvious consequence of the triangle being half of the box.",
        example:
          "  THE PICTURE:\n\n    +-----------+       The rectangle is base × height.\n    |\\          |       The triangle is half of it.\n    |  \\        |\n    |    \\      |  h\n    |      \\    |\n    |        \\  |\n    +----------\\+\n         base\n\n    A = ½ × base × height\n\n  A worked one, base 12 cm, height 7 cm:\n\n    A = ½ × 12 × 7 = ½ × 84 = 42 cm²\n\n\n  IT WORKS FOR ANY TRIANGLE, not just right angled\n  ones. Slide the top corner sideways and the area\n  does not change, because the base and the height\n  have not changed. That is worth testing on paper\n  once, because it looks as though it should matter.\n\n\n  THE OTHER TRAP, THE PERPENDICULAR HEIGHT:\n\n    +-----------+\n    |     /\\    |\n    |    /  \\   |  h is the VERTICAL one\n    |   /    \\  |  the slanting side is LONGER\n    +--/------\\-+\n         base\n\n  The height must be measured at right angles to the\n  base. An exam diagram will often label the slant\n  as well, precisely to see whether you know the\n  difference, and using it gives an answer slightly\n  too big.",
        mistake:
          "Forgetting the half, which gives exactly double, or using the slanting side as the height, which gives a little too much. If an area answer is exactly twice what it should be, it is nearly always this.",
        drill: {
          skill: "L1-G1.3",
          count: 3,
          intro:
            "Three areas, on triangles, parallelograms and trapeziums. Identify the perpendicular height before you multiply anything.",
        },
      },
      {
        id: "a-ma-ms-parallelogram",
        title: "A parallelogram is a rectangle rearranged",
        explain:
          "Cut the triangle off one end of a parallelogram and slide it round to the other end. What you get is a rectangle with the same base and the same perpendicular height, so the area is base times perpendicular height with no half.",
        why: "This is why a parallelogram has no half and a triangle does, which is the pair of formulas students most often mix up. The picture settles it: a parallelogram is a whole rectangle rearranged, and a triangle is half of one.",
        example:
          "  CUT AND SLIDE:\n\n      ______                ______\n     /     /               |      |\n    /_____/       →        |______|\n\n    base × height          base × height\n\n  Nothing was added or thrown away, so the area is\n  unchanged.\n\n    A = base × perpendicular height\n\n  Base 9 cm, perpendicular height 5 cm, slant 6 cm:\n\n    A = 9 × 5 = 45 cm²\n\n  The 6 cm slant is not used. Notice how the\n  rearranged rectangle makes that obvious: its\n  height is the perpendicular one, and the slant\n  became the diagonal cut.",
        mistake:
          "Halving, as though it were a triangle, or multiplying by the slanting side. Both come from applying a remembered formula rather than recalling the picture.",
      },
      {
        id: "a-ma-ms-trapezium",
        title: "A trapezium uses the average of its parallel sides",
        explain:
          "A trapezium has two parallel sides of different lengths. Its area is the AVERAGE of those two lengths multiplied by the perpendicular height, which is half the sum of the parallel sides times the height.",
        why: "The formula looks like the most arbitrary one in the lesson and it is the most reasonable. A rectangle has one width; a trapezium has two, so it behaves like a rectangle whose width is the average of them. Once that lands, the half stops being a thing to remember.",
        example:
          "  Parallel sides 10 cm and 6 cm, height 4 cm.\n\n          6\n       +------+\n      /        \\        4\n     /          \\\n    +------------+\n         10\n\n  The two widths are 10 and 6. Their average:\n\n    (10 + 6) ÷ 2 = 8\n\n  A rectangle 8 wide and 4 high has the same area:\n\n    A = 8 × 4 = 32 cm²\n\n  As the formula is usually written:\n\n    A = ½ × (a + b) × h\n      = ½ × (10 + 6) × 4\n      = ½ × 16 × 4\n      = 32 cm²\n\n\n  WHY THE AVERAGE WORKS:\n\n  Turn a second copy of the trapezium upside down\n  and fit it against the first. The two together\n  make a parallelogram whose base is a + b and\n  whose height is h. One trapezium is half of that,\n  which is where the half comes from.\n\n\n  A SENSE CHECK:\n\n  The answer must sit between the two rectangles\n  you could draw: 6 × 4 = 24 and 10 × 4 = 40. Our\n  32 is between them, as it has to be.",
        mistake:
          "Forgetting the half, which doubles the answer, or multiplying the parallel sides together instead of adding them. The formula averages the two widths, so they are added and halved.",
      },
      {
        id: "a-ma-ms-compound-area",
        title: "Compound shapes: cut them up",
        explain:
          "Split a compound shape into rectangles and triangles, find each area, then add them. Or find the area of the whole rectangle and subtract the piece that is missing, whichever is fewer steps.",
        why: "Every mensuration question from here to Month 8 is some version of this, including the circle questions later. The method never changes and the only decision is whether adding pieces or subtracting a hole is quicker.",
        example:
          "  An L-shape, 10 by 6 with a 4 by 3 corner cut out.\n\n  METHOD 1, ADD TWO RECTANGLES:\n\n        10\n    +---------+\n    |    A    |  3\n    |    +----+\n    | B  |\n    +----+\n      4\n\n    A = 10 × 3 = 30\n    B =  4 × 3 = 12\n    Total = 42 square units\n\n  METHOD 2, SUBTRACT THE MISSING PIECE:\n\n    Whole rectangle: 10 × 6 = 60\n    Cut out piece:    6 × 3 = 18\n    Total: 60 − 18 = 42 square units\n\n  Same answer. Method 2 is fewer steps here, and\n  Method 1 is safer when the missing piece is hard\n  to identify. Both are always available.\n\n\n  A PRACTICAL ONE:\n\n  A room 6 m by 5 m has a square pillar 1 m by 1 m\n  in one corner. How much carpet is needed?\n\n    Room:    6 × 5 = 30 m²\n    Pillar:  1 × 1 =  1 m²\n    Carpet: 30 − 1 = 29 m²\n\n  And note that the PERIMETER of that room is not\n  reduced by the pillar at all, which is the\n  difference between the two measurements again.",
        mistake:
          "Splitting the shape and then counting an overlap twice, or leaving a piece out. Label each piece, write its area beside it, and add the labels at the end.",
      },
      {
        id: "a-ma-ms-units-marks",
        title: "The unit is part of the answer",
        explain:
          "An area is written in squared units and a length is not. Writing cm where cm² belongs loses a mark and tells the marker you do not know what the calculation produced.",
        why: "This is the cheapest mark in the whole syllabus and one of the most frequently dropped. It is also a free check on the method: if a question asks for an area and your working produced a plain length unit, you added where you should have multiplied.",
        table: {
          caption: "What unit tells you what.",
          headers: ["Quantity", "Unit", "Because"],
          rows: [
            ["Length, perimeter", "cm, m, km", "Lengths were added"],
            ["Area", "cm², m², km²", "Two lengths were multiplied"],
            ["Volume", "cm³, m³", "Three lengths were multiplied"],
            ["Capacity", "ml, litres", "A volume of liquid, and 1 litre = 1,000 cm³"],
            ["Mass", "g, kg, tonnes", "Not a length at all"],
          ],
          note: "The index counts how many lengths were multiplied together, which is why it is a useful check rather than a convention. An answer in cm² from a question about a distance means something went wrong upstream.",
        },
        practice: {
          prompt:
            "A triangle has a base of 14 cm, a perpendicular height of 9 cm and a slanting side of 11 cm. Find its area, and say which number you did not use and why.",
          answer:
            "Area is half of 14 times 9, which is half of 126, giving 63 cm squared. The 11 cm slanting side is not used, because every area formula here needs the height measured at right angles to the base, and the slant is longer than that. Using 11 would have given 77, which is plausible looking and wrong, and the diagram supplies it for exactly that reason.",
        },
      },
    ],

    task: {
      title: "Before you start patterns",
      intro:
        "Measurement is the most immediately practical module in the course. Check it holds, with a pen and no calculator:",
      prompts: [
        "Convert 3.5 m to cm and 450 g to kg, saying which way the number moves each time and why.",
        "How many cm² in 2 m²? Explain the answer using a picture rather than a rule.",
        "From 09:45 to 14:20, how long? Use counting up rather than subtraction.",
        "A cyclist covers 18 km in 45 minutes. Find the speed in km/h, and say what had to be converted.",
        "An L-shape is a 10 by 6 rectangle with a 4 by 3 corner removed. Find its perimeter and its area, with units.",
        "A triangle has base 14 cm, perpendicular height 9 cm and slant 11 cm. Find its area, and name the number you did not use.",
      ],
      close:
        "If the fifth one gave a perimeter of 23, two of the six sides were missing: work out the unlabelled sides first, or use the fact that cutting a rectangular corner out leaves the perimeter unchanged. If the last one gave 126, the half was forgotten, and an answer exactly double the right one is almost always that.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
