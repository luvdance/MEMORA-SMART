/**
 * MATHEMATICS · MONTH 2 · MODULE 1 · THE FOUR OPERATIONS AND BODMAS
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/, and the
 * drill questions are generated on the server in lib/academy/maths/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Four operations and one rule about their order. The operations themselves
 * are primary content; what is not primary, and what this module spends its
 * time on, is knowing WHICH one a worded situation is asking for and why the
 * order matters at all.
 *
 * Speed is treated as a skill here rather than as a talent. A student who
 * spends working memory on 7 × 8 has none left for the problem that 7 × 8 was
 * a step inside, and that is the real cost of not knowing the tables.
 */

export const SECTION_ID = "ma-s2-operations";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l17-add-subtract",
    moduleId: "ma-m2-operations",
    sectionId: SECTION_ID,
    order: 1,
    title: "Addition and Subtraction, Properly",
    subtitle: "Columns, carrying, and checking your own work",
    estimatedMinutes: 13,
    intro:
      "Everyone can add. Rather fewer can add a column of six figures and be confident it is right. This lesson is about the second thing: method that is reliable under pressure, and a way of checking that does not just repeat the same mistake.",

    atoms: [
      {
        id: "a-ma-op-columns",
        title: "Line up the columns, not the edges",
        explain:
          "Written addition and subtraction work because each column is a different value. Units go under units, tens under tens, hundreds under hundreds. Lining numbers up by their right hand edge works for whole numbers only because that IS the units column.",
        why: "The moment decimals arrive in Month 3, lining up by the right hand edge gives wrong answers: 3.5 and 0.42 have to be written as 3.50 and 0.42. Learning the real rule now, rather than the shortcut, means nothing has to be unlearned later.",
        example:
          "  Correct:            Wrong:\n\n     4 7 3               4 7 3\n   +   8 6             + 8 6\n   ─────────           ─────────\n     5 5 9               (nonsense)\n\nIn the wrong version the 8 tens have been placed under the\n4 hundreds, so eighty is being added as eight hundred.",
        mistake:
          "Writing numbers of different lengths flush left. It looks tidy and it adds the wrong columns together.",
      },
      {
        id: "a-ma-op-carrying",
        title: "Carrying is just place value doing its job",
        explain:
          "When a column adds to more than 9, it cannot fit in one column. The excess carries into the next column to the left, because ten of any column is exactly one of the column above it.",
        why: "Carrying is not a trick. Ten units are one ten; ten tens are one hundred. Every carry is that fact being used. Students who see it as a rule to remember tend to forget the carry under pressure; students who see what it is do not.",
        example:
          "    ¹\n    4 7\n  + 3 8\n  ───────\n    8 5\n\n  Units:  7 + 8 = 15  →  write 5, carry 1 ten\n  Tens:   4 + 3 + 1 = 8\n\nThe carried 1 is one TEN, which is why it is written above\nthe tens column and not anywhere else.",
        analogy:
          "Ten ₦100 notes are exchanged at the counter for one ₦1,000 note. Nothing has changed in value; it is just held in a larger denomination so it fits in fewer slots.",
      },
      {
        id: "a-ma-op-borrowing",
        title: "Borrowing is the same exchange, backwards",
        explain:
          "When a column has too little to subtract from, it borrows from the column to its left: one of the larger unit is exchanged for ten of the smaller one.",
        why: "Same idea as carrying, in the opposite direction. Seeing them as one exchange rather than two separate procedures halves what there is to remember and makes both of them harder to forget.",
        example:
          "    5 ¹2\n    6 2\n  − 2 7\n  ───────\n    3 5\n\n  Units:  2 − 7 cannot be done, so borrow.\n          Take 1 ten from the 6 tens, leaving 5 tens.\n          The units column becomes 12.\n          12 − 7 = 5\n  Tens:   5 − 2 = 3",
        mistake:
          "Subtracting the smaller digit from the larger one in each column regardless of which is on top. In 62 − 27 that gives 45: the units were done as 7 − 2 instead of borrowing. It is the commonest subtraction error there is.",
      },
      {
        id: "a-ma-op-checking",
        title: "Check with the inverse, not by repeating",
        explain:
          "Addition and subtraction undo each other. To check 62 − 27 = 35, add 35 + 27 and see whether you get 62. To check an addition, subtract one of the numbers from the total.",
        why: "Repeating the same calculation tends to repeat the same mistake, because you make it for the same reason both times. The inverse operation is a genuinely different route to the same place, so an error has to survive two different methods to get through.",
        example:
          "  Claim:   473 + 86 = 559\n\n  Check:   559 − 86 = 473   ✓\n\n\n  Claim:   62 − 27 = 45\n\n  Check:   45 + 27 = 72   ✗   (should be 62)\n\n  The check catches it. 45 is wrong; the answer is 35.",
        practice: {
          prompt:
            "A student works out 804 − 376 and gets 572. Check it with the inverse without redoing the subtraction.",
          answer:
            "572 + 376 = 948, not 804. So 572 is wrong. The correct answer is 428, and 428 + 376 = 804 confirms it. The student almost certainly subtracted the smaller digit from the larger in each column.",
        },
      },
      {
        id: "a-ma-op-which-operation",
        title: "Which operation does this situation need?",
        explain:
          "The hard part of a word problem is rarely the arithmetic. It is deciding which operation the words describe. Combining amounts is addition. Finding a difference, or what is left, is subtraction.",
        why: "This is the foundation of the translation skill that Month 9 makes a whole module of, and that WAEC's examiners report as the single most common weakness. It starts here, with two operations, where it is easy.",
        table: {
          caption: "Words that signal each operation, as clues, not as rules.",
          headers: ["Signals addition", "Signals subtraction"],
          rows: [
            ["altogether, total, sum", "how many more, difference"],
            ["combined, in all", "how much is left, remaining"],
            ["gained, deposited, added", "spent, withdrawn, fell by"],
            ["increased by", "decreased by, change from"],
          ],
          note: "Clues, not rules. 'How many more' with the answer unknown is subtraction; 'five more than' is addition. The situation decides, not the phrase.",
        },
        mistake:
          "Learning the signal words as a lookup table and stopping there. 'Ada has 5 more than Bola, and Ada has 12' is a subtraction despite containing 'more than'. Picture the situation before choosing.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l18-multiplication",
    moduleId: "ma-m2-operations",
    sectionId: SECTION_ID,
    order: 2,
    title: "Multiplication",
    subtitle: "Tables to instant recall, then long multiplication",
    estimatedMinutes: 16,
    intro:
      "Multiplication is repeated addition made fast. The tables are the part that has to be known rather than worked out, and this lesson explains why that is worth the effort, and then builds long multiplication out of place value rather than out of a remembered layout.",

    atoms: [
      {
        id: "a-ma-op-what-multiply",
        title: "What multiplication actually means",
        explain:
          "7 × 8 means seven lots of eight, or equally eight lots of seven. Both give 56, and the fact that the order does not matter is a genuine property of multiplication rather than a coincidence.",
        why: "Knowing the order does not matter halves the tables you have to learn: once you know 7 × 8, you know 8 × 7 for free. It also means you can choose the easier version, since 2 × 47 is the same as 47 × 2, and one of those is much faster in your head.",
        example:
          "  7 × 8  as seven rows of eight:\n\n    ● ● ● ● ● ● ● ●\n    ● ● ● ● ● ● ● ●\n    ● ● ● ● ● ● ● ●\n    ● ● ● ● ● ● ● ●\n    ● ● ● ● ● ● ● ●\n    ● ● ● ● ● ● ● ●\n    ● ● ● ● ● ● ● ●\n\n  Turn the page sideways and it is eight rows of seven.\n  Same dots. 56 either way.",
        analogy:
          "A crate holds 7 rows of 8 bottles. Rotating the crate does not change how many bottles are in it.",
      },
      {
        id: "a-ma-op-tables",
        title: "Tables are recall, not calculation",
        explain:
          "A table fact should arrive in under three seconds without any working. If you are counting up in sevens to reach 7 × 8, the fact is not yet known, and the counting is using attention the actual problem needs.",
        why: "This is the most underrated thing in secondary mathematics. Working memory is small and fixed. A student who spends it on 7 × 8 has none left for the fractions, the algebra or the word problem that 7 × 8 was one step inside, and will appear to be bad at those topics instead.",
        table: {
          caption: "How much there actually is to learn.",
          headers: ["Claim", "Reality"],
          rows: [
            ["144 facts in the 12 × 12 square", "Order does not matter, so about 78"],
            ["The 1, 2, 5 and 10 times tables", "Almost free: patterns rather than memory"],
            ["The 11 times table to 11 × 9", "Repeat the digit: 11 × 7 = 77"],
            ["What is genuinely left", "Roughly 20 to 25 awkward facts"],
          ],
          note: "The hard core is 6×7, 6×8, 7×8, 7×9, 8×9 and their partners. That is a short list, and it is worth ten minutes a day.",
        },
        drill: {
          skill: "L0-N2.1",
          count: 5,
          intro:
            "Five table facts. These are meant to be recalled rather than worked out. If you find yourself counting, note which fact it was and drill that one.",
        },
      },
      {
        id: "a-ma-op-by-ten",
        title: "Multiplying by 10, 100 and 1,000",
        explain:
          "Multiplying by 10 moves every digit one column to the left and a zero fills the units. By 100, two columns. By 1,000, three. The zeros appear because columns are being vacated, not because zeros are being 'added'.",
        why: "Said as 'add a zero' it breaks the moment decimals arrive: 3.5 × 10 is 35, not 3.50. Said as 'move one column left' it keeps working for decimals, for standard form in Month 5, and for number bases in Month 6.",
        example:
          "    43 × 10   =    430      one column left\n    43 × 100  =  4,300      two columns left\n   4.3 × 10   =     43       one column left, no zero anywhere\n\n'Add a zero' gets the first two right and the third wrong.\n'Move the digits' gets all three right.",
        mistake:
          "Teaching yourself 'add a zero'. It is a description of what happens in one special case, not a rule, and it will fail you in Month 3.",
      },
      {
        id: "a-ma-op-long-multiplication",
        title: "Long multiplication is place value in a layout",
        explain:
          "To multiply 348 × 24, split the 24 into 20 + 4, multiply by each part, and add the results. The written layout is simply a way of keeping that organised.",
        why: "The placeholder zero on the second row is the whole reason the method works. That row is 348 × 20, not 348 × 2, and without the zero it is ten times too small. Students who know why the zero is there stop forgetting it.",
        example:
          "      3 4 8\n    ×   2 4\n    ─────────\n    1 3 9 2        ← 348 × 4\n    6 9 6 0        ← 348 × 20   (note the zero)\n    ─────────\n    8 3 5 2\n\n  Check by estimating:  350 × 25 ≈ 8,750.\n  8,352 is the right size. ✓",
        mistake:
          "Leaving the placeholder zero off the second row, which gives 1392 + 696 = 2088, wrong by thousands, from a method that was otherwise perfect.",
        drill: {
          skill: "L0-N2.2",
          count: 3,
          intro:
            "Three long multiplications. Split the second number into tens and units, keep the placeholder zero, and estimate first so you know roughly what to expect.",
        },
      },
      {
        id: "a-ma-op-multiply-words",
        title: "When a situation needs multiplication",
        explain:
          "Multiplication appears when the same amount is repeated: a price per item, a rate per hour, a number of rows each the same length. The phrase 'of' also signals it: a fraction or percentage OF an amount is a multiplication.",
        why: "Recognising the repeated amount shape is what turns a paragraph into a calculation. It is also the shape that fractions, percentages, ratio and area all share, so it is worth recognising early.",
        table: {
          caption: "The same shape, four topics.",
          headers: ["Situation", "Calculation", "Where it comes back"],
          rows: [
            ["14 cartons at ₦4,500 each", "14 × 4,500", "Commercial arithmetic, Month 5"],
            ["3/4 of ₦12,000", "3/4 × 12,000", "Fractions, Month 3"],
            ["15% of 8,000 students", "0.15 × 8,000", "Percentages, Month 3"],
            ["A room 9 m by 4 m", "9 × 4", "Area, Month 4"],
          ],
        },
        practice: {
          prompt:
            "A generator uses 3 litres of diesel an hour and runs for 7 hours a day. Diesel is ₦1,150 a litre. What is the daily fuel cost, and what shape is this calculation?",
          answer:
            "3 × 7 = 21 litres a day, and 21 × 1,150 = ₦24,150. Two repeated amount shapes in a row: litres per hour repeated over hours, then naira per litre repeated over litres.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l19-division",
    moduleId: "ma-m2-operations",
    sectionId: SECTION_ID,
    order: 3,
    title: "Division and What the Remainder Means",
    subtitle: "The operation where the context decides the answer",
    estimatedMinutes: 15,
    intro:
      "A trader has 100 eggs and packs them in crates of 12. Eight crates go out full and four eggs sit on the counter. Whether the answer is 8 or 9 depends entirely on what was asked, and that makes division the operation where reading the question matters most.",

    atoms: [
      {
        id: "a-ma-op-what-divide",
        title: "Two questions, one operation",
        explain:
          "Division answers two different-sounding questions with the same calculation. 'Share 12 among 3' asks how big each share is. 'How many 3s fit into 12?' asks how many shares there are. Both are 12 ÷ 3 = 4.",
        why: "Recognising both readings is what makes dividing by a fraction make sense in Month 3. '3 ÷ 1/2' is nonsense as sharing, since you cannot share among half a person, but it is perfectly clear as 'how many halves fit into 3?'. The answer is 6.",
        example:
          "  12 ÷ 3\n\n  Sharing:   12 items shared among 3 people\n             ●●●●  ●●●●  ●●●●     → 4 each\n\n  Grouping:  how many groups of 3 fit into 12?\n             ●●● ●●● ●●● ●●●      → 4 groups\n\nSame answer, two different pictures. Keep both.",
        analogy:
          "Sharing is dealing cards round a table until they run out. Grouping is stacking them in piles of a fixed size and counting the piles.",
      },
      {
        id: "a-ma-op-long-division",
        title: "Long division, one column at a time",
        explain:
          "Work from the left. At each digit ask how many times the divisor fits, write that above, and carry what is left over into the next digit.",
        why: "Working left to right is what makes it possible to divide numbers of any length without holding the whole thing in your head. Each step is a single small question about a single small number.",
        example:
          "        1 2 4  r 3\n      ┌────────────\n    7 │ 8 7 1\n\n  8 ÷ 7 = 1 remainder 1   → write 1, carry the 1 to make 17\n  17 ÷ 7 = 2 remainder 3  → write 2, carry the 3 to make 31\n  31 ÷ 7 = 4 remainder 3  → write 4, remainder 3\n\n  871 ÷ 7 = 124 remainder 3\n\n  Check:  7 × 124 = 868,  and 868 + 3 = 871  ✓",
        mistake:
          "Starting from the right, as in addition. Division is the one written operation that goes left to right, because the largest place has to be settled first.",
        drill: {
          skill: "L0-N2.3",
          count: 3,
          intro:
            "Three divisions. Read each one carefully. Some want the quotient and some are set in a context where the remainder changes the answer.",
        },
      },
      {
        id: "a-ma-op-remainder",
        title: "The remainder, and what the question does with it",
        explain:
          "The quotient is how many times the divisor went in. The remainder is what was left over. What you do with the remainder is not a mathematical decision. It is a reading decision, and the question makes it.",
        why: "This is where a correct division becomes a wrong answer. 100 ÷ 12 = 8 remainder 4 every time. Whether the answer is 8, 9, or 8 and a third depends on whether the question asked for full crates, crates needed, or an exact share.",
        table: {
          caption: "100 eggs, crates of 12. One division, four answers.",
          headers: ["The question", "The answer", "Why"],
          rows: [
            ["How many FULL crates?", "8", "The 4 left over do not fill a crate"],
            ["How many crates are NEEDED?", "9", "The last 4 still need a crate"],
            ["How many eggs are left over?", "4", "The remainder itself"],
            ["Share 100 eggs among 12 people equally", "8 1/3 each", "The remainder is shared too"],
          ],
          note: "Same arithmetic in every row. The reading is the whole difference.",
        },
        mistake:
          "Rounding the quotient out of habit. Neither rounding up nor rounding down is the default. The wording decides, and it is usually the phrase most easily skimmed past.",
        practice: {
          prompt:
            "A school hires buses for 250 students. Each bus holds 45. How many buses are needed, and what is the remainder telling you?",
          answer:
            "250 ÷ 45 = 5 remainder 25, so 6 buses are needed. The remainder of 25 is the students who would be left behind by five buses, and they still have to travel, so the answer rounds up even though 25 is less than a full bus.",
        },
      },
      {
        id: "a-ma-op-divide-by-ten",
        title: "Dividing by 10, 100 and 1,000",
        explain:
          "Dividing by 10 moves every digit one column to the RIGHT. 430 ÷ 10 = 43. When there is nothing left in the whole number columns, the digits move past the decimal point, 43 ÷ 10 = 4.3.",
        why: "'Take a zero off' works only when there is a zero to take. 43 ÷ 10 has no zero to remove, and the movement description handles it without any special case, which is exactly why it is the version worth learning.",
        example:
          "   4,300 ÷ 10  =  430\n     430 ÷ 10  =   43\n      43 ÷ 10  =    4.3\n     4.3 ÷ 10  =    0.43\n\nOne rule, four cases, no exceptions. 'Take a zero off'\nhandles the first two and fails on the last two.",
        mistake:
          "Thinking division always makes a number smaller. Dividing by a number less than 1 makes it larger, since 3 ÷ 0.5 = 6, which is exactly the grouping picture from earlier in this lesson.",
      },
      {
        id: "a-ma-op-divide-zero",
        title: "Why you cannot divide by zero",
        explain:
          "12 ÷ 0 asks 'how many zeros fit into 12?'. No number of zeros ever adds up to 12, so there is no answer. Not a very large one, and not infinity. The question has no answer at all.",
        why: "It matters far beyond arithmetic. In Month 6 an algebraic fraction is undefined wherever its denominator is zero, and in Month 8 a vertical line has no gradient for the same reason. Every one of those is this fact.",
        example:
          "  12 ÷ 4 = 3   because  4 × 3 = 12\n  12 ÷ 2 = 6   because  2 × 6 = 12\n  12 ÷ 0 = ?   because  0 × ? = 12\n\nThere is no number that multiplies by 0 to give 12,\nbecause anything times zero is zero. So there is no answer.",
        mistake:
          "Writing 12 ÷ 0 = 0. Zero is the answer to 0 ÷ 12, which is a different and perfectly reasonable question.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ma-l20-bodmas",
    moduleId: "ma-m2-operations",
    sectionId: SECTION_ID,
    order: 4,
    title: "BODMAS: The Order of Operations",
    subtitle: "Why 2 + 3 × 4 is 14 and not 20",
    estimatedMinutes: 14,
    intro:
      "Two people type 2 + 3 × 4 into a calculator. One gets 20 and one gets 14. Both pressed the right keys. This lesson is about which one is doing mathematics, and why the answer is not a matter of opinion.",

    atoms: [
      {
        id: "a-ma-op-why-order",
        title: "Why an order is needed at all",
        explain:
          "Without an agreed order, 2 + 3 × 4 has two defensible answers and mathematics stops being a language. The convention exists so that an expression written in Lagos means the same thing when it is read in Lisbon.",
        why: "It is not arbitrary in the way a spelling convention is arbitrary. 3 × 4 is a single quantity, being three lots of four, and the expression 2 + 3 × 4 means 'two, plus that quantity'. The order rule is a description of how the expression is built, not a rule imposed on top of it.",
        example:
          "  Left to right:   2 + 3 = 5,  then 5 × 4 = 20\n  By convention:   3 × 4 = 12, then 2 + 12 = 14\n\n  Which is right? 14, universally, and for a reason:\n\n  'A bottle of water costs ₦2. I buy 3 crates of 4 bottles.'\n  The 3 × 4 belongs together; it is the number of bottles.",
        analogy:
          "In English, 'the big red bus' has a fixed order. 'The red big bus' is understandable and wrong. Mathematical notation has the same kind of grammar, and BODMAS is one of its rules.",
      },
      {
        id: "a-ma-op-bodmas",
        title: "BODMAS, rank by rank",
        explain:
          "Brackets first. Then Orders, powers and roots. Then Division and Multiplication together, left to right. Then Addition and Subtraction together, left to right.",
        why: "The most commonly taught version of this is wrong in one specific way: it presents six steps in a fixed order, so students do all division before any multiplication. DM is ONE rank worked left to right, and so is AS. That difference changes answers.",
        table: {
          caption: "Four ranks, not six steps.",
          headers: ["Rank", "Contains", "Worked"],
          rows: [
            ["1", "Brackets", "Innermost first"],
            ["2", "Orders, powers and roots", "Left to right"],
            ["3", "Division and Multiplication", "Left to right, equal rank"],
            ["4", "Addition and Subtraction", "Left to right, equal rank"],
          ],
          note: "Ranks 3 and 4 each contain two operations of EQUAL standing. Neither one goes first.",
        },
        example:
          "  24 ÷ 4 × 3\n\n  Wrong (all M before all D):  4 × 3 = 12,  24 ÷ 12 = 2\n  Right (left to right):       24 ÷ 4 = 6,   6 × 3 = 18\n\n  Answer: 18.\n\n\n  10 − 4 + 3\n\n  Wrong (all A before all S):  4 + 3 = 7,  10 − 7 = 3\n  Right (left to right):       10 − 4 = 6,  6 + 3 = 9\n\n  Answer: 9.",
        mistake:
          "Treating BODMAS as six sequential steps. That single misunderstanding produces wrong answers on exactly the questions examiners set to test it.",
        drill: {
          skill: "L0-N2.4",
          count: 3,
          intro:
            "Three expressions. Work one rank at a time, and remember that division and multiplication share a rank, as do addition and subtraction.",
        },
      },
      {
        id: "a-ma-op-brackets",
        title: "Brackets say 'this part first'",
        explain:
          "Brackets override everything. Whatever is inside is worked out first and treated as a single quantity. When brackets are nested, the innermost pair is done first.",
        why: "Brackets are how you make an expression say what you mean when the default order would say something else. If you want the addition first, a bracket is the only way to ask for it, and in algebra, writing the bracket correctly is most of the battle.",
        example:
          "  2 + 3 × 4      = 14      ← multiplication first, by default\n  (2 + 3) × 4    = 20      ← the bracket forces the addition first\n\n  Nested:\n\n  2 × [3 + (8 − 6)²]\n  = 2 × [3 + 2²]          ← innermost bracket\n  = 2 × [3 + 4]           ← the order (power)\n  = 2 × 7                 ← the outer bracket\n  = 14",
        mistake:
          "Multiplying only the first term inside a bracket. 3(x + 2) is 3x + 6 and not 3x + 2. The 3 multiplies everything the bracket contains, which is what a bracket means.",
      },
      {
        id: "a-ma-op-fraction-bar",
        title: "The fraction bar is an invisible bracket",
        explain:
          "A fraction bar groups everything above it and everything below it. (8 + 4)/(6 − 3) written on one line needs brackets; written as a fraction it does not, because the bar does the grouping.",
        why: "This is where marks are lost when working is transferred from a written page to a calculator. Typing 8 + 4 ÷ 6 − 3 gives a completely different answer from the fraction it was copied from, and the calculator is not at fault.",
        example:
          "  As a fraction:        8 + 4\n                        ─────   =  12/3  =  4\n                        6 − 3\n\n  Typed carelessly:  8 + 4 ÷ 6 − 3  =  8 + 0.667 − 3  =  5.667\n\n  Typed correctly:   (8 + 4) ÷ (6 − 3)  =  4",
        practice: {
          prompt:
            "The quadratic formula has a fraction bar under the whole of −b ± √(b² − 4ac). What must you type into a calculator to evaluate it correctly?",
          answer:
            "Brackets around the entire numerator and around the entire denominator: (−b + √(b² − 4ac)) ÷ (2a). Without them the calculator divides only the last term by 2 and then by a, which is the commonest source of wrong roots in Month 7.",
        },
      },
      {
        id: "a-ma-op-order-recap",
        title: "Checking your order without redoing the sum",
        explain:
          "After evaluating a mixed expression, glance back and confirm that the multiplication or division you did first really was the leftmost one at its rank, and that every bracket was closed before you used its value.",
        why: "Order errors produce answers that are wrong but plausible, such as 20 instead of 14, so an estimate does not catch them the way it catches a place value slip. A deliberate ten second check of the order is the only thing that does.",
        example:
          "  Evaluate  5 + 2 × 3² − (10 ÷ 5)\n\n  Brackets:      (10 ÷ 5) = 2\n  Orders:        3² = 9\n  D and M:       2 × 9 = 18\n  A and S:       5 + 18 − 2 = 21\n\n  Check: was the power done before the multiplication? Yes.\n         Was the bracket finished before it was used? Yes.\n         Was the last rank worked left to right? Yes.",
        practice: {
          prompt: "Evaluate 36 ÷ 6 × 2 + 4² − 10, showing which rank you are on at each step.",
          answer:
            "Orders: 4² = 16. D and M left to right: 36 ÷ 6 = 6, then 6 × 2 = 12. A and S left to right: 12 + 16 = 28, then 28 − 10 = 18. The answer is 18. Doing 6 × 2 before 36 ÷ 6 would give 3 + 16 − 10 = 9, which is the trap.",
        },
      },
    ],

    task: {
      title: "Before you move on",
      intro:
        "Take a calculator. The one on your phone is fine. Try these four, predicting each answer before you press equals:",
      prompts: [
        "2 + 3 × 4, then (2 + 3) × 4. Confirm the bracket changes the answer.",
        "24 ÷ 4 × 3. If your calculator says 2, it is working right to left and you should not trust it on a paper.",
        "10 − 4 + 3. Same test for addition and subtraction.",
        "Type the fraction (8 + 4)/(6 − 3) without brackets, then with them, and compare.",
      ],
      closing:
        "Knowing how your own calculator behaves is part of exam preparation. A scientific calculator follows BODMAS; many phone calculators do not, and finding that out during a mock is far better than finding it out during the real paper.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
