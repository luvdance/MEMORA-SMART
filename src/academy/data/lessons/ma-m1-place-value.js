/**
 * MATHEMATICS · MONTH 1 · MODULE 4 · PLACE VALUE AND WHOLE NUMBERS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The first module taught the words. This one starts the mathematics, at the
 * bottom: what a digit is worth and why it depends on where it sits.
 *
 * This is primary school content and it is in a secondary course on purpose.
 * A very large number of students who struggle in JSS and SS are not
 * struggling with algebra; they are carrying a hole here, and every topic
 * above it, decimals, standard form, rounding, significant figures, the
 * whole of number bases, is built directly on top of it.
 */

export const SECTION_ID = "ma-s1-place value";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l13-digits",
    moduleId: "ma-m1-place value",
    sectionId: SECTION_ID,
    order: 1,
    title: "Digits, Numerals and Place Value",
    subtitle: "Why the same digit is worth different amounts",
    estimatedMinutes: 15,
    intro:
      "Two prices are chalked on a board: ₦7,000 and ₦700. Both contain a 7, and no trader will accept one for the other. This lesson is the reason why, the single idea that the entire number system is built on.",

    atoms: [
      {
        id: "a-ma-pv-digit",
        title: "A digit is a symbol, a number is an amount",
        explain:
          "There are exactly ten digits: 0 1 2 3 4 5 6 7 8 9. A number is built out of them. The digit 7 is a symbol; how much it is worth depends entirely on where it is standing.",
        why: "This is why we can write any amount at all with only ten symbols. The Romans could not, they needed a new letter for every new size, which is why Roman numerals died out for arithmetic. Position carries the information, and that is the whole invention.",
        table: {
          caption: "The digit 7, standing in different places.",
          headers: ["Number", "Where the 7 is", "What it is worth"],
          rows: [
            ["7", "Units", "7"],
            ["70", "Tens", "70"],
            ["700", "Hundreds", "700"],
            ["7,000", "Thousands", "7,000"],
            ["70,000", "Ten thousands", "70,000"],
          ],
          note: "Same symbol every time. Five different amounts.",
        },
        analogy:
          "A ₦500 note and a ₦1,000 note are the same size and the same shape. What they are worth is printed on them. In a number, what a digit is worth is not printed, it is shown by where it stands.",
      },
      {
        id: "a-ma-pv-place value",
        title: "Place and value are two different questions",
        explain:
          "The PLACE is the name of the column: units, tens, hundreds, thousands. The VALUE is what the digit is worth there: digit × place. In 48,367 the 8 is in the thousands place and its value is 8,000.",
        why: "Examiners ask both, and students answer the wrong one constantly. 'What is the place of the 8?' wants the word 'thousands'. 'What is the value of the 8?' wants the number 8,000. Answering 8 to either is the single commonest error in the topic.",
        example:
          "48,367\n\n  Ten\n  thousands  Thousands  Hundreds  Tens  Units\n      4          8          3       6      7\n\n  The 4:  place = ten thousands,  value = 40,000\n  The 8:  place = thousands,      value =  8,000\n  The 3:  place = hundreds,       value =    300\n  The 6:  place = tens,           value =     60\n  The 7:  place = units,          value =      7\n\n  Add the values:  40,000 + 8,000 + 300 + 60 + 7 = 48,367  ✓",
        mistake:
          "Answering 'the value of the 8 is 8'. That is the digit. A digit is a symbol; its value is what that symbol is worth where it stands.",
        drill: {
          skill: "L0-N1.2",
          count: 3,
          intro:
            "Three questions on place and value. Read each one carefully, some ask for the place and some ask for the value, and they are not the same answer.",
        },
      },
      {
        id: "a-ma-pv-columns",
        title: "Each column is ten times the one to its right",
        explain:
          "Moving one column to the left multiplies by ten. Units, tens, hundreds, thousands, each is ten of the one before it. That single rule generates the entire chart, in both directions, forever.",
        why: "It is why multiplying by 10 shifts every digit one place left, and why dividing by 10 shifts them one place right. It is also why the chart keeps working to the right of a decimal point, which is where Month 3 picks it up: tenths, hundredths, thousandths, each one a tenth of the one before.",
        table: {
          caption: "The chart, built by multiplying by ten each time.",
          headers: ["Place", "Worth", "As a power of ten"],
          rows: [
            ["Units", "1", "10⁰"],
            ["Tens", "10", "10¹"],
            ["Hundreds", "100", "10²"],
            ["Thousands", "1,000", "10³"],
            ["Ten thousands", "10,000", "10⁴"],
            ["Hundred thousands", "100,000", "10⁵"],
            ["Millions", "1,000,000", "10⁶"],
          ],
          note: "The power of ten is just the number of zeros. That becomes standard form in Month 5.",
        },
        example:
          "Multiplying by 10 moves every digit one place LEFT:\n\n    43  ×  10  =   430\n   430  ×  10  = 4,300\n\nThe zero appears because the units column is now empty and\nsomething has to hold it open.",
      },
      {
        id: "a-ma-pv-zero",
        title: "Zero holds a column open",
        explain:
          "Zero is not nothing. In 4,006 the two zeros are doing a job: they say there are no hundreds and no tens, which is what keeps the 4 standing in the thousands column.",
        why: "Take the zeros out and 4,006 becomes 46, a number nearly a hundred times smaller. This is the commonest error when writing a number from words, and it is why 'four thousand and six' is 4006 and never 406.",
        example:
          "'Four thousand and six'\n\n  Thousands  Hundreds  Tens  Units\n      4         0        0      6\n\n  = 4,006\n\nNOT 406. In 406 the 4 is in the hundreds column, so it is\nworth 400 rather than 4,000.",
        mistake:
          "Writing only the parts that were said out loud. 'Four thousand and six' does not mention hundreds or tens, and each unmentioned column still needs a zero to hold its place.",
        practice: {
          prompt: "Write in figures: 'thirty thousand and fifty'.",
          answer:
            "30,050. Thirty thousand gives 30 in the thousands block; there are no hundreds, so that column is 0; fifty puts 5 in the tens and 0 in the units. A common wrong answer is 3,050, which has lost a column.",
        },
      },
      {
        id: "a-ma-pv-expanded",
        title: "Expanded form, and why it is worth writing out",
        explain:
          "Expanded form writes a number as the sum of what each digit is worth: 5,207 = 5,000 + 200 + 0 + 7. It is the place value chart written on one line.",
        why: "It is not busywork. Expanded form is what makes long multiplication make sense in Lesson 18, what makes rounding obvious in Lesson 16, and what number bases are in Month 6, the same idea with something other than ten in the columns.",
        example:
          "5,207 = (5 × 1,000) + (2 × 100) + (0 × 10) + (7 × 1)\n      = 5,000 + 200 + 0 + 7\n\nAnd the same idea in Month 6, with eight instead of ten:\n\n  527 in base 8 = (5 × 64) + (2 × 8) + (7 × 1)\n                = 320 + 16 + 7\n                = 343 in base ten\n\nSame machinery. Different column values.",
        practice: {
          prompt: "Write 60,403 in expanded form.",
          answer:
            "60,000 + 400 + 3. The tens and the thousands columns are both zero, so they contribute nothing to the sum, but they still hold their places in the numeral itself.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l14-reading-numbers",
    moduleId: "ma-m1-place value",
    sectionId: SECTION_ID,
    order: 2,
    title: "Reading and Writing Big Numbers",
    subtitle: "Blocks of three, and the word 'and'",
    estimatedMinutes: 13,
    intro:
      "Large numbers look intimidating and are not. They are read in blocks of three, from the right, and each block is read the same way. Once you can read one block you can read any number of any size.",

    atoms: [
      {
        id: "a-ma-pv-blocks",
        title: "Group in threes from the right",
        explain:
          "Starting at the units and working left, numbers are grouped in threes. Each group has a name: units, thousands, millions, billions, trillions. The commas in 4,073,512 are not decoration, they mark the groups.",
        why: "This is why you never need to learn a new way to read a bigger number. 4,073,512 is read as '4 million, 73 thousand, 512', you read each block exactly as you would read it on its own and say the block's name after it.",
        example:
          "4,073,512\n\n  Millions │ Thousands │  Units\n      4    │    073    │   512\n\n  'Four million, seventy-three thousand, five hundred and twelve'\n\nNote the middle block: 073. It is read as 'seventy-three',\nbut it is WRITTEN as three digits because every block after\nthe first must be exactly three digits long.",
        mistake:
          "Grouping from the left. The grouping always starts at the units end, which is why the leftmost block can be one, two or three digits while all the others are exactly three.",
      },
      {
        id: "a-ma-pv-words",
        title: "Writing a number in words",
        explain:
          "Read each block, say its name, and move on. Within a block, read the hundreds, then the tens and units together. The word 'and' goes between the hundreds and whatever follows.",
        why: "Questions that ask for a number in words appear in junior papers and, more importantly, in every cheque, invoice and contract a person will ever sign. Writing an amount in words is a legal safeguard precisely because words cannot be altered the way a digit can.",
        example:
          "  305        three hundred and five\n  3,050      three thousand and fifty\n  30,500     thirty thousand, five hundred\n  350,000    three hundred and fifty thousand\n\nEach one contains the digits 3 and 5 and some zeros.\nThe zeros are the whole difference.",
        mistake:
          "Saying 'three thousand and fifty' for 3,500. The word 'and' does not mean 'then some more digits', it separates the hundreds from the tens and units, so 3,500 is 'three thousand, five hundred'.",
      },
      {
        id: "a-ma-pv-figures",
        title: "Writing a number in figures",
        explain:
          "Going the other way: work out how many of each block there are, write each block as three digits, and pad with zeros where a part is not mentioned.",
        why: "This is where the zeros get lost. 'Four hundred thousand and twenty' has no thousands hundreds, no thousands tens, no units hundreds, three zeros that nobody said out loud and all three of which must be written.",
        example:
          "'Four hundred thousand and twenty'\n\n  Thousands block: 'four hundred'        → 400\n  Units block:     'and twenty'          → 020\n\n  = 400,020\n\nWrite each block as THREE digits and the zeros appear\nautomatically. That is the whole technique.",
        drill: {
          skill: "L0-N1.1",
          count: 3,
          intro:
            "Three numbers to write in figures. Build each one in blocks of three and let the zeros fall where the blocks say they should.",
        },
      },
      {
        id: "a-ma-pv-money",
        title: "Reading amounts of money",
        explain:
          "Money is read the same way, with the currency in front. ₦1,250,000 is 'one million, two hundred and fifty thousand naira'. Large amounts are often abbreviated in speech, 1.25 million, and both forms should be readable.",
        why: "Misreading a figure by one block is a factor of a thousand. In a mathematics paper it costs marks; in a contract it is ruinous, and this is exactly why amounts on cheques are written twice, once in figures and once in words.",
        table: {
          caption: "Amounts that look similar and are not.",
          headers: ["In figures", "In words", "Blocks"],
          rows: [
            ["₦125,000", "One hundred and twenty-five thousand naira", "125 | 000"],
            ["₦1,250,000", "One million, two hundred and fifty thousand naira", "1 | 250 | 000"],
            ["₦12,500,000", "Twelve million, five hundred thousand naira", "12 | 500 | 000"],
          ],
          note: "Count the commas. Each one is a block boundary and each block is a factor of a thousand.",
        },
        practice: {
          prompt: "How many times larger is ₦12,500,000 than ₦125,000?",
          answer:
            "100 times. 12,500,000 ÷ 125,000 = 100. Counting blocks is faster than dividing: the second number is 125 thousand and the first is 12,500 thousand.",
        },
      },
      {
        id: "a-ma-pv-standard-preview",
        title: "Where this goes next",
        explain:
          "In Month 5 the same place value idea is written more compactly. 4,000,000 becomes 4 × 10⁶, and 0.000004 becomes 4 × 10⁻⁶. The powers of ten are just the column names from Lesson 13, written as exponents.",
        why: "Standard form is not a new topic. It is this topic with shorter notation, and students who understand place value meet it as an abbreviation rather than as something to memorise.",
        example:
          "  4,000,000  =  4 × 10⁶      ← six zeros, six columns to the left\n        400  =  4 × 10²\n          4  =  4 × 10⁰\n\nThe exponent counts how many columns the 4 has moved\nfrom the units place.",
        practice: {
          prompt: "Without being taught the rule yet: what would 40,000 be as 4 × a power of ten?",
          answer:
            "4 × 10⁴. There are four zeros, which is four columns left of the units place. That is the whole of standard form for large numbers, and Month 5 only adds the small ones.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l15-comparing",
    moduleId: "ma-m1-place value",
    sectionId: SECTION_ID,
    order: 3,
    title: "Comparing and Ordering",
    subtitle: "Which is bigger, and how you can tell at a glance",
    estimatedMinutes: 12,
    intro:
      "90,450 or 89,999? The second one has four nines in it and looks impressive. It is smaller. This lesson is the method that decides such questions in one second rather than by counting.",

    atoms: [
      {
        id: "a-ma-pv-length-first",
        title: "Count the digits first",
        explain:
          "If two whole numbers have different numbers of digits, the one with more digits is larger. Always. No further checking is needed.",
        why: "It settles most comparisons instantly and for a reason worth understanding: an extra digit means an extra column, and each column is worth ten times the one before. A four digit number starts at 1,000; a three digit number stops at 999.",
        example:
          "  9,999   vs   10,000\n\n  9,999  has 4 digits\n  10,000 has 5 digits\n\n  So 10,000 is larger, without comparing a single digit.\n  The largest possible 4-digit number is still smaller than\n  the smallest possible 5-digit one.",
        mistake:
          "Being impressed by nines. 9,999 is the largest four digit number there is and it is still one less than the smallest five digit number.",
      },
      {
        id: "a-ma-pv-compare-left",
        title: "Same length? Compare from the left",
        explain:
          "When two numbers have the same number of digits, compare them column by column starting from the LEFT. The first column where they differ decides it, and nothing to the right of that column matters at all.",
        why: "Because the leftmost column is worth the most. Once one number is ahead in a high-value column, no amount of catching up in smaller columns can close the gap, the largest possible remainder is still less than one unit of the deciding column.",
        example:
          "  90,450   vs   89,999\n\n  Both have 5 digits, so compare from the left:\n\n     9 0 4 5 0\n     8 9 9 9 9\n     ↑\n  9 > 8, so 90,450 is larger. Stop.\n\n  The four nines that follow are irrelevant: they can add at\n  most 9,999, and the gap in the ten thousands column is 10,000.",
        drill: {
          skill: "L0-N1.3",
          count: 3,
          intro:
            "Put each set in the order asked for. Read whether it says ascending or descending before you start, that catches more people than the comparison itself.",
        },
      },
      {
        id: "a-ma-pv-symbols",
        title: "The symbols: <, > and =",
        explain:
          "< means 'is less than'. > means 'is greater than'. = means 'has the same value as'. The wide end of the symbol always faces the larger number.",
        why: "These symbols run all the way through the course: inequalities in Month 6, the range of a function, the domain of a solution, the bounds of a rounded measurement. Getting the direction wrong once is a habit that is expensive to unlearn.",
        table: {
          caption: "Reading the symbols aloud, left to right.",
          headers: ["Written", "Read as", "True?"],
          rows: [
            ["3 < 8", "3 is less than 8", "Yes"],
            ["8 > 3", "8 is greater than 3", "Yes"],
            ["12 < 9", "12 is less than 9", "No"],
            ["−5 < −2", "−5 is less than −2", "Yes, see Month 4"],
          ],
          note: "The small end points at the smaller number. It is the only thing to remember.",
        },
        mistake:
          "Reading the symbol backwards because the larger number happens to be written second. Read left to right, in order, exactly as it is written.",
      },
      {
        id: "a-ma-pv-ordering",
        title: "Ascending and descending",
        explain:
          "ASCENDING means smallest first, climbing. DESCENDING means largest first, coming down. Questions specify which, and the instruction is worth as much as the ordering.",
        why: "This is an echo of the language module earlier this month: a perfectly correct ordering written the wrong way round scores nothing. It is the same error as simplifying when asked to solve, in a different topic.",
        example:
          "Put 4,502   4,052   4,520   4,025  in ascending order.\n\n  All four digits, all starting with 4. Compare the next column:\n\n    4,025  ← 0\n    4,052  ← 0\n    4,502  ← 5\n    4,520  ← 5\n\n  The two with 0 come first; split them on the next column\n  (2 vs 5). Same again for the other pair.\n\n  Ascending: 4,025   4,052   4,502   4,520",
        practice: {
          prompt: "Write those same four numbers in descending order.",
          answer:
            "4,520  4,502  4,052  4,025, the same list, reversed. If you have done the ascending order correctly, descending is free.",
        },
      },
      {
        id: "a-ma-pv-numberline",
        title: "The number line",
        explain:
          "A number line lays numbers out in order, left to right, smallest to largest. Further right means larger, always, and the line never stops in either direction.",
        why: "The number line is the picture that keeps working for the rest of the course: negatives sit to the left of zero in Month 4, fractions sit between the whole numbers in Month 3, and rounding is a question about which of two neighbours a number is nearer to.",
        example:
          "  ──┼────┼────┼────┼────┼────┼────┼──\n    0   10   20   30   40   50   60\n                      ▲\n                     37\n\n  37 is between 30 and 40, and it is nearer to 40.\n  That is the whole of rounding, and it is the next lesson.",
        analogy:
          "A road with kilometre markers. Where a town sits on the road tells you everything about which towns it is before and after, without needing to know anything else about it.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l16-rounding",
    moduleId: "ma-m1-place value",
    sectionId: SECTION_ID,
    order: 4,
    title: "Rounding Whole Numbers",
    subtitle: "One digit decides, and it is not the one you think",
    estimatedMinutes: 14,
    intro:
      "A trader asked roughly how many sachets she sold this week says 'about five thousand'. The exact figure was 4,738. She did not lie and she did not count again. This lesson is what she did.",

    atoms: [
      {
        id: "a-ma-pv-why-round",
        title: "Why anybody rounds",
        explain:
          "Rounding replaces a number with a nearby, simpler one. We do it when the exact figure is more precision than the situation needs, or when it is not known that precisely in the first place.",
        why: "Every measurement is rounded, a length 'of 5 cm' is really somewhere between 4.5 and 5.5 cm. Understanding that rounding is about NEARNESS, not about chopping digits off, is what makes bounds, significant figures and degree of accuracy make sense later.",
        table: {
          caption: "The same figure, rounded for different purposes.",
          headers: ["Situation", "Figure used", "Why"],
          rows: [
            ["Stock records", "4,738", "Exact count matters"],
            ["Explaining the week to a partner", "About 4,700", "Nearest hundred is enough"],
            ["A rough weekly average", "About 5,000", "Nearest thousand is enough"],
          ],
          note: "None of these is more correct than the others. They answer different questions.",
        },
      },
      {
        id: "a-ma-pv-deciding-digit",
        title: "Only one digit decides",
        explain:
          "To round to a place: find that place, then look at the ONE digit immediately to its right. If that digit is 5 or more, round up. If it is 4 or less, round down. Everything to the right of the rounding place becomes zero.",
        why: "Only one digit has a vote, and students routinely give votes to all of them. In 4,738 rounded to the nearest thousand, the deciding digit is the 7, the 3 and the 8 have no say at all, however large they look.",
        example:
          "Round 4,738 to the nearest thousand.\n\n  Thousands place:     4\n  Digit to its right:  7      ← the ONLY digit that decides\n\n  7 is 5 or more  →  round UP\n\n  4,738  →  5,000\n\n\nRound 4,738 to the nearest hundred.\n\n  Hundreds place:      7\n  Digit to its right:  3      ← now the 3 decides\n\n  3 is less than 5  →  round DOWN\n\n  4,738  →  4,700",
        mistake:
          "Rounding in stages: 4,738 → 4,740 → 4,700 → 5,000. Round ONCE, from the original number. Chain rounding pushes a number past where it should go, and it is named directly in the Chief Examiners' reports as a cause of lost accuracy marks.",
        drill: {
          skill: "L0-N1.4",
          count: 3,
          intro:
            "Three roundings. For each one, find the place named in the question first, then look at exactly one digit to its right.",
        },
      },
      {
        id: "a-ma-pv-between",
        title: "Rounding is a question about neighbours",
        explain:
          "Any number sits between two multiples of the size you are rounding to. Rounding asks which of those two neighbours it is nearer to. The 'look at one digit' rule is a shortcut for answering that.",
        why: "Seeing it on a line makes the rule obvious instead of arbitrary, and it explains the convention for exactly halfway: 4,500 is the same distance from both neighbours, and mathematics agrees to round up so that everyone gets the same answer.",
        example:
          "  Round 4,738 to the nearest thousand:\n\n  ──┼──────────────────────┼──\n  4,000                  5,000\n              ▲\n            4,738\n\n  4,738 is past halfway (4,500), so it is nearer to 5,000.\n\n  The deciding digit rule says the same thing: the digit after\n  the thousands place is 7, and 7 is past 5, which IS halfway.",
        analogy:
          "Two bus stops, one at 4,000 and one at 5,000. You are standing at 4,738 and you walk to the nearer one. The rule just saves you measuring.",
      },
      {
        id: "a-ma-pv-nines",
        title: "When rounding up carries",
        explain:
          "If the digit being rounded up is a 9, it becomes 10, which does not fit in one column. The 1 carries into the next column to the left, exactly as in addition.",
        why: "This is the case that catches people, and it is not a special rule. It is ordinary carrying. 1,962 to the nearest hundred is 2,000, not 1,1000 and not 1,900.",
        example:
          "Round 1,962 to the nearest hundred.\n\n  Hundreds place:      9\n  Digit to its right:  6   →  round UP\n\n  9 hundreds + 1 hundred = 10 hundreds = 1 thousand\n\n  So the 1 carries:   1,962  →  2,000\n\nNot 1,1000. Ten hundreds is a thousand, and it goes into\nthe thousands column.",
        practice: {
          prompt: "Round 49,650 to the nearest thousand.",
          answer:
            "50,000. The thousands digit is 9 and the digit to its right is 6, so it rounds up; 9 thousands plus 1 thousand is 10 thousands, which carries into the ten thousands column and makes 50,000.",
        },
      },
      {
        id: "a-ma-pv-estimating",
        title: "Estimating before you calculate",
        explain:
          "Round each number to something easy, do the easy calculation in your head, and you have a rough answer BEFORE you start. Then the real answer has something to be checked against.",
        why: "An estimate catches errors that checking the arithmetic cannot, because it tests the method rather than the calculation. If 483 × 19 should be about 10,000 and your answer is 917, you multiplied wrongly, and you know it without rechecking a single digit.",
        example:
          "  483 × 19\n\n  Estimate:  500 × 20  =  10,000\n\n  Now calculate properly. Any answer near 10,000 is plausible.\n\n    917        ← far too small. Something is wrong.\n    9,177      ← plausible. (The exact answer is 9,177.)\n    91,770     ← far too big. A place value slip.",
        mistake:
          "Estimating after calculating. An estimate made from the answer cannot catch an error in the answer, it can only agree with it. The estimate has to come first.",
        practice: {
          prompt: "Estimate 612 × 38 by rounding each number to one significant figure.",
          answer:
            "600 × 40 = 24,000. The exact value is 23,256, so the estimate is the right size, which is all an estimate is for. It would immediately expose an answer of 2,325 or 232,560.",
        },
      },
    ],

    task: {
      title: "Before you move on",
      intro:
        "Take any five prices from a receipt, a market list, or your own phone bill, and for each one:",
      prompts: [
        "Write it in words, then in expanded form.",
        "Round it to the nearest hundred naira and to the nearest thousand naira.",
        "Put all five in ascending order.",
        "Estimate their total by rounding each one, then add them exactly and compare.",
      ],
      closing:
        "The last step is the one that matters. If your estimate and your exact total are far apart, one of them is wrong, and finding out which is exactly the habit the rest of this course depends on.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
