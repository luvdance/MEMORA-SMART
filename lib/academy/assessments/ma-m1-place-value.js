/**
 * ASSESSMENTS · MATHEMATICS · MONTH 1 · MODULE 2 · PLACE VALUE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The distractors here are the real errors, not decorative wrong answers:
 * giving the digit when the value was asked for, losing a zero when writing
 * from words, being impressed by a run of nines, and rounding to the wrong
 * column. Each one is a mistake a real student makes for a real reason, and
 * the feedback names that reason.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l13-digits": {
    lessonId: "ma-l13-digits",
    passMark: 70,
    questions: [
      {
        id: "maq13-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-place-value",
        prompt: "In the number 48,367, what is the VALUE of the digit 8?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "800" },
          { id: "c", text: "8,000" },
          { id: "d", text: "Thousands" },
        ],
        correct: "c",
        explanation:
          "The 8 sits in the thousands column, so its value is 8 × 1,000 = 8,000.",
        whyWrong: {
          a: "That is the DIGIT. A digit is a symbol; its value is what that symbol is worth where it stands, and here it stands in the thousands column.",
          b: "800 would be the value if the 8 were in the hundreds column. Count the columns from the right: units, tens, hundreds, thousands.",
          d: "Thousands is the PLACE, not the value. The place is the name of the column; the value is the number.",
        },
      },
      {
        id: "maq13-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-zero",
        prompt: "Write 'four thousand and six' in figures.",
        options: [
          { id: "a", text: "406" },
          { id: "b", text: "4,006" },
          { id: "c", text: "4,600" },
          { id: "d", text: "46" },
        ],
        correct: "b",
        explanation:
          "Four thousand puts 4 in the thousands column. No hundreds and no tens were mentioned, so both of those columns are zero, and the 6 goes in the units.",
        whyWrong: {
          a: "This writes only the parts that were said out loud. Without a zero holding the tens column open, the 4 slides into the hundreds and the number becomes ten times too small.",
          c: "This reads 'and six' as 'six hundred'. The 6 is in the units — nothing in the wording put it in the hundreds.",
          d: "Both place-holding zeros have been dropped, leaving a number nearly a hundred times too small.",
        },
      },
      {
        id: "maq13-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-columns",
        prompt: "Why does multiplying a whole number by 10 put a zero on the end of it?",
        options: [
          { id: "a", text: "It is a rule that has to be memorised" },
          {
            id: "b",
            text: "Every digit moves one column to the left, and a zero holds the now-empty units column open",
          },
          { id: "c", text: "Because 10 contains a zero" },
          { id: "d", text: "Because multiplication always adds digits" },
        ],
        correct: "b",
        explanation:
          "Each column is worth ten times the one to its right, so multiplying by ten shifts every digit one column left. The units column is then empty and needs a zero to keep the other digits in place.",
        whyWrong: {
          a: "It follows from what the columns are worth, which is why it also predicts what happens when you multiply by 100 or divide by 10.",
          c: "Multiplying by 20 also adds a zero to the end of the doubled number, and 20 contains a zero for the same underlying reason rather than as a cause.",
          d: "Multiplying by 1 adds no digits, and multiplying by 0.1 removes one. It is the value of the multiplier that decides.",
        },
      },
      {
        id: "maq13-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-expanded",
        prompt: "Which is 60,403 written in expanded form?",
        options: [
          { id: "a", text: "6,000 + 400 + 3" },
          { id: "b", text: "60,000 + 400 + 3" },
          { id: "c", text: "60,000 + 4,000 + 30" },
          { id: "d", text: "6 + 0 + 4 + 0 + 3" },
        ],
        correct: "b",
        explanation:
          "The 6 is in the ten-thousands column (60,000), the 4 in the hundreds (400) and the 3 in the units. The thousands and tens columns are zero and contribute nothing to the sum.",
        whyWrong: {
          a: "This puts the 6 in the thousands column. Count again: 60,403 has five digits, so the leading digit is in the ten thousands.",
          c: "This puts the 4 in the thousands and the 3 in the tens — both one column too far left.",
          d: "This lists the digits rather than their values. Expanded form is about what each digit is WORTH.",
        },
      },
      {
        id: "maq13-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-digit",
        prompt: "How many different digits are there in the number system we use?",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "10" },
          { id: "c", text: "It depends on the size of the number" },
          { id: "d", text: "Infinitely many" },
        ],
        correct: "b",
        explanation:
          "Ten: 0 to 9. Every number of any size is written with only those ten symbols, and what makes that possible is that position carries the rest of the information.",
        whyWrong: {
          a: "This forgets zero, which is the most important one — it is what holds columns open and what made this system beat Roman numerals.",
          c: "The number of digits used goes up with size, but the number of different SYMBOLS available never does.",
          d: "There are infinitely many numbers, which is exactly why a finite set of symbols plus place value is such a useful invention.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l14-reading-numbers": {
    lessonId: "ma-l14-reading-numbers",
    passMark: 70,
    questions: [
      {
        id: "maq14-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-blocks",
        prompt: "In the number 4,073,512, what do the commas mark?",
        options: [
          { id: "a", text: "Where to pause when reading aloud" },
          { id: "b", text: "The boundaries between blocks of three: millions, thousands, units" },
          { id: "c", text: "Decimal points in some countries" },
          { id: "d", text: "Nothing — they are optional decoration" },
        ],
        correct: "b",
        explanation:
          "Numbers are grouped in threes from the units end, and each group has a name. The commas mark those groups, which is what makes a long number readable at a glance.",
        whyWrong: {
          a: "You do pause there when reading aloud, but only because each block is a named unit. The pause is the consequence, not the purpose.",
          c: "Some countries do use a comma as a decimal separator, which is precisely why it matters to know what this one is doing here.",
          d: "Remove them from 4073512 and the number becomes far harder to read correctly at speed — which is a practical cost, not a cosmetic one.",
        },
      },
      {
        id: "maq14-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-figures",
        prompt: "Write 'four hundred thousand and twenty' in figures.",
        options: [
          { id: "a", text: "400,020" },
          { id: "b", text: "40,020" },
          { id: "c", text: "400,200" },
          { id: "d", text: "420,000" },
        ],
        correct: "a",
        explanation:
          "The thousands block is 'four hundred' → 400. The units block is 'and twenty' → 020. Written as blocks of three: 400,020.",
        whyWrong: {
          b: "This has lost a column from the thousands block. 'Four hundred thousand' needs three digits in that block: 400, not 40.",
          c: "This reads 'and twenty' as 'two hundred'. Twenty belongs in the tens column.",
          d: "This merges the twenty into the thousands block. The twenty is twenty, not twenty thousand — there is no 'thousand' after it.",
        },
      },
      {
        id: "maq14-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-words",
        prompt: "Which is 3,500 written correctly in words?",
        options: [
          { id: "a", text: "Three thousand and fifty" },
          { id: "b", text: "Three thousand, five hundred" },
          { id: "c", text: "Thirty-five hundred thousand" },
          { id: "d", text: "Three hundred and fifty" },
        ],
        correct: "b",
        explanation:
          "The thousands block is 3 and the units block is 500, so it reads 'three thousand, five hundred'.",
        whyWrong: {
          a: "Three thousand and fifty is 3,050 — the 5 has been put in the tens column rather than the hundreds.",
          c: "'Thirty-five hundred' is heard in speech but is not how a number is written in words in an exam, and 'hundred thousand' on the end makes it a different number entirely.",
          d: "Three hundred and fifty is 350, which is ten times smaller.",
        },
      },
      {
        id: "maq14-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pv-money",
        prompt: "How many times larger is ₦12,500,000 than ₦125,000?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "100" },
          { id: "c", text: "1,000" },
          { id: "d", text: "12,500" },
        ],
        correct: "b",
        explanation:
          "125,000 is 125 thousand and 12,500,000 is 12,500 thousand. 12,500 ÷ 125 = 100.",
        whyWrong: {
          a: "Ten times 125,000 is 1,250,000 — one comma short. Count the digits: the two numbers differ by two columns, not one.",
          c: "A thousand times 125,000 would be 125,000,000. That is one block further again.",
          d: "12,500 is the figure in thousands, not the ratio between the two amounts.",
        },
      },
      {
        id: "maq14-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-standard-preview",
        prompt: "40,000 written as 4 multiplied by a power of ten is:",
        options: [
          { id: "a", text: "4 × 10³" },
          { id: "b", text: "4 × 10⁴" },
          { id: "c", text: "4 × 10⁵" },
          { id: "d", text: "40 × 10³" },
        ],
        correct: "b",
        explanation:
          "40,000 has four zeros, which means the 4 sits four columns to the left of the units place. So it is 4 × 10⁴.",
        whyWrong: {
          a: "4 × 10³ is 4,000 — one column short. Count the zeros.",
          c: "4 × 10⁵ is 400,000 — one column too many.",
          d: "This is equal to 40,000, but standard form requires the first number to be between 1 and 10, and 40 is not. That rule arrives properly in Month 4.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l15-comparing": {
    lessonId: "ma-l15-comparing",
    passMark: 70,
    questions: [
      {
        id: "maq15-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-length-first",
        prompt: "Which is larger, 9,999 or 10,000, and how can you tell fastest?",
        options: [
          { id: "a", text: "9,999, because it has more large digits" },
          { id: "b", text: "10,000, because it has more digits" },
          { id: "c", text: "They are about the same" },
          { id: "d", text: "You have to compare every column to be sure" },
        ],
        correct: "b",
        explanation:
          "A five-digit whole number is always larger than a four-digit one. The largest four-digit number there is, 9,999, is still one less than the smallest five-digit number.",
        whyWrong: {
          a: "Large digits in small columns cannot beat an extra column. Nine thousands is still less than ten thousands.",
          c: "They differ by 1, which is small in absolute terms — but the question asks which is larger, and one of them is.",
          d: "Column-by-column comparison is for numbers of the SAME length. Different lengths are settled by counting digits.",
        },
      },
      {
        id: "maq15-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-compare-left",
        prompt:
          "Comparing 90,450 and 89,999: which column decides it, and why do the nines not matter?",
        options: [
          {
            id: "a",
            text: "The ten-thousands column. 9 beats 8, and the most the remaining nines can add is 9,999 — less than one ten thousand",
          },
          { id: "b", text: "The units column, because you compare from the right" },
          { id: "c", text: "The nines do matter; 89,999 is larger" },
          { id: "d", text: "Neither — you must add both numbers up to compare them" },
        ],
        correct: "a",
        explanation:
          "Compare from the left. The first column where they differ is the ten thousands: 9 against 8. Once one number is ahead there, nothing to the right can close a gap of 10,000.",
        whyWrong: {
          b: "Comparing from the right is how you ADD. To compare, start at the most valuable column, which is on the left.",
          c: "This is the error the question is about. A run of nines looks impressive and is worth less than one unit of the column above it.",
          d: "The numbers are already written as totals. Comparing them column by column is the point.",
        },
      },
      {
        id: "maq15-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-symbols",
        prompt: "Which statement is true?",
        options: [
          { id: "a", text: "12 < 9" },
          { id: "b", text: "9 > 12" },
          { id: "c", text: "9 < 12" },
          { id: "d", text: "9 = 12" },
        ],
        correct: "c",
        explanation:
          "Read it left to right: 'nine is less than twelve'. The small end of the symbol points at the smaller number.",
        whyWrong: {
          a: "This reads '12 is less than 9', which is false.",
          b: "This reads '9 is greater than 12', which is false. The symbol is pointing the wrong way.",
          d: "The equals sign claims the two have the same value, and they do not.",
        },
      },
      {
        id: "maq15-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-ordering",
        prompt: "Put 4,502  4,052  4,520  4,025 in ASCENDING order.",
        options: [
          { id: "a", text: "4,520  4,502  4,052  4,025" },
          { id: "b", text: "4,025  4,052  4,502  4,520" },
          { id: "c", text: "4,025  4,502  4,052  4,520" },
          { id: "d", text: "4,052  4,025  4,520  4,502" },
        ],
        correct: "b",
        explanation:
          "All four start with 4, so compare the next column: two have 0 and two have 5. Within each pair, the next column splits them.",
        whyWrong: {
          a: "That is the right ordering written backwards. Ascending means smallest first — an ordering that is perfectly correct and the wrong way round still scores nothing.",
          c: "4,502 has been placed before 4,052, but 0 in the hundreds column is smaller than 5.",
          d: "The pairs have been split on the wrong column. Compare left to right, one column at a time.",
        },
      },
      {
        id: "maq15-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-numberline",
        prompt: "On a number line, what does a position further to the right always mean?",
        options: [
          { id: "a", text: "A larger number" },
          { id: "b", text: "A number with more digits" },
          { id: "c", text: "A positive number" },
          { id: "d", text: "A number further from zero" },
        ],
        correct: "a",
        explanation:
          "Further right means larger, always and everywhere on the line. That single rule keeps working for negatives, fractions and decimals, which is why the number line is worth having.",
        whyWrong: {
          b: "0.5 is to the right of 0 and has fewer digits than 1,000 — which is further right still. Digit count is not position.",
          c: "−2 is to the right of −9 and is still negative. Right means larger, not positive.",
          d: "−9 is further from zero than −2, and it sits further LEFT. Distance from zero is a different idea, and it arrives in Month 3.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l16-rounding": {
    lessonId: "ma-l16-rounding",
    passMark: 70,
    questions: [
      {
        id: "maq16-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-pv-deciding-digit",
        prompt: "Round 4,738 to the nearest thousand.",
        options: [
          { id: "a", text: "4,000" },
          { id: "b", text: "4,700" },
          { id: "c", text: "5,000" },
          { id: "d", text: "4,740" },
        ],
        correct: "c",
        explanation:
          "The thousands digit is 4 and the digit immediately to its right is 7. Seven is 5 or more, so round up: 5,000.",
        whyWrong: {
          a: "This rounds down. The deciding digit is 7, which is past halfway, so the number is nearer to 5,000 than to 4,000.",
          b: "This is 4,738 rounded to the nearest HUNDRED. Read which place the question names.",
          d: "This is rounded to the nearest ten. Same error, one column further out.",
        },
      },
      {
        id: "maq16-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-pv-deciding-digit",
        prompt:
          "A student rounds 4,738 in stages: 4,738 → 4,740 → 4,700 → 5,000. The final answer is right. Why is the method still wrong?",
        options: [
          { id: "a", text: "It is not wrong; the answer is correct" },
          {
            id: "b",
            text: "Chain rounding can push a number past where it belongs, and it gives the wrong answer for other numbers",
          },
          { id: "c", text: "It is too slow to use in an exam" },
          { id: "d", text: "Because you should always round down first" },
        ],
        correct: "b",
        explanation:
          "Take 4,449: rounding in stages gives 4,450 → 4,500 → 5,000, but rounded once to the nearest thousand it is 4,000. Chain rounding accumulates upward pushes that were never there. Round ONCE, from the original number.",
        whyWrong: {
          a: "It happens to be right here and is wrong for numbers like 4,449. A method that works sometimes is a method that will fail in the exam.",
          c: "Speed is a side issue. The problem is that the method is not reliable.",
          d: "There is no 'round down first' rule. There is only: find the place, look at one digit to its right, decide once.",
        },
      },
      {
        id: "maq16-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-nines",
        prompt: "Round 1,962 to the nearest hundred.",
        options: [
          { id: "a", text: "1,900" },
          { id: "b", text: "2,000" },
          { id: "c", text: "1,1000" },
          { id: "d", text: "1,960" },
        ],
        correct: "b",
        explanation:
          "The hundreds digit is 9 and the next digit is 6, so it rounds up. Nine hundreds plus one hundred is ten hundreds, which is a thousand, so it carries into the thousands column: 2,000.",
        whyWrong: {
          a: "This rounds down. The deciding digit is 6, which is 5 or more.",
          c: "Ten hundreds cannot sit in the hundreds column. It carries, exactly as it would in addition, and becomes one more thousand.",
          d: "This is rounded to the nearest ten rather than the nearest hundred.",
        },
      },
      {
        id: "maq16-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-pv-estimating",
        prompt:
          "A student estimates 483 × 19 as 10,000 and then calculates the exact answer as 917. What should they conclude?",
        options: [
          { id: "a", text: "The estimate was poor and should be ignored" },
          { id: "b", text: "The calculation is wrong, because 917 is nowhere near 10,000" },
          { id: "c", text: "Both are acceptable answers" },
          { id: "d", text: "They should average the two" },
        ],
        correct: "b",
        explanation:
          "That is what an estimate is for. 500 × 20 = 10,000 is a reliable indication of the size; 917 is out by a factor of ten, so the multiplication has gone wrong. The exact answer is 9,177.",
        whyWrong: {
          a: "The estimate is doing exactly its job — catching an error in the method that rechecking the arithmetic might miss.",
          c: "They differ by a factor of ten. One of them is wrong, and the estimate tells you which.",
          d: "Averaging a right answer with a wrong one produces a new wrong answer.",
        },
      },
      {
        id: "maq16-5",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-pv-between",
        prompt: "Why does 4,500 round up to 5,000 rather than down to 4,000?",
        options: [
          { id: "a", text: "Because it is nearer to 5,000" },
          {
            id: "b",
            text: "It is exactly halfway, and mathematics agrees by convention to round up so that everyone gets the same answer",
          },
          { id: "c", text: "Because 5 is a large digit" },
          { id: "d", text: "It does not; it rounds down to 4,000" },
        ],
        correct: "b",
        explanation:
          "4,500 is exactly 500 from both neighbours, so nearness cannot decide it. The rounding-up convention exists so that the answer is agreed rather than arbitrary.",
        whyWrong: {
          a: "It is exactly the same distance from both. That is precisely why a convention is needed.",
          c: "The size of the digit is the shortcut, not the reason. The reason is the distance to each neighbour.",
          d: "By the standard convention it rounds up. A candidate who rounds it down will disagree with the mark scheme.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
