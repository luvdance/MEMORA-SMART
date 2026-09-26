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

export const SECTION_ID = "ma-s1-place-value";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l13-digits",
    moduleId: "ma-m1-place-value",
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
        origin:
          "Ten symbols that can write any number at all is an invention, and a fairly recent one in Europe. The Romans had no such system. They wrote numbers as letters, so a large number needed a longer and longer string of them, and multiplying two Roman numerals on paper is close to impossible. Roman merchants did not try: they calculated on a counting board with pebbles and used the numerals only to write the result down. The system we use came from India, reached the Arab world, and was carried into Europe by merchants who found it faster.",
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
        id: "a-ma-pv-place-value",
        title: "Place and value are two different questions",
        explain:
          "The PLACE is the name of the column: units, tens, hundreds, thousands. The VALUE is what the digit is worth there: digit × place. In 48,367 the 8 is in the thousands place and its value is 8,000.",
        origin:
          "The idea that a symbol's position carries information appears independently in several places: Babylon, China, and among the Maya. The version that spread across the world was developed in India by about the sixth century, and its great advantage was that it needed a symbol for an empty column. Once zero was accepted as a mark in its own right, the whole system worked, and calculation on paper became possible for ordinary people rather than only for specialists with a counting board.",
        why: "Examiners ask both, and students answer the wrong one constantly. 'What is the place of the 8?' wants the word 'thousands'. 'What is the value of the 8?' wants the number 8,000. Answering 8 to either is the single commonest error in the topic.",
        example:
          "  A trader's takings for the month: ₦48,367\n\n  Ten\n  thousands Thousands Hundreds Tens Units\n      4         8        3      6     7\n\n  The 4:  place = ten thousands\n          value = ₦40,000\n\n  The 8:  place = thousands\n          value = ₦8,000\n\n  The 7:  place = units\n          value = ₦7\n\n  Two 4s in one number can be worth very\n  different amounts, and the column is the\n  only thing that decides which.",
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
        id: "a-ma-pv-powers-of-ten",
        title: "A shorter way to write ten times ten",
        explain:
          "Writing 10 x 10 x 10 x 10 x 10 x 10 is tiring and easy to miscount, so we write down how many tens are being multiplied instead, as a small raised number. That small number has three names, all meaning the same thing: it is called a raised number, or a power, or an index. You will meet all three, so it is worth knowing now that they are one idea. Six tens multiplied together is written 10 with a small 6 above it. That is the whole idea, and the small number is doing one job only: counting how many copies are multiplied together.",
        origin:
          "This notation is Rene Descartes', from 1637, and it is one of the reasons his book was so much easier to read than what came before. Earlier writers had no compact way to say it. They wrote words like cubus for a quantity multiplied by itself three times, or repeated the letter across the page, and a page of that is genuinely hard to follow. A French bookkeeper called Nicolas Chuquet had hit on raised numbers in 1484, but his manuscript sat unpublished for four hundred years, so nobody built on it. The raised number has two names still in use: an index, and an exponent. They mean the same thing.",
        why: "The place value chart is built entirely out of these. Each column to the left is one more ten multiplied in, so the raised number and the count of zeros are always the same number. Once you can read the chart that way it stops being seven names to memorise and becomes one pattern you can extend in either direction as far as you need.",
        example:
          "  10             = 10       one ten         10 with a small 1\n  10 x 10        = 100      two tens        10 with a small 2\n  10 x 10 x 10   = 1,000    three tens      10 with a small 3\n\n  Written properly:\n\n    10\u00b9 = 10        10\u00b2 = 100        10\u00b3 = 1,000\n\n  The raised number and the number of zeros match, because\n  each ten multiplied in opens exactly one new column.\n\n\n  The same shorthand works for any number, not only ten:\n\n    3 x 3       = 9     written 3\u00b2    read 'three squared'\n    2 x 2 x 2   = 8     written 2\u00b3    read 'two cubed'\n\n  Squared and cubed are just the names for two and three,\n  and they come from area and volume: a square of side 3\n  holds 9 unit squares, and a cube of side 2 holds 8 unit\n  cubes. Month 2 does more with this. For now you only need\n  to be able to read it.",
        mistake:
          "Reading 3 with a small 2 as 3 x 2, which gives 6 when the answer is 9. The habit survives because it happens to give the right answer for 2 with a small 2, where both readings give 4. The small number counts how many threes there are. It is not one of the things being multiplied.",
        practice: {
          prompt:
            "Which column of the place value chart is 10 with a small 4 above it, and how many zeros does that number have?",
          answer:
            "It is 10,000, the ten thousands column, and it has four zeros. The raised 4 counts four tens multiplied together, and each ten multiplied in adds one zero, so the raised number and the zero count are always equal for powers of ten.",
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
          note: "The raised number is simply the count of zeros, which is why the two columns on the right always agree. Note that 10 with a small 0 means one, not zero. Month 5 explains why that has to be so.",
        },
        example:
          "  A sachet costs ₦50.\n\n    1 sachet     =  ₦50\n    10 sachets   =  ₦500\n    100 sachets  =  ₦5,000\n\n  Look at what happened to the digits. The 5\n  moved one column to the LEFT each time, and\n  a zero came in behind it to hold the empty\n  column open.\n\n    50  ×  10  =   500\n   500  ×  10  = 5,000\n\n  That is all multiplying by ten does: every\n  digit shifts one place left, because every\n  column is worth ten times the one to its\n  right.\n\n  It is the same rule in reverse going the\n  other way, which is Month 3.",
      },
      {
        id: "a-ma-pv-zero",
        title: "Zero holds a column open",
        explain:
          "Zero is not nothing. In 4,006 the two zeros are doing a job: they say there are no hundreds and no tens, which is what keeps the 4 standing in the thousands column.",
        origin:
          "Zero is the most argued over number in history, because a symbol for nothing is a strange thing to want. The oldest known use of a dot as a placeholder is in the Bakhshali manuscript from the region that is now Pakistan. Europe resisted it along with the rest of the new numerals: Florence banned merchants from using Hindu and Arabic numerals in 1299, on the grounds that they were too easy to alter, since a 0 can be turned into a 6 or a 9 with one stroke of a pen while a Roman numeral cannot. The word itself travelled as far as the idea did. The Arabic sifr means empty, which became zephirum in Italian and then zero, and the same Arabic word also gave us cipher.",
        why: "Take the zeros out and 4,006 becomes 46, a number nearly a hundred times smaller. This is the commonest error when writing a number from words, and it is why 'four thousand and six' is 4006 and never 406.",
        example:
          "  Writing ₦4,006 on a bank slip.\n\n  'Four thousand and six naira'\n\n  Thousands  Hundreds  Tens  Units\n      4         0        0      6\n\n    =  ₦4,006\n\n  The two zeros are not nothing. They are\n  holding the hundreds and tens columns open.\n\n  Take them out and you have written ₦46,\n  which is a difference of nearly four\n  thousand naira on a real slip.\n\n  That is what zero is for: it says this\n  column is empty, and keeps every other\n  digit in its proper place.",
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
    moduleId: "ma-m1-place-value",
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
        origin:
          "Grouping digits in threes is a convention of print rather than of mathematics, and it is not universal. Many countries use a full stop where we use a comma, so a European price list might write one thousand two hundred as 1.200. The Indian system groups differently again, in twos after the first three, which is where the words lakh and crore come from. When you read a figure from an unfamiliar source, it is worth checking which convention it is using before trusting it.",
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
        origin:
          "Number words are less stable than they look, and one of them has actually changed meaning within living memory. A billion in Britain used to mean a million million, while in America it meant a thousand million, so the same word named two numbers a thousand times apart. Britain officially adopted the American meaning in 1974. If you read an old British book quoting a figure in billions, it is worth checking which billion it means, and this is a good reason to be able to read a number in figures as well as in words.",
        why: "Questions that ask for a number in words appear in junior papers and, more importantly, in every cheque, invoice and contract a person will ever sign. Writing an amount in words is a legal safeguard precisely because words cannot be altered the way a digit can.",
        example:
          "  Amounts written the way a bank slip wants\n  them, in words as well as figures:\n\n    ₦305      three hundred and five naira\n\n    ₦3,050    three thousand and fifty naira\n\n    ₦30,500   thirty thousand, five hundred\n              naira\n\n    ₦350,000  three hundred and fifty\n              thousand naira\n\n  Every one of those contains a 3, a 5 and\n  some zeros. The zeros are the whole\n  difference between ₦305 and ₦350,000.\n\n  This is why a bank asks for words as well\n  as figures. A digit can be altered and a\n  written sentence is far harder to fake.",
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
        origin:
          "Nigeria's currency change was a place value reform and nothing else. Until 1973 the country used pounds, shillings and pence, where twelve pence made a shilling and twenty shillings made a pound, so adding up a bill meant carrying at twelve in one column and at twenty in the next. The naira replaced it on the first of January 1973, with one hundred kobo to the naira, and the name is credited to Obafemi Awolowo as a contraction of Nigeria. The whole point of the change was that money now carries in tens like every other number, so the arithmetic in this lesson is the arithmetic of money with no extra rules at all.",
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
          "In Month 5 the same place value idea gets a name, standard form, and a rule. 4,000,000 is written 4 × 10⁶, using exactly the powers of ten you met earlier in this lesson. Very small numbers work the same way in the other direction, using a raised number with a minus sign in front of it, and that half waits for Month 5 because it needs decimals first.",
        why: "Standard form is not a new topic. It is this topic with shorter notation, and students who understand place value meet it as an abbreviation rather than as something to memorise.",
        example:
          "  4,000,000  =  4 × 10⁶      ← six zeros, six columns to the left\n        400  =  4 × 10²\n          4  =  4 × 10⁰\n\nThe exponent counts how many columns the 4 has moved\nfrom the units place.",
        practice: {
          prompt: "Write 40,000 as 4 multiplied by a power of ten.",
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
    moduleId: "ma-m1-place-value",
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
          "  Two prices for the same generator:\n\n    Shop A:  ₦9,999\n    Shop B:  ₦10,000\n\n  Count the digits before anything else:\n\n    9,999   has 4 digits\n    10,000  has 5 digits\n\n  So Shop B is more expensive, and you never\n  compared a single digit.\n\n  The biggest 4 digit number there is, 9,999,\n  is still smaller than the smallest 5 digit\n  number, 10,000. More columns always wins.\n\n  It is only ₦1 between them, and the rule\n  did not need to know that to answer.",
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
          "  Two salaries offered for the same job:\n\n    ₦90,450   and   ₦89,999\n\n  Both have 5 digits, so counting digits does\n  not settle it. Compare from the LEFT:\n\n     9 0 4 5 0\n     8 9 9 9 9\n     ↑\n     ten thousands: 9 beats 8. Stop there.\n\n  ₦90,450 is the bigger salary.\n\n  The 89,999 has far bigger digits everywhere\n  else, and it cannot catch up, because the\n  ten thousands column is worth more than all\n  the columns to its right put together.\n\n  Start on the left, and stop at the first\n  column where they differ.",
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
        origin:
          "The signs for less than and greater than were introduced by the English mathematician Thomas Harriot and appeared in print in 1631, in a book published ten years after he died. The design is deliberate: the symbol opens towards the larger quantity and closes to a point at the smaller one, so it is a picture of the comparison rather than an arbitrary mark. Harriot had spent time in the Americas as a surveyor and navigator, which is the kind of work that makes you want compact notation.",
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
          "  Four shops quote for the same phone:\n\n    ₦4,502   ₦4,052   ₦4,520   ₦4,025\n\n  Put them in order, cheapest first.\n\n  All four digits, all starting with 4, so go\n  to the next column along:\n\n    4,025   ← hundreds digit 0\n    4,052   ← hundreds digit 0\n    4,502   ← hundreds digit 5\n    4,520   ← hundreds digit 5\n\n  The first two are still tied, so go one\n  column further: 2 against 5, so 4,025 is\n  cheaper. Same for the last pair: 0 against\n  2, so 4,502 is cheaper than 4,520.\n\n  Cheapest first:\n\n    ₦4,025  ₦4,052  ₦4,502  ₦4,520\n\n  Ascending means going up, and descending\n  means going down. The words are worth\n  getting right, because a question will say\n  which one it wants.",
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
          "  A journey is 37 km. Put it on a line:\n\n  ──┼────┼────┼────┼────┼────┼────┼──\n    0   10   20   30   40   50   60\n                      ▲\n                     37\n\n  37 sits between 30 and 40, and it is nearer\n  to 40 than to 30.\n\n  So if somebody asks roughly how far it is,\n  the honest short answer is 'about 40 km'.\n\n  That is the whole of rounding, and it is the\n  next lesson. You have been doing it in\n  conversation for years.",
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
    moduleId: "ma-m1-place-value",
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
        origin:
          "Rounding became a formal part of arithmetic when measurement became precise enough to need it. An astronomer or a surveyor works with figures that are already approximate, since no instrument is perfect, and carrying twelve digits of a measurement that is only accurate to three is a way of lying about how much you know. The rule that you round once, at the end, comes from exactly that concern: every intermediate rounding throws away a little more of the accuracy you actually had.",
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
          "  A trader's takings were ₦4,738.\n  Round to the nearest thousand.\n\n    Thousands place:     4\n    Digit to its right:  7\n\n  That 7 is the ONLY digit that decides.\n\n    7 is 5 or more  →  round UP\n\n    ₦4,738  →  ₦5,000\n\n\n  The 3 and the 8 get no say at all.\n\n  Check it the other way to see why: 4,738 is\n  past halfway between 4,000 and 5,000, and\n  halfway is 4,500. Once you know it is past\n  4,500 the rest of the digits cannot bring\n  it back.",
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
          "  The trader's ₦4,738 again, to the nearest\n  thousand. Put it between its neighbours:\n\n  ──┼──────────────────────┼──\n  ₦4,000                  ₦5,000\n              ▲\n            ₦4,738\n\n  The only question is: which of the two is it\n  closer to?\n\n    Halfway would be ₦4,500.\n    ₦4,738 is past halfway.\n    So it is closer to ₦5,000.\n\n  Answer: ₦5,000\n\n  That is why the deciding digit rule works.\n  Asking whether the digit is 5 or more is\n  the same as asking whether you are past\n  halfway, and it is quicker to check.",
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
          "  A day's takings were ₦1,962.\n  Round to the nearest hundred.\n\n    Hundreds place:      9\n    Digit to its right:  6   →  round UP\n\n  But 9 cannot go up to 10 inside one column.\n  So it carries, exactly as in Month 2:\n\n    19 hundreds, rounded up, becomes 20\n    hundreds, which is 2,000.\n\n    ₦1,962  →  ₦2,000\n\n  Notice the thousands digit changed from 1\n  to 2 even though nobody touched it. That is\n  the carry arriving from the column to its\n  right, and it is the same carry you already\n  do when adding.",
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
          "  You are at a counter with a ₦10,000 note\n  and this list:\n\n    rice        ₦4,150\n    oil         ₦2,890\n    tomatoes      ₦960\n    pepper        ₦740\n\n  Will the note cover it? You do not need the\n  exact total to answer.\n\n  ROUND EACH ONE FIRST:\n\n    ₦4,150  →  ₦4,000\n    ₦2,890  →  ₦3,000\n      ₦960  →  ₦1,000\n      ₦740  →    ₦700\n                --------\n                  ₦8,700\n\n  About ₦8,700, so yes, comfortably.\n\n  THE EXACT TOTAL, for comparison:\n\n    4,150 + 2,890 + 960 + 740  =  ₦8,740\n\n  The estimate was ₦40 out, and it answered\n  the question you actually had.\n\n\n  This is the most useful habit in the module.\n  Estimate first, then calculate, and if the\n  two are far apart it is the calculation that\n  is wrong, not the estimate.",
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
