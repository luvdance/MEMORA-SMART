/**
 * ASSESSMENTS · FORMULAS & CORE FUNCTIONS
 *
 * SERVER ONLY. See m1-data-foundations.js for the contract and writing style.
 * Never import from anything under src/.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "l8-your-first-formula": {
    lessonId: "l8-your-first-formula",
    passMark: 70,
    questions: [
      {
        id: "q8-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-equals-sign",
        prompt: "You type SUM(B2:B5) into a cell without an equals sign. What happens?",
        options: [
          { id: "a", text: "Excel adds up the range anyway" },
          { id: "b", text: "The cell displays the text SUM(B2:B5), left-aligned" },
          { id: "c", text: "Excel shows #NAME?" },
          { id: "d", text: "Excel refuses to accept the entry" },
        ],
        correct: "b",
        explanation:
          "Without the equals sign Excel has no reason to calculate, so it stores exactly what you typed as text. Text sits on the left of the cell, which is the giveaway.",
        whyWrong: {
          a: "The equals sign is the only thing that tells Excel to calculate. Without it there is no formula, just a sentence.",
          c: "#NAME? appears when Excel tries to calculate and does not recognise something. Here it never tries.",
          d: "Excel accepts it happily. That is what makes this mistake easy to miss.",
        },
      },
      {
        id: "q8-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-operators",
        prompt: "Which symbol multiplies in Excel?",
        options: [
          { id: "a", text: "x" },
          { id: "b", text: "*" },
          { id: "c", text: "X" },
          { id: "d", text: "times" },
        ],
        correct: "b",
        explanation: "The asterisk. =200*3 returns 600.",
        whyWrong: {
          a: "Excel reads a lowercase x as a name it does not know, and returns #NAME?.",
          c: "The same problem. Capitalisation does not help.",
          d: "There is no times operator or function in Excel.",
        },
      },
      {
        id: "q8-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-order-of-operations",
        prompt: "What does =2+3*4 return?",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "14" },
          { id: "c", text: "24" },
          { id: "d", text: "9" },
        ],
        correct: "b",
        explanation:
          "Multiplication runs before addition, so it is 2 + 12, which is 14. Brackets would change that: =(2+3)*4 gives 20.",
        whyWrong: {
          a: "That is the answer if the addition happened first, which needs brackets.",
          c: "That would be (2+4)*4. Neither operation groups that way here.",
          d: "That would be 2+3+4. There is no addition of the 4 on its own.",
        },
      },
      {
        id: "q8-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cell-refs-in-formulas",
        prompt:
          "You wrote =1200*500 in a total column instead of =B2*C2. The price later changes to 1350. What happens to your total?",
        options: [
          { id: "a", text: "It updates automatically" },
          { id: "b", text: "It stays at 600,000 and is now silently wrong" },
          { id: "c", text: "Excel shows #REF!" },
          { id: "d", text: "Excel warns you that the price changed" },
        ],
        correct: "b",
        explanation:
          "The formula never referred to the price cell, so nothing connects them. The total keeps showing the old figure and nothing on screen tells you it is stale.",
        whyWrong: {
          a: "Only formulas that point at cells update. This one contains two fixed numbers.",
          c: "#REF! appears when a referenced cell is deleted. There was no reference here to break.",
          d: "Excel has no way to know that 1200 in your formula was meant to be the price.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l9-core-functions": {
    lessonId: "l9-core-functions",
    passMark: 70,
    questions: [
      {
        id: "q9-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-sum",
        prompt: "Column A holds four product names and column B holds their prices. What does =SUM(A2:A5) return?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "4" },
          { id: "c", text: "#VALUE!" },
          { id: "d", text: "The names joined together" },
        ],
        correct: "a",
        explanation:
          "SUM adds numbers and quietly skips text. There are no numbers in that range, so the total is 0.",
        whyWrong: {
          b: "That is what COUNTA would give you. SUM adds values, it does not count cells.",
          c: "SUM does not error on text, it ignores it. That is precisely why a wrong range returns 0 instead of complaining.",
          d: "Joining text is what & or CONCATENATE do.",
        },
      },
      {
        id: "q9-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-count-counta",
        prompt:
          "A2:A5 holds four product names. Which function tells you there are four products?",
        options: [
          { id: "a", text: "=COUNT(A2:A5)" },
          { id: "b", text: "=COUNTA(A2:A5)" },
          { id: "c", text: "=SUM(A2:A5)" },
          { id: "d", text: "=LEN(A2:A5)" },
        ],
        correct: "b",
        explanation:
          "COUNTA counts cells that are not empty, whatever they contain. Names are text, so COUNTA is the one that works.",
        whyWrong: {
          a: "COUNT only counts numbers. Run it on a column of names and you get 0.",
          c: "SUM adds numbers. There are none here, so you get 0.",
          d: "LEN measures how many characters are in one piece of text, not how many cells are filled.",
        },
      },
      {
        id: "q9-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-average",
        prompt:
          "B2:B5 holds 1200, 800, 450 and 150. What does =AVERAGE(B2:B5) return?",
        options: [
          { id: "a", text: "2600" },
          { id: "b", text: "650" },
          { id: "c", text: "4" },
          { id: "d", text: "1200" },
        ],
        correct: "b",
        explanation: "2600 divided by 4 is 650.",
        whyWrong: {
          a: "That is the total, which is what SUM gives you.",
          c: "That is how many values there are, which is COUNT.",
          d: "That is the largest value, which is MAX.",
        },
      },
      {
        id: "q9-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-what-is-a-function",
        prompt:
          "You wrote =B2+B3+B4+B5 rather than =SUM(B2:B5). A colleague later inserts a new product as row 4. What goes wrong?",
        options: [
          { id: "a", text: "Nothing, the two are identical" },
          { id: "b", text: "The new row is not included, and the total is quietly short" },
          { id: "c", text: "Excel shows #REF!" },
          { id: "d", text: "The formula doubles the new row" },
        ],
        correct: "b",
        explanation:
          "Adding cells one by one names each cell explicitly. A row inserted inside a SUM range is picked up automatically; one inserted into a chain of additions is not.",
        whyWrong: {
          a: "They give the same answer today and behave differently the moment the sheet changes, which is the whole point.",
          c: "#REF! happens when a referenced cell is deleted, not when a row is inserted.",
          d: "Nothing is doubled. The problem is an omission, not a duplication.",
        },
      },
      {
        id: "q9-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-min-max",
        prompt: "Which function finds the highest quantity you stock?",
        options: [
          { id: "a", text: "MIN" },
          { id: "b", text: "MAX" },
          { id: "c", text: "COUNT" },
          { id: "d", text: "SUM" },
        ],
        correct: "b",
        explanation: "MAX returns the largest number in a range. MIN returns the smallest.",
        whyWrong: {
          a: "MIN gives you the smallest, which is the opposite.",
          c: "COUNT tells you how many numbers there are, not how big they are.",
          d: "SUM adds them all together.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "l10-if-and-errors": {
    lessonId: "l10-if-and-errors",
    passMark: 70,
    questions: [
      {
        id: "q10-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-if",
        prompt: 'What does =IF(C5<100,"Reorder","OK") show when C5 holds 90?',
        options: [
          { id: "a", text: "OK" },
          { id: "b", text: "Reorder" },
          { id: "c", text: "90" },
          { id: "d", text: "TRUE" },
        ],
        correct: "b",
        explanation:
          "90 is under 100, so the question is true and IF returns the first of the two answers.",
        whyWrong: {
          a: "OK is the false answer. It appears when the quantity is 100 or more.",
          c: "IF returns one of the two results you gave it, not the value it tested.",
          d: "IF returns TRUE only if you do not supply the two outcomes yourself.",
        },
      },
      {
        id: "q10-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-error-codes",
        prompt: "A cell shows #DIV/0!. What has happened?",
        options: [
          { id: "a", text: "A function name is misspelled" },
          { id: "b", text: "A formula divided by zero or by an empty cell" },
          { id: "c", text: "A referenced row was deleted" },
          { id: "d", text: "Text was used in arithmetic" },
        ],
        correct: "b",
        explanation:
          "An empty cell counts as zero in a division, which is why this often appears before the data has been filled in.",
        whyWrong: {
          a: "A misspelled name gives #NAME?.",
          c: "A deleted reference gives #REF!.",
          d: "Arithmetic on text gives #VALUE!.",
        },
      },
      {
        id: "q10-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-error-codes",
        prompt: "You typed =5 x 3 into a cell. What does Excel show?",
        options: [
          { id: "a", text: "15" },
          { id: "b", text: "#NAME?" },
          { id: "c", text: "#VALUE!" },
          { id: "d", text: "#DIV/0!" },
        ],
        correct: "b",
        explanation:
          "Excel reads x as a name it has never heard of, so it returns #NAME?. Multiplication is *.",
        whyWrong: {
          a: "It would be 15 with an asterisk. With x, Excel cannot calculate at all.",
          c: "#VALUE! is for the wrong kind of value, such as adding text to a number. Here the problem is an unrecognised name.",
          d: "Nothing was divided.",
        },
      },
      {
        id: "q10-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-formula-vs-display",
        prompt:
          "Two cells both display 600000. How do you tell which one will still be correct after the price changes?",
        options: [
          { id: "a", text: "They are identical, so both will" },
          { id: "b", text: "Click each one and read the formula bar: only the calculated one updates" },
          { id: "c", text: "Check the number formatting" },
          { id: "d", text: "Look at which one is bold" },
        ],
        correct: "b",
        explanation:
          "The formula bar shows what a cell holds rather than what it shows. A typed number never changes; a formula recalculates.",
        whyWrong: {
          a: "They display the same thing and behave completely differently, which is exactly the trap.",
          c: "Formatting changes appearance only. It says nothing about whether the value was calculated.",
          d: "Styling carries no information about how a value was produced.",
        },
      },
      {
        id: "q10-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-if",
        prompt:
          "Your Per Day column shows #DIV/0! for every new customer who has no days recorded yet. What is the tidy fix?",
        options: [
          { id: "a", text: "Delete those rows" },
          { id: "b", text: 'Wrap it: =IF(B2=0,"No data",A2/B2)' },
          { id: "c", text: "Format the cells as text" },
          { id: "d", text: "Ignore it, the error is harmless" },
        ],
        correct: "b",
        explanation:
          "IF checks for the zero first and shows a readable message instead of doing the impossible division.",
        whyWrong: {
          a: "Those are real customers. Deleting data to hide an error loses the data.",
          c: "Formatting as text would stop the calculation working at all, for every row.",
          d: "It is not harmless. A column of errors breaks any SUM or AVERAGE that includes it.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
